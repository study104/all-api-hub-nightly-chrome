/** src/modules/sites/view.js: 功能模块实现，保留发布版本的符号以便逐步恢复命名。 */
import { createUiModuleRuntime, createUiScope, initializeUiScope } from '../../shared/ui-scope.js';
import { readIdentitySource } from '../../shared/account-identity.js';

// 站点配置、书签导入、适配校验与站点视图 — sharedUi published scope.

export const sharedUiRuntime = createUiModuleRuntime({
  bindingNames: ['td', 'nd', 'Ed', 'Dd'],

  register(scope) {
    scope.Ed = function Ed(e) {
      var t,
        n,
        r = ``;
      if (typeof e == `string` || typeof e == `number`) r += e;
      else if (typeof e == `object`) {
        if (Array.isArray(e)) {
          var i = e.length;
          for (t = 0; t < i; t++) e[t] && (n = (0, scope.Ed)(e[t])) && (r && (r += ` `), (r += n));
        } else for (n in e) e[n] && (r && (r += ` `), (r += n));
      }
      return r;
    };
    scope.Dd = function Dd() {
      for (var e, t, n = 0, r = ``, i = arguments.length; n < i; n++)
        (e = arguments[n]) && (t = (0, scope.Ed)(e)) && (r && (r += ` `), (r += t));
      return r;
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.td = {
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
      case 1: {
        scope.nd = {
          NEW_API: `new-api`,
          SUB2API: `sub2api`,
          VO_API_V2: `voapi-v2`,
          UNSUPPORTED: `unsupported`,
        };
        break;
      }
    }
  },
  storeProperties: {},
});

// 站点配置、书签导入、适配校验与站点视图 — app published scope.
export let SiteCard,
  SiteEditor,
  BookmarkImportPanel,
  parseChromeBookmarkJson,
  parseBookmarkHtml,
  builtinSites;
export const appRuntime = createUiModuleRuntime({
  bindingNames: [
    'Rt',
    'zt',
    'Bt',
    'Vt',
    'Ht',
    'Ut',
    'Wt',
    'Gt',
    'Kt',
    'qt',
    'Jt',
    'Yt',
    'Xt',
    'Zt',
    'Qt',
    '$t',
    'en',
    'tn',
    'J',
    'nn',
    'rn',
    'an',
    'on',
    'sn',
    'cn',
    'ln',
    'un',
    'dn',
    'fn',
    'pn',
    'mn',
    'hn',
    'gn',
    '_n',
    'vn',
    'yn',
    'bn',
    'xn',
    'Sn',
    'Zn',
    'Qn',
    '$n',
    'er',
    'tr',
    'nr',
    'rr',
    'ir',
    'ar',
    'or',
    'Vr',
    'Hr',
    'Ur',
    'Wr',
    'Gr',
    'Kr',
    'qr',
    'Y',
    'Jr',
    'Yr',
    'Xr',
    'Zr',
    'Qr',
    '$r',
    'ei',
    'ti',
    'ni',
    'ri',
    'ii',
    'ai',
    'oi',
    'si',
    'ci',
    'li',
    'ui',
    'di',
    'fi',
    'pi',
    'mi',
    'hi',
    'gi',
    '_i',
    'vi',
    'yi',
    'bi',
    'xi',
    'Si',
    'Ci',
    'wi',
    'Ti',
    'Ei',
    'Di',
    'Oi',
    'ki',
    'Ai',
    'ji',
    'Mi',
    'to',
    'no',
    'ro',
    'io',
    'ao',
    'oo',
    'so',
    'co',
    'lo',
    '$',
    'fo',
    'po',
    'mo',
    'ho',
    'go',
    '_o',
    'vo',
    'yo',
    'bo',
    'xo',
    'So',
    'Co',
    'wo',
    'To',
    'Eo',
    'Do',
    'Oo',
    'Po',
    'Fo',
    'Io',
    'Lo',
    'Ro',
    'zo',
    'Bo',
    'Vo',
    'Bl',
    'Vl',
    'Hl',
    'Ul',
    'Wl',
    'Gl',
    'Kl',
    'ql',
    'Jl',
    'Yl',
  ],
  publish(name, value) {
    switch (name) {
      case 'ro':
        SiteCard = value;
        break;
      case 'Vo':
        SiteEditor = value;
        break;
      case 'Oo':
        BookmarkImportPanel = value;
        break;
      case 'ho':
        parseChromeBookmarkJson = value;
        break;
      case 'vo':
        parseBookmarkHtml = value;
        break;
      case 'pn':
        builtinSites = value;
        break;
    }
  },
  register(scope) {
    scope.Vt = function Vt(e) {
      return typeof e == `object` && !!e && !Array.isArray(e);
    };
    scope.fn = function fn(e, t, n, r) {
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
    };
    scope.mn = function mn(e) {
      return e.checkin?.method === `workflow`;
    };
    scope.hn = function hn(e) {
      return e.checkin?.method === `none` && e.checkin.learnedLoginAsCheckin === !0;
    };
    scope.gn = function gn(e) {
      return (0, scope.mn)(e) || (0, scope.hn)(e);
    };
    scope._n = function _n(e, t = (0, scope.vn)(e)) {
      try {
        let n = new URL(e);
        return (
          t?.id === `hvoy`
            ? ((n.pathname = `/`), (n.search = ``), (n.hash = ``))
            : (t?.id === `vsllm` ||
                t?.id === `monkeycode` ||
                t?.id === `anyrouter` ||
                t?.id === `denxio` ||
                t?.id === `agentrouter`) &&
              ((n.pathname = `/login`), (n.search = ``), (n.hash = ``)),
          (t?.id === `new-api-next` || t?.id === `tabiai` || t?.id === `leilei`) &&
            ((n.pathname = `/sign-in`), (n.search = ``), (n.hash = ``)),
          t?.id === `baibei` && ((n.pathname = `/login`), (n.search = ``), (n.hash = ``)),
          t?.id === `linxi` && ((n.pathname = `/login`), (n.search = ``), (n.hash = ``)),
          t?.id === `linux-sb` && ((n.pathname = `/login`), (n.search = ``), (n.hash = ``)),
          n.href
        );
      } catch {
        return e;
      }
    };
    scope.vn = function vn(e) {
      let t = ``;
      try {
        t = new URL(e).hostname.toLowerCase();
      } catch {}
      if (t) {
        for (let e of scope.dn)
          if ((e.fingerprints.hostnames ?? []).some((e) => e.toLowerCase() === t)) return e;
      }
      let n = e.toLowerCase();
      for (let e of scope.dn)
        for (let t of e.fingerprints.titleWords ?? []) if (n.includes(t.toLowerCase())) return e;
      return null;
    };
    scope.yn = function yn(e, t) {
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
    };
    scope.bn = function bn(e, t) {
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
    };
    scope.xn = function xn(e, t) {
      if (!t) return { ...e, builtin: !0 };
      let n = (0, scope.yn)(e, t),
        r = (0, scope.bn)(e, t),
        i = n || r,
        a = !!t.checkin && (0, scope.hn)(t);
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
    };
    scope.Sn = function Sn() {
      return {
        name: ``,
        loginUrl: ``,
        loginMethod: `form`,
        selectors: {
          username: scope.zt.join(`, `),
          password: scope.Bt.join(`, `),
          submit: `button[type="submit"]`,
        },
        closeModalSelectors: [...scope.Rt],
        checkin: { method: `auto` },
      };
    };
    scope.Zn = function Zn(e) {
      try {
        let t = new URL(e.trim());
        return (0, scope.$n)(t) ? t.href : null;
      } catch {
        return null;
      }
    };
    scope.Qn = function Qn(e) {
      return (0, scope.Zn)(e) !== null;
    };
    scope.$n = function $n(e) {
      let t = e.hostname === `localhost` || e.hostname === `127.0.0.1` || e.hostname === `[::1]`;
      return e.protocol === `https:` || (e.protocol === `http:` && t);
    };
    scope.er = function er(e, t) {
      if (!t) return !0;
      let n = (0, scope.Xn)(e);
      if (!n) return !1;
      try {
        return new URL(t, e.loginUrl).origin === n;
      } catch {
        return !1;
      }
    };
    scope.tr = function tr(e) {
      return e === `localStorage` || e === `sessionStorage` ? e : void 0;
    };
    scope.nr = function nr(e) {
      return typeof e == `string` && e.trim() ? e.trim() : void 0;
    };
    scope.rr = function rr(e) {
      return readIdentitySource(e);
    };
    scope.ir = function ir(e, t) {
      if (!t) return !1;
      let n = (0, scope.Xn)(e);
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
    };
    scope.ar = function ar(e) {
      let t = [];
      (0, scope.Xn)(e) || t.push(`登录页必须使用 HTTPS（本机测试可使用 localhost HTTP）`);
      let n = e.loginMethod ?? `form`;
      if (n === `token`) {
        let n = e.tokenConfig;
        (n?.storageKey?.trim() || t.push(`Token 认证需要填写存储键名（如 auth_token）`),
          n?.headerName?.trim() || t.push(`Token 认证需要填写请求头名称（如 Authorization）`),
          n?.identityEndpoint &&
            !(0, scope.er)(e, n.identityEndpoint) &&
            t.push(`身份接口必须与登录站点同源`));
      }
      n !== `oauth` &&
        n !== `github` &&
        n !== `passkey` &&
        n !== `manual` &&
        n !== `auto` &&
        n !== `token` &&
        (e.selectors?.username?.trim() || t.push(`缺少用户名输入框选择器`),
        e.selectors?.password?.trim() || t.push(`缺少密码输入框选择器`),
        e.selectors?.submit?.trim() || t.push(`缺少登录按钮选择器`));
      let r = (0, scope.rr)(e);
      (r?.endpoint &&
        !(0, scope.er)(e, r.endpoint) &&
        !(0, scope.ir)(e, r.endpoint) &&
        t.push(`跨域身份接口必须使用 HTTPS，且主机必须是登录站点域名的自身或子域`),
        r?.endpoint &&
          !(0, scope.er)(e, r.endpoint) &&
          !r.tokenKey &&
          t.push(`跨域身份接口需要同时填写 token 存储键（tokenKey）`),
        r?.pagePath && !(0, scope.er)(e, r.pagePath) && t.push(`身份资料页必须与登录站点同源`),
        e.logoutApiUrl &&
          !(0, scope.er)(e, e.logoutApiUrl) &&
          t.push(`退出接口必须与登录站点同源`));
      let i = e.authBootstrap?.endpoint?.trim();
      if (i) {
        let n = null;
        try {
          n = new URL(i, e.loginUrl).href;
        } catch {
          n = null;
        }
        (!n || !(0, scope.er)(e, n)) && t.push(`令牌引导接口必须是登录站点同源的地址`);
      }
      let a = e.checkin,
        o = a?.method === `workflow` && !a.workflow?.route?.length;
      if (a?.entry && (!(0, scope.mn)(e) || o)) {
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
            ? (0, scope.er)(e, a.apiUrl) || t.push(`签到接口必须与登录站点同源`)
            : t.push(`API 签到需要填写接口地址`)),
        a?.method === `button` &&
          (a.buttonSelector?.trim() || t.push(`按钮签到需要填写按钮选择器`),
          a.url && !(0, scope.er)(e, a.url) && t.push(`签到页面必须与登录站点同源`)),
        a?.method === `claim`)
      ) {
        (a.claimEntrySelector?.trim() || t.push(`领取签到需要填写领取入口选择器`),
          a.claimInputSelector?.trim() || t.push(`领取签到需要填写输入框选择器`),
          a.claimSubmitSelector?.trim() || t.push(`领取签到需要填写提交按钮选择器`));
        let n = a.claimMinLength ?? 10,
          r = a.claimText?.trim();
        (r && r.length < n && t.push(`领取文本至少需要 ${n} 字，当前 ${r.length} 字`),
          a.url && !(0, scope.er)(e, a.url) && t.push(`领取页面必须与登录站点同源`));
      }
      return (
        a?.method === `relogin` &&
          (!a.logoutApiUrl?.trim() &&
            !a.logoutSelector?.trim() &&
            t.push(`退出重登需要填写退出接口或退出按钮选择器`),
          a.logoutApiUrl &&
            !(0, scope.er)(e, a.logoutApiUrl) &&
            t.push(`退出接口必须与登录站点同源`)),
        (0, scope.mn)(e) && t.push(...(0, scope.Yn)(e, a?.workflow)),
        t
      );
    };
    scope.or = function or(e) {
      let t = (0, scope.ar)(e);
      if (t.length) throw Error(t[0]);
    };
    scope.Vr = function Vr(e) {
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
                ...scope.Ht.checkin,
                ...e.checkin,
                logoutStorageKeys: [
                  ...new Set([
                    ...(e.checkin.logoutStorageKeys ?? []),
                    ...(scope.Ht.checkin?.logoutStorageKeys ?? []),
                  ]),
                ],
              }
            : e.checkin;
      return {
        ...e,
        loginUrl: t,
        pointerMode: e.pointerMode ?? scope.Ht.pointerMode,
        successIndicator: n ? scope.Ht.successIndicator : e.successIndicator,
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
    };
    scope.Hr = function Hr(e) {
      if ((0, scope.zr)(e) !== `api.futureppo.top` || (0, scope.hn)(e)) return !1;
      let t = e.checkin;
      return (
        !t ||
        ((t.method === `auto` || t.method === `none`) &&
          t.workflow === void 0 &&
          !t.buttonSelector &&
          !t.alreadySelector &&
          !t.successSelector)
      );
    };
    scope.Ur = function Ur(e) {
      if ((0, scope.zr)(e) !== `anyrouter.top` || (0, scope.hn)(e)) return !1;
      let t = e.checkin;
      return (
        !t ||
        ((t.method === `auto` || t.method === `none`) &&
          t.workflow === void 0 &&
          !t.buttonSelector &&
          !t.alreadySelector &&
          !t.successSelector)
      );
    };
    scope.Wr = function Wr(e) {
      if ((0, scope.zr)(e) !== `linux.sb`) return !1;
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
    };
    scope.Gr = function Gr(e) {
      if ((0, scope.zr)(e) !== `linux.sb`) return !1;
      try {
        return new URL(e.loginUrl).pathname.replace(/\/+$/, ``) === ``;
      } catch {
        return !1;
      }
    };
    scope.Kr = function Kr(e) {
      if (!(0, scope.Gr)(e)) return e;
      try {
        let t = new URL(e.loginUrl);
        return (
          (t.pathname = `/login`),
          (t.search = ``),
          (t.hash = ``),
          { ...e, loginUrl: t.href }
        );
      } catch {
        return e;
      }
    };
    scope.qr = function qr(e) {
      let t = scope.en.checkin,
        n = scope.en.adapter,
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
        pointerMode: e.pointerMode ?? scope.en.pointerMode,
        loginMethod: e.loginMethod || scope.en.loginMethod || `form`,
        selectors: { ...scope.en.selectors, ...e.selectors },
        closeModalSelectors: e.closeModalSelectors?.length
          ? [...e.closeModalSelectors]
          : [...scope.en.closeModalSelectors],
        successIndicator: e.successIndicator ?? scope.en.successIndicator,
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
    };
    scope.Y = function Y(e, t, n) {
      if (!t) return !1;
      try {
        let r = (e) => e.replace(/\/+$/, ``) || `/`;
        return r(new URL(t, e.loginUrl).pathname) === r(n);
      } catch {
        return !1;
      }
    };
    scope.Jr = function Jr(e, t) {
      return !!e && e.length === t.length && e.every((e, n) => e === t[n]);
    };
    scope.Xr = function Xr(e) {
      if ((0, scope.zr)(e) !== scope.Yr) return !1;
      try {
        let t = new URL(e.loginUrl),
          n = t.pathname.replace(/\/+$/, ``) || `/`;
        if (
          t.protocol !== `https:` ||
          t.hostname.toLowerCase() !== scope.Yr ||
          t.port ||
          !new Set([
            `/`,
            `/login`,
            `/user/login`,
            `/console`,
            `/console/personal`,
            `/dashboard`,
          ]).has(n)
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
        (t.url && !(0, scope.Y)(e, t.url, `/`) && !(0, scope.Y)(e, t.url, `/console/personal`)) ||
        (t.apiUrl && !(0, scope.Y)(e, t.apiUrl, `/api/user/checkin`))
      )
        return !1;
      let n = e.adapter;
      return !(
        (n?.family && n.family !== scope.N.NEW_API) ||
        (n?.siteType && n.siteType !== scope.V.NEW_API) ||
        (n?.checkinPath && !(0, scope.Y)(e, n.checkinPath, `/console/personal`)) ||
        (n?.quotaPerUnit != null && n.quotaPerUnit !== 5e5) ||
        (n?.checkin?.pathPatterns &&
          !(0, scope.Jr)(n.checkin.pathPatterns, [`/console/personal*`, `/dashboard*`])) ||
        (n?.checkin?.titleWords &&
          !(0, scope.Jr)(n.checkin.titleWords, [`每日签到`, `daily check-in`]))
      );
    };
    scope.Zr = function Zr(e) {
      let t = scope.un,
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
    };
    scope.Qr = function Qr(e) {
      if ((0, scope.zr)(e) !== `vsllm.com`) return !1;
      let t = e.checkin;
      return (
        !t ||
        !(
          t.method !== `auto` ||
          !Object.keys(t).every((e) => [`method`, `url`, `apiUrl`].includes(e)) ||
          (t.url && !(0, scope.Y)(e, t.url, `/console/personal`)) ||
          (t.apiUrl && !(0, scope.Y)(e, t.apiUrl, `/api/user/checkin`))
        )
      );
    };
    scope.$r = function $r(e) {
      let t = scope.cn,
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
    };
    scope.ei = function ei(e) {
      if ((0, scope.zr)(e) !== `vsllm.com`) return e;
      let t = e.checkin?.workflow?.steps;
      if (!Array.isArray(t) || !t.some((e) => e?.type === `vsllm-daily`)) return e;
      let n = scope.cn.checkin;
      return {
        ...e,
        checkin: {
          ...n,
          successText: [...(n.successText ?? [])],
          alreadyText: [...(n.alreadyText ?? [])],
        },
      };
    };
    scope.ni = function ni(e) {
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
        if (t.protocol !== `https:` || t.hostname !== scope.ti || t.port) return e;
      } catch {
        return e;
      }
      return {
        ...e,
        checkin: { method: `workflow`, workflow: { steps: [{ type: `leilei-daily` }] } },
      };
    };
    scope.ri = function ri(e) {
      if ((0, scope.zr)(e) !== scope.ti) return !1;
      try {
        let t = new URL(e.loginUrl);
        if (t.protocol !== `https:` || t.hostname.toLowerCase() !== scope.ti || t.port) return !1;
        let n = t.pathname.replace(/\/+$/, ``) || `/`;
        if (
          !new Set([`/`, `/login`, `/sign-in`, `/profile`, `/console`, `/console/personal`]).has(n)
        )
          return !1;
      } catch {
        return !1;
      }
      let t = e.checkin;
      if (
        t?.method === `workflow` ||
        (t && t.method !== `auto` && t.method !== `button`) ||
        (t?.method === `button` &&
          (!(0, scope.Y)(e, t.url, `/profile`) ||
            t.buttonSelector !== `button >> text=立即签到, button >> text=签到` ||
            t.alreadySelector !== `button >> text=已签到` ||
            (t.successText && !(0, scope.Jr)(t.successText, [`签到成功`, `今天 +`])) ||
            (t.alreadyText && !(0, scope.Jr)(t.alreadyText, [`已签到`, `今日已签到`])) ||
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
            (t.url &&
              !(0, scope.Y)(e, t.url, `/profile`) &&
              !(0, scope.Y)(e, t.url, `/console/personal`)) ||
            (t.apiUrl && !(0, scope.Y)(e, t.apiUrl, `/api/user/checkin`))))
      )
        return !1;
      let n = e.adapter;
      return !(
        (n?.family && n.family !== scope.N.NEW_API) ||
        (n?.siteType && n.siteType !== scope.V.NEW_API) ||
        (n?.checkinPath &&
          !(0, scope.Y)(e, n.checkinPath, `/profile`) &&
          !(0, scope.Y)(e, n.checkinPath, `/console/personal`)) ||
        (n?.checkin?.pathPatterns &&
          !(0, scope.Jr)(n.checkin.pathPatterns, [`/profile*`]) &&
          !(0, scope.Jr)(n.checkin.pathPatterns, [`/profile*`, `/lottery*`]) &&
          !(0, scope.Jr)(n.checkin.pathPatterns, [`/console/personal*`])) ||
        (n?.checkin?.titleWords &&
          !(0, scope.Jr)(n.checkin.titleWords, [`每日签到`]) &&
          !(0, scope.Jr)(n.checkin.titleWords, [`每日签到`, `浮梦引光`, `抽奖`]) &&
          !(0, scope.Jr)(n.checkin.titleWords, [`每日签到`, `daily check-in`]))
      );
    };
    scope.ii = function ii(e) {
      let t = scope.on,
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
        checkin: {
          method: `workflow`,
          workflow: { steps: (r?.steps ?? []).map((e) => ({ ...e })) },
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
        ...(t.authBootstrap ? { authBootstrap: { ...t.authBootstrap } } : {}),
      };
    };
    scope.ai = function ai(e) {
      if (
        (0, scope.zr)(e) !== scope.ti ||
        e.checkin?.method !== `workflow` ||
        !(e.checkin.workflow?.steps ?? []).some((e) => e.type === `leilei-daily`)
      )
        return !1;
      let t = e.adapter?.checkinPath,
        n = e.adapter?.checkin?.pathPatterns ?? [];
      return t === `/profile` || !n.some((e) => e.startsWith(`/lottery`));
    };
    scope.oi = function oi(e) {
      return (0, scope.zr)(e) !== scope.ti || e.checkin?.method !== `workflow`
        ? !1
        : !e.authBootstrap?.endpoint;
    };
    scope.si = function si(e) {
      let t = scope.on.authBootstrap;
      return t ? { ...e, authBootstrap: { ...t } } : e;
    };
    scope.ci = function ci(e) {
      let t = scope.on.adapter;
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
    };
    scope.ui = function ui(e) {
      if ((0, scope.zr)(e) !== `sub.100xlabs.space`) return !1;
      let t = e.checkin;
      if (!t) return !0;
      if ((0, scope.hn)(e)) return !1;
      if (t.method === `none`)
        return (
          Object.keys(t).every((e) => [`method`, `url`].includes(e)) &&
          (!t.url ||
            (0, scope.Y)(e, t.url, `/check-in`) ||
            (0, scope.Y)(e, t.url, `/console/personal`))
        );
      if (
        t.method !== `auto` ||
        !Object.keys(t).every((e) => [`method`, `url`, `apiUrl`].includes(e))
      )
        return !1;
      let n = (0, scope.Y)(e, t.url, `/check-in`) && !t.apiUrl,
        r =
          (0, scope.Y)(e, t.url, `/console/personal`) &&
          (0, scope.Y)(e, t.apiUrl, `/api/user/checkin`);
      return n || r;
    };
    scope.di = function di(e) {
      let t = scope.Yt,
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
    };
    scope.fi = function fi(e) {
      return scope.li.has((0, scope.zr)(e));
    };
    scope.pi = function pi(e) {
      let t = e.checkin;
      return (
        !t ||
        !(
          (0, scope.hn)(e) ||
          (t.method !== `auto` && t.method !== `none`) ||
          !Object.keys(t).every((e) => [`method`, `url`, `apiUrl`].includes(e)) ||
          (t.url &&
            !(0, scope.Y)(e, t.url, `/console/personal`) &&
            !(0, scope.Y)(e, t.url, `/profile`)) ||
          (t.apiUrl && !(0, scope.Y)(e, t.apiUrl, `/api/user/checkin`))
        )
      );
    };
    scope.mi = function mi(e) {
      let t = scope.nn,
        n = (0, scope.pi)(e),
        r = n || (0, scope.Y)(e, e.checkin?.url, `/profile`),
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
          siteType: scope.V.NEW_API,
          family: scope.N.NEW_API,
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
    };
    scope.hi = function hi(e) {
      if ((0, scope.zr)(e) !== `k40.shengqainbang.cn`) return !1;
      let t = e.checkin;
      if (!t) return !0;
      if ((0, scope.hn)(e)) return !1;
      if (
        t.method === `none` ||
        (t.method === `button` &&
          (0, scope.Y)(e, t.url, `/profile`) &&
          t.buttonSelector ===
            `button >> text=立即签到, button >> text=立即簽到, button >> text=Check in now` &&
          t.alreadySelector ===
            `button >> text=已签到, button >> text=已簽到, button >> text=Checked in` &&
          (0, scope.Jr)(t.successText, [`签到成功`, `簽到成功`, `Check-in successful`]) &&
          (0, scope.Jr)(t.alreadyText, [
            `已签到`,
            `今日已签到`,
            `已簽到`,
            `今日已簽到`,
            `Checked in`,
          ]) &&
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
          e.adapter?.family === scope.N.NEW_API &&
          e.adapter?.checkinPath === `/profile` &&
          e.adapter?.quotaPerUnit === 5e5)
      )
        return !0;
      if (t.method !== `auto`) return !1;
      let n =
          (0, scope.Y)(e, t.url, `/console/personal`) &&
          (0, scope.Y)(e, t.apiUrl, `/api/user/checkin`) &&
          Object.keys(t).every((e) => [`method`, `url`, `apiUrl`].includes(e)),
        r =
          (0, scope.Y)(e, t.url, `/check-in`) &&
          Object.keys(t).every((e) => [`method`, `url`].includes(e));
      return n || r;
    };
    scope.gi = function gi(e) {
      let t = scope.Yt.checkin,
        n = scope.Yt.adapter,
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
        selectors: { ...e.selectors, ...scope.Yt.selectors },
        loginMethod: scope.Yt.loginMethod || `form`,
        ...(scope.Yt.tokenConfig || e.tokenConfig
          ? { tokenConfig: { ...e.tokenConfig, ...scope.Yt.tokenConfig } }
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
    };
    scope._i = function _i(e) {
      if ((0, scope.zr)(e) !== `api.denxio.top`) return !1;
      let t = e.checkin;
      return (0, scope.hn)(e)
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
              (t.apiUrl && !(0, scope.Y)(e, t.apiUrl, `/api/user/checkin`))
            ? !1
            : !t.url ||
              (0, scope.Y)(e, t.url, `/check-in`) ||
              (0, scope.Y)(e, t.url, `/console/personal`) ||
              (0, scope.Y)(e, t.url, `/checkin`);
    };
    scope.vi = function vi(e) {
      let t = scope.Qt.checkin,
        n = scope.Qt.adapter,
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
        selectors: { ...scope.Qt.selectors, ...e.selectors },
        loginMethod: e.loginMethod || scope.Qt.loginMethod || `form`,
        ...(scope.Qt.tokenConfig || e.tokenConfig
          ? { tokenConfig: { ...scope.Qt.tokenConfig, ...e.tokenConfig } }
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
    };
    scope.yi = function yi(e) {
      if ((0, scope.zr)(e) !== `tabitoken.com`) return !1;
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
          (0, scope.Y)(e, t.url, `/profile`) &&
          t.buttonSelector === `button >> text=立即签到, button >> text=签到` &&
          t.alreadySelector === `button >> text=已签到` &&
          !t.entry;
      return n || r;
    };
    scope.bi = function bi(e, t) {
      return JSON.stringify(e) === JSON.stringify(t) ? e : t;
    };
    scope.xi = function xi(e) {
      let t = e.checkin,
        n = t?.workflow;
      return !t ||
        t.method !== `auto` ||
        t.workflowReplayDisabled === !0 ||
        !n ||
        typeof n.identityPath != `string` ||
        !n.identityPath.trim() ||
        (0, scope.Yn)(e, n).length > 0
        ? e
        : { ...e, checkin: { ...t, method: `workflow` } };
    };
    scope.wi = function wi(e) {
      return e.successIndicator === scope.Si ? { ...e, successIndicator: scope.Ci } : e;
    };
    scope.Ti = function Ti(e) {
      let t = (0, scope.Kr)(e);
      if (
        ((t = (0, scope.wi)(t)),
        (t = (0, scope.xi)(t)),
        (t = (0, scope.ei)(t)),
        (t = (0, scope.ni)(t)),
        (0, scope.ai)(t) && (t = (0, scope.ci)(t)),
        (0, scope.oi)(t) && (t = (0, scope.si)(t)),
        (0, scope.Xr)(t))
      )
        t = (0, scope.Zr)(t);
      else if ((0, scope.Qr)(t)) t = (0, scope.$r)(t);
      else if ((0, scope.ri)(t)) t = (0, scope.ii)(t);
      else if ((0, scope.ui)(t)) t = (0, scope.di)(t);
      else if ((0, scope.fi)(t)) t = (0, scope.mi)(t);
      else if ((0, scope.Br)(t)) t = (0, scope.Vr)(t);
      else if ((0, scope.Wr)(t)) t = (0, scope.qr)(t);
      else if ((0, scope._i)(t)) t = (0, scope.vi)(t);
      else if ((0, scope.hi)(t)) t = (0, scope.gi)(t);
      else if ((0, scope.yi)(t)) t = (0, scope.Di)(t);
      else if ((0, scope.Ur)(t)) t = (0, scope.Oi)(t);
      else if ((0, scope.Hr)(t))
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
            siteType: scope.V.NEW_API,
            family: scope.N.NEW_API,
            checkinPath: `/console/personal`,
            checkin: { pathPatterns: [`/console/personal*`], titleWords: [`每日签到`] },
            quotaPerUnit: 5e5,
          },
        };
      else return (0, scope.bi)(e, t);
      return (0, scope.bi)(e, t);
    };
    scope.Ei = function Ei(e) {
      return e.map(scope.Ti);
    };
    scope.Di = function Di(e) {
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
          (0, scope.Y)(e, e.checkin.url, `/profile`) &&
          e.checkin.buttonSelector === `button >> text=立即签到, button >> text=签到` &&
          e.checkin.alreadySelector === `button >> text=已签到` &&
          !e.checkin.entry,
        r = scope.rn.checkin,
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
        successIndicator: e.successIndicator ?? scope.rn.successIndicator,
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
          siteType: scope.V.NEW_API,
          family: scope.N.NEW_API,
          ...(t || n
            ? {
                checkinPath: `/profile`,
                checkin: { pathPatterns: [`/profile*`], titleWords: [`每日签到`] },
              }
            : {}),
          quotaPerUnit: e.adapter?.quotaPerUnit ?? 5e5,
        },
      };
    };
    scope.Oi = function Oi(e) {
      return {
        ...e,
        loginMethod: e.loginMethod || `auto`,
        checkin: { method: `none` },
        adapter: {
          ...e.adapter,
          siteType: scope.V.ANYROUTER,
          family: scope.N.NEW_API,
          checkinPath: ``,
          checkin: { pathPatterns: [], titleWords: [] },
          quotaPerUnit: e.adapter?.quotaPerUnit ?? 5e5,
        },
      };
    };
    scope.ki = function ki(e, t) {
      return e.length !== t.length || e.some((e, n) => e !== t[n]);
    };
    scope.Ai = function Ai(e, t) {
      let n = new Set(t.map((e) => e.siteId));
      return e.filter((e) => !n.has(e));
    };
    scope.ji = async function ji(e, t) {
      let n = e.filter(scope.Fr);
      if (!(n.length > 0 || t.some((e) => e.siteId === `real-sharedchat`)))
        return { userSites: e, accounts: t };
      let r = scope.pn.find((e) => e.id === scope.Pr);
      if (!r) return { userSites: e, accounts: t };
      let i = e.find((e) => e.id === scope.Pr),
        a = new Set([
          ...(r.checkin?.claimUsedTexts ?? []),
          ...(i?.checkin?.claimUsedTexts ?? []),
          ...n.flatMap((e) => e.checkin?.claimUsedTexts ?? []),
        ]),
        o = {
          ...(i ?? r),
          id: scope.Pr,
          builtin: !0,
          checkin: { method: `claim`, ...(i ?? r).checkin, claimUsedTexts: [...a] },
        },
        s = e.filter((e) => !(0, scope.Fr)(e) && e.id !== scope.Pr).concat(o),
        c = new Set(n.map((e) => e.id).concat(`real-sharedchat`)),
        l = t.map((e) => (c.has(e.siteId) ? { ...e, siteId: scope.Pr } : e));
      return (
        await scope.z.setMany({ [scope.M.sites]: s, [scope.M.accounts]: l }),
        { userSites: s, accounts: l }
      );
    };
    scope.Mi = async function Mi(e, t) {
      let n = new Set(scope.pn.map((e) => e.id)),
        r = e.filter((e) => e.id.startsWith(`builtin-`) && e.builtin !== !1 && !n.has(e.id));
      if (r.length === 0) return { userSites: e, accounts: t };
      let i = new Set(r.map((e) => e.id)),
        a = new Set(t.map((e) => e.siteId)),
        o = e.flatMap((e) => (i.has(e.id) ? (a.has(e.id) ? [{ ...e, builtin: !1 }] : []) : [e]));
      return (await scope.z.set(scope.M.sites, o), { userSites: o, accounts: t });
    };
    scope.to = function to(e) {
      return (
        (e.hostname === `google.com` || e.hostname.endsWith(`.google.com`)) &&
        e.pathname === `/s2/favicons`
      );
    };
    scope.no = function no({ site: e, className: t, fallback: n }) {
      let r = (0, scope.Xa)(e),
        i = r.join(`\0`),
        [a, o] = (0, scope.G.useState)(null),
        s = a?.key === i ? a.index : 0,
        c = r[s],
        l = () => o((e) => ((e?.key === i ? e.index : 0) === s ? { key: i, index: s + 1 } : e));
      return c
        ? (0, scope.W.jsx)(`img`, {
            src: c,
            alt: ``,
            className: t,
            onError: l,
            onLoad: (e) => {
              e.currentTarget.naturalWidth === 0 && l();
            },
          })
        : (0, scope.W.jsx)(`span`, {
            role: `img`,
            'aria-label': `${e.name || `站点`}暂无可用的原生图标`,
            title: `站点未提供可读取的原生图标`,
            children: n,
          });
    };
    scope.ro = function ro({
      site: e,
      sharedFlowFrom: n,
      accounts: r,
      proxy: i,
      proxies: s,
      proxyUsage: c,
      statusOf: l,
      resultOf: d,
      liveOf: f,
      balanceOf: p,
      refreshingBalanceIds: h,
      onRefreshBalances: y,
      isQueued: S,
      onRun: C,
      onRunAll: T,
      onStopAll: E,
      onResetAccount: D,
      onStopAccount: k,
      onRetryAccount: A,
      onMarkAccountDone: j,
      onCaptureSession: M,
      onLearnAccount: N,
      learningAccounts: ee,
      learningNotices: ne,
      learnedSteps: re,
      onCancelLearnAccount: I,
      onEditAccount: ie,
      onSetAccountProxy: ae,
      onRemoveAccount: oe,
      onAddAccount: le,
      onEditSite: ue,
      onRemoveSite: de,
      canMoveUp: z = !1,
      canMoveDown: B = !1,
      onMove: V,
      searchActive: H = !1,
      selectionMode: fe,
      siteSelected: U,
      selectedAccountIds: pe,
      onToggleSite: ge,
      onToggleAccount: xe,
      ref: Se,
    }) {
      let [Ce, we] = (0, scope.G.useState)(() => r.length > 0),
        K = r.reduce((e, t) => ({ ...e, [l(t.id)]: e[l(t.id)] + 1 }), {
          pending: 0,
          running: 0,
          attention: 0,
          done: 0,
          failed: 0,
        }),
        Te = K.pending + K.failed,
        Ee = K.running + K.attention + r.filter((e) => l(e.id) === `pending` && S(e.id)).length,
        De = K.failed
          ? `failed`
          : K.attention
            ? `attention`
            : K.running
              ? `running`
              : r.length && K.done === r.length
                ? `done`
                : `pending`,
        Oe = r.length > 0 && K.done === r.length,
        ke = r.length ? Math.round((K.done / r.length) * 100) : 0,
        Ae = e.checkin?.method ?? `auto`,
        je = (0, scope.se)(e),
        Me = (0, scope.io)(e),
        Ne = (0, scope.F)(
          r.map((t) => ({
            balance: (0, scope.te)(p(t.id), d(t.id)).balance,
            scale: { quotaPerUnit: e.adapter?.quotaPerUnit, family: je.family },
          })),
        ),
        Pe = r.some((e) => h?.has(e.id));
      (0, scope.G.useEffect)(() => {
        Oe && we(!0);
      }, [Oe]);
      let Fe = fe
          ? `批量选择期间不能收起账号`
          : H
            ? `搜索命中期间保持展开`
            : K.running + K.attention > 0
              ? `有账号正在执行或待处理`
              : null,
        Ie = !!Fe || !Ce,
        Le = r.find((e) => l(e.id) === `failed`),
        Re = Le ? d(Le.id) : void 0,
        ze = Re && !Re.ok ? (0, scope.ua)(Re.message, Re.steps) : null;
      return (0, scope.W.jsxs)(scope.w.section, {
        ref: Se,
        layout: `position`,
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { type: `spring`, stiffness: 320, damping: 30 },
        className: (0, scope.R)(
          `relative overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none dark:bg-slate-950 dark:hover:shadow-black/20`,
          (0, scope.co)(De),
          U && `ring-2 ring-rose-500/30`,
        ),
        children: [
          (0, scope.W.jsx)(`span`, {
            className: (0, scope.R)(`absolute inset-y-0 left-0 w-1`, (0, scope.lo)(De)),
            'aria-hidden': `true`,
          }),
          (0, scope.W.jsxs)(`header`, {
            className: `border-b border-slate-100 px-4 py-3.5 dark:border-slate-800`,
            children: [
              (0, scope.W.jsxs)(`div`, {
                className: `flex flex-wrap items-start gap-3`,
                children: [
                  fe &&
                    (0, scope.W.jsx)(`button`, {
                      type: `button`,
                      disabled: e.builtin,
                      onClick: () => ge(e.id),
                      'aria-label': e.builtin
                        ? `内置站点 ${e.name} 不可删除`
                        : `${U ? `取消选择` : `选择`}站点 ${e.name}`,
                      title: e.builtin ? `内置站点不可删除` : void 0,
                      className: (0, scope.R)(
                        `mt-1 grid size-7 place-items-center rounded-md disabled:cursor-not-allowed disabled:opacity-40`,
                        U
                          ? `bg-rose-500 text-white`
                          : `bg-slate-100 text-slate-500 dark:bg-slate-900`,
                      ),
                      children: U
                        ? (0, scope.W.jsx)(scope.o, { className: `size-4` })
                        : (0, scope.W.jsx)(scope.ve, { className: `size-4` }),
                    }),
                  (0, scope.W.jsx)(scope.ao, { site: e }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `min-w-[160px] flex-1`,
                    children: [
                      (0, scope.W.jsxs)(`div`, {
                        className: `flex flex-wrap items-center gap-2`,
                        children: [
                          (0, scope.W.jsx)(`a`, {
                            href: e.loginUrl,
                            target: `_blank`,
                            rel: `noreferrer noopener`,
                            title: `打开 ${e.name}`,
                            className: `truncate text-sm font-semibold text-slate-950 hover:text-blue-600 dark:text-white dark:hover:text-blue-400`,
                            children: e.name,
                          }),
                          (0, scope.W.jsx)(`span`, {
                            className: `rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300`,
                            children:
                              (0, scope.mn)(e) || n
                                ? `学习流程回放`
                                : Ae === `none`
                                  ? `登录即签到`
                                  : Ae === `auto`
                                    ? `自动识别`
                                    : `本站适配`,
                          }),
                          i &&
                            (0, scope.W.jsxs)(`span`, {
                              className: `inline-flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-300`,
                              children: [
                                (0, scope.W.jsx)(scope.x, { className: `size-2.5` }),
                                i.name,
                              ],
                            }),
                          (0, scope.W.jsxs)(`span`, {
                            className: `inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`,
                            children: [
                              (0, scope.W.jsx)(scope.a, { className: `size-2.5` }),
                              `本站余额 `,
                              (0, scope.ce)(Ne),
                              Ne.missing > 0 && ` · ${Ne.missing} 个未获取`,
                            ],
                          }),
                        ],
                      }),
                      (0, scope.W.jsx)(`p`, {
                        className: `mt-0.5 truncate text-[11px] text-slate-500`,
                        children: (0, scope.Lt)(e.loginUrl),
                      }),
                      (0, scope.W.jsxs)(`p`, {
                        className: `mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300`,
                        children: [
                          (0, scope.W.jsx)(`span`, {
                            className: `mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500`,
                          }),
                          (0, scope.W.jsx)(`span`, { children: Me }),
                        ],
                      }),
                    ],
                  }),
                  !fe &&
                    (0, scope.W.jsxs)(`div`, {
                      className: `flex items-center gap-1`,
                      children: [
                        Te > 0 &&
                          (0, scope.W.jsxs)(`button`, {
                            type: `button`,
                            onClick: () => T(e.id),
                            className: `inline-flex h-8 items-center gap-1 rounded-md bg-blue-600 px-2.5 text-[11px] font-semibold text-white hover:bg-blue-700`,
                            children: [
                              (0, scope.W.jsx)(scope.m, { className: `size-3 fill-current` }),
                              `执行 `,
                              Te,
                            ],
                          }),
                        Ee > 0 &&
                          (0, scope.W.jsxs)(`button`, {
                            type: `button`,
                            onClick: () => E(e.id),
                            title: `停止本站正在执行和排队中的任务`,
                            className: `inline-flex h-8 items-center gap-1 rounded-md bg-slate-100 px-2.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700`,
                            children: [
                              (0, scope.W.jsx)(scope.me, { className: `size-3` }),
                              `停止 `,
                              Ee,
                            ],
                          }),
                        y &&
                          (0, scope.W.jsx)(scope.oo, {
                            title: Pe ? `正在刷新本站余额` : `刷新本站余额`,
                            disabled: Pe || r.length === 0,
                            onClick: () => y(r.map((e) => e.id)),
                            children: Pe
                              ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` })
                              : (0, scope.W.jsx)(scope.a, { className: `size-4` }),
                          }),
                        (0, scope.W.jsx)(scope.oo, {
                          title: `添加账号`,
                          onClick: () => le(e.id),
                          children: (0, scope.W.jsx)(scope._, { className: `size-4` }),
                        }),
                        V &&
                          (0, scope.W.jsxs)(scope.W.Fragment, {
                            children: [
                              (0, scope.W.jsx)(scope.oo, {
                                title: `上移站点`,
                                disabled: !z,
                                onClick: () => V(e.id, `up`),
                                children: (0, scope.W.jsx)(scope.be, { className: `size-4` }),
                              }),
                              (0, scope.W.jsx)(scope.oo, {
                                title: `下移站点`,
                                disabled: !B,
                                onClick: () => V(e.id, `down`),
                                children: (0, scope.W.jsx)(scope._e, { className: `size-4` }),
                              }),
                            ],
                          }),
                        (0, scope.W.jsx)(scope.oo, {
                          title: `编辑站点`,
                          onClick: () => ue(e),
                          children: (0, scope.W.jsx)(scope.he, { className: `size-4` }),
                        }),
                        !e.builtin &&
                          (0, scope.W.jsx)(scope.oo, {
                            title: `删除站点`,
                            danger: !0,
                            onClick: () => de(e.id),
                            children: (0, scope.W.jsx)(scope.v, { className: `size-4` }),
                          }),
                      ],
                    }),
                ],
              }),
              ze &&
                !Ie &&
                (0, scope.W.jsxs)(`div`, {
                  'data-site-diagnosis': ze.code,
                  className: `mt-3 rounded-lg bg-amber-500/[0.07] px-2.5 py-2 ring-1 ring-inset ring-amber-500/20 dark:bg-amber-400/[0.06]`,
                  children: [
                    (0, scope.W.jsx)(`p`, {
                      'data-diagnosis-title': !0,
                      className: `text-[11px] font-semibold text-amber-900 dark:text-amber-100`,
                      children: ze.title,
                    }),
                    (0, scope.W.jsxs)(`p`, {
                      className: `mt-0.5 text-[11px] leading-relaxed text-ink-800/60 dark:text-ink-100/50`,
                      children: [`下一步：`, ze.nextActions[0]],
                    }),
                    (0, scope.W.jsx)(`button`, {
                      type: `button`,
                      onClick: () => we(!1),
                      className: `mt-1 text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400`,
                      children: `展开账号查看完整排查步骤`,
                    }),
                  ],
                }),
              (0, scope.W.jsxs)(`div`, {
                className: `mt-3 flex items-center gap-3`,
                children: [
                  (0, scope.W.jsx)(`div`, {
                    className: `h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800`,
                    children: (0, scope.W.jsx)(scope.w.span, {
                      className: (0, scope.R)(
                        `block h-full origin-left rounded-full`,
                        (0, scope.lo)(De),
                      ),
                      initial: !1,
                      animate: { scaleX: ke / 100 },
                    }),
                  }),
                  (0, scope.W.jsxs)(`span`, {
                    className: `text-[11px] font-semibold tabular-nums text-slate-500`,
                    children: [K.done, `/`, r.length],
                  }),
                ],
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-medium`,
                children: [
                  (0, scope.W.jsx)(scope.so, {
                    icon: (0, scope.W.jsx)(scope.t, {}),
                    label: `完成`,
                    value: K.done,
                    tone: `text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40`,
                  }),
                  (0, scope.W.jsx)(scope.so, {
                    icon: (0, scope.W.jsx)(scope.ye, {}),
                    label: `待签`,
                    value: K.pending,
                    tone: `text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40`,
                  }),
                  K.running > 0 &&
                    (0, scope.W.jsx)(scope.so, {
                      icon: (0, scope.W.jsx)(scope.u, { className: `animate-spin` }),
                      label: `执行中`,
                      value: K.running,
                      tone: `text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40`,
                    }),
                  K.attention > 0 &&
                    (0, scope.W.jsx)(scope.so, {
                      icon: (0, scope.W.jsx)(scope.g, {}),
                      label: `需处理`,
                      value: K.attention,
                      tone: `text-cyan-700 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-950/40`,
                    }),
                  K.failed > 0 &&
                    (0, scope.W.jsx)(scope.so, {
                      icon: (0, scope.W.jsx)(scope.g, {}),
                      label: `失败`,
                      value: K.failed,
                      tone: `text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/40`,
                    }),
                  !fe &&
                    r.length > 0 &&
                    (0, scope.W.jsxs)(`button`, {
                      type: `button`,
                      title: Fe ?? void 0,
                      'aria-label': `${Ie ? `收起` : `展开`}账号 ${e.name}`,
                      'aria-expanded': Ie,
                      disabled: !!Fe,
                      onClick: () => we((e) => !e),
                      className: `ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-45 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-900 dark:hover:text-white`,
                      children: [
                        (0, scope.W.jsx)(scope.w.span, {
                          animate: { rotate: Ie ? 180 : 0 },
                          className: `block`,
                          children: (0, scope.W.jsx)(scope.b, { className: `size-3` }),
                        }),
                        Ie ? `收起` : `展开`,
                        ` `,
                        r.length,
                        ` 个账号`,
                      ],
                    }),
                ],
              }),
            ],
          }),
          (0, scope.W.jsx)(scope.O, {
            initial: !1,
            children:
              Ie &&
              (0, scope.W.jsx)(scope.w.div, {
                initial: { height: 0, opacity: 0 },
                animate: { height: `auto`, opacity: 1 },
                exit: { height: 0, opacity: 0 },
                className: `overflow-hidden`,
                children: (0, scope.W.jsxs)(`div`, {
                  className: `divide-y divide-slate-100 dark:divide-slate-800`,
                  children: [
                    (0, scope.W.jsx)(scope.O, {
                      mode: `popLayout`,
                      children: r.map((t) => {
                        let n = l(t.id),
                          r = S(t.id),
                          a = ee?.get(t.id),
                          o = typeof a == `number` ? { eventCount: a, kind: `checkin` } : a;
                        return (0, scope.W.jsx)(
                          scope.Aa,
                          {
                            account: t,
                            status: n,
                            result: d(t.id),
                            siteCheckinMethod: Ae,
                            siteName: e.name,
                            quotaPerUnit: e.adapter?.quotaPerUnit,
                            adapterFamily: je.family,
                            balance: p(t.id),
                            balanceRefreshing: h?.has(t.id),
                            onRefreshBalance: y ? () => y([t.id]) : void 0,
                            liveTask: f(t.id),
                            queued: r,
                            proxyLabel: (0, scope.P)(t, e, s),
                            proxyEndpoint: (0, scope.L)(t, e, s),
                            proxies: s,
                            proxyUsage: c,
                            siteProxyName: i?.name,
                            onSetProxy: ae,
                            onRun: C,
                            onReset: D,
                            onStop: k,
                            onRetry: A,
                            onMarkDone: j,
                            onLearn: N,
                            learning: o,
                            learningNotice: ne?.get(t.id),
                            learnedSteps: re?.get(t.id),
                            onCancelLearn: I,
                            onCaptureSession: (0, scope.Ya)((0, scope.Ja)(t, e).loginMethod)
                              .sessionCounts
                              ? M
                              : void 0,
                            onEdit: ie,
                            onRemove: oe,
                            selectionMode: fe,
                            selected: U || pe.has(t.id),
                            selectionDisabled: U,
                            onToggleSelect: xe,
                          },
                          t.id,
                        );
                      }),
                    }),
                    !r.length &&
                      !fe &&
                      (0, scope.W.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => le(e.id),
                        className: `m-3 flex w-[calc(100%-1.5rem)] items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-3 text-xs text-slate-500 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700`,
                        children: [
                          (0, scope.W.jsx)(scope._, { className: `size-3.5` }),
                          `添加本站账号`,
                        ],
                      }),
                  ],
                }),
              }),
          }),
        ],
      });
    };
    scope.io = function io(e) {
      return (0, scope.mn)(e)
        ? `通用登录 → 核对当前账号 → 执行已保存签到流程 · 本站账号共用，可重新学习`
        : e.checkin?.method === `none`
          ? `通用登录 → 登录成功即完成签到 · 不再寻找签到按钮 · 可重新学习`
          : e.checkin?.method && e.checkin.method !== `auto`
            ? `通用登录 → 确认账号 → 按本站已有适配完成签到 · 可学习`
            : `通用登录 → 确认账号 → 自动识别签到 · 可一次学习登录与签到`;
    };
    scope.ao = function ao({ site: e }) {
      let t = e.name.trim().slice(0, 1).toUpperCase();
      return (0, scope.W.jsx)(`span`, {
        className: `grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800`,
        children: (0, scope.W.jsx)(scope.no, { site: e, className: `size-5 rounded`, fallback: t }),
      });
    };
    scope.oo = function oo({
      title: e,
      onClick: t,
      children: n,
      danger: r = !1,
      disabled: i = !1,
    }) {
      return (0, scope.W.jsx)(`button`, {
        type: `button`,
        title: e,
        disabled: i,
        onClick: t,
        className: (0, scope.R)(
          `grid size-8 place-items-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white`,
          r &&
            `hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400`,
        ),
        children: n,
      });
    };
    scope.so = function so({ icon: e, label: t, value: n, tone: r }) {
      return (0, scope.W.jsxs)(`span`, {
        className: (0, scope.R)(`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5`, r),
        children: [e, t, ` `, n],
      });
    };
    scope.co = function co(e) {
      return e === `failed`
        ? `border-rose-200 dark:border-rose-950`
        : e === `attention`
          ? `border-cyan-200 dark:border-cyan-950`
          : e === `running`
            ? `border-blue-200 dark:border-blue-950`
            : `border-slate-200 dark:border-slate-800`;
    };
    scope.lo = function lo(e) {
      return e === `done`
        ? `bg-emerald-500`
        : e === `running`
          ? `bg-blue-500`
          : e === `attention`
            ? `bg-cyan-500`
            : e === `failed`
              ? `bg-rose-500`
              : `bg-amber-400`;
    };
    scope.mo = function mo(e) {
      let t = e.trim();
      if (!t) throw Error(`书签文件是空的`);
      return t.startsWith(`{`) ? (0, scope.ho)(t) : (0, scope.vo)(e);
    };
    scope.ho = function ho(e) {
      let t;
      try {
        t = JSON.parse(e);
      } catch {
        throw Error(`无法解析 Chrome Bookmarks JSON`);
      }
      if (!t.roots) throw Error(`没有找到 Chrome 书签根节点`);
      let n = (0, scope.yo)(),
        r = Object.entries(t.roots);
      for (let [e, t] of r) {
        let r = [scope.po[e] || t.name?.trim() || e];
        n.rememberFolder(r);
        for (let e of t.children ?? []) (0, scope._o)(e, r, n);
      }
      return { source: `chrome-json`, folders: n.folders(), links: n.links };
    };
    scope.go = function go(e) {
      let t = (0, scope.yo)();
      for (let n of e)
        for (let e of n.children ?? []) {
          let n = (e.title ?? ``).trim() || `未命名`;
          if (e.url) t.addLink([], e.title ?? ``, e.url);
          else {
            t.rememberFolder([n]);
            for (let r of e.children ?? []) (0, scope._o)(r, [n], t);
          }
        }
      if (t.links.length === 0) throw Error(`浏览器书签里还没有任何网址书签`);
      return { source: `browser`, folders: t.folders(), links: t.links };
    };
    scope._o = function _o(e, t, n) {
      let r = (e.name ?? e.title ?? ``).trim();
      if (e.url) {
        n.addLink(t, r, e.url);
        return;
      }
      let i = r ? [...t, r] : t;
      n.rememberFolder(i);
      for (let t of e.children ?? []) (0, scope._o)(t, i, n);
    };
    scope.vo = function vo(e) {
      let t = (0, scope.yo)(),
        n = [],
        r = null,
        i = !1;
      for (let a of e.matchAll(
        /<(\/?DL)\b[^>]*>|<H3\b[^>]*>([\s\S]*?)<\/H3>|<A\b([^>]*)>([\s\S]*?)<\/A>/gi,
      )) {
        let e = a[1]?.toUpperCase();
        if (e === `DL`) {
          r &&= (n.push(r), t.rememberFolder(n), null);
          continue;
        }
        if (e === `/DL`) {
          (n.length > 0 && n.pop(), (r = null));
          continue;
        }
        if (a[2] != null) {
          r = (0, scope.xo)(a[2]);
          continue;
        }
        let o = a[3],
          s = a[4],
          c = o ? (0, scope.bo)(o, `href`) : ``;
        c && (t.addLink(n, (0, scope.xo)(s ?? ``), (0, scope.So)(c)), (i = !0));
      }
      if (!i) throw Error(`没有找到 Google/Chrome 书签链接`);
      return { source: `chrome-html`, folders: t.folders(), links: t.links };
    };
    scope.yo = function yo() {
      let e = new Map(),
        t = [];
      function n(t) {
        if (t.length === 0) return;
        let n = t.join(` / `);
        e.has(n) ||
          e.set(n, { id: n, name: t[t.length - 1] ?? n, path: n, depth: t.length, count: 0 });
      }
      function r(r, i, a) {
        let o = (0, scope.Co)(a);
        if (!o) return;
        for (let t = 1; t <= r.length; t += 1) {
          let i = r.slice(0, t);
          n(i);
          let a = e.get(i.join(` / `));
          a && (a.count += 1);
        }
        let s = r.join(` / `);
        t.push({
          id: `bookmark-${t.length + 1}`,
          name: i.trim() || o,
          url: o,
          folderId: s || `__all_bookmarks__`,
          folderPath: s,
          depth: r.length,
        });
      }
      return {
        rememberFolder: n,
        addLink: r,
        get links() {
          return t;
        },
        folders() {
          return Array.from(e.values());
        },
      };
    };
    scope.bo = function bo(e, t) {
      let n = e.match(RegExp(`\\s${t}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, `i`));
      return (0, scope.So)(n?.[1] || n?.[2] || n?.[3] || ``);
    };
    scope.xo = function xo(e) {
      return (0, scope.So)(
        e
          .replace(/<[^>]+>/g, ` `)
          .replace(/\s+/g, ` `)
          .trim(),
      );
    };
    scope.So = function So(e) {
      let t = { amp: `&`, lt: `<`, gt: `>`, quot: `"`, apos: `'`, '#39': `'`, nbsp: ` ` };
      return e.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (e, n) => {
        let r = n.toLowerCase();
        return r.startsWith(`#x`)
          ? String.fromCodePoint(Number.parseInt(r.slice(2), 16))
          : r.startsWith(`#`)
            ? String.fromCodePoint(Number.parseInt(r.slice(1), 10))
            : (t[r] ?? e);
      });
    };
    scope.Co = function Co(e) {
      try {
        let t = new URL(e);
        return t.protocol !== `http:` && t.protocol !== `https:`
          ? ``
          : ((t.hash = ``), t.toString());
      } catch {
        return ``;
      }
    };
    scope.wo = function wo(e) {
      try {
        let t = new URL(e);
        if (t.protocol !== `http:` && t.protocol !== `https:`) return null;
        let n = t.port || (t.protocol === `https:` ? `443` : `80`);
        return `${t.hostname.toLowerCase()}:${n}`;
      } catch {
        return null;
      }
    };
    scope.To = function To(e, t) {
      let n = (0, scope.wo)(e);
      if (n === null) return { kind: `none` };
      let r = t.filter((e) => (0, scope.wo)(e.loginUrl) === n);
      return r.length === 1
        ? r[0].loginUrl === e
          ? { kind: `exact`, site: r[0] }
          : { kind: `normalized`, site: r[0] }
        : r.length > 1
          ? {
              kind: `ambiguous`,
              matchKind: r.every((t) => t.loginUrl === e) ? `exact` : `normalized`,
              sites: r,
            }
          : { kind: `none` };
    };
    scope.Eo = function Eo(e) {
      let t = (0, scope.Zn)(e.url);
      if (!t) return null;
      let n = (0, scope.Sn)(),
        r = (0, scope.vn)(t) ?? (0, scope.vn)(e.name);
      return r
        ? {
            ...n,
            ...r.preset,
            name: e.name.trim() || (0, scope.Lt)(t),
            loginUrl: (0, scope._n)(t, r),
          }
        : { ...n, name: e.name.trim() || (0, scope.Lt)(t), loginUrl: t };
    };
    scope.Do = function Do(e, t, n = {}) {
      let r = {
          additions: [],
          updates: [],
          ambiguous: 0,
          duplicates: 0,
          invalid: 0,
          alreadyExists: 0,
        },
        i = new Set(),
        a = new Map();
      for (let o of e) {
        let e = (0, scope.wo)(o.loginUrl);
        if (!e) {
          r.invalid += 1;
          continue;
        }
        if (i.has(e)) {
          r.duplicates += 1;
          continue;
        }
        i.add(e);
        let s = (0, scope.To)(o.loginUrl, t);
        s.kind === `ambiguous`
          ? (r.ambiguous += 1)
          : s.kind === `none`
            ? r.additions.push(o)
            : n.overwriteExisting
              ? a.set(s.site.id, { name: o.name, loginUrl: o.loginUrl })
              : (r.alreadyExists += 1);
      }
      return ((r.updates = [...a].map(([e, t]) => ({ siteId: e, patch: t }))), r);
    };
    scope.Oo = function Oo({ sites: e, disabled: t, onImport: n }) {
      let r = (0, scope.G.useRef)(null),
        [i, a] = (0, scope.G.useState)(null),
        [s, c] = (0, scope.G.useState)(!0),
        [d, f] = (0, scope.G.useState)(``),
        [p, m] = (0, scope.G.useState)(``),
        [h, g] = (0, scope.G.useState)(``),
        [_, v] = (0, scope.G.useState)(new Set()),
        [y, b] = (0, scope.G.useState)(`skip`),
        [x, S] = (0, scope.G.useState)(1),
        [C, T] = (0, scope.G.useState)(!1);
      function E(e) {
        (a(e), m(``), g(``), v(new Set()), S(1), f(``));
      }
      async function D() {
        (c(!0), f(``));
        try {
          if (typeof chrome > `u` || !chrome.bookmarks?.getTree)
            throw Error(`当前环境读不到浏览器书签，请改用书签文件导入`);
          E({ ...(0, scope.go)(await chrome.bookmarks.getTree()), label: `浏览器书签` });
        } catch (e) {
          (a(null), f(e instanceof Error ? e.message : `读取浏览器书签失败`));
        } finally {
          c(!1);
        }
      }
      (0, scope.G.useEffect)(() => {
        D();
      }, []);
      async function k(e) {
        if (e) {
          c(!0);
          try {
            E({ ...(0, scope.mo)(await e.text()), label: e.name });
          } catch (e) {
            (a(null), f(e instanceof Error ? e.message : `无法读取书签文件`));
          } finally {
            c(!1);
          }
        }
      }
      let A = p ? p.split(` / `) : [],
        j = A.length,
        M = h.trim().length > 0,
        N = (0, scope.G.useMemo)(
          () =>
            i
              ? i.folders.filter((e) => e.depth === j + 1 && (!p || e.path.startsWith(`${p} / `)))
              : [],
          [i, j, p],
        ),
        P = (0, scope.G.useMemo)(() => {
          if (!i) return [];
          let e = h.trim().toLowerCase();
          return e
            ? i.links.filter(
                (t) =>
                  t.name.toLowerCase().includes(e) ||
                  t.url.toLowerCase().includes(e) ||
                  t.folderPath.toLowerCase().includes(e),
              )
            : i.links.filter((e) => e.folderPath === p);
        }, [i, h, p]),
        ee = (0, scope.G.useMemo)(() => i?.links.filter((e) => (0, scope.Qn)(e.url)) ?? [], [i]),
        te = (0, scope.G.useMemo)(
          () => new Map(ee.map((t) => [t.id, (0, scope.To)(t.url, e)])),
          [ee, e],
        ),
        F = (0, scope.G.useMemo)(
          () =>
            ee.filter((e) => {
              let t = te.get(e.id);
              return !t || t.kind === `ambiguous` ? !1 : y === `overwrite` || t.kind === `none`;
            }),
          [ee, te, y],
        ),
        ne = (0, scope.G.useMemo)(() => new Set(F.map((e) => e.id)), [F]),
        re = (0, scope.G.useMemo)(() => P.filter((e) => ne.has(e.id)), [P, ne]),
        I = (0, scope.G.useMemo)(() => F.filter((e) => _.has(e.id)), [F, _]),
        ie = re.filter((e) => _.has(e.id)).length,
        L = re.length > 0 && ie === re.length,
        ae = F.length > 0 && I.length === F.length,
        oe = (i?.links.length ?? 0) - ee.length,
        se = ee.filter((e) => {
          let t = te.get(e.id);
          return t && t.kind !== `none` && t.kind !== `ambiguous`;
        }).length,
        ce = ee.filter((e) => te.get(e.id)?.kind === `ambiguous`).length;
      function le(e, t) {
        (S(t), m(e), g(``));
      }
      function ue(e) {
        ne.has(e) &&
          v((t) => {
            let n = new Set(t);
            return (n.has(e) ? n.delete(e) : n.add(e), n);
          });
      }
      function de() {
        v((e) => {
          let t = new Set(e);
          for (let e of re) L ? t.delete(e.id) : t.add(e.id);
          return t;
        });
      }
      function z() {
        v((e) =>
          F.length > 0 && F.every((t) => e.has(t.id)) ? new Set() : new Set(F.map((e) => e.id)),
        );
      }
      async function V() {
        if (!(I.length === 0 || C || t)) {
          (T(!0), f(``));
          try {
            let e = [];
            for (let t of I) {
              let n = (0, scope.Eo)(t);
              n && e.push(n);
            }
            if (e.length === 0)
              throw Error(`所选书签没有可导入的 HTTPS 或本机 localhost HTTP 地址`);
            await n(e, { overwriteExisting: y === `overwrite` });
          } catch (e) {
            f(e instanceof Error ? e.message : `书签导入失败`);
          } finally {
            T(!1);
          }
        }
      }
      let H = M ? `q:${h.trim()}` : p || `__root__`;
      return (0, scope.W.jsxs)(`section`, {
        className: `overflow-hidden rounded-xl bg-ink-50 ring-1 ring-black/5 dark:bg-ink-900/60 dark:ring-white/10`,
        children: [
          (0, scope.W.jsxs)(`div`, {
            className: `flex items-center justify-between gap-2 px-3 pt-3`,
            children: [
              (0, scope.W.jsxs)(`div`, {
                className: `flex min-w-0 items-center gap-2`,
                children: [
                  (0, scope.W.jsx)(scope.w.span, {
                    initial: { rotate: -12, scale: 0.8 },
                    animate: { rotate: 0, scale: 1 },
                    transition: { type: `spring`, stiffness: 300, damping: 18 },
                    className: `flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400`,
                    children: (0, scope.W.jsx)(scope.we, { className: `size-4` }),
                  }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `min-w-0`,
                    children: [
                      (0, scope.W.jsx)(`h4`, {
                        className: `text-xs font-semibold text-ink-900 dark:text-ink-50`,
                        children: `从书签导入`,
                      }),
                      (0, scope.W.jsx)(`p`, {
                        className: `truncate text-[11px] text-ink-800/45 dark:text-ink-100/35`,
                        children: i
                          ? `${i.label} · ${i.links.length} 个链接`
                          : `与 Chrome 书签管理器结构一致`,
                      }),
                    ],
                  }),
                ],
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `flex shrink-0 items-center gap-1`,
                children: [
                  (0, scope.W.jsx)(`input`, {
                    ref: r,
                    type: `file`,
                    accept: `.html,.htm,.json`,
                    className: `hidden`,
                    onChange: (e) => {
                      (k(e.target.files?.[0]), (e.target.value = ``));
                    },
                  }),
                  (0, scope.W.jsx)(scope.w.button, {
                    whileTap: { scale: 0.9, rotate: -30 },
                    type: `button`,
                    title: `重新读取浏览器书签`,
                    disabled: t || C || s,
                    onClick: () => void D(),
                    className: `rounded-lg p-2 text-ink-800/55 hover:bg-black/5 disabled:opacity-40 dark:text-ink-100/55 dark:hover:bg-white/10`,
                    children: (0, scope.W.jsx)(scope.dt, {
                      className: (0, scope.R)(`size-4`, s && `animate-spin`),
                    }),
                  }),
                  (0, scope.W.jsx)(scope.w.button, {
                    whileTap: { scale: 0.9 },
                    type: `button`,
                    title: `从导出的书签文件导入（HTML / JSON）`,
                    disabled: t || C,
                    onClick: () => r.current?.click(),
                    className: `rounded-lg p-2 text-ink-800/55 hover:bg-black/5 disabled:opacity-40 dark:text-ink-100/55 dark:hover:bg-white/10`,
                    children: (0, scope.W.jsx)(scope.B, { className: `size-4` }),
                  }),
                ],
              }),
            ],
          }),
          (0, scope.W.jsxs)(`div`, {
            className: `space-y-2.5 p-3`,
            children: [
              d &&
                (0, scope.W.jsxs)(scope.w.div, {
                  initial: { opacity: 0, y: -6 },
                  animate: { opacity: 1, y: 0 },
                  className: `flex items-center justify-between gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-[11px] leading-relaxed text-rose-700 dark:text-rose-300`,
                  children: [
                    (0, scope.W.jsx)(`span`, { children: d }),
                    (0, scope.W.jsx)(`button`, {
                      type: `button`,
                      onClick: () => void D(),
                      className: `shrink-0 font-medium hover:underline`,
                      children: `重试`,
                    }),
                  ],
                }),
              s &&
                !i &&
                (0, scope.W.jsxs)(`div`, {
                  className: `flex items-center justify-center gap-2 py-10 text-xs text-ink-800/45 dark:text-ink-100/35`,
                  children: [
                    (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` }),
                    `正在读取浏览器书签...`,
                  ],
                }),
              i &&
                (0, scope.W.jsxs)(scope.W.Fragment, {
                  children: [
                    oe > 0 &&
                      (0, scope.W.jsxs)(`p`, {
                        className: `rounded-lg bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300`,
                        children: [
                          oe,
                          ` 个地址不符合导入安全规则，已从选择中排除（HTTPS 和本机 localhost HTTP 可导入）。`,
                        ],
                      }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-black/5 dark:bg-ink-950/40 dark:ring-white/10`,
                      children: [
                        (0, scope.W.jsxs)(`div`, {
                          className: `flex items-center gap-2 text-[11px]`,
                          children: [
                            (0, scope.W.jsx)(`span`, {
                              className: `font-medium text-ink-800/65 dark:text-ink-100/55`,
                              children: `重复站点`,
                            }),
                            (0, scope.W.jsx)(`button`, {
                              type: `button`,
                              'aria-pressed': y === `skip`,
                              onClick: () => b(`skip`),
                              className: (0, scope.R)(
                                `rounded-md px-2 py-1 transition-colors`,
                                y === `skip`
                                  ? `bg-brand-500/10 font-semibold text-brand-700 dark:text-brand-300`
                                  : `text-ink-800/50 hover:bg-ink-50 dark:text-ink-100/40 dark:hover:bg-white/5`,
                              ),
                              children: `跳过已有`,
                            }),
                            (0, scope.W.jsx)(`button`, {
                              type: `button`,
                              'aria-pressed': y === `overwrite`,
                              onClick: () => b(`overwrite`),
                              className: (0, scope.R)(
                                `rounded-md px-2 py-1 transition-colors`,
                                y === `overwrite`
                                  ? `bg-brand-500/10 font-semibold text-brand-700 dark:text-brand-300`
                                  : `text-ink-800/50 hover:bg-ink-50 dark:text-ink-100/40 dark:hover:bg-white/5`,
                              ),
                              children: `更新已有站点`,
                            }),
                          ],
                        }),
                        (0, scope.W.jsxs)(`span`, {
                          className: `text-[10px] text-ink-800/40 dark:text-ink-100/30`,
                          children: [
                            `更新只替换名称和登录地址，保留原配置 · 已匹配 `,
                            se,
                            ` · 歧义 `,
                            ce,
                          ],
                        }),
                      ],
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `relative`,
                      children: [
                        (0, scope.W.jsx)(scope.l, {
                          className: `pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-800/30 dark:text-ink-100/25`,
                        }),
                        (0, scope.W.jsx)(`input`, {
                          className: `h-9 w-full rounded-lg bg-white pl-8 pr-2.5 text-xs text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/45 dark:bg-ink-950/40 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                          value: h,
                          onChange: (e) => g(e.target.value),
                          placeholder: `搜索全部书签：站点名 / 域名 / 文件夹`,
                        }),
                      ],
                    }),
                    !M &&
                      (0, scope.W.jsxs)(`div`, {
                        className: `flex items-center gap-1 overflow-x-auto whitespace-nowrap text-[11px]`,
                        children: [
                          (0, scope.W.jsxs)(`button`, {
                            type: `button`,
                            onClick: () => le(``, -1),
                            className: (0, scope.R)(
                              `flex items-center gap-1 rounded-md px-1.5 py-1 font-medium transition-colors`,
                              A.length === 0
                                ? `text-ink-900 dark:text-ink-50`
                                : `text-brand-600 hover:bg-brand-500/10 dark:text-brand-400`,
                            ),
                            children: [
                              (0, scope.W.jsx)(scope.Ve, { className: `size-3` }),
                              `全部书签`,
                            ],
                          }),
                          A.map((e, t) =>
                            (0, scope.W.jsxs)(
                              scope.G.Fragment,
                              {
                                children: [
                                  (0, scope.W.jsx)(scope.ke, {
                                    className: `size-3 shrink-0 text-ink-800/25 dark:text-ink-100/20`,
                                  }),
                                  t === A.length - 1
                                    ? (0, scope.W.jsx)(`span`, {
                                        className: `px-1.5 py-1 font-medium text-ink-900 dark:text-ink-50`,
                                        children: e,
                                      })
                                    : (0, scope.W.jsx)(`button`, {
                                        type: `button`,
                                        onClick: () => le(A.slice(0, t + 1).join(` / `), -1),
                                        className: `rounded-md px-1.5 py-1 font-medium text-brand-600 transition-colors hover:bg-brand-500/10 dark:text-brand-400`,
                                        children: e,
                                      }),
                                ],
                              },
                              t,
                            ),
                          ),
                        ],
                      }),
                    (0, scope.W.jsx)(`div`, {
                      className: `overflow-hidden rounded-lg bg-white ring-1 ring-black/5 dark:bg-ink-950/40 dark:ring-white/10`,
                      children: (0, scope.W.jsx)(scope.O, {
                        mode: `wait`,
                        initial: !1,
                        children: (0, scope.W.jsxs)(
                          scope.w.div,
                          {
                            initial: { opacity: 0, x: 26 * x },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: -26 * x },
                            transition: { duration: 0.16, ease: `easeOut` },
                            className: `max-h-56 overflow-y-auto`,
                            children: [
                              !M &&
                                N.map((e, t) =>
                                  (0, scope.W.jsxs)(
                                    scope.w.button,
                                    {
                                      type: `button`,
                                      initial: { opacity: 0, y: 6 },
                                      animate: { opacity: 1, y: 0 },
                                      transition: { delay: Math.min(t * 0.03, 0.24) },
                                      onClick: () => le(e.path, 1),
                                      className: `flex w-full items-center gap-2.5 border-b border-black/5 px-3 py-2 text-left transition-colors hover:bg-ink-50 dark:border-white/5 dark:hover:bg-white/[0.04]`,
                                      children: [
                                        (0, scope.W.jsx)(`span`, {
                                          className: `flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400`,
                                          children: (0, scope.W.jsx)(scope.Le, {
                                            className: `size-3.5`,
                                          }),
                                        }),
                                        (0, scope.W.jsx)(`span`, {
                                          className: `min-w-0 flex-1 truncate text-xs font-medium text-ink-900 dark:text-ink-50`,
                                          children: e.name,
                                        }),
                                        (0, scope.W.jsxs)(`span`, {
                                          className: `shrink-0 text-[10px] text-ink-800/35 dark:text-ink-100/25`,
                                          children: [e.count, ` 个链接`],
                                        }),
                                        (0, scope.W.jsx)(scope.ke, {
                                          className: `size-3.5 shrink-0 text-ink-800/25 dark:text-ink-100/20`,
                                        }),
                                      ],
                                    },
                                    e.id,
                                  ),
                                ),
                              P.map((e, t) => {
                                let n = te.get(e.id),
                                  r = (0, scope.Qn)(e.url),
                                  i = n?.kind === `ambiguous`,
                                  a = !!n && n.kind !== `none` && !i,
                                  o = r && !i && (y === `overwrite` || !a),
                                  s = r
                                    ? i
                                      ? `匹配到 ${n.sites.length} 个相同地址的站点，请先整理重复项`
                                      : a
                                        ? y === `overwrite`
                                          ? `将更新「${n.site.name}」的名称和登录地址`
                                          : `站点已存在；选择“更新已有站点”可覆盖名称和登录地址`
                                        : `将新建站点`
                                    : `请使用 HTTPS（本机 localhost 可使用 HTTP）`;
                                return (0, scope.W.jsx)(
                                  scope.w.div,
                                  {
                                    initial: { opacity: 0, y: 6 },
                                    animate: { opacity: 1, y: 0 },
                                    transition: { delay: Math.min((N.length + t) * 0.03, 0.3) },
                                    children: (0, scope.W.jsx)(scope.ko, {
                                      link: e,
                                      checked: _.has(e.id),
                                      selectable: o,
                                      detail: s,
                                      onToggle: () => ue(e.id),
                                    }),
                                  },
                                  e.id,
                                );
                              }),
                              !M &&
                                N.length === 0 &&
                                P.length === 0 &&
                                (0, scope.W.jsx)(`div`, {
                                  className: `px-3 py-8 text-center text-xs text-ink-800/40 dark:text-ink-100/30`,
                                  children: `这个文件夹是空的`,
                                }),
                              M &&
                                P.length === 0 &&
                                (0, scope.W.jsx)(`div`, {
                                  className: `px-3 py-8 text-center text-xs text-ink-800/40 dark:text-ink-100/30`,
                                  children: `没有匹配的书签`,
                                }),
                            ],
                          },
                          H,
                        ),
                      }),
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5`,
                      children: [
                        (0, scope.W.jsxs)(`div`, {
                          className: `flex flex-wrap items-center gap-x-3 gap-y-1`,
                          children: [
                            (0, scope.W.jsxs)(`button`, {
                              type: `button`,
                              onClick: z,
                              disabled: !F.length || C || t,
                              className: `inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-600 hover:underline disabled:opacity-40 dark:text-brand-400`,
                              children: [
                                ae
                                  ? (0, scope.W.jsx)(scope.o, { className: `size-3.5` })
                                  : (0, scope.W.jsx)(scope.ve, { className: `size-3.5` }),
                                ae ? `取消全选` : `全选全部书签`,
                              ],
                            }),
                            (0, scope.W.jsxs)(`button`, {
                              type: `button`,
                              onClick: de,
                              disabled: re.length === 0 || C || t,
                              className: `inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-600 hover:underline disabled:opacity-40 dark:text-brand-400`,
                              children: [
                                L
                                  ? (0, scope.W.jsx)(scope.o, { className: `size-3.5` })
                                  : (0, scope.W.jsx)(scope.ve, { className: `size-3.5` }),
                                L ? `取消当前列表` : `选择当前列表`,
                              ],
                            }),
                          ],
                        }),
                        (0, scope.W.jsxs)(`span`, {
                          className: `text-[11px] text-ink-800/45 dark:text-ink-100/35`,
                          children: [
                            `已选 `,
                            I.length,
                            ` / 可选择 `,
                            F.length,
                            ` · 共 `,
                            i.links.length,
                          ],
                        }),
                      ],
                    }),
                    (0, scope.W.jsxs)(scope.w.button, {
                      whileTap: { scale: 0.98 },
                      type: `button`,
                      disabled: I.length === 0 || C || t,
                      onClick: V,
                      className: `inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-600 disabled:opacity-40 disabled:shadow-none`,
                      children: [
                        (0, scope.W.jsx)(scope.B, { className: `size-4` }),
                        C ? `导入中...` : `导入选中站点 (${I.length})`,
                      ],
                    }),
                  ],
                }),
            ],
          }),
        ],
      });
    };
    scope.Io = function Io(e) {
      return [`form`, `github`, `oauth`, `passkey`, `manual`].includes(e);
    };
    scope.Ro = function Ro({ form: e, onChange: t }) {
      let n = e.loginMethod ?? `form`,
        r = (0, scope.Io)(n) ? null : n;
      return (0, scope.W.jsxs)(scope.W.Fragment, {
        children: [
          (0, scope.W.jsxs)(`div`, {
            className: `space-y-2`,
            children: [
              (0, scope.W.jsx)(`span`, {
                className: `text-xs font-medium text-ink-800/70 dark:text-ink-100/60`,
                children: `登录方式`,
              }),
              (0, scope.W.jsx)(`div`, {
                className: `grid gap-2`,
                children: scope.Po.map((e) =>
                  (0, scope.W.jsxs)(
                    `button`,
                    {
                      type: `button`,
                      onClick: () => t({ loginMethod: e.value }),
                      className: (0, scope.R)(
                        `flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors`,
                        n === e.value
                          ? `bg-brand-500/10 ring-2 ring-brand-500/50`
                          : `bg-ink-50 ring-1 ring-black/5 hover:bg-ink-100 dark:bg-ink-900 dark:ring-white/10`,
                      ),
                      children: [
                        (0, scope.W.jsx)(`span`, {
                          className: (0, scope.R)(
                            `mt-0.5 size-3.5 shrink-0 rounded-full ring-2 transition-colors`,
                            n === e.value
                              ? `bg-brand-500 ring-brand-500/40`
                              : `ring-black/15 dark:ring-white/20`,
                          ),
                        }),
                        (0, scope.W.jsxs)(`span`, {
                          className: `min-w-0`,
                          children: [
                            (0, scope.W.jsx)(`span`, {
                              className: `block text-xs font-medium text-ink-900 dark:text-ink-50`,
                              children: e.label,
                            }),
                            (0, scope.W.jsx)(`span`, {
                              className: `block text-[11px] text-ink-800/50 dark:text-ink-100/40`,
                              children: e.description,
                            }),
                          ],
                        }),
                      ],
                    },
                    e.value,
                  ),
                ),
              }),
              r &&
                (0, scope.W.jsxs)(`p`, {
                  role: `status`,
                  className: `text-[11px] text-ink-800/45 dark:text-ink-100/40`,
                  children: [`当前兼容配置：`, scope.Fo[r]],
                }),
            ],
          }),
          (n === `oauth` || n === `github` || n === `passkey` || n === `auto`) &&
            (0, scope.W.jsxs)(scope.w.div, {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: `auto` },
              className: `space-y-3 overflow-hidden rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
              children: [
                (0, scope.W.jsx)(scope.Q, {
                  label:
                    n === `passkey`
                      ? `Passkey 按钮选择器`
                      : n === `github`
                        ? `GitHub 按钮选择器`
                        : `OAuth 按钮选择器`,
                  hint:
                    n === `oauth`
                      ? `可选。留空会自动识别 GitHub/SSO 按钮；识别不准时再填精确选择器`
                      : n === `passkey`
                        ? `可选。留空会自动识别 Passkey 按钮`
                        : `可选。留空会自动识别 GitHub OAuth 按钮`,
                  children: (0, scope.W.jsx)(`input`, {
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    placeholder: `text=使用 GitHub 继续, .oauth-github`,
                    value: e.oauthButtonSelector ?? ``,
                    onChange: (e) => t({ oauthButtonSelector: e.target.value }),
                  }),
                }),
                (0, scope.W.jsxs)(`p`, {
                  className: `text-[11px] leading-relaxed text-amber-700 dark:text-amber-400`,
                  children: [
                    n === `github` &&
                      `站点会点站点的 OAuth 按钮跳到 GitHub；扩展在 GitHub 登录页自动填 GitHub 账密。`,
                    n === `passkey` &&
                      `Passkey 会触发浏览器/系统原生确认；扩展不会保存或模拟 Passkey 私钥。`,
                    n === `oauth` &&
                      `OAuth 会优先使用上面的选择器；留空时会自动寻找 GitHub / Google / LinuxDO / SSO 登录按钮。浏览器里需要已经登录过对应平台，否则会停在授权页等你手动操作。`,
                  ],
                }),
              ],
            }),
          n === `token` &&
            (0, scope.W.jsxs)(scope.w.div, {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: `auto` },
              className: `space-y-3 overflow-hidden rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
              children: [
                (0, scope.W.jsx)(scope.Q, {
                  label: `Token 存储键名`,
                  hint: `必填。站点把 token 存在哪个键下，F12 → Application → Local Storage 里能看到`,
                  children: (0, scope.W.jsx)(`input`, {
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    placeholder: `auth_token`,
                    value: e.tokenConfig?.storageKey ?? ``,
                    onChange: (n) =>
                      t({
                        tokenConfig: { ...scope.Lo, ...e.tokenConfig, storageKey: n.target.value },
                      }),
                  }),
                }),
                (0, scope.W.jsx)(scope.Q, {
                  label: `存储位置`,
                  hint: `多数站点用 localStorage；关掉标签页就失效的站点用 sessionStorage`,
                  children: (0, scope.W.jsxs)(`select`, {
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    value: e.tokenConfig?.storageType ?? `localStorage`,
                    onChange: (n) =>
                      t({
                        tokenConfig: { ...scope.Lo, ...e.tokenConfig, storageType: n.target.value },
                      }),
                    children: [
                      (0, scope.W.jsx)(`option`, {
                        value: `localStorage`,
                        children: `localStorage`,
                      }),
                      (0, scope.W.jsx)(`option`, {
                        value: `sessionStorage`,
                        children: `sessionStorage`,
                      }),
                    ],
                  }),
                }),
                (0, scope.W.jsx)(scope.Q, {
                  label: `请求头名称`,
                  hint: `必填。验证身份时用哪个头发 token，一般是 Authorization`,
                  children: (0, scope.W.jsx)(`input`, {
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    placeholder: `Authorization`,
                    value: e.tokenConfig?.headerName ?? ``,
                    onChange: (n) =>
                      t({
                        tokenConfig: { ...scope.Lo, ...e.tokenConfig, headerName: n.target.value },
                      }),
                  }),
                }),
                (0, scope.W.jsx)(scope.Q, {
                  label: `请求头前缀`,
                  hint: `一般是 Bearer 加一个空格；有的站点不需要前缀，留空即可`,
                  children: (0, scope.W.jsx)(`input`, {
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    placeholder: `Bearer `,
                    value: e.tokenConfig?.headerPrefix ?? ``,
                    onChange: (n) =>
                      t({
                        tokenConfig: {
                          ...scope.Lo,
                          ...e.tokenConfig,
                          headerPrefix: n.target.value,
                        },
                      }),
                  }),
                }),
                (0, scope.W.jsx)(scope.Q, {
                  label: `身份接口`,
                  hint: `可选。留空会依次试 /api/user/self、/api/user/info、/api/v1/auth/me`,
                  children: (0, scope.W.jsx)(`input`, {
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    placeholder: `/api/v1/auth/me`,
                    value: e.tokenConfig?.identityEndpoint ?? ``,
                    onChange: (n) =>
                      t({
                        tokenConfig: {
                          ...scope.Lo,
                          ...e.tokenConfig,
                          identityEndpoint: n.target.value,
                        },
                      }),
                  }),
                }),
                (0, scope.W.jsx)(`p`, {
                  className: `text-[11px] leading-relaxed text-amber-700 dark:text-amber-400`,
                  children: `Token 填在**每个账号**的设置里，这里只描述站点怎么存和怎么用。 同一站点的多个账号各自持有独立 token，切换时会自动覆盖。`,
                }),
              ],
            }),
          (0, scope.W.jsx)(scope.Q, {
            label: `登录成功标志选择器`,
            hint: `可选。只在登录后才出现的元素（控制台导航、头像菜单等）。打开站点时用它判断是否已经登录、提交登录后用它确认成功；留空则看登录表单是否消失、是否离开登录页`,
            children: (0, scope.W.jsx)(`input`, {
              className: scope.$,
              placeholder: `.dashboard, #user-avatar`,
              value: e.successIndicator ?? ``,
              onChange: (e) => t({ successIndicator: e.target.value }),
            }),
          }),
          (0, scope.W.jsxs)(`div`, {
            className: `space-y-3 rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
            children: [
              (0, scope.W.jsx)(`span`, {
                className: `text-xs font-medium text-ink-800/70 dark:text-ink-100/60`,
                children: `统一账号身份识别（可选配置）`,
              }),
              (0, scope.W.jsx)(`p`, {
                className: `text-[11px] leading-relaxed text-ink-800/50 dark:text-ink-100/40`,
                children: `所有站点共用同一套身份核验。默认读取当前用户接口和明确的个人资料字段；接口读不到时，可自动进入本站资料页。这里只补充本站的读取位置，用户 ID、完整登录名和邮箱保存在每个账号中。`,
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `身份资料页`,
                hint: `可选。填写本站显示当前用户 ID 或登录名的页面；接口字段不足时自动进入这里核对。也会识别页面导航中的「个人资料 / 个人设置」入口`,
                children: (0, scope.W.jsx)(`input`, {
                  className: scope.$,
                  placeholder: `/console/personal`,
                  value: e.identitySource?.pagePath ?? ``,
                  onChange: (n) =>
                    t({ identitySource: { ...e.identitySource, pagePath: n.target.value } }),
                }),
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `身份存储键`,
                hint: `可选。本站保存用户信息 JSON 的键名；只用于提供接口需要的当前用户提示，不直接作为登录身份的证明`,
                children: (0, scope.W.jsx)(`input`, {
                  className: scope.$,
                  placeholder: `auth-user`,
                  value: e.identitySource?.storageKey ?? ``,
                  onChange: (n) =>
                    t({ identitySource: { ...e.identitySource, storageKey: n.target.value } }),
                }),
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `身份存储位置`,
                hint: `可选。不确定就留在「自动」：依次查 localStorage 和 sessionStorage`,
                children: (0, scope.W.jsxs)(`select`, {
                  className: scope.$,
                  value: e.identitySource?.storageType ?? ``,
                  onChange: (n) =>
                    t({
                      identitySource: {
                        ...e.identitySource,
                        storageType: n.target.value || void 0,
                      },
                    }),
                  children: [
                    (0, scope.W.jsx)(`option`, { value: ``, children: `自动（推荐）` }),
                    (0, scope.W.jsx)(`option`, { value: `localStorage`, children: `localStorage` }),
                    (0, scope.W.jsx)(`option`, {
                      value: `sessionStorage`,
                      children: `sessionStorage`,
                    }),
                  ],
                }),
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `当前用户接口`,
                hint: `可选。本站接口填写 /api/user/self 这样的路径，使用当前登录会话读取；父 / 子域接口使用 HTTPS 并配置下方 Token。只读取当前用户，不填写用户列表接口`,
                children: (0, scope.W.jsx)(`input`, {
                  className: scope.$,
                  placeholder: `https://server.orevx.ai/api/user/me`,
                  value: e.identitySource?.endpoint ?? ``,
                  onChange: (n) =>
                    t({ identitySource: { ...e.identitySource, endpoint: n.target.value } }),
                }),
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `接口 Token 存储键`,
                hint: `父 / 子域接口必填。同源接口通常留空；只在本站明确使用 Token 认证时填写，如 auth-token`,
                children: (0, scope.W.jsx)(`input`, {
                  className: scope.$,
                  placeholder: `auth-token`,
                  value: e.identitySource?.tokenKey ?? ``,
                  onChange: (n) =>
                    t({ identitySource: { ...e.identitySource, tokenKey: n.target.value } }),
                }),
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `Token 存储位置`,
                hint: `可选。不确定就留在「自动」`,
                children: (0, scope.W.jsxs)(`select`, {
                  className: scope.$,
                  value: e.identitySource?.tokenStorageType ?? ``,
                  onChange: (n) =>
                    t({
                      identitySource: {
                        ...e.identitySource,
                        tokenStorageType: n.target.value || void 0,
                      },
                    }),
                  children: [
                    (0, scope.W.jsx)(`option`, { value: ``, children: `自动（推荐）` }),
                    (0, scope.W.jsx)(`option`, { value: `localStorage`, children: `localStorage` }),
                    (0, scope.W.jsx)(`option`, {
                      value: `sessionStorage`,
                      children: `sessionStorage`,
                    }),
                  ],
                }),
              }),
              (0, scope.W.jsxs)(`details`, {
                className: `space-y-3`,
                children: [
                  (0, scope.W.jsx)(`summary`, {
                    className: `cursor-pointer text-xs text-ink-800/60 dark:text-ink-100/50`,
                    children: `身份字段与已学习的读取位置`,
                  }),
                  ...[
                    [`userId`, `用户 ID`],
                    [`username`, `真实登录名`],
                    [`email`, `完整邮箱`],
                  ].flatMap(([field, label]) => [
                    (0, scope.W.jsx)(
                      scope.Q,
                      {
                        label: `${label}接口字段`,
                        hint: `可选。本站接口字段名称不常见时填写 JSON 路径，例如 data.account.uid`,
                        children: (0, scope.W.jsx)(`input`, {
                          className: scope.$,
                          placeholder: field === `userId` ? `data.user.id` : `data.user.${field}`,
                          value: e.identitySource?.responseFields?.[field] ?? ``,
                          onChange: (n) =>
                            t({
                              identitySource: {
                                ...e.identitySource,
                                responseFields: {
                                  ...e.identitySource?.responseFields,
                                  [field]: n.target.value,
                                },
                              },
                            }),
                        }),
                      },
                      `${field}-response`,
                    ),
                    (0, scope.W.jsx)(
                      scope.Q,
                      {
                        label: `${label}页面字段`,
                        hint: `学习时点选自己的身份值，会自动记录这个位置。也可填写只指向当前用户资料的 CSS 选择器`,
                        children: (0, scope.W.jsx)(`input`, {
                          className: scope.$,
                          placeholder:
                            field === `userId` ? `#profile-user-id` : `#profile-${field}`,
                          value: e.identitySource?.pageFields?.[field] ?? ``,
                          onChange: (n) =>
                            t({
                              identitySource: {
                                ...e.identitySource,
                                pageFields: {
                                  ...e.identitySource?.pageFields,
                                  [field]: n.target.value,
                                },
                                pageFieldRules: {
                                  ...e.identitySource?.pageFieldRules,
                                  [field]: void 0,
                                },
                              },
                            }),
                        }),
                      },
                      `${field}-page`,
                    ),
                    (0, scope.W.jsx)(
                      scope.Q,
                      {
                        label: `${label}标签前缀`,
                        hint: `点选时自动学习。例如页面显示「ID: 123」，这里只保存「ID: 」；账号自己的身份值单独保存`,
                        children: (0, scope.W.jsx)(`input`, {
                          className: scope.$,
                          placeholder: field === `userId` ? `ID: ` : `没有标签时留空`,
                          value: e.identitySource?.pageFieldRules?.[field]?.prefix ?? ``,
                          onChange: (n) =>
                            t({
                              identitySource: {
                                ...e.identitySource,
                                pageFieldRules: {
                                  ...e.identitySource?.pageFieldRules,
                                  [field]: {
                                    kind: `text`,
                                    ...e.identitySource?.pageFieldRules?.[field],
                                    prefix: n.target.value,
                                  },
                                },
                              },
                            }),
                        }),
                      },
                      `${field}-prefix`,
                    ),
                  ]),
                ],
              }),
            ],
          }),
          (0, scope.W.jsx)(scope.Q, {
            label: `令牌引导接口`,
            hint: `可选。站点用「会话 cookie 换短命 Bearer 令牌」时填（新版 new-api 分叉常见，如一梦五千年的 /api/user/auth/refresh）。填了之后，扩展读余额与身份之前会先换一枚令牌再用 —— 否则这类站点的接口一律 401，余额和签到前后的快照都读不到。只允许本站同源地址`,
            children: (0, scope.W.jsx)(`input`, {
              className: scope.$,
              placeholder: `/api/user/auth/refresh`,
              value: e.authBootstrap?.endpoint ?? ``,
              onChange: (n) =>
                t({
                  authBootstrap: n.target.value.trim()
                    ? { ...e.authBootstrap, endpoint: n.target.value }
                    : void 0,
                }),
            }),
          }),
          (0, scope.W.jsx)(scope.Q, {
            label: `退出接口`,
            hint: `强烈建议填。同站多账号切换时，只有调它才能清掉服务端 cookie；不填则改用重载登录页，部分站点会失败`,
            children: (0, scope.W.jsx)(`input`, {
              className: scope.$,
              placeholder: `/api/user/logout`,
              value: e.logoutApiUrl ?? ``,
              onChange: (e) => t({ logoutApiUrl: e.target.value }),
            }),
          }),
          (n === `form` || n === `auto`) &&
            (0, scope.W.jsx)(scope.Q, {
              label: `展开表单的前置点击`,
              hint: `可选。新版 new-api 登录页要先点「使用 邮箱或用户名 登录」才出现账密框。可写 text=按钮文字`,
              children: (0, scope.W.jsx)(`input`, {
                className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                placeholder: `text=使用 邮箱或用户名 登录`,
                value: e.preLoginClickSelector ?? ``,
                onChange: (e) => t({ preLoginClickSelector: e.target.value }),
              }),
            }),
        ],
      });
    };
    scope.zo = function zo({ form: e, advanced: t, onToggle: n, onChange: r }) {
      return (0, scope.W.jsxs)(scope.W.Fragment, {
        children: [
          (0, scope.W.jsxs)(`button`, {
            type: `button`,
            onClick: n,
            className: `text-xs font-medium text-brand-600 hover:underline dark:text-brand-400`,
            children: [t ? `收起` : `展开`, `登录表单选择器`],
          }),
          t &&
            (0, scope.W.jsxs)(scope.w.div, {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: `auto` },
              className: `space-y-3 overflow-hidden rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
              children: [
                (0, scope.W.jsx)(scope.Q, {
                  label: `用户名输入框选择器`,
                  children: (0, scope.W.jsx)(`input`, {
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    value: e.selectors.username,
                    onChange: (t) => r({ selectors: { ...e.selectors, username: t.target.value } }),
                  }),
                }),
                (0, scope.W.jsx)(scope.Q, {
                  label: `密码输入框选择器`,
                  children: (0, scope.W.jsx)(`input`, {
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    value: e.selectors.password,
                    onChange: (t) => r({ selectors: { ...e.selectors, password: t.target.value } }),
                  }),
                }),
                (0, scope.W.jsx)(scope.Q, {
                  label: `登录按钮选择器`,
                  children: (0, scope.W.jsx)(`input`, {
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    value: e.selectors.submit,
                    onChange: (t) => r({ selectors: { ...e.selectors, submit: t.target.value } }),
                  }),
                }),
                (0, scope.W.jsx)(scope.Q, {
                  label: `公告弹窗关闭选择器`,
                  hint: `每行一个，已预填常见中转站的通用选择器`,
                  children: (0, scope.W.jsx)(`textarea`, {
                    rows: 4,
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    value: (e.closeModalSelectors ?? []).join(`
`),
                    onChange: (e) =>
                      r({
                        closeModalSelectors: e.target.value
                          .split(
                            `
`,
                          )
                          .map((e) => e.trim())
                          .filter(Boolean),
                      }),
                  }),
                }),
                (0, scope.W.jsx)(`button`, {
                  type: `button`,
                  onClick: () => r({ closeModalSelectors: [...scope.Rt] }),
                  className: `text-xs text-brand-600 hover:underline dark:text-brand-400`,
                  children: `重置为通用选择器`,
                }),
              ],
            }),
        ],
      });
    };
    scope.Bo = function Bo({ form: e, proxies: t, onChange: n, onUrlSettled: r }) {
      let i = t.filter((e) => e.nameOnly !== !0);
      return (0, scope.W.jsxs)(scope.W.Fragment, {
        children: [
          (0, scope.W.jsx)(scope.Q, {
            label: `登录页地址`,
            hint: `必填，例如 https://api.example.com/login`,
            children: (0, scope.W.jsx)(`input`, {
              className: scope.$,
              placeholder: `https://...`,
              value: e.loginUrl,
              onChange: (e) => n({ loginUrl: e.target.value }),
              onBlur: (e) => r?.(e.target.value),
            }),
          }),
          (0, scope.W.jsx)(scope.Q, {
            label: `站点名称`,
            hint: `留空则自动使用域名`,
            children: (0, scope.W.jsx)(`input`, {
              className: scope.$,
              placeholder: `我的中转站`,
              value: e.name,
              onChange: (e) => n({ name: e.target.value }),
            }),
          }),
          (0, scope.W.jsx)(scope.Q, {
            label: `访问代理`,
            hint: i.length
              ? `默认跟随 Chrome；只有需要强制指定出口时才选择`
              : `默认跟随 Chrome/系统网络设置`,
            children: (0, scope.W.jsxs)(`select`, {
              className: scope.$,
              value: e.proxyId ?? ``,
              onChange: (e) => n({ proxyId: e.target.value || void 0 }),
              children: [
                (0, scope.W.jsx)(`option`, { value: ``, children: `跟随 Chrome/系统代理（推荐）` }),
                e.proxyId &&
                  t.find((t) => t.id === e.proxyId)?.nameOnly &&
                  (0, scope.W.jsxs)(`option`, {
                    value: e.proxyId,
                    disabled: !0,
                    children: [t.find((t) => t.id === e.proxyId)?.name, `（仅名称，无出口）`],
                  }),
                i.map((e) =>
                  (0, scope.W.jsxs)(
                    `option`,
                    {
                      value: e.id,
                      children: [e.name, ` — `, (0, scope.de)(e), `://`, e.host, `:`, e.port],
                    },
                    e.id,
                  ),
                ),
              ],
            }),
          }),
        ],
      });
    };
    scope.Vo = function Vo({
      open: e,
      mode: t,
      editing: n,
      accountSetupRequested: r,
      sites: i,
      proxies: a,
      onClose: o,
      onSubmit: s,
      onSubmitAndAddAccount: c,
      onSubmitMany: l,
    }) {
      let [d, f] = (0, scope.G.useState)((0, scope.Sn)()),
        [p, m] = (0, scope.G.useState)(!1),
        [h, g] = (0, scope.G.useState)(!1),
        [_, v] = (0, scope.G.useState)(``),
        [y, b] = (0, scope.G.useState)(null),
        [x, S] = (0, scope.G.useState)(null),
        [C, T] = (0, scope.G.useState)(!1),
        E = (0, scope.G.useRef)(``);
      (0, scope.G.useEffect)(() => {
        e &&
          (f(n ? { ...n } : (0, scope.Sn)()),
          m(!!n),
          v(``),
          b(null),
          S(null),
          T(!1),
          (E.current = ``));
      }, [e, n]);
      let D = async (e) => {
          let t = e.trim();
          if (t && !n && t !== E.current) {
            ((E.current = t), T(!0));
            try {
              let e = await (0, scope.H)({ type: `PROBE_SITE`, url: t }),
                n = e.ok ? e.feature?.probe : void 0;
              if (!n || !n.preset) {
                S(null);
                return;
              }
              (b(n.templateLabel ?? null), S(n.evidence));
              let r = (0, scope._n)(
                t,
                (n.templateId ? scope.dn.find((e) => e.id === n.templateId) : void 0) ??
                  (0, scope.vn)(t),
              );
              f((e) => ({ ...e, ...n.preset, name: e.name, loginUrl: r }));
            } finally {
              T(!1);
            }
          }
        },
        O = d.loginUrl.trim().length > 0,
        k = (e) => {
          let t = { ...d, ...e };
          if (!n && e.loginUrl !== void 0 && !y) {
            let n = (0, scope.vn)(e.loginUrl);
            if (n) {
              let r = (0, scope._n)(e.loginUrl, n);
              (b(n.label), f({ ...t, ...n.preset, name: t.name, loginUrl: r }));
              return;
            }
          }
          f(t);
        },
        j = (e) => f({ ...d, checkin: { ...(d.checkin ?? { method: `auto` }), ...e } });
      async function M(e = !1) {
        if (!(!O || h || C)) {
          (g(!0), v(``));
          try {
            let t = { ...d, name: d.name.trim() || (0, scope.Lt)(d.loginUrl) };
            (e && c ? await c(t) : await s(t), o());
          } catch (e) {
            v(e instanceof Error ? e.message : `站点保存失败`);
          } finally {
            g(!1);
          }
        }
      }
      async function N(e, t) {
        if (!(e.length === 0 || h)) {
          (g(!0), v(``));
          try {
            if (!l) throw Error(`批量书签导入不可用`);
            (await l(e, t), o());
          } catch (e) {
            v(e instanceof Error ? e.message : `书签导入失败`);
          } finally {
            g(!1);
          }
        }
      }
      return (0, scope.W.jsx)(scope.uo, {
        open: e,
        title: n
          ? `编辑站点`
          : t === `import`
            ? `从书签导入站点`
            : r
              ? `先添加所属站点`
              : `添加站点`,
        onClose: () => !h && o(),
        wide: !n && t === `import`,
        children: (0, scope.W.jsx)(`div`, {
          className: `space-y-4`,
          children:
            !n && t === `import`
              ? (0, scope.W.jsxs)(scope.W.Fragment, {
                  children: [
                    (0, scope.W.jsx)(scope.Oo, { sites: i, disabled: h, onImport: N }),
                    _ &&
                      (0, scope.W.jsx)(`p`, {
                        role: `alert`,
                        className: `text-xs text-rose-600 dark:text-rose-400`,
                        children: _,
                      }),
                  ],
                })
              : (0, scope.W.jsxs)(scope.W.Fragment, {
                  children: [
                    r &&
                      !n &&
                      (0, scope.W.jsx)(`div`, {
                        className: `rounded-lg border border-brand-500/15 bg-brand-500/[0.06] px-3 py-2 text-xs leading-relaxed text-ink-800/70 dark:border-brand-400/15 dark:bg-brand-400/[0.08] dark:text-ink-100/65`,
                        children: `添加账号需要先选择所属站点。保存这个站点后，将继续填写账号信息。`,
                      }),
                    (0, scope.W.jsx)(scope.Bo, {
                      form: d,
                      proxies: a,
                      onChange: k,
                      onUrlSettled: (e) => void D(e),
                    }),
                    C &&
                      (0, scope.W.jsxs)(`div`, {
                        className: `flex items-center gap-2 rounded-lg bg-ink-100/70 px-3 py-2 text-[11px] text-ink-800/60 dark:bg-white/8 dark:text-ink-100/50`,
                        children: [
                          (0, scope.W.jsx)(scope.u, {
                            className: `size-3.5 shrink-0 animate-spin`,
                          }),
                          (0, scope.W.jsx)(`span`, { children: `正在识别站点系统…` }),
                        ],
                      }),
                    !C &&
                      y &&
                      (0, scope.W.jsxs)(`div`, {
                        className: `flex items-start gap-2 rounded-lg bg-brand-500/8 px-3 py-2 text-[11px] text-brand-700 dark:text-brand-300`,
                        children: [
                          (0, scope.W.jsx)(scope.A, { className: `mt-px size-3.5 shrink-0` }),
                          (0, scope.W.jsxs)(`span`, {
                            children: [
                              `已识别为 `,
                              (0, scope.W.jsx)(`strong`, { className: `font-medium`, children: y }),
                              `， 已自动填好本站适配设置。自动识别与学习流程回放可在下方独立选择。`,
                              x &&
                                (0, scope.W.jsxs)(`span`, {
                                  className: `mt-0.5 block opacity-60`,
                                  children: [`依据：`, x],
                                }),
                            ],
                          }),
                        ],
                      }),
                    (0, scope.W.jsx)(scope.Ro, { form: d, onChange: k }),
                    (0, scope.W.jsx)(scope.Mo, { form: d, onChange: j }),
                    (0, scope.W.jsx)(scope.zo, {
                      form: d,
                      advanced: p,
                      onToggle: () => m(!p),
                      onChange: k,
                    }),
                    _ &&
                      (0, scope.W.jsx)(`p`, {
                        role: `alert`,
                        className: `text-xs text-rose-600 dark:text-rose-400`,
                        children: _,
                      }),
                    n
                      ? (0, scope.W.jsxs)(scope.w.button, {
                          whileTap: { scale: 0.98 },
                          type: `button`,
                          disabled: !O || h,
                          onClick: () => void M(),
                          className: `${scope.fo} inline-flex items-center justify-center gap-1.5`,
                          children: [
                            h
                              ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` })
                              : (0, scope.W.jsx)(scope.pt, { className: `size-4` }),
                            h ? `保存中...` : `保存修改`,
                          ],
                        })
                      : (0, scope.W.jsxs)(`div`, {
                          className: `grid gap-2 sm:grid-cols-2`,
                          children: [
                            (0, scope.W.jsxs)(scope.w.button, {
                              whileTap: { scale: 0.98 },
                              type: `button`,
                              disabled: !O || h || C,
                              onClick: () => void M(),
                              className: `inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink-50 px-4 py-2.5 text-sm font-medium text-ink-800 ring-1 ring-black/5 transition-colors hover:bg-ink-100 disabled:opacity-40 dark:bg-white/5 dark:text-ink-100 dark:ring-white/10 dark:hover:bg-white/10`,
                              children: [
                                (0, scope.W.jsx)(scope.pt, { className: `size-4` }),
                                `仅保存站点`,
                              ],
                            }),
                            (0, scope.W.jsxs)(scope.w.button, {
                              whileTap: { scale: 0.98 },
                              type: `button`,
                              disabled: !O || h || C,
                              onClick: () => void M(!0),
                              className: `${scope.fo} inline-flex items-center justify-center gap-1.5`,
                              children: [
                                h
                                  ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` })
                                  : (0, scope.W.jsx)(scope.Dt, { className: `size-4` }),
                                h ? `保存中...` : r ? `保存并继续` : `保存并添加账号`,
                              ],
                            }),
                          ],
                        }),
                  ],
                }),
        }),
      });
    };
    scope.Vl = function Vl({ value: e, onChange: t, accountSortMode: n, onAccountSortChange: r }) {
      let i = (0, scope.G.useId)(),
        a = (0, scope.G.useRef)(null),
        o = (0, scope.G.useRef)(null),
        [s, c] = (0, scope.G.useState)(!1),
        [l, u] = (0, scope.G.useState)(0);
      return (
        (0, scope.G.useEffect)(() => {
          if (!s) return;
          let e = (e) => {
              e.target instanceof Node && !a.current?.contains(e.target) && c(!1);
            },
            t = (e) => {
              e.key === `Escape` && (c(!1), o.current?.focus());
            },
            n = () => c(!1);
          return (
            document.addEventListener(`pointerdown`, e),
            document.addEventListener(`focusin`, e),
            document.addEventListener(`keydown`, t),
            window.addEventListener(`resize`, n),
            () => {
              (document.removeEventListener(`pointerdown`, e),
                document.removeEventListener(`focusin`, e),
                document.removeEventListener(`keydown`, t),
                window.removeEventListener(`resize`, n));
            }
          );
        }, [s]),
        (0, scope.W.jsxs)(`div`, {
          ref: a,
          className: `relative shrink-0`,
          children: [
            (0, scope.W.jsx)(scope.w.button, {
              ref: o,
              type: `button`,
              'aria-label': `排序设置`,
              'aria-expanded': s,
              'aria-controls': s ? i : void 0,
              title: `排序设置 · 站点：${scope.Bl.find((t) => t.value === e)?.name ?? `已微调`}`,
              onClick: () => {
                let e = o.current?.getBoundingClientRect().right ?? 0;
                (u(Math.min(0, e - Math.min(224, window.innerWidth - 16) - 8)), c((e) => !e));
              },
              whileTap: { scale: 0.94 },
              className: (0, scope.R)(
                `grid size-8 place-items-center rounded-md border shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-offset-slate-950`,
                s
                  ? `border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500`
                  : `border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:text-blue-300`,
              ),
              children: (0, scope.W.jsx)(scope.De, { className: `size-4`, 'aria-hidden': `true` }),
            }),
            s &&
              (0, scope.W.jsxs)(scope.w.div, {
                id: i,
                initial: { opacity: 0, y: -4 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.16 },
                style: { right: l },
                className: `absolute top-full z-50 mt-2 w-56 max-w-[calc(100vw-16px)] rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30`,
                children: [
                  (0, scope.W.jsxs)(`div`, {
                    role: `group`,
                    'aria-label': `站点排序`,
                    children: [
                      (0, scope.W.jsx)(`p`, {
                        className: `mb-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300`,
                        children: `站点排序`,
                      }),
                      (0, scope.W.jsx)(`div`, {
                        className: `isolate flex rounded-lg bg-slate-100 p-1 dark:bg-slate-950`,
                        children: scope.Bl.map((n) =>
                          (0, scope.W.jsxs)(
                            scope.w.button,
                            {
                              type: `button`,
                              'aria-label': n.name,
                              'aria-pressed': e === n.value,
                              title: n.hint,
                              onClick: () => t(n.value),
                              whileTap: { scale: 0.96 },
                              className: (0, scope.R)(
                                `relative flex-1 whitespace-nowrap rounded-md px-2 py-1.5 text-[11px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transition-none`,
                                e === n.value
                                  ? `text-white`
                                  : `text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100`,
                              ),
                              children: [
                                e === n.value &&
                                  (0, scope.W.jsx)(scope.w.span, {
                                    layoutId: `${i}-selection`,
                                    className: `absolute inset-0 -z-10 rounded-md bg-blue-600 shadow-sm dark:bg-blue-500`,
                                    transition: { type: `spring`, stiffness: 430, damping: 34 },
                                    'aria-hidden': `true`,
                                  }),
                                n.label,
                              ],
                            },
                            n.value,
                          ),
                        ),
                      }),
                      (0, scope.W.jsx)(`p`, {
                        className: `mt-2 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400`,
                        children:
                          e === `manual`
                            ? `当前是手动微调后的顺序（可继续用卡片箭头调整）· 选字母排序可恢复`
                            : `中文按拼音，1、2、10 按数值 · 卡片箭头可随时微调`,
                      }),
                    ],
                  }),
                  (0, scope.W.jsx)(`div`, {
                    className: `mt-3 border-t border-slate-100 pt-3 dark:border-slate-800`,
                    children: (0, scope.W.jsx)(scope.zl, { value: n, onChange: r }),
                  }),
                ],
              }),
          ],
        })
      );
    };
    scope.Wl = function Wl() {
      let [e, t] = (0, scope.G.useState)(scope.Pl),
        n = (0, scope.G.useRef)(0);
      return (
        (0, scope.G.useEffect)(() => {
          let e = !1,
            r = n.current,
            i = (e, r) => {
              r === `local` &&
                `siteSortMode` in e &&
                ((n.current += 1), t((0, scope.Fl)(e[scope.Hl].newValue)));
            };
          return (
            chrome.storage.onChanged.addListener(i),
            chrome.storage.local
              .get(scope.Hl)
              .then((i) => {
                !e && n.current === r && t((0, scope.Fl)(i[scope.Hl]));
              })
              .catch(() => {}),
            () => {
              ((e = !0), chrome.storage.onChanged.removeListener(i));
            }
          );
        }, []),
        [
          e,
          (0, scope.G.useCallback)((e) => {
            let r = (0, scope.Fl)(e);
            ((n.current += 1), t(r));
            let i = scope.Ul.then(() => chrome.storage.local.set({ [scope.Hl]: r }));
            return ((scope.Ul = i.catch(() => {})), i);
          }, []),
        ]
      );
    };
    scope.ql = function ql() {
      let [e, t] = (0, scope.G.useState)(scope.Qs),
        n = (0, scope.G.useRef)(0);
      return (
        (0, scope.G.useEffect)(() => {
          let e = !1,
            r = n.current,
            i = (e, r) => {
              r === `local` &&
                `accountSortMode` in e &&
                ((n.current += 1), t((0, scope.$s)(e[scope.Gl].newValue)));
            };
          return (
            chrome.storage.onChanged.addListener(i),
            chrome.storage.local
              .get(scope.Gl)
              .then((i) => {
                !e && n.current === r && t((0, scope.$s)(i[scope.Gl]));
              })
              .catch(() => {}),
            () => {
              ((e = !0), chrome.storage.onChanged.removeListener(i));
            }
          );
        }, []),
        [
          e,
          (0, scope.G.useCallback)((e) => {
            let r = (0, scope.$s)(e);
            ((n.current += 1), t(r));
            let i = scope.Kl.then(() => chrome.storage.local.set({ [scope.Gl]: r }));
            return ((scope.Kl = i.catch(() => {})), i);
          }, []),
        ]
      );
    };
    scope.Jl = function Jl({
      icon: e,
      label: t,
      onClick: n,
      primary: r,
      accent: i,
      danger: a,
      compact: o,
      disabled: s,
    }) {
      return (0, scope.W.jsxs)(scope.w.button, {
        whileHover: { scale: s ? 1 : 1.04, y: s ? 0 : -1 },
        whileTap: { scale: s ? 1 : 0.97 },
        type: `button`,
        onClick: n,
        disabled: s,
        title: t,
        'aria-label': t,
        className: (0, scope.R)(
          `action-btn inline-flex h-9 items-center gap-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40`,
          o ? `w-9 justify-center px-0` : `px-3`,
          r &&
            `action-btn-primary bg-mint-600 text-white shadow-lg shadow-mint-600/20 hover:bg-mint-700`,
          i &&
            `action-btn-accent bg-coral-500 text-white shadow-lg shadow-coral-500/20 hover:bg-coral-600`,
          a &&
            `action-btn-danger bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600`,
          !r &&
            !i &&
            !a &&
            `bg-white text-ink-800 ring-1 ring-black/5 hover:bg-sun-100 dark:bg-white/5 dark:text-ink-100 dark:ring-white/10 dark:hover:bg-white/10`,
        ),
        children: [
          (0, scope.W.jsx)(`span`, { className: `action-btn-energy`, 'aria-hidden': `true` }),
          (0, scope.W.jsx)(`span`, {
            className: `action-btn-icon`,
            'aria-hidden': `true`,
            children: e,
          }),
          (0, scope.W.jsx)(`span`, {
            className: (0, scope.R)(`action-label relative z-[2]`, o && `sr-only`),
            children: t,
          }),
        ],
      });
    };
    scope.Yl = function Yl({ onAdd: e, onImport: t }) {
      return (0, scope.W.jsxs)(scope.w.div, {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        className: `flex flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-black/10 bg-white px-4 py-10 dark:border-white/10 dark:bg-white/[0.03]`,
        children: [
          (0, scope.W.jsx)(`img`, {
            src: `/pelican-bicycle.svg`,
            alt: `鹈鹕骑自行车`,
            className: `mb-2 h-auto w-full max-w-[460px]`,
          }),
          (0, scope.W.jsx)(`h3`, { className: `text-sm font-semibold`, children: `还没有站点` }),
          (0, scope.W.jsx)(`p`, {
            className: `mt-1 mb-4 text-xs text-ink-800/50 dark:text-ink-100/40`,
            children: `手动添加一个站点，或从 Chrome 书签中批量导入`,
          }),
          (0, scope.W.jsxs)(`div`, {
            className: `flex flex-wrap items-center justify-center gap-2`,
            children: [
              (0, scope.W.jsxs)(scope.w.button, {
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.97 },
                type: `button`,
                onClick: e,
                className: `inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-brand-500/25`,
                children: [(0, scope.W.jsx)(scope.yt, { className: `size-4` }), `添加第一个站点`],
              }),
              (0, scope.W.jsxs)(scope.w.button, {
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.97 },
                type: `button`,
                onClick: t,
                className: `inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-medium text-ink-800 ring-1 ring-black/10 hover:bg-ink-50 dark:bg-white/5 dark:text-ink-100 dark:ring-white/10 dark:hover:bg-white/10`,
                children: [(0, scope.W.jsx)(scope.Ue, { className: `size-4` }), `从书签导入`],
              }),
            ],
          }),
        ],
      });
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.Rt = [
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
      case 1: {
        scope.zt = [
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
      case 2: {
        scope.Bt = [
          `input[autocomplete="current-password"]`,
          `#password`,
          `input[name="password"]`,
          `input[type="password"]`,
        ];
        break;
      }
      case 3: {
        [
          `button:has(> span:only-child)`,
          `.checkin-btn`,
          `#checkin`,
          `[data-testid="checkin"]`,
        ].join(`, `);
        break;
      }
      case 4: {
        scope.Ht = {
          pointerMode: `trusted`,
          loginMethod: `github`,
          oauthButtonSelector: `text=GitHub`,
          selectors: {
            username: `#username, input[name="username"]`,
            password: `#password, input[name="password"]`,
            submit: `button[type="submit"]`,
          },
          closeModalSelectors: [`button >> text=今日关闭`, `button >> text=关闭公告`, ...scope.Rt],
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
            siteType: scope.V.NEW_API,
            family: scope.N.NEW_API,
            checkinPath: `/console`,
            checkin: { pathPatterns: [`/console*`], titleWords: [`每日签到`, `daily check-in`] },
            quotaPerUnit: 5e5,
          },
        };
        break;
      }
      case 5: {
        scope.Ut = {
          id: `agentrouter`,
          label: `Agent Router`,
          siteType: scope.V.NEW_API,
          fingerprints: {
            hostnames: [`agentrouter.org`, `ps.air-outer.com`],
            titleWords: [`agent router`, `agentrouter`],
          },
          preset: scope.Ht,
        };
        break;
      }
      case 6: {
        scope.Wt = {
          id: `kid1412`,
          label: `1412's API`,
          siteType: scope.V.NEW_API,
          fingerprints: {
            hostnames: [`napi.kid1412.qzz.io`],
            titleWords: [`1412's api`, `kid1412`],
          },
          preset: {
            pointerMode: `trusted`,
            loginMethod: `github`,
            oauthButtonSelector: `text=GitHub`,
            selectors: {
              username: `input[name="username"]`,
              password: `input[name="password"]`,
              submit: `button[type="submit"]`,
            },
            closeModalSelectors: scope.Rt,
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
              siteType: scope.V.NEW_API,
              family: scope.N.NEW_API,
              checkinPath: `/profile`,
              checkin: { pathPatterns: [`/profile*`], titleWords: [`每日签到`] },
              quotaPerUnit: 5e5,
            },
          },
        };
        break;
      }
      case 7: {
        scope.Gt = {
          id: `sharedchat`,
          label: `SharedChat 权益领取`,
          siteType: scope.V.NEW_API,
          fingerprints: { hostnames: [`new.sharedchat.cc`], titleWords: [`sharedchat`, `chatai`] },
          preset: {
            pointerMode: `trusted`,
            loginMethod: `auto`,
            selectors: {
              username: `input[placeholder*="用户名"], input[placeholder*="邮箱"]`,
              password: `input[type="password"]`,
              submit: `button.submit-btn, button >> text=用户登录`,
            },
            closeModalSelectors: scope.Rt,
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
              siteType: scope.V.NEW_API,
              family: scope.N.NEW_API,
              checkinPath: `/list/`,
              checkin: { pathPatterns: [`/list*`], titleWords: [`权益`, `benefit`] },
            },
          },
        };
        break;
      }
      case 8: {
        scope.Kt = {
          id: `monkeycode`,
          label: `MonkeyCode`,
          siteType: scope.V.NEW_API,
          fingerprints: { hostnames: [`monkeycode-ai.com`] },
          preset: {
            selectors: {
              username: scope.zt.join(`, `),
              password: scope.Bt.join(`, `),
              submit: `button[type="submit"]`,
            },
            loginMethod: `auto`,
            closeModalSelectors: scope.Rt,
            checkin: { method: `auto`, url: `/console/tasks` },
            adapter: {
              siteType: scope.V.NEW_API,
              family: scope.N.NEW_API,
              checkinPath: `/console/tasks`,
              checkin: { pathPatterns: [`/console/tasks*`], titleWords: [`签到`, `任务`, `task`] },
              quotaPerUnit: 5e5,
            },
          },
        };
        break;
      }
      case 9: {
        scope.qt = {
          id: `futurehub`,
          label: `Future Hub`,
          siteType: scope.V.NEW_API,
          fingerprints: { hostnames: [`api.futureppo.top`] },
          preset: {
            selectors: {
              username: scope.zt.join(`, `),
              password: scope.Bt.join(`, `),
              submit: `button[type="submit"], button.semi-button-primary`,
            },
            loginMethod: `auto`,
            closeModalSelectors: scope.Rt,
            checkin: {
              method: `button`,
              url: `/console/personal`,
              buttonSelector: `button >> text=立即签到`,
              alreadySelector: `button >> text=今日已签到`,
              alreadyText: [`今日已签到`],
            },
            adapter: {
              siteType: scope.V.NEW_API,
              family: scope.N.NEW_API,
              checkinPath: `/console/personal`,
              checkin: { pathPatterns: [`/console/personal*`], titleWords: [`每日签到`] },
              quotaPerUnit: 5e5,
            },
          },
        };
        break;
      }
      case 10: {
        scope.Jt = {
          id: `anyrouter`,
          label: `AnyRouter（登录即签到）`,
          siteType: scope.V.ANYROUTER,
          fingerprints: { hostnames: [`anyrouter.top`], titleWords: [`any router`, `anyrouter`] },
          preset: {
            selectors: {
              username: scope.zt.join(`, `),
              password: scope.Bt.join(`, `),
              submit: `button[type="submit"], button.semi-button-primary`,
            },
            loginMethod: `auto`,
            closeModalSelectors: scope.Rt,
            checkin: { method: `none` },
            adapter: {
              siteType: scope.V.ANYROUTER,
              family: scope.N.NEW_API,
              checkinPath: ``,
              quotaPerUnit: 5e5,
            },
          },
        };
        break;
      }
      case 11: {
        scope.Yt = {
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
          closeModalSelectors: scope.Rt,
          checkin: {
            method: `button`,
            url: `/check-in`,
            buttonSelector: `button >> text=立即签到, button >> text=Check in`,
            alreadySelector: `button >> text=今日已签到, button >> text=Already checked in today`,
            successText: [`签到成功`, `Checked in — got`],
            alreadyText: [`今日已签到`, `今天已经签过了`, `Already checked in today`],
          },
          adapter: {
            siteType: scope.V.SUB2API,
            family: scope.N.SUB2API,
            checkinPath: `/check-in`,
            checkin: { pathPatterns: [`/check-in*`], titleWords: [`每日签到`, `daily check-in`] },
            quotaPerUnit: 1,
          },
        };
        break;
      }
      case 12: {
        scope.Xt = {
          id: `linxi`,
          label: `林夕`,
          siteType: scope.V.SUB2API,
          fingerprints: { hostnames: [`k40.shengqainbang.cn`], titleWords: [`林夕`] },
          preset: scope.Yt,
        };
        break;
      }
      case 13: {
        scope.Zt = {
          id: `baibei`,
          label: `百倍`,
          siteType: scope.V.SUB2API,
          fingerprints: { hostnames: [`sub.100xlabs.space`] },
          preset: scope.Yt,
        };
        break;
      }
      case 14: {
        scope.Qt = {
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
          closeModalSelectors: scope.Rt,
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
            siteType: scope.V.SUB2API,
            family: scope.N.SUB2API,
            checkinPath: `/checkin`,
            checkin: { pathPatterns: [`/checkin*`], titleWords: [`每日签到`, `daily check-in`] },
            quotaPerUnit: 1,
          },
        };
        break;
      }
      case 15: {
        scope.$t = {
          id: `denxio`,
          label: `登仙公益站`,
          siteType: scope.V.SUB2API,
          fingerprints: {
            hostnames: [`api.denxio.top`],
            titleWords: [`登仙公益站`, `登仙`, `denxio`],
          },
          preset: scope.Qt,
        };
        break;
      }
      case 16: {
        scope.en = {
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
          closeModalSelectors: scope.Rt,
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
            siteType: scope.V.UNKNOWN,
            family: scope.N.UNSUPPORTED,
            checkinPath: `/daily_checkin`,
            checkin: { pathPatterns: [`/daily_checkin*`], titleWords: [`每日签到`] },
          },
        };
        break;
      }
      case 17: {
        scope.tn = {
          id: `linux-sb`,
          label: `Linux.SB`,
          siteType: scope.V.UNKNOWN,
          fingerprints: { hostnames: [`linux.sb`] },
          preset: scope.en,
        };
        break;
      }
      case 18: {
        scope.J = {
          id: `new-api-next`,
          label: `已识别 new-api 中转站（新版界面）`,
          siteType: scope.V.NEW_API,
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
            closeModalSelectors: scope.Rt,
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
              siteType: scope.V.NEW_API,
              family: scope.N.NEW_API,
              checkinPath: `/profile`,
              checkin: { pathPatterns: [`/profile*`], titleWords: [`每日签到`] },
              quotaPerUnit: 5e5,
            },
          },
        };
        break;
      }
      case 19: {
        scope.nn = scope.J.preset;
        break;
      }
      case 20: {
        scope.rn = {
          ...scope.J.preset,
          selectors: { ...scope.J.preset.selectors },
          closeModalSelectors: [...scope.J.preset.closeModalSelectors],
          oauthButtonSelector: `text=GitHub`,
          checkin: {
            ...scope.J.preset.checkin,
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
            ...scope.J.preset.adapter,
            checkin: {
              ...scope.J.preset.adapter?.checkin,
              pathPatterns: [...(scope.J.preset.adapter?.checkin?.pathPatterns ?? [])],
              titleWords: [...(scope.J.preset.adapter?.checkin?.titleWords ?? [])],
            },
          },
        };
        break;
      }
      case 21: {
        scope.an = {
          id: `tabiai`,
          label: `TaBiAI`,
          siteType: scope.V.NEW_API,
          fingerprints: { hostnames: [`tabitoken.com`], titleWords: [`tabiai`, `tabitoken`] },
          preset: scope.rn,
        };
        break;
      }
      case 22: {
        scope.on = {
          pointerMode: `trusted`,
          loginMethod: `auto`,
          selectors: {
            username: `input[name="username"]`,
            password: `input[name="password"]`,
            submit: `button[type="submit"], button >> text=登录, button >> text=Sign in`,
          },
          successIndicator: `a[href="/keys"], a[href="/wallet"], text=浮梦引光, a[href="/lottery"]`,
          closeModalSelectors: scope.Rt,
          checkin: { method: `workflow`, workflow: { steps: [{ type: `leilei-daily` }] } },
          adapter: {
            siteType: scope.V.NEW_API,
            family: scope.N.NEW_API,
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
      case 23: {
        scope.sn = {
          id: `leilei`,
          label: `一梦五千年`,
          siteType: scope.V.NEW_API,
          fingerprints: { hostnames: [`fapi.leileihog.top`] },
          preset: scope.on,
        };
        break;
      }
      case 24: {
        scope.cn = {
          selectors: {
            username: scope.zt.join(`, `),
            password: scope.Bt.join(`, `),
            submit: `button[type="submit"], button.semi-button-primary`,
          },
          pointerMode: `trusted`,
          loginMethod: `auto`,
          closeModalSelectors: scope.Rt,
          checkin: {
            method: `button`,
            url: `/console/personal`,
            buttonSelector: `button >> text=立即签到`,
            alreadySelector: `button >> text=今日已签到, button >> text=已签到`,
            successText: [`签到成功`, `今日已签到`],
            alreadyText: [`今日已签到`, `已签到`],
          },
          adapter: {
            siteType: scope.V.NEW_API,
            family: scope.N.NEW_API,
            checkinPath: `/console/personal`,
            checkin: { pathPatterns: [`/console/personal*`], titleWords: [`每日签到`, `试试手气`] },
            quotaPerUnit: 5e5,
          },
        };
        break;
      }
      case 25: {
        scope.ln = {
          id: `vsllm`,
          label: `VSLLM`,
          siteType: scope.V.NEW_API,
          fingerprints: { hostnames: [`vsllm.com`] },
          preset: scope.cn,
        };
        break;
      }
      case 26: {
        scope.un = {
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
          closeModalSelectors: scope.Rt,
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
            siteType: scope.V.UNKNOWN,
            family: scope.N.UNSUPPORTED,
            checkinPath: `/`,
            checkin: { pathPatterns: [`/`], titleWords: [`每日签到`] },
            quotaPerUnit: 1,
          },
        };
        break;
      }
      case 27: {
        scope.dn = [
          scope.Ut,
          scope.Wt,
          scope.Gt,
          scope.Kt,
          scope.qt,
          scope.Jt,
          scope.Xt,
          scope.Zt,
          scope.$t,
          scope.tn,
          scope.an,
          scope.sn,
          scope.J,
          scope.ln,
          {
            id: `hvoy`,
            label: `Hvoy AI`,
            siteType: scope.V.UNKNOWN,
            fingerprints: { hostnames: [`www.hvoy.ai`] },
            preset: scope.un,
          },
          {
            id: `sub2api`,
            label: `Sub2API 系`,
            siteType: scope.V.SUB2API,
            fingerprints: {
              titleWords: [`sub2api`],
              selectors: [`#email + *, input#email`],
              endpoint: {
                path: `/api/v1/auth/me`,
                match: (e) => (0, scope.Vt)(e) && typeof e.code == `string`,
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
              closeModalSelectors: scope.Rt,
              checkin: { method: `auto`, url: `/check-in` },
              adapter: {
                siteType: scope.V.SUB2API,
                family: scope.N.SUB2API,
                checkinPath: `/check-in`,
                checkin: {
                  pathPatterns: [`/check-in*`],
                  titleWords: [`每日签到`, `daily check-in`],
                },
                quotaPerUnit: 1,
              },
            },
          },
          {
            id: `new-api`,
            label: `new-api / one-api 系`,
            siteType: scope.V.NEW_API,
            fingerprints: {
              titleWords: [`new-api`, `one-api`, `veloera`, `voapi`],
              selectors: [`.semi-modal-close`, `.semi-button`, `#username`],
              endpoint: {
                path: `/api/user/self`,
                match: (e) => (0, scope.Vt)(e) && e.success === !1,
              },
            },
            preset: {
              selectors: {
                username: `#username`,
                password: `#password`,
                submit: `button[type="submit"]`,
              },
              loginMethod: `auto`,
              closeModalSelectors: scope.Rt,
              successIndicator: `a[href="/console/token"], a[href="/console/topup"]`,
              checkin: { method: `auto`, url: `/console/personal`, apiUrl: `/api/user/checkin` },
              adapter: {
                siteType: scope.V.NEW_API,
                family: scope.N.NEW_API,
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
      case 28: {
        scope.pn = [];
        break;
      }
      case 29: {
        scope.Yr = `www.hvoy.ai`;
        break;
      }
      case 30: {
        scope.ti = `fapi.leileihog.top`;
        break;
      }
      case 31: {
        scope.li = new Set((scope.J.fingerprints.hostnames ?? []).map((e) => e.toLowerCase()));
        break;
      }
      case 32: {
        scope.Si = `button.refresh-btn, button.invite-entry-button, button.el-button--primary.el-button--large`;
        break;
      }
      case 33: {
        scope.Ci = `button.refresh-btn, button.invite-entry-button`;
        break;
      }
      case 34: {
        scope.$ = `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`;
        break;
      }
      case 35: {
        scope.fo = `w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600 disabled:opacity-40 disabled:shadow-none`;
        break;
      }
      case 36: {
        scope.po = { bookmark_bar: `书签栏`, other: `其他书签`, synced: `移动设备书签` };
        break;
      }
      case 37: {
        scope.Po = [
          { value: `form`, label: `站点账号密码`, description: `填站点用户名密码并提交，最常见` },
          {
            value: `github`,
            label: `GitHub 账号密码`,
            description: `点站点 OAuth 按钮，跳到 GitHub 后自动填 GitHub 账密`,
          },
          {
            value: `oauth`,
            label: `第三方授权登录`,
            description: `在提供方页面完成授权；添加账号时选择本站检测到的具体入口`,
          },
          {
            value: `passkey`,
            label: `Passkey / 通行密钥`,
            description: `在浏览器或系统提示中确认登录`,
          },
          {
            value: `manual`,
            label: `验证码 / 页面登录`,
            description: `在站点页面完成验证码或扫码，并核验本站账号身份`,
          },
        ];
        break;
      }
      case 38: {
        scope.Fo = {
          form: `站点账号密码`,
          github: `GitHub 账号密码`,
          passkey: `Passkey 登录`,
          oauth: `其他 OAuth 授权`,
          manual: `验证码 / 页面登录`,
          token: `API 通行令牌`,
          auto: `自动检测`,
        };
        break;
      }
      case 39: {
        scope.Lo = { storageKey: ``, headerName: `Authorization`, headerPrefix: `Bearer ` };
        break;
      }
      case 40: {
        scope.Bl = [
          {
            value: `name-asc`,
            label: `A → Z`,
            name: `名称 A→Z`,
            hint: `中文按全拼与字母混排；1、2、10 按数值排列`,
          },
          {
            value: `name-desc`,
            label: `Z → A`,
            name: `名称 Z→A`,
            hint: `按名称降序；一、壹等汉字按拼音，不当数字`,
          },
        ];
        break;
      }
      case 41: {
        scope.Hl = `siteSortMode`;
        break;
      }
      case 42: {
        scope.Ul = Promise.resolve();
        break;
      }
      case 43: {
        scope.Gl = `accountSortMode`;
        break;
      }
      case 44: {
        scope.Kl = Promise.resolve();
        break;
      }
    }
  },
  storeProperties: {
    store_Li_moveSite(scope) {
      return {
        async moveSite(e, t, n) {
          return (0, scope.X)(async () => {
            let r = await scope.z.get(scope.M.sites, []),
              i = scope.pn.filter((e) => !r.some((t) => t.id === e.id)),
              a = [...r, ...i],
              o;
            if (n?.length) {
              let e = new Map();
              for (let [t, r] of n.entries()) e.has(r) || e.set(r, t);
              o = a
                .map((t, r) => ({ site: t, key: e.get(t.id) ?? n.length + r }))
                .sort((e, t) => e.key - t.key)
                .map(({ site: e }) => e);
            } else {
              o = a
                .map((e, t) => ({ ...e, sortOrder: e.sortOrder ?? t }))
                .sort((e, t) => e.sortOrder - t.sortOrder || e.name.localeCompare(t.name));
              let n = o.findIndex((t) => t.id === e),
                r = t === `up` ? n - 1 : n + 1;
              if (n < 0 || r < 0 || r >= o.length) return;
              [o[n], o[r]] = [o[r], o[n]];
            }
            await scope.z.set(
              scope.M.sites,
              o.map((e, t) => ({ ...e, sortOrder: t })),
            );
          });
        },
      };
    },
    store_Li_addSite(scope) {
      return {
        addSite(e) {
          return (0, scope.X)(async () => {
            (0, scope.or)(e);
            let [t, n] = await Promise.all([
              scope.z.get(scope.M.sites, []),
              scope.z.get(scope.M.proxies, []),
            ]);
            ((0, scope.Fi)(e.proxyId, (0, scope.Ni)(n)),
              await scope.z.set(scope.M.sites, t.concat({ ...e, id: (0, scope.Ft)(`site`) })));
          });
        },
      };
    },
    store_Li_addSites(scope) {
      return {
        addSites(e, t, n = !1) {
          return (0, scope.X)(async () => {
            e.forEach(scope.or);
            let [r, i] = await Promise.all([
                scope.z.get(scope.M.sites, []),
                scope.z.get(scope.M.proxies, []),
              ]),
              a = (0, scope.Ni)(i),
              o = new Set(t);
            r.forEach((e) => o.add(e.loginUrl.trim()));
            let s = [];
            for (let t of e) {
              let e = t.loginUrl.trim();
              !e ||
                (!n && o.has(e)) ||
                (t.proxyId && !a.has(t.proxyId)) ||
                (o.add(e), s.push({ ...t, id: (0, scope.Ft)(`site`) }));
            }
            return (s.length && (await scope.z.set(scope.M.sites, r.concat(s))), s.length);
          });
        },
      };
    },
    store_Li_updateSite(scope) {
      return {
        updateSite(e, t) {
          return (0, scope.X)(async () => {
            let [n, r] = await Promise.all([
                scope.z.get(scope.M.sites, []),
                scope.z.get(scope.M.proxies, []),
              ]),
              i = scope.pn.find((t) => t.id === e),
              a = n.find((t) => t.id === e) ?? i;
            `proxyId` in t &&
              t.proxyId !== a?.proxyId &&
              (0, scope.Fi)(t.proxyId, (0, scope.Ni)(r));
            let o = !1,
              s = n.map((n) => {
                if (n.id !== e) return n;
                o = !0;
                let r = { ...n, ...t, ...(i ? { builtin: !0 } : {}) };
                return ((0, scope.or)(r), r);
              });
            if (!o && i) {
              let e = { ...i, ...t, builtin: !0 };
              ((0, scope.or)(e), s.push(e));
            }
            await scope.z.set(scope.M.sites, s);
          });
        },
      };
    },
    store_Ui_addSite(scope, e, t) {
      return {
        async addSite(e) {
          (await (0, scope.Vi)({ action: `add-site`, input: e }), await t().load());
        },
      };
    },
    store_Ui_addSites(scope, e, t) {
      return {
        async addSites(e, n = !1) {
          e.length !== 0 &&
            (await (0, scope.Vi)({ action: `add-sites`, inputs: e, preserveDuplicates: n }))
              .added &&
            (await t().load());
        },
      };
    },
    store_Ui_updateSite(scope, e, t) {
      return {
        async updateSite(e, n) {
          (await (0, scope.Vi)({ action: `update-site`, siteId: e, patch: n }), await t().load());
        },
      };
    },
    store_Ui_moveSite(scope, e, t) {
      return {
        async moveSite(e, n, r) {
          (await (0, scope.Vi)({ action: `move-site`, siteId: e, direction: n, orderedIds: r }),
            await t().load());
        },
      };
    },
    store_Ui_removeSite(scope, e, t) {
      return {
        async removeSite(e) {
          await t().removeMany([e], []);
        },
      };
    },
  },
});

export function saveSiteConfiguration(input, siteId) {
  const actions = appRuntime.scope.Ui.getState();
  return siteId ? actions.updateSite(siteId, input) : actions.addSite(input);
}
export function importSiteBatch(inputs, preserveDuplicates = false) {
  return appRuntime.scope.Ui.getState().addSites(inputs, preserveDuplicates);
}
