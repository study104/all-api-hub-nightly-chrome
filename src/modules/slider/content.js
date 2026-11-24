import { bindContentState } from '../../shared/content-runtime.js';

/** 滑块验证内容逻辑：验证码定位、框架会话、图片取样、拖动和页面终态确认。  */
export function createSliderAutoContent(__contentScope) {
  const __contentState = bindContentState(__contentScope, [
    'wo',
    'To',
    'q',
    'Eo',
    'Do',
    'Oo',
    'ko',
    'Ao',
    'jo',
    'Mo',
    'No',
    'Po',
    'Fo',
    'Io',
    'Lo',
    'Ro',
    'zo',
    'Bo',
    'Vo',
    'Ho',
    'Uo',
    'Wo',
    'Go',
    'Ko',
    'qo',
    'Jo',
    'Yo',
    'Xo',
    'Zo',
    'Qo',
    '$o',
    'J',
    'Y',
    'X',
    'es',
    'ts',
    'ns',
    'rs',
    'is',
    'as',
    'os',
    'ss',
    'cs',
    'ls',
    'us',
    'ds',
    'fs',
    'ps',
    'ms',
    'hs',
    'gs',
    '_s',
    'vs',
    'ys',
    'bs',
    'xs',
    'Ss',
    'Cs',
    'ws',
    'Ts',
    'Es',
    'Ds',
    'Os',
    'ks',
    'As',
    'js',
    'Ms',
    'Ns',
    'Ps',
    'Fs',
    'Is',
    'Ls',
    'Rs',
    'zs',
    'Bs',
    'Vs',
    'Hs',
    'Us',
    'Ws',
    'Gs',
    'Ks',
    'qs',
    'Js',
    'Ys',
    'Xs',
    'Zs',
    'Qs',
    '$s',
    'ec',
    'tc',
    'nc',
    'rc',
    'ic',
    'ac',
    'oc',
    'sc',
    'cc',
    'lc',
    'uc',
    'dc',
    'fc',
    'pc',
    'mc',
    'hc',
    'gc',
    '_c',
    'vc',
    'yc',
    'bc',
    'xc',
    'Sc',
    'Cc',
    'wc',
    'Tc',
    'Ec',
    'Dc',
    'Oc',
    'kc',
    'Ac',
    'jc',
    'Mc',
    'Nc',
    'Pc',
    'Fc',
    'Ic',
    'Lc',
    'Rc',
    'zc',
    'Bc',
    'Vc',
    'Hc',
    'Uc',
    'Wc',
    'Gc',
    'Kc',
    'qc',
    'Jc',
    'Yc',
    'Xc',
    'Zc',
    'Qc',
    '$c',
    'el',
    'tl',
    'nl',
    'rl',
    'il',
    'al',
    'ol',
    'sl',
    'cl',
    'll',
    'ul',
    'dl',
    'fl',
    'pl',
    'ml',
    'hl',
    'gl',
    '_l',
    'vl',
    'yl',
    'bl',
    'xl',
    'Sl',
    'Cl',
    'wl',
    'Tl',
    'El',
    'Dl',
    'Ol',
    'kl',
    'Al',
    'jl',
    'Ml',
    'Nl',
    'Pl',
    'Fl',
    'Il',
    'Ll',
    'Rl',
    'zl',
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
    'Xl',
    'Zl',
    'Ql',
    '$l',
    'eu',
    'tu',
    'nu',
    'ru',
    'iu',
    'au',
    'ou',
    'su',
    'cu',
    'lu',
    'Z',
    'uu',
    'du',
    'fu',
    'pu',
    'mu',
    'hu',
    'gu',
    '_u',
    'vu',
    'yu',
    'bu',
    'xu',
    'Su',
    'Cu',
    'wu',
    'Tu',
    'Eu',
    'Du',
    'Ou',
    'ku',
    'Au',
    'ju',
    'Mu',
    'Nu',
    'Pu',
    'Fu',
    'Iu',
    'Lu',
    'Ru',
    'zu',
    'Ap',
    'jp',
    'Mp',
    'Np',
    'Pp',
    'Fp',
    'Ip',
    'Lp',
    'Rp',
    'zp',
    'Bp',
    'Vp',
    'Hp',
    'Up',
    'Wp',
  ]);
  function Do(e) {
    if (
      !e.isConnected ||
      !e.getClientRects().length ||
      (!(0, __contentScope.Co)(e.src) && !__contentScope.Eo.has(e.id))
    )
      return !1;
    let t = e;
    for (; t;) {
      let e = getComputedStyle(t);
      if (
        e.display === `none` ||
        e.visibility !== `visible` ||
        Number.parseFloat(e.opacity || `1`) <= 0.02
      )
        return !1;
      t = t.parentElement;
    }
    let n = e.getBoundingClientRect();
    return (
      n.width >= 150 &&
      n.height >= 90 &&
      Math.min(n.right, innerWidth) - Math.max(n.left, 0) >= 80 &&
      Math.min(n.bottom, innerHeight) - Math.max(n.top, 0) >= 60
    );
  }

  function Oo() {
    let e = [...document.querySelectorAll(`iframe`)].filter(__contentScope.Do);
    return (
      e.find((e) => {
        let t = e.getBoundingClientRect();
        return document.elementFromPoint(t.left + t.width / 2, t.top + t.height / 2) === e;
      }) ?? e[0]
    );
  }

  function qo(e) {
    return {
      mode: e,
      semantic: new WeakMap(),
      visibility: new WeakMap(),
      imageSource: new WeakMap(),
    };
  }

  function Jo(e, t = `page`) {
    let n = __contentScope.Ko;
    (!n || n.mode !== t) && (__contentScope.Ko = (0, __contentScope.qo)(t));
    try {
      return e();
    } finally {
      __contentScope.Ko = n;
    }
  }

  function Yo() {
    return (
      __contentScope.Ko?.mode === `tencent-page` || __contentScope.Ko?.mode === `tencent-frame`
    );
  }

  function Xo() {
    return (0, __contentScope.Yo)()
      ? `${__contentScope.q.widgets}, ${__contentScope.ko}`
      : __contentScope.ko;
  }

  function Zo() {
    return (0, __contentScope.Yo)()
      ? `${__contentScope.q.success}, ${__contentScope.Ao}`
      : __contentScope.Ao;
  }

  function Qo() {
    return (0, __contentScope.Yo)()
      ? `${__contentScope.q.handle}, ${__contentScope.jo}`
      : __contentScope.jo;
  }

  function $o(e) {
    return __contentScope.zo.test(e) || ((0, __contentScope.Yo)() && /groove/i.test(e));
  }

  function J(e, t = document) {
    try {
      return [...t.querySelectorAll(e)];
    } catch {
      return [];
    }
  }

  function Y(e) {
    let t = __contentScope.Ko;
    if (t?.visibility.has(e)) return t.visibility.get(e);
    let n = !1;
    if (!e.isConnected || e.getClientRects().length === 0) return !1;
    let r = e;
    for (; r;) {
      let n = window.getComputedStyle(r);
      if (
        n.display === `none` ||
        n.visibility === `hidden` ||
        n.visibility === `collapse` ||
        Number.parseFloat(n.opacity || `1`) <= 0.02 ||
        (r instanceof HTMLElement && r.hidden)
      )
        return (t && t.visibility.set(e, !1), !1);
      r = r.parentElement;
    }
    let i = e.getBoundingClientRect();
    return ((n = i.width >= 2 && i.height >= 2), t && t.visibility.set(e, n), n);
  }

  function X(e) {
    return e.getBoundingClientRect();
  }

  function es(e) {
    let t = (e) => Math.round(e * 10) / 10;
    return { x: t(e.x), y: t(e.y), width: t(e.width), height: t(e.height) };
  }

  function ts(e) {
    let t = __contentScope.Ko;
    if (t?.semantic.has(e)) return t.semantic.get(e);
    let n = [
        e.id,
        e.className,
        e.getAttribute(`role`),
        e.getAttribute(`aria-label`),
        e.getAttribute(`title`),
        e.getAttribute(`name`),
        e.getAttribute(`data-type`),
        e.getAttribute(`data-captcha-type`),
        e.getAttribute(`data-state`),
        e.getAttribute(`data-status`),
      ],
      r = (e.textContent ?? ``).replace(/\s+/g, ` `).trim().slice(0, 180),
      i = `${n.filter(Boolean).join(` `)} ${r}`.toLowerCase();
    return (t?.semantic.set(e, i), i);
  }

  function ns(e, t = 5) {
    let n = [],
      r = e;
    for (let e = 0; r && e < t; e += 1) (n.push((0, __contentScope.ts)(r)), (r = r.parentElement));
    return n.join(` `);
  }

  function rs(e) {
    let t = (0, __contentScope.ns)(e, 7);
    return __contentScope.No.test(t) && (__contentScope.Po.test(t) || __contentScope.Bo.test(t));
  }

  function is(e, t) {
    return [...e]
      .map((e) => ({ element: e, score: t(e) }))
      .filter((e) => Number.isFinite(e.score))
      .sort((e, t) => t.score - e.score);
  }

  function as(e) {
    if (!(e instanceof HTMLElement) || !(0, __contentScope.Y)(e)) return -1 / 0;
    let t = (0, __contentScope.X)(e);
    if (t.width < 12 || t.height < 12 || t.width > 180 || t.height > 110) return -1 / 0;
    if ((0, __contentScope.Yo)()) {
      let n = t.left + t.width / 2,
        r = t.top + t.height / 2;
      if (n >= 0 && r >= 0 && n < innerWidth && r < innerHeight) {
        let t = document.elementFromPoint(n, r);
        if (!t || !(t === e || e.contains(t))) return -1 / 0;
      }
    }
    let n = (0, __contentScope.ts)(e),
      r = (0, __contentScope.ns)(e, 7),
      i = 0;
    ((0, __contentScope.Yo)() && e.matches(__contentScope.q.handle) && (i += 12),
      e.getAttribute(`role`)?.toLowerCase() === `slider` && (i += 8),
      __contentScope.Fo.test(n) ? (i += 9) : __contentScope.Po.test(n) && (i += 4),
      __contentScope.No.test(r) && (i += 7),
      __contentScope.Bo.test(r) && (i += 4),
      __contentScope.Po.test(r) && (i += 2),
      __contentScope.Io.test(r) && !__contentScope.No.test(r) && (i -= 14),
      e instanceof HTMLInputElement &&
        e.type === `range` &&
        !__contentScope.No.test(r) &&
        (i -= 12),
      t.width <= 100 && t.height <= 80 && (i += 2));
    let a = window.getComputedStyle(e).cursor;
    return ((a === `grab` || a === `grabbing` || a === `pointer` || a === `move`) && (i += 2), i);
  }

  function os() {
    let e = (0, __contentScope.J)((0, __contentScope.Qo)()),
      t = (0, __contentScope.J)(`button, [role], [draggable], [class], [id]`)
        .slice(0, __contentScope.Uo)
        .filter((e) => __contentScope.Fo.test((0, __contentScope.ts)(e)));
    return [...new Set([...e, ...t])]
      .filter((e) => e instanceof HTMLElement)
      .map((e) => ({ element: e, score: (0, __contentScope.as)(e) }))
      .filter((e) => Number.isFinite(e.score))
      .sort((e, t) => t.score - e.score)
      .map((e) => e.element);
  }

  function ss(e, t) {
    if (!(0, __contentScope.Y)(e) || !e.contains(t)) return -1 / 0;
    let n = (0, __contentScope.X)(e),
      r = (0, __contentScope.X)(t);
    if (n.width < r.width * 2 || n.height < r.height * 1.6) return -1 / 0;
    let i = (0, __contentScope.ts)(e),
      a = 0;
    return (
      __contentScope.No.test(i) && (a += 8),
      __contentScope.Po.test(i) && (a += 5),
      __contentScope.Bo.test(i) && (a += 4),
      (0, __contentScope.J)(`img, canvas`, e).some(__contentScope.Y) && (a += 5),
      n.width >= 160 && n.width <= 720 && (a += 3),
      n.height >= 110 && n.height <= 720 && (a += 3),
      n.width >= window.innerWidth * 0.96 && n.height >= window.innerHeight * 0.9 && (a -= 3),
      (a -= Math.log10(Math.max(10, n.width * n.height))),
      a
    );
  }

  function cs(e) {
    let t = [],
      n = e.parentElement;
    for (let e = 0; n && n !== document.body && e < 12; e += 1) (t.push(n), (n = n.parentElement));
    let r = (0, __contentScope.is)(t, (t) => (0, __contentScope.ss)(t, e))[0];
    return r && r.score >= 3 ? r.element : null;
  }

  function ls(e, t) {
    return Math.max(0, Math.min(e.bottom, t.bottom) - Math.max(e.top, t.top));
  }

  function us(e, t, n) {
    if (!(0, __contentScope.Y)(e) || !t.contains(e)) return -1 / 0;
    let r = (0, __contentScope.X)(e),
      i = (0, __contentScope.X)(n);
    if (
      r.width < i.width * 1.8 ||
      r.height > Math.max(100, i.height * 3) ||
      (0, __contentScope.ls)(r, i) < Math.min(i.height, r.height) * 0.25
    )
      return -1 / 0;
    let a = (0, __contentScope.ts)(e),
      o = 0;
    return (
      (0, __contentScope.$o)(a) ? (o += 9) : __contentScope.Po.test(a) && (o += 4),
      e.contains(n) && (o += 5),
      r.width >= i.width * 3 && (o += 3),
      r.height <= i.height * 1.5 && (o += 3),
      (o += Math.min(4, r.width / Math.max(1, i.width * 3))),
      o
    );
  }

  function ds(e, t) {
    let n = (0, __contentScope.J)(`[role="slider"], input[type="range"], [class], [id]`, e).slice(
        0,
        __contentScope.Uo,
      ),
      r = [],
      i = t.parentElement;
    for (; i && i !== e.parentElement && (r.push(i), i !== e);) i = i.parentElement;
    let a = (0, __contentScope.is)(new Set([...n, ...r]), (n) =>
      (0, __contentScope.us)(n, e, t),
    )[0];
    return a && a.score >= 4 ? a.element : null;
  }

  function fs(e) {
    let t = window.getComputedStyle(e).backgroundImage;
    if (!t || t === `none`) return null;
    let n = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/i.exec(t);
    return (n?.[1] ?? n?.[2] ?? n?.[3] ?? ``).trim() || null;
  }

  function ps(e) {
    if (e.startsWith(`data:image/`))
      return e.length > __contentScope.Wo ? void 0 : { value: e, kind: `data-url` };
    try {
      let t = new URL(e, document.baseURI);
      return t.protocol !== `http:` && t.protocol !== `https:`
        ? void 0
        : { value: t.href, kind: `url` };
    } catch {
      return;
    }
  }

  function ms(e) {
    let t = __contentScope.Ko;
    if (t?.imageSource.has(e)) return t.imageSource.get(e);
    let n;
    if (e instanceof HTMLCanvasElement) {
      if (e.width >= 2 && e.height >= 2)
        try {
          n = (0, __contentScope.ps)(e.toDataURL(`image/png`));
        } catch {
          n = void 0;
        }
    } else if (e instanceof HTMLImageElement) {
      let t = e.currentSrc || e.src;
      t && (n = (0, __contentScope.ps)(t));
    } else {
      let t = (0, __contentScope.fs)(e);
      t && (n = (0, __contentScope.ps)(t));
    }
    return (t?.imageSource.set(e, n), n);
  }

  function hs(e, t, n, r) {
    if (!(0, __contentScope.Y)(e) || !t.contains(e) || e === r) return -1 / 0;
    let i = (0, __contentScope.X)(e),
      a = (0, __contentScope.X)(n);
    if (
      i.width < Math.max(110, (0, __contentScope.X)(r).width * 1.8) ||
      i.height < 45 ||
      i.width / Math.max(1, i.height) < 1.1 ||
      i.top > a.bottom + 20
    )
      return -1 / 0;
    let o = (0, __contentScope.ts)(e),
      s = 0;
    return (
      __contentScope.Ko?.mode === `tencent-frame` &&
        (e.matches(__contentScope.q.background)
          ? (s += 12)
          : e.matches(__contentScope.q.backgroundImage) && (s += 9)),
      (e instanceof HTMLImageElement || e instanceof HTMLCanvasElement) && (s += 5),
      (0, __contentScope.ms)(e) && (s += 5),
      __contentScope.Lo.test(o) && (s += 5),
      __contentScope.Ro.test(o) && (s -= 8),
      /logo|icon|avatar|btn|button|thumb/i.test(o) && (s -= 9),
      i.bottom <= a.top + 25 && (s += 4),
      (s += Math.min(5, (i.width * i.height) / 2e4)),
      s
    );
  }

  function gs(e, t, n) {
    let r = (0, __contentScope.is)(
      (0, __contentScope.J)(__contentScope.Mo, e).slice(0, __contentScope.Uo),
      (r) => (0, __contentScope.hs)(r, e, t, n),
    )[0];
    return r && r.score >= 6 ? r.element : null;
  }

  function _s(e, t) {
    let n = (0, __contentScope.ms)(t)?.value,
      r = (0, __contentScope.X)(t);
    return (0, __contentScope.J)(`img, canvas, [class], [id]`, e)
      .slice(0, __contentScope.Uo)
      .filter((e) => e !== t)
      .map((e) => {
        let t = (0, __contentScope.ms)(e);
        if (!t || t.value === n) return null;
        let i = (0, __contentScope.ts)(e);
        if (
          !__contentScope.Lo.test(i) ||
          __contentScope.Ro.test(i) ||
          /logo|icon|btn|button/i.test(i)
        )
          return null;
        let a = (0, __contentScope.X)(e),
          o =
            a.width ||
            (e instanceof HTMLCanvasElement ? e.width : 0) ||
            (e instanceof HTMLImageElement ? e.naturalWidth : 0),
          s =
            a.height ||
            (e instanceof HTMLCanvasElement ? e.height : 0) ||
            (e instanceof HTMLImageElement ? e.naturalHeight : 0);
        if (o < 80 || s < 40) return null;
        let c = o / s,
          l = r.width / Math.max(1, r.height),
          u = Math.abs(Math.log(c / l));
        if (u > 0.1) return null;
        let d = 8 - u * 20;
        return (
          (e instanceof HTMLCanvasElement || e instanceof HTMLImageElement) && (d += 3),
          /full|original|complete|完整|原图/i.test(i) && (d += 2),
          { element: e, score: d }
        );
      })
      .filter((e) => e != null)
      .sort((e, t) => t.score - e.score)[0]?.element;
  }

  function vs(e, t) {
    return e.left < t.right && e.right > t.left && e.top < t.bottom && e.bottom > t.top;
  }

  function ys(e, t, n, r) {
    if (!(0, __contentScope.Y)(e) || !t.contains(e) || e === n || e === r) return -1 / 0;
    let i = (0, __contentScope.X)(e),
      a = (0, __contentScope.X)(n);
    if (
      !(0, __contentScope.vs)(i, a) ||
      i.width < 8 ||
      i.height < 8 ||
      i.width > a.width * 1.08 ||
      i.height > a.height * 1.15
    )
      return -1 / 0;
    let o = i.width / Math.max(1, i.height);
    if (o > 2.5 || o < 0.4) return -1 / 0;
    let s = (0, __contentScope.X)(r),
      c = Math.min(i.width, i.height),
      l = Math.max(i.width, i.height),
      u = Math.min(s.width, s.height);
    if (u >= 8 && c < u * 0.55 && l > u * 1.25) return -1 / 0;
    let d = (0, __contentScope.ts)(e),
      f = 0;
    (__contentScope.Ro.test(d) && (f += 11),
      (0, __contentScope.ms)(e) && (f += 5),
      (e instanceof HTMLImageElement || e instanceof HTMLCanvasElement) && (f += 2),
      __contentScope.Lo.test(d) && !__contentScope.Ro.test(d) && (f -= 6),
      /logo|icon|avatar|btn|button|track|rail/i.test(d) && (f -= 10));
    let p = i.width / Math.max(1, a.width);
    return (p >= 0.08 && p <= 0.55 ? (f += 5) : p > 0.9 && (f -= 3), f);
  }

  function bs(e, t, n) {
    if ((0, __contentScope.Yo)() && n.matches(__contentScope.q.handle)) {
      let r = (0, __contentScope.J)(__contentScope.q.piece, e).filter(__contentScope.Y);
      return r.length === 1 && (0, __contentScope.ys)(r[0], e, t, n) >= 5 ? r[0] : void 0;
    }
    let r = (0, __contentScope.is)(
      (0, __contentScope.J)(__contentScope.Mo, e).slice(0, __contentScope.Uo),
      (r) => (0, __contentScope.ys)(r, e, t, n),
    )[0];
    return r && r.score >= 5 ? r.element : void 0;
  }

  function xs() {
    if (__contentScope.Ko?.geometryPanels) return __contentScope.Ko.geometryPanels;
    let e = new Set(),
      t = new Set(),
      n = (0, __contentScope.J)(
        (0, __contentScope.Yo)()
          ? `${__contentScope.q.widgets}, ${__contentScope.Vo}`
          : __contentScope.Vo,
      )
        .filter(__contentScope.Y)
        .slice(0, __contentScope.Uo);
    for (let r of n) {
      let n = r;
      for (
        let r = 0;
        n && r < 8 && n !== document.body && n !== document.documentElement;
        r += 1, n = n.parentElement
      ) {
        if (t.has(n)) continue;
        t.add(n);
        let r = (0, __contentScope.X)(n);
        if (
          r.width < 160 ||
          r.width > 760 ||
          r.height < 110 ||
          r.height > 720 ||
          !(0, __contentScope.Y)(n) ||
          n.closest(`pre, code, textarea, [contenteditable="true"]`)
        )
          continue;
        let i = (0, __contentScope.Ks)(n);
        __contentScope.No.test(i) && __contentScope.Bo.test(i) && e.add(n);
      }
    }
    let r = [...e]
      .sort((e, t) => {
        let n = (0, __contentScope.X)(e),
          r = (0, __contentScope.X)(t);
        return n.width * n.height - r.width * r.height;
      })
      .slice(0, 12);
    return (__contentScope.Ko && (__contentScope.Ko.geometryPanels = r), r);
  }

  function Ss(e, t, n = 3) {
    return (
      t.left >= e.left - n &&
      t.right <= e.right + n &&
      t.top >= e.top - n &&
      t.bottom <= e.bottom + n
    );
  }

  function Cs(e, t) {
    return (
      Math.max(0, Math.min(window.innerWidth, e.right) - Math.max(0, e.left)) *
        Math.max(0, Math.min(window.innerHeight, e.bottom) - Math.max(0, e.top)) >=
      e.width * e.height * t
    );
  }

  function ws(e, t) {
    if (!(0, __contentScope.Y)(e)) return -1 / 0;
    let n = (0, __contentScope.X)(e);
    return n.width < 110 ||
      n.height < 50 ||
      n.width / n.height < 1.1 ||
      n.width / n.height > 4.5 ||
      !(0, __contentScope.Ss)((0, __contentScope.X)(t), n) ||
      !(0, __contentScope.Cs)(n, 0.96) ||
      (!(e instanceof HTMLImageElement) &&
        !(e instanceof HTMLCanvasElement) &&
        !(0, __contentScope.fs)(e))
      ? -1 / 0
      : 8 +
          Math.min(5, (n.width * n.height) / 2e4) +
          (__contentScope.Lo.test((0, __contentScope.ts)(e)) ? 3 : 0);
  }

  function Ts(e, t, n) {
    if (
      !(e instanceof HTMLElement) ||
      e === t ||
      e.contains(t) ||
      t.contains(e) ||
      !(0, __contentScope.Y)(e)
    )
      return -1 / 0;
    let r = (0, __contentScope.X)(e),
      i = (0, __contentScope.X)(t),
      a = r.top - i.bottom;
    return r.height < 12 ||
      r.height > 90 ||
      r.width < r.height * 3 ||
      r.width < i.width * 0.75 ||
      r.width > i.width * 1.25 ||
      a < -4 ||
      a > Math.max(64, i.height * 0.35) ||
      Math.abs(r.left - i.left) > Math.max(24, i.width * 0.12) ||
      !(0, __contentScope.Ss)((0, __contentScope.X)(n), r) ||
      !(0, __contentScope.Cs)(r, 0.98)
      ? -1 / 0
      : 8 +
          ((0, __contentScope.$o)((0, __contentScope.ts)(e)) ? 3 : 0) +
          4 * (1 - Math.min(1, Math.abs(r.width - i.width) / i.width));
  }

  function Es(e, t) {
    if (
      !(e instanceof HTMLElement) ||
      e === t ||
      !t.contains(e) ||
      !(0, __contentScope.Y)(e) ||
      e.matches(`input, select, textarea, :disabled`) ||
      e.closest(`[inert], [aria-disabled="true"], [aria-hidden="true"], [disabled]`)
    )
      return -1 / 0;
    let n = (0, __contentScope.X)(e),
      r = (0, __contentScope.X)(t);
    if (
      n.width < 20 ||
      n.width > 110 ||
      n.height < 18 ||
      n.height > 96 ||
      n.width / n.height < 0.45 ||
      n.width / n.height > 2.6 ||
      r.width < n.width * 2.7 ||
      n.height < r.height * 0.55 ||
      n.height > r.height * 1.5 ||
      n.left < r.left - 3 ||
      n.right > r.right + 3 ||
      (0, __contentScope.ls)(n, r) < Math.min(n.height, r.height) * 0.65 ||
      !(0, __contentScope.Cs)(n, 0.98)
    )
      return -1 / 0;
    let i = (0, __contentScope.ts)(e);
    if (__contentScope.Ho.test(i)) return -1 / 0;
    let a = window.getComputedStyle(e);
    if (a.pointerEvents === `none`) return -1 / 0;
    let o =
        e.matches((0, __contentScope.Qo)()) ||
        __contentScope.Fo.test(i) ||
        e.matches(`button, [role="button"]`) ||
        /^(?:grab|grabbing|pointer|move|ew-resize)$/.test(a.cursor),
      s =
        (a.boxShadow !== `none` && a.boxShadow !== ``) ||
        Number.parseFloat(a.borderLeftWidth) > 0 ||
        (!!a.backgroundColor &&
          !/^(?:transparent|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\))$/.test(a.backgroundColor));
    if (!o && !s) return -1 / 0;
    let c = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
    return !c || !(c === e || e.contains(c))
      ? -1 / 0
      : 8 +
          (o ? 6 : 0) +
          4 * (1 - Math.min(1, Math.abs(n.height - r.height) / r.height)) +
          +(n.left - r.left < r.width * 0.35);
  }

  function Ds() {
    for (let e of (0, __contentScope.xs)()) {
      let t = (0, __contentScope.J)(`*`, e).slice(0, __contentScope.Uo),
        n = (0, __contentScope.is)(t, (t) => (0, __contentScope.ws)(t, e)).slice(0, 4),
        r;
      for (let { element: i, score: a } of n) {
        let n = (0, __contentScope.is)(t, (t) => (0, __contentScope.Ts)(t, i, e)).slice(0, 6);
        for (let { element: o, score: s } of n) {
          let n = (0, __contentScope.is)(t, (e) => (0, __contentScope.Es)(e, o))[0];
          if (!n || !(n.element instanceof HTMLElement)) continue;
          let c = a + s + n.score;
          (!r || c > r.score) &&
            (r = {
              score: c,
              match: {
                panel: e,
                background: i,
                track: o,
                handle: n.element,
                detectionMethod: `panel-geometry`,
              },
            });
        }
      }
      if (r) return r.match;
    }
    return null;
  }

  function Os() {
    for (let e of (0, __contentScope.os)()) {
      let t = (0, __contentScope.as)(e);
      if (t < 9 || (!(0, __contentScope.rs)(e) && t < 14)) continue;
      let n = (0, __contentScope.cs)(e);
      if (!n) continue;
      let r = (0, __contentScope.ds)(n, e);
      if (!r) continue;
      let i = (0, __contentScope.gs)(n, r, e);
      if (i)
        return {
          panel: n,
          background: i,
          piece: (0, __contentScope.bs)(n, i, e),
          track: r,
          handle: e,
        };
    }
    return (0, __contentScope.Ds)();
  }

  function ks(e = `page`) {
    return (0, __contentScope.Jo)(__contentScope.Os, e);
  }

  function As() {
    return (0, __contentScope.Jo)(() =>
      (0, __contentScope.J)(__contentScope.ko).some(__contentScope.Y)
        ? !0
        : (0, __contentScope.Os)() != null || (0, __contentScope.xs)().length > 0,
    );
  }

  function js(e) {
    let t = e ?? document,
      n = (0, __contentScope.Zo)();
    return (e?.matches(n) && (0, __contentScope.Y)(e)) ||
      (0, __contentScope.J)(n, t).some(__contentScope.Y)
      ? !0
      : !e || !(0, __contentScope.Y)(e)
        ? !1
        : [`data-state`, `data-status`, `aria-checked`].some((t) =>
            /^(?:verified|success|passed|complete|completed|true)$/i.test(
              e.getAttribute(t)?.trim() ?? ``,
            ),
          );
  }

  function Ms(e) {
    let t = 2166136261,
      n = Math.max(1, Math.floor(e.length / 256));
    for (let r = 0; r < e.length; r += n) ((t ^= e.charCodeAt(r)), (t = Math.imul(t, 16777619)));
    return ((t ^= e.length), (t >>> 0).toString(36));
  }

  function Ns(e) {
    if (!e) return ``;
    let t = [
      e.getAttribute(`style`) ?? ``,
      e.getAttribute(`data-id`) ?? ``,
      e.getAttribute(`data-key`) ?? ``,
      e.getAttribute(`data-index`) ?? ``,
      e.getAttribute(`srcset`) ?? ``,
    ];
    (e instanceof HTMLCanvasElement && t.push(`${e.width}x${e.height}`),
      e instanceof HTMLImageElement && t.push(`${e.naturalWidth}x${e.naturalHeight}`));
    try {
      let n = window.getComputedStyle(e);
      t.push(n.backgroundPosition, n.backgroundSize);
    } catch {}
    return t.filter(Boolean).join(`~`);
  }

  function Ps(e, t, n, r) {
    let i = (0, __contentScope.X)(e.background),
      a = e.piece ? (0, __contentScope.X)(e.piece) : void 0;
    return (0, __contentScope.Ms)(
      [
        t?.value ?? (0, __contentScope.ts)(e.background),
        r?.value ?? ``,
        n?.value ?? (e.piece ? (0, __contentScope.ts)(e.piece) : ``),
        `${i.width.toFixed(1)}x${i.height.toFixed(1)}`,
        a ? `${a.width.toFixed(1)}x${a.height.toFixed(1)}` : `no-piece`,
        t ? `` : (0, __contentScope.Ns)(e.background),
        n ? `` : (0, __contentScope.Ns)(e.piece),
      ].join(`|`),
    );
  }

  function Fs(e) {
    let t = (0, __contentScope.X)(e);
    return (
      t.left < 4 ||
      t.top < 4 ||
      t.right > window.innerWidth - 4 ||
      t.bottom > window.innerHeight - 4
    );
  }

  function Rs(e) {
    return [e.panel, e.background, e.piece, e.track, e.handle]
      .filter((e) => e != null)
      .flatMap((e) => {
        let t = (0, __contentScope.X)(e);
        return [t.x, t.y, t.width, t.height];
      });
  }

  function zs(e, t, n = 1.5) {
    return e.length === t.length && e.every((e, r) => Math.abs(e - t[r]) <= n);
  }

  function Bs(e) {
    return [e.background, e.piece].every((e) =>
      e instanceof HTMLImageElement
        ? e.complete && e.naturalWidth > 0 && e.naturalHeight > 0
        : e instanceof HTMLCanvasElement
          ? e.width > 0 && e.height > 0
          : !0,
    );
  }

  async function Vs(e = 1500, t = () => !0, n = `page`) {
    let r = Date.now() + e;
    if (!t()) return null;
    let i = (0, __contentScope.ks)(n);
    for (; !i && Date.now() < r && t();)
      (await (0, __contentScope.Ls)(Math.min(120, Math.max(0, r - Date.now()))),
        (i = (0, __contentScope.ks)(n)));
    return t() ? i : null;
  }

  function Us() {
    return __contentScope.Hs;
  }

  function Ws(e) {
    return (0, __contentScope.Jo)(() => {
      let e = (0, __contentScope.os)().filter(
        (e) => (0, __contentScope.as)(e) >= 9 && (0, __contentScope.rs)(e),
      );
      if (!e.length) return `当前验证码文档未找到可接收拖动的滑块把手（可能仍在加载或被遮挡）`;
      let t = e
        .map((e) => ({ handle: e, panel: (0, __contentScope.cs)(e) }))
        .filter((e) => e.panel != null);
      if (!t.length) return `已找到滑块把手，但尚未找到它所属的验证码面板`;
      let n = t
        .map(({ handle: e, panel: t }) => ({
          handle: e,
          panel: t,
          track: (0, __contentScope.ds)(t, e),
        }))
        .filter((e) => e.track != null);
      return n.length
        ? n.some(({ handle: e, panel: t, track: n }) => (0, __contentScope.gs)(t, n, e))
          ? `验证码组件仍在重绘，尚未取得同一挑战的完整滑块控件`
          : `已找到滑块把手和轨道，但验证码背景图片尚未就绪`
        : `已找到验证码面板和把手，但没有匹配的滑动轨道`;
    }, e);
  }

  async function Gs(e = {}) {
    __contentScope.Hs = void 0;
    let t = e.mode ?? `page`,
      n = () => e.isActive?.() !== !1 && Date.now() < (e.deadline ?? 1 / 0),
      r = () => Math.max(0, Math.min(e.mountTimeoutMs ?? 1500, (e.deadline ?? 1 / 0) - Date.now())),
      i = await (0, __contentScope.Vs)(r(), n, t);
    if (
      !i ||
      ((0, __contentScope.Fs)(i.panel) &&
        (i.panel.scrollIntoView({
          block: `center`,
          inline: `center`,
          behavior: `auto`,
        }),
        await (0, __contentScope.Is)(t),
        (i = await (0, __contentScope.Vs)(r(), n, t)),
        !i))
    )
      return (
        (__contentScope.Hs = n() ? (0, __contentScope.Ws)(t) : `本轮滑块任务已停止或超过时限`),
        null
      );
    let a = Math.min(
        e.deadline ?? 1 / 0,
        Date.now() + Math.max(2500, Math.min(e.mountTimeoutMs ?? 0, 6e3)),
      ),
      o = (0, __contentScope.Rs)(i),
      s = 0;
    for (; Date.now() < a && n();) {
      await (0, __contentScope.Ls)(50);
      let e = (0, __contentScope.ks)(t);
      if (!e) {
        s = 0;
        continue;
      }
      let n = (0, __contentScope.Rs)(e);
      if (
        ((0, __contentScope.Bs)(e) && (0, __contentScope.zs)(o, n) ? (s += 1) : (s = 0),
        (o = n),
        (i = e),
        s >= 2)
      )
        break;
    }
    if (s < 2 || !n())
      return (
        (__contentScope.Hs = n()
          ? (0, __contentScope.Bs)(i)
            ? `验证码布局在等待时间内没有稳定，未使用动画中的坐标拖动`
            : `验证码图片还没有加载完成，未执行拖动`
          : `本轮滑块任务已停止或超过时限`),
        null
      );
    let c = (0, __contentScope.ms)(i.background),
      l =
        i.detectionMethod === `panel-geometry`
          ? void 0
          : (0, __contentScope._s)(i.panel, i.background),
      u = l ? (0, __contentScope.ms)(l) : void 0,
      d = i.piece ? (0, __contentScope.ms)(i.piece) : void 0,
      f = t === `tencent-frame` && i.handle.matches(__contentScope.q.handle),
      p = i.handle.getAttribute(__contentScope.Go),
      m = `p-slider-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    i.handle.setAttribute(__contentScope.Go, m);
    let h = !1;
    return {
      info: {
        panelRect: (0, __contentScope.es)((0, __contentScope.X)(i.panel)),
        backgroundRect: (0, __contentScope.es)((0, __contentScope.X)(i.background)),
        pieceRect: i.piece ? (0, __contentScope.es)((0, __contentScope.X)(i.piece)) : void 0,
        trackRect: (0, __contentScope.es)((0, __contentScope.X)(i.track)),
        handleRect: (0, __contentScope.es)((0, __contentScope.X)(i.handle)),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        backgroundSource: f ? void 0 : c,
        referenceBackgroundSource: f ? void 0 : u,
        pieceSource: f ? void 0 : d,
        handleToken: m,
        challengeKey: (0, __contentScope.Ps)(i, c, d, u),
      },
      match: i,
      releaseHandleMarker: () => {
        h ||
          ((h = !0),
          i.handle.getAttribute(__contentScope.Go) === m &&
            (p == null
              ? i.handle.removeAttribute(__contentScope.Go)
              : i.handle.setAttribute(__contentScope.Go, p)));
      },
    };
  }

  function Ks(e) {
    let t = (e ? [e] : (0, __contentScope.J)((0, __contentScope.Xo)())).filter(__contentScope.Y),
      n = t.filter((e) => !t.some((t) => t !== e && t.contains(e))),
      r = [],
      i = 0,
      a = 0;
    for (let e of n) {
      let t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT),
        n;
      for (; (n = t.nextNode()) && a < __contentScope.Uo && i < 1500;) {
        a += 1;
        let e = n.textContent ?? ``;
        e.trim() &&
          n.parentElement &&
          (0, __contentScope.Y)(n.parentElement) &&
          (r.push(e), (i += e.length));
      }
      if (a >= __contentScope.Uo || i >= 1500) break;
    }
    return r.join(` `).replace(/\s+/g, ` `).trim().slice(0, 1500);
  }

  function qs(e, t = `page`) {
    return (0, __contentScope.Jo)(() => {
      let n = (0, __contentScope.Os)();
      if (!n) {
        let n = [
            ...(0, __contentScope.J)((0, __contentScope.Xo)()).filter(__contentScope.Y),
            ...(0, __contentScope.xs)(),
          ],
          r = e && (0, __contentScope.Y)(e) ? e : void 0;
        if (t === `page`) {
          let e = r ?? n[0];
          return {
            visible: n.length > 0,
            success: (0, __contentScope.js)(e) || (0, __contentScope.js)(),
            panel: e,
            statusText: (0, __contentScope.Ks)(e),
          };
        }
        let i = [...new Set(n)].filter((e) => !n.some((t) => t !== e && t.contains(e))),
          a =
            i.find(
              (e) => !(0, __contentScope.js)(e) && (!r || (!r.contains(e) && !e.contains(r))),
            ) ??
            r ??
            i[0];
        return {
          visible: n.length > 0 || a != null,
          success: a != null && (0, __contentScope.js)(a),
          panel: a,
          statusText: (0, __contentScope.Ks)(a),
        };
      }
      let r = (0, __contentScope.ms)(n.background),
        i =
          n.detectionMethod === `panel-geometry`
            ? void 0
            : (0, __contentScope._s)(n.panel, n.background),
        a = i ? (0, __contentScope.ms)(i) : void 0,
        o = n.piece ? (0, __contentScope.ms)(n.piece) : void 0,
        s = (0, __contentScope.X)(n.handle),
        c = (0, __contentScope.X)(n.track);
      return {
        visible: !0,
        success: (0, __contentScope.js)(n.panel) || (t === `page` && (0, __contentScope.js)()),
        panel: n.panel,
        challengeKey: (0, __contentScope.Ps)(n, r, o, a),
        handleX: s.x,
        pieceX: n.piece ? (0, __contentScope.X)(n.piece).x : void 0,
        handleOffsetX: s.x - c.x,
        handleRange: c.width - s.width,
        statusText: (0, __contentScope.Ks)(n.panel),
      };
    }, t);
  }

  function rc(e, t) {
    let n = e.handleOffsetX,
      r = t.handleOffsetX;
    if (n == null || r == null) return null;
    let i = t.handleRange ?? e.handleRange;
    return !i || i < 20 ? null : Math.abs(r - n) < i * 0.05 ? `failed` : null;
  }

  function ic(e, t) {
    return (t.match(new RegExp(e.source, `gi`)) ?? []).map((e) => e.toLowerCase());
  }

  function ac(e, t, n) {
    let r = new Set((0, __contentScope.ic)(e, t));
    return (0, __contentScope.ic)(e, n).filter((e) => !r.has(e));
  }

  function oc(e, t, n) {
    if (t.success || (0, __contentScope.ac)(__contentScope.Js, n, t.statusText).length > 0)
      return `success`;
    if (e.challengeKey && t.challengeKey && e.challengeKey !== t.challengeKey) return `refreshed`;
    for (let e of [`too-short`, `too-far`, `failed`])
      if ((0, __contentScope.ac)(__contentScope.nc[e], n, t.statusText).length > 0) return e;
    return null;
  }

  async function sc(e, t = 5500, n = `page`) {
    let r = Date.now() + t,
      i = (0, __contentScope.qs)(e.panel, n),
      a = e,
      o,
      s,
      c;
    for (;;) {
      let t = Date.now(),
        l = (0, __contentScope.oc)(e, i, a.statusText);
      if (l === `success`) return { kind: l, state: i, evidence: `status` };
      if (l === `refreshed`) return { kind: l, state: i, evidence: `refresh` };
      if (
        ((l === `failed` || l === `too-short` || l === `too-far`) &&
          (o = {
            kind: l,
            since: t,
            phrases: (0, __contentScope.ac)(__contentScope.nc[l], a.statusText, i.statusText),
          }),
        !i.visible && e.visible)
      ) {
        if (((s ??= t), t - s >= __contentScope.tc))
          return o
            ? { kind: o.kind, state: i, evidence: `status` }
            : { kind: `success`, state: i, evidence: `disappearance` };
      } else {
        if (((s = void 0), o)) {
          let e = (0, __contentScope.ic)(__contentScope.nc[o.kind], i.statusText);
          o.phrases.some((t) => e.includes(t)) || (o = void 0);
        }
        if (o && t - o.since >= __contentScope.ec)
          return { kind: o.kind, state: i, evidence: `status` };
      }
      if (
        (i.visible && (0, __contentScope.rc)(e, i) === `failed` ? (c ??= t) : (c = void 0), t >= r)
      )
        return c != null && t - c >= __contentScope.ec
          ? { kind: `failed`, state: i, evidence: `geometry` }
          : { kind: `unchanged`, state: i };
      ((a = i),
        await (0, __contentScope.w)(Math.min(220, Math.max(0, r - Date.now()))),
        (i = (0, __contentScope.qs)(i.panel ?? e.panel, n)));
    }
  }

  function cc(e, t) {
    if (!(e instanceof HTMLElement) || !(0, __contentScope.Y)(e)) return -1 / 0;
    let n = [
      e.id,
      e.className,
      e.getAttribute(`aria-label`),
      e.getAttribute(`title`),
      e.textContent,
    ]
      .filter(Boolean)
      .join(` `);
    if (!__contentScope.Qs.test(n) || __contentScope.$s.test(n)) return -1 / 0;
    let r = e.getBoundingClientRect(),
      i = 0;
    return (
      t !== `page` && e.matches(__contentScope.q.refresh) && (i += 10),
      e.matches(`button, [role="button"], a`) && (i += 4),
      /refresh|reload|刷新|换一张/i.test(n) && (i += 6),
      r.width <= 100 && r.height <= 80 && (i += 2),
      i
    );
  }

  async function lc(e = `page`) {
    let t = (0, __contentScope.ks)(e);
    if (!t && e === `page`) return !1;
    let n = [
      ...(t?.panel.querySelectorAll(`button, [role="button"], a, [class], [id]`) ?? []),
      ...(e === `page` ? [] : document.querySelectorAll(__contentScope.q.refresh)),
    ].sort((t, n) => (0, __contentScope.cc)(n, e) - (0, __contentScope.cc)(t, e))[0];
    if (!(n instanceof HTMLElement) || (0, __contentScope.cc)(n, e) < 4) return !1;
    try {
      return (await (0, __contentScope.M)(n), !0);
    } catch {
      return !1;
    }
  }

  async function uc(e, t = 3500, n = `page`) {
    let r = Date.now() + t;
    for (; Date.now() < r;) {
      let t = (0, __contentScope.qs)(void 0, n);
      if (!t.visible || (e && t.challengeKey && t.challengeKey !== e)) return !0;
      await (0, __contentScope.w)(180);
    }
    return !1;
  }

  function dc(e, t, n) {
    let r = Math.min(3, Math.max(1, n * 0.008)),
      i = Math.min(10, Math.max(3, n * 0.04)),
      a = e;
    return (
      t === `too-short` ? (a += r) : t === `too-far` ? (a -= r) : (a = 0),
      Math.max(-i, Math.min(i, Math.round(a * 10) / 10))
    );
  }

  function hc(e) {
    switch (e.kind) {
      case `too-short`:
        return `页面反馈拖动偏短`;
      case `too-far`:
        return `页面反馈拖动偏长`;
      case `failed`:
        return e.evidence === `geometry`
          ? `滑块把手持续停在起点，等待结束后仍未收到通过确认`
          : `页面显示本轮验证失败提示`;
      case `refreshed`:
        return `页面已刷新为新挑战`;
      case `unchanged`:
        return `页面没有给出通过或刷新反馈`;
      case `success`:
        return e.evidence === `disappearance` ? `滑块面板已稳定关闭` : `页面确认验证通过`;
    }
  }

  function vc(e) {
    if (!e) return `unknown`;
    let [, ...t] = e.split(`:`);
    return (t.join(`:`) || e)
      .split(`+`)
      .map((e) => __contentScope._c[e] ?? e)
      .join(`+`);
  }

  function yc(e) {
    let t = e.diagnostics,
      n = t
        ? `，取图=${__contentScope.gc[t.source] ?? t.source}，图像距离=${t.imageDistance}px` +
          (t.measuredRatio == null
            ? `，行程比=${t.conversionRatio.toFixed(3)}`
            : `，实测行程比=${t.measuredRatio.toFixed(3)}`) +
          (t.probeDistance == null ? `` : `，探测位移=${t.probeDistance}px`) +
          `，修正=${t.correctionPx}px` +
          (t.cropOffsetX ? `，亚像素补偿=${t.cropOffsetX}px` : ``) +
          (t.rivalCount ? `，另有 ${t.rivalCount} 个疑似缺口` : ``)
        : ``;
    return `方法=${(0, __contentScope.vc)(e.method)}，缺口=${e.gapX ?? `N/A`}px，拖动=${e.distance ?? `N/A`}px，置信度=${e.confidence?.toFixed(3) ?? `N/A`}${n}`;
  }

  async function bc(e, t) {
    let r = (0, __contentScope.x)();
    if (!r)
      return (
        e.push(`滑块求解：没有活跃签到任务，停止自动拖动`),
        { solved: !1, error: `没有活跃签到任务` }
      );
    let i = t.frameSessionId,
      a = i ? `tencent-frame` : (t.domMode ?? `page`),
      o = Math.min(t.deadline ?? 1 / 0, Date.now() + __contentScope.pc),
      s = () => (0, __contentScope.x)() === r && (!i || (0, __contentScope.S)() === i),
      c = 0,
      l,
      u = `滑块没有返回可确认的结果`,
      d = !1,
      f = [],
      p,
      m = 0;
    for (let t = 1; t <= __contentScope.fc; t += 1) {
      if (!s() || Date.now() >= o) {
        u = s() ? `滑块求解超过总时限` : `本轮滑块任务已停止`;
        break;
      }
      let h = await (0, __contentScope.Gs)(
        i ? { mode: a, mountTimeoutMs: 6e3, deadline: o, isActive: s } : { mode: a },
      );
      if (!h) {
        let t = (0, __contentScope.qs)(void 0, a);
        if (s() && t.success)
          return (e.push(`页面已显示滑块通过状态`), { solved: !0, method: `dom-feedback` });
        ((u =
          (0, __contentScope.Us)() ??
          (t.visible
            ? `没有找到同时满足把手、轨道和背景几何关系的滑块控件`
            : `检测到滑动挑战，但页面没有暴露可安全拖动的 DOM 控件`)),
          e.push(u));
        break;
      }
      let { info: g, match: _, releaseHandleMarker: v } = h;
      if (!s() || (i && Date.now() >= o)) {
        (v(), (u = `本轮滑块任务已停止或超过时限`));
        break;
      }
      _.detectionMethod === `panel-geometry` &&
        !d &&
        (e.push(
          `标准滑块控件匹配未命中，已通过当前验证码弹窗内的图片、轨道和把手布局定位，继续截图识别`,
        ),
        (d = !0));
      let y = (0, __contentScope.qs)(_.panel, a);
      if (i && y.success)
        return (
          v(),
          e.push(`当前验证码面板已显示通过状态，未重复拖动`),
          { solved: !0, method: `dom-feedback` }
        );
      (c !== 0 && l && y.challengeKey && y.challengeKey !== l && ((c = 0), (l = void 0)),
        f.length && p && y.challengeKey && y.challengeKey !== p && ((f = []), (p = void 0)));
      let b = g.pieceRect ? `${g.pieceRect.width}×${g.pieceRect.height}` : `未直接暴露`;
      e.push(
        `滑块第 ${t}/${__contentScope.fc} 次：背景 ${g.backgroundRect.width}×${g.backgroundRect.height}，拼图块 ${b}，轨道行程 ${(g.trackRect.width - g.handleRect.width).toFixed(1)}px`,
      );
      let x, S;
      try {
        let e = await (0, __contentScope.n)({
          type: `SLIDER_CRACK`,
          runId: r,
          ...(i ? { frameSessionId: i } : {}),
          slider: g,
          options: {
            attempt: t,
            correctionPx: c,
            ...(f.length ? { excludedGapX: [...f] } : {}),
          },
        });
        e.ok ? (x = e.feature?.slider) : (S = e.error);
      } finally {
        v();
      }
      if (!s()) {
        u = `本轮滑块任务已停止`;
        break;
      }
      if (S) ((u = S), e.push(`滑块后台调用失败：${S}`));
      else if (!x) ((u = `后台没有返回滑块处理结果`), e.push(u));
      else if (x.solved) {
        e.push(`可信拖动已执行，等待页面验收：${(0, __contentScope.yc)(x)}`);
        let t = await (0, __contentScope.sc)(
          y,
          i ? Math.max(0, Math.min(5500, o - Date.now())) : 5500,
          a,
        );
        if ((e.push((0, __contentScope.hc)(t)), t.kind === `success`)) {
          let e = !!i && t.evidence === `disappearance`;
          return {
            solved: !e,
            ...(e ? { dismissed: !0 } : {}),
            method: x.method,
            gapX: x.gapX,
            distance: x.distance,
          };
        }
        if (
          ((u = (0, __contentScope.hc)(t)),
          t.kind === `failed` &&
            t.evidence === `status` &&
            x.gapX != null &&
            !f.some((e) => Math.abs(e - x.gapX) < 3) &&
            (f.push(x.gapX), (p = t.state.challengeKey ?? y.challengeKey)),
          (c = (0, __contentScope.dc)(
            c,
            t.kind,
            x.diagnostics?.handleRange ?? g.trackRect.width - g.handleRect.width,
          )),
          t.kind === `too-short` || t.kind === `too-far`)
        ) {
          ((l = t.state.challengeKey ?? y.challengeKey), await (0, __contentScope.w)(350));
          continue;
        }
        if (t.kind === `refreshed`) {
          ((c = 0), (l = void 0), (f = []), (p = void 0), await (0, __contentScope.w)(350));
          continue;
        }
      } else if (
        ((u = x.error ?? `滑块图像识别或拖动失败`),
        e.push(`滑块本次未执行：${u}${x.method ? `（${(0, __contentScope.yc)(x)}）` : ``}`),
        x.errorCode === `match-ambiguous` && ((m += 1), m >= 2))
      ) {
        ((u = `这个滑块在同一张图上有多个疑似缺口，自动识别无法确定唯一目标`),
          e.push(`${u}，已停止自动尝试并交由人工完成`));
        break;
      }
      if (t >= __contentScope.fc || !s() || (i && Date.now() >= o)) break;
      ((c = 0),
        (l = void 0),
        (f = []),
        (p = void 0),
        (await (0, __contentScope.lc)(a))
          ? (e.push(`已通过验证控件自身的刷新按钮请求新挑战`),
            await (0, __contentScope.uc)(y.challengeKey, 3500, a))
          : await (0, __contentScope.uc)(y.challengeKey, 1600, a),
        await (0, __contentScope.w)(300));
    }
    return (e.push(`滑块自动求解未通过页面确认：${u}`), { solved: !1, error: u });
  }

  function xc(e, t) {
    if (__contentScope.mc) return (e.push(`滑块求解已经在执行，复用当前任务`), __contentScope.mc);
    let n = (0, __contentScope.bc)(e, t).finally(() => {
      __contentScope.mc === n && (__contentScope.mc = null);
    });
    return ((__contentScope.mc = n), n);
  }

  function Sc(e) {
    return (0, __contentScope.xc)(e, {});
  }

  function Cc(e) {
    return (
      e.push(`检测到页面内腾讯滑块，使用腾讯控件定位，保留主页面取图与求解策略`),
      (0, __contentScope.xc)(e, { domMode: `tencent-page` })
    );
  }

  function Nc(e) {
    if (!e.trim()) return [];
    try {
      return [...document.querySelectorAll(e)];
    } catch {
      return [];
    }
  }

  function Pc(e) {
    return (e.candidateElements?.() ?? []).filter((e) => e instanceof Element);
  }

  function Fc(e) {
    return [...new Set([...(0, __contentScope.Nc)(e.selectors), ...(0, __contentScope.Pc)(e)])];
  }

  function Ic(e) {
    if (!e.isConnected || e.getClientRects().length === 0) return !1;
    let t = e;
    for (; t;) {
      let e = window.getComputedStyle(t);
      if (
        e.display === `none` ||
        e.visibility === `hidden` ||
        e.visibility === `collapse` ||
        e.opacity === `0` ||
        t.getAttribute(`aria-hidden`) === `true` ||
        (t instanceof HTMLElement && t.hidden)
      )
        return !1;
      t = t.parentElement;
    }
    let n = e.getBoundingClientRect();
    return n.width > 0 && n.height > 0;
  }

  function Hc(e) {
    if (!e.isConnected) return !1;
    let t = e.getBoundingClientRect();
    if (t.width <= 0 || t.height <= 0) return !1;
    let n = t.left + t.width / 2,
      r = t.top + t.height / 2,
      i = window.innerWidth,
      a = window.innerHeight;
    return (
      !(i > 0) ||
      !(a > 0) ||
      (n >= __contentScope.Lc &&
        r >= __contentScope.Lc &&
        n <= i - __contentScope.Lc &&
        r <= a - __contentScope.Lc)
    );
  }

  function Kc() {
    let e = (0, __contentScope.Nc)(__contentScope.Gc);
    return e.length > __contentScope.Vc ? e.slice(0, __contentScope.Vc) : e;
  }

  function qc(e) {
    let t = e;
    for (; t;) {
      let e = t.getBoundingClientRect();
      if (e.width > 0 && e.height > 0) return t;
      t = t.parentElement;
    }
    return null;
  }

  function Jc(e) {
    let t = e.getBoundingClientRect();
    return `${Math.round(t.left)},${Math.round(t.top)},${Math.round(t.width)},${Math.round(t.height)}`;
  }

  function Yc() {
    let e = typeof window.scrollX == `number` ? window.scrollX : 0,
      t = typeof window.scrollY == `number` ? window.scrollY : 0;
    return `${Math.round(e)},${Math.round(t)}`;
  }

  function Xc(e) {
    try {
      return typeof e.scrollIntoView == `function` && (e.scrollIntoView({ block: `center` }), !0);
    } catch {
      return !1;
    }
  }

  async function Zc(e = (0, __contentScope.Kc)(), t = {}) {
    let n = [...new Set(e)].filter((e) => e.isConnected).filter((e) => !(0, __contentScope.Hc)(e));
    if (n.length === 0) return { outcome: `in-viewport`, attempts: 0, offViewport: 0 };
    let r = Math.max(1, Math.floor(t.maxAttempts ?? __contentScope.Rc)),
      i = Date.now() + Math.max(0, t.budgetMs ?? __contentScope.Bc),
      a = 0,
      o = n;
    for (; a < r && Date.now() < i;) {
      let e = [...new Set(o.map(__contentScope.qc).filter((e) => e !== null))];
      if (e.length === 0) return { outcome: `blocked`, attempts: a, offViewport: n.length };
      let t = (0, __contentScope.Yc)(),
        r = e.map(__contentScope.Jc).join(`|`);
      if (!(0, __contentScope.Xc)(e[0]))
        return { outcome: `blocked`, attempts: a, offViewport: n.length };
      if (
        ((a += 1),
        await (0, __contentScope.w)(Math.min(__contentScope.zc, Math.max(0, i - Date.now()))),
        (o = o.filter((e) => !(0, __contentScope.Hc)(e))),
        o.length === 0)
      )
        return { outcome: `revealed`, attempts: a, offViewport: n.length };
      if ((0, __contentScope.Yc)() === t && e.map(__contentScope.Jc).join(`|`) === r)
        return { outcome: `blocked`, attempts: a, offViewport: n.length };
    }
    return { outcome: `blocked`, attempts: a, offViewport: n.length };
  }

  function Qc(e) {
    return (0, __contentScope.Fc)(e)
      .filter(__contentScope.Ic)
      .sort((e, t) => {
        let n = e.getBoundingClientRect(),
          r = t.getBoundingClientRect();
        return n.width * n.height - r.width * r.height;
      });
  }

  function $c(e) {
    return (0, __contentScope.Qc)(e)[0] ?? null;
  }

  function el(e, t) {
    return t && (0, __contentScope.Ic)(t) ? t : (0, __contentScope.$c)(e);
  }

  function tl(e, t) {
    if (!t.trim()) return [];
    try {
      return [...e.querySelectorAll(t)];
    } catch {
      return [];
    }
  }

  function nl(e) {
    return e.closest(`form`) ?? e.parentElement ?? document;
  }

  function rl(e, t) {
    return [
      ...(e instanceof Element &&
      (() => {
        try {
          return e.matches(t);
        } catch {
          return !1;
        }
      })()
        ? [e]
        : []),
      ...(0, __contentScope.tl)(e, t),
    ];
  }

  function il(e, t) {
    let n = (0, __contentScope.tl)(t, e.tokenSelectors);
    if (n.length > 0) return n;
    let r = t.closest(`form`);
    if (r) {
      let t = (0, __contentScope.tl)(r, e.tokenSelectors);
      if (t.length > 0) return t;
    }
    let i = t.parentElement;
    return i ? (0, __contentScope.tl)(i, e.tokenSelectors) : [];
  }

  function al(e) {
    return e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement
      ? e.value.trim()
      : (e.getAttribute(`value`) ?? ``).trim();
  }

  function ol(e, t) {
    return (0, __contentScope.rl)(t, e.tokenSelectors).some(
      (e) => (0, __contentScope.al)(e).length === 0,
    );
  }

  function sl(e) {
    return (
      e.getAttribute(`aria-disabled`) === `true` ||
      ((e instanceof HTMLButtonElement || e instanceof HTMLInputElement) && e.disabled)
    );
  }

  function cl(e) {
    return (0, __contentScope.rl)(
      e,
      `button[type="submit"], input[type="submit"], button:not([type])`,
    );
  }

  function ll(e, t, n) {
    let r = (0, __contentScope.nl)(t),
      i = (0, __contentScope.rl)(r, e.tokenSelectors),
      a = i.some((e) => (0, __contentScope.al)(e).length === 0);
    return {
      scope: r,
      hadDisabledSubmit: (0, __contentScope.cl)(r).some(__contentScope.sl),
      responseFields: i,
      hadPendingResponse: a,
      observedResponseValue: n?.observedResponseValue ?? !1,
    };
  }

  function ul(e, t) {
    e.hadPendingResponse &&
      !e.observedResponseValue &&
      (e.observedResponseValue = [
        ...e.responseFields,
        ...(0, __contentScope.rl)(e.scope, t.tokenSelectors),
      ].some((e) => (0, __contentScope.al)(e).length > 0));
  }

  function dl(e, t) {
    let n = (0, __contentScope.Pc)(e).filter(
      (e) => t === document || (t instanceof Element && t.contains(e)),
    );
    return [...new Set([...(0, __contentScope.rl)(t, e.selectors), ...n])]
      .filter(__contentScope.Ic)
      .sort((e, t) => {
        let n = e.getBoundingClientRect(),
          r = t.getBoundingClientRect();
        return n.width * n.height - r.width * r.height;
      });
  }

  function fl(e) {
    return Math.max(0, e - Date.now());
  }

  async function pl(e, t) {
    let n = (0, __contentScope.fl)(t);
    return n <= 0 ? !1 : (await (0, __contentScope.w)(Math.min(e, n)), Date.now() < t);
  }

  async function ml(e, t) {
    let n = (0, __contentScope.Qc)(e);
    if (n.length > 0) return { state: `ready`, widgets: n, appearedAt: t.detectedAt };
    let r = Math.min(
      e.strategy?.mountWaitMs ?? __contentScope.wc,
      (0, __contentScope.fl)(t.deadline),
    );
    if (r <= 0) return { state: `missing` };
    t.log.push(
      `已识别${e.kind}待处理状态，正在等待可见验证控件挂载（最长 ${Math.ceil(r / 1e3)}s）`,
    );
    let i = Math.min(t.deadline, Date.now() + r);
    for (; Date.now() < i;) {
      if (t.isComplete())
        return (t.log.push(`${e.kind}在控件挂载等待期间已出现完成信号`), { state: `completed` });
      let n = (0, __contentScope.Qc)(e);
      if (n.length > 0)
        return (
          t.log.push(`${e.kind}可见控件已挂载，进入统一点击流程`),
          { state: `ready`, widgets: n, appearedAt: Date.now() }
        );
      await (0, __contentScope.pl)(__contentScope.kc, i);
    }
    return (t.log.push(`${e.kind}在等待窗口内仍未挂载可见控件`), { state: `missing` });
  }

  function hl(e) {
    let t = [
      ...e.querySelectorAll(
        `input[type="checkbox"], [role="checkbox"], button:not([disabled]), [role="button"]`,
      ),
    ].filter(__contentScope.Ic);
    return t.length > 0 ? t[0] : e instanceof HTMLElement ? e : null;
  }

  async function gl(e, t, n, r) {
    let i = Math.min(n.deadline, Date.now() + r),
      a = null,
      o = 0,
      s = (0, __contentScope.il)(t, e).length > 0;
    for (; Date.now() < i;) {
      if (n.isComplete(e))
        return (n.log.push(`${t.kind}在布局等待期间已出现完成信号`), `completed`);
      if (!e.isConnected || !(0, __contentScope.Ic)(e))
        return (n.log.push(`${t.kind}控件在布局等待期间已重绘，准备重新定位`), `replaced`);
      !s && (0, __contentScope.il)(t, e).length > 0 && (s = !0);
      let r = e.getBoundingClientRect(),
        c = { width: Math.round(r.width), height: Math.round(r.height) },
        l = c.width > 50 && c.height > 20;
      if (
        (l && a && c.width === a.width && c.height === a.height ? (o += 1) : (o = 0),
        (a = c),
        l && o >= 4 && (s || !t.tokenSelectors.trim()))
      )
        return (
          n.log.push(`验证控件布局已稳定（${c.width}×${c.height}${s ? `，响应字段已挂载` : ``}）`),
          `stable`
        );
      await (0, __contentScope.pl)(__contentScope.Ac, i);
    }
    return (
      n.log.push(
        `等待${t.kind}布局稳定超时（响应字段${s ? `已` : `未`}挂载，尺寸${o >= 4 ? `已` : `未`}稳定），继续执行点击前保护`,
      ),
      `timed-out`
    );
  }

  async function _l(e, t, n, r) {
    let i = e,
      a = t.strategy?.minVisibleMs ?? 0;
    for (; Date.now() < r.deadline;) {
      let e = n.get(i) ?? Date.now();
      n.set(i, e);
      let o = Math.min(r.deadline, e + a),
        s = o - Date.now();
      for (
        s > 0 &&
        r.log.push(
          `${t.kind}首次点击保护：再等待 ${Math.ceil(s / 1e3)}s，执行通用 ${a / 1e3}s 最低成熟策略`,
        );
        Date.now() < o;
      ) {
        if (r.isComplete(i))
          return (
            r.log.push(`${t.kind}在首次点击保护期间已自行完成，无需点击`),
            { state: `completed` }
          );
        let e = (0, __contentScope.el)(t, i);
        if (e && e !== i) {
          ((i = e),
            n.has(i) || n.set(i, Date.now()),
            r.log.push(`${t.kind}宿主已重绘，已重新定位并重新计算成熟窗口`));
          break;
        }
        if (!(await (0, __contentScope.pl)(__contentScope.kc, o))) break;
      }
      if (r.isComplete(i))
        return (
          r.log.push(`${t.kind}在首次点击前已出现完成信号，无需点击`),
          { state: `completed` }
        );
      let c = (0, __contentScope.el)(t, i);
      if (!c) return { state: `missing` };
      if (c !== i)
        ((i = c),
          n.has(i) || n.set(i, Date.now()),
          r.log.push(`${t.kind}宿主已重绘，已重新定位并重新计算成熟窗口`));
      else if (!(Date.now() < e + a))
        return (
          a > 0 &&
            r.log.push(
              `${t.kind}宿主已出现 ${Math.max(0, Math.round((Date.now() - e) / 100) / 10)}s，进入内部就绪检查`,
            ),
          { state: `ready`, widget: i }
        );
    }
    return { state: `timed-out` };
  }

  async function vl(e, t, n, r, i) {
    let a = e,
      o = i;
    for (; Date.now() < r.deadline;) {
      n.has(a) || n.set(a, Date.now());
      let e = await (0, __contentScope.gl)(a, t, r, o);
      if (e === `completed` || r.isComplete(a)) return { state: `completed` };
      let i = (0, __contentScope.el)(t, a);
      if (!i) return { state: `missing` };
      if (i !== a || e === `replaced`) {
        ((a = i),
          n.has(a) || n.set(a, Date.now()),
          (o = Math.min(3e3, (0, __contentScope.fl)(r.deadline))),
          r.log.push(`${t.kind}控件已重绘，统一点击模块已重新定位`));
        continue;
      }
      let s = await (0, __contentScope._l)(a, t, n, r);
      return s.state === `ready` ? { state: `ready`, widget: s.widget } : s;
    }
    return { state: `timed-out` };
  }

  function yl(e) {
    return (
      e.tagName.toLowerCase() +
      (e.id ? `#${e.id}` : ``) +
      (e.className ? `.${String(e.className).split(/\s+/)[0]}` : ``)
    );
  }

  async function bl(e, t, n, r, i) {
    let a = (0, __contentScope.hl)(t);
    if (!a) throw Error(`未找到可点击目标`);
    let o = (0, __contentScope.yl)(a);
    r.log.push(`第 ${i} 次点击前已定位${e.kind}控件 ${o}`);
    let s = a === t,
      c = s ? e.strategy?.insetLeftPx : void 0,
      l = s && (e.strategy?.minVisibleMs ?? 0) > 0 ? n.get(t) : void 0,
      u = s ? e.strategy?.safetyWindowMs : void 0;
    if (l != null && u != null && Math.max(Date.now(), l + u) + __contentScope.Mc >= r.deadline)
      throw Error(`${e.kind}剩余执行时间不足，已取消本轮可信点击`);
    let d,
      f,
      p,
      m = await (0, __contentScope.M)(a, {
        shadowTarget: e.strategy?.shadowTarget ?? !1,
        insetLeftPx: c,
        deadline: r.deadline,
        debugVisualize: !!(e.strategy?.debugVisualize && s),
        targetSeenAt: l,
        onPointerResult: (e) => {
          ((d = e.target), (f = e.screenOffset?.matches), (p = e.turnstileReadiness));
        },
      });
    if (s && c != null) {
      let t = d?.rect ?? a.getBoundingClientRect(),
        n = d?.x ?? t.left + Math.min(c, t.width / 2),
        o = d?.y ?? t.top + t.height / 2,
        s =
          p?.signal === `inner-frame`
            ? `内部验证帧已稳定`
            : p?.signal === `interactive-control`
              ? `内部复选框已稳定`
              : `内部状态不可观测，已走满安全窗口`,
        l = d
          ? d.hit || d.withinHost
            ? `${e.kind}目标范围（${s}）`
            : `未命中${e.kind}目标`
          : `${m === `trusted` ? `可信` : `DOM`}点击前目标检查通过`,
        u = f === !1 ? `；浏览器屏幕坐标偏移异常` : ``,
        h = p
          ? `；成熟检查=${s}，控件已出现 ${(p.widgetAgeMs / 1e3).toFixed(1)}s，本次额外等待 ${(p.waitedMs / 1e3).toFixed(1)}s`
          : ``;
      r.log.push(
        `第 ${i} 次${m === `trusted` ? `可信` : `DOM`}点击已发出：坐标 (${Math.round(n)}, ${Math.round(o)})，目标区域 left=${Math.round(t.left)} top=${Math.round(t.top)} ${Math.round(t.width)}×${Math.round(t.height)}，命中=${l}${h}${u}；等待验证响应`,
      );
    } else
      r.log.push(`第 ${i} 次${m === `trusted` ? `可信` : `DOM`}点击已发送到验证控件，等待验证响应`);
  }

  async function xl(e, t, n, r) {
    let i = Math.min(
        e.strategy?.responseWaitMs ?? __contentScope.Oc,
        (0, __contentScope.fl)(r.deadline),
      ),
      a = Date.now(),
      o = Math.min(r.deadline, a + i),
      s = a - 4e3,
      c = t,
      l = (0, __contentScope.ll)(e, t),
      u = null;
    for (; Date.now() < o;) {
      if ((await (0, __contentScope.pl)(400, o), (0, __contentScope.ul)(l, e), r.isComplete(c)))
        return (r.log.push(`${e.kind}验证已自动完成（检测到当前控件的 token 或已验证状态）`), !0);
      let t = (0, __contentScope.dl)(e, l.scope),
        i = t.includes(c) ? c : (t[0] ?? null);
      if (
        (!i &&
          l.scope instanceof Element &&
          !l.scope.isConnected &&
          (i = (0, __contentScope.$c)(e)),
        i)
      )
        (i !== c &&
          ((c = i),
          (l = (0, __contentScope.ll)(e, i, l)),
          r.log.push(`${e.kind}控件在点击后已重挂载，继续按新控件校验完成状态`)),
          n.has(i) || n.set(i, Date.now()),
          (u = null));
      else if (((u ??= Date.now()), Date.now() - u >= __contentScope.jc)) {
        (0, __contentScope.ul)(l, e);
        let t =
            l.hadPendingResponse && l.observedResponseValue && !(0, __contentScope.ol)(e, l.scope),
          n =
            l.hadDisabledSubmit &&
            (0, __contentScope.cl)(l.scope).some((e) => !(0, __contentScope.sl)(e));
        if (t || n)
          return (
            r.log.push(
              `${e.kind}控件消失后未重新挂载，${n ? `所属表单提交控件已解锁` : `所属作用域已无待处理响应字段`}，视为验证完成`,
            ),
            !0
          );
      }
      Date.now() - s >= 4e3 &&
        ((s = Date.now()),
        r.log.push(`等待${e.kind}验证完成中... (${Math.round((Date.now() - a) / 1e3)}s)`));
    }
    return r.isComplete(c);
  }

  async function Sl(e, t) {
    let n = (0, __contentScope.Qc)(e);
    if (n.length > 0 ? n.every((e) => t.isComplete(e)) : t.isComplete()) return !0;
    (
      await (0, __contentScope.Zc)((0, __contentScope.Kc)(), {
        budgetMs: Math.min(__contentScope.Bc, (0, __contentScope.fl)(t.deadline)),
      })
    ).outcome === `revealed` &&
      t.log.push(`${e.kind}控件原本位于视口外，已滚动页面将其带入视口后重新判定`);
    let r = await (0, __contentScope.ml)(e, t);
    if (r.state === `completed`) return !0;
    if (r.state === `missing`) return !1;
    let i = new WeakMap();
    for (let e of r.widgets) i.set(e, r.appearedAt);
    let a = [...r.widgets],
      o = new Set(a);
    for (let n = 0; n < a.length; n++) {
      let r = a[n];
      if (t.isComplete(r)) continue;
      let s = e.strategy?.maxAttempts ?? __contentScope.Ec;
      for (let o = 1; o <= s && Date.now() < t.deadline; o++)
        try {
          if (
            o > 1 &&
            (await (0, __contentScope.pl)(
              e.strategy?.retryDelayMs ?? __contentScope.Dc,
              t.deadline,
            ),
            t.isComplete(r))
          ) {
            t.log.push(`${e.kind}已完成（重试前检测到完成信号），无需再次点击`);
            break;
          }
          let n = (0, __contentScope.el)(e, r);
          if (n) n !== r && ((r = n), i.has(r) || i.set(r, Date.now()));
          else {
            let n = await (0, __contentScope.ml)(e, {
              ...t,
              detectedAt: Date.now(),
              deadline: Math.min(t.deadline, Date.now() + 3e3),
            });
            if (n.state === `completed`) return !0;
            if (n.state !== `ready`) break;
            ((r = n.widgets[0]), i.set(r, n.appearedAt));
          }
          let a = await (0, __contentScope.vl)(
            r,
            e,
            i,
            t,
            Math.min(
              o === 1 ? (e.strategy?.layoutWaitMs ?? __contentScope.Tc) : 3e3,
              (0, __contentScope.fl)(t.deadline),
            ),
          );
          if (
            a.state === `completed` ||
            a.state !== `ready` ||
            ((r = a.widget),
            o > 1 && t.log.push(`${e.kind}尚未完成，尝试再次点击`),
            await (0, __contentScope.bl)(e, r, i, t, o),
            await (0, __contentScope.xl)(e, r, i, t))
          )
            break;
          let c = (0, __contentScope.el)(e, r);
          (c &&
            (e.strategy?.shadowTarget || (e.strategy?.minVisibleMs ?? 0) > 0) &&
            ((r = c),
            i.set(r, Date.now()),
            t.log.push(`${e.kind}未返回完成信号，下一次重试将按新一代控件重新计算成熟窗口`)),
            o < s
              ? t.log.push(`${e.kind}第 ${o} 次点击后未出现完成信号，稍后尝试第 ${o + 1} 次点击`)
              : t.log.push(`已重试 ${o} 次仍未完成${e.kind}验证，需要人工介入`));
        } catch (c) {
          t.log.push(`点击${e.kind}控件失败：${c instanceof Error ? c.message : String(c)}`);
          let l = (0, __contentScope.el)(e, r);
          (l &&
            (e.strategy?.shadowTarget || (e.strategy?.minVisibleMs ?? 0) > 0) &&
            ((r = l), i.set(r, Date.now())),
            o < s
              ? await (0, __contentScope.pl)(800, t.deadline)
              : n < a.length - 1 && t.log.push(`当前控件无法点击，尝试下一个候选控件`));
        }
      for (let t of (0, __contentScope.Qc)(e))
        o.has(t) || (o.add(t), a.push(t), i.set(t, Date.now()));
      n < a.length - 1 && t.log.push(`${e.kind}当前候选未完成验证，尝试下一个候选控件`);
    }
    return (
      !(0, __contentScope.Qc)(e).some((e) => !t.isComplete(e)) ||
      (t.log.push(`${e.kind}所有候选控件均未能自动完成验证，需要人工介入`), !1)
    );
  }

  function Al(e) {
    let t = ``;
    for (let n of e) {
      let e = n.charCodeAt(0);
      if (e >= 65296 && e <= 65305) t += String(e - 65296);
      else
        switch (n) {
          case `\xA0`:
            t += ` `;
            break;
          case `＋`:
          case `﹢`:
            t += `+`;
            break;
          case `−`:
          case `﹣`:
          case `－`:
          case `‐`:
          case `‑`:
          case `‒`:
          case `–`:
          case `—`:
            t += `-`;
            break;
          case `＊`:
          case `∗`:
          case `×`:
          case `ｘ`:
          case `Ｘ`:
          case `x`:
          case `X`:
            t += `*`;
            break;
          case `／`:
          case `⁄`:
          case `∕`:
          case `÷`:
            t += `/`;
            break;
          case `．`:
            t += `.`;
            break;
          case `＝`:
            t += `=`;
            break;
          case `？`:
            t += `?`;
            break;
          default:
            t += n;
        }
    }
    return t;
  }

  function jl(e) {
    return Object.is(e, -0) ? `0` : String(e);
  }

  function Ml(e) {
    let t = (0, __contentScope.Al)(e);
    if (t.length > 128) return null;
    let n = t.match(__contentScope.Tl);
    if (!n) return null;
    let r = Number(n[1]),
      i = n[2],
      a = Number(n[3]);
    if (!Number.isFinite(r) || !Number.isFinite(a) || (i === `/` && a === 0)) return null;
    let o;
    switch (i) {
      case `+`:
        o = r + a;
        break;
      case `-`:
        o = r - a;
        break;
      case `*`:
        o = r * a;
        break;
      case `/`:
        o = r / a;
    }
    return Number.isFinite(o)
      ? {
          expression: `${n[1]} ${i} ${n[3]}`,
          left: r,
          operator: i,
          right: a,
          result: o,
          answer: (0, __contentScope.jl)(o),
        }
      : null;
  }

  function Nl(e) {
    let t = (0, __contentScope.Al)(e).trim(),
      n = (0, __contentScope.Ml)(t);
    if (n) return n;
    if (__contentScope.Dl.test(t)) return null;
    let r = t.match(__contentScope.El)?.[1];
    return r ? (0, __contentScope.Ml)(r) : null;
  }

  function Pl(e) {
    if (
      !(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) ||
      e.disabled ||
      e.readOnly ||
      e.hidden ||
      e.closest(`[hidden], [aria-hidden="true"]`)
    )
      return !1;
    let t = e;
    for (; t;) {
      let e = window.getComputedStyle(t);
      if (e.display === `none` || e.visibility === `hidden` || e.visibility === `collapse`)
        return !1;
      t = t.parentElement;
    }
    return !(e instanceof HTMLInputElement && __contentScope.Ol.has(e.type.toLowerCase()));
  }

  function Fl(e) {
    let t = [];
    for (let n of Array.from(e.labels ?? [])) n.textContent && t.push(n.textContent);
    let n = e.getAttribute(`aria-labelledby`)?.trim().split(/\s+/) ?? [];
    for (let r of n) {
      let n = e.ownerDocument.getElementById(r);
      n?.textContent && t.push(n.textContent);
    }
    let r = e.getAttribute(`aria-describedby`)?.trim().split(/\s+/) ?? [];
    for (let n of r) {
      let r = e.ownerDocument.getElementById(n);
      r?.textContent && t.push(r.textContent);
    }
    return t;
  }

  function Il(e) {
    return [
      e.name,
      e.id,
      e.className,
      e.getAttribute(`placeholder`),
      e.getAttribute(`aria-label`),
      e.getAttribute(`title`),
      ...(0, __contentScope.Fl)(e),
    ]
      .filter(Boolean)
      .join(` `);
  }

  function Ll(e) {
    let t = [
        e.getAttribute(`placeholder`) ?? ``,
        e.getAttribute(`aria-label`) ?? ``,
        e.getAttribute(`title`) ?? ``,
        ...(0, __contentScope.Fl)(e),
      ],
      n = e.parentElement;
    for (
      let e = 0;
      n && e < 4 && (t.push(n.textContent ?? ``), !(n instanceof HTMLFormElement));
      e += 1
    )
      n = n.parentElement;
    let r = e.closest(`form`);
    return (
      r && n !== r && t.push(r.textContent ?? ``),
      [...new Set(t.map((e) => e.trim()).filter(Boolean))]
    );
  }

  function Rl(e = document) {
    let t = [...e.querySelectorAll(`input, textarea`)]
      .filter(__contentScope.Pl)
      .map((e) => {
        let t = (0, __contentScope.Ll)(e),
          n = null,
          r = -1;
        for (let e = 0; e < t.length; e += 1)
          if (((n = (0, __contentScope.Nl)(t[e])), n)) {
            r = e;
            break;
          }
        return !n || !__contentScope.Cl.test((0, __contentScope.Il)(e))
          ? null
          : { input: e, parsed: n, score: 1e3 + Math.max(0, 100 - r) };
      })
      .filter((e) => e !== null)
      .sort((e, t) => t.score - e.score)[0];
    return t ? { ...t.parsed, input: t.input } : null;
  }

  function zl(e = document) {
    let t = (0, __contentScope.Rl)(e);
    return t
      ? (__contentScope.kl.set(t.input, t.answer), (0, __contentScope.A)(t.input, t.answer), t)
      : null;
  }

  function Bl(e) {
    if (!(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement)) return !1;
    let t = __contentScope.kl.get(e);
    return t !== void 0 && e.value.trim() === t;
  }

  async function Hl(e, t, r) {
    let i = Math.min(r ?? 1 / 0, Date.now() + __contentScope.To),
      a = `腾讯验证码内嵌页面未就绪`;
    e.push(`检测到腾讯验证码 iframe，正在连接本轮验证码助手`);
    for (let r = 0; r < 3 && Date.now() < i; r += 1) {
      if ((0, __contentScope.x)() !== t) return { solved: !1, error: `签到任务已停止` };
      let r = (0, __contentScope.Oo)();
      if (!r) {
        if (
          (await (0, __contentScope.w)(Math.min(1200, Math.max(0, i - Date.now()))),
          (0, __contentScope.x)() !== t)
        )
          return { solved: !1, error: `签到任务已停止` };
        if (((r = (0, __contentScope.Oo)()), !r)) return { solved: !1, dismissed: !0 };
      }
      let o = `sf-${crypto.randomUUID()}`,
        s = `p-frame-${crypto.randomUUID()}`,
        c = r.getAttribute(`data-aah-pointer-target`);
      r.setAttribute(`data-aah-pointer-target`, s);
      let l = !1,
        u = ``,
        d = 0,
        f,
        p = !1;
      try {
        let c = Math.min(i, Date.now() + 8e3);
        for (; Date.now() < c && (0, __contentScope.x)() === t;) {
          if (((u = r.src), (0, __contentScope.Co)(u))) {
            let e = await (0, __contentScope.n)({
              type: `SLIDER_FRAME_PREPARE`,
              runId: t,
              sessionId: o,
              frameToken: s,
              frameUrl: u,
            });
            if (e.ok) {
              l = !0;
              break;
            }
            a = e.error;
          }
          if (!r.isConnected) {
            p = !0;
            break;
          }
          await (0, __contentScope.w)(350);
        }
        if (!l) {
          if (p) continue;
          return (e.push(`滑块尚未开始拖动：${a}`), { solved: !1, error: a });
        }
        let m = Date.now(),
          h = !1;
        for (; Date.now() < i && (0, __contentScope.x)() === t;) {
          let i = (0, __contentScope.Oo)();
          if (i && (i !== r || r.src !== u)) {
            p = !0;
            break;
          }
          !(0, __contentScope.Do)(r) && !i ? (f ??= Date.now()) : (f = void 0);
          let s = await (0, __contentScope.n)({
            type: `SLIDER_FRAME_STATUS`,
            runId: t,
            sessionId: o,
          });
          if (s.ok && s.feature?.sliderFrame) {
            let t = s.feature.sliderFrame;
            if (
              (t.state !== `connecting` &&
                !h &&
                (e.push(`已进入腾讯验证码内嵌页面，等待图片和真实滑块把手就绪`), (h = !0)),
              t.steps.length > d)
            ) {
              for (let n of t.steps.slice(d)) e.push(n);
              d = t.steps.length;
            }
            if (t.result && (t.result.solved || t.result.dismissed || f == null)) return t.result;
            if (
              t.state === `connecting` &&
              (r.contentWindow?.postMessage(
                { type: __contentScope.wo, sessionId: o },
                new URL(u).origin,
              ),
              Date.now() - m > 7e3)
            ) {
              a = `验证码助手未能连接当前 iframe，请重新加载扩展后新开任务页`;
              break;
            }
          } else if (f == null) {
            a = s.ok ? `后台没有返回验证码会话状态` : s.error;
            break;
          }
          if (f != null && Date.now() - f >= 1200) return { solved: !1, dismissed: !0 };
          await (0, __contentScope.w)(400);
        }
        if (!p)
          return (
            Date.now() >= i
              ? (a = `腾讯验证码求解达到本轮时限`)
              : (0, __contentScope.x)() !== t && (a = `签到任务已停止`),
            e.push(`腾讯验证码未完成：${a}`),
            { solved: !1, error: a }
          );
        e.push(`验证码 iframe 已重建，正在重新连接新挑战`);
      } finally {
        ((0, __contentScope.n)({
          type: `SLIDER_FRAME_CANCEL`,
          runId: t,
          sessionId: o,
        }),
          r.getAttribute(`data-aah-pointer-target`) === s &&
            (c == null
              ? r.removeAttribute(`data-aah-pointer-target`)
              : r.setAttribute(`data-aah-pointer-target`, c)));
      }
    }
    return { solved: !1, error: a };
  }

  function Ul(e, t, n) {
    if (__contentScope.Vl?.runId === t) return __contentScope.Vl.promise;
    let r = (0, __contentScope.Hl)(e, t, n).finally(() => {
      __contentScope.Vl?.promise === r && (__contentScope.Vl = void 0);
    });
    return ((__contentScope.Vl = { runId: t, promise: r }), r);
  }

  function Ql(e) {
    try {
      return e.matches(__contentScope.Zl) || !!e.closest(__contentScope.Zl);
    } catch {
      return !1;
    }
  }

  function Z(e) {
    try {
      return [...document.querySelectorAll(e)];
    } catch {
      return [];
    }
  }

  function uu(e) {
    return __contentScope.ql.every((t) => e.includes(t));
  }

  function du() {
    return __contentScope.Kl.test(location.hostname)
      ? (0, __contentScope.Z)(`script`).some((e) => (0, __contentScope.uu)(e.textContent ?? ``))
        ? !0
        : (0, __contentScope.uu)(document.documentElement?.innerHTML ?? ``)
      : !1;
  }

  function fu(e) {
    return (0, __contentScope.Ic)(e);
  }

  function pu(e) {
    return (0, __contentScope.Z)(e).some(__contentScope.fu);
  }

  function mu(e, t) {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  }

  function hu(e) {
    return e.some(
      (e) =>
        (0, __contentScope.mu)(e, __contentScope.eu) ||
        ((0, __contentScope.mu)(e, __contentScope.tu) &&
          (0, __contentScope.Ou)(e, __contentScope.nu).some(__contentScope.fu)),
    );
  }

  function gu() {
    return (0, __contentScope.pu)(__contentScope.q.widgets);
  }

  function _u(e) {
    let t = document.title.trim().toLowerCase();
    return e.some((e) => t.includes(e));
  }

  function vu() {
    return (0, __contentScope._u)(__contentScope.iu);
  }

  function yu() {
    return (0, __contentScope.pu)(__contentScope.Wl)
      ? !0
      : (0, __contentScope._u)(__contentScope.ru) &&
          (0, __contentScope.Z)(__contentScope.Gl).length > 0;
  }

  function bu(e) {
    return e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement
      ? e.value.trim()
      : (e.getAttribute(`value`) ?? ``).trim();
  }

  function xu() {
    if ((0, __contentScope.pu)(__contentScope.Jl)) return [];
    let e = (0, __contentScope.Z)(
      `input[id^="cf-chl-widget-"][name="cf-turnstile-response"], textarea[id^="cf-chl-widget-"][name="cf-turnstile-response"]`,
    ).flatMap((e) => {
      if ((0, __contentScope.bu)(e).length > 0) return [];
      let t = e.parentElement;
      return !t ||
        t === document.body ||
        t === document.documentElement ||
        t instanceof HTMLFormElement
        ? []
        : (0, __contentScope.fu)(t)
          ? [t]
          : [];
    });
    return [...new Set(e)];
  }

  function Su(e) {
    return [
      ...new Set([...(0, __contentScope.Z)(e.selectors), ...(e.candidateElements?.() ?? [])]),
    ];
  }

  function Cu(e, t) {
    if (!t) return (0, __contentScope.Z)(e.tokenSelectors);
    let n = (0, __contentScope.Ou)(t, e.tokenSelectors);
    if (n.length > 0) return n;
    let r = t.closest(`form`);
    if (r) {
      let t = (0, __contentScope.Ou)(r, e.tokenSelectors);
      if (t.length > 0) return t;
    }
    let i = t.parentElement;
    return i ? (0, __contentScope.Ou)(i, e.tokenSelectors) : [];
  }

  function wu(e, t) {
    let n = (0, __contentScope.Cu)(e, t);
    return n.length > 0 && n.every((e) => (0, __contentScope.bu)(e).length > 0);
  }

  function Tu(e) {
    let t = (0, __contentScope.Z)(e.tokenSelectors).filter(
      (e) => (0, __contentScope.bu)(e).length === 0,
    );
    if (t.length === 0) return !1;
    let n =
        e.kind === `Turnstile` &&
        t.some(
          (e) =>
            /^cf-chl-widget-.+_response$/i.test(e.id) &&
            e.getAttribute(`name`) === `cf-turnstile-response` &&
            !!e.parentElement &&
            (0, __contentScope.fu)(e.parentElement),
        ),
      r = e.kind === `Turnstile` && (0, __contentScope.Z)(__contentScope.Gl).length > 0;
    return (
      n ||
      r ||
      t.some((e) =>
        (0, __contentScope.Ou)(
          e.closest(`form`) ?? document,
          `button[type="submit"], input[type="submit"]`,
        ).some(
          (e) => (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) && e.disabled,
        ),
      )
    );
  }

  function Eu(e) {
    if (
      e.getAttribute(`aria-checked`) === `true` ||
      (e instanceof HTMLInputElement && e.type === `checkbox` && e.checked)
    )
      return !0;
    for (let t of [`data-state`, `data-status`]) {
      let n = e.getAttribute(t)?.trim().toLowerCase();
      if (n && __contentScope.ou.has(n)) return !0;
    }
    for (let t of [`data-response`, `data-hcaptcha-response`])
      if ((e.getAttribute(t) ?? ``).trim()) return !0;
    return !1;
  }

  function Du(e, t) {
    let n = t ? [t] : (0, __contentScope.Z)(e.selectors);
    for (let e of n)
      if (
        (0, __contentScope.Eu)(e) ||
        (0, __contentScope.Ou)(
          e,
          `[aria-checked], [data-state], [data-status], [data-response], [data-hcaptcha-response]`,
        ).some(__contentScope.Eu)
      )
        return !0;
    return (
      e.kind === `reCAPTCHA` &&
      (0, __contentScope.Ou)(t?.closest(`form`) ?? t ?? document, `.recaptcha-checkbox-checked`)
        .length > 0
    );
  }

  function Ou(e, t) {
    try {
      return [...e.querySelectorAll(t)];
    } catch {
      return [];
    }
  }

  function ku(e, t) {
    if (e === `Arithmetic`) {
      let e = (0, __contentScope.Rl)();
      return !e || e.input.value.trim() === e.answer;
    }
    if (e === `CAPTCHA`)
      return (0, __contentScope.Z)(
        `[class*="captcha" i][data-state="verified" i], [class*="captcha" i][data-status="success" i], [id*="captcha" i][data-state="verified" i], [id*="captcha" i][data-status="success" i]`,
      ).some(__contentScope.Eu);
    if (e === `Slider`) {
      if ((0, __contentScope.Oo)()) return !1;
      if ((0, __contentScope.gu)()) return (0, __contentScope.qs)(void 0, `tencent-page`).success;
      if ((0, __contentScope.du)()) return !1;
      if ((0, __contentScope.js)() || (0, __contentScope.Z)(__contentScope.Ao).length > 0)
        return !0;
      let e = (0, __contentScope.Z)(__contentScope.ko);
      return e.length > 0 && e.every(__contentScope.Eu) ? !0 : !(0, __contentScope.As)();
    }
    let n = __contentScope.Xl.find((t) => t.kind === e);
    return n ? (0, __contentScope.wu)(n, t) || (0, __contentScope.Du)(n, t) : !1;
  }

  function Au(e) {
    return (0, __contentScope.Bl)(e)
      ? !0
      : __contentScope.Xl.some((t) => {
          try {
            return e.matches(t.selectors) || !!e.closest(t.selectors);
          } catch {
            return !1;
          }
        });
  }

  function ju(e = !0) {
    if (
      (0, __contentScope.du)() ||
      (0, __contentScope.Oo)() ||
      ((0, __contentScope.gu)() && !(0, __contentScope.ku)(`Slider`)) ||
      ((0, __contentScope.As)() && !(0, __contentScope.ku)(`Slider`))
    )
      return `Slider`;
    let t = !1;
    for (let n of __contentScope.Xl) {
      let r = (0, __contentScope.Su)(n),
        i = e && (0, __contentScope.Tu)(n);
      if (
        (r.length !== 0 || i) &&
        ((t = !0),
        r.some((e) => (0, __contentScope.fu)(e) && !(0, __contentScope.ku)(n.kind, e)) || i)
      )
        return n.kind;
    }
    if ((0, __contentScope.Rl)()) return `Arithmetic`;
    let n = (0, __contentScope.Z)(__contentScope.$l).filter((e) => !(0, __contentScope.Au)(e));
    return (0, __contentScope.hu)(n.filter(__contentScope.fu)) && !(0, __contentScope.ku)(`CAPTCHA`)
      ? `CAPTCHA`
      : t || n.length > 0 || !(0, __contentScope.vu)() || (0, __contentScope.yu)()
        ? null
        : (0, __contentScope.Z)(__contentScope.Gl).length > 0 || (0, __contentScope.Mu)()
          ? `CAPTCHA`
          : null;
  }

  function Mu() {
    if (
      (0, __contentScope.pu)(
        `#challenge-stage input[type="checkbox"], #challenge-stage [role="checkbox"], #challenge-stage button, iframe[title*="checkbox" i]`,
      )
    )
      return !0;
    let e = (document.body?.innerText ?? ``).slice(0, 2e4);
    return __contentScope.au.some((t) => t.test(e));
  }

  function Nu(e = !0) {
    let t = (0, __contentScope.yu)(),
      n = (0, __contentScope.ju)(e);
    if (t) {
      let e = n
        ? __contentScope.Xl.some(
            (e) => e.kind === n && (0, __contentScope.Su)(e).some(__contentScope.fu),
          )
        : !1;
      return n && (n !== `Turnstile` || e || (0, __contentScope.Mu)())
        ? { category: `interactive`, kind: n }
        : {
            category: `managed`,
            kind: `Cloudflare`,
            embeddedInteractive: n ?? void 0,
          };
    }
    return n ? { category: `interactive`, kind: n } : null;
  }

  function Pu(e = !1) {
    return (0, __contentScope.Nu)(e) !== null;
  }

  function Fu(e) {
    let t = (0, __contentScope.zl)();
    return t ? (e.push(`已识别动态算式 ${t.expression}，并填写计算结果 ${t.answer}`), !0) : !1;
  }

  async function Iu(e, t, n, r) {
    if (e === `Arithmetic`) return (0, __contentScope.Fu)(t);
    if (e === `CAPTCHA`) return (t.push(`通用 CAPTCHA 类型无法自动化，需要人工识别`), !1);
    let i = __contentScope.Yl.find((t) => t.kind === e);
    return i
      ? (0, __contentScope.Sl)(i, {
          log: t,
          detectedAt: n,
          deadline: r,
          isComplete: (t) => {
            if (t) return (0, __contentScope.ku)(e, t);
            let n = (0, __contentScope.Cu)(i);
            return n.length > 0 && n.every((e) => (0, __contentScope.bu)(e).length > 0);
          },
        })
      : !1;
  }

  async function Lu(e, t, n = 12e4) {
    return !(0, __contentScope.yu)() ||
      (await (0, __contentScope.w)(600), !(0, __contentScope.yu)())
      ? { detected: !1, resolved: !0 }
      : (0, __contentScope.zu)(e, t, n);
  }

  async function Ru(e) {
    let t = !1,
      n = {
        push(n) {
          ((n.startsWith(`滑块第 `) || n.startsWith(`滑块求解已经在执行`)) && (t = !0), e.push(n));
        },
      },
      r = (0, __contentScope.x)();
    if (r && (0, __contentScope.Oo)())
      return { ...(await (0, __contentScope.Ul)(n, r)), attemptStarted: t };
    let i = (0, __contentScope.gu)(),
      a = await (i ? (0, __contentScope.Cc)(n) : (0, __contentScope.Sc)(n));
    return r && (0, __contentScope.x)() === r && (0, __contentScope.Oo)()
      ? { ...(await (0, __contentScope.Ul)(n, r)), attemptStarted: t }
      : !i &&
          !t &&
          !a.solved &&
          !a.dismissed &&
          r &&
          (0, __contentScope.x)() === r &&
          (0, __contentScope.gu)()
        ? { ...(await (0, __contentScope.Cc)(n)), attemptStarted: t }
        : { ...a, attemptStarted: t };
  }

  async function zu(e, t, n = 12e4, r = {}) {
    let i = r.includePendingResponse ?? !0,
      a = (0, __contentScope.Nu)(i),
      o = Math.max(0, r.appearanceWaitMs ?? 0);
    if (!a && o > 0) {
      let e = Date.now() + o;
      for (; !a && Date.now() < e;) {
        // A business result can end an empty appearance window, but never
        // takes precedence over a verification control already on the page.
        if (!(0, __contentScope.zp)() && typeof r.stopWhenReady === `function`) {
          try {
            if (r.stopWhenReady() === !0) return { detected: !1, resolved: !0 };
          } catch {}
        }
        await (0, __contentScope.w)(Math.min(__contentScope.lu, e - Date.now()));
        a = (0, __contentScope.Nu)(i);
      }
    }
    if (!a) return { detected: !1, resolved: !0 };
    if (a.kind === `Slider` || a.embeddedInteractive === `Slider`) {
      let t = await (0, __contentScope.Ru)(e);
      return t.dismissed
        ? (e.push(`验证码窗口已关闭，继续核对本次操作结果`),
          { detected: !0, resolved: !0, kind: `Slider` })
        : t.solved
          ? (e.push(`滑块验证已自动破解（${t.method}，距离=${t.distance}px）`),
            { detected: !0, resolved: !0, kind: `Slider` })
          : {
              detected: !0,
              resolved: !1,
              kind: `Slider`,
              error: t.error,
              sliderAttemptStarted: t.attemptStarted,
            };
    }
    if (a.kind === `Arithmetic` || a.embeddedInteractive === `Arithmetic`)
      return {
        detected: !0,
        resolved: (0, __contentScope.Fu)(e),
        kind: `Arithmetic`,
      };
    let s = Date.now(),
      c = s + n,
      l = (0, __contentScope.vu)(),
      u = new Set(),
      d = new Set(),
      f = new Map(),
      p = a.kind,
      m = async (n) => {
        u.has(n) ||
          d.has(n) ||
          ((p = n),
          f.has(n) || f.set(n, Date.now()),
          !(n === `CAPTCHA` && Date.now() - f.get(n) < __contentScope.cu) &&
            ((await (0, __contentScope.Iu)(n, e, f.get(n), c))
              ? u.add(n)
              : (d.add(n),
                e.push(`${n}验证控件无法自动完成，等待你在当前标签页手动完成`),
                await t(`${n}需要你在当前标签页完成验证；自动点击未能成功验证`))));
      };
    for (
      a.category === `interactive`
        ? await m(a.kind)
        : e.push(`检测到Cloudflare托管式安全检查，等待页面自然完成并跳转`);
      Date.now() - s < n;
    ) {
      await (0, __contentScope.w)(__contentScope.lu);
      let t = [...u, ...d].find((e) => (0, __contentScope.ku)(e)),
        n = (0, __contentScope.Nu)(i);
      if (n?.kind === `Arithmetic` || n?.embeddedInteractive === `Arithmetic`)
        return {
          detected: !0,
          resolved: (0, __contentScope.Fu)(e),
          kind: `Arithmetic`,
        };
      if (n?.kind === `Slider` || n?.embeddedInteractive === `Slider`) {
        let t = await (0, __contentScope.Ru)(e);
        return t.dismissed
          ? (e.push(`验证码窗口已关闭，继续核对本次操作结果`),
            { detected: !0, resolved: !0, kind: `Slider` })
          : t.solved
            ? (e.push(`滑块验证已自动破解（${t.method}，距离=${t.distance}px）`),
              { detected: !0, resolved: !0, kind: `Slider` })
            : {
                detected: !0,
                resolved: !1,
                kind: `Slider`,
                error: t.error,
                sliderAttemptStarted: t.attemptStarted,
              };
      }
      if (
        l &&
        !(0, __contentScope.vu)() &&
        n?.category !== `interactive` &&
        !n?.embeddedInteractive
      )
        return (
          e.push(`页面已离开安全验证状态，继续执行`),
          { detected: !0, resolved: !0, kind: p }
        );
      if (a.category === `managed` && !(0, __contentScope.yu)() && n?.category !== `interactive`)
        return (
          e.push(`Cloudflare 托管检查已结束，继续执行`),
          { detected: !0, resolved: !0, kind: p }
        );
      if (!n)
        return (
          e.push(
            t
              ? `${t}已通过验证信号确认完成，继续执行`
              : `安全验证控件已隐藏或页面已离开验证状态，继续执行`,
          ),
          { detected: !0, resolved: !0, kind: p }
        );
      if (n.category === `interactive`) {
        await m(n.kind);
        continue;
      }
      let r = Date.now() - s;
      n.embeddedInteractive &&
        ((0, __contentScope.Mu)() || r >= __contentScope.su) &&
        (await m(n.embeddedInteractive));
    }
    return { detected: !0, resolved: !1, kind: p };
  }

  function Lp(e) {
    let t = e.startsWith(__contentScope.Pp) ? e.slice(14) : e;
    return __contentScope.Ip.has(t);
  }

  function Rp(e, t) {
    let n = e;
    for (; n;) {
      let e = [n.getAttribute?.(`aria-label`) ?? ``, n.textContent ?? ``].join(` `);
      if (t.test(e)) return !0;
      n = n.parentElement;
    }
    return !1;
  }

  function zp() {
    let e = document,
      t = [
        `input[autocomplete="one-time-code"]`,
        `input[name*="otp" i]`,
        `input[id*="otp" i]`,
        `input[name*="totp" i]`,
        `input[id*="totp" i]`,
        `input[name*="mfa" i]`,
        `input[id*="mfa" i]`,
        `input[name*="2fa" i]`,
        `input[id*="2fa" i]`,
      ],
      n = (e) => {
        let t = e;
        for (; t;) {
          if (window.getComputedStyle(t).display === `none`) return !0;
          t = t.parentElement;
        }
        return !1;
      },
      r = (e) => !n(e) && (0, __contentScope.O)(e);
    if (t.some((t) => [...e.querySelectorAll(t)].some(r))) return !0;
    let i = /(?:验证码|校验码|动态码|verification code|二次验证)/i,
      a = /(?:发送验证码|邮箱验证)/i;
    for (let t of e.querySelectorAll(`input[name*="code" i]`))
      if (t instanceof HTMLInputElement && r(t) && (0, __contentScope.Rp)(t, i)) return !0;
    for (let t of e.querySelectorAll(`input[inputmode="numeric" i]`))
      if (t instanceof HTMLInputElement && r(t) && (0, __contentScope.Rp)(t, a)) return !0;
    return !1;
  }

  async function Bp(e, stopWhenReady) {
    let t = Date.now() + e,
      n = Math.min(__contentScope.Fp, e),
      r = !1;
    for (;;) {
      if ((0, __contentScope.Pu)(!1) || (0, __contentScope.zp)()) return !0;
      if (typeof stopWhenReady === `function`) {
        try {
          if (stopWhenReady() === !0) return !1;
        } catch {}
      }
      if (!r) {
        r = !0;
        if (n > 0) {
          await (0, __contentScope.Zc)((0, __contentScope.Kc)(), {
            budgetMs: Math.min(n, Math.max(0, t - Date.now())),
          });
          if ((0, __contentScope.Pu)(!1) || (0, __contentScope.zp)()) return !0;
          if (typeof stopWhenReady === `function`) {
            try {
              if (stopWhenReady() === !0) return !1;
            } catch {}
          }
        }
      }
      let e = t - Date.now();
      if (e <= 0) return !1;
      await (0, __contentScope.w)(Math.min(__contentScope.Mp, e));
    }
  }

  async function Vp(e, t, n, r = 0, i = `签到点击`, options = {}) {
    let a = (0, __contentScope.x)(),
      o = Math.min(Math.max(0, r), __contentScope.Np);
    if (!(await (0, __contentScope.Bp)(o, options.stopWhenReady)))
      return (0, __contentScope.x)() === a
        ? (o > 0 &&
            e.push(
              `${i}后未发现安全验证证据，继续核对本次${i === `签到点击` ? `签到` : `操作`}结果`,
            ),
          { detected: !1, resolved: !0 })
        : { detected: !1, resolved: !1, error: `签到任务已停止` };
    o > 0 &&
      e.push(
        `${i}后检测到安全验证，开始等待本次${i === `签到点击` ? `签到` : `操作`}触发的安全验证`,
      );
    let s = 0,
      c = Date.now() + n,
      l = !1,
      u = !1,
      d;
    for (;;) {
      if ((0, __contentScope.x)() !== a)
        return {
          detected: !!d || u,
          resolved: !1,
          kind: d?.kind,
          error: `签到任务已停止`,
        };
      if (d && Date.now() >= s)
        return {
          ...d,
          error: `签到滑块控件就绪等待期结束，尚未开始拖动：${d.error}。控件可能未加载、被遮挡或不受当前识别器支持`,
        };
      let i = [],
        o = await (0, __contentScope.zu)(
          {
            push(t) {
              (0, __contentScope.Lp)(t) ? i.push(t) : e.push(t);
            },
          },
          t,
          n,
          {
            includePendingResponse: !1,
            appearanceWaitMs: l || u ? 0 : r,
            stopWhenReady: options.stopWhenReady,
          },
        );
      if ((0, __contentScope.x)() !== a)
        return {
          detected: o.detected || !!d,
          resolved: !1,
          kind: o.kind,
          error: `签到任务已停止`,
        };
      if (
        o.kind !== `Slider` ||
        o.resolved ||
        o.sliderAttemptStarted !== !1 ||
        !__contentScope.Ip.has(o.error ?? ``)
      ) {
        if (((d = void 0), o.resolved && (0, __contentScope.zp)())) {
          (u || e.push(`签到流程检测到验证码/二次验证控件，继续观察当前验证状态`), (u = !0));
          let t = c - Date.now();
          if (t <= 0)
            return {
              detected: !0,
              resolved: !1,
              kind: `VerificationCode`,
              error: `签到验证码/二次验证未在等待时间内结束`,
            };
          await (0, __contentScope.w)(Math.min(__contentScope.Mp, t));
          continue;
        }
        if (!o.resolved) for (let t of i) e.push(t);
        return (
          l && !o.detected && e.push(`签到验证码控件暂时不可见，继续核对签到结果并观察后续验证`),
          {
            ...o,
            detected: o.detected || l || u,
            ...(u && !o.kind ? { kind: `VerificationCode` } : {}),
          }
        );
      }
      ((d = o),
        (l ||=
          ((s = Date.now() + __contentScope.Ap),
          e.push(`签到滑块控件尚未就绪，尚未开始拖动；保留本次签到，给控件约 30 秒加载时间`),
          !0)),
        await (0, __contentScope.w)(Math.min(__contentScope.jp, Math.max(0, s - Date.now()))));
    }
  }

  function Up(e, t) {
    return (/(?:^|[\s|:：-])403(?:[\s|:：-]|$)/.test(t) &&
      /forbidden|denied|禁止|拒绝|无权限/i.test(`${t}\n${e}`)) ||
      /\b403\s+forbidden\b/i.test(e) ||
      /(?:error\s*code|http\s*error|状态码|错误码)\s*[:：]?\s*403\b/i.test(e)
      ? `站点返回 403 Forbidden（访问被拒绝）`
      : /(?:not\s+available\s+in\s+your\s+(?:region|country)|access\s+denied|国家\/?地区.{0,6}(?:不支持|受限|限制)|根据你所在的地区|地区限制)/i.test(
            e,
          ) && /(?:403|forbidden|denied|blocked|restricted)/i.test(e)
        ? `站点限制了当前地区 / 出口的访问（访问被拒绝）`
        : null;
  }

  function Wp() {
    let e = document.title ?? ``,
      t = `${e}\n${(document.body?.innerText ?? document.body?.textContent ?? ``).slice(0, 12e3)}`,
      n = (0, __contentScope.Up)(t, e);
    if (n && !/\b5\d{2}\b/.test(e)) return { message: n, retryable: !1 };
    let r =
        e.match(/(?:^|\|)\s*(5\d{2})\s*:/)?.[1] ??
        t.match(/(?:error\s*code|http\s*error)\s*(5\d{2})/i)?.[1],
      i = /bad\s*gateway|service\s*unavailable|gateway\s*time-?out/i.test(t),
      a =
        /cloudflare[\s\S]{0,800}host[\s\S]{0,80}error/i.test(t) ||
        /the\s+web\s+server\s+reported\s+a\s+bad\s+gateway/i.test(t);
    if (!r && !i && !a) return null;
    let o = r ? Number(r) : 502;
    return {
      message: `站点源服务器返回 ${o}（${a ? `Cloudflare 显示 Host Error` : `站点服务暂不可用`}）`,
      retryable: __contentScope.Hp.has(o),
    };
  }
  __contentState.Do = Do;
  __contentState.Oo = Oo;
  __contentState.qo = qo;
  __contentState.Jo = Jo;
  __contentState.Yo = Yo;
  __contentState.Xo = Xo;
  __contentState.Zo = Zo;
  __contentState.Qo = Qo;
  __contentState.$o = $o;
  __contentState.J = J;
  __contentState.Y = Y;
  __contentState.X = X;
  __contentState.es = es;
  __contentState.ts = ts;
  __contentState.ns = ns;
  __contentState.rs = rs;
  __contentState.is = is;
  __contentState.as = as;
  __contentState.os = os;
  __contentState.ss = ss;
  __contentState.cs = cs;
  __contentState.ls = ls;
  __contentState.us = us;
  __contentState.ds = ds;
  __contentState.fs = fs;
  __contentState.ps = ps;
  __contentState.ms = ms;
  __contentState.hs = hs;
  __contentState.gs = gs;
  __contentState._s = _s;
  __contentState.vs = vs;
  __contentState.ys = ys;
  __contentState.bs = bs;
  __contentState.xs = xs;
  __contentState.Ss = Ss;
  __contentState.Cs = Cs;
  __contentState.ws = ws;
  __contentState.Ts = Ts;
  __contentState.Es = Es;
  __contentState.Ds = Ds;
  __contentState.Os = Os;
  __contentState.ks = ks;
  __contentState.As = As;
  __contentState.js = js;
  __contentState.Ms = Ms;
  __contentState.Ns = Ns;
  __contentState.Ps = Ps;
  __contentState.Fs = Fs;
  __contentState.Rs = Rs;
  __contentState.zs = zs;
  __contentState.Bs = Bs;
  __contentState.Vs = Vs;
  __contentState.Us = Us;
  __contentState.Ws = Ws;
  __contentState.Gs = Gs;
  __contentState.Ks = Ks;
  __contentState.qs = qs;
  __contentState.rc = rc;
  __contentState.ic = ic;
  __contentState.ac = ac;
  __contentState.oc = oc;
  __contentState.sc = sc;
  __contentState.cc = cc;
  __contentState.lc = lc;
  __contentState.uc = uc;
  __contentState.dc = dc;
  __contentState.hc = hc;
  __contentState.vc = vc;
  __contentState.yc = yc;
  __contentState.bc = bc;
  __contentState.xc = xc;
  __contentState.Sc = Sc;
  __contentState.Cc = Cc;
  __contentState.Nc = Nc;
  __contentState.Pc = Pc;
  __contentState.Fc = Fc;
  __contentState.Ic = Ic;
  __contentState.Hc = Hc;
  __contentState.Kc = Kc;
  __contentState.qc = qc;
  __contentState.Jc = Jc;
  __contentState.Yc = Yc;
  __contentState.Xc = Xc;
  __contentState.Zc = Zc;
  __contentState.Qc = Qc;
  __contentState.$c = $c;
  __contentState.el = el;
  __contentState.tl = tl;
  __contentState.nl = nl;
  __contentState.rl = rl;
  __contentState.il = il;
  __contentState.al = al;
  __contentState.ol = ol;
  __contentState.sl = sl;
  __contentState.cl = cl;
  __contentState.ll = ll;
  __contentState.ul = ul;
  __contentState.dl = dl;
  __contentState.fl = fl;
  __contentState.pl = pl;
  __contentState.ml = ml;
  __contentState.hl = hl;
  __contentState.gl = gl;
  __contentState._l = _l;
  __contentState.vl = vl;
  __contentState.yl = yl;
  __contentState.bl = bl;
  __contentState.xl = xl;
  __contentState.Sl = Sl;
  __contentState.Al = Al;
  __contentState.jl = jl;
  __contentState.Ml = Ml;
  __contentState.Nl = Nl;
  __contentState.Pl = Pl;
  __contentState.Fl = Fl;
  __contentState.Il = Il;
  __contentState.Ll = Ll;
  __contentState.Rl = Rl;
  __contentState.zl = zl;
  __contentState.Bl = Bl;
  __contentState.Hl = Hl;
  __contentState.Ul = Ul;
  __contentState.Ql = Ql;
  __contentState.Z = Z;
  __contentState.uu = uu;
  __contentState.du = du;
  __contentState.fu = fu;
  __contentState.pu = pu;
  __contentState.mu = mu;
  __contentState.hu = hu;
  __contentState.gu = gu;
  __contentState._u = _u;
  __contentState.vu = vu;
  __contentState.yu = yu;
  __contentState.bu = bu;
  __contentState.xu = xu;
  __contentState.Su = Su;
  __contentState.Cu = Cu;
  __contentState.wu = wu;
  __contentState.Tu = Tu;
  __contentState.Eu = Eu;
  __contentState.Du = Du;
  __contentState.Ou = Ou;
  __contentState.ku = ku;
  __contentState.Au = Au;
  __contentState.ju = ju;
  __contentState.Mu = Mu;
  __contentState.Nu = Nu;
  __contentState.Pu = Pu;
  __contentState.Fu = Fu;
  __contentState.Iu = Iu;
  __contentState.Lu = Lu;
  __contentState.Ru = Ru;
  __contentState.zu = zu;
  __contentState.Lp = Lp;
  __contentState.Rp = Rp;
  __contentState.zp = zp;
  __contentState.Bp = Bp;
  __contentState.Vp = Vp;
  __contentState.Up = Up;
  __contentState.Wp = Wp;
  return {
    state: __contentState,
    api: {
      solve(log) {
        return (0, __contentScope.Sc)(log);
      },
      solveTencent(log) {
        return (0, __contentScope.Cc)(log);
      },
      solveFrame(...args) {
        return (0, __contentScope.Ul)(...args);
      },
      resolveChallenge(...args) {
        return (0, __contentScope.zu)(...args);
      },
    },
    initializers: [
      {
        order: 144,
        run() {
          __contentState.wo = `aah-slider-frame-connect`;
        },
      },
      {
        order: 145,
        run() {
          __contentState.To = 65e3;
        },
      },
      {
        order: 146,
        run() {
          __contentState.q = {
            widgets: [
              `.tencent-captcha-dy__slider-groove`,
              `.tencent-captcha-dy__slider-block`,
              `.tencent-captcha-dy__verify-bg`,
            ].join(`, `),
            success: [
              `.tencent-captcha-dy__slider-groove--success`,
              `.tencent-captcha-dy__slider-block--success`,
            ].join(`, `),
            handle: `.tencent-captcha-dy__slider-block`,
            background: `.tencent-captcha-dy__verify-bg`,
            backgroundImage: `.tencent-captcha-dy__verify-bg-img`,
            piece: `.tencent-captcha-dy__fg-item`,
            refresh: `.tencent-captcha-dy__footer-icon--refresh`,
          };
        },
      },
      {
        order: 147,
        run() {
          __contentState.Eo = new Set([
            `tcaptcha_iframe_drag`,
            `tcaptcha_iframe_dy`,
            `tCaptchaIframeArea`,
            `tcaptcha_popup`,
          ]);
        },
      },
      {
        order: 148,
        run() {
          __contentState.ko = [
            `.geetest_panel`,
            `.geetest_holder`,
            `.geetest_slider_button`,
            `.gt_holder`,
            `.gt_widget`,
            `.gt_slider_knob`,
            `.slide-verify`,
            `.slider-captcha`,
            `.captcha-slider`,
            `.verify-slider`,
            `.jigsaw-slider`,
            `.drag-captcha`,
            `.yidun_slider`,
            `.yidun_panel`,
            `.nc-container`,
            `.nc_iconfont.btn_slide`,
            `[class*="captcha" i][class*="slider" i]`,
            `[id*="captcha" i][id*="slider" i]`,
            `[class*="verify" i][class*="slider" i]`,
            `[class*="slider" i][class*="verify" i]`,
            `[class*="jigsaw" i][class*="slider" i]`,
            `[class*="slide-verify" i]`,
          ].join(`, `);
        },
      },
      {
        order: 149,
        run() {
          __contentState.Ao = [
            `.geetest_success`,
            `.gt_info_success`,
            `.gt_success`,
            `.yidun_success`,
            `[class*="captcha" i][data-state="verified" i]`,
            `[class*="captcha" i][data-status="success" i]`,
            `[class*="slider" i][data-state="verified" i]`,
            `[class*="slider" i][data-status="success" i]`,
            `[class*="verify" i][data-state="success" i]`,
          ].join(`, `);
        },
      },
      {
        order: 150,
        run() {
          __contentState.jo = [
            `[role="slider"]`,
            `[draggable="true"]`,
            `.geetest_slider_button`,
            `.gt_slider_knob`,
            `.nc_iconfont.btn_slide`,
            `[class*="slider" i][class*="btn" i]`,
            `[class*="slider" i][class*="button" i]`,
            `[class*="slider" i][class*="handle" i]`,
            `[class*="slider" i][class*="knob" i]`,
            `[class*="slide" i][class*="btn" i]`,
            `[class*="drag" i][class*="btn" i]`,
            `[class*="drag" i][class*="button" i]`,
            `[class*="move" i][class*="btn" i]`,
          ].join(`, `);
        },
      },
      {
        order: 151,
        run() {
          __contentState.Mo = `img, canvas, [class], [id]`;
        },
      },
      {
        order: 152,
        run() {
          __contentState.No =
            /captcha|challenge|verify|verification|puzzle|jigsaw|geetest|yidun|human|robot|验证码|验证|拼图|人机|安全校验/i;
        },
      },
      {
        order: 153,
        run() {
          __contentState.Po =
            /slider|slide|drag|swipe|move|track|rail|thumb|knob|handle|滑块|滑动|拖动|向右滑/i;
        },
      },
      {
        order: 154,
        run() {
          __contentState.Fo =
            /(?:slider|slide|drag|move)[-_\s]*(?:btn|button|handle|knob|thumb)|(?:btn|button|handle|knob|thumb)[-_\s]*(?:slider|slide|drag|move)|滑块|拖动|滑动/i;
        },
      },
      {
        order: 155,
        run() {
          __contentState.Io =
            /carousel|swiper|gallery|volume|seek|range|price|filter|toggle|switch|轮播|音量|价格|筛选/i;
        },
      },
      {
        order: 156,
        run() {
          __contentState.Lo =
            /background|(?:^|[-_\s])bg(?:$|[-_\s])|canvas|content|image|(?:^|[-_\s])img(?:$|[-_\s])/i;
        },
      },
      {
        order: 157,
        run() {
          __contentState.Ro =
            /piece|slice|template|block|puzzle|jigsaw|move[-_\s]*img|slider[-_\s]*img|拼图|缺块/i;
        },
      },
      {
        order: 158,
        run() {
          __contentState.zo =
            /track|rail|bar|slider[-_\s]*move|slide[-_\s]*track|drag[-_\s]*track|滑轨|拖动条/i;
        },
      },
      {
        order: 159,
        run() {
          __contentState.Bo =
            /drag|slide|swipe|move|complete.{0,12}(?:puzzle|verification)|拖动|滑动|按住|完成拼图|向右滑/i;
        },
      },
      {
        order: 160,
        run() {
          __contentState.Vo = [
            __contentScope.ko,
            `[role="dialog"]`,
            `[aria-modal="true"]`,
            `[class*="captcha" i]`,
            `[id*="captcha" i]`,
            `[class*="verify" i]`,
            `[id*="verify" i]`,
            `img`,
            `canvas`,
            `[style*="background" i]`,
          ].join(`, `);
        },
      },
      {
        order: 161,
        run() {
          __contentState.Ho =
            /refresh|reload|close|cancel|reset|help|(?:^|[-_\s])info(?:$|[-_\s])|刷新|换一张|关闭|取消|帮助|说明/i;
        },
      },
      {
        order: 162,
        run() {
          __contentState.Uo = 1200;
        },
      },
      {
        order: 163,
        run() {
          __contentState.Wo = 8388608;
        },
      },
      {
        order: 164,
        run() {
          __contentState.Go = `data-aah-pointer-target`;
        },
      },
      {
        order: 165,
        run() {
          __contentState.Is = (e) =>
            new Promise((t) => {
              let n = e === `tencent-frame` ? setTimeout(t, 250) : void 0;
              requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                  (n !== void 0 && clearTimeout(n), t());
                }),
              );
            });
        },
      },
      {
        order: 166,
        run() {
          __contentState.Ls = (e) => new Promise((t) => setTimeout(t, e));
        },
      },
      {
        order: 167,
        run() {
          __contentState.Js =
            /\b(?:verified|verification successful|success|passed)\b|验证\s*成功|校验\s*成功|验证\s*通过|已\s*通过/i;
        },
      },
      {
        order: 168,
        run() {
          __contentState.Ys =
            /too short|not far enough|move (?:a little )?further|偏左|距离过短|滑动不足|还差一点|未拖到位/i;
        },
      },
      {
        order: 169,
        run() {
          __contentState.Xs =
            /too far|overshoot|move (?:a little )?back|偏右|距离过长|滑过头|拖过头/i;
        },
      },
      {
        order: 170,
        run() {
          __contentState.Zs =
            /failed|failure|incorrect|try again|retry|error|验证失败|校验失败|请重试|重新尝试|再试一次/i;
        },
      },
      {
        order: 171,
        run() {
          __contentState.Qs =
            /refresh|reload|retry|try again|change image|next image|刷新|换一张|重试|重新加载/i;
        },
      },
      {
        order: 172,
        run() {
          __contentState.$s = /close|cancel|关闭|取消/i;
        },
      },
      {
        order: 173,
        run() {
          __contentState.ec = 900;
        },
      },
      {
        order: 174,
        run() {
          __contentState.tc = 1200;
        },
      },
      {
        order: 175,
        run() {
          __contentState.nc = {
            'too-short': __contentScope.Ys,
            'too-far': __contentScope.Xs,
            failed: __contentScope.Zs,
          };
        },
      },
      {
        order: 176,
        run() {
          __contentState.fc = 5;
        },
      },
      {
        order: 177,
        run() {
          __contentState.pc = 55e3;
        },
      },
      {
        order: 178,
        run() {
          __contentState.mc = null;
        },
      },
      {
        order: 179,
        run() {
          __contentState.gc = {
            'raw-image': `原图`,
            'viewport-screenshot': `CDP 截图`,
          };
        },
      },
      {
        order: 180,
        run() {
          __contentState._c = {
            measured: `实测碎片`,
            'hole-silhouette': `形状吻合`,
            'outline-profile': `轮廓剖面`,
            'background-delta': `双图差分`,
            'contour-alpha': `轮廓(带形状)`,
            'contour-edge': `轮廓(矩形)`,
            opencv: `OpenCV 模板`,
            ncc: `JS 模板`,
            silhouette: `形状吻合`,
          };
        },
      },
      {
        order: 181,
        run() {
          __contentState.wc = 1e4;
        },
      },
      {
        order: 182,
        run() {
          __contentState.Tc = 1e4;
        },
      },
      {
        order: 183,
        run() {
          __contentState.Ec = 3;
        },
      },
      {
        order: 184,
        run() {
          __contentState.Dc = 1200;
        },
      },
      {
        order: 185,
        run() {
          __contentState.Oc = 2e4;
        },
      },
      {
        order: 186,
        run() {
          __contentState.kc = 250;
        },
      },
      {
        order: 187,
        run() {
          __contentState.Ac = 300;
        },
      },
      {
        order: 188,
        run() {
          __contentState.jc = 1500;
        },
      },
      {
        order: 189,
        run() {
          __contentState.Mc = 1e3;
        },
      },
      {
        order: 190,
        run() {
          __contentState.Lc = 2;
        },
      },
      {
        order: 191,
        run() {
          __contentState.Rc = 2;
        },
      },
      {
        order: 192,
        run() {
          __contentState.zc = 180;
        },
      },
      {
        order: 193,
        run() {
          __contentState.Bc = 1e3;
        },
      },
      {
        order: 194,
        run() {
          __contentState.Vc = 8;
        },
      },
      {
        order: 195,
        run() {
          __contentState.Uc = [
            `iframe[src*="captcha" i]`,
            `iframe[src*="turnstile" i]`,
            `iframe[src*="challenge" i]`,
            `iframe[title*="captcha" i]`,
            `[class*="captcha" i]`,
            `[id*="captcha" i]`,
            `[class*="turnstile" i]`,
            `[class*="hcaptcha" i]`,
            `[class*="recaptcha" i]`,
          ];
        },
      },
      {
        order: 196,
        run() {
          __contentState.Wc = [
            `[class*="geetest" i]`,
            `[class*="yidun" i]`,
            `[class*="nc-container" i]`,
            `[class*="tcaptcha" i]`,
            `[class*="slider" i]`,
            `[class*="verify" i]`,
          ];
        },
      },
      {
        order: 197,
        run() {
          __contentState.Gc = [...__contentScope.Uc, ...__contentScope.Wc].join(`, `);
        },
      },
      {
        order: 198,
        run() {
          __contentState.Cl =
            /(?:答案|计算结果|计算答案|运算结果|运算答案|算术验证|数学验证|人机验证|验证码|answer|result|arithmetic|calculation|math|captcha)/i;
        },
      },
      {
        order: 199,
        run() {
          __contentState.wl = `[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)`;
        },
      },
      {
        order: 200,
        run() {
          __contentState.Tl = RegExp(
            `^\\s*(${__contentScope.wl})\\s*([+\\-*/])\\s*(${__contentScope.wl})\\s*(?:=\\s*(?:\\?)?)?\\s*$`,
          );
        },
      },
      {
        order: 201,
        run() {
          __contentState.El = RegExp(
            `(${__contentScope.wl}\\s*[+\\-*/]\\s*${__contentScope.wl}\\s*=\\s*(?:\\?)?)`,
          );
        },
      },
      {
        order: 202,
        run() {
          __contentState.Dl =
            /[;{}[\]`]|=>|\b(?:alert|eval|function|globalThis|window|document)\b/i;
        },
      },
      {
        order: 203,
        run() {
          __contentState.Ol = new Set([
            `button`,
            `checkbox`,
            `color`,
            `date`,
            `datetime-local`,
            `email`,
            `file`,
            `hidden`,
            `image`,
            `month`,
            `password`,
            `radio`,
            `range`,
            `reset`,
            `submit`,
            `time`,
            `url`,
            `week`,
          ]);
        },
      },
      {
        order: 204,
        run() {
          __contentState.kl = new WeakMap();
        },
      },
      {
        order: 205,
        run() {
          __contentState.Wl = [
            `#challenge-running`,
            `#cf-challenge-running`,
            `.cf-challenge-running`,
            `#challenge-stage`,
            `form#challenge-form`,
          ].join(`, `);
        },
      },
      {
        order: 206,
        run() {
          __contentState.Gl = [
            `script[src*="/cdn-cgi/challenge-platform/"]`,
            `link[href*="/cdn-cgi/challenge-platform/"]`,
            `iframe[src*="/cdn-cgi/challenge-platform/"]`,
            `#cf-wrapper`,
            `[data-ray]`,
          ].join(`, `);
        },
      },
      {
        order: 207,
        run() {
          __contentState.Kl = /(^|\.)agentrouter\.org$|^ps\.air-outer\.com$/i;
        },
      },
      {
        order: 208,
        run() {
          __contentState.ql = [`CF_APP_WAF`, `AC_Opt`, `sceneId`];
        },
      },
      {
        order: 209,
        run() {
          __contentState.Jl = [
            `.cf-turnstile`,
            `.turnstile-wrapper`,
            `.turnstile-container`,
            `[class*="turnstile" i]`,
            `[data-sitekey][class*="turnstile" i]`,
            `[id^="cf-chl-widget-"]:not(input):not(textarea)`,
            `#challenge-stage input[type="checkbox"]`,
            `#challenge-stage [role="checkbox"]`,
            `#challenge-stage button:not([disabled])`,
            `iframe[src*="challenges.cloudflare.com"]`,
            `iframe[title*="cloudflare security challenge" i]`,
          ].join(`, `);
        },
      },
      {
        order: 210,
        run() {
          __contentState.Yl = [
            {
              kind: `Turnstile`,
              selectors: __contentScope.Jl,
              tokenSelectors: `input[name="cf-turnstile-response"], textarea[name="cf-turnstile-response"]`,
              candidateElements: __contentScope.xu,
              strategy: {
                shadowTarget: !0,
                insetLeftPx: 24,
                minVisibleMs: 1e4,
                safetyWindowMs: 15e3,
                mountWaitMs: 15e3,
                layoutWaitMs: 1e4,
                maxAttempts: 3,
                retryDelayMs: 3e3,
                responseWaitMs: 2e4,
              },
            },
            {
              kind: `reCAPTCHA`,
              selectors: [
                `.g-recaptcha`,
                `[class*="recaptcha" i][data-sitekey]`,
                `iframe[src*="recaptcha"]`,
                `iframe[title*="recaptcha" i]`,
              ].join(`, `),
              tokenSelectors: `input[name="g-recaptcha-response"], textarea[name="g-recaptcha-response"]`,
              strategy: { shadowTarget: !0, mountWaitMs: 1e4, maxAttempts: 3 },
            },
            {
              kind: `hCaptcha`,
              selectors: [
                `.h-captcha`,
                `[class*="hcaptcha" i][data-sitekey]`,
                `iframe[src*="hcaptcha.com"]`,
                `iframe[title*="hcaptcha" i]`,
              ].join(`, `),
              tokenSelectors: `input[name="h-captcha-response"], textarea[name="h-captcha-response"]`,
              strategy: { shadowTarget: !0, mountWaitMs: 1e4, maxAttempts: 3 },
            },
          ];
        },
      },
      {
        order: 211,
        run() {
          __contentState.Xl = [
            ...__contentScope.Yl,
            {
              kind: `Slider`,
              selectors: __contentScope.ko,
              tokenSelectors: ``,
            },
          ];
        },
      },
      {
        order: 212,
        run() {
          __contentState.Zl = [
            __contentScope.ko,
            __contentScope.q.widgets,
            __contentScope.Jl,
            `.g-recaptcha`,
            `[class*="recaptcha" i][data-sitekey]`,
            `iframe[src*="recaptcha"]`,
            `iframe[title*="recaptcha" i]`,
            `.h-captcha`,
            `[class*="hcaptcha" i][data-sitekey]`,
            `iframe[src*="hcaptcha.com"]`,
            `iframe[title*="hcaptcha" i]`,
          ].join(`, `);
        },
      },
      {
        order: 213,
        run() {
          __contentState.$l = [
            `[class*="captcha" i]`,
            `[id*="captcha" i]`,
            `iframe[src*="captcha" i]`,
            `img[src*="captcha" i]`,
            `canvas[class*="captcha" i]`,
            `input[name*="captcha" i]:not([type="hidden"])`,
          ].join(`, `);
        },
      },
      {
        order: 214,
        run() {
          __contentState.eu = [
            `iframe[src*="captcha" i]`,
            `img[src*="captcha" i]`,
            `canvas[class*="captcha" i]`,
            `input[name*="captcha" i]:not([type="hidden"])`,
          ].join(`, `);
        },
      },
      {
        order: 215,
        run() {
          __contentState.tu = [`[class*="captcha" i]`, `[id*="captcha" i]`].join(`, `);
        },
      },
      {
        order: 216,
        run() {
          __contentState.nu = [
            `iframe`,
            `img`,
            `canvas`,
            `svg`,
            `input:not([type="hidden"])`,
            `textarea`,
            `select`,
            `button`,
            `[role="button"]`,
            `[role="checkbox"]`,
            `[role="slider"]`,
            `[role="textbox"]`,
            `[contenteditable="true"]`,
            `[onclick]`,
            `[tabindex]`,
          ].join(`, `);
        },
      },
      {
        order: 217,
        run() {
          __contentState.ru = [
            `just a moment`,
            `checking your browser`,
            `performing security verification`,
            `attention required`,
            `请稍候`,
            `请稍等`,
            `正在检查您的浏览器`,
            `浏览器检查`,
          ];
        },
      },
      {
        order: 218,
        run() {
          __contentState.iu = [
            ...__contentScope.ru,
            `security verification`,
            `verify you are human`,
            `captcha`,
            `安全验证`,
            `人机验证`,
            `验证您是真人`,
            `验证你是真人`,
          ];
        },
      },
      {
        order: 219,
        run() {
          __contentState.au = [
            /check (?:the )?(?:box|checkbox)/i,
            /click (?:the )?(?:box|checkbox|button)/i,
            /select all (?:images|squares)/i,
            /complete (?:the )?(?:captcha|challenge)/i,
            /verify (?:that )?you are human/i,
            /请(?:点击|勾选|选择)/,
            /请完成(?:验证码|人机验证|安全验证)/,
            /(?:确认|验证)(?:您|你)?是(?:真人|人类)/,
          ];
        },
      },
      {
        order: 220,
        run() {
          __contentState.ou = new Set([`complete`, `completed`, `passed`, `success`, `verified`]);
        },
      },
      {
        order: 221,
        run() {
          __contentState.su = 1500;
        },
      },
      {
        order: 222,
        run() {
          __contentState.cu = 1200;
        },
      },
      {
        order: 223,
        run() {
          __contentState.lu = 250;
        },
      },
      {
        order: 268,
        run() {
          __contentState.Ap = 3e4;
        },
      },
      {
        order: 269,
        run() {
          __contentState.jp = 1e3;
        },
      },
      {
        order: 270,
        run() {
          __contentState.Mp = 250;
        },
      },
      {
        order: 271,
        run() {
          __contentState.Np = 2500;
        },
      },
      {
        order: 272,
        run() {
          __contentState.Pp = `滑块自动求解未通过页面确认：`;
        },
      },
      {
        order: 273,
        run() {
          __contentState.Fp = 1e3;
        },
      },
      {
        order: 274,
        run() {
          __contentState.Ip = new Set([
            `当前验证码文档未找到可接收拖动的滑块把手（可能仍在加载或被遮挡）`,
            `已找到滑块把手，但尚未找到它所属的验证码面板`,
            `已找到验证码面板和把手，但没有匹配的滑动轨道`,
            `已找到滑块把手和轨道，但验证码背景图片尚未就绪`,
            `验证码组件仍在重绘，尚未取得同一挑战的完整滑块控件`,
            `验证码图片还没有加载完成，未执行拖动`,
            `验证码布局在等待时间内没有稳定，未使用动画中的坐标拖动`,
            `没有找到同时满足把手、轨道和背景几何关系的滑块控件`,
            `检测到滑动挑战，但页面没有暴露可安全拖动的 DOM 控件`,
          ]);
        },
      },
      {
        order: 275,
        run() {
          __contentState.Hp = new Set([500, 502, 503, 504, 520, 521, 522, 523, 524, 530]);
        },
      },
    ],
  };
}

