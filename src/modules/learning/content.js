import { bindContentState } from '../../shared/content-runtime.js';
import { identitySampleKey } from '../../shared/account-identity.js';
import { IdentitySourceLearner } from './identity-learning.js';
import {
  describeLotteryClick,
  isLearnedLotteryAction,
  mentionsLotteryAction,
  readLotteryResultEvidence,
  snapshotLotteryResults,
  stableLotteryControlSelector,
} from './lottery-learning.js';

/** 学习签到内容逻辑：安全动作录制、页面引导、用户 ID 观察和学习事件回报。  */
export function createLearningAutoContent(__contentScope) {
  const __contentState = bindContentState(__contentScope, [
    'sm',
    'cm',
    'lm',
    'um',
    'dm',
    'fm',
    'pm',
    'mm',
    'hm',
    'gm',
    '_m',
    'vm',
    'ym',
    'bm',
    'xm',
    'Sm',
    'Cm',
    'wm',
    'Tm',
    'Em',
    'Dm',
    'Om',
    'km',
    'Am',
    'jm',
    'Mm',
    'Nm',
    'Pm',
    'Fm',
    'Im',
    'Lm',
    'Rm',
    'zm',
    'Bm',
    'gh',
    '_h',
    'vh',
    'yh',
    'bh',
    'xh',
    'Sh',
    'Ch',
    'wh',
    'Th',
    'Eh',
    'Dh',
    'Oh',
    'kh',
    'Ah',
    'jh',
    'Mh',
    'Nh',
    'Ph',
    'Fh',
    'Ih',
    'Lh',
    'Rh',
    'zh',
    'Bh',
    'Vh',
    'Hh',
    'Uh',
    'Wh',
    'Gh',
    'Kh',
    'qh',
    'Jh',
    'Yh',
    'Xh',
    'Zh',
    'Qh',
    '$h',
    'eg',
    'tg',
    'ng',
    'rg',
    'ig',
    'ag',
    'og',
    'sg',
    'cg',
    'lg',
    'ug',
    'dg',
    'fg',
    'pg',
    'mg',
    'hg',
    'gg',
    '_g',
    'vg',
    'yg',
    'bg',
    'xg',
    'Sg',
    'Cg',
    'wg',
    'Tg',
    'Eg',
    'Dg',
    'Og',
    'kg',
    'Ag',
    'jg',
    'Mg',
    'Ng',
    'Pg',
    'Fg',
    'Ig',
    'Lg',
    'Rg',
    'createLearningIdentityMonitor',
    'zg',
    'Bg',
    'Vg',
    'Hg',
    'Ug',
    'Wg',
  ]);
  function sm(e) {
    return e !== `login`;
  }

  function cm(e) {
    let t = e.indexOf(`#`);
    if (t < 0) return ``;
    let n = e.slice(t + 1);
    return n.startsWith(`/`) ? n : ``;
  }

  function mm(e) {
    return (
      __contentScope.pm.test(e.split(/[?#]/)[0] ?? ``) ||
      __contentScope.pm.test((0, __contentScope.cm)(e).split(`?`)[0] ?? ``)
    );
  }

  function bm(e) {
    let t = e.path;
    return typeof t == `string` && t.trim() ? t : void 0;
  }

  function xm(e) {
    let t = (0, __contentScope.cm)(e);
    return __contentScope.lm.test(e) || (!!t && __contentScope.lm.test(t));
  }

  function Sm(e) {
    let t = (0, __contentScope.cm)(e);
    return __contentScope.um.test(e) || (!!t && __contentScope.um.test(t));
  }

  function Cm(e) {
    let t = (e) =>
        __contentScope.dm.test(e) || (__contentScope.pm.test(e) && !__contentScope.fm.test(e)),
      n = (0, __contentScope.cm)(e);
    return t(e) || (!!n && t(n));
  }

  function wm(e) {
    if ((0, __contentScope.Sm)((0, __contentScope.bm)(e) ?? ``)) return !0;
    if (e.type === `navigation` || (e.type !== `click` && e.type !== `fill`)) return !1;
    if (__contentScope.hm.test((e.label ?? ``).trim())) return !0;
    if (e.type !== `click`) return !1;
    let t = e.href;
    if (typeof t != `string` || !t.trim()) return !1;
    try {
      return (0, __contentScope.Sm)(new URL(t, `https://learning.invalid`).pathname);
    } catch {
      return !1;
    }
  }

  function Tm(e) {
    let t = (e.label ?? ``).trim();
    if (t && __contentScope._m.test(t)) return !0;
    let n = e.href,
      r = (0, __contentScope.bm)(e);
    if (typeof n != `string` || !n.trim() || !r) return !1;
    try {
      return new URL(n, `https://learning.invalid`).pathname !== r;
    } catch {
      return !1;
    }
  }

  function Em(e) {
    let t = (e.label ?? ``).trim();
    return !!t && __contentScope._m.test(t);
  }

  function Dm(e) {
    if (e.type === `click`) {
      let t = (0, __contentScope.bm)(e);
      return (t && (0, __contentScope.xm)(t)) ||
        (e.loginAction &&
          !(
            e.loginAction === `submit` &&
            (__contentScope.gm.test(e.label ?? ``) || isLearnedLotteryAction(e))
          )) ||
        (0, __contentScope.wm)(e) ||
        (0, __contentScope.Em)(e)
        ? `none`
        : e.evidence?.kind === `already`
          ? `already`
          : e.evidence?.kind === `success`
            ? `confirmed`
            : (0, __contentScope.Tm)(e)
              ? `none`
              : isLearnedLotteryAction(e) ||
                  (e.label &&
                    !e.href &&
                    !mentionsLotteryAction(e.label) &&
                    __contentScope.gm.test(e.label))
                ? `action`
                : `none`;
    }
    if (e.type === `fill` || e.type === `drag`) {
      let t = e.afterText ?? [];
      if (t.some((e) => __contentScope.vm.test(e))) return `already`;
      if (t.some((e) => __contentScope.ym.test(e))) return `confirmed`;
    }
    return `none`;
  }

  function km(e) {
    let t = [];
    for (let n of e) {
      let e = (0, __contentScope.bm)(n);
      e && e !== t[t.length - 1] && t.push(e);
    }
    return t;
  }

  function Am(e) {
    return e.filter((e) => e.type !== `navigation`).length;
  }

  function jm(e, t) {
    let n = `login`,
      r = `none`,
      i = !1,
      a = !1,
      o = !1,
      s = !1,
      c = !1,
      l = !1,
      u = !1,
      d = !1;
    for (let f of e) {
      if ((0, __contentScope.wm)(f)) {
        ((i = !0),
          (n = `login`),
          (r = `none`),
          (a = !1),
          (o = !1),
          (s = !1),
          (c = !1),
          (u = !1),
          (l = !1),
          (d = !1));
        continue;
      }
      let e = (0, __contentScope.bm)(f),
        p = !!e && (0, __contentScope.xm)(e);
      (p && (u = !0),
        f.type === `fill` && (f.fieldRole !== void 0 || (p && f.hasValue)) && (a = !0));
      let m = s || c;
      if (
        (f.type === `click` && f.loginAction === `submit` && (s = !0),
        f.type === `click` && f.loginAction === `oauth` && (c = !0),
        f.type === `fill` && f.key === `Enter` && (f.fieldRole === `password` || p) && (s = !0),
        !(0, __contentScope.sm)(t))
      ) {
        (c || (a && s)) && ((n = `done`), (i = !1));
        continue;
      }
      if (p) continue;
      (e && (0, __contentScope.mm)(e) && (d = !0), e && u && (l = !0));
      let h = !!e && (0, __contentScope.Ju)(e),
        g = !!e && (0, __contentScope.Cm)(e);
      ((h || g || m || l) && (o = !0),
        i && o && (m || a) && (i = !1),
        n === `login` && o && (n = `profile`),
        n === `profile` && g && (n = `checkin`));
      let _ = (0, __contentScope.Dm)(f);
      _ !== `none` &&
        __contentScope.Om[_] > __contentScope.Om[r] &&
        ((r = _),
        n === `login` && (n = `profile`),
        n === `profile` && (n = `checkin`),
        (n = `done`));
    }
    let f = e[e.length - 1],
      p = f ? (0, __contentScope.bm)(f) : void 0;
    return {
      kind: t,
      stage: n,
      ...(p ? { path: p } : {}),
      pages: (0, __contentScope.km)(e).length,
      actions: (0, __contentScope.Am)(e),
      checkin: r,
      credentials: a,
      signedIn: o,
      login: c || (a && s),
      logout: i,
      loginAsCheckinAvailable: (0, __contentScope.sm)(t) && o && !i && r === `none` && !d,
    };
  }

  function zm(e, t) {
    return (0, __contentScope.sm)(e)
      ? t === `login`
        ? `请登录`
        : t === `profile`
          ? `已检测到登录成功，请前往能显示当前账号的页面`
          : t === `checkin`
            ? `请完成一次签到`
            : `已录到签到动作`
      : t === `done`
        ? `已录到登录动作`
        : `请登录`;
  }

  function Bm(e) {
    let t = e.kind === `login`,
      n = t ? 2 : 4,
      r = t
        ? e.stage === `done`
          ? 2
          : 1
        : e.stage === `login`
          ? 1
          : e.stage === `profile`
            ? 2
            : e.stage === `checkin`
              ? 3
              : 4,
      i = __contentScope.Mm[r - 1] ?? ``,
      a = e.stage === `done`,
      o = t ? __contentScope.Rm[e.stage] : __contentScope.Im[e.stage],
      s = (t ? __contentScope.Pm : __contentScope.Nm).map((e, t) => ({
        label: e,
        state: t + 1 < r ? `done` : t + 1 === r ? `current` : `todo`,
      }));
    return {
      step: r,
      total: n,
      title: `${i} ${(0, __contentScope.zm)(e.kind, e.stage)}${a ? `，可以点「结束学习」了` : ``}`,
      hint: !t && e.loginAsCheckinAvailable ? `${o}；${__contentScope.Lm}` : o,
      steps: s,
      ...(e.logout ? { warning: __contentScope.Fm } : {}),
    };
  }

  function vh(e) {
    let t = null;
    for (let n of e)
      if (n instanceof HTMLElement && (t === null && (t = n), (0, __contentScope.Tg)(n))) return n;
    return t;
  }

  function yh(e) {
    let t = e;
    for (let e = 0; t && e < 4; e += 1) {
      if (
        t.draggable === !0 ||
        (t.getAttribute(`draggable`) ?? ``).toLowerCase() === `true` ||
        t.getAttribute(`role`) === `slider` ||
        (0, __contentScope.Tg)(t)
      )
        return !0;
      t = t.parentElement;
    }
    return !1;
  }

  function bh(e) {
    let t = e;
    for (let e = 0; t && e < 4; e += 1) {
      let e = t.getAttribute(`role`) ?? ``,
        n = [
          t.tagName,
          t.id,
          typeof t.className == `string` ? t.className : ``,
          t.getAttribute(`aria-label`) ?? ``,
          t.getAttribute(`title`) ?? ``,
          t.getAttribute(`data-testid`) ?? ``,
          e,
        ].join(` `);
      if (e === `slider` || __contentScope._h.test(n)) return !0;
      t = t.parentElement;
    }
    return !1;
  }

  function Nh(e) {
    return __contentScope.Mh.test(e) ? `` : e;
  }

  function Ph(e, t) {
    return (0, __contentScope.et)(e, t);
  }

  function Fh() {
    let e = 0;
    for (let t of Array.from(document.querySelectorAll(`*`))) t.scrollTop > e && (e = t.scrollTop);
    return e;
  }

  function Ih(e, t, n) {
    let r = Math.max(1, t - n);
    return Math.min(1, Math.max(0, e / r));
  }

  function Lh(e) {
    for (
      let t = e ?? null;
      t && t !== document.body && t !== document.documentElement;
      t = t.parentElement
    ) {
      if (t.scrollTop <= 0 || !/(auto|scroll|overlay)/.test(getComputedStyle(t).overflowY))
        continue;
      let e = t.id && !(0, __contentScope.ag)(t.id) ? `#${t.id}` : (0, __contentScope.fg)(t);
      if (e && e.length <= 300 && document.querySelectorAll(e).length === 1)
        return {
          scrolled: !0,
          scrollContainer: e,
          containerRatio: (0, __contentScope.Ih)(t.scrollTop, t.scrollHeight, t.clientHeight),
        };
    }
    let t = Math.max(
        Math.round(document.documentElement?.scrollTop ?? 0),
        Math.round(document.body?.scrollTop ?? 0),
        Math.max(0, Math.round(window.scrollY ?? 0)),
      ),
      n = t > 0,
      r = document.documentElement,
      i = r ? (0, __contentScope.Ih)(t, r.scrollHeight, r.clientHeight) : void 0;
    return {
      ...(n ? { pageY: t } : {}),
      ...(n && i !== void 0 ? { ratio: i } : {}),
      ...(n || (!e && (0, __contentScope.Fh)() > 0) ? { scrolled: !0 } : {}),
    };
  }

  function Rh(e) {
    if (!(!Number.isFinite(e) || e < 0)) return Math.min(Math.round(e), __contentScope.gh);
  }

  function zh(e) {
    if (typeof e != `string`) return;
    let t = e.trim();
    return t && t.length <= 300 && !t.includes(`text=`) && !(0, __contentScope.cg)(t) ? t : void 0;
  }

  function Bh(e) {
    let t = e.scrollBeforeY,
      n = (0, __contentScope.zh)(e.scrollContainer),
      r = e.scrollPageTop ? { scrollPageTop: !0, ...(n ? { scrollContainer: n } : {}) } : {};
    if (t === void 0) return r;
    let i = (0, __contentScope.Rh)(t);
    return i !== void 0 && i > 0 ? { scrollBeforeY: i } : r;
  }

  function Vh(e) {
    return e?.pageY !== void 0 && e.pageY > 0
      ? { scrollBeforeY: e.pageY }
      : e?.scrolled
        ? {
            scrollPageTop: !0,
            ...(e.scrollContainer ? { scrollContainer: e.scrollContainer } : {}),
          }
        : {};
  }

  function Uh(e) {
    let t = new Set();
    for (let n of e ?? []) {
      let e = n?.trim().toLowerCase();
      if (!e) continue;
      e.length >= __contentScope.Hh && t.add(e);
      let r = e.indexOf(`@`);
      r >= __contentScope.Hh && t.add(e.slice(0, r));
    }
    if (t.size === 0) return () => !1;
    let n = /[\p{L}\p{N}._+@-]/u;
    return (e) => {
      let r = e?.toLowerCase();
      if (!r) return !1;
      for (let e of t)
        for (let t = r.indexOf(e); t >= 0; t = r.indexOf(e, t + 1)) {
          let i = r[t - 1],
            a = r[t + e.length];
          if ((!i || !n.test(i)) && (!a || !n.test(a))) return !0;
        }
      return !1;
    };
  }

  function Wh(e, t = !1) {
    let n = (0, __contentScope.Ph)(e, t ? __contentScope.rt : __contentScope.Ch);
    if (n.length) return { kind: `already`, words: n.slice(0, 4) };
    let r = (0, __contentScope.Ph)(e, t ? __contentScope.nt : __contentScope.Sh);
    if (r.length) return { kind: `success`, words: r.slice(0, 4) };
  }

  function Gh(e) {
    return !(
      !e ||
      e.length > 60 ||
      /@[\w-]+\.[\w-]+/.test(e) ||
      /\d{6,}/.test(e) ||
      /eyJ[\w-]{6,}|bearer\s|password|token|secret|密码/i.test(e) ||
      /\b(?:sk|pk|ghp|gho|ghu|ghs|glpat|xox[baprs])[-_][A-Za-z0-9]/i.test(e) ||
      e.match(/[A-Za-z0-9]{20,}/g)?.some((e) => /[A-Za-z]/.test(e) && /\d/.test(e))
    );
  }

  function Kh(e) {
    try {
      return (0, __contentScope.O)(e);
    } catch {
      return !0;
    }
  }

  function qh(e = 300) {
    let t = [],
      n = new Set(),
      r = document.body?.querySelectorAll(`*`);
    if (!r) return t;
    let i = 0;
    for (let a of r) {
      if (i >= 4e3 || t.length >= e) break;
      if (((i += 1), a.children.length > 0)) continue;
      let r = (a.textContent ?? ``).replace(/\s+/g, ` `).trim();
      !r ||
        r.length > 60 ||
        n.has(r) ||
        ((0, __contentScope.Gh)(r) && (0, __contentScope.Kh)(a) && (n.add(r), t.push(r)));
    }
    return t;
  }

  function Jh(e, t, n) {
    let r = new Set(e),
      i = t.filter((e) => !r.has(e)),
      a = (0, __contentScope.Ph)(`${n} ${i.join(` `)}`, __contentScope.Eh).slice(0, 4),
      o = i
        .filter(__contentScope.Gh)
        .filter((e) => !(0, __contentScope.I)(e, a))
        .slice(0, 2),
      s = [...new Set([...a, ...o])];
    return s.length ? s : void 0;
  }

  function Xh(e) {
    return e.replace(/\\/g, `\\\\`).replace(/"/g, `\\"`);
  }

  function Zh(e) {
    let t =
      (e instanceof HTMLInputElement
        ? (e.getAttribute(`aria-label`) ?? e.getAttribute(`title`) ?? ``)
        : (0, __contentScope.me)(e)
      )
        .replace(/\s+/g, ` `)
        .trim()
        .split(`,`)[0]
        ?.trim() ?? ``;
    return /[\p{L}\p{Script=Han}]/u.test(t) ? t.slice(0, __contentScope.Yh).trim() : ``;
  }

  function ig(e) {
    return e.length < __contentScope.rg || !/^[0-9a-f]+$/i.test(e)
      ? !1
      : /\d/.test(e) && /[a-f]/i.test(e);
  }

  function ag(e) {
    let t = e.trim();
    return !__contentScope.Qh.test(t) ||
      __contentScope.$h.test(t) ||
      __contentScope.eg.test(t) ||
      __contentScope.tg.test(t) ||
      __contentScope.ng.test(t)
      ? !0
      : t.split(/[-_]/).some(__contentScope.ig);
  }

  function cg(e) {
    let t = e.trim();
    if (!t) return !1;
    if (__contentScope.sg.test(t)) return !0;
    for (let e of t.split(`>>`))
      if (!e.trim().startsWith(`text=`)) {
        for (let t of e.matchAll(__contentScope.og)) if ((0, __contentScope.ag)(t[1])) return !0;
      }
    return !1;
  }

  function lg(e) {
    let t = [],
      n = e;
    for (; n;) {
      let e = n.getRootNode();
      if (!(e instanceof ShadowRoot)) break;
      let r = e.host;
      (t.unshift((0, __contentScope.ug)(r, r.getRootNode())), (n = r));
    }
    return t;
  }

  function ug(e, t) {
    let n = t,
      r = (t) => {
        try {
          let r = n.querySelectorAll(t);
          return r.length === 1 && r[0] === e;
        } catch {
          return !1;
        }
      },
      i = e.getAttribute(`data-testid`);
    if (i) {
      let e = `[data-testid="${(0, __contentScope.Xh)(i)}"]`;
      if (r(e)) return e;
    }
    if (e.id && !(0, __contentScope.ag)(e.id)) {
      let t = `#${e.id}`;
      if (r(t)) return t;
    }
    let a = e.tagName.toLowerCase(),
      o =
        (e.parentElement
          ? [...e.parentElement.children].filter((t) => t.tagName === e.tagName)
          : [e]
        ).indexOf(e) + 1,
      s = `${a}:nth-of-type(${o > 0 ? o : 1})`;
    return r(s) ? s : a;
  }

  function dg(e, t) {
    let n;
    try {
      n = (0, __contentScope.xe)(e);
    } catch {
      return !0;
    }
    return (0, __contentScope.lg)(t).length > 0
      ? !0
      : n.length === 0
        ? e.includes(`text=`) && t.matches(__contentScope.de)
        : n.length !== 1 || n[0] !== t;
  }

  function fg(e) {
    let t = [],
      n = e;
    for (; n && n !== document.body && n.nodeType === 1;) {
      if (n !== e && n.id && !(0, __contentScope.ag)(n.id))
        return (t.unshift(`#${n.id}`), t.join(` > `));
      let r = n.parentElement,
        i = n.tagName.toLowerCase();
      if (!r) {
        t.unshift(i);
        break;
      }
      let a = n,
        o = [...r.children].filter((e) => e.tagName === a.tagName),
        s = o.indexOf(a) + 1;
      (t.unshift(o.length > 1 ? `${i}:nth-of-type(${s})` : i), (n = r));
    }
    return t.join(` > `);
  }

  function mg(e) {
    let t = e.key;
    return t === ` ` || t === `Spacebar` ? `Space` : __contentScope.pg.has(t) ? t : void 0;
  }

  function hg(e, t, n) {
    if (!Number.isFinite(t) || !Number.isFinite(n)) return;
    let r = e.getBoundingClientRect();
    if (!(r.width > 0) || !(r.height > 0)) return;
    let i = (e) => Math.min(1, Math.max(0, e));
    return { rx: i((t - r.left) / r.width), ry: i((n - r.top) / r.height) };
  }

  function gg(e) {
    let t = { tag: e.tagName.toLowerCase() },
      n = e.getAttribute(`aria-label`)?.trim();
    n && (t.aria = n);
    let r = e.getAttribute(`name`)?.trim();
    r && (t.name = r);
    let i = e.getAttribute(`data-testid`)?.trim();
    i && (t.testId = i);
    let a = e.getAttribute(`role`)?.trim();
    if ((a && (t.role = a), e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement))
      t.inputType = e instanceof HTMLInputElement ? e.type : `textarea`;
    else if (!(0, __contentScope.Dg)(e)) {
      let n = (0, __contentScope.me)(e);
      n && (t.text = n.slice(0, 80));
    }
    return Object.keys(t).length > 1 ? t : void 0;
  }

  function _g(e, t = () => !1) {
    let n = e.getAttribute(`data-testid`);
    if (n) {
      let t = `[data-testid="${(0, __contentScope.Xh)(n)}"]`;
      if (!(0, __contentScope.dg)(t, e)) return t;
    }
    if (e.id && !(0, __contentScope.ag)(e.id)) {
      let t = `#${e.id}`;
      if (!(0, __contentScope.dg)(t, e)) return t;
    }
    let r = e.getAttribute(`name`);
    if (r) {
      let t = `${e.tagName.toLowerCase()}[name="${(0, __contentScope.Xh)(r)}"]`;
      if (!(0, __contentScope.dg)(t, e)) return t;
    }
    let i = e.getAttribute(`aria-label`);
    if (i?.trim() && !t(i)) {
      let t = `text=${i.replace(/,/g, ` `).replace(/\s+/g, ` `).trim().slice(0, 80)}`;
      if (!(0, __contentScope.dg)(t, e)) return t;
    }
    if (!(0, __contentScope.Dg)(e)) {
      let n = (0, __contentScope.Zh)(e);
      if (n && !t(n)) {
        let t = `text=${n}`;
        if (!(0, __contentScope.dg)(t, e)) return t;
      }
    }
    if (
      describeLotteryClick(
        e,
        (0, __contentScope.yg)(e),
        (0, __contentScope.bg)(),
        __contentScope.Eg,
      )
    ) {
      const selector = stableLotteryControlSelector(e, document);
      if (selector) return selector;
    }
    let a = (0, __contentScope.lg)(e);
    return a.length > 0
      ? [...a, (0, __contentScope.ug)(e, e.getRootNode())].join(` >>> `)
      : (0, __contentScope.fg)(e) || e.tagName.toLowerCase();
  }

  function vg(e) {
    let t = (0, __contentScope.Dg)(e)
      ? (e.getAttribute(`placeholder`) ?? ``)
      : (e.innerText ?? e.textContent ?? ``);
    return `${e.getAttribute(`aria-label`) ?? ``} ${t}`.replace(/\s+/g, ` `).trim().slice(0, 80);
  }

  function yg(e) {
    let t = (0, __contentScope.vg)(e);
    return /密码|password|token|secret|验证码|captcha/i.test(t) ? `` : t;
  }

  function bg() {
    try {
      let e = new URL(location.href);
      return `${e.pathname}${(0, __contentScope.Nh)(e.hash)}`.slice(0, 500);
    } catch {
      return `/`;
    }
  }

  function xg(e) {
    try {
      let t = new URL(e);
      return t.protocol !== `http:` && t.protocol !== `https:`
        ? void 0
        : ((t.username = ``),
          (t.password = ``),
          (t.search = ``),
          (t.hash = ``),
          `${t.origin}${t.pathname}`.slice(0, 1e3));
    } catch {
      return;
    }
  }

  function Sg() {
    return document.body?.innerText ?? document.body?.textContent ?? ``;
  }

  function Tg(e) {
    return e.matches(__contentScope.Cg) || e.matches(__contentScope.wg);
  }

  function Eg(e) {
    if (e === document.body || e === document.documentElement) return !1;
    try {
      return getComputedStyle(e).cursor === `pointer`;
    } catch {
      return !1;
    }
  }

  function Dg(e) {
    let t = e.getAttribute(`contenteditable`);
    return t === `` || t?.toLowerCase() === `true`;
  }

  function Og(e) {
    return (
      e instanceof HTMLInputElement ||
      e instanceof HTMLTextAreaElement ||
      (e instanceof HTMLElement && (0, __contentScope.Dg)(e))
    );
  }

  function kg(e) {
    return e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement
      ? !!e.value.trim()
      : !!(e.textContent ?? ``).trim();
  }

  function Ag(e) {
    if (!(e instanceof HTMLInputElement)) return !1;
    let t = [
      e.name,
      e.id,
      e.autocomplete,
      e.getAttribute(`aria-label`) ?? ``,
      e.placeholder,
      ...(e.labels ? [...e.labels].map((e) => e.textContent ?? ``) : []),
    ].join(` `);
    return e.autocomplete === `one-time-code` || __contentScope.Oh.test(t);
  }

  function jg(e) {
    if (!(e instanceof HTMLInputElement)) return;
    let t = [
      e.name,
      e.id,
      e.autocomplete,
      e.getAttribute(`aria-label`) ?? ``,
      e.placeholder,
      ...(e.labels ? [...e.labels].map((e) => e.textContent ?? ``) : []),
    ].join(` `);
    if (!(__contentScope.Oh.test(t) || e.autocomplete === `new-password`)) {
      if (e.type === `password` || e.autocomplete === `current-password`) return `password`;
      if (
        e.autocomplete === `username` ||
        e.type === `email` ||
        e.type === `tel` ||
        __contentScope.Dh.test(t)
      )
        return `username`;
    }
  }

  function Mg(e, t, n, r) {
    let i = `${t} ${e.getAttribute(`aria-label`) ?? ``} ${n ?? ``}`;
    if (__contentScope.kh.test(i)) return `oauth`;
    let a = e.getAttribute(`type`);
    if (
      ((e instanceof HTMLButtonElement || e instanceof HTMLInputElement) &&
        (a === `submit` || a === `image`)) ||
      (r && __contentScope.jh.test(t))
    )
      return `submit`;
    if (__contentScope.Ah.test(t)) return `entry`;
  }

  function Pg(e = window) {
    return e.top === e.self;
  }

  function Lg(e, t, options = {}) {
    let n = e.createElement(`div`);
    (n.setAttribute(__contentScope.Fg, t.title),
      n.style.setProperty(`position`, `fixed`),
      n.style.setProperty(`z-index`, `2147483647`),
      n.style.setProperty(`pointer-events`, `none`));
    let r = n.attachShadow({ mode: `closed` }),
      i = e.createElement(`style`);
    i.textContent = __contentScope.Ig;
    let a = e.createElement(`div`);
    ((a.className = `card`),
      a.setAttribute(`role`, `status`),
      a.setAttribute(`aria-live`, `polite`),
      a.style.setProperty(`pointer-events`, `none`));
    let o = e.createElement(`div`);
    o.className = `title`;
    let s = e.createElement(`div`);
    s.className = `steps`;
    let c = e.createElement(`div`);
    c.className = `hint`;
    let l = e.createElement(`div`);
    let identityStatus = e.createElement('div');
    identityStatus.className = 'identity-status';
    let identityControls = e.createElement('div');
    identityControls.className = 'identity-controls';
    const identityButtons = [];
    for (const [field, label] of [
      ['userId', '选择用户 ID'],
      ['username', '选择登录名'],
      ['email', '选择邮箱'],
    ]) {
      const button = e.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => options.onPickIdentity?.(field));
      identityButtons.push([field, button]);
      identityControls.append(button);
    }
    ((l.className = `warning`),
      a.append(s, o, c, l, identityStatus, identityControls),
      r.append(i, a),
      (e.body ?? e.documentElement)?.append(n));
    function u(t) {
      ((o.textContent = t.title),
        (c.textContent = t.hint),
        (l.textContent = t.warning ?? ``),
        s.replaceChildren(
          ...t.steps.map((t, n) => {
            let r = e.createElement(`span`);
            r.className = `step step-${t.state}`;
            let i = e.createElement(`span`);
            ((i.className = `step-number`), (i.textContent = `${n + 1}`));
            let a = e.createElement(`span`);
            return ((a.textContent = t.label), r.append(i, a), r);
          }),
        ),
        n.setAttribute(__contentScope.Fg, t.title));
    }
    return (
      u(t),
      {
        host: n,
        root: a,
        styleElement: i,
        text: () =>
          [
            ...Array.from(s.children).map((e) => e.textContent ?? ``),
            o.textContent ?? ``,
            c.textContent ?? ``,
            l.textContent ?? ``,
          ]
            .filter((e) => e.trim().length > 0)
            .join(` `),
        update: u,
        updateIdentity(text, picking) {
          identityStatus.textContent = text;
          for (const [field, button] of identityButtons)
            button.setAttribute('aria-pressed', String(field === picking));
        },
        destroy: () => n.remove(),
      }
    );
  }

  function Rg(e = {}) {
    let t = e.doc ?? document,
      n = e.canRender ?? __contentScope.Pg,
      r = `checkin`,
      i = [],
      a = null,
      identityController,
      identityStatus = '自动查找当前用户的身份，也可点选页面中的身份字段',
      identityPicking = null;
    function o() {
      return (0, __contentScope.Bm)((0, __contentScope.jm)(i, r));
    }
    function s() {
      if (!n()) return null;
      a ??= (0, __contentScope.Lg)(t, o(), {
        onPickIdentity: (field) => identityController?.pickIdentity?.(field),
      });
      a.updateIdentity?.(identityStatus, identityPicking);
      return a;
    }
    return {
      begin(e) {
        ((r = e.kind ?? `checkin`), (i = [...e.events]), s()?.update(o()));
      },
      push(e) {
        (i.push(e), s()?.update(o()));
      },
      setIdentityController(controller) {
        identityController = controller;
      },
      setIdentityStatus(text, picking) {
        identityStatus = text;
        identityPicking = picking;
        s()?.updateIdentity?.(text, picking);
      },
      end() {
        (a?.destroy(), (a = null), (i = []), (identityController = undefined));
        identityStatus = '自动查找当前用户的身份，也可点选页面中的身份字段';
        identityPicking = null;
      },
    };
  }

  function createLearningIdentityMonitor(send, options = {}) {
    let timer,
      previous,
      sent,
      pending = Promise.resolve(),
      failure;
    function observe() {
      const identity = options.readVisible ? options.readVisible() : (0, __contentScope.Bi)();
      const identityPath = location.pathname + location.hash;
      const sampleKey = identitySampleKey(identity);
      if (!sampleKey) {
        previous = undefined;
        sent = undefined;
        return;
      }
      const key = JSON.stringify([
        identityPath,
        sampleKey,
        identity.identitySource,
        identity.selectedFields,
      ]);
      if (key !== previous) {
        previous = key;
        return;
      }
      if (key === sent) return;
      sent = key;
      pending = pending
        .then(() => send({ identity, path: identityPath }))
        .then((result) => {
          if (!result?.ok) throw Error(result?.error || '学习页用户 ID 未保存');
          if (result.ignored) sent = undefined;
          failure = undefined;
        })
        .catch((error) => {
          sent = undefined;
          failure = error;
        });
    }
    return {
      start() {
        if (timer === undefined) {
          observe();
          timer = setInterval(observe, 650);
        }
      },
      stop() {
        if (timer !== undefined) clearInterval(timer);
        timer = undefined;
      },
      async flush() {
        observe();
        await (0, __contentScope.w)(350);
        observe();
        await pending;
        if (failure) throw failure;
      },
    };
  }

  function zg(e, t, n, onIdentity, session = {}) {
    let r = new Set(),
      i,
      events = [...(session.events ?? [])],
      a = new __contentScope.Ng({
        kind: e,
        personalTexts: n,
        onEvent(e) {
          events.push(e);
          let n = t(e).then(
            (e) => {
              e.ok || (i ??= e.error ?? `学习事件未保存`);
            },
            (e) => {
              i ??= e instanceof Error ? e.message : String(e);
            },
          );
          (r.add(n), n.then(() => r.delete(n)));
        },
      });
    const identityTools =
      onIdentity && session.identitySite && window.top === window
        ? new IdentitySourceLearner({
            site: session.identitySite,
            send: onIdentity,
            requestIdentity: (site, token, options) => (0, __contentScope.qi)(site, token, options),
            getProgress: () => ({
              ...(0, __contentScope.jm)(events, e),
              loginAt: [...events]
                .reverse()
                .find(
                  (event) =>
                    event.loginAction === 'submit' ||
                    event.loginAction === 'oauth' ||
                    (event.type === 'fill' &&
                      event.fieldRole === 'password' &&
                      event.key === 'Enter'),
                )?.at,
            }),
            onStatus: (text, picking) => __contentScope.Bg.setIdentityStatus(text, picking),
            wait: (ms) => (0, __contentScope.w)(ms),
          })
        : null;
    let identityMonitor =
      onIdentity && window.top === window
        ? (0, __contentScope.createLearningIdentityMonitor)(
            identityTools ? (observation) => identityTools.reportVisible(observation) : onIdentity,
            identityTools ? { readVisible: () => identityTools.readVisible() } : {},
          )
        : null;
    return {
      pickIdentity: (field) => identityTools?.pick(field),
      isPickingIdentity: () => !!identityTools?.picking,
      start: () => {
        identityTools?.start();
        a.attach();
        identityMonitor?.start();
      },
      stop: () => {
        a.detach();
        identityMonitor?.stop();
        identityTools?.stop();
      },
      async flush() {
        for (a.flushPending(); r.size;) await Promise.all([...r]);
        await identityMonitor?.flush();
        await identityTools?.flush();
        if (i) throw Error(i);
        return {
          challengeSeen: a.sawChallengeField,
          unlearnedNotes: a.unlearnedNotes,
        };
      },
    };
  }

  function Hg() {
    __contentScope.Vg?.stop();
  }

  function Ug(e) {
    if (__contentScope.Vg?.runId === e.runId) {
      __contentScope.Vg.start();
      return;
    }
    (__contentScope.Vg?.stop(), __contentScope.Bg.end());
    let t = (0, __contentScope.zg)(
      e.kind ?? `checkin`,
      (t) => (
        __contentScope.Bg.push(t),
        (0, __contentScope.n)({ type: `LEARN_EVENT`, runId: e.runId, event: t })
      ),
      e.personalTexts,
      (observation) =>
        (0, __contentScope.n)({
          type: `LEARN_IDENTITY`,
          runId: e.runId,
          observation,
        }),
      e,
    );
    ((__contentScope.Vg = { ...t, runId: e.runId }),
      __contentScope.Bg.begin(e),
      __contentScope.Bg.setIdentityController(t),
      t.start());
  }

  function Wg() {
    return (0, __contentScope.z)().some((e) => {
      let t = (0, __contentScope.L)(e);
      return !__contentScope.ct.test(t) && !__contentScope.it.test(t)
        ? !1
        : !__contentScope.lt.test(t);
    });
  }
  __contentState.sm = sm;
  __contentState.cm = cm;
  __contentState.mm = mm;
  __contentState.bm = bm;
  __contentState.xm = xm;
  __contentState.Sm = Sm;
  __contentState.Cm = Cm;
  __contentState.wm = wm;
  __contentState.Tm = Tm;
  __contentState.Em = Em;
  __contentState.Dm = Dm;
  __contentState.km = km;
  __contentState.Am = Am;
  __contentState.jm = jm;
  __contentState.zm = zm;
  __contentState.Bm = Bm;
  __contentState.vh = vh;
  __contentState.yh = yh;
  __contentState.bh = bh;
  __contentState.Nh = Nh;
  __contentState.Ph = Ph;
  __contentState.Fh = Fh;
  __contentState.Ih = Ih;
  __contentState.Lh = Lh;
  __contentState.Rh = Rh;
  __contentState.zh = zh;
  __contentState.Bh = Bh;
  __contentState.Vh = Vh;
  __contentState.Uh = Uh;
  __contentState.Wh = Wh;
  __contentState.Gh = Gh;
  __contentState.Kh = Kh;
  __contentState.qh = qh;
  __contentState.Jh = Jh;
  __contentState.Xh = Xh;
  __contentState.Zh = Zh;
  __contentState.ig = ig;
  __contentState.ag = ag;
  __contentState.cg = cg;
  __contentState.lg = lg;
  __contentState.ug = ug;
  __contentState.dg = dg;
  __contentState.fg = fg;
  __contentState.mg = mg;
  __contentState.hg = hg;
  __contentState.gg = gg;
  __contentState._g = _g;
  __contentState.vg = vg;
  __contentState.yg = yg;
  __contentState.bg = bg;
  __contentState.xg = xg;
  __contentState.Sg = Sg;
  __contentState.Tg = Tg;
  __contentState.Eg = Eg;
  __contentState.Dg = Dg;
  __contentState.Og = Og;
  __contentState.kg = kg;
  __contentState.Ag = Ag;
  __contentState.jg = jg;
  __contentState.Mg = Mg;
  __contentState.Pg = Pg;
  __contentState.Lg = Lg;
  __contentState.Rg = Rg;
  __contentState.createLearningIdentityMonitor = createLearningIdentityMonitor;
  __contentState.zg = zg;
  __contentState.Hg = Hg;
  __contentState.Ug = Ug;
  __contentState.Wg = Wg;
  return {
    state: __contentState,
    api: {
      startRecording(session) {
        return (0, __contentScope.Ug)(session);
      },
      stopRecording() {
        return (0, __contentScope.Hg)();
      },
      createIdentityMonitor(send, options) {
        return (0, __contentScope.createLearningIdentityMonitor)(send, options);
      },
      createRecorder(...args) {
        return (0, __contentScope.zg)(...args);
      },
    },
    initializers: [
      {
        order: 285,
        run() {
          __contentState.lm =
            /(?:^|\/)(?:login|log-in|signin|sign-in|signup|sign-up|register|oauth|authorize|auth|password|reset|forgot)(?:\/|$)/i;
        },
      },
      {
        order: 286,
        run() {
          __contentState.um = /(?:^|\/)(?:logout|log-out|signout|sign-out)(?:\/|$)/i;
        },
      },
      {
        order: 287,
        run() {
          __contentState.dm = /(?:^|\/)(?:profile|personal|account|user|me)\/?$/i;
        },
      },
      {
        order: 288,
        run() {
          __contentState.fm =
            /(?:^|\/)(?:settings?|preferences?|config|billing|payments?|invoices?|subscription|plans?|pricing|orders?|usage|logs?|tokens?|keys?|api-?keys?|security|passwords?|passkeys?|2fa|mfa|notifications?|invites?|affiliate|referrals?)(?:\/|$)/i;
        },
      },
      {
        order: 289,
        run() {
          __contentState.pm =
            /(?:^|\/)(?:check-?in|daily|rewards?|claim|points|lottery|draw|prize)(?:\/|$)/i;
        },
      },
      {
        order: 290,
        run() {
          __contentState.hm = (0, __contentScope.P)(
            /^(?:退出登录|退出账号|退出|登出|注销|log\s?out|sign\s?out|logout)$/i,
          );
        },
      },
      {
        order: 291,
        run() {
          __contentState.gm = (0, __contentScope.P)(
            /(?:签到|打卡|领取|抽奖|抽签|翻牌|check[\s-]?in|daily|claim|redeem|\b(?:start\s+)?draw\b)/i,
          );
        },
      },
      {
        order: 292,
        run() {
          __contentState._m = (0, __contentScope.P)(
            /个人(?:资料|信息|中心)|账户信息|账号信息|我的(?:账户|账号|资料|信息)|控制台|首页|设置|偏好|仪表盘|退出|登出|profile|personal|account|dashboard|console|preferences?|logout|log\s?out/i,
          );
        },
      },
      {
        order: 293,
        run() {
          __contentState.vm = (0, __contentScope.P)(/已签到|今日已|已经签到/);
        },
      },
      {
        order: 294,
        run() {
          __contentState.ym = (0, __contentScope.P)(/签到成功|打卡成功|领取成功/);
        },
      },
      {
        order: 295,
        run() {
          __contentState.Om = { none: 0, action: 1, confirmed: 2, already: 3 };
        },
      },
      {
        order: 296,
        run() {
          __contentState.Mm = [`①`, `②`, `③`, `④`];
        },
      },
      {
        order: 297,
        run() {
          __contentState.Nm = [`登录`, `账号页`, `签到`, `结束`];
        },
      },
      {
        order: 298,
        run() {
          __contentState.Pm = [`登录`, `结束`];
        },
      },
      {
        order: 299,
        run() {
          __contentState.Fm = `检测到这次演示点了「退出登录」：会话已经断开，请重新登录后再继续演示（这段演示不建议保存）`;
        },
      },
      {
        order: 300,
        run() {
          __contentState.Im = {
            login: `在打开的站点上手动登录；全程不要点「退出登录」`,
            profile: `先经过能显示当前账号的页面（如「个人资料 / 我的账户」），再进签到页`,
            checkin: `点一次真正的签到/领取按钮；当天已经签过的站点学不到签到流程`,
            done: `回到扩展里点「结束学习」保存`,
          };
        },
      },
      {
        order: 301,
        run() {
          __contentState.Lm = `若本站是「登录即签到」（登录成功后自动完成、页面上没有签到按钮），回扩展里点「登录即签到」即可保存完整流程`;
        },
      },
      {
        order: 302,
        run() {
          __contentState.Rm = {
            login: `手动完成一次登录（填好账号密码并提交，或点第三方登录），全程不要点「退出登录」`,
            profile: __contentScope.Im.profile,
            checkin: __contentScope.Im.checkin,
            done: `回到扩展里点「结束学习」保存`,
          };
        },
      },
      {
        order: 323,
        run() {
          __contentState.gh = 1e6;
        },
      },
      {
        order: 324,
        run() {
          __contentState._h =
            /(?:^|[-_\s])(?:knob|handle|thumb|slider|drag|pull)(?:$|[-_\s])|滑块|滑轨|拖动|拉动|向右滑/i;
        },
      },
      {
        order: 325,
        run() {
          __contentState.xh = (0, __contentScope.P)(
            /签到|打卡|领取|奖励|福利|抽奖|抽签|翻牌|check[\s-]?in|claim|attendance|daily|\b(?:start\s+)?draw\b/i,
          );
        },
      },
      {
        order: 326,
        run() {
          ((0, __contentScope.P)(
            /个人资料|个人信息|账户信息|账号信息|我的(?:账户|账号|资料)|profile|my\s+account|account\s+(?:settings|info|details)|user\s+center/i,
          ),
            (0, __contentScope.P)(
              /个人(?:资料|信息|中心)|账户信息|账号信息|我的(?:账户|账号|资料|信息)|控制台|首页|设置|偏好|仪表盘|退出|登出|profile|personal|account|dashboard|console|preferences?|logout|log\s?out/i,
            ));
        },
      },
      {
        order: 327,
        run() {
          __contentState.Sh = [...__contentScope.tt, ...__contentScope.nt];
        },
      },
      {
        order: 328,
        run() {
          __contentState.Ch = [...__contentScope.F, ...__contentScope.rt];
        },
      },
      {
        order: 329,
        run() {
          __contentState.wh = [
            `领取失败`,
            `签到失败`,
            `操作失败`,
            `请稍后重试`,
            `系统繁忙`,
            `check-in failed`,
          ];
        },
      },
      {
        order: 330,
        run() {
          __contentState.Th = [
            `请完成验证`,
            `人机验证`,
            `验证码`,
            `请先登录`,
            `登录已过期`,
            `verify you are human`,
          ];
        },
      },
      {
        order: 331,
        run() {
          __contentState.Eh = [
            ...__contentScope.Ch,
            ...__contentScope.Sh,
            ...__contentScope.wh,
            ...__contentScope.Th,
          ];
        },
      },
      {
        order: 332,
        run() {
          __contentState.Dh =
            /(?:user(?:name)?|account|e-?mail|login|phone|mobile|用户名|用户|账号|账户|邮箱|手机号|手机)/i;
        },
      },
      {
        order: 333,
        run() {
          __contentState.Oh =
            /(?:one[-_ ]?time|captcha|verification|verify|otp|totp|mfa|2fa|security[-_ ]?code|验证码|校验码|动态码|token|secret)/i;
        },
      },
      {
        order: 334,
        run() {
          __contentState.kh =
            /(?:github|google|discord|telegram|microsoft|linux.?do|oauth|sso|passkey|webauthn|第三方)/i;
        },
      },
      {
        order: 335,
        run() {
          __contentState.Ah =
            /(?:log\s?in|sign\s?in|登录|登陆|账号密码|邮箱登录|使用密码|use password|email login)/i;
        },
      },
      {
        order: 336,
        run() {
          __contentState.jh =
            /^(?:log\s?in|sign\s?in|login|登录|登陆|立即登录|提交|继续|下一步|continue|next|submit)$/i;
        },
      },
      {
        order: 337,
        run() {
          __contentState.Mh =
            /(?:^#|[?&])(?:access[_-]?token|refresh[_-]?token|id[_-]?token|token|code|state|secret|password|credential|session|auth)=/i;
        },
      },
      {
        order: 338,
        run() {
          __contentState.Hh = 3;
        },
      },
      {
        order: 339,
        run() {
          __contentState.Yh = 24;
        },
      },
      {
        order: 340,
        run() {
          __contentState.Qh = /^[A-Za-z][A-Za-z0-9_-]{0,80}$/;
        },
      },
      {
        order: 341,
        run() {
          __contentState.$h = /(?:^|[-_])_r_[0-9a-z]{1,4}_(?:$|[-_])/i;
        },
      },
      {
        order: 342,
        run() {
          __contentState.eg = /^(?:radix|base-?ui)-/i;
        },
      },
      {
        order: 343,
        run() {
          __contentState.tg = /(?:^|[-_])(?:react-select|downshift)-\d+(?:[-_]|$)/i;
        },
      },
      {
        order: 344,
        run() {
          __contentState.ng = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        },
      },
      {
        order: 345,
        run() {
          __contentState.rg = 8;
        },
      },
      {
        order: 346,
        run() {
          __contentState.og = /(?:^|[\s>+~,(])#([^\s>+~,[\]]+)/g;
        },
      },
      {
        order: 347,
        run() {
          __contentState.sg = /^[#.]?:r[0-9a-z]+:$/i;
        },
      },
      {
        order: 348,
        run() {
          __contentState.pg = new Set([
            `Enter`,
            `Space`,
            `Escape`,
            `Tab`,
            `ArrowUp`,
            `ArrowDown`,
            `ArrowLeft`,
            `ArrowRight`,
          ]);
        },
      },
      {
        order: 349,
        run() {
          __contentState.Cg = __contentScope.de;
        },
      },
      {
        order: 350,
        run() {
          __contentState.wg = `[onclick], [tabindex]:not([tabindex="-1"])`;
        },
      },
      {
        order: 351,
        run() {
          __contentState.Ng = class {
            onEvent;
            settleMs;
            scrollStopMs;
            learningKind;
            fused;
            pending = new Set();
            restoreHistory = [];
            lastPath = ``;
            navigationTimer = null;
            attached = !1;
            pendingFill = null;
            scrollTimer = null;
            pendingScroll = null;
            scrollState = null;
            passwordSeen = !1;
            challengeSeen = !1;
            pointerDown = null;
            mouseDown = null;
            pointerUp = null;
            pendingKey = null;
            lotteryActionAt = null;
            unlearned = [];
            isPersonal;
            constructor(e) {
              ((this.onEvent = e.onEvent),
                (this.settleMs = e.settleMs ?? 700),
                (this.scrollStopMs = e.scrollStopMs ?? 200),
                (this.learningKind = e.kind ?? `checkin`),
                (this.fused = this.learningKind !== `login`));
              let t = (0, __contentScope.Uh)(e.personalTexts);
              this.isPersonal = (e) => !__contentScope.xh.test(e ?? ``) && t(e);
            }
            attach() {
              this.attached ||
                ((this.attached = !0),
                document.addEventListener(`click`, this.onClick, !0),
                document.addEventListener(`contextmenu`, this.onContextMenu, !0),
                document.addEventListener(`input`, this.onInput, !0),
                document.addEventListener(`change`, this.onInput, !0),
                document.addEventListener(`keydown`, this.onKeyDown, !0),
                document.addEventListener(`pointerdown`, this.onPointerDown, !0),
                document.addEventListener(`pointerup`, this.onPointerUp, !0),
                document.addEventListener(`mousedown`, this.onPointerDown, !0),
                document.addEventListener(`mouseup`, this.onPointerUp, !0),
                document.addEventListener(`scroll`, this.onScroll, !0),
                window.addEventListener(`scroll`, this.onScroll, !0),
                window.addEventListener(`popstate`, this.recordNavigation),
                window.addEventListener(`hashchange`, this.recordNavigation),
                this.restoreHistory.push(this.wrap(`pushState`), this.wrap(`replaceState`)),
                (this.navigationTimer = setInterval(this.recordNavigation, 200)),
                this.recordNavigation());
            }
            detach() {
              if (this.attached) {
                (this.flushPending(),
                  (this.attached = !1),
                  this.navigationTimer && clearInterval(this.navigationTimer),
                  (this.navigationTimer = null),
                  document.removeEventListener(`click`, this.onClick, !0),
                  document.removeEventListener(`contextmenu`, this.onContextMenu, !0),
                  document.removeEventListener(`input`, this.onInput, !0),
                  document.removeEventListener(`change`, this.onInput, !0),
                  document.removeEventListener(`keydown`, this.onKeyDown, !0),
                  document.removeEventListener(`pointerdown`, this.onPointerDown, !0),
                  document.removeEventListener(`pointerup`, this.onPointerUp, !0),
                  document.removeEventListener(`mousedown`, this.onPointerDown, !0),
                  document.removeEventListener(`mouseup`, this.onPointerUp, !0),
                  document.removeEventListener(`scroll`, this.onScroll, !0),
                  window.removeEventListener(`scroll`, this.onScroll, !0),
                  window.removeEventListener(`popstate`, this.recordNavigation),
                  window.removeEventListener(`hashchange`, this.recordNavigation));
                for (let e of this.restoreHistory) e();
                this.restoreHistory.length = 0;
              }
            }
            get sawChallengeField() {
              return this.challengeSeen;
            }
            get unlearnedNotes() {
              return this.unlearned;
            }
            flushPending() {
              this.attached && this.recordNavigation();
              let e = [...this.pending];
              this.pending.clear();
              let t = this.pendingFill;
              ((this.pendingFill = null),
                t && (t.timer && clearTimeout(t.timer), this.emitFill(t, !0)),
                this.flushScroll());
              for (let t of e) t();
            }
            onScroll = (e) => {
              this.attached &&
                (this.recordNavigation(),
                (this.pendingScroll = (0, __contentScope.Lh)(
                  e.target instanceof HTMLElement ? e.target : void 0,
                )),
                this.scrollTimer && clearTimeout(this.scrollTimer),
                (this.scrollTimer = setTimeout(() => {
                  ((this.scrollTimer = null), this.settleScroll());
                }, this.scrollStopMs)));
            };
            flushScroll() {
              ((this.scrollTimer &&= (clearTimeout(this.scrollTimer), null)), this.settleScroll());
            }
            settleScroll() {
              if (!this.pendingScroll) return;
              let e = this.pendingScroll;
              if (((this.pendingScroll = null), !e.pageY && !e.scrolled)) {
                this.scrollState = null;
                return;
              }
              this.scrollState = e;
              let t = e.scrollContainer === void 0 ? e.ratio : e.containerRatio;
              t !== void 0 &&
                Number.isFinite(t) &&
                t > 0 &&
                this.attached &&
                this.onEvent({
                  type: `scroll`,
                  path: (0, __contentScope.bg)(),
                  ratio: Math.min(1, Math.max(0, t)),
                  ...(e.scrollContainer ? { container: e.scrollContainer } : {}),
                  at: Date.now(),
                });
            }
            takeScroll() {
              let e = this.pendingScroll ?? this.scrollState;
              return (
                (this.scrollState = null),
                (this.pendingScroll = null),
                (this.scrollTimer &&= (clearTimeout(this.scrollTimer), null)),
                e
              );
            }
            currentElement(e) {
              if (
                e
                  .composedPath()
                  .some(
                    (node) =>
                      node?.hasAttribute?.('data-checkin-learning-guide') ||
                      node?.hasAttribute?.('data-checkin-identity-picker'),
                  )
              )
                return null;
              let t = null,
                lotteryControl = null;
              for (let n of e.composedPath())
                if (n instanceof HTMLElement) {
                  if ((0, __contentScope.Tg)(n)) return n;
                  !t && (0, __contentScope.Eg)(n) && (t = n);
                  if (
                    !lotteryControl &&
                    describeLotteryClick(
                      n,
                      (0, __contentScope.yg)(n),
                      (0, __contentScope.bg)(),
                      __contentScope.Eg,
                    )
                  )
                    lotteryControl = n;
                }
              return lotteryControl ?? t;
            }
            recordNavigation = () => {
              let e = (0, __contentScope.bg)();
              e !== this.lastPath &&
                ((this.lastPath = e),
                this.takeScroll(),
                this.onEvent({ type: `navigation`, path: e, at: Date.now() }));
            };
            wrap = (e) => {
              let t = history[e],
                n = this.recordNavigation;
              return (
                (history[e] = function (...e) {
                  let r = t.apply(this, e);
                  return (n(), r);
                }),
                () => {
                  history[e] = t;
                }
              );
            };
            schedule(e, t = this.settleMs) {
              let n = setTimeout(() => {
                  (this.pending.delete(r), e());
                }, t),
                r = () => {
                  (clearTimeout(n), e());
                };
              this.pending.add(r);
            }
            onPointerDown = (e) => {
              let t = {
                x: e.clientX,
                y: e.clientY,
                target: e.target instanceof Element ? e.target : null,
                at: Date.now(),
              };
              (e.type === `pointerdown` ? (this.pointerDown = t) : (this.mouseDown = t),
                (this.pointerUp = null));
            };
            onKeyDown = (e) => {
              if (!this.attached) return;
              let t = (0, __contentScope.mg)(e);
              if (!t) {
                this.pendingKey = null;
                return;
              }
              this.pendingKey = { key: t, target: e.target, at: Date.now() };
              let n = this.pendingFill;
              if (n && e.target instanceof Element) {
                let r = this.findFillTarget(n.selector);
                r && (r === e.target || r.contains(e.target)) && (n.key = t);
              }
            };
            takePendingKey(e) {
              let t = this.pendingKey;
              if (((this.pendingKey = null), !t || Date.now() - t.at > 1e3)) return;
              let n = t.target instanceof Element ? t.target : null;
              if (n === null || n === e || n.contains(e) || e.contains(n)) return t.key;
            }
            onPointerUp = (e) => {
              let t = e.type === `pointerup`,
                n = t ? this.pointerDown : this.mouseDown;
              if (n === null) return;
              t ? (this.pointerDown = null) : (this.mouseDown = null);
              let r = Math.hypot(e.clientX - n.x, e.clientY - n.y) >= 12,
                i = this.pointerUp?.dragged === !0 && Date.now() - (this.pointerUp?.at ?? 0) <= 500,
                a = this.pointerUp?.recorded === !0;
              ((this.pointerUp = {
                dragged: r || i,
                downTarget: n.target,
                upTarget: e.target instanceof Element ? e.target : null,
                at: Date.now(),
                downX: n.x,
                downY: n.y,
                upX: e.clientX,
                upY: e.clientY,
                holdMs: Date.now() - n.at,
              }),
                this.attached &&
                  this.pointerUp.dragged &&
                  !a &&
                  this.recordDrag(this.pointerUp, e) &&
                  this.pointerUp &&
                  (this.pointerUp.recorded = !0));
            };
            dragTailClick(e) {
              let t = this.pointerUp;
              if (!t || !t.dragged || Date.now() - t.at > 500) return null;
              let n = e.target instanceof Element ? e.target : null;
              return n !== null &&
                [t.downTarget, t.upTarget].some(
                  (e) => e !== null && (e === n || e.contains(n) || n.contains(e)),
                )
                ? ((this.pointerUp = null), t)
                : null;
            }
            recordDrag(e, t) {
              if (Math.hypot(e.upX - e.downX, e.upY - e.downY) < 24) return !1;
              let n =
                  e.downTarget instanceof HTMLElement
                    ? e.downTarget
                    : (0, __contentScope.vh)(t.composedPath()),
                r =
                  e.upTarget instanceof HTMLElement
                    ? e.upTarget
                    : (0, __contentScope.vh)(t.composedPath()),
                i = () => !0;
              if ((n && (0, __contentScope.Ql)(n)) || (r && (0, __contentScope.Ql)(r)))
                return (
                  this.unlearned.push(`拖拽验证控件：这一步不会写进流程（回放时由自动验证处理）`),
                  i()
                );
              if (!n || !r || !(0, __contentScope.yh)(n) || !(0, __contentScope.yh)(r))
                return (
                  this.unlearned.push(`这一步拖拽的起点或终点不是可稳定回放的控件，未写进流程`),
                  i()
                );
              let a = (0, __contentScope._g)(n, this.isPersonal),
                o = (0, __contentScope._g)(r, this.isPersonal);
              if (!a || !o)
                return (this.unlearned.push(`这一步拖拽没有可回放的稳定选择器，未写进流程`), i());
              if ((r === n || n.contains(r) || r.contains(n)) && (0, __contentScope.bh)(n))
                return (
                  this.unlearned.push(
                    `识别到一次把手/滑块拖拽：这类拖拽不会写进流程，回放时由站点自身处理`,
                  ),
                  i()
                );
              let s = (0, __contentScope.bg)(),
                c = Date.now(),
                l = (0, __contentScope.hg)(n, e.downX, e.downY),
                u = (0, __contentScope.hg)(r, e.upX, e.upY),
                d = this.takeScroll(),
                f = (0, __contentScope.Lh)(n),
                p = (0, __contentScope.Bh)(
                  (0, __contentScope.Vh)(f.scrolled ? f : d?.pageY ? d : f),
                ),
                m = (0, __contentScope.yg)(n),
                h = this.learningKind === `login` ? [] : (0, __contentScope.qh)();
              return (
                this.onEvent({
                  ...p,
                  type: `drag`,
                  selector: a,
                  toSelector: o,
                  label: m,
                  path: s,
                  ...(l ? { anchor: l } : {}),
                  ...(u ? { toAnchor: u } : {}),
                  at: c,
                }),
                this.learningKind === `login` ||
                  this.schedule(() => {
                    if (!this.attached || (0, __contentScope.bg)() !== s) return;
                    let e = (0, __contentScope.Jh)(
                        h,
                        (0, __contentScope.qh)(),
                        (0, __contentScope.Sg)(),
                      ),
                      t = (0, __contentScope.Wh)(
                        (0, __contentScope.Sg)(),
                        __contentScope.it.test(m),
                      );
                    (e || t) &&
                      this.onEvent({
                        ...p,
                        type: `drag`,
                        selector: a,
                        toSelector: o,
                        label: m,
                        path: s,
                        ...(e ? { afterText: e } : {}),
                        ...(t ? { evidence: t } : {}),
                        at: c,
                      });
                  }),
                i()
              );
            }
            onContextMenu = (e) => {
              if (!this.attached) return;
              this.recordNavigation();
              let t = this.currentElement(e);
              if (!t) return;
              if ((0, __contentScope.Ql)(t)) {
                this.unlearned.push(
                  `点击人机验证控件：这一步不会写进流程，回放时由自动验证接管，可能需要人工完成`,
                );
                return;
              }
              let n = (0, __contentScope.bg)(),
                r = (0, __contentScope._g)(t, this.isPersonal),
                i = (0, __contentScope.yg)(t),
                a = (0, __contentScope.hg)(t, e.clientX, e.clientY),
                o = (0, __contentScope.gg)(t),
                s = this.takeScroll(),
                c = (0, __contentScope.Lh)(t),
                l = (0, __contentScope.Bh)(
                  (0, __contentScope.Vh)(c.scrolled ? c : s?.pageY ? s : c),
                );
              this.onEvent({
                ...l,
                type: `click`,
                selector: r,
                label: i,
                path: n,
                gesture: `right`,
                ...(a ? { anchor: a } : {}),
                ...(o ? { fingerprint: o } : {}),
                at: Date.now(),
              });
            };
            onClick = (e) => {
              this.recordNavigation();
              let t = this.dragTailClick(e);
              if (t) {
                if (t.recorded === !0 || this.recordDrag(t, e)) {
                  this.pointerUp = null;
                  return;
                }
                this.pointerUp = null;
              }
              let n = this.currentElement(e);
              if (!n || (0, __contentScope.R)(n)) return;
              if ((0, __contentScope.Ql)(n)) {
                this.unlearned.push(
                  `点击人机验证控件：这一步不会写进流程，回放时由自动验证接管，可能需要人工完成`,
                );
                return;
              }
              let r = n instanceof HTMLAnchorElement ? n.href : void 0;
              if (r && /^(?:javascript:|mailto:|tel:)/i.test(r)) return;
              let i = r ? (0, __contentScope.xg)(r) : void 0,
                a = (0, __contentScope.bg)(),
                o = (0, __contentScope._g)(n, this.isPersonal),
                s = (0, __contentScope.yg)(n),
                lotteryAction =
                  this.learningKind !== `login` && describeLotteryClick(n, s, a, __contentScope.Eg),
                c =
                  this.fused || this.learningKind === `login`
                    ? (0, __contentScope.Mg)(n, (0, __contentScope.vg)(n), i, this.passwordSeen)
                    : void 0,
                l = Date.now(),
                u = this.learningKind === `login` ? [] : (0, __contentScope.qh)(),
                lotteryBefore = lotteryAction
                  ? snapshotLotteryResults(document, __contentScope.Kh)
                  : null,
                d = this.takeScroll(),
                f = (0, __contentScope.Lh)(n),
                p = (0, __contentScope.Bh)(
                  (0, __contentScope.Vh)(f.scrolled ? f : d?.pageY ? d : f),
                ),
                m = (0, __contentScope.hg)(n, e.clientX, e.clientY),
                h = this.pointerUp?.holdMs ?? (this.pointerDown ? l - this.pointerDown.at : void 0),
                g;
              e.detail >= 2
                ? (g = `double`)
                : e.button === 2
                  ? (g = `right`)
                  : h !== void 0 && h >= 500 && (g = `long-press`);
              let _ = this.takePendingKey(n),
                v = (0, __contentScope.gg)(n);
              if (lotteryAction) this.lotteryActionAt = l;
              if (
                (this.onEvent({
                  ...p,
                  type: `click`,
                  selector: o,
                  label: s,
                  path: a,
                  ...(lotteryAction ? { checkinAction: lotteryAction } : {}),
                  ...(i ? { href: i } : {}),
                  ...(c ? { loginAction: c } : {}),
                  ...(m ? { anchor: m } : {}),
                  ...(g ? { gesture: g } : {}),
                  ...(_ ? { key: _ } : {}),
                  ...(g === `long-press` && h !== void 0 ? { holdMs: h } : {}),
                  ...(v ? { fingerprint: v } : {}),
                  at: l,
                }),
                this.learningKind === `login`)
              )
                return;
              let y = () => {
                if (!this.attached || (0, __contentScope.bg)() !== a) return;
                if (lotteryAction && this.lotteryActionAt !== l) return;
                let e = (0, __contentScope.Jh)(
                    u,
                    (0, __contentScope.qh)(),
                    (0, __contentScope.Sg)(),
                  ),
                  t = lotteryBefore
                    ? readLotteryResultEvidence(
                        lotteryBefore,
                        document,
                        __contentScope.Kh,
                        __contentScope.fg,
                      )
                    : (0, __contentScope.Wh)((0, __contentScope.Sg)());
                // 抽奖只学习结果标志，中奖兑换码和页面里其它新出现的文本不进入共享流程。
                if (lotteryBefore) e = t?.words;
                (e || t) &&
                  this.onEvent({
                    ...p,
                    type: `click`,
                    selector: o,
                    label: s,
                    path: a,
                    ...(lotteryAction ? { checkinAction: lotteryAction } : {}),
                    ...(i ? { href: i } : {}),
                    ...(e ? { afterText: e } : {}),
                    ...(t ? { evidence: t } : {}),
                    at: l,
                  });
              };
              if ((this.schedule(y), lotteryAction))
                for (let e of [2500, 6e3, 12e3]) this.schedule(y, e);
            };
            onInput = (e) => {
              this.recordNavigation();
              let t = e.composedPath().find(__contentScope.Og);
              if (!t || !(0, __contentScope.Kh)(t)) return;
              if ((0, __contentScope.Ag)(t)) {
                this.challengeSeen = !0;
                return;
              }
              let n =
                this.fused || this.learningKind === `login` ? (0, __contentScope.jg)(t) : void 0;
              if (this.learningKind === `login` && !n) return;
              n === `password` && (this.passwordSeen = !0);
              let r = (0, __contentScope._g)(t, this.isPersonal),
                i = (0, __contentScope.yg)(t),
                a = (0, __contentScope.bg)(),
                o = (0, __contentScope.kg)(t),
                s = this.pendingFill;
              if (s && s.selector === r && s.path === a) {
                ((s.hasValue = o),
                  s.timer && clearTimeout(s.timer),
                  (s.timer = this.scheduleFill(s)));
                return;
              }
              s?.timer && clearTimeout(s.timer);
              let c = {
                selector: r,
                label: i,
                path: a,
                at: Date.now(),
                before: (0, __contentScope.qh)(),
                hasValue: o,
                ...(n ? { fieldRole: n } : {}),
                scroll: (0, __contentScope.Lh)(t),
                fingerprint: (0, __contentScope.gg)(t),
              };
              ((c.timer = this.scheduleFill(c)), (this.pendingFill = c), this.emitFill(c, !1));
            };
            scheduleFill(e) {
              return setTimeout(() => {
                (this.pendingFill === e && (this.pendingFill = null), this.emitFill(e, !0));
              }, this.settleMs);
            }
            emitFill(e, t) {
              if (!this.attached) return;
              let n = e.hasValue;
              if (t) {
                let t = this.findFillTarget(e.selector);
                t && (n = (0, __contentScope.kg)(t));
              }
              let r =
                  t && !e.fieldRole && (0, __contentScope.bg)() === e.path
                    ? (0, __contentScope.Jh)(
                        e.before,
                        (0, __contentScope.qh)(),
                        (0, __contentScope.Sg)(),
                      )
                    : void 0,
                i = (0, __contentScope.Bh)((0, __contentScope.Vh)(e.scroll));
              this.onEvent({
                ...i,
                type: `fill`,
                selector: e.selector,
                label: e.label,
                path: e.path,
                hasValue: n,
                ...(e.fieldRole ? { fieldRole: e.fieldRole } : {}),
                ...(e.key ? { key: e.key } : {}),
                ...(e.fingerprint ? { fingerprint: e.fingerprint } : {}),
                ...(r ? { afterText: r } : {}),
                at: e.at,
              });
            }
            findFillTarget(e) {
              if (e.startsWith(`text=`) || e.includes(`,`)) return null;
              try {
                let t = document.querySelector(e);
                return t instanceof HTMLInputElement ||
                  t instanceof HTMLTextAreaElement ||
                  (t instanceof HTMLElement && (0, __contentScope.Dg)(t))
                  ? t
                  : null;
              } catch {
                return null;
              }
            }
          };
        },
      },
      {
        order: 352,
        run() {
          __contentState.Fg = `data-checkin-learning-guide`;
        },
      },
      {
        order: 353,
        run() {
          __contentState.Ig = `
:host {
  all: initial;
  position: fixed;
  z-index: 2147483647;
  left: 12px;
  bottom: 12px;
  display: block;
  max-width: min(360px, 70vw);
  pointer-events: none !important;
}
* { pointer-events: none !important; box-sizing: border-box; }
.card {
  font-family: system-ui, -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: #f8fafc;
  background: rgba(15, 23, 42, .92);
  border: 1px solid rgba(148, 163, 184, .45);
  border-radius: 10px;
  padding: 8px 10px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, .35);
  user-select: none;
}
.title { font-weight: 600; }
.steps { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 5px; }
.step {
  border: 1px solid rgba(148, 163, 184, .35);
  border-radius: 999px;
  padding: 0 6px;
  color: #94a3b8;
  white-space: nowrap;
}
.step-done { color: #86efac; border-color: rgba(134, 239, 172, .45); }
.step-current { color: #0f172a; background: #fbbf24; border-color: #fbbf24; font-weight: 600; }
.step-number { opacity: .7; margin-right: 2px; }
.hint { margin-top: 2px; color: #cbd5e1; }
.warning { margin-top: 4px; color: #fde68a; }
.identity-status { margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(148,163,184,.3); color: #bae6fd; overflow-wrap: anywhere; }
.identity-controls { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px; }
.identity-controls button {
  pointer-events: auto !important;
  font: inherit; color: #f8fafc; background: #334155;
  border: 1px solid #64748b; border-radius: 5px; padding: 3px 6px; cursor: pointer;
}
.identity-controls button:hover { background: #475569; }
.identity-controls button[aria-pressed="true"] { color: #0f172a; background: #fbbf24; border-color: #fbbf24; }
`;
        },
      },
      {
        order: 354,
        run() {
          __contentState.Bg = (0, __contentScope.Rg)();
        },
      },
      {
        order: 355,
        run() {
          __contentState.Vg = null;
        },
      },
    ],
  };
}
