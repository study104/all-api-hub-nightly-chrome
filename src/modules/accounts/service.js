/** 账号管理后台：账号保存、批量添加、身份绑定、登录态与凭据。 */
import { bgSitesState, sanitizeLoginEntry } from '../sites/service.js';
import { bgLearningState } from '../learning/service.js';
import { bgCheckinState } from '../checkin/service.js';
import { bgProxiesState } from '../proxies/service.js';
import { bgPlatformState } from '../../shared/background-platform.js';
import { bgEntryState } from '../../entries/background.js';
import {
  compareAccountIdentity,
  findIdentityOwner,
  parseIdentityResponse,
} from '../../shared/account-identity.js';

export const bgAccountsState = { store: {} };

function kt(e, t, n) {
  return e
    ? { value: e, source: `账号级` }
    : t
      ? { value: t, source: `站点默认` }
      : { value: n, source: `内置默认` };
}

function At(e) {
  let t = !!e.password,
    n = !!e.githubUsername?.trim() && !!e.githubPassword;
  return t === n ? null : n ? `github` : `form`;
}

function jt(e, t) {
  const method = e.loginMethod || `auto`;
  return {
    loginMethod: method,
    loginMethodSource: method === `auto` ? `当前页面识别` : `账号级`,
    checkinMethod: t.checkin?.method || `auto`,
  };
}

function Mt(e) {
  switch (e) {
    case `token`:
      return { password: !1, token: !0, sessionCounts: !0, github: !1, passkey: !1 };
    case `github`:
      return { password: !1, token: !1, sessionCounts: !1, github: !0, passkey: !1 };
    case `passkey`:
      return { password: !1, token: !1, sessionCounts: !1, github: !1, passkey: !0 };
    case `oauth`:
    case `manual`:
      return { password: !1, token: !1, sessionCounts: !1, github: !1, passkey: !1 };
    case `auto`:
      return { password: !1, token: !1, sessionCounts: !1, github: !1, passkey: !1 };
    case `form`:
      return { password: !0, token: !1, sessionCounts: !1, github: !1, passkey: !1 };
  }
}

function Nt(e) {
  return `登录方式：${e.loginMethod}（${e.loginMethodSource}）；签到方式：${e.checkinMethod}（站点配置）`;
}

function Pt(e) {
  let t = Math.floor(e / 16777216) % 256,
    n = Math.floor(e / 65536) % 256;
  return (
    t === 0 ||
    t === 127 ||
    t === 10 ||
    (t === 172 && n >= 16 && n <= 31) ||
    (t === 192 && n === 168) ||
    (t === 169 && n === 254) ||
    (t === 100 && n >= 64 && n <= 127)
  );
}

function Ft(e) {
  let t = e.split(`.`);
  if (t.length !== 4) return null;
  let n = 0;
  for (let e of t) {
    if (!/^\d{1,3}$/.test(e)) return null;
    let t = Number(e);
    if (t > 255) return null;
    n = n * 256 + t;
  }
  return n;
}

function It(e) {
  if (!e.includes(`:`)) return null;
  let t = e,
    n = /:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(t);
  if (n) {
    let e = Ft(n[1] ?? ``);
    if (e === null) return null;
    let r = (Math.floor(e / 65536) % 65536).toString(16),
      i = (e % 65536).toString(16);
    t = `${t.slice(0, n.index + 1)}${r}:${i}`;
  }
  let r = t.split(`::`);
  if (r.length > 2) return null;
  let i = (e) => {
    if (e === ``) return [];
    let t = [];
    for (let n of e.split(`:`)) {
      if (!/^[0-9a-f]{1,4}$/.test(n)) return null;
      t.push(parseInt(n, 16));
    }
    return t;
  };
  if (r.length === 2) {
    let e = i(r[0] ?? ``),
      t = i(r[1] ?? ``);
    if (!e || !t) return null;
    let n = 8 - e.length - t.length;
    if (n < 1) return null;
    let a = [...e, ...Array.from({ length: n }, () => 0), ...t];
    return a.length === 8 ? a : null;
  }
  let a = i(t);
  return a && a.length === 8 ? a : null;
}

function Lt(e) {
  if (e.every((e) => e === 0) || (e.slice(0, 7).every((e) => e === 0) && e[7] === 1)) return !0;
  let t = e.slice(0, 5).every((e) => e === 0),
    n = t && e[5] === 65535,
    r = t && e[5] === 0 && (e[6] !== 0 || e[7] !== 0);
  return n || r
    ? Pt(e[6] * 65536 + e[7])
    : (e[0] >= 64512 && e[0] <= 65023) || (e[0] >= 65152 && e[0] <= 65215);
}

function Rt(e) {
  let t = e
    .trim()
    .toLowerCase()
    .replace(/^\[|\]$/g, ``)
    .replace(/\.$/, ``);
  if (!t) return !0;
  let n = Ft(t);
  if (n !== null) return Pt(n);
  let r = It(t);
  return r
    ? Lt(r)
    : t === `localhost` ||
        t.endsWith(`.localhost`) ||
        t.endsWith(`.local`) ||
        t.endsWith(`.internal`);
}

function P(e) {
  throw Error(`CBOR 解码失败: ${e}`);
}

