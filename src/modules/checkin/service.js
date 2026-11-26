/** 签到执行后台：串行队列、任务、定时计划、身份闸门、取消与恢复。 */
import { bgAccountsState } from '../accounts/service.js';
import { bgSitesState, sanitizeLoginEntry } from '../sites/service.js';
import { bgLearningState } from '../learning/service.js';
import { bgProxiesState } from '../proxies/service.js';
import { bgRecordsState } from '../records/service.js';
import { bgSliderState } from '../slider/service.js';
import { bgSettingsState } from '../settings/service.js';
import { bgPlatformState } from '../../shared/background-platform.js';
import { bgEntryState } from '../../entries/background.js';
import { readIdentitySource } from '../../shared/account-identity.js';
import { withSiteIdentityRecipe } from '../../shared/site-login-recipes.js';

export const bgCheckinState = { store: {} };

function qe(e) {
  return typeof e == `object` && !!e && !Array.isArray(e);
}

function Je(e, t = 0, n = bgCheckinState.Re) {
  return typeof e == `number` && Number.isFinite(e) && e >= t && e <= n;
}

function Ye(e) {
  return Je(e, 0, 1);
}

function Xe(e) {
  return typeof e == `string` && e.trim().length > 0 && e.length <= bgCheckinState.Be;
}

function Ze(e) {
  return Xe(e) && !e.includes(`text=`);
}

function Qe(e) {
  let t = e.trim();
  return /^(?:https?:)?\/\//i.test(t) ? !0 : /(?:^|[\s,>+~])(?:[a-z0-9-]+\.)+[a-z]{2,}\//i.test(t);
}

function $e(e, t, n) {
  (e.scrollIntoView !== void 0 &&
    typeof e.scrollIntoView != `boolean` &&
    n.push(`${t}的 scrollIntoView 必须是布尔值`),
    e.scrollContainer !== void 0 &&
      (!Ze(e.scrollContainer) || e.scrollIntoView !== !0) &&
      n.push(`${t}的 scrollContainer 必须是启用滚动定位的 CSS 选择器`));
}

function et(e, t, n, r) {
  let i = e[t];
  typeof i != `string` || !i.trim()
    ? r.push(`${n}缺少 ${t}`)
    : i.length > bgCheckinState.Be
      ? r.push(`${n}的 ${t} 过长`)
      : Qe(i) && r.push(`${n}的 ${t} 不能包含跨站地址`);
}

function tt(e, t, n, r) {
  (!qe(e) || !Ye(e.rx) || !Ye(e.ry)) && r.push(`${n}的 ${t} 必须是 rx/ry 均在 0..1 的坐标`);
}

function nt(e, t, n) {
  (e.anchor !== void 0 && tt(e.anchor, `anchor`, t, n),
    e.gesture !== void 0 &&
      (typeof e.gesture != `string` || !bgCheckinState.Ge.has(e.gesture)) &&
      n.push(`${t}的 gesture 无效`),
    e.key !== void 0 &&
      (typeof e.key != `string` || !bgCheckinState.We.has(e.key)) &&
      n.push(`${t}的 key 只允许非打印功能键`));
}

function rt(e, t, n) {
  (e.control !== void 0 &&
    (typeof e.control != `string` || !bgCheckinState.Ke.has(e.control)) &&
    n.push(`${t}的 control 无效`),
    e.choice !== void 0 &&
      (!Number.isSafeInteger(e.choice) || e.choice < 0 || e.choice > bgCheckinState.He) &&
      n.push(`${t}的 choice 必须是 ${bgCheckinState.He} 以内的非负整数`),
    e.checked !== void 0 && typeof e.checked != `boolean` && n.push(`${t}的 checked 必须是布尔值`));
  let r = typeof e.control == `string` ? e.control : void 0;
  (e.choice !== void 0 &&
    r !== `select` &&
    n.push(`${t}的 choice 只能用于 control 为 select 的填写步骤`),
    e.checked !== void 0 &&
      r !== `checkbox` &&
      r !== `radio` &&
      n.push(`${t}的 checked 只能用于 control 为 checkbox/radio 的填写步骤`),
    r === `select` && e.choice === void 0 && n.push(`${t}的 select 步骤必须指定 choice`),
    (r === `checkbox` || r === `radio`) &&
      e.checked === void 0 &&
      n.push(`${t}的 ${r} 步骤必须指定 checked`));
}

function it(e, t) {
  try {
    return new URL(t, e.loginUrl).origin === new URL(e.loginUrl).origin;
  } catch {
    return !1;
  }
}

function at(e, t) {
  if (t === void 0) return [];
  if (!Array.isArray(t)) return [`工作流学习路线必须是字符串数组`];
  if (t.length > bgCheckinState.Ue) return [`工作流学习路线最多 ${bgCheckinState.Ue} 个页面`];
  let n = [];
  return (
    t.forEach((t, r) => {
      typeof t != `string` || !t.trim()
        ? n.push(`工作流学习路线第 ${r + 1} 项必须是非空地址`)
        : it(e, t) || n.push(`工作流学习路线第 ${r + 1} 项必须与登录站点同源`);
    }),
    n
  );
}

function ot(e, t, n) {
  if (t === void 0) return [];
  if (typeof t != `string` || !t.trim()) return [`工作流身份核验路径必须是非空字符串`];
  if (t.length > 500) return [`工作流身份核验路径过长`];
  if (!it(e, t)) return [`工作流身份核验路径必须与登录站点同源`];
  try {
    let r = new URL(t, e.loginUrl);
    if (
      r.username ||
      r.password ||
      r.search ||
      /(?:access_token|refresh_token|id_token|code|state|token|secret|password)=/i.test(r.hash)
    )
      return [`工作流身份核验路径不能包含查询参数或凭据`];
    if (!Array.isArray(n) || n.length === 0) return [`工作流身份核验路径必须位于学习路线中`];
    let i = `${r.pathname}${r.hash}`;
    return n
      .map((t) => {
        if (typeof t != `string` || !t.trim()) return;
        let n = new URL(t, e.loginUrl);
        if (n.origin === r.origin) return `${n.pathname}${n.hash}`;
      })
      .indexOf(i) >= 0
      ? []
      : [`工作流身份核验路径必须位于学习路线中`];
  } catch {
    return [`工作流身份核验路径必须位于学习路线中`];
  }
}

function st(e, t) {
  let n = [];
  if (!t || !Array.isArray(t.steps) || t.steps.length === 0) return [`工作流至少需要一个步骤`];
  (n.push(...at(e, t.route)), n.push(...ot(e, t.identityPath, t.route)));
  let r = 0,
    i = 0,
    a = (t, o, s, c) => {
      s > bgCheckinState.ze
        ? n.push(`${o}条件嵌套超过 ${bgCheckinState.ze} 层`)
        : ((r += t.length),
          !(r > bgCheckinState.Le) &&
            t.forEach((t, r) => {
              let l = `${o}${r + 1}`;
              if (!qe(t) || typeof t.type != `string`) n.push(`${l}格式无效`);
              else
                switch (t.type) {
                  case `if`: {
                    let e = t.condition;
                    (!qe(e) || typeof e.type != `string`
                      ? n.push(`${l}缺少有效 condition`)
                      : e.type === `text`
                        ? ((!Array.isArray(e.words) ||
                            e.words.length === 0 ||
                            e.words.some((e) => typeof e != `string` || !e.trim())) &&
                            n.push(`${l}的 text 条件需要非空 words`),
                          e.match !== void 0 &&
                            e.match !== `any` &&
                            e.match !== `all` &&
                            n.push(`${l}的 text 条件 match 无效`))
                        : e.type === `selector`
                          ? (typeof e.selector != `string` || !e.selector.trim()) &&
                            n.push(`${l}的 selector 条件缺少 selector`)
                          : e.type === `path`
                            ? (typeof e.pattern != `string` || !e.pattern.trim()) &&
                              n.push(`${l}的 path 条件缺少 pattern`)
                            : n.push(`${l}包含不支持的 condition 类型`),
                      !Array.isArray(t.then) || t.then.length === 0
                        ? n.push(`${l}的 then 分支不能为空`)
                        : a(t.then, `${l}.then.`, s + 1, !1),
                      t.else !== void 0 &&
                        (Array.isArray(t.else)
                          ? a(t.else, `${l}.else.`, s + 1, !1)
                          : n.push(`${l}的 else 分支格式无效`)));
                    break;
                  }
                  case `navigate`:
                    ((i += 1),
                      (!c || r !== 0) && n.push(`${l}只能把 navigate 放在第一步`),
                      typeof t.url != `string` || !t.url.trim()
                        ? n.push(`${l}缺少 url`)
                        : it(e, t.url) || n.push(`${l}必须与登录站点同源`));
                    break;
                  case `click`:
                    ((typeof t.selector != `string` || !t.selector.trim()) &&
                      n.push(`${l}缺少 selector`),
                      t.waitFor !== void 0 &&
                        (typeof t.waitFor != `string` || !t.waitFor.trim()) &&
                        n.push(`${l}的 waitFor 无效`),
                      t.timeoutMs !== void 0 &&
                        !Je(t.timeoutMs, 0) &&
                        n.push(`${l}的 timeoutMs 超出范围`),
                      nt(t, l, n),
                      $e(t, l, n));
                    break;
                  case `fill`:
                    ((typeof t.selector != `string` || !t.selector.trim()) &&
                      n.push(`${l}缺少 selector`),
                      typeof t.value != `string` && n.push(`${l}缺少 value`),
                      t.timeoutMs !== void 0 &&
                        !Je(t.timeoutMs, 0) &&
                        n.push(`${l}的 timeoutMs 超出范围`),
                      rt(t, l, n),
                      $e(t, l, n));
                    break;
                  case `scroll`:
                    (Ye(t.ratio) || n.push(`${l}的 ratio 必须是 0..1 的数字`),
                      t.container !== void 0 &&
                        !Ze(t.container) &&
                        n.push(`${l}的 container 必须是安全的 CSS 选择器`),
                      t.settleMs !== void 0 &&
                        !Je(t.settleMs, 0) &&
                        n.push(`${l}的 settleMs 超出范围`),
                      t.timeoutMs !== void 0 &&
                        !Je(t.timeoutMs, 0) &&
                        n.push(`${l}的 timeoutMs 超出范围`));
                    break;
                  case `drag`:
                    (et(t, `selector`, l, n),
                      et(t, `toSelector`, l, n),
                      t.anchor !== void 0 && tt(t.anchor, `anchor`, l, n),
                      t.toAnchor !== void 0 && tt(t.toAnchor, `toAnchor`, l, n),
                      t.steps !== void 0 &&
                        (!Number.isSafeInteger(t.steps) ||
                          t.steps < 0 ||
                          t.steps > bgCheckinState.Ve) &&
                        n.push(`${l}的 steps 必须是 0-${bgCheckinState.Ve} 的整数`),
                      t.timeoutMs !== void 0 &&
                        !Je(t.timeoutMs, 0) &&
                        n.push(`${l}的 timeoutMs 超出范围`),
                      $e(t, l, n));
                    break;
                  case `wait`: {
                    let e = typeof t.selector == `string` && t.selector.trim().length > 0,
                      r = t.ms !== void 0;
                    (e && r && n.push(`${l}只能设置 selector 或 ms 其中一个`),
                      r && !Je(t.ms, 0) && n.push(`${l}的 ms 超出范围`),
                      t.timeoutMs !== void 0 &&
                        !Je(t.timeoutMs, 0) &&
                        n.push(`${l}的 timeoutMs 超出范围`));
                    break;
                  }
                  case `assert`: {
                    let e = typeof t.selector == `string` && t.selector.trim().length > 0,
                      r =
                        Array.isArray(t.text) &&
                        t.text.some((e) => typeof e == `string` && e.trim());
                    (!e && !r && n.push(`${l}需要 selector 或 text`),
                      t.text !== void 0 &&
                        (!Array.isArray(t.text) || t.text.some((e) => typeof e != `string`)) &&
                        n.push(`${l}的 text 必须是字符串数组`),
                      t.result !== void 0 &&
                        t.result !== `success` &&
                        t.result !== `already` &&
                        n.push(`${l}的 result 无效`),
                      t.timeoutMs !== void 0 &&
                        !Je(t.timeoutMs, 0) &&
                        n.push(`${l}的 timeoutMs 超出范围`));
                    break;
                  }
                  case `leilei-daily`: {
                    let t = ``;
                    try {
                      t = new URL(e.loginUrl).hostname.toLowerCase();
                    } catch {}
                    let r = !1;
                    try {
                      let t = new URL(e.loginUrl);
                      r =
                        t.protocol === `https:` &&
                        t.hostname.toLowerCase() === `fapi.leileihog.top` &&
                        !t.port;
                    } catch {}
                    (t !== `fapi.leileihog.top` || !r) &&
                      n.push(`${l}的 leilei-daily 仅允许用于 fapi.leileihog.top`);
                    break;
                  }
                  default:
                    n.push(`${l}包含不支持的步骤类型`);
                }
            }));
    };
  return (
    a(t.steps, `工作流第 `, 0, !0),
    (t.steps.length > bgCheckinState.Le || r > bgCheckinState.Le) &&
      n.push(`工作流最多支持 ${bgCheckinState.Le} 个步骤`),
    i > 1 && n.push(`工作流当前只允许一个 navigate 步骤`),
    n
  );
}

function M(e) {
  let t = ct(e.loginUrl);
  return t ? new URL(t).origin : null;
}

function ct(e) {
  try {
    let t = new URL(e.trim());
    return lt(t) ? t.href : null;
  } catch {
    return null;
  }
}

function lt(e) {
  let t = e.hostname === `localhost` || e.hostname === `127.0.0.1` || e.hostname === `[::1]`;
  return e.protocol === `https:` || (e.protocol === `http:` && t);
}

function ut(e, t) {
  let n = M(e.site);
  if (!n || !t) return !1;
  try {
    return new URL(t).origin === n;
  } catch {
    return !1;
  }
}

function N(e, t) {
  if (!t) return !0;
  let n = M(e);
  if (!n) return !1;
  try {
    return new URL(t, e.loginUrl).origin === n;
  } catch {
    return !1;
  }
}

function dt(e) {
  return e === `localStorage` || e === `sessionStorage` ? e : void 0;
}

function ft(e) {
  return typeof e == `string` && e.trim() ? e.trim() : void 0;
}

function pt(site) {
  return readIdentitySource(withSiteIdentityRecipe(site));
}

function mt(e, t) {
  if (!t) return !1;
  let n = M(e);
  if (!n) return !1;
  let r, i;
  try {
    ((r = new URL(t)), (i = new URL(n).hostname.toLowerCase()));
  } catch {
    return !1;
  }
  if (r.protocol !== `https:`) return !1;
  let a = r.hostname.toLowerCase();
  return a.includes(`.`) ? a === i || a.endsWith(`.${i}`) || i.endsWith(`.${a}`) : !1;
}

function ht(e) {
  if (!e) return !1;
  try {
    let t = new URL(e);
    return t.protocol === `https:` && t.hostname === `github.com` && t.pathname === `/login`;
  } catch {
    return !1;
  }
}

function gt(e) {
  if (!e) return !1;
  try {
    let t = new URL(e);
    return t.protocol === `https:` && t.hostname === `github.com` && t.pathname === `/logout`;
  } catch {
    return !1;
  }
}

function _t(e) {
  if (!e) return !1;
  try {
    let t = new URL(e);
    return (
      t.protocol === `https:` &&
      t.hostname === `github.com` &&
      (t.pathname === `/login` || t.pathname === `/`)
    );
  } catch {
    return !1;
  }
}

function vt(e) {
  if (!e) return !1;
  try {
    let t = new URL(e);
    return (
      t.protocol === `https:` &&
      t.hostname === `github.com` &&
      t.pathname.startsWith(`/login/oauth/authorize`)
    );
  } catch {
    return !1;
  }
}

function yt(e) {
  if (!e) return !1;
  try {
    let t = new URL(e);
    return t.protocol !== `https:` || t.hostname !== `github.com`
      ? !1
      : t.pathname === `/login` ||
          t.pathname === `/logout` ||
          t.pathname.startsWith(`/login/`) ||
          t.pathname.startsWith(`/sessions/`) ||
          t.pathname.startsWith(`/account_verifications/`);
  } catch {
    return !1;
  }
}

function bt(e) {
  if (!e) return !1;
  try {
    let t = new URL(e);
    return t.protocol !== `https:` || t.hostname !== `accounts.google.com`
      ? !1
      : t.pathname.startsWith(`/o/oauth2/`) ||
          t.pathname.startsWith(`/signin/`) ||
          t.pathname.startsWith(`/v3/signin/`) ||
          t.pathname === `/ServiceLogin` ||
          t.pathname === `/AccountChooser`;
  } catch {
    return !1;
  }
}

