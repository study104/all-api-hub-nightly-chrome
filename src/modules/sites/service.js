/** 站点管理后台：内置适配、配置校验、站点保存与学习流程配置。 */
import { bgAccountsState } from '../accounts/service.js';
import { bgCheckinState } from '../checkin/service.js';
import { bgProxiesState } from '../proxies/service.js';
import { bgPlatformState } from '../../shared/background-platform.js';
import { bgEntryState } from '../../entries/background.js';

export const bgSitesState = { store: {} };

const loginPageProbePending = new Map();
const loginPageProbeTimeout = 6000;

function ae(e, t, n, r) {
  return {
    id: e,
    name: t,
    loginUrl: n,
    favicon: new URL(`/favicon.ico`, n).href,
    builtin: !0,
    ...r,
    selectors: { ...r.selectors },
    closeModalSelectors: [...r.closeModalSelectors],
    checkin: r.checkin ? { ...r.checkin } : void 0,
    adapter: r.adapter ? { ...r.adapter } : void 0,
  };
}

function oe(e) {
  return e.checkin?.method === `workflow`;
}

function se(e) {
  return e.checkin?.method === `none` && e.checkin.learnedLoginAsCheckin === !0;
}

function ce(e) {
  return oe(e) || se(e);
}

function ue(e) {
  let t = e.checkin?.workflow?.steps;
  if (!oe(e) || !Array.isArray(t)) return !1;
  let n = (e) =>
    e.some((e) => {
      if (!e || typeof e != `object`) return !1;
      let t = e;
      return typeof t.type == `string` && bgSitesState.le.has(t.type)
        ? !0
        : (Array.isArray(t.then) && n(t.then)) || (Array.isArray(t.else) && n(t.else));
    });
  return n(t);
}

function de(e, t) {
  let n = t.checkin;
  return (
    e.id === `builtin-futurehub` &&
    n?.method === `auto` &&
    n.workflow === void 0 &&
    (!n.url || n.url === `/console/personal`) &&
    !n.buttonSelector &&
    !n.alreadySelector &&
    !n.successSelector
  );
}

function fe(e, t) {
  let n = t.checkin;
  return (
    e.id === `builtin-anyrouter` &&
    n?.method === `auto` &&
    n.workflow === void 0 &&
    (!n.url || n.url === `/console/personal`) &&
    !n.buttonSelector &&
    !n.alreadySelector &&
    !n.successSelector
  );
}

function pe(e, t) {
  if (!t) return { ...e, builtin: !0 };
  let n = de(e, t),
    r = fe(e, t),
    i = n || r,
    a = !!t.checkin && se(t);
  return {
    ...e,
    ...t,
    selectors: { ...e.selectors, ...t.selectors },
    closeModalSelectors: t.closeModalSelectors?.length
      ? t.closeModalSelectors
      : e.closeModalSelectors,
    ...(e.checkin || t.checkin
      ? {
          checkin: a
            ? { ...t.checkin, method: `none` }
            : i
              ? { ...e.checkin, method: e.checkin?.method ?? `auto` }
              : {
                  ...e.checkin,
                  ...t.checkin,
                  method: t.checkin?.method ?? e.checkin?.method ?? `auto`,
                },
        }
      : {}),
    ...(e.adapter || t.adapter ? { adapter: { ...e.adapter, ...t.adapter } } : {}),
    ...(e.tokenConfig || t.tokenConfig
      ? { tokenConfig: { ...e.tokenConfig, ...t.tokenConfig } }
      : {}),
    builtin: !0,
  };
}

function me(e) {
  return e.nameOnly === !0;
}

function Vt(e, t) {
  return {
    siteType: e.siteType,
    evidence: t,
    preset: e.preset,
    templateLabel: e.label,
    templateId: e.id,
  };
}

