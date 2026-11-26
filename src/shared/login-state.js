import {
  identitySampleKey,
  readIdentitySource,
  stableIdentitySamples,
} from './account-identity.js';

/**
 * 所有登录方式共用同一套证据。页面读取由内容脚本提供，账号是否匹配仍由身份闸门判断。
 * 地址跳转、点击 OAuth 按钮、余额和本地保存的用户资料都不能单独证明登录成功。
 */
export function classifyLoginState(page = {}, samples = []) {
  const result = (status, reason, detail, identity) => ({
    status,
    reason,
    detail,
    ...(identity ? { identity } : {}),
  });
  if (page.sameOrigin !== true)
    return result('pending', 'oauth_pending', 'OAuth 尚未返回本站，等待授权流程完成');
  if (page.secondFactor)
    return result('blocked', 'second_factor_pending', `登录后进入${page.secondFactor}步骤`);
  if (page.challenge)
    return result(
      'blocked',
      'challenge_pending',
      `${page.challenge.kind ?? '安全验证'}尚未完成，暂不确认登录成功`,
    );
  if (page.completionRequired)
    return result(
      'blocked',
      'account_completion_required',
      '授权后仍需完成注册、绑定或补充账号资料',
    );
  if (page.loginError)
    return result('failed', 'login_rejected', `站点返回登录失败：${page.loginError}`);

  const current = samples.at(-1);
  if (current?.identityConflict)
    return result(
      'failed',
      'identity_conflict',
      `当前登录身份证据冲突：${current.identityConflict}`,
      current,
    );
  if (page.loginForm)
    return result('pending', 'login_form_visible', '页面仍显示登录表单，尚未完成登录');
  if (
    identitySampleKey(samples.at(-2)) &&
    identitySampleKey(current) &&
    !stableIdentitySamples(samples.at(-2), current)
  )
    return result(
      'pending',
      'identity_unstable',
      '当前登录身份在连续读取中发生变化，暂不采用页面成功控件',
      current,
    );
  if (page.successIndicator)
    return result('authenticated', 'success_indicator', '命中可见的本站登录成功标志');
  if (page.logoutControl)
    return result(
      'authenticated',
      'logout_control',
      `页面显示可见的退出登录控件${page.logoutSource ? `（${page.logoutSource}）` : ''}`,
    );
  if (page.checkinControl)
    return result('authenticated', 'checkin_control', '页面显示本站配置的签到或已签到控件');
  if (
    ['api', 'visible'].includes(current?.source) &&
    stableIdentitySamples(samples.at(-2), current)
  )
    return result(
      'authenticated',
      current.source === 'api' ? 'stable_api_identity' : 'stable_page_identity',
      current.source === 'api'
        ? `当前用户接口${current.endpoint ? ` ${current.endpoint} ` : ''}连续两次返回一致的${current.userId ? `用户 ID ${current.userId}` : '完整登录标识'}`
        : `当前账号资料连续两次显示一致的${current.userId ? `用户 ID ${current.userId}` : '完整登录标识'}`,
      current,
    );
  if (identitySampleKey(current))
    return result(
      'pending',
      samples.length > 1 ? 'identity_unstable' : 'identity_verifying',
      samples.length > 1
        ? '当前登录身份尚未形成连续一致的有效样本'
        : '已读到当前账号身份，正在重新读取以确认会话稳定',
      current,
    );
  if (page.accountShellVisible)
    return result(
      'pending',
      'account_shell_unverified',
      `${page.accountShellSource ?? '当前账号区域'}已显示，正在核验当前会话和账号身份`,
    );
  if (page.loginEntry)
    return result('pending', 'login_entry_visible', '页面仍显示登录入口，等待本站更新登录状态');
  return result(
    'pending',
    'success_evidence_missing',
    '未取得可见登录成功控件或连续一致的当前用户身份',
  );
}