function wt(e, t) {
  if (!t) return !1;
  let n = M(e);
  if (!n) return !1;
  let r;
  try {
    r = new URL(t, e.loginUrl);
  } catch {
    return !1;
  }
  if (r.protocol !== `https:` && r.protocol !== `http:`) return !1;
  let i = `${r.pathname}${r.search}`;
  return r.origin === n
    ? bgCheckinState.St.test(r.pathname) || bgCheckinState.Ct.test(r.search)
    : bgCheckinState.xt.test(r.hostname) ||
        bgCheckinState.St.test(r.pathname) ||
        bgCheckinState.Ct.test(r.search) ||
        /(?:oauth|openid|sso|authorize|login|signin|passkey|webauthn)/i.test(i);
}

function Tt(e) {
  return [
    `login`,
    `verify-oauth`,
    `verify-manual`,
    `relogin`,
    `relogin-verify`,
    `relogin-verify-manual`,
  ].includes(e);
}

function Et(e) {
  let t = [];
  M(e) || t.push(`登录页必须使用 HTTPS（本机测试可使用 localhost HTTP）`);
  let n = e.loginMethod ?? `form`;
  if (n === `token`) {
    let n = e.tokenConfig;
    (n?.storageKey?.trim() || t.push(`Token 认证需要填写存储键名（如 auth_token）`),
      n?.headerName?.trim() || t.push(`Token 认证需要填写请求头名称（如 Authorization）`),
      n?.identityEndpoint && !N(e, n.identityEndpoint) && t.push(`身份接口必须与登录站点同源`));
  }
  let r = pt(e);
  (r?.endpoint &&
    !N(e, r.endpoint) &&
    !mt(e, r.endpoint) &&
    t.push(`跨域身份接口必须使用 HTTPS，且主机必须是登录站点域名的自身或子域`),
    r?.endpoint &&
      !N(e, r.endpoint) &&
      !r.tokenKey &&
      t.push(`跨域身份接口需要同时填写 token 存储键（tokenKey）`),
    r?.pagePath && !N(e, r.pagePath) && t.push(`身份资料页必须与登录站点同源`),
    e.logoutApiUrl && !N(e, e.logoutApiUrl) && t.push(`退出接口必须与登录站点同源`));
  let i = e.authBootstrap?.endpoint?.trim();
  if (i) {
    let n = null;
    try {
      n = new URL(i, e.loginUrl).href;
    } catch {
      n = null;
    }
    (!n || !N(e, n)) && t.push(`令牌引导接口必须是登录站点同源的地址`);
  }
  let a = e.checkin,
    o = a?.method === `workflow` && !a.workflow?.route?.length;
  if (a?.entry && (!bgSitesState.oe(e) || o)) {
    if (
      (a.entry.readySelector?.trim() || t.push(`签到入口需要填写页面就绪选择器`),
      !Array.isArray(a.entry.steps) || a.entry.steps.length === 0)
    )
      t.push(`签到入口至少需要一个站内点击步骤`);
    else
      for (let [e, n] of a.entry.steps.entries())
        n?.selector?.trim() || t.push(`签到入口第 ${e + 1} 步缺少点击选择器`);
  }
  if (
    (a?.method === `api` &&
      (a.apiUrl?.trim()
        ? N(e, a.apiUrl) || t.push(`签到接口必须与登录站点同源`)
        : t.push(`API 签到需要填写接口地址`)),
    a?.method === `button` &&
      (a.buttonSelector?.trim() || t.push(`按钮签到需要填写按钮选择器`),
      a.url && !N(e, a.url) && t.push(`签到页面必须与登录站点同源`)),
    a?.method === `claim`)
  ) {
    (a.claimEntrySelector?.trim() || t.push(`领取签到需要填写领取入口选择器`),
      a.claimInputSelector?.trim() || t.push(`领取签到需要填写输入框选择器`),
      a.claimSubmitSelector?.trim() || t.push(`领取签到需要填写提交按钮选择器`));
    let n = a.claimMinLength ?? 10,
      r = a.claimText?.trim();
    (r && r.length < n && t.push(`领取文本至少需要 ${n} 字，当前 ${r.length} 字`),
      a.url && !N(e, a.url) && t.push(`领取页面必须与登录站点同源`));
  }
  return (
    a?.method === `relogin` &&
      (!a.logoutApiUrl?.trim() &&
        !a.logoutSelector?.trim() &&
        t.push(`退出重登需要填写退出接口或退出按钮选择器`),
      a.logoutApiUrl && !N(e, a.logoutApiUrl) && t.push(`退出接口必须与登录站点同源`)),
    bgSitesState.oe(e) && t.push(...st(e, a?.workflow)),
    t
  );
}

function Dt(e) {
  let t = Et(e);
  if (t.length) throw Error(t[0]);
}

function wi(e, t = bgPlatformState.Ci()) {
  return `${e}:${t}`;
}

function Ki(e) {
  if (!e || typeof e != `object`) return { ...bgCheckinState.Wi };
  let t = e,
    n = t.time !== void 0,
    r = typeof t.time == `string` && bgCheckinState.Gi.test(t.time),
    i = t.weekdays !== void 0,
    a = t.accountIds !== void 0,
    o =
      Array.isArray(t.accountIds) &&
      t.accountIds.every((e) => typeof e == `string` && e.length > 0),
    s = Array.isArray(t.weekdays)
      ? [...new Set(t.weekdays.filter((e) => Number.isInteger(e) && e >= 0 && e <= 6))].sort(
          (e, t) => e - t,
        )
      : [],
    c = Array.isArray(t.accountIds)
      ? [...new Set(t.accountIds.filter((e) => typeof e == `string` && e.length > 0))].sort()
      : [],
    l = (t.enabled === !0 && (!n || !i)) || (n && !r) || (i && s.length === 0) || (a && !o),
    u = {
      enabled: t.enabled === !0 && !l,
      time: r ? t.time : bgCheckinState.Wi.time,
      weekdays: s.length ? s : [...bgCheckinState.Wi.weekdays],
    };
  return (a && (u.accountIds = c), u);
}

function qi(e, t) {
  let n = Ki(e);
  if (n.accountIds === void 0) return n;
  let r = new Set(t);
  return { ...n, accountIds: n.accountIds.filter((e) => r.has(e)) };
}

function Ji(e, t) {
  let n = [...new Set(t)],
    r = Ki(e);
  if (r.accountIds === void 0) return n;
  let i = new Set(r.accountIds);
  return n.filter((e) => i.has(e));
}

function Yi(e) {
  let t = Ki(e);
  return `${t.time}|${t.weekdays.join(`,`)}|${t.accountIds === void 0 ? `*` : t.accountIds.join(`,`)}`;
}

function Xi(e, t = new Date()) {
  let n = Ki(e);
  if (!n.enabled || n.weekdays.length === 0) return null;
  let [r = 0, i = 0] = n.time.split(`:`).map(Number),
    a = new Set(n.weekdays);
  for (let e = 0; e <= 7; e += 1) {
    let n = new Date(t);
    if (
      (n.setDate(t.getDate() + e),
      n.setHours(r, i, 0, 0),
      a.has(n.getDay()) && n.getTime() > t.getTime())
    )
      return n;
  }
  return null;
}

function Zi(e, t, n = new Date()) {
  let r = Ki(e);
  if (!r.enabled || !Number.isFinite(t)) return !1;
  let i = new Date(t);
  if (Number.isNaN(i.getTime())) return !1;
  let [a = 0, o = 0] = r.time.split(`:`).map(Number);
  return (
    i.getFullYear() === n.getFullYear() &&
    i.getMonth() === n.getMonth() &&
    i.getDate() === n.getDate() &&
    i.getHours() === a &&
    i.getMinutes() === o &&
    r.weekdays.includes(i.getDay())
  );
}

