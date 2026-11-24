(() => {
  // src/shared/content-runtime.js
  function bindContentState(scope, names) {
    const state = /* @__PURE__ */ Object.create(null);
    for (const name of names) {
      if (Object.prototype.hasOwnProperty.call(scope, name)) {
        throw new Error(`内容模块重复注册绑定：${name}`);
      }
      state[name] = void 0;
      Object.defineProperty(scope, name, {
        enumerable: true,
        get: () => state[name],
        set: (value) => {
          state[name] = value;
        }
      });
    }
    return state;
  }
  function initializeContentModules(modules) {
    const steps = Object.values(modules).flatMap((module) => module.initializers).sort((left, right) => left.order - right.order);
    for (const step of steps) step.run();
  }

  // src/shared/content-support.js
  function createSharedFrameContent(__contentScope) {
    const __contentState = bindContentState(__contentScope, [
      "e",
      "t",
      "n",
      "i",
      "a",
      "o",
      "s",
      "c",
      "l",
      "u",
      "d",
      "f",
      "p",
      "m",
      "h",
      "g",
      "_",
      "v",
      "y",
      "b",
      "x",
      "S",
      "C",
      "w",
      "ee",
      "te",
      "T",
      "ne",
      "E",
      "re",
      "D",
      "O",
      "ie",
      "ae"
    ]);
    function frame_e(e) {
      return e == null || typeof e == `function` ? { main: e } : e;
    }
    function frame_t(e) {
      if (e.type === `SLIDER_FRAME_PREPARE`) return 8e3;
      if (e.type === `SLIDER_FRAME_CONNECT` || e.type === `SLIDER_FRAME_REPORT` || e.type === `SLIDER_FRAME_STATUS` || e.type === `SLIDER_FRAME_CANCEL`)
        return 4e3;
      if (e.type === `SCAN_LOCAL_PORTS`) {
        let t = e.withExit === true ? 24e3 : 8e3;
        return e.ports.length * t + 1e4;
      }
      return e.type === `TEST_PROXY` ? 34e3 : 45e3;
    }
    function frame_n(e) {
      return new Promise((n) => {
        let r = (0, __contentScope.t)(e), i = false, a = (e2) => {
          i || (i = true, clearTimeout(o), n(e2));
        }, o = setTimeout(() => {
          a({
            ok: false,
            error: `后台在 ${Math.round(r / 1e3)} 秒内没有响应 ${e.type}（Service Worker 可能已被回收）`
          });
        }, r);
        try {
          chrome.runtime.sendMessage(e, (e2) => {
            chrome.runtime.lastError ? a({
              ok: false,
              error: chrome.runtime.lastError.message ?? `unknown`
            }) : a(e2 ?? { ok: true });
          });
        } catch (e2) {
          a({ ok: false, error: e2 instanceof Error ? e2.message : String(e2) });
        }
      });
    }
    function frame_i(e) {
      return Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0.5;
    }
    function frame_a(e, t) {
      return t.kind === `inset-left` ? e.left + Math.min(t.px, e.width / 2) : t.kind === `relative` ? e.left + e.width * (0, __contentScope.i)(t.rx) : e.left + e.width / 2;
    }
    function frame_o(e, t) {
      return t.kind === `relative` ? e.top + e.height * (0, __contentScope.i)(t.ry) : e.top + e.height / 2;
    }
    function frame_u(e, t = `trusted`, n) {
      __contentScope.s = e, __contentScope.c = t, __contentScope.l = e ? n : void 0;
    }
    function frame_d() {
      return __contentScope.s;
    }
    function frame_f() {
      return __contentScope.l;
    }
    function frame_p(e, t) {
      return Math.abs(e.left - t.left) > 1 || Math.abs(e.top - t.top) > 1 || Math.abs(e.width - t.width) > 1 || Math.abs(e.height - t.height) > 1;
    }
    function frame_m(e) {
      if (e != null && Date.now() >= e) throw Error(`点击已超过执行截止时间`);
    }
    async function frame_h(e, t) {
      let n = e.getBoundingClientRect(), r = Math.min(Date.now() + 1200, t ?? 1 / 0), i = 0;
      for (; Date.now() < r; ) {
        await (0, __contentScope.g)(Math.min(34, Math.max(1, r - Date.now())));
        let t2 = e.getBoundingClientRect();
        if ((0, __contentScope.p)(n, t2) ? i = 0 : i += 1, n = t2, i >= 2) return t2;
      }
      throw (0, __contentScope.m)(t), Error(`目标控件位置仍在变化，无法可靠点击`);
    }
    function frame_S(e) {
      if (e.gesture !== void 0 && !__contentScope.v.has(e.gesture))
        throw Error(`未知手势 ${String(e.gesture)}；只允许 click/double/right/long-press`);
      let t = e.gesture ?? `click`, n = null;
      if (e.key !== void 0) {
        if (!__contentScope._.has(e.key))
          throw Error(`key 只允许非打印功能键，收到 ${JSON.stringify(e.key)}`);
        n = e.key;
      }
      if (n != null && t !== `click`)
        throw Error(`key 触发与手势互斥：键盘触发不能再叠加 double/right/long-press`);
      let r = e.anchor == null ? e.insetLeftPx == null ? { kind: `center` } : { kind: `inset-left`, px: e.insetLeftPx } : { kind: `relative`, rx: e.anchor.rx, ry: e.anchor.ry }, i = e.holdMs != null && Number.isFinite(e.holdMs) ? Math.max(0, Math.round(e.holdMs)) : __contentScope.b;
      return { anchor: r, gesture: t, key: n, holdMs: i };
    }
    function frame_C(e, t, n, r = 0, i = 0) {
      return {
        bubbles: true,
        cancelable: true,
        view: e.ownerDocument?.defaultView ?? window,
        button: r,
        buttons: i,
        clientX: Math.round(t),
        clientY: Math.round(n)
      };
    }
    function frame_w(e, t, n, r, i = 0, a = 0) {
      let o = (0, __contentScope.C)(t, n, r, i, a);
      try {
        return new MouseEvent(e, o);
      } catch {
        let { view: t2, ...n2 } = o;
        return new MouseEvent(e, n2);
      }
    }
    function frame_ee(e, t) {
      let n = __contentScope.y[t];
      if (!n) throw Error(`key 只允许非打印功能键，收到 ${JSON.stringify(t)}`);
      typeof e.focus == `function` && e.focus();
      let r = {
        bubbles: true,
        cancelable: true,
        key: n.key,
        code: n.code,
        keyCode: n.keyCode,
        which: n.keyCode
      };
      e.dispatchEvent(new KeyboardEvent(`keydown`, r)), n.keyCode === 13 && e.dispatchEvent(new KeyboardEvent(`keypress`, r)), e.dispatchEvent(new KeyboardEvent(`keyup`, r));
    }
    async function frame_te(e, t, n, r, i) {
      if (r === `double`) {
        for (let r2 = 0; r2 < 2; r2 += 1)
          e.dispatchEvent((0, __contentScope.w)(`mousedown`, e, t, n, 0, 1)), e.dispatchEvent((0, __contentScope.w)(`mouseup`, e, t, n, 0, 0)), typeof e.click == `function` ? e.click() : e.dispatchEvent((0, __contentScope.w)(`click`, e, t, n, 0, 0)), r2 === 0 && await (0, __contentScope.g)(__contentScope.x);
        e.dispatchEvent((0, __contentScope.w)(`dblclick`, e, t, n, 0, 0));
      } else
        r === `right` ? (e.dispatchEvent((0, __contentScope.w)(`mousedown`, e, t, n, 2, 2)), e.dispatchEvent((0, __contentScope.w)(`contextmenu`, e, t, n, 2, 2)), e.dispatchEvent((0, __contentScope.w)(`mouseup`, e, t, n, 2, 0))) : r === `long-press` ? (e.dispatchEvent((0, __contentScope.w)(`mousedown`, e, t, n, 0, 1)), await (0, __contentScope.g)(i), e.dispatchEvent((0, __contentScope.w)(`mouseup`, e, t, n, 0, 0)), typeof e.click == `function` ? e.click() : e.dispatchEvent((0, __contentScope.w)(`click`, e, t, n, 0, 0))) : (0, __contentScope.ne)(e);
    }
    function frame_T(e, t) {
      let n = { bubbles: true, cancelable: true };
      try {
        return new MouseEvent(e, {
          ...n,
          view: t.ownerDocument?.defaultView ?? window
        });
      } catch {
        return new MouseEvent(e, n);
      }
    }
    function frame_ne(e) {
      e.dispatchEvent((0, __contentScope.T)(`mousedown`, e)), e.dispatchEvent((0, __contentScope.T)(`mouseup`, e)), typeof e.click == `function` ? e.click() : e.dispatchEvent((0, __contentScope.T)(`click`, e));
    }
    async function frame_E(e, t = {}) {
      let r = __contentScope.s, i = __contentScope.c === `dom` || !r || typeof chrome > `u` || !chrome.runtime?.id;
      if (i && t.targetSeenAt != null && Number.isFinite(t.targetSeenAt)) {
        let e2 = t.targetSeenAt + 15e3 - Date.now();
        if (e2 > 0) {
          if (t.deadline != null && Date.now() + e2 >= t.deadline)
            throw Error(`验证控件安全窗口会超过执行截止时间，已取消点击`);
          await (0, __contentScope.g)(e2);
        }
      }
      (0, __contentScope.m)(t.deadline), e.scrollIntoView({ block: `center`, inline: `center` });
      let u = await (0, __contentScope.h)(e, t.deadline);
      if ((0, __contentScope.m)(t.deadline), u.width <= 0 || u.height <= 0)
        throw Error(`目标控件当前不可见，无法点击`);
      let d = u.top + u.height / 2, f = u.left + u.width / 2;
      if (d < 0 || d > window.innerHeight || f < 0 || f > window.innerWidth)
        throw Error(
          `目标控件在视口之外（滚动后位置 ${Math.round(u.left)},${Math.round(u.top)} 超出视口 ${window.innerWidth}x${window.innerHeight}），已取消点击以免点到其它元素`
        );
      let { anchor: p, gesture: _, key: v, holdMs: y } = (0, __contentScope.S)(t), b = (e2) => e2 !== `click`, x = Math.min(window.innerWidth - 1, Math.max(1, (0, __contentScope.a)(u, p))), C = Math.min(window.innerHeight - 1, Math.max(1, (0, __contentScope.o)(u, p)));
      if (t.debugVisualize) {
        let e2 = document.createElement(`div`);
        e2.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${C}px;
      width: 20px;
      height: 20px;
      margin: -10px 0 0 -10px;
      background: red;
      border: 3px solid yellow;
      border-radius: 50%;
      z-index: 999999;
      pointer-events: none;
      box-shadow: 0 0 10px rgba(255,0,0,0.8);
    `, document.body.appendChild(e2);
        try {
          if (t.deadline != null && Date.now() + 2e3 >= t.deadline)
            throw Error(`调试标记等待会超过执行截止时间，已取消点击`);
          await (0, __contentScope.g)(2e3);
        } finally {
          e2.remove();
        }
        (0, __contentScope.m)(t.deadline);
      }
      let { hit: w, blocked: T } = (0, __contentScope.ie)(e, x, C);
      if (T) throw Error(`目标控件被 ${w ? (0, __contentScope.ae)(w) : `未知元素`} 遮挡`);
      if (i)
        return (0, __contentScope.m)(t.deadline), v == null ? _ === `click` ? ((0, __contentScope.ne)(e), `dom`) : (await (0, __contentScope.te)(e, x, C, _, y), `dom`) : ((0, __contentScope.ee)(e, v), `dom`);
      if (v != null) return (0, __contentScope.m)(t.deadline), (0, __contentScope.ee)(e, v), `dom`;
      if (_ !== `click` && !b(_))
        throw Error(
          `${(0, __contentScope.re)(_)}需要浏览器级指针通道，当前页面没有可信指针接线，已取消执行（不降级为普通单击）`
        );
      let E = `data-aah-pointer-target`, D = e.getAttribute(E), O = `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      e.setAttribute(E, O);
      try {
        (0, __contentScope.m)(t.deadline);
        let e2 = await (0, __contentScope.n)({
          type: `TRUSTED_POINTER_CLICK`,
          runId: r,
          ...__contentScope.l ? { frameSessionId: __contentScope.l } : {},
          x,
          y: C,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          targetToken: O,
          anchor: p,
          ..._ === `click` ? {} : { gesture: _ },
          ..._ === `long-press` ? { holdMs: y } : {},
          ...v == null ? {} : { key: v },
          ...t.targetSeenAt == null ? {} : { targetSeenAt: t.targetSeenAt },
          ...t.deadline == null ? {} : { deadline: t.deadline }
        });
        if (!e2.ok) {
          if (t.mayNavigate && t.reconcileAfterLostResponse && (e2.error.includes(`没有响应 TRUSTED_POINTER_CLICK`) || e2.error.includes(`点击结果可能未知`)))
            return `trusted`;
          throw Error(`浏览器级鼠标点击失败：${e2.error}`);
        }
        if (e2.feature?.pointer?.mode !== `trusted`) {
          if (t.mayNavigate) return `trusted`;
          throw Error(`浏览器级鼠标点击没有返回可信执行结果`);
        }
        let i2 = e2.feature.pointer;
        if (t.onPointerResult?.(i2), i2.clickObserved === false) {
          if (t.shadowTarget) return `trusted`;
          throw Error(`浏览器级鼠标事件未到达目标控件`);
        }
        if (i2.clickObserved == null && !t.mayNavigate)
          throw Error(`无法确认目标控件收到浏览器级鼠标事件`);
        return `trusted`;
      } finally {
        e.getAttribute(E) === O && (D == null ? e.removeAttribute(E) : e.setAttribute(E, D));
      }
    }
    function frame_re(e) {
      return e === `double` ? `双击` : e === `right` ? `右键` : e === `long-press` ? `长按` : `点击`;
    }
    function frame_D(e, t) {
      let n = document.elementFromPoint(e, t);
      for (; n?.shadowRoot; ) {
        let r = n.shadowRoot.elementFromPoint(e, t);
        if (!r || r === n) break;
        n = r;
      }
      return n;
    }
    function frame_O(e) {
      let t = [], n = e;
      for (; n; ) {
        if (t.push(n), n.parentElement) {
          n = n.parentElement;
          continue;
        }
        let e2 = n.getRootNode();
        n = e2 instanceof ShadowRoot ? e2.host : null;
      }
      return t;
    }
    function frame_ie(e, t, n) {
      let r = (0, __contentScope.D)(t, n);
      if (!r) return { hit: null, blocked: true };
      if (r === e || e.contains(r) || r.contains(e)) return { hit: r, blocked: false };
      for (let t2 of (0, __contentScope.O)(e)) if (t2 === r) return { hit: r, blocked: false };
      return { hit: r, blocked: true };
    }
    function frame_ae(e) {
      let t = e.id ? `#${e.id}` : ``, n = String(e.className || ``).trim().split(/\s+/).filter(Boolean).slice(0, 2).join(`.`);
      return `${e.tagName.toLowerCase()}${t}${n ? `.${n}` : ``}`;
    }
    __contentState.e = frame_e;
    __contentState.t = frame_t;
    __contentState.n = frame_n;
    __contentState.i = frame_i;
    __contentState.a = frame_a;
    __contentState.o = frame_o;
    __contentState.u = frame_u;
    __contentState.d = frame_d;
    __contentState.f = frame_f;
    __contentState.p = frame_p;
    __contentState.m = frame_m;
    __contentState.h = frame_h;
    __contentState.S = frame_S;
    __contentState.C = frame_C;
    __contentState.w = frame_w;
    __contentState.ee = frame_ee;
    __contentState.te = frame_te;
    __contentState.T = frame_T;
    __contentState.ne = frame_ne;
    __contentState.E = frame_E;
    __contentState.re = frame_re;
    __contentState.D = frame_D;
    __contentState.O = frame_O;
    __contentState.ie = frame_ie;
    __contentState.ae = frame_ae;
    return {
      state: __contentState,
      api: {},
      initializers: [
        {
          order: 0,
          run() {
            __contentState.s = null;
          }
        },
        {
          order: 1,
          run() {
            __contentState.c = `trusted`;
          }
        },
        {
          order: 2,
          run() {
            __contentState.g = (e) => new Promise((t) => setTimeout(t, e));
          }
        },
        {
          order: 3,
          run() {
            __contentState._ = /* @__PURE__ */ new Set([
              `Enter`,
              `Space`,
              `Escape`,
              `Tab`,
              `ArrowUp`,
              `ArrowDown`,
              `ArrowLeft`,
              `ArrowRight`
            ]);
          }
        },
        {
          order: 4,
          run() {
            __contentState.v = /* @__PURE__ */ new Set([`click`, `double`, `right`, `long-press`]);
          }
        },
        {
          order: 5,
          run() {
            __contentState.y = {
              Enter: { key: `Enter`, code: `Enter`, keyCode: 13 },
              Space: { key: ` `, code: `Space`, keyCode: 32 },
              Escape: { key: `Escape`, code: `Escape`, keyCode: 27 },
              Tab: { key: `Tab`, code: `Tab`, keyCode: 9 },
              ArrowUp: { key: `ArrowUp`, code: `ArrowUp`, keyCode: 38 },
              ArrowDown: { key: `ArrowDown`, code: `ArrowDown`, keyCode: 40 },
              ArrowLeft: { key: `ArrowLeft`, code: `ArrowLeft`, keyCode: 37 },
              ArrowRight: { key: `ArrowRight`, code: `ArrowRight`, keyCode: 39 }
            };
          }
        },
        {
          order: 6,
          run() {
            __contentState.b = 600;
          }
        },
        {
          order: 7,
          run() {
            __contentState.x = 90;
          }
        },
        {
          order: 8,
          run() {
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
              `label`
            ].join(`, `);
          }
        }
      ]
    };
  }

  // src/modules/slider/content.js
  function createSliderFrameContent(__contentScope) {
    const __contentState = bindContentState(__contentScope, [
      "r",
      "k",
      "A",
      "oe",
      "se",
      "ce",
      "j",
      "M",
      "le",
      "ue",
      "N",
      "P",
      "de",
      "F",
      "fe",
      "pe",
      "I",
      "me",
      "L",
      "R",
      "he",
      "z",
      "B",
      "ge",
      "_e",
      "ve",
      "ye",
      "V",
      "H",
      "U",
      "W",
      "G",
      "be",
      "xe",
      "K",
      "Se",
      "Ce",
      "we",
      "Te",
      "Ee",
      "De",
      "Oe",
      "ke",
      "Ae",
      "q",
      "je",
      "Me",
      "Ne",
      "Pe",
      "Fe",
      "Ie",
      "Le",
      "Re",
      "ze",
      "Be",
      "Ve",
      "He",
      "Ue",
      "We",
      "J",
      "Y",
      "Ge",
      "Ke",
      "qe",
      "Je",
      "Ye",
      "Xe",
      "Ze",
      "Qe",
      "$e",
      "et",
      "X",
      "tt",
      "nt",
      "rt",
      "Z",
      "Q",
      "it",
      "at",
      "ot",
      "st",
      "ct",
      "lt",
      "ut",
      "dt",
      "ft",
      "pt",
      "mt",
      "ht",
      "gt",
      "_t",
      "vt",
      "yt",
      "bt",
      "xt",
      "St",
      "Ct",
      "$",
      "wt",
      "Tt",
      "Et",
      "Dt",
      "Ot",
      "kt",
      "At",
      "jt",
      "Mt",
      "Nt"
    ]);
    function frame_r(e) {
      try {
        let t = new URL(e);
        return t.protocol === `https:` && [
          `turing.captcha.qcloud.com`,
          `ca.turing.captcha.qcloud.com`,
          `turing.captcha.gtimg.com`,
          `global.turing.captcha.gtimg.com`
        ].includes(t.hostname);
      } catch {
        return false;
      }
    }
    function frame_he(e) {
      return {
        mode: e,
        semantic: /* @__PURE__ */ new WeakMap(),
        visibility: /* @__PURE__ */ new WeakMap(),
        imageSource: /* @__PURE__ */ new WeakMap()
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
      return (0, __contentScope.B)() ? `${__contentScope.k.widgets}, ${__contentScope.A}` : __contentScope.A;
    }
    function frame__e() {
      return (0, __contentScope.B)() ? `${__contentScope.k.success}, ${__contentScope.oe}` : __contentScope.oe;
    }
    function frame_ve() {
      return (0, __contentScope.B)() ? `${__contentScope.k.handle}, ${__contentScope.se}` : __contentScope.se;
    }
    function frame_ye(e) {
      return __contentScope.de.test(e) || (0, __contentScope.B)() && /groove/i.test(e);
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
      let n = false;
      if (!e.isConnected || e.getClientRects().length === 0) return false;
      let r = e;
      for (; r; ) {
        let n2 = window.getComputedStyle(r);
        if (n2.display === `none` || n2.visibility === `hidden` || n2.visibility === `collapse` || Number.parseFloat(n2.opacity || `1`) <= 0.02 || r instanceof HTMLElement && r.hidden)
          return t && t.visibility.set(e, false), false;
        r = r.parentElement;
      }
      let i = e.getBoundingClientRect();
      return n = i.width >= 2 && i.height >= 2, t && t.visibility.set(e, n), n;
    }
    function frame_U(e) {
      return e.getBoundingClientRect();
    }
    function frame_W(e) {
      let t = (e2) => Math.round(e2 * 10) / 10;
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
        e.getAttribute(`data-status`)
      ], r = (e.textContent ?? ``).replace(/\s+/g, ` `).trim().slice(0, 180), i = `${n.filter(Boolean).join(` `)} ${r}`.toLowerCase();
      return t?.semantic.set(e, i), i;
    }
    function frame_be(e, t = 5) {
      let n = [], r = e;
      for (let e2 = 0; r && e2 < t; e2 += 1) n.push((0, __contentScope.G)(r)), r = r.parentElement;
      return n.join(` `);
    }
    function frame_xe(e) {
      let t = (0, __contentScope.be)(e, 7);
      return __contentScope.j.test(t) && (__contentScope.M.test(t) || __contentScope.F.test(t));
    }
    function frame_K(e, t) {
      return [...e].map((e2) => ({ element: e2, score: t(e2) })).filter((e2) => Number.isFinite(e2.score)).sort((e2, t2) => t2.score - e2.score);
    }
    function frame_Se(e) {
      if (!(e instanceof HTMLElement) || !(0, __contentScope.H)(e)) return -1 / 0;
      let t = (0, __contentScope.U)(e);
      if (t.width < 12 || t.height < 12 || t.width > 180 || t.height > 110) return -1 / 0;
      if ((0, __contentScope.B)()) {
        let n2 = t.left + t.width / 2, r2 = t.top + t.height / 2;
        if (n2 >= 0 && r2 >= 0 && n2 < innerWidth && r2 < innerHeight) {
          let t2 = document.elementFromPoint(n2, r2);
          if (!t2 || !(t2 === e || e.contains(t2))) return -1 / 0;
        }
      }
      let n = (0, __contentScope.G)(e), r = (0, __contentScope.be)(e, 7), i = 0;
      (0, __contentScope.B)() && e.matches(__contentScope.k.handle) && (i += 12), e.getAttribute(`role`)?.toLowerCase() === `slider` && (i += 8), __contentScope.le.test(n) ? i += 9 : __contentScope.M.test(n) && (i += 4), __contentScope.j.test(r) && (i += 7), __contentScope.F.test(r) && (i += 4), __contentScope.M.test(r) && (i += 2), __contentScope.ue.test(r) && !__contentScope.j.test(r) && (i -= 14), e instanceof HTMLInputElement && e.type === `range` && !__contentScope.j.test(r) && (i -= 12), t.width <= 100 && t.height <= 80 && (i += 2);
      let a = window.getComputedStyle(e).cursor;
      return (a === `grab` || a === `grabbing` || a === `pointer` || a === `move`) && (i += 2), i;
    }
    function frame_Ce() {
      let e = (0, __contentScope.V)((0, __contentScope.ve)()), t = (0, __contentScope.V)(`button, [role], [draggable], [class], [id]`).slice(0, __contentScope.I).filter((e2) => __contentScope.le.test((0, __contentScope.G)(e2)));
      return [.../* @__PURE__ */ new Set([...e, ...t])].filter((e2) => e2 instanceof HTMLElement).map((e2) => ({ element: e2, score: (0, __contentScope.Se)(e2) })).filter((e2) => Number.isFinite(e2.score)).sort((e2, t2) => t2.score - e2.score).map((e2) => e2.element);
    }
    function frame_we(e, t) {
      if (!(0, __contentScope.H)(e) || !e.contains(t)) return -1 / 0;
      let n = (0, __contentScope.U)(e), r = (0, __contentScope.U)(t);
      if (n.width < r.width * 2 || n.height < r.height * 1.6) return -1 / 0;
      let i = (0, __contentScope.G)(e), a = 0;
      return __contentScope.j.test(i) && (a += 8), __contentScope.M.test(i) && (a += 5), __contentScope.F.test(i) && (a += 4), (0, __contentScope.V)(`img, canvas`, e).some(__contentScope.H) && (a += 5), n.width >= 160 && n.width <= 720 && (a += 3), n.height >= 110 && n.height <= 720 && (a += 3), n.width >= window.innerWidth * 0.96 && n.height >= window.innerHeight * 0.9 && (a -= 3), a -= Math.log10(Math.max(10, n.width * n.height)), a;
    }
    function frame_Te(e) {
      let t = [], n = e.parentElement;
      for (let e2 = 0; n && n !== document.body && e2 < 12; e2 += 1) t.push(n), n = n.parentElement;
      let r = (0, __contentScope.K)(t, (t2) => (0, __contentScope.we)(t2, e))[0];
      return r && r.score >= 3 ? r.element : null;
    }
    function frame_Ee(e, t) {
      return Math.max(0, Math.min(e.bottom, t.bottom) - Math.max(e.top, t.top));
    }
    function frame_De(e, t, n) {
      if (!(0, __contentScope.H)(e) || !t.contains(e)) return -1 / 0;
      let r = (0, __contentScope.U)(e), i = (0, __contentScope.U)(n);
      if (r.width < i.width * 1.8 || r.height > Math.max(100, i.height * 3) || (0, __contentScope.Ee)(r, i) < Math.min(i.height, r.height) * 0.25)
        return -1 / 0;
      let a = (0, __contentScope.G)(e), o = 0;
      return (0, __contentScope.ye)(a) ? o += 9 : __contentScope.M.test(a) && (o += 4), e.contains(n) && (o += 5), r.width >= i.width * 3 && (o += 3), r.height <= i.height * 1.5 && (o += 3), o += Math.min(4, r.width / Math.max(1, i.width * 3)), o;
    }
    function frame_Oe(e, t) {
      let n = (0, __contentScope.V)(`[role="slider"], input[type="range"], [class], [id]`, e).slice(
        0,
        __contentScope.I
      ), r = [], i = t.parentElement;
      for (; i && i !== e.parentElement && (r.push(i), i !== e); ) i = i.parentElement;
      let a = (0, __contentScope.K)(/* @__PURE__ */ new Set([...n, ...r]), (n2) => (0, __contentScope.De)(n2, e, t))[0];
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
        return t.protocol !== `http:` && t.protocol !== `https:` ? void 0 : { value: t.href, kind: `url` };
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
        let t2 = e.currentSrc || e.src;
        t2 && (n = (0, __contentScope.Ae)(t2));
      } else {
        let t2 = (0, __contentScope.ke)(e);
        t2 && (n = (0, __contentScope.Ae)(t2));
      }
      return t?.imageSource.set(e, n), n;
    }
    function frame_je(e, t, n, r) {
      if (!(0, __contentScope.H)(e) || !t.contains(e) || e === r) return -1 / 0;
      let i = (0, __contentScope.U)(e), a = (0, __contentScope.U)(n);
      if (i.width < Math.max(110, (0, __contentScope.U)(r).width * 1.8) || i.height < 45 || i.width / Math.max(1, i.height) < 1.1 || i.top > a.bottom + 20)
        return -1 / 0;
      let o = (0, __contentScope.G)(e), s = 0;
      return __contentScope.R?.mode === `tencent-frame` && (e.matches(__contentScope.k.background) ? s += 12 : e.matches(__contentScope.k.backgroundImage) && (s += 9)), (e instanceof HTMLImageElement || e instanceof HTMLCanvasElement) && (s += 5), (0, __contentScope.q)(e) && (s += 5), __contentScope.N.test(o) && (s += 5), __contentScope.P.test(o) && (s -= 8), /logo|icon|avatar|btn|button|thumb/i.test(o) && (s -= 9), i.bottom <= a.top + 25 && (s += 4), s += Math.min(5, i.width * i.height / 2e4), s;
    }
    function frame_Me(e, t, n) {
      let r = (0, __contentScope.K)(
        (0, __contentScope.V)(__contentScope.ce, e).slice(0, __contentScope.I),
        (r2) => (0, __contentScope.je)(r2, e, t, n)
      )[0];
      return r && r.score >= 6 ? r.element : null;
    }
    function frame_Ne(e, t) {
      let n = (0, __contentScope.q)(t)?.value, r = (0, __contentScope.U)(t);
      return (0, __contentScope.V)(`img, canvas, [class], [id]`, e).slice(0, __contentScope.I).filter((e2) => e2 !== t).map((e2) => {
        let t2 = (0, __contentScope.q)(e2);
        if (!t2 || t2.value === n) return null;
        let i = (0, __contentScope.G)(e2);
        if (!__contentScope.N.test(i) || __contentScope.P.test(i) || /logo|icon|btn|button/i.test(i))
          return null;
        let a = (0, __contentScope.U)(e2), o = a.width || (e2 instanceof HTMLCanvasElement ? e2.width : 0) || (e2 instanceof HTMLImageElement ? e2.naturalWidth : 0), s = a.height || (e2 instanceof HTMLCanvasElement ? e2.height : 0) || (e2 instanceof HTMLImageElement ? e2.naturalHeight : 0);
        if (o < 80 || s < 40) return null;
        let c = o / s, l = r.width / Math.max(1, r.height), u = Math.abs(Math.log(c / l));
        if (u > 0.1) return null;
        let d = 8 - u * 20;
        return (e2 instanceof HTMLCanvasElement || e2 instanceof HTMLImageElement) && (d += 3), /full|original|complete|完整|原图/i.test(i) && (d += 2), { element: e2, score: d };
      }).filter((e2) => e2 != null).sort((e2, t2) => t2.score - e2.score)[0]?.element;
    }
    function frame_Pe(e, t) {
      return e.left < t.right && e.right > t.left && e.top < t.bottom && e.bottom > t.top;
    }
    function frame_Fe(e, t, n, r) {
      if (!(0, __contentScope.H)(e) || !t.contains(e) || e === n || e === r) return -1 / 0;
      let i = (0, __contentScope.U)(e), a = (0, __contentScope.U)(n);
      if (!(0, __contentScope.Pe)(i, a) || i.width < 8 || i.height < 8 || i.width > a.width * 1.08 || i.height > a.height * 1.15)
        return -1 / 0;
      let o = i.width / Math.max(1, i.height);
      if (o > 2.5 || o < 0.4) return -1 / 0;
      let s = (0, __contentScope.U)(r), c = Math.min(i.width, i.height), l = Math.max(i.width, i.height), u = Math.min(s.width, s.height);
      if (u >= 8 && c < u * 0.55 && l > u * 1.25) return -1 / 0;
      let d = (0, __contentScope.G)(e), f = 0;
      __contentScope.P.test(d) && (f += 11), (0, __contentScope.q)(e) && (f += 5), (e instanceof HTMLImageElement || e instanceof HTMLCanvasElement) && (f += 2), __contentScope.N.test(d) && !__contentScope.P.test(d) && (f -= 6), /logo|icon|avatar|btn|button|track|rail/i.test(d) && (f -= 10);
      let p = i.width / Math.max(1, a.width);
      return p >= 0.08 && p <= 0.55 ? f += 5 : p > 0.9 && (f -= 3), f;
    }
    function frame_Ie(e, t, n) {
      if ((0, __contentScope.B)() && n.matches(__contentScope.k.handle)) {
        let r2 = (0, __contentScope.V)(__contentScope.k.piece, e).filter(__contentScope.H);
        return r2.length === 1 && (0, __contentScope.Fe)(r2[0], e, t, n) >= 5 ? r2[0] : void 0;
      }
      let r = (0, __contentScope.K)(
        (0, __contentScope.V)(__contentScope.ce, e).slice(0, __contentScope.I),
        (r2) => (0, __contentScope.Fe)(r2, e, t, n)
      )[0];
      return r && r.score >= 5 ? r.element : void 0;
    }
    function frame_Le() {
      if (__contentScope.R?.geometryPanels) return __contentScope.R.geometryPanels;
      let e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set(), n = (0, __contentScope.V)(
        (0, __contentScope.B)() ? `${__contentScope.k.widgets}, ${__contentScope.fe}` : __contentScope.fe
      ).filter(__contentScope.H).slice(0, __contentScope.I);
      for (let r2 of n) {
        let n2 = r2;
        for (let r3 = 0; n2 && r3 < 8 && n2 !== document.body && n2 !== document.documentElement; r3 += 1, n2 = n2.parentElement) {
          if (t.has(n2)) continue;
          t.add(n2);
          let r4 = (0, __contentScope.U)(n2);
          if (r4.width < 160 || r4.width > 760 || r4.height < 110 || r4.height > 720 || !(0, __contentScope.H)(n2) || n2.closest(`pre, code, textarea, [contenteditable="true"]`))
            continue;
          let i = (0, __contentScope.Z)(n2);
          __contentScope.j.test(i) && __contentScope.F.test(i) && e.add(n2);
        }
      }
      let r = [...e].sort((e2, t2) => {
        let n2 = (0, __contentScope.U)(e2), r2 = (0, __contentScope.U)(t2);
        return n2.width * n2.height - r2.width * r2.height;
      }).slice(0, 12);
      return __contentScope.R && (__contentScope.R.geometryPanels = r), r;
    }
    function frame_Re(e, t, n = 3) {
      return t.left >= e.left - n && t.right <= e.right + n && t.top >= e.top - n && t.bottom <= e.bottom + n;
    }
    function frame_ze(e, t) {
      return Math.max(0, Math.min(window.innerWidth, e.right) - Math.max(0, e.left)) * Math.max(0, Math.min(window.innerHeight, e.bottom) - Math.max(0, e.top)) >= e.width * e.height * t;
    }
    function frame_Be(e, t) {
      if (!(0, __contentScope.H)(e)) return -1 / 0;
      let n = (0, __contentScope.U)(e);
      return n.width < 110 || n.height < 50 || n.width / n.height < 1.1 || n.width / n.height > 4.5 || !(0, __contentScope.Re)((0, __contentScope.U)(t), n) || !(0, __contentScope.ze)(n, 0.96) || !(e instanceof HTMLImageElement) && !(e instanceof HTMLCanvasElement) && !(0, __contentScope.ke)(e) ? -1 / 0 : 8 + Math.min(5, n.width * n.height / 2e4) + (__contentScope.N.test((0, __contentScope.G)(e)) ? 3 : 0);
    }
    function frame_Ve(e, t, n) {
      if (!(e instanceof HTMLElement) || e === t || e.contains(t) || t.contains(e) || !(0, __contentScope.H)(e))
        return -1 / 0;
      let r = (0, __contentScope.U)(e), i = (0, __contentScope.U)(t), a = r.top - i.bottom;
      return r.height < 12 || r.height > 90 || r.width < r.height * 3 || r.width < i.width * 0.75 || r.width > i.width * 1.25 || a < -4 || a > Math.max(64, i.height * 0.35) || Math.abs(r.left - i.left) > Math.max(24, i.width * 0.12) || !(0, __contentScope.Re)((0, __contentScope.U)(n), r) || !(0, __contentScope.ze)(r, 0.98) ? -1 / 0 : 8 + ((0, __contentScope.ye)((0, __contentScope.G)(e)) ? 3 : 0) + 4 * (1 - Math.min(1, Math.abs(r.width - i.width) / i.width));
    }
    function frame_He(e, t) {
      if (!(e instanceof HTMLElement) || e === t || !t.contains(e) || !(0, __contentScope.H)(e) || e.matches(`input, select, textarea, :disabled`) || e.closest(`[inert], [aria-disabled="true"], [aria-hidden="true"], [disabled]`))
        return -1 / 0;
      let n = (0, __contentScope.U)(e), r = (0, __contentScope.U)(t);
      if (n.width < 20 || n.width > 110 || n.height < 18 || n.height > 96 || n.width / n.height < 0.45 || n.width / n.height > 2.6 || r.width < n.width * 2.7 || n.height < r.height * 0.55 || n.height > r.height * 1.5 || n.left < r.left - 3 || n.right > r.right + 3 || (0, __contentScope.Ee)(n, r) < Math.min(n.height, r.height) * 0.65 || !(0, __contentScope.ze)(n, 0.98))
        return -1 / 0;
      let i = (0, __contentScope.G)(e);
      if (__contentScope.pe.test(i)) return -1 / 0;
      let a = window.getComputedStyle(e);
      if (a.pointerEvents === `none`) return -1 / 0;
      let o = e.matches((0, __contentScope.ve)()) || __contentScope.le.test(i) || e.matches(`button, [role="button"]`) || /^(?:grab|grabbing|pointer|move|ew-resize)$/.test(a.cursor), s = a.boxShadow !== `none` && a.boxShadow !== `` || Number.parseFloat(a.borderLeftWidth) > 0 || !!a.backgroundColor && !/^(?:transparent|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\))$/.test(a.backgroundColor);
      if (!o && !s) return -1 / 0;
      let c = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
      return !c || !(c === e || e.contains(c)) ? -1 / 0 : 8 + (o ? 6 : 0) + 4 * (1 - Math.min(1, Math.abs(n.height - r.height) / r.height)) + +(n.left - r.left < r.width * 0.35);
    }
    function frame_Ue() {
      for (let e of (0, __contentScope.Le)()) {
        let t = (0, __contentScope.V)(`*`, e).slice(0, __contentScope.I), n = (0, __contentScope.K)(t, (t2) => (0, __contentScope.Be)(t2, e)).slice(0, 4), r;
        for (let { element: i, score: a } of n) {
          let n2 = (0, __contentScope.K)(t, (t2) => (0, __contentScope.Ve)(t2, i, e)).slice(0, 6);
          for (let { element: o, score: s } of n2) {
            let n3 = (0, __contentScope.K)(t, (e2) => (0, __contentScope.He)(e2, o))[0];
            if (!n3 || !(n3.element instanceof HTMLElement)) continue;
            let c = a + s + n3.score;
            (!r || c > r.score) && (r = {
              score: c,
              match: {
                panel: e,
                background: i,
                track: o,
                handle: n3.element,
                detectionMethod: `panel-geometry`
              }
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
        if (t < 9 || !(0, __contentScope.xe)(e) && t < 14) continue;
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
            handle: e
          };
      }
      return (0, __contentScope.Ue)();
    }
    function frame_J(e = `page`) {
      return (0, __contentScope.z)(__contentScope.We, e);
    }
    function frame_Y(e) {
      let t = e ?? document, n = (0, __contentScope._e)();
      return e?.matches(n) && (0, __contentScope.H)(e) || (0, __contentScope.V)(n, t).some(__contentScope.H) ? true : !e || !(0, __contentScope.H)(e) ? false : [`data-state`, `data-status`, `aria-checked`].some(
        (t2) => /^(?:verified|success|passed|complete|completed|true)$/i.test(
          e.getAttribute(t2)?.trim() ?? ``
        )
      );
    }
    function frame_Ge(e) {
      let t = 2166136261, n = Math.max(1, Math.floor(e.length / 256));
      for (let r = 0; r < e.length; r += n) t ^= e.charCodeAt(r), t = Math.imul(t, 16777619);
      return t ^= e.length, (t >>> 0).toString(36);
    }
    function frame_Ke(e) {
      if (!e) return ``;
      let t = [
        e.getAttribute(`style`) ?? ``,
        e.getAttribute(`data-id`) ?? ``,
        e.getAttribute(`data-key`) ?? ``,
        e.getAttribute(`data-index`) ?? ``,
        e.getAttribute(`srcset`) ?? ``
      ];
      e instanceof HTMLCanvasElement && t.push(`${e.width}x${e.height}`), e instanceof HTMLImageElement && t.push(`${e.naturalWidth}x${e.naturalHeight}`);
      try {
        let n = window.getComputedStyle(e);
        t.push(n.backgroundPosition, n.backgroundSize);
      } catch {
      }
      return t.filter(Boolean).join(`~`);
    }
    function frame_qe(e, t, n, r) {
      let i = (0, __contentScope.U)(e.background), a = e.piece ? (0, __contentScope.U)(e.piece) : void 0;
      return (0, __contentScope.Ge)(
        [
          t?.value ?? (0, __contentScope.G)(e.background),
          r?.value ?? ``,
          n?.value ?? (e.piece ? (0, __contentScope.G)(e.piece) : ``),
          `${i.width.toFixed(1)}x${i.height.toFixed(1)}`,
          a ? `${a.width.toFixed(1)}x${a.height.toFixed(1)}` : `no-piece`,
          t ? `` : (0, __contentScope.Ke)(e.background),
          n ? `` : (0, __contentScope.Ke)(e.piece)
        ].join(`|`)
      );
    }
    function frame_Je(e) {
      let t = (0, __contentScope.U)(e);
      return t.left < 4 || t.top < 4 || t.right > window.innerWidth - 4 || t.bottom > window.innerHeight - 4;
    }
    function frame_Ze(e) {
      return [e.panel, e.background, e.piece, e.track, e.handle].filter((e2) => e2 != null).flatMap((e2) => {
        let t = (0, __contentScope.U)(e2);
        return [t.x, t.y, t.width, t.height];
      });
    }
    function frame_Qe(e, t, n = 1.5) {
      return e.length === t.length && e.every((e2, r) => Math.abs(e2 - t[r]) <= n);
    }
    function frame_$e(e) {
      return [e.background, e.piece].every(
        (e2) => e2 instanceof HTMLImageElement ? e2.complete && e2.naturalWidth > 0 && e2.naturalHeight > 0 : e2 instanceof HTMLCanvasElement ? e2.width > 0 && e2.height > 0 : true
      );
    }
    async function frame_et(e = 1500, t = () => true, n = `page`) {
      let r = Date.now() + e;
      if (!t()) return null;
      let i = (0, __contentScope.J)(n);
      for (; !i && Date.now() < r && t(); )
        await (0, __contentScope.Xe)(Math.min(120, Math.max(0, r - Date.now()))), i = (0, __contentScope.J)(n);
      return t() ? i : null;
    }
    function frame_tt() {
      return __contentScope.X;
    }
    function frame_nt(e) {
      return (0, __contentScope.z)(() => {
        let e2 = (0, __contentScope.Ce)().filter(
          (e3) => (0, __contentScope.Se)(e3) >= 9 && (0, __contentScope.xe)(e3)
        );
        if (!e2.length) return `当前验证码文档未找到可接收拖动的滑块把手（可能仍在加载或被遮挡）`;
        let t = e2.map((e3) => ({ handle: e3, panel: (0, __contentScope.Te)(e3) })).filter((e3) => e3.panel != null);
        if (!t.length) return `已找到滑块把手，但尚未找到它所属的验证码面板`;
        let n = t.map(({ handle: e3, panel: t2 }) => ({
          handle: e3,
          panel: t2,
          track: (0, __contentScope.Oe)(t2, e3)
        })).filter((e3) => e3.track != null);
        return n.length ? n.some(({ handle: e3, panel: t2, track: n2 }) => (0, __contentScope.Me)(t2, n2, e3)) ? `验证码组件仍在重绘，尚未取得同一挑战的完整滑块控件` : `已找到滑块把手和轨道，但验证码背景图片尚未就绪` : `已找到验证码面板和把手，但没有匹配的滑动轨道`;
      }, e);
    }
    async function frame_rt(e = {}) {
      __contentScope.X = void 0;
      let t = e.mode ?? `page`, n = () => e.isActive?.() !== false && Date.now() < (e.deadline ?? 1 / 0), r = () => Math.max(0, Math.min(e.mountTimeoutMs ?? 1500, (e.deadline ?? 1 / 0) - Date.now())), i = await (0, __contentScope.et)(r(), n, t);
      if (!i || (0, __contentScope.Je)(i.panel) && (i.panel.scrollIntoView({
        block: `center`,
        inline: `center`,
        behavior: `auto`
      }), await (0, __contentScope.Ye)(t), i = await (0, __contentScope.et)(r(), n, t), !i))
        return __contentScope.X = n() ? (0, __contentScope.nt)(t) : `本轮滑块任务已停止或超过时限`, null;
      let a = Math.min(
        e.deadline ?? 1 / 0,
        Date.now() + Math.max(2500, Math.min(e.mountTimeoutMs ?? 0, 6e3))
      ), o = (0, __contentScope.Ze)(i), s = 0;
      for (; Date.now() < a && n(); ) {
        await (0, __contentScope.Xe)(50);
        let e2 = (0, __contentScope.J)(t);
        if (!e2) {
          s = 0;
          continue;
        }
        let n2 = (0, __contentScope.Ze)(e2);
        if ((0, __contentScope.$e)(e2) && (0, __contentScope.Qe)(o, n2) ? s += 1 : s = 0, o = n2, i = e2, s >= 2)
          break;
      }
      if (s < 2 || !n())
        return __contentScope.X = n() ? (0, __contentScope.$e)(i) ? `验证码布局在等待时间内没有稳定，未使用动画中的坐标拖动` : `验证码图片还没有加载完成，未执行拖动` : `本轮滑块任务已停止或超过时限`, null;
      let c = (0, __contentScope.q)(i.background), l = i.detectionMethod === `panel-geometry` ? void 0 : (0, __contentScope.Ne)(i.panel, i.background), u = l ? (0, __contentScope.q)(l) : void 0, d = i.piece ? (0, __contentScope.q)(i.piece) : void 0, f = t === `tencent-frame` && i.handle.matches(__contentScope.k.handle), p = i.handle.getAttribute(__contentScope.L), m = `p-slider-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      i.handle.setAttribute(__contentScope.L, m);
      let h = false;
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
          challengeKey: (0, __contentScope.qe)(i, c, d, u)
        },
        match: i,
        releaseHandleMarker: () => {
          h || (h = true, i.handle.getAttribute(__contentScope.L) === m && (p == null ? i.handle.removeAttribute(__contentScope.L) : i.handle.setAttribute(__contentScope.L, p)));
        }
      };
    }
    function frame_Z(e) {
      let t = (e ? [e] : (0, __contentScope.V)((0, __contentScope.ge)())).filter(__contentScope.H), n = t.filter((e2) => !t.some((t2) => t2 !== e2 && t2.contains(e2))), r = [], i = 0, a = 0;
      for (let e2 of n) {
        let t2 = document.createTreeWalker(e2, NodeFilter.SHOW_TEXT), n2;
        for (; (n2 = t2.nextNode()) && a < __contentScope.I && i < 1500; ) {
          a += 1;
          let e3 = n2.textContent ?? ``;
          e3.trim() && n2.parentElement && (0, __contentScope.H)(n2.parentElement) && (r.push(e3), i += e3.length);
        }
        if (a >= __contentScope.I || i >= 1500) break;
      }
      return r.join(` `).replace(/\s+/g, ` `).trim().slice(0, 1500);
    }
    function frame_Q(e, t = `page`) {
      return (0, __contentScope.z)(() => {
        let n = (0, __contentScope.We)();
        if (!n) {
          let n2 = [
            ...(0, __contentScope.V)((0, __contentScope.ge)()).filter(__contentScope.H),
            ...(0, __contentScope.Le)()
          ], r2 = e && (0, __contentScope.H)(e) ? e : void 0;
          if (t === `page`) {
            let e2 = r2 ?? n2[0];
            return {
              visible: n2.length > 0,
              success: (0, __contentScope.Y)(e2) || (0, __contentScope.Y)(),
              panel: e2,
              statusText: (0, __contentScope.Z)(e2)
            };
          }
          let i2 = [...new Set(n2)].filter((e2) => !n2.some((t2) => t2 !== e2 && t2.contains(e2))), a2 = i2.find(
            (e2) => !(0, __contentScope.Y)(e2) && (!r2 || !r2.contains(e2) && !e2.contains(r2))
          ) ?? r2 ?? i2[0];
          return {
            visible: n2.length > 0 || a2 != null,
            success: a2 != null && (0, __contentScope.Y)(a2),
            panel: a2,
            statusText: (0, __contentScope.Z)(a2)
          };
        }
        let r = (0, __contentScope.q)(n.background), i = n.detectionMethod === `panel-geometry` ? void 0 : (0, __contentScope.Ne)(n.panel, n.background), a = i ? (0, __contentScope.q)(i) : void 0, o = n.piece ? (0, __contentScope.q)(n.piece) : void 0, s = (0, __contentScope.U)(n.handle), c = (0, __contentScope.U)(n.track);
        return {
          visible: true,
          success: (0, __contentScope.Y)(n.panel) || t === `page` && (0, __contentScope.Y)(),
          panel: n.panel,
          challengeKey: (0, __contentScope.qe)(n, r, o, a),
          handleX: s.x,
          pieceX: n.piece ? (0, __contentScope.U)(n.piece).x : void 0,
          handleOffsetX: s.x - c.x,
          handleRange: c.width - s.width,
          statusText: (0, __contentScope.Z)(n.panel)
        };
      }, t);
    }
    function frame_pt(e, t) {
      let n = e.handleOffsetX, r = t.handleOffsetX;
      if (n == null || r == null) return null;
      let i = t.handleRange ?? e.handleRange;
      return !i || i < 20 ? null : Math.abs(r - n) < i * 0.05 ? `failed` : null;
    }
    function frame_mt(e, t) {
      return (t.match(new RegExp(e.source, `gi`)) ?? []).map((e2) => e2.toLowerCase());
    }
    function frame_ht(e, t, n) {
      let r = new Set((0, __contentScope.mt)(e, t));
      return (0, __contentScope.mt)(e, n).filter((e2) => !r.has(e2));
    }
    function frame_gt(e, t, n) {
      if (t.success || (0, __contentScope.ht)(__contentScope.it, n, t.statusText).length > 0)
        return `success`;
      if (e.challengeKey && t.challengeKey && e.challengeKey !== t.challengeKey) return `refreshed`;
      for (let e2 of [`too-short`, `too-far`, `failed`])
        if ((0, __contentScope.ht)(__contentScope.ft[e2], n, t.statusText).length > 0) return e2;
      return null;
    }
    async function frame__t(e, t = 5500, n = `page`) {
      let r = Date.now() + t, i = (0, __contentScope.Q)(e.panel, n), a = e, o, s, c;
      for (; ; ) {
        let t2 = Date.now(), l = (0, __contentScope.gt)(e, i, a.statusText);
        if (l === `success`) return { kind: l, state: i, evidence: `status` };
        if (l === `refreshed`) return { kind: l, state: i, evidence: `refresh` };
        if ((l === `failed` || l === `too-short` || l === `too-far`) && (o = {
          kind: l,
          since: t2,
          phrases: (0, __contentScope.ht)(__contentScope.ft[l], a.statusText, i.statusText)
        }), !i.visible && e.visible) {
          if (s ??= t2, t2 - s >= __contentScope.dt)
            return o ? { kind: o.kind, state: i, evidence: `status` } : { kind: `success`, state: i, evidence: `disappearance` };
        } else {
          if (s = void 0, o) {
            let e2 = (0, __contentScope.mt)(__contentScope.ft[o.kind], i.statusText);
            o.phrases.some((t3) => e2.includes(t3)) || (o = void 0);
          }
          if (o && t2 - o.since >= __contentScope.ut)
            return { kind: o.kind, state: i, evidence: `status` };
        }
        if (i.visible && (0, __contentScope.pt)(e, i) === `failed` ? c ??= t2 : c = void 0, t2 >= r)
          return c != null && t2 - c >= __contentScope.ut ? { kind: `failed`, state: i, evidence: `geometry` } : { kind: `unchanged`, state: i };
        a = i, await (0, __contentScope.g)(Math.min(220, Math.max(0, r - Date.now()))), i = (0, __contentScope.Q)(i.panel ?? e.panel, n);
      }
    }
    function frame_vt(e, t) {
      if (!(e instanceof HTMLElement) || !(0, __contentScope.H)(e)) return -1 / 0;
      let n = [
        e.id,
        e.className,
        e.getAttribute(`aria-label`),
        e.getAttribute(`title`),
        e.textContent
      ].filter(Boolean).join(` `);
      if (!__contentScope.ct.test(n) || __contentScope.lt.test(n)) return -1 / 0;
      let r = e.getBoundingClientRect(), i = 0;
      return t !== `page` && e.matches(__contentScope.k.refresh) && (i += 10), e.matches(`button, [role="button"], a`) && (i += 4), /refresh|reload|刷新|换一张/i.test(n) && (i += 6), r.width <= 100 && r.height <= 80 && (i += 2), i;
    }
    async function frame_yt(e = `page`) {
      let t = (0, __contentScope.J)(e);
      if (!t && e === `page`) return false;
      let n = [
        ...t?.panel.querySelectorAll(`button, [role="button"], a, [class], [id]`) ?? [],
        ...e === `page` ? [] : document.querySelectorAll(__contentScope.k.refresh)
      ].sort((t2, n2) => (0, __contentScope.vt)(n2, e) - (0, __contentScope.vt)(t2, e))[0];
      if (!(n instanceof HTMLElement) || (0, __contentScope.vt)(n, e) < 4) return false;
      try {
        return await (0, __contentScope.E)(n), true;
      } catch {
        return false;
      }
    }
    async function frame_bt(e, t = 3500, n = `page`) {
      let r = Date.now() + t;
      for (; Date.now() < r; ) {
        let t2 = (0, __contentScope.Q)(void 0, n);
        if (!t2.visible || e && t2.challengeKey && t2.challengeKey !== e) return true;
        await (0, __contentScope.g)(180);
      }
      return false;
    }
    function frame_xt(e, t, n) {
      let r = Math.min(3, Math.max(1, n * 8e-3)), i = Math.min(10, Math.max(3, n * 0.04)), a = e;
      return t === `too-short` ? a += r : t === `too-far` ? a -= r : a = 0, Math.max(-i, Math.min(i, Math.round(a * 10) / 10));
    }
    function frame_wt(e) {
      switch (e.kind) {
        case `too-short`:
          return `页面反馈拖动偏短`;
        case `too-far`:
          return `页面反馈拖动偏长`;
        case `failed`:
          return e.evidence === `geometry` ? `滑块把手持续停在起点，等待结束后仍未收到通过确认` : `页面显示本轮验证失败提示`;
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
      return (t.join(`:`) || e).split(`+`).map((e2) => __contentScope.Et[e2] ?? e2).join(`+`);
    }
    function frame_Ot(e) {
      let t = e.diagnostics, n = t ? `，取图=${__contentScope.Tt[t.source] ?? t.source}，图像距离=${t.imageDistance}px` + (t.measuredRatio == null ? `，行程比=${t.conversionRatio.toFixed(3)}` : `，实测行程比=${t.measuredRatio.toFixed(3)}`) + (t.probeDistance == null ? `` : `，探测位移=${t.probeDistance}px`) + `，修正=${t.correctionPx}px` + (t.cropOffsetX ? `，亚像素补偿=${t.cropOffsetX}px` : ``) + (t.rivalCount ? `，另有 ${t.rivalCount} 个疑似缺口` : ``) : ``;
      return `方法=${(0, __contentScope.Dt)(e.method)}，缺口=${e.gapX ?? `N/A`}px，拖动=${e.distance ?? `N/A`}px，置信度=${e.confidence?.toFixed(3) ?? `N/A`}${n}`;
    }
    async function frame_kt(e, t) {
      let r = (0, __contentScope.d)();
      if (!r)
        return e.push(`滑块求解：没有活跃签到任务，停止自动拖动`), { solved: false, error: `没有活跃签到任务` };
      let i = t.frameSessionId, a = i ? `tencent-frame` : t.domMode ?? `page`, o = Math.min(t.deadline ?? 1 / 0, Date.now() + __contentScope.Ct), s = () => (0, __contentScope.d)() === r && (!i || (0, __contentScope.f)() === i), c = 0, l, u = `滑块没有返回可确认的结果`, p = false, m = [], h, _ = 0;
      for (let t2 = 1; t2 <= __contentScope.St; t2 += 1) {
        if (!s() || Date.now() >= o) {
          u = s() ? `滑块求解超过总时限` : `本轮滑块任务已停止`;
          break;
        }
        let d = await (0, __contentScope.rt)(
          i ? { mode: a, mountTimeoutMs: 6e3, deadline: o, isActive: s } : { mode: a }
        );
        if (!d) {
          let t3 = (0, __contentScope.Q)(void 0, a);
          if (s() && t3.success)
            return e.push(`页面已显示滑块通过状态`), { solved: true, method: `dom-feedback` };
          u = (0, __contentScope.tt)() ?? (t3.visible ? `没有找到同时满足把手、轨道和背景几何关系的滑块控件` : `检测到滑动挑战，但页面没有暴露可安全拖动的 DOM 控件`), e.push(u);
          break;
        }
        let { info: f, match: v, releaseHandleMarker: y } = d;
        if (!s() || i && Date.now() >= o) {
          y(), u = `本轮滑块任务已停止或超过时限`;
          break;
        }
        v.detectionMethod === `panel-geometry` && !p && (e.push(
          `标准滑块控件匹配未命中，已通过当前验证码弹窗内的图片、轨道和把手布局定位，继续截图识别`
        ), p = true);
        let b = (0, __contentScope.Q)(v.panel, a);
        if (i && b.success)
          return y(), e.push(`当前验证码面板已显示通过状态，未重复拖动`), { solved: true, method: `dom-feedback` };
        c !== 0 && l && b.challengeKey && b.challengeKey !== l && (c = 0, l = void 0), m.length && h && b.challengeKey && b.challengeKey !== h && (m = [], h = void 0);
        let x = f.pieceRect ? `${f.pieceRect.width}×${f.pieceRect.height}` : `未直接暴露`;
        e.push(
          `滑块第 ${t2}/${__contentScope.St} 次：背景 ${f.backgroundRect.width}×${f.backgroundRect.height}，拼图块 ${x}，轨道行程 ${(f.trackRect.width - f.handleRect.width).toFixed(1)}px`
        );
        let S, C;
        try {
          let e2 = await (0, __contentScope.n)({
            type: `SLIDER_CRACK`,
            runId: r,
            ...i ? { frameSessionId: i } : {},
            slider: f,
            options: {
              attempt: t2,
              correctionPx: c,
              ...m.length ? { excludedGapX: [...m] } : {}
            }
          });
          e2.ok ? S = e2.feature?.slider : C = e2.error;
        } finally {
          y();
        }
        if (!s()) {
          u = `本轮滑块任务已停止`;
          break;
        }
        if (C) u = C, e.push(`滑块后台调用失败：${C}`);
        else if (!S) u = `后台没有返回滑块处理结果`, e.push(u);
        else if (S.solved) {
          e.push(`可信拖动已执行，等待页面验收：${(0, __contentScope.Ot)(S)}`);
          let t3 = await (0, __contentScope._t)(
            b,
            i ? Math.max(0, Math.min(5500, o - Date.now())) : 5500,
            a
          );
          if (e.push((0, __contentScope.wt)(t3)), t3.kind === `success`) {
            let e2 = !!i && t3.evidence === `disappearance`;
            return {
              solved: !e2,
              ...e2 ? { dismissed: true } : {},
              method: S.method,
              gapX: S.gapX,
              distance: S.distance
            };
          }
          if (u = (0, __contentScope.wt)(t3), t3.kind === `failed` && t3.evidence === `status` && S.gapX != null && !m.some((e2) => Math.abs(e2 - S.gapX) < 3) && (m.push(S.gapX), h = t3.state.challengeKey ?? b.challengeKey), c = (0, __contentScope.xt)(
            c,
            t3.kind,
            S.diagnostics?.handleRange ?? f.trackRect.width - f.handleRect.width
          ), t3.kind === `too-short` || t3.kind === `too-far`) {
            l = t3.state.challengeKey ?? b.challengeKey, await (0, __contentScope.g)(350);
            continue;
          }
          if (t3.kind === `refreshed`) {
            c = 0, l = void 0, m = [], h = void 0, await (0, __contentScope.g)(350);
            continue;
          }
        } else if (u = S.error ?? `滑块图像识别或拖动失败`, e.push(`滑块本次未执行：${u}${S.method ? `（${(0, __contentScope.Ot)(S)}）` : ``}`), S.errorCode === `match-ambiguous` && (_ += 1, _ >= 2)) {
          u = `这个滑块在同一张图上有多个疑似缺口，自动识别无法确定唯一目标`, e.push(`${u}，已停止自动尝试并交由人工完成`);
          break;
        }
        if (t2 >= __contentScope.St || !s() || i && Date.now() >= o) break;
        c = 0, l = void 0, m = [], h = void 0, await (0, __contentScope.yt)(a) ? (e.push(`已通过验证控件自身的刷新按钮请求新挑战`), await (0, __contentScope.bt)(b.challengeKey, 3500, a)) : await (0, __contentScope.bt)(b.challengeKey, 1600, a), await (0, __contentScope.g)(300);
      }
      return e.push(`滑块自动求解未通过页面确认：${u}`), { solved: false, error: u };
    }
    function frame_At(e, t) {
      if (__contentScope.$) return e.push(`滑块求解已经在执行，复用当前任务`), __contentScope.$;
      let n = (0, __contentScope.kt)(e, t).finally(() => {
        __contentScope.$ === n && (__contentScope.$ = null);
      });
      return __contentScope.$ = n, n;
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
        }
      },
      initializers: [
        {
          order: 9,
          run() {
            __contentState.k = {
              widgets: [
                `.tencent-captcha-dy__slider-groove`,
                `.tencent-captcha-dy__slider-block`,
                `.tencent-captcha-dy__verify-bg`
              ].join(`, `),
              success: [
                `.tencent-captcha-dy__slider-groove--success`,
                `.tencent-captcha-dy__slider-block--success`
              ].join(`, `),
              handle: `.tencent-captcha-dy__slider-block`,
              background: `.tencent-captcha-dy__verify-bg`,
              backgroundImage: `.tencent-captcha-dy__verify-bg-img`,
              piece: `.tencent-captcha-dy__fg-item`,
              refresh: `.tencent-captcha-dy__footer-icon--refresh`
            };
          }
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
              `[class*="slide-verify" i]`
            ].join(`, `);
          }
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
              `[class*="verify" i][data-state="success" i]`
            ].join(`, `);
          }
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
              `[class*="move" i][class*="btn" i]`
            ].join(`, `);
          }
        },
        {
          order: 13,
          run() {
            __contentState.ce = `img, canvas, [class], [id]`;
          }
        },
        {
          order: 14,
          run() {
            __contentState.j = /captcha|challenge|verify|verification|puzzle|jigsaw|geetest|yidun|human|robot|验证码|验证|拼图|人机|安全校验/i;
          }
        },
        {
          order: 15,
          run() {
            __contentState.M = /slider|slide|drag|swipe|move|track|rail|thumb|knob|handle|滑块|滑动|拖动|向右滑/i;
          }
        },
        {
          order: 16,
          run() {
            __contentState.le = /(?:slider|slide|drag|move)[-_\s]*(?:btn|button|handle|knob|thumb)|(?:btn|button|handle|knob|thumb)[-_\s]*(?:slider|slide|drag|move)|滑块|拖动|滑动/i;
          }
        },
        {
          order: 17,
          run() {
            __contentState.ue = /carousel|swiper|gallery|volume|seek|range|price|filter|toggle|switch|轮播|音量|价格|筛选/i;
          }
        },
        {
          order: 18,
          run() {
            __contentState.N = /background|(?:^|[-_\s])bg(?:$|[-_\s])|canvas|content|image|(?:^|[-_\s])img(?:$|[-_\s])/i;
          }
        },
        {
          order: 19,
          run() {
            __contentState.P = /piece|slice|template|block|puzzle|jigsaw|move[-_\s]*img|slider[-_\s]*img|拼图|缺块/i;
          }
        },
        {
          order: 20,
          run() {
            __contentState.de = /track|rail|bar|slider[-_\s]*move|slide[-_\s]*track|drag[-_\s]*track|滑轨|拖动条/i;
          }
        },
        {
          order: 21,
          run() {
            __contentState.F = /drag|slide|swipe|move|complete.{0,12}(?:puzzle|verification)|拖动|滑动|按住|完成拼图|向右滑/i;
          }
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
              `[style*="background" i]`
            ].join(`, `);
          }
        },
        {
          order: 23,
          run() {
            __contentState.pe = /refresh|reload|close|cancel|reset|help|(?:^|[-_\s])info(?:$|[-_\s])|刷新|换一张|关闭|取消|帮助|说明/i;
          }
        },
        {
          order: 24,
          run() {
            __contentState.I = 1200;
          }
        },
        {
          order: 25,
          run() {
            __contentState.me = 8388608;
          }
        },
        {
          order: 26,
          run() {
            __contentState.L = `data-aah-pointer-target`;
          }
        },
        {
          order: 27,
          run() {
            __contentState.Ye = (e) => new Promise((t) => {
              let n = e === `tencent-frame` ? setTimeout(t, 250) : void 0;
              requestAnimationFrame(
                () => requestAnimationFrame(() => {
                  n !== void 0 && clearTimeout(n), t();
                })
              );
            });
          }
        },
        {
          order: 28,
          run() {
            __contentState.Xe = (e) => new Promise((t) => setTimeout(t, e));
          }
        },
        {
          order: 29,
          run() {
            __contentState.it = /\b(?:verified|verification successful|success|passed)\b|验证\s*成功|校验\s*成功|验证\s*通过|已\s*通过/i;
          }
        },
        {
          order: 30,
          run() {
            __contentState.at = /too short|not far enough|move (?:a little )?further|偏左|距离过短|滑动不足|还差一点|未拖到位/i;
          }
        },
        {
          order: 31,
          run() {
            __contentState.ot = /too far|overshoot|move (?:a little )?back|偏右|距离过长|滑过头|拖过头/i;
          }
        },
        {
          order: 32,
          run() {
            __contentState.st = /failed|failure|incorrect|try again|retry|error|验证失败|校验失败|请重试|重新尝试|再试一次/i;
          }
        },
        {
          order: 33,
          run() {
            __contentState.ct = /refresh|reload|retry|try again|change image|next image|刷新|换一张|重试|重新加载/i;
          }
        },
        {
          order: 34,
          run() {
            __contentState.lt = /close|cancel|关闭|取消/i;
          }
        },
        {
          order: 35,
          run() {
            __contentState.ut = 900;
          }
        },
        {
          order: 36,
          run() {
            __contentState.dt = 1200;
          }
        },
        {
          order: 37,
          run() {
            __contentState.ft = {
              "too-short": __contentScope.at,
              "too-far": __contentScope.ot,
              failed: __contentScope.st
            };
          }
        },
        {
          order: 38,
          run() {
            __contentState.St = 5;
          }
        },
        {
          order: 39,
          run() {
            __contentState.Ct = 55e3;
          }
        },
        {
          order: 40,
          run() {
            __contentState.$ = null;
          }
        },
        {
          order: 41,
          run() {
            __contentState.Tt = {
              "raw-image": `原图`,
              "viewport-screenshot": `CDP 截图`
            };
          }
        },
        {
          order: 42,
          run() {
            __contentState.Et = {
              measured: `实测碎片`,
              "hole-silhouette": `形状吻合`,
              "outline-profile": `轮廓剖面`,
              "background-delta": `双图差分`,
              "contour-alpha": `轮廓(带形状)`,
              "contour-edge": `轮廓(矩形)`,
              opencv: `OpenCV 模板`,
              ncc: `JS 模板`,
              silhouette: `形状吻合`
            };
          }
        },
        {
          order: 43,
          run() {
            __contentState.Mt = (0, __contentScope.e)(() => {
              if (window === window.top || !(0, __contentScope.r)(location.href)) return;
              let e = globalThis;
              if (e.__aahSliderFrameInstalled) return;
              e.__aahSliderFrameInstalled = true;
              let t;
              chrome.runtime.onMessage.addListener((e2, n) => {
                n.id === chrome.runtime.id && e2?.type === `aah-slider-frame-stop` && e2.sessionId === t && (0, __contentScope.u)(null);
              }), window.addEventListener(`message`, (e2) => {
                let r = e2.data;
                if (e2.source !== window.parent || r?.type !== `aah-slider-frame-connect` || typeof r.sessionId != `string` || !/^sf-[a-z0-9-]{8,80}$/i.test(r.sessionId) || t)
                  return;
                let i = r.sessionId;
                t = i, (async () => {
                  let e3 = await (0, __contentScope.n)({
                    type: `SLIDER_FRAME_CONNECT`,
                    sessionId: i
                  });
                  if (!e3.ok) return;
                  let t2 = e3.feature?.sliderFrame;
                  if (!t2?.runId || !t2.deadline) return;
                  (0, __contentScope.u)(t2.runId, `trusted`, i);
                  let r2 = [], a = {
                    push(e4) {
                      r2.push(e4), (0, __contentScope.n)({
                        type: `SLIDER_FRAME_REPORT`,
                        sessionId: i,
                        steps: [...r2]
                      });
                    }
                  }, o;
                  try {
                    o = await (0, __contentScope.jt)(a, i, t2.deadline);
                  } catch (e4) {
                    o = {
                      solved: false,
                      error: e4 instanceof Error ? e4.message : String(e4)
                    };
                  }
                  await (0, __contentScope.n)({
                    type: `SLIDER_FRAME_REPORT`,
                    sessionId: i,
                    steps: [...r2],
                    result: o
                  });
                })().finally(() => {
                  t === i && ((0, __contentScope.u)(null), t = void 0);
                }).catch(() => void 0);
              });
            });
          }
        },
        {
          order: 44,
          run() {
            __contentState.Nt = {
              debug: (...e) => ([...e], void 0),
              log: (...e) => ([...e], void 0),
              warn: (...e) => ([...e], void 0),
              error: (...e) => ([...e], void 0)
            };
          }
        }
      ]
    };
  }

  // src/entries/slider-captcha-frame.js
  function createSliderCaptchaFrameRuntime() {
    const __contentScope = /* @__PURE__ */ Object.create(null);
    const modules = {
      shared: createSharedFrameContent(__contentScope),
      slider: createSliderFrameContent(__contentScope)
    };
    let initialized = false;
    return {
      scope: __contentScope,
      modules,
      initialize() {
        if (!initialized) {
          initializeContentModules(modules);
          initialized = true;
        }
        return this;
      },
      start() {
        this.initialize();
        return (() => {
          let e;
          try {
            e = __contentScope.Mt.main(), e instanceof Promise && (e = e.catch((e2) => {
              throw __contentScope.Nt.error(
                `The unlisted script "slider-frame" crashed on startup!`,
                e2
              ), e2;
            }));
          } catch (e2) {
            throw __contentScope.Nt.error(`The unlisted script "slider-frame" crashed on startup!`, e2), e2;
          }
          return e;
        })();
      }
    };
  }
  function startSliderCaptchaFrame() {
    return createSliderCaptchaFrameRuntime().start();
  }
  startSliderCaptchaFrame();
})();