async function Ht(e) {
  let t = new AbortController(),
    n = setTimeout(() => t.abort(), bgSitesState.zt);
  try {
    return await fetch(e, {
      method: `GET`,
      credentials: `omit`,
      cache: `no-store`,
      headers: { Accept: `application/json, text/html` },
      signal: t.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(n);
  }
}

function Ut(e) {
  let t;
  try {
    t = new URL(e).hostname.toLowerCase();
  } catch {
    return null;
  }
  for (let e of bgSitesState.ie)
    if ((e.fingerprints.hostnames ?? []).some((e) => e.toLowerCase() === t))
      return Vt(e, `域名 ${t} 是已知的${e.label}站点`);
  return null;
}

async function Wt(e) {
  for (let t of bgSitesState.ie) {
    let n = t.fingerprints.endpoint;
    if (!n) continue;
    let r;
    try {
      r = new URL(n.path, e).href;
    } catch {
      continue;
    }
    let i = await Ht(r);
    if (!i || !(i.headers.get(`content-type`)?.toLowerCase() ?? ``).includes(`json`)) continue;
    let a = await i.json().catch(() => null);
    if (a !== null && n.match(a)) {
      if (t.id === `new-api`) {
        let t = await Kt(e);
        if (t) return t;
      }
      return Vt(t, `${n.path} 的响应形状符合${t.label}`);
    }
  }
  return null;
}

function Gt(e) {
  return (
    /<input[^>]+type=["']?password/i.test(e) || /<input[^>]+name=["']?(?:username|email)\b/i.test(e)
  );
}

async function Kt(e) {
  let t = bgSitesState.ie.find((e) => e.id === `new-api-next`);
  if (!t) return null;
  let n, r;
  try {
    ((n = new URL(`/sign-in`, e).href), (r = new URL(`/login`, e).href));
  } catch {
    return null;
  }
  let [i, a] = await Promise.all([Ht(n), Ht(r)]);
  if (!i?.ok) return null;
  let o = await i.text().catch(() => ``),
    s = (e) => /\b404\b|not\s*found|页面不存在|找不到页面/i.test(e.slice(0, 2e4));
  return s(o) || !(!a || a.status === 404 || (a.ok && s(await a.text().catch(() => ``)) && !Gt(o)))
    ? null
    : Vt(
        t,
        `/api/user/self 符合 new-api 系，且站点使用 /sign-in 登录、没有 /login 路由（新版界面）`,
      );
}

async function qt(e) {
  let t;
  try {
    t = new URL(`/`, e).href;
  } catch {
    return null;
  }
  let n = await Ht(t);
  if (!n || !n.ok) return null;
  let r = await n.text().catch(() => ``),
    i = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(r)?.[1]?.trim().toLowerCase();
  if (!i) return null;
  for (let e of bgSitesState.ie)
    for (let t of e.fingerprints.titleWords ?? [])
      if (i.includes(t.toLowerCase())) return Vt(e, `首页标题「${i.slice(0, 40)}」含「${t}」`);
  return null;
}

async function Jt(e) {
  if (!e.trim()) return bgSitesState.Bt;
  try {
    let t = new URL(e.trim());
    if ((t.protocol === `http:` || t.protocol === `https:`) && bgAccountsState.Rt(t.hostname))
      return { siteType: bgSitesState.u.UNKNOWN, evidence: `目标地址指向本机或内网，已拒绝` };
  } catch {}
  return Ut(e) || (await Wt(e)) || (await qt(e)) || bgSitesState.Bt;
}

function or(e) {
  if (e == null || e === ``) return {};
  let t = String(e),
    n = {};
  for (let e of bgSitesState.ir) n[e] = t;
  return n;
}

function lr(e) {
  return typeof e == `string` && Object.values(bgSitesState.d).includes(e);
}

function ur(e) {
  return e === bgSitesState.u.SUB2API
    ? bgSitesState.d.SUB2API
    : e === bgSitesState.u.VO_API_V2
      ? bgSitesState.d.VO_API_V2
      : e && bgSitesState.cr.has(e)
        ? bgSitesState.d.NEW_API
        : bgSitesState.d.UNSUPPORTED;
}

function dr(e) {
  let t = e?.trim();
  if (t) return t.startsWith(`/`) ? t : `/${t}`;
}

function fr(e) {
  let t = e.adapter,
    n = lr(t?.family) ? t.family : ur(t?.siteType),
    r =
      t && Object.prototype.hasOwnProperty.call(t, `checkinPath`)
        ? dr(t?.checkinPath)
        : bgSitesState.sr[n].checkinPath,
    i = (t?.checkin?.pathPatterns ?? []).map((e) => dr(e.replace(/\*$/, ``))).filter((e) => !!e),
    a = (t?.checkin?.titleWords ?? []).map((e) => e.trim()).filter(Boolean);
  return {
    family: n,
    ...(t?.siteType ? { siteType: t.siteType } : {}),
    ...(r ? { checkinPath: r } : {}),
    checkinPathPatterns: i,
    checkinTitleWords: a,
  };
}

function pr(e) {
  return fr(e).checkinPath;
}

function mr(e) {
  let t = e.authBootstrap,
    n = t?.endpoint?.trim();
  if (!t || !n) return null;
  let r;
  try {
    r = new URL(n, e.loginUrl).href;
  } catch {
    return null;
  }
  return bgCheckinState.N(e, r)
    ? {
        url: r,
        method: `POST`,
        ...(t.tokenPath?.length ? { tokenPath: t.tokenPath } : {}),
        header: t.header?.trim() || `Authorization`,
        prefix: t.prefix ?? `Bearer `,
      }
    : null;
}

function ya(e) {
  try {
    return e.id === `real-sharedchat` || new URL(e.loginUrl).hostname === `new.sharedchat.cc`;
  } catch {
    return e.id === `real-sharedchat`;
  }
}

function ba(e) {
  return e.map((e) => {
    let t = e;
    if (!Object.prototype.hasOwnProperty.call(t, `checkinMethod`)) return e;
    let { checkinMethod: n, ...r } = t;
    return r;
  });
}

function xa(e) {
  let t = new Map();
  for (let n of e) {
    let e = n.identity?.userId?.trim();
    if (!e) continue;
    let r = `${n.siteId}\u0000${e}`,
      i = t.get(r) ?? [];
    (i.push(n.id), t.set(r, i));
  }
  return new Set([...t.values()].filter((e) => e.length > 1).flat());
}

function Sa(e) {
  return { ...e, identity: e.identity?.session ? { session: e.identity.session } : void 0 };
}

function F(e) {
  try {
    return new URL(e.loginUrl).hostname.toLowerCase();
  } catch {
    return ``;
  }
}

function Ca(e) {
  return F(e) === `agentrouter.org` || F(e) === `ps.air-outer.com`;
}

function wa(e) {
  let t = (() => {
      try {
        let t = new URL(e.loginUrl);
        return ((t.pathname = `/login`), (t.search = ``), (t.hash = ``), t.href);
      } catch {
        return e.loginUrl;
      }
    })(),
    n =
      !e.successIndicator ||
      e.successIndicator === `a[href="/console/token"], a[href="/console/topup"]`,
    r =
      e.checkin?.method === `relogin`
        ? {
            ...bgSitesState.f.checkin,
            ...e.checkin,
            logoutStorageKeys: [
              ...new Set([
                ...(e.checkin.logoutStorageKeys ?? []),
                ...(bgSitesState.f.checkin?.logoutStorageKeys ?? []),
              ]),
            ],
          }
        : e.checkin;
  return {
    ...e,
    loginUrl: t,
    pointerMode: e.pointerMode ?? bgSitesState.f.pointerMode,
    successIndicator: n ? bgSitesState.f.successIndicator : e.successIndicator,
    identitySource: { ...bgSitesState.f.identitySource, ...e.identitySource },
    closeModalSelectors: [
      ...new Set([
        `button >> text=今日关闭`,
        `button >> text=关闭公告`,
        ...(e.closeModalSelectors ?? []).filter(
          (e) => e !== `button >> text=今日关闭` && e !== `button >> text=关闭公告`,
        ),
      ]),
    ],
    ...(r ? { checkin: r } : {}),
  };
}

function Ta(e) {
  if (F(e) !== `api.futureppo.top` || se(e)) return !1;
  let t = e.checkin;
  return (
    !t ||
    ((t.method === `auto` || t.method === `none`) &&
      t.workflow === void 0 &&
      !t.buttonSelector &&
      !t.alreadySelector &&
      !t.successSelector)
  );
}

function Ea(e) {
  if (F(e) !== `anyrouter.top` || se(e)) return !1;
  let t = e.checkin;
  return (
    !t ||
    ((t.method === `auto` || t.method === `none`) &&
      t.workflow === void 0 &&
      !t.buttonSelector &&
      !t.alreadySelector &&
      !t.successSelector)
  );
}

function Da(e) {
  if (F(e) !== `linux.sb`) return !1;
  let t = e.checkin;
  return t
    ? t.method !== `auto` && t.method !== `button`
      ? !1
      : !t.url &&
        !t.apiUrl &&
        !t.entry &&
        !t.claimEntrySelector &&
        !t.claimConfirmSelector &&
        !t.logoutSelector &&
        !t.logoutApiUrl &&
        !t.workflow
    : !0;
}

function Oa(e) {
  if (F(e) !== `linux.sb`) return !1;
  try {
    return new URL(e.loginUrl).pathname.replace(/\/+$/, ``) === ``;
  } catch {
    return !1;
  }
}

function ka(e) {
  if (!Oa(e)) return e;
  try {
    let t = new URL(e.loginUrl);
    return ((t.pathname = `/login`), (t.search = ``), (t.hash = ``), { ...e, loginUrl: t.href });
  } catch {
    return e;
  }
}

function Aa(e) {
  let t = bgSitesState.w.checkin,
    n = bgSitesState.w.adapter,
    r = e.checkin,
    i = (() => {
      try {
        let t = new URL(e.loginUrl);
        return ((t.pathname = `/login`), (t.search = ``), (t.hash = ``), t.href);
      } catch {
        return e.loginUrl;
      }
    })();
  return {
    ...e,
    loginUrl: i,
    pointerMode: e.pointerMode ?? bgSitesState.w.pointerMode,
    loginMethod: e.loginMethod || bgSitesState.w.loginMethod || `form`,
    selectors: { ...bgSitesState.w.selectors, ...e.selectors },
    closeModalSelectors: e.closeModalSelectors?.length
      ? [...e.closeModalSelectors]
      : [...bgSitesState.w.closeModalSelectors],
    successIndicator: e.successIndicator ?? bgSitesState.w.successIndicator,
    checkin: {
      ...t,
      ...r,
      url: t.url,
      successText: r?.successText ? [...r.successText] : [...(t.successText ?? [])],
      alreadyText: r?.alreadyText ? [...r.alreadyText] : [...(t.alreadyText ?? [])],
    },
    adapter: {
      ...e.adapter,
      ...n,
      checkin: {
        ...e.adapter?.checkin,
        ...n.checkin,
        pathPatterns: [...(n.checkin?.pathPatterns ?? [])],
        titleWords: [...(n.checkin?.titleWords ?? [])],
      },
    },
  };
}

function I(e, t, n) {
  if (!t) return !1;
  try {
    let r = (e) => e.replace(/\/+$/, ``) || `/`;
    return r(new URL(t, e.loginUrl).pathname) === r(n);
  } catch {
    return !1;
  }
}

function L(e, t) {
  return !!e && e.length === t.length && e.every((e, n) => e === t[n]);
}

function Ma(e) {
  if (F(e) !== bgSitesState.ja) return !1;
  try {
    let t = new URL(e.loginUrl),
      n = t.pathname.replace(/\/+$/, ``) || `/`;
    if (
      t.protocol !== `https:` ||
      t.hostname.toLowerCase() !== bgSitesState.ja ||
      t.port ||
      !new Set([`/`, `/login`, `/user/login`, `/console`, `/console/personal`, `/dashboard`]).has(n)
    )
      return !1;
  } catch {
    return !1;
  }
  let t = e.checkin;
  if (
    !t ||
    t.method !== `auto` ||
    !Object.keys(t).every((e) => [`method`, `url`, `apiUrl`].includes(e)) ||
    (t.url && !I(e, t.url, `/`) && !I(e, t.url, `/console/personal`)) ||
    (t.apiUrl && !I(e, t.apiUrl, `/api/user/checkin`))
  )
    return !1;
  let n = e.adapter;
  return !(
    (n?.family && n.family !== bgSitesState.d.NEW_API) ||
    (n?.siteType && n.siteType !== bgSitesState.u.NEW_API) ||
    (n?.checkinPath && !I(e, n.checkinPath, `/console/personal`)) ||
    (n?.quotaPerUnit != null && n.quotaPerUnit !== 5e5) ||
    (n?.checkin?.pathPatterns &&
      !L(n.checkin.pathPatterns, [`/console/personal*`, `/dashboard*`])) ||
    (n?.checkin?.titleWords && !L(n.checkin.titleWords, [`每日签到`, `daily check-in`]))
  );
}

function Na(e) {
  let t = bgSitesState.re,
    n = t.checkin,
    r = t.adapter,
    i = (() => {
      try {
        let t = new URL(e.loginUrl),
          n = t.pathname.replace(/\/+$/, ``) || `/`;
        return new Set([
          `/`,
          `/login`,
          `/user/login`,
          `/console`,
          `/console/personal`,
          `/dashboard`,
        ]).has(n)
          ? ((t.pathname = `/`), (t.search = ``), (t.hash = ``), t.href)
          : e.loginUrl;
      } catch {
        return e.loginUrl;
      }
    })();
  return {
    ...e,
    loginUrl: i,
    pointerMode: e.pointerMode ?? t.pointerMode,
    preLoginClickSelector: e.preLoginClickSelector ?? t.preLoginClickSelector,
    loginMethod:
      e.loginMethod === `auto`
        ? (t.loginMethod ?? `form`)
        : e.loginMethod || t.loginMethod || `form`,
    selectors: { ...t.selectors, ...e.selectors },
    closeModalSelectors: e.closeModalSelectors?.length
      ? [...e.closeModalSelectors]
      : [...t.closeModalSelectors],
    checkin: {
      ...n,
      successText: [...(n.successText ?? [])],
      alreadyText: [...(n.alreadyText ?? [])],
    },
    adapter: {
      ...e.adapter,
      siteType: r.siteType,
      family: r.family,
      checkinPath: r.checkinPath,
      checkin: {
        pathPatterns: [...(r.checkin?.pathPatterns ?? [])],
        titleWords: [...(r.checkin?.titleWords ?? [])],
      },
      quotaPerUnit: r.quotaPerUnit,
    },
  };
}

function Pa(e) {
  if (F(e) !== `vsllm.com`) return !1;
  let t = e.checkin;
  return (
    !t ||
    !(
      t.method !== `auto` ||
      !Object.keys(t).every((e) => [`method`, `url`, `apiUrl`].includes(e)) ||
      (t.url && !I(e, t.url, `/console/personal`)) ||
      (t.apiUrl && !I(e, t.apiUrl, `/api/user/checkin`))
    )
  );
}

function Fa(e) {
  let t = bgSitesState.te,
    n = t.adapter,
    r = (() => {
      try {
        let t = new URL(e.loginUrl),
          n = t.pathname.replace(/\/+$/, ``);
        return new Set([``, `/login`, `/console`, `/console/personal`, `/console/topup`]).has(n)
          ? ((t.pathname = `/login`), (t.search = ``), (t.hash = ``), t.href)
          : e.loginUrl;
      } catch {
        return e.loginUrl;
      }
    })();
  return {
    ...e,
    loginUrl: r,
    pointerMode: e.pointerMode ?? t.pointerMode,
    loginMethod: e.loginMethod || t.loginMethod || `auto`,
    selectors: { ...t.selectors, ...e.selectors },
    closeModalSelectors: e.closeModalSelectors?.length
      ? [...e.closeModalSelectors]
      : [...t.closeModalSelectors],
    checkin: {
      ...t.checkin,
      successText: [...(t.checkin?.successText ?? [])],
      alreadyText: [...(t.checkin?.alreadyText ?? [])],
    },
    adapter: {
      ...e.adapter,
      siteType: n.siteType,
      family: n.family,
      checkinPath: n.checkinPath,
      checkin: {
        pathPatterns: [...(n.checkin?.pathPatterns ?? [])],
        titleWords: [...(n.checkin?.titleWords ?? [])],
      },
      quotaPerUnit: e.adapter?.quotaPerUnit ?? n.quotaPerUnit,
    },
  };
}

function Ia(e) {
  if (F(e) !== `vsllm.com`) return e;
  let t = e.checkin?.workflow?.steps;
  if (!Array.isArray(t) || !t.some((e) => e?.type === `vsllm-daily`)) return e;
  let n = bgSitesState.te.checkin;
  return {
    ...e,
    checkin: {
      ...n,
      successText: [...(n.successText ?? [])],
      alreadyText: [...(n.alreadyText ?? [])],
    },
  };
}

function Ra(e) {
  let t = e.checkin;
  if (
    t?.method !== `none` ||
    !t.learnedLoginAsCheckin ||
    t.learnedLoginAsCheckinSource === `explicit` ||
    (t.workflow?.steps.length ?? 0) > 0
  )
    return e;
  try {
    let t = new URL(e.loginUrl);
    if (t.protocol !== `https:` || t.hostname !== bgSitesState.La || t.port) return e;
  } catch {
    return e;
  }
  return {
    ...e,
    checkin: { method: `workflow`, workflow: { steps: [{ type: `leilei-daily` }] } },
  };
}

function za(e) {
  if (F(e) !== bgSitesState.La) return !1;
  try {
    let t = new URL(e.loginUrl);
    if (t.protocol !== `https:` || t.hostname.toLowerCase() !== bgSitesState.La || t.port)
      return !1;
    let n = t.pathname.replace(/\/+$/, ``) || `/`;
    if (!new Set([`/`, `/login`, `/sign-in`, `/profile`, `/console`, `/console/personal`]).has(n))
      return !1;
  } catch {
    return !1;
  }
  let t = e.checkin;
  if (
    t?.method === `workflow` ||
    (t && t.method !== `auto` && t.method !== `button`) ||
    (t?.method === `button` &&
      (!I(e, t.url, `/profile`) ||
        t.buttonSelector !== `button >> text=立即签到, button >> text=签到` ||
        t.alreadySelector !== `button >> text=已签到` ||
        (t.successText && !L(t.successText, [`签到成功`, `今天 +`])) ||
        (t.alreadyText && !L(t.alreadyText, [`已签到`, `今日已签到`])) ||
        !Object.keys(t).every((e) =>
          [
            `method`,
            `url`,
            `buttonSelector`,
            `alreadySelector`,
            `successText`,
            `alreadyText`,
          ].includes(e),
        ))) ||
    (t?.method === `auto` &&
      (!Object.keys(t).every((e) => [`method`, `url`, `apiUrl`].includes(e)) ||
        (t.url && !I(e, t.url, `/profile`) && !I(e, t.url, `/console/personal`)) ||
        (t.apiUrl && !I(e, t.apiUrl, `/api/user/checkin`))))
  )
    return !1;
  let n = e.adapter;
  return !(
    (n?.family && n.family !== bgSitesState.d.NEW_API) ||
    (n?.siteType && n.siteType !== bgSitesState.u.NEW_API) ||
    (n?.checkinPath &&
      !I(e, n.checkinPath, `/profile`) &&
      !I(e, n.checkinPath, `/console/personal`)) ||
    (n?.checkin?.pathPatterns &&
      !L(n.checkin.pathPatterns, [`/profile*`]) &&
      !L(n.checkin.pathPatterns, [`/profile*`, `/lottery*`]) &&
      !L(n.checkin.pathPatterns, [`/console/personal*`])) ||
    (n?.checkin?.titleWords &&
      !L(n.checkin.titleWords, [`每日签到`]) &&
      !L(n.checkin.titleWords, [`每日签到`, `浮梦引光`, `抽奖`]) &&
      !L(n.checkin.titleWords, [`每日签到`, `daily check-in`]))
  );
}

function Ba(e) {
  let t = bgSitesState.A,
    n = t.adapter,
    r = t.checkin?.workflow,
    i = (() => {
      try {
        let t = new URL(e.loginUrl);
        return ((t.pathname = `/sign-in`), (t.search = ``), (t.hash = ``), t.href);
      } catch {
        return e.loginUrl;
      }
    })();
  return {
    ...e,
    loginUrl: i,
    pointerMode: e.pointerMode ?? t.pointerMode,
    loginMethod: e.loginMethod || t.loginMethod || `auto`,
    selectors: { ...t.selectors, ...e.selectors },
    successIndicator: e.successIndicator || t.successIndicator,
    closeModalSelectors: e.closeModalSelectors?.length
      ? [...e.closeModalSelectors]
      : [...t.closeModalSelectors],
    checkin: { method: `workflow`, workflow: { steps: (r?.steps ?? []).map((e) => ({ ...e })) } },
    adapter: {
      ...e.adapter,
      siteType: n.siteType,
      family: n.family,
      checkinPath: n.checkinPath,
      checkin: {
        pathPatterns: [...(n.checkin?.pathPatterns ?? [])],
        titleWords: [...(n.checkin?.titleWords ?? [])],
      },
      quotaPerUnit: e.adapter?.quotaPerUnit ?? n.quotaPerUnit,
    },
    ...(t.authBootstrap ? { authBootstrap: { ...t.authBootstrap } } : {}),
  };
}

function Va(e) {
  if (
    F(e) !== bgSitesState.La ||
    e.checkin?.method !== `workflow` ||
    !(e.checkin.workflow?.steps ?? []).some((e) => e.type === `leilei-daily`)
  )
    return !1;
  let t = e.adapter?.checkinPath,
    n = e.adapter?.checkin?.pathPatterns ?? [];
  return t === `/profile` || !n.some((e) => e.startsWith(`/lottery`));
}

function Ha(e) {
  return F(e) !== bgSitesState.La || e.checkin?.method !== `workflow`
    ? !1
    : !e.authBootstrap?.endpoint;
}

function Ua(e) {
  let t = bgSitesState.A.authBootstrap;
  return t ? { ...e, authBootstrap: { ...t } } : e;
}

function Wa(e) {
  let t = bgSitesState.A.adapter;
  return {
    ...e,
    adapter: {
      ...e.adapter,
      siteType: e.adapter?.siteType ?? t.siteType,
      family: e.adapter?.family ?? t.family,
      checkinPath: t.checkinPath,
      checkin: {
        pathPatterns: [...(t.checkin?.pathPatterns ?? [])],
        titleWords: [...(t.checkin?.titleWords ?? [])],
      },
      quotaPerUnit: e.adapter?.quotaPerUnit ?? t.quotaPerUnit,
    },
  };
}

function Ka(e) {
  if (F(e) !== `sub.100xlabs.space`) return !1;
  let t = e.checkin;
  if (!t) return !0;
  if (se(e)) return !1;
  if (t.method === `none`)
    return (
      Object.keys(t).every((e) => [`method`, `url`].includes(e)) &&
      (!t.url || I(e, t.url, `/check-in`) || I(e, t.url, `/console/personal`))
    );
  if (t.method !== `auto` || !Object.keys(t).every((e) => [`method`, `url`, `apiUrl`].includes(e)))
    return !1;
  let n = I(e, t.url, `/check-in`) && !t.apiUrl,
    r = I(e, t.url, `/console/personal`) && I(e, t.apiUrl, `/api/user/checkin`);
  return n || r;
}

function qa(e) {
  let t = bgSitesState.y,
    n = t.checkin,
    r = t.adapter,
    i = (() => {
      try {
        let t = new URL(e.loginUrl),
          n = t.pathname.replace(/\/+$/, ``);
        return [``, `/check-in`, `/dashboard`, `/console/personal`].includes(n)
          ? ((t.pathname = `/login`), (t.search = ``), (t.hash = ``), t.href)
          : e.loginUrl;
      } catch {
        return e.loginUrl;
      }
    })();
  return {
    ...e,
    loginUrl: i,
    loginMethod: e.loginMethod || t.loginMethod || `form`,
    selectors: { ...t.selectors, ...e.selectors },
    closeModalSelectors: e.closeModalSelectors?.length
      ? [...e.closeModalSelectors]
      : [...t.closeModalSelectors],
    ...(t.tokenConfig || e.tokenConfig
      ? { tokenConfig: { ...t.tokenConfig, ...e.tokenConfig } }
      : {}),
    checkin: {
      ...n,
      successText: [...(n.successText ?? [])],
      alreadyText: [...(n.alreadyText ?? [])],
    },
    adapter: {
      ...e.adapter,
      ...r,
      checkin: {
        ...r.checkin,
        pathPatterns: [...(r.checkin?.pathPatterns ?? [])],
        titleWords: [...(r.checkin?.titleWords ?? [])],
      },
    },
  };
}

function Ja(e) {
  return bgSitesState.Ga.has(F(e));
}

function Ya(e) {
  let t = e.checkin;
  return (
    !t ||
    !(
      se(e) ||
      (t.method !== `auto` && t.method !== `none`) ||
      !Object.keys(t).every((e) => [`method`, `url`, `apiUrl`].includes(e)) ||
      (t.url && !I(e, t.url, `/console/personal`) && !I(e, t.url, `/profile`)) ||
      (t.apiUrl && !I(e, t.apiUrl, `/api/user/checkin`))
    )
  );
}

function Xa(e) {
  let t = bgSitesState.D,
    n = Ya(e),
    r = n || I(e, e.checkin?.url, `/profile`),
    i = (() => {
      try {
        let t = new URL(e.loginUrl),
          n = t.pathname.replace(/\/+$/, ``);
        return new Set([
          ``,
          `/login`,
          `/profile`,
          `/console`,
          `/console/personal`,
          `/keys`,
          `/wallet`,
        ]).has(n)
          ? ((t.pathname = `/sign-in`), (t.search = ``), (t.hash = ``), t.href)
          : e.loginUrl;
      } catch {
        return e.loginUrl;
      }
    })(),
    a = t.checkin,
    o = t.adapter,
    s = e.selectors.submit === `button[type="submit"]`,
    c = e.successIndicator === `a[href="/console/token"], a[href="/console/topup"]`;
  return {
    ...e,
    loginUrl: i,
    pointerMode: e.pointerMode ?? t.pointerMode,
    loginMethod: e.loginMethod || t.loginMethod || `auto`,
    selectors: { ...t.selectors, ...e.selectors, ...(s ? { submit: t.selectors.submit } : {}) },
    successIndicator: !e.successIndicator || c ? t.successIndicator : e.successIndicator,
    ...(n
      ? {
          checkin: {
            ...a,
            successText: [...(a.successText ?? [])],
            alreadyText: [...(a.alreadyText ?? [])],
          },
        }
      : {}),
    adapter: {
      ...e.adapter,
      siteType: bgSitesState.u.NEW_API,
      family: bgSitesState.d.NEW_API,
      ...(r
        ? {
            checkinPath: `/profile`,
            checkin: e.adapter?.checkin ?? {
              pathPatterns: [...(o.checkin?.pathPatterns ?? [])],
              titleWords: [...(o.checkin?.titleWords ?? [])],
            },
          }
        : {}),
      quotaPerUnit: e.adapter?.quotaPerUnit ?? o.quotaPerUnit,
    },
  };
}

function Za(e) {
  if (F(e) !== `k40.shengqainbang.cn`) return !1;
  let t = e.checkin;
  if (!t) return !0;
  if (se(e)) return !1;
  if (
    t.method === `none` ||
    (t.method === `button` &&
      I(e, t.url, `/profile`) &&
      t.buttonSelector ===
        `button >> text=立即签到, button >> text=立即簽到, button >> text=Check in now` &&
      t.alreadySelector ===
        `button >> text=已签到, button >> text=已簽到, button >> text=Checked in` &&
      L(t.successText, [`签到成功`, `簽到成功`, `Check-in successful`]) &&
      L(t.alreadyText, [`已签到`, `今日已签到`, `已簽到`, `今日已簽到`, `Checked in`]) &&
      Object.keys(t).every((e) =>
        [
          `method`,
          `url`,
          `buttonSelector`,
          `alreadySelector`,
          `successText`,
          `alreadyText`,
        ].includes(e),
      ) &&
      e.adapter?.family === bgSitesState.d.NEW_API &&
      e.adapter?.checkinPath === `/profile` &&
      e.adapter?.quotaPerUnit === 5e5)
  )
    return !0;
  if (t.method !== `auto`) return !1;
  let n =
      I(e, t.url, `/console/personal`) &&
      I(e, t.apiUrl, `/api/user/checkin`) &&
      Object.keys(t).every((e) => [`method`, `url`, `apiUrl`].includes(e)),
    r = I(e, t.url, `/check-in`) && Object.keys(t).every((e) => [`method`, `url`].includes(e));
  return n || r;
}

function Qa(e) {
  let t = bgSitesState.y.checkin,
    n = bgSitesState.y.adapter,
    r = (() => {
      try {
        let t = new URL(e.loginUrl);
        return ((t.pathname = `/login`), (t.search = ``), (t.hash = ``), t.href);
      } catch {
        return e.loginUrl;
      }
    })();
  return {
    ...e,
    loginUrl: r,
    selectors: { ...e.selectors, ...bgSitesState.y.selectors },
    loginMethod: bgSitesState.y.loginMethod || `form`,
    ...(bgSitesState.y.tokenConfig || e.tokenConfig
      ? { tokenConfig: { ...e.tokenConfig, ...bgSitesState.y.tokenConfig } }
      : {}),
    checkin: {
      ...t,
      successText: [...(t.successText ?? [])],
      alreadyText: [...(t.alreadyText ?? [])],
    },
    adapter: {
      ...e.adapter,
      ...n,
      checkin: {
        ...e.adapter?.checkin,
        ...n.checkin,
        pathPatterns: [...(n.checkin?.pathPatterns ?? [])],
        titleWords: [...(n.checkin?.titleWords ?? [])],
      },
    },
  };
}

function $a(e) {
  if (F(e) !== `api.denxio.top`) return !1;
  let t = e.checkin;
  return se(e)
    ? !1
    : !t || t.method === `none`
      ? !0
      : t.method !== `auto` ||
          t.buttonSelector ||
          t.alreadySelector ||
          t.successSelector ||
          t.claimConfirmSelector ||
          t.workflow ||
          t.claimEntrySelector ||
          t.logoutSelector ||
          (t.apiUrl && !I(e, t.apiUrl, `/api/user/checkin`))
        ? !1
        : !t.url ||
          I(e, t.url, `/check-in`) ||
          I(e, t.url, `/console/personal`) ||
          I(e, t.url, `/checkin`);
}

function eo(e) {
  let t = bgSitesState.S.checkin,
    n = bgSitesState.S.adapter,
    r = (() => {
      try {
        let t = new URL(e.loginUrl);
        return ((t.pathname = `/login`), (t.search = ``), (t.hash = ``), t.href);
      } catch {
        return e.loginUrl;
      }
    })();
  return {
    ...e,
    loginUrl: r,
    selectors: { ...bgSitesState.S.selectors, ...e.selectors },
    loginMethod: e.loginMethod || bgSitesState.S.loginMethod || `form`,
    ...(bgSitesState.S.tokenConfig || e.tokenConfig
      ? { tokenConfig: { ...bgSitesState.S.tokenConfig, ...e.tokenConfig } }
      : {}),
    checkin: {
      ...t,
      successText: [...(t.successText ?? [])],
      alreadyText: [...(t.alreadyText ?? [])],
    },
    adapter: {
      ...e.adapter,
      ...n,
      checkin: {
        ...e.adapter?.checkin,
        ...n.checkin,
        pathPatterns: [...(n.checkin?.pathPatterns ?? [])],
        titleWords: [...(n.checkin?.titleWords ?? [])],
      },
    },
  };
}

function to(e) {
  if (F(e) !== `tabitoken.com`) return !1;
  let t = e.checkin,
    n =
      !t ||
      (t.method === `auto` &&
        (!t.url || t.url === `/console/personal`) &&
        !t.buttonSelector &&
        !t.alreadySelector &&
        !t.successSelector &&
        Object.keys(t).every((e) => [`method`, `url`].includes(e))),
    r =
      t?.method === `button` &&
      I(e, t.url, `/profile`) &&
      t.buttonSelector === `button >> text=立即签到, button >> text=签到` &&
      t.alreadySelector === `button >> text=已签到` &&
      !t.entry;
  return n || r;
}

function no(e, t) {
  return JSON.stringify(e) === JSON.stringify(t) ? e : t;
}

function ro(e) {
  let t = e.checkin,
    n = t?.workflow;
  return !t ||
    t.method !== `auto` ||
    t.workflowReplayDisabled === !0 ||
    !n ||
    typeof n.identityPath != `string` ||
    !n.identityPath.trim() ||
    bgCheckinState.st(e, n).length > 0
    ? e
    : { ...e, checkin: { ...t, method: `workflow` } };
}

function oo(e) {
  return e.successIndicator === bgSitesState.io ? { ...e, successIndicator: bgSitesState.ao } : e;
}

function so(e) {
  let t = ka(e);
  if (
    ((t = oo(t)),
    (t = ro(t)),
    (t = Ia(t)),
    (t = Ra(t)),
    Va(t) && (t = Wa(t)),
    Ha(t) && (t = Ua(t)),
    Ma(t))
  )
    t = Na(t);
  else if (Pa(t)) t = Fa(t);
  else if (za(t)) t = Ba(t);
  else if (Ka(t)) t = qa(t);
  else if (Ja(t)) t = Xa(t);
  else if (Ca(t)) t = wa(t);
  else if (Da(t)) t = Aa(t);
  else if ($a(t)) t = eo(t);
  else if (Za(t)) t = Qa(t);
  else if (to(t)) t = lo(t);
  else if (Ea(t)) t = uo(t);
  else if (Ta(t))
    t = {
      ...t,
      loginUrl: `https://api.futureppo.top/login`,
      loginMethod: e.loginMethod || `auto`,
      checkin: {
        method: `button`,
        url: `/console/personal`,
        buttonSelector: `button >> text=立即签到`,
        alreadySelector: `button >> text=今日已签到`,
        alreadyText: [`今日已签到`],
      },
      adapter: {
        ...e.adapter,
        siteType: bgSitesState.u.NEW_API,
        family: bgSitesState.d.NEW_API,
        checkinPath: `/console/personal`,
        checkin: { pathPatterns: [`/console/personal*`], titleWords: [`每日签到`] },
        quotaPerUnit: 5e5,
      },
    };
  else return no(e, t);
  return no(e, t);
}

function co(e) {
  return e.map(so);
}

function lo(e) {
  let t =
      !e.checkin ||
      (e.checkin.method === `auto` &&
        (!e.checkin.url || e.checkin.url === `/console/personal`) &&
        !e.checkin.buttonSelector &&
        !e.checkin.alreadySelector &&
        !e.checkin.successSelector &&
        Object.keys(e.checkin).every((e) => [`method`, `url`].includes(e))),
    n =
      e.checkin?.method === `button` &&
      I(e, e.checkin.url, `/profile`) &&
      e.checkin.buttonSelector === `button >> text=立即签到, button >> text=签到` &&
      e.checkin.alreadySelector === `button >> text=已签到` &&
      !e.checkin.entry,
    r = bgSitesState.O.checkin,
    i = r.entry ? { ...r.entry, steps: r.entry.steps.map((e) => ({ ...e })) } : void 0,
    a = (() => {
      try {
        let t = new URL(e.loginUrl);
        return t.pathname.replace(/\/+$/, ``) === `/login`
          ? ((t.pathname = `/sign-in`), (t.search = ``), (t.hash = ``), t.href)
          : e.loginUrl;
      } catch {
        return e.loginUrl;
      }
    })();
  return {
    ...e,
    loginUrl: a,
    loginMethod: e.loginMethod || `auto`,
    pointerMode: e.pointerMode ?? `trusted`,
    successIndicator: e.successIndicator ?? bgSitesState.O.successIndicator,
    ...(t
      ? {
          checkin: {
            ...r,
            successText: [...(r.successText ?? [])],
            alreadyText: [...(r.alreadyText ?? [])],
            ...(i ? { entry: i } : {}),
          },
        }
      : n && i
        ? { checkin: { ...e.checkin, entry: i } }
        : {}),
    adapter: {
      ...e.adapter,
      siteType: bgSitesState.u.NEW_API,
      family: bgSitesState.d.NEW_API,
      ...(t || n
        ? {
            checkinPath: `/profile`,
            checkin: { pathPatterns: [`/profile*`], titleWords: [`每日签到`] },
          }
        : {}),
      quotaPerUnit: e.adapter?.quotaPerUnit ?? 5e5,
    },
  };
}

function uo(e) {
  return {
    ...e,
    loginMethod: e.loginMethod || `auto`,
    checkin: { method: `none` },
    adapter: {
      ...e.adapter,
      siteType: bgSitesState.u.ANYROUTER,
      family: bgSitesState.d.NEW_API,
      checkinPath: ``,
      checkin: { pathPatterns: [], titleWords: [] },
      quotaPerUnit: e.adapter?.quotaPerUnit ?? 5e5,
    },
  };
}

function fo(e, t) {
  return e.length !== t.length || e.some((e, n) => e !== t[n]);
}

function po(e, t) {
  let n = new Set(t.map((e) => e.siteId));
  return e.filter((e) => !n.has(e));
}

async function mo(e, n) {
  let i = e.filter(ya);
  if (!(i.length > 0 || n.some((e) => e.siteId === `real-sharedchat`)))
    return { userSites: e, accounts: n };
  let a = bgSitesState.j.find((e) => e.id === bgSitesState.va);
  if (!a) return { userSites: e, accounts: n };
  let o = e.find((e) => e.id === bgSitesState.va),
    s = new Set([
      ...(a.checkin?.claimUsedTexts ?? []),
      ...(o?.checkin?.claimUsedTexts ?? []),
      ...i.flatMap((e) => e.checkin?.claimUsedTexts ?? []),
    ]),
    c = {
      ...(o ?? a),
      id: bgSitesState.va,
      builtin: !0,
      checkin: { method: `claim`, ...(o ?? a).checkin, claimUsedTexts: [...s] },
    },
    l = e.filter((e) => !ya(e) && e.id !== bgSitesState.va).concat(c),
    u = new Set(i.map((e) => e.id).concat(`real-sharedchat`)),
    d = n.map((e) => (u.has(e.siteId) ? { ...e, siteId: bgSitesState.va } : e));
  return (
    await bgPlatformState.t.setMany({
      [bgPlatformState.r.sites]: l,
      [bgPlatformState.r.accounts]: d,
    }),
    { userSites: l, accounts: d }
  );
}

async function ho(e, n) {
  let i = new Set(bgSitesState.j.map((e) => e.id)),
    a = e.filter((e) => e.id.startsWith(`builtin-`) && e.builtin !== !1 && !i.has(e.id));
  if (a.length === 0) return { userSites: e, accounts: n };
  let o = new Set(a.map((e) => e.id)),
    s = new Set(n.map((e) => e.siteId)),
    c = e.flatMap((e) => (o.has(e.id) ? (s.has(e.id) ? [{ ...e, builtin: !1 }] : []) : [e]));
  return (await bgPlatformState.t.set(bgPlatformState.r.sites, c), { userSites: c, accounts: n });
}

function Y(e, t) {
  let n = bgSitesState.j.find((t) => t.id === e),
    r = t.find((t) => t.id === e),
    i = n ? pe(n, r) : r;
  return i ? so(i) : void 0;
}

Object.assign(bgSitesState, {
  ae,
  oe,
  se,
  ce,
  ue,
  de,
  fe,
  pe,
  me,
  Vt,
  Ht,
  Ut,
  Wt,
  Gt,
  Kt,
  qt,
  Jt,
  or,
  lr,
  ur,
  dr,
  fr,
  pr,
  mr,
  ya,
  ba,
  xa,
  Sa,
  F,
  Ca,
  wa,
  Ta,
  Ea,
  Da,
  Oa,
  ka,
  Aa,
  I,
  L,
  Ma,
  Na,
  Pa,
  Fa,
  Ia,
  Ra,
  za,
  Ba,
  Va,
  Ha,
  Ua,
  Wa,
  Ka,
  qa,
  Ja,
  Ya,
  Xa,
  Za,
  Qa,
  $a,
  eo,
  to,
  no,
  ro,
  oo,
  so,
  co,
  lo,
  uo,
  fo,
  po,
  mo,
  ho,
  Y,
});

function loginProbeUrl(value) {
  try {
    const url = new URL(value);
    if (
      url.username ||
      url.password ||
      (url.protocol !== `https:` &&
        !(url.protocol === `http:` && [`localhost`, `127.0.0.1`, `[::1]`].includes(url.hostname)))
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

function loginProbePageUrl(value) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return ``;
  }
}

export function sanitizeLoginEntry(value) {
  if (!value || typeof value !== `object` || Array.isArray(value)) return null;
  const methods = [`form`, `github`, `oauth`, `passkey`, `manual`];
  if (!methods.includes(value.method)) return null;
  function text(field, maxLength) {
    const item = value[field];
    return typeof item === `string` &&
      item.trim() &&
      item.trim().length <= maxLength &&
      !/[\u0000-\u001f\u007f]/.test(item)
      ? item.trim()
      : ``;
  }
  const key = text(`key`, 160),
    label = text(`label`, 120),
    provider = text(`provider`, 80),
    matchText = text(`matchText`, 240);
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(key) || !label) return null;
  const entry = { key, method: value.method, label };
  if (provider) entry.provider = provider;
  if (matchText) entry.matchText = matchText;
  if (typeof value.hrefPath === `string`) {
    const path = value.hrefPath.trim().split(/[?#]/, 1)[0];
    if (
      path.startsWith(`/`) &&
      !path.startsWith(`//`) &&
      path.length <= 1024 &&
      !/[\\\u0000-\u0020\u007f]/.test(path)
    )
      entry.hrefPath = path;
  }
  return entry;
}

function loginProbeEntries(value) {
  const keys = new Set();
  return (Array.isArray(value) ? value : [])
    .slice(0, 64)
    .map(sanitizeLoginEntry)
    .filter((entry) => entry && !keys.has(entry.key) && keys.add(entry.key));
}

function loginProbeResult(siteId, status, methods = [], evidence = [], pageUrl = ``, entries = []) {
  return {
    siteId,
    status,
    methods,
    entries,
    evidence,
    pageUrl: loginProbePageUrl(pageUrl),
    checkedAt: Date.now(),
  };
}

async function loginDiscoveryUrlKey(loginUrl) {
  const digest = await crypto.subtle.digest(`SHA-256`, new TextEncoder().encode(loginUrl));
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, `0`)).join(``);
}

function readSavedLoginDiscovery(site, urlKey) {
  const saved = site.loginDiscovery;
  if (
    !saved ||
    saved.version !== 1 ||
    saved.result?.siteId !== site.id ||
    !/^[a-f0-9]{64}$/.test(saved.urlKey) ||
    !Number.isFinite(saved.result.checkedAt) ||
    saved.result.checkedAt <= 0
  )
    return null;
  if (saved.urlKey !== urlKey)
    return {
      ...loginProbeResult(
        site.id,
        `outdated`,
        [],
        [`本站登录地址已修改，请点击「更新登录方式」重新读取；不会自动打开网页`],
      ),
      checkedAt: saved.result.checkedAt,
      source: `saved`,
      persisted: !0,
    };
  const statuses = [`detected`, `multiple`, `unknown`, `already-logged-in`, `unavailable`];
  if (!statuses.includes(saved.result.status)) return null;
  const entries = loginProbeEntries(saved.result.entries),
    methods = [
      ...new Set([
        ...(Array.isArray(saved.result.methods) ? saved.result.methods : []),
        ...entries.map((entry) => entry.method),
      ]),
    ].filter((method) => [`form`, `github`, `oauth`, `passkey`, `manual`].includes(method)),
    evidence = (Array.isArray(saved.result.evidence) ? saved.result.evidence : [])
      .filter((line) => typeof line === `string`)
      .slice(0, 8)
      .map((line) => line.slice(0, 240)),
    status = methods.length
      ? methods.length > 1 || entries.length > 1
        ? `multiple`
        : `detected`
      : [`detected`, `multiple`].includes(saved.result.status)
        ? `unknown`
        : saved.result.status;
  return {
    ...loginProbeResult(site.id, status, methods, evidence, saved.result.pageUrl, entries),
    checkedAt: saved.result.checkedAt,
    source: `saved`,
    persisted: !0,
    ...(typeof saved.lastUpdateError === `string` && saved.lastUpdateError
      ? { updateError: saved.lastUpdateError.slice(0, 240) }
      : {}),
  };
}

async function saveLoginDiscovery(siteId, loginUrl, urlKey, result) {
  return bgPlatformState.R(async () => {
    const sites = await bgPlatformState.t.get(bgPlatformState.r.sites, []),
      removed = await bgPlatformState.t.get(bgPlatformState.r.removedBuiltinSiteIds, []),
      latest = bgSitesState.Y(siteId, sites);
    if (!latest || removed.includes(siteId))
      return {
        ...loginProbeResult(siteId, `unavailable`, [], [`本站已删除，未保存旧页面结果`]),
        persisted: !1,
      };
    if (loginProbeUrl(latest.loginUrl)?.href !== loginUrl)
      return {
        ...loginProbeResult(
          siteId,
          `outdated`,
          [],
          [`本站登录地址已变更，请点击「更新登录方式」重新读取`],
        ),
        persisted: !1,
      };
    const previous = readSavedLoginDiscovery(latest, urlKey),
      keepPrevious = previous?.methods.length && !result.methods.length,
      updateError = keepPrevious
        ? `更新未成功，继续使用已保存的登录方式：${result.evidence[0] || `本次未识别出可用入口`}`
        : void 0,
      savedResult = keepPrevious ? previous : result,
      loginDiscovery = {
        version: 1,
        urlKey,
        result: {
          siteId,
          status: savedResult.status,
          methods: [...savedResult.methods],
          entries: loginProbeEntries(savedResult.entries),
          evidence: [...savedResult.evidence],
          pageUrl: loginProbePageUrl(savedResult.pageUrl),
          checkedAt: savedResult.checkedAt,
        },
        ...(updateError ? { lastUpdateError: updateError, lastUpdateAttemptAt: Date.now() } : {}),
      },
      index = sites.findIndex((site) => site.id === siteId),
      updatedSites = [...sites];
    if (index >= 0) updatedSites[index] = { ...sites[index], loginDiscovery };
    else updatedSites.push({ ...latest, loginDiscovery });
    await bgPlatformState.t.set(bgPlatformState.r.sites, updatedSites);
    bgPlatformState.$();
    return {
      ...readSavedLoginDiscovery({ ...latest, loginDiscovery }, urlKey),
      source: keepPrevious ? `saved` : `page`,
    };
  });
}

function loginProbeGithubPage(value) {
  try {
    const url = new URL(value);
    return (
      url.protocol === `https:` &&
      url.hostname === `github.com` &&
      !url.port &&
      /^\/(?:login|sessions)(?:\/|$)/i.test(url.pathname)
    );
  } catch {
    return !1;
  }
}

async function loginProbeBounded(operation, deadline) {
  const remaining = deadline - Date.now();
  if (remaining <= 0) throw Error(`登录页识别已超时`);
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(operation),
      new Promise((resolve, reject) => {
        timer = setTimeout(() => reject(Error(`登录页识别已超时`)), remaining);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function runLoginPageProbe(site, loginUrl, deadline) {
  let ownedTabId,
    finished = !1,
    lastMethodsSignature,
    last = loginProbeResult(
      site.id,
      `unknown`,
      [],
      [`登录页尚未显示可识别的登录入口`],
      loginUrl.href,
    );
  async function bounded(operation) {
    return loginProbeBounded(operation, deadline);
  }
  async function closeOwnedTab() {
    if (ownedTabId == null) return;
    const tabId = ownedTabId;
    ownedTabId = void 0;
    const closing = Promise.resolve()
      .then(() => chrome.tabs.remove(tabId))
      .catch(() => {});
    if (Date.now() < deadline) await bounded(() => closing).catch(() => {});
  }
  try {
    const tabs = await bounded(() => chrome.tabs.query({})),
      existing = tabs.find((tab) => {
        const url = loginProbeUrl(tab.url);
        return tab.id != null && url?.href === loginUrl.href;
      });
    let tabId = existing?.id;
    if (tabId == null) {
      const created = await bounded(() =>
        chrome.tabs.create({ url: loginUrl.href, active: !1 }).then((tab) => {
          ownedTabId = tab?.id;
          if (finished) void closeOwnedTab();
          return tab;
        }),
      );
      tabId = created?.id;
    }
    if (tabId == null)
      return loginProbeResult(site.id, `unavailable`, [], [`无法打开本站登录页`], loginUrl.href);
    for (; Date.now() < deadline;) {
      let nextPollMs = 120;
      const tab = await bounded(() => chrome.tabs.get(tabId)),
        observedUrl = tab.url || tab.pendingUrl || ``;
      if (loginProbeGithubPage(observedUrl))
        return loginProbeResult(
          site.id,
          `detected`,
          [`github`],
          [`本站登录页进入了 GitHub 官方登录或授权页面`],
          observedUrl,
          [{ key: `github`, method: `github`, provider: `github`, label: `GitHub` }],
        );
      let observed;
      try {
        observed = new URL(observedUrl);
      } catch {}
      if (
        observed &&
        [`https:`, `http:`].includes(observed.protocol) &&
        observed.origin !== loginUrl.origin
      )
        return loginProbeResult(
          site.id,
          `unknown`,
          [],
          [`本站登录页跳转到了其他站点，尚未确认登录方式`],
          observedUrl,
        );
      if (observed?.origin === loginUrl.origin) {
        try {
          const response = await bounded(() =>
            chrome.tabs.sendMessage(
              tabId,
              {
                type: `READ_LOGIN_OPTIONS`,
                site: {
                  id: site.id,
                  loginUrl: loginUrl.href,
                  selectors: Object.fromEntries(
                    [`username`, `password`, `submit`]
                      .filter(
                        (key) =>
                          typeof site.selectors?.[key] === `string` &&
                          site.selectors[key].length <= 2048,
                      )
                      .map((key) => [key, site.selectors[key]]),
                  ),
                  ...(typeof site.successIndicator === `string` &&
                  site.successIndicator.length <= 2048
                    ? { successIndicator: site.successIndicator }
                    : {}),
                },
              },
              { frameId: 0 },
            ),
          );
          const options = response?.feature?.loginOptions;
          if (response?.ok && options && options.siteId === site.id) {
            const responseUrl = options.pageUrl || observedUrl;
            if (loginProbePageUrl(responseUrl) !== loginProbePageUrl(observedUrl)) {
              lastMethodsSignature = void 0;
              last = loginProbeResult(
                site.id,
                `unknown`,
                [],
                [`页面正在跳转，等待登录入口稳定后重新识别`],
                observedUrl,
              );
            } else {
              const entries = loginProbeEntries(options.entries),
                methods = [
                  ...new Set([
                    ...(Array.isArray(options.methods) ? options.methods : []),
                    ...entries.map((entry) => entry.method),
                  ]),
                ].filter((method) =>
                  [`form`, `github`, `oauth`, `passkey`, `manual`].includes(method),
                ),
                evidence = (Array.isArray(options.evidence) ? options.evidence : [])
                  .filter((line) => typeof line === `string`)
                  .slice(0, 8)
                  .map((line) => line.slice(0, 240));
              if (methods.length) {
                const signature = JSON.stringify([
                  loginProbePageUrl(responseUrl),
                  [...methods].sort(),
                  [...entries].sort((left, right) => left.key.localeCompare(right.key)),
                ]);
                if (signature === lastMethodsSignature)
                  return loginProbeResult(
                    site.id,
                    methods.length > 1 || entries.length > 1 ? `multiple` : `detected`,
                    methods,
                    evidence,
                    responseUrl,
                    entries,
                  );
                lastMethodsSignature = signature;
                nextPollMs = 200;
                last = loginProbeResult(
                  site.id,
                  `unknown`,
                  [],
                  [`登录入口正在加载，等待页面稳定后确认可用方式`],
                  responseUrl,
                );
              } else {
                lastMethodsSignature = void 0;
                if (options.status === `already-logged-in`)
                  return loginProbeResult(
                    site.id,
                    `already-logged-in`,
                    [],
                    evidence.length ? evidence : [`当前页面已经登录，未显示新的登录入口`],
                    responseUrl,
                  );
                if (options.status === `unavailable`)
                  return loginProbeResult(
                    site.id,
                    `unavailable`,
                    [],
                    evidence.length ? evidence : [`当前登录页无法读取`],
                    responseUrl,
                  );
                last = loginProbeResult(
                  site.id,
                  `unknown`,
                  [],
                  evidence.length ? evidence : [`登录页尚未显示可识别的登录入口`],
                  responseUrl,
                );
              }
            }
          } else lastMethodsSignature = void 0;
        } catch (error) {
          lastMethodsSignature = void 0;
          if (Date.now() >= deadline) throw error;
        }
      }
      const remaining = deadline - Date.now();
      if (remaining > 0)
        await new Promise((resolve) => setTimeout(resolve, Math.min(nextPollMs, remaining)));
    }
    return last;
  } catch (error) {
    return loginProbeResult(
      site.id,
      `unavailable`,
      [],
      [
        /超时/.test(error instanceof Error ? error.message : String(error))
          ? `登录页未能在 6 秒内完成识别，请确认页面可正常打开后重试`
          : `登录页已关闭或无法读取，请重新打开后重试`,
      ],
      last.pageUrl || loginUrl.href,
    );
  } finally {
    finished = !0;
    await closeOwnedTab();
  }
}

async function probeSiteLoginPage(siteId, force = !1, savedOnly = !1) {
  const deadline = Date.now() + loginPageProbeTimeout;
  let sites;
  try {
    sites = await loginProbeBounded(
      () => bgPlatformState.t.get(bgPlatformState.r.sites, []),
      deadline,
    );
  } catch {
    return loginProbeResult(siteId, `unavailable`, [], [`本站配置暂时无法读取，请重试`]);
  }
  const removed = await bgPlatformState.t.get(bgPlatformState.r.removedBuiltinSiteIds, []),
    site = removed.includes(siteId) ? null : bgSitesState.Y(siteId, sites),
    loginUrl = loginProbeUrl(site?.loginUrl);
  if (!site || !loginUrl)
    return loginProbeResult(
      siteId,
      `unavailable`,
      [],
      [`站点不存在或登录页地址无效，请先检查本站地址`],
    );
  const urlKey = await loginDiscoveryUrlKey(loginUrl.href),
    saved = readSavedLoginDiscovery(site, urlKey);
  if (!force && saved) return structuredClone(saved);
  if (savedOnly && !force)
    return {
      ...loginProbeResult(
        siteId,
        `not-detected`,
        [],
        [`本站尚未保存登录方式，点击「更新登录方式」读取一次`],
      ),
      source: `none`,
      persisted: !1,
    };
  const key = JSON.stringify([site.id, urlKey]),
    pending = loginPageProbePending.get(key);
  if (pending) return structuredClone(await pending);
  const operation = runLoginPageProbe(site, loginUrl, deadline)
    .then(async (result) => {
      try {
        return await saveLoginDiscovery(siteId, loginUrl.href, urlKey, result);
      } catch {
        return {
          ...result,
          source: `page`,
          persisted: !1,
          updateError: `本次登录方式未能保存，请点击「更新登录方式」重试`,
        };
      }
    })
    .finally(() => {
      loginPageProbePending.delete(key);
    });
  loginPageProbePending.set(key, operation);
  return structuredClone(await operation);
}

export async function handleSitesMessage(e, i) {
  switch (e.type) {
    case `PROBE_LOGIN_PAGE`:
      return bgEntryState.Q(i)
        ? {
            ok: !0,
            feature: {
              loginOptions: await probeSiteLoginPage(
                String(e.siteId ?? ``),
                e.force === !0,
                e.savedOnly === !0,
              ),
            },
          }
        : { ok: !1, error: `仅扩展管理页可以识别本站登录方式` };
    case `PROBE_SITE`:
      return bgEntryState.Q(i)
        ? { ok: !0, feature: { probe: await Jt(e.url) } }
        : { ok: !1, error: `仅扩展管理页可以探测站点` };
  }
}

export async function handleSitesMutation(e) {
  switch (e.action) {
    case `add-site`:
      return (await bgSitesState.store.addSite(e.input), { ok: !0 });
    case `add-sites`: {
      let n = await bgPlatformState.t.get(bgPlatformState.r.sites, []),
        i = new Set([...n, ...bgSitesState.j].map((e) => e.loginUrl.trim()));
      return {
        ok: !0,
        added: await bgSitesState.store.addSites(e.inputs, i, e.preserveDuplicates),
      };
    }
    case `update-site`:
      return (await bgSitesState.store.updateSite(e.siteId, e.patch), { ok: !0 });
    case `move-site`:
      return (await bgSitesState.store.moveSite(e.siteId, e.direction, e.orderedIds), { ok: !0 });
  }
}

export function initializeBackgroundSites(step) {
  switch (step) {
    case 9: {
      bgSitesState.u = {
        NEW_API: `new-api`,
        ONE_API: `one-api`,
        VELOERA: `veloera`,
        ONE_HUB: `one-hub`,
        DONE_HUB: `done-hub`,
        V_API: `v-api`,
        VO_API: `voapi`,
        VO_API_V2: `voapi-v2`,
        SUPER_API: `super-api`,
        RIX_API: `rix-api`,
        NEO_API: `neo-api`,
        SUB2API: `sub2api`,
        ANYROUTER: `anyrouter`,
        UNKNOWN: `unknown`,
      };
      break;
    }
    case 10: {
      bgSitesState.d = {
        NEW_API: `new-api`,
        SUB2API: `sub2api`,
        VO_API_V2: `voapi-v2`,
        UNSUPPORTED: `unsupported`,
      };
      break;
    }
    case 11: {
      bgSitesState.f = {
        pointerMode: `trusted`,
        loginMethod: `github`,
        oauthButtonSelector: `text=GitHub`,
        selectors: {
          username: `#username, input[name="username"]`,
          password: `#password, input[name="password"]`,
          submit: `button[type="submit"]`,
        },
        closeModalSelectors: [
          `button >> text=今日关闭`,
          `button >> text=关闭公告`,
          ...bgCheckinState.o,
        ],
        successIndicator: `div >> text=账户数据, div >> text=Account Data, a[href="/console/token"], a[href="/console/topup"]`,
        identitySource: {
          storageKey: `user`,
          storageType: `localStorage`,
          endpoint: `/api/user/self`,
          pagePath: `/console/personal`,
        },
        checkin: {
          method: `relogin`,
          url: `/console`,
          logoutApiUrl: `/api/user/logout`,
          logoutStorageKeys: [`user`, `token`, `access_token`],
          logoutMenuSelector: `.semi-navigation-footer .semi-avatar, .semi-navigation-footer .semi-dropdown`,
          logoutSelector: `text=退出`,
        },
        adapter: {
          siteType: bgSitesState.u.NEW_API,
          family: bgSitesState.d.NEW_API,
          checkinPath: `/console`,
          checkin: { pathPatterns: [`/console*`], titleWords: [`每日签到`, `daily check-in`] },
          quotaPerUnit: 5e5,
        },
      };
      break;
    }
    case 12: {
      bgSitesState.p = {
        id: `agentrouter`,
        label: `Agent Router`,
        siteType: bgSitesState.u.NEW_API,
        fingerprints: {
          hostnames: [`agentrouter.org`, `ps.air-outer.com`],
          titleWords: [`agent router`, `agentrouter`],
        },
        preset: bgSitesState.f,
      };
      break;
    }
    case 13: {
      bgSitesState.m = {
        id: `kid1412`,
        label: `1412's API`,
        siteType: bgSitesState.u.NEW_API,
        fingerprints: { hostnames: [`napi.kid1412.qzz.io`], titleWords: [`1412's api`, `kid1412`] },
        preset: {
          pointerMode: `trusted`,
          loginMethod: `github`,
          oauthButtonSelector: `text=GitHub`,
          selectors: {
            username: `input[name="username"]`,
            password: `input[name="password"]`,
            submit: `button[type="submit"]`,
          },
          closeModalSelectors: bgCheckinState.o,
          successIndicator: `a[href="/keys"], a[href="/wallet"]`,
          checkin: {
            method: `button`,
            url: `/profile`,
            buttonSelector: `button >> text=立即签到, button >> text=签到`,
            alreadySelector: `button >> text=已签到`,
            successText: [`签到成功`, `今天 +`],
            alreadyText: [`已签到`, `今日已签到`],
          },
          adapter: {
            siteType: bgSitesState.u.NEW_API,
            family: bgSitesState.d.NEW_API,
            checkinPath: `/profile`,
            checkin: { pathPatterns: [`/profile*`], titleWords: [`每日签到`] },
            quotaPerUnit: 5e5,
          },
        },
      };
      break;
    }
    case 14: {
      bgSitesState.h = {
        id: `sharedchat`,
        label: `SharedChat 权益领取`,
        siteType: bgSitesState.u.NEW_API,
        fingerprints: { hostnames: [`new.sharedchat.cc`], titleWords: [`sharedchat`, `chatai`] },
        preset: {
          pointerMode: `trusted`,
          loginMethod: `auto`,
          selectors: {
            username: `input[placeholder*="用户名"], input[placeholder*="邮箱"]`,
            password: `input[type="password"]`,
            submit: `button.submit-btn, button >> text=用户登录`,
          },
          closeModalSelectors: bgCheckinState.o,
          successIndicator: `button.refresh-btn, button.invite-entry-button`,
          checkin: {
            method: `claim`,
            url: `/list/#/vibe-code/dashboard?activeMenu=dashboard&service=codex`,
            claimEntrySelector: `button >> text=领取 Codex 权益`,
            claimInputSelector: `textarea, .modal textarea, [role="dialog"] textarea`,
            claimSubmitSelector: `button >> text=领取`,
            claimMinLength: 10,
            claimUniqueText: !0,
            successText: [`领取成功`, `权益已领取`, `已生效`, `生效中`],
            alreadyText: [`已领取`, `今日已领取`],
          },
          adapter: {
            siteType: bgSitesState.u.NEW_API,
            family: bgSitesState.d.NEW_API,
            checkinPath: `/list/`,
            checkin: { pathPatterns: [`/list*`], titleWords: [`权益`, `benefit`] },
          },
        },
      };
      break;
    }
    case 15: {
      bgSitesState.g = {
        id: `monkeycode`,
        label: `MonkeyCode`,
        siteType: bgSitesState.u.NEW_API,
        fingerprints: { hostnames: [`monkeycode-ai.com`] },
        preset: {
          selectors: {
            username: bgCheckinState.s.join(`, `),
            password: bgCheckinState.c.join(`, `),
            submit: `button[type="submit"]`,
          },
          loginMethod: `auto`,
          closeModalSelectors: bgCheckinState.o,
          checkin: { method: `auto`, url: `/console/tasks` },
          adapter: {
            siteType: bgSitesState.u.NEW_API,
            family: bgSitesState.d.NEW_API,
            checkinPath: `/console/tasks`,
            checkin: { pathPatterns: [`/console/tasks*`], titleWords: [`签到`, `任务`, `task`] },
            quotaPerUnit: 5e5,
          },
        },
      };
      break;
    }
    case 16: {
      bgSitesState._ = {
        id: `futurehub`,
        label: `Future Hub`,
        siteType: bgSitesState.u.NEW_API,
        fingerprints: { hostnames: [`api.futureppo.top`] },
        preset: {
          selectors: {
            username: bgCheckinState.s.join(`, `),
            password: bgCheckinState.c.join(`, `),
            submit: `button[type="submit"], button.semi-button-primary`,
          },
          loginMethod: `auto`,
          closeModalSelectors: bgCheckinState.o,
          checkin: {
            method: `button`,
            url: `/console/personal`,
            buttonSelector: `button >> text=立即签到`,
            alreadySelector: `button >> text=今日已签到`,
            alreadyText: [`今日已签到`],
          },
          adapter: {
            siteType: bgSitesState.u.NEW_API,
            family: bgSitesState.d.NEW_API,
            checkinPath: `/console/personal`,
            checkin: { pathPatterns: [`/console/personal*`], titleWords: [`每日签到`] },
            quotaPerUnit: 5e5,
          },
        },
      };
      break;
    }
    case 17: {
      bgSitesState.v = {
        id: `anyrouter`,
        label: `AnyRouter（登录即签到）`,
        siteType: bgSitesState.u.ANYROUTER,
        fingerprints: { hostnames: [`anyrouter.top`], titleWords: [`any router`, `anyrouter`] },
        preset: {
          selectors: {
            username: bgCheckinState.s.join(`, `),
            password: bgCheckinState.c.join(`, `),
            submit: `button[type="submit"], button.semi-button-primary`,
          },
          loginMethod: `auto`,
          closeModalSelectors: bgCheckinState.o,
          checkin: { method: `none` },
          adapter: {
            siteType: bgSitesState.u.ANYROUTER,
            family: bgSitesState.d.NEW_API,
            checkinPath: ``,
            quotaPerUnit: 5e5,
          },
        },
      };
      break;
    }
    case 18: {
      bgSitesState.y = {
        selectors: {
          username: `#email`,
          password: `#password`,
          submit: `button[type="submit"], .btn.btn-primary`,
        },
        loginMethod: `form`,
        tokenConfig: {
          storageKey: `auth_token`,
          headerName: `Authorization`,
          headerPrefix: `Bearer `,
          identityEndpoint: `/api/v1/auth/me`,
        },
        closeModalSelectors: bgCheckinState.o,
        checkin: {
          method: `button`,
          url: `/check-in`,
          buttonSelector: `button >> text=立即签到, button >> text=Check in`,
          alreadySelector: `button >> text=今日已签到, button >> text=Already checked in today`,
          successText: [`签到成功`, `Checked in — got`],
          alreadyText: [`今日已签到`, `今天已经签过了`, `Already checked in today`],
        },
        adapter: {
          siteType: bgSitesState.u.SUB2API,
          family: bgSitesState.d.SUB2API,
          checkinPath: `/check-in`,
          checkin: { pathPatterns: [`/check-in*`], titleWords: [`每日签到`, `daily check-in`] },
          quotaPerUnit: 1,
        },
      };
      break;
    }
    case 19: {
      bgSitesState.b = {
        id: `linxi`,
        label: `林夕`,
        siteType: bgSitesState.u.SUB2API,
        fingerprints: { hostnames: [`k40.shengqainbang.cn`], titleWords: [`林夕`] },
        preset: bgSitesState.y,
      };
      break;
    }
    case 20: {
      bgSitesState.x = {
        id: `baibei`,
        label: `百倍`,
        siteType: bgSitesState.u.SUB2API,
        fingerprints: { hostnames: [`sub.100xlabs.space`] },
        preset: bgSitesState.y,
      };
      break;
    }
    case 21: {
      bgSitesState.S = {
        selectors: {
          username: `input[type="email"], #email, input[name="email"]`,
          password: `#password, input[type="password"]`,
          submit: `button[type="submit"]`,
        },
        loginMethod: `form`,
        tokenConfig: {
          storageKey: `auth_token`,
          headerName: `Authorization`,
          headerPrefix: `Bearer `,
          identityEndpoint: `/api/v1/auth/me`,
        },
        closeModalSelectors: bgCheckinState.o,
        checkin: {
          method: `auto`,
          url: `/checkin`,
          buttonSelector: `button >> text=立即签到`,
          alreadySelector: `button >> text=今日已签到, button >> text=今天已签到, button >> text=已签到`,
          claimConfirmSelector: `button >> text=领取奖励`,
          successText: [`签到成功`, `领取成功`, `领取完成`],
          alreadyText: [`今日已签到`, `今天已签到`, `已签到`],
        },
        adapter: {
          siteType: bgSitesState.u.SUB2API,
          family: bgSitesState.d.SUB2API,
          checkinPath: `/checkin`,
          checkin: { pathPatterns: [`/checkin*`], titleWords: [`每日签到`, `daily check-in`] },
          quotaPerUnit: 1,
        },
      };
      break;
    }
    case 22: {
      bgSitesState.C = {
        id: `denxio`,
        label: `登仙公益站`,
        siteType: bgSitesState.u.SUB2API,
        fingerprints: {
          hostnames: [`api.denxio.top`],
          titleWords: [`登仙公益站`, `登仙`, `denxio`],
        },
        preset: bgSitesState.S,
      };
      break;
    }
    case 23: {
      bgSitesState.w = {
        pointerMode: `trusted`,
        loginMethod: `form`,
        selectors: {
          username: [
            `input[name="username"]`,
            `input[name="email"]`,
            `input[autocomplete="username"]`,
            `input[autocomplete="email"]`,
            `input[type="email"]`,
            `input[type="text"]`,
          ].join(`, `),
          password: `input[name="password"], input[autocomplete="current-password"], input[type="password"]`,
          submit: `button[type="submit"], input[type="submit"], button >> text=登录`,
        },
        closeModalSelectors: bgCheckinState.o,
        checkin: {
          method: `button`,
          url: `/daily_checkin`,
          buttonSelector: [
            `.daily-checkin-page-action button:not([disabled])`,
            `.daily-checkin-action button:not([disabled])`,
            `button >> text=立即签到`,
            `button >> text=签到`,
            `input[type="submit"][value*="签到"]`,
            `input[type="button"][value*="签到"]`,
          ].join(`, `),
          alreadySelector: [
            `.daily-checkin-page-action .daily-checkin-done`,
            `.daily-checkin-done`,
            `button >> text=今天已签到`,
            `button >> text=今日已签到`,
            `button >> text=已完成`,
            `input[value="今天已签到"]`,
            `input[value="今日已签到"]`,
            `input[value="已完成"]`,
          ].join(`, `),
          successText: [`签到成功`, `签到完成`, `今天已签到`, `今日已签到`, `已完成`],
          alreadyText: [`今天已签到`, `今日已签到`, `已完成`],
        },
        adapter: {
          siteType: bgSitesState.u.UNKNOWN,
          family: bgSitesState.d.UNSUPPORTED,
          checkinPath: `/daily_checkin`,
          checkin: { pathPatterns: [`/daily_checkin*`], titleWords: [`每日签到`] },
        },
      };
      break;
    }
    case 24: {
      bgSitesState.T = {
        id: `linux-sb`,
        label: `Linux.SB`,
        siteType: bgSitesState.u.UNKNOWN,
        fingerprints: { hostnames: [`linux.sb`] },
        preset: bgSitesState.w,
      };
      break;
    }
    case 25: {
      bgSitesState.E = {
        id: `new-api-next`,
        label: `已识别 new-api 中转站（新版界面）`,
        siteType: bgSitesState.u.NEW_API,
        fingerprints: {
          hostnames: [
            `gy.leyanshi.me`,
            `kapibala.asia`,
            `nova.vcrauo.com`,
            `api.gemai.cc`,
            `seekai.cc`,
            `htai91.com`,
          ],
        },
        preset: {
          pointerMode: `trusted`,
          loginMethod: `auto`,
          selectors: {
            username: `input[name="username"]`,
            password: `input[name="password"]`,
            submit: `button[type="submit"], button >> text=登录, button >> text=Sign in`,
          },
          closeModalSelectors: bgCheckinState.o,
          successIndicator: `a[href="/keys"], a[href="/wallet"]`,
          checkin: {
            method: `button`,
            url: `/profile`,
            buttonSelector: `button >> text=立即签到, button >> text=签到`,
            alreadySelector: `button >> text=已签到`,
            successText: [`签到成功`, `今天 +`],
            alreadyText: [`已签到`, `今日已签到`],
          },
          adapter: {
            siteType: bgSitesState.u.NEW_API,
            family: bgSitesState.d.NEW_API,
            checkinPath: `/profile`,
            checkin: { pathPatterns: [`/profile*`], titleWords: [`每日签到`] },
            quotaPerUnit: 5e5,
          },
        },
      };
      break;
    }
    case 26: {
      bgSitesState.D = bgSitesState.E.preset;
      break;
    }
    case 27: {
      bgSitesState.O = {
        ...bgSitesState.E.preset,
        selectors: { ...bgSitesState.E.preset.selectors },
        closeModalSelectors: [...bgSitesState.E.preset.closeModalSelectors],
        oauthButtonSelector: `text=GitHub`,
        checkin: {
          ...bgSitesState.E.preset.checkin,
          entry: {
            readySelector: [
              `button >> text=立即签到`,
              `button >> text=已签到`,
              `button >> text=Check in now`,
              `button >> text=Checked in`,
            ].join(`, `),
            readyTimeoutMs: 15e3,
            fallbackToUrl: !1,
            steps: [
              {
                selector: [
                  `button[aria-haspopup="menu"][data-testid*="avatar" i]`,
                  `header button[aria-haspopup="menu"]:has([class*="avatar" i])`,
                  `header button[aria-haspopup="menu"]:has(img)`,
                  `button[aria-haspopup="menu"]:has([class*="avatar" i])`,
                  `[role="button"][aria-haspopup="menu"]:has([class*="avatar" i])`,
                  `button[aria-haspopup="menu"]:has(img)`,
                  `button[aria-label*="account" i][aria-haspopup="menu"]`,
                  `button[aria-label*="profile" i][aria-haspopup="menu"]`,
                  `button[aria-label*="用户"][aria-haspopup="menu"]`,
                  `button[aria-label*="账号"][aria-haspopup="menu"]`,
                  `button[aria-haspopup="menu"]:has([data-slot="avatar"])`,
                  `button[aria-haspopup="menu"]:has([class*="rounded-full" i])`,
                  `button[aria-haspopup="menu"]:has([class*="user-avatar" i])`,
                  `header button[data-slot="dropdown-menu-trigger"]:has(img)`,
                  `header button[data-slot="dropdown-menu-trigger"]:has([data-slot="avatar"])`,
                  `header button[data-slot="dropdown-menu-trigger"]:has([class*="avatar" i])`,
                  `header button[data-slot="dropdown-menu-trigger"]:has([class*="rounded-full" i])`,
                  `header [data-radix-dropdown-menu-trigger]:has(img)`,
                  `header [data-radix-dropdown-menu-trigger]:has([data-slot="avatar"])`,
                  `header [data-radix-dropdown-menu-trigger]:has([class*="avatar" i])`,
                  `header [data-radix-dropdown-menu-trigger]:has([class*="rounded-full" i])`,
                ].join(`, `),
                waitFor: [
                  `[role="menuitem"] >> text=个人资料`,
                  `[role="menuitem"] >> text=个人中心`,
                  `[role="menuitem"] >> text=Profile`,
                  `[role="menuitem"] >> text=My profile`,
                  `a[href="/profile"]`,
                  `a[href^="/profile?"]`,
                  `a >> text=个人资料`,
                  `a >> text=个人中心`,
                  `a >> text=Profile`,
                ].join(`, `),
                timeoutMs: 12e3,
              },
              {
                selector: [
                  `a[href="/profile"]`,
                  `a[href^="/profile?"]`,
                  `[role="menuitem"] >> text=个人资料`,
                  `[role="menuitem"] >> text=个人中心`,
                  `[role="menuitem"] >> text=Profile`,
                  `[role="menuitem"] >> text=My profile`,
                  `a >> text=个人资料`,
                  `a >> text=个人中心`,
                  `a >> text=Profile`,
                  `button >> text=个人资料`,
                  `button >> text=个人中心`,
                  `button >> text=Profile`,
                ].join(`, `),
                waitFor: [
                  `button >> text=立即签到`,
                  `button >> text=已签到`,
                  `button >> text=Check in now`,
                  `button >> text=Checked in`,
                ].join(`, `),
                timeoutMs: 15e3,
                mayNavigate: !0,
              },
            ],
          },
        },
        adapter: {
          ...bgSitesState.E.preset.adapter,
          checkin: {
            ...bgSitesState.E.preset.adapter?.checkin,
            pathPatterns: [...(bgSitesState.E.preset.adapter?.checkin?.pathPatterns ?? [])],
            titleWords: [...(bgSitesState.E.preset.adapter?.checkin?.titleWords ?? [])],
          },
        },
      };
      break;
    }
    case 28: {
      bgSitesState.k = {
        id: `tabiai`,
        label: `TaBiAI`,
        siteType: bgSitesState.u.NEW_API,
        fingerprints: { hostnames: [`tabitoken.com`], titleWords: [`tabiai`, `tabitoken`] },
        preset: bgSitesState.O,
      };
      break;
    }
    case 29: {
      bgSitesState.A = {
        pointerMode: `trusted`,
        loginMethod: `auto`,
        selectors: {
          username: `input[name="username"]`,
          password: `input[name="password"]`,
          submit: `button[type="submit"], button >> text=登录, button >> text=Sign in`,
        },
        successIndicator: `a[href="/keys"], a[href="/wallet"], text=浮梦引光, a[href="/lottery"]`,
        closeModalSelectors: bgCheckinState.o,
        checkin: { method: `workflow`, workflow: { steps: [{ type: `leilei-daily` }] } },
        adapter: {
          siteType: bgSitesState.u.NEW_API,
          family: bgSitesState.d.NEW_API,
          checkinPath: `/lottery`,
          checkin: {
            pathPatterns: [`/lottery*`, `/profile*`],
            titleWords: [`浮梦引光`, `抽奖`, `每日签到`],
          },
          quotaPerUnit: 5e5,
        },
        authBootstrap: { endpoint: `/api/user/auth/refresh` },
      };
      break;
    }
    case 30: {
      bgSitesState.ee = {
        id: `leilei`,
        label: `一梦五千年`,
        siteType: bgSitesState.u.NEW_API,
        fingerprints: { hostnames: [`fapi.leileihog.top`] },
        preset: bgSitesState.A,
      };
      break;
    }
    case 31: {
      bgSitesState.te = {
        selectors: {
          username: bgCheckinState.s.join(`, `),
          password: bgCheckinState.c.join(`, `),
          submit: `button[type="submit"], button.semi-button-primary`,
        },
        pointerMode: `trusted`,
        loginMethod: `auto`,
        closeModalSelectors: bgCheckinState.o,
        checkin: {
          method: `button`,
          url: `/console/personal`,
          buttonSelector: `button >> text=立即签到`,
          alreadySelector: `button >> text=今日已签到, button >> text=已签到`,
          successText: [`签到成功`, `今日已签到`],
          alreadyText: [`今日已签到`, `已签到`],
        },
        adapter: {
          siteType: bgSitesState.u.NEW_API,
          family: bgSitesState.d.NEW_API,
          checkinPath: `/console/personal`,
          checkin: { pathPatterns: [`/console/personal*`], titleWords: [`每日签到`, `试试手气`] },
          quotaPerUnit: 5e5,
        },
      };
      break;
    }
    case 32: {
      bgSitesState.ne = {
        id: `vsllm`,
        label: `VSLLM`,
        siteType: bgSitesState.u.NEW_API,
        fingerprints: { hostnames: [`vsllm.com`] },
        preset: bgSitesState.te,
      };
      break;
    }
    case 33: {
      bgSitesState.re = {
        pointerMode: `trusted`,
        loginMethod: `form`,
        selectors: {
          username: `input[type="email"], input[name="email"], input[id="email"], input[autocomplete="email"], input[autocomplete="username"]`,
          password: `input[type="password"], input[name="password"], input[autocomplete="current-password"], #password`,
          submit: `button[type="submit"], input[type="submit"], button >> text=登录`,
        },
        preLoginClickSelector: [
          `header a[href="/login"]`,
          `nav a[href="/login"]`,
          `a[href="/login"]`,
          `header button >> text=登录`,
          `nav button >> text=登录`,
          `header a >> text=登录`,
          `nav a >> text=登录`,
        ].join(`, `),
        closeModalSelectors: bgCheckinState.o,
        checkin: {
          method: `button`,
          url: `/`,
          apiUrl: `/api/user/clock_in`,
          buttonSelector: `button >> text=每日签到, a >> text=每日签到`,
          alreadySelector: `button >> text=今日已签到, button >> text=今天已签到, button >> text=已签到`,
          successText: [`签到成功`, `恭喜获取`, `恭喜获得`],
          alreadyText: [`今日已签到`, `今天已签到`, `已经签到`, `已签到`],
        },
        adapter: {
          siteType: bgSitesState.u.UNKNOWN,
          family: bgSitesState.d.UNSUPPORTED,
          checkinPath: `/`,
          checkin: { pathPatterns: [`/`], titleWords: [`每日签到`] },
          quotaPerUnit: 1,
        },
      };
      break;
    }
    case 34: {
      bgSitesState.ie = [
        bgSitesState.p,
        bgSitesState.m,
        bgSitesState.h,
        bgSitesState.g,
        bgSitesState._,
        bgSitesState.v,
        bgSitesState.b,
        bgSitesState.x,
        bgSitesState.C,
        bgSitesState.T,
        bgSitesState.k,
        bgSitesState.ee,
        bgSitesState.E,
        bgSitesState.ne,
        {
          id: `hvoy`,
          label: `Hvoy AI`,
          siteType: bgSitesState.u.UNKNOWN,
          fingerprints: { hostnames: [`www.hvoy.ai`] },
          preset: bgSitesState.re,
        },
        {
          id: `sub2api`,
          label: `Sub2API 系`,
          siteType: bgSitesState.u.SUB2API,
          fingerprints: {
            titleWords: [`sub2api`],
            selectors: [`#email + *, input#email`],
            endpoint: {
              path: `/api/v1/auth/me`,
              match: (e) => bgPlatformState.l(e) && typeof e.code == `string`,
            },
          },
          preset: {
            selectors: {
              username: `#email`,
              password: `#password`,
              submit: `button[type="submit"], .btn.btn-primary`,
            },
            loginMethod: `token`,
            tokenConfig: {
              storageKey: `auth_token`,
              headerName: `Authorization`,
              headerPrefix: `Bearer `,
              identityEndpoint: `/api/v1/auth/me`,
            },
            closeModalSelectors: bgCheckinState.o,
            checkin: { method: `auto`, url: `/check-in` },
            adapter: {
              siteType: bgSitesState.u.SUB2API,
              family: bgSitesState.d.SUB2API,
              checkinPath: `/check-in`,
              checkin: { pathPatterns: [`/check-in*`], titleWords: [`每日签到`, `daily check-in`] },
              quotaPerUnit: 1,
            },
          },
        },
        {
          id: `new-api`,
          label: `new-api / one-api 系`,
          siteType: bgSitesState.u.NEW_API,
          fingerprints: {
            titleWords: [`new-api`, `one-api`, `veloera`, `voapi`],
            selectors: [`.semi-modal-close`, `.semi-button`, `#username`],
            endpoint: {
              path: `/api/user/self`,
              match: (e) => bgPlatformState.l(e) && e.success === !1,
            },
          },
          preset: {
            selectors: {
              username: `#username`,
              password: `#password`,
              submit: `button[type="submit"]`,
            },
            loginMethod: `auto`,
            closeModalSelectors: bgCheckinState.o,
            successIndicator: `a[href="/console/token"], a[href="/console/topup"]`,
            checkin: { method: `auto`, url: `/console/personal`, apiUrl: `/api/user/checkin` },
            adapter: {
              siteType: bgSitesState.u.NEW_API,
              family: bgSitesState.d.NEW_API,
              checkinPath: `/console/personal`,
              checkin: {
                pathPatterns: [`/console/personal*`],
                titleWords: [`每日签到`, `daily check-in`],
              },
              quotaPerUnit: 5e5,
            },
          },
        },
      ];
      break;
    }
    case 35: {
      bgSitesState.j = [];
      break;
    }
    case 36: {
      bgSitesState.le = new Set([`leilei-daily`]);
      break;
    }
    case 56: {
      bgSitesState.zt = 6e3;
      break;
    }
    case 57: {
      bgSitesState.Bt = {
        siteType: bgSitesState.u.UNKNOWN,
        evidence: `未能识别站点系统，请手动确认选择器`,
      };
      break;
    }
    case 75: {
      bgSitesState.rr = {
        'New-API-User': bgSitesState.u.NEW_API,
        'Veloera-User': bgSitesState.u.VELOERA,
        'X-Api-User': bgSitesState.u.V_API,
        'voapi-user': bgSitesState.u.VO_API,
        'User-id': bgSitesState.u.SUPER_API,
        'Rix-Api-User': bgSitesState.u.RIX_API,
        'neo-api-user': bgSitesState.u.NEO_API,
      };
      break;
    }
    case 76: {
      bgSitesState.ir = Object.keys(bgSitesState.rr);
      break;
    }
    case 77: {
      bgSitesState.ar = bgSitesState.ir;
      break;
    }
    case 78: {
      bgSitesState.sr = {
        [bgSitesState.d.NEW_API]: { checkinPath: `/console/personal` },
        [bgSitesState.d.SUB2API]: { checkinPath: `/check-in` },
        [bgSitesState.d.VO_API_V2]: {},
        [bgSitesState.d.UNSUPPORTED]: {},
      };
      break;
    }
    case 79: {
      bgSitesState.cr = new Set([
        bgSitesState.u.NEW_API,
        bgSitesState.u.ONE_API,
        bgSitesState.u.VELOERA,
        bgSitesState.u.ONE_HUB,
        bgSitesState.u.DONE_HUB,
        bgSitesState.u.V_API,
        bgSitesState.u.VO_API,
        bgSitesState.u.SUPER_API,
        bgSitesState.u.RIX_API,
        bgSitesState.u.NEO_API,
        bgSitesState.u.ANYROUTER,
      ]);
      break;
    }
    case 119: {
      bgSitesState.va = `builtin-chatai-codex`;
      break;
    }
    case 120: {
      bgSitesState.ja = `www.hvoy.ai`;
      break;
    }
    case 121: {
      bgSitesState.La = `fapi.leileihog.top`;
      break;
    }
    case 122: {
      bgSitesState.Ga = new Set(
        (bgSitesState.E.fingerprints.hostnames ?? []).map((e) => e.toLowerCase()),
      );
      break;
    }
    case 123: {
      bgSitesState.io = `button.refresh-btn, button.invite-entry-button, button.el-button--primary.el-button--large`;
      break;
    }
    case 124: {
      bgSitesState.ao = `button.refresh-btn, button.invite-entry-button`;
      break;
    }
    case 126: {
      Object.assign(bgSitesState.store, {
        async moveSite(e, n, i) {
          return bgPlatformState.R(async () => {
            let a = await bgPlatformState.t.get(bgPlatformState.r.sites, []),
              o = bgSitesState.j.filter((e) => !a.some((t) => t.id === e.id)),
              s = [...a, ...o],
              c;
            if (i?.length) {
              let e = new Map();
              for (let [t, n] of i.entries()) e.has(n) || e.set(n, t);
              c = s
                .map((t, n) => ({ site: t, key: e.get(t.id) ?? i.length + n }))
                .sort((e, t) => e.key - t.key)
                .map(({ site: e }) => e);
            } else {
              c = s
                .map((e, t) => ({ ...e, sortOrder: e.sortOrder ?? t }))
                .sort((e, t) => e.sortOrder - t.sortOrder || e.name.localeCompare(t.name));
              let t = c.findIndex((t) => t.id === e),
                r = n === `up` ? t - 1 : t + 1;
              if (t < 0 || r < 0 || r >= c.length) return;
              [c[t], c[r]] = [c[r], c[t]];
            }
            await bgPlatformState.t.set(
              bgPlatformState.r.sites,
              c.map((e, t) => ({ ...e, sortOrder: t })),
            );
          });
        },
      });
      break;
    }
    case 127: {
      Object.assign(bgSitesState.store, {
        addSite(e) {
          return bgPlatformState.R(async () => {
            bgCheckinState.Dt(e);
            let [n, i] = await Promise.all([
              bgPlatformState.t.get(bgPlatformState.r.sites, []),
              bgPlatformState.t.get(bgPlatformState.r.proxies, []),
            ]);
            (bgProxiesState.vo(e.proxyId, bgProxiesState.go(i)),
              await bgPlatformState.t.set(
                bgPlatformState.r.sites,
                n.concat({ ...e, id: bgPlatformState.Ti(`site`) }),
              ));
          });
        },
      });
      break;
    }
    case 128: {
      Object.assign(bgSitesState.store, {
        addSites(e, n, i = !1) {
          return bgPlatformState.R(async () => {
            e.forEach(bgCheckinState.Dt);
            let [a, o] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, []),
              ]),
              s = bgProxiesState.go(o),
              c = new Set(n);
            a.forEach((e) => c.add(e.loginUrl.trim()));
            let l = [];
            for (let t of e) {
              let e = t.loginUrl.trim();
              !e ||
                (!i && c.has(e)) ||
                (t.proxyId && !s.has(t.proxyId)) ||
                (c.add(e), l.push({ ...t, id: bgPlatformState.Ti(`site`) }));
            }
            return (
              l.length && (await bgPlatformState.t.set(bgPlatformState.r.sites, a.concat(l))),
              l.length
            );
          });
        },
      });
      break;
    }
    case 129: {
      Object.assign(bgSitesState.store, {
        updateSite(e, n) {
          return bgPlatformState.R(async () => {
            let [i, a] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, []),
              ]),
              o = bgSitesState.j.find((t) => t.id === e),
              s = i.find((t) => t.id === e) ?? o;
            `proxyId` in n &&
              n.proxyId !== s?.proxyId &&
              bgProxiesState.vo(n.proxyId, bgProxiesState.go(a));
            let c = !1,
              l = i.map((t) => {
                if (t.id !== e) return t;
                c = !0;
                let r = { ...t, ...n, ...(o ? { builtin: !0 } : {}) };
                return (bgCheckinState.Dt(r), r);
              });
            if (!c && o) {
              let e = { ...o, ...n, builtin: !0 };
              (bgCheckinState.Dt(e), l.push(e));
            }
            await bgPlatformState.t.set(bgPlatformState.r.sites, l);
          });
        },
      });
      break;
    }
  }
}

export const siteService = Object.freeze({
  list: async () => {
    const { userSites, removedBuiltinSiteIds } = await bgEntryState.store.load();
    const removed = new Set(removedBuiltinSiteIds);
    const ids = new Set([
      ...userSites.map((site) => site.id),
      ...bgSitesState.j.filter((site) => !removed.has(site.id)).map((site) => site.id),
    ]);
    return [...ids].map((id) => Y(id, userSites)).filter(Boolean);
  },
  getConfig: (...args) => Y(...args),
  add: (...args) => bgSitesState.store.addSite(...args),
  addMany: (...args) => bgSitesState.store.addSites(...args),
  update: (...args) => bgSitesState.store.updateSite(...args),
  reorder: (...args) => bgSitesState.store.moveSite(...args),
  remove: (siteId) =>
    bgEntryState.nh({
      action: 'delete-entities',
      siteIds: [siteId],
      accountIds: [],
    }),
  removeMany: (siteIds) =>
    bgEntryState.nh({
      action: 'delete-entities',
      siteIds: [...siteIds],
      accountIds: [],
    }),
  handleMessage: handleSitesMessage,
  handleMutation: handleSitesMutation,
});