function Qi(e, t) {
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}@${t}`;
}

function $i(e, t = new Date()) {
  let n = Ki(e);
  if (!n.enabled || n.weekdays.length === 0 || !n.weekdays.includes(t.getDay())) return null;
  let [r = 0, i = 0] = n.time.split(`:`).map(Number),
    a = new Date(t);
  return (a.setHours(r, i, 0, 0), a.getTime() <= t.getTime() ? a : null);
}

function sa(e, t, n) {
  let r = e[t];
  return !r?.disabledUntil || n >= r.disabledUntil;
}

function ca(e, t, n, r) {
  let i = e[t] ?? bgCheckinState.oa(),
    a = { ...i, lastAttemptAt: r, lastVerdict: n };
  return n === `success`
    ? ((a.consecutiveFailures = 0), delete a.disabledUntil, { ...e, [t]: a })
    : (n === `unsupported` &&
        ((a.consecutiveFailures = i.consecutiveFailures + 1),
        a.consecutiveFailures >= 3 && (a.disabledUntil = r + bgCheckinState.aa)),
      { ...e, [t]: a });
}

function la(e, t) {
  let n = new Set(t),
    r = Object.entries(e).filter(([e]) => n.has(e));
  return r.length === Object.keys(e).length ? e : Object.fromEntries(r);
}

function Co(e) {
  return e.tabId <= 0 && e.launching === !0 && Date.now() - e.startedAt < bgCheckinState.So;
}

function wo(e) {
  let t = Promise.resolve(),
    r = null,
    i = !1;
  function a(e) {
    let n = t.then(e, e);
    return (
      (t = n.then(
        () => void 0,
        () => void 0,
      )),
      n
    );
  }
  async function o() {
    return bgPlatformState.n.get(bgCheckinState.bo, bgCheckinState.xo());
  }
  async function s(e) {
    await bgPlatformState.n.set(bgCheckinState.bo, e);
  }
  function c() {
    return (
      (i = !0),
      (r ||= (async () => {
        for (; i;) ((i = !1), await l());
      })().finally(() => {
        ((r = null), i && c());
      })),
      r
    );
  }
  async function l() {
    for (;;) {
      let t = await a(async () => {
        let e = await o();
        if (e.active || e.pendingAccountIds.length === 0) return null;
        let t = e.pendingAccountIds.shift();
        return (
          (e.active = { accountId: t, tabId: 0, startedAt: Date.now(), launching: !0 }),
          await s(e),
          t
        );
      });
      if (!t) return;
      let n = await e
        .launch(t, (e) =>
          a(async () => {
            let n = await o();
            if (n.active?.accountId !== t) throw Error(`签到任务已被取消`);
            ((n.active = { accountId: t, tabId: e, startedAt: Date.now() }), await s(n));
          }),
        )
        .catch((e) => ({ ok: !1, error: e instanceof Error ? e.message : String(e) }));
      if (n.ok && n.completedResult) {
        let r = n.completedResult,
          i = await a(async () => {
            let n = await o();
            if (n.active?.accountId !== t) return { kind: `stolen` };
            (delete n.active, await s(n));
            try {
              return (await e.complete?.(t, r), { kind: `done` });
            } catch (e) {
              return { kind: `failed`, message: e instanceof Error ? e.message : String(e) };
            }
          });
        if (i.kind === `stolen`) return;
        i.kind === `failed` && (await e.fail(t, `签到结果落库失败：${i.message}`), e.changed());
      } else {
        if (n.ok && n.tabId != null) {
          if (
            !(await a(async () => {
              let e = await o();
              return (
                e.active?.accountId === t &&
                ((e.active = { accountId: t, tabId: n.tabId, startedAt: Date.now() }),
                await s(e),
                !0)
              );
            }))
          ) {
            await e.abandon({ accountId: t, tabId: n.tabId, startedAt: Date.now() });
            return;
          }
          e.changed();
          return;
        }
        if (
          await a(async () => {
            let e = await o();
            return e.active?.accountId === t && (delete e.active, await s(e), !0);
          })
        )
          (await e.fail(t, n.error || `无法启动签到任务`), e.changed());
        else return;
      }
    }
  }
  return {
    async enqueue(t) {
      let n = await a(async () => {
        let e = await o(),
          n = new Set(e.pendingAccountIds);
        e.active && n.add(e.active.accountId);
        let r = 0;
        for (let i of t) i && !n.has(i) && (n.add(i), e.pendingAccountIds.push(i), (r += 1));
        return (await s(e), { queued: r, skipped: t.length - r });
      });
      return (e.changed(), c(), n);
    },
    async finish(t) {
      (await a(async () => {
        let e = await o();
        return !e.active || e.active.tabId !== t ? !1 : (delete e.active, await s(e), !0);
      })) && (e.changed(), c());
    },
    async cancel(t) {
      let n = new Set(t);
      if (n.size === 0) return 0;
      let i = r,
        { active: l, removed: u } = await a(async () => {
          let e = await o(),
            t = e.pendingAccountIds.length;
          e.pendingAccountIds = e.pendingAccountIds.filter((e) => !n.has(e));
          let r = t - e.pendingAccountIds.length,
            i = e.active && n.has(e.active.accountId) ? e.active : void 0;
          return (i && delete e.active, await s(e), { active: i, removed: r + +!!i });
        });
      return (
        l && (await e.abandon(l)),
        u && e.changed(),
        l && i && (await i.catch(() => {})),
        u && c(),
        u
      );
    },
    async recover() {
      let t = await o();
      if (t.active && !Co(t.active) && !(await e.isAlive(t.active))) {
        let n = t.active;
        await e.abandon(n);
        let r = await o();
        if (r.active && r.active.accountId === n.accountId && r.active.tabId !== n.tabId) {
          e.changed();
          return;
        }
        (await a(async () => {
          let e = await o();
          (e.active?.accountId === n.accountId && delete e.active, await s(e));
        }),
          await e.fail(n.accountId, `浏览器后台重启，原签到页面已失效`));
      }
      (e.changed(), await c());
    },
    async rebindActiveTab(t, n) {
      return a(async () => {
        let r = await o();
        return !r.active || r.active.tabId !== t
          ? !1
          : ((r.active = { ...r.active, tabId: n, startedAt: Date.now() }),
            await s(r),
            e.changed(),
            !0);
      });
    },
    async active() {
      return (await o()).active;
    },
    async snapshot() {
      return o();
    },
    async launchInFlight() {
      let e = await o();
      return e.active ? Co(e.active) : !1;
    },
    async busy() {
      let e = await o();
      return !!e.active || e.pendingAccountIds.length > 0;
    },
  };
}

function Eo(e) {
  let t = [];
  for (let [n, r] of Object.entries(e)) {
    if (!n.startsWith(bgCheckinState.To) || !r || typeof r != `object`) continue;
    let e = r;
    e.runId &&
      e.accountId &&
      t.push({
        accountId: e.accountId,
        siteId: e.siteId ?? ``,
        tabId: typeof e.tabId == `number` ? e.tabId : 0,
        runId: e.runId,
        stage: e.stage ?? `login`,
        method: e.effectiveCheckinMethod ?? e.site?.checkin?.method,
        steps: Array.isArray(e.steps) ? e.steps.map((e) => String(e)) : [],
        startedAt: typeof e.createdAt == `number` ? e.createdAt : Date.now(),
      });
  }
  return t.sort((e, t) => e.startedAt - t.startedAt);
}

function Oo(e) {
  let t = new Set(e.pendingAccountIds ?? []);
  for (let n of e.liveAccountIds ?? []) t.add(n);
  e.activeAccountId && t.add(e.activeAccountId);
  let n = `:${e.day}`,
    r = [];
  for (let [i, a] of Object.entries(e.statuses)) {
    if (!i.endsWith(n) || !bgCheckinState.Do.has(a)) continue;
    let e = i.slice(0, -n.length);
    e && !t.has(e) && r.push(e);
  }
  return r;
}

function ko(e) {
  let t = new Map(e.accounts.map((e) => [e.id, e.siteId])),
    n = [...e.queue.pendingAccountIds];
  return (
    e.queue.activeAccountId && n.push(e.queue.activeAccountId),
    !n.some((n) => n !== e.accountId && t.get(n) === e.siteId)
  );
}

function Mo(e) {
  let t = bgCheckinState.jo.then(e, e);
  return (
    (bgCheckinState.jo = t.then(
      () => void 0,
      () => void 0,
    )),
    t
  );
}

async function No(e, t) {
  !e ||
    !Number.isFinite(t) ||
    t <= 0 ||
    (await Mo(async () => {
      let r = await bgPlatformState.n.get(bgCheckinState.Ao(e), []);
      r.includes(t) || (r.push(t), await bgPlatformState.n.set(bgCheckinState.Ao(e), r));
    }));
}

async function Po(e) {
  return Mo(async () => {
    let t = await bgPlatformState.n.get(bgCheckinState.Ao(e), []);
    return (t.length && (await bgPlatformState.n.remove(bgCheckinState.Ao(e))), t);
  });
}

function B(e) {
  let t = bgCheckinState.Fo.then(e, e);
  return (
    (bgCheckinState.Fo = t.then(
      () => void 0,
      () => void 0,
    )),
    t
  );
}

function zo(e) {
  let t = bgCheckinState.Ro.then(e, e);
  return (
    (bgCheckinState.Ro = t.then(
      () => void 0,
      () => void 0,
    )),
    t
  );
}

async function Vo(e) {
  Object.keys(e).length
    ? await bgPlatformState.n.set(bgCheckinState.Lo, e)
    : await bgPlatformState.n.remove(bgCheckinState.Lo);
}

async function Ho(e) {
  let t = await bgCheckinState.Bo();
  (e(t), await Vo(t));
}

function Wo(e) {
  let t = e.effectiveLoginMethod ?? `auto`;
  return (
    Tt(e.stage) &&
    (t === `oauth` ||
      t === `github` ||
      t === `passkey` ||
      e.stage === `verify-oauth` ||
      e.stage === `relogin-verify`)
  );
}

function Go(e, t) {
  return yt(t)
    ? `github`
    : bt(t)
      ? `google`
      : e.effectiveLoginMethod === `github`
        ? `github`
        : `generic`;
}

function Ko(e, t) {
  if (!t || /^about:blank(?:$|#)/i.test(t) || /^chrome-(?:extension|error):/i.test(t)) return !1;
  if (yt(t) || bt(t) || wt(e.site, t)) return !0;
  if (e.stage !== `verify-oauth` && e.stage !== `relogin-verify`) return !1;
  try {
    let n = new URL(t, e.site.loginUrl);
    return n.protocol === `https:` || n.protocol === `http:`;
  } catch {
    return !1;
  }
}

function qo(e, t) {
  let n = t.pendingUrl ?? t.url ?? ``;
  return /^about:blank(?:$|#)/i.test(n)
    ? e.stage === `verify-oauth` || e.stage === `relogin-verify`
    : Ko(e, n);
}

function Jo(e, t) {
  return e.effectiveLoginMethod === `github`
    ? yt(t)
      ? !0
      : e.stage !== `verify-oauth` && e.stage !== `relogin-verify`
        ? !1
        : /^about:blank(?:$|#)/i.test(t)
          ? !0
          : N(e.site, t) && wt(e.site, t)
    : !1;
}

function ys(e) {
  return e.replace(bgCheckinState.vs, (e) => bgCheckinState._s[e] ?? e);
}

function xs(e) {
  let t = ``,
    n = !1,
    r = ``,
    i = e.source;
  for (let e = 0; e < i.length; e += 1) {
    let a = i[e];
    if (a === `\\`) {
      ((t += i.slice(e, e + 2)), (e += 1));
      continue;
    }
    if (n) {
      if (a === `]`) {
        ((t += `${r}]`), (n = !1), (r = ``));
        continue;
      }
      ((r += bgCheckinState.bs.get(a) ?? ``), (t += a));
      continue;
    }
    if (a === `[`) {
      ((n = !0), (t += a));
      continue;
    }
    let o = bgCheckinState.bs.get(a);
    t += o ? `[${a}${o}]` : a;
  }
  return new RegExp(t, e.flags);
}

function Ss(e, t) {
  let n = ys(e).toLowerCase();
  return t.filter((e) => n.includes(ys(e).toLowerCase()));
}

function js(e, t, n) {
  let r = bgCheckinState.As[e];
  return t?.trim()
    ? {
        checkin: [t.trim()],
        balance: r?.balance ?? [...bgCheckinState.Os.balance, ...bgCheckinState.ks.balance],
        auth: r?.auth ?? `userIdHeaders`,
        method: n ?? r?.method ?? `POST`,
        explicit: !0,
      }
    : r
      ? {
          checkin: r.checkin,
          balance: r.balance,
          auth: r.auth,
          method: r.method ?? `POST`,
          explicit: !1,
        }
      : null;
}

function Ms(e) {
  return typeof e == `object` && e && !Array.isArray(e) ? e : null;
}

function Ns(e) {
  let t = Ms(e.data),
    n = e.message ?? e.msg ?? t?.message ?? t?.msg;
  return typeof n == `string` ? n : ``;
}

function Ps(e, t) {
  let n = e.toLowerCase(),
    r = t.trimStart().slice(0, 512).toLowerCase();
  return (
    n.includes(`text/html`) ||
    n.includes(`application/xhtml+xml`) ||
    /^<!doctype\s+html\b/.test(r) ||
    /^<html\b/.test(r) ||
    /<(?:head|body|form)\b/.test(r)
  );
}

function Fs(e, t, n, r) {
  if (e === 401 || e === 403)
    return { verdict: `auth-expired`, message: `登录态无效（HTTP ${e}）` };
  if (e === 404 || e === 405)
    return { verdict: `unsupported`, message: `站点没有这个签到接口（HTTP ${e}）` };
  if (Ps(t, n)) return { verdict: `unsupported`, message: `接口返回 HTML 页面而非 JSON` };
  let i = null;
  try {
    i = Ms(JSON.parse(n));
  } catch {
    i = null;
  }
  if (!i)
    return e >= 400
      ? { verdict: `unsupported`, message: `接口返回 HTTP ${e}` }
      : bgRecordsState.Is(n, r.already)
        ? { verdict: `claims-already`, message: `接口提示今日已签到` }
        : bgRecordsState.Is(n, r.success)
          ? { verdict: `claims-success`, message: `接口返回签到成功` }
          : { verdict: `unreadable`, message: `响应不是 JSON 且无可识别文案` };
  let a = Ms(i.data),
    o = Ns(i);
  return e >= 400 || i.success === !1 || a?.success === !1
    ? bgRecordsState.Is(o, r.already)
      ? { verdict: `claims-already`, message: o || `接口提示今日已签到` }
      : { verdict: `claims-failure`, message: o || `接口返回失败（HTTP ${e}）` }
    : i.already === !0 || a?.already === !0
      ? { verdict: `claims-already`, message: o || `接口提示今日已签到` }
      : bgRecordsState.Is(o, r.already)
        ? { verdict: `claims-already`, message: o }
        : i.success === !0 || a?.success === !0 || i.code === 0 || i.ret === 1
          ? { verdict: `claims-success`, message: o || `接口返回成功标志` }
          : bgRecordsState.Is(o, r.success)
            ? { verdict: `claims-success`, message: o }
            : { verdict: `unreadable`, message: o || `响应缺少可识别的成功或已签到标志` };
}

function Ws(e) {
  return e === `confirmed` || e === `already`;
}

function Gs(e) {
  return e !== `write-unverified`;
}

function Ks(e) {
  return Ws(e)
    ? `success`
    : e === `unsupported`
      ? `unsupported`
      : e === `auth-expired`
        ? `auth-expired`
        : e === `inconclusive` || e === `write-unverified`
          ? `inconclusive`
          : `error`;
}

function Js(e, t, n) {
  let r = { Accept: `application/json` },
    i = e.identity?.userId ?? t.adapter?.userId;
  Object.assign(r, bgSitesState.or(i));
  let a = e.identity?.session?.accessToken?.trim() || e.apiToken?.trim();
  if (a) {
    let e = t.tokenConfig?.headerPrefix ?? `Bearer `,
      n = t.tokenConfig?.headerName ?? `Authorization`;
    r[n] = `${e}${a}`;
  } else n === `bearer` && (r.__missingBearer = `1`);
  return r;
}

function Ys(e, t) {
  let n = e.identity?.session?.tokenExpiresAt;
  return n ? t >= n - 3e4 : !1;
}

async function Xs(e, t, n, r = bgCheckinState.Vs) {
  let i = new AbortController(),
    a = setTimeout(() => i.abort(), r);
  try {
    let r = await e.fetch(t, {
        ...n,
        credentials: `include`,
        redirect: `error`,
        signal: i.signal,
      }),
      a = (await r.text()).slice(0, 4e3);
    return { status: r.status, contentType: r.headers.get(`content-type`) ?? ``, body: a };
  } catch {
    return null;
  } finally {
    clearTimeout(a);
  }
}

async function Zs(e, t, n, r) {
  for (let i of n) {
    let n = Qs(t, i);
    if (!n) continue;
    let a = await Xs(e, n, { method: `GET`, headers: r }, 4e3);
    if (!a || a.status !== 200 || !a.contentType.toLowerCase().includes(`json`)) continue;
    let o;
    try {
      o = JSON.parse(a.body);
    } catch {
      continue;
    }
    let s = bgRecordsState.mi(o);
    if (s)
      return {
        quota: s.quota,
        usedQuota: s.usedQuota,
        ...(s.symbol ? { symbol: s.symbol } : {}),
        at: e.now(),
      };
  }
  return null;
}

function Qs(e, t) {
  try {
    let n = new URL(t, e.loginUrl).href;
    return N(e, n) ? n : null;
  } catch {
    return null;
  }
}

function $s(e, t, n, r) {
  if (n.method !== `POST` || (e !== bgSitesState.d.NEW_API && e !== bgSitesState.d.VO_API_V2))
    return !1;
  let i = Qs(t, r);
  if (!i) return !1;
  try {
    let e = new URL(i);
    return e.pathname.replace(/\/+$/, ``) === `/api/user/checkin` && e.search === ``;
  } catch {
    return !1;
  }
}

async function ec(e, t, n, r, i) {
  let a = Qs(t, n);
  if (!a) return null;
  let o;
  try {
    let e = new URL(a);
    (e.searchParams.set(`month`, i), (o = e.href));
  } catch {
    return null;
  }
  let s = await Xs(e, o, { method: `GET`, headers: r }, 4e3);
  return s ? bgRecordsState.zs(s.status, s.contentType, s.body) : null;
}

function tc(e) {
  return {
    success: e.checkin?.successText?.length ? e.checkin.successText : bgCheckinState.Cs,
    already: e.checkin?.alreadyText?.length ? e.checkin.alreadyText : bgCheckinState.ws,
  };
}

async function nc(e, t, n = bgCheckinState.qs) {
  let r = [];
  if (bgSitesState.oe(t))
    return {
      verdict: `inconclusive`,
      message: `本站已保存签到流程，完成登录后由浏览器回放，不使用接口签到替代`,
      steps: r,
    };
  if (bgSitesState.se(t))
    return {
      verdict: `inconclusive`,
      message: `本站已学会「登录即签到」，由浏览器完成登录后确认，不使用接口签到替代`,
      steps: r,
    };
  let i = n.now() + bgCheckinState.Hs,
    a = bgSitesState.fr(t).family,
    o = js(a, t.checkin?.apiUrl, t.checkin?.apiMethod);
  if (!o)
    return {
      verdict: `unsupported`,
      message: `站点类型未知且未配置签到接口地址，无法直连`,
      steps: r,
    };
  if (!o.checkin.some((e) => Qs(t, e)))
    return { verdict: `unsupported`, message: `站点没有可安全访问的同源签到接口`, steps: r };
  let s = Js(e, t, o.auth);
  if (s.__missingBearer)
    return (
      delete s.__missingBearer,
      {
        verdict: `auth-expired`,
        message: `该站点需要 Bearer 令牌，但账号还没有抓取过登录态`,
        steps: r,
      }
    );
  if (Ys(e, n.now()))
    return { verdict: `auth-expired`, message: `抓取的访问令牌已过期，需要重新登录`, steps: r };
  r.push(`尝试 API 直连签到（${o.explicit ? `站点配置的接口` : `${a} 家族默认接口`}）`);
  let c = bgRecordsState.Rs(n.now()),
    l = o.checkin[0],
    u = !!l && $s(a, t, o, l),
    d = u && l ? await ec(n, t, l, s, c) : null;
  if (d) {
    if ((r.push(`已读到站点签到台账（本月 ${d.records.length} 条记录）`), !d.enabled))
      return { verdict: `unsupported`, message: `站点已关闭签到功能`, steps: r };
    if (d.checkedInToday) {
      r.push(`台账显示今日已签到，无需再发签到请求`);
      let e = await Zs(n, t, o.balance, s);
      return (
        e && r.push(`已采集当前额度`),
        {
          verdict: `already`,
          message: `站点台账显示今日已签到`,
          steps: r,
          ...(e ? { balance: e } : {}),
        }
      );
    }
  }
  let f = await Zs(n, t, o.balance, s);
  if (
    (f ? r.push(`已采集签到前额度快照`) : r.push(`读不到签到前额度，本次无法用守恒差分确认结果`),
    !d && !f)
  )
    return (
      r.push(`缺少可用的只读验证通道，已在发送签到请求前停止直连`),
      { verdict: `inconclusive`, message: `直连缺少可用的只读验证通道，改用浏览器签到`, steps: r }
    );
  let p = { ...s },
    m = t.checkin?.apiBody;
  m && o.method !== `GET` && (p[`Content-Type`] = `application/json`);
  let h = null;
  for (let a of o.checkin) {
    if (n.now() > i)
      return { verdict: `error`, message: `直连超出时间预算，改用浏览器签到`, steps: r };
    let g = Qs(t, a);
    if (!g) {
      r.push(`跳过非本站签到地址 ${a}`);
      continue;
    }
    let _ = await Xs(n, g, {
      method: o.method,
      headers: p,
      body: o.method === `GET` ? void 0 : (m ?? void 0),
    });
    if (!_)
      return (
        r.push(`签到接口请求失败或超时`),
        r.push(`写请求可能已到达站点，为避免重复签到不再自动重试`),
        {
          verdict: `write-unverified`,
          message: `签到请求已发出但未收到可验证响应；为避免重复签到，未再自动重试`,
          steps: r,
        }
      );
    let v = Fs(_.status, _.contentType, _.body, tc(t));
    if (
      ((h = v), r.push(`签到接口返回 HTTP ${_.status}：${v.message}`), v.verdict === `auth-expired`)
    )
      return { verdict: `auth-expired`, message: v.message, steps: r };
    if (v.verdict !== `unsupported`)
      return v.verdict === `claims-failure`
        ? { verdict: `inconclusive`, message: v.message, steps: r }
        : rc(n, e, t, o, s, f, d, u && d && a === l ? () => ec(n, t, l, s, c) : null, v, r);
  }
  return { verdict: `unsupported`, message: h?.message ?? `站点没有可用的签到接口`, steps: r };
}

async function rc(e, t, n, r, i, a, o, s, c, l) {
  await e.sleep(bgCheckinState.Us);
  let u = s ? await s() : null,
    d = bgRecordsState.Bs(o, u);
  d != null && l.push(`签到台账已记入本次奖励`);
  let f = await Zs(e, n, r.balance, i);
  f ? l.push(`已采集签到后额度快照`) : l.push(`读不到签到后额度快照`);
  let p = (e) => (f ? { ...e, balance: f } : e);
  if (d != null) {
    let e = {
      ...bgRecordsState.xi(a ?? void 0, f ?? void 0),
      reward: d,
      verdict: `rewarded`,
      ...(f ? { quotaAfter: f.quota } : {}),
      ...(f?.symbol ? { balanceSymbol: f.symbol } : {}),
    };
    return p({ verdict: `confirmed`, message: c.message, steps: l, metrics: e });
  }
  if (c.verdict === `claims-already`) {
    if (a && f) {
      let e = bgRecordsState.xi(a, f);
      return (
        l.push(`额度差分：${e.verdict}`),
        p({
          verdict: e.verdict === `rewarded` ? `confirmed` : `already`,
          message: c.message,
          steps: l,
          metrics: e,
        })
      );
    }
    return p({ verdict: `already`, message: c.message, steps: l });
  }
  if (u?.checkedInToday && !o?.checkedInToday) {
    l.push(`台账已从未签到翻为已签到`);
    let e = a && f ? bgRecordsState.xi(a, f) : null,
      t =
        e?.verdict === `rewarded`
          ? e
          : f
            ? {
                verdict: `unknown`,
                quotaAfter: f.quota,
                ...(f.symbol ? { balanceSymbol: f.symbol } : {}),
              }
            : null;
    return p({
      verdict: `confirmed`,
      message: c.message,
      steps: l,
      ...(t ? { metrics: t } : {}),
    });
  }
  if (!a || !f)
    return (
      l.push(`写请求已发出但验证证据不完整，为避免重复签到不再自动重试`),
      p({
        verdict: `write-unverified`,
        message: `接口声称成功但无法取得完整额度差分；为避免重复签到，未再自动重试`,
        steps: l,
      })
    );
  let m = bgRecordsState.xi(a, f);
  return (
    l.push(`额度差分：${m.verdict}`),
    m.verdict === `rewarded`
      ? p({ verdict: `confirmed`, message: c.message, steps: l, metrics: m })
      : (l.push(`写请求已发出但额度未增加，为避免重复签到不再自动重试`),
        p({
          verdict: `write-unverified`,
          message: `接口声称成功但额度未增加；为避免重复签到，未再自动重试`,
          steps: l,
          metrics: m,
        }))
  );
}

async function Pp(e, t = bgPlatformState.Np) {
  if (!Number.isFinite(e) || e <= 0) return `gone`;
  let n = await t.get(e);
  return n
    ? n.windowId == null || (await t.queryWindow(n.windowId)).filter((t) => t.id !== e).length === 0
      ? `kept`
      : (await t.remove(e), `removed`)
    : `gone`;
}

function Fp(e) {
  return { site: e };
}

function Ip(e) {
  return { site: e, borrowed: [] };
}

function Lp(e, t) {
  if (!bgSitesState.ce(e) || bgSitesState.ue(e)) return null;
  if (t.method === `none`) return { ...t };
  let { entry: n, url: r, ...i } = e.checkin ?? { method: `auto` };
  return {
    ...i,
    method: `workflow`,
    ...(t.workflow ? { workflow: t.workflow } : {}),
    workflowReplayDisabled: !1,
  };
}

function Up() {
  return [];
}

function Wp(e, t) {
  if (e.accountId !== t) return e;
  let n = bgSitesState.so(e.site),
    r = n.checkin?.method ?? `auto`;
  if (n === e.site && e.effectiveCheckinMethod === r) return e;
  let i = e.effectiveCheckinMethod ?? e.site.checkin?.method ?? `auto`,
    a = `；签到方式：`,
    o = !1,
    s = (e.steps ?? []).map((e) => {
      let t = e.indexOf(a);
      return t < 0 ? e : ((o = !0), `${e.slice(0, t)}${a}${r}（站点配置）`);
    });
  return (
    i !== r &&
      (o || s.push(`签到方式：${r}（站点配置）`),
      s.push(`后台恢复任务时已同步最新签到方式（${i} -> ${r}）`)),
    {
      ...e,
      site: n,
      effectiveCheckinMethod: r,
      ...(JSON.stringify(n.checkin?.workflow) === JSON.stringify(e.site.checkin?.workflow)
        ? {}
        : { workflowRouteIndex: void 0 }),
      steps: s,
    }
  );
}

async function Gp(e) {
  !e || e.tabId <= 0 || (await bgCheckinState.V.update(e.tabId, (t) => Wp(t, e.accountId)));
}

function sm(e, t, n) {
  let r = bgCheckinState.om.catch(() => {}).then(() => cm(e, t, n));
  return ((bgCheckinState.om = r.catch(() => {})), r);
}

async function cm(e, t, n) {
  let r = await bgCheckinState.H.get(e);
  if (
    (!r &&
      n != null &&
      (await bgCheckinState.V.get(n))?.runId &&
      (await bgCheckinState.H.remember(e, n), (r = { openerTabId: n })),
    !r || !t)
  )
    return;
  let i = r.openerTabId,
    a = await bgCheckinState.V.get(i);
  if (
    (a?.runId &&
      Wo(a) &&
      a.usesExtensionProxy &&
      Ko(a, t) &&
      (await fm(e, i, Go(a, t)), (r = (await bgCheckinState.H.get(e)) ?? r)),
    !a?.runId || !Tt(a.stage))
  )
    return;
  let o = Jo(a, t),
    s =
      (a.effectiveLoginMethod === `oauth` ||
        a.effectiveLoginMethod === `github` ||
        a.effectiveLoginMethod === `passkey`) &&
      bt(t);
  if (o || s) {
    if (s) {
      if (!a.usesExtensionProxy || !(await fm(e, i, `google`))) return;
      if (
        !(await chrome.tabs
          .get(e)
          .then(() => !0)
          .catch(() => !1))
      ) {
        (await bgProxiesState.W.release(e).catch(() => {}), await bgCheckinState.H.forget(e));
        return;
      }
    } else if (a.usesExtensionProxy && !(await fm(e, i, `github`)))
      await bgCheckinState.H.clearProxyTransferred(e);
    else if (await bgCheckinState.V.rebind(i, e, a.runId))
      (await bgCheckinState.Z.rebindActiveTab(i, e))
        ? (await bgCheckinState.H.forget(e), bgPlatformState.$())
        : (await bgCheckinState.V.rebind(e, i, a.runId).catch(() => null),
          a.usesExtensionProxy &&
            (await bgProxiesState.W.transfer(e, i).catch(() => {}),
            await bgCheckinState.H.clearProxyTransferred(e)));
    else {
      if ((await bgCheckinState.V.get(e))?.runId === a.runId) return;
      a.usesExtensionProxy &&
        (await bgProxiesState.W.transfer(e, i).catch(() => {}),
        await bgCheckinState.H.clearProxyTransferred(e));
    }
  }
}

async function lm(e) {
  let t = await bgCheckinState.H.get(e);
  t &&
    (await bgCheckinState.H.forget(e),
    t.proxyTransferred &&
      ((await bgCheckinState.V.get(t.openerTabId))?.runId
        ? await bgProxiesState.W.transfer(e, t.openerTabId).catch(() => {})
        : await bgProxiesState.W.release(e).catch(() => {})));
  let r = await bgPlatformState.n.get(bgLearningState.a(e), null);
  r && (await bgLearningState.Vm(r).catch(() => {}), bgPlatformState.$());
  let i = await bgCheckinState.V.get(e),
    o = await bgCheckinState.H.entriesOf(e);
  if (i?.runId && Wo(i)) {
    let t = await bgCheckinState.Z.active();
    if (t?.tabId === e && t.accountId === i.accountId && (await dm(t, i))) return;
  }
  (await um(e, i, o), await Mh({ tabId: e, failure: `标签页被关闭，签到中断`, keepAttention: !0 }));
}

async function um(e, t, n) {
  let r = n ?? (await bgCheckinState.H.entriesOf(e)),
    i = !!(t?.usesExtensionProxy && Wo(t));
  for (let [n, a] of r) {
    let r = await chrome.tabs.get(n).catch(() => null);
    r
      ? (!i && !a.proxyTransferred) || (t && !a.proxyTransferred && !qo(t, r))
        ? await bgCheckinState.H.forget(n)
        : ((await bgProxiesState.W.transfer(e, n).catch(() => !1)) &&
            (await bgCheckinState.H.markProxyTransferred(n, a.provider ?? `generic`)),
          (await bgCheckinState.H.get(n))?.proxyTransferred &&
            (await bgCheckinState.H.markProxyRetained(n)))
      : await bgCheckinState.H.forget(n);
  }
}

async function dm(e, t) {
  if (!t.runId || !Wo(t)) return !1;
  let n = await bgCheckinState.H.entriesOf(e.tabId);
  for (let [r, i] of n) {
    let a = await chrome.tabs.get(r).catch(() => null);
    if (!a) await bgCheckinState.H.forget(r);
    else if (!i.proxyTransferred && !qo(t, a)) await bgCheckinState.H.forget(r);
    else if (
      (!t.usesExtensionProxy || (await fm(r, e.tabId, i.provider ?? Go(t)))) &&
      (await bgCheckinState.V.rebind(e.tabId, r, t.runId))
    ) {
      if (!(await bgCheckinState.Z.rebindActiveTab(e.tabId, r)))
        await bgCheckinState.V.rebind(r, e.tabId, t.runId).catch(() => null);
      else {
        for (let [e, t] of n)
          e !== r &&
            (t.proxyTransferred && (await bgCheckinState.H.clearProxyTransferred(e)),
            await bgCheckinState.H.forget(e));
        return (await bgCheckinState.H.forget(r), bgPlatformState.$(), !0);
      }
    }
  }
  return !1;
}

async function fm(e, t, n) {
  let r = await bgCheckinState.H.get(e);
  if (r?.proxyTransferred) {
    let n = await bgProxiesState.W.holder();
    if (n === e) return !0;
    if (n !== t) return !1;
  } else
    (r || (await bgCheckinState.H.remember(e, t)),
      await bgCheckinState.H.markProxyTransferred(e, n));
  return (await bgProxiesState.W.transfer(t, e))
    ? !0
    : (await bgProxiesState.W.holder()) === e
      ? (await bgCheckinState.H.markProxyTransferred(e, n), !0)
      : (await bgCheckinState.H.clearProxyTransferred(e), !1);
}

function pm() {
  let e = async () => {
    (await mm(), await bgCheckinState.Z.recover());
    let e = await bgCheckinState.H.pruneDeadTabs(),
      t = await bgCheckinState.Z.active();
    await Gp(t);
    for (let [n, r] of e)
      r.proxyTransferred &&
        ((t?.tabId === r.openerTabId &&
          (await bgCheckinState.V.get(r.openerTabId))?.runId &&
          (await bgProxiesState.W.transfer(n, r.openerTabId))) ||
          (await bgProxiesState.W.release(n)));
    let n = await bgCheckinState.H.transferredPopups();
    if (
      bgProxiesState.Me({
        activeTabId: t?.tabId ?? null,
        launchInFlight: await bgCheckinState.Z.launchInFlight(),
      })
    ) {
      let { active: e } = bgLearningState.Of(
          Object.entries(await chrome.storage.session.get(null)),
        ),
        r = e.map((e) => e.tabId).filter((e) => e > 0),
        i = [...new Set([...(t ? [t.tabId] : []), ...n, ...r])];
      await bgProxiesState.W.recover(i);
    }
    (await gm(), await bm());
  };
  return (
    (bgEntryState.Qp = bgEntryState.Qp.then(e, e).catch((e) => {
      console.error(`[后台恢复] 失败`, e);
    })),
    bgEntryState.Qp
  );
}

async function mm() {
  await hm(await bgPlatformState.t.get(bgPlatformState.r.launchMode, bgSettingsState.Fe));
}

async function hm(e) {
  await bgSettingsState.Zp.sync(e).catch((e) => {
    console.error(`[启动模式] 应用失败`, e);
  });
}

function gm() {
  let e = bgPlatformState.nm.then(_m, _m);
  return (
    (bgPlatformState.nm = e.then(
      () => void 0,
      () => void 0,
    )),
    e
  );
}

async function _m() {
  let e = Xi(Ki(await bgPlatformState.t.get(bgPlatformState.r.schedule, bgCheckinState.Wi)));
  e
    ? await chrome.alarms.create(bgCheckinState.zp, { when: e.getTime() })
    : await chrome.alarms.clear(bgCheckinState.zp).catch(() => !1);
}

function vm(e) {
  let t = bgPlatformState.tm.then(
    () => ym(e),
    () => ym(e),
  );
  return (
    (bgPlatformState.tm = t.then(
      () => void 0,
      () => void 0,
    )),
    t
  );
}

async function ym(e) {
  try {
    await bgEntryState.Qp;
    let n = Ki(await bgPlatformState.t.get(bgPlatformState.r.schedule, bgCheckinState.Wi));
    if (e == null || !Zi(n, e, new Date())) return;
    await Sm(n, new Date(e));
  } catch (e) {
    console.error(`[定时签到] 执行失败`, e);
  } finally {
    await gm().catch((e) => console.error(`[定时签到] 重排闹钟失败`, e));
  }
}

async function bm() {
  let e = bgPlatformState.tm.then(xm, xm);
  return (
    (bgPlatformState.tm = e.then(
      () => void 0,
      () => void 0,
    )),
    e
  );
}

async function xm() {
  try {
    let e = Ki(await bgPlatformState.t.get(bgPlatformState.r.schedule, bgCheckinState.Wi)),
      n = $i(e, new Date());
    if (!n) return;
    await Sm(e, n);
  } catch (e) {
    console.error(`[定时签到] 补跑检查失败`, e);
  }
}

async function Sm(e, i) {
  let a = Qi(i, e.time),
    o = await bgPlatformState.n.get(bgCheckinState.Vp, {}),
    s = Yi(e);
  if (o.key === a && o.signature === s) return;
  let c = bgPlatformState.Ci(new Date()),
    [l, u, d, f] = await Promise.all([
      bgPlatformState.t.get(bgPlatformState.r.accounts, []),
      bgPlatformState.t.get(bgPlatformState.r.status, {}),
      bgPlatformState.t.get(bgPlatformState.r.sites, []),
      bgPlatformState.t.get(bgPlatformState.r.removedBuiltinSiteIds, []),
    ]),
    p = new Set(f),
    m = new Set([
      ...d.map((e) => e.id),
      ...bgSitesState.j.filter((e) => !p.has(e.id)).map((e) => e.id),
    ]),
    h = Ji(
      e,
      l.map((e) => e.id),
    ),
    g = new Set(h),
    _ = l
      .filter((e) => {
        if (!m.has(e.siteId) || !g.has(e.id)) return !1;
        let t = u[wi(e.id, c)];
        return t !== `done` && t !== `running` && t !== `attention`;
      })
      .map((e) => e.id);
  if (_.length) {
    let e = await $m(_);
    if (e.ok) console.info(`[定时签到] 已加入 ${e.queued ?? 0} 个账号，跳过 ${e.skipped ?? 0} 个`);
    else {
      console.warn(`[定时签到] 入队失败：${e.error}`);
      return;
    }
    bgPlatformState.$();
  }
  await bgPlatformState.n.set(bgCheckinState.Vp, { key: a, signature: s });
}

function Cm(e, t) {
  let n = e.githubUsername?.trim(),
    r = e.stage === `github-logout` && (gt(t) || _t(t)),
    i = yt(t) && Tt(e.stage);
  return (!r && !i) || e.effectiveLoginMethod !== `github` || !n || !e.githubPassword
    ? null
    : {
        tabId: e.tabId,
        runId: e.runId,
        accountId: e.accountId,
        siteId: e.siteId,
        username: ``,
        password: ``,
        ...(i ? { githubUsername: n, githubPassword: e.githubPassword } : {}),
        site: {
          id: `github-auth`,
          name: `GitHub`,
          loginUrl: `https://github.com/login`,
          pointerMode: e.site.pointerMode,
          selectors: {
            username: `#login_field`,
            password: `#password`,
            submit: `input[name="commit"]`,
          },
          closeModalSelectors: [],
        },
        effectiveLoginMethod: `github`,
        effectiveCheckinMethod: e.effectiveCheckinMethod,
        usesExtensionProxy: e.usesExtensionProxy,
        createdAt: e.createdAt,
        stage: e.stage,
        steps: e.steps,
      };
}

