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
  function createSharedAutoContent(__contentScope) {
    const __contentState = bindContentState(__contentScope, [
      "e",
      "t",
      "n",
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
      "ee",
      "te",
      "ne",
      "w",
      "re",
      "ie",
      "T",
      "ae",
      "oe",
      "se",
      "ce",
      "le",
      "ue",
      "de",
      "fe",
      "pe",
      "me",
      "he",
      "ge",
      "_e",
      "ve",
      "ye",
      "be",
      "E",
      "D",
      "xe",
      "Se",
      "Ce",
      "we",
      "O",
      "k",
      "A",
      "Te",
      "Ee",
      "De",
      "Oe",
      "j",
      "ke",
      "Ae",
      "je",
      "Me",
      "M",
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
      "Ge",
      "Ke",
      "qe",
      "N",
      "Je",
      "Ye",
      "Xe",
      "Ze",
      "Qe",
      "$e",
      "P",
      "et",
      "I",
      "L",
      "R",
      "z",
      "V",
      "H",
      "Kg",
      "qg",
      "Jg",
      "Yg",
      "Xg",
      "Zg",
      "Qg",
      "$g"
    ]);
    function e(e2) {
      return e2;
    }
    function t(e2) {
      if (e2.type === `SLIDER_FRAME_PREPARE`) return 8e3;
      if (e2.type === `SLIDER_FRAME_CONNECT` || e2.type === `SLIDER_FRAME_REPORT` || e2.type === `SLIDER_FRAME_STATUS` || e2.type === `SLIDER_FRAME_CANCEL`)
        return 4e3;
      if (e2.type === `SCAN_LOCAL_PORTS`) {
        let t2 = e2.withExit === true ? 24e3 : 8e3;
        return e2.ports.length * t2 + 1e4;
      }
      return e2.type === `TEST_PROXY` ? 34e3 : 45e3;
    }
    function n(e2) {
      return new Promise((n2) => {
        let r = (0, __contentScope.t)(e2), i = false, a = (e3) => {
          i || (i = true, clearTimeout(o), n2(e3));
        }, o = setTimeout(() => {
          a({
            ok: false,
            error: `后台在 ${Math.round(r / 1e3)} 秒内没有响应 ${e2.type}（Service Worker 可能已被回收）`
          });
        }, r);
        try {
          chrome.runtime.sendMessage(e2, (e3) => {
            chrome.runtime.lastError ? a({
              ok: false,
              error: chrome.runtime.lastError.message ?? `unknown`
            }) : a(e3 ?? { ok: true });
          });
        } catch (e3) {
          a({ ok: false, error: e3 instanceof Error ? e3.message : String(e3) });
        }
      });
    }
    function p(e2) {
      return e2.checkin?.method === `workflow`;
    }
    function m(e2) {
      return Number.isFinite(e2) ? Math.min(1, Math.max(0, e2)) : 0.5;
    }
    function h(e2, t2) {
      return t2.kind === `inset-left` ? e2.left + Math.min(t2.px, e2.width / 2) : t2.kind === `relative` ? e2.left + e2.width * (0, __contentScope.m)(t2.rx) : e2.left + e2.width / 2;
    }
    function g(e2, t2) {
      return t2.kind === `relative` ? e2.top + e2.height * (0, __contentScope.m)(t2.ry) : e2.top + e2.height / 2;
    }
    function b(e2, t2 = `trusted`, n2) {
      __contentScope._ = e2, __contentScope.v = t2, __contentScope.y = e2 ? n2 : void 0;
    }
    function x() {
      return __contentScope._;
    }
    function S() {
      return __contentScope.y;
    }
    function C(e2, t2) {
      return Math.abs(e2.left - t2.left) > 1 || Math.abs(e2.top - t2.top) > 1 || Math.abs(e2.width - t2.width) > 1 || Math.abs(e2.height - t2.height) > 1;
    }
    function ee(e2) {
      if (e2 != null && Date.now() >= e2) throw Error(`点击已超过执行截止时间`);
    }
    async function ne(e2, t2) {
      let n2 = e2.getBoundingClientRect(), r = Math.min(Date.now() + 1200, t2 ?? 1 / 0), i = 0;
      for (; Date.now() < r; ) {
        await (0, __contentScope.w)(Math.min(__contentScope.te, Math.max(1, r - Date.now())));
        let t3 = e2.getBoundingClientRect();
        if ((0, __contentScope.C)(n2, t3) ? i = 0 : i += 1, n2 = t3, i >= 2) return t3;
      }
      throw (0, __contentScope.ee)(t2), Error(`目标控件位置仍在变化，无法可靠点击`);
    }
    function ue(e2) {
      if (e2.gesture !== void 0 && !__contentScope.ae.has(e2.gesture))
        throw Error(`未知手势 ${String(e2.gesture)}；只允许 click/double/right/long-press`);
      let t2 = e2.gesture ?? `click`, n2 = null;
      if (e2.key !== void 0) {
        if (!__contentScope.T.has(e2.key))
          throw Error(`key 只允许非打印功能键，收到 ${JSON.stringify(e2.key)}`);
        n2 = e2.key;
      }
      if (n2 != null && t2 !== `click`)
        throw Error(`key 触发与手势互斥：键盘触发不能再叠加 double/right/long-press`);
      let r = e2.anchor == null ? e2.insetLeftPx == null ? { kind: `center` } : { kind: `inset-left`, px: e2.insetLeftPx } : { kind: `relative`, rx: e2.anchor.rx, ry: e2.anchor.ry }, i = e2.holdMs != null && Number.isFinite(e2.holdMs) ? Math.max(0, Math.round(e2.holdMs)) : __contentScope.se;
      return { anchor: r, gesture: t2, key: n2, holdMs: i };
    }
    function pe(e2) {
      return e2.replace(__contentScope.fe, ``).replace(/\s+/g, ` `).trim();
    }
    function me(e2) {
      return (0, __contentScope.pe)(e2.innerText ?? e2.textContent ?? ``);
    }
    function he(e2, t2) {
      let n2 = (0, __contentScope.me)(e2).toLowerCase();
      if (!n2 || !t2.includes(n2)) return false;
      let r = (0, __contentScope.pe)(e2.textContent ?? ``).toLowerCase();
      if (r !== t2 || r === n2 || !e2.querySelector(`svg title, svg desc`)) return false;
      let i = e2.cloneNode(true);
      for (let e3 of i.querySelectorAll(`svg title, svg desc`)) e3.remove();
      return (0, __contentScope.pe)(i.textContent ?? ``).toLowerCase() === n2;
    }
    function ge(e2, t2 = document) {
      let n2 = e2.split(`>>`).map((e3) => e3.trim()), r = n2.find((e3) => e3.startsWith(`text=`));
      if (!r) return [];
      let i = (0, __contentScope.pe)(r.slice(5)).toLowerCase();
      if (!i) return [];
      let a = n2.filter((e3) => !e3.startsWith(`text=`)).join(` `).trim() || __contentScope.de, o;
      try {
        o = [...t2.querySelectorAll(a)];
      } catch {
        return [];
      }
      let s = (e3) => [
        (0, __contentScope.me)(e3),
        (0, __contentScope.pe)(e3.getAttribute(`aria-label`) ?? ``),
        (0, __contentScope.pe)(e3.getAttribute(`title`) ?? ``)
      ].find((e4) => e4 && e4.toLowerCase().includes(i)) ?? null, c = o.filter((e3) => (0, __contentScope.O)(e3)), l = c.map((e3) => ({ el: e3, text: s(e3) })).filter((e3) => e3.text !== null).sort(
        (e3, t3) => (0, __contentScope._e)(e3.el) - (0, __contentScope._e)(t3.el) || e3.text.length - t3.text.length
      );
      if (l.length) return l.map(({ el: e3 }) => e3);
      let u = c.filter((e3) => (0, __contentScope.he)(e3, i));
      return u.length === 1 ? [u[0]] : [];
    }
    function _e(e2) {
      if (e2.hasAttribute(`aria-expanded`)) return 1;
      let t2 = e2.getAttribute(`data-state`);
      return t2 === `open` || t2 === `closed` || e2.querySelector(`button, [role="button"], input[type="submit"]`) ? 1 : 0;
    }
    function ye(e2) {
      return e2.split(`>>>`).map((e3) => e3.trim()).filter(Boolean);
    }
    function be(e2, t2) {
      if (e2.includes(`text=`)) return (0, __contentScope.ge)(e2, t2);
      try {
        return [...t2.querySelectorAll(e2)];
      } catch {
        return [];
      }
    }
    function E(e2, t2 = document) {
      let n2 = (0, __contentScope.ye)(e2);
      if (n2.length === 0) return [];
      let r = t2;
      for (let t3 = 0; t3 < n2.length - 1; t3 += 1) {
        let i = (0, __contentScope.be)(n2[t3], r)[0];
        if (!i) return [];
        let a = i.shadowRoot;
        if (!a) {
          let r2 = n2[t3];
          throw new __contentScope.ve(
            `选择器「` + e2 + `」里的「` + r2 + `」是闭合的影子根，扩展读不到里面的内容`
          );
        }
        r = a;
      }
      return (0, __contentScope.be)(n2[n2.length - 1], r);
    }
    function D(e2) {
      for (let t2 of (0, __contentScope.we)(e2))
        try {
          for (let e3 of (0, __contentScope.E)(t2)) if ((0, __contentScope.O)(e3)) return e3;
        } catch (e3) {
          if (e3 instanceof __contentScope.ve) throw e3;
        }
      return null;
    }
    function xe(e2, t2 = document) {
      let n2 = /* @__PURE__ */ new Set();
      for (let r of (0, __contentScope.we)(e2))
        try {
          let e3 = (0, __contentScope.E)(r, t2).filter(__contentScope.O);
          for (let t3 of e3) n2.add(t3);
        } catch (e3) {
          if (e3 instanceof __contentScope.ve) throw e3;
        }
      return [...n2];
    }
    function Se(e2) {
      let t2 = e2.trimStart();
      return t2 ? t2.startsWith(`.`) || t2.startsWith(`#`) || t2.startsWith(`[`) || t2.startsWith(`:`) || t2.startsWith(`*`) ? true : /^[a-z][\w-]*\s*(?:[.#:]|\[|[>+~])/i.test(t2) : false;
    }
    function Ce(e2) {
      let t2 = e2.replace(/^,\s*/, ``);
      if (!t2) return false;
      if (t2.startsWith(`text=`)) return true;
      let n2 = t2.indexOf(`>>`);
      return n2 > 0 && t2.slice(n2 + 2).trimStart().startsWith(`text=`) ? !t2.slice(0, n2).includes(`,`) : (0, __contentScope.Se)(t2);
    }
    function we(e2) {
      let t2 = [], n2 = ``, r = false;
      for (let i = 0; i < e2.length; i++) {
        let a = e2.slice(i);
        !r && a.startsWith(`text=`) && (r = true), e2[i] === `,` && (!r || (0, __contentScope.Ce)(a)) ? (t2.push(n2.trim()), n2 = ``, r = false) : n2 += e2[i];
      }
      return n2.trim() && t2.push(n2.trim()), t2.filter(Boolean);
    }
    function O(e2) {
      let t2 = window.getComputedStyle(e2);
      if (t2.display === `none` || t2.visibility === `hidden` || t2.opacity === `0`) return false;
      let n2 = e2.getBoundingClientRect();
      return n2.width > 0 && n2.height > 0;
    }
    async function k(e2, t2 = 1e4, n2) {
      let r = Date.now() + Math.max(0, t2), i = (0, __contentScope.D)(e2);
      if (i) return i;
      if (t2 <= 0) return null;
      let a = Math.min(Number.isFinite(n2) && n2 > 0 ? n2 : __contentScope.re, __contentScope.re);
      for (; Date.now() < r; ) {
        await (0, __contentScope.w)(Math.min(a, Math.max(1, r - Date.now())));
        let t3 = (0, __contentScope.D)(e2);
        if (t3) return t3;
        a = Math.min(Math.round(a * 1.6) || __contentScope.re, __contentScope.ie);
      }
      return null;
    }
    function A(e2, t2) {
      let n2 = e2 instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, r = Object.getOwnPropertyDescriptor(n2, `value`)?.set;
      e2.focus(), r ? r.call(e2, t2) : e2.value = t2, e2.dispatchEvent(new Event(`input`, { bubbles: true })), e2.dispatchEvent(new Event(`change`, { bubbles: true }));
    }
    function Te(e2) {
      if (!(e2 instanceof HTMLElement)) return false;
      let t2 = e2.getAttribute(`contenteditable`);
      return t2 === `` || t2?.toLowerCase() === `true`;
    }
    function Ee(e2) {
      return e2 instanceof HTMLInputElement || e2 instanceof HTMLTextAreaElement || (0, __contentScope.Te)(e2);
    }
    function De(e2, t2) {
      e2 instanceof HTMLInputElement || e2 instanceof HTMLTextAreaElement ? (0, __contentScope.A)(e2, t2) : (e2.focus(), e2.textContent = t2, e2.dispatchEvent(new Event(`input`, { bubbles: true })), e2.dispatchEvent(new Event(`change`, { bubbles: true })));
    }
    function Oe(e2, t2, n2, r = 0, i = 0) {
      return {
        bubbles: true,
        cancelable: true,
        view: e2.ownerDocument?.defaultView ?? window,
        button: r,
        buttons: i,
        clientX: Math.round(t2),
        clientY: Math.round(n2)
      };
    }
    function j(e2, t2, n2, r, i = 0, a = 0) {
      let o = (0, __contentScope.Oe)(t2, n2, r, i, a);
      try {
        return new MouseEvent(e2, o);
      } catch {
        let { view: t3, ...n3 } = o;
        return new MouseEvent(e2, n3);
      }
    }
    function ke(e2, t2) {
      let n2 = __contentScope.oe[t2];
      if (!n2) throw Error(`key 只允许非打印功能键，收到 ${JSON.stringify(t2)}`);
      typeof e2.focus == `function` && e2.focus();
      let r = {
        bubbles: true,
        cancelable: true,
        key: n2.key,
        code: n2.code,
        keyCode: n2.keyCode,
        which: n2.keyCode
      };
      e2.dispatchEvent(new KeyboardEvent(`keydown`, r)), n2.keyCode === 13 && e2.dispatchEvent(new KeyboardEvent(`keypress`, r)), e2.dispatchEvent(new KeyboardEvent(`keyup`, r));
    }
    async function Ae(e2, t2, n2, r, i) {
      if (r === `double`) {
        for (let r2 = 0; r2 < 2; r2 += 1)
          e2.dispatchEvent((0, __contentScope.j)(`mousedown`, e2, t2, n2, 0, 1)), e2.dispatchEvent((0, __contentScope.j)(`mouseup`, e2, t2, n2, 0, 0)), typeof e2.click == `function` ? e2.click() : e2.dispatchEvent((0, __contentScope.j)(`click`, e2, t2, n2, 0, 0)), r2 === 0 && await (0, __contentScope.w)(__contentScope.ce);
        e2.dispatchEvent((0, __contentScope.j)(`dblclick`, e2, t2, n2, 0, 0));
      } else
        r === `right` ? (e2.dispatchEvent((0, __contentScope.j)(`mousedown`, e2, t2, n2, 2, 2)), e2.dispatchEvent((0, __contentScope.j)(`contextmenu`, e2, t2, n2, 2, 2)), e2.dispatchEvent((0, __contentScope.j)(`mouseup`, e2, t2, n2, 2, 0))) : r === `long-press` ? (e2.dispatchEvent((0, __contentScope.j)(`mousedown`, e2, t2, n2, 0, 1)), await (0, __contentScope.w)(i), e2.dispatchEvent((0, __contentScope.j)(`mouseup`, e2, t2, n2, 0, 0)), typeof e2.click == `function` ? e2.click() : e2.dispatchEvent((0, __contentScope.j)(`click`, e2, t2, n2, 0, 0))) : (0, __contentScope.Me)(e2);
    }
    function je(e2, t2) {
      let n2 = { bubbles: true, cancelable: true };
      try {
        return new MouseEvent(e2, {
          ...n2,
          view: t2.ownerDocument?.defaultView ?? window
        });
      } catch {
        return new MouseEvent(e2, n2);
      }
    }
    function Me(e2) {
      e2.dispatchEvent((0, __contentScope.je)(`mousedown`, e2)), e2.dispatchEvent((0, __contentScope.je)(`mouseup`, e2)), typeof e2.click == `function` ? e2.click() : e2.dispatchEvent((0, __contentScope.je)(`click`, e2));
    }
    async function M(e2, t2 = {}) {
      let r = __contentScope._, i = __contentScope.v === `dom` || !r || typeof chrome > `u` || !chrome.runtime?.id;
      if (i && t2.targetSeenAt != null && Number.isFinite(t2.targetSeenAt)) {
        let e3 = t2.targetSeenAt + 15e3 - Date.now();
        if (e3 > 0) {
          if (t2.deadline != null && Date.now() + e3 >= t2.deadline)
            throw Error(`验证控件安全窗口会超过执行截止时间，已取消点击`);
          await (0, __contentScope.w)(e3);
        }
      }
      (0, __contentScope.ee)(t2.deadline), e2.scrollIntoView({ block: `center`, inline: `center` });
      let a = await (0, __contentScope.ne)(e2, t2.deadline);
      if ((0, __contentScope.ee)(t2.deadline), a.width <= 0 || a.height <= 0)
        throw Error(`目标控件当前不可见，无法点击`);
      let o = a.top + a.height / 2, s = a.left + a.width / 2;
      if (o < 0 || o > window.innerHeight || s < 0 || s > window.innerWidth)
        throw Error(
          `目标控件在视口之外（滚动后位置 ${Math.round(a.left)},${Math.round(a.top)} 超出视口 ${window.innerWidth}x${window.innerHeight}），已取消点击以免点到其它元素`
        );
      let { anchor: c, gesture: l, key: u, holdMs: d } = (0, __contentScope.ue)(t2), f = (e3) => e3 !== `click`, p2 = Math.min(window.innerWidth - 1, Math.max(1, (0, __contentScope.h)(a, c))), m2 = Math.min(window.innerHeight - 1, Math.max(1, (0, __contentScope.g)(a, c)));
      if (t2.debugVisualize) {
        let e3 = document.createElement(`div`);
        e3.style.cssText = `
      position: fixed;
      left: ${p2}px;
      top: ${m2}px;
      width: 20px;
      height: 20px;
      margin: -10px 0 0 -10px;
      background: red;
      border: 3px solid yellow;
      border-radius: 50%;
      z-index: 999999;
      pointer-events: none;
      box-shadow: 0 0 10px rgba(255,0,0,0.8);
    `, document.body.appendChild(e3);
        try {
          if (t2.deadline != null && Date.now() + 2e3 >= t2.deadline)
            throw Error(`调试标记等待会超过执行截止时间，已取消点击`);
          await (0, __contentScope.w)(2e3);
        } finally {
          e3.remove();
        }
        (0, __contentScope.ee)(t2.deadline);
      }
      let { hit: b2, blocked: x2 } = (0, __contentScope.Ke)(e2, p2, m2);
      if (x2) throw Error(`目标控件被 ${b2 ? (0, __contentScope.N)(b2) : `未知元素`} 遮挡`);
      if (i)
        return (0, __contentScope.ee)(t2.deadline), u == null ? l === `click` ? ((0, __contentScope.Me)(e2), `dom`) : (await (0, __contentScope.Ae)(e2, p2, m2, l, d), `dom`) : ((0, __contentScope.ke)(e2, u), `dom`);
      if (u != null) return (0, __contentScope.ee)(t2.deadline), (0, __contentScope.ke)(e2, u), `dom`;
      if (l !== `click` && !f(l))
        throw Error(
          `${(0, __contentScope.Ne)(l)}需要浏览器级指针通道，当前页面没有可信指针接线，已取消执行（不降级为普通单击）`
        );
      let S2 = `data-aah-pointer-target`, C2 = e2.getAttribute(S2), te = `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      e2.setAttribute(S2, te);
      try {
        (0, __contentScope.ee)(t2.deadline);
        let e3 = await (0, __contentScope.n)({
          type: `TRUSTED_POINTER_CLICK`,
          runId: r,
          ...__contentScope.y ? { frameSessionId: __contentScope.y } : {},
          x: p2,
          y: m2,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          targetToken: te,
          anchor: c,
          ...l === `click` ? {} : { gesture: l },
          ...l === `long-press` ? { holdMs: d } : {},
          ...u == null ? {} : { key: u },
          ...t2.targetSeenAt == null ? {} : { targetSeenAt: t2.targetSeenAt },
          ...t2.deadline == null ? {} : { deadline: t2.deadline }
        });
        if (!e3.ok) {
          if (t2.mayNavigate && t2.reconcileAfterLostResponse && (e3.error.includes(`没有响应 TRUSTED_POINTER_CLICK`) || e3.error.includes(`点击结果可能未知`)))
            return `trusted`;
          throw Error(`浏览器级鼠标点击失败：${e3.error}`);
        }
        if (e3.feature?.pointer?.mode !== `trusted`) {
          if (t2.mayNavigate) return `trusted`;
          throw Error(`浏览器级鼠标点击没有返回可信执行结果`);
        }
        let i2 = e3.feature.pointer;
        if (t2.onPointerResult?.(i2), i2.clickObserved === false) {
          if (t2.shadowTarget) return `trusted`;
          throw Error(`浏览器级鼠标事件未到达目标控件`);
        }
        if (i2.clickObserved == null && !t2.mayNavigate)
          throw Error(`无法确认目标控件收到浏览器级鼠标事件`);
        return `trusted`;
      } finally {
        e2.getAttribute(S2) === te && (C2 == null ? e2.removeAttribute(S2) : e2.setAttribute(S2, C2));
      }
    }
    function Ne(e2) {
      return e2 === `double` ? `双击` : e2 === `right` ? `右键` : e2 === `long-press` ? `长按` : `点击`;
    }
    function Pe(e2) {
      return e2 == null ? { kind: `center` } : { kind: `relative`, rx: e2.rx, ry: e2.ry };
    }
    function Fe(e2) {
      if (e2 == null) return 12;
      if (!Number.isInteger(e2) || e2 < 0 || e2 > 64) throw Error(`拖拽中间点数量必须是 0-64 的整数`);
      return e2;
    }
    function Ie(e2, t2) {
      if (!Number.isFinite(e2.x) || !Number.isFinite(e2.y))
        throw Error(`${t2}坐标不是有效数字，已取消拖拽`);
      if (e2.x < 0 || e2.y < 0 || e2.x > window.innerWidth || e2.y > window.innerHeight)
        throw Error(
          `${t2}在视口之外（${Math.round(e2.x)},${Math.round(e2.y)} 超出 ${window.innerWidth}x${window.innerHeight}），已取消拖拽以免点到其它元素`
        );
      return {
        x: Math.min(window.innerWidth - 1, Math.max(1, e2.x)),
        y: Math.min(window.innerHeight - 1, Math.max(1, e2.y))
      };
    }
    function Le(e2, t2, n2) {
      let { hit: r, blocked: i } = (0, __contentScope.Ke)(e2, t2.x, t2.y);
      if (i) throw Error(`${n2}被 ${r ? (0, __contentScope.N)(r) : `未知元素`} 遮挡`);
    }
    function Re(e2, t2, n2) {
      let r = Math.max(1, n2), i = [];
      for (let n3 = 1; n3 <= r; n3 += 1) {
        let a = n3 / r;
        i.push({
          x: e2.x + (t2.x - e2.x) * a,
          y: e2.y + (t2.y - e2.y) * a,
          delayMs: __contentScope.le
        });
      }
      return i;
    }
    function ze(e2, t2, n2, r) {
      return {
        bubbles: true,
        cancelable: true,
        composed: true,
        pointerId: 1,
        pointerType: `mouse`,
        isPrimary: true,
        buttons: r,
        button: r === 0 ? -1 : 0,
        clientX: Math.round(t2),
        clientY: Math.round(n2)
      };
    }
    function Be(e2, t2, n2, r, i) {
      let a = (0, __contentScope.ze)(t2, n2, r, i);
      try {
        return new PointerEvent(e2, a);
      } catch {
        return (0, __contentScope.j)(e2, t2, n2, r, 0, i);
      }
    }
    async function Ve(e2, t2, n2, r, i, a) {
      e2.dispatchEvent((0, __contentScope.Be)(`pointerdown`, e2, n2.x, n2.y, 1)), e2.dispatchEvent((0, __contentScope.j)(`mousedown`, e2, n2.x, n2.y, 0, 1));
      let o = Math.max(1, i);
      for (let i2 = 1; i2 <= o; i2 += 1) {
        (0, __contentScope.He)(a);
        let s = i2 / o, c = { x: n2.x + (r.x - n2.x) * s, y: n2.y + (r.y - n2.y) * s }, l = i2 === o ? t2 : e2;
        l.dispatchEvent((0, __contentScope.Be)(`pointermove`, l, c.x, c.y, 1)), l.dispatchEvent((0, __contentScope.j)(`mousemove`, l, c.x, c.y, 0, 1)), await (0, __contentScope.w)(__contentScope.le);
      }
      (0, __contentScope.He)(a), t2.dispatchEvent((0, __contentScope.Be)(`pointerup`, t2, r.x, r.y, 0)), t2.dispatchEvent((0, __contentScope.j)(`mouseup`, t2, r.x, r.y, 0, 0));
    }
    function He(e2) {
      if (e2 != null && Date.now() >= e2) throw Error(`拖拽已超过执行截止时间`);
    }
    async function Ue(e2, t2, r = {}) {
      let i = __contentScope._, a = __contentScope.v === `dom` || !i || typeof chrome > `u` || !chrome.runtime?.id;
      (0, __contentScope.He)(r.deadline), e2.scrollIntoView({ block: `center`, inline: `center` }), t2.scrollIntoView({ block: `nearest`, inline: `nearest` });
      let o = await (0, __contentScope.ne)(e2, r.deadline);
      (0, __contentScope.He)(r.deadline);
      let s = await (0, __contentScope.ne)(t2, r.deadline);
      if ((0, __contentScope.He)(r.deadline), o.width <= 0 || o.height <= 0)
        throw Error(`拖拽起点当前不可见，无法开始拖拽`);
      if (s.width <= 0 || s.height <= 0) throw Error(`拖拽终点当前不可见，无法完成拖拽`);
      let c = (0, __contentScope.Pe)(r.fromAnchor), l = (0, __contentScope.Pe)(r.toAnchor), u = { x: (0, __contentScope.h)(o, c), y: (0, __contentScope.g)(o, c) }, d = { x: (0, __contentScope.h)(s, l), y: (0, __contentScope.g)(s, l) }, f = (0, __contentScope.Ie)(u, `拖拽起点`), p2 = (0, __contentScope.Ie)(d, `拖拽终点`);
      (0, __contentScope.Le)(e2, f, `拖拽起点`), (0, __contentScope.Le)(t2, p2, `拖拽终点`);
      let m2 = (0, __contentScope.Fe)(r.steps);
      if (a) return await (0, __contentScope.Ve)(e2, t2, f, p2, m2, r.deadline), `dom`;
      let y = `data-aah-pointer-target`, b2 = e2.getAttribute(y), x2 = t2.getAttribute(y), S2 = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`, C2 = `p-from-${S2}`, ee2 = `p-to-${S2}`;
      e2.setAttribute(y, C2), t2.setAttribute(y, ee2);
      try {
        let e3 = (0, __contentScope.Re)(f, p2, m2), t3 = await (0, __contentScope.n)({
          type: `TRUSTED_POINTER_DRAG`,
          runId: i,
          startX: f.x,
          startY: f.y,
          points: e3,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          fromTargetToken: C2,
          toTargetToken: ee2,
          fromAnchor: c,
          toAnchor: l,
          ...r.deadline == null ? {} : { deadline: r.deadline }
        });
        if (!t3.ok) throw Error(`浏览器级拖拽失败：${t3.error}`);
        let a2 = t3.feature?.pointer;
        if (a2?.mode !== `trusted`) throw Error(`浏览器级拖拽没有返回可信执行结果`);
        if (a2.drag == null) throw Error(`浏览器级拖拽未返回执行统计`);
        return `trusted`;
      } finally {
        e2.getAttribute(y) === C2 && (b2 == null ? e2.removeAttribute(y) : e2.setAttribute(y, b2)), t2.getAttribute(y) === ee2 && (x2 == null ? t2.removeAttribute(y) : t2.setAttribute(y, x2));
      }
    }
    function We(e2, t2) {
      let n2 = document.elementFromPoint(e2, t2);
      for (; n2?.shadowRoot; ) {
        let r = n2.shadowRoot.elementFromPoint(e2, t2);
        if (!r || r === n2) break;
        n2 = r;
      }
      return n2;
    }
    function Ge(e2) {
      let t2 = [], n2 = e2;
      for (; n2; ) {
        if (t2.push(n2), n2.parentElement) {
          n2 = n2.parentElement;
          continue;
        }
        let e3 = n2.getRootNode();
        n2 = e3 instanceof ShadowRoot ? e3.host : null;
      }
      return t2;
    }
    function Ke(e2, t2, n2) {
      let r = (0, __contentScope.We)(t2, n2);
      if (!r) return { hit: null, blocked: true };
      if (r === e2 || e2.contains(r) || r.contains(e2)) return { hit: r, blocked: false };
      for (let t3 of (0, __contentScope.Ge)(e2)) if (t3 === r) return { hit: r, blocked: false };
      return { hit: r, blocked: true };
    }
    function qe(e2) {
      let t2 = e2.getBoundingClientRect();
      if (t2.width === 0 || t2.height === 0) return null;
      let n2 = t2.left + t2.width / 2, r = t2.top + t2.height / 2;
      if (n2 < 0 || r < 0 || n2 > window.innerWidth || r > window.innerHeight) return null;
      let { hit: i, blocked: a } = (0, __contentScope.Ke)(e2, n2, r);
      return a ? i ?? null : null;
    }
    function N(e2) {
      let t2 = e2.id ? `#${e2.id}` : ``, n2 = String(e2.className || ``).trim().split(/\s+/).filter(Boolean).slice(0, 2).join(`.`);
      return `${e2.tagName.toLowerCase()}${t2}${n2 ? `.${n2}` : ``}`;
    }
    function Je(e2) {
      let t2 = {
        bubbles: true,
        cancelable: true,
        key: `Enter`,
        code: `Enter`,
        keyCode: 13,
        which: 13
      };
      e2.dispatchEvent(new KeyboardEvent(`keydown`, t2)), e2.dispatchEvent(new KeyboardEvent(`keypress`, t2)), e2.dispatchEvent(new KeyboardEvent(`keyup`, t2));
    }
    function Ye(e2) {
      let t2 = {
        bubbles: true,
        cancelable: true,
        key: `Escape`,
        code: `Escape`,
        keyCode: 27,
        which: 27
      }, n2 = /* @__PURE__ */ new Set();
      for (let r of e2)
        r && !n2.has(r) && (n2.add(r), r.dispatchEvent(new KeyboardEvent(`keydown`, t2)), r.dispatchEvent(new KeyboardEvent(`keyup`, t2)));
    }
    function Qe(e2) {
      return e2.replace(__contentScope.Ze, (e3) => __contentScope.Xe[e3] ?? e3);
    }
    function P(e2) {
      let t2 = ``, n2 = false, r = ``, i = e2.source;
      for (let e3 = 0; e3 < i.length; e3 += 1) {
        let a = i[e3];
        if (a === `\\`) {
          t2 += i.slice(e3, e3 + 2), e3 += 1;
          continue;
        }
        if (n2) {
          if (a === `]`) {
            t2 += `${r}]`, n2 = false, r = ``;
            continue;
          }
          r += __contentScope.$e.get(a) ?? ``, t2 += a;
          continue;
        }
        if (a === `[`) {
          n2 = true, t2 += a;
          continue;
        }
        let o = __contentScope.$e.get(a);
        t2 += o ? `[${a}${o}]` : a;
      }
      return new RegExp(t2, e2.flags);
    }
    function et(e2, t2) {
      let n2 = (0, __contentScope.Qe)(e2).toLowerCase();
      return t2.filter((e3) => n2.includes((0, __contentScope.Qe)(e3).toLowerCase()));
    }
    function I(e2, t2) {
      return (0, __contentScope.et)(e2, t2).length > 0;
    }
    function L(e2) {
      let t2 = /* @__PURE__ */ new Set();
      return [
        e2.innerText,
        e2.textContent,
        e2.getAttribute(`value`),
        e2.getAttribute(`aria-label`),
        e2.getAttribute(`title`)
      ].map((e3) => typeof e3 == `string` ? e3.trim() : ``).filter((e3) => {
        if (!e3) return false;
        let n2 = e3.replace(/\s+/g, ` `);
        return !t2.has(n2) && (t2.add(n2), true);
      }).join(` `).trim();
    }
    function R(e2) {
      return e2.disabled === true || e2.getAttribute(`aria-disabled`) === `true` || String(e2.className ?? ``).split(/\s+/).filter(Boolean).some((e3) => !e3.includes(`:`) && __contentScope.ut.test(e3));
    }
    function z(e2 = document) {
      let t2 = [
        `button`,
        `[role="button"]`,
        `input[type="button"]`,
        `input[type="submit"]`,
        `a[href]`,
        `[class*="btn" i]`,
        `[class*="button" i]`,
        `[onclick]`
      ].join(`, `), n2 = [...e2.querySelectorAll(t2)], r = [...e2.querySelectorAll(`div, span`)].filter((e3) => {
        if (e3.children.length > 2) return false;
        let t3 = (e3.innerText ?? ``).trim();
        return !t3 || t3.length > 40 ? false : window.getComputedStyle(e3).cursor === `pointer`;
      }), i = /* @__PURE__ */ new Set();
      return [...n2, ...r].filter(
        (e3) => i.has(e3) || !(0, __contentScope.dt)(e3) || (e3.tagName.toLowerCase() === `p` || e3.tagName.toLowerCase() === `span`) && !e3.querySelector(
          `button, a, [role="button"], input[type="button"], input[type="submit"], [onclick]`
        ) && !e3.matches(`[role="button"], [onclick]`) ? false : (i.add(e3), true)
      );
    }
    function V(e2, t2) {
      let n2 = [...t2.querySelectorAll(`input`)].filter(
        (e3) => !e3.disabled && !e3.readOnly && e3.type !== `hidden` && (0, __contentScope.O)(e3)
      ), r = n2.map((t3) => {
        let r2 = (0, __contentScope.Cn)(t3), i = (0, __contentScope.Sn)(t3), o = t3.autocomplete.toLowerCase(), s = 0;
        return (0, __contentScope.bn)(t3, e2) && (s += 220), (0, __contentScope.xn)(t3, __contentScope.a) && (s += 70), t3.type.toLowerCase() === `password` && (s += 180), o === `current-password` && (s += 180), __contentScope.on.test(r2) && (s += 90), n2.length === 1 && t3.type.toLowerCase() === `password` && (s += 50), __contentScope.cn.test(i) && (s += 30), __contentScope.ln.test(i) && !__contentScope.cn.test(i) && (s -= 600), (o === `new-password` || __contentScope.sn.test(r2)) && (s -= 600), __contentScope.rn.test(r2) && (s -= 220), { element: t3, score: s };
      }).sort((e3, t3) => t3.score - e3.score)[0];
      return !r || r.score < 100 ? null : {
        element: r.element,
        selector: `页面密码语义`,
        fallback: !(0, __contentScope.bn)(r.element, e2)
      };
    }
    function H(e2) {
      return e2.getAttribute(`aria-disabled`) === `true` || e2 instanceof HTMLButtonElement && e2.disabled || e2 instanceof HTMLInputElement && e2.disabled;
    }
    function Yg(e2) {
      return `${__contentScope.qg?.runtime?.id}:auto-login:${e2}`;
    }
    function Zg(e2) {
      let t2, n2 = false;
      return {
        run() {
          n2 || (n2 = true, t2 = new URL(location.href), __contentScope.Xg ? globalThis.navigation.addEventListener(
            `navigate`,
            (e3) => {
              let n3 = new URL(e3.destination.url);
              n3.href !== t2.href && (window.dispatchEvent(new __contentScope.Jg(n3, t2)), t2 = n3);
            },
            { signal: e2.signal }
          ) : e2.setInterval(() => {
            let e3 = new URL(location.href);
            e3.href !== t2.href && (window.dispatchEvent(new __contentScope.Jg(e3, t2)), t2 = e3);
          }, 1e3));
        }
      };
    }
    __contentState.e = e;
    __contentState.t = t;
    __contentState.n = n;
    __contentState.p = p;
    __contentState.m = m;
    __contentState.h = h;
    __contentState.g = g;
    __contentState.b = b;
    __contentState.x = x;
    __contentState.S = S;
    __contentState.C = C;
    __contentState.ee = ee;
    __contentState.ne = ne;
    __contentState.ue = ue;
    __contentState.pe = pe;
    __contentState.me = me;
    __contentState.he = he;
    __contentState.ge = ge;
    __contentState._e = _e;
    __contentState.ye = ye;
    __contentState.be = be;
    __contentState.E = E;
    __contentState.D = D;
    __contentState.xe = xe;
    __contentState.Se = Se;
    __contentState.Ce = Ce;
    __contentState.we = we;
    __contentState.O = O;
    __contentState.k = k;
    __contentState.A = A;
    __contentState.Te = Te;
    __contentState.Ee = Ee;
    __contentState.De = De;
    __contentState.Oe = Oe;
    __contentState.j = j;
    __contentState.ke = ke;
    __contentState.Ae = Ae;
    __contentState.je = je;
    __contentState.Me = Me;
    __contentState.M = M;
    __contentState.Ne = Ne;
    __contentState.Pe = Pe;
    __contentState.Fe = Fe;
    __contentState.Ie = Ie;
    __contentState.Le = Le;
    __contentState.Re = Re;
    __contentState.ze = ze;
    __contentState.Be = Be;
    __contentState.Ve = Ve;
    __contentState.He = He;
    __contentState.Ue = Ue;
    __contentState.We = We;
    __contentState.Ge = Ge;
    __contentState.Ke = Ke;
    __contentState.qe = qe;
    __contentState.N = N;
    __contentState.Je = Je;
    __contentState.Ye = Ye;
    __contentState.Qe = Qe;
    __contentState.P = P;
    __contentState.et = et;
    __contentState.I = I;
    __contentState.L = L;
    __contentState.R = R;
    __contentState.z = z;
    __contentState.V = V;
    __contentState.H = H;
    __contentState.Yg = Yg;
    __contentState.Zg = Zg;
    return {
      state: __contentState,
      api: {},
      initializers: [
        {
          order: 14,
          run() {
            __contentState._ = null;
          }
        },
        {
          order: 15,
          run() {
            __contentState.v = `trusted`;
          }
        },
        {
          order: 16,
          run() {
            __contentState.te = 34;
          }
        },
        {
          order: 17,
          run() {
            __contentState.w = (e2) => new Promise((t2) => setTimeout(t2, e2));
          }
        },
        {
          order: 18,
          run() {
            __contentState.re = 16;
          }
        },
        {
          order: 19,
          run() {
            __contentState.ie = 120;
          }
        },
        {
          order: 20,
          run() {
            __contentState.T = /* @__PURE__ */ new Set([
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
          order: 21,
          run() {
            __contentState.ae = /* @__PURE__ */ new Set([`click`, `double`, `right`, `long-press`]);
          }
        },
        {
          order: 22,
          run() {
            __contentState.oe = {
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
          order: 23,
          run() {
            __contentState.se = 600;
          }
        },
        {
          order: 24,
          run() {
            __contentState.ce = 90;
          }
        },
        {
          order: 25,
          run() {
            __contentState.le = 32;
          }
        },
        {
          order: 26,
          run() {
            __contentState.de = [
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
        },
        {
          order: 27,
          run() {
            __contentState.fe = /[\u200B-\u200D\u2060\uFEFF\uFE0E\uFE0F\u00AD]/g;
          }
        },
        {
          order: 28,
          run() {
            __contentState.ve = class extends Error {
              constructor(e2) {
                super(e2), this.name = `SelectorResolutionError`;
              }
            };
          }
        },
        {
          order: 29,
          run() {
            __contentState.Xe = {
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
              鐘: `钟`
            };
          }
        },
        {
          order: 30,
          run() {
            __contentState.Ze = RegExp(`[${Object.keys(__contentScope.Xe).join(``)}]`, `g`);
          }
        },
        {
          order: 31,
          run() {
            __contentState.$e = /* @__PURE__ */ new Map();
          }
        },
        {
          order: 32,
          run() {
            for (let [e2, t2] of Object.entries(__contentScope.Xe))
              __contentScope.$e.set(t2, `${__contentScope.$e.get(t2) ?? ``}${e2}`);
          }
        },
        {
          order: 357,
          run() {
            __contentState.Kg = {
              debug: (...e2) => ([...e2], void 0),
              log: (...e2) => ([...e2], void 0),
              warn: (...e2) => ([...e2], void 0),
              error: (...e2) => ([...e2], void 0)
            };
          }
        },
        {
          order: 358,
          run() {
            __contentState.qg = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
          }
        },
        {
          order: 359,
          run() {
            __contentState.Jg = class e2 extends Event {
              static EVENT_NAME = (0, __contentScope.Yg)(`wxt:locationchange`);
              constructor(t2, n2) {
                super(e2.EVENT_NAME, {}), this.newUrl = t2, this.oldUrl = n2;
              }
            };
          }
        },
        {
          order: 360,
          run() {
            __contentState.Xg = typeof globalThis.navigation?.addEventListener == `function`;
          }
        },
        {
          order: 361,
          run() {
            __contentState.Qg = class e2 {
              static SCRIPT_STARTED_MESSAGE_TYPE = (0, __contentScope.Yg)(
                `wxt:content-script-started`
              );
              id;
              abortController;
              locationWatcher = (0, __contentScope.Zg)(this);
              constructor(e3, t2) {
                this.contentScriptName = e3, this.options = t2, this.id = Math.random().toString(36).slice(2), this.abortController = new AbortController(), this.stopOldScripts(), this.listenForNewerScripts();
              }
              get signal() {
                return this.abortController.signal;
              }
              abort(e3) {
                return this.abortController.abort(e3);
              }
              get isInvalid() {
                return __contentScope.qg.runtime?.id ?? this.notifyInvalidated(), this.signal.aborted;
              }
              get isValid() {
                return !this.isInvalid;
              }
              onInvalidated(e3) {
                return this.signal.addEventListener(`abort`, e3), () => this.signal.removeEventListener(`abort`, e3);
              }
              block() {
                return new Promise(() => {
                });
              }
              setInterval(e3, t2) {
                let n2 = setInterval(() => {
                  this.isValid && e3();
                }, t2);
                return this.onInvalidated(() => clearInterval(n2)), n2;
              }
              setTimeout(e3, t2) {
                let n2 = setTimeout(() => {
                  this.isValid && e3();
                }, t2);
                return this.onInvalidated(() => clearTimeout(n2)), n2;
              }
              requestAnimationFrame(e3) {
                let t2 = requestAnimationFrame((...t3) => {
                  this.isValid && e3(...t3);
                });
                return this.onInvalidated(() => cancelAnimationFrame(t2)), t2;
              }
              requestIdleCallback(e3, t2) {
                let n2 = requestIdleCallback((...t3) => {
                  this.signal.aborted || e3(...t3);
                }, t2);
                return this.onInvalidated(() => cancelIdleCallback(n2)), n2;
              }
              addEventListener(e3, t2, n2, r) {
                t2 === `wxt:locationchange` && this.isValid && this.locationWatcher.run(), e3.addEventListener?.(t2.startsWith(`wxt:`) ? (0, __contentScope.Yg)(t2) : t2, n2, {
                  ...r,
                  signal: this.signal
                });
              }
              notifyInvalidated() {
                this.abort(`Content script context invalidated`), __contentScope.Kg.debug(
                  `Content script "${this.contentScriptName}" context invalidated`
                );
              }
              stopOldScripts() {
                document.dispatchEvent(
                  new CustomEvent(e2.SCRIPT_STARTED_MESSAGE_TYPE, {
                    detail: {
                      contentScriptName: this.contentScriptName,
                      messageId: this.id
                    }
                  })
                ), this.options?.noScriptStartedPostMessage || window.postMessage(
                  {
                    type: e2.SCRIPT_STARTED_MESSAGE_TYPE,
                    contentScriptName: this.contentScriptName,
                    messageId: this.id
                  },
                  `*`
                );
              }
              verifyScriptStartedEvent(e3) {
                let t2 = e3.detail?.contentScriptName === this.contentScriptName, n2 = e3.detail?.messageId === this.id;
                return t2 && !n2;
              }
              listenForNewerScripts() {
                let t2 = (e3) => {
                  e3 instanceof CustomEvent && this.verifyScriptStartedEvent(e3) && this.notifyInvalidated();
                };
                document.addEventListener(e2.SCRIPT_STARTED_MESSAGE_TYPE, t2), this.onInvalidated(
                  () => document.removeEventListener(e2.SCRIPT_STARTED_MESSAGE_TYPE, t2)
                );
              }
            };
          }
        },
        {
          order: 362,
          run() {
            __contentState.$g = {
              debug: (...e2) => ([...e2], void 0),
              log: (...e2) => ([...e2], void 0),
              warn: (...e2) => ([...e2], void 0),
              error: (...e2) => ([...e2], void 0)
            };
          }
        }
      ]
    };
  }

  // src/shared/account-identity.js
  function readIdentitySource(site) {
    const source = site.identitySource;
    if (!source || typeof source !== "object" || Array.isArray(source)) return null;
    const text = (value) => typeof value === "string" && value.trim() ? value.trim() : void 0;
    const storageType = (value) => value === "localStorage" || value === "sessionStorage" ? value : void 0;
    const fields = (value) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return void 0;
      const result2 = {};
      for (const field of ["userId", "username", "email", "displayName"]) {
        const selector = text(value[field]);
        if (selector && selector.length <= 500) result2[field] = selector;
      }
      return Object.keys(result2).length ? result2 : void 0;
    };
    const result = {
      storageKey: text(source.storageKey),
      storageType: storageType(source.storageType),
      endpoint: text(source.endpoint),
      pagePath: text(source.pagePath),
      pageFields: fields(source.pageFields),
      pageFieldRules: readIdentityFieldRules(source.pageFieldRules),
      responseFields: fields(source.responseFields),
      tokenKey: text(source.tokenKey),
      tokenStorageType: storageType(source.tokenStorageType),
      tokenHeader: text(source.tokenHeader),
      tokenPrefix: typeof source.tokenPrefix === "string" ? source.tokenPrefix : void 0
    };
    return result.storageKey || result.endpoint || result.pagePath || result.pageFields || result.responseFields ? result : null;
  }
  function readIdentityFieldRules(rules) {
    if (!rules || typeof rules !== "object" || Array.isArray(rules)) return void 0;
    const result = {};
    for (const field of ["userId", "username", "email", "displayName"]) {
      const rule = rules[field];
      if (!rule || typeof rule !== "object" || Array.isArray(rule)) continue;
      if (!["text", "value", "attribute"].includes(rule.kind)) continue;
      if (rule.kind === "attribute" && !/^data-(?:user-id|uid|username|user-name|email)$/.test(rule.attribute ?? ""))
        continue;
      if (["prefix", "suffix"].some(
        (key) => rule[key] != null && (typeof rule[key] !== "string" || rule[key].length > 80)
      ))
        continue;
      if (rule.stopAt != null && (field !== "userId" || ![",", "，", ";", "；"].includes(rule.stopAt)))
        continue;
      result[field] = {
        kind: rule.kind,
        ...rule.kind === "attribute" ? { attribute: rule.attribute } : {},
        ...rule.prefix ? { prefix: rule.prefix } : {},
        ...rule.suffix ? { suffix: rule.suffix } : {},
        ...rule.stopAt ? { stopAt: rule.stopAt } : {}
      };
    }
    return Object.keys(result).length ? result : void 0;
  }
  function normalizeIdentityFieldValue(field, value) {
    if (typeof value !== "string") return void 0;
    const text = value.trim();
    if (!text || text.length > 128 || /[\r\n*•●]/.test(text)) return void 0;
    if (field === "userId") return /^[\w.:-]{1,128}$/.test(text) ? text : void 0;
    if (field === "email")
      return /^[\p{L}\p{N}._+%-]+@[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)+$/u.test(text) ? text : void 0;
    if (field === "username")
      return /^[\p{L}\p{N}@][\p{L}\p{N}._+@'-]{1,79}$/u.test(text) ? text : void 0;
    return field === "displayName" ? text : void 0;
  }
  function parseVisibleUserIdLabel(text) {
    if (typeof text !== "string") return null;
    const match = text.replace(/\s+/g, " ").trim().match(
      /^((?:用户\s*ID|User\s*ID|UID|ID)(?:\s*[:：#]\s*|\s+))([\w.:-]{1,128})(?:\s*([,，;；])\s*(.+))?$/i
    );
    return match ? { prefix: match[1], value: match[2], ...match[3] ? { stopAt: match[3] } : {} } : null;
  }
  function readIdentityField(node, field, rule = {}) {
    if (!node || !isIdentityElementVisible(node)) return void 0;
    if (node.closest?.("form")?.querySelector?.('input[type="password"]')) return void 0;
    if (node.closest?.('[role="grid"], [role="list"], [role="listitem"], .lottery-sidebar'))
      return void 0;
    const table = node.closest?.('table, [role="table"]');
    if (table?.querySelector?.("thead") && table.querySelectorAll?.("tbody tr")?.length > 1)
      return void 0;
    for (let current = node; current && current.tagName !== "BODY"; current = current.parentElement) {
      const metadata = [
        current.id,
        current.className,
        current.getAttribute?.("data-testid"),
        current.getAttribute?.("aria-label")
      ].join(" ");
      if (/用户列表|成员列表|邀请|排行榜|中奖|(?:^|[\s_-])(?:user[-_ ]list|member[-_ ]list|invitation|referral|leaderboard|winners?)(?:$|[\s_-])/i.test(
        metadata
      ))
        return void 0;
    }
    const tag = node.tagName?.toUpperCase();
    const control = /^(?:INPUT|TEXTAREA)$/.test(tag ?? "");
    if (control && (!(node.readOnly || node.disabled || node.hasAttribute?.("readonly") || node.hasAttribute?.("disabled")) || /^(?:password|hidden)$/i.test(node.type ?? "")))
      return void 0;
    let value;
    if (rule.kind === "attribute") value = node.getAttribute?.(rule.attribute);
    else if (rule.kind === "value" || !rule.kind && control) value = control ? node.value : null;
    else
      value = (!rule.kind && field === "userId" ? node.getAttribute?.("data-user-id") : null) ?? node.innerText ?? node.textContent;
    if (typeof value !== "string") return void 0;
    value = value.replace(/\s+/g, " ").trim();
    if (rule.prefix) {
      if (!value.startsWith(rule.prefix)) return void 0;
      value = value.slice(rule.prefix.length);
    }
    if (rule.suffix) {
      if (!value.endsWith(rule.suffix)) return void 0;
      value = value.slice(0, -rule.suffix.length);
    }
    if (rule.stopAt) {
      const stop = value.indexOf(rule.stopAt);
      if (stop >= 0) value = value.slice(0, stop).trim();
    }
    if (!rule.kind && field === "userId") value = parseVisibleUserIdLabel(value)?.value ?? value;
    return normalizeIdentityFieldValue(field, value);
  }
  function buildIdentityFieldSelector(node, document2, currentValue) {
    const quote = (value) => String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const stable = (value) => typeof value === "string" && !!value && value.length <= 100 && !/\d{5,}|@|token|password|secret|^:r[\w:]+:$/i.test(value) && (!currentValue || !value.toLowerCase().includes(currentValue.toLowerCase()));
    const unique = (selector2) => {
      try {
        const nodes = document2.querySelectorAll(selector2);
        return nodes.length === 1 && nodes[0] === node;
      } catch {
        return false;
      }
    };
    for (const attribute of ["data-testid", "id", "name", "aria-label"]) {
      const value = node.getAttribute?.(attribute);
      if (!stable(value)) continue;
      const selector2 = `${node.tagName.toLowerCase()}[${attribute}="${quote(value)}"]`;
      if (unique(selector2)) return selector2;
    }
    const parts = [];
    for (let current = node; current && parts.length < 12; current = current.parentElement) {
      if (current === document2.body || current === document2.documentElement) {
        parts.unshift(current.tagName.toLowerCase());
        break;
      }
      const testId = current.getAttribute?.("data-testid");
      const id = current.getAttribute?.("id");
      if (current !== node && (stable(testId) || stable(id))) {
        parts.unshift(stable(testId) ? `[data-testid="${quote(testId)}"]` : `[id="${quote(id)}"]`);
        break;
      }
      const tag = current.tagName?.toLowerCase();
      if (!tag) return void 0;
      const siblings = [...current.parentElement?.children ?? [current]].filter(
        (sibling) => sibling.tagName === current.tagName
      );
      const index = siblings.indexOf(current);
      parts.unshift(siblings.length > 1 ? `${tag}:nth-of-type(${index + 1})` : tag);
    }
    const selector = parts.join(" > ");
    return selector.length <= 500 && unique(selector) ? selector : void 0;
  }
  function describeIdentityField(node, field, document2, observedValue) {
    if (!node || node === document2.body || node === document2.documentElement) return null;
    let kind = /^(?:INPUT|TEXTAREA)$/.test(node.tagName ?? "") ? "value" : "text";
    let raw = kind === "value" ? node.value : node.innerText ?? node.textContent;
    if (typeof raw !== "string" || raw.length > 250) return null;
    raw = raw.replace(/\s+/g, " ").trim();
    const idLabel = field === "userId" ? parseVisibleUserIdLabel(raw) : null;
    if (idLabel && observedValue && idLabel.value !== observedValue) return null;
    let value = observedValue || normalizeIdentityFieldValue(field, idLabel?.value ?? raw);
    if (!value) {
      const labeled = raw.match(/^(.{1,50}?[:：#]\s*)([^\r\n]+)$/);
      if (labeled) value = normalizeIdentityFieldValue(field, labeled[2]);
    }
    if (!value) return null;
    const rule = { kind };
    const attributes = field === "userId" ? ["data-user-id", "data-uid"] : field === "username" ? ["data-username", "data-user-name"] : field === "email" ? ["data-email"] : [];
    for (const name of attributes)
      if (normalizeIdentityFieldValue(field, node.getAttribute?.(name)) === value) {
        rule.kind = "attribute";
        rule.attribute = name;
        raw = value;
        break;
      }
    if (raw !== value && idLabel?.value === value && rule.kind === "text") {
      rule.prefix = idLabel.prefix;
      if (idLabel.stopAt) rule.stopAt = idLabel.stopAt;
    } else if (raw !== value) {
      const index = raw.indexOf(value);
      if (index < 0 || raw.indexOf(value, index + value.length) >= 0) return null;
      if (index) rule.prefix = raw.slice(0, index);
      if (index + value.length < raw.length) rule.suffix = raw.slice(index + value.length);
    }
    if (!readIdentityFieldRules({ [field]: rule })) return null;
    if (readIdentityField(node, field, rule) !== value) return null;
    const selector = buildIdentityFieldSelector(node, document2, value);
    return selector ? { value, selector, rule } : null;
  }
  function discoverIdentityEndpoints(entries, origin) {
    const result = [];
    for (const entry of entries ?? []) {
      try {
        const url = new URL(typeof entry === "string" ? entry : entry.name, origin);
        if (url.origin !== origin || !/^https?:$/.test(url.protocol) || url.username || url.password || url.search || url.hash || /\/(?:\d+|[0-9a-f]{8}-[0-9a-f-]{20,})(?:\/|$)/i.test(url.pathname) || /(?:logout|signout|login|signin|register|check.?in|claim|delete|remove|token|keys?|invite|referral|list|search)/i.test(
          url.pathname
        ) || !/(?:^|\/)(?:me|self|whoami|who-am-i|current[-_]?user|current[-_]?account|userinfo|user[-_]?info|profile)(?:\/|$)|\/(?:user|account)\/(?:current|info)$/i.test(
          url.pathname
        ))
          continue;
        if (!result.includes(url.pathname)) result.push(url.pathname);
        if (result.length >= 6) break;
      } catch {
      }
    }
    return result;
  }
  function identitySourceLabel(source) {
    return source === "api" ? "站点接口" : source === "storage" ? "本地登录态" : source === "visible" ? "页面文本" : "未知来源";
  }
  function identitiesEqual(first, second) {
    return typeof first === "string" && typeof second === "string" && !!first.trim() && first.trim().toLowerCase() === second.trim().toLowerCase();
  }
  function parseIdentityResponse(response, fieldPaths) {
    const record = (value) => !!value && typeof value === "object" && !Array.isArray(value);
    const successful = (value) => {
      if (value.success === false || value.ok === false || value.status === false) return false;
      if (/^(?:error|failed|failure|unauthorized|forbidden)$/i.test(String(value.status ?? "")))
        return false;
      return value.code == null || /^(?:0|200|success|ok)$/i.test(String(value.code).trim());
    };
    const scalar = (value) => {
      if (typeof value === "string" && value.trim()) return value.trim();
      if (typeof value === "number" && Number.isFinite(value)) return String(value);
    };
    const identifier = (value) => {
      if (typeof value === "number")
        return Number.isSafeInteger(value) && value >= 0 ? String(value) : void 0;
      if (typeof value === "string" && /^[\w.:-]{1,128}$/.test(value.trim())) return value.trim();
    };
    const containers = [
      "user",
      "current_user",
      "currentUser",
      "user_info",
      "userInfo",
      "profile",
      "identity",
      "account",
      "current_account",
      "currentAccount",
      "me"
    ];
    const candidates = [];
    const conflictingIds = /* @__PURE__ */ new Set();
    const seen = /* @__PURE__ */ new Set();
    function collect(value, depth = 0) {
      if (!record(value) || depth > 4 || seen.has(value) || !successful(value)) return;
      seen.add(value);
      const envelopes = ["data", "result"].filter((key) => record(value[key]));
      if (Object.prototype.hasOwnProperty.call(value, "data") || envelopes.length) {
        for (const key of envelopes) collect(value[key], depth + 1);
        for (const key of containers) if (record(value[key])) collect(value[key], depth + 1);
        return;
      }
      const nested = containers.filter((key) => record(value[key]));
      const ids2 = new Set(
        [value.id, value.user_id, value.userId, value.uid, value.account_id, value.accountId].map(identifier).filter(Boolean)
      );
      if (ids2.size > 1) for (const id of ids2) conflictingIds.add(id);
      const identity = {
        userId: ids2.size === 1 ? [...ids2][0] : void 0,
        username: scalar(value.username) ?? scalar(value.user_name) ?? scalar(value.login) ?? scalar(value.handle),
        email: scalar(value.email),
        displayName: scalar(value.display_name) ?? scalar(value.displayName) ?? scalar(value.nickname) ?? scalar(value.name)
      };
      if (identity.userId || identity.username || identity.email) {
        if (!nested.length || identity.username || identity.email || identity.displayName)
          candidates.push(identity);
      }
      for (const key of nested) collect(value[key], depth + 1);
    }
    collect(response);
    if (record(response) && successful(response) && record(fieldPaths)) {
      const mapped = {};
      const mappedFields = /* @__PURE__ */ new Set();
      for (const field of ["userId", "username", "email", "displayName"]) {
        const path = fieldPaths[field];
        if (typeof path !== "string" || !/^[\w-]+(?:\.[\w-]+)*$/.test(path)) continue;
        mappedFields.add(field);
        let value = response;
        for (const key of path.split(".")) {
          if (!record(value) || !successful(value) || !Object.hasOwn(value, key)) {
            value = void 0;
            break;
          }
          value = value[key];
        }
        mapped[field] = field === "userId" ? identifier(value) : scalar(value);
      }
      for (const identity of candidates) for (const field of mappedFields) delete identity[field];
      if (mappedFields.has("userId")) conflictingIds.clear();
      if (mapped.userId || mapped.username || mapped.email) candidates.push(mapped);
    }
    const ids = /* @__PURE__ */ new Set([
      ...conflictingIds,
      ...candidates.map((identity) => identity.userId).filter(Boolean)
    ]);
    if (ids.size > 1)
      return { identityConflict: `身份接口同时返回不同用户 ID（${[...ids].join("、")}）` };
    const result = {};
    for (const field of ["userId", "username", "email", "displayName"]) {
      const values = [...new Set(candidates.map((identity) => identity[field]).filter(Boolean))];
      if (values.length === 1) result[field] = values[0];
      else if (values.length > 1 && field !== "displayName")
        return { identityConflict: `身份接口同时返回不同${field === "email" ? "邮箱" : "用户名"}` };
    }
    return Object.keys(result).length ? result : null;
  }
  function discoverIdentityResponse(response, configuredFields) {
    const identity = parseIdentityResponse(response, configuredFields);
    if (!identity || identity.identityConflict) return { identity, responseFields: void 0 };
    const aliases = {
      userId: ["id", "user_id", "userId", "uid", "account_id", "accountId"],
      username: ["username", "user_name", "login", "handle"],
      email: ["email"],
      displayName: ["display_name", "displayName", "nickname", "name"]
    };
    const containers = [
      "user",
      "current_user",
      "currentUser",
      "user_info",
      "userInfo",
      "profile",
      "identity",
      "account",
      "current_account",
      "currentAccount",
      "me"
    ];
    const paths = /* @__PURE__ */ new Map();
    function visit(value, path = [], depth = 0) {
      if (!value || typeof value !== "object" || Array.isArray(value) || depth > 4) return;
      const envelopes = ["data", "result"].filter(
        (key) => value[key] && typeof value[key] === "object" && !Array.isArray(value[key])
      );
      if (!Object.hasOwn(value, "data") && !envelopes.length)
        for (const [field, keys] of Object.entries(aliases)) {
          if (!identity[field] || configuredFields?.[field]) continue;
          for (const key of keys)
            if (Object.hasOwn(value, key) && ["string", "number"].includes(typeof value[key]) && String(value[key]).trim() === identity[field]) {
              const matches = paths.get(field) ?? [];
              matches.push([...path, key].join("."));
              paths.set(field, matches);
            }
        }
      for (const key of [...envelopes, ...containers])
        if (Object.hasOwn(value, key)) visit(value[key], [...path, key], depth + 1);
    }
    visit(response);
    const responseFields = {};
    for (const field of Object.keys(aliases)) {
      if (!identity[field]) continue;
      const configured = configuredFields?.[field];
      if (typeof configured === "string" && /^[\w-]+(?:\.[\w-]+)*$/.test(configured))
        responseFields[field] = configured;
      else {
        const candidates = paths.get(field);
        if (candidates?.length === 1) responseFields[field] = candidates[0];
      }
    }
    return {
      identity,
      responseFields: Object.keys(responseFields).length ? responseFields : void 0
    };
  }
  function findIdentityMatch(identity, username, aliases = [], expectedIdentity) {
    for (const field of ["username", "email"])
      if (identitiesEqual(identity[field], expectedIdentity?.[field]))
        return { value: identity[field], expected: expectedIdentity[field], source: "stored" };
    if (expectedIdentity?.username || expectedIdentity?.email) return null;
    for (const value of [identity.username, identity.email])
      if (identitiesEqual(value, username)) return { value, expected: username, source: "primary" };
    for (const alias of aliases) {
      const field = typeof alias === "string" && alias.includes("@") ? "email" : "username";
      if (identitiesEqual(identity[field], alias))
        return { value: identity[field], expected: alias, source: "alias" };
    }
    return null;
  }
  function findIdentityOwner(identity, knownIdentities = []) {
    return knownIdentities.find((known) => {
      if (identity?.userId && known.userId) return String(identity.userId) === String(known.userId);
      return ["username", "email"].some((field) => identitiesEqual(identity?.[field], known[field]));
    });
  }
  function compareAccountIdentity(identity, username, expectedUserId, options = {}) {
    if (identity?.identityConflict)
      return { match: "unknown", detail: `身份证据冲突：${identity.identityConflict}` };
    if (!identity)
      return {
        match: "unknown",
        detail: expectedUserId ? `本账号已绑定用户 ID ${expectedUserId}，当前页面尚未返回用户 ID` : "读不到当前登录身份"
      };
    const origin = `读自${identitySourceLabel(identity.source)}`;
    const owner = identity.userId ? options.knownUsers?.[identity.userId] : void 0;
    if (owner)
      return {
        match: "mismatch",
        detail: `当前登录的是用户 ID ${identity.userId}（本站账号 ${owner}，${origin}），本次要签到的是 ${expectedUserId ?? username}`
      };
    if (expectedUserId) {
      if (!identity.userId)
        return {
          match: "unknown",
          detail: `本账号已绑定用户 ID ${expectedUserId}，当前页面尚未返回用户 ID（${origin}）`
        };
      if (String(identity.userId) !== String(expectedUserId))
        return {
          match: "mismatch",
          detail: `当前登录的是用户 ID ${identity.userId}（${origin}），本次要签到的是 ${expectedUserId}`
        };
      if (identity.source === "storage")
        return { match: "unknown", detail: "本地保存的用户 ID 相同，但尚未确认当前登录会话" };
      return {
        match: "confirmed",
        detail: `用户 ID ${identity.userId} 一致（${origin}，账号备注不参与身份核验）`
      };
    }
    if (identity.source === "storage")
      return { match: "unknown", detail: "本地登录态只是身份提示，不能证明当前登录账号" };
    const nameOwner = findIdentityOwner(identity, options.knownIdentities);
    if (nameOwner)
      return {
        match: "mismatch",
        detail: `当前登录名已绑定给本站其他账号 ${nameOwner.label ?? nameOwner.username ?? nameOwner.email}`
      };
    const match = findIdentityMatch(
      identity,
      username,
      options.expectedAliases,
      options.expectedIdentity
    );
    if (match)
      return {
        match: "confirmed",
        detail: match.source === "stored" ? `账号 ${username} 已保存的站点身份 ${match.expected} 与当前身份一致（${origin}）` : match.source === "alias" ? `账号 ${username} 保存的身份别名 ${match.expected} 与当前身份 ${match.value} 一致（${origin}）` : `账号 ${username} 的完整登录标识一致（${origin}）`
      };
    if ((options.expectedIdentity?.username || options.expectedIdentity?.email) && !["username", "email"].some((field) => options.expectedIdentity[field] && identity[field]))
      return {
        match: "unknown",
        detail: `本站已绑定登录标识 ${options.expectedIdentity.username ?? options.expectedIdentity.email}，当前尚未返回可核对的字段（${origin}）`
      };
    const currentName = identity.username ?? identity.email;
    return currentName ? {
      match: "mismatch",
      detail: `当前登录的是 ${currentName}（${origin}），本次要签到的是 ${options.expectedIdentity?.username ?? options.expectedIdentity?.email ?? username}`
    } : { match: "unknown", detail: `站点未返回可比对的登录名（${origin}，昵称不作为唯一身份）` };
  }
  function identitySampleKey(identity) {
    if (!identity || identity.identityConflict || identity.source === "storage") return null;
    if (identity.userId) return JSON.stringify([identity.source, "id", String(identity.userId)]);
    if (!identity.username && !identity.email) return null;
    return JSON.stringify([
      identity.source,
      "name",
      identity.username?.trim().toLowerCase(),
      identity.email?.trim().toLowerCase()
    ]);
  }
  function stableIdentitySamples(first, second) {
    const key = identitySampleKey(first);
    return !!key && key === identitySampleKey(second);
  }
  function resolveIdentityPage(site, document2, location2) {
    const safeUrl = (path) => {
      try {
        const url = new URL(path, site.loginUrl);
        if (url.origin !== new URL(site.loginUrl).origin || url.origin !== location2.origin || url.username || url.password || url.search || /(?:access_token|refresh_token|id_token|code|state|token|secret|password)=/i.test(url.hash))
          return null;
        return url.href;
      } catch {
        return null;
      }
    };
    const configured = readIdentitySource(site)?.pagePath;
    if (configured) return safeUrl(configured);
    for (const link of document2?.querySelectorAll?.("a[href]") ?? []) {
      if (!isIdentityElementVisible(link) || !link.closest?.('header, nav, aside, [role="banner"], [role="navigation"], .semi-navigation'))
        continue;
      const label = [
        link.innerText,
        link.getAttribute("aria-label"),
        link.getAttribute("title")
      ].join(" ");
      if (!/个人(?:设置|资料|中心|信息)|我的(?:账户|账号)|\b(?:profile|personal|my account|account settings)\b/i.test(
        label
      ))
        continue;
      const url = safeUrl(link.getAttribute("href"));
      if (url) return url;
    }
    return null;
  }
  var SiteIdentityResolver = class {
    constructor({
      getFamily = (site) => site.adapter?.family,
      readStorage = () => void 0,
      readPage = (site) => readVisibleAccountIdentity(
        globalThis.document,
        globalThis.location,
        readIdentitySource(site)
      ),
      userIdHeaders = () => ({}),
      bootstrapHeaders = async () => ({}),
      readExternal = async () => null,
      getOrigin = () => globalThis.location.origin,
      getResources = () => globalThis.performance?.getEntriesByType?.("resource") ?? [],
      fetch: request = (...args) => globalThis.fetch(...args),
      transportHints = /* @__PURE__ */ new Map()
    } = {}) {
      Object.assign(this, {
        getFamily,
        readStorage,
        readPage,
        userIdHeaders,
        bootstrapHeaders,
        readExternal,
        getOrigin,
        getResources,
        request,
        transportHints
      });
    }
    /** 每次都请求当前会话；只记住成功的接口位置，不缓存身份或凭据。 */
    async read(site, explicitToken, options = {}) {
      const family = this.getFamily(site);
      const source = readIdentitySource(site);
      const origin = this.getOrigin();
      const sameOrigin = (endpoint) => {
        try {
          const url = new URL(endpoint, origin);
          return url.origin === origin && url.origin === new URL(site.loginUrl).origin;
        } catch {
          return false;
        }
      };
      const stored = (key2, type) => {
        if (!key2) return null;
        try {
          return parseIdentityResponse(JSON.parse(this.readStorage(key2, type)));
        } catch {
          return null;
        }
      };
      const hint = (source?.storageKey && stored(source.storageKey, source.storageType)?.userId) ?? stored("user")?.userId ?? (family === "sub2api" ? stored("auth_user")?.userId : void 0);
      const defaults = family === "sub2api" ? ["/api/v1/auth/me", "/api/user/self", "/api/user/info"] : ["/api/user/self", "/api/user/info", "/api/v1/auth/me"];
      const endpoints = [
        ...new Set(
          site.tokenConfig?.identityEndpoint ? [site.tokenConfig.identityEndpoint] : source?.endpoint && !sameOrigin(source.endpoint) ? [] : [
            ...source?.endpoint && sameOrigin(source.endpoint) ? [source.endpoint] : [],
            ...options.discover === true ? discoverIdentityEndpoints(this.getResources(), origin) : [],
            ...defaults
          ]
        )
      ];
      const deadline = Date.now() + (options.timeoutMs ?? 4e3);
      const key = JSON.stringify([
        site.id,
        origin,
        explicitToken ? "explicit-token" : "browser-session",
        endpoints.map((endpoint) => {
          try {
            const url = new URL(endpoint, origin);
            return `${url.origin}${url.pathname}`;
          } catch {
            return null;
          }
        }),
        site.tokenConfig?.headerName,
        source?.responseFields,
        !!source?.endpoint,
        !!site.authBootstrap?.endpoint
      ]);
      const canRemember = endpoints.every((endpoint) => {
        try {
          const url = new URL(endpoint, origin);
          return !url.search && !url.hash;
        } catch {
          return false;
        }
      });
      const remembered = canRemember ? this.transportHints.get(key) : null;
      const attempted = /* @__PURE__ */ new Set();
      let partial = null;
      const diagnostics = /* @__PURE__ */ new Set();
      const trace = (endpoint, mode, detail) => {
        if (!options.diagnostics?.push) return;
        const message = `身份接口 ${endpoint}（${mode}）：${detail}`;
        if (!diagnostics.has(message)) {
          diagnostics.add(message);
          options.diagnostics.push(message);
        }
      };
      const modes = {
        cookie: "当前会话",
        hint: "当前页面用户提示头",
        token: "本站 Token",
        bootstrap: "会话令牌引导"
      };
      const read = async (headers, credentials, candidates = endpoints, mode = "cookie") => {
        for (const endpoint of candidates) {
          let url;
          try {
            url = new URL(endpoint, origin);
          } catch {
            continue;
          }
          const attempt = `${mode}|${url.href}`;
          if (!sameOrigin(url.href) || Date.now() >= deadline || attempted.has(attempt)) continue;
          attempted.add(attempt);
          const controller = new AbortController();
          const timer = setTimeout(
            () => controller.abort(),
            Math.min(1500, Math.max(1, deadline - Date.now()))
          );
          try {
            const response = await this.request(url.href, {
              method: "GET",
              credentials,
              headers: { Accept: "application/json", ...headers },
              cache: "no-store",
              redirect: "error",
              signal: controller.signal
            });
            if (!response.ok) {
              trace(url.pathname, modes[mode], `HTTP ${response.status}`);
              continue;
            }
            if (response.redirected || response.url && new URL(response.url).href !== url.href) {
              trace(url.pathname, modes[mode], "响应发生跳转，未采用身份");
              continue;
            }
            const type = response.headers.get("content-type")?.toLowerCase() ?? "";
            if (!type.includes("json")) {
              trace(
                url.pathname,
                modes[mode],
                type.includes("html") ? "返回 HTML 页面，可能是访问验证或登录页" : "响应不是 JSON 用户资料"
              );
              continue;
            }
            const body = await response.json().catch(() => null);
            const discovered = options.discover === true ? discoverIdentityResponse(body, source?.responseFields) : null;
            const identity = discovered?.identity ?? parseIdentityResponse(body, source?.responseFields);
            if (!identity) {
              trace(url.pathname, modes[mode], "未返回有效的当前用户字段");
              continue;
            }
            const evidence = {
              ...identity,
              source: "api",
              endpoint: url.pathname,
              ...options.discover === true && !url.search && !url.hash && discovered?.responseFields ? {
                identitySource: {
                  endpoint: url.pathname,
                  responseFields: discovered.responseFields
                }
              } : {}
            };
            if (identity.identityConflict) return evidence;
            if (identity.userId || !partial && (identity.username || identity.email)) {
              if (!url.search && !url.hash) this.transportHints.set(key, { endpoint, mode });
              if (identity.userId) return evidence;
            }
            partial ??= evidence;
          } catch (error) {
            trace(
              url.pathname,
              modes[mode],
              error?.name === "AbortError" ? "请求超时" : "请求失败或被站点访问校验拦截"
            );
          } finally {
            clearTimeout(timer);
          }
        }
        return null;
      };
      const readCookie = async (candidates = endpoints) => {
        for (const endpoint of candidates) {
          let identity = await read({}, "include", [endpoint], "cookie");
          if (identity) return identity;
          if (hint) {
            identity = await read(this.userIdHeaders(hint), "include", [endpoint], "hint");
            if (identity) return identity;
          }
        }
        return null;
      };
      let token = explicitToken ?? (site.tokenConfig ? this.readStorage(site.tokenConfig.storageKey, site.tokenConfig.storageType) : source?.tokenKey ? this.readStorage(source.tokenKey, source.tokenStorageType) : void 0);
      if (!token && family === "sub2api")
        for (const storageKey of ["auth_token", "access_token", "token"]) {
          const value = this.readStorage(storageKey);
          if (value && value.length > 20 && !value.startsWith("{")) {
            token = value;
            break;
          }
        }
      const authorization = token ? {
        [site.tokenConfig?.headerName || source?.tokenHeader || "Authorization"]: `${site.tokenConfig?.headerPrefix ?? source?.tokenPrefix ?? "Bearer "}${token}`
      } : null;
      if (remembered) {
        let identity = null;
        if (explicitToken && remembered.mode === "token" && authorization)
          identity = await read(
            { ...authorization, ...this.userIdHeaders(hint) },
            "omit",
            [remembered.endpoint],
            "token"
          );
        else if (!explicitToken) {
          identity = remembered.mode === "hint" && hint ? await read(this.userIdHeaders(hint), "include", [remembered.endpoint], "hint") : await readCookie([remembered.endpoint]);
          if (!identity && remembered.mode === "token" && authorization)
            identity = await read(
              { ...authorization, ...this.userIdHeaders(hint) },
              "omit",
              [remembered.endpoint],
              "token"
            );
          if (!identity && remembered.mode === "bootstrap" && site.authBootstrap) {
            const headers = await this.bootstrapHeaders(site);
            if (Object.keys(headers).length)
              identity = await read(
                { ...headers, ...this.userIdHeaders(hint) },
                "omit",
                [remembered.endpoint],
                "bootstrap"
              );
          }
        }
        if (identity) return identity;
        this.transportHints.delete(key);
      }
      if (!explicitToken) {
        const identity = await readCookie();
        if (identity) return identity;
      }
      if (authorization) {
        const identity = await read(
          { ...authorization, ...this.userIdHeaders(hint) },
          "omit",
          endpoints,
          "token"
        );
        if (identity) return identity;
      }
      if (source?.endpoint && !sameOrigin(source.endpoint) && Date.now() < deadline) {
        const identity = await this.readExternal(site, source, explicitToken);
        if (identity?.userId || identity?.identityConflict) return identity;
        partial ??= identity;
      }
      if (!explicitToken && site.authBootstrap && Date.now() < deadline) {
        const headers = await this.bootstrapHeaders(site);
        if (Object.keys(headers).length) {
          const identity = await read(
            { ...headers, ...this.userIdHeaders(hint) },
            "omit",
            endpoints,
            "bootstrap"
          );
          if (identity) return identity;
        }
      }
      if (options.serverOnly === true || explicitToken) return partial;
      const visible = this.readPage(site);
      if (!partial) return visible;
      if (visible?.identityConflict) return visible;
      if (visible?.userId) {
        if (partial.username && visible.username && !identitiesEqual(partial.username, visible.username) || partial.email && visible.email && !identitiesEqual(partial.email, visible.email))
          return {
            source: "visible",
            identityConflict: `身份接口的登录名与页面用户 ID ${visible.userId} 所属账号不一致`
          };
        return { ...partial, ...visible };
      }
      return partial;
    }
  };
  var identityPatterns = {
    excludedText: /(邀请|受邀|推荐|推广|上级|下级|下线|团队|排行|榜|赞助|作者|客服|管理员|中奖|获奖|公告|invit|referr|sponsor|winner|leaderboard|announcement)/i,
    excludedSection: /中奖(?:名单|记录|用户)|获奖(?:名单|记录)|排行榜|排名榜|用户列表|成员列表|历史记录|公告|\b(?:winners?|leaderboard|rankings?|draw history|announcements?)\b/i,
    profileTitle: /^(?:个人资料|个人信息|账户信息|账号信息|我的账户|我的账号|我的资料|profile|my account|account (?:info(?:rmation)?|details))\s*[:：]?$/i,
    personalLabel: /^(?:当前(?:登录)?(?:账号|账户|用户)|我的(?:账号|账户|邮箱))\s*[:：]?/,
    identityLabel: /(?<![A-Za-z])(?:用户\s*ID|User\s*ID|UID)\s*[:：#]?\s*\d|当前(?:登录)?(?:账号|账户|用户)|用户名|登录名|账[号户]|邮箱|电子邮件|\b(?:e-?mail|username|account)\b|欢迎回来|welcome back/i,
    accountMenu: /退出登录|退出账号|注销登录|个人资料|账户设置|账号设置|\b(?:log\s*out|sign\s*out|my account|account settings|profile)\b/i
  };
  function filterIdentityText(e, t = false) {
    if (!e) return ``;
    let n = [], r = false, i = false;
    for (let a of e.split(/[\r\n]+/).map((e2) => e2.trim()).filter(Boolean)) {
      if (identityPatterns.excludedSection.test(a)) {
        r = true, i = false;
        continue;
      }
      let e2 = identityPatterns.profileTitle.test(a);
      if ((e2 || identityPatterns.personalLabel.test(a)) && (r = false), r || identityPatterns.excludedText.test(a)) {
        i = false;
        continue;
      }
      let o = e2 || identityPatterns.identityLabel.test(a), s = i && /^[^\s<>]{2,80}(?:\s*[·|]\s*[^\r\n]{1,40})?$/.test(a);
      (t || o || s) && n.push(a), i = o;
    }
    return n.join(`
`);
  }
  function isIdentityElementVisible(e) {
    for (let t = e; t; t = t.parentElement) {
      if (t.hidden || t.getAttribute(`aria-hidden`) === `true` || t.hasAttribute(`inert`)) return false;
      let e2 = getComputedStyle(t);
      if (e2.display === `none` || e2.visibility === `hidden` || e2.visibility === `collapse` || Number.parseFloat(e2.opacity || `1`) <= 0.02)
        return false;
    }
    return true;
  }
  function collectIdentityText(document2 = globalThis.document) {
    let bodyText = document2.body?.innerText;
    if (document2.body && typeof document2.createTreeWalker === "function") {
      const text = [];
      const walker = document2.createTreeWalker(document2.body, 4);
      let node;
      let count = 0;
      while ((node = walker.nextNode()) && count++ < 6e3) {
        const parent = node.parentElement;
        if (!parent || parent.closest?.(
          'script, style, table, [role="table"], [role="grid"], [role="list"], [role="listitem"], .lottery-sidebar, [data-checkin-learning-guide]'
        ) || parent.closest?.("form")?.querySelector?.('input[type="password"]') || !isIdentityElementVisible(parent))
          continue;
        if (node.textContent?.trim()) text.push(node.textContent.trim());
      }
      bodyText = text.join("\n");
    }
    let e = [(0, filterIdentityText)(bodyText)];
    if (typeof document2.querySelectorAll != `function`) return e[0];
    for (let t of document2.querySelectorAll(
      `[role="menu"], [aria-haspopup="menu"], [aria-haspopup="true"]`
    )) {
      if (!(0, isIdentityElementVisible)(t) || t.closest(`table, [role="table"], [role="grid"], .lottery-sidebar`))
        continue;
      let n = t.innerText ?? t.textContent ?? ``;
      if (!n.trim() || n.length > 2e3) continue;
      let r = t.getAttribute(`role`) === `menu` && identityPatterns.accountMenu.test(n), i = t.hasAttribute(`aria-haspopup`) && (!!t.closest(`header, nav, [role="banner"]`) || /user|account|profile|avatar|用户|账号|账户|个人|头像/i.test(
        `${t.getAttribute(`aria-label`) ?? ``} ${t.getAttribute(`title`) ?? ``}`
      ));
      (r || i) && e.push((0, filterIdentityText)(n, true));
    }
    return e.filter(Boolean).join(`
`);
  }
  function uniqueIdentityValue(e) {
    let t = new Map(e.map((e2) => [e2.toLowerCase(), e2]));
    return t.size === 1 ? t.values().next().value : void 0;
  }
  function parseVisibleIdentity(e) {
    if (!e) return null;
    let t = { source: `visible` }, ids = (0, findVisibleUserIds)(e, true);
    if (ids.length > 1)
      return {
        source: `visible`,
        identityConflict: `页面同时显示多个当前用户 ID（${ids.join(`、`)}）`
      };
    ids[0] && (t.userId = ids[0]);
    let r = [...e.matchAll(/(?<![\w.+@*-])@([A-Za-z0-9][A-Za-z0-9._-]{1,38})\b/g)].map((e2) => e2[1]).filter((e2) => !e2.includes(`.`)), i = [
      ...e.matchAll(
        /(?:^|\s)(?:用户名|登录名|当前(?:登录)?(?:账号|账户)|username|login name)(?:\s*[:：]\s*|\s+)([\p{L}\p{N}][\p{L}\p{N}._+@-]{1,79})/giu
      )
    ].map((e2) => e2[1]).filter((e2) => !e2.includes(`@`)), a = (0, uniqueIdentityValue)(i.length ? i : r);
    a && (t.username = a);
    let o = (0, uniqueIdentityValue)(
      [...e.matchAll(/(?<![\w.+*-])[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g)].map((e2) => e2[0])
    );
    return o && (t.email = o), t.userId || t.username || t.email ? t : null;
  }
  function readVisibleAccountIdentity(document2 = globalThis.document, location2 = globalThis.location, source = {}, options = {}) {
    if (!document2) return null;
    const textIdentity = (0, parseVisibleIdentity)((0, collectIdentityText)(document2));
    if (typeof document2.querySelectorAll !== `function`) return textIdentity;
    const values = /* @__PURE__ */ new Map();
    const locations = /* @__PURE__ */ new Map();
    const profileWords = /个人资料|个人信息|我的(?:账户|账号|资料)|(?:^|[\s_-])(?:profile|personal|my[-_ ]account|account[-_ ](?:info|details)|user[-_ ]info)(?:$|[\s_-])/i;
    const excludedWords = /中奖|获奖|邀请|推荐|排行榜|用户列表|成员列表|公告|(?:^|[\s_-])(?:winners?|leaderboard|rankings?|user[-_ ]list|member[-_ ]list|invitation|referral|announcement)(?:$|[\s_-])/i;
    const profilePath = /\/(?:profile|personal|account|account-settings|my-account)(?:\/|$)/i.test(
      `${typeof location2 === `undefined` ? `` : location2.pathname}${typeof location2 === `undefined` ? `` : location2.hash}`
    );
    function fieldName(label) {
      const name = String(label ?? ``).replace(/[:：#*＊]/g, ``).replace(/[\s_-]+/g, ``).toLowerCase();
      if (/^(?:用户id|用户编号|账号id|账户id|userid|uid|accountid|id)$/.test(name)) return `userId`;
      if (/^(?:用户名|登录名|账号名|账户名|账号|账户|当前(?:登录)?(?:账号|账户|用户)|我的(?:账号|账户)|username|loginname|account|currentuser|currentaccount|myaccount)$/.test(
        name
      ))
        return `username`;
      if (/^(?:邮箱|电子邮箱|电子邮件|我的邮箱|email|emailaddress)$/.test(name)) return `email`;
      if (/^(?:昵称|显示名称|displayname|nickname)$/.test(name)) return `displayName`;
      return null;
    }
    function metadata(node) {
      return [
        node.getAttribute?.(`aria-label`),
        node.getAttribute?.(`title`),
        node.getAttribute?.(`data-testid`),
        node.id,
        typeof node.className === `string` ? node.className : ``
      ].filter(Boolean).join(` `);
    }
    function excluded(node) {
      if (!(0, isIdentityElementVisible)(node)) return true;
      if (node.closest?.(
        `table, [role="table"], [role="grid"], [role="list"], [role="listitem"], .lottery-sidebar`
      ))
        return true;
      for (let current = node; current && !/^(?:BODY|HTML)$/.test(current.tagName); current = current.parentElement) {
        if (excludedWords.test(metadata(current))) return true;
        const heading = current.querySelector?.(
          `:scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > [role="heading"]`
        );
        if (heading && excludedWords.test(heading.innerText ?? heading.textContent ?? ``)) return true;
      }
      const form = node.closest?.(`form`);
      return !!form?.querySelector?.(`input[type="password"]`);
    }
    function profileArea(node, label) {
      if (/^(?:当前|我的|current\s|my\s)/i.test(String(label ?? ``).trim())) return true;
      if (profilePath) return true;
      if (source?.pagePath) {
        try {
          const url = new URL(source.pagePath, location2.href);
          if (url.origin === location2.origin && `${url.pathname}${url.hash}` === `${location2.pathname}${location2.hash}`)
            return true;
        } catch {
        }
      }
      for (let current = node; current && !/^(?:BODY|HTML)$/.test(current.tagName); current = current.parentElement) {
        if (profileWords.test(metadata(current))) return true;
        const heading = current.querySelector?.(
          `:scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > [role="heading"]`
        );
        if (heading && profileWords.test(heading.innerText ?? heading.textContent ?? ``)) return true;
      }
      return false;
    }
    function add(label, node, value, explicit = false) {
      const field = fieldName(label);
      if (!field || !node || excluded(node) || !explicit && !profileArea(node, label)) return;
      const normalized = String(value ?? ``).trim();
      if (!normalized || normalized.length > 128 || /[\r\n]/.test(normalized)) return;
      if (field === `userId` && !/^[\w.:-]{1,128}$/.test(normalized)) return;
      if (field === `username` && !/^[\p{L}\p{N}@][\p{L}\p{N}._+@'-]{1,79}$/u.test(normalized))
        return;
      if (field === `email` && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return;
      const candidates = values.get(field) ?? /* @__PURE__ */ new Set();
      candidates.add(normalized);
      values.set(field, candidates);
      if (options.collectSource === true) {
        const descriptor = describeIdentityField(node, field, document2, normalized);
        if (descriptor) {
          const fields = locations.get(field) ?? [];
          fields.push(descriptor);
          locations.set(field, fields);
        }
      }
    }
    function controlValue(control) {
      const tag = control?.tagName?.toUpperCase();
      if (tag === `OUTPUT`) return control.innerText ?? control.textContent;
      if ((tag === `INPUT` || tag === `TEXTAREA`) && (control.readOnly || control.disabled || control.hasAttribute?.(`readonly`) || control.hasAttribute?.(`disabled`)) && !/^(?:password|hidden)$/i.test(control.type ?? ``))
        return control.value;
      return null;
    }
    for (const term of document2.querySelectorAll(`dt`)) {
      const description = term.nextElementSibling;
      if (description?.tagName?.toUpperCase() !== `DD` || excluded(term)) continue;
      add(
        term.innerText ?? term.textContent,
        description,
        description.innerText ?? description.textContent
      );
    }
    for (const label of document2.querySelectorAll(`label`)) {
      if (excluded(label)) continue;
      const id = label.htmlFor || label.getAttribute?.(`for`);
      const control = id ? document2.getElementById?.(id) : label.querySelector?.(`input, textarea, output`);
      add(label.innerText ?? label.textContent, control, controlValue(control));
    }
    for (const control of document2.querySelectorAll(
      `input[readonly], input[disabled], textarea[readonly], textarea[disabled], output`
    )) {
      const label = control.getAttribute?.(`aria-label`) || control.getAttribute?.(`name`) || control.id;
      add(label, control, controlValue(control));
    }
    let profileCardFound = false;
    for (const tag of document2.querySelectorAll(`.semi-tag`)) {
      const match = (tag.innerText ?? tag.textContent ?? ``).trim().match(/^(?:用户\s*ID|User\s*ID|UID|ID)\s*[:：#]\s*([\w.:-]{1,128})$/i);
      if (!match || excluded(tag) || !profileArea(tag, `ID`)) continue;
      const nameNode = tag.parentElement?.previousElementSibling;
      const name = (nameNode?.innerText ?? nameNode?.textContent ?? ``).trim();
      if (!nameNode || !/^[\p{L}\p{N}@][\p{L}\p{N}._+@'-]{1,79}$/u.test(name)) continue;
      let card = tag.parentElement;
      for (let depth = 0; card && depth < 4; depth++, card = card.parentElement) {
        if (excluded(card)) break;
        if (card.querySelector?.(`.semi-avatar, [data-testid="user-avatar"], [aria-label="用户头像"]`)) {
          add(`用户 ID`, tag, match[1]);
          add(`用户名`, nameNode, name);
          profileCardFound = true;
          break;
        }
      }
    }
    for (const node of [...document2.querySelectorAll(`div, span, p`)].slice(0, 1500)) {
      if (node.children?.length || excluded(node) || !profileArea(node, `ID`)) continue;
      const label = parseVisibleUserIdLabel(node.innerText ?? node.textContent);
      if (!label) continue;
      let currentCard = false;
      for (let card = node.parentElement, depth = 0; card && depth < 3; depth++, card = card.parentElement) {
        if (excluded(card) || /^(?:BODY|HTML)$/.test(card.tagName)) break;
        const context = (card.innerText ?? card.textContent ?? "").replace(/\s+/g, " ").trim();
        if (context.length <= 350 && /(?:^|\s)(?:current\s+(?:user|account)|当前(?:用户|账号|账户))(?:\s|[:：]|$)/i.test(context)) {
          currentCard = true;
          break;
        }
      }
      if (currentCard) {
        add(`用户 ID`, node, label.value);
        profileCardFound = true;
      }
    }
    const fieldLabels2 = {
      userId: `用户 ID`,
      username: `用户名`,
      email: `邮箱`,
      displayName: `昵称`
    };
    const mappedFields = new Set(
      Object.keys(source?.pageFields ?? {}).filter((field) => fieldLabels2[field])
    );
    for (const field of mappedFields) {
      values.delete(field);
      locations.delete(field);
    }
    let onIdentityPage = true;
    if (source?.pagePath) {
      try {
        const page = new URL(source.pagePath, location2.href);
        onIdentityPage = page.origin === location2.origin && page.pathname + page.hash === location2.pathname + location2.hash;
      } catch {
        onIdentityPage = false;
      }
    }
    let mappedConflict;
    for (const [field, selector] of Object.entries(source?.pageFields ?? {})) {
      if (!fieldLabels2[field]) continue;
      let nodes;
      try {
        nodes = onIdentityPage ? [...document2.querySelectorAll(selector)].filter(isIdentityElementVisible) : [];
      } catch {
        continue;
      }
      if (nodes.length > 1) {
        mappedConflict = `本站保存的${fieldLabels2[field]}读取位置命中了多个可见元素`;
        continue;
      }
      const node = nodes[0];
      const rule = source.pageFieldRules?.[field];
      const value = readIdentityField(node, field, rule);
      if (!value) continue;
      values.set(field, /* @__PURE__ */ new Set([value]));
      if (options.collectSource === true) {
        const descriptor = describeIdentityField(node, field, document2, value);
        if (descriptor)
          locations.set(field, [{ ...descriptor, selector, ...rule ? { rule } : {} }]);
      }
    }
    if (mappedConflict) return { source: "visible", identityConflict: mappedConflict };
    const ids = new Set(values.get(`userId`) ?? []);
    if (textIdentity?.userId && !mappedFields.has("userId")) ids.add(textIdentity.userId);
    if (textIdentity?.identityConflict && !mappedFields.has("userId")) return textIdentity;
    if (ids.size > 1)
      return {
        source: `visible`,
        identityConflict: `页面同时显示多个当前用户 ID（${[...ids].join(`、`)}）`
      };
    const identity = { ...textIdentity, source: `visible` };
    for (const field of mappedFields) delete identity[field];
    if (mappedFields.has("userId")) delete identity.identityConflict;
    for (const [field, candidates] of values)
      if (candidates.size === 1) identity[field] = [...candidates][0];
    if (values.size) identity.evidence = profileCardFound ? `profile-card` : `structured-fields`;
    if (options.collectSource === true && location2?.origin) {
      const pageFields = {};
      const pageFieldRules = {};
      for (const [field, descriptors] of locations) {
        const descriptor = descriptors.find((item) => item.value === identity[field]);
        if (!descriptor || new Set(descriptors.map((item) => item.selector)).size !== 1) continue;
        pageFields[field] = descriptor.selector;
        pageFieldRules[field] = descriptor.rule;
      }
      if (Object.keys(pageFields).length)
        identity.identitySource = {
          pagePath: location2.pathname + location2.hash,
          pageFields,
          pageFieldRules
        };
    }
    return identity.userId || identity.username || identity.email ? identity : null;
  }
  function findVisibleUserIds(e, all = false) {
    let t = /(?<![A-Za-z])(?:用户\s*ID|User\s*ID|UID)\s*[:：#]?\s*(\d{1,12})\b/gi, n = /* @__PURE__ */ new Set();
    for (let r of e.matchAll(t)) {
      let t2 = r[1];
      if (!t2) continue;
      let i = e.slice(Math.max(0, (r.index ?? 0) - 14), r.index ?? 0);
      identityPatterns.excludedText.test(i) || n.add(t2);
    }
    return all ? [...n] : n.size === 1 ? [...n][0] : void 0;
  }

  // src/modules/learning/identity-learning.js
  var fieldLabels = { userId: "用户 ID", username: "登录名", email: "邮箱" };
  var guideSelector = "[data-checkin-learning-guide], [data-checkin-identity-picker]";
  function identitySourceSummary(identity, source = identity?.identitySource) {
    const field = identity?.userId ? "userId" : identity?.username ? "username" : "email";
    const value = identity?.[field];
    if (!value) return "尚未读到当前登录身份，可以点选自己的用户 ID 或唯一登录名";
    const position = identity.source === "api" ? `${source?.endpoint ?? identity.endpoint ?? ""} → ${source?.responseFields?.[field] ?? field}` : source?.pageFields?.[field] ? `${source.pagePath ?? ""} → ${fieldLabels[field]}字段` : "当前页面";
    return `已识别${fieldLabels[field]} ${value} · ${position}`;
  }
  var IdentitySourceLearner = class {
    constructor({
      site,
      send,
      requestIdentity,
      getProgress = () => ({}),
      onStatus = () => {
      },
      document: document2 = globalThis.document,
      location: location2 = globalThis.location,
      window: window2 = globalThis.window,
      wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    }) {
      Object.assign(this, {
        site,
        send,
        requestIdentity,
        getProgress,
        onStatus,
        document: document2,
        location: location2,
        window: window2,
        wait
      });
      this.source = readIdentitySource(site) ?? {};
      this.selectedFields = /* @__PURE__ */ new Set();
      this.active = false;
      this.picking = null;
      this.status = "自动查找身份接口和资料字段；也可点选自己的用户 ID 或唯一登录名";
      this.pendingApi = null;
      this.sentApi = null;
      this.lastProbeAt = 0;
      this.probeAttempts = /* @__PURE__ */ new Map();
      this.learnedPhase = null;
      this.onClick = this.onClick.bind(this);
      this.onMove = this.onMove.bind(this);
      this.onKey = this.onKey.bind(this);
      this.onPointer = this.onPointer.bind(this);
    }
    path() {
      return this.location.pathname + this.location.hash;
    }
    setStatus(text) {
      this.status = text;
      this.onStatus(text, this.picking);
    }
    readVisible() {
      const identity = readVisibleAccountIdentity(this.document, this.location, this.source, {
        collectSource: true
      });
      if (identity?.identitySource && this.selectedFields.size && this.source.pagePath === this.path())
        identity.selectedFields = [...this.selectedFields];
      return identity;
    }
    async reportVisible(observation) {
      return this.report(observation);
    }
    async report(observation) {
      const result = await this.send({
        ...observation,
        stable: true,
        ...observation.identity.identitySource ? { identitySource: observation.identity.identitySource } : {},
        ...observation.identity.selectedFields ? { selectedFields: observation.identity.selectedFields } : {}
      });
      if (result?.ok && !result.ignored) {
        if (!this.picking) this.setStatus(identitySourceSummary(observation.identity));
      } else if (result?.ignored) {
        if (!this.picking)
          this.setStatus(result.reason || "已读到页面身份；请先演示本账号的登录，再建立绑定");
      } else {
        this.setStatus(result?.error || "身份读取位置保存失败");
      }
      return result;
    }
    canReadApi() {
      const progress = this.getProgress();
      return !!(progress.signedIn || progress.login) && !/(?:^|\/)(?:login|signin|oauth|authorize|logout)(?:\/|$)/i.test(this.path()) && !this.document.querySelector?.('form input[type="password"]');
    }
    probe(force = false) {
      if (this.pendingApi) return this.pendingApi;
      if (!this.requestIdentity || !this.canReadApi() || !force && !this.active)
        return Promise.resolve();
      const path = this.path();
      const phase = JSON.stringify([path, this.getProgress().loginAt]);
      if (!force && (this.learnedPhase === phase || (this.probeAttempts.get(phase) ?? 0) >= 3))
        return Promise.resolve();
      this.probeAttempts.set(phase, (this.probeAttempts.get(phase) ?? 0) + 1);
      this.lastProbeAt = Date.now();
      this.pendingApi = (async () => {
        const read = () => this.requestIdentity({ ...this.site, identitySource: this.source }, void 0, {
          discover: true,
          serverOnly: true,
          timeoutMs: 3e3
        });
        const first = await read();
        if (!first?.identitySource || first.source !== "api") {
          if (!this.picking && !this.selectedFields.size && this.active)
            this.setStatus("身份接口未返回可核对字段；请点选个人资料页中自己的用户 ID 或唯一登录名");
          return;
        }
        await this.wait(350);
        const second = await read();
        if (!this.active && !force || this.path() !== path || !stableIdentitySamples(first, second) || JSON.stringify(first.identitySource) !== JSON.stringify(second?.identitySource))
          return;
        const key = JSON.stringify([
          phase,
          second.userId,
          second.username,
          second.email,
          second.identitySource
        ]);
        if (this.sentApi === key) return;
        const result = await this.report({ identity: second, path });
        if (result?.ok && !result.ignored) {
          this.sentApi = key;
          this.learnedPhase = phase;
        }
      })().finally(() => {
        this.pendingApi = null;
      });
      return this.pendingApi;
    }
    start() {
      if (this.active) return;
      this.active = true;
      this.document.addEventListener("click", this.onClick, true);
      this.document.addEventListener("pointermove", this.onMove, true);
      this.document.addEventListener("keydown", this.onKey, true);
      for (const name of ["pointerdown", "pointerup", "mousedown", "mouseup"])
        this.document.addEventListener(name, this.onPointer, true);
      this.timer = setInterval(() => {
        if (Date.now() - this.lastProbeAt >= 5e3) this.probe().catch(() => {
        });
      }, 650);
      this.setStatus(this.status);
      this.probe().catch(() => {
      });
    }
    stop() {
      this.active = false;
      clearInterval(this.timer);
      this.timer = void 0;
      this.document.removeEventListener("click", this.onClick, true);
      this.document.removeEventListener("pointermove", this.onMove, true);
      this.document.removeEventListener("keydown", this.onKey, true);
      for (const name of ["pointerdown", "pointerup", "mousedown", "mouseup"])
        this.document.removeEventListener(name, this.onPointer, true);
      this.cancelPick(false);
    }
    async flush() {
      await this.pendingApi;
      await this.probe(true);
    }
    pick(field) {
      if (!fieldLabels[field] || !this.active) return;
      if (this.document.querySelector?.('form input[type="password"]')) {
        this.setStatus("请先登录并打开自己的个人资料页，再选择身份字段");
        return;
      }
      if (this.picking === field) {
        this.cancelPick();
        return;
      }
      this.picking = field;
      this.setStatus(`点击页面中自己的${fieldLabels[field]}；不要选择昵称或其他用户。按 Esc 取消`);
    }
    cancelPick(update = true) {
      this.picking = null;
      this.overlay?.remove();
      this.overlay = null;
      if (update) this.setStatus("已退出字段点选，可继续演示登录和签到");
    }
    target(event) {
      return event.composedPath().find((node) => node?.nodeType === 1 && node.tagName);
    }
    inGuide(event) {
      return event.composedPath().some((node) => node?.matches?.(guideSelector));
    }
    onPointer(event) {
      if (!this.picking || this.inGuide(event)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    onKey(event) {
      if (!this.picking || event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.cancelPick();
    }
    onMove(event) {
      if (!this.picking || this.inGuide(event)) return;
      const node = this.target(event);
      if (!node || node === this.document.body || node === this.document.documentElement) return;
      const rect = node.getBoundingClientRect();
      if (!this.overlay) {
        this.overlay = this.document.createElement("div");
        this.overlay.setAttribute("data-checkin-identity-picker", "");
        this.overlay.style.cssText = "position:fixed;z-index:2147483646;pointer-events:none;border:2px solid #fbbf24;background:rgba(251,191,36,.12);box-sizing:border-box;border-radius:3px";
        this.document.body.append(this.overlay);
      }
      Object.assign(this.overlay.style, {
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`
      });
    }
    onClick(event) {
      if (!this.picking || this.inGuide(event)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const field = this.picking;
      const node = this.target(event);
      const labels = [
        node?.getAttribute?.("aria-label"),
        node?.getAttribute?.("name"),
        node?.id,
        node?.previousElementSibling?.textContent
      ].join(" ");
      if (field === "username" && /昵称|显示名|nickname|display[-_ ]?name/i.test(labels)) {
        this.setStatus("这是显示昵称，请选择本站的唯一登录名，或改选用户 ID");
        return;
      }
      const descriptor = describeIdentityField(node, field, this.document);
      if (!descriptor) {
        this.setStatus(
          `这个元素不能稳定读取${fieldLabels[field]}，请点中身份值本身；不要选登录输入框`
        );
        return;
      }
      if (this.source.pagePath !== this.path()) {
        this.source = { ...this.source, pageFields: {}, pageFieldRules: {} };
        this.selectedFields.clear();
      }
      this.source = {
        ...this.source,
        pagePath: this.path(),
        pageFields: { ...this.source.pageFields, [field]: descriptor.selector },
        pageFieldRules: { ...this.source.pageFieldRules, [field]: descriptor.rule }
      };
      this.selectedFields.add(field);
      this.cancelPick(false);
      this.setStatus(`已选中${fieldLabels[field]} ${descriptor.value}，正在连续读取并核验`);
    }
  };

  // src/modules/learning/lottery-learning.js
  var auxiliaryLotteryText = /记录|紀錄|历史|歷史|规则|規則|概率|奖池|獎池|结果|結果|说明|說明|知道了|关闭|關閉|取消|返回|复制|複製|\b(?:history|records?|rules?|odds|results?|summary|close|cancel|back|copy)\b/i;
  var lotteryActionText = /抽[奖獎签籤]|翻牌|(?:连|連)抽|[单單]抽|抽\s*(?:[1-9]\d*|[一二三四五六七八九十百]+)\s*次|(?:立即|开始|開始|免费|免費|再|点击|點擊)抽|\b(?:draw|spin|scratch)\b/i;
  var lotteryRoute = /(?:^|\/)(?:lottery|lotteries|lucky[-_]?draw|draw|prize|spin)(?:\/|$)/i;
  var graphicLotteryControl = /(?:^|[\s_-])(?:gift|spin|wheel|scratch|draw(?:[\s_-](?:btn|button|control))?|lottery[\s_-](?:btn|button|control))(?:$|[\s_-])/i;
  var lotteryCompletedWords = Object.freeze([
    "抽奖成功",
    "抽奖完成",
    "开奖成功",
    "恭喜中奖",
    "恭喜中獎",
    "谢谢参与",
    "謝謝參與",
    "未中奖",
    "未中獎",
    "未中",
    "You won",
    "Thanks for playing",
    "Better luck next time",
    "Draw successful",
    "Draw complete",
    "Draw completed"
  ]);
  var lotteryAlreadyWords = Object.freeze([
    "今日梦火抽签次数已耗尽",
    "今日抽奖次数已耗尽",
    "今日抽奖次数已用完",
    "今日抽奖次数已达上限",
    "已达到今日抽奖上限",
    "This draw is complete",
    "You have already drawn today",
    "Daily draw limit reached"
  ]);
  var lotteryResultPanels = [
    "[data-lottery-result]",
    "[data-draw-result]",
    ".lottery-result",
    ".draw-result",
    ".result-pop",
    '[role="dialog"]',
    '[aria-modal="true"]',
    '[role="alert"]',
    '[role="status"]'
  ];
  function compactText(value) {
    return typeof value === "string" ? value.normalize("NFKC").replace(/\s+/g, " ").trim() : "";
  }
  function matchesLotteryActionText(value) {
    const text = compactText(value);
    return !!text && !auxiliaryLotteryText.test(text) && lotteryActionText.test(text);
  }
  function mentionsLotteryAction(value) {
    return lotteryActionText.test(compactText(value));
  }
  function isLotteryPagePath(path) {
    const text = compactText(path);
    return lotteryRoute.test(text.split(/[?#]/, 1)[0]) || lotteryRoute.test(text.split("#")[1] ?? "");
  }
  function isLearnedLotteryAction(event) {
    if ((event?.type ?? event?.kind) !== "click" || event.href || event.gesture === "right")
      return false;
    if (event.loginAction === "entry" || event.loginAction === "oauth") return false;
    if (auxiliaryLotteryText.test(event.label ?? "")) return false;
    return event.checkinAction === "lottery" || matchesLotteryActionText(event.label);
  }
  function describeLotteryClick(element, label, path, isPointer = () => false) {
    if (!element || element.disabled === true || element.getAttribute("aria-disabled") === "true" || element.matches('a[href], [role="link"], label, input[type="radio"], input[type="checkbox"]'))
      return;
    const interactive = element.matches(
      'button, [role="button"], input[type="button"], input[type="submit"], [onclick], [tabindex]:not([tabindex="-1"])'
    );
    const accessibleText = [label, element.getAttribute("aria-label"), element.getAttribute("title")].filter(Boolean).join(" ");
    if (auxiliaryLotteryText.test(accessibleText)) return;
    if (interactive && matchesLotteryActionText(accessibleText)) return "lottery";
    const metadata = [
      element.id,
      element.getAttribute("class"),
      element.getAttribute("data-testid"),
      element.getAttribute("data-action")
    ].filter((value) => typeof value === "string").join(" ");
    if (!graphicLotteryControl.test(metadata) || !interactive && !isPointer(element)) return;
    if (element.querySelector('button, a[href], [role="button"], input, select')) return;
    if (isLotteryPagePath(path)) return "lottery";
    for (let parent = element.parentElement, depth = 0; parent && depth < 2; depth++) {
      if (parent.matches("body, nav, aside, form, table")) break;
      const context = compactText(parent.innerText ?? parent.textContent ?? "");
      if (context.length <= 300 && /抽[奖獎签籤]|开奖|開獎|\blottery\b|\blucky\s+draw\b/i.test(context))
        return "lottery";
      parent = parent.parentElement;
    }
  }
  function stableLotteryControlSelector(element, root) {
    const classes = (element.getAttribute("class") ?? "").split(/\s+/).filter(
      (name) => /^(?:gift|wheel|scratch|(?:lottery|draw|spin)[-_](?:btn|button|control|gift))$/i.test(name)
    );
    for (const name of classes) {
      const selector = `${element.tagName.toLowerCase()}.${name}`;
      const matches = root.querySelectorAll(selector);
      if (matches.length === 1 && matches[0] === element) return selector;
    }
  }
  function snapshotLotteryResults(root, isVisible) {
    const snapshot = /* @__PURE__ */ new Map();
    for (const selector of lotteryResultPanels) {
      let elements;
      try {
        elements = root.querySelectorAll(selector);
      } catch {
        continue;
      }
      for (const element of elements) {
        if (snapshot.size >= 80) return snapshot;
        if (!isVisible(element)) continue;
        snapshot.set(
          element,
          compactText(element.innerText ?? element.textContent ?? "").slice(0, 1500)
        );
      }
    }
    return snapshot;
  }
  function matchedOutcome(text) {
    const normalized = compactText(text).toLowerCase();
    const words = (candidates) => candidates.filter((word) => normalized.includes(compactText(word).toLowerCase())).slice(0, 4);
    const already = words(lotteryAlreadyWords);
    if (already.length) return { kind: "already", words: already };
    if (/抽奖失败|抽獎失敗|余额不足|餘額不足|\b(?:draw|lottery) failed\b|insufficient (?:balance|funds)|network error/i.test(
      normalized
    ))
      return;
    const completed = words(lotteryCompletedWords);
    if (completed.length) return { kind: "success", words: completed };
  }
  function resultPanelSelector(element, root, isVisible, selectorFor) {
    for (const selector2 of lotteryResultPanels) {
      if (!element.matches(selector2)) continue;
      const visible = [...root.querySelectorAll(selector2)].filter(isVisible);
      if (visible.length === 1 && visible[0] === element) return selector2;
    }
    const selector = selectorFor?.(element);
    return typeof selector === "string" && selector.length <= 300 && selector.trim() && !selector.includes("text=") ? selector.trim() : void 0;
  }
  function readLotteryResultEvidence(before, root, isVisible, selectorFor) {
    const current = snapshotLotteryResults(root, isVisible);
    for (const element of before.keys()) if (!current.has(element)) before.delete(element);
    for (const [element, text] of current) {
      if (before.get(element) === text) continue;
      const outcome = matchedOutcome(text);
      if (!outcome) continue;
      const selector = resultPanelSelector(element, root, isVisible, selectorFor);
      return { ...outcome, ...selector ? { selector } : {} };
    }
  }

  // src/modules/learning/content.js
  function createLearningAutoContent(__contentScope) {
    const __contentState = bindContentState(__contentScope, [
      "sm",
      "cm",
      "lm",
      "um",
      "dm",
      "fm",
      "pm",
      "mm",
      "hm",
      "gm",
      "_m",
      "vm",
      "ym",
      "bm",
      "xm",
      "Sm",
      "Cm",
      "wm",
      "Tm",
      "Em",
      "Dm",
      "Om",
      "km",
      "Am",
      "jm",
      "Mm",
      "Nm",
      "Pm",
      "Fm",
      "Im",
      "Lm",
      "Rm",
      "zm",
      "Bm",
      "gh",
      "_h",
      "vh",
      "yh",
      "bh",
      "xh",
      "Sh",
      "Ch",
      "wh",
      "Th",
      "Eh",
      "Dh",
      "Oh",
      "kh",
      "Ah",
      "jh",
      "Mh",
      "Nh",
      "Ph",
      "Fh",
      "Ih",
      "Lh",
      "Rh",
      "zh",
      "Bh",
      "Vh",
      "Hh",
      "Uh",
      "Wh",
      "Gh",
      "Kh",
      "qh",
      "Jh",
      "Yh",
      "Xh",
      "Zh",
      "Qh",
      "$h",
      "eg",
      "tg",
      "ng",
      "rg",
      "ig",
      "ag",
      "og",
      "sg",
      "cg",
      "lg",
      "ug",
      "dg",
      "fg",
      "pg",
      "mg",
      "hg",
      "gg",
      "_g",
      "vg",
      "yg",
      "bg",
      "xg",
      "Sg",
      "Cg",
      "wg",
      "Tg",
      "Eg",
      "Dg",
      "Og",
      "kg",
      "Ag",
      "jg",
      "Mg",
      "Ng",
      "Pg",
      "Fg",
      "Ig",
      "Lg",
      "Rg",
      "createLearningIdentityMonitor",
      "zg",
      "Bg",
      "Vg",
      "Hg",
      "Ug",
      "Wg"
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
      return __contentScope.pm.test(e.split(/[?#]/)[0] ?? ``) || __contentScope.pm.test((0, __contentScope.cm)(e).split(`?`)[0] ?? ``);
    }
    function bm(e) {
      let t = e.path;
      return typeof t == `string` && t.trim() ? t : void 0;
    }
    function xm(e) {
      let t = (0, __contentScope.cm)(e);
      return __contentScope.lm.test(e) || !!t && __contentScope.lm.test(t);
    }
    function Sm(e) {
      let t = (0, __contentScope.cm)(e);
      return __contentScope.um.test(e) || !!t && __contentScope.um.test(t);
    }
    function Cm(e) {
      let t = (e2) => __contentScope.dm.test(e2) || __contentScope.pm.test(e2) && !__contentScope.fm.test(e2), n = (0, __contentScope.cm)(e);
      return t(e) || !!n && t(n);
    }
    function wm(e) {
      if ((0, __contentScope.Sm)((0, __contentScope.bm)(e) ?? ``)) return true;
      if (e.type === `navigation` || e.type !== `click` && e.type !== `fill`) return false;
      if (__contentScope.hm.test((e.label ?? ``).trim())) return true;
      if (e.type !== `click`) return false;
      let t = e.href;
      if (typeof t != `string` || !t.trim()) return false;
      try {
        return (0, __contentScope.Sm)(new URL(t, `https://learning.invalid`).pathname);
      } catch {
        return false;
      }
    }
    function Tm(e) {
      let t = (e.label ?? ``).trim();
      if (t && __contentScope._m.test(t)) return true;
      let n = e.href, r = (0, __contentScope.bm)(e);
      if (typeof n != `string` || !n.trim() || !r) return false;
      try {
        return new URL(n, `https://learning.invalid`).pathname !== r;
      } catch {
        return false;
      }
    }
    function Em(e) {
      let t = (e.label ?? ``).trim();
      return !!t && __contentScope._m.test(t);
    }
    function Dm(e) {
      if (e.type === `click`) {
        let t = (0, __contentScope.bm)(e);
        return t && (0, __contentScope.xm)(t) || e.loginAction && !(e.loginAction === `submit` && (__contentScope.gm.test(e.label ?? ``) || isLearnedLotteryAction(e))) || (0, __contentScope.wm)(e) || (0, __contentScope.Em)(e) ? `none` : e.evidence?.kind === `already` ? `already` : e.evidence?.kind === `success` ? `confirmed` : (0, __contentScope.Tm)(e) ? `none` : isLearnedLotteryAction(e) || e.label && !e.href && !mentionsLotteryAction(e.label) && __contentScope.gm.test(e.label) ? `action` : `none`;
      }
      if (e.type === `fill` || e.type === `drag`) {
        let t = e.afterText ?? [];
        if (t.some((e2) => __contentScope.vm.test(e2))) return `already`;
        if (t.some((e2) => __contentScope.ym.test(e2))) return `confirmed`;
      }
      return `none`;
    }
    function km(e) {
      let t = [];
      for (let n of e) {
        let e2 = (0, __contentScope.bm)(n);
        e2 && e2 !== t[t.length - 1] && t.push(e2);
      }
      return t;
    }
    function Am(e) {
      return e.filter((e2) => e2.type !== `navigation`).length;
    }
    function jm(e, t) {
      let n = `login`, r = `none`, i = false, a = false, o = false, s = false, c = false, l = false, u = false, d = false;
      for (let f2 of e) {
        if ((0, __contentScope.wm)(f2)) {
          i = true, n = `login`, r = `none`, a = false, o = false, s = false, c = false, u = false, l = false, d = false;
          continue;
        }
        let e2 = (0, __contentScope.bm)(f2), p2 = !!e2 && (0, __contentScope.xm)(e2);
        p2 && (u = true), f2.type === `fill` && (f2.fieldRole !== void 0 || p2 && f2.hasValue) && (a = true);
        let m = s || c;
        if (f2.type === `click` && f2.loginAction === `submit` && (s = true), f2.type === `click` && f2.loginAction === `oauth` && (c = true), f2.type === `fill` && f2.key === `Enter` && (f2.fieldRole === `password` || p2) && (s = true), !(0, __contentScope.sm)(t)) {
          (c || a && s) && (n = `done`, i = false);
          continue;
        }
        if (p2) continue;
        e2 && (0, __contentScope.mm)(e2) && (d = true), e2 && u && (l = true);
        let h = !!e2 && (0, __contentScope.Ju)(e2), g = !!e2 && (0, __contentScope.Cm)(e2);
        (h || g || m || l) && (o = true), i && o && (m || a) && (i = false), n === `login` && o && (n = `profile`), n === `profile` && g && (n = `checkin`);
        let _ = (0, __contentScope.Dm)(f2);
        _ !== `none` && __contentScope.Om[_] > __contentScope.Om[r] && (r = _, n === `login` && (n = `profile`), n === `profile` && (n = `checkin`), n = `done`);
      }
      let f = e[e.length - 1], p = f ? (0, __contentScope.bm)(f) : void 0;
      return {
        kind: t,
        stage: n,
        ...p ? { path: p } : {},
        pages: (0, __contentScope.km)(e).length,
        actions: (0, __contentScope.Am)(e),
        checkin: r,
        credentials: a,
        signedIn: o,
        login: c || a && s,
        logout: i,
        loginAsCheckinAvailable: (0, __contentScope.sm)(t) && o && !i && r === `none` && !d
      };
    }
    function zm(e, t) {
      return (0, __contentScope.sm)(e) ? t === `login` ? `请登录` : t === `profile` ? `已检测到登录成功，请前往能显示当前账号的页面` : t === `checkin` ? `请完成一次签到` : `已录到签到动作` : t === `done` ? `已录到登录动作` : `请登录`;
    }
    function Bm(e) {
      let t = e.kind === `login`, n = t ? 2 : 4, r = t ? e.stage === `done` ? 2 : 1 : e.stage === `login` ? 1 : e.stage === `profile` ? 2 : e.stage === `checkin` ? 3 : 4, i = __contentScope.Mm[r - 1] ?? ``, a = e.stage === `done`, o = t ? __contentScope.Rm[e.stage] : __contentScope.Im[e.stage], s = (t ? __contentScope.Pm : __contentScope.Nm).map((e2, t2) => ({
        label: e2,
        state: t2 + 1 < r ? `done` : t2 + 1 === r ? `current` : `todo`
      }));
      return {
        step: r,
        total: n,
        title: `${i} ${(0, __contentScope.zm)(e.kind, e.stage)}${a ? `，可以点「结束学习」了` : ``}`,
        hint: !t && e.loginAsCheckinAvailable ? `${o}；${__contentScope.Lm}` : o,
        steps: s,
        ...e.logout ? { warning: __contentScope.Fm } : {}
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
      for (let e2 = 0; t && e2 < 4; e2 += 1) {
        if (t.draggable === true || (t.getAttribute(`draggable`) ?? ``).toLowerCase() === `true` || t.getAttribute(`role`) === `slider` || (0, __contentScope.Tg)(t))
          return true;
        t = t.parentElement;
      }
      return false;
    }
    function bh(e) {
      let t = e;
      for (let e2 = 0; t && e2 < 4; e2 += 1) {
        let e3 = t.getAttribute(`role`) ?? ``, n = [
          t.tagName,
          t.id,
          typeof t.className == `string` ? t.className : ``,
          t.getAttribute(`aria-label`) ?? ``,
          t.getAttribute(`title`) ?? ``,
          t.getAttribute(`data-testid`) ?? ``,
          e3
        ].join(` `);
        if (e3 === `slider` || __contentScope._h.test(n)) return true;
        t = t.parentElement;
      }
      return false;
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
      for (let t2 = e ?? null; t2 && t2 !== document.body && t2 !== document.documentElement; t2 = t2.parentElement) {
        if (t2.scrollTop <= 0 || !/(auto|scroll|overlay)/.test(getComputedStyle(t2).overflowY))
          continue;
        let e2 = t2.id && !(0, __contentScope.ag)(t2.id) ? `#${t2.id}` : (0, __contentScope.fg)(t2);
        if (e2 && e2.length <= 300 && document.querySelectorAll(e2).length === 1)
          return {
            scrolled: true,
            scrollContainer: e2,
            containerRatio: (0, __contentScope.Ih)(t2.scrollTop, t2.scrollHeight, t2.clientHeight)
          };
      }
      let t = Math.max(
        Math.round(document.documentElement?.scrollTop ?? 0),
        Math.round(document.body?.scrollTop ?? 0),
        Math.max(0, Math.round(window.scrollY ?? 0))
      ), n = t > 0, r = document.documentElement, i = r ? (0, __contentScope.Ih)(t, r.scrollHeight, r.clientHeight) : void 0;
      return {
        ...n ? { pageY: t } : {},
        ...n && i !== void 0 ? { ratio: i } : {},
        ...n || !e && (0, __contentScope.Fh)() > 0 ? { scrolled: true } : {}
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
      let t = e.scrollBeforeY, n = (0, __contentScope.zh)(e.scrollContainer), r = e.scrollPageTop ? { scrollPageTop: true, ...n ? { scrollContainer: n } : {} } : {};
      if (t === void 0) return r;
      let i = (0, __contentScope.Rh)(t);
      return i !== void 0 && i > 0 ? { scrollBeforeY: i } : r;
    }
    function Vh(e) {
      return e?.pageY !== void 0 && e.pageY > 0 ? { scrollBeforeY: e.pageY } : e?.scrolled ? {
        scrollPageTop: true,
        ...e.scrollContainer ? { scrollContainer: e.scrollContainer } : {}
      } : {};
    }
    function Uh(e) {
      let t = /* @__PURE__ */ new Set();
      for (let n2 of e ?? []) {
        let e2 = n2?.trim().toLowerCase();
        if (!e2) continue;
        e2.length >= __contentScope.Hh && t.add(e2);
        let r = e2.indexOf(`@`);
        r >= __contentScope.Hh && t.add(e2.slice(0, r));
      }
      if (t.size === 0) return () => false;
      let n = /[\p{L}\p{N}._+@-]/u;
      return (e2) => {
        let r = e2?.toLowerCase();
        if (!r) return false;
        for (let e3 of t)
          for (let t2 = r.indexOf(e3); t2 >= 0; t2 = r.indexOf(e3, t2 + 1)) {
            let i = r[t2 - 1], a = r[t2 + e3.length];
            if ((!i || !n.test(i)) && (!a || !n.test(a))) return true;
          }
        return false;
      };
    }
    function Wh(e, t = false) {
      let n = (0, __contentScope.Ph)(e, t ? __contentScope.rt : __contentScope.Ch);
      if (n.length) return { kind: `already`, words: n.slice(0, 4) };
      let r = (0, __contentScope.Ph)(e, t ? __contentScope.nt : __contentScope.Sh);
      if (r.length) return { kind: `success`, words: r.slice(0, 4) };
    }
    function Gh(e) {
      return !(!e || e.length > 60 || /@[\w-]+\.[\w-]+/.test(e) || /\d{6,}/.test(e) || /eyJ[\w-]{6,}|bearer\s|password|token|secret|密码/i.test(e) || /\b(?:sk|pk|ghp|gho|ghu|ghs|glpat|xox[baprs])[-_][A-Za-z0-9]/i.test(e) || e.match(/[A-Za-z0-9]{20,}/g)?.some((e2) => /[A-Za-z]/.test(e2) && /\d/.test(e2)));
    }
    function Kh(e) {
      try {
        return (0, __contentScope.O)(e);
      } catch {
        return true;
      }
    }
    function qh(e = 300) {
      let t = [], n = /* @__PURE__ */ new Set(), r = document.body?.querySelectorAll(`*`);
      if (!r) return t;
      let i = 0;
      for (let a of r) {
        if (i >= 4e3 || t.length >= e) break;
        if (i += 1, a.children.length > 0) continue;
        let r2 = (a.textContent ?? ``).replace(/\s+/g, ` `).trim();
        !r2 || r2.length > 60 || n.has(r2) || (0, __contentScope.Gh)(r2) && (0, __contentScope.Kh)(a) && (n.add(r2), t.push(r2));
      }
      return t;
    }
    function Jh(e, t, n) {
      let r = new Set(e), i = t.filter((e2) => !r.has(e2)), a = (0, __contentScope.Ph)(`${n} ${i.join(` `)}`, __contentScope.Eh).slice(0, 4), o = i.filter(__contentScope.Gh).filter((e2) => !(0, __contentScope.I)(e2, a)).slice(0, 2), s = [.../* @__PURE__ */ new Set([...a, ...o])];
      return s.length ? s : void 0;
    }
    function Xh(e) {
      return e.replace(/\\/g, `\\\\`).replace(/"/g, `\\"`);
    }
    function Zh(e) {
      let t = (e instanceof HTMLInputElement ? e.getAttribute(`aria-label`) ?? e.getAttribute(`title`) ?? `` : (0, __contentScope.me)(e)).replace(/\s+/g, ` `).trim().split(`,`)[0]?.trim() ?? ``;
      return /[\p{L}\p{Script=Han}]/u.test(t) ? t.slice(0, __contentScope.Yh).trim() : ``;
    }
    function ig(e) {
      return e.length < __contentScope.rg || !/^[0-9a-f]+$/i.test(e) ? false : /\d/.test(e) && /[a-f]/i.test(e);
    }
    function ag(e) {
      let t = e.trim();
      return !__contentScope.Qh.test(t) || __contentScope.$h.test(t) || __contentScope.eg.test(t) || __contentScope.tg.test(t) || __contentScope.ng.test(t) ? true : t.split(/[-_]/).some(__contentScope.ig);
    }
    function cg(e) {
      let t = e.trim();
      if (!t) return false;
      if (__contentScope.sg.test(t)) return true;
      for (let e2 of t.split(`>>`))
        if (!e2.trim().startsWith(`text=`)) {
          for (let t2 of e2.matchAll(__contentScope.og)) if ((0, __contentScope.ag)(t2[1])) return true;
        }
      return false;
    }
    function lg(e) {
      let t = [], n = e;
      for (; n; ) {
        let e2 = n.getRootNode();
        if (!(e2 instanceof ShadowRoot)) break;
        let r = e2.host;
        t.unshift((0, __contentScope.ug)(r, r.getRootNode())), n = r;
      }
      return t;
    }
    function ug(e, t) {
      let n = t, r = (t2) => {
        try {
          let r2 = n.querySelectorAll(t2);
          return r2.length === 1 && r2[0] === e;
        } catch {
          return false;
        }
      }, i = e.getAttribute(`data-testid`);
      if (i) {
        let e2 = `[data-testid="${(0, __contentScope.Xh)(i)}"]`;
        if (r(e2)) return e2;
      }
      if (e.id && !(0, __contentScope.ag)(e.id)) {
        let t2 = `#${e.id}`;
        if (r(t2)) return t2;
      }
      let a = e.tagName.toLowerCase(), o = (e.parentElement ? [...e.parentElement.children].filter((t2) => t2.tagName === e.tagName) : [e]).indexOf(e) + 1, s = `${a}:nth-of-type(${o > 0 ? o : 1})`;
      return r(s) ? s : a;
    }
    function dg(e, t) {
      let n;
      try {
        n = (0, __contentScope.xe)(e);
      } catch {
        return true;
      }
      return (0, __contentScope.lg)(t).length > 0 ? true : n.length === 0 ? e.includes(`text=`) && t.matches(__contentScope.de) : n.length !== 1 || n[0] !== t;
    }
    function fg(e) {
      let t = [], n = e;
      for (; n && n !== document.body && n.nodeType === 1; ) {
        if (n !== e && n.id && !(0, __contentScope.ag)(n.id))
          return t.unshift(`#${n.id}`), t.join(` > `);
        let r = n.parentElement, i = n.tagName.toLowerCase();
        if (!r) {
          t.unshift(i);
          break;
        }
        let a = n, o = [...r.children].filter((e2) => e2.tagName === a.tagName), s = o.indexOf(a) + 1;
        t.unshift(o.length > 1 ? `${i}:nth-of-type(${s})` : i), n = r;
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
      let i = (e2) => Math.min(1, Math.max(0, e2));
      return { rx: i((t - r.left) / r.width), ry: i((n - r.top) / r.height) };
    }
    function gg(e) {
      let t = { tag: e.tagName.toLowerCase() }, n = e.getAttribute(`aria-label`)?.trim();
      n && (t.aria = n);
      let r = e.getAttribute(`name`)?.trim();
      r && (t.name = r);
      let i = e.getAttribute(`data-testid`)?.trim();
      i && (t.testId = i);
      let a = e.getAttribute(`role`)?.trim();
      if (a && (t.role = a), e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement)
        t.inputType = e instanceof HTMLInputElement ? e.type : `textarea`;
      else if (!(0, __contentScope.Dg)(e)) {
        let n2 = (0, __contentScope.me)(e);
        n2 && (t.text = n2.slice(0, 80));
      }
      return Object.keys(t).length > 1 ? t : void 0;
    }
    function _g(e, t = () => false) {
      let n = e.getAttribute(`data-testid`);
      if (n) {
        let t2 = `[data-testid="${(0, __contentScope.Xh)(n)}"]`;
        if (!(0, __contentScope.dg)(t2, e)) return t2;
      }
      if (e.id && !(0, __contentScope.ag)(e.id)) {
        let t2 = `#${e.id}`;
        if (!(0, __contentScope.dg)(t2, e)) return t2;
      }
      let r = e.getAttribute(`name`);
      if (r) {
        let t2 = `${e.tagName.toLowerCase()}[name="${(0, __contentScope.Xh)(r)}"]`;
        if (!(0, __contentScope.dg)(t2, e)) return t2;
      }
      let i = e.getAttribute(`aria-label`);
      if (i?.trim() && !t(i)) {
        let t2 = `text=${i.replace(/,/g, ` `).replace(/\s+/g, ` `).trim().slice(0, 80)}`;
        if (!(0, __contentScope.dg)(t2, e)) return t2;
      }
      if (!(0, __contentScope.Dg)(e)) {
        let n2 = (0, __contentScope.Zh)(e);
        if (n2 && !t(n2)) {
          let t2 = `text=${n2}`;
          if (!(0, __contentScope.dg)(t2, e)) return t2;
        }
      }
      if (describeLotteryClick(
        e,
        (0, __contentScope.yg)(e),
        (0, __contentScope.bg)(),
        __contentScope.Eg
      )) {
        const selector = stableLotteryControlSelector(e, document);
        if (selector) return selector;
      }
      let a = (0, __contentScope.lg)(e);
      return a.length > 0 ? [...a, (0, __contentScope.ug)(e, e.getRootNode())].join(` >>> `) : (0, __contentScope.fg)(e) || e.tagName.toLowerCase();
    }
    function vg(e) {
      let t = (0, __contentScope.Dg)(e) ? e.getAttribute(`placeholder`) ?? `` : e.innerText ?? e.textContent ?? ``;
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
        return t.protocol !== `http:` && t.protocol !== `https:` ? void 0 : (t.username = ``, t.password = ``, t.search = ``, t.hash = ``, `${t.origin}${t.pathname}`.slice(0, 1e3));
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
      if (e === document.body || e === document.documentElement) return false;
      try {
        return getComputedStyle(e).cursor === `pointer`;
      } catch {
        return false;
      }
    }
    function Dg(e) {
      let t = e.getAttribute(`contenteditable`);
      return t === `` || t?.toLowerCase() === `true`;
    }
    function Og(e) {
      return e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLElement && (0, __contentScope.Dg)(e);
    }
    function kg(e) {
      return e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement ? !!e.value.trim() : !!(e.textContent ?? ``).trim();
    }
    function Ag(e) {
      if (!(e instanceof HTMLInputElement)) return false;
      let t = [
        e.name,
        e.id,
        e.autocomplete,
        e.getAttribute(`aria-label`) ?? ``,
        e.placeholder,
        ...e.labels ? [...e.labels].map((e2) => e2.textContent ?? ``) : []
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
        ...e.labels ? [...e.labels].map((e2) => e2.textContent ?? ``) : []
      ].join(` `);
      if (!(__contentScope.Oh.test(t) || e.autocomplete === `new-password`)) {
        if (e.type === `password` || e.autocomplete === `current-password`) return `password`;
        if (e.autocomplete === `username` || e.type === `email` || e.type === `tel` || __contentScope.Dh.test(t))
          return `username`;
      }
    }
    function Mg(e, t, n, r) {
      let i = `${t} ${e.getAttribute(`aria-label`) ?? ``} ${n ?? ``}`;
      if (__contentScope.kh.test(i)) return `oauth`;
      let a = e.getAttribute(`type`);
      if ((e instanceof HTMLButtonElement || e instanceof HTMLInputElement) && (a === `submit` || a === `image`) || r && __contentScope.jh.test(t))
        return `submit`;
      if (__contentScope.Ah.test(t)) return `entry`;
    }
    function Pg(e = window) {
      return e.top === e.self;
    }
    function Lg(e, t, options = {}) {
      let n = e.createElement(`div`);
      n.setAttribute(__contentScope.Fg, t.title), n.style.setProperty(`position`, `fixed`), n.style.setProperty(`z-index`, `2147483647`), n.style.setProperty(`pointer-events`, `none`);
      let r = n.attachShadow({ mode: `closed` }), i = e.createElement(`style`);
      i.textContent = __contentScope.Ig;
      let a = e.createElement(`div`);
      a.className = `card`, a.setAttribute(`role`, `status`), a.setAttribute(`aria-live`, `polite`), a.style.setProperty(`pointer-events`, `none`);
      let o = e.createElement(`div`);
      o.className = `title`;
      let s = e.createElement(`div`);
      s.className = `steps`;
      let c = e.createElement(`div`);
      c.className = `hint`;
      let l = e.createElement(`div`);
      let identityStatus = e.createElement("div");
      identityStatus.className = "identity-status";
      let identityControls = e.createElement("div");
      identityControls.className = "identity-controls";
      const identityButtons = [];
      for (const [field, label] of [
        ["userId", "选择用户 ID"],
        ["username", "选择登录名"],
        ["email", "选择邮箱"]
      ]) {
        const button = e.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.addEventListener("click", () => options.onPickIdentity?.(field));
        identityButtons.push([field, button]);
        identityControls.append(button);
      }
      l.className = `warning`, a.append(s, o, c, l, identityStatus, identityControls), r.append(i, a), (e.body ?? e.documentElement)?.append(n);
      function u(t2) {
        o.textContent = t2.title, c.textContent = t2.hint, l.textContent = t2.warning ?? ``, s.replaceChildren(
          ...t2.steps.map((t3, n2) => {
            let r2 = e.createElement(`span`);
            r2.className = `step step-${t3.state}`;
            let i2 = e.createElement(`span`);
            i2.className = `step-number`, i2.textContent = `${n2 + 1}`;
            let a2 = e.createElement(`span`);
            return a2.textContent = t3.label, r2.append(i2, a2), r2;
          })
        ), n.setAttribute(__contentScope.Fg, t2.title);
      }
      return u(t), {
        host: n,
        root: a,
        styleElement: i,
        text: () => [
          ...Array.from(s.children).map((e2) => e2.textContent ?? ``),
          o.textContent ?? ``,
          c.textContent ?? ``,
          l.textContent ?? ``
        ].filter((e2) => e2.trim().length > 0).join(` `),
        update: u,
        updateIdentity(text, picking) {
          identityStatus.textContent = text;
          for (const [field, button] of identityButtons)
            button.setAttribute("aria-pressed", String(field === picking));
        },
        destroy: () => n.remove()
      };
    }
    function Rg(e = {}) {
      let t = e.doc ?? document, n = e.canRender ?? __contentScope.Pg, r = `checkin`, i = [], a = null, identityController, identityStatus = "自动查找当前用户的身份，也可点选页面中的身份字段", identityPicking = null;
      function o() {
        return (0, __contentScope.Bm)((0, __contentScope.jm)(i, r));
      }
      function s() {
        if (!n()) return null;
        a ??= (0, __contentScope.Lg)(t, o(), {
          onPickIdentity: (field) => identityController?.pickIdentity?.(field)
        });
        a.updateIdentity?.(identityStatus, identityPicking);
        return a;
      }
      return {
        begin(e2) {
          r = e2.kind ?? `checkin`, i = [...e2.events], s()?.update(o());
        },
        push(e2) {
          i.push(e2), s()?.update(o());
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
          a?.destroy(), a = null, i = [], identityController = void 0;
          identityStatus = "自动查找当前用户的身份，也可点选页面中的身份字段";
          identityPicking = null;
        }
      };
    }
    function createLearningIdentityMonitor(send, options = {}) {
      let timer, previous, sent, pending = Promise.resolve(), failure;
      function observe() {
        const identity = options.readVisible ? options.readVisible() : (0, __contentScope.Bi)();
        const identityPath = location.pathname + location.hash;
        const sampleKey = identitySampleKey(identity);
        if (!sampleKey) {
          previous = void 0;
          sent = void 0;
          return;
        }
        const key = JSON.stringify([
          identityPath,
          sampleKey,
          identity.identitySource,
          identity.selectedFields
        ]);
        if (key !== previous) {
          previous = key;
          return;
        }
        if (key === sent) return;
        sent = key;
        pending = pending.then(() => send({ identity, path: identityPath })).then((result) => {
          if (!result?.ok) throw Error(result?.error || "学习页用户 ID 未保存");
          if (result.ignored) sent = void 0;
          failure = void 0;
        }).catch((error) => {
          sent = void 0;
          failure = error;
        });
      }
      return {
        start() {
          if (timer === void 0) {
            observe();
            timer = setInterval(observe, 650);
          }
        },
        stop() {
          if (timer !== void 0) clearInterval(timer);
          timer = void 0;
        },
        async flush() {
          observe();
          await (0, __contentScope.w)(350);
          observe();
          await pending;
          if (failure) throw failure;
        }
      };
    }
    function zg(e, t, n, onIdentity, session = {}) {
      let r = /* @__PURE__ */ new Set(), i, events = [...session.events ?? []], a = new __contentScope.Ng({
        kind: e,
        personalTexts: n,
        onEvent(e2) {
          events.push(e2);
          let n2 = t(e2).then(
            (e3) => {
              e3.ok || (i ??= e3.error ?? `学习事件未保存`);
            },
            (e3) => {
              i ??= e3 instanceof Error ? e3.message : String(e3);
            }
          );
          r.add(n2), n2.then(() => r.delete(n2));
        }
      });
      const identityTools = onIdentity && session.identitySite && window.top === window ? new IdentitySourceLearner({
        site: session.identitySite,
        send: onIdentity,
        requestIdentity: (site, token, options) => (0, __contentScope.qi)(site, token, options),
        getProgress: () => ({
          ...(0, __contentScope.jm)(events, e),
          loginAt: [...events].reverse().find(
            (event) => event.loginAction === "submit" || event.loginAction === "oauth" || event.type === "fill" && event.fieldRole === "password" && event.key === "Enter"
          )?.at
        }),
        onStatus: (text, picking) => __contentScope.Bg.setIdentityStatus(text, picking),
        wait: (ms) => (0, __contentScope.w)(ms)
      }) : null;
      let identityMonitor = onIdentity && window.top === window ? (0, __contentScope.createLearningIdentityMonitor)(
        identityTools ? (observation) => identityTools.reportVisible(observation) : onIdentity,
        identityTools ? { readVisible: () => identityTools.readVisible() } : {}
      ) : null;
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
          for (a.flushPending(); r.size; ) await Promise.all([...r]);
          await identityMonitor?.flush();
          await identityTools?.flush();
          if (i) throw Error(i);
          return {
            challengeSeen: a.sawChallengeField,
            unlearnedNotes: a.unlearnedNotes
          };
        }
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
      __contentScope.Vg?.stop(), __contentScope.Bg.end();
      let t = (0, __contentScope.zg)(
        e.kind ?? `checkin`,
        (t2) => (__contentScope.Bg.push(t2), (0, __contentScope.n)({ type: `LEARN_EVENT`, runId: e.runId, event: t2 })),
        e.personalTexts,
        (observation) => (0, __contentScope.n)({
          type: `LEARN_IDENTITY`,
          runId: e.runId,
          observation
        }),
        e
      );
      __contentScope.Vg = { ...t, runId: e.runId }, __contentScope.Bg.begin(e), __contentScope.Bg.setIdentityController(t), t.start();
    }
    function Wg() {
      return (0, __contentScope.z)().some((e) => {
        let t = (0, __contentScope.L)(e);
        return !__contentScope.ct.test(t) && !__contentScope.it.test(t) ? false : !__contentScope.lt.test(t);
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
        }
      },
      initializers: [
        {
          order: 285,
          run() {
            __contentState.lm = /(?:^|\/)(?:login|log-in|signin|sign-in|signup|sign-up|register|oauth|authorize|auth|password|reset|forgot)(?:\/|$)/i;
          }
        },
        {
          order: 286,
          run() {
            __contentState.um = /(?:^|\/)(?:logout|log-out|signout|sign-out)(?:\/|$)/i;
          }
        },
        {
          order: 287,
          run() {
            __contentState.dm = /(?:^|\/)(?:profile|personal|account|user|me)\/?$/i;
          }
        },
        {
          order: 288,
          run() {
            __contentState.fm = /(?:^|\/)(?:settings?|preferences?|config|billing|payments?|invoices?|subscription|plans?|pricing|orders?|usage|logs?|tokens?|keys?|api-?keys?|security|passwords?|passkeys?|2fa|mfa|notifications?|invites?|affiliate|referrals?)(?:\/|$)/i;
          }
        },
        {
          order: 289,
          run() {
            __contentState.pm = /(?:^|\/)(?:check-?in|daily|rewards?|claim|points|lottery|draw|prize)(?:\/|$)/i;
          }
        },
        {
          order: 290,
          run() {
            __contentState.hm = (0, __contentScope.P)(
              /^(?:退出登录|退出账号|退出|登出|注销|log\s?out|sign\s?out|logout)$/i
            );
          }
        },
        {
          order: 291,
          run() {
            __contentState.gm = (0, __contentScope.P)(
              /(?:签到|打卡|领取|抽奖|抽签|翻牌|check[\s-]?in|daily|claim|redeem|\b(?:start\s+)?draw\b)/i
            );
          }
        },
        {
          order: 292,
          run() {
            __contentState._m = (0, __contentScope.P)(
              /个人(?:资料|信息|中心)|账户信息|账号信息|我的(?:账户|账号|资料|信息)|控制台|首页|设置|偏好|仪表盘|退出|登出|profile|personal|account|dashboard|console|preferences?|logout|log\s?out/i
            );
          }
        },
        {
          order: 293,
          run() {
            __contentState.vm = (0, __contentScope.P)(/已签到|今日已|已经签到/);
          }
        },
        {
          order: 294,
          run() {
            __contentState.ym = (0, __contentScope.P)(/签到成功|打卡成功|领取成功/);
          }
        },
        {
          order: 295,
          run() {
            __contentState.Om = { none: 0, action: 1, confirmed: 2, already: 3 };
          }
        },
        {
          order: 296,
          run() {
            __contentState.Mm = [`①`, `②`, `③`, `④`];
          }
        },
        {
          order: 297,
          run() {
            __contentState.Nm = [`登录`, `账号页`, `签到`, `结束`];
          }
        },
        {
          order: 298,
          run() {
            __contentState.Pm = [`登录`, `结束`];
          }
        },
        {
          order: 299,
          run() {
            __contentState.Fm = `检测到这次演示点了「退出登录」：会话已经断开，请重新登录后再继续演示（这段演示不建议保存）`;
          }
        },
        {
          order: 300,
          run() {
            __contentState.Im = {
              login: `在打开的站点上手动登录；全程不要点「退出登录」`,
              profile: `先经过能显示当前账号的页面（如「个人资料 / 我的账户」），再进签到页`,
              checkin: `点一次真正的签到/领取按钮；当天已经签过的站点学不到签到流程`,
              done: `回到扩展里点「结束学习」保存`
            };
          }
        },
        {
          order: 301,
          run() {
            __contentState.Lm = `若本站是「登录即签到」（登录成功后自动完成、页面上没有签到按钮），回扩展里点「登录即签到」即可保存完整流程`;
          }
        },
        {
          order: 302,
          run() {
            __contentState.Rm = {
              login: `手动完成一次登录（填好账号密码并提交，或点第三方登录），全程不要点「退出登录」`,
              profile: __contentScope.Im.profile,
              checkin: __contentScope.Im.checkin,
              done: `回到扩展里点「结束学习」保存`
            };
          }
        },
        {
          order: 323,
          run() {
            __contentState.gh = 1e6;
          }
        },
        {
          order: 324,
          run() {
            __contentState._h = /(?:^|[-_\s])(?:knob|handle|thumb|slider|drag|pull)(?:$|[-_\s])|滑块|滑轨|拖动|拉动|向右滑/i;
          }
        },
        {
          order: 325,
          run() {
            __contentState.xh = (0, __contentScope.P)(
              /签到|打卡|领取|奖励|福利|抽奖|抽签|翻牌|check[\s-]?in|claim|attendance|daily|\b(?:start\s+)?draw\b/i
            );
          }
        },
        {
          order: 326,
          run() {
            (0, __contentScope.P)(
              /个人资料|个人信息|账户信息|账号信息|我的(?:账户|账号|资料)|profile|my\s+account|account\s+(?:settings|info|details)|user\s+center/i
            ), (0, __contentScope.P)(
              /个人(?:资料|信息|中心)|账户信息|账号信息|我的(?:账户|账号|资料|信息)|控制台|首页|设置|偏好|仪表盘|退出|登出|profile|personal|account|dashboard|console|preferences?|logout|log\s?out/i
            );
          }
        },
        {
          order: 327,
          run() {
            __contentState.Sh = [...__contentScope.tt, ...__contentScope.nt];
          }
        },
        {
          order: 328,
          run() {
            __contentState.Ch = [...__contentScope.F, ...__contentScope.rt];
          }
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
              `check-in failed`
            ];
          }
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
              `verify you are human`
            ];
          }
        },
        {
          order: 331,
          run() {
            __contentState.Eh = [
              ...__contentScope.Ch,
              ...__contentScope.Sh,
              ...__contentScope.wh,
              ...__contentScope.Th
            ];
          }
        },
        {
          order: 332,
          run() {
            __contentState.Dh = /(?:user(?:name)?|account|e-?mail|login|phone|mobile|用户名|用户|账号|账户|邮箱|手机号|手机)/i;
          }
        },
        {
          order: 333,
          run() {
            __contentState.Oh = /(?:one[-_ ]?time|captcha|verification|verify|otp|totp|mfa|2fa|security[-_ ]?code|验证码|校验码|动态码|token|secret)/i;
          }
        },
        {
          order: 334,
          run() {
            __contentState.kh = /(?:github|google|discord|telegram|microsoft|linux.?do|oauth|sso|passkey|webauthn|第三方)/i;
          }
        },
        {
          order: 335,
          run() {
            __contentState.Ah = /(?:log\s?in|sign\s?in|登录|登陆|账号密码|邮箱登录|使用密码|use password|email login)/i;
          }
        },
        {
          order: 336,
          run() {
            __contentState.jh = /^(?:log\s?in|sign\s?in|login|登录|登陆|立即登录|提交|继续|下一步|continue|next|submit)$/i;
          }
        },
        {
          order: 337,
          run() {
            __contentState.Mh = /(?:^#|[?&])(?:access[_-]?token|refresh[_-]?token|id[_-]?token|token|code|state|secret|password|credential|session|auth)=/i;
          }
        },
        {
          order: 338,
          run() {
            __contentState.Hh = 3;
          }
        },
        {
          order: 339,
          run() {
            __contentState.Yh = 24;
          }
        },
        {
          order: 340,
          run() {
            __contentState.Qh = /^[A-Za-z][A-Za-z0-9_-]{0,80}$/;
          }
        },
        {
          order: 341,
          run() {
            __contentState.$h = /(?:^|[-_])_r_[0-9a-z]{1,4}_(?:$|[-_])/i;
          }
        },
        {
          order: 342,
          run() {
            __contentState.eg = /^(?:radix|base-?ui)-/i;
          }
        },
        {
          order: 343,
          run() {
            __contentState.tg = /(?:^|[-_])(?:react-select|downshift)-\d+(?:[-_]|$)/i;
          }
        },
        {
          order: 344,
          run() {
            __contentState.ng = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          }
        },
        {
          order: 345,
          run() {
            __contentState.rg = 8;
          }
        },
        {
          order: 346,
          run() {
            __contentState.og = /(?:^|[\s>+~,(])#([^\s>+~,[\]]+)/g;
          }
        },
        {
          order: 347,
          run() {
            __contentState.sg = /^[#.]?:r[0-9a-z]+:$/i;
          }
        },
        {
          order: 348,
          run() {
            __contentState.pg = /* @__PURE__ */ new Set([
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
          order: 349,
          run() {
            __contentState.Cg = __contentScope.de;
          }
        },
        {
          order: 350,
          run() {
            __contentState.wg = `[onclick], [tabindex]:not([tabindex="-1"])`;
          }
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
              pending = /* @__PURE__ */ new Set();
              restoreHistory = [];
              lastPath = ``;
              navigationTimer = null;
              attached = false;
              pendingFill = null;
              scrollTimer = null;
              pendingScroll = null;
              scrollState = null;
              passwordSeen = false;
              challengeSeen = false;
              pointerDown = null;
              mouseDown = null;
              pointerUp = null;
              pendingKey = null;
              lotteryActionAt = null;
              unlearned = [];
              isPersonal;
              constructor(e) {
                this.onEvent = e.onEvent, this.settleMs = e.settleMs ?? 700, this.scrollStopMs = e.scrollStopMs ?? 200, this.learningKind = e.kind ?? `checkin`, this.fused = this.learningKind !== `login`;
                let t = (0, __contentScope.Uh)(e.personalTexts);
                this.isPersonal = (e2) => !__contentScope.xh.test(e2 ?? ``) && t(e2);
              }
              attach() {
                this.attached || (this.attached = true, document.addEventListener(`click`, this.onClick, true), document.addEventListener(`contextmenu`, this.onContextMenu, true), document.addEventListener(`input`, this.onInput, true), document.addEventListener(`change`, this.onInput, true), document.addEventListener(`keydown`, this.onKeyDown, true), document.addEventListener(`pointerdown`, this.onPointerDown, true), document.addEventListener(`pointerup`, this.onPointerUp, true), document.addEventListener(`mousedown`, this.onPointerDown, true), document.addEventListener(`mouseup`, this.onPointerUp, true), document.addEventListener(`scroll`, this.onScroll, true), window.addEventListener(`scroll`, this.onScroll, true), window.addEventListener(`popstate`, this.recordNavigation), window.addEventListener(`hashchange`, this.recordNavigation), this.restoreHistory.push(this.wrap(`pushState`), this.wrap(`replaceState`)), this.navigationTimer = setInterval(this.recordNavigation, 200), this.recordNavigation());
              }
              detach() {
                if (this.attached) {
                  this.flushPending(), this.attached = false, this.navigationTimer && clearInterval(this.navigationTimer), this.navigationTimer = null, document.removeEventListener(`click`, this.onClick, true), document.removeEventListener(`contextmenu`, this.onContextMenu, true), document.removeEventListener(`input`, this.onInput, true), document.removeEventListener(`change`, this.onInput, true), document.removeEventListener(`keydown`, this.onKeyDown, true), document.removeEventListener(`pointerdown`, this.onPointerDown, true), document.removeEventListener(`pointerup`, this.onPointerUp, true), document.removeEventListener(`mousedown`, this.onPointerDown, true), document.removeEventListener(`mouseup`, this.onPointerUp, true), document.removeEventListener(`scroll`, this.onScroll, true), window.removeEventListener(`scroll`, this.onScroll, true), window.removeEventListener(`popstate`, this.recordNavigation), window.removeEventListener(`hashchange`, this.recordNavigation);
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
                this.pendingFill = null, t && (t.timer && clearTimeout(t.timer), this.emitFill(t, true)), this.flushScroll();
                for (let t2 of e) t2();
              }
              onScroll = (e) => {
                this.attached && (this.recordNavigation(), this.pendingScroll = (0, __contentScope.Lh)(
                  e.target instanceof HTMLElement ? e.target : void 0
                ), this.scrollTimer && clearTimeout(this.scrollTimer), this.scrollTimer = setTimeout(() => {
                  this.scrollTimer = null, this.settleScroll();
                }, this.scrollStopMs));
              };
              flushScroll() {
                this.scrollTimer &&= (clearTimeout(this.scrollTimer), null), this.settleScroll();
              }
              settleScroll() {
                if (!this.pendingScroll) return;
                let e = this.pendingScroll;
                if (this.pendingScroll = null, !e.pageY && !e.scrolled) {
                  this.scrollState = null;
                  return;
                }
                this.scrollState = e;
                let t = e.scrollContainer === void 0 ? e.ratio : e.containerRatio;
                t !== void 0 && Number.isFinite(t) && t > 0 && this.attached && this.onEvent({
                  type: `scroll`,
                  path: (0, __contentScope.bg)(),
                  ratio: Math.min(1, Math.max(0, t)),
                  ...e.scrollContainer ? { container: e.scrollContainer } : {},
                  at: Date.now()
                });
              }
              takeScroll() {
                let e = this.pendingScroll ?? this.scrollState;
                return this.scrollState = null, this.pendingScroll = null, this.scrollTimer &&= (clearTimeout(this.scrollTimer), null), e;
              }
              currentElement(e) {
                if (e.composedPath().some(
                  (node) => node?.hasAttribute?.("data-checkin-learning-guide") || node?.hasAttribute?.("data-checkin-identity-picker")
                ))
                  return null;
                let t = null, lotteryControl = null;
                for (let n of e.composedPath())
                  if (n instanceof HTMLElement) {
                    if ((0, __contentScope.Tg)(n)) return n;
                    !t && (0, __contentScope.Eg)(n) && (t = n);
                    if (!lotteryControl && describeLotteryClick(
                      n,
                      (0, __contentScope.yg)(n),
                      (0, __contentScope.bg)(),
                      __contentScope.Eg
                    ))
                      lotteryControl = n;
                  }
                return lotteryControl ?? t;
              }
              recordNavigation = () => {
                let e = (0, __contentScope.bg)();
                e !== this.lastPath && (this.lastPath = e, this.takeScroll(), this.onEvent({ type: `navigation`, path: e, at: Date.now() }));
              };
              wrap = (e) => {
                let t = history[e], n = this.recordNavigation;
                return history[e] = function(...e2) {
                  let r = t.apply(this, e2);
                  return n(), r;
                }, () => {
                  history[e] = t;
                };
              };
              schedule(e, t = this.settleMs) {
                let n = setTimeout(() => {
                  this.pending.delete(r), e();
                }, t), r = () => {
                  clearTimeout(n), e();
                };
                this.pending.add(r);
              }
              onPointerDown = (e) => {
                let t = {
                  x: e.clientX,
                  y: e.clientY,
                  target: e.target instanceof Element ? e.target : null,
                  at: Date.now()
                };
                e.type === `pointerdown` ? this.pointerDown = t : this.mouseDown = t, this.pointerUp = null;
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
                if (this.pendingKey = null, !t || Date.now() - t.at > 1e3) return;
                let n = t.target instanceof Element ? t.target : null;
                if (n === null || n === e || n.contains(e) || e.contains(n)) return t.key;
              }
              onPointerUp = (e) => {
                let t = e.type === `pointerup`, n = t ? this.pointerDown : this.mouseDown;
                if (n === null) return;
                t ? this.pointerDown = null : this.mouseDown = null;
                let r = Math.hypot(e.clientX - n.x, e.clientY - n.y) >= 12, i = this.pointerUp?.dragged === true && Date.now() - (this.pointerUp?.at ?? 0) <= 500, a = this.pointerUp?.recorded === true;
                this.pointerUp = {
                  dragged: r || i,
                  downTarget: n.target,
                  upTarget: e.target instanceof Element ? e.target : null,
                  at: Date.now(),
                  downX: n.x,
                  downY: n.y,
                  upX: e.clientX,
                  upY: e.clientY,
                  holdMs: Date.now() - n.at
                }, this.attached && this.pointerUp.dragged && !a && this.recordDrag(this.pointerUp, e) && this.pointerUp && (this.pointerUp.recorded = true);
              };
              dragTailClick(e) {
                let t = this.pointerUp;
                if (!t || !t.dragged || Date.now() - t.at > 500) return null;
                let n = e.target instanceof Element ? e.target : null;
                return n !== null && [t.downTarget, t.upTarget].some(
                  (e2) => e2 !== null && (e2 === n || e2.contains(n) || n.contains(e2))
                ) ? (this.pointerUp = null, t) : null;
              }
              recordDrag(e, t) {
                if (Math.hypot(e.upX - e.downX, e.upY - e.downY) < 24) return false;
                let n = e.downTarget instanceof HTMLElement ? e.downTarget : (0, __contentScope.vh)(t.composedPath()), r = e.upTarget instanceof HTMLElement ? e.upTarget : (0, __contentScope.vh)(t.composedPath()), i = () => true;
                if (n && (0, __contentScope.Ql)(n) || r && (0, __contentScope.Ql)(r))
                  return this.unlearned.push(`拖拽验证控件：这一步不会写进流程（回放时由自动验证处理）`), i();
                if (!n || !r || !(0, __contentScope.yh)(n) || !(0, __contentScope.yh)(r))
                  return this.unlearned.push(`这一步拖拽的起点或终点不是可稳定回放的控件，未写进流程`), i();
                let a = (0, __contentScope._g)(n, this.isPersonal), o = (0, __contentScope._g)(r, this.isPersonal);
                if (!a || !o)
                  return this.unlearned.push(`这一步拖拽没有可回放的稳定选择器，未写进流程`), i();
                if ((r === n || n.contains(r) || r.contains(n)) && (0, __contentScope.bh)(n))
                  return this.unlearned.push(
                    `识别到一次把手/滑块拖拽：这类拖拽不会写进流程，回放时由站点自身处理`
                  ), i();
                let s = (0, __contentScope.bg)(), c = Date.now(), l = (0, __contentScope.hg)(n, e.downX, e.downY), u = (0, __contentScope.hg)(r, e.upX, e.upY), d = this.takeScroll(), f = (0, __contentScope.Lh)(n), p = (0, __contentScope.Bh)(
                  (0, __contentScope.Vh)(f.scrolled ? f : d?.pageY ? d : f)
                ), m = (0, __contentScope.yg)(n), h = this.learningKind === `login` ? [] : (0, __contentScope.qh)();
                return this.onEvent({
                  ...p,
                  type: `drag`,
                  selector: a,
                  toSelector: o,
                  label: m,
                  path: s,
                  ...l ? { anchor: l } : {},
                  ...u ? { toAnchor: u } : {},
                  at: c
                }), this.learningKind === `login` || this.schedule(() => {
                  if (!this.attached || (0, __contentScope.bg)() !== s) return;
                  let e2 = (0, __contentScope.Jh)(
                    h,
                    (0, __contentScope.qh)(),
                    (0, __contentScope.Sg)()
                  ), t2 = (0, __contentScope.Wh)(
                    (0, __contentScope.Sg)(),
                    __contentScope.it.test(m)
                  );
                  (e2 || t2) && this.onEvent({
                    ...p,
                    type: `drag`,
                    selector: a,
                    toSelector: o,
                    label: m,
                    path: s,
                    ...e2 ? { afterText: e2 } : {},
                    ...t2 ? { evidence: t2 } : {},
                    at: c
                  });
                }), i();
              }
              onContextMenu = (e) => {
                if (!this.attached) return;
                this.recordNavigation();
                let t = this.currentElement(e);
                if (!t) return;
                if ((0, __contentScope.Ql)(t)) {
                  this.unlearned.push(
                    `点击人机验证控件：这一步不会写进流程，回放时由自动验证接管，可能需要人工完成`
                  );
                  return;
                }
                let n = (0, __contentScope.bg)(), r = (0, __contentScope._g)(t, this.isPersonal), i = (0, __contentScope.yg)(t), a = (0, __contentScope.hg)(t, e.clientX, e.clientY), o = (0, __contentScope.gg)(t), s = this.takeScroll(), c = (0, __contentScope.Lh)(t), l = (0, __contentScope.Bh)(
                  (0, __contentScope.Vh)(c.scrolled ? c : s?.pageY ? s : c)
                );
                this.onEvent({
                  ...l,
                  type: `click`,
                  selector: r,
                  label: i,
                  path: n,
                  gesture: `right`,
                  ...a ? { anchor: a } : {},
                  ...o ? { fingerprint: o } : {},
                  at: Date.now()
                });
              };
              onClick = (e) => {
                this.recordNavigation();
                let t = this.dragTailClick(e);
                if (t) {
                  if (t.recorded === true || this.recordDrag(t, e)) {
                    this.pointerUp = null;
                    return;
                  }
                  this.pointerUp = null;
                }
                let n = this.currentElement(e);
                if (!n || (0, __contentScope.R)(n)) return;
                if ((0, __contentScope.Ql)(n)) {
                  this.unlearned.push(
                    `点击人机验证控件：这一步不会写进流程，回放时由自动验证接管，可能需要人工完成`
                  );
                  return;
                }
                let r = n instanceof HTMLAnchorElement ? n.href : void 0;
                if (r && /^(?:javascript:|mailto:|tel:)/i.test(r)) return;
                let i = r ? (0, __contentScope.xg)(r) : void 0, a = (0, __contentScope.bg)(), o = (0, __contentScope._g)(n, this.isPersonal), s = (0, __contentScope.yg)(n), lotteryAction = this.learningKind !== `login` && describeLotteryClick(n, s, a, __contentScope.Eg), c = this.fused || this.learningKind === `login` ? (0, __contentScope.Mg)(n, (0, __contentScope.vg)(n), i, this.passwordSeen) : void 0, l = Date.now(), u = this.learningKind === `login` ? [] : (0, __contentScope.qh)(), lotteryBefore = lotteryAction ? snapshotLotteryResults(document, __contentScope.Kh) : null, d = this.takeScroll(), f = (0, __contentScope.Lh)(n), p = (0, __contentScope.Bh)(
                  (0, __contentScope.Vh)(f.scrolled ? f : d?.pageY ? d : f)
                ), m = (0, __contentScope.hg)(n, e.clientX, e.clientY), h = this.pointerUp?.holdMs ?? (this.pointerDown ? l - this.pointerDown.at : void 0), g;
                e.detail >= 2 ? g = `double` : e.button === 2 ? g = `right` : h !== void 0 && h >= 500 && (g = `long-press`);
                let _ = this.takePendingKey(n), v = (0, __contentScope.gg)(n);
                if (lotteryAction) this.lotteryActionAt = l;
                if (this.onEvent({
                  ...p,
                  type: `click`,
                  selector: o,
                  label: s,
                  path: a,
                  ...lotteryAction ? { checkinAction: lotteryAction } : {},
                  ...i ? { href: i } : {},
                  ...c ? { loginAction: c } : {},
                  ...m ? { anchor: m } : {},
                  ...g ? { gesture: g } : {},
                  ..._ ? { key: _ } : {},
                  ...g === `long-press` && h !== void 0 ? { holdMs: h } : {},
                  ...v ? { fingerprint: v } : {},
                  at: l
                }), this.learningKind === `login`)
                  return;
                let y = () => {
                  if (!this.attached || (0, __contentScope.bg)() !== a) return;
                  if (lotteryAction && this.lotteryActionAt !== l) return;
                  let e2 = (0, __contentScope.Jh)(
                    u,
                    (0, __contentScope.qh)(),
                    (0, __contentScope.Sg)()
                  ), t2 = lotteryBefore ? readLotteryResultEvidence(
                    lotteryBefore,
                    document,
                    __contentScope.Kh,
                    __contentScope.fg
                  ) : (0, __contentScope.Wh)((0, __contentScope.Sg)());
                  if (lotteryBefore) e2 = t2?.words;
                  (e2 || t2) && this.onEvent({
                    ...p,
                    type: `click`,
                    selector: o,
                    label: s,
                    path: a,
                    ...lotteryAction ? { checkinAction: lotteryAction } : {},
                    ...i ? { href: i } : {},
                    ...e2 ? { afterText: e2 } : {},
                    ...t2 ? { evidence: t2 } : {},
                    at: l
                  });
                };
                if (this.schedule(y), lotteryAction)
                  for (let e2 of [2500, 6e3, 12e3]) this.schedule(y, e2);
              };
              onInput = (e) => {
                this.recordNavigation();
                let t = e.composedPath().find(__contentScope.Og);
                if (!t || !(0, __contentScope.Kh)(t)) return;
                if ((0, __contentScope.Ag)(t)) {
                  this.challengeSeen = true;
                  return;
                }
                let n = this.fused || this.learningKind === `login` ? (0, __contentScope.jg)(t) : void 0;
                if (this.learningKind === `login` && !n) return;
                n === `password` && (this.passwordSeen = true);
                let r = (0, __contentScope._g)(t, this.isPersonal), i = (0, __contentScope.yg)(t), a = (0, __contentScope.bg)(), o = (0, __contentScope.kg)(t), s = this.pendingFill;
                if (s && s.selector === r && s.path === a) {
                  s.hasValue = o, s.timer && clearTimeout(s.timer), s.timer = this.scheduleFill(s);
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
                  ...n ? { fieldRole: n } : {},
                  scroll: (0, __contentScope.Lh)(t),
                  fingerprint: (0, __contentScope.gg)(t)
                };
                c.timer = this.scheduleFill(c), this.pendingFill = c, this.emitFill(c, false);
              };
              scheduleFill(e) {
                return setTimeout(() => {
                  this.pendingFill === e && (this.pendingFill = null), this.emitFill(e, true);
                }, this.settleMs);
              }
              emitFill(e, t) {
                if (!this.attached) return;
                let n = e.hasValue;
                if (t) {
                  let t2 = this.findFillTarget(e.selector);
                  t2 && (n = (0, __contentScope.kg)(t2));
                }
                let r = t && !e.fieldRole && (0, __contentScope.bg)() === e.path ? (0, __contentScope.Jh)(
                  e.before,
                  (0, __contentScope.qh)(),
                  (0, __contentScope.Sg)()
                ) : void 0, i = (0, __contentScope.Bh)((0, __contentScope.Vh)(e.scroll));
                this.onEvent({
                  ...i,
                  type: `fill`,
                  selector: e.selector,
                  label: e.label,
                  path: e.path,
                  hasValue: n,
                  ...e.fieldRole ? { fieldRole: e.fieldRole } : {},
                  ...e.key ? { key: e.key } : {},
                  ...e.fingerprint ? { fingerprint: e.fingerprint } : {},
                  ...r ? { afterText: r } : {},
                  at: e.at
                });
              }
              findFillTarget(e) {
                if (e.startsWith(`text=`) || e.includes(`,`)) return null;
                try {
                  let t = document.querySelector(e);
                  return t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLElement && (0, __contentScope.Dg)(t) ? t : null;
                } catch {
                  return null;
                }
              }
            };
          }
        },
        {
          order: 352,
          run() {
            __contentState.Fg = `data-checkin-learning-guide`;
          }
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
          }
        },
        {
          order: 354,
          run() {
            __contentState.Bg = (0, __contentScope.Rg)();
          }
        },
        {
          order: 355,
          run() {
            __contentState.Vg = null;
          }
        }
      ]
    };
  }

  // src/shared/login-state.js
  function classifyLoginState(page = {}, samples = []) {
    const result = (status, reason, detail, identity) => ({
      status,
      reason,
      detail,
      ...identity ? { identity } : {}
    });
    if (page.sameOrigin !== true)
      return result("pending", "oauth_pending", "OAuth 尚未返回本站，等待授权流程完成");
    if (page.secondFactor)
      return result("blocked", "second_factor_pending", `登录后进入${page.secondFactor}步骤`);
    if (page.challenge)
      return result(
        "blocked",
        "challenge_pending",
        `${page.challenge.kind ?? "安全验证"}尚未完成，暂不确认登录成功`
      );
    if (page.completionRequired)
      return result(
        "blocked",
        "account_completion_required",
        "授权后仍需完成注册、绑定或补充账号资料"
      );
    if (page.loginError)
      return result("failed", "login_rejected", `站点返回登录失败：${page.loginError}`);
    const current = samples.at(-1);
    if (current?.identityConflict)
      return result(
        "failed",
        "identity_conflict",
        `当前登录身份证据冲突：${current.identityConflict}`,
        current
      );
    if (page.loginForm)
      return result("pending", "login_form_visible", "页面仍显示登录表单，尚未完成登录");
    if (identitySampleKey(samples.at(-2)) && identitySampleKey(current) && !stableIdentitySamples(samples.at(-2), current))
      return result(
        "pending",
        "identity_unstable",
        "当前登录身份在连续读取中发生变化，暂不采用页面成功控件",
        current
      );
    if (page.successIndicator)
      return result("authenticated", "success_indicator", "命中可见的本站登录成功标志");
    if (page.logoutControl)
      return result(
        "authenticated",
        "logout_control",
        `页面显示可见的退出登录控件${page.logoutSource ? `（${page.logoutSource}）` : ""}`
      );
    if (page.checkinControl)
      return result("authenticated", "checkin_control", "页面显示本站配置的签到或已签到控件");
    if (["api", "visible"].includes(current?.source) && stableIdentitySamples(samples.at(-2), current))
      return result(
        "authenticated",
        current.source === "api" ? "stable_api_identity" : "stable_page_identity",
        current.source === "api" ? `当前用户接口${current.endpoint ? ` ${current.endpoint} ` : ""}连续两次返回一致的${current.userId ? `用户 ID ${current.userId}` : "完整登录标识"}` : `当前账号资料连续两次显示一致的${current.userId ? `用户 ID ${current.userId}` : "完整登录标识"}`,
        current
      );
    if (identitySampleKey(current))
      return result(
        "pending",
        samples.length > 1 ? "identity_unstable" : "identity_verifying",
        samples.length > 1 ? "当前登录身份尚未形成连续一致的有效样本" : "已读到当前账号身份，正在重新读取以确认会话稳定",
        current
      );
    if (page.accountShellVisible)
      return result(
        "pending",
        "account_shell_unverified",
        `${page.accountShellSource ?? "当前账号区域"}已显示，正在核验当前会话和账号身份`
      );
    if (page.loginEntry)
      return result("pending", "login_entry_visible", "页面仍显示登录入口，等待本站更新登录状态");
    return result(
      "pending",
      "success_evidence_missing",
      "未取得可见登录成功控件或连续一致的当前用户身份"
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
        ...url.origin === new URL(site.loginUrl).origin ? [url.pathname] : []
      ];
    } catch {
      return null;
    }
    const message = messages.filter(
      (text) => typeof text === "string" && endpoints.some((endpoint) => text.startsWith(`身份接口 ${endpoint}（`))
    ).at(-1);
    if (!message) return null;
    let reason;
    if (/没有可用的会话 Token/.test(message)) reason = "session_token_missing";
    else if (/HTTP (?:401|403)\b/.test(message)) reason = "session_probe_rejected";
    else if (/未返回有效的当前用户字段|用户资料解析失败/.test(message))
      reason = "identity_response_unusable";
    else if (/HTTP |HTML|不是 JSON|请求失败|请求超时|响应发生跳转/.test(message))
      reason = "identity_api_unavailable";
    return reason ? {
      status: "pending",
      reason,
      detail: `${message}；等待当前会话或资料页身份核验`
    } : null;
  }
  var LoginStateResolver = class {
    constructor({
      readPage,
      readIdentity,
      sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
      now = () => Date.now()
    }) {
      Object.assign(this, { readPage, readIdentity, sleep, now });
    }
    async wait(site, {
      timeoutMs = 8e3,
      pollMs = 300,
      identityTimeoutMs = 1500,
      stopOnLoginForm = false,
      diagnostics,
      serverOnly = false
    } = {}) {
      const deadline = this.now() + Math.max(0, timeoutMs);
      let samples = [];
      let lastIdentityReason;
      let lastProbeState;
      let state;
      for (; ; ) {
        const page = this.readPage(site);
        state = classifyLoginState(page, samples);
        if (state.status !== "pending" || state.reason === "oauth_pending" || stopOnLoginForm && state.reason === "login_form_visible")
          return state;
        if (typeof this.readIdentity === "function" && !page.loginForm && this.now() < deadline) {
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
                }
              }
            });
          } catch {
          }
          if (identity?.identityConflict || identitySampleKey(identity)) {
            lastProbeState = null;
            samples = [...samples.slice(-1), identity];
            state = classifyLoginState(this.readPage(site), samples);
            if (["identity_verifying", "identity_unstable"].includes(state.reason))
              lastIdentityReason = state;
            if (state.status !== "pending" || state.reason === "oauth_pending") return state;
          } else {
            samples = [];
            state = classifyLoginState(this.readPage(site));
            lastProbeState = identityProbePendingState(site, messages) ?? lastProbeState;
            if (state.status !== "pending" || state.reason === "oauth_pending") return state;
          }
        }
        if (this.now() >= deadline) {
          if (["identity_verifying", "identity_unstable"].includes(state.reason) || lastIdentityReason)
            return {
              status: "pending",
              reason: "identity_unstable",
              detail: "核验等待结束，当前登录身份仍未形成连续一致的有效样本"
            };
          if (lastProbeState && ["success_evidence_missing", "account_shell_unverified"].includes(state.reason))
            return {
              ...lastProbeState,
              detail: state.reason === "account_shell_unverified" ? `${state.detail}；${lastProbeState.detail}` : lastProbeState.detail
            };
          return state;
        }
        await this.sleep(Math.min(pollMs, Math.max(1, deadline - this.now())));
      }
    }
  };
  function loginStateLog(state) {
    return `登录状态核验[${state.reason}]：${state.detail}`;
  }

  // src/shared/site-login-recipes.js
  function withSiteIdentityRecipe(site) {
    let origin;
    try {
      origin = new URL(site.loginUrl).origin;
    } catch {
      return site;
    }
    if (origin !== "https://orevx.ai") return site;
    const source = readIdentitySource(site) ?? {};
    if (source.endpoint) return site;
    return {
      ...site,
      identitySource: {
        ...source,
        storageKey: source.storageKey ?? "auth-user",
        tokenKey: source.tokenKey ?? "auth-token",
        tokenHeader: source.tokenHeader ?? "Authorization",
        tokenPrefix: source.tokenPrefix ?? "Bearer ",
        pagePath: source.pagePath ?? "/user/profile",
        // An absent/blank endpoint is a request to use the validated current-user location.
        endpoint: "https://server.orevx.ai/api/user/me"
      }
    };
  }
  function readSiteLoginEvidence(site, document2, location2, isVisible) {
    let origin;
    try {
      origin = new URL(site.loginUrl).origin;
    } catch {
      return {};
    }
    if (origin !== "https://orevx.ai" || location2.origin !== origin || !/^\/(?:user|dashboard)(?:\/|$)/i.test(location2.pathname))
      return {};
    const visible = (node) => {
      if (!node || !isVisible(node)) return false;
      for (let parent = node; parent; parent = parent.parentElement)
        if (parent.hidden || parent.getAttribute?.("aria-hidden") === "true" || parent.hasAttribute?.("inert"))
          return false;
      return true;
    };
    const enabled = (node) => visible(node) && !node.disabled && !node.hasAttribute?.("disabled") && node.getAttribute?.("aria-disabled") !== "true" && (!node.hasAttribute?.("data-disabled") || node.getAttribute?.("data-disabled") === "false");
    const userControl = [...document2.querySelectorAll?.('button, [role="button"]') ?? []].find(
      (node) => enabled(node) && !node.closest?.('table, [role="table"], [role="list"], [role="listitem"]') && /^(?:当前用户|目前使用者|現在のユーザー|현재 사용자|Current user|Utilisateur actuel)\s*[:：]\s*\S+/i.test(
        node.getAttribute?.("aria-label") ?? ""
      )
    );
    if (!userControl) return {};
    const actionKey = "dashboard-account-action:sign-out";
    const keyedAction = (node, accountMenu) => ["id", "data-key", "data-collection-key"].some((attribute) => {
      let key = node.getAttribute?.(attribute) ?? "";
      try {
        key = decodeURIComponent(key);
      } catch {
      }
      return key === actionKey || key.endsWith(`-${actionKey}`) || accountMenu && key === "sign-out";
    });
    const menus = [...document2.querySelectorAll?.('[data-slot="sidebar-menu"]') ?? []].filter(
      visible
    );
    const logoutControl = menus.some((menu) => {
      const accountMenu = menu.getAttribute?.("role") === "treegrid" || menu.getAttribute?.("aria-label") === "Account actions";
      const actions = [...menu.querySelectorAll?.('[data-slot="sidebar-menu-item"]') ?? []].filter(
        enabled
      );
      return actions.some(
        (node) => keyedAction(node, accountMenu) || /^(?:sign[\s-]?out|log[\s-]?out|退出\s*(?:当前\s*)?(?:登录|账号|账户)|注销\s*登录|登出)[.!。！]?$/i.test(
          (node.getAttribute?.("aria-label") ?? "").trim()
        )
      );
    });
    return {
      accountShellVisible: true,
      accountShellSource: "Orevx 可见的当前用户账号栏",
      logoutControl,
      ...logoutControl ? { logoutSource: "Orevx 已适配的侧栏退出操作" } : {}
    };
  }

  // src/modules/checkin/content.js
  function createCheckinAutoContent(__contentScope) {
    let identityResolver;
    const directLoginLabel = /^(?:登录|登陆|登入|立即登录|继续登录|前往登录|sign[\s-]?in|log[\s-]?in)[.!。！›»>→]*$/i;
    const __contentState = bindContentState(__contentScope, [
      "detectPageLogin",
      "readLoginOptions",
      "readLoginSnapshot",
      "readLoginState",
      "hasVisibleLogoutControl",
      "describeLoginControl",
      "findSelectedLoginControl",
      "collectLoginEntries",
      "r",
      "i",
      "a",
      "o",
      "s",
      "c",
      "l",
      "u",
      "d",
      "f",
      "tt",
      "F",
      "nt",
      "rt",
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
      "wt",
      "Tt",
      "Et",
      "Dt",
      "Ot",
      "kt",
      "At",
      "jt",
      "Mt",
      "Nt",
      "Pt",
      "Ft",
      "It",
      "Lt",
      "Rt",
      "zt",
      "Bt",
      "Vt",
      "Ht",
      "Ut",
      "Wt",
      "Gt",
      "Kt",
      "qt",
      "Jt",
      "Yt",
      "Xt",
      "Zt",
      "Qt",
      "B",
      "$t",
      "en",
      "tn",
      "nn",
      "rn",
      "an",
      "on",
      "sn",
      "cn",
      "ln",
      "un",
      "dn",
      "fn",
      "pn",
      "mn",
      "hn",
      "gn",
      "_n",
      "vn",
      "yn",
      "bn",
      "xn",
      "Sn",
      "Cn",
      "wn",
      "Tn",
      "En",
      "Dn",
      "On",
      "kn",
      "An",
      "jn",
      "Mn",
      "Nn",
      "Pn",
      "Fn",
      "In",
      "Ln",
      "Rn",
      "zn",
      "Bn",
      "Vn",
      "Hn",
      "Un",
      "Wn",
      "Gn",
      "Kn",
      "qn",
      "Jn",
      "Yn",
      "Xn",
      "Zn",
      "Qn",
      "$n",
      "er",
      "tr",
      "nr",
      "rr",
      "ir",
      "ar",
      "U",
      "or",
      "sr",
      "cr",
      "lr",
      "ur",
      "dr",
      "fr",
      "pr",
      "mr",
      "hr",
      "gr",
      "_r",
      "vr",
      "yr",
      "br",
      "xr",
      "Sr",
      "Cr",
      "wr",
      "Tr",
      "Er",
      "Dr",
      "Or",
      "kr",
      "W",
      "Ar",
      "jr",
      "Mr",
      "Nr",
      "Pr",
      "Fr",
      "Ir",
      "Lr",
      "Rr",
      "zr",
      "Br",
      "Vr",
      "Hr",
      "Ur",
      "Wr",
      "Gr",
      "Kr",
      "qr",
      "Jr",
      "Yr",
      "Xr",
      "Zr",
      "Qr",
      "$r",
      "ei",
      "ti",
      "ni",
      "ri",
      "ii",
      "ai",
      "oi",
      "identityProbeHints",
      "si",
      "ci",
      "li",
      "ui",
      "di",
      "fi",
      "pi",
      "mi",
      "G",
      "hi",
      "gi",
      "_i",
      "vi",
      "yi",
      "bi",
      "xi",
      "Si",
      "Ci",
      "wi",
      "Ti",
      "Ei",
      "Di",
      "Oi",
      "ki",
      "Ai",
      "ji",
      "Mi",
      "Ni",
      "Pi",
      "Fi",
      "Ii",
      "Li",
      "Ri",
      "zi",
      "Bi",
      "Vi",
      "Hi",
      "Ui",
      "Wi",
      "Gi",
      "Ki",
      "qi",
      "Ji",
      "Yi",
      "Xi",
      "Zi",
      "Qi",
      "$i",
      "ea",
      "ta",
      "na",
      "ra",
      "ia",
      "aa",
      "oa",
      "sa",
      "ca",
      "la",
      "ua",
      "da",
      "fa",
      "pa",
      "ma",
      "ha",
      "ga",
      "_a",
      "va",
      "ya",
      "ba",
      "xa",
      "Sa",
      "Ca",
      "wa",
      "Ta",
      "Ea",
      "Da",
      "Oa",
      "ka",
      "Aa",
      "ja",
      "Ma",
      "Na",
      "Pa",
      "Fa",
      "Ia",
      "La",
      "Ra",
      "za",
      "Ba",
      "Va",
      "Ha",
      "Ua",
      "Wa",
      "Ga",
      "Ka",
      "qa",
      "Ja",
      "Ya",
      "Xa",
      "Za",
      "Qa",
      "$a",
      "eo",
      "K",
      "to",
      "no",
      "ro",
      "io",
      "ao",
      "oo",
      "so",
      "co",
      "lo",
      "uo",
      "fo",
      "po",
      "mo",
      "ho",
      "go",
      "_o",
      "vo",
      "yo",
      "bo",
      "xo",
      "So",
      "Co",
      "Bu",
      "Vu",
      "Hu",
      "Uu",
      "Wu",
      "Gu",
      "Ku",
      "qu",
      "Ju",
      "Yu",
      "Xu",
      "Zu",
      "Qu",
      "$u",
      "ed",
      "td",
      "nd",
      "rd",
      "id",
      "ad",
      "od",
      "sd",
      "cd",
      "ld",
      "ud",
      "dd",
      "fd",
      "pd",
      "md",
      "hd",
      "gd",
      "_d",
      "vd",
      "yd",
      "bd",
      "xd",
      "Sd",
      "Cd",
      "wd",
      "Td",
      "Ed",
      "Dd",
      "Od",
      "kd",
      "Ad",
      "jd",
      "Md",
      "Nd",
      "Pd",
      "Fd",
      "Id",
      "Ld",
      "Rd",
      "zd",
      "Bd",
      "Vd",
      "Hd",
      "Ud",
      "Wd",
      "Gd",
      "Kd",
      "qd",
      "Jd",
      "Yd",
      "Xd",
      "Zd",
      "Qd",
      "$d",
      "ef",
      "tf",
      "nf",
      "rf",
      "af",
      "of",
      "sf",
      "cf",
      "lf",
      "uf",
      "df",
      "ff",
      "pf",
      "mf",
      "hf",
      "gf",
      "_f",
      "vf",
      "yf",
      "bf",
      "xf",
      "Sf",
      "Cf",
      "wf",
      "Tf",
      "Ef",
      "Df",
      "Of",
      "kf",
      "Af",
      "jf",
      "Mf",
      "Nf",
      "Pf",
      "Ff",
      "If",
      "Lf",
      "Rf",
      "zf",
      "Bf",
      "Vf",
      "Hf",
      "Uf",
      "Wf",
      "Gf",
      "Kf",
      "qf",
      "Jf",
      "Yf",
      "Xf",
      "Zf",
      "Qf",
      "$f",
      "ep",
      "tp",
      "np",
      "rp",
      "ip",
      "ap",
      "op",
      "sp",
      "cp",
      "lp",
      "up",
      "dp",
      "fp",
      "pp",
      "mp",
      "hp",
      "gp",
      "_p",
      "vp",
      "yp",
      "bp",
      "xp",
      "Sp",
      "Cp",
      "wp",
      "Tp",
      "Ep",
      "Dp",
      "Op",
      "kp",
      "Q",
      "Gp",
      "Kp",
      "qp",
      "Jp",
      "Yp",
      "Xp",
      "Zp",
      "Qp",
      "$p",
      "em",
      "tm",
      "nm",
      "rm",
      "im",
      "am",
      "om",
      "Vm",
      "Hm",
      "Um",
      "Wm",
      "Gm",
      "Km",
      "qm",
      "Jm",
      "Ym",
      "Xm",
      "Zm",
      "Qm",
      "$m",
      "eh",
      "th",
      "$",
      "nh",
      "rh",
      "ih",
      "ah",
      "oh",
      "sh",
      "ch",
      "lh",
      "uh",
      "dh",
      "fh",
      "ph",
      "mh",
      "hh",
      "Gg"
    ]);
    function f(e, t, n, r) {
      return {
        id: e,
        name: t,
        loginUrl: n,
        favicon: new URL(`/favicon.ico`, n).href,
        builtin: true,
        ...r,
        selectors: { ...r.selectors },
        closeModalSelectors: [...r.closeModalSelectors],
        checkin: r.checkin ? { ...r.checkin } : void 0,
        adapter: r.adapter ? { ...r.adapter } : void 0
      };
    }
    function ot(e) {
      let t = e.replace(/\s+/g, ` `).trim(), n = (0, __contentScope.Qe)(t).toLowerCase(), r = t.split(/(?:\n|。|；)/).map((e2) => e2.trim()).filter(Boolean);
      for (let e2 of r)
        if ((0, __contentScope.et)(e2, __contentScope.at).length > 0) return e2.slice(0, 160);
      let i = /(?:服务(?:暂)?不可用|server\s+(?:unavailable|error)|bad\s+gateway|网关(?:错误|超时)|too\s+many\s+requests|服务端错误)/i.exec(
        n
      );
      return i ? t.slice(Math.max(0, i.index - 20), i.index + 80).trim() : /\b(?:4\d{2}|5\d{2})\b/.exec(n) && /(?:失败|错误|error|失败原因)/i.test(n) ? t.slice(0, 160) : null;
    }
    function dt(e) {
      let t = window.getComputedStyle(e);
      if (t.display === `none` || t.visibility === `hidden` || t.opacity === `0`) return false;
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
        e.getAttribute(`title`)
      ].map((e2) => typeof e2 == `string` ? e2.replace(/\s+/g, ``).toLowerCase() : ``).filter(Boolean).some((e2) => __contentScope.gt.has(e2));
    }
    function vt(e) {
      let t = e.closest(__contentScope.pt);
      if (!t) return null;
      let n = t;
      for (; ; ) {
        let e2 = n.parentElement, t2 = e2 ? e2.closest(__contentScope.pt) : null;
        if (!t2 || t2 === document.body) break;
        n = t2;
      }
      return n;
    }
    function yt(e, t = __contentScope.F) {
      for (let n of (0, __contentScope.z)(e)) {
        let e2 = (0, __contentScope.L)(n);
        if (!(0, __contentScope.R)(n) && __contentScope.ct.test(e2) && !__contentScope.lt.test(e2) && !(0, __contentScope.I)(e2, t))
          return { kind: `target`, text: e2 };
        if ((0, __contentScope.R)(n) && (0, __contentScope.I)(e2, t))
          return { kind: `already`, text: e2 };
      }
      return e.querySelector?.(`input[type="password"], input[autocomplete="one-time-code"]`) ? { kind: `form`, text: `` } : (0, __contentScope.xt)(e) || null;
    }
    function xt(e) {
      if (!e.querySelector?.(__contentScope.bt)) return null;
      for (let t of (0, __contentScope.z)(e)) {
        let e2 = (0, __contentScope.L)(t);
        if (__contentScope.ct.test(e2) && !__contentScope.lt.test(e2)) return { kind: `form`, text: e2 };
      }
      return null;
    }
    function St(e = __contentScope.F) {
      let t;
      try {
        t = [...document.querySelectorAll(__contentScope.pt)];
      } catch {
        return false;
      }
      return t.some((t2) => (0, __contentScope.dt)(t2) && !!(0, __contentScope.yt)(t2, e));
    }
    function Ct(e = __contentScope.F) {
      return (0, __contentScope.St)(e) ? true : !!(0, __contentScope.yt)(document, e);
    }
    function wt(e, t = __contentScope.F, n) {
      let r = (0, __contentScope.L)(e);
      if (__contentScope.ct.test(r) && !__contentScope.lt.test(r))
        return {
          verdict: `keep`,
          reason: `候选关闭按钮自身是签到动作「${r.slice(0, 20)}」`
        };
      let i = n ?? (0, __contentScope.vt)(e);
      if ((0, __contentScope.ht)(r)) return { verdict: `close` };
      if (i) {
        let e2 = (0, __contentScope.yt)(i, t);
        if (e2) {
          let t2 = e2.text ? `「${e2.text.slice(0, 20)}」` : ``;
          return { verdict: `keep`, reason: `弹窗内含签到${e2.kind}${t2}` };
        }
        return { verdict: `close` };
      }
      return (0, __contentScope.St)(t) && !(0, __contentScope.ht)(r) ? {
        verdict: `keep`,
        reason: `关闭按钮归属不明，且页面存在含签到控件的弹窗`
      } : { verdict: `close` };
    }
    function Ft(e) {
      if (e) {
        if (!e.isConnected) return null;
        let t = (0, __contentScope.qe)(e)?.closest(__contentScope.jt);
        return t && (0, __contentScope.It)(t) && (0, __contentScope.Bt)(t) ? t : null;
      }
      return (0, __contentScope.xe)(__contentScope.jt).filter((e2) => {
        if (!(0, __contentScope.It)(e2) || !(0, __contentScope.Bt)(e2)) return false;
        if (e2.matches(__contentScope.At.join(`, `))) return true;
        let t = e2.getBoundingClientRect();
        return t.width >= window.innerWidth * 0.6 && t.height >= window.innerHeight * 0.4;
      }).reverse().find((e2) => (0, __contentScope.Lt)(e2).some(__contentScope.zt)) ?? null;
    }
    function It(e) {
      if (!e.isConnected || !(0, __contentScope.O)(e)) return false;
      for (let t = e; t; t = t.parentElement) {
        let e2 = window.getComputedStyle(t);
        if (t.hidden || e2.display === `none` || e2.visibility === `hidden` || e2.visibility === `collapse` || e2.opacity === `0`)
          return false;
      }
      return true;
    }
    function Lt(e) {
      let t = /* @__PURE__ */ new Set([e]);
      if (e.matches(__contentScope.Nt)) {
        for (let n of [e.previousElementSibling, e.nextElementSibling])
          n instanceof HTMLElement && n.matches(__contentScope.Pt) && (0, __contentScope.It)(n) && t.add(n);
        for (let n of (0, __contentScope.Rt)(e)) t.add(n);
      }
      return [...t];
    }
    function Rt(e) {
      if (e.matches(__contentScope.Mt) || e.querySelector(__contentScope.Mt)) return [];
      let t = e.parentElement;
      if (!t) return [];
      let n = e.getBoundingClientRect(), r = Math.max(0, n.left), i = Math.min(window.innerWidth, n.right), a = Math.max(0, n.top), o = Math.min(window.innerHeight, n.bottom);
      if (i <= r || o <= a) return [];
      let s = /* @__PURE__ */ new Set();
      for (let n2 = 1; n2 <= 3; n2 += 1)
        for (let c = 1; c <= 3; c += 1) {
          let l = r + (i - r) * c / 4, u = a + (o - a) * n2 / 4, d = document.elementFromPoint(l, u);
          if (!(d instanceof HTMLElement) || d === e || e.contains(d)) continue;
          let f2 = d;
          for (; f2.parentElement && f2.parentElement !== t; ) f2 = f2.parentElement;
          f2.parentElement === t && f2 !== e && (0, __contentScope.It)(f2) && s.add(f2);
        }
      return [...s];
    }
    function zt(e) {
      let t = e.getBoundingClientRect(), n = Math.max(0, t.left), r = Math.min(window.innerWidth, t.right), i = Math.max(0, t.top), a = Math.min(window.innerHeight, t.bottom);
      if (r <= n || a <= i) return false;
      let o = Math.min(8, (r - n) / 2), s = Math.min(8, (a - i) / 2);
      return [
        [(n + r) / 2, (i + a) / 2],
        [n + o, i + s],
        [r - o, a - s]
      ].some(([t2, n2]) => {
        let r2 = document.elementFromPoint(t2, n2);
        return !!r2 && (r2 === e || e.contains(r2));
      });
    }
    function Bt(e) {
      try {
        return window.getComputedStyle(e).pointerEvents !== `none`;
      } catch {
        return true;
      }
    }
    function Vt(e) {
      return e?.isConnected ? !!(0, __contentScope.qe)(e) : !!(0, __contentScope.Ft)();
    }
    function Ht(e) {
      let t = e.closeModalSelectors ?? [];
      return [.../* @__PURE__ */ new Set([...t, ...__contentScope.r])];
    }
    function Wt(e) {
      if (!e.isConnected || !(0, __contentScope.O)(e)) return null;
      let t = e.getBoundingClientRect(), n = t.left + t.width / 2, r = t.top + t.height / 2;
      return n >= 0 && n < window.innerWidth && r >= 0 && r < window.innerHeight ? { x: n, y: r } : null;
    }
    function Gt(e) {
      if (!(0, __contentScope.It)(e) || !(0, __contentScope.Bt)(e) || (0, __contentScope.R)(e) || e.matches(`:disabled`) || e.closest(`[inert], [aria-hidden="true"], [aria-disabled="true"]`))
        return false;
      let t = (0, __contentScope.Wt)(e);
      if (!t) return true;
      let n = document.elementFromPoint(t.x, t.y);
      return !!n && (n === e || e.contains(n));
    }
    function Kt(e, t) {
      let n = t.find((t2) => t2.contains(e)), r = e.closest(__contentScope.Mt);
      if (r && (!n || n.contains(r))) {
        let e2 = `dialog[open], [role="dialog"], [aria-modal="true"], [data-slot="dialog-content"]`;
        if (!r.matches(e2)) {
          let t2 = r.parentElement?.closest(e2);
          if (t2 && n?.contains(t2)) return t2;
        }
        return r;
      }
      return n ?? (0, __contentScope.vt)(e) ?? e;
    }
    function qt(e, t = null) {
      let n = t ? (0, __contentScope.Lt)(t) : (0, __contentScope.xe)(`${__contentScope.ft.join(`, `)}, ${__contentScope.Mt}`).filter(
        __contentScope.It
      ), r = t ? n : [document], i = e.flatMap(
        (e2) => r.flatMap(
          (t2) => (0, __contentScope.xe)(e2, t2).map((t3) => ({
            selector: e2,
            element: t3
          }))
        )
      ), a = [...new Set(n.flatMap((e2) => (0, __contentScope.z)(e2)))], o = [
        ...new Set(
          n.flatMap((e2) => [...e2.querySelectorAll(`div, span`)]).filter((e2) => {
            if (!(0, __contentScope.It)(e2)) return false;
            let t2 = (e2.innerText || e2.textContent || ``).trim().replace(/\s+/g, ` `);
            return !t2 || t2.length > 40 || [...e2.children].some((e3) => (e3.textContent || ``).trim()) ? false : (0, __contentScope.ht)(t2) || (0, __contentScope._t)(e2);
          })
        )
      ], s = [...r.flatMap((e2) => [...e2.querySelectorAll(__contentScope.Ut)]), ...a, ...o].filter(
        (e2) => (0, __contentScope.It)(e2) ? (0, __contentScope.ht)((0, __contentScope.L)(e2)) ? true : (0, __contentScope._t)(e2) ? !!(0, __contentScope.vt)(e2) || n.some((t2) => t2.contains(e2)) : false : false
      ), c = /* @__PURE__ */ new Set();
      return [...i, ...s.map((e2) => ({ selector: null, element: e2 }))].map(({ selector: e2, element: t2 }) => {
        let r2 = t2.closest(__contentScope.Ut) ?? t2;
        return { selector: e2, element: r2, scope: (0, __contentScope.Kt)(r2, n) };
      }).filter(
        ({ element: e2 }) => c.has(e2) || (c.add(e2), t && !n.some((t2) => t2.contains(e2))) ? false : (0, __contentScope.Gt)(e2)
      ).sort(
        (e2, t2) => Number(!(0, __contentScope.Wt)(e2.element)) - Number(!(0, __contentScope.Wt)(t2.element)) || Number(!(0, __contentScope.ht)((0, __contentScope.L)(e2.element))) - Number(!(0, __contentScope.ht)((0, __contentScope.L)(t2.element)))
      );
    }
    async function Jt(e, t, n) {
      let r = Date.now() + n;
      for (; ; ) {
        if (!(0, __contentScope.It)(e) || t && (0, __contentScope.Wt)(t) && !(0, __contentScope.qe)(t))
          return true;
        let n2 = r - Date.now();
        if (n2 <= 0) return false;
        await (0, __contentScope.w)(Math.min(50, n2));
      }
    }
    async function Yt(e, t, n, r, i) {
      let a = 0, o = 0, s = false, c = Date.now() + __contentScope.Et, l = /* @__PURE__ */ new Set();
      for (; Date.now() < c; ) {
        let u = (0, __contentScope.Ft)(r);
        if (r && !u) break;
        let d = (0, __contentScope.qt)(e, u).filter(
          ({ element: e2 }) => ![...i.failedButtons].some((t2) => t2 === e2 || t2.contains(e2) || e2.contains(t2))
        );
        if (d.length === 0) break;
        let f2 = null, p = 0;
        for (let e2 of d) {
          let r2 = (0, __contentScope.wt)(e2.element, t, e2.scope === e2.element ? void 0 : e2.scope);
          if (r2.verdict === `close`) {
            f2 = e2;
            break;
          }
          p += 1, l.has(r2.reason) || (l.add(r2.reason), n.push(`保留弹窗：${r2.reason}`));
        }
        if (o = p, !f2) break;
        let m = (0, __contentScope.Ct)(t), h = (0, __contentScope.L)(f2.element).replace(/\s+/g, ` `).slice(0, 40) || (0, __contentScope.N)(f2.element), g = f2.selector ?? `文字识别`, _ = `「${h}」（${(0, __contentScope.N)(f2.scope)}，${g}）`, v = null;
        try {
          let e2 = await (0, __contentScope.M)(f2.element, { deadline: c });
          n.push(`公告关闭按钮已收到${e2 === `trusted` ? `浏览器可信` : `DOM`}点击：${_}`);
        } catch (e2) {
          v = e2 instanceof Error ? e2.message : String(e2);
        }
        await (0, __contentScope.Jt)(
          f2.scope,
          r,
          Math.max(0, Math.min(__contentScope.Dt, c - Date.now()))
        ) ? (n.push(
          v ? `公告关闭点击回执未确认，但已确认对应弹窗消失或目标遮挡解除：${_}` : `已确认对应公告消失或目标遮挡解除：${_}`
        ), a += 1, await (0, __contentScope.w)(120), m && !(0, __contentScope.Ct)(t) && (s = true)) : (i.failedButtons.add(f2.element), n.push(
          v ? `公告关闭操作未确认：${_}，${v}；当前遮挡仍在，尝试其他关闭按钮` : `公告关闭按钮未能解除当前遮挡：${_}；跳过该按钮，尝试其他候选`
        ));
      }
      return { closed: a, kept: o, lostEvidence: s };
    }
    function Xt(e) {
      return [...e.querySelectorAll(__contentScope.Ut), ...(0, __contentScope.z)(e)].some(
        (e2) => (0, __contentScope.It)(e2) && ((0, __contentScope.ht)((0, __contentScope.L)(e2)) || (0, __contentScope._t)(e2))
      );
    }
    async function Zt(e, t, n, r) {
      let i = (0, __contentScope.Ft)(n);
      if (!i) return `absent`;
      if ((0, __contentScope.St)(e)) return `functional`;
      let a = (0, __contentScope.Lt)(i);
      if (a.some((t2) => (0, __contentScope.yt)(t2, e))) return `functional`;
      let o = `${__contentScope.ft.join(`, `)}, ${__contentScope.Mt}`, s = [
        ...new Set(
          a.flatMap((e2) => [...e2.matches(o) ? [e2] : [], ...(0, __contentScope.xe)(o, e2)])
        )
      ].filter(__contentScope.It);
      if (s.length === 0 && !a.some((e2) => (0, __contentScope.Xt)(e2))) return `skipped`;
      if (r.escapedOverlays.has(i)) return `failed`;
      r.escapedOverlays.add(i);
      let c = r.failedButtons.size > 0 ? `已尝试的公告关闭按钮未生效` : `当前公告没有可用的关闭按钮`;
      t.push(`${c}（${(0, __contentScope.N)(i)}），尝试一次 Esc`);
      let l = document.activeElement;
      return (0, __contentScope.Ye)([l && s.some((e2) => e2.contains(l)) ? l : s[s.length - 1] ?? i]), await (0, __contentScope.Jt)(i, n, __contentScope.Dt) ? `gone` : `failed`;
    }
    async function Qt(e, t, {
      waitForAppear: n = false,
      blockedElement: r,
      cleanupState: i = {
        failedButtons: /* @__PURE__ */ new Set(),
        escapedOverlays: /* @__PURE__ */ new Set()
      }
    } = {}) {
      let a = (0, __contentScope.Ht)(e), o = e.checkin?.alreadyText?.length ? e.checkin.alreadyText : __contentScope.F, s = await (0, __contentScope.Yt)(a, o, t, r, i);
      if (s.closed === 0 && n) {
        let appearanceBudget = (0, __contentScope.On)(e) || (0, __contentScope.ar)(e) ? Math.min(250, __contentScope.Tt) : __contentScope.Tt, deadline = Date.now() + appearanceBudget;
        for (; Date.now() < deadline; )
          if (await (0, __contentScope.w)(Math.min(__contentScope.Ot, deadline - Date.now())), (0, __contentScope.Ft)(r) || !r && (0, __contentScope.qt)(a).length > 0) {
            let e2 = await (0, __contentScope.Yt)(a, o, t, r, i);
            s = {
              closed: e2.closed,
              kept: e2.kept || s.kept,
              lostEvidence: s.lostEvidence || e2.lostEvidence
            };
            break;
          }
      }
      let { closed: c, kept: l, lostEvidence: u } = s, d = await (0, __contentScope.Zt)(o, t, r, i), f2 = (0, __contentScope.Vt)(r);
      return c > 0 ? t.push(f2 ? `关闭了 ${c} 个公告，但页面仍有遮罩` : `关闭了 ${c} 个公告/弹窗`) : d === `gone` ? t.push(`已用 Esc 关闭挡住页面的公告弹窗`) : l > 0 || d === `functional` ? t.push(`保留了 ${Math.max(l, 1)} 个含登录/签到控件的弹窗，未作为公告关闭`) : f2 ? d === `failed` ? t.push(
        i.failedButtons.size > 0 ? `已尝试的公告关闭按钮未生效，Esc 也未解除遮挡，后续操作仍被挡住` : `当前遮挡层没有可用的公告关闭按钮，Esc 也未解除遮挡`
      ) : t.push(
        i.failedButtons.size > 0 ? `公告关闭按钮未能解除遮挡，未对归属不明的浮层继续按 Esc` : `当前遮挡层没有可安全点击的公告关闭按钮，未对归属不明的浮层按 Esc`
      ) : t.push(`未发现公告弹窗`), u && t.push(`关闭弹窗后页面失去签到线索，疑似误关功能弹窗`), {
        closed: c,
        blocked: f2,
        keptFunctional: Math.max(l, +(d === `functional`))
      };
    }
    async function B(e, t, n, r = `签到控件`) {
      let i = (0, __contentScope.qe)(e);
      if (!i) return null;
      n.push(`${r}被 ${(0, __contentScope.N)(i)} 遮挡，尝试关闭遮挡的公告`);
      let a = { failedButtons: /* @__PURE__ */ new Set(), escapedOverlays: /* @__PURE__ */ new Set() };
      for (let r2 = 0; r2 < 2 && i; r2 += 1) {
        if (await (0, __contentScope.Qt)(t, n, {
          waitForAppear: false,
          blockedElement: e,
          cleanupState: a
        }), !e.isConnected)
          return n.push(`公告处理期间页面已重绘，需要重新定位操作控件`), null;
        e.scrollIntoView({ block: `center` }), await (0, __contentScope.w)(r2 === 0 ? 250 : 450), i = (0, __contentScope.qe)(e);
      }
      return i || n.push(`遮挡已清除，继续点击`), i;
    }
    async function tn(e, t) {
      if (e.beforeClick && !await e.beforeClick())
        throw Error(`${t}前的人机验证未完成，已停止页面操作`);
    }
    function bn(e, t) {
      if (!t?.trim() || t.includes(`text=`)) return false;
      try {
        return e.matches(t);
      } catch {
        return false;
      }
    }
    function xn(e, t) {
      return t.some((t2) => (0, __contentScope.bn)(e, t2));
    }
    function Sn(e) {
      return (e.closest(`form, [role="dialog"], main, section`)?.textContent ?? ``).replace(/\s+/g, ` `).trim().slice(0, 1e3);
    }
    function Cn(e) {
      let t = [...e.labels ?? []].map((e2) => e2.textContent ?? ``);
      return [e.id, e.name, e.placeholder, e.autocomplete, e.getAttribute(`aria-label`), ...t].filter(Boolean).join(` `);
    }
    function wn(e, t, n) {
      let r = [...t.querySelectorAll(`input`)].filter(
        (e2) => e2 !== n && !e2.disabled && !e2.readOnly && [`text`, `email`, `tel`, ``].includes(e2.type.toLowerCase()) && (0, __contentScope.O)(e2)
      ), a = r.map((t2) => {
        let n2 = (0, __contentScope.Cn)(t2), a2 = (0, __contentScope.Sn)(t2), o = (0, __contentScope.bn)(t2, e), s = 0;
        return o && (s += 220), __contentScope.an.test(n2) && !o ? { element: t2, score: -1 / 0 } : ((0, __contentScope.xn)(t2, __contentScope.i) && (s += 70), /^(?:username|email)$/i.test(t2.autocomplete) && (s += 120), t2.type.toLowerCase() === `email` && (s += 90), __contentScope.nn.test(n2) && (s += 70), t2.type.toLowerCase() === `text` && (s += 10), r.length === 1 && (s += 50), __contentScope.cn.test(a2) && (s += 30), __contentScope.ln.test(a2) && !__contentScope.cn.test(a2) && (s -= 180), __contentScope.rn.test(n2) && (s -= 200), { element: t2, score: s });
      }).sort((e2, t2) => t2.score - e2.score)[0];
      return !a || a.score < 60 ? null : {
        element: a.element,
        selector: `页面表单语义`,
        fallback: !(0, __contentScope.bn)(a.element, e)
      };
    }
    function Tn(e, t, n) {
      return (0, __contentScope.wn)(e, t, n);
    }
    async function En(e, t, n = document) {
      let r = Date.now() + t;
      for (; Date.now() < r; ) {
        let t2 = (0, __contentScope.V)(e, n);
        if (t2) return t2;
        await (0, __contentScope.w)(200);
      }
      return null;
    }
    function Dn(e) {
      return (0, __contentScope.V)(e.selectors.password, document) ?? (0, __contentScope.Tn)(e.selectors.username, document);
    }
    function On(e) {
      const selectors = e.selectors ?? {};
      if ((0, __contentScope.V)(selectors.password, document) && (0, __contentScope.kn)()) return true;
      let t = (0, __contentScope.Tn)(selectors.username, document);
      if (!t) return false;
      let n = t.element;
      let r = (0, __contentScope.Cn)(n);
      if (__contentScope.rn.test(r)) return false;
      if (!/^(?:username|email)$/i.test(n.autocomplete) && n.type.toLowerCase() !== `email` && !__contentScope.nn.test(r))
        return false;
      const region = n.form ?? n.closest?.(`form, [role="dialog"], main, section`) ?? document, heading = region.querySelector?.(`h1, h2, h3, [role="heading"]`), title = heading?.innerText ?? heading?.textContent ?? ``, registration = /注册|创建(?:新)?账号|sign\s*up|create\s+(?:an?\s+)?account/i.test(title), loginRoute = /(?:^|\/)(?:login|sign-?in)(?:\/|$)/i.test(
        `${location.pathname}${location.hash.replace(/^#/, `/`)}`
      ), loginHeading = /登录|登入|sign\s*in|log\s*in/i.test(title), loginAction = [
        ...region.querySelectorAll?.(`button, [role="button"], input[type="submit"]`) ?? []
      ].some(
        (control) => (0, __contentScope.O)(control) && /^(?:登录|登陆|登入|立即登录|继续登录|sign\s*in|log\s*in)$/i.test(
          (control.innerText || control.textContent || control.value || ``).trim()
        )
      );
      return !registration && (loginRoute || loginHeading || loginAction);
    }
    function kn() {
      return ![...document.querySelectorAll(`input[type="password"]`)].filter((e) => !e.disabled && !e.readOnly && (0, __contentScope.O)(e)).some(
        (e) => __contentScope.sn.test((0, __contentScope.Cn)(e)) || e.autocomplete.toLowerCase() === `new-password`
      );
    }
    function An(e) {
      return (0, __contentScope.V)(e.selectors.password, document) !== null && (0, __contentScope.kn)() || (0, __contentScope.nr)() !== null;
    }
    async function jn(e, t) {
      let n = Date.now() + t;
      for (; Date.now() < n; ) {
        let t2 = (0, __contentScope.Dn)(e);
        if (t2) return t2;
        await (0, __contentScope.w)(200);
      }
      return null;
    }
    function Mn(e) {
      let { element: t } = e;
      return t.id ? `#${t.id}` : t.name ? `input[name="${t.name}"]` : t.autocomplete ? `input[autocomplete="${t.autocomplete}"]` : e.selector;
    }
    function isLoginHelpControl(control) {
      return /为什么|为何|如何|怎么|怎样|教程|指南|帮助|文档|常见(?:问答|问题)|问题解答|\b(?:how|why|what|faq|help|documentation|docs?|tutorial|guide)\b|[?？]\s*$/i.test(
        (0, __contentScope.Rn)(control)
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
            let n = new URL(t.href, e.href), r = n.pathname === e.pathname && n.search === e.search;
            if (n.origin === e.origin && !r && /(?:^|\/)(?:login|sign-?in)(?:\/|$)/i.test(n.pathname))
              return t;
          } catch {
          }
      return null;
    }
    function In() {
      for (let e of document.querySelectorAll(`button, [role="button"]`)) {
        if (!(0, __contentScope.O)(e) || isLoginHelpControl(e)) continue;
        let t = (0, __contentScope.Rn)(e).replace(/\s+/g, ``).toLowerCase();
        if (t && !__contentScope.Fn.some((e2) => t.includes(e2.replace(/\s+/g, ``))) && (directLoginLabel.test(t) || __contentScope.Pn.some((e2) => t.includes(e2))))
          return e;
      }
      return null;
    }
    function Ln() {
      let e;
      try {
        e = new URL(location.href);
      } catch {
        return false;
      }
      return [...document.querySelectorAll(`a[href]`)].some((t) => {
        if (!(0, __contentScope.O)(t)) return false;
        try {
          let n = new URL(t.href, e.href);
          return n.origin === e.origin && /(?:^|\/)(?:check-?in|daily-check-?in)(?:\/|$)/i.test(n.pathname);
        } catch {
          return false;
        }
      });
    }
    function Rn(e) {
      return [
        e.textContent,
        e.getAttribute(`value`),
        e.getAttribute(`aria-label`),
        e.getAttribute(`title`)
      ].filter(Boolean).join(` `).trim();
    }
    function zn(e) {
      let t = typeof e.className == `string` ? e.className : ``, n = e instanceof HTMLAnchorElement ? e.href : ``;
      return [(0, __contentScope.Rn)(e), e.id, t, n].filter(Boolean).join(` `).replace(/\s+/g, ` `).trim();
    }
    function Bn(e) {
      return (0, __contentScope.Rn)(e).replace(/\s+/g, ` `).trim() || (0, __contentScope.zn)(e) || e.tagName.toLowerCase();
    }
    function Vn() {
      for (let e of [
        `[role="alert"]`,
        `.semi-toast-content`,
        `.semi-notification-content`,
        `.ant-message-notice-content`,
        `.ant-notification-notice-message`
      ]) {
        let t = [...document.querySelectorAll(e)].find((e2) => (0, __contentScope.O)(e2))?.innerText?.replace(/\s+/g, ` `).trim();
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
          return false;
        }
      });
    }
    function Gn(e) {
      let t = (0, __contentScope.zn)(e), n = /\/(?:oauth|auth|sso)(?:\/|$)|github\.com\/login\/oauth/i.test(t), r = __contentScope.vn.test(t), i = __contentScope.hn.test(t), a = __contentScope._n.test(t), o = __contentScope.gn.test(t), s = e instanceof HTMLAnchorElement && !n, c = 0;
      return i && (!s || r) || a && (!s || r) ? c += 180 : o && (!s || r) ? c += 140 : (i || a || o) && (c += 40), r && (c += 90), n && (c += 80), e instanceof HTMLAnchorElement && (c += 10), e instanceof HTMLInputElement && e.type === `submit` && (c -= 80), __contentScope.un.test((0, __contentScope.Rn)(e)) && (c -= 120), __contentScope.yn.test(t) && (c -= 180), c;
    }
    function Kn(e) {
      return [
        ...document.querySelectorAll(
          `button, a[href], [role="button"], input[type="button"], input[type="submit"]`
        )
      ].filter((e2) => (0, __contentScope.O)(e2) && !isLoginHelpControl(e2)).filter((t) => {
        let n = (0, __contentScope.zn)(t);
        return e === `github` ? __contentScope.hn.test(n) : e !== `passkey` || __contentScope._n.test(n);
      }).map((e2) => ({
        element: e2,
        score: (0, __contentScope.Gn)(e2),
        label: (0, __contentScope.Bn)(e2),
        disabled: (0, __contentScope.H)(e2)
      })).filter(({ score: e2 }) => e2 >= 100).sort(
        (e2, t) => Number(e2.disabled) - Number(t.disabled) || t.score - e2.score || e2.label.length - t.label.length
      )[0]?.element ?? null;
    }
    function describeLoginControl(control) {
      if (!(0, __contentScope.O)(control) || isLoginHelpControl(control)) return null;
      const matchText = (0, __contentScope.Rn)(control).replace(/\s+/g, ` `).trim().slice(0, 120);
      if (directLoginLabel.test(matchText)) return null;
      let hrefPath = ``, url = null;
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
        url ? `${url.hostname}${url.pathname}` : ``
      ].filter(Boolean).join(` `);
      if (/注册|忘记|重置|找回|修改|退出|注销|帮助|文档|绑定|解绑|关联账号|账号设置|账户设置|管理密钥|添加密钥|sign\s*up|register|forgot|reset|recover|log[\s-]?out|sign[\s-]?out|documentation|settings|manage|disconnect|(?:link|unlink)\s+(?:an?\s+)?account/i.test(
        matchText
      ))
        return null;
      const authPath = /\/(?:oauth|auth|sso|login|signin|sign-in|connect)(?:\/|$)/i.test(hrefPath), intent = /登录|登陆|登入|授权|第三方|继续|sign[\s-]?in|log[\s-]?in|continue\s*with|oauth|openid|oidc|sso/i.test(
        matchText
      ), providers = [
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
        [`twitter`, `X / Twitter`, /twitter|(?:^|\s)x(?:\s|$)/i]
      ];
      if (/passkey|webauthn|security\s*key|通行密钥|安全密钥|生物识别/i.test(semantic)) {
        return {
          key: `passkey:passkey`,
          method: `passkey`,
          provider: `passkey`,
          label: `Passkey / 通行密钥`,
          matchText,
          ...hrefPath ? { hrefPath } : {}
        };
      }
      const code = /验证码登录|校验码登录|动态码登录|邮箱验证码|邮件验证码|短信验证码|邮箱.*(?:验证码|链接)|email.*(?:code|magic\s*link)|(?:sign[\s-]?in|log[\s-]?in).*(?:code|magic\s*link)|one[\s-]?time\s*(?:code|password)|magic\s*link/i.test(
        matchText
      ), qr2 = /扫码登录|二维码登录|scan.*(?:qr|log[\s-]?in)|qr.*(?:sign[\s-]?in|log[\s-]?in)/i.test(
        matchText
      );
      if (code || qr2) {
        const provider2 = qr2 ? `qrcode` : /短信|手机|sms|phone/i.test(matchText) ? `sms-code` : `email-code`, label = qr2 ? `扫码登录` : provider2 === `sms-code` ? `短信验证码` : `邮箱验证码 / 登录链接`;
        return {
          key: `manual:${provider2}`,
          method: `manual`,
          provider: provider2,
          label,
          matchText,
          ...hrefPath ? { hrefPath } : {}
        };
      }
      const provider = providers.find(([, , pattern]) => pattern.test(semantic));
      if (provider) {
        const [name, label] = provider, normalizedLabel = matchText.replace(/(?:账号|账户|account)$/i, ``).replace(/[\s._/-]/g, ``).toLowerCase(), bareProvider = [name, label].some(
          (value) => value.replace(/[\s._/-]/g, ``).toLowerCase() === normalizedLabel
        ), method = name === `github` ? `github` : `oauth`;
        if (!authPath && !intent && !bareProvider) return null;
        if (control instanceof HTMLAnchorElement && !authPath && !intent) return null;
        return {
          key: `${method}:${name}`,
          method,
          provider: name,
          label,
          matchText,
          ...hrefPath ? { hrefPath } : {}
        };
      }
      const authorizationAction = /^(?:第三方(?:账号)?登录|授权(?:登录|并登录)?|(?:使用|通过|用).+(?:登录|登陆|登入|继续)|(?:sign[\s-]?in|log[\s-]?in)\s+with\s+.+|continue\s+with\s+.+|(?:oauth|openid|oidc|sso)(?:\s+(?:login|sign[\s-]?in))?)[.!。！›»>→]*$/i.test(
        matchText
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
        ...matchText ? { matchText } : {},
        ...hrefPath ? { hrefPath } : {}
      };
    }
    function findSelectedLoginControl(entry, method = entry?.method) {
      if (!entry || entry.method !== method) return null;
      const matches = [
        ...document.querySelectorAll(
          `button, a[href], [role="button"], input[type="button"], input[type="submit"]`
        )
      ].map((control) => ({ control, candidate: (0, __contentScope.describeLoginControl)(control) })).filter(
        ({ candidate }) => candidate?.method === method && candidate.provider === entry.provider
      ).filter(({ candidate }) => {
        if (entry.provider !== `oauth`) return true;
        if (entry.matchText) return candidate.matchText === entry.matchText;
        return !!entry.hrefPath && candidate.hrefPath === entry.hrefPath && !candidate.matchText;
      }).sort((left, right) => {
        const score = ({ control, candidate }) => (entry.matchText && candidate.matchText === entry.matchText ? 4 : 0) + (entry.hrefPath && candidate.hrefPath === entry.hrefPath ? 2 : 0) - ((0, __contentScope.H)(control) ? 16 : 0);
        return score(right) - score(left);
      });
      if (entry.provider === `oauth` && !entry.matchText && matches.length !== 1) return null;
      return matches[0]?.control ?? null;
    }
    function collectLoginEntries() {
      const entries = /* @__PURE__ */ new Map();
      for (const control of document.querySelectorAll(
        `button, a[href], [role="button"], input[type="button"], input[type="submit"]`
      )) {
        const entry = (0, __contentScope.describeLoginControl)(control);
        if (entry && !entries.has(entry.key)) entries.set(entry.key, entry);
      }
      return [...entries.values()];
    }
    async function qn(e, t, n) {
      let r = Date.now() + t, i = null;
      for (; Date.now() < r; ) {
        let selected = e.loginEntry?.method === n ? e.loginEntry : null, t2 = selected ? `` : e.oauthButtonSelector?.trim(), r2 = selected ? (0, __contentScope.findSelectedLoginControl)(selected, n) : t2 ? (0, __contentScope.D)(t2) : (0, __contentScope.Kn)(n);
        if (r2 && (0, __contentScope.O)(r2)) {
          let e2 = { element: r2, automatic: !t2, selected: !!selected };
          if (!(0, __contentScope.H)(r2)) return e2;
          i = e2;
        }
        await (0, __contentScope.w)(200);
      }
      return i;
    }
    function Jn(e) {
      let t = [...e.labels ?? []].map((e2) => e2.textContent ?? ``), n = (e.getAttribute(`aria-labelledby`) ?? ``).split(/\s+/).filter(Boolean).map((e2) => document.getElementById(e2)?.textContent ?? ``);
      return [
        e.id,
        e.name,
        e.getAttribute(`aria-label`),
        e.closest(`label`)?.textContent,
        e.closest(`.semi-checkbox`)?.textContent,
        e.parentElement?.textContent,
        ...t,
        ...n
      ].filter(Boolean).join(` `).replace(/\s+/g, ` `).trim();
    }
    function Yn(e) {
      return (0, __contentScope.O)(e) ? e : [
        e.closest(`label`),
        e.closest(`[role="checkbox"]`),
        e.closest(`.semi-checkbox`),
        e.parentElement
      ].find((e2) => !!e2 && (0, __contentScope.O)(e2)) ?? null;
    }
    function Xn(e) {
      return __contentScope.mn.test((0, __contentScope.Jn)(e));
    }
    function Zn(e) {
      return [
        (0, __contentScope.Rn)(e),
        e.id,
        e.closest(`label`)?.textContent,
        e.parentElement?.textContent
      ].filter(Boolean).join(` `).replace(/\s+/g, ` `).trim();
    }
    function Qn(e) {
      return [...e.querySelectorAll(`input[type="checkbox"]`)].some(
        (e2) => !e2.disabled && !e2.checked && !!(0, __contentScope.Yn)(e2) && __contentScope.pn.test((0, __contentScope.Jn)(e2)) && !(0, __contentScope.Xn)(e2)
      ) ? true : [...e.querySelectorAll(`[role="checkbox"]`)].some(
        (e2) => (0, __contentScope.O)(e2) && e2.getAttribute(`aria-checked`) !== `true` && !(0, __contentScope.H)(e2) && __contentScope.pn.test((0, __contentScope.Zn)(e2)) && !__contentScope.mn.test((0, __contentScope.Zn)(e2))
      );
    }
    async function $n(e, t) {
      let n = [...e.querySelectorAll(`input[type="checkbox"]`)].find((e2) => {
        if (e2.disabled || e2.checked || !(0, __contentScope.Yn)(e2)) return false;
        let t2 = (0, __contentScope.Jn)(e2);
        return __contentScope.pn.test(t2) && !__contentScope.mn.test(t2);
      });
      if (!n) {
        let n2 = [...e.querySelectorAll(`[role="checkbox"]`)].find((e2) => {
          if (!(0, __contentScope.O)(e2) || e2.getAttribute(`aria-checked`) === `true` || (0, __contentScope.H)(e2))
            return false;
          let t2 = (0, __contentScope.Zn)(e2);
          return __contentScope.pn.test(t2) && !__contentScope.mn.test(t2);
        });
        return !n2 || (await (0, __contentScope.M)(n2), await (0, __contentScope.w)(100), !(n2.getAttribute(`aria-checked`) === `true` || n2.querySelector(`input[type="checkbox"]:checked`))) ? false : (t.push(`已勾选登录协议与隐私政策`), true);
      }
      if ((0, __contentScope.Me)(n), !n.checked) {
        let e2 = (0, __contentScope.Yn)(n);
        e2 && e2 !== n && await (0, __contentScope.M)(e2);
      }
      return !n.checked && n.getAttribute(`aria-checked`) !== `true` ? false : (t.push(`已勾选登录协议与隐私政策`), true);
    }
    function er(e, t) {
      let n = (0, __contentScope.D)(e), r = [...t.querySelectorAll(`button, input[type="submit"], [role="button"]`)].filter((e2) => (0, __contentScope.O)(e2)).map((t2) => {
        let r2 = (0, __contentScope.Rn)(t2), i = t2.getAttribute(`type`)?.toLowerCase(), a = 0;
        return (t2 === n || (0, __contentScope.bn)(t2, e)) && (a += 180), i === `submit` && (a += 90), __contentScope.un.test(r2) && (a += 90), __contentScope.dn.test(r2) && (a += 60), __contentScope.fn.test(r2) && (a -= 200), __contentScope.ln.test(r2) && (a -= 120), t2.hasAttribute(`aria-expanded`) && (a -= 100), {
          element: t2,
          score: a,
          fallback: t2 !== n && !(0, __contentScope.bn)(t2, e)
        };
      }).sort((e2, t2) => t2.score - e2.score)[0];
      return r && r.score >= 80 ? { element: r.element, fallback: r.fallback } : null;
    }
    async function tr(e, t, n) {
      let r = Date.now() + n;
      for (; Date.now() < r; ) {
        let n2 = (0, __contentScope.er)(e, t);
        if (n2) return n2;
        await (0, __contentScope.w)(200);
      }
      return null;
    }
    function nr() {
      return (0, __contentScope.D)(__contentScope.$t) || typeof __contentScope.zp === `function` && (0, __contentScope.zp)() ? `二次验证验证码` : null;
    }
    function rr(e) {
      try {
        let t = new URL(e.loginUrl), n = new URL(location.href), r = (e2) => e2.replace(/\/+$/, ``) || `/`;
        if (n.origin !== t.origin) return false;
        let i = `${n.pathname}${n.hash}`;
        if (__contentScope.en.test(i)) return false;
        if (r(n.pathname) !== r(t.pathname)) return true;
        let a = r(t.hash.replace(/^#/, ``)), o = r(n.hash.replace(/^#/, ``));
        return a !== `/` && o !== `/` && o !== a;
      } catch {
        return false;
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
        if (!selector) return false;
        const control = (0, __contentScope.D)(selector);
        return !!control && (0, __contentScope.O)(control);
      }, authenticationRoute = /(?:^|\/)(?:login|sign-?in|auth|oauth|callback)(?:\/|$)/i.test(
        `${location.pathname}${location.hash.replace(/^#/, `/`)}`
      ), profileEditorContext = /(?:^|\/)(?:profile|personal|settings|account(?:-settings)?|security-password)(?:\/|$)/i.test(
        location.pathname
      ), siteEvidence = readSiteLoginEvidence(
        site,
        document,
        location,
        (node) => (0, __contentScope.O)(node)
      ), logoutControl = (0, __contentScope.hasVisibleLogoutControl)(site, siteEvidence), authenticationFormHeading = [
        ...document.querySelectorAll?.(`form, [role="dialog"]`) ?? []
      ].some((region) => {
        if (!(0, __contentScope.O)(region)) return false;
        const heading = region.querySelector?.(`h1, h2, h3, [role="heading"]`), title = [region.getAttribute?.(`aria-label`), heading?.innerText ?? heading?.textContent].filter(Boolean).join(` `);
        return /登录|登入|sign\s*in|log\s*in/i.test(title) && !/修改|重置|change|reset|update/i.test(title);
      }), loginForm = (0, __contentScope.On)(site) && (!profileEditorContext || authenticationRoute || authenticationFormHeading), providerEntry = [
        ...document.querySelectorAll(
          `button, a[href], [role="button"], input[type="button"], input[type="submit"]`
        )
      ].some(
        (control) => !control.closest?.(`footer, [role="contentinfo"]`) && !!(0, __contentScope.describeLoginControl)(control)
      ), loginLink = (0, __contentScope.Nn)(), loginButton = (0, __contentScope.In)(), loginEntry = providerEntry || !!loginButton && !loginButton.closest?.(`footer, [role="contentinfo"]`) || !!loginLink && !loginLink.closest?.(`footer, [role="contentinfo"]`), secondFactor = (0, __contentScope.nr)(), challenge = typeof __contentScope.Nu === `function` ? (0, __contentScope.Nu)(false) : null, completionRequired = [
        ...document.querySelectorAll?.(`form, [role="dialog"], main`) ?? []
      ].some((region) => {
        if (!(0, __contentScope.O)(region)) return false;
        const heading = region.querySelector?.(`h1, h2, h3, [role="heading"]`), title = heading?.innerText ?? heading?.textContent ?? ``;
        return /^(?:完成(?:注册|资料|账号设置)|补充(?:资料|信息)|绑定(?:邮箱|手机)|注册|创建(?:新)?账号|complete\s+(?:your\s+)?(?:profile|account|registration)|finish\s+(?:registration|setup)|create\s+(?:an?\s+)?account|sign\s*up)/i.test(
          title.trim()
        ) && [...region.querySelectorAll?.(`input, select, textarea`) ?? []].some(
          (input) => !input.disabled && !input.readOnly && input.type !== `hidden` && (0, __contentScope.O)(input)
        );
      }), failureNodes = document.querySelectorAll?.(
        `[role="alert"], [aria-live="assertive"], .error-message, .semi-toast-content, .semi-notification-content, .ant-message-notice-content, .ant-notification-notice-message`
      ), authenticationContext = loginForm || authenticationRoute || loginEntry && !logoutControl && !siteEvidence.accountShellVisible, loginError = [
        (0, __contentScope.Un)(),
        ...[...failureNodes ?? []].filter((node) => (0, __contentScope.O)(node)).map((node) => node.innerText || node.textContent || ``)
      ].filter(Boolean).map((text) => text.replace(/\s+/g, ` `).trim()).find((text) => {
        if (/登录(?:状态|会话)?.{0,16}(?:已失效|已过期|过期)|(?:当前|登录)?会话.{0,16}(?:过期|失效)|请重新登录|\b(?:your\s+)?(?:login\s+)?session\s+(?:has\s+)?expired\b|(?:log|sign)\s*in\s+again/i.test(
          text
        ))
          return true;
        if (profileEditorContext && !authenticationContext && /密码|password|绑定|解绑|\bbind\b|\bunlink\b|\bconnect\b/i.test(text))
          return false;
        if (authenticationContext) return __contentScope.Hn.test(text);
        if (/签到|打卡|抽奖|余额|额度|领取|兑换|check[\s-]?in|daily\s+(?:bonus|reward)|balance|quota|points|credits|claim/i.test(
          text
        ))
          return false;
        return /(?:用户名|账号|邮箱|密码|凭据).{0,16}(?:错误|不正确|无效|不存在|锁定)|(?:invalid|incorrect|wrong|bad).{0,16}(?:password|credentials?)|(?:password|credentials?).{0,16}(?:invalid|incorrect|wrong)|(?:登录|authentication|authorization|oauth).{0,24}(?:失败|拒绝|failed|denied|rejected)/i.test(
          text
        );
      })?.slice(0, 160);
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
        checkinControl: site.checkin?.method === `button` && (visible(site.checkin.buttonSelector) || visible(site.checkin.alreadySelector))
      };
    }
    async function readLoginState(site, options = {}) {
      const resolver = new LoginStateResolver({
        readPage: (selected) => (0, __contentScope.readLoginSnapshot)(selected),
        readIdentity: (selected, readOptions) => (0, __contentScope.qi)(selected, void 0, readOptions),
        sleep: (ms) => (0, __contentScope.w)(ms)
      });
      return resolver.wait(withSiteIdentityRecipe(site), options);
    }
    async function U(e, t, n) {
      await (0, __contentScope.Qt)(e, t, n);
    }
    async function lr(e) {
      let t = document.body?.innerText ?? ``;
      if (!__contentScope.sr.test(t)) return false;
      for (let t2 of document.querySelectorAll(`button, [role="button"]`)) {
        if (!(0, __contentScope.O)(t2)) continue;
        let n = (t2.innerText || t2.textContent || ``).trim(), r = n.replace(/\s+/g, ``).toLowerCase();
        if (r && !__contentScope.cr.test(r) && __contentScope.or.some((e2) => r.includes(e2.replace(/\s+/g, ``).toLowerCase()))) {
          try {
            await (0, __contentScope.M)(t2);
          } catch {
            (0, __contentScope.Me)(t2);
          }
          return e.push(`已点击「${n.slice(0, 20)}」同意必需条款以解锁登录`), await (0, __contentScope.w)(800), true;
        }
      }
      return false;
    }
    async function ur(e, t = document, n = {}) {
      if (__contentScope.sr.test(document.body?.innerText ?? ``) && [...document.querySelectorAll(`button, [role="button"]`)].some((e2) => {
        if (!(0, __contentScope.O)(e2)) return false;
        let t2 = (e2.innerText || e2.textContent || ``).trim().replace(/\s+/g, ``).toLowerCase();
        return !!t2 && !__contentScope.cr.test(t2) && __contentScope.or.some((e3) => t2.includes(e3.replace(/\s+/g, ``).toLowerCase()));
      })) {
        let e2 = n.beforeAuxiliaryClick ?? n.beforeClick;
        if (e2 && !await e2()) throw Error(`处理登录协议前的人机验证未完成，已停止页面操作`);
      }
      let r = await (0, __contentScope.lr)(e);
      if ((0, __contentScope.Qn)(t) || t !== document && (0, __contentScope.Qn)(document)) {
        let e2 = n.beforeAuxiliaryClick ?? n.beforeClick;
        if (e2 && !await e2()) throw Error(`勾选登录协议前的人机验证未完成，已停止页面操作`);
      }
      let i = await (0, __contentScope.$n)(t, e) || t !== document && await (0, __contentScope.$n)(document, e);
      return i && await (0, __contentScope.w)(200), r || i;
    }
    async function dr(e, t, n, r = `账密表单入口`) {
      let i = await (0, __contentScope.B)(e, t, n, r);
      if (i) n.push(`${r}仍被 ${(0, __contentScope.N)(i)} 遮挡，改用 DOM 点击`);
      else
        try {
          await (0, __contentScope.M)(e);
          return;
        } catch (e2) {
          n.push(`可信点击${r}失败（${e2 instanceof Error ? e2.message : String(e2)}），改用 DOM 点击`);
        }
      (0, __contentScope.Me)(e);
    }
    function fr(e) {
      let t = (e.preLoginClickSelectors ?? []).map((e2) => e2.trim()).filter(Boolean), n = e.preLoginClickSelector?.trim();
      return n && t.at(-1) !== n && t.push(n), t;
    }
    async function pr(e, t, n = {}) {
      if (await (0, __contentScope.ur)(t, document, n), (0, __contentScope.Dn)(e)) {
        t.push(`账密表单已可见，无需前置点击`);
        return;
      }
      let r = (0, __contentScope.fr)(e);
      for (let [i2, a2] of r.entries()) {
        let o2 = await (0, __contentScope.k)(a2, 6e3);
        if (o2) {
          if (await (0, __contentScope.tn)(n, `展开账密表单`), o2 = await (0, __contentScope.k)(a2, 6e3), !o2)
            throw Error(`完成人机验证后账密表单入口已不存在`);
          if (await (0, __contentScope.dr)(o2, e, t), t.push(`已点击「${o2.textContent?.trim().slice(0, 20)}」展开账密表单`), i2 === r.length - 1 ? await (0, __contentScope.jn)(e, 5e3) : (0, __contentScope.Dn)(e))
            return;
        } else t.push(`未找到前置按钮(${a2})，继续查找登录页入口`);
      }
      let i = (0, __contentScope.In)();
      if (i &&= (await (0, __contentScope.tn)(n, `展开账密表单`), (0, __contentScope.In)()), i) {
        let n2 = (i.innerText || i.textContent || ``).trim().slice(0, 20);
        if (await (0, __contentScope.dr)(i, e, t), t.push(`已点击「${n2}」展开账密表单`), await (0, __contentScope.jn)(e, 5e3))
          return;
      }
      let a = (0, __contentScope.Nn)();
      if (!a) return;
      if (await (0, __contentScope.tn)(n, `进入登录页`), a = (0, __contentScope.Nn)(), !a)
        throw Error(`完成人机验证后登录页入口已不存在`);
      let o = new URL(a.href, location.href);
      t.push(`当前页没有账密表单，已进入登录页: ${o.pathname}`);
      let s = await (0, __contentScope.B)(a, e, t, `登录页入口`);
      if (s) throw Error(`登录页入口被${(0, __contentScope.N)(s)}遮挡，可能有未关闭的公告弹窗`);
      if (a = (0, __contentScope.Nn)(), !a) throw Error(`关闭遮挡后登录页入口已不存在`);
      await (0, __contentScope.M)(a, { mayNavigate: true }), await (0, __contentScope.jn)(e, 5e3);
    }
    async function mr(e, t, n, r = {}) {
      await (0, __contentScope.ur)(t, document, r);
      let selected = e.loginEntry?.method === n ? e.loginEntry : null, i = selected ? `` : e.oauthButtonSelector?.trim(), a = () => selected ? (0, __contentScope.findSelectedLoginControl)(selected, n) : i ? (0, __contentScope.D)(i) : (0, __contentScope.Kn)(n), o = a();
      if (o && (0, __contentScope.O)(o)) {
        t.push(`第三方登录入口已可见，无需展开账密表单`);
        return;
      }
      let s = (0, __contentScope.fr)(e);
      for (let n2 of i ? s : []) {
        let i2 = await (0, __contentScope.k)(n2, 6e3);
        if (i2 && (0, __contentScope.O)(i2)) {
          if (await (0, __contentScope.tn)(r, `展开第三方登录入口`), i2 = await (0, __contentScope.k)(n2, 6e3), !i2)
            throw Error(`完成人机验证后第三方登录入口已不存在`);
          let o2 = (i2.innerText || i2.textContent || ``).replace(/\s+/g, ` `).trim().slice(0, 20);
          await (0, __contentScope.dr)(i2, e, t, `第三方登录入口`), t.push(`已点击「${o2}」展开第三方登录入口`);
          let s2 = a();
          if (s2 && (0, __contentScope.O)(s2)) return;
          t.push(`点击第三方登录入口后 OAuth 按钮仍未出现，继续查找登录页入口`);
        }
      }
      let c = (0, __contentScope.Nn)();
      if (!c) return;
      if (await (0, __contentScope.tn)(r, `进入第三方登录页`), c = (0, __contentScope.Nn)(), !c)
        throw Error(`完成人机验证后第三方登录页入口已不存在`);
      let l = new URL(c.href, location.href);
      t.push(`当前页没有第三方登录入口，已进入登录页: ${l.pathname}`);
      let u = await (0, __contentScope.B)(c, e, t, `第三方登录页入口`);
      if (u) throw Error(`第三方登录页入口被${(0, __contentScope.N)(u)}遮挡，可能有未关闭的公告弹窗`);
      if (c = (0, __contentScope.Nn)(), !c) throw Error(`关闭遮挡后第三方登录页入口已不存在`);
      await (0, __contentScope.M)(c, { mayNavigate: true });
    }
    async function hr(e, t, n, r, i, a) {
      let o = Date.now() + 1e4, s = null, c = null;
      for (; Date.now() < o && (s = (0, __contentScope.V)(e.selectors.password, document), !(s || (c = (0, __contentScope.Tn)(e.selectors.username, document), c))); )
        await (0, __contentScope.w)(200);
      if (s = (0, __contentScope.V)(e.selectors.password, document), c = s ? (0, __contentScope.Tn)(e.selectors.username, s.element.form ?? document, s.element) : (0, __contentScope.Tn)(e.selectors.username, document), s) {
        if (s.element.form, c) {
          if (c.fallback && r.push(`已通过页面语义识别用户名输入框: ${(0, __contentScope.Mn)(c)}`), (0, __contentScope.A)(c.element, t), r.push(`已填写用户名`), await (0, __contentScope.w)(120), s = (0, __contentScope.V)(e.selectors.password, document), !s)
            return r.push(`填写用户名后密码输入框已不存在`), false;
        } else r.push(`当前是密码步骤，页面未要求再次填写用户名`);
        return s.fallback && r.push(`已通过页面语义识别密码输入框: ${(0, __contentScope.Mn)(s)}`), (0, __contentScope.A)(s.element, n), r.push(`已填写密码`), true;
      }
      if (!c) return r.push(`页面能力扫描未找到可用的用户名或密码输入框`), false;
      if (c.fallback && r.push(`已通过页面语义识别用户名输入框: ${(0, __contentScope.Mn)(c)}`), (0, __contentScope.A)(c.element, t), r.push(`已填写用户名，等待页面显示密码步骤`), await (0, __contentScope.w)(250), s = (0, __contentScope.V)(e.selectors.password, document), !s) {
        let t2 = c.element.form ?? document, n2 = await (0, __contentScope.tr)(e.selectors.submit, t2, 5e3);
        if (!n2) return r.push(`用户名步骤后未找到语义明确的「继续/下一步」控件`), false;
        if (await (0, __contentScope.ur)(r, t2, { beforeClick: a ?? i }), await i?.() === false)
          return r.push(`用户名步骤前的安全验证未完成`), false;
        let o2 = (0, __contentScope.Tn)(e.selectors.username, document)?.element.form ?? document, l = await (0, __contentScope.tr)(e.selectors.submit, o2, 5e3);
        if (!l) return r.push(`安全验证完成后用户名步骤的继续按钮已不存在`), false;
        n2 = l;
        let u = Date.now() + 3e3;
        for (; (0, __contentScope.H)(n2.element) && Date.now() < u; )
          await (0, __contentScope.w)(150), n2 = (0, __contentScope.er)(e.selectors.submit, o2) ?? n2;
        if ((0, __contentScope.H)(n2.element))
          return r.push(`用户名步骤的继续按钮仍处于禁用状态`), false;
        let d = await (0, __contentScope.B)(n2.element, e, r, `用户名步骤控件`);
        if (d) return r.push(`用户名步骤控件被${(0, __contentScope.N)(d)}遮挡，已停止继续操作`), false;
        let f2 = (0, __contentScope.Tn)(e.selectors.username, document), p = (0, __contentScope.er)(e.selectors.submit, f2?.element.form ?? document);
        if (!p || (0, __contentScope.H)(p.element))
          return r.push(`关闭遮挡后用户名步骤的继续按钮已不存在或不可用`), false;
        n2 = p, r.push(`已识别并点击用户名步骤控件: ${(0, __contentScope.Bn)(n2.element).slice(0, 30)}`), await (0, __contentScope.M)(n2.element, { mayNavigate: true }), s = await (0, __contentScope.En)(e.selectors.password, 8e3);
      }
      return s ? (s = (0, __contentScope.V)(e.selectors.password, document), s ? (s.fallback && r.push(`已通过页面语义识别密码输入框: ${(0, __contentScope.Mn)(s)}`), (0, __contentScope.A)(s.element, n), r.push(`已填写密码`), true) : (r.push(`密码输入框已不存在`), false)) : (r.push(`完成用户名步骤后仍未出现可识别的密码输入框`), false);
    }
    async function gr(e, t, n = {}) {
      await (0, __contentScope.w)(200);
      let r = (0, __contentScope.V)(e.selectors.password, document), i = r?.element.form ?? document, a = await (0, __contentScope.tr)(e.selectors.submit, i, 5e3);
      if (a) {
        if (await (0, __contentScope.ur)(t, i, n), n.beforeClick && !await n.beforeClick())
          return t.push(`登录提交前的安全验证未完成，已停止点击`), false;
        if (r = (0, __contentScope.V)(e.selectors.password, document), i = r?.element.form ?? document, a = await (0, __contentScope.tr)(e.selectors.submit, i, 5e3), !a)
          return t.push(`安全验证完成后找不到登录按钮`), false;
        let o = a.element, s = Date.now() + 3e3;
        for (; (0, __contentScope.H)(o) && Date.now() < s; )
          await (0, __contentScope.w)(150), a = (0, __contentScope.er)(e.selectors.submit, i) ?? a, o = a.element;
        if ((0, __contentScope.H)(o))
          return t.push(`登录按钮仍处于禁用状态，页面可能还有未满足的校验项`), false;
        let c = await (0, __contentScope.B)(a.element, e, t, `登录按钮`);
        if (c) return t.push(`登录按钮被${(0, __contentScope.N)(c)}遮挡，停止本次提交`), false;
        if (r = (0, __contentScope.V)(e.selectors.password, document), i = r?.element.form ?? document, a = await (0, __contentScope.tr)(e.selectors.submit, i, 1500), !a)
          return t.push(`关闭遮挡后找不到登录按钮`), false;
        if (o = a.element, (0, __contentScope.H)(o))
          return t.push(`关闭遮挡后登录按钮变为禁用状态，未执行提交`), false;
        let l = await (0, __contentScope.B)(a.element, e, t, `登录按钮`);
        if (l) return t.push(`登录按钮被${(0, __contentScope.N)(l)}遮挡，停止本次提交`), false;
        if (r = (0, __contentScope.V)(e.selectors.password, document), i = r?.element.form ?? document, a = await (0, __contentScope.tr)(e.selectors.submit, i, 1500), !a)
          return t.push(`最终点击前找不到登录按钮`), false;
        if (o = a.element, (0, __contentScope.H)(o))
          return t.push(`最终点击前登录按钮变为禁用状态，未执行提交`), false;
        a.fallback && t.push(`配置的登录按钮选择器未命中，已通过表单语义识别`), t.push(`已点击登录按钮`), await n.beforeNavigate?.();
        let u = await (0, __contentScope.M)(a.element, { mayNavigate: true });
        if (t.push(
          u === `trusted` ? `登录按钮已收到浏览器可信点击` : `登录按钮已通过 DOM 点击（未使用浏览器可信指针）`
        ), n.afterClick && !await n.afterClick())
          return t.push(`登录提交后的安全验证未完成`), false;
        await (0, __contentScope.w)(450);
        let d = (0, __contentScope.Vn)();
        return d && t.push(`登录页面反馈：${d}`), t.push((0, __contentScope.Wn)() ? `页面已发起登录接口请求` : `页面未发起登录接口请求`), true;
      }
      if (r) {
        if (await (0, __contentScope.ur)(t, r.element.form ?? document, n), n.beforeClick && !await n.beforeClick())
          return t.push(`回车提交前的安全验证未完成，已停止提交`), false;
        if (r = (0, __contentScope.V)(e.selectors.password, document), !r)
          return t.push(`安全验证完成后密码输入框已不存在，未执行回车提交`), false;
        let i2 = await (0, __contentScope.B)(r.element, e, t, `密码输入框`);
        return i2 ? (t.push(`密码输入框被${(0, __contentScope.N)(i2)}遮挡，未执行回车提交`), false) : (t.push(`未找到登录按钮，已在密码框回车提交`), await n.beforeNavigate?.(), (0, __contentScope.Je)(r.element), n.afterClick && !await n.afterClick() ? (t.push(`回车提交后的安全验证未完成`), false) : true);
      }
      return t.push(`找不到登录按钮: ${e.selectors.submit}`), false;
    }
    async function _r(e, t, n = {}) {
      if (await (0, __contentScope.w)(900), (0, __contentScope.Wn)())
        return t.push(`滑块通过后已观察到登录请求，无需再次点击登录按钮`), `not-needed`;
      let r = (0, __contentScope.Un)();
      if (r) return t.push(`登录页面已明确返回失败，不重复提交：${r}`), `blocked`;
      let i = (0, __contentScope.V)(e.selectors.password, document);
      if (!i) return t.push(`滑块通过后账密表单已离开，无需再次点击登录按钮`), `not-needed`;
      if (!i.element.value)
        return t.push(`滑块通过后密码输入框已被页面清空，已停止重复提交`), `blocked`;
      let a = i.element.form ?? document, o = await (0, __contentScope.tr)(e.selectors.submit, a, 2e3);
      if (!o) return t.push(`滑块通过后登录按钮已不存在，无需再次点击`), `not-needed`;
      let s = Date.now() + 2e3;
      for (; (0, __contentScope.H)(o.element) && Date.now() < s; ) {
        if (await (0, __contentScope.w)(150), i = (0, __contentScope.V)(e.selectors.password, document), !i)
          return `not-needed`;
        a = i.element.form ?? document, o = (0, __contentScope.er)(e.selectors.submit, a) ?? o;
      }
      if ((0, __contentScope.H)(o.element))
        return t.push(`滑块通过后登录按钮仍未恢复可用，未执行重复点击`), `blocked`;
      if ((0, __contentScope.Wn)())
        return t.push(`重新定位登录按钮期间页面已发起登录请求，无需再次点击`), `not-needed`;
      let c = (0, __contentScope.Un)();
      if (c) return t.push(`重新点击前页面已明确返回登录失败：${c}`), `blocked`;
      if (i = (0, __contentScope.V)(e.selectors.password, document), !i?.element.value)
        return i ? `blocked` : `not-needed`;
      if (a = i.element.form ?? document, o = (0, __contentScope.er)(e.selectors.submit, a), !o || (0, __contentScope.H)(o.element))
        return `blocked`;
      let l = await (0, __contentScope.B)(o.element, e, t, `滑块通过后的登录按钮`);
      if (l)
        return t.push(`滑块通过后的登录按钮被${(0, __contentScope.N)(l)}遮挡，未重复提交`), `blocked`;
      if (i = (0, __contentScope.V)(e.selectors.password, document), !i?.element.value)
        return i ? `blocked` : `not-needed`;
      if (a = i.element.form ?? document, o = (0, __contentScope.er)(e.selectors.submit, a), !o || (0, __contentScope.H)(o.element))
        return `blocked`;
      let u = await (0, __contentScope.B)(o.element, e, t, `滑块通过后的登录按钮`);
      if (u)
        return t.push(`滑块通过后的登录按钮被${(0, __contentScope.N)(u)}遮挡，未重复提交`), `blocked`;
      if (i = (0, __contentScope.V)(e.selectors.password, document), !i?.element.value)
        return i ? `blocked` : `not-needed`;
      if (a = i.element.form ?? document, o = (0, __contentScope.er)(e.selectors.submit, a), !o || (0, __contentScope.H)(o.element))
        return `blocked`;
      t.push(`滑块已确认通过但登录表单仍在，重新点击登录按钮（仅一次）`), await n.beforeNavigate?.();
      let d = await (0, __contentScope.M)(o.element, { mayNavigate: true });
      if (t.push(
        d === `trusted` ? `滑块通过后的登录按钮已收到浏览器可信点击` : `滑块通过后的登录按钮已通过 DOM 点击（未使用浏览器可信指针）`
      ), n.afterClick && !await n.afterClick())
        return t.push(`重新提交登录后的安全验证未完成`), `blocked`;
      await (0, __contentScope.w)(450);
      let f2 = (0, __contentScope.Vn)();
      return f2 && t.push(`重新提交后的登录页面反馈：${f2}`), t.push(
        (0, __contentScope.Wn)() ? `重新提交后页面已发起登录接口请求` : `重新提交后暂未观察到登录接口请求，继续核对登录结果`
      ), `submitted`;
    }
    async function vr(e, t, n = {}, r = `oauth`) {
      await (0, __contentScope.U)(e, t), await (0, __contentScope.ur)(t, document, n);
      let i = await (0, __contentScope.qn)(e, 12e3, r);
      if (!i)
        return t.push(
          e.loginEntry?.method === r ? `当前页面未找到账号选定的「${e.loginEntry.label}」登录入口，请手动更新本站登录方式` : e.oauthButtonSelector?.trim() ? `找不到${r === `passkey` ? ` Passkey` : r === `github` ? ` GitHub` : ` OAuth`} 按钮: ${e.oauthButtonSelector}` : `未能自动识别${r === `passkey` ? ` Passkey` : r === `github` ? ` GitHub OAuth` : ` OAuth`} 登录按钮，请填写按钮选择器`
        ), false;
      if (n.beforeClick && !await n.beforeClick())
        return t.push(
          `${r === `passkey` ? `Passkey` : r === `github` ? `GitHub` : `OAuth`} 点击前的安全验证未完成`
        ), false;
      if (i = await (0, __contentScope.qn)(e, 12e3, r), !i)
        return t.push(`安全验证完成后第三方登录按钮已不存在`), false;
      if ((0, __contentScope.H)(i.element))
        return t.push(
          `${r === `passkey` ? `Passkey` : r === `github` ? `GitHub` : `OAuth`} 登录按钮仍处于禁用状态，页面还有未满足的登录条件`
        ), false;
      let a = await (0, __contentScope.B)(i.element, e, t, `第三方登录按钮`);
      if (a) return t.push(`第三方登录按钮被${(0, __contentScope.N)(a)}遮挡，已停止点击`), false;
      if (i = await (0, __contentScope.qn)(e, 2e3, r), !i)
        return t.push(`关闭遮挡后第三方登录按钮已不存在`), false;
      if ((0, __contentScope.H)(i.element))
        return t.push(
          `${r === `passkey` ? `Passkey` : r === `github` ? `GitHub` : `OAuth`} 登录按钮在关闭遮挡后变为禁用状态`
        ), false;
      let o = i.element, s = (0, __contentScope.Bn)(o).slice(0, 30);
      return t.push(
        i.selected ? `已按账号选择点击「${e.loginEntry.label}」登录入口: ${s}` : i.automatic ? `已自动识别并点击 OAuth 按钮: ${s}` : `已点击 OAuth 按钮: ${s}`
      ), await n.beforeNavigate?.(), await (0, __contentScope.M)(o, { mayNavigate: true }), n.afterClick && !await n.afterClick() ? (t.push(
        `${r === `passkey` ? `Passkey` : r === `github` ? `GitHub` : `OAuth`} 点击后的安全验证未完成`
      ), false) : true;
    }
    async function yr(e, t, n = 1e4) {
      let r = location.href, i = Date.now() + n;
      for (; Date.now() < i; ) {
        if (location.href !== r)
          return t.push(`已离开登录页，等待授权流程返回本站(${location.pathname})`), true;
        if ((0, __contentScope.ar)(e)) return false;
        const page = (0, __contentScope.readLoginSnapshot)(e);
        if (page.sameOrigin && !page.loginForm && !page.loginEntry && !page.secondFactor && !page.challenge) {
          await (0, __contentScope.readLoginState)(e, {
            timeoutMs: Math.min(3e3, Math.max(1, i - Date.now())),
            diagnostics: t
          });
          if (location.href !== r)
            return t.push(`已离开登录页，等待授权流程返回本站(${location.pathname})`), true;
          return false;
        }
        await (0, __contentScope.w)(250);
      }
      return false;
    }
    async function br(e, t, n = 6e3, options = {}) {
      const state = await (0, __contentScope.readLoginState)(e, {
        timeoutMs: n,
        stopOnLoginForm: true,
        diagnostics: t,
        ...options
      });
      options.onResult?.(state);
      t.push(loginStateLog(state));
      if (state.status === `authenticated`) return t.push(`命中登录成功证据，已处于登录状态`), true;
      if (state.reason === `login_form_visible`) t.push(`发现登录表单，需要重新登录`);
      else if (state.reason === `second_factor_pending`) t.push(`发现二次验证输入框，需要登录`);
      return false;
    }
    async function xr(e, t, options = {}) {
      const state = await (0, __contentScope.readLoginState)(e, {
        timeoutMs: 8e3,
        diagnostics: t,
        ...options
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
      if (t > __contentScope.Cr) return { text: (0, __contentScope.Tr)(), exhausted: true };
      let n = new Set((e ?? []).map((e2) => e2.trim())), r = ``;
      for (let e2 = 0; e2 < __contentScope.wr; e2 += 1)
        if (r = (0, __contentScope.Tr)(), !n.has(r)) return { text: r, exhausted: false };
      return { text: r || (0, __contentScope.Tr)(), exhausted: true };
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
      return e.protocol === `https:` || e.protocol === `http:` && t;
    }
    function W(e, t) {
      if (!t) return true;
      let n = (0, __contentScope.Dr)(e);
      if (!n) return false;
      try {
        return new URL(t, e.loginUrl).origin === n;
      } catch {
        return false;
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
      if (!t) return false;
      let n = (0, __contentScope.Dr)(e);
      if (!n) return false;
      let r, i;
      try {
        r = new URL(t), i = new URL(n).hostname.toLowerCase();
      } catch {
        return false;
      }
      if (r.protocol !== `https:`) return false;
      let a = r.hostname.toLowerCase();
      return a.includes(`.`) ? a === i || a.endsWith(`.${i}`) || i.endsWith(`.${a}`) : false;
    }
    function Pr(e) {
      if (!e) return false;
      try {
        let t = new URL(e);
        return t.protocol === `https:` && t.hostname === `github.com` && t.pathname === `/login`;
      } catch {
        return false;
      }
    }
    function Fr(e) {
      if (!e) return false;
      try {
        let t = new URL(e);
        return t.protocol === `https:` && t.hostname === `github.com` && t.pathname === `/logout`;
      } catch {
        return false;
      }
    }
    function Ir(e) {
      if (!e) return false;
      try {
        let t = new URL(e);
        return t.protocol === `https:` && t.hostname === `github.com` && (t.pathname === `/login` || t.pathname === `/`);
      } catch {
        return false;
      }
    }
    function Lr(e) {
      if (!e) return false;
      try {
        let t = new URL(e);
        return t.protocol === `https:` && t.hostname === `github.com` && t.pathname.startsWith(`/login/oauth/authorize`);
      } catch {
        return false;
      }
    }
    function Rr(e) {
      if (!e) return false;
      try {
        let t = new URL(e);
        return t.protocol !== `https:` || t.hostname !== `github.com` ? false : t.pathname === `/login` || t.pathname === `/logout` || t.pathname.startsWith(`/login/`) || t.pathname.startsWith(`/sessions/`) || t.pathname.startsWith(`/account_verifications/`);
      } catch {
        return false;
      }
    }
    function Vr(e) {
      if (e == null || e === ``) return {};
      let t = String(e), n = {};
      for (let e2 of __contentScope.Br) n[e2] = t;
      return n;
    }
    function Ur({ quotaPerUnit: e, family: t }) {
      return e && e > 0 ? e : t === `new-api` ? __contentScope.Hr : 1;
    }
    function Wr(e, t) {
      return e / (0, __contentScope.Ur)(t);
    }
    function Gr(e) {
      return e.toFixed(2).replace(/\.00$/, ``).replace(/(\.\d)0$/, `$1`);
    }
    function Kr(e, t, n = `$`) {
      return n === `积分` ? `积分 ${(0, __contentScope.Gr)(e)}` : `${n}${(0, __contentScope.Wr)(e, t).toFixed(4)}`;
    }
    function qr(e, t, n = `$`) {
      return n === `积分` ? `${(0, __contentScope.Gr)(e)} 积分` : (0, __contentScope.Kr)(e, t, n);
    }
    function Xr(e) {
      return typeof e == `string` && Object.values(__contentScope.s).includes(e);
    }
    function Zr(e) {
      return e === __contentScope.o.SUB2API ? __contentScope.s.SUB2API : e === __contentScope.o.VO_API_V2 ? __contentScope.s.VO_API_V2 : e && __contentScope.Yr.has(e) ? __contentScope.s.NEW_API : __contentScope.s.UNSUPPORTED;
    }
    function Qr(e) {
      let t = e?.trim();
      if (t) return t.startsWith(`/`) ? t : `/${t}`;
    }
    function $r(e) {
      let t = e.adapter, n = (0, __contentScope.Xr)(t?.family) ? t.family : (0, __contentScope.Zr)(t?.siteType), r = t && Object.prototype.hasOwnProperty.call(t, `checkinPath`) ? (0, __contentScope.Qr)(t?.checkinPath) : __contentScope.Jr[n].checkinPath, i = (t?.checkin?.pathPatterns ?? []).map((e2) => (0, __contentScope.Qr)(e2.replace(/\*$/, ``))).filter((e2) => !!e2), a = (t?.checkin?.titleWords ?? []).map((e2) => e2.trim()).filter(Boolean);
      return {
        family: n,
        ...t?.siteType ? { siteType: t.siteType } : {},
        ...r ? { checkinPath: r } : {},
        checkinPathPatterns: i,
        checkinTitleWords: a
      };
    }
    function ei(e) {
      return (0, __contentScope.$r)(e).checkinPath;
    }
    function ti(e, t, n = ``) {
      let r = (0, __contentScope.$r)(e), i = [...r.checkinPath ? [r.checkinPath] : [], ...r.checkinPathPatterns];
      for (let e2 of i) {
        let n2 = (0, __contentScope.Qr)(t)?.replace(/\/+$/, ``) || `/`, r2 = e2.replace(/\/+$/, ``) || `/`;
        if (n2 === r2 || n2.startsWith(`${r2}/`)) return true;
      }
      let a = r.checkinTitleWords.length ? r.checkinTitleWords : [`每日签到`, `daily check-in`], o = n.toLocaleLowerCase();
      return a.some((e2) => o.includes(e2.toLocaleLowerCase()));
    }
    function si(e) {
      let t = e.authBootstrap, n = t?.endpoint?.trim();
      if (!t || !n) return null;
      let r;
      try {
        r = new URL(n, e.loginUrl).href;
      } catch {
        return null;
      }
      return (0, __contentScope.W)(e, r) ? {
        url: r,
        method: `POST`,
        ...t.tokenPath?.length ? { tokenPath: t.tokenPath } : {},
        header: t.header?.trim() || `Authorization`,
        prefix: t.prefix ?? `Bearer `
      } : null;
    }
    function li(e, t) {
      let n = t?.length ? [t] : __contentScope.ci;
      for (let t2 of n) {
        let n2 = e;
        for (let e2 of t2) {
          if (typeof n2 != `object` || !n2) {
            n2 = void 0;
            break;
          }
          n2 = n2[e2];
        }
        if (typeof n2 == `string` && n2.trim().length > 20) return n2.trim();
      }
      return null;
    }
    async function ui(e, t) {
      let n = (0, __contentScope.si)(e);
      if (!n) return {};
      let r = `${e.id}|${n.url}`, i = __contentScope.ai.get(r);
      if (i) {
        let e2 = Object.keys(i.headers).length ? __contentScope.ni : __contentScope.ri;
        if (Date.now() - i.at < e2) return { ...i.headers };
      }
      let a = __contentScope.oi.get(r);
      if (a) return a;
      let o = (0, __contentScope.fi)(n, t).then((e2) => (__contentScope.ai.set(r, { headers: e2, at: Date.now() }), e2)).finally(() => {
        __contentScope.oi.delete(r);
      });
      return __contentScope.oi.set(r, o), o;
    }
    function di() {
      __contentScope.ai.clear(), __contentScope.oi.clear(), __contentScope.identityProbeHints.clear();
    }
    async function fi(e, t) {
      let n = new AbortController(), r = setTimeout(() => n.abort(), __contentScope.ii), i = (e2) => (t?.push(`令牌引导未取到令牌（${e2}），接口按原有凭据继续读`), {});
      try {
        let t2 = await fetch(e.url, {
          method: e.method,
          credentials: `include`,
          headers: { Accept: `application/json` },
          redirect: `error`,
          signal: n.signal
        });
        if (!t2.ok) return i(`HTTP ${t2.status}`);
        if (!(t2.headers.get(`content-type`)?.toLowerCase() ?? ``).includes(`json`))
          return i(`响应不是 JSON`);
        let r2 = (0, __contentScope.li)(await t2.json().catch(() => null), e.tokenPath);
        return r2 ? { [e.header]: `${e.prefix}${r2}` } : i(`响应里没有可用的 access_token`);
      } catch (e2) {
        return i(e2 instanceof Error && e2.name === `AbortError` ? `请求超时` : `请求失败`);
      } finally {
        clearTimeout(r);
      }
    }
    function G(e) {
      throw Error(`CBOR 解码失败: ${e}`);
    }
    function gi(e) {
      let t = e & 32768 ? -1 : 1, n = e >> 10 & 31, r = e & 1023;
      return n === 0 ? t * r * 2 ** -24 : n === 31 ? r ? NaN : t * (1 / 0) : t * (1 + r / 1024) * 2 ** (n - 15);
    }
    function _i(e, t) {
      e instanceof Uint8Array || (0, __contentScope.G)(`输入必须是 Uint8Array`), e.byteLength === 0 && (0, __contentScope.G)(`数据为空`);
      let n = { ...__contentScope.pi, ...t };
      e.byteLength > n.maxInputBytes && (0, __contentScope.G)(`超出输入长度上限`);
      let r = new __contentScope.hi(e, n), i = r.readItem(0);
      return r.done() || (0, __contentScope.G)(`数据尾部有多余字节`), i;
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
      } catch {
      }
    }
    function wi(e) {
      return e.adapter?.family === __contentScope.s.UNSUPPORTED && e.adapter?.siteType === __contentScope.o.UNKNOWN ? [] : __contentScope.vi;
    }
    function Ti(e, t) {
      let n = t ? [t] : [`localStorage`, `sessionStorage`];
      if (!t && e === `auth-token` && location.origin === `https://orevx.ai`)
        for (const areaName of n)
          try {
            const area = areaName === `localStorage` ? localStorage : sessionStorage, token = area.getItem(`auth-token`)?.trim(), sessionId = area.getItem(`auth-session-id`)?.trim(), storedUser = JSON.parse(area.getItem(`auth-user`) ?? `null`);
            if (token && sessionId && Number.isSafeInteger(storedUser?.id) && storedUser.id > 0)
              return token;
          } catch {
          }
      for (let t2 of n)
        try {
          let n2 = (t2 === `localStorage` ? typeof localStorage > `u` ? void 0 : localStorage : typeof sessionStorage > `u` ? void 0 : sessionStorage)?.getItem(e)?.trim();
          if (n2) return n2;
        } catch {
        }
    }
    function Ei(e, t) {
      let n = (0, __contentScope.Ti)(e, t);
      if (!n) return null;
      try {
        let e2 = (0, __contentScope.Si)(JSON.parse(n));
        return e2 ? { ...e2, source: `storage` } : null;
      } catch {
        return null;
      }
    }
    async function Di(e, t, n, options = {}) {
      if (!t.endpoint || !t.tokenKey || location.origin !== (0, __contentScope.Dr)(e) || !(0, __contentScope.Nr)(e, t.endpoint))
        return null;
      const url = new URL(t.endpoint), trace = (detail) => options.diagnostics?.push(`身份接口 ${url.origin}${url.pathname}（本站 Token）：${detail}`);
      let r = n ?? (0, __contentScope.Ti)(t.tokenKey, t.tokenStorageType);
      if (!r) return trace(`当前页面没有可用的会话 Token（存储键 ${t.tokenKey}）`), null;
      let i = { Accept: `application/cbor, application/json` };
      i[t.tokenHeader ?? `Authorization`] = `${t.tokenPrefix ?? `Bearer `}${r}`;
      let a = new AbortController(), o = setTimeout(
        () => a.abort(),
        Math.min(__contentScope.yi, Math.max(1, options.timeoutMs ?? __contentScope.yi))
      );
      try {
        let e2 = await fetch(t.endpoint, {
          method: `GET`,
          credentials: `omit`,
          headers: i,
          cache: `no-store`,
          redirect: `error`,
          signal: a.signal
        });
        if (!e2.ok) return trace(`HTTP ${e2.status}`), null;
        if (e2.redirected || e2.url && new URL(e2.url).href !== url.href)
          return trace(`响应发生跳转，未采用身份`), null;
        let n2 = e2.headers.get(`content-type`)?.toLowerCase() ?? ``;
        if (n2.includes(`cbor`) || n2.includes(`json`)) {
          const body = n2.includes(`cbor`) ? (0, __contentScope._i)(new Uint8Array(await e2.arrayBuffer())) : await e2.json().catch(() => null);
          if (body == null) trace(`JSON / CBOR 用户资料解析失败`);
          return body;
        }
        trace(
          n2.includes(`html`) ? `返回 HTML 页面，可能是访问验证或登录页` : `响应不是 JSON / CBOR 用户资料`
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
      const url = new URL(t.endpoint), endpoint = `${url.origin}${url.pathname}`;
      if (!i)
        options.diagnostics?.push(`身份接口 ${endpoint}（本站 Token）：未返回有效的当前用户字段`);
      return i ? { ...i, source: `api`, endpoint } : null;
    }
    function Fi(e, t = false) {
      if (!e) return ``;
      let n = [], r = false, i = false;
      for (let a of e.split(/[\r\n]+/).map((e2) => e2.trim()).filter(Boolean)) {
        if (__contentScope.Ai.test(a)) {
          r = true, i = false;
          continue;
        }
        let e2 = __contentScope.ji.test(a);
        if ((e2 || __contentScope.Mi.test(a)) && (r = false), r || __contentScope.ki.test(a)) {
          i = false;
          continue;
        }
        let o = e2 || __contentScope.Ni.test(a), s = i && /^[^\s<>]{2,80}(?:\s*[·|]\s*[^\r\n]{1,40})?$/.test(a);
        (t || o || s) && n.push(a), i = o;
      }
      return n.join(`
`);
    }
    function Ii(e) {
      for (let t = e; t; t = t.parentElement) {
        if (t.hidden || t.getAttribute(`aria-hidden`) === `true` || t.hasAttribute(`inert`))
          return false;
        let e2 = getComputedStyle(t);
        if (e2.display === `none` || e2.visibility === `hidden` || e2.visibility === `collapse` || Number.parseFloat(e2.opacity || `1`) <= 0.02)
          return false;
      }
      return true;
    }
    function Li() {
      let e = [(0, __contentScope.Fi)(document.body?.innerText)];
      if (typeof document.querySelectorAll != `function`) return e[0];
      for (let t of document.querySelectorAll(
        `[role="menu"], [aria-haspopup="menu"], [aria-haspopup="true"]`
      )) {
        if (!(0, __contentScope.Ii)(t) || t.closest(`table, [role="table"], [role="grid"], .lottery-sidebar`))
          continue;
        let n = t.innerText ?? t.textContent ?? ``;
        if (!n.trim() || n.length > 2e3) continue;
        let r = t.getAttribute(`role`) === `menu` && __contentScope.Pi.test(n), i = t.hasAttribute(`aria-haspopup`) && (!!t.closest(`header, nav, [role="banner"]`) || /user|account|profile|avatar|用户|账号|账户|个人|头像/i.test(
          `${t.getAttribute(`aria-label`) ?? ``} ${t.getAttribute(`title`) ?? ``}`
        ));
        (r || i) && e.push((0, __contentScope.Fi)(n, true));
      }
      return e.filter(Boolean).join(`
`);
    }
    function Ri(e) {
      let t = new Map(e.map((e2) => [e2.toLowerCase(), e2]));
      return t.size === 1 ? t.values().next().value : void 0;
    }
    function zi(e) {
      if (!e) return null;
      let t = { source: `visible` }, ids = (0, __contentScope.Vi)(e, true);
      if (ids.length > 1)
        return {
          source: `visible`,
          identityConflict: `页面同时显示多个当前用户 ID（${ids.join(`、`)}）`
        };
      ids[0] && (t.userId = ids[0]);
      let r = [...e.matchAll(/(?<![\w.+@*-])@([A-Za-z0-9][A-Za-z0-9._-]{1,38})\b/g)].map((e2) => e2[1]).filter((e2) => !e2.includes(`.`)), i = [
        ...e.matchAll(
          /(?:^|\s)(?:用户名|登录名|当前(?:登录)?(?:账号|账户)|username|login name)(?:\s*[:：]\s*|\s+)([\p{L}\p{N}][\p{L}\p{N}._+@-]{1,79})/giu
        )
      ].map((e2) => e2[1]).filter((e2) => !e2.includes(`@`)), a = (0, __contentScope.Ri)(i.length ? i : r);
      a && (t.username = a);
      let o = (0, __contentScope.Ri)(
        [...e.matchAll(/(?<![\w.+*-])[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g)].map((e2) => e2[0])
      );
      return o && (t.email = o), t.userId || t.username || t.email ? t : null;
    }
    function Bi(site) {
      return readVisibleAccountIdentity(
        document,
        location,
        site ? readIdentitySource(site) : void 0
      );
    }
    function Vi(e, all = false) {
      let t = /(?<![A-Za-z])(?:用户\s*ID|User\s*ID|UID)\s*[:：#]?\s*(\d{1,12})\b/gi, n = /* @__PURE__ */ new Set();
      for (let r of e.matchAll(t)) {
        let t2 = r[1];
        if (!t2) continue;
        let i = e.slice(Math.max(0, (r.index ?? 0) - 14), r.index ?? 0);
        __contentScope.ki.test(i) || n.add(t2);
      }
      return all ? [...n] : n.size === 1 ? [...n][0] : void 0;
    }
    function Gi(e, t) {
      let n = e.trim().toLowerCase(), r = t == null ? (0, __contentScope.Li)() : (0, __contentScope.Fi)(t);
      if (!r || n.length < __contentScope.Hi) return null;
      if ((0, __contentScope.Ki)(r.toLowerCase(), n)) return { matched: e.trim(), masked: false };
      let i = n.lastIndexOf(`@`);
      if (i <= 0) return null;
      let a = n.slice(0, i), o = n.slice(i + 1);
      if (!o) return null;
      for (let e2 of r.matchAll(__contentScope.Wi)) {
        let t2 = (e2[1] ?? ``).toLowerCase(), n2 = (e2[2] ?? ``).toLowerCase();
        if ((t2 || n2) && (e2[3] ?? ``).toLowerCase() === o && (!t2 || a.startsWith(t2)) && (!n2 || a.endsWith(n2)))
          return { matched: e2[0], masked: true };
      }
      return null;
    }
    function Ki(e, t) {
      for (let n = 0; n <= e.length; ) {
        let r = e.indexOf(t, n);
        if (r < 0) return false;
        let i = e[r - 1] ?? ` `, a = e[r + t.length] ?? ` `;
        if (!__contentScope.Ui.test(i) && !__contentScope.Ui.test(a)) return true;
        n = r + 1;
      }
      return false;
    }
    async function qi(site, token, options = {}) {
      identityResolver ??= new SiteIdentityResolver({
        getFamily: (selected) => (0, __contentScope.$r)(selected).family,
        readStorage: (key, type) => (0, __contentScope.Ti)(key, type),
        readPage: (selected) => (0, __contentScope.Bi)(selected),
        userIdHeaders: (hint) => (0, __contentScope.Vr)(hint),
        bootstrapHeaders: (selected) => (0, __contentScope.ui)(selected),
        readExternal: (selected, source, explicitToken, readOptions) => (0, __contentScope.Oi)(selected, source, explicitToken, readOptions),
        transportHints: __contentScope.identityProbeHints
      });
      const deadline = Date.now() + (options.timeoutMs ?? 4e3), reader = Object.create(identityResolver);
      reader.readExternal = (selected, source, explicitToken) => (0, __contentScope.Oi)(selected, source, explicitToken, {
        timeoutMs: Math.max(1, deadline - Date.now()),
        diagnostics: options.diagnostics
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
      let n = [/token/i, /auth/i, /session/i, /user/i, /login/i], r = e.checkin?.logoutStorageKeys ?? [], i = 0;
      for (let e2 of [localStorage, sessionStorage]) {
        let t2 = [];
        for (let n2 = 0; n2 < e2.length; n2 += 1) {
          let r2 = e2.key(n2);
          r2 && t2.push(r2);
        }
        for (let a of t2) (r.includes(a) || n.some((e3) => e3.test(a))) && (e2.removeItem(a), i += 1);
      }
      return i && t.push(`已清除 ${i} 项本地登录态`), i;
    }
    async function $i(e, t, n) {
      (0, __contentScope.di)();
      let r = (0, __contentScope.Qi)(e, t), i = e.logoutApiUrl ?? e.checkin?.logoutApiUrl, a = false;
      if (i && !n) {
        let n2 = new URL(i, location.origin).href;
        if ((0, __contentScope.W)(e, n2)) {
          for (let e2 of [`POST`, `GET`]) {
            let r2 = new AbortController(), i2 = setTimeout(() => r2.abort(), __contentScope.bi);
            try {
              if ((await fetch(n2, {
                method: e2,
                credentials: `include`,
                headers: { Accept: `application/json` },
                signal: r2.signal
              })).ok) {
                a = true, t.push(`已调用站点退出接口(${e2} ${new URL(n2).pathname})，服务端会话已失效`);
                break;
              }
            } catch {
            } finally {
              clearTimeout(i2);
            }
          }
          a || t.push(`退出接口无响应(${new URL(n2).pathname})，改用重载登录页的方式切换账号`);
        } else t.push(`配置的退出接口不在本站，已忽略`);
      }
      let o, s = false;
      if (n)
        try {
          o = await n(), o.failed > 0 || o.removed < o.matched ? (s = true, t.push(
            `本站浏览器 Cookie 清理后仍残留 ${o.failed || o.matched - o.removed} 项（清理前发现 ${o.matched} 项）`
          )) : o.removed > 0 ? t.push(`已清除本站浏览器 Cookie ${o.removed} 项（含 HttpOnly）`) : t.push(`已确认本站浏览器没有残留 Cookie`);
        } catch (e2) {
          s = true, t.push(`清除本站浏览器 Cookie 失败: ${e2 instanceof Error ? e2.message : String(e2)}`);
        }
      return {
        clearedKeys: r,
        serverLogout: a,
        ...o ? { browserCookies: o } : {},
        cookieMayRemain: n ? s || !o : !a
      };
    }
    function ea(e, t, n) {
      let r = e.tokenConfig;
      if (!r) return n.push(`站点未配置 Token 认证参数（tokenConfig）`), false;
      let i = r.storageType === `sessionStorage` ? sessionStorage : localStorage;
      try {
        i.setItem(r.storageKey, t);
        let e2 = r.storageType === `sessionStorage` ? `sessionStorage` : `localStorage`;
        return n.push(`已注入 Token 到 ${e2}.${r.storageKey}`), true;
      } catch (e2) {
        return n.push(`Token 注入失败: ${e2 instanceof Error ? e2.message : String(e2)}`), false;
      }
    }
    function ta(e) {
      let t = { Accept: `application/json` }, n;
      try {
        let e2 = localStorage.getItem(`user`);
        if (e2) {
          let t2 = JSON.parse(e2);
          typeof t2?.id == `number` && Number.isFinite(t2.id) ? n = String(t2.id) : typeof t2?.id == `string` && t2.id.trim() && (n = t2.id.trim());
        }
      } catch {
      }
      Object.assign(t, (0, __contentScope.Vr)(n ?? e));
      for (let e2 of [`auth_token`, `access_token`, `token`]) {
        let n2 = localStorage.getItem(e2)?.trim();
        if (n2 && n2.length > 20 && !n2.startsWith(`{`)) {
          t.Authorization = `Bearer ${n2}`;
          break;
        }
      }
      return t;
    }
    function la(e) {
      return Number.isNaN(e.getTime()) ? null : { year: e.getFullYear(), month: e.getMonth() + 1, day: e.getDate() };
    }
    function ua(e) {
      let t = e.replace(/[年月日]/g, `/`).replace(/[.\-]/g, `/`).match(/((?:19|20)\d{2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,2})/);
      if (!t) return null;
      let n = Number(t[1]), r = Number(t[2]), i = Number(t[3]);
      if (!Number.isInteger(r) || r < 1 || r > 12 || !Number.isInteger(i) || i < 1 || i > 31)
        return null;
      let a = new Date(n, r - 1, i);
      return a.getFullYear() !== n || a.getMonth() + 1 !== r || a.getDate() !== i ? null : { year: n, month: r, day: i };
    }
    function da(e, t = /* @__PURE__ */ new Date()) {
      if (!e) return null;
      let n = (0, __contentScope.la)(t);
      if (!n) return null;
      let r = [...e.matchAll(__contentScope.aa)];
      for (let t2 = 0; t2 < r.length; t2 += 1) {
        let i = r[t2];
        if (!i) continue;
        let a = i.index ?? 0, o = r[t2 + 1]?.index ?? e.length, s = e.slice(a, o), c = s.match(/[+＋]\s*(\d[\d,]*(?:\.\d+)?)/);
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
        return false;
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
      let t = () => document.body?.innerText ?? document.body?.textContent ?? ``, n = t();
      if (__contentScope.ia.test(n)) return n;
      let r = [
        ...document.querySelectorAll(
          `button, [role="button"], a, [aria-haspopup], [aria-expanded], [tabindex="0"]`
        )
      ].filter((e2) => (0, __contentScope.O)(e2)), i = /登录|注册|每日签到|签到|语言|主题|切换|菜单|导航|退出|logout|sign[ -]?in/i, a = r.map((e2) => {
        let t2 = e2.getBoundingClientRect(), n2 = (e2.innerText || e2.getAttribute(`aria-label`) || ``).replace(/\s+/g, ` `).trim(), r2 = `${e2.id} ${e2.className} ${e2.getAttribute(`data-testid`) ?? ``} ${e2.getAttribute(`aria-haspopup`) ?? ``}`, a2 = 0;
        return e2.getAttribute(`aria-haspopup`)?.toLowerCase() === `menu` && (a2 += 30), e2.getAttribute(`aria-expanded`) === `false` && (a2 += 8), /user|account|avatar|profile|dropdown|member|用户|账户|头像/i.test(r2) && (a2 += 12), t2.top <= 180 && t2.right >= window.innerWidth * 0.65 && (a2 += 10), n2.length >= 1 && n2.length <= 32 && (a2 += 4), i.test(n2) && (a2 -= 30), { element: e2, score: a2, label: n2 };
      }).filter((e2) => e2.score >= 10).sort((e2, t2) => t2.score - e2.score || e2.label.length - t2.label.length)[0]?.element;
      if (!a) return n;
      let o = false;
      try {
        await (0, __contentScope.M)(a, { mayNavigate: false }), o = true;
      } catch {
        return n;
      }
      let s = Date.now() + 1500;
      for (; Date.now() < s && (n = t(), !__contentScope.ia.test(n)); )
        await (0, __contentScope.w)(80);
      if (__contentScope.ia.test(n) && e?.push(`已展开禾维用户菜单并读取当前积分`), o && a.isConnected)
        try {
          await (0, __contentScope.M)(a, { mayNavigate: false });
        } catch {
        }
      return n;
    }
    function Ca(e) {
      return __contentScope.Sa.test(e) ? true : __contentScope.ba.test(e.replace(__contentScope.xa, ``));
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
        let e2 = (0, __contentScope.wa)(t[1]);
        return e2 == null ? null : { amount: e2, symbol: `积分` };
      }
      let n = e.trim().match(/^(?:([$＄¥￥])|(?:usd|cny|rmb))?\s*(\d[\d,]*(?:\.\d+)?)$/i);
      if (!n?.[2]) return null;
      let r = (0, __contentScope.wa)(n[2]);
      if (r == null) return null;
      let i = (0, __contentScope.Ta)(n[1] || e.trim().match(/^(usd|cny|rmb)/i)?.[1] || ``);
      return { amount: r, ...i ? { symbol: i } : {} };
    }
    function Da(e, t) {
      if (!e) return null;
      let n = (0, __contentScope.da)(e);
      if (n) return n;
      if (__contentScope.oa.test(e) && __contentScope.sa.test(e) || !__contentScope.va.test(e))
        return null;
      for (let { pattern: n2, requiresCheckedIn: r } of __contentScope.ha) {
        if (r && !__contentScope._a.test(e)) continue;
        let i = n2.flags.includes(`g`) ? n2.flags : `${n2.flags}g`;
        for (let r2 of e.matchAll(new RegExp(n2.source, i))) {
          let e2 = r2[1];
          if (!e2) continue;
          let n3 = (0, __contentScope.Ea)(e2);
          if (!n3 || n3.amount <= 0) continue;
          let i2 = n3.symbol === `积分` ? 1 : t && t > 0 ? t : 1;
          return {
            reward: n3.amount * i2,
            ...n3.symbol ? { symbol: n3.symbol } : {}
          };
        }
      }
      return null;
    }
    function Oa(e, t, n) {
      let r = (0, __contentScope.Da)(t, n);
      if (r == null) return null;
      let i = (0, __contentScope.Da)(e, n);
      return i != null && Math.abs(r.reward - i.reward) <= __contentScope.Ua && r.symbol === i.symbol ? null : r;
    }
    function ka(e) {
      if (e != null) return e.length > __contentScope.ya ? e.slice(0, __contentScope.ya) : e;
    }
    function Aa(e, t) {
      return (0, __contentScope.Da)(
        e.replace(__contentScope.ga, (e2) => e2.replace(/[^\n]/g, ` `)),
        t
      );
    }
    function ja(e, t, n) {
      if (e.verdict === `rewarded` || e.verdict !== `unchanged` && e.verdict !== `already-used` && e.verdict !== `unknown`)
        return e;
      let r = (0, __contentScope.ka)(t.after);
      if (!r || !(0, __contentScope.Ca)(r)) return e;
      let i = (0, __contentScope.Aa)(r, n);
      if (!i) return e;
      let a = (0, __contentScope.Oa)((0, __contentScope.ka)(t.before), r, n) ? `visible-reward` : `checkin-ledger`;
      return {
        ...e,
        reward: i.reward,
        ...i.symbol ? { rewardSymbol: i.symbol } : {},
        verdict: `rewarded`,
        source: a
      };
    }
    function Ma(e, t) {
      if (!e) return null;
      let n = e.match(__contentScope.ia);
      if (n?.[1]) {
        let e2 = (0, __contentScope.wa)(n[1]);
        if (e2 != null) return { quota: e2, usedQuota: 0, symbol: `积分` };
      }
      let r = e.match(__contentScope.ra);
      if (r?.[1]) {
        let e2 = (0, __contentScope.wa)(r[1]);
        if (e2 != null) return { quota: e2, usedQuota: 0, symbol: `积分` };
      }
      if (__contentScope.oa.test(e)) return null;
      let i = e.match(/(?:当前余额|账户余额|剩余额度|可用余额)\s*[:：]?\s*([\s\S]{0,120})/i)?.[1];
      if (i) {
        let e2 = i.match(
          /(?:免费余额|免费)\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i
        ), n2 = i.match(
          /(?:付费余额|付费)\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i
        ), r2 = e2?.[3] ? (0, __contentScope.wa)(e2[3]) : null, a = n2?.[3] ? (0, __contentScope.wa)(n2[3]) : null;
        if (r2 != null || a != null) {
          let i2 = t && t > 0 ? t : 1, o = (0, __contentScope.Ta)(e2?.[1] ?? e2?.[2] ?? n2?.[1] ?? n2?.[2]);
          return {
            quota: ((r2 ?? 0) + (a ?? 0)) * i2,
            usedQuota: 0,
            ...o ? { symbol: o } : {}
          };
        }
      }
      for (let n2 of __contentScope.na) {
        let r2 = e.match(n2), i2 = r2?.[3];
        if (!i2) continue;
        let a = i2;
        if (i2.includes(`,`)) {
          if (!/^-?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(i2)) continue;
          a = i2.replace(/,/g, ``);
        }
        let o = Number(a);
        if (!Number.isFinite(o)) continue;
        let s = t && t > 0 ? t : 1, c = (0, __contentScope.Ta)(r2?.[1] ?? r2?.[2]);
        return { quota: o * s, usedQuota: 0, ...c ? { symbol: c } : {} };
      }
      return null;
    }
    function Fa(e) {
      return typeof e == `number` && Number.isFinite(e) ? e : typeof e == `string` && e.trim() !== `` && Number.isFinite(Number(e)) ? Number(e) : null;
    }
    function Ia(e) {
      if (!e || typeof e != `object`) return null;
      let t = e;
      if (t.success === false) return null;
      let n = t.data ?? t;
      if (!n || typeof n != `object`) return null;
      let r = __contentScope.Fa, i = r(n.quota);
      if (i != null) return { quota: i, usedQuota: r(n.used_quota) ?? r(n.usedQuota) ?? 0 };
      let a = r(n.free_balance) ?? r(n.freeBalance), o = r(n.paid_balance) ?? r(n.paidBalance) ?? (a == null ? null : r(n.balance));
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
      return t === __contentScope.s.SUB2API ? __contentScope.Pa : t === __contentScope.s.NEW_API ? __contentScope.Na : [...__contentScope.Na, ...__contentScope.Pa];
    }
    async function za(e, t) {
      let n = (0, __contentScope.fa)(e), r = (0, __contentScope.ta)(e.adapter?.userId), i = await (0, __contentScope.ui)(e, t);
      for (let [e2, t2] of Object.entries(i)) r[e2] || (r[e2] = t2);
      let a = n ? [] : (0, __contentScope.Ra)(e);
      for (let n2 of a) {
        let i2 = new URL(n2, location.origin).href;
        if ((0, __contentScope.W)(e, i2))
          try {
            let n3 = await (0, __contentScope.Ha)(i2, __contentScope.Va, r);
            if (!n3?.ok || !(n3.headers.get(`content-type`)?.toLowerCase() ?? ``).includes(`json`))
              continue;
            let a2 = (0, __contentScope.Ia)(await n3.json().catch(() => null));
            if (!a2) continue;
            let o2 = (0, __contentScope.$r)(e).family, s2 = { quotaPerUnit: e.adapter?.quotaPerUnit, family: o2 }, c = (e2) => (0, __contentScope.Kr)(e2, s2);
            return t?.push(`已读取额度快照（剩余 ${c(a2.quota)}，累计已用 ${c(a2.usedQuota)}）`), { quota: a2.quota, usedQuota: a2.usedQuota, at: Date.now() };
          } catch {
          }
      }
      let o = (0, __contentScope.Mr)(e);
      if (o?.endpoint) {
        let n2 = await (0, __contentScope.Ba)(e, o);
        if (n2) {
          let r2 = {
            family: (0, __contentScope.$r)(e).family,
            quotaPerUnit: e.adapter?.quotaPerUnit
          };
          return t?.push(
            `已通过跨域接口读取额度快照（剩余 ${(0, __contentScope.Kr)(n2.quota, r2, n2.symbol)}）`
          ), n2;
        }
      }
      let s = (0, __contentScope.Ma)(
        n ? await (0, __contentScope.ma)(t) : document.body?.innerText,
        e.adapter?.quotaPerUnit
      );
      return s ? (t?.push(
        n ? `已读取禾维当前积分（无累计消耗，差分只看积分增减）` : `额度接口读不到，改用页面上显示的余额（无累计消耗，差分只看余额增减）`
      ), {
        quota: s.quota,
        usedQuota: s.usedQuota,
        at: Date.now(),
        ...s.symbol ? { symbol: s.symbol } : {},
        fromVisibleText: true,
        visiblePath: (0, __contentScope.pa)()
      }) : (t?.push(`未能读到额度快照（接口与页面都没有可用余额），本次无法用守恒差分确认结果`), null);
    }
    async function Ba(e, t) {
      let n = await (0, __contentScope.Di)(e, t);
      if (n == null) return null;
      let r = (0, __contentScope.La)(n);
      return r ? {
        quota: r.quota,
        usedQuota: r.usedQuota,
        ...r.symbol ? { symbol: r.symbol } : {},
        at: Date.now()
      } : null;
    }
    async function Ha(e, t, n = { Accept: `application/json` }) {
      let r = new AbortController(), i = setTimeout(() => r.abort(), t);
      try {
        return await fetch(e, {
          method: `GET`,
          credentials: `include`,
          headers: n,
          signal: r.signal
        });
      } catch {
        return null;
      } finally {
        clearTimeout(i);
      }
    }
    function Wa(e, t) {
      if (!e || !t || e.fromVisibleText && t.fromVisibleText && e.visiblePath && t.visiblePath && e.visiblePath !== t.visiblePath)
        return { verdict: `unknown` };
      let n = e.quota + e.usedQuota, r = t.quota + t.usedQuota - n, i = t.usedQuota - e.usedQuota, a = t.quota - e.quota, o;
      return o = r > __contentScope.Ua ? `rewarded` : i > __contentScope.Ua ? `already-used` : `unchanged`, {
        reward: r,
        usageDelta: i,
        balanceDelta: a,
        verdict: o,
        quotaAfter: t.quota,
        ...t.symbol ? { balanceSymbol: t.symbol } : {}
      };
    }
    function Ga(e, t, n) {
      if (!e.verdict || e.verdict === `unknown`) return null;
      let r = t && t > 0 ? t : n === __contentScope.s.NEW_API ? 5e5 : 1, i = (e2, t2) => (0, __contentScope.Kr)(e2, { quotaPerUnit: r }, t2), a = (e2, t2) => (0, __contentScope.qr)(e2, { quotaPerUnit: r }, t2);
      if (e.verdict === `rewarded` && e.source === `checkin-ledger`) {
        let t2 = `今日签到记录奖励 ${a(e.reward ?? 0, e.rewardSymbol ?? e.balanceSymbol)}`;
        return e.quotaAfter == null ? t2 : `${t2}，当前余额 ${i(e.quotaAfter, e.balanceSymbol)}`;
      }
      if (e.verdict === `rewarded` && e.source === `visible-reward`) {
        let t2 = `页面证据判定奖励 ${a(e.reward ?? 0, e.rewardSymbol ?? e.balanceSymbol)} 已到账`, n2 = e.balanceDelta == null ? `（未取得守恒差分基线）` : `（余额差分未体现增长，可能因显示精度或页面刷新滞后）`;
        return e.quotaAfter == null ? `${t2}${n2}` : `${t2}${n2}，当前余额 ${i(e.quotaAfter, e.balanceSymbol)}`;
      }
      if (e.verdict === `rewarded`) {
        let t2 = `签到获得 ${a(e.reward ?? 0, e.rewardSymbol ?? e.balanceSymbol)}`;
        return e.quotaAfter == null ? t2 : `${t2}，当前余额 ${i(e.quotaAfter, e.balanceSymbol)}`;
      }
      if (e.verdict === `already-used`) {
        let t2 = `今日已签到（期间消耗 ${a(e.usageDelta ?? 0, e.balanceSymbol)}）`;
        return e.quotaAfter == null ? t2 : `${t2}，当前余额 ${i(e.quotaAfter, e.balanceSymbol)}`;
      }
      return e.source === `checkin-ledger` ? e.quotaAfter == null ? `今日已签到，额度未变化` : `今日已签到，额度未变化，当前余额 ${i(e.quotaAfter, e.balanceSymbol)}` : e.quotaAfter == null ? `额度无变化` : `额度无变化，当前余额 ${i(e.quotaAfter, e.balanceSymbol)}`;
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
      return (0, __contentScope.z)().find((e) => {
        let t = (0, __contentScope.io)(e);
        return /(?:今日|今天)?(?:已签到|已经签到|已签)/.test(t);
      }) ?? ((0, __contentScope.ro)(/(?:今日|今天)已签到|已经签到|签到成功/) ? document.body : null);
    }
    function oo() {
      return (0, __contentScope.z)().filter((e) => !(0, __contentScope.R)(e)).filter((e) => {
        let t = (0, __contentScope.io)(e);
        return /^(?:立即签到|签到|check[ -]?in now|sign[ -]?in)$/i.test(t) || /立即签到/.test(t) && t.length <= 24 || /签到/.test(t) && !/(?:已|今日|今天|历史|记录)/.test(t) && t.length <= 20;
      }).sort((e, t) => (0, __contentScope.io)(e).length - (0, __contentScope.io)(t).length)[0] ?? null;
    }
    function so() {
      let e = [...document.querySelectorAll(`a[href]`)].filter((e2) => (0, __contentScope.O)(e2)).filter((e2) => {
        try {
          let t = new URL(e2.href, location.href);
          return t.origin === location.origin && (0, __contentScope.to)(t.pathname) === __contentScope.Ja;
        } catch {
          return false;
        }
      });
      return (e.find((e2) => /浮梦引光/.test((0, __contentScope.io)(e2))) ?? e[0]) || ([
        ...document.querySelectorAll(
          `a, button, [role="button"], [role="menuitem"], [role="link"], [onclick], [class*="cursor-pointer" i], li, span, div`
        )
      ].filter((e2) => {
        let t = (e2.textContent ?? ``).replace(/\s+/g, ` `).trim();
        return /浮梦引光/.test(t) && t.length <= 24;
      }).filter((e2) => (0, __contentScope.O)(e2)).filter((e2) => !(0, __contentScope.R)(e2)).map((e2) => {
        let t = (0, __contentScope.io)(e2), n = e2.getBoundingClientRect(), r = t === `浮梦引光` ? 100 : 40;
        return e2.matches(`a, button, [role="button"], [role="menuitem"], [role="link"]`) && (r += 25), e2.matches(`[onclick], [class*="cursor-pointer" i]`) && (r += 12), n.width <= 240 && n.height <= 80 && (r += 15), {
          element: e2,
          score: r,
          area: Math.max(1, n.width * n.height),
          length: t.length
        };
      }).sort((e2, t) => t.score - e2.score || e2.area - t.area || e2.length - t.length)[0]?.element ?? null);
    }
    function co() {
      return [...document.querySelectorAll(`.lottery-page`)].find(__contentScope.O) ?? null;
    }
    function lo() {
      return [...document.querySelectorAll(`button.lottery-board-center`)].find(__contentScope.O) ?? null;
    }
    function uo(e) {
      return (0, __contentScope.io)(e.querySelector(`:scope > span`) ?? e);
    }
    function fo() {
      let e = (0, __contentScope.co)(), t = (0, __contentScope.lo)();
      if (!e && !t) return (0, __contentScope.ro)(__contentScope.eo);
      let n = e ?? document, r = n.querySelector(`.lottery-notice`);
      if (r && (0, __contentScope.O)(r) && /今日梦火抽签次数已耗尽|\bThis draw is complete\b|\bYou have already drawn today\b/i.test(
        (0, __contentScope.io)(r)
      ))
        return true;
      if (!t || !(0, __contentScope.R)(t) || !__contentScope.eo.test((0, __contentScope.uo)(t)))
        return false;
      let i = n.querySelector(`.lottery-page-heading`);
      return !!i && (0, __contentScope.O)(i) && /(?:\bWon\s+|抽中\s*[:：]\s*)\S/i.test((0, __contentScope.io)(i));
    }
    function po(e) {
      return e.length <= 80 && /抽奖|\b(?:start\s+)?draw\b/i.test(e) && !__contentScope.eo.test(e) && !/已抽奖|次数已用完|历史|记录|说明|规则|\b(?:drawing|history|records?|rules?)\b/i.test(e);
    }
    function go() {
      let e = (0, __contentScope.lo)();
      if (e || (0, __contentScope.co)())
        return __contentScope.ho = null, e && !(0, __contentScope.R)(e) && (0, __contentScope.po)((0, __contentScope.uo)(e)) ? e : null;
      let t = Date.now();
      if (t - __contentScope.mo < __contentScope.Qa && __contentScope.ho?.isConnected && (0, __contentScope.O)(__contentScope.ho) && !(0, __contentScope.R)(__contentScope.ho) && (0, __contentScope.po)((0, __contentScope.io)(__contentScope.ho)))
        return __contentScope.ho;
      __contentScope.mo = t;
      let n = (0, __contentScope.z)(), r = [
        ...document.querySelectorAll(
          `button, [role="button"], a, [onclick], [class*="cursor-pointer" i], [class*="card" i], div, span`
        )
      ].filter((e2) => (0, __contentScope.po)((e2.textContent ?? ``).replace(/\s+/g, ` `).trim())).slice(0, __contentScope.$a).filter((e2) => (0, __contentScope.O)(e2));
      return __contentScope.ho = [.../* @__PURE__ */ new Set([...n, ...r])].filter((e2) => !(0, __contentScope.R)(e2)).map((e2) => ({ element: e2, text: (0, __contentScope.io)(e2) })).filter(({ element: e2, text: t2 }) => {
        if (!(0, __contentScope.po)(t2)) return false;
        let n2 = e2.getBoundingClientRect();
        return n2.width >= 42 && n2.height >= 42 && n2.width <= 520 && n2.height <= 520;
      }).map(({ element: e2, text: t2 }) => {
        let n2 = e2.getBoundingClientRect(), r2 = Math.max(1, n2.width), i = Math.max(1, n2.height), a = r2 / i, o = n2.left + r2 / 2, s = n2.top + i / 2, c = window.innerWidth / 2, l = window.innerHeight / 2, u = t2 === `抽奖` ? 140 : 70;
        return a >= 0.72 && a <= 1.4 ? u += 30 : (a < 0.45 || a > 2.2) && (u -= 35), e2.matches(`button, [role="button"], [onclick], [class*="cursor-pointer" i]`) && (u += 18), u -= Math.hypot(o - c, s - l) / 80, { element: e2, text: t2, score: u, area: r2 * i };
      }).sort((e2, t2) => t2.score - e2.score || e2.area - t2.area || e2.text.length - t2.text.length)[0]?.element ?? null, __contentScope.ho;
    }
    async function _o(e, t, n = 150) {
      let r = Date.now() + t;
      for (; Date.now() <= r; ) {
        if (e()) return true;
        await (0, __contentScope.w)(Math.min(n, Math.max(1, r - Date.now())));
      }
      return false;
    }
    async function vo(e, t, n, r, i, a = false) {
      if (!r()) throw new __contentScope.K(`一梦五千年未找到${n}`);
      if (i.beforeAction && !await i.beforeAction())
        throw new __contentScope.K(`一梦五千年点击${n}前的人机验证未完成`);
      let o = r();
      if (!o) throw new __contentScope.K(`一梦五千年完成人机验证后未找到${n}`);
      for (let i2 = 0; i2 < 3; i2 += 1) {
        let a2 = await (0, __contentScope.B)(o, e, t, `一梦五千年 ${n}`), s = r();
        if (o.isConnected && s === o) {
          if (a2) throw new __contentScope.K(`一梦五千年${n}仍被弹窗遮挡`);
          break;
        }
        if (i2 === 2) throw new __contentScope.K(`一梦五千年页面持续重绘，无法稳定定位${n}，未点击`);
        if (t.push(`一梦五千年公告处理后重新定位${n}`), await (0, __contentScope._o)(() => !!r(), 1e3), o = r(), !o)
          throw new __contentScope.K(`一梦五千年页面重绘后未找到可用的${n}，未点击`);
      }
      a && t.push(`一梦五千年即将点击${n}`);
      try {
        if (i.beforeDispatch && !await i.beforeDispatch())
          throw new __contentScope.K(`一梦五千年当前会话已变化，停止后续点击`);
        await (0, __contentScope.M)(o, { mayNavigate: a });
      } catch (e2) {
        throw new __contentScope.K(
          `一梦五千年点击${n}失败: ${e2 instanceof Error ? e2.message : String(e2)}`
        );
      }
      if (!a && (t.push(`一梦五千年已点击${n}`), i.afterAction && !await i.afterAction()))
        throw new __contentScope.K(`一梦五千年点击${n}后的人机验证未完成`);
    }
    function yo() {
      let e = [
        ...new Set(
          (0, __contentScope.z)().map((e2) => (0, __contentScope.io)(e2)).filter((e2) => e2 && e2.length <= 20)
        )
      ].slice(0, 10), t = [
        ...new Set(
          [...document.querySelectorAll(`a[href]`)].filter((e2) => (0, __contentScope.O)(e2)).map((e2) => {
            try {
              let t2 = new URL(e2.href, location.href);
              return t2.origin === location.origin ? (0, __contentScope.to)(t2.pathname) : ``;
            } catch {
              return ``;
            }
          }).filter(Boolean)
        )
      ].slice(0, 10), n = [];
      return e.length && n.push(`可点元素：${e.join(` / `)}`), t.length && n.push(`同源链接：${t.join(` / `)}`), n.join(`；`) || `页面上没有可见的可点元素或同源链接`;
    }
    async function bo(e, t, n) {
      (0, __contentScope.ao)() ? t.push(`一梦五千年页面显示今日已签到，继续进入浮梦引光`) : await (0, __contentScope._o)(() => !!(0, __contentScope.oo)(), __contentScope.Za) ? (await (0, __contentScope.vo)(e, t, `每日签到`, __contentScope.oo, n), await (0, __contentScope._o)(() => !!(0, __contentScope.ao)(), __contentScope.Xa) ? t.push(`一梦五千年每日签到已确认完成`) : t.push(`一梦五千年点击每日签到后未出现已签到状态，继续进入浮梦引光`)) : t.push(`一梦五千年个人页没有签到入口（站点已改为只有抽奖），直接进入浮梦引光`);
      let r = new URL(__contentScope.Ja, location.href).href;
      return (0, __contentScope.so)() ? (await (0, __contentScope.vo)(e, t, `浮梦引光`, __contentScope.so, n, true), await (0, __contentScope._o)(
        () => (0, __contentScope.to)(location.pathname) === __contentScope.Ja,
        1200
      ) ? await (0, __contentScope.xo)(e, t, n) : (t.push(`一梦五千年点击「浮梦引光」后路径未变，改为直接进入 ${__contentScope.Ja}`), { status: `navigate`, url: r })) : (t.push(
        `一梦五千年未在页面上找到「浮梦引光」入口，直接进入 ${__contentScope.Ja}（${(0, __contentScope.yo)()}）`
      ), { status: `navigate`, url: r });
    }
    async function xo(e, t, n) {
      if ((0, __contentScope.fo)())
        return t.push(`一梦五千年页面显示今日已抽，本次不重复抽奖`), { status: `already`, message: `一梦五千年今日已抽` };
      t.push(`一梦五千年等待本账号抽奖状态和中央按钮就绪`);
      let r = await (0, __contentScope._o)(
        () => (0, __contentScope.fo)() || !!(0, __contentScope.go)(),
        __contentScope.Ya
      );
      if ((0, __contentScope.fo)())
        return t.push(`一梦五千年已确认本账号今日已抽，本次不重复抽奖`), { status: `already`, message: `一梦五千年今日已抽` };
      if (!r) {
        if ((0, __contentScope.co)() || (0, __contentScope.lo)()) {
          let e2 = (0, __contentScope.lo)();
          throw new __contentScope.K(
            `一梦五千年抽奖状态尚未就绪：中央按钮「${e2 ? (0, __contentScope.io)(e2) : `尚未出现`}」，没有本账号今日已抽的确认，未点击也未标记已抽`
          );
        }
        throw new __contentScope.K(
          `一梦五千年抽奖页未找到中央抽奖方块（${(0, __contentScope.yo)()}）`
        );
      }
      if (await (0, __contentScope.vo)(e, t, `中央抽奖方块`, __contentScope.go, n), !await (0, __contentScope._o)(__contentScope.fo, __contentScope.Xa))
        throw new __contentScope.K(`一梦五千年抽奖后未出现“今日已抽”状态`);
      return t.push(`一梦五千年抽奖已确认完成`), { status: `success`, message: `一梦五千年抽奖已完成` };
    }
    async function So(e, t, n = {}) {
      let r;
      try {
        r = new URL(e.loginUrl);
      } catch {
        return { status: `failed`, message: `一梦五千年专用流程的登录地址无效` };
      }
      if (r.protocol !== `https:` || r.hostname.toLowerCase() !== __contentScope.Ka || r.port !== `` || location.hostname.toLowerCase() !== __contentScope.Ka || location.origin !== r.origin)
        return {
          status: `failed`,
          message: `leilei-daily 仅允许在 fapi.leileihog.top 同源页面执行`
        };
      try {
        let r2 = (0, __contentScope.to)(location.pathname);
        if (r2 === __contentScope.qa) return await (0, __contentScope.bo)(e, t, n);
        if (r2 === __contentScope.Ja) return await (0, __contentScope.xo)(e, t, n);
        let i = new URL(__contentScope.Ja, location.href).href;
        return t.push(`一梦五千年流程直接进入浮梦引光抽奖页`), { status: `navigate`, url: i };
      } catch (e2) {
        return {
          status: `failed`,
          message: e2 instanceof __contentScope.K ? e2.message : `一梦五千年流程异常: ${e2 instanceof Error ? e2.message : String(e2)}`
        };
      }
    }
    function Co(e) {
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
    function Bu() {
      return typeof document > `u` ? `` : document.body?.innerText ?? document.body?.textContent ?? ``;
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
      return e.kind === `success` ? (t.push(`工作流结束后页面出现签到成功证据：${e.words.join(`、`)}`), { status: `success`, message: `工作流命中签到成功证据` }) : e.kind === `already` ? (t.push(`工作流结束后页面显示今日已完成：${e.words.join(`、`)}`), { status: `already`, message: `工作流确认今日签到已完成` }) : (t.push(
        `工作流步骤已执行完，但页面上没有出现签到成功或已签到的证据；结果交由余额等其它证据判定`
      ), {
        status: `unknown`,
        message: `工作流步骤已执行完，未读到签到结果证据`
      });
    }
    function qu(e) {
      return e.replace(__contentScope.Ku, ``) || `/`;
    }
    function Ju(e) {
      try {
        let t = new URL(e, `https://learning.invalid`), n = t.hash.slice(1), r = (0, __contentScope.qu)(n.startsWith(`/`) ? n : t.pathname);
        return !/(?:^|\/)(?:login|sign-?in|auth|oauth|register|password)(?:\/|$)/i.test(r) && /^\/(?:dashboard|console|profile|personal|account|user|me|check-?in|daily|rewards?|lottery|draw|prize)(?:\/|$)/i.test(
          r
        );
      } catch {
        return false;
      }
    }
    function Zu(e) {
      let t = (0, __contentScope.L)(e);
      if (!__contentScope.ct.test(t) || __contentScope.lt.test(t) || __contentScope.Yu.test(t) || e.closest(`nav, [role="navigation"], [role="menu"], [role="menubar"], [role="tablist"]`) || e.matches(`[role="menuitem"], [role="tab"], [role="link"], [aria-expanded]`) || e.hasAttribute(`aria-haspopup`) && e.getAttribute(`aria-haspopup`) !== `false` || e.closest(`form`)?.querySelector(`input[type="password"]`))
        return false;
      if (e.matches(`a[href]`))
        try {
          let t2 = new URL(e.getAttribute(`href`), location.href);
          if (t2.origin !== location.origin || t2.pathname !== location.pathname || t2.search !== location.search || t2.hash && t2.hash !== location.hash)
            return false;
        } catch {
          return false;
        }
      let n = `button, a[href], input[type="button"], input[type="submit"], [role="button"], [onclick]`;
      return e.closest(n) && e.closest(n) !== e || e.querySelector(n) ? false : e.matches(n) || getComputedStyle(e).cursor === `pointer`;
    }
    function Qu(e = document, t) {
      let n = (0, __contentScope.z)(e).filter(
        (e2) => (0, __contentScope.Zu)(e2) && (!t || (0, __contentScope.Md)({ ...t, text: void 0 }, e2) === null)
      ), r = (e2) => (0, __contentScope.et)((0, __contentScope.L)(e2), __contentScope.F), i = n.filter(
        (e2) => !(0, __contentScope.R)(e2) && r(e2).length === 0 && e2.getAttribute(`aria-busy`) !== `true` && !__contentScope.Xu.test((0, __contentScope.L)(e2))
      );
      if (i.length === 1) {
        let e2 = i[0];
        return {
          kind: `action`,
          element: e2,
          label: (0, __contentScope.L)(e2).slice(0, 60)
        };
      }
      if (i.length > 1) return { kind: `ambiguous`, count: i.length };
      let a = n.filter((e2) => (0, __contentScope.R)(e2) && r(e2).length > 0);
      return a.length === 1 ? { kind: `already`, words: r(a[0]) } : a.length > 1 ? { kind: `ambiguous`, count: a.length } : { kind: `none` };
    }
    function $u(e) {
      if (e.gesture && e.gesture !== `click` || e.key && ![`Enter`, `Space`].includes(e.key))
        return false;
      let t = /text=(.+)$/i.exec(e.selector.trim())?.[1]?.trim() || e.fingerprint?.text?.trim() || ``;
      return !t || !__contentScope.ct.test(t) ? false : !__contentScope.lt.test(t);
    }
    function md() {
      return Math.max(
        Math.round(window.scrollY || 0),
        Math.round(document.documentElement?.scrollTop || 0),
        Math.round(document.body?.scrollTop || 0)
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
      let r = Date.now() + t, i = Math.max(1, Math.ceil(t / __contentScope.sd) + 1);
      for (let t2 = 0; t2 < i; t2 += 1) {
        let t3 = Date.now();
        await n(), r += Math.max(0, Date.now() - t3);
        let i2 = Math.max(0, r - Date.now()), a = await e(Math.min(i2, __contentScope.sd));
        if (a !== null) return a;
        if (i2 === 0 || Date.now() >= r) return null;
      }
      return null;
    }
    async function yd(e, t, n, r, i, a, o, s) {
      let c = 0, l = () => Date.now() - c, u = s ? async () => {
        let e2 = Date.now();
        try {
          await s();
        } finally {
          c += Math.max(0, Date.now() - e2);
        }
      } : void 0, d = async (t2) => a ? (t2 <= 0 && await u?.(), (t2 > 0 ? await (0, __contentScope.vd)((t3) => (0, __contentScope.k)(e, t3), t2, u) : (0, __contentScope.D)(e)) ? (0, __contentScope.Id)(e, a, i) : null) : (0, __contentScope.vd)((t3) => (0, __contentScope.k)(e, t3), t2, u), f2 = (t2 = false) => {
        if (a) {
          let n2 = (0, __contentScope.qd)(e, a, i, t2);
          if (n2)
            return __contentScope.pd.set(n2, {
              fingerprint: a,
              textMatch: (0, __contentScope.Hd)(a).strong.length ? `tolerant` : `exact`
            }), n2;
        }
        return o?.locate() ?? null;
      }, p = !!a || !!o, m = await d(p ? 0 : n ? Math.min(t, __contentScope.ud) : t);
      if (m) return m;
      let h = f2();
      if (h || o?.stop()) return h;
      if (!n && p && t > 0) {
        let e2 = l() + t, n2 = Math.ceil(t / __contentScope.ud);
        for (let t2 = 0; t2 < n2 && l() < e2; t2 += 1) {
          let t3 = await d(Math.min(__contentScope.ud, Math.max(0, e2 - l())));
          if (t3) return t3;
          let n3 = f2();
          if (n3 || o?.stop()) return n3;
          await (0, __contentScope.w)(Math.min(__contentScope.ud, Math.max(0, e2 - l())));
        }
      }
      return await (0, __contentScope.Sd)(
        e,
        l() + (n ? t : __contentScope.fd),
        r,
        i,
        p ? async (e2) => {
          let t2 = await d(0);
          if (t2) return t2;
          let n2 = f2();
          return n2 || o?.stop() ? n2 : await d(e2) ?? f2();
        } : d,
        o?.stop,
        l
      ) ?? (o?.stop() ? null : f2(true));
    }
    function bd(e) {
      return e !== document.body && e !== document.documentElement && e.scrollHeight > e.clientHeight + 1 && /(auto|scroll|overlay)/.test(getComputedStyle(e).overflowY) && (0, __contentScope.O)(e);
    }
    function xd() {
      return [...document.querySelectorAll(`*`)].filter(__contentScope.bd).sort((e, t) => t.clientHeight * t.clientWidth - e.clientHeight * e.clientWidth).slice(0, 4);
    }
    async function Sd(e, t, n, r, i = (t2) => (0, __contentScope.k)(e, t2), a, o = Date.now) {
      let s = (e2) => ({
        y: () => e2.scrollTop,
        scroll: (t2) => {
          let n2 = Math.max(
            1,
            Math.round((e2.clientHeight || e2.getBoundingClientRect().height) * 0.9)
          );
          e2.scrollTop += t2 ? n2 : -n2;
        },
        label: e2 === u ? `学习面板 ${n}` : `页面内滚动面板`
      }), c = () => ({
        y: __contentScope.md,
        scroll: (e2) => e2 ? (0, __contentScope.hd)() : (0, __contentScope.gd)(),
        label: `页面`
      }), l = [], u = null;
      if (n) {
        let e2 = (0, __contentScope.D)(n);
        if (e2 && (0, __contentScope.bd)(e2)) {
          u = e2, e2.scrollIntoView?.({ block: `center`, inline: `center` }), await (0, __contentScope.w)(__contentScope.ld);
          let t2 = await i(0);
          if (t2 || a?.()) return t2;
          l.push(s(e2));
        } else
          r?.push(
            `工作流${e2 ? `学习时的滚动面板已不可滚动` : `未找到学习时的滚动面板`}: ${n}，退回到页面通用滚动查找`
          );
      }
      l.push(
        ...(0, __contentScope.xd)().filter((e2) => e2 !== u).map(s)
      ), l.push(c());
      let d = 0, f2 = /* @__PURE__ */ new Set(), p = async (n2, a2) => {
        if (d >= __contentScope.dd || o() >= t) return null;
        d += 1;
        let s2 = n2.y();
        n2.scroll(a2), await (0, __contentScope.w)(__contentScope.ld);
        let c2 = t - o();
        if (c2 <= 0) return null;
        let l2 = n2.y(), u2 = `${n2.label}|${a2 ? `down` : `up`}`;
        return l2 !== s2 && !f2.has(u2) && (f2.add(u2), r?.push(`工作流滚动${n2.label}${a2 ? `向下` : `向上`}查找 ${e}`)), i(Math.min(c2, __contentScope.ud));
      };
      for (let e2 of [true, false]) {
        let n2 = new Set(l.filter((t2) => e2 || t2.y() > 0));
        for (; n2.size && d < __contentScope.dd && o() < t; )
          for (let r2 of n2) {
            if (d >= __contentScope.dd || o() >= t || a?.()) return null;
            let i2 = r2.y(), s2 = await p(r2, e2);
            if (s2 || a?.()) return s2;
            let c2 = r2.y();
            (e2 ? c2 <= i2 : c2 >= i2) && n2.delete(r2);
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
      if (!e?.length) return false;
      let n = (0, __contentScope.Ed)(), r = e.filter((e2) => e2.trim()).map((e2) => (0, __contentScope.et)(n, [e2.trim()]).length > 0);
      return t === `all` ? r.length > 0 && r.every(Boolean) : r.some(Boolean);
    }
    function Od(e) {
      switch (e.type) {
        case `text`:
          return (0, __contentScope.Dd)(e.words, e.match ?? `any`);
        case `selector`:
          return !!(0, __contentScope.D)(e.selector);
        case `path`: {
          let t = e.pattern.trim(), n = `${location.pathname}${location.hash}`;
          return t.endsWith(`*`) ? n.startsWith(t.slice(0, -1)) : n === t;
        }
      }
    }
    function kd(e, t) {
      return Number.isFinite(e) ? Math.min(__contentScope.nd, Math.max(0, Math.round(e))) : t;
    }
    function Ad(e) {
      let t = { tag: e.tagName.toLowerCase() }, n = e.getAttribute(`aria-label`);
      n && (t.aria = n);
      let r = e.getAttribute(`name`);
      r && (t.name = r);
      let i = e.getAttribute(`data-testid`);
      i && (t.testId = i), e instanceof HTMLInputElement ? t.inputType = e.type : e instanceof HTMLTextAreaElement && (t.inputType = `textarea`);
      let a = e.getAttribute(`role`);
      a && (t.role = a);
      let o = (0, __contentScope.me)(e);
      return o && (t.text = o), t;
    }
    function jd(e) {
      let t = [];
      return e.tag && t.push(`tag=${e.tag}`), e.aria && t.push(`aria="${e.aria}"`), e.name && t.push(`name="${e.name}"`), e.testId && t.push(`testId="${e.testId}"`), e.inputType && t.push(`type=${e.inputType}`), e.role && t.push(`role=${e.role}`), e.text && t.push(`text="${e.text.length > 24 ? `${e.text.slice(0, 24)}…` : e.text}"`), t.length ? t.join(` `) : `(空指纹)`;
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
        let i = e.text.replace(/\s+/g, ` `).trim(), a = (r.text ?? ``).replace(/\s+/g, ` `).trim();
        if (!(n === `checkin` ? (0, __contentScope.Zu)(t) : n === `tolerant` ? (0, __contentScope.Nd)(a, i) : a === i))
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
      return a ? (r?.push(
        `工作流指纹失配: ${n} 命中的元素不符（${a}）；期望 ${(0, __contentScope.jd)(t)}，实际 ${(0, __contentScope.jd)((0, __contentScope.Ad)(e))}`
      ), null) : e;
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
      let i = r[0], a = (0, __contentScope.Md)(t, i);
      return a ? `工作流${n}选择器命中了错误的元素: ${e}（${a}；期望 ${(0, __contentScope.jd)(t)}，实际 ${(0, __contentScope.jd)((0, __contentScope.Ad)(i))}）` : null;
    }
    function Vd(e, t) {
      let n = e[t];
      return typeof n == `string` && n.trim().length > 0;
    }
    function Hd(e) {
      return {
        strong: __contentScope.zd.filter((t) => (0, __contentScope.Vd)(e, t)),
        weak: __contentScope.Bd.filter((t) => (0, __contentScope.Vd)(e, t))
      };
    }
    function Ud(e) {
      let t = new Set(__contentScope.Rd.split(`, `)), n = e.tag?.trim().toLowerCase();
      return n && /^[a-z][a-z0-9-]*$/.test(n) && t.add(n), [...t].join(`, `);
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
        (n2) => (0, __contentScope.O)(n2) && (t.strong.length > 0 || (0, __contentScope.Gd)(n2)) && (0, __contentScope.Md)(e, n2, t.strong.length > 0 ? `tolerant` : `exact`) === null
      );
    }
    function Gd(e) {
      return (0, __contentScope.R)(e) ? false : e.matches(
        `button, a[href], input:not([type="hidden"]), textarea, select, summary, [role="button"], [role="menuitem"], [role="tab"], [role="checkbox"], [role="radio"], [contenteditable=""], [contenteditable="true"], [onclick], [tabindex]:not([tabindex="-1"])`
      ) || getComputedStyle(e).cursor === `pointer`;
    }
    function Kd(e) {
      let t = [e.tagName.toLowerCase()], n = e.getAttribute(`id`);
      n && t.push(`#${n}`);
      let r = e.getAttribute(`data-testid`);
      return r && t.push(`[data-testid="${r}"]`), t.join(``);
    }
    function qd(e, t, n, r = true) {
      let i = (0, __contentScope.Hd)(t);
      if (i.strong.length === 0 && i.weak.length === 0)
        return r && n?.push(
          `工作流原选择器失效（${e}），指纹只有${i.weak.length > 0 ? `文案` : `控件种类`}（${(0, __contentScope.jd)(t)}），无法确认是同一个控件，不做跨选择器回退`
        ), null;
      let a = (0, __contentScope.Wd)(t);
      if (a.length === 1) {
        let r2 = a[0];
        return n?.push(
          `原选择器失效，已按指纹回退到 ${(0, __contentScope.Kd)(r2)}：${e}（${(0, __contentScope.jd)(t)}）`
        ), r2;
      }
      return r && n?.push(
        a.length > 1 ? `工作流原选择器失效（${e}），按指纹回退搜索命中 ${a.length} 个候选、无法确定唯一目标，已放弃` : `工作流原选择器失效（${e}），按指纹回退搜索没有找到匹配元素`
      ), null;
    }
    async function Jd(e, t) {
      let n = (0, __contentScope.kd)(e.timeoutMs, __contentScope.td), r = Date.now() + n, i = typeof e.selector == `string` && e.selector.trim().length > 0, a = Array.isArray(e.text) && e.text.some((e2) => typeof e2 == `string` && e2.trim()), o = Math.ceil(n / 150) + 1;
      for (let n2 = 0; n2 < o && Date.now() <= r; n2 += 1) {
        let n3 = Date.now();
        await t?.(), r += Math.max(0, Date.now() - n3);
        let o2 = i && !!(0, __contentScope.D)(e.selector), s = a && (0, __contentScope.Dd)(e.text);
        if (o2 || s) return true;
        await (0, __contentScope.w)(150);
      }
      return false;
    }
    function Yd(e) {
      try {
        let t = new URL(location.href);
        return t.origin === e.origin && t.pathname === e.pathname && t.search === e.search && t.hash === e.hash;
      } catch {
        return false;
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
      let t = e.checkin?.method === `none` && Array.isArray(e.checkin.workflow?.steps) && e.checkin.workflow.steps.length === 0 && !!e.checkin.workflow.identityPath;
      if (!(0, __contentScope.p)(e) && !t) return null;
      let n = e.checkin?.workflow?.route;
      if (!Array.isArray(n) || n.length === 0) return null;
      let r = n.filter((e2) => typeof e2 == `string` && e2.trim().length > 0).map((e2) => e2.trim());
      if (r.length === 0) return null;
      let i = r.map((t2) => (0, __contentScope.ef)(e, t2));
      return i.some((e2) => !e2) ? null : i;
    }
    function rf(e) {
      return (0, __contentScope.nf)(e) !== null;
    }
    function af(e) {
      let t = (0, __contentScope.nf)(e), n = `${location.pathname}${location.hash}`;
      return t?.some((e2) => e2.origin === location.origin && `${e2.pathname}${e2.hash}` === n) ?? false;
    }
    function of(e) {
      let t = (0, __contentScope.nf)(e);
      if (!t) return false;
      let n = t[t.length - 1], r = `${location.pathname}${location.hash}`;
      return `${n.pathname}${n.hash}` === r;
    }
    function sf(e) {
      let t = (0, __contentScope.nf)(e), n = e.checkin?.workflow?.identityPath;
      if (!t || typeof n != `string` || !n.trim()) return null;
      let r = (0, __contentScope.ef)(e, n);
      if (!r || r.username || r.password || r.search || /(?:access_token|refresh_token|id_token|code|state|token|secret|password)=/i.test(r.hash))
        return null;
      let i = `${r.pathname}${r.hash}`;
      return t.some((e2) => `${e2.pathname}${e2.hash}` === i) ? r.href : null;
    }
    function cf(e) {
      let t = (0, __contentScope.sf)(e);
      if (!t) return false;
      let n = new URL(t);
      return `${n.pathname}${n.hash}` == `${location.pathname}${location.hash}`;
    }
    function lf(e, t, n) {
      if (!Array.isArray(t) || t.length === 0) return null;
      let r = t.filter((e2) => typeof e2 == `string` && e2.trim().length > 0).map((e2) => e2.trim());
      if (r.length === 0) return null;
      let i = r.map((t2) => (0, __contentScope.ef)(e, t2));
      if (i.some((e2) => !e2)) return { status: `failed`, message: `工作流学习路线必须与站点同源` };
      let a = `${location.pathname}${location.hash}`, o = i.findIndex((e2) => `${e2.pathname}${e2.hash}` === a);
      if (o >= 0) {
        let e2 = o + 1;
        if (e2 >= r.length) return null;
        let t2 = i[e2];
        return `${t2.pathname}${t2.hash}` === a ? null : (n.push(`工作流沿学习路线进入 ${t2.pathname}${t2.hash}（第 ${e2 + 1}/${r.length} 页）`), { status: `navigate`, url: t2.href });
      }
      let s = (0, __contentScope.tf)(e), c = i.findIndex((e2) => s === null || `${e2.pathname}${e2.hash}` !== s);
      if (c < 0)
        return n.push(
          `${__contentScope.Xd}当前页 ${a} 不在学习路线上，路线里没有可跳转的业务页，改为在当前页执行工作流步骤`
        ), null;
      let l = i[c], u = `${l.pathname}${l.hash}`;
      return n.push(
        (0, __contentScope.Ju)(a) ? (0, __contentScope.$d)(a, u) : (0, __contentScope.Qd)(a, u)
      ), n.push(`工作流沿学习路线进入 ${l.pathname}${l.hash}（第 ${c + 1}/${r.length} 页）`), { status: `navigate`, url: l.href };
    }
    function uf(e) {
      if (!e || typeof e.isConnected == `boolean` && !e.isConnected) return null;
      let t = e.closest(`form, [role="dialog"], [role="menu"], li, article, section`);
      if (t) return t;
      let n = e.parentElement;
      return !n || n === document.body || n === document.documentElement ? e : n;
    }
    function df(e, t, n) {
      let r = (0, __contentScope.uf)(n);
      if (!r) return { status: `failed`, message: e };
      let i = /(?:^|\/)(?:lottery|draw|prize)(?:\/|$)/i.test(location.pathname) || __contentScope.it.test(n?.textContent ?? ``) ? {
        kind: `already`,
        words: (0, __contentScope.et)(r.textContent ?? ``, __contentScope.rt)
      } : (0, __contentScope.Wu)(r);
      return i.kind === `already` && i.words.length > 0 ? (t.push(`${e}；目标控件附近页面显示今日已完成：${i.words.join(`、`)}，按已完成处理`), {
        status: `already`,
        message: `工作流未能完成点击，但目标控件附近证据显示今日签到已完成`
      }) : { status: `failed`, message: e };
    }
    async function ff(e, t, n, r, i, a = 0, o = []) {
      if (i.steps += 1, i.steps > __contentScope.rd)
        return {
          status: `failed`,
          message: `工作流最多执行 ${__contentScope.rd} 个步骤`
        };
      if (a > __contentScope.id)
        return {
          status: `failed`,
          message: `工作流条件嵌套超过 ${__contentScope.id} 层`
        };
      let s = await r.checkpoint?.({ phase: `before`, step: t });
      if (s) return s;
      if (![`click`, `if`, `leilei-daily`].includes(t.type) && r.beforeAction && !await r.beforeAction())
        return {
          status: `failed`,
          message: `工作流 ${t.type} 步骤前的人机验证未完成`
        };
      let c;
      try {
        c = await (0, __contentScope.pf)(e, t, n, r, i, a, o);
      } catch (e2) {
        if (e2 instanceof __contentScope._d) return e2.result;
        throw e2;
      }
      return c?.status === `navigate` || c?.status === `interrupted` ? c : !c && (t.type === `fill` || t.type === `drag`) && r.afterAction && !await r.afterAction() ? {
        status: `failed`,
        message: `工作流 ${t.type} 步骤后的人机验证未完成`
      } : await r.checkpoint?.({ phase: `after`, step: t }) ?? c;
    }
    async function pf(e, t, n, r, i, a, o) {
      let s = r.checkpoint || r.beforeAction ? async () => {
        let e2 = await r.checkpoint?.({ phase: `waiting`, step: t });
        if (e2) throw new __contentScope._d(e2);
        if (!r.checkpoint && r.beforeAction && (0, __contentScope.Pu)() && !await r.beforeAction())
          throw new __contentScope._d({
            status: `failed`,
            message: `工作流等待期间的人机验证未完成`
          });
      } : void 0;
      switch (t.type) {
        case `if`: {
          let o2 = (0, __contentScope.Od)(t.condition) ? t.then : t.else ?? [];
          if (o2.length === 0) return null;
          for (let [t2, s2] of o2.entries()) {
            if (!(0, __contentScope.wd)(s2))
              return { status: `failed`, message: `工作流条件分支包含无效步骤` };
            if (s2.type === `navigate`)
              return {
                status: `failed`,
                message: `条件分支不能包含 navigate，请把跳转放在工作流第一步`
              };
            let c = await (0, __contentScope.ff)(e, s2, n, r, i, a + 1, o2.slice(t2 + 1));
            if (c) return c;
          }
          return null;
        }
        case `navigate`: {
          if (!t.url?.trim()) return { status: `failed`, message: `工作流跳转步骤缺少 url` };
          let r2;
          try {
            r2 = new URL(t.url, location.href);
          } catch {
            return { status: `failed`, message: `工作流跳转地址无效: ${t.url}` };
          }
          return (0, __contentScope.W)(e, r2.href) ? (0, __contentScope.Yd)(r2) ? null : (n.push(`工作流进入 ${r2.pathname}${r2.search}${r2.hash}`), { status: `navigate`, url: r2.href }) : { status: `failed`, message: `工作流跳转地址必须与站点同源` };
        }
        case `click`: {
          if (!t.selector?.trim())
            return { status: `failed`, message: `工作流点击步骤缺少 selector` };
          let a2 = (0, __contentScope.kd)(t.timeoutMs, __contentScope.ed), o2 = i.pendingScroll;
          delete i.pendingScroll;
          let c = !!t.scrollIntoView || !!o2, l = t.scrollContainer ?? o2?.container, u = !i.routeNext && (0, __contentScope.$u)(t), d = { kind: `none` }, f2 = false, p = u ? {
            locate: () => (d = (0, __contentScope.Qu)(document, t.fingerprint), d.kind === `action` ? (t.fingerprint && __contentScope.pd.set(d.element, {
              fingerprint: t.fingerprint,
              textMatch: `checkin`
            }), f2 = true, n.push(
              `工作流按页面控件快照命中签到动作「${d.label}」，替代失效的选择器 ${t.selector}`
            ), d.element) : null),
            stop: () => d.kind === `already` || d.kind === `ambiguous`
          } : void 0, m = () => {
            if (d.kind === `already`)
              return n.push(`工作流按页面控件快照判定今日已完成，跳过失效的选择器 ${t.selector}`), { status: `already`, message: `页面控件快照显示今日签到已完成` };
            if (d.kind === `ambiguous`) {
              let e2 = `工作流页面控件快照命中 ${d.count} 个签到候选，无法确定唯一目标，已停止`;
              return n.push(e2), { status: `failed`, message: e2 };
            }
            return null;
          }, h = await (0, __contentScope.yd)(t.selector, a2, c, l, n, t.fingerprint, p, s), g = false;
          if (!h) {
            let i2 = m();
            if (i2) return i2;
            if (document.body && [...document.body.querySelectorAll(`body > *`)].some(
              (e2) => e2 !== document.body && getComputedStyle(e2).position === `fixed`
            ) && (await (0, __contentScope.Qt)(e, n, { waitForAppear: false }), h = await (0, __contentScope.yd)(
              t.selector,
              Math.max(1, Math.min(a2, 3e3)),
              c,
              l,
              n,
              t.fingerprint,
              p,
              s
            )), !h && r.beforeAction && (0, __contentScope.Pu)()) {
              n.push(`工作流定位失败后检测到人机验证，完成验证后重试定位`);
              let e2 = Date.now();
              await r.beforeAction() && (g = true, h = await (0, __contentScope.yd)(
                t.selector,
                Math.max(1, a2 - (Date.now() - e2)),
                c,
                l,
                n,
                t.fingerprint,
                p,
                s
              ));
            }
            if (!h)
              return (0, __contentScope.df)(
                (0, __contentScope.Ld)(t.selector, t.fingerprint, `点击`) ?? `工作流找不到可点击元素: ${t.selector}`,
                n,
                null
              );
          }
          if (!g && r.beforeAction && !await r.beforeAction())
            return {
              status: `failed`,
              message: `工作流点击前的人机验证未完成，已停止点击`
            };
          let _ = g || !r.beforeAction ? h : await (0, __contentScope.yd)(t.selector, a2, c, l, n, t.fingerprint, p, s);
          if (!_)
            return m() || (0, __contentScope.df)(
              (0, __contentScope.Ld)(t.selector, t.fingerprint, `点击`) ?? `完成人机验证后工作流找不到可点击元素: ${t.selector}`,
              n,
              h
            );
          if (t.fingerprint && !(0, __contentScope.Fd)(_, t.fingerprint, t.selector, n))
            return {
              status: `failed`,
              message: `工作流点击选择器命中了错误的元素: ${t.selector}（期望 ${(0, __contentScope.jd)(t.fingerprint)}，实际 ${(0, __contentScope.jd)((0, __contentScope.Ad)(_))}）`
            };
          let v = _.isConnected;
          if (await (0, __contentScope.B)(_, e, n, `工作流控件`))
            return {
              status: `failed`,
              message: `工作流点击目标仍被遮挡，可能有未关闭的公告弹窗`
            };
          if (v && !_.isConnected) {
            if (_ = await (0, __contentScope.yd)(t.selector, a2, c, l, n, t.fingerprint, p, s), !_ || t.fingerprint && !(0, __contentScope.Fd)(_, t.fingerprint, t.selector, n))
              return {
                status: `failed`,
                message: `公告处理后无法重新确认工作流控件: ${t.selector}`
              };
            if (await (0, __contentScope.B)(_, e, n, `工作流控件`) || !_.isConnected)
              return {
                status: `failed`,
                message: `公告处理后工作流控件仍不稳定，已停止点击`
              };
          }
          (c || f2 || __contentScope.pd.has(_)) && (_.scrollIntoView({ block: `center`, inline: `center` }), n.push(`工作流将已定位的 ${t.selector} 滚入视口`), await (0, __contentScope.w)(150));
          try {
            i.routeNext && (n.push(`工作流回放中间页点击 ${t.selector}`), await r.beforeNavigate?.());
            let e2 = await r.checkpoint?.({ phase: `action`, step: t });
            if (e2) return e2;
            if (v && !_.isConnected)
              return {
                status: `failed`,
                message: `会话核验期间工作流控件已变化，已停止点击`
              };
            let a3 = await (0, __contentScope.M)(_, {
              mayNavigate: !!i.routeNext,
              ...t.anchor ? { anchor: t.anchor } : {},
              ...t.gesture ? { gesture: t.gesture } : {},
              ...t.key ? { key: t.key } : {},
              ...t.holdMs == null ? {} : { holdMs: t.holdMs }
            }), o3 = t.key ? `用键盘 ${t.key} 触发` : t.gesture === `double` ? `双击` : t.gesture === `right` ? `右键点击` : t.gesture === `long-press` ? `长按` : `点击`, s2 = a3 === `dom` ? `（DOM 合成点击，未使用浏览器可信指针）` : ``;
            n.push(`工作流已${o3} ${t.selector}${s2}`);
          } catch (e2) {
            return (0, __contentScope.df)(
              `工作流点击失败: ${e2 instanceof Error ? e2.message : String(e2)}`,
              n,
              _
            );
          }
          if (i.routeNext && `${location.pathname}${location.hash}` !== i.sourcePath) {
            let e2 = new URL(i.routeNext);
            return location.origin !== e2.origin || `${location.pathname}${location.hash}` != `${e2.pathname}${e2.hash}` ? {
              status: `failed`,
              message: `学习流程点击后离开了预期页面，已停止后续操作`
            } : { status: `navigate`, url: e2.href };
          }
          return r.afterAction && !await r.afterAction({ checkinAction: u }) ? {
            status: `failed`,
            message: i.routeNext ? `中间页点击后的人机验证未完成，已停止后续操作` : `工作流点击后的人机验证未完成，已停止后续步骤`
          } : t.waitFor?.trim() && !await (0, __contentScope.vd)((e2) => (0, __contentScope.k)(t.waitFor, e2), a2, s) ? { status: `failed`, message: `点击后未出现 ${t.waitFor}` } : null;
        }
        case `fill`: {
          if (!t.selector?.trim())
            return { status: `failed`, message: `工作流填充步骤缺少 selector` };
          if (typeof t.value != `string`)
            return { status: `failed`, message: `工作流填充步骤缺少 value` };
          let a2 = (0, __contentScope.kd)(t.timeoutMs, __contentScope.ed), o2 = i.pendingScroll;
          delete i.pendingScroll;
          let c = !!t.scrollIntoView || !!o2, l = await (0, __contentScope.yd)(
            t.selector,
            a2,
            c,
            t.scrollContainer ?? o2?.container,
            n,
            t.fingerprint,
            void 0,
            s
          );
          if (!l)
            return {
              status: `failed`,
              message: (0, __contentScope.Ld)(t.selector, t.fingerprint, `填充`) ?? `工作流找不到可输入元素: ${t.selector}`
            };
          let u = l.isConnected;
          if (await (0, __contentScope.B)(l, e, n, `工作流输入控件`))
            return {
              status: `failed`,
              message: `工作流输入目标仍被公告遮挡，已停止输入`
            };
          if (u && !l.isConnected && (l = await (0, __contentScope.yd)(
            t.selector,
            a2,
            c,
            t.scrollContainer ?? o2?.container,
            n,
            t.fingerprint,
            void 0,
            s
          ), !l || await (0, __contentScope.B)(l, e, n, `工作流输入控件`) || !l.isConnected))
            return {
              status: `failed`,
              message: `公告处理后无法重新确认工作流输入控件: ${t.selector}`
            };
          if (t.fingerprint && !(0, __contentScope.Fd)(l, t.fingerprint, t.selector, n))
            return {
              status: `failed`,
              message: `工作流填充选择器命中了错误的元素: ${t.selector}（期望 ${(0, __contentScope.jd)(t.fingerprint)}，实际 ${(0, __contentScope.jd)((0, __contentScope.Ad)(l))}）`
            };
          (c || __contentScope.pd.has(l)) && typeof l.scrollIntoView == `function` && (l.scrollIntoView({ block: `center`, inline: `center` }), await (0, __contentScope.w)(150));
          let d = await r.checkpoint?.({ phase: `action`, step: t });
          if (d) return d;
          if (u && !l.isConnected)
            return {
              status: `failed`,
              message: `会话核验期间工作流输入控件已变化，已停止输入`
            };
          let f2 = t.control ?? `text`;
          if (f2 === `select`) {
            if (l.tagName !== `SELECT`)
              return {
                status: `failed`,
                message: `工作流填充目标不是下拉框: ${t.selector}`
              };
            let e2 = l, r2 = t.choice;
            if (r2 == null || !Number.isInteger(r2) || r2 < 0 || r2 >= e2.options.length)
              return {
                status: `failed`,
                message: `工作流下拉选项序号无效: ${String(t.choice)}（共 ${e2.options.length} 项）`
              };
            if (e2.selectedIndex === r2)
              return n.push(`工作流下拉框 ${t.selector} 已是第 ${r2} 项，跳过`), null;
            let i2 = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, `value`)?.set, a3 = e2.options[r2].value;
            return i2 ? i2.call(e2, a3) : e2.value = a3, e2.selectedIndex = r2, e2.dispatchEvent(new Event(`input`, { bubbles: true })), e2.dispatchEvent(new Event(`change`, { bubbles: true })), n.push(`工作流已选择 ${t.selector} 第 ${r2} 项`), null;
          }
          if (f2 === `checkbox` || f2 === `radio`) {
            let e2 = l;
            if (l.tagName !== `INPUT` || e2.type !== `checkbox` && e2.type !== `radio`)
              return {
                status: `failed`,
                message: `工作流填充目标不是${f2 === `radio` ? `单选` : `复选`}框: ${t.selector}`
              };
            let r2 = t.checked ?? true;
            return e2.checked === r2 ? (n.push(
              `工作流${f2 === `radio` ? `单选` : `复选`}框 ${t.selector} 已是${r2 ? `选中` : `未选中`}，跳过`
            ), null) : (e2.click(), n.push(`工作流已${r2 ? `勾选` : `取消勾选`} ${t.selector}`), null);
          }
          return (0, __contentScope.Ee)(l) ? ((0, __contentScope.De)(l, (0, __contentScope.Td)(t.value ?? ``, e)), n.push(`工作流已填充 ${t.selector}`), null) : {
            status: `failed`,
            message: `工作流找不到可输入元素: ${t.selector}`
          };
        }
        case `scroll`: {
          let e2 = o.find((e3) => e3.type !== `scroll`);
          if (e2?.type === `click` || e2?.type === `fill`)
            return i.pendingScroll || n.push(`工作流合并录制滚动，先定位后续控件 ${e2.selector}`), i.pendingScroll = {
              container: t.container ?? i.pendingScroll?.container
            }, null;
          let r2 = Number.isFinite(t.ratio) ? Math.min(1, Math.max(0, t.ratio)) : 0, a2 = (0, __contentScope.kd)(t.timeoutMs, __contentScope.ed), c = Date.now() + a2, l = (() => {
            if (t.container) {
              let e3 = (0, __contentScope.D)(t.container), r3 = e3 && (0, __contentScope.bd)(e3), i2 = r3 ? e3 : (0, __contentScope.xd)()[0];
              if (r3 || n.push(
                `工作流学习滚动容器已失效: ${t.container}，${i2 ? `改用当前可滚动面板` : `退回到页面滚动`}`
              ), i2)
                return {
                  label: r3 ? `容器 ${t.container}` : `当前可滚动面板`,
                  top: () => i2.scrollTop,
                  max: () => Math.max(0, i2.scrollHeight - i2.clientHeight),
                  scrollBy: (e4) => {
                    i2.scrollTop += e4;
                  }
                };
            }
            return {
              label: `页面`,
              top: __contentScope.md,
              max: () => Math.max(
                0,
                (document.scrollingElement ?? document.documentElement).scrollHeight - (window.innerHeight || 800)
              ),
              scrollBy: (e3) => e3 > 0 ? (0, __contentScope.hd)() : (0, __contentScope.gd)()
            };
          })(), u = (0, __contentScope.kd)(t.settleMs, 400);
          n.push(`工作流滚动${l.label}到 ${(r2 * 100).toFixed(0)}%`);
          let d = 0;
          for (; d < __contentScope.dd && Date.now() < c; ) {
            d += 1;
            let e3 = Date.now();
            await s?.(), c += Math.max(0, Date.now() - e3);
            let t2 = r2 * l.max(), n2 = l.top(), i2 = t2 - n2;
            if (Math.abs(i2) < 2 || (l.scrollBy(i2), await (0, __contentScope.w)(__contentScope.ld), Math.abs(l.top() - n2) < 1 && Math.abs(t2 - l.top()) >= 2))
              break;
          }
          return await (0, __contentScope.vd)(async (e3) => (await (0, __contentScope.w)(e3), null), u, s), null;
        }
        case `drag`: {
          if (!t.selector?.trim())
            return { status: `failed`, message: `工作流拖拽步骤缺少 selector` };
          if (!t.toSelector?.trim())
            return { status: `failed`, message: `工作流拖拽步骤缺少 toSelector` };
          let e2 = (0, __contentScope.kd)(t.timeoutMs, __contentScope.ed), i2 = await (0, __contentScope.yd)(
            t.selector,
            e2,
            t.scrollIntoView,
            t.scrollContainer,
            n,
            void 0,
            void 0,
            s
          );
          if (!i2) return (0, __contentScope.df)(`工作流找不到拖拽起点: ${t.selector}`, n, null);
          let a2 = await (0, __contentScope.yd)(
            t.toSelector,
            e2,
            t.scrollIntoView,
            t.scrollContainer,
            n,
            void 0,
            void 0,
            s
          );
          if (!a2) return (0, __contentScope.df)(`工作流找不到拖拽终点: ${t.toSelector}`, n, null);
          t.scrollIntoView && typeof i2.scrollIntoView == `function` && (i2.scrollIntoView({ block: `center`, inline: `center` }), await (0, __contentScope.w)(150));
          let o2 = __contentScope.Ue;
          if (typeof o2 != `function`)
            return {
              status: `failed`,
              message: `工作流拖拽原语 realDrag 尚未在 dom-utils 落地，无法回放拖拽 ${t.selector} → ${t.toSelector}`
            };
          try {
            let e3 = await r.checkpoint?.({ phase: `action`, step: t });
            if (e3) return e3;
            await o2(i2, a2, {
              fromAnchor: t.anchor,
              toAnchor: t.toAnchor,
              steps: t.steps
            });
          } catch (e3) {
            return (0, __contentScope.df)(
              `工作流拖拽失败: ${e3 instanceof Error ? e3.message : String(e3)}`,
              n,
              i2
            );
          }
          return n.push(`工作流已拖拽 ${t.selector} 到 ${t.toSelector}`), null;
        }
        case `wait`:
          return t.selector?.trim() && t.ms !== void 0 ? {
            status: `failed`,
            message: `工作流等待步骤只能设置 selector 或 ms 其中一个`
          } : t.selector?.trim() ? await (0, __contentScope.vd)(
            (e2) => (0, __contentScope.k)(t.selector, e2),
            (0, __contentScope.kd)(t.timeoutMs, __contentScope.ed),
            s
          ) ? null : { status: `failed`, message: `工作流等待超时: ${t.selector}` } : (await (0, __contentScope.vd)(
            async (e2) => (await (0, __contentScope.w)(e2), null),
            (0, __contentScope.kd)(t.ms, 500),
            s
          ), null);
        case `assert`: {
          let e2 = typeof t.selector == `string` && t.selector.trim().length > 0, n2 = Array.isArray(t.text) && t.text.some((e3) => typeof e3 == `string` && e3.trim());
          return !e2 && !n2 ? { status: `failed`, message: `工作流断言需要 selector 或 text` } : await (0, __contentScope.Jd)(t, s) ? t.result === `already` ? { status: `already`, message: `工作流确认今日已完成` } : t.result === `success` ? { status: `success`, message: `工作流命中成功证据` } : null : t.optional ? null : { status: `failed`, message: `工作流断言未命中` };
        }
        case `leilei-daily`: {
          let i2 = null, a2 = async (e2) => !i2 && (i2 = await r.checkpoint?.({ phase: e2, step: t }) ?? null, !i2), o2 = await (0, __contentScope.So)(e, n, {
            beforeAction: async () => await a2(`before`) && (!r.beforeAction || await r.beforeAction()),
            beforeDispatch: () => a2(`action`),
            afterAction: async () => (!r.afterAction || await r.afterAction()) && await a2(`after`)
          });
          return i2 ?? o2;
        }
        default:
          return {
            status: `failed`,
            message: `不支持的工作流步骤: ${String(t.type)}`
          };
      }
    }
    async function mf(e, t, n, r = {}) {
      if (!t || !Array.isArray(t.steps) || t.steps.length === 0)
        return { status: `failed`, message: `工作流没有配置任何步骤` };
      if (t.steps.length > __contentScope.rd)
        return {
          status: `failed`,
          message: `工作流最多支持 ${__contentScope.rd} 个步骤`
        };
      let i = (0, __contentScope.lf)(e, t.route, n);
      if (i) {
        if (i.status !== `navigate`) return i;
        let a2 = `${location.pathname}${location.hash}`;
        if (!t.route?.some((t2) => {
          let n2 = (0, __contentScope.ef)(e, t2);
          return n2 && `${n2.pathname}${n2.hash}` === a2;
        }))
          return i;
        let o2 = { steps: 0, sourcePath: a2, routeNext: i.url };
        for (let s of t.steps) {
          if (s.type !== `if` || s.condition.type !== `path` || !(0, __contentScope.Od)(s.condition))
            continue;
          let t2 = await (0, __contentScope.ff)(e, s, n, r, o2);
          if (t2)
            return t2.status === `failed` && `${location.pathname}${location.hash}` === a2 && /找不到|选择器|指纹|命中了错误|已失效/.test(t2.message) ? (n.push(`中间页的动作没能完成（${t2.message}），按学习路线直接进入下一页`), i) : t2;
        }
        return i;
      }
      let a = { steps: 0 };
      for (let [i2, o2] of t.steps.entries()) {
        if (!(0, __contentScope.wd)(o2))
          return { status: `failed`, message: `工作流第 ${i2 + 1} 步格式无效` };
        if (o2.type === `navigate` && i2 !== 0)
          return {
            status: `failed`,
            message: `工作流的 navigate 只能放在第一步`
          };
        let s = await (0, __contentScope.ff)(e, o2, n, r, a, 0, t.steps.slice(i2 + 1));
        if (s) return s;
      }
      let o = Date.now() + __contentScope.ad;
      for (let e2 = 0; e2 < __contentScope.cd; e2 += 1) {
        let e3 = Date.now(), t2 = await r.checkpoint?.({ phase: `result` });
        if (t2) return t2;
        if (o += Math.max(0, Date.now() - e3), r.whileWaitingForResult) {
          let e4 = Date.now(), t3 = await r.whileWaitingForResult();
          if (!t3.resolved)
            return n.push(`签到结果等待期间检测到人机验证，未能完成`), { status: `failed`, message: `签到结果等待期间的人机验证未完成` };
          if (t3.detected) {
            o += Math.max(0, Date.now() - e4);
            let t4 = Date.now(), n2 = await r.checkpoint?.({ phase: `result` });
            if (n2) return n2;
            o += Math.max(0, Date.now() - t4);
          }
        }
        let i2 = (0, __contentScope.Gu)((0, __contentScope.Uu)(), n);
        if (i2.status === `success`) return { status: `success`, message: i2.message };
        if (i2.status === `already`) return { status: `already`, message: i2.message };
        if (Date.now() >= o) return { status: `unknown`, message: i2.message };
        await (0, __contentScope.w)(__contentScope.od);
      }
      return {
        status: `unknown`,
        message: `工作流步骤已执行完，未读到签到结果证据`
      };
    }
    function hf(e) {
      return typeof e == `object` && e && !Array.isArray(e) ? e : null;
    }
    function gf(e) {
      let t = (0, __contentScope.hf)(e.data), n = e.message ?? e.msg ?? t?.message ?? t?.msg;
      return typeof n == `string` ? n : ``;
    }
    function _f(e, t) {
      let n = e.toLowerCase(), r = t.trimStart().slice(0, 512).toLowerCase();
      return n.includes(`text/html`) || n.includes(`application/xhtml+xml`) || /^<!doctype\s+html\b/.test(r) || /^<html\b/.test(r) || /<(?:head|body|form)\b/.test(r);
    }
    function vf(e, t, n, r) {
      if (e === 401 || e === 403)
        return { verdict: `auth-expired`, message: `登录态无效（HTTP ${e}）` };
      if (e === 404 || e === 405)
        return {
          verdict: `unsupported`,
          message: `站点没有这个签到接口（HTTP ${e}）`
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
        return e >= 400 ? { verdict: `unsupported`, message: `接口返回 HTTP ${e}` } : (0, __contentScope.yf)(n, r.already) ? { verdict: `claims-already`, message: `接口提示今日已签到` } : (0, __contentScope.yf)(n, r.success) ? { verdict: `claims-success`, message: `接口返回签到成功` } : {
          verdict: `unreadable`,
          message: `响应不是 JSON 且无可识别文案`
        };
      let a = (0, __contentScope.hf)(i.data), o = (0, __contentScope.gf)(i);
      return e >= 400 || i.success === false || a?.success === false ? (0, __contentScope.yf)(o, r.already) ? { verdict: `claims-already`, message: o || `接口提示今日已签到` } : {
        verdict: `claims-failure`,
        message: o || `接口返回失败（HTTP ${e}）`
      } : i.already === true || a?.already === true ? { verdict: `claims-already`, message: o || `接口提示今日已签到` } : (0, __contentScope.yf)(o, r.already) ? { verdict: `claims-already`, message: o } : i.success === true || a?.success === true || i.code === 0 || i.ret === 1 ? { verdict: `claims-success`, message: o || `接口返回成功标志` } : (0, __contentScope.yf)(o, r.success) ? { verdict: `claims-success`, message: o } : {
        verdict: `unreadable`,
        message: o || `响应缺少可识别的成功或已签到标志`
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
        let e2 = new URL(t.url, n), r = new URL(n);
        return r.origin === e2.origin && (0, __contentScope.Of)(r.pathname) === (0, __contentScope.Of)(e2.pathname) && (!e2.search || r.search === e2.search) && (!e2.hash || r.hash === e2.hash);
      } catch {
        return false;
      }
    }
    function Af(e) {
      return typeof e == `object` && e && !Array.isArray(e) ? e : null;
    }
    function jf(e) {
      let t = (0, __contentScope.Af)(e.data), n = e.message ?? e.msg ?? t?.message ?? t?.msg;
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
      let r = e.checkin, i = r?.method ?? `auto`;
      if (!(0, __contentScope.Df)(i)) {
        let e2 = `未知签到方式: ${String(i)}`;
        return t.push(e2), { status: `failed`, message: e2 };
      }
      let a = i, o = a !== `relogin`, c = a === `button` && !!n.buttonBalanceBefore, l = a === `none` ? n.loginCheckinBalanceBefore : void 0, u = c || !!l, d = o && !u ? await (0, __contentScope.za)(e, t) : null, f2 = c ? n.buttonBalanceBefore : l ?? d;
      c && t.push(`已恢复签到按钮点击前的余额基线，继续核对页面终态`), l && t.push(`已恢复本轮登录前的账号余额基线，开始核对今日总额度增加量`);
      let p = o ? document.body?.innerText ?? `` : ``, m = await (0, __contentScope.Pf)(e, r, a, t, n, f2), h = c && m.status === `already` ? { status: `success`, message: `签到按钮提交后页面显示已完成` } : m;
      c && m.status === `already` && t.push(`签到按钮提交后的新页面已显示完成状态`);
      let g = h.status !== `navigate` && h.status !== `relogin` && h.status !== `interrupted`;
      if (o && g) {
        let i2 = h.status === `already` && !u, o2 = i2 ? 1 : f2 ? h.status === `failed` ? f2.fromVisibleText ? 12 : 8 : f2.fromVisibleText ? 10 : 3 : 3, c2 = null, d2 = { verdict: `unknown` }, m2 = null, g2 = e.adapter?.quotaPerUnit ?? ((0, __contentScope.$r)(e).family === __contentScope.s.NEW_API ? 5e5 : 1);
        for (let t2 = 0; t2 < o2; t2 += 1) {
          await (0, __contentScope.w)(t2 === 0 ? 800 : 1e3);
          let n2 = await (0, __contentScope.za)(e);
          n2 && (c2 = n2);
          let r2 = (0, __contentScope.Oa)(p, document.body?.innerText ?? ``, g2);
          if (r2 != null && (m2 = r2), !f2) {
            if (c2) break;
          } else if (d2 = (0, __contentScope.Wa)(f2, c2 ?? void 0), d2.verdict === `rewarded`) break;
        }
        if (i2) {
          let e2 = (0, __contentScope.Da)(document.body?.innerText ?? ``, g2);
          if (e2 != null)
            d2 = {
              ...d2,
              reward: e2.reward,
              ...e2.symbol ? { rewardSymbol: e2.symbol } : {},
              verdict: `rewarded`,
              source: `checkin-ledger`,
              ...c2 ? { quotaAfter: c2.quota } : {},
              ...c2?.symbol ? { balanceSymbol: c2.symbol } : {}
            }, t.push(
              `页面记录今日签到奖励 ${(0, __contentScope.Kr)(e2.reward, { quotaPerUnit: g2 }, e2.symbol)}（本轮未重复点击）`
            );
          else {
            let e3 = d2.verdict === `unknown` ? `unknown` : (d2.usageDelta ?? 0) > 0 ? `already-used` : `unchanged`;
            d2 = { ...d2, reward: 0, verdict: e3, source: `checkin-ledger` };
          }
        }
        let _ = h.status === `success` || h.status === `failed` && !r?.claimConfirmSelector;
        m2 != null && _ && (d2 = {
          ...d2,
          reward: m2.reward,
          ...m2.symbol ? { rewardSymbol: m2.symbol } : {},
          verdict: `rewarded`,
          source: `visible-reward`,
          ...c2 ? { quotaAfter: c2.quota } : {},
          ...c2?.symbol ? { balanceSymbol: c2.symbol } : {}
        }, t.push(
          `页面显示本次签到奖励 ${(0, __contentScope.Kr)(m2.reward, { quotaPerUnit: g2 }, m2.symbol)}`
        )), _ && (d2 = (0, __contentScope.ja)(d2, { before: p, after: document.body?.innerText ?? `` }, g2));
        let v = (0, __contentScope.Ga)(d2, e.adapter?.quotaPerUnit, (0, __contentScope.$r)(e).family);
        if (v && t.push(v), c2 ? await n.saveBalance?.(c2) : t.push(`未能读到余额，界面上这个账号的余额会显示为未获取`), h.status === `failed` && d2.verdict === `rewarded`) {
          let e2 = d2.source === `visible-reward`;
          return t.push(
            e2 ? `页面结果提示未及时出现，但签到卡奖励文案确认已到账` : `页面结果提示未及时出现，但额度守恒差分确认奖励已到账`
          ), {
            status: `success`,
            message: e2 ? `页面奖励文案确认签到奖励已到账` : `额度差分确认签到奖励已到账`,
            metrics: d2
          };
        }
        return h.status === `unverified` && a === `none` && n.loginHappenedThisRun && l && d2.verdict === `rewarded` ? (t.push(`页面没有签到控件也没有完成文案，但登录前余额差分确认奖励已到账`), {
          status: `success`,
          message: `额度差分确认登录即签到已到账`,
          metrics: d2
        }) : f2 || m2 != null || d2.source === `checkin-ledger` ? { ...h, metrics: d2 } : h;
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
        whileWaitingForResult: r.whileWaitingForCheckinResult
      });
      return i.status === `unknown` ? { status: `failed`, message: i.message } : i;
    }
    async function zf(e, t) {
      if (!e.beforeCheckinClick) return true;
      let n = await e.beforeCheckinClick();
      return n || t.push(__contentScope.Rf), n;
    }
    async function Bf(e) {
      if (!e.whileWaitingForCheckinResult) return { resolved: true, pauseMs: 0 };
      let t = Date.now(), n = await e.whileWaitingForCheckinResult();
      return { resolved: n.resolved, pauseMs: n.detected ? Date.now() - t : 0 };
    }
    function Vf(e, t) {
      let n = t?.buttonSelector ? (0, __contentScope.D)(t.buttonSelector) : null, r = (0, __contentScope.z)().filter((t2) => {
        let n2 = (0, __contentScope.L)(t2);
        return !(0, __contentScope.R)(t2) && (0, __contentScope.Wf)(t2) && !(0, __contentScope.Gf)(t2) && __contentScope.ct.test(n2) && !__contentScope.lt.test(n2) && !(0, __contentScope.I)(n2, e);
      }).sort(
        (e2, t2) => +!(0, __contentScope.vt)(e2) - !(0, __contentScope.vt)(t2) || (0, __contentScope.Kf)(e2) - (0, __contentScope.Kf)(t2) || (0, __contentScope.L)(e2).length - (0, __contentScope.L)(t2).length
      ), i = n && !(0, __contentScope.R)(n) && !(0, __contentScope.I)((0, __contentScope.L)(n), e) ? [n] : [];
      return [.../* @__PURE__ */ new Set([...i, ...r])];
    }
    function Hf(e) {
      return (0, __contentScope.z)().find(
        (t) => (0, __contentScope.R)(t) && (0, __contentScope.I)((0, __contentScope.L)(t), e)
      ) ?? null;
    }
    function Uf(e, t) {
      return (e?.alreadySelector ? (0, __contentScope.D)(e.alreadySelector) : null) ?? (0, __contentScope.Hf)(t);
    }
    function Wf(e) {
      return (0, __contentScope.vt)(e) ? true : e.closest(
        [
          `nav`,
          `aside`,
          `[role="navigation"]`,
          `[role="menu"]`,
          `[role="menubar"]`,
          `[class*="sidebar" i]`,
          `[class*="side-bar" i]`,
          `[class*="sider" i]`,
          `[class*="menu" i]`
        ].join(`, `)
      ) ? false : e.matches(`button, input[type="button"], input[type="submit"], [role="button"]`) || e instanceof HTMLAnchorElement ? true : !e.querySelector(
        [
          `button`,
          `[role="button"]`,
          `input[type="button"]`,
          `input[type="submit"]`,
          `a[href]`,
          `[onclick]`
        ].join(`, `)
      ) && e.children.length <= 2 && (0, __contentScope.L)(e).replace(/\s+/g, ` `).length <= 40;
    }
    function Gf(e) {
      if (!(e instanceof HTMLAnchorElement) || e.getAttribute(`role`)?.toLowerCase() === `button`)
        return false;
      let t = e.getAttribute(`href`)?.trim() ?? ``;
      if (!t || t === `#` || /^javascript:/i.test(t)) return false;
      try {
        let e2 = new URL(t, location.href);
        return e2.protocol === `http:` || e2.protocol === `https:`;
      } catch {
        return false;
      }
    }
    function Kf(e) {
      return e.matches(`button, input[type="button"], input[type="submit"], [role="button"]`) ? 0 : e instanceof HTMLAnchorElement ? 1 : 2;
    }
    function qf(e, t) {
      try {
        let n = new URL(e, location.href), r = new URL(t, location.href);
        return n.origin === r.origin && n.pathname === r.pathname && n.search === r.search && n.hash === r.hash;
      } catch {
        return false;
      }
    }
    function Jf(e) {
      let t = new URL(e, location.href);
      return `${t.pathname}${t.search}${t.hash}`;
    }
    async function Yf(e, t) {
      let n = [...document.querySelectorAll(`[aria-expanded="false"]`)].filter((e2) => (0, __contentScope.O)(e2)).filter((e2) => {
        let t2 = (0, __contentScope.L)(e2).replace(/\s+/g, ` `).trim();
        if (!t2 || t2.length > 40) return false;
        let n2 = t2.toLowerCase();
        return __contentScope.Cf.some((e3) => n2.includes(e3.toLowerCase()));
      });
      if (!n.length) return false;
      let r = /* @__PURE__ */ new Set(), i = n.filter((e2) => {
        let t2 = (0, __contentScope.L)(e2).replace(/\s+/g, ` `).trim();
        return !r.has(t2) && (r.add(t2), true);
      }), a = 0;
      for (let n2 of i.slice(0, __contentScope.wf)) {
        if (n2.getAttribute(`aria-expanded`) !== `false`) continue;
        let r2 = (0, __contentScope.L)(n2).replace(/\s+/g, ` `).trim();
        if (!await (0, __contentScope.B)(n2, e, t, `折叠面板「${r2}」`)) {
          try {
            await (0, __contentScope.M)(n2);
          } catch {
            continue;
          }
          t.push(`已展开折叠的签到面板「${r2}」`), a += 1, await (0, __contentScope.w)(400);
        }
      }
      return a > 0;
    }
    async function Xf(e, t, n) {
      let r = Date.now() + n, i = !!t?.claimConfirmSelector?.trim();
      for (; ; ) {
        if (i && (0, __contentScope.sp)(t)) return { claim: true };
        let n2 = (0, __contentScope.Uf)(t, e);
        if (n2 && (!i || Date.now() >= r)) return { already: true };
        let a = (0, __contentScope.Vf)(e, t);
        if (t?.buttonSelector) {
          let n3 = (0, __contentScope.D)(t.buttonSelector);
          if (n3 && !(0, __contentScope.R)(n3) && !(0, __contentScope.I)((0, __contentScope.L)(n3), e))
            return { buttons: [n3] };
        } else if (a.length) return { buttons: a };
        if (Date.now() >= r) return n2 ? { already: true } : null;
        await (0, __contentScope.w)(__contentScope.Tf);
      }
    }
    function Zf(e) {
      return [...document.querySelectorAll(`a[href]`)].filter((e2) => (0, __contentScope.dt)(e2)).map((e2) => {
        try {
          return { anchor: e2, target: new URL(e2.href, location.href) };
        } catch {
          return null;
        }
      }).filter((e2) => !!e2).filter(
        ({ anchor: t, target: n }) => (0, __contentScope.W)(e, n.href) && (__contentScope.st.test(n.pathname) || __contentScope.ct.test(t.innerText.trim()))
      ).sort(
        (e2, t) => +!__contentScope.st.test(e2.target.pathname) - !__contentScope.st.test(t.target.pathname) || e2.anchor.innerText.length - t.anchor.innerText.length
      )[0]?.anchor ?? null;
    }
    async function Qf(e, t, n, r) {
      if (!await (0, __contentScope.zf)(r, n))
        return { status: `failed`, message: __contentScope.Rf };
      let i = t?.alreadyText?.length ? t.alreadyText : __contentScope.F;
      if ((0, __contentScope.Uf)(t, i)) {
        if (t?.claimConfirmSelector) {
          let a2 = await (0, __contentScope.Xf)(i, t, __contentScope.rp);
          if (a2 && `claim` in a2) return (0, __contentScope.lp)(null, e, t, n, r, true);
        }
        return { status: `already`, message: `完成人机验证后页面显示今日已签到` };
      }
      let a = t?.buttonSelector ? await (0, __contentScope.Xf)(i, t, __contentScope.xf) : null;
      if (a && `claim` in a) return (0, __contentScope.lp)(null, e, t, n, r, true);
      if (a && `already` in a)
        return { status: `already`, message: `完成人机验证后页面显示今日已签到` };
      let o = a && `buttons` in a ? a.buttons : t?.buttonSelector ? [] : (0, __contentScope.Vf)(i, t);
      if (o.length === 0)
        return {
          status: `failed`,
          message: t?.buttonSelector ? `完成人机验证后未找到配置的签到按钮: ${t.buttonSelector}` : `完成人机验证后未找到可点击的签到按钮`
        };
      let s = null;
      for (let i2 of o.slice(0, 3)) {
        let a2 = await (0, __contentScope.lp)(i2, e, t, n, r);
        if (a2.status !== `blocked`) return a2;
        s = a2.message;
      }
      return {
        status: `failed`,
        message: s ?? `签到按钮被遮挡，可能有未关闭的公告弹窗`
      };
    }
    function ap(e) {
      let t = e.getAttribute(`data-disabled`), n = e.getAttribute(`data-state`);
      return (0, __contentScope.R)(e) || t != null && t !== `false` || n === `disabled` || e.getAttribute(`aria-busy`) === `true` || window.getComputedStyle(e).pointerEvents === `none`;
    }
    function op(e) {
      let t = (0, __contentScope.L)(e).replace(/\s+/g, ``);
      if ((0, __contentScope.I)(t, __contentScope.$f)) return true;
      let n = (0, __contentScope.vt)(e), r = n?.innerText ?? n?.textContent ?? ``;
      return !!n && __contentScope.tp.test(r) && __contentScope.np.test(t);
    }
    function sp(e, t) {
      let n = e?.claimConfirmSelector ? (0, __contentScope.D)(e.claimConfirmSelector) : null, r = e?.claimConfirmSelector ? n ? [n] : [] : (0, __contentScope.z)();
      for (let e2 of r)
        if ((0, __contentScope.dt)(e2) && (e2 === n || (0, __contentScope.op)(e2)) && !(e2 !== n && t && (0, __contentScope.L)(e2) === t.text && (0, __contentScope.vt)(e2) === t.modal))
          return { control: e2, pending: (0, __contentScope.ap)(e2) };
      return null;
    }
    function cp(e, t, n) {
      return (0, __contentScope.I)(e, n) && !(0, __contentScope.I)(t, n);
    }
    async function lp(e, t, n, r, i, a = false) {
      let o = n?.alreadyText?.length ? n.alreadyText : __contentScope.F, s = n?.successText?.length ? n.successText : __contentScope.tt, c = document.body?.innerText ?? ``, l = (0, __contentScope.I)(c, s), u = (0, __contentScope.I)(c, o), d = !!(n?.successSelector && (0, __contentScope.D)(n.successSelector)), f2 = !!(n?.alreadySelector && (0, __contentScope.D)(n.alreadySelector)), p = !a && e ? { text: (0, __contentScope.L)(e), modal: (0, __contentScope.vt)(e) } : void 0;
      if (a) r.push(`检测到上次主签到后尚待领取奖励，恢复二次确认流程`);
      else {
        if (!e) return { status: `failed`, message: `未找到可点击的主签到按钮` };
        let n2 = await (0, __contentScope.B)(e, t, r);
        if (n2)
          return {
            status: `blocked`,
            message: `签到按钮被${(0, __contentScope.N)(n2)}遮挡，可能有未关闭的公告弹窗`
          };
        let a2 = (0, __contentScope.L)(e).slice(0, 30);
        if (await (0, __contentScope.M)(e, { mayNavigate: true }), r.push(`已点击自动识别的签到按钮「${a2}」`), i.afterCheckinClick && !await i.afterCheckinClick())
          return { status: `failed`, message: `签到点击后的人机验证未完成` };
      }
      let m = 0, h = Date.now(), g = h + 22e3, _ = h + __contentScope.rp, v = !!n?.claimConfirmSelector?.trim(), y = /* @__PURE__ */ new WeakSet(), b = a, x = false, S = null, C = c, ee = false, te = false, ne = null;
      for (; Date.now() < g; ) {
        await (0, __contentScope.w)(400);
        let a2 = await (0, __contentScope.Bf)(i);
        if (!a2.resolved) return { status: `failed`, message: `签到点击后的人机验证未完成` };
        g += a2.pauseMs, _ += a2.pauseMs;
        let c2 = document.body?.innerText ?? ``;
        S = (0, __contentScope.ot)(c2) ?? S;
        let h2 = (0, __contentScope.sp)(n, p);
        if (h2 && (b = true, !y.has(h2.control) && m < 5 && (!v || m === 0))) {
          if (h2.pending) {
            x ||= (r.push(`已出现二次确认按钮，等待「领取奖励」解锁`), true);
            continue;
          }
          if (!await (0, __contentScope.zf)(i, r))
            return { status: `failed`, message: __contentScope.Rf };
          let e2 = (0, __contentScope.sp)(n, p);
          if (!e2 || e2.pending || y.has(e2.control) || v && m > 0) continue;
          let a3 = (0, __contentScope.L)(e2.control).slice(0, 20);
          C = document.body?.innerText ?? ``, ee = !!(0, __contentScope.Hf)(o), te = !!(n?.alreadySelector && (0, __contentScope.D)(n.alreadySelector));
          let s2 = await (0, __contentScope.B)(e2.control, t, r, `二次确认按钮`);
          if (s2) {
            r.push(`二次确认按钮被${(0, __contentScope.N)(s2)}遮挡，稍后重新定位`);
            continue;
          }
          try {
            await (0, __contentScope.M)(e2.control);
          } catch (e3) {
            r.push(
              `二次确认按钮点击未获浏览器确认，将重新定位后重试：${e3 instanceof Error ? e3.message : String(e3)}`
            );
            continue;
          }
          y.add(e2.control), m += 1, r.push(`已点击二次确认按钮「${a3}」（第 ${m} 次）`);
          let c3 = Date.now();
          if (i.afterCheckinClick && !await i.afterCheckinClick())
            return {
              status: `failed`,
              message: `领取奖励点击后的人机验证未完成`
            };
          let l2 = Date.now() - c3;
          g += l2, _ += l2, await (0, __contentScope.w)(3200);
          continue;
        }
        let re = (0, __contentScope.Hf)(o), ie = n?.alreadySelector ? (0, __contentScope.D)(n.alreadySelector) : null;
        if (m > 0) {
          if ((0, __contentScope.cp)(c2, C, __contentScope.ep))
            return { status: `success`, message: `页面出现领取奖励成功提示` };
          if (!ee && re || !te && ie)
            return {
              status: `success`,
              message: `领取后页面新出现今日已签到状态`
            };
          continue;
        }
        if (b) continue;
        let T = null;
        if (!l && (0, __contentScope.I)(c2, s) ? T = { status: `success`, message: `页面出现签到成功提示` } : !u && (0, __contentScope.I)(c2, o) ? T = { status: `success`, message: `点击后页面显示今日已签到` } : e && document.contains(e) && (0, __contentScope.R)(e) && (0, __contentScope.I)((0, __contentScope.L)(e), o) ? T = { status: `success`, message: `签到按钮已变为今日已签到` } : re ? T = {
          status: `success`,
          message: `签到按钮已替换为今日已签到状态`
        } : !d && n?.successSelector && (0, __contentScope.D)(n.successSelector) ? T = { status: `success`, message: `命中签到成功标志` } : !f2 && ie && (T = {
          status: `success`,
          message: `点击后命中今日已签到标志`
        }), T) {
          if (ne = T, !v && Date.now() >= _) return T;
        } else if (!v && ne && Date.now() >= _) return ne;
      }
      return m > 0 ? {
        status: `failed`,
        message: `已点击 ${m} 次「领取奖励」，待余额差分确认结果`
      } : b ? {
        status: `failed`,
        message: `已发现「领取奖励」，但等待期内始终未完成有效点击`
      } : v ? {
        status: `failed`,
        message: `未等到站点必需的「领取奖励」二次确认`
      } : ne || (S ? { status: `failed`, message: `站点确认签到失败：${S}` } : {
        status: `failed`,
        message: `点击自动识别的签到按钮后缺少明确结果`
      });
    }
    async function up(e, t, n, r, i, a) {
      let o = t?.alreadyText?.length ? t.alreadyText : __contentScope.F, s = t?.successText?.length ? t.successText : __contentScope.tt, c = (0, __contentScope.Uf)(t, o);
      if (c) {
        if (t?.claimConfirmSelector) {
          n.push(`页面已显示主签到完成，短暂检查是否还有待领取奖励`);
          let r2 = await (0, __contentScope.Xf)(o, t, __contentScope.rp);
          if (r2 && `claim` in r2) return (0, __contentScope.lp)(null, e, t, n, a, true);
        }
        return n.push(`自动识别到已签到状态「${(0, __contentScope.L)(c).slice(0, 30)}」`), { status: `already`, message: `页面显示今日已签到` };
      }
      let l = location.pathname, u = (0, __contentScope.ti)(e, l, document.title), d = __contentScope.st.test(l) || __contentScope.ip.test(document.title) || u;
      if (d && n.push(`已在签到页 ${l}，等待签到组件渲染（最多 ${__contentScope.bf / 1e3} 秒）…`), !await (0, __contentScope.zf)(a, n))
        return { status: `failed`, message: __contentScope.Rf };
      let f2 = await (0, __contentScope.Xf)(o, t, d ? __contentScope.bf : __contentScope.xf);
      if (!f2 && await (0, __contentScope.Yf)(e, n) && (f2 = await (0, __contentScope.Xf)(o, t, __contentScope.Sf)), f2 && `already` in f2)
        return n.push(`等待期间出现已签到状态`), { status: `already`, message: `页面显示今日已签到` };
      if (f2 && `claim` in f2) return (0, __contentScope.lp)(null, e, t, n, a, true);
      if (f2) return (0, __contentScope.Qf)(e, t, n, a);
      if (d && (0, __contentScope.I)(document.body?.innerText ?? ``, o))
        return n.push(`未找到可点签到控件，页面正文显示今日已签到`), { status: `already`, message: `页面显示今日已签到` };
      if (r) {
        if (!i) {
          let e3 = `当前页没有签到控件，且本轮没有发生登录动作：无法确认「登录即签到」已完成`;
          return n.push(e3), { status: `unverified`, message: e3 };
        }
        let e2 = document.body?.innerText ?? ``;
        if ((0, __contentScope.I)(e2, s) || (0, __contentScope.I)(e2, o))
          return n.push(`当前页没有签到控件，但页面正文明确显示签到完成，按「登录即签到」确认成功`), { status: `success`, message: `登录即签到` };
        let t2 = `当前页没有签到控件，且没有余额入账或页面证据可确认「登录即签到」，无法确认本次签到`;
        return n.push(t2), { status: `unverified`, message: t2 };
      }
      let p = (0, __contentScope.Zf)(e);
      if (p) {
        let e2 = new URL(p.href, location.href).href;
        if (!(0, __contentScope.qf)(e2, location.href))
          return n.push(`自动发现签到页 ${(0, __contentScope.Jf)(e2)}，准备跳转`), { status: `navigate`, url: e2 };
      }
      if (t?.url && (0, __contentScope.W)(e, t.url)) {
        let e2 = new URL(t.url, location.href).href;
        if (!(0, __contentScope.qf)(e2, location.href))
          return n.push(`按站点配置的签到页 ${(0, __contentScope.Jf)(e2)} 跳转`), { status: `navigate`, url: e2 };
      }
      let m = (0, __contentScope.ei)(e);
      if (m && !d && (0, __contentScope.W)(e, m)) {
        let e2 = new URL(m, location.href).href;
        if (new URL(e2).pathname !== l)
          return n.push(`按站点适配器进入默认签到页 ${(0, __contentScope.Jf)(e2)}`), { status: `navigate`, url: e2 };
      }
      let h = (0, __contentScope.z)().map((e2) => (0, __contentScope.L)(e2).replace(/\s+/g, ` `).trim()).filter((e2) => e2 && e2.length <= 20), g = [...new Set(h)].slice(0, 8);
      return g.length ? n.push(`页面可点元素：${g.join(` / `)}`) : n.push(`页面上没有可点元素，可能仍在加载或需要先展开某个面板`), {
        status: `failed`,
        message: d ? `签到页未找到明确按钮或已签到状态` : `未自动发现同源签到入口`
      };
    }
    async function dp(e, t, n, r) {
      let i = await (0, __contentScope.za)(e, n);
      if (i ? (r.saveReloginBalanceBefore ? await r.saveReloginBalanceBefore(i) : await r.saveBalance?.(i), n.push(`已记录退出前余额，第二次登录后将按差额核对奖励`)) : n.push(`退出前未能读取余额，第二次登录仍会刷新余额，但无法计算本次差额`), t.logoutApiUrl) {
        if (!(0, __contentScope.W)(e, t.logoutApiUrl))
          return {
            status: `failed`,
            message: `退出接口不是本站地址，已拒绝请求`
          };
        let r2 = new URL(t.logoutApiUrl, location.href).href;
        n.push(`请求退出接口 ${r2}`);
        try {
          let e2 = {};
          t.localStorageToken && Object.assign(e2, (0, __contentScope.pp)(t.localStorageToken));
          let i2 = await fetch(r2, {
            method: `GET`,
            credentials: `include`,
            headers: e2,
            redirect: `error`
          }), a2 = (0, __contentScope.Mf)((await i2.text()).slice(0, 2e3)), o2 = a2 ? (0, __contentScope.Af)(a2.data) : null, s = a2 ? (0, __contentScope.jf)(a2) : ``;
          if (!i2.ok) return { status: `failed`, message: `退出接口返回 HTTP ${i2.status}` };
          if (a2?.success === false || o2?.success === false)
            return { status: `failed`, message: s || `退出接口明确返回失败` };
          n.push(`退出接口调用成功`);
        } catch (e2) {
          return {
            status: `failed`,
            message: `退出接口失败: ${e2 instanceof Error ? e2.message : String(e2)}`
          };
        }
        return (0, __contentScope.fp)(t, n), { status: `relogin`, url: e.loginUrl, message: `已退出，准备重新登录` };
      }
      if (t.logoutMenuSelector) {
        if (await (0, __contentScope.k)(t.logoutMenuSelector, 8e3)) {
          if (!await (0, __contentScope.zf)(r, n))
            return { status: `failed`, message: __contentScope.Rf };
          let i2 = await (0, __contentScope.k)(t.logoutMenuSelector, 8e3);
          if (!i2) return { status: `failed`, message: `完成人机验证后找不到用户菜单` };
          let a2 = await (0, __contentScope.B)(i2, e, n, `用户菜单`);
          if (a2)
            return {
              status: `failed`,
              message: `用户菜单被${(0, __contentScope.N)(a2)}遮挡，无法切换账号`
            };
          await (0, __contentScope.M)(i2), n.push(`已展开用户菜单`), await (0, __contentScope.w)(600);
        } else n.push(`未找到用户菜单: ${t.logoutMenuSelector}`);
      }
      if (!t.logoutSelector)
        return {
          status: `failed`,
          message: `relogin 方式需要配置退出按钮选择器或退出接口`
        };
      if (!await (0, __contentScope.k)(t.logoutSelector, 8e3))
        return {
          status: `failed`,
          message: `找不到退出按钮: ${t.logoutSelector}`
        };
      if (!await (0, __contentScope.zf)(r, n))
        return { status: `failed`, message: __contentScope.Rf };
      let a = await (0, __contentScope.k)(t.logoutSelector, 8e3);
      if (!a)
        return {
          status: `failed`,
          message: `完成人机验证后找不到退出按钮: ${t.logoutSelector}`
        };
      let o = await (0, __contentScope.B)(a, e, n, `退出登录按钮`);
      return o ? {
        status: `failed`,
        message: `退出登录按钮被${(0, __contentScope.N)(o)}遮挡，无法切换账号`
      } : (n.push(`准备点击退出登录（站点可能立即跳转）`), await r.saveReloginStage?.(), await (0, __contentScope.M)(a, { mayNavigate: true }), n.push(`已点击退出登录`), await (0, __contentScope.w)(1200), (0, __contentScope.fp)(t, n), {
        status: `relogin`,
        url: e.loginUrl,
        message: `已退出，准备重新登录`
      });
    }
    function fp(e, t) {
      let n = new Set(e.logoutStorageKeys ?? []);
      if (e.localStorageToken) {
        let t2 = e.localStorageToken.indexOf(`=`), r2 = t2 >= 0 ? e.localStorageToken.slice(t2 + 1).trim() : ``, i = r2.search(/\s/);
        i > 0 && (r2 = r2.slice(i + 1).trim());
        let a = r2.split(`.`)[0]?.trim();
        a && n.add(a);
      }
      let r = 0;
      for (let e2 of n) localStorage.getItem(e2) != null && (localStorage.removeItem(e2), r++);
      r && t.push(`已清除 ${r} 项本地登录态`);
    }
    function pp(e) {
      try {
        let t = e.indexOf(`=`);
        if (t <= 0) return {};
        let n = e.slice(0, t).trim(), r = e.slice(t + 1).trim();
        if (!n || !r) return {};
        let i = ``, a = r.search(/\s/);
        if (a > 0) {
          if (i = `${r.slice(0, a).trim()} `, r = r.slice(a + 1).trim(), !r) return {};
        } else if (/\s$/.test(e)) return {};
        let o = r.indexOf(`.`), s = o === -1 ? r : r.slice(0, o), c = o === -1 ? `` : r.slice(o + 1), l = localStorage.getItem(s);
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
      let r = new URL(t.apiUrl, location.href).href, i = t.apiMethod ?? `POST`;
      n.push(`请求签到接口 ${i} ${r}`);
      let a = t.apiBody ? { "Content-Type": `application/json` } : {};
      if (t.localStorageToken) {
        let e2 = (0, __contentScope.pp)(t.localStorageToken);
        Object.assign(a, e2);
        let r2 = Object.keys(e2);
        n.push(
          r2.length ? `已附加请求头 ${r2.join(`, `)}` : `未能从 localStorage 读到 token（${t.localStorageToken}）`
        );
      }
      try {
        let e2 = await fetch(r, {
          method: i,
          credentials: `include`,
          headers: a,
          body: i === `GET` ? void 0 : t.apiBody ?? void 0,
          redirect: `error`
        }), o = (await e2.text()).slice(0, 2e3);
        n.push(`签到接口返回 HTTP ${e2.status}`);
        let s = (0, __contentScope.vf)(e2.status, e2.headers.get(`content-type`) ?? ``, o, {
          success: t.successText?.length ? t.successText : __contentScope.tt,
          already: t.alreadyText?.length ? t.alreadyText : __contentScope.F
        });
        return s.verdict === `claims-success` ? { status: `success`, message: s.message } : s.verdict === `claims-already` ? { status: `already`, message: s.message } : { status: `failed`, message: s.message };
      } catch (e2) {
        return {
          status: `failed`,
          message: `签到请求失败: ${e2 instanceof Error ? e2.message : String(e2)}`
        };
      }
    }
    async function hp(e, t, n) {
      let r = Date.now() + __contentScope.bf, i = null, a = false;
      for (; ; ) {
        let o = (0, __contentScope.D)(e);
        if (o) {
          if (i = o, !(0, __contentScope.R)(o) || (0, __contentScope.I)((o.innerText || o.textContent || ``).trim(), t))
            return { button: o };
          a ||= (n.push(`签到按钮当前不可点，等待站点加载签到状态…`), true);
        }
        if (Date.now() >= r) return { button: i };
        await (0, __contentScope.w)(__contentScope.Tf);
      }
    }
    async function gp(e, t, n, r, i) {
      if (!t.buttonSelector)
        return {
          status: `failed`,
          message: `签到方式为 button 但未填按钮选择器`
        };
      if (t.url) {
        if (!(0, __contentScope.W)(e, t.url))
          return {
            status: `failed`,
            message: `签到页面不是本站地址，已停止跳转`
          };
        let r2 = new URL(t.url, location.href).href;
        if (!(t.entry?.readySelector && (0, __contentScope.D)(t.entry.readySelector)) && !(0, __contentScope.kf)(e, t))
          return n.push(`签到页在 ${r2}，准备跳转`), { status: `navigate`, url: r2 };
      }
      let a = t.alreadySelector;
      if (a && (0, __contentScope.D)(a))
        return n.push(`命中「已签到」标志，本次不重复点击`), { status: `already`, message: `页面显示今日已签到` };
      let o = t.alreadyText?.length ? t.alreadyText : __contentScope.F, s = t.successText?.length ? t.successText : __contentScope.tt;
      if (!await (0, __contentScope.zf)(r, n))
        return { status: `failed`, message: __contentScope.Rf };
      let c = await (0, __contentScope.hp)(t.buttonSelector, o, n);
      if (!c.button)
        return (0, __contentScope.I)(document.body?.innerText ?? ``, o) ? (n.push(`未找到签到按钮，但页面文本显示已签到`), { status: `already`, message: `页面文本显示今日已签到` }) : { status: `failed`, message: `找不到签到按钮: ${t.buttonSelector}` };
      if (!await (0, __contentScope.zf)(r, n))
        return { status: `failed`, message: __contentScope.Rf };
      let l = r.beforeCheckinClick ? await (0, __contentScope.hp)(t.buttonSelector, o, n) : c;
      if (!l.button)
        return a && (0, __contentScope.D)(a) || (0, __contentScope.I)(document.body?.innerText ?? ``, o) ? { status: `already`, message: `完成人机验证后页面显示今日已签到` } : {
          status: `failed`,
          message: `完成人机验证后找不到签到按钮: ${t.buttonSelector}`
        };
      let u = l.button, d = document.body?.innerText ?? ``;
      if ((0, __contentScope.R)(u))
        return (0, __contentScope.I)((u.innerText || u.textContent || ``).trim(), o) || (0, __contentScope.I)(d, o) ? (n.push(`签到按钮处于禁用态，且页面有明确已签到文案`), { status: `already`, message: `页面显示今日已签到` }) : {
          status: `failed`,
          message: `签到按钮已禁用，但没有明确的已签到标志`
        };
      let f2 = (0, __contentScope.I)(d, s), p = (0, __contentScope.I)(d, o), m = t.successSelector ? !!(0, __contentScope.D)(t.successSelector) : false, h = await (0, __contentScope.B)(u, e, n);
      if (h)
        return {
          status: `failed`,
          message: `签到按钮被${(0, __contentScope.N)(h)}遮挡，可能有未关闭的公告弹窗`
        };
      if (i && r.saveButtonBalanceBefore && (await r.saveButtonBalanceBefore(i), n.push(`已保存签到按钮点击前的余额基线`)), await (0, __contentScope.M)(u, {
        mayNavigate: true,
        reconcileAfterLostResponse: true
      }), n.push(`已点击签到按钮`), r.afterCheckinClick && !await r.afterCheckinClick())
        return { status: `failed`, message: `签到点击后的安全验证未完成` };
      let g = !!t.successSelector && !m, _ = Date.now() + (g ? 18e3 : 8e3), v = null;
      for (; Date.now() < _; ) {
        await (0, __contentScope.w)(400);
        let e2 = await (0, __contentScope.Bf)(r);
        if (!e2.resolved) return { status: `failed`, message: `签到点击后的安全验证未完成` };
        _ += e2.pauseMs;
        let n2 = document.body?.innerText ?? ``;
        if (v = (0, __contentScope.ot)(n2) ?? v, g && t.successSelector && (0, __contentScope.D)(t.successSelector))
          return { status: `success`, message: `命中签到成功标志` };
        if (!f2 && (0, __contentScope.I)(n2, s))
          return { status: `success`, message: `页面出现签到成功提示` };
        if (!p && (0, __contentScope.I)(n2, o))
          return { status: `success`, message: `点击后页面提示今日已签到` };
        if (a && (0, __contentScope.D)(a))
          return { status: `success`, message: `点击后出现已签到状态` };
      }
      return v ? { status: `failed`, message: `站点确认签到失败：${v}` } : { status: `failed`, message: `点击签到后未检测到明确结果，请手动确认` };
    }
    async function vp(e, t, n, r) {
      if (!t.claimEntrySelector)
        return {
          status: `failed`,
          message: `签到方式为 claim 但未填领取入口选择器`
        };
      if (!t.claimInputSelector)
        return {
          status: `failed`,
          message: `签到方式为 claim 但未填输入框选择器`
        };
      if (!t.claimSubmitSelector)
        return {
          status: `failed`,
          message: `签到方式为 claim 但未填提交按钮选择器`
        };
      if (t.url) {
        if (!(0, __contentScope.W)(e, t.url))
          return {
            status: `failed`,
            message: `领取页面不是本站地址，已停止跳转`
          };
        let r2 = new URL(t.url, location.href).href, i2 = new URL(location.href), a2 = new URL(r2);
        if (!(a2.hash ? i2.origin === a2.origin && i2.pathname === a2.pathname && i2.search === a2.search && i2.hash === a2.hash : i2.href.replace(/#.*$/, ``).startsWith(a2.href.replace(/#.*$/, ``))))
          return n.push(`领取入口在 ${r2}，准备跳转`), { status: `navigate`, url: r2 };
      }
      let i = t.alreadyText?.length ? t.alreadyText : __contentScope.F, a = t.successText?.length ? t.successText : __contentScope.tt, o = (e2) => /已过期|expired/i.test(e2);
      if (t.alreadySelector && (0, __contentScope.D)(t.alreadySelector))
        return n.push(`命中「已领取」标志`), { status: `already`, message: `页面显示权益已领取` };
      let s = document.body?.innerText ?? ``;
      if ((0, __contentScope.I)(s, i))
        return n.push(`页面正文显示权益已领取`), { status: `already`, message: `页面显示权益已领取` };
      if (!o(s) && (0, __contentScope.I)(s, a))
        return n.push(`页面正文显示权益已生效，无需重复领取`), { status: `already`, message: `页面显示权益已生效` };
      o(s) && n.push(`套餐仍显示已过期，不能按“已领取”文案判定成功`);
      let c = (0, __contentScope.D)(t.claimInputSelector);
      if (c) n.push(`领取弹窗已经打开，跳过点击入口`);
      else {
        if (!await (0, __contentScope.k)(t.claimEntrySelector, 12e3))
          return {
            status: `failed`,
            message: `找不到领取入口: ${t.claimEntrySelector}`
          };
        if (!await (0, __contentScope.zf)(r, n))
          return { status: `failed`, message: __contentScope.Rf };
        let i2 = await (0, __contentScope.k)(t.claimEntrySelector, 12e3);
        if (!i2)
          return {
            status: `failed`,
            message: `完成人机验证后找不到领取入口: ${t.claimEntrySelector}`
          };
        let a2 = await (0, __contentScope.B)(i2, e, n);
        if (a2)
          return {
            status: `failed`,
            message: `领取入口被${(0, __contentScope.N)(a2)}遮挡，可能有未关闭的公告弹窗`
          };
        if (await (0, __contentScope.M)(i2), n.push(`已点击领取入口，等待弹窗`), c = await (0, __contentScope.k)(t.claimInputSelector, 1e4), !c)
          return {
            status: `failed`,
            message: `领取弹窗未出现输入框: ${t.claimInputSelector}`
          };
      }
      let l = t.claimMinLength ?? 10, u;
      if (t.claimUniqueText && !t.claimText?.trim()) {
        let e2 = (0, __contentScope.Er)(t.claimUsedTexts, l);
        u = e2.text, e2.exhausted && n.push(
          `预置领取理由已全部用过（${t.claimUsedTexts?.length ?? 0} 条），本次可能因重复被拒`
        );
      } else u = t.claimText?.trim() || __contentScope._p;
      if (u.length < l)
        return {
          status: `failed`,
          message: `领取文本太短：站点要求至少 ${l} 字，当前 ${u.length} 字`
        };
      if (!await (0, __contentScope.zf)(r, n))
        return { status: `failed`, message: __contentScope.Rf };
      if (c = await (0, __contentScope.k)(t.claimInputSelector, 8e3), !c)
        return {
          status: `failed`,
          message: `完成人机验证后找不到领取输入框: ${t.claimInputSelector}`
        };
      (0, __contentScope.A)(c, u), n.push(`已填入领取文本（${u.length} 字）`), await (0, __contentScope.w)(300);
      let d = await (0, __contentScope.k)(t.claimSubmitSelector, 8e3);
      if (!d)
        return {
          status: `failed`,
          message: `找不到领取提交按钮: ${t.claimSubmitSelector}`
        };
      if (!await (0, __contentScope.zf)(r, n))
        return { status: `failed`, message: __contentScope.Rf };
      let f2 = r.beforeCheckinClick ? await (0, __contentScope.k)(t.claimSubmitSelector, 8e3) : d;
      if (!f2)
        return {
          status: `failed`,
          message: `完成人机验证后找不到领取提交按钮: ${t.claimSubmitSelector}`
        };
      if ((0, __contentScope.R)(f2))
        return {
          status: `failed`,
          message: `完成人机验证后领取提交按钮仍不可点击`
        };
      let p = document.body?.innerText ?? ``, m = (0, __contentScope.I)(p, a), h = (0, __contentScope.I)(p, i), g = t.successSelector ? !!(0, __contentScope.D)(t.successSelector) : false, _ = await (0, __contentScope.B)(f2, e, n);
      if (_)
        return {
          status: `failed`,
          message: `领取按钮被${(0, __contentScope.N)(_)}遮挡，可能有未关闭的公告弹窗`
        };
      await (0, __contentScope.M)(f2, { mayNavigate: true }), n.push(`已点击领取按钮`);
      let v = t.claimUniqueText && !t.claimText?.trim() ? u : void 0, y = Date.now() + (t.successSelector && !g ? 2e4 : 1e4), b = null;
      for (; Date.now() < y; ) {
        await (0, __contentScope.w)(400);
        let e2 = document.body?.innerText ?? ``;
        if (e2 !== p && (b = (0, __contentScope.ot)(e2) ?? b), !o(e2) && !g && t.successSelector && (0, __contentScope.D)(t.successSelector))
          return {
            status: `success`,
            message: `命中领取成功标志`,
            claimTextUsed: v
          };
        if (!o(e2) && !m && (0, __contentScope.I)(e2, a))
          return {
            status: `success`,
            message: `页面出现领取成功提示`,
            claimTextUsed: v
          };
        if (!o(e2) && !h && (0, __contentScope.I)(e2, i))
          return {
            status: `already`,
            message: `页面提示权益已领取或已生效`,
            claimTextUsed: v
          };
        if (/重复|已使用过|不能和之前/.test(e2) && e2 !== p)
          return {
            status: `failed`,
            message: `站点提示领取理由与历史重复，已记录该理由避免重用`,
            claimTextUsed: v
          };
      }
      return {
        status: `failed`,
        message: b ? `站点确认领取失败：${b}` : `提交领取后未检测到明确结果，请手动确认`
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
      if (!e) return false;
      try {
        let t = new URL(location.href);
        return t.origin === e.origin && (0, __contentScope.wp)(t.pathname) === (0, __contentScope.wp)(e.pathname) && t.search === e.search && (!e.hash || t.hash === e.hash);
      } catch {
        return false;
      }
    }
    function Dp(e, t, n, r) {
      let i = (0, __contentScope.Tp)(e);
      return t.fallbackToUrl !== false && i && !(0, __contentScope.Ep)(i) ? (n.push(`${r}，回退到同源签到地址 ${i.pathname}${i.search}${i.hash}`), { status: `navigate`, url: i.href }) : { status: `failed`, message: r };
    }
    async function Op(e, t, n, r, i) {
      if (!t.selector?.trim())
        return {
          status: `failed`,
          message: `签到入口第 ${n + 1} 步缺少 selector`
        };
      let a = (0, __contentScope.Cp)(t.timeoutMs, __contentScope.yp);
      if (t.waitFor?.trim() && (0, __contentScope.D)(t.waitFor)) return null;
      let o = await (0, __contentScope.k)(t.selector, a);
      if (!o)
        return {
          status: `failed`,
          message: `签到入口第 ${n + 1} 步未找到控件: ${t.selector}`,
          ...n === 0 ? { fallbackEligible: true } : {}
        };
      if (i.beforeAction && !await i.beforeAction())
        return {
          status: `failed`,
          message: `签到入口第 ${n + 1} 步前的人机验证未完成`
        };
      let s = i.beforeAction ? await (0, __contentScope.k)(t.selector, a) : o;
      if (!s)
        return {
          status: `failed`,
          message: `完成人机验证后未找到签到入口控件: ${t.selector}`
        };
      if (await (0, __contentScope.B)(s, e, r, `签到入口控件`))
        return {
          status: `failed`,
          message: `签到入口第 ${n + 1} 步仍被公告或遮罩挡住`
        };
      try {
        await (0, __contentScope.M)(s, { mayNavigate: t.mayNavigate === true });
      } catch (e2) {
        return {
          status: `failed`,
          message: `签到入口第 ${n + 1} 步点击失败: ${e2 instanceof Error ? e2.message : String(e2)}`
        };
      }
      return r.push(`已完成签到入口第 ${n + 1} 步`), t.waitFor?.trim() && !await (0, __contentScope.k)(t.waitFor, a) ? t.mayNavigate ? (r.push(`签到入口第 ${n + 1} 步可能已触发整页导航，等待新页面继续`), null) : {
        status: `failed`,
        message: `签到入口第 ${n + 1} 步后未出现预期控件: ${t.waitFor}`
      } : null;
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
          message: `签到入口最多支持 ${__contentScope.Sp} 个步骤`
        };
      if ((0, __contentScope.D)(r.readySelector)) return { status: `ready` };
      if ((0, __contentScope.Ep)((0, __contentScope.Tp)(e)))
        return await (0, __contentScope.k)(
          r.readySelector,
          (0, __contentScope.Cp)(r.readyTimeoutMs, __contentScope.bp)
        ) ? { status: `ready` } : {
          status: `failed`,
          message: `已进入签到页，但页面未完成渲染: ${r.readySelector}`
        };
      t.push(`当前页需要通过站内用户菜单进入签到资料页`);
      for (let [i, a] of r.steps.entries()) {
        if ((0, __contentScope.D)(r.readySelector)) return { status: `ready` };
        let o = await (0, __contentScope.Op)(e, a, i, t, n);
        if (o) return o.fallbackEligible ? (0, __contentScope.Dp)(e, r, t, o.message) : o;
      }
      return await (0, __contentScope.k)(
        r.readySelector,
        (0, __contentScope.Cp)(r.readyTimeoutMs, __contentScope.bp)
      ) ? (t.push(`签到资料页已就绪，开始核对账号`), { status: `ready` }) : {
        status: `failed`,
        message: `站内入口已执行，但签到资料页未就绪: ${r.readySelector}`
      };
    }
    function qp(e) {
      return !__contentScope.Kp.some((t) => t.test(e));
    }
    function Jp(e, t = []) {
      let n = [e, ...t.filter(__contentScope.qp)].join(`
`);
      for (let { code: e2, patterns: t2 } of __contentScope.Gp) if (t2.some((e3) => e3.test(n))) return e2;
      return __contentScope.Q.UNKNOWN;
    }
    function Xp(e, t) {
      let n = __contentScope.Yp[e], r = n?.length ?? 0;
      if (!n || t >= r)
        return {
          retry: false,
          delayMs: 0,
          attempt: t,
          maxAttempts: r,
          reason: n ? `已达重试上限` : `这类失败重试也不会变好，需要人工处理`
        };
      let i = n[t];
      return {
        retry: true,
        delayMs: i,
        attempt: t + 1,
        maxAttempts: r,
        reason: `${Math.round(i / 1e3)} 秒后重试（第 ${t + 1}/${r} 次）`
      };
    }
    function Zp(e) {
      return e === `oauth` || e === `github` || e === `passkey` || e === `manual`;
    }
    function Qp(e) {
      if (e.identityConfirmedThisRun && e.verdict !== `mismatch`)
        return { action: `proceed`, reason: `already-confirmed-this-run` };
      let t = (0, __contentScope.Zp)(e.loginMethod);
      return e.verdict === `confirmed` ? { action: `proceed`, reason: `confirmed` } : e.verdict === `mismatch` ? !t || e.canSwitchAccount ? { action: `switch-account`, reason: `mismatch` } : { action: `handoff`, reason: `mismatch-external` } : e.checkinPageAvailable ? {
        action: `defer-to-checkin-page`,
        reason: `identity-visible-on-checkin-page`
      } : e.loginMethod === `manual` ? { action: `handoff`, reason: `unknown-manual-identity` } : e.canSwitchAccount ? { action: `switch-account`, reason: `unknown` } : t ? { action: `handoff`, reason: `unknown-multi-account` } : { action: `switch-account`, reason: `unknown` };
    }
    function nm(e) {
      return typeof e != `number` || !Number.isFinite(e) ? false : e - Date.now() <= __contentScope.em;
    }
    function rm(e) {
      return typeof e != `number` || !Number.isFinite(e) ? false : e <= Date.now();
    }
    function im(e) {
      return typeof e == `object` && !!e && !Array.isArray(e);
    }
    async function am(e, t, n) {
      if ((0, __contentScope.$r)(e).family !== __contentScope.s.SUB2API)
        return { status: `unsupported` };
      if (!(0, __contentScope.nm)(t.tokenExpiresAt)) return { status: `still-valid` };
      if (!t.refreshToken)
        return (0, __contentScope.rm)(t.tokenExpiresAt) ? {
          status: `expired`,
          reason: `登录态已过期且没有 refresh token，需要重新抓取`
        } : { status: `still-valid` };
      let r = new URL(__contentScope.tm, location.origin).href;
      if (!(0, __contentScope.W)(e, r))
        return { status: `expired`, reason: `换 token 的地址不在本站，已拒绝` };
      n.push(`访问令牌即将到期，正在用 refresh token 换新`);
      let i = null;
      try {
        i = await (await fetch(r, {
          method: `POST`,
          headers: {
            "Content-Type": `application/json`,
            ...t.accessToken ? { Authorization: `Bearer ${t.accessToken}` } : {}
          },
          body: JSON.stringify({ refresh_token: t.refreshToken })
        })).json().catch(() => null);
      } catch {
        return (0, __contentScope.rm)(t.tokenExpiresAt) ? { status: `expired`, reason: `换 token 的请求失败，且当前令牌已过期` } : { status: `still-valid` };
      }
      let a = (0, __contentScope.om)(i);
      return a ? (localStorage.setItem(__contentScope.$p.accessToken, a.accessToken), localStorage.setItem(__contentScope.$p.refreshToken, a.refreshToken), localStorage.setItem(__contentScope.$p.expiresAt, String(a.tokenExpiresAt)), n.push(`已换到新的访问令牌`), { status: `refreshed`, tokens: a }) : (0, __contentScope.rm)(t.tokenExpiresAt) ? {
        status: `expired`,
        reason: `站点拒绝了换 token 请求，需要重新抓取登录态`
      } : { status: `still-valid` };
    }
    function om(e) {
      if (!(0, __contentScope.im)(e) || e.code !== 0 || !(0, __contentScope.im)(e.data)) return null;
      let { access_token: t, refresh_token: n, expires_in: r } = e.data;
      return typeof t != `string` || !t.trim() || typeof n != `string` || !n.trim() || typeof r != `number` || r <= 0 ? null : {
        accessToken: t.trim(),
        refreshToken: n.trim(),
        tokenExpiresAt: Date.now() + r * 1e3
      };
    }
    function ah(e) {
      return e.filter((e2) => e2.startsWith(__contentScope.Xm)).map((e2) => e2.slice(7).trim());
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
      return t < 0 ? false : t > (0, __contentScope.ch)(e);
    }
    function uh(e) {
      let t = (0, __contentScope.oh)(e, __contentScope.ih);
      return t < 0 ? false : t > (0, __contentScope.ch)(e);
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
      if (e === t) return true;
      let n = (0, __contentScope.fh)(e), r = (0, __contentScope.fh)(t);
      return n.pathname === r.pathname ? n.hash && r.hash ? n.hash === r.hash : true : false;
    }
    function mh(e) {
      let t = 0;
      return e.forEach((n, r) => {
        if (!n.startsWith(__contentScope.Xm)) return;
        let i = n.slice(7).trim();
        e.slice(Math.max(0, r - 2), r).some(
          (e2) => e2.startsWith(`工作流接入学习路线: `) && e2.endsWith(`进入 ${i}`) || e2.startsWith(`学习路线未命中: `) && e2.endsWith(`尝试进入 ${i}`)
        ) && (t += 1);
      }), t;
    }
    function hasVisibleLogoutControl(site, siteEvidence) {
      const visible = (control) => {
        if (!(0, __contentScope.O)(control) || control.disabled || control.hasAttribute?.(`disabled`) || control.getAttribute?.(`aria-disabled`) === `true` || control.hasAttribute?.(`data-disabled`) && control.getAttribute?.(`data-disabled`) !== `false`)
          return false;
        for (let parent = control; parent; parent = parent.parentElement)
          if (parent.hidden || parent.getAttribute?.(`aria-hidden`) === `true` || parent.hasAttribute?.(`inert`))
            return false;
        return true;
      }, controls = [
        ...document.querySelectorAll(`button, a, [role="button"]`),
        ...document.querySelectorAll(
          `[role="menuitem"], [role="treeitem"], [data-slot="sidebar-menu-item"]`
        )
      ];
      for (const control of new Set(controls)) {
        if (!visible(control)) continue;
        const referenced = [`aria-labelledby`, `aria-describedby`].flatMap(
          (attribute) => (control.getAttribute?.(attribute) ?? ``).split(/\s+/).filter(Boolean).map((id) => document.getElementById?.(id)?.textContent)
        ), labels = [
          control.innerText,
          control.textContent,
          control.getAttribute?.(`aria-label`),
          control.getAttribute?.(`title`),
          control.getAttribute?.(`data-tooltip`),
          control.getAttribute?.(`data-tip`),
          ...referenced
        ];
        const normalizedLabels = labels.filter((label) => typeof label === `string`).map((label) => label.replace(/\s+/g, ` `).trim()), menu = control.closest?.(`[role="menu"], [role="tree"], [role="treegrid"]`), accountMenu = menu && [...menu.querySelectorAll(`a[href], [role="menuitem"], [role="treeitem"]`)].some(
          (item) => /个人(?:资料|设置|中心)|(?:账号|账户)(?:资料|设置)|(?:my\s+)?profile|account\s+(?:settings|profile)|personal\s+(?:settings|information)/i.test(
            (0, __contentScope.Rn)(item)
          )
        );
        if (normalizedLabels.some(
          (label) => /^(?:退出\s*(?:当前\s*)?(?:登录|账号|账户)|注销\s*登录|登出|log[\s-]?out|sign[\s-]?out)[.!。！]?$/i.test(
            label
          )
        ) || accountMenu && normalizedLabels.some((label) => /^(?:退出|注销|exit)[.!。！]?$/i.test(label)))
          return true;
      }
      return (siteEvidence ?? readSiteLoginEvidence(site ?? { loginUrl: location.origin }, document, location, visible)).logoutControl === true;
    }
    function detectPageLogin(site, account = {}, enumerate = false) {
      function registrationStep(input) {
        const region = input?.form ?? input?.closest?.(`form, [role="dialog"], main, section`), heading = region?.querySelector?.(`h1, h2, h3, [role="heading"]`), title = heading?.innerText || heading?.textContent || ``;
        return /注册|创建(?:新)?账号|sign\s*up|create\s+(?:an?\s+)?account/i.test(title) || /^(?:注册|创建(?:新)?账号|sign\s*up|create\s+(?:an?\s+)?account)/i.test(
          input ? (0, __contentScope.Sn)(input) : ``
        );
      }
      const selectors = site.selectors ?? {}, password = (0, __contentScope.V)(selectors.password ?? ``, document), username = password ? (0, __contentScope.Tn)(
        selectors.username ?? ``,
        password.element.form ?? document,
        password.element
      ) : null, form = !!password && !!username && (0, __contentScope.kn)() && !registrationStep(password.element), discovered = (0, __contentScope.collectLoginEntries)(), manual = discovered.find((entry2) => entry2.method === `manual`), entry = [
        ...document.querySelectorAll(`button, [role="button"], a[href], input[type="button"]`)
      ].find(
        (control) => (0, __contentScope.O)(control) && !isLoginHelpControl(control) && !registrationStep(control) && /密码登录|账号密码|账密登录|(?:sign|log)\s*in\s*(?:with|using)?\s*(?:email|password)|(?:use|continue\s*with)\s*password|^password(?:\s*login)?$/i.test(
          control.innerText || control.textContent || control.getAttribute(`aria-label`) || control.value || ``
        ) && !/忘记|重置|找回|修改|forgot|reset|recover|change|sign\s*up|register/i.test(
          control.innerText || control.textContent || control.getAttribute(`aria-label`) || control.value || ``
        )
      ), passwordEntry = !!entry, usernameStep = !manual && /\/(?:login|sign-?in)(?:\/|$)/i.test(location.pathname) && (0, __contentScope.kn)() && !registrationStep((0, __contentScope.Tn)(selectors.username ?? ``, document)?.element) && (0, __contentScope.On)({ ...site, selectors }) && [...document.querySelectorAll(`button, [role="button"], input[type="submit"]`)].some(
        (control) => (0, __contentScope.O)(control) && /登录|登入|sign\s*in|log\s*in|下一步|next/i.test(
          control.innerText || control.textContent || control.value || ``
        ) && !/注册|订阅|sign\s*up|register|subscribe/i.test(
          control.innerText || control.textContent || control.value || ``
        )
      ), native = form ? { method: `form`, evidence: `页面可见站内用户名和密码表单` } : passwordEntry ? { method: `form`, evidence: `页面可见站内账密登录入口`, entry } : usernameStep ? { method: `form`, evidence: `登录页可见账号输入步骤` } : null;
      const nativeEntry = native ? {
        key: `form:site-password`,
        method: `form`,
        provider: `site-password`,
        label: `站内账号密码`,
        ...entry ? {
          matchText: (0, __contentScope.Rn)(entry).replace(/\s+/g, ` `).trim().slice(0, 120)
        } : {}
      } : null, options = [
        ...nativeEntry ? [{ ...nativeEntry, evidence: native.evidence }] : [],
        ...discovered.map((entry2) => ({
          ...entry2,
          evidence: `页面可见「${entry2.label}」登录入口`
        }))
      ];
      if (enumerate) return options;
      if (account.loginEntry) {
        const selected = options.find((option) => option.key === account.loginEntry.key);
        if (!selected) return null;
        return {
          ...selected,
          loginEntry: selected,
          ...selected.method === `form` && native?.entry ? { entry: native.entry } : {}
        };
      }
      const github = options.find((option) => option.method === `github`), choose = (option) => option ? { ...option, loginEntry: option } : null;
      if (native && (account.password || !github)) return { ...native, loginEntry: nativeEntry };
      if (github && account.githubUsername && account.githubPassword) return choose(github);
      if (native) return { ...native, loginEntry: nativeEntry };
      if (options.length === 1) return choose(options[0]);
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
        checkedAt: Date.now()
      };
      try {
        if (new URL(site.loginUrl).origin !== location.origin)
          return { ...result, status: `unavailable`, evidence: [`当前页面已离开本站登录地址`] };
        const options = (0, __contentScope.detectPageLogin)(site, {}, true);
        if (options.length)
          return {
            ...result,
            status: options.length === 1 ? `detected` : `multiple`,
            methods: [...new Set(options.map((option) => option.method))],
            entries: options.map(({ evidence, ...entry }) => entry),
            evidence: options.map((option) => option.evidence)
          };
        const loginState = classifyLoginState((0, __contentScope.readLoginSnapshot)(site));
        if (loginState.status === `authenticated`)
          return {
            ...result,
            status: `already-logged-in`,
            evidence: [`当前浏览器已登录，页面没有展示登录入口；请选择你使用的账号类型`]
          };
        return {
          ...result,
          evidence: [
            loginState.status === `blocked` || loginState.status === `failed` ? loginState.detail : `当前页面尚未展示可识别的登录入口；可重新检测或手动选择账号类型`
          ]
        };
      } catch {
        return {
          ...result,
          status: `unavailable`,
          evidence: [`登录页面尚未就绪，暂时无法读取登录方式`]
        };
      }
    }
    async function hh(e, t) {
      e = { ...e, site: { ...e.site, selectors: { ...e.site.selectors } } };
      if (e.loginEntry?.method === e.effectiveLoginMethod)
        e.site = { ...e.site, loginEntry: e.loginEntry, oauthButtonSelector: `` };
      let n = [...e.steps ?? []], r = e.effectiveLoginMethod ?? (e.formCredentialsSubmitted ? `form` : e.githubCredentialsSubmitted ? `github` : `auto`), i = r === `oauth` || r === `github` || r === `passkey`, a = r === `github` ? e.githubUsername?.trim() : void 0, o = r === `github` && !!e.githubUsername && !!e.githubPassword && !!t.startGithubLogout, s = {
        knownUsers: e.siteAccountUserIds ?? {},
        knownIdentities: e.siteAccountIdentities ?? []
      }, l = e.accountIdentityUserId, u = l ? s.knownUsers[l] : void 0, d = u ? void 0 : l, f2 = d, formLoginSubmitted = e.formCredentialsSubmitted === true, manualWaitingStage = [`verify-manual`, `relogin-verify-manual`].includes(e.stage) ? e.stage : null, m = e.accountIdentityUsername, h = e.accountIdentityEmail, g = () => f2 ?? d, _ = e.workflowRouteIndex, v = () => !e.site.adapter && !f2 || e.site.adapter?.userId === f2 ? e.site : { ...e.site, adapter: { ...e.site.adapter, userId: f2 } }, y = () => {
        let t2 = v(), n2 = e.effectiveCheckinMethod ? {
          ...t2,
          checkin: { ...t2.checkin, method: e.effectiveCheckinMethod }
        } : t2;
        if (n2.checkin?.method === `none`) {
          let e2 = { ...n2.checkin };
          return delete e2.entry, delete e2.url, e2.workflow?.steps?.length && (e2.workflow = { ...e2.workflow, steps: [] }), { ...n2, checkin: e2 };
        }
        if (!(0, __contentScope.p)(n2) || !n2.checkin || n2.checkin.method === `workflow` && !n2.checkin.workflow?.route?.length)
          return n2;
        let r2 = { ...n2.checkin };
        return delete r2.entry, r2.workflow?.route?.length && delete r2.url, { ...n2, checkin: r2 };
      }, b = () => {
        let e2 = y(), t2 = (() => {
          try {
            return new URL(location.href).pathname || `/`;
          } catch {
            return `/`;
          }
        })(), n2 = {
          ...e2,
          adapter: {
            ...e2.adapter,
            checkinPath: ``,
            checkin: {
              pathPatterns: [t2],
              titleWords: [...e2.adapter?.checkin?.titleWords ?? []]
            }
          }
        };
        if (e2.checkin) {
          let t3 = { ...e2.checkin };
          if (delete t3.url, t3.workflow?.route) {
            let { route: e3, ...n3 } = t3.workflow;
            t3.workflow = n3;
          }
          n2.checkin = t3;
        }
        return n2;
      }, x = /* @__PURE__ */ new Set([`未发现公告弹窗`]), S = {
        push: (e2) => {
          if (e2.startsWith(`身份接口 `)) {
            if (x.has(e2)) return;
            x.add(e2);
          }
          x.has(e2) && n[n.length - 1] === e2 || (n.push(e2), console.log(`[签到助手]`, e2), t.reportProgress?.([...n]));
        }
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
            formLoginSubmitted = false;
            S.push(`根据当前页面识别登录方式：${method}（${choice.evidence}）`);
            if (method === `form` && choice.entry) {
              if (!await E(`login`, __contentScope.$))
                throw Error(`账密登录入口前的安全验证尚未完成`);
              await (0, __contentScope.dr)(choice.entry, e.site, S, `账密登录入口`);
            }
            return true;
          }
          if (Date.now() >= deadline) return false;
          await (0, __contentScope.w)(100);
        } while (Date.now() <= deadline);
        return false;
      }
      u && !n.some((e2) => e2.startsWith(`身份绑定冲突:`)) && S.push(
        `身份绑定冲突: 站点用户 ID ${l} 同时绑定给当前账号和 ${u}；本轮已忽略这个旧绑定，必须重新核对页面身份后才能签到`
      );
      let C = (t2, r2) => ({
        accountId: e.accountId,
        ok: false,
        message: t2,
        steps: n,
        ...r2 ? { metrics: r2 } : {}
      });
      async function ee(r2, i2) {
        let a2 = (0, __contentScope.Jp)(r2, n), o2 = n.filter((e2) => e2.startsWith(__contentScope.Um)).length;
        if (n.length > __contentScope.Ym) {
          let e2 = o2 > 0 ? `（已重试 ${o2} 次仍未成功，停止重试）` : `（本轮步骤过多，停止重试）`;
          return C(`${r2}${e2}`, i2);
        }
        let s2 = (0, __contentScope.Xp)(a2, o2);
        return s2.retry ? (S.push(`${__contentScope.Um} ${r2} → ${s2.reason}`), await (0, __contentScope.w)(s2.delayMs), await t.navigate(e.site.loginUrl, n, `login`), null) : C(r2, i2);
      }
      let te = (t2, r2) => ({
        accountId: e.accountId,
        ok: true,
        message: t2,
        steps: n,
        ...r2 ? { metrics: r2 } : {}
      }), ne = () => [...n].reverse().find((e2) => e2.startsWith(`找不到`) || e2.startsWith(`当前页没有`)) ?? `未能识别登录表单`, re = {
        workflowCheckpoint: Me,
        get workflowRouteIndex() {
          return _;
        },
        saveWorkflowRouteIndex: async (e2) => {
          await t.saveWorkflowRouteIndex?.(e2), (_ === void 0 || e2 > _) && (_ = e2, S.push(`${__contentScope.Zm}${e2}`));
        },
        beforeCheckinClick: () => D(`checkin`),
        beforeWorkflowNavigate: () => t.markStage(`checkin`, n),
        afterCheckinClick: async (e2) => (await Ce(2500, e2?.checkinAction === false ? `页面点击` : void 0)).resolved,
        whileWaitingForCheckinResult: () => Ce(),
        saveReloginStage: () => t.markStage(`relogin`, n),
        saveReloginBalanceBefore: async (e2) => {
          t.saveReloginBalanceBefore ? await t.saveReloginBalanceBefore(e2) : await t.saveBalance?.(e2);
        },
        saveButtonBalanceBefore: async (e2) => {
          if (!t.saveButtonBalanceBefore)
            throw Error(`当前运行环境无法持久化按钮签到基线，已停止点击`);
          await t.saveButtonBalanceBefore(e2);
        },
        buttonBalanceBefore: e.context?.buttonCheckinPending === true ? e.context.balanceBefore : void 0,
        saveBalance: async (e2) => {
          if (e2)
            try {
              await t.saveBalance?.(e2);
            } catch (e3) {
              S.push(
                `余额快照未能写入账号（${e3 instanceof Error ? e3.message : String(e3)}）；本次签到结果不受影响`
              );
            }
        }
      };
      async function ie(identity, stable = false) {
        const persist = identity.source === `api` && (r !== `manual` || hasBoundIdentity() || matchesManualAccount(identity)) && !(r === `form` && !formLoginSubmitted && !hasBoundIdentity()) || identity.verifiedByManagedLogin === true && (r === `form` && formLoginSubmitted || r === `github` && e.githubCredentialsSubmitted === true);
        if (!persist) return false;
        if (!hasBoundIdentity() && !stable) {
          await (0, __contentScope.w)(350);
          const next = await se(`首次身份绑定复核`);
          if (!stableIdentitySamples(identity, next.identity) || ue(next) || identity.verifiedByManagedLogin !== true && ce(next).match !== `confirmed`)
            throw Error(`首次绑定的身份尚未形成与本账号一致的稳定样本，已保留原账号数据`);
          identity = { ...identity, ...next.identity };
        }
        if (!hasBoundIdentity() && !t.saveIdentity)
          throw Error(`无法保存本账号首次确认的身份，请重新加载扩展后重试`);
        await t.saveIdentity?.(identity);
        if (identity.userId) f2 = identity.userId;
        if (identity.username) m = identity.username;
        if (identity.email) h = identity.email;
        return persist;
      }
      async function T(e2) {
        return await ie(e2) && e2.source === `api`;
      }
      async function ae(loginDescription, tokenIdentity) {
        let observation = tokenIdentity ? { identity: tokenIdentity } : await se(`第二次登录后的页面`), verdict = ce(observation);
        if (!tokenIdentity && await enterIdentityPage(observation, verdict, `relogin-verify`))
          return null;
        if (!tokenIdentity) {
          const first = observation.identity;
          await (0, __contentScope.w)(350);
          observation = await se(`第二次登录后的页面`);
          verdict = ce(observation);
          if (!stableIdentitySamples(first, observation.identity))
            verdict = {
              match: `unknown`,
              detail: observation.identity?.identityConflict ? `身份证据冲突：${observation.identity.identityConflict}` : `第二次登录后的身份尚未形成一致的稳定样本`
            };
        }
        if (verdict.match !== `confirmed` || observation.identity?.identityConflict) {
          Oe(observation, verdict);
          await t.needsUser(
            `第二次登录身份核验未通过：${verdict.detail}。已停止签到结果确认，保留原账号绑定，请核对当前登录账号后重试。`,
            n
          );
          return null;
        }
        await t.confirmIdentity?.();
        let r2 = null;
        for (let e2 = 0; e2 < 3; e2 += 1) {
          e2 > 0 && await (0, __contentScope.w)(1e3);
          let t2 = await (0, __contentScope.za)(v());
          if (t2) {
            r2 = t2;
            break;
          }
        }
        r2 ? await t.saveBalance?.(r2) : S.push(`第二次登录成功，但未能读取登录后的余额`);
        let i2 = e.context?.balanceBefore;
        if (!i2 || !r2) return te(`${loginDescription}成功；余额差额暂无法核对`);
        let a2 = { ...(0, __contentScope.Wa)(i2, r2), source: `balance-diff` }, o2 = (0, __contentScope.Ga)(a2, v().adapter?.quotaPerUnit, v().adapter?.family);
        return o2 && S.push(`重登前后差额：${o2}`), a2.verdict === `rewarded` ? te(`${loginDescription}成功，余额差额确认签到奖励已到账`, a2) : a2.verdict === `already-used` ? te(`${loginDescription}成功，今日总额度未增加（期间有消耗，可能已领取）`, a2) : te(`${loginDescription}成功，余额未增加（今日可能已领取）`, a2);
      }
      function oe(t2) {
        let n2 = (0, __contentScope.Gi)(e.username);
        return n2 && !n2.masked ? (S.push(
          `${t2}读不到身份接口，但页面上印着本账号 ${n2.matched}${n2.masked ? `（打码显示）` : ``}，按用户名核对`
        ), { username: e.username, source: `visible` }) : null;
      }
      async function se(t2) {
        let n2 = await (0, __contentScope.qi)(v(), void 0, { diagnostics: S }), r2 = (0, __contentScope.Gi)(e.username);
        return n2 ? r2 && n2.source === `visible` ? (S.push(`${t2}同时显示站点账号 ${r2.matched}，作为当前账号的页面旁证`), { identity: n2, pageAccountMatch: r2.matched }) : { identity: n2 } : { identity: oe(t2) };
      }
      function ce(t2) {
        let n2 = m || h ? { ...m ? { username: m } : {}, ...h ? { email: h } : {} } : void 0;
        return (0, __contentScope.Zi)(t2.identity, e.username, g(), {
          ...s,
          ...t2.pageAccountMatch ? { pageAccountMatch: t2.pageAccountMatch } : {},
          ...a ? { expectedAliases: [a] } : {},
          ...n2 ? { expectedIdentity: n2 } : {}
        });
      }
      function hasBoundIdentity() {
        return !!g() || !!m || !!h;
      }
      function canProbeLoginIdentityPage() {
        return ![`oauth`, `github`, `passkey`].includes(r) || (0, __contentScope.rr)(e.site);
      }
      async function enterIdentityPage(observation, verdict, stage = `checkin`, navigationOptions = {}) {
        const loginVerification = navigationOptions.loginVerification === true, workflow = (0, __contentScope.rf)(y());
        if (r === `token` || r === `manual` || workflow && !loginVerification || observation.identity?.identityConflict || observation.identity?.userId || verdict.match !== `unknown`)
          return false;
        const identityPath = loginVerification && workflow ? (0, __contentScope.sf)(y()) : null, identitySite = identityPath ? {
          ...y(),
          identitySource: { ...readIdentitySource(y()), pagePath: identityPath }
        } : y(), url = resolveIdentityPage(identitySite, document, location);
        if (!url) return false;
        const target = new URL(url);
        const path = `${target.pathname}${target.hash}`;
        if (path === `${location.pathname}${location.hash}`) return false;
        const phase = stage.startsWith(`relogin`) ? `第二次登录` : `本轮登录`;
        const message = `身份读取进入资料页: ${path}（${phase}）`;
        let loginStart = 0;
        for (let index = 0; index < n.length; index++)
          if (n[index].startsWith(__contentScope.Wm) || n[index].startsWith(`开始第二次登录以完成签到`))
            loginStart = index;
        if (n.slice(loginStart).includes(message)) {
          S.push(
            `身份核验页未能到达：已尝试 ${path}，站点仍返回 ${location.pathname}${location.hash}；停止重复跳转`
          );
          return false;
        }
        S.push(
          `当前页身份字段不足：${verdict.detail}；使用本站资料页读取当前账号，目标用户 ID ${g() ?? `尚未绑定`}`
        );
        S.push(message);
        await t.navigate(url, n, stage);
        return true;
      }
      function le(e2, t2) {
        if (![`api`, `visible`].includes(e2.identity?.source)) return false;
        let n2 = e2.identity.userId;
        return n2 && g() ? n2 !== g() : n2 && s.knownUsers[n2] ? true : t2.match === `mismatch` && (!i || !g() && hasBoundIdentity() && (e2.identity.source === `api` || [`structured-fields`, `profile-card`].includes(e2.identity.evidence)));
      }
      function ue(e2) {
        let t2 = e2.identity?.userId;
        return t2 ? [`api`, `visible`].includes(e2.identity?.source) && g() && t2 !== g() ? true : !!s.knownUsers[t2] : false;
      }
      function matchesManualAccount(identity) {
        const target = String(e.username ?? ``).trim().toLowerCase();
        return !!target && [identity?.username, identity?.email].some(
          (value) => typeof value === `string` && value.trim().toLowerCase() === target
        );
      }
      async function confirmManualIdentity() {
        const first = await se(`页面登录身份`), verdict = de(first, ce(first));
        if (first.identity?.identityConflict || ue(first) || verdict.match === `mismatch`)
          return { confirmed: false, conflict: true, detail: verdict.detail };
        if (first.identity?.source !== `api` || !first.identity.userId && !first.identity.username && !first.identity.email || (hasBoundIdentity() ? verdict.match !== `confirmed` : !matchesManualAccount(first.identity)))
          return { confirmed: false, detail: `尚未读到与账号 ${e.username} 一致的实时身份` };
        await (0, __contentScope.w)(350);
        const next = await se(`页面登录身份复核`), nextVerdict = de(next, ce(next));
        if (next.identity?.identityConflict || ue(next) || nextVerdict.match === `mismatch`)
          return { confirmed: false, conflict: true, detail: nextVerdict.detail };
        if (next.identity?.source !== `api` || !stableIdentitySamples(first.identity, next.identity) || (hasBoundIdentity() ? nextVerdict.match !== `confirmed` : !matchesManualAccount(next.identity)))
          return { confirmed: false, detail: `页面登录身份尚未形成连续稳定样本` };
        if (!t.saveIdentity) throw Error(`当前运行环境无法保存页面登录身份，请重新加载扩展`);
        await ie(next.identity, true);
        await t.confirmIdentity?.();
        S.push(
          `已连续核对页面登录身份，本站${g() ? `用户 ID ${g()}` : `登录标识 ${m ?? h}`} 与账号 ${e.username} 一致`
        );
        return { confirmed: true };
      }
      async function waitManualLogin(stage, announce = true) {
        if (!t.waitForManualLogin)
          throw Error(`当前运行环境无法保留页面登录任务，请重新加载扩展后重试`);
        const waitingUntil = announce ? await t.waitForManualLogin(
          `请在当前站点页面完成「${e.loginEntry?.label ?? `验证码 / 页面登录`}」，登录账号应为 ${e.username}；完成后会核验身份并继续签到。`,
          n
        ) : void 0, deadline = typeof waitingUntil === `number` ? Math.min(waitingUntil, Date.now() + __contentScope.$) : Date.now() + __contentScope.$;
        do {
          if (location.origin !== (0, __contentScope.Dr)(e.site))
            return { confirmed: false, detail: `请在登录页面完成验证并返回本站` };
          if (!(0, __contentScope.On)(e.site) && !(0, __contentScope.nr)()) {
            const verification = await confirmManualIdentity();
            if (verification.confirmed || verification.conflict) {
              if (verification.conflict)
                await t.needsUser(
                  `当前登录身份与账号 ${e.username} 不一致（${verification.detail}），请切换到目标账号后重试。`,
                  n
                );
              else
                await t.markStage(
                  stage === `relogin-verify-manual` ? `relogin-verify` : `checkin`,
                  n
                );
              return verification;
            }
          }
          await (0, __contentScope.w)(1e3);
        } while (Date.now() < deadline);
        return { confirmed: false, detail: `等待页面登录超时，请完成验证后重新签到` };
      }
      async function beginManualLogin(relogin = false) {
        if (!t.waitForManualLogin)
          throw Error(`当前运行环境无法保留页面登录任务，请重新加载扩展后重试`);
        const stage = relogin ? `relogin-verify-manual` : `verify-manual`, selected = e.loginEntry, control = selected ? (0, __contentScope.findSelectedLoginControl)(selected, `manual`) : null;
        await t.markStage(stage, n);
        manualWaitingStage = stage;
        if (control && !(0, __contentScope.H)(control) && !(control.form && control.type === `submit`) && !(control instanceof HTMLInputElement && control.type === `submit`) && control.getAttribute(`type`) !== `submit`) {
          if (!await E(stage, __contentScope.$)) return C(`页面登录入口前的安全验证尚未完成`);
          const current = (0, __contentScope.findSelectedLoginControl)(selected, `manual`);
          if (current) {
            const blocker = await (0, __contentScope.B)(current, e.site, S, `页面登录入口`);
            if (blocker) return C(`页面登录入口被遮挡，请完成当前页面提示后重试`);
            S.push(`已进入账号选定的「${selected.label}」登录入口`);
            await (0, __contentScope.M)(current, { mayNavigate: true });
          }
        }
        const verification = await waitManualLogin(stage);
        return verification.confirmed ? relogin ? ae(`退出后页面登录`) : M(true) : verification.conflict ? null : C(verification.detail);
      }
      function de(t2, n2) {
        if (!ue(t2)) return n2;
        let r2 = t2.identity.userId, i2 = s.knownUsers[r2], a2 = t2.identity?.source === `api` ? `站点接口` : t2.identity?.source === `storage` ? `本地登录态` : `页面文本`;
        return {
          match: `mismatch`,
          detail: g() ? `当前登录的是用户 ID ${r2}${i2 ? `（本站账号 ${i2}）` : ``}（读自${a2}），本次要签到的是 ${g()}` : `当前登录的是用户 ID ${r2}（本站账号 ${i2}，读自${a2}），不是本次账号 ${e.username}`
        };
      }
      function fe(t2, n2) {
        if (ue(t2)) return true;
        if (n2.match !== `mismatch`) return false;
        if (le(t2, n2)) return true;
        let r2 = t2.identity;
        return r2 ? e.username.includes(`@`) && r2.email ? true : !i : false;
      }
      function pe(t2) {
        return r === `github` && o && e.githubCredentialsSubmitted === true && (t2.identity?.userId || (t2.identity?.username || t2.identity?.email) && (t2.identity.source === `api` || [`structured-fields`, `profile-card`].includes(t2.identity.evidence))) && !ue(t2) && (!hasBoundIdentity() || ce(t2).match === `confirmed`);
      }
      function canEstablishFormIdentity(observation) {
        const identity = observation.identity;
        return r === `form` && formLoginSubmitted && !hasBoundIdentity() && !identity?.identityConflict && (identity?.userId || (identity?.source === `api` || [`structured-fields`, `profile-card`].includes(identity?.evidence)) && matchesManualAccount(identity)) && (identity.source === `api` || identity.source === `visible`) && !ue(observation);
      }
      async function beforeFormSubmit(stage) {
        if (!await D(stage)) return false;
        if (t.recordFormCredentialsSubmitted) {
          await t.recordFormCredentialsSubmitted();
          formLoginSubmitted = true;
        } else if (!g() && (0, __contentScope.rf)(y())) {
          throw Error(`当前运行环境无法确认本账号的登录提交，请重新加载扩展后重试`);
        }
        return true;
      }
      async function me(t2, n2) {
        if (pe(t2)) {
          if (!hasBoundIdentity()) {
            const first = t2.identity;
            await (0, __contentScope.w)(350);
            const next = await se(`${n2}首次身份复核`);
            if (!pe(next) || !stableIdentitySamples(first, next.identity)) return `unresolved`;
            t2 = next;
          }
          let r2 = t2.identity;
          return await ie({ ...r2, verifiedByManagedLogin: true }, true), S.push(
            `本轮已用账号 ${e.username} 保存的 GitHub 凭据登录，${n2}显示的 ${r2.username ?? r2.email ?? r2.userId} 已连续核对；已保存本站${r2.userId ? `用户 ID ${r2.userId}` : `登录标识 ${r2.username ?? r2.email}`}，以后直接核对本账号绑定`
          ), `confirmed`;
        }
        return r === `github` && o && e.githubCredentialsSubmitted !== true && (S.push(
          `${n2}只显示第三方身份，且本轮沿用的是浏览器里已有的 GitHub 会话，改为用本账号保存的 GitHub 凭据重新登录`
        ), await A() === `started`) ? `switching` : `unresolved`;
      }
      function he(t2) {
        let n2 = t2.identity, r2 = n2?.username ?? n2?.displayName ?? n2?.email;
        return {
          match: `unknown`,
          detail: r2 ? `资料页目前只显示第三方身份 ${r2}，尚未显示站点账号 ${e.username}` : `资料页尚未显示站点账号 ${e.username}`
        };
      }
      function ge() {
        let e2 = y(), t2 = e2.checkin;
        if (!t2?.url || !(0, __contentScope.W)(e2, t2.url)) return null;
        try {
          let n2 = new URL(t2.url, location.href);
          return (0, __contentScope.kf)(e2, t2, location.href) ? null : n2.href;
        } catch {
          return null;
        }
      }
      let _e = (e2) => {
        try {
          let t2 = new URL(e2);
          return `${t2.pathname}${t2.search}`;
        } catch {
          return e2;
        }
      }, ve = (e2) => {
        try {
          let t2 = new URL(e2, location.href);
          return `${t2.pathname}${t2.search}${t2.hash}`;
        } catch {
          return e2;
        }
      };
      async function ye(e2, r2 = 12e4, i2 = true, a2 = 0, stopWhenReady) {
        let o2 = await (0, __contentScope.zu)(S, waitingLoginChallenge, r2, {
          includePendingResponse: i2,
          appearanceWaitMs: a2,
          stopWhenReady
        });
        return o2.resolved ? (o2.detected && await t.markStage(e2, n), o2) : (S.push(`${o2.kind ?? `安全验证`}未在等待时间内完成`), o2);
      }
      async function waitingLoginChallenge(message) {
        if (r === `manual` && manualWaitingStage) {
          if (!t.waitForManualLogin)
            throw Error(`当前运行环境无法保留页面登录任务，请重新加载扩展后重试`);
          await t.waitForManualLogin(message, n);
        } else await t.needsUser(message, n);
      }
      async function be(e2, t2 = 12e4, n2 = true, r2 = 0, stopWhenReady) {
        return (await ye(e2, t2, n2, r2, stopWhenReady)).resolved;
      }
      function E(e2, t2 = 12e4) {
        return be(e2, t2, false);
      }
      const loginVerificationNavigation = {};
      let checkinResultBeforeClick, lastLoginState;
      async function readCurrentLoginState(timeoutMs = 6e3) {
        const state = await (0, __contentScope.readLoginState)(v(), {
          timeoutMs,
          stopOnLoginForm: true,
          diagnostics: S
        });
        lastLoginState = state;
        S.push(loginStateLog(state));
        return state;
      }
      function canStartLogin(state) {
        return state.status === `pending` && [`login_form_visible`, `login_entry_visible`].includes(state.reason);
      }
      function shouldProbeLoginIdentity(state) {
        return state.status === `pending` && ![`login_form_visible`, `login_entry_visible`, `oauth_pending`].includes(state.reason);
      }
      async function stopForUnconfirmedLogin(state) {
        if (state.identity?.identityConflict) {
          const observation = { identity: state.identity };
          await je(observation, ce(observation));
          return null;
        }
        if (state.status === `failed`) return C(`登录状态核验未通过：${state.detail}`);
        await t.needsUser(
          state.status === `blocked` ? `登录步骤尚未完成：${state.detail}。请在本站完成这一项后重新执行。` : `当前登录状态尚未确认：${state.detail}。没有看到可操作的登录表单或登录入口，已保留当前会话；请查看账号详情里的身份读取来源，或在本站资料页补充可核对的身份字段后重试。`,
          n
        );
        return null;
      }
      async function D(e2) {
        if (e2 === `checkin`) {
          const result = (0, __contentScope.Uu)();
          checkinResultBeforeClick = JSON.stringify(result);
        }
        return be(e2, __contentScope.$);
      }
      function loginResultReady() {
        return classifyLoginState((0, __contentScope.readLoginSnapshot)(v())).status === `authenticated`;
      }
      function xe(e2) {
        return be(e2, __contentScope.$, true, 2500, loginResultReady);
      }
      function Se(e2) {
        return ye(e2, __contentScope.$, true, 2500, loginResultReady);
      }
      async function Ce(e2 = 0, r2) {
        let i2 = await (0, __contentScope.Vp)(S, (e3) => t.needsUser(e3, n), __contentScope.$, e2, r2, {
          stopWhenReady: r2 === `页面点击` ? void 0 : () => {
            const result = (0, __contentScope.Uu)();
            return checkinResultBeforeClick !== void 0 && (result.kind === `success` || result.kind === `already`) && JSON.stringify(result) !== checkinResultBeforeClick;
          }
        });
        return i2.resolved ? (i2.detected && (await t.markStage(`checkin`, n), S.push(`本次签到的安全验证处理已结束，继续等待明确的签到结果`)), i2) : (S.push(
          i2.error ? `签到验证未完成：${i2.error}` : `${i2.kind ?? `安全验证`}未在等待时间内完成`
        ), i2);
      }
      async function we(stage, onChallenge) {
        let a2 = await ye(stage);
        if (onChallenge?.(a2), !a2.resolved) {
          lastLoginState = {
            status: `blocked`,
            reason: `challenge_pending`,
            detail: `${a2.kind ?? `安全验证`}尚未完成，暂不确认登录成功`
          };
          S.push(loginStateLog(lastLoginState));
          return false;
        }
        const o2 = async () => {
          await (0, __contentScope.U)(e.site, S, { waitForAppear: true });
          return (0, __contentScope.xr)(v(), S, {
            onResult: (state) => {
              lastLoginState = state;
            }
          });
        };
        if (await o2()) return true;
        if (lastLoginState && shouldProbeLoginIdentity(lastLoginState) && canProbeLoginIdentityPage() && shouldProbeLoginIdentity(classifyLoginState((0, __contentScope.readLoginSnapshot)(v()))) && await enterIdentityPage(
          { identity: lastLoginState.identity ?? null },
          { match: `unknown`, detail: lastLoginState.detail },
          stage,
          { loginVerification: true }
        ))
          throw loginVerificationNavigation;
        let s2 = (0, __contentScope.nr)();
        if (!s2) return false;
        S.push(`检测到${s2}，等待你在当前标签页完成`), await t.needsUser(`${s2}需要你在当前标签页完成`, n);
        let c = Date.now() + 3e5;
        for (; Date.now() < c && (0, __contentScope.nr)(); ) await (0, __contentScope.w)(500);
        return (0, __contentScope.nr)() ? (S.push(`${s2}等待超时`), false) : (S.push(`${s2}已完成，继续验证登录结果`), await t.markStage(stage, n), o2());
      }
      function loginFailureMessage(fallback) {
        return lastLoginState && lastLoginState.status !== `authenticated` ? `${fallback}：${lastLoginState.detail}` : fallback;
      }
      async function O() {
        if ((0, __contentScope.rf)(y()))
          return S.push(`OAuth 会话已建立，账号身份交由个人资料页统一核验`), true;
        let i2 = await se(`OAuth 返回页`), a2 = ce(i2);
        if (i2.identity?.identityConflict) {
          await je(i2, a2);
          return false;
        }
        if (await enterIdentityPage(
          i2,
          a2,
          e.stage.startsWith(`relogin`) ? `relogin-verify` : `verify-oauth`
        ))
          return false;
        if (r === `github` && !hasBoundIdentity()) {
          const binding = await me(i2, `OAuth 返回页`);
          if (binding === `confirmed`) {
            await t.confirmIdentity?.();
            return true;
          }
          if (binding !== `switching`)
            await t.needsUser(
              `GitHub 首次登录身份尚未稳定（${a2.detail}），请核对本站资料页和本账号凭据`,
              n
            );
          return false;
        }
        if (r === `github` && e.githubCredentialsSubmitted === true && i2.identity?.source === `api` && a2.match === `confirmed` && !le(i2, a2) && !ue(i2)) {
          await ie(i2.identity);
          let n2 = i2.identity.username ?? i2.identity.email ?? i2.identity.displayName ?? i2.identity.userId ?? `已验证身份`;
          return S.push(
            `本轮已使用账号 ${e.username} 保存的 GitHub 凭据完成登录；站点返回身份 ${n2}，已建立账号映射并继续签到`
          ), await t.confirmIdentity?.(), true;
        }
        if ((y().checkin?.entry || (0, __contentScope.rf)(y())) && a2.match !== `confirmed` && !le(i2, a2))
          return S.push(`OAuth 返回页身份字段不完整，将进入本站签到页面后核对`), true;
        if (a2.match !== `confirmed` && !le(i2, a2) && i2.identity) {
          let e2 = await me(i2, `OAuth 返回页`);
          if (e2 === `switching`) return false;
          if (e2 === `confirmed`) return await t.confirmIdentity?.(), true;
        }
        let s2 = (0, __contentScope.Qp)({
          loginMethod: r,
          verdict: a2.match,
          expectedUserId: g(),
          siteAccountCount: e.siteAccountCount,
          checkinPageAvailable: !!ge(),
          canSwitchAccount: o
        });
        if (s2.action === `proceed`) {
          if (s2.reason === `confirmed` && i2.identity) {
            let e2 = r === `passkey` ? `Passkey` : r === `github` ? `GitHub OAuth` : `OAuth`;
            await T(i2.identity) ? S.push(`已核对并记住 ${e2} 账号身份：${a2.detail}`) : (S.push(`已核对 ${e2} 当前页面身份：${a2.detail}`), S.push(`当前身份证据不是站点接口结果，只用于本轮核对，不更新账号长期映射`));
          } else S.push(`${r} 登录后仍读不到身份，但本站只有该账号，继续执行`);
          return await t.confirmIdentity?.(), true;
        }
        if (s2.action === `defer-to-checkin-page`)
          return S.push(`OAuth 返回页读不到可核对身份，将在签到页核对后再执行签到`), true;
        if (s2.action === `switch-account`) {
          let e2 = await A();
          return e2 === `started` || await t.needsUser(
            e2 === `exhausted` ? De(a2, `OAuth 返回页`) : `无法同时退出当前站点会话和 GitHub 会话，为避免给错账号签到已停止。`,
            n
          ), false;
        }
        return await t.needsUser(
          a2.match === `mismatch` ? `OAuth 返回后核对到当前登录的是别的账号（${a2.detail}）。请切换到 ${e.username} 后重新签到。` : `OAuth 返回后仍无法确认当前身份，而本站配置了 ${e.siteAccountCount ?? `多个`} 个不同账号。请确认页面登录的是 ${e.username} 后重新签到。`,
          n
        ), false;
      }
      async function k() {
        if (r !== `token` && n.filter((e2) => e2.startsWith(__contentScope.Wm)).length >= __contentScope.Gm)
          return S.push(`账号身份仍不匹配，已达到自动切换次数上限，不再清除 Cookie`), `exhausted`;
        let i2 = await (0, __contentScope.$i)(e.site, S, t.clearSiteCookies);
        formLoginSubmitted = false;
        if (i2.cookieMayRemain && t.clearSiteCookies) return `blocked`;
        if (r === `token`)
          return i2.cookieMayRemain && !t.clearSiteCookies ? (S.push(`该站点凭据只存在本地，清空即已退出，无需重载页面`), `cleared`) : i2.cookieMayRemain ? `blocked` : `cleared`;
        return S.push(
          i2.cookieMayRemain ? `${__contentScope.Wm} 本地登录态已清空，重新打开登录页以彻底退出` : `${__contentScope.Wm} 本站浏览器 Cookie 已清除，重新打开登录页`
        ), await t.navigate(e.site.loginUrl, n, `login`), `reloading`;
      }
      async function A() {
        return !o || !t.startGithubLogout ? `blocked` : n.some((e2) => e2.startsWith(__contentScope.Km)) ? `exhausted` : (await (0, __contentScope.$i)(e.site, S, t.clearSiteCookies)).cookieMayRemain ? `blocked` : (S.push(`${__contentScope.Km} 已退出站点账号，正在退出当前 GitHub 会话`), await t.startGithubLogout(n), `started`);
      }
      async function Te() {
        if (!e.site.tokenConfig)
          return C(`站点未配置 Token 参数（存储键名/请求头），请在站点编辑里补全`);
        let n2 = e.session;
        if (!n2?.accessToken && !e.apiToken)
          return C(`该账号还没有登录凭据；请手动登录该站点一次后点「抓取登录态」`);
        let r2 = await (0, __contentScope.$i)(e.site, S, t.clearSiteCookies);
        if (t.clearSiteCookies && r2.cookieMayRemain)
          return C(`无法清除本站浏览器 Cookie，为避免复用其他账号会话已停止`);
        let i2 = n2?.accessToken ?? e.apiToken;
        if (!(0, __contentScope.ea)(e.site, i2, S)) return C(`Token 注入失败，无法继续`);
        if (n2) {
          let r3 = await (0, __contentScope.am)(e.site, n2, S);
          if (r3.status === `expired`) return C(`${r3.reason}；请重新登录该站点后再点「抓取登录态」`);
          r3.status === `refreshed` && (i2 = r3.tokens.accessToken, await t.saveSession?.(r3.tokens));
        }
        let a2 = await (0, __contentScope.qi)(v(), i2, { diagnostics: S });
        if (!a2)
          return C(
            n2 ? `登录凭据已失效，请重新登录该站点后点「抓取登录态」` : `Token 无效或已过期，请重新从站点获取`
          );
        if (!hasBoundIdentity() && a2.source === `api` && identitySampleKey(a2) && !ue({ identity: a2 })) {
          await (0, __contentScope.w)(350);
          const next = await (0, __contentScope.qi)(v(), i2, { diagnostics: S });
          if (!stableIdentitySamples(a2, next) || ue({ identity: next }))
            return C(`本账号 Token 返回的身份尚未形成稳定样本，已停止首次绑定和签到`);
          if (!t.saveIdentity) return C(`无法保存本账号首次确认的 Token 身份，请重新加载扩展后重试`);
          a2 = { ...next, verifiedByManagedLogin: true };
          await ie(a2, true);
          S.push(`已使用本账号 Token 确认本站${g() ? `用户 ID ${g()}` : `登录标识 ${m ?? h}`}`);
        }
        let o2 = ce({ identity: a2 });
        return o2.match !== `confirmed` ? C(
          o2.match === `mismatch` ? `凭据对应的不是本账号：${o2.detail}；请重新抓取该账号的登录态` : `Token 身份尚未确认：${o2.detail}；已停止签到，请核对本账号的登录态`
        ) : (S.push(`Token 认证成功：${a2.email ?? a2.username ?? a2.userId}`), await t.confirmIdentity?.(), await (0, __contentScope.U)(e.site, S, { waitForAppear: true }), M(true));
      }
      async function Ee(r2, i2 = false) {
        if (r2.status === `interrupted`) return r2.terminal ? C(r2.message) : null;
        if (r2.status === `navigate`) {
          let i3 = ve(r2.url), a3 = Math.max((0, __contentScope.oh)(n, __contentScope.Zm), (0, __contentScope.ch)(n)), routeSteps = n.slice(a3 + 1), o2 = (0, __contentScope.ah)(routeSteps), s2 = o2.filter((e2) => (0, __contentScope.ph)(e2, i3)).length, c = (0, __contentScope.dh)([...o2, i3]), l2 = (0, __contentScope.mh)(routeSteps), u2 = s2 >= __contentScope.Qm ? `签到页 ${i3} 已跳转 ${s2} 次仍未到达（站点把它重定向到了 ${ve(location.href)}）` : c ? `签到页在 ${c.first} 与 ${c.second} 之间往返：站点每次都把当前页 ${ve(location.href)} 重定向回去，再跳只是原样重复` : !(0, __contentScope.af)(y()) && l2 >= __contentScope.$m ? `当前页 ${ve(location.href)} 不在学习路线上，已为此跳了 ${l2} 次仍未落到路线上` : null;
          if (u2) {
            let r3 = (0, __contentScope.sf)(y()), a4 = (0, __contentScope.lh)(n);
            if (r3 && !a4)
              return S.push(`身份核验页无法到达，拒绝降级绕过身份核验执行签到：${u2}`), await t.needsUser(
                `身份核验页未能到达：${u2}。本轮跳转预算已用尽，已停止签到；请检查身份核验页是否被站点重定向，确认可以打开后重试。`,
                n
              ), null;
            if ((0, __contentScope.rf)(y()))
              return S.push(`${u2}，学习路线无法继续，已停止本次回放`), await t.needsUser(
                `学习路线无法继续：${u2}。已保存的流程仍保留；请确认站点页面可正常打开后重试，页面已改版时重新学习。`,
                n
              ), null;
            S.push(`${u2}，改为在当前页直接寻找签到入口`);
            let s3 = await (0, __contentScope.Nf)(b(), S, re);
            if (s3.status === `success` || s3.status === `already`) return Ee(s3);
            let c2 = new Set(o2);
            c2.add(ve(location.href));
            let l3 = __contentScope.th.find((t2) => !c2.has(t2) && (0, __contentScope.W)(e.site, t2));
            return l3 ? (S.push(`${__contentScope.Xm}${l3}`), S.push(`当前页没有签到入口，改试常见签到路由 ${l3}`), await t.navigate(new URL(l3, location.href).href, n, `checkin`), null) : C(
              `签到页 ${i3} 无法到达（站点重定向到 ${ve(location.href)}），已试过 ${[...c2].join(`、`)} 都没有签到入口。请打开站点编辑，把签到页改成实际地址`
            );
          }
          return S.push(`${__contentScope.Xm}${i3}`), await t.navigate(r2.url, n, `checkin`), null;
        }
        if (r2.status === `relogin`)
          return S.push(r2.message), await t.navigate(r2.url, n, `relogin`), null;
        let a2 = /* @__PURE__ */ new Set([...r2.claimTextsUsed ?? [], ...r2.claimTextUsed ? [r2.claimTextUsed] : []]);
        for (let e2 of a2) await t.saveClaimText?.(e2);
        if ((r2.status === `success` || r2.status === `already`) && t.saveCheckinReward?.(document.body?.innerText ?? ``).catch(() => {
        }), r2.status === `failed`)
          return ee(r2.message, r2.metrics);
        if (r2.status === `skipped`) return C(r2.message, r2.metrics);
        if (r2.status === `unverified`) {
          let e2 = i2 ? `本轮已登录，但没有签到动作可确认，未执行签到。` : `打开时已登录，本轮没有重新登录，无法把「登录即签到」归因到本轮，未执行签到。`, a3 = i2 ? `请打开该站点标签页确认余额是否已经增加。` : `若确认今天的额度已经到账，可在账号行手动标记完成；想每轮都强制退出再登录，请把本站签到方式改成「退出再登录」。`, o2 = /[。！？]$/.test(r2.message) ? `` : `。`, s2 = `${e2}${r2.message}${o2}${a3}`;
          return S.push(s2), await t.needsUser(s2, n), null;
        }
        return te(r2.message, r2.metrics);
      }
      function De(t2, n2) {
        return t2.match === `mismatch` ? `已自动切换过 GitHub 账号，但${n2}明确核对到的仍不是 ${e.username}（${t2.detail}）；请检查该账号保存的 GitHub 凭据` : `已自动切换过 GitHub 账号，但${n2}仍未读取到足够的身份信息（${t2.detail}）；这不能证明 GitHub 凭据错误，已停止签到以避免记到错误账号`;
      }
      function Oe(e2, t2) {
        let n2 = e2.identity, r2 = [
          `URL ${location.href}`,
          `来源 ${n2?.source ?? `none`}`,
          ...n2?.endpoint ? [`实时接口 ${n2.endpoint}`] : [],
          ...n2?.evidence === `structured-fields` ? [`页面证据 来自明确的资料字段`] : [],
          ...n2?.evidence === `profile-card` ? [`页面证据 来自个人设置中的当前用户卡片`] : [],
          ...n2?.identityConflict ? [`身份证据冲突 ${n2.identityConflict}`] : [],
          `目标 userId ${g() ?? `尚未绑定`}`,
          `userId ${n2?.userId ?? `未读取`}`,
          `username ${n2?.username ?? `未读取`}`,
          `email ${n2?.email ?? `未读取`}`,
          `displayName ${n2?.displayName ?? `未读取`}`,
          `页面账号旁证 ${e2.pageAccountMatch ?? `未命中`}`,
          `受控身份别名 ${a ?? `未配置`}`,
          `结论 ${t2.match}: ${t2.detail}`
        ];
        S.push(`身份页诊断：${r2.join(`；`)}`);
      }
      function j() {
        let t2 = (0, __contentScope.Bi)(), n2 = (0, __contentScope.Gi)(e.username);
        return t2 ? { identity: t2, ...n2 ? { pageAccountMatch: n2.matched } : {} } : {
          identity: n2 ? { username: e.username, source: `visible` } : null,
          ...n2 ? { pageAccountMatch: n2.matched } : {}
        };
      }
      async function ke() {
        let e2 = await se(`个人资料页`), t2 = de(e2, ce(e2));
        if (canEstablishFormIdentity(e2)) {
          const firstIdentity = e2.identity;
          await (0, __contentScope.w)(650);
          const next = await se(`个人资料页`);
          if (canEstablishFormIdentity(next) && stableIdentitySamples(firstIdentity, next.identity)) {
            return {
              evidence: { ...next, managedLoginStable: true },
              verdict: de(next, ce(next))
            };
          }
          return {
            evidence: next,
            verdict: {
              match: `unknown`,
              detail: `本账号首次登录后的身份尚未形成一致的稳定样本`
            }
          };
        }
        if (!(y().checkin?.entry || (0, __contentScope.cf)(y()) || y().identitySource?.pagePath) && !e2.identity?.identityConflict)
          return { evidence: e2, verdict: t2 };
        S.push(
          e2.identity?.source === `api` ? `已读取实时身份接口，复核用户 ID 是否稳定` : `身份信息尚未稳定，继续复查实时接口和可见资料字段`
        );
        let n2 = Date.now() + __contentScope.nh, r2 = JSON.stringify({
          identity: identitySampleKey(e2.identity),
          pageAccountMatch: e2.pageAccountMatch,
          match: t2.match
        }), i2 = 1, a2 = 300;
        for (; Date.now() < n2; ) {
          await (0, __contentScope.w)(a2);
          a2 = Math.min(1200, a2 + 180);
          e2 = await se(`个人资料页`);
          t2 = de(e2, ce(e2));
          let n3 = JSON.stringify({
            identity: identitySampleKey(e2.identity),
            pageAccountMatch: e2.pageAccountMatch,
            match: t2.match
          });
          i2 = n3 === r2 ? i2 + 1 : 1;
          r2 = n3;
          if (t2.match === `confirmed` && i2 >= 2 || t2.match === `mismatch` && i2 >= 2 && fe(e2, t2))
            return { evidence: e2, verdict: t2 };
        }
        return i2 < 2 && S.push(`个人资料页身份在等待期内仍未形成连续稳定样本`), t2.match === `mismatch` && !fe(e2, t2) ? (S.push(`个人资料页只读到第三方句柄，不能据此判定 GitHub 凭据错误或自动切换账号`), { evidence: e2, verdict: he(e2) }) : { evidence: e2, verdict: t2 };
      }
      async function Ae() {
        let { evidence: e2, verdict: t2 } = await ke();
        return je(e2, t2);
      }
      async function je(a2, s2) {
        if (a2.identity?.identityConflict) {
          Oe(a2, s2);
          await t.needsUser(
            `身份证据冲突：${a2.identity.identityConflict}。本次目标用户 ID ${g() ?? `尚未绑定`}；未能确认当前登录身份，已停止签到，请等待页面加载完成后重试。`,
            n
          );
          return { proceed: false, result: null };
        }
        if (r === `manual` && (s2.match !== `confirmed` || !hasBoundIdentity() && !matchesManualAccount(a2.identity))) {
          Oe(a2, s2);
          await t.needsUser(
            `页面登录身份尚未确认是账号 ${e.username}（${s2.detail}）。请在本站完成目标账号登录后重试。`,
            n
          );
          return { proceed: false, result: null };
        }
        if (r === `auto` && !hasBoundIdentity()) {
          S.push(`首次使用本站流程，先识别登录页并使用本账号凭据建立身份`);
          const switched = await k();
          return {
            proceed: false,
            result: switched === `reloading` ? null : C(`本账号首次身份尚未建立，请确认登录页和账号凭据后重试`)
          };
        }
        let c = !!y().checkin?.entry || (0, __contentScope.cf)(y());
        if (r === `form` && !hasBoundIdentity()) {
          if (canEstablishFormIdentity(a2) && a2.managedLoginStable === true) {
            if (!t.saveIdentity) {
              return {
                proceed: false,
                result: C(`无法保存本账号首次确认的身份，请重新加载扩展后重试`)
              };
            }
            try {
              await ie({ ...a2.identity, verifiedByManagedLogin: true }, true);
            } catch (error) {
              return {
                proceed: false,
                result: C(
                  `本账号首次身份未能保存，已停止签到：${error instanceof Error ? error.message : String(error)}`
                )
              };
            }
            S.push(
              `已使用本账号凭据登录并确认本站${g() ? `用户 ID ${g()}` : `登录标识 ${m ?? h}`}，继续使用本站统一签到流程`
            );
            (0, __contentScope.cf)(y()) && S.push(__contentScope.rh);
            await t.confirmIdentity?.();
            return { proceed: true };
          }
          if (!formLoginSubmitted) {
            S.push(`首次使用本站统一签到流程，先用本账号的凭据重新登录并建立独立身份`);
            const switched = await k();
            return {
              proceed: false,
              result: switched === `reloading` ? null : C(
                switched === `blocked` ? `无法清除当前站点会话，已停止本账号首次登录；请检查 Cookie 权限后重试` : `本账号首次身份确认未完成，已停止自动重试；请检查登录凭据和站点页面`
              )
            };
          }
          Oe(a2, s2);
          await t.needsUser(
            `本站统一签到流程已保存，但本次登录后尚未确认本账号的稳定身份（${s2.detail}）。已停止签到，请确认账号凭据及身份页加载完成后重试。`,
            n
          );
          return { proceed: false, result: null };
        }
        if (r === `github` && !hasBoundIdentity()) {
          const binding = await me(a2, `个人资料页`);
          if (binding === `confirmed`) {
            (0, __contentScope.cf)(y()) && S.push(__contentScope.rh);
            await t.confirmIdentity?.();
            return { proceed: true };
          }
          if (binding === `switching`) return { proceed: false, result: null };
          Oe(a2, s2);
          await t.needsUser(
            `GitHub 首次登录身份尚未稳定（${s2.detail}），已停止签到并保留原账号数据`,
            n
          );
          return { proceed: false, result: null };
        }
        if (s2.match === `unknown` && i && a2.identity) {
          let e2 = await me(a2, `个人资料页`);
          if (e2 === `switching`) return { proceed: false, result: null };
          if (e2 === `confirmed`)
            return (0, __contentScope.cf)(y()) && S.push(__contentScope.rh), await t.confirmIdentity?.(), { proceed: true };
        }
        if (c && s2.match === `unknown`)
          return Oe(a2, s2), await t.needsUser(
            `身份核验页仍未显示可核对的账号身份（${s2.detail}）。已停止签到和奖励读取，请确认该页面已完整加载后重试；若这一页不显示当前账号，请更新本站统一流程的身份核验页，本站账号会共用更新后的路线。`,
            n
          ), { proceed: false, result: null };
        let l2 = (0, __contentScope.Qp)({
          loginMethod: r,
          verdict: s2.match,
          expectedUserId: g(),
          siteAccountCount: e.siteAccountCount,
          identityConfirmedThisRun: s2.match === `unknown` && !c && e.identityConfirmed,
          checkinPageAvailable: false,
          canSwitchAccount: o
        });
        if (l2.action === `proceed`)
          return l2.reason === `confirmed` ? (a2.identity && !await T(a2.identity) && S.push(`个人资料页身份只来自页面或本地副本，本轮核对通过但不更新长期账号映射`), S.push(`个人资料页已核对账号身份：${s2.detail}`), (0, __contentScope.cf)(y()) && S.push(__contentScope.rh), await t.confirmIdentity?.()) : l2.reason === `already-confirmed-this-run` ? S.push(`本轮登录账号已经确认，签到页暂未返回额外身份字段，继续签到`) : S.push(`个人资料页读不到可核对的身份，但本站只有该账号，继续签到`), { proceed: true };
        if (Oe(a2, s2), l2.action === `handoff` || l2.action === `defer-to-checkin-page`)
          return await t.needsUser(
            s2.match === `mismatch` ? `个人资料页当前登录的不是账号 ${e.username}（${s2.detail}）。已停止签到和奖励读取，请切换账号后重试。` : `个人资料页无法确认当前登录的是账号 ${e.username}，而本站配置了 ${e.siteAccountCount ?? `多个`} 个不同账号。已停止签到和奖励读取，请确认账号后重试。`,
            n
          ), { proceed: false, result: null };
        if (l2.action === `switch-account`) {
          if (o) {
            let e2 = await A();
            return e2 === `started` ? { proceed: false, result: null } : {
              proceed: false,
              result: C(
                e2 === `exhausted` ? De(s2, `个人资料页`) : `无法清除当前站点的浏览器 Cookie，为避免给错账号签到已停止；请检查扩展 Cookie 权限或残留项`
              )
            };
          }
          let r2 = await k();
          return r2 === `reloading` ? { proceed: false, result: null } : r2 === `exhausted` ? {
            proceed: false,
            result: C(
              `个人资料页身份仍不匹配，已达到自动切换次数上限；请检查本账号凭据和本站用户 ID 绑定`
            )
          } : r2 === `blocked` ? {
            proceed: false,
            result: C(
              `无法清除当前站点的浏览器 Cookie，为避免给错账号签到已停止；请检查扩展 Cookie 权限或残留项`
            )
          } : (await t.navigate(e.site.loginUrl, n, `login`), { proceed: false, result: null });
        }
        return {
          proceed: false,
          result: C(`个人资料页核对到账号不符：${s2.detail}；已停止签到和奖励读取`)
        };
      }
      async function Me(r2) {
        let i2 = y();
        if (!(0, __contentScope.p)(i2)) return null;
        if (!(0, __contentScope.W)(i2, location.href))
          return {
            status: `interrupted`,
            message: `学习流程已离开本站，停止页面操作`,
            terminal: true
          };
        if (r2.phase !== `action` && await (0, __contentScope.U)(i2, S, { waitForAppear: false }), r2.phase !== `action`) {
          let e2 = await Ce();
          if (!e2.resolved)
            return {
              status: `interrupted`,
              message: e2.error ?? `学习流程的人机验证未完成，已停止操作`,
              terminal: true
            };
        }
        let a2 = (0, __contentScope.An)(i2) && !(0, __contentScope.ir)(i2), o2 = (0, __contentScope.xm)(`${location.pathname}${location.hash}`) && !(0, __contentScope.ir)(i2), s2 = a2 || o2 || r2.phase === `result` || r2.phase === `action` || r2.phase === `after` && r2.step?.type === `assert` ? await (0, __contentScope.qi)(v(), void 0, { serverOnly: true }) : null, c = s2?.source === `api` ? { identity: s2 } : j(), l2 = ce(c);
        if (c.identity?.identityConflict) {
          await je(c, l2);
          return {
            status: `interrupted`,
            message: `身份证据冲突：${c.identity.identityConflict}，已停止签到`,
            terminal: true
          };
        }
        if (fe(c, l2)) {
          S.push(`学习流程中检测到账号变化：${l2.detail}`);
          let e2 = await je(c, de(c, l2));
          if (!e2.proceed)
            return e2.result ? { status: `interrupted`, message: e2.result.message, terminal: true } : {
              status: `interrupted`,
              message: `账号已变化，正在切换到目标账号后重新执行`
            };
        }
        if ((a2 || o2) && s2?.source !== `api`) {
          const loginState = await readCurrentLoginState();
          if (loginState.status === `authenticated`) return null;
          if (!canStartLogin(loginState)) {
            await stopForUnconfirmedLogin(loginState);
            return {
              status: `interrupted`,
              message: `学习流程中的登录状态尚未确认：${loginState.detail}`,
              terminal: true
            };
          }
          let r3 = `学习流程中登录状态已失效，需要重新登录`, i3 = n.filter((e2) => e2.startsWith(__contentScope.qm)).length;
          return i3 >= __contentScope.Jm ? {
            status: `interrupted`,
            message: `${r3}；自动恢复 ${__contentScope.Jm} 次仍未保持会话`,
            terminal: true
          } : (S.push(`${__contentScope.qm} ${i3 + 1}/${__contentScope.Jm}，返回登录页重新认证`), (0, __contentScope.di)(), await t.navigate(e.site.loginUrl, n, `login`), { status: `interrupted`, message: r3 });
        }
        return null;
      }
      async function M(r2 = false) {
        let i2 = y();
        if ((0, __contentScope.p)(i2) && ((0, __contentScope.xm)(`${location.pathname}${location.hash}`) || (0, __contentScope.An)(i2) && !(0, __contentScope.ir)(i2))) {
          let e2 = await Me({ phase: `before` });
          if (e2) return e2.status === `failed` || e2.terminal ? C(e2.message) : null;
        }
        let a2 = i2.checkin?.method === `none`, o2 = i2.checkin?.entry, s2 = i2.checkin?.method === `button` && !ge(), c = (0, __contentScope.rf)(i2), l2 = (0, __contentScope.sf)(i2);
        if (c && !l2)
          return S.push(`学习签到路线缺少身份核验页`), await t.needsUser(
            `本站统一签到流程没有记录到可核验账号的身份页；请用本站任一账号更新流程，先访问能显示当前账号的个人资料页，再完成签到并结束学习。更新后本站账号共用这条路线。`,
            n
          ), null;
        let u2 = (0, __contentScope.of)(i2, _), d2 = (0, __contentScope.cf)(i2), f3 = (0, __contentScope.lh)(n);
        if (!c && !e.identityConfirmed) {
          const observation = await se(`签到前的页面`), verdict = ce(observation);
          if (await enterIdentityPage(observation, verdict, `checkin`)) return null;
        }
        if (l2 && !f3 && !d2 && (g() || formLoginSubmitted || e.githubCredentialsSubmitted)) {
          const first = await (0, __contentScope.qi)(v(), void 0, { serverOnly: true });
          if (first?.source === `api` && first.userId && !first.identityConflict) {
            await (0, __contentScope.w)(350);
            const next = await (0, __contentScope.qi)(v(), void 0, { serverOnly: true });
            if (next?.source === `api` && next.userId === first.userId && !next.identityConflict) {
              const observation = { identity: next, managedLoginStable: true }, verdict = de(observation, ce(observation));
              S.push(
                `当前用户接口已连续确认用户 ID ${next.userId}，目标 ${g() ?? `首次建立身份`}（${next.endpoint ?? `本站身份接口`}）`
              );
              const gate = await je(observation, verdict);
              if (!gate.proceed) return gate.result ?? null;
              S.push(__contentScope.rh);
              f3 = true;
            } else S.push(`当前用户接口身份尚未稳定，继续沿本站流程进入资料页复核`);
          }
        }
        if (l2 && u2 && !f3 && !d2)
          return S.push(`已到达签到目标页但本轮尚未核验个人资料身份，先返回 identityPath`), Ee({ status: `navigate`, url: l2 });
        if (a2 && l2 && !d2 && !f3)
          return S.push(`登录即签到：先按学习路线前往身份核验页 ${l2}`), r2 && S.push(`${__contentScope.ih}${e.username}`), Ee({ status: `navigate`, url: l2 });
        let m2 = c && !u2, h2 = l2 ? d2 : e.stage === `checkin` || !!o2 || s2 || u2;
        if ((o2 || i2.checkin?.method === `button` && e.stage !== `checkin`) && await t.markStage(`checkin`, n), h2) {
          if (!await be(`checkin`)) return C(`安全验证超时，请完成后重新签到`);
          await (0, __contentScope.U)(i2, S, { waitForAppear: true });
        }
        if (o2) {
          let e2 = await (0, __contentScope.kp)(i2, S, {
            beforeAction: () => be(`checkin`, __contentScope.$)
          });
          if (e2.status === `navigate`) return await t.navigate(e2.url, n, `checkin`), null;
          if (e2.status === `failed`) return C(e2.message);
          await (0, __contentScope.U)(i2, S, { waitForAppear: true });
        }
        if (l2 ? h2 : h2 && !m2) {
          if (!await be(`checkin`, __contentScope.$))
            return C(`个人资料页身份核对前的人机验证未完成`);
          let e2 = await Ae();
          if (!e2.proceed) return e2.result;
        }
        let workflowSite = y(), loginHappened = r2 || (0, __contentScope.uh)(n), baseline = loginHappened ? e.context?.loginCheckinBalanceBefore : void 0, actionOptions = workflowSite.checkin?.method === `none` ? {
          ...re,
          loginHappenedThisRun: loginHappened,
          ...baseline ? { loginCheckinBalanceBefore: baseline } : {}
        } : re;
        return Ee(await (0, __contentScope.Nf)(workflowSite, S, actionOptions), loginHappened);
      }
      try {
        let a2 = (0, __contentScope.Wp)();
        if (a2) {
          let r2 = n.filter((e2) => e2.startsWith(__contentScope.Hm)).length;
          if (a2.retryable && r2 < __contentScope.Vm.length) {
            let i2 = r2 + 1;
            return S.push(`${__contentScope.Hm} ${i2}/${__contentScope.Vm.length}: ${a2.message}`), await (0, __contentScope.w)(__contentScope.Vm[r2]), await t.navigate(location.href, n, e.stage), null;
          }
          return C(`${a2.message}，已停止本次签到；这不是表单选择器问题`);
        }
        if (r === `manual` && [`login`, `relogin`].includes(e.stage)) {
          if (!t.waitForManualLogin)
            throw Error(`当前运行环境无法保留页面登录任务，请重新加载扩展后重试`);
          manualWaitingStage = e.stage === `relogin` ? `relogin-verify-manual` : `verify-manual`;
          await t.markStage(manualWaitingStage, n);
        }
        let s2 = await (0, __contentScope.Lu)(S, waitingLoginChallenge);
        if (!s2.resolved) return C(`${s2.kind ?? `Cloudflare 安全验证`}超时，请完成后重新签到`);
        switch (s2.detected && await t.markStage(e.stage, n), e.stage) {
          case `verify-manual`:
          case `relogin-verify-manual`: {
            const verification = await waitManualLogin(e.stage);
            return verification.confirmed ? e.stage === `relogin-verify-manual` ? ae(`退出后页面登录`) : M(true) : verification.conflict ? null : C(verification.detail);
          }
          case `checkin`:
            return M((0, __contentScope.uh)(n));
          case `verify`:
            if (await (0, __contentScope.w)(800), location.origin !== (0, __contentScope.Dr)(e.site))
              return C(`登录跳转到了非本站页面，已停止自动操作`);
            if (!await we(`verify`))
              return C(loginFailureMessage(`未找到明确的登录成功证据(${location.pathname})`));
            if (S.push(`登录结果已确认(${location.pathname})`), !(0, __contentScope.rf)(y())) {
              let i2 = await se(`登录后的页面`), r2 = i2.identity, a3 = de(i2, ce(i2));
              if (r2?.identityConflict) {
                await je(i2, a3);
                return null;
              }
              if (await enterIdentityPage(i2, a3, `verify`)) return null;
              if (r2 === `form` && !hasBoundIdentity()) return M(true);
              if (a3.match === `mismatch`)
                return S.push(`登录后的账号身份不匹配：${a3.detail}`), await t.needsUser(
                  `登录后的账号不是 ${e.username}（${a3.detail}），已停止签到并保留原账号绑定。`,
                  n
                ), null;
              if (g() && a3.match !== `confirmed`) {
                Oe(i2, a3);
                await t.needsUser(
                  `登录身份核验未通过：${a3.detail}。本账号已绑定用户 ID ${g()}，本轮尚未确认该 ID，已停止签到。`,
                  n
                );
                return null;
              }
              a3.match === `confirmed` && r2 && await T(r2), await t.confirmIdentity?.();
            }
            return M(true);
          case `verify-oauth`:
            return await (0, __contentScope.w)(1200), location.origin === (0, __contentScope.Dr)(e.site) ? await we(`verify-oauth`) ? (S.push(`OAuth 授权完成，已跳回本站(${location.pathname})`), await O() ? M(true) : null) : C(loginFailureMessage(`OAuth 授权后缺少明确的登录成功证据`)) : C(`OAuth 尚未返回本站，请在授权页完成操作`);
          case `relogin`:
            S.push(`开始第二次登录以完成签到`);
            await (0, __contentScope.U)(e.site, S, { waitForAppear: true });
            if (r !== `token`) {
              const loginState = await readCurrentLoginState();
              if (loginState.status === `authenticated`)
                return S.push(`站点退出后会话仍然有效（${loginState.detail}），退出没有生效`), await t.needsUser(
                  `本站的退出操作没有真正结束会话（${loginState.detail}），无法完成「退出再登录」。请核对本站退出流程后重新执行。`,
                  n
                ), null;
              if (!canStartLogin(loginState)) {
                await t.needsUser(
                  `退出后的登录状态尚未确认：${loginState.detail}。没有看到登录表单或登录入口，已停止第二次登录；请核对本站退出流程及当前页面。`,
                  n
                );
                return null;
              }
              S.push(`退出后已显示登录入口，开始本账号的第二次登录`);
              (0, __contentScope.di)();
            }
            if (r === `auto` && !await resolvePageMethod(1500))
              return C(`当前登录页尚未显示可识别的登录方式，请等待页面加载完成后重试`);
            if (r === `token`) {
              let t2 = e.session;
              if (!t2?.accessToken && !e.apiToken)
                return C(`该账号未填写 API Token 也没有抓取登录态，无法完成第二次登录`);
              let n2 = t2?.accessToken ?? e.apiToken;
              if (!(0, __contentScope.ea)(e.site, n2, S)) return C(`Token 注入失败，第二次登录未完成`);
              let r2 = await (0, __contentScope.qi)(v(), n2);
              if (!r2) return C(`第二次注入 Token 后仍读不到身份，签到未完成`);
              const observation = { identity: r2 }, verdict = ce(observation);
              if (verdict.match !== `confirmed`)
                return C(`第二次 Token 身份未能确认：${verdict.detail}，签到未完成`);
              S.push(`第二次 Token 认证成功：${r2.email ?? r2.username ?? r2.userId}`);
              return ae(`退出后重新登录（Token）`, r2);
            }
            if (r === `manual`) return beginManualLogin(true);
            return i ? (await (0, __contentScope.U)(e.site, S, { waitForAppear: true }), await E(`relogin`, __contentScope.$) ? (await (0, __contentScope.mr)(
              e.site,
              S,
              r === `github` ? `github` : r === `passkey` ? `passkey` : `oauth`,
              { beforeClick: () => E(`relogin`, __contentScope.$) }
            ), await be(`relogin`) ? await (0, __contentScope.vr)(
              e.site,
              S,
              {
                beforeClick: () => D(`relogin`),
                afterClick: () => xe(`relogin-verify`),
                beforeAuxiliaryClick: () => E(`relogin`, __contentScope.$),
                beforeNavigate: () => t.markStage(`relogin-verify`, n)
              },
              r === `github` ? `github` : r === `passkey` ? `passkey` : `oauth`
            ) ? await (0, __contentScope.yr)(e.site, S) ? null : await we(`relogin-verify`) ? await O() ? ae(
              `退出后重新登录（${r === `passkey` ? `Passkey` : r === `github` ? `GitHub OAuth` : `OAuth`}）`
            ) : null : C(
              loginFailureMessage(
                `第二次${r === `passkey` ? ` Passkey` : ` OAuth`} 登录未确认成功`
              )
            ) : C(
              `未找到${r === `passkey` ? ` Passkey` : ` OAuth`} 按钮，无法完成第二次登录`
            ) : C(`安全验证超时，请完成后重新签到`)) : C(`展开第二次登录入口前的人机验证未完成`)) : (await (0, __contentScope.pr)(e.site, S, {
              beforeClick: () => E(`relogin`, __contentScope.$)
            }), await (0, __contentScope.hr)(
              e.site,
              e.username,
              e.password,
              S,
              async () => (await t.markStage(`relogin`, n), D(`relogin`)),
              () => E(`relogin`, __contentScope.$)
            ) ? (await (0, __contentScope.U)(e.site, S), await (0, __contentScope.gr)(e.site, S, {
              beforeClick: () => beforeFormSubmit(`relogin`),
              afterClick: () => xe(`relogin-verify`),
              beforeAuxiliaryClick: () => E(`relogin`, __contentScope.$),
              beforeNavigate: () => t.markStage(`relogin-verify`, n)
            }) ? await we(`relogin-verify`) ? ae(`退出后重新登录`) : C(loginFailureMessage(`第二次登录未确认成功`)) : C(`未能提交登录表单`)) : C(ne()));
          case `relogin-verify`:
            return await (0, __contentScope.w)(1e3), await we(`relogin-verify`) ? i && !await O() ? null : (S.push(`第二次登录结果已确认，继续核验账号身份`), ae(`退出后重新登录`)) : C(loginFailureMessage(`重新登录后缺少明确的登录成功证据，签到未完成`));
          default: {
            S.push(`开始处理站点「${e.site.name}」账号 ${e.username}`), await (0, __contentScope.U)(e.site, S, { waitForAppear: true });
            const initialLoginState = await readCurrentLoginState();
            let i2 = initialLoginState.status === `authenticated`, a3 = initialLoginState?.status === `authenticated` ? initialLoginState.identity : null;
            if (shouldProbeLoginIdentity(initialLoginState) && canProbeLoginIdentityPage() && shouldProbeLoginIdentity(
              classifyLoginState((0, __contentScope.readLoginSnapshot)(v()))
            ) && await enterIdentityPage(
              { identity: initialLoginState.identity ?? null },
              { match: `unknown`, detail: initialLoginState.detail },
              e.stage,
              { loginVerification: true }
            ))
              throw loginVerificationNavigation;
            if (!i2 && r !== `token`) {
              if (!canStartLogin(initialLoginState))
                return stopForUnconfirmedLogin(initialLoginState);
              S.push(`页面已明确显示登录入口，开始使用本账号保存的登录方式`);
              (0, __contentScope.di)();
            }
            if (i2) {
              if (r === `manual`) {
                const verification = await confirmManualIdentity();
                if (verification.confirmed) return M((0, __contentScope.uh)(n));
                await t.needsUser(
                  `当前页面登录身份尚未确认是账号 ${e.username}（${verification.detail}）。请完成目标账号登录后重试。`,
                  n
                );
                return null;
              }
              if ((r === `form` || r === `auto`) && !hasBoundIdentity() && !formLoginSubmitted) {
                S.push(`首次确认本账号身份，先结束现有会话并使用本账号凭据登录`);
                const switched = await k();
                if (switched === `reloading`) return null;
                return C(
                  switched === `blocked` ? `无法清除当前站点会话，已停止本账号首次登录；请检查 Cookie 权限后重试` : `本账号首次身份确认未完成，已停止自动重试；请检查登录凭据和站点页面`
                );
              }
              if (r === `github` && !hasBoundIdentity() && e.githubCredentialsSubmitted !== true) {
                S.push(`首次确认本站 GitHub 身份，先使用本账号保存的凭据重新登录`);
                const switched = await A();
                return switched === `started` ? null : C(`GitHub 首次身份需要本账号的登录凭据，请检查已保存的 GitHub 用户名和密码`);
              }
              if (e.identityConfirmed)
                return S.push(`本轮已确认过登录账号，直接继续`), await (0, __contentScope.U)(e.site, S, { waitForAppear: true }), M((0, __contentScope.uh)(n));
              if (y().checkin?.entry || (0, __contentScope.rf)(y()))
                return M((0, __contentScope.uh)(n));
              let i3 = a3 ? { identity: a3 } : await se(`当前页`), s4 = ce(i3), c2 = (0, __contentScope.Qp)({
                loginMethod: r,
                verdict: s4.match,
                expectedUserId: g(),
                siteAccountCount: e.siteAccountCount,
                checkinPageAvailable: !!ge(),
                canSwitchAccount: o
              });
              if (await enterIdentityPage(i3, s4, `checkin`)) return null;
              if (i3.identity?.identityConflict) {
                await je(i3, s4);
                return null;
              }
              if (c2.action === `defer-to-checkin-page`) {
                let e2 = ge();
                return S.push(`当前页读不到可核对的身份，先进入签到页 ${_e(e2)} 再核对账号`), await t.navigate(e2, n, `checkin`), null;
              }
              if (c2.action === `proceed`)
                return c2.reason === `confirmed` ? (S.push(`已确认当前登录账号：${s4.detail}`), i3.identity && !await T(i3.identity) && S.push(`当前身份证据不是站点接口结果，本轮继续但不更新长期账号映射`)) : S.push(`${r} 登录：读不到可核对的身份，但本站只有该账号，继续签到`), await t.confirmIdentity?.(), await (0, __contentScope.U)(e.site, S, { waitForAppear: true }), M((0, __contentScope.uh)(n));
              if (s4.match === `mismatch` && S.push(`检测到账号不符：${s4.detail}`), c2.action === `handoff`)
                return await t.needsUser(
                  c2.reason === `mismatch-external` ? `当前浏览器登录的是别的账号（${s4.detail}）。请在浏览器里切换到 ${e.username} 后重新签到。` : `读不到当前登录身份（${s4.detail}），而本站配置了 ${e.siteAccountCount ?? `多个`} 个账号，无法确认浏览器里登录的是不是本账号。请在浏览器里确认后重新签到。`,
                  n
                ), null;
              if (s4.match !== `mismatch` && S.push(`无法确认当前登录身份（${s4.detail}），按切换账号处理`), o) {
                let e2 = await A();
                return e2 === `started` ? null : C(
                  e2 === `exhausted` ? De(s4, `当前页面`) : `无法清除当前站点的浏览器 Cookie，为避免给错账号签到已停止；请检查扩展 Cookie 权限或残留项`
                );
              }
              let l3 = await k();
              if (l3 === `reloading`) return null;
              if (l3 === `exhausted`)
                return C(
                  `当前页面身份仍不匹配，已达到自动切换次数上限；请检查本账号凭据和本站用户 ID 绑定`
                );
              if (l3 === `blocked`)
                return C(
                  `无法清除当前站点的浏览器 Cookie，为避免给错账号签到已停止；请检查扩展 Cookie 权限或残留项`
                );
            }
            if (r === `token`) return Te();
            if (r === `auto`) {
              if (!await resolvePageMethod(1500)) {
                const entry = (0, __contentScope.In)();
                if (entry) {
                  if (!await E(`login`, __contentScope.$)) return C(`登录入口前的安全验证尚未完成`);
                  await (0, __contentScope.dr)(entry, e.site, S, `登录入口`);
                  await resolvePageMethod(1500);
                }
              }
              if (r === `auto`) {
                if ((0, __contentScope.detectPageLogin)(e.site, {}, true).length > 1)
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
            await (0, __contentScope.U)(e.site, S, { waitForAppear: true });
            const beforeLoginState = await readCurrentLoginState(2500);
            if (beforeLoginState.status === `authenticated`) {
              S.push(`准备登录期间已确认当前会话登录，转入账号核验`);
              if (r === `manual`) {
                const verification = await confirmManualIdentity();
                if (!verification.confirmed)
                  return stopForUnconfirmedLogin({
                    status: `pending`,
                    reason: `identity_unstable`,
                    detail: verification.detail
                  });
              }
              return M((0, __contentScope.uh)(n));
            }
            if (!canStartLogin(beforeLoginState)) return stopForUnconfirmedLogin(beforeLoginState);
            if (r === `manual`) return beginManualLogin();
            if (r === `oauth` || r === `github` || r === `passkey`)
              return await (0, __contentScope.U)(e.site, S, { waitForAppear: true }), await E(e.stage, __contentScope.$) ? (await (0, __contentScope.mr)(e.site, S, r, {
                beforeClick: () => E(e.stage, __contentScope.$)
              }), await (0, __contentScope.vr)(
                e.site,
                S,
                {
                  beforeClick: () => D(e.stage),
                  afterClick: () => xe(`verify-oauth`),
                  beforeAuxiliaryClick: () => E(e.stage, __contentScope.$),
                  beforeNavigate: () => t.markStage(`verify-oauth`, n)
                },
                r
              ) ? (r === `passkey` && S.push(`已触发 Passkey 登录，请在浏览器/系统原生提示中确认`), await (0, __contentScope.yr)(e.site, S) ? null : await we(`verify-oauth`) ? await O() ? M(true) : null : C(loginFailureMessage(`OAuth 授权后未能确认登录成功`))) : C(
                e.loginEntry ? `当前页面未找到账号选定的「${e.loginEntry.label}」登录入口，请手动更新本站登录方式` : r === `passkey` ? `未找到 Passkey 登录按钮，请检查选择器配置` : `未找到 OAuth 按钮，请检查选择器配置`
              )) : C(`展开第三方登录入口前的人机验证未完成`);
            if (await (0, __contentScope.pr)(e.site, S, {
              beforeClick: () => E(e.stage, __contentScope.$)
            }), !await (0, __contentScope.hr)(
              e.site,
              e.username,
              e.password,
              S,
              async () => (await t.markStage(`login`, n), D(`login`)),
              () => E(`login`, __contentScope.$)
            ))
              return C(ne());
            await (0, __contentScope.U)(e.site, S);
            let s3 = false;
            if (!await (0, __contentScope.gr)(e.site, S, {
              beforeClick: () => beforeFormSubmit(e.stage),
              afterClick: async () => {
                let e2 = await Se(`verify`);
                return s3 ||= e2.detected && e2.resolved && e2.kind === `Slider`, e2.resolved;
              },
              beforeAuxiliaryClick: () => E(e.stage, __contentScope.$),
              beforeNavigate: () => t.markStage(`verify`, n)
            }))
              return C(`未能提交登录表单`);
            let c = await we(`verify`, (e2) => {
              s3 ||= e2.detected && e2.resolved && e2.kind === `Slider`;
            }), l2 = (() => {
              try {
                let t2 = new URL(e.site.loginUrl);
                return t2.protocol === `https:` && t2.hostname.toLowerCase() === `www.hvoy.ai` && t2.port === `` && location.origin === `https://www.hvoy.ai`;
              } catch {
                return false;
              }
            })();
            if (!c && e.stage === `login` && r === `form` && l2 && s3) {
              if (await (0, __contentScope._r)(e.site, S, {
                afterClick: () => xe(`verify`),
                beforeNavigate: () => t.markStage(`verify`, n)
              }) === `blocked`)
                return C(`滑块通过后无法安全地重新提交登录表单`);
              c = await we(`verify`);
            }
            return c ? ((0, __contentScope.rf)(y()) || await t.confirmIdentity?.(), S.push(
              (0, __contentScope.rf)(y()) ? `表单登录成功，账号身份交由个人资料页统一核验` : `本轮账号 ${e.username} 登录成功，已记住身份供后续页面使用`
            ), await (0, __contentScope.U)(e.site, S), M(true)) : C(loginFailureMessage(`登录结果未确认，请手动查看该标签页`));
          }
        }
      } catch (e2) {
        if (e2 === loginVerificationNavigation) return null;
        let t2 = e2 instanceof Error ? e2.message : String(e2);
        return S.push(`异常: ${t2}`), C(t2);
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
        }
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
              `[role="dialog"] header button:has(> svg)`
            ];
          }
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
              `input[placeholder*="邮箱"]`
            ];
          }
        },
        {
          order: 2,
          run() {
            __contentState.a = [
              `input[autocomplete="current-password"]`,
              `#password`,
              `input[name="password"]`,
              `input[type="password"]`
            ];
          }
        },
        {
          order: 3,
          run() {
            [
              `button:has(> span:only-child)`,
              `.checkin-btn`,
              `#checkin`,
              `[data-testid="checkin"]`
            ].join(`, `);
          }
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
              UNKNOWN: `unknown`
            };
          }
        },
        {
          order: 5,
          run() {
            __contentState.s = {
              NEW_API: `new-api`,
              SUB2API: `sub2api`,
              VO_API_V2: `voapi-v2`,
              UNSUPPORTED: `unsupported`
            };
          }
        },
        {
          order: 6,
          run() {
            [...__contentScope.r], __contentScope.o.NEW_API, __contentScope.s.NEW_API, __contentScope.o.NEW_API;
          }
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
                titleWords: [`1412's api`, `kid1412`]
              },
              preset: {
                pointerMode: `trusted`,
                loginMethod: `github`,
                oauthButtonSelector: `text=GitHub`,
                selectors: {
                  username: `input[name="username"]`,
                  password: `input[name="password"]`,
                  submit: `button[type="submit"]`
                },
                closeModalSelectors: __contentScope.r,
                successIndicator: `a[href="/keys"], a[href="/wallet"]`,
                checkin: {
                  method: `button`,
                  url: `/profile`,
                  buttonSelector: `button >> text=立即签到, button >> text=签到`,
                  alreadySelector: `button >> text=已签到`,
                  successText: [`签到成功`, `今天 +`],
                  alreadyText: [`已签到`, `今日已签到`]
                },
                adapter: {
                  siteType: __contentScope.o.NEW_API,
                  family: __contentScope.s.NEW_API,
                  checkinPath: `/profile`,
                  checkin: {
                    pathPatterns: [`/profile*`],
                    titleWords: [`每日签到`]
                  },
                  quotaPerUnit: 5e5
                }
              }
            };
          }
        },
        {
          order: 8,
          run() {
            __contentScope.o.NEW_API, __contentScope.o.NEW_API, __contentScope.s.NEW_API, __contentScope.o.NEW_API, __contentScope.i.join(`, `), __contentScope.a.join(`, `), __contentScope.o.NEW_API, __contentScope.s.NEW_API;
          }
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
                  submit: `button[type="submit"], button.semi-button-primary`
                },
                loginMethod: `auto`,
                closeModalSelectors: __contentScope.r,
                checkin: {
                  method: `button`,
                  url: `/console/personal`,
                  buttonSelector: `button >> text=立即签到`,
                  alreadySelector: `button >> text=今日已签到`,
                  alreadyText: [`今日已签到`]
                },
                adapter: {
                  siteType: __contentScope.o.NEW_API,
                  family: __contentScope.s.NEW_API,
                  checkinPath: `/console/personal`,
                  checkin: {
                    pathPatterns: [`/console/personal*`],
                    titleWords: [`每日签到`]
                  },
                  quotaPerUnit: 5e5
                }
              }
            };
          }
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
                titleWords: [`any router`, `anyrouter`]
              },
              preset: {
                selectors: {
                  username: __contentScope.i.join(`, `),
                  password: __contentScope.a.join(`, `),
                  submit: `button[type="submit"], button.semi-button-primary`
                },
                loginMethod: `auto`,
                closeModalSelectors: __contentScope.r,
                checkin: { method: `none` },
                adapter: {
                  siteType: __contentScope.o.ANYROUTER,
                  family: __contentScope.s.NEW_API,
                  checkinPath: ``,
                  quotaPerUnit: 5e5
                }
              }
            };
          }
        },
        {
          order: 11,
          run() {
            __contentScope.o.SUB2API, __contentScope.s.SUB2API, __contentScope.o.SUB2API, __contentScope.o.SUB2API, __contentScope.o.SUB2API, __contentScope.s.SUB2API, __contentScope.o.SUB2API, [
              `input[name="username"]`,
              `input[name="email"]`,
              `input[autocomplete="username"]`,
              `input[autocomplete="email"]`,
              `input[type="email"]`,
              `input[type="text"]`
            ].join(`, `), [
              `.daily-checkin-page-action button:not([disabled])`,
              `.daily-checkin-action button:not([disabled])`,
              `button >> text=立即签到`,
              `button >> text=签到`,
              `input[type="submit"][value*="签到"]`,
              `input[type="button"][value*="签到"]`
            ].join(`, `), [
              `.daily-checkin-page-action .daily-checkin-done`,
              `.daily-checkin-done`,
              `button >> text=今天已签到`,
              `button >> text=今日已签到`,
              `button >> text=已完成`,
              `input[value="今天已签到"]`,
              `input[value="今日已签到"]`,
              `input[value="已完成"]`
            ].join(`, `), __contentScope.o.UNKNOWN, __contentScope.s.UNSUPPORTED, __contentScope.o.UNKNOWN;
          }
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
                  `htai91.com`
                ]
              },
              preset: {
                pointerMode: `trusted`,
                loginMethod: `auto`,
                selectors: {
                  username: `input[name="username"]`,
                  password: `input[name="password"]`,
                  submit: `button[type="submit"], button >> text=登录, button >> text=Sign in`
                },
                closeModalSelectors: __contentScope.r,
                successIndicator: `a[href="/keys"], a[href="/wallet"]`,
                checkin: {
                  method: `button`,
                  url: `/profile`,
                  buttonSelector: `button >> text=立即签到, button >> text=签到`,
                  alreadySelector: `button >> text=已签到`,
                  successText: [`签到成功`, `今天 +`],
                  alreadyText: [`已签到`, `今日已签到`]
                },
                adapter: {
                  siteType: __contentScope.o.NEW_API,
                  family: __contentScope.s.NEW_API,
                  checkinPath: `/profile`,
                  checkin: {
                    pathPatterns: [`/profile*`],
                    titleWords: [`每日签到`]
                  },
                  quotaPerUnit: 5e5
                }
              }
            };
          }
        },
        {
          order: 13,
          run() {
            __contentScope.d.preset, { ...__contentScope.d.preset }, { ...__contentScope.d.preset.selectors }, [...__contentScope.d.preset.closeModalSelectors], { ...__contentScope.d.preset.checkin }, [
              `button >> text=立即签到`,
              `button >> text=已签到`,
              `button >> text=Check in now`,
              `button >> text=Checked in`
            ].join(`, `), [
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
              `header [data-radix-dropdown-menu-trigger]:has([class*="rounded-full" i])`
            ].join(`, `), [
              `[role="menuitem"] >> text=个人资料`,
              `[role="menuitem"] >> text=个人中心`,
              `[role="menuitem"] >> text=Profile`,
              `[role="menuitem"] >> text=My profile`,
              `a[href="/profile"]`,
              `a[href^="/profile?"]`,
              `a >> text=个人资料`,
              `a >> text=个人中心`,
              `a >> text=Profile`
            ].join(`, `), [
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
              `button >> text=Profile`
            ].join(`, `), [
              `button >> text=立即签到`,
              `button >> text=已签到`,
              `button >> text=Check in now`,
              `button >> text=Checked in`
            ].join(`, `), { ...__contentScope.d.preset.adapter }, { ...__contentScope.d.preset.adapter?.checkin }, [...__contentScope.d.preset.adapter?.checkin?.pathPatterns ?? []], [...__contentScope.d.preset.adapter?.checkin?.titleWords ?? []], __contentScope.o.NEW_API, __contentScope.o.NEW_API, __contentScope.s.NEW_API, __contentScope.o.NEW_API, __contentScope.i.join(`, `), __contentScope.a.join(`, `), __contentScope.o.NEW_API, __contentScope.s.NEW_API, __contentScope.o.NEW_API, [
              `header a[href="/login"]`,
              `nav a[href="/login"]`,
              `a[href="/login"]`,
              `header button >> text=登录`,
              `nav button >> text=登录`,
              `header a >> text=登录`,
              `nav a >> text=登录`
            ].join(`, `), __contentScope.o.UNKNOWN, __contentScope.s.UNSUPPORTED, __contentScope.o.UNKNOWN, __contentScope.o.SUB2API, __contentScope.o.SUB2API, __contentScope.s.SUB2API, __contentScope.o.NEW_API, __contentScope.o.NEW_API, __contentScope.s.NEW_API;
          }
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
              `checked in successfully`
            ];
          }
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
              `已领取`
            ];
          }
        },
        {
          order: 35,
          run() {
            __contentState.nt = [`抽奖成功`, `抽奖完成`, `开奖成功`, `draw successful`];
          }
        },
        {
          order: 36,
          run() {
            __contentState.rt = [
              `今日梦火抽签次数已耗尽`,
              `This draw is complete`,
              `You have already drawn today`
            ];
          }
        },
        {
          order: 37,
          run() {
            __contentState.it = (0, __contentScope.P)(/抽奖|抽签|翻牌|\b(?:start\s+)?draw\b/i);
          }
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
              `claim failed`
            ];
          }
        },
        {
          order: 39,
          run() {
            __contentState.st = /(?:^|\/)(?:check-?in|daily-check-?in|sign-?in|attendance)(?:\/|$)/i;
          }
        },
        {
          order: 40,
          run() {
            __contentState.ct = (0, __contentScope.P)(
              /(?:签到|打卡|领取|check[\s-]?in|sign[\s-]?in|claim|daily\s*(?:bonus|reward|credit)|每日(?:奖励|福利|额度))/i
            );
          }
        },
        {
          order: 41,
          run() {
            __contentState.lt = (0, __contentScope.P)(
              /(?:历史|记录|规则|日历|说明|明细|详情|history|calendar|rule|record|detail)/i
            );
          }
        },
        {
          order: 42,
          run() {
            __contentState.ut = /^(?:disabled|is-disabled|[\w-]+-disabled)$/i;
          }
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
              `.modal`
            ];
          }
        },
        {
          order: 44,
          run() {
            __contentState.pt = __contentScope.ft.join(`, `);
          }
        },
        {
          order: 45,
          run() {
            __contentState.mt = /(?:关闭公告|今日关闭|关闭通知|标记已读|不再提示|不再显示|我已知悉|已知悉|我已了解|已了解|我已阅读|已阅读并同意|我知道了|知道了|稍后再说|以后再说|mark(?:ed)?\s+(?:as\s+)?read|don'?t show|got it|dismiss)/i;
          }
        },
        {
          order: 46,
          run() {
            __contentState.gt = /* @__PURE__ */ new Set([
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
              `x`
            ]);
          }
        },
        {
          order: 47,
          run() {
            __contentState.bt = `textarea, input[type="text"], input:not([type]), [contenteditable="true"]`;
          }
        },
        {
          order: 48,
          run() {
            __contentState.Tt = 2500;
          }
        },
        {
          order: 49,
          run() {
            __contentState.Et = 6e3;
          }
        },
        {
          order: 50,
          run() {
            __contentState.Dt = 1e3;
          }
        },
        {
          order: 51,
          run() {
            __contentState.Ot = 250;
          }
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
              `[class~="fixed"][class~="inset-0"]`
            ];
          }
        },
        {
          order: 53,
          run() {
            __contentState.At = [`dialog[open]`, `[aria-modal="true"]`];
          }
        },
        {
          order: 54,
          run() {
            __contentState.jt = __contentScope.kt.join(`, `);
          }
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
              `.modal`
            ].join(`, `);
          }
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
              `[class~="fixed"][class~="inset-0"]`
            ].join(`, `);
          }
        },
        {
          order: 57,
          run() {
            __contentState.Pt = `${__contentScope.Mt}, .semi-modal-wrap, .ant-modal-wrap, .MuiDialog-container`;
          }
        },
        {
          order: 58,
          run() {
            __contentState.Ut = `button, [role="button"], input[type="button"], input[type="submit"], a[href="#"], a:not([href]), [onclick]`;
          }
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
              `input[id*="2fa" i]`
            ].join(`, `);
          }
        },
        {
          order: 60,
          run() {
            __contentState.en = /(?:^|[/_-])(login|sign-?in|auth|verify|verification|challenge|captcha|2fa|mfa|otp|error|forbidden|suspended?|banned?)(?:[/_.-]|$)/i;
          }
        },
        {
          order: 61,
          run() {
            __contentState.nn = /(?:用户名|用户|账号|账户|邮箱|邮件|user\s*name|account|e-?mail|login)/i;
          }
        },
        {
          order: 62,
          run() {
            __contentState.rn = /(?:验证码|校验码|动态码|搜索|手机号|captcha|verify|verification|otp|totp|mfa|2fa|search)/i;
          }
        },
        {
          order: 63,
          run() {
            __contentState.an = /(?:api[-_\s]*(?:endpoint|url)|endpoint[-_\s]*(?:url)?|base[-_\s]*url|proxy[-_\s]*(?:url|address)|request[-_\s]*url|api\s*地址|接口(?:地址|配置)|请求地址|中转地址|代理地址|常用工具)/i;
          }
        },
        {
          order: 64,
          run() {
            __contentState.on = /(?:密码|口令|pass\s*word|passwd|passcode)/i;
          }
        },
        {
          order: 65,
          run() {
            __contentState.sn = /(?:新密码|确认密码|重复密码|设置密码|new\s*password|confirm\s*password|repeat\s*password|create\s*password)/i;
          }
        },
        {
          order: 66,
          run() {
            __contentState.cn = /(?:登录|登陆|sign\s*in|log\s*in)/i;
          }
        },
        {
          order: 67,
          run() {
            __contentState.ln = /(?:注册|创建账号|加入|sign\s*up|register|create\s*(?:an?\s*)?account|join)/i;
          }
        },
        {
          order: 68,
          run() {
            __contentState.un = /^(?:登录|登陆|立即登录|继续登录|登\s*录|log\s*in|sign\s*in|continue)$/i;
          }
        },
        {
          order: 69,
          run() {
            __contentState.dn = /(?:继续|下一步|下一页|确认|提交|continue|next|proceed|submit)/i;
          }
        },
        {
          order: 70,
          run() {
            __contentState.fn = /(?:注册|忘记|找回|验证码|github|google|linuxdo|oauth|sso|passkey|register|sign\s*up|forgot|captcha)/i;
          }
        },
        {
          order: 71,
          run() {
            __contentState.pn = /(?:同意|接受|agree|accept).*(?:协议|条款|隐私|terms?|privacy)|(?:协议|条款|隐私|terms?|privacy).*(?:同意|接受|agree|accept)/i;
          }
        },
        {
          order: 72,
          run() {
            __contentState.mn = /(?:captcha|turnstile|recaptcha|hcaptcha|人机|真人|验证码|安全验证)/i;
          }
        },
        {
          order: 73,
          run() {
            __contentState.hn = /(?:github|git\s*hub)/i;
          }
        },
        {
          order: 74,
          run() {
            __contentState.gn = /(?:linuxdo|linux\s*do|google|discord|telegram|microsoft|github|git\s*hub)/i;
          }
        },
        {
          order: 75,
          run() {
            __contentState._n = /(?:passkey|webauthn|security\s*key|通行密钥|安全密钥|生物识别)/i;
          }
        },
        {
          order: 76,
          run() {
            __contentState.vn = /(?:oauth|sso|openid|oidc|passkey|webauthn|通行密钥|安全密钥|生物识别|第三方|授权|使用.{0,16}(?:继续|登录|登陆)|通过.{0,16}(?:继续|登录|登陆)|用.{0,16}(?:继续|登录|登陆)|continue.{0,16}with|sign\s*in.{0,16}with|log\s*in.{0,16}with)/i;
          }
        },
        {
          order: 77,
          run() {
            __contentState.yn = /(?:注册|忘记|找回|重置|验证码|校验码|动态码|搜索|刷新|发送|获取|register|sign\s*up|forgot|reset|captcha|verify|verification|otp|totp|mfa|2fa|search|send)/i;
          }
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
              `用户名登录`
            ];
          }
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
              `oauth`
            ];
          }
        },
        {
          order: 80,
          run() {
            __contentState.Hn = /(?:登录|账号|账户|用户名|邮箱|密码|凭据).{0,24}(?:失败|错误|无效|不正确|不存在|已锁定|已过期|被拒绝)|(?:failed|error|invalid|incorrect|wrong|denied|expired|locked).{0,24}(?:login|account|user|email|password|credential|authentication|authorization)|(?:login|sign[\s-]?in|password|credential|authentication|authorization|oauth).{0,24}(?:failed|failure|error|invalid|incorrect|wrong|denied|expired|locked|cancelled|canceled)/i;
          }
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
              `accept and continue`
            ];
          }
        },
        {
          order: 82,
          run() {
            __contentState.sr = /条款|协议|服务条款|条款更新|terms|agreement|policy|隐私/i;
          }
        },
        {
          order: 83,
          run() {
            __contentState.cr = /拒绝|不同意|取消|decline|cancel|reject/i;
          }
        },
        {
          order: 84,
          run() {
            __contentState.Sr = `abcdefghijklmnopqrstuvwxyz`;
          }
        },
        {
          order: 85,
          run() {
            __contentState.Cr = 10;
          }
        },
        {
          order: 86,
          run() {
            __contentState.wr = 128;
          }
        },
        {
          order: 87,
          run() {
            __contentState.zr = {
              "New-API-User": __contentScope.o.NEW_API,
              "Veloera-User": __contentScope.o.VELOERA,
              "X-Api-User": __contentScope.o.V_API,
              "voapi-user": __contentScope.o.VO_API,
              "User-id": __contentScope.o.SUPER_API,
              "Rix-Api-User": __contentScope.o.RIX_API,
              "neo-api-user": __contentScope.o.NEO_API
            };
          }
        },
        {
          order: 88,
          run() {
            __contentState.Br = Object.keys(__contentScope.zr);
          }
        },
        {
          order: 89,
          run() {
            __contentState.Hr = 5e5;
          }
        },
        {
          order: 90,
          run() {
            __contentState.Jr = {
              [__contentScope.s.NEW_API]: { checkinPath: `/console/personal` },
              [__contentScope.s.SUB2API]: { checkinPath: `/check-in` },
              [__contentScope.s.VO_API_V2]: {},
              [__contentScope.s.UNSUPPORTED]: {}
            };
          }
        },
        {
          order: 91,
          run() {
            __contentState.Yr = /* @__PURE__ */ new Set([
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
              __contentScope.o.ANYROUTER
            ]);
          }
        },
        {
          order: 92,
          run() {
            __contentState.ni = 6e4;
          }
        },
        {
          order: 93,
          run() {
            __contentState.ri = 2e4;
          }
        },
        {
          order: 94,
          run() {
            __contentState.ii = 4e3;
          }
        },
        {
          order: 95,
          run() {
            __contentState.ai = /* @__PURE__ */ new Map();
            __contentState.identityProbeHints = /* @__PURE__ */ new Map();
          }
        },
        {
          order: 96,
          run() {
            __contentState.oi = /* @__PURE__ */ new Map();
          }
        },
        {
          order: 97,
          run() {
            __contentState.ci = [
              [`data`, `access_token`],
              [`access_token`],
              [`data`, `accessToken`],
              [`accessToken`]
            ];
          }
        },
        {
          order: 98,
          run() {
            __contentState.pi = {
              maxInputBytes: 1048576,
              maxDepth: 64,
              maxContainerLength: 65536,
              maxTextLength: 262144,
              maxTotalItems: 1e5
            };
          }
        },
        {
          order: 99,
          run() {
            __contentState.mi = 2 ** 53 - 1;
          }
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
                this.bytes = e, this.limits = t;
              }
              done() {
                return this.pos >= this.bytes.length;
              }
              readItem(e) {
                e > this.limits.maxDepth && (0, __contentScope.G)(`超出深度上限`), this.items += 1, this.items > this.limits.maxTotalItems && (0, __contentScope.G)(`超出解码总量上限`);
                let t = this.readByte(), n = t >> 5, r = t & 31;
                if (r === 31 && (0, __contentScope.G)(`不支持不定长度`), r > 27 && (0, __contentScope.G)(`非法的类型字节（保留的 additional info）`), n === 7)
                  return this.readSimpleOrFloat(r);
                let i = r < 24 ? r : this.readUintArgument(r);
                switch (n) {
                  case 0:
                    return i > __contentScope.mi && (0, __contentScope.G)(`整数超出安全范围`), i;
                  case 1:
                    return i >= __contentScope.mi && (0, __contentScope.G)(`整数超出安全范围`), -1 - i;
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
                    return false;
                  case 21:
                    return true;
                  case 22:
                    return null;
                  case 25:
                    return (0, __contentScope.gi)(this.readRaw16());
                  case 26: {
                    let e2 = this.readRaw32(), t = new DataView(new ArrayBuffer(4));
                    return t.setUint32(0, e2), t.getFloat32(0);
                  }
                  case 27: {
                    let e2 = this.readRaw32(), t = this.readRaw32(), n = new DataView(new ArrayBuffer(8));
                    return n.setUint32(0, e2), n.setUint32(4, t), n.getFloat64(0);
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
                let n = /* @__PURE__ */ Object.create(null);
                for (let r = 0; r < e; r += 1) {
                  let e2 = this.readItem(t + 1), r2 = this.readItem(t + 1);
                  typeof e2 == `string` && (n[e2] = r2);
                }
                return n;
              }
              readText(e) {
                e > this.limits.maxTextLength && (0, __contentScope.G)(`超出文本长度上限`);
                let t = this.readBytes(e);
                try {
                  return new TextDecoder(`utf-8`, { fatal: true }).decode(t);
                } catch {
                  (0, __contentScope.G)(`文本不是合法 UTF-8`);
                }
              }
              checkContainerLength(e) {
                e > this.limits.maxContainerLength && (0, __contentScope.G)(`超出容器长度上限`), e > this.bytes.length - this.pos && (0, __contentScope.G)(`数据不完整（容器长度超出剩余字节）`);
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
                    let e2 = this.readRaw32(), t = this.readRaw32(), n = e2 * 4294967296 + t;
                    return n > __contentScope.mi && (0, __contentScope.G)(`整数超出安全范围`), n;
                  }
                  default:
                    (0, __contentScope.G)(`非法的类型字节（保留的 additional info）`);
                }
              }
              readByte() {
                return this.pos >= this.bytes.length && (0, __contentScope.G)(`数据不完整`), this.bytes[this.pos++];
              }
              readRaw16() {
                return this.readByte() << 8 | this.readByte();
              }
              readRaw32() {
                return this.readByte() * 16777216 + (this.readByte() << 16) + (this.readByte() << 8) + this.readByte();
              }
              readBytes(e) {
                e > this.bytes.length - this.pos && (0, __contentScope.G)(`数据不完整`);
                let t = this.bytes.subarray(this.pos, this.pos + e);
                return this.pos += e, t;
              }
            };
          }
        },
        {
          order: 101,
          run() {
            __contentState.vi = [`/api/user/self`, `/api/user/info`, `/api/v1/auth/me`];
          }
        },
        {
          order: 102,
          run() {
            __contentState.yi = 4e3;
          }
        },
        {
          order: 103,
          run() {
            __contentState.bi = 4e3;
          }
        },
        {
          order: 104,
          run() {
            __contentState.ki = /(邀请|受邀|推荐|推广|上级|下级|下线|团队|排行|榜|赞助|作者|客服|管理员|中奖|获奖|公告|invit|referr|sponsor|winner|leaderboard|announcement)/i;
          }
        },
        {
          order: 105,
          run() {
            __contentState.Ai = /中奖(?:名单|记录|用户)|获奖(?:名单|记录)|排行榜|排名榜|用户列表|成员列表|历史记录|公告|\b(?:winners?|leaderboard|rankings?|draw history|announcements?)\b/i;
          }
        },
        {
          order: 106,
          run() {
            __contentState.ji = /^(?:个人资料|个人信息|账户信息|账号信息|我的账户|我的账号|我的资料|profile|my account|account (?:info(?:rmation)?|details))\s*[:：]?$/i;
          }
        },
        {
          order: 107,
          run() {
            __contentState.Mi = /^(?:当前(?:登录)?(?:账号|账户|用户)|我的(?:账号|账户|邮箱))\s*[:：]?/;
          }
        },
        {
          order: 108,
          run() {
            __contentState.Ni = /(?<![A-Za-z])(?:用户\s*ID|User\s*ID|UID)\s*[:：#]?\s*\d|当前(?:登录)?(?:账号|账户|用户)|用户名|登录名|账[号户]|邮箱|电子邮件|\b(?:e-?mail|username|account)\b|欢迎回来|welcome back/i;
          }
        },
        {
          order: 109,
          run() {
            __contentState.Pi = /退出登录|退出账号|注销登录|个人资料|账户设置|账号设置|\b(?:log\s*out|sign\s*out|my account|account settings|profile)\b/i;
          }
        },
        {
          order: 110,
          run() {
            __contentState.Hi = 4;
          }
        },
        {
          order: 111,
          run() {
            __contentState.Ui = /[A-Za-z0-9._+@-]/;
          }
        },
        {
          order: 112,
          run() {
            __contentState.Wi = /(?<![\w.+-])([\w.+-]*)\*+([\w.+-]*)@([\w-]+\.[\w.-]+)/g;
          }
        },
        {
          order: 113,
          run() {
            __contentState.na = [
              /(?:当前余额|账户余额|剩余额度|可用余额|余额)\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i,
              /\bbalance\b\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i
            ];
          }
        },
        {
          order: 114,
          run() {
            __contentState.ra = /(?:^|\n)\s*饼友\s*[·•・]\s*积分\s*[:：]?\s*(-?\d[\d,]*(?:\.\d+)?)/im;
          }
        },
        {
          order: 115,
          run() {
            __contentState.ia = /(?:^|\n)\s*当前积分\s*[:：]?\s*(-?\d[\d,]*(?:\.\d+)?)/im;
          }
        },
        {
          order: 116,
          run() {
            __contentState.aa = /每日签到奖励/g;
          }
        },
        {
          order: 117,
          run() {
            __contentState.oa = /每日签到奖励\s*[+＋]\s*\d[\d,]*(?:\.\d+)?/;
          }
        },
        {
          order: 118,
          run() {
            __contentState.sa = /((?:19|20)\d{2})\s*[\/\-.年]\s*(\d{1,2})\s*[\/\-.月]\s*(\d{1,2})\s*日?/;
          }
        },
        {
          order: 119,
          run() {
            __contentState.ca = `www.hvoy.ai`;
          }
        },
        {
          order: 120,
          run() {
            __contentState.ha = [
              {
                pattern: /(?:今天|今日|today)[^\n]{0,24}?\+\s*((?:(?:[$＄¥￥]|(?:usd|cny|rmb)\s*)\s*)?\d[\d,]*(?:\.\d+)?)/i
              },
              {
                pattern: /(?:签到|check[\s-]?in)[^\n]{0,24}?\+\s*((?:(?:[$＄¥￥]|(?:usd|cny|rmb)\s*)\s*)?\d[\d,]*(?:\.\d+)?)/i
              },
              {
                pattern: /(?:今天|今日)\s*可得\s*[:：]?\s*((?:(?:[$＄¥￥]|(?:usd|cny|rmb)\s*)\s*)?\d[\d,]*(?:\.\d+)?)/i,
                requiresCheckedIn: true
              },
              {
                pattern: /(?:恭喜(?:获取|获得)|签到成功[^\n]{0,24}?(?:已)?获得)\s*(\d[\d,]*(?:\.\d+)?\s*积分)/i
              }
            ];
          }
        },
        {
          order: 121,
          run() {
            __contentState.ga = /(?:套餐|价格|售价|订阅|档位|plan|price|pricing)[^\n]{0,12}?\+?\s*[$＄¥￥]?\s*\d[\d,]*(?:\.\d+)?(?:\s*\/\s*(?:月|年|mo|mo\.|month|year))?/gi;
          }
        },
        {
          order: 122,
          run() {
            __contentState._a = /(?:今天|今日)\s*已签到|已签到\s*(?:今天|今日)|\bchecked\s+in\s+today\b/i;
          }
        },
        {
          order: 123,
          run() {
            __contentState.va = /(?:每日签到|签到|check[\s-]?in|today\s+reward|(?:今天|今日)\s*\+)/i;
          }
        },
        {
          order: 124,
          run() {
            __contentState.ya = 2e4;
          }
        },
        {
          order: 125,
          run() {
            __contentState.ba = /已签到|已簽到|\bchecked\s*in\b/i;
          }
        },
        {
          order: 126,
          run() {
            __contentState.xa = /已签到\s*\d+\s*(?:天|日|次)|已簽到\s*\d+\s*(?:天|日|次)/gi;
          }
        },
        {
          order: 127,
          run() {
            __contentState.Sa = /(?:签到成功|簽到成功)[^\n]{0,24}?(?:已)?获得|恭喜(?:获取|获得)/i;
          }
        },
        {
          order: 128,
          run() {
            __contentState.Na = [`/api/user/self`, `/api/user/info`];
          }
        },
        {
          order: 129,
          run() {
            __contentState.Pa = [`/api/v1/check-in/status`, `/api/v1/auth/me`];
          }
        },
        {
          order: 130,
          run() {
            __contentState.Va = 4e3;
          }
        },
        {
          order: 131,
          run() {
            __contentState.Ua = 1e-9;
          }
        },
        {
          order: 132,
          run() {
            __contentState.Ka = `fapi.leileihog.top`;
          }
        },
        {
          order: 133,
          run() {
            __contentState.qa = `/profile`;
          }
        },
        {
          order: 134,
          run() {
            __contentState.Ja = `/lottery`;
          }
        },
        {
          order: 135,
          run() {
            __contentState.Ya = 12e3;
          }
        },
        {
          order: 136,
          run() {
            __contentState.Xa = 15e3;
          }
        },
        {
          order: 137,
          run() {
            __contentState.Za = 2500;
          }
        },
        {
          order: 138,
          run() {
            __contentState.Qa = 220;
          }
        },
        {
          order: 139,
          run() {
            __contentState.$a = 800;
          }
        },
        {
          order: 140,
          run() {
            __contentState.eo = /(?:今日|今天|本日)已抽(?:奖)?|(?:今日|今天)抽奖次数已用完|\bdraw completed\b|\bno draws left today\b/i;
          }
        },
        {
          order: 141,
          run() {
            __contentState.K = class extends Error {
            };
          }
        },
        {
          order: 142,
          run() {
            __contentState.mo = 0;
          }
        },
        {
          order: 143,
          run() {
            __contentState.ho = null;
          }
        },
        {
          order: 224,
          run() {
            __contentState.Ku = /^\/[a-z]{2}(?:[-_][a-z]{2})?(?=\/)/i;
          }
        },
        {
          order: 225,
          run() {
            __contentState.Yu = (0, __contentScope.P)(
              /帮助|教程|演示|示例|预览|前往|进入|查看|去签到|help|tutorial|demo|preview/i
            );
          }
        },
        {
          order: 226,
          run() {
            __contentState.Xu = (0, __contentScope.P)(
              /签到中|打卡中|领取中|checking|claiming|processing/i
            );
          }
        },
        {
          order: 227,
          run() {
            __contentState.ed = 1e4;
          }
        },
        {
          order: 228,
          run() {
            __contentState.td = 3e3;
          }
        },
        {
          order: 229,
          run() {
            __contentState.nd = 3e4;
          }
        },
        {
          order: 230,
          run() {
            __contentState.rd = 30;
          }
        },
        {
          order: 231,
          run() {
            __contentState.id = 4;
          }
        },
        {
          order: 232,
          run() {
            __contentState.ad = 6e3;
          }
        },
        {
          order: 233,
          run() {
            __contentState.od = 400;
          }
        },
        {
          order: 234,
          run() {
            __contentState.sd = 500;
          }
        },
        {
          order: 235,
          run() {
            __contentState.cd = 16;
          }
        },
        {
          order: 236,
          run() {
            __contentState.ld = 150;
          }
        },
        {
          order: 237,
          run() {
            __contentState.ud = 400;
          }
        },
        {
          order: 238,
          run() {
            __contentState.dd = 24;
          }
        },
        {
          order: 239,
          run() {
            __contentState.fd = 6e3;
          }
        },
        {
          order: 240,
          run() {
            __contentState.pd = /* @__PURE__ */ new WeakMap();
          }
        },
        {
          order: 241,
          run() {
            __contentState._d = class extends Error {
              result;
              constructor(e) {
                super(e.message), this.result = e;
              }
            };
          }
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
              `[name]`
            ].join(`, `);
          }
        },
        {
          order: 243,
          run() {
            __contentState.zd = [`testId`, `name`, `aria`];
          }
        },
        {
          order: 244,
          run() {
            __contentState.Bd = [`text`];
          }
        },
        {
          order: 245,
          run() {
            __contentState.Xd = `学习路线未命中: `;
          }
        },
        {
          order: 246,
          run() {
            __contentState.Zd = `工作流接入学习路线: `;
          }
        },
        {
          order: 247,
          run() {
            __contentScope.s.NEW_API, __contentScope.s.SUB2API, __contentScope.s.VO_API_V2, __contentScope.s.UNSUPPORTED;
          }
        },
        {
          order: 248,
          run() {
            __contentState.bf = 12e3;
          }
        },
        {
          order: 249,
          run() {
            __contentState.xf = 3e3;
          }
        },
        {
          order: 250,
          run() {
            __contentState.Sf = 4e3;
          }
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
              `daily`
            ];
          }
        },
        {
          order: 252,
          run() {
            __contentState.wf = 4;
          }
        },
        {
          order: 253,
          run() {
            __contentState.Tf = 400;
          }
        },
        {
          order: 254,
          run() {
            __contentState.Ef = [`auto`, `none`, `button`, `api`, `relogin`, `claim`, `workflow`];
          }
        },
        {
          order: 255,
          run() {
            __contentState.If = {
              auto: (e, t, n, r) => (n.push(
                t?.workflow === void 0 ? `当前为自动识别签到：按本站适配与当前页面寻找签到入口` : `当前为自动识别签到：不回放旧学习记录，按本站适配与当前页面寻找签到入口`
              ), (0, __contentScope.up)(e, t, n, false, r.loginHappenedThisRun ?? false, r)),
              none: (e, t, n, r) => (0, __contentScope.up)(e, t, n, true, r.loginHappenedThisRun ?? false, r),
              api: (e, t, n) => t ? (0, __contentScope.mp)(e, t, n) : Promise.resolve((0, __contentScope.Ff)(`api`)),
              button: (e, t, n, r, i) => t ? (0, __contentScope.gp)(e, t, n, r, i) : Promise.resolve((0, __contentScope.Ff)(`button`)),
              claim: (e, t, n, r) => t ? (0, __contentScope.vp)(e, t, n, r) : Promise.resolve((0, __contentScope.Ff)(`claim`)),
              workflow: __contentScope.Lf,
              relogin: (e, t, n, r) => t ? (0, __contentScope.dp)(e, t, n, r) : Promise.resolve((0, __contentScope.Ff)(`relogin`))
            };
          }
        },
        {
          order: 256,
          run() {
            __contentState.Rf = `签到流程的人机验证未完成，已停止当前页面操作`;
          }
        },
        {
          order: 257,
          run() {
            __contentState.$f = [`领取奖励`, `立即领取`, `确认领取`, `领取签到`, `继续签到`];
          }
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
              `claimed successfully`
            ];
          }
        },
        {
          order: 259,
          run() {
            __contentState.tp = (0, __contentScope.P)(/赞助|鸣谢|公益|sponsor|donat/i);
          }
        },
        {
          order: 260,
          run() {
            __contentState.np = (0, __contentScope.P)(/领取|claim|collect|redeem/i);
          }
        },
        {
          order: 261,
          run() {
            __contentState.rp = 4500;
          }
        },
        {
          order: 262,
          run() {
            __contentState.ip = (0, __contentScope.P)(/每日签到|daily\s+check[\s-]?in/i);
          }
        },
        {
          order: 263,
          run() {
            __contentState._p = `感谢提供服务，日常使用体验良好，继续保持。`;
          }
        },
        {
          order: 264,
          run() {
            __contentState.yp = 1e4;
          }
        },
        {
          order: 265,
          run() {
            __contentState.bp = 12e3;
          }
        },
        {
          order: 266,
          run() {
            __contentState.xp = 3e4;
          }
        },
        {
          order: 267,
          run() {
            __contentState.Sp = 8;
          }
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
              UNKNOWN: `unknown`
            };
          }
        },
        {
          order: 277,
          run() {
            __contentScope.Q.SELECTOR_MISMATCH, __contentScope.Q.ELEMENT_MISMATCH, __contentScope.Q.WORKFLOW_CONFIG, __contentScope.Q.IDENTITY_UNCONFIRMED, __contentScope.Q.AUTH_EXPIRED, __contentScope.Q.SESSION_SWITCH_FAILED, __contentScope.Q.SITE_UNAVAILABLE, __contentScope.Q.SITE_REJECTED, __contentScope.Q.ACCESS_DENIED, __contentScope.Q.MANUAL_REQUIRED, __contentScope.Q.NO_CHECKIN_ENTRY, __contentScope.Q.PAGE_TIMEOUT, __contentScope.Q.OBSCURED, __contentScope.Q.CHECKIN_UNVERIFIED, __contentScope.Q.CHECKIN_NO_BASELINE, __contentScope.Q.CONTROL_DISABLED, __contentScope.Q.PROXY_UNREACHABLE, __contentScope.Q.NETWORK_FAILURE, __contentScope.Q.ALREADY_DONE, __contentScope.Q.UNKNOWN;
          }
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
                  /今日签到已完成/
                ]
              },
              {
                code: __contentScope.Q.CHECKIN_NO_BASELINE,
                patterns: [/本轮已登录，但没有签到动作可确认/]
              },
              {
                code: __contentScope.Q.CHECKIN_UNVERIFIED,
                patterns: [
                  /没有签到动作可确认/,
                  /无法确认「登录即签到」/,
                  /无法把「登录即签到」归因到本轮/
                ]
              },
              {
                code: __contentScope.Q.WORKFLOW_CONFIG,
                patterns: [
                  /学习签到路线缺少身份核验页/,
                  /学习签到流程没有记录到可核验账号的身份页/,
                  /工作流没有配置任何步骤/,
                  /学到的流程未通过校验/
                ]
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
                  /已自动切换过 GitHub 账号/
                ]
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
                  /(?:请完成|请先完成|需要你|等待你)[^，。；\n]{0,10}(?:滑块|图形|行为|智能)?(?:验证|校验)/
                ]
              },
              {
                code: __contentScope.Q.ELEMENT_MISMATCH,
                patterns: [/指纹失配/, /命中了错误的元素/, /命中的元素不符/]
              },
              {
                code: __contentScope.Q.PROXY_UNREACHABLE,
                patterns: [/没有程序在监听/, /端口.{0,12}没人监听/, /没有任何程序接住/]
              },
              {
                code: __contentScope.Q.SESSION_SWITCH_FAILED,
                patterns: [
                  /无法清除.*Cookie/i,
                  /Cookie.*(?:残留|权限|清理失败)/i,
                  /无法退出当前(?:站点会话|账号)/,
                  /无法安全切换.*账号/,
                  /退出操作没有真正结束会话/,
                  /退出后会话仍然有效/
                ]
              },
              {
                code: __contentScope.Q.AUTH_EXPIRED,
                patterns: [/登录态/, /未登录/, /凭据有误/, /401/, /登录失效/, /重新登录/]
              },
              {
                code: __contentScope.Q.ACCESS_DENIED,
                patterns: [
                  /403/,
                  /forbidden/i,
                  /access\s*denied/i,
                  /访问被拒(?:绝)?/,
                  /地区(?:限制|不可用|不支持)/,
                  /不支持.{0,8}(?:国家|地区)/
                ]
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
                  /理由与历史重复/
                ]
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
                  /too many/i
                ]
              },
              {
                code: __contentScope.Q.OBSCURED,
                patterns: [/遮挡/, /被盖住/, /挡住了.*(?:按钮|控件|元素)/, /未关闭的公告/]
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
                  /导航未生效/
                ]
              },
              {
                code: __contentScope.Q.CONTROL_DISABLED,
                patterns: [
                  /按钮(?:当前)?(?:已|处于)?禁用/,
                  /控件(?:当前)?不可点/,
                  /按钮不可点/,
                  /disabled.{0,12}(?:without|no)\s+.{0,12}(?:already|success)/i
                ]
              },
              {
                code: __contentScope.Q.NETWORK_FAILURE,
                patterns: [/网络/, /代理/, /dns/i, /连接被/, /err_/i, /timeout/i, /超时/]
              },
              {
                code: __contentScope.Q.NO_CHECKIN_ENTRY,
                patterns: [/未自动发现同源签到入口/, /没有可点元素/, /不支持自动签到/]
              },
              {
                code: __contentScope.Q.SELECTOR_MISMATCH,
                patterns: [/找不到/, /未找到/, /当前页没有/, /选择器/, /未命中/]
              }
            ];
          }
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
              /^当前为自动识别签到：/
            ];
          }
        },
        {
          order: 280,
          run() {
            __contentState.Yp = {
              [__contentScope.Q.SITE_UNAVAILABLE]: [3e4, 12e4, 3e5],
              [__contentScope.Q.NETWORK_FAILURE]: [15e3, 6e4],
              [__contentScope.Q.PAGE_TIMEOUT]: [1e4, 3e4],
              [__contentScope.Q.AUTH_EXPIRED]: [5e3]
            };
          }
        },
        {
          order: 281,
          run() {
            __contentState.$p = {
              accessToken: `auth_token`,
              refreshToken: `refresh_token`,
              expiresAt: `token_expires_at`,
              user: `auth_user`
            };
          }
        },
        {
          order: 282,
          run() {
            __contentScope.o.SUB2API, __contentScope.$p.accessToken, __contentScope.$p.refreshToken, __contentScope.$p.expiresAt, __contentScope.$p.user, __contentScope.o.VO_API_V2, __contentScope.o.NEW_API;
          }
        },
        {
          order: 283,
          run() {
            __contentState.em = 12e4;
          }
        },
        {
          order: 284,
          run() {
            __contentState.tm = `/api/v1/auth/refresh`;
          }
        },
        {
          order: 303,
          run() {
            __contentState.Vm = [3e3, 8e3, 15e3];
          }
        },
        {
          order: 304,
          run() {
            __contentState.Hm = `页面暂不可用，自动重试`;
          }
        },
        {
          order: 305,
          run() {
            __contentState.Um = `自动重试:`;
          }
        },
        {
          order: 306,
          run() {
            __contentState.Wm = `切换账号:`;
          }
        },
        {
          order: 307,
          run() {
            __contentState.Gm = 1;
          }
        },
        {
          order: 308,
          run() {
            __contentState.Km = `自动切换 GitHub 账号:`;
          }
        },
        {
          order: 309,
          run() {
            __contentState.qm = `学习流程恢复登录:`;
          }
        },
        {
          order: 310,
          run() {
            __contentState.Jm = 2;
          }
        },
        {
          order: 311,
          run() {
            __contentState.Ym = 60;
          }
        },
        {
          order: 312,
          run() {
            __contentState.Xm = `进入签到页: `;
          }
        },
        {
          order: 313,
          run() {
            __contentState.Zm = `学习路线进度:`;
          }
        },
        {
          order: 314,
          run() {
            __contentState.Qm = 2;
          }
        },
        {
          order: 315,
          run() {
            __contentState.$m = 1;
          }
        },
        {
          order: 316,
          run() {
            __contentState.eh = 3;
          }
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
              `/checkin`
            ];
          }
        },
        {
          order: 318,
          run() {
            __contentState.$ = 3e5;
          }
        },
        {
          order: 319,
          run() {
            __contentState.nh = 12e3;
          }
        },
        {
          order: 320,
          run() {
            __contentState.rh = `个人资料身份已核验:`;
          }
        },
        {
          order: 321,
          run() {
            __contentState.ih = `本轮已全新登录:`;
          }
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
              `已调用站点退出接口`
            ];
          }
        },
        {
          order: 356,
          run() {
            __contentState.Gg = (0, __contentScope.e)({
              matches: [`<all_urls>`],
              runAt: `document_idle`,
              allFrames: true,
              matchAboutBlank: true,
              async main() {
                chrome.runtime.onMessage.addListener((e2, t2, n) => {
                  if (!e2 || typeof e2 != `object`) return;
                  let r2 = e2;
                  if (r2.type === `READ_LOGIN_OPTIONS`) {
                    if (t2.id !== chrome.runtime.id || !r2.site?.id || !r2.site?.loginUrl) {
                      n({ ok: false, error: `只能由扩展后台读取指定站点的登录方式` });
                      return;
                    }
                    const loginOptions = (0, __contentScope.readLoginOptions)(r2.site);
                    n({ ok: true, feature: { loginOptions } });
                    return;
                  }
                  if (r2.type === `FLUSH_LEARNING`) {
                    let e3 = typeof r2.runId == `string` ? r2.runId : ``;
                    if (__contentScope.Vg?.runId !== e3) {
                      n({ ok: true, challengeSeen: false, inactive: true });
                      return;
                    }
                    let t3 = (0, __contentScope.Wg)(), i2 = __contentScope.Vg;
                    return i2.stop(), i2.flush().then(
                      (e4) => n({
                        ok: true,
                        challengeSeen: e4.challengeSeen,
                        checkinControlSeen: t3,
                        ...e4.unlearnedNotes.length ? { unlearnedNotes: e4.unlearnedNotes } : {}
                      }),
                      (e4) => n({
                        ok: false,
                        error: e4 instanceof Error ? e4.message : String(e4)
                      })
                    ), true;
                  }
                  r2.type === `LEARN_MODE` && (r2.learning ? (0, __contentScope.Ug)(r2.learning) : ((0, __contentScope.Hg)(), __contentScope.Bg.end()), n({ ok: true }));
                });
                let e = await (0, __contentScope.n)({ type: `GET_TASK` });
                if (!e.ok) return;
                if (!e.task) {
                  e.feature?.learningSession && (0, __contentScope.Ug)(e.feature.learningSession);
                  return;
                }
                let t = e.task;
                if ((0, __contentScope.b)(t.runId, t.site.pointerMode ?? `trusted`), Date.now() - t.createdAt > 6e5)
                  return;
                if (t.effectiveLoginMethod === `github` && t.stage === `github-logout`) {
                  if ((0, __contentScope.Ir)(location.href)) {
                    await (0, __contentScope.n)({
                      type: `GITHUB_LOGOUT_COMPLETE`,
                      runId: t.runId,
                      steps: t.steps ?? []
                    });
                    return;
                  }
                  if (!(0, __contentScope.Fr)(location.href)) return;
                  let e2 = document.querySelector(
                    `form[action="/logout"], form[action="https://github.com/logout"]`
                  );
                  if (!e2) {
                    await (0, __contentScope.n)({
                      type: `NEEDS_USER`,
                      runId: t.runId,
                      message: `GitHub 退出页未找到官方退出表单，自动切换账号已停止`,
                      steps: t.steps ?? []
                    });
                    return;
                  }
                  try {
                    let t2 = e2.querySelector(`button[type="submit"], input[type="submit"]`);
                    t2 ? e2.requestSubmit(t2) : e2.requestSubmit();
                  } catch (e3) {
                    await (0, __contentScope.n)({
                      type: `NEEDS_USER`,
                      runId: t.runId,
                      message: `GitHub 自动退出失败（${e3 instanceof Error ? e3.message : String(e3)}）`,
                      steps: t.steps ?? []
                    });
                  }
                  return;
                }
                if (t.effectiveLoginMethod === `github` && (0, __contentScope.Rr)(location.href)) {
                  if ((0, __contentScope.Lr)(location.href) || !(0, __contentScope.Pr)(location.href))
                    return;
                  let e2 = `aah-github-login-attempt:${t.runId}`, r2 = false;
                  try {
                    r2 = sessionStorage.getItem(e2) === `1`;
                  } catch {
                  }
                  let i2 = t.githubUsername?.trim(), a2 = t.githubPassword, o2 = document.querySelector(`#login_field, input[name="login"]`), s = document.querySelector(`#password, input[type="password"]`);
                  if (r2) {
                    await (0, __contentScope.n)({
                      type: `NEEDS_USER`,
                      runId: t.runId,
                      message: `GitHub 登录未自动完成，请手动完成登录或二次验证`,
                      steps: t.steps ?? []
                    });
                    return;
                  }
                  if (!o2 || !s || !i2 || !a2) {
                    await (0, __contentScope.n)({
                      type: `NEEDS_USER`,
                      runId: t.runId,
                      message: `GitHub 登录页未找到完整的账号密码表单，请手动完成登录`,
                      steps: t.steps ?? []
                    });
                    return;
                  }
                  try {
                    sessionStorage.setItem(e2, `1`);
                  } catch {
                  }
                  let c = false;
                  for (let e3 = 0; e3 < 2; e3 += 1) {
                    let t2 = document.querySelector(`#login_field, input[name="login"]`), n = document.querySelector(`#password, input[type="password"]`);
                    if (!t2 || !n) break;
                    (0, __contentScope.A)(t2, i2), (0, __contentScope.A)(n, a2), await (0, __contentScope.w)(e3 === 0 ? 250 : 400);
                    let r3 = document.querySelector(`#login_field, input[name="login"]`), o3 = document.querySelector(`#password, input[type="password"]`);
                    if (c = r3?.value.trim() === i2 && o3?.value === a2, c) break;
                  }
                  let l = document.querySelector(`#login_field, input[name="login"]`), u = document.querySelector(`#password, input[type="password"]`), d = document.querySelector(
                    `input[type="submit"][name="commit"], button[type="submit"]`
                  );
                  if (!c || !l || !u || l.value.trim() !== i2 || u.value !== a2) {
                    await (0, __contentScope.n)({
                      type: `NEEDS_USER`,
                      runId: t.runId,
                      message: `GitHub 登录输入被页面或自动填充覆盖，已停止提交；请确认目标账号 ${i2}`,
                      steps: t.steps ?? []
                    });
                    return;
                  }
                  if (!d) {
                    await (0, __contentScope.n)({
                      type: `NEEDS_USER`,
                      runId: t.runId,
                      message: `GitHub 登录页未找到提交按钮，请手动完成登录`,
                      steps: t.steps ?? []
                    });
                    return;
                  }
                  let f2 = l.readOnly, p = u.readOnly;
                  l.readOnly = true, u.readOnly = true;
                  try {
                    await (0, __contentScope.M)(d, { mayNavigate: true });
                  } catch (e3) {
                    await (0, __contentScope.n)({
                      type: `NEEDS_USER`,
                      runId: t.runId,
                      message: `GitHub 登录自动点击失败，请手动完成登录（${e3 instanceof Error ? e3.message : String(e3)}）`,
                      steps: t.steps ?? []
                    });
                  } finally {
                    l.isConnected && (l.readOnly = f2), u.isConnected && (u.readOnly = p);
                  }
                  return;
                }
                let r = Promise.resolve(), i = (e2) => (r = r.catch(() => {
                }).then(async () => {
                  let r2 = await (0, __contentScope.n)({
                    type: `SYNC_PROGRESS`,
                    runId: t.runId,
                    steps: e2
                  });
                  !r2.ok && r2.error !== `任务已结束` && console.debug(`[签到助手] 实时进度同步失败`, r2.error);
                }), r);
                async function a() {
                  let e2;
                  await Promise.race([
                    r.catch(() => {
                    }),
                    new Promise((t2) => {
                      e2 = setTimeout(t2, 2e3);
                    })
                  ]), e2 && clearTimeout(e2);
                }
                let o = await (0, __contentScope.hh)(t, {
                  reportProgress(e2) {
                    return i(e2);
                  },
                  async markStage(e2, i2) {
                    await r;
                    let a2 = await (0, __contentScope.n)({
                      type: `SET_STAGE`,
                      runId: t.runId,
                      stage: e2,
                      steps: i2
                    });
                    if (!a2.ok) throw Error(a2.error);
                  },
                  async navigate(e2, i2, a2) {
                    if (!(0, __contentScope.W)(t.site, e2))
                      throw Error(`任务试图跳转到非本站地址，已停止自动操作`);
                    await r;
                    let o2 = await (0, __contentScope.n)({
                      type: `SET_STAGE`,
                      runId: t.runId,
                      stage: a2,
                      steps: i2,
                      ...[`login`, `relogin`].includes(a2) ? { resetLoginMethod: true } : {}
                    });
                    if (!o2.ok) throw Error(o2.error);
                    let s = new URL(e2, location.href);
                    s.origin === location.origin && s.pathname === location.pathname && s.search === location.search && s.hash !== location.hash ? (location.hash = s.hash, location.reload()) : location.assign(e2);
                  },
                  async needsUser(e2, i2) {
                    await r;
                    let a2 = await (0, __contentScope.n)({
                      type: `NEEDS_USER`,
                      runId: t.runId,
                      message: e2,
                      steps: i2
                    });
                    if (!a2.ok && a2.error !== `任务已结束`) throw Error(a2.error);
                  },
                  async waitForManualLogin(message, steps) {
                    await r;
                    const response = await (0, __contentScope.n)({
                      type: `MANUAL_LOGIN_WAITING`,
                      runId: t.runId,
                      message,
                      steps
                    });
                    if (!response.ok) throw Error(response.error || `后台无法保留页面登录任务`);
                    const deadline = response.feature?.manualLoginWaitUntil;
                    if (!Number.isFinite(deadline))
                      throw Error(`后台未返回页面登录等待时限，已停止自动操作`);
                    return deadline;
                  },
                  async clearSiteCookies() {
                    await r;
                    let e2 = await (0, __contentScope.n)({
                      type: `CLEAR_SITE_COOKIES`,
                      runId: t.runId
                    });
                    if (!e2.ok) throw Error(e2.error);
                    let i2 = e2.feature?.siteCookieClear;
                    if (!i2) throw Error(`后台未返回本站 Cookie 清理结果`);
                    return i2;
                  },
                  async startGithubLogout(e2) {
                    await r;
                    let i2 = await (0, __contentScope.n)({
                      type: `SET_STAGE`,
                      runId: t.runId,
                      stage: `github-logout`,
                      steps: e2
                    });
                    if (!i2.ok) throw Error(i2.error);
                    location.assign(`https://github.com/logout`);
                  },
                  async saveSession(e2) {
                    await (0, __contentScope.n)({
                      type: `SESSION_REFRESHED`,
                      runId: t.runId,
                      accountId: t.accountId,
                      accessToken: e2.accessToken,
                      refreshToken: e2.refreshToken,
                      tokenExpiresAt: e2.tokenExpiresAt
                    });
                  },
                  async confirmIdentity() {
                    await (0, __contentScope.n)({
                      type: `CONFIRM_IDENTITY`,
                      runId: t.runId
                    });
                  },
                  async resolveLoginMethod(method, loginEntry) {
                    await r;
                    const response = await (0, __contentScope.n)({
                      type: `RESOLVE_LOGIN_METHOD`,
                      runId: t.runId,
                      method,
                      ...loginEntry ? { loginEntry } : {}
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
                      runId: t.runId
                    });
                    if (!response.ok) {
                      throw Error(response.error || `后台无法确认本账号的登录提交`);
                    }
                  },
                  async saveIdentity(e2) {
                    let r2 = await (0, __contentScope.n)({
                      type: `SAVE_IDENTITY`,
                      runId: t.runId,
                      identity: e2
                    });
                    if (!r2.ok) throw Error(r2.error || `后台拒绝更新账号身份`);
                  },
                  async saveWorkflowRouteIndex(e2) {
                    await a();
                    let r2 = await (0, __contentScope.n)({
                      type: `SAVE_WORKFLOW_ROUTE`,
                      runId: t.runId,
                      index: e2
                    });
                    if (!r2.ok) throw Error(r2.error || `学习路线进度未保存`);
                  },
                  async saveBalance(e2) {
                    let r2 = await (0, __contentScope.n)({
                      type: `BALANCE_SNAPSHOT`,
                      runId: t.runId,
                      snapshot: e2
                    });
                    if (!r2.ok) throw Error(r2.error || `后台未写入余额快照`);
                  },
                  async saveReloginBalanceBefore(e2) {
                    await (0, __contentScope.n)({
                      type: `BALANCE_SNAPSHOT`,
                      runId: t.runId,
                      snapshot: e2,
                      phase: `relogin-before`
                    });
                  },
                  async saveButtonBalanceBefore(e2) {
                    await a();
                    let r2 = await (0, __contentScope.n)({
                      type: `BALANCE_SNAPSHOT`,
                      runId: t.runId,
                      snapshot: e2,
                      phase: `button-before`
                    });
                    if (!r2.ok) throw Error(r2.error);
                  },
                  async saveClaimText(e2) {
                    await (0, __contentScope.n)({
                      type: `CLAIM_TEXT_USED`,
                      runId: t.runId,
                      siteId: t.site.id,
                      text: e2
                    });
                  },
                  async saveCheckinReward(e2) {
                    (0, __contentScope.n)({
                      type: `CHECKIN_REWARD_OBSERVATION`,
                      runId: t.runId,
                      siteId: t.site.id,
                      bodyText: e2
                    });
                  }
                });
                if (o)
                  for (let e2 = 0; e2 < 3; e2 += 1) {
                    let r2 = await (0, __contentScope.n)({
                      type: `TASK_RESULT`,
                      runId: t.runId,
                      result: o
                    });
                    if (r2.ok || r2.error === `任务已结束`) break;
                    await new Promise((t2) => setTimeout(t2, 250 * (e2 + 1)));
                  }
              }
            });
          }
        }
      ]
    };
  }

  // src/modules/slider/content.js
  function createSliderAutoContent(__contentScope) {
    const __contentState = bindContentState(__contentScope, [
      "wo",
      "To",
      "q",
      "Eo",
      "Do",
      "Oo",
      "ko",
      "Ao",
      "jo",
      "Mo",
      "No",
      "Po",
      "Fo",
      "Io",
      "Lo",
      "Ro",
      "zo",
      "Bo",
      "Vo",
      "Ho",
      "Uo",
      "Wo",
      "Go",
      "Ko",
      "qo",
      "Jo",
      "Yo",
      "Xo",
      "Zo",
      "Qo",
      "$o",
      "J",
      "Y",
      "X",
      "es",
      "ts",
      "ns",
      "rs",
      "is",
      "as",
      "os",
      "ss",
      "cs",
      "ls",
      "us",
      "ds",
      "fs",
      "ps",
      "ms",
      "hs",
      "gs",
      "_s",
      "vs",
      "ys",
      "bs",
      "xs",
      "Ss",
      "Cs",
      "ws",
      "Ts",
      "Es",
      "Ds",
      "Os",
      "ks",
      "As",
      "js",
      "Ms",
      "Ns",
      "Ps",
      "Fs",
      "Is",
      "Ls",
      "Rs",
      "zs",
      "Bs",
      "Vs",
      "Hs",
      "Us",
      "Ws",
      "Gs",
      "Ks",
      "qs",
      "Js",
      "Ys",
      "Xs",
      "Zs",
      "Qs",
      "$s",
      "ec",
      "tc",
      "nc",
      "rc",
      "ic",
      "ac",
      "oc",
      "sc",
      "cc",
      "lc",
      "uc",
      "dc",
      "fc",
      "pc",
      "mc",
      "hc",
      "gc",
      "_c",
      "vc",
      "yc",
      "bc",
      "xc",
      "Sc",
      "Cc",
      "wc",
      "Tc",
      "Ec",
      "Dc",
      "Oc",
      "kc",
      "Ac",
      "jc",
      "Mc",
      "Nc",
      "Pc",
      "Fc",
      "Ic",
      "Lc",
      "Rc",
      "zc",
      "Bc",
      "Vc",
      "Hc",
      "Uc",
      "Wc",
      "Gc",
      "Kc",
      "qc",
      "Jc",
      "Yc",
      "Xc",
      "Zc",
      "Qc",
      "$c",
      "el",
      "tl",
      "nl",
      "rl",
      "il",
      "al",
      "ol",
      "sl",
      "cl",
      "ll",
      "ul",
      "dl",
      "fl",
      "pl",
      "ml",
      "hl",
      "gl",
      "_l",
      "vl",
      "yl",
      "bl",
      "xl",
      "Sl",
      "Cl",
      "wl",
      "Tl",
      "El",
      "Dl",
      "Ol",
      "kl",
      "Al",
      "jl",
      "Ml",
      "Nl",
      "Pl",
      "Fl",
      "Il",
      "Ll",
      "Rl",
      "zl",
      "Bl",
      "Vl",
      "Hl",
      "Ul",
      "Wl",
      "Gl",
      "Kl",
      "ql",
      "Jl",
      "Yl",
      "Xl",
      "Zl",
      "Ql",
      "$l",
      "eu",
      "tu",
      "nu",
      "ru",
      "iu",
      "au",
      "ou",
      "su",
      "cu",
      "lu",
      "Z",
      "uu",
      "du",
      "fu",
      "pu",
      "mu",
      "hu",
      "gu",
      "_u",
      "vu",
      "yu",
      "bu",
      "xu",
      "Su",
      "Cu",
      "wu",
      "Tu",
      "Eu",
      "Du",
      "Ou",
      "ku",
      "Au",
      "ju",
      "Mu",
      "Nu",
      "Pu",
      "Fu",
      "Iu",
      "Lu",
      "Ru",
      "zu",
      "Ap",
      "jp",
      "Mp",
      "Np",
      "Pp",
      "Fp",
      "Ip",
      "Lp",
      "Rp",
      "zp",
      "Bp",
      "Vp",
      "Hp",
      "Up",
      "Wp"
    ]);
    function Do(e) {
      if (!e.isConnected || !e.getClientRects().length || !(0, __contentScope.Co)(e.src) && !__contentScope.Eo.has(e.id))
        return false;
      let t = e;
      for (; t; ) {
        let e2 = getComputedStyle(t);
        if (e2.display === `none` || e2.visibility !== `visible` || Number.parseFloat(e2.opacity || `1`) <= 0.02)
          return false;
        t = t.parentElement;
      }
      let n = e.getBoundingClientRect();
      return n.width >= 150 && n.height >= 90 && Math.min(n.right, innerWidth) - Math.max(n.left, 0) >= 80 && Math.min(n.bottom, innerHeight) - Math.max(n.top, 0) >= 60;
    }
    function Oo() {
      let e = [...document.querySelectorAll(`iframe`)].filter(__contentScope.Do);
      return e.find((e2) => {
        let t = e2.getBoundingClientRect();
        return document.elementFromPoint(t.left + t.width / 2, t.top + t.height / 2) === e2;
      }) ?? e[0];
    }
    function qo(e) {
      return {
        mode: e,
        semantic: /* @__PURE__ */ new WeakMap(),
        visibility: /* @__PURE__ */ new WeakMap(),
        imageSource: /* @__PURE__ */ new WeakMap()
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
      return __contentScope.Ko?.mode === `tencent-page` || __contentScope.Ko?.mode === `tencent-frame`;
    }
    function Xo() {
      return (0, __contentScope.Yo)() ? `${__contentScope.q.widgets}, ${__contentScope.ko}` : __contentScope.ko;
    }
    function Zo() {
      return (0, __contentScope.Yo)() ? `${__contentScope.q.success}, ${__contentScope.Ao}` : __contentScope.Ao;
    }
    function Qo() {
      return (0, __contentScope.Yo)() ? `${__contentScope.q.handle}, ${__contentScope.jo}` : __contentScope.jo;
    }
    function $o(e) {
      return __contentScope.zo.test(e) || (0, __contentScope.Yo)() && /groove/i.test(e);
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
    function X(e) {
      return e.getBoundingClientRect();
    }
    function es(e) {
      let t = (e2) => Math.round(e2 * 10) / 10;
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
        e.getAttribute(`data-status`)
      ], r = (e.textContent ?? ``).replace(/\s+/g, ` `).trim().slice(0, 180), i = `${n.filter(Boolean).join(` `)} ${r}`.toLowerCase();
      return t?.semantic.set(e, i), i;
    }
    function ns(e, t = 5) {
      let n = [], r = e;
      for (let e2 = 0; r && e2 < t; e2 += 1) n.push((0, __contentScope.ts)(r)), r = r.parentElement;
      return n.join(` `);
    }
    function rs(e) {
      let t = (0, __contentScope.ns)(e, 7);
      return __contentScope.No.test(t) && (__contentScope.Po.test(t) || __contentScope.Bo.test(t));
    }
    function is(e, t) {
      return [...e].map((e2) => ({ element: e2, score: t(e2) })).filter((e2) => Number.isFinite(e2.score)).sort((e2, t2) => t2.score - e2.score);
    }
    function as(e) {
      if (!(e instanceof HTMLElement) || !(0, __contentScope.Y)(e)) return -1 / 0;
      let t = (0, __contentScope.X)(e);
      if (t.width < 12 || t.height < 12 || t.width > 180 || t.height > 110) return -1 / 0;
      if ((0, __contentScope.Yo)()) {
        let n2 = t.left + t.width / 2, r2 = t.top + t.height / 2;
        if (n2 >= 0 && r2 >= 0 && n2 < innerWidth && r2 < innerHeight) {
          let t2 = document.elementFromPoint(n2, r2);
          if (!t2 || !(t2 === e || e.contains(t2))) return -1 / 0;
        }
      }
      let n = (0, __contentScope.ts)(e), r = (0, __contentScope.ns)(e, 7), i = 0;
      (0, __contentScope.Yo)() && e.matches(__contentScope.q.handle) && (i += 12), e.getAttribute(`role`)?.toLowerCase() === `slider` && (i += 8), __contentScope.Fo.test(n) ? i += 9 : __contentScope.Po.test(n) && (i += 4), __contentScope.No.test(r) && (i += 7), __contentScope.Bo.test(r) && (i += 4), __contentScope.Po.test(r) && (i += 2), __contentScope.Io.test(r) && !__contentScope.No.test(r) && (i -= 14), e instanceof HTMLInputElement && e.type === `range` && !__contentScope.No.test(r) && (i -= 12), t.width <= 100 && t.height <= 80 && (i += 2);
      let a = window.getComputedStyle(e).cursor;
      return (a === `grab` || a === `grabbing` || a === `pointer` || a === `move`) && (i += 2), i;
    }
    function os() {
      let e = (0, __contentScope.J)((0, __contentScope.Qo)()), t = (0, __contentScope.J)(`button, [role], [draggable], [class], [id]`).slice(0, __contentScope.Uo).filter((e2) => __contentScope.Fo.test((0, __contentScope.ts)(e2)));
      return [.../* @__PURE__ */ new Set([...e, ...t])].filter((e2) => e2 instanceof HTMLElement).map((e2) => ({ element: e2, score: (0, __contentScope.as)(e2) })).filter((e2) => Number.isFinite(e2.score)).sort((e2, t2) => t2.score - e2.score).map((e2) => e2.element);
    }
    function ss(e, t) {
      if (!(0, __contentScope.Y)(e) || !e.contains(t)) return -1 / 0;
      let n = (0, __contentScope.X)(e), r = (0, __contentScope.X)(t);
      if (n.width < r.width * 2 || n.height < r.height * 1.6) return -1 / 0;
      let i = (0, __contentScope.ts)(e), a = 0;
      return __contentScope.No.test(i) && (a += 8), __contentScope.Po.test(i) && (a += 5), __contentScope.Bo.test(i) && (a += 4), (0, __contentScope.J)(`img, canvas`, e).some(__contentScope.Y) && (a += 5), n.width >= 160 && n.width <= 720 && (a += 3), n.height >= 110 && n.height <= 720 && (a += 3), n.width >= window.innerWidth * 0.96 && n.height >= window.innerHeight * 0.9 && (a -= 3), a -= Math.log10(Math.max(10, n.width * n.height)), a;
    }
    function cs(e) {
      let t = [], n = e.parentElement;
      for (let e2 = 0; n && n !== document.body && e2 < 12; e2 += 1) t.push(n), n = n.parentElement;
      let r = (0, __contentScope.is)(t, (t2) => (0, __contentScope.ss)(t2, e))[0];
      return r && r.score >= 3 ? r.element : null;
    }
    function ls(e, t) {
      return Math.max(0, Math.min(e.bottom, t.bottom) - Math.max(e.top, t.top));
    }
    function us(e, t, n) {
      if (!(0, __contentScope.Y)(e) || !t.contains(e)) return -1 / 0;
      let r = (0, __contentScope.X)(e), i = (0, __contentScope.X)(n);
      if (r.width < i.width * 1.8 || r.height > Math.max(100, i.height * 3) || (0, __contentScope.ls)(r, i) < Math.min(i.height, r.height) * 0.25)
        return -1 / 0;
      let a = (0, __contentScope.ts)(e), o = 0;
      return (0, __contentScope.$o)(a) ? o += 9 : __contentScope.Po.test(a) && (o += 4), e.contains(n) && (o += 5), r.width >= i.width * 3 && (o += 3), r.height <= i.height * 1.5 && (o += 3), o += Math.min(4, r.width / Math.max(1, i.width * 3)), o;
    }
    function ds(e, t) {
      let n = (0, __contentScope.J)(`[role="slider"], input[type="range"], [class], [id]`, e).slice(
        0,
        __contentScope.Uo
      ), r = [], i = t.parentElement;
      for (; i && i !== e.parentElement && (r.push(i), i !== e); ) i = i.parentElement;
      let a = (0, __contentScope.is)(
        /* @__PURE__ */ new Set([...n, ...r]),
        (n2) => (0, __contentScope.us)(n2, e, t)
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
        return t.protocol !== `http:` && t.protocol !== `https:` ? void 0 : { value: t.href, kind: `url` };
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
        let t2 = e.currentSrc || e.src;
        t2 && (n = (0, __contentScope.ps)(t2));
      } else {
        let t2 = (0, __contentScope.fs)(e);
        t2 && (n = (0, __contentScope.ps)(t2));
      }
      return t?.imageSource.set(e, n), n;
    }
    function hs(e, t, n, r) {
      if (!(0, __contentScope.Y)(e) || !t.contains(e) || e === r) return -1 / 0;
      let i = (0, __contentScope.X)(e), a = (0, __contentScope.X)(n);
      if (i.width < Math.max(110, (0, __contentScope.X)(r).width * 1.8) || i.height < 45 || i.width / Math.max(1, i.height) < 1.1 || i.top > a.bottom + 20)
        return -1 / 0;
      let o = (0, __contentScope.ts)(e), s = 0;
      return __contentScope.Ko?.mode === `tencent-frame` && (e.matches(__contentScope.q.background) ? s += 12 : e.matches(__contentScope.q.backgroundImage) && (s += 9)), (e instanceof HTMLImageElement || e instanceof HTMLCanvasElement) && (s += 5), (0, __contentScope.ms)(e) && (s += 5), __contentScope.Lo.test(o) && (s += 5), __contentScope.Ro.test(o) && (s -= 8), /logo|icon|avatar|btn|button|thumb/i.test(o) && (s -= 9), i.bottom <= a.top + 25 && (s += 4), s += Math.min(5, i.width * i.height / 2e4), s;
    }
    function gs(e, t, n) {
      let r = (0, __contentScope.is)(
        (0, __contentScope.J)(__contentScope.Mo, e).slice(0, __contentScope.Uo),
        (r2) => (0, __contentScope.hs)(r2, e, t, n)
      )[0];
      return r && r.score >= 6 ? r.element : null;
    }
    function _s(e, t) {
      let n = (0, __contentScope.ms)(t)?.value, r = (0, __contentScope.X)(t);
      return (0, __contentScope.J)(`img, canvas, [class], [id]`, e).slice(0, __contentScope.Uo).filter((e2) => e2 !== t).map((e2) => {
        let t2 = (0, __contentScope.ms)(e2);
        if (!t2 || t2.value === n) return null;
        let i = (0, __contentScope.ts)(e2);
        if (!__contentScope.Lo.test(i) || __contentScope.Ro.test(i) || /logo|icon|btn|button/i.test(i))
          return null;
        let a = (0, __contentScope.X)(e2), o = a.width || (e2 instanceof HTMLCanvasElement ? e2.width : 0) || (e2 instanceof HTMLImageElement ? e2.naturalWidth : 0), s = a.height || (e2 instanceof HTMLCanvasElement ? e2.height : 0) || (e2 instanceof HTMLImageElement ? e2.naturalHeight : 0);
        if (o < 80 || s < 40) return null;
        let c = o / s, l = r.width / Math.max(1, r.height), u = Math.abs(Math.log(c / l));
        if (u > 0.1) return null;
        let d = 8 - u * 20;
        return (e2 instanceof HTMLCanvasElement || e2 instanceof HTMLImageElement) && (d += 3), /full|original|complete|完整|原图/i.test(i) && (d += 2), { element: e2, score: d };
      }).filter((e2) => e2 != null).sort((e2, t2) => t2.score - e2.score)[0]?.element;
    }
    function vs(e, t) {
      return e.left < t.right && e.right > t.left && e.top < t.bottom && e.bottom > t.top;
    }
    function ys(e, t, n, r) {
      if (!(0, __contentScope.Y)(e) || !t.contains(e) || e === n || e === r) return -1 / 0;
      let i = (0, __contentScope.X)(e), a = (0, __contentScope.X)(n);
      if (!(0, __contentScope.vs)(i, a) || i.width < 8 || i.height < 8 || i.width > a.width * 1.08 || i.height > a.height * 1.15)
        return -1 / 0;
      let o = i.width / Math.max(1, i.height);
      if (o > 2.5 || o < 0.4) return -1 / 0;
      let s = (0, __contentScope.X)(r), c = Math.min(i.width, i.height), l = Math.max(i.width, i.height), u = Math.min(s.width, s.height);
      if (u >= 8 && c < u * 0.55 && l > u * 1.25) return -1 / 0;
      let d = (0, __contentScope.ts)(e), f = 0;
      __contentScope.Ro.test(d) && (f += 11), (0, __contentScope.ms)(e) && (f += 5), (e instanceof HTMLImageElement || e instanceof HTMLCanvasElement) && (f += 2), __contentScope.Lo.test(d) && !__contentScope.Ro.test(d) && (f -= 6), /logo|icon|avatar|btn|button|track|rail/i.test(d) && (f -= 10);
      let p = i.width / Math.max(1, a.width);
      return p >= 0.08 && p <= 0.55 ? f += 5 : p > 0.9 && (f -= 3), f;
    }
    function bs(e, t, n) {
      if ((0, __contentScope.Yo)() && n.matches(__contentScope.q.handle)) {
        let r2 = (0, __contentScope.J)(__contentScope.q.piece, e).filter(__contentScope.Y);
        return r2.length === 1 && (0, __contentScope.ys)(r2[0], e, t, n) >= 5 ? r2[0] : void 0;
      }
      let r = (0, __contentScope.is)(
        (0, __contentScope.J)(__contentScope.Mo, e).slice(0, __contentScope.Uo),
        (r2) => (0, __contentScope.ys)(r2, e, t, n)
      )[0];
      return r && r.score >= 5 ? r.element : void 0;
    }
    function xs() {
      if (__contentScope.Ko?.geometryPanels) return __contentScope.Ko.geometryPanels;
      let e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set(), n = (0, __contentScope.J)(
        (0, __contentScope.Yo)() ? `${__contentScope.q.widgets}, ${__contentScope.Vo}` : __contentScope.Vo
      ).filter(__contentScope.Y).slice(0, __contentScope.Uo);
      for (let r2 of n) {
        let n2 = r2;
        for (let r3 = 0; n2 && r3 < 8 && n2 !== document.body && n2 !== document.documentElement; r3 += 1, n2 = n2.parentElement) {
          if (t.has(n2)) continue;
          t.add(n2);
          let r4 = (0, __contentScope.X)(n2);
          if (r4.width < 160 || r4.width > 760 || r4.height < 110 || r4.height > 720 || !(0, __contentScope.Y)(n2) || n2.closest(`pre, code, textarea, [contenteditable="true"]`))
            continue;
          let i = (0, __contentScope.Ks)(n2);
          __contentScope.No.test(i) && __contentScope.Bo.test(i) && e.add(n2);
        }
      }
      let r = [...e].sort((e2, t2) => {
        let n2 = (0, __contentScope.X)(e2), r2 = (0, __contentScope.X)(t2);
        return n2.width * n2.height - r2.width * r2.height;
      }).slice(0, 12);
      return __contentScope.Ko && (__contentScope.Ko.geometryPanels = r), r;
    }
    function Ss(e, t, n = 3) {
      return t.left >= e.left - n && t.right <= e.right + n && t.top >= e.top - n && t.bottom <= e.bottom + n;
    }
    function Cs(e, t) {
      return Math.max(0, Math.min(window.innerWidth, e.right) - Math.max(0, e.left)) * Math.max(0, Math.min(window.innerHeight, e.bottom) - Math.max(0, e.top)) >= e.width * e.height * t;
    }
    function ws(e, t) {
      if (!(0, __contentScope.Y)(e)) return -1 / 0;
      let n = (0, __contentScope.X)(e);
      return n.width < 110 || n.height < 50 || n.width / n.height < 1.1 || n.width / n.height > 4.5 || !(0, __contentScope.Ss)((0, __contentScope.X)(t), n) || !(0, __contentScope.Cs)(n, 0.96) || !(e instanceof HTMLImageElement) && !(e instanceof HTMLCanvasElement) && !(0, __contentScope.fs)(e) ? -1 / 0 : 8 + Math.min(5, n.width * n.height / 2e4) + (__contentScope.Lo.test((0, __contentScope.ts)(e)) ? 3 : 0);
    }
    function Ts(e, t, n) {
      if (!(e instanceof HTMLElement) || e === t || e.contains(t) || t.contains(e) || !(0, __contentScope.Y)(e))
        return -1 / 0;
      let r = (0, __contentScope.X)(e), i = (0, __contentScope.X)(t), a = r.top - i.bottom;
      return r.height < 12 || r.height > 90 || r.width < r.height * 3 || r.width < i.width * 0.75 || r.width > i.width * 1.25 || a < -4 || a > Math.max(64, i.height * 0.35) || Math.abs(r.left - i.left) > Math.max(24, i.width * 0.12) || !(0, __contentScope.Ss)((0, __contentScope.X)(n), r) || !(0, __contentScope.Cs)(r, 0.98) ? -1 / 0 : 8 + ((0, __contentScope.$o)((0, __contentScope.ts)(e)) ? 3 : 0) + 4 * (1 - Math.min(1, Math.abs(r.width - i.width) / i.width));
    }
    function Es(e, t) {
      if (!(e instanceof HTMLElement) || e === t || !t.contains(e) || !(0, __contentScope.Y)(e) || e.matches(`input, select, textarea, :disabled`) || e.closest(`[inert], [aria-disabled="true"], [aria-hidden="true"], [disabled]`))
        return -1 / 0;
      let n = (0, __contentScope.X)(e), r = (0, __contentScope.X)(t);
      if (n.width < 20 || n.width > 110 || n.height < 18 || n.height > 96 || n.width / n.height < 0.45 || n.width / n.height > 2.6 || r.width < n.width * 2.7 || n.height < r.height * 0.55 || n.height > r.height * 1.5 || n.left < r.left - 3 || n.right > r.right + 3 || (0, __contentScope.ls)(n, r) < Math.min(n.height, r.height) * 0.65 || !(0, __contentScope.Cs)(n, 0.98))
        return -1 / 0;
      let i = (0, __contentScope.ts)(e);
      if (__contentScope.Ho.test(i)) return -1 / 0;
      let a = window.getComputedStyle(e);
      if (a.pointerEvents === `none`) return -1 / 0;
      let o = e.matches((0, __contentScope.Qo)()) || __contentScope.Fo.test(i) || e.matches(`button, [role="button"]`) || /^(?:grab|grabbing|pointer|move|ew-resize)$/.test(a.cursor), s = a.boxShadow !== `none` && a.boxShadow !== `` || Number.parseFloat(a.borderLeftWidth) > 0 || !!a.backgroundColor && !/^(?:transparent|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\))$/.test(a.backgroundColor);
      if (!o && !s) return -1 / 0;
      let c = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
      return !c || !(c === e || e.contains(c)) ? -1 / 0 : 8 + (o ? 6 : 0) + 4 * (1 - Math.min(1, Math.abs(n.height - r.height) / r.height)) + +(n.left - r.left < r.width * 0.35);
    }
    function Ds() {
      for (let e of (0, __contentScope.xs)()) {
        let t = (0, __contentScope.J)(`*`, e).slice(0, __contentScope.Uo), n = (0, __contentScope.is)(t, (t2) => (0, __contentScope.ws)(t2, e)).slice(0, 4), r;
        for (let { element: i, score: a } of n) {
          let n2 = (0, __contentScope.is)(t, (t2) => (0, __contentScope.Ts)(t2, i, e)).slice(0, 6);
          for (let { element: o, score: s } of n2) {
            let n3 = (0, __contentScope.is)(t, (e2) => (0, __contentScope.Es)(e2, o))[0];
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
    function Os() {
      for (let e of (0, __contentScope.os)()) {
        let t = (0, __contentScope.as)(e);
        if (t < 9 || !(0, __contentScope.rs)(e) && t < 14) continue;
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
            handle: e
          };
      }
      return (0, __contentScope.Ds)();
    }
    function ks(e = `page`) {
      return (0, __contentScope.Jo)(__contentScope.Os, e);
    }
    function As() {
      return (0, __contentScope.Jo)(
        () => (0, __contentScope.J)(__contentScope.ko).some(__contentScope.Y) ? true : (0, __contentScope.Os)() != null || (0, __contentScope.xs)().length > 0
      );
    }
    function js(e) {
      let t = e ?? document, n = (0, __contentScope.Zo)();
      return e?.matches(n) && (0, __contentScope.Y)(e) || (0, __contentScope.J)(n, t).some(__contentScope.Y) ? true : !e || !(0, __contentScope.Y)(e) ? false : [`data-state`, `data-status`, `aria-checked`].some(
        (t2) => /^(?:verified|success|passed|complete|completed|true)$/i.test(
          e.getAttribute(t2)?.trim() ?? ``
        )
      );
    }
    function Ms(e) {
      let t = 2166136261, n = Math.max(1, Math.floor(e.length / 256));
      for (let r = 0; r < e.length; r += n) t ^= e.charCodeAt(r), t = Math.imul(t, 16777619);
      return t ^= e.length, (t >>> 0).toString(36);
    }
    function Ns(e) {
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
    function Ps(e, t, n, r) {
      let i = (0, __contentScope.X)(e.background), a = e.piece ? (0, __contentScope.X)(e.piece) : void 0;
      return (0, __contentScope.Ms)(
        [
          t?.value ?? (0, __contentScope.ts)(e.background),
          r?.value ?? ``,
          n?.value ?? (e.piece ? (0, __contentScope.ts)(e.piece) : ``),
          `${i.width.toFixed(1)}x${i.height.toFixed(1)}`,
          a ? `${a.width.toFixed(1)}x${a.height.toFixed(1)}` : `no-piece`,
          t ? `` : (0, __contentScope.Ns)(e.background),
          n ? `` : (0, __contentScope.Ns)(e.piece)
        ].join(`|`)
      );
    }
    function Fs(e) {
      let t = (0, __contentScope.X)(e);
      return t.left < 4 || t.top < 4 || t.right > window.innerWidth - 4 || t.bottom > window.innerHeight - 4;
    }
    function Rs(e) {
      return [e.panel, e.background, e.piece, e.track, e.handle].filter((e2) => e2 != null).flatMap((e2) => {
        let t = (0, __contentScope.X)(e2);
        return [t.x, t.y, t.width, t.height];
      });
    }
    function zs(e, t, n = 1.5) {
      return e.length === t.length && e.every((e2, r) => Math.abs(e2 - t[r]) <= n);
    }
    function Bs(e) {
      return [e.background, e.piece].every(
        (e2) => e2 instanceof HTMLImageElement ? e2.complete && e2.naturalWidth > 0 && e2.naturalHeight > 0 : e2 instanceof HTMLCanvasElement ? e2.width > 0 && e2.height > 0 : true
      );
    }
    async function Vs(e = 1500, t = () => true, n = `page`) {
      let r = Date.now() + e;
      if (!t()) return null;
      let i = (0, __contentScope.ks)(n);
      for (; !i && Date.now() < r && t(); )
        await (0, __contentScope.Ls)(Math.min(120, Math.max(0, r - Date.now()))), i = (0, __contentScope.ks)(n);
      return t() ? i : null;
    }
    function Us() {
      return __contentScope.Hs;
    }
    function Ws(e) {
      return (0, __contentScope.Jo)(() => {
        let e2 = (0, __contentScope.os)().filter(
          (e3) => (0, __contentScope.as)(e3) >= 9 && (0, __contentScope.rs)(e3)
        );
        if (!e2.length) return `当前验证码文档未找到可接收拖动的滑块把手（可能仍在加载或被遮挡）`;
        let t = e2.map((e3) => ({ handle: e3, panel: (0, __contentScope.cs)(e3) })).filter((e3) => e3.panel != null);
        if (!t.length) return `已找到滑块把手，但尚未找到它所属的验证码面板`;
        let n = t.map(({ handle: e3, panel: t2 }) => ({
          handle: e3,
          panel: t2,
          track: (0, __contentScope.ds)(t2, e3)
        })).filter((e3) => e3.track != null);
        return n.length ? n.some(({ handle: e3, panel: t2, track: n2 }) => (0, __contentScope.gs)(t2, n2, e3)) ? `验证码组件仍在重绘，尚未取得同一挑战的完整滑块控件` : `已找到滑块把手和轨道，但验证码背景图片尚未就绪` : `已找到验证码面板和把手，但没有匹配的滑动轨道`;
      }, e);
    }
    async function Gs(e = {}) {
      __contentScope.Hs = void 0;
      let t = e.mode ?? `page`, n = () => e.isActive?.() !== false && Date.now() < (e.deadline ?? 1 / 0), r = () => Math.max(0, Math.min(e.mountTimeoutMs ?? 1500, (e.deadline ?? 1 / 0) - Date.now())), i = await (0, __contentScope.Vs)(r(), n, t);
      if (!i || (0, __contentScope.Fs)(i.panel) && (i.panel.scrollIntoView({
        block: `center`,
        inline: `center`,
        behavior: `auto`
      }), await (0, __contentScope.Is)(t), i = await (0, __contentScope.Vs)(r(), n, t), !i))
        return __contentScope.Hs = n() ? (0, __contentScope.Ws)(t) : `本轮滑块任务已停止或超过时限`, null;
      let a = Math.min(
        e.deadline ?? 1 / 0,
        Date.now() + Math.max(2500, Math.min(e.mountTimeoutMs ?? 0, 6e3))
      ), o = (0, __contentScope.Rs)(i), s = 0;
      for (; Date.now() < a && n(); ) {
        await (0, __contentScope.Ls)(50);
        let e2 = (0, __contentScope.ks)(t);
        if (!e2) {
          s = 0;
          continue;
        }
        let n2 = (0, __contentScope.Rs)(e2);
        if ((0, __contentScope.Bs)(e2) && (0, __contentScope.zs)(o, n2) ? s += 1 : s = 0, o = n2, i = e2, s >= 2)
          break;
      }
      if (s < 2 || !n())
        return __contentScope.Hs = n() ? (0, __contentScope.Bs)(i) ? `验证码布局在等待时间内没有稳定，未使用动画中的坐标拖动` : `验证码图片还没有加载完成，未执行拖动` : `本轮滑块任务已停止或超过时限`, null;
      let c = (0, __contentScope.ms)(i.background), l = i.detectionMethod === `panel-geometry` ? void 0 : (0, __contentScope._s)(i.panel, i.background), u = l ? (0, __contentScope.ms)(l) : void 0, d = i.piece ? (0, __contentScope.ms)(i.piece) : void 0, f = t === `tencent-frame` && i.handle.matches(__contentScope.q.handle), p = i.handle.getAttribute(__contentScope.Go), m = `p-slider-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      i.handle.setAttribute(__contentScope.Go, m);
      let h = false;
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
          challengeKey: (0, __contentScope.Ps)(i, c, d, u)
        },
        match: i,
        releaseHandleMarker: () => {
          h || (h = true, i.handle.getAttribute(__contentScope.Go) === m && (p == null ? i.handle.removeAttribute(__contentScope.Go) : i.handle.setAttribute(__contentScope.Go, p)));
        }
      };
    }
    function Ks(e) {
      let t = (e ? [e] : (0, __contentScope.J)((0, __contentScope.Xo)())).filter(__contentScope.Y), n = t.filter((e2) => !t.some((t2) => t2 !== e2 && t2.contains(e2))), r = [], i = 0, a = 0;
      for (let e2 of n) {
        let t2 = document.createTreeWalker(e2, NodeFilter.SHOW_TEXT), n2;
        for (; (n2 = t2.nextNode()) && a < __contentScope.Uo && i < 1500; ) {
          a += 1;
          let e3 = n2.textContent ?? ``;
          e3.trim() && n2.parentElement && (0, __contentScope.Y)(n2.parentElement) && (r.push(e3), i += e3.length);
        }
        if (a >= __contentScope.Uo || i >= 1500) break;
      }
      return r.join(` `).replace(/\s+/g, ` `).trim().slice(0, 1500);
    }
    function qs(e, t = `page`) {
      return (0, __contentScope.Jo)(() => {
        let n = (0, __contentScope.Os)();
        if (!n) {
          let n2 = [
            ...(0, __contentScope.J)((0, __contentScope.Xo)()).filter(__contentScope.Y),
            ...(0, __contentScope.xs)()
          ], r2 = e && (0, __contentScope.Y)(e) ? e : void 0;
          if (t === `page`) {
            let e2 = r2 ?? n2[0];
            return {
              visible: n2.length > 0,
              success: (0, __contentScope.js)(e2) || (0, __contentScope.js)(),
              panel: e2,
              statusText: (0, __contentScope.Ks)(e2)
            };
          }
          let i2 = [...new Set(n2)].filter((e2) => !n2.some((t2) => t2 !== e2 && t2.contains(e2))), a2 = i2.find(
            (e2) => !(0, __contentScope.js)(e2) && (!r2 || !r2.contains(e2) && !e2.contains(r2))
          ) ?? r2 ?? i2[0];
          return {
            visible: n2.length > 0 || a2 != null,
            success: a2 != null && (0, __contentScope.js)(a2),
            panel: a2,
            statusText: (0, __contentScope.Ks)(a2)
          };
        }
        let r = (0, __contentScope.ms)(n.background), i = n.detectionMethod === `panel-geometry` ? void 0 : (0, __contentScope._s)(n.panel, n.background), a = i ? (0, __contentScope.ms)(i) : void 0, o = n.piece ? (0, __contentScope.ms)(n.piece) : void 0, s = (0, __contentScope.X)(n.handle), c = (0, __contentScope.X)(n.track);
        return {
          visible: true,
          success: (0, __contentScope.js)(n.panel) || t === `page` && (0, __contentScope.js)(),
          panel: n.panel,
          challengeKey: (0, __contentScope.Ps)(n, r, o, a),
          handleX: s.x,
          pieceX: n.piece ? (0, __contentScope.X)(n.piece).x : void 0,
          handleOffsetX: s.x - c.x,
          handleRange: c.width - s.width,
          statusText: (0, __contentScope.Ks)(n.panel)
        };
      }, t);
    }
    function rc(e, t) {
      let n = e.handleOffsetX, r = t.handleOffsetX;
      if (n == null || r == null) return null;
      let i = t.handleRange ?? e.handleRange;
      return !i || i < 20 ? null : Math.abs(r - n) < i * 0.05 ? `failed` : null;
    }
    function ic(e, t) {
      return (t.match(new RegExp(e.source, `gi`)) ?? []).map((e2) => e2.toLowerCase());
    }
    function ac(e, t, n) {
      let r = new Set((0, __contentScope.ic)(e, t));
      return (0, __contentScope.ic)(e, n).filter((e2) => !r.has(e2));
    }
    function oc(e, t, n) {
      if (t.success || (0, __contentScope.ac)(__contentScope.Js, n, t.statusText).length > 0)
        return `success`;
      if (e.challengeKey && t.challengeKey && e.challengeKey !== t.challengeKey) return `refreshed`;
      for (let e2 of [`too-short`, `too-far`, `failed`])
        if ((0, __contentScope.ac)(__contentScope.nc[e2], n, t.statusText).length > 0) return e2;
      return null;
    }
    async function sc(e, t = 5500, n = `page`) {
      let r = Date.now() + t, i = (0, __contentScope.qs)(e.panel, n), a = e, o, s, c;
      for (; ; ) {
        let t2 = Date.now(), l = (0, __contentScope.oc)(e, i, a.statusText);
        if (l === `success`) return { kind: l, state: i, evidence: `status` };
        if (l === `refreshed`) return { kind: l, state: i, evidence: `refresh` };
        if ((l === `failed` || l === `too-short` || l === `too-far`) && (o = {
          kind: l,
          since: t2,
          phrases: (0, __contentScope.ac)(__contentScope.nc[l], a.statusText, i.statusText)
        }), !i.visible && e.visible) {
          if (s ??= t2, t2 - s >= __contentScope.tc)
            return o ? { kind: o.kind, state: i, evidence: `status` } : { kind: `success`, state: i, evidence: `disappearance` };
        } else {
          if (s = void 0, o) {
            let e2 = (0, __contentScope.ic)(__contentScope.nc[o.kind], i.statusText);
            o.phrases.some((t3) => e2.includes(t3)) || (o = void 0);
          }
          if (o && t2 - o.since >= __contentScope.ec)
            return { kind: o.kind, state: i, evidence: `status` };
        }
        if (i.visible && (0, __contentScope.rc)(e, i) === `failed` ? c ??= t2 : c = void 0, t2 >= r)
          return c != null && t2 - c >= __contentScope.ec ? { kind: `failed`, state: i, evidence: `geometry` } : { kind: `unchanged`, state: i };
        a = i, await (0, __contentScope.w)(Math.min(220, Math.max(0, r - Date.now()))), i = (0, __contentScope.qs)(i.panel ?? e.panel, n);
      }
    }
    function cc(e, t) {
      if (!(e instanceof HTMLElement) || !(0, __contentScope.Y)(e)) return -1 / 0;
      let n = [
        e.id,
        e.className,
        e.getAttribute(`aria-label`),
        e.getAttribute(`title`),
        e.textContent
      ].filter(Boolean).join(` `);
      if (!__contentScope.Qs.test(n) || __contentScope.$s.test(n)) return -1 / 0;
      let r = e.getBoundingClientRect(), i = 0;
      return t !== `page` && e.matches(__contentScope.q.refresh) && (i += 10), e.matches(`button, [role="button"], a`) && (i += 4), /refresh|reload|刷新|换一张/i.test(n) && (i += 6), r.width <= 100 && r.height <= 80 && (i += 2), i;
    }
    async function lc(e = `page`) {
      let t = (0, __contentScope.ks)(e);
      if (!t && e === `page`) return false;
      let n = [
        ...t?.panel.querySelectorAll(`button, [role="button"], a, [class], [id]`) ?? [],
        ...e === `page` ? [] : document.querySelectorAll(__contentScope.q.refresh)
      ].sort((t2, n2) => (0, __contentScope.cc)(n2, e) - (0, __contentScope.cc)(t2, e))[0];
      if (!(n instanceof HTMLElement) || (0, __contentScope.cc)(n, e) < 4) return false;
      try {
        return await (0, __contentScope.M)(n), true;
      } catch {
        return false;
      }
    }
    async function uc(e, t = 3500, n = `page`) {
      let r = Date.now() + t;
      for (; Date.now() < r; ) {
        let t2 = (0, __contentScope.qs)(void 0, n);
        if (!t2.visible || e && t2.challengeKey && t2.challengeKey !== e) return true;
        await (0, __contentScope.w)(180);
      }
      return false;
    }
    function dc(e, t, n) {
      let r = Math.min(3, Math.max(1, n * 8e-3)), i = Math.min(10, Math.max(3, n * 0.04)), a = e;
      return t === `too-short` ? a += r : t === `too-far` ? a -= r : a = 0, Math.max(-i, Math.min(i, Math.round(a * 10) / 10));
    }
    function hc(e) {
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
    function vc(e) {
      if (!e) return `unknown`;
      let [, ...t] = e.split(`:`);
      return (t.join(`:`) || e).split(`+`).map((e2) => __contentScope._c[e2] ?? e2).join(`+`);
    }
    function yc(e) {
      let t = e.diagnostics, n = t ? `，取图=${__contentScope.gc[t.source] ?? t.source}，图像距离=${t.imageDistance}px` + (t.measuredRatio == null ? `，行程比=${t.conversionRatio.toFixed(3)}` : `，实测行程比=${t.measuredRatio.toFixed(3)}`) + (t.probeDistance == null ? `` : `，探测位移=${t.probeDistance}px`) + `，修正=${t.correctionPx}px` + (t.cropOffsetX ? `，亚像素补偿=${t.cropOffsetX}px` : ``) + (t.rivalCount ? `，另有 ${t.rivalCount} 个疑似缺口` : ``) : ``;
      return `方法=${(0, __contentScope.vc)(e.method)}，缺口=${e.gapX ?? `N/A`}px，拖动=${e.distance ?? `N/A`}px，置信度=${e.confidence?.toFixed(3) ?? `N/A`}${n}`;
    }
    async function bc(e, t) {
      let r = (0, __contentScope.x)();
      if (!r)
        return e.push(`滑块求解：没有活跃签到任务，停止自动拖动`), { solved: false, error: `没有活跃签到任务` };
      let i = t.frameSessionId, a = i ? `tencent-frame` : t.domMode ?? `page`, o = Math.min(t.deadline ?? 1 / 0, Date.now() + __contentScope.pc), s = () => (0, __contentScope.x)() === r && (!i || (0, __contentScope.S)() === i), c = 0, l, u = `滑块没有返回可确认的结果`, d = false, f = [], p, m = 0;
      for (let t2 = 1; t2 <= __contentScope.fc; t2 += 1) {
        if (!s() || Date.now() >= o) {
          u = s() ? `滑块求解超过总时限` : `本轮滑块任务已停止`;
          break;
        }
        let h = await (0, __contentScope.Gs)(
          i ? { mode: a, mountTimeoutMs: 6e3, deadline: o, isActive: s } : { mode: a }
        );
        if (!h) {
          let t3 = (0, __contentScope.qs)(void 0, a);
          if (s() && t3.success)
            return e.push(`页面已显示滑块通过状态`), { solved: true, method: `dom-feedback` };
          u = (0, __contentScope.Us)() ?? (t3.visible ? `没有找到同时满足把手、轨道和背景几何关系的滑块控件` : `检测到滑动挑战，但页面没有暴露可安全拖动的 DOM 控件`), e.push(u);
          break;
        }
        let { info: g, match: _, releaseHandleMarker: v } = h;
        if (!s() || i && Date.now() >= o) {
          v(), u = `本轮滑块任务已停止或超过时限`;
          break;
        }
        _.detectionMethod === `panel-geometry` && !d && (e.push(
          `标准滑块控件匹配未命中，已通过当前验证码弹窗内的图片、轨道和把手布局定位，继续截图识别`
        ), d = true);
        let y = (0, __contentScope.qs)(_.panel, a);
        if (i && y.success)
          return v(), e.push(`当前验证码面板已显示通过状态，未重复拖动`), { solved: true, method: `dom-feedback` };
        c !== 0 && l && y.challengeKey && y.challengeKey !== l && (c = 0, l = void 0), f.length && p && y.challengeKey && y.challengeKey !== p && (f = [], p = void 0);
        let b = g.pieceRect ? `${g.pieceRect.width}×${g.pieceRect.height}` : `未直接暴露`;
        e.push(
          `滑块第 ${t2}/${__contentScope.fc} 次：背景 ${g.backgroundRect.width}×${g.backgroundRect.height}，拼图块 ${b}，轨道行程 ${(g.trackRect.width - g.handleRect.width).toFixed(1)}px`
        );
        let x, S;
        try {
          let e2 = await (0, __contentScope.n)({
            type: `SLIDER_CRACK`,
            runId: r,
            ...i ? { frameSessionId: i } : {},
            slider: g,
            options: {
              attempt: t2,
              correctionPx: c,
              ...f.length ? { excludedGapX: [...f] } : {}
            }
          });
          e2.ok ? x = e2.feature?.slider : S = e2.error;
        } finally {
          v();
        }
        if (!s()) {
          u = `本轮滑块任务已停止`;
          break;
        }
        if (S) u = S, e.push(`滑块后台调用失败：${S}`);
        else if (!x) u = `后台没有返回滑块处理结果`, e.push(u);
        else if (x.solved) {
          e.push(`可信拖动已执行，等待页面验收：${(0, __contentScope.yc)(x)}`);
          let t3 = await (0, __contentScope.sc)(
            y,
            i ? Math.max(0, Math.min(5500, o - Date.now())) : 5500,
            a
          );
          if (e.push((0, __contentScope.hc)(t3)), t3.kind === `success`) {
            let e2 = !!i && t3.evidence === `disappearance`;
            return {
              solved: !e2,
              ...e2 ? { dismissed: true } : {},
              method: x.method,
              gapX: x.gapX,
              distance: x.distance
            };
          }
          if (u = (0, __contentScope.hc)(t3), t3.kind === `failed` && t3.evidence === `status` && x.gapX != null && !f.some((e2) => Math.abs(e2 - x.gapX) < 3) && (f.push(x.gapX), p = t3.state.challengeKey ?? y.challengeKey), c = (0, __contentScope.dc)(
            c,
            t3.kind,
            x.diagnostics?.handleRange ?? g.trackRect.width - g.handleRect.width
          ), t3.kind === `too-short` || t3.kind === `too-far`) {
            l = t3.state.challengeKey ?? y.challengeKey, await (0, __contentScope.w)(350);
            continue;
          }
          if (t3.kind === `refreshed`) {
            c = 0, l = void 0, f = [], p = void 0, await (0, __contentScope.w)(350);
            continue;
          }
        } else if (u = x.error ?? `滑块图像识别或拖动失败`, e.push(`滑块本次未执行：${u}${x.method ? `（${(0, __contentScope.yc)(x)}）` : ``}`), x.errorCode === `match-ambiguous` && (m += 1, m >= 2)) {
          u = `这个滑块在同一张图上有多个疑似缺口，自动识别无法确定唯一目标`, e.push(`${u}，已停止自动尝试并交由人工完成`);
          break;
        }
        if (t2 >= __contentScope.fc || !s() || i && Date.now() >= o) break;
        c = 0, l = void 0, f = [], p = void 0, await (0, __contentScope.lc)(a) ? (e.push(`已通过验证控件自身的刷新按钮请求新挑战`), await (0, __contentScope.uc)(y.challengeKey, 3500, a)) : await (0, __contentScope.uc)(y.challengeKey, 1600, a), await (0, __contentScope.w)(300);
      }
      return e.push(`滑块自动求解未通过页面确认：${u}`), { solved: false, error: u };
    }
    function xc(e, t) {
      if (__contentScope.mc) return e.push(`滑块求解已经在执行，复用当前任务`), __contentScope.mc;
      let n = (0, __contentScope.bc)(e, t).finally(() => {
        __contentScope.mc === n && (__contentScope.mc = null);
      });
      return __contentScope.mc = n, n;
    }
    function Sc(e) {
      return (0, __contentScope.xc)(e, {});
    }
    function Cc(e) {
      return e.push(`检测到页面内腾讯滑块，使用腾讯控件定位，保留主页面取图与求解策略`), (0, __contentScope.xc)(e, { domMode: `tencent-page` });
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
      return (e.candidateElements?.() ?? []).filter((e2) => e2 instanceof Element);
    }
    function Fc(e) {
      return [.../* @__PURE__ */ new Set([...(0, __contentScope.Nc)(e.selectors), ...(0, __contentScope.Pc)(e)])];
    }
    function Ic(e) {
      if (!e.isConnected || e.getClientRects().length === 0) return false;
      let t = e;
      for (; t; ) {
        let e2 = window.getComputedStyle(t);
        if (e2.display === `none` || e2.visibility === `hidden` || e2.visibility === `collapse` || e2.opacity === `0` || t.getAttribute(`aria-hidden`) === `true` || t instanceof HTMLElement && t.hidden)
          return false;
        t = t.parentElement;
      }
      let n = e.getBoundingClientRect();
      return n.width > 0 && n.height > 0;
    }
    function Hc(e) {
      if (!e.isConnected) return false;
      let t = e.getBoundingClientRect();
      if (t.width <= 0 || t.height <= 0) return false;
      let n = t.left + t.width / 2, r = t.top + t.height / 2, i = window.innerWidth, a = window.innerHeight;
      return !(i > 0) || !(a > 0) || n >= __contentScope.Lc && r >= __contentScope.Lc && n <= i - __contentScope.Lc && r <= a - __contentScope.Lc;
    }
    function Kc() {
      let e = (0, __contentScope.Nc)(__contentScope.Gc);
      return e.length > __contentScope.Vc ? e.slice(0, __contentScope.Vc) : e;
    }
    function qc(e) {
      let t = e;
      for (; t; ) {
        let e2 = t.getBoundingClientRect();
        if (e2.width > 0 && e2.height > 0) return t;
        t = t.parentElement;
      }
      return null;
    }
    function Jc(e) {
      let t = e.getBoundingClientRect();
      return `${Math.round(t.left)},${Math.round(t.top)},${Math.round(t.width)},${Math.round(t.height)}`;
    }
    function Yc() {
      let e = typeof window.scrollX == `number` ? window.scrollX : 0, t = typeof window.scrollY == `number` ? window.scrollY : 0;
      return `${Math.round(e)},${Math.round(t)}`;
    }
    function Xc(e) {
      try {
        return typeof e.scrollIntoView == `function` && (e.scrollIntoView({ block: `center` }), true);
      } catch {
        return false;
      }
    }
    async function Zc(e = (0, __contentScope.Kc)(), t = {}) {
      let n = [...new Set(e)].filter((e2) => e2.isConnected).filter((e2) => !(0, __contentScope.Hc)(e2));
      if (n.length === 0) return { outcome: `in-viewport`, attempts: 0, offViewport: 0 };
      let r = Math.max(1, Math.floor(t.maxAttempts ?? __contentScope.Rc)), i = Date.now() + Math.max(0, t.budgetMs ?? __contentScope.Bc), a = 0, o = n;
      for (; a < r && Date.now() < i; ) {
        let e2 = [...new Set(o.map(__contentScope.qc).filter((e3) => e3 !== null))];
        if (e2.length === 0) return { outcome: `blocked`, attempts: a, offViewport: n.length };
        let t2 = (0, __contentScope.Yc)(), r2 = e2.map(__contentScope.Jc).join(`|`);
        if (!(0, __contentScope.Xc)(e2[0]))
          return { outcome: `blocked`, attempts: a, offViewport: n.length };
        if (a += 1, await (0, __contentScope.w)(Math.min(__contentScope.zc, Math.max(0, i - Date.now()))), o = o.filter((e3) => !(0, __contentScope.Hc)(e3)), o.length === 0)
          return { outcome: `revealed`, attempts: a, offViewport: n.length };
        if ((0, __contentScope.Yc)() === t2 && e2.map(__contentScope.Jc).join(`|`) === r2)
          return { outcome: `blocked`, attempts: a, offViewport: n.length };
      }
      return { outcome: `blocked`, attempts: a, offViewport: n.length };
    }
    function Qc(e) {
      return (0, __contentScope.Fc)(e).filter(__contentScope.Ic).sort((e2, t) => {
        let n = e2.getBoundingClientRect(), r = t.getBoundingClientRect();
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
        ...e instanceof Element && (() => {
          try {
            return e.matches(t);
          } catch {
            return false;
          }
        })() ? [e] : [],
        ...(0, __contentScope.tl)(e, t)
      ];
    }
    function il(e, t) {
      let n = (0, __contentScope.tl)(t, e.tokenSelectors);
      if (n.length > 0) return n;
      let r = t.closest(`form`);
      if (r) {
        let t2 = (0, __contentScope.tl)(r, e.tokenSelectors);
        if (t2.length > 0) return t2;
      }
      let i = t.parentElement;
      return i ? (0, __contentScope.tl)(i, e.tokenSelectors) : [];
    }
    function al(e) {
      return e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement ? e.value.trim() : (e.getAttribute(`value`) ?? ``).trim();
    }
    function ol(e, t) {
      return (0, __contentScope.rl)(t, e.tokenSelectors).some(
        (e2) => (0, __contentScope.al)(e2).length === 0
      );
    }
    function sl(e) {
      return e.getAttribute(`aria-disabled`) === `true` || (e instanceof HTMLButtonElement || e instanceof HTMLInputElement) && e.disabled;
    }
    function cl(e) {
      return (0, __contentScope.rl)(
        e,
        `button[type="submit"], input[type="submit"], button:not([type])`
      );
    }
    function ll(e, t, n) {
      let r = (0, __contentScope.nl)(t), i = (0, __contentScope.rl)(r, e.tokenSelectors), a = i.some((e2) => (0, __contentScope.al)(e2).length === 0);
      return {
        scope: r,
        hadDisabledSubmit: (0, __contentScope.cl)(r).some(__contentScope.sl),
        responseFields: i,
        hadPendingResponse: a,
        observedResponseValue: n?.observedResponseValue ?? false
      };
    }
    function ul(e, t) {
      e.hadPendingResponse && !e.observedResponseValue && (e.observedResponseValue = [
        ...e.responseFields,
        ...(0, __contentScope.rl)(e.scope, t.tokenSelectors)
      ].some((e2) => (0, __contentScope.al)(e2).length > 0));
    }
    function dl(e, t) {
      let n = (0, __contentScope.Pc)(e).filter(
        (e2) => t === document || t instanceof Element && t.contains(e2)
      );
      return [.../* @__PURE__ */ new Set([...(0, __contentScope.rl)(t, e.selectors), ...n])].filter(__contentScope.Ic).sort((e2, t2) => {
        let n2 = e2.getBoundingClientRect(), r = t2.getBoundingClientRect();
        return n2.width * n2.height - r.width * r.height;
      });
    }
    function fl(e) {
      return Math.max(0, e - Date.now());
    }
    async function pl(e, t) {
      let n = (0, __contentScope.fl)(t);
      return n <= 0 ? false : (await (0, __contentScope.w)(Math.min(e, n)), Date.now() < t);
    }
    async function ml(e, t) {
      let n = (0, __contentScope.Qc)(e);
      if (n.length > 0) return { state: `ready`, widgets: n, appearedAt: t.detectedAt };
      let r = Math.min(
        e.strategy?.mountWaitMs ?? __contentScope.wc,
        (0, __contentScope.fl)(t.deadline)
      );
      if (r <= 0) return { state: `missing` };
      t.log.push(
        `已识别${e.kind}待处理状态，正在等待可见验证控件挂载（最长 ${Math.ceil(r / 1e3)}s）`
      );
      let i = Math.min(t.deadline, Date.now() + r);
      for (; Date.now() < i; ) {
        if (t.isComplete())
          return t.log.push(`${e.kind}在控件挂载等待期间已出现完成信号`), { state: `completed` };
        let n2 = (0, __contentScope.Qc)(e);
        if (n2.length > 0)
          return t.log.push(`${e.kind}可见控件已挂载，进入统一点击流程`), { state: `ready`, widgets: n2, appearedAt: Date.now() };
        await (0, __contentScope.pl)(__contentScope.kc, i);
      }
      return t.log.push(`${e.kind}在等待窗口内仍未挂载可见控件`), { state: `missing` };
    }
    function hl(e) {
      let t = [
        ...e.querySelectorAll(
          `input[type="checkbox"], [role="checkbox"], button:not([disabled]), [role="button"]`
        )
      ].filter(__contentScope.Ic);
      return t.length > 0 ? t[0] : e instanceof HTMLElement ? e : null;
    }
    async function gl(e, t, n, r) {
      let i = Math.min(n.deadline, Date.now() + r), a = null, o = 0, s = (0, __contentScope.il)(t, e).length > 0;
      for (; Date.now() < i; ) {
        if (n.isComplete(e))
          return n.log.push(`${t.kind}在布局等待期间已出现完成信号`), `completed`;
        if (!e.isConnected || !(0, __contentScope.Ic)(e))
          return n.log.push(`${t.kind}控件在布局等待期间已重绘，准备重新定位`), `replaced`;
        !s && (0, __contentScope.il)(t, e).length > 0 && (s = true);
        let r2 = e.getBoundingClientRect(), c = { width: Math.round(r2.width), height: Math.round(r2.height) }, l = c.width > 50 && c.height > 20;
        if (l && a && c.width === a.width && c.height === a.height ? o += 1 : o = 0, a = c, l && o >= 4 && (s || !t.tokenSelectors.trim()))
          return n.log.push(`验证控件布局已稳定（${c.width}×${c.height}${s ? `，响应字段已挂载` : ``}）`), `stable`;
        await (0, __contentScope.pl)(__contentScope.Ac, i);
      }
      return n.log.push(
        `等待${t.kind}布局稳定超时（响应字段${s ? `已` : `未`}挂载，尺寸${o >= 4 ? `已` : `未`}稳定），继续执行点击前保护`
      ), `timed-out`;
    }
    async function _l(e, t, n, r) {
      let i = e, a = t.strategy?.minVisibleMs ?? 0;
      for (; Date.now() < r.deadline; ) {
        let e2 = n.get(i) ?? Date.now();
        n.set(i, e2);
        let o = Math.min(r.deadline, e2 + a), s = o - Date.now();
        for (s > 0 && r.log.push(
          `${t.kind}首次点击保护：再等待 ${Math.ceil(s / 1e3)}s，执行通用 ${a / 1e3}s 最低成熟策略`
        ); Date.now() < o; ) {
          if (r.isComplete(i))
            return r.log.push(`${t.kind}在首次点击保护期间已自行完成，无需点击`), { state: `completed` };
          let e3 = (0, __contentScope.el)(t, i);
          if (e3 && e3 !== i) {
            i = e3, n.has(i) || n.set(i, Date.now()), r.log.push(`${t.kind}宿主已重绘，已重新定位并重新计算成熟窗口`);
            break;
          }
          if (!await (0, __contentScope.pl)(__contentScope.kc, o)) break;
        }
        if (r.isComplete(i))
          return r.log.push(`${t.kind}在首次点击前已出现完成信号，无需点击`), { state: `completed` };
        let c = (0, __contentScope.el)(t, i);
        if (!c) return { state: `missing` };
        if (c !== i)
          i = c, n.has(i) || n.set(i, Date.now()), r.log.push(`${t.kind}宿主已重绘，已重新定位并重新计算成熟窗口`);
        else if (!(Date.now() < e2 + a))
          return a > 0 && r.log.push(
            `${t.kind}宿主已出现 ${Math.max(0, Math.round((Date.now() - e2) / 100) / 10)}s，进入内部就绪检查`
          ), { state: `ready`, widget: i };
      }
      return { state: `timed-out` };
    }
    async function vl(e, t, n, r, i) {
      let a = e, o = i;
      for (; Date.now() < r.deadline; ) {
        n.has(a) || n.set(a, Date.now());
        let e2 = await (0, __contentScope.gl)(a, t, r, o);
        if (e2 === `completed` || r.isComplete(a)) return { state: `completed` };
        let i2 = (0, __contentScope.el)(t, a);
        if (!i2) return { state: `missing` };
        if (i2 !== a || e2 === `replaced`) {
          a = i2, n.has(a) || n.set(a, Date.now()), o = Math.min(3e3, (0, __contentScope.fl)(r.deadline)), r.log.push(`${t.kind}控件已重绘，统一点击模块已重新定位`);
          continue;
        }
        let s = await (0, __contentScope._l)(a, t, n, r);
        return s.state === `ready` ? { state: `ready`, widget: s.widget } : s;
      }
      return { state: `timed-out` };
    }
    function yl(e) {
      return e.tagName.toLowerCase() + (e.id ? `#${e.id}` : ``) + (e.className ? `.${String(e.className).split(/\s+/)[0]}` : ``);
    }
    async function bl(e, t, n, r, i) {
      let a = (0, __contentScope.hl)(t);
      if (!a) throw Error(`未找到可点击目标`);
      let o = (0, __contentScope.yl)(a);
      r.log.push(`第 ${i} 次点击前已定位${e.kind}控件 ${o}`);
      let s = a === t, c = s ? e.strategy?.insetLeftPx : void 0, l = s && (e.strategy?.minVisibleMs ?? 0) > 0 ? n.get(t) : void 0, u = s ? e.strategy?.safetyWindowMs : void 0;
      if (l != null && u != null && Math.max(Date.now(), l + u) + __contentScope.Mc >= r.deadline)
        throw Error(`${e.kind}剩余执行时间不足，已取消本轮可信点击`);
      let d, f, p, m = await (0, __contentScope.M)(a, {
        shadowTarget: e.strategy?.shadowTarget ?? false,
        insetLeftPx: c,
        deadline: r.deadline,
        debugVisualize: !!(e.strategy?.debugVisualize && s),
        targetSeenAt: l,
        onPointerResult: (e2) => {
          d = e2.target, f = e2.screenOffset?.matches, p = e2.turnstileReadiness;
        }
      });
      if (s && c != null) {
        let t2 = d?.rect ?? a.getBoundingClientRect(), n2 = d?.x ?? t2.left + Math.min(c, t2.width / 2), o2 = d?.y ?? t2.top + t2.height / 2, s2 = p?.signal === `inner-frame` ? `内部验证帧已稳定` : p?.signal === `interactive-control` ? `内部复选框已稳定` : `内部状态不可观测，已走满安全窗口`, l2 = d ? d.hit || d.withinHost ? `${e.kind}目标范围（${s2}）` : `未命中${e.kind}目标` : `${m === `trusted` ? `可信` : `DOM`}点击前目标检查通过`, u2 = f === false ? `；浏览器屏幕坐标偏移异常` : ``, h = p ? `；成熟检查=${s2}，控件已出现 ${(p.widgetAgeMs / 1e3).toFixed(1)}s，本次额外等待 ${(p.waitedMs / 1e3).toFixed(1)}s` : ``;
        r.log.push(
          `第 ${i} 次${m === `trusted` ? `可信` : `DOM`}点击已发出：坐标 (${Math.round(n2)}, ${Math.round(o2)})，目标区域 left=${Math.round(t2.left)} top=${Math.round(t2.top)} ${Math.round(t2.width)}×${Math.round(t2.height)}，命中=${l2}${h}${u2}；等待验证响应`
        );
      } else
        r.log.push(`第 ${i} 次${m === `trusted` ? `可信` : `DOM`}点击已发送到验证控件，等待验证响应`);
    }
    async function xl(e, t, n, r) {
      let i = Math.min(
        e.strategy?.responseWaitMs ?? __contentScope.Oc,
        (0, __contentScope.fl)(r.deadline)
      ), a = Date.now(), o = Math.min(r.deadline, a + i), s = a - 4e3, c = t, l = (0, __contentScope.ll)(e, t), u = null;
      for (; Date.now() < o; ) {
        if (await (0, __contentScope.pl)(400, o), (0, __contentScope.ul)(l, e), r.isComplete(c))
          return r.log.push(`${e.kind}验证已自动完成（检测到当前控件的 token 或已验证状态）`), true;
        let t2 = (0, __contentScope.dl)(e, l.scope), i2 = t2.includes(c) ? c : t2[0] ?? null;
        if (!i2 && l.scope instanceof Element && !l.scope.isConnected && (i2 = (0, __contentScope.$c)(e)), i2)
          i2 !== c && (c = i2, l = (0, __contentScope.ll)(e, i2, l), r.log.push(`${e.kind}控件在点击后已重挂载，继续按新控件校验完成状态`)), n.has(i2) || n.set(i2, Date.now()), u = null;
        else if (u ??= Date.now(), Date.now() - u >= __contentScope.jc) {
          (0, __contentScope.ul)(l, e);
          let t3 = l.hadPendingResponse && l.observedResponseValue && !(0, __contentScope.ol)(e, l.scope), n2 = l.hadDisabledSubmit && (0, __contentScope.cl)(l.scope).some((e2) => !(0, __contentScope.sl)(e2));
          if (t3 || n2)
            return r.log.push(
              `${e.kind}控件消失后未重新挂载，${n2 ? `所属表单提交控件已解锁` : `所属作用域已无待处理响应字段`}，视为验证完成`
            ), true;
        }
        Date.now() - s >= 4e3 && (s = Date.now(), r.log.push(`等待${e.kind}验证完成中... (${Math.round((Date.now() - a) / 1e3)}s)`));
      }
      return r.isComplete(c);
    }
    async function Sl(e, t) {
      let n = (0, __contentScope.Qc)(e);
      if (n.length > 0 ? n.every((e2) => t.isComplete(e2)) : t.isComplete()) return true;
      (await (0, __contentScope.Zc)((0, __contentScope.Kc)(), {
        budgetMs: Math.min(__contentScope.Bc, (0, __contentScope.fl)(t.deadline))
      })).outcome === `revealed` && t.log.push(`${e.kind}控件原本位于视口外，已滚动页面将其带入视口后重新判定`);
      let r = await (0, __contentScope.ml)(e, t);
      if (r.state === `completed`) return true;
      if (r.state === `missing`) return false;
      let i = /* @__PURE__ */ new WeakMap();
      for (let e2 of r.widgets) i.set(e2, r.appearedAt);
      let a = [...r.widgets], o = new Set(a);
      for (let n2 = 0; n2 < a.length; n2++) {
        let r2 = a[n2];
        if (t.isComplete(r2)) continue;
        let s = e.strategy?.maxAttempts ?? __contentScope.Ec;
        for (let o2 = 1; o2 <= s && Date.now() < t.deadline; o2++)
          try {
            if (o2 > 1 && (await (0, __contentScope.pl)(
              e.strategy?.retryDelayMs ?? __contentScope.Dc,
              t.deadline
            ), t.isComplete(r2))) {
              t.log.push(`${e.kind}已完成（重试前检测到完成信号），无需再次点击`);
              break;
            }
            let n3 = (0, __contentScope.el)(e, r2);
            if (n3) n3 !== r2 && (r2 = n3, i.has(r2) || i.set(r2, Date.now()));
            else {
              let n4 = await (0, __contentScope.ml)(e, {
                ...t,
                detectedAt: Date.now(),
                deadline: Math.min(t.deadline, Date.now() + 3e3)
              });
              if (n4.state === `completed`) return true;
              if (n4.state !== `ready`) break;
              r2 = n4.widgets[0], i.set(r2, n4.appearedAt);
            }
            let a2 = await (0, __contentScope.vl)(
              r2,
              e,
              i,
              t,
              Math.min(
                o2 === 1 ? e.strategy?.layoutWaitMs ?? __contentScope.Tc : 3e3,
                (0, __contentScope.fl)(t.deadline)
              )
            );
            if (a2.state === `completed` || a2.state !== `ready` || (r2 = a2.widget, o2 > 1 && t.log.push(`${e.kind}尚未完成，尝试再次点击`), await (0, __contentScope.bl)(e, r2, i, t, o2), await (0, __contentScope.xl)(e, r2, i, t)))
              break;
            let c = (0, __contentScope.el)(e, r2);
            c && (e.strategy?.shadowTarget || (e.strategy?.minVisibleMs ?? 0) > 0) && (r2 = c, i.set(r2, Date.now()), t.log.push(`${e.kind}未返回完成信号，下一次重试将按新一代控件重新计算成熟窗口`)), o2 < s ? t.log.push(`${e.kind}第 ${o2} 次点击后未出现完成信号，稍后尝试第 ${o2 + 1} 次点击`) : t.log.push(`已重试 ${o2} 次仍未完成${e.kind}验证，需要人工介入`);
          } catch (c) {
            t.log.push(`点击${e.kind}控件失败：${c instanceof Error ? c.message : String(c)}`);
            let l = (0, __contentScope.el)(e, r2);
            l && (e.strategy?.shadowTarget || (e.strategy?.minVisibleMs ?? 0) > 0) && (r2 = l, i.set(r2, Date.now())), o2 < s ? await (0, __contentScope.pl)(800, t.deadline) : n2 < a.length - 1 && t.log.push(`当前控件无法点击，尝试下一个候选控件`);
          }
        for (let t2 of (0, __contentScope.Qc)(e))
          o.has(t2) || (o.add(t2), a.push(t2), i.set(t2, Date.now()));
        n2 < a.length - 1 && t.log.push(`${e.kind}当前候选未完成验证，尝试下一个候选控件`);
      }
      return !(0, __contentScope.Qc)(e).some((e2) => !t.isComplete(e2)) || (t.log.push(`${e.kind}所有候选控件均未能自动完成验证，需要人工介入`), false);
    }
    function Al(e) {
      let t = ``;
      for (let n of e) {
        let e2 = n.charCodeAt(0);
        if (e2 >= 65296 && e2 <= 65305) t += String(e2 - 65296);
        else
          switch (n) {
            case ` `:
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
      let r = Number(n[1]), i = n[2], a = Number(n[3]);
      if (!Number.isFinite(r) || !Number.isFinite(a) || i === `/` && a === 0) return null;
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
      return Number.isFinite(o) ? {
        expression: `${n[1]} ${i} ${n[3]}`,
        left: r,
        operator: i,
        right: a,
        result: o,
        answer: (0, __contentScope.jl)(o)
      } : null;
    }
    function Nl(e) {
      let t = (0, __contentScope.Al)(e).trim(), n = (0, __contentScope.Ml)(t);
      if (n) return n;
      if (__contentScope.Dl.test(t)) return null;
      let r = t.match(__contentScope.El)?.[1];
      return r ? (0, __contentScope.Ml)(r) : null;
    }
    function Pl(e) {
      if (!(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) || e.disabled || e.readOnly || e.hidden || e.closest(`[hidden], [aria-hidden="true"]`))
        return false;
      let t = e;
      for (; t; ) {
        let e2 = window.getComputedStyle(t);
        if (e2.display === `none` || e2.visibility === `hidden` || e2.visibility === `collapse`)
          return false;
        t = t.parentElement;
      }
      return !(e instanceof HTMLInputElement && __contentScope.Ol.has(e.type.toLowerCase()));
    }
    function Fl(e) {
      let t = [];
      for (let n2 of Array.from(e.labels ?? [])) n2.textContent && t.push(n2.textContent);
      let n = e.getAttribute(`aria-labelledby`)?.trim().split(/\s+/) ?? [];
      for (let r2 of n) {
        let n2 = e.ownerDocument.getElementById(r2);
        n2?.textContent && t.push(n2.textContent);
      }
      let r = e.getAttribute(`aria-describedby`)?.trim().split(/\s+/) ?? [];
      for (let n2 of r) {
        let r2 = e.ownerDocument.getElementById(n2);
        r2?.textContent && t.push(r2.textContent);
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
        ...(0, __contentScope.Fl)(e)
      ].filter(Boolean).join(` `);
    }
    function Ll(e) {
      let t = [
        e.getAttribute(`placeholder`) ?? ``,
        e.getAttribute(`aria-label`) ?? ``,
        e.getAttribute(`title`) ?? ``,
        ...(0, __contentScope.Fl)(e)
      ], n = e.parentElement;
      for (let e2 = 0; n && e2 < 4 && (t.push(n.textContent ?? ``), !(n instanceof HTMLFormElement)); e2 += 1)
        n = n.parentElement;
      let r = e.closest(`form`);
      return r && n !== r && t.push(r.textContent ?? ``), [...new Set(t.map((e2) => e2.trim()).filter(Boolean))];
    }
    function Rl(e = document) {
      let t = [...e.querySelectorAll(`input, textarea`)].filter(__contentScope.Pl).map((e2) => {
        let t2 = (0, __contentScope.Ll)(e2), n = null, r = -1;
        for (let e3 = 0; e3 < t2.length; e3 += 1)
          if (n = (0, __contentScope.Nl)(t2[e3]), n) {
            r = e3;
            break;
          }
        return !n || !__contentScope.Cl.test((0, __contentScope.Il)(e2)) ? null : { input: e2, parsed: n, score: 1e3 + Math.max(0, 100 - r) };
      }).filter((e2) => e2 !== null).sort((e2, t2) => t2.score - e2.score)[0];
      return t ? { ...t.parsed, input: t.input } : null;
    }
    function zl(e = document) {
      let t = (0, __contentScope.Rl)(e);
      return t ? (__contentScope.kl.set(t.input, t.answer), (0, __contentScope.A)(t.input, t.answer), t) : null;
    }
    function Bl(e) {
      if (!(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement)) return false;
      let t = __contentScope.kl.get(e);
      return t !== void 0 && e.value.trim() === t;
    }
    async function Hl(e, t, r) {
      let i = Math.min(r ?? 1 / 0, Date.now() + __contentScope.To), a = `腾讯验证码内嵌页面未就绪`;
      e.push(`检测到腾讯验证码 iframe，正在连接本轮验证码助手`);
      for (let r2 = 0; r2 < 3 && Date.now() < i; r2 += 1) {
        if ((0, __contentScope.x)() !== t) return { solved: false, error: `签到任务已停止` };
        let r3 = (0, __contentScope.Oo)();
        if (!r3) {
          if (await (0, __contentScope.w)(Math.min(1200, Math.max(0, i - Date.now()))), (0, __contentScope.x)() !== t)
            return { solved: false, error: `签到任务已停止` };
          if (r3 = (0, __contentScope.Oo)(), !r3) return { solved: false, dismissed: true };
        }
        let o = `sf-${crypto.randomUUID()}`, s = `p-frame-${crypto.randomUUID()}`, c = r3.getAttribute(`data-aah-pointer-target`);
        r3.setAttribute(`data-aah-pointer-target`, s);
        let l = false, u = ``, d = 0, f, p = false;
        try {
          let c2 = Math.min(i, Date.now() + 8e3);
          for (; Date.now() < c2 && (0, __contentScope.x)() === t; ) {
            if (u = r3.src, (0, __contentScope.Co)(u)) {
              let e2 = await (0, __contentScope.n)({
                type: `SLIDER_FRAME_PREPARE`,
                runId: t,
                sessionId: o,
                frameToken: s,
                frameUrl: u
              });
              if (e2.ok) {
                l = true;
                break;
              }
              a = e2.error;
            }
            if (!r3.isConnected) {
              p = true;
              break;
            }
            await (0, __contentScope.w)(350);
          }
          if (!l) {
            if (p) continue;
            return e.push(`滑块尚未开始拖动：${a}`), { solved: false, error: a };
          }
          let m = Date.now(), h = false;
          for (; Date.now() < i && (0, __contentScope.x)() === t; ) {
            let i2 = (0, __contentScope.Oo)();
            if (i2 && (i2 !== r3 || r3.src !== u)) {
              p = true;
              break;
            }
            !(0, __contentScope.Do)(r3) && !i2 ? f ??= Date.now() : f = void 0;
            let s2 = await (0, __contentScope.n)({
              type: `SLIDER_FRAME_STATUS`,
              runId: t,
              sessionId: o
            });
            if (s2.ok && s2.feature?.sliderFrame) {
              let t2 = s2.feature.sliderFrame;
              if (t2.state !== `connecting` && !h && (e.push(`已进入腾讯验证码内嵌页面，等待图片和真实滑块把手就绪`), h = true), t2.steps.length > d) {
                for (let n of t2.steps.slice(d)) e.push(n);
                d = t2.steps.length;
              }
              if (t2.result && (t2.result.solved || t2.result.dismissed || f == null)) return t2.result;
              if (t2.state === `connecting` && (r3.contentWindow?.postMessage(
                { type: __contentScope.wo, sessionId: o },
                new URL(u).origin
              ), Date.now() - m > 7e3)) {
                a = `验证码助手未能连接当前 iframe，请重新加载扩展后新开任务页`;
                break;
              }
            } else if (f == null) {
              a = s2.ok ? `后台没有返回验证码会话状态` : s2.error;
              break;
            }
            if (f != null && Date.now() - f >= 1200) return { solved: false, dismissed: true };
            await (0, __contentScope.w)(400);
          }
          if (!p)
            return Date.now() >= i ? a = `腾讯验证码求解达到本轮时限` : (0, __contentScope.x)() !== t && (a = `签到任务已停止`), e.push(`腾讯验证码未完成：${a}`), { solved: false, error: a };
          e.push(`验证码 iframe 已重建，正在重新连接新挑战`);
        } finally {
          (0, __contentScope.n)({
            type: `SLIDER_FRAME_CANCEL`,
            runId: t,
            sessionId: o
          }), r3.getAttribute(`data-aah-pointer-target`) === s && (c == null ? r3.removeAttribute(`data-aah-pointer-target`) : r3.setAttribute(`data-aah-pointer-target`, c));
        }
      }
      return { solved: false, error: a };
    }
    function Ul(e, t, n) {
      if (__contentScope.Vl?.runId === t) return __contentScope.Vl.promise;
      let r = (0, __contentScope.Hl)(e, t, n).finally(() => {
        __contentScope.Vl?.promise === r && (__contentScope.Vl = void 0);
      });
      return __contentScope.Vl = { runId: t, promise: r }, r;
    }
    function Ql(e) {
      try {
        return e.matches(__contentScope.Zl) || !!e.closest(__contentScope.Zl);
      } catch {
        return false;
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
      return __contentScope.Kl.test(location.hostname) ? (0, __contentScope.Z)(`script`).some((e) => (0, __contentScope.uu)(e.textContent ?? ``)) ? true : (0, __contentScope.uu)(document.documentElement?.innerHTML ?? ``) : false;
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
        return false;
      }
    }
    function hu(e) {
      return e.some(
        (e2) => (0, __contentScope.mu)(e2, __contentScope.eu) || (0, __contentScope.mu)(e2, __contentScope.tu) && (0, __contentScope.Ou)(e2, __contentScope.nu).some(__contentScope.fu)
      );
    }
    function gu() {
      return (0, __contentScope.pu)(__contentScope.q.widgets);
    }
    function _u(e) {
      let t = document.title.trim().toLowerCase();
      return e.some((e2) => t.includes(e2));
    }
    function vu() {
      return (0, __contentScope._u)(__contentScope.iu);
    }
    function yu() {
      return (0, __contentScope.pu)(__contentScope.Wl) ? true : (0, __contentScope._u)(__contentScope.ru) && (0, __contentScope.Z)(__contentScope.Gl).length > 0;
    }
    function bu(e) {
      return e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement ? e.value.trim() : (e.getAttribute(`value`) ?? ``).trim();
    }
    function xu() {
      if ((0, __contentScope.pu)(__contentScope.Jl)) return [];
      let e = (0, __contentScope.Z)(
        `input[id^="cf-chl-widget-"][name="cf-turnstile-response"], textarea[id^="cf-chl-widget-"][name="cf-turnstile-response"]`
      ).flatMap((e2) => {
        if ((0, __contentScope.bu)(e2).length > 0) return [];
        let t = e2.parentElement;
        return !t || t === document.body || t === document.documentElement || t instanceof HTMLFormElement ? [] : (0, __contentScope.fu)(t) ? [t] : [];
      });
      return [...new Set(e)];
    }
    function Su(e) {
      return [
        .../* @__PURE__ */ new Set([...(0, __contentScope.Z)(e.selectors), ...e.candidateElements?.() ?? []])
      ];
    }
    function Cu(e, t) {
      if (!t) return (0, __contentScope.Z)(e.tokenSelectors);
      let n = (0, __contentScope.Ou)(t, e.tokenSelectors);
      if (n.length > 0) return n;
      let r = t.closest(`form`);
      if (r) {
        let t2 = (0, __contentScope.Ou)(r, e.tokenSelectors);
        if (t2.length > 0) return t2;
      }
      let i = t.parentElement;
      return i ? (0, __contentScope.Ou)(i, e.tokenSelectors) : [];
    }
    function wu(e, t) {
      let n = (0, __contentScope.Cu)(e, t);
      return n.length > 0 && n.every((e2) => (0, __contentScope.bu)(e2).length > 0);
    }
    function Tu(e) {
      let t = (0, __contentScope.Z)(e.tokenSelectors).filter(
        (e2) => (0, __contentScope.bu)(e2).length === 0
      );
      if (t.length === 0) return false;
      let n = e.kind === `Turnstile` && t.some(
        (e2) => /^cf-chl-widget-.+_response$/i.test(e2.id) && e2.getAttribute(`name`) === `cf-turnstile-response` && !!e2.parentElement && (0, __contentScope.fu)(e2.parentElement)
      ), r = e.kind === `Turnstile` && (0, __contentScope.Z)(__contentScope.Gl).length > 0;
      return n || r || t.some(
        (e2) => (0, __contentScope.Ou)(
          e2.closest(`form`) ?? document,
          `button[type="submit"], input[type="submit"]`
        ).some(
          (e3) => (e3 instanceof HTMLButtonElement || e3 instanceof HTMLInputElement) && e3.disabled
        )
      );
    }
    function Eu(e) {
      if (e.getAttribute(`aria-checked`) === `true` || e instanceof HTMLInputElement && e.type === `checkbox` && e.checked)
        return true;
      for (let t of [`data-state`, `data-status`]) {
        let n = e.getAttribute(t)?.trim().toLowerCase();
        if (n && __contentScope.ou.has(n)) return true;
      }
      for (let t of [`data-response`, `data-hcaptcha-response`])
        if ((e.getAttribute(t) ?? ``).trim()) return true;
      return false;
    }
    function Du(e, t) {
      let n = t ? [t] : (0, __contentScope.Z)(e.selectors);
      for (let e2 of n)
        if ((0, __contentScope.Eu)(e2) || (0, __contentScope.Ou)(
          e2,
          `[aria-checked], [data-state], [data-status], [data-response], [data-hcaptcha-response]`
        ).some(__contentScope.Eu))
          return true;
      return e.kind === `reCAPTCHA` && (0, __contentScope.Ou)(t?.closest(`form`) ?? t ?? document, `.recaptcha-checkbox-checked`).length > 0;
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
        let e2 = (0, __contentScope.Rl)();
        return !e2 || e2.input.value.trim() === e2.answer;
      }
      if (e === `CAPTCHA`)
        return (0, __contentScope.Z)(
          `[class*="captcha" i][data-state="verified" i], [class*="captcha" i][data-status="success" i], [id*="captcha" i][data-state="verified" i], [id*="captcha" i][data-status="success" i]`
        ).some(__contentScope.Eu);
      if (e === `Slider`) {
        if ((0, __contentScope.Oo)()) return false;
        if ((0, __contentScope.gu)()) return (0, __contentScope.qs)(void 0, `tencent-page`).success;
        if ((0, __contentScope.du)()) return false;
        if ((0, __contentScope.js)() || (0, __contentScope.Z)(__contentScope.Ao).length > 0)
          return true;
        let e2 = (0, __contentScope.Z)(__contentScope.ko);
        return e2.length > 0 && e2.every(__contentScope.Eu) ? true : !(0, __contentScope.As)();
      }
      let n = __contentScope.Xl.find((t2) => t2.kind === e);
      return n ? (0, __contentScope.wu)(n, t) || (0, __contentScope.Du)(n, t) : false;
    }
    function Au(e) {
      return (0, __contentScope.Bl)(e) ? true : __contentScope.Xl.some((t) => {
        try {
          return e.matches(t.selectors) || !!e.closest(t.selectors);
        } catch {
          return false;
        }
      });
    }
    function ju(e = true) {
      if ((0, __contentScope.du)() || (0, __contentScope.Oo)() || (0, __contentScope.gu)() && !(0, __contentScope.ku)(`Slider`) || (0, __contentScope.As)() && !(0, __contentScope.ku)(`Slider`))
        return `Slider`;
      let t = false;
      for (let n2 of __contentScope.Xl) {
        let r = (0, __contentScope.Su)(n2), i = e && (0, __contentScope.Tu)(n2);
        if ((r.length !== 0 || i) && (t = true, r.some((e2) => (0, __contentScope.fu)(e2) && !(0, __contentScope.ku)(n2.kind, e2)) || i))
          return n2.kind;
      }
      if ((0, __contentScope.Rl)()) return `Arithmetic`;
      let n = (0, __contentScope.Z)(__contentScope.$l).filter((e2) => !(0, __contentScope.Au)(e2));
      return (0, __contentScope.hu)(n.filter(__contentScope.fu)) && !(0, __contentScope.ku)(`CAPTCHA`) ? `CAPTCHA` : t || n.length > 0 || !(0, __contentScope.vu)() || (0, __contentScope.yu)() ? null : (0, __contentScope.Z)(__contentScope.Gl).length > 0 || (0, __contentScope.Mu)() ? `CAPTCHA` : null;
    }
    function Mu() {
      if ((0, __contentScope.pu)(
        `#challenge-stage input[type="checkbox"], #challenge-stage [role="checkbox"], #challenge-stage button, iframe[title*="checkbox" i]`
      ))
        return true;
      let e = (document.body?.innerText ?? ``).slice(0, 2e4);
      return __contentScope.au.some((t) => t.test(e));
    }
    function Nu(e = true) {
      let t = (0, __contentScope.yu)(), n = (0, __contentScope.ju)(e);
      if (t) {
        let e2 = n ? __contentScope.Xl.some(
          (e3) => e3.kind === n && (0, __contentScope.Su)(e3).some(__contentScope.fu)
        ) : false;
        return n && (n !== `Turnstile` || e2 || (0, __contentScope.Mu)()) ? { category: `interactive`, kind: n } : {
          category: `managed`,
          kind: `Cloudflare`,
          embeddedInteractive: n ?? void 0
        };
      }
      return n ? { category: `interactive`, kind: n } : null;
    }
    function Pu(e = false) {
      return (0, __contentScope.Nu)(e) !== null;
    }
    function Fu(e) {
      let t = (0, __contentScope.zl)();
      return t ? (e.push(`已识别动态算式 ${t.expression}，并填写计算结果 ${t.answer}`), true) : false;
    }
    async function Iu(e, t, n, r) {
      if (e === `Arithmetic`) return (0, __contentScope.Fu)(t);
      if (e === `CAPTCHA`) return t.push(`通用 CAPTCHA 类型无法自动化，需要人工识别`), false;
      let i = __contentScope.Yl.find((t2) => t2.kind === e);
      return i ? (0, __contentScope.Sl)(i, {
        log: t,
        detectedAt: n,
        deadline: r,
        isComplete: (t2) => {
          if (t2) return (0, __contentScope.ku)(e, t2);
          let n2 = (0, __contentScope.Cu)(i);
          return n2.length > 0 && n2.every((e2) => (0, __contentScope.bu)(e2).length > 0);
        }
      }) : false;
    }
    async function Lu(e, t, n = 12e4) {
      return !(0, __contentScope.yu)() || (await (0, __contentScope.w)(600), !(0, __contentScope.yu)()) ? { detected: false, resolved: true } : (0, __contentScope.zu)(e, t, n);
    }
    async function Ru(e) {
      let t = false, n = {
        push(n2) {
          (n2.startsWith(`滑块第 `) || n2.startsWith(`滑块求解已经在执行`)) && (t = true), e.push(n2);
        }
      }, r = (0, __contentScope.x)();
      if (r && (0, __contentScope.Oo)())
        return { ...await (0, __contentScope.Ul)(n, r), attemptStarted: t };
      let i = (0, __contentScope.gu)(), a = await (i ? (0, __contentScope.Cc)(n) : (0, __contentScope.Sc)(n));
      return r && (0, __contentScope.x)() === r && (0, __contentScope.Oo)() ? { ...await (0, __contentScope.Ul)(n, r), attemptStarted: t } : !i && !t && !a.solved && !a.dismissed && r && (0, __contentScope.x)() === r && (0, __contentScope.gu)() ? { ...await (0, __contentScope.Cc)(n), attemptStarted: t } : { ...a, attemptStarted: t };
    }
    async function zu(e, t, n = 12e4, r = {}) {
      let i = r.includePendingResponse ?? true, a = (0, __contentScope.Nu)(i), o = Math.max(0, r.appearanceWaitMs ?? 0);
      if (!a && o > 0) {
        let e2 = Date.now() + o;
        for (; !a && Date.now() < e2; ) {
          if (!(0, __contentScope.zp)() && typeof r.stopWhenReady === `function`) {
            try {
              if (r.stopWhenReady() === true) return { detected: false, resolved: true };
            } catch {
            }
          }
          await (0, __contentScope.w)(Math.min(__contentScope.lu, e2 - Date.now()));
          a = (0, __contentScope.Nu)(i);
        }
      }
      if (!a) return { detected: false, resolved: true };
      if (a.kind === `Slider` || a.embeddedInteractive === `Slider`) {
        let t2 = await (0, __contentScope.Ru)(e);
        return t2.dismissed ? (e.push(`验证码窗口已关闭，继续核对本次操作结果`), { detected: true, resolved: true, kind: `Slider` }) : t2.solved ? (e.push(`滑块验证已自动破解（${t2.method}，距离=${t2.distance}px）`), { detected: true, resolved: true, kind: `Slider` }) : {
          detected: true,
          resolved: false,
          kind: `Slider`,
          error: t2.error,
          sliderAttemptStarted: t2.attemptStarted
        };
      }
      if (a.kind === `Arithmetic` || a.embeddedInteractive === `Arithmetic`)
        return {
          detected: true,
          resolved: (0, __contentScope.Fu)(e),
          kind: `Arithmetic`
        };
      let s = Date.now(), c = s + n, l = (0, __contentScope.vu)(), u = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Map(), p = a.kind, m = async (n2) => {
        u.has(n2) || d.has(n2) || (p = n2, f.has(n2) || f.set(n2, Date.now()), !(n2 === `CAPTCHA` && Date.now() - f.get(n2) < __contentScope.cu) && (await (0, __contentScope.Iu)(n2, e, f.get(n2), c) ? u.add(n2) : (d.add(n2), e.push(`${n2}验证控件无法自动完成，等待你在当前标签页手动完成`), await t(`${n2}需要你在当前标签页完成验证；自动点击未能成功验证`))));
      };
      for (a.category === `interactive` ? await m(a.kind) : e.push(`检测到Cloudflare托管式安全检查，等待页面自然完成并跳转`); Date.now() - s < n; ) {
        await (0, __contentScope.w)(__contentScope.lu);
        let t2 = [...u, ...d].find((e2) => (0, __contentScope.ku)(e2)), n2 = (0, __contentScope.Nu)(i);
        if (n2?.kind === `Arithmetic` || n2?.embeddedInteractive === `Arithmetic`)
          return {
            detected: true,
            resolved: (0, __contentScope.Fu)(e),
            kind: `Arithmetic`
          };
        if (n2?.kind === `Slider` || n2?.embeddedInteractive === `Slider`) {
          let t3 = await (0, __contentScope.Ru)(e);
          return t3.dismissed ? (e.push(`验证码窗口已关闭，继续核对本次操作结果`), { detected: true, resolved: true, kind: `Slider` }) : t3.solved ? (e.push(`滑块验证已自动破解（${t3.method}，距离=${t3.distance}px）`), { detected: true, resolved: true, kind: `Slider` }) : {
            detected: true,
            resolved: false,
            kind: `Slider`,
            error: t3.error,
            sliderAttemptStarted: t3.attemptStarted
          };
        }
        if (l && !(0, __contentScope.vu)() && n2?.category !== `interactive` && !n2?.embeddedInteractive)
          return e.push(`页面已离开安全验证状态，继续执行`), { detected: true, resolved: true, kind: p };
        if (a.category === `managed` && !(0, __contentScope.yu)() && n2?.category !== `interactive`)
          return e.push(`Cloudflare 托管检查已结束，继续执行`), { detected: true, resolved: true, kind: p };
        if (!n2)
          return e.push(
            t2 ? `${t2}已通过验证信号确认完成，继续执行` : `安全验证控件已隐藏或页面已离开验证状态，继续执行`
          ), { detected: true, resolved: true, kind: p };
        if (n2.category === `interactive`) {
          await m(n2.kind);
          continue;
        }
        let r2 = Date.now() - s;
        n2.embeddedInteractive && ((0, __contentScope.Mu)() || r2 >= __contentScope.su) && await m(n2.embeddedInteractive);
      }
      return { detected: true, resolved: false, kind: p };
    }
    function Lp(e) {
      let t = e.startsWith(__contentScope.Pp) ? e.slice(14) : e;
      return __contentScope.Ip.has(t);
    }
    function Rp(e, t) {
      let n = e;
      for (; n; ) {
        let e2 = [n.getAttribute?.(`aria-label`) ?? ``, n.textContent ?? ``].join(` `);
        if (t.test(e2)) return true;
        n = n.parentElement;
      }
      return false;
    }
    function zp() {
      let e = document, t = [
        `input[autocomplete="one-time-code"]`,
        `input[name*="otp" i]`,
        `input[id*="otp" i]`,
        `input[name*="totp" i]`,
        `input[id*="totp" i]`,
        `input[name*="mfa" i]`,
        `input[id*="mfa" i]`,
        `input[name*="2fa" i]`,
        `input[id*="2fa" i]`
      ], n = (e2) => {
        let t2 = e2;
        for (; t2; ) {
          if (window.getComputedStyle(t2).display === `none`) return true;
          t2 = t2.parentElement;
        }
        return false;
      }, r = (e2) => !n(e2) && (0, __contentScope.O)(e2);
      if (t.some((t2) => [...e.querySelectorAll(t2)].some(r))) return true;
      let i = /(?:验证码|校验码|动态码|verification code|二次验证)/i, a = /(?:发送验证码|邮箱验证)/i;
      for (let t2 of e.querySelectorAll(`input[name*="code" i]`))
        if (t2 instanceof HTMLInputElement && r(t2) && (0, __contentScope.Rp)(t2, i)) return true;
      for (let t2 of e.querySelectorAll(`input[inputmode="numeric" i]`))
        if (t2 instanceof HTMLInputElement && r(t2) && (0, __contentScope.Rp)(t2, a)) return true;
      return false;
    }
    async function Bp(e, stopWhenReady) {
      let t = Date.now() + e, n = Math.min(__contentScope.Fp, e), r = false;
      for (; ; ) {
        if ((0, __contentScope.Pu)(false) || (0, __contentScope.zp)()) return true;
        if (typeof stopWhenReady === `function`) {
          try {
            if (stopWhenReady() === true) return false;
          } catch {
          }
        }
        if (!r) {
          r = true;
          if (n > 0) {
            await (0, __contentScope.Zc)((0, __contentScope.Kc)(), {
              budgetMs: Math.min(n, Math.max(0, t - Date.now()))
            });
            if ((0, __contentScope.Pu)(false) || (0, __contentScope.zp)()) return true;
            if (typeof stopWhenReady === `function`) {
              try {
                if (stopWhenReady() === true) return false;
              } catch {
              }
            }
          }
        }
        let e2 = t - Date.now();
        if (e2 <= 0) return false;
        await (0, __contentScope.w)(Math.min(__contentScope.Mp, e2));
      }
    }
    async function Vp(e, t, n, r = 0, i = `签到点击`, options = {}) {
      let a = (0, __contentScope.x)(), o = Math.min(Math.max(0, r), __contentScope.Np);
      if (!await (0, __contentScope.Bp)(o, options.stopWhenReady))
        return (0, __contentScope.x)() === a ? (o > 0 && e.push(
          `${i}后未发现安全验证证据，继续核对本次${i === `签到点击` ? `签到` : `操作`}结果`
        ), { detected: false, resolved: true }) : { detected: false, resolved: false, error: `签到任务已停止` };
      o > 0 && e.push(
        `${i}后检测到安全验证，开始等待本次${i === `签到点击` ? `签到` : `操作`}触发的安全验证`
      );
      let s = 0, c = Date.now() + n, l = false, u = false, d;
      for (; ; ) {
        if ((0, __contentScope.x)() !== a)
          return {
            detected: !!d || u,
            resolved: false,
            kind: d?.kind,
            error: `签到任务已停止`
          };
        if (d && Date.now() >= s)
          return {
            ...d,
            error: `签到滑块控件就绪等待期结束，尚未开始拖动：${d.error}。控件可能未加载、被遮挡或不受当前识别器支持`
          };
        let i2 = [], o2 = await (0, __contentScope.zu)(
          {
            push(t2) {
              (0, __contentScope.Lp)(t2) ? i2.push(t2) : e.push(t2);
            }
          },
          t,
          n,
          {
            includePendingResponse: false,
            appearanceWaitMs: l || u ? 0 : r,
            stopWhenReady: options.stopWhenReady
          }
        );
        if ((0, __contentScope.x)() !== a)
          return {
            detected: o2.detected || !!d,
            resolved: false,
            kind: o2.kind,
            error: `签到任务已停止`
          };
        if (o2.kind !== `Slider` || o2.resolved || o2.sliderAttemptStarted !== false || !__contentScope.Ip.has(o2.error ?? ``)) {
          if (d = void 0, o2.resolved && (0, __contentScope.zp)()) {
            u || e.push(`签到流程检测到验证码/二次验证控件，继续观察当前验证状态`), u = true;
            let t2 = c - Date.now();
            if (t2 <= 0)
              return {
                detected: true,
                resolved: false,
                kind: `VerificationCode`,
                error: `签到验证码/二次验证未在等待时间内结束`
              };
            await (0, __contentScope.w)(Math.min(__contentScope.Mp, t2));
            continue;
          }
          if (!o2.resolved) for (let t2 of i2) e.push(t2);
          return l && !o2.detected && e.push(`签到验证码控件暂时不可见，继续核对签到结果并观察后续验证`), {
            ...o2,
            detected: o2.detected || l || u,
            ...u && !o2.kind ? { kind: `VerificationCode` } : {}
          };
        }
        d = o2, l ||= (s = Date.now() + __contentScope.Ap, e.push(`签到滑块控件尚未就绪，尚未开始拖动；保留本次签到，给控件约 30 秒加载时间`), true), await (0, __contentScope.w)(Math.min(__contentScope.jp, Math.max(0, s - Date.now())));
      }
    }
    function Up(e, t) {
      return /(?:^|[\s|:：-])403(?:[\s|:：-]|$)/.test(t) && /forbidden|denied|禁止|拒绝|无权限/i.test(`${t}
${e}`) || /\b403\s+forbidden\b/i.test(e) || /(?:error\s*code|http\s*error|状态码|错误码)\s*[:：]?\s*403\b/i.test(e) ? `站点返回 403 Forbidden（访问被拒绝）` : /(?:not\s+available\s+in\s+your\s+(?:region|country)|access\s+denied|国家\/?地区.{0,6}(?:不支持|受限|限制)|根据你所在的地区|地区限制)/i.test(
        e
      ) && /(?:403|forbidden|denied|blocked|restricted)/i.test(e) ? `站点限制了当前地区 / 出口的访问（访问被拒绝）` : null;
    }
    function Wp() {
      let e = document.title ?? ``, t = `${e}
${(document.body?.innerText ?? document.body?.textContent ?? ``).slice(0, 12e3)}`, n = (0, __contentScope.Up)(t, e);
      if (n && !/\b5\d{2}\b/.test(e)) return { message: n, retryable: false };
      let r = e.match(/(?:^|\|)\s*(5\d{2})\s*:/)?.[1] ?? t.match(/(?:error\s*code|http\s*error)\s*(5\d{2})/i)?.[1], i = /bad\s*gateway|service\s*unavailable|gateway\s*time-?out/i.test(t), a = /cloudflare[\s\S]{0,800}host[\s\S]{0,80}error/i.test(t) || /the\s+web\s+server\s+reported\s+a\s+bad\s+gateway/i.test(t);
      if (!r && !i && !a) return null;
      let o = r ? Number(r) : 502;
      return {
        message: `站点源服务器返回 ${o}（${a ? `Cloudflare 显示 Host Error` : `站点服务暂不可用`}）`,
        retryable: __contentScope.Hp.has(o)
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
        }
      },
      initializers: [
        {
          order: 144,
          run() {
            __contentState.wo = `aah-slider-frame-connect`;
          }
        },
        {
          order: 145,
          run() {
            __contentState.To = 65e3;
          }
        },
        {
          order: 146,
          run() {
            __contentState.q = {
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
          order: 147,
          run() {
            __contentState.Eo = /* @__PURE__ */ new Set([
              `tcaptcha_iframe_drag`,
              `tcaptcha_iframe_dy`,
              `tCaptchaIframeArea`,
              `tcaptcha_popup`
            ]);
          }
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
              `[class*="slide-verify" i]`
            ].join(`, `);
          }
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
              `[class*="verify" i][data-state="success" i]`
            ].join(`, `);
          }
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
              `[class*="move" i][class*="btn" i]`
            ].join(`, `);
          }
        },
        {
          order: 151,
          run() {
            __contentState.Mo = `img, canvas, [class], [id]`;
          }
        },
        {
          order: 152,
          run() {
            __contentState.No = /captcha|challenge|verify|verification|puzzle|jigsaw|geetest|yidun|human|robot|验证码|验证|拼图|人机|安全校验/i;
          }
        },
        {
          order: 153,
          run() {
            __contentState.Po = /slider|slide|drag|swipe|move|track|rail|thumb|knob|handle|滑块|滑动|拖动|向右滑/i;
          }
        },
        {
          order: 154,
          run() {
            __contentState.Fo = /(?:slider|slide|drag|move)[-_\s]*(?:btn|button|handle|knob|thumb)|(?:btn|button|handle|knob|thumb)[-_\s]*(?:slider|slide|drag|move)|滑块|拖动|滑动/i;
          }
        },
        {
          order: 155,
          run() {
            __contentState.Io = /carousel|swiper|gallery|volume|seek|range|price|filter|toggle|switch|轮播|音量|价格|筛选/i;
          }
        },
        {
          order: 156,
          run() {
            __contentState.Lo = /background|(?:^|[-_\s])bg(?:$|[-_\s])|canvas|content|image|(?:^|[-_\s])img(?:$|[-_\s])/i;
          }
        },
        {
          order: 157,
          run() {
            __contentState.Ro = /piece|slice|template|block|puzzle|jigsaw|move[-_\s]*img|slider[-_\s]*img|拼图|缺块/i;
          }
        },
        {
          order: 158,
          run() {
            __contentState.zo = /track|rail|bar|slider[-_\s]*move|slide[-_\s]*track|drag[-_\s]*track|滑轨|拖动条/i;
          }
        },
        {
          order: 159,
          run() {
            __contentState.Bo = /drag|slide|swipe|move|complete.{0,12}(?:puzzle|verification)|拖动|滑动|按住|完成拼图|向右滑/i;
          }
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
              `[style*="background" i]`
            ].join(`, `);
          }
        },
        {
          order: 161,
          run() {
            __contentState.Ho = /refresh|reload|close|cancel|reset|help|(?:^|[-_\s])info(?:$|[-_\s])|刷新|换一张|关闭|取消|帮助|说明/i;
          }
        },
        {
          order: 162,
          run() {
            __contentState.Uo = 1200;
          }
        },
        {
          order: 163,
          run() {
            __contentState.Wo = 8388608;
          }
        },
        {
          order: 164,
          run() {
            __contentState.Go = `data-aah-pointer-target`;
          }
        },
        {
          order: 165,
          run() {
            __contentState.Is = (e) => new Promise((t) => {
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
          order: 166,
          run() {
            __contentState.Ls = (e) => new Promise((t) => setTimeout(t, e));
          }
        },
        {
          order: 167,
          run() {
            __contentState.Js = /\b(?:verified|verification successful|success|passed)\b|验证\s*成功|校验\s*成功|验证\s*通过|已\s*通过/i;
          }
        },
        {
          order: 168,
          run() {
            __contentState.Ys = /too short|not far enough|move (?:a little )?further|偏左|距离过短|滑动不足|还差一点|未拖到位/i;
          }
        },
        {
          order: 169,
          run() {
            __contentState.Xs = /too far|overshoot|move (?:a little )?back|偏右|距离过长|滑过头|拖过头/i;
          }
        },
        {
          order: 170,
          run() {
            __contentState.Zs = /failed|failure|incorrect|try again|retry|error|验证失败|校验失败|请重试|重新尝试|再试一次/i;
          }
        },
        {
          order: 171,
          run() {
            __contentState.Qs = /refresh|reload|retry|try again|change image|next image|刷新|换一张|重试|重新加载/i;
          }
        },
        {
          order: 172,
          run() {
            __contentState.$s = /close|cancel|关闭|取消/i;
          }
        },
        {
          order: 173,
          run() {
            __contentState.ec = 900;
          }
        },
        {
          order: 174,
          run() {
            __contentState.tc = 1200;
          }
        },
        {
          order: 175,
          run() {
            __contentState.nc = {
              "too-short": __contentScope.Ys,
              "too-far": __contentScope.Xs,
              failed: __contentScope.Zs
            };
          }
        },
        {
          order: 176,
          run() {
            __contentState.fc = 5;
          }
        },
        {
          order: 177,
          run() {
            __contentState.pc = 55e3;
          }
        },
        {
          order: 178,
          run() {
            __contentState.mc = null;
          }
        },
        {
          order: 179,
          run() {
            __contentState.gc = {
              "raw-image": `原图`,
              "viewport-screenshot": `CDP 截图`
            };
          }
        },
        {
          order: 180,
          run() {
            __contentState._c = {
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
          order: 181,
          run() {
            __contentState.wc = 1e4;
          }
        },
        {
          order: 182,
          run() {
            __contentState.Tc = 1e4;
          }
        },
        {
          order: 183,
          run() {
            __contentState.Ec = 3;
          }
        },
        {
          order: 184,
          run() {
            __contentState.Dc = 1200;
          }
        },
        {
          order: 185,
          run() {
            __contentState.Oc = 2e4;
          }
        },
        {
          order: 186,
          run() {
            __contentState.kc = 250;
          }
        },
        {
          order: 187,
          run() {
            __contentState.Ac = 300;
          }
        },
        {
          order: 188,
          run() {
            __contentState.jc = 1500;
          }
        },
        {
          order: 189,
          run() {
            __contentState.Mc = 1e3;
          }
        },
        {
          order: 190,
          run() {
            __contentState.Lc = 2;
          }
        },
        {
          order: 191,
          run() {
            __contentState.Rc = 2;
          }
        },
        {
          order: 192,
          run() {
            __contentState.zc = 180;
          }
        },
        {
          order: 193,
          run() {
            __contentState.Bc = 1e3;
          }
        },
        {
          order: 194,
          run() {
            __contentState.Vc = 8;
          }
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
              `[class*="recaptcha" i]`
            ];
          }
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
              `[class*="verify" i]`
            ];
          }
        },
        {
          order: 197,
          run() {
            __contentState.Gc = [...__contentScope.Uc, ...__contentScope.Wc].join(`, `);
          }
        },
        {
          order: 198,
          run() {
            __contentState.Cl = /(?:答案|计算结果|计算答案|运算结果|运算答案|算术验证|数学验证|人机验证|验证码|answer|result|arithmetic|calculation|math|captcha)/i;
          }
        },
        {
          order: 199,
          run() {
            __contentState.wl = `[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)`;
          }
        },
        {
          order: 200,
          run() {
            __contentState.Tl = RegExp(
              `^\\s*(${__contentScope.wl})\\s*([+\\-*/])\\s*(${__contentScope.wl})\\s*(?:=\\s*(?:\\?)?)?\\s*$`
            );
          }
        },
        {
          order: 201,
          run() {
            __contentState.El = RegExp(
              `(${__contentScope.wl}\\s*[+\\-*/]\\s*${__contentScope.wl}\\s*=\\s*(?:\\?)?)`
            );
          }
        },
        {
          order: 202,
          run() {
            __contentState.Dl = /[;{}[\]`]|=>|\b(?:alert|eval|function|globalThis|window|document)\b/i;
          }
        },
        {
          order: 203,
          run() {
            __contentState.Ol = /* @__PURE__ */ new Set([
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
              `week`
            ]);
          }
        },
        {
          order: 204,
          run() {
            __contentState.kl = /* @__PURE__ */ new WeakMap();
          }
        },
        {
          order: 205,
          run() {
            __contentState.Wl = [
              `#challenge-running`,
              `#cf-challenge-running`,
              `.cf-challenge-running`,
              `#challenge-stage`,
              `form#challenge-form`
            ].join(`, `);
          }
        },
        {
          order: 206,
          run() {
            __contentState.Gl = [
              `script[src*="/cdn-cgi/challenge-platform/"]`,
              `link[href*="/cdn-cgi/challenge-platform/"]`,
              `iframe[src*="/cdn-cgi/challenge-platform/"]`,
              `#cf-wrapper`,
              `[data-ray]`
            ].join(`, `);
          }
        },
        {
          order: 207,
          run() {
            __contentState.Kl = /(^|\.)agentrouter\.org$|^ps\.air-outer\.com$/i;
          }
        },
        {
          order: 208,
          run() {
            __contentState.ql = [`CF_APP_WAF`, `AC_Opt`, `sceneId`];
          }
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
              `iframe[title*="cloudflare security challenge" i]`
            ].join(`, `);
          }
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
                  shadowTarget: true,
                  insetLeftPx: 24,
                  minVisibleMs: 1e4,
                  safetyWindowMs: 15e3,
                  mountWaitMs: 15e3,
                  layoutWaitMs: 1e4,
                  maxAttempts: 3,
                  retryDelayMs: 3e3,
                  responseWaitMs: 2e4
                }
              },
              {
                kind: `reCAPTCHA`,
                selectors: [
                  `.g-recaptcha`,
                  `[class*="recaptcha" i][data-sitekey]`,
                  `iframe[src*="recaptcha"]`,
                  `iframe[title*="recaptcha" i]`
                ].join(`, `),
                tokenSelectors: `input[name="g-recaptcha-response"], textarea[name="g-recaptcha-response"]`,
                strategy: { shadowTarget: true, mountWaitMs: 1e4, maxAttempts: 3 }
              },
              {
                kind: `hCaptcha`,
                selectors: [
                  `.h-captcha`,
                  `[class*="hcaptcha" i][data-sitekey]`,
                  `iframe[src*="hcaptcha.com"]`,
                  `iframe[title*="hcaptcha" i]`
                ].join(`, `),
                tokenSelectors: `input[name="h-captcha-response"], textarea[name="h-captcha-response"]`,
                strategy: { shadowTarget: true, mountWaitMs: 1e4, maxAttempts: 3 }
              }
            ];
          }
        },
        {
          order: 211,
          run() {
            __contentState.Xl = [
              ...__contentScope.Yl,
              {
                kind: `Slider`,
                selectors: __contentScope.ko,
                tokenSelectors: ``
              }
            ];
          }
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
              `iframe[title*="hcaptcha" i]`
            ].join(`, `);
          }
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
              `input[name*="captcha" i]:not([type="hidden"])`
            ].join(`, `);
          }
        },
        {
          order: 214,
          run() {
            __contentState.eu = [
              `iframe[src*="captcha" i]`,
              `img[src*="captcha" i]`,
              `canvas[class*="captcha" i]`,
              `input[name*="captcha" i]:not([type="hidden"])`
            ].join(`, `);
          }
        },
        {
          order: 215,
          run() {
            __contentState.tu = [`[class*="captcha" i]`, `[id*="captcha" i]`].join(`, `);
          }
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
              `[tabindex]`
            ].join(`, `);
          }
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
              `浏览器检查`
            ];
          }
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
              `验证你是真人`
            ];
          }
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
              /(?:确认|验证)(?:您|你)?是(?:真人|人类)/
            ];
          }
        },
        {
          order: 220,
          run() {
            __contentState.ou = /* @__PURE__ */ new Set([`complete`, `completed`, `passed`, `success`, `verified`]);
          }
        },
        {
          order: 221,
          run() {
            __contentState.su = 1500;
          }
        },
        {
          order: 222,
          run() {
            __contentState.cu = 1200;
          }
        },
        {
          order: 223,
          run() {
            __contentState.lu = 250;
          }
        },
        {
          order: 268,
          run() {
            __contentState.Ap = 3e4;
          }
        },
        {
          order: 269,
          run() {
            __contentState.jp = 1e3;
          }
        },
        {
          order: 270,
          run() {
            __contentState.Mp = 250;
          }
        },
        {
          order: 271,
          run() {
            __contentState.Np = 2500;
          }
        },
        {
          order: 272,
          run() {
            __contentState.Pp = `滑块自动求解未通过页面确认：`;
          }
        },
        {
          order: 273,
          run() {
            __contentState.Fp = 1e3;
          }
        },
        {
          order: 274,
          run() {
            __contentState.Ip = /* @__PURE__ */ new Set([
              `当前验证码文档未找到可接收拖动的滑块把手（可能仍在加载或被遮挡）`,
              `已找到滑块把手，但尚未找到它所属的验证码面板`,
              `已找到验证码面板和把手，但没有匹配的滑动轨道`,
              `已找到滑块把手和轨道，但验证码背景图片尚未就绪`,
              `验证码组件仍在重绘，尚未取得同一挑战的完整滑块控件`,
              `验证码图片还没有加载完成，未执行拖动`,
              `验证码布局在等待时间内没有稳定，未使用动画中的坐标拖动`,
              `没有找到同时满足把手、轨道和背景几何关系的滑块控件`,
              `检测到滑动挑战，但页面没有暴露可安全拖动的 DOM 控件`
            ]);
          }
        },
        {
          order: 275,
          run() {
            __contentState.Hp = /* @__PURE__ */ new Set([500, 502, 503, 504, 520, 521, 522, 523, 524, 530]);
          }
        }
      ]
    };
  }

  // src/entries/auto-login.js
  function createAutoLoginRuntime() {
    const __contentScope = /* @__PURE__ */ Object.create(null);
    const modules = {
      shared: createSharedAutoContent(__contentScope),
      learning: createLearningAutoContent(__contentScope),
      checkin: createCheckinAutoContent(__contentScope),
      slider: createSliderAutoContent(__contentScope)
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
        return (async () => {
          try {
            let { main: e, ...t } = __contentScope.Gg;
            return await e(new __contentScope.Qg(`auto-login`, t));
          } catch (e) {
            throw __contentScope.$g.error(`The content script "auto-login" crashed on startup!`, e), e;
          }
        })();
      }
    };
  }
  function startAutoLogin() {
    return createAutoLoginRuntime().start();
  }
  startAutoLogin();
})();