function vr(e) {
  let t = e & 32768 ? -1 : 1,
    n = (e >> 10) & 31,
    r = e & 1023;
  return n === 0
    ? t * r * 2 ** -24
    : n === 31
      ? r
        ? NaN
        : t * (1 / 0)
      : t * (1 + r / 1024) * 2 ** (n - 15);
}

function yr(e, t) {
  (e instanceof Uint8Array || P(`输入必须是 Uint8Array`), e.byteLength === 0 && P(`数据为空`));
  let n = { ...bgAccountsState.hr, ...t };
  e.byteLength > n.maxInputBytes && P(`超出输入长度上限`);
  let r = new bgAccountsState._r(e, n),
    i = r.readItem(0);
  return (r.done() || P(`数据尾部有多余字节`), i);
}

function br(e) {
  return e === `api`
    ? `站点接口`
    : e === `storage`
      ? `本地登录态`
      : e === `visible`
        ? `页面文本`
        : `未知来源`;
}

function xr(response) {
  return parseIdentityResponse(response);
}

function Sr(e) {
  return Nr(kr(e));
}

function kr(e, t = !1) {
  if (!e) return ``;
  let n = [],
    r = !1,
    i = !1;
  for (let a of e
    .split(/[\r\n]+/)
    .map((e) => e.trim())
    .filter(Boolean)) {
    if (bgAccountsState.wr.test(a)) {
      ((r = !0), (i = !1));
      continue;
    }
    let e = bgAccountsState.Tr.test(a);
    if (((e || bgAccountsState.Er.test(a)) && (r = !1), r || bgAccountsState.Cr.test(a))) {
      i = !1;
      continue;
    }
    let o = e || bgAccountsState.Dr.test(a),
      s = i && /^[^\s<>]{2,80}(?:\s*[·|]\s*[^\r\n]{1,40})?$/.test(a);
    ((t || o || s) && n.push(a), (i = o));
  }
  return n.join(`
`);
}

function Ar(e) {
  for (let t = e; t; t = t.parentElement) {
    if (t.hidden || t.getAttribute(`aria-hidden`) === `true` || t.hasAttribute(`inert`)) return !1;
    let e = getComputedStyle(t);
    if (e.display === `none` || e.visibility === `hidden` || e.visibility === `collapse`) return !1;
  }
  return !0;
}

function jr() {
  let e = [kr(document.body?.innerText)];
  if (typeof document.querySelectorAll != `function`) return e[0];
  for (let t of document.querySelectorAll(
    `[role="menu"], [aria-haspopup="menu"], [aria-haspopup="true"]`,
  )) {
    if (!Ar(t) || t.closest(`table, [role="table"], [role="grid"], .lottery-sidebar`)) continue;
    let n = t.innerText ?? t.textContent ?? ``;
    if (!n.trim() || n.length > 2e3) continue;
    let r = t.getAttribute(`role`) === `menu` && bgAccountsState.Or.test(n),
      i =
        t.hasAttribute(`aria-haspopup`) &&
        (!!t.closest(`header, nav, [role="banner"]`) ||
          /user|account|profile|avatar|用户|账号|账户|个人|头像/i.test(
            `${t.getAttribute(`aria-label`) ?? ``} ${t.getAttribute(`title`) ?? ``}`,
          ));
    (r || i) && e.push(kr(n, !0));
  }
  return e.filter(Boolean).join(`
`);
}

function Mr(e) {
  let t = new Map(e.map((e) => [e.toLowerCase(), e]));
  return t.size === 1 ? t.values().next().value : void 0;
}