async function wm(e, t, n) {
  if (!t) return null;
  let r = await Tm(e, n);
  return r ? Cm(r, t) : null;
}

async function Tm(e, t) {
  let n = await bgCheckinState.Z.active();
  if (!n || n.tabId <= 0 || ((await bgCheckinState.H.get(e))?.openerTabId ?? t) !== n.tabId)
    return null;
  let r = await bgCheckinState.V.get(n.tabId);
  return r?.runId && r.accountId === n.accountId ? r : null;
}

async function Em(e) {
  await bgLearningState.Vm(e);
}

async function qm(e, t) {
  let n;
  for (let e of bgCheckinState.Km) {
    e && (await new Promise((t) => setTimeout(t, e)));
    try {
      return (await t(), !0);
    } catch (e) {
      n = e;
    }
  }
  return (console.error(`[任务收尾] ${e}失败，已重试 ${bgCheckinState.Km.length} 次`, n), !1);
}

async function Jm(e) {
  await qm(`关闭标签页 ${e}`, async () => {
    await Pp(e);
  });
}

async function Ym(e, n) {
  let i = n?.quotaAfter;
  if (i != null && Number.isFinite(i))
    try {
      let a = (await bgPlatformState.t.get(bgPlatformState.r.balances, {}))[e];
      if (a && !a.error) return;
      (await bgRecordsState.store.saveBalance(e, {
        quota: i,
        usedQuota: a?.usedQuota ?? 0,
        ...(n?.balanceSymbol ? { symbol: n.balanceSymbol } : {}),
        at: Date.now(),
        source: `api`,
      }),
        bgPlatformState.$());
    } catch {}
}

function Xm(e, t, n) {
  setTimeout(() => void Zm(e, t, n), 1200);
}

async function Zm(e, n, i) {
  if (!n || !i) {
    await Jm(e);
    return;
  }
  let a = [];
  try {
    let [o, s] = await Promise.all([
      bgPlatformState.t.get(bgPlatformState.r.accounts, []),
      bgCheckinState.Z.snapshot(),
    ]);
    if (
      !ko({
        siteId: n,
        accountId: i,
        accounts: o,
        queue: { pendingAccountIds: s.pendingAccountIds, activeAccountId: s.active?.accountId },
      })
    ) {
      await No(n, e);
      return;
    }
    a = await Po(n);
  } catch {
    await Jm(e);
    return;
  }
  for (let t of a) t !== e && (await Jm(t));
  await Jm(e);
}

async function Qm(e, n) {
  let i = n.trim();
  i &&
    (await bgPlatformState.X(async () => {
      let n = await bgPlatformState.t.get(bgPlatformState.r.sites, []),
        a = n.findIndex((t) => t.id === e);
      if (a < 0) return { ok: !0 };
      let o = n[a];
      if (!o.checkin) return { ok: !0 };
      let s = o.checkin.claimUsedTexts ?? [];
      if (s.includes(i)) return { ok: !0 };
      let c = [...s, i].slice(-60);
      return (
        (n[a] = { ...o, checkin: { ...o.checkin, claimUsedTexts: c } }),
        await bgPlatformState.t.set(bgPlatformState.r.sites, n),
        { ok: !0 }
      );
    }));
}

async function $m(e) {
  return bgPlatformState.X(async () => {
    let { accounts: t, userSites: n, removedBuiltinSiteIds: r } = await bgEntryState.store.load(),
      i = new Set(r),
      a = new Set([
        ...n.map((e) => e.id),
        ...bgSitesState.j.filter((e) => !i.has(e.id)).map((e) => e.id),
      ]),
      o = new Set(t.filter((e) => a.has(e.siteId)).map((e) => e.id)),
      s = e.filter((e) => o.has(e));
    if (s.length === 0) return { ok: !1, error: `没有找到已归属站点的可执行账号` };
    if (!(await bgCheckinState.Z.busy())) {
      let e = await bgProxiesState.jm(`queue`);
      if (e) return { ok: !1, error: e };
    }
    let c = await bgCheckinState.Z.enqueue(s);
    return { ok: !0, queued: c.queued, skipped: e.length - c.queued };
  });
}