function identityProbePendingState(site, messages) {
  const source = readIdentitySource(site);
  if (!source?.endpoint) return null;
  let endpoints;
  try {
    const url = new URL(source.endpoint, site.loginUrl);
    endpoints = [
      `${url.origin}${url.pathname}`,
      ...(url.origin === new URL(site.loginUrl).origin ? [url.pathname] : []),
    ];
  } catch {
    return null;
  }
  const message = messages
    .filter(
      (text) =>
        typeof text === 'string' &&
        endpoints.some((endpoint) => text.startsWith(`身份接口 ${endpoint}（`)),
    )
    .at(-1);
  if (!message) return null;
  let reason;
  if (/没有可用的会话 Token/.test(message)) reason = 'session_token_missing';
  else if (/HTTP (?:401|403)\b/.test(message)) reason = 'session_probe_rejected';
  else if (/未返回有效的当前用户字段|用户资料解析失败/.test(message))
    reason = 'identity_response_unusable';
  else if (/HTTP |HTML|不是 JSON|请求失败|请求超时|响应发生跳转/.test(message))
    reason = 'identity_api_unavailable';
  return reason
    ? {
        status: 'pending',
        reason,
        detail: `${message}；等待当前会话或资料页身份核验`,
      }
    : null;
}

/** 每次核验都重新读取当前会话，不缓存用户身份，不把目标账号注入身份请求。 */
export class LoginStateResolver {
  constructor({
    readPage,
    readIdentity,
    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    now = () => Date.now(),
  }) {
    Object.assign(this, { readPage, readIdentity, sleep, now });
  }

  async wait(
    site,
    {
      timeoutMs = 8000,
      pollMs = 300,
      identityTimeoutMs = 1500,
      stopOnLoginForm = false,
      diagnostics,
      serverOnly = false,
    } = {},
  ) {
    const deadline = this.now() + Math.max(0, timeoutMs);
    let samples = [];
    let lastIdentityReason;
    let lastProbeState;
    let state;
    for (;;) {
      const page = this.readPage(site);
      state = classifyLoginState(page, samples);
      if (
        state.status !== 'pending' ||
        state.reason === 'oauth_pending' ||
        (stopOnLoginForm && state.reason === 'login_form_visible')
      )
        return state;
      if (typeof this.readIdentity === 'function' && !page.loginForm && this.now() < deadline) {
        let identity;
        const messages = [];
        try {
          identity = await this.readIdentity(site, {
            timeoutMs: Math.min(identityTimeoutMs, Math.max(1, deadline - this.now())),
            discover: true,
            serverOnly,
            diagnostics: {
              push: (message) => {
                messages.push(message);
                diagnostics?.push?.(message);
              },
            },
          });
        } catch {
          // Transport diagnostics belong to the shared identity reader and must never contain tokens.
        }
        if (identity?.identityConflict || identitySampleKey(identity)) {
          lastProbeState = null;
          samples = [...samples.slice(-1), identity];
          state = classifyLoginState(this.readPage(site), samples);
          if (['identity_verifying', 'identity_unstable'].includes(state.reason))
            lastIdentityReason = state;
          if (state.status !== 'pending' || state.reason === 'oauth_pending') return state;
        } else {
          // A failed re-read breaks continuity; an old sample cannot be reused as proof.
          samples = [];
          state = classifyLoginState(this.readPage(site));
          lastProbeState = identityProbePendingState(site, messages) ?? lastProbeState;
          if (state.status !== 'pending' || state.reason === 'oauth_pending') return state;
        }
      }
      if (this.now() >= deadline) {
        if (
          ['identity_verifying', 'identity_unstable'].includes(state.reason) ||
          lastIdentityReason
        )
          return {
            status: 'pending',
            reason: 'identity_unstable',
            detail: '核验等待结束，当前登录身份仍未形成连续一致的有效样本',
          };
        if (
          lastProbeState &&
          ['success_evidence_missing', 'account_shell_unverified'].includes(state.reason)
        )
          return {
            ...lastProbeState,
            detail:
              state.reason === 'account_shell_unverified'
                ? `${state.detail}；${lastProbeState.detail}`
                : lastProbeState.detail,
          };
        return state;
      }
      await this.sleep(Math.min(pollMs, Math.max(1, deadline - this.now())));
    }
  }
}

export function loginStateLog(state) {
  return `登录状态核验[${state.reason}]：${state.detail}`;
}
