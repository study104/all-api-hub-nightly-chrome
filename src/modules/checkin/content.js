import { bindContentState } from '../../shared/content-runtime.js';
import {
  SiteIdentityResolver,
  compareAccountIdentity,
  findIdentityMatch,
  identitiesEqual,
  identitySourceLabel,
  identitySampleKey,
  parseIdentityResponse,
  readIdentitySource,
  readVisibleAccountIdentity,
  resolveIdentityPage,
  stableIdentitySamples,
} from '../../shared/account-identity.js';
import { LoginStateResolver, classifyLoginState, loginStateLog } from '../../shared/login-state.js';
import { readSiteLoginEvidence, withSiteIdentityRecipe } from '../../shared/site-login-recipes.js';

/** 签到执行内容逻辑：登录、身份闸门、工作流回放、签到确认和任务进度。  */
export function createCheckinAutoContent(__contentScope) {
  let identityResolver;
  const directLoginLabel =
    /^(?:登录|登陆|登入|立即登录|继续登录|前往登录|sign[\s-]?in|log[\s-]?in)[.!。！›»>→]*$/i;
  const __contentState = bindContentState(__contentScope, [
    'detectPageLogin',
    'readLoginOptions',
    'readLoginSnapshot',
    'readLoginState',
    'hasVisibleLogoutControl',
    'describeLoginControl',
    'findSelectedLoginControl',
    'collectLoginEntries',
    'r',
    'i',
    'a',
    'o',
    's',
    'c',
    'l',
    'u',
    'd',
    'f',
    'tt',
    'F',
    'nt',
    'rt',
    'it',
    'at',
    'ot',
    'st',
    'ct',
    'lt',
    'ut',
    'dt',
    'ft',
    'pt',
    'mt',
    'ht',
    'gt',
    '_t',
    'vt',
    'yt',
    'bt',
    'xt',
    'St',
    'Ct',
    'wt',
    'Tt',
    'Et',
    'Dt',
    'Ot',
    'kt',
    'At',
    'jt',
    'Mt',
    'Nt',
    'Pt',
    'Ft',
    'It',
    'Lt',
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
    'B',
    '$t',
    'en',
    'tn',
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
    'Cn',
    'wn',
    'Tn',
    'En',
    'Dn',
    'On',
    'kn',
    'An',
    'jn',
    'Mn',
    'Nn',
    'Pn',
    'Fn',
    'In',
    'Ln',
    'Rn',
    'zn',
    'Bn',
    'Vn',
    'Hn',
    'Un',
    'Wn',
    'Gn',
    'Kn',
    'qn',
    'Jn',
    'Yn',
    'Xn',
    'Zn',
    'Qn',
    '$n',
    'er',
    'tr',
    'nr',
    'rr',
    'ir',
    'ar',
    'U',
    'or',
    'sr',
    'cr',
    'lr',
    'ur',
    'dr',
    'fr',
    'pr',
    'mr',
    'hr',
    'gr',
    '_r',
    'vr',
    'yr',
    'br',
    'xr',
    'Sr',
    'Cr',
    'wr',
    'Tr',
    'Er',
    'Dr',
    'Or',
    'kr',
    'W',
    'Ar',
    'jr',
    'Mr',
    'Nr',
    'Pr',
    'Fr',
    'Ir',
    'Lr',
    'Rr',
    'zr',
    'Br',
    'Vr',
    'Hr',
    'Ur',
    'Wr',
    'Gr',
    'Kr',
    'qr',
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
    'identityProbeHints',
    'si',
    'ci',
    'li',
    'ui',
    'di',
    'fi',
    'pi',
    'mi',
    'G',
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
    'Ni',
    'Pi',
    'Fi',
    'Ii',
    'Li',
    'Ri',
    'zi',
    'Bi',
    'Vi',
    'Hi',
    'Ui',
    'Wi',
    'Gi',
    'Ki',
    'qi',
    'Ji',
    'Yi',
    'Xi',
    'Zi',
    'Qi',
    '$i',
    'ea',
    'ta',
    'na',
    'ra',
    'ia',
    'aa',
    'oa',
    'sa',
    'ca',
    'la',
    'ua',
    'da',
    'fa',
    'pa',
    'ma',
    'ha',
    'ga',
    '_a',
    'va',
    'ya',
    'ba',
    'xa',
    'Sa',
    'Ca',
    'wa',
    'Ta',
    'Ea',
    'Da',
    'Oa',
    'ka',
    'Aa',
    'ja',
    'Ma',
    'Na',
    'Pa',
    'Fa',
    'Ia',
    'La',
    'Ra',
    'za',
    'Ba',
    'Va',
    'Ha',
    'Ua',
    'Wa',
    'Ga',
    'Ka',
    'qa',
    'Ja',
    'Ya',
    'Xa',
    'Za',
    'Qa',
    '$a',
    'eo',
    'K',
    'to',
    'no',
    'ro',
    'io',
    'ao',
    'oo',
    'so',
    'co',
    'lo',
    'uo',
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
    'Bu',
    'Vu',
    'Hu',
    'Uu',
    'Wu',
    'Gu',
    'Ku',
    'qu',
    'Ju',
    'Yu',
    'Xu',
    'Zu',
    'Qu',
    '$u',
    'ed',
    'td',
    'nd',
    'rd',
    'id',
    'ad',
    'od',
    'sd',
    'cd',
    'ld',
    'ud',
    'dd',
    'fd',
    'pd',
    'md',
    'hd',
    'gd',
    '_d',
    'vd',
    'yd',
    'bd',
    'xd',
    'Sd',
    'Cd',
    'wd',
    'Td',
    'Ed',
    'Dd',
    'Od',
    'kd',
    'Ad',
    'jd',
    'Md',
    'Nd',
    'Pd',
    'Fd',
    'Id',
    'Ld',
    'Rd',
    'zd',
    'Bd',
    'Vd',
    'Hd',
    'Ud',
    'Wd',
    'Gd',
    'Kd',
    'qd',
    'Jd',
    'Yd',
    'Xd',
    'Zd',
    'Qd',
    '$d',
    'ef',
    'tf',
    'nf',
    'rf',
    'af',
    'of',
    'sf',
    'cf',
    'lf',
    'uf',
    'df',
    'ff',
    'pf',
    'mf',
    'hf',
    'gf',
    '_f',
    'vf',
    'yf',
    'bf',
    'xf',
    'Sf',
    'Cf',
    'wf',
    'Tf',
    'Ef',
    'Df',
    'Of',
    'kf',
    'Af',
    'jf',
    'Mf',
    'Nf',
    'Pf',
    'Ff',
    'If',
    'Lf',
    'Rf',
    'zf',
    'Bf',
    'Vf',
    'Hf',
    'Uf',
    'Wf',
    'Gf',
    'Kf',
    'qf',
    'Jf',
    'Yf',
    'Xf',
    'Zf',
    'Qf',
    '$f',
    'ep',
    'tp',
    'np',
    'rp',
    'ip',
    'ap',
    'op',
    'sp',
    'cp',
    'lp',
    'up',
    'dp',
    'fp',
    'pp',
    'mp',
    'hp',
    'gp',
    '_p',
    'vp',
    'yp',
    'bp',
    'xp',
    'Sp',
    'Cp',
    'wp',
    'Tp',
    'Ep',
    'Dp',
    'Op',
    'kp',
    'Q',
    'Gp',
    'Kp',
    'qp',
    'Jp',
    'Yp',
    'Xp',
    'Zp',
    'Qp',
    '$p',
    'em',
    'tm',
    'nm',
    'rm',
    'im',
    'am',
    'om',
    'Vm',
    'Hm',
    'Um',
    'Wm',
    'Gm',
    'Km',
    'qm',
    'Jm',
    'Ym',
    'Xm',
    'Zm',
    'Qm',
    '$m',
    'eh',
    'th',
    '$',
    'nh',
    'rh',
    'ih',
    'ah',
    'oh',
    'sh',
    'ch',
    'lh',
    'uh',
    'dh',
    'fh',
    'ph',
    'mh',
    'hh',
    'Gg',
  ]);
  function f(e, t, n, r) {
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

  function ot(e) {
    let t = e.replace(/\s+/g, ` `).trim(),
      n = (0, __contentScope.Qe)(t).toLowerCase(),
      r = t
        .split(/(?:\n|。|；)/)
        .map((e) => e.trim())
        .filter(Boolean);
    for (let e of r)
      if ((0, __contentScope.et)(e, __contentScope.at).length > 0) return e.slice(0, 160);
    let i =
      /(?:服务(?:暂)?不可用|server\s+(?:unavailable|error)|bad\s+gateway|网关(?:错误|超时)|too\s+many\s+requests|服务端错误)/i.exec(
        n,
      );
    return i
      ? t.slice(Math.max(0, i.index - 20), i.index + 80).trim()
      : /\b(?:4\d{2}|5\d{2})\b/.exec(n) && /(?:失败|错误|error|失败原因)/i.test(n)
        ? t.slice(0, 160)
        : null;
  }

  function dt(e) {
    let t = window.getComputedStyle(e);
    if (t.display === `none` || t.visibility === `hidden` || t.opacity === `0`) return !1;
    let n = e.getBoundingClientRect();
    return n.width > 0 && n.height > 0;
  }

  function ht(e) {
    return __contentScope.mt.test(e);
  }

  function _t(e) {
    return [
      e.innerText,
      e.textContent,
      e.getAttribute(`value`),
      e.getAttribute(`aria-label`),
      e.getAttribute(`title`),
    ]
      .map((e) => (typeof e == `string` ? e.replace(/\s+/g, ``).toLowerCase() : ``))
      .filter(Boolean)
      .some((e) => __contentScope.gt.has(e));
  }

  function vt(e) {
    let t = e.closest(__contentScope.pt);
    if (!t) return null;
    let n = t;
    for (;;) {
      let e = n.parentElement,
        t = e ? e.closest(__contentScope.pt) : null;
      if (!t || t === document.body) break;
      n = t;
    }
    return n;
  }

  function yt(e, t = __contentScope.F) {
    for (let n of (0, __contentScope.z)(e)) {
      let e = (0, __contentScope.L)(n);
      if (
        !(0, __contentScope.R)(n) &&
        __contentScope.ct.test(e) &&
        !__contentScope.lt.test(e) &&
        !(0, __contentScope.I)(e, t)
      )
        return { kind: `target`, text: e };
      if ((0, __contentScope.R)(n) && (0, __contentScope.I)(e, t))
        return { kind: `already`, text: e };
    }
    return e.querySelector?.(`input[type="password"], input[autocomplete="one-time-code"]`)
      ? { kind: `form`, text: `` }
      : (0, __contentScope.xt)(e) || null;
  }

  function xt(e) {
    if (!e.querySelector?.(__contentScope.bt)) return null;
    for (let t of (0, __contentScope.z)(e)) {
      let e = (0, __contentScope.L)(t);
      if (__contentScope.ct.test(e) && !__contentScope.lt.test(e)) return { kind: `form`, text: e };
    }
    return null;
  }

  function St(e = __contentScope.F) {
    let t;
    try {
      t = [...document.querySelectorAll(__contentScope.pt)];
    } catch {
      return !1;
    }
    return t.some((t) => (0, __contentScope.dt)(t) && !!(0, __contentScope.yt)(t, e));
  }

  function Ct(e = __contentScope.F) {
    return (0, __contentScope.St)(e) ? !0 : !!(0, __contentScope.yt)(document, e);
  }

  function wt(e, t = __contentScope.F, n) {
    let r = (0, __contentScope.L)(e);
    if (__contentScope.ct.test(r) && !__contentScope.lt.test(r))
      return {
        verdict: `keep`,
        reason: `候选关闭按钮自身是签到动作「${r.slice(0, 20)}」`,
      };
    let i = n ?? (0, __contentScope.vt)(e);
    if ((0, __contentScope.ht)(r)) return { verdict: `close` };
    if (i) {
      let e = (0, __contentScope.yt)(i, t);
      if (e) {
        let t = e.text ? `「${e.text.slice(0, 20)}」` : ``;
        return { verdict: `keep`, reason: `弹窗内含签到${e.kind}${t}` };
      }
      return { verdict: `close` };
    }
    return (0, __contentScope.St)(t) && !(0, __contentScope.ht)(r)
      ? {
          verdict: `keep`,
          reason: `关闭按钮归属不明，且页面存在含签到控件的弹窗`,
        }
      : { verdict: `close` };
  }

  function Ft(e) {
    if (e) {
      if (!e.isConnected) return null;
      let t = (0, __contentScope.qe)(e)?.closest(__contentScope.jt);
      return t && (0, __contentScope.It)(t) && (0, __contentScope.Bt)(t) ? t : null;
    }
    return (
      (0, __contentScope.xe)(__contentScope.jt)
        .filter((e) => {
          if (!(0, __contentScope.It)(e) || !(0, __contentScope.Bt)(e)) return !1;
          if (e.matches(__contentScope.At.join(`, `))) return !0;
          let t = e.getBoundingClientRect();
          return t.width >= window.innerWidth * 0.6 && t.height >= window.innerHeight * 0.4;
        })
        .reverse()
        .find((e) => (0, __contentScope.Lt)(e).some(__contentScope.zt)) ?? null
    );
  }

  function It(e) {
    if (!e.isConnected || !(0, __contentScope.O)(e)) return !1;
    for (let t = e; t; t = t.parentElement) {
      let e = window.getComputedStyle(t);
      if (
        t.hidden ||
        e.display === `none` ||
        e.visibility === `hidden` ||
        e.visibility === `collapse` ||
        e.opacity === `0`
      )
        return !1;
    }
    return !0;
  }

  function Lt(e) {
    let t = new Set([e]);
    if (e.matches(__contentScope.Nt)) {
      for (let n of [e.previousElementSibling, e.nextElementSibling])
        n instanceof HTMLElement &&
          n.matches(__contentScope.Pt) &&
          (0, __contentScope.It)(n) &&
          t.add(n);
      for (let n of (0, __contentScope.Rt)(e)) t.add(n);
    }
    return [...t];
  }

  function Rt(e) {
    if (e.matches(__contentScope.Mt) || e.querySelector(__contentScope.Mt)) return [];
    let t = e.parentElement;
    if (!t) return [];
    let n = e.getBoundingClientRect(),
      r = Math.max(0, n.left),
      i = Math.min(window.innerWidth, n.right),
      a = Math.max(0, n.top),
      o = Math.min(window.innerHeight, n.bottom);
    if (i <= r || o <= a) return [];
    let s = new Set();
    for (let n = 1; n <= 3; n += 1)
      for (let c = 1; c <= 3; c += 1) {
        let l = r + ((i - r) * c) / 4,
          u = a + ((o - a) * n) / 4,
          d = document.elementFromPoint(l, u);
        if (!(d instanceof HTMLElement) || d === e || e.contains(d)) continue;
        let f = d;
        for (; f.parentElement && f.parentElement !== t;) f = f.parentElement;
        f.parentElement === t && f !== e && (0, __contentScope.It)(f) && s.add(f);
      }
    return [...s];
  }

  function zt(e) {
    let t = e.getBoundingClientRect(),
      n = Math.max(0, t.left),
      r = Math.min(window.innerWidth, t.right),
      i = Math.max(0, t.top),
      a = Math.min(window.innerHeight, t.bottom);
    if (r <= n || a <= i) return !1;
    let o = Math.min(8, (r - n) / 2),
      s = Math.min(8, (a - i) / 2);
    return [
      [(n + r) / 2, (i + a) / 2],
      [n + o, i + s],
      [r - o, a - s],
    ].some(([t, n]) => {
      let r = document.elementFromPoint(t, n);
      return !!r && (r === e || e.contains(r));
    });
  }

  function Bt(e) {
    try {
      return window.getComputedStyle(e).pointerEvents !== `none`;
    } catch {
      return !0;
    }
  }

  function Vt(e) {
    return e?.isConnected ? !!(0, __contentScope.qe)(e) : !!(0, __contentScope.Ft)();
  }

  function Ht(e) {
    let t = e.closeModalSelectors ?? [];
    return [...new Set([...t, ...__contentScope.r])];
  }

  function Wt(e) {
    if (!e.isConnected || !(0, __contentScope.O)(e)) return null;
    let t = e.getBoundingClientRect(),
      n = t.left + t.width / 2,
      r = t.top + t.height / 2;
    return n >= 0 && n < window.innerWidth && r >= 0 && r < window.innerHeight
      ? { x: n, y: r }
      : null;
  }

  function Gt(e) {
    if (
      !(0, __contentScope.It)(e) ||
      !(0, __contentScope.Bt)(e) ||
      (0, __contentScope.R)(e) ||
      e.matches(`:disabled`) ||
      e.closest(`[inert], [aria-hidden="true"], [aria-disabled="true"]`)
    )
      return !1;
    let t = (0, __contentScope.Wt)(e);
    if (!t) return !0;
    let n = document.elementFromPoint(t.x, t.y);
    return !!n && (n === e || e.contains(n));
  }

  function Kt(e, t) {
    let n = t.find((t) => t.contains(e)),
      r = e.closest(__contentScope.Mt);
    if (r && (!n || n.contains(r))) {
      let e = `dialog[open], [role="dialog"], [aria-modal="true"], [data-slot="dialog-content"]`;
      if (!r.matches(e)) {
        let t = r.parentElement?.closest(e);
        if (t && n?.contains(t)) return t;
      }
      return r;
    }
    return n ?? (0, __contentScope.vt)(e) ?? e;
  }

  function qt(e, t = null) {
    let n = t
        ? (0, __contentScope.Lt)(t)
        : (0, __contentScope.xe)(`${__contentScope.ft.join(`, `)}, ${__contentScope.Mt}`).filter(
            __contentScope.It,
          ),
      r = t ? n : [document],
      i = e.flatMap((e) =>
        r.flatMap((t) =>
          (0, __contentScope.xe)(e, t).map((t) => ({
            selector: e,
            element: t,
          })),
        ),
      ),
      a = [...new Set(n.flatMap((e) => (0, __contentScope.z)(e)))],
      o = [
        ...new Set(
          n
            .flatMap((e) => [...e.querySelectorAll(`div, span`)])
            .filter((e) => {
              if (!(0, __contentScope.It)(e)) return !1;
              let t = (e.innerText || e.textContent || ``).trim().replace(/\s+/g, ` `);
              return !t ||
                t.length > 40 ||
                [...e.children].some((e) => (e.textContent || ``).trim())
                ? !1
                : (0, __contentScope.ht)(t) || (0, __contentScope._t)(e);
            }),
        ),
      ],
      s = [...r.flatMap((e) => [...e.querySelectorAll(__contentScope.Ut)]), ...a, ...o].filter(
        (e) =>
          (0, __contentScope.It)(e)
            ? (0, __contentScope.ht)((0, __contentScope.L)(e))
              ? !0
              : (0, __contentScope._t)(e)
                ? !!(0, __contentScope.vt)(e) || n.some((t) => t.contains(e))
                : !1
            : !1,
      ),
      c = new Set();
    return [...i, ...s.map((e) => ({ selector: null, element: e }))]
      .map(({ selector: e, element: t }) => {
        let r = t.closest(__contentScope.Ut) ?? t;
        return { selector: e, element: r, scope: (0, __contentScope.Kt)(r, n) };
      })
      .filter(({ element: e }) =>
        c.has(e) || (c.add(e), t && !n.some((t) => t.contains(e))) ? !1 : (0, __contentScope.Gt)(e),
      )
      .sort(
        (e, t) =>
          Number(!(0, __contentScope.Wt)(e.element)) - Number(!(0, __contentScope.Wt)(t.element)) ||
          Number(!(0, __contentScope.ht)((0, __contentScope.L)(e.element))) -
            Number(!(0, __contentScope.ht)((0, __contentScope.L)(t.element))),
      );
  }

  async function Jt(e, t, n) {
    let r = Date.now() + n;
    for (;;) {
      if (
        !(0, __contentScope.It)(e) ||
        (t && (0, __contentScope.Wt)(t) && !(0, __contentScope.qe)(t))
      )
        return !0;
      let n = r - Date.now();
      if (n <= 0) return !1;
      await (0, __contentScope.w)(Math.min(50, n));
    }
  }

  async function Yt(e, t, n, r, i) {
    let a = 0,
      o = 0,
      s = !1,
      c = Date.now() + __contentScope.Et,
      l = new Set();
    for (; Date.now() < c;) {
      let u = (0, __contentScope.Ft)(r);
      if (r && !u) break;
      let d = (0, __contentScope.qt)(e, u).filter(
        ({ element: e }) =>
          ![...i.failedButtons].some((t) => t === e || t.contains(e) || e.contains(t)),
      );
      if (d.length === 0) break;
      let f = null,
        p = 0;
      for (let e of d) {
        let r = (0, __contentScope.wt)(e.element, t, e.scope === e.element ? void 0 : e.scope);
        if (r.verdict === `close`) {
          f = e;
          break;
        }
        ((p += 1), l.has(r.reason) || (l.add(r.reason), n.push(`保留弹窗：${r.reason}`)));
      }
      if (((o = p), !f)) break;
      let m = (0, __contentScope.Ct)(t),
        h =
          (0, __contentScope.L)(f.element).replace(/\s+/g, ` `).slice(0, 40) ||
          (0, __contentScope.N)(f.element),
        g = f.selector ?? `文字识别`,
        _ = `「${h}」（${(0, __contentScope.N)(f.scope)}，${g}）`,
        v = null;
      try {
        let e = await (0, __contentScope.M)(f.element, { deadline: c });
        n.push(`公告关闭按钮已收到${e === `trusted` ? `浏览器可信` : `DOM`}点击：${_}`);
      } catch (e) {
        v = e instanceof Error ? e.message : String(e);
      }
      (await (0, __contentScope.Jt)(
        f.scope,
        r,
        Math.max(0, Math.min(__contentScope.Dt, c - Date.now())),
      ))
        ? (n.push(
            v
              ? `公告关闭点击回执未确认，但已确认对应弹窗消失或目标遮挡解除：${_}`
              : `已确认对应公告消失或目标遮挡解除：${_}`,
          ),
          (a += 1),
          await (0, __contentScope.w)(120),
          m && !(0, __contentScope.Ct)(t) && (s = !0))
        : (i.failedButtons.add(f.element),
          n.push(
            v
              ? `公告关闭操作未确认：${_}，${v}；当前遮挡仍在，尝试其他关闭按钮`
              : `公告关闭按钮未能解除当前遮挡：${_}；跳过该按钮，尝试其他候选`,
          ));
    }
    return { closed: a, kept: o, lostEvidence: s };
  }

  function Xt(e) {
    return [...e.querySelectorAll(__contentScope.Ut), ...(0, __contentScope.z)(e)].some(
      (e) =>
        (0, __contentScope.It)(e) &&
        ((0, __contentScope.ht)((0, __contentScope.L)(e)) || (0, __contentScope._t)(e)),
    );
  }

  async function Zt(e, t, n, r) {
    let i = (0, __contentScope.Ft)(n);
    if (!i) return `absent`;
    if ((0, __contentScope.St)(e)) return `functional`;
    let a = (0, __contentScope.Lt)(i);
    if (a.some((t) => (0, __contentScope.yt)(t, e))) return `functional`;
    let o = `${__contentScope.ft.join(`, `)}, ${__contentScope.Mt}`,
      s = [
        ...new Set(
          a.flatMap((e) => [...(e.matches(o) ? [e] : []), ...(0, __contentScope.xe)(o, e)]),
        ),
      ].filter(__contentScope.It);
    if (s.length === 0 && !a.some((e) => (0, __contentScope.Xt)(e))) return `skipped`;
    if (r.escapedOverlays.has(i)) return `failed`;
    r.escapedOverlays.add(i);
    let c = r.failedButtons.size > 0 ? `已尝试的公告关闭按钮未生效` : `当前公告没有可用的关闭按钮`;
    t.push(`${c}（${(0, __contentScope.N)(i)}），尝试一次 Esc`);
    let l = document.activeElement;
    return (
      (0, __contentScope.Ye)([l && s.some((e) => e.contains(l)) ? l : (s[s.length - 1] ?? i)]),
      (await (0, __contentScope.Jt)(i, n, __contentScope.Dt)) ? `gone` : `failed`
    );
  }

  async function Qt(
    e,
    t,
    {
      waitForAppear: n = !1,
      blockedElement: r,
      cleanupState: i = {
        failedButtons: new Set(),
        escapedOverlays: new Set(),
      },
    } = {},
  ) {
    let a = (0, __contentScope.Ht)(e),
      o = e.checkin?.alreadyText?.length ? e.checkin.alreadyText : __contentScope.F,
      s = await (0, __contentScope.Yt)(a, o, t, r, i);
    if (s.closed === 0 && n) {
      // A rendered login/business page can continue promptly. Every actual
      // click still checks and clears any overlay that appears afterwards.
      let appearanceBudget =
          (0, __contentScope.On)(e) || (0, __contentScope.ar)(e)
            ? Math.min(250, __contentScope.Tt)
            : __contentScope.Tt,
        deadline = Date.now() + appearanceBudget;
      for (; Date.now() < deadline;)
        if (
          (await (0, __contentScope.w)(Math.min(__contentScope.Ot, deadline - Date.now())),
          (0, __contentScope.Ft)(r) || (!r && (0, __contentScope.qt)(a).length > 0))
        ) {
          let e = await (0, __contentScope.Yt)(a, o, t, r, i);
          s = {
            closed: e.closed,
            kept: e.kept || s.kept,
            lostEvidence: s.lostEvidence || e.lostEvidence,
          };
          break;
        }
    }
    let { closed: c, kept: l, lostEvidence: u } = s,
      d = await (0, __contentScope.Zt)(o, t, r, i),
      f = (0, __contentScope.Vt)(r);
    return (
      c > 0
        ? t.push(f ? `关闭了 ${c} 个公告，但页面仍有遮罩` : `关闭了 ${c} 个公告/弹窗`)
        : d === `gone`
          ? t.push(`已用 Esc 关闭挡住页面的公告弹窗`)
          : l > 0 || d === `functional`
            ? t.push(`保留了 ${Math.max(l, 1)} 个含登录/签到控件的弹窗，未作为公告关闭`)
            : f
              ? d === `failed`
                ? t.push(
                    i.failedButtons.size > 0
                      ? `已尝试的公告关闭按钮未生效，Esc 也未解除遮挡，后续操作仍被挡住`
                      : `当前遮挡层没有可用的公告关闭按钮，Esc 也未解除遮挡`,
                  )
                : t.push(
                    i.failedButtons.size > 0
                      ? `公告关闭按钮未能解除遮挡，未对归属不明的浮层继续按 Esc`
                      : `当前遮挡层没有可安全点击的公告关闭按钮，未对归属不明的浮层按 Esc`,
                  )
              : t.push(`未发现公告弹窗`),
      u && t.push(`关闭弹窗后页面失去签到线索，疑似误关功能弹窗`),
      {
        closed: c,
        blocked: f,
        keptFunctional: Math.max(l, +(d === `functional`)),
      }
    );
  }

  async function B(e, t, n, r = `签到控件`) {
    let i = (0, __contentScope.qe)(e);
    if (!i) return null;
    n.push(`${r}被 ${(0, __contentScope.N)(i)} 遮挡，尝试关闭遮挡的公告`);
    let a = { failedButtons: new Set(), escapedOverlays: new Set() };
    for (let r = 0; r < 2 && i; r += 1) {
      if (
        (await (0, __contentScope.Qt)(t, n, {
          waitForAppear: !1,
          blockedElement: e,
          cleanupState: a,
        }),
        !e.isConnected)
      )
        return (n.push(`公告处理期间页面已重绘，需要重新定位操作控件`), null);
      (e.scrollIntoView({ block: `center` }),
        await (0, __contentScope.w)(r === 0 ? 250 : 450),
        (i = (0, __contentScope.qe)(e)));
    }
    return (i || n.push(`遮挡已清除，继续点击`), i);
  }

  async function tn(e, t) {
    if (e.beforeClick && !(await e.beforeClick()))
      throw Error(`${t}前的人机验证未完成，已停止页面操作`);
  }

  function bn(e, t) {
    if (!t?.trim() || t.includes(`text=`)) return !1;
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  }

  function xn(e, t) {
    return t.some((t) => (0, __contentScope.bn)(e, t));
  }

  function Sn(e) {
    return (e.closest(`form, [role="dialog"], main, section`)?.textContent ?? ``)
      .replace(/\s+/g, ` `)
      .trim()
      .slice(0, 1e3);
  }

  function Cn(e) {
    let t = [...(e.labels ?? [])].map((e) => e.textContent ?? ``);
    return [e.id, e.name, e.placeholder, e.autocomplete, e.getAttribute(`aria-label`), ...t]
      .filter(Boolean)
      .join(` `);
  }

  function wn(e, t, n) {
    let r = [...t.querySelectorAll(`input`)].filter(
        (e) =>
          e !== n &&
          !e.disabled &&
          !e.readOnly &&
          [`text`, `email`, `tel`, ``].includes(e.type.toLowerCase()) &&
          (0, __contentScope.O)(e),
      ),
      a = r
        .map((t) => {
          let n = (0, __contentScope.Cn)(t),
            a = (0, __contentScope.Sn)(t),
            o = (0, __contentScope.bn)(t, e),
            s = 0;
          return (
            o && (s += 220),
            __contentScope.an.test(n) && !o
              ? { element: t, score: -1 / 0 }
              : ((0, __contentScope.xn)(t, __contentScope.i) && (s += 70),
                /^(?:username|email)$/i.test(t.autocomplete) && (s += 120),
                t.type.toLowerCase() === `email` && (s += 90),
                __contentScope.nn.test(n) && (s += 70),
                t.type.toLowerCase() === `text` && (s += 10),
                r.length === 1 && (s += 50),
                __contentScope.cn.test(a) && (s += 30),
                __contentScope.ln.test(a) && !__contentScope.cn.test(a) && (s -= 180),
                __contentScope.rn.test(n) && (s -= 200),
                { element: t, score: s })
          );
        })
        .sort((e, t) => t.score - e.score)[0];
    return !a || a.score < 60
      ? null
      : {
          element: a.element,
          selector: `页面表单语义`,
          fallback: !(0, __contentScope.bn)(a.element, e),
        };
  }

  function Tn(e, t, n) {
    return (0, __contentScope.wn)(e, t, n);
  }

  async function En(e, t, n = document) {
    let r = Date.now() + t;
    for (; Date.now() < r;) {
      let t = (0, __contentScope.V)(e, n);
      if (t) return t;
      await (0, __contentScope.w)(200);
    }
    return null;
  }

  function Dn(e) {
    return (
      (0, __contentScope.V)(e.selectors.password, document) ??
      (0, __contentScope.Tn)(e.selectors.username, document)
    );
  }

  function On(e) {
    const selectors = e.selectors ?? {};
    if ((0, __contentScope.V)(selectors.password, document) && (0, __contentScope.kn)()) return !0;
    let t = (0, __contentScope.Tn)(selectors.username, document);
    if (!t) return !1;
    let n = t.element;
    let r = (0, __contentScope.Cn)(n);
    if (__contentScope.rn.test(r)) return !1;
    if (
      !/^(?:username|email)$/i.test(n.autocomplete) &&
      n.type.toLowerCase() !== `email` &&
      !__contentScope.nn.test(r)
    )
      return !1;
    // A profile's editable email/username is not a login form. Username-only
    // login steps also need a login route, heading, or an actual sign-in action.
    const region = n.form ?? n.closest?.(`form, [role="dialog"], main, section`) ?? document,
      heading = region.querySelector?.(`h1, h2, h3, [role="heading"]`),
      title = heading?.innerText ?? heading?.textContent ?? ``,
      registration = /注册|创建(?:新)?账号|sign\s*up|create\s+(?:an?\s+)?account/i.test(title),
      loginRoute = /(?:^|\/)(?:login|sign-?in)(?:\/|$)/i.test(
        `${location.pathname}${location.hash.replace(/^#/, `/`)}`,
      ),
      loginHeading = /登录|登入|sign\s*in|log\s*in/i.test(title),
      loginAction = [
        ...(region.querySelectorAll?.(`button, [role="button"], input[type="submit"]`) ?? []),
      ].some(
        (control) =>
          (0, __contentScope.O)(control) &&
          /^(?:登录|登陆|登入|立即登录|继续登录|sign\s*in|log\s*in)$/i.test(
            (control.innerText || control.textContent || control.value || ``).trim(),
          ),
      );
    return !registration && (loginRoute || loginHeading || loginAction);
  }

  function kn() {
    return ![...document.querySelectorAll(`input[type="password"]`)]
      .filter((e) => !e.disabled && !e.readOnly && (0, __contentScope.O)(e))
      .some(
        (e) =>
          __contentScope.sn.test((0, __contentScope.Cn)(e)) ||
          e.autocomplete.toLowerCase() === `new-password`,
      );
  }

  function An(e) {
    return (
      ((0, __contentScope.V)(e.selectors.password, document) !== null &&
        (0, __contentScope.kn)()) ||
      (0, __contentScope.nr)() !== null
    );
  }

  async function jn(e, t) {
    let n = Date.now() + t;
    for (; Date.now() < n;) {
      let t = (0, __contentScope.Dn)(e);
      if (t) return t;
      await (0, __contentScope.w)(200);
    }
    return null;
  }

  function Mn(e) {
    let { element: t } = e;
    return t.id
      ? `#${t.id}`
      : t.name
        ? `input[name="${t.name}"]`
        : t.autocomplete
          ? `input[autocomplete="${t.autocomplete}"]`
          : e.selector;
  }

  function isLoginHelpControl(control) {
    return /为什么|为何|如何|怎么|怎样|教程|指南|帮助|文档|常见(?:问答|问题)|问题解答|\b(?:how|why|what|faq|help|documentation|docs?|tutorial|guide)\b|[?？]\s*$/i.test(
      (0, __contentScope.Rn)(control),
    );
  }

  function Nn() {
    let e;
    try {
      e = new URL(location.href);
    } catch {
      return null;
    }
    for (let t of document.querySelectorAll(`a[href]`))
      if ((0, __contentScope.O)(t) && !isLoginHelpControl(t))
        try {
          let n = new URL(t.href, e.href),
            r = n.pathname === e.pathname && n.search === e.search;
          if (n.origin === e.origin && !r && /(?:^|\/)(?:login|sign-?in)(?:\/|$)/i.test(n.pathname))
            return t;
        } catch {}
    return null;
  }

  function In() {
    for (let e of document.querySelectorAll(`button, [role="button"]`)) {
      if (!(0, __contentScope.O)(e) || isLoginHelpControl(e)) continue;
      let t = (0, __contentScope.Rn)(e).replace(/\s+/g, ``).toLowerCase();
      if (
        t &&
        !__contentScope.Fn.some((e) => t.includes(e.replace(/\s+/g, ``))) &&
        (directLoginLabel.test(t) || __contentScope.Pn.some((e) => t.includes(e)))
      )
        return e;
    }
    return null;
  }

  function Ln() {
    let e;
    try {
      e = new URL(location.href);
    } catch {
      return !1;
    }
    return [...document.querySelectorAll(`a[href]`)].some((t) => {
      if (!(0, __contentScope.O)(t)) return !1;
      try {
        let n = new URL(t.href, e.href);
        return (
          n.origin === e.origin && /(?:^|\/)(?:check-?in|daily-check-?in)(?:\/|$)/i.test(n.pathname)
        );
      } catch {
        return !1;
      }
    });
  }

  function Rn(e) {
    return [
      e.textContent,
      e.getAttribute(`value`),
      e.getAttribute(`aria-label`),
      e.getAttribute(`title`),
    ]
      .filter(Boolean)
      .join(` `)
      .trim();
  }

  function zn(e) {
    let t = typeof e.className == `string` ? e.className : ``,
      n = e instanceof HTMLAnchorElement ? e.href : ``;
    return [(0, __contentScope.Rn)(e), e.id, t, n]
      .filter(Boolean)
      .join(` `)
      .replace(/\s+/g, ` `)
      .trim();
  }

  function Bn(e) {
    return (
      (0, __contentScope.Rn)(e).replace(/\s+/g, ` `).trim() ||
      (0, __contentScope.zn)(e) ||
      e.tagName.toLowerCase()
    );
  }

  function Vn() {
    for (let e of [
      `[role="alert"]`,
      `.semi-toast-content`,
      `.semi-notification-content`,
      `.ant-message-notice-content`,
      `.ant-notification-notice-message`,
    ]) {
      let t = [...document.querySelectorAll(e)]
        .find((e) => (0, __contentScope.O)(e))
        ?.innerText?.replace(/\s+/g, ` `)
        .trim();
      if (t) return t.slice(0, 160);
    }
    return null;
  }

  function Un() {
    let e = (0, __contentScope.Vn)();
    return e && __contentScope.Hn.test(e) ? e : null;
  }

  function Wn() {
    return performance.getEntriesByType(`resource`).some((e) => {
      try {
        return /\/api\/user\/login(?:[/?#]|$)/i.test(new URL(e.name, location.href).pathname);
      } catch {
        return !1;
      }
    });
  }

  function Gn(e) {
    let t = (0, __contentScope.zn)(e),
      n = /\/(?:oauth|auth|sso)(?:\/|$)|github\.com\/login\/oauth/i.test(t),
      r = __contentScope.vn.test(t),
      i = __contentScope.hn.test(t),
      a = __contentScope._n.test(t),
      o = __contentScope.gn.test(t),
      s = e instanceof HTMLAnchorElement && !n,
      c = 0;
    return (
      (i && (!s || r)) || (a && (!s || r))
        ? (c += 180)
        : o && (!s || r)
          ? (c += 140)
          : (i || a || o) && (c += 40),
      r && (c += 90),
      n && (c += 80),
      e instanceof HTMLAnchorElement && (c += 10),
      e instanceof HTMLInputElement && e.type === `submit` && (c -= 80),
      __contentScope.un.test((0, __contentScope.Rn)(e)) && (c -= 120),
      __contentScope.yn.test(t) && (c -= 180),
      c
    );
  }

  function Kn(e) {
    return (
      [
        ...document.querySelectorAll(
          `button, a[href], [role="button"], input[type="button"], input[type="submit"]`,
        ),
      ]
        .filter((e) => (0, __contentScope.O)(e) && !isLoginHelpControl(e))
        .filter((t) => {
          let n = (0, __contentScope.zn)(t);
          return e === `github`
            ? __contentScope.hn.test(n)
            : e !== `passkey` || __contentScope._n.test(n);
        })
        .map((e) => ({
          element: e,
          score: (0, __contentScope.Gn)(e),
          label: (0, __contentScope.Bn)(e),
          disabled: (0, __contentScope.H)(e),
        }))
        .filter(({ score: e }) => e >= 100)
        .sort(
          (e, t) =>
            Number(e.disabled) - Number(t.disabled) ||
            t.score - e.score ||
            e.label.length - t.label.length,
        )[0]?.element ?? null
    );
  }

  function describeLoginControl(control) {
    if (!(0, __contentScope.O)(control) || isLoginHelpControl(control)) return null;
    const matchText = (0, __contentScope.Rn)(control).replace(/\s+/g, ` `).trim().slice(0, 120);
    if (directLoginLabel.test(matchText)) return null;
    let hrefPath = ``,
      url = null;
    try {
      if (control instanceof HTMLAnchorElement && control.href) {
        url = new URL(control.href, location.href);
        if (![`http:`, `https:`].includes(url.protocol)) return null;
        hrefPath = url.pathname;
      }
    } catch {
      return null;
    }
    const semantic = [
      matchText,
      control.id,
      typeof control.className === `string` ? control.className : ``,
      url ? `${url.hostname}${url.pathname}` : ``,
    ]
      .filter(Boolean)
      .join(` `);
    if (
      /注册|忘记|重置|找回|修改|退出|注销|帮助|文档|绑定|解绑|关联账号|账号设置|账户设置|管理密钥|添加密钥|sign\s*up|register|forgot|reset|recover|log[\s-]?out|sign[\s-]?out|documentation|settings|manage|disconnect|(?:link|unlink)\s+(?:an?\s+)?account/i.test(
        matchText,
      )
    )
      return null;
    const authPath = /\/(?:oauth|auth|sso|login|signin|sign-in|connect)(?:\/|$)/i.test(hrefPath),
      intent =
        /登录|登陆|登入|授权|第三方|继续|sign[\s-]?in|log[\s-]?in|continue\s*with|oauth|openid|oidc|sso/i.test(
          matchText,
        ),
      providers = [
        [`github`, `GitHub`, /git\s*hub/i],
        [`google`, `Google`, /google|谷歌/i],
        [`linuxdo`, `Linux DO`, /linux[\s_-]*do|connect\.linux\.do/i],
        [`discord`, `Discord`, /discord/i],
        [`microsoft`, `Microsoft`, /microsoft|微软|azure|live\.com|office\s*365/i],
        [`apple`, `Apple`, /apple|苹果/i],
        [`telegram`, `Telegram`, /telegram|电报/i],
        [`wechat`, `微信`, /wechat|weixin|微信/i],
        [`qq`, `QQ`, /(?:^|[\s/._-])qq(?:$|[\s/._-])/i],
        [`gitlab`, `GitLab`, /gitlab/i],
        [`facebook`, `Facebook`, /facebook/i],
        [`twitter`, `X / Twitter`, /twitter|(?:^|\s)x(?:\s|$)/i],
      ];
    if (/passkey|webauthn|security\s*key|通行密钥|安全密钥|生物识别/i.test(semantic)) {
      return {
        key: `passkey:passkey`,
        method: `passkey`,
        provider: `passkey`,
        label: `Passkey / 通行密钥`,
        matchText,
        ...(hrefPath ? { hrefPath } : {}),
      };
    }
    const code =
        /验证码登录|校验码登录|动态码登录|邮箱验证码|邮件验证码|短信验证码|邮箱.*(?:验证码|链接)|email.*(?:code|magic\s*link)|(?:sign[\s-]?in|log[\s-]?in).*(?:code|magic\s*link)|one[\s-]?time\s*(?:code|password)|magic\s*link/i.test(
          matchText,
        ),
      qr = /扫码登录|二维码登录|scan.*(?:qr|log[\s-]?in)|qr.*(?:sign[\s-]?in|log[\s-]?in)/i.test(
        matchText,
      );
    if (code || qr) {
      const provider = qr
          ? `qrcode`
          : /短信|手机|sms|phone/i.test(matchText)
            ? `sms-code`
            : `email-code`,
        label = qr ? `扫码登录` : provider === `sms-code` ? `短信验证码` : `邮箱验证码 / 登录链接`;
      return {
        key: `manual:${provider}`,
        method: `manual`,
        provider,
        label,
        matchText,
        ...(hrefPath ? { hrefPath } : {}),
      };
    }
    const provider = providers.find(([, , pattern]) => pattern.test(semantic));
    if (provider) {
      const [name, label] = provider,
        normalizedLabel = matchText
          .replace(/(?:账号|账户|account)$/i, ``)
          .replace(/[\s._/-]/g, ``)
          .toLowerCase(),
        bareProvider = [name, label].some(
          (value) => value.replace(/[\s._/-]/g, ``).toLowerCase() === normalizedLabel,
        ),
        method = name === `github` ? `github` : `oauth`;
      if (!authPath && !intent && !bareProvider) return null;
      if (control instanceof HTMLAnchorElement && !authPath && !intent) return null;
      return {
        key: `${method}:${name}`,
        method,
        provider: name,
        label,
        matchText,
        ...(hrefPath ? { hrefPath } : {}),
      };
    }
    const authorizationAction =
      /^(?:第三方(?:账号)?登录|授权(?:登录|并登录)?|(?:使用|通过|用).+(?:登录|登陆|登入|继续)|(?:sign[\s-]?in|log[\s-]?in)\s+with\s+.+|continue\s+with\s+.+|(?:oauth|openid|oidc|sso)(?:\s+(?:login|sign[\s-]?in))?)[.!。！›»>→]*$/i.test(
        matchText,
      );
    if (!authPath && !authorizationAction) return null;
    let hash = 2166136261;
    for (const char of `${matchText}|${hrefPath}`)
      hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    return {
      key: `oauth:oauth:${(hash >>> 0).toString(36)}`,
      method: `oauth`,
      provider: `oauth`,
      label: matchText || `第三方授权`,
      ...(matchText ? { matchText } : {}),
      ...(hrefPath ? { hrefPath } : {}),
    };
  }

  function findSelectedLoginControl(entry, method = entry?.method) {
    if (!entry || entry.method !== method) return null;
    const matches = [
      ...document.querySelectorAll(
        `button, a[href], [role="button"], input[type="button"], input[type="submit"]`,
      ),
    ]
      .map((control) => ({ control, candidate: (0, __contentScope.describeLoginControl)(control) }))
      .filter(
        ({ candidate }) => candidate?.method === method && candidate.provider === entry.provider,
      )
      .filter(({ candidate }) => {
        if (entry.provider !== `oauth`) return !0;
        if (entry.matchText) return candidate.matchText === entry.matchText;
        return !!entry.hrefPath && candidate.hrefPath === entry.hrefPath && !candidate.matchText;
      })
      .sort((left, right) => {
        const score = ({ control, candidate }) =>
          (entry.matchText && candidate.matchText === entry.matchText ? 4 : 0) +
          (entry.hrefPath && candidate.hrefPath === entry.hrefPath ? 2 : 0) -
          ((0, __contentScope.H)(control) ? 16 : 0);
        return score(right) - score(left);
      });
    if (entry.provider === `oauth` && !entry.matchText && matches.length !== 1) return null;
    return matches[0]?.control ?? null;
  }

  function collectLoginEntries() {
    const entries = new Map();
    for (const control of document.querySelectorAll(
      `button, a[href], [role="button"], input[type="button"], input[type="submit"]`,
    )) {
      const entry = (0, __contentScope.describeLoginControl)(control);
      if (entry && !entries.has(entry.key)) entries.set(entry.key, entry);
    }
    return [...entries.values()];
  }

  async function qn(e, t, n) {
    let r = Date.now() + t,
      i = null;
    for (; Date.now() < r;) {
      let selected = e.loginEntry?.method === n ? e.loginEntry : null,
        t = selected ? `` : e.oauthButtonSelector?.trim(),
        r = selected
          ? (0, __contentScope.findSelectedLoginControl)(selected, n)
          : t
            ? (0, __contentScope.D)(t)
            : (0, __contentScope.Kn)(n);
      if (r && (0, __contentScope.O)(r)) {
        let e = { element: r, automatic: !t, selected: !!selected };
        if (!(0, __contentScope.H)(r)) return e;
        i = e;
      }
      await (0, __contentScope.w)(200);
    }
    return i;
  }

  function Jn(e) {
    let t = [...(e.labels ?? [])].map((e) => e.textContent ?? ``),
      n = (e.getAttribute(`aria-labelledby`) ?? ``)
        .split(/\s+/)
        .filter(Boolean)
        .map((e) => document.getElementById(e)?.textContent ?? ``);
    return [
      e.id,
      e.name,
      e.getAttribute(`aria-label`),
      e.closest(`label`)?.textContent,
      e.closest(`.semi-checkbox`)?.textContent,
      e.parentElement?.textContent,
      ...t,
      ...n,
    ]
      .filter(Boolean)
      .join(` `)
      .replace(/\s+/g, ` `)
      .trim();
  }

  function Yn(e) {
    return (0, __contentScope.O)(e)
      ? e
      : ([
          e.closest(`label`),
          e.closest(`[role="checkbox"]`),
          e.closest(`.semi-checkbox`),
          e.parentElement,
        ].find((e) => !!e && (0, __contentScope.O)(e)) ?? null);
  }

  function Xn(e) {
    return __contentScope.mn.test((0, __contentScope.Jn)(e));
  }

  function Zn(e) {
    return [
      (0, __contentScope.Rn)(e),
      e.id,
      e.closest(`label`)?.textContent,
      e.parentElement?.textContent,
    ]
      .filter(Boolean)
      .join(` `)
      .replace(/\s+/g, ` `)
      .trim();
  }

  function Qn(e) {
    return [...e.querySelectorAll(`input[type="checkbox"]`)].some(
      (e) =>
        !e.disabled &&
        !e.checked &&
        !!(0, __contentScope.Yn)(e) &&
        __contentScope.pn.test((0, __contentScope.Jn)(e)) &&
        !(0, __contentScope.Xn)(e),
    )
      ? !0
      : [...e.querySelectorAll(`[role="checkbox"]`)].some(
          (e) =>
            (0, __contentScope.O)(e) &&
            e.getAttribute(`aria-checked`) !== `true` &&
            !(0, __contentScope.H)(e) &&
            __contentScope.pn.test((0, __contentScope.Zn)(e)) &&
            !__contentScope.mn.test((0, __contentScope.Zn)(e)),
        );
  }

  async function $n(e, t) {
    let n = [...e.querySelectorAll(`input[type="checkbox"]`)].find((e) => {
      if (e.disabled || e.checked || !(0, __contentScope.Yn)(e)) return !1;
      let t = (0, __contentScope.Jn)(e);
      return __contentScope.pn.test(t) && !__contentScope.mn.test(t);
    });
    if (!n) {
      let n = [...e.querySelectorAll(`[role="checkbox"]`)].find((e) => {
        if (
          !(0, __contentScope.O)(e) ||
          e.getAttribute(`aria-checked`) === `true` ||
          (0, __contentScope.H)(e)
        )
          return !1;
        let t = (0, __contentScope.Zn)(e);
        return __contentScope.pn.test(t) && !__contentScope.mn.test(t);
      });
      return !n ||
        (await (0, __contentScope.M)(n),
        await (0, __contentScope.w)(100),
        !(
          n.getAttribute(`aria-checked`) === `true` ||
          n.querySelector(`input[type="checkbox"]:checked`)
        ))
        ? !1
        : (t.push(`已勾选登录协议与隐私政策`), !0);
    }
    if (((0, __contentScope.Me)(n), !n.checked)) {
      let e = (0, __contentScope.Yn)(n);
      e && e !== n && (await (0, __contentScope.M)(e));
    }
    return !n.checked && n.getAttribute(`aria-checked`) !== `true`
      ? !1
      : (t.push(`已勾选登录协议与隐私政策`), !0);
  }

  function er(e, t) {
    let n = (0, __contentScope.D)(e),
      r = [...t.querySelectorAll(`button, input[type="submit"], [role="button"]`)]
        .filter((e) => (0, __contentScope.O)(e))
        .map((t) => {
          let r = (0, __contentScope.Rn)(t),
            i = t.getAttribute(`type`)?.toLowerCase(),
            a = 0;
          return (
            (t === n || (0, __contentScope.bn)(t, e)) && (a += 180),
            i === `submit` && (a += 90),
            __contentScope.un.test(r) && (a += 90),
            __contentScope.dn.test(r) && (a += 60),
            __contentScope.fn.test(r) && (a -= 200),
            __contentScope.ln.test(r) && (a -= 120),
            t.hasAttribute(`aria-expanded`) && (a -= 100),
            {
              element: t,
              score: a,
              fallback: t !== n && !(0, __contentScope.bn)(t, e),
            }
          );
        })
        .sort((e, t) => t.score - e.score)[0];
    return r && r.score >= 80 ? { element: r.element, fallback: r.fallback } : null;
  }

  async function tr(e, t, n) {
    let r = Date.now() + n;
    for (; Date.now() < r;) {
      let n = (0, __contentScope.er)(e, t);
      if (n) return n;
      await (0, __contentScope.w)(200);
    }
    return null;
  }

  function nr() {
    return (0, __contentScope.D)(__contentScope.$t) ||
      (typeof __contentScope.zp === `function` && (0, __contentScope.zp)())
      ? `二次验证验证码`
      : null;
  }

  function rr(e) {
    try {
      let t = new URL(e.loginUrl),
        n = new URL(location.href),
        r = (e) => e.replace(/\/+$/, ``) || `/`;
      if (n.origin !== t.origin) return !1;
      let i = `${n.pathname}${n.hash}`;
      if (__contentScope.en.test(i)) return !1;
      if (r(n.pathname) !== r(t.pathname)) return !0;
      let a = r(t.hash.replace(/^#/, ``)),
        o = r(n.hash.replace(/^#/, ``));
      return a !== `/` && o !== `/` && o !== a;
    } catch {
      return !1;
    }
  }

  function ir(e) {
    return (0, __contentScope.ar)(e);
  }

  function ar(e) {
    return classifyLoginState((0, __contentScope.readLoginSnapshot)(e)).status === `authenticated`;
  }

  function readLoginSnapshot(site) {
    const visible = (selector) => {
        if (!selector) return !1;
        const control = (0, __contentScope.D)(selector);
        return !!control && (0, __contentScope.O)(control);
      },
      authenticationRoute = /(?:^|\/)(?:login|sign-?in|auth|oauth|callback)(?:\/|$)/i.test(
        `${location.pathname}${location.hash.replace(/^#/, `/`)}`,
      ),
      profileEditorContext =
        /(?:^|\/)(?:profile|personal|settings|account(?:-settings)?|security-password)(?:\/|$)/i.test(
          location.pathname,
        ),
      siteEvidence = readSiteLoginEvidence(site, document, location, (node) =>
        (0, __contentScope.O)(node),
      ),
      logoutControl = (0, __contentScope.hasVisibleLogoutControl)(site, siteEvidence),
      authenticationFormHeading = [
        ...(document.querySelectorAll?.(`form, [role="dialog"]`) ?? []),
      ].some((region) => {
        if (!(0, __contentScope.O)(region)) return !1;
        const heading = region.querySelector?.(`h1, h2, h3, [role="heading"]`),
          title = [region.getAttribute?.(`aria-label`), heading?.innerText ?? heading?.textContent]
            .filter(Boolean)
            .join(` `);
        return (
          /登录|登入|sign\s*in|log\s*in/i.test(title) &&
          !/修改|重置|change|reset|update/i.test(title)
        );
      }),
      loginForm =
        (0, __contentScope.On)(site) &&
        (!profileEditorContext || authenticationRoute || authenticationFormHeading),
      providerEntry = [
        ...document.querySelectorAll(
          `button, a[href], [role="button"], input[type="button"], input[type="submit"]`,
        ),
      ].some(
        (control) =>
          !control.closest?.(`footer, [role="contentinfo"]`) &&
          !!(0, __contentScope.describeLoginControl)(control),
      ),
      loginLink = (0, __contentScope.Nn)(),
      loginButton = (0, __contentScope.In)(),
      loginEntry =
        providerEntry ||
        (!!loginButton && !loginButton.closest?.(`footer, [role="contentinfo"]`)) ||
        (!!loginLink && !loginLink.closest?.(`footer, [role="contentinfo"]`)),
      secondFactor = (0, __contentScope.nr)(),
      challenge = typeof __contentScope.Nu === `function` ? (0, __contentScope.Nu)(!1) : null,
      completionRequired = [
        ...(document.querySelectorAll?.(`form, [role="dialog"], main`) ?? []),
      ].some((region) => {
        if (!(0, __contentScope.O)(region)) return !1;
        const heading = region.querySelector?.(`h1, h2, h3, [role="heading"]`),
          title = heading?.innerText ?? heading?.textContent ?? ``;
        return (
          /^(?:完成(?:注册|资料|账号设置)|补充(?:资料|信息)|绑定(?:邮箱|手机)|注册|创建(?:新)?账号|complete\s+(?:your\s+)?(?:profile|account|registration)|finish\s+(?:registration|setup)|create\s+(?:an?\s+)?account|sign\s*up)/i.test(
            title.trim(),
          ) &&
          [...(region.querySelectorAll?.(`input, select, textarea`) ?? [])].some(
            (input) =>
              !input.disabled &&
              !input.readOnly &&
              input.type !== `hidden` &&
              (0, __contentScope.O)(input),
          )
        );
      }),
      failureNodes = document.querySelectorAll?.(
        `[role="alert"], [aria-live="assertive"], .error-message, .semi-toast-content, .semi-notification-content, .ant-message-notice-content, .ant-notification-notice-message`,
      ),
      authenticationContext =
        loginForm ||
        authenticationRoute ||
        (loginEntry && !logoutControl && !siteEvidence.accountShellVisible),
      loginError = [
        (0, __contentScope.Un)(),
        ...[...(failureNodes ?? [])]
          .filter((node) => (0, __contentScope.O)(node))
          .map((node) => node.innerText || node.textContent || ``),
      ]
        .filter(Boolean)
        .map((text) => text.replace(/\s+/g, ` `).trim())
        .find((text) => {
          if (
            /登录(?:状态|会话)?.{0,16}(?:已失效|已过期|过期)|(?:当前|登录)?会话.{0,16}(?:过期|失效)|请重新登录|\b(?:your\s+)?(?:login\s+)?session\s+(?:has\s+)?expired\b|(?:log|sign)\s*in\s+again/i.test(
              text,
            )
          )
            return !0;
          if (
            profileEditorContext &&
            !authenticationContext &&
            /密码|password|绑定|解绑|\bbind\b|\bunlink\b|\bconnect\b/i.test(text)
          )
            return !1;
          if (authenticationContext) return __contentScope.Hn.test(text);
          if (
            /签到|打卡|抽奖|余额|额度|领取|兑换|check[\s-]?in|daily\s+(?:bonus|reward)|balance|quota|points|credits|claim/i.test(
              text,
            )
          )
            return !1;
          return /(?:用户名|账号|邮箱|密码|凭据).{0,16}(?:错误|不正确|无效|不存在|锁定)|(?:invalid|incorrect|wrong|bad).{0,16}(?:password|credentials?)|(?:password|credentials?).{0,16}(?:invalid|incorrect|wrong)|(?:登录|authentication|authorization|oauth).{0,24}(?:失败|拒绝|failed|denied|rejected)/i.test(
            text,
          );
        })
        ?.slice(0, 160);
    return {
      sameOrigin: location.origin === (0, __contentScope.Dr)(site),
      loginForm,
      loginEntry,
      secondFactor,
      challenge,
      completionRequired,
      loginError,
      successIndicator: visible(site.successIndicator),
      logoutControl,
      logoutSource: siteEvidence.logoutSource,
      accountShellVisible: siteEvidence.accountShellVisible,
      accountShellSource: siteEvidence.accountShellSource,
      checkinControl:
        site.checkin?.method === `button` &&
        (visible(site.checkin.buttonSelector) || visible(site.checkin.alreadySelector)),
    };
  }

  async function readLoginState(site, options = {}) {
    const resolver = new LoginStateResolver({
      readPage: (selected) => (0, __contentScope.readLoginSnapshot)(selected),
      readIdentity: (selected, readOptions) =>
        (0, __contentScope.qi)(selected, void 0, readOptions),
      sleep: (ms) => (0, __contentScope.w)(ms),
    });
    return resolver.wait(withSiteIdentityRecipe(site), options);
  }

  async function U(e, t, n) {
    await (0, __contentScope.Qt)(e, t, n);
  }

  async function lr(e) {
    let t = document.body?.innerText ?? ``;
    if (!__contentScope.sr.test(t)) return !1;
    for (let t of document.querySelectorAll(`button, [role="button"]`)) {
      if (!(0, __contentScope.O)(t)) continue;
      let n = (t.innerText || t.textContent || ``).trim(),
        r = n.replace(/\s+/g, ``).toLowerCase();
      if (
        r &&
        !__contentScope.cr.test(r) &&
        __contentScope.or.some((e) => r.includes(e.replace(/\s+/g, ``).toLowerCase()))
      ) {
        try {
          await (0, __contentScope.M)(t);
        } catch {
          (0, __contentScope.Me)(t);
        }
        return (
          e.push(`已点击「${n.slice(0, 20)}」同意必需条款以解锁登录`),
          await (0, __contentScope.w)(800),
          !0
        );
      }
    }
    return !1;
  }

  async function ur(e, t = document, n = {}) {
    if (
      __contentScope.sr.test(document.body?.innerText ?? ``) &&
      [...document.querySelectorAll(`button, [role="button"]`)].some((e) => {
        if (!(0, __contentScope.O)(e)) return !1;
        let t = (e.innerText || e.textContent || ``).trim().replace(/\s+/g, ``).toLowerCase();
        return (
          !!t &&
          !__contentScope.cr.test(t) &&
          __contentScope.or.some((e) => t.includes(e.replace(/\s+/g, ``).toLowerCase()))
        );
      })
    ) {
      let e = n.beforeAuxiliaryClick ?? n.beforeClick;
      if (e && !(await e())) throw Error(`处理登录协议前的人机验证未完成，已停止页面操作`);
    }
    let r = await (0, __contentScope.lr)(e);
    if ((0, __contentScope.Qn)(t) || (t !== document && (0, __contentScope.Qn)(document))) {
      let e = n.beforeAuxiliaryClick ?? n.beforeClick;
      if (e && !(await e())) throw Error(`勾选登录协议前的人机验证未完成，已停止页面操作`);
    }
    let i =
      (await (0, __contentScope.$n)(t, e)) ||
      (t !== document && (await (0, __contentScope.$n)(document, e)));
    return (i && (await (0, __contentScope.w)(200)), r || i);
  }

  async function dr(e, t, n, r = `账密表单入口`) {
    let i = await (0, __contentScope.B)(e, t, n, r);
    if (i) n.push(`${r}仍被 ${(0, __contentScope.N)(i)} 遮挡，改用 DOM 点击`);
    else
      try {
        await (0, __contentScope.M)(e);
        return;
      } catch (e) {
        n.push(`可信点击${r}失败（${e instanceof Error ? e.message : String(e)}），改用 DOM 点击`);
      }
    (0, __contentScope.Me)(e);
  }

  function fr(e) {
    let t = (e.preLoginClickSelectors ?? []).map((e) => e.trim()).filter(Boolean),
      n = e.preLoginClickSelector?.trim();
    return (n && t.at(-1) !== n && t.push(n), t);
  }

  async function pr(e, t, n = {}) {
    if ((await (0, __contentScope.ur)(t, document, n), (0, __contentScope.Dn)(e))) {
      t.push(`账密表单已可见，无需前置点击`);
      return;
    }
    let r = (0, __contentScope.fr)(e);
    for (let [i, a] of r.entries()) {
      let o = await (0, __contentScope.k)(a, 6e3);
      if (o) {
        if (
          (await (0, __contentScope.tn)(n, `展开账密表单`),
          (o = await (0, __contentScope.k)(a, 6e3)),
          !o)
        )
          throw Error(`完成人机验证后账密表单入口已不存在`);
        if (
          (await (0, __contentScope.dr)(o, e, t),
          t.push(`已点击「${o.textContent?.trim().slice(0, 20)}」展开账密表单`),
          i === r.length - 1 ? await (0, __contentScope.jn)(e, 5e3) : (0, __contentScope.Dn)(e))
        )
          return;
      } else t.push(`未找到前置按钮(${a})，继续查找登录页入口`);
    }
    let i = (0, __contentScope.In)();
    if (((i &&= (await (0, __contentScope.tn)(n, `展开账密表单`), (0, __contentScope.In)())), i)) {
      let n = (i.innerText || i.textContent || ``).trim().slice(0, 20);
      if (
        (await (0, __contentScope.dr)(i, e, t),
        t.push(`已点击「${n}」展开账密表单`),
        await (0, __contentScope.jn)(e, 5e3))
      )
        return;
    }
    let a = (0, __contentScope.Nn)();
    if (!a) return;
    if ((await (0, __contentScope.tn)(n, `进入登录页`), (a = (0, __contentScope.Nn)()), !a))
      throw Error(`完成人机验证后登录页入口已不存在`);
    let o = new URL(a.href, location.href);
    t.push(`当前页没有账密表单，已进入登录页: ${o.pathname}`);
    let s = await (0, __contentScope.B)(a, e, t, `登录页入口`);
    if (s) throw Error(`登录页入口被${(0, __contentScope.N)(s)}遮挡，可能有未关闭的公告弹窗`);
    if (((a = (0, __contentScope.Nn)()), !a)) throw Error(`关闭遮挡后登录页入口已不存在`);
    (await (0, __contentScope.M)(a, { mayNavigate: !0 }), await (0, __contentScope.jn)(e, 5e3));
  }

  async function mr(e, t, n, r = {}) {
    await (0, __contentScope.ur)(t, document, r);
    let selected = e.loginEntry?.method === n ? e.loginEntry : null,
      i = selected ? `` : e.oauthButtonSelector?.trim(),
      a = () =>
        selected
          ? (0, __contentScope.findSelectedLoginControl)(selected, n)
          : i
            ? (0, __contentScope.D)(i)
            : (0, __contentScope.Kn)(n),
      o = a();
    if (o && (0, __contentScope.O)(o)) {
      t.push(`第三方登录入口已可见，无需展开账密表单`);
      return;
    }
    let s = (0, __contentScope.fr)(e);
    for (let n of i ? s : []) {
      let i = await (0, __contentScope.k)(n, 6e3);
      if (i && (0, __contentScope.O)(i)) {
        if (
          (await (0, __contentScope.tn)(r, `展开第三方登录入口`),
          (i = await (0, __contentScope.k)(n, 6e3)),
          !i)
        )
          throw Error(`完成人机验证后第三方登录入口已不存在`);
        let o = (i.innerText || i.textContent || ``).replace(/\s+/g, ` `).trim().slice(0, 20);
        (await (0, __contentScope.dr)(i, e, t, `第三方登录入口`),
          t.push(`已点击「${o}」展开第三方登录入口`));
        let s = a();
        if (s && (0, __contentScope.O)(s)) return;
        t.push(`点击第三方登录入口后 OAuth 按钮仍未出现，继续查找登录页入口`);
      }
    }
    let c = (0, __contentScope.Nn)();
    if (!c) return;
    if ((await (0, __contentScope.tn)(r, `进入第三方登录页`), (c = (0, __contentScope.Nn)()), !c))
      throw Error(`完成人机验证后第三方登录页入口已不存在`);
    let l = new URL(c.href, location.href);
    t.push(`当前页没有第三方登录入口，已进入登录页: ${l.pathname}`);
    let u = await (0, __contentScope.B)(c, e, t, `第三方登录页入口`);
    if (u) throw Error(`第三方登录页入口被${(0, __contentScope.N)(u)}遮挡，可能有未关闭的公告弹窗`);
    if (((c = (0, __contentScope.Nn)()), !c)) throw Error(`关闭遮挡后第三方登录页入口已不存在`);
    await (0, __contentScope.M)(c, { mayNavigate: !0 });
  }

  async function hr(e, t, n, r, i, a) {
    let o = Date.now() + 1e4,
      s = null,
      c = null;
    for (
      ;
      Date.now() < o &&
      ((s = (0, __contentScope.V)(e.selectors.password, document)),
      !(s || ((c = (0, __contentScope.Tn)(e.selectors.username, document)), c)));
    )
      await (0, __contentScope.w)(200);
    if (
      ((s = (0, __contentScope.V)(e.selectors.password, document)),
      (c = s
        ? (0, __contentScope.Tn)(e.selectors.username, s.element.form ?? document, s.element)
        : (0, __contentScope.Tn)(e.selectors.username, document)),
      s)
    ) {
      if ((s.element.form, c)) {
        if (
          (c.fallback && r.push(`已通过页面语义识别用户名输入框: ${(0, __contentScope.Mn)(c)}`),
          (0, __contentScope.A)(c.element, t),
          r.push(`已填写用户名`),
          await (0, __contentScope.w)(120),
          (s = (0, __contentScope.V)(e.selectors.password, document)),
          !s)
        )
          return (r.push(`填写用户名后密码输入框已不存在`), !1);
      } else r.push(`当前是密码步骤，页面未要求再次填写用户名`);
      return (
        s.fallback && r.push(`已通过页面语义识别密码输入框: ${(0, __contentScope.Mn)(s)}`),
        (0, __contentScope.A)(s.element, n),
        r.push(`已填写密码`),
        !0
      );
    }
    if (!c) return (r.push(`页面能力扫描未找到可用的用户名或密码输入框`), !1);
    if (
      (c.fallback && r.push(`已通过页面语义识别用户名输入框: ${(0, __contentScope.Mn)(c)}`),
      (0, __contentScope.A)(c.element, t),
      r.push(`已填写用户名，等待页面显示密码步骤`),
      await (0, __contentScope.w)(250),
      (s = (0, __contentScope.V)(e.selectors.password, document)),
      !s)
    ) {
      let t = c.element.form ?? document,
        n = await (0, __contentScope.tr)(e.selectors.submit, t, 5e3);
      if (!n) return (r.push(`用户名步骤后未找到语义明确的「继续/下一步」控件`), !1);
      if ((await (0, __contentScope.ur)(r, t, { beforeClick: a ?? i }), (await i?.()) === !1))
        return (r.push(`用户名步骤前的安全验证未完成`), !1);
      let o = (0, __contentScope.Tn)(e.selectors.username, document)?.element.form ?? document,
        l = await (0, __contentScope.tr)(e.selectors.submit, o, 5e3);
      if (!l) return (r.push(`安全验证完成后用户名步骤的继续按钮已不存在`), !1);
      n = l;
      let u = Date.now() + 3e3;
      for (; (0, __contentScope.H)(n.element) && Date.now() < u;)
        (await (0, __contentScope.w)(150),
          (n = (0, __contentScope.er)(e.selectors.submit, o) ?? n));
      if ((0, __contentScope.H)(n.element))
        return (r.push(`用户名步骤的继续按钮仍处于禁用状态`), !1);
      let d = await (0, __contentScope.B)(n.element, e, r, `用户名步骤控件`);
      if (d) return (r.push(`用户名步骤控件被${(0, __contentScope.N)(d)}遮挡，已停止继续操作`), !1);
      let f = (0, __contentScope.Tn)(e.selectors.username, document),
        p = (0, __contentScope.er)(e.selectors.submit, f?.element.form ?? document);
      if (!p || (0, __contentScope.H)(p.element))
        return (r.push(`关闭遮挡后用户名步骤的继续按钮已不存在或不可用`), !1);
      ((n = p),
        r.push(`已识别并点击用户名步骤控件: ${(0, __contentScope.Bn)(n.element).slice(0, 30)}`),
        await (0, __contentScope.M)(n.element, { mayNavigate: !0 }),
        (s = await (0, __contentScope.En)(e.selectors.password, 8e3)));
    }
    return s
      ? ((s = (0, __contentScope.V)(e.selectors.password, document)),
        s
          ? (s.fallback && r.push(`已通过页面语义识别密码输入框: ${(0, __contentScope.Mn)(s)}`),
            (0, __contentScope.A)(s.element, n),
            r.push(`已填写密码`),
            !0)
          : (r.push(`密码输入框已不存在`), !1))
      : (r.push(`完成用户名步骤后仍未出现可识别的密码输入框`), !1);
  }

  async function gr(e, t, n = {}) {
    await (0, __contentScope.w)(200);
    let r = (0, __contentScope.V)(e.selectors.password, document),
      i = r?.element.form ?? document,
      a = await (0, __contentScope.tr)(e.selectors.submit, i, 5e3);
    if (a) {
      if ((await (0, __contentScope.ur)(t, i, n), n.beforeClick && !(await n.beforeClick())))
        return (t.push(`登录提交前的安全验证未完成，已停止点击`), !1);
      if (
        ((r = (0, __contentScope.V)(e.selectors.password, document)),
        (i = r?.element.form ?? document),
        (a = await (0, __contentScope.tr)(e.selectors.submit, i, 5e3)),
        !a)
      )
        return (t.push(`安全验证完成后找不到登录按钮`), !1);
      let o = a.element,
        s = Date.now() + 3e3;
      for (; (0, __contentScope.H)(o) && Date.now() < s;)
        (await (0, __contentScope.w)(150),
          (a = (0, __contentScope.er)(e.selectors.submit, i) ?? a),
          (o = a.element));
      if ((0, __contentScope.H)(o))
        return (t.push(`登录按钮仍处于禁用状态，页面可能还有未满足的校验项`), !1);
      let c = await (0, __contentScope.B)(a.element, e, t, `登录按钮`);
      if (c) return (t.push(`登录按钮被${(0, __contentScope.N)(c)}遮挡，停止本次提交`), !1);
      if (
        ((r = (0, __contentScope.V)(e.selectors.password, document)),
        (i = r?.element.form ?? document),
        (a = await (0, __contentScope.tr)(e.selectors.submit, i, 1500)),
        !a)
      )
        return (t.push(`关闭遮挡后找不到登录按钮`), !1);
      if (((o = a.element), (0, __contentScope.H)(o)))
        return (t.push(`关闭遮挡后登录按钮变为禁用状态，未执行提交`), !1);
      let l = await (0, __contentScope.B)(a.element, e, t, `登录按钮`);
      if (l) return (t.push(`登录按钮被${(0, __contentScope.N)(l)}遮挡，停止本次提交`), !1);
      if (
        ((r = (0, __contentScope.V)(e.selectors.password, document)),
        (i = r?.element.form ?? document),
        (a = await (0, __contentScope.tr)(e.selectors.submit, i, 1500)),
        !a)
      )
        return (t.push(`最终点击前找不到登录按钮`), !1);
      if (((o = a.element), (0, __contentScope.H)(o)))
        return (t.push(`最终点击前登录按钮变为禁用状态，未执行提交`), !1);
      (a.fallback && t.push(`配置的登录按钮选择器未命中，已通过表单语义识别`),
        t.push(`已点击登录按钮`),
        await n.beforeNavigate?.());
      let u = await (0, __contentScope.M)(a.element, { mayNavigate: !0 });
      if (
        (t.push(
          u === `trusted`
            ? `登录按钮已收到浏览器可信点击`
            : `登录按钮已通过 DOM 点击（未使用浏览器可信指针）`,
        ),
        n.afterClick && !(await n.afterClick()))
      )
        return (t.push(`登录提交后的安全验证未完成`), !1);
      await (0, __contentScope.w)(450);
      let d = (0, __contentScope.Vn)();
      return (
        d && t.push(`登录页面反馈：${d}`),
        t.push((0, __contentScope.Wn)() ? `页面已发起登录接口请求` : `页面未发起登录接口请求`),
        !0
      );
    }
    if (r) {
      if (
        (await (0, __contentScope.ur)(t, r.element.form ?? document, n),
        n.beforeClick && !(await n.beforeClick()))
      )
        return (t.push(`回车提交前的安全验证未完成，已停止提交`), !1);
      if (((r = (0, __contentScope.V)(e.selectors.password, document)), !r))
        return (t.push(`安全验证完成后密码输入框已不存在，未执行回车提交`), !1);
      let i = await (0, __contentScope.B)(r.element, e, t, `密码输入框`);
      return i
        ? (t.push(`密码输入框被${(0, __contentScope.N)(i)}遮挡，未执行回车提交`), !1)
        : (t.push(`未找到登录按钮，已在密码框回车提交`),
          await n.beforeNavigate?.(),
          (0, __contentScope.Je)(r.element),
          n.afterClick && !(await n.afterClick())
            ? (t.push(`回车提交后的安全验证未完成`), !1)
            : !0);
    }
    return (t.push(`找不到登录按钮: ${e.selectors.submit}`), !1);
  }

  async function _r(e, t, n = {}) {
    if ((await (0, __contentScope.w)(900), (0, __contentScope.Wn)()))
      return (t.push(`滑块通过后已观察到登录请求，无需再次点击登录按钮`), `not-needed`);
    let r = (0, __contentScope.Un)();
    if (r) return (t.push(`登录页面已明确返回失败，不重复提交：${r}`), `blocked`);
    let i = (0, __contentScope.V)(e.selectors.password, document);
    if (!i) return (t.push(`滑块通过后账密表单已离开，无需再次点击登录按钮`), `not-needed`);
    if (!i.element.value)
      return (t.push(`滑块通过后密码输入框已被页面清空，已停止重复提交`), `blocked`);
    let a = i.element.form ?? document,
      o = await (0, __contentScope.tr)(e.selectors.submit, a, 2e3);
    if (!o) return (t.push(`滑块通过后登录按钮已不存在，无需再次点击`), `not-needed`);
    let s = Date.now() + 2e3;
    for (; (0, __contentScope.H)(o.element) && Date.now() < s;) {
      if (
        (await (0, __contentScope.w)(150),
        (i = (0, __contentScope.V)(e.selectors.password, document)),
        !i)
      )
        return `not-needed`;
      ((a = i.element.form ?? document), (o = (0, __contentScope.er)(e.selectors.submit, a) ?? o));
    }
    if ((0, __contentScope.H)(o.element))
      return (t.push(`滑块通过后登录按钮仍未恢复可用，未执行重复点击`), `blocked`);
    if ((0, __contentScope.Wn)())
      return (t.push(`重新定位登录按钮期间页面已发起登录请求，无需再次点击`), `not-needed`);
    let c = (0, __contentScope.Un)();
    if (c) return (t.push(`重新点击前页面已明确返回登录失败：${c}`), `blocked`);
    if (((i = (0, __contentScope.V)(e.selectors.password, document)), !i?.element.value))
      return i ? `blocked` : `not-needed`;
    if (
      ((a = i.element.form ?? document),
      (o = (0, __contentScope.er)(e.selectors.submit, a)),
      !o || (0, __contentScope.H)(o.element))
    )
      return `blocked`;
    let l = await (0, __contentScope.B)(o.element, e, t, `滑块通过后的登录按钮`);
    if (l)
      return (
        t.push(`滑块通过后的登录按钮被${(0, __contentScope.N)(l)}遮挡，未重复提交`),
        `blocked`
      );
    if (((i = (0, __contentScope.V)(e.selectors.password, document)), !i?.element.value))
      return i ? `blocked` : `not-needed`;
    if (
      ((a = i.element.form ?? document),
      (o = (0, __contentScope.er)(e.selectors.submit, a)),
      !o || (0, __contentScope.H)(o.element))
    )
      return `blocked`;
    let u = await (0, __contentScope.B)(o.element, e, t, `滑块通过后的登录按钮`);
    if (u)
      return (
        t.push(`滑块通过后的登录按钮被${(0, __contentScope.N)(u)}遮挡，未重复提交`),
        `blocked`
      );
    if (((i = (0, __contentScope.V)(e.selectors.password, document)), !i?.element.value))
      return i ? `blocked` : `not-needed`;
    if (
      ((a = i.element.form ?? document),
      (o = (0, __contentScope.er)(e.selectors.submit, a)),
      !o || (0, __contentScope.H)(o.element))
    )
      return `blocked`;
    (t.push(`滑块已确认通过但登录表单仍在，重新点击登录按钮（仅一次）`),
      await n.beforeNavigate?.());
    let d = await (0, __contentScope.M)(o.element, { mayNavigate: !0 });
    if (
      (t.push(
        d === `trusted`
          ? `滑块通过后的登录按钮已收到浏览器可信点击`
          : `滑块通过后的登录按钮已通过 DOM 点击（未使用浏览器可信指针）`,
      ),
      n.afterClick && !(await n.afterClick()))
    )
      return (t.push(`重新提交登录后的安全验证未完成`), `blocked`);
    await (0, __contentScope.w)(450);
    let f = (0, __contentScope.Vn)();
    return (
      f && t.push(`重新提交后的登录页面反馈：${f}`),
      t.push(
        (0, __contentScope.Wn)()
          ? `重新提交后页面已发起登录接口请求`
          : `重新提交后暂未观察到登录接口请求，继续核对登录结果`,
      ),
      `submitted`
    );
  }

  async function vr(e, t, n = {}, r = `oauth`) {
    (await (0, __contentScope.U)(e, t), await (0, __contentScope.ur)(t, document, n));
    let i = await (0, __contentScope.qn)(e, 12e3, r);
    if (!i)
      return (
        t.push(
          e.loginEntry?.method === r
            ? `当前页面未找到账号选定的「${e.loginEntry.label}」登录入口，请手动更新本站登录方式`
            : e.oauthButtonSelector?.trim()
              ? `找不到${r === `passkey` ? ` Passkey` : r === `github` ? ` GitHub` : ` OAuth`} 按钮: ${e.oauthButtonSelector}`
              : `未能自动识别${r === `passkey` ? ` Passkey` : r === `github` ? ` GitHub OAuth` : ` OAuth`} 登录按钮，请填写按钮选择器`,
        ),
        !1
      );
    if (n.beforeClick && !(await n.beforeClick()))
      return (
        t.push(
          `${r === `passkey` ? `Passkey` : r === `github` ? `GitHub` : `OAuth`} 点击前的安全验证未完成`,
        ),
        !1
      );
    if (((i = await (0, __contentScope.qn)(e, 12e3, r)), !i))
      return (t.push(`安全验证完成后第三方登录按钮已不存在`), !1);
    if ((0, __contentScope.H)(i.element))
      return (
        t.push(
          `${r === `passkey` ? `Passkey` : r === `github` ? `GitHub` : `OAuth`} 登录按钮仍处于禁用状态，页面还有未满足的登录条件`,
        ),
        !1
      );
    let a = await (0, __contentScope.B)(i.element, e, t, `第三方登录按钮`);
    if (a) return (t.push(`第三方登录按钮被${(0, __contentScope.N)(a)}遮挡，已停止点击`), !1);
    if (((i = await (0, __contentScope.qn)(e, 2e3, r)), !i))
      return (t.push(`关闭遮挡后第三方登录按钮已不存在`), !1);
    if ((0, __contentScope.H)(i.element))
      return (
        t.push(
          `${r === `passkey` ? `Passkey` : r === `github` ? `GitHub` : `OAuth`} 登录按钮在关闭遮挡后变为禁用状态`,
        ),
        !1
      );
    let o = i.element,
      s = (0, __contentScope.Bn)(o).slice(0, 30);
    return (
      t.push(
        i.selected
          ? `已按账号选择点击「${e.loginEntry.label}」登录入口: ${s}`
          : i.automatic
            ? `已自动识别并点击 OAuth 按钮: ${s}`
            : `已点击 OAuth 按钮: ${s}`,
      ),
      await n.beforeNavigate?.(),
      await (0, __contentScope.M)(o, { mayNavigate: !0 }),
      n.afterClick && !(await n.afterClick())
        ? (t.push(
            `${r === `passkey` ? `Passkey` : r === `github` ? `GitHub` : `OAuth`} 点击后的安全验证未完成`,
          ),
          !1)
        : !0
    );
  }

  async function yr(e, t, n = 1e4) {
    let r = location.href,
      i = Date.now() + n;
    for (; Date.now() < i;) {
      if (location.href !== r)
        return (t.push(`已离开登录页，等待授权流程返回本站(${location.pathname})`), !0);
      // A popup may finish OAuth without changing the opener's URL. Continue
      // verification in this content run instead of waiting for a navigation event.
      if ((0, __contentScope.ar)(e)) return !1;
      const page = (0, __contentScope.readLoginSnapshot)(e);
      if (
        page.sameOrigin &&
        !page.loginForm &&
        !page.loginEntry &&
        !page.secondFactor &&
        !page.challenge
      ) {
        await (0, __contentScope.readLoginState)(e, {
          timeoutMs: Math.min(3000, Math.max(1, i - Date.now())),
          diagnostics: t,
        });
        if (location.href !== r)
          return (t.push(`已离开登录页，等待授权流程返回本站(${location.pathname})`), !0);
        return !1;
      }
      await (0, __contentScope.w)(250);
    }
    return !1;
  }

  async function br(e, t, n = 6e3, options = {}) {
    const state = await (0, __contentScope.readLoginState)(e, {
      timeoutMs: n,
      stopOnLoginForm: !0,
      diagnostics: t,
      ...options,
    });
    options.onResult?.(state);
    t.push(loginStateLog(state));
    if (state.status === `authenticated`) return (t.push(`命中登录成功证据，已处于登录状态`), !0);
    if (state.reason === `login_form_visible`) t.push(`发现登录表单，需要重新登录`);
    else if (state.reason === `second_factor_pending`) t.push(`发现二次验证输入框，需要登录`);
    return !1;
  }

  async function xr(e, t, options = {}) {
    const state = await (0, __contentScope.readLoginState)(e, {
      timeoutMs: 8e3,
      diagnostics: t,
      ...options,
    });
    options.onResult?.(state);
    t.push(loginStateLog(state));
    return state.status === `authenticated`;
  }

  function Tr() {
    let e = [...__contentScope.Sr];
    for (let t = e.length - 1; t > 0; --t) {
      let n = Math.floor(Math.random() * (t + 1));
      [e[t], e[n]] = [e[n], e[t]];
    }
    return e.slice(0, __contentScope.Cr).join(``);
  }

  function Er(e, t) {
    if (t > __contentScope.Cr) return { text: (0, __contentScope.Tr)(), exhausted: !0 };
    let n = new Set((e ?? []).map((e) => e.trim())),
      r = ``;
    for (let e = 0; e < __contentScope.wr; e += 1)
      if (((r = (0, __contentScope.Tr)()), !n.has(r))) return { text: r, exhausted: !1 };
    return { text: r || (0, __contentScope.Tr)(), exhausted: !0 };
  }

  function Dr(e) {
    let t = (0, __contentScope.Or)(e.loginUrl);
    return t ? new URL(t).origin : null;
  }

  function Or(e) {
    try {
      let t = new URL(e.trim());
      return (0, __contentScope.kr)(t) ? t.href : null;
    } catch {
      return null;
    }
  }

  function kr(e) {
    let t = e.hostname === `localhost` || e.hostname === `127.0.0.1` || e.hostname === `[::1]`;
    return e.protocol === `https:` || (e.protocol === `http:` && t);
  }

  function W(e, t) {
    if (!t) return !0;
    let n = (0, __contentScope.Dr)(e);
    if (!n) return !1;
    try {
      return new URL(t, e.loginUrl).origin === n;
    } catch {
      return !1;
    }
  }

  function Ar(e) {
    return e === `localStorage` || e === `sessionStorage` ? e : void 0;
  }

  function jr(e) {
    return typeof e == `string` && e.trim() ? e.trim() : void 0;
  }

  function Mr(site) {
    return readIdentitySource(withSiteIdentityRecipe(site));
  }

  function Nr(e, t) {
    if (!t) return !1;
    let n = (0, __contentScope.Dr)(e);
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

  function Pr(e) {
    if (!e) return !1;
    try {
      let t = new URL(e);
      return t.protocol === `https:` && t.hostname === `github.com` && t.pathname === `/login`;
    } catch {
      return !1;
    }
  }

  function Fr(e) {
    if (!e) return !1;
    try {
      let t = new URL(e);
      return t.protocol === `https:` && t.hostname === `github.com` && t.pathname === `/logout`;
    } catch {
      return !1;
    }
  }

  function Ir(e) {
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

  function Lr(e) {
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

  function Rr(e) {
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

  function Vr(e) {
    if (e == null || e === ``) return {};
    let t = String(e),
      n = {};
    for (let e of __contentScope.Br) n[e] = t;
    return n;
  }

  function Ur({ quotaPerUnit: e, family: t }) {
    return e && e > 0 ? e : t === `new-api` ? __contentScope.Hr : 1;
  }

  function Wr(e, t) {
    return e / (0, __contentScope.Ur)(t);
  }

  function Gr(e) {
    return e
      .toFixed(2)
      .replace(/\.00$/, ``)
      .replace(/(\.\d)0$/, `$1`);
  }

  function Kr(e, t, n = `$`) {
    return n === `积分`
      ? `积分 ${(0, __contentScope.Gr)(e)}`
      : `${n}${(0, __contentScope.Wr)(e, t).toFixed(4)}`;
  }

  function qr(e, t, n = `$`) {
    return n === `积分` ? `${(0, __contentScope.Gr)(e)} 积分` : (0, __contentScope.Kr)(e, t, n);
  }

  function Xr(e) {
    return typeof e == `string` && Object.values(__contentScope.s).includes(e);
  }

  function Zr(e) {
    return e === __contentScope.o.SUB2API
      ? __contentScope.s.SUB2API
      : e === __contentScope.o.VO_API_V2
        ? __contentScope.s.VO_API_V2
        : e && __contentScope.Yr.has(e)
          ? __contentScope.s.NEW_API
          : __contentScope.s.UNSUPPORTED;
  }

  function Qr(e) {
    let t = e?.trim();
    if (t) return t.startsWith(`/`) ? t : `/${t}`;
  }

  function $r(e) {
    let t = e.adapter,
      n = (0, __contentScope.Xr)(t?.family) ? t.family : (0, __contentScope.Zr)(t?.siteType),
      r =
        t && Object.prototype.hasOwnProperty.call(t, `checkinPath`)
          ? (0, __contentScope.Qr)(t?.checkinPath)
          : __contentScope.Jr[n].checkinPath,
      i = (t?.checkin?.pathPatterns ?? [])
        .map((e) => (0, __contentScope.Qr)(e.replace(/\*$/, ``)))
        .filter((e) => !!e),
      a = (t?.checkin?.titleWords ?? []).map((e) => e.trim()).filter(Boolean);
    return {
      family: n,
      ...(t?.siteType ? { siteType: t.siteType } : {}),
      ...(r ? { checkinPath: r } : {}),
      checkinPathPatterns: i,
      checkinTitleWords: a,
    };
  }

  function ei(e) {
    return (0, __contentScope.$r)(e).checkinPath;
  }

  function ti(e, t, n = ``) {
    let r = (0, __contentScope.$r)(e),
      i = [...(r.checkinPath ? [r.checkinPath] : []), ...r.checkinPathPatterns];
    for (let e of i) {
      let n = (0, __contentScope.Qr)(t)?.replace(/\/+$/, ``) || `/`,
        r = e.replace(/\/+$/, ``) || `/`;
      if (n === r || n.startsWith(`${r}/`)) return !0;
    }
    let a = r.checkinTitleWords.length ? r.checkinTitleWords : [`每日签到`, `daily check-in`],
      o = n.toLocaleLowerCase();
    return a.some((e) => o.includes(e.toLocaleLowerCase()));
  }

  function si(e) {
    let t = e.authBootstrap,
      n = t?.endpoint?.trim();
    if (!t || !n) return null;
    let r;
    try {
      r = new URL(n, e.loginUrl).href;
    } catch {
      return null;
    }
    return (0, __contentScope.W)(e, r)
      ? {
          url: r,
          method: `POST`,
          ...(t.tokenPath?.length ? { tokenPath: t.tokenPath } : {}),
          header: t.header?.trim() || `Authorization`,
          prefix: t.prefix ?? `Bearer `,
        }
      : null;
  }

  function li(e, t) {
    let n = t?.length ? [t] : __contentScope.ci;
    for (let t of n) {
      let n = e;
      for (let e of t) {
        if (typeof n != `object` || !n) {
          n = void 0;
          break;
        }
        n = n[e];
      }
      if (typeof n == `string` && n.trim().length > 20) return n.trim();
    }
    return null;
  }

  async function ui(e, t) {
    let n = (0, __contentScope.si)(e);
    if (!n) return {};
    let r = `${e.id}|${n.url}`,
      i = __contentScope.ai.get(r);
    if (i) {
      let e = Object.keys(i.headers).length ? __contentScope.ni : __contentScope.ri;
      if (Date.now() - i.at < e) return { ...i.headers };
    }
    let a = __contentScope.oi.get(r);
    if (a) return a;
    let o = (0, __contentScope.fi)(n, t)
      .then((e) => (__contentScope.ai.set(r, { headers: e, at: Date.now() }), e))
      .finally(() => {
        __contentScope.oi.delete(r);
      });
    return (__contentScope.oi.set(r, o), o);
  }

  function di() {
    (__contentScope.ai.clear(),
      __contentScope.oi.clear(),
      __contentScope.identityProbeHints.clear());
  }

  async function fi(e, t) {
    let n = new AbortController(),
      r = setTimeout(() => n.abort(), __contentScope.ii),
      i = (e) => (t?.push(`令牌引导未取到令牌（${e}），接口按原有凭据继续读`), {});
    try {
      let t = await fetch(e.url, {
        method: e.method,
        credentials: `include`,
        headers: { Accept: `application/json` },
        redirect: `error`,
        signal: n.signal,
      });
      if (!t.ok) return i(`HTTP ${t.status}`);
      if (!(t.headers.get(`content-type`)?.toLowerCase() ?? ``).includes(`json`))
        return i(`响应不是 JSON`);
      let r = (0, __contentScope.li)(await t.json().catch(() => null), e.tokenPath);
      return r ? { [e.header]: `${e.prefix}${r}` } : i(`响应里没有可用的 access_token`);
    } catch (e) {
      return i(e instanceof Error && e.name === `AbortError` ? `请求超时` : `请求失败`);
    } finally {
      clearTimeout(r);
    }
  }

  function G(e) {
    throw Error(`CBOR 解码失败: ${e}`);
  }

  function gi(e) {
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

  function _i(e, t) {
    (e instanceof Uint8Array || (0, __contentScope.G)(`输入必须是 Uint8Array`),
      e.byteLength === 0 && (0, __contentScope.G)(`数据为空`));
    let n = { ...__contentScope.pi, ...t };
    e.byteLength > n.maxInputBytes && (0, __contentScope.G)(`超出输入长度上限`);
    let r = new __contentScope.hi(e, n),
      i = r.readItem(0);
    return (r.done() || (0, __contentScope.G)(`数据尾部有多余字节`), i);
  }

  function xi(source) {
    return identitySourceLabel(source);
  }

  function Si(response, fields) {
    return parseIdentityResponse(response, fields);
  }

  function Ci() {
    try {
      let e = localStorage.getItem(`user`);
      if (!e) return;
      return (0, __contentScope.Si)(JSON.parse(e))?.userId;
    } catch {}
  }

  function wi(e) {
    return e.adapter?.family === __contentScope.s.UNSUPPORTED &&
      e.adapter?.siteType === __contentScope.o.UNKNOWN
      ? []
      : __contentScope.vi;
  }

  function Ti(e, t) {
    let n = t ? [t] : [`localStorage`, `sessionStorage`];
    // Orevx restores the first complete auth bundle in one storage area. A
    // stale local token must not hide the current sessionStorage login.
    if (!t && e === `auth-token` && location.origin === `https://orevx.ai`)
      for (const areaName of n)
        try {
          const area = areaName === `localStorage` ? localStorage : sessionStorage,
            token = area.getItem(`auth-token`)?.trim(),
            sessionId = area.getItem(`auth-session-id`)?.trim(),
            storedUser = JSON.parse(area.getItem(`auth-user`) ?? `null`);
          if (token && sessionId && Number.isSafeInteger(storedUser?.id) && storedUser.id > 0)
            return token;
        } catch {}
    for (let t of n)
      try {
        let n = (
          t === `localStorage`
            ? typeof localStorage > `u`
              ? void 0
              : localStorage
            : typeof sessionStorage > `u`
              ? void 0
              : sessionStorage
        )
          ?.getItem(e)
          ?.trim();
        if (n) return n;
      } catch {}
  }

  function Ei(e, t) {
    let n = (0, __contentScope.Ti)(e, t);
    if (!n) return null;
    try {
      let e = (0, __contentScope.Si)(JSON.parse(n));
      return e ? { ...e, source: `storage` } : null;
    } catch {
      return null;
    }
  }

  async function Di(e, t, n, options = {}) {
    if (
      !t.endpoint ||
      !t.tokenKey ||
      location.origin !== (0, __contentScope.Dr)(e) ||
      !(0, __contentScope.Nr)(e, t.endpoint)
    )
      return null;
    const url = new URL(t.endpoint),
      trace = (detail) =>
        options.diagnostics?.push(`身份接口 ${url.origin}${url.pathname}（本站 Token）：${detail}`);
    let r = n ?? (0, __contentScope.Ti)(t.tokenKey, t.tokenStorageType);
    if (!r) return (trace(`当前页面没有可用的会话 Token（存储键 ${t.tokenKey}）`), null);
    let i = { Accept: `application/cbor, application/json` };
    i[t.tokenHeader ?? `Authorization`] = `${t.tokenPrefix ?? `Bearer `}${r}`;
    let a = new AbortController(),
      o = setTimeout(
        () => a.abort(),
        Math.min(__contentScope.yi, Math.max(1, options.timeoutMs ?? __contentScope.yi)),
      );
    try {
      let e = await fetch(t.endpoint, {
        method: `GET`,
        credentials: `omit`,
        headers: i,
        cache: `no-store`,
        redirect: `error`,
        signal: a.signal,
      });
      if (!e.ok) return (trace(`HTTP ${e.status}`), null);
      if (e.redirected || (e.url && new URL(e.url).href !== url.href))
        return (trace(`响应发生跳转，未采用身份`), null);
      let n = e.headers.get(`content-type`)?.toLowerCase() ?? ``;
      if (n.includes(`cbor`) || n.includes(`json`)) {
        const body = n.includes(`cbor`)
          ? (0, __contentScope._i)(new Uint8Array(await e.arrayBuffer()))
          : await e.json().catch(() => null);
        if (body == null) trace(`JSON / CBOR 用户资料解析失败`);
        return body;
      }
      trace(
        n.includes(`html`)
          ? `返回 HTML 页面，可能是访问验证或登录页`
          : `响应不是 JSON / CBOR 用户资料`,
      );
      return null;
    } catch (error) {
      trace(error?.name === `AbortError` ? `请求超时` : `请求失败或被站点访问校验拦截`);
      return null;
    } finally {
      clearTimeout(o);
    }
  }

  async function Oi(e, t, n, options = {}) {
    let r = await (0, __contentScope.Di)(e, t, n, options);
    if (r == null) return null;
    let i = (0, __contentScope.Si)(r, t.responseFields);
    const url = new URL(t.endpoint),
      endpoint = `${url.origin}${url.pathname}`;
    if (!i)
      options.diagnostics?.push(`身份接口 ${endpoint}（本站 Token）：未返回有效的当前用户字段`);
    return i ? { ...i, source: `api`, endpoint } : null;
  }

  function Fi(e, t = !1) {
    if (!e) return ``;
    let n = [],
      r = !1,
      i = !1;
    for (let a of e
      .split(/[\r\n]+/)
      .map((e) => e.trim())
      .filter(Boolean)) {
      if (__contentScope.Ai.test(a)) {
        ((r = !0), (i = !1));
        continue;
      }
      let e = __contentScope.ji.test(a);
      if (((e || __contentScope.Mi.test(a)) && (r = !1), r || __contentScope.ki.test(a))) {
        i = !1;
        continue;
      }
      let o = e || __contentScope.Ni.test(a),
        s = i && /^[^\s<>]{2,80}(?:\s*[·|]\s*[^\r\n]{1,40})?$/.test(a);
      ((t || o || s) && n.push(a), (i = o));
    }
    return n.join(`
`);
  }

  function Ii(e) {
    for (let t = e; t; t = t.parentElement) {
      if (t.hidden || t.getAttribute(`aria-hidden`) === `true` || t.hasAttribute(`inert`))
        return !1;
      let e = getComputedStyle(t);
      if (
        e.display === `none` ||
        e.visibility === `hidden` ||
        e.visibility === `collapse` ||
        Number.parseFloat(e.opacity || `1`) <= 0.02
      )
        return !1;
    }
    return !0;
  }

  function Li() {
    let e = [(0, __contentScope.Fi)(document.body?.innerText)];
    if (typeof document.querySelectorAll != `function`) return e[0];
    for (let t of document.querySelectorAll(
      `[role="menu"], [aria-haspopup="menu"], [aria-haspopup="true"]`,
    )) {
      if (
        !(0, __contentScope.Ii)(t) ||
        t.closest(`table, [role="table"], [role="grid"], .lottery-sidebar`)
      )
        continue;
      let n = t.innerText ?? t.textContent ?? ``;
      if (!n.trim() || n.length > 2e3) continue;
      let r = t.getAttribute(`role`) === `menu` && __contentScope.Pi.test(n),
        i =
          t.hasAttribute(`aria-haspopup`) &&
          (!!t.closest(`header, nav, [role="banner"]`) ||
            /user|account|profile|avatar|用户|账号|账户|个人|头像/i.test(
              `${t.getAttribute(`aria-label`) ?? ``} ${t.getAttribute(`title`) ?? ``}`,
            ));
      (r || i) && e.push((0, __contentScope.Fi)(n, !0));
    }
    return e.filter(Boolean).join(`
`);
  }

  function Ri(e) {
    let t = new Map(e.map((e) => [e.toLowerCase(), e]));
    return t.size === 1 ? t.values().next().value : void 0;
  }

  function zi(e) {
    if (!e) return null;
    let t = { source: `visible` },
      ids = (0, __contentScope.Vi)(e, !0);
    if (ids.length > 1)
      return {
        source: `visible`,
        identityConflict: `页面同时显示多个当前用户 ID（${ids.join(`、`)}）`,
      };
    ids[0] && (t.userId = ids[0]);
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
      a = (0, __contentScope.Ri)(i.length ? i : r);
    a && (t.username = a);
    let o = (0, __contentScope.Ri)(
      [...e.matchAll(/(?<![\w.+*-])[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g)].map((e) => e[0]),
    );
    return (o && (t.email = o), t.userId || t.username || t.email ? t : null);
  }

  function Bi(site) {
    return readVisibleAccountIdentity(
      document,
      location,
      site ? readIdentitySource(site) : undefined,
    );
  }

  function Vi(e, all = !1) {
    let t = /(?<![A-Za-z])(?:用户\s*ID|User\s*ID|UID)\s*[:：#]?\s*(\d{1,12})\b/gi,
      n = new Set();
    for (let r of e.matchAll(t)) {
      let t = r[1];
      if (!t) continue;
      let i = e.slice(Math.max(0, (r.index ?? 0) - 14), r.index ?? 0);
      __contentScope.ki.test(i) || n.add(t);
    }
    return all ? [...n] : n.size === 1 ? [...n][0] : void 0;
  }

  function Gi(e, t) {
    let n = e.trim().toLowerCase(),
      r = t == null ? (0, __contentScope.Li)() : (0, __contentScope.Fi)(t);
    if (!r || n.length < __contentScope.Hi) return null;
    if ((0, __contentScope.Ki)(r.toLowerCase(), n)) return { matched: e.trim(), masked: !1 };
    let i = n.lastIndexOf(`@`);
    if (i <= 0) return null;
    let a = n.slice(0, i),
      o = n.slice(i + 1);
    if (!o) return null;
    for (let e of r.matchAll(__contentScope.Wi)) {
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

  function Ki(e, t) {
    for (let n = 0; n <= e.length;) {
      let r = e.indexOf(t, n);
      if (r < 0) return !1;
      let i = e[r - 1] ?? ` `,
        a = e[r + t.length] ?? ` `;
      if (!__contentScope.Ui.test(i) && !__contentScope.Ui.test(a)) return !0;
      n = r + 1;
    }
    return !1;
  }

  async function qi(site, token, options = {}) {
    identityResolver ??= new SiteIdentityResolver({
      getFamily: (selected) => (0, __contentScope.$r)(selected).family,
      readStorage: (key, type) => (0, __contentScope.Ti)(key, type),
      readPage: (selected) => (0, __contentScope.Bi)(selected),
      userIdHeaders: (hint) => (0, __contentScope.Vr)(hint),
      bootstrapHeaders: (selected) => (0, __contentScope.ui)(selected),
      readExternal: (selected, source, explicitToken, readOptions) =>
        (0, __contentScope.Oi)(selected, source, explicitToken, readOptions),
      transportHints: __contentScope.identityProbeHints,
    });
    // Per-read transport options must not leak into the next account's call.
    // The shared resolver remembers only successful endpoint locations.
    const deadline = Date.now() + (options.timeoutMs ?? 4000),
      reader = Object.create(identityResolver);
    reader.readExternal = (selected, source, explicitToken) =>
      (0, __contentScope.Oi)(selected, source, explicitToken, {
        timeoutMs: Math.max(1, deadline - Date.now()),
        diagnostics: options.diagnostics,
      });
    return reader.read(withSiteIdentityRecipe(site), token, options);
  }

  function Ji(first, second) {
    return identitiesEqual(first, second);
  }

  function Yi(identity, username) {
    return findIdentityMatch(identity, username)?.value ?? null;
  }

  function Xi(identity, username, aliases, expectedIdentity) {
    return findIdentityMatch(identity, username, aliases, expectedIdentity);
  }

  function Zi(identity, username, userId, options) {
    return compareAccountIdentity(identity, username, userId, options);
  }

  function Qi(e, t) {
    let n = [/token/i, /auth/i, /session/i, /user/i, /login/i],
      r = e.checkin?.logoutStorageKeys ?? [],
      i = 0;
    for (let e of [localStorage, sessionStorage]) {
      let t = [];
      for (let n = 0; n < e.length; n += 1) {
        let r = e.key(n);
        r && t.push(r);
      }
      for (let a of t) (r.includes(a) || n.some((e) => e.test(a))) && (e.removeItem(a), (i += 1));
    }
    return (i && t.push(`已清除 ${i} 项本地登录态`), i);
  }

  async function $i(e, t, n) {
    (0, __contentScope.di)();
    let r = (0, __contentScope.Qi)(e, t),
      i = e.logoutApiUrl ?? e.checkin?.logoutApiUrl,
      a = !1;
    if (i && !n) {
      let n = new URL(i, location.origin).href;
      if ((0, __contentScope.W)(e, n)) {
        for (let e of [`POST`, `GET`]) {
          let r = new AbortController(),
            i = setTimeout(() => r.abort(), __contentScope.bi);
          try {
            if (
              (
                await fetch(n, {
                  method: e,
                  credentials: `include`,
                  headers: { Accept: `application/json` },
                  signal: r.signal,
                })
              ).ok
            ) {
              ((a = !0),
                t.push(`已调用站点退出接口(${e} ${new URL(n).pathname})，服务端会话已失效`));
              break;
            }
          } catch {
          } finally {
            clearTimeout(i);
          }
        }
        a || t.push(`退出接口无响应(${new URL(n).pathname})，改用重载登录页的方式切换账号`);
      } else t.push(`配置的退出接口不在本站，已忽略`);
    }
    let o,
      s = !1;
    if (n)
      try {
        ((o = await n()),
          o.failed > 0 || o.removed < o.matched
            ? ((s = !0),
              t.push(
                `本站浏览器 Cookie 清理后仍残留 ${o.failed || o.matched - o.removed} 项（清理前发现 ${o.matched} 项）`,
              ))
            : o.removed > 0
              ? t.push(`已清除本站浏览器 Cookie ${o.removed} 项（含 HttpOnly）`)
              : t.push(`已确认本站浏览器没有残留 Cookie`));
      } catch (e) {
        ((s = !0),
          t.push(`清除本站浏览器 Cookie 失败: ${e instanceof Error ? e.message : String(e)}`));
      }
    return {
      clearedKeys: r,
      serverLogout: a,
      ...(o ? { browserCookies: o } : {}),
      cookieMayRemain: n ? s || !o : !a,
    };
  }

  function ea(e, t, n) {
    let r = e.tokenConfig;
    if (!r) return (n.push(`站点未配置 Token 认证参数（tokenConfig）`), !1);
    let i = r.storageType === `sessionStorage` ? sessionStorage : localStorage;
    try {
      i.setItem(r.storageKey, t);
      let e = r.storageType === `sessionStorage` ? `sessionStorage` : `localStorage`;
      return (n.push(`已注入 Token 到 ${e}.${r.storageKey}`), !0);
    } catch (e) {
      return (n.push(`Token 注入失败: ${e instanceof Error ? e.message : String(e)}`), !1);
    }
  }

  function ta(e) {
    let t = { Accept: `application/json` },
      n;
    try {
      let e = localStorage.getItem(`user`);
      if (e) {
        let t = JSON.parse(e);
        typeof t?.id == `number` && Number.isFinite(t.id)
          ? (n = String(t.id))
          : typeof t?.id == `string` && t.id.trim() && (n = t.id.trim());
      }
    } catch {}
    Object.assign(t, (0, __contentScope.Vr)(n ?? e));
    for (let e of [`auth_token`, `access_token`, `token`]) {
      let n = localStorage.getItem(e)?.trim();
      if (n && n.length > 20 && !n.startsWith(`{`)) {
        t.Authorization = `Bearer ${n}`;
        break;
      }
    }
    return t;
  }

  function la(e) {
    return Number.isNaN(e.getTime())
      ? null
      : { year: e.getFullYear(), month: e.getMonth() + 1, day: e.getDate() };
  }

  function ua(e) {
    let t = e
      .replace(/[年月日]/g, `/`)
      .replace(/[.\-]/g, `/`)
      .match(/((?:19|20)\d{2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,2})/);
    if (!t) return null;
    let n = Number(t[1]),
      r = Number(t[2]),
      i = Number(t[3]);
    if (!Number.isInteger(r) || r < 1 || r > 12 || !Number.isInteger(i) || i < 1 || i > 31)
      return null;
    let a = new Date(n, r - 1, i);
    return a.getFullYear() !== n || a.getMonth() + 1 !== r || a.getDate() !== i
      ? null
      : { year: n, month: r, day: i };
  }

  function da(e, t = new Date()) {
    if (!e) return null;
    let n = (0, __contentScope.la)(t);
    if (!n) return null;
    let r = [...e.matchAll(__contentScope.aa)];
    for (let t = 0; t < r.length; t += 1) {
      let i = r[t];
      if (!i) continue;
      let a = i.index ?? 0,
        o = r[t + 1]?.index ?? e.length,
        s = e.slice(a, o),
        c = s.match(/[+＋]\s*(\d[\d,]*(?:\.\d+)?)/);
      if (!c?.[1]) continue;
      let l = (0, __contentScope.wa)(c[1]);
      if (l == null || l <= 0) continue;
      let u = s.match(__contentScope.sa);
      if (!u) continue;
      let d = (0, __contentScope.ua)(u[0]);
      if (d && d.year === n.year && d.month === n.month && d.day === n.day)
        return { reward: l, symbol: `积分` };
    }
    return null;
  }

  function fa(e) {
    try {
      return new URL(e.loginUrl).hostname.toLowerCase() === __contentScope.ca;
    } catch {
      return !1;
    }
  }

  function pa() {
    try {
      return new URL(location.href).pathname || `/`;
    } catch {
      return `/`;
    }
  }

  async function ma(e) {
    if (typeof document > `u` || typeof window > `u`) return ``;
    let t = () => document.body?.innerText ?? document.body?.textContent ?? ``,
      n = t();
    if (__contentScope.ia.test(n)) return n;
    let r = [
        ...document.querySelectorAll(
          `button, [role="button"], a, [aria-haspopup], [aria-expanded], [tabindex="0"]`,
        ),
      ].filter((e) => (0, __contentScope.O)(e)),
      i = /登录|注册|每日签到|签到|语言|主题|切换|菜单|导航|退出|logout|sign[ -]?in/i,
      a = r
        .map((e) => {
          let t = e.getBoundingClientRect(),
            n = (e.innerText || e.getAttribute(`aria-label`) || ``).replace(/\s+/g, ` `).trim(),
            r = `${e.id} ${e.className} ${e.getAttribute(`data-testid`) ?? ``} ${e.getAttribute(`aria-haspopup`) ?? ``}`,
            a = 0;
          return (
            e.getAttribute(`aria-haspopup`)?.toLowerCase() === `menu` && (a += 30),
            e.getAttribute(`aria-expanded`) === `false` && (a += 8),
            /user|account|avatar|profile|dropdown|member|用户|账户|头像/i.test(r) && (a += 12),
            t.top <= 180 && t.right >= window.innerWidth * 0.65 && (a += 10),
            n.length >= 1 && n.length <= 32 && (a += 4),
            i.test(n) && (a -= 30),
            { element: e, score: a, label: n }
          );
        })
        .filter((e) => e.score >= 10)
        .sort((e, t) => t.score - e.score || e.label.length - t.label.length)[0]?.element;
    if (!a) return n;
    let o = !1;
    try {
      (await (0, __contentScope.M)(a, { mayNavigate: !1 }), (o = !0));
    } catch {
      return n;
    }
    let s = Date.now() + 1500;
    for (; Date.now() < s && ((n = t()), !__contentScope.ia.test(n));)
      await (0, __contentScope.w)(80);
    if (
      (__contentScope.ia.test(n) && e?.push(`已展开禾维用户菜单并读取当前积分`), o && a.isConnected)
    )
      try {
        await (0, __contentScope.M)(a, { mayNavigate: !1 });
      } catch {}
    return n;
  }

  function Ca(e) {
    return __contentScope.Sa.test(e)
      ? !0
      : __contentScope.ba.test(e.replace(__contentScope.xa, ``));
  }

  function wa(e) {
    if (e.includes(`,`)) {
      if (!/^-?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(e)) return null;
      e = e.replace(/,/g, ``);
    }
    let t = Number(e);
    return Number.isFinite(t) ? t : null;
  }

  function Ta(e) {
    if (e) return e === `¥` || e === `￥` ? e : /^(?:cny|rmb)$/i.test(e) ? `¥` : `$`;
  }

  function Ea(e) {
    let t = e.trim().match(/^(\d[\d,]*(?:\.\d+)?)\s*积分$/i);
    if (t?.[1]) {
      let e = (0, __contentScope.wa)(t[1]);
      return e == null ? null : { amount: e, symbol: `积分` };
    }
    let n = e.trim().match(/^(?:([$＄¥￥])|(?:usd|cny|rmb))?\s*(\d[\d,]*(?:\.\d+)?)$/i);
    if (!n?.[2]) return null;
    let r = (0, __contentScope.wa)(n[2]);
    if (r == null) return null;
    let i = (0, __contentScope.Ta)(n[1] || e.trim().match(/^(usd|cny|rmb)/i)?.[1] || ``);
    return { amount: r, ...(i ? { symbol: i } : {}) };
  }

  function Da(e, t) {
    if (!e) return null;
    let n = (0, __contentScope.da)(e);
    if (n) return n;
    if ((__contentScope.oa.test(e) && __contentScope.sa.test(e)) || !__contentScope.va.test(e))
      return null;
    for (let { pattern: n, requiresCheckedIn: r } of __contentScope.ha) {
      if (r && !__contentScope._a.test(e)) continue;
      let i = n.flags.includes(`g`) ? n.flags : `${n.flags}g`;
      for (let r of e.matchAll(new RegExp(n.source, i))) {
        let e = r[1];
        if (!e) continue;
        let n = (0, __contentScope.Ea)(e);
        if (!n || n.amount <= 0) continue;
        let i = n.symbol === `积分` ? 1 : t && t > 0 ? t : 1;
        return {
          reward: n.amount * i,
          ...(n.symbol ? { symbol: n.symbol } : {}),
        };
      }
    }
    return null;
  }

  function Oa(e, t, n) {
    let r = (0, __contentScope.Da)(t, n);
    if (r == null) return null;
    let i = (0, __contentScope.Da)(e, n);
    return i != null && Math.abs(r.reward - i.reward) <= __contentScope.Ua && r.symbol === i.symbol
      ? null
      : r;
  }

  function ka(e) {
    if (e != null) return e.length > __contentScope.ya ? e.slice(0, __contentScope.ya) : e;
  }

  function Aa(e, t) {
    return (0, __contentScope.Da)(
      e.replace(__contentScope.ga, (e) => e.replace(/[^\n]/g, ` `)),
      t,
    );
  }

  function ja(e, t, n) {
    if (
      e.verdict === `rewarded` ||
      (e.verdict !== `unchanged` && e.verdict !== `already-used` && e.verdict !== `unknown`)
    )
      return e;
    let r = (0, __contentScope.ka)(t.after);
    if (!r || !(0, __contentScope.Ca)(r)) return e;
    let i = (0, __contentScope.Aa)(r, n);
    if (!i) return e;
    let a = (0, __contentScope.Oa)((0, __contentScope.ka)(t.before), r, n)
      ? `visible-reward`
      : `checkin-ledger`;
    return {
      ...e,
      reward: i.reward,
      ...(i.symbol ? { rewardSymbol: i.symbol } : {}),
      verdict: `rewarded`,
      source: a,
    };
  }

  function Ma(e, t) {
    if (!e) return null;
    let n = e.match(__contentScope.ia);
    if (n?.[1]) {
      let e = (0, __contentScope.wa)(n[1]);
      if (e != null) return { quota: e, usedQuota: 0, symbol: `积分` };
    }
    let r = e.match(__contentScope.ra);
    if (r?.[1]) {
      let e = (0, __contentScope.wa)(r[1]);
      if (e != null) return { quota: e, usedQuota: 0, symbol: `积分` };
    }
    if (__contentScope.oa.test(e)) return null;
    let i = e.match(/(?:当前余额|账户余额|剩余额度|可用余额)\s*[:：]?\s*([\s\S]{0,120})/i)?.[1];
    if (i) {
      let e = i.match(
          /(?:免费余额|免费)\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i,
        ),
        n = i.match(
          /(?:付费余额|付费)\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i,
        ),
        r = e?.[3] ? (0, __contentScope.wa)(e[3]) : null,
        a = n?.[3] ? (0, __contentScope.wa)(n[3]) : null;
      if (r != null || a != null) {
        let i = t && t > 0 ? t : 1,
          o = (0, __contentScope.Ta)(e?.[1] ?? e?.[2] ?? n?.[1] ?? n?.[2]);
        return {
          quota: ((r ?? 0) + (a ?? 0)) * i,
          usedQuota: 0,
          ...(o ? { symbol: o } : {}),
        };
      }
    }
    for (let n of __contentScope.na) {
      let r = e.match(n),
        i = r?.[3];
      if (!i) continue;
      let a = i;
      if (i.includes(`,`)) {
        if (!/^-?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(i)) continue;
        a = i.replace(/,/g, ``);
      }
      let o = Number(a);
      if (!Number.isFinite(o)) continue;
      let s = t && t > 0 ? t : 1,
        c = (0, __contentScope.Ta)(r?.[1] ?? r?.[2]);
      return { quota: o * s, usedQuota: 0, ...(c ? { symbol: c } : {}) };
    }
    return null;
  }

  function Fa(e) {
    return typeof e == `number` && Number.isFinite(e)
      ? e
      : typeof e == `string` && e.trim() !== `` && Number.isFinite(Number(e))
        ? Number(e)
        : null;
  }

  function Ia(e) {
    if (!e || typeof e != `object`) return null;
    let t = e;
    if (t.success === !1) return null;
    let n = t.data ?? t;
    if (!n || typeof n != `object`) return null;
    let r = __contentScope.Fa,
      i = r(n.quota);
    if (i != null) return { quota: i, usedQuota: r(n.used_quota) ?? r(n.usedQuota) ?? 0 };
    let a = r(n.free_balance) ?? r(n.freeBalance),
      o = r(n.paid_balance) ?? r(n.paidBalance) ?? (a == null ? null : r(n.balance));
    if (a != null || o != null) return { quota: (a ?? 0) + (o ?? 0), usedQuota: 0 };
    let s = r(n.balance);
    return s == null ? null : { quota: s, usedQuota: 0 };
  }

  function La(e) {
    if (!e || typeof e != `object`) return null;
    let t = (0, __contentScope.Fa)(e.points);
    return t == null ? null : { quota: t, usedQuota: 0, symbol: `积分` };
  }

  function Ra(e) {
    let t = (0, __contentScope.$r)(e).family;
    return t === __contentScope.s.SUB2API
      ? __contentScope.Pa
      : t === __contentScope.s.NEW_API
        ? __contentScope.Na
        : [...__contentScope.Na, ...__contentScope.Pa];
  }

  async function za(e, t) {
    let n = (0, __contentScope.fa)(e),
      r = (0, __contentScope.ta)(e.adapter?.userId),
      i = await (0, __contentScope.ui)(e, t);
    for (let [e, t] of Object.entries(i)) r[e] || (r[e] = t);
    let a = n ? [] : (0, __contentScope.Ra)(e);
    for (let n of a) {
      let i = new URL(n, location.origin).href;
      if ((0, __contentScope.W)(e, i))
        try {
          let n = await (0, __contentScope.Ha)(i, __contentScope.Va, r);
          if (!n?.ok || !(n.headers.get(`content-type`)?.toLowerCase() ?? ``).includes(`json`))
            continue;
          let a = (0, __contentScope.Ia)(await n.json().catch(() => null));
          if (!a) continue;
          let o = (0, __contentScope.$r)(e).family,
            s = { quotaPerUnit: e.adapter?.quotaPerUnit, family: o },
            c = (e) => (0, __contentScope.Kr)(e, s);
          return (
            t?.push(`已读取额度快照（剩余 ${c(a.quota)}，累计已用 ${c(a.usedQuota)}）`),
            { quota: a.quota, usedQuota: a.usedQuota, at: Date.now() }
          );
        } catch {}
    }
    let o = (0, __contentScope.Mr)(e);
    if (o?.endpoint) {
      let n = await (0, __contentScope.Ba)(e, o);
      if (n) {
        let r = {
          family: (0, __contentScope.$r)(e).family,
          quotaPerUnit: e.adapter?.quotaPerUnit,
        };
        return (
          t?.push(
            `已通过跨域接口读取额度快照（剩余 ${(0, __contentScope.Kr)(n.quota, r, n.symbol)}）`,
          ),
          n
        );
      }
    }
    let s = (0, __contentScope.Ma)(
      n ? await (0, __contentScope.ma)(t) : document.body?.innerText,
      e.adapter?.quotaPerUnit,
    );
    return s
      ? (t?.push(
          n
            ? `已读取禾维当前积分（无累计消耗，差分只看积分增减）`
            : `额度接口读不到，改用页面上显示的余额（无累计消耗，差分只看余额增减）`,
        ),
        {
          quota: s.quota,
          usedQuota: s.usedQuota,
          at: Date.now(),
          ...(s.symbol ? { symbol: s.symbol } : {}),
          fromVisibleText: !0,
          visiblePath: (0, __contentScope.pa)(),
        })
      : (t?.push(`未能读到额度快照（接口与页面都没有可用余额），本次无法用守恒差分确认结果`), null);
  }

  async function Ba(e, t) {
    let n = await (0, __contentScope.Di)(e, t);
    if (n == null) return null;
    let r = (0, __contentScope.La)(n);
    return r
      ? {
          quota: r.quota,
          usedQuota: r.usedQuota,
          ...(r.symbol ? { symbol: r.symbol } : {}),
          at: Date.now(),
        }
      : null;
  }

  async function Ha(e, t, n = { Accept: `application/json` }) {
    let r = new AbortController(),
      i = setTimeout(() => r.abort(), t);
    try {
      return await fetch(e, {
        method: `GET`,
        credentials: `include`,
        headers: n,
        signal: r.signal,
      });
    } catch {
      return null;
    } finally {
      clearTimeout(i);
    }
  }

  function Wa(e, t) {
    if (
      !e ||
      !t ||
      (e.fromVisibleText &&
        t.fromVisibleText &&
        e.visiblePath &&
        t.visiblePath &&
        e.visiblePath !== t.visiblePath)
    )
      return { verdict: `unknown` };
    let n = e.quota + e.usedQuota,
      r = t.quota + t.usedQuota - n,
      i = t.usedQuota - e.usedQuota,
      a = t.quota - e.quota,
      o;
    return (
      (o =
        r > __contentScope.Ua ? `rewarded` : i > __contentScope.Ua ? `already-used` : `unchanged`),
      {
        reward: r,
        usageDelta: i,
        balanceDelta: a,
        verdict: o,
        quotaAfter: t.quota,
        ...(t.symbol ? { balanceSymbol: t.symbol } : {}),
      }
    );
  }

  function Ga(e, t, n) {
    if (!e.verdict || e.verdict === `unknown`) return null;
    let r = t && t > 0 ? t : n === __contentScope.s.NEW_API ? 5e5 : 1,
      i = (e, t) => (0, __contentScope.Kr)(e, { quotaPerUnit: r }, t),
      a = (e, t) => (0, __contentScope.qr)(e, { quotaPerUnit: r }, t);
    if (e.verdict === `rewarded` && e.source === `checkin-ledger`) {
      let t = `今日签到记录奖励 ${a(e.reward ?? 0, e.rewardSymbol ?? e.balanceSymbol)}`;
      return e.quotaAfter == null ? t : `${t}，当前余额 ${i(e.quotaAfter, e.balanceSymbol)}`;
    }
    if (e.verdict === `rewarded` && e.source === `visible-reward`) {
      let t = `页面证据判定奖励 ${a(e.reward ?? 0, e.rewardSymbol ?? e.balanceSymbol)} 已到账`,
        n =
          e.balanceDelta == null
            ? `（未取得守恒差分基线）`
            : `（余额差分未体现增长，可能因显示精度或页面刷新滞后）`;
      return e.quotaAfter == null
        ? `${t}${n}`
        : `${t}${n}，当前余额 ${i(e.quotaAfter, e.balanceSymbol)}`;
    }
    if (e.verdict === `rewarded`) {
      let t = `签到获得 ${a(e.reward ?? 0, e.rewardSymbol ?? e.balanceSymbol)}`;
      return e.quotaAfter == null ? t : `${t}，当前余额 ${i(e.quotaAfter, e.balanceSymbol)}`;
    }
    if (e.verdict === `already-used`) {
      let t = `今日已签到（期间消耗 ${a(e.usageDelta ?? 0, e.balanceSymbol)}）`;
      return e.quotaAfter == null ? t : `${t}，当前余额 ${i(e.quotaAfter, e.balanceSymbol)}`;
    }
    return e.source === `checkin-ledger`
      ? e.quotaAfter == null
        ? `今日已签到，额度未变化`
        : `今日已签到，额度未变化，当前余额 ${i(e.quotaAfter, e.balanceSymbol)}`
      : e.quotaAfter == null
        ? `额度无变化`
        : `额度无变化，当前余额 ${i(e.quotaAfter, e.balanceSymbol)}`;
  }

  function to(e) {
    return e.replace(/\/+$/, ``) || `/`;
  }

  function no() {
    return document.body?.innerText ?? document.body?.textContent ?? ``;
  }

  function ro(e) {
    return e.test((0, __contentScope.no)());
  }

  function io(e) {
    return (0, __contentScope.L)(e).replace(/\s+/g, ` `).trim();
  }

  function ao() {
    return (
      (0, __contentScope.z)().find((e) => {
        let t = (0, __contentScope.io)(e);
        return /(?:今日|今天)?(?:已签到|已经签到|已签)/.test(t);
      }) ?? ((0, __contentScope.ro)(/(?:今日|今天)已签到|已经签到|签到成功/) ? document.body : null)
    );
  }

  function oo() {
    return (
      (0, __contentScope.z)()
        .filter((e) => !(0, __contentScope.R)(e))
        .filter((e) => {
          let t = (0, __contentScope.io)(e);
          return (
            /^(?:立即签到|签到|check[ -]?in now|sign[ -]?in)$/i.test(t) ||
            (/立即签到/.test(t) && t.length <= 24) ||
            (/签到/.test(t) && !/(?:已|今日|今天|历史|记录)/.test(t) && t.length <= 20)
          );
        })
        .sort((e, t) => (0, __contentScope.io)(e).length - (0, __contentScope.io)(t).length)[0] ??
      null
    );
  }

  function so() {
    let e = [...document.querySelectorAll(`a[href]`)]
      .filter((e) => (0, __contentScope.O)(e))
      .filter((e) => {
        try {
          let t = new URL(e.href, location.href);
          return (
            t.origin === location.origin && (0, __contentScope.to)(t.pathname) === __contentScope.Ja
          );
        } catch {
          return !1;
        }
      });
    return (
      (e.find((e) => /浮梦引光/.test((0, __contentScope.io)(e))) ?? e[0]) ||
      ([
        ...document.querySelectorAll(
          `a, button, [role="button"], [role="menuitem"], [role="link"], [onclick], [class*="cursor-pointer" i], li, span, div`,
        ),
      ]
        .filter((e) => {
          let t = (e.textContent ?? ``).replace(/\s+/g, ` `).trim();
          return /浮梦引光/.test(t) && t.length <= 24;
        })
        .filter((e) => (0, __contentScope.O)(e))
        .filter((e) => !(0, __contentScope.R)(e))
        .map((e) => {
          let t = (0, __contentScope.io)(e),
            n = e.getBoundingClientRect(),
            r = t === `浮梦引光` ? 100 : 40;
          return (
            e.matches(`a, button, [role="button"], [role="menuitem"], [role="link"]`) && (r += 25),
            e.matches(`[onclick], [class*="cursor-pointer" i]`) && (r += 12),
            n.width <= 240 && n.height <= 80 && (r += 15),
            {
              element: e,
              score: r,
              area: Math.max(1, n.width * n.height),
              length: t.length,
            }
          );
        })
        .sort((e, t) => t.score - e.score || e.area - t.area || e.length - t.length)[0]?.element ??
        null)
    );
  }

  function co() {
    return [...document.querySelectorAll(`.lottery-page`)].find(__contentScope.O) ?? null;
  }

  function lo() {
    return (
      [...document.querySelectorAll(`button.lottery-board-center`)].find(__contentScope.O) ?? null
    );
  }

  function uo(e) {
    return (0, __contentScope.io)(e.querySelector(`:scope > span`) ?? e);
  }

  function fo() {
    let e = (0, __contentScope.co)(),
      t = (0, __contentScope.lo)();
    if (!e && !t) return (0, __contentScope.ro)(__contentScope.eo);
    let n = e ?? document,
      r = n.querySelector(`.lottery-notice`);
    if (
      r &&
      (0, __contentScope.O)(r) &&
      /今日梦火抽签次数已耗尽|\bThis draw is complete\b|\bYou have already drawn today\b/i.test(
        (0, __contentScope.io)(r),
      )
    )
      return !0;
    if (!t || !(0, __contentScope.R)(t) || !__contentScope.eo.test((0, __contentScope.uo)(t)))
      return !1;
    let i = n.querySelector(`.lottery-page-heading`);
    return (
      !!i &&
      (0, __contentScope.O)(i) &&
      /(?:\bWon\s+|抽中\s*[:：]\s*)\S/i.test((0, __contentScope.io)(i))
    );
  }

  function po(e) {
    return (
      e.length <= 80 &&
      /抽奖|\b(?:start\s+)?draw\b/i.test(e) &&
      !__contentScope.eo.test(e) &&
      !/已抽奖|次数已用完|历史|记录|说明|规则|\b(?:drawing|history|records?|rules?)\b/i.test(e)
    );
  }

  function go() {
    let e = (0, __contentScope.lo)();
    if (e || (0, __contentScope.co)())
      return (
        (__contentScope.ho = null),
        e && !(0, __contentScope.R)(e) && (0, __contentScope.po)((0, __contentScope.uo)(e))
          ? e
          : null
      );
    let t = Date.now();
    if (
      t - __contentScope.mo < __contentScope.Qa &&
      __contentScope.ho?.isConnected &&
      (0, __contentScope.O)(__contentScope.ho) &&
      !(0, __contentScope.R)(__contentScope.ho) &&
      (0, __contentScope.po)((0, __contentScope.io)(__contentScope.ho))
    )
      return __contentScope.ho;
    __contentScope.mo = t;
    let n = (0, __contentScope.z)(),
      r = [
        ...document.querySelectorAll(
          `button, [role="button"], a, [onclick], [class*="cursor-pointer" i], [class*="card" i], div, span`,
        ),
      ]
        .filter((e) => (0, __contentScope.po)((e.textContent ?? ``).replace(/\s+/g, ` `).trim()))
        .slice(0, __contentScope.$a)
        .filter((e) => (0, __contentScope.O)(e));
    return (
      (__contentScope.ho =
        [...new Set([...n, ...r])]
          .filter((e) => !(0, __contentScope.R)(e))
          .map((e) => ({ element: e, text: (0, __contentScope.io)(e) }))
          .filter(({ element: e, text: t }) => {
            if (!(0, __contentScope.po)(t)) return !1;
            let n = e.getBoundingClientRect();
            return n.width >= 42 && n.height >= 42 && n.width <= 520 && n.height <= 520;
          })
          .map(({ element: e, text: t }) => {
            let n = e.getBoundingClientRect(),
              r = Math.max(1, n.width),
              i = Math.max(1, n.height),
              a = r / i,
              o = n.left + r / 2,
              s = n.top + i / 2,
              c = window.innerWidth / 2,
              l = window.innerHeight / 2,
              u = t === `抽奖` ? 140 : 70;
            return (
              a >= 0.72 && a <= 1.4 ? (u += 30) : (a < 0.45 || a > 2.2) && (u -= 35),
              e.matches(`button, [role="button"], [onclick], [class*="cursor-pointer" i]`) &&
                (u += 18),
              (u -= Math.hypot(o - c, s - l) / 80),
              { element: e, text: t, score: u, area: r * i }
            );
          })
          .sort((e, t) => t.score - e.score || e.area - t.area || e.text.length - t.text.length)[0]
          ?.element ?? null),
      __contentScope.ho
    );
  }

  async function _o(e, t, n = 150) {
    let r = Date.now() + t;
    for (; Date.now() <= r;) {
      if (e()) return !0;
      await (0, __contentScope.w)(Math.min(n, Math.max(1, r - Date.now())));
    }
    return !1;
  }

  async function vo(e, t, n, r, i, a = !1) {
    if (!r()) throw new __contentScope.K(`一梦五千年未找到${n}`);
    if (i.beforeAction && !(await i.beforeAction()))
      throw new __contentScope.K(`一梦五千年点击${n}前的人机验证未完成`);
    let o = r();
    if (!o) throw new __contentScope.K(`一梦五千年完成人机验证后未找到${n}`);
    for (let i = 0; i < 3; i += 1) {
      let a = await (0, __contentScope.B)(o, e, t, `一梦五千年 ${n}`),
        s = r();
      if (o.isConnected && s === o) {
        if (a) throw new __contentScope.K(`一梦五千年${n}仍被弹窗遮挡`);
        break;
      }
      if (i === 2) throw new __contentScope.K(`一梦五千年页面持续重绘，无法稳定定位${n}，未点击`);
      if (
        (t.push(`一梦五千年公告处理后重新定位${n}`),
        await (0, __contentScope._o)(() => !!r(), 1e3),
        (o = r()),
        !o)
      )
        throw new __contentScope.K(`一梦五千年页面重绘后未找到可用的${n}，未点击`);
    }
    a && t.push(`一梦五千年即将点击${n}`);
    try {
      if (i.beforeDispatch && !(await i.beforeDispatch()))
        throw new __contentScope.K(`一梦五千年当前会话已变化，停止后续点击`);
      await (0, __contentScope.M)(o, { mayNavigate: a });
    } catch (e) {
      throw new __contentScope.K(
        `一梦五千年点击${n}失败: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
    if (!a && (t.push(`一梦五千年已点击${n}`), i.afterAction && !(await i.afterAction())))
      throw new __contentScope.K(`一梦五千年点击${n}后的人机验证未完成`);
  }

  function yo() {
    let e = [
        ...new Set(
          (0, __contentScope.z)()
            .map((e) => (0, __contentScope.io)(e))
            .filter((e) => e && e.length <= 20),
        ),
      ].slice(0, 10),
      t = [
        ...new Set(
          [...document.querySelectorAll(`a[href]`)]
            .filter((e) => (0, __contentScope.O)(e))
            .map((e) => {
              try {
                let t = new URL(e.href, location.href);
                return t.origin === location.origin ? (0, __contentScope.to)(t.pathname) : ``;
              } catch {
                return ``;
              }
            })
            .filter(Boolean),
        ),
      ].slice(0, 10),
      n = [];
    return (
      e.length && n.push(`可点元素：${e.join(` / `)}`),
      t.length && n.push(`同源链接：${t.join(` / `)}`),
      n.join(`；`) || `页面上没有可见的可点元素或同源链接`
    );
  }

  async function bo(e, t, n) {
    (0, __contentScope.ao)()
      ? t.push(`一梦五千年页面显示今日已签到，继续进入浮梦引光`)
      : (await (0, __contentScope._o)(() => !!(0, __contentScope.oo)(), __contentScope.Za))
        ? (await (0, __contentScope.vo)(e, t, `每日签到`, __contentScope.oo, n),
          (await (0, __contentScope._o)(() => !!(0, __contentScope.ao)(), __contentScope.Xa))
            ? t.push(`一梦五千年每日签到已确认完成`)
            : t.push(`一梦五千年点击每日签到后未出现已签到状态，继续进入浮梦引光`))
        : t.push(`一梦五千年个人页没有签到入口（站点已改为只有抽奖），直接进入浮梦引光`);
    let r = new URL(__contentScope.Ja, location.href).href;
    return (0, __contentScope.so)()
      ? (await (0, __contentScope.vo)(e, t, `浮梦引光`, __contentScope.so, n, !0),
        (await (0, __contentScope._o)(
          () => (0, __contentScope.to)(location.pathname) === __contentScope.Ja,
          1200,
        ))
          ? await (0, __contentScope.xo)(e, t, n)
          : (t.push(`一梦五千年点击「浮梦引光」后路径未变，改为直接进入 ${__contentScope.Ja}`),
            { status: `navigate`, url: r }))
      : (t.push(
          `一梦五千年未在页面上找到「浮梦引光」入口，直接进入 ${__contentScope.Ja}（${(0, __contentScope.yo)()}）`,
        ),
        { status: `navigate`, url: r });
  }

  async function xo(e, t, n) {
    if ((0, __contentScope.fo)())
      return (
        t.push(`一梦五千年页面显示今日已抽，本次不重复抽奖`),
        { status: `already`, message: `一梦五千年今日已抽` }
      );
    t.push(`一梦五千年等待本账号抽奖状态和中央按钮就绪`);
    let r = await (0, __contentScope._o)(
      () => (0, __contentScope.fo)() || !!(0, __contentScope.go)(),
      __contentScope.Ya,
    );
    if ((0, __contentScope.fo)())
      return (
        t.push(`一梦五千年已确认本账号今日已抽，本次不重复抽奖`),
        { status: `already`, message: `一梦五千年今日已抽` }
      );
    if (!r) {
      if ((0, __contentScope.co)() || (0, __contentScope.lo)()) {
        let e = (0, __contentScope.lo)();
        throw new __contentScope.K(
          `一梦五千年抽奖状态尚未就绪：中央按钮「${e ? (0, __contentScope.io)(e) : `尚未出现`}」，没有本账号今日已抽的确认，未点击也未标记已抽`,
        );
      }
      throw new __contentScope.K(
        `一梦五千年抽奖页未找到中央抽奖方块（${(0, __contentScope.yo)()}）`,
      );
    }
    if (
      (await (0, __contentScope.vo)(e, t, `中央抽奖方块`, __contentScope.go, n),
      !(await (0, __contentScope._o)(__contentScope.fo, __contentScope.Xa)))
    )
      throw new __contentScope.K(`一梦五千年抽奖后未出现“今日已抽”状态`);
    return (
      t.push(`一梦五千年抽奖已确认完成`),
      { status: `success`, message: `一梦五千年抽奖已完成` }
    );
  }

  async function So(e, t, n = {}) {
    let r;
    try {
      r = new URL(e.loginUrl);
    } catch {
      return { status: `failed`, message: `一梦五千年专用流程的登录地址无效` };
    }
    if (
      r.protocol !== `https:` ||
      r.hostname.toLowerCase() !== __contentScope.Ka ||
      r.port !== `` ||
      location.hostname.toLowerCase() !== __contentScope.Ka ||
      location.origin !== r.origin
    )
      return {
        status: `failed`,
        message: `leilei-daily 仅允许在 fapi.leileihog.top 同源页面执行`,
      };
    try {
      let r = (0, __contentScope.to)(location.pathname);
      if (r === __contentScope.qa) return await (0, __contentScope.bo)(e, t, n);
      if (r === __contentScope.Ja) return await (0, __contentScope.xo)(e, t, n);
      let i = new URL(__contentScope.Ja, location.href).href;
      return (t.push(`一梦五千年流程直接进入浮梦引光抽奖页`), { status: `navigate`, url: i });
    } catch (e) {
      return {
        status: `failed`,
        message:
          e instanceof __contentScope.K
            ? e.message
            : `一梦五千年流程异常: ${e instanceof Error ? e.message : String(e)}`,
      };
    }
  }

  function Co(e) {
    try {
      let t = new URL(e);
      return (
        t.protocol === `https:` &&
        [
          `turing.captcha.qcloud.com`,
          `ca.turing.captcha.qcloud.com`,
          `turing.captcha.gtimg.com`,
          `global.turing.captcha.gtimg.com`,
        ].includes(t.hostname)
      );
    } catch {
      return !1;
    }
  }

  function Bu() {
    return typeof document > `u`
      ? ``
      : (document.body?.innerText ?? document.body?.textContent ?? ``);
  }

  function Vu(e) {
    return e.innerText ?? e.textContent ?? ``;
  }

  function Hu(e) {
    if (!e) return { kind: `unknown` };
    let t = (0, __contentScope.et)(e, __contentScope.tt);
    if (t.length > 0) return { kind: `success`, words: t.slice(0, 4) };
    let n = (0, __contentScope.et)(e, __contentScope.F);
    return n.length > 0 ? { kind: `already`, words: n.slice(0, 4) } : { kind: `unknown` };
  }

  function Uu() {
    return (0, __contentScope.Hu)((0, __contentScope.Bu)());
  }

  function Wu(e) {
    return (0, __contentScope.Hu)((0, __contentScope.Vu)(e));
  }

  function Gu(e, t) {
    return e.kind === `success`
      ? (t.push(`工作流结束后页面出现签到成功证据：${e.words.join(`、`)}`),
        { status: `success`, message: `工作流命中签到成功证据` })
      : e.kind === `already`
        ? (t.push(`工作流结束后页面显示今日已完成：${e.words.join(`、`)}`),
          { status: `already`, message: `工作流确认今日签到已完成` })
        : (t.push(
            `工作流步骤已执行完，但页面上没有出现签到成功或已签到的证据；结果交由余额等其它证据判定`,
          ),
          {
            status: `unknown`,
            message: `工作流步骤已执行完，未读到签到结果证据`,
          });
  }

  function qu(e) {
    return e.replace(__contentScope.Ku, ``) || `/`;
  }

  function Ju(e) {
    try {
      let t = new URL(e, `https://learning.invalid`),
        n = t.hash.slice(1),
        r = (0, __contentScope.qu)(n.startsWith(`/`) ? n : t.pathname);
      return (
        !/(?:^|\/)(?:login|sign-?in|auth|oauth|register|password)(?:\/|$)/i.test(r) &&
        /^\/(?:dashboard|console|profile|personal|account|user|me|check-?in|daily|rewards?|lottery|draw|prize)(?:\/|$)/i.test(
          r,
        )
      );
    } catch {
      return !1;
    }
  }

  function Zu(e) {
    let t = (0, __contentScope.L)(e);
    if (
      !__contentScope.ct.test(t) ||
      __contentScope.lt.test(t) ||
      __contentScope.Yu.test(t) ||
      e.closest(`nav, [role="navigation"], [role="menu"], [role="menubar"], [role="tablist"]`) ||
      e.matches(`[role="menuitem"], [role="tab"], [role="link"], [aria-expanded]`) ||
      (e.hasAttribute(`aria-haspopup`) && e.getAttribute(`aria-haspopup`) !== `false`) ||
      e.closest(`form`)?.querySelector(`input[type="password"]`)
    )
      return !1;
    if (e.matches(`a[href]`))
      try {
        let t = new URL(e.getAttribute(`href`), location.href);
        if (
          t.origin !== location.origin ||
          t.pathname !== location.pathname ||
          t.search !== location.search ||
          (t.hash && t.hash !== location.hash)
        )
          return !1;
      } catch {
        return !1;
      }
    let n = `button, a[href], input[type="button"], input[type="submit"], [role="button"], [onclick]`;
    return (e.closest(n) && e.closest(n) !== e) || e.querySelector(n)
      ? !1
      : e.matches(n) || getComputedStyle(e).cursor === `pointer`;
  }

  function Qu(e = document, t) {
    let n = (0, __contentScope.z)(e).filter(
        (e) =>
          (0, __contentScope.Zu)(e) &&
          (!t || (0, __contentScope.Md)({ ...t, text: void 0 }, e) === null),
      ),
      r = (e) => (0, __contentScope.et)((0, __contentScope.L)(e), __contentScope.F),
      i = n.filter(
        (e) =>
          !(0, __contentScope.R)(e) &&
          r(e).length === 0 &&
          e.getAttribute(`aria-busy`) !== `true` &&
          !__contentScope.Xu.test((0, __contentScope.L)(e)),
      );
    if (i.length === 1) {
      let e = i[0];
      return {
        kind: `action`,
        element: e,
        label: (0, __contentScope.L)(e).slice(0, 60),
      };
    }
    if (i.length > 1) return { kind: `ambiguous`, count: i.length };
    let a = n.filter((e) => (0, __contentScope.R)(e) && r(e).length > 0);
    return a.length === 1
      ? { kind: `already`, words: r(a[0]) }
      : a.length > 1
        ? { kind: `ambiguous`, count: a.length }
        : { kind: `none` };
  }

  function $u(e) {
    if ((e.gesture && e.gesture !== `click`) || (e.key && ![`Enter`, `Space`].includes(e.key)))
      return !1;
    let t = /text=(.+)$/i.exec(e.selector.trim())?.[1]?.trim() || e.fingerprint?.text?.trim() || ``;
    return !t || !__contentScope.ct.test(t) ? !1 : !__contentScope.lt.test(t);
  }

  function md() {
    return Math.max(
      Math.round(window.scrollY || 0),
      Math.round(document.documentElement?.scrollTop || 0),
      Math.round(document.body?.scrollTop || 0),
    );
  }

  function hd() {
    let e = Math.max(1, Math.round((window.innerHeight || 800) * 0.9));
    if (typeof window.scrollBy == `function`) {
      window.scrollBy(0, e);
      return;
    }
    let t = document.scrollingElement ?? document.documentElement;
    t && (t.scrollTop += e);
  }

  function gd() {
    let e = Math.max(1, Math.round((window.innerHeight || 800) * 0.9));
    if (typeof window.scrollBy == `function`) {
      window.scrollBy(0, -e);
      return;
    }
    let t = document.scrollingElement ?? document.documentElement;
    t && (t.scrollTop -= e);
  }

  async function vd(e, t, n) {
    if (!n) return e(t);
    let r = Date.now() + t,
      i = Math.max(1, Math.ceil(t / __contentScope.sd) + 1);
    for (let t = 0; t < i; t += 1) {
      let t = Date.now();
      (await n(), (r += Math.max(0, Date.now() - t)));
      let i = Math.max(0, r - Date.now()),
        a = await e(Math.min(i, __contentScope.sd));
      if (a !== null) return a;
      if (i === 0 || Date.now() >= r) return null;
    }
    return null;
  }

  async function yd(e, t, n, r, i, a, o, s) {
    let c = 0,
      l = () => Date.now() - c,
      u = s
        ? async () => {
            let e = Date.now();
            try {
              await s();
            } finally {
              c += Math.max(0, Date.now() - e);
            }
          }
        : void 0,
      d = async (t) =>
        a
          ? (t <= 0 && (await u?.()),
            (
              t > 0
                ? await (0, __contentScope.vd)((t) => (0, __contentScope.k)(e, t), t, u)
                : (0, __contentScope.D)(e)
            )
              ? (0, __contentScope.Id)(e, a, i)
              : null)
          : (0, __contentScope.vd)((t) => (0, __contentScope.k)(e, t), t, u),
      f = (t = !1) => {
        if (a) {
          let n = (0, __contentScope.qd)(e, a, i, t);
          if (n)
            return (
              __contentScope.pd.set(n, {
                fingerprint: a,
                textMatch: (0, __contentScope.Hd)(a).strong.length ? `tolerant` : `exact`,
              }),
              n
            );
        }
        return o?.locate() ?? null;
      },
      p = !!a || !!o,
      m = await d(p ? 0 : n ? Math.min(t, __contentScope.ud) : t);
    if (m) return m;
    let h = f();
    if (h || o?.stop()) return h;
    if (!n && p && t > 0) {
      let e = l() + t,
        n = Math.ceil(t / __contentScope.ud);
      for (let t = 0; t < n && l() < e; t += 1) {
        let t = await d(Math.min(__contentScope.ud, Math.max(0, e - l())));
        if (t) return t;
        let n = f();
        if (n || o?.stop()) return n;
        await (0, __contentScope.w)(Math.min(__contentScope.ud, Math.max(0, e - l())));
      }
    }
    return (
      (await (0, __contentScope.Sd)(
        e,
        l() + (n ? t : __contentScope.fd),
        r,
        i,
        p
          ? async (e) => {
              let t = await d(0);
              if (t) return t;
              let n = f();
              return n || o?.stop() ? n : ((await d(e)) ?? f());
            }
          : d,
        o?.stop,
        l,
      )) ?? (o?.stop() ? null : f(!0))
    );
  }

  function bd(e) {
    return (
      e !== document.body &&
      e !== document.documentElement &&
      e.scrollHeight > e.clientHeight + 1 &&
      /(auto|scroll|overlay)/.test(getComputedStyle(e).overflowY) &&
      (0, __contentScope.O)(e)
    );
  }

  function xd() {
    return [...document.querySelectorAll(`*`)]
      .filter(__contentScope.bd)
      .sort((e, t) => t.clientHeight * t.clientWidth - e.clientHeight * e.clientWidth)
      .slice(0, 4);
  }

  async function Sd(e, t, n, r, i = (t) => (0, __contentScope.k)(e, t), a, o = Date.now) {
    let s = (e) => ({
        y: () => e.scrollTop,
        scroll: (t) => {
          let n = Math.max(
            1,
            Math.round((e.clientHeight || e.getBoundingClientRect().height) * 0.9),
          );
          e.scrollTop += t ? n : -n;
        },
        label: e === u ? `学习面板 ${n}` : `页面内滚动面板`,
      }),
      c = () => ({
        y: __contentScope.md,
        scroll: (e) => (e ? (0, __contentScope.hd)() : (0, __contentScope.gd)()),
        label: `页面`,
      }),
      l = [],
      u = null;
    if (n) {
      let e = (0, __contentScope.D)(n);
      if (e && (0, __contentScope.bd)(e)) {
        ((u = e),
          e.scrollIntoView?.({ block: `center`, inline: `center` }),
          await (0, __contentScope.w)(__contentScope.ld));
        let t = await i(0);
        if (t || a?.()) return t;
        l.push(s(e));
      } else
        r?.push(
          `工作流${e ? `学习时的滚动面板已不可滚动` : `未找到学习时的滚动面板`}: ${n}，退回到页面通用滚动查找`,
        );
    }
    (l.push(
      ...(0, __contentScope.xd)()
        .filter((e) => e !== u)
        .map(s),
    ),
      l.push(c()));
    let d = 0,
      f = new Set(),
      p = async (n, a) => {
        if (d >= __contentScope.dd || o() >= t) return null;
        d += 1;
        let s = n.y();
        (n.scroll(a), await (0, __contentScope.w)(__contentScope.ld));
        let c = t - o();
        if (c <= 0) return null;
        let l = n.y(),
          u = `${n.label}|${a ? `down` : `up`}`;
        return (
          l !== s &&
            !f.has(u) &&
            (f.add(u), r?.push(`工作流滚动${n.label}${a ? `向下` : `向上`}查找 ${e}`)),
          i(Math.min(c, __contentScope.ud))
        );
      };
    for (let e of [!0, !1]) {
      let n = new Set(l.filter((t) => e || t.y() > 0));
      for (; n.size && d < __contentScope.dd && o() < t;)
        for (let r of n) {
          if (d >= __contentScope.dd || o() >= t || a?.()) return null;
          let i = r.y(),
            s = await p(r, e);
          if (s || a?.()) return s;
          let c = r.y();
          (e ? c <= i : c >= i) && n.delete(r);
        }
    }
    return null;
  }

  function Cd(e) {
    return typeof e == `object` && e && !Array.isArray(e) ? e : null;
  }

  function wd(e) {
    let t = (0, __contentScope.Cd)(e);
    return !!t && typeof t.type == `string`;
  }

  function Td(e, t) {
    return e.replace(/\{\{\s*claimText\s*\}\}/gi, t.checkin?.claimText ?? ``);
  }

  function Ed() {
    return document.body?.innerText ?? document.body?.textContent ?? ``;
  }

  function Dd(e, t = `any`) {
    if (!e?.length) return !1;
    let n = (0, __contentScope.Ed)(),
      r = e.filter((e) => e.trim()).map((e) => (0, __contentScope.et)(n, [e.trim()]).length > 0);
    return t === `all` ? r.length > 0 && r.every(Boolean) : r.some(Boolean);
  }

  function Od(e) {
    switch (e.type) {
      case `text`:
        return (0, __contentScope.Dd)(e.words, e.match ?? `any`);
      case `selector`:
        return !!(0, __contentScope.D)(e.selector);
      case `path`: {
        let t = e.pattern.trim(),
          n = `${location.pathname}${location.hash}`;
        return t.endsWith(`*`) ? n.startsWith(t.slice(0, -1)) : n === t;
      }
    }
  }

  function kd(e, t) {
    return Number.isFinite(e) ? Math.min(__contentScope.nd, Math.max(0, Math.round(e))) : t;
  }

  function Ad(e) {
    let t = { tag: e.tagName.toLowerCase() },
      n = e.getAttribute(`aria-label`);
    n && (t.aria = n);
    let r = e.getAttribute(`name`);
    r && (t.name = r);
    let i = e.getAttribute(`data-testid`);
    (i && (t.testId = i),
      e instanceof HTMLInputElement
        ? (t.inputType = e.type)
        : e instanceof HTMLTextAreaElement && (t.inputType = `textarea`));
    let a = e.getAttribute(`role`);
    a && (t.role = a);
    let o = (0, __contentScope.me)(e);
    return (o && (t.text = o), t);
  }

  function jd(e) {
    let t = [];
    return (
      e.tag && t.push(`tag=${e.tag}`),
      e.aria && t.push(`aria="${e.aria}"`),
      e.name && t.push(`name="${e.name}"`),
      e.testId && t.push(`testId="${e.testId}"`),
      e.inputType && t.push(`type=${e.inputType}`),
      e.role && t.push(`role=${e.role}`),
      e.text && t.push(`text="${e.text.length > 24 ? `${e.text.slice(0, 24)}…` : e.text}"`),
      t.length ? t.join(` `) : `(空指纹)`
    );
  }

  function Md(e, t, n = `exact`) {
    let r = (0, __contentScope.Ad)(t);
    if (e.tag && r.tag !== e.tag.toLowerCase()) return `tag 期望 ${e.tag} 实际 ${r.tag}`;
    if (e.aria !== void 0 && r.aria !== e.aria)
      return `aria 期望 "${e.aria}" 实际 "${r.aria ?? ``}"`;
    if (e.name !== void 0 && r.name !== e.name)
      return `name 期望 "${e.name}" 实际 "${r.name ?? ``}"`;
    if (e.testId !== void 0 && r.testId !== e.testId)
      return `testId 期望 "${e.testId}" 实际 "${r.testId ?? ``}"`;
    if (e.inputType !== void 0 && r.inputType !== e.inputType)
      return `type 期望 ${e.inputType} 实际 ${r.inputType ?? ``}`;
    if (e.role !== void 0 && r.role !== e.role) return `role 期望 ${e.role} 实际 ${r.role ?? ``}`;
    if (e.text !== void 0) {
      let i = e.text.replace(/\s+/g, ` `).trim(),
        a = (r.text ?? ``).replace(/\s+/g, ` `).trim();
      if (
        !(n === `checkin`
          ? (0, __contentScope.Zu)(t)
          : n === `tolerant`
            ? (0, __contentScope.Nd)(a, i)
            : a === i)
      )
        return `text 期望 "${i}" 实际 "${a}"`;
    }
    return null;
  }

  function Nd(e, t) {
    return !e || !t ? e === t : e.includes(t) || t.includes(e);
  }

  function Pd(e, t, n, r, i = `exact`) {
    if (!t) return e;
    let a = (0, __contentScope.Md)(t, e, i);
    return a
      ? (r?.push(
          `工作流指纹失配: ${n} 命中的元素不符（${a}）；期望 ${(0, __contentScope.jd)(t)}，实际 ${(0, __contentScope.jd)((0, __contentScope.Ad)(e))}`,
        ),
        null)
      : e;
  }

  function Fd(e, t, n, r) {
    let i = __contentScope.pd.get(e);
    return (0, __contentScope.Pd)(e, t, n, r, i && i.fingerprint === t ? i.textMatch : `exact`);
  }

  function Id(e, t, n) {
    if (!t) return (0, __contentScope.D)(e);
    let r = (0, __contentScope.xe)(e);
    for (let i of r) if ((0, __contentScope.Pd)(i, t, e, n)) return i;
    return null;
  }

  function Ld(e, t, n) {
    if (!t) return null;
    let r = (0, __contentScope.xe)(e);
    if (r.length === 0) return null;
    let i = r[0],
      a = (0, __contentScope.Md)(t, i);
    return a
      ? `工作流${n}选择器命中了错误的元素: ${e}（${a}；期望 ${(0, __contentScope.jd)(t)}，实际 ${(0, __contentScope.jd)((0, __contentScope.Ad)(i))}）`
      : null;
  }

  function Vd(e, t) {
    let n = e[t];
    return typeof n == `string` && n.trim().length > 0;
  }

  function Hd(e) {
    return {
      strong: __contentScope.zd.filter((t) => (0, __contentScope.Vd)(e, t)),
      weak: __contentScope.Bd.filter((t) => (0, __contentScope.Vd)(e, t)),
    };
  }

  function Ud(e) {
    let t = new Set(__contentScope.Rd.split(`, `)),
      n = e.tag?.trim().toLowerCase();
    return (n && /^[a-z][a-z0-9-]*$/.test(n) && t.add(n), [...t].join(`, `));
  }

  function Wd(e) {
    let t = (0, __contentScope.Hd)(e);
    if (t.strong.length === 0 && t.weak.length === 0) return [];
    let n;
    try {
      n = [...document.querySelectorAll((0, __contentScope.Ud)(e))];
    } catch {
      return [];
    }
    return n.filter(
      (n) =>
        (0, __contentScope.O)(n) &&
        (t.strong.length > 0 || (0, __contentScope.Gd)(n)) &&
        (0, __contentScope.Md)(e, n, t.strong.length > 0 ? `tolerant` : `exact`) === null,
    );
  }

  function Gd(e) {
    return (0, __contentScope.R)(e)
      ? !1
      : e.matches(
          `button, a[href], input:not([type="hidden"]), textarea, select, summary, [role="button"], [role="menuitem"], [role="tab"], [role="checkbox"], [role="radio"], [contenteditable=""], [contenteditable="true"], [onclick], [tabindex]:not([tabindex="-1"])`,
        ) || getComputedStyle(e).cursor === `pointer`;
  }

  function Kd(e) {
    let t = [e.tagName.toLowerCase()],
      n = e.getAttribute(`id`);
    n && t.push(`#${n}`);
    let r = e.getAttribute(`data-testid`);
    return (r && t.push(`[data-testid="${r}"]`), t.join(``));
  }

  function qd(e, t, n, r = !0) {
    let i = (0, __contentScope.Hd)(t);
    if (i.strong.length === 0 && i.weak.length === 0)
      return (
        r &&
          n?.push(
            `工作流原选择器失效（${e}），指纹只有${i.weak.length > 0 ? `文案` : `控件种类`}（${(0, __contentScope.jd)(t)}），无法确认是同一个控件，不做跨选择器回退`,
          ),
        null
      );
    let a = (0, __contentScope.Wd)(t);
    if (a.length === 1) {
      let r = a[0];
      return (
        n?.push(
          `原选择器失效，已按指纹回退到 ${(0, __contentScope.Kd)(r)}：${e}（${(0, __contentScope.jd)(t)}）`,
        ),
        r
      );
    }
    return (
      r &&
        n?.push(
          a.length > 1
            ? `工作流原选择器失效（${e}），按指纹回退搜索命中 ${a.length} 个候选、无法确定唯一目标，已放弃`
            : `工作流原选择器失效（${e}），按指纹回退搜索没有找到匹配元素`,
        ),
      null
    );
  }

  async function Jd(e, t) {
    let n = (0, __contentScope.kd)(e.timeoutMs, __contentScope.td),
      r = Date.now() + n,
      i = typeof e.selector == `string` && e.selector.trim().length > 0,
      a = Array.isArray(e.text) && e.text.some((e) => typeof e == `string` && e.trim()),
      o = Math.ceil(n / 150) + 1;
    for (let n = 0; n < o && Date.now() <= r; n += 1) {
      let n = Date.now();
      (await t?.(), (r += Math.max(0, Date.now() - n)));
      let o = i && !!(0, __contentScope.D)(e.selector),
        s = a && (0, __contentScope.Dd)(e.text);
      if (o || s) return !0;
      await (0, __contentScope.w)(150);
    }
    return !1;
  }

  function Yd(e) {
    try {
      let t = new URL(location.href);
      return (
        t.origin === e.origin &&
        t.pathname === e.pathname &&
        t.search === e.search &&
        t.hash === e.hash
      );
    } catch {
      return !1;
    }
  }

  function Qd(e, t) {
    return `${__contentScope.Xd}当前页 ${e} 不在学习路线上，尝试进入 ${t}`;
  }

  function $d(e, t) {
    return `${__contentScope.Zd}从当前业务页 ${e} 进入 ${t}`;
  }

  function ef(e, t) {
    if ((0, __contentScope.W)(e, t))
      try {
        return new URL(t, e.loginUrl);
      } catch {
        return;
      }
  }

  function tf(e) {
    if ((0, __contentScope.Ju)(e.loginUrl)) return null;
    try {
      let t = new URL(e.loginUrl);
      return t.pathname === `/` && !t.hash ? null : `${t.pathname}${t.hash}`;
    } catch {
      return null;
    }
  }

  function nf(e) {
    let t =
      e.checkin?.method === `none` &&
      Array.isArray(e.checkin.workflow?.steps) &&
      e.checkin.workflow.steps.length === 0 &&
      !!e.checkin.workflow.identityPath;
    if (!(0, __contentScope.p)(e) && !t) return null;
    let n = e.checkin?.workflow?.route;
    if (!Array.isArray(n) || n.length === 0) return null;
    let r = n.filter((e) => typeof e == `string` && e.trim().length > 0).map((e) => e.trim());
    if (r.length === 0) return null;
    let i = r.map((t) => (0, __contentScope.ef)(e, t));
    return i.some((e) => !e) ? null : i;
  }

  function rf(e) {
    return (0, __contentScope.nf)(e) !== null;
  }

  function af(e) {
    let t = (0, __contentScope.nf)(e),
      n = `${location.pathname}${location.hash}`;
    return t?.some((e) => e.origin === location.origin && `${e.pathname}${e.hash}` === n) ?? !1;
  }

  function of(e) {
    let t = (0, __contentScope.nf)(e);
    if (!t) return !1;
    let n = t[t.length - 1],
      r = `${location.pathname}${location.hash}`;
    return `${n.pathname}${n.hash}` === r;
  }

  function sf(e) {
    let t = (0, __contentScope.nf)(e),
      n = e.checkin?.workflow?.identityPath;
    if (!t || typeof n != `string` || !n.trim()) return null;
    let r = (0, __contentScope.ef)(e, n);
    if (
      !r ||
      r.username ||
      r.password ||
      r.search ||
      /(?:access_token|refresh_token|id_token|code|state|token|secret|password)=/i.test(r.hash)
    )
      return null;
    let i = `${r.pathname}${r.hash}`;
    return t.some((e) => `${e.pathname}${e.hash}` === i) ? r.href : null;
  }

  function cf(e) {
    let t = (0, __contentScope.sf)(e);
    if (!t) return !1;
    let n = new URL(t);
    return `${n.pathname}${n.hash}` == `${location.pathname}${location.hash}`;
  }

  function lf(e, t, n) {
    if (!Array.isArray(t) || t.length === 0) return null;
    let r = t.filter((e) => typeof e == `string` && e.trim().length > 0).map((e) => e.trim());
    if (r.length === 0) return null;
    let i = r.map((t) => (0, __contentScope.ef)(e, t));
    if (i.some((e) => !e)) return { status: `failed`, message: `工作流学习路线必须与站点同源` };
    let a = `${location.pathname}${location.hash}`,
      o = i.findIndex((e) => `${e.pathname}${e.hash}` === a);
    if (o >= 0) {
      let e = o + 1;
      if (e >= r.length) return null;
      let t = i[e];
      return `${t.pathname}${t.hash}` === a
        ? null
        : (n.push(`工作流沿学习路线进入 ${t.pathname}${t.hash}（第 ${e + 1}/${r.length} 页）`),
          { status: `navigate`, url: t.href });
    }
    let s = (0, __contentScope.tf)(e),
      c = i.findIndex((e) => s === null || `${e.pathname}${e.hash}` !== s);
    if (c < 0)
      return (
        n.push(
          `${__contentScope.Xd}当前页 ${a} 不在学习路线上，路线里没有可跳转的业务页，改为在当前页执行工作流步骤`,
        ),
        null
      );
    let l = i[c],
      u = `${l.pathname}${l.hash}`;
    return (
      n.push(
        (0, __contentScope.Ju)(a) ? (0, __contentScope.$d)(a, u) : (0, __contentScope.Qd)(a, u),
      ),
      n.push(`工作流沿学习路线进入 ${l.pathname}${l.hash}（第 ${c + 1}/${r.length} 页）`),
      { status: `navigate`, url: l.href }
    );
  }

  function uf(e) {
    if (!e || (typeof e.isConnected == `boolean` && !e.isConnected)) return null;
    let t = e.closest(`form, [role="dialog"], [role="menu"], li, article, section`);
    if (t) return t;
    let n = e.parentElement;
    return !n || n === document.body || n === document.documentElement ? e : n;
  }

  function df(e, t, n) {
    let r = (0, __contentScope.uf)(n);
    if (!r) return { status: `failed`, message: e };
    let i =
      /(?:^|\/)(?:lottery|draw|prize)(?:\/|$)/i.test(location.pathname) ||
      __contentScope.it.test(n?.textContent ?? ``)
        ? {
            kind: `already`,
            words: (0, __contentScope.et)(r.textContent ?? ``, __contentScope.rt),
          }
        : (0, __contentScope.Wu)(r);
    return i.kind === `already` && i.words.length > 0
      ? (t.push(`${e}；目标控件附近页面显示今日已完成：${i.words.join(`、`)}，按已完成处理`),
        {
          status: `already`,
          message: `工作流未能完成点击，但目标控件附近证据显示今日签到已完成`,
        })
      : { status: `failed`, message: e };
  }

  async function ff(e, t, n, r, i, a = 0, o = []) {
    if (((i.steps += 1), i.steps > __contentScope.rd))
      return {
        status: `failed`,
        message: `工作流最多执行 ${__contentScope.rd} 个步骤`,
      };
    if (a > __contentScope.id)
      return {
        status: `failed`,
        message: `工作流条件嵌套超过 ${__contentScope.id} 层`,
      };
    let s = await r.checkpoint?.({ phase: `before`, step: t });
    if (s) return s;
    if (
      ![`click`, `if`, `leilei-daily`].includes(t.type) &&
      r.beforeAction &&
      !(await r.beforeAction())
    )
      return {
        status: `failed`,
        message: `工作流 ${t.type} 步骤前的人机验证未完成`,
      };
    let c;
    try {
      c = await (0, __contentScope.pf)(e, t, n, r, i, a, o);
    } catch (e) {
      if (e instanceof __contentScope._d) return e.result;
      throw e;
    }
    return c?.status === `navigate` || c?.status === `interrupted`
      ? c
      : !c && (t.type === `fill` || t.type === `drag`) && r.afterAction && !(await r.afterAction())
        ? {
            status: `failed`,
            message: `工作流 ${t.type} 步骤后的人机验证未完成`,
          }
        : ((await r.checkpoint?.({ phase: `after`, step: t })) ?? c);
  }

  async function pf(e, t, n, r, i, a, o) {
    let s =
      r.checkpoint || r.beforeAction
        ? async () => {
            let e = await r.checkpoint?.({ phase: `waiting`, step: t });
            if (e) throw new __contentScope._d(e);
            if (
              !r.checkpoint &&
              r.beforeAction &&
              (0, __contentScope.Pu)() &&
              !(await r.beforeAction())
            )
              throw new __contentScope._d({
                status: `failed`,
                message: `工作流等待期间的人机验证未完成`,
              });
          }
        : void 0;
    switch (t.type) {
      case `if`: {
        let o = (0, __contentScope.Od)(t.condition) ? t.then : (t.else ?? []);
        if (o.length === 0) return null;
        for (let [t, s] of o.entries()) {
          if (!(0, __contentScope.wd)(s))
            return { status: `failed`, message: `工作流条件分支包含无效步骤` };
          if (s.type === `navigate`)
            return {
              status: `failed`,
              message: `条件分支不能包含 navigate，请把跳转放在工作流第一步`,
            };
          let c = await (0, __contentScope.ff)(e, s, n, r, i, a + 1, o.slice(t + 1));
          if (c) return c;
        }
        return null;
      }
      case `navigate`: {
        if (!t.url?.trim()) return { status: `failed`, message: `工作流跳转步骤缺少 url` };
        let r;
        try {
          r = new URL(t.url, location.href);
        } catch {
          return { status: `failed`, message: `工作流跳转地址无效: ${t.url}` };
        }
        return (0, __contentScope.W)(e, r.href)
          ? (0, __contentScope.Yd)(r)
            ? null
            : (n.push(`工作流进入 ${r.pathname}${r.search}${r.hash}`),
              { status: `navigate`, url: r.href })
          : { status: `failed`, message: `工作流跳转地址必须与站点同源` };
      }
      case `click`: {
        if (!t.selector?.trim())
          return { status: `failed`, message: `工作流点击步骤缺少 selector` };
        let a = (0, __contentScope.kd)(t.timeoutMs, __contentScope.ed),
          o = i.pendingScroll;
        delete i.pendingScroll;
        let c = !!t.scrollIntoView || !!o,
          l = t.scrollContainer ?? o?.container,
          u = !i.routeNext && (0, __contentScope.$u)(t),
          d = { kind: `none` },
          f = !1,
          p = u
            ? {
                locate: () => (
                  (d = (0, __contentScope.Qu)(document, t.fingerprint)),
                  d.kind === `action`
                    ? (t.fingerprint &&
                        __contentScope.pd.set(d.element, {
                          fingerprint: t.fingerprint,
                          textMatch: `checkin`,
                        }),
                      (f = !0),
                      n.push(
                        `工作流按页面控件快照命中签到动作「${d.label}」，替代失效的选择器 ${t.selector}`,
                      ),
                      d.element)
                    : null
                ),
                stop: () => d.kind === `already` || d.kind === `ambiguous`,
              }
            : void 0,
          m = () => {
            if (d.kind === `already`)
              return (
                n.push(`工作流按页面控件快照判定今日已完成，跳过失效的选择器 ${t.selector}`),
                { status: `already`, message: `页面控件快照显示今日签到已完成` }
              );
            if (d.kind === `ambiguous`) {
              let e = `工作流页面控件快照命中 ${d.count} 个签到候选，无法确定唯一目标，已停止`;
              return (n.push(e), { status: `failed`, message: e });
            }
            return null;
          },
          h = await (0, __contentScope.yd)(t.selector, a, c, l, n, t.fingerprint, p, s),
          g = !1;
        if (!h) {
          let i = m();
          if (i) return i;
          if (
            (document.body &&
              [...document.body.querySelectorAll(`body > *`)].some(
                (e) => e !== document.body && getComputedStyle(e).position === `fixed`,
              ) &&
              (await (0, __contentScope.Qt)(e, n, { waitForAppear: !1 }),
              (h = await (0, __contentScope.yd)(
                t.selector,
                Math.max(1, Math.min(a, 3e3)),
                c,
                l,
                n,
                t.fingerprint,
                p,
                s,
              ))),
            !h && r.beforeAction && (0, __contentScope.Pu)())
          ) {
            n.push(`工作流定位失败后检测到人机验证，完成验证后重试定位`);
            let e = Date.now();
            (await r.beforeAction()) &&
              ((g = !0),
              (h = await (0, __contentScope.yd)(
                t.selector,
                Math.max(1, a - (Date.now() - e)),
                c,
                l,
                n,
                t.fingerprint,
                p,
                s,
              )));
          }
          if (!h)
            return (0, __contentScope.df)(
              (0, __contentScope.Ld)(t.selector, t.fingerprint, `点击`) ??
                `工作流找不到可点击元素: ${t.selector}`,
              n,
              null,
            );
        }
        if (!g && r.beforeAction && !(await r.beforeAction()))
          return {
            status: `failed`,
            message: `工作流点击前的人机验证未完成，已停止点击`,
          };
        let _ =
          g || !r.beforeAction
            ? h
            : await (0, __contentScope.yd)(t.selector, a, c, l, n, t.fingerprint, p, s);
        if (!_)
          return (
            m() ||
            (0, __contentScope.df)(
              (0, __contentScope.Ld)(t.selector, t.fingerprint, `点击`) ??
                `完成人机验证后工作流找不到可点击元素: ${t.selector}`,
              n,
              h,
            )
          );
        if (t.fingerprint && !(0, __contentScope.Fd)(_, t.fingerprint, t.selector, n))
          return {
            status: `failed`,
            message: `工作流点击选择器命中了错误的元素: ${t.selector}（期望 ${(0, __contentScope.jd)(t.fingerprint)}，实际 ${(0, __contentScope.jd)((0, __contentScope.Ad)(_))}）`,
          };
        let v = _.isConnected;
        if (await (0, __contentScope.B)(_, e, n, `工作流控件`))
          return {
            status: `failed`,
            message: `工作流点击目标仍被遮挡，可能有未关闭的公告弹窗`,
          };
        if (v && !_.isConnected) {
          if (
            ((_ = await (0, __contentScope.yd)(t.selector, a, c, l, n, t.fingerprint, p, s)),
            !_ || (t.fingerprint && !(0, __contentScope.Fd)(_, t.fingerprint, t.selector, n)))
          )
            return {
              status: `failed`,
              message: `公告处理后无法重新确认工作流控件: ${t.selector}`,
            };
          if ((await (0, __contentScope.B)(_, e, n, `工作流控件`)) || !_.isConnected)
            return {
              status: `failed`,
              message: `公告处理后工作流控件仍不稳定，已停止点击`,
            };
        }
        (c || f || __contentScope.pd.has(_)) &&
          (_.scrollIntoView({ block: `center`, inline: `center` }),
          n.push(`工作流将已定位的 ${t.selector} 滚入视口`),
          await (0, __contentScope.w)(150));
        try {
          i.routeNext && (n.push(`工作流回放中间页点击 ${t.selector}`), await r.beforeNavigate?.());
          let e = await r.checkpoint?.({ phase: `action`, step: t });
          if (e) return e;
          if (v && !_.isConnected)
            return {
              status: `failed`,
              message: `会话核验期间工作流控件已变化，已停止点击`,
            };
          let a = await (0, __contentScope.M)(_, {
              mayNavigate: !!i.routeNext,
              ...(t.anchor ? { anchor: t.anchor } : {}),
              ...(t.gesture ? { gesture: t.gesture } : {}),
              ...(t.key ? { key: t.key } : {}),
              ...(t.holdMs == null ? {} : { holdMs: t.holdMs }),
            }),
            o = t.key
              ? `用键盘 ${t.key} 触发`
              : t.gesture === `double`
                ? `双击`
                : t.gesture === `right`
                  ? `右键点击`
                  : t.gesture === `long-press`
                    ? `长按`
                    : `点击`,
            s = a === `dom` ? `（DOM 合成点击，未使用浏览器可信指针）` : ``;
          n.push(`工作流已${o} ${t.selector}${s}`);
        } catch (e) {
          return (0, __contentScope.df)(
            `工作流点击失败: ${e instanceof Error ? e.message : String(e)}`,
            n,
            _,
          );
        }
        if (i.routeNext && `${location.pathname}${location.hash}` !== i.sourcePath) {
          let e = new URL(i.routeNext);
          return location.origin !== e.origin ||
            `${location.pathname}${location.hash}` != `${e.pathname}${e.hash}`
            ? {
                status: `failed`,
                message: `学习流程点击后离开了预期页面，已停止后续操作`,
              }
            : { status: `navigate`, url: e.href };
        }
        return r.afterAction && !(await r.afterAction({ checkinAction: u }))
          ? {
              status: `failed`,
              message: i.routeNext
                ? `中间页点击后的人机验证未完成，已停止后续操作`
                : `工作流点击后的人机验证未完成，已停止后续步骤`,
            }
          : t.waitFor?.trim() &&
              !(await (0, __contentScope.vd)((e) => (0, __contentScope.k)(t.waitFor, e), a, s))
            ? { status: `failed`, message: `点击后未出现 ${t.waitFor}` }
            : null;
      }
      case `fill`: {
        if (!t.selector?.trim())
          return { status: `failed`, message: `工作流填充步骤缺少 selector` };
        if (typeof t.value != `string`)
          return { status: `failed`, message: `工作流填充步骤缺少 value` };
        let a = (0, __contentScope.kd)(t.timeoutMs, __contentScope.ed),
          o = i.pendingScroll;
        delete i.pendingScroll;
        let c = !!t.scrollIntoView || !!o,
          l = await (0, __contentScope.yd)(
            t.selector,
            a,
            c,
            t.scrollContainer ?? o?.container,
            n,
            t.fingerprint,
            void 0,
            s,
          );
        if (!l)
          return {
            status: `failed`,
            message:
              (0, __contentScope.Ld)(t.selector, t.fingerprint, `填充`) ??
              `工作流找不到可输入元素: ${t.selector}`,
          };
        let u = l.isConnected;
        if (await (0, __contentScope.B)(l, e, n, `工作流输入控件`))
          return {
            status: `failed`,
            message: `工作流输入目标仍被公告遮挡，已停止输入`,
          };
        if (
          u &&
          !l.isConnected &&
          ((l = await (0, __contentScope.yd)(
            t.selector,
            a,
            c,
            t.scrollContainer ?? o?.container,
            n,
            t.fingerprint,
            void 0,
            s,
          )),
          !l || (await (0, __contentScope.B)(l, e, n, `工作流输入控件`)) || !l.isConnected)
        )
          return {
            status: `failed`,
            message: `公告处理后无法重新确认工作流输入控件: ${t.selector}`,
          };
        if (t.fingerprint && !(0, __contentScope.Fd)(l, t.fingerprint, t.selector, n))
          return {
            status: `failed`,
            message: `工作流填充选择器命中了错误的元素: ${t.selector}（期望 ${(0, __contentScope.jd)(t.fingerprint)}，实际 ${(0, __contentScope.jd)((0, __contentScope.Ad)(l))}）`,
          };
        (c || __contentScope.pd.has(l)) &&
          typeof l.scrollIntoView == `function` &&
          (l.scrollIntoView({ block: `center`, inline: `center` }),
          await (0, __contentScope.w)(150));
        let d = await r.checkpoint?.({ phase: `action`, step: t });
        if (d) return d;
        if (u && !l.isConnected)
          return {
            status: `failed`,
            message: `会话核验期间工作流输入控件已变化，已停止输入`,
          };
        let f = t.control ?? `text`;
        if (f === `select`) {
          if (l.tagName !== `SELECT`)
            return {
              status: `failed`,
              message: `工作流填充目标不是下拉框: ${t.selector}`,
            };
          let e = l,
            r = t.choice;
          if (r == null || !Number.isInteger(r) || r < 0 || r >= e.options.length)
            return {
              status: `failed`,
              message: `工作流下拉选项序号无效: ${String(t.choice)}（共 ${e.options.length} 项）`,
            };
          if (e.selectedIndex === r)
            return (n.push(`工作流下拉框 ${t.selector} 已是第 ${r} 项，跳过`), null);
          let i = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, `value`)?.set,
            a = e.options[r].value;
          return (
            i ? i.call(e, a) : (e.value = a),
            (e.selectedIndex = r),
            e.dispatchEvent(new Event(`input`, { bubbles: !0 })),
            e.dispatchEvent(new Event(`change`, { bubbles: !0 })),
            n.push(`工作流已选择 ${t.selector} 第 ${r} 项`),
            null
          );
        }
        if (f === `checkbox` || f === `radio`) {
          let e = l;
          if (l.tagName !== `INPUT` || (e.type !== `checkbox` && e.type !== `radio`))
            return {
              status: `failed`,
              message: `工作流填充目标不是${f === `radio` ? `单选` : `复选`}框: ${t.selector}`,
            };
          let r = t.checked ?? !0;
          return e.checked === r
            ? (n.push(
                `工作流${f === `radio` ? `单选` : `复选`}框 ${t.selector} 已是${r ? `选中` : `未选中`}，跳过`,
              ),
              null)
            : (e.click(), n.push(`工作流已${r ? `勾选` : `取消勾选`} ${t.selector}`), null);
        }
        return (0, __contentScope.Ee)(l)
          ? ((0, __contentScope.De)(l, (0, __contentScope.Td)(t.value ?? ``, e)),
            n.push(`工作流已填充 ${t.selector}`),
            null)
          : {
              status: `failed`,
              message: `工作流找不到可输入元素: ${t.selector}`,
            };
      }
      case `scroll`: {
        let e = o.find((e) => e.type !== `scroll`);
        if (e?.type === `click` || e?.type === `fill`)
          return (
            i.pendingScroll || n.push(`工作流合并录制滚动，先定位后续控件 ${e.selector}`),
            (i.pendingScroll = {
              container: t.container ?? i.pendingScroll?.container,
            }),
            null
          );
        let r = Number.isFinite(t.ratio) ? Math.min(1, Math.max(0, t.ratio)) : 0,
          a = (0, __contentScope.kd)(t.timeoutMs, __contentScope.ed),
          c = Date.now() + a,
          l = (() => {
            if (t.container) {
              let e = (0, __contentScope.D)(t.container),
                r = e && (0, __contentScope.bd)(e),
                i = r ? e : (0, __contentScope.xd)()[0];
              if (
                (r ||
                  n.push(
                    `工作流学习滚动容器已失效: ${t.container}，${i ? `改用当前可滚动面板` : `退回到页面滚动`}`,
                  ),
                i)
              )
                return {
                  label: r ? `容器 ${t.container}` : `当前可滚动面板`,
                  top: () => i.scrollTop,
                  max: () => Math.max(0, i.scrollHeight - i.clientHeight),
                  scrollBy: (e) => {
                    i.scrollTop += e;
                  },
                };
            }
            return {
              label: `页面`,
              top: __contentScope.md,
              max: () =>
                Math.max(
                  0,
                  (document.scrollingElement ?? document.documentElement).scrollHeight -
                    (window.innerHeight || 800),
                ),
              scrollBy: (e) => (e > 0 ? (0, __contentScope.hd)() : (0, __contentScope.gd)()),
            };
          })(),
          u = (0, __contentScope.kd)(t.settleMs, 400);
        n.push(`工作流滚动${l.label}到 ${(r * 100).toFixed(0)}%`);
        let d = 0;
        for (; d < __contentScope.dd && Date.now() < c;) {
          d += 1;
          let e = Date.now();
          (await s?.(), (c += Math.max(0, Date.now() - e)));
          let t = r * l.max(),
            n = l.top(),
            i = t - n;
          if (
            Math.abs(i) < 2 ||
            (l.scrollBy(i),
            await (0, __contentScope.w)(__contentScope.ld),
            Math.abs(l.top() - n) < 1 && Math.abs(t - l.top()) >= 2)
          )
            break;
        }
        return (
          await (0, __contentScope.vd)(async (e) => (await (0, __contentScope.w)(e), null), u, s),
          null
        );
      }
      case `drag`: {
        if (!t.selector?.trim())
          return { status: `failed`, message: `工作流拖拽步骤缺少 selector` };
        if (!t.toSelector?.trim())
          return { status: `failed`, message: `工作流拖拽步骤缺少 toSelector` };
        let e = (0, __contentScope.kd)(t.timeoutMs, __contentScope.ed),
          i = await (0, __contentScope.yd)(
            t.selector,
            e,
            t.scrollIntoView,
            t.scrollContainer,
            n,
            void 0,
            void 0,
            s,
          );
        if (!i) return (0, __contentScope.df)(`工作流找不到拖拽起点: ${t.selector}`, n, null);
        let a = await (0, __contentScope.yd)(
          t.toSelector,
          e,
          t.scrollIntoView,
          t.scrollContainer,
          n,
          void 0,
          void 0,
          s,
        );
        if (!a) return (0, __contentScope.df)(`工作流找不到拖拽终点: ${t.toSelector}`, n, null);
        t.scrollIntoView &&
          typeof i.scrollIntoView == `function` &&
          (i.scrollIntoView({ block: `center`, inline: `center` }),
          await (0, __contentScope.w)(150));
        let o = __contentScope.Ue;
        if (typeof o != `function`)
          return {
            status: `failed`,
            message: `工作流拖拽原语 realDrag 尚未在 dom-utils 落地，无法回放拖拽 ${t.selector} → ${t.toSelector}`,
          };
        try {
          let e = await r.checkpoint?.({ phase: `action`, step: t });
          if (e) return e;
          await o(i, a, {
            fromAnchor: t.anchor,
            toAnchor: t.toAnchor,
            steps: t.steps,
          });
        } catch (e) {
          return (0, __contentScope.df)(
            `工作流拖拽失败: ${e instanceof Error ? e.message : String(e)}`,
            n,
            i,
          );
        }
        return (n.push(`工作流已拖拽 ${t.selector} 到 ${t.toSelector}`), null);
      }
      case `wait`:
        return t.selector?.trim() && t.ms !== void 0
          ? {
              status: `failed`,
              message: `工作流等待步骤只能设置 selector 或 ms 其中一个`,
            }
          : t.selector?.trim()
            ? (await (0, __contentScope.vd)(
                (e) => (0, __contentScope.k)(t.selector, e),
                (0, __contentScope.kd)(t.timeoutMs, __contentScope.ed),
                s,
              ))
              ? null
              : { status: `failed`, message: `工作流等待超时: ${t.selector}` }
            : (await (0, __contentScope.vd)(
                async (e) => (await (0, __contentScope.w)(e), null),
                (0, __contentScope.kd)(t.ms, 500),
                s,
              ),
              null);
      case `assert`: {
        let e = typeof t.selector == `string` && t.selector.trim().length > 0,
          n = Array.isArray(t.text) && t.text.some((e) => typeof e == `string` && e.trim());
        return !e && !n
          ? { status: `failed`, message: `工作流断言需要 selector 或 text` }
          : (await (0, __contentScope.Jd)(t, s))
            ? t.result === `already`
              ? { status: `already`, message: `工作流确认今日已完成` }
              : t.result === `success`
                ? { status: `success`, message: `工作流命中成功证据` }
                : null
            : t.optional
              ? null
              : { status: `failed`, message: `工作流断言未命中` };
      }
      case `leilei-daily`: {
        let i = null,
          a = async (e) => !i && ((i = (await r.checkpoint?.({ phase: e, step: t })) ?? null), !i),
          o = await (0, __contentScope.So)(e, n, {
            beforeAction: async () =>
              (await a(`before`)) && (!r.beforeAction || (await r.beforeAction())),
            beforeDispatch: () => a(`action`),
            afterAction: async () =>
              (!r.afterAction || (await r.afterAction())) && (await a(`after`)),
          });
        return i ?? o;
      }
      default:
        return {
          status: `failed`,
          message: `不支持的工作流步骤: ${String(t.type)}`,
        };
    }
  }

  async function mf(e, t, n, r = {}) {
    if (!t || !Array.isArray(t.steps) || t.steps.length === 0)
      return { status: `failed`, message: `工作流没有配置任何步骤` };
    if (t.steps.length > __contentScope.rd)
      return {
        status: `failed`,
        message: `工作流最多支持 ${__contentScope.rd} 个步骤`,
      };
    let i = (0, __contentScope.lf)(e, t.route, n);
    if (i) {
      if (i.status !== `navigate`) return i;
      let a = `${location.pathname}${location.hash}`;
      if (
        !t.route?.some((t) => {
          let n = (0, __contentScope.ef)(e, t);
          return n && `${n.pathname}${n.hash}` === a;
        })
      )
        return i;
      let o = { steps: 0, sourcePath: a, routeNext: i.url };
      for (let s of t.steps) {
        if (s.type !== `if` || s.condition.type !== `path` || !(0, __contentScope.Od)(s.condition))
          continue;
        let t = await (0, __contentScope.ff)(e, s, n, r, o);
        if (t)
          return t.status === `failed` &&
            `${location.pathname}${location.hash}` === a &&
            /找不到|选择器|指纹|命中了错误|已失效/.test(t.message)
            ? (n.push(`中间页的动作没能完成（${t.message}），按学习路线直接进入下一页`), i)
            : t;
      }
      return i;
    }
    let a = { steps: 0 };
    for (let [i, o] of t.steps.entries()) {
      if (!(0, __contentScope.wd)(o))
        return { status: `failed`, message: `工作流第 ${i + 1} 步格式无效` };
      if (o.type === `navigate` && i !== 0)
        return {
          status: `failed`,
          message: `工作流的 navigate 只能放在第一步`,
        };
      let s = await (0, __contentScope.ff)(e, o, n, r, a, 0, t.steps.slice(i + 1));
      if (s) return s;
    }
    let o = Date.now() + __contentScope.ad;
    for (let e = 0; e < __contentScope.cd; e += 1) {
      let e = Date.now(),
        t = await r.checkpoint?.({ phase: `result` });
      if (t) return t;
      if (((o += Math.max(0, Date.now() - e)), r.whileWaitingForResult)) {
        let e = Date.now(),
          t = await r.whileWaitingForResult();
        if (!t.resolved)
          return (
            n.push(`签到结果等待期间检测到人机验证，未能完成`),
            { status: `failed`, message: `签到结果等待期间的人机验证未完成` }
          );
        if (t.detected) {
          o += Math.max(0, Date.now() - e);
          let t = Date.now(),
            n = await r.checkpoint?.({ phase: `result` });
          if (n) return n;
          o += Math.max(0, Date.now() - t);
        }
      }
      let i = (0, __contentScope.Gu)((0, __contentScope.Uu)(), n);
      if (i.status === `success`) return { status: `success`, message: i.message };
      if (i.status === `already`) return { status: `already`, message: i.message };
      if (Date.now() >= o) return { status: `unknown`, message: i.message };
      await (0, __contentScope.w)(__contentScope.od);
    }
    return {
      status: `unknown`,
      message: `工作流步骤已执行完，未读到签到结果证据`,
    };
  }

  function hf(e) {
    return typeof e == `object` && e && !Array.isArray(e) ? e : null;
  }

  function gf(e) {
    let t = (0, __contentScope.hf)(e.data),
      n = e.message ?? e.msg ?? t?.message ?? t?.msg;
    return typeof n == `string` ? n : ``;
  }

  function _f(e, t) {
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

  function vf(e, t, n, r) {
    if (e === 401 || e === 403)
      return { verdict: `auth-expired`, message: `登录态无效（HTTP ${e}）` };
    if (e === 404 || e === 405)
      return {
        verdict: `unsupported`,
        message: `站点没有这个签到接口（HTTP ${e}）`,
      };
    if ((0, __contentScope._f)(t, n))
      return { verdict: `unsupported`, message: `接口返回 HTML 页面而非 JSON` };
    let i = null;
    try {
      i = (0, __contentScope.hf)(JSON.parse(n));
    } catch {
      i = null;
    }
    if (!i)
      return e >= 400
        ? { verdict: `unsupported`, message: `接口返回 HTTP ${e}` }
        : (0, __contentScope.yf)(n, r.already)
          ? { verdict: `claims-already`, message: `接口提示今日已签到` }
          : (0, __contentScope.yf)(n, r.success)
            ? { verdict: `claims-success`, message: `接口返回签到成功` }
            : {
                verdict: `unreadable`,
                message: `响应不是 JSON 且无可识别文案`,
              };
    let a = (0, __contentScope.hf)(i.data),
      o = (0, __contentScope.gf)(i);
    return e >= 400 || i.success === !1 || a?.success === !1
      ? (0, __contentScope.yf)(o, r.already)
        ? { verdict: `claims-already`, message: o || `接口提示今日已签到` }
        : {
            verdict: `claims-failure`,
            message: o || `接口返回失败（HTTP ${e}）`,
          }
      : i.already === !0 || a?.already === !0
        ? { verdict: `claims-already`, message: o || `接口提示今日已签到` }
        : (0, __contentScope.yf)(o, r.already)
          ? { verdict: `claims-already`, message: o }
          : i.success === !0 || a?.success === !0 || i.code === 0 || i.ret === 1
            ? { verdict: `claims-success`, message: o || `接口返回成功标志` }
            : (0, __contentScope.yf)(o, r.success)
              ? { verdict: `claims-success`, message: o }
              : {
                  verdict: `unreadable`,
                  message: o || `响应缺少可识别的成功或已签到标志`,
                };
  }

  function yf(e, t) {
    return (0, __contentScope.et)(e, t).length > 0;
  }

  function Df(e) {
    return typeof e == `string` && __contentScope.Ef.includes(e);
  }

  function Of(e) {
    return e.length > 1 ? e.replace(/\/+$/, ``) : e;
  }

  function kf(e, t, n = location.href) {
    if (!t.url || !(0, __contentScope.W)(e, t.url)) return !t.url;
    try {
      let e = new URL(t.url, n),
        r = new URL(n);
      return (
        r.origin === e.origin &&
        (0, __contentScope.Of)(r.pathname) === (0, __contentScope.Of)(e.pathname) &&
        (!e.search || r.search === e.search) &&
        (!e.hash || r.hash === e.hash)
      );
    } catch {
      return !1;
    }
  }

  function Af(e) {
    return typeof e == `object` && e && !Array.isArray(e) ? e : null;
  }

  function jf(e) {
    let t = (0, __contentScope.Af)(e.data),
      n = e.message ?? e.msg ?? t?.message ?? t?.msg;
    return typeof n == `string` ? n : ``;
  }

  function Mf(e) {
    try {
      return (0, __contentScope.Af)(JSON.parse(e));
    } catch {
      return null;
    }
  }

  async function Nf(e, t, n = {}) {
    let r = e.checkin,
      i = r?.method ?? `auto`;
    if (!(0, __contentScope.Df)(i)) {
      let e = `未知签到方式: ${String(i)}`;
      return (t.push(e), { status: `failed`, message: e });
    }
    let a = i,
      o = a !== `relogin`,
      c = a === `button` && !!n.buttonBalanceBefore,
      l = a === `none` ? n.loginCheckinBalanceBefore : void 0,
      u = c || !!l,
      d = o && !u ? await (0, __contentScope.za)(e, t) : null,
      f = c ? n.buttonBalanceBefore : (l ?? d);
    (c && t.push(`已恢复签到按钮点击前的余额基线，继续核对页面终态`),
      l && t.push(`已恢复本轮登录前的账号余额基线，开始核对今日总额度增加量`));
    let p = o ? (document.body?.innerText ?? ``) : ``,
      m = await (0, __contentScope.Pf)(e, r, a, t, n, f),
      h =
        c && m.status === `already`
          ? { status: `success`, message: `签到按钮提交后页面显示已完成` }
          : m;
    c && m.status === `already` && t.push(`签到按钮提交后的新页面已显示完成状态`);
    let g = h.status !== `navigate` && h.status !== `relogin` && h.status !== `interrupted`;
    if (o && g) {
      let i = h.status === `already` && !u,
        o = i
          ? 1
          : f
            ? h.status === `failed`
              ? f.fromVisibleText
                ? 12
                : 8
              : f.fromVisibleText
                ? 10
                : 3
            : 3,
        c = null,
        d = { verdict: `unknown` },
        m = null,
        g =
          e.adapter?.quotaPerUnit ??
          ((0, __contentScope.$r)(e).family === __contentScope.s.NEW_API ? 5e5 : 1);
      for (let t = 0; t < o; t += 1) {
        await (0, __contentScope.w)(t === 0 ? 800 : 1e3);
        let n = await (0, __contentScope.za)(e);
        n && (c = n);
        let r = (0, __contentScope.Oa)(p, document.body?.innerText ?? ``, g);
        if ((r != null && (m = r), !f)) {
          if (c) break;
        } else if (((d = (0, __contentScope.Wa)(f, c ?? void 0)), d.verdict === `rewarded`)) break;
      }
      if (i) {
        let e = (0, __contentScope.Da)(document.body?.innerText ?? ``, g);
        if (e != null)
          ((d = {
            ...d,
            reward: e.reward,
            ...(e.symbol ? { rewardSymbol: e.symbol } : {}),
            verdict: `rewarded`,
            source: `checkin-ledger`,
            ...(c ? { quotaAfter: c.quota } : {}),
            ...(c?.symbol ? { balanceSymbol: c.symbol } : {}),
          }),
            t.push(
              `页面记录今日签到奖励 ${(0, __contentScope.Kr)(e.reward, { quotaPerUnit: g }, e.symbol)}（本轮未重复点击）`,
            ));
        else {
          let e =
            d.verdict === `unknown`
              ? `unknown`
              : (d.usageDelta ?? 0) > 0
                ? `already-used`
                : `unchanged`;
          d = { ...d, reward: 0, verdict: e, source: `checkin-ledger` };
        }
      }
      let _ = h.status === `success` || (h.status === `failed` && !r?.claimConfirmSelector);
      (m != null &&
        _ &&
        ((d = {
          ...d,
          reward: m.reward,
          ...(m.symbol ? { rewardSymbol: m.symbol } : {}),
          verdict: `rewarded`,
          source: `visible-reward`,
          ...(c ? { quotaAfter: c.quota } : {}),
          ...(c?.symbol ? { balanceSymbol: c.symbol } : {}),
        }),
        t.push(
          `页面显示本次签到奖励 ${(0, __contentScope.Kr)(m.reward, { quotaPerUnit: g }, m.symbol)}`,
        )),
        _ &&
          (d = (0, __contentScope.ja)(d, { before: p, after: document.body?.innerText ?? `` }, g)));
      let v = (0, __contentScope.Ga)(d, e.adapter?.quotaPerUnit, (0, __contentScope.$r)(e).family);
      if (
        (v && t.push(v),
        c ? await n.saveBalance?.(c) : t.push(`未能读到余额，界面上这个账号的余额会显示为未获取`),
        h.status === `failed` && d.verdict === `rewarded`)
      ) {
        let e = d.source === `visible-reward`;
        return (
          t.push(
            e
              ? `页面结果提示未及时出现，但签到卡奖励文案确认已到账`
              : `页面结果提示未及时出现，但额度守恒差分确认奖励已到账`,
          ),
          {
            status: `success`,
            message: e ? `页面奖励文案确认签到奖励已到账` : `额度差分确认签到奖励已到账`,
            metrics: d,
          }
        );
      }
      return h.status === `unverified` &&
        a === `none` &&
        n.loginHappenedThisRun &&
        l &&
        d.verdict === `rewarded`
        ? (t.push(`页面没有签到控件也没有完成文案，但登录前余额差分确认奖励已到账`),
          {
            status: `success`,
            message: `额度差分确认登录即签到已到账`,
            metrics: d,
          })
        : f || m != null || d.source === `checkin-ledger`
          ? { ...h, metrics: d }
          : h;
    }
    return h;
  }

  async function Pf(e, t, n, r, i, a) {
    let o = __contentScope.If[n];
    return o ? o(e, t, r, i, a) : { status: `failed`, message: `未知签到方式: ${n}` };
  }

  function Ff(e) {
    return { status: `failed`, message: `${e} 签到方式缺少配置` };
  }

  async function Lf(e, t, n, r) {
    n.push(`当前为学习流程回放：执行本站明确启用的已保存步骤`);
    let i = await (0, __contentScope.mf)(e, t?.workflow, n, {
      checkpoint: r.workflowCheckpoint,
      beforeAction: r.beforeCheckinClick,
      afterAction: r.afterCheckinClick,
      beforeNavigate: r.beforeWorkflowNavigate,
      whileWaitingForResult: r.whileWaitingForCheckinResult,
    });
    return i.status === `unknown` ? { status: `failed`, message: i.message } : i;
  }

  async function zf(e, t) {
    if (!e.beforeCheckinClick) return !0;
    let n = await e.beforeCheckinClick();
    return (n || t.push(__contentScope.Rf), n);
  }

  async function Bf(e) {
    if (!e.whileWaitingForCheckinResult) return { resolved: !0, pauseMs: 0 };
    let t = Date.now(),
      n = await e.whileWaitingForCheckinResult();
    return { resolved: n.resolved, pauseMs: n.detected ? Date.now() - t : 0 };
  }

  function Vf(e, t) {
    let n = t?.buttonSelector ? (0, __contentScope.D)(t.buttonSelector) : null,
      r = (0, __contentScope.z)()
        .filter((t) => {
          let n = (0, __contentScope.L)(t);
          return (
            !(0, __contentScope.R)(t) &&
            (0, __contentScope.Wf)(t) &&
            !(0, __contentScope.Gf)(t) &&
            __contentScope.ct.test(n) &&
            !__contentScope.lt.test(n) &&
            !(0, __contentScope.I)(n, e)
          );
        })
        .sort(
          (e, t) =>
            +!(0, __contentScope.vt)(e) - !(0, __contentScope.vt)(t) ||
            (0, __contentScope.Kf)(e) - (0, __contentScope.Kf)(t) ||
            (0, __contentScope.L)(e).length - (0, __contentScope.L)(t).length,
        ),
      i =
        n && !(0, __contentScope.R)(n) && !(0, __contentScope.I)((0, __contentScope.L)(n), e)
          ? [n]
          : [];
    return [...new Set([...i, ...r])];
  }

  function Hf(e) {
    return (
      (0, __contentScope.z)().find(
        (t) => (0, __contentScope.R)(t) && (0, __contentScope.I)((0, __contentScope.L)(t), e),
      ) ?? null
    );
  }

  function Uf(e, t) {
    return (
      (e?.alreadySelector ? (0, __contentScope.D)(e.alreadySelector) : null) ??
      (0, __contentScope.Hf)(t)
    );
  }

  function Wf(e) {
    return (0, __contentScope.vt)(e)
      ? !0
      : e.closest(
            [
              `nav`,
              `aside`,
              `[role="navigation"]`,
              `[role="menu"]`,
              `[role="menubar"]`,
              `[class*="sidebar" i]`,
              `[class*="side-bar" i]`,
              `[class*="sider" i]`,
              `[class*="menu" i]`,
            ].join(`, `),
          )
        ? !1
        : e.matches(`button, input[type="button"], input[type="submit"], [role="button"]`) ||
            e instanceof HTMLAnchorElement
          ? !0
          : !e.querySelector(
              [
                `button`,
                `[role="button"]`,
                `input[type="button"]`,
                `input[type="submit"]`,
                `a[href]`,
                `[onclick]`,
              ].join(`, `),
            ) &&
            e.children.length <= 2 &&
            (0, __contentScope.L)(e).replace(/\s+/g, ` `).length <= 40;
  }

  function Gf(e) {
    if (!(e instanceof HTMLAnchorElement) || e.getAttribute(`role`)?.toLowerCase() === `button`)
      return !1;
    let t = e.getAttribute(`href`)?.trim() ?? ``;
    if (!t || t === `#` || /^javascript:/i.test(t)) return !1;
    try {
      let e = new URL(t, location.href);
      return e.protocol === `http:` || e.protocol === `https:`;
    } catch {
      return !1;
    }
  }

  function Kf(e) {
    return e.matches(`button, input[type="button"], input[type="submit"], [role="button"]`)
      ? 0
      : e instanceof HTMLAnchorElement
        ? 1
        : 2;
  }

  function qf(e, t) {
    try {
      let n = new URL(e, location.href),
        r = new URL(t, location.href);
      return (
        n.origin === r.origin &&
        n.pathname === r.pathname &&
        n.search === r.search &&
        n.hash === r.hash
      );
    } catch {
      return !1;
    }
  }

  function Jf(e) {
    let t = new URL(e, location.href);
    return `${t.pathname}${t.search}${t.hash}`;
  }

  async function Yf(e, t) {
    let n = [...document.querySelectorAll(`[aria-expanded="false"]`)]
      .filter((e) => (0, __contentScope.O)(e))
      .filter((e) => {
        let t = (0, __contentScope.L)(e).replace(/\s+/g, ` `).trim();
        if (!t || t.length > 40) return !1;
        let n = t.toLowerCase();
        return __contentScope.Cf.some((e) => n.includes(e.toLowerCase()));
      });
    if (!n.length) return !1;
    let r = new Set(),
      i = n.filter((e) => {
        let t = (0, __contentScope.L)(e).replace(/\s+/g, ` `).trim();
        return !r.has(t) && (r.add(t), !0);
      }),
      a = 0;
    for (let n of i.slice(0, __contentScope.wf)) {
      if (n.getAttribute(`aria-expanded`) !== `false`) continue;
      let r = (0, __contentScope.L)(n).replace(/\s+/g, ` `).trim();
      if (!(await (0, __contentScope.B)(n, e, t, `折叠面板「${r}」`))) {
        try {
          await (0, __contentScope.M)(n);
        } catch {
          continue;
        }
        (t.push(`已展开折叠的签到面板「${r}」`), (a += 1), await (0, __contentScope.w)(400));
      }
    }
    return a > 0;
  }

  async function Xf(e, t, n) {
    let r = Date.now() + n,
      i = !!t?.claimConfirmSelector?.trim();
    for (;;) {
      if (i && (0, __contentScope.sp)(t)) return { claim: !0 };
      let n = (0, __contentScope.Uf)(t, e);
      if (n && (!i || Date.now() >= r)) return { already: !0 };
      let a = (0, __contentScope.Vf)(e, t);
      if (t?.buttonSelector) {
        let n = (0, __contentScope.D)(t.buttonSelector);
        if (n && !(0, __contentScope.R)(n) && !(0, __contentScope.I)((0, __contentScope.L)(n), e))
          return { buttons: [n] };
      } else if (a.length) return { buttons: a };
      if (Date.now() >= r) return n ? { already: !0 } : null;
      await (0, __contentScope.w)(__contentScope.Tf);
    }
  }

  function Zf(e) {
    return (
      [...document.querySelectorAll(`a[href]`)]
        .filter((e) => (0, __contentScope.dt)(e))
        .map((e) => {
          try {
            return { anchor: e, target: new URL(e.href, location.href) };
          } catch {
            return null;
          }
        })
        .filter((e) => !!e)
        .filter(
          ({ anchor: t, target: n }) =>
            (0, __contentScope.W)(e, n.href) &&
            (__contentScope.st.test(n.pathname) || __contentScope.ct.test(t.innerText.trim())),
        )
        .sort(
          (e, t) =>
            +!__contentScope.st.test(e.target.pathname) -
              !__contentScope.st.test(t.target.pathname) ||
            e.anchor.innerText.length - t.anchor.innerText.length,
        )[0]?.anchor ?? null
    );
  }

  async function Qf(e, t, n, r) {
    if (!(await (0, __contentScope.zf)(r, n)))
      return { status: `failed`, message: __contentScope.Rf };
    let i = t?.alreadyText?.length ? t.alreadyText : __contentScope.F;
    if ((0, __contentScope.Uf)(t, i)) {
      if (t?.claimConfirmSelector) {
        let a = await (0, __contentScope.Xf)(i, t, __contentScope.rp);
        if (a && `claim` in a) return (0, __contentScope.lp)(null, e, t, n, r, !0);
      }
      return { status: `already`, message: `完成人机验证后页面显示今日已签到` };
    }
    let a = t?.buttonSelector ? await (0, __contentScope.Xf)(i, t, __contentScope.xf) : null;
    if (a && `claim` in a) return (0, __contentScope.lp)(null, e, t, n, r, !0);
    if (a && `already` in a)
      return { status: `already`, message: `完成人机验证后页面显示今日已签到` };
    let o = a && `buttons` in a ? a.buttons : t?.buttonSelector ? [] : (0, __contentScope.Vf)(i, t);
    if (o.length === 0)
      return {
        status: `failed`,
        message: t?.buttonSelector
          ? `完成人机验证后未找到配置的签到按钮: ${t.buttonSelector}`
          : `完成人机验证后未找到可点击的签到按钮`,
      };
    let s = null;
    for (let i of o.slice(0, 3)) {
      let a = await (0, __contentScope.lp)(i, e, t, n, r);
      if (a.status !== `blocked`) return a;
      s = a.message;
    }
    return {
      status: `failed`,
      message: s ?? `签到按钮被遮挡，可能有未关闭的公告弹窗`,
    };
  }

  function ap(e) {
    let t = e.getAttribute(`data-disabled`),
      n = e.getAttribute(`data-state`);
    return (
      (0, __contentScope.R)(e) ||
      (t != null && t !== `false`) ||
      n === `disabled` ||
      e.getAttribute(`aria-busy`) === `true` ||
      window.getComputedStyle(e).pointerEvents === `none`
    );
  }

  function op(e) {
    let t = (0, __contentScope.L)(e).replace(/\s+/g, ``);
    if ((0, __contentScope.I)(t, __contentScope.$f)) return !0;
    let n = (0, __contentScope.vt)(e),
      r = n?.innerText ?? n?.textContent ?? ``;
    return !!n && __contentScope.tp.test(r) && __contentScope.np.test(t);
  }

  function sp(e, t) {
    let n = e?.claimConfirmSelector ? (0, __contentScope.D)(e.claimConfirmSelector) : null,
      r = e?.claimConfirmSelector ? (n ? [n] : []) : (0, __contentScope.z)();
    for (let e of r)
      if (
        (0, __contentScope.dt)(e) &&
        (e === n || (0, __contentScope.op)(e)) &&
        !(
          e !== n &&
          t &&
          (0, __contentScope.L)(e) === t.text &&
          (0, __contentScope.vt)(e) === t.modal
        )
      )
        return { control: e, pending: (0, __contentScope.ap)(e) };
    return null;
  }

  function cp(e, t, n) {
    return (0, __contentScope.I)(e, n) && !(0, __contentScope.I)(t, n);
  }

  async function lp(e, t, n, r, i, a = !1) {
    let o = n?.alreadyText?.length ? n.alreadyText : __contentScope.F,
      s = n?.successText?.length ? n.successText : __contentScope.tt,
      c = document.body?.innerText ?? ``,
      l = (0, __contentScope.I)(c, s),
      u = (0, __contentScope.I)(c, o),
      d = !!(n?.successSelector && (0, __contentScope.D)(n.successSelector)),
      f = !!(n?.alreadySelector && (0, __contentScope.D)(n.alreadySelector)),
      p = !a && e ? { text: (0, __contentScope.L)(e), modal: (0, __contentScope.vt)(e) } : void 0;
    if (a) r.push(`检测到上次主签到后尚待领取奖励，恢复二次确认流程`);
    else {
      if (!e) return { status: `failed`, message: `未找到可点击的主签到按钮` };
      let n = await (0, __contentScope.B)(e, t, r);
      if (n)
        return {
          status: `blocked`,
          message: `签到按钮被${(0, __contentScope.N)(n)}遮挡，可能有未关闭的公告弹窗`,
        };
      let a = (0, __contentScope.L)(e).slice(0, 30);
      if (
        (await (0, __contentScope.M)(e, { mayNavigate: !0 }),
        r.push(`已点击自动识别的签到按钮「${a}」`),
        i.afterCheckinClick && !(await i.afterCheckinClick()))
      )
        return { status: `failed`, message: `签到点击后的人机验证未完成` };
    }
    let m = 0,
      h = Date.now(),
      g = h + 22e3,
      _ = h + __contentScope.rp,
      v = !!n?.claimConfirmSelector?.trim(),
      y = new WeakSet(),
      b = a,
      x = !1,
      S = null,
      C = c,
      ee = !1,
      te = !1,
      ne = null;
    for (; Date.now() < g;) {
      await (0, __contentScope.w)(400);
      let a = await (0, __contentScope.Bf)(i);
      if (!a.resolved) return { status: `failed`, message: `签到点击后的人机验证未完成` };
      ((g += a.pauseMs), (_ += a.pauseMs));
      let c = document.body?.innerText ?? ``;
      S = (0, __contentScope.ot)(c) ?? S;
      let h = (0, __contentScope.sp)(n, p);
      if (h && ((b = !0), !y.has(h.control) && m < 5 && (!v || m === 0))) {
        if (h.pending) {
          x ||= (r.push(`已出现二次确认按钮，等待「领取奖励」解锁`), !0);
          continue;
        }
        if (!(await (0, __contentScope.zf)(i, r)))
          return { status: `failed`, message: __contentScope.Rf };
        let e = (0, __contentScope.sp)(n, p);
        if (!e || e.pending || y.has(e.control) || (v && m > 0)) continue;
        let a = (0, __contentScope.L)(e.control).slice(0, 20);
        ((C = document.body?.innerText ?? ``),
          (ee = !!(0, __contentScope.Hf)(o)),
          (te = !!(n?.alreadySelector && (0, __contentScope.D)(n.alreadySelector))));
        let s = await (0, __contentScope.B)(e.control, t, r, `二次确认按钮`);
        if (s) {
          r.push(`二次确认按钮被${(0, __contentScope.N)(s)}遮挡，稍后重新定位`);
          continue;
        }
        try {
          await (0, __contentScope.M)(e.control);
        } catch (e) {
          r.push(
            `二次确认按钮点击未获浏览器确认，将重新定位后重试：${e instanceof Error ? e.message : String(e)}`,
          );
          continue;
        }
        (y.add(e.control), (m += 1), r.push(`已点击二次确认按钮「${a}」（第 ${m} 次）`));
        let c = Date.now();
        if (i.afterCheckinClick && !(await i.afterCheckinClick()))
          return {
            status: `failed`,
            message: `领取奖励点击后的人机验证未完成`,
          };
        let l = Date.now() - c;
        ((g += l), (_ += l), await (0, __contentScope.w)(3200));
        continue;
      }
      let re = (0, __contentScope.Hf)(o),
        ie = n?.alreadySelector ? (0, __contentScope.D)(n.alreadySelector) : null;
      if (m > 0) {
        if ((0, __contentScope.cp)(c, C, __contentScope.ep))
          return { status: `success`, message: `页面出现领取奖励成功提示` };
        if ((!ee && re) || (!te && ie))
          return {
            status: `success`,
            message: `领取后页面新出现今日已签到状态`,
          };
        continue;
      }
      if (b) continue;
      let T = null;
      if (
        (!l && (0, __contentScope.I)(c, s)
          ? (T = { status: `success`, message: `页面出现签到成功提示` })
          : !u && (0, __contentScope.I)(c, o)
            ? (T = { status: `success`, message: `点击后页面显示今日已签到` })
            : e &&
                document.contains(e) &&
                (0, __contentScope.R)(e) &&
                (0, __contentScope.I)((0, __contentScope.L)(e), o)
              ? (T = { status: `success`, message: `签到按钮已变为今日已签到` })
              : re
                ? (T = {
                    status: `success`,
                    message: `签到按钮已替换为今日已签到状态`,
                  })
                : !d && n?.successSelector && (0, __contentScope.D)(n.successSelector)
                  ? (T = { status: `success`, message: `命中签到成功标志` })
                  : !f &&
                    ie &&
                    (T = {
                      status: `success`,
                      message: `点击后命中今日已签到标志`,
                    }),
        T)
      ) {
        if (((ne = T), !v && Date.now() >= _)) return T;
      } else if (!v && ne && Date.now() >= _) return ne;
    }
    return m > 0
      ? {
          status: `failed`,
          message: `已点击 ${m} 次「领取奖励」，待余额差分确认结果`,
        }
      : b
        ? {
            status: `failed`,
            message: `已发现「领取奖励」，但等待期内始终未完成有效点击`,
          }
        : v
          ? {
              status: `failed`,
              message: `未等到站点必需的「领取奖励」二次确认`,
            }
          : ne ||
            (S
              ? { status: `failed`, message: `站点确认签到失败：${S}` }
              : {
                  status: `failed`,
                  message: `点击自动识别的签到按钮后缺少明确结果`,
                });
  }

  async function up(e, t, n, r, i, a) {
    let o = t?.alreadyText?.length ? t.alreadyText : __contentScope.F,
      s = t?.successText?.length ? t.successText : __contentScope.tt,
      c = (0, __contentScope.Uf)(t, o);
    if (c) {
      if (t?.claimConfirmSelector) {
        n.push(`页面已显示主签到完成，短暂检查是否还有待领取奖励`);
        let r = await (0, __contentScope.Xf)(o, t, __contentScope.rp);
        if (r && `claim` in r) return (0, __contentScope.lp)(null, e, t, n, a, !0);
      }
      return (
        n.push(`自动识别到已签到状态「${(0, __contentScope.L)(c).slice(0, 30)}」`),
        { status: `already`, message: `页面显示今日已签到` }
      );
    }
    let l = location.pathname,
      u = (0, __contentScope.ti)(e, l, document.title),
      d = __contentScope.st.test(l) || __contentScope.ip.test(document.title) || u;
    if (
      (d && n.push(`已在签到页 ${l}，等待签到组件渲染（最多 ${__contentScope.bf / 1e3} 秒）…`),
      !(await (0, __contentScope.zf)(a, n)))
    )
      return { status: `failed`, message: __contentScope.Rf };
    let f = await (0, __contentScope.Xf)(o, t, d ? __contentScope.bf : __contentScope.xf);
    if (
      (!f &&
        (await (0, __contentScope.Yf)(e, n)) &&
        (f = await (0, __contentScope.Xf)(o, t, __contentScope.Sf)),
      f && `already` in f)
    )
      return (
        n.push(`等待期间出现已签到状态`),
        { status: `already`, message: `页面显示今日已签到` }
      );
    if (f && `claim` in f) return (0, __contentScope.lp)(null, e, t, n, a, !0);
    if (f) return (0, __contentScope.Qf)(e, t, n, a);
    if (d && (0, __contentScope.I)(document.body?.innerText ?? ``, o))
      return (
        n.push(`未找到可点签到控件，页面正文显示今日已签到`),
        { status: `already`, message: `页面显示今日已签到` }
      );
    if (r) {
      if (!i) {
        let e = `当前页没有签到控件，且本轮没有发生登录动作：无法确认「登录即签到」已完成`;
        return (n.push(e), { status: `unverified`, message: e });
      }
      let e = document.body?.innerText ?? ``;
      if ((0, __contentScope.I)(e, s) || (0, __contentScope.I)(e, o))
        return (
          n.push(`当前页没有签到控件，但页面正文明确显示签到完成，按「登录即签到」确认成功`),
          { status: `success`, message: `登录即签到` }
        );
      let t = `当前页没有签到控件，且没有余额入账或页面证据可确认「登录即签到」，无法确认本次签到`;
      return (n.push(t), { status: `unverified`, message: t });
    }
    let p = (0, __contentScope.Zf)(e);
    if (p) {
      let e = new URL(p.href, location.href).href;
      if (!(0, __contentScope.qf)(e, location.href))
        return (
          n.push(`自动发现签到页 ${(0, __contentScope.Jf)(e)}，准备跳转`),
          { status: `navigate`, url: e }
        );
    }
    if (t?.url && (0, __contentScope.W)(e, t.url)) {
      let e = new URL(t.url, location.href).href;
      if (!(0, __contentScope.qf)(e, location.href))
        return (
          n.push(`按站点配置的签到页 ${(0, __contentScope.Jf)(e)} 跳转`),
          { status: `navigate`, url: e }
        );
    }
    let m = (0, __contentScope.ei)(e);
    if (m && !d && (0, __contentScope.W)(e, m)) {
      let e = new URL(m, location.href).href;
      if (new URL(e).pathname !== l)
        return (
          n.push(`按站点适配器进入默认签到页 ${(0, __contentScope.Jf)(e)}`),
          { status: `navigate`, url: e }
        );
    }
    let h = (0, __contentScope.z)()
        .map((e) => (0, __contentScope.L)(e).replace(/\s+/g, ` `).trim())
        .filter((e) => e && e.length <= 20),
      g = [...new Set(h)].slice(0, 8);
    return (
      g.length
        ? n.push(`页面可点元素：${g.join(` / `)}`)
        : n.push(`页面上没有可点元素，可能仍在加载或需要先展开某个面板`),
      {
        status: `failed`,
        message: d ? `签到页未找到明确按钮或已签到状态` : `未自动发现同源签到入口`,
      }
    );
  }

  async function dp(e, t, n, r) {
    let i = await (0, __contentScope.za)(e, n);
    if (
      (i
        ? (r.saveReloginBalanceBefore
            ? await r.saveReloginBalanceBefore(i)
            : await r.saveBalance?.(i),
          n.push(`已记录退出前余额，第二次登录后将按差额核对奖励`))
        : n.push(`退出前未能读取余额，第二次登录仍会刷新余额，但无法计算本次差额`),
      t.logoutApiUrl)
    ) {
      if (!(0, __contentScope.W)(e, t.logoutApiUrl))
        return {
          status: `failed`,
          message: `退出接口不是本站地址，已拒绝请求`,
        };
      let r = new URL(t.logoutApiUrl, location.href).href;
      n.push(`请求退出接口 ${r}`);
      try {
        let e = {};
        t.localStorageToken && Object.assign(e, (0, __contentScope.pp)(t.localStorageToken));
        let i = await fetch(r, {
            method: `GET`,
            credentials: `include`,
            headers: e,
            redirect: `error`,
          }),
          a = (0, __contentScope.Mf)((await i.text()).slice(0, 2e3)),
          o = a ? (0, __contentScope.Af)(a.data) : null,
          s = a ? (0, __contentScope.jf)(a) : ``;
        if (!i.ok) return { status: `failed`, message: `退出接口返回 HTTP ${i.status}` };
        if (a?.success === !1 || o?.success === !1)
          return { status: `failed`, message: s || `退出接口明确返回失败` };
        n.push(`退出接口调用成功`);
      } catch (e) {
        return {
          status: `failed`,
          message: `退出接口失败: ${e instanceof Error ? e.message : String(e)}`,
        };
      }
      return (
        (0, __contentScope.fp)(t, n),
        { status: `relogin`, url: e.loginUrl, message: `已退出，准备重新登录` }
      );
    }
    if (t.logoutMenuSelector) {
      if (await (0, __contentScope.k)(t.logoutMenuSelector, 8e3)) {
        if (!(await (0, __contentScope.zf)(r, n)))
          return { status: `failed`, message: __contentScope.Rf };
        let i = await (0, __contentScope.k)(t.logoutMenuSelector, 8e3);
        if (!i) return { status: `failed`, message: `完成人机验证后找不到用户菜单` };
        let a = await (0, __contentScope.B)(i, e, n, `用户菜单`);
        if (a)
          return {
            status: `failed`,
            message: `用户菜单被${(0, __contentScope.N)(a)}遮挡，无法切换账号`,
          };
        (await (0, __contentScope.M)(i),
          n.push(`已展开用户菜单`),
          await (0, __contentScope.w)(600));
      } else n.push(`未找到用户菜单: ${t.logoutMenuSelector}`);
    }
    if (!t.logoutSelector)
      return {
        status: `failed`,
        message: `relogin 方式需要配置退出按钮选择器或退出接口`,
      };
    if (!(await (0, __contentScope.k)(t.logoutSelector, 8e3)))
      return {
        status: `failed`,
        message: `找不到退出按钮: ${t.logoutSelector}`,
      };
    if (!(await (0, __contentScope.zf)(r, n)))
      return { status: `failed`, message: __contentScope.Rf };
    let a = await (0, __contentScope.k)(t.logoutSelector, 8e3);
    if (!a)
      return {
        status: `failed`,
        message: `完成人机验证后找不到退出按钮: ${t.logoutSelector}`,
      };
    let o = await (0, __contentScope.B)(a, e, n, `退出登录按钮`);
    return o
      ? {
          status: `failed`,
          message: `退出登录按钮被${(0, __contentScope.N)(o)}遮挡，无法切换账号`,
        }
      : (n.push(`准备点击退出登录（站点可能立即跳转）`),
        await r.saveReloginStage?.(),
        await (0, __contentScope.M)(a, { mayNavigate: !0 }),
        n.push(`已点击退出登录`),
        await (0, __contentScope.w)(1200),
        (0, __contentScope.fp)(t, n),
        {
          status: `relogin`,
          url: e.loginUrl,
          message: `已退出，准备重新登录`,
        });
  }

  function fp(e, t) {
    let n = new Set(e.logoutStorageKeys ?? []);
    if (e.localStorageToken) {
      let t = e.localStorageToken.indexOf(`=`),
        r = t >= 0 ? e.localStorageToken.slice(t + 1).trim() : ``,
        i = r.search(/\s/);
      i > 0 && (r = r.slice(i + 1).trim());
      let a = r.split(`.`)[0]?.trim();
      a && n.add(a);
    }
    let r = 0;
    for (let e of n) localStorage.getItem(e) != null && (localStorage.removeItem(e), r++);
    r && t.push(`已清除 ${r} 项本地登录态`);
  }

  function pp(e) {
    try {
      let t = e.indexOf(`=`);
      if (t <= 0) return {};
      let n = e.slice(0, t).trim(),
        r = e.slice(t + 1).trim();
      if (!n || !r) return {};
      let i = ``,
        a = r.search(/\s/);
      if (a > 0) {
        if (((i = `${r.slice(0, a).trim()} `), (r = r.slice(a + 1).trim()), !r)) return {};
      } else if (/\s$/.test(e)) return {};
      let o = r.indexOf(`.`),
        s = o === -1 ? r : r.slice(0, o),
        c = o === -1 ? `` : r.slice(o + 1),
        l = localStorage.getItem(s);
      if (!l) return {};
      let u = c ? JSON.parse(l)[c] : l;
      return u == null || u === `` ? {} : { [n]: `${i}${String(u)}` };
    } catch {
      return {};
    }
  }

  async function mp(e, t, n) {
    if (!t.apiUrl) return { status: `failed`, message: `签到方式为 api 但未填接口地址` };
    if (!(0, __contentScope.W)(e, t.apiUrl))
      return { status: `failed`, message: `签到接口不是本站地址，已拒绝请求` };
    let r = new URL(t.apiUrl, location.href).href,
      i = t.apiMethod ?? `POST`;
    n.push(`请求签到接口 ${i} ${r}`);
    let a = t.apiBody ? { 'Content-Type': `application/json` } : {};
    if (t.localStorageToken) {
      let e = (0, __contentScope.pp)(t.localStorageToken);
      Object.assign(a, e);
      let r = Object.keys(e);
      n.push(
        r.length
          ? `已附加请求头 ${r.join(`, `)}`
          : `未能从 localStorage 读到 token（${t.localStorageToken}）`,
      );
    }
    try {
      let e = await fetch(r, {
          method: i,
          credentials: `include`,
          headers: a,
          body: i === `GET` ? void 0 : (t.apiBody ?? void 0),
          redirect: `error`,
        }),
        o = (await e.text()).slice(0, 2e3);
      n.push(`签到接口返回 HTTP ${e.status}`);
      let s = (0, __contentScope.vf)(e.status, e.headers.get(`content-type`) ?? ``, o, {
        success: t.successText?.length ? t.successText : __contentScope.tt,
        already: t.alreadyText?.length ? t.alreadyText : __contentScope.F,
      });
      return s.verdict === `claims-success`
        ? { status: `success`, message: s.message }
        : s.verdict === `claims-already`
          ? { status: `already`, message: s.message }
          : { status: `failed`, message: s.message };
    } catch (e) {
      return {
        status: `failed`,
        message: `签到请求失败: ${e instanceof Error ? e.message : String(e)}`,
      };
    }
  }

  async function hp(e, t, n) {
    let r = Date.now() + __contentScope.bf,
      i = null,
      a = !1;
    for (;;) {
      let o = (0, __contentScope.D)(e);
      if (o) {
        if (
          ((i = o),
          !(0, __contentScope.R)(o) ||
            (0, __contentScope.I)((o.innerText || o.textContent || ``).trim(), t))
        )
          return { button: o };
        a ||= (n.push(`签到按钮当前不可点，等待站点加载签到状态…`), !0);
      }
      if (Date.now() >= r) return { button: i };
      await (0, __contentScope.w)(__contentScope.Tf);
    }
  }

  async function gp(e, t, n, r, i) {
    if (!t.buttonSelector)
      return {
        status: `failed`,
        message: `签到方式为 button 但未填按钮选择器`,
      };
    if (t.url) {
      if (!(0, __contentScope.W)(e, t.url))
        return {
          status: `failed`,
          message: `签到页面不是本站地址，已停止跳转`,
        };
      let r = new URL(t.url, location.href).href;
      if (
        !(t.entry?.readySelector && (0, __contentScope.D)(t.entry.readySelector)) &&
        !(0, __contentScope.kf)(e, t)
      )
        return (n.push(`签到页在 ${r}，准备跳转`), { status: `navigate`, url: r });
    }
    let a = t.alreadySelector;
    if (a && (0, __contentScope.D)(a))
      return (
        n.push(`命中「已签到」标志，本次不重复点击`),
        { status: `already`, message: `页面显示今日已签到` }
      );
    let o = t.alreadyText?.length ? t.alreadyText : __contentScope.F,
      s = t.successText?.length ? t.successText : __contentScope.tt;
    if (!(await (0, __contentScope.zf)(r, n)))
      return { status: `failed`, message: __contentScope.Rf };
    let c = await (0, __contentScope.hp)(t.buttonSelector, o, n);
    if (!c.button)
      return (0, __contentScope.I)(document.body?.innerText ?? ``, o)
        ? (n.push(`未找到签到按钮，但页面文本显示已签到`),
          { status: `already`, message: `页面文本显示今日已签到` })
        : { status: `failed`, message: `找不到签到按钮: ${t.buttonSelector}` };
    if (!(await (0, __contentScope.zf)(r, n)))
      return { status: `failed`, message: __contentScope.Rf };
    let l = r.beforeCheckinClick ? await (0, __contentScope.hp)(t.buttonSelector, o, n) : c;
    if (!l.button)
      return (a && (0, __contentScope.D)(a)) ||
        (0, __contentScope.I)(document.body?.innerText ?? ``, o)
        ? { status: `already`, message: `完成人机验证后页面显示今日已签到` }
        : {
            status: `failed`,
            message: `完成人机验证后找不到签到按钮: ${t.buttonSelector}`,
          };
    let u = l.button,
      d = document.body?.innerText ?? ``;
    if ((0, __contentScope.R)(u))
      return (0, __contentScope.I)((u.innerText || u.textContent || ``).trim(), o) ||
        (0, __contentScope.I)(d, o)
        ? (n.push(`签到按钮处于禁用态，且页面有明确已签到文案`),
          { status: `already`, message: `页面显示今日已签到` })
        : {
            status: `failed`,
            message: `签到按钮已禁用，但没有明确的已签到标志`,
          };
    let f = (0, __contentScope.I)(d, s),
      p = (0, __contentScope.I)(d, o),
      m = t.successSelector ? !!(0, __contentScope.D)(t.successSelector) : !1,
      h = await (0, __contentScope.B)(u, e, n);
    if (h)
      return {
        status: `failed`,
        message: `签到按钮被${(0, __contentScope.N)(h)}遮挡，可能有未关闭的公告弹窗`,
      };
    if (
      (i &&
        r.saveButtonBalanceBefore &&
        (await r.saveButtonBalanceBefore(i), n.push(`已保存签到按钮点击前的余额基线`)),
      await (0, __contentScope.M)(u, {
        mayNavigate: !0,
        reconcileAfterLostResponse: !0,
      }),
      n.push(`已点击签到按钮`),
      r.afterCheckinClick && !(await r.afterCheckinClick()))
    )
      return { status: `failed`, message: `签到点击后的安全验证未完成` };
    let g = !!t.successSelector && !m,
      _ = Date.now() + (g ? 18e3 : 8e3),
      v = null;
    for (; Date.now() < _;) {
      await (0, __contentScope.w)(400);
      let e = await (0, __contentScope.Bf)(r);
      if (!e.resolved) return { status: `failed`, message: `签到点击后的安全验证未完成` };
      _ += e.pauseMs;
      let n = document.body?.innerText ?? ``;
      if (
        ((v = (0, __contentScope.ot)(n) ?? v),
        g && t.successSelector && (0, __contentScope.D)(t.successSelector))
      )
        return { status: `success`, message: `命中签到成功标志` };
      if (!f && (0, __contentScope.I)(n, s))
        return { status: `success`, message: `页面出现签到成功提示` };
      if (!p && (0, __contentScope.I)(n, o))
        return { status: `success`, message: `点击后页面提示今日已签到` };
      if (a && (0, __contentScope.D)(a))
        return { status: `success`, message: `点击后出现已签到状态` };
    }
    return v
      ? { status: `failed`, message: `站点确认签到失败：${v}` }
      : { status: `failed`, message: `点击签到后未检测到明确结果，请手动确认` };
  }

  async function vp(e, t, n, r) {
    if (!t.claimEntrySelector)
      return {
        status: `failed`,
        message: `签到方式为 claim 但未填领取入口选择器`,
      };
    if (!t.claimInputSelector)
      return {
        status: `failed`,
        message: `签到方式为 claim 但未填输入框选择器`,
      };
    if (!t.claimSubmitSelector)
      return {
        status: `failed`,
        message: `签到方式为 claim 但未填提交按钮选择器`,
      };
    if (t.url) {
      if (!(0, __contentScope.W)(e, t.url))
        return {
          status: `failed`,
          message: `领取页面不是本站地址，已停止跳转`,
        };
      let r = new URL(t.url, location.href).href,
        i = new URL(location.href),
        a = new URL(r);
      if (
        !(a.hash
          ? i.origin === a.origin &&
            i.pathname === a.pathname &&
            i.search === a.search &&
            i.hash === a.hash
          : i.href.replace(/#.*$/, ``).startsWith(a.href.replace(/#.*$/, ``)))
      )
        return (n.push(`领取入口在 ${r}，准备跳转`), { status: `navigate`, url: r });
    }
    let i = t.alreadyText?.length ? t.alreadyText : __contentScope.F,
      a = t.successText?.length ? t.successText : __contentScope.tt,
      o = (e) => /已过期|expired/i.test(e);
    if (t.alreadySelector && (0, __contentScope.D)(t.alreadySelector))
      return (n.push(`命中「已领取」标志`), { status: `already`, message: `页面显示权益已领取` });
    let s = document.body?.innerText ?? ``;
    if ((0, __contentScope.I)(s, i))
      return (
        n.push(`页面正文显示权益已领取`),
        { status: `already`, message: `页面显示权益已领取` }
      );
    if (!o(s) && (0, __contentScope.I)(s, a))
      return (
        n.push(`页面正文显示权益已生效，无需重复领取`),
        { status: `already`, message: `页面显示权益已生效` }
      );
    o(s) && n.push(`套餐仍显示已过期，不能按“已领取”文案判定成功`);
    let c = (0, __contentScope.D)(t.claimInputSelector);
    if (c) n.push(`领取弹窗已经打开，跳过点击入口`);
    else {
      if (!(await (0, __contentScope.k)(t.claimEntrySelector, 12e3)))
        return {
          status: `failed`,
          message: `找不到领取入口: ${t.claimEntrySelector}`,
        };
      if (!(await (0, __contentScope.zf)(r, n)))
        return { status: `failed`, message: __contentScope.Rf };
      let i = await (0, __contentScope.k)(t.claimEntrySelector, 12e3);
      if (!i)
        return {
          status: `failed`,
          message: `完成人机验证后找不到领取入口: ${t.claimEntrySelector}`,
        };
      let a = await (0, __contentScope.B)(i, e, n);
      if (a)
        return {
          status: `failed`,
          message: `领取入口被${(0, __contentScope.N)(a)}遮挡，可能有未关闭的公告弹窗`,
        };
      if (
        (await (0, __contentScope.M)(i),
        n.push(`已点击领取入口，等待弹窗`),
        (c = await (0, __contentScope.k)(t.claimInputSelector, 1e4)),
        !c)
      )
        return {
          status: `failed`,
          message: `领取弹窗未出现输入框: ${t.claimInputSelector}`,
        };
    }
    let l = t.claimMinLength ?? 10,
      u;
    if (t.claimUniqueText && !t.claimText?.trim()) {
      let e = (0, __contentScope.Er)(t.claimUsedTexts, l);
      ((u = e.text),
        e.exhausted &&
          n.push(
            `预置领取理由已全部用过（${t.claimUsedTexts?.length ?? 0} 条），本次可能因重复被拒`,
          ));
    } else u = t.claimText?.trim() || __contentScope._p;
    if (u.length < l)
      return {
        status: `failed`,
        message: `领取文本太短：站点要求至少 ${l} 字，当前 ${u.length} 字`,
      };
    if (!(await (0, __contentScope.zf)(r, n)))
      return { status: `failed`, message: __contentScope.Rf };
    if (((c = await (0, __contentScope.k)(t.claimInputSelector, 8e3)), !c))
      return {
        status: `failed`,
        message: `完成人机验证后找不到领取输入框: ${t.claimInputSelector}`,
      };
    ((0, __contentScope.A)(c, u),
      n.push(`已填入领取文本（${u.length} 字）`),
      await (0, __contentScope.w)(300));
    let d = await (0, __contentScope.k)(t.claimSubmitSelector, 8e3);
    if (!d)
      return {
        status: `failed`,
        message: `找不到领取提交按钮: ${t.claimSubmitSelector}`,
      };
    if (!(await (0, __contentScope.zf)(r, n)))
      return { status: `failed`, message: __contentScope.Rf };
    let f = r.beforeCheckinClick ? await (0, __contentScope.k)(t.claimSubmitSelector, 8e3) : d;
    if (!f)
      return {
        status: `failed`,
        message: `完成人机验证后找不到领取提交按钮: ${t.claimSubmitSelector}`,
      };
    if ((0, __contentScope.R)(f))
      return {
        status: `failed`,
        message: `完成人机验证后领取提交按钮仍不可点击`,
      };
    let p = document.body?.innerText ?? ``,
      m = (0, __contentScope.I)(p, a),
      h = (0, __contentScope.I)(p, i),
      g = t.successSelector ? !!(0, __contentScope.D)(t.successSelector) : !1,
      _ = await (0, __contentScope.B)(f, e, n);
    if (_)
      return {
        status: `failed`,
        message: `领取按钮被${(0, __contentScope.N)(_)}遮挡，可能有未关闭的公告弹窗`,
      };
    (await (0, __contentScope.M)(f, { mayNavigate: !0 }), n.push(`已点击领取按钮`));
    let v = t.claimUniqueText && !t.claimText?.trim() ? u : void 0,
      y = Date.now() + (t.successSelector && !g ? 2e4 : 1e4),
      b = null;
    for (; Date.now() < y;) {
      await (0, __contentScope.w)(400);
      let e = document.body?.innerText ?? ``;
      if (
        (e !== p && (b = (0, __contentScope.ot)(e) ?? b),
        !o(e) && !g && t.successSelector && (0, __contentScope.D)(t.successSelector))
      )
        return {
          status: `success`,
          message: `命中领取成功标志`,
          claimTextUsed: v,
        };
      if (!o(e) && !m && (0, __contentScope.I)(e, a))
        return {
          status: `success`,
          message: `页面出现领取成功提示`,
          claimTextUsed: v,
        };
      if (!o(e) && !h && (0, __contentScope.I)(e, i))
        return {
          status: `already`,
          message: `页面提示权益已领取或已生效`,
          claimTextUsed: v,
        };
      if (/重复|已使用过|不能和之前/.test(e) && e !== p)
        return {
          status: `failed`,
          message: `站点提示领取理由与历史重复，已记录该理由避免重用`,
          claimTextUsed: v,
        };
    }
    return {
      status: `failed`,
      message: b ? `站点确认领取失败：${b}` : `提交领取后未检测到明确结果，请手动确认`,
    };
  }

  function Cp(e, t) {
    return Number.isFinite(e) ? Math.min(__contentScope.xp, Math.max(0, Math.round(e))) : t;
  }

  function wp(e) {
    return e.replace(/\/+$/, ``) || `/`;
  }

  function Tp(e) {
    let t = e.checkin?.url;
    if (!t || !(0, __contentScope.W)(e, t)) return null;
    try {
      return new URL(t, location.href);
    } catch {
      return null;
    }
  }

  function Ep(e) {
    if (!e) return !1;
    try {
      let t = new URL(location.href);
      return (
        t.origin === e.origin &&
        (0, __contentScope.wp)(t.pathname) === (0, __contentScope.wp)(e.pathname) &&
        t.search === e.search &&
        (!e.hash || t.hash === e.hash)
      );
    } catch {
      return !1;
    }
  }

  function Dp(e, t, n, r) {
    let i = (0, __contentScope.Tp)(e);
    return t.fallbackToUrl !== !1 && i && !(0, __contentScope.Ep)(i)
      ? (n.push(`${r}，回退到同源签到地址 ${i.pathname}${i.search}${i.hash}`),
        { status: `navigate`, url: i.href })
      : { status: `failed`, message: r };
  }

  async function Op(e, t, n, r, i) {
    if (!t.selector?.trim())
      return {
        status: `failed`,
        message: `签到入口第 ${n + 1} 步缺少 selector`,
      };
    let a = (0, __contentScope.Cp)(t.timeoutMs, __contentScope.yp);
    if (t.waitFor?.trim() && (0, __contentScope.D)(t.waitFor)) return null;
    let o = await (0, __contentScope.k)(t.selector, a);
    if (!o)
      return {
        status: `failed`,
        message: `签到入口第 ${n + 1} 步未找到控件: ${t.selector}`,
        ...(n === 0 ? { fallbackEligible: !0 } : {}),
      };
    if (i.beforeAction && !(await i.beforeAction()))
      return {
        status: `failed`,
        message: `签到入口第 ${n + 1} 步前的人机验证未完成`,
      };
    let s = i.beforeAction ? await (0, __contentScope.k)(t.selector, a) : o;
    if (!s)
      return {
        status: `failed`,
        message: `完成人机验证后未找到签到入口控件: ${t.selector}`,
      };
    if (await (0, __contentScope.B)(s, e, r, `签到入口控件`))
      return {
        status: `failed`,
        message: `签到入口第 ${n + 1} 步仍被公告或遮罩挡住`,
      };
    try {
      await (0, __contentScope.M)(s, { mayNavigate: t.mayNavigate === !0 });
    } catch (e) {
      return {
        status: `failed`,
        message: `签到入口第 ${n + 1} 步点击失败: ${e instanceof Error ? e.message : String(e)}`,
      };
    }
    return (
      r.push(`已完成签到入口第 ${n + 1} 步`),
      t.waitFor?.trim() && !(await (0, __contentScope.k)(t.waitFor, a))
        ? t.mayNavigate
          ? (r.push(`签到入口第 ${n + 1} 步可能已触发整页导航，等待新页面继续`), null)
          : {
              status: `failed`,
              message: `签到入口第 ${n + 1} 步后未出现预期控件: ${t.waitFor}`,
            }
        : null
    );
  }

  async function kp(e, t, n = {}) {
    let r = e.checkin?.entry;
    if (!r) return { status: `ready` };
    if (!r.readySelector?.trim())
      return { status: `failed`, message: `签到入口缺少页面就绪选择器` };
    if (!Array.isArray(r.steps) || r.steps.length === 0)
      return { status: `failed`, message: `签到入口没有配置任何站内步骤` };
    if (r.steps.length > __contentScope.Sp)
      return {
        status: `failed`,
        message: `签到入口最多支持 ${__contentScope.Sp} 个步骤`,
      };
    if ((0, __contentScope.D)(r.readySelector)) return { status: `ready` };
    if ((0, __contentScope.Ep)((0, __contentScope.Tp)(e)))
      return (await (0, __contentScope.k)(
        r.readySelector,
        (0, __contentScope.Cp)(r.readyTimeoutMs, __contentScope.bp),
      ))
        ? { status: `ready` }
        : {
            status: `failed`,
            message: `已进入签到页，但页面未完成渲染: ${r.readySelector}`,
          };
    t.push(`当前页需要通过站内用户菜单进入签到资料页`);
    for (let [i, a] of r.steps.entries()) {
      if ((0, __contentScope.D)(r.readySelector)) return { status: `ready` };
      let o = await (0, __contentScope.Op)(e, a, i, t, n);
      if (o) return o.fallbackEligible ? (0, __contentScope.Dp)(e, r, t, o.message) : o;
    }
    return (await (0, __contentScope.k)(
      r.readySelector,
      (0, __contentScope.Cp)(r.readyTimeoutMs, __contentScope.bp),
    ))
      ? (t.push(`签到资料页已就绪，开始核对账号`), { status: `ready` })
      : {
          status: `failed`,
          message: `站内入口已执行，但签到资料页未就绪: ${r.readySelector}`,
        };
  }

  function qp(e) {
    return !__contentScope.Kp.some((t) => t.test(e));
  }

  function Jp(e, t = []) {
    let n = [e, ...t.filter(__contentScope.qp)].join(`
`);
    for (let { code: e, patterns: t } of __contentScope.Gp) if (t.some((e) => e.test(n))) return e;
    return __contentScope.Q.UNKNOWN;
  }

  function Xp(e, t) {
    let n = __contentScope.Yp[e],
      r = n?.length ?? 0;
    if (!n || t >= r)
      return {
        retry: !1,
        delayMs: 0,
        attempt: t,
        maxAttempts: r,
        reason: n ? `已达重试上限` : `这类失败重试也不会变好，需要人工处理`,
      };
    let i = n[t];
    return {
      retry: !0,
      delayMs: i,
      attempt: t + 1,
      maxAttempts: r,
      reason: `${Math.round(i / 1e3)} 秒后重试（第 ${t + 1}/${r} 次）`,
    };
  }

  function Zp(e) {
    return e === `oauth` || e === `github` || e === `passkey` || e === `manual`;
  }

  function Qp(e) {
    if (e.identityConfirmedThisRun && e.verdict !== `mismatch`)
      return { action: `proceed`, reason: `already-confirmed-this-run` };
    let t = (0, __contentScope.Zp)(e.loginMethod);
    return e.verdict === `confirmed`
      ? { action: `proceed`, reason: `confirmed` }
      : e.verdict === `mismatch`
        ? !t || e.canSwitchAccount
          ? { action: `switch-account`, reason: `mismatch` }
          : { action: `handoff`, reason: `mismatch-external` }
        : e.checkinPageAvailable
          ? {
              action: `defer-to-checkin-page`,
              reason: `identity-visible-on-checkin-page`,
            }
          : e.loginMethod === `manual`
            ? { action: `handoff`, reason: `unknown-manual-identity` }
            : e.canSwitchAccount
              ? { action: `switch-account`, reason: `unknown` }
              : t
                ? { action: `handoff`, reason: `unknown-multi-account` }
                : { action: `switch-account`, reason: `unknown` };
  }

  function nm(e) {
    return typeof e != `number` || !Number.isFinite(e) ? !1 : e - Date.now() <= __contentScope.em;
  }

  function rm(e) {
    return typeof e != `number` || !Number.isFinite(e) ? !1 : e <= Date.now();
  }

  function im(e) {
    return typeof e == `object` && !!e && !Array.isArray(e);
  }

  async function am(e, t, n) {
    if ((0, __contentScope.$r)(e).family !== __contentScope.s.SUB2API)
      return { status: `unsupported` };
    if (!(0, __contentScope.nm)(t.tokenExpiresAt)) return { status: `still-valid` };
    if (!t.refreshToken)
      return (0, __contentScope.rm)(t.tokenExpiresAt)
        ? {
            status: `expired`,
            reason: `登录态已过期且没有 refresh token，需要重新抓取`,
          }
        : { status: `still-valid` };
    let r = new URL(__contentScope.tm, location.origin).href;
    if (!(0, __contentScope.W)(e, r))
      return { status: `expired`, reason: `换 token 的地址不在本站，已拒绝` };
    n.push(`访问令牌即将到期，正在用 refresh token 换新`);
    let i = null;
    try {
      i = await (
        await fetch(r, {
          method: `POST`,
          headers: {
            'Content-Type': `application/json`,
            ...(t.accessToken ? { Authorization: `Bearer ${t.accessToken}` } : {}),
          },
          body: JSON.stringify({ refresh_token: t.refreshToken }),
        })
      )
        .json()
        .catch(() => null);
    } catch {
      return (0, __contentScope.rm)(t.tokenExpiresAt)
        ? { status: `expired`, reason: `换 token 的请求失败，且当前令牌已过期` }
        : { status: `still-valid` };
    }
    let a = (0, __contentScope.om)(i);
    return a
      ? (localStorage.setItem(__contentScope.$p.accessToken, a.accessToken),
        localStorage.setItem(__contentScope.$p.refreshToken, a.refreshToken),
        localStorage.setItem(__contentScope.$p.expiresAt, String(a.tokenExpiresAt)),
        n.push(`已换到新的访问令牌`),
        { status: `refreshed`, tokens: a })
      : (0, __contentScope.rm)(t.tokenExpiresAt)
        ? {
            status: `expired`,
            reason: `站点拒绝了换 token 请求，需要重新抓取登录态`,
          }
        : { status: `still-valid` };
  }

  function om(e) {
    if (!(0, __contentScope.im)(e) || e.code !== 0 || !(0, __contentScope.im)(e.data)) return null;
    let { access_token: t, refresh_token: n, expires_in: r } = e.data;
    return typeof t != `string` ||
      !t.trim() ||
      typeof n != `string` ||
      !n.trim() ||
      typeof r != `number` ||
      r <= 0
      ? null
      : {
          accessToken: t.trim(),
          refreshToken: n.trim(),
          tokenExpiresAt: Date.now() + r * 1e3,
        };
  }

  function ah(e) {
    return e.filter((e) => e.startsWith(__contentScope.Xm)).map((e) => e.slice(7).trim());
  }

  function oh(e, t) {
    for (let n = e.length - 1; n >= 0; --n) if (e[n].startsWith(t)) return n;
    return -1;
  }

  function ch(e) {
    return __contentScope.sh.reduce((t, n) => Math.max(t, (0, __contentScope.oh)(e, n)), -1);
  }

  function lh(e) {
    let t = (0, __contentScope.oh)(e, __contentScope.rh);
    return t < 0 ? !1 : t > (0, __contentScope.ch)(e);
  }

  function uh(e) {
    let t = (0, __contentScope.oh)(e, __contentScope.ih);
    return t < 0 ? !1 : t > (0, __contentScope.ch)(e);
  }

  function dh(e) {
    if (e.length < __contentScope.eh) return null;
    let [t, n, r] = e.slice(-3);
    return t === n || t !== r ? null : { first: t, second: n };
  }

  function fh(e) {
    try {
      let t = new URL(e, location.origin);
      return { pathname: t.pathname, hash: t.hash };
    } catch {
      return { pathname: e, hash: `` };
    }
  }

  function ph(e, t) {
    if (e === t) return !0;
    let n = (0, __contentScope.fh)(e),
      r = (0, __contentScope.fh)(t);
    return n.pathname === r.pathname ? (n.hash && r.hash ? n.hash === r.hash : !0) : !1;
  }

  function mh(e) {
    let t = 0;
    return (
      e.forEach((n, r) => {
        if (!n.startsWith(__contentScope.Xm)) return;
        let i = n.slice(7).trim();
        e
          .slice(Math.max(0, r - 2), r)
          .some(
            (e) =>
              (e.startsWith(`工作流接入学习路线: `) && e.endsWith(`进入 ${i}`)) ||
              (e.startsWith(`学习路线未命中: `) && e.endsWith(`尝试进入 ${i}`)),
          ) && (t += 1);
      }),
      t
    );
  }

  function hasVisibleLogoutControl(site, siteEvidence) {
    const visible = (control) => {
        if (
          !(0, __contentScope.O)(control) ||
          control.disabled ||
          control.hasAttribute?.(`disabled`) ||
          control.getAttribute?.(`aria-disabled`) === `true` ||
          (control.hasAttribute?.(`data-disabled`) &&
            control.getAttribute?.(`data-disabled`) !== `false`)
        )
          return !1;
        for (let parent = control; parent; parent = parent.parentElement)
          if (
            parent.hidden ||
            parent.getAttribute?.(`aria-hidden`) === `true` ||
            parent.hasAttribute?.(`inert`)
          )
            return !1;
        return !0;
      },
      controls = [
        ...document.querySelectorAll(`button, a, [role="button"]`),
        ...document.querySelectorAll(
          `[role="menuitem"], [role="treeitem"], [data-slot="sidebar-menu-item"]`,
        ),
      ];
    for (const control of new Set(controls)) {
      if (!visible(control)) continue;
      const referenced = [`aria-labelledby`, `aria-describedby`].flatMap((attribute) =>
          (control.getAttribute?.(attribute) ?? ``)
            .split(/\s+/)
            .filter(Boolean)
            .map((id) => document.getElementById?.(id)?.textContent),
        ),
        labels = [
          control.innerText,
          control.textContent,
          control.getAttribute?.(`aria-label`),
          control.getAttribute?.(`title`),
          control.getAttribute?.(`data-tooltip`),
          control.getAttribute?.(`data-tip`),
          ...referenced,
        ];
      const normalizedLabels = labels
          .filter((label) => typeof label === `string`)
          .map((label) => label.replace(/\s+/g, ` `).trim()),
        menu = control.closest?.(`[role="menu"], [role="tree"], [role="treegrid"]`),
        accountMenu =
          menu &&
          [...menu.querySelectorAll(`a[href], [role="menuitem"], [role="treeitem"]`)].some((item) =>
            /个人(?:资料|设置|中心)|(?:账号|账户)(?:资料|设置)|(?:my\s+)?profile|account\s+(?:settings|profile)|personal\s+(?:settings|information)/i.test(
              (0, __contentScope.Rn)(item),
            ),
          );
      if (
        normalizedLabels.some((label) =>
          /^(?:退出\s*(?:当前\s*)?(?:登录|账号|账户)|注销\s*登录|登出|log[\s-]?out|sign[\s-]?out)[.!。！]?$/i.test(
            label,
          ),
        ) ||
        (accountMenu &&
          normalizedLabels.some((label) => /^(?:退出|注销|exit)[.!。！]?$/i.test(label)))
      )
        return !0;
    }
    return (
      (
        siteEvidence ??
        readSiteLoginEvidence(site ?? { loginUrl: location.origin }, document, location, visible)
      ).logoutControl === !0
    );
  }

  function detectPageLogin(site, account = {}, enumerate = !1) {
    function registrationStep(input) {
      const region = input?.form ?? input?.closest?.(`form, [role="dialog"], main, section`),
        heading = region?.querySelector?.(`h1, h2, h3, [role="heading"]`),
        title = heading?.innerText || heading?.textContent || ``;
      return (
        /注册|创建(?:新)?账号|sign\s*up|create\s+(?:an?\s+)?account/i.test(title) ||
        /^(?:注册|创建(?:新)?账号|sign\s*up|create\s+(?:an?\s+)?account)/i.test(
          input ? (0, __contentScope.Sn)(input) : ``,
        )
      );
    }
    const selectors = site.selectors ?? {},
      password = (0, __contentScope.V)(selectors.password ?? ``, document),
      username = password
        ? (0, __contentScope.Tn)(
            selectors.username ?? ``,
            password.element.form ?? document,
            password.element,
          )
        : null,
      form =
        !!password && !!username && (0, __contentScope.kn)() && !registrationStep(password.element),
      discovered = (0, __contentScope.collectLoginEntries)(),
      manual = discovered.find((entry) => entry.method === `manual`),
      entry = [
        ...document.querySelectorAll(`button, [role="button"], a[href], input[type="button"]`),
      ].find(
        (control) =>
          (0, __contentScope.O)(control) &&
          !isLoginHelpControl(control) &&
          !registrationStep(control) &&
          /密码登录|账号密码|账密登录|(?:sign|log)\s*in\s*(?:with|using)?\s*(?:email|password)|(?:use|continue\s*with)\s*password|^password(?:\s*login)?$/i.test(
            control.innerText ||
              control.textContent ||
              control.getAttribute(`aria-label`) ||
              control.value ||
              ``,
          ) &&
          !/忘记|重置|找回|修改|forgot|reset|recover|change|sign\s*up|register/i.test(
            control.innerText ||
              control.textContent ||
              control.getAttribute(`aria-label`) ||
              control.value ||
              ``,
          ),
      ),
      passwordEntry = !!entry,
      usernameStep =
        !manual &&
        /\/(?:login|sign-?in)(?:\/|$)/i.test(location.pathname) &&
        (0, __contentScope.kn)() &&
        !registrationStep((0, __contentScope.Tn)(selectors.username ?? ``, document)?.element) &&
        (0, __contentScope.On)({ ...site, selectors }) &&
        [...document.querySelectorAll(`button, [role="button"], input[type="submit"]`)].some(
          (control) =>
            (0, __contentScope.O)(control) &&
            /登录|登入|sign\s*in|log\s*in|下一步|next/i.test(
              control.innerText || control.textContent || control.value || ``,
            ) &&
            !/注册|订阅|sign\s*up|register|subscribe/i.test(
              control.innerText || control.textContent || control.value || ``,
            ),
        ),
      native = form
        ? { method: `form`, evidence: `页面可见站内用户名和密码表单` }
        : passwordEntry
          ? { method: `form`, evidence: `页面可见站内账密登录入口`, entry }
          : usernameStep
            ? { method: `form`, evidence: `登录页可见账号输入步骤` }
            : null;
    const nativeEntry = native
        ? {
            key: `form:site-password`,
            method: `form`,
            provider: `site-password`,
            label: `站内账号密码`,
            ...(entry
              ? {
                  matchText: (0, __contentScope.Rn)(entry)
                    .replace(/\s+/g, ` `)
                    .trim()
                    .slice(0, 120),
                }
              : {}),
          }
        : null,
      options = [
        ...(nativeEntry ? [{ ...nativeEntry, evidence: native.evidence }] : []),
        ...discovered.map((entry) => ({
          ...entry,
          evidence: `页面可见「${entry.label}」登录入口`,
        })),
      ];
    if (enumerate) return options;
    if (account.loginEntry) {
      const selected = options.find((option) => option.key === account.loginEntry.key);
      if (!selected) return null;
      return {
        ...selected,
        loginEntry: selected,
        ...(selected.method === `form` && native?.entry ? { entry: native.entry } : {}),
      };
    }
    const github = options.find((option) => option.method === `github`),
      choose = (option) => (option ? { ...option, loginEntry: option } : null);
    if (native && (account.password || !github)) return { ...native, loginEntry: nativeEntry };
    if (github && account.githubUsername && account.githubPassword) return choose(github);
    if (native) return { ...native, loginEntry: nativeEntry };
    if (options.length === 1) return choose(options[0]);
    // Existing automatic accounts must not silently choose among different providers.
    return null;
  }

  function readLoginOptions(site) {
    const result = {
      siteId: site?.id,
      status: `unknown`,
      methods: [],
      entries: [],
      evidence: [],
      pageUrl: `${location.origin}${location.pathname}`,
      checkedAt: Date.now(),
    };
    try {
      if (new URL(site.loginUrl).origin !== location.origin)
        return { ...result, status: `unavailable`, evidence: [`当前页面已离开本站登录地址`] };
      const options = (0, __contentScope.detectPageLogin)(site, {}, !0);
      if (options.length)
        return {
          ...result,
          status: options.length === 1 ? `detected` : `multiple`,
          methods: [...new Set(options.map((option) => option.method))],
          entries: options.map(({ evidence, ...entry }) => entry),
          evidence: options.map((option) => option.evidence),
        };
      const loginState = classifyLoginState((0, __contentScope.readLoginSnapshot)(site));
      if (loginState.status === `authenticated`)
        return {
          ...result,
          status: `already-logged-in`,
          evidence: [`当前浏览器已登录，页面没有展示登录入口；请选择你使用的账号类型`],
        };
      return {
        ...result,
        evidence: [
          loginState.status === `blocked` || loginState.status === `failed`
            ? loginState.detail
            : `当前页面尚未展示可识别的登录入口；可重新检测或手动选择账号类型`,
        ],
      };
    } catch {
      return {
        ...result,
        status: `unavailable`,
        evidence: [`登录页面尚未就绪，暂时无法读取登录方式`],
      };
    }
  }

  async function hh(e, t) {
    e = { ...e, site: { ...e.site, selectors: { ...e.site.selectors } } };
    if (e.loginEntry?.method === e.effectiveLoginMethod)
      e.site = { ...e.site, loginEntry: e.loginEntry, oauthButtonSelector: `` };
    let n = [...(e.steps ?? [])],
      r =
        e.effectiveLoginMethod ??
        (e.formCredentialsSubmitted ? `form` : e.githubCredentialsSubmitted ? `github` : `auto`),
      i = r === `oauth` || r === `github` || r === `passkey`,
      a = r === `github` ? e.githubUsername?.trim() : void 0,
      o = r === `github` && !!e.githubUsername && !!e.githubPassword && !!t.startGithubLogout,
      s = {
        knownUsers: e.siteAccountUserIds ?? {},
        knownIdentities: e.siteAccountIdentities ?? [],
      },
      l = e.accountIdentityUserId,
      u = l ? s.knownUsers[l] : void 0,
      d = u ? void 0 : l,
      f = d,
      formLoginSubmitted = e.formCredentialsSubmitted === !0,
      manualWaitingStage = [`verify-manual`, `relogin-verify-manual`].includes(e.stage)
        ? e.stage
        : null,
      m = e.accountIdentityUsername,
      h = e.accountIdentityEmail,
      g = () => f ?? d,
      _ = e.workflowRouteIndex,
      v = () =>
        (!e.site.adapter && !f) || e.site.adapter?.userId === f
          ? e.site
          : { ...e.site, adapter: { ...e.site.adapter, userId: f } },
      y = () => {
        let t = v(),
          n = e.effectiveCheckinMethod
            ? {
                ...t,
                checkin: { ...t.checkin, method: e.effectiveCheckinMethod },
              }
            : t;
        if (n.checkin?.method === `none`) {
          let e = { ...n.checkin };
          return (
            delete e.entry,
            delete e.url,
            e.workflow?.steps?.length && (e.workflow = { ...e.workflow, steps: [] }),
            { ...n, checkin: e }
          );
        }
        if (
          !(0, __contentScope.p)(n) ||
          !n.checkin ||
          (n.checkin.method === `workflow` && !n.checkin.workflow?.route?.length)
        )
          return n;
        let r = { ...n.checkin };
        return (delete r.entry, r.workflow?.route?.length && delete r.url, { ...n, checkin: r });
      },
      b = () => {
        let e = y(),
          t = (() => {
            try {
              return new URL(location.href).pathname || `/`;
            } catch {
              return `/`;
            }
          })(),
          n = {
            ...e,
            adapter: {
              ...e.adapter,
              checkinPath: ``,
              checkin: {
                pathPatterns: [t],
                titleWords: [...(e.adapter?.checkin?.titleWords ?? [])],
              },
            },
          };
        if (e.checkin) {
          let t = { ...e.checkin };
          if ((delete t.url, t.workflow?.route)) {
            let { route: e, ...n } = t.workflow;
            t.workflow = n;
          }
          n.checkin = t;
        }
        return n;
      },
      x = new Set([`未发现公告弹窗`]),
      S = {
        push: (e) => {
          if (e.startsWith(`身份接口 `)) {
            if (x.has(e)) return;
            x.add(e);
          }
          (x.has(e) && n[n.length - 1] === e) ||
            (n.push(e), console.log(`[签到助手]`, e), t.reportProgress?.([...n]));
        },
      };
    async function resolvePageMethod(waitMs = 0) {
      const deadline = Date.now() + waitMs;
      do {
        const choice = (0, __contentScope.detectPageLogin)(e.site, e);
        if (choice) {
          if (!t.resolveLoginMethod)
            throw Error(`当前运行环境无法保存页面识别的登录方式，请重新加载扩展后重试`);
          const method = await t.resolveLoginMethod(choice.method, choice.loginEntry);
          if (method !== choice.method) throw Error(`后台未确认页面识别的登录方式，已停止提交凭据`);
          r = method;
          e.effectiveLoginMethod = method;
          e.loginEntry = choice.loginEntry;
          if ([`github`, `oauth`, `passkey`, `manual`].includes(method))
            e.site = { ...e.site, loginEntry: choice.loginEntry, oauthButtonSelector: `` };
          i = r === `oauth` || r === `github` || r === `passkey`;
          a = r === `github` ? e.githubUsername?.trim() : void 0;
          o = r === `github` && !!e.githubUsername && !!e.githubPassword && !!t.startGithubLogout;
          formLoginSubmitted = !1;
          S.push(`根据当前页面识别登录方式：${method}（${choice.evidence}）`);
          if (method === `form` && choice.entry) {
            if (!(await E(`login`, __contentScope.$)))
              throw Error(`账密登录入口前的安全验证尚未完成`);
            await (0, __contentScope.dr)(choice.entry, e.site, S, `账密登录入口`);
          }
          return !0;
        }
        if (Date.now() >= deadline) return !1;
        await (0, __contentScope.w)(100);
      } while (Date.now() <= deadline);
      return !1;
    }
    u &&
      !n.some((e) => e.startsWith(`身份绑定冲突:`)) &&
      S.push(
        `身份绑定冲突: 站点用户 ID ${l} 同时绑定给当前账号和 ${u}；本轮已忽略这个旧绑定，必须重新核对页面身份后才能签到`,
      );
    let C = (t, r) => ({
      accountId: e.accountId,
      ok: !1,
      message: t,
      steps: n,
      ...(r ? { metrics: r } : {}),
    });
    async function ee(r, i) {
      let a = (0, __contentScope.Jp)(r, n),
        o = n.filter((e) => e.startsWith(__contentScope.Um)).length;
      if (n.length > __contentScope.Ym) {
        let e = o > 0 ? `（已重试 ${o} 次仍未成功，停止重试）` : `（本轮步骤过多，停止重试）`;
        return C(`${r}${e}`, i);
      }
      let s = (0, __contentScope.Xp)(a, o);
      return s.retry
        ? (S.push(`${__contentScope.Um} ${r} → ${s.reason}`),
          await (0, __contentScope.w)(s.delayMs),
          await t.navigate(e.site.loginUrl, n, `login`),
          null)
        : C(r, i);
    }
    let te = (t, r) => ({
        accountId: e.accountId,
        ok: !0,
        message: t,
        steps: n,
        ...(r ? { metrics: r } : {}),
      }),
      ne = () =>
        [...n].reverse().find((e) => e.startsWith(`找不到`) || e.startsWith(`当前页没有`)) ??
        `未能识别登录表单`,
      re = {
        workflowCheckpoint: Me,
        get workflowRouteIndex() {
          return _;
        },
        saveWorkflowRouteIndex: async (e) => {
          (await t.saveWorkflowRouteIndex?.(e),
            (_ === void 0 || e > _) && ((_ = e), S.push(`${__contentScope.Zm}${e}`)));
        },
        beforeCheckinClick: () => D(`checkin`),
        beforeWorkflowNavigate: () => t.markStage(`checkin`, n),
        afterCheckinClick: async (e) =>
          (await Ce(2500, e?.checkinAction === !1 ? `页面点击` : void 0)).resolved,
        whileWaitingForCheckinResult: () => Ce(),
        saveReloginStage: () => t.markStage(`relogin`, n),
        saveReloginBalanceBefore: async (e) => {
          t.saveReloginBalanceBefore
            ? await t.saveReloginBalanceBefore(e)
            : await t.saveBalance?.(e);
        },
        saveButtonBalanceBefore: async (e) => {
          if (!t.saveButtonBalanceBefore)
            throw Error(`当前运行环境无法持久化按钮签到基线，已停止点击`);
          await t.saveButtonBalanceBefore(e);
        },
        buttonBalanceBefore:
          e.context?.buttonCheckinPending === !0 ? e.context.balanceBefore : void 0,
        saveBalance: async (e) => {
          if (e)
            try {
              await t.saveBalance?.(e);
            } catch (e) {
              S.push(
                `余额快照未能写入账号（${e instanceof Error ? e.message : String(e)}）；本次签到结果不受影响`,
              );
            }
        },
      };
    async function ie(identity, stable = !1) {
      const persist =
        (identity.source === `api` &&
          (r !== `manual` || hasBoundIdentity() || matchesManualAccount(identity)) &&
          !(r === `form` && !formLoginSubmitted && !hasBoundIdentity())) ||
        (identity.verifiedByManagedLogin === !0 &&
          ((r === `form` && formLoginSubmitted) ||
            (r === `github` && e.githubCredentialsSubmitted === !0)));
      if (!persist) return !1;
      if (!hasBoundIdentity() && !stable) {
        await (0, __contentScope.w)(350);
        const next = await se(`首次身份绑定复核`);
        if (
          !stableIdentitySamples(identity, next.identity) ||
          ue(next) ||
          (identity.verifiedByManagedLogin !== !0 && ce(next).match !== `confirmed`)
        )
          throw Error(`首次绑定的身份尚未形成与本账号一致的稳定样本，已保留原账号数据`);
        identity = { ...identity, ...next.identity };
      }
      if (!hasBoundIdentity() && !t.saveIdentity)
        throw Error(`无法保存本账号首次确认的身份，请重新加载扩展后重试`);
      await t.saveIdentity?.(identity);
      if (identity.userId) f = identity.userId;
      if (identity.username) m = identity.username;
      if (identity.email) h = identity.email;
      return persist;
    }
    async function T(e) {
      return (await ie(e)) && e.source === `api`;
    }
    async function ae(loginDescription, tokenIdentity) {
      let observation = tokenIdentity
          ? { identity: tokenIdentity }
          : await se(`第二次登录后的页面`),
        verdict = ce(observation);
      if (!tokenIdentity && (await enterIdentityPage(observation, verdict, `relogin-verify`)))
        return null;
      if (!tokenIdentity) {
        const first = observation.identity;
        await (0, __contentScope.w)(350);
        observation = await se(`第二次登录后的页面`);
        verdict = ce(observation);
        if (!stableIdentitySamples(first, observation.identity))
          verdict = {
            match: `unknown`,
            detail: observation.identity?.identityConflict
              ? `身份证据冲突：${observation.identity.identityConflict}`
              : `第二次登录后的身份尚未形成一致的稳定样本`,
          };
      }
      if (verdict.match !== `confirmed` || observation.identity?.identityConflict) {
        Oe(observation, verdict);
        await t.needsUser(
          `第二次登录身份核验未通过：${verdict.detail}。已停止签到结果确认，保留原账号绑定，请核对当前登录账号后重试。`,
          n,
        );
        return null;
      }
      await t.confirmIdentity?.();
      let r = null;
      for (let e = 0; e < 3; e += 1) {
        e > 0 && (await (0, __contentScope.w)(1e3));
        let t = await (0, __contentScope.za)(v());
        if (t) {
          r = t;
          break;
        }
      }
      r ? await t.saveBalance?.(r) : S.push(`第二次登录成功，但未能读取登录后的余额`);
      let i = e.context?.balanceBefore;
      if (!i || !r) return te(`${loginDescription}成功；余额差额暂无法核对`);
      let a = { ...(0, __contentScope.Wa)(i, r), source: `balance-diff` },
        o = (0, __contentScope.Ga)(a, v().adapter?.quotaPerUnit, v().adapter?.family);
      return (
        o && S.push(`重登前后差额：${o}`),
        a.verdict === `rewarded`
          ? te(`${loginDescription}成功，余额差额确认签到奖励已到账`, a)
          : a.verdict === `already-used`
            ? te(`${loginDescription}成功，今日总额度未增加（期间有消耗，可能已领取）`, a)
            : te(`${loginDescription}成功，余额未增加（今日可能已领取）`, a)
      );
    }
    function oe(t) {
      let n = (0, __contentScope.Gi)(e.username);
      return n && !n.masked
        ? (S.push(
            `${t}读不到身份接口，但页面上印着本账号 ${n.matched}${n.masked ? `（打码显示）` : ``}，按用户名核对`,
          ),
          { username: e.username, source: `visible` })
        : null;
    }
    async function se(t) {
      let n = await (0, __contentScope.qi)(v(), void 0, { diagnostics: S }),
        r = (0, __contentScope.Gi)(e.username);
      return n
        ? r && n.source === `visible`
          ? (S.push(`${t}同时显示站点账号 ${r.matched}，作为当前账号的页面旁证`),
            { identity: n, pageAccountMatch: r.matched })
          : { identity: n }
        : { identity: oe(t) };
    }
    function ce(t) {
      let n = m || h ? { ...(m ? { username: m } : {}), ...(h ? { email: h } : {}) } : void 0;
      return (0, __contentScope.Zi)(t.identity, e.username, g(), {
        ...s,
        ...(t.pageAccountMatch ? { pageAccountMatch: t.pageAccountMatch } : {}),
        ...(a ? { expectedAliases: [a] } : {}),
        ...(n ? { expectedIdentity: n } : {}),
      });
    }
    function hasBoundIdentity() {
      return !!g() || !!m || !!h;
    }
    function canProbeLoginIdentityPage() {
      // Leaving the login route permits a read-only identity probe, but is
      // still insufficient to declare OAuth successful.
      return ![`oauth`, `github`, `passkey`].includes(r) || (0, __contentScope.rr)(e.site);
    }
    async function enterIdentityPage(
      observation,
      verdict,
      stage = `checkin`,
      navigationOptions = {},
    ) {
      const loginVerification = navigationOptions.loginVerification === !0,
        workflow = (0, __contentScope.rf)(y());
      if (
        r === `token` ||
        r === `manual` ||
        (workflow && !loginVerification) ||
        observation.identity?.identityConflict ||
        observation.identity?.userId ||
        verdict.match !== `unknown`
      )
        return !1;
      const identityPath = loginVerification && workflow ? (0, __contentScope.sf)(y()) : null,
        identitySite = identityPath
          ? {
              ...y(),
              identitySource: { ...readIdentitySource(y()), pagePath: identityPath },
            }
          : y(),
        url = resolveIdentityPage(identitySite, document, location);
      if (!url) return !1;
      const target = new URL(url);
      const path = `${target.pathname}${target.hash}`;
      if (path === `${location.pathname}${location.hash}`) return !1;
      const phase = stage.startsWith(`relogin`) ? `第二次登录` : `本轮登录`;
      const message = `身份读取进入资料页: ${path}（${phase}）`;
      let loginStart = 0;
      for (let index = 0; index < n.length; index++)
        if (
          n[index].startsWith(__contentScope.Wm) ||
          n[index].startsWith(`开始第二次登录以完成签到`)
        )
          loginStart = index;
      if (n.slice(loginStart).includes(message)) {
        S.push(
          `身份核验页未能到达：已尝试 ${path}，站点仍返回 ${location.pathname}${location.hash}；停止重复跳转`,
        );
        return !1;
      }
      S.push(
        `当前页身份字段不足：${verdict.detail}；使用本站资料页读取当前账号，目标用户 ID ${g() ?? `尚未绑定`}`,
      );
      S.push(message);
      await t.navigate(url, n, stage);
      return !0;
    }
    function le(e, t) {
      if (![`api`, `visible`].includes(e.identity?.source)) return !1;
      let n = e.identity.userId;
      return n && g()
        ? n !== g()
        : n && s.knownUsers[n]
          ? !0
          : t.match === `mismatch` &&
            (!i ||
              (!g() &&
                hasBoundIdentity() &&
                (e.identity.source === `api` ||
                  [`structured-fields`, `profile-card`].includes(e.identity.evidence))));
    }
    function ue(e) {
      let t = e.identity?.userId;
      return t
        ? [`api`, `visible`].includes(e.identity?.source) && g() && t !== g()
          ? !0
          : !!s.knownUsers[t]
        : !1;
    }
    function matchesManualAccount(identity) {
      const target = String(e.username ?? ``)
        .trim()
        .toLowerCase();
      return (
        !!target &&
        [identity?.username, identity?.email].some(
          (value) => typeof value === `string` && value.trim().toLowerCase() === target,
        )
      );
    }
    async function confirmManualIdentity() {
      const first = await se(`页面登录身份`),
        verdict = de(first, ce(first));
      if (first.identity?.identityConflict || ue(first) || verdict.match === `mismatch`)
        return { confirmed: !1, conflict: !0, detail: verdict.detail };
      if (
        first.identity?.source !== `api` ||
        (!first.identity.userId && !first.identity.username && !first.identity.email) ||
        (hasBoundIdentity() ? verdict.match !== `confirmed` : !matchesManualAccount(first.identity))
      )
        return { confirmed: !1, detail: `尚未读到与账号 ${e.username} 一致的实时身份` };
      await (0, __contentScope.w)(350);
      const next = await se(`页面登录身份复核`),
        nextVerdict = de(next, ce(next));
      if (next.identity?.identityConflict || ue(next) || nextVerdict.match === `mismatch`)
        return { confirmed: !1, conflict: !0, detail: nextVerdict.detail };
      if (
        next.identity?.source !== `api` ||
        !stableIdentitySamples(first.identity, next.identity) ||
        (hasBoundIdentity()
          ? nextVerdict.match !== `confirmed`
          : !matchesManualAccount(next.identity))
      )
        return { confirmed: !1, detail: `页面登录身份尚未形成连续稳定样本` };
      if (!t.saveIdentity) throw Error(`当前运行环境无法保存页面登录身份，请重新加载扩展`);
      await ie(next.identity, !0);
      await t.confirmIdentity?.();
      S.push(
        `已连续核对页面登录身份，本站${g() ? `用户 ID ${g()}` : `登录标识 ${m ?? h}`} 与账号 ${e.username} 一致`,
      );
      return { confirmed: !0 };
    }
    async function waitManualLogin(stage, announce = !0) {
      if (!t.waitForManualLogin)
        throw Error(`当前运行环境无法保留页面登录任务，请重新加载扩展后重试`);
      const waitingUntil = announce
          ? await t.waitForManualLogin(
              `请在当前站点页面完成「${e.loginEntry?.label ?? `验证码 / 页面登录`}」，登录账号应为 ${e.username}；完成后会核验身份并继续签到。`,
              n,
            )
          : void 0,
        deadline =
          typeof waitingUntil === `number`
            ? Math.min(waitingUntil, Date.now() + __contentScope.$)
            : Date.now() + __contentScope.$;
      do {
        if (location.origin !== (0, __contentScope.Dr)(e.site))
          return { confirmed: !1, detail: `请在登录页面完成验证并返回本站` };
        if (!(0, __contentScope.On)(e.site) && !(0, __contentScope.nr)()) {
          const verification = await confirmManualIdentity();
          if (verification.confirmed || verification.conflict) {
            if (verification.conflict)
              await t.needsUser(
                `当前登录身份与账号 ${e.username} 不一致（${verification.detail}），请切换到目标账号后重试。`,
                n,
              );
            else
              await t.markStage(
                stage === `relogin-verify-manual` ? `relogin-verify` : `checkin`,
                n,
              );
            return verification;
          }
        }
        await (0, __contentScope.w)(1000);
      } while (Date.now() < deadline);
      return { confirmed: !1, detail: `等待页面登录超时，请完成验证后重新签到` };
    }
    async function beginManualLogin(relogin = !1) {
      if (!t.waitForManualLogin)
        throw Error(`当前运行环境无法保留页面登录任务，请重新加载扩展后重试`);
      const stage = relogin ? `relogin-verify-manual` : `verify-manual`,
        selected = e.loginEntry,
        control = selected
          ? (0, __contentScope.findSelectedLoginControl)(selected, `manual`)
          : null;
      await t.markStage(stage, n);
      manualWaitingStage = stage;
      if (
        control &&
        !(0, __contentScope.H)(control) &&
        !(control.form && control.type === `submit`) &&
        !(control instanceof HTMLInputElement && control.type === `submit`) &&
        control.getAttribute(`type`) !== `submit`
      ) {
        if (!(await E(stage, __contentScope.$))) return C(`页面登录入口前的安全验证尚未完成`);
        const current = (0, __contentScope.findSelectedLoginControl)(selected, `manual`);
        if (current) {
          const blocker = await (0, __contentScope.B)(current, e.site, S, `页面登录入口`);
          if (blocker) return C(`页面登录入口被遮挡，请完成当前页面提示后重试`);
          S.push(`已进入账号选定的「${selected.label}」登录入口`);
          await (0, __contentScope.M)(current, { mayNavigate: !0 });
        }
      }
      const verification = await waitManualLogin(stage);
      return verification.confirmed
        ? relogin
          ? ae(`退出后页面登录`)
          : M(!0)
        : verification.conflict
          ? null
          : C(verification.detail);
    }
    function de(t, n) {
      if (!ue(t)) return n;
      let r = t.identity.userId,
        i = s.knownUsers[r],
        a =
          t.identity?.source === `api`
            ? `站点接口`
            : t.identity?.source === `storage`
              ? `本地登录态`
              : `页面文本`;
      return {
        match: `mismatch`,
        detail: g()
          ? `当前登录的是用户 ID ${r}${i ? `（本站账号 ${i}）` : ``}（读自${a}），本次要签到的是 ${g()}`
          : `当前登录的是用户 ID ${r}（本站账号 ${i}，读自${a}），不是本次账号 ${e.username}`,
      };
    }
    function fe(t, n) {
      if (ue(t)) return !0;
      if (n.match !== `mismatch`) return !1;
      if (le(t, n)) return !0;
      let r = t.identity;
      return r ? (e.username.includes(`@`) && r.email ? !0 : !i) : !1;
    }
    function pe(t) {
      return (
        r === `github` &&
        o &&
        e.githubCredentialsSubmitted === !0 &&
        (t.identity?.userId ||
          ((t.identity?.username || t.identity?.email) &&
            (t.identity.source === `api` ||
              [`structured-fields`, `profile-card`].includes(t.identity.evidence)))) &&
        !ue(t) &&
        (!hasBoundIdentity() || ce(t).match === `confirmed`)
      );
    }
    function canEstablishFormIdentity(observation) {
      const identity = observation.identity;
      return (
        r === `form` &&
        formLoginSubmitted &&
        !hasBoundIdentity() &&
        !identity?.identityConflict &&
        (identity?.userId ||
          ((identity?.source === `api` ||
            [`structured-fields`, `profile-card`].includes(identity?.evidence)) &&
            matchesManualAccount(identity))) &&
        (identity.source === `api` || identity.source === `visible`) &&
        !ue(observation)
      );
    }
    async function beforeFormSubmit(stage) {
      if (!(await D(stage))) return !1;
      if (t.recordFormCredentialsSubmitted) {
        await t.recordFormCredentialsSubmitted();
        formLoginSubmitted = !0;
      } else if (!g() && (0, __contentScope.rf)(y())) {
        throw Error(`当前运行环境无法确认本账号的登录提交，请重新加载扩展后重试`);
      }
      return !0;
    }
    async function me(t, n) {
      if (pe(t)) {
        if (!hasBoundIdentity()) {
          const first = t.identity;
          await (0, __contentScope.w)(350);
          const next = await se(`${n}首次身份复核`);
          if (!pe(next) || !stableIdentitySamples(first, next.identity)) return `unresolved`;
          t = next;
        }
        let r = t.identity;
        return (
          await ie({ ...r, verifiedByManagedLogin: !0 }, !0),
          S.push(
            `本轮已用账号 ${e.username} 保存的 GitHub 凭据登录，${n}显示的 ${r.username ?? r.email ?? r.userId} 已连续核对；` +
              `已保存本站${r.userId ? `用户 ID ${r.userId}` : `登录标识 ${r.username ?? r.email}`}，以后直接核对本账号绑定`,
          ),
          `confirmed`
        );
      }
      return r === `github` &&
        o &&
        e.githubCredentialsSubmitted !== !0 &&
        (S.push(
          `${n}只显示第三方身份，且本轮沿用的是浏览器里已有的 GitHub 会话，改为用本账号保存的 GitHub 凭据重新登录`,
        ),
        (await A()) === `started`)
        ? `switching`
        : `unresolved`;
    }
    function he(t) {
      let n = t.identity,
        r = n?.username ?? n?.displayName ?? n?.email;
      return {
        match: `unknown`,
        detail: r
          ? `资料页目前只显示第三方身份 ${r}，尚未显示站点账号 ${e.username}`
          : `资料页尚未显示站点账号 ${e.username}`,
      };
    }
    function ge() {
      let e = y(),
        t = e.checkin;
      if (!t?.url || !(0, __contentScope.W)(e, t.url)) return null;
      try {
        let n = new URL(t.url, location.href);
        return (0, __contentScope.kf)(e, t, location.href) ? null : n.href;
      } catch {
        return null;
      }
    }
    let _e = (e) => {
        try {
          let t = new URL(e);
          return `${t.pathname}${t.search}`;
        } catch {
          return e;
        }
      },
      ve = (e) => {
        try {
          let t = new URL(e, location.href);
          return `${t.pathname}${t.search}${t.hash}`;
        } catch {
          return e;
        }
      };
    async function ye(e, r = 12e4, i = !0, a = 0, stopWhenReady) {
      let o = await (0, __contentScope.zu)(S, waitingLoginChallenge, r, {
        includePendingResponse: i,
        appearanceWaitMs: a,
        stopWhenReady,
      });
      return o.resolved
        ? (o.detected && (await t.markStage(e, n)), o)
        : (S.push(`${o.kind ?? `安全验证`}未在等待时间内完成`), o);
    }
    async function waitingLoginChallenge(message) {
      if (r === `manual` && manualWaitingStage) {
        if (!t.waitForManualLogin)
          throw Error(`当前运行环境无法保留页面登录任务，请重新加载扩展后重试`);
        await t.waitForManualLogin(message, n);
      } else await t.needsUser(message, n);
    }
    async function be(e, t = 12e4, n = !0, r = 0, stopWhenReady) {
      return (await ye(e, t, n, r, stopWhenReady)).resolved;
    }
    function E(e, t = 12e4) {
      return be(e, t, !1);
    }
    const loginVerificationNavigation = {};
    let checkinResultBeforeClick, lastLoginState;
    let identityConfirmedThisRun = e.identityConfirmed === !0;
    const savedConfirmIdentity = t.confirmIdentity;
    t = {
      ...t,
      confirmIdentity: async () => {
        identityConfirmedThisRun = !0;
        await savedConfirmIdentity?.();
      },
    };
    async function readCurrentLoginState(timeoutMs = 6e3) {
      const state = await (0, __contentScope.readLoginState)(v(), {
        timeoutMs,
        stopOnLoginForm: !0,
        diagnostics: S,
      });
      lastLoginState = state;
      S.push(loginStateLog(state));
      return state;
    }
    function canStartLogin(state) {
      return (
        state.status === `pending` &&
        [`login_form_visible`, `login_entry_visible`].includes(state.reason)
      );
    }
    function shouldProbeLoginIdentity(state) {
      return (
        state.status === `pending` &&
        ![`login_form_visible`, `login_entry_visible`, `oauth_pending`].includes(state.reason)
      );
    }
    async function stopForUnconfirmedLogin(state) {
      if (state.identity?.identityConflict) {
        const observation = { identity: state.identity };
        await je(observation, ce(observation));
        return null;
      }
      if (state.status === `failed`) return C(`登录状态核验未通过：${state.detail}`);
      await t.needsUser(
        state.status === `blocked`
          ? `登录步骤尚未完成：${state.detail}。请在本站完成这一项后重新执行。`
          : `当前登录状态尚未确认：${state.detail}。没有看到可操作的登录表单或登录入口，已保留当前会话；请查看账号详情里的身份读取来源，或在本站资料页补充可核对的身份字段后重试。`,
        n,
      );
      return null;
    }
    async function D(e) {
      if (e === `checkin`) {
        const result = (0, __contentScope.Uu)();
        checkinResultBeforeClick = JSON.stringify(result);
      }
      return be(e, __contentScope.$);
    }
    function loginResultReady() {
      return (
        classifyLoginState((0, __contentScope.readLoginSnapshot)(v())).status === `authenticated`
      );
    }
    function xe(e) {
      return be(e, __contentScope.$, !0, 2500, loginResultReady);
    }
    function Se(e) {
      return ye(e, __contentScope.$, !0, 2500, loginResultReady);
    }
    async function Ce(e = 0, r) {
      let i = await (0, __contentScope.Vp)(S, (e) => t.needsUser(e, n), __contentScope.$, e, r, {
        stopWhenReady:
          r === `页面点击`
            ? void 0
            : () => {
                const result = (0, __contentScope.Uu)();
                return (
                  checkinResultBeforeClick !== void 0 &&
                  (result.kind === `success` || result.kind === `already`) &&
                  JSON.stringify(result) !== checkinResultBeforeClick
                );
              },
      });
      return i.resolved
        ? (i.detected &&
            (await t.markStage(`checkin`, n),
            S.push(`本次签到的安全验证处理已结束，继续等待明确的签到结果`)),
          i)
        : (S.push(
            i.error ? `签到验证未完成：${i.error}` : `${i.kind ?? `安全验证`}未在等待时间内完成`,
          ),
          i);
    }
    async function we(stage, onChallenge) {
      let a = await ye(stage);
      if ((onChallenge?.(a), !a.resolved)) {
        lastLoginState = {
          status: `blocked`,
          reason: `challenge_pending`,
          detail: `${a.kind ?? `安全验证`}尚未完成，暂不确认登录成功`,
        };
        S.push(loginStateLog(lastLoginState));
        return !1;
      }
      const o = async () => {
        await (0, __contentScope.U)(e.site, S, { waitForAppear: !0 });
        return (0, __contentScope.xr)(v(), S, {
          onResult: (state) => {
            lastLoginState = state;
          },
        });
      };
      if (await o()) return !0;
      // Some learned sites expose their only current-account evidence on a
      // separate profile page. Visit that read-only page and resume verification
      // there; the navigation itself is never accepted as login success.
      if (
        lastLoginState &&
        shouldProbeLoginIdentity(lastLoginState) &&
        canProbeLoginIdentityPage() &&
        shouldProbeLoginIdentity(classifyLoginState((0, __contentScope.readLoginSnapshot)(v()))) &&
        (await enterIdentityPage(
          { identity: lastLoginState.identity ?? null },
          { match: `unknown`, detail: lastLoginState.detail },
          stage,
          { loginVerification: !0 },
        ))
      )
        throw loginVerificationNavigation;
      let s = (0, __contentScope.nr)();
      if (!s) return !1;
      (S.push(`检测到${s}，等待你在当前标签页完成`),
        await t.needsUser(`${s}需要你在当前标签页完成`, n));
      let c = Date.now() + 3e5;
      for (; Date.now() < c && (0, __contentScope.nr)();) await (0, __contentScope.w)(500);
      return (0, __contentScope.nr)()
        ? (S.push(`${s}等待超时`), !1)
        : (S.push(`${s}已完成，继续验证登录结果`), await t.markStage(stage, n), o());
    }
    function loginFailureMessage(fallback) {
      return lastLoginState && lastLoginState.status !== `authenticated`
        ? `${fallback}：${lastLoginState.detail}`
        : fallback;
    }
    async function O() {
      if ((0, __contentScope.rf)(y()))
        return (S.push(`OAuth 会话已建立，账号身份交由个人资料页统一核验`), !0);
      let i = await se(`OAuth 返回页`),
        a = ce(i);
      if (i.identity?.identityConflict) {
        await je(i, a);
        return !1;
      }
      if (
        await enterIdentityPage(
          i,
          a,
          e.stage.startsWith(`relogin`) ? `relogin-verify` : `verify-oauth`,
        )
      )
        return !1;
      if (r === `github` && !hasBoundIdentity()) {
        const binding = await me(i, `OAuth 返回页`);
        if (binding === `confirmed`) {
          await t.confirmIdentity?.();
          return !0;
        }
        if (binding === `switching`) return !1;
        await reloginTargetAccount(`GitHub 身份尚未稳定（${a.detail}）`, `OAuth 返回页`);
        return !1;
      }
      if (
        r === `github` &&
        e.githubCredentialsSubmitted === !0 &&
        i.identity?.source === `api` &&
        a.match === `confirmed` &&
        !le(i, a) &&
        !ue(i)
      ) {
        await ie(i.identity);
        let n =
          i.identity.username ??
          i.identity.email ??
          i.identity.displayName ??
          i.identity.userId ??
          `已验证身份`;
        return (
          S.push(
            `本轮已使用账号 ${e.username} 保存的 GitHub 凭据完成登录；站点返回身份 ${n}，已建立账号映射并继续签到`,
          ),
          await t.confirmIdentity?.(),
          !0
        );
      }
      if (
        (y().checkin?.entry || (0, __contentScope.rf)(y())) &&
        a.match !== `confirmed` &&
        !le(i, a)
      )
        return (S.push(`OAuth 返回页身份字段不完整，将进入本站签到页面后核对`), !0);
      if (a.match !== `confirmed` && !le(i, a) && i.identity) {
        let e = await me(i, `OAuth 返回页`);
        if (e === `switching`) return !1;
        if (e === `confirmed`) return (await t.confirmIdentity?.(), !0);
      }
      let s = (0, __contentScope.Qp)({
        loginMethod: r,
        verdict: a.match,
        expectedUserId: g(),
        siteAccountCount: e.siteAccountCount,
        checkinPageAvailable: !!ge(),
        canSwitchAccount: o,
      });
      if (s.action === `proceed`) {
        if (s.reason === `confirmed` && i.identity) {
          let e = r === `passkey` ? `Passkey` : r === `github` ? `GitHub OAuth` : `OAuth`;
          (await T(i.identity))
            ? S.push(`已核对并记住 ${e} 账号身份：${a.detail}`)
            : (S.push(`已核对 ${e} 当前页面身份：${a.detail}`),
              S.push(`当前身份证据不是站点接口结果，只用于本轮核对，不更新账号长期映射`));
        } else S.push(`${r} 登录后仍读不到身份，但本站只有该账号，继续执行`);
        return (await t.confirmIdentity?.(), !0);
      }
      if (s.action === `defer-to-checkin-page`)
        return (S.push(`OAuth 返回页读不到可核对身份，将在签到页核对后再执行签到`), !0);
      if (s.action === `switch-account`) {
        await reloginTargetAccount(
          a.match === `mismatch` ? `识别到其他账号（${a.detail}）` : `无法读取当前账号身份（${a.detail}）`,
          `OAuth 返回页`,
        );
        return !1;
      }
      await reloginTargetAccount(
        a.match === `mismatch` ? `识别到其他账号（${a.detail}）` : `无法读取当前账号身份（${a.detail}）`,
        `OAuth 返回页`,
      );
      return !1;
    }
    async function k() {
      if (
        r !== `token` &&
        n.filter((e) => e.startsWith(__contentScope.Wm)).length >= __contentScope.Gm
      )
        return (S.push(`账号身份仍不匹配，已达到自动切换次数上限，不再清除 Cookie`), `exhausted`);
      let i = await (0, __contentScope.$i)(e.site, S, t.clearSiteCookies);
      formLoginSubmitted = !1;
      if (i.cookieMayRemain && t.clearSiteCookies) return `blocked`;
      if (r === `token`)
        return i.cookieMayRemain && !t.clearSiteCookies
          ? (S.push(`该站点凭据只存在本地，清空即已退出，无需重载页面`), `cleared`)
          : i.cookieMayRemain
            ? `blocked`
            : `cleared`;
      return (
        S.push(
          i.cookieMayRemain
            ? `${__contentScope.Wm} 本地登录态已清空，重新打开登录页以彻底退出`
            : `${__contentScope.Wm} 本站浏览器 Cookie 已清除，重新打开登录页`,
        ),
        await t.navigate(e.site.loginUrl, n, `login`),
        `reloading`
      );
    }
    async function A() {
      return !o || !t.startGithubLogout
        ? `blocked`
        : n.some((e) => e.startsWith(__contentScope.Km))
          ? `exhausted`
          : (await (0, __contentScope.$i)(e.site, S, t.clearSiteCookies)).cookieMayRemain
            ? `blocked`
            : (S.push(`${__contentScope.Km} 已退出站点账号，正在退出当前 GitHub 会话`),
              await t.startGithubLogout(n),
              `started`);
    }
    async function reloginTargetAccount(reason, source) {
      S.push(`${source}${reason}，清除当前会话并使用账号 ${e.username} 重新登录`);
      if (r === `token`)
        return C(`本账号 Token 身份尚未确认（${reason}），请检查并重新抓取该账号的 Token`);
      if (r === `github` && o) {
        const result = await A();
        if (result === `started`) return null;
        return C(
          result === `exhausted`
            ? `已达到本轮 GitHub 账号切换次数上限，请重新执行签到`
            : `无法清理当前 GitHub / 本站会话，为避免给错账号签到已停止`,
        );
      }
      const result = await k();
      if (result === `reloading`) return null;
      if (result === `exhausted`)
        return C(`已达到本轮账号切换次数上限，请重新执行签到`);
      if (result === `blocked`)
        return C(`无法清除当前站点会话，为避免给错账号签到已停止；请检查扩展 Cookie 权限`);
      return C(`无法为账号 ${e.username} 重新打开登录页`);
    }
    async function Te() {
      if (!e.site.tokenConfig)
        return C(`站点未配置 Token 参数（存储键名/请求头），请在站点编辑里补全`);
      let n = e.session;
      if (!n?.accessToken && !e.apiToken)
        return C(`该账号还没有登录凭据；请手动登录该站点一次后点「抓取登录态」`);
      let r = await (0, __contentScope.$i)(e.site, S, t.clearSiteCookies);
      if (t.clearSiteCookies && r.cookieMayRemain)
        return C(`无法清除本站浏览器 Cookie，为避免复用其他账号会话已停止`);
      let i = n?.accessToken ?? e.apiToken;
      if (!(0, __contentScope.ea)(e.site, i, S)) return C(`Token 注入失败，无法继续`);
      if (n) {
        let r = await (0, __contentScope.am)(e.site, n, S);
        if (r.status === `expired`) return C(`${r.reason}；请重新登录该站点后再点「抓取登录态」`);
        r.status === `refreshed` && ((i = r.tokens.accessToken), await t.saveSession?.(r.tokens));
      }
      let a = await (0, __contentScope.qi)(v(), i, { diagnostics: S });
      if (!a)
        return C(
          n
            ? `登录凭据已失效，请重新登录该站点后点「抓取登录态」`
            : `Token 无效或已过期，请重新从站点获取`,
        );
      if (
        !hasBoundIdentity() &&
        a.source === `api` &&
        identitySampleKey(a) &&
        !ue({ identity: a })
      ) {
        await (0, __contentScope.w)(350);
        const next = await (0, __contentScope.qi)(v(), i, { diagnostics: S });
        if (!stableIdentitySamples(a, next) || ue({ identity: next }))
          return C(`本账号 Token 返回的身份尚未形成稳定样本，已停止首次绑定和签到`);
        if (!t.saveIdentity) return C(`无法保存本账号首次确认的 Token 身份，请重新加载扩展后重试`);
        a = { ...next, verifiedByManagedLogin: !0 };
        await ie(a, !0);
        S.push(`已使用本账号 Token 确认本站${g() ? `用户 ID ${g()}` : `登录标识 ${m ?? h}`}`);
      }
      let o = ce({ identity: a });
      return o.match !== `confirmed`
        ? C(
            o.match === `mismatch`
              ? `凭据对应的不是本账号：${o.detail}；请重新抓取该账号的登录态`
              : `Token 身份尚未确认：${o.detail}；已停止签到，请核对本账号的登录态`,
          )
        : (S.push(`Token 认证成功：${a.email ?? a.username ?? a.userId}`),
          await t.confirmIdentity?.(),
          await (0, __contentScope.U)(e.site, S, { waitForAppear: !0 }),
          M(!0));
    }
    async function Ee(r, i = !1) {
      if (r.status === `interrupted`) return r.terminal ? C(r.message) : null;
      if (r.status === `navigate`) {
        let i = ve(r.url),
          // Navigation attempts before an account switch belong to the old
          // login session. Keep the logs, but reset every route budget together.
          a = Math.max((0, __contentScope.oh)(n, __contentScope.Zm), (0, __contentScope.ch)(n)),
          routeSteps = n.slice(a + 1),
          o = (0, __contentScope.ah)(routeSteps),
          s = o.filter((e) => (0, __contentScope.ph)(e, i)).length,
          c = (0, __contentScope.dh)([...o, i]),
          l = (0, __contentScope.mh)(routeSteps),
          u =
            s >= __contentScope.Qm
              ? `签到页 ${i} 已跳转 ${s} 次仍未到达（站点把它重定向到了 ${ve(location.href)}）`
              : c
                ? `签到页在 ${c.first} 与 ${c.second} 之间往返：站点每次都把当前页 ${ve(location.href)} 重定向回去，再跳只是原样重复`
                : !(0, __contentScope.af)(y()) && l >= __contentScope.$m
                  ? `当前页 ${ve(location.href)} 不在学习路线上，已为此跳了 ${l} 次仍未落到路线上`
                  : null;
        if (u) {
          let r = (0, __contentScope.sf)(y()),
            a = (0, __contentScope.lh)(n);
          if (r && !a)
            return (
              S.push(`身份核验页无法到达，拒绝降级绕过身份核验执行签到：${u}`),
              await t.needsUser(
                `身份核验页未能到达：${u}。本轮跳转预算已用尽，已停止签到；请检查身份核验页是否被站点重定向，确认可以打开后重试。`,
                n,
              ),
              null
            );
          if ((0, __contentScope.rf)(y()))
            return (
              S.push(`${u}，学习路线无法继续，已停止本次回放`),
              await t.needsUser(
                `学习路线无法继续：${u}。已保存的流程仍保留；请确认站点页面可正常打开后重试，页面已改版时重新学习。`,
                n,
              ),
              null
            );
          S.push(`${u}，改为在当前页直接寻找签到入口`);
          let s = await (0, __contentScope.Nf)(b(), S, re);
          if (s.status === `success` || s.status === `already`) return Ee(s);
          let c = new Set(o);
          c.add(ve(location.href));
          let l = __contentScope.th.find((t) => !c.has(t) && (0, __contentScope.W)(e.site, t));
          return l
            ? (S.push(`${__contentScope.Xm}${l}`),
              S.push(`当前页没有签到入口，改试常见签到路由 ${l}`),
              await t.navigate(new URL(l, location.href).href, n, `checkin`),
              null)
            : C(
                `签到页 ${i} 无法到达（站点重定向到 ${ve(location.href)}），已试过 ${[...c].join(`、`)} 都没有签到入口。请打开站点编辑，把签到页改成实际地址`,
              );
        }
        return (S.push(`${__contentScope.Xm}${i}`), await t.navigate(r.url, n, `checkin`), null);
      }
      if (r.status === `relogin`)
        return (S.push(r.message), await t.navigate(r.url, n, `relogin`), null);
      let a = new Set([...(r.claimTextsUsed ?? []), ...(r.claimTextUsed ? [r.claimTextUsed] : [])]);
      for (let e of a) await t.saveClaimText?.(e);
      if (
        ((r.status === `success` || r.status === `already`) &&
          t.saveCheckinReward?.(document.body?.innerText ?? ``).catch(() => {}),
        r.status === `failed`)
      )
        return ee(r.message, r.metrics);
      if (r.status === `skipped`) return C(r.message, r.metrics);
      if (r.status === `unverified`) {
        let e = i
            ? `本轮已登录，但没有签到动作可确认，未执行签到。`
            : `打开时已登录，本轮没有重新登录，无法把「登录即签到」归因到本轮，未执行签到。`,
          a = i
            ? `请打开该站点标签页确认余额是否已经增加。`
            : `若确认今天的额度已经到账，可在账号行手动标记完成；想每轮都强制退出再登录，请把本站签到方式改成「退出再登录」。`,
          o = /[。！？]$/.test(r.message) ? `` : `。`,
          s = `${e}${r.message}${o}${a}`;
        return (S.push(s), await t.needsUser(s, n), null);
      }
      return te(r.message, r.metrics);
    }
    function Oe(e, t) {
      let n = e.identity,
        r = [
          `URL ${location.href}`,
          `来源 ${n?.source ?? `none`}`,
          ...(n?.endpoint ? [`实时接口 ${n.endpoint}`] : []),
          ...(n?.evidence === `structured-fields` ? [`页面证据 来自明确的资料字段`] : []),
          ...(n?.evidence === `profile-card` ? [`页面证据 来自个人设置中的当前用户卡片`] : []),
          ...(n?.identityConflict ? [`身份证据冲突 ${n.identityConflict}`] : []),
          `目标 userId ${g() ?? `尚未绑定`}`,
          `userId ${n?.userId ?? `未读取`}`,
          `username ${n?.username ?? `未读取`}`,
          `email ${n?.email ?? `未读取`}`,
          `displayName ${n?.displayName ?? `未读取`}`,
          `页面账号旁证 ${e.pageAccountMatch ?? `未命中`}`,
          `受控身份别名 ${a ?? `未配置`}`,
          `结论 ${t.match}: ${t.detail}`,
        ];
      S.push(`身份页诊断：${r.join(`；`)}`);
    }
    function j() {
      let t = (0, __contentScope.Bi)(),
        n = (0, __contentScope.Gi)(e.username);
      return t
        ? { identity: t, ...(n ? { pageAccountMatch: n.matched } : {}) }
        : {
            identity: n ? { username: e.username, source: `visible` } : null,
            ...(n ? { pageAccountMatch: n.matched } : {}),
          };
    }
    async function ke() {
      let e = await se(`个人资料页`),
        t = de(e, ce(e));
      if (canEstablishFormIdentity(e)) {
        const firstIdentity = e.identity;
        await (0, __contentScope.w)(650);
        const next = await se(`个人资料页`);
        if (canEstablishFormIdentity(next) && stableIdentitySamples(firstIdentity, next.identity)) {
          return {
            evidence: { ...next, managedLoginStable: !0 },
            verdict: de(next, ce(next)),
          };
        }
        return {
          evidence: next,
          verdict: {
            match: `unknown`,
            detail: `本账号首次登录后的身份尚未形成一致的稳定样本`,
          },
        };
      }
      if (
        !(y().checkin?.entry || (0, __contentScope.cf)(y()) || y().identitySource?.pagePath) &&
        !e.identity?.identityConflict
      )
        return { evidence: e, verdict: t };
      S.push(
        e.identity?.source === `api`
          ? `已读取实时身份接口，复核用户 ID 是否稳定`
          : `身份信息尚未稳定，继续复查实时接口和可见资料字段`,
      );
      let n = Date.now() + __contentScope.nh,
        r = JSON.stringify({
          identity: identitySampleKey(e.identity),
          pageAccountMatch: e.pageAccountMatch,
          match: t.match,
        }),
        i = 1,
        a = 300;
      for (; Date.now() < n;) {
        await (0, __contentScope.w)(a);
        a = Math.min(1200, a + 180);
        e = await se(`个人资料页`);
        t = de(e, ce(e));
        let n = JSON.stringify({
          identity: identitySampleKey(e.identity),
          pageAccountMatch: e.pageAccountMatch,
          match: t.match,
        });
        i = n === r ? i + 1 : 1;
        r = n;
        if ((t.match === `confirmed` && i >= 2) || (t.match === `mismatch` && i >= 2 && fe(e, t)))
          return { evidence: e, verdict: t };
      }
      return (
        i < 2 && S.push(`个人资料页身份在等待期内仍未形成连续稳定样本`),
        t.match === `mismatch` && !fe(e, t)
          ? (S.push(`个人资料页只读到第三方句柄，不能据此判定 GitHub 凭据错误或自动切换账号`),
            { evidence: e, verdict: he(e) })
          : { evidence: e, verdict: t }
      );
    }
    async function Ae() {
      let { evidence: e, verdict: t } = await ke();
      return je(e, t);
    }
    async function je(a, s) {
      if (r === `form` && formLoginSubmitted) {
        S.push(`本轮已使用本账号的用户名和密码登录成功，直接继续签到`);
        await t.confirmIdentity?.();
        return { proceed: !0 };
      }
      if (a.identity?.identityConflict) {
        Oe(a, s);
        return {
          proceed: !1,
          result: await reloginTargetAccount(
            `身份证据冲突（${a.identity.identityConflict}）`,
            `当前页面`,
          ),
        };
      }
      if (s.match === `confirmed`) {
        S.push(`已确认当前登录账号：${s.detail}`);
        await t.confirmIdentity?.();
        return { proceed: !0 };
      }
      if (r === `auto` && !hasBoundIdentity()) {
        return {
          proceed: !1,
          result: await reloginTargetAccount(`身份尚未建立（${s.detail}）`, `当前页面`),
        };
      }
      if (r === `form` && !hasBoundIdentity()) {
        if (!formLoginSubmitted) {
          return {
            proceed: !1,
            result: await reloginTargetAccount(`身份尚未建立（${s.detail}）`, `当前页面`),
          };
        }
      }
      if (r === `github` && !hasBoundIdentity()) {
        const binding = await me(a, `个人资料页`);
        if (binding === `confirmed`) {
          (0, __contentScope.cf)(y()) && S.push(__contentScope.rh);
          await t.confirmIdentity?.();
          return { proceed: !0 };
        }
        if (binding === `switching`) return { proceed: !1, result: null };
        Oe(a, s);
        return {
          proceed: !1,
          result: await reloginTargetAccount(`GitHub 身份尚未稳定（${s.detail}）`, `个人资料页`),
        };
      }
      if (s.match === `unknown` && i && a.identity) {
        let e = await me(a, `个人资料页`);
        if (e === `switching`) return { proceed: !1, result: null };
        if (e === `confirmed`)
          return (
            (0, __contentScope.cf)(y()) && S.push(__contentScope.rh),
            await t.confirmIdentity?.(),
            { proceed: !0 }
          );
      }
      if (s.match === `unknown` && identityConfirmedThisRun) {
        S.push(`本轮登录账号已经确认，当前页面暂未返回额外身份字段，继续签到`);
        return { proceed: !0 };
      }
      Oe(a, s);
      return {
        proceed: !1,
        result: await reloginTargetAccount(
          s.match === `mismatch` ? `识别到其他账号（${s.detail}）` : `无法读取当前账号身份（${s.detail}）`,
          `个人资料页`,
        ),
      };
    }
    async function Me(r) {
      if (identityConfirmedThisRun) return null;
      let i = y();
      if (!(0, __contentScope.p)(i)) return null;
      if (!(0, __contentScope.W)(i, location.href))
        return {
          status: `interrupted`,
          message: `学习流程已离开本站，停止页面操作`,
          terminal: !0,
        };
      if (
        (r.phase !== `action` && (await (0, __contentScope.U)(i, S, { waitForAppear: !1 })),
        r.phase !== `action`)
      ) {
        let e = await Ce();
        if (!e.resolved)
          return {
            status: `interrupted`,
            message: e.error ?? `学习流程的人机验证未完成，已停止操作`,
            terminal: !0,
          };
      }
      let a = (0, __contentScope.An)(i) && !(0, __contentScope.ir)(i),
        o =
          (0, __contentScope.xm)(`${location.pathname}${location.hash}`) &&
          !(0, __contentScope.ir)(i),
        s =
          a ||
          o ||
          r.phase === `result` ||
          r.phase === `action` ||
          (r.phase === `after` && r.step?.type === `assert`)
            ? await (0, __contentScope.qi)(v(), void 0, { serverOnly: !0 })
            : null,
        c = s?.source === `api` ? { identity: s } : j(),
        l = ce(c);
      if (c.identity?.identityConflict) {
        await je(c, l);
        return {
          status: `interrupted`,
          message: `身份证据冲突：${c.identity.identityConflict}，已停止签到`,
          terminal: !0,
        };
      }
      if (fe(c, l)) {
        S.push(`学习流程中检测到账号变化：${l.detail}`);
        let e = await je(c, de(c, l));
        if (!e.proceed)
          return e.result
            ? { status: `interrupted`, message: e.result.message, terminal: !0 }
            : {
                status: `interrupted`,
                message: `账号已变化，正在切换到目标账号后重新执行`,
              };
      }
      if ((a || o) && s?.source !== `api`) {
        const loginState = await readCurrentLoginState();
        if (loginState.status === `authenticated`) return null;
        if (!canStartLogin(loginState)) {
          await stopForUnconfirmedLogin(loginState);
          return {
            status: `interrupted`,
            message: `学习流程中的登录状态尚未确认：${loginState.detail}`,
            terminal: !0,
          };
        }
        let r = `学习流程中登录状态已失效，需要重新登录`,
          i = n.filter((e) => e.startsWith(__contentScope.qm)).length;
        return i >= __contentScope.Jm
          ? {
              status: `interrupted`,
              message: `${r}；自动恢复 ${__contentScope.Jm} 次仍未保持会话`,
              terminal: !0,
            }
          : (S.push(`${__contentScope.qm} ${i + 1}/${__contentScope.Jm}，返回登录页重新认证`),
            (0, __contentScope.di)(),
            await t.navigate(e.site.loginUrl, n, `login`),
            { status: `interrupted`, message: r });
      }
      return null;
    }
    async function M(r = !1) {
      if (formLoginSubmitted && !identityConfirmedThisRun) {
        S.push(`本轮已使用本账号的用户名和密码登录成功，直接继续签到`);
        await t.confirmIdentity?.();
      }
      let i = y();
      if (
        (0, __contentScope.p)(i) &&
        ((0, __contentScope.xm)(`${location.pathname}${location.hash}`) ||
          ((0, __contentScope.An)(i) && !(0, __contentScope.ir)(i)))
      ) {
        let e = await Me({ phase: `before` });
        if (e) return e.status === `failed` || e.terminal ? C(e.message) : null;
      }
      let a = i.checkin?.method === `none`,
        o = i.checkin?.entry,
        s = i.checkin?.method === `button` && !ge(),
        c = (0, __contentScope.rf)(i),
        l = (0, __contentScope.sf)(i);
      if (c && !l && !identityConfirmedThisRun)
        return (
          S.push(`学习签到路线缺少身份核验页`),
          await t.needsUser(
            `本站统一签到流程没有记录到可核验账号的身份页；请用本站任一账号更新流程，先访问能显示当前账号的个人资料页，再完成签到并结束学习。更新后本站账号共用这条路线。`,
            n,
          ),
          null
        );
      let u = (0, __contentScope.of)(i, _),
        d = (0, __contentScope.cf)(i),
        f = (0, __contentScope.lh)(n) || identityConfirmedThisRun;
      if (!c && !identityConfirmedThisRun) {
        const observation = await se(`签到前的页面`),
          verdict = ce(observation);
        if (await enterIdentityPage(observation, verdict, `checkin`)) return null;
      }
      if (l && !f && !d && (g() || formLoginSubmitted || e.githubCredentialsSubmitted)) {
        const first = await (0, __contentScope.qi)(v(), void 0, { serverOnly: !0 });
        if (first?.source === `api` && first.userId && !first.identityConflict) {
          await (0, __contentScope.w)(350);
          const next = await (0, __contentScope.qi)(v(), void 0, { serverOnly: !0 });
          if (next?.source === `api` && next.userId === first.userId && !next.identityConflict) {
            const observation = { identity: next, managedLoginStable: !0 },
              verdict = de(observation, ce(observation));
            S.push(
              `当前用户接口已连续确认用户 ID ${next.userId}，目标 ${g() ?? `首次建立身份`}（${next.endpoint ?? `本站身份接口`}）`,
            );
            const gate = await je(observation, verdict);
            if (!gate.proceed) return gate.result ?? null;
            S.push(__contentScope.rh);
            f = !0;
          } else S.push(`当前用户接口身份尚未稳定，继续沿本站流程进入资料页复核`);
        }
      }
      if (l && u && !f && !d)
        return (
          S.push(`已到达签到目标页但本轮尚未核验个人资料身份，先返回 identityPath`),
          Ee({ status: `navigate`, url: l })
        );
      if (a && l && !d && !f)
        return (
          S.push(`登录即签到：先按学习路线前往身份核验页 ${l}`),
          r && S.push(`${__contentScope.ih}${e.username}`),
          Ee({ status: `navigate`, url: l })
        );
      let m = c && !u,
        h = l ? d : e.stage === `checkin` || !!o || s || u;
      if (
        ((o || (i.checkin?.method === `button` && e.stage !== `checkin`)) &&
          (await t.markStage(`checkin`, n)),
        h)
      ) {
        if (!(await be(`checkin`))) return C(`安全验证超时，请完成后重新签到`);
        await (0, __contentScope.U)(i, S, { waitForAppear: !0 });
      }
      if (o) {
        let e = await (0, __contentScope.kp)(i, S, {
          beforeAction: () => be(`checkin`, __contentScope.$),
        });
        if (e.status === `navigate`) return (await t.navigate(e.url, n, `checkin`), null);
        if (e.status === `failed`) return C(e.message);
        await (0, __contentScope.U)(i, S, { waitForAppear: !0 });
      }
      if ((l ? h : h && !m) && !identityConfirmedThisRun) {
        if (!(await be(`checkin`, __contentScope.$)))
          return C(`个人资料页身份核对前的人机验证未完成`);
        let e = await Ae();
        if (!e.proceed) return e.result;
      }
      let workflowSite = y(),
        loginHappened = r || (0, __contentScope.uh)(n),
        baseline = loginHappened ? e.context?.loginCheckinBalanceBefore : void 0,
        actionOptions =
          workflowSite.checkin?.method === `none`
            ? {
                ...re,
                loginHappenedThisRun: loginHappened,
                ...(baseline ? { loginCheckinBalanceBefore: baseline } : {}),
              }
            : re;
      return Ee(await (0, __contentScope.Nf)(workflowSite, S, actionOptions), loginHappened);
    }
    try {
      let a = (0, __contentScope.Wp)();
      if (a) {
        let r = n.filter((e) => e.startsWith(__contentScope.Hm)).length;
        if (a.retryable && r < __contentScope.Vm.length) {
          let i = r + 1;
          return (
            S.push(`${__contentScope.Hm} ${i}/${__contentScope.Vm.length}: ${a.message}`),
            await (0, __contentScope.w)(__contentScope.Vm[r]),
            await t.navigate(location.href, n, e.stage),
            null
          );
        }
        return C(`${a.message}，已停止本次签到；这不是表单选择器问题`);
      }
      if (r === `manual` && [`login`, `relogin`].includes(e.stage)) {
        if (!t.waitForManualLogin)
          throw Error(`当前运行环境无法保留页面登录任务，请重新加载扩展后重试`);
        manualWaitingStage = e.stage === `relogin` ? `relogin-verify-manual` : `verify-manual`;
        await t.markStage(manualWaitingStage, n);
      }
      let s = await (0, __contentScope.Lu)(S, waitingLoginChallenge);
      if (!s.resolved) return C(`${s.kind ?? `Cloudflare 安全验证`}超时，请完成后重新签到`);
      switch ((s.detected && (await t.markStage(e.stage, n)), e.stage)) {
        case `verify-manual`:
        case `relogin-verify-manual`: {
          const verification = await waitManualLogin(e.stage);
          return verification.confirmed
            ? e.stage === `relogin-verify-manual`
              ? ae(`退出后页面登录`)
              : M(!0)
            : verification.conflict
              ? null
              : C(verification.detail);
        }
        case `checkin`:
          return M((0, __contentScope.uh)(n));
        case `verify`:
          if (
            (await (0, __contentScope.w)(800), location.origin !== (0, __contentScope.Dr)(e.site))
          )
            return C(`登录跳转到了非本站页面，已停止自动操作`);
          if (!(await we(`verify`)))
            return C(loginFailureMessage(`未找到明确的登录成功证据(${location.pathname})`));
          S.push(`登录结果已确认(${location.pathname})`);
          if (r === `form` && formLoginSubmitted) {
            S.push(`本轮已使用本账号的用户名和密码登录成功，直接继续签到`);
            await t.confirmIdentity?.();
            return M(!0);
          }
          if (!(0, __contentScope.rf)(y())) {
            let i = await se(`登录后的页面`),
              r = i.identity,
              a = de(i, ce(i));
            if (r?.identityConflict) {
              await je(i, a);
              return null;
            }
            if (await enterIdentityPage(i, a, `verify`)) return null;
            if (r === `form` && !hasBoundIdentity()) return M(!0);
            if (a.match === `mismatch`)
              return (
                S.push(`登录后的账号身份不匹配：${a.detail}`),
                await t.needsUser(
                  `登录后的账号不是 ${e.username}（${a.detail}），已停止签到并保留原账号绑定。`,
                  n,
                ),
                null
              );
            if (g() && a.match !== `confirmed`) {
              Oe(i, a);
              await t.needsUser(
                `登录身份核验未通过：${a.detail}。本账号已绑定用户 ID ${g()}，本轮尚未确认该 ID，已停止签到。`,
                n,
              );
              return null;
            }
            (a.match === `confirmed` && r && (await T(r)), await t.confirmIdentity?.());
          }
          return M(!0);
        case `verify-oauth`:
          return (
            await (0, __contentScope.w)(1200),
            location.origin === (0, __contentScope.Dr)(e.site)
              ? (await we(`verify-oauth`))
                ? (S.push(`OAuth 授权完成，已跳回本站(${location.pathname})`),
                  (await O()) ? M(!0) : null)
                : C(loginFailureMessage(`OAuth 授权后缺少明确的登录成功证据`))
              : C(`OAuth 尚未返回本站，请在授权页完成操作`)
          );
        case `relogin`:
          S.push(`开始第二次登录以完成签到`);
          await (0, __contentScope.U)(e.site, S, { waitForAppear: !0 });
          if (r !== `token`) {
            const loginState = await readCurrentLoginState();
            if (loginState.status === `authenticated`)
              return (
                S.push(`站点退出后会话仍然有效（${loginState.detail}），退出没有生效`),
                await t.needsUser(
                  `本站的退出操作没有真正结束会话（${loginState.detail}），无法完成「退出再登录」。请核对本站退出流程后重新执行。`,
                  n,
                ),
                null
              );
            if (!canStartLogin(loginState)) {
              await t.needsUser(
                `退出后的登录状态尚未确认：${loginState.detail}。没有看到登录表单或登录入口，已停止第二次登录；请核对本站退出流程及当前页面。`,
                n,
              );
              return null;
            }
            S.push(`退出后已显示登录入口，开始本账号的第二次登录`);
            (0, __contentScope.di)();
          }
          if (r === `auto` && !(await resolvePageMethod(1500)))
            return C(`当前登录页尚未显示可识别的登录方式，请等待页面加载完成后重试`);
          if (r === `token`) {
            let t = e.session;
            if (!t?.accessToken && !e.apiToken)
              return C(`该账号未填写 API Token 也没有抓取登录态，无法完成第二次登录`);
            let n = t?.accessToken ?? e.apiToken;
            if (!(0, __contentScope.ea)(e.site, n, S)) return C(`Token 注入失败，第二次登录未完成`);
            let r = await (0, __contentScope.qi)(v(), n);
            if (!r) return C(`第二次注入 Token 后仍读不到身份，签到未完成`);
            const observation = { identity: r },
              verdict = ce(observation);
            if (verdict.match !== `confirmed`)
              return C(`第二次 Token 身份未能确认：${verdict.detail}，签到未完成`);
            S.push(`第二次 Token 认证成功：${r.email ?? r.username ?? r.userId}`);
            return ae(`退出后重新登录（Token）`, r);
          }
          if (r === `manual`) return beginManualLogin(!0);
          return i
            ? (await (0, __contentScope.U)(e.site, S, { waitForAppear: !0 }),
              (await E(`relogin`, __contentScope.$))
                ? (await (0, __contentScope.mr)(
                    e.site,
                    S,
                    r === `github` ? `github` : r === `passkey` ? `passkey` : `oauth`,
                    { beforeClick: () => E(`relogin`, __contentScope.$) },
                  ),
                  (await be(`relogin`))
                    ? (await (0, __contentScope.vr)(
                        e.site,
                        S,
                        {
                          beforeClick: () => D(`relogin`),
                          afterClick: () => xe(`relogin-verify`),
                          beforeAuxiliaryClick: () => E(`relogin`, __contentScope.$),
                          beforeNavigate: () => t.markStage(`relogin-verify`, n),
                        },
                        r === `github` ? `github` : r === `passkey` ? `passkey` : `oauth`,
                      ))
                      ? (await (0, __contentScope.yr)(e.site, S))
                        ? null
                        : (await we(`relogin-verify`))
                          ? (await O())
                            ? ae(
                                `退出后重新登录（${r === `passkey` ? `Passkey` : r === `github` ? `GitHub OAuth` : `OAuth`}）`,
                              )
                            : null
                          : C(
                              loginFailureMessage(
                                `第二次${r === `passkey` ? ` Passkey` : ` OAuth`} 登录未确认成功`,
                              ),
                            )
                      : C(
                          `未找到${r === `passkey` ? ` Passkey` : ` OAuth`} 按钮，无法完成第二次登录`,
                        )
                    : C(`安全验证超时，请完成后重新签到`))
                : C(`展开第二次登录入口前的人机验证未完成`))
            : (await (0, __contentScope.pr)(e.site, S, {
                beforeClick: () => E(`relogin`, __contentScope.$),
              }),
              (await (0, __contentScope.hr)(
                e.site,
                e.username,
                e.password,
                S,
                async () => (await t.markStage(`relogin`, n), D(`relogin`)),
                () => E(`relogin`, __contentScope.$),
              ))
                ? (await (0, __contentScope.U)(e.site, S),
                  (await (0, __contentScope.gr)(e.site, S, {
                    beforeClick: () => beforeFormSubmit(`relogin`),
                    afterClick: () => xe(`relogin-verify`),
                    beforeAuxiliaryClick: () => E(`relogin`, __contentScope.$),
                    beforeNavigate: () => t.markStage(`relogin-verify`, n),
                  }))
                    ? (await we(`relogin-verify`))
                      ? ae(`退出后重新登录`)
                      : C(loginFailureMessage(`第二次登录未确认成功`))
                    : C(`未能提交登录表单`))
                : C(ne()));
        case `relogin-verify`:
          return (
            await (0, __contentScope.w)(1e3),
            (await we(`relogin-verify`))
              ? i && !(await O())
                ? null
                : (S.push(`第二次登录结果已确认，继续核验账号身份`), ae(`退出后重新登录`))
              : C(loginFailureMessage(`重新登录后缺少明确的登录成功证据，签到未完成`))
          );
        default: {
          (S.push(`开始处理站点「${e.site.name}」账号 ${e.username}`),
            await (0, __contentScope.U)(e.site, S, { waitForAppear: !0 }));
          const initialLoginState = await readCurrentLoginState();
          let i = initialLoginState.status === `authenticated`,
            a = initialLoginState?.status === `authenticated` ? initialLoginState.identity : null;
          if (
            shouldProbeLoginIdentity(initialLoginState) &&
            canProbeLoginIdentityPage() &&
            shouldProbeLoginIdentity(
              classifyLoginState((0, __contentScope.readLoginSnapshot)(v())),
            ) &&
            (await enterIdentityPage(
              { identity: initialLoginState.identity ?? null },
              { match: `unknown`, detail: initialLoginState.detail },
              e.stage,
              { loginVerification: !0 },
            ))
          )
            throw loginVerificationNavigation;
          if (!i && r !== `token`) {
            if (!canStartLogin(initialLoginState))
              return stopForUnconfirmedLogin(initialLoginState);
            S.push(`页面已明确显示登录入口，开始使用本账号保存的登录方式`);
            (0, __contentScope.di)();
          }
          if (i) {
            if (r === `form` && formLoginSubmitted) {
              S.push(`本轮已使用本账号的用户名和密码登录成功，直接继续签到`);
              await t.confirmIdentity?.();
              return M((0, __contentScope.uh)(n));
            }
            if (r === `manual`) {
              const verification = await confirmManualIdentity();
              if (verification.confirmed) return M((0, __contentScope.uh)(n));
              return reloginTargetAccount(
                `身份与目标账号不一致或无法读取（${verification.detail}）`,
                `当前页面`,
              );
            }
            if (identityConfirmedThisRun)
              return (
                S.push(`本轮已确认过登录账号，直接继续`),
                await (0, __contentScope.U)(e.site, S, { waitForAppear: !0 }),
                M((0, __contentScope.uh)(n))
              );
            if (y().checkin?.entry || (0, __contentScope.rf)(y()))
              return M((0, __contentScope.uh)(n));
            let i = a ? { identity: a } : await se(`当前页`),
              s = ce(i);
            if (await enterIdentityPage(i, s, `checkin`)) return null;
            if (i.identity?.identityConflict) {
              await je(i, s);
              return null;
            }
            if (s.match === `confirmed`)
              return (
                S.push(`已确认当前登录账号：${s.detail}`),
                await t.confirmIdentity?.(),
                await (0, __contentScope.U)(e.site, S, { waitForAppear: !0 }),
                M((0, __contentScope.uh)(n))
              );
            Oe(i, s);
            return reloginTargetAccount(
              s.match === `mismatch`
                ? `识别到其他账号（${s.detail}）`
                : `无法读取当前账号身份（${s.detail}）`,
              `当前页面`,
            );
          }
          if (r === `token`) return Te();
          if (r === `auto`) {
            if (!(await resolvePageMethod(1500))) {
              const entry = (0, __contentScope.In)();
              if (entry) {
                if (!(await E(`login`, __contentScope.$))) return C(`登录入口前的安全验证尚未完成`);
                await (0, __contentScope.dr)(entry, e.site, S, `登录入口`);
                await resolvePageMethod(1500);
              }
            }
            if (r === `auto`) {
              if ((0, __contentScope.detectPageLogin)(e.site, {}, !0).length > 1)
                return C(`当前页面有多个登录入口，请编辑本账号，选择自己使用的具体登录方式后重试`);
              const link = (0, __contentScope.Nn)();
              if (link) {
                S.push(`当前页未显示登录方式，进入本站登录页后识别`);
                await t.navigate(link.href, n, `login`);
                return null;
              }
              return C(`当前页面尚未显示站内账密或第三方登录入口，请确认本站登录页能够正常打开`);
            }
          }
          // Announcements, SPA rendering or a completed popup may change the
          // session while login options are being prepared. Recheck before
          // looking for a provider button or filling any credentials.
          await (0, __contentScope.U)(e.site, S, { waitForAppear: !0 });
          const beforeLoginState = await readCurrentLoginState(2500);
          if (beforeLoginState.status === `authenticated`) {
            S.push(`准备登录期间已确认当前会话登录，转入账号核验`);
            if (r === `form` && formLoginSubmitted) {
              S.push(`本轮已使用本账号的用户名和密码登录成功，直接继续签到`);
              await t.confirmIdentity?.();
              return M(!0);
            }
            if (r === `manual`) {
              const verification = await confirmManualIdentity();
              if (!verification.confirmed)
                return reloginTargetAccount(
                  `身份与目标账号不一致或无法读取（${verification.detail}）`,
                  `当前页面`,
                );
            }
            return M((0, __contentScope.uh)(n));
          }
          if (!canStartLogin(beforeLoginState)) return stopForUnconfirmedLogin(beforeLoginState);
          if (r === `manual`) return beginManualLogin();
          if (r === `oauth` || r === `github` || r === `passkey`)
            return (
              await (0, __contentScope.U)(e.site, S, { waitForAppear: !0 }),
              (await E(e.stage, __contentScope.$))
                ? (await (0, __contentScope.mr)(e.site, S, r, {
                    beforeClick: () => E(e.stage, __contentScope.$),
                  }),
                  (await (0, __contentScope.vr)(
                    e.site,
                    S,
                    {
                      beforeClick: () => D(e.stage),
                      afterClick: () => xe(`verify-oauth`),
                      beforeAuxiliaryClick: () => E(e.stage, __contentScope.$),
                      beforeNavigate: () => t.markStage(`verify-oauth`, n),
                    },
                    r,
                  ))
                    ? (r === `passkey` &&
                        S.push(`已触发 Passkey 登录，请在浏览器/系统原生提示中确认`),
                      (await (0, __contentScope.yr)(e.site, S))
                        ? null
                        : (await we(`verify-oauth`))
                          ? (await O())
                            ? M(!0)
                            : null
                          : C(loginFailureMessage(`OAuth 授权后未能确认登录成功`)))
                    : C(
                        e.loginEntry
                          ? `当前页面未找到账号选定的「${e.loginEntry.label}」登录入口，请手动更新本站登录方式`
                          : r === `passkey`
                            ? `未找到 Passkey 登录按钮，请检查选择器配置`
                            : `未找到 OAuth 按钮，请检查选择器配置`,
                      ))
                : C(`展开第三方登录入口前的人机验证未完成`)
            );
          if (
            (await (0, __contentScope.pr)(e.site, S, {
              beforeClick: () => E(e.stage, __contentScope.$),
            }),
            !(await (0, __contentScope.hr)(
              e.site,
              e.username,
              e.password,
              S,
              async () => (await t.markStage(`login`, n), D(`login`)),
              () => E(`login`, __contentScope.$),
            )))
          )
            return C(ne());
          await (0, __contentScope.U)(e.site, S);
          let s = !1;
          if (
            !(await (0, __contentScope.gr)(e.site, S, {
              beforeClick: () => beforeFormSubmit(e.stage),
              afterClick: async () => {
                let e = await Se(`verify`);
                return ((s ||= e.detected && e.resolved && e.kind === `Slider`), e.resolved);
              },
              beforeAuxiliaryClick: () => E(e.stage, __contentScope.$),
              beforeNavigate: () => t.markStage(`verify`, n),
            }))
          )
            return C(`未能提交登录表单`);
          let c = await we(`verify`, (e) => {
              s ||= e.detected && e.resolved && e.kind === `Slider`;
            }),
            l = (() => {
              try {
                let t = new URL(e.site.loginUrl);
                return (
                  t.protocol === `https:` &&
                  t.hostname.toLowerCase() === `www.hvoy.ai` &&
                  t.port === `` &&
                  location.origin === `https://www.hvoy.ai`
                );
              } catch {
                return !1;
              }
            })();
          if (!c && e.stage === `login` && r === `form` && l && s) {
            if (
              (await (0, __contentScope._r)(e.site, S, {
                afterClick: () => xe(`verify`),
                beforeNavigate: () => t.markStage(`verify`, n),
              })) === `blocked`
            )
              return C(`滑块通过后无法安全地重新提交登录表单`);
            c = await we(`verify`);
          }
          return c
            ? (await t.confirmIdentity?.(),
              S.push(
                `本轮账号 ${e.username} 使用自己的用户名和密码登录成功，直接继续签到`,
              ),
              await (0, __contentScope.U)(e.site, S),
              M(!0))
            : C(loginFailureMessage(`登录结果未确认，请手动查看该标签页`));
        }
      }
    } catch (e) {
      if (e === loginVerificationNavigation) return null;
      let t = e instanceof Error ? e.message : String(e);
      return (S.push(`异常: ${t}`), C(t));
    }
  }
  __contentState.f = f;
  __contentState.ot = ot;
  __contentState.dt = dt;
  __contentState.ht = ht;
  __contentState._t = _t;
  __contentState.vt = vt;
  __contentState.yt = yt;
  __contentState.xt = xt;
  __contentState.St = St;
  __contentState.Ct = Ct;
  __contentState.wt = wt;
  __contentState.Ft = Ft;
  __contentState.It = It;
  __contentState.Lt = Lt;
  __contentState.Rt = Rt;
  __contentState.zt = zt;
  __contentState.Bt = Bt;
  __contentState.Vt = Vt;
  __contentState.Ht = Ht;
  __contentState.Wt = Wt;
  __contentState.Gt = Gt;
  __contentState.Kt = Kt;
  __contentState.qt = qt;
  __contentState.Jt = Jt;
  __contentState.Yt = Yt;
  __contentState.Xt = Xt;
  __contentState.Zt = Zt;
  __contentState.Qt = Qt;
  __contentState.B = B;
  __contentState.tn = tn;
  __contentState.bn = bn;
  __contentState.xn = xn;
  __contentState.Sn = Sn;
  __contentState.Cn = Cn;
  __contentState.wn = wn;
  __contentState.Tn = Tn;
  __contentState.En = En;
  __contentState.Dn = Dn;
  __contentState.On = On;
  __contentState.kn = kn;
  __contentState.An = An;
  __contentState.jn = jn;
  __contentState.Mn = Mn;
  __contentState.Nn = Nn;
  __contentState.In = In;
  __contentState.Ln = Ln;
  __contentState.Rn = Rn;
  __contentState.zn = zn;
  __contentState.Bn = Bn;
  __contentState.Vn = Vn;
  __contentState.Un = Un;
  __contentState.Wn = Wn;
  __contentState.Gn = Gn;
  __contentState.Kn = Kn;
  __contentState.qn = qn;
  __contentState.Jn = Jn;
  __contentState.Yn = Yn;
  __contentState.Xn = Xn;
  __contentState.Zn = Zn;
  __contentState.Qn = Qn;
  __contentState.$n = $n;
  __contentState.er = er;
  __contentState.tr = tr;
  __contentState.nr = nr;
  __contentState.rr = rr;
  __contentState.ir = ir;
  __contentState.ar = ar;
  __contentState.U = U;
  __contentState.lr = lr;
  __contentState.ur = ur;
  __contentState.dr = dr;
  __contentState.fr = fr;
  __contentState.pr = pr;
  __contentState.mr = mr;
  __contentState.hr = hr;
  __contentState.gr = gr;
  __contentState._r = _r;
  __contentState.vr = vr;
  __contentState.yr = yr;
  __contentState.br = br;
  __contentState.xr = xr;
  __contentState.Tr = Tr;
  __contentState.Er = Er;
  __contentState.Dr = Dr;
  __contentState.Or = Or;
  __contentState.kr = kr;
  __contentState.W = W;
  __contentState.Ar = Ar;
  __contentState.jr = jr;
  __contentState.Mr = Mr;
  __contentState.Nr = Nr;
  __contentState.Pr = Pr;
  __contentState.Fr = Fr;
  __contentState.Ir = Ir;
  __contentState.Lr = Lr;
  __contentState.Rr = Rr;
  __contentState.Vr = Vr;
  __contentState.Ur = Ur;
  __contentState.Wr = Wr;
  __contentState.Gr = Gr;
  __contentState.Kr = Kr;
  __contentState.qr = qr;
  __contentState.Xr = Xr;
  __contentState.Zr = Zr;
  __contentState.Qr = Qr;
  __contentState.$r = $r;
  __contentState.ei = ei;
  __contentState.ti = ti;
  __contentState.si = si;
  __contentState.li = li;
  __contentState.ui = ui;
  __contentState.di = di;
  __contentState.fi = fi;
  __contentState.G = G;
  __contentState.gi = gi;
  __contentState._i = _i;
  __contentState.xi = xi;
  __contentState.Si = Si;
  __contentState.Ci = Ci;
  __contentState.wi = wi;
  __contentState.Ti = Ti;
  __contentState.Ei = Ei;
  __contentState.Di = Di;
  __contentState.Oi = Oi;
  __contentState.Fi = Fi;
  __contentState.Ii = Ii;
  __contentState.Li = Li;
  __contentState.Ri = Ri;
  __contentState.zi = zi;
  __contentState.Bi = Bi;
  __contentState.Vi = Vi;
  __contentState.Gi = Gi;
  __contentState.Ki = Ki;
  __contentState.qi = qi;
  __contentState.Ji = Ji;
  __contentState.Yi = Yi;
  __contentState.Xi = Xi;
  __contentState.Zi = Zi;
  __contentState.Qi = Qi;
  __contentState.$i = $i;
  __contentState.ea = ea;
  __contentState.ta = ta;
  __contentState.la = la;
  __contentState.ua = ua;
  __contentState.da = da;
  __contentState.fa = fa;
  __contentState.pa = pa;
  __contentState.ma = ma;
  __contentState.Ca = Ca;
  __contentState.wa = wa;
  __contentState.Ta = Ta;
  __contentState.Ea = Ea;
  __contentState.Da = Da;
  __contentState.Oa = Oa;
  __contentState.ka = ka;
  __contentState.Aa = Aa;
  __contentState.ja = ja;
  __contentState.Ma = Ma;
  __contentState.Fa = Fa;
  __contentState.Ia = Ia;
  __contentState.La = La;
  __contentState.Ra = Ra;
  __contentState.za = za;
  __contentState.Ba = Ba;
  __contentState.Ha = Ha;
  __contentState.Wa = Wa;
  __contentState.Ga = Ga;
  __contentState.to = to;
  __contentState.no = no;
  __contentState.ro = ro;
  __contentState.io = io;
  __contentState.ao = ao;
  __contentState.oo = oo;
  __contentState.so = so;
  __contentState.co = co;
  __contentState.lo = lo;
  __contentState.uo = uo;
  __contentState.fo = fo;
  __contentState.po = po;
  __contentState.go = go;
  __contentState._o = _o;
  __contentState.vo = vo;
  __contentState.yo = yo;
  __contentState.bo = bo;
  __contentState.xo = xo;
  __contentState.So = So;
  __contentState.Co = Co;
  __contentState.Bu = Bu;
  __contentState.Vu = Vu;
  __contentState.Hu = Hu;
  __contentState.Uu = Uu;
  __contentState.Wu = Wu;
  __contentState.Gu = Gu;
  __contentState.qu = qu;
  __contentState.Ju = Ju;
  __contentState.Zu = Zu;
  __contentState.Qu = Qu;
  __contentState.$u = $u;
  __contentState.md = md;
  __contentState.hd = hd;
  __contentState.gd = gd;
  __contentState.vd = vd;
  __contentState.yd = yd;
  __contentState.bd = bd;
  __contentState.xd = xd;
  __contentState.Sd = Sd;
  __contentState.Cd = Cd;
  __contentState.wd = wd;
  __contentState.Td = Td;
  __contentState.Ed = Ed;
  __contentState.Dd = Dd;
  __contentState.Od = Od;
  __contentState.kd = kd;
  __contentState.Ad = Ad;
  __contentState.jd = jd;
  __contentState.Md = Md;
  __contentState.Nd = Nd;
  __contentState.Pd = Pd;
  __contentState.Fd = Fd;
  __contentState.Id = Id;
  __contentState.Ld = Ld;
  __contentState.Vd = Vd;
  __contentState.Hd = Hd;
  __contentState.Ud = Ud;
  __contentState.Wd = Wd;
  __contentState.Gd = Gd;
  __contentState.Kd = Kd;
  __contentState.qd = qd;
  __contentState.Jd = Jd;
  __contentState.Yd = Yd;
  __contentState.Qd = Qd;
  __contentState.$d = $d;
  __contentState.ef = ef;
  __contentState.tf = tf;
  __contentState.nf = nf;
  __contentState.rf = rf;
  __contentState.af = af;
  __contentState.of = of;
  __contentState.sf = sf;
  __contentState.cf = cf;
  __contentState.lf = lf;
  __contentState.uf = uf;
  __contentState.df = df;
  __contentState.ff = ff;
  __contentState.pf = pf;
  __contentState.mf = mf;
  __contentState.hf = hf;
  __contentState.gf = gf;
  __contentState._f = _f;
  __contentState.vf = vf;
  __contentState.yf = yf;
  __contentState.Df = Df;
  __contentState.Of = Of;
  __contentState.kf = kf;
  __contentState.Af = Af;
  __contentState.jf = jf;
  __contentState.Mf = Mf;
  __contentState.Nf = Nf;
  __contentState.Pf = Pf;
  __contentState.Ff = Ff;
  __contentState.Lf = Lf;
  __contentState.zf = zf;
  __contentState.Bf = Bf;
  __contentState.Vf = Vf;
  __contentState.Hf = Hf;
  __contentState.Uf = Uf;
  __contentState.Wf = Wf;
  __contentState.Gf = Gf;
  __contentState.Kf = Kf;
  __contentState.qf = qf;
  __contentState.Jf = Jf;
  __contentState.Yf = Yf;
  __contentState.Xf = Xf;
  __contentState.Zf = Zf;
  __contentState.Qf = Qf;
  __contentState.ap = ap;
  __contentState.op = op;
  __contentState.sp = sp;
  __contentState.cp = cp;
  __contentState.lp = lp;
  __contentState.up = up;
  __contentState.dp = dp;
  __contentState.fp = fp;
  __contentState.pp = pp;
  __contentState.mp = mp;
  __contentState.hp = hp;
  __contentState.gp = gp;
  __contentState.vp = vp;
  __contentState.Cp = Cp;
  __contentState.wp = wp;
  __contentState.Tp = Tp;
  __contentState.Ep = Ep;
  __contentState.Dp = Dp;
  __contentState.Op = Op;
  __contentState.kp = kp;
  __contentState.qp = qp;
  __contentState.Jp = Jp;
  __contentState.Xp = Xp;
  __contentState.Zp = Zp;
  __contentState.Qp = Qp;
  __contentState.nm = nm;
  __contentState.rm = rm;
  __contentState.im = im;
  __contentState.am = am;
  __contentState.om = om;
  __contentState.ah = ah;
  __contentState.oh = oh;
  __contentState.ch = ch;
  __contentState.lh = lh;
  __contentState.uh = uh;
  __contentState.dh = dh;
  __contentState.fh = fh;
  __contentState.ph = ph;
  __contentState.mh = mh;
  __contentState.hh = hh;
  __contentState.detectPageLogin = detectPageLogin;
  __contentState.readLoginOptions = readLoginOptions;
  __contentState.readLoginSnapshot = readLoginSnapshot;
  __contentState.readLoginState = readLoginState;
  __contentState.hasVisibleLogoutControl = hasVisibleLogoutControl;
  __contentState.describeLoginControl = describeLoginControl;
  __contentState.findSelectedLoginControl = findSelectedLoginControl;
  __contentState.collectLoginEntries = collectLoginEntries;
  return {
    state: __contentState,
    api: {
      runTask(task, callbacks) {
        return (0, __contentScope.hh)(task, callbacks);
      },
      compareIdentity(...args) {
        return (0, __contentScope.Zi)(...args);
      },
      readIdentity(...args) {
        return (0, __contentScope.qi)(...args);
      },
      detectPageLogin(...args) {
        return (0, __contentScope.detectPageLogin)(...args);
      },
      readLoginOptions(...args) {
        return (0, __contentScope.readLoginOptions)(...args);
      },
      readLoginState(...args) {
        return (0, __contentScope.readLoginState)(...args);
      },
      findSelectedLoginControl(...args) {
        return (0, __contentScope.findSelectedLoginControl)(...args);
      },
      readPageIdentity() {
        return (0, __contentScope.Bi)();
      },
      install() {
        return __contentScope.Gg.main();
      },
    },
    initializers: [
      {
        order: 0,
        run() {
          __contentState.r = [
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
        },
      },
      {
        order: 1,
        run() {
          __contentState.i = [
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
        },
      },
      {
        order: 2,
        run() {
          __contentState.a = [
            `input[autocomplete="current-password"]`,
            `#password`,
            `input[name="password"]`,
            `input[type="password"]`,
          ];
        },
      },
      {
        order: 3,
        run() {
          [
            `button:has(> span:only-child)`,
            `.checkin-btn`,
            `#checkin`,
            `[data-testid="checkin"]`,
          ].join(`, `);
        },
      },
      {
        order: 4,
        run() {
          __contentState.o = {
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
        },
      },
      {
        order: 5,
        run() {
          __contentState.s = {
            NEW_API: `new-api`,
            SUB2API: `sub2api`,
            VO_API_V2: `voapi-v2`,
            UNSUPPORTED: `unsupported`,
          };
        },
      },
      {
        order: 6,
        run() {
          ([...__contentScope.r],
            __contentScope.o.NEW_API,
            __contentScope.s.NEW_API,
            __contentScope.o.NEW_API);
        },
      },
      {
        order: 7,
        run() {
          __contentState.c = {
            id: `kid1412`,
            label: `1412's API`,
            siteType: __contentScope.o.NEW_API,
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
              closeModalSelectors: __contentScope.r,
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
                siteType: __contentScope.o.NEW_API,
                family: __contentScope.s.NEW_API,
                checkinPath: `/profile`,
                checkin: {
                  pathPatterns: [`/profile*`],
                  titleWords: [`每日签到`],
                },
                quotaPerUnit: 5e5,
              },
            },
          };
        },
      },
      {
        order: 8,
        run() {
          (__contentScope.o.NEW_API,
            __contentScope.o.NEW_API,
            __contentScope.s.NEW_API,
            __contentScope.o.NEW_API,
            __contentScope.i.join(`, `),
            __contentScope.a.join(`, `),
            __contentScope.o.NEW_API,
            __contentScope.s.NEW_API);
        },
      },
      {
        order: 9,
        run() {
          __contentState.l = {
            id: `futurehub`,
            label: `Future Hub`,
            siteType: __contentScope.o.NEW_API,
            fingerprints: { hostnames: [`api.futureppo.top`] },
            preset: {
              selectors: {
                username: __contentScope.i.join(`, `),
                password: __contentScope.a.join(`, `),
                submit: `button[type="submit"], button.semi-button-primary`,
              },
              loginMethod: `auto`,
              closeModalSelectors: __contentScope.r,
              checkin: {
                method: `button`,
                url: `/console/personal`,
                buttonSelector: `button >> text=立即签到`,
                alreadySelector: `button >> text=今日已签到`,
                alreadyText: [`今日已签到`],
              },
              adapter: {
                siteType: __contentScope.o.NEW_API,
                family: __contentScope.s.NEW_API,
                checkinPath: `/console/personal`,
                checkin: {
                  pathPatterns: [`/console/personal*`],
                  titleWords: [`每日签到`],
                },
                quotaPerUnit: 5e5,
              },
            },
          };
        },
      },
      {
        order: 10,
        run() {
          __contentState.u = {
            id: `anyrouter`,
            label: `AnyRouter（登录即签到）`,
            siteType: __contentScope.o.ANYROUTER,
            fingerprints: {
              hostnames: [`anyrouter.top`],
              titleWords: [`any router`, `anyrouter`],
            },
            preset: {
              selectors: {
                username: __contentScope.i.join(`, `),
                password: __contentScope.a.join(`, `),
                submit: `button[type="submit"], button.semi-button-primary`,
              },
              loginMethod: `auto`,
              closeModalSelectors: __contentScope.r,
              checkin: { method: `none` },
              adapter: {
                siteType: __contentScope.o.ANYROUTER,
                family: __contentScope.s.NEW_API,
                checkinPath: ``,
                quotaPerUnit: 5e5,
              },
            },
          };
        },
      },
      {
        order: 11,
        run() {
          (__contentScope.o.SUB2API,
            __contentScope.s.SUB2API,
            __contentScope.o.SUB2API,
            __contentScope.o.SUB2API,
            __contentScope.o.SUB2API,
            __contentScope.s.SUB2API,
            __contentScope.o.SUB2API,
            [
              `input[name="username"]`,
              `input[name="email"]`,
              `input[autocomplete="username"]`,
              `input[autocomplete="email"]`,
              `input[type="email"]`,
              `input[type="text"]`,
            ].join(`, `),
            [
              `.daily-checkin-page-action button:not([disabled])`,
              `.daily-checkin-action button:not([disabled])`,
              `button >> text=立即签到`,
              `button >> text=签到`,
              `input[type="submit"][value*="签到"]`,
              `input[type="button"][value*="签到"]`,
            ].join(`, `),
            [
              `.daily-checkin-page-action .daily-checkin-done`,
              `.daily-checkin-done`,
              `button >> text=今天已签到`,
              `button >> text=今日已签到`,
              `button >> text=已完成`,
              `input[value="今天已签到"]`,
              `input[value="今日已签到"]`,
              `input[value="已完成"]`,
            ].join(`, `),
            __contentScope.o.UNKNOWN,
            __contentScope.s.UNSUPPORTED,
            __contentScope.o.UNKNOWN);
        },
      },
      {
        order: 12,
        run() {
          __contentState.d = {
            id: `new-api-next`,
            label: `已识别 new-api 中转站（新版界面）`,
            siteType: __contentScope.o.NEW_API,
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
              closeModalSelectors: __contentScope.r,
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
                siteType: __contentScope.o.NEW_API,
                family: __contentScope.s.NEW_API,
                checkinPath: `/profile`,
                checkin: {
                  pathPatterns: [`/profile*`],
                  titleWords: [`每日签到`],
                },
                quotaPerUnit: 5e5,
              },
            },
          };
        },
      },
      {
        order: 13,
        run() {
          (__contentScope.d.preset,
            { ...__contentScope.d.preset },
            { ...__contentScope.d.preset.selectors },
            [...__contentScope.d.preset.closeModalSelectors],
            { ...__contentScope.d.preset.checkin },
            [
              `button >> text=立即签到`,
              `button >> text=已签到`,
              `button >> text=Check in now`,
              `button >> text=Checked in`,
            ].join(`, `),
            [
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
            [
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
            [
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
            [
              `button >> text=立即签到`,
              `button >> text=已签到`,
              `button >> text=Check in now`,
              `button >> text=Checked in`,
            ].join(`, `),
            { ...__contentScope.d.preset.adapter },
            { ...__contentScope.d.preset.adapter?.checkin },
            [...(__contentScope.d.preset.adapter?.checkin?.pathPatterns ?? [])],
            [...(__contentScope.d.preset.adapter?.checkin?.titleWords ?? [])],
            __contentScope.o.NEW_API,
            __contentScope.o.NEW_API,
            __contentScope.s.NEW_API,
            __contentScope.o.NEW_API,
            __contentScope.i.join(`, `),
            __contentScope.a.join(`, `),
            __contentScope.o.NEW_API,
            __contentScope.s.NEW_API,
            __contentScope.o.NEW_API,
            [
              `header a[href="/login"]`,
              `nav a[href="/login"]`,
              `a[href="/login"]`,
              `header button >> text=登录`,
              `nav button >> text=登录`,
              `header a >> text=登录`,
              `nav a >> text=登录`,
            ].join(`, `),
            __contentScope.o.UNKNOWN,
            __contentScope.s.UNSUPPORTED,
            __contentScope.o.UNKNOWN,
            __contentScope.o.SUB2API,
            __contentScope.o.SUB2API,
            __contentScope.s.SUB2API,
            __contentScope.o.NEW_API,
            __contentScope.o.NEW_API,
            __contentScope.s.NEW_API);
        },
      },
      {
        order: 33,
        run() {
          __contentState.tt = [
            `签到成功`,
            `打卡成功`,
            `领取成功`,
            `奖励到账`,
            `已生效`,
            `check-in success`,
            `checked in successfully`,
          ];
        },
      },
      {
        order: 34,
        run() {
          __contentState.F = [
            `已签到`,
            `已经签到`,
            `今日已`,
            `重复签到`,
            `already checked`,
            `already signed`,
            `已打卡`,
            `已领取`,
          ];
        },
      },
      {
        order: 35,
        run() {
          __contentState.nt = [`抽奖成功`, `抽奖完成`, `开奖成功`, `draw successful`];
        },
      },
      {
        order: 36,
        run() {
          __contentState.rt = [
            `今日梦火抽签次数已耗尽`,
            `This draw is complete`,
            `You have already drawn today`,
          ];
        },
      },
      {
        order: 37,
        run() {
          __contentState.it = (0, __contentScope.P)(/抽奖|抽签|翻牌|\b(?:start\s+)?draw\b/i);
        },
      },
      {
        order: 38,
        run() {
          __contentState.at = [
            `签到失败`,
            `打卡失败`,
            `领取失败`,
            `签到时发生错误`,
            `签到出错`,
            `check-in failed`,
            `checkin failed`,
            `sign-in failed`,
            `claim failed`,
          ];
        },
      },
      {
        order: 39,
        run() {
          __contentState.st = /(?:^|\/)(?:check-?in|daily-check-?in|sign-?in|attendance)(?:\/|$)/i;
        },
      },
      {
        order: 40,
        run() {
          __contentState.ct = (0, __contentScope.P)(
            /(?:签到|打卡|领取|check[\s-]?in|sign[\s-]?in|claim|daily\s*(?:bonus|reward|credit)|每日(?:奖励|福利|额度))/i,
          );
        },
      },
      {
        order: 41,
        run() {
          __contentState.lt = (0, __contentScope.P)(
            /(?:历史|记录|规则|日历|说明|明细|详情|history|calendar|rule|record|detail)/i,
          );
        },
      },
      {
        order: 42,
        run() {
          __contentState.ut = /^(?:disabled|is-disabled|[\w-]+-disabled)$/i;
        },
      },
      {
        order: 43,
        run() {
          __contentState.ft = [
            `dialog[open]`,
            `[role="dialog"]`,
            `[aria-modal="true"]`,
            `.semi-modal-mask`,
            `.semi-modal-wrap`,
            `.semi-modal`,
            `.ant-modal-mask`,
            `.ant-modal-wrap`,
            `.ant-modal`,
            `.MuiDialog-root`,
            `.modal`,
          ];
        },
      },
      {
        order: 44,
        run() {
          __contentState.pt = __contentScope.ft.join(`, `);
        },
      },
      {
        order: 45,
        run() {
          __contentState.mt =
            /(?:关闭公告|今日关闭|关闭通知|标记已读|不再提示|不再显示|我已知悉|已知悉|我已了解|已了解|我已阅读|已阅读并同意|我知道了|知道了|稍后再说|以后再说|mark(?:ed)?\s+(?:as\s+)?read|don'?t show|got it|dismiss)/i;
        },
      },
      {
        order: 46,
        run() {
          __contentState.gt = new Set([
            `关闭`,
            `关掉`,
            `关闭窗口`,
            `关闭弹窗`,
            `关闭对话框`,
            `close`,
            `closedialog`,
            `closemodal`,
            `closewindow`,
            `closepopup`,
            `×`,
            `✕`,
            `✖`,
            `╳`,
            `x`,
          ]);
        },
      },
      {
        order: 47,
        run() {
          __contentState.bt = `textarea, input[type="text"], input:not([type]), [contenteditable="true"]`;
        },
      },
      {
        order: 48,
        run() {
          __contentState.Tt = 2500;
        },
      },
      {
        order: 49,
        run() {
          __contentState.Et = 6e3;
        },
      },
      {
        order: 50,
        run() {
          __contentState.Dt = 1e3;
        },
      },
      {
        order: 51,
        run() {
          __contentState.Ot = 250;
        },
      },
      {
        order: 52,
        run() {
          __contentState.kt = [
            `.semi-modal-mask`,
            `.ant-modal-mask`,
            `.ant-modal-wrap`,
            `.modal-backdrop`,
            `[class*="overlay" i][class*="modal" i]`,
            `[class*="mask" i][class*="modal" i]`,
            `.MuiBackdrop-root`,
            `dialog[open]`,
            `[role="dialog"]`,
            `[aria-modal="true"]`,
            `[data-slot="dialog-overlay"]`,
            `[data-slot="dialog-content"]`,
            `[class~="fixed"][class~="inset-0"]`,
          ];
        },
      },
      {
        order: 53,
        run() {
          __contentState.At = [`dialog[open]`, `[aria-modal="true"]`];
        },
      },
      {
        order: 54,
        run() {
          __contentState.jt = __contentScope.kt.join(`, `);
        },
      },
      {
        order: 55,
        run() {
          __contentState.Mt = [
            `dialog[open]`,
            `[role="dialog"]`,
            `[aria-modal="true"]`,
            `[data-slot="dialog-content"]`,
            `.semi-modal`,
            `.ant-modal`,
            `.MuiDialog-paper`,
            `.modal`,
          ].join(`, `);
        },
      },
      {
        order: 56,
        run() {
          __contentState.Nt = [
            `.semi-modal-mask`,
            `.ant-modal-mask`,
            `.modal-backdrop`,
            `.MuiBackdrop-root`,
            `[data-slot="dialog-overlay"]`,
            `[class*="overlay" i][class*="modal" i]`,
            `[class*="mask" i][class*="modal" i]`,
            `[class~="fixed"][class~="inset-0"]`,
          ].join(`, `);
        },
      },
      {
        order: 57,
        run() {
          __contentState.Pt = `${__contentScope.Mt}, .semi-modal-wrap, .ant-modal-wrap, .MuiDialog-container`;
        },
      },
      {
        order: 58,
        run() {
          __contentState.Ut = `button, [role="button"], input[type="button"], input[type="submit"], a[href="#"], a:not([href]), [onclick]`;
        },
      },
      {
        order: 59,
        run() {
          __contentState.$t = [
            `input[autocomplete="one-time-code"]`,
            `input[name*="otp" i]`,
            `input[id*="otp" i]`,
            `input[name*="totp" i]`,
            `input[id*="totp" i]`,
            `input[name*="mfa" i]`,
            `input[id*="mfa" i]`,
            `input[name*="2fa" i]`,
            `input[id*="2fa" i]`,
          ].join(`, `);
        },
      },
      {
        order: 60,
        run() {
          __contentState.en =
            /(?:^|[/_-])(login|sign-?in|auth|verify|verification|challenge|captcha|2fa|mfa|otp|error|forbidden|suspended?|banned?)(?:[/_.-]|$)/i;
        },
      },
      {
        order: 61,
        run() {
          __contentState.nn =
            /(?:用户名|用户|账号|账户|邮箱|邮件|user\s*name|account|e-?mail|login)/i;
        },
      },
      {
        order: 62,
        run() {
          __contentState.rn =
            /(?:验证码|校验码|动态码|搜索|手机号|captcha|verify|verification|otp|totp|mfa|2fa|search)/i;
        },
      },
      {
        order: 63,
        run() {
          __contentState.an =
            /(?:api[-_\s]*(?:endpoint|url)|endpoint[-_\s]*(?:url)?|base[-_\s]*url|proxy[-_\s]*(?:url|address)|request[-_\s]*url|api\s*地址|接口(?:地址|配置)|请求地址|中转地址|代理地址|常用工具)/i;
        },
      },
      {
        order: 64,
        run() {
          __contentState.on = /(?:密码|口令|pass\s*word|passwd|passcode)/i;
        },
      },
      {
        order: 65,
        run() {
          __contentState.sn =
            /(?:新密码|确认密码|重复密码|设置密码|new\s*password|confirm\s*password|repeat\s*password|create\s*password)/i;
        },
      },
      {
        order: 66,
        run() {
          __contentState.cn = /(?:登录|登陆|sign\s*in|log\s*in)/i;
        },
      },
      {
        order: 67,
        run() {
          __contentState.ln =
            /(?:注册|创建账号|加入|sign\s*up|register|create\s*(?:an?\s*)?account|join)/i;
        },
      },
      {
        order: 68,
        run() {
          __contentState.un =
            /^(?:登录|登陆|立即登录|继续登录|登\s*录|log\s*in|sign\s*in|continue)$/i;
        },
      },
      {
        order: 69,
        run() {
          __contentState.dn = /(?:继续|下一步|下一页|确认|提交|continue|next|proceed|submit)/i;
        },
      },
      {
        order: 70,
        run() {
          __contentState.fn =
            /(?:注册|忘记|找回|验证码|github|google|linuxdo|oauth|sso|passkey|register|sign\s*up|forgot|captcha)/i;
        },
      },
      {
        order: 71,
        run() {
          __contentState.pn =
            /(?:同意|接受|agree|accept).*(?:协议|条款|隐私|terms?|privacy)|(?:协议|条款|隐私|terms?|privacy).*(?:同意|接受|agree|accept)/i;
        },
      },
      {
        order: 72,
        run() {
          __contentState.mn = /(?:captcha|turnstile|recaptcha|hcaptcha|人机|真人|验证码|安全验证)/i;
        },
      },
      {
        order: 73,
        run() {
          __contentState.hn = /(?:github|git\s*hub)/i;
        },
      },
      {
        order: 74,
        run() {
          __contentState.gn =
            /(?:linuxdo|linux\s*do|google|discord|telegram|microsoft|github|git\s*hub)/i;
        },
      },
      {
        order: 75,
        run() {
          __contentState._n = /(?:passkey|webauthn|security\s*key|通行密钥|安全密钥|生物识别)/i;
        },
      },
      {
        order: 76,
        run() {
          __contentState.vn =
            /(?:oauth|sso|openid|oidc|passkey|webauthn|通行密钥|安全密钥|生物识别|第三方|授权|使用.{0,16}(?:继续|登录|登陆)|通过.{0,16}(?:继续|登录|登陆)|用.{0,16}(?:继续|登录|登陆)|continue.{0,16}with|sign\s*in.{0,16}with|log\s*in.{0,16}with)/i;
        },
      },
      {
        order: 77,
        run() {
          __contentState.yn =
            /(?:注册|忘记|找回|重置|验证码|校验码|动态码|搜索|刷新|发送|获取|register|sign\s*up|forgot|reset|captcha|verify|verification|otp|totp|mfa|2fa|search|send)/i;
        },
      },
      {
        order: 78,
        run() {
          __contentState.Pn = [
            `邮箱或用户名`,
            `账号密码`,
            `密码登录`,
            `邮箱登录`,
            `账号登录`,
            `用户名登录`,
          ];
        },
      },
      {
        order: 79,
        run() {
          __contentState.Fn = [
            `github`,
            `linuxdo`,
            `linux do`,
            `google`,
            `passkey`,
            `apple`,
            `wechat`,
            `微信`,
            `qq`,
            `telegram`,
            `oauth`,
          ];
        },
      },
      {
        order: 80,
        run() {
          __contentState.Hn =
            /(?:登录|账号|账户|用户名|邮箱|密码|凭据).{0,24}(?:失败|错误|无效|不正确|不存在|已锁定|已过期|被拒绝)|(?:failed|error|invalid|incorrect|wrong|denied|expired|locked).{0,24}(?:login|account|user|email|password|credential|authentication|authorization)|(?:login|sign[\s-]?in|password|credential|authentication|authorization|oauth).{0,24}(?:failed|failure|error|invalid|incorrect|wrong|denied|expired|locked|cancelled|canceled)/i;
        },
      },
      {
        order: 81,
        run() {
          __contentState.or = [
            `同意并继续`,
            `同意并登录`,
            `同意并进入`,
            `我已阅读并同意`,
            `接受并继续`,
            `agree and continue`,
            `accept and continue`,
          ];
        },
      },
      {
        order: 82,
        run() {
          __contentState.sr = /条款|协议|服务条款|条款更新|terms|agreement|policy|隐私/i;
        },
      },
      {
        order: 83,
        run() {
          __contentState.cr = /拒绝|不同意|取消|decline|cancel|reject/i;
        },
      },
      {
        order: 84,
        run() {
          __contentState.Sr = `abcdefghijklmnopqrstuvwxyz`;
        },
      },
      {
        order: 85,
        run() {
          __contentState.Cr = 10;
        },
      },
      {
        order: 86,
        run() {
          __contentState.wr = 128;
        },
      },
      {
        order: 87,
        run() {
          __contentState.zr = {
            'New-API-User': __contentScope.o.NEW_API,
            'Veloera-User': __contentScope.o.VELOERA,
            'X-Api-User': __contentScope.o.V_API,
            'voapi-user': __contentScope.o.VO_API,
            'User-id': __contentScope.o.SUPER_API,
            'Rix-Api-User': __contentScope.o.RIX_API,
            'neo-api-user': __contentScope.o.NEO_API,
          };
        },
      },
      {
        order: 88,
        run() {
          __contentState.Br = Object.keys(__contentScope.zr);
        },
      },
      {
        order: 89,
        run() {
          __contentState.Hr = 5e5;
        },
      },
      {
        order: 90,
        run() {
          __contentState.Jr = {
            [__contentScope.s.NEW_API]: { checkinPath: `/console/personal` },
            [__contentScope.s.SUB2API]: { checkinPath: `/check-in` },
            [__contentScope.s.VO_API_V2]: {},
            [__contentScope.s.UNSUPPORTED]: {},
          };
        },
      },
      {
        order: 91,
        run() {
          __contentState.Yr = new Set([
            __contentScope.o.NEW_API,
            __contentScope.o.ONE_API,
            __contentScope.o.VELOERA,
            __contentScope.o.ONE_HUB,
            __contentScope.o.DONE_HUB,
            __contentScope.o.V_API,
            __contentScope.o.VO_API,
            __contentScope.o.SUPER_API,
            __contentScope.o.RIX_API,
            __contentScope.o.NEO_API,
            __contentScope.o.ANYROUTER,
          ]);
        },
      },
      {
        order: 92,
        run() {
          __contentState.ni = 6e4;
        },
      },
      {
        order: 93,
        run() {
          __contentState.ri = 2e4;
        },
      },
      {
        order: 94,
        run() {
          __contentState.ii = 4e3;
        },
      },
      {
        order: 95,
        run() {
          __contentState.ai = new Map();
          __contentState.identityProbeHints = new Map();
        },
      },
      {
        order: 96,
        run() {
          __contentState.oi = new Map();
        },
      },
      {
        order: 97,
        run() {
          __contentState.ci = [
            [`data`, `access_token`],
            [`access_token`],
            [`data`, `accessToken`],
            [`accessToken`],
          ];
        },
      },
      {
        order: 98,
        run() {
          __contentState.pi = {
            maxInputBytes: 1048576,
            maxDepth: 64,
            maxContainerLength: 65536,
            maxTextLength: 262144,
            maxTotalItems: 1e5,
          };
        },
      },
      {
        order: 99,
        run() {
          __contentState.mi = 2 ** 53 - 1;
        },
      },
      {
        order: 100,
        run() {
          __contentState.hi = class {
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
              (e > this.limits.maxDepth && (0, __contentScope.G)(`超出深度上限`),
                (this.items += 1),
                this.items > this.limits.maxTotalItems &&
                  (0, __contentScope.G)(`超出解码总量上限`));
              let t = this.readByte(),
                n = t >> 5,
                r = t & 31;
              if (
                (r === 31 && (0, __contentScope.G)(`不支持不定长度`),
                r > 27 && (0, __contentScope.G)(`非法的类型字节（保留的 additional info）`),
                n === 7)
              )
                return this.readSimpleOrFloat(r);
              let i = r < 24 ? r : this.readUintArgument(r);
              switch (n) {
                case 0:
                  return (i > __contentScope.mi && (0, __contentScope.G)(`整数超出安全范围`), i);
                case 1:
                  return (
                    i >= __contentScope.mi && (0, __contentScope.G)(`整数超出安全范围`),
                    -1 - i
                  );
                case 2:
                  (0, __contentScope.G)(`不支持字节串`);
                case 3:
                  return this.readText(i);
                case 4:
                  return this.readArray(i, e);
                case 5:
                  return this.readMap(i, e);
                default:
                  (0, __contentScope.G)(`不支持标签`);
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
                  return (0, __contentScope.gi)(this.readRaw16());
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
                  (0, __contentScope.G)(`不支持的简单值`);
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
              e > this.limits.maxTextLength && (0, __contentScope.G)(`超出文本长度上限`);
              let t = this.readBytes(e);
              try {
                return new TextDecoder(`utf-8`, { fatal: !0 }).decode(t);
              } catch {
                (0, __contentScope.G)(`文本不是合法 UTF-8`);
              }
            }
            checkContainerLength(e) {
              (e > this.limits.maxContainerLength && (0, __contentScope.G)(`超出容器长度上限`),
                e > this.bytes.length - this.pos &&
                  (0, __contentScope.G)(`数据不完整（容器长度超出剩余字节）`));
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
                  return (n > __contentScope.mi && (0, __contentScope.G)(`整数超出安全范围`), n);
                }
                default:
                  (0, __contentScope.G)(`非法的类型字节（保留的 additional info）`);
              }
            }
            readByte() {
              return (
                this.pos >= this.bytes.length && (0, __contentScope.G)(`数据不完整`),
                this.bytes[this.pos++]
              );
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
              e > this.bytes.length - this.pos && (0, __contentScope.G)(`数据不完整`);
              let t = this.bytes.subarray(this.pos, this.pos + e);
              return ((this.pos += e), t);
            }
          };
        },
      },
      {
        order: 101,
        run() {
          __contentState.vi = [`/api/user/self`, `/api/user/info`, `/api/v1/auth/me`];
        },
      },
      {
        order: 102,
        run() {
          __contentState.yi = 4e3;
        },
      },
      {
        order: 103,
        run() {
          __contentState.bi = 4e3;
        },
      },
      {
        order: 104,
        run() {
          __contentState.ki =
            /(邀请|受邀|推荐|推广|上级|下级|下线|团队|排行|榜|赞助|作者|客服|管理员|中奖|获奖|公告|invit|referr|sponsor|winner|leaderboard|announcement)/i;
        },
      },
      {
        order: 105,
        run() {
          __contentState.Ai =
            /中奖(?:名单|记录|用户)|获奖(?:名单|记录)|排行榜|排名榜|用户列表|成员列表|历史记录|公告|\b(?:winners?|leaderboard|rankings?|draw history|announcements?)\b/i;
        },
      },
      {
        order: 106,
        run() {
          __contentState.ji =
            /^(?:个人资料|个人信息|账户信息|账号信息|我的账户|我的账号|我的资料|profile|my account|account (?:info(?:rmation)?|details))\s*[:：]?$/i;
        },
      },
      {
        order: 107,
        run() {
          __contentState.Mi =
            /^(?:当前(?:登录)?(?:账号|账户|用户)|我的(?:账号|账户|邮箱))\s*[:：]?/;
        },
      },
      {
        order: 108,
        run() {
          __contentState.Ni =
            /(?<![A-Za-z])(?:用户\s*ID|User\s*ID|UID)\s*[:：#]?\s*\d|当前(?:登录)?(?:账号|账户|用户)|用户名|登录名|账[号户]|邮箱|电子邮件|\b(?:e-?mail|username|account)\b|欢迎回来|welcome back/i;
        },
      },
      {
        order: 109,
        run() {
          __contentState.Pi =
            /退出登录|退出账号|注销登录|个人资料|账户设置|账号设置|\b(?:log\s*out|sign\s*out|my account|account settings|profile)\b/i;
        },
      },
      {
        order: 110,
        run() {
          __contentState.Hi = 4;
        },
      },
      {
        order: 111,
        run() {
          __contentState.Ui = /[A-Za-z0-9._+@-]/;
        },
      },
      {
        order: 112,
        run() {
          __contentState.Wi = /(?<![\w.+-])([\w.+-]*)\*+([\w.+-]*)@([\w-]+\.[\w.-]+)/g;
        },
      },
      {
        order: 113,
        run() {
          __contentState.na = [
            /(?:当前余额|账户余额|剩余额度|可用余额|余额)\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i,
            /\bbalance\b\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i,
          ];
        },
      },
      {
        order: 114,
        run() {
          __contentState.ra = /(?:^|\n)\s*饼友\s*[·•・]\s*积分\s*[:：]?\s*(-?\d[\d,]*(?:\.\d+)?)/im;
        },
      },
      {
        order: 115,
        run() {
          __contentState.ia = /(?:^|\n)\s*当前积分\s*[:：]?\s*(-?\d[\d,]*(?:\.\d+)?)/im;
        },
      },
      {
        order: 116,
        run() {
          __contentState.aa = /每日签到奖励/g;
        },
      },
      {
        order: 117,
        run() {
          __contentState.oa = /每日签到奖励\s*[+＋]\s*\d[\d,]*(?:\.\d+)?/;
        },
      },
      {
        order: 118,
        run() {
          __contentState.sa =
            /((?:19|20)\d{2})\s*[\/\-.年]\s*(\d{1,2})\s*[\/\-.月]\s*(\d{1,2})\s*日?/;
        },
      },
      {
        order: 119,
        run() {
          __contentState.ca = `www.hvoy.ai`;
        },
      },
      {
        order: 120,
        run() {
          __contentState.ha = [
            {
              pattern:
                /(?:今天|今日|today)[^\n]{0,24}?\+\s*((?:(?:[$＄¥￥]|(?:usd|cny|rmb)\s*)\s*)?\d[\d,]*(?:\.\d+)?)/i,
            },
            {
              pattern:
                /(?:签到|check[\s-]?in)[^\n]{0,24}?\+\s*((?:(?:[$＄¥￥]|(?:usd|cny|rmb)\s*)\s*)?\d[\d,]*(?:\.\d+)?)/i,
            },
            {
              pattern:
                /(?:今天|今日)\s*可得\s*[:：]?\s*((?:(?:[$＄¥￥]|(?:usd|cny|rmb)\s*)\s*)?\d[\d,]*(?:\.\d+)?)/i,
              requiresCheckedIn: !0,
            },
            {
              pattern:
                /(?:恭喜(?:获取|获得)|签到成功[^\n]{0,24}?(?:已)?获得)\s*(\d[\d,]*(?:\.\d+)?\s*积分)/i,
            },
          ];
        },
      },
      {
        order: 121,
        run() {
          __contentState.ga =
            /(?:套餐|价格|售价|订阅|档位|plan|price|pricing)[^\n]{0,12}?\+?\s*[$＄¥￥]?\s*\d[\d,]*(?:\.\d+)?(?:\s*\/\s*(?:月|年|mo|mo\.|month|year))?/gi;
        },
      },
      {
        order: 122,
        run() {
          __contentState._a =
            /(?:今天|今日)\s*已签到|已签到\s*(?:今天|今日)|\bchecked\s+in\s+today\b/i;
        },
      },
      {
        order: 123,
        run() {
          __contentState.va = /(?:每日签到|签到|check[\s-]?in|today\s+reward|(?:今天|今日)\s*\+)/i;
        },
      },
      {
        order: 124,
        run() {
          __contentState.ya = 2e4;
        },
      },
      {
        order: 125,
        run() {
          __contentState.ba = /已签到|已簽到|\bchecked\s*in\b/i;
        },
      },
      {
        order: 126,
        run() {
          __contentState.xa = /已签到\s*\d+\s*(?:天|日|次)|已簽到\s*\d+\s*(?:天|日|次)/gi;
        },
      },
      {
        order: 127,
        run() {
          __contentState.Sa = /(?:签到成功|簽到成功)[^\n]{0,24}?(?:已)?获得|恭喜(?:获取|获得)/i;
        },
      },
      {
        order: 128,
        run() {
          __contentState.Na = [`/api/user/self`, `/api/user/info`];
        },
      },
      {
        order: 129,
        run() {
          __contentState.Pa = [`/api/v1/check-in/status`, `/api/v1/auth/me`];
        },
      },
      {
        order: 130,
        run() {
          __contentState.Va = 4e3;
        },
      },
      {
        order: 131,
        run() {
          __contentState.Ua = 1e-9;
        },
      },
      {
        order: 132,
        run() {
          __contentState.Ka = `fapi.leileihog.top`;
        },
      },
      {
        order: 133,
        run() {
          __contentState.qa = `/profile`;
        },
      },
      {
        order: 134,
        run() {
          __contentState.Ja = `/lottery`;
        },
      },
      {
        order: 135,
        run() {
          __contentState.Ya = 12e3;
        },
      },
      {
        order: 136,
        run() {
          __contentState.Xa = 15e3;
        },
      },
      {
        order: 137,
        run() {
          __contentState.Za = 2500;
        },
      },
      {
        order: 138,
        run() {
          __contentState.Qa = 220;
        },
      },
      {
        order: 139,
        run() {
          __contentState.$a = 800;
        },
      },
      {
        order: 140,
        run() {
          __contentState.eo =
            /(?:今日|今天|本日)已抽(?:奖)?|(?:今日|今天)抽奖次数已用完|\bdraw completed\b|\bno draws left today\b/i;
        },
      },
      {
        order: 141,
        run() {
          __contentState.K = class extends Error {};
        },
      },
      {
        order: 142,
        run() {
          __contentState.mo = 0;
        },
      },
      {
        order: 143,
        run() {
          __contentState.ho = null;
        },
      },
      {
        order: 224,
        run() {
          __contentState.Ku = /^\/[a-z]{2}(?:[-_][a-z]{2})?(?=\/)/i;
        },
      },
      {
        order: 225,
        run() {
          __contentState.Yu = (0, __contentScope.P)(
            /帮助|教程|演示|示例|预览|前往|进入|查看|去签到|help|tutorial|demo|preview/i,
          );
        },
      },
      {
        order: 226,
        run() {
          __contentState.Xu = (0, __contentScope.P)(
            /签到中|打卡中|领取中|checking|claiming|processing/i,
          );
        },
      },
      {
        order: 227,
        run() {
          __contentState.ed = 1e4;
        },
      },
      {
        order: 228,
        run() {
          __contentState.td = 3e3;
        },
      },
      {
        order: 229,
        run() {
          __contentState.nd = 3e4;
        },
      },
      {
        order: 230,
        run() {
          __contentState.rd = 30;
        },
      },
      {
        order: 231,
        run() {
          __contentState.id = 4;
        },
      },
      {
        order: 232,
        run() {
          __contentState.ad = 6e3;
        },
      },
      {
        order: 233,
        run() {
          __contentState.od = 400;
        },
      },
      {
        order: 234,
        run() {
          __contentState.sd = 500;
        },
      },
      {
        order: 235,
        run() {
          __contentState.cd = 16;
        },
      },
      {
        order: 236,
        run() {
          __contentState.ld = 150;
        },
      },
      {
        order: 237,
        run() {
          __contentState.ud = 400;
        },
      },
      {
        order: 238,
        run() {
          __contentState.dd = 24;
        },
      },
      {
        order: 239,
        run() {
          __contentState.fd = 6e3;
        },
      },
      {
        order: 240,
        run() {
          __contentState.pd = new WeakMap();
        },
      },
      {
        order: 241,
        run() {
          __contentState._d = class extends Error {
            result;
            constructor(e) {
              (super(e.message), (this.result = e));
            }
          };
        },
      },
      {
        order: 242,
        run() {
          __contentState.Rd = [
            `button`,
            `a`,
            `input`,
            `textarea`,
            `select`,
            `summary`,
            `[role]`,
            `[tabindex]`,
            `[contenteditable=""]`,
            `[contenteditable="true"]`,
            `[data-testid]`,
            `[aria-label]`,
            `[name]`,
          ].join(`, `);
        },
      },
      {
        order: 243,
        run() {
          __contentState.zd = [`testId`, `name`, `aria`];
        },
      },
      {
        order: 244,
        run() {
          __contentState.Bd = [`text`];
        },
      },
      {
        order: 245,
        run() {
          __contentState.Xd = `学习路线未命中: `;
        },
      },
      {
        order: 246,
        run() {
          __contentState.Zd = `工作流接入学习路线: `;
        },
      },
      {
        order: 247,
        run() {
          (__contentScope.s.NEW_API,
            __contentScope.s.SUB2API,
            __contentScope.s.VO_API_V2,
            __contentScope.s.UNSUPPORTED);
        },
      },
      {
        order: 248,
        run() {
          __contentState.bf = 12e3;
        },
      },
      {
        order: 249,
        run() {
          __contentState.xf = 3e3;
        },
      },
      {
        order: 250,
        run() {
          __contentState.Sf = 4e3;
        },
      },
      {
        order: 251,
        run() {
          __contentState.Cf = [
            `签到`,
            `打卡`,
            `每日`,
            `福利`,
            `奖励`,
            `check-in`,
            `checkin`,
            `daily`,
          ];
        },
      },
      {
        order: 252,
        run() {
          __contentState.wf = 4;
        },
      },
      {
        order: 253,
        run() {
          __contentState.Tf = 400;
        },
      },
      {
        order: 254,
        run() {
          __contentState.Ef = [`auto`, `none`, `button`, `api`, `relogin`, `claim`, `workflow`];
        },
      },
      {
        order: 255,
        run() {
          __contentState.If = {
            auto: (e, t, n, r) => (
              n.push(
                t?.workflow === void 0
                  ? `当前为自动识别签到：按本站适配与当前页面寻找签到入口`
                  : `当前为自动识别签到：不回放旧学习记录，按本站适配与当前页面寻找签到入口`,
              ),
              (0, __contentScope.up)(e, t, n, !1, r.loginHappenedThisRun ?? !1, r)
            ),
            none: (e, t, n, r) =>
              (0, __contentScope.up)(e, t, n, !0, r.loginHappenedThisRun ?? !1, r),
            api: (e, t, n) =>
              t ? (0, __contentScope.mp)(e, t, n) : Promise.resolve((0, __contentScope.Ff)(`api`)),
            button: (e, t, n, r, i) =>
              t
                ? (0, __contentScope.gp)(e, t, n, r, i)
                : Promise.resolve((0, __contentScope.Ff)(`button`)),
            claim: (e, t, n, r) =>
              t
                ? (0, __contentScope.vp)(e, t, n, r)
                : Promise.resolve((0, __contentScope.Ff)(`claim`)),
            workflow: __contentScope.Lf,
            relogin: (e, t, n, r) =>
              t
                ? (0, __contentScope.dp)(e, t, n, r)
                : Promise.resolve((0, __contentScope.Ff)(`relogin`)),
          };
        },
      },
      {
        order: 256,
        run() {
          __contentState.Rf = `签到流程的人机验证未完成，已停止当前页面操作`;
        },
      },
      {
        order: 257,
        run() {
          __contentState.$f = [`领取奖励`, `立即领取`, `确认领取`, `领取签到`, `继续签到`];
        },
      },
      {
        order: 258,
        run() {
          __contentState.ep = [
            `领取成功`,
            `领取完成`,
            `奖励已到账`,
            `奖励到账`,
            `reward claimed`,
            `claimed successfully`,
          ];
        },
      },
      {
        order: 259,
        run() {
          __contentState.tp = (0, __contentScope.P)(/赞助|鸣谢|公益|sponsor|donat/i);
        },
      },
      {
        order: 260,
        run() {
          __contentState.np = (0, __contentScope.P)(/领取|claim|collect|redeem/i);
        },
      },
      {
        order: 261,
        run() {
          __contentState.rp = 4500;
        },
      },
      {
        order: 262,
        run() {
          __contentState.ip = (0, __contentScope.P)(/每日签到|daily\s+check[\s-]?in/i);
        },
      },
      {
        order: 263,
        run() {
          __contentState._p = `感谢提供服务，日常使用体验良好，继续保持。`;
        },
      },
      {
        order: 264,
        run() {
          __contentState.yp = 1e4;
        },
      },
      {
        order: 265,
        run() {
          __contentState.bp = 12e3;
        },
      },
      {
        order: 266,
        run() {
          __contentState.xp = 3e4;
        },
      },
      {
        order: 267,
        run() {
          __contentState.Sp = 8;
        },
      },
      {
        order: 276,
        run() {
          __contentState.Q = {
            SELECTOR_MISMATCH: `selector-mismatch`,
            ELEMENT_MISMATCH: `element-mismatch`,
            WORKFLOW_CONFIG: `workflow-config`,
            IDENTITY_UNCONFIRMED: `identity-unconfirmed`,
            AUTH_EXPIRED: `auth-expired`,
            SESSION_SWITCH_FAILED: `session-switch-failed`,
            SITE_UNAVAILABLE: `site-unavailable`,
            SITE_REJECTED: `site-rejected`,
            ACCESS_DENIED: `access-denied`,
            MANUAL_REQUIRED: `manual-required`,
            NO_CHECKIN_ENTRY: `no-checkin-entry`,
            PAGE_TIMEOUT: `page-timeout`,
            OBSCURED: `obscured`,
            CHECKIN_UNVERIFIED: `checkin-unverified`,
            CHECKIN_NO_BASELINE: `checkin-no-baseline`,
            CONTROL_DISABLED: `control-disabled`,
            PROXY_UNREACHABLE: `proxy-unreachable`,
            NETWORK_FAILURE: `network-failure`,
            ALREADY_DONE: `already-done`,
            UNKNOWN: `unknown`,
          };
        },
      },
      {
        order: 277,
        run() {
          (__contentScope.Q.SELECTOR_MISMATCH,
            __contentScope.Q.ELEMENT_MISMATCH,
            __contentScope.Q.WORKFLOW_CONFIG,
            __contentScope.Q.IDENTITY_UNCONFIRMED,
            __contentScope.Q.AUTH_EXPIRED,
            __contentScope.Q.SESSION_SWITCH_FAILED,
            __contentScope.Q.SITE_UNAVAILABLE,
            __contentScope.Q.SITE_REJECTED,
            __contentScope.Q.ACCESS_DENIED,
            __contentScope.Q.MANUAL_REQUIRED,
            __contentScope.Q.NO_CHECKIN_ENTRY,
            __contentScope.Q.PAGE_TIMEOUT,
            __contentScope.Q.OBSCURED,
            __contentScope.Q.CHECKIN_UNVERIFIED,
            __contentScope.Q.CHECKIN_NO_BASELINE,
            __contentScope.Q.CONTROL_DISABLED,
            __contentScope.Q.PROXY_UNREACHABLE,
            __contentScope.Q.NETWORK_FAILURE,
            __contentScope.Q.ALREADY_DONE,
            __contentScope.Q.UNKNOWN);
        },
      },
      {
        order: 278,
        run() {
          __contentState.Gp = [
            {
              code: __contentScope.Q.ALREADY_DONE,
              patterns: [
                /(?:今日|今天)[^，。；\n]{0,12}已(?:经)?签到/,
                /已(?:经)?签到[^，。；\n]{0,8}(?:无需|不用|不必)/,
                /(?:变为|变成|标记为|确认)今日已完成/,
                /今日签到已完成/,
              ],
            },
            {
              code: __contentScope.Q.CHECKIN_NO_BASELINE,
              patterns: [/本轮已登录，但没有签到动作可确认/],
            },
            {
              code: __contentScope.Q.CHECKIN_UNVERIFIED,
              patterns: [
                /没有签到动作可确认/,
                /无法确认「登录即签到」/,
                /无法把「登录即签到」归因到本轮/,
              ],
            },
            {
              code: __contentScope.Q.WORKFLOW_CONFIG,
              patterns: [
                /学习签到路线缺少身份核验页/,
                /学习签到流程没有记录到可核验账号的身份页/,
                /工作流没有配置任何步骤/,
                /学到的流程未通过校验/,
              ],
            },
            {
              code: __contentScope.Q.IDENTITY_UNCONFIRMED,
              patterns: [
                /身份核验页仍未显示可核对的账号身份/,
                /本站用户 ID 尚未绑定/,
                /身份仍不匹配，已达到自动切换次数上限/,
                /个人资料页无法确认当前登录的是账号/,
                /个人资料页当前登录的不是账号/,
                /OAuth 返回后(?:仍无法确认当前身份|核对到当前登录的是别的账号)/,
                /无法确认浏览器里登录的是不是本账号/,
                /当前浏览器登录的是别的账号/,
                /已自动切换过 GitHub 账号/,
              ],
            },
            {
              code: __contentScope.Q.MANUAL_REQUIRED,
              patterns: [
                /验证码/,
                /人机验证/,
                /安全验证/,
                /turnstile/i,
                /captcha/i,
                /等待你在/,
                /授权页/,
                /(?:请完成|请先完成|需要你|等待你)[^，。；\n]{0,10}(?:滑块|图形|行为|智能)?(?:验证|校验)/,
              ],
            },
            {
              code: __contentScope.Q.ELEMENT_MISMATCH,
              patterns: [/指纹失配/, /命中了错误的元素/, /命中的元素不符/],
            },
            {
              code: __contentScope.Q.PROXY_UNREACHABLE,
              patterns: [/没有程序在监听/, /端口.{0,12}没人监听/, /没有任何程序接住/],
            },
            {
              code: __contentScope.Q.SESSION_SWITCH_FAILED,
              patterns: [
                /无法清除.*Cookie/i,
                /Cookie.*(?:残留|权限|清理失败)/i,
                /无法退出当前(?:站点会话|账号)/,
                /无法安全切换.*账号/,
                /退出操作没有真正结束会话/,
                /退出后会话仍然有效/,
              ],
            },
            {
              code: __contentScope.Q.AUTH_EXPIRED,
              patterns: [/登录态/, /未登录/, /凭据有误/, /401/, /登录失效/, /重新登录/],
            },
            {
              code: __contentScope.Q.ACCESS_DENIED,
              patterns: [
                /403/,
                /forbidden/i,
                /access\s*denied/i,
                /访问被拒(?:绝)?/,
                /地区(?:限制|不可用|不支持)/,
                /不支持.{0,8}(?:国家|地区)/,
              ],
            },
            {
              code: __contentScope.Q.SITE_REJECTED,
              patterns: [
                /被拒绝/,
                /显式失败/,
                /不允许/,
                /已封禁/,
                /余额不足/,
                /活动已结束/,
                /理由与历史重复/,
              ],
            },
            {
              code: __contentScope.Q.SITE_UNAVAILABLE,
              patterns: [
                /页面暂不可用/,
                /服务(?:器)?暂不可用/,
                /server\s+(?:unavailable|error)/i,
                /\bHTTP[^\d\n]{0,6}5\d{2}\b/i,
                /状态码[^\d\n]{0,4}5\d{2}/,
                /\bstatus(?:\s*code)?[^\d\n]{0,6}5\d{2}\b/i,
                /(?:返回|响应|状态)[^\d\n]{0,6}5\d{2}/,
                /\b(?:returns?|returned|responded|response)[^\d\n]{0,10}5\d{2}\b/i,
                /bad gateway/i,
                /网关/,
                /限流/,
                /too many/i,
              ],
            },
            {
              code: __contentScope.Q.OBSCURED,
              patterns: [/遮挡/, /被盖住/, /挡住了.*(?:按钮|控件|元素)/, /未关闭的公告/],
            },
            {
              code: __contentScope.Q.PAGE_TIMEOUT,
              patterns: [
                /连接站点超时/,
                /ERR_CONNECTION_TIMED_OUT/i,
                /ERR_TIMED_OUT/i,
                /工作流等待超时/,
                /等待.*(?:元素|控件|页面|加载).*超时/,
                /页面.{0,10}(?:加载|响应).{0,10}超时/,
                /加载超时/,
                /导航.{0,6}超时/,
                /仍未离开空白页/,
                /导航未生效/,
              ],
            },
            {
              code: __contentScope.Q.CONTROL_DISABLED,
              patterns: [
                /按钮(?:当前)?(?:已|处于)?禁用/,
                /控件(?:当前)?不可点/,
                /按钮不可点/,
                /disabled.{0,12}(?:without|no)\s+.{0,12}(?:already|success)/i,
              ],
            },
            {
              code: __contentScope.Q.NETWORK_FAILURE,
              patterns: [/网络/, /代理/, /dns/i, /连接被/, /err_/i, /timeout/i, /超时/],
            },
            {
              code: __contentScope.Q.NO_CHECKIN_ENTRY,
              patterns: [/未自动发现同源签到入口/, /没有可点元素/, /不支持自动签到/],
            },
            {
              code: __contentScope.Q.SELECTOR_MISMATCH,
              patterns: [/找不到/, /未找到/, /当前页没有/, /选择器/, /未命中/],
            },
          ];
        },
      },
      {
        order: 279,
        run() {
          __contentState.Kp = [
            /(?:未|没有|未见|尚未|未曾|无)(?:发现|检测到|出现|需|需额外|检出|观察到)?(?:额外的?|任何)?(?:人机|安全|滑块|图形|行为|智能)?(?:验证|校验|验证码)(?:证据|要求)?(?!.*(?:检测到|出现|弹出|触发|提示|要求|需要|等待你|未完成|无法完成|失败|错误|超时|请完成|请先完成))/,
            /无(?:需|需额外)(?:额外的?|任何)?(?:人机|安全|滑块|图形|行为|智能)?(?:验证|校验|验证码)/,
            /本次点击未出现额外的人机交互要求/,
            /验证已自动完成/,
            /已通过验证信号确认完成/,
            /在首次点击保护期间已自行完成/,
            /^验证控件布局已稳定/,
            /首次点击保护：再等待/,
            /宿主已出现 [\d.]+s，进入内部就绪检查$/,
            /^第 \d+ 次点击前已定位/,
            /^第 \d+ 次可信点击已发出/,
            /^等待\S*验证完成中\.\.\./,
            /^扩展版本\s/,
            /^本站卡片还没学过签到流程，共用同一域名站点/,
            /^使用 Chrome\/系统网络设置/,
            /^登录方式：/,
            /^已启用扩展代理/,
            /^已启用代理/,
            /^已清除 \d+ 项本地登录态/,
            /^切换账号:/,
            /^已调用站点退出接口/,
            /^已注入 Token 到/,
            /^已确认对应公告消失或目标遮挡解除：/,
            /^公告关闭点击回执未确认，但已确认对应弹窗消失或目标遮挡解除：/,
            /^遮挡已清除，继续点击$/,
            /^公告关闭按钮已收到(?:浏览器可信|DOM)点击：/,
            /^关闭了 \d+ 个公告\/弹窗$/,
            /^未发现公告弹窗$/,
            /^当前遮挡层没有可安全点击的公告关闭按钮，未对归属不明的浮层按 Esc$/,
            /^发现登录表单，需要重新登录$/,
            /^发现登录入口，需要登录$/,
            /^当前为自动识别签到：/,
          ];
        },
      },
      {
        order: 280,
        run() {
          __contentState.Yp = {
            [__contentScope.Q.SITE_UNAVAILABLE]: [3e4, 12e4, 3e5],
            [__contentScope.Q.NETWORK_FAILURE]: [15e3, 6e4],
            [__contentScope.Q.PAGE_TIMEOUT]: [1e4, 3e4],
            [__contentScope.Q.AUTH_EXPIRED]: [5e3],
          };
        },
      },
      {
        order: 281,
        run() {
          __contentState.$p = {
            accessToken: `auth_token`,
            refreshToken: `refresh_token`,
            expiresAt: `token_expires_at`,
            user: `auth_user`,
          };
        },
      },
      {
        order: 282,
        run() {
          (__contentScope.o.SUB2API,
            __contentScope.$p.accessToken,
            __contentScope.$p.refreshToken,
            __contentScope.$p.expiresAt,
            __contentScope.$p.user,
            __contentScope.o.VO_API_V2,
            __contentScope.o.NEW_API);
        },
      },
      {
        order: 283,
        run() {
          __contentState.em = 12e4;
        },
      },
      {
        order: 284,
        run() {
          __contentState.tm = `/api/v1/auth/refresh`;
        },
      },
      {
        order: 303,
        run() {
          __contentState.Vm = [3e3, 8e3, 15e3];
        },
      },
      {
        order: 304,
        run() {
          __contentState.Hm = `页面暂不可用，自动重试`;
        },
      },
      {
        order: 305,
        run() {
          __contentState.Um = `自动重试:`;
        },
      },
      {
        order: 306,
        run() {
          __contentState.Wm = `切换账号:`;
        },
      },
      {
        order: 307,
        run() {
          __contentState.Gm = 1;
        },
      },
      {
        order: 308,
        run() {
          __contentState.Km = `自动切换 GitHub 账号:`;
        },
      },
      {
        order: 309,
        run() {
          __contentState.qm = `学习流程恢复登录:`;
        },
      },
      {
        order: 310,
        run() {
          __contentState.Jm = 2;
        },
      },
      {
        order: 311,
        run() {
          __contentState.Ym = 60;
        },
      },
      {
        order: 312,
        run() {
          __contentState.Xm = `进入签到页: `;
        },
      },
      {
        order: 313,
        run() {
          __contentState.Zm = `学习路线进度:`;
        },
      },
      {
        order: 314,
        run() {
          __contentState.Qm = 2;
        },
      },
      {
        order: 315,
        run() {
          __contentState.$m = 1;
        },
      },
      {
        order: 316,
        run() {
          __contentState.eh = 3;
        },
      },
      {
        order: 317,
        run() {
          __contentState.th = [
            `/profile`,
            `/console/personal`,
            `/dashboard/overview`,
            `/dashboard`,
            `/console`,
            `/check-in`,
            `/checkin`,
          ];
        },
      },
      {
        order: 318,
        run() {
          __contentState.$ = 3e5;
        },
      },
      {
        order: 319,
        run() {
          __contentState.nh = 12e3;
        },
      },
      {
        order: 320,
        run() {
          __contentState.rh = `个人资料身份已核验:`;
        },
      },
      {
        order: 321,
        run() {
          __contentState.ih = `本轮已全新登录:`;
        },
      },
      {
        order: 322,
        run() {
          __contentState.sh = [
            __contentScope.Wm,
            __contentScope.Km,
            __contentScope.Um,
            __contentScope.qm,
            `开始第二次登录`,
            `已清除`,
            `已调用站点退出接口`,
          ];
        },
      },
      {
        order: 356,
        run() {
          __contentState.Gg = (0, __contentScope.e)({
            matches: [`<all_urls>`],
            runAt: `document_idle`,
            allFrames: !0,
            matchAboutBlank: !0,
            async main() {
              chrome.runtime.onMessage.addListener((e, t, n) => {
                if (!e || typeof e != `object`) return;
                let r = e;
                if (r.type === `READ_LOGIN_OPTIONS`) {
                  if (t.id !== chrome.runtime.id || !r.site?.id || !r.site?.loginUrl) {
                    n({ ok: !1, error: `只能由扩展后台读取指定站点的登录方式` });
                    return;
                  }
                  const loginOptions = (0, __contentScope.readLoginOptions)(r.site);
                  n({ ok: !0, feature: { loginOptions } });
                  return;
                }
                if (r.type === `FLUSH_LEARNING`) {
                  let e = typeof r.runId == `string` ? r.runId : ``;
                  if (__contentScope.Vg?.runId !== e) {
                    n({ ok: !0, challengeSeen: !1, inactive: !0 });
                    return;
                  }
                  let t = (0, __contentScope.Wg)(),
                    i = __contentScope.Vg;
                  return (
                    i.stop(),
                    i.flush().then(
                      (e) =>
                        n({
                          ok: !0,
                          challengeSeen: e.challengeSeen,
                          checkinControlSeen: t,
                          ...(e.unlearnedNotes.length ? { unlearnedNotes: e.unlearnedNotes } : {}),
                        }),
                      (e) =>
                        n({
                          ok: !1,
                          error: e instanceof Error ? e.message : String(e),
                        }),
                    ),
                    !0
                  );
                }
                r.type === `LEARN_MODE` &&
                  (r.learning
                    ? (0, __contentScope.Ug)(r.learning)
                    : ((0, __contentScope.Hg)(), __contentScope.Bg.end()),
                  n({ ok: !0 }));
              });
              let e = await (0, __contentScope.n)({ type: `GET_TASK` });
              if (!e.ok) return;
              if (!e.task) {
                e.feature?.learningSession && (0, __contentScope.Ug)(e.feature.learningSession);
                return;
              }
              let t = e.task;
              if (
                ((0, __contentScope.b)(t.runId, t.site.pointerMode ?? `trusted`),
                Date.now() - t.createdAt > 6e5)
              )
                return;
              if (t.effectiveLoginMethod === `github` && t.stage === `github-logout`) {
                if ((0, __contentScope.Ir)(location.href)) {
                  await (0, __contentScope.n)({
                    type: `GITHUB_LOGOUT_COMPLETE`,
                    runId: t.runId,
                    steps: t.steps ?? [],
                  });
                  return;
                }
                if (!(0, __contentScope.Fr)(location.href)) return;
                let e = document.querySelector(
                  `form[action="/logout"], form[action="https://github.com/logout"]`,
                );
                if (!e) {
                  await (0, __contentScope.n)({
                    type: `NEEDS_USER`,
                    runId: t.runId,
                    message: `GitHub 退出页未找到官方退出表单，自动切换账号已停止`,
                    steps: t.steps ?? [],
                  });
                  return;
                }
                try {
                  let t = e.querySelector(`button[type="submit"], input[type="submit"]`);
                  t ? e.requestSubmit(t) : e.requestSubmit();
                } catch (e) {
                  await (0, __contentScope.n)({
                    type: `NEEDS_USER`,
                    runId: t.runId,
                    message: `GitHub 自动退出失败（${e instanceof Error ? e.message : String(e)}）`,
                    steps: t.steps ?? [],
                  });
                }
                return;
              }
              if (t.effectiveLoginMethod === `github` && (0, __contentScope.Rr)(location.href)) {
                if ((0, __contentScope.Lr)(location.href) || !(0, __contentScope.Pr)(location.href))
                  return;
                let e = `aah-github-login-attempt:${t.runId}`,
                  r = !1;
                try {
                  r = sessionStorage.getItem(e) === `1`;
                } catch {}
                let i = t.githubUsername?.trim(),
                  a = t.githubPassword,
                  o = document.querySelector(`#login_field, input[name="login"]`),
                  s = document.querySelector(`#password, input[type="password"]`);
                if (r) {
                  await (0, __contentScope.n)({
                    type: `NEEDS_USER`,
                    runId: t.runId,
                    message: `GitHub 登录未自动完成，请手动完成登录或二次验证`,
                    steps: t.steps ?? [],
                  });
                  return;
                }
                if (!o || !s || !i || !a) {
                  await (0, __contentScope.n)({
                    type: `NEEDS_USER`,
                    runId: t.runId,
                    message: `GitHub 登录页未找到完整的账号密码表单，请手动完成登录`,
                    steps: t.steps ?? [],
                  });
                  return;
                }
                try {
                  sessionStorage.setItem(e, `1`);
                } catch {}
                let c = !1;
                for (let e = 0; e < 2; e += 1) {
                  let t = document.querySelector(`#login_field, input[name="login"]`),
                    n = document.querySelector(`#password, input[type="password"]`);
                  if (!t || !n) break;
                  ((0, __contentScope.A)(t, i),
                    (0, __contentScope.A)(n, a),
                    await (0, __contentScope.w)(e === 0 ? 250 : 400));
                  let r = document.querySelector(`#login_field, input[name="login"]`),
                    o = document.querySelector(`#password, input[type="password"]`);
                  if (((c = r?.value.trim() === i && o?.value === a), c)) break;
                }
                let l = document.querySelector(`#login_field, input[name="login"]`),
                  u = document.querySelector(`#password, input[type="password"]`),
                  d = document.querySelector(
                    `input[type="submit"][name="commit"], button[type="submit"]`,
                  );
                if (!c || !l || !u || l.value.trim() !== i || u.value !== a) {
                  await (0, __contentScope.n)({
                    type: `NEEDS_USER`,
                    runId: t.runId,
                    message: `GitHub 登录输入被页面或自动填充覆盖，已停止提交；请确认目标账号 ${i}`,
                    steps: t.steps ?? [],
                  });
                  return;
                }
                if (!d) {
                  await (0, __contentScope.n)({
                    type: `NEEDS_USER`,
                    runId: t.runId,
                    message: `GitHub 登录页未找到提交按钮，请手动完成登录`,
                    steps: t.steps ?? [],
                  });
                  return;
                }
                let f = l.readOnly,
                  p = u.readOnly;
                ((l.readOnly = !0), (u.readOnly = !0));
                try {
                  await (0, __contentScope.M)(d, { mayNavigate: !0 });
                } catch (e) {
                  await (0, __contentScope.n)({
                    type: `NEEDS_USER`,
                    runId: t.runId,
                    message: `GitHub 登录自动点击失败，请手动完成登录（${e instanceof Error ? e.message : String(e)}）`,
                    steps: t.steps ?? [],
                  });
                } finally {
                  (l.isConnected && (l.readOnly = f), u.isConnected && (u.readOnly = p));
                }
                return;
              }
              let r = Promise.resolve(),
                i = (e) => (
                  (r = r
                    .catch(() => {})
                    .then(async () => {
                      let r = await (0, __contentScope.n)({
                        type: `SYNC_PROGRESS`,
                        runId: t.runId,
                        steps: e,
                      });
                      !r.ok &&
                        r.error !== `任务已结束` &&
                        console.debug(`[签到助手] 实时进度同步失败`, r.error);
                    })),
                  r
                );
              async function a() {
                let e;
                (await Promise.race([
                  r.catch(() => {}),
                  new Promise((t) => {
                    e = setTimeout(t, 2e3);
                  }),
                ]),
                  e && clearTimeout(e));
              }
              let o = await (0, __contentScope.hh)(t, {
                reportProgress(e) {
                  return i(e);
                },
                async markStage(e, i) {
                  await r;
                  let a = await (0, __contentScope.n)({
                    type: `SET_STAGE`,
                    runId: t.runId,
                    stage: e,
                    steps: i,
                  });
                  if (!a.ok) throw Error(a.error);
                },
                async navigate(e, i, a) {
                  if (!(0, __contentScope.W)(t.site, e))
                    throw Error(`任务试图跳转到非本站地址，已停止自动操作`);
                  await r;
                  let o = await (0, __contentScope.n)({
                    type: `SET_STAGE`,
                    runId: t.runId,
                    stage: a,
                    steps: i,
                    ...([`login`, `relogin`].includes(a) ? { resetLoginMethod: !0 } : {}),
                  });
                  if (!o.ok) throw Error(o.error);
                  let s = new URL(e, location.href);
                  s.origin === location.origin &&
                  s.pathname === location.pathname &&
                  s.search === location.search &&
                  s.hash !== location.hash
                    ? ((location.hash = s.hash), location.reload())
                    : location.assign(e);
                },
                async needsUser(e, i) {
                  await r;
                  let a = await (0, __contentScope.n)({
                    type: `NEEDS_USER`,
                    runId: t.runId,
                    message: e,
                    steps: i,
                  });
                  if (!a.ok && a.error !== `任务已结束`) throw Error(a.error);
                },
                async waitForManualLogin(message, steps) {
                  await r;
                  const response = await (0, __contentScope.n)({
                    type: `MANUAL_LOGIN_WAITING`,
                    runId: t.runId,
                    message,
                    steps,
                  });
                  if (!response.ok) throw Error(response.error || `后台无法保留页面登录任务`);
                  const deadline = response.feature?.manualLoginWaitUntil;
                  if (!Number.isFinite(deadline))
                    throw Error(`后台未返回页面登录等待时限，已停止自动操作`);
                  return deadline;
                },
                async clearSiteCookies() {
                  await r;
                  let e = await (0, __contentScope.n)({
                    type: `CLEAR_SITE_COOKIES`,
                    runId: t.runId,
                  });
                  if (!e.ok) throw Error(e.error);
                  let i = e.feature?.siteCookieClear;
                  if (!i) throw Error(`后台未返回本站 Cookie 清理结果`);
                  return i;
                },
                async startGithubLogout(e) {
                  await r;
                  let i = await (0, __contentScope.n)({
                    type: `SET_STAGE`,
                    runId: t.runId,
                    stage: `github-logout`,
                    steps: e,
                  });
                  if (!i.ok) throw Error(i.error);
                  location.assign(`https://github.com/logout`);
                },
                async saveSession(e) {
                  await (0, __contentScope.n)({
                    type: `SESSION_REFRESHED`,
                    runId: t.runId,
                    accountId: t.accountId,
                    accessToken: e.accessToken,
                    refreshToken: e.refreshToken,
                    tokenExpiresAt: e.tokenExpiresAt,
                  });
                },
                async confirmIdentity() {
                  await (0, __contentScope.n)({
                    type: `CONFIRM_IDENTITY`,
                    runId: t.runId,
                  });
                },
                async resolveLoginMethod(method, loginEntry) {
                  await r;
                  const response = await (0, __contentScope.n)({
                    type: `RESOLVE_LOGIN_METHOD`,
                    runId: t.runId,
                    method,
                    ...(loginEntry ? { loginEntry } : {}),
                  });
                  if (!response.ok) throw Error(response.error || `后台无法确认页面识别的登录方式`);
                  const resolved = response.feature?.effectiveLoginMethod;
                  if (resolved !== method) throw Error(`后台返回的登录方式与当前页面不一致`);
                  t.effectiveLoginMethod = resolved;
                  return resolved;
                },
                async recordFormCredentialsSubmitted() {
                  const response = await (0, __contentScope.n)({
                    type: `FORM_CREDENTIALS_SUBMITTED`,
                    runId: t.runId,
                  });
                  if (!response.ok) {
                    throw Error(response.error || `后台无法确认本账号的登录提交`);
                  }
                },
                async saveIdentity(e) {
                  let r = await (0, __contentScope.n)({
                    type: `SAVE_IDENTITY`,
                    runId: t.runId,
                    identity: e,
                  });
                  if (!r.ok) throw Error(r.error || `后台拒绝更新账号身份`);
                },
                async saveWorkflowRouteIndex(e) {
                  await a();
                  let r = await (0, __contentScope.n)({
                    type: `SAVE_WORKFLOW_ROUTE`,
                    runId: t.runId,
                    index: e,
                  });
                  if (!r.ok) throw Error(r.error || `学习路线进度未保存`);
                },
                async saveBalance(e) {
                  let r = await (0, __contentScope.n)({
                    type: `BALANCE_SNAPSHOT`,
                    runId: t.runId,
                    snapshot: e,
                  });
                  if (!r.ok) throw Error(r.error || `后台未写入余额快照`);
                },
                async saveReloginBalanceBefore(e) {
                  await (0, __contentScope.n)({
                    type: `BALANCE_SNAPSHOT`,
                    runId: t.runId,
                    snapshot: e,
                    phase: `relogin-before`,
                  });
                },
                async saveButtonBalanceBefore(e) {
                  await a();
                  let r = await (0, __contentScope.n)({
                    type: `BALANCE_SNAPSHOT`,
                    runId: t.runId,
                    snapshot: e,
                    phase: `button-before`,
                  });
                  if (!r.ok) throw Error(r.error);
                },
                async saveClaimText(e) {
                  await (0, __contentScope.n)({
                    type: `CLAIM_TEXT_USED`,
                    runId: t.runId,
                    siteId: t.site.id,
                    text: e,
                  });
                },
                async saveCheckinReward(e) {
                  (0, __contentScope.n)({
                    type: `CHECKIN_REWARD_OBSERVATION`,
                    runId: t.runId,
                    siteId: t.site.id,
                    bodyText: e,
                  });
                },
              });
              if (o)
                for (let e = 0; e < 3; e += 1) {
                  let r = await (0, __contentScope.n)({
                    type: `TASK_RESULT`,
                    runId: t.runId,
                    result: o,
                  });
                  if (r.ok || r.error === `任务已结束`) break;
                  await new Promise((t) => setTimeout(t, 250 * (e + 1)));
                }
            },
          });
        },
      },
    ],
  };
}