function Nr(e) {
  if (!e) return null;
  let t = { source: `visible` },
    n = Pr(e);
  n && (t.userId = n);
  let r = [...e.matchAll(/(?<![\w.+@*-])@([A-Za-z0-9][A-Za-z0-9._-]{1,38})\b/g)]
      .map((e) => e[1])
      .filter((e) => !e.includes(`.`)),
    i = [
      ...e.matchAll(
        /(?:^|\s)(?:用户名|登录名|当前(?:登录)?(?:账号|账户)|username|login name)(?:\s*[:：]\s*|\s+)([\p{L}\p{N}][\p{L}\p{N}._+@-]{1,79})/giu,
      ),
    ]
      .map((e) => e[1])
      .filter((e) => !e.includes(`@`)),
    a = Mr(i.length ? i : r);
  a && (t.username = a);
  let o = Mr([...e.matchAll(/(?<![\w.+*-])[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g)].map((e) => e[0]));
  return (o && (t.email = o), t.userId || t.username || t.email ? t : null);
}

function Pr(e) {
  let t = /(?<![A-Za-z])(?:用户\s*ID|User\s*ID|UID)\s*[:：#]?\s*(\d{1,12})\b/gi,
    n = new Set();
  for (let r of e.matchAll(t)) {
    let t = r[1];
    if (!t) continue;
    let i = e.slice(Math.max(0, (r.index ?? 0) - 14), r.index ?? 0);
    bgAccountsState.Cr.test(i) || n.add(t);
  }
  return n.size === 1 ? [...n][0] : void 0;
}

function Rr(e, t) {
  let n = e.trim().toLowerCase(),
    r = t == null ? jr() : kr(t);
  if (!r || n.length < bgAccountsState.Fr) return null;
  if (zr(r.toLowerCase(), n)) return { matched: e.trim(), masked: !1 };
  let i = n.lastIndexOf(`@`);
  if (i <= 0) return null;
  let a = n.slice(0, i),
    o = n.slice(i + 1);
  if (!o) return null;
  for (let e of r.matchAll(bgAccountsState.Lr)) {
    let t = (e[1] ?? ``).toLowerCase(),
      n = (e[2] ?? ``).toLowerCase();
    if (
      (t || n) &&
      (e[3] ?? ``).toLowerCase() === o &&
      (!t || a.startsWith(t)) &&
      (!n || a.endsWith(n))
    )
      return { matched: e[0], masked: !0 };
  }
  return null;
}

function zr(e, t) {
  for (let n = 0; n <= e.length;) {
    let r = e.indexOf(t, n);
    if (r < 0) return !1;
    let i = e[r - 1] ?? ` `,
      a = e[r + t.length] ?? ` `;
    if (!bgAccountsState.Ir.test(i) && !bgAccountsState.Ir.test(a)) return !0;
    n = r + 1;
  }
  return !1;
}

function Br(e, t) {
  return !e || !t ? !1 : e.trim().toLowerCase() === t.trim().toLowerCase();
}

function Vr(e, t) {
  let n = [e.username, e.email, e.displayName].filter(Boolean),
    r = n.find((e) => Br(e, t));
  if (r) return r;
  let i = t.includes(`@`) ? t.split(`@`)[0] : null;
  return i ? (n.find((e) => !e.includes(`@`) && Br(e, i)) ?? null) : null;
}

function Hr(e, t, n = [], r) {
  let i = Vr(e, t);
  if (i) return { value: i, expected: t, source: `primary` };
  if (r?.username && Br(e.username, r.username))
    return { value: e.username, expected: r.username, source: `stored` };
  if (r?.email && Br(e.email, r.email))
    return { value: e.email, expected: r.email, source: `stored` };
  let a = new Set([t.trim().toLowerCase()]),
    o = n
      .map((e) => e.trim())
      .filter((e) => {
        if (!e) return !1;
        let t = e.toLowerCase();
        return !a.has(t) && (a.add(t), !0);
      });
  for (let t of o) {
    let n = t.includes(`@`)
      ? Br(e.email, t)
        ? e.email
        : void 0
      : Br(e.username, t)
        ? e.username
        : void 0;
    if (n) return { value: n, expected: t, source: `alias` };
  }
  return null;
}

function Ur(identity, username, userId, options) {
  return compareAccountIdentity(identity, username, userId, options);
}

function Wr(e, t = `rect`) {
  return e.kind === `inset-left`
    ? `${t}.left + Math.min(${e.px}, ${t}.width / 2)`
    : e.kind === `relative`
      ? `${t}.left + ${t}.width * ${Gr(e.rx)}`
      : `${t}.left + ${t}.width / 2`;
}

function Gr(e) {
  return `(Number.isFinite(${e}) ? Math.min(1, Math.max(0, ${e})) : 0.5)`;
}

function yo(e, t) {
  let n = { ...e, ...t, id: e.id };
  const entry = sanitizeLoginEntry(n.loginEntry),
    method = n.loginMethod || `auto`;
  if (entry && (method === `auto` || entry.method === method)) n.loginEntry = entry;
  else delete n.loginEntry;
  return (
    `loginMethod` in t && !t.loginMethod && delete n.loginMethod,
    `proxyMode` in t && t.proxyMode !== `pool` && (delete n.proxyId, delete n.proxyPinned),
    `proxyMode` in t && t.proxyMode !== `custom` && delete n.customProxy,
    n
  );
}

function Io(e, t) {
  let n = e.effectiveLoginMethod ?? `auto`,
    r = e.accountIdentityUserId,
    hasBinding = !!r || !!e.accountIdentityUsername || !!e.accountIdentityEmail,
    managedForm =
      n === `form` &&
      e.formCredentialsSubmitted === !0 &&
      !!e.username?.trim() &&
      !!e.password &&
      t.verifiedByManagedLogin === !0;
  const managedGithub =
    n === `github` &&
    e.githubCredentialsSubmitted === !0 &&
    !!e.githubUsername?.trim() &&
    !!e.githubPassword &&
    t.verifiedByManagedLogin === !0;
  const managedToken =
    n === `token` &&
    !!(e.session?.accessToken || e.apiToken) &&
    t.source === `api` &&
    t.verifiedByManagedLogin === !0;
  if (t.identityConflict) return `身份证据冲突，已拒绝更新账号绑定`;
  if (t.source !== `api` && !(t.source === `visible` && (managedForm || managedGithub)))
    return `只有站点接口身份或本轮受控登录后核验的页面身份可以更新账号绑定`;
  if (t.userId && e.siteAccountUserIds?.[t.userId])
    return `该用户 ID 已属于本站其他账号，已拒绝修改本账号绑定`;
  if (findIdentityOwner(t, e.siteAccountIdentities))
    return `该身份已绑定给本站其他账号，已拒绝修改本账号绑定`;
  if (r && t.userId && String(r) !== String(t.userId))
    return `当前用户 ID 与本账号原有绑定不符，已保留原绑定`;
  if (!hasBinding && (t.userId || t.username || t.email) && n === `auto`)
    return `首次绑定需要先识别当前页面的登录方式，并使用本账号的凭据登录`;
  if (!hasBinding && (t.userId || t.username || t.email) && n === `form`)
    return managedForm ? null : `首次绑定需要本轮提交此账号的站点密码并确认登录成功`;
  if (!hasBinding && (t.userId || t.username || t.email) && n === `token`)
    return managedToken ? null : `首次 Token 绑定需要本账号凭据取得的稳定接口身份`;
  if (!hasBinding && (t.userId || t.username || t.email) && n === `github`)
    return managedGithub ? null : `首次 GitHub 绑定需要本账号凭据登录后取得的稳定身份`;
  if (n === `manual` && !hasBinding)
    return [t.username, t.email].some((value) => Br(value, e.username))
      ? null
      : `手动登录首次绑定需要站点接口返回用户名或完整邮箱，与本账号精确一致`;
  let i = Ur(t, e.username, r, {
    knownUsers: e.siteAccountUserIds,
    knownIdentities: e.siteAccountIdentities,
    expectedIdentity: { username: e.accountIdentityUsername, email: e.accountIdentityEmail },
    ...(n === `github` && e.githubUsername ? { expectedAliases: [e.githubUsername] } : {}),
  });
  return i.match === `confirmed` ||
    (i.match === `unknown` &&
      t.verifiedByManagedLogin === !0 &&
      n === `github` &&
      e.githubCredentialsSubmitted === !0 &&
      e.githubUsername?.trim() &&
      e.githubPassword &&
      t.userId)
    ? null
    : `账号身份未通过写入核验：${i.detail}`;
}

Object.assign(bgAccountsState, {
  kt,
  At,
  jt,
  Mt,
  Nt,
  Pt,
  Ft,
  It,
  Lt,
  Rt,
  P,
  vr,
  yr,
  br,
  xr,
  Sr,
  kr,
  Ar,
  jr,
  Mr,
  Nr,
  Pr,
  Rr,
  zr,
  Br,
  Vr,
  Hr,
  Ur,
  Wr,
  Gr,
  yo,
  Io,
});

export async function handleAccountsMessage(e, i) {
  switch (e.type) {
    case `SAVE_IDENTITY`:
      return bgPlatformState.X(async () => {
        let t = i.tab?.id;
        if (t == null) return { ok: !1, error: `缺少任务标签页` };
        let n = await bgCheckinState.V.get(t);
        if (!n || n.runId !== e.runId) return { ok: !1, error: `任务已结束` };
        if (
          i.id !== chrome.runtime.id ||
          i.frameId !== 0 ||
          !bgCheckinState.ut(n, i.url ?? i.tab?.url ?? ``)
        )
          return { ok: !1, error: `只能由当前任务的本站顶层页面保存账号身份` };
        if (!(await bgCheckinState.th(n)))
          return { ok: !1, error: `账号归属已变更，已拒绝写入旧站身份` };
        if (n.manualLoginWaitUntil) {
          const active = await bgCheckinState.Z.active();
          if (
            n.manualLoginWaitUntil <= Date.now() ||
            active?.tabId !== n.tabId ||
            active?.accountId !== n.accountId
          )
            return { ok: !1, error: `页面登录等待已结束，已拒绝更新账号身份` };
        }
        if (!e.identity || typeof e.identity !== `object` || Array.isArray(e.identity))
          return { ok: !1, error: `账号身份格式无效` };
        if (
          e.identity.userId !== void 0 &&
          (typeof e.identity.userId !== `string` ||
            !e.identity.userId.trim() ||
            e.identity.userId.length > 160)
        )
          return { ok: !1, error: `账号用户 ID 格式无效` };
        let accounts = await bgPlatformState.t.get(bgPlatformState.r.accounts, []),
          current = accounts.find((account) => account.id === n.accountId);
        if (!current || current.siteId !== n.siteId)
          return { ok: !1, error: `账号归属已变更，已拒绝写入旧站身份` };
        if (
          n.effectiveLoginMethod === `manual` &&
          (!current.username?.trim() ||
            current.username.trim() !== n.username?.trim() ||
            (current.loginMethod || `auto`) !== (n.loginMethodPreference || `auto`))
        )
          return { ok: !1, error: `本账号的名称或登录偏好已改变，已拒绝旧页面的手动登录身份` };
        let r =
            (n.effectiveLoginMethod === `github` &&
              n.githubCredentialsSubmitted === !0 &&
              !!n.githubUsername?.trim() &&
              !!n.githubPassword &&
              current.githubUsername?.trim() === n.githubUsername.trim() &&
              current.githubPassword === n.githubPassword) ||
            (n.effectiveLoginMethod === `form` &&
              n.formCredentialsSubmitted === !0 &&
              !!n.username?.trim() &&
              !!n.password &&
              current.username?.trim() === n.username.trim() &&
              current.password === n.password) ||
            (n.effectiveLoginMethod === `token` &&
              !!(n.session?.accessToken || n.apiToken) &&
              (n.session?.accessToken ?? n.apiToken) ===
                (current.identity?.session?.accessToken ?? current.apiToken)),
          { verifiedByManagedLogin: a, ...o } = e.identity,
          s = a === !0 && r ? { ...o, verifiedByManagedLogin: !0 } : o,
          c = Io(
            {
              ...n,
              formCredentialsSubmitted: n.effectiveLoginMethod === `form` && r,
              accountIdentityUserId: current.identity?.userId,
              accountIdentityUsername: current.identity?.username,
              accountIdentityEmail: current.identity?.email,
              siteAccountIdentities: accounts
                .filter((account) => account.id !== current.id && account.siteId === current.siteId)
                .map((account) => ({
                  userId: account.identity?.userId,
                  username: account.identity?.username,
                  email: account.identity?.email,
                  label: account.label || account.username,
                })),
              siteAccountUserIds: Object.fromEntries(
                accounts
                  .filter(
                    (account) =>
                      account.id !== current.id &&
                      account.siteId === current.siteId &&
                      account.identity?.userId,
                  )
                  .map((account) => [account.identity.userId, account.label || account.username]),
              ),
            },
            s,
          );
        return c
          ? { ok: !1, error: c }
          : (await bgAccountsState.store.saveAccountIdentity(n.accountId, s, {
              preserveBinding: !0,
            }),
            await bgCheckinState.V.updateIdentity(t, e.runId, s),
            { ok: !0 });
      });
    case `CAPTURE_SESSION`:
      return bgEntryState.Q(i)
        ? bgPlatformState.X(() => bgProxiesState.vh(e.accountId, e.tabId))
        : { ok: !1, error: `仅扩展管理页可以抓取登录态` };
    case `SESSION_REFRESHED`:
      return bgPlatformState.X(async () => {
        let t = i.tab?.id;
        if (t == null) return { ok: !1, error: `缺少标签页信息` };
        let n = await bgCheckinState.V.get(t);
        return !n || n.runId !== e.runId || n.accountId !== e.accountId
          ? { ok: !1, error: `任务已结束` }
          : (await bgCheckinState.th(n))
            ? (await bgAccountsState.store.saveAccountSession(e.accountId, {
                accessToken: e.accessToken,
                refreshToken: e.refreshToken,
                tokenExpiresAt: e.tokenExpiresAt,
                capturedAt: Date.now(),
                ...(n.site.adapter?.siteType ? { siteType: n.site.adapter.siteType } : {}),
              }),
              { ok: !0 })
            : { ok: !1, error: `账号归属已变更，已拒绝写入旧站会话` };
      });
    case `CLEAR_SITE_COOKIES`:
      return bgPlatformState.X(async () => {
        let t = i.tab?.id,
          n = i.url ?? i.tab?.url;
        if (t == null || i.frameId !== 0) return { ok: !1, error: `缺少顶层任务标签页` };
        let r = await bgCheckinState.V.get(t);
        if (!r || r.runId !== e.runId) return { ok: !1, error: `任务已结束` };
        if (!bgCheckinState.ut(r, n)) return { ok: !1, error: `当前页面不属于该签到任务` };
        await bgCheckinState.V.setFormCredentialsSubmitted(t, r.runId, !1);
        await bgCheckinState.V.setGithubCredentialsSubmitted(t, r.runId, !1);
        return {
          ok: !0,
          feature: { siteCookieClear: await bgLearningState.wu(t, r.site.loginUrl) },
        };
      });
  }
}

export async function handleAccountsMutation(e) {
  switch (e.action) {
    case `add-account`:
      return (await bgAccountsState.store.addAccount(e.input), { ok: !0 });
    case `add-accounts`: {
      let n = await bgPlatformState.t.get(bgPlatformState.r.sites, []),
        i = new Set([...n, ...bgSitesState.j].map((e) => e.id));
      return {
        ok: !0,
        ...(await bgAccountsState.store.addAccounts(e.inputs, i, e.preserveDuplicates)),
      };
    }
    case `update-account`: {
      let n = e.patch.siteId;
      return typeof n == `string`
        ? bgPlatformState.X(async () =>
            bgPlatformState.rm(async () => {
              let i = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find(
                (t) => t.id === e.accountId,
              );
              return (
                i && n !== i.siteId && (await bgCheckinState.eh([e.accountId])),
                await bgAccountsState.store.updateAccount(e.accountId, e.patch),
                { ok: !0 }
              );
            }),
          )
        : (await bgAccountsState.store.updateAccount(e.accountId, e.patch), { ok: !0 });
    }
  }
}

export function initializeBackgroundAccounts(step) {
  switch (step) {
    case 55: {
      bgAccountsState.Ot = `auto`;
      break;
    }
    case 80: {
      bgAccountsState.hr = {
        maxInputBytes: 1048576,
        maxDepth: 64,
        maxContainerLength: 65536,
        maxTextLength: 262144,
        maxTotalItems: 1e5,
      };
      break;
    }
    case 81: {
      bgAccountsState.gr = 2 ** 53 - 1;
      break;
    }
    case 82: {
      bgAccountsState._r = class {
        bytes;
        limits;
        pos = 0;
        items = 0;
        constructor(e, t) {
          ((this.bytes = e), (this.limits = t));
        }
        done() {
          return this.pos >= this.bytes.length;
        }
        readItem(e) {
          (e > this.limits.maxDepth && P(`超出深度上限`),
            (this.items += 1),
            this.items > this.limits.maxTotalItems && P(`超出解码总量上限`));
          let t = this.readByte(),
            n = t >> 5,
            r = t & 31;
          if (
            (r === 31 && P(`不支持不定长度`),
            r > 27 && P(`非法的类型字节（保留的 additional info）`),
            n === 7)
          )
            return this.readSimpleOrFloat(r);
          let i = r < 24 ? r : this.readUintArgument(r);
          switch (n) {
            case 0:
              return (i > bgAccountsState.gr && P(`整数超出安全范围`), i);
            case 1:
              return (i >= bgAccountsState.gr && P(`整数超出安全范围`), -1 - i);
            case 2:
              P(`不支持字节串`);
            case 3:
              return this.readText(i);
            case 4:
              return this.readArray(i, e);
            case 5:
              return this.readMap(i, e);
            default:
              P(`不支持标签`);
          }
        }
        readSimpleOrFloat(e) {
          switch (e) {
            case 20:
              return !1;
            case 21:
              return !0;
            case 22:
              return null;
            case 25:
              return vr(this.readRaw16());
            case 26: {
              let e = this.readRaw32(),
                t = new DataView(new ArrayBuffer(4));
              return (t.setUint32(0, e), t.getFloat32(0));
            }
            case 27: {
              let e = this.readRaw32(),
                t = this.readRaw32(),
                n = new DataView(new ArrayBuffer(8));
              return (n.setUint32(0, e), n.setUint32(4, t), n.getFloat64(0));
            }
            default:
              P(`不支持的简单值`);
          }
        }
        readArray(e, t) {
          this.checkContainerLength(e);
          let n = [];
          for (let r = 0; r < e; r += 1) n.push(this.readItem(t + 1));
          return n;
        }
        readMap(e, t) {
          this.checkContainerLength(e);
          let n = Object.create(null);
          for (let r = 0; r < e; r += 1) {
            let e = this.readItem(t + 1),
              r = this.readItem(t + 1);
            typeof e == `string` && (n[e] = r);
          }
          return n;
        }
        readText(e) {
          e > this.limits.maxTextLength && P(`超出文本长度上限`);
          let t = this.readBytes(e);
          try {
            return new TextDecoder(`utf-8`, { fatal: !0 }).decode(t);
          } catch {
            P(`文本不是合法 UTF-8`);
          }
        }
        checkContainerLength(e) {
          (e > this.limits.maxContainerLength && P(`超出容器长度上限`),
            e > this.bytes.length - this.pos && P(`数据不完整（容器长度超出剩余字节）`));
        }
        readUintArgument(e) {
          switch (e) {
            case 24:
              return this.readByte();
            case 25:
              return this.readRaw16();
            case 26:
              return this.readRaw32();
            case 27: {
              let e = this.readRaw32(),
                t = this.readRaw32(),
                n = e * 4294967296 + t;
              return (n > bgAccountsState.gr && P(`整数超出安全范围`), n);
            }
            default:
              P(`非法的类型字节（保留的 additional info）`);
          }
        }
        readByte() {
          return (this.pos >= this.bytes.length && P(`数据不完整`), this.bytes[this.pos++]);
        }
        readRaw16() {
          return (this.readByte() << 8) | this.readByte();
        }
        readRaw32() {
          return (
            this.readByte() * 16777216 +
            (this.readByte() << 16) +
            (this.readByte() << 8) +
            this.readByte()
          );
        }
        readBytes(e) {
          e > this.bytes.length - this.pos && P(`数据不完整`);
          let t = this.bytes.subarray(this.pos, this.pos + e);
          return ((this.pos += e), t);
        }
      };
      break;
    }
    case 83: {
      bgAccountsState.Cr =
        /(邀请|受邀|推荐|推广|上级|下级|下线|团队|排行|榜|赞助|作者|客服|管理员|中奖|获奖|公告|invit|referr|sponsor|winner|leaderboard|announcement)/i;
      break;
    }
    case 84: {
      bgAccountsState.wr =
        /中奖(?:名单|记录|用户)|获奖(?:名单|记录)|排行榜|排名榜|用户列表|成员列表|历史记录|公告|\b(?:winners?|leaderboard|rankings?|draw history|announcements?)\b/i;
      break;
    }
    case 85: {
      bgAccountsState.Tr =
        /^(?:个人资料|个人信息|账户信息|账号信息|我的账户|我的账号|我的资料|profile|my account|account (?:info(?:rmation)?|details))\s*[:：]?$/i;
      break;
    }
    case 86: {
      bgAccountsState.Er = /^(?:当前(?:登录)?(?:账号|账户|用户)|我的(?:账号|账户|邮箱))\s*[:：]?/;
      break;
    }
    case 87: {
      bgAccountsState.Dr =
        /(?<![A-Za-z])(?:用户\s*ID|User\s*ID|UID)\s*[:：#]?\s*\d|当前(?:登录)?(?:账号|账户|用户)|用户名|登录名|账[号户]|邮箱|电子邮件|\b(?:e-?mail|username|account)\b|欢迎回来|welcome back/i;
      break;
    }
    case 88: {
      bgAccountsState.Or =
        /退出登录|退出账号|注销登录|个人资料|账户设置|账号设置|\b(?:log\s*out|sign\s*out|my account|account settings|profile)\b/i;
      break;
    }
    case 89: {
      bgAccountsState.Fr = 4;
      break;
    }
    case 90: {
      bgAccountsState.Ir = /[A-Za-z0-9._+@-]/;
      break;
    }
    case 91: {
      bgAccountsState.Lr = /(?<![\w.+-])([\w.+-]*)\*+([\w.+-]*)@([\w-]+\.[\w.-]+)/g;
      break;
    }
    case 92: {
      [
        `button`,
        `a`,
        `[role="button"]`,
        `[role="link"]`,
        `[role="menuitem"]`,
        `[role="menuitemcheckbox"]`,
        `[role="menuitemradio"]`,
        `[role="tab"]`,
        `[role="option"]`,
        `[role="checkbox"]`,
        `[role="radio"]`,
        `[role="switch"]`,
        `[role="treeitem"]`,
        `input[type="submit"]`,
        `input[type="button"]`,
        `label`,
      ].join(`, `);
      break;
    }
    case 109: {
      bgAccountsState.Hi = {
        accessToken: `auth_token`,
        refreshToken: `refresh_token`,
        expiresAt: `token_expires_at`,
        user: `auth_user`,
      };
      break;
    }
    case 110: {
      bgAccountsState.Ui = [
        {
          siteType: bgSitesState.u.SUB2API,
          tokenKey: bgAccountsState.Hi.accessToken,
          refreshKey: bgAccountsState.Hi.refreshToken,
          expiresKey: bgAccountsState.Hi.expiresAt,
          userKey: bgAccountsState.Hi.user,
          evidence: `Sub2API：localStorage 的 auth_token / refresh_token`,
        },
        {
          siteType: bgSitesState.u.VO_API_V2,
          nestedToken: { key: `userStore`, path: [`auth`, `token`] },
          userKey: `user`,
          evidence: `VoAPI v2：localStorage 的 userStore.auth.token`,
        },
        {
          siteType: bgSitesState.u.NEW_API,
          userKey: `user`,
          evidence: `new-api 系：localStorage 的 user（登录态在 cookie 里）`,
        },
      ];
      break;
    }
    case 135: {
      Object.assign(bgAccountsState.store, {
        addAccount(e) {
          return bgPlatformState.R(async () => {
            let [n, i] = await Promise.all([
              bgPlatformState.t.get(bgPlatformState.r.accounts, []),
              bgPlatformState.t.get(bgPlatformState.r.proxies, []),
            ]);
            if ((e.proxyMode ?? `inherit`) === `pool`) {
              if (!e.proxyId) throw Error(`账号选择了代理池，但没有指定真实出口`);
              bgProxiesState.vo(e.proxyId, bgProxiesState.go(i));
            }
            await bgPlatformState.t.set(
              bgPlatformState.r.accounts,
              n.concat(yo({ id: bgPlatformState.Ti(`acc`) }, e)),
            );
          });
        },
      });
      break;
    }
    case 136: {
      Object.assign(bgAccountsState.store, {
        addAccounts(e, n, i = !1) {
          return bgPlatformState.R(async () => {
            let [a, o] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, []),
              ]),
              s = bgProxiesState.go(o),
              c = new Set(a.map((e) => `${e.siteId}\u0000${e.username.trim().toLowerCase()}`)),
              l = [];
            for (let t of e) {
              let e = t.username.trim(),
                r = `${t.siteId}\u0000${e.toLowerCase()}`;
              n.has(t.siteId) &&
                e &&
                t.password &&
                (i || !c.has(r)) &&
                ((t.proxyMode ?? `inherit`) !== `pool` || (t.proxyId && s.has(t.proxyId))) &&
                (c.add(r),
                l.push(
                  yo(
                    { id: bgPlatformState.Ti(`acc`) },
                    {
                      ...t,
                      username: e,
                      label: t.label?.trim() || void 0,
                    },
                  ),
                ));
            }
            return (
              l.length && (await bgPlatformState.t.set(bgPlatformState.r.accounts, a.concat(l))),
              { added: l.length, skipped: e.length - l.length }
            );
          });
        },
      });
      break;
    }
    case 137: {
      Object.assign(bgAccountsState.store, {
        updateAccount(e, n) {
          return bgPlatformState.R(async () => {
            let [i, a, o, s] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
                bgPlatformState.t.get(bgPlatformState.r.removedBuiltinSiteIds, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, []),
              ]),
              c = i.find((t) => t.id === e);
            if (!c) throw Error(`账号不存在或已被删除`);
            let l = yo(c, n);
            if (
              (l.proxyMode ?? `inherit`) === `pool` &&
              (l.proxyId !== c.proxyId || (c.proxyMode ?? `inherit`) !== `pool`)
            ) {
              if (!l.proxyId) throw Error(`账号选择了代理池，但没有指定真实出口`);
              bgProxiesState.vo(l.proxyId, bgProxiesState.go(s));
            }
            if (typeof n.siteId != `string` || n.siteId === c.siteId) {
              await bgPlatformState.t.set(
                bgPlatformState.r.accounts,
                i.map((t) => (t.id === e ? yo(t, n) : t)),
              );
              return;
            }
            let u = n.siteId.trim(),
              d = new Set(o);
            if (!(
              a.some((e) => e.id === u) || bgSitesState.j.some((e) => e.id === u && !d.has(e.id))
            ))
              throw Error(`目标站点不存在，请重新选择`);
            let f = c.username.trim().toLowerCase();
            if (
              i.some((t) => t.id !== e && t.siteId === u && t.username.trim().toLowerCase() === f)
            )
              throw Error(`目标站点已有同名账号，不能重复归属`);
            let p = yo(c, { ...n, siteId: u });
            (delete p.identity,
              delete p.loginMethod,
              delete p.loginEntry,
              delete p.apiToken,
              delete p.githubUsername,
              delete p.githubPassword,
              delete p.passkey);
            let m = i.map((t) => (t.id === e ? p : t)),
              [h, g, _] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.status, {}),
                bgPlatformState.t.get(bgPlatformState.r.results, {}),
                bgPlatformState.t.get(bgPlatformState.r.balances, {}),
              ]),
              v = `${e}:`;
            await bgPlatformState.t.setMany({
              [bgPlatformState.r.accounts]: m,
              [bgPlatformState.r.status]: Object.fromEntries(
                Object.entries(h).filter(([e]) => !e.startsWith(v)),
              ),
              [bgPlatformState.r.results]: Object.fromEntries(
                Object.entries(g).filter(([t]) => t !== e),
              ),
              [bgPlatformState.r.balances]: Object.fromEntries(
                Object.entries(_).filter(([t]) => t !== e),
              ),
            });
          });
        },
      });
      break;
    }
    case 138: {
      Object.assign(bgAccountsState.store, {
        saveAccountSession(e, n) {
          return bgPlatformState.R(async () => {
            let i = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).map((t) =>
              t.id === e ? { ...t, identity: { ...t.identity, session: n } } : t,
            );
            await bgPlatformState.t.set(bgPlatformState.r.accounts, i);
          });
        },
      });
      break;
    }
    case 139: {
      Object.assign(bgAccountsState.store, {
        saveAccountIdentity(e, n, i = {}) {
          return bgPlatformState.R(async () => {
            let a = await bgPlatformState.t.get(bgPlatformState.r.accounts, []),
              o = a.find((t) => t.id === e);
            if (!o) return;
            let s = Object.fromEntries(Object.entries(n).filter(([, e]) => e != null && e !== ``)),
              c = typeof s.userId == `string` ? s.userId : void 0,
              l = new Set(
                c
                  ? a
                      .filter(
                        (t) => t.id !== e && t.siteId === o.siteId && t.identity?.userId === c,
                      )
                      .map((e) => e.id)
                  : [],
              ),
              u = !!c && !!o.identity?.userId && o.identity.userId !== c;
            if (
              !c &&
              findIdentityOwner(
                s,
                a
                  .filter((account) => account.id !== e && account.siteId === o.siteId)
                  .map((account) => ({
                    ...account.identity,
                    label: account.label || account.username,
                  })),
              )
            )
              throw Error(`本站其他账号已占用该登录标识，已保留原账号数据`);
            if (
              i.preserveBinding &&
              !o.identity?.userId &&
              (o.identity?.username || o.identity?.email) &&
              compareAccountIdentity(s, o.username, void 0, {
                expectedIdentity: o.identity,
              }).match !== `confirmed`
            )
              throw Error(`登录标识与本账号原有绑定不符，已保留原绑定`);
            if (i.preserveBinding && (u || l.size > 0))
              throw Error(`身份绑定发生冲突，已保留原账号及其他账号的数据`);
            let d =
                s.verifiedByManagedLogin === !0 ||
                (o.identity?.verifiedByManagedLogin === !0 &&
                  (!c || c === o.identity.userId) &&
                  s.source === void 0),
              f = a.map((t) =>
                t.id === e
                  ? {
                      ...t,
                      identity: (() => {
                        let e = { ...t.identity, ...s, fetchedAt: Date.now() };
                        return (
                          d ? (e.verifiedByManagedLogin = !0) : delete e.verifiedByManagedLogin,
                          e
                        );
                      })(),
                    }
                  : l.has(t.id)
                    ? {
                        ...t,
                        identity: t.identity?.session ? { session: t.identity.session } : void 0,
                      }
                    : t,
              );
            if (l.size === 0 && !u) {
              await bgPlatformState.t.set(bgPlatformState.r.accounts, f);
              return;
            }
            let [p, m, h] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.status, {}),
                bgPlatformState.t.get(bgPlatformState.r.results, {}),
                bgPlatformState.t.get(bgPlatformState.r.balances, {}),
              ]),
              g = new Set(l);
            u && g.add(e);
            let _ = [...l].map((e) => `${e}:`);
            await bgPlatformState.t.setMany({
              [bgPlatformState.r.accounts]: f,
              [bgPlatformState.r.status]: Object.fromEntries(
                Object.entries(p).filter(([e]) => !_.some((t) => e.startsWith(t))),
              ),
              [bgPlatformState.r.results]: Object.fromEntries(
                Object.entries(m).filter(([e]) => !g.has(e)),
              ),
              [bgPlatformState.r.balances]: Object.fromEntries(
                Object.entries(h).filter(([e]) => !g.has(e)),
              ),
            });
          });
        },
      });
      break;
    }
  }
}

export const accountService = Object.freeze({
  list: () => bgPlatformState.t.get(bgPlatformState.r.accounts, []),
  add: (...args) => bgAccountsState.store.addAccount(...args),
  addMany: (...args) => bgAccountsState.store.addAccounts(...args),
  update: (...args) => bgAccountsState.store.updateAccount(...args),
  remove: (accountId) =>
    bgEntryState.nh({
      action: 'delete-entities',
      siteIds: [],
      accountIds: [accountId],
    }),
  removeMany: (accountIds) =>
    bgEntryState.nh({
      action: 'delete-entities',
      siteIds: [],
      accountIds: [...accountIds],
    }),
  saveSession: (...args) => bgAccountsState.store.saveAccountSession(...args),
  saveIdentity: (...args) => bgAccountsState.store.saveAccountIdentity(...args),
  handleMessage: handleAccountsMessage,
  handleMutation: handleAccountsMutation,
});
