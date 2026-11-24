/** 共用后台平台：Chrome 存储、串行事务、可信指针与标签页薄适配。 */
import { bgAccountsState } from '../modules/accounts/service.js';
import { bgCheckinState } from '../modules/checkin/service.js';

export const bgPlatformState = { store: {} };

function l(e) {
  return typeof e == `object` && !!e && !Array.isArray(e);
}

function Ci(e = new Date()) {
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`;
}

function Ti(e = ``) {
  let t = Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  return e ? `${e}-${t}` : t;
}

function na(e, t) {
  let n = (bgPlatformState.ea.get(e) ?? Promise.resolve()).then(t, t);
  return (
    bgPlatformState.ea.set(
      e,
      n.then(
        () => void 0,
        () => void 0,
      ),
    ),
    n
  );
}

function ra() {
  let e = globalThis.navigator?.locks;
  return typeof e?.request == `function` ? e : void 0;
}

function ia(e, t) {
  let n = ra();
  return n ? na(e, async () => await n.request(e, { mode: `exclusive` }, () => t())) : na(e, t);
}

function R(e) {
  return ia(bgPlatformState.ta.APP_DATA, e);
}

async function ic(e) {
  let t;
  try {
    return await Promise.race([
      e,
      new Promise((e, n) => {
        t = setTimeout(() => n(Error(`验证码内嵌页面读取超时`)), 4e3);
      }),
    ]);
  } finally {
    t && clearTimeout(t);
  }
}

async function ac(e, t, n = []) {
  let r = (
    await ic(
      chrome.scripting.executeScript({
        target: { tabId: e, frameIds: [0] },
        func: (e, t, n) => {
          let r = document.querySelector(`[data-aah-pointer-target="${e}"]`);
          if (!(r instanceof HTMLIFrameElement) || !r.isConnected || r.src !== t) return null;
          let i = r;
          for (; i;) {
            let e = getComputedStyle(i);
            if (
              e.display === `none` ||
              e.visibility !== `visible` ||
              Number.parseFloat(e.opacity || `1`) <= 0.02
            )
              return null;
            if (e.transform !== `none`) {
              let t = new DOMMatrixReadOnly(e.transform);
              if (!t.is2D || Math.abs(t.b) > 0.001 || Math.abs(t.c) > 0.001 || t.a <= 0 || t.d <= 0)
                return null;
            }
            i = i.parentElement;
          }
          let a = r.getBoundingClientRect();
          if (a.width < 100 || a.height < 70 || !r.offsetWidth || !r.offsetHeight) return null;
          let o = a.width / r.offsetWidth,
            s = a.height / r.offsetHeight,
            c = a.left + r.clientLeft * o,
            l = a.top + r.clientTop * s,
            u = r.clientWidth * o,
            d = r.clientHeight * s,
            f = n.map((e) => {
              if (![e.x, e.y].every(Number.isFinite) || e.x < 0 || e.x > 1 || e.y < 0 || e.y > 1)
                return !1;
              let t = c + e.x * u,
                n = l + e.y * d;
              return (
                t >= 1 &&
                n >= 1 &&
                t < innerWidth - 1 &&
                n < innerHeight - 1 &&
                document.elementFromPoint(t, n) === r
              );
            });
          return {
            x: c,
            y: l,
            width: u,
            height: d,
            viewportWidth: innerWidth,
            viewportHeight: innerHeight,
            devicePixelRatio: devicePixelRatio || 1,
            pointHits: f,
          };
        },
        args: [t.frameToken, t.frameUrl, n],
      }),
    )
  )[0]?.result;
  if (!r) throw Error(`验证码 iframe 已隐藏、重建或发生无法换算的变形`);
  if (r.pointHits.some((e) => !e)) throw Error(`验证码 iframe 的图片或把手被外层弹窗遮挡`);
  return r;
}

function oc(e, t, n) {
  let r = e.width / t,
    i = e.height / n;
  if (![r, i].every((e) => Number.isFinite(e) && e >= 0.2 && e <= 5))
    throw Error(`验证码 iframe 的视口缩放比例无效`);
  return { x: r, y: i };
}

function sc(e, t, n) {
  return { x: t.x + e.x * n.x, y: t.y + e.y * n.y, width: e.width * n.x, height: e.height * n.y };
}

async function cc(e, t, n, r) {
  let i = (
    await ic(
      chrome.scripting.executeScript({
        target: t.documentId
          ? { tabId: e, documentIds: [t.documentId] }
          : { tabId: e, frameIds: [t.frameId] },
        func: (e, t, n) => {
          if (location.href !== n) return null;
          let r = document.querySelector(`[data-aah-pointer-target="${e}"]`);
          if (!r?.isConnected) return null;
          let i = r.getBoundingClientRect();
          if (i.width < 2 || i.height < 2) return null;
          let a = i.left + (t.kind === `inset-left` ? Math.min(t.px, i.width / 2) : i.width / 2),
            o = i.top + i.height / 2;
          if (a < 1 || o < 1 || a >= innerWidth - 1 || o >= innerHeight - 1) return null;
          let s = document.elementFromPoint(a, o);
          return !s || !(s === r || r.contains(s))
            ? null
            : {
                x: a,
                y: o,
                rect: { x: i.x, y: i.y, width: i.width, height: i.height },
                viewportWidth: innerWidth,
                viewportHeight: innerHeight,
              };
        },
        args: [n, r, t.frameUrl],
      }),
    )
  )[0]?.result;
  if (!i) return null;
  let a = await ac(e, t, [{ x: i.x / i.viewportWidth, y: i.y / i.viewportHeight }]),
    o = oc(a, i.viewportWidth, i.viewportHeight),
    s = sc(i.rect, a, o);
  return {
    x: a.x + i.x * o.x,
    y: a.y + i.y * o.y,
    rect: { left: s.x, top: s.y, width: s.width, height: s.height },
    hit: !0,
    withinHost: !0,
  };
}

function uc(e, t, n) {
  return Math.min(n, Math.max(t, e));
}

function dc(e, t, n, r, i) {
  let a = 1 - i,
    o = a ** 3,
    s = 3 * a ** 2 * i,
    c = 3 * a * i ** 2,
    l = i ** 3;
  return { x: o * e.x + s * t.x + c * n.x + l * r.x, y: o * e.y + s * t.y + c * n.y + l * r.y };
}

function fc(e, t, n = Math.random) {
  let r = t.x - e.x,
    i = t.y - e.y,
    a = Math.max(1, Math.hypot(r, i)),
    o = uc(Math.round(a / 24) + 10, 12, 30),
    s = -i / a,
    c = r / a,
    l = (n() - 0.5) * Math.min(120, a * 0.42),
    u = { x: e.x + r * 0.32 + s * l, y: e.y + i * 0.32 + c * l },
    d = { x: e.x + r * 0.72 - s * l * 0.35, y: e.y + i * 0.72 - c * l * 0.35 },
    f = [];
  for (let r = 1; r <= o; r += 1) {
    let i = r / o,
      a = dc(e, u, d, t, i),
      s = (1 - i) * 0.7;
    f.push({ x: a.x + (n() - 0.5) * s, y: a.y + (n() - 0.5) * s });
  }
  return ((f[f.length - 1] = { ...t }), f);
}

function pc(e, t) {
  let n = (90 + t() * 230) * (t() < 0.5 ? -1 : 1),
    r = (55 + t() * 170) * (t() < 0.5 ? -1 : 1);
  return { x: uc(e.x + n, 1, e.viewportWidth - 1), y: uc(e.y + r, 1, e.viewportHeight - 1) };
}

function mc(e) {
  if (![e.x, e.y, e.viewportWidth, e.viewportHeight].every(Number.isFinite))
    throw Error(`鼠标坐标不是有效数字`);
  if (e.viewportWidth < 2 || e.viewportHeight < 2) throw Error(`页面视口尺寸无效`);
  if (e.x < 0 || e.y < 0 || e.x > e.viewportWidth || e.y > e.viewportHeight)
    throw Error(`目标坐标不在当前视口内`);
  if (!/^p-[a-z0-9-]{8,80}$/i.test(e.targetToken)) throw Error(`目标控件标记无效`);
  if (e.targetSeenAt != null && (!Number.isFinite(e.targetSeenAt) || e.targetSeenAt < 0))
    throw Error(`目标控件出现时间无效`);
  if (e.deadline != null && (!Number.isFinite(e.deadline) || e.deadline < 0))
    throw Error(`可信点击截止时间无效`);
  if ((bc(e), e.inputAssertions)) {
    if (e.inputAssertions.length > 4) throw Error(`点击前输入核对项过多`);
    for (let t of e.inputAssertions)
      if (!t.selector || t.selector.length > 256 || typeof t.value != `string`)
        throw Error(`点击前输入核对项无效`);
  }
}

function bc(e) {
  let t = e.gesture ?? `click`;
  if (!bgPlatformState.yc.has(t)) throw Error(`未知手势 ${String(e.gesture)}`);
  let n = e.holdMs;
  return {
    gesture: t,
    holdMs:
      n != null && Number.isFinite(n)
        ? Math.min(bgPlatformState._c, Math.max(0, Math.round(n)))
        : bgPlatformState.gc,
  };
}

function Ec(e) {
  return Error(`可信点击阶段「${e}」超时（点击结果可能未知）`);
}

function Dc(e, t, n, r = bgPlatformState.xc) {
  let i = t - Date.now();
  if (i <= 0) return Promise.reject(Ec(n));
  let a;
  try {
    a = Promise.resolve(e());
  } catch (e) {
    return Promise.reject(e);
  }
  return new Promise((e, t) => {
    let o = !1,
      s = setTimeout(
        () => {
          o || ((o = !0), t(Ec(n)));
        },
        Math.min(r, i),
      );
    a.then(
      (t) => {
        o || ((o = !0), clearTimeout(s), e(t));
      },
      (e) => {
        o || ((o = !0), clearTimeout(s), t(e));
      },
    );
  });
}

function G(e, t, n, r) {
  return Dc(
    () => (n === void 0 ? chrome.debugger.sendCommand(e, t) : chrome.debugger.sendCommand(e, t, n)),
    r,
    `CDP ${t}`,
  );
}

async function Oc(e, t) {
  try {
    await Dc(e, Date.now() + bgPlatformState.Sc, t, bgPlatformState.Sc);
  } catch {}
}

async function kc(e, t, n) {
  return (
    (
      await G(
        e,
        `Runtime.evaluate`,
        {
          expression: `(() => {
      const assertions = ${JSON.stringify(t)};
      return assertions.every(({ selector, value }) => {
        const input = document.querySelector(selector);
        return input instanceof HTMLInputElement && input.value === value;
      });
    })()`,
          returnByValue: !0,
        },
        n,
      )
    ).result?.value === !0
  );
}

function K(e) {
  if (e != null && Date.now() >= e) throw Error(`可信点击已超过执行截止时间`);
}

async function Ac(e, t) {
  if (t != null && Date.now() + e >= t) throw Error(`可信点击剩余时间不足，已取消按压`);
  (await bgPlatformState.q(e), K(t));
}

async function Mc(e, t, n) {
  return (
    (
      await G(
        e,
        `Runtime.evaluate`,
        {
          expression: `(() => {
      /* 影子根里的目标：document.querySelector 看不到，必须在每个影子根里继续查找。 */
      const findDeep = (root) => {
        const direct = root.querySelector('[data-aah-pointer-target="${t}"]');
        if (direct) return direct;
        for (const host of root.querySelectorAll('*')) {
          if (!host.shadowRoot) continue;
          const found = findDeep(host.shadowRoot);
          if (found) return found;
        }
        return null;
      };
      const el = findDeep(document);
      if (!el) return false;
      const root = globalThis;
      const probes = root.${bgPlatformState.jc} || (root.${bgPlatformState.jc} = Object.create(null));
      const events = [];
      const handler = (event) => {
        /*
           * 影子根里的目标必须看穿透链。
           *
           * 影子树内发生的事件到达 document 监听器时 target 会被**重定向成宿主**：
           * 宿主既不等于目标、也不 contains 目标，于是探针一个事件都收不到，
           * 可信指针通道报「鼠标事件未到达目标控件」—— 而点击其实已经落下。
           * composedPath() 是事件的方法，它还原被重定向掉的真实路径。
           */
        const path = typeof event.composedPath === 'function' ? event.composedPath() : [event.target];
        const eventTarget = event.target;
        if (path.includes(el) || eventTarget === el || (eventTarget instanceof Node && el.contains(eventTarget))) {
          events.push({
            type: event.type,
            trusted: event.isTrusted === true,
            // screenX/screenY 与 clientX/clientY 的差值应等于窗口左边距与浏览器界面
            // 高度。Turnstile 会核对这个偏移；调试器信息栏改变界面高度后，CDP 若按
            // 旧偏移填值就会对不上，这是目前唯一还没排除的拒发原因。
            screenX: event.screenX,
            screenY: event.screenY,
            clientX: event.clientX,
            clientY: event.clientY,
          });
        }
      };
      const types = ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click', 'contextmenu'];
      for (const type of types) document.addEventListener(type, handler, true);
      probes['${t}'] = {
        events,
        handler,
        types,
        geometry: {
          screenLeft: window.screenLeft,
          screenTop: window.screenTop,
          outerWidth: window.outerWidth,
          innerWidth: window.innerWidth,
          outerHeight: window.outerHeight,
          innerHeight: window.innerHeight,
          dpr: window.devicePixelRatio,
        },
      };
      return true;
    })()`,
          returnByValue: !0,
        },
        n,
      )
    ).result?.value === !0
  );
}

async function Nc(e, t, n) {
  return (
    (
      await G(
        e,
        `Runtime.evaluate`,
        {
          expression: `(() => {
      const probes = globalThis.${bgPlatformState.jc};
      const probe = probes && probes['${t}'];
      if (!probe) return null;
      for (const type of probe.types) document.removeEventListener(type, probe.handler, true);
      delete probes['${t}'];

      const down = probe.events.find((e) => e.type === 'mousedown') || probe.events[0];
      const g = probe.geometry || {};
      const sideBorder = Math.max(0, ((g.outerWidth || 0) - (g.innerWidth || 0)) / 2);
      const topChrome = Math.max(0, (g.outerHeight || 0) - (g.innerHeight || 0) - sideBorder);
      return {
        clickObserved: probe.events.some((e) => e.type === 'click' && e.trusted === true),
        contextmenuObserved: probe.events.some((e) => e.type === 'contextmenu' && e.trusted === true),
        offsetActual: down && down.screenX != null
          ? { dx: down.screenX - down.clientX, dy: down.screenY - down.clientY }
          : undefined,
        offsetExpected: {
          dx: Math.round((g.screenLeft || 0) + sideBorder),
          dy: Math.round((g.screenTop || 0) + topChrome),
        },
      };
    })()`,
          returnByValue: !0,
        },
        n,
      )
    ).result?.value ?? null
  );
}

async function Pc(e, t, n, r, i) {
  return i && e.tabId != null
    ? Dc(
        () => cc(e.tabId, i, t, n),
        r ?? Date.now() + bgPlatformState.xc,
        `验证码 iframe 目标重采样`,
      )
    : ((
        await G(
          e,
          `Runtime.evaluate`,
          {
            expression: `(() => {
      /* 影子根里的目标：document.querySelector 看不到，必须在每个影子根里继续查找。 */
      const findDeep = (root) => {
        const direct = root.querySelector('[data-aah-pointer-target="${t}"]');
        if (direct) return direct;
        for (const host of root.querySelectorAll('*')) {
          if (!host.shadowRoot) continue;
          const found = findDeep(host.shadowRoot);
          if (found) return found;
        }
        return null;
      };
      const el = findDeep(document);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      const x = Math.min(innerWidth - 1, Math.max(1, ${bgAccountsState.Wr(n)}));
      const y = Math.min(innerHeight - 1, Math.max(1, rect.top + rect.height / 2));
      /*
       * 穿透影子根取真实命中元素。
       *
       * elementFromPoint 只返回外部文档树节点：目标在影子根里时拿到的是宿主，
       * 于是 hit / withinHost 双双为 false，可信指针通道直接抛「鼠标移动过程中
       * 发生位移或被遮挡」—— 而目标就在那里、也点得到。逐层进宿主影子根重做命中
       * 测试即可拿到真目标（Element 没有 composedPath，那是 Event 的方法）。
       */
      let hit = document.elementFromPoint(x, y);
      while (hit && hit.shadowRoot) {
        const deeper = hit.shadowRoot.elementFromPoint(x, y);
        if (!deeper || deeper === hit) break;
        hit = deeper;
      }
      return {
        x,
        y,
        rect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
        hit: !!hit && (hit === el || el.contains(hit) || hit.contains(el)),
        withinHost: !!hit && (hit === el || el.contains(hit) || hit.contains(el)),
      };
    })()`,
            returnByValue: !0,
          },
          r ?? Date.now() + bgPlatformState.xc,
        )
      ).result?.value ?? null);
}

function zc(e) {
  let t = new Map();
  for (let n = 0; n + 1 < (e?.length ?? 0); n += 2) t.set(e[n].toLowerCase(), e[n + 1] ?? ``);
  return t;
}

async function Bc(e, t, n, r, i) {
  let a = i ?? Date.now() + bgPlatformState.xc;
  try {
    let i;
    try {
      i = await G(
        e,
        `DOM.getNodeForLocation`,
        { x: Math.round(t), y: Math.round(n), includeUserAgentShadowDOM: !0 },
        a,
      );
    } catch {
      i = await G(e, `DOM.getNodeForLocation`, { x: Math.round(t), y: Math.round(n) }, a);
    }
    if (i.frameId && r && i.frameId !== r)
      return {
        signal: `inner-frame`,
        identity: `frame:${i.frameId}:node:${i.backendNodeId ?? `unknown`}`,
      };
    if (!i.backendNodeId) return null;
    let o = (
      await G(e, `DOM.describeNode`, { backendNodeId: i.backendNodeId, depth: 0, pierce: !0 }, a)
    ).node;
    if (!o) return null;
    if (o.frameId && r && o.frameId !== r)
      return { signal: `inner-frame`, identity: `frame:${o.frameId}:node:${i.backendNodeId}` };
    let s = (o.localName || o.nodeName || ``).toLowerCase(),
      c = zc(o.attributes),
      l = `${c.get(`src`) ?? ``} ${o.documentURL ?? ``}`;
    return /challenges\.cloudflare\.com|turnstile/i.test(l)
      ? {
          signal: `inner-frame`,
          identity: `frame:${o.frameId ?? `unknown`}:node:${i.backendNodeId}`,
        }
      : (s === `input` && c.get(`type`)?.toLowerCase() === `checkbox`) ||
          c.get(`role`)?.toLowerCase() === `checkbox`
        ? { signal: `interactive-control`, identity: `node:${i.backendNodeId}` }
        : null;
  } catch {
    return null;
  }
}

async function Vc(e, t, n, r, i) {
  K(i);
  let a = Date.now(),
    o = r != null && r <= a + 1e3 ? r : a,
    s = o + bgPlatformState.Fc,
    c = o + bgPlatformState.Ic,
    l = await G(e, `Page.getFrameTree`, void 0, i ?? Date.now() + bgPlatformState.xc).catch(
      () => null,
    );
  K(i);
  let u = l?.frameTree?.frame?.id,
    d = null,
    f = null,
    p = 0;
  for (;;) {
    K(i);
    let r = await Pc(e, t, n, i ?? Date.now() + bgPlatformState.xc);
    if ((K(i), !r)) throw Error(`Turnstile 宿主在成熟检查期间已重绘或消失`);
    let l = await Bc(e, r.x, r.y, u, i);
    K(i);
    let m = Date.now(),
      h = l?.signal ?? null,
      g = l?.identity ?? null;
    if (
      ((h !== d || g !== f) && ((d = h), (f = g), (p = l ? m : 0)),
      l && m >= s && p > 0 && m - p >= bgPlatformState.Lc)
    )
      return (K(i), { signal: l.signal, waitedMs: m - a, widgetAgeMs: Math.max(0, m - o) });
    if (m >= c)
      return (K(i), { signal: `safety-window`, waitedMs: m - a, widgetAgeMs: Math.max(0, m - o) });
    let _ = Math.min(bgPlatformState.Rc, Math.max(1, Math.min(c, i ?? 1 / 0) - m));
    if (i != null && m + _ >= i) throw Error(`Turnstile 成熟等待已达到执行截止时间`);
    await bgPlatformState.q(_);
  }
}

async function Hc(e, t, n = Math.random, r = {}) {
  mc(t);
  let i = Math.min(t.deadline ?? 1 / 0, Date.now() + bgPlatformState.hc);
  K(i);
  let a = { tabId: e },
    o = { x: t.x, y: t.y },
    s = fc(bgPlatformState.lc.get(e) ?? pc(t, n), o, n),
    c = !1,
    l = !1,
    u = !1,
    d = !1,
    f = !1,
    p = o,
    m;
  try {
    (K(i),
      (c = !0),
      await Dc(() => chrome.debugger.attach(a, `1.3`), i, `debugger.attach`),
      (l = !0),
      await G(a, `Page.bringToFront`, void 0, i),
      await G(a, `Input.setIgnoreInputEvents`, { ignore: !1 }, i));
    let h = t.anchor ?? { kind: `center` };
    (h.kind === `inset-left` && (m = await Vc(a, t.targetToken, h, t.targetSeenAt, i)),
      K(i),
      (u = !t.frameTarget && (await Mc(a, t.targetToken, i))),
      await Ac(45 + Math.round(n() * 35), i));
    for (let e of s)
      (K(i),
        await G(
          a,
          `Input.dispatchMouseEvent`,
          { type: `mouseMoved`, x: e.x, y: e.y, buttons: 0, pointerType: `mouse` },
          i,
        ),
        await Ac(6 + Math.round(n() * 9), i));
    let g = await Pc(a, t.targetToken, h, i, t.frameTarget);
    K(i);
    let _ = h.kind === `inset-left`;
    if (!g || (!g.hit && !(_ && g.withinHost)))
      throw Error(`目标控件在鼠标移动过程中发生位移或被遮挡`);
    let v = { x: g.x, y: g.y },
      y = Math.hypot(v.x - o.x, v.y - o.y),
      b = y > 1 ? uc(Math.ceil(y / 12), 3, 10) : 0;
    for (let e = 1; e <= b; e += 1) {
      K(i);
      let t = e / b,
        r = { x: o.x + (v.x - o.x) * t, y: o.y + (v.y - o.y) * t };
      (await G(
        a,
        `Input.dispatchMouseEvent`,
        { type: `mouseMoved`, x: r.x, y: r.y, buttons: 0, pointerType: `mouse` },
        i,
      ),
        await Ac(8 + Math.round(n() * 7), i));
    }
    if (
      (await Ac(25 + Math.round(n() * 55), i),
      K(i),
      t.inputAssertions?.length && !(await kc(a, t.inputAssertions, i)))
    )
      throw Error(`登录输入在鼠标按下前发生变化，已取消点击`);
    let { gesture: x, holdMs: S } = bc(t),
      C = x === `double` ? 2 : 1,
      w = x === `right` ? `right` : `left`;
    p = v;
    let T = async (e) => {
      (await G(
        a,
        `Input.dispatchMouseEvent`,
        {
          type: `mousePressed`,
          x: v.x,
          y: v.y,
          button: w,
          buttons: x === `right` ? 2 : 1,
          clickCount: e,
          pointerType: `mouse`,
        },
        i,
      ),
        (f = !0),
        await Ac(x === `long-press` ? S : 45 + Math.round(n() * 65), i),
        await G(
          a,
          `Input.dispatchMouseEvent`,
          {
            type: `mouseReleased`,
            x: v.x,
            y: v.y,
            button: w,
            buttons: 0,
            clickCount: e,
            pointerType: `mouse`,
          },
          i,
        ),
        (f = !1));
    };
    (await T(C),
      x === `double` && (await Ac(bgPlatformState.vc, i), await T(2)),
      await bgPlatformState.q(90 + Math.round(n() * 70)));
    let E = u
      ? await Nc(a, t.targetToken, Math.min(i, Date.now() + bgPlatformState.Sc)).catch(() => null)
      : null;
    if (
      ((d = !0),
      E?.clickObserved !== !1 && r.afterClick && (await Dc(r.afterClick, i, `点击后状态写入`)),
      E?.offsetActual && E?.offsetExpected)
    ) {
      let e = E.offsetActual,
        t = E.offsetExpected,
        n = Math.abs(e.dx - t.dx) <= 8 && Math.abs(e.dy - t.dy) <= 8;
      console.log(
        `[TrustedPointer] screenOffset: actual dx=${e.dx} dy=${e.dy}  expected dx=${t.dx} dy=${t.dy}  ${n ? `✓ match` : `✗ MISMATCH — infobar height shift`}`,
      );
    }
    bgPlatformState.lc.set(e, v);
    let D =
        E?.offsetActual && E?.offsetExpected
          ? {
              actual: E.offsetActual,
              expected: E.offsetExpected,
              matches:
                Math.abs(E.offsetActual.dx - E.offsetExpected.dx) <= 8 &&
                Math.abs(E.offsetActual.dy - E.offsetExpected.dy) <= 8,
            }
          : void 0,
      O = x === `right` ? (E?.contextmenuObserved ?? null) : (E?.clickObserved ?? null);
    return {
      mode: `trusted`,
      pathPoints: s.length + b,
      clickObserved: O,
      target: g,
      screenOffset: D,
      turnstileReadiness: m,
    };
  } finally {
    (l &&
      f &&
      ((f = !1),
      await Oc(
        () =>
          chrome.debugger.sendCommand(a, `Input.dispatchMouseEvent`, {
            type: `mouseReleased`,
            x: p.x,
            y: p.y,
            button: `left`,
            buttons: 0,
            clickCount: 1,
            pointerType: `mouse`,
          }),
        `中断后补发 mouseReleased`,
      )),
      l &&
        u &&
        !d &&
        (await Nc(a, t.targetToken, Date.now() + bgPlatformState.Sc).catch(() => null)),
      c && (await Oc(() => chrome.debugger.detach(a), `debugger.detach`)));
  }
}

function Uc(e) {
  if (![e.x, e.y, e.viewportWidth, e.viewportHeight, e.deltaY].every(Number.isFinite))
    throw Error(`滚动参数不是有效数字`);
  if (e.viewportWidth < 2 || e.viewportHeight < 2) throw Error(`页面视口尺寸无效`);
  if (e.x < 0 || e.y < 0 || e.x > e.viewportWidth || e.y > e.viewportHeight)
    throw Error(`滚动坐标不在当前视口内`);
  if (Math.abs(e.deltaY) < 1 || Math.abs(e.deltaY) > 2e4) throw Error(`滚动距离超出允许范围`);
  if (e.steps != null && (!Number.isInteger(e.steps) || e.steps < 1 || e.steps > 12))
    throw Error(`滚动分段数超出允许范围`);
}

async function Wc(e, t, n = Math.random) {
  Uc(t);
  let r = t.steps ?? uc(Math.ceil(Math.abs(t.deltaY) / 240), 3, 8),
    i = { tabId: e },
    a = Date.now() + bgPlatformState.Cc,
    o = !1;
  try {
    ((o = !0),
      await Dc(() => chrome.debugger.attach(i, `1.3`), a, `debugger.attach`),
      await G(i, `Page.bringToFront`, void 0, a),
      await G(i, `Input.setIgnoreInputEvents`, { ignore: !1 }, a));
    let s = fc(bgPlatformState.lc.get(e) ?? { x: t.x, y: t.y }, { x: t.x, y: t.y }, n);
    for (let e of s)
      (await G(
        i,
        `Input.dispatchMouseEvent`,
        { type: `mouseMoved`, x: e.x, y: e.y, buttons: 0, pointerType: `mouse` },
        a,
      ),
        await bgPlatformState.q(5 + Math.round(n() * 8)));
    let c = t.deltaY / r;
    for (let e = 0; e < r; e += 1) {
      let o = e === r - 1 ? t.deltaY - c * e : c;
      (await G(
        i,
        `Input.dispatchMouseEvent`,
        { type: `mouseWheel`, x: t.x, y: t.y, deltaX: 0, deltaY: o },
        a,
      ),
        await bgPlatformState.q(20 + Math.round(n() * 40)));
    }
    return (
      bgPlatformState.lc.set(e, { x: t.x, y: t.y }),
      { mode: `trusted`, deltaY: t.deltaY, steps: r }
    );
  } finally {
    o && (await Oc(() => chrome.debugger.detach(i), `debugger.detach`));
  }
}

function Gc(e, t, n) {
  if (!Number.isFinite(e.x) || !Number.isFinite(e.y) || !Number.isFinite(e.delayMs))
    throw Error(`拖拽路径点坐标或延时不是有效数字`);
  if (e.x < 0 || e.y < 0 || e.x > t || e.y > n) throw Error(`拖拽路径点不在当前视口内`);
  if (e.delayMs < 0 || e.delayMs > 5e3) throw Error(`拖拽路径点延时超出允许范围（0-5000ms）`);
}

function Kc(e) {
  if (![e.startX, e.startY, e.viewportWidth, e.viewportHeight].every(Number.isFinite))
    throw Error(`拖拽参数不是有效数字`);
  if (e.viewportWidth < 2 || e.viewportHeight < 2) throw Error(`页面视口尺寸无效`);
  if (e.startX < 0 || e.startY < 0 || e.startX > e.viewportWidth || e.startY > e.viewportHeight)
    throw Error(`拖拽起点不在当前视口内`);
  if (!Array.isArray(e.points) || e.points.length < 2) throw Error(`拖拽路径至少需要 2 个点`);
  if (e.targetToken && !/^p-[a-z0-9-]{8,80}$/i.test(e.targetToken))
    throw Error(`拖拽目标控件标记无效`);
  for (let t of [e.toTargetToken])
    if (t && !/^p-[a-z0-9-]{8,80}$/i.test(t)) throw Error(`拖拽终点控件标记无效`);
  for (let t of e.points) Gc(t, e.viewportWidth, e.viewportHeight);
}

async function qc(e, t, n = Math.random) {
  Kc(t);
  let r = { tabId: e },
    i = Date.now() + bgPlatformState.Cc,
    a = { x: t.startX, y: t.startY },
    o = t.points,
    s = o[o.length - 1],
    c = !1,
    l = !1,
    u = a;
  try {
    if (
      ((c = !0),
      await Dc(() => chrome.debugger.attach(r, `1.3`), i, `debugger.attach`),
      await G(r, `Page.bringToFront`, void 0, i),
      await G(r, `Input.setIgnoreInputEvents`, { ignore: !1 }, i),
      t.targetToken)
    ) {
      let e = await Pc(r, t.targetToken, t.fromAnchor ?? { kind: `center` }, i, t.frameTarget);
      if (!e?.hit) throw Error(`滑块把手在拖动前已重绘、移位或被遮挡`);
      let n = e.x - a.x,
        c = e.y - a.y;
      ((a = { x: e.x, y: e.y }),
        (o = t.points.map((e) => ({ ...e, x: e.x + n, y: e.y + c }))),
        (s = o[o.length - 1]));
    }
    if (t.toTargetToken) {
      let e = await Pc(r, t.toTargetToken, t.toAnchor ?? { kind: `center` }, i, t.frameTarget);
      if (!e?.hit) throw Error(`拖拽终点在拖动前已重绘、移位或被遮挡`);
      let n = { x: e.x, y: e.y },
        a = o[o.length - 1],
        c = o.length;
      ((o = o.map((e, t) => {
        let r = (t + 1) / c;
        return { ...e, x: e.x + (n.x - a.x) * r, y: e.y + (n.y - a.y) * r };
      })),
        (s = o[o.length - 1]));
    }
    if (o.some((e) => e.x < 0 || e.y < 0 || e.x > t.viewportWidth || e.y > t.viewportHeight))
      throw Error(`重采样后的拖动轨迹超出当前视口`);
    let d = fc(
      bgPlatformState.lc.get(e) ?? {
        x: 1 + n() * (t.viewportWidth - 2),
        y: 1 + n() * (t.viewportHeight - 2),
      },
      a,
      n,
    );
    for (let e of d)
      (await G(
        r,
        `Input.dispatchMouseEvent`,
        { type: `mouseMoved`, x: e.x, y: e.y, buttons: 0, pointerType: `mouse` },
        i,
      ),
        await bgPlatformState.q(5 + Math.round(n() * 8)));
    (await bgPlatformState.q(80 + Math.round(n() * 70)),
      await G(
        r,
        `Input.dispatchMouseEvent`,
        {
          type: `mousePressed`,
          x: a.x,
          y: a.y,
          button: `left`,
          buttons: 1,
          clickCount: 1,
          pointerType: `mouse`,
        },
        i,
      ),
      (l = !0),
      (u = a),
      await bgPlatformState.q(30 + Math.round(n() * 40)));
    for (let e of o)
      (await G(
        r,
        `Input.dispatchMouseEvent`,
        { type: `mouseMoved`, x: e.x, y: e.y, button: `left`, buttons: 1, pointerType: `mouse` },
        i,
      ),
        (u = e),
        e.delayMs > 0 && (await bgPlatformState.q(e.delayMs)));
    (await bgPlatformState.q(45 + Math.round(n() * 35)),
      await G(
        r,
        `Input.dispatchMouseEvent`,
        {
          type: `mouseReleased`,
          x: s.x,
          y: s.y,
          button: `left`,
          buttons: 0,
          clickCount: 1,
          pointerType: `mouse`,
        },
        i,
      ),
      (l = !1),
      await bgPlatformState.q(90 + Math.round(n() * 70)),
      bgPlatformState.lc.set(e, s));
    let f = 0,
      p = a;
    for (let e of o) ((f += Math.hypot(e.x - p.x, e.y - p.y)), (p = e));
    return { mode: `trusted`, dragPoints: o.length, totalDistance: Math.round(f * 10) / 10 };
  } finally {
    (l &&
      ((l = !1),
      await Oc(
        () =>
          chrome.debugger.sendCommand(r, `Input.dispatchMouseEvent`, {
            type: `mouseReleased`,
            x: u.x,
            y: u.y,
            button: `left`,
            buttons: 0,
            clickCount: 1,
            pointerType: `mouse`,
          }),
        `中断后补发 mouseReleased`,
      )),
      c && (await Oc(() => chrome.debugger.detach(r), `debugger.detach`)));
  }
}

async function Jc(e, t, n = Math.random) {
  if (![t.startX, t.startY, t.viewportWidth, t.viewportHeight].every(Number.isFinite))
    throw Error(`拖拽参数不是有效数字`);
  if (t.viewportWidth < 2 || t.viewportHeight < 2) throw Error(`页面视口尺寸无效`);
  if (t.startX < 0 || t.startY < 0 || t.startX > t.viewportWidth || t.startY > t.viewportHeight)
    throw Error(`拖拽起点不在当前视口内`);
  if (t.targetToken && !/^p-[a-z0-9-]{8,80}$/i.test(t.targetToken))
    throw Error(`拖拽目标控件标记无效`);
  let r = { tabId: e },
    i = Date.now() + bgPlatformState.wc,
    a = !1,
    o = !1,
    s = !1,
    c,
    l = { x: t.startX, y: t.startY },
    u = !1,
    d = () => {
      if (s || !o) throw Error(`拖拽会话已经结束`);
      K(i);
    },
    f = (e, t, n = i) =>
      G(r, `Input.dispatchMouseEvent`, { type: e, x: l.x, y: l.y, pointerType: `mouse`, ...t }, n);
  try {
    if (
      ((a = !0),
      await Dc(() => chrome.debugger.attach(r, `1.3`), i, `debugger.attach`),
      (o = !0),
      await G(r, `Page.bringToFront`, void 0, i),
      await G(r, `Input.setIgnoreInputEvents`, { ignore: !1 }, i),
      t.targetToken)
    ) {
      let e = await Pc(r, t.targetToken, { kind: `center` }, i, t.frameTarget);
      if (!e?.hit) throw Error(`滑块把手在拖动前已重绘、移位或被遮挡`);
      l = { x: e.x, y: e.y };
    }
    let s = bgPlatformState.lc.get(e) ?? {
      x: 1 + n() * (t.viewportWidth - 2),
      y: 1 + n() * (t.viewportHeight - 2),
    };
    for (let e of fc(s, l, n))
      (await G(
        r,
        `Input.dispatchMouseEvent`,
        { type: `mouseMoved`, x: e.x, y: e.y, buttons: 0, pointerType: `mouse` },
        i,
      ),
        await bgPlatformState.q(5 + Math.round(n() * 8)));
    (await bgPlatformState.q(80 + Math.round(n() * 70)),
      await f(`mousePressed`, { button: `left`, buttons: 1, clickCount: 1 }),
      (u = !0),
      await bgPlatformState.q(30 + Math.round(n() * 40)));
  } catch (e) {
    throw (
      u &&
        ((u = !1),
        await Oc(
          () =>
            chrome.debugger.sendCommand(r, `Input.dispatchMouseEvent`, {
              type: `mouseReleased`,
              x: l.x,
              y: l.y,
              button: `left`,
              buttons: 0,
              clickCount: 1,
              pointerType: `mouse`,
            }),
          `中断后补发 mouseReleased`,
        )),
      (o = !1),
      a && (await Oc(() => chrome.debugger.detach(r), `debugger.detach`)),
      e
    );
  }
  return {
    get current() {
      return { ...l };
    },
    async screenshot() {
      d();
      let e = await Dc(
        () =>
          chrome.debugger.sendCommand(r, `Page.captureScreenshot`, {
            format: `png`,
            fromSurface: !0,
            captureBeyondViewport: !1,
          }),
        Math.min(i, Date.now() + bgPlatformState.Tc),
        `CDP Page.captureScreenshot`,
        bgPlatformState.Tc,
      );
      if (!e.data) throw Error(`拖拽过程中 CDP 截图返回空数据`);
      return e.data;
    },
    async moveBy(e) {
      d();
      for (let n of e)
        (Gc(n, t.viewportWidth, t.viewportHeight),
          (l = { x: n.x, y: n.y }),
          await f(`mouseMoved`, { button: `left`, buttons: 1 }),
          n.delayMs > 0 && (await bgPlatformState.q(Math.min(5e3, n.delayMs))));
    },
    release: () =>
      c ||
      (s
        ? Promise.resolve()
        : ((s = !0),
          (c = (async () => {
            try {
              (u &&
                ((u = !1),
                await Oc(
                  () =>
                    chrome.debugger.sendCommand(r, `Input.dispatchMouseEvent`, {
                      type: `mouseReleased`,
                      x: l.x,
                      y: l.y,
                      button: `left`,
                      buttons: 0,
                      clickCount: 1,
                      pointerType: `mouse`,
                    }),
                  `CDP Input.dispatchMouseEvent(mouseReleased)`,
                )),
                await bgPlatformState.q(90 + Math.round(n() * 70)),
                bgPlatformState.lc.set(e, { ...l }));
            } finally {
              ((o = !1), a && (await Oc(() => chrome.debugger.detach(r), `debugger.detach`)));
            }
          })()),
          c)),
  };
}

function Yc(e) {
  bgPlatformState.lc.delete(e);
}

function X(e) {
  let t = bgPlatformState.$p.then(e, e);
  return (
    (bgPlatformState.$p = t.then(
      () => void 0,
      () => void 0,
    )),
    t
  );
}

function rm(e) {
  let t = bgPlatformState.em.then(e, e);
  return (
    (bgPlatformState.em = t.then(
      () => void 0,
      () => void 0,
    )),
    t
  );
}

function im() {
  let e = chrome.runtime.getManifest();
  return e.version_name ?? e.version;
}

function $() {
  chrome.runtime.sendMessage({ type: `STATUS_CHANGED` }).catch(() => {});
}

Object.assign(bgPlatformState, {
  l,
  Ci,
  Ti,
  na,
  ra,
  ia,
  R,
  ic,
  ac,
  oc,
  sc,
  cc,
  uc,
  dc,
  fc,
  pc,
  mc,
  bc,
  Ec,
  Dc,
  G,
  Oc,
  kc,
  K,
  Ac,
  Mc,
  Nc,
  Pc,
  zc,
  Bc,
  Vc,
  Hc,
  Uc,
  Wc,
  Gc,
  Kc,
  qc,
  Jc,
  Yc,
  X,
  rm,
  im,
  $,
});

export async function handlePlatformMutation(e) {
  switch (e.action) {
  }
}

export function initializeBackgroundPlatform(step) {
  switch (step) {
    case 0: {
      bgPlatformState.t = {
        async get(e, t) {
          return (await chrome.storage.local.get(e))[e] ?? t;
        },
        async set(e, t) {
          await chrome.storage.local.set({ [e]: t });
        },
        async setMany(e) {
          await chrome.storage.local.set(e);
        },
        async remove(e) {
          await chrome.storage.local.remove(e);
        },
      };
      break;
    }
    case 1: {
      bgPlatformState.n = {
        async get(e, t) {
          return (await chrome.storage.session.get(e))[e] ?? t;
        },
        async set(e, t) {
          await chrome.storage.session.set({ [e]: t });
        },
        async remove(e) {
          await chrome.storage.session.remove(e);
        },
      };
      break;
    }
    case 2: {
      bgPlatformState.r = {
        sites: `sites`,
        accounts: `accounts`,
        status: `status`,
        results: `results`,
        proxies: `proxies`,
        headlessStats: `headlessStats`,
        balances: `balances`,
        launchMode: `launchMode`,
        schedule: `checkinSchedule`,
        removedBuiltinSiteIds: `removedBuiltinSiteIds`,
        listenerPlan: `listenerPlan`,
        subscriptionSource: `subscriptionSource`,
      };
      break;
    }
    case 113: {
      bgPlatformState.ea = new Map();
      break;
    }
    case 114: {
      bgPlatformState.ta = { APP_DATA: `checkin:app-data`, BALANCE: `checkin:balance` };
      break;
    }
    case 194: {
      bgPlatformState.lc = new Map();
      break;
    }
    case 195: {
      bgPlatformState.hc = 3e4;
      break;
    }
    case 196: {
      bgPlatformState.gc = 600;
      break;
    }
    case 197: {
      bgPlatformState._c = 5e3;
      break;
    }
    case 198: {
      bgPlatformState.vc = 90;
      break;
    }
    case 199: {
      bgPlatformState.yc = new Set([`click`, `double`, `right`, `long-press`]);
      break;
    }
    case 200: {
      bgPlatformState.xc = 4e3;
      break;
    }
    case 201: {
      bgPlatformState.Sc = 1e3;
      break;
    }
    case 202: {
      bgPlatformState.Cc = 3e4;
      break;
    }
    case 203: {
      bgPlatformState.wc = 45e3;
      break;
    }
    case 204: {
      bgPlatformState.Tc = 8e3;
      break;
    }
    case 205: {
      bgPlatformState.jc = `__aahTrustedPointerProbes`;
      break;
    }
    case 206: {
      bgPlatformState.q = (e) => new Promise((t) => setTimeout(t, e));
      break;
    }
    case 207: {
      bgPlatformState.Fc = 1e4;
      break;
    }
    case 208: {
      bgPlatformState.Ic = 15e3;
      break;
    }
    case 209: {
      bgPlatformState.Lc = 800;
      break;
    }
    case 210: {
      bgPlatformState.Rc = 250;
      break;
    }
    case 297: {
      bgPlatformState.Np = {
        get: (e) => chrome.tabs.get(e).catch(() => void 0),
        queryWindow: (e) => chrome.tabs.query({ windowId: e }).catch(() => []),
        remove: (e) => chrome.tabs.remove(e),
      };
      break;
    }
    case 307: {
      bgPlatformState.$p = Promise.resolve();
      break;
    }
    case 308: {
      bgPlatformState.em = Promise.resolve();
      break;
    }
    case 309: {
      bgPlatformState.tm = Promise.resolve();
      break;
    }
    case 310: {
      bgPlatformState.nm = Promise.resolve();
      break;
    }
  }
}