async function eh(e) {
  let t = [...new Set(e.filter(Boolean))];
  if (t.length === 0) return 0;
  let n = new Set(t),
    r = await bgCheckinState.Z.active(),
    i = Eo(await chrome.storage.session.get(null)).filter((e) => n.has(e.accountId)),
    a = new Set(i.map((e) => e.tabId).filter((e) => e > 0));
  r && n.has(r.accountId) && r.tabId > 0 && a.add(r.tabId);
  for (let e of a)
    (await bgCheckinState.V.remove(e),
      await jh(e, !0).catch(() => {}),
      await Pp(e).catch(() => {}));
  let o = await bgCheckinState.Z.cancel(t),
    s = 0;
  for (let e of t) (await bgCheckinState.V.clearInFlight(e)) && (s += 1);
  let c = new Set(i.map((e) => e.accountId)).size;
  return Math.max(o, s, c);
}

async function th(e) {
  return (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).some(
    (t) => t.id === e.accountId && t.siteId === e.siteId,
  );
}

async function manualWaitLeaseActive(task) {
  if (!task?.manualLoginWaitUntil) return !0;
  const active = await bgCheckinState.Z.active();
  return (
    task.manualLoginWaitUntil > Date.now() &&
    active?.tabId === task.tabId &&
    active?.accountId === task.accountId
  );
}

function wh(e) {
  let t = e.checkin?.url?.trim() || bgSitesState.pr(e);
  if (!t) return e.loginUrl;
  try {
    let n = new URL(t, e.loginUrl);
    return N(e, n.href) ? n.href : e.loginUrl;
  } catch {
    return e.loginUrl;
  }
}

function Th(e) {
  return e.adapter?.quotaPerUnit && e.adapter.quotaPerUnit > 0
    ? e.adapter.quotaPerUnit
    : e.adapter?.family === `new-api`
      ? 5e5
      : 1;
}

async function Eh(e, t = {}) {
  let n = M(e);
  if (!n) return;
  let r = await chrome.tabs.query({ url: `${n}/*` }).catch(() => []);
  if (!t.preferCheckinPage) return (r.find((e) => e.active) ?? r[0])?.id;
  let i = wh(e),
    a = r.find((e) => Dh(e.url, i));
  if (a) return a.id;
  if (Dh(e.loginUrl, i)) return (r.find((e) => e.active) ?? r[0])?.id;
}

function Dh(e, t) {
  if (!e) return !1;
  try {
    let n = new URL(e),
      r = new URL(t),
      i = (e) => e.replace(/\/+$/, ``) || `/`;
    return n.origin === r.origin && i(n.pathname) === i(r.pathname);
  } catch {
    return !1;
  }
}

async function Oh(e, n) {
  let i = e.proxyMode ?? `inherit`;
  if (i === `none`) return { ok: !0 };
  if (i === `custom`) {
    let t = e.customProxy;
    return !t?.host || !t.port
      ? { ok: !1, error: `账号选择了自定义代理，但地址或端口没填完整` }
      : {
          ok: !0,
          proxy: {
            id: `account:${e.id}`,
            name: `${t.host}:${t.port}`,
            scheme: t.scheme,
            host: t.host,
            port: t.port,
            ...(t.username ? { username: t.username } : {}),
            ...(t.password ? { password: t.password } : {}),
          },
        };
  }
  let a = i === `pool` ? e.proxyId : n.proxyId;
  if (!a)
    return i === `pool`
      ? { ok: !1, error: `账号选择了「使用代理池节点」，但没有指定是哪个` }
      : { ok: !0 };
  let o = (await bgPlatformState.t.get(bgPlatformState.r.proxies, [])).find((e) => e.id === a);
  return o
    ? bgSitesState.me(o)
      ? {
          ok: !1,
          error: `「${o.name}」只是节点名称，没有浏览器能用的出口。请打开代理管理，选择 Clash Verge 配置并点击“同步配置”`,
        }
      : { ok: !0, proxy: o }
    : {
        ok: !1,
        error:
          i === `pool`
            ? `账号配置的代理已不存在，请重新选择`
            : `站点配置的代理已不存在，请重新选择`,
      };
}

async function kh(e, t) {
  let n = `标签页导航未生效`;
  for (let r = 1; r <= 5; r += 1) {
    if (!(await chrome.tabs.get(e).catch(() => null))) throw Error(`任务标签页已关闭`);
    try {
      await chrome.tabs.update(e, { url: t });
    } catch (e) {
      ((n = e instanceof Error ? e.message : String(e)),
        await new Promise((e) => setTimeout(e, 150 * r)));
      continue;
    }
    let i = (() => {
      try {
        return new URL(t).origin;
      } catch {
        return null;
      }
    })();
    for (let t = 0; t < 10; t += 1) {
      await new Promise((e) => setTimeout(e, 100));
      let t = await chrome.tabs.get(e).catch(() => null);
      if (!t) throw Error(`任务标签页已关闭`);
      let n = t.url ?? t.pendingUrl ?? ``;
      if (
        (i && n && new URL(n).origin === i) ||
        (n && n !== `about:blank` && !n.startsWith(`chrome://`))
      )
        return;
    }
    n = `标签页导航后仍未离开空白页`;
  }
  throw Error(bgProxiesState.Ee(n, await bgProxiesState.we().catch(() => null)));
}

async function Ah(e, n) {
  let i = await bgPlatformState.t.get(bgPlatformState.r.accounts, []),
    a = i.find((t) => t.id === e);
  if (!a) return { ok: !1, error: `账号不存在` };
  let o = await bgPlatformState.t.get(bgPlatformState.r.sites, []),
    s = bgSitesState.Y(a.siteId, o);
  if (!s) return { ok: !1, error: `站点配置不存在` };
  let d = withSiteIdentityRecipe(s),
    f = bgAccountsState.jt(a, d),
    p = bgAccountsState.Mt(f.loginMethod);
  if (!p) return { ok: !1, error: `本账号选择的登录方式无效，请重新选择` };
  if (!a.username?.trim())
    return { ok: !1, error: `该账号缺少可核验的站点用户名或完整邮箱，请编辑账号后填写` };
  if (p.password && !a.password)
    return { ok: !1, error: `该账号缺少站点密码；请编辑账号并选择「站点账号密码」后填写` };
  if (p.github && (!a.githubUsername?.trim() || !a.githubPassword))
    return { ok: !1, error: `该账号的 GitHub 用户名或密码不完整；请编辑账号后补齐` };
  if (p.passkey && !a.passkey)
    return { ok: !1, error: `该账号未启用 Passkey；请编辑账号并确认登录方式` };
  if (p.token && !a.apiToken?.trim() && !(p.sessionCounts && a.identity?.session?.accessToken))
    return { ok: !1, error: `该账号没有可用的 API Token 或已抓取登录态` };
  let m = Et({
    ...d,
    loginMethod: f.loginMethod,
    checkin: { ...d.checkin, method: f.checkinMethod },
  });
  if (m.length) return { ok: !1, error: `站点配置无效: ${m[0]}` };
  let h =
      f.checkinMethod === `none`
        ? (await bgPlatformState.t.get(bgPlatformState.r.balances, {}))[a.id]
        : void 0,
    g = i.filter((account) => account.siteId === d.id),
    _ =
      ![`github`, `oauth`, `passkey`, `manual`].includes(f.loginMethod) ||
      a.identity?.source === `api` ||
      a.identity?.verifiedByManagedLogin === !0 ||
      a.identity?.verifiedByLearning === !0
        ? a.identity
        : void 0,
    v = a.identity?.userId
      ? g.find((e) => e.id !== a.id && e.identity?.userId === a.identity?.userId)
      : void 0,
    y = v ? void 0 : _?.userId,
    b =
      (!d.adapter && !y) || d.adapter?.userId === y
        ? d
        : { ...d, adapter: { ...d.adapter, userId: y } },
    x = await Oh(a, d);
  if (!x.ok) return { ok: !1, error: x.error };
  let S = x.proxy;
  if (S) {
    let { active: e } = bgLearningState.Of(Object.entries(await chrome.storage.session.get(null)));
    if (e.length > 0)
      return {
        ok: !1,
        error: `有账号正在学习流程，学习会话占用着网络配置；请先结束学习再开始签到（两者不能同时使用代理）`,
      };
  } else {
    let e = await bgProxiesState.we();
    if (e) {
      let t = bgProxiesState.Qo(void 0, e);
      if (t) return { ok: !1, error: t };
    }
    let t = await bgProxiesState.Am();
    if (t)
      return {
        ok: !1,
        error: `${t === `scan` ? `本机端口扫描` : `代理测活`}正在使用网络配置，请完成后再开始签到`,
      };
  }
  if (S) {
    let e = await bgProxiesState.Am();
    if (e)
      return {
        ok: !1,
        error: `${e === `scan` ? `本机端口扫描` : `代理测活`}正在使用网络配置，请完成后再开始签到`,
      };
  }
  if (f.loginMethod !== `manual` && !bgSitesState.ce(d) && !S && !v && g.length === 1) {
    let e = await bgPlatformState.t.get(bgPlatformState.r.headlessStats, {});
    if (sa(e, d.id, Date.now())) {
      let n = await nc(a, b),
        i = ca(e, d.id, Ks(n.verdict), Date.now());
      if ((await bgPlatformState.t.set(bgPlatformState.r.headlessStats, i), Ws(n.verdict)))
        return (
          n.balance && (await bgRecordsState.store.saveBalance(a.id, n.balance)),
          {
            ok: !0,
            completedResult: {
              accountId: a.id,
              ok: !0,
              message: n.message,
              steps: n.steps,
              ...(n.metrics ? { metrics: n.metrics } : {}),
              via: `headless`,
            },
          }
        );
      if (!Gs(n.verdict))
        return {
          ok: !0,
          completedResult: {
            accountId: a.id,
            ok: !1,
            message: n.message,
            steps: n.steps,
            ...(n.metrics ? { metrics: n.metrics } : {}),
            via: `headless`,
          },
        };
      console.info(`[headless] ${d.name}/${a.username}: ${n.verdict} ${n.message}`);
    }
  }
  let C = await chrome.tabs.create({ url: `about:blank`, active: !0 }).catch(() => null);
  if (!C || C.id == null) return { ok: !1, error: `无法创建标签页` };
  let w = Date.now(),
    T = a.githubUsername?.trim(),
    E = bgRecordsState.ki(h, w),
    loginEntry = sanitizeLoginEntry(a.loginEntry),
    D = {
      tabId: C.id,
      runId: bgPlatformState.Ti(`run`),
      accountId: a.id,
      siteId: d.id,
      username: a.username,
      ...(f.loginMethod !== `manual`
        ? {
            password: a.password,
            ...(T ? { githubUsername: T } : {}),
            ...(a.githubPassword ? { githubPassword: a.githubPassword } : {}),
            ...(a.apiToken ? { apiToken: a.apiToken } : {}),
          }
        : {}),
      ...(a.passkey ? { passkey: !0 } : {}),
      ...(a.identity?.session ? { session: a.identity.session } : {}),
      site: {
        ...b,
        loginEntry: loginEntry?.method === f.loginMethod ? loginEntry : void 0,
      },
      loginMethodPreference: a.loginMethod || `auto`,
      effectiveLoginMethod: f.loginMethod,
      ...(loginEntry?.method === f.loginMethod ? { loginEntry } : {}),
      effectiveCheckinMethod: f.checkinMethod,
      usesExtensionProxy: !!S,
      ...(_?.userId ? { accountIdentityUserId: _.userId } : {}),
      ...(_?.username ? { accountIdentityUsername: _.username } : {}),
      ...(_?.email ? { accountIdentityEmail: _.email } : {}),
      siteAccountIdentities: g
        .filter((account) => account.id !== a.id)
        .map((account) => ({
          userId: account.identity?.userId,
          username: account.identity?.username,
          email: account.identity?.email,
          label: account.label || account.username,
        })),
      siteAccountCount: g.length,
      siteAccountUserIds: Object.fromEntries(
        g
          .filter((e) => e.id !== a.id && e.identity?.userId)
          .map((e) => [e.identity.userId, e.label || e.username]),
      ),
      createdAt: w,
      stage: `login`,
      ...(E ? { context: { loginCheckinBalanceBefore: E } } : {}),
      steps: [
        `扩展版本 ${bgPlatformState.im()}`,
        bgAccountsState.Nt(f),
        S
          ? (() => {
              let e = bgProxiesState._e(S),
                t = e.scheme === S.scheme ? `` : `，已将本地 https 网关修正为 http`,
                n = (a.proxyMode ?? `inherit`) === `inherit` ? `站点` : `账号`;
              return `已启用扩展代理「${S.name}」(${e.scheme}://${e.host}:${e.port}${t})，来自${n}配置`;
            })()
          : `使用 Chrome/系统网络设置（扩展未覆盖代理）`,
        ...(f.checkinMethod === `none` ? [E ? bgRecordsState.Pi : bgRecordsState.Vi(h, w)] : []),
        ...(v
          ? [
              `检测到旧数据冲突：站点用户 ID ${a.identity.userId} 也绑定给账号 ${v.label || v.username}，已禁用 API 直连并改为页面重新核对`,
            ]
          : []),
      ],
    };
  try {
    if (S && !(await bgProxiesState.W.acquire(C.id, S)))
      throw Error(`代理正被其他签到任务占用，请等它完成后再试`);
    (await bgCheckinState.V.start(C.id, D), await n(C.id), await kh(C.id, d.loginUrl));
  } catch (e) {
    return (
      await bgCheckinState.V.remove(C.id).catch(() => {}),
      await Pp(C.id).catch(() => {}),
      await bgProxiesState.W.release(C.id).catch(() => {}),
      { ok: !1, error: e instanceof Error ? e.message : String(e) }
    );
  }
  return (bgPlatformState.$(), { ok: !0, tabId: C.id });
}

async function jh(e, t = !1) {
  let n = await bgCheckinState.H.entriesOf(e);
  for (let [r, i] of n) {
    if (!t && i.proxyRetained && i.proxyTransferred) {
      if (
        (await chrome.tabs
          .get(r)
          .then(() => !0)
          .catch(() => !1)) &&
        ((await bgProxiesState.W.holder()) === e &&
          (await bgProxiesState.W.transfer(e, r).catch(() => !1)),
        (await bgProxiesState.W.holder()) === r)
      )
        continue;
      await bgCheckinState.H.forget(r);
    }
    i.proxyTransferred &&
      (await bgCheckinState.H.clearProxyTransferred(r), await bgProxiesState.W.release(r));
  }
  await bgProxiesState.W.release(e);
}

async function Mh(e) {
  return bgPlatformState.rm(async () => {
    let t = await bgCheckinState.Z.active();
    if (
      e.requireActive &&
      (!t || t.tabId !== e.tabId || (e.accountId && t.accountId !== e.accountId))
    )
      return !1;
    let n = await bgCheckinState.V.take(e.tabId, e.runId, e.accountId);
    if (!n) return !1;
    try {
      e.result
        ? await bgCheckinState.V.complete(e.result)
        : e.keepAttention
          ? await bgCheckinState.V.closedTab(
              n.accountId,
              e.failure ?? `签到任务已中断`,
              n.steps ?? [],
            )
          : await bgCheckinState.V.fail(n.accountId, e.failure ?? `签到任务已中断`, n.steps ?? []);
    } catch (t) {
      throw (await bgCheckinState.V.put(e.tabId, n).catch(() => {}), t);
    }
    return (
      e.closeTab && (await Jm(e.tabId)),
      await qm(`释放代理`, () => jh(e.tabId)),
      await qm(`推进签到队列`, () => bgCheckinState.Z.finish(e.tabId)),
      bgPlatformState.$(),
      !0
    );
  });
}

async function Nh(e, t) {
  let n = await bgCheckinState.V.get(e);
  if (!n) return;
  let r = n.usesExtensionProxy ?? !!n.site.proxyId,
    i = bgProxiesState.Pe(t, r, r ? await bgProxiesState.we() : null);
  i &&
    (await Mh({
      tabId: e,
      runId: n.runId,
      accountId: n.accountId,
      failure: i,
      closeTab: !0,
      requireActive: !0,
    }));
}

