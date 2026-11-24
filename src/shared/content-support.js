import { bindContentState } from './content-runtime.js';

/** 内容脚本通用支持：DOM、文本、可信指针、消息超时和扩展生命周期。  */
export function createSharedAutoContent(__contentScope) {
  const __contentState = bindContentState(__contentScope, [
    'e',
    't',
    'n',
    'p',
    'm',
    'h',
    'g',
    '_',
    'v',
    'y',
    'b',
    'x',
    'S',
    'C',
    'ee',
    'te',
    'ne',
    'w',
    're',
    'ie',
    'T',
    'ae',
    'oe',
    'se',
    'ce',
    'le',
    'ue',
    'de',
    'fe',
    'pe',
    'me',
    'he',
    'ge',
    '_e',
    've',
    'ye',
    'be',
    'E',
    'D',
    'xe',
    'Se',
    'Ce',
    'we',
    'O',
    'k',
    'A',
    'Te',
    'Ee',
    'De',
    'Oe',
    'j',
    'ke',
    'Ae',
    'je',
    'Me',
    'M',
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
    'Ge',
    'Ke',
    'qe',
    'N',
    'Je',
    'Ye',
    'Xe',
    'Ze',
    'Qe',
    '$e',
    'P',
    'et',
    'I',
    'L',
    'R',
    'z',
    'V',
    'H',
    'Kg',
    'qg',
    'Jg',
    'Yg',
    'Xg',
    'Zg',
    'Qg',
    '$g',
  ]);
  function e(e) {
    return e;
  }

  function t(e) {
    if (e.type === `SLIDER_FRAME_PREPARE`) return 8e3;
    if (
      e.type === `SLIDER_FRAME_CONNECT` ||
      e.type === `SLIDER_FRAME_REPORT` ||
      e.type === `SLIDER_FRAME_STATUS` ||
      e.type === `SLIDER_FRAME_CANCEL`
    )
      return 4e3;
    if (e.type === `SCAN_LOCAL_PORTS`) {
      let t = e.withExit === !0 ? 24e3 : 8e3;
      return e.ports.length * t + 1e4;
    }
    return e.type === `TEST_PROXY` ? 34e3 : 45e3;
  }

  function n(e) {
    return new Promise((n) => {
      let r = (0, __contentScope.t)(e),
        i = !1,
        a = (e) => {
          i || ((i = !0), clearTimeout(o), n(e));
        },
        o = setTimeout(() => {
          a({
            ok: !1,
            error: `后台在 ${Math.round(r / 1e3)} 秒内没有响应 ${e.type}（Service Worker 可能已被回收）`,
          });
        }, r);
      try {
        chrome.runtime.sendMessage(e, (e) => {
          chrome.runtime.lastError
            ? a({
                ok: !1,
                error: chrome.runtime.lastError.message ?? `unknown`,
              })
            : a(e ?? { ok: !0 });
        });
      } catch (e) {
        a({ ok: !1, error: e instanceof Error ? e.message : String(e) });
      }
    });
  }

  function p(e) {
    return e.checkin?.method === `workflow`;
  }

  function m(e) {
    return Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0.5;
  }

  function h(e, t) {
    return t.kind === `inset-left`
      ? e.left + Math.min(t.px, e.width / 2)
      : t.kind === `relative`
        ? e.left + e.width * (0, __contentScope.m)(t.rx)
        : e.left + e.width / 2;
  }

  function g(e, t) {
    return t.kind === `relative`
      ? e.top + e.height * (0, __contentScope.m)(t.ry)
      : e.top + e.height / 2;
  }

  function b(e, t = `trusted`, n) {
    ((__contentScope._ = e), (__contentScope.v = t), (__contentScope.y = e ? n : void 0));
  }

  function x() {
    return __contentScope._;
  }

  function S() {
    return __contentScope.y;
  }

  function C(e, t) {
    return (
      Math.abs(e.left - t.left) > 1 ||
      Math.abs(e.top - t.top) > 1 ||
      Math.abs(e.width - t.width) > 1 ||
      Math.abs(e.height - t.height) > 1
    );
  }

  function ee(e) {
    if (e != null && Date.now() >= e) throw Error(`点击已超过执行截止时间`);
  }

  async function ne(e, t) {
    let n = e.getBoundingClientRect(),
      r = Math.min(Date.now() + 1200, t ?? 1 / 0),
      i = 0;
    for (; Date.now() < r;) {
      await (0, __contentScope.w)(Math.min(__contentScope.te, Math.max(1, r - Date.now())));
      let t = e.getBoundingClientRect();
      if (((0, __contentScope.C)(n, t) ? (i = 0) : (i += 1), (n = t), i >= 2)) return t;
    }
    throw ((0, __contentScope.ee)(t), Error(`目标控件位置仍在变化，无法可靠点击`));
  }

  function ue(e) {
    if (e.gesture !== void 0 && !__contentScope.ae.has(e.gesture))
      throw Error(`未知手势 ${String(e.gesture)}；只允许 click/double/right/long-press`);
    let t = e.gesture ?? `click`,
      n = null;
    if (e.key !== void 0) {
      if (!__contentScope.T.has(e.key))
        throw Error(`key 只允许非打印功能键，收到 ${JSON.stringify(e.key)}`);
      n = e.key;
    }
    if (n != null && t !== `click`)
      throw Error(`key 触发与手势互斥：键盘触发不能再叠加 double/right/long-press`);
    let r =
        e.anchor == null
          ? e.insetLeftPx == null
            ? { kind: `center` }
            : { kind: `inset-left`, px: e.insetLeftPx }
          : { kind: `relative`, rx: e.anchor.rx, ry: e.anchor.ry },
      i =
        e.holdMs != null && Number.isFinite(e.holdMs)
          ? Math.max(0, Math.round(e.holdMs))
          : __contentScope.se;
    return { anchor: r, gesture: t, key: n, holdMs: i };
  }

  function pe(e) {
    return e.replace(__contentScope.fe, ``).replace(/\s+/g, ` `).trim();
  }

  function me(e) {
    return (0, __contentScope.pe)(e.innerText ?? e.textContent ?? ``);
  }

  function he(e, t) {
    let n = (0, __contentScope.me)(e).toLowerCase();
    if (!n || !t.includes(n)) return !1;
    let r = (0, __contentScope.pe)(e.textContent ?? ``).toLowerCase();
    if (r !== t || r === n || !e.querySelector(`svg title, svg desc`)) return !1;
    let i = e.cloneNode(!0);
    for (let e of i.querySelectorAll(`svg title, svg desc`)) e.remove();
    return (0, __contentScope.pe)(i.textContent ?? ``).toLowerCase() === n;
  }

  function ge(e, t = document) {
    let n = e.split(`>>`).map((e) => e.trim()),
      r = n.find((e) => e.startsWith(`text=`));
    if (!r) return [];
    let i = (0, __contentScope.pe)(r.slice(5)).toLowerCase();
    if (!i) return [];
    let a =
        n
          .filter((e) => !e.startsWith(`text=`))
          .join(` `)
          .trim() || __contentScope.de,
      o;
    try {
      o = [...t.querySelectorAll(a)];
    } catch {
      return [];
    }
    let s = (e) =>
        [
          (0, __contentScope.me)(e),
          (0, __contentScope.pe)(e.getAttribute(`aria-label`) ?? ``),
          (0, __contentScope.pe)(e.getAttribute(`title`) ?? ``),
        ].find((e) => e && e.toLowerCase().includes(i)) ?? null,
      c = o.filter((e) => (0, __contentScope.O)(e)),
      l = c
        .map((e) => ({ el: e, text: s(e) }))
        .filter((e) => e.text !== null)
        .sort(
          (e, t) =>
            (0, __contentScope._e)(e.el) - (0, __contentScope._e)(t.el) ||
            e.text.length - t.text.length,
        );
    if (l.length) return l.map(({ el: e }) => e);
    let u = c.filter((e) => (0, __contentScope.he)(e, i));
    return u.length === 1 ? [u[0]] : [];
  }

  function _e(e) {
    if (e.hasAttribute(`aria-expanded`)) return 1;
    let t = e.getAttribute(`data-state`);
    return t === `open` ||
      t === `closed` ||
      e.querySelector(`button, [role="button"], input[type="submit"]`)
      ? 1
      : 0;
  }

  function ye(e) {
    return e
      .split(`>>>`)
      .map((e) => e.trim())
      .filter(Boolean);
  }

  function be(e, t) {
    if (e.includes(`text=`)) return (0, __contentScope.ge)(e, t);
    try {
      return [...t.querySelectorAll(e)];
    } catch {
      return [];
    }
  }

  function E(e, t = document) {
    let n = (0, __contentScope.ye)(e);
    if (n.length === 0) return [];
    let r = t;
    for (let t = 0; t < n.length - 1; t += 1) {
      let i = (0, __contentScope.be)(n[t], r)[0];
      if (!i) return [];
      let a = i.shadowRoot;
      if (!a) {
        let r = n[t];
        throw new __contentScope.ve(
          `选择器「` + e + `」里的「` + r + `」是闭合的影子根，扩展读不到里面的内容`,
        );
      }
      r = a;
    }
    return (0, __contentScope.be)(n[n.length - 1], r);
  }

  function D(e) {
    for (let t of (0, __contentScope.we)(e))
      try {
        for (let e of (0, __contentScope.E)(t)) if ((0, __contentScope.O)(e)) return e;
      } catch (e) {
        if (e instanceof __contentScope.ve) throw e;
      }
    return null;
  }

  function xe(e, t = document) {
    let n = new Set();
    for (let r of (0, __contentScope.we)(e))
      try {
        let e = (0, __contentScope.E)(r, t).filter(__contentScope.O);
        for (let t of e) n.add(t);
      } catch (e) {
        if (e instanceof __contentScope.ve) throw e;
      }
    return [...n];
  }

  function Se(e) {
    let t = e.trimStart();
    return t
      ? t.startsWith(`.`) ||
        t.startsWith(`#`) ||
        t.startsWith(`[`) ||
        t.startsWith(`:`) ||
        t.startsWith(`*`)
        ? !0
        : /^[a-z][\w-]*\s*(?:[.#:]|\[|[>+~])/i.test(t)
      : !1;
  }

  function Ce(e) {
    let t = e.replace(/^,\s*/, ``);
    if (!t) return !1;
    if (t.startsWith(`text=`)) return !0;
    let n = t.indexOf(`>>`);
    return n > 0 &&
      t
        .slice(n + 2)
        .trimStart()
        .startsWith(`text=`)
      ? !t.slice(0, n).includes(`,`)
      : (0, __contentScope.Se)(t);
  }

  function we(e) {
    let t = [],
      n = ``,
      r = !1;
    for (let i = 0; i < e.length; i++) {
      let a = e.slice(i);
      (!r && a.startsWith(`text=`) && (r = !0),
        e[i] === `,` && (!r || (0, __contentScope.Ce)(a))
          ? (t.push(n.trim()), (n = ``), (r = !1))
          : (n += e[i]));
    }
    return (n.trim() && t.push(n.trim()), t.filter(Boolean));
  }

  function O(e) {
    let t = window.getComputedStyle(e);
    if (t.display === `none` || t.visibility === `hidden` || t.opacity === `0`) return !1;
    let n = e.getBoundingClientRect();
    return n.width > 0 && n.height > 0;
  }

  async function k(e, t = 1e4, n) {
    let r = Date.now() + Math.max(0, t),
      i = (0, __contentScope.D)(e);
    if (i) return i;
    if (t <= 0) return null;
    let a = Math.min(Number.isFinite(n) && n > 0 ? n : __contentScope.re, __contentScope.re);
    for (; Date.now() < r;) {
      await (0, __contentScope.w)(Math.min(a, Math.max(1, r - Date.now())));
      let t = (0, __contentScope.D)(e);
      if (t) return t;
      a = Math.min(Math.round(a * 1.6) || __contentScope.re, __contentScope.ie);
    }
    return null;
  }

  function A(e, t) {
    let n =
        e instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype,
      r = Object.getOwnPropertyDescriptor(n, `value`)?.set;
    (e.focus(),
      r ? r.call(e, t) : (e.value = t),
      e.dispatchEvent(new Event(`input`, { bubbles: !0 })),
      e.dispatchEvent(new Event(`change`, { bubbles: !0 })));
  }

  function Te(e) {
    if (!(e instanceof HTMLElement)) return !1;
    let t = e.getAttribute(`contenteditable`);
    return t === `` || t?.toLowerCase() === `true`;
  }

  function Ee(e) {
    return (
      e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || (0, __contentScope.Te)(e)
    );
  }

  function De(e, t) {
    e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement
      ? (0, __contentScope.A)(e, t)
      : (e.focus(),
        (e.textContent = t),
        e.dispatchEvent(new Event(`input`, { bubbles: !0 })),
        e.dispatchEvent(new Event(`change`, { bubbles: !0 })));
  }

  function Oe(e, t, n, r = 0, i = 0) {
    return {
      bubbles: !0,
      cancelable: !0,
      view: e.ownerDocument?.defaultView ?? window,
      button: r,
      buttons: i,
      clientX: Math.round(t),
      clientY: Math.round(n),
    };
  }

  function j(e, t, n, r, i = 0, a = 0) {
    let o = (0, __contentScope.Oe)(t, n, r, i, a);
    try {
      return new MouseEvent(e, o);
    } catch {
      let { view: t, ...n } = o;
      return new MouseEvent(e, n);
    }
  }

  function ke(e, t) {
    let n = __contentScope.oe[t];
    if (!n) throw Error(`key 只允许非打印功能键，收到 ${JSON.stringify(t)}`);
    typeof e.focus == `function` && e.focus();
    let r = {
      bubbles: !0,
      cancelable: !0,
      key: n.key,
      code: n.code,
      keyCode: n.keyCode,
      which: n.keyCode,
    };
    (e.dispatchEvent(new KeyboardEvent(`keydown`, r)),
      n.keyCode === 13 && e.dispatchEvent(new KeyboardEvent(`keypress`, r)),
      e.dispatchEvent(new KeyboardEvent(`keyup`, r)));
  }

  async function Ae(e, t, n, r, i) {
    if (r === `double`) {
      for (let r = 0; r < 2; r += 1)
        (e.dispatchEvent((0, __contentScope.j)(`mousedown`, e, t, n, 0, 1)),
          e.dispatchEvent((0, __contentScope.j)(`mouseup`, e, t, n, 0, 0)),
          typeof e.click == `function`
            ? e.click()
            : e.dispatchEvent((0, __contentScope.j)(`click`, e, t, n, 0, 0)),
          r === 0 && (await (0, __contentScope.w)(__contentScope.ce)));
      e.dispatchEvent((0, __contentScope.j)(`dblclick`, e, t, n, 0, 0));
    } else
      r === `right`
        ? (e.dispatchEvent((0, __contentScope.j)(`mousedown`, e, t, n, 2, 2)),
          e.dispatchEvent((0, __contentScope.j)(`contextmenu`, e, t, n, 2, 2)),
          e.dispatchEvent((0, __contentScope.j)(`mouseup`, e, t, n, 2, 0)))
        : r === `long-press`
          ? (e.dispatchEvent((0, __contentScope.j)(`mousedown`, e, t, n, 0, 1)),
            await (0, __contentScope.w)(i),
            e.dispatchEvent((0, __contentScope.j)(`mouseup`, e, t, n, 0, 0)),
            typeof e.click == `function`
              ? e.click()
              : e.dispatchEvent((0, __contentScope.j)(`click`, e, t, n, 0, 0)))
          : (0, __contentScope.Me)(e);
  }

  function je(e, t) {
    let n = { bubbles: !0, cancelable: !0 };
    try {
      return new MouseEvent(e, {
        ...n,
        view: t.ownerDocument?.defaultView ?? window,
      });
    } catch {
      return new MouseEvent(e, n);
    }
  }

  function Me(e) {
    (e.dispatchEvent((0, __contentScope.je)(`mousedown`, e)),
      e.dispatchEvent((0, __contentScope.je)(`mouseup`, e)),
      typeof e.click == `function`
        ? e.click()
        : e.dispatchEvent((0, __contentScope.je)(`click`, e)));
  }

  async function M(e, t = {}) {
    let r = __contentScope._,
      i = __contentScope.v === `dom` || !r || typeof chrome > `u` || !chrome.runtime?.id;
    if (i && t.targetSeenAt != null && Number.isFinite(t.targetSeenAt)) {
      let e = t.targetSeenAt + 15e3 - Date.now();
      if (e > 0) {
        if (t.deadline != null && Date.now() + e >= t.deadline)
          throw Error(`验证控件安全窗口会超过执行截止时间，已取消点击`);
        await (0, __contentScope.w)(e);
      }
    }
    ((0, __contentScope.ee)(t.deadline), e.scrollIntoView({ block: `center`, inline: `center` }));
    let a = await (0, __contentScope.ne)(e, t.deadline);
    if (((0, __contentScope.ee)(t.deadline), a.width <= 0 || a.height <= 0))
      throw Error(`目标控件当前不可见，无法点击`);
    let o = a.top + a.height / 2,
      s = a.left + a.width / 2;
    if (o < 0 || o > window.innerHeight || s < 0 || s > window.innerWidth)
      throw Error(
        `目标控件在视口之外（滚动后位置 ${Math.round(a.left)},${Math.round(a.top)} 超出视口 ${window.innerWidth}x${window.innerHeight}），已取消点击以免点到其它元素`,
      );
    let { anchor: c, gesture: l, key: u, holdMs: d } = (0, __contentScope.ue)(t),
      f = (e) => e !== `click`,
      p = Math.min(window.innerWidth - 1, Math.max(1, (0, __contentScope.h)(a, c))),
      m = Math.min(window.innerHeight - 1, Math.max(1, (0, __contentScope.g)(a, c)));
    if (t.debugVisualize) {
      let e = document.createElement(`div`);
      ((e.style.cssText = `
      position: fixed;
      left: ${p}px;
      top: ${m}px;
      width: 20px;
      height: 20px;
      margin: -10px 0 0 -10px;
      background: red;
      border: 3px solid yellow;
      border-radius: 50%;
      z-index: 999999;
      pointer-events: none;
      box-shadow: 0 0 10px rgba(255,0,0,0.8);
    `),
        document.body.appendChild(e));
      try {
        if (t.deadline != null && Date.now() + 2e3 >= t.deadline)
          throw Error(`调试标记等待会超过执行截止时间，已取消点击`);
        await (0, __contentScope.w)(2e3);
      } finally {
        e.remove();
      }
      (0, __contentScope.ee)(t.deadline);
    }
    let { hit: b, blocked: x } = (0, __contentScope.Ke)(e, p, m);
    if (x) throw Error(`目标控件被 ${b ? (0, __contentScope.N)(b) : `未知元素`} 遮挡`);
    if (i)
      return (
        (0, __contentScope.ee)(t.deadline),
        u == null
          ? l === `click`
            ? ((0, __contentScope.Me)(e), `dom`)
            : (await (0, __contentScope.Ae)(e, p, m, l, d), `dom`)
          : ((0, __contentScope.ke)(e, u), `dom`)
      );
    if (u != null) return ((0, __contentScope.ee)(t.deadline), (0, __contentScope.ke)(e, u), `dom`);
    if (l !== `click` && !f(l))
      throw Error(
        `${(0, __contentScope.Ne)(l)}需要浏览器级指针通道，当前页面没有可信指针接线，已取消执行（不降级为普通单击）`,
      );
    let S = `data-aah-pointer-target`,
      C = e.getAttribute(S),
      te = `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    e.setAttribute(S, te);
    try {
      (0, __contentScope.ee)(t.deadline);
      let e = await (0, __contentScope.n)({
        type: `TRUSTED_POINTER_CLICK`,
        runId: r,
        ...(__contentScope.y ? { frameSessionId: __contentScope.y } : {}),
        x: p,
        y: m,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        targetToken: te,
        anchor: c,
        ...(l === `click` ? {} : { gesture: l }),
        ...(l === `long-press` ? { holdMs: d } : {}),
        ...(u == null ? {} : { key: u }),
        ...(t.targetSeenAt == null ? {} : { targetSeenAt: t.targetSeenAt }),
        ...(t.deadline == null ? {} : { deadline: t.deadline }),
      });
      if (!e.ok) {
        if (
          t.mayNavigate &&
          t.reconcileAfterLostResponse &&
          (e.error.includes(`没有响应 TRUSTED_POINTER_CLICK`) ||
            e.error.includes(`点击结果可能未知`))
        )
          return `trusted`;
        throw Error(`浏览器级鼠标点击失败：${e.error}`);
      }
      if (e.feature?.pointer?.mode !== `trusted`) {
        if (t.mayNavigate) return `trusted`;
        throw Error(`浏览器级鼠标点击没有返回可信执行结果`);
      }
      let i = e.feature.pointer;
      if ((t.onPointerResult?.(i), i.clickObserved === !1)) {
        if (t.shadowTarget) return `trusted`;
        throw Error(`浏览器级鼠标事件未到达目标控件`);
      }
      if (i.clickObserved == null && !t.mayNavigate)
        throw Error(`无法确认目标控件收到浏览器级鼠标事件`);
      return `trusted`;
    } finally {
      e.getAttribute(S) === te && (C == null ? e.removeAttribute(S) : e.setAttribute(S, C));
    }
  }

  function Ne(e) {
    return e === `double` ? `双击` : e === `right` ? `右键` : e === `long-press` ? `长按` : `点击`;
  }

  function Pe(e) {
    return e == null ? { kind: `center` } : { kind: `relative`, rx: e.rx, ry: e.ry };
  }

  function Fe(e) {
    if (e == null) return 12;
    if (!Number.isInteger(e) || e < 0 || e > 64) throw Error(`拖拽中间点数量必须是 0-64 的整数`);
    return e;
  }

  function Ie(e, t) {
    if (!Number.isFinite(e.x) || !Number.isFinite(e.y))
      throw Error(`${t}坐标不是有效数字，已取消拖拽`);
    if (e.x < 0 || e.y < 0 || e.x > window.innerWidth || e.y > window.innerHeight)
      throw Error(
        `${t}在视口之外（${Math.round(e.x)},${Math.round(e.y)} 超出 ${window.innerWidth}x${window.innerHeight}），已取消拖拽以免点到其它元素`,
      );
    return {
      x: Math.min(window.innerWidth - 1, Math.max(1, e.x)),
      y: Math.min(window.innerHeight - 1, Math.max(1, e.y)),
    };
  }

  function Le(e, t, n) {
    let { hit: r, blocked: i } = (0, __contentScope.Ke)(e, t.x, t.y);
    if (i) throw Error(`${n}被 ${r ? (0, __contentScope.N)(r) : `未知元素`} 遮挡`);
  }

  function Re(e, t, n) {
    let r = Math.max(1, n),
      i = [];
    for (let n = 1; n <= r; n += 1) {
      let a = n / r;
      i.push({
        x: e.x + (t.x - e.x) * a,
        y: e.y + (t.y - e.y) * a,
        delayMs: __contentScope.le,
      });
    }
    return i;
  }

  function ze(e, t, n, r) {
    return {
      bubbles: !0,
      cancelable: !0,
      composed: !0,
      pointerId: 1,
      pointerType: `mouse`,
      isPrimary: !0,
      buttons: r,
      button: r === 0 ? -1 : 0,
      clientX: Math.round(t),
      clientY: Math.round(n),
    };
  }

  function Be(e, t, n, r, i) {
    let a = (0, __contentScope.ze)(t, n, r, i);
    try {
      return new PointerEvent(e, a);
    } catch {
      return (0, __contentScope.j)(e, t, n, r, 0, i);
    }
  }

  async function Ve(e, t, n, r, i, a) {
    (e.dispatchEvent((0, __contentScope.Be)(`pointerdown`, e, n.x, n.y, 1)),
      e.dispatchEvent((0, __contentScope.j)(`mousedown`, e, n.x, n.y, 0, 1)));
    let o = Math.max(1, i);
    for (let i = 1; i <= o; i += 1) {
      (0, __contentScope.He)(a);
      let s = i / o,
        c = { x: n.x + (r.x - n.x) * s, y: n.y + (r.y - n.y) * s },
        l = i === o ? t : e;
      (l.dispatchEvent((0, __contentScope.Be)(`pointermove`, l, c.x, c.y, 1)),
        l.dispatchEvent((0, __contentScope.j)(`mousemove`, l, c.x, c.y, 0, 1)),
        await (0, __contentScope.w)(__contentScope.le));
    }
    ((0, __contentScope.He)(a),
      t.dispatchEvent((0, __contentScope.Be)(`pointerup`, t, r.x, r.y, 0)),
      t.dispatchEvent((0, __contentScope.j)(`mouseup`, t, r.x, r.y, 0, 0)));
  }

  function He(e) {
    if (e != null && Date.now() >= e) throw Error(`拖拽已超过执行截止时间`);
  }

  async function Ue(e, t, r = {}) {
    let i = __contentScope._,
      a = __contentScope.v === `dom` || !i || typeof chrome > `u` || !chrome.runtime?.id;
    ((0, __contentScope.He)(r.deadline),
      e.scrollIntoView({ block: `center`, inline: `center` }),
      t.scrollIntoView({ block: `nearest`, inline: `nearest` }));
    let o = await (0, __contentScope.ne)(e, r.deadline);
    (0, __contentScope.He)(r.deadline);
    let s = await (0, __contentScope.ne)(t, r.deadline);
    if (((0, __contentScope.He)(r.deadline), o.width <= 0 || o.height <= 0))
      throw Error(`拖拽起点当前不可见，无法开始拖拽`);
    if (s.width <= 0 || s.height <= 0) throw Error(`拖拽终点当前不可见，无法完成拖拽`);
    let c = (0, __contentScope.Pe)(r.fromAnchor),
      l = (0, __contentScope.Pe)(r.toAnchor),
      u = { x: (0, __contentScope.h)(o, c), y: (0, __contentScope.g)(o, c) },
      d = { x: (0, __contentScope.h)(s, l), y: (0, __contentScope.g)(s, l) },
      f = (0, __contentScope.Ie)(u, `拖拽起点`),
      p = (0, __contentScope.Ie)(d, `拖拽终点`);
    ((0, __contentScope.Le)(e, f, `拖拽起点`), (0, __contentScope.Le)(t, p, `拖拽终点`));
    let m = (0, __contentScope.Fe)(r.steps);
    if (a) return (await (0, __contentScope.Ve)(e, t, f, p, m, r.deadline), `dom`);
    let y = `data-aah-pointer-target`,
      b = e.getAttribute(y),
      x = t.getAttribute(y),
      S = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`,
      C = `p-from-${S}`,
      ee = `p-to-${S}`;
    (e.setAttribute(y, C), t.setAttribute(y, ee));
    try {
      let e = (0, __contentScope.Re)(f, p, m),
        t = await (0, __contentScope.n)({
          type: `TRUSTED_POINTER_DRAG`,
          runId: i,
          startX: f.x,
          startY: f.y,
          points: e,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          fromTargetToken: C,
          toTargetToken: ee,
          fromAnchor: c,
          toAnchor: l,
          ...(r.deadline == null ? {} : { deadline: r.deadline }),
        });
      if (!t.ok) throw Error(`浏览器级拖拽失败：${t.error}`);
      let a = t.feature?.pointer;
      if (a?.mode !== `trusted`) throw Error(`浏览器级拖拽没有返回可信执行结果`);
      if (a.drag == null) throw Error(`浏览器级拖拽未返回执行统计`);
      return `trusted`;
    } finally {
      (e.getAttribute(y) === C && (b == null ? e.removeAttribute(y) : e.setAttribute(y, b)),
        t.getAttribute(y) === ee && (x == null ? t.removeAttribute(y) : t.setAttribute(y, x)));
    }
  }

  function We(e, t) {
    let n = document.elementFromPoint(e, t);
    for (; n?.shadowRoot;) {
      let r = n.shadowRoot.elementFromPoint(e, t);
      if (!r || r === n) break;
      n = r;
    }
    return n;
  }

  function Ge(e) {
    let t = [],
      n = e;
    for (; n;) {
      if ((t.push(n), n.parentElement)) {
        n = n.parentElement;
        continue;
      }
      let e = n.getRootNode();
      n = e instanceof ShadowRoot ? e.host : null;
    }
    return t;
  }

  function Ke(e, t, n) {
    let r = (0, __contentScope.We)(t, n);
    if (!r) return { hit: null, blocked: !0 };
    if (r === e || e.contains(r) || r.contains(e)) return { hit: r, blocked: !1 };
    for (let t of (0, __contentScope.Ge)(e)) if (t === r) return { hit: r, blocked: !1 };
    return { hit: r, blocked: !0 };
  }

  function qe(e) {
    let t = e.getBoundingClientRect();
    if (t.width === 0 || t.height === 0) return null;
    let n = t.left + t.width / 2,
      r = t.top + t.height / 2;
    if (n < 0 || r < 0 || n > window.innerWidth || r > window.innerHeight) return null;
    let { hit: i, blocked: a } = (0, __contentScope.Ke)(e, n, r);
    return a ? (i ?? null) : null;
  }

  function N(e) {
    let t = e.id ? `#${e.id}` : ``,
      n = String(e.className || ``)
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .join(`.`);
    return `${e.tagName.toLowerCase()}${t}${n ? `.${n}` : ``}`;
  }

  function Je(e) {
    let t = {
      bubbles: !0,
      cancelable: !0,
      key: `Enter`,
      code: `Enter`,
      keyCode: 13,
      which: 13,
    };
    (e.dispatchEvent(new KeyboardEvent(`keydown`, t)),
      e.dispatchEvent(new KeyboardEvent(`keypress`, t)),
      e.dispatchEvent(new KeyboardEvent(`keyup`, t)));
  }

  function Ye(e) {
    let t = {
        bubbles: !0,
        cancelable: !0,
        key: `Escape`,
        code: `Escape`,
        keyCode: 27,
        which: 27,
      },
      n = new Set();
    for (let r of e)
      r &&
        !n.has(r) &&
        (n.add(r),
        r.dispatchEvent(new KeyboardEvent(`keydown`, t)),
        r.dispatchEvent(new KeyboardEvent(`keyup`, t)));
  }

  function Qe(e) {
    return e.replace(__contentScope.Ze, (e) => __contentScope.Xe[e] ?? e);
  }

  function P(e) {
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
        ((r += __contentScope.$e.get(a) ?? ``), (t += a));
        continue;
      }
      if (a === `[`) {
        ((n = !0), (t += a));
        continue;
      }
      let o = __contentScope.$e.get(a);
      t += o ? `[${a}${o}]` : a;
    }
    return new RegExp(t, e.flags);
  }

  function et(e, t) {
    let n = (0, __contentScope.Qe)(e).toLowerCase();
    return t.filter((e) => n.includes((0, __contentScope.Qe)(e).toLowerCase()));
  }

  function I(e, t) {
    return (0, __contentScope.et)(e, t).length > 0;
  }

  function L(e) {
    let t = new Set();
    return [
      e.innerText,
      e.textContent,
      e.getAttribute(`value`),
      e.getAttribute(`aria-label`),
      e.getAttribute(`title`),
    ]
      .map((e) => (typeof e == `string` ? e.trim() : ``))
      .filter((e) => {
        if (!e) return !1;
        let n = e.replace(/\s+/g, ` `);
        return !t.has(n) && (t.add(n), !0);
      })
      .join(` `)
      .trim();
  }

  function R(e) {
    return (
      e.disabled === !0 ||
      e.getAttribute(`aria-disabled`) === `true` ||
      String(e.className ?? ``)
        .split(/\s+/)
        .filter(Boolean)
        .some((e) => !e.includes(`:`) && __contentScope.ut.test(e))
    );
  }

  function z(e = document) {
    let t = [
        `button`,
        `[role="button"]`,
        `input[type="button"]`,
        `input[type="submit"]`,
        `a[href]`,
        `[class*="btn" i]`,
        `[class*="button" i]`,
        `[onclick]`,
      ].join(`, `),
      n = [...e.querySelectorAll(t)],
      r = [...e.querySelectorAll(`div, span`)].filter((e) => {
        if (e.children.length > 2) return !1;
        let t = (e.innerText ?? ``).trim();
        return !t || t.length > 40 ? !1 : window.getComputedStyle(e).cursor === `pointer`;
      }),
      i = new Set();
    return [...n, ...r].filter((e) =>
      i.has(e) ||
      !(0, __contentScope.dt)(e) ||
      ((e.tagName.toLowerCase() === `p` || e.tagName.toLowerCase() === `span`) &&
        !e.querySelector(
          `button, a, [role="button"], input[type="button"], input[type="submit"], [onclick]`,
        ) &&
        !e.matches(`[role="button"], [onclick]`))
        ? !1
        : (i.add(e), !0),
    );
  }

  function V(e, t) {
    let n = [...t.querySelectorAll(`input`)].filter(
        (e) => !e.disabled && !e.readOnly && e.type !== `hidden` && (0, __contentScope.O)(e),
      ),
      r = n
        .map((t) => {
          let r = (0, __contentScope.Cn)(t),
            i = (0, __contentScope.Sn)(t),
            o = t.autocomplete.toLowerCase(),
            s = 0;
          return (
            (0, __contentScope.bn)(t, e) && (s += 220),
            (0, __contentScope.xn)(t, __contentScope.a) && (s += 70),
            t.type.toLowerCase() === `password` && (s += 180),
            o === `current-password` && (s += 180),
            __contentScope.on.test(r) && (s += 90),
            n.length === 1 && t.type.toLowerCase() === `password` && (s += 50),
            __contentScope.cn.test(i) && (s += 30),
            __contentScope.ln.test(i) && !__contentScope.cn.test(i) && (s -= 600),
            (o === `new-password` || __contentScope.sn.test(r)) && (s -= 600),
            __contentScope.rn.test(r) && (s -= 220),
            { element: t, score: s }
          );
        })
        .sort((e, t) => t.score - e.score)[0];
    return !r || r.score < 100
      ? null
      : {
          element: r.element,
          selector: `页面密码语义`,
          fallback: !(0, __contentScope.bn)(r.element, e),
        };
  }

  function H(e) {
    return (
      e.getAttribute(`aria-disabled`) === `true` ||
      (e instanceof HTMLButtonElement && e.disabled) ||
      (e instanceof HTMLInputElement && e.disabled)
    );
  }

  function Yg(e) {
    return `${__contentScope.qg?.runtime?.id}:auto-login:${e}`;
  }

  function Zg(e) {
    let t,
      n = !1;
    return {
      run() {
        n ||
          ((n = !0),
          (t = new URL(location.href)),
          __contentScope.Xg
            ? globalThis.navigation.addEventListener(
                `navigate`,
                (e) => {
                  let n = new URL(e.destination.url);
                  n.href !== t.href && (window.dispatchEvent(new __contentScope.Jg(n, t)), (t = n));
                },
                { signal: e.signal },
              )
            : e.setInterval(() => {
                let e = new URL(location.href);
                e.href !== t.href && (window.dispatchEvent(new __contentScope.Jg(e, t)), (t = e));
              }, 1e3));
      },
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
        },
      },
      {
        order: 15,
        run() {
          __contentState.v = `trusted`;
        },
      },
      {
        order: 16,
        run() {
          __contentState.te = 34;
        },
      },
      {
        order: 17,
        run() {
          __contentState.w = (e) => new Promise((t) => setTimeout(t, e));
        },
      },
      {
        order: 18,
        run() {
          __contentState.re = 16;
        },
      },
      {
        order: 19,
        run() {
          __contentState.ie = 120;
        },
      },
      {
        order: 20,
        run() {
          __contentState.T = new Set([
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
        order: 21,
        run() {
          __contentState.ae = new Set([`click`, `double`, `right`, `long-press`]);
        },
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
            ArrowRight: { key: `ArrowRight`, code: `ArrowRight`, keyCode: 39 },
          };
        },
      },
      {
        order: 23,
        run() {
          __contentState.se = 600;
        },
      },
      {
        order: 24,
        run() {
          __contentState.ce = 90;
        },
      },
      {
        order: 25,
        run() {
          __contentState.le = 32;
        },
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
            `label`,
          ].join(`, `);
        },
      },
      {
        order: 27,
        run() {
          __contentState.fe = /[\u200B-\u200D\u2060\uFEFF\uFE0E\uFE0F\u00AD]/g;
        },
      },
      {
        order: 28,
        run() {
          __contentState.ve = class extends Error {
            constructor(e) {
              (super(e), (this.name = `SelectorResolutionError`));
            }
          };
        },
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
            鐘: `钟`,
          };
        },
      },
      {
        order: 30,
        run() {
          __contentState.Ze = RegExp(`[${Object.keys(__contentScope.Xe).join(``)}]`, `g`);
        },
      },
      {
        order: 31,
        run() {
          __contentState.$e = new Map();
        },
      },
      {
        order: 32,
        run() {
          for (let [e, t] of Object.entries(__contentScope.Xe))
            __contentScope.$e.set(t, `${__contentScope.$e.get(t) ?? ``}${e}`);
        },
      },
      {
        order: 357,
        run() {
          __contentState.Kg = {
            debug: (...e) => ([...e], void 0),
            log: (...e) => ([...e], void 0),
            warn: (...e) => ([...e], void 0),
            error: (...e) => ([...e], void 0),
          };
        },
      },
      {
        order: 358,
        run() {
          __contentState.qg = globalThis.browser?.runtime?.id
            ? globalThis.browser
            : globalThis.chrome;
        },
      },
      {
        order: 359,
        run() {
          __contentState.Jg = class e extends Event {
            static EVENT_NAME = (0, __contentScope.Yg)(`wxt:locationchange`);
            constructor(t, n) {
              (super(e.EVENT_NAME, {}), (this.newUrl = t), (this.oldUrl = n));
            }
          };
        },
      },
      {
        order: 360,
        run() {
          __contentState.Xg = typeof globalThis.navigation?.addEventListener == `function`;
        },
      },
      {
        order: 361,
        run() {
          __contentState.Qg = class e {
            static SCRIPT_STARTED_MESSAGE_TYPE = (0, __contentScope.Yg)(
              `wxt:content-script-started`,
            );
            id;
            abortController;
            locationWatcher = (0, __contentScope.Zg)(this);
            constructor(e, t) {
              ((this.contentScriptName = e),
                (this.options = t),
                (this.id = Math.random().toString(36).slice(2)),
                (this.abortController = new AbortController()),
                this.stopOldScripts(),
                this.listenForNewerScripts());
            }
            get signal() {
              return this.abortController.signal;
            }
            abort(e) {
              return this.abortController.abort(e);
            }
            get isInvalid() {
              return (
                __contentScope.qg.runtime?.id ?? this.notifyInvalidated(),
                this.signal.aborted
              );
            }
            get isValid() {
              return !this.isInvalid;
            }
            onInvalidated(e) {
              return (
                this.signal.addEventListener(`abort`, e),
                () => this.signal.removeEventListener(`abort`, e)
              );
            }
            block() {
              return new Promise(() => {});
            }
            setInterval(e, t) {
              let n = setInterval(() => {
                this.isValid && e();
              }, t);
              return (this.onInvalidated(() => clearInterval(n)), n);
            }
            setTimeout(e, t) {
              let n = setTimeout(() => {
                this.isValid && e();
              }, t);
              return (this.onInvalidated(() => clearTimeout(n)), n);
            }
            requestAnimationFrame(e) {
              let t = requestAnimationFrame((...t) => {
                this.isValid && e(...t);
              });
              return (this.onInvalidated(() => cancelAnimationFrame(t)), t);
            }
            requestIdleCallback(e, t) {
              let n = requestIdleCallback((...t) => {
                this.signal.aborted || e(...t);
              }, t);
              return (this.onInvalidated(() => cancelIdleCallback(n)), n);
            }
            addEventListener(e, t, n, r) {
              (t === `wxt:locationchange` && this.isValid && this.locationWatcher.run(),
                e.addEventListener?.(t.startsWith(`wxt:`) ? (0, __contentScope.Yg)(t) : t, n, {
                  ...r,
                  signal: this.signal,
                }));
            }
            notifyInvalidated() {
              (this.abort(`Content script context invalidated`),
                __contentScope.Kg.debug(
                  `Content script "${this.contentScriptName}" context invalidated`,
                ));
            }
            stopOldScripts() {
              (document.dispatchEvent(
                new CustomEvent(e.SCRIPT_STARTED_MESSAGE_TYPE, {
                  detail: {
                    contentScriptName: this.contentScriptName,
                    messageId: this.id,
                  },
                }),
              ),
                this.options?.noScriptStartedPostMessage ||
                  window.postMessage(
                    {
                      type: e.SCRIPT_STARTED_MESSAGE_TYPE,
                      contentScriptName: this.contentScriptName,
                      messageId: this.id,
                    },
                    `*`,
                  ));
            }
            verifyScriptStartedEvent(e) {
              let t = e.detail?.contentScriptName === this.contentScriptName,
                n = e.detail?.messageId === this.id;
              return t && !n;
            }
            listenForNewerScripts() {
              let t = (e) => {
                e instanceof CustomEvent &&
                  this.verifyScriptStartedEvent(e) &&
                  this.notifyInvalidated();
              };
              (document.addEventListener(e.SCRIPT_STARTED_MESSAGE_TYPE, t),
                this.onInvalidated(() =>
                  document.removeEventListener(e.SCRIPT_STARTED_MESSAGE_TYPE, t),
                ));
            }
          };
        },
      },
      {
        order: 362,
        run() {
          __contentState.$g = {
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

/** 内容脚本通用支持：DOM、文本、可信指针、消息超时和扩展生命周期。 验证码子框架独立作用域。 */
export function createSharedFrameContent(__contentScope) {
  const __contentState = bindContentState(__contentScope, [
    'e',
    't',
    'n',
    'i',
    'a',
    'o',
    's',
    'c',
    'l',
    'u',
    'd',
    'f',
    'p',
    'm',
    'h',
    'g',
    '_',
    'v',
    'y',
    'b',
    'x',
    'S',
    'C',
    'w',
    'ee',
    'te',
    'T',
    'ne',
    'E',
    're',
    'D',
    'O',
    'ie',
    'ae',
  ]);
  function frame_e(e) {
    return e == null || typeof e == `function` ? { main: e } : e;
  }

  function frame_t(e) {
    if (e.type === `SLIDER_FRAME_PREPARE`) return 8e3;
    if (
      e.type === `SLIDER_FRAME_CONNECT` ||
      e.type === `SLIDER_FRAME_REPORT` ||
      e.type === `SLIDER_FRAME_STATUS` ||
      e.type === `SLIDER_FRAME_CANCEL`
    )
      return 4e3;
    if (e.type === `SCAN_LOCAL_PORTS`) {
      let t = e.withExit === !0 ? 24e3 : 8e3;
      return e.ports.length * t + 1e4;
    }
    return e.type === `TEST_PROXY` ? 34e3 : 45e3;
  }

  function frame_n(e) {
    return new Promise((n) => {
      let r = (0, __contentScope.t)(e),
        i = !1,
        a = (e) => {
          i || ((i = !0), clearTimeout(o), n(e));
        },
        o = setTimeout(() => {
          a({
            ok: !1,
            error: `后台在 ${Math.round(r / 1e3)} 秒内没有响应 ${e.type}（Service Worker 可能已被回收）`,
          });
        }, r);
      try {
        chrome.runtime.sendMessage(e, (e) => {
          chrome.runtime.lastError
            ? a({
                ok: !1,
                error: chrome.runtime.lastError.message ?? `unknown`,
              })
            : a(e ?? { ok: !0 });
        });
      } catch (e) {
        a({ ok: !1, error: e instanceof Error ? e.message : String(e) });
      }
    });
  }

  function frame_i(e) {
    return Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0.5;
  }

  function frame_a(e, t) {
    return t.kind === `inset-left`
      ? e.left + Math.min(t.px, e.width / 2)
      : t.kind === `relative`
        ? e.left + e.width * (0, __contentScope.i)(t.rx)
        : e.left + e.width / 2;
  }

  function frame_o(e, t) {
    return t.kind === `relative`
      ? e.top + e.height * (0, __contentScope.i)(t.ry)
      : e.top + e.height / 2;
  }

  function frame_u(e, t = `trusted`, n) {
    ((__contentScope.s = e), (__contentScope.c = t), (__contentScope.l = e ? n : void 0));
  }

  function frame_d() {
    return __contentScope.s;
  }

  function frame_f() {
    return __contentScope.l;
  }

  function frame_p(e, t) {
    return (
      Math.abs(e.left - t.left) > 1 ||
      Math.abs(e.top - t.top) > 1 ||
      Math.abs(e.width - t.width) > 1 ||
      Math.abs(e.height - t.height) > 1
    );
  }

  function frame_m(e) {
    if (e != null && Date.now() >= e) throw Error(`点击已超过执行截止时间`);
  }

  async function frame_h(e, t) {
    let n = e.getBoundingClientRect(),
      r = Math.min(Date.now() + 1200, t ?? 1 / 0),
      i = 0;
    for (; Date.now() < r;) {
      await (0, __contentScope.g)(Math.min(34, Math.max(1, r - Date.now())));
      let t = e.getBoundingClientRect();
      if (((0, __contentScope.p)(n, t) ? (i = 0) : (i += 1), (n = t), i >= 2)) return t;
    }
    throw ((0, __contentScope.m)(t), Error(`目标控件位置仍在变化，无法可靠点击`));
  }

  function frame_S(e) {
    if (e.gesture !== void 0 && !__contentScope.v.has(e.gesture))
      throw Error(`未知手势 ${String(e.gesture)}；只允许 click/double/right/long-press`);
    let t = e.gesture ?? `click`,
      n = null;
    if (e.key !== void 0) {
      if (!__contentScope._.has(e.key))
        throw Error(`key 只允许非打印功能键，收到 ${JSON.stringify(e.key)}`);
      n = e.key;
    }
    if (n != null && t !== `click`)
      throw Error(`key 触发与手势互斥：键盘触发不能再叠加 double/right/long-press`);
    let r =
        e.anchor == null
          ? e.insetLeftPx == null
            ? { kind: `center` }
            : { kind: `inset-left`, px: e.insetLeftPx }
          : { kind: `relative`, rx: e.anchor.rx, ry: e.anchor.ry },
      i =
        e.holdMs != null && Number.isFinite(e.holdMs)
          ? Math.max(0, Math.round(e.holdMs))
          : __contentScope.b;
    return { anchor: r, gesture: t, key: n, holdMs: i };
  }

  function frame_C(e, t, n, r = 0, i = 0) {
    return {
      bubbles: !0,
      cancelable: !0,
      view: e.ownerDocument?.defaultView ?? window,
      button: r,
      buttons: i,
      clientX: Math.round(t),
      clientY: Math.round(n),
    };
  }

  function frame_w(e, t, n, r, i = 0, a = 0) {
    let o = (0, __contentScope.C)(t, n, r, i, a);
    try {
      return new MouseEvent(e, o);
    } catch {
      let { view: t, ...n } = o;
      return new MouseEvent(e, n);
    }
  }

  function frame_ee(e, t) {
    let n = __contentScope.y[t];
    if (!n) throw Error(`key 只允许非打印功能键，收到 ${JSON.stringify(t)}`);
    typeof e.focus == `function` && e.focus();
    let r = {
      bubbles: !0,
      cancelable: !0,
      key: n.key,
      code: n.code,
      keyCode: n.keyCode,
      which: n.keyCode,
    };
    (e.dispatchEvent(new KeyboardEvent(`keydown`, r)),
      n.keyCode === 13 && e.dispatchEvent(new KeyboardEvent(`keypress`, r)),
      e.dispatchEvent(new KeyboardEvent(`keyup`, r)));
  }

  async function frame_te(e, t, n, r, i) {
    if (r === `double`) {
      for (let r = 0; r < 2; r += 1)
        (e.dispatchEvent((0, __contentScope.w)(`mousedown`, e, t, n, 0, 1)),
          e.dispatchEvent((0, __contentScope.w)(`mouseup`, e, t, n, 0, 0)),
          typeof e.click == `function`
            ? e.click()
            : e.dispatchEvent((0, __contentScope.w)(`click`, e, t, n, 0, 0)),
          r === 0 && (await (0, __contentScope.g)(__contentScope.x)));
      e.dispatchEvent((0, __contentScope.w)(`dblclick`, e, t, n, 0, 0));
    } else
      r === `right`
        ? (e.dispatchEvent((0, __contentScope.w)(`mousedown`, e, t, n, 2, 2)),
          e.dispatchEvent((0, __contentScope.w)(`contextmenu`, e, t, n, 2, 2)),
          e.dispatchEvent((0, __contentScope.w)(`mouseup`, e, t, n, 2, 0)))
        : r === `long-press`
          ? (e.dispatchEvent((0, __contentScope.w)(`mousedown`, e, t, n, 0, 1)),
            await (0, __contentScope.g)(i),
            e.dispatchEvent((0, __contentScope.w)(`mouseup`, e, t, n, 0, 0)),
            typeof e.click == `function`
              ? e.click()
              : e.dispatchEvent((0, __contentScope.w)(`click`, e, t, n, 0, 0)))
          : (0, __contentScope.ne)(e);
  }

  function frame_T(e, t) {
    let n = { bubbles: !0, cancelable: !0 };
    try {
      return new MouseEvent(e, {
        ...n,
        view: t.ownerDocument?.defaultView ?? window,
      });
    } catch {
      return new MouseEvent(e, n);
    }
  }

  function frame_ne(e) {
    (e.dispatchEvent((0, __contentScope.T)(`mousedown`, e)),
      e.dispatchEvent((0, __contentScope.T)(`mouseup`, e)),
      typeof e.click == `function`
        ? e.click()
        : e.dispatchEvent((0, __contentScope.T)(`click`, e)));
  }

  async function frame_E(e, t = {}) {
    let r = __contentScope.s,
      i = __contentScope.c === `dom` || !r || typeof chrome > `u` || !chrome.runtime?.id;
    if (i && t.targetSeenAt != null && Number.isFinite(t.targetSeenAt)) {
      let e = t.targetSeenAt + 15e3 - Date.now();
      if (e > 0) {
        if (t.deadline != null && Date.now() + e >= t.deadline)
          throw Error(`验证控件安全窗口会超过执行截止时间，已取消点击`);
        await (0, __contentScope.g)(e);
      }
    }
    ((0, __contentScope.m)(t.deadline), e.scrollIntoView({ block: `center`, inline: `center` }));
    let u = await (0, __contentScope.h)(e, t.deadline);
    if (((0, __contentScope.m)(t.deadline), u.width <= 0 || u.height <= 0))
      throw Error(`目标控件当前不可见，无法点击`);
    let d = u.top + u.height / 2,
      f = u.left + u.width / 2;
    if (d < 0 || d > window.innerHeight || f < 0 || f > window.innerWidth)
      throw Error(
        `目标控件在视口之外（滚动后位置 ${Math.round(u.left)},${Math.round(u.top)} 超出视口 ${window.innerWidth}x${window.innerHeight}），已取消点击以免点到其它元素`,
      );
    let { anchor: p, gesture: _, key: v, holdMs: y } = (0, __contentScope.S)(t),
      b = (e) => e !== `click`,
      x = Math.min(window.innerWidth - 1, Math.max(1, (0, __contentScope.a)(u, p))),
      C = Math.min(window.innerHeight - 1, Math.max(1, (0, __contentScope.o)(u, p)));
    if (t.debugVisualize) {
      let e = document.createElement(`div`);
      ((e.style.cssText = `
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
    `),
        document.body.appendChild(e));
      try {
        if (t.deadline != null && Date.now() + 2e3 >= t.deadline)
          throw Error(`调试标记等待会超过执行截止时间，已取消点击`);
        await (0, __contentScope.g)(2e3);
      } finally {
        e.remove();
      }
      (0, __contentScope.m)(t.deadline);
    }
    let { hit: w, blocked: T } = (0, __contentScope.ie)(e, x, C);
    if (T) throw Error(`目标控件被 ${w ? (0, __contentScope.ae)(w) : `未知元素`} 遮挡`);
    if (i)
      return (
        (0, __contentScope.m)(t.deadline),
        v == null
          ? _ === `click`
            ? ((0, __contentScope.ne)(e), `dom`)
            : (await (0, __contentScope.te)(e, x, C, _, y), `dom`)
          : ((0, __contentScope.ee)(e, v), `dom`)
      );
    if (v != null) return ((0, __contentScope.m)(t.deadline), (0, __contentScope.ee)(e, v), `dom`);
    if (_ !== `click` && !b(_))
      throw Error(
        `${(0, __contentScope.re)(_)}需要浏览器级指针通道，当前页面没有可信指针接线，已取消执行（不降级为普通单击）`,
      );
    let E = `data-aah-pointer-target`,
      D = e.getAttribute(E),
      O = `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    e.setAttribute(E, O);
    try {
      (0, __contentScope.m)(t.deadline);
      let e = await (0, __contentScope.n)({
        type: `TRUSTED_POINTER_CLICK`,
        runId: r,
        ...(__contentScope.l ? { frameSessionId: __contentScope.l } : {}),
        x,
        y: C,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        targetToken: O,
        anchor: p,
        ...(_ === `click` ? {} : { gesture: _ }),
        ...(_ === `long-press` ? { holdMs: y } : {}),
        ...(v == null ? {} : { key: v }),
        ...(t.targetSeenAt == null ? {} : { targetSeenAt: t.targetSeenAt }),
        ...(t.deadline == null ? {} : { deadline: t.deadline }),
      });
      if (!e.ok) {
        if (
          t.mayNavigate &&
          t.reconcileAfterLostResponse &&
          (e.error.includes(`没有响应 TRUSTED_POINTER_CLICK`) ||
            e.error.includes(`点击结果可能未知`))
        )
          return `trusted`;
        throw Error(`浏览器级鼠标点击失败：${e.error}`);
      }
      if (e.feature?.pointer?.mode !== `trusted`) {
        if (t.mayNavigate) return `trusted`;
        throw Error(`浏览器级鼠标点击没有返回可信执行结果`);
      }
      let i = e.feature.pointer;
      if ((t.onPointerResult?.(i), i.clickObserved === !1)) {
        if (t.shadowTarget) return `trusted`;
        throw Error(`浏览器级鼠标事件未到达目标控件`);
      }
      if (i.clickObserved == null && !t.mayNavigate)
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
    for (; n?.shadowRoot;) {
      let r = n.shadowRoot.elementFromPoint(e, t);
      if (!r || r === n) break;
      n = r;
    }
    return n;
  }

  function frame_O(e) {
    let t = [],
      n = e;
    for (; n;) {
      if ((t.push(n), n.parentElement)) {
        n = n.parentElement;
        continue;
      }
      let e = n.getRootNode();
      n = e instanceof ShadowRoot ? e.host : null;
    }
    return t;
  }

  function frame_ie(e, t, n) {
    let r = (0, __contentScope.D)(t, n);
    if (!r) return { hit: null, blocked: !0 };
    if (r === e || e.contains(r) || r.contains(e)) return { hit: r, blocked: !1 };
    for (let t of (0, __contentScope.O)(e)) if (t === r) return { hit: r, blocked: !1 };
    return { hit: r, blocked: !0 };
  }

  function frame_ae(e) {
    let t = e.id ? `#${e.id}` : ``,
      n = String(e.className || ``)
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .join(`.`);
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
        },
      },
      {
        order: 1,
        run() {
          __contentState.c = `trusted`;
        },
      },
      {
        order: 2,
        run() {
          __contentState.g = (e) => new Promise((t) => setTimeout(t, e));
        },
      },
      {
        order: 3,
        run() {
          __contentState._ = new Set([
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
        order: 4,
        run() {
          __contentState.v = new Set([`click`, `double`, `right`, `long-press`]);
        },
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
            ArrowRight: { key: `ArrowRight`, code: `ArrowRight`, keyCode: 39 },
          };
        },
      },
      {
        order: 6,
        run() {
          __contentState.b = 600;
        },
      },
      {
        order: 7,
        run() {
          __contentState.x = 90;
        },
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
            `label`,
          ].join(`, `);
        },
      },
    ],
  };
}