/** 滑块验证内容逻辑：验证码定位、框架会话、图片取样、拖动和页面终态确认。 验证码子框架独立作用域。 */
export function createSliderFrameContent(__contentScope) {
  const __contentState = bindContentState(__contentScope, [
    'r',
    'k',
    'A',
    'oe',
    'se',
    'ce',
    'j',
    'M',
    'le',
    'ue',
    'N',
    'P',
    'de',
    'F',
    'fe',
    'pe',
    'I',
    'me',
    'L',
    'R',
    'he',
    'z',
    'B',
    'ge',
    '_e',
    've',
    'ye',
    'V',
    'H',
    'U',
    'W',
    'G',
    'be',
    'xe',
    'K',
    'Se',
    'Ce',
    'we',
    'Te',
    'Ee',
    'De',
    'Oe',
    'ke',
    'Ae',
    'q',
    'je',
    'Me',
    'Ne',
    'Pe',
    'Fe',
    'Ie',
    'Le',
    'Re',
    'ze',
    'Be',
    'Ve',
    'He',
    'Ue',
    'We',
    'J',
    'Y',
    'Ge',
    'Ke',
    'qe',
    'Je',
    'Ye',
    'Xe',
    'Ze',
    'Qe',
    '$e',
    'et',
    'X',
    'tt',
    'nt',
    'rt',
    'Z',
    'Q',
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
    '$',
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
  ]);
  function frame_r(e) {
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

  function frame_he(e) {
    return {
      mode: e,
      semantic: new WeakMap(),
      visibility: new WeakMap(),
      imageSource: new WeakMap(),
    };
  }

  function frame_z(e, t = `page`) {
    let n = __contentScope.R;
    (!n || n.mode !== t) && (__contentScope.R = (0, __contentScope.he)(t));
    try {
      return e();
    } finally {
      __contentScope.R = n;
    }
  }

  function frame_B() {
    return __contentScope.R?.mode === `tencent-page` || __contentScope.R?.mode === `tencent-frame`;
  }

  function frame_ge() {
    return (0, __contentScope.B)()
      ? `${__contentScope.k.widgets}, ${__contentScope.A}`
      : __contentScope.A;
  }

  function frame__e() {
    return (0, __contentScope.B)()
      ? `${__contentScope.k.success}, ${__contentScope.oe}`
      : __contentScope.oe;
  }

  function frame_ve() {
    return (0, __contentScope.B)()
      ? `${__contentScope.k.handle}, ${__contentScope.se}`
      : __contentScope.se;
  }

  function frame_ye(e) {
    return __contentScope.de.test(e) || ((0, __contentScope.B)() && /groove/i.test(e));
  }

  function frame_V(e, t = document) {
    try {
      return [...t.querySelectorAll(e)];
    } catch {
      return [];
    }
  }

  function frame_H(e) {
    let t = __contentScope.R;
    if (t?.visibility.has(e)) return t.visibility.get(e);
    let n = !1;
    if (!e.isConnected || e.getClientRects().length === 0) return !1;
    let r = e;
    for (; r;) {
      let n = window.getComputedStyle(r);
      if (
        n.display === `none` ||
        n.visibility === `hidden` ||
        n.visibility === `collapse` ||
        Number.parseFloat(n.opacity || `1`) <= 0.02 ||
        (r instanceof HTMLElement && r.hidden)
      )
        return (t && t.visibility.set(e, !1), !1);
      r = r.parentElement;
    }
    let i = e.getBoundingClientRect();
    return ((n = i.width >= 2 && i.height >= 2), t && t.visibility.set(e, n), n);
  }

  function frame_U(e) {
    return e.getBoundingClientRect();
  }

  function frame_W(e) {
    let t = (e) => Math.round(e * 10) / 10;
    return { x: t(e.x), y: t(e.y), width: t(e.width), height: t(e.height) };
  }

  function frame_G(e) {
    let t = __contentScope.R;
    if (t?.semantic.has(e)) return t.semantic.get(e);
    let n = [
        e.id,
        e.className,
        e.getAttribute(`role`),
        e.getAttribute(`aria-label`),
        e.getAttribute(`title`),
        e.getAttribute(`name`),
        e.getAttribute(`data-type`),
        e.getAttribute(`data-captcha-type`),
        e.getAttribute(`data-state`),
        e.getAttribute(`data-status`),
      ],
      r = (e.textContent ?? ``).replace(/\s+/g, ` `).trim().slice(0, 180),
      i = `${n.filter(Boolean).join(` `)} ${r}`.toLowerCase();
    return (t?.semantic.set(e, i), i);
  }

  function frame_be(e, t = 5) {
    let n = [],
      r = e;
    for (let e = 0; r && e < t; e += 1) (n.push((0, __contentScope.G)(r)), (r = r.parentElement));
    return n.join(` `);
  }

  function frame_xe(e) {
    let t = (0, __contentScope.be)(e, 7);
    return __contentScope.j.test(t) && (__contentScope.M.test(t) || __contentScope.F.test(t));
  }

  function frame_K(e, t) {
    return [...e]
      .map((e) => ({ element: e, score: t(e) }))
      .filter((e) => Number.isFinite(e.score))
      .sort((e, t) => t.score - e.score);
  }

  function frame_Se(e) {
    if (!(e instanceof HTMLElement) || !(0, __contentScope.H)(e)) return -1 / 0;
    let t = (0, __contentScope.U)(e);
    if (t.width < 12 || t.height < 12 || t.width > 180 || t.height > 110) return -1 / 0;
    if ((0, __contentScope.B)()) {
      let n = t.left + t.width / 2,
        r = t.top + t.height / 2;
      if (n >= 0 && r >= 0 && n < innerWidth && r < innerHeight) {
        let t = document.elementFromPoint(n, r);
        if (!t || !(t === e || e.contains(t))) return -1 / 0;
      }
    }
    let n = (0, __contentScope.G)(e),
      r = (0, __contentScope.be)(e, 7),
      i = 0;
    ((0, __contentScope.B)() && e.matches(__contentScope.k.handle) && (i += 12),
      e.getAttribute(`role`)?.toLowerCase() === `slider` && (i += 8),
      __contentScope.le.test(n) ? (i += 9) : __contentScope.M.test(n) && (i += 4),
      __contentScope.j.test(r) && (i += 7),
      __contentScope.F.test(r) && (i += 4),
      __contentScope.M.test(r) && (i += 2),
      __contentScope.ue.test(r) && !__contentScope.j.test(r) && (i -= 14),
      e instanceof HTMLInputElement && e.type === `range` && !__contentScope.j.test(r) && (i -= 12),
      t.width <= 100 && t.height <= 80 && (i += 2));
    let a = window.getComputedStyle(e).cursor;
    return ((a === `grab` || a === `grabbing` || a === `pointer` || a === `move`) && (i += 2), i);
  }

  function frame_Ce() {
    let e = (0, __contentScope.V)((0, __contentScope.ve)()),
      t = (0, __contentScope.V)(`button, [role], [draggable], [class], [id]`)
        .slice(0, __contentScope.I)
        .filter((e) => __contentScope.le.test((0, __contentScope.G)(e)));
    return [...new Set([...e, ...t])]
      .filter((e) => e instanceof HTMLElement)
      .map((e) => ({ element: e, score: (0, __contentScope.Se)(e) }))
      .filter((e) => Number.isFinite(e.score))
      .sort((e, t) => t.score - e.score)
      .map((e) => e.element);
  }

  function frame_we(e, t) {
    if (!(0, __contentScope.H)(e) || !e.contains(t)) return -1 / 0;
    let n = (0, __contentScope.U)(e),
      r = (0, __contentScope.U)(t);
    if (n.width < r.width * 2 || n.height < r.height * 1.6) return -1 / 0;
    let i = (0, __contentScope.G)(e),
      a = 0;
    return (
      __contentScope.j.test(i) && (a += 8),
      __contentScope.M.test(i) && (a += 5),
      __contentScope.F.test(i) && (a += 4),
      (0, __contentScope.V)(`img, canvas`, e).some(__contentScope.H) && (a += 5),
      n.width >= 160 && n.width <= 720 && (a += 3),
      n.height >= 110 && n.height <= 720 && (a += 3),
      n.width >= window.innerWidth * 0.96 && n.height >= window.innerHeight * 0.9 && (a -= 3),
      (a -= Math.log10(Math.max(10, n.width * n.height))),
      a
    );
  }

  function frame_Te(e) {
    let t = [],
      n = e.parentElement;
    for (let e = 0; n && n !== document.body && e < 12; e += 1) (t.push(n), (n = n.parentElement));
    let r = (0, __contentScope.K)(t, (t) => (0, __contentScope.we)(t, e))[0];
    return r && r.score >= 3 ? r.element : null;
  }

  function frame_Ee(e, t) {
    return Math.max(0, Math.min(e.bottom, t.bottom) - Math.max(e.top, t.top));
  }

  function frame_De(e, t, n) {
    if (!(0, __contentScope.H)(e) || !t.contains(e)) return -1 / 0;
    let r = (0, __contentScope.U)(e),
      i = (0, __contentScope.U)(n);
    if (
      r.width < i.width * 1.8 ||
      r.height > Math.max(100, i.height * 3) ||
      (0, __contentScope.Ee)(r, i) < Math.min(i.height, r.height) * 0.25
    )
      return -1 / 0;
    let a = (0, __contentScope.G)(e),
      o = 0;
    return (
      (0, __contentScope.ye)(a) ? (o += 9) : __contentScope.M.test(a) && (o += 4),
      e.contains(n) && (o += 5),
      r.width >= i.width * 3 && (o += 3),
      r.height <= i.height * 1.5 && (o += 3),
      (o += Math.min(4, r.width / Math.max(1, i.width * 3))),
      o
    );
  }

  function frame_Oe(e, t) {
    let n = (0, __contentScope.V)(`[role="slider"], input[type="range"], [class], [id]`, e).slice(
        0,
        __contentScope.I,
      ),
      r = [],
      i = t.parentElement;
    for (; i && i !== e.parentElement && (r.push(i), i !== e);) i = i.parentElement;
    let a = (0, __contentScope.K)(new Set([...n, ...r]), (n) => (0, __contentScope.De)(n, e, t))[0];
    return a && a.score >= 4 ? a.element : null;
  }

  function frame_ke(e) {
    let t = window.getComputedStyle(e).backgroundImage;
    if (!t || t === `none`) return null;
    let n = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/i.exec(t);
    return (n?.[1] ?? n?.[2] ?? n?.[3] ?? ``).trim() || null;
  }

  function frame_Ae(e) {
    if (e.startsWith(`data:image/`))
      return e.length > __contentScope.me ? void 0 : { value: e, kind: `data-url` };
    try {
      let t = new URL(e, document.baseURI);
      return t.protocol !== `http:` && t.protocol !== `https:`
        ? void 0
        : { value: t.href, kind: `url` };
    } catch {
      return;
    }
  }

  function frame_q(e) {
    let t = __contentScope.R;
    if (t?.imageSource.has(e)) return t.imageSource.get(e);
    let n;
    if (e instanceof HTMLCanvasElement) {
      if (e.width >= 2 && e.height >= 2)
        try {
          n = (0, __contentScope.Ae)(e.toDataURL(`image/png`));
        } catch {
          n = void 0;
        }
    } else if (e instanceof HTMLImageElement) {
      let t = e.currentSrc || e.src;
      t && (n = (0, __contentScope.Ae)(t));
    } else {
      let t = (0, __contentScope.ke)(e);
      t && (n = (0, __contentScope.Ae)(t));
    }
    return (t?.imageSource.set(e, n), n);
  }

  function frame_je(e, t, n, r) {
    if (!(0, __contentScope.H)(e) || !t.contains(e) || e === r) return -1 / 0;
    let i = (0, __contentScope.U)(e),
      a = (0, __contentScope.U)(n);
    if (
      i.width < Math.max(110, (0, __contentScope.U)(r).width * 1.8) ||
      i.height < 45 ||
      i.width / Math.max(1, i.height) < 1.1 ||
      i.top > a.bottom + 20
    )
      return -1 / 0;
    let o = (0, __contentScope.G)(e),
      s = 0;
    return (
      __contentScope.R?.mode === `tencent-frame` &&
        (e.matches(__contentScope.k.background)
          ? (s += 12)
          : e.matches(__contentScope.k.backgroundImage) && (s += 9)),
      (e instanceof HTMLImageElement || e instanceof HTMLCanvasElement) && (s += 5),
      (0, __contentScope.q)(e) && (s += 5),
      __contentScope.N.test(o) && (s += 5),
      __contentScope.P.test(o) && (s -= 8),
      /logo|icon|avatar|btn|button|thumb/i.test(o) && (s -= 9),
      i.bottom <= a.top + 25 && (s += 4),
      (s += Math.min(5, (i.width * i.height) / 2e4)),
      s
    );
  }

  function frame_Me(e, t, n) {
    let r = (0, __contentScope.K)(
      (0, __contentScope.V)(__contentScope.ce, e).slice(0, __contentScope.I),
      (r) => (0, __contentScope.je)(r, e, t, n),
    )[0];
    return r && r.score >= 6 ? r.element : null;
  }

  function frame_Ne(e, t) {
    let n = (0, __contentScope.q)(t)?.value,
      r = (0, __contentScope.U)(t);
    return (0, __contentScope.V)(`img, canvas, [class], [id]`, e)
      .slice(0, __contentScope.I)
      .filter((e) => e !== t)
      .map((e) => {
        let t = (0, __contentScope.q)(e);
        if (!t || t.value === n) return null;
        let i = (0, __contentScope.G)(e);
        if (
          !__contentScope.N.test(i) ||
          __contentScope.P.test(i) ||
          /logo|icon|btn|button/i.test(i)
        )
          return null;
        let a = (0, __contentScope.U)(e),
          o =
            a.width ||
            (e instanceof HTMLCanvasElement ? e.width : 0) ||
            (e instanceof HTMLImageElement ? e.naturalWidth : 0),
          s =
            a.height ||
            (e instanceof HTMLCanvasElement ? e.height : 0) ||
            (e instanceof HTMLImageElement ? e.naturalHeight : 0);
        if (o < 80 || s < 40) return null;
        let c = o / s,
          l = r.width / Math.max(1, r.height),
          u = Math.abs(Math.log(c / l));
        if (u > 0.1) return null;
        let d = 8 - u * 20;
        return (
          (e instanceof HTMLCanvasElement || e instanceof HTMLImageElement) && (d += 3),
          /full|original|complete|完整|原图/i.test(i) && (d += 2),
          { element: e, score: d }
        );
      })
      .filter((e) => e != null)
      .sort((e, t) => t.score - e.score)[0]?.element;
  }

  function frame_Pe(e, t) {
    return e.left < t.right && e.right > t.left && e.top < t.bottom && e.bottom > t.top;
  }

  function frame_Fe(e, t, n, r) {
    if (!(0, __contentScope.H)(e) || !t.contains(e) || e === n || e === r) return -1 / 0;
    let i = (0, __contentScope.U)(e),
      a = (0, __contentScope.U)(n);
    if (
      !(0, __contentScope.Pe)(i, a) ||
      i.width < 8 ||
      i.height < 8 ||
      i.width > a.width * 1.08 ||
      i.height > a.height * 1.15
    )
      return -1 / 0;
    let o = i.width / Math.max(1, i.height);
    if (o > 2.5 || o < 0.4) return -1 / 0;
    let s = (0, __contentScope.U)(r),
      c = Math.min(i.width, i.height),
      l = Math.max(i.width, i.height),
      u = Math.min(s.width, s.height);
    if (u >= 8 && c < u * 0.55 && l > u * 1.25) return -1 / 0;
    let d = (0, __contentScope.G)(e),
      f = 0;
    (__contentScope.P.test(d) && (f += 11),
      (0, __contentScope.q)(e) && (f += 5),
      (e instanceof HTMLImageElement || e instanceof HTMLCanvasElement) && (f += 2),
      __contentScope.N.test(d) && !__contentScope.P.test(d) && (f -= 6),
      /logo|icon|avatar|btn|button|track|rail/i.test(d) && (f -= 10));
    let p = i.width / Math.max(1, a.width);
    return (p >= 0.08 && p <= 0.55 ? (f += 5) : p > 0.9 && (f -= 3), f);
  }

  function frame_Ie(e, t, n) {
    if ((0, __contentScope.B)() && n.matches(__contentScope.k.handle)) {
      let r = (0, __contentScope.V)(__contentScope.k.piece, e).filter(__contentScope.H);
      return r.length === 1 && (0, __contentScope.Fe)(r[0], e, t, n) >= 5 ? r[0] : void 0;
    }
    let r = (0, __contentScope.K)(
      (0, __contentScope.V)(__contentScope.ce, e).slice(0, __contentScope.I),
      (r) => (0, __contentScope.Fe)(r, e, t, n),
    )[0];
    return r && r.score >= 5 ? r.element : void 0;
  }

  function frame_Le() {
    if (__contentScope.R?.geometryPanels) return __contentScope.R.geometryPanels;
    let e = new Set(),
      t = new Set(),
      n = (0, __contentScope.V)(
        (0, __contentScope.B)()
          ? `${__contentScope.k.widgets}, ${__contentScope.fe}`
          : __contentScope.fe,
      )
        .filter(__contentScope.H)
        .slice(0, __contentScope.I);
    for (let r of n) {
      let n = r;
      for (
        let r = 0;
        n && r < 8 && n !== document.body && n !== document.documentElement;
        r += 1, n = n.parentElement
      ) {
        if (t.has(n)) continue;
        t.add(n);
        let r = (0, __contentScope.U)(n);
        if (
          r.width < 160 ||
          r.width > 760 ||
          r.height < 110 ||
          r.height > 720 ||
          !(0, __contentScope.H)(n) ||
          n.closest(`pre, code, textarea, [contenteditable="true"]`)
        )
          continue;
        let i = (0, __contentScope.Z)(n);
        __contentScope.j.test(i) && __contentScope.F.test(i) && e.add(n);
      }
    }
    let r = [...e]
      .sort((e, t) => {
        let n = (0, __contentScope.U)(e),
          r = (0, __contentScope.U)(t);
        return n.width * n.height - r.width * r.height;
      })
      .slice(0, 12);
    return (__contentScope.R && (__contentScope.R.geometryPanels = r), r);
  }

  function frame_Re(e, t, n = 3) {
    return (
      t.left >= e.left - n &&
      t.right <= e.right + n &&
      t.top >= e.top - n &&
      t.bottom <= e.bottom + n
    );
  }

  function frame_ze(e, t) {
    return (
      Math.max(0, Math.min(window.innerWidth, e.right) - Math.max(0, e.left)) *
        Math.max(0, Math.min(window.innerHeight, e.bottom) - Math.max(0, e.top)) >=
      e.width * e.height * t
    );
  }

  function frame_Be(e, t) {
    if (!(0, __contentScope.H)(e)) return -1 / 0;
    let n = (0, __contentScope.U)(e);
    return n.width < 110 ||
      n.height < 50 ||
      n.width / n.height < 1.1 ||
      n.width / n.height > 4.5 ||
      !(0, __contentScope.Re)((0, __contentScope.U)(t), n) ||
      !(0, __contentScope.ze)(n, 0.96) ||
      (!(e instanceof HTMLImageElement) &&
        !(e instanceof HTMLCanvasElement) &&
        !(0, __contentScope.ke)(e))
      ? -1 / 0
      : 8 +
          Math.min(5, (n.width * n.height) / 2e4) +
          (__contentScope.N.test((0, __contentScope.G)(e)) ? 3 : 0);
  }

  function frame_Ve(e, t, n) {
    if (
      !(e instanceof HTMLElement) ||
      e === t ||
      e.contains(t) ||
      t.contains(e) ||
      !(0, __contentScope.H)(e)
    )
      return -1 / 0;
    let r = (0, __contentScope.U)(e),
      i = (0, __contentScope.U)(t),
      a = r.top - i.bottom;
    return r.height < 12 ||
      r.height > 90 ||
      r.width < r.height * 3 ||
      r.width < i.width * 0.75 ||
      r.width > i.width * 1.25 ||
      a < -4 ||
      a > Math.max(64, i.height * 0.35) ||
      Math.abs(r.left - i.left) > Math.max(24, i.width * 0.12) ||
      !(0, __contentScope.Re)((0, __contentScope.U)(n), r) ||
      !(0, __contentScope.ze)(r, 0.98)
      ? -1 / 0
      : 8 +
          ((0, __contentScope.ye)((0, __contentScope.G)(e)) ? 3 : 0) +
          4 * (1 - Math.min(1, Math.abs(r.width - i.width) / i.width));
  }

  function frame_He(e, t) {
    if (
      !(e instanceof HTMLElement) ||
      e === t ||
      !t.contains(e) ||
      !(0, __contentScope.H)(e) ||
      e.matches(`input, select, textarea, :disabled`) ||
      e.closest(`[inert], [aria-disabled="true"], [aria-hidden="true"], [disabled]`)
    )
      return -1 / 0;
    let n = (0, __contentScope.U)(e),
      r = (0, __contentScope.U)(t);
    if (
      n.width < 20 ||
      n.width > 110 ||
      n.height < 18 ||
      n.height > 96 ||
      n.width / n.height < 0.45 ||
      n.width / n.height > 2.6 ||
      r.width < n.width * 2.7 ||
      n.height < r.height * 0.55 ||
      n.height > r.height * 1.5 ||
      n.left < r.left - 3 ||
      n.right > r.right + 3 ||
      (0, __contentScope.Ee)(n, r) < Math.min(n.height, r.height) * 0.65 ||
      !(0, __contentScope.ze)(n, 0.98)
    )
      return -1 / 0;
    let i = (0, __contentScope.G)(e);
    if (__contentScope.pe.test(i)) return -1 / 0;
    let a = window.getComputedStyle(e);
    if (a.pointerEvents === `none`) return -1 / 0;
    let o =
        e.matches((0, __contentScope.ve)()) ||
        __contentScope.le.test(i) ||
        e.matches(`button, [role="button"]`) ||
        /^(?:grab|grabbing|pointer|move|ew-resize)$/.test(a.cursor),
      s =
        (a.boxShadow !== `none` && a.boxShadow !== ``) ||
        Number.parseFloat(a.borderLeftWidth) > 0 ||
        (!!a.backgroundColor &&
          !/^(?:transparent|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\))$/.test(a.backgroundColor));
    if (!o && !s) return -1 / 0;
    let c = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
    return !c || !(c === e || e.contains(c))
      ? -1 / 0
      : 8 +
          (o ? 6 : 0) +
          4 * (1 - Math.min(1, Math.abs(n.height - r.height) / r.height)) +
          +(n.left - r.left < r.width * 0.35);
  }

  function frame_Ue() {
    for (let e of (0, __contentScope.Le)()) {
      let t = (0, __contentScope.V)(`*`, e).slice(0, __contentScope.I),
        n = (0, __contentScope.K)(t, (t) => (0, __contentScope.Be)(t, e)).slice(0, 4),
        r;
      for (let { element: i, score: a } of n) {
        let n = (0, __contentScope.K)(t, (t) => (0, __contentScope.Ve)(t, i, e)).slice(0, 6);
        for (let { element: o, score: s } of n) {
          let n = (0, __contentScope.K)(t, (e) => (0, __contentScope.He)(e, o))[0];
          if (!n || !(n.element instanceof HTMLElement)) continue;
          let c = a + s + n.score;
          (!r || c > r.score) &&
            (r = {
              score: c,
              match: {
                panel: e,
                background: i,
                track: o,
                handle: n.element,
                detectionMethod: `panel-geometry`,
              },
            });
        }
      }
      if (r) return r.match;
    }
    return null;
  }

  function frame_We() {
    for (let e of (0, __contentScope.Ce)()) {
      let t = (0, __contentScope.Se)(e);
      if (t < 9 || (!(0, __contentScope.xe)(e) && t < 14)) continue;
      let n = (0, __contentScope.Te)(e);
      if (!n) continue;
      let r = (0, __contentScope.Oe)(n, e);
      if (!r) continue;
      let i = (0, __contentScope.Me)(n, r, e);
      if (i)
        return {
          panel: n,
          background: i,
          piece: (0, __contentScope.Ie)(n, i, e),
          track: r,
          handle: e,
        };
    }
    return (0, __contentScope.Ue)();
  }

  function frame_J(e = `page`) {
    return (0, __contentScope.z)(__contentScope.We, e);
  }

  function frame_Y(e) {
    let t = e ?? document,
      n = (0, __contentScope._e)();
    return (e?.matches(n) && (0, __contentScope.H)(e)) ||
      (0, __contentScope.V)(n, t).some(__contentScope.H)
      ? !0
      : !e || !(0, __contentScope.H)(e)
        ? !1
        : [`data-state`, `data-status`, `aria-checked`].some((t) =>
            /^(?:verified|success|passed|complete|completed|true)$/i.test(
              e.getAttribute(t)?.trim() ?? ``,
            ),
          );
  }

  function frame_Ge(e) {
    let t = 2166136261,
      n = Math.max(1, Math.floor(e.length / 256));
    for (let r = 0; r < e.length; r += n) ((t ^= e.charCodeAt(r)), (t = Math.imul(t, 16777619)));
    return ((t ^= e.length), (t >>> 0).toString(36));
  }

  function frame_Ke(e) {
    if (!e) return ``;
    let t = [
      e.getAttribute(`style`) ?? ``,
      e.getAttribute(`data-id`) ?? ``,
      e.getAttribute(`data-key`) ?? ``,
      e.getAttribute(`data-index`) ?? ``,
      e.getAttribute(`srcset`) ?? ``,
    ];
    (e instanceof HTMLCanvasElement && t.push(`${e.width}x${e.height}`),
      e instanceof HTMLImageElement && t.push(`${e.naturalWidth}x${e.naturalHeight}`));
    try {
      let n = window.getComputedStyle(e);
      t.push(n.backgroundPosition, n.backgroundSize);
    } catch {}
    return t.filter(Boolean).join(`~`);
  }

  function frame_qe(e, t, n, r) {
    let i = (0, __contentScope.U)(e.background),
      a = e.piece ? (0, __contentScope.U)(e.piece) : void 0;
    return (0, __contentScope.Ge)(
      [
        t?.value ?? (0, __contentScope.G)(e.background),
        r?.value ?? ``,
        n?.value ?? (e.piece ? (0, __contentScope.G)(e.piece) : ``),
        `${i.width.toFixed(1)}x${i.height.toFixed(1)}`,
        a ? `${a.width.toFixed(1)}x${a.height.toFixed(1)}` : `no-piece`,
        t ? `` : (0, __contentScope.Ke)(e.background),
        n ? `` : (0, __contentScope.Ke)(e.piece),
      ].join(`|`),
    );
  }

  function frame_Je(e) {
    let t = (0, __contentScope.U)(e);
    return (
      t.left < 4 ||
      t.top < 4 ||
      t.right > window.innerWidth - 4 ||
      t.bottom > window.innerHeight - 4
    );
  }

  function frame_Ze(e) {
    return [e.panel, e.background, e.piece, e.track, e.handle]
      .filter((e) => e != null)
      .flatMap((e) => {
        let t = (0, __contentScope.U)(e);
        return [t.x, t.y, t.width, t.height];
      });
  }

  function frame_Qe(e, t, n = 1.5) {
    return e.length === t.length && e.every((e, r) => Math.abs(e - t[r]) <= n);
  }

  function frame_$e(e) {
    return [e.background, e.piece].every((e) =>
      e instanceof HTMLImageElement
        ? e.complete && e.naturalWidth > 0 && e.naturalHeight > 0
        : e instanceof HTMLCanvasElement
          ? e.width > 0 && e.height > 0
          : !0,
    );
  }

  async function frame_et(e = 1500, t = () => !0, n = `page`) {
    let r = Date.now() + e;
    if (!t()) return null;
    let i = (0, __contentScope.J)(n);
    for (; !i && Date.now() < r && t();)
      (await (0, __contentScope.Xe)(Math.min(120, Math.max(0, r - Date.now()))),
        (i = (0, __contentScope.J)(n)));
    return t() ? i : null;
  }

  function frame_tt() {
    return __contentScope.X;
  }

  function frame_nt(e) {
    return (0, __contentScope.z)(() => {
      let e = (0, __contentScope.Ce)().filter(
        (e) => (0, __contentScope.Se)(e) >= 9 && (0, __contentScope.xe)(e),
      );
      if (!e.length) return `当前验证码文档未找到可接收拖动的滑块把手（可能仍在加载或被遮挡）`;
      let t = e
        .map((e) => ({ handle: e, panel: (0, __contentScope.Te)(e) }))
        .filter((e) => e.panel != null);
      if (!t.length) return `已找到滑块把手，但尚未找到它所属的验证码面板`;
      let n = t
        .map(({ handle: e, panel: t }) => ({
          handle: e,
          panel: t,
          track: (0, __contentScope.Oe)(t, e),
        }))
        .filter((e) => e.track != null);
      return n.length
        ? n.some(({ handle: e, panel: t, track: n }) => (0, __contentScope.Me)(t, n, e))
          ? `验证码组件仍在重绘，尚未取得同一挑战的完整滑块控件`
          : `已找到滑块把手和轨道，但验证码背景图片尚未就绪`
        : `已找到验证码面板和把手，但没有匹配的滑动轨道`;
    }, e);
  }

  async function frame_rt(e = {}) {
    __contentScope.X = void 0;
    let t = e.mode ?? `page`,
      n = () => e.isActive?.() !== !1 && Date.now() < (e.deadline ?? 1 / 0),
      r = () => Math.max(0, Math.min(e.mountTimeoutMs ?? 1500, (e.deadline ?? 1 / 0) - Date.now())),
      i = await (0, __contentScope.et)(r(), n, t);
    if (
      !i ||
      ((0, __contentScope.Je)(i.panel) &&
        (i.panel.scrollIntoView({
          block: `center`,
          inline: `center`,
          behavior: `auto`,
        }),
        await (0, __contentScope.Ye)(t),
        (i = await (0, __contentScope.et)(r(), n, t)),
        !i))
    )
      return (
        (__contentScope.X = n() ? (0, __contentScope.nt)(t) : `本轮滑块任务已停止或超过时限`),
        null
      );
    let a = Math.min(
        e.deadline ?? 1 / 0,
        Date.now() + Math.max(2500, Math.min(e.mountTimeoutMs ?? 0, 6e3)),
      ),
      o = (0, __contentScope.Ze)(i),
      s = 0;
    for (; Date.now() < a && n();) {
      await (0, __contentScope.Xe)(50);
      let e = (0, __contentScope.J)(t);
      if (!e) {
        s = 0;
        continue;
      }
      let n = (0, __contentScope.Ze)(e);
      if (
        ((0, __contentScope.$e)(e) && (0, __contentScope.Qe)(o, n) ? (s += 1) : (s = 0),
        (o = n),
        (i = e),
        s >= 2)
      )
        break;
    }
    if (s < 2 || !n())
      return (
        (__contentScope.X = n()
          ? (0, __contentScope.$e)(i)
            ? `验证码布局在等待时间内没有稳定，未使用动画中的坐标拖动`
            : `验证码图片还没有加载完成，未执行拖动`
          : `本轮滑块任务已停止或超过时限`),
        null
      );
    let c = (0, __contentScope.q)(i.background),
      l =
        i.detectionMethod === `panel-geometry`
          ? void 0
          : (0, __contentScope.Ne)(i.panel, i.background),
      u = l ? (0, __contentScope.q)(l) : void 0,
      d = i.piece ? (0, __contentScope.q)(i.piece) : void 0,
      f = t === `tencent-frame` && i.handle.matches(__contentScope.k.handle),
      p = i.handle.getAttribute(__contentScope.L),
      m = `p-slider-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    i.handle.setAttribute(__contentScope.L, m);
    let h = !1;
    return {
      info: {
        panelRect: (0, __contentScope.W)((0, __contentScope.U)(i.panel)),
        backgroundRect: (0, __contentScope.W)((0, __contentScope.U)(i.background)),
        pieceRect: i.piece ? (0, __contentScope.W)((0, __contentScope.U)(i.piece)) : void 0,
        trackRect: (0, __contentScope.W)((0, __contentScope.U)(i.track)),
        handleRect: (0, __contentScope.W)((0, __contentScope.U)(i.handle)),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        backgroundSource: f ? void 0 : c,
        referenceBackgroundSource: f ? void 0 : u,
        pieceSource: f ? void 0 : d,
        handleToken: m,
        challengeKey: (0, __contentScope.qe)(i, c, d, u),
      },
      match: i,
      releaseHandleMarker: () => {
        h ||
          ((h = !0),
          i.handle.getAttribute(__contentScope.L) === m &&
            (p == null
              ? i.handle.removeAttribute(__contentScope.L)
              : i.handle.setAttribute(__contentScope.L, p)));
      },
    };
  }

  function frame_Z(e) {
    let t = (e ? [e] : (0, __contentScope.V)((0, __contentScope.ge)())).filter(__contentScope.H),
      n = t.filter((e) => !t.some((t) => t !== e && t.contains(e))),
      r = [],
      i = 0,
      a = 0;
    for (let e of n) {
      let t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT),
        n;
      for (; (n = t.nextNode()) && a < __contentScope.I && i < 1500;) {
        a += 1;
        let e = n.textContent ?? ``;
        e.trim() &&
          n.parentElement &&
          (0, __contentScope.H)(n.parentElement) &&
          (r.push(e), (i += e.length));
      }
      if (a >= __contentScope.I || i >= 1500) break;
    }
    return r.join(` `).replace(/\s+/g, ` `).trim().slice(0, 1500);
  }

  function frame_Q(e, t = `page`) {
    return (0, __contentScope.z)(() => {
      let n = (0, __contentScope.We)();
      if (!n) {
        let n = [
            ...(0, __contentScope.V)((0, __contentScope.ge)()).filter(__contentScope.H),
            ...(0, __contentScope.Le)(),
          ],
          r = e && (0, __contentScope.H)(e) ? e : void 0;
        if (t === `page`) {
          let e = r ?? n[0];
          return {
            visible: n.length > 0,
            success: (0, __contentScope.Y)(e) || (0, __contentScope.Y)(),
            panel: e,
            statusText: (0, __contentScope.Z)(e),
          };
        }
        let i = [...new Set(n)].filter((e) => !n.some((t) => t !== e && t.contains(e))),
          a =
            i.find(
              (e) => !(0, __contentScope.Y)(e) && (!r || (!r.contains(e) && !e.contains(r))),
            ) ??
            r ??
            i[0];
        return {
          visible: n.length > 0 || a != null,
          success: a != null && (0, __contentScope.Y)(a),
          panel: a,
          statusText: (0, __contentScope.Z)(a),
        };
      }
      let r = (0, __contentScope.q)(n.background),
        i =
          n.detectionMethod === `panel-geometry`
            ? void 0
            : (0, __contentScope.Ne)(n.panel, n.background),
        a = i ? (0, __contentScope.q)(i) : void 0,
        o = n.piece ? (0, __contentScope.q)(n.piece) : void 0,
        s = (0, __contentScope.U)(n.handle),
        c = (0, __contentScope.U)(n.track);
      return {
        visible: !0,
        success: (0, __contentScope.Y)(n.panel) || (t === `page` && (0, __contentScope.Y)()),
        panel: n.panel,
        challengeKey: (0, __contentScope.qe)(n, r, o, a),
        handleX: s.x,
        pieceX: n.piece ? (0, __contentScope.U)(n.piece).x : void 0,
        handleOffsetX: s.x - c.x,
        handleRange: c.width - s.width,
        statusText: (0, __contentScope.Z)(n.panel),
      };
    }, t);
  }

  function frame_pt(e, t) {
    let n = e.handleOffsetX,
      r = t.handleOffsetX;
    if (n == null || r == null) return null;
    let i = t.handleRange ?? e.handleRange;
    return !i || i < 20 ? null : Math.abs(r - n) < i * 0.05 ? `failed` : null;
  }

  function frame_mt(e, t) {
    return (t.match(new RegExp(e.source, `gi`)) ?? []).map((e) => e.toLowerCase());
  }

  function frame_ht(e, t, n) {
    let r = new Set((0, __contentScope.mt)(e, t));
    return (0, __contentScope.mt)(e, n).filter((e) => !r.has(e));
  }

  function frame_gt(e, t, n) {
    if (t.success || (0, __contentScope.ht)(__contentScope.it, n, t.statusText).length > 0)
      return `success`;
    if (e.challengeKey && t.challengeKey && e.challengeKey !== t.challengeKey) return `refreshed`;
    for (let e of [`too-short`, `too-far`, `failed`])
      if ((0, __contentScope.ht)(__contentScope.ft[e], n, t.statusText).length > 0) return e;
    return null;
  }

  async function frame__t(e, t = 5500, n = `page`) {
    let r = Date.now() + t,
      i = (0, __contentScope.Q)(e.panel, n),
      a = e,
      o,
      s,
      c;
    for (;;) {
      let t = Date.now(),
        l = (0, __contentScope.gt)(e, i, a.statusText);
      if (l === `success`) return { kind: l, state: i, evidence: `status` };
      if (l === `refreshed`) return { kind: l, state: i, evidence: `refresh` };
      if (
        ((l === `failed` || l === `too-short` || l === `too-far`) &&
          (o = {
            kind: l,
            since: t,
            phrases: (0, __contentScope.ht)(__contentScope.ft[l], a.statusText, i.statusText),
          }),
        !i.visible && e.visible)
      ) {
        if (((s ??= t), t - s >= __contentScope.dt))
          return o
            ? { kind: o.kind, state: i, evidence: `status` }
            : { kind: `success`, state: i, evidence: `disappearance` };
      } else {
        if (((s = void 0), o)) {
          let e = (0, __contentScope.mt)(__contentScope.ft[o.kind], i.statusText);
          o.phrases.some((t) => e.includes(t)) || (o = void 0);
        }
        if (o && t - o.since >= __contentScope.ut)
          return { kind: o.kind, state: i, evidence: `status` };
      }
      if (
        (i.visible && (0, __contentScope.pt)(e, i) === `failed` ? (c ??= t) : (c = void 0), t >= r)
      )
        return c != null && t - c >= __contentScope.ut
          ? { kind: `failed`, state: i, evidence: `geometry` }
          : { kind: `unchanged`, state: i };
      ((a = i),
        await (0, __contentScope.g)(Math.min(220, Math.max(0, r - Date.now()))),
        (i = (0, __contentScope.Q)(i.panel ?? e.panel, n)));
    }
  }

  function frame_vt(e, t) {
    if (!(e instanceof HTMLElement) || !(0, __contentScope.H)(e)) return -1 / 0;
    let n = [
      e.id,
      e.className,
      e.getAttribute(`aria-label`),
      e.getAttribute(`title`),
      e.textContent,
    ]
      .filter(Boolean)
      .join(` `);
    if (!__contentScope.ct.test(n) || __contentScope.lt.test(n)) return -1 / 0;
    let r = e.getBoundingClientRect(),
      i = 0;
    return (
      t !== `page` && e.matches(__contentScope.k.refresh) && (i += 10),
      e.matches(`button, [role="button"], a`) && (i += 4),
      /refresh|reload|刷新|换一张/i.test(n) && (i += 6),
      r.width <= 100 && r.height <= 80 && (i += 2),
      i
    );
  }

  async function frame_yt(e = `page`) {
    let t = (0, __contentScope.J)(e);
    if (!t && e === `page`) return !1;
    let n = [
      ...(t?.panel.querySelectorAll(`button, [role="button"], a, [class], [id]`) ?? []),
      ...(e === `page` ? [] : document.querySelectorAll(__contentScope.k.refresh)),
    ].sort((t, n) => (0, __contentScope.vt)(n, e) - (0, __contentScope.vt)(t, e))[0];
    if (!(n instanceof HTMLElement) || (0, __contentScope.vt)(n, e) < 4) return !1;
    try {
      return (await (0, __contentScope.E)(n), !0);
    } catch {
      return !1;
    }
  }

  async function frame_bt(e, t = 3500, n = `page`) {
    let r = Date.now() + t;
    for (; Date.now() < r;) {
      let t = (0, __contentScope.Q)(void 0, n);
      if (!t.visible || (e && t.challengeKey && t.challengeKey !== e)) return !0;
      await (0, __contentScope.g)(180);
    }
    return !1;
  }

  function frame_xt(e, t, n) {
    let r = Math.min(3, Math.max(1, n * 0.008)),
      i = Math.min(10, Math.max(3, n * 0.04)),
      a = e;
    return (
      t === `too-short` ? (a += r) : t === `too-far` ? (a -= r) : (a = 0),
      Math.max(-i, Math.min(i, Math.round(a * 10) / 10))
    );
  }

  function frame_wt(e) {
    switch (e.kind) {
      case `too-short`:
        return `页面反馈拖动偏短`;
      case `too-far`:
        return `页面反馈拖动偏长`;
      case `failed`:
        return e.evidence === `geometry`
          ? `滑块把手持续停在起点，等待结束后仍未收到通过确认`
          : `页面显示本轮验证失败提示`;
      case `refreshed`:
        return `页面已刷新为新挑战`;
      case `unchanged`:
        return `页面没有给出通过或刷新反馈`;
      case `success`:
        return e.evidence === `disappearance` ? `滑块面板已稳定关闭` : `页面确认验证通过`;
    }
  }

  function frame_Dt(e) {
    if (!e) return `unknown`;
    let [, ...t] = e.split(`:`);
    return (t.join(`:`) || e)
      .split(`+`)
      .map((e) => __contentScope.Et[e] ?? e)
      .join(`+`);
  }

  function frame_Ot(e) {
    let t = e.diagnostics,
      n = t
        ? `，取图=${__contentScope.Tt[t.source] ?? t.source}，图像距离=${t.imageDistance}px` +
          (t.measuredRatio == null
            ? `，行程比=${t.conversionRatio.toFixed(3)}`
            : `，实测行程比=${t.measuredRatio.toFixed(3)}`) +
          (t.probeDistance == null ? `` : `，探测位移=${t.probeDistance}px`) +
          `，修正=${t.correctionPx}px` +
          (t.cropOffsetX ? `，亚像素补偿=${t.cropOffsetX}px` : ``) +
          (t.rivalCount ? `，另有 ${t.rivalCount} 个疑似缺口` : ``)
        : ``;
    return `方法=${(0, __contentScope.Dt)(e.method)}，缺口=${e.gapX ?? `N/A`}px，拖动=${e.distance ?? `N/A`}px，置信度=${e.confidence?.toFixed(3) ?? `N/A`}${n}`;
  }

  async function frame_kt(e, t) {
    let r = (0, __contentScope.d)();
    if (!r)
      return (
        e.push(`滑块求解：没有活跃签到任务，停止自动拖动`),
        { solved: !1, error: `没有活跃签到任务` }
      );
    let i = t.frameSessionId,
      a = i ? `tencent-frame` : (t.domMode ?? `page`),
      o = Math.min(t.deadline ?? 1 / 0, Date.now() + __contentScope.Ct),
      s = () => (0, __contentScope.d)() === r && (!i || (0, __contentScope.f)() === i),
      c = 0,
      l,
      u = `滑块没有返回可确认的结果`,
      p = !1,
      m = [],
      h,
      _ = 0;
    for (let t = 1; t <= __contentScope.St; t += 1) {
      if (!s() || Date.now() >= o) {
        u = s() ? `滑块求解超过总时限` : `本轮滑块任务已停止`;
        break;
      }
      let d = await (0, __contentScope.rt)(
        i ? { mode: a, mountTimeoutMs: 6e3, deadline: o, isActive: s } : { mode: a },
      );
      if (!d) {
        let t = (0, __contentScope.Q)(void 0, a);
        if (s() && t.success)
          return (e.push(`页面已显示滑块通过状态`), { solved: !0, method: `dom-feedback` });
        ((u =
          (0, __contentScope.tt)() ??
          (t.visible
            ? `没有找到同时满足把手、轨道和背景几何关系的滑块控件`
            : `检测到滑动挑战，但页面没有暴露可安全拖动的 DOM 控件`)),
          e.push(u));
        break;
      }
      let { info: f, match: v, releaseHandleMarker: y } = d;
      if (!s() || (i && Date.now() >= o)) {
        (y(), (u = `本轮滑块任务已停止或超过时限`));
        break;
      }
      v.detectionMethod === `panel-geometry` &&
        !p &&
        (e.push(
          `标准滑块控件匹配未命中，已通过当前验证码弹窗内的图片、轨道和把手布局定位，继续截图识别`,
        ),
        (p = !0));
      let b = (0, __contentScope.Q)(v.panel, a);
      if (i && b.success)
        return (
          y(),
          e.push(`当前验证码面板已显示通过状态，未重复拖动`),
          { solved: !0, method: `dom-feedback` }
        );
      (c !== 0 && l && b.challengeKey && b.challengeKey !== l && ((c = 0), (l = void 0)),
        m.length && h && b.challengeKey && b.challengeKey !== h && ((m = []), (h = void 0)));
      let x = f.pieceRect ? `${f.pieceRect.width}×${f.pieceRect.height}` : `未直接暴露`;
      e.push(
        `滑块第 ${t}/${__contentScope.St} 次：背景 ${f.backgroundRect.width}×${f.backgroundRect.height}，拼图块 ${x}，轨道行程 ${(f.trackRect.width - f.handleRect.width).toFixed(1)}px`,
      );
      let S, C;
      try {
        let e = await (0, __contentScope.n)({
          type: `SLIDER_CRACK`,
          runId: r,
          ...(i ? { frameSessionId: i } : {}),
          slider: f,
          options: {
            attempt: t,
            correctionPx: c,
            ...(m.length ? { excludedGapX: [...m] } : {}),
          },
        });
        e.ok ? (S = e.feature?.slider) : (C = e.error);
      } finally {
        y();
      }
      if (!s()) {
        u = `本轮滑块任务已停止`;
        break;
      }
      if (C) ((u = C), e.push(`滑块后台调用失败：${C}`));
      else if (!S) ((u = `后台没有返回滑块处理结果`), e.push(u));
      else if (S.solved) {
        e.push(`可信拖动已执行，等待页面验收：${(0, __contentScope.Ot)(S)}`);
        let t = await (0, __contentScope._t)(
          b,
          i ? Math.max(0, Math.min(5500, o - Date.now())) : 5500,
          a,
        );
        if ((e.push((0, __contentScope.wt)(t)), t.kind === `success`)) {
          let e = !!i && t.evidence === `disappearance`;
          return {
            solved: !e,
            ...(e ? { dismissed: !0 } : {}),
            method: S.method,
            gapX: S.gapX,
            distance: S.distance,
          };
        }
        if (
          ((u = (0, __contentScope.wt)(t)),
          t.kind === `failed` &&
            t.evidence === `status` &&
            S.gapX != null &&
            !m.some((e) => Math.abs(e - S.gapX) < 3) &&
            (m.push(S.gapX), (h = t.state.challengeKey ?? b.challengeKey)),
          (c = (0, __contentScope.xt)(
            c,
            t.kind,
            S.diagnostics?.handleRange ?? f.trackRect.width - f.handleRect.width,
          )),
          t.kind === `too-short` || t.kind === `too-far`)
        ) {
          ((l = t.state.challengeKey ?? b.challengeKey), await (0, __contentScope.g)(350));
          continue;
        }
        if (t.kind === `refreshed`) {
          ((c = 0), (l = void 0), (m = []), (h = void 0), await (0, __contentScope.g)(350));
          continue;
        }
      } else if (
        ((u = S.error ?? `滑块图像识别或拖动失败`),
        e.push(`滑块本次未执行：${u}${S.method ? `（${(0, __contentScope.Ot)(S)}）` : ``}`),
        S.errorCode === `match-ambiguous` && ((_ += 1), _ >= 2))
      ) {
        ((u = `这个滑块在同一张图上有多个疑似缺口，自动识别无法确定唯一目标`),
          e.push(`${u}，已停止自动尝试并交由人工完成`));
        break;
      }
      if (t >= __contentScope.St || !s() || (i && Date.now() >= o)) break;
      ((c = 0),
        (l = void 0),
        (m = []),
        (h = void 0),
        (await (0, __contentScope.yt)(a))
          ? (e.push(`已通过验证控件自身的刷新按钮请求新挑战`),
            await (0, __contentScope.bt)(b.challengeKey, 3500, a))
          : await (0, __contentScope.bt)(b.challengeKey, 1600, a),
        await (0, __contentScope.g)(300));
    }
    return (e.push(`滑块自动求解未通过页面确认：${u}`), { solved: !1, error: u });
  }

  function frame_At(e, t) {
    if (__contentScope.$) return (e.push(`滑块求解已经在执行，复用当前任务`), __contentScope.$);
    let n = (0, __contentScope.kt)(e, t).finally(() => {
      __contentScope.$ === n && (__contentScope.$ = null);
    });
    return ((__contentScope.$ = n), n);
  }

  function frame_jt(e, t, n) {
    return (0, __contentScope.At)(e, { frameSessionId: t, deadline: n });
  }
  __contentState.r = frame_r;
  __contentState.he = frame_he;
  __contentState.z = frame_z;
  __contentState.B = frame_B;
  __contentState.ge = frame_ge;
  __contentState._e = frame__e;
  __contentState.ve = frame_ve;
  __contentState.ye = frame_ye;
  __contentState.V = frame_V;
  __contentState.H = frame_H;
  __contentState.U = frame_U;
  __contentState.W = frame_W;
  __contentState.G = frame_G;
  __contentState.be = frame_be;
  __contentState.xe = frame_xe;
  __contentState.K = frame_K;
  __contentState.Se = frame_Se;
  __contentState.Ce = frame_Ce;
  __contentState.we = frame_we;
  __contentState.Te = frame_Te;
  __contentState.Ee = frame_Ee;
  __contentState.De = frame_De;
  __contentState.Oe = frame_Oe;
  __contentState.ke = frame_ke;
  __contentState.Ae = frame_Ae;
  __contentState.q = frame_q;
  __contentState.je = frame_je;
  __contentState.Me = frame_Me;
  __contentState.Ne = frame_Ne;
  __contentState.Pe = frame_Pe;
  __contentState.Fe = frame_Fe;
  __contentState.Ie = frame_Ie;
  __contentState.Le = frame_Le;
  __contentState.Re = frame_Re;
  __contentState.ze = frame_ze;
  __contentState.Be = frame_Be;
  __contentState.Ve = frame_Ve;
  __contentState.He = frame_He;
  __contentState.Ue = frame_Ue;
  __contentState.We = frame_We;
  __contentState.J = frame_J;
  __contentState.Y = frame_Y;
  __contentState.Ge = frame_Ge;
  __contentState.Ke = frame_Ke;
  __contentState.qe = frame_qe;
  __contentState.Je = frame_Je;
  __contentState.Ze = frame_Ze;
  __contentState.Qe = frame_Qe;
  __contentState.$e = frame_$e;
  __contentState.et = frame_et;
  __contentState.tt = frame_tt;
  __contentState.nt = frame_nt;
  __contentState.rt = frame_rt;
  __contentState.Z = frame_Z;
  __contentState.Q = frame_Q;
  __contentState.pt = frame_pt;
  __contentState.mt = frame_mt;
  __contentState.ht = frame_ht;
  __contentState.gt = frame_gt;
  __contentState._t = frame__t;
  __contentState.vt = frame_vt;
  __contentState.yt = frame_yt;
  __contentState.bt = frame_bt;
  __contentState.xt = frame_xt;
  __contentState.wt = frame_wt;
  __contentState.Dt = frame_Dt;
  __contentState.Ot = frame_Ot;
  __contentState.kt = frame_kt;
  __contentState.At = frame_At;
  __contentState.jt = frame_jt;
  return {
    state: __contentState,
    api: {
      solve(log, sessionId, deadline) {
        return (0, __contentScope.jt)(log, sessionId, deadline);
      },
      install() {
        return __contentScope.Mt.main();
      },
    },
    initializers: [
      {
        order: 9,
        run() {
          __contentState.k = {
            widgets: [
              `.tencent-captcha-dy__slider-groove`,
              `.tencent-captcha-dy__slider-block`,
              `.tencent-captcha-dy__verify-bg`,
            ].join(`, `),
            success: [
              `.tencent-captcha-dy__slider-groove--success`,
              `.tencent-captcha-dy__slider-block--success`,
            ].join(`, `),
            handle: `.tencent-captcha-dy__slider-block`,
            background: `.tencent-captcha-dy__verify-bg`,
            backgroundImage: `.tencent-captcha-dy__verify-bg-img`,
            piece: `.tencent-captcha-dy__fg-item`,
            refresh: `.tencent-captcha-dy__footer-icon--refresh`,
          };
        },
      },
      {
        order: 10,
        run() {
          __contentState.A = [
            `.geetest_panel`,
            `.geetest_holder`,
            `.geetest_slider_button`,
            `.gt_holder`,
            `.gt_widget`,
            `.gt_slider_knob`,
            `.slide-verify`,
            `.slider-captcha`,
            `.captcha-slider`,
            `.verify-slider`,
            `.jigsaw-slider`,
            `.drag-captcha`,
            `.yidun_slider`,
            `.yidun_panel`,
            `.nc-container`,
            `.nc_iconfont.btn_slide`,
            `[class*="captcha" i][class*="slider" i]`,
            `[id*="captcha" i][id*="slider" i]`,
            `[class*="verify" i][class*="slider" i]`,
            `[class*="slider" i][class*="verify" i]`,
            `[class*="jigsaw" i][class*="slider" i]`,
            `[class*="slide-verify" i]`,
          ].join(`, `);
        },
      },
      {
        order: 11,
        run() {
          __contentState.oe = [
            `.geetest_success`,
            `.gt_info_success`,
            `.gt_success`,
            `.yidun_success`,
            `[class*="captcha" i][data-state="verified" i]`,
            `[class*="captcha" i][data-status="success" i]`,
            `[class*="slider" i][data-state="verified" i]`,
            `[class*="slider" i][data-status="success" i]`,
            `[class*="verify" i][data-state="success" i]`,
          ].join(`, `);
        },
      },
      {
        order: 12,
        run() {
          __contentState.se = [
            `[role="slider"]`,
            `[draggable="true"]`,
            `.geetest_slider_button`,
            `.gt_slider_knob`,
            `.nc_iconfont.btn_slide`,
            `[class*="slider" i][class*="btn" i]`,
            `[class*="slider" i][class*="button" i]`,
            `[class*="slider" i][class*="handle" i]`,
            `[class*="slider" i][class*="knob" i]`,
            `[class*="slide" i][class*="btn" i]`,
            `[class*="drag" i][class*="btn" i]`,
            `[class*="drag" i][class*="button" i]`,
            `[class*="move" i][class*="btn" i]`,
          ].join(`, `);
        },
      },
      {
        order: 13,
        run() {
          __contentState.ce = `img, canvas, [class], [id]`;
        },
      },
      {
        order: 14,
        run() {
          __contentState.j =
            /captcha|challenge|verify|verification|puzzle|jigsaw|geetest|yidun|human|robot|验证码|验证|拼图|人机|安全校验/i;
        },
      },
      {
        order: 15,
        run() {
          __contentState.M =
            /slider|slide|drag|swipe|move|track|rail|thumb|knob|handle|滑块|滑动|拖动|向右滑/i;
        },
      },
      {
        order: 16,
        run() {
          __contentState.le =
            /(?:slider|slide|drag|move)[-_\s]*(?:btn|button|handle|knob|thumb)|(?:btn|button|handle|knob|thumb)[-_\s]*(?:slider|slide|drag|move)|滑块|拖动|滑动/i;
        },
      },
      {
        order: 17,
        run() {
          __contentState.ue =
            /carousel|swiper|gallery|volume|seek|range|price|filter|toggle|switch|轮播|音量|价格|筛选/i;
        },
      },
      {
        order: 18,
        run() {
          __contentState.N =
            /background|(?:^|[-_\s])bg(?:$|[-_\s])|canvas|content|image|(?:^|[-_\s])img(?:$|[-_\s])/i;
        },
      },
      {
        order: 19,
        run() {
          __contentState.P =
            /piece|slice|template|block|puzzle|jigsaw|move[-_\s]*img|slider[-_\s]*img|拼图|缺块/i;
        },
      },
      {
        order: 20,
        run() {
          __contentState.de =
            /track|rail|bar|slider[-_\s]*move|slide[-_\s]*track|drag[-_\s]*track|滑轨|拖动条/i;
        },
      },
      {
        order: 21,
        run() {
          __contentState.F =
            /drag|slide|swipe|move|complete.{0,12}(?:puzzle|verification)|拖动|滑动|按住|完成拼图|向右滑/i;
        },
      },
      {
        order: 22,
        run() {
          __contentState.fe = [
            __contentScope.A,
            `[role="dialog"]`,
            `[aria-modal="true"]`,
            `[class*="captcha" i]`,
            `[id*="captcha" i]`,
            `[class*="verify" i]`,
            `[id*="verify" i]`,
            `img`,
            `canvas`,
            `[style*="background" i]`,
          ].join(`, `);
        },
      },
      {
        order: 23,
        run() {
          __contentState.pe =
            /refresh|reload|close|cancel|reset|help|(?:^|[-_\s])info(?:$|[-_\s])|刷新|换一张|关闭|取消|帮助|说明/i;
        },
      },
      {
        order: 24,
        run() {
          __contentState.I = 1200;
        },
      },
      {
        order: 25,
        run() {
          __contentState.me = 8388608;
        },
      },
      {
        order: 26,
        run() {
          __contentState.L = `data-aah-pointer-target`;
        },
      },
      {
        order: 27,
        run() {
          __contentState.Ye = (e) =>
            new Promise((t) => {
              let n = e === `tencent-frame` ? setTimeout(t, 250) : void 0;
              requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                  (n !== void 0 && clearTimeout(n), t());
                }),
              );
            });
        },
      },
      {
        order: 28,
        run() {
          __contentState.Xe = (e) => new Promise((t) => setTimeout(t, e));
        },
      },
      {
        order: 29,
        run() {
          __contentState.it =
            /\b(?:verified|verification successful|success|passed)\b|验证\s*成功|校验\s*成功|验证\s*通过|已\s*通过/i;
        },
      },
      {
        order: 30,
        run() {
          __contentState.at =
            /too short|not far enough|move (?:a little )?further|偏左|距离过短|滑动不足|还差一点|未拖到位/i;
        },
      },
      {
        order: 31,
        run() {
          __contentState.ot =
            /too far|overshoot|move (?:a little )?back|偏右|距离过长|滑过头|拖过头/i;
        },
      },
      {
        order: 32,
        run() {
          __contentState.st =
            /failed|failure|incorrect|try again|retry|error|验证失败|校验失败|请重试|重新尝试|再试一次/i;
        },
      },
      {
        order: 33,
        run() {
          __contentState.ct =
            /refresh|reload|retry|try again|change image|next image|刷新|换一张|重试|重新加载/i;
        },
      },
      {
        order: 34,
        run() {
          __contentState.lt = /close|cancel|关闭|取消/i;
        },
      },
      {
        order: 35,
        run() {
          __contentState.ut = 900;
        },
      },
      {
        order: 36,
        run() {
          __contentState.dt = 1200;
        },
      },
      {
        order: 37,
        run() {
          __contentState.ft = {
            'too-short': __contentScope.at,
            'too-far': __contentScope.ot,
            failed: __contentScope.st,
          };
        },
      },
      {
        order: 38,
        run() {
          __contentState.St = 5;
        },
      },
      {
        order: 39,
        run() {
          __contentState.Ct = 55e3;
        },
      },
      {
        order: 40,
        run() {
          __contentState.$ = null;
        },
      },
      {
        order: 41,
        run() {
          __contentState.Tt = {
            'raw-image': `原图`,
            'viewport-screenshot': `CDP 截图`,
          };
        },
      },
      {
        order: 42,
        run() {
          __contentState.Et = {
            measured: `实测碎片`,
            'hole-silhouette': `形状吻合`,
            'outline-profile': `轮廓剖面`,
            'background-delta': `双图差分`,
            'contour-alpha': `轮廓(带形状)`,
            'contour-edge': `轮廓(矩形)`,
            opencv: `OpenCV 模板`,
            ncc: `JS 模板`,
            silhouette: `形状吻合`,
          };
        },
      },
      {
        order: 43,
        run() {
          __contentState.Mt = (0, __contentScope.e)(() => {
            if (window === window.top || !(0, __contentScope.r)(location.href)) return;
            let e = globalThis;
            if (e.__aahSliderFrameInstalled) return;
            e.__aahSliderFrameInstalled = !0;
            let t;
            (chrome.runtime.onMessage.addListener((e, n) => {
              n.id === chrome.runtime.id &&
                e?.type === `aah-slider-frame-stop` &&
                e.sessionId === t &&
                (0, __contentScope.u)(null);
            }),
              window.addEventListener(`message`, (e) => {
                let r = e.data;
                if (
                  e.source !== window.parent ||
                  r?.type !== `aah-slider-frame-connect` ||
                  typeof r.sessionId != `string` ||
                  !/^sf-[a-z0-9-]{8,80}$/i.test(r.sessionId) ||
                  t
                )
                  return;
                let i = r.sessionId;
                ((t = i),
                  (async () => {
                    let e = await (0, __contentScope.n)({
                      type: `SLIDER_FRAME_CONNECT`,
                      sessionId: i,
                    });
                    if (!e.ok) return;
                    let t = e.feature?.sliderFrame;
                    if (!t?.runId || !t.deadline) return;
                    (0, __contentScope.u)(t.runId, `trusted`, i);
                    let r = [],
                      a = {
                        push(e) {
                          (r.push(e),
                            (0, __contentScope.n)({
                              type: `SLIDER_FRAME_REPORT`,
                              sessionId: i,
                              steps: [...r],
                            }));
                        },
                      },
                      o;
                    try {
                      o = await (0, __contentScope.jt)(a, i, t.deadline);
                    } catch (e) {
                      o = {
                        solved: !1,
                        error: e instanceof Error ? e.message : String(e),
                      };
                    }
                    await (0, __contentScope.n)({
                      type: `SLIDER_FRAME_REPORT`,
                      sessionId: i,
                      steps: [...r],
                      result: o,
                    });
                  })()
                    .finally(() => {
                      t === i && ((0, __contentScope.u)(null), (t = void 0));
                    })
                    .catch(() => void 0));
              }));
          });
        },
      },
      {
        order: 44,
        run() {
          __contentState.Nt = {
            debug: (...e) => ([...e], void 0),
            log: (...e) => ([...e], void 0),
            warn: (...e) => ([...e], void 0),
            error: (...e) => ([...e], void 0),
          };
        },
      },
    ],
  };
}