async function Ph() {
  let e = await bgCheckinState.Z.active();
  const task = e?.tabId > 0 ? await bgCheckinState.V.get(e.tabId) : null;
  if (
    task?.manualLoginWaitUntil &&
    (Date.now() >= task.manualLoginWaitUntil || Date.now() - e.startedAt > bgCheckinState.Hp)
  )
    return Mh({
      tabId: e.tabId,
      runId: task.runId,
      accountId: e.accountId,
      failure: `等待页面登录超过时限，后台已结束任务，请完成验证后重新签到`,
      closeTab: !0,
      requireActive: !0,
    });
  !e ||
    Date.now() - e.startedAt <= bgCheckinState.Hp ||
    ((await bgCheckinState.V.statusOf(e.accountId)) === `attention`
      ? (await jh(e.tabId).catch(() => {}),
        await bgCheckinState.Z.finish(e.tabId),
        bgPlatformState.$())
      : (e.tabId > 0 &&
          (await Mh({
            tabId: e.tabId,
            accountId: e.accountId,
            failure: `签到超过 10 分钟未完成，后台已结束任务`,
            closeTab: !0,
            requireActive: !0,
          }))) ||
        (await bgPlatformState.rm(async () => {
          let t = await bgCheckinState.Z.active();
          if (!t || t.accountId !== e.accountId || t.tabId !== e.tabId) return;
          t.tabId > 0 && (await Pp(t.tabId).catch(() => {}), await jh(t.tabId));
          let n = await bgCheckinState.V.statusOf(t.accountId);
          (n !== `done` &&
            n !== `failed` &&
            (await bgCheckinState.V.fail(t.accountId, `签到任务状态丢失，后台已安全结束`)),
            await bgCheckinState.Z.finish(t.tabId),
            bgPlatformState.$());
        })));
}

async function Fh() {
  let [e, i, a] = await Promise.all([
      bgPlatformState.t.get(bgPlatformState.r.status, {}),
      bgPlatformState.n.get(bgCheckinState.bo, { pendingAccountIds: [] }),
      chrome.storage.session.get(null),
    ]),
    o = Oo({
      statuses: e,
      day: bgPlatformState.Ci(),
      activeAccountId: i.active?.accountId,
      pendingAccountIds: i.pendingAccountIds,
      liveAccountIds: Eo(a).map((e) => e.accountId),
    });
  if (o.length === 0) return;
  let s = 0;
  for (let e of o) (await bgCheckinState.V.clearInFlight(e)) && (s += 1);
  s && bgPlatformState.$();
}

async function Ih(e) {
  if (!e) return;
  let t = await Po(e).catch(() => []);
  for (let e of t) await Jm(e).catch(() => {});
}

Object.assign(bgCheckinState, {
  qe,
  Je,
  Ye,
  Xe,
  Ze,
  Qe,
  $e,
  et,
  tt,
  nt,
  rt,
  it,
  at,
  ot,
  st,
  M,
  ct,
  lt,
  ut,
  N,
  dt,
  ft,
  pt,
  mt,
  ht,
  gt,
  _t,
  vt,
  yt,
  bt,
  wt,
  Tt,
  Et,
  Dt,
  wi,
  Ki,
  qi,
  Ji,
  Yi,
  Xi,
  Zi,
  Qi,
  $i,
  sa,
  ca,
  la,
  Co,
  wo,
  Eo,
  Oo,
  ko,
  Mo,
  No,
  Po,
  B,
  zo,
  Vo,
  Ho,
  Wo,
  Go,
  Ko,
  qo,
  Jo,
  ys,
  xs,
  Ss,
  js,
  Ms,
  Ns,
  Ps,
  Fs,
  Ws,
  Gs,
  Ks,
  Js,
  Ys,
  Xs,
  Zs,
  Qs,
  $s,
  ec,
  tc,
  nc,
  rc,
  Pp,
  Fp,
  Ip,
  Lp,
  Up,
  Wp,
  Gp,
  sm,
  cm,
  lm,
  um,
  dm,
  fm,
  pm,
  mm,
  hm,
  gm,
  _m,
  vm,
  ym,
  bm,
  xm,
  Sm,
  Cm,
  wm,
  Tm,
  Em,
  qm,
  Jm,
  Ym,
  Xm,
  Zm,
  Qm,
  $m,
  eh,
  th,
  wh,
  Th,
  Eh,
  Dh,
  Oh,
  kh,
  Ah,
  jh,
  Mh,
  Nh,
  Ph,
  Fh,
  Ih,
});

export async function handleCheckinMessage(e, i) {
  switch (e.type) {
    case `START_LOGIN`:
      return $m([e.accountId]);
    case `START_BATCH`:
      return $m(e.accountIds);
    case `CANCEL_CHECKIN`:
      return bgEntryState.Q(i)
        ? bgPlatformState.X(async () =>
            bgPlatformState.rm(async () => {
              let t = await eh(e.accountIds);
              return (bgPlatformState.$(), { ok: !0, feature: { stopped: t } });
            }),
          )
        : { ok: !1, error: `仅扩展管理页可以停止签到` };
    case `GET_TASK`: {
      let e = i.tab?.id;
      if (e == null) return { ok: !0, task: null };
      if (!bgProxiesState.Xn(i.frameId)) {
        let t = await bgPlatformState.n.get(bgLearningState.a(e), null);
        return t && (await bgLearningState.Fm(t, i))
          ? { ok: !0, task: null, feature: { learningSession: t } }
          : { ok: !0, task: null };
      }
      let t = await bgCheckinState.V.get(e);
      if (!t?.runId) {
        let t = await bgPlatformState.n.get(bgLearningState.a(e), null);
        return t && (await bgLearningState.Fm(t, i))
          ? { ok: !0, task: null, feature: { learningSession: t } }
          : { ok: !0, task: await wm(e, i.url ?? i.tab?.url, i.tab?.openerTabId) };
      }
      if (!(await manualWaitLeaseActive(t))) {
        await Mh({
          tabId: e,
          runId: t.runId,
          accountId: t.accountId,
          failure: `页面登录等待已结束，请完成验证后重新签到`,
          requireActive: !1,
        });
        return { ok: !0, task: null };
      }
      if (!ut(t, i.url ?? i.tab?.url)) {
        let n = i.url ?? i.tab?.url ?? ``,
          r = Cm(t, n);
        return r
          ? { ok: !0, task: r }
          : (t.stage === `verify-oauth` &&
              !vt(n) &&
              (await bgCheckinState.V.markAttention(
                e,
                t.runId,
                `OAuth 等待你在授权页面完成操作`,
                t.steps ?? [],
              )) &&
              bgPlatformState.$(),
            { ok: !0, task: null });
      }
      return (
        (await bgCheckinState.V.resumeAttention(e, t.runId)) && bgPlatformState.$(),
        { ok: !0, task: t }
      );
    }
    case `RESOLVE_LOGIN_METHOD`:
      return bgPlatformState.X(async () => {
        const tabId = i.tab?.id,
          method = e.method;
        if (
          tabId == null ||
          i.id !== chrome.runtime.id ||
          i.frameId !== 0 ||
          ![`form`, `github`, `oauth`, `passkey`, `manual`].includes(method)
        )
          return { ok: !1, error: `只能由当前任务的本站顶层页面识别受支持的登录方式` };
        const task = await bgCheckinState.V.get(tabId);
        if (
          !task ||
          task.runId !== e.runId ||
          (task.loginMethodPreference ?? `auto`) !== `auto` ||
          ![
            `login`,
            `verify`,
            `verify-oauth`,
            `verify-manual`,
            `relogin`,
            `relogin-verify`,
            `relogin-verify-manual`,
          ].includes(task.stage) ||
          !N(task.site, i.url ?? i.tab?.url ?? ``)
        )
          return { ok: !1, error: `任务已结束或本账号不允许按当前页面识别登录方式` };
        const current = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find(
          (account) => account.id === task.accountId,
        );
        if (
          !current ||
          current.siteId !== task.siteId ||
          (current.loginMethod && current.loginMethod !== `auto`) ||
          !current.username?.trim() ||
          current.username?.trim() !== task.username?.trim()
        )
          return { ok: !1, error: `本账号的登录偏好或站点归属已改变，已拒绝旧页面的识别结果` };
        if (
          method === `form` &&
          (!task.username?.trim() || !task.password || current.password !== task.password)
        )
          return { ok: !1, error: `当前页面需要站点账号密码，请补齐本账号的站点登录凭据` };
        if (
          method === `github` &&
          (!task.githubUsername?.trim() ||
            !task.githubPassword ||
            current.githubUsername?.trim() !== task.githubUsername.trim() ||
            current.githubPassword !== task.githubPassword)
        )
          return { ok: !1, error: `当前页面需要 GitHub 登录，请补齐本账号的 GitHub 用户名和密码` };
        if (method === `passkey` && (!current.passkey || !task.passkey))
          return { ok: !1, error: `本账号尚未启用 Passkey，请在账号设置中启用后重试` };
        const entry = sanitizeLoginEntry(e.loginEntry);
        if (e.loginEntry != null && (!entry || entry.method !== method))
          return { ok: !1, error: `当前页面的具体登录入口与识别方式不一致` };
        const resolved = await bgCheckinState.V.resolveLoginMethod(
          tabId,
          task.runId,
          method,
          entry,
        );
        return resolved
          ? {
              ok: !0,
              feature: {
                effectiveLoginMethod: resolved.effectiveLoginMethod,
                ...(resolved.loginEntry ? { loginEntry: resolved.loginEntry } : {}),
              },
            }
          : { ok: !1, error: `任务已结束，未能保存页面识别的登录方式` };
      });
    case `FORM_CREDENTIALS_SUBMITTED`:
      return bgPlatformState.X(async () => {
        let tabId = i.tab?.id;
        if (tabId == null || i.id !== chrome.runtime.id || i.frameId !== 0)
          return { ok: !1, error: `只能由当前任务的本站顶层页面确认账密提交` };
        let task = await bgCheckinState.V.get(tabId);
        if (
          !task ||
          task.runId !== e.runId ||
          task.effectiveLoginMethod !== `form` ||
          ![`login`, `verify`, `relogin`, `relogin-verify`].includes(task.stage) ||
          !ut(task, i.url ?? i.tab?.url ?? ``)
        )
          return { ok: !1, error: `任务已结束或当前页面不允许确认站点账密提交` };
        let current = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find(
          (account) => account.id === task.accountId,
        );
        if (
          !current ||
          current.siteId !== task.siteId ||
          !task.username?.trim() ||
          !task.password ||
          current.username?.trim() !== task.username.trim() ||
          current.password !== task.password
        )
          return { ok: !1, error: `本轮登录凭据或账号归属已改变，已拒绝确认提交` };
        return (await bgCheckinState.V.setFormCredentialsSubmitted(tabId, task.runId, !0))
          ? { ok: !0, feature: { formCredentialsSubmitted: !0 } }
          : { ok: !1, error: `任务已结束，未能保存账密提交状态` };
      });
    case `SET_STAGE`: {
      let t = i.tab?.id;
      if (t != null && !(await manualWaitLeaseActive(await bgCheckinState.V.get(t))))
        return { ok: !1, error: `页面登录等待已结束，请重新签到` };
      return t == null
        ? { ok: !1, error: `缺少任务标签页` }
        : (await bgCheckinState.V.updateStage(
              t,
              e.runId,
              e.stage,
              e.steps,
              e.resetLoginMethod === !0,
            ))
          ? (bgPlatformState.$(), { ok: !0 })
          : { ok: !1, error: `任务已结束` };
    }
    case `GITHUB_LOGOUT_COMPLETE`: {
      let t = i.tab?.id,
        n = i.url ?? i.tab?.url;
      if (t == null || (!gt(n) && !_t(n)))
        return { ok: !1, error: `仅 GitHub 官方退出流程可以完成账号切换` };
      let r = await bgCheckinState.V.get(t);
      if (
        !r ||
        r.runId !== e.runId ||
        r.stage !== `github-logout` ||
        r.effectiveLoginMethod !== `github` ||
        !r.githubUsername ||
        !r.githubPassword
      )
        return { ok: !1, error: `任务已结束或不允许切换 GitHub 账号` };
      let a = [...e.steps, `当前 GitHub 会话已退出，返回站点并登录目标账号`];
      return (
        await bgCheckinState.V.setGithubCredentialsSubmitted(t, r.runId, !1),
        (await bgCheckinState.V.updateStage(t, r.runId, `login`, a))
          ? (bgPlatformState.$(), await chrome.tabs.update(t, { url: r.site.loginUrl }), { ok: !0 })
          : { ok: !1, error: `任务已结束` }
      );
    }
    case `CONFIRM_IDENTITY`: {
      let t = i.tab?.id;
      if (t != null && !(await manualWaitLeaseActive(await bgCheckinState.V.get(t))))
        return { ok: !1, error: `页面登录等待已结束，请重新签到` };
      return t == null
        ? { ok: !1, error: `缺少任务标签页` }
        : (await bgCheckinState.V.confirmIdentity(t, e.runId))
          ? { ok: !0 }
          : { ok: !1, error: `任务已结束` };
    }
    case `SAVE_WORKFLOW_ROUTE`: {
      let t = i.tab?.id;
      if (t == null) return { ok: !1, error: `缺少任务标签页` };
      let n = await bgCheckinState.V.get(t);
      return !n || !bgProxiesState.Xn(i.frameId) || !N(n.site, i.url ?? i.tab?.url ?? ``)
        ? { ok: !1, error: `只能由当前任务的本站顶层页面保存学习路线` }
        : (await bgCheckinState.V.saveWorkflowRouteIndex(t, e.runId, e.index))
          ? { ok: !0 }
          : { ok: !1, error: `任务已结束或学习路线进度无效` };
    }
    case `NEEDS_USER`: {
      let t = i.tab?.id;
      if (t == null) return { ok: !1, error: `缺少任务标签页` };
      let n = (await bgCheckinState.V.get(t))?.runId
        ? t
        : yt(i.url ?? i.tab?.url)
          ? ((await bgCheckinState.Z.active())?.tabId ?? t)
          : t;
      return (
        ht(i.url ?? i.tab?.url) &&
          (await bgCheckinState.V.setGithubCredentialsSubmitted(n, e.runId, !1)),
        (await bgCheckinState.V.markAttention(n, e.runId, e.message, e.steps))
          ? (await jh(n).catch(() => {}),
            await bgCheckinState.Z.finish(n),
            bgPlatformState.$(),
            { ok: !0 })
          : { ok: !1, error: `任务已结束` }
      );
    }
    case `MANUAL_LOGIN_WAITING`:
      return bgPlatformState.rm(async () => {
        const tabId = i.tab?.id;
        if (tabId == null || i.id !== chrome.runtime.id || i.frameId !== 0)
          return { ok: !1, error: `只能由当前任务的本站顶层页面等待页面登录` };
        const task = await bgCheckinState.V.get(tabId),
          active = await bgCheckinState.Z.active();
        if (
          !task ||
          task.runId !== e.runId ||
          task.effectiveLoginMethod !== `manual` ||
          ![`verify-manual`, `relogin-verify-manual`].includes(task.stage) ||
          !N(task.site, i.url ?? i.tab?.url ?? ``) ||
          !active ||
          active.tabId !== tabId ||
          active.accountId !== task.accountId ||
          !(await th(task))
        )
          return { ok: !1, error: `页面登录任务已结束或不再持有当前执行队列` };
        if (typeof e.message !== `string` || !Array.isArray(e.steps))
          return { ok: !1, error: `页面登录等待提示格式无效` };
        const deadline =
          task.manualLoginWaitUntil ??
          Math.min(Date.now() + 3e5, active.startedAt + bgCheckinState.Hp);
        if (!Number.isFinite(deadline) || deadline <= Date.now())
          return { ok: !1, error: `页面登录等待已超时，请重新签到` };
        const attention = await bgCheckinState.V.markAttention(
          tabId,
          task.runId,
          e.message,
          e.steps,
        );
        if (!attention) return { ok: !1, error: `任务已结束` };
        await bgCheckinState.V.update(tabId, (current) =>
          current.runId === task.runId ? { ...current, manualLoginWaitUntil: deadline } : current,
        );
        bgPlatformState.$();
        return { ok: !0, feature: { manualLoginWaitUntil: deadline } };
      });
    case `TASK_RESULT`: {
      let t = i.tab?.id;
      if (t == null) return { ok: !1, error: `缺少任务标签页` };
      let n = await bgCheckinState.V.get(t),
        r =
          e.result.ok && (n?.siteAccountCount ?? 0) > 1 && !n?.identityConfirmed
            ? {
                accountId: n?.accountId ?? e.result.accountId,
                ok: !1,
                message: `本轮未确认当前页面属于该账号，已拒绝记录签到成功和增加量`,
                steps: [
                  ...(e.result.steps ?? []),
                  `最终身份闸门未通过：多账号站点必须先确认页面账号，结果已改记为失败`,
                ],
              }
            : e.result,
        a = await Mh({
          tabId: t,
          runId: e.runId,
          accountId: r.accountId,
          result: r,
          requireActive: !0,
        });
      return (
        a && r.ok && (await Ym(r.accountId, r.metrics), Xm(t, n?.siteId, r.accountId)),
        a && !r.ok && (await Ih(n?.siteId)),
        a ? { ok: !0 } : { ok: !1, error: `任务已结束` }
      );
    }
    case `GET_LIVE_TASKS`: {
      if (!bgEntryState.Q(i)) return { ok: !1, error: `仅扩展管理页可以查询实时状态` };
      let [e, t] = await Promise.all([
        chrome.storage.session.get(null),
        bgPlatformState.n.get(bgCheckinState.bo, { pendingAccountIds: [] }),
      ]);
      return {
        ok: !0,
        feature: { live: Eo(e), queue: { active: t.active, pending: t.pendingAccountIds } },
      };
    }
    case `SYNC_PROGRESS`: {
      let t = i.tab?.id;
      return t == null
        ? { ok: !1, error: `缺少任务标签页` }
        : (await bgCheckinState.V.updateProgress(t, e.runId, e.steps))
          ? (bgPlatformState.$(), { ok: !0 })
          : { ok: !1, error: `任务已结束` };
    }
    case `CLAIM_TEXT_USED`: {
      let t = i.tab?.id;
      if (t == null) return { ok: !1, error: `缺少任务标签页` };
      let n = await bgCheckinState.V.get(t);
      return !n || n.runId !== e.runId
        ? { ok: !1, error: `任务已结束` }
        : n.site.id === e.siteId
          ? (await Qm(e.siteId, e.text), { ok: !0 })
          : { ok: !1, error: `站点与当前任务不一致` };
    }
  }
}

export async function handleCheckinMutation(e) {
  switch (e.action) {
    case `update-schedule`:
      return (await bgCheckinState.store.updateSchedule(e.schedule), await gm(), { ok: !0 });
    case `set-status`:
      return (await bgCheckinState.V.setStatus(e.accountId, e.value), { ok: !0 });
    case `mark-done`:
      return (await bgCheckinState.V.markDone(e.accountId), { ok: !0 });
  }
}

export function initializeBackgroundCheckin(step) {
  switch (step) {
    case 3: {
      bgCheckinState.i = (e) => `task:${e}`;
      break;
    }
    case 5: {
      bgCheckinState.o = [
        `.semi-modal-close`,
        `.semi-modal-footer button.semi-button-tertiary`,
        `[aria-label="close" i]`,
        `[aria-label*="关闭"]`,
        `.ant-modal-close`,
        `.ant-modal-close-x`,
        `.modal-close`,
        `button.close`,
        `.close-btn`,
        `[data-slot="dialog-close"]`,
        `[data-radix-dialog-close]`,
        `[data-radix-collection-item][aria-label*="Close" i]`,
        `[role="dialog"] > button:has(> svg)`,
        `[role="alertdialog"] > button:has(> svg)`,
        `[role="dialog"] header button:has(> svg)`,
      ];
      break;
    }
    case 6: {
      bgCheckinState.s = [
        `input[autocomplete="username"]`,
        `input[autocomplete="email"]`,
        `input[type="email"]`,
        `#username`,
        `#email`,
        `input[name="username"]`,
        `input[name="email"]`,
        `input[placeholder*="用户名"]`,
        `input[placeholder*="账号"]`,
        `input[placeholder*="邮箱"]`,
      ];
      break;
    }
    case 7: {
      bgCheckinState.c = [
        `input[autocomplete="current-password"]`,
        `#password`,
        `input[name="password"]`,
        `input[type="password"]`,
      ];
      break;
    }
    case 8: {
      [`button:has(> span:only-child)`, `.checkin-btn`, `#checkin`, `[data-testid="checkin"]`].join(
        `, `,
      );
      break;
    }
    case 42: {
      bgCheckinState.Le = 30;
      break;
    }
    case 43: {
      bgCheckinState.Re = 3e4;
      break;
    }
    case 44: {
      bgCheckinState.ze = 4;
      break;
    }
    case 45: {
      bgCheckinState.Be = 300;
      break;
    }
    case 46: {
      bgCheckinState.Ve = 200;
      break;
    }
    case 47: {
      bgCheckinState.He = 1e4;
      break;
    }
    case 48: {
      bgCheckinState.Ue = 12;
      break;
    }
    case 49: {
      bgCheckinState.We = new Set([
        `Enter`,
        `Space`,
        `Escape`,
        `Tab`,
        `ArrowUp`,
        `ArrowDown`,
        `ArrowLeft`,
        `ArrowRight`,
      ]);
      break;
    }
    case 50: {
      bgCheckinState.Ge = new Set([`click`, `double`, `right`, `long-press`]);
      break;
    }
    case 51: {
      bgCheckinState.Ke = new Set([`text`, `select`, `checkbox`, `radio`]);
      break;
    }
    case 52: {
      bgCheckinState.xt =
        /(?:^|\.)accounts\.google\.com$|(?:^|\.)github\.com$|(?:^|\.)login\.microsoftonline\.com$|(?:^|\.)login\.live\.com$|(?:^|\.)appleid\.apple\.com$|(?:^|\.)discord(?:app)?\.com$|(?:^|\.)linux\.do$/i;
      break;
    }
    case 53: {
      bgCheckinState.St =
        /(?:^|\/)(?:oauth2?|authorize|authorization|auth|sso|signin|sign-in|login|account|openid|connect|consent|identity|passkey|webauthn)(?:\/|$)/i;
      break;
    }
    case 54: {
      bgCheckinState.Ct =
        /(?:^|[?&])(?:client_id|redirect_uri|response_type|code_challenge|code_verifier|scope|state|oauth|openid|sso)=/i;
      break;
    }
    case 111: {
      bgCheckinState.Wi = { enabled: !1, time: `09:00`, weekdays: [1, 2, 3, 4, 5] };
      break;
    }
    case 112: {
      bgCheckinState.Gi = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
      break;
    }
    case 115: {
      bgCheckinState.aa = 864e5;
      break;
    }
    case 116: {
      bgCheckinState.oa = () => ({ consecutiveFailures: 0 });
      break;
    }
    case 146: {
      Object.assign(bgCheckinState.store, {
        updateSchedule(e) {
          return bgPlatformState.R(async () => {
            await bgPlatformState.t.set(bgPlatformState.r.schedule, Ki(e));
          });
        },
      });
      break;
    }
    case 147: {
      Object.assign(bgCheckinState.store, {
        async setStatus(e, n) {
          return bgPlatformState.R(async () => {
            let i = await bgPlatformState.t.get(bgPlatformState.r.status, {});
            return (
              n === `pending` ? delete i[e] : (i[e] = n),
              await bgPlatformState.t.set(bgPlatformState.r.status, i),
              { ...i }
            );
          });
        },
      });
      break;
    }
    case 148: {
      Object.assign(bgCheckinState.store, {
        async clearInFlightStatus(e) {
          return bgPlatformState.R(async () => {
            let n = await bgPlatformState.t.get(bgPlatformState.r.status, {});
            return n[e] !== `running` && n[e] !== `attention`
              ? !1
              : (delete n[e], await bgPlatformState.t.set(bgPlatformState.r.status, n), !0);
          });
        },
      });
      break;
    }
    case 149: {
      Object.assign(bgCheckinState.store, {
        async getStatus(e) {
          return (await bgPlatformState.t.get(bgPlatformState.r.status, {}))[e];
        },
      });
      break;
    }
    case 150: {
      Object.assign(bgCheckinState.store, {
        markDone(e) {
          return bgPlatformState.R(async () => {
            let [n, i, a] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.status, {}),
                bgPlatformState.t.get(bgPlatformState.r.results, {}),
                bgPlatformState.t.get(bgPlatformState.r.balances, {}),
              ]),
              o = bgRecordsState._a(e, a[e]);
            ((n[wi(e)] = `done`),
              (i[e] = { ...o, at: Date.now() }),
              await bgPlatformState.t.setMany({
                [bgPlatformState.r.status]: n,
                [bgPlatformState.r.results]: i,
              }));
          });
        },
      });
      break;
    }
    case 151: {
      Object.assign(bgCheckinState.store, {
        async setStatusUnlessTerminal(e, n) {
          return bgPlatformState.R(async () => {
            let i = await bgPlatformState.t.get(bgPlatformState.r.status, {});
            return i[e] === `done` || i[e] === `failed`
              ? !1
              : (n === `pending` ? delete i[e] : (i[e] = n),
                await bgPlatformState.t.set(bgPlatformState.r.status, i),
                !0);
          });
        },
      });
      break;
    }
    case 152: {
      Object.assign(bgCheckinState.store, {
        async setStatusIfExpected(e, n, i) {
          return bgPlatformState.R(async () => {
            let a = await bgPlatformState.t.get(bgPlatformState.r.status, {});
            return (
              a[e] === n &&
              (i === `pending` ? delete a[e] : (a[e] = i),
              await bgPlatformState.t.set(bgPlatformState.r.status, a),
              !0)
            );
          });
        },
      });
      break;
    }
    case 153: {
      Object.assign(bgCheckinState.store, {
        setStatusAndResult(e, n) {
          return bgPlatformState.R(async () => {
            let [i, a] = await Promise.all([
              bgPlatformState.t.get(bgPlatformState.r.status, {}),
              bgPlatformState.t.get(bgPlatformState.r.results, {}),
            ]);
            ((i[wi(n.accountId)] = e),
              (a[n.accountId] = { ...n, at: Date.now() }),
              await bgPlatformState.t.setMany({
                [bgPlatformState.r.status]: i,
                [bgPlatformState.r.results]: a,
              }));
          });
        },
      });
      break;
    }
    case 154: {
      Object.assign(bgCheckinState.store, {
        setOutcome(e) {
          return this.setStatusAndResult(e.ok ? `done` : `failed`, e);
        },
      });
      break;
    }
    case 155: {
      bgCheckinState.bo = `checkinQueue`;
      break;
    }
    case 156: {
      bgCheckinState.xo = () => ({ pendingAccountIds: [] });
      break;
    }
    case 157: {
      bgCheckinState.So = 6e4;
      break;
    }
    case 158: {
      bgCheckinState.To = `task:`;
      break;
    }
    case 159: {
      bgCheckinState.Do = new Set([`running`, `attention`]);
      break;
    }
    case 160: {
      bgCheckinState.Ao = (e) => `keptSiteTabs:${e}`;
      break;
    }
    case 161: {
      bgCheckinState.jo = Promise.resolve();
      break;
    }
    case 162: {
      bgCheckinState.Fo = Promise.resolve();
      break;
    }
    case 163: {
      bgCheckinState.V = {
        get(e) {
          return bgPlatformState.n.get(bgCheckinState.i(e), null);
        },
        async rebind(e, t, r) {
          return B(async () => {
            let a = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            return !a || a.runId !== r
              ? null
              : (await bgPlatformState.n.set(bgCheckinState.i(t), { ...a, tabId: t }),
                await bgPlatformState.n.remove(bgCheckinState.i(e)),
                { ...a, tabId: t });
          });
        },
        put(e, t) {
          return B(() => bgPlatformState.n.set(bgCheckinState.i(e), t));
        },
        update(e, t) {
          return B(async () => {
            let r = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            if (!r) return null;
            let a = t(r);
            return a === r ? r : (await bgPlatformState.n.set(bgCheckinState.i(e), a), a);
          });
        },
        start(e, t) {
          return B(async () => {
            (await bgPlatformState.n.set(bgCheckinState.i(e), t),
              await bgCheckinState.store.setStatus(wi(t.accountId), `running`));
          });
        },
        remove(e) {
          return B(() => bgPlatformState.n.remove(bgCheckinState.i(e)));
        },
        take(e, t, r) {
          return B(async () => {
            let a = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            return !a || (t && a.runId !== t) || (r && a.accountId !== r)
              ? null
              : (await bgPlatformState.n.remove(bgCheckinState.i(e)), a);
          });
        },
        updateStage(e, t, r, a, resetLoginMethod = !1) {
          return B(async () => {
            let o = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            if (!o || o.runId !== t) return null;
            let s = { ...o, stage: r, steps: a };
            if (![`verify-manual`, `relogin-verify-manual`].includes(r))
              delete s.manualLoginWaitUntil;
            return (
              (r === `login` || r === `github-logout` || r === `relogin`) &&
                ((s.identityConfirmed = !1),
                delete s.workflowRouteIndex,
                (s.formCredentialsSubmitted = !1),
                s.loginMethodPreference === `auto` &&
                  r !== `github-logout` &&
                  (o.stage !== r || resetLoginMethod) &&
                  ((s.effectiveLoginMethod = `auto`),
                  delete s.loginEntry,
                  (s.site = { ...s.site, loginEntry: void 0 }),
                  (s.githubCredentialsSubmitted = !1)),
                r !== `relogin` && (s.githubCredentialsSubmitted = !1)),
              await bgPlatformState.n.set(bgCheckinState.i(e), s),
              await bgCheckinState.store.setStatusUnlessTerminal(wi(o.accountId), `running`),
              s
            );
          });
        },
        updateProgress(e, t, r) {
          return B(async () => {
            let a = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            if (!a || a.runId !== t) return null;
            if (r.length < (a.steps?.length ?? 0)) return a;
            let o = { ...a, steps: r };
            return (await bgPlatformState.n.set(bgCheckinState.i(e), o), o);
          });
        },
        saveReloginBalanceBefore(e, t, r) {
          return B(async () => {
            let a = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            if (!a || a.runId !== t) return null;
            let o = { ...a, context: { ...a.context, balanceBefore: r } };
            return (await bgPlatformState.n.set(bgCheckinState.i(e), o), o);
          });
        },
        saveButtonBalanceBefore(e, t, r) {
          return B(async () => {
            let a = await bgPlatformState.n.get(bgCheckinState.i(e), null),
              o = a?.effectiveCheckinMethod ?? a?.site.checkin?.method;
            if (
              !a ||
              a.runId !== t ||
              a.stage !== `checkin` ||
              o !== `button` ||
              ((a.siteAccountCount ?? 0) > 1 && !a.identityConfirmed)
            )
              return null;
            let s = { ...a, context: { ...a.context, balanceBefore: r, buttonCheckinPending: !0 } };
            return (await bgPlatformState.n.set(bgCheckinState.i(e), s), s);
          });
        },
        saveWorkflowRouteIndex(e, t, r) {
          return B(async () => {
            let a = await bgPlatformState.n.get(bgCheckinState.i(e), null),
              o = a?.site.checkin?.workflow?.route;
            if (!a || a.runId !== t || !o?.length || !Number.isInteger(r) || r < 0 || r >= o.length)
              return null;
            if (a.workflowRouteIndex !== void 0 && r < a.workflowRouteIndex) return a;
            let s = { ...a, workflowRouteIndex: r };
            return (await bgPlatformState.n.set(bgCheckinState.i(e), s), s);
          });
        },
        confirmIdentity(e, t) {
          return B(async () => {
            let r = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            if (!r || r.runId !== t) return null;
            let a = { ...r, identityConfirmed: !0 };
            return (await bgPlatformState.n.set(bgCheckinState.i(e), a), a);
          });
        },
        setGithubCredentialsSubmitted(e, t, r) {
          return B(async () => {
            let a = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            if (!a || a.runId !== t || a.effectiveLoginMethod !== `github`) return null;
            let o = { ...a, githubCredentialsSubmitted: r };
            return (await bgPlatformState.n.set(bgCheckinState.i(e), o), o);
          });
        },
        setFormCredentialsSubmitted(e, t, r) {
          return B(async () => {
            let a = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            if (!a || a.runId !== t || a.effectiveLoginMethod !== `form`) return null;
            let o = { ...a, formCredentialsSubmitted: r };
            return (await bgPlatformState.n.set(bgCheckinState.i(e), o), o);
          });
        },
        resolveLoginMethod(e, t, method, entry = null) {
          return B(async () => {
            const task = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            if (!task || task.runId !== t || (task.loginMethodPreference ?? `auto`) !== `auto`)
              return null;
            const sameEntry = JSON.stringify(task.loginEntry ?? null) === JSON.stringify(entry);
            if (task.effectiveLoginMethod === method && sameEntry) return task;
            const resolved = {
              ...task,
              site: { ...task.site, loginEntry: entry || void 0 },
              effectiveLoginMethod: method,
              identityConfirmed: !1,
              formCredentialsSubmitted: !1,
              githubCredentialsSubmitted: !1,
            };
            if (entry) resolved.loginEntry = entry;
            else delete resolved.loginEntry;
            delete resolved.workflowRouteIndex;
            await bgPlatformState.n.set(bgCheckinState.i(e), resolved);
            return resolved;
          });
        },
        updateIdentity(e, t, r) {
          return B(async () => {
            let a = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            if (!a || a.runId !== t) return null;
            let o = { ...(a.siteAccountUserIds ?? {}) };
            if (
              r.userId &&
              (o[r.userId] || (a.accountIdentityUserId && a.accountIdentityUserId !== r.userId))
            )
              return null;
            let s = {
              ...a,
              ...(r.userId ? { accountIdentityUserId: r.userId } : {}),
              ...(r.username ? { accountIdentityUsername: r.username } : {}),
              ...(r.email ? { accountIdentityEmail: r.email } : {}),
              siteAccountUserIds: o,
              ...(r.userId
                ? { site: { ...a.site, adapter: { ...a.site.adapter, userId: r.userId } } }
                : {}),
            };
            return (await bgPlatformState.n.set(bgCheckinState.i(e), s), s);
          });
        },
        resumeAttention(e, t) {
          return B(async () => {
            let r = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            return !r || r.runId !== t
              ? !1
              : bgCheckinState.store.setStatusIfExpected(wi(r.accountId), `attention`, `running`);
          });
        },
        markAttention(e, t, r, a) {
          return B(async () => {
            let o = await bgPlatformState.n.get(bgCheckinState.i(e), null);
            if (!o || o.runId !== t) return null;
            let s = { ...o, steps: a };
            return (
              await bgPlatformState.n.set(bgCheckinState.i(e), s),
              await bgCheckinState.store.setStatusAndResult(`attention`, {
                accountId: o.accountId,
                ok: !1,
                message: r,
                steps: a,
              }),
              s
            );
          });
        },
        async setStatus(e, t) {
          await bgCheckinState.store.setStatus(wi(e), t);
        },
        async markDone(e) {
          await bgCheckinState.store.markDone(e);
        },
        async clearInFlight(e) {
          return bgCheckinState.store.clearInFlightStatus(wi(e));
        },
        async statusOf(e) {
          return bgCheckinState.store.getStatus(wi(e));
        },
        complete(e) {
          return B(() => bgCheckinState.store.setOutcome(e));
        },
        fail(e, t, n = []) {
          return B(() =>
            bgCheckinState.store.setOutcome({ accountId: e, ok: !1, message: t, steps: n }),
          );
        },
        closedTab(e, t, n = []) {
          return B(
            async () =>
              (await bgCheckinState.store.getStatus(wi(e))) === `attention` ||
              (await bgCheckinState.store.setOutcome({
                accountId: e,
                ok: !1,
                message: t,
                steps: n,
              }),
              !1),
          );
        },
      };
      break;
    }
    case 164: {
      bgCheckinState.Lo = `oauthPopupOpeners`;
      break;
    }
    case 165: {
      bgCheckinState.Ro = Promise.resolve();
      break;
    }
    case 166: {
      bgCheckinState.Bo = () => bgPlatformState.n.get(bgCheckinState.Lo, {});
      break;
    }
    case 167: {
      bgCheckinState.Uo = (e) =>
        chrome.tabs
          .get(e)
          .then(() => !0)
          .catch(() => !1);
      break;
    }
    case 168: {
      bgCheckinState.H = {
        remember(e, t) {
          return zo(() =>
            Ho((n) => {
              let r = n[String(e)];
              n[String(e)] = { ...r, openerTabId: t };
            }),
          );
        },
        get(e) {
          return zo(async () => (await bgCheckinState.Bo())[String(e)]);
        },
        entries() {
          return zo(async () =>
            Object.entries(await bgCheckinState.Bo()).map(([e, t]) => [Number(e), t]),
          );
        },
        entriesOf(e) {
          return zo(async () =>
            Object.entries(await bgCheckinState.Bo())
              .filter(([, t]) => t.openerTabId === e)
              .map(([e, t]) => [Number(e), t]),
          );
        },
        markProxyTransferred(e, t) {
          return zo(() =>
            Ho((n) => {
              let r = String(e),
                i = n[r];
              i && (n[r] = { ...i, provider: t, proxyTransferred: !0 });
            }),
          );
        },
        clearProxyTransferred(e) {
          return zo(() =>
            Ho((t) => {
              let n = String(e),
                r = t[n];
              r && (t[n] = { ...r, proxyTransferred: !1, proxyRetained: !1 });
            }),
          );
        },
        markProxyRetained(e, t = !0) {
          return zo(() =>
            Ho((n) => {
              let r = String(e),
                i = n[r];
              i && (n[r] = { ...i, proxyRetained: t });
            }),
          );
        },
        forget(e) {
          return zo(() =>
            Ho((t) => {
              delete t[String(e)];
            }),
          );
        },
        transferredPopupsOf(e) {
          return zo(async () =>
            Object.entries(await bgCheckinState.Bo())
              .filter(([, t]) => t.openerTabId === e && t.proxyTransferred)
              .map(([e]) => Number(e)),
          );
        },
        transferredPopups() {
          return zo(async () =>
            Object.entries(await bgCheckinState.Bo())
              .filter(([, e]) => e.proxyTransferred)
              .map(([e]) => Number(e)),
          );
        },
        pruneDeadTabs() {
          return zo(async () => {
            let e = await bgCheckinState.Bo(),
              t = Object.keys(e);
            if (!t.length) return [];
            let n = await Promise.all(t.map((e) => bgCheckinState.Uo(Number(e)))),
              r = {},
              i = [];
            return (
              t.forEach((t, a) => {
                n[a] ? (r[t] = e[t]) : i.push([Number(t), e[t]]);
              }),
              Object.keys(r).length !== t.length && (await Vo(r)),
              i
            );
          });
        },
      };
      break;
    }
    case 177: {
      bgCheckinState._s = {
        簽: `签`,
        籤: `签`,
        領: `领`,
        獎: `奖`,
        勵: `励`,
        額: `额`,
        經: `经`,
        復: `复`,
        複: `复`,
        敗: `败`,
        時: `时`,
        發: `发`,
        錯: `错`,
        誤: `误`,
        務: `务`,
        暫: `暂`,
        網: `网`,
        關: `关`,
        開: `开`,
        夢: `梦`,
        數: `数`,
        盡: `尽`,
        歷: `历`,
        曆: `历`,
        記: `记`,
        錄: `录`,
        規: `规`,
        則: `则`,
        說: `说`,
        細: `细`,
        詳: `详`,
        幫: `帮`,
        預: `预`,
        覽: `览`,
        進: `进`,
        個: `个`,
        資: `资`,
        帳: `账`,
        賬: `账`,
        戶: `户`,
        號: `号`,
        臺: `台`,
        頁: `页`,
        設: `设`,
        儀: `仪`,
        盤: `盘`,
        註: `注`,
        銷: `销`,
        請: `请`,
        後: `后`,
        試: `试`,
        統: `统`,
        驗: `验`,
        證: `证`,
        機: `机`,
        碼: `码`,
        過: `过`,
        謝: `谢`,
        鳴: `鸣`,
        贊: `赞`,
        確: `确`,
        繼: `继`,
        續: `续`,
        鐘: `钟`,
      };
      break;
    }
    case 178: {
      bgCheckinState.vs = RegExp(`[${Object.keys(bgCheckinState._s).join(``)}]`, `g`);
      break;
    }
    case 179: {
      bgCheckinState.bs = new Map();
      break;
    }
    case 180: {
      for (let [e, t] of Object.entries(bgCheckinState._s))
        bgCheckinState.bs.set(t, `${bgCheckinState.bs.get(t) ?? ``}${e}`);
      break;
    }
    case 181: {
      bgCheckinState.Cs = [
        `签到成功`,
        `打卡成功`,
        `领取成功`,
        `奖励到账`,
        `已生效`,
        `check-in success`,
        `checked in successfully`,
      ];
      break;
    }
    case 182: {
      bgCheckinState.ws = [
        `已签到`,
        `已经签到`,
        `今日已`,
        `重复签到`,
        `already checked`,
        `already signed`,
        `已打卡`,
        `已领取`,
      ];
      break;
    }
    case 183: {
      bgCheckinState.Ts = [`抽奖成功`, `抽奖完成`, `开奖成功`, `draw successful`];
      break;
    }
    case 184: {
      bgCheckinState.Es = [
        `今日梦火抽签次数已耗尽`,
        `This draw is complete`,
        `You have already drawn today`,
      ];
      break;
    }
    case 185: {
      bgCheckinState.Ds = xs(/抽奖|抽签|翻牌|\b(?:start\s+)?draw\b/i);
      break;
    }
    case 186: {
      (xs(
        /(?:签到|打卡|领取|check[\s-]?in|sign[\s-]?in|claim|daily\s*(?:bonus|reward|credit)|每日(?:奖励|福利|额度))/i,
      ),
        xs(/(?:历史|记录|规则|日历|说明|明细|详情|history|calendar|rule|record|detail)/i));
      break;
    }
    case 187: {
      bgCheckinState.Os = {
        checkin: [
          `/api/user/checkin`,
          `/api/user/check_in`,
          `/api/user/clock_in`,
          `/api/user/daily_checkin`,
          `/api/user/sign_in`,
        ],
        balance: [`/api/user/self`, `/api/user/info`],
        auth: `userIdHeaders`,
        method: `POST`,
      };
      break;
    }
    case 188: {
      bgCheckinState.ks = {
        checkin: [`/api/v1/check-in`],
        balance: [`/api/v1/check-in/status`, `/api/v1/auth/me`],
        auth: `bearer`,
        method: `POST`,
      };
      break;
    }
    case 189: {
      bgCheckinState.As = {
        [bgSitesState.d.NEW_API]: bgCheckinState.Os,
        [bgSitesState.d.SUB2API]: bgCheckinState.ks,
        [bgSitesState.d.VO_API_V2]: {
          checkin: [`/api/user/checkin`],
          balance: [`/api/user/self`, `/api/user/info`],
          auth: `bearer`,
          method: `POST`,
        },
        [bgSitesState.d.UNSUPPORTED]: null,
      };
      break;
    }
    case 190: {
      bgCheckinState.Vs = 8e3;
      break;
    }
    case 191: {
      bgCheckinState.Hs = 25e3;
      break;
    }
    case 192: {
      bgCheckinState.Us = 1200;
      break;
    }
    case 193: {
      bgCheckinState.qs = {
        fetch: (...e) => fetch(...e),
        now: () => Date.now(),
        sleep: (e) => new Promise((t) => setTimeout(t, e)),
      };
      break;
    }
    case 298: {
      bgCheckinState.Rp = `checkin-queue-watchdog`;
      break;
    }
    case 299: {
      bgCheckinState.zp = `checkin-schedule`;
      break;
    }
    case 301: {
      bgCheckinState.Vp = `checkinScheduleLastRun`;
      break;
    }
    case 302: {
      bgCheckinState.Hp = 6e5;
      break;
    }
    case 311: {
      bgCheckinState.Z = wo({
        launch: Ah,
        async fail(e, t) {
          let n = await bgCheckinState.V.statusOf(e);
          n !== `done` && n !== `failed` && (await bgCheckinState.V.fail(e, t));
        },
        async complete(e, t) {
          (await bgCheckinState.V.complete(t), bgPlatformState.$());
        },
        async isAlive(e) {
          if (e.tabId <= 0) return !1;
          let [t, n] = await Promise.all([
            chrome.tabs
              .get(e.tabId)
              .then(() => !0)
              .catch(() => !1),
            bgCheckinState.V.get(e.tabId),
          ]);
          return t && !!n?.runId && n.accountId === e.accountId;
        },
        async abandon(e) {
          if (e.tabId <= 0) return;
          let t = await bgCheckinState.V.get(e.tabId);
          (t && (await dm(e, t))) ||
            (await um(e.tabId, t),
            await bgCheckinState.V.remove(e.tabId),
            await Pp(e.tabId).catch(() => {}),
            await jh(e.tabId));
        },
        changed: bgPlatformState.$,
      });
      break;
    }
    case 313: {
      bgCheckinState.om = Promise.resolve();
      break;
    }
    case 317: {
      bgCheckinState.Km = [0, 250, 750];
      break;
    }
  }
}

export async function handleCheckinPointerMessage(e, i) {
  switch (e.type) {
    case `TRUSTED_POINTER_CLICK`: {
      let t = i.tab?.id;
      if (t == null) return { ok: !1, error: `缺少任务标签页` };
      if (i.frameId !== 0) {
        let n = await bgSliderState._u(i, e.runId, e.frameSessionId);
        if ((e.anchor && e.anchor.kind !== `center`) || !/^p-[a-z0-9-]{8,80}$/i.test(e.targetToken))
          return { ok: !1, error: `验证码内嵌页只允许点击本轮标记的控件中心` };
        let r = await bgPlatformState.cc(t, n, e.targetToken, { kind: `center` });
        if (!r) return { ok: !1, error: `验证码控件已重绘或被遮挡，未执行点击` };
        let a = await bgPlatformState.ac(t, n);
        return {
          ok: !0,
          feature: {
            pointer: await bgPlatformState.Hc(t, {
              x: r.x,
              y: r.y,
              viewportWidth: a.viewportWidth,
              viewportHeight: a.viewportHeight,
              targetToken: e.targetToken,
              anchor: { kind: `center` },
              deadline: e.deadline,
              frameTarget: n,
            }),
          },
        };
      }
      let n = i.url ?? i.tab?.url,
        r =
          (await bgCheckinState.V.get(t)) ??
          (bgCheckinState.yt(n) ? await bgCheckinState.Tm(t, i.tab?.openerTabId) : null);
      if (!r || r.runId !== e.runId) return { ok: !1, error: `任务已结束` };
      let a =
          r.effectiveLoginMethod === `github` && bgCheckinState.Tt(r.stage) && bgCheckinState.ht(n),
        o = a && !!r.githubUsername?.trim() && !!r.githubPassword;
      if (!bgCheckinState.ut(r, n) && !a) return { ok: !1, error: `当前页面不属于该签到任务` };
      let s = async () => {
        let e = await bgCheckinState.V.setGithubCredentialsSubmitted(t, r.runId, !0);
        if (!e) {
          let t = await bgCheckinState.Z.active();
          t?.accountId === r.accountId &&
            (e = await bgCheckinState.V.setGithubCredentialsSubmitted(t.tabId, r.runId, !0));
        }
        if (!e) throw Error(`登录点击已派发，但无法保存 GitHub 凭据提交状态，已停止后续身份放行`);
      };
      return {
        ok: !0,
        feature: {
          pointer: await bgPlatformState.Hc(
            t,
            {
              x: e.x,
              y: e.y,
              viewportWidth: e.viewportWidth,
              viewportHeight: e.viewportHeight,
              targetToken: e.targetToken,
              anchor: e.anchor,
              targetSeenAt: e.targetSeenAt,
              deadline: e.deadline,
              ...(o
                ? {
                    inputAssertions: [
                      {
                        selector: `#login_field, input[name="login"]`,
                        value: r.githubUsername.trim(),
                      },
                      { selector: `#password, input[type="password"]`, value: r.githubPassword },
                    ],
                  }
                : {}),
            },
            Math.random,
            { ...(o ? { afterClick: s } : {}) },
          ),
        },
      };
    }
    case `TRUSTED_POINTER_SCROLL`: {
      let t = i.tab?.id;
      if (t == null || i.frameId !== 0) return { ok: !1, error: `缺少顶层任务标签页` };
      let n = i.url ?? i.tab?.url,
        r = await bgCheckinState.V.get(t);
      if (!r || r.runId !== e.runId) return { ok: !1, error: `任务已结束` };
      if (!bgCheckinState.ut(r, n)) return { ok: !1, error: `当前页面不属于该签到任务` };
      let a = await bgPlatformState.Wc(t, {
        x: e.x,
        y: e.y,
        viewportWidth: e.viewportWidth,
        viewportHeight: e.viewportHeight,
        deltaY: e.deltaY,
        steps: e.steps,
      });
      return {
        ok: !0,
        feature: {
          pointer: {
            mode: a.mode,
            pathPoints: 0,
            clickObserved: null,
            scroll: { deltaY: a.deltaY, steps: a.steps },
          },
        },
      };
    }
    case `TRUSTED_POINTER_DRAG`: {
      let t = i.tab?.id;
      if (t == null || i.frameId !== 0) return { ok: !1, error: `缺少顶层任务标签页` };
      let n = i.url ?? i.tab?.url,
        r = await bgCheckinState.V.get(t);
      if (!r || r.runId !== e.runId) return { ok: !1, error: `任务已结束` };
      if (!bgCheckinState.ut(r, n)) return { ok: !1, error: `当前页面不属于该签到任务` };
      if (!Array.isArray(e.points) || e.points.length < 2)
        return { ok: !1, error: `拖拽轨迹至少需要 2 个点` };
      let a = await bgPlatformState.qc(t, {
        startX: e.startX,
        startY: e.startY,
        points: e.points,
        viewportWidth: e.viewportWidth,
        viewportHeight: e.viewportHeight,
        ...(e.fromTargetToken ? { targetToken: e.fromTargetToken } : {}),
        ...(e.toTargetToken ? { toTargetToken: e.toTargetToken } : {}),
        ...(e.fromAnchor ? { fromAnchor: e.fromAnchor } : {}),
        ...(e.toAnchor ? { toAnchor: e.toAnchor } : {}),
      });
      return {
        ok: !0,
        feature: {
          pointer: {
            mode: a.mode,
            pathPoints: 0,
            clickObserved: null,
            drag: { points: a.dragPoints, totalDistance: a.totalDistance },
          },
        },
      };
    }
  }
}

export const checkinService = Object.freeze({
  startBatch: (...args) => $m(...args),
  cancel: (...args) => eh(...args),
  getQueue: () => bgCheckinState.Z.snapshot(),
  saveSchedule: (...args) => bgCheckinState.store.updateSchedule(...args),
  handleMessage: handleCheckinMessage,
  handlePointerMessage: handleCheckinPointerMessage,
  handleMutation: handleCheckinMutation,
});
