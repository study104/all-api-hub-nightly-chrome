(() => {
  // src/shared/background-platform.js
  var bgPlatformState = { store: {} };
  function l(e2) {
    return typeof e2 == `object` && !!e2 && !Array.isArray(e2);
  }
  function Ci(e2 = /* @__PURE__ */ new Date()) {
    return `${e2.getFullYear()}-${String(e2.getMonth() + 1).padStart(2, `0`)}-${String(e2.getDate()).padStart(2, `0`)}`;
  }
  function Ti(e2 = ``) {
    let t = Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
    return e2 ? `${e2}-${t}` : t;
  }
  function na(e2, t) {
    let n = (bgPlatformState.ea.get(e2) ?? Promise.resolve()).then(t, t);
    return bgPlatformState.ea.set(
      e2,
      n.then(
        () => void 0,
        () => void 0
      )
    ), n;
  }
  function ra() {
    let e2 = globalThis.navigator?.locks;
    return typeof e2?.request == `function` ? e2 : void 0;
  }
  function ia(e2, t) {
    let n = ra();
    return n ? na(e2, async () => await n.request(e2, { mode: `exclusive` }, () => t())) : na(e2, t);
  }
  function R(e2) {
    return ia(bgPlatformState.ta.APP_DATA, e2);
  }
  async function ic(e2) {
    let t;
    try {
      return await Promise.race([
        e2,
        new Promise((e3, n) => {
          t = setTimeout(() => n(Error(`验证码内嵌页面读取超时`)), 4e3);
        })
      ]);
    } finally {
      t && clearTimeout(t);
    }
  }
  async function ac(e2, t, n = []) {
    let r = (await ic(
      chrome.scripting.executeScript({
        target: { tabId: e2, frameIds: [0] },
        func: (e3, t2, n2) => {
          let r2 = document.querySelector(`[data-aah-pointer-target="${e3}"]`);
          if (!(r2 instanceof HTMLIFrameElement) || !r2.isConnected || r2.src !== t2) return null;
          let i = r2;
          for (; i; ) {
            let e4 = getComputedStyle(i);
            if (e4.display === `none` || e4.visibility !== `visible` || Number.parseFloat(e4.opacity || `1`) <= 0.02)
              return null;
            if (e4.transform !== `none`) {
              let t3 = new DOMMatrixReadOnly(e4.transform);
              if (!t3.is2D || Math.abs(t3.b) > 1e-3 || Math.abs(t3.c) > 1e-3 || t3.a <= 0 || t3.d <= 0)
                return null;
            }
            i = i.parentElement;
          }
          let a = r2.getBoundingClientRect();
          if (a.width < 100 || a.height < 70 || !r2.offsetWidth || !r2.offsetHeight) return null;
          let o = a.width / r2.offsetWidth, s = a.height / r2.offsetHeight, c = a.left + r2.clientLeft * o, l2 = a.top + r2.clientTop * s, u = r2.clientWidth * o, d = r2.clientHeight * s, f = n2.map((e4) => {
            if (![e4.x, e4.y].every(Number.isFinite) || e4.x < 0 || e4.x > 1 || e4.y < 0 || e4.y > 1)
              return false;
            let t3 = c + e4.x * u, n3 = l2 + e4.y * d;
            return t3 >= 1 && n3 >= 1 && t3 < innerWidth - 1 && n3 < innerHeight - 1 && document.elementFromPoint(t3, n3) === r2;
          });
          return {
            x: c,
            y: l2,
            width: u,
            height: d,
            viewportWidth: innerWidth,
            viewportHeight: innerHeight,
            devicePixelRatio: devicePixelRatio || 1,
            pointHits: f
          };
        },
        args: [t.frameToken, t.frameUrl, n]
      })
    ))[0]?.result;
    if (!r) throw Error(`验证码 iframe 已隐藏、重建或发生无法换算的变形`);
    if (r.pointHits.some((e3) => !e3)) throw Error(`验证码 iframe 的图片或把手被外层弹窗遮挡`);
    return r;
  }
  function oc(e2, t, n) {
    let r = e2.width / t, i = e2.height / n;
    if (![r, i].every((e3) => Number.isFinite(e3) && e3 >= 0.2 && e3 <= 5))
      throw Error(`验证码 iframe 的视口缩放比例无效`);
    return { x: r, y: i };
  }
  function sc(e2, t, n) {
    return { x: t.x + e2.x * n.x, y: t.y + e2.y * n.y, width: e2.width * n.x, height: e2.height * n.y };
  }
  async function cc(e2, t, n, r) {
    let i = (await ic(
      chrome.scripting.executeScript({
        target: t.documentId ? { tabId: e2, documentIds: [t.documentId] } : { tabId: e2, frameIds: [t.frameId] },
        func: (e3, t2, n2) => {
          if (location.href !== n2) return null;
          let r2 = document.querySelector(`[data-aah-pointer-target="${e3}"]`);
          if (!r2?.isConnected) return null;
          let i2 = r2.getBoundingClientRect();
          if (i2.width < 2 || i2.height < 2) return null;
          let a2 = i2.left + (t2.kind === `inset-left` ? Math.min(t2.px, i2.width / 2) : i2.width / 2), o2 = i2.top + i2.height / 2;
          if (a2 < 1 || o2 < 1 || a2 >= innerWidth - 1 || o2 >= innerHeight - 1) return null;
          let s2 = document.elementFromPoint(a2, o2);
          return !s2 || !(s2 === r2 || r2.contains(s2)) ? null : {
            x: a2,
            y: o2,
            rect: { x: i2.x, y: i2.y, width: i2.width, height: i2.height },
            viewportWidth: innerWidth,
            viewportHeight: innerHeight
          };
        },
        args: [n, r, t.frameUrl]
      })
    ))[0]?.result;
    if (!i) return null;
    let a = await ac(e2, t, [{ x: i.x / i.viewportWidth, y: i.y / i.viewportHeight }]), o = oc(a, i.viewportWidth, i.viewportHeight), s = sc(i.rect, a, o);
    return {
      x: a.x + i.x * o.x,
      y: a.y + i.y * o.y,
      rect: { left: s.x, top: s.y, width: s.width, height: s.height },
      hit: true,
      withinHost: true
    };
  }
  function uc(e2, t, n) {
    return Math.min(n, Math.max(t, e2));
  }
  function dc(e2, t, n, r, i) {
    let a = 1 - i, o = a ** 3, s = 3 * a ** 2 * i, c = 3 * a * i ** 2, l2 = i ** 3;
    return { x: o * e2.x + s * t.x + c * n.x + l2 * r.x, y: o * e2.y + s * t.y + c * n.y + l2 * r.y };
  }
  function fc(e2, t, n = Math.random) {
    let r = t.x - e2.x, i = t.y - e2.y, a = Math.max(1, Math.hypot(r, i)), o = uc(Math.round(a / 24) + 10, 12, 30), s = -i / a, c = r / a, l2 = (n() - 0.5) * Math.min(120, a * 0.42), u = { x: e2.x + r * 0.32 + s * l2, y: e2.y + i * 0.32 + c * l2 }, d = { x: e2.x + r * 0.72 - s * l2 * 0.35, y: e2.y + i * 0.72 - c * l2 * 0.35 }, f = [];
    for (let r2 = 1; r2 <= o; r2 += 1) {
      let i2 = r2 / o, a2 = dc(e2, u, d, t, i2), s2 = (1 - i2) * 0.7;
      f.push({ x: a2.x + (n() - 0.5) * s2, y: a2.y + (n() - 0.5) * s2 });
    }
    return f[f.length - 1] = { ...t }, f;
  }
  function pc(e2, t) {
    let n = (90 + t() * 230) * (t() < 0.5 ? -1 : 1), r = (55 + t() * 170) * (t() < 0.5 ? -1 : 1);
    return { x: uc(e2.x + n, 1, e2.viewportWidth - 1), y: uc(e2.y + r, 1, e2.viewportHeight - 1) };
  }
  function mc(e2) {
    if (![e2.x, e2.y, e2.viewportWidth, e2.viewportHeight].every(Number.isFinite))
      throw Error(`鼠标坐标不是有效数字`);
    if (e2.viewportWidth < 2 || e2.viewportHeight < 2) throw Error(`页面视口尺寸无效`);
    if (e2.x < 0 || e2.y < 0 || e2.x > e2.viewportWidth || e2.y > e2.viewportHeight)
      throw Error(`目标坐标不在当前视口内`);
    if (!/^p-[a-z0-9-]{8,80}$/i.test(e2.targetToken)) throw Error(`目标控件标记无效`);
    if (e2.targetSeenAt != null && (!Number.isFinite(e2.targetSeenAt) || e2.targetSeenAt < 0))
      throw Error(`目标控件出现时间无效`);
    if (e2.deadline != null && (!Number.isFinite(e2.deadline) || e2.deadline < 0))
      throw Error(`可信点击截止时间无效`);
    if (bc(e2), e2.inputAssertions) {
      if (e2.inputAssertions.length > 4) throw Error(`点击前输入核对项过多`);
      for (let t of e2.inputAssertions)
        if (!t.selector || t.selector.length > 256 || typeof t.value != `string`)
          throw Error(`点击前输入核对项无效`);
    }
  }
  function bc(e2) {
    let t = e2.gesture ?? `click`;
    if (!bgPlatformState.yc.has(t)) throw Error(`未知手势 ${String(e2.gesture)}`);
    let n = e2.holdMs;
    return {
      gesture: t,
      holdMs: n != null && Number.isFinite(n) ? Math.min(bgPlatformState._c, Math.max(0, Math.round(n))) : bgPlatformState.gc
    };
  }
  function Ec(e2) {
    return Error(`可信点击阶段「${e2}」超时（点击结果可能未知）`);
  }
  function Dc(e2, t, n, r = bgPlatformState.xc) {
    let i = t - Date.now();
    if (i <= 0) return Promise.reject(Ec(n));
    let a;
    try {
      a = Promise.resolve(e2());
    } catch (e3) {
      return Promise.reject(e3);
    }
    return new Promise((e3, t2) => {
      let o = false, s = setTimeout(
        () => {
          o || (o = true, t2(Ec(n)));
        },
        Math.min(r, i)
      );
      a.then(
        (t3) => {
          o || (o = true, clearTimeout(s), e3(t3));
        },
        (e4) => {
          o || (o = true, clearTimeout(s), t2(e4));
        }
      );
    });
  }
  function G(e2, t, n, r) {
    return Dc(
      () => n === void 0 ? chrome.debugger.sendCommand(e2, t) : chrome.debugger.sendCommand(e2, t, n),
      r,
      `CDP ${t}`
    );
  }
  async function Oc(e2, t) {
    try {
      await Dc(e2, Date.now() + bgPlatformState.Sc, t, bgPlatformState.Sc);
    } catch {
    }
  }
  async function kc(e2, t, n) {
    return (await G(
      e2,
      `Runtime.evaluate`,
      {
        expression: `(() => {
      const assertions = ${JSON.stringify(t)};
      return assertions.every(({ selector, value }) => {
        const input = document.querySelector(selector);
        return input instanceof HTMLInputElement && input.value === value;
      });
    })()`,
        returnByValue: true
      },
      n
    )).result?.value === true;
  }
  function K(e2) {
    if (e2 != null && Date.now() >= e2) throw Error(`可信点击已超过执行截止时间`);
  }
  async function Ac(e2, t) {
    if (t != null && Date.now() + e2 >= t) throw Error(`可信点击剩余时间不足，已取消按压`);
    await bgPlatformState.q(e2), K(t);
  }
  async function Mc(e2, t, n) {
    return (await G(
      e2,
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
        returnByValue: true
      },
      n
    )).result?.value === true;
  }
  async function Nc(e2, t, n) {
    return (await G(
      e2,
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
        returnByValue: true
      },
      n
    )).result?.value ?? null;
  }
  async function Pc(e2, t, n, r, i) {
    return i && e2.tabId != null ? Dc(
      () => cc(e2.tabId, i, t, n),
      r ?? Date.now() + bgPlatformState.xc,
      `验证码 iframe 目标重采样`
    ) : (await G(
      e2,
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
        returnByValue: true
      },
      r ?? Date.now() + bgPlatformState.xc
    )).result?.value ?? null;
  }
  function zc(e2) {
    let t = /* @__PURE__ */ new Map();
    for (let n = 0; n + 1 < (e2?.length ?? 0); n += 2) t.set(e2[n].toLowerCase(), e2[n + 1] ?? ``);
    return t;
  }
  async function Bc(e2, t, n, r, i) {
    let a = i ?? Date.now() + bgPlatformState.xc;
    try {
      let i2;
      try {
        i2 = await G(
          e2,
          `DOM.getNodeForLocation`,
          { x: Math.round(t), y: Math.round(n), includeUserAgentShadowDOM: true },
          a
        );
      } catch {
        i2 = await G(e2, `DOM.getNodeForLocation`, { x: Math.round(t), y: Math.round(n) }, a);
      }
      if (i2.frameId && r && i2.frameId !== r)
        return {
          signal: `inner-frame`,
          identity: `frame:${i2.frameId}:node:${i2.backendNodeId ?? `unknown`}`
        };
      if (!i2.backendNodeId) return null;
      let o = (await G(e2, `DOM.describeNode`, { backendNodeId: i2.backendNodeId, depth: 0, pierce: true }, a)).node;
      if (!o) return null;
      if (o.frameId && r && o.frameId !== r)
        return { signal: `inner-frame`, identity: `frame:${o.frameId}:node:${i2.backendNodeId}` };
      let s = (o.localName || o.nodeName || ``).toLowerCase(), c = zc(o.attributes), l2 = `${c.get(`src`) ?? ``} ${o.documentURL ?? ``}`;
      return /challenges\.cloudflare\.com|turnstile/i.test(l2) ? {
        signal: `inner-frame`,
        identity: `frame:${o.frameId ?? `unknown`}:node:${i2.backendNodeId}`
      } : s === `input` && c.get(`type`)?.toLowerCase() === `checkbox` || c.get(`role`)?.toLowerCase() === `checkbox` ? { signal: `interactive-control`, identity: `node:${i2.backendNodeId}` } : null;
    } catch {
      return null;
    }
  }
  async function Vc(e2, t, n, r, i) {
    K(i);
    let a = Date.now(), o = r != null && r <= a + 1e3 ? r : a, s = o + bgPlatformState.Fc, c = o + bgPlatformState.Ic, l2 = await G(e2, `Page.getFrameTree`, void 0, i ?? Date.now() + bgPlatformState.xc).catch(
      () => null
    );
    K(i);
    let u = l2?.frameTree?.frame?.id, d = null, f = null, p = 0;
    for (; ; ) {
      K(i);
      let r2 = await Pc(e2, t, n, i ?? Date.now() + bgPlatformState.xc);
      if (K(i), !r2) throw Error(`Turnstile 宿主在成熟检查期间已重绘或消失`);
      let l3 = await Bc(e2, r2.x, r2.y, u, i);
      K(i);
      let m = Date.now(), h = l3?.signal ?? null, g = l3?.identity ?? null;
      if ((h !== d || g !== f) && (d = h, f = g, p = l3 ? m : 0), l3 && m >= s && p > 0 && m - p >= bgPlatformState.Lc)
        return K(i), { signal: l3.signal, waitedMs: m - a, widgetAgeMs: Math.max(0, m - o) };
      if (m >= c)
        return K(i), { signal: `safety-window`, waitedMs: m - a, widgetAgeMs: Math.max(0, m - o) };
      let _ = Math.min(bgPlatformState.Rc, Math.max(1, Math.min(c, i ?? 1 / 0) - m));
      if (i != null && m + _ >= i) throw Error(`Turnstile 成熟等待已达到执行截止时间`);
      await bgPlatformState.q(_);
    }
  }
  async function Hc(e2, t, n = Math.random, r = {}) {
    mc(t);
    let i = Math.min(t.deadline ?? 1 / 0, Date.now() + bgPlatformState.hc);
    K(i);
    let a = { tabId: e2 }, o = { x: t.x, y: t.y }, s = fc(bgPlatformState.lc.get(e2) ?? pc(t, n), o, n), c = false, l2 = false, u = false, d = false, f = false, p = o, m;
    try {
      K(i), c = true, await Dc(() => chrome.debugger.attach(a, `1.3`), i, `debugger.attach`), l2 = true, await G(a, `Page.bringToFront`, void 0, i), await G(a, `Input.setIgnoreInputEvents`, { ignore: false }, i);
      let h = t.anchor ?? { kind: `center` };
      h.kind === `inset-left` && (m = await Vc(a, t.targetToken, h, t.targetSeenAt, i)), K(i), u = !t.frameTarget && await Mc(a, t.targetToken, i), await Ac(45 + Math.round(n() * 35), i);
      for (let e3 of s)
        K(i), await G(
          a,
          `Input.dispatchMouseEvent`,
          { type: `mouseMoved`, x: e3.x, y: e3.y, buttons: 0, pointerType: `mouse` },
          i
        ), await Ac(6 + Math.round(n() * 9), i);
      let g = await Pc(a, t.targetToken, h, i, t.frameTarget);
      K(i);
      let _ = h.kind === `inset-left`;
      if (!g || !g.hit && !(_ && g.withinHost))
        throw Error(`目标控件在鼠标移动过程中发生位移或被遮挡`);
      let v = { x: g.x, y: g.y }, y = Math.hypot(v.x - o.x, v.y - o.y), b = y > 1 ? uc(Math.ceil(y / 12), 3, 10) : 0;
      for (let e3 = 1; e3 <= b; e3 += 1) {
        K(i);
        let t2 = e3 / b, r2 = { x: o.x + (v.x - o.x) * t2, y: o.y + (v.y - o.y) * t2 };
        await G(
          a,
          `Input.dispatchMouseEvent`,
          { type: `mouseMoved`, x: r2.x, y: r2.y, buttons: 0, pointerType: `mouse` },
          i
        ), await Ac(8 + Math.round(n() * 7), i);
      }
      if (await Ac(25 + Math.round(n() * 55), i), K(i), t.inputAssertions?.length && !await kc(a, t.inputAssertions, i))
        throw Error(`登录输入在鼠标按下前发生变化，已取消点击`);
      let { gesture: x, holdMs: S } = bc(t), C = x === `double` ? 2 : 1, w = x === `right` ? `right` : `left`;
      p = v;
      let T = async (e3) => {
        await G(
          a,
          `Input.dispatchMouseEvent`,
          {
            type: `mousePressed`,
            x: v.x,
            y: v.y,
            button: w,
            buttons: x === `right` ? 2 : 1,
            clickCount: e3,
            pointerType: `mouse`
          },
          i
        ), f = true, await Ac(x === `long-press` ? S : 45 + Math.round(n() * 65), i), await G(
          a,
          `Input.dispatchMouseEvent`,
          {
            type: `mouseReleased`,
            x: v.x,
            y: v.y,
            button: w,
            buttons: 0,
            clickCount: e3,
            pointerType: `mouse`
          },
          i
        ), f = false;
      };
      await T(C), x === `double` && (await Ac(bgPlatformState.vc, i), await T(2)), await bgPlatformState.q(90 + Math.round(n() * 70));
      let E = u ? await Nc(a, t.targetToken, Math.min(i, Date.now() + bgPlatformState.Sc)).catch(() => null) : null;
      if (d = true, E?.clickObserved !== false && r.afterClick && await Dc(r.afterClick, i, `点击后状态写入`), E?.offsetActual && E?.offsetExpected) {
        let e3 = E.offsetActual, t2 = E.offsetExpected, n2 = Math.abs(e3.dx - t2.dx) <= 8 && Math.abs(e3.dy - t2.dy) <= 8;
        console.log(
          `[TrustedPointer] screenOffset: actual dx=${e3.dx} dy=${e3.dy}  expected dx=${t2.dx} dy=${t2.dy}  ${n2 ? `✓ match` : `✗ MISMATCH — infobar height shift`}`
        );
      }
      bgPlatformState.lc.set(e2, v);
      let D = E?.offsetActual && E?.offsetExpected ? {
        actual: E.offsetActual,
        expected: E.offsetExpected,
        matches: Math.abs(E.offsetActual.dx - E.offsetExpected.dx) <= 8 && Math.abs(E.offsetActual.dy - E.offsetExpected.dy) <= 8
      } : void 0, O = x === `right` ? E?.contextmenuObserved ?? null : E?.clickObserved ?? null;
      return {
        mode: `trusted`,
        pathPoints: s.length + b,
        clickObserved: O,
        target: g,
        screenOffset: D,
        turnstileReadiness: m
      };
    } finally {
      l2 && f && (f = false, await Oc(
        () => chrome.debugger.sendCommand(a, `Input.dispatchMouseEvent`, {
          type: `mouseReleased`,
          x: p.x,
          y: p.y,
          button: `left`,
          buttons: 0,
          clickCount: 1,
          pointerType: `mouse`
        }),
        `中断后补发 mouseReleased`
      )), l2 && u && !d && await Nc(a, t.targetToken, Date.now() + bgPlatformState.Sc).catch(() => null), c && await Oc(() => chrome.debugger.detach(a), `debugger.detach`);
    }
  }
  function Uc(e2) {
    if (![e2.x, e2.y, e2.viewportWidth, e2.viewportHeight, e2.deltaY].every(Number.isFinite))
      throw Error(`滚动参数不是有效数字`);
    if (e2.viewportWidth < 2 || e2.viewportHeight < 2) throw Error(`页面视口尺寸无效`);
    if (e2.x < 0 || e2.y < 0 || e2.x > e2.viewportWidth || e2.y > e2.viewportHeight)
      throw Error(`滚动坐标不在当前视口内`);
    if (Math.abs(e2.deltaY) < 1 || Math.abs(e2.deltaY) > 2e4) throw Error(`滚动距离超出允许范围`);
    if (e2.steps != null && (!Number.isInteger(e2.steps) || e2.steps < 1 || e2.steps > 12))
      throw Error(`滚动分段数超出允许范围`);
  }
  async function Wc(e2, t, n = Math.random) {
    Uc(t);
    let r = t.steps ?? uc(Math.ceil(Math.abs(t.deltaY) / 240), 3, 8), i = { tabId: e2 }, a = Date.now() + bgPlatformState.Cc, o = false;
    try {
      o = true, await Dc(() => chrome.debugger.attach(i, `1.3`), a, `debugger.attach`), await G(i, `Page.bringToFront`, void 0, a), await G(i, `Input.setIgnoreInputEvents`, { ignore: false }, a);
      let s = fc(bgPlatformState.lc.get(e2) ?? { x: t.x, y: t.y }, { x: t.x, y: t.y }, n);
      for (let e3 of s)
        await G(
          i,
          `Input.dispatchMouseEvent`,
          { type: `mouseMoved`, x: e3.x, y: e3.y, buttons: 0, pointerType: `mouse` },
          a
        ), await bgPlatformState.q(5 + Math.round(n() * 8));
      let c = t.deltaY / r;
      for (let e3 = 0; e3 < r; e3 += 1) {
        let o2 = e3 === r - 1 ? t.deltaY - c * e3 : c;
        await G(
          i,
          `Input.dispatchMouseEvent`,
          { type: `mouseWheel`, x: t.x, y: t.y, deltaX: 0, deltaY: o2 },
          a
        ), await bgPlatformState.q(20 + Math.round(n() * 40));
      }
      return bgPlatformState.lc.set(e2, { x: t.x, y: t.y }), { mode: `trusted`, deltaY: t.deltaY, steps: r };
    } finally {
      o && await Oc(() => chrome.debugger.detach(i), `debugger.detach`);
    }
  }
  function Gc(e2, t, n) {
    if (!Number.isFinite(e2.x) || !Number.isFinite(e2.y) || !Number.isFinite(e2.delayMs))
      throw Error(`拖拽路径点坐标或延时不是有效数字`);
    if (e2.x < 0 || e2.y < 0 || e2.x > t || e2.y > n) throw Error(`拖拽路径点不在当前视口内`);
    if (e2.delayMs < 0 || e2.delayMs > 5e3) throw Error(`拖拽路径点延时超出允许范围（0-5000ms）`);
  }
  function Kc(e2) {
    if (![e2.startX, e2.startY, e2.viewportWidth, e2.viewportHeight].every(Number.isFinite))
      throw Error(`拖拽参数不是有效数字`);
    if (e2.viewportWidth < 2 || e2.viewportHeight < 2) throw Error(`页面视口尺寸无效`);
    if (e2.startX < 0 || e2.startY < 0 || e2.startX > e2.viewportWidth || e2.startY > e2.viewportHeight)
      throw Error(`拖拽起点不在当前视口内`);
    if (!Array.isArray(e2.points) || e2.points.length < 2) throw Error(`拖拽路径至少需要 2 个点`);
    if (e2.targetToken && !/^p-[a-z0-9-]{8,80}$/i.test(e2.targetToken))
      throw Error(`拖拽目标控件标记无效`);
    for (let t of [e2.toTargetToken])
      if (t && !/^p-[a-z0-9-]{8,80}$/i.test(t)) throw Error(`拖拽终点控件标记无效`);
    for (let t of e2.points) Gc(t, e2.viewportWidth, e2.viewportHeight);
  }
  async function qc(e2, t, n = Math.random) {
    Kc(t);
    let r = { tabId: e2 }, i = Date.now() + bgPlatformState.Cc, a = { x: t.startX, y: t.startY }, o = t.points, s = o[o.length - 1], c = false, l2 = false, u = a;
    try {
      if (c = true, await Dc(() => chrome.debugger.attach(r, `1.3`), i, `debugger.attach`), await G(r, `Page.bringToFront`, void 0, i), await G(r, `Input.setIgnoreInputEvents`, { ignore: false }, i), t.targetToken) {
        let e3 = await Pc(r, t.targetToken, t.fromAnchor ?? { kind: `center` }, i, t.frameTarget);
        if (!e3?.hit) throw Error(`滑块把手在拖动前已重绘、移位或被遮挡`);
        let n2 = e3.x - a.x, c2 = e3.y - a.y;
        a = { x: e3.x, y: e3.y }, o = t.points.map((e4) => ({ ...e4, x: e4.x + n2, y: e4.y + c2 })), s = o[o.length - 1];
      }
      if (t.toTargetToken) {
        let e3 = await Pc(r, t.toTargetToken, t.toAnchor ?? { kind: `center` }, i, t.frameTarget);
        if (!e3?.hit) throw Error(`拖拽终点在拖动前已重绘、移位或被遮挡`);
        let n2 = { x: e3.x, y: e3.y }, a2 = o[o.length - 1], c2 = o.length;
        o = o.map((e4, t2) => {
          let r2 = (t2 + 1) / c2;
          return { ...e4, x: e4.x + (n2.x - a2.x) * r2, y: e4.y + (n2.y - a2.y) * r2 };
        }), s = o[o.length - 1];
      }
      if (o.some((e3) => e3.x < 0 || e3.y < 0 || e3.x > t.viewportWidth || e3.y > t.viewportHeight))
        throw Error(`重采样后的拖动轨迹超出当前视口`);
      let d = fc(
        bgPlatformState.lc.get(e2) ?? {
          x: 1 + n() * (t.viewportWidth - 2),
          y: 1 + n() * (t.viewportHeight - 2)
        },
        a,
        n
      );
      for (let e3 of d)
        await G(
          r,
          `Input.dispatchMouseEvent`,
          { type: `mouseMoved`, x: e3.x, y: e3.y, buttons: 0, pointerType: `mouse` },
          i
        ), await bgPlatformState.q(5 + Math.round(n() * 8));
      await bgPlatformState.q(80 + Math.round(n() * 70)), await G(
        r,
        `Input.dispatchMouseEvent`,
        {
          type: `mousePressed`,
          x: a.x,
          y: a.y,
          button: `left`,
          buttons: 1,
          clickCount: 1,
          pointerType: `mouse`
        },
        i
      ), l2 = true, u = a, await bgPlatformState.q(30 + Math.round(n() * 40));
      for (let e3 of o)
        await G(
          r,
          `Input.dispatchMouseEvent`,
          { type: `mouseMoved`, x: e3.x, y: e3.y, button: `left`, buttons: 1, pointerType: `mouse` },
          i
        ), u = e3, e3.delayMs > 0 && await bgPlatformState.q(e3.delayMs);
      await bgPlatformState.q(45 + Math.round(n() * 35)), await G(
        r,
        `Input.dispatchMouseEvent`,
        {
          type: `mouseReleased`,
          x: s.x,
          y: s.y,
          button: `left`,
          buttons: 0,
          clickCount: 1,
          pointerType: `mouse`
        },
        i
      ), l2 = false, await bgPlatformState.q(90 + Math.round(n() * 70)), bgPlatformState.lc.set(e2, s);
      let f = 0, p = a;
      for (let e3 of o) f += Math.hypot(e3.x - p.x, e3.y - p.y), p = e3;
      return { mode: `trusted`, dragPoints: o.length, totalDistance: Math.round(f * 10) / 10 };
    } finally {
      l2 && (l2 = false, await Oc(
        () => chrome.debugger.sendCommand(r, `Input.dispatchMouseEvent`, {
          type: `mouseReleased`,
          x: u.x,
          y: u.y,
          button: `left`,
          buttons: 0,
          clickCount: 1,
          pointerType: `mouse`
        }),
        `中断后补发 mouseReleased`
      )), c && await Oc(() => chrome.debugger.detach(r), `debugger.detach`);
    }
  }
  async function Jc(e2, t, n = Math.random) {
    if (![t.startX, t.startY, t.viewportWidth, t.viewportHeight].every(Number.isFinite))
      throw Error(`拖拽参数不是有效数字`);
    if (t.viewportWidth < 2 || t.viewportHeight < 2) throw Error(`页面视口尺寸无效`);
    if (t.startX < 0 || t.startY < 0 || t.startX > t.viewportWidth || t.startY > t.viewportHeight)
      throw Error(`拖拽起点不在当前视口内`);
    if (t.targetToken && !/^p-[a-z0-9-]{8,80}$/i.test(t.targetToken))
      throw Error(`拖拽目标控件标记无效`);
    let r = { tabId: e2 }, i = Date.now() + bgPlatformState.wc, a = false, o = false, s = false, c, l2 = { x: t.startX, y: t.startY }, u = false, d = () => {
      if (s || !o) throw Error(`拖拽会话已经结束`);
      K(i);
    }, f = (e3, t2, n2 = i) => G(r, `Input.dispatchMouseEvent`, { type: e3, x: l2.x, y: l2.y, pointerType: `mouse`, ...t2 }, n2);
    try {
      if (a = true, await Dc(() => chrome.debugger.attach(r, `1.3`), i, `debugger.attach`), o = true, await G(r, `Page.bringToFront`, void 0, i), await G(r, `Input.setIgnoreInputEvents`, { ignore: false }, i), t.targetToken) {
        let e3 = await Pc(r, t.targetToken, { kind: `center` }, i, t.frameTarget);
        if (!e3?.hit) throw Error(`滑块把手在拖动前已重绘、移位或被遮挡`);
        l2 = { x: e3.x, y: e3.y };
      }
      let s2 = bgPlatformState.lc.get(e2) ?? {
        x: 1 + n() * (t.viewportWidth - 2),
        y: 1 + n() * (t.viewportHeight - 2)
      };
      for (let e3 of fc(s2, l2, n))
        await G(
          r,
          `Input.dispatchMouseEvent`,
          { type: `mouseMoved`, x: e3.x, y: e3.y, buttons: 0, pointerType: `mouse` },
          i
        ), await bgPlatformState.q(5 + Math.round(n() * 8));
      await bgPlatformState.q(80 + Math.round(n() * 70)), await f(`mousePressed`, { button: `left`, buttons: 1, clickCount: 1 }), u = true, await bgPlatformState.q(30 + Math.round(n() * 40));
    } catch (e3) {
      throw u && (u = false, await Oc(
        () => chrome.debugger.sendCommand(r, `Input.dispatchMouseEvent`, {
          type: `mouseReleased`,
          x: l2.x,
          y: l2.y,
          button: `left`,
          buttons: 0,
          clickCount: 1,
          pointerType: `mouse`
        }),
        `中断后补发 mouseReleased`
      )), o = false, a && await Oc(() => chrome.debugger.detach(r), `debugger.detach`), e3;
    }
    return {
      get current() {
        return { ...l2 };
      },
      async screenshot() {
        d();
        let e3 = await Dc(
          () => chrome.debugger.sendCommand(r, `Page.captureScreenshot`, {
            format: `png`,
            fromSurface: true,
            captureBeyondViewport: false
          }),
          Math.min(i, Date.now() + bgPlatformState.Tc),
          `CDP Page.captureScreenshot`,
          bgPlatformState.Tc
        );
        if (!e3.data) throw Error(`拖拽过程中 CDP 截图返回空数据`);
        return e3.data;
      },
      async moveBy(e3) {
        d();
        for (let n2 of e3)
          Gc(n2, t.viewportWidth, t.viewportHeight), l2 = { x: n2.x, y: n2.y }, await f(`mouseMoved`, { button: `left`, buttons: 1 }), n2.delayMs > 0 && await bgPlatformState.q(Math.min(5e3, n2.delayMs));
      },
      release: () => c || (s ? Promise.resolve() : (s = true, c = (async () => {
        try {
          u && (u = false, await Oc(
            () => chrome.debugger.sendCommand(r, `Input.dispatchMouseEvent`, {
              type: `mouseReleased`,
              x: l2.x,
              y: l2.y,
              button: `left`,
              buttons: 0,
              clickCount: 1,
              pointerType: `mouse`
            }),
            `CDP Input.dispatchMouseEvent(mouseReleased)`
          )), await bgPlatformState.q(90 + Math.round(n() * 70)), bgPlatformState.lc.set(e2, { ...l2 });
        } finally {
          o = false, a && await Oc(() => chrome.debugger.detach(r), `debugger.detach`);
        }
      })(), c))
    };
  }
  function Yc(e2) {
    bgPlatformState.lc.delete(e2);
  }
  function X(e2) {
    let t = bgPlatformState.$p.then(e2, e2);
    return bgPlatformState.$p = t.then(
      () => void 0,
      () => void 0
    ), t;
  }
  function rm(e2) {
    let t = bgPlatformState.em.then(e2, e2);
    return bgPlatformState.em = t.then(
      () => void 0,
      () => void 0
    ), t;
  }
  function im() {
    let e2 = chrome.runtime.getManifest();
    return e2.version_name ?? e2.version;
  }
  function $() {
    chrome.runtime.sendMessage({ type: `STATUS_CHANGED` }).catch(() => {
    });
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
    $
  });
  function initializeBackgroundPlatform(step) {
    switch (step) {
      case 0: {
        bgPlatformState.t = {
          async get(e2, t) {
            return (await chrome.storage.local.get(e2))[e2] ?? t;
          },
          async set(e2, t) {
            await chrome.storage.local.set({ [e2]: t });
          },
          async setMany(e2) {
            await chrome.storage.local.set(e2);
          },
          async remove(e2) {
            await chrome.storage.local.remove(e2);
          }
        };
        break;
      }
      case 1: {
        bgPlatformState.n = {
          async get(e2, t) {
            return (await chrome.storage.session.get(e2))[e2] ?? t;
          },
          async set(e2, t) {
            await chrome.storage.session.set({ [e2]: t });
          },
          async remove(e2) {
            await chrome.storage.session.remove(e2);
          }
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
          subscriptionSource: `subscriptionSource`
        };
        break;
      }
      case 113: {
        bgPlatformState.ea = /* @__PURE__ */ new Map();
        break;
      }
      case 114: {
        bgPlatformState.ta = { APP_DATA: `checkin:app-data`, BALANCE: `checkin:balance` };
        break;
      }
      case 194: {
        bgPlatformState.lc = /* @__PURE__ */ new Map();
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
        bgPlatformState.yc = /* @__PURE__ */ new Set([`click`, `double`, `right`, `long-press`]);
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
        bgPlatformState.q = (e2) => new Promise((t) => setTimeout(t, e2));
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
          get: (e2) => chrome.tabs.get(e2).catch(() => void 0),
          queryWindow: (e2) => chrome.tabs.query({ windowId: e2 }).catch(() => []),
          remove: (e2) => chrome.tabs.remove(e2)
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

  // src/modules/slider/service.js
  var bgSliderState = { store: {} };
  function $c(e2, t) {
    return { width: e2, height: t, data: new Uint8ClampedArray(e2 * t * 4) };
  }
  function el(e2, t) {
    let n = Math.max(1, Math.round(t.width)), r = Math.max(1, Math.round(t.height)), i = $c(n, r), a = Math.round(t.x), o = Math.round(t.y);
    for (let t2 = 0; t2 < r; t2 += 1) {
      let r2 = o + t2;
      if (!(r2 < 0 || r2 >= e2.height))
        for (let o2 = 0; o2 < n; o2 += 1) {
          let s = a + o2;
          if (s < 0 || s >= e2.width) continue;
          let c = (r2 * e2.width + s) * 4, l2 = (t2 * n + o2) * 4;
          i.data[l2] = e2.data[c], i.data[l2 + 1] = e2.data[c + 1], i.data[l2 + 2] = e2.data[c + 2], i.data[l2 + 3] = e2.data[c + 3];
        }
    }
    return i;
  }
  function tl(e2, t) {
    let n = t * 4;
    return 0.299 * e2[n] + 0.587 * e2[n + 1] + 0.114 * e2[n + 2];
  }
  function nl(e2) {
    let t = new Float32Array(e2.width * e2.height);
    for (let n = 0; n < t.length; n += 1) t[n] = tl(e2.data, n);
    return t;
  }
  function rl(e2, t, n, r, i) {
    let a = e2[n], o = n % t, s = Math.floor(n / t), c = -1 / 0, l2 = 0;
    for (let n2 = 0; n2 < e2.length; n2 += 1) {
      let a2 = e2[n2];
      if (!Number.isFinite(a2)) continue;
      l2 += 1;
      let u = n2 % t, d = Math.floor(n2 / t);
      Math.abs(u - o) <= r && Math.abs(d - s) <= i || a2 > c && (c = a2);
    }
    return Number.isFinite(c) ? { margin: Math.max(0, a - c), candidateCount: l2 } : { candidateCount: l2 };
  }
  function il(e2, t, n = 0.4) {
    let r = e2.width, i = e2.height, a = t.width, o = t.height;
    if (a > r || o > i || a < 1 || o < 1) return null;
    let s = a * o, c = [], l2 = 0;
    for (let e3 = 0; e3 < s; e3 += 1) {
      if (t.data[e3 * 4 + 3] < 32) continue;
      let n2 = tl(t.data, e3);
      c.push({ x: e3 % a, y: Math.floor(e3 / a), value: n2, centered: 0 }), l2 += n2;
    }
    let u = c.length;
    if (u === 0) return null;
    let d = l2 / u, f = 0;
    for (let e3 of c) e3.centered = e3.value - d, f += e3.centered ** 2;
    let p = Math.sqrt(f / u), m = nl(e2), h = r - a, g = i - o, _ = h + 1, v = new Float32Array(_ * (g + 1));
    v.fill(-1 / 0);
    let y = -1, b = -1 / 0, x = u === s, S, C, w = r + 1;
    if (x) {
      S = new Float64Array(w * (i + 1)), C = new Float64Array(w * (i + 1));
      for (let e3 = 0; e3 < i; e3 += 1) {
        let t2 = 0, n2 = 0;
        for (let i2 = 0; i2 < r; i2 += 1) {
          let a2 = m[e3 * r + i2];
          t2 += a2, n2 += a2 * a2;
          let o2 = (e3 + 1) * w + i2 + 1;
          S[o2] = S[e3 * w + i2 + 1] + t2, C[o2] = C[e3 * w + i2 + 1] + n2;
        }
      }
    }
    let T = (e3, t2) => {
      let n2 = e3 + a, r2 = t2 + o, i2 = S[r2 * w + n2] - S[t2 * w + n2] - S[r2 * w + e3] + S[t2 * w + e3], s2 = C[r2 * w + n2] - C[t2 * w + n2] - C[r2 * w + e3] + C[t2 * w + e3], c2 = i2 / u;
      return { mean: c2, variance: Math.max(0, s2 / u - c2 * c2) };
    }, E = (e3, t2) => {
      if (x) {
        let n3 = T(e3, t2);
        if (p < 1) return 1 - Math.abs(n3.mean - d) / 255 - 0.3 * Math.sqrt(n3.variance) / 255;
        let i3 = Math.sqrt(n3.variance);
        if (i3 < 1) return null;
        let a3 = 0;
        for (let i4 of c) {
          let o3 = m[(t2 + i4.y) * r + e3 + i4.x];
          a3 += i4.centered * (o3 - n3.mean);
        }
        return a3 / (u * p * i3);
      }
      let n2 = 0;
      for (let i3 of c) n2 += m[(t2 + i3.y) * r + e3 + i3.x];
      let i2 = n2 / u;
      if (p < 1) {
        let n3 = 0;
        for (let i3 of c) {
          let a4 = m[(t2 + i3.y) * r + e3 + i3.x];
          n3 += a4 * a4;
        }
        let a3 = Math.max(0, n3 / u - i2 * i2);
        return 1 - Math.abs(i2 - d) / 255 - 0.3 * Math.sqrt(a3) / 255;
      }
      let a2 = 0, o2 = 0;
      for (let n3 of c) {
        let s3 = m[(t2 + n3.y) * r + e3 + n3.x];
        o2 += n3.centered * (s3 - i2), a2 += (s3 - i2) ** 2;
      }
      let s2 = Math.sqrt(a2 / u);
      return s2 < 1 ? null : o2 / (u * p * s2);
    };
    if (p < 1) {
      let e3 = 0, t2 = 0;
      for (let n3 of m) e3 += n3, t2 += n3 * n3;
      let n2 = e3 / m.length, r2 = Math.max(0, t2 / m.length - n2 * n2);
      if (Math.sqrt(r2) < 1 && Math.abs(n2 - d) < 1) return null;
      for (let e4 = 0; e4 <= g; e4 += 1)
        for (let t3 = 0; t3 <= h; t3 += 1) {
          let n3 = E(t3, e4);
          if (n3 == null) continue;
          let r3 = e4 * _ + t3;
          v[r3] = n3, n3 > b && (b = n3, y = r3);
        }
    } else
      for (let e3 = 0; e3 <= g; e3 += 1)
        for (let t2 = 0; t2 <= h; t2 += 1) {
          let n2 = E(t2, e3);
          if (n2 == null) continue;
          let r2 = e3 * _ + t2;
          v[r2] = n2, n2 > b && (b = n2, y = r2);
        }
    if (y < 0 || b < n) return null;
    let D = rl(v, _, y, Math.max(2, Math.round(a * 0.25)), Math.max(2, Math.round(o * 0.25)));
    return {
      x: y % _,
      y: Math.floor(y / _),
      confidence: b,
      confidenceMargin: D.margin,
      candidateCount: D.candidateCount
    };
  }
  function al(e2) {
    let t = e2.width, n = e2.height, r = -1, i = -1, a = 0, o = 0;
    for (let s2 = 0; s2 < e2.height; s2 += 1)
      for (let c2 = 0; c2 < e2.width; c2 += 1)
        e2.data[(s2 * e2.width + c2) * 4 + 3] < 24 ? a += 1 : (o += 1, t = Math.min(t, c2), n = Math.min(n, s2), r = Math.max(r, c2), i = Math.max(i, s2));
    let s = e2.width * e2.height;
    if (!(a / Math.max(1, s) >= 0.08 && o / Math.max(1, s) >= 0.015) || r < t || i < n)
      return {
        image: e2,
        originalWidth: e2.width,
        originalHeight: e2.height,
        bounds: { x: 0, y: 0, width: e2.width, height: e2.height },
        shapedAlpha: false
      };
    let c = Math.max(0, t - 1), l2 = Math.max(0, n - 1), u = Math.min(e2.width - 1, r + 1), d = Math.min(e2.height - 1, i + 1), f = { x: c, y: l2, width: u - c + 1, height: d - l2 + 1 };
    return {
      image: el(e2, f),
      originalWidth: e2.width,
      originalHeight: e2.height,
      bounds: f,
      shapedAlpha: true
    };
  }
  function ol(e2) {
    let { width: t, height: n } = e2, r = new Uint8Array(t * n), i = new Int32Array(t * n), a = 0, o = 0, s = (t2) => {
      r[t2] || e2.data[t2 * 4 + 3] >= 32 || (r[t2] = 1, i[o++] = t2);
    };
    for (let e3 = 0; e3 < t; e3 += 1) s(e3), s((n - 1) * t + e3);
    for (let e3 = 0; e3 < n; e3 += 1) s(e3 * t), s(e3 * t + t - 1);
    for (; a < o; ) {
      let e3 = i[a++], n2 = e3 % t;
      n2 > 0 && s(e3 - 1), n2 + 1 < t && s(e3 + 1), e3 >= t && s(e3 - t), e3 + t < r.length && s(e3 + t);
    }
    let c = new Uint8ClampedArray(e2.data);
    for (let e3 = 0; e3 < r.length; e3 += 1) !r[e3] && c[e3 * 4 + 3] < 32 && (c[e3 * 4 + 3] = 255);
    return { width: t, height: n, data: c };
  }
  function sl(e2) {
    let { width: t, height: n } = e2;
    if (t < 12 || n < 12) return null;
    let r = [[], [], []], i = (n2, i2) => {
      let a2 = (i2 * t + n2) * 4;
      r[0].push(e2.data[a2]), r[1].push(e2.data[a2 + 1]), r[2].push(e2.data[a2 + 2]);
    };
    for (let e3 = 0; e3 < t; e3 += 1) for (let t2 = 0; t2 < 2; t2 += 1) i(e3, t2), i(e3, n - 1 - t2);
    for (let e3 = 2; e3 < n - 2; e3 += 1) for (let n2 = 0; n2 < 2; n2 += 1) i(n2, e3), i(t - 1 - n2, e3);
    if (r[0].length < 24) return null;
    let a = (e3) => {
      let t2 = [...e3].sort((e4, t3) => e4 - t3);
      return t2[Math.floor(t2.length / 2)];
    }, o = [a(r[0]), a(r[1]), a(r[2])], s = a(r[0].map((e3) => Math.abs(e3 - o[0]))), c = Math.max(26, Math.min(80, s * 2.6 + 22)), l2 = $c(t, n), u = 0;
    for (let r2 = 0; r2 < t * n; r2 += 1) {
      let t2 = r2 * 4, n2 = (Math.abs(e2.data[t2] - o[0]) + Math.abs(e2.data[t2 + 1] - o[1]) + Math.abs(e2.data[t2 + 2] - o[2])) / 3 >= c;
      l2.data[t2] = e2.data[t2], l2.data[t2 + 1] = e2.data[t2 + 1], l2.data[t2 + 2] = e2.data[t2 + 2], l2.data[t2 + 3] = n2 ? 255 : 0, n2 && (u += 1);
    }
    let d = u / (t * n);
    return d < 0.18 || d > 0.9 ? null : ol(l2);
  }
  function cl(e2) {
    let t = new Uint8Array(256);
    for (let e3 = 0; e3 < 64; e3 += 1)
      t[`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`.charCodeAt(e3)] = e3;
    let n = e2.length;
    for (; n > 0 && e2[n - 1] === `=`; ) --n;
    let r = Math.floor(n * 3 / 4), i = new Uint8Array(r), a = 0;
    for (let o = 0; o < n; o += 4) {
      let n2 = t[e2.charCodeAt(o)], s = t[e2.charCodeAt(o + 1)], c = t[e2.charCodeAt(o + 2)], l2 = t[e2.charCodeAt(o + 3)];
      i[a++] = n2 << 2 | s >> 4, a < r && (i[a++] = (s & 15) << 4 | c >> 2), a < r && (i[a++] = (c & 3) << 6 | l2);
    }
    return i;
  }
  async function ll(e2) {
    if (e2.size > bgSliderState.Xc) throw Error(`滑块图片超过允许大小`);
    let t = await createImageBitmap(e2);
    try {
      if (!Number.isFinite(t.width) || !Number.isFinite(t.height) || t.width < 1 || t.height < 1 || t.width * t.height > bgSliderState.Zc)
        throw Error(`滑块图片解码尺寸无效或超过允许大小`);
      let e3 = new OffscreenCanvas(t.width, t.height).getContext(`2d`);
      if (!e3) throw Error(`无法创建滑块图像上下文`);
      e3.drawImage(t, 0, 0);
      let n = e3.getImageData(0, 0, t.width, t.height);
      return { width: n.width, height: n.height, data: n.data };
    } finally {
      t.close();
    }
  }
  async function ul(e2) {
    let t = cl(e2);
    return ll(new Blob([t.buffer], { type: `image/png` }));
  }
  async function dl(e2) {
    let t = new AbortController(), n = setTimeout(() => t.abort(), bgSliderState.Qc);
    try {
      let n2 = await fetch(e2.value, {
        credentials: `omit`,
        cache: `no-store`,
        referrerPolicy: `no-referrer`,
        signal: t.signal
      });
      if (!n2.ok) throw Error(`滑块图片读取失败（HTTP ${n2.status}）`);
      return await ll(await n2.blob());
    } finally {
      clearTimeout(n);
    }
  }
  function pl(e2, t) {
    return new Promise((n, r) => {
      let i = false, a = setTimeout(() => {
        i || (i = true, r(Error(`${t} 超时`)));
      }, bgSliderState.fl);
      e2().then(
        (e3) => {
          i || (i = true, clearTimeout(a), n(e3));
        },
        (e3) => {
          i || (i = true, clearTimeout(a), r(e3));
        }
      );
    });
  }
  async function ml(e2) {
    let t = { tabId: e2 }, n = false;
    try {
      n = true, await pl(() => chrome.debugger.attach(t, `1.3`), `CDP debugger.attach`), await pl(() => chrome.debugger.sendCommand(t, `Page.bringToFront`), `CDP Page.bringToFront`);
      let e3 = await pl(
        () => chrome.debugger.sendCommand(t, `Page.captureScreenshot`, {
          format: `png`,
          fromSurface: true,
          captureBeyondViewport: false
        }),
        `CDP Page.captureScreenshot`
      );
      if (!e3.data) throw Error(`CDP 截图返回空数据`);
      return await ul(e3.data);
    } finally {
      n && await pl(() => chrome.debugger.detach(t), `CDP debugger.detach`).catch(() => {
      });
    }
  }
  function hl(e2) {
    return e2.width >= 80 && e2.height >= 40 && e2.width * e2.height <= bgSliderState.Zc;
  }
  function gl(e2) {
    return e2.width >= 6 && e2.height >= 6 && e2.width * e2.height <= 4e6;
  }
  function _l(e2, t) {
    let n = e2.width / Math.max(1, e2.height), r = t.width / Math.max(1, t.height);
    return Math.abs(Math.log(n / r)) <= 0.09;
  }
  function vl(e2, t, n) {
    if (t = Math.round(t), n = Math.round(n), !Number.isFinite(t) || !Number.isFinite(n) || t < 1 || n < 1 || t * n > bgSliderState.Zc)
      throw Error(`滑块图片缩放尺寸无效`);
    if (e2.width === t && e2.height === n) return e2;
    let r = new OffscreenCanvas(e2.width, e2.height), i = new OffscreenCanvas(t, n), a = r.getContext(`2d`), o = i.getContext(`2d`);
    if (!a || !o) throw Error(`无法缩放滑块图片`);
    a.putImageData(new ImageData(new Uint8ClampedArray(e2.data), e2.width, e2.height), 0, 0), o.imageSmoothingEnabled = true, o.imageSmoothingQuality = `high`, o.drawImage(r, 0, 0, t, n);
    let s = o.getImageData(0, 0, t, n);
    return { width: t, height: n, data: s.data };
  }
  async function yl(e2, t) {
    if (t.backgroundSource && (t.pieceSource || t.referenceBackgroundSource))
      try {
        let e3 = await dl(t.backgroundSource), [n2, r2] = await Promise.all([
          t.pieceSource ? dl(t.pieceSource).catch(() => void 0) : void 0,
          t.referenceBackgroundSource ? dl(t.referenceBackgroundSource).catch(() => void 0) : void 0
        ]);
        if (hl(e3) && _l(e3, t.backgroundRect) && (!n2 || gl(n2) && (!t.pieceRect || _l(n2, t.pieceRect))) && (!r2 || hl(r2) && _l(r2, t.backgroundRect)) && (n2 || r2)) {
          let i2 = e3.width / t.backgroundRect.width, a2 = e3.height / t.backgroundRect.height, o2 = n2 && t.pieceRect ? vl(n2, t.pieceRect.width * i2, t.pieceRect.height * a2) : n2;
          return {
            background: e3,
            referenceBackground: r2 ? vl(r2, e3.width, e3.height) : void 0,
            template: o2 ? al(o2) : void 0,
            source: `raw-image`,
            imageScaleX: i2,
            imageScaleY: a2,
            cropOffsetX: 0,
            cropOffsetPieceX: 0
          };
        }
      } catch {
      }
    let n = await ml(e2), r = n.width / t.viewportWidth, i = n.height / t.viewportHeight;
    if (!Number.isFinite(r) || !Number.isFinite(i) || r < 0.25 || i < 0.25 || r > 8 || i > 8)
      throw Error(`无法建立截图像素与页面坐标的比例`);
    let a = t.backgroundRect.x * r, o = el(n, {
      x: a,
      y: t.backgroundRect.y * i,
      width: t.backgroundRect.width * r,
      height: t.backgroundRect.height * i
    }), s = a - Math.round(a), c, l2 = 0;
    if (t.pieceRect) {
      let e3 = t.pieceRect.x * r, a2 = el(n, {
        x: e3,
        y: t.pieceRect.y * i,
        width: t.pieceRect.width * r,
        height: t.pieceRect.height * i
      });
      l2 = e3 - Math.round(e3), c = al(sl(a2) ?? a2);
    }
    return {
      background: o,
      template: c,
      source: `viewport-screenshot`,
      imageScaleX: r,
      imageScaleY: i,
      cropOffsetX: s,
      cropOffsetPieceX: l2
    };
  }
  function Sl(e2) {
    bgSliderState.xl = true, bgSliderState.bl = null;
    try {
      e2.terminate();
    } catch {
    }
  }
  function Cl() {
    return bgSliderState.bl || (bgSliderState.xl ? Promise.resolve(null) : (bgSliderState.bl = new Promise((e2) => {
      try {
        let t = new Worker(chrome.runtime.getURL(`opencv/template-matching-worker.js`)), n = setTimeout(() => {
          Sl(t), e2(null);
        }, 8e3), r = (i) => {
          (i.data === `ready` || i.data === `error`) && (clearTimeout(n), t.removeEventListener(`message`, r), i.data === `ready` ? e2(t) : (Sl(t), e2(null)));
        };
        t.addEventListener(`message`, r), t.addEventListener(`error`, () => {
          clearTimeout(n), Sl(t), e2(null);
        });
      } catch {
        bgSliderState.xl = true, bgSliderState.bl = null, e2(null);
      }
    }), bgSliderState.bl));
  }
  async function wl(e2, t, n = false) {
    let r = await Cl();
    if (!r) return null;
    let i = `slider-match-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return new Promise((a) => {
      let o = (e3) => {
        clearTimeout(l2), r.removeEventListener(`message`, s), r.removeEventListener(`error`, c), a(e3);
      }, s = (e3) => {
        e3.data?.id === i && (e3.data.error || e3.data.uniform || e3.data.maskUnsupported ? o(null) : o({ x: e3.data.x, y: e3.data.y, confidence: e3.data.maxVal }));
      }, c = () => {
        Sl(r), o(null);
      }, l2 = setTimeout(() => {
        Sl(r), o(null);
      }, 12e3);
      r.addEventListener(`message`, s), r.addEventListener(`error`, c);
      let u = new ImageData(new Uint8ClampedArray(e2.data), e2.width, e2.height), d = new ImageData(new Uint8ClampedArray(t.data), t.width, t.height);
      try {
        r.postMessage({ id: i, search: u, template: d, useMask: n }, [u.data.buffer, d.data.buffer]);
      } catch {
        Sl(r), o(null);
      }
    });
  }
  function Tl(e2) {
    let t = nl(e2), n = new Float32Array(e2.width * e2.height);
    for (let r = 1; r < e2.height - 1; r += 1)
      for (let i = 1; i < e2.width - 1; i += 1) {
        let a = t[(r - 1) * e2.width + i - 1], o = t[(r - 1) * e2.width + i], s = t[(r - 1) * e2.width + i + 1], c = t[r * e2.width + i - 1], l2 = t[r * e2.width + i + 1], u = t[(r + 1) * e2.width + i - 1], d = t[(r + 1) * e2.width + i], f = t[(r + 1) * e2.width + i + 1], p = -a + s - 2 * c + 2 * l2 - u + f, m = -a - 2 * o - s + u + 2 * d + f;
        n[r * e2.width + i] = Math.hypot(p, m);
      }
    return n;
  }
  function El(e2) {
    let { image: t } = e2, n = [];
    if (!e2.shapedAlpha) {
      for (let e3 = 1; e3 < t.width - 1; e3 += 2) n.push({ x: e3, y: 1 }, { x: e3, y: t.height - 2 });
      for (let e3 = 2; e3 < t.height - 2; e3 += 2) n.push({ x: 1, y: e3 }, { x: t.width - 2, y: e3 });
      return n;
    }
    let r = (e3, n2) => e3 >= 0 && n2 >= 0 && e3 < t.width && n2 < t.height && t.data[(n2 * t.width + e3) * 4 + 3] >= 24;
    for (let e3 = 1; e3 < t.height - 1; e3 += 1)
      for (let i = 1; i < t.width - 1; i += 1)
        r(i, e3) && (!r(i - 1, e3) || !r(i + 1, e3) || !r(i, e3 - 1) || !r(i, e3 + 1)) && n.push({ x: i, y: e3 });
    return n;
  }
  function Dl(e2, t, n, r, i = false) {
    let a = El(t), o = t.image.width, s = t.image.height;
    if (a.length < 18 || o >= e2.width || s >= e2.height) return null;
    let c = Tl(e2), l2 = Math.max(0, Math.round(n)), u = e2.width - o, d = Math.max(4, Math.round(s * 0.22)), f = i ? 0 : Math.max(0, Math.round(r - d)), p = i ? e2.height - s : Math.min(e2.height - s, Math.round(r + d));
    if (l2 > u || f > p) return null;
    let m = u - l2 + 1, h = p - f + 1;
    if (m * h * a.length > 9e7) return null;
    let g = new Float32Array(m * h), _ = -1, v = -1 / 0, y = 0, b = 0;
    for (let t2 = f; t2 <= p; t2 += 1)
      for (let n2 = l2; n2 <= u; n2 += 1) {
        let r2 = 0, i2 = 0;
        for (let o3 of a) {
          let a2 = c[(t2 + o3.y) * e2.width + n2 + o3.x];
          r2 += Math.min(1020, a2), a2 >= 90 && (i2 += 1);
        }
        let o2 = r2 / a.length / 1020, s2 = i2 / a.length, u2 = o2 * 0.72 + s2 * 0.28, d2 = (t2 - f) * m + n2 - l2;
        g[d2] = u2, y += u2, b += u2 * u2, u2 > v && (v = u2, _ = d2);
      }
    if (_ < 0) return null;
    let x = g.length, S = y / x, C = Math.sqrt(Math.max(0, b / x - S * S)), w = C > 0 ? (v - S) / C : 0, T = rl(g, m, _, Math.max(3, Math.round(o * 0.3)), Math.max(2, Math.round(s * 0.25))), E = (T.margin ?? 0) / Math.max(0.01, Math.abs(v)), D = Math.max(0, Math.min(0.99, 0.32 + w * 0.065 + E * 1.8));
    return w < 1.25 || D < 0.46 ? null : {
      x: l2 + _ % m,
      y: f + Math.floor(_ / m),
      confidence: D,
      confidenceMargin: E,
      candidateCount: T.candidateCount,
      method: t.shapedAlpha ? `contour-alpha` : `contour-edge`
    };
  }
  function Ol(e2, t, n, r, i, a) {
    if (e2.width !== t.width || e2.height !== t.height) return null;
    let o = n.image.width, s = n.image.height;
    if (o >= e2.width || s >= e2.height) return null;
    let c = new Float32Array(e2.width * e2.height), l2 = e2.width + 1, u = new Float64Array((e2.width + 1) * (e2.height + 1)), d = 0;
    for (let n2 = 0; n2 < e2.height; n2 += 1) {
      let r2 = 0;
      for (let i2 = 0; i2 < e2.width; i2 += 1) {
        let a2 = n2 * e2.width + i2, o2 = a2 * 4, s2 = (Math.abs(e2.data[o2] - t.data[o2]) + Math.abs(e2.data[o2 + 1] - t.data[o2 + 1]) + Math.abs(e2.data[o2 + 2] - t.data[o2 + 2])) / 3;
        c[a2] = s2, s2 >= 20 && (d += 1), r2 += s2, u[(n2 + 1) * l2 + i2 + 1] = u[n2 * l2 + i2 + 1] + r2;
      }
    }
    let f = d / c.length;
    if (f < 2e-3 || f > 0.35) return null;
    let p = [];
    if (n.shapedAlpha)
      for (let e3 = 0; e3 < s; e3 += 2)
        for (let t2 = 0; t2 < o; t2 += 2)
          n.image.data[(e3 * o + t2) * 4 + 3] >= 24 && p.push({ x: t2, y: e3 });
    let m = (t2, n2) => {
      if (p.length > 0) {
        let r3 = 0;
        for (let i3 of p) r3 += c[(n2 + i3.y) * e2.width + t2 + i3.x];
        return r3 / p.length;
      }
      let r2 = t2 + o, i2 = n2 + s;
      return (u[i2 * l2 + r2] - u[n2 * l2 + r2] - u[i2 * l2 + t2] + u[n2 * l2 + t2]) / (o * s);
    }, h = Math.max(0, Math.round(r)), g = e2.width - o, _ = Math.max(5, Math.round(s * 0.3)), v = a ? 0 : Math.max(0, Math.round(i - _)), y = a ? e2.height - s : Math.min(e2.height - s, Math.round(i + _));
    if (h > g || v > y) return null;
    let b = g - h + 1, x = y - v + 1;
    if (b * x * Math.max(1, p.length) > 9e7) return null;
    let S = new Float32Array(b * x), C = -1, w = -1 / 0, T = 0, E = 0;
    for (let e3 = v; e3 <= y; e3 += 1)
      for (let t2 = h; t2 <= g; t2 += 1) {
        let n2 = m(t2, e3), r2 = (e3 - v) * b + t2 - h;
        S[r2] = n2, T += n2, E += n2 * n2, n2 > w && (w = n2, C = r2);
      }
    if (C < 0 || w < 6) return null;
    let D = T / S.length, O = Math.sqrt(Math.max(0, E / S.length - D * D)), k = O > 0 ? (w - D) / O : 0, A = rl(S, b, C, Math.max(3, Math.round(o * 0.35)), Math.max(3, Math.round(s * 0.35))), ee = (A.margin ?? 0) / Math.max(1, w), te = Math.max(
      0,
      Math.min(
        0.995,
        0.48 + Math.min(0.24, k * 0.045) + Math.min(0.2, ee * 1.8) + Math.min(0.06, w / 500)
      )
    );
    return k < 1.4 || te < 0.55 ? null : {
      x: h + C % b,
      y: v + Math.floor(C / b),
      confidence: te,
      confidenceMargin: ee,
      candidateCount: A.candidateCount,
      method: `background-delta`
    };
  }
  function kl(e2, t = 2) {
    let { image: n } = e2, r = [], i = [], a = [], o = (e3, t2) => e3 >= 0 && t2 >= 0 && e3 < n.width && t2 < n.height ? n.data[(t2 * n.width + e3) * 4 + 3] : 0, s = (e3, t2) => o(e3 - 1, t2) >= 200 && o(e3 + 1, t2) >= 200 && o(e3, t2 - 1) >= 200 && o(e3, t2 + 1) >= 200, c = (e3, t2) => o(e3 - 1, t2) <= 12 && o(e3 + 1, t2) <= 12 && o(e3, t2 - 1) <= 12 && o(e3, t2 + 1) <= 12;
    for (let e3 = 0; e3 < n.height; e3 += t)
      for (let a2 = 0; a2 < n.width; a2 += t) {
        let t2 = o(a2, e3);
        t2 >= 200 && s(a2, e3) ? r.push({ x: a2, y: e3 }) : t2 <= 12 && c(a2, e3) && i.push({ x: a2, y: e3 });
      }
    let l2 = Math.max(1, Math.round(t / 2)), u = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];
    for (let e3 = 1; e3 < n.height - 1; e3 += l2)
      for (let t2 = 1; t2 < n.width - 1; t2 += l2)
        if (!(o(t2, e3) < 200))
          for (let [r2, i2] of u) {
            if (o(t2 + r2, e3 + i2) > 12) continue;
            let s2 = t2 + r2 * 2, c2 = e3 + i2 * 2, l3 = t2 - r2 * 2, u2 = e3 - i2 * 2;
            if (!(s2 < 0 || c2 < 0 || s2 >= n.width || c2 >= n.height) && !(l3 < 0 || u2 < 0 || l3 >= n.width || u2 >= n.height) && !(o(l3, u2) < 200)) {
              a.push({ inX: l3, inY: u2, outX: s2, outY: c2 });
              break;
            }
          }
    return { inside: r, outside: i, boundary: a };
  }
  function Al(e2, t, n, r, i) {
    let a = 0, o = 0;
    for (let s2 of i) {
      let i2 = e2[(r + s2.y) * t + n + s2.x];
      a += i2, o += i2 * i2;
    }
    let s = a / i.length;
    return { mean: s, std: Math.sqrt(Math.max(0, o / i.length - s * s)) };
  }
  function jl(e2, t, n, r, i = false) {
    if (!t.shapedAlpha) return null;
    let a = t.image.width, o = t.image.height;
    if (a >= e2.width || o >= e2.height) return null;
    let s = kl(t);
    if (s.inside.length < 24 || s.outside.length < 12 || s.boundary.length < 20) return null;
    let c = nl(e2), l2 = Math.max(0, Math.round(n)), u = e2.width - a, d = Math.max(4, Math.round(o * 0.25)), f = i ? 0 : Math.max(0, Math.round(r - d)), p = i ? e2.height - o : Math.min(e2.height - o, Math.round(r + d));
    if (l2 > u || f > p) return null;
    let m = u - l2 + 1, h = p - f + 1, g = s.inside.length + s.outside.length + s.boundary.length;
    if (m * h * g > 9e7) return null;
    let _ = new Float32Array(m * h);
    _.fill(-1 / 0);
    let v = -1, y = -1 / 0, b = 0, x = 0, S = 0, C = 0;
    for (let t2 = f; t2 <= p; t2 += 1)
      for (let n2 = l2; n2 <= u; n2 += 1) {
        let r2 = Al(c, e2.width, n2, t2, s.inside), i2 = Al(c, e2.width, n2, t2, s.outside), u2 = Math.abs(i2.mean - r2.mean) / 255, d2 = 1 - Math.min(1, r2.std / 40), p2 = Math.min(1, i2.std / 18);
        if (u2 < 0.08 || r2.std > 46) continue;
        let h2 = Math.sign(i2.mean - r2.mean), g2 = new Int32Array(9), w2 = new Int32Array(9);
        for (let r3 of s.boundary) {
          let i3 = c[(t2 + r3.inY) * e2.width + n2 + r3.inX], s2 = c[(t2 + r3.outY) * e2.width + n2 + r3.outX] - i3, l3 = Math.min(2, Math.floor(r3.inX / a * 3)) + Math.min(2, Math.floor(r3.inY / o * 3)) * 3;
          w2[l3] += 1, Math.abs(s2) >= 12 && Math.sign(s2) === h2 && (g2[l3] += 1);
        }
        let T2 = 1, E2 = 0;
        for (let e3 = 0; e3 < w2.length; e3 += 1) w2[e3] < 5 || (E2 += 1, T2 = Math.min(T2, g2[e3] / w2[e3]));
        if (E2 < 4) continue;
        let D2 = T2;
        if (D2 < 0.55) continue;
        let O2 = D2 * 0.45 + u2 * 0.25 + d2 * 0.18 + p2 * 0.12, k2 = (t2 - f) * m + n2 - l2;
        _[k2] = O2, b += 1, x += O2, S += O2 * O2, O2 > y && (y = O2, v = k2, C = D2);
      }
    if (v < 0) return null;
    let w = x / b, T = Math.sqrt(Math.max(0, S / b - w * w)), E = T > 0 ? (y - w) / T : 0, D = rl(_, m, v, Math.max(3, Math.round(a * 0.4)), Math.max(3, Math.round(o * 0.3))), O = D.margin == null ? void 0 : D.margin / Math.max(0.01, y), k = Math.max(
      0,
      Math.min(0.99, 0.42 + y * 0.38 + Math.min(0.18, E * 0.05) + Math.min(0.16, (O ?? 0) * 1.6))
    ), A = Math.min(k, 0.28 + C * 0.71);
    return !(C >= 0.92) && E < 1.1 || A < 0.5 ? null : {
      x: l2 + v % m,
      y: f + Math.floor(v / m),
      confidence: A,
      confidenceMargin: O,
      candidateCount: D.candidateCount,
      method: `hole-silhouette`
    };
  }
  function Ml(e2) {
    let { width: t, height: n, data: r } = e2.image, i = [], a = (e3, n2) => r[(n2 * t + e3) * 4 + 3] >= 128;
    for (let e3 = 0; e3 < 4; e3 += 1) {
      let r2 = e3 < 2, o = r2 ? t : n, s = r2 ? n : t, c = Math.min(36, Math.max(9, o - 2)), l2 = !r2, u = e3 === 0 || e3 === 2 ? 1 : -1;
      for (let t2 = 0; t2 < c; t2 += 1) {
        let n2 = Math.min(o - 2, Math.max(1, 1 + Math.round((t2 + 0.5) * (o - 2) / c)));
        for (let o2 = 0; o2 < s; o2 += 1) {
          let d = u > 0 ? o2 : s - 1 - o2, f = r2 ? n2 : d, p = r2 ? d : n2;
          if (a(f, p)) {
            i.push({
              x: f,
              y: p,
              normalX: l2,
              normalSign: u,
              bin: e3 * 3 + Math.min(2, Math.floor(t2 / c * 3))
            });
            break;
          }
        }
      }
    }
    return [0, 1, 2, 3].some((e3) => {
      let r2 = i.filter((t2) => Math.floor(t2.bin / 3) === e3).map((e4) => e4.normalX ? e4.x : e4.y);
      return r2.length >= 4 && Math.max(...r2) - Math.min(...r2) >= Math.max(3, Math.min(t, n) * 0.07);
    }) ? i : [];
  }
  function Nl(e2, t, n, r, i = false, a = []) {
    if (!t.shapedAlpha) return null;
    let { width: o, height: s } = t.image;
    if (o >= e2.width || s >= e2.height) return null;
    let c = Ml(t), l2 = new Uint16Array(12);
    for (let e3 of c) l2[e3.bin] += 1;
    let u = Array.from(l2, (e3, t2) => ({ total: e3, bin: t2 })).filter(({ total: e3 }) => e3 >= 2).map(({ bin: e3 }) => e3), d = [0, 1, 2, 3].map((e3) => u.filter((t2) => Math.floor(t2 / 3) === e3).length);
    if (c.length < 24 || u.length < 8 || d.some((e3) => e3 < 2)) return null;
    let f = Math.max(1, Math.min(3, Math.round(Math.min(o, s) / 48))), p = Math.max(0, Math.ceil(n)), m = e2.width - o, h = Math.max(3, Math.round(s * 0.18)), g = Math.max(0, i ? 0 : Math.floor(r - h)), _ = Math.min(e2.height - s, i ? e2.height - s : Math.ceil(r + h));
    if (p > m || g > _) return null;
    let v = m - p + 1, y = _ - g + 1;
    if (v * y * c.length * (f * 2 + 1) > 9e7) return null;
    let b = nl(e2), x = new Float32Array(b.length), S = new Float32Array(b.length), C = e2.width;
    for (let t2 = 1; t2 < e2.height - 1; t2 += 1)
      for (let e3 = 1; e3 < C - 1; e3 += 1) {
        let n2 = t2 * C + e3, r2 = Math.abs(
          b[n2 - C + 1] + 2 * b[n2 + 1] + b[n2 + C + 1] - b[n2 - C - 1] - 2 * b[n2 - 1] - b[n2 + C - 1]
        ), i2 = Math.abs(
          b[n2 + C - 1] + 2 * b[n2 + C] + b[n2 + C + 1] - b[n2 - C - 1] - 2 * b[n2 - C] - b[n2 - C + 1]
        );
        x[n2] = Math.max(0, r2 - i2 * 0.3), S[n2] = Math.max(0, i2 - r2 * 0.3);
      }
    let w = new Float32Array(v * y);
    w.fill(-1 / 0);
    let T = new Uint16Array(12), E = (t2, n2, r2, i2, a2) => {
      let o2 = a2 ? n2 + i2 : n2, s2 = a2 ? r2 : r2 + i2;
      return o2 < 0 || s2 < 0 || o2 >= C || s2 >= e2.height ? 0 : t2[s2 * C + o2];
    }, D = -1, O = -1 / 0;
    for (let e3 = g; e3 <= _; e3 += 1)
      for (let t2 = p; t2 <= m; t2 += 1) {
        if (a.some((e4) => Math.abs(t2 - e4.x) <= e4.radius)) continue;
        T.fill(0);
        let n2 = 0, r2 = 0;
        for (let i3 of c) {
          let a2 = i3.normalX ? x : S, o3 = t2 + i3.x, s3 = e3 + i3.y, c2 = 0;
          for (let e4 = -f; e4 <= f; e4 += 1) c2 = Math.max(c2, E(a2, o3, s3, e4, i3.normalX));
          let l3 = (f + 2) * i3.normalSign, u3 = E(a2, o3, s3, -l3, i3.normalX), d2 = E(a2, o3, s3, l3, i3.normalX);
          c2 >= 56 && c2 >= Math.max(u3, d2) * 0.75 && (T[i3.bin] += 1, r2 += 1), n2 += c2 / (c2 + 64);
        }
        let i2 = r2 / c.length, o2 = 1;
        for (let e4 = 0; e4 < l2.length; e4 += 1) l2[e4] < 2 || (o2 = Math.min(o2, T[e4] / l2[e4]));
        let s2 = o2 * 0.6 + i2 * 0.3 + n2 / c.length * 0.1, u2 = (e3 - g) * v + t2 - p;
        w[u2] = s2, o2 >= 0.6 && i2 >= 0.8 && s2 > O && (D = u2, O = s2);
      }
    if (D < 0 || O < 0.7) return null;
    let k = rl(
      w,
      v,
      D,
      Math.max(f * 2 + 1, Math.round(o * 0.35)),
      Math.max(f * 2 + 1, Math.round(s * 0.25))
    ), A = k.margin == null ? void 0 : k.margin / O;
    return A != null && A < 0.035 ? null : {
      x: p + D % v,
      y: g + Math.floor(D / v),
      confidence: Math.min(0.98, O),
      confidenceMargin: A,
      candidateCount: k.candidateCount,
      method: `outline-profile`
    };
  }
  function Pl(e2) {
    return e2.method.split(`+`).some((e3) => e3 === `hole-silhouette` || e3 === `outline-profile`) && e2.confidence >= 0.66 && (e2.confidenceMargin == null || e2.confidenceMargin >= 0.015);
  }
  function Fl(e2) {
    if (!e2.shapedAlpha) return true;
    let t = kl(e2);
    return t.inside.length < 24 || Al(nl(e2.image), e2.image.width, 0, 0, t.inside).std >= 10;
  }
  function Il(e2, t, n, r = false) {
    if (r) return { image: e2, offsetY: 0 };
    let i = Math.max(5, Math.round(t.image.height * 0.28)), a = Math.max(0, Math.round(n - i)), o = Math.min(e2.height, Math.round(n + t.image.height + i));
    return { image: el(e2, { x: 0, y: a, width: e2.width, height: o - a }), offsetY: a };
  }
  function Ll(e2, t) {
    if (e2.length === 0) return null;
    let n = Math.max(4, t * 0.16), r = [...e2].sort((e3, t2) => t2.confidence - e3.confidence), i = r.filter(Pl);
    if (i.length > 0) {
      let e3 = i[0];
      return {
        candidate: e3,
        rivalCount: i.filter((t2) => Math.abs(t2.x - e3.x) > n && t2.confidence >= e3.confidence * 0.88).length
      };
    }
    let a = r[0], o = r.filter((e3) => Math.abs(e3.x - a.x) <= n), s = r.filter((e3) => Math.abs(e3.x - a.x) > n && e3.confidence >= a.confidence * 0.88);
    if (o.length >= 2) {
      let e3 = o.reduce((e4, t2) => e4 + Math.max(0.01, t2.confidence), 0);
      return {
        candidate: {
          ...a,
          x: o.reduce((e4, t2) => e4 + t2.x * t2.confidence, 0) / e3,
          y: o.reduce((e4, t2) => e4 + t2.y * t2.confidence, 0) / e3,
          confidence: Math.min(0.995, a.confidence + 0.08),
          method: o.map((e4) => e4.method).join(`+`),
          candidateCount: o.reduce((e4, t2) => e4 + (t2.candidateCount ?? 0), 0)
        },
        rivalCount: s.length
      };
    }
    return { candidate: a, rivalCount: s.length };
  }
  function Rl(e2, t) {
    let n = e2.pieceRect?.width ?? Math.max(28, Math.min(64, e2.handleRect.width)), r = e2.pieceRect?.height ?? n, i = Math.max(8, Math.min(t.background.width - 1, Math.round(n * t.imageScaleX))), a = Math.max(8, Math.min(t.background.height - 1, Math.round(r * t.imageScaleY))), o = $c(i, a);
    return o.data.fill(255), {
      image: o,
      originalWidth: i,
      originalHeight: a,
      bounds: { x: 0, y: 0, width: i, height: a },
      shapedAlpha: false
    };
  }
  async function Bl(e2, t, n = []) {
    let r = t.template ?? Rl(e2, t);
    if (r.image.width >= t.background.width || r.image.height >= t.background.height) return null;
    let i = e2.pieceRect?.x ?? e2.backgroundRect.x, a = Math.max(
      0,
      (i - e2.backgroundRect.x) * t.imageScaleX + r.bounds.x * (e2.pieceRect && t.source === `raw-image` ? e2.pieceRect.width / Math.max(1, r.originalWidth) * t.imageScaleX : 1)
    ), o = e2.pieceRect?.y ?? e2.backgroundRect.y, s = Math.max(
      0,
      (o - e2.backgroundRect.y) * t.imageScaleY + r.bounds.y * (e2.pieceRect && t.source === `raw-image` ? e2.pieceRect.height / Math.max(1, r.originalHeight) * t.imageScaleY : 1)
    ), c = e2.pieceRect != null, l2 = t.template == null, u = [], d = a + Math.max(3, r.image.width * bgSliderState.zl);
    if (d > t.background.width - r.image.width) return null;
    if (t.referenceBackground) {
      let e3 = Ol(t.background, t.referenceBackground, r, d, s, !c);
      e3 && u.push(e3);
    }
    let f = jl(t.background, r, d, s, !c);
    f && u.push(f);
    let p = (e3) => e3 != null && Pl(e3) && !n.some((t2) => Math.abs(e3.x - t2.x) <= t2.radius), m = p(f) ? null : Nl(t.background, r, d, s, !c, n);
    m && u.push(m);
    let h = r.shapedAlpha && ![f, m].some(p), g = [f, m].some(p), _ = g ? null : Dl(t.background, r, d, s, !c);
    _ && u.push(_);
    let v = Il(t.background, r, s, !c), y = l2 || g ? null : await wl(v.image, r.image, r.shapedAlpha);
    y && y.confidence >= 0.42 && y.x >= d && u.push({ ...y, y: y.y + v.offsetY, method: `opencv`, candidateCount: 1 });
    let b = (v.image.width - r.image.width + 1) * (v.image.height - r.image.height + 1) * r.image.width * r.image.height;
    if (!l2 && !g && b > 0 && b <= 9e7) {
      let e3 = il(v.image, r.image, r.shapedAlpha ? 0.28 : 0.36);
      e3 && e3.x >= d && u.push({ ...e3, y: e3.y + v.offsetY, method: `ncc` });
    }
    let x = n.length ? u.filter((e3) => !n.some((t2) => Math.abs(e3.x - t2.x) <= t2.radius)) : u;
    if (x.length === 0) return null;
    let S = Ll(x, r.image.width);
    if (!S) return null;
    let { candidate: C, rivalCount: w } = S, T = t.source === `raw-image` && x.some(
      (e3) => (e3.method === `ncc` || e3.method === `background-delta`) && e3.confidence >= 0.86 && e3.confidenceMargin != null && e3.confidenceMargin >= 0.05 && Math.abs(e3.x - C.x) <= Math.max(2, r.image.width * 0.06) && Math.abs(e3.y - C.y) <= Math.max(2, r.image.height * 0.06)
    ), E = h && !T, D = Pl(C), O = u.length >= 2 && C.method.includes(`+`) ? 0.48 : D ? 0.58 : r.shapedAlpha ? 0.62 : 0.68;
    if (C.confidence < O) return null;
    let k = E && !D ? Math.min(C.confidence, 0.6) : C.confidence;
    return {
      x: C.x,
      y: C.y,
      confidence: k,
      confidenceMargin: C.confidenceMargin,
      method: C.method,
      candidateCount: C.candidateCount ?? u.length,
      rivalCount: D ? w : E ? Math.max(1, w) : w,
      templateWidth: r.image.width,
      templateHeight: r.image.height,
      templateOffsetX: r.bounds.x,
      templateOffsetY: r.bounds.y,
      templateOriginalWidth: r.originalWidth,
      templateOriginalHeight: r.originalHeight
    };
  }
  function Vl(e2) {
    return !!e2 && [e2.x, e2.y, e2.width, e2.height].every(Number.isFinite) && e2.width > 0 && e2.height > 0;
  }
  function Hl(e2, t, n) {
    let r = Math.max(0, e2.x), i = Math.max(0, e2.y), a = Math.min(t, e2.x + e2.width), o = Math.min(n, e2.y + e2.height);
    return Math.max(0, a - r) * Math.max(0, o - i) / Math.max(1, e2.width * e2.height);
  }
  function Ul(e2) {
    if (!Number.isFinite(e2.viewportWidth) || !Number.isFinite(e2.viewportHeight) || e2.viewportWidth < 100 || e2.viewportHeight < 100)
      return `页面视口尺寸无效`;
    if (!Vl(e2.panelRect) || !Vl(e2.backgroundRect) || !Vl(e2.trackRect) || !Vl(e2.handleRect))
      return `滑块控件包含无效几何信息`;
    if (e2.pieceRect && !Vl(e2.pieceRect)) return `拼图块几何信息无效`;
    if (e2.backgroundRect.width < 80 || e2.backgroundRect.height < 40) return `滑块背景图尺寸过小`;
    if (e2.trackRect.width - e2.handleRect.width < 20) return `滑块轨道没有足够的可拖动行程`;
    if (Hl(e2.backgroundRect, e2.viewportWidth, e2.viewportHeight) < 0.96)
      return `滑块背景图没有完整显示在当前视口`;
    if (Hl(e2.handleRect, e2.viewportWidth, e2.viewportHeight) < 0.98)
      return `滑块把手没有完整显示在当前视口`;
    let t = e2.handleRect.y + e2.handleRect.height / 2;
    return t < e2.trackRect.y - e2.handleRect.height || t > e2.trackRect.y + e2.trackRect.height + e2.handleRect.height ? `滑块把手与轨道位置不一致` : null;
  }
  function Wl(e2, t, n) {
    return Math.min(n, Math.max(t, e2));
  }
  function Gl(e2, t, n, r = 0) {
    let i = Ul(e2);
    if (i) return { ok: false, errorCode: `invalid-geometry`, error: i };
    if (!Number.isFinite(t.imageScaleX) || !Number.isFinite(t.imageScaleY) || t.imageScaleX <= 0 || t.imageScaleY <= 0)
      return { ok: false, errorCode: `invalid-geometry`, error: `图片像素比例无效` };
    if (!Number.isFinite(n.confidence) || n.confidence < 0.45)
      return { ok: false, errorCode: `match-not-found`, error: `缺口匹配置信度不足` };
    if (n.confidenceMargin != null && n.confidenceMargin < 6e-3 && n.confidence < 0.72)
      return { ok: false, errorCode: `match-ambiguous`, error: `缺口存在多个相近候选位置` };
    if (n.rivalCount > 0 && n.confidence < 0.86)
      return {
        ok: false,
        errorCode: `match-ambiguous`,
        error: `图上有 ${n.rivalCount + 1} 个分数接近的候选缺口，无法确定唯一目标`
      };
    let a = (n.x - t.cropOffsetX) / t.imageScaleX, o = e2.pieceRect, s = o && t.source === `raw-image` ? n.templateOffsetX / Math.max(1, n.templateOriginalWidth) * o.width : n.templateOffsetX / t.imageScaleX, c = o ? o.x - e2.backgroundRect.x + s - t.cropOffsetPieceX / t.imageScaleX : 0, l2 = o && t.source === `raw-image` ? n.templateWidth / Math.max(1, n.templateOriginalWidth) * o.width : n.templateWidth / t.imageScaleX, u = a - c, d = e2.backgroundRect.width - (o?.width ?? l2), f = e2.trackRect.width - e2.handleRect.width, p = e2.trackRect.x + e2.trackRect.width - (e2.handleRect.x + e2.handleRect.width);
    if (d < 20 || f < 20 || p < 2)
      return { ok: false, errorCode: `invalid-geometry`, error: `滑块或拼图块没有有效行程` };
    if (u <= 1 || u > d + Math.max(3, l2 * 0.15))
      return {
        ok: false,
        errorCode: `distance-out-of-range`,
        error: `识别出的拼图距离超出范围（${u.toFixed(1)}px）`
      };
    let m = f / d, h = m >= 0.45 && m <= 1.8 ? m : 1, g = Wl(Number.isFinite(r) ? r : 0, -10, 10), _ = u * h + g;
    return _ < 2 || _ > p ? {
      ok: false,
      errorCode: `distance-out-of-range`,
      error: `换算后的把手距离超出轨道（${_.toFixed(1)}/${p.toFixed(1)}px）`
    } : {
      ok: true,
      plan: {
        gapX: Math.round(a * 10) / 10,
        distance: Math.round(_ * 100) / 100,
        diagnostics: {
          source: t.source,
          imageScaleX: Math.round(t.imageScaleX * 1e3) / 1e3,
          imageScaleY: Math.round(t.imageScaleY * 1e3) / 1e3,
          imageDistance: Math.round(u * 10) / 10,
          handleRange: Math.round(f * 10) / 10,
          pieceRange: Math.round(d * 10) / 10,
          conversionRatio: Math.round(h * 1e3) / 1e3,
          correctionPx: g,
          candidateCount: n.candidateCount,
          confidenceMargin: n.confidenceMargin,
          rivalCount: n.rivalCount,
          cropOffsetX: Math.round(t.cropOffsetX * 100) / 100
        }
      }
    };
  }
  function Jl(e2, t) {
    return { width: e2, height: t, data: new Uint8ClampedArray(e2 * t * 4) };
  }
  function Yl(e2, t) {
    if (e2.width !== t.width || e2.height !== t.height) return null;
    let n = new Uint8Array(e2.width * e2.height);
    for (let r = 0; r < n.length; r += 1) {
      let i = r * 4, a = (Math.abs(t.data[i] - e2.data[i]) + Math.abs(t.data[i + 1] - e2.data[i + 1]) + Math.abs(t.data[i + 2] - e2.data[i + 2])) / 3;
      n[r] = +(a >= bgSliderState.ql);
    }
    return n;
  }
  function Xl(e2, t, n, r = bgSliderState.Kl) {
    let i = new Uint8Array(e2.length), a = [], o = [];
    for (let s = 0; s < e2.length; s += 1) {
      if (!e2[s] || i[s]) continue;
      o.length = 0, o.push(s), i[s] = 1;
      let c = t, l2 = n, u = -1, d = -1, f = 0;
      for (; o.length > 0; ) {
        let r2 = o.pop(), a2 = r2 % t, s2 = (r2 - a2) / t;
        if (f += 1, a2 < c && (c = a2), s2 < l2 && (l2 = s2), a2 > u && (u = a2), s2 > d && (d = s2), a2 > 0) {
          let t2 = r2 - 1;
          e2[t2] && !i[t2] && (i[t2] = 1, o.push(t2));
        }
        if (a2 + 1 < t) {
          let t2 = r2 + 1;
          e2[t2] && !i[t2] && (i[t2] = 1, o.push(t2));
        }
        if (s2 > 0) {
          let n2 = r2 - t;
          e2[n2] && !i[n2] && (i[n2] = 1, o.push(n2));
        }
        if (s2 + 1 < n) {
          let n2 = r2 + t;
          e2[n2] && !i[n2] && (i[n2] = 1, o.push(n2));
        }
      }
      f >= r && a.push({ x: c, y: l2, width: u - c + 1, height: d - l2 + 1, area: f });
    }
    return a.sort((e3, t2) => t2.area - e3.area);
  }
  function Zl(e2) {
    let { before: t, after: n, handleDeltaCss: r, pixelRatio: i, backgroundRect: a } = e2;
    if (!Number.isFinite(r) || Math.abs(r) < 4)
      return { ok: false, reason: `探测位移过小，无法分离碎片` };
    if (!Number.isFinite(i) || i <= 0) return { ok: false, reason: `截图像素比无效` };
    let o = Yl(t, n);
    if (!o) return { ok: false, reason: `两张截图尺寸不一致` };
    let s = Math.max(0, Math.floor(a.x)), c = Math.max(0, Math.floor(a.y)), l2 = Math.min(t.width, Math.ceil(a.x + a.width)), u = Math.min(t.height, Math.ceil(a.y + a.height));
    if (l2 - s < 20 || u - c < 20) return { ok: false, reason: `背景图区域过小` };
    for (let e3 = 0; e3 < t.height; e3 += 1) {
      let n2 = e3 >= c && e3 < u;
      for (let r2 = 0; r2 < t.width; r2 += 1) (!n2 || r2 < s || r2 >= l2) && (o[e3 * t.width + r2] = 0);
    }
    let d = Xl(o, t.width, t.height);
    if (d.length === 0)
      return { ok: false, reason: `探测移动后画面没有可识别的变化，碎片可能没有跟随把手` };
    if (d.length === 1)
      return { ok: false, reason: `只观察到一团变化，碎片的新旧位置可能重叠（探测位移不足）` };
    let [f, p] = d, m = f.x <= p.x ? f : p, h = f.x <= p.x ? p : f, g = h.x - m.x;
    if (g <= 2) return { ok: false, reason: `两团变化没有水平分离，无法判断移动方向` };
    if (Math.abs(h.y - m.y) > Math.max(6, m.height * 0.35))
      return { ok: false, reason: `两团变化的垂直位置差异过大，可能不是同一个碎片` };
    let _ = h.width / Math.max(1, m.width);
    if (_ < 0.6 || _ > 1.7) return { ok: false, reason: `两团变化的尺寸差异过大，可能不是同一个碎片` };
    let v = r * i;
    if (h.width / Math.max(1, h.height) < 0.45)
      return { ok: false, reason: `碎片的新旧位置部分重叠，差分只得到窄条（探测位移不足一个碎片宽）` };
    let y = g / v;
    if (!Number.isFinite(y) || y < 0.25 || y > 2.5)
      return { ok: false, reason: `测得的行程比 ${y.toFixed(3)} 超出合理范围` };
    let b = Jl(h.width, h.height), x = 0;
    for (let e3 = 0; e3 < h.height; e3 += 1)
      for (let r2 = 0; r2 < h.width; r2 += 1) {
        let i2 = h.x + r2, a2 = h.y + e3, s2 = (e3 * h.width + r2) * 4;
        if (i2 < 0 || a2 < 0 || i2 >= n.width || a2 >= n.height) continue;
        let c2 = (a2 * n.width + i2) * 4, l3 = o[a2 * t.width + i2] === 1;
        b.data[s2] = n.data[c2], b.data[s2 + 1] = n.data[c2 + 1], b.data[s2 + 2] = n.data[c2 + 2], b.data[s2 + 3] = l3 ? 255 : 0, l3 && (x += 1);
      }
    return x / Math.max(1, h.width * h.height) < 0.2 ? { ok: false, reason: `差分出的碎片形状过于稀疏，无法作为模板` } : {
      ok: true,
      measurement: {
        pieceX: h.x,
        pieceY: h.y,
        pieceWidth: h.width,
        pieceHeight: h.height,
        originX: m.x,
        originY: m.y,
        measuredRatio: y,
        template: b
      }
    };
  }
  function Ql(e2, t, n) {
    return Math.min(n, Math.max(t, e2));
  }
  function $l(e2, t = Math.random, n = 1 / 0) {
    if (!Number.isFinite(e2) || e2 <= 0)
      return [
        { dx: 0, delayMs: 20 },
        { dx: 0, delayMs: 20 }
      ];
    let r = Math.min(e2, n), i = Ql(14 + Math.round(r / 45) + Math.round(t() * 3), 14, 23), a = r >= 45 ? 3 : 2, o = i - a, s = r * (r >= 45 ? 0.965 : 0.93), c = [], l2 = 0;
    for (let e3 = 1; e3 <= o; e3 += 1) {
      let n2 = e3 / o, r2 = n2 < 0.5 ? 4 * n2 ** 3 : 1 - (-2 * n2 + 2) ** 3 / 2, i2 = Math.min(s, Math.max(l2, Math.round(s * r2)));
      c.push({
        dx: i2 - l2,
        delayMs: n2 < 0.7 ? 14 + Math.round(t() * 14) : 22 + Math.round(t() * 24)
      }), l2 = i2;
    }
    for (let e3 = 1; e3 <= a; e3 += 1) {
      let n2 = r - l2, i2 = e3 === a ? n2 : n2 * 0.5, o2 = e3 === a ? r : l2 + i2;
      c.push({ dx: o2 - l2, delayMs: 34 + e3 * 12 + Math.round(t() * 26) }), l2 = o2;
    }
    let u = c.reduce((e3, t2) => e3 + t2.dx, 0);
    return c[c.length - 1].dx += r - u, c;
  }
  function eu(e2, t, n, r, i, a = Math.random) {
    let o = [], s = e2, c = (a() - 0.5) * 2.4, l2 = Ql(e2 + n.reduce((e3, t2) => e3 + t2.dx, 0), 1, r - 1), u = Ql(e2, 1, r - 1);
    for (let e3 = 0; e3 < n.length; e3 += 1) {
      let d2 = n[e3];
      s += d2.dx;
      let f = (e3 + 1) / n.length, p = 1 - f, m = e3 === n.length - 1 ? 0 : (a() - 0.5) * 1.5 * p, h = t + Math.sin(f * Math.PI) * c + m, g = Math.min(l2, Math.max(u, Math.round(Ql(s, 1, r - 1))));
      o.push({ x: g, y: Math.round(Ql(h, 1, i - 1)), delayMs: d2.delayMs }), u = g;
    }
    let d = o[o.length - 1];
    return d && (d.x = Ql(e2 + n.reduce((e3, t2) => e3 + t2.dx, 0), 1, r - 1), d.y = Ql(t, 1, i - 1)), o;
  }
  function nu(e2) {
    let t = e2.pieceRect?.width ?? Math.max(30, e2.handleRect.width), n = e2.trackRect.x + e2.trackRect.width - (e2.handleRect.x + e2.handleRect.width);
    return Math.max(12, Math.min(t + 8, n * 0.42));
  }
  function ru(e2, t, n, r) {
    let i = [];
    for (let a = 1; a <= 7; a += 1) {
      let o = 1 - (1 - a / 7) ** 2;
      i.push({ x: e2 + n * o, y: t + (r() - 0.5) * 1.2, delayMs: 16 + Math.round(r() * 14) });
    }
    return i;
  }
  function iu(e2, t, n, r, i, a, o) {
    let s = {
      image: n,
      originalWidth: n.width,
      originalHeight: n.height,
      bounds: { x: 0, y: 0, width: n.width, height: n.height },
      shapedAlpha: true
    }, c = (e3) => Math.abs(e3 - r) >= n.width * 0.5 && !o.some((t2) => Math.abs(e3 - t2) < n.width / 3), l2 = jl(e2, s, 0, a);
    if (l2 && Pl(l2) && c(l2.x))
      return { x: l2.x, confidence: l2.confidence, method: `measured+silhouette` };
    let u = Nl(e2, s, 0, a, false, [
      { x: r, radius: Math.max(6, n.width * 0.5) },
      ...o.map((e3) => ({ x: e3, radius: Math.max(6, n.width / 3) }))
    ]);
    if (u && Pl(u) && c(u.x))
      return { x: u.x, confidence: u.confidence, method: `measured+outline-profile` };
    let d = Math.max(0, Math.ceil(i + n.width)), f = Math.max(3, Math.round(n.height * 0.12)), p = Math.max(0, Math.floor(a - f)), m = Math.min(t.height, Math.ceil(a + n.height + f)), h = t.width - d, g = m - p;
    if (h < n.width || g < n.height) return null;
    let _ = (h - n.width + 1) * (g - n.height + 1) * n.width * n.height;
    if (_ <= 0 || _ > 12e7 || !Fl(s)) return null;
    let v = il(ou(t, d, p, h, g), n, 0.72);
    if (!v || v.confidenceMargin == null || v.confidenceMargin < 0.035) return null;
    let y = v.x + d;
    return o.some((e3) => Math.abs(y - e3) < n.width / 3) ? null : { x: y, confidence: v.confidence, method: `measured+ncc` };
  }
  async function au(e2, t, n, r, i) {
    let a = t.handleRect.x + t.handleRect.width / 2, o = t.handleRect.y + t.handleRect.height / 2, s = nu(t), c = t.trackRect.x + t.trackRect.width - (t.handleRect.x + t.handleRect.width), l2 = await bgPlatformState.Jc(
      e2,
      {
        startX: a,
        startY: o,
        viewportWidth: t.viewportWidth,
        viewportHeight: t.viewportHeight,
        targetToken: t.handleToken,
        frameTarget: i
      },
      r
    );
    try {
      let e3 = l2.current, i2 = await ul(await l2.screenshot()), a2 = i2.width / t.viewportWidth, o2 = i2.height / t.viewportHeight;
      if (![a2, o2].every((e4) => Number.isFinite(e4) && e4 >= 0.25 && e4 <= 8))
        return {
          solved: false,
          errorCode: `image-unavailable`,
          error: `无法建立截图与页面坐标的比例`
        };
      await l2.moveBy(ru(e3.x, e3.y, s, r)), await new Promise((e4) => setTimeout(e4, 110));
      let u = l2.current, d = await ul(await l2.screenshot()), f = Zl({
        before: i2,
        after: d,
        handleDeltaCss: u.x - e3.x,
        pixelRatio: a2,
        backgroundRect: {
          x: t.backgroundRect.x * a2,
          y: t.backgroundRect.y * o2,
          width: t.backgroundRect.width * a2,
          height: t.backgroundRect.height * o2
        }
      });
      if (!f.ok)
        return { solved: false, errorCode: `match-not-found`, error: `拖拽探测失败：${f.reason}` };
      let p = f.measurement, m = t.backgroundRect.x * a2, h = t.backgroundRect.y * o2, g = m - Math.round(m), _ = ou(
        d,
        Math.round(m),
        Math.round(h),
        Math.round(t.backgroundRect.width * a2),
        Math.round(t.backgroundRect.height * o2)
      ), v = ou(i2, Math.round(m), Math.round(h), _.width, _.height), y = (n.excludedGapX ?? []).filter((e4) => Number.isFinite(e4)).map((e4) => e4 * a2 + g), b = iu(
        _,
        v,
        p.template,
        p.pieceX - Math.round(m),
        p.originX - Math.round(m),
        p.pieceY - Math.round(h),
        y
      );
      if (!b)
        return {
          solved: false,
          errorCode: `match-not-found`,
          error: `用实测碎片模板仍未在背景图中找到匹配的缺口`
        };
      let x = p.pieceX - Math.round(m), S = b.x - x, C = Number.isFinite(n.correctionPx ?? 0) ? n.correctionPx ?? 0 : 0, w = S / (p.measuredRatio * a2) + C, T = u.x - e3.x + w, E = {
        source: `viewport-screenshot`,
        imageScaleX: Math.round(a2 * 1e3) / 1e3,
        imageScaleY: Math.round(o2 * 1e3) / 1e3,
        imageDistance: Math.round(S / a2 * 10) / 10,
        handleRange: Math.round((t.trackRect.width - t.handleRect.width) * 10) / 10,
        pieceRange: Math.round(t.backgroundRect.width * 10) / 10,
        conversionRatio: Math.round(p.measuredRatio * 1e3) / 1e3,
        correctionPx: C,
        candidateCount: 1,
        probeDistance: Math.round(s * 10) / 10,
        measuredRatio: Math.round(p.measuredRatio * 1e3) / 1e3,
        cropOffsetX: Math.round(g * 100) / 100
      };
      if (w < -2 || T > c + 2)
        return {
          solved: false,
          errorCode: `distance-out-of-range`,
          error: `实测剩余距离 ${w.toFixed(1)}px 超出轨道可用行程（已移动 ${(u.x - e3.x).toFixed(1)}/${c.toFixed(1)}px）`,
          method: b.method,
          confidence: b.confidence,
          diagnostics: E
        };
      if (w > 0.5) {
        let n2 = $l(w, r, c - (u.x - e3.x));
        await l2.moveBy(eu(u.x, u.y, n2, t.viewportWidth, t.viewportHeight, r));
      }
      return await l2.release(), {
        solved: true,
        gapX: Math.round((b.x - g) / a2 * 10) / 10,
        distance: Math.round(T * 100) / 100,
        method: b.method,
        confidence: b.confidence,
        diagnostics: E
      };
    } finally {
      await l2.release().catch(() => {
      });
    }
  }
  function ou(e2, t, n, r, i) {
    let a = Math.max(1, r), o = Math.max(1, i), s = { width: a, height: o, data: new Uint8ClampedArray(a * o * 4) };
    for (let r2 = 0; r2 < o; r2 += 1) {
      let i2 = n + r2;
      if (!(i2 < 0 || i2 >= e2.height))
        for (let n2 = 0; n2 < a; n2 += 1) {
          let o2 = t + n2;
          if (o2 < 0 || o2 >= e2.width) continue;
          let c = (i2 * e2.width + o2) * 4, l2 = (r2 * a + n2) * 4;
          s.data[l2] = e2.data[c], s.data[l2 + 1] = e2.data[c + 1], s.data[l2 + 2] = e2.data[c + 2], s.data[l2 + 3] = e2.data[c + 3];
        }
    }
    return s;
  }
  async function su(e2, t, n, r, i) {
    let a = Ul(t);
    if (a) return { solved: false, errorCode: `invalid-geometry`, error: a };
    if (t.backgroundSource != null && (t.pieceSource != null || t.referenceBackgroundSource != null) ? n.attempt % 2 == 0 : n.attempt % 2 == 1)
      return au(e2, t, n, r, i).catch((e3) => ({
        solved: false,
        errorCode: `drag-failed`,
        error: e3 instanceof Error ? e3.message : String(e3)
      }));
    let o;
    try {
      o = await yl(e2, t);
    } catch (e3) {
      return {
        solved: false,
        errorCode: `image-unavailable`,
        error: e3 instanceof Error ? e3.message : String(e3)
      };
    }
    if (o.source === `viewport-screenshot` && o.template && !Fl(o.template))
      return {
        solved: false,
        errorCode: `invalid-geometry`,
        error: `页面上识别出的「拼图块」是纯色填充，更像缺口本身，无法确定拖动起点`
      };
    let s = (n.excludedGapX ?? []).filter((e3) => Number.isFinite(e3)).map((e3) => ({
      x: e3 * o.imageScaleX + o.cropOffsetX,
      radius: Math.max(6, (o.template?.image.width ?? 40) / 3)
    })), c = await Bl(t, o, s);
    if (!c)
      return {
        solved: false,
        errorCode: `match-not-found`,
        error: s.length ? `排除 ${s.length} 个已失败位置后，没有找到置信度足够且唯一的滑块缺口` : `没有找到置信度足够且唯一的滑块缺口`
      };
    let l2 = Gl(t, o, c, n.correctionPx);
    if (!l2.ok)
      return {
        solved: false,
        errorCode: l2.errorCode,
        error: l2.error,
        method: c.method,
        confidence: c.confidence
      };
    let { plan: u } = l2, d = t.trackRect.x + t.trackRect.width - (t.handleRect.x + t.handleRect.width), f = $l(u.distance, r, Math.max(u.distance, d - 1)), p = t.handleRect.x + t.handleRect.width / 2, m = t.handleRect.y + t.handleRect.height / 2, h = eu(p, m, f, t.viewportWidth, t.viewportHeight, r);
    try {
      await bgPlatformState.qc(
        e2,
        {
          startX: p,
          startY: m,
          points: h,
          viewportWidth: t.viewportWidth,
          viewportHeight: t.viewportHeight,
          targetToken: t.handleToken,
          frameTarget: i
        },
        r
      );
    } catch (e3) {
      return {
        solved: false,
        errorCode: `drag-failed`,
        error: e3 instanceof Error ? e3.message : String(e3),
        gapX: u.gapX,
        distance: u.distance,
        method: c.method,
        confidence: c.confidence,
        diagnostics: u.diagnostics
      };
    }
    return {
      solved: true,
      gapX: u.gapX,
      distance: u.distance,
      method: `${o.source}:${c.method}`,
      confidence: c.confidence,
      diagnostics: u.diagnostics
    };
  }
  function cu(e2, t, n = { attempt: 1 }, r = Math.random, i) {
    let a = typeof n == `function` ? { attempt: 1 } : n, o = typeof n == `function` ? n : r, s = bgSliderState.tu.get(e2);
    if (s)
      return s.challengeKey === t.challengeKey ? s.promise : Promise.resolve({
        solved: false,
        errorCode: `busy`,
        error: `当前标签页已有滑块识别任务在执行`
      });
    let c = su(e2, t, a, o, i).finally(() => {
      bgSliderState.tu.get(e2)?.promise === c && bgSliderState.tu.delete(e2);
    });
    return bgSliderState.tu.set(e2, { challengeKey: t.challengeKey, promise: c }), c;
  }
  function lu(e2) {
    try {
      let t = new URL(e2);
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
  function pu(e2) {
    bgSliderState.fu.delete(e2.sessionId), e2.frameId != null && chrome.tabs.sendMessage(
      e2.tabId,
      { type: bgSliderState.uu, sessionId: e2.sessionId },
      { frameId: e2.frameId }
    ).catch(() => void 0);
  }
  function mu() {
    for (let e2 of bgSliderState.fu.values()) Date.now() >= e2.deadline && pu(e2);
  }
  function hu(e2) {
    return { state: e2.state, steps: e2.steps, result: e2.result };
  }
  async function gu(e2, t) {
    mu();
    let n = t.tab?.id;
    if (n == null || !/^sf-[a-z0-9-]{8,80}$/i.test(e2.sessionId))
      return { ok: false, error: `验证码内嵌页会话无效` };
    let r = await bgCheckinState.V.get(n);
    if (!r) return { ok: false, error: `签到任务已结束` };
    if (e2.type === `SLIDER_FRAME_PREPARE`) {
      if (t.frameId !== 0 || e2.runId !== r.runId || !bgCheckinState.ut(r, t.url))
        return { ok: false, error: `只有当前签到任务的主页面可以启用验证码助手` };
      if (!lu(e2.frameUrl) || !/^p-[a-z0-9-]{8,80}$/i.test(e2.frameToken))
        return { ok: false, error: `不是受支持的腾讯验证码 iframe` };
      await bgPlatformState.ac(n, e2, [{ x: 0.5, y: 0.5 }]);
      let i2 = (await chrome.webNavigation.getAllFrames({ tabId: n }) ?? []).filter((t2) => t2.parentFrameId === 0 && t2.url === e2.frameUrl && !t2.errorOccurred).map((e3) => e3.frameId).slice(0, 6);
      if (!i2.length) return { ok: false, error: `腾讯验证码内嵌页面仍在加载` };
      for (let e3 of bgSliderState.fu.values()) e3.tabId === n && pu(e3);
      let a = {
        ...e2,
        tabId: n,
        candidateIds: i2,
        state: `connecting`,
        steps: [],
        deadline: Date.now() + bgSliderState.du
      };
      bgSliderState.fu.set(e2.sessionId, a);
      try {
        await chrome.scripting.executeScript({
          target: { tabId: n, frameIds: i2 },
          files: [`content-scripts/slider-captcha-frame.js`]
        });
      } catch (e3) {
        return pu(a), { ok: false, error: `无法载入验证码助手：${e3 instanceof Error ? e3.message : String(e3)}` };
      }
      return { ok: true, feature: { sliderFrame: hu(a) } };
    }
    let i = bgSliderState.fu.get(e2.sessionId);
    if (!i || i.tabId !== n || i.runId !== r.runId)
      return { ok: false, error: `验证码内嵌页会话已结束` };
    if (e2.type === `SLIDER_FRAME_STATUS` || e2.type === `SLIDER_FRAME_CANCEL`) {
      if (t.frameId !== 0 || e2.runId !== i.runId || !bgCheckinState.ut(r, t.url))
        return { ok: false, error: `验证码会话不属于当前主页面` };
      let n2 = hu(i);
      return e2.type === `SLIDER_FRAME_CANCEL` && pu(i), { ok: true, feature: { sliderFrame: n2 } };
    }
    return t.frameId == null || t.frameId === 0 || t.url !== i.frameUrl || !i.candidateIds.includes(t.frameId) ? { ok: false, error: `验证码助手来自未经授权的内嵌页面` } : e2.type === `SLIDER_FRAME_CONNECT` ? i.state === `connecting` ? (await bgPlatformState.ac(n, i, [{ x: 0.5, y: 0.5 }]), i.frameId = t.frameId, i.documentId = t.documentId, i.state = `running`, {
      ok: true,
      feature: { sliderFrame: { ...hu(i), runId: i.runId, deadline: i.deadline - 3e3 } }
    }) : { ok: false, error: `验证码助手已连接` } : t.frameId !== i.frameId || i.documentId && t.documentId !== i.documentId ? { ok: false, error: `验证码文档已重建，旧助手不能继续操作` } : (e2.steps.length >= i.steps.length && (i.steps = e2.steps.slice(0, 160).map((e3) => String(e3).slice(0, 1500))), e2.result && (i.result = e2.result, i.state = `finished`), { ok: true });
  }
  async function _u(e2, t, n) {
    mu();
    let r = n ? bgSliderState.fu.get(n) : void 0;
    if (!r || r.state !== `running` || r.runId !== t || r.tabId !== e2.tab?.id || r.frameId !== e2.frameId || e2.url !== r.frameUrl || r.documentId && e2.documentId !== r.documentId)
      throw Error(`验证码 iframe 没有有效的本轮拖动会话`);
    let i = await bgCheckinState.V.get(r.tabId), a = await chrome.tabs.get(r.tabId);
    if (!i || i.runId !== t || !bgCheckinState.ut(i, a.url))
      throw pu(r), Error(`签到任务已结束或主页面已离开本站`);
    return {
      frameId: r.frameId,
      documentId: r.documentId,
      frameToken: r.frameToken,
      frameUrl: r.frameUrl
    };
  }
  async function vu(e2, t, n, r) {
    let i = t.backgroundRect, a = t.handleRect, o = await bgPlatformState.ac(e2, r, [
      { x: (a.x + a.width / 2) / t.viewportWidth, y: (a.y + a.height / 2) / t.viewportHeight },
      ...[0.1, 0.5, 0.9].map((e3) => ({
        x: (i.x + i.width * e3) / t.viewportWidth,
        y: (i.y + i.height * e3) / t.viewportHeight
      }))
    ]), s = bgPlatformState.oc(o, t.viewportWidth, t.viewportHeight), c = (e3) => bgPlatformState.sc(e3, o, s), l2 = await cu(
      e2,
      {
        ...t,
        panelRect: c(t.panelRect),
        backgroundRect: c(i),
        trackRect: c(t.trackRect),
        handleRect: c(a),
        pieceRect: t.pieceRect ? c(t.pieceRect) : void 0,
        viewportWidth: o.viewportWidth,
        viewportHeight: o.viewportHeight,
        devicePixelRatio: o.devicePixelRatio,
        challengeKey: `${r.frameToken}:${t.challengeKey}`
      },
      {
        ...n,
        correctionPx: n.correctionPx == null ? void 0 : n.correctionPx * s.x,
        excludedGapX: n.excludedGapX?.map((e3) => e3 * s.x)
      },
      Math.random,
      r
    );
    return {
      ...l2,
      gapX: l2.gapX == null ? void 0 : l2.gapX / s.x,
      distance: l2.distance == null ? void 0 : l2.distance / s.x,
      diagnostics: l2.diagnostics ? {
        ...l2.diagnostics,
        imageScaleX: l2.diagnostics.imageScaleX * s.x,
        imageScaleY: l2.diagnostics.imageScaleY * s.y,
        handleRange: l2.diagnostics.handleRange / s.x,
        pieceRange: l2.diagnostics.pieceRange / s.x,
        correctionPx: l2.diagnostics.correctionPx / s.x,
        probeDistance: l2.diagnostics.probeDistance == null ? void 0 : l2.diagnostics.probeDistance / s.x
      } : void 0
    };
  }
  function yu(e2) {
    let t = e2.toLowerCase();
    if (t === `localhost` || t.includes(`:`) || /^\d+(?:\.\d+){3}$/.test(t)) return [t];
    let n = t.split(`.`).filter(Boolean), r = [];
    for (let e3 = 0; e3 < Math.max(1, n.length - 1); e3 += 1) r.push(n.slice(e3).join(`.`));
    return r;
  }
  Object.assign(bgSliderState, {
    $c,
    el,
    tl,
    nl,
    rl,
    il,
    al,
    ol,
    sl,
    cl,
    ll,
    ul,
    dl,
    pl,
    ml,
    hl,
    gl,
    _l,
    vl,
    yl,
    Sl,
    Cl,
    wl,
    Tl,
    El,
    Dl,
    Ol,
    kl,
    Al,
    jl,
    Ml,
    Nl,
    Pl,
    Fl,
    Il,
    Ll,
    Rl,
    Bl,
    Vl,
    Hl,
    Ul,
    Wl,
    Gl,
    Jl,
    Yl,
    Xl,
    Zl,
    Ql,
    $l,
    eu,
    nu,
    ru,
    iu,
    au,
    ou,
    su,
    cu,
    lu,
    pu,
    mu,
    hu,
    gu,
    _u,
    vu,
    yu
  });
  async function handleSliderMessage(e2, i) {
    switch (e2.type) {
      case `SLIDER_FRAME_PREPARE`:
      case `SLIDER_FRAME_CONNECT`:
      case `SLIDER_FRAME_REPORT`:
      case `SLIDER_FRAME_STATUS`:
      case `SLIDER_FRAME_CANCEL`:
        return gu(e2, i);
      case `SLIDER_CRACK`: {
        let t = i.tab?.id;
        if (t == null) return { ok: false, error: `缺少任务标签页` };
        if (i.frameId !== 0) {
          let n2 = await _u(i, e2.runId, e2.frameSessionId);
          return { ok: true, feature: { slider: await vu(t, e2.slider, e2.options, n2) } };
        }
        let n = await bgCheckinState.V.get(t);
        return !n || n.runId !== e2.runId ? { ok: false, error: `任务已结束` } : bgCheckinState.ut(n, i.url ?? i.tab?.url) ? { ok: true, feature: { slider: await cu(t, e2.slider, e2.options) } } : { ok: false, error: `当前页面不属于该签到任务` };
      }
    }
  }
  function initializeBackgroundSlider(step) {
    switch (step) {
      case 211: {
        bgSliderState.Xc = 12582912;
        break;
      }
      case 212: {
        bgSliderState.Zc = 16e6;
        break;
      }
      case 213: {
        bgSliderState.Qc = 8e3;
        break;
      }
      case 214: {
        bgSliderState.fl = 8e3;
        break;
      }
      case 215: {
        bgSliderState.bl = null;
        break;
      }
      case 216: {
        bgSliderState.xl = false;
        break;
      }
      case 217: {
        bgSliderState.zl = 0.75;
        break;
      }
      case 218: {
        bgSliderState.Kl = 60;
        break;
      }
      case 219: {
        bgSliderState.ql = 26;
        break;
      }
      case 220: {
        bgSliderState.tu = /* @__PURE__ */ new Map();
        break;
      }
      case 221: {
        bgSliderState.uu = `aah-slider-frame-stop`;
        break;
      }
      case 222: {
        bgSliderState.du = 65e3;
        break;
      }
      case 223: {
        bgSliderState.fu = /* @__PURE__ */ new Map();
        break;
      }
      case 243: {
        bgSliderState.ud = {
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
        break;
      }
      case 244: {
        bgSliderState.dd = [
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
        break;
      }
      case 245: {
        [
          `.geetest_success`,
          `.gt_info_success`,
          `.gt_success`,
          `.yidun_success`,
          `[class*="captcha" i][data-state="verified" i]`,
          `[class*="captcha" i][data-status="success" i]`,
          `[class*="slider" i][data-state="verified" i]`,
          `[class*="slider" i][data-status="success" i]`,
          `[class*="verify" i][data-state="success" i]`
        ].join(`, `), [
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
        ].join(`, `), [
          bgSliderState.dd,
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
        break;
      }
      case 246: {
        bgSliderState.fd = [
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
        break;
      }
      case 247: {
        bgSliderState.pd = [
          `[class*="geetest" i]`,
          `[class*="yidun" i]`,
          `[class*="nc-container" i]`,
          `[class*="tcaptcha" i]`,
          `[class*="slider" i]`,
          `[class*="verify" i]`
        ];
        break;
      }
      case 248: {
        [...bgSliderState.fd, ...bgSliderState.pd].join(`, `);
        break;
      }
      case 249: {
        bgSliderState.md = `[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)`;
        break;
      }
      case 250: {
        RegExp(
          `^\\s*(${bgSliderState.md})\\s*([+\\-*/])\\s*(${bgSliderState.md})\\s*(?:=\\s*(?:\\?)?)?\\s*$`
        ), RegExp(`(${bgSliderState.md}\\s*[+\\-*/]\\s*${bgSliderState.md}\\s*=\\s*(?:\\?)?)`), [
          `#challenge-running`,
          `#cf-challenge-running`,
          `.cf-challenge-running`,
          `#challenge-stage`,
          `form#challenge-form`
        ].join(`, `), [
          `script[src*="/cdn-cgi/challenge-platform/"]`,
          `link[href*="/cdn-cgi/challenge-platform/"]`,
          `iframe[src*="/cdn-cgi/challenge-platform/"]`,
          `#cf-wrapper`,
          `[data-ray]`
        ].join(`, `);
        break;
      }
      case 251: {
        bgSliderState.hd = [
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
        break;
      }
      case 252: {
        [
          `.g-recaptcha`,
          `[class*="recaptcha" i][data-sitekey]`,
          `iframe[src*="recaptcha"]`,
          `iframe[title*="recaptcha" i]`
        ].join(`, `), [
          `.h-captcha`,
          `[class*="hcaptcha" i][data-sitekey]`,
          `iframe[src*="hcaptcha.com"]`,
          `iframe[title*="hcaptcha" i]`
        ].join(`, `), [
          bgSliderState.dd,
          bgSliderState.ud.widgets,
          bgSliderState.hd,
          `.g-recaptcha`,
          `[class*="recaptcha" i][data-sitekey]`,
          `iframe[src*="recaptcha"]`,
          `iframe[title*="recaptcha" i]`,
          `.h-captcha`,
          `[class*="hcaptcha" i][data-sitekey]`,
          `iframe[src*="hcaptcha.com"]`,
          `iframe[title*="hcaptcha" i]`
        ].join(`, `), [
          `[class*="captcha" i]`,
          `[id*="captcha" i]`,
          `iframe[src*="captcha" i]`,
          `img[src*="captcha" i]`,
          `canvas[class*="captcha" i]`,
          `input[name*="captcha" i]:not([type="hidden"])`
        ].join(`, `), [
          `iframe[src*="captcha" i]`,
          `img[src*="captcha" i]`,
          `canvas[class*="captcha" i]`,
          `input[name*="captcha" i]:not([type="hidden"])`
        ].join(`, `), [`[class*="captcha" i]`, `[id*="captcha" i]`].join(`, `), [
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
        break;
      }
    }
  }
  var sliderService = Object.freeze({
    solve: (...args) => cu(...args),
    handleFrame: (...args) => gu(...args),
    handleMessage: handleSliderMessage
  });

  // src/modules/records/service.js
  var bgRecordsState = { store: {} };
  function Qr(e2) {
    return Number.isNaN(e2.getTime()) ? null : { year: e2.getFullYear(), month: e2.getMonth() + 1, day: e2.getDate() };
  }
  function $r(e2) {
    let t = e2.replace(/[年月日]/g, `/`).replace(/[.\-]/g, `/`).match(/((?:19|20)\d{2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,2})/);
    if (!t) return null;
    let n = Number(t[1]), r = Number(t[2]), i = Number(t[3]);
    if (!Number.isInteger(r) || r < 1 || r > 12 || !Number.isInteger(i) || i < 1 || i > 31)
      return null;
    let a = new Date(n, r - 1, i);
    return a.getFullYear() !== n || a.getMonth() + 1 !== r || a.getDate() !== i ? null : { year: n, month: r, day: i };
  }
  function ei(e2, t = /* @__PURE__ */ new Date()) {
    if (!e2) return null;
    let n = Qr(t);
    if (!n) return null;
    let r = [...e2.matchAll(bgRecordsState.Yr)];
    for (let t2 = 0; t2 < r.length; t2 += 1) {
      let i = r[t2];
      if (!i) continue;
      let a = i.index ?? 0, o = r[t2 + 1]?.index ?? e2.length, s = e2.slice(a, o), c = s.match(/[+＋]\s*(\d[\d,]*(?:\.\d+)?)/);
      if (!c?.[1]) continue;
      let l2 = ii(c[1]);
      if (l2 == null || l2 <= 0) continue;
      let u = s.match(bgRecordsState.Zr);
      if (!u) continue;
      let d = $r(u[0]);
      if (d && d.year === n.year && d.month === n.month && d.day === n.day)
        return { reward: l2, symbol: `积分` };
    }
    return null;
  }
  function ii(e2) {
    if (e2.includes(`,`)) {
      if (!/^-?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(e2)) return null;
      e2 = e2.replace(/,/g, ``);
    }
    let t = Number(e2);
    return Number.isFinite(t) ? t : null;
  }
  function ai(e2, t) {
    if (!t) return e2;
    let n = e2 != null && Math.abs(t.reward - e2.reward) <= bgRecordsState.bi, r = t.symbol ?? (n ? e2?.symbol : void 0);
    return { reward: t.reward, ...r ? { symbol: r } : {} };
  }
  function oi(e2) {
    if (e2) return e2 === `¥` || e2 === `￥` ? e2 : /^(?:cny|rmb)$/i.test(e2) ? `¥` : `$`;
  }
  function si(e2) {
    let t = e2.trim().match(/^(\d[\d,]*(?:\.\d+)?)\s*积分$/i);
    if (t?.[1]) {
      let e3 = ii(t[1]);
      return e3 == null ? null : { amount: e3, symbol: `积分` };
    }
    let n = e2.trim().match(/^(?:([$＄¥￥])|(?:usd|cny|rmb))?\s*(\d[\d,]*(?:\.\d+)?)$/i);
    if (!n?.[2]) return null;
    let r = ii(n[2]);
    if (r == null) return null;
    let i = oi(n[1] || e2.trim().match(/^(usd|cny|rmb)/i)?.[1] || ``);
    return { amount: r, ...i ? { symbol: i } : {} };
  }
  function ci(e2, t) {
    if (!e2) return null;
    let n = ei(e2);
    if (n) return n;
    if (bgRecordsState.Xr.test(e2) && bgRecordsState.Zr.test(e2) || !bgRecordsState.ri.test(e2))
      return null;
    for (let { pattern: n2, requiresCheckedIn: r } of bgRecordsState.ti) {
      if (r && !bgRecordsState.ni.test(e2)) continue;
      let i = n2.flags.includes(`g`) ? n2.flags : `${n2.flags}g`;
      for (let r2 of e2.matchAll(new RegExp(n2.source, i))) {
        let e3 = r2[1];
        if (!e3) continue;
        let n3 = si(e3);
        if (!n3 || n3.amount <= 0) continue;
        let i2 = n3.symbol === `积分` ? 1 : t && t > 0 ? t : 1;
        return { reward: n3.amount * i2, ...n3.symbol ? { symbol: n3.symbol } : {} };
      }
    }
    return null;
  }
  function li(e2, t) {
    if (!e2 || typeof e2 != `object`) return null;
    let n = e2;
    if (n.success === false) return null;
    let r = (e3) => e3 && typeof e3 == `object` && !Array.isArray(e3) ? e3 : null, i = r(n.data), a = [n, i, r(i?.stats)].filter((e3) => !!e3);
    if (!a.some((e3) => e3.checked_in_today === true || e3.checkedInToday === true)) return null;
    for (let e3 of a) {
      let n2 = e3.today_reward ?? e3.todayReward, r2 = typeof n2 == `number` ? { amount: n2 } : typeof n2 == `string` ? si(n2) : null;
      if (!r2 || !Number.isFinite(r2.amount) || r2.amount <= 0) continue;
      let i2 = t && t > 0 ? t : 1;
      return { reward: r2.amount * i2, ...r2.symbol ? { symbol: r2.symbol } : {} };
    }
    return null;
  }
  function ui(e2, t) {
    if (!e2) return null;
    let n = e2.match(bgRecordsState.Jr);
    if (n?.[1]) {
      let e3 = ii(n[1]);
      if (e3 != null) return { quota: e3, usedQuota: 0, symbol: `积分` };
    }
    let r = e2.match(bgRecordsState.qr);
    if (r?.[1]) {
      let e3 = ii(r[1]);
      if (e3 != null) return { quota: e3, usedQuota: 0, symbol: `积分` };
    }
    if (bgRecordsState.Xr.test(e2)) return null;
    let i = e2.match(/(?:当前余额|账户余额|剩余额度|可用余额)\s*[:：]?\s*([\s\S]{0,120})/i)?.[1];
    if (i) {
      let e3 = i.match(
        /(?:免费余额|免费)\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i
      ), n2 = i.match(
        /(?:付费余额|付费)\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i
      ), r2 = e3?.[3] ? ii(e3[3]) : null, a = n2?.[3] ? ii(n2[3]) : null;
      if (r2 != null || a != null) {
        let i2 = t && t > 0 ? t : 1, o = oi(e3?.[1] ?? e3?.[2] ?? n2?.[1] ?? n2?.[2]);
        return { quota: ((r2 ?? 0) + (a ?? 0)) * i2, usedQuota: 0, ...o ? { symbol: o } : {} };
      }
    }
    for (let n2 of bgRecordsState.Kr) {
      let r2 = e2.match(n2), i2 = r2?.[3];
      if (!i2) continue;
      let a = i2;
      if (i2.includes(`,`)) {
        if (!/^-?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(i2)) continue;
        a = i2.replace(/,/g, ``);
      }
      let o = Number(a);
      if (!Number.isFinite(o)) continue;
      let s = t && t > 0 ? t : 1, c = oi(r2?.[1] ?? r2?.[2]);
      return { quota: o * s, usedQuota: 0, ...c ? { symbol: c } : {} };
    }
    return null;
  }
  function pi(e2) {
    return typeof e2 == `number` && Number.isFinite(e2) ? e2 : typeof e2 == `string` && e2.trim() !== `` && Number.isFinite(Number(e2)) ? Number(e2) : null;
  }
  function mi(e2) {
    if (!e2 || typeof e2 != `object`) return null;
    let t = e2;
    if (t.success === false) return null;
    let n = t.data ?? t;
    if (!n || typeof n != `object`) return null;
    let r = pi, i = r(n.quota);
    if (i != null) return { quota: i, usedQuota: r(n.used_quota) ?? r(n.usedQuota) ?? 0 };
    let a = r(n.free_balance) ?? r(n.freeBalance), o = r(n.paid_balance) ?? r(n.paidBalance) ?? (a == null ? null : r(n.balance));
    if (a != null || o != null) return { quota: (a ?? 0) + (o ?? 0), usedQuota: 0 };
    let s = r(n.balance);
    return s == null ? null : { quota: s, usedQuota: 0 };
  }
  function hi(e2) {
    if (!e2 || typeof e2 != `object`) return null;
    let t = pi(e2.points);
    return t == null ? null : { quota: t, usedQuota: 0, symbol: `积分` };
  }
  function gi(e2, t) {
    try {
      let n = atob(t), r = Uint8Array.from(n, (e3) => e3.charCodeAt(0));
      return e2.includes(`cbor`) ? bgAccountsState.yr(r) : e2.includes(`json`) ? JSON.parse(new TextDecoder().decode(r)) : null;
    } catch {
      return null;
    }
  }
  function _i(e2) {
    let t = bgCheckinState.pt(e2);
    return !t?.endpoint || !t.tokenKey || !bgCheckinState.mt(e2, t.endpoint) ? null : {
      url: t.endpoint,
      tokenKey: t.tokenKey,
      ...t.tokenStorageType ? { tokenStorageType: t.tokenStorageType } : {},
      ...t.tokenHeader ? { tokenHeader: t.tokenHeader } : {},
      ...t.tokenPrefix === void 0 ? {} : { tokenPrefix: t.tokenPrefix }
    };
  }
  function vi(e2) {
    return yi(e2);
  }
  function yi(e2) {
    let t = bgSitesState.fr(e2).family;
    return t === bgSitesState.d.SUB2API ? bgRecordsState.fi : t === bgSitesState.d.NEW_API ? bgRecordsState.di : [...bgRecordsState.di, ...bgRecordsState.fi];
  }
  function xi(e2, t) {
    if (!e2 || !t || e2.fromVisibleText && t.fromVisibleText && e2.visiblePath && t.visiblePath && e2.visiblePath !== t.visiblePath)
      return { verdict: `unknown` };
    let n = e2.quota + e2.usedQuota, r = t.quota + t.usedQuota - n, i = t.usedQuota - e2.usedQuota, a = t.quota - e2.quota, o;
    return o = r > bgRecordsState.bi ? `rewarded` : i > bgRecordsState.bi ? `already-used` : `unchanged`, {
      reward: r,
      usageDelta: i,
      balanceDelta: a,
      verdict: o,
      quotaAfter: t.quota,
      ...t.symbol ? { balanceSymbol: t.symbol } : {}
    };
  }
  async function Si(e2, t, n = false, r = null, i = null) {
    let a = { Accept: `application/json` };
    try {
      let e3 = localStorage.getItem(`user`);
      if (e3) {
        let n2 = JSON.parse(e3), r2 = typeof n2?.id == `number` || typeof n2?.id == `string` ? String(n2.id).trim() : ``;
        if (r2) for (let e4 of t) a[e4] = r2;
      }
    } catch {
    }
    for (let e3 of [`auth_token`, `access_token`, `token`]) {
      let t2 = localStorage.getItem(e3)?.trim();
      if (t2 && t2.length > 20 && !t2.startsWith(`{`)) {
        a.Authorization = `Bearer ${t2}`;
        break;
      }
    }
    let o = i?.url ?? ``, s = (() => {
      try {
        return !!o && new URL(o, location.href).origin === location.origin;
      } catch {
        return false;
      }
    })();
    if (i && s) {
      let e3 = `__aahBootstrapToken`, t2 = (() => {
        try {
          let t3 = window[e3];
          if (!t3 || typeof t3 != `object`) return null;
          let n3 = t3;
          return typeof n3.at != `number` || Date.now() - n3.at > 6e4 ? null : typeof n3.header == `string` && typeof n3.value == `string` ? { header: n3.header, value: n3.value } : null;
        } catch {
          return null;
        }
      })();
      t2 && !a[t2.header] && (a[t2.header] = t2.value);
      let n2 = new AbortController(), r2 = setTimeout(() => n2.abort(), 4e3);
      try {
        if (!t2) {
          let t3 = await fetch(i.url, {
            method: i.method,
            credentials: `include`,
            headers: { Accept: `application/json` },
            redirect: `error`,
            signal: n2.signal
          });
          if (t3.ok) {
            let n3 = (t3.headers.get(`content-type`)?.toLowerCase() ?? ``).includes(`json`) ? await t3.json().catch(() => null) : null, r3 = i.tokenPath?.length ? [i.tokenPath] : [
              [`data`, `access_token`],
              [`access_token`],
              [`data`, `accessToken`],
              [`accessToken`]
            ], o2;
            for (let e4 of r3) {
              let t4 = n3;
              for (let n4 of e4) {
                if (typeof t4 != `object` || !t4) {
                  t4 = void 0;
                  break;
                }
                t4 = t4[n4];
              }
              if (typeof t4 == `string` && t4.trim().length > 20) {
                o2 = t4.trim();
                break;
              }
            }
            if (typeof o2 == `string` && !a[i.header]) {
              let t4 = `${i.prefix}${o2}`;
              a[i.header] = t4;
              try {
                window[e3] = { at: Date.now(), header: i.header, value: t4 };
              } catch {
              }
            }
          }
        }
      } catch {
      } finally {
        clearTimeout(r2);
      }
    }
    let c = (async () => {
      if (!r) return null;
      let e3 = r.tokenStorageType ? [r.tokenStorageType] : [`localStorage`, `sessionStorage`], t2;
      for (let n3 of e3)
        try {
          let e4 = (n3 === `localStorage` ? localStorage : sessionStorage)?.getItem(r.tokenKey)?.trim();
          if (e4) {
            t2 = e4;
            break;
          }
        } catch {
        }
      if (!t2) return null;
      let n2 = new AbortController(), i2 = setTimeout(() => n2.abort(), 4e3);
      try {
        let e4 = { Accept: `application/cbor, application/json` };
        e4[r.tokenHeader ?? `Authorization`] = `${r.tokenPrefix ?? `Bearer `}${t2}`;
        let i3 = await fetch(r.url, {
          method: `GET`,
          credentials: `omit`,
          headers: e4,
          signal: n2.signal
        });
        if (!i3.ok) return null;
        let a2 = i3.headers.get(`content-type`)?.toLowerCase() ?? ``;
        if (!a2.includes(`cbor`) && !a2.includes(`json`)) return null;
        let o2 = new Uint8Array(await i3.arrayBuffer()), s2 = ``;
        for (let e5 = 0; e5 < o2.length; e5 += 32768)
          s2 += String.fromCharCode(...o2.subarray(e5, e5 + 32768));
        return { url: r.url, contentType: a2, base64: btoa(s2) };
      } catch {
        return null;
      } finally {
        clearTimeout(i2);
      }
    })(), l2 = await Promise.all(
      e2.map(async (e3) => {
        let t2 = new AbortController(), n2 = setTimeout(() => t2.abort(), 4e3);
        try {
          let n3 = await fetch(new URL(e3, location.origin).href, {
            method: `GET`,
            credentials: `include`,
            headers: a,
            signal: t2.signal
          });
          if (!n3.ok) return null;
          let r2 = n3.headers.get(`content-type`)?.toLowerCase() ?? ``;
          return { path: e3, text: (await n3.text()).slice(0, 4e3), json: r2.includes(`json`) };
        } catch {
          return null;
        } finally {
          clearTimeout(n2);
        }
      })
    ), u = (document.body?.innerText ?? ``).slice(0, 2e4);
    if (n && !/(?:^|\n)\s*当前积分\s*[:：]?\s*-?\d/i.test(u)) {
      let e3 = () => document.body?.innerText ?? document.body?.textContent ?? ``, t2 = (e4) => {
        let t3 = window.getComputedStyle(e4), n3 = e4.getBoundingClientRect();
        return t3.display !== `none` && t3.visibility !== `hidden` && t3.opacity !== `0` && n3.width > 0 && n3.height > 0;
      }, n2 = [
        ...document.querySelectorAll(
          `button, [role="button"], a, [aria-haspopup], [aria-expanded], [tabindex="0"]`
        )
      ].filter(t2).map((e4) => {
        let t3 = e4.getBoundingClientRect(), n3 = `${e4.innerText ?? ``} ${e4.getAttribute(`aria-label`) ?? ``}`.trim(), r2 = `${e4.id} ${e4.className} ${e4.getAttribute(`data-testid`) ?? ``}`, i2 = 0;
        return e4.getAttribute(`aria-haspopup`)?.toLowerCase() === `menu` && (i2 += 30), e4.getAttribute(`aria-expanded`) === `false` && (i2 += 8), /user|account|avatar|profile|dropdown|member|用户|账户|头像/i.test(r2) && (i2 += 12), t3.top <= 180 && t3.right >= window.innerWidth * 0.65 && (i2 += 10), n3.length >= 1 && n3.length <= 32 && (i2 += 4), /登录|注册|签到|语言|主题|切换|导航|退出|logout|sign[ -]?in/i.test(n3) && (i2 -= 30), { element: e4, score: i2 };
      }).filter((e4) => e4.score >= 10).sort((e4, t3) => t3.score - e4.score)[0]?.element;
      if (n2)
        try {
          n2.click(), await new Promise((e4) => setTimeout(e4, 250)), u = e3().slice(0, 2e4), /(?:^|\n)\s*当前积分\s*[:：]?\s*-?\d/i.test(u) && n2.isConnected && n2.click();
        } catch {
        }
    }
    return { payloads: l2.filter((e3) => !!e3), crossOrigin: await c, bodyText: u };
  }
  function Di(e2) {
    return {
      quota: e2.quota,
      usedQuota: e2.usedQuota,
      ...e2.symbol ? { symbol: e2.symbol } : {},
      at: e2.at,
      source: e2.source ?? `api`
    };
  }
  function Oi(e2) {
    return bgPlatformState.Ci(new Date(e2));
  }
  function ki(e2, t, n = bgRecordsState.Ei) {
    if (!e2 || !Number.isFinite(t) || !Number.isFinite(n) || n < 0) return;
    let r = [];
    for (let t2 of Object.values(e2.daily ?? {})) t2.latest && r.push(t2.latest);
    e2.error || r.push(Di(e2));
    let i;
    for (let e3 of r)
      !Number.isFinite(e3.quota) || !Number.isFinite(e3.usedQuota) || !Number.isFinite(e3.at) || e3.at > t || t - e3.at > n || (!i || e3.at > i.at || e3.at === i.at && !i.symbol && e3.symbol) && (i = e3);
    if (!i) return;
    let a = i.symbol ?? e2.symbol;
    return {
      quota: i.quota,
      usedQuota: i.usedQuota,
      ...a ? { symbol: a } : {},
      at: i.at,
      ...i.source === `visible` ? { fromVisibleText: true } : {}
    };
  }
  function Ai(e2, t = 90) {
    let n = Object.keys(e2).sort().slice(-t);
    return Object.fromEntries(n.map((t2) => [t2, e2[t2]]));
  }
  function ji(e2, t, n = 90) {
    let r = { ...e2?.daily ?? {} };
    if (e2 && !e2.error && !e2.daily && Number.isFinite(e2.at)) {
      let t2 = Di(e2);
      r[Oi(t2.at)] = { first: t2, latest: t2 };
    }
    let i = Di(t), a = Oi(i.at), o = r[a] ?? {}, s = !o.first || i.at < o.first.at ? i : o.first, c = !o.latest || i.at >= o.latest.at ? i : o.latest;
    return r[a] = { ...o, first: s, latest: c }, Ai(r, n);
  }
  function Mi(e2, t, n, r, i = 90, a) {
    let o = e2?.[t], s = a ?? (o?.checkinReward === n ? o.checkinRewardSymbol : void 0), c = { ...o ?? {}, checkinReward: n, checkinRewardAt: r };
    return s ? c.checkinRewardSymbol = s : delete c.checkinRewardSymbol, Ai({ ...e2 ?? {}, [t]: c }, i);
  }
  function Ni(e2) {
    return e2 ? `visible` : `api`;
  }
  function Li(e2) {
    return `${e2}，未用作登录前基线；本次只能刷新余额，无法计算登录带来的额度增加量`;
  }
  function Ri(e2) {
    let t = new Date(e2), n = (e3) => String(e3).padStart(2, `0`);
    return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
  }
  function zi(e2) {
    if (!e2) return [];
    let t = [];
    for (let n of Object.values(e2.daily ?? {})) n.latest && t.push(n.latest);
    return e2.error || t.push({
      quota: e2.quota,
      usedQuota: e2.usedQuota,
      ...e2.symbol ? { symbol: e2.symbol } : {},
      at: e2.at,
      source: e2.source ?? `api`
    }), t;
  }
  function Bi(e2) {
    let t;
    for (let n of e2) Number.isFinite(n.at) && (!t || n.at > t.at) && (t = n);
    return t;
  }
  function Vi(e2, t) {
    if (ki(e2, t)) return bgRecordsState.Pi;
    if (!Number.isFinite(t)) return bgRecordsState.Ii;
    let n = Bi(zi(e2));
    if (!n) return bgRecordsState.Ii;
    let r = Ri(n.at);
    return n.at > t ? Li(
      `最近一次成功余额读取于 ${r}，晚于本次任务开始时间，不在 ${bgRecordsState.Fi} 小时归因窗口的可用范围内`
    ) : t - n.at > 1296e5 ? Li(`最近一次成功余额读取于 ${r}，已超过 ${bgRecordsState.Fi} 小时归因窗口`) : Li(`最近一次成功余额读取于 ${r}，但该记录的额度数据不完整`);
  }
  function ha(e2, t) {
    let n = t.quota + t.usedQuota - (e2.quota + e2.usedQuota), r = t.usedQuota - e2.usedQuota;
    return {
      reward: n,
      usageDelta: r,
      balanceDelta: t.quota - e2.quota,
      verdict: n > bgRecordsState.ma ? `rewarded` : r > bgRecordsState.ma ? `already-used` : `unchanged`,
      source: `balance-diff`,
      quotaAfter: t.quota,
      ...t.symbol ? { balanceSymbol: t.symbol } : {}
    };
  }
  function ga(e2, t = bgPlatformState.Ci()) {
    let n = e2?.daily;
    if (!n) return null;
    let r = n[t];
    if (!r?.latest) return null;
    let i = [];
    r.first && r.latest.at > r.first.at && i.push({
      metrics: ha(r.first, r.latest),
      baselineDay: t,
      currentDay: t,
      basis: `within-day`
    });
    let a = Object.keys(n).filter((e3) => e3 < t && !!n[e3]?.latest).sort().pop(), o = a ? n[a]?.latest : void 0;
    return a && o && i.push({ metrics: ha(o, r.latest), baselineDay: a, currentDay: t, basis: `previous-day` }), i.find((e3) => e3.metrics.verdict === `rewarded`) ?? i[0] ?? null;
  }
  function _a(e2, t, n = bgPlatformState.Ci()) {
    let r = ga(t, n), i = r?.metrics.verdict === `rewarded`, a = r?.basis === `within-day` ? `今天首次与最新余额快照` : r ? `${r.baselineDay} 与今天的余额快照` : null;
    return {
      accountId: e2,
      ok: true,
      manual: true,
      message: i ? `${bgRecordsState.pa}，已按余额差值计算增加量` : r ? `${bgRecordsState.pa}，余额差值未增加` : bgRecordsState.pa,
      steps: [
        `用户在管理页手动标记本次签到已完成`,
        ...a ? [`已按${a}计算总额度差值`] : [`没有可用的历史余额基线，无法计算增加量`],
        ...i ? [`该增加量是余额期间差值，可能包含同期间充值或其它入账`] : []
      ],
      ...r ? { metrics: r.metrics } : {}
    };
  }
  function Is(e2, t) {
    return bgCheckinState.Ss(e2, t).length > 0;
  }
  function Ls(e2) {
    if (typeof e2 == `number` && Number.isFinite(e2)) return e2;
    if (typeof e2 == `string` && e2.trim() !== ``) {
      let t = Number(e2);
      if (Number.isFinite(t)) return t;
    }
    return null;
  }
  function Rs(e2) {
    let t = new Date(e2);
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, `0`)}`;
  }
  function zs(e2, t, n) {
    if (e2 !== 200 || bgCheckinState.Ps(t, n)) return null;
    let r = null;
    try {
      r = bgCheckinState.Ms(JSON.parse(n));
    } catch {
      return null;
    }
    if (!r) return null;
    let i = bgCheckinState.Ms(r.data), a = bgCheckinState.Ms(i?.stats);
    if (!i || !a) return null;
    let o = [];
    if (Array.isArray(a.records))
      for (let e3 of a.records) {
        let t2 = bgCheckinState.Ms(e3);
        if (!t2) continue;
        let n2 = t2.checkin_date ?? t2.date, r2 = Ls(t2.quota_awarded ?? t2.quota);
        typeof n2 == `string` && r2 != null && o.push({ date: n2, quotaAwarded: r2 });
      }
    return { enabled: i.enabled !== false, checkedInToday: a.checked_in_today === true, records: o };
  }
  function Bs(e2, t) {
    if (!e2 || !t) return null;
    let n = new Set(e2.records.map((e3) => e3.date)), r = t.records.filter((e3) => !n.has(e3.date));
    if (r.length === 0) return null;
    let i = r.reduce((e3, t2) => e3 + t2.quotaAwarded, 0);
    return i > 0 ? i : null;
  }
  Object.assign(bgRecordsState, {
    Qr,
    $r,
    ei,
    ii,
    ai,
    oi,
    si,
    ci,
    li,
    ui,
    pi,
    mi,
    hi,
    gi,
    _i,
    vi,
    yi,
    xi,
    Si,
    Di,
    Oi,
    ki,
    Ai,
    ji,
    Mi,
    Ni,
    Li,
    Ri,
    zi,
    Bi,
    Vi,
    ha,
    ga,
    _a,
    Is,
    Ls,
    Rs,
    zs,
    Bs
  });
  async function handleRecordsMessage(e2, i) {
    switch (e2.type) {
      case `BALANCE_SNAPSHOT`:
        return bgPlatformState.X(async () => {
          let t = i.tab?.id;
          if (t == null) return { ok: false, error: `缺少任务标签页` };
          let n = await bgCheckinState.V.get(t);
          if (!n || n.runId !== e2.runId) return { ok: false, error: `任务已结束` };
          if (e2.phase === `button-before`) {
            let e3 = i.url ?? i.tab?.url;
            if (i.frameId !== 0 || !bgCheckinState.ut(n, e3))
              return { ok: false, error: `当前页面不属于顶层签到任务` };
            let t2 = n.effectiveCheckinMethod ?? n.site.checkin?.method;
            if (n.stage !== `checkin` || t2 !== `button`)
              return { ok: false, error: `当前任务不是有效的按钮签到阶段，已拒绝写入点击基线` };
          }
          if (!await bgCheckinState.th(n))
            return { ok: false, error: `账号归属已变更，已拒绝写入旧站余额` };
          if ((n.siteAccountCount ?? 0) > 1 && !n.identityConfirmed)
            return { ok: false, error: `账号身份尚未确认，已拒绝写入余额快照` };
          if (e2.phase === `relogin-before`) {
            if ((n.effectiveCheckinMethod ?? n.site.checkin?.method) !== `relogin`)
              return { ok: false, error: `当前任务不是退出重登流程，已拒绝写入重登基线` };
            if (!await bgCheckinState.V.saveReloginBalanceBefore(t, n.runId, e2.snapshot))
              return { ok: false, error: `任务已结束` };
          }
          return e2.phase === `button-before` && !await bgCheckinState.V.saveButtonBalanceBefore(t, n.runId, e2.snapshot) ? { ok: false, error: `按钮签到阶段或账号身份已变化，点击基线未写入` } : (await bgRecordsState.store.saveBalance(n.accountId, {
            quota: e2.snapshot.quota,
            usedQuota: e2.snapshot.usedQuota,
            ...e2.snapshot.symbol ? { symbol: e2.snapshot.symbol } : {},
            at: e2.snapshot.at,
            source: Ni(e2.snapshot.fromVisibleText)
          }), bgPlatformState.$(), { ok: true });
        });
      case `REFRESH_BALANCE`:
        return bgEntryState.Q(i) ? bgProxiesState.bh(e2.accountIds) : { ok: false, error: `仅扩展管理页可以刷新余额` };
      case `CHECKIN_REWARD_OBSERVATION`: {
        let n = i.tab?.id;
        if (n == null) return { ok: false, error: `缺少标签页信息` };
        let a = await bgCheckinState.V.get(n);
        if (!a || a.runId !== e2.runId) return { ok: false, error: `任务已结束` };
        let o = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find(
          (e3) => e3.id === a.accountId
        );
        if (!o) return { ok: false, error: `账号不存在` };
        let s = bgSitesState.Y(o.siteId, await bgPlatformState.t.get(bgPlatformState.r.sites, []));
        if (!s) return { ok: false, error: `站点配置不存在` };
        let c = ci(e2.bodyText, bgCheckinState.Th(s));
        return c && (await bgRecordsState.store.saveCheckinReward(
          o.id,
          c.reward,
          bgPlatformState.Ci(),
          Date.now(),
          c.symbol
        ), bgPlatformState.$()), { ok: true };
      }
    }
  }
  function initializeBackgroundRecords(step) {
    switch (step) {
      case 93: {
        bgRecordsState.Kr = [
          /(?:当前余额|账户余额|剩余额度|可用余额|余额)\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i,
          /\bbalance\b\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i
        ];
        break;
      }
      case 94: {
        bgRecordsState.qr = /(?:^|\n)\s*饼友\s*[·•・]\s*积分\s*[:：]?\s*(-?\d[\d,]*(?:\.\d+)?)/im;
        break;
      }
      case 95: {
        bgRecordsState.Jr = /(?:^|\n)\s*当前积分\s*[:：]?\s*(-?\d[\d,]*(?:\.\d+)?)/im;
        break;
      }
      case 96: {
        bgRecordsState.Yr = /每日签到奖励/g;
        break;
      }
      case 97: {
        bgRecordsState.Xr = /每日签到奖励\s*[+＋]\s*\d[\d,]*(?:\.\d+)?/;
        break;
      }
      case 98: {
        bgRecordsState.Zr = /((?:19|20)\d{2})\s*[\/\-.年]\s*(\d{1,2})\s*[\/\-.月]\s*(\d{1,2})\s*日?/;
        break;
      }
      case 99: {
        bgRecordsState.ti = [
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
        break;
      }
      case 100: {
        bgRecordsState.ni = /(?:今天|今日)\s*已签到|已签到\s*(?:今天|今日)|\bchecked\s+in\s+today\b/i;
        break;
      }
      case 101: {
        bgRecordsState.ri = /(?:每日签到|签到|check[\s-]?in|today\s+reward|(?:今天|今日)\s*\+)/i;
        break;
      }
      case 102: {
        bgRecordsState.di = [`/api/user/self`, `/api/user/info`];
        break;
      }
      case 103: {
        bgRecordsState.fi = [`/api/v1/check-in/status`, `/api/v1/auth/me`];
        break;
      }
      case 104: {
        bgRecordsState.bi = 1e-9;
        break;
      }
      case 105: {
        bgRecordsState.Ei = 1296e5;
        break;
      }
      case 106: {
        bgRecordsState.Pi = `已载入该账号最近一次成功余额，登录后将按总额度差计算今日增加量`;
        break;
      }
      case 107: {
        bgRecordsState.Fi = Math.round(bgRecordsState.Ei / 36e5);
        break;
      }
      case 108: {
        bgRecordsState.Ii = `该账号还没有成功读取过余额，本次只能刷新余额，无法计算登录带来的额度增加量`;
        break;
      }
      case 117: {
        bgRecordsState.pa = `手动标记为已签到`;
        break;
      }
      case 118: {
        bgRecordsState.ma = 1e-9;
        break;
      }
      case 131: {
        Object.assign(bgRecordsState.store, {
          async saveBalance(e2, n) {
            return bgPlatformState.R(async () => {
              let i = await bgPlatformState.t.get(bgPlatformState.r.balances, {}), a = i[e2], o = n.symbol ?? a?.symbol, s = o ? { ...n, symbol: o } : n, c = { ...a ?? {}, ...s, daily: ji(a, s) };
              delete c.error, await bgPlatformState.t.set(bgPlatformState.r.balances, { ...i, [e2]: c });
            });
          }
        });
        break;
      }
      case 132: {
        Object.assign(bgRecordsState.store, {
          async saveCheckinReward(e2, n, i, a = Date.now(), o) {
            return bgPlatformState.R(async () => {
              let s = await bgPlatformState.t.get(bgPlatformState.r.balances, {}), c = s[e2], l2 = c ?? { quota: 0, usedQuota: 0, at: a, error: `余额尚未读取` }, u = o ?? (c?.checkinRewardDay === i && c.checkinReward === n ? c.checkinRewardSymbol : void 0), d = {
                ...l2,
                checkinReward: n,
                checkinRewardDay: i,
                checkinRewardAt: a,
                daily: Mi(l2.daily, i, n, a, void 0, u)
              };
              u ? d.checkinRewardSymbol = u : delete d.checkinRewardSymbol, await bgPlatformState.t.set(bgPlatformState.r.balances, { ...s, [e2]: d });
            });
          }
        });
        break;
      }
      case 133: {
        Object.assign(bgRecordsState.store, {
          async clearBalance(e2) {
            return bgPlatformState.R(async () => {
              let n = await bgPlatformState.t.get(bgPlatformState.r.balances, {});
              if (!(e2 in n)) return;
              let i = { ...n };
              delete i[e2], await bgPlatformState.t.set(bgPlatformState.r.balances, i);
            });
          }
        });
        break;
      }
      case 134: {
        Object.assign(bgRecordsState.store, {
          async saveBalanceError(e2, n) {
            return bgPlatformState.R(async () => {
              let i = await bgPlatformState.t.get(bgPlatformState.r.balances, {}), a = i[e2];
              await bgPlatformState.t.set(bgPlatformState.r.balances, {
                ...i,
                [e2]: {
                  ...a ?? {},
                  quota: a?.quota ?? 0,
                  usedQuota: a?.usedQuota ?? 0,
                  at: Date.now(),
                  error: n
                }
              });
            });
          }
        });
        break;
      }
    }
  }
  var recordService = Object.freeze({
    getResults: () => bgPlatformState.t.get(bgPlatformState.r.results, {}),
    getBalances: () => bgPlatformState.t.get(bgPlatformState.r.balances, {}),
    saveBalance: (...args) => bgRecordsState.store.saveBalance(...args),
    saveReward: (...args) => bgRecordsState.store.saveCheckinReward(...args),
    saveBalanceError: (...args) => bgRecordsState.store.saveBalanceError(...args),
    handleMessage: handleRecordsMessage
  });

  // src/modules/proxies/service.js
  var bgProxiesState = { store: {} };
  function he(e2) {
    let t = e2.trim().toLowerCase();
    return t === `localhost` || t === `127.0.0.1` || t === `::1` || t === `[::1]`;
  }
  function ge(e2) {
    let t = String(e2.scheme).trim().toLowerCase(), n = t === `socks` ? `socks5` : t === `mixed` ? `http` : t === `https` || t === `socks4` || t === `socks5` ? t : `http`;
    return n === `https` && he(e2.host) ? `http` : n;
  }
  function _e(e2) {
    let t = ge(e2), n = String(e2.host).trim().replace(/^\[|\]$/g, ``), r = Number(e2.port);
    return t === e2.scheme && n === e2.host && r === e2.port ? e2 : { ...e2, scheme: t, host: n, port: r };
  }
  async function xe(e2) {
    if (bgSitesState.me(e2)) throw Error(bgProxiesState.be);
    let t = _e(e2);
    if (!t.host || !Number.isInteger(t.port) || t.port < 1 || t.port > 65535)
      throw Error(`代理地址不完整，请重新导入或填写正确的主机和端口`);
    let n = { scheme: t.scheme, host: t.host, port: t.port };
    await chrome.proxy.settings.set({
      value: {
        mode: `fixed_servers`,
        rules: { singleProxy: n, bypassList: [`localhost`, `127.0.0.1`, `<local>`] }
      },
      scope: `regular`
    }), await Se(n);
    let r = e2.username ?? ``, i = e2.password ?? ``;
    r || i ? (bgProxiesState.ve = { username: r, password: i }, De()) : bgProxiesState.ve = null;
  }
  async function Se(e2) {
    let t = await chrome.proxy.settings.get({ incognito: false }).catch(() => null);
    if (!t) throw Error(`无法读取浏览器代理设置，代理未生效`);
    let n = t.levelOfControl;
    if (n !== `controlled_by_this_extension`)
      throw Error(
        n === `controlled_by_other_extensions` ? `浏览器代理设置被其他扩展占用，本扩展改不动。请先停用那个扩展（常见的是 SwitchyOmega、各类加速器插件）` : n === `not_controllable` ? `浏览器代理设置被系统策略锁定，扩展无权修改` : `浏览器代理设置未被本扩展接管（${n}），代理未生效`
      );
    let r = t.value?.rules?.singleProxy;
    if (!r || r.host !== e2.host || r.port !== e2.port)
      throw Error(
        `代理设置回读不一致：期望 ${e2.host}:${e2.port}，实际 ${r ? `${r.host}:${r.port}` : `空`}`
      );
  }
  async function Ce() {
    bgProxiesState.ve = null, await chrome.proxy.settings.clear({ scope: `regular` });
  }
  async function we() {
    let e2 = await chrome.proxy.settings.get({ incognito: false }).catch(() => null);
    if (!e2 || e2.levelOfControl !== `controlled_by_this_extension`) return null;
    let t = e2.value?.rules?.singleProxy;
    return !t?.host || !Number.isInteger(t.port) ? null : { host: String(t.host), port: Number(t.port) };
  }
  function Te(e2, t) {
    return `本机 ${e2}:${t} 上没有程序在监听 —— 内核（Clash Verge / mihomo 等）没启动，或该节点的本地端口还没生效`;
  }
  function Ee(e2, t) {
    return t && he(t.host) ? Te(t.host, t.port) : e2;
  }
  function De() {
    bgProxiesState.ye || (bgProxiesState.ye = true, chrome.webRequest.onAuthRequired.addListener(
      (e2, t) => {
        !e2.isProxy || !bgProxiesState.ve ? t?.({}) : t?.({ authCredentials: { ...bgProxiesState.ve } });
      },
      { urls: [`<all_urls>`] },
      [`asyncBlocking`]
    ));
  }
  async function ke() {
    for (let e2 of bgProxiesState.Oe)
      try {
        let t = new AbortController(), n = setTimeout(() => t.abort(), 6e3), r = await fetch(e2.url, { signal: t.signal, cache: `no-store` });
        if (clearTimeout(n), !r.ok) continue;
        let i = await r.json(), a = i[e2.ip], o = i[e2.country];
        if (typeof a == `string` && a.trim())
          return {
            ip: a.trim(),
            ...typeof o == `string` && o.trim() ? { country: o.trim() } : {}
          };
      } catch {
      }
    return {};
  }
  async function Ae(e2, t) {
    if (!he(e2)) return;
    let n = new AbortController(), r = false, i = setTimeout(() => {
      r = true, n.abort();
    }, 2500);
    try {
      return await fetch(`http://${e2}:${t}/`, {
        signal: n.signal,
        cache: `no-store`,
        redirect: `manual`
      }) ? `listening` : void 0;
    } catch {
      return r ? void 0 : `closed`;
    } finally {
      clearTimeout(i);
    }
  }
  async function je(e2, t = `https://www.gstatic.com/generate_204`, n = false, r = 12e3) {
    if (bgSitesState.me(e2)) return { ok: false, ms: 0, message: bgProxiesState.be };
    let i = Date.now(), a = _e(e2), o = false, s;
    try {
      await xe(e2), o = true, await new Promise((e3) => setTimeout(e3, 400));
      let c = new AbortController();
      s = setTimeout(() => c.abort(), r);
      let l2 = await fetch(t, { signal: c.signal, cache: `no-store` });
      clearTimeout(s);
      let u = Date.now() - i, d = l2.status === 204 || l2.status >= 200 && l2.status < 400;
      if (!d) return { ok: d, ms: u, message: `返回 ${l2.status}` };
      let f = n ? await ke() : {};
      return {
        ok: d,
        ms: u,
        message: `${a.scheme === e2.scheme ? `` : `本地代理已自动改用 http，`}${f.country ? `${f.country} · ` : ``}连通，${u}ms`,
        ...f
      };
    } catch (e3) {
      let t2 = Date.now() - i, n2 = e3 instanceof Error ? e3.message : String(e3), s2 = Math.max(1, Math.round(r / 1e3));
      if (!o) return { ok: false, ms: t2, message: n2 };
      if (n2.includes(`abort`)) return { ok: false, ms: t2, message: `超时（${s2}s）` };
      if (he(a.host)) {
        let e4 = await Ae(a.host, a.port), n3 = e4 === `closed` ? `${a.host}:${a.port} 上没有任何程序在监听 —— Clash Verge 还没用上这份 listeners 配置(脚本没粘 / 粘错订阅 / 没重载)` : e4 === `listening` ? `${a.host}:${a.port} 端口正常在监听,但流量出不去 —— 多半是当前激活的订阅与脚本里的节点名对不上,或该节点已失效` : `探测 ${a.host}:${a.port} 是否有程序监听时超时,无法判断是端口没生效还是节点连不通；请先在 Clash Verge 里确认该端口处于监听状态`;
        return {
          ok: false,
          ms: t2,
          message: `无法通过本机代理 ${a.host}:${a.port} 连接测试地址。${n3}`,
          ...e4 ? { listenerProbe: e4 } : {}
        };
      }
      return { ok: false, ms: t2, message: n2 };
    } finally {
      s && clearTimeout(s), await Ce();
    }
  }
  function Me(e2) {
    return !(e2.activeTabId != null && e2.activeTabId <= 0 || e2.launchInFlight);
  }
  function Ne(e2, t) {
    return e2 ? `${e2}；也可能是${t}` : t;
  }
  function Pe(e2, t, n) {
    let r = e2.replace(/^net::/, ``);
    if (r === `ERR_ABORTED`) return null;
    let i = t ? `扩展代理` : `Chrome/系统网络`, a = t && n && he(n.host) ? Te(n.host, n.port) : null;
    return r === `ERR_PROXY_CONNECTION_FAILED` ? a ?? `${i}连接失败，请检查代理协议、主机和端口` : r === `ERR_TUNNEL_CONNECTION_FAILED` ? a ?? `${i}无法建立 HTTPS 隧道` : r === `ERR_NAME_NOT_RESOLVED` ? Ne(a, `站点域名解析失败`) : r === `ERR_CONNECTION_TIMED_OUT` || r === `ERR_TIMED_OUT` ? Ne(a, `连接站点超时`) : r === `ERR_CONNECTION_REFUSED` ? a ?? `站点或代理拒绝连接` : r === `ERR_CONNECTION_CLOSED` ? a ?? `${i}提前关闭了连接` : r === `ERR_CONNECTION_RESET` ? Ne(a, `连接被站点或代理重置`) : r === `ERR_ADDRESS_UNREACHABLE` || r === `ERR_INTERNET_DISCONNECTED` ? `${i}当前不可达` : r.startsWith(`ERR_CERT_`) ? `站点 TLS 证书错误（${r}）` : null;
  }
  function en(e2, t, n) {
    let r = /* @__PURE__ */ new Set([...t, ...n]);
    for (let t2 = Math.max(1, e2); t2 <= bgProxiesState.$t; t2++) if (!r.has(t2)) return t2;
    return NaN;
  }
  function tn(e2, t = bgProxiesState.Zt, n = bgProxiesState.Xt, r = []) {
    let i = Number.isInteger(t) && t > 0 && t <= bgProxiesState.$t ? t : bgProxiesState.Zt, a = [];
    for (let t2 of e2) {
      let e3 = String(t2 ?? ``).trim();
      e3 && !a.includes(e3) && a.push(e3);
    }
    if (!a.length) return { entries: [], yaml: ``, script: ``, poolEntries: [], dropped: 0 };
    let o = /* @__PURE__ */ new Map(), s = new Set(n);
    for (let e3 of r) {
      let t2 = String(e3?.nodeName ?? ``).trim(), n2 = Number(e3?.port);
      !t2 || !Number.isInteger(n2) || n2 < 1 || n2 > bgProxiesState.$t || (o.has(t2) || o.set(t2, n2), s.add(n2));
    }
    let c = new Set(n), l2 = [], u = 0;
    for (let e3 of a) {
      let t2 = o.get(e3);
      if (t2 != null && !c.has(t2)) {
        l2.push({ nodeName: e3, port: t2, listenerName: `hub-${t2}` });
        continue;
      }
      let r2 = en(i, s, n);
      !Number.isInteger(r2) || r2 > bgProxiesState.$t ? u += 1 : (s.add(r2), l2.push({ nodeName: e3, port: r2, listenerName: `hub-${r2}` }));
    }
    return l2.sort((e3, t2) => e3.port - t2.port), {
      entries: l2,
      yaml: rn(l2),
      script: an(l2),
      poolEntries: l2.map((e3) => ({
        name: e3.nodeName,
        scheme: `http`,
        host: bgProxiesState.Qt,
        port: e3.port
      })),
      dropped: u
    };
  }
  function nn(e2, t) {
    let n = /* @__PURE__ */ new Set();
    for (let t2 of e2) {
      let e3 = String(t2 ?? ``).trim();
      e3 && n.add(e3);
    }
    let r = [], i = [], a = /* @__PURE__ */ new Set();
    for (let e3 of t) {
      let t2 = String(e3?.nodeName ?? ``).trim(), o2 = Number(e3?.port);
      t2 && Number.isInteger(o2) && (a.has(t2) || (a.add(t2), (n.has(t2) ? r : i).push({ nodeName: t2, port: o2, listenerName: `hub-${o2}` })));
    }
    let o = [];
    for (let e3 of n) a.has(e3) || o.push(e3);
    return { kept: r, addedNames: o, removed: i };
  }
  function rn(e2) {
    if (!e2.length) return ``;
    let t = [`listeners:`];
    for (let n of e2)
      t.push(
        `  - name: ${n.listenerName}`,
        `    type: mixed`,
        `    port: ${n.port}`,
        `    listen: ${bgProxiesState.Qt}`,
        `    proxy: ${sn(n.nodeName)}`
      );
    return t.join(`
`);
  }
  function an(e2) {
    if (!e2.length) return ``;
    let t = [
      `// 由「自助签到中转站」扩展生成 —— 一节点一本地端口，按名字锁定端口不漂移。`,
      `// 粘到 Clash Verge 对应订阅的「扩展配置 → Script」里；想完全回滚就清空这个文件再重载。`,
      `function main(config) {`,
      `  if (!config) return config;`,
      `  var map = {`
    ];
    for (let n of e2) t.push(`    ${bn(n.nodeName)}: ${n.port},`);
    return t.push(
      `  };`,
      `  var listeners = [];`,
      `  for (var key in map) {`,
      `    if (!Object.prototype.hasOwnProperty.call(map, key)) continue;`,
      `    listeners.push({`,
      `      name: 'hub-' + map[key],`,
      `      type: 'mixed',`,
      `      port: map[key],`,
      `      listen: '127.0.0.1',`,
      `      proxy: key,`,
      `    });`,
      `  }`,
      `  config.listeners = listeners;`,
      `  return config;`,
      `}`
    ), t.join(`
`);
  }
  function sn(e2) {
    return `"${e2.replace(/\\/g, `\\\\`).replace(/"/g, `\\"`).replace(/\t/g, `\\t`).replace(/\n/g, `\\n`).replace(/\r/g, `\\r`).replace(bgProxiesState.on, (e3) => {
      let t = e3.charCodeAt(0);
      return t <= 255 ? `\\x${t.toString(16).toUpperCase().padStart(2, `0`)}` : `\\u${t.toString(16).toUpperCase().padStart(4, `0`)}`;
    })}"`;
  }
  function cn(e2, t) {
    let n = /* @__PURE__ */ new Map(), r = Array.isArray(e2) ? e2 : e2 && typeof e2 == `object` && Array.isArray(e2.listeners) ? e2.listeners : e2 && typeof e2 == `object` && e2.listeners && typeof e2.listeners == `object` ? Object.values(e2.listeners) : [];
    for (let e3 of r) {
      if (!e3 || typeof e3 != `object`) continue;
      let r2 = e3, i = typeof r2.port == `number` ? r2.port : Number(r2.port), a = typeof r2.proxy == `string` && r2.proxy.trim() ? r2.proxy.trim() : typeof r2.name == `string` && r2.name.trim() ? r2.name.trim() : ``;
      Number.isInteger(i) && t.has(i) && a && n.set(i, a);
    }
    return n;
  }
  function mn(e2) {
    let t = [], n = /* @__PURE__ */ new Set();
    for (let r of hn(e2)) {
      if (!yn(r)) continue;
      let e3 = gn(r.port);
      if (e3 === null || n.has(e3)) continue;
      let i = _n(r.name), a = _n(r.proxy);
      if (!i || !a) continue;
      let o = vn(r.type);
      bgProxiesState.pn.has(o) || bgProxiesState.fn.has(a.toUpperCase()) || (n.add(e3), t.push({ listenerName: i, nodeName: a, port: e3, listenerType: o }));
    }
    return t;
  }
  function hn(e2) {
    if (Array.isArray(e2)) return e2;
    if (!yn(e2)) return [];
    let t = e2.listeners;
    return Array.isArray(t) ? t : yn(t) ? Object.values(t) : [];
  }
  function gn(e2) {
    return typeof e2 != `number` || !Number.isInteger(e2) || e2 < bgProxiesState.ln || e2 > bgProxiesState.un ? null : e2;
  }
  function _n(e2) {
    if (typeof e2 != `string`) return ``;
    let t = e2.trim();
    return !t || t.length > bgProxiesState.dn ? `` : t;
  }
  function vn(e2) {
    return typeof e2 == `string` ? e2.trim().toLowerCase().replace(/[\s_-]+/g, ``) : ``;
  }
  function yn(e2) {
    return !!e2 && typeof e2 == `object` && !Array.isArray(e2);
  }
  function bn(e2) {
    return `"` + e2.replace(/\\/g, `\\\\`).replace(/"/g, `\\"`).replace(/'/g, `\\'`).replace(/`/g, "\\`").replace(/\t/g, `\\t`).replace(/\n/g, `\\n`).replace(/\r/g, `\\r`).replace(bgProxiesState.on, ``) + `"`;
  }
  function Cn(e2) {
    let t = e2.trim().toLowerCase();
    return !t || bgProxiesState.Sn.some((e3) => t.includes(e3.toLowerCase()));
  }
  function En(e2) {
    let t = e2.trim();
    if (!t) return { nodes: [], skipped: [], duplicates: 0, unsupportedNames: [], format: `unknown` };
    if (zn(t)) return Dn(Bn(t), `clash-yaml`);
    let n = On(t);
    if (n !== null) return Dn(An(n), `base64`);
    let r = An(t);
    return Dn(r, r.nodes.length > 0 || r.skips.length > 0 ? `uri-list` : `unknown`);
  }
  function Dn(e2, t) {
    let n = /* @__PURE__ */ new Set(), r = [], i = 0;
    for (let t2 of e2.nodes) {
      let e3 = `${t2.scheme}://${t2.host.toLowerCase()}:${t2.port}`;
      n.has(e3) ? i += 1 : (n.add(e3), r.push(t2));
    }
    let a = /* @__PURE__ */ new Map(), o = [], s = /* @__PURE__ */ new Set();
    for (let t2 of e2.skips) {
      let e3 = `${t2.reason}:${t2.scheme ?? ``}`, n2 = a.get(e3);
      n2 ? n2.count += 1 : a.set(e3, { reason: t2.reason, ...t2.scheme ? { scheme: t2.scheme } : {}, count: 1 }), t2.reason === `unsupported-scheme` && t2.name && !s.has(t2.name) && !Cn(t2.name) && (s.add(t2.name), o.push(t2.name));
    }
    return {
      nodes: r,
      skipped: [...a.values()].sort(
        (e3, t2) => t2.count - e3.count || (e3.scheme ?? ``).localeCompare(t2.scheme ?? ``)
      ),
      duplicates: i,
      unsupportedNames: o,
      format: t
    };
  }
  function On(e2) {
    let t = e2.replace(/\s+/g, ``);
    if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(t)) return null;
    try {
      let e3 = t.replace(/-/g, `+`).replace(/_/g, `/`), n = e3.padEnd(Math.ceil(e3.length / 4) * 4, `=`), r = kn(atob(n));
      return r.includes(`://`) ? r : null;
    } catch {
      return null;
    }
  }
  function kn(e2) {
    let t = Uint8Array.from(e2, (e3) => e3.charCodeAt(0));
    return new TextDecoder().decode(t);
  }
  function An(e2) {
    let t = { nodes: [], skips: [] };
    for (let n of e2.split(/\r?\n/)) {
      let e3 = n.trim().replace(/^[-*]\s+/, ``);
      if (!e3 || e3.startsWith(`#`)) continue;
      let r = /^([a-z][a-z0-9+.-]*):\/\/(.*)$/i.exec(e3);
      if (!r) {
        let n2 = jn(e3);
        n2 && t.nodes.push(n2);
        continue;
      }
      let i = r[1].toLowerCase(), a = bgProxiesState.wn[i];
      if (!a || !bgProxiesState.xn.has(a)) {
        let e4 = Mn(i, r[2]);
        t.skips.push({ reason: `unsupported-scheme`, scheme: i, ...e4 ? { name: e4 } : {} });
        continue;
      }
      let o = Nn(a, r[2]);
      o ? t.nodes.push(o) : t.skips.push({ reason: `malformed`, scheme: i });
    }
    return t;
  }
  function jn(e2) {
    let t = /^(?:(https?|socks4|socks5|socks)\s+)?(\[[^\]]+\]|[^\s:@]+)(?::|\s+)(\d{1,5})$/i.exec(e2);
    if (!t) return null;
    let n = bgProxiesState.wn[(t[1] ?? `http`).toLowerCase()], r = t[2], i = Number(t[3]);
    return !n || !r || !Number.isInteger(i) || i < 1 || i > 65535 ? null : {
      name: `${r.replace(/^\[|\]$/g, ``)}:${i}`,
      scheme: ge({ scheme: n, host: r }),
      host: r.replace(/^\[|\]$/g, ``),
      port: i,
      sourceLabel: `手动导入`
    };
  }
  function Mn(e2, t) {
    if (e2 === `vmess`) {
      let e3 = Ln(t.split(/[?#]/)[0] ?? ``);
      if (!e3) return null;
      try {
        let t2 = JSON.parse(e3), n2 = t2.ps ?? t2.remarks;
        return typeof n2 == `string` && n2.trim() ? n2.trim() : null;
      } catch {
        return null;
      }
    }
    let n = t.indexOf(`#`);
    return n < 0 ? null : Rn(t.slice(n + 1)).trim() || null;
  }
  function Nn(e2, t) {
    let n = t.indexOf(`#`), r = n >= 0 ? Rn(t.slice(n + 1)).trim() : ``, i = n >= 0 ? t.slice(0, n) : t;
    if (i = i.split(/[/?]/)[0] ?? ``, !i) return null;
    let a = ``, o = i.lastIndexOf(`@`);
    o >= 0 && (a = i.slice(0, o), i = i.slice(o + 1));
    let s = Pn(i);
    if (!s) return null;
    let c = s.port ?? bgProxiesState.Tn[e2];
    if (!Number.isInteger(c) || c <= 0 || c > 65535) return null;
    let { username: l2, password: u } = In(a);
    return {
      name: r || `${s.host}:${c}`,
      scheme: ge({ scheme: e2, host: s.host }),
      host: s.host,
      port: c,
      ...l2 ? { username: l2 } : {},
      ...u ? { password: u } : {}
    };
  }
  function Pn(e2) {
    if (e2.startsWith(`[`)) {
      let t2 = e2.indexOf(`]`);
      if (t2 < 0) return null;
      let n2 = e2.slice(0, t2 + 1), r2 = e2.slice(t2 + 1);
      return r2 ? r2.startsWith(`:`) ? { host: n2, port: Fn(r2.slice(1)) ?? void 0 } : null : { host: n2 };
    }
    let t = e2.lastIndexOf(`:`);
    if (t < 0) return e2 ? { host: e2 } : null;
    let n = e2.slice(0, t), r = Fn(e2.slice(t + 1));
    return !n || r == null ? null : { host: n, port: r };
  }
  function Fn(e2) {
    if (!/^\d+$/.test(e2)) return null;
    let t = Number(e2);
    return t > 0 && t <= 65535 ? t : null;
  }
  function In(e2) {
    if (!e2) return {};
    let t = Rn(e2);
    if (!t.includes(`:`)) {
      let e3 = Ln(t);
      e3?.includes(`:`) && (t = e3);
    }
    let n = t.indexOf(`:`);
    if (n < 0) return t ? { username: t } : {};
    let r = t.slice(0, n), i = t.slice(n + 1);
    return { ...r ? { username: r } : {}, ...i ? { password: i } : {} };
  }
  function Ln(e2) {
    if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(e2)) return null;
    try {
      let t = e2.replace(/-/g, `+`).replace(/_/g, `/`);
      return kn(atob(t.padEnd(Math.ceil(t.length / 4) * 4, `=`)));
    } catch {
      return null;
    }
  }
  function Rn(e2) {
    try {
      return decodeURIComponent(e2);
    } catch {
      return e2;
    }
  }
  function zn(e2) {
    return /^\s*proxies\s*:/m.test(e2);
  }
  function Bn(e2) {
    let t = { nodes: [], skips: [] }, n = e2.split(/\r?\n/), r = false, i = [], a = () => {
      if (!i.length) return;
      let e3 = Vn(
        i.join(`
`),
        t
      );
      e3 && t.nodes.push(e3), i = [];
    };
    for (let e3 of n)
      /^\s*proxies\s*:/.test(e3) ? r = true : r && (/^[^\s#-]/.test(e3) ? (a(), r = false) : /^\s*-\s/.test(e3) ? (a(), i.push(e3.replace(/^\s*-\s/, ``))) : i.length && e3.trim() && i.push(e3.trim()));
    return a(), t;
  }
  function Vn(e2, t) {
    let n = Hn(e2, `type`)?.toLowerCase();
    if (!n) return null;
    let r = bgProxiesState.wn[n];
    if (!r || !bgProxiesState.xn.has(r)) {
      let r2 = Hn(e2, `name`);
      return t.skips.push({ reason: `unsupported-scheme`, scheme: n, ...r2 ? { name: r2 } : {} }), null;
    }
    let i = Hn(e2, `server`), a = Fn(Hn(e2, `port`) ?? ``);
    if (!i || a == null) return t.skips.push({ reason: `malformed`, scheme: n }), null;
    let o = Hn(e2, `tls`)?.toLowerCase() === `true`, s = r === `http` && o ? `https` : r, c = Hn(e2, `username`), l2 = Hn(e2, `password`);
    return {
      name: Hn(e2, `name`) || `${i}:${a}`,
      scheme: ge({ scheme: s, host: i }),
      host: i,
      port: a,
      ...c ? { username: c } : {},
      ...l2 ? { password: l2 } : {}
    };
  }
  function Hn(e2, t) {
    let n = RegExp(`(?:^|[\\s{,])${t}\\s*:\\s*([^,}\\n]+)`, `i`).exec(e2);
    if (!n) return null;
    let r = n[1].trim().replace(/\s+#.*$/, ``).trim(), i = /^(['"])(.*)\1$/.exec(r);
    return (i ? i[2] : r).trim() || null;
  }
  function Un(e2) {
    let t = String(e2 ?? ``).trim();
    if (!t) return null;
    let n;
    try {
      n = new URL(t);
    } catch {
      return null;
    }
    if (n.protocol !== `http:` && n.protocol !== `https:`) return null;
    let r = n.hostname.toLowerCase();
    return r === `localhost` || r === `127.0.0.1` || r === `::1` || r === `0.0.0.0` || /^10\./.test(r) || /^192\.168\./.test(r) || /^172\.(1[6-9]|2\d|3[01])\./.test(r) || r.endsWith(`.local`) || r === `169.254.169.254` ? null : n.href;
  }
  function Gn(e2) {
    let t = e2.trim().toLowerCase();
    return !t || bgProxiesState.Wn.some((e3) => t.includes(e3.toLowerCase()));
  }
  function Kn(e2, t) {
    let n = En(e2).unsupportedNames.filter((e3) => !Gn(e3)), r = t.filter((e3) => !Gn(e3.nodeName)), i = nn(n, r), a = tn([...i.kept.map((e3) => e3.nodeName), ...i.addedNames], void 0, void 0, r), o = new Set(i.addedNames);
    return {
      entries: a.entries,
      addedEntries: a.entries.filter((e3) => o.has(e3.nodeName)),
      removedNames: i.removed.map((e3) => e3.nodeName),
      poolEntries: a.poolEntries.filter((e3) => o.has(e3.name))
    };
  }
  async function qn() {
    let e2 = await bgPlatformState.t.get(bgPlatformState.r.listenerPlan, []);
    return Array.isArray(e2) ? e2 : [];
  }
  async function Jn(e2) {
    await bgPlatformState.t.set(bgPlatformState.r.listenerPlan, [...e2]);
  }
  function Yn() {
    let e2 = Promise.resolve();
    return {
      run(t) {
        let n = e2.then(t, t);
        return e2 = n.catch(() => void 0), n;
      }
    };
  }
  function Xn(e2) {
    return e2 === 0;
  }
  function ua(e2) {
    return e2.replace(/^\s*[[［(（]\s*[A-Za-z]{2}\s*[\]］)）]\s*/u, ``).replace(/[(（]\s*\d{2,5}\s*[)）]\s*$/u, ``).replace(/[\s_\-—－]+/gu, ``).toLowerCase().trim();
  }
  function da(e2) {
    let t = e2.host.trim().toLowerCase(), n = t.startsWith(`[`) && t.endsWith(`]`) ? t.slice(1, -1) : t;
    return n === `localhost` || n === `127.0.0.1` || n === `::1` || n === `0:0:0:0:0:0:0:1` ? `local-listener:${e2.port}` : `${e2.scheme}://${n}:${e2.port}`;
  }
  function fa(e2, t) {
    let n = /* @__PURE__ */ new Map();
    for (let t2 of e2) {
      if (t2.nameOnly !== true) continue;
      let e3 = ua(t2.name);
      if (!e3) continue;
      let r2 = n.get(e3) ?? [];
      r2.push(t2), n.set(e3, r2);
    }
    let r = /* @__PURE__ */ new Map();
    for (let t2 of e2) {
      if (t2.nameOnly === true) continue;
      let e3 = da(t2), n2 = r.get(e3) ?? [];
      n2.push(t2), r.set(e3, n2);
    }
    let i = [], a = [], o = [], s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set();
    for (let e3 of t) {
      if (e3.nameOnly === true) {
        o.push(e3);
        continue;
      }
      let t2 = da(e3);
      if (c.has(t2)) continue;
      c.add(t2);
      let l2 = ua(e3.name), u = l2 ? n.get(l2) ?? [] : [], d = l2 && !s.has(l2) ? u[0] : void 0, f = r.get(t2) ?? [];
      if (f.length) {
        if (e3.sourceLabel !== `Clash Verge`) continue;
        if (d) {
          s.add(l2), i.push({
            id: d.id,
            patch: {
              name: e3.name,
              scheme: e3.scheme,
              host: e3.host,
              port: e3.port,
              sourceLabel: e3.sourceLabel
            }
          });
          for (let e4 of u) e4.id !== d.id && a.push({ fromId: e4.id, toId: d.id });
          for (let e4 of f) e4.id !== d.id && a.push({ fromId: e4.id, toId: d.id });
          continue;
        }
        let t3 = f[0], n2 = f.slice(1);
        (t3.name !== e3.name || t3.sourceLabel !== e3.sourceLabel || n2.length) && i.push({ id: t3.id, patch: { name: e3.name, sourceLabel: e3.sourceLabel } });
        for (let e4 of n2) a.push({ fromId: e4.id, toId: t3.id });
      } else if (d) {
        s.add(l2), i.push({
          id: d.id,
          patch: {
            name: e3.name,
            scheme: e3.scheme,
            host: e3.host,
            port: e3.port,
            ...e3.sourceLabel === void 0 ? {} : { sourceLabel: e3.sourceLabel }
          }
        });
        for (let e4 of u) e4.id !== d.id && a.push({ fromId: e4.id, toId: d.id });
      } else o.push(e3);
    }
    return { upgrades: i, merges: a, additions: o };
  }
  function go(e2) {
    return new Set(e2.filter((e3) => e3.nameOnly !== true).map((e3) => e3.id));
  }
  function _o(e2, t, n, r, i) {
    let { upgrades: a, merges: o, additions: s } = fa(e2, r), c = new Map(a.map((e3) => [e3.id, e3.patch])), l2 = new Map(o.map(({ fromId: e3, toId: t2 }) => [e3, t2])), u = new Set(l2.keys()), d = (e3) => e3.nameOnly ? `name:${e3.name.trim()}` : da(e3), f = e2.flatMap((e3) => {
      if (u.has(e3.id)) return [];
      let t2 = c.get(e3.id);
      if (!t2) return [e3];
      let { nameOnly: n2, ...r2 } = e3;
      return [{ ...r2, ...t2 }];
    }), p = new Set(f.map(d)), m = [];
    for (let e3 of s) {
      let t2 = d(e3);
      p.has(t2) || (p.add(t2), m.push({ ...e3, id: bgPlatformState.Ti(`px`) }));
    }
    let h = i ? new Set(r.filter((e3) => e3.nameOnly !== true).map(da)) : void 0, g = i ? new Set(r.filter((e3) => e3.nameOnly === true).map((e3) => ua(e3.name))) : void 0, _ = /* @__PURE__ */ new Set();
    for (let e3 of t) e3.proxyId && _.add(e3.proxyId);
    for (let e3 of n) e3.proxyId && _.add(e3.proxyId);
    let v = /* @__PURE__ */ new Set(), y = 0;
    return {
      proxies: f.concat(m).filter(
        (e3) => !i || e3.sourceLabel !== i || e3.nameOnly !== true && h?.has(da(e3)) || e3.nameOnly === true && g?.has(ua(e3.name)) ? true : _.has(e3.id) ? (y += 1, true) : (v.add(e3.id), false)
      ),
      accounts: t.map((e3) => {
        if (!e3.proxyId) return e3;
        let t2 = l2.get(e3.proxyId);
        if (t2) return { ...e3, proxyId: t2 };
        if (!v.has(e3.proxyId)) return e3;
        let n2 = { ...e3, proxyMode: `inherit` };
        return delete n2.proxyId, delete n2.proxyPinned, n2;
      }),
      sites: n.map((e3) => {
        if (!e3.proxyId) return e3;
        let t2 = l2.get(e3.proxyId);
        return t2 ? { ...e3, proxyId: t2 } : v.has(e3.proxyId) ? { ...e3, proxyId: void 0 } : e3;
      }),
      added: m.length,
      skipped: r.length - m.length - a.length,
      upgraded: a.length,
      removed: v.size,
      keptInUse: y,
      changed: m.length > 0 || a.length > 0 || u.size > 0 || v.size > 0
    };
  }
  function vo(e2, t) {
    if (e2 && !t.has(e2)) throw Error(`只能绑定有真实 HTTP/SOCKS 出口的代理；仅名称条目不能分配`);
  }
  function Xo(e2) {
    let t = bgProxiesState.Yo.then(e2, e2);
    return bgProxiesState.Yo = t.then(
      () => void 0,
      () => void 0
    ), t;
  }
  function Zo(e2, t) {
    if (!e2) return t == null;
    let n = _e(e2);
    return t != null && t.host === n.host && t.port === n.port;
  }
  function Qo(e2, t) {
    if (!e2)
      return t == null ? null : `这个账号按配置应该直连，但浏览器此刻仍被 ${t.host}:${t.port} 这条代理接管（通常是另一个签到任务或学习会话还没结束）；已放弃开始，避免在别人的出口上演示或签到`;
    let n = _e(e2), r = `${n.host}:${n.port}`;
    return t == null ? `账号配置的代理 ${r} 没有生效（浏览器此刻未走本扩展代理）；已放弃开始，避免直连泄露` : t.host === n.host && t.port === n.port ? null : `浏览器此刻走的是 ${t.host}:${t.port}，不是这个账号配置的 ${r}；已放弃在错误的出口上开始，避免学习与回放走的不是同一条线路`;
  }
  function ls(e2) {
    if (typeof e2 != `string` && typeof e2 != `number`) return null;
    let t = String(e2).trim();
    if (!t) return null;
    /^\d+$/.test(t) && (t = `127.0.0.1:${t}`), /^[a-z][a-z\d+.-]*:\/\//i.test(t) || (t = `http://${t}`);
    try {
      let e3 = new URL(t);
      if (!bgProxiesState.as.has(e3.protocol) || !e3.hostname || e3.username || e3.password) return null;
      let n = e3.hostname.toLowerCase().replace(/^\[|\]$/g, ``);
      return n !== `localhost` && n !== `127.0.0.1` && n !== `::1` ? null : e3.origin;
    } catch {
      return null;
    }
  }
  function us(e2) {
    if (typeof e2 != `string`) return {};
    let t = e2.trim();
    return !t || /[\r\n]/.test(t) ? {} : { Authorization: `Bearer ${t}` };
  }
  function ds(e2) {
    if (!ps(e2) || !ps(e2.proxies)) return [];
    let t = [], n = /* @__PURE__ */ new Set();
    for (let [r, i] of Object.entries(e2.proxies)) {
      if (!ps(i)) continue;
      let e3 = fs(i.type), a = typeof i.name == `string` && i.name.trim() ? i.name.trim() : r.trim();
      if (!a || n.has(a)) continue;
      let o = Array.isArray(i.all) || bgProxiesState.ss.has(e3), s = bgProxiesState.os.has(e3) || !e3 && bgProxiesState.cs.has(a.toUpperCase());
      o || s || (n.add(a), t.push(a));
    }
    return t;
  }
  function fs(e2) {
    return typeof e2 == `string` ? e2.trim().toLowerCase().replace(/[\s_-]+/g, ``) : ``;
  }
  function ps(e2) {
    return !!e2 && typeof e2 == `object` && !Array.isArray(e2);
  }
  function hs(e2) {
    if (!e2 || typeof e2 != `object` || Array.isArray(e2)) return false;
    let t = e2.version;
    return typeof t == `string` && t.trim().length > 0 && t.length <= 128;
  }
  async function gs(e2, { fetcher: t = fetch, timeoutMs: n = 800 } = {}) {
    let r = e2 ? ls(e2.address) : null;
    if (e2 && !r) throw Error(`Clash controller 地址无效：只允许本机 HTTP(S) 地址`);
    let i = [
      .../* @__PURE__ */ new Set([
        ...r ? [r] : [],
        ...bgProxiesState.ms.map((e3) => `http://127.0.0.1:${e3}`),
        ...bgProxiesState.ms.map((e3) => `http://[::1]:${e3}`)
      ])
    ], a = async (i2) => {
      let a2 = new AbortController(), o2 = setTimeout(() => a2.abort(), n);
      try {
        let n2 = await t(`${i2}/version`, {
          signal: a2.signal,
          cache: `no-store`,
          credentials: `omit`,
          redirect: `error`,
          headers: i2 === r ? us(e2?.secret) : {}
        });
        if (n2.status === 401 || n2.status === 403)
          return { status: `found`, address: i2, needsSecret: true, verified: false };
        if (!n2.ok) return null;
        let o3 = await n2.text();
        return o3.length > 4096 || !hs(JSON.parse(o3)) ? null : { status: `found`, address: i2, needsSecret: false, verified: true };
      } catch {
        return null;
      } finally {
        clearTimeout(o2);
      }
    };
    if (r) {
      let e3 = await a(r);
      if (e3) return e3;
    }
    let o = await Promise.all(i.filter((e3) => e3 !== r).map(a));
    return o.find((e3) => e3?.verified) ?? o.find((e3) => e3?.needsSecret) ?? {
      status: `not-found`,
      message: `未连接到本机 HTTP 控制接口，这不代表 Clash Verge / mihomo 未启动。Clash Verge 可能只启用了 Windows 命名管道；如需同步节点，请在 Clash Verge 设置中启用外部控制器（HTTP），例如 127.0.0.1:9097，再填写地址和密钥。仅使用当前代理出口无需控制接口，可检测本机代理端口（Verge 默认 7897）。`
    };
  }
  async function km(e2) {
    return await bgPlatformState.n.set(bgProxiesState.Dm, { kind: e2, at: Date.now() }), async () => {
      (await bgPlatformState.n.get(bgProxiesState.Dm, null))?.kind === e2 && await bgPlatformState.n.remove(bgProxiesState.Dm).catch(() => {
      });
    };
  }
  async function Am() {
    let e2 = await bgPlatformState.n.get(bgProxiesState.Dm, null);
    return !e2 || typeof e2.kind != `string` || typeof e2.at != `number` || Date.now() - e2.at > bgProxiesState.Om ? null : e2.kind === `scan` ? `scan` : e2.kind === `test` ? `test` : null;
  }
  async function jm(e2) {
    if (await bgCheckinState.Z.busy())
      return e2 === `scan` ? `签到队列正在使用网络配置，请完成后再扫描` : e2 === `queue` ? `签到队列正在使用网络配置` : `签到队列正在使用网络配置，请完成后再测试代理`;
    let { active: t } = bgLearningState.Of(Object.entries(await chrome.storage.session.get(null)));
    if (t.length > 0)
      return e2 === `scan` ? `有账号正在学习流程，学习会话占用着网络配置；请先结束学习再扫描` : e2 === `queue` ? `有账号正在学习流程，请先结束学习再开始签到（两者不能同时使用代理）` : `有账号正在学习流程，学习会话占用着网络配置；请先结束学习再测试代理`;
    let n = await Am();
    if (n) {
      let t2 = n === `scan` ? `本机端口扫描` : `代理测活`;
      return e2 === `queue` ? `${t2}正在使用网络配置，请完成后再开始签到` : `${t2}正在使用网络配置，请完成后再试`;
    }
    return null;
  }
  async function Mm(e2) {
    let { active: t, expired: n } = bgLearningState.Of(
      Object.entries(await chrome.storage.session.get(null))
    );
    for (let e3 of n) await bgCheckinState.Em(e3);
    return t.find((t2) => !e2 || t2.accountId === e2) ?? null;
  }
  async function oh(e2, t, n, r = false, i) {
    let a = e2.trim();
    if (!he(a)) return { ok: false, error: `只支持扫描本机地址（127.0.0.1 / localhost）` };
    let o = [...new Set(t)].filter((e3) => Number.isInteger(e3) && e3 > 0 && e3 <= 65535);
    if (!o.length) return { ok: false, error: `没有要扫描的端口` };
    if (o.length > bgProxiesState.rh)
      return { ok: false, error: `一次最多扫 ${bgProxiesState.rh} 个端口，请缩小范围` };
    let s = await sh(o, i);
    return bgPlatformState.X(async () => {
      let e3 = await jm(`scan`);
      if (e3) return { ok: false, error: e3 };
      let t2 = await km(`scan`);
      try {
        let e4 = [];
        for (let t4 of o.sort((e5, t5) => e5 - t5)) {
          let i3 = await je(
            { id: `scan:${t4}`, name: `${a}:${t4}`, scheme: n, host: a, port: t4 },
            void 0,
            r,
            r ? 12e3 : bgProxiesState.ih
          );
          e4.push({
            port: t4,
            ok: i3.ok,
            ms: i3.ms,
            message: i3.message,
            ...s.namesByPort.get(t4) ? { name: s.namesByPort.get(t4) } : {},
            ...i3.ip ? { ip: i3.ip } : {},
            ...i3.country ? { country: i3.country } : {}
          });
        }
        let t3 = e4.filter((e5) => e5.ok).length, i2 = e4.filter((e5) => e5.name).length;
        return {
          ok: true,
          feature: {
            portScan: {
              entries: e4,
              live: t3,
              exitChecked: r,
              ...r ? { distinctExits: new Set(e4.filter((e5) => e5.ip).map((e5) => e5.ip)).size } : {},
              ...i2 ? { named: i2 } : {},
              ...s.controllerPort ? { controllerPort: s.controllerPort } : {},
              ...s.controllerOrigin ? { controllerOrigin: s.controllerOrigin } : {},
              ...s.status ? { listenerStatus: s.status } : {}
            }
          }
        };
      } finally {
        await t2();
      }
    });
  }
  async function sh(e2, t) {
    let n = new Set(e2), r = t ? ls(t.address) : null;
    if (t && !r) return { namesByPort: /* @__PURE__ */ new Map(), status: `invalid` };
    let i = r ? [r] : bgProxiesState.ms.map((e3) => `http://127.0.0.1:${e3}`), a = await Promise.all(
      i.map(async (e3) => {
        let r2 = new AbortController(), i2 = setTimeout(() => r2.abort(), bgProxiesState.ah);
        try {
          let i3 = await fetch(`${e3}/listeners`, {
            signal: r2.signal,
            cache: `no-store`,
            redirect: `error`,
            credentials: `omit`,
            headers: us(t?.secret)
          }), a2 = lh(e3);
          if (i3.status === 401 || i3.status === 403)
            return {
              namesByPort: /* @__PURE__ */ new Map(),
              controllerPort: a2,
              controllerOrigin: e3,
              status: `unauthorized`
            };
          if (i3.status === 404)
            return {
              namesByPort: /* @__PURE__ */ new Map(),
              controllerPort: a2,
              controllerOrigin: e3,
              status: `unsupported`
            };
          if (!i3.ok)
            return {
              namesByPort: /* @__PURE__ */ new Map(),
              controllerPort: a2,
              controllerOrigin: e3,
              status: `unavailable`
            };
          let o = cn(await i3.json(), n);
          return {
            namesByPort: o,
            controllerPort: a2,
            controllerOrigin: e3,
            status: o.size ? `mapped` : `empty`
          };
        } catch {
          return { namesByPort: /* @__PURE__ */ new Map(), controllerOrigin: e3, status: `unavailable` };
        } finally {
          clearTimeout(i2);
        }
      })
    );
    return a.find((e3) => e3.status === `mapped`) ?? a.find((e3) => e3.status !== `unavailable`) ?? { namesByPort: /* @__PURE__ */ new Map(), status: `unavailable` };
  }
  async function ch(e2) {
    let t = ls(e2.address);
    if (!t)
      return { ok: false, error: `Clash controller 地址无效，请填写端口、主机:端口或 http(s) 地址` };
    let n = new AbortController(), r = setTimeout(() => n.abort(), bgProxiesState.ah * 2);
    try {
      let r2 = await fetch(`${t}/proxies`, {
        signal: n.signal,
        cache: `no-store`,
        redirect: `error`,
        credentials: `omit`,
        headers: us(e2.secret)
      });
      return r2.status === 401 || r2.status === 403 ? { ok: false, error: `Clash controller 认证失败，请检查密钥` } : r2.status === 404 ? { ok: false, error: `当前 Clash/Mihomo controller 不提供 /proxies 接口` } : r2.ok ? { ok: true, feature: { clashController: { origin: t, names: ds(await r2.json()) } } } : { ok: false, error: `Clash controller 返回 HTTP ${r2.status}` };
    } catch (e3) {
      return {
        ok: false,
        error: (e3 instanceof Error ? e3.message : String(e3)).toLowerCase().includes(`abort`) ? `连接 Clash controller 超时` : `无法连接 Clash controller，请检查地址、external-controller 和防火墙`
      };
    } finally {
      clearTimeout(r);
    }
  }
  function lh(e2) {
    try {
      let t = new URL(e2), n = t.port ? Number(t.port) : t.protocol === `https:` ? 443 : 80;
      return Number.isInteger(n) ? n : void 0;
    } catch {
      return;
    }
  }
  async function uh(e2) {
    try {
      return { ok: true, feature: { clashControllerDetect: await gs(e2) } };
    } catch (e3) {
      return { ok: false, error: e3 instanceof Error ? e3.message : `检测 HTTP 控制接口失败` };
    }
  }
  function dh() {
    let e2 = mn;
    return typeof e2 == `function` ? e2 : void 0;
  }
  async function fh(e2) {
    let t = ls(e2.address);
    if (!t)
      return { ok: false, error: `Clash controller 地址无效，请填写端口、主机:端口或 http(s) 地址` };
    let n = dh();
    if (!n)
      return {
        ok: false,
        error: `BLOCKER: parseClashListenerExits 尚未导出（lib/clash/clash-listeners），无法解析内核本地出口`
      };
    let r = new AbortController(), i = setTimeout(() => r.abort(), bgProxiesState.ah * 2);
    try {
      let i2 = await fetch(`${t}/listeners`, {
        signal: r.signal,
        cache: `no-store`,
        redirect: `error`,
        credentials: `omit`,
        headers: us(e2.secret)
      });
      return i2.status === 401 || i2.status === 403 ? { ok: false, error: `内核控制器认证失败，请检查密钥` } : i2.status === 404 ? { ok: false, error: `当前内核不提供 /listeners 接口` } : i2.ok ? { ok: true, feature: { clashListenerExits: { origin: t, exits: n(await i2.json()) } } } : { ok: false, error: `内核控制器返回 HTTP ${i2.status}` };
    } catch (e3) {
      return {
        ok: false,
        error: (e3 instanceof Error ? e3.message : String(e3)).toLowerCase().includes(`abort`) ? `连接内核控制器超时` : `无法连接内核控制器，请检查地址、external-controller 和防火墙`
      };
    } finally {
      clearTimeout(i);
    }
  }
  async function hh(e2) {
    let t;
    try {
      t = new URL(e2.trim());
    } catch {
      return { ok: false, error: `订阅地址格式不对，请填完整的 http(s) 链接` };
    }
    if (t.protocol !== `http:` && t.protocol !== `https:`)
      return { ok: false, error: `只支持 http/https 的订阅地址` };
    if (bgAccountsState.Rt(t.hostname)) return { ok: false, error: `订阅地址指向本机或内网，已拒绝` };
    let n = new AbortController(), r = setTimeout(() => n.abort(), bgProxiesState.mh);
    try {
      let e3 = await fetch(t.href, { signal: n.signal, cache: `no-store` });
      if (!e3.ok) return { ok: false, error: `订阅返回 ${e3.status}` };
      let r2 = await e3.text(), i = new TextEncoder().encode(r2).length;
      return i > bgProxiesState.ph ? { ok: false, error: `订阅内容过大（超过 2MB），请确认地址是否正确` } : r2.trim() ? { ok: true, feature: { subscription: { text: r2, bytes: i } } } : { ok: false, error: `订阅内容为空` };
    } catch (e3) {
      let t2 = e3 instanceof Error ? e3.message : String(e3);
      return { ok: false, error: t2.includes(`abort`) ? `拉取订阅超时（15 秒）` : `拉取失败: ${t2}` };
    } finally {
      clearTimeout(r);
    }
  }
  async function gh() {
    let e2 = await bgPlatformState.t.get(bgPlatformState.r.subscriptionSource, null), n = e2 && typeof e2.url == `string` ? Un(e2.url) : null;
    if (!n) return { ok: false, error: `还没有保存订阅地址:先在导入页粘一次订阅并生成配置` };
    let i = await hh(n);
    if (!i.ok)
      return await bgPlatformState.t.set(bgPlatformState.r.subscriptionSource, {
        ...e2,
        lastError: i.error
      }), { ok: false, error: i.error };
    let a = i.feature?.subscription?.text ?? ``, o = await qn();
    if (!o.length) return { ok: false, error: `还没有端口映射:先在导入页生成一次 listeners 配置` };
    let s = Kn(a, o);
    await Jn(s.entries), s.poolEntries.length && await bgProxiesState.store.addProxies(
      s.poolEntries.map((e3) => ({ ...e3, sourceLabel: `Clash Verge` }))
    );
    let c = Date.now();
    return await bgPlatformState.t.set(bgPlatformState.r.subscriptionSource, {
      ...e2,
      lastCheckedAt: c,
      lastError: void 0
    }), {
      ok: true,
      feature: {
        listenerDrift: {
          ok: true,
          added: s.poolEntries.length,
          removed: s.removedNames.length,
          total: s.entries.length,
          checkedAt: c,
          needsResync: s.addedEntries.length > 0
        }
      }
    };
  }
  async function _h() {
    let e2 = await bgPlatformState.t.get(bgPlatformState.r.subscriptionSource, null);
    e2 && e2.autoSync === true && typeof e2.url == `string` && await gh();
  }
  async function vh(e2, n) {
    let i = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find((t) => t.id === e2);
    if (!i) return { ok: false, error: `账号不存在` };
    let a = await bgPlatformState.t.get(bgPlatformState.r.sites, []), o = bgSitesState.Y(i.siteId, a);
    if (!o) return { ok: false, error: `站点配置不存在` };
    let s = n ?? await bgCheckinState.Eh(o);
    if (s == null) return { ok: false, error: `没找到该站点的标签页；请先在浏览器里打开并登录该站点` };
    let c = await chrome.scripting.executeScript({
      target: { tabId: s },
      world: `ISOLATED`,
      func: yh,
      args: [[...bgAccountsState.Ui], o.adapter?.siteType ?? ``]
    }).catch((e3) => e3 instanceof Error ? e3.message : String(e3));
    if (typeof c == `string`) return { ok: false, error: `无法读取该标签页：${c}` };
    let l2 = c[0]?.result;
    if (!l2) return { ok: false, error: `这个页面上没找到登录凭据；请确认已经登录，然后刷新页面重试` };
    let u = {
      ...l2.accessToken ? { accessToken: l2.accessToken } : {},
      ...l2.refreshToken ? { refreshToken: l2.refreshToken } : {},
      ...l2.tokenExpiresAt ? { tokenExpiresAt: l2.tokenExpiresAt } : {},
      capturedAt: Date.now(),
      ...l2.siteType ? { siteType: l2.siteType } : {}
    };
    return await bgAccountsState.store.saveAccountSession(e2, u), bgPlatformState.$(), { ok: true, feature: { captured: { session: u, identity: l2.identity, evidence: l2.evidence } } };
  }
  function yh(e2, t) {
    let n = (e3) => {
      if (typeof e3 == `string` && e3.trim()) return e3.trim();
      if (typeof e3 == `number` && Number.isFinite(e3)) return String(e3);
    }, r = (e3) => {
      let t2 = localStorage.getItem(e3);
      if (!t2) return null;
      try {
        let e4 = JSON.parse(t2);
        return e4 && typeof e4 == `object` && !Array.isArray(e4) ? e4 : null;
      } catch {
        return null;
      }
    }, i = [...e2.filter((e3) => e3.siteType === t), ...e2.filter((e3) => e3.siteType !== t)];
    for (let e3 of i) {
      let t2;
      if (e3.tokenKey) t2 = localStorage.getItem(e3.tokenKey)?.trim() || void 0;
      else if (e3.nestedToken) {
        let i3 = r(e3.nestedToken.key);
        for (let t3 of e3.nestedToken.path) i3 = i3 && typeof i3 == `object` ? i3[t3] : void 0;
        t2 = n(i3);
      }
      let i2 = e3.userKey ? r(e3.userKey) : null, a = { userId: n(i2?.id), username: n(i2?.username), email: n(i2?.email) };
      if (!(t2 || !e3.tokenKey && !e3.nestedToken && a.userId)) continue;
      let o = e3.expiresKey ? localStorage.getItem(e3.expiresKey) : null, s = o ? Number.parseInt(o, 10) : NaN;
      return {
        identity: a,
        accessToken: t2,
        refreshToken: e3.refreshKey && localStorage.getItem(e3.refreshKey)?.trim() || void 0,
        tokenExpiresAt: Number.isFinite(s) ? s : void 0,
        siteType: e3.siteType,
        evidence: e3.evidence
      };
    }
    return null;
  }
  async function bh(e2) {
    return bgPlatformState.X(async () => {
      let n = await jm(`test`);
      if (n) return { ok: false, error: n };
      let [i, a] = await Promise.all([
        bgPlatformState.t.get(bgPlatformState.r.accounts, []),
        bgPlatformState.t.get(bgPlatformState.r.sites, [])
      ]), o = 0, s = 0;
      for (let t of e2) {
        let e3 = i.find((e4) => e4.id === t);
        if (!e3) {
          s += 1;
          continue;
        }
        let n2 = bgSitesState.Y(e3.siteId, a);
        n2 ? await xh(e3, n2) === `refreshed` ? o += 1 : s += 1 : (await bgRecordsState.store.saveBalanceError(t, `站点配置不存在`), s += 1);
      }
      return bgPlatformState.$(), { ok: true, feature: { refreshed: o, failed: s } };
    });
  }
  async function xh(e2, t) {
    if (!bgCheckinState.M(t))
      return await bgRecordsState.store.saveBalanceError(e2.id, `站点地址无效，无法读取余额`), `failed`;
    let n = await bgCheckinState.Eh(t, { preferCheckinPage: true });
    if (n != null) {
      let r2 = await bgCheckinState.Oh(e2, t);
      if (r2.ok && Zo(r2.proxy, await we())) return Ch(e2, t, n);
    }
    let r = await bgCheckinState.Oh(e2, t);
    if (!r.ok) return await bgRecordsState.store.saveBalanceError(e2.id, r.error), `failed`;
    let i = await chrome.tabs.create({ url: `about:blank`, active: false }).catch(() => null);
    if (!i || i.id == null)
      return await bgRecordsState.store.saveBalanceError(e2.id, `无法创建标签页`), `failed`;
    let a = i.id;
    try {
      if (r.proxy && !await bgProxiesState.W.acquire(a, r.proxy))
        return await bgRecordsState.store.saveBalanceError(e2.id, `代理正被其他任务占用，请稍后再刷新`), `failed`;
      if (!r.proxy) {
        let t2 = Qo(void 0, await we());
        if (t2) return await bgRecordsState.store.saveBalanceError(e2.id, t2), `failed`;
      }
      return Zo(r.proxy, await we()) ? (await chrome.tabs.update(a, { url: bgCheckinState.wh(t) }), await Sh(a), await Ch(e2, t, a)) : (await bgRecordsState.store.saveBalanceError(
        e2.id,
        `代理未能按账号配置生效，已放弃本次余额刷新（出口不一致时读到的余额不可信）`
      ), `failed`);
    } finally {
      r.proxy && await bgProxiesState.W.release(a).catch(() => {
      }), await bgCheckinState.Pp(a).catch(() => {
      });
    }
  }
  async function Sh(e2, t = 15e3) {
    let n = Date.now() + t;
    for (; ; ) {
      let t2 = await chrome.tabs.get(e2).catch(() => null);
      if (!t2 || t2.status === `complete` || Date.now() >= n) return;
      await new Promise((e3) => setTimeout(e3, 300));
    }
  }
  async function Ch(e2, n, i) {
    let a = (() => {
      try {
        return new URL(n.loginUrl).hostname.toLowerCase() === `www.hvoy.ai`;
      } catch {
        return false;
      }
    })(), o = (a ? [] : bgRecordsState.vi(n)).filter((e3) => bgCheckinState.N(n, e3)), s = bgRecordsState._i(n), c = await chrome.scripting.executeScript({
      target: { tabId: i },
      world: `ISOLATED`,
      func: bgRecordsState.Si,
      args: [o, [...bgSitesState.ar], a, s, bgSitesState.mr(n)]
    }).catch((e3) => e3 instanceof Error ? e3.message : String(e3));
    if (typeof c == `string`)
      return await bgRecordsState.store.saveBalanceError(e2.id, `无法读取该站点页面：${c}`), `failed`;
    let l2 = c[0]?.result;
    if (!l2)
      return await bgRecordsState.store.saveBalanceError(e2.id, `页面没有返回余额数据`), `failed`;
    let u = l2.payloads.flatMap((e3) => {
      if (!e3.json) return [];
      try {
        return [{ path: e3.path, value: JSON.parse(e3.text) }];
      } catch {
        return [];
      }
    }), d = l2.crossOrigin ? bgRecordsState.gi(l2.crossOrigin.contentType, l2.crossOrigin.base64) : null, f = u.filter((e3) => /\/(?:auth\/me|user\/(?:self|info))(?:\/|\?|#|$)/i.test(e3.path)).map((e3) => bgAccountsState.xr(e3.value)).find((e3) => !!e3) ?? (d == null ? void 0 : bgAccountsState.xr(d) ?? void 0), p = f ? { ...f, source: `api` } : bgAccountsState.Sr(l2.bodyText), [m, h] = await Promise.all([
      bgPlatformState.t.get(bgPlatformState.r.accounts, []),
      bgPlatformState.t.get(bgPlatformState.r.sites, [])
    ]), g = bgLearningState.Kp(m, h, n), _ = Object.fromEntries(
      g.filter((t) => t.id !== e2.id && t.identity?.userId).map((e3) => [e3.identity.userId, e3.label || e3.username])
    ), v = e2.identity?.userId ? _[e2.identity.userId] : void 0, y = bgAccountsState.Rr(e2.username, l2.bodyText)?.matched, b = bgAccountsState.jt(e2, n).loginMethod === `github` ? e2.githubUsername?.trim() : void 0, x = e2.identity?.source === `api` ? e2.identity : void 0, S = bgAccountsState.Ur(p, e2.username, v ? void 0 : e2.identity?.userId, {
      knownUsers: _,
      ...y ? { pageAccountMatch: y } : {},
      ...b ? { expectedAliases: [b] } : {},
      ...x?.username || x?.email ? {
        expectedIdentity: {
          ...x.username ? { username: x.username } : {},
          ...x.email ? { email: x.email } : {}
        }
      } : {}
    });
    if (S.match === `mismatch` || g.length > 1 && S.match !== `confirmed`)
      return await bgRecordsState.store.clearBalance(e2.id), await bgRecordsState.store.saveBalanceError(
        e2.id,
        `余额刷新已停止：当前页面身份未通过账号 ${e2.username} 的核对（${S.detail}）`
      ), `failed`;
    S.match === `confirmed` && p?.source === `api` && await bgAccountsState.store.saveAccountIdentity(e2.id, p, { preserveBinding: true });
    let C = Date.now(), w = bgRecordsState.ci(l2.bodyText, bgCheckinState.Th(n));
    w != null && await bgRecordsState.store.saveCheckinReward(
      e2.id,
      w.reward,
      bgPlatformState.Ci(),
      C,
      w.symbol
    );
    for (let t of u) {
      let r = t.value, i2 = bgRecordsState.li(r, bgCheckinState.Th(n)), a2 = bgRecordsState.ai(w, i2);
      a2 != null && (!w || a2.reward !== w.reward || a2.symbol !== w.symbol) && (w = a2, await bgRecordsState.store.saveCheckinReward(
        e2.id,
        a2.reward,
        bgPlatformState.Ci(),
        C,
        a2.symbol
      ));
      let o2 = bgRecordsState.mi(r);
      if (o2)
        return await bgRecordsState.store.saveBalance(e2.id, {
          quota: o2.quota,
          usedQuota: o2.usedQuota,
          ...o2.symbol ? { symbol: o2.symbol } : {},
          at: C,
          source: `api`
        }), `refreshed`;
    }
    let T = d == null ? null : bgRecordsState.hi(d);
    if (T)
      return await bgRecordsState.store.saveBalance(e2.id, {
        quota: T.quota,
        usedQuota: T.usedQuota,
        ...T.symbol ? { symbol: T.symbol } : {},
        at: C,
        source: `api`
      }), `refreshed`;
    let E = bgRecordsState.ui(l2.bodyText, n.adapter?.quotaPerUnit);
    return E ? (await bgRecordsState.store.saveBalance(e2.id, {
      quota: E.quota,
      usedQuota: E.usedQuota,
      ...E.symbol ? { symbol: E.symbol } : {},
      at: C,
      source: `visible`
    }), `refreshed`) : (await bgRecordsState.store.saveBalanceError(
      e2.id,
      l2.payloads.length ? `站点返回的数据里没有余额字段` : `读不到余额：可能登录态已失效，或该站点没有余额接口`
    ), `failed`);
  }
  Object.assign(bgProxiesState, {
    he,
    ge,
    _e,
    xe,
    Se,
    Ce,
    we,
    Te,
    Ee,
    De,
    ke,
    Ae,
    je,
    Me,
    Ne,
    Pe,
    en,
    tn,
    nn,
    rn,
    an,
    sn,
    cn,
    mn,
    hn,
    gn,
    _n,
    vn,
    yn,
    bn,
    Cn,
    En,
    Dn,
    On,
    kn,
    An,
    jn,
    Mn,
    Nn,
    Pn,
    Fn,
    In,
    Ln,
    Rn,
    zn,
    Bn,
    Vn,
    Hn,
    Un,
    Gn,
    Kn,
    qn,
    Jn,
    Yn,
    Xn,
    ua,
    da,
    fa,
    go,
    _o,
    vo,
    Xo,
    Zo,
    Qo,
    ls,
    us,
    ds,
    fs,
    ps,
    hs,
    gs,
    km,
    Am,
    jm,
    Mm,
    oh,
    sh,
    ch,
    lh,
    uh,
    dh,
    fh,
    hh,
    gh,
    _h,
    vh,
    yh,
    bh,
    xh,
    Sh,
    Ch
  });
  async function handleProxiesMessage(e2, i) {
    switch (e2.type) {
      case `TEST_PROXY`:
        return bgEntryState.Q(i) ? bgSitesState.me(e2.proxy) ? {
          ok: true,
          test: { ok: false, ms: 0, message: `这是订阅节点名称，没有可用的浏览器代理出口` }
        } : bgPlatformState.X(async () => {
          let t = await jm(`test`);
          if (t) return { ok: false, error: t };
          let n = await km(`test`);
          try {
            return { ok: true, test: await je(e2.proxy) };
          } finally {
            await n();
          }
        }) : { ok: false, error: `仅扩展管理页可以测试代理` };
      case `SCAN_LOCAL_PORTS`:
        return bgEntryState.Q(i) ? oh(e2.host, e2.ports, e2.scheme, e2.withExit === true, e2.controller) : { ok: false, error: `仅扩展管理页可以扫描本机端口` };
      case `READ_CLASH_PROXIES`:
        return bgEntryState.Q(i) ? ch(e2.controller) : { ok: false, error: `仅扩展管理页可以读取 Clash 节点` };
      case `DETECT_CLASH_CONTROLLER`:
        return bgEntryState.Q(i) ? uh(e2.controller) : { ok: false, error: `仅扩展管理页可以读取内核信息` };
      case `READ_CLASH_LISTENER_EXITS`:
        return bgEntryState.Q(i) ? fh(e2.controller) : { ok: false, error: `仅扩展管理页可以读取内核信息` };
      case `SYNC_CLASH_PROXIES`:
        return bgEntryState.Q(i) ? {
          ok: true,
          feature: { clashConfigSync: await bgProxiesState.store.syncClashProxies(e2.inputs) }
        } : { ok: false, error: `仅扩展管理页可以同步 Clash 配置` };
      case `FETCH_SUBSCRIPTION`:
        return bgEntryState.Q(i) ? hh(e2.url) : { ok: false, error: `仅扩展管理页可以拉取订阅` };
      case `CHECK_LISTENER_DRIFT`:
        return bgEntryState.Q(i) ? gh() : { ok: false, error: `仅扩展管理页可以检查订阅更新` };
    }
  }
  async function handleProxiesMutation(e2) {
    switch (e2.action) {
      case `add-proxy`:
        return await bgProxiesState.store.addProxy(e2.input), { ok: true };
      case `add-proxies`:
        return { ok: true, ...await bgProxiesState.store.addProxies(e2.inputs) };
      case `update-proxy`:
        return await bgProxiesState.store.updateProxy(e2.proxyId, e2.patch), { ok: true };
      case `remove-proxy`:
        return await bgProxiesState.store.removeProxy(e2.proxyId), { ok: true };
      case `assign-account-proxies`:
        return { ok: true, ...await bgProxiesState.store.assignAccountProxies(e2.assignments) };
    }
  }
  function initializeBackgroundProxies(step) {
    switch (step) {
      case 37: {
        bgProxiesState.ve = null;
        break;
      }
      case 38: {
        bgProxiesState.ye = false;
        break;
      }
      case 39: {
        bgProxiesState.be = `这是订阅节点名称，没有可用的浏览器代理出口`;
        break;
      }
      case 40: {
        bgProxiesState.Oe = [
          { url: `https://ipapi.co/json/`, ip: `ip`, country: `country_name` },
          { url: `https://ipwho.is/`, ip: `ip`, country: `country` }
        ];
        break;
      }
      case 58: {
        bgProxiesState.Yt = 7901;
        break;
      }
      case 59: {
        bgProxiesState.Xt = [
          1053,
          7890,
          7891,
          7897,
          7898,
          7899,
          ...Array.from({ length: 10 }, (e2, t) => 9090 + t)
        ];
        break;
      }
      case 60: {
        bgProxiesState.Zt = bgProxiesState.Yt;
        break;
      }
      case 61: {
        bgProxiesState.Qt = `127.0.0.1`;
        break;
      }
      case 62: {
        bgProxiesState.$t = 65535;
        break;
      }
      case 63: {
        bgProxiesState.on = RegExp(`[\\u0000-\\u001f\\u007f\\u0085\u2028\u2029]`, `g`);
        break;
      }
      case 64: {
        bgProxiesState.ln = 1;
        break;
      }
      case 65: {
        bgProxiesState.un = 65535;
        break;
      }
      case 66: {
        bgProxiesState.dn = 200;
        break;
      }
      case 67: {
        bgProxiesState.fn = /* @__PURE__ */ new Set([
          `COMPATIBLE`,
          `DIRECT`,
          `GLOBAL`,
          `PASS`,
          `REJECT`,
          `REJECT-DROP`
        ]);
        break;
      }
      case 68: {
        bgProxiesState.pn = /* @__PURE__ */ new Set([`compatible`, `direct`, `pass`, `reject`, `rejectdrop`]);
        break;
      }
      case 69: {
        bgProxiesState.xn = /* @__PURE__ */ new Set([`http`, `https`, `socks4`, `socks5`]);
        break;
      }
      case 70: {
        bgProxiesState.Sn = [
          `剩余流量`,
          `套餐到期`,
          `过滤掉`,
          `距离下次`,
          `重置`,
          `官网`,
          `订阅`,
          `有效期`,
          `到期时间`,
          `剩余时间`,
          `流量重置`,
          `请勿`,
          `群组`,
          `客服`,
          `telegram`,
          `教程`,
          `电报群`,
          `防失联`,
          `t.me`,
          `github.com`,
          `客户端`,
          `官网使用文档`,
          `发布页`,
          `频道`
        ];
        break;
      }
      case 71: {
        bgProxiesState.wn = {
          http: `http`,
          https: `https`,
          socks: `socks5`,
          socks4: `socks4`,
          socks5: `socks5`,
          socks5h: `socks5`
        };
        break;
      }
      case 72: {
        bgProxiesState.Tn = { http: 80, https: 443, socks4: 1080, socks5: 1080 };
        break;
      }
      case 73: {
        bgProxiesState.Wn = [
          `剩余流量`,
          `套餐到期`,
          `过滤掉`,
          `距离下次`,
          `重置`,
          `官网`,
          `订阅`,
          `有效期`,
          `到期时间`,
          `剩余时间`,
          `流量重置`,
          `请勿`,
          `群组`,
          `客服`,
          `telegram`,
          `教程`,
          `电报群`,
          `防失联`,
          `t.me`,
          `github.com`,
          `客户端`,
          `发布页`,
          `频道`
        ];
        break;
      }
      case 140: {
        Object.assign(bgProxiesState.store, {
          addProxy(e2) {
            return bgPlatformState.R(async () => {
              let n = await bgPlatformState.t.get(bgPlatformState.r.proxies, []);
              await bgPlatformState.t.set(
                bgPlatformState.r.proxies,
                n.concat({ ...e2, id: bgPlatformState.Ti(`px`) })
              );
            });
          }
        });
        break;
      }
      case 141: {
        Object.assign(bgProxiesState.store, {
          addProxies(e2) {
            return bgPlatformState.R(async () => {
              let [n, i, a] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.proxies, []),
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.sites, [])
              ]), o = _o(n, i, a, e2);
              if (o.changed) {
                let e3 = { [bgPlatformState.r.proxies]: o.proxies };
                o.accounts.some((e4, t) => e4 !== i[t]) && (e3[bgPlatformState.r.accounts] = o.accounts), o.sites.some((e4, t) => e4 !== a[t]) && (e3[bgPlatformState.r.sites] = o.sites), await bgPlatformState.t.setMany(e3);
              }
              return { added: o.added, skipped: o.skipped, upgraded: o.upgraded };
            });
          }
        });
        break;
      }
      case 142: {
        Object.assign(bgProxiesState.store, {
          syncClashProxies(e2) {
            return bgPlatformState.R(async () => {
              let [n, i, a] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.proxies, []),
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.sites, [])
              ]), o = _o(n, i, a, e2, `Clash Verge`);
              return o.changed && await bgPlatformState.t.setMany({
                [bgPlatformState.r.proxies]: o.proxies,
                [bgPlatformState.r.accounts]: o.accounts,
                [bgPlatformState.r.sites]: o.sites
              }), {
                added: o.added,
                skipped: o.skipped,
                upgraded: o.upgraded,
                removed: o.removed,
                keptInUse: o.keptInUse
              };
            });
          }
        });
        break;
      }
      case 143: {
        Object.assign(bgProxiesState.store, {
          updateProxy(e2, n) {
            return bgPlatformState.R(async () => {
              let i = await bgPlatformState.t.get(bgPlatformState.r.proxies, []);
              await bgPlatformState.t.set(
                bgPlatformState.r.proxies,
                i.map((t) => t.id === e2 ? { ...t, ...n } : t)
              );
            });
          }
        });
        break;
      }
      case 144: {
        Object.assign(bgProxiesState.store, {
          removeProxy(e2) {
            return bgPlatformState.R(async () => {
              let [n, i, a] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.proxies, []),
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
                bgPlatformState.t.get(bgPlatformState.r.accounts, [])
              ]);
              await bgPlatformState.t.setMany({
                [bgPlatformState.r.proxies]: n.filter((t) => t.id !== e2),
                [bgPlatformState.r.sites]: i.map(
                  (t) => t.proxyId === e2 ? { ...t, proxyId: void 0 } : t
                ),
                [bgPlatformState.r.accounts]: a.map((t) => {
                  if (t.proxyId !== e2) return t;
                  let n2 = { ...t, proxyMode: `inherit` };
                  return delete n2.proxyId, n2;
                })
              });
            });
          }
        });
        break;
      }
      case 145: {
        Object.assign(bgProxiesState.store, {
          assignAccountProxies(e2) {
            return bgPlatformState.R(async () => {
              let [n, i] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, [])
              ]), a = go(i), o = new Map(e2.filter((e3) => a.has(e3.proxyId)).map((e3) => [e3.accountId, e3]));
              if (!o.size) return { assigned: 0 };
              let s = 0, c = n.map((e3) => {
                let t = o.get(e3.id);
                if (!t) return e3;
                s += 1;
                let n2 = bgAccountsState.yo(e3, { proxyMode: `pool`, proxyId: t.proxyId });
                if (t.pinned) return { ...n2, proxyPinned: true };
                let { proxyPinned: r, ...i2 } = n2;
                return i2;
              });
              return s && await bgPlatformState.t.set(bgPlatformState.r.accounts, c), { assigned: s };
            });
          }
        });
        break;
      }
      case 169: {
        bgProxiesState.U = `proxyHolderTabId`;
        break;
      }
      case 170: {
        bgProxiesState.Yo = Promise.resolve();
        break;
      }
      case 171: {
        bgProxiesState.W = {
          holder() {
            return Xo(() => bgPlatformState.n.get(bgProxiesState.U, null));
          },
          acquire(e2, t) {
            return Xo(async () => {
              let r = await bgPlatformState.n.get(bgProxiesState.U, null);
              if (r != null && r !== e2) {
                if (await chrome.tabs.get(r).then(() => true).catch(() => false))
                  return false;
                await Ce(), await bgPlatformState.n.remove(bgProxiesState.U);
              }
              await bgPlatformState.n.set(bgProxiesState.U, e2);
              try {
                return await xe(t), true;
              } catch (t2) {
                throw await Ce().catch(() => {
                }), await bgPlatformState.n.get(bgProxiesState.U, null) === e2 && await bgPlatformState.n.remove(bgProxiesState.U), t2;
              }
            });
          },
          transfer(e2, t) {
            return Xo(async () => {
              if (e2 === t) return true;
              let r = await bgPlatformState.n.get(bgProxiesState.U, null);
              return r === t ? chrome.tabs.get(t).then(() => true).catch(() => false) : r !== e2 || !await chrome.tabs.get(t).then(() => true).catch(() => false) ? false : (await bgPlatformState.n.set(bgProxiesState.U, t), true);
            });
          },
          release(e2) {
            return Xo(async () => {
              let t = await bgPlatformState.n.get(bgProxiesState.U, null);
              if (t !== e2) {
                if (t == null || await chrome.tabs.get(t).then(() => true).catch(() => false))
                  return;
                await Ce(), await bgPlatformState.n.remove(bgProxiesState.U);
              } else await Ce(), await bgPlatformState.n.remove(bgProxiesState.U);
            });
          },
          recover(e2 = []) {
            return Xo(async () => {
              let t = await bgPlatformState.n.get(bgProxiesState.U, null);
              t != null && e2.includes(t) && await chrome.tabs.get(t).then(() => true).catch(() => false) || t != null && (await Ce(), await bgPlatformState.n.remove(bgProxiesState.U));
            });
          }
        };
        break;
      }
      case 172: {
        bgProxiesState.as = /* @__PURE__ */ new Set([`http:`, `https:`]);
        break;
      }
      case 173: {
        bgProxiesState.os = /* @__PURE__ */ new Set([`compatible`, `direct`, `pass`, `reject`, `rejectdrop`]);
        break;
      }
      case 174: {
        bgProxiesState.ss = /* @__PURE__ */ new Set([
          `fallback`,
          `loadbalance`,
          `relay`,
          `selector`,
          `smart`,
          `urltest`
        ]);
        break;
      }
      case 175: {
        bgProxiesState.cs = /* @__PURE__ */ new Set([
          `COMPATIBLE`,
          `DIRECT`,
          `GLOBAL`,
          `PASS`,
          `REJECT`,
          `REJECT-DROP`
        ]);
        break;
      }
      case 176: {
        bgProxiesState.ms = [9097, 9090, 9095, 9096, 9091, 9092, 9093, 9094, 9098, 9099];
        break;
      }
      case 300: {
        bgProxiesState.Bp = `listener-sync`;
        break;
      }
      case 314: {
        bgProxiesState.Dm = `networkToolLock`;
        break;
      }
      case 315: {
        bgProxiesState.Om = 3e5;
        break;
      }
      case 318: {
        bgProxiesState.rh = 64;
        break;
      }
      case 319: {
        bgProxiesState.ih = 8e3;
        break;
      }
      case 320: {
        bgProxiesState.ah = 1500;
        break;
      }
      case 321: {
        bgProxiesState.ph = 2097152;
        break;
      }
      case 322: {
        bgProxiesState.mh = 15e3;
        break;
      }
    }
  }
  var proxyService = Object.freeze({
    list: () => bgPlatformState.t.get(bgPlatformState.r.proxies, []),
    add: (...args) => bgProxiesState.store.addProxy(...args),
    importMany: (...args) => bgProxiesState.store.addProxies(...args),
    update: (...args) => bgProxiesState.store.updateProxy(...args),
    remove: (...args) => bgProxiesState.store.removeProxy(...args),
    assignAccounts: (...args) => bgProxiesState.store.assignAccountProxies(...args),
    acquire: (...args) => bgProxiesState.W.acquire(...args),
    transfer: (...args) => bgProxiesState.W.transfer(...args),
    release: (...args) => bgProxiesState.W.release(...args),
    recover: (...args) => bgProxiesState.W.recover(...args),
    handleMessage: handleProxiesMessage,
    handleMutation: handleProxiesMutation
  });

  // src/modules/learning/service.js
  var bgLearningState = { store: {} };
  function Qn(e2) {
    let t = e2.trim(), n = t.startsWith(`text=`) ? t.slice(5).trim() : t;
    return Array.from(n).slice(0, bgLearningState.Zn).join(``);
  }
  function $n(e2) {
    let t = e2;
    return !!t && t.type === `drag` && typeof t.selector == `string` && typeof t.toSelector == `string` && typeof t.path == `string` && typeof t.at == `number` && Number.isFinite(t.at);
  }
  function er(e2) {
    if (e2.dragToSelector) return `把「${Qn(e2.selector)}」拖到「${Qn(e2.dragToSelector)}」`;
    let t = e2.gesture === `double` ? `双击` : e2.gesture === `right` ? `右键` : e2.gesture === `long-press` ? `长按` : e2.key ? `按 ${e2.key} 键` : `点击`, n = e2.anchor ? `（落点 ${Math.round(e2.anchor.rx * 100)}%, ${Math.round(e2.anchor.ry * 100)}%）` : ``;
    return `${t}「${Qn(e2.selector)}」${n}`;
  }
  function tr(e2) {
    let t = e2, n = $n(t) ? t : void 0;
    if (n)
      return {
        kind: `drag`,
        text: `把「${Qn(n.selector)}」拖到「${Qn(n.toSelector)}」`,
        path: n.path,
        at: n.at
      };
    switch (e2.type) {
      case `navigation`:
        return { kind: `navigation`, text: `进入页面 ${e2.path}`, path: e2.path, at: e2.at };
      case `click`:
        return { kind: e2.dragToSelector ? `drag` : `click`, text: er(e2), path: e2.path, at: e2.at };
      case `fill`: {
        let t2 = Qn(e2.selector);
        return {
          kind: `fill`,
          text: e2.control === `select` ? `在「${t2}」选择第 ${(e2.choice ?? 0) + 1} 项` : e2.control === `checkbox` || e2.control === `radio` ? `${e2.checked ? `勾选` : `取消勾选`}「${t2}」` : `在「${t2}」填写内容`,
          path: e2.path,
          at: e2.at
        };
      }
      case `drag`:
        return {
          kind: `drag`,
          text: `把「${Qn(e2.selector)}」拖到「${Qn(e2.toSelector)}」`,
          path: e2.path,
          at: e2.at
        };
      case `scroll`: {
        let t2 = Math.round(e2.ratio * 100);
        return {
          kind: `scroll`,
          text: e2.container ? `滚动「${Qn(e2.container)}」到 ${t2}%` : `滚动页面到 ${t2}%`,
          path: e2.path,
          at: e2.at
        };
      }
      default:
        return null;
    }
  }
  function nr(e2) {
    return e2.map(tr).filter((e3) => e3 !== null).slice(-20);
  }
  function bu(e2, t) {
    let n = e2.domain.replace(/^\./, ``).toLowerCase();
    return t === n || t.endsWith(`.${n}`);
  }
  function xu(e2) {
    return [e2.storeId, e2.domain, e2.path, e2.name, JSON.stringify(e2.partitionKey ?? null)].join(`\0`);
  }
  function Su(e2, t) {
    return `${e2.secure ? `https:` : t.protocol}//${e2.domain.replace(/^\./, ``)}${(e2.path.startsWith(`/`) ? e2.path : `/${e2.path}`) || `/`}`;
  }
  async function Cu(e2, t) {
    let n = /* @__PURE__ */ new Map();
    for (let r of bgSliderState.yu(e2)) {
      let i = await chrome.cookies.getAll({ domain: r, ...t ? { storeId: t } : {} });
      for (let t2 of i) bu(t2, e2) && n.set(xu(t2), t2);
    }
    return n;
  }
  async function wu(e2, t) {
    let n = new URL(t), r = n.hostname.toLowerCase();
    if (n.protocol !== `https:` && n.protocol !== `http:`)
      throw Error(`站点地址不是 HTTP(S)，不能清理 Cookie`);
    let i = (await chrome.cookies.getAllCookieStores()).find((t2) => t2.tabIds.includes(e2))?.id, a = await Cu(r, i);
    for (let e3 of a.values())
      try {
        await chrome.cookies.remove({
          url: Su(e3, n),
          name: e3.name,
          storeId: e3.storeId,
          ...e3.partitionKey ? { partitionKey: e3.partitionKey } : {}
        });
      } catch {
      }
    let o = await Cu(r, i), s = [...a.keys()].filter((e3) => o.has(e3)).length;
    return { matched: a.size, removed: a.size - s, failed: o.size };
  }
  function Eu(e2) {
    return e2.replace(bgLearningState.Tu, ``) || `/`;
  }
  function Du(e2) {
    try {
      let t = new URL(e2, `https://learning.invalid`), n = t.hash.slice(1), r = Eu(n.startsWith(`/`) ? n : t.pathname);
      return !/(?:^|\/)(?:login|sign-?in|auth|oauth|register|password)(?:\/|$)/i.test(r) && /^\/(?:dashboard|console|profile|personal|account|user|me|check-?in|daily|rewards?|lottery|draw|prize)(?:\/|$)/i.test(
        r
      );
    } catch {
      return false;
    }
  }
  function Ou(e2) {
    try {
      let t = new URL(e2, `https://learning.invalid`), n = t.hash.slice(1), r = Eu(n.startsWith(`/`) ? n : t.pathname);
      return r === `/` || /^\/(?:home|index|main|app|apps|workspace|panel|overview|portal|hub|center|member|vip|admin)(?:\/|$)/i.test(
        r
      );
    } catch {
      return false;
    }
  }
  function ku(e2) {
    return e2 !== `login`;
  }
  function Au(e2) {
    let t = e2.indexOf(`#`);
    if (t < 0) return ``;
    let n = e2.slice(t + 1);
    return n.startsWith(`/`) ? n : ``;
  }
  function Iu(e2) {
    return bgLearningState.Fu.test(e2.split(/[?#]/)[0] ?? ``) || bgLearningState.Fu.test(Au(e2).split(`?`)[0] ?? ``);
  }
  function Hu(e2) {
    let t = e2.path;
    return typeof t == `string` && t.trim() ? t : void 0;
  }
  function Uu(e2) {
    let t = Au(e2);
    return bgLearningState.ju.test(e2) || !!t && bgLearningState.ju.test(t);
  }
  function Wu(e2) {
    let t = Au(e2);
    return bgLearningState.Mu.test(e2) || !!t && bgLearningState.Mu.test(t);
  }
  function Gu(e2) {
    let t = (e3) => bgLearningState.Nu.test(e3) || bgLearningState.Fu.test(e3) && !bgLearningState.Pu.test(e3), n = Au(e2);
    return t(e2) || !!n && t(n);
  }
  function Ku(e2) {
    if (Wu(Hu(e2) ?? ``)) return true;
    if (e2.type === `navigation` || e2.type !== `click` && e2.type !== `fill`) return false;
    if (bgLearningState.Lu.test((e2.label ?? ``).trim())) return true;
    if (e2.type !== `click`) return false;
    let t = e2.href;
    if (typeof t != `string` || !t.trim()) return false;
    try {
      return Wu(new URL(t, `https://learning.invalid`).pathname);
    } catch {
      return false;
    }
  }
  function qu(e2) {
    let t = (e2.label ?? ``).trim();
    if (t && bgLearningState.zu.test(t)) return true;
    let n = e2.href, r = Hu(e2);
    if (typeof n != `string` || !n.trim() || !r) return false;
    try {
      return new URL(n, `https://learning.invalid`).pathname !== r;
    } catch {
      return false;
    }
  }
  function Ju(e2) {
    let t = (e2.label ?? ``).trim();
    return !!t && bgLearningState.zu.test(t);
  }
  function Yu(e2) {
    if (e2.type === `click`) {
      let t = Hu(e2);
      return t && Uu(t) || e2.loginAction && !(e2.loginAction === `submit` && bgLearningState.Ru.test(e2.label ?? ``)) || Ku(e2) || Ju(e2) ? `none` : e2.evidence?.kind === `already` ? `already` : e2.evidence?.kind === `success` ? `confirmed` : qu(e2) ? `none` : e2.label && bgLearningState.Ru.test(e2.label) ? `action` : `none`;
    }
    if (e2.type === `fill` || e2.type === `drag`) {
      let t = e2.afterText ?? [];
      if (t.some((e3) => bgLearningState.Bu.test(e3))) return `already`;
      if (t.some((e3) => bgLearningState.Vu.test(e3))) return `confirmed`;
    }
    return `none`;
  }
  function Zu(e2) {
    let t = [];
    for (let n of e2) {
      let e3 = Hu(n);
      e3 && e3 !== t[t.length - 1] && t.push(e3);
    }
    return t;
  }
  function Qu(e2) {
    return e2.filter((e3) => e3.type !== `navigation`).length;
  }
  function $u(e2, t) {
    let n = `login`, r = `none`, i = false, a = false, o = false, s = false, c = false, l2 = false, u = false, d = false;
    for (let f2 of e2) {
      if (Ku(f2)) {
        i = true, n = `login`, r = `none`, a = false, o = false, s = false, c = false, u = false, l2 = false, d = false;
        continue;
      }
      let e3 = Hu(f2), p2 = !!e3 && Uu(e3);
      p2 && (u = true), f2.type === `fill` && (f2.fieldRole !== void 0 || p2 && f2.hasValue) && (a = true);
      let m = s || c;
      if (f2.type === `click` && f2.loginAction === `submit` && (s = true), f2.type === `click` && f2.loginAction === `oauth` && (c = true), f2.type === `fill` && f2.key === `Enter` && (f2.fieldRole === `password` || p2) && (s = true), !ku(t)) {
        (c || a && s) && (n = `done`, i = false);
        continue;
      }
      if (p2) continue;
      e3 && Iu(e3) && (d = true), e3 && u && (l2 = true);
      let h = !!e3 && Du(e3), g = !!e3 && Gu(e3);
      (h || g || m || l2) && (o = true), i && o && (m || a) && (i = false), n === `login` && o && (n = `profile`), n === `profile` && g && (n = `checkin`);
      let _ = Yu(f2);
      _ !== `none` && bgLearningState.Xu[_] > bgLearningState.Xu[r] && (r = _, n === `login` && (n = `profile`), n === `profile` && (n = `checkin`), n = `done`);
    }
    let f = e2[e2.length - 1], p = f ? Hu(f) : void 0;
    return {
      kind: t,
      stage: n,
      ...p ? { path: p } : {},
      pages: Zu(e2).length,
      actions: Qu(e2),
      checkin: r,
      credentials: a,
      signedIn: o,
      login: c || a && s,
      logout: i,
      loginAsCheckinAvailable: ku(t) && o && !i && r === `none` && !d
    };
  }
  function ed(e2, t) {
    return $u(e2, t).loginAsCheckinAvailable;
  }
  function cd(e2, t) {
    return ku(e2) ? t === `login` ? `请登录` : t === `profile` ? `已检测到登录成功，请前往能显示当前账号的页面` : t === `checkin` ? `请完成一次签到` : `已录到签到动作` : t === `done` ? `已录到登录动作` : `请登录`;
  }
  function ld(e2) {
    let t = e2.kind === `login`, n = t ? 2 : 4, r = t ? e2.stage === `done` ? 2 : 1 : e2.stage === `login` ? 1 : e2.stage === `profile` ? 2 : e2.stage === `checkin` ? 3 : 4, i = bgLearningState.td[r - 1] ?? ``, a = e2.stage === `done`, o = t ? bgLearningState.sd[e2.stage] : bgLearningState.ad[e2.stage], s = (t ? bgLearningState.rd : bgLearningState.nd).map((e3, t2) => ({
      label: e3,
      state: t2 + 1 < r ? `done` : t2 + 1 === r ? `current` : `todo`
    }));
    return {
      step: r,
      total: n,
      title: `${i} ${cd(e2.kind, e2.stage)}${a ? `，可以点「结束学习」了` : ``}`,
      hint: !t && e2.loginAsCheckinAvailable ? `${o}；${bgLearningState.od}` : o,
      steps: s,
      ...e2.logout ? { warning: bgLearningState.id } : {}
    };
  }
  function Id(e2) {
    return bgLearningState.Fd.test(e2) ? `` : e2;
  }
  function Ld(e2, t) {
    if (t.trim())
      try {
        let n = new URL(t, e2.loginUrl), r = new URL(e2.loginUrl).origin;
        return n.origin === r ? `${n.pathname}${Id(n.hash)}` : void 0;
      } catch {
        return;
      }
  }
  function Rd(e2) {
    let t = e2.afterText;
    return Array.isArray(t) ? t.filter((e3) => typeof e3 == `string`).map((e3) => e3.replace(/\s+/g, ` `).trim()).filter(Wf).slice(0, 6) : [];
  }
  function zd(e2) {
    if (!e2 || e2.kind !== `success` && e2.kind !== `already` || !Array.isArray(e2.words)) return;
    let t = e2.words.filter((e3) => typeof e3 == `string` && Wf(e3)).slice(0, 4);
    return t.length ? { kind: e2.kind, words: t } : void 0;
  }
  function Bd(e2) {
    return /\[href\s*[*^$|~]?=\s*["']?([^"'\]]+)["']?\]/i.exec(e2)?.[1];
  }
  function Vd(e2) {
    if (!e2) return false;
    let t = e2.scrollBeforeY;
    return typeof t == `number` ? Number.isFinite(t) && t > 0 : e2.scrollPageTop === true && t === void 0;
  }
  function Hd(e2) {
    if (typeof e2 != `string`) return;
    let t = e2.trim();
    return t && t.length <= 300 && !t.includes(`text=`) && !tp(t) ? t : void 0;
  }
  function Ud(e2) {
    let t = e2.scrollBeforeY, n = Hd(e2.scrollContainer), r = n ? { scrollContainer: n } : {};
    return typeof t == `number` && Number.isFinite(t) && t > 0 ? { scrollBeforeY: Math.min(Math.round(t), bgLearningState._d), ...r } : e2.scrollPageTop === true ? { scrollPageTop: true, ...r } : {};
  }
  function Wd(e2) {
    return ef(e2) ? {
      [bgLearningState.vd]: true,
      ...e2.scrollContainer ? { scrollContainer: e2.scrollContainer } : {}
    } : {};
  }
  function Gd(e2) {
    let t = e2.href ?? Bd(e2.selector ?? ``);
    if (t)
      try {
        let e3 = new URL(t, `https://placeholder.invalid`);
        if (bgLearningState.Md.test(`${e3.pathname}${e3.search}`)) return true;
      } catch {
      }
    return e2.kind === `fill` && bgLearningState.Nd.test(`${e2.selector ?? ``} ${e2.label ?? ``}`) ? true : bgLearningState.Pd.test((e2.label ?? ``).trim());
  }
  function Kd(e2) {
    return e2.fieldRole === `username` || e2.fieldRole === `password` ? true : e2.kind === `click` ? e2.loginAction === `oauth` || !(e2.loginAction !== `submit` || bgLearningState.Sd.test(e2.label ?? ``) || e2.href && !bgLearningState.Md.test(e2.href)) : false;
  }
  function qd(e2) {
    return `${e2.type}|${e2.selector}|${e2.path}|${e2.at}`;
  }
  function Jd(e2) {
    let t = [], n = /* @__PURE__ */ new Map();
    for (let r of e2) {
      if (r.type === `navigation`) continue;
      if (r.type === `scroll`) {
        let e4 = r.ratio;
        if (!Number.isFinite(e4) || e4 <= 0 || e4 > 1) continue;
        let n2 = t.at(-1);
        if (n2?.kind === `scroll` && J(n2.path) === J(r.path) && (n2.scrollContainer ?? ``) === (r.container ?? ``) && Math.abs((n2.ratio ?? 0) - Math.min(1, Math.max(0, e4))) <= 0.02)
          continue;
        t.push({
          kind: `scroll`,
          path: r.path,
          ratio: Math.min(1, Math.max(0, e4)),
          ...r.container ? { scrollContainer: r.container } : {},
          at: r.at
        });
        continue;
      }
      if (r.type === `drag`) {
        let e4 = r.selector.trim(), n2 = r.toSelector.trim();
        if (!e4 || !n2) continue;
        let i2 = t[t.length - 1];
        if (i2?.kind === `drag` && i2.selector === e4 && i2.toSelector === n2 && i2.path === r.path && i2.at === r.at) {
          let e5 = Rd(r), t2 = zd(r.evidence);
          e5.length && (i2.afterText = e5), t2 && (i2.evidence = t2), Vd(r) && Object.assign(i2, Ud(r));
          continue;
        }
        let a2 = Rd(r), o2 = zd(r.evidence);
        t.push({
          kind: `drag`,
          selector: e4,
          toSelector: n2,
          label: r.label ?? ``,
          path: r.path,
          ...r.anchor ? { anchor: r.anchor } : {},
          ...r.toAnchor ? { toAnchor: r.toAnchor } : {},
          ...a2.length ? { afterText: a2 } : {},
          ...o2 ? { evidence: o2 } : {},
          ...Vd(r) ? Ud(r) : {},
          at: r.at
        });
        continue;
      }
      let e3 = r.selector?.trim();
      if (!e3) continue;
      let i = r.type === `click` ? zd(r.evidence) : void 0, a = n.get(qd(r));
      if (a !== void 0) {
        let e4 = t[a], n2 = Rd(r);
        n2.length && (e4.afterText = n2), i && (e4.evidence = i), r.type === `fill` && (e4.hasValue = r.hasValue), Vd(r) && Object.assign(e4, Ud(r));
        continue;
      }
      let o = Rd(r), s = {
        kind: r.type,
        selector: e3,
        label: r.label ?? ``,
        path: r.path,
        ...r.type === `click` && r.href ? { href: r.href } : {},
        ...r.type === `fill` ? { hasValue: r.hasValue } : {},
        ...r.type === `fill` && r.fieldRole ? { fieldRole: r.fieldRole } : {},
        ...r.type === `click` && r.anchor ? { anchor: r.anchor } : {},
        ...r.type === `click` && r.gesture ? { gesture: r.gesture } : {},
        ...r.type === `click` && r.key ? { key: r.key } : {},
        ...r.type === `click` && typeof r.holdMs == `number` ? { holdMs: r.holdMs } : {},
        ...r.type === `click` && r.dragToSelector ? { dragToSelector: r.dragToSelector } : {},
        ...r.type === `click` && r.dragToAnchor ? { dragToAnchor: r.dragToAnchor } : {},
        ...r.type === `click` && r.loginAction ? { loginAction: r.loginAction } : {},
        ...r.fingerprint ? { fingerprint: r.fingerprint } : {},
        ...r.type === `fill` && r.control ? { control: r.control } : {},
        ...r.type === `fill` && typeof r.choice == `number` ? { choice: r.choice } : {},
        ...r.type === `fill` && typeof r.checked == `boolean` ? { checked: r.checked } : {},
        ...o.length ? { afterText: o } : {},
        ...i ? { evidence: i } : {},
        ...Vd(r) ? Ud(r) : {},
        at: r.at
      };
      if (s.kind !== `scroll` && (Gd(s) || Kd(s))) continue;
      let c = t.at(-1);
      c && c.selector === s.selector && c.kind === s.kind && c.path === s.path && Math.abs(s.at - c.at) <= bgLearningState.gd && !s.gesture && !s.key && !c.gesture && !c.key ? (s.evidence && (c.evidence = s.evidence), s.afterText && (c.afterText = s.afterText), s.scrollBeforeY !== void 0 && (c.scrollBeforeY = s.scrollBeforeY), s.scrollPageTop && (c.scrollPageTop = true), s.scrollContainer && (c.scrollContainer = s.scrollContainer), n.set(qd(r), t.length - 1)) : (n.set(qd(r), t.length), t.push(s));
    }
    return t.filter((e3) => e3.kind !== `fill` || e3.hasValue !== false);
  }
  function Yd(e2) {
    let t = e2.indexOf(`#`);
    return (t >= 0 ? e2.slice(0, t) : e2) || `/`;
  }
  function J(e2) {
    try {
      let t = new URL(e2, `https://placeholder.invalid`);
      return `${t.pathname || `/`}${Id(t.hash)}`;
    } catch {
      return e2.trim() || `/`;
    }
  }
  function Zd(e2) {
    if (!Du(e2.loginUrl))
      try {
        let t = new URL(e2.loginUrl);
        return t.hash ? `${t.pathname}${t.hash}` : t.pathname && t.pathname !== `/` ? t.pathname : void 0;
      } catch {
        return;
      }
  }
  function Qd(e2, t) {
    let n = Zd(e2);
    if (n && (n.includes(`#`) ? t === n : Yd(t) === n)) return true;
    let r = t.includes(`#`) ? t.slice(t.indexOf(`#`) + 1) : ``;
    return bgLearningState.Xd.test(Yd(t)) || r.startsWith(`/`) && bgLearningState.Xd.test(r);
  }
  function $d(e2, t) {
    return Ld(e2, t.path) ?? Ld(e2, t.href ?? ``);
  }
  function ef(e2) {
    return typeof e2.scrollBeforeY == `number` ? Number.isFinite(e2.scrollBeforeY) && e2.scrollBeforeY > 0 : e2.scrollPageTop === true;
  }
  function tf(e2, t) {
    if (t.kind !== `click`) return false;
    if (bgLearningState.Dd.test(t.label ?? ``)) return true;
    let n = t.href ? Ld(e2, t.href) : void 0;
    return !!n && J(n) !== J(t.path);
  }
  function nf(e2, t, n) {
    let r = [], i = (t2) => {
      t2 && !Qd(e2, t2) && r.at(-1) !== t2 && r.push(t2);
    }, a = n.filter((t2) => {
      let n2 = $d(e2, t2);
      return !!n2 && !Qd(e2, n2);
    }), o = [...a].reverse().find((e3) => !!e3.evidence), s = [...a].reverse().find((e3) => bgLearningState.Sd.test(e3.label ?? ``) || bgLearningState.Cd.test(e3.path)), c = a.at(-1), l2 = o ?? s ?? c;
    if (l2 && !o) {
      let t2 = l2.href ? Ld(e2, l2.href) : void 0;
      if (t2 && J(t2) !== J(l2.path) || !s && tf(e2, l2)) return [];
    }
    let u = l2 ? $d(e2, l2) : void 0;
    if (!l2 || !u) return [];
    let d = [];
    for (let n2 of t)
      n2.type !== `navigation` || n2.at > l2.at || d.push({ at: n2.at, page: Ld(e2, n2.path) });
    for (let t2 of a) t2.at > l2.at || d.push({ at: t2.at, page: $d(e2, t2) });
    d.sort((e3, t2) => e3.at - t2.at);
    for (let e3 of d) i(e3.page);
    return r.at(-1) !== u && r.push(u), df(r);
  }
  function rf(e2, t) {
    try {
      let n = new URL(e2, `https://placeholder.invalid`), r = n.hash.startsWith(`#`) ? n.hash.slice(1) : n.hash;
      return t(n.pathname) || r.startsWith(`/`) && t(r);
    } catch {
      return t(e2);
    }
  }
  function of(e2) {
    return bgLearningState.Ed.test(e2) && !bgLearningState.af.test(e2);
  }
  function sf(e2) {
    return rf(e2, (e3) => bgLearningState.Td.test(e3) && !of(e3));
  }
  function cf(e2) {
    return rf(e2, of);
  }
  function lf(e2, t, n) {
    let r = n.at(-1);
    if (!r) return;
    let i = t.filter((e3) => e3.kind === `click` && bgLearningState.wd.test(e3.label ?? ``) && !!e3.href).map((t2) => ({ action: t2, path: Ld(e2, t2.href ?? ``) })).find(
      ({ action: t2, path: n2 }) => !!n2 && n2 !== r && n2 !== $d(e2, t2) && !Qd(e2, n2) && !cf(n2)
    )?.path;
    if (i) return i;
    let a = n.slice(0, -1).filter((t2) => sf(t2) && !Qd(e2, t2));
    return (a.find((e3) => rf(e3, (e4) => bgLearningState.af.test(e4))) ?? a[0]) || (Qd(e2, r) ? void 0 : r);
  }
  function uf(e2, t) {
    if (!t || e2.length === 0 || e2.includes(t)) return e2;
    let n = e2.at(-1), r = [...e2.slice(0, -1), t, n];
    return r.length <= bgLearningState.yd ? r : [...r.slice(-12, -2), t, n];
  }
  function df(e2) {
    return e2.length <= bgLearningState.yd ? e2 : [...e2.slice(0, 11), e2[e2.length - 1]];
  }
  function ff(e2) {
    let t = [];
    for (let n of e2) {
      let e3 = t.at(-1);
      e3 && J(e3[0].path) === J(n.path) ? e3.push(n) : t.push([n]);
    }
    return t;
  }
  function pf(e2, t, n = bgLearningState.xd) {
    let r = J(t.at(-1) ?? e2.at(-1)?.path ?? ``), i = (e3) => e3.length ? ff(e3).filter((e4) => J(e4[0].path) !== r).length : 0, a = e2;
    for (; a.length > 0 && a.length + i(a) > bgLearningState.bd - n; ) a = a.slice(1);
    let o = ff(a), s = bgLearningState.bd - n - a.length - i(a), c = /* @__PURE__ */ new Set();
    for (let e3 = a.length - 1; e3 >= 0 && c.size < s; --e3) a[e3].afterText?.length && c.add(e3);
    let l2 = [], u = 0;
    for (let e3 of o) {
      let t2 = [];
      for (let n2 of e3) {
        let e4 = Wd(n2);
        if (n2.kind === `scroll`)
          t2.push({
            type: `scroll`,
            ratio: n2.ratio ?? 0,
            ...n2.scrollContainer ? { container: n2.scrollContainer } : {}
          }), u += 1;
        else if (n2.selector) {
          if (n2.kind === `drag`) {
            if (!n2.toSelector) continue;
            let e5 = Wd(n2);
            t2.push({
              type: `drag`,
              selector: n2.selector,
              toSelector: n2.toSelector,
              ...n2.anchor ? { anchor: n2.anchor } : {},
              ...n2.toAnchor ? { toAnchor: n2.toAnchor } : {},
              ...e5
            }), u += 1;
          } else
            n2.kind === `click` && n2.dragToSelector ? (t2.push({
              type: `drag`,
              selector: n2.selector,
              ...n2.anchor ? { anchor: n2.anchor } : {},
              toSelector: n2.dragToSelector,
              ...n2.dragToAnchor ? { toAnchor: n2.dragToAnchor } : {},
              ...n2.scrollContainer ? { scrollContainer: n2.scrollContainer } : {},
              ...n2.scrollBeforeY !== void 0 || n2.scrollPageTop ? { scrollIntoView: true } : {}
            }), u += 1) : (t2.push(
              n2.kind === `fill` ? {
                type: `fill`,
                selector: n2.selector,
                value: `{{claimText}}`,
                ...e4,
                ...n2.control ? { control: n2.control } : {},
                ...n2.choice === void 0 ? {} : { choice: n2.choice },
                ...n2.checked === void 0 ? {} : { checked: n2.checked },
                ...n2.fingerprint ? { fingerprint: n2.fingerprint } : {}
              } : {
                type: `click`,
                selector: n2.selector,
                ...e4,
                ...n2.anchor ? { anchor: n2.anchor } : {},
                ...n2.gesture ? { gesture: n2.gesture } : {},
                ...n2.key ? { key: n2.key } : {},
                ...n2.holdMs === void 0 ? {} : { holdMs: n2.holdMs },
                ...n2.fingerprint ? { fingerprint: n2.fingerprint } : {}
              }
            ), c.has(u) && n2.afterText && t2.push({ type: `assert`, text: n2.afterText, optional: true, timeoutMs: 5e3 }), u += 1);
        }
      }
      e3[0] && J(e3[0].path) !== r ? l2.push({ type: `if`, condition: { type: `path`, pattern: J(e3[0].path) }, then: t2 }) : l2.push(...t2);
    }
    return l2;
  }
  function hf(e2) {
    let t = /* @__PURE__ */ new Set();
    for (let n2 of e2 ?? []) {
      let e3 = n2?.trim().toLowerCase();
      if (!e3) continue;
      e3.length >= bgLearningState.mf && t.add(e3);
      let r = e3.indexOf(`@`);
      r >= bgLearningState.mf && t.add(e3.slice(0, r));
    }
    if (t.size === 0) return () => false;
    let n = /[\p{L}\p{N}._+@-]/u;
    return (e3) => {
      let r = e3?.toLowerCase();
      if (!r) return false;
      for (let e4 of t)
        for (let t2 = r.indexOf(e4); t2 >= 0; t2 = r.indexOf(e4, t2 + 1)) {
          let i = r[t2 - 1], a = r[t2 + e4.length];
          if ((!i || !n.test(i)) && (!a || !n.test(a))) return true;
        }
      return false;
    };
  }
  function gf(e2, t) {
    if (e2.kind === `scroll` || e2.evidence || bgLearningState.Sd.test(e2.label ?? ``)) return e2;
    let n = { ...e2 };
    if (n.afterText) {
      let e3 = n.afterText.filter((e4) => !t(e4));
      e3.length ? n.afterText = e3 : delete n.afterText;
    }
    if (n.fingerprint) {
      let e3 = { ...n.fingerprint };
      t(e3.text) && delete e3.text, t(e3.aria) && delete e3.aria, Object.keys(e3).some((e4) => e4 !== `tag`) ? n.fingerprint = e3 : delete n.fingerprint;
    }
    return n;
  }
  function _f(e2, t, n = {}) {
    let r = t.reduce((e3, t2, n2) => Ku(t2) ? n2 : e3, -1), i = r >= 0 ? t.slice(r + 1) : [...t], a = hf(n.personalTexts), o = Jd(i).filter((t2) => {
      let n2 = $d(e2, t2);
      return !!n2 && !Qd(e2, n2);
    }).map((e3) => gf(e3, a));
    if (o.length === 0) return null;
    let s = nf(e2, i, o), c = lf(e2, o, s), l2 = uf(s, c), u = o.some((e3) => bgCheckinState.Ds.test(e3.label ?? ``)), d = pf(o, l2, bgLearningState.xd + (u ? 3 : 0)), f = [...o].reverse().find((e3) => e3.evidence)?.evidence, p = u ? bgCheckinState.Ts : f?.kind === `success` ? f.words : bgLearningState.Od, m = u ? bgCheckinState.Es : f?.kind === `already` ? f.words : bgLearningState.kd;
    return u && (d.push({ type: `assert`, text: [...p, ...m], timeoutMs: 15e3 }), d.unshift({
      type: `if`,
      condition: { type: `text`, words: bgCheckinState.Es },
      then: [{ type: `assert`, text: bgCheckinState.Es, result: `already` }]
    })), d.push({
      type: `if`,
      condition: { type: `text`, words: p },
      then: [{ type: `assert`, text: p, result: `success`, timeoutMs: 5e3 }],
      else: [{ type: `assert`, text: m, result: u ? `success` : `already`, timeoutMs: 5e3 }]
    }), {
      workflow: l2.length ? { steps: d, route: l2, ...c ? { identityPath: c } : {} } : { steps: d },
      eventCount: t.length
    };
  }
  function vf(e2, t, n = `both`, r = {}) {
    let i = t.length, a = wf(e2, t), o = n !== `login` && r.loginAsCheckin === true, s = o && ed(t, n === `checkin` ? `checkin` : `both`), c = n !== `login` && ed(t, n === `checkin` ? `checkin` : `both`), l2 = null;
    if (n !== `login`) {
      if (s) l2 = { kind: `login-as-checkin` };
      else {
        let n2 = _f(e2, t, { personalTexts: r.personalTexts })?.workflow ?? null;
        n2?.identityPath && (l2 = { kind: `workflow`, workflow: n2 });
      }
    }
    let u = [];
    return n === `login` ? a || u.push(`还没有录到完整的登录动作；请手动完成登录后再结束学习`) : !a && !l2 ? u.push(
      c ? `这次演示还没有录到任何登录或签到动作。若本站是「登录即签到」（登录成功后自动完成、页面上没有签到按钮），在账号行点「登录即签到」即可保存完整流程；否则请继续在原页面演示：完成一遍登录并点到签到按钮，再点「结束学习」；本次学习还在继续，不需要重新开始` : `这次演示还没有录到任何登录或签到动作。请先在打开的站点页面里完成一遍登录、并点到签到按钮，再点「结束学习」；本次学习还在继续，不需要重新开始`
    ) : a ? l2 || u.push(
      c ? `没有录到签到动作：若本站是「登录即签到」（登录成功后自动完成、页面上没有签到按钮），在账号行点「登录即签到」即可保存完整流程；否则请在签到按钮可点时重新演示一次` : `没有录到登录之后的签到动作，这次只保存登录配置；请在按钮可点时重新演示一次签到`
    ) : u.push(`没有录到完整的登录动作（账号/密码字段或第三方登录入口），这次只保存签到流程`), o && !s && u.push(
      `这次演示还不满足「登录即签到」的保存条件（需要先登录成功进入站内页面，且没有点到签到按钮），已按普通签到流程处理`
    ), { login: a, checkin: l2, eventCount: i, notices: u };
  }
  function yf(e2, t, n) {
    if (n !== false) return false;
    let r = $u(e2, t);
    if (!r.loginAsCheckinAvailable) return false;
    let i = [...e2].reverse().map(Hu).find((e3) => !!e3);
    if (!i) return false;
    let a;
    for (let t2 = e2.length - 1; t2 >= 0; --t2) {
      let n2 = e2[t2];
      if (n2.type !== `fill`) continue;
      let r2 = Hu(n2);
      if (r2 && (n2.fieldRole !== void 0 || n2.hasValue && Uu(r2))) {
        a = r2;
        break;
      }
    }
    let o = r.login && Ou(i) && i !== a;
    return Gu(i) || Du(i) || o;
  }
  function bf(e2) {
    return e2.intent !== `login` && !e2.loginAsCheckinRequested && !e2.alreadyPrompted && e2.loginAsCheckinPossible && !!e2.artifacts.login && !e2.artifacts.checkin;
  }
  function Sf(e2) {
    return e2.intent !== `login` && !e2.alreadyPrompted && e2.artifacts.checkin?.kind === `workflow` && e2.checkinEvidence === `none`;
  }
  function wf(e2, t) {
    let n = (e3) => {
      let t2 = e3.trim();
      if (!(t2.length === 0 || t2.length > 300) && !tp(t2)) return t2;
    }, r = (t2) => !!Ld(e2, t2.path), i = (e3) => [...t].reverse().find((t2) => t2.type === `fill` && t2.fieldRole === e3 && r(t2)), a = i(`username`), o = i(`password`), s = {}, c = (t2) => {
      let n2 = Ld(e2, t2);
      if (!n2) return;
      let r2 = new URL(n2, e2.loginUrl).href;
      r2 === new URL(e2.loginUrl).href ? delete s.loginUrl : s.loginUrl = r2;
    }, l2 = (i2, a2) => {
      let o2 = [], s2 = /* @__PURE__ */ new Map();
      for (let e3 of t) {
        if (e3.type !== `click` && e3.type !== `fill`) continue;
        let t2 = JSON.stringify([e3.type, e3.at, e3.path, e3.selector]), n2 = s2.get(t2);
        s2.set(t2, { ...n2, ...e3 });
      }
      for (let t2 of [...s2.values()].sort((e3, t3) => e3.at - t3.at)) {
        if (t2.at >= i2) break;
        if (J(t2.path) !== J(a2) || !r(t2) || t2.type !== `click` || t2.loginAction !== `entry`) {
          o2.length = 0;
          continue;
        }
        let s3 = n(t2.selector);
        s3 && (!t2.href || Ld(e2, t2.href)) && o2.push(s3);
      }
      return o2;
    }, u = (n2, i2) => {
      let a2 = t.filter(
        (t2) => t2.type === `click` && t2.loginAction === `entry` && t2.at < n2 && r(t2) && (!t2.href || !!Ld(e2, t2.href))
      );
      if (i2 !== void 0) {
        let e3 = [...a2].reverse().find((e4) => J(e4.path) === i2);
        if (e3) return e3;
      }
      return a2[0];
    };
    if (a?.type === `fill` && o?.type === `fill` && a.hasValue && o.hasValue) {
      let i2 = n(a.selector), d2 = n(o.selector);
      if (i2 && d2) {
        s.loginMethod = `form`, c(a.path);
        let f = [...t].reverse().find(
          (t2) => t2.type === `click` && t2.loginAction === `submit` && t2.at >= o.at && r(t2) && (!t2.href || !!Ld(e2, t2.href))
        ), p = f?.type === `click` ? n(f.selector) : void 0;
        s.selectors = { username: i2, password: d2, ...p ? { submit: p } : {} };
        let m = Math.min(a.at, o.at), h = u(m, J(a.path));
        if (h?.type === `click`) {
          let e3 = n(h.selector);
          e3 && (s.preLoginClickSelector = e3);
        }
        let g = l2(m, a.path);
        g.length > 1 && (s.preLoginClickSelectors = g);
      }
    }
    let d = [...t].reverse().find((e3) => e3.type === `click` && e3.loginAction === `oauth` && r(e3));
    if (d?.type === `click`) {
      let i2 = n(d.selector);
      if (i2) {
        s.loginMethod = `oauth`, c(d.path), s.oauthButtonSelector = i2, delete s.preLoginClickSelectors;
        if (/github/i.test(`${d.label ?? ``} ${d.selector} ${d.href ?? ``}`))
          s.oauthProvider = `github`;
        let a2 = [...t].reverse().find(
          (n2) => n2.type === `click` && n2.loginAction === `entry` && n2.at < d.at && r(n2) && J(n2.path) === J(d.path) && (!n2.href || !!Ld(e2, n2.href)) && !t.some((e3) => e3.type === `fill` && e3.at > n2.at && e3.at < d.at)
        ), o2 = a2?.type === `click` ? n(a2.selector) : void 0;
        o2 ? s.preLoginClickSelector = o2 : delete s.preLoginClickSelector;
        let u2 = l2(d.at, d.path);
        u2.length > 1 && (s.preLoginClickSelectors = u2);
      }
    }
    return Object.keys(s).length ? s : null;
  }
  function Tf(e2, t = Date.now()) {
    return !Number.isFinite(e2.createdAt) || t - e2.createdAt > 18e5;
  }
  function Ef(e2, t) {
    return e2.find((e3) => e3.accountId !== t.accountId && e3.siteId === t.siteId) ?? null;
  }
  function Df(e2, t) {
    let n = Ef(e2, t);
    return n ? { allowed: false, conflict: n } : { allowed: true };
  }
  function Of(e2, t = Date.now()) {
    let n = [], r = [];
    for (let [i, a] of e2) {
      if (!i.startsWith(`learn:`) || !a || typeof a != `object`) continue;
      let e3 = a;
      if (typeof e3.runId != `string` || typeof e3.accountId != `string` || !Number.isFinite(e3.createdAt))
        continue;
      let o = typeof e3.tabId == `number` ? e3.tabId : Number(i.slice(6)), s = { ...e3, tabId: o };
      (Tf(s, t) ? r : n).push(s);
    }
    return { active: n, expired: r };
  }
  function kf(e2) {
    return JSON.stringify(
      e2,
      (e3, t) => !t || typeof t != `object` || Array.isArray(t) ? t : Object.fromEntries(Object.entries(t).sort(([e4], [t2]) => e4.localeCompare(t2)))
    );
  }
  function Af(e2) {
    if (e2?.method !== `none`)
      return {
        ok: false,
        error: `学到的「登录即签到」没有写入站点配置（签到方式未生效），旧配置未改动，请重试`
      };
    let t = e2?.workflow;
    return t && Array.isArray(t.steps) && t.steps.length > 0 ? {
      ok: false,
      error: `学到的「登录即签到」仍保留旧签到步骤，自动签到可能跳错页面；旧配置未改动，请重试`
    } : [
      `entry`,
      `url`,
      `buttonSelector`,
      `alreadySelector`,
      `successSelector`,
      `claimConfirmSelector`,
      `apiUrl`,
      `logoutApiUrl`,
      `claimEntrySelector`,
      `claimInputSelector`,
      `claimSubmitSelector`
    ].some((t2) => e2?.[t2] !== void 0) ? {
      ok: false,
      error: `学到的「登录即签到」仍保留旧签到入口配置，自动签到可能跳错页面；旧配置未改动，请重试`
    } : { ok: true };
  }
  function jf(e2, t) {
    let n = t?.method;
    if (!t || n !== `workflow`)
      return { ok: false, error: `学到的流程未启用回放（当前是自动识别或其它签到方式），请重试` };
    let r = t.workflow;
    if (r?.steps?.length !== e2.steps.length)
      return {
        ok: false,
        error: `学到的流程未完整写入站点配置（步骤数不一致），旧配置未改动，请重试`
      };
    if (kf(r.steps) !== kf(e2.steps))
      return { ok: false, error: `学到的动作或滚动配置未完整写入站点配置，请重试` };
    let i = e2.route;
    if (i?.length) {
      let e3 = r.route;
      if (!Array.isArray(e3) || e3.length !== i.length || e3.some((e4, t2) => e4 !== i[t2]))
        return {
          ok: false,
          error: `学到的页面路线未写入站点配置（自动签到将找不到签到页），旧配置未改动，请重试`
        };
    }
    return r.identityPath === e2.identityPath ? { ok: true } : { ok: false, error: `学到的个人资料身份核验路径未写入站点配置，旧配置未改动，请重试` };
  }
  function Mf(e2, t, n = Date.now()) {
    return Tf(e2, n) ? { ok: false, error: `学习会话已过期，请重新开始学习`, expired: true } : e2.events.length >= 100 ? { ok: false, error: `学习事件已达到上限`, expired: false } : { ok: true, learning: { ...e2, events: [...e2.events, t] } };
  }
  function Nf(e2) {
    if (!Array.isArray(e2)) return;
    let t = e2.filter((e3) => typeof e3 == `string`).map((e3) => e3.replace(/\s+/g, ` `).trim()).filter((e3) => !!e3 && e3.length <= 60 && Wf(e3)).slice(0, 6);
    return t.length ? t : void 0;
  }
  function Pf(e2) {
    let t = {}, n = e2.scrollBeforeY;
    typeof n == `number` && Number.isFinite(n) && n >= 0 && n <= 1e6 && (t.scrollBeforeY = Math.round(n)), e2.scrollPageTop === true && (t.scrollPageTop = true);
    let r = Hd(e2.scrollContainer);
    return r && (t.scrollPageTop || (t.scrollBeforeY ?? 0) > 0) && (t.scrollContainer = r), t;
  }
  function Ff(e2) {
    try {
      let t = new URL(e2, `https://learning.invalid`);
      return `${t.pathname || `/`}${Id(t.hash)}`.slice(0, 500);
    } catch {
      return (e2.split(/[?#]/, 1)[0] ?? ``).slice(0, 500) || `/`;
    }
  }
  function If(e2) {
    if (!(typeof e2 != `string` || e2.length > 1e3))
      try {
        let t = new URL(e2, `https://learning.invalid`);
        return t.protocol !== `http:` && t.protocol !== `https:` ? void 0 : (t.username = ``, t.password = ``, t.search = ``, t.hash = ``, `${t.origin}${t.pathname}`.slice(0, 1e3));
      } catch {
        return;
      }
  }
  function Lf(e2) {
    if (!e2 || typeof e2 != `object`) return;
    let { rx: t, ry: n } = e2;
    if (typeof t != `number` || !Number.isFinite(t) || typeof n != `number` || !Number.isFinite(n))
      return;
    let r = (e3) => Math.min(1, Math.max(0, e3));
    return { rx: r(t), ry: r(n) };
  }
  function Rf(e2) {
    if (!e2 || typeof e2 != `object`) return;
    let t = e2, n = (e3) => {
      let n2 = t[e3];
      return typeof n2 == `string` && n2.trim() && n2.length <= 200 ? n2.trim() : void 0;
    }, r = {}, i = n(`tag`);
    i && (r.tag = i);
    let a = n(`aria`);
    a && (r.aria = a);
    let o = n(`name`);
    o && (r.name = o);
    let s = n(`testId`);
    s && (r.testId = s);
    let c = n(`inputType`);
    c && (r.inputType = c);
    let l2 = n(`text`);
    l2 && (r.text = l2);
    let u = n(`role`);
    return u && (r.role = u), Object.keys(r).length ? r : void 0;
  }
  function Bf(e2) {
    return e2 === `click` || e2 === `double` || e2 === `right` || e2 === `long-press` ? e2 : void 0;
  }
  function Vf(e2) {
    return typeof e2 == `string` && bgLearningState.zf.has(e2) ? e2 : void 0;
  }
  function Hf(e2) {
    if (typeof e2 != `string`) return;
    let t = e2.trim();
    if (!(!t || t.length > 300) && !tp(t)) return t;
  }
  function Uf(e2) {
    if (!e2 || typeof e2 != `object` || !Number.isFinite(e2.at)) return null;
    if (e2.type === `navigation`)
      return typeof e2.path == `string` && e2.path.length <= 500 ? { type: `navigation`, path: Ff(e2.path), at: e2.at } : null;
    if (e2.type === `scroll`) {
      let t2 = e2.ratio;
      if (typeof e2.path != `string` || e2.path.length > 500 || typeof t2 != `number` || !Number.isFinite(t2) || t2 <= 0 || t2 > 1)
        return null;
      let n2 = Hd(e2.container);
      return {
        type: `scroll`,
        path: Ff(e2.path),
        ratio: Math.min(1, Math.max(0, t2)),
        ...n2 ? { container: n2 } : {},
        at: e2.at
      };
    }
    if (e2.type === `drag`) {
      let t2 = e2, n2 = Hf(t2.selector), r2 = Hf(t2.toSelector);
      if (!n2 || !r2 || typeof t2.label != `string` || t2.label.length > 100 || typeof t2.path != `string` || t2.path.length > 500)
        return null;
      let i2 = Lf(e2.anchor), a2 = Lf(e2.toAnchor), o2 = Pf(e2), s2 = Nf(e2.afterText), c2 = e2.evidence, l3 = c2 && typeof c2 == `object` ? zd(c2) : void 0;
      return {
        type: `drag`,
        selector: n2,
        toSelector: r2,
        label: t2.label.trim().slice(0, 100),
        path: Ff(t2.path),
        ...o2,
        ...i2 ? { anchor: i2 } : {},
        ...a2 ? { toAnchor: a2 } : {},
        ...s2 ? { afterText: s2 } : {},
        ...l3 ? { evidence: l3 } : {},
        at: e2.at
      };
    }
    if (e2.type !== `click` && e2.type !== `fill` || typeof e2.selector != `string` || !e2.selector.trim() || e2.selector.length > 300 || typeof e2.label != `string` || e2.label.length > 100 || typeof e2.path != `string` || e2.path.length > 500)
      return null;
    let t = Nf(e2.afterText), n = Pf(e2), r = e2.label.trim().slice(0, 100), i = Ff(e2.path), a = e2.selector.trim();
    if (e2.type === `fill`) {
      let o2 = Rf(e2.fingerprint), s2 = Vf(e2.key);
      return {
        type: `fill`,
        selector: a,
        label: r,
        path: i,
        hasValue: e2.hasValue === true,
        ...e2.fieldRole === `username` || e2.fieldRole === `password` ? { fieldRole: e2.fieldRole } : {},
        ...t ? { afterText: t } : {},
        ...n,
        ...o2 ? { fingerprint: o2 } : {},
        ...s2 ? { key: s2 } : {},
        at: e2.at
      };
    }
    let o = e2.evidence && (e2.evidence.kind === `success` || e2.evidence.kind === `already`) && Array.isArray(e2.evidence.words) ? {
      kind: e2.evidence.kind,
      words: e2.evidence.words.filter((e3) => typeof e3 == `string` && Wf(e3)).slice(0, 4)
    } : void 0, s = Lf(e2.anchor), c = Bf(e2.gesture), l2 = Vf(e2.key), u = e2.holdMs, d = typeof u == `number` && Number.isFinite(u) && u > 0 && u <= 6e4 ? Math.round(u) : void 0, f = Lf(e2.dragToAnchor), p = Rf(e2.fingerprint), m = e2.dragToSelector, h = typeof m == `string` && m.trim() && m.length <= 300 && !m.includes(`text=`) && !tp(m.trim()) ? m.trim() : void 0;
    return {
      type: `click`,
      selector: a,
      label: r,
      path: i,
      ...If(e2.href) ? { href: If(e2.href) } : {},
      ...e2.loginAction === `entry` || e2.loginAction === `submit` || e2.loginAction === `oauth` ? { loginAction: e2.loginAction } : {},
      ...o ? { evidence: o } : {},
      ...t ? { afterText: t } : {},
      ...n,
      ...s ? { anchor: s } : {},
      ...c ? { gesture: c } : {},
      ...l2 ? { key: l2 } : {},
      ...d === void 0 ? {} : { holdMs: d },
      ...h ? { dragToSelector: h } : {},
      ...f ? { dragToAnchor: f } : {},
      ...p ? { fingerprint: p } : {},
      at: e2.at
    };
  }
  function Wf(e2) {
    return !(!e2 || e2.length > 60 || /@[\w-]+\.[\w-]+/.test(e2) || /\d{6,}/.test(e2) || /eyJ[\w-]{6,}|bearer\s|password|token|secret|密码/i.test(e2) || /\b(?:sk|pk|ghp|gho|ghu|ghs|glpat|xox[baprs])[-_][A-Za-z0-9]/i.test(e2) || e2.match(/[A-Za-z0-9]{20,}/g)?.some((e3) => /[A-Za-z]/.test(e3) && /\d/.test(e3)));
  }
  function Zf(e2) {
    return e2.length < bgLearningState.Xf || !/^[0-9a-f]+$/i.test(e2) ? false : /\d/.test(e2) && /[a-f]/i.test(e2);
  }
  function Qf(e2) {
    let t = e2.trim();
    return !bgLearningState.Gf.test(t) || bgLearningState.Kf.test(t) || bgLearningState.qf.test(t) || bgLearningState.Jf.test(t) || bgLearningState.Yf.test(t) ? true : t.split(/[-_]/).some(Zf);
  }
  function tp(e2) {
    let t = e2.trim();
    if (!t) return false;
    if (bgLearningState.ep.test(t)) return true;
    for (let e3 of t.split(`>>`))
      if (!e3.trim().startsWith(`text=`)) {
        for (let t2 of e3.matchAll(bgLearningState.$f)) if (Qf(t2[1])) return true;
      }
    return false;
  }
  function np(e2) {
    if (!e2) return null;
    try {
      let t = new URL(e2.loginUrl).origin;
      return t && t !== `null` ? t : null;
    } catch {
      return null;
    }
  }
  function rp(e2, t) {
    if (!t || !e2) return false;
    try {
      return new URL(e2).origin === t;
    } catch {
      return false;
    }
  }
  function ip(e2, t) {
    let n = {};
    return e2.loginMethod && (n.loginMethod = e2.loginMethod), e2.loginUrl && (n.loginUrl = e2.loginUrl), e2.selectors && (n.selectors = { ...t.selectors, ...e2.selectors }), (e2.loginMethod === `form` || e2.loginMethod === `oauth`) && (n.preLoginClickSelectors = e2.preLoginClickSelectors ?? []), e2.loginMethod === `oauth` ? (e2.oauthButtonSelector && (n.oauthButtonSelector = e2.oauthButtonSelector), n.preLoginClickSelector = e2.preLoginClickSelector?.trim() || ``) : e2.loginMethod === `form` ? (n.preLoginClickSelector = e2.preLoginClickSelector?.trim() || ``, n.oauthButtonSelector = ``) : (e2.preLoginClickSelector && (n.preLoginClickSelector = e2.preLoginClickSelector), e2.oauthButtonSelector && (n.oauthButtonSelector = e2.oauthButtonSelector)), n;
  }
  function sp(e2, t) {
    if (!t) return { ok: false, error: `学习登录配置写入后无法读回站点` };
    if (e2.loginMethod !== `form` && e2.loginMethod !== `oauth`)
      return { ok: false, error: `学习登录配置缺少可回放的登录方式` };
    if (e2.loginMethod === `form` && (!e2.selectors?.username || !e2.selectors?.password))
      return { ok: false, error: `学习登录配置不完整（缺少账号或密码字段）` };
    if (e2.loginMethod === `oauth` && !e2.oauthButtonSelector)
      return { ok: false, error: `学习登录配置不完整（缺少 OAuth 按钮）` };
    if (e2.loginUrl && t.loginUrl !== e2.loginUrl)
      return { ok: false, error: `学习登录配置写入后登录页面不一致` };
    if (JSON.stringify(t.preLoginClickSelectors ?? []) !== JSON.stringify(e2.preLoginClickSelectors ?? []))
      return { ok: false, error: `学习登录配置写入后前置点击顺序不一致` };
    for (let t2 of [
      ...e2.preLoginClickSelectors ?? [],
      e2.preLoginClickSelector,
      e2.oauthButtonSelector
    ])
      if (t2 && tp(t2)) return { ok: false, error: `学习登录配置包含不可回放的选择器` };
    for (let [n, r] of Object.entries(e2.selectors ?? {})) {
      if (typeof r != `string` || !r.trim() || tp(r))
        return { ok: false, error: `学习登录配置包含不可回放的选择器：${n}` };
      if (t.selectors?.[n] !== r)
        return { ok: false, error: `学习登录配置写入后字段选择器不一致：${n}` };
    }
    return t.loginMethod === e2.loginMethod ? e2.loginMethod === `oauth` ? t.oauthButtonSelector === e2.oauthButtonSelector ? (t.preLoginClickSelector ?? ``) === (e2.preLoginClickSelector?.trim() || ``) ? { ok: true } : { ok: false, error: `学习登录配置写入后 OAuth 入口不一致（不允许旧表单入口残留）` } : { ok: false, error: `学习登录配置写入后 OAuth 按钮不一致` } : (t.preLoginClickSelector ?? ``) === (e2.preLoginClickSelector?.trim() || ``) ? (t.oauthButtonSelector ?? ``) === `` ? { ok: true } : { ok: false, error: `学习登录配置写入后仍残留旧 OAuth 入口` } : { ok: false, error: `学习登录配置写入后登录入口不一致` } : { ok: false, error: `学习登录配置写入后登录方式不一致` };
  }
  function cp(e2) {
    switch (e2) {
      case `缺少用户名输入框选择器`:
        return `站点还没配置登录表单：缺少账号（用户名）输入框选择器`;
      case `缺少密码输入框选择器`:
        return `站点还没配置登录表单：缺少密码输入框选择器`;
      case `缺少登录按钮选择器`:
        return `站点还没配置登录表单：缺少登录按钮选择器`;
      default:
        return e2;
    }
  }
  function lp(e2) {
    return `这次学到的内容没有写入站点：站点自己的配置还不完整（${cp(e2)}）。请先在该站点的设置里补齐登录方式与字段选择器，再回到这个页面点「结束学习」；本次学习还在继续，不需要重新开始`;
  }
  function up(e2) {
    let { saved: t, notices: n, failures: r, siteConfigBlockers: i } = e2;
    if (t.length === 0)
      return i.length > 0 ? { ok: false, error: lp(i[0]) } : { ok: false, error: r[0] ?? n[0] ?? `这次演示没有录到可保存的内容` };
    let a = [...n];
    return i.length > 0 && a.push(`有内容没能保存：站点自己的配置还不完整（${cp(i[0])}）`), r.length > 0 && a.push(
      `这次没有保存完整：另一半保存失败（原因：${r[0]}）。已保存的部分不受影响、会继续生效；本次学习已结束，失败的那半需要重新学习才能补上`
    ), { ok: true, notices: a };
  }
  function mp(e2, t) {
    return Array.isArray(e2) ? e2.filter((e3) => typeof e3 == `string` && t.includes(e3)) : [];
  }
  function hp(e2, t) {
    let n = t === `success` ? bgLearningState.fp : bgLearningState.pp, r = /* @__PURE__ */ new Set();
    for (let i of e2) {
      let e3 = i.type === `click` ? i.evidence : void 0;
      if (e3?.kind === t) for (let t2 of mp(e3.words, n)) r.add(t2);
    }
    return [...r];
  }
  function gp(e2) {
    return e2.some((e3) => {
      let t = Yu(e3);
      return t === `confirmed` || t === `already`;
    });
  }
  function _p(e2) {
    return {
      username: e2.some((e3) => e3.type === `fill` && e3.fieldRole === `username`),
      password: e2.some((e3) => e3.type === `fill` && e3.fieldRole === `password`)
    };
  }
  function vp() {
    return { status: `warn`, text: `⚠️ 这次演示点了「退出登录」：会话已经断开，建议重新演示一遍` };
  }
  function yp(e2) {
    let t = _p(e2), n = e2.some((e3) => e3.type === `click` && e3.loginAction === `oauth`);
    return t.username && t.password ? [{ status: `ok`, text: `✅ 登录配置已学会（表单：用户名/密码已识别）` }] : n ? [{ status: `ok`, text: `✅ 登录配置已学会（第三方登录入口已识别）` }] : t.username || t.password ? [
      {
        status: `warn`,
        text: `⚠️ 只录到其中一个字段：账号或密码字段没被识别，自动登录可能填不全`
      }
    ] : [{ status: `missing`, text: `⚠️ 没有录到登录动作（账号/密码字段或第三方登录入口）` }];
  }
  function bp(e2, t) {
    return t.credentials && t.signedIn ? {
      status: `ok`,
      text: `✅ 登录配置已学会（表单：在登录页录到了账号/密码输入，并成功进入站内页面）`
    } : t.credentials ? {
      status: `warn`,
      text: `⚠️ 登录部分可能学不全：只看到登录页上的输入，没看到登录成功（离开登录页）`
    } : {
      status: `ok`,
      text: `ℹ️ 本次没有录到登录步骤（开始学习时可能已经是登录状态），只更新签到流程`
    };
  }
  function xp(e2, t) {
    if (t.checkin === `none`) return null;
    let n = hp(e2, `success`);
    return n.length > 0 ? { status: `ok`, text: `✅ 已录到「签到成功」证据（词：${n.join(`、`)}）` } : hp(e2, `already`).length > 0 || t.checkin === `already` ? { status: `warn`, text: `⚠️ 页面显示今天已经签到：这遍录到的流程按「已完成」处理` } : gp(e2) ? { status: `ok`, text: `✅ 已录到页面的签到结果提示` } : {
      status: `warn`,
      text: `⚠️ 没有录到「签到成功」证据 —— 可能是当天已签到，或你没点到真正的签到按钮`
    };
  }
  function Ep(e2, t) {
    return t && t !== `form` && t !== `auto` || (e2.loginMethod ?? `form`) !== `form` ? true : !!(e2.selectors?.username?.trim() && e2.selectors?.password?.trim() && e2.selectors?.submit?.trim());
  }
  function Dp(e2, t) {
    return !e2.credentials && !e2.login && !t ? { status: `missing`, text: bgLearningState.Cp } : e2.signedIn ? !e2.login && !e2.credentials ? { status: `warn`, text: bgLearningState.Tp } : { status: `ok`, text: bgLearningState.Sp } : { status: `warn`, text: bgLearningState.wp };
  }
  function Ap(e2, t, n = {}) {
    let r = $u(e2, t), i = [], a = e2.some((e3) => Iu(e3.path));
    if (t === `login`) i.push(...yp(e2));
    else if (i.push(bp(e2, r)), n.loginAsCheckin) i.push(Dp(r, n.hasStoredLoginConfig === true));
    else if (n.siteCheckinMethod === `none` && r.checkin === `none` && !a)
      i.push({ status: `ok`, text: bgLearningState.kp });
    else if (r.checkin === `none`)
      i.push({
        status: `missing`,
        text: a ? `❌ 没有录到签到动作（抽奖站需要演示实际抽奖，只有进入页面不算学会）` : `❌ 没有录到签到动作（没有点到签到/领取按钮）`
      }), r.loginAsCheckinAvailable && i.push({ status: `warn`, text: bgLearningState.Op });
    else {
      let t2 = Zu(e2).length;
      i.push({ status: `ok`, text: `✅ 签到流程已学会（经过 ${t2} 个页面、${r.actions} 个动作）` });
      let n2 = xp(e2, r);
      n2 && i.push(n2);
    }
    return r.logout && i.push(vp()), Mp(i, t, n);
  }
  function jp(e2) {
    return e2.some((e3) => e3.status === `missing`) ? `incomplete` : e2.some((e3) => e3.status === `warn`) ? `partial` : `complete`;
  }
  function Mp(e2, t, n = {}) {
    n.saveFailed === true && e2.push({ status: `missing`, text: `❌ 有内容没能保存成功，本次结论按「还差内容」处理` });
    let r = jp(e2);
    return {
      verdict: r,
      lines: e2,
      summary: r === `complete` ? n.loginAsCheckin ? `已按「登录即签到」学会，可以放心使用` : t === `login` ? `登录配置已学会，可以放心使用` : `登录配置与签到流程都已学会` : r === `partial` ? `已学会的内容可用，但有需要留意的地方` : `这次演示还不够，先别指望它自动签到`,
      warnings: e2.filter((e3) => e3.status !== `ok`).map((e3) => e3.text.replace(bgLearningState.dp, ``))
    };
  }
  function Kp(e2, t, n) {
    return e2.filter((account) => account.siteId === n.id);
  }
  function Jp(e2) {
    return [
      e2.username,
      e2.githubUsername,
      e2.identity?.username,
      e2.identity?.displayName,
      e2.identity?.email
    ].filter((e3) => typeof e3 == `string` && e3.trim().length > 0);
  }
  function Yp(e2) {
    return e2 === `login` ? `登录` : `登录与签到`;
  }
  async function Pm(e2) {
    const account = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find(
      (item) => item.id === e2.accountId
    );
    if (!account || account.siteId !== e2.siteId) return null;
    const sites = await bgPlatformState.t.get(bgPlatformState.r.sites, []);
    return np(bgSitesState.Y(e2.siteId, sites));
  }
  async function Fm(e2, t) {
    return rp(t.url ?? t.tab?.url, await Pm(e2));
  }
  async function recordLearningIdentity(observation, sender, runId) {
    const tabId = sender.tab?.id;
    if (tabId == null || !bgProxiesState.Xn(sender.frameId))
      return { ok: false, error: "只能从学习标签页的顶层页面读取用户 ID" };
    const session = await bgPlatformState.n.get(bgLearningState.a(tabId), null);
    if (!session || session.runId !== runId) return { ok: false, error: "学习会话已结束" };
    if (!await Fm(session, sender))
      return { ok: false, error: "用户 ID 来自本站之外的页面，已忽略" };
    const account = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find(
      (item) => item.id === session.accountId
    );
    if (!account || account.siteId !== session.siteId)
      return { ok: false, error: "学习目标账号归属已改变" };
    const identity = observation?.identity;
    if (identity?.source !== "visible" || typeof identity.userId !== "string" || !/^\d{1,12}$/.test(identity.userId))
      return { ok: true, ignored: true };
    let currentPath;
    try {
      const url = new URL(sender.url ?? sender.tab.url);
      currentPath = url.pathname + url.hash;
    } catch {
      return { ok: true, ignored: true };
    }
    if (observation.path !== currentPath || currentPath.length > 500)
      return { ok: true, ignored: true };
    const login = [...session.events].reverse().find(
      (event) => event.loginAction === "submit" || event.loginAction === "oauth" || event.type === "fill" && event.fieldRole === "password" && event.key === "Enter"
    );
    if (!login && account.identity?.userId !== identity.userId) return { ok: true, ignored: true };
    if (login && Ff(login.path) === Ff(currentPath)) return { ok: true, ignored: true };
    const previous = session.learnedIdentities?.[currentPath];
    const clean = { userId: identity.userId, source: "visible", verifiedByLearning: true };
    for (const field of ["username", "email"])
      if (typeof identity[field] === "string" && identity[field].trim() && identity[field].length <= 160)
        clean[field] = identity[field].trim();
    const value = {
      identity: clean,
      loginAt: login?.at,
      conflict: previous?.conflict === true || !!previous && previous.identity.userId !== clean.userId
    };
    await bgPlatformState.n.set(bgLearningState.a(tabId), {
      ...session,
      learnedIdentities: { ...session.learnedIdentities, [currentPath]: value }
    });
    return { ok: true };
  }
  async function prepareLearnedAccountIdentity(session, account, site, workflow) {
    if (!workflow?.identityPath) return null;
    const url = new URL(workflow.identityPath, site.loginUrl);
    if (!bgCheckinState.N(site, url.href)) throw Error("学习的身份核验页不在本站");
    const sample = session.learnedIdentities?.[url.pathname + url.hash];
    if (!sample) return null;
    if (sample.conflict) throw Error("学习期间身份核验页出现过不同用户 ID，请确认目标账号后重新学习");
    const identity = sample.identity;
    const accounts = await bgPlatformState.t.get(bgPlatformState.r.accounts, []), sites = await bgPlatformState.t.get(bgPlatformState.r.sites, []);
    const current = accounts.find((item) => item.id === account.id);
    if (!current || current.siteId !== site.id) throw Error("学习目标账号归属已改变");
    if (current.identity?.userId && current.identity.userId !== identity.userId)
      throw Error("学习页用户 ID 与本账号原有绑定不符，已保留原绑定，请确认当前登录账号");
    const conflict = Kp(accounts, sites, site).find(
      (item) => item.id !== account.id && item.identity?.userId === identity.userId
    );
    if (conflict) throw Error("学习页用户 ID 已绑定给本站其他账号，已保留原有账号数据");
    return identity;
  }
  async function Im(e2, i, o = {}) {
    let s = await bgProxiesState.Mm(e2);
    if (!s) {
      let n = await bgPlatformState.t.get(bgPlatformState.r.accounts, []), a = n.find((t) => t.id === e2);
      if (!a) return { ok: false, error: `账号不存在` };
      let o2 = Of(Object.entries(await chrome.storage.session.get(null))).active, s2 = Df(o2, { accountId: e2, siteId: a.siteId, kind: i });
      if (!s2.allowed) {
        let e3 = n.find((e4) => e4.id === s2.conflict.accountId);
        return {
          ok: false,
          error: `本站账号「${e3?.label || e3?.username || s2.conflict.accountId}」正在学习${Yp(s2.conflict.kind ?? `checkin`)}流程；同站点只能有一条录制，请先结束或放弃那条学习`
        };
      }
    }
    if (s) {
      let c2 = s.kind ?? `checkin`, l3 = c2 === `login` ? `login` : `both`;
      if (i && i !== c2 && (i !== `both` || c2 !== `checkin`))
        return {
          ok: false,
          error: `该账号正在进行${c2 === `login` ? `登录` : `登录与签到`}学习，请先结束或放弃当前学习`
        };
      let u2 = await bgPlatformState.t.get(bgPlatformState.r.accounts, []), d2 = u2.find((t) => t.id === e2), f2 = await bgPlatformState.t.get(bgPlatformState.r.sites, []), p2 = d2 ? bgSitesState.Y(s.siteId, f2) : void 0;
      if (!d2 || !p2) return { ok: false, error: `学习目标账号或站点不存在` };
      if (d2.siteId !== s.siteId)
        return { ok: false, error: `学习账号已移到其他站点，本次录制不能写入其他站点的流程` };
      let m2 = await zm(s.tabId, s.runId);
      if (!m2.ok) return { ok: false, error: m2.error ?? `学习动作尚未保存，请返回学习标签页后重试` };
      let h2 = m2.challengeSeen === true, _2 = s.tabId, v2 = s.runId, y2 = await bgLearningState.qp.run(async () => {
        let e3 = await bgPlatformState.n.get(bgLearningState.a(_2), null);
        if (!e3 || e3.runId !== v2) return null;
        let t = { ...e3, challengeSeen: h2 };
        return await bgPlatformState.n.set(bgLearningState.a(_2), t), t;
      });
      if (!y2) return { ok: false, error: `学习会话已结束，请重新开始` };
      s = y2;
      let b = o.loginAsCheckin === true, configuredLoginAsCheckin = p2.checkin?.method === `none`, S = b || configuredLoginAsCheckin;
      if (b && l3 === `login`)
        return {
          ok: false,
          error: `本次只学登录，不产出签到流程；「登录即签到」请用「学习本站流程」完成`
        };
      if (b && !ed(s.events, c2))
        return {
          ok: false,
          error: `还不能按「登录即签到」保存：需要先登录成功并进入站内页面，且本次演示没有点到过签到按钮。请继续演示（或点「结束学习」按现有内容保存）`
        };
      let C = Jp(d2), w = vf(p2, s.events, l3, { loginAsCheckin: S, personalTexts: C }), T = w.checkin?.kind === `login-as-checkin` ? _f(p2, s.events, { personalTexts: C })?.workflow ?? null : null, E = s.endLearningPrompted === true, D = bf({
        intent: l3,
        loginAsCheckinRequested: b,
        artifacts: w,
        loginAsCheckinPossible: ed(s.events, c2),
        alreadyPrompted: E
      }) ? bgLearningState.xf : Sf({
        intent: l3,
        artifacts: w,
        checkinEvidence: $u(s.events, c2).checkin,
        alreadyPrompted: E
      }) ? bgLearningState.Cf : null;
      if (D)
        return await bgLearningState.qp.run(async () => {
          let e3 = await bgPlatformState.n.get(bgLearningState.a(_2), null);
          return !e3 || e3.runId !== v2 ? false : (await bgPlatformState.n.set(bgLearningState.a(_2), { ...e3, endLearningPrompted: true }), true);
        }) ? { ok: false, error: D } : { ok: false, error: `学习会话已结束，请重新开始` };
      let learnedIdentity;
      try {
        learnedIdentity = await prepareLearnedAccountIdentity(s, d2, p2, w.checkin?.workflow ?? T);
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) };
      }
      let O, k = [], A = [], ee = [...w.notices];
      let te = [], ne = (e3) => {
        let [t] = bgCheckinState.Et(e3);
        return t !== void 0 && (te.push(t), true);
      }, re = p2;
      for (let e3 of (m2.unlearnedNotes ?? []).slice(0, 4)) ee.push(e3);
      if (w.login) {
        let e3 = w.login, n = ip(e3, p2);
        if (!ne({ ...p2, ...n })) {
          try {
            await bgSitesState.store.updateSite(p2.id, n);
          } catch (e4) {
            A.push(e4 instanceof Error ? e4.message : String(e4));
          }
          if (A.length === 0) {
            let n2 = bgSitesState.Y(p2.id, await bgPlatformState.t.get(bgPlatformState.r.sites, [])), i2 = sp(e3, n2);
            i2.ok ? (k.push(`login`), n2 && (re = n2)) : A.push(i2.error);
          }
        }
      }
      if (w.checkin?.kind === `login-as-checkin` && A.length === 0) {
        const existing = configuredLoginAsCheckin ? p2.checkin : {};
        const source = b ? `explicit` : existing.learnedLoginAsCheckinSource;
        let e3 = {
          checkin: {
            ...existing,
            method: `none`,
            learnedLoginAsCheckin: true,
            ...source ? { learnedLoginAsCheckinSource: source } : {},
            ...T ? {
              workflow: {
                steps: [],
                route: T.route,
                ...T.identityPath ? { identityPath: T.identityPath } : {}
              }
            } : {}
          }
        };
        if (!ne({ ...re, ...e3 })) {
          try {
            await bgSitesState.store.updateSite(p2.id, e3);
          } catch (e4) {
            A.push(e4 instanceof Error ? e4.message : String(e4));
          }
          if (A.length === 0) {
            let e4 = bgSitesState.Y(p2.id, await bgPlatformState.t.get(bgPlatformState.r.sites, [])), n = Af(e4?.checkin);
            n.ok ? !e4 || !bgSitesState.se(e4) ? A.push(`学到的「登录即签到」写入后被站点默认配置覆盖，请重试`) : (k.push(`checkin`), O = `login-as-checkin`, re = e4) : A.push(n.error);
          }
        }
      } else if (w.checkin?.kind === `workflow` && A.length === 0 && bgSitesState.ue(p2) && $u(s.events, c2).checkin === `none`)
        ee.push(`本次未录到签到或抽奖动作，保留原有专用流程；已录到的登录配置照常更新`);
      else if (w.checkin?.kind === `workflow` && A.length === 0) {
        let e3 = { workflow: w.checkin.workflow };
        if (!e3.workflow.identityPath)
          A.push(
            `这次演示里没有点到真正的签到按钮（当天已签到、按钮已变成「已签到」时也会这样）。请在按钮可点时重新演示：先登录 → 进入能看到当前账号的页面 → 点击「立即签到」→ 再点「结束学习」；已经签到的当天无法学习签到流程`
          );
        else {
          let n = bgCheckinState.st(p2, e3.workflow);
          if (n.length > 0) A.push(`学到的流程未通过校验：${n[0]}`);
          else {
            let {
              entry: n2,
              url: i2,
              learnedLoginAsCheckin: a,
              learnedLoginAsCheckinSource: o2,
              ...s2
            } = p2.checkin ?? {}, c3 = {
              checkin: {
                ...s2,
                method: `workflow`,
                workflow: e3.workflow,
                workflowReplayDisabled: false
              }
            };
            if (!ne({ ...re, ...c3 })) {
              try {
                await bgSitesState.store.updateSite(p2.id, c3);
              } catch (e4) {
                A.push(e4 instanceof Error ? e4.message : String(e4));
              }
              if (A.length === 0) {
                let n3 = bgSitesState.Y(
                  p2.id,
                  await bgPlatformState.t.get(bgPlatformState.r.sites, [])
                ), i3 = jf(e3.workflow, n3?.checkin);
                i3.ok ? (k.push(`checkin`), O = `workflow`, n3 && (re = n3)) : A.push(i3.error);
              }
            }
          }
        }
      }
      if (k.includes(`checkin`))
        ee.push(
          `已更新本站共用签到流程：本站现有和以后新增的账号都使用这一版；每个账号用自己的凭据登录并确认身份，无需逐个重新学习，其他站点保持各自的流程`
        );
      if (k.length && A.length === 0 && learnedIdentity)
        try {
          await bgAccountsState.store.saveAccountIdentity(d2.id, learnedIdentity, {
            preserveBinding: true
          });
          ee.push(
            `已将本账号绑定到本站用户 ID ${learnedIdentity.userId}，以后按 ID 核验，备注仅用于显示`
          );
        } catch (error) {
          A.push(error instanceof Error ? error.message : String(error));
        }
      let ie = up({ saved: k, notices: ee, failures: A, siteConfigBlockers: te });
      if (!ie.ok) return { ok: false, error: ie.error };
      let ae2 = ie.notices;
      await Vm(s), bgPlatformState.$();
      let j = [...ae2, ...h2 ? [bgLearningState.Xp] : []];
      return {
        ok: true,
        feature: {
          learning: {
            active: false,
            eventCount: s.events.length,
            tabId: s.tabId,
            saved: true,
            kind: k.includes(`checkin`) ? `checkin` : `login`,
            savedKinds: k,
            intent: l3 === `login` ? `login` : `both`,
            ...O ? { checkinSavedAs: O } : {},
            ...ed(s.events, c2) ? { loginAsCheckinAvailable: true } : {},
            ...j.length ? { warnings: j } : {},
            report: (() => {
              let e3 = Ap(s.events, c2, {
                loginAsCheckin: O === `login-as-checkin`,
                hasStoredLoginConfig: Ep(re, d2.loginMethod),
                siteCheckinMethod: re.checkin?.method,
                saveFailed: A.length > 0
              });
              return { verdict: e3.verdict, lines: e3.lines };
            })()
          }
        }
      };
    }
    let c = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find((t) => t.id === e2);
    if (!c) return { ok: false, error: `账号不存在` };
    let l2 = await bgPlatformState.t.get(bgPlatformState.r.sites, []), u = bgSitesState.Y(c.siteId, l2);
    if (!u) return { ok: false, error: `站点配置不存在` };
    if ((await bgCheckinState.Z.active())?.accountId === e2)
      return { ok: false, error: `该账号正在签到，请先停止任务` };
    let d = bgCheckinState.wh(u), f = await bgCheckinState.Eh(u);
    if (f != null) {
      let e3 = await bgCheckinState.Oh(c, u);
      e3.ok && bgProxiesState.Zo(e3.proxy, await bgProxiesState.we()) || (f = void 0);
    }
    let p = await bgCheckinState.Oh(c, u);
    if (!p.ok) return { ok: false, error: p.error };
    if (await bgCheckinState.Z.busy())
      return {
        ok: false,
        error: `有签到任务正在执行或排队，请等它完成后再开始学习（学习与签到不能同时使用代理）`
      };
    if (p.proxy) {
      let { active: e3 } = Of(Object.entries(await chrome.storage.session.get(null)));
      if (e3.length > 0)
        return { ok: false, error: `已有账号正在学习流程；学习会话之间不能互相打断，请先结束那一条` };
    }
    let m = f;
    if (m == null) {
      let e3 = await chrome.tabs.create({ url: `about:blank`, active: true }).catch(() => null);
      if (!e3 || e3.id == null) return { ok: false, error: `无法打开学习标签页` };
      m = e3.id;
    }
    let h = false;
    if (p.proxy) {
      if (!await bgProxiesState.W.acquire(m, p.proxy).catch(() => false))
        return f ?? await bgCheckinState.Pp(m).catch(() => {
        }), { ok: false, error: `代理正被其他任务占用，请等它完成后再开始学习` };
      h = true;
    }
    let g = bgProxiesState.Qo(p.proxy, await bgProxiesState.we());
    if (g)
      return await bgPlatformState.n.remove(bgLearningState.a(m)).catch(() => {
      }), h && await bgProxiesState.W.release(m).catch(() => {
      }), f ?? await bgCheckinState.Pp(m).catch(() => {
      }), { ok: false, error: g };
    if (f == null)
      try {
        await bgCheckinState.kh(m, d);
      } catch (e3) {
        return await bgPlatformState.n.remove(bgLearningState.a(m)).catch(() => {
        }), await bgProxiesState.W.release(m).catch(() => {
        }), await bgCheckinState.Pp(m).catch(() => {
        }), { ok: false, error: `学习页面加载失败：${e3 instanceof Error ? e3.message : String(e3)}` };
      }
    let _ = {
      runId: bgPlatformState.Ti(`learn`),
      accountId: e2,
      siteId: u.id,
      kind: i ?? `checkin`,
      tabId: m,
      createdAt: Date.now(),
      events: [],
      personalTexts: Jp(c)
    };
    await bgPlatformState.n.set(bgLearningState.a(m), _), await chrome.tabs.update(m, { active: true }).catch(() => {
    });
    let v = np(u), y = false;
    for (let e3 = 0; e3 < 50 && !y; e3 += 1) {
      try {
        rp((await chrome.tabs.get(m)).url, v) && (y = (await chrome.tabs.sendMessage(m, { type: `LEARN_MODE`, learning: _ }, { frameId: 0 }))?.ok === true);
      } catch {
      }
      y || await new Promise((e4) => setTimeout(e4, 150));
    }
    return y && await Rm(m, _, v), y ? {
      ok: true,
      feature: { learning: { active: true, eventCount: 0, tabId: m, kind: i ?? `checkin` } }
    } : (await Vm(_), { ok: false, error: `学习页面尚未准备好，未开始录制；请等待页面加载完成后重试` });
  }
  async function Lm(e2, t) {
    try {
      let n = await chrome.webNavigation.getAllFrames({ tabId: e2 });
      if (!n) return;
      let r = /* @__PURE__ */ new Set([0]);
      for (let e3 of n) e3.frameId != null && (t == null || rp(e3.url, t)) && r.add(e3.frameId);
      return [...r];
    } catch {
      return;
    }
  }
  async function Rm(e2, t, n) {
    let r = await Lm(e2, n);
    if (!r)
      return (await chrome.tabs.sendMessage(e2, { type: `LEARN_MODE`, learning: t }).catch(() => void 0))?.ok === true;
    let i = false;
    for (let n2 of r)
      (await chrome.tabs.sendMessage(e2, { type: `LEARN_MODE`, learning: t }, { frameId: n2 }).catch(() => void 0))?.ok === true && (i = true);
    return i;
  }
  async function zm(e2, t) {
    let n = await chrome.tabs.sendMessage(e2, { type: `FLUSH_LEARNING`, runId: t }, { frameId: 0 }).catch(() => ({
      ok: false,
      error: `无法确认学习页面的末尾动作已保存，请保持学习标签页打开后重试`
    }));
    if (n?.ok !== true)
      return {
        ok: false,
        error: n?.error ?? `无法确认学习页面的末尾动作已保存，请保持学习标签页打开后重试`,
        checkinControlSeen: void 0
      };
    let r = new Set(
      Array.isArray(n.unlearnedNotes) ? n.unlearnedNotes.filter((e3) => typeof e3 == `string`) : []
    ), i = await chrome.webNavigation.getAllFrames({ tabId: e2 }).catch(() => null), a = typeof n.checkinControlSeen == `boolean` ? n.checkinControlSeen : void 0, o = (() => {
      let e3 = i?.find((e4) => e4.frameId === 0)?.url;
      if (!e3) return null;
      try {
        return new URL(e3).origin;
      } catch {
        return null;
      }
    })();
    if (i)
      for (let n2 of i) {
        if (n2.frameId == null || n2.frameId === 0) continue;
        let i2 = await chrome.tabs.sendMessage(e2, { type: `FLUSH_LEARNING`, runId: t }, { frameId: n2.frameId }).catch(() => void 0);
        if (Array.isArray(i2?.unlearnedNotes))
          for (let e3 of i2.unlearnedNotes) typeof e3 == `string` && r.add(e3);
        if (i2?.inactive === true) continue;
        let s = typeof i2?.checkinControlSeen == `boolean` ? i2.checkinControlSeen : void 0;
        s === true ? a = true : s === void 0 && a !== true && (o == null || (() => {
          try {
            return new URL(n2.url).origin === o;
          } catch {
            return true;
          }
        })()) && (a = void 0);
      }
    return {
      ok: true,
      challengeSeen: n.challengeSeen === true,
      checkinControlSeen: a,
      unlearnedNotes: [...r].slice(0, 8)
    };
  }
  async function Bm(e2) {
    await Rm(e2, null, null);
  }
  async function Vm(e2) {
    await Bm(e2.tabId), await bgLearningState.qp.run(async () => {
      (await bgPlatformState.n.get(bgLearningState.a(e2.tabId), null))?.runId === e2.runId && await bgPlatformState.n.remove(bgLearningState.a(e2.tabId));
    }), await bgProxiesState.W.release(e2.tabId).catch(() => {
    });
  }
  async function Hm() {
    let { active: e2, expired: t } = Of(Object.entries(await chrome.storage.session.get(null)));
    for (let e3 of t) await bgCheckinState.Em(e3);
    return {
      ok: true,
      feature: {
        learningSessions: e2.map((e3) => ({
          accountId: e3.accountId,
          tabId: e3.tabId,
          eventCount: e3.events.length,
          kind: e3.kind ?? `checkin`,
          active: true,
          guide: ld($u(e3.events, e3.kind ?? `checkin`)),
          ...ed(e3.events, e3.kind ?? `checkin`) ? { loginAsCheckinAvailable: true } : {},
          ...e3.preview ? { preview: e3.preview } : {}
        }))
      }
    };
  }
  async function Um(e2) {
    let t = await bgProxiesState.Mm(e2);
    return t ? (await Vm(t), bgPlatformState.$(), { ok: true, feature: { learning: { active: false, eventCount: 0, tabId: t.tabId } } }) : { ok: false, error: `该账号当前没有在进行的签到学习` };
  }
  async function Wm(e2, t, r) {
    let i = t.tab?.id;
    if (i == null) return { ok: false, error: `学习事件缺少顶层标签页` };
    let o = await bgPlatformState.n.get(bgLearningState.a(i), null);
    if (!o || o.runId !== r) return { ok: false, error: `学习会话已结束` };
    if (!await Fm(o, t)) return { ok: false, error: `学习事件来自本站之外的页面，已忽略` };
    let s = Uf(e2);
    if (!s) return { ok: false, error: `学习事件格式无效` };
    let c = Mf(o, s);
    if (!c.ok) return c.expired && await bgCheckinState.Em(o), { ok: false, error: c.error };
    let l2;
    try {
      l2 = nr(c.learning.events);
    } catch {
    }
    let u = l2 ? { ...c.learning, preview: l2 } : c.learning;
    return await bgPlatformState.n.set(bgLearningState.a(i), u), {
      ok: true,
      feature: {
        learning: {
          active: true,
          eventCount: c.learning.events.length,
          tabId: i,
          ...l2 ? { preview: l2 } : {}
        }
      }
    };
  }
  Object.assign(bgLearningState, {
    Qn,
    $n,
    er,
    tr,
    nr,
    bu,
    xu,
    Su,
    Cu,
    wu,
    Eu,
    Du,
    Ou,
    ku,
    Au,
    Iu,
    Hu,
    Uu,
    Wu,
    Gu,
    Ku,
    qu,
    Ju,
    Yu,
    Zu,
    Qu,
    $u,
    ed,
    cd,
    ld,
    Id,
    Ld,
    Rd,
    zd,
    Bd,
    Vd,
    Hd,
    Ud,
    Wd,
    Gd,
    Kd,
    qd,
    Jd,
    Yd,
    J,
    Zd,
    Qd,
    $d,
    ef,
    tf,
    nf,
    rf,
    of,
    sf,
    cf,
    lf,
    uf,
    df,
    ff,
    pf,
    hf,
    gf,
    _f,
    vf,
    yf,
    bf,
    Sf,
    wf,
    Tf,
    Ef,
    Df,
    Of,
    kf,
    Af,
    jf,
    Mf,
    Nf,
    Pf,
    Ff,
    If,
    Lf,
    Rf,
    Bf,
    Vf,
    Hf,
    Uf,
    Wf,
    Zf,
    Qf,
    tp,
    np,
    rp,
    ip,
    sp,
    cp,
    lp,
    up,
    mp,
    hp,
    gp,
    _p,
    vp,
    yp,
    bp,
    xp,
    Ep,
    Dp,
    Ap,
    jp,
    Mp,
    Kp,
    Jp,
    Yp,
    Pm,
    Fm,
    recordLearningIdentity,
    prepareLearnedAccountIdentity,
    Im,
    Lm,
    Rm,
    zm,
    Bm,
    Vm,
    Hm,
    Um,
    Wm
  });
  async function handleLearningMessage(e2, i) {
    switch (e2.type) {
      case `TOGGLE_LEARNING`:
        return bgEntryState.Q(i) ? bgPlatformState.X(async () => {
          try {
            return await Im(e2.accountId, e2.kind, { loginAsCheckin: e2.loginAsCheckin === true });
          } finally {
            let t = await bgProxiesState.Mm(e2.accountId);
            t && await Rm(t.tabId, t, await Pm(t));
          }
        }) : { ok: false, error: `仅扩展管理页可以操作学习流程` };
      case `LEARN_EVENT`:
        return bgLearningState.qp.run(() => Wm(e2.event, i, e2.runId));
      case `LEARN_IDENTITY`:
        return bgLearningState.qp.run(() => recordLearningIdentity(e2.observation, i, e2.runId));
      case `GET_LEARNING`:
        return bgEntryState.Q(i) ? Hm() : { ok: false, error: `仅扩展管理页可以查看学习状态` };
      case `CANCEL_LEARNING`:
        return bgEntryState.Q(i) ? bgPlatformState.X(() => Um(e2.accountId)) : { ok: false, error: `仅扩展管理页可以取消学习` };
    }
  }
  function initializeBackgroundLearning(step) {
    switch (step) {
      case 4: {
        bgLearningState.a = (e2) => `learn:${e2}`;
        break;
      }
      case 74: {
        bgLearningState.Zn = 20;
        break;
      }
      case 224: {
        bgLearningState.Tu = /^\/[a-z]{2}(?:[-_][a-z]{2})?(?=\/)/i;
        break;
      }
      case 225: {
        bgLearningState.ju = /(?:^|\/)(?:login|log-in|signin|sign-in|signup|sign-up|register|oauth|authorize|auth|password|reset|forgot)(?:\/|$)/i;
        break;
      }
      case 226: {
        bgLearningState.Mu = /(?:^|\/)(?:logout|log-out|signout|sign-out)(?:\/|$)/i;
        break;
      }
      case 227: {
        bgLearningState.Nu = /(?:^|\/)(?:profile|personal|account|user|me)\/?$/i;
        break;
      }
      case 228: {
        bgLearningState.Pu = /(?:^|\/)(?:settings?|preferences?|config|billing|payments?|invoices?|subscription|plans?|pricing|orders?|usage|logs?|tokens?|keys?|api-?keys?|security|passwords?|passkeys?|2fa|mfa|notifications?|invites?|affiliate|referrals?)(?:\/|$)/i;
        break;
      }
      case 229: {
        bgLearningState.Fu = /(?:^|\/)(?:check-?in|daily|rewards?|claim|points|lottery|draw|prize)(?:\/|$)/i;
        break;
      }
      case 230: {
        bgLearningState.Lu = bgCheckinState.xs(
          /^(?:退出登录|退出账号|退出|登出|注销|log\s?out|sign\s?out|logout)$/i
        );
        break;
      }
      case 231: {
        bgLearningState.Ru = bgCheckinState.xs(
          /(?:签到|打卡|领取|抽奖|抽签|翻牌|check[\s-]?in|daily|claim|redeem|\b(?:start\s+)?draw\b)/i
        );
        break;
      }
      case 232: {
        bgLearningState.zu = bgCheckinState.xs(
          /个人(?:资料|信息|中心)|账户信息|账号信息|我的(?:账户|账号|资料|信息)|控制台|首页|设置|偏好|仪表盘|退出|登出|profile|personal|account|dashboard|console|preferences?|logout|log\s?out/i
        );
        break;
      }
      case 233: {
        bgLearningState.Bu = bgCheckinState.xs(/已签到|今日已|已经签到/);
        break;
      }
      case 234: {
        bgLearningState.Vu = bgCheckinState.xs(/签到成功|打卡成功|领取成功/);
        break;
      }
      case 235: {
        bgLearningState.Xu = { none: 0, action: 1, confirmed: 2, already: 3 };
        break;
      }
      case 236: {
        bgLearningState.td = [`①`, `②`, `③`, `④`];
        break;
      }
      case 237: {
        bgLearningState.nd = [`登录`, `账号页`, `签到`, `结束`];
        break;
      }
      case 238: {
        bgLearningState.rd = [`登录`, `结束`];
        break;
      }
      case 239: {
        bgLearningState.id = `检测到这次演示点了「退出登录」：会话已经断开，请重新登录后再继续演示（这段演示不建议保存）`;
        break;
      }
      case 240: {
        bgLearningState.ad = {
          login: `在打开的站点上手动登录；全程不要点「退出登录」`,
          profile: `先经过能显示当前账号的页面（如「个人资料 / 我的账户」），再进签到页`,
          checkin: `点一次真正的签到/领取按钮；当天已经签过的站点学不到签到流程`,
          done: `回到扩展里点「结束学习」保存`
        };
        break;
      }
      case 241: {
        bgLearningState.od = `若本站是「登录即签到」（登录成功后自动完成、页面上没有签到按钮），回扩展里点「登录即签到」即可保存完整流程`;
        break;
      }
      case 242: {
        bgLearningState.sd = {
          login: `手动完成一次登录（填好账号密码并提交，或点第三方登录），全程不要点「退出登录」`,
          profile: bgLearningState.ad.profile,
          checkin: bgLearningState.ad.checkin,
          done: `回到扩展里点「结束学习」保存`
        };
        break;
      }
      case 253: {
        bgLearningState.gd = 250;
        break;
      }
      case 254: {
        bgLearningState._d = 1e6;
        break;
      }
      case 255: {
        bgLearningState.vd = `scrollIntoView`;
        break;
      }
      case 256: {
        bgLearningState.yd = 12;
        break;
      }
      case 257: {
        bgLearningState.bd = 30;
        break;
      }
      case 258: {
        bgLearningState.xd = 3;
        break;
      }
      case 259: {
        bgLearningState.Sd = bgCheckinState.xs(
          /签到|打卡|领取|奖励|福利|抽奖|抽签|翻牌|check[\s-]?in|claim|attendance|daily|\b(?:start\s+)?draw\b/i
        );
        break;
      }
      case 260: {
        bgLearningState.Cd = /(?:^|\/)(?:check-?in|daily-check-?in|sign-?in|attendance|rewards?|benefit|lottery|draw|prize)(?:\/|$)/i;
        break;
      }
      case 261: {
        bgLearningState.wd = bgCheckinState.xs(
          /个人资料|个人信息|账户信息|账号信息|我的(?:账户|账号|资料)|profile|my\s+account|account\s+(?:settings|info|details)|user\s+center/i
        );
        break;
      }
      case 262: {
        bgLearningState.Td = /(?:^|\/)(?:profile|personal|account|user|me)(?:\/|$)/i;
        break;
      }
      case 263: {
        bgLearningState.Ed = /(?:^|\/)(?:settings?|preferences?|config|billing|payments?|invoices?|subscription|plans?|pricing|orders?|usage|logs?|tokens?|keys?|api-?keys?|security|passwords?|passkeys?|2fa|mfa|notifications?|invites?|affiliate|referrals?)(?:\/|$)/i;
        break;
      }
      case 264: {
        bgLearningState.Dd = bgCheckinState.xs(
          /个人(?:资料|信息|中心)|账户信息|账号信息|我的(?:账户|账号|资料|信息)|控制台|首页|设置|偏好|仪表盘|退出|登出|profile|personal|account|dashboard|console|preferences?|logout|log\s?out/i
        );
        break;
      }
      case 265: {
        bgLearningState.Od = [...bgCheckinState.Cs, ...bgCheckinState.Ts];
        break;
      }
      case 266: {
        bgLearningState.kd = [...bgCheckinState.ws, ...bgCheckinState.Es];
        break;
      }
      case 267: {
        bgLearningState.Ad = [
          `领取失败`,
          `签到失败`,
          `操作失败`,
          `请稍后重试`,
          `系统繁忙`,
          `check-in failed`
        ];
        break;
      }
      case 268: {
        bgLearningState.jd = [
          `请完成验证`,
          `人机验证`,
          `验证码`,
          `请先登录`,
          `登录已过期`,
          `verify you are human`
        ];
        break;
      }
      case 269: {
        [...bgLearningState.kd, ...bgLearningState.Od, ...bgLearningState.Ad, ...bgLearningState.jd];
        break;
      }
      case 270: {
        bgLearningState.Md = /(?:^|\/)(?:login|log-in|signin|sign-in|signup|sign-up|register|oauth|authorize|auth|logout)(?:\/|$|\?)/i;
        break;
      }
      case 271: {
        bgLearningState.Nd = /password|passwd|pwd|token|secret|captcha|otp|验证码|密码/i;
        break;
      }
      case 272: {
        bgLearningState.Pd = /^(?:登录|登出|退出|退出登录|注销|注册|立即登录|去登录|免费注册|sign\s?in|sign\s?up|log\s?in|log\s?out|logout|oauth|github|google|passkey)$/i;
        break;
      }
      case 273: {
        bgLearningState.Fd = /(?:^#|[?&])(?:access[_-]?token|refresh[_-]?token|id[_-]?token|token|code|state|secret|password|credential|session|auth)=/i;
        break;
      }
      case 274: {
        bgLearningState.Xd = /(?:^|\/)(?:sign-?in|sign-?up|log-?in|log-?out|logout|register|auth|oauth|authorize|password|reset|forgot)(?:\/|$)/i;
        break;
      }
      case 275: {
        bgLearningState.af = /(?:^|\/)(?:profile|personal|account|user|me)\/?$/i;
        break;
      }
      case 276: {
        bgLearningState.mf = 3;
        break;
      }
      case 277: {
        bgLearningState.xf = `这次演示登录成功了，但没有录到签到动作。若本站登录成功就算签到（页面上没有签到按钮），请点账号行的「登录即签到（没有签到按钮）」保存；若本站有签到按钮，请在原页面点一次签到后再点「结束学习」。本次学习还在继续；确认只保存登录配置的话，再点一次「结束学习」`;
        break;
      }
      case 278: {
        bgLearningState.Cf = `这次演示没有录到签到动作（没有点到签到/领取按钮），保存后自动签到会回放刚才的点击，可能并不会签到。若本站登录成功就算签到：请先放弃本次学习，在站点上退出登录后重新开始学习并完成一次登录；若刚才点的就是签到按钮（文案比较特别），再点一次「结束学习」即按回放流程保存`;
        break;
      }
      case 279: {
        bgLearningState.zf = /* @__PURE__ */ new Set([
          `Enter`,
          `Space`,
          `Escape`,
          `Tab`,
          `ArrowUp`,
          `ArrowDown`,
          `ArrowLeft`,
          `ArrowRight`
        ]);
        break;
      }
      case 280: {
        bgLearningState.Gf = /^[A-Za-z][A-Za-z0-9_-]{0,80}$/;
        break;
      }
      case 281: {
        bgLearningState.Kf = /(?:^|[-_])_r_[0-9a-z]{1,4}_(?:$|[-_])/i;
        break;
      }
      case 282: {
        bgLearningState.qf = /^(?:radix|base-?ui)-/i;
        break;
      }
      case 283: {
        bgLearningState.Jf = /(?:^|[-_])(?:react-select|downshift)-\d+(?:[-_]|$)/i;
        break;
      }
      case 284: {
        bgLearningState.Yf = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        break;
      }
      case 285: {
        bgLearningState.Xf = 8;
        break;
      }
      case 286: {
        bgLearningState.$f = /(?:^|[\s>+~,(])#([^\s>+~,[\]]+)/g;
        break;
      }
      case 287: {
        bgLearningState.ep = /^[#.]?:r[0-9a-z]+:$/i;
        break;
      }
      case 288: {
        bgLearningState.dp = /^(?:\u26A0\uFE0F|\u2139\uFE0F|\u274C|\u26A0|\u2139)\s*/u;
        break;
      }
      case 289: {
        bgLearningState.fp = [...bgCheckinState.Cs, ...bgCheckinState.Ts];
        break;
      }
      case 290: {
        bgLearningState.pp = [...bgCheckinState.ws, ...bgCheckinState.Es];
        break;
      }
      case 291: {
        bgLearningState.Sp = `✅ 已按「登录即签到」学会：本站登录成功后即算签到，不需要点签到按钮`;
        break;
      }
      case 292: {
        bgLearningState.Cp = `❌ 「登录即签到」未保存：没有录到登录配置`;
        break;
      }
      case 293: {
        bgLearningState.wp = `⚠️ 「登录即签到」未保存：已录到登录配置，但没有确认成功进入站内页面`;
        break;
      }
      case 294: {
        bgLearningState.Tp = `⚠️ 已按「登录即签到」保存：本次没录到登录动作（可能打开时已登录）；运行时若已登录，无法证明本轮登录拿到奖励，会停在「需处理」而不记成功；要每轮强制退出重登，请把本站签到方式改成「退出再登录」`;
        break;
      }
      case 295: {
        bgLearningState.Op = `ℹ️ 若本站是「登录即签到」（登录成功后自动完成、页面上没有签到按钮）：开始学习并完成登录后，在账号行点「登录即签到」即可保存完整流程`;
        break;
      }
      case 296: {
        bgLearningState.kp = `✅ 本站签到方式为「登录即签到」：登录成功即算完成，页面上没有签到按钮属于正常情况`;
        break;
      }
      case 303: {
        bgLearningState.qp = bgProxiesState.Yn();
        break;
      }
      case 304: {
        bgLearningState.Xp = `学习过程中出现了验证码/二次验证（OTP）字段。按隐私设计，这类字段不会被学习，也不会采集任何内容；自动回放时需要你在页面上人工完成这一步。`;
        break;
      }
      case 316: {
        bgLearningState.Nm = /* @__PURE__ */ new Map();
        break;
      }
    }
  }
  var learningService = Object.freeze({
    toggle: (...args) => Im(...args),
    cancel: (...args) => Um(...args),
    getState: (...args) => Hm(...args),
    recordEvent: (...args) => Wm(...args),
    recordIdentity: (...args) => recordLearningIdentity(...args),
    handleMessage: handleLearningMessage
  });

  // src/modules/settings/service.js
  var bgSettingsState = { store: {} };
  async function Ie(e2) {
    if (!chrome.sidePanel?.setPanelBehavior)
      throw Error(`当前 Chrome 版本不支持侧边栏启动模式，请升级浏览器`);
    let t = e2 === `sidepanel`;
    if (await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: t }), chrome.sidePanel.getPanelBehavior && (await chrome.sidePanel.getPanelBehavior()).openPanelOnActionClick !== t)
      throw Error(`Chrome 未应用启动模式，请重新加载扩展后重试`);
  }
  function $o(e2) {
    return e2 === `sidepanel` || e2 === `tab`;
  }
  async function es(e2 = bgSettingsState.Fe) {
    let n = await bgPlatformState.t.get(bgPlatformState.r.launchMode, e2);
    return $o(n) ? n : e2;
  }
  async function ts() {
    if (chrome.sidePanel?.getPanelBehavior)
      return (await chrome.sidePanel.getPanelBehavior()).openPanelOnActionClick ? `sidepanel` : `tab`;
  }
  async function ns(e2) {
    await es() !== e2 && await bgPlatformState.t.set(bgPlatformState.r.launchMode, e2);
  }
  async function rs(e2) {
    let t = [];
    try {
      await Ie(e2);
      try {
        await ns(e2);
        return;
      } catch (e3) {
        t.push(e3);
      }
    } catch (e3) {
      t.push(e3);
    }
    try {
      await Ie(await es());
      return;
    } catch (e3) {
      t.push(e3);
    }
    try {
      let e3 = await ts();
      if (e3) {
        await ns(e3);
        return;
      }
    } catch (e3) {
      t.push(e3);
    }
    throw Error(
      `无法恢复启动模式一致性：${t.map((e3) => e3 instanceof Error ? e3.message : String(e3)).join(`；`)}`
    );
  }
  function is() {
    let e2 = 0, n = 0, i = 0, a, o = Promise.resolve();
    function s(e3) {
      let t = o.then(e3, e3);
      return o = t.catch(() => {
      }), t;
    }
    function c(e3) {
      return a?.requestId === e3.requestId && a.sequence === e3.sequence;
    }
    async function l2(e3) {
      let n2 = await es();
      if (c(e3))
        try {
          if (await Ie(e3.mode), !c(e3)) {
            await rs(n2);
            return;
          }
          await bgPlatformState.t.set(bgPlatformState.r.launchMode, e3.mode);
        } catch (e4) {
          try {
            await rs(n2);
          } catch (t) {
            let n3 = e4 instanceof Error ? e4.message : String(e4), r = t instanceof Error ? t.message : String(t);
            throw Error(`${n3}；恢复失败：${r}`);
          }
          throw e4;
        }
    }
    return {
      submit(t, r) {
        let o2 = { mode: t, requestId: r, sequence: ++e2 };
        return a = o2, n += 1, i += 1, s(async () => {
          try {
            c(o2) && await l2(o2);
          } finally {
            --i, i === 0 && a === o2 && (a = void 0);
          }
        });
      },
      sync(e3) {
        let t = n;
        return s(async () => {
          if (i > 0 || t !== n) return;
          let r = await es(e3);
          if (!(i > 0 || t !== n))
            try {
              await Ie(r);
            } catch (e4) {
              try {
                await rs(r);
              } catch (t2) {
                let n2 = e4 instanceof Error ? e4.message : String(e4), r2 = t2 instanceof Error ? t2.message : String(t2);
                throw Error(`${n2}；恢复失败：${r2}`);
              }
              throw e4;
            }
        });
      }
    };
  }
  Object.assign(bgSettingsState, { Ie, $o, es, ts, ns, rs, is });
  async function handleSettingsMessage(e2, i) {
    switch (e2.type) {
      case `SET_LAUNCH_MODE`:
        return await bgSettingsState.Zp.submit(e2.mode, e2.requestId), { ok: true };
      case `TEST_NOTIFY`:
        return { ok: false, error: `通知功能尚未实现，无法发送测试通知` };
    }
  }
  function initializeBackgroundSettings(step) {
    switch (step) {
      case 41: {
        bgSettingsState.Fe = `sidepanel`;
        break;
      }
      case 305: {
        bgSettingsState.Zp = is();
        break;
      }
    }
  }
  var settingsService = Object.freeze({
    getLaunchMode: (...args) => es(...args),
    setLaunchMode: (...args) => bgSettingsState.Zp.submit(...args),
    handleMessage: handleSettingsMessage
  });

  // src/modules/checkin/service.js
  var bgCheckinState = { store: {} };
  function qe(e2) {
    return typeof e2 == `object` && !!e2 && !Array.isArray(e2);
  }
  function Je(e2, t = 0, n = bgCheckinState.Re) {
    return typeof e2 == `number` && Number.isFinite(e2) && e2 >= t && e2 <= n;
  }
  function Ye(e2) {
    return Je(e2, 0, 1);
  }
  function Xe(e2) {
    return typeof e2 == `string` && e2.trim().length > 0 && e2.length <= bgCheckinState.Be;
  }
  function Ze(e2) {
    return Xe(e2) && !e2.includes(`text=`);
  }
  function Qe(e2) {
    let t = e2.trim();
    return /^(?:https?:)?\/\//i.test(t) ? true : /(?:^|[\s,>+~])(?:[a-z0-9-]+\.)+[a-z]{2,}\//i.test(t);
  }
  function $e(e2, t, n) {
    e2.scrollIntoView !== void 0 && typeof e2.scrollIntoView != `boolean` && n.push(`${t}的 scrollIntoView 必须是布尔值`), e2.scrollContainer !== void 0 && (!Ze(e2.scrollContainer) || e2.scrollIntoView !== true) && n.push(`${t}的 scrollContainer 必须是启用滚动定位的 CSS 选择器`);
  }
  function et(e2, t, n, r) {
    let i = e2[t];
    typeof i != `string` || !i.trim() ? r.push(`${n}缺少 ${t}`) : i.length > bgCheckinState.Be ? r.push(`${n}的 ${t} 过长`) : Qe(i) && r.push(`${n}的 ${t} 不能包含跨站地址`);
  }
  function tt(e2, t, n, r) {
    (!qe(e2) || !Ye(e2.rx) || !Ye(e2.ry)) && r.push(`${n}的 ${t} 必须是 rx/ry 均在 0..1 的坐标`);
  }
  function nt(e2, t, n) {
    e2.anchor !== void 0 && tt(e2.anchor, `anchor`, t, n), e2.gesture !== void 0 && (typeof e2.gesture != `string` || !bgCheckinState.Ge.has(e2.gesture)) && n.push(`${t}的 gesture 无效`), e2.key !== void 0 && (typeof e2.key != `string` || !bgCheckinState.We.has(e2.key)) && n.push(`${t}的 key 只允许非打印功能键`);
  }
  function rt(e2, t, n) {
    e2.control !== void 0 && (typeof e2.control != `string` || !bgCheckinState.Ke.has(e2.control)) && n.push(`${t}的 control 无效`), e2.choice !== void 0 && (!Number.isSafeInteger(e2.choice) || e2.choice < 0 || e2.choice > bgCheckinState.He) && n.push(`${t}的 choice 必须是 ${bgCheckinState.He} 以内的非负整数`), e2.checked !== void 0 && typeof e2.checked != `boolean` && n.push(`${t}的 checked 必须是布尔值`);
    let r = typeof e2.control == `string` ? e2.control : void 0;
    e2.choice !== void 0 && r !== `select` && n.push(`${t}的 choice 只能用于 control 为 select 的填写步骤`), e2.checked !== void 0 && r !== `checkbox` && r !== `radio` && n.push(`${t}的 checked 只能用于 control 为 checkbox/radio 的填写步骤`), r === `select` && e2.choice === void 0 && n.push(`${t}的 select 步骤必须指定 choice`), (r === `checkbox` || r === `radio`) && e2.checked === void 0 && n.push(`${t}的 ${r} 步骤必须指定 checked`);
  }
  function it(e2, t) {
    try {
      return new URL(t, e2.loginUrl).origin === new URL(e2.loginUrl).origin;
    } catch {
      return false;
    }
  }
  function at(e2, t) {
    if (t === void 0) return [];
    if (!Array.isArray(t)) return [`工作流学习路线必须是字符串数组`];
    if (t.length > bgCheckinState.Ue) return [`工作流学习路线最多 ${bgCheckinState.Ue} 个页面`];
    let n = [];
    return t.forEach((t2, r) => {
      typeof t2 != `string` || !t2.trim() ? n.push(`工作流学习路线第 ${r + 1} 项必须是非空地址`) : it(e2, t2) || n.push(`工作流学习路线第 ${r + 1} 项必须与登录站点同源`);
    }), n;
  }
  function ot(e2, t, n) {
    if (t === void 0) return [];
    if (typeof t != `string` || !t.trim()) return [`工作流身份核验路径必须是非空字符串`];
    if (t.length > 500) return [`工作流身份核验路径过长`];
    if (!it(e2, t)) return [`工作流身份核验路径必须与登录站点同源`];
    try {
      let r = new URL(t, e2.loginUrl);
      if (r.username || r.password || r.search || /(?:access_token|refresh_token|id_token|code|state|token|secret|password)=/i.test(r.hash))
        return [`工作流身份核验路径不能包含查询参数或凭据`];
      if (!Array.isArray(n) || n.length === 0) return [`工作流身份核验路径必须位于学习路线中`];
      let i = `${r.pathname}${r.hash}`;
      return n.map((t2) => {
        if (typeof t2 != `string` || !t2.trim()) return;
        let n2 = new URL(t2, e2.loginUrl);
        if (n2.origin === r.origin) return `${n2.pathname}${n2.hash}`;
      }).indexOf(i) >= 0 ? [] : [`工作流身份核验路径必须位于学习路线中`];
    } catch {
      return [`工作流身份核验路径必须位于学习路线中`];
    }
  }
  function st(e2, t) {
    let n = [];
    if (!t || !Array.isArray(t.steps) || t.steps.length === 0) return [`工作流至少需要一个步骤`];
    n.push(...at(e2, t.route)), n.push(...ot(e2, t.identityPath, t.route));
    let r = 0, i = 0, a = (t2, o, s, c) => {
      s > bgCheckinState.ze ? n.push(`${o}条件嵌套超过 ${bgCheckinState.ze} 层`) : (r += t2.length, !(r > bgCheckinState.Le) && t2.forEach((t3, r2) => {
        let l2 = `${o}${r2 + 1}`;
        if (!qe(t3) || typeof t3.type != `string`) n.push(`${l2}格式无效`);
        else
          switch (t3.type) {
            case `if`: {
              let e3 = t3.condition;
              !qe(e3) || typeof e3.type != `string` ? n.push(`${l2}缺少有效 condition`) : e3.type === `text` ? ((!Array.isArray(e3.words) || e3.words.length === 0 || e3.words.some((e4) => typeof e4 != `string` || !e4.trim())) && n.push(`${l2}的 text 条件需要非空 words`), e3.match !== void 0 && e3.match !== `any` && e3.match !== `all` && n.push(`${l2}的 text 条件 match 无效`)) : e3.type === `selector` ? (typeof e3.selector != `string` || !e3.selector.trim()) && n.push(`${l2}的 selector 条件缺少 selector`) : e3.type === `path` ? (typeof e3.pattern != `string` || !e3.pattern.trim()) && n.push(`${l2}的 path 条件缺少 pattern`) : n.push(`${l2}包含不支持的 condition 类型`), !Array.isArray(t3.then) || t3.then.length === 0 ? n.push(`${l2}的 then 分支不能为空`) : a(t3.then, `${l2}.then.`, s + 1, false), t3.else !== void 0 && (Array.isArray(t3.else) ? a(t3.else, `${l2}.else.`, s + 1, false) : n.push(`${l2}的 else 分支格式无效`));
              break;
            }
            case `navigate`:
              i += 1, (!c || r2 !== 0) && n.push(`${l2}只能把 navigate 放在第一步`), typeof t3.url != `string` || !t3.url.trim() ? n.push(`${l2}缺少 url`) : it(e2, t3.url) || n.push(`${l2}必须与登录站点同源`);
              break;
            case `click`:
              (typeof t3.selector != `string` || !t3.selector.trim()) && n.push(`${l2}缺少 selector`), t3.waitFor !== void 0 && (typeof t3.waitFor != `string` || !t3.waitFor.trim()) && n.push(`${l2}的 waitFor 无效`), t3.timeoutMs !== void 0 && !Je(t3.timeoutMs, 0) && n.push(`${l2}的 timeoutMs 超出范围`), nt(t3, l2, n), $e(t3, l2, n);
              break;
            case `fill`:
              (typeof t3.selector != `string` || !t3.selector.trim()) && n.push(`${l2}缺少 selector`), typeof t3.value != `string` && n.push(`${l2}缺少 value`), t3.timeoutMs !== void 0 && !Je(t3.timeoutMs, 0) && n.push(`${l2}的 timeoutMs 超出范围`), rt(t3, l2, n), $e(t3, l2, n);
              break;
            case `scroll`:
              Ye(t3.ratio) || n.push(`${l2}的 ratio 必须是 0..1 的数字`), t3.container !== void 0 && !Ze(t3.container) && n.push(`${l2}的 container 必须是安全的 CSS 选择器`), t3.settleMs !== void 0 && !Je(t3.settleMs, 0) && n.push(`${l2}的 settleMs 超出范围`), t3.timeoutMs !== void 0 && !Je(t3.timeoutMs, 0) && n.push(`${l2}的 timeoutMs 超出范围`);
              break;
            case `drag`:
              et(t3, `selector`, l2, n), et(t3, `toSelector`, l2, n), t3.anchor !== void 0 && tt(t3.anchor, `anchor`, l2, n), t3.toAnchor !== void 0 && tt(t3.toAnchor, `toAnchor`, l2, n), t3.steps !== void 0 && (!Number.isSafeInteger(t3.steps) || t3.steps < 0 || t3.steps > bgCheckinState.Ve) && n.push(`${l2}的 steps 必须是 0-${bgCheckinState.Ve} 的整数`), t3.timeoutMs !== void 0 && !Je(t3.timeoutMs, 0) && n.push(`${l2}的 timeoutMs 超出范围`), $e(t3, l2, n);
              break;
            case `wait`: {
              let e3 = typeof t3.selector == `string` && t3.selector.trim().length > 0, r3 = t3.ms !== void 0;
              e3 && r3 && n.push(`${l2}只能设置 selector 或 ms 其中一个`), r3 && !Je(t3.ms, 0) && n.push(`${l2}的 ms 超出范围`), t3.timeoutMs !== void 0 && !Je(t3.timeoutMs, 0) && n.push(`${l2}的 timeoutMs 超出范围`);
              break;
            }
            case `assert`: {
              let e3 = typeof t3.selector == `string` && t3.selector.trim().length > 0, r3 = Array.isArray(t3.text) && t3.text.some((e4) => typeof e4 == `string` && e4.trim());
              !e3 && !r3 && n.push(`${l2}需要 selector 或 text`), t3.text !== void 0 && (!Array.isArray(t3.text) || t3.text.some((e4) => typeof e4 != `string`)) && n.push(`${l2}的 text 必须是字符串数组`), t3.result !== void 0 && t3.result !== `success` && t3.result !== `already` && n.push(`${l2}的 result 无效`), t3.timeoutMs !== void 0 && !Je(t3.timeoutMs, 0) && n.push(`${l2}的 timeoutMs 超出范围`);
              break;
            }
            case `leilei-daily`: {
              let t4 = ``;
              try {
                t4 = new URL(e2.loginUrl).hostname.toLowerCase();
              } catch {
              }
              let r3 = false;
              try {
                let t5 = new URL(e2.loginUrl);
                r3 = t5.protocol === `https:` && t5.hostname.toLowerCase() === `fapi.leileihog.top` && !t5.port;
              } catch {
              }
              (t4 !== `fapi.leileihog.top` || !r3) && n.push(`${l2}的 leilei-daily 仅允许用于 fapi.leileihog.top`);
              break;
            }
            default:
              n.push(`${l2}包含不支持的步骤类型`);
          }
      }));
    };
    return a(t.steps, `工作流第 `, 0, true), (t.steps.length > bgCheckinState.Le || r > bgCheckinState.Le) && n.push(`工作流最多支持 ${bgCheckinState.Le} 个步骤`), i > 1 && n.push(`工作流当前只允许一个 navigate 步骤`), n;
  }
  function M(e2) {
    let t = ct(e2.loginUrl);
    return t ? new URL(t).origin : null;
  }
  function ct(e2) {
    try {
      let t = new URL(e2.trim());
      return lt(t) ? t.href : null;
    } catch {
      return null;
    }
  }
  function lt(e2) {
    let t = e2.hostname === `localhost` || e2.hostname === `127.0.0.1` || e2.hostname === `[::1]`;
    return e2.protocol === `https:` || e2.protocol === `http:` && t;
  }
  function ut(e2, t) {
    let n = M(e2.site);
    if (!n || !t) return false;
    try {
      return new URL(t).origin === n;
    } catch {
      return false;
    }
  }
  function N(e2, t) {
    if (!t) return true;
    let n = M(e2);
    if (!n) return false;
    try {
      return new URL(t, e2.loginUrl).origin === n;
    } catch {
      return false;
    }
  }
  function dt(e2) {
    return e2 === `localStorage` || e2 === `sessionStorage` ? e2 : void 0;
  }
  function ft(e2) {
    return typeof e2 == `string` && e2.trim() ? e2.trim() : void 0;
  }
  function pt(e2) {
    let t = e2.identitySource;
    if (!t || typeof t != `object` || Array.isArray(t)) return null;
    let n = t, r = {
      storageKey: ft(n.storageKey),
      storageType: dt(n.storageType),
      endpoint: ft(n.endpoint),
      tokenKey: ft(n.tokenKey),
      tokenStorageType: dt(n.tokenStorageType),
      tokenHeader: ft(n.tokenHeader),
      tokenPrefix: typeof n.tokenPrefix == `string` ? n.tokenPrefix : void 0
    };
    return !r.storageKey && !r.endpoint ? null : r;
  }
  function mt(e2, t) {
    if (!t) return false;
    let n = M(e2);
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
  function ht(e2) {
    if (!e2) return false;
    try {
      let t = new URL(e2);
      return t.protocol === `https:` && t.hostname === `github.com` && t.pathname === `/login`;
    } catch {
      return false;
    }
  }
  function gt(e2) {
    if (!e2) return false;
    try {
      let t = new URL(e2);
      return t.protocol === `https:` && t.hostname === `github.com` && t.pathname === `/logout`;
    } catch {
      return false;
    }
  }
  function _t(e2) {
    if (!e2) return false;
    try {
      let t = new URL(e2);
      return t.protocol === `https:` && t.hostname === `github.com` && (t.pathname === `/login` || t.pathname === `/`);
    } catch {
      return false;
    }
  }
  function vt(e2) {
    if (!e2) return false;
    try {
      let t = new URL(e2);
      return t.protocol === `https:` && t.hostname === `github.com` && t.pathname.startsWith(`/login/oauth/authorize`);
    } catch {
      return false;
    }
  }
  function yt(e2) {
    if (!e2) return false;
    try {
      let t = new URL(e2);
      return t.protocol !== `https:` || t.hostname !== `github.com` ? false : t.pathname === `/login` || t.pathname === `/logout` || t.pathname.startsWith(`/login/`) || t.pathname.startsWith(`/sessions/`) || t.pathname.startsWith(`/account_verifications/`);
    } catch {
      return false;
    }
  }
  function bt(e2) {
    if (!e2) return false;
    try {
      let t = new URL(e2);
      return t.protocol !== `https:` || t.hostname !== `accounts.google.com` ? false : t.pathname.startsWith(`/o/oauth2/`) || t.pathname.startsWith(`/signin/`) || t.pathname.startsWith(`/v3/signin/`) || t.pathname === `/ServiceLogin` || t.pathname === `/AccountChooser`;
    } catch {
      return false;
    }
  }
  function wt(e2, t) {
    if (!t) return false;
    let n = M(e2);
    if (!n) return false;
    let r;
    try {
      r = new URL(t, e2.loginUrl);
    } catch {
      return false;
    }
    if (r.protocol !== `https:` && r.protocol !== `http:`) return false;
    let i = `${r.pathname}${r.search}`;
    return r.origin === n ? bgCheckinState.St.test(r.pathname) || bgCheckinState.Ct.test(r.search) : bgCheckinState.xt.test(r.hostname) || bgCheckinState.St.test(r.pathname) || bgCheckinState.Ct.test(r.search) || /(?:oauth|openid|sso|authorize|login|signin|passkey|webauthn)/i.test(i);
  }
  function Tt(e2) {
    return [
      `login`,
      `verify-oauth`,
      `verify-manual`,
      `relogin`,
      `relogin-verify`,
      `relogin-verify-manual`
    ].includes(e2);
  }
  function Et(e2) {
    let t = [];
    M(e2) || t.push(`登录页必须使用 HTTPS（本机测试可使用 localhost HTTP）`);
    let n = e2.loginMethod ?? `form`;
    if (n === `token`) {
      let n2 = e2.tokenConfig;
      n2?.storageKey?.trim() || t.push(`Token 认证需要填写存储键名（如 auth_token）`), n2?.headerName?.trim() || t.push(`Token 认证需要填写请求头名称（如 Authorization）`), n2?.identityEndpoint && !N(e2, n2.identityEndpoint) && t.push(`身份接口必须与登录站点同源`);
    }
    let r = pt(e2);
    r?.endpoint && !mt(e2, r.endpoint) && t.push(`跨域身份接口必须使用 HTTPS，且主机必须是登录站点域名的自身或子域`), r?.endpoint && !r.tokenKey && t.push(`跨域身份接口需要同时填写 token 存储键（tokenKey）`), e2.logoutApiUrl && !N(e2, e2.logoutApiUrl) && t.push(`退出接口必须与登录站点同源`);
    let i = e2.authBootstrap?.endpoint?.trim();
    if (i) {
      let n2 = null;
      try {
        n2 = new URL(i, e2.loginUrl).href;
      } catch {
        n2 = null;
      }
      (!n2 || !N(e2, n2)) && t.push(`令牌引导接口必须是登录站点同源的地址`);
    }
    let a = e2.checkin, o = a?.method === `workflow` && !a.workflow?.route?.length;
    if (a?.entry && (!bgSitesState.oe(e2) || o)) {
      if (a.entry.readySelector?.trim() || t.push(`签到入口需要填写页面就绪选择器`), !Array.isArray(a.entry.steps) || a.entry.steps.length === 0)
        t.push(`签到入口至少需要一个站内点击步骤`);
      else
        for (let [e3, n2] of a.entry.steps.entries())
          n2?.selector?.trim() || t.push(`签到入口第 ${e3 + 1} 步缺少点击选择器`);
    }
    if (a?.method === `api` && (a.apiUrl?.trim() ? N(e2, a.apiUrl) || t.push(`签到接口必须与登录站点同源`) : t.push(`API 签到需要填写接口地址`)), a?.method === `button` && (a.buttonSelector?.trim() || t.push(`按钮签到需要填写按钮选择器`), a.url && !N(e2, a.url) && t.push(`签到页面必须与登录站点同源`)), a?.method === `claim`) {
      a.claimEntrySelector?.trim() || t.push(`领取签到需要填写领取入口选择器`), a.claimInputSelector?.trim() || t.push(`领取签到需要填写输入框选择器`), a.claimSubmitSelector?.trim() || t.push(`领取签到需要填写提交按钮选择器`);
      let n2 = a.claimMinLength ?? 10, r2 = a.claimText?.trim();
      r2 && r2.length < n2 && t.push(`领取文本至少需要 ${n2} 字，当前 ${r2.length} 字`), a.url && !N(e2, a.url) && t.push(`领取页面必须与登录站点同源`);
    }
    return a?.method === `relogin` && (!a.logoutApiUrl?.trim() && !a.logoutSelector?.trim() && t.push(`退出重登需要填写退出接口或退出按钮选择器`), a.logoutApiUrl && !N(e2, a.logoutApiUrl) && t.push(`退出接口必须与登录站点同源`)), bgSitesState.oe(e2) && t.push(...st(e2, a?.workflow)), t;
  }
  function Dt(e2) {
    let t = Et(e2);
    if (t.length) throw Error(t[0]);
  }
  function wi(e2, t = bgPlatformState.Ci()) {
    return `${e2}:${t}`;
  }
  function Ki(e2) {
    if (!e2 || typeof e2 != `object`) return { ...bgCheckinState.Wi };
    let t = e2, n = t.time !== void 0, r = typeof t.time == `string` && bgCheckinState.Gi.test(t.time), i = t.weekdays !== void 0, a = t.accountIds !== void 0, o = Array.isArray(t.accountIds) && t.accountIds.every((e3) => typeof e3 == `string` && e3.length > 0), s = Array.isArray(t.weekdays) ? [...new Set(t.weekdays.filter((e3) => Number.isInteger(e3) && e3 >= 0 && e3 <= 6))].sort(
      (e3, t2) => e3 - t2
    ) : [], c = Array.isArray(t.accountIds) ? [...new Set(t.accountIds.filter((e3) => typeof e3 == `string` && e3.length > 0))].sort() : [], l2 = t.enabled === true && (!n || !i) || n && !r || i && s.length === 0 || a && !o, u = {
      enabled: t.enabled === true && !l2,
      time: r ? t.time : bgCheckinState.Wi.time,
      weekdays: s.length ? s : [...bgCheckinState.Wi.weekdays]
    };
    return a && (u.accountIds = c), u;
  }
  function qi(e2, t) {
    let n = Ki(e2);
    if (n.accountIds === void 0) return n;
    let r = new Set(t);
    return { ...n, accountIds: n.accountIds.filter((e3) => r.has(e3)) };
  }
  function Ji(e2, t) {
    let n = [...new Set(t)], r = Ki(e2);
    if (r.accountIds === void 0) return n;
    let i = new Set(r.accountIds);
    return n.filter((e3) => i.has(e3));
  }
  function Yi(e2) {
    let t = Ki(e2);
    return `${t.time}|${t.weekdays.join(`,`)}|${t.accountIds === void 0 ? `*` : t.accountIds.join(`,`)}`;
  }
  function Xi(e2, t = /* @__PURE__ */ new Date()) {
    let n = Ki(e2);
    if (!n.enabled || n.weekdays.length === 0) return null;
    let [r = 0, i = 0] = n.time.split(`:`).map(Number), a = new Set(n.weekdays);
    for (let e3 = 0; e3 <= 7; e3 += 1) {
      let n2 = new Date(t);
      if (n2.setDate(t.getDate() + e3), n2.setHours(r, i, 0, 0), a.has(n2.getDay()) && n2.getTime() > t.getTime())
        return n2;
    }
    return null;
  }
  function Zi(e2, t, n = /* @__PURE__ */ new Date()) {
    let r = Ki(e2);
    if (!r.enabled || !Number.isFinite(t)) return false;
    let i = new Date(t);
    if (Number.isNaN(i.getTime())) return false;
    let [a = 0, o = 0] = r.time.split(`:`).map(Number);
    return i.getFullYear() === n.getFullYear() && i.getMonth() === n.getMonth() && i.getDate() === n.getDate() && i.getHours() === a && i.getMinutes() === o && r.weekdays.includes(i.getDay());
  }
  function Qi(e2, t) {
    return `${e2.getFullYear()}-${String(e2.getMonth() + 1).padStart(2, `0`)}-${String(e2.getDate()).padStart(2, `0`)}@${t}`;
  }
  function $i(e2, t = /* @__PURE__ */ new Date()) {
    let n = Ki(e2);
    if (!n.enabled || n.weekdays.length === 0 || !n.weekdays.includes(t.getDay())) return null;
    let [r = 0, i = 0] = n.time.split(`:`).map(Number), a = new Date(t);
    return a.setHours(r, i, 0, 0), a.getTime() <= t.getTime() ? a : null;
  }
  function sa(e2, t, n) {
    let r = e2[t];
    return !r?.disabledUntil || n >= r.disabledUntil;
  }
  function ca(e2, t, n, r) {
    let i = e2[t] ?? bgCheckinState.oa(), a = { ...i, lastAttemptAt: r, lastVerdict: n };
    return n === `success` ? (a.consecutiveFailures = 0, delete a.disabledUntil, { ...e2, [t]: a }) : (n === `unsupported` && (a.consecutiveFailures = i.consecutiveFailures + 1, a.consecutiveFailures >= 3 && (a.disabledUntil = r + bgCheckinState.aa)), { ...e2, [t]: a });
  }
  function la(e2, t) {
    let n = new Set(t), r = Object.entries(e2).filter(([e3]) => n.has(e3));
    return r.length === Object.keys(e2).length ? e2 : Object.fromEntries(r);
  }
  function Co(e2) {
    return e2.tabId <= 0 && e2.launching === true && Date.now() - e2.startedAt < bgCheckinState.So;
  }
  function wo(e2) {
    let t = Promise.resolve(), r = null, i = false;
    function a(e3) {
      let n = t.then(e3, e3);
      return t = n.then(
        () => void 0,
        () => void 0
      ), n;
    }
    async function o() {
      return bgPlatformState.n.get(bgCheckinState.bo, bgCheckinState.xo());
    }
    async function s(e3) {
      await bgPlatformState.n.set(bgCheckinState.bo, e3);
    }
    function c() {
      return i = true, r ||= (async () => {
        for (; i; ) i = false, await l2();
      })().finally(() => {
        r = null, i && c();
      }), r;
    }
    async function l2() {
      for (; ; ) {
        let t2 = await a(async () => {
          let e3 = await o();
          if (e3.active || e3.pendingAccountIds.length === 0) return null;
          let t3 = e3.pendingAccountIds.shift();
          return e3.active = { accountId: t3, tabId: 0, startedAt: Date.now(), launching: true }, await s(e3), t3;
        });
        if (!t2) return;
        let n = await e2.launch(
          t2,
          (e3) => a(async () => {
            let n2 = await o();
            if (n2.active?.accountId !== t2) throw Error(`签到任务已被取消`);
            n2.active = { accountId: t2, tabId: e3, startedAt: Date.now() }, await s(n2);
          })
        ).catch((e3) => ({ ok: false, error: e3 instanceof Error ? e3.message : String(e3) }));
        if (n.ok && n.completedResult) {
          let r2 = n.completedResult, i2 = await a(async () => {
            let n2 = await o();
            if (n2.active?.accountId !== t2) return { kind: `stolen` };
            delete n2.active, await s(n2);
            try {
              return await e2.complete?.(t2, r2), { kind: `done` };
            } catch (e3) {
              return { kind: `failed`, message: e3 instanceof Error ? e3.message : String(e3) };
            }
          });
          if (i2.kind === `stolen`) return;
          i2.kind === `failed` && (await e2.fail(t2, `签到结果落库失败：${i2.message}`), e2.changed());
        } else {
          if (n.ok && n.tabId != null) {
            if (!await a(async () => {
              let e3 = await o();
              return e3.active?.accountId === t2 && (e3.active = { accountId: t2, tabId: n.tabId, startedAt: Date.now() }, await s(e3), true);
            })) {
              await e2.abandon({ accountId: t2, tabId: n.tabId, startedAt: Date.now() });
              return;
            }
            e2.changed();
            return;
          }
          if (await a(async () => {
            let e3 = await o();
            return e3.active?.accountId === t2 && (delete e3.active, await s(e3), true);
          }))
            await e2.fail(t2, n.error || `无法启动签到任务`), e2.changed();
          else return;
        }
      }
    }
    return {
      async enqueue(t2) {
        let n = await a(async () => {
          let e3 = await o(), n2 = new Set(e3.pendingAccountIds);
          e3.active && n2.add(e3.active.accountId);
          let r2 = 0;
          for (let i2 of t2) i2 && !n2.has(i2) && (n2.add(i2), e3.pendingAccountIds.push(i2), r2 += 1);
          return await s(e3), { queued: r2, skipped: t2.length - r2 };
        });
        return e2.changed(), c(), n;
      },
      async finish(t2) {
        await a(async () => {
          let e3 = await o();
          return !e3.active || e3.active.tabId !== t2 ? false : (delete e3.active, await s(e3), true);
        }) && (e2.changed(), c());
      },
      async cancel(t2) {
        let n = new Set(t2);
        if (n.size === 0) return 0;
        let i2 = r, { active: l3, removed: u } = await a(async () => {
          let e3 = await o(), t3 = e3.pendingAccountIds.length;
          e3.pendingAccountIds = e3.pendingAccountIds.filter((e4) => !n.has(e4));
          let r2 = t3 - e3.pendingAccountIds.length, i3 = e3.active && n.has(e3.active.accountId) ? e3.active : void 0;
          return i3 && delete e3.active, await s(e3), { active: i3, removed: r2 + +!!i3 };
        });
        return l3 && await e2.abandon(l3), u && e2.changed(), l3 && i2 && await i2.catch(() => {
        }), u && c(), u;
      },
      async recover() {
        let t2 = await o();
        if (t2.active && !Co(t2.active) && !await e2.isAlive(t2.active)) {
          let n = t2.active;
          await e2.abandon(n);
          let r2 = await o();
          if (r2.active && r2.active.accountId === n.accountId && r2.active.tabId !== n.tabId) {
            e2.changed();
            return;
          }
          await a(async () => {
            let e3 = await o();
            e3.active?.accountId === n.accountId && delete e3.active, await s(e3);
          }), await e2.fail(n.accountId, `浏览器后台重启，原签到页面已失效`);
        }
        e2.changed(), await c();
      },
      async rebindActiveTab(t2, n) {
        return a(async () => {
          let r2 = await o();
          return !r2.active || r2.active.tabId !== t2 ? false : (r2.active = { ...r2.active, tabId: n, startedAt: Date.now() }, await s(r2), e2.changed(), true);
        });
      },
      async active() {
        return (await o()).active;
      },
      async snapshot() {
        return o();
      },
      async launchInFlight() {
        let e3 = await o();
        return e3.active ? Co(e3.active) : false;
      },
      async busy() {
        let e3 = await o();
        return !!e3.active || e3.pendingAccountIds.length > 0;
      }
    };
  }
  function Eo(e2) {
    let t = [];
    for (let [n, r] of Object.entries(e2)) {
      if (!n.startsWith(bgCheckinState.To) || !r || typeof r != `object`) continue;
      let e3 = r;
      e3.runId && e3.accountId && t.push({
        accountId: e3.accountId,
        siteId: e3.siteId ?? ``,
        tabId: typeof e3.tabId == `number` ? e3.tabId : 0,
        runId: e3.runId,
        stage: e3.stage ?? `login`,
        method: e3.effectiveCheckinMethod ?? e3.site?.checkin?.method,
        steps: Array.isArray(e3.steps) ? e3.steps.map((e4) => String(e4)) : [],
        startedAt: typeof e3.createdAt == `number` ? e3.createdAt : Date.now()
      });
    }
    return t.sort((e3, t2) => e3.startedAt - t2.startedAt);
  }
  function Oo(e2) {
    let t = new Set(e2.pendingAccountIds ?? []);
    for (let n2 of e2.liveAccountIds ?? []) t.add(n2);
    e2.activeAccountId && t.add(e2.activeAccountId);
    let n = `:${e2.day}`, r = [];
    for (let [i, a] of Object.entries(e2.statuses)) {
      if (!i.endsWith(n) || !bgCheckinState.Do.has(a)) continue;
      let e3 = i.slice(0, -n.length);
      e3 && !t.has(e3) && r.push(e3);
    }
    return r;
  }
  function ko(e2) {
    let t = new Map(e2.accounts.map((e3) => [e3.id, e3.siteId])), n = [...e2.queue.pendingAccountIds];
    return e2.queue.activeAccountId && n.push(e2.queue.activeAccountId), !n.some((n2) => n2 !== e2.accountId && t.get(n2) === e2.siteId);
  }
  function Mo(e2) {
    let t = bgCheckinState.jo.then(e2, e2);
    return bgCheckinState.jo = t.then(
      () => void 0,
      () => void 0
    ), t;
  }
  async function No(e2, t) {
    !e2 || !Number.isFinite(t) || t <= 0 || await Mo(async () => {
      let r = await bgPlatformState.n.get(bgCheckinState.Ao(e2), []);
      r.includes(t) || (r.push(t), await bgPlatformState.n.set(bgCheckinState.Ao(e2), r));
    });
  }
  async function Po(e2) {
    return Mo(async () => {
      let t = await bgPlatformState.n.get(bgCheckinState.Ao(e2), []);
      return t.length && await bgPlatformState.n.remove(bgCheckinState.Ao(e2)), t;
    });
  }
  function B(e2) {
    let t = bgCheckinState.Fo.then(e2, e2);
    return bgCheckinState.Fo = t.then(
      () => void 0,
      () => void 0
    ), t;
  }
  function zo(e2) {
    let t = bgCheckinState.Ro.then(e2, e2);
    return bgCheckinState.Ro = t.then(
      () => void 0,
      () => void 0
    ), t;
  }
  async function Vo(e2) {
    Object.keys(e2).length ? await bgPlatformState.n.set(bgCheckinState.Lo, e2) : await bgPlatformState.n.remove(bgCheckinState.Lo);
  }
  async function Ho(e2) {
    let t = await bgCheckinState.Bo();
    e2(t), await Vo(t);
  }
  function Wo(e2) {
    let t = e2.effectiveLoginMethod ?? `auto`;
    return Tt(e2.stage) && (t === `oauth` || t === `github` || t === `passkey` || e2.stage === `verify-oauth` || e2.stage === `relogin-verify`);
  }
  function Go(e2, t) {
    return yt(t) ? `github` : bt(t) ? `google` : e2.effectiveLoginMethod === `github` ? `github` : `generic`;
  }
  function Ko(e2, t) {
    if (!t || /^about:blank(?:$|#)/i.test(t) || /^chrome-(?:extension|error):/i.test(t)) return false;
    if (yt(t) || bt(t) || wt(e2.site, t)) return true;
    if (e2.stage !== `verify-oauth` && e2.stage !== `relogin-verify`) return false;
    try {
      let n = new URL(t, e2.site.loginUrl);
      return n.protocol === `https:` || n.protocol === `http:`;
    } catch {
      return false;
    }
  }
  function qo(e2, t) {
    let n = t.pendingUrl ?? t.url ?? ``;
    return /^about:blank(?:$|#)/i.test(n) ? e2.stage === `verify-oauth` || e2.stage === `relogin-verify` : Ko(e2, n);
  }
  function Jo(e2, t) {
    return e2.effectiveLoginMethod === `github` ? yt(t) ? true : e2.stage !== `verify-oauth` && e2.stage !== `relogin-verify` ? false : /^about:blank(?:$|#)/i.test(t) ? true : N(e2.site, t) && wt(e2.site, t) : false;
  }
  function ys(e2) {
    return e2.replace(bgCheckinState.vs, (e3) => bgCheckinState._s[e3] ?? e3);
  }
  function xs(e2) {
    let t = ``, n = false, r = ``, i = e2.source;
    for (let e3 = 0; e3 < i.length; e3 += 1) {
      let a = i[e3];
      if (a === `\\`) {
        t += i.slice(e3, e3 + 2), e3 += 1;
        continue;
      }
      if (n) {
        if (a === `]`) {
          t += `${r}]`, n = false, r = ``;
          continue;
        }
        r += bgCheckinState.bs.get(a) ?? ``, t += a;
        continue;
      }
      if (a === `[`) {
        n = true, t += a;
        continue;
      }
      let o = bgCheckinState.bs.get(a);
      t += o ? `[${a}${o}]` : a;
    }
    return new RegExp(t, e2.flags);
  }
  function Ss(e2, t) {
    let n = ys(e2).toLowerCase();
    return t.filter((e3) => n.includes(ys(e3).toLowerCase()));
  }
  function js(e2, t, n) {
    let r = bgCheckinState.As[e2];
    return t?.trim() ? {
      checkin: [t.trim()],
      balance: r?.balance ?? [...bgCheckinState.Os.balance, ...bgCheckinState.ks.balance],
      auth: r?.auth ?? `userIdHeaders`,
      method: n ?? r?.method ?? `POST`,
      explicit: true
    } : r ? {
      checkin: r.checkin,
      balance: r.balance,
      auth: r.auth,
      method: r.method ?? `POST`,
      explicit: false
    } : null;
  }
  function Ms(e2) {
    return typeof e2 == `object` && e2 && !Array.isArray(e2) ? e2 : null;
  }
  function Ns(e2) {
    let t = Ms(e2.data), n = e2.message ?? e2.msg ?? t?.message ?? t?.msg;
    return typeof n == `string` ? n : ``;
  }
  function Ps(e2, t) {
    let n = e2.toLowerCase(), r = t.trimStart().slice(0, 512).toLowerCase();
    return n.includes(`text/html`) || n.includes(`application/xhtml+xml`) || /^<!doctype\s+html\b/.test(r) || /^<html\b/.test(r) || /<(?:head|body|form)\b/.test(r);
  }
  function Fs(e2, t, n, r) {
    if (e2 === 401 || e2 === 403)
      return { verdict: `auth-expired`, message: `登录态无效（HTTP ${e2}）` };
    if (e2 === 404 || e2 === 405)
      return { verdict: `unsupported`, message: `站点没有这个签到接口（HTTP ${e2}）` };
    if (Ps(t, n)) return { verdict: `unsupported`, message: `接口返回 HTML 页面而非 JSON` };
    let i = null;
    try {
      i = Ms(JSON.parse(n));
    } catch {
      i = null;
    }
    if (!i)
      return e2 >= 400 ? { verdict: `unsupported`, message: `接口返回 HTTP ${e2}` } : bgRecordsState.Is(n, r.already) ? { verdict: `claims-already`, message: `接口提示今日已签到` } : bgRecordsState.Is(n, r.success) ? { verdict: `claims-success`, message: `接口返回签到成功` } : { verdict: `unreadable`, message: `响应不是 JSON 且无可识别文案` };
    let a = Ms(i.data), o = Ns(i);
    return e2 >= 400 || i.success === false || a?.success === false ? bgRecordsState.Is(o, r.already) ? { verdict: `claims-already`, message: o || `接口提示今日已签到` } : { verdict: `claims-failure`, message: o || `接口返回失败（HTTP ${e2}）` } : i.already === true || a?.already === true ? { verdict: `claims-already`, message: o || `接口提示今日已签到` } : bgRecordsState.Is(o, r.already) ? { verdict: `claims-already`, message: o } : i.success === true || a?.success === true || i.code === 0 || i.ret === 1 ? { verdict: `claims-success`, message: o || `接口返回成功标志` } : bgRecordsState.Is(o, r.success) ? { verdict: `claims-success`, message: o } : { verdict: `unreadable`, message: o || `响应缺少可识别的成功或已签到标志` };
  }
  function Ws(e2) {
    return e2 === `confirmed` || e2 === `already`;
  }
  function Gs(e2) {
    return e2 !== `write-unverified`;
  }
  function Ks(e2) {
    return Ws(e2) ? `success` : e2 === `unsupported` ? `unsupported` : e2 === `auth-expired` ? `auth-expired` : e2 === `inconclusive` || e2 === `write-unverified` ? `inconclusive` : `error`;
  }
  function Js(e2, t, n) {
    let r = { Accept: `application/json` }, i = e2.identity?.userId ?? t.adapter?.userId;
    Object.assign(r, bgSitesState.or(i));
    let a = e2.identity?.session?.accessToken?.trim() || e2.apiToken?.trim();
    if (a) {
      let e3 = t.tokenConfig?.headerPrefix ?? `Bearer `, n2 = t.tokenConfig?.headerName ?? `Authorization`;
      r[n2] = `${e3}${a}`;
    } else n === `bearer` && (r.__missingBearer = `1`);
    return r;
  }
  function Ys(e2, t) {
    let n = e2.identity?.session?.tokenExpiresAt;
    return n ? t >= n - 3e4 : false;
  }
  async function Xs(e2, t, n, r = bgCheckinState.Vs) {
    let i = new AbortController(), a = setTimeout(() => i.abort(), r);
    try {
      let r2 = await e2.fetch(t, {
        ...n,
        credentials: `include`,
        redirect: `error`,
        signal: i.signal
      }), a2 = (await r2.text()).slice(0, 4e3);
      return { status: r2.status, contentType: r2.headers.get(`content-type`) ?? ``, body: a2 };
    } catch {
      return null;
    } finally {
      clearTimeout(a);
    }
  }
  async function Zs(e2, t, n, r) {
    for (let i of n) {
      let n2 = Qs(t, i);
      if (!n2) continue;
      let a = await Xs(e2, n2, { method: `GET`, headers: r }, 4e3);
      if (!a || a.status !== 200 || !a.contentType.toLowerCase().includes(`json`)) continue;
      let o;
      try {
        o = JSON.parse(a.body);
      } catch {
        continue;
      }
      let s = bgRecordsState.mi(o);
      if (s)
        return {
          quota: s.quota,
          usedQuota: s.usedQuota,
          ...s.symbol ? { symbol: s.symbol } : {},
          at: e2.now()
        };
    }
    return null;
  }
  function Qs(e2, t) {
    try {
      let n = new URL(t, e2.loginUrl).href;
      return N(e2, n) ? n : null;
    } catch {
      return null;
    }
  }
  function $s(e2, t, n, r) {
    if (n.method !== `POST` || e2 !== bgSitesState.d.NEW_API && e2 !== bgSitesState.d.VO_API_V2)
      return false;
    let i = Qs(t, r);
    if (!i) return false;
    try {
      let e3 = new URL(i);
      return e3.pathname.replace(/\/+$/, ``) === `/api/user/checkin` && e3.search === ``;
    } catch {
      return false;
    }
  }
  async function ec(e2, t, n, r, i) {
    let a = Qs(t, n);
    if (!a) return null;
    let o;
    try {
      let e3 = new URL(a);
      e3.searchParams.set(`month`, i), o = e3.href;
    } catch {
      return null;
    }
    let s = await Xs(e2, o, { method: `GET`, headers: r }, 4e3);
    return s ? bgRecordsState.zs(s.status, s.contentType, s.body) : null;
  }
  function tc(e2) {
    return {
      success: e2.checkin?.successText?.length ? e2.checkin.successText : bgCheckinState.Cs,
      already: e2.checkin?.alreadyText?.length ? e2.checkin.alreadyText : bgCheckinState.ws
    };
  }
  async function nc(e2, t, n = bgCheckinState.qs) {
    let r = [];
    if (bgSitesState.oe(t))
      return {
        verdict: `inconclusive`,
        message: `本站已保存签到流程，完成登录后由浏览器回放，不使用接口签到替代`,
        steps: r
      };
    if (bgSitesState.se(t))
      return {
        verdict: `inconclusive`,
        message: `本站已学会「登录即签到」，由浏览器完成登录后确认，不使用接口签到替代`,
        steps: r
      };
    let i = n.now() + bgCheckinState.Hs, a = bgSitesState.fr(t).family, o = js(a, t.checkin?.apiUrl, t.checkin?.apiMethod);
    if (!o)
      return {
        verdict: `unsupported`,
        message: `站点类型未知且未配置签到接口地址，无法直连`,
        steps: r
      };
    if (!o.checkin.some((e3) => Qs(t, e3)))
      return { verdict: `unsupported`, message: `站点没有可安全访问的同源签到接口`, steps: r };
    let s = Js(e2, t, o.auth);
    if (s.__missingBearer)
      return delete s.__missingBearer, {
        verdict: `auth-expired`,
        message: `该站点需要 Bearer 令牌，但账号还没有抓取过登录态`,
        steps: r
      };
    if (Ys(e2, n.now()))
      return { verdict: `auth-expired`, message: `抓取的访问令牌已过期，需要重新登录`, steps: r };
    r.push(`尝试 API 直连签到（${o.explicit ? `站点配置的接口` : `${a} 家族默认接口`}）`);
    let c = bgRecordsState.Rs(n.now()), l2 = o.checkin[0], u = !!l2 && $s(a, t, o, l2), d = u && l2 ? await ec(n, t, l2, s, c) : null;
    if (d) {
      if (r.push(`已读到站点签到台账（本月 ${d.records.length} 条记录）`), !d.enabled)
        return { verdict: `unsupported`, message: `站点已关闭签到功能`, steps: r };
      if (d.checkedInToday) {
        r.push(`台账显示今日已签到，无需再发签到请求`);
        let e3 = await Zs(n, t, o.balance, s);
        return e3 && r.push(`已采集当前额度`), {
          verdict: `already`,
          message: `站点台账显示今日已签到`,
          steps: r,
          ...e3 ? { balance: e3 } : {}
        };
      }
    }
    let f = await Zs(n, t, o.balance, s);
    if (f ? r.push(`已采集签到前额度快照`) : r.push(`读不到签到前额度，本次无法用守恒差分确认结果`), !d && !f)
      return r.push(`缺少可用的只读验证通道，已在发送签到请求前停止直连`), { verdict: `inconclusive`, message: `直连缺少可用的只读验证通道，改用浏览器签到`, steps: r };
    let p = { ...s }, m = t.checkin?.apiBody;
    m && o.method !== `GET` && (p[`Content-Type`] = `application/json`);
    let h = null;
    for (let a2 of o.checkin) {
      if (n.now() > i)
        return { verdict: `error`, message: `直连超出时间预算，改用浏览器签到`, steps: r };
      let g = Qs(t, a2);
      if (!g) {
        r.push(`跳过非本站签到地址 ${a2}`);
        continue;
      }
      let _ = await Xs(n, g, {
        method: o.method,
        headers: p,
        body: o.method === `GET` ? void 0 : m ?? void 0
      });
      if (!_)
        return r.push(`签到接口请求失败或超时`), r.push(`写请求可能已到达站点，为避免重复签到不再自动重试`), {
          verdict: `write-unverified`,
          message: `签到请求已发出但未收到可验证响应；为避免重复签到，未再自动重试`,
          steps: r
        };
      let v = Fs(_.status, _.contentType, _.body, tc(t));
      if (h = v, r.push(`签到接口返回 HTTP ${_.status}：${v.message}`), v.verdict === `auth-expired`)
        return { verdict: `auth-expired`, message: v.message, steps: r };
      if (v.verdict !== `unsupported`)
        return v.verdict === `claims-failure` ? { verdict: `inconclusive`, message: v.message, steps: r } : rc(n, e2, t, o, s, f, d, u && d && a2 === l2 ? () => ec(n, t, l2, s, c) : null, v, r);
    }
    return { verdict: `unsupported`, message: h?.message ?? `站点没有可用的签到接口`, steps: r };
  }
  async function rc(e2, t, n, r, i, a, o, s, c, l2) {
    await e2.sleep(bgCheckinState.Us);
    let u = s ? await s() : null, d = bgRecordsState.Bs(o, u);
    d != null && l2.push(`签到台账已记入本次奖励`);
    let f = await Zs(e2, n, r.balance, i);
    f ? l2.push(`已采集签到后额度快照`) : l2.push(`读不到签到后额度快照`);
    let p = (e3) => f ? { ...e3, balance: f } : e3;
    if (d != null) {
      let e3 = {
        ...bgRecordsState.xi(a ?? void 0, f ?? void 0),
        reward: d,
        verdict: `rewarded`,
        ...f ? { quotaAfter: f.quota } : {},
        ...f?.symbol ? { balanceSymbol: f.symbol } : {}
      };
      return p({ verdict: `confirmed`, message: c.message, steps: l2, metrics: e3 });
    }
    if (c.verdict === `claims-already`) {
      if (a && f) {
        let e3 = bgRecordsState.xi(a, f);
        return l2.push(`额度差分：${e3.verdict}`), p({
          verdict: e3.verdict === `rewarded` ? `confirmed` : `already`,
          message: c.message,
          steps: l2,
          metrics: e3
        });
      }
      return p({ verdict: `already`, message: c.message, steps: l2 });
    }
    if (u?.checkedInToday && !o?.checkedInToday) {
      l2.push(`台账已从未签到翻为已签到`);
      let e3 = a && f ? bgRecordsState.xi(a, f) : null, t2 = e3?.verdict === `rewarded` ? e3 : f ? {
        verdict: `unknown`,
        quotaAfter: f.quota,
        ...f.symbol ? { balanceSymbol: f.symbol } : {}
      } : null;
      return p({
        verdict: `confirmed`,
        message: c.message,
        steps: l2,
        ...t2 ? { metrics: t2 } : {}
      });
    }
    if (!a || !f)
      return l2.push(`写请求已发出但验证证据不完整，为避免重复签到不再自动重试`), p({
        verdict: `write-unverified`,
        message: `接口声称成功但无法取得完整额度差分；为避免重复签到，未再自动重试`,
        steps: l2
      });
    let m = bgRecordsState.xi(a, f);
    return l2.push(`额度差分：${m.verdict}`), m.verdict === `rewarded` ? p({ verdict: `confirmed`, message: c.message, steps: l2, metrics: m }) : (l2.push(`写请求已发出但额度未增加，为避免重复签到不再自动重试`), p({
      verdict: `write-unverified`,
      message: `接口声称成功但额度未增加；为避免重复签到，未再自动重试`,
      steps: l2,
      metrics: m
    }));
  }
  async function Pp(e2, t = bgPlatformState.Np) {
    if (!Number.isFinite(e2) || e2 <= 0) return `gone`;
    let n = await t.get(e2);
    return n ? n.windowId == null || (await t.queryWindow(n.windowId)).filter((t2) => t2.id !== e2).length === 0 ? `kept` : (await t.remove(e2), `removed`) : `gone`;
  }
  function Fp(e2) {
    return { site: e2 };
  }
  function Ip(e2) {
    return { site: e2, borrowed: [] };
  }
  function Lp(e2, t) {
    if (!bgSitesState.ce(e2) || bgSitesState.ue(e2)) return null;
    if (t.method === `none`) return { ...t };
    let { entry: n, url: r, ...i } = e2.checkin ?? { method: `auto` };
    return {
      ...i,
      method: `workflow`,
      ...t.workflow ? { workflow: t.workflow } : {},
      workflowReplayDisabled: false
    };
  }
  function Up() {
    return [];
  }
  function Wp(e2, t) {
    if (e2.accountId !== t) return e2;
    let n = bgSitesState.so(e2.site), r = n.checkin?.method ?? `auto`;
    if (n === e2.site && e2.effectiveCheckinMethod === r) return e2;
    let i = e2.effectiveCheckinMethod ?? e2.site.checkin?.method ?? `auto`, a = `；签到方式：`, o = false, s = (e2.steps ?? []).map((e3) => {
      let t2 = e3.indexOf(a);
      return t2 < 0 ? e3 : (o = true, `${e3.slice(0, t2)}${a}${r}（站点配置）`);
    });
    return i !== r && (o || s.push(`签到方式：${r}（站点配置）`), s.push(`后台恢复任务时已同步最新签到方式（${i} -> ${r}）`)), {
      ...e2,
      site: n,
      effectiveCheckinMethod: r,
      ...JSON.stringify(n.checkin?.workflow) === JSON.stringify(e2.site.checkin?.workflow) ? {} : { workflowRouteIndex: void 0 },
      steps: s
    };
  }
  async function Gp(e2) {
    !e2 || e2.tabId <= 0 || await bgCheckinState.V.update(e2.tabId, (t) => Wp(t, e2.accountId));
  }
  function sm(e2, t, n) {
    let r = bgCheckinState.om.catch(() => {
    }).then(() => cm(e2, t, n));
    return bgCheckinState.om = r.catch(() => {
    }), r;
  }
  async function cm(e2, t, n) {
    let r = await bgCheckinState.H.get(e2);
    if (!r && n != null && (await bgCheckinState.V.get(n))?.runId && (await bgCheckinState.H.remember(e2, n), r = { openerTabId: n }), !r || !t)
      return;
    let i = r.openerTabId, a = await bgCheckinState.V.get(i);
    if (a?.runId && Wo(a) && a.usesExtensionProxy && Ko(a, t) && (await fm(e2, i, Go(a, t)), r = await bgCheckinState.H.get(e2) ?? r), !a?.runId || !Tt(a.stage))
      return;
    let o = Jo(a, t), s = (a.effectiveLoginMethod === `oauth` || a.effectiveLoginMethod === `github` || a.effectiveLoginMethod === `passkey`) && bt(t);
    if (o || s) {
      if (s) {
        if (!a.usesExtensionProxy || !await fm(e2, i, `google`)) return;
        if (!await chrome.tabs.get(e2).then(() => true).catch(() => false)) {
          await bgProxiesState.W.release(e2).catch(() => {
          }), await bgCheckinState.H.forget(e2);
          return;
        }
      } else if (a.usesExtensionProxy && !await fm(e2, i, `github`))
        await bgCheckinState.H.clearProxyTransferred(e2);
      else if (await bgCheckinState.V.rebind(i, e2, a.runId))
        await bgCheckinState.Z.rebindActiveTab(i, e2) ? (await bgCheckinState.H.forget(e2), bgPlatformState.$()) : (await bgCheckinState.V.rebind(e2, i, a.runId).catch(() => null), a.usesExtensionProxy && (await bgProxiesState.W.transfer(e2, i).catch(() => {
        }), await bgCheckinState.H.clearProxyTransferred(e2)));
      else {
        if ((await bgCheckinState.V.get(e2))?.runId === a.runId) return;
        a.usesExtensionProxy && (await bgProxiesState.W.transfer(e2, i).catch(() => {
        }), await bgCheckinState.H.clearProxyTransferred(e2));
      }
    }
  }
  async function lm(e2) {
    let t = await bgCheckinState.H.get(e2);
    t && (await bgCheckinState.H.forget(e2), t.proxyTransferred && ((await bgCheckinState.V.get(t.openerTabId))?.runId ? await bgProxiesState.W.transfer(e2, t.openerTabId).catch(() => {
    }) : await bgProxiesState.W.release(e2).catch(() => {
    })));
    let r = await bgPlatformState.n.get(bgLearningState.a(e2), null);
    r && (await bgLearningState.Vm(r).catch(() => {
    }), bgPlatformState.$());
    let i = await bgCheckinState.V.get(e2), o = await bgCheckinState.H.entriesOf(e2);
    if (i?.runId && Wo(i)) {
      let t2 = await bgCheckinState.Z.active();
      if (t2?.tabId === e2 && t2.accountId === i.accountId && await dm(t2, i)) return;
    }
    await um(e2, i, o), await Mh({ tabId: e2, failure: `标签页被关闭，签到中断`, keepAttention: true });
  }
  async function um(e2, t, n) {
    let r = n ?? await bgCheckinState.H.entriesOf(e2), i = !!(t?.usesExtensionProxy && Wo(t));
    for (let [n2, a] of r) {
      let r2 = await chrome.tabs.get(n2).catch(() => null);
      r2 ? !i && !a.proxyTransferred || t && !a.proxyTransferred && !qo(t, r2) ? await bgCheckinState.H.forget(n2) : (await bgProxiesState.W.transfer(e2, n2).catch(() => false) && await bgCheckinState.H.markProxyTransferred(n2, a.provider ?? `generic`), (await bgCheckinState.H.get(n2))?.proxyTransferred && await bgCheckinState.H.markProxyRetained(n2)) : await bgCheckinState.H.forget(n2);
    }
  }
  async function dm(e2, t) {
    if (!t.runId || !Wo(t)) return false;
    let n = await bgCheckinState.H.entriesOf(e2.tabId);
    for (let [r, i] of n) {
      let a = await chrome.tabs.get(r).catch(() => null);
      if (!a) await bgCheckinState.H.forget(r);
      else if (!i.proxyTransferred && !qo(t, a)) await bgCheckinState.H.forget(r);
      else if ((!t.usesExtensionProxy || await fm(r, e2.tabId, i.provider ?? Go(t))) && await bgCheckinState.V.rebind(e2.tabId, r, t.runId)) {
        if (!await bgCheckinState.Z.rebindActiveTab(e2.tabId, r))
          await bgCheckinState.V.rebind(r, e2.tabId, t.runId).catch(() => null);
        else {
          for (let [e3, t2] of n)
            e3 !== r && (t2.proxyTransferred && await bgCheckinState.H.clearProxyTransferred(e3), await bgCheckinState.H.forget(e3));
          return await bgCheckinState.H.forget(r), bgPlatformState.$(), true;
        }
      }
    }
    return false;
  }
  async function fm(e2, t, n) {
    let r = await bgCheckinState.H.get(e2);
    if (r?.proxyTransferred) {
      let n2 = await bgProxiesState.W.holder();
      if (n2 === e2) return true;
      if (n2 !== t) return false;
    } else
      r || await bgCheckinState.H.remember(e2, t), await bgCheckinState.H.markProxyTransferred(e2, n);
    return await bgProxiesState.W.transfer(t, e2) ? true : await bgProxiesState.W.holder() === e2 ? (await bgCheckinState.H.markProxyTransferred(e2, n), true) : (await bgCheckinState.H.clearProxyTransferred(e2), false);
  }
  function pm() {
    let e2 = async () => {
      await mm(), await bgCheckinState.Z.recover();
      let e3 = await bgCheckinState.H.pruneDeadTabs(), t = await bgCheckinState.Z.active();
      await Gp(t);
      for (let [n2, r] of e3)
        r.proxyTransferred && (t?.tabId === r.openerTabId && (await bgCheckinState.V.get(r.openerTabId))?.runId && await bgProxiesState.W.transfer(n2, r.openerTabId) || await bgProxiesState.W.release(n2));
      let n = await bgCheckinState.H.transferredPopups();
      if (bgProxiesState.Me({
        activeTabId: t?.tabId ?? null,
        launchInFlight: await bgCheckinState.Z.launchInFlight()
      })) {
        let { active: e4 } = bgLearningState.Of(
          Object.entries(await chrome.storage.session.get(null))
        ), r = e4.map((e5) => e5.tabId).filter((e5) => e5 > 0), i = [.../* @__PURE__ */ new Set([...t ? [t.tabId] : [], ...n, ...r])];
        await bgProxiesState.W.recover(i);
      }
      await gm(), await bm();
    };
    return bgEntryState.Qp = bgEntryState.Qp.then(e2, e2).catch((e3) => {
      console.error(`[后台恢复] 失败`, e3);
    }), bgEntryState.Qp;
  }
  async function mm() {
    await hm(await bgPlatformState.t.get(bgPlatformState.r.launchMode, bgSettingsState.Fe));
  }
  async function hm(e2) {
    await bgSettingsState.Zp.sync(e2).catch((e3) => {
      console.error(`[启动模式] 应用失败`, e3);
    });
  }
  function gm() {
    let e2 = bgPlatformState.nm.then(_m, _m);
    return bgPlatformState.nm = e2.then(
      () => void 0,
      () => void 0
    ), e2;
  }
  async function _m() {
    let e2 = Xi(Ki(await bgPlatformState.t.get(bgPlatformState.r.schedule, bgCheckinState.Wi)));
    e2 ? await chrome.alarms.create(bgCheckinState.zp, { when: e2.getTime() }) : await chrome.alarms.clear(bgCheckinState.zp).catch(() => false);
  }
  function vm(e2) {
    let t = bgPlatformState.tm.then(
      () => ym(e2),
      () => ym(e2)
    );
    return bgPlatformState.tm = t.then(
      () => void 0,
      () => void 0
    ), t;
  }
  async function ym(e2) {
    try {
      await bgEntryState.Qp;
      let n = Ki(await bgPlatformState.t.get(bgPlatformState.r.schedule, bgCheckinState.Wi));
      if (e2 == null || !Zi(n, e2, /* @__PURE__ */ new Date())) return;
      await Sm(n, new Date(e2));
    } catch (e3) {
      console.error(`[定时签到] 执行失败`, e3);
    } finally {
      await gm().catch((e3) => console.error(`[定时签到] 重排闹钟失败`, e3));
    }
  }
  async function bm() {
    let e2 = bgPlatformState.tm.then(xm, xm);
    return bgPlatformState.tm = e2.then(
      () => void 0,
      () => void 0
    ), e2;
  }
  async function xm() {
    try {
      let e2 = Ki(await bgPlatformState.t.get(bgPlatformState.r.schedule, bgCheckinState.Wi)), n = $i(e2, /* @__PURE__ */ new Date());
      if (!n) return;
      await Sm(e2, n);
    } catch (e2) {
      console.error(`[定时签到] 补跑检查失败`, e2);
    }
  }
  async function Sm(e2, i) {
    let a = Qi(i, e2.time), o = await bgPlatformState.n.get(bgCheckinState.Vp, {}), s = Yi(e2);
    if (o.key === a && o.signature === s) return;
    let c = bgPlatformState.Ci(/* @__PURE__ */ new Date()), [l2, u, d, f] = await Promise.all([
      bgPlatformState.t.get(bgPlatformState.r.accounts, []),
      bgPlatformState.t.get(bgPlatformState.r.status, {}),
      bgPlatformState.t.get(bgPlatformState.r.sites, []),
      bgPlatformState.t.get(bgPlatformState.r.removedBuiltinSiteIds, [])
    ]), p = new Set(f), m = /* @__PURE__ */ new Set([
      ...d.map((e3) => e3.id),
      ...bgSitesState.j.filter((e3) => !p.has(e3.id)).map((e3) => e3.id)
    ]), h = Ji(
      e2,
      l2.map((e3) => e3.id)
    ), g = new Set(h), _ = l2.filter((e3) => {
      if (!m.has(e3.siteId) || !g.has(e3.id)) return false;
      let t = u[wi(e3.id, c)];
      return t !== `done` && t !== `running` && t !== `attention`;
    }).map((e3) => e3.id);
    if (_.length) {
      let e3 = await $m(_);
      if (e3.ok) console.info(`[定时签到] 已加入 ${e3.queued ?? 0} 个账号，跳过 ${e3.skipped ?? 0} 个`);
      else {
        console.warn(`[定时签到] 入队失败：${e3.error}`);
        return;
      }
      bgPlatformState.$();
    }
    await bgPlatformState.n.set(bgCheckinState.Vp, { key: a, signature: s });
  }
  function Cm(e2, t) {
    let n = e2.githubUsername?.trim(), r = e2.stage === `github-logout` && (gt(t) || _t(t)), i = yt(t) && Tt(e2.stage);
    return !r && !i || e2.effectiveLoginMethod !== `github` || !n || !e2.githubPassword ? null : {
      tabId: e2.tabId,
      runId: e2.runId,
      accountId: e2.accountId,
      siteId: e2.siteId,
      username: ``,
      password: ``,
      ...i ? { githubUsername: n, githubPassword: e2.githubPassword } : {},
      site: {
        id: `github-auth`,
        name: `GitHub`,
        loginUrl: `https://github.com/login`,
        pointerMode: e2.site.pointerMode,
        selectors: {
          username: `#login_field`,
          password: `#password`,
          submit: `input[name="commit"]`
        },
        closeModalSelectors: []
      },
      effectiveLoginMethod: `github`,
      effectiveCheckinMethod: e2.effectiveCheckinMethod,
      usesExtensionProxy: e2.usesExtensionProxy,
      createdAt: e2.createdAt,
      stage: e2.stage,
      steps: e2.steps
    };
  }
  async function wm(e2, t, n) {
    if (!t) return null;
    let r = await Tm(e2, n);
    return r ? Cm(r, t) : null;
  }
  async function Tm(e2, t) {
    let n = await bgCheckinState.Z.active();
    if (!n || n.tabId <= 0 || ((await bgCheckinState.H.get(e2))?.openerTabId ?? t) !== n.tabId)
      return null;
    let r = await bgCheckinState.V.get(n.tabId);
    return r?.runId && r.accountId === n.accountId ? r : null;
  }
  async function Em(e2) {
    await bgLearningState.Vm(e2);
  }
  async function qm(e2, t) {
    let n;
    for (let e3 of bgCheckinState.Km) {
      e3 && await new Promise((t2) => setTimeout(t2, e3));
      try {
        return await t(), true;
      } catch (e4) {
        n = e4;
      }
    }
    return console.error(`[任务收尾] ${e2}失败，已重试 ${bgCheckinState.Km.length} 次`, n), false;
  }
  async function Jm(e2) {
    await qm(`关闭标签页 ${e2}`, async () => {
      await Pp(e2);
    });
  }
  async function Ym(e2, n) {
    let i = n?.quotaAfter;
    if (i != null && Number.isFinite(i))
      try {
        let a = (await bgPlatformState.t.get(bgPlatformState.r.balances, {}))[e2];
        if (a && !a.error) return;
        await bgRecordsState.store.saveBalance(e2, {
          quota: i,
          usedQuota: a?.usedQuota ?? 0,
          ...n?.balanceSymbol ? { symbol: n.balanceSymbol } : {},
          at: Date.now(),
          source: `api`
        }), bgPlatformState.$();
      } catch {
      }
  }
  function Xm(e2, t, n) {
    setTimeout(() => void Zm(e2, t, n), 1200);
  }
  async function Zm(e2, n, i) {
    if (!n || !i) {
      await Jm(e2);
      return;
    }
    let a = [];
    try {
      let [o, s] = await Promise.all([
        bgPlatformState.t.get(bgPlatformState.r.accounts, []),
        bgCheckinState.Z.snapshot()
      ]);
      if (!ko({
        siteId: n,
        accountId: i,
        accounts: o,
        queue: { pendingAccountIds: s.pendingAccountIds, activeAccountId: s.active?.accountId }
      })) {
        await No(n, e2);
        return;
      }
      a = await Po(n);
    } catch {
      await Jm(e2);
      return;
    }
    for (let t of a) t !== e2 && await Jm(t);
    await Jm(e2);
  }
  async function Qm(e2, n) {
    let i = n.trim();
    i && await bgPlatformState.X(async () => {
      let n2 = await bgPlatformState.t.get(bgPlatformState.r.sites, []), a = n2.findIndex((t) => t.id === e2);
      if (a < 0) return { ok: true };
      let o = n2[a];
      if (!o.checkin) return { ok: true };
      let s = o.checkin.claimUsedTexts ?? [];
      if (s.includes(i)) return { ok: true };
      let c = [...s, i].slice(-60);
      return n2[a] = { ...o, checkin: { ...o.checkin, claimUsedTexts: c } }, await bgPlatformState.t.set(bgPlatformState.r.sites, n2), { ok: true };
    });
  }
  async function $m(e2) {
    return bgPlatformState.X(async () => {
      let { accounts: t, userSites: n, removedBuiltinSiteIds: r } = await bgEntryState.store.load(), i = new Set(r), a = /* @__PURE__ */ new Set([
        ...n.map((e3) => e3.id),
        ...bgSitesState.j.filter((e3) => !i.has(e3.id)).map((e3) => e3.id)
      ]), o = new Set(t.filter((e3) => a.has(e3.siteId)).map((e3) => e3.id)), s = e2.filter((e3) => o.has(e3));
      if (s.length === 0) return { ok: false, error: `没有找到已归属站点的可执行账号` };
      if (!await bgCheckinState.Z.busy()) {
        let e3 = await bgProxiesState.jm(`queue`);
        if (e3) return { ok: false, error: e3 };
      }
      let c = await bgCheckinState.Z.enqueue(s);
      return { ok: true, queued: c.queued, skipped: e2.length - c.queued };
    });
  }
  async function eh(e2) {
    let t = [...new Set(e2.filter(Boolean))];
    if (t.length === 0) return 0;
    let n = new Set(t), r = await bgCheckinState.Z.active(), i = Eo(await chrome.storage.session.get(null)).filter((e3) => n.has(e3.accountId)), a = new Set(i.map((e3) => e3.tabId).filter((e3) => e3 > 0));
    r && n.has(r.accountId) && r.tabId > 0 && a.add(r.tabId);
    for (let e3 of a)
      await bgCheckinState.V.remove(e3), await jh(e3, true).catch(() => {
      }), await Pp(e3).catch(() => {
      });
    let o = await bgCheckinState.Z.cancel(t), s = 0;
    for (let e3 of t) await bgCheckinState.V.clearInFlight(e3) && (s += 1);
    let c = new Set(i.map((e3) => e3.accountId)).size;
    return Math.max(o, s, c);
  }
  async function th(e2) {
    return (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).some(
      (t) => t.id === e2.accountId && t.siteId === e2.siteId
    );
  }
  async function manualWaitLeaseActive(task) {
    if (!task?.manualLoginWaitUntil) return true;
    const active = await bgCheckinState.Z.active();
    return task.manualLoginWaitUntil > Date.now() && active?.tabId === task.tabId && active?.accountId === task.accountId;
  }
  function wh(e2) {
    let t = e2.checkin?.url?.trim() || bgSitesState.pr(e2);
    if (!t) return e2.loginUrl;
    try {
      let n = new URL(t, e2.loginUrl);
      return N(e2, n.href) ? n.href : e2.loginUrl;
    } catch {
      return e2.loginUrl;
    }
  }
  function Th(e2) {
    return e2.adapter?.quotaPerUnit && e2.adapter.quotaPerUnit > 0 ? e2.adapter.quotaPerUnit : e2.adapter?.family === `new-api` ? 5e5 : 1;
  }
  async function Eh(e2, t = {}) {
    let n = M(e2);
    if (!n) return;
    let r = await chrome.tabs.query({ url: `${n}/*` }).catch(() => []);
    if (!t.preferCheckinPage) return (r.find((e3) => e3.active) ?? r[0])?.id;
    let i = wh(e2), a = r.find((e3) => Dh(e3.url, i));
    if (a) return a.id;
    if (Dh(e2.loginUrl, i)) return (r.find((e3) => e3.active) ?? r[0])?.id;
  }
  function Dh(e2, t) {
    if (!e2) return false;
    try {
      let n = new URL(e2), r = new URL(t), i = (e3) => e3.replace(/\/+$/, ``) || `/`;
      return n.origin === r.origin && i(n.pathname) === i(r.pathname);
    } catch {
      return false;
    }
  }
  async function Oh(e2, n) {
    let i = e2.proxyMode ?? `inherit`;
    if (i === `none`) return { ok: true };
    if (i === `custom`) {
      let t = e2.customProxy;
      return !t?.host || !t.port ? { ok: false, error: `账号选择了自定义代理，但地址或端口没填完整` } : {
        ok: true,
        proxy: {
          id: `account:${e2.id}`,
          name: `${t.host}:${t.port}`,
          scheme: t.scheme,
          host: t.host,
          port: t.port,
          ...t.username ? { username: t.username } : {},
          ...t.password ? { password: t.password } : {}
        }
      };
    }
    let a = i === `pool` ? e2.proxyId : n.proxyId;
    if (!a)
      return i === `pool` ? { ok: false, error: `账号选择了「使用代理池节点」，但没有指定是哪个` } : { ok: true };
    let o = (await bgPlatformState.t.get(bgPlatformState.r.proxies, [])).find((e3) => e3.id === a);
    return o ? bgSitesState.me(o) ? {
      ok: false,
      error: `「${o.name}」只是节点名称，没有浏览器能用的出口。请打开代理管理，选择 Clash Verge 配置并点击“同步配置”`
    } : { ok: true, proxy: o } : {
      ok: false,
      error: i === `pool` ? `账号配置的代理已不存在，请重新选择` : `站点配置的代理已不存在，请重新选择`
    };
  }
  async function kh(e2, t) {
    let n = `标签页导航未生效`;
    for (let r = 1; r <= 5; r += 1) {
      if (!await chrome.tabs.get(e2).catch(() => null)) throw Error(`任务标签页已关闭`);
      try {
        await chrome.tabs.update(e2, { url: t });
      } catch (e3) {
        n = e3 instanceof Error ? e3.message : String(e3), await new Promise((e4) => setTimeout(e4, 150 * r));
        continue;
      }
      let i = (() => {
        try {
          return new URL(t).origin;
        } catch {
          return null;
        }
      })();
      for (let t2 = 0; t2 < 10; t2 += 1) {
        await new Promise((e3) => setTimeout(e3, 100));
        let t3 = await chrome.tabs.get(e2).catch(() => null);
        if (!t3) throw Error(`任务标签页已关闭`);
        let n2 = t3.url ?? t3.pendingUrl ?? ``;
        if (i && n2 && new URL(n2).origin === i || n2 && n2 !== `about:blank` && !n2.startsWith(`chrome://`))
          return;
      }
      n = `标签页导航后仍未离开空白页`;
    }
    throw Error(bgProxiesState.Ee(n, await bgProxiesState.we().catch(() => null)));
  }
  async function Ah(e2, n) {
    let i = await bgPlatformState.t.get(bgPlatformState.r.accounts, []), a = i.find((t) => t.id === e2);
    if (!a) return { ok: false, error: `账号不存在` };
    let o = await bgPlatformState.t.get(bgPlatformState.r.sites, []), s = bgSitesState.Y(a.siteId, o);
    if (!s) return { ok: false, error: `站点配置不存在` };
    let d = s, f = bgAccountsState.jt(a, d), p = bgAccountsState.Mt(f.loginMethod);
    if (!p) return { ok: false, error: `本账号选择的登录方式无效，请重新选择` };
    if (!a.username?.trim())
      return { ok: false, error: `该账号缺少可核验的站点用户名或完整邮箱，请编辑账号后填写` };
    if (p.password && !a.password)
      return { ok: false, error: `该账号缺少站点密码；请编辑账号并选择「站点账号密码」后填写` };
    if (p.github && (!a.githubUsername?.trim() || !a.githubPassword))
      return { ok: false, error: `该账号的 GitHub 用户名或密码不完整；请编辑账号后补齐` };
    if (p.passkey && !a.passkey)
      return { ok: false, error: `该账号未启用 Passkey；请编辑账号并确认登录方式` };
    if (p.token && !a.apiToken?.trim() && !(p.sessionCounts && a.identity?.session?.accessToken))
      return { ok: false, error: `该账号没有可用的 API Token 或已抓取登录态` };
    let m = Et({
      ...d,
      loginMethod: f.loginMethod,
      checkin: { ...d.checkin, method: f.checkinMethod }
    });
    if (m.length) return { ok: false, error: `站点配置无效: ${m[0]}` };
    let h = f.checkinMethod === `none` ? (await bgPlatformState.t.get(bgPlatformState.r.balances, {}))[a.id] : void 0, g = i.filter((account) => account.siteId === d.id), _ = ![`github`, `oauth`, `passkey`, `manual`].includes(f.loginMethod) || a.identity?.source === `api` || f.loginMethod === `github` && a.identity?.verifiedByManagedLogin === true ? a.identity : void 0, v = a.identity?.userId ? g.find((e3) => e3.id !== a.id && e3.identity?.userId === a.identity?.userId) : void 0, y = v ? void 0 : _?.userId ?? (f.loginMethod !== `manual` && d.checkin?.method !== `workflow` && g.length === 1 ? d.adapter?.userId : void 0), b = !d.adapter && !y || d.adapter?.userId === y ? d : { ...d, adapter: { ...d.adapter, userId: y } }, x = await Oh(a, d);
    if (!x.ok) return { ok: false, error: x.error };
    let S = x.proxy;
    if (S) {
      let { active: e3 } = bgLearningState.Of(Object.entries(await chrome.storage.session.get(null)));
      if (e3.length > 0)
        return {
          ok: false,
          error: `有账号正在学习流程，学习会话占用着网络配置；请先结束学习再开始签到（两者不能同时使用代理）`
        };
    } else {
      let e3 = await bgProxiesState.we();
      if (e3) {
        let t2 = bgProxiesState.Qo(void 0, e3);
        if (t2) return { ok: false, error: t2 };
      }
      let t = await bgProxiesState.Am();
      if (t)
        return {
          ok: false,
          error: `${t === `scan` ? `本机端口扫描` : `代理测活`}正在使用网络配置，请完成后再开始签到`
        };
    }
    if (S) {
      let e3 = await bgProxiesState.Am();
      if (e3)
        return {
          ok: false,
          error: `${e3 === `scan` ? `本机端口扫描` : `代理测活`}正在使用网络配置，请完成后再开始签到`
        };
    }
    if (f.loginMethod !== `manual` && !bgSitesState.ce(d) && !S && !v && g.length === 1) {
      let e3 = await bgPlatformState.t.get(bgPlatformState.r.headlessStats, {});
      if (sa(e3, d.id, Date.now())) {
        let n2 = await nc(a, b), i2 = ca(e3, d.id, Ks(n2.verdict), Date.now());
        if (await bgPlatformState.t.set(bgPlatformState.r.headlessStats, i2), Ws(n2.verdict))
          return n2.balance && await bgRecordsState.store.saveBalance(a.id, n2.balance), {
            ok: true,
            completedResult: {
              accountId: a.id,
              ok: true,
              message: n2.message,
              steps: n2.steps,
              ...n2.metrics ? { metrics: n2.metrics } : {},
              via: `headless`
            }
          };
        if (!Gs(n2.verdict))
          return {
            ok: true,
            completedResult: {
              accountId: a.id,
              ok: false,
              message: n2.message,
              steps: n2.steps,
              ...n2.metrics ? { metrics: n2.metrics } : {},
              via: `headless`
            }
          };
        console.info(`[headless] ${d.name}/${a.username}: ${n2.verdict} ${n2.message}`);
      }
    }
    let C = await chrome.tabs.create({ url: `about:blank`, active: true }).catch(() => null);
    if (!C || C.id == null) return { ok: false, error: `无法创建标签页` };
    let w = Date.now(), T = a.githubUsername?.trim(), E = bgRecordsState.ki(h, w), loginEntry = sanitizeLoginEntry(a.loginEntry), D = {
      tabId: C.id,
      runId: bgPlatformState.Ti(`run`),
      accountId: a.id,
      siteId: d.id,
      username: a.username,
      ...f.loginMethod !== `manual` ? {
        password: a.password,
        ...T ? { githubUsername: T } : {},
        ...a.githubPassword ? { githubPassword: a.githubPassword } : {},
        ...a.apiToken ? { apiToken: a.apiToken } : {}
      } : {},
      ...a.passkey ? { passkey: true } : {},
      ...a.identity?.session ? { session: a.identity.session } : {},
      site: {
        ...b,
        loginEntry: loginEntry?.method === f.loginMethod ? loginEntry : void 0
      },
      loginMethodPreference: a.loginMethod || `auto`,
      effectiveLoginMethod: f.loginMethod,
      ...loginEntry?.method === f.loginMethod ? { loginEntry } : {},
      effectiveCheckinMethod: f.checkinMethod,
      usesExtensionProxy: !!S,
      ..._?.userId ? { accountIdentityUserId: _.userId } : {},
      ..._?.source === `api` && _.username ? { accountIdentityUsername: _.username } : {},
      ..._?.source === `api` && _.email ? { accountIdentityEmail: _.email } : {},
      siteAccountCount: g.length,
      siteAccountUserIds: Object.fromEntries(
        g.filter((e3) => e3.id !== a.id && e3.identity?.userId).map((e3) => [e3.identity.userId, e3.label || e3.username])
      ),
      createdAt: w,
      stage: `login`,
      ...E ? { context: { loginCheckinBalanceBefore: E } } : {},
      steps: [
        `扩展版本 ${bgPlatformState.im()}`,
        bgAccountsState.Nt(f),
        S ? (() => {
          let e3 = bgProxiesState._e(S), t = e3.scheme === S.scheme ? `` : `，已将本地 https 网关修正为 http`, n2 = (a.proxyMode ?? `inherit`) === `inherit` ? `站点` : `账号`;
          return `已启用扩展代理「${S.name}」(${e3.scheme}://${e3.host}:${e3.port}${t})，来自${n2}配置`;
        })() : `使用 Chrome/系统网络设置（扩展未覆盖代理）`,
        ...f.checkinMethod === `none` ? [E ? bgRecordsState.Pi : bgRecordsState.Vi(h, w)] : [],
        ...v ? [
          `检测到旧数据冲突：站点用户 ID ${a.identity.userId} 也绑定给账号 ${v.label || v.username}，已禁用 API 直连并改为页面重新核对`
        ] : []
      ]
    };
    try {
      if (S && !await bgProxiesState.W.acquire(C.id, S))
        throw Error(`代理正被其他签到任务占用，请等它完成后再试`);
      await bgCheckinState.V.start(C.id, D), await n(C.id), await kh(C.id, d.loginUrl);
    } catch (e3) {
      return await bgCheckinState.V.remove(C.id).catch(() => {
      }), await Pp(C.id).catch(() => {
      }), await bgProxiesState.W.release(C.id).catch(() => {
      }), { ok: false, error: e3 instanceof Error ? e3.message : String(e3) };
    }
    return bgPlatformState.$(), { ok: true, tabId: C.id };
  }
  async function jh(e2, t = false) {
    let n = await bgCheckinState.H.entriesOf(e2);
    for (let [r, i] of n) {
      if (!t && i.proxyRetained && i.proxyTransferred) {
        if (await chrome.tabs.get(r).then(() => true).catch(() => false) && (await bgProxiesState.W.holder() === e2 && await bgProxiesState.W.transfer(e2, r).catch(() => false), await bgProxiesState.W.holder() === r))
          continue;
        await bgCheckinState.H.forget(r);
      }
      i.proxyTransferred && (await bgCheckinState.H.clearProxyTransferred(r), await bgProxiesState.W.release(r));
    }
    await bgProxiesState.W.release(e2);
  }
  async function Mh(e2) {
    return bgPlatformState.rm(async () => {
      let t = await bgCheckinState.Z.active();
      if (e2.requireActive && (!t || t.tabId !== e2.tabId || e2.accountId && t.accountId !== e2.accountId))
        return false;
      let n = await bgCheckinState.V.take(e2.tabId, e2.runId, e2.accountId);
      if (!n) return false;
      try {
        e2.result ? await bgCheckinState.V.complete(e2.result) : e2.keepAttention ? await bgCheckinState.V.closedTab(
          n.accountId,
          e2.failure ?? `签到任务已中断`,
          n.steps ?? []
        ) : await bgCheckinState.V.fail(n.accountId, e2.failure ?? `签到任务已中断`, n.steps ?? []);
      } catch (t2) {
        throw await bgCheckinState.V.put(e2.tabId, n).catch(() => {
        }), t2;
      }
      return e2.closeTab && await Jm(e2.tabId), await qm(`释放代理`, () => jh(e2.tabId)), await qm(`推进签到队列`, () => bgCheckinState.Z.finish(e2.tabId)), bgPlatformState.$(), true;
    });
  }
  async function Nh(e2, t) {
    let n = await bgCheckinState.V.get(e2);
    if (!n) return;
    let r = n.usesExtensionProxy ?? !!n.site.proxyId, i = bgProxiesState.Pe(t, r, r ? await bgProxiesState.we() : null);
    i && await Mh({
      tabId: e2,
      runId: n.runId,
      accountId: n.accountId,
      failure: i,
      closeTab: true,
      requireActive: true
    });
  }
  async function Ph() {
    let e2 = await bgCheckinState.Z.active();
    const task = e2?.tabId > 0 ? await bgCheckinState.V.get(e2.tabId) : null;
    if (task?.manualLoginWaitUntil && (Date.now() >= task.manualLoginWaitUntil || Date.now() - e2.startedAt > bgCheckinState.Hp))
      return Mh({
        tabId: e2.tabId,
        runId: task.runId,
        accountId: e2.accountId,
        failure: `等待页面登录超过时限，后台已结束任务，请完成验证后重新签到`,
        closeTab: true,
        requireActive: true
      });
    !e2 || Date.now() - e2.startedAt <= bgCheckinState.Hp || (await bgCheckinState.V.statusOf(e2.accountId) === `attention` ? (await jh(e2.tabId).catch(() => {
    }), await bgCheckinState.Z.finish(e2.tabId), bgPlatformState.$()) : e2.tabId > 0 && await Mh({
      tabId: e2.tabId,
      accountId: e2.accountId,
      failure: `签到超过 10 分钟未完成，后台已结束任务`,
      closeTab: true,
      requireActive: true
    }) || await bgPlatformState.rm(async () => {
      let t = await bgCheckinState.Z.active();
      if (!t || t.accountId !== e2.accountId || t.tabId !== e2.tabId) return;
      t.tabId > 0 && (await Pp(t.tabId).catch(() => {
      }), await jh(t.tabId));
      let n = await bgCheckinState.V.statusOf(t.accountId);
      n !== `done` && n !== `failed` && await bgCheckinState.V.fail(t.accountId, `签到任务状态丢失，后台已安全结束`), await bgCheckinState.Z.finish(t.tabId), bgPlatformState.$();
    }));
  }
  async function Fh() {
    let [e2, i, a] = await Promise.all([
      bgPlatformState.t.get(bgPlatformState.r.status, {}),
      bgPlatformState.n.get(bgCheckinState.bo, { pendingAccountIds: [] }),
      chrome.storage.session.get(null)
    ]), o = Oo({
      statuses: e2,
      day: bgPlatformState.Ci(),
      activeAccountId: i.active?.accountId,
      pendingAccountIds: i.pendingAccountIds,
      liveAccountIds: Eo(a).map((e3) => e3.accountId)
    });
    if (o.length === 0) return;
    let s = 0;
    for (let e3 of o) await bgCheckinState.V.clearInFlight(e3) && (s += 1);
    s && bgPlatformState.$();
  }
  async function Ih(e2) {
    if (!e2) return;
    let t = await Po(e2).catch(() => []);
    for (let e3 of t) await Jm(e3).catch(() => {
    });
  }
  Object.assign(bgCheckinState, {
    qe,
    Je,
    Ye,
    Xe,
    Ze,
    Qe,
    $e,
    et,
    tt,
    nt,
    rt,
    it,
    at,
    ot,
    st,
    M,
    ct,
    lt,
    ut,
    N,
    dt,
    ft,
    pt,
    mt,
    ht,
    gt,
    _t,
    vt,
    yt,
    bt,
    wt,
    Tt,
    Et,
    Dt,
    wi,
    Ki,
    qi,
    Ji,
    Yi,
    Xi,
    Zi,
    Qi,
    $i,
    sa,
    ca,
    la,
    Co,
    wo,
    Eo,
    Oo,
    ko,
    Mo,
    No,
    Po,
    B,
    zo,
    Vo,
    Ho,
    Wo,
    Go,
    Ko,
    qo,
    Jo,
    ys,
    xs,
    Ss,
    js,
    Ms,
    Ns,
    Ps,
    Fs,
    Ws,
    Gs,
    Ks,
    Js,
    Ys,
    Xs,
    Zs,
    Qs,
    $s,
    ec,
    tc,
    nc,
    rc,
    Pp,
    Fp,
    Ip,
    Lp,
    Up,
    Wp,
    Gp,
    sm,
    cm,
    lm,
    um,
    dm,
    fm,
    pm,
    mm,
    hm,
    gm,
    _m,
    vm,
    ym,
    bm,
    xm,
    Sm,
    Cm,
    wm,
    Tm,
    Em,
    qm,
    Jm,
    Ym,
    Xm,
    Zm,
    Qm,
    $m,
    eh,
    th,
    wh,
    Th,
    Eh,
    Dh,
    Oh,
    kh,
    Ah,
    jh,
    Mh,
    Nh,
    Ph,
    Fh,
    Ih
  });
  async function handleCheckinMessage(e2, i) {
    switch (e2.type) {
      case `START_LOGIN`:
        return $m([e2.accountId]);
      case `START_BATCH`:
        return $m(e2.accountIds);
      case `CANCEL_CHECKIN`:
        return bgEntryState.Q(i) ? bgPlatformState.X(
          async () => bgPlatformState.rm(async () => {
            let t = await eh(e2.accountIds);
            return bgPlatformState.$(), { ok: true, feature: { stopped: t } };
          })
        ) : { ok: false, error: `仅扩展管理页可以停止签到` };
      case `GET_TASK`: {
        let e3 = i.tab?.id;
        if (e3 == null) return { ok: true, task: null };
        if (!bgProxiesState.Xn(i.frameId)) {
          let t2 = await bgPlatformState.n.get(bgLearningState.a(e3), null);
          return t2 && await bgLearningState.Fm(t2, i) ? { ok: true, task: null, feature: { learningSession: t2 } } : { ok: true, task: null };
        }
        let t = await bgCheckinState.V.get(e3);
        if (!t?.runId) {
          let t2 = await bgPlatformState.n.get(bgLearningState.a(e3), null);
          return t2 && await bgLearningState.Fm(t2, i) ? { ok: true, task: null, feature: { learningSession: t2 } } : { ok: true, task: await wm(e3, i.url ?? i.tab?.url, i.tab?.openerTabId) };
        }
        if (!await manualWaitLeaseActive(t)) {
          await Mh({
            tabId: e3,
            runId: t.runId,
            accountId: t.accountId,
            failure: `页面登录等待已结束，请完成验证后重新签到`,
            requireActive: false
          });
          return { ok: true, task: null };
        }
        if (!ut(t, i.url ?? i.tab?.url)) {
          let n = i.url ?? i.tab?.url ?? ``, r = Cm(t, n);
          return r ? { ok: true, task: r } : (t.stage === `verify-oauth` && !vt(n) && await bgCheckinState.V.markAttention(
            e3,
            t.runId,
            `OAuth 等待你在授权页面完成操作`,
            t.steps ?? []
          ) && bgPlatformState.$(), { ok: true, task: null });
        }
        return await bgCheckinState.V.resumeAttention(e3, t.runId) && bgPlatformState.$(), { ok: true, task: t };
      }
      case `RESOLVE_LOGIN_METHOD`:
        return bgPlatformState.X(async () => {
          const tabId = i.tab?.id, method = e2.method;
          if (tabId == null || i.id !== chrome.runtime.id || i.frameId !== 0 || ![`form`, `github`, `oauth`, `passkey`, `manual`].includes(method))
            return { ok: false, error: `只能由当前任务的本站顶层页面识别受支持的登录方式` };
          const task = await bgCheckinState.V.get(tabId);
          if (!task || task.runId !== e2.runId || (task.loginMethodPreference ?? `auto`) !== `auto` || ![
            `login`,
            `verify`,
            `verify-oauth`,
            `verify-manual`,
            `relogin`,
            `relogin-verify`,
            `relogin-verify-manual`
          ].includes(task.stage) || !N(task.site, i.url ?? i.tab?.url ?? ``))
            return { ok: false, error: `任务已结束或本账号不允许按当前页面识别登录方式` };
          const current = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find(
            (account) => account.id === task.accountId
          );
          if (!current || current.siteId !== task.siteId || current.loginMethod && current.loginMethod !== `auto` || !current.username?.trim() || current.username?.trim() !== task.username?.trim())
            return { ok: false, error: `本账号的登录偏好或站点归属已改变，已拒绝旧页面的识别结果` };
          if (method === `form` && (!task.username?.trim() || !task.password || current.password !== task.password))
            return { ok: false, error: `当前页面需要站点账号密码，请补齐本账号的站点登录凭据` };
          if (method === `github` && (!task.githubUsername?.trim() || !task.githubPassword || current.githubUsername?.trim() !== task.githubUsername.trim() || current.githubPassword !== task.githubPassword))
            return { ok: false, error: `当前页面需要 GitHub 登录，请补齐本账号的 GitHub 用户名和密码` };
          if (method === `passkey` && (!current.passkey || !task.passkey))
            return { ok: false, error: `本账号尚未启用 Passkey，请在账号设置中启用后重试` };
          const entry = sanitizeLoginEntry(e2.loginEntry);
          if (e2.loginEntry != null && (!entry || entry.method !== method))
            return { ok: false, error: `当前页面的具体登录入口与识别方式不一致` };
          const resolved = await bgCheckinState.V.resolveLoginMethod(
            tabId,
            task.runId,
            method,
            entry
          );
          return resolved ? {
            ok: true,
            feature: {
              effectiveLoginMethod: resolved.effectiveLoginMethod,
              ...resolved.loginEntry ? { loginEntry: resolved.loginEntry } : {}
            }
          } : { ok: false, error: `任务已结束，未能保存页面识别的登录方式` };
        });
      case `FORM_CREDENTIALS_SUBMITTED`:
        return bgPlatformState.X(async () => {
          let tabId = i.tab?.id;
          if (tabId == null || i.id !== chrome.runtime.id || i.frameId !== 0)
            return { ok: false, error: `只能由当前任务的本站顶层页面确认账密提交` };
          let task = await bgCheckinState.V.get(tabId);
          if (!task || task.runId !== e2.runId || task.effectiveLoginMethod !== `form` || ![`login`, `verify`, `relogin`, `relogin-verify`].includes(task.stage) || !ut(task, i.url ?? i.tab?.url ?? ``))
            return { ok: false, error: `任务已结束或当前页面不允许确认站点账密提交` };
          let current = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find(
            (account) => account.id === task.accountId
          );
          if (!current || current.siteId !== task.siteId || !task.username?.trim() || !task.password || current.username?.trim() !== task.username.trim() || current.password !== task.password)
            return { ok: false, error: `本轮登录凭据或账号归属已改变，已拒绝确认提交` };
          return await bgCheckinState.V.setFormCredentialsSubmitted(tabId, task.runId, true) ? { ok: true, feature: { formCredentialsSubmitted: true } } : { ok: false, error: `任务已结束，未能保存账密提交状态` };
        });
      case `SET_STAGE`: {
        let t = i.tab?.id;
        if (t != null && !await manualWaitLeaseActive(await bgCheckinState.V.get(t)))
          return { ok: false, error: `页面登录等待已结束，请重新签到` };
        return t == null ? { ok: false, error: `缺少任务标签页` } : await bgCheckinState.V.updateStage(
          t,
          e2.runId,
          e2.stage,
          e2.steps,
          e2.resetLoginMethod === true
        ) ? (bgPlatformState.$(), { ok: true }) : { ok: false, error: `任务已结束` };
      }
      case `GITHUB_LOGOUT_COMPLETE`: {
        let t = i.tab?.id, n = i.url ?? i.tab?.url;
        if (t == null || !gt(n) && !_t(n))
          return { ok: false, error: `仅 GitHub 官方退出流程可以完成账号切换` };
        let r = await bgCheckinState.V.get(t);
        if (!r || r.runId !== e2.runId || r.stage !== `github-logout` || r.effectiveLoginMethod !== `github` || !r.githubUsername || !r.githubPassword)
          return { ok: false, error: `任务已结束或不允许切换 GitHub 账号` };
        let a = [...e2.steps, `当前 GitHub 会话已退出，返回站点并登录目标账号`];
        return await bgCheckinState.V.setGithubCredentialsSubmitted(t, r.runId, false), await bgCheckinState.V.updateStage(t, r.runId, `login`, a) ? (bgPlatformState.$(), await chrome.tabs.update(t, { url: r.site.loginUrl }), { ok: true }) : { ok: false, error: `任务已结束` };
      }
      case `CONFIRM_IDENTITY`: {
        let t = i.tab?.id;
        if (t != null && !await manualWaitLeaseActive(await bgCheckinState.V.get(t)))
          return { ok: false, error: `页面登录等待已结束，请重新签到` };
        return t == null ? { ok: false, error: `缺少任务标签页` } : await bgCheckinState.V.confirmIdentity(t, e2.runId) ? { ok: true } : { ok: false, error: `任务已结束` };
      }
      case `SAVE_WORKFLOW_ROUTE`: {
        let t = i.tab?.id;
        if (t == null) return { ok: false, error: `缺少任务标签页` };
        let n = await bgCheckinState.V.get(t);
        return !n || !bgProxiesState.Xn(i.frameId) || !N(n.site, i.url ?? i.tab?.url ?? ``) ? { ok: false, error: `只能由当前任务的本站顶层页面保存学习路线` } : await bgCheckinState.V.saveWorkflowRouteIndex(t, e2.runId, e2.index) ? { ok: true } : { ok: false, error: `任务已结束或学习路线进度无效` };
      }
      case `NEEDS_USER`: {
        let t = i.tab?.id;
        if (t == null) return { ok: false, error: `缺少任务标签页` };
        let n = (await bgCheckinState.V.get(t))?.runId ? t : yt(i.url ?? i.tab?.url) ? (await bgCheckinState.Z.active())?.tabId ?? t : t;
        return ht(i.url ?? i.tab?.url) && await bgCheckinState.V.setGithubCredentialsSubmitted(n, e2.runId, false), await bgCheckinState.V.markAttention(n, e2.runId, e2.message, e2.steps) ? (await jh(n).catch(() => {
        }), await bgCheckinState.Z.finish(n), bgPlatformState.$(), { ok: true }) : { ok: false, error: `任务已结束` };
      }
      case `MANUAL_LOGIN_WAITING`:
        return bgPlatformState.rm(async () => {
          const tabId = i.tab?.id;
          if (tabId == null || i.id !== chrome.runtime.id || i.frameId !== 0)
            return { ok: false, error: `只能由当前任务的本站顶层页面等待页面登录` };
          const task = await bgCheckinState.V.get(tabId), active = await bgCheckinState.Z.active();
          if (!task || task.runId !== e2.runId || task.effectiveLoginMethod !== `manual` || ![`verify-manual`, `relogin-verify-manual`].includes(task.stage) || !N(task.site, i.url ?? i.tab?.url ?? ``) || !active || active.tabId !== tabId || active.accountId !== task.accountId || !await th(task))
            return { ok: false, error: `页面登录任务已结束或不再持有当前执行队列` };
          if (typeof e2.message !== `string` || !Array.isArray(e2.steps))
            return { ok: false, error: `页面登录等待提示格式无效` };
          const deadline = task.manualLoginWaitUntil ?? Math.min(Date.now() + 3e5, active.startedAt + bgCheckinState.Hp);
          if (!Number.isFinite(deadline) || deadline <= Date.now())
            return { ok: false, error: `页面登录等待已超时，请重新签到` };
          const attention = await bgCheckinState.V.markAttention(
            tabId,
            task.runId,
            e2.message,
            e2.steps
          );
          if (!attention) return { ok: false, error: `任务已结束` };
          await bgCheckinState.V.update(
            tabId,
            (current) => current.runId === task.runId ? { ...current, manualLoginWaitUntil: deadline } : current
          );
          bgPlatformState.$();
          return { ok: true, feature: { manualLoginWaitUntil: deadline } };
        });
      case `TASK_RESULT`: {
        let t = i.tab?.id;
        if (t == null) return { ok: false, error: `缺少任务标签页` };
        let n = await bgCheckinState.V.get(t), r = e2.result.ok && (n?.siteAccountCount ?? 0) > 1 && !n?.identityConfirmed ? {
          accountId: n?.accountId ?? e2.result.accountId,
          ok: false,
          message: `本轮未确认当前页面属于该账号，已拒绝记录签到成功和增加量`,
          steps: [
            ...e2.result.steps ?? [],
            `最终身份闸门未通过：多账号站点必须先确认页面账号，结果已改记为失败`
          ]
        } : e2.result, a = await Mh({
          tabId: t,
          runId: e2.runId,
          accountId: r.accountId,
          result: r,
          requireActive: true
        });
        return a && r.ok && (await Ym(r.accountId, r.metrics), Xm(t, n?.siteId, r.accountId)), a && !r.ok && await Ih(n?.siteId), a ? { ok: true } : { ok: false, error: `任务已结束` };
      }
      case `GET_LIVE_TASKS`: {
        if (!bgEntryState.Q(i)) return { ok: false, error: `仅扩展管理页可以查询实时状态` };
        let [e3, t] = await Promise.all([
          chrome.storage.session.get(null),
          bgPlatformState.n.get(bgCheckinState.bo, { pendingAccountIds: [] })
        ]);
        return {
          ok: true,
          feature: { live: Eo(e3), queue: { active: t.active, pending: t.pendingAccountIds } }
        };
      }
      case `SYNC_PROGRESS`: {
        let t = i.tab?.id;
        return t == null ? { ok: false, error: `缺少任务标签页` } : await bgCheckinState.V.updateProgress(t, e2.runId, e2.steps) ? (bgPlatformState.$(), { ok: true }) : { ok: false, error: `任务已结束` };
      }
      case `CLAIM_TEXT_USED`: {
        let t = i.tab?.id;
        if (t == null) return { ok: false, error: `缺少任务标签页` };
        let n = await bgCheckinState.V.get(t);
        return !n || n.runId !== e2.runId ? { ok: false, error: `任务已结束` } : n.site.id === e2.siteId ? (await Qm(e2.siteId, e2.text), { ok: true }) : { ok: false, error: `站点与当前任务不一致` };
      }
    }
  }
  async function handleCheckinMutation(e2) {
    switch (e2.action) {
      case `update-schedule`:
        return await bgCheckinState.store.updateSchedule(e2.schedule), await gm(), { ok: true };
      case `set-status`:
        return await bgCheckinState.V.setStatus(e2.accountId, e2.value), { ok: true };
      case `mark-done`:
        return await bgCheckinState.V.markDone(e2.accountId), { ok: true };
    }
  }
  function initializeBackgroundCheckin(step) {
    switch (step) {
      case 3: {
        bgCheckinState.i = (e2) => `task:${e2}`;
        break;
      }
      case 5: {
        bgCheckinState.o = [
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
        break;
      }
      case 6: {
        bgCheckinState.s = [
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
        break;
      }
      case 7: {
        bgCheckinState.c = [
          `input[autocomplete="current-password"]`,
          `#password`,
          `input[name="password"]`,
          `input[type="password"]`
        ];
        break;
      }
      case 8: {
        [`button:has(> span:only-child)`, `.checkin-btn`, `#checkin`, `[data-testid="checkin"]`].join(
          `, `
        );
        break;
      }
      case 42: {
        bgCheckinState.Le = 30;
        break;
      }
      case 43: {
        bgCheckinState.Re = 3e4;
        break;
      }
      case 44: {
        bgCheckinState.ze = 4;
        break;
      }
      case 45: {
        bgCheckinState.Be = 300;
        break;
      }
      case 46: {
        bgCheckinState.Ve = 200;
        break;
      }
      case 47: {
        bgCheckinState.He = 1e4;
        break;
      }
      case 48: {
        bgCheckinState.Ue = 12;
        break;
      }
      case 49: {
        bgCheckinState.We = /* @__PURE__ */ new Set([
          `Enter`,
          `Space`,
          `Escape`,
          `Tab`,
          `ArrowUp`,
          `ArrowDown`,
          `ArrowLeft`,
          `ArrowRight`
        ]);
        break;
      }
      case 50: {
        bgCheckinState.Ge = /* @__PURE__ */ new Set([`click`, `double`, `right`, `long-press`]);
        break;
      }
      case 51: {
        bgCheckinState.Ke = /* @__PURE__ */ new Set([`text`, `select`, `checkbox`, `radio`]);
        break;
      }
      case 52: {
        bgCheckinState.xt = /(?:^|\.)accounts\.google\.com$|(?:^|\.)github\.com$|(?:^|\.)login\.microsoftonline\.com$|(?:^|\.)login\.live\.com$|(?:^|\.)appleid\.apple\.com$|(?:^|\.)discord(?:app)?\.com$|(?:^|\.)linux\.do$/i;
        break;
      }
      case 53: {
        bgCheckinState.St = /(?:^|\/)(?:oauth2?|authorize|authorization|auth|sso|signin|sign-in|login|account|openid|connect|consent|identity|passkey|webauthn)(?:\/|$)/i;
        break;
      }
      case 54: {
        bgCheckinState.Ct = /(?:^|[?&])(?:client_id|redirect_uri|response_type|code_challenge|code_verifier|scope|state|oauth|openid|sso)=/i;
        break;
      }
      case 111: {
        bgCheckinState.Wi = { enabled: false, time: `09:00`, weekdays: [1, 2, 3, 4, 5] };
        break;
      }
      case 112: {
        bgCheckinState.Gi = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
        break;
      }
      case 115: {
        bgCheckinState.aa = 864e5;
        break;
      }
      case 116: {
        bgCheckinState.oa = () => ({ consecutiveFailures: 0 });
        break;
      }
      case 146: {
        Object.assign(bgCheckinState.store, {
          updateSchedule(e2) {
            return bgPlatformState.R(async () => {
              await bgPlatformState.t.set(bgPlatformState.r.schedule, Ki(e2));
            });
          }
        });
        break;
      }
      case 147: {
        Object.assign(bgCheckinState.store, {
          async setStatus(e2, n) {
            return bgPlatformState.R(async () => {
              let i = await bgPlatformState.t.get(bgPlatformState.r.status, {});
              return n === `pending` ? delete i[e2] : i[e2] = n, await bgPlatformState.t.set(bgPlatformState.r.status, i), { ...i };
            });
          }
        });
        break;
      }
      case 148: {
        Object.assign(bgCheckinState.store, {
          async clearInFlightStatus(e2) {
            return bgPlatformState.R(async () => {
              let n = await bgPlatformState.t.get(bgPlatformState.r.status, {});
              return n[e2] !== `running` && n[e2] !== `attention` ? false : (delete n[e2], await bgPlatformState.t.set(bgPlatformState.r.status, n), true);
            });
          }
        });
        break;
      }
      case 149: {
        Object.assign(bgCheckinState.store, {
          async getStatus(e2) {
            return (await bgPlatformState.t.get(bgPlatformState.r.status, {}))[e2];
          }
        });
        break;
      }
      case 150: {
        Object.assign(bgCheckinState.store, {
          markDone(e2) {
            return bgPlatformState.R(async () => {
              let [n, i, a] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.status, {}),
                bgPlatformState.t.get(bgPlatformState.r.results, {}),
                bgPlatformState.t.get(bgPlatformState.r.balances, {})
              ]), o = bgRecordsState._a(e2, a[e2]);
              n[wi(e2)] = `done`, i[e2] = { ...o, at: Date.now() }, await bgPlatformState.t.setMany({
                [bgPlatformState.r.status]: n,
                [bgPlatformState.r.results]: i
              });
            });
          }
        });
        break;
      }
      case 151: {
        Object.assign(bgCheckinState.store, {
          async setStatusUnlessTerminal(e2, n) {
            return bgPlatformState.R(async () => {
              let i = await bgPlatformState.t.get(bgPlatformState.r.status, {});
              return i[e2] === `done` || i[e2] === `failed` ? false : (n === `pending` ? delete i[e2] : i[e2] = n, await bgPlatformState.t.set(bgPlatformState.r.status, i), true);
            });
          }
        });
        break;
      }
      case 152: {
        Object.assign(bgCheckinState.store, {
          async setStatusIfExpected(e2, n, i) {
            return bgPlatformState.R(async () => {
              let a = await bgPlatformState.t.get(bgPlatformState.r.status, {});
              return a[e2] === n && (i === `pending` ? delete a[e2] : a[e2] = i, await bgPlatformState.t.set(bgPlatformState.r.status, a), true);
            });
          }
        });
        break;
      }
      case 153: {
        Object.assign(bgCheckinState.store, {
          setStatusAndResult(e2, n) {
            return bgPlatformState.R(async () => {
              let [i, a] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.status, {}),
                bgPlatformState.t.get(bgPlatformState.r.results, {})
              ]);
              i[wi(n.accountId)] = e2, a[n.accountId] = { ...n, at: Date.now() }, await bgPlatformState.t.setMany({
                [bgPlatformState.r.status]: i,
                [bgPlatformState.r.results]: a
              });
            });
          }
        });
        break;
      }
      case 154: {
        Object.assign(bgCheckinState.store, {
          setOutcome(e2) {
            return this.setStatusAndResult(e2.ok ? `done` : `failed`, e2);
          }
        });
        break;
      }
      case 155: {
        bgCheckinState.bo = `checkinQueue`;
        break;
      }
      case 156: {
        bgCheckinState.xo = () => ({ pendingAccountIds: [] });
        break;
      }
      case 157: {
        bgCheckinState.So = 6e4;
        break;
      }
      case 158: {
        bgCheckinState.To = `task:`;
        break;
      }
      case 159: {
        bgCheckinState.Do = /* @__PURE__ */ new Set([`running`, `attention`]);
        break;
      }
      case 160: {
        bgCheckinState.Ao = (e2) => `keptSiteTabs:${e2}`;
        break;
      }
      case 161: {
        bgCheckinState.jo = Promise.resolve();
        break;
      }
      case 162: {
        bgCheckinState.Fo = Promise.resolve();
        break;
      }
      case 163: {
        bgCheckinState.V = {
          get(e2) {
            return bgPlatformState.n.get(bgCheckinState.i(e2), null);
          },
          async rebind(e2, t, r) {
            return B(async () => {
              let a = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              return !a || a.runId !== r ? null : (await bgPlatformState.n.set(bgCheckinState.i(t), { ...a, tabId: t }), await bgPlatformState.n.remove(bgCheckinState.i(e2)), { ...a, tabId: t });
            });
          },
          put(e2, t) {
            return B(() => bgPlatformState.n.set(bgCheckinState.i(e2), t));
          },
          update(e2, t) {
            return B(async () => {
              let r = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              if (!r) return null;
              let a = t(r);
              return a === r ? r : (await bgPlatformState.n.set(bgCheckinState.i(e2), a), a);
            });
          },
          start(e2, t) {
            return B(async () => {
              await bgPlatformState.n.set(bgCheckinState.i(e2), t), await bgCheckinState.store.setStatus(wi(t.accountId), `running`);
            });
          },
          remove(e2) {
            return B(() => bgPlatformState.n.remove(bgCheckinState.i(e2)));
          },
          take(e2, t, r) {
            return B(async () => {
              let a = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              return !a || t && a.runId !== t || r && a.accountId !== r ? null : (await bgPlatformState.n.remove(bgCheckinState.i(e2)), a);
            });
          },
          updateStage(e2, t, r, a, resetLoginMethod = false) {
            return B(async () => {
              let o = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              if (!o || o.runId !== t) return null;
              let s = { ...o, stage: r, steps: a };
              if (![`verify-manual`, `relogin-verify-manual`].includes(r))
                delete s.manualLoginWaitUntil;
              return (r === `login` || r === `github-logout` || r === `relogin`) && (s.identityConfirmed = false, delete s.workflowRouteIndex, s.formCredentialsSubmitted = false, s.loginMethodPreference === `auto` && r !== `github-logout` && (o.stage !== r || resetLoginMethod) && (s.effectiveLoginMethod = `auto`, delete s.loginEntry, s.site = { ...s.site, loginEntry: void 0 }, s.githubCredentialsSubmitted = false), r !== `relogin` && (s.githubCredentialsSubmitted = false)), await bgPlatformState.n.set(bgCheckinState.i(e2), s), await bgCheckinState.store.setStatusUnlessTerminal(wi(o.accountId), `running`), s;
            });
          },
          updateProgress(e2, t, r) {
            return B(async () => {
              let a = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              if (!a || a.runId !== t) return null;
              if (r.length < (a.steps?.length ?? 0)) return a;
              let o = { ...a, steps: r };
              return await bgPlatformState.n.set(bgCheckinState.i(e2), o), o;
            });
          },
          saveReloginBalanceBefore(e2, t, r) {
            return B(async () => {
              let a = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              if (!a || a.runId !== t) return null;
              let o = { ...a, context: { ...a.context, balanceBefore: r } };
              return await bgPlatformState.n.set(bgCheckinState.i(e2), o), o;
            });
          },
          saveButtonBalanceBefore(e2, t, r) {
            return B(async () => {
              let a = await bgPlatformState.n.get(bgCheckinState.i(e2), null), o = a?.effectiveCheckinMethod ?? a?.site.checkin?.method;
              if (!a || a.runId !== t || a.stage !== `checkin` || o !== `button` || (a.siteAccountCount ?? 0) > 1 && !a.identityConfirmed)
                return null;
              let s = { ...a, context: { ...a.context, balanceBefore: r, buttonCheckinPending: true } };
              return await bgPlatformState.n.set(bgCheckinState.i(e2), s), s;
            });
          },
          saveWorkflowRouteIndex(e2, t, r) {
            return B(async () => {
              let a = await bgPlatformState.n.get(bgCheckinState.i(e2), null), o = a?.site.checkin?.workflow?.route;
              if (!a || a.runId !== t || !o?.length || !Number.isInteger(r) || r < 0 || r >= o.length)
                return null;
              if (a.workflowRouteIndex !== void 0 && r < a.workflowRouteIndex) return a;
              let s = { ...a, workflowRouteIndex: r };
              return await bgPlatformState.n.set(bgCheckinState.i(e2), s), s;
            });
          },
          confirmIdentity(e2, t) {
            return B(async () => {
              let r = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              if (!r || r.runId !== t) return null;
              let a = { ...r, identityConfirmed: true };
              return await bgPlatformState.n.set(bgCheckinState.i(e2), a), a;
            });
          },
          setGithubCredentialsSubmitted(e2, t, r) {
            return B(async () => {
              let a = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              if (!a || a.runId !== t || a.effectiveLoginMethod !== `github`) return null;
              let o = { ...a, githubCredentialsSubmitted: r };
              return await bgPlatformState.n.set(bgCheckinState.i(e2), o), o;
            });
          },
          setFormCredentialsSubmitted(e2, t, r) {
            return B(async () => {
              let a = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              if (!a || a.runId !== t || a.effectiveLoginMethod !== `form`) return null;
              let o = { ...a, formCredentialsSubmitted: r };
              return await bgPlatformState.n.set(bgCheckinState.i(e2), o), o;
            });
          },
          resolveLoginMethod(e2, t, method, entry = null) {
            return B(async () => {
              const task = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              if (!task || task.runId !== t || (task.loginMethodPreference ?? `auto`) !== `auto`)
                return null;
              const sameEntry = JSON.stringify(task.loginEntry ?? null) === JSON.stringify(entry);
              if (task.effectiveLoginMethod === method && sameEntry) return task;
              const resolved = {
                ...task,
                site: { ...task.site, loginEntry: entry || void 0 },
                effectiveLoginMethod: method,
                identityConfirmed: false,
                formCredentialsSubmitted: false,
                githubCredentialsSubmitted: false
              };
              if (entry) resolved.loginEntry = entry;
              else delete resolved.loginEntry;
              delete resolved.workflowRouteIndex;
              await bgPlatformState.n.set(bgCheckinState.i(e2), resolved);
              return resolved;
            });
          },
          updateIdentity(e2, t, r) {
            return B(async () => {
              let a = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              if (!a || a.runId !== t) return null;
              let o = { ...a.siteAccountUserIds ?? {} };
              if (r.userId && (o[r.userId] || a.accountIdentityUserId && a.accountIdentityUserId !== r.userId))
                return null;
              let s = {
                ...a,
                ...r.userId ? { accountIdentityUserId: r.userId } : {},
                ...r.username ? { accountIdentityUsername: r.username } : {},
                ...r.email ? { accountIdentityEmail: r.email } : {},
                siteAccountUserIds: o,
                ...r.userId ? { site: { ...a.site, adapter: { ...a.site.adapter, userId: r.userId } } } : {}
              };
              return await bgPlatformState.n.set(bgCheckinState.i(e2), s), s;
            });
          },
          resumeAttention(e2, t) {
            return B(async () => {
              let r = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              return !r || r.runId !== t ? false : bgCheckinState.store.setStatusIfExpected(wi(r.accountId), `attention`, `running`);
            });
          },
          markAttention(e2, t, r, a) {
            return B(async () => {
              let o = await bgPlatformState.n.get(bgCheckinState.i(e2), null);
              if (!o || o.runId !== t) return null;
              let s = { ...o, steps: a };
              return await bgPlatformState.n.set(bgCheckinState.i(e2), s), await bgCheckinState.store.setStatusAndResult(`attention`, {
                accountId: o.accountId,
                ok: false,
                message: r,
                steps: a
              }), s;
            });
          },
          async setStatus(e2, t) {
            await bgCheckinState.store.setStatus(wi(e2), t);
          },
          async markDone(e2) {
            await bgCheckinState.store.markDone(e2);
          },
          async clearInFlight(e2) {
            return bgCheckinState.store.clearInFlightStatus(wi(e2));
          },
          async statusOf(e2) {
            return bgCheckinState.store.getStatus(wi(e2));
          },
          complete(e2) {
            return B(() => bgCheckinState.store.setOutcome(e2));
          },
          fail(e2, t, n = []) {
            return B(
              () => bgCheckinState.store.setOutcome({ accountId: e2, ok: false, message: t, steps: n })
            );
          },
          closedTab(e2, t, n = []) {
            return B(
              async () => await bgCheckinState.store.getStatus(wi(e2)) === `attention` || (await bgCheckinState.store.setOutcome({
                accountId: e2,
                ok: false,
                message: t,
                steps: n
              }), false)
            );
          }
        };
        break;
      }
      case 164: {
        bgCheckinState.Lo = `oauthPopupOpeners`;
        break;
      }
      case 165: {
        bgCheckinState.Ro = Promise.resolve();
        break;
      }
      case 166: {
        bgCheckinState.Bo = () => bgPlatformState.n.get(bgCheckinState.Lo, {});
        break;
      }
      case 167: {
        bgCheckinState.Uo = (e2) => chrome.tabs.get(e2).then(() => true).catch(() => false);
        break;
      }
      case 168: {
        bgCheckinState.H = {
          remember(e2, t) {
            return zo(
              () => Ho((n) => {
                let r = n[String(e2)];
                n[String(e2)] = { ...r, openerTabId: t };
              })
            );
          },
          get(e2) {
            return zo(async () => (await bgCheckinState.Bo())[String(e2)]);
          },
          entries() {
            return zo(
              async () => Object.entries(await bgCheckinState.Bo()).map(([e2, t]) => [Number(e2), t])
            );
          },
          entriesOf(e2) {
            return zo(
              async () => Object.entries(await bgCheckinState.Bo()).filter(([, t]) => t.openerTabId === e2).map(([e3, t]) => [Number(e3), t])
            );
          },
          markProxyTransferred(e2, t) {
            return zo(
              () => Ho((n) => {
                let r = String(e2), i = n[r];
                i && (n[r] = { ...i, provider: t, proxyTransferred: true });
              })
            );
          },
          clearProxyTransferred(e2) {
            return zo(
              () => Ho((t) => {
                let n = String(e2), r = t[n];
                r && (t[n] = { ...r, proxyTransferred: false, proxyRetained: false });
              })
            );
          },
          markProxyRetained(e2, t = true) {
            return zo(
              () => Ho((n) => {
                let r = String(e2), i = n[r];
                i && (n[r] = { ...i, proxyRetained: t });
              })
            );
          },
          forget(e2) {
            return zo(
              () => Ho((t) => {
                delete t[String(e2)];
              })
            );
          },
          transferredPopupsOf(e2) {
            return zo(
              async () => Object.entries(await bgCheckinState.Bo()).filter(([, t]) => t.openerTabId === e2 && t.proxyTransferred).map(([e3]) => Number(e3))
            );
          },
          transferredPopups() {
            return zo(
              async () => Object.entries(await bgCheckinState.Bo()).filter(([, e2]) => e2.proxyTransferred).map(([e2]) => Number(e2))
            );
          },
          pruneDeadTabs() {
            return zo(async () => {
              let e2 = await bgCheckinState.Bo(), t = Object.keys(e2);
              if (!t.length) return [];
              let n = await Promise.all(t.map((e3) => bgCheckinState.Uo(Number(e3)))), r = {}, i = [];
              return t.forEach((t2, a) => {
                n[a] ? r[t2] = e2[t2] : i.push([Number(t2), e2[t2]]);
              }), Object.keys(r).length !== t.length && await Vo(r), i;
            });
          }
        };
        break;
      }
      case 177: {
        bgCheckinState._s = {
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
        break;
      }
      case 178: {
        bgCheckinState.vs = RegExp(`[${Object.keys(bgCheckinState._s).join(``)}]`, `g`);
        break;
      }
      case 179: {
        bgCheckinState.bs = /* @__PURE__ */ new Map();
        break;
      }
      case 180: {
        for (let [e2, t] of Object.entries(bgCheckinState._s))
          bgCheckinState.bs.set(t, `${bgCheckinState.bs.get(t) ?? ``}${e2}`);
        break;
      }
      case 181: {
        bgCheckinState.Cs = [
          `签到成功`,
          `打卡成功`,
          `领取成功`,
          `奖励到账`,
          `已生效`,
          `check-in success`,
          `checked in successfully`
        ];
        break;
      }
      case 182: {
        bgCheckinState.ws = [
          `已签到`,
          `已经签到`,
          `今日已`,
          `重复签到`,
          `already checked`,
          `already signed`,
          `已打卡`,
          `已领取`
        ];
        break;
      }
      case 183: {
        bgCheckinState.Ts = [`抽奖成功`, `抽奖完成`, `开奖成功`, `draw successful`];
        break;
      }
      case 184: {
        bgCheckinState.Es = [
          `今日梦火抽签次数已耗尽`,
          `This draw is complete`,
          `You have already drawn today`
        ];
        break;
      }
      case 185: {
        bgCheckinState.Ds = xs(/抽奖|抽签|翻牌|\b(?:start\s+)?draw\b/i);
        break;
      }
      case 186: {
        xs(
          /(?:签到|打卡|领取|check[\s-]?in|sign[\s-]?in|claim|daily\s*(?:bonus|reward|credit)|每日(?:奖励|福利|额度))/i
        ), xs(/(?:历史|记录|规则|日历|说明|明细|详情|history|calendar|rule|record|detail)/i);
        break;
      }
      case 187: {
        bgCheckinState.Os = {
          checkin: [
            `/api/user/checkin`,
            `/api/user/check_in`,
            `/api/user/clock_in`,
            `/api/user/daily_checkin`,
            `/api/user/sign_in`
          ],
          balance: [`/api/user/self`, `/api/user/info`],
          auth: `userIdHeaders`,
          method: `POST`
        };
        break;
      }
      case 188: {
        bgCheckinState.ks = {
          checkin: [`/api/v1/check-in`],
          balance: [`/api/v1/check-in/status`, `/api/v1/auth/me`],
          auth: `bearer`,
          method: `POST`
        };
        break;
      }
      case 189: {
        bgCheckinState.As = {
          [bgSitesState.d.NEW_API]: bgCheckinState.Os,
          [bgSitesState.d.SUB2API]: bgCheckinState.ks,
          [bgSitesState.d.VO_API_V2]: {
            checkin: [`/api/user/checkin`],
            balance: [`/api/user/self`, `/api/user/info`],
            auth: `bearer`,
            method: `POST`
          },
          [bgSitesState.d.UNSUPPORTED]: null
        };
        break;
      }
      case 190: {
        bgCheckinState.Vs = 8e3;
        break;
      }
      case 191: {
        bgCheckinState.Hs = 25e3;
        break;
      }
      case 192: {
        bgCheckinState.Us = 1200;
        break;
      }
      case 193: {
        bgCheckinState.qs = {
          fetch: (...e2) => fetch(...e2),
          now: () => Date.now(),
          sleep: (e2) => new Promise((t) => setTimeout(t, e2))
        };
        break;
      }
      case 298: {
        bgCheckinState.Rp = `checkin-queue-watchdog`;
        break;
      }
      case 299: {
        bgCheckinState.zp = `checkin-schedule`;
        break;
      }
      case 301: {
        bgCheckinState.Vp = `checkinScheduleLastRun`;
        break;
      }
      case 302: {
        bgCheckinState.Hp = 6e5;
        break;
      }
      case 311: {
        bgCheckinState.Z = wo({
          launch: Ah,
          async fail(e2, t) {
            let n = await bgCheckinState.V.statusOf(e2);
            n !== `done` && n !== `failed` && await bgCheckinState.V.fail(e2, t);
          },
          async complete(e2, t) {
            await bgCheckinState.V.complete(t), bgPlatformState.$();
          },
          async isAlive(e2) {
            if (e2.tabId <= 0) return false;
            let [t, n] = await Promise.all([
              chrome.tabs.get(e2.tabId).then(() => true).catch(() => false),
              bgCheckinState.V.get(e2.tabId)
            ]);
            return t && !!n?.runId && n.accountId === e2.accountId;
          },
          async abandon(e2) {
            if (e2.tabId <= 0) return;
            let t = await bgCheckinState.V.get(e2.tabId);
            t && await dm(e2, t) || (await um(e2.tabId, t), await bgCheckinState.V.remove(e2.tabId), await Pp(e2.tabId).catch(() => {
            }), await jh(e2.tabId));
          },
          changed: bgPlatformState.$
        });
        break;
      }
      case 313: {
        bgCheckinState.om = Promise.resolve();
        break;
      }
      case 317: {
        bgCheckinState.Km = [0, 250, 750];
        break;
      }
    }
  }
  async function handleCheckinPointerMessage(e2, i) {
    switch (e2.type) {
      case `TRUSTED_POINTER_CLICK`: {
        let t = i.tab?.id;
        if (t == null) return { ok: false, error: `缺少任务标签页` };
        if (i.frameId !== 0) {
          let n2 = await bgSliderState._u(i, e2.runId, e2.frameSessionId);
          if (e2.anchor && e2.anchor.kind !== `center` || !/^p-[a-z0-9-]{8,80}$/i.test(e2.targetToken))
            return { ok: false, error: `验证码内嵌页只允许点击本轮标记的控件中心` };
          let r2 = await bgPlatformState.cc(t, n2, e2.targetToken, { kind: `center` });
          if (!r2) return { ok: false, error: `验证码控件已重绘或被遮挡，未执行点击` };
          let a2 = await bgPlatformState.ac(t, n2);
          return {
            ok: true,
            feature: {
              pointer: await bgPlatformState.Hc(t, {
                x: r2.x,
                y: r2.y,
                viewportWidth: a2.viewportWidth,
                viewportHeight: a2.viewportHeight,
                targetToken: e2.targetToken,
                anchor: { kind: `center` },
                deadline: e2.deadline,
                frameTarget: n2
              })
            }
          };
        }
        let n = i.url ?? i.tab?.url, r = await bgCheckinState.V.get(t) ?? (bgCheckinState.yt(n) ? await bgCheckinState.Tm(t, i.tab?.openerTabId) : null);
        if (!r || r.runId !== e2.runId) return { ok: false, error: `任务已结束` };
        let a = r.effectiveLoginMethod === `github` && bgCheckinState.Tt(r.stage) && bgCheckinState.ht(n), o = a && !!r.githubUsername?.trim() && !!r.githubPassword;
        if (!bgCheckinState.ut(r, n) && !a) return { ok: false, error: `当前页面不属于该签到任务` };
        let s = async () => {
          let e3 = await bgCheckinState.V.setGithubCredentialsSubmitted(t, r.runId, true);
          if (!e3) {
            let t2 = await bgCheckinState.Z.active();
            t2?.accountId === r.accountId && (e3 = await bgCheckinState.V.setGithubCredentialsSubmitted(t2.tabId, r.runId, true));
          }
          if (!e3) throw Error(`登录点击已派发，但无法保存 GitHub 凭据提交状态，已停止后续身份放行`);
        };
        return {
          ok: true,
          feature: {
            pointer: await bgPlatformState.Hc(
              t,
              {
                x: e2.x,
                y: e2.y,
                viewportWidth: e2.viewportWidth,
                viewportHeight: e2.viewportHeight,
                targetToken: e2.targetToken,
                anchor: e2.anchor,
                targetSeenAt: e2.targetSeenAt,
                deadline: e2.deadline,
                ...o ? {
                  inputAssertions: [
                    {
                      selector: `#login_field, input[name="login"]`,
                      value: r.githubUsername.trim()
                    },
                    { selector: `#password, input[type="password"]`, value: r.githubPassword }
                  ]
                } : {}
              },
              Math.random,
              { ...o ? { afterClick: s } : {} }
            )
          }
        };
      }
      case `TRUSTED_POINTER_SCROLL`: {
        let t = i.tab?.id;
        if (t == null || i.frameId !== 0) return { ok: false, error: `缺少顶层任务标签页` };
        let n = i.url ?? i.tab?.url, r = await bgCheckinState.V.get(t);
        if (!r || r.runId !== e2.runId) return { ok: false, error: `任务已结束` };
        if (!bgCheckinState.ut(r, n)) return { ok: false, error: `当前页面不属于该签到任务` };
        let a = await bgPlatformState.Wc(t, {
          x: e2.x,
          y: e2.y,
          viewportWidth: e2.viewportWidth,
          viewportHeight: e2.viewportHeight,
          deltaY: e2.deltaY,
          steps: e2.steps
        });
        return {
          ok: true,
          feature: {
            pointer: {
              mode: a.mode,
              pathPoints: 0,
              clickObserved: null,
              scroll: { deltaY: a.deltaY, steps: a.steps }
            }
          }
        };
      }
      case `TRUSTED_POINTER_DRAG`: {
        let t = i.tab?.id;
        if (t == null || i.frameId !== 0) return { ok: false, error: `缺少顶层任务标签页` };
        let n = i.url ?? i.tab?.url, r = await bgCheckinState.V.get(t);
        if (!r || r.runId !== e2.runId) return { ok: false, error: `任务已结束` };
        if (!bgCheckinState.ut(r, n)) return { ok: false, error: `当前页面不属于该签到任务` };
        if (!Array.isArray(e2.points) || e2.points.length < 2)
          return { ok: false, error: `拖拽轨迹至少需要 2 个点` };
        let a = await bgPlatformState.qc(t, {
          startX: e2.startX,
          startY: e2.startY,
          points: e2.points,
          viewportWidth: e2.viewportWidth,
          viewportHeight: e2.viewportHeight,
          ...e2.fromTargetToken ? { targetToken: e2.fromTargetToken } : {},
          ...e2.toTargetToken ? { toTargetToken: e2.toTargetToken } : {},
          ...e2.fromAnchor ? { fromAnchor: e2.fromAnchor } : {},
          ...e2.toAnchor ? { toAnchor: e2.toAnchor } : {}
        });
        return {
          ok: true,
          feature: {
            pointer: {
              mode: a.mode,
              pathPoints: 0,
              clickObserved: null,
              drag: { points: a.dragPoints, totalDistance: a.totalDistance }
            }
          }
        };
      }
    }
  }
  var checkinService = Object.freeze({
    startBatch: (...args) => $m(...args),
    cancel: (...args) => eh(...args),
    getQueue: () => bgCheckinState.Z.snapshot(),
    saveSchedule: (...args) => bgCheckinState.store.updateSchedule(...args),
    handleMessage: handleCheckinMessage,
    handlePointerMessage: handleCheckinPointerMessage,
    handleMutation: handleCheckinMutation
  });

  // src/modules/sites/service.js
  var bgSitesState = { store: {} };
  var loginPageProbePending = /* @__PURE__ */ new Map();
  var loginPageProbeTimeout = 6e3;
  function ae(e2, t, n, r) {
    return {
      id: e2,
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
  function oe(e2) {
    return e2.checkin?.method === `workflow`;
  }
  function se(e2) {
    return e2.checkin?.method === `none` && e2.checkin.learnedLoginAsCheckin === true;
  }
  function ce(e2) {
    return oe(e2) || se(e2);
  }
  function ue(e2) {
    let t = e2.checkin?.workflow?.steps;
    if (!oe(e2) || !Array.isArray(t)) return false;
    let n = (e3) => e3.some((e4) => {
      if (!e4 || typeof e4 != `object`) return false;
      let t2 = e4;
      return typeof t2.type == `string` && bgSitesState.le.has(t2.type) ? true : Array.isArray(t2.then) && n(t2.then) || Array.isArray(t2.else) && n(t2.else);
    });
    return n(t);
  }
  function de(e2, t) {
    let n = t.checkin;
    return e2.id === `builtin-futurehub` && n?.method === `auto` && n.workflow === void 0 && (!n.url || n.url === `/console/personal`) && !n.buttonSelector && !n.alreadySelector && !n.successSelector;
  }
  function fe(e2, t) {
    let n = t.checkin;
    return e2.id === `builtin-anyrouter` && n?.method === `auto` && n.workflow === void 0 && (!n.url || n.url === `/console/personal`) && !n.buttonSelector && !n.alreadySelector && !n.successSelector;
  }
  function pe(e2, t) {
    if (!t) return { ...e2, builtin: true };
    let n = de(e2, t), r = fe(e2, t), i = n || r, a = !!t.checkin && se(t);
    return {
      ...e2,
      ...t,
      selectors: { ...e2.selectors, ...t.selectors },
      closeModalSelectors: t.closeModalSelectors?.length ? t.closeModalSelectors : e2.closeModalSelectors,
      ...e2.checkin || t.checkin ? {
        checkin: a ? { ...t.checkin, method: `none` } : i ? { ...e2.checkin, method: e2.checkin?.method ?? `auto` } : {
          ...e2.checkin,
          ...t.checkin,
          method: t.checkin?.method ?? e2.checkin?.method ?? `auto`
        }
      } : {},
      ...e2.adapter || t.adapter ? { adapter: { ...e2.adapter, ...t.adapter } } : {},
      ...e2.tokenConfig || t.tokenConfig ? { tokenConfig: { ...e2.tokenConfig, ...t.tokenConfig } } : {},
      builtin: true
    };
  }
  function me(e2) {
    return e2.nameOnly === true;
  }
  function Vt(e2, t) {
    return {
      siteType: e2.siteType,
      evidence: t,
      preset: e2.preset,
      templateLabel: e2.label,
      templateId: e2.id
    };
  }
  async function Ht(e2) {
    let t = new AbortController(), n = setTimeout(() => t.abort(), bgSitesState.zt);
    try {
      return await fetch(e2, {
        method: `GET`,
        credentials: `omit`,
        cache: `no-store`,
        headers: { Accept: `application/json, text/html` },
        signal: t.signal
      });
    } catch {
      return null;
    } finally {
      clearTimeout(n);
    }
  }
  function Ut(e2) {
    let t;
    try {
      t = new URL(e2).hostname.toLowerCase();
    } catch {
      return null;
    }
    for (let e3 of bgSitesState.ie)
      if ((e3.fingerprints.hostnames ?? []).some((e4) => e4.toLowerCase() === t))
        return Vt(e3, `域名 ${t} 是已知的${e3.label}站点`);
    return null;
  }
  async function Wt(e2) {
    for (let t of bgSitesState.ie) {
      let n = t.fingerprints.endpoint;
      if (!n) continue;
      let r;
      try {
        r = new URL(n.path, e2).href;
      } catch {
        continue;
      }
      let i = await Ht(r);
      if (!i || !(i.headers.get(`content-type`)?.toLowerCase() ?? ``).includes(`json`)) continue;
      let a = await i.json().catch(() => null);
      if (a !== null && n.match(a)) {
        if (t.id === `new-api`) {
          let t2 = await Kt(e2);
          if (t2) return t2;
        }
        return Vt(t, `${n.path} 的响应形状符合${t.label}`);
      }
    }
    return null;
  }
  function Gt(e2) {
    return /<input[^>]+type=["']?password/i.test(e2) || /<input[^>]+name=["']?(?:username|email)\b/i.test(e2);
  }
  async function Kt(e2) {
    let t = bgSitesState.ie.find((e3) => e3.id === `new-api-next`);
    if (!t) return null;
    let n, r;
    try {
      n = new URL(`/sign-in`, e2).href, r = new URL(`/login`, e2).href;
    } catch {
      return null;
    }
    let [i, a] = await Promise.all([Ht(n), Ht(r)]);
    if (!i?.ok) return null;
    let o = await i.text().catch(() => ``), s = (e3) => /\b404\b|not\s*found|页面不存在|找不到页面/i.test(e3.slice(0, 2e4));
    return s(o) || !(!a || a.status === 404 || a.ok && s(await a.text().catch(() => ``)) && !Gt(o)) ? null : Vt(
      t,
      `/api/user/self 符合 new-api 系，且站点使用 /sign-in 登录、没有 /login 路由（新版界面）`
    );
  }
  async function qt(e2) {
    let t;
    try {
      t = new URL(`/`, e2).href;
    } catch {
      return null;
    }
    let n = await Ht(t);
    if (!n || !n.ok) return null;
    let r = await n.text().catch(() => ``), i = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(r)?.[1]?.trim().toLowerCase();
    if (!i) return null;
    for (let e3 of bgSitesState.ie)
      for (let t2 of e3.fingerprints.titleWords ?? [])
        if (i.includes(t2.toLowerCase())) return Vt(e3, `首页标题「${i.slice(0, 40)}」含「${t2}」`);
    return null;
  }
  async function Jt(e2) {
    if (!e2.trim()) return bgSitesState.Bt;
    try {
      let t = new URL(e2.trim());
      if ((t.protocol === `http:` || t.protocol === `https:`) && bgAccountsState.Rt(t.hostname))
        return { siteType: bgSitesState.u.UNKNOWN, evidence: `目标地址指向本机或内网，已拒绝` };
    } catch {
    }
    return Ut(e2) || await Wt(e2) || await qt(e2) || bgSitesState.Bt;
  }
  function or(e2) {
    if (e2 == null || e2 === ``) return {};
    let t = String(e2), n = {};
    for (let e3 of bgSitesState.ir) n[e3] = t;
    return n;
  }
  function lr(e2) {
    return typeof e2 == `string` && Object.values(bgSitesState.d).includes(e2);
  }
  function ur(e2) {
    return e2 === bgSitesState.u.SUB2API ? bgSitesState.d.SUB2API : e2 === bgSitesState.u.VO_API_V2 ? bgSitesState.d.VO_API_V2 : e2 && bgSitesState.cr.has(e2) ? bgSitesState.d.NEW_API : bgSitesState.d.UNSUPPORTED;
  }
  function dr(e2) {
    let t = e2?.trim();
    if (t) return t.startsWith(`/`) ? t : `/${t}`;
  }
  function fr(e2) {
    let t = e2.adapter, n = lr(t?.family) ? t.family : ur(t?.siteType), r = t && Object.prototype.hasOwnProperty.call(t, `checkinPath`) ? dr(t?.checkinPath) : bgSitesState.sr[n].checkinPath, i = (t?.checkin?.pathPatterns ?? []).map((e3) => dr(e3.replace(/\*$/, ``))).filter((e3) => !!e3), a = (t?.checkin?.titleWords ?? []).map((e3) => e3.trim()).filter(Boolean);
    return {
      family: n,
      ...t?.siteType ? { siteType: t.siteType } : {},
      ...r ? { checkinPath: r } : {},
      checkinPathPatterns: i,
      checkinTitleWords: a
    };
  }
  function pr(e2) {
    return fr(e2).checkinPath;
  }
  function mr(e2) {
    let t = e2.authBootstrap, n = t?.endpoint?.trim();
    if (!t || !n) return null;
    let r;
    try {
      r = new URL(n, e2.loginUrl).href;
    } catch {
      return null;
    }
    return bgCheckinState.N(e2, r) ? {
      url: r,
      method: `POST`,
      ...t.tokenPath?.length ? { tokenPath: t.tokenPath } : {},
      header: t.header?.trim() || `Authorization`,
      prefix: t.prefix ?? `Bearer `
    } : null;
  }
  function ya(e2) {
    try {
      return e2.id === `real-sharedchat` || new URL(e2.loginUrl).hostname === `new.sharedchat.cc`;
    } catch {
      return e2.id === `real-sharedchat`;
    }
  }
  function ba(e2) {
    return e2.map((e3) => {
      let t = e3;
      if (!Object.prototype.hasOwnProperty.call(t, `checkinMethod`)) return e3;
      let { checkinMethod: n, ...r } = t;
      return r;
    });
  }
  function xa(e2) {
    let t = /* @__PURE__ */ new Map();
    for (let n of e2) {
      let e3 = n.identity?.userId?.trim();
      if (!e3) continue;
      let r = `${n.siteId}\0${e3}`, i = t.get(r) ?? [];
      i.push(n.id), t.set(r, i);
    }
    return new Set([...t.values()].filter((e3) => e3.length > 1).flat());
  }
  function Sa(e2) {
    return { ...e2, identity: e2.identity?.session ? { session: e2.identity.session } : void 0 };
  }
  function F(e2) {
    try {
      return new URL(e2.loginUrl).hostname.toLowerCase();
    } catch {
      return ``;
    }
  }
  function Ca(e2) {
    return F(e2) === `agentrouter.org` || F(e2) === `ps.air-outer.com`;
  }
  function wa(e2) {
    let t = (() => {
      try {
        let t2 = new URL(e2.loginUrl);
        return t2.pathname = `/login`, t2.search = ``, t2.hash = ``, t2.href;
      } catch {
        return e2.loginUrl;
      }
    })(), n = !e2.successIndicator || e2.successIndicator === `a[href="/console/token"], a[href="/console/topup"]`, r = e2.checkin?.method === `relogin` ? {
      ...bgSitesState.f.checkin,
      ...e2.checkin,
      logoutStorageKeys: [
        .../* @__PURE__ */ new Set([
          ...e2.checkin.logoutStorageKeys ?? [],
          ...bgSitesState.f.checkin?.logoutStorageKeys ?? []
        ])
      ]
    } : e2.checkin;
    return {
      ...e2,
      loginUrl: t,
      pointerMode: e2.pointerMode ?? bgSitesState.f.pointerMode,
      successIndicator: n ? bgSitesState.f.successIndicator : e2.successIndicator,
      closeModalSelectors: [
        .../* @__PURE__ */ new Set([
          `button >> text=今日关闭`,
          `button >> text=关闭公告`,
          ...(e2.closeModalSelectors ?? []).filter(
            (e3) => e3 !== `button >> text=今日关闭` && e3 !== `button >> text=关闭公告`
          )
        ])
      ],
      ...r ? { checkin: r } : {}
    };
  }
  function Ta(e2) {
    if (F(e2) !== `api.futureppo.top` || se(e2)) return false;
    let t = e2.checkin;
    return !t || (t.method === `auto` || t.method === `none`) && t.workflow === void 0 && !t.buttonSelector && !t.alreadySelector && !t.successSelector;
  }
  function Ea(e2) {
    if (F(e2) !== `anyrouter.top` || se(e2)) return false;
    let t = e2.checkin;
    return !t || (t.method === `auto` || t.method === `none`) && t.workflow === void 0 && !t.buttonSelector && !t.alreadySelector && !t.successSelector;
  }
  function Da(e2) {
    if (F(e2) !== `linux.sb`) return false;
    let t = e2.checkin;
    return t ? t.method !== `auto` && t.method !== `button` ? false : !t.url && !t.apiUrl && !t.entry && !t.claimEntrySelector && !t.claimConfirmSelector && !t.logoutSelector && !t.logoutApiUrl && !t.workflow : true;
  }
  function Oa(e2) {
    if (F(e2) !== `linux.sb`) return false;
    try {
      return new URL(e2.loginUrl).pathname.replace(/\/+$/, ``) === ``;
    } catch {
      return false;
    }
  }
  function ka(e2) {
    if (!Oa(e2)) return e2;
    try {
      let t = new URL(e2.loginUrl);
      return t.pathname = `/login`, t.search = ``, t.hash = ``, { ...e2, loginUrl: t.href };
    } catch {
      return e2;
    }
  }
  function Aa(e2) {
    let t = bgSitesState.w.checkin, n = bgSitesState.w.adapter, r = e2.checkin, i = (() => {
      try {
        let t2 = new URL(e2.loginUrl);
        return t2.pathname = `/login`, t2.search = ``, t2.hash = ``, t2.href;
      } catch {
        return e2.loginUrl;
      }
    })();
    return {
      ...e2,
      loginUrl: i,
      pointerMode: e2.pointerMode ?? bgSitesState.w.pointerMode,
      loginMethod: e2.loginMethod || bgSitesState.w.loginMethod || `form`,
      selectors: { ...bgSitesState.w.selectors, ...e2.selectors },
      closeModalSelectors: e2.closeModalSelectors?.length ? [...e2.closeModalSelectors] : [...bgSitesState.w.closeModalSelectors],
      successIndicator: e2.successIndicator ?? bgSitesState.w.successIndicator,
      checkin: {
        ...t,
        ...r,
        url: t.url,
        successText: r?.successText ? [...r.successText] : [...t.successText ?? []],
        alreadyText: r?.alreadyText ? [...r.alreadyText] : [...t.alreadyText ?? []]
      },
      adapter: {
        ...e2.adapter,
        ...n,
        checkin: {
          ...e2.adapter?.checkin,
          ...n.checkin,
          pathPatterns: [...n.checkin?.pathPatterns ?? []],
          titleWords: [...n.checkin?.titleWords ?? []]
        }
      }
    };
  }
  function I(e2, t, n) {
    if (!t) return false;
    try {
      let r = (e3) => e3.replace(/\/+$/, ``) || `/`;
      return r(new URL(t, e2.loginUrl).pathname) === r(n);
    } catch {
      return false;
    }
  }
  function L(e2, t) {
    return !!e2 && e2.length === t.length && e2.every((e3, n) => e3 === t[n]);
  }
  function Ma(e2) {
    if (F(e2) !== bgSitesState.ja) return false;
    try {
      let t2 = new URL(e2.loginUrl), n2 = t2.pathname.replace(/\/+$/, ``) || `/`;
      if (t2.protocol !== `https:` || t2.hostname.toLowerCase() !== bgSitesState.ja || t2.port || !(/* @__PURE__ */ new Set([`/`, `/login`, `/user/login`, `/console`, `/console/personal`, `/dashboard`])).has(n2))
        return false;
    } catch {
      return false;
    }
    let t = e2.checkin;
    if (!t || t.method !== `auto` || !Object.keys(t).every((e3) => [`method`, `url`, `apiUrl`].includes(e3)) || t.url && !I(e2, t.url, `/`) && !I(e2, t.url, `/console/personal`) || t.apiUrl && !I(e2, t.apiUrl, `/api/user/checkin`))
      return false;
    let n = e2.adapter;
    return !(n?.family && n.family !== bgSitesState.d.NEW_API || n?.siteType && n.siteType !== bgSitesState.u.NEW_API || n?.checkinPath && !I(e2, n.checkinPath, `/console/personal`) || n?.quotaPerUnit != null && n.quotaPerUnit !== 5e5 || n?.checkin?.pathPatterns && !L(n.checkin.pathPatterns, [`/console/personal*`, `/dashboard*`]) || n?.checkin?.titleWords && !L(n.checkin.titleWords, [`每日签到`, `daily check-in`]));
  }
  function Na(e2) {
    let t = bgSitesState.re, n = t.checkin, r = t.adapter, i = (() => {
      try {
        let t2 = new URL(e2.loginUrl), n2 = t2.pathname.replace(/\/+$/, ``) || `/`;
        return (/* @__PURE__ */ new Set([
          `/`,
          `/login`,
          `/user/login`,
          `/console`,
          `/console/personal`,
          `/dashboard`
        ])).has(n2) ? (t2.pathname = `/`, t2.search = ``, t2.hash = ``, t2.href) : e2.loginUrl;
      } catch {
        return e2.loginUrl;
      }
    })();
    return {
      ...e2,
      loginUrl: i,
      pointerMode: e2.pointerMode ?? t.pointerMode,
      preLoginClickSelector: e2.preLoginClickSelector ?? t.preLoginClickSelector,
      loginMethod: e2.loginMethod === `auto` ? t.loginMethod ?? `form` : e2.loginMethod || t.loginMethod || `form`,
      selectors: { ...t.selectors, ...e2.selectors },
      closeModalSelectors: e2.closeModalSelectors?.length ? [...e2.closeModalSelectors] : [...t.closeModalSelectors],
      checkin: {
        ...n,
        successText: [...n.successText ?? []],
        alreadyText: [...n.alreadyText ?? []]
      },
      adapter: {
        ...e2.adapter,
        siteType: r.siteType,
        family: r.family,
        checkinPath: r.checkinPath,
        checkin: {
          pathPatterns: [...r.checkin?.pathPatterns ?? []],
          titleWords: [...r.checkin?.titleWords ?? []]
        },
        quotaPerUnit: r.quotaPerUnit
      }
    };
  }
  function Pa(e2) {
    if (F(e2) !== `vsllm.com`) return false;
    let t = e2.checkin;
    return !t || !(t.method !== `auto` || !Object.keys(t).every((e3) => [`method`, `url`, `apiUrl`].includes(e3)) || t.url && !I(e2, t.url, `/console/personal`) || t.apiUrl && !I(e2, t.apiUrl, `/api/user/checkin`));
  }
  function Fa(e2) {
    let t = bgSitesState.te, n = t.adapter, r = (() => {
      try {
        let t2 = new URL(e2.loginUrl), n2 = t2.pathname.replace(/\/+$/, ``);
        return (/* @__PURE__ */ new Set([``, `/login`, `/console`, `/console/personal`, `/console/topup`])).has(n2) ? (t2.pathname = `/login`, t2.search = ``, t2.hash = ``, t2.href) : e2.loginUrl;
      } catch {
        return e2.loginUrl;
      }
    })();
    return {
      ...e2,
      loginUrl: r,
      pointerMode: e2.pointerMode ?? t.pointerMode,
      loginMethod: e2.loginMethod || t.loginMethod || `auto`,
      selectors: { ...t.selectors, ...e2.selectors },
      closeModalSelectors: e2.closeModalSelectors?.length ? [...e2.closeModalSelectors] : [...t.closeModalSelectors],
      checkin: {
        ...t.checkin,
        successText: [...t.checkin?.successText ?? []],
        alreadyText: [...t.checkin?.alreadyText ?? []]
      },
      adapter: {
        ...e2.adapter,
        siteType: n.siteType,
        family: n.family,
        checkinPath: n.checkinPath,
        checkin: {
          pathPatterns: [...n.checkin?.pathPatterns ?? []],
          titleWords: [...n.checkin?.titleWords ?? []]
        },
        quotaPerUnit: e2.adapter?.quotaPerUnit ?? n.quotaPerUnit
      }
    };
  }
  function Ia(e2) {
    if (F(e2) !== `vsllm.com`) return e2;
    let t = e2.checkin?.workflow?.steps;
    if (!Array.isArray(t) || !t.some((e3) => e3?.type === `vsllm-daily`)) return e2;
    let n = bgSitesState.te.checkin;
    return {
      ...e2,
      checkin: {
        ...n,
        successText: [...n.successText ?? []],
        alreadyText: [...n.alreadyText ?? []]
      }
    };
  }
  function Ra(e2) {
    let t = e2.checkin;
    if (t?.method !== `none` || !t.learnedLoginAsCheckin || t.learnedLoginAsCheckinSource === `explicit` || (t.workflow?.steps.length ?? 0) > 0)
      return e2;
    try {
      let t2 = new URL(e2.loginUrl);
      if (t2.protocol !== `https:` || t2.hostname !== bgSitesState.La || t2.port) return e2;
    } catch {
      return e2;
    }
    return {
      ...e2,
      checkin: { method: `workflow`, workflow: { steps: [{ type: `leilei-daily` }] } }
    };
  }
  function za(e2) {
    if (F(e2) !== bgSitesState.La) return false;
    try {
      let t2 = new URL(e2.loginUrl);
      if (t2.protocol !== `https:` || t2.hostname.toLowerCase() !== bgSitesState.La || t2.port)
        return false;
      let n2 = t2.pathname.replace(/\/+$/, ``) || `/`;
      if (!(/* @__PURE__ */ new Set([`/`, `/login`, `/sign-in`, `/profile`, `/console`, `/console/personal`])).has(n2))
        return false;
    } catch {
      return false;
    }
    let t = e2.checkin;
    if (t?.method === `workflow` || t && t.method !== `auto` && t.method !== `button` || t?.method === `button` && (!I(e2, t.url, `/profile`) || t.buttonSelector !== `button >> text=立即签到, button >> text=签到` || t.alreadySelector !== `button >> text=已签到` || t.successText && !L(t.successText, [`签到成功`, `今天 +`]) || t.alreadyText && !L(t.alreadyText, [`已签到`, `今日已签到`]) || !Object.keys(t).every(
      (e3) => [
        `method`,
        `url`,
        `buttonSelector`,
        `alreadySelector`,
        `successText`,
        `alreadyText`
      ].includes(e3)
    )) || t?.method === `auto` && (!Object.keys(t).every((e3) => [`method`, `url`, `apiUrl`].includes(e3)) || t.url && !I(e2, t.url, `/profile`) && !I(e2, t.url, `/console/personal`) || t.apiUrl && !I(e2, t.apiUrl, `/api/user/checkin`)))
      return false;
    let n = e2.adapter;
    return !(n?.family && n.family !== bgSitesState.d.NEW_API || n?.siteType && n.siteType !== bgSitesState.u.NEW_API || n?.checkinPath && !I(e2, n.checkinPath, `/profile`) && !I(e2, n.checkinPath, `/console/personal`) || n?.checkin?.pathPatterns && !L(n.checkin.pathPatterns, [`/profile*`]) && !L(n.checkin.pathPatterns, [`/profile*`, `/lottery*`]) && !L(n.checkin.pathPatterns, [`/console/personal*`]) || n?.checkin?.titleWords && !L(n.checkin.titleWords, [`每日签到`]) && !L(n.checkin.titleWords, [`每日签到`, `浮梦引光`, `抽奖`]) && !L(n.checkin.titleWords, [`每日签到`, `daily check-in`]));
  }
  function Ba(e2) {
    let t = bgSitesState.A, n = t.adapter, r = t.checkin?.workflow, i = (() => {
      try {
        let t2 = new URL(e2.loginUrl);
        return t2.pathname = `/sign-in`, t2.search = ``, t2.hash = ``, t2.href;
      } catch {
        return e2.loginUrl;
      }
    })();
    return {
      ...e2,
      loginUrl: i,
      pointerMode: e2.pointerMode ?? t.pointerMode,
      loginMethod: e2.loginMethod || t.loginMethod || `auto`,
      selectors: { ...t.selectors, ...e2.selectors },
      successIndicator: e2.successIndicator || t.successIndicator,
      closeModalSelectors: e2.closeModalSelectors?.length ? [...e2.closeModalSelectors] : [...t.closeModalSelectors],
      checkin: { method: `workflow`, workflow: { steps: (r?.steps ?? []).map((e3) => ({ ...e3 })) } },
      adapter: {
        ...e2.adapter,
        siteType: n.siteType,
        family: n.family,
        checkinPath: n.checkinPath,
        checkin: {
          pathPatterns: [...n.checkin?.pathPatterns ?? []],
          titleWords: [...n.checkin?.titleWords ?? []]
        },
        quotaPerUnit: e2.adapter?.quotaPerUnit ?? n.quotaPerUnit
      },
      ...t.authBootstrap ? { authBootstrap: { ...t.authBootstrap } } : {}
    };
  }
  function Va(e2) {
    if (F(e2) !== bgSitesState.La || e2.checkin?.method !== `workflow` || !(e2.checkin.workflow?.steps ?? []).some((e3) => e3.type === `leilei-daily`))
      return false;
    let t = e2.adapter?.checkinPath, n = e2.adapter?.checkin?.pathPatterns ?? [];
    return t === `/profile` || !n.some((e3) => e3.startsWith(`/lottery`));
  }
  function Ha(e2) {
    return F(e2) !== bgSitesState.La || e2.checkin?.method !== `workflow` ? false : !e2.authBootstrap?.endpoint;
  }
  function Ua(e2) {
    let t = bgSitesState.A.authBootstrap;
    return t ? { ...e2, authBootstrap: { ...t } } : e2;
  }
  function Wa(e2) {
    let t = bgSitesState.A.adapter;
    return {
      ...e2,
      adapter: {
        ...e2.adapter,
        siteType: e2.adapter?.siteType ?? t.siteType,
        family: e2.adapter?.family ?? t.family,
        checkinPath: t.checkinPath,
        checkin: {
          pathPatterns: [...t.checkin?.pathPatterns ?? []],
          titleWords: [...t.checkin?.titleWords ?? []]
        },
        quotaPerUnit: e2.adapter?.quotaPerUnit ?? t.quotaPerUnit
      }
    };
  }
  function Ka(e2) {
    if (F(e2) !== `sub.100xlabs.space`) return false;
    let t = e2.checkin;
    if (!t) return true;
    if (se(e2)) return false;
    if (t.method === `none`)
      return Object.keys(t).every((e3) => [`method`, `url`].includes(e3)) && (!t.url || I(e2, t.url, `/check-in`) || I(e2, t.url, `/console/personal`));
    if (t.method !== `auto` || !Object.keys(t).every((e3) => [`method`, `url`, `apiUrl`].includes(e3)))
      return false;
    let n = I(e2, t.url, `/check-in`) && !t.apiUrl, r = I(e2, t.url, `/console/personal`) && I(e2, t.apiUrl, `/api/user/checkin`);
    return n || r;
  }
  function qa(e2) {
    let t = bgSitesState.y, n = t.checkin, r = t.adapter, i = (() => {
      try {
        let t2 = new URL(e2.loginUrl), n2 = t2.pathname.replace(/\/+$/, ``);
        return [``, `/check-in`, `/dashboard`, `/console/personal`].includes(n2) ? (t2.pathname = `/login`, t2.search = ``, t2.hash = ``, t2.href) : e2.loginUrl;
      } catch {
        return e2.loginUrl;
      }
    })();
    return {
      ...e2,
      loginUrl: i,
      loginMethod: e2.loginMethod || t.loginMethod || `form`,
      selectors: { ...t.selectors, ...e2.selectors },
      closeModalSelectors: e2.closeModalSelectors?.length ? [...e2.closeModalSelectors] : [...t.closeModalSelectors],
      ...t.tokenConfig || e2.tokenConfig ? { tokenConfig: { ...t.tokenConfig, ...e2.tokenConfig } } : {},
      checkin: {
        ...n,
        successText: [...n.successText ?? []],
        alreadyText: [...n.alreadyText ?? []]
      },
      adapter: {
        ...e2.adapter,
        ...r,
        checkin: {
          ...r.checkin,
          pathPatterns: [...r.checkin?.pathPatterns ?? []],
          titleWords: [...r.checkin?.titleWords ?? []]
        }
      }
    };
  }
  function Ja(e2) {
    return bgSitesState.Ga.has(F(e2));
  }
  function Ya(e2) {
    let t = e2.checkin;
    return !t || !(se(e2) || t.method !== `auto` && t.method !== `none` || !Object.keys(t).every((e3) => [`method`, `url`, `apiUrl`].includes(e3)) || t.url && !I(e2, t.url, `/console/personal`) && !I(e2, t.url, `/profile`) || t.apiUrl && !I(e2, t.apiUrl, `/api/user/checkin`));
  }
  function Xa(e2) {
    let t = bgSitesState.D, n = Ya(e2), r = n || I(e2, e2.checkin?.url, `/profile`), i = (() => {
      try {
        let t2 = new URL(e2.loginUrl), n2 = t2.pathname.replace(/\/+$/, ``);
        return (/* @__PURE__ */ new Set([
          ``,
          `/login`,
          `/profile`,
          `/console`,
          `/console/personal`,
          `/keys`,
          `/wallet`
        ])).has(n2) ? (t2.pathname = `/sign-in`, t2.search = ``, t2.hash = ``, t2.href) : e2.loginUrl;
      } catch {
        return e2.loginUrl;
      }
    })(), a = t.checkin, o = t.adapter, s = e2.selectors.submit === `button[type="submit"]`, c = e2.successIndicator === `a[href="/console/token"], a[href="/console/topup"]`;
    return {
      ...e2,
      loginUrl: i,
      pointerMode: e2.pointerMode ?? t.pointerMode,
      loginMethod: e2.loginMethod || t.loginMethod || `auto`,
      selectors: { ...t.selectors, ...e2.selectors, ...s ? { submit: t.selectors.submit } : {} },
      successIndicator: !e2.successIndicator || c ? t.successIndicator : e2.successIndicator,
      ...n ? {
        checkin: {
          ...a,
          successText: [...a.successText ?? []],
          alreadyText: [...a.alreadyText ?? []]
        }
      } : {},
      adapter: {
        ...e2.adapter,
        siteType: bgSitesState.u.NEW_API,
        family: bgSitesState.d.NEW_API,
        ...r ? {
          checkinPath: `/profile`,
          checkin: e2.adapter?.checkin ?? {
            pathPatterns: [...o.checkin?.pathPatterns ?? []],
            titleWords: [...o.checkin?.titleWords ?? []]
          }
        } : {},
        quotaPerUnit: e2.adapter?.quotaPerUnit ?? o.quotaPerUnit
      }
    };
  }
  function Za(e2) {
    if (F(e2) !== `k40.shengqainbang.cn`) return false;
    let t = e2.checkin;
    if (!t) return true;
    if (se(e2)) return false;
    if (t.method === `none` || t.method === `button` && I(e2, t.url, `/profile`) && t.buttonSelector === `button >> text=立即签到, button >> text=立即簽到, button >> text=Check in now` && t.alreadySelector === `button >> text=已签到, button >> text=已簽到, button >> text=Checked in` && L(t.successText, [`签到成功`, `簽到成功`, `Check-in successful`]) && L(t.alreadyText, [`已签到`, `今日已签到`, `已簽到`, `今日已簽到`, `Checked in`]) && Object.keys(t).every(
      (e3) => [
        `method`,
        `url`,
        `buttonSelector`,
        `alreadySelector`,
        `successText`,
        `alreadyText`
      ].includes(e3)
    ) && e2.adapter?.family === bgSitesState.d.NEW_API && e2.adapter?.checkinPath === `/profile` && e2.adapter?.quotaPerUnit === 5e5)
      return true;
    if (t.method !== `auto`) return false;
    let n = I(e2, t.url, `/console/personal`) && I(e2, t.apiUrl, `/api/user/checkin`) && Object.keys(t).every((e3) => [`method`, `url`, `apiUrl`].includes(e3)), r = I(e2, t.url, `/check-in`) && Object.keys(t).every((e3) => [`method`, `url`].includes(e3));
    return n || r;
  }
  function Qa(e2) {
    let t = bgSitesState.y.checkin, n = bgSitesState.y.adapter, r = (() => {
      try {
        let t2 = new URL(e2.loginUrl);
        return t2.pathname = `/login`, t2.search = ``, t2.hash = ``, t2.href;
      } catch {
        return e2.loginUrl;
      }
    })();
    return {
      ...e2,
      loginUrl: r,
      selectors: { ...e2.selectors, ...bgSitesState.y.selectors },
      loginMethod: bgSitesState.y.loginMethod || `form`,
      ...bgSitesState.y.tokenConfig || e2.tokenConfig ? { tokenConfig: { ...e2.tokenConfig, ...bgSitesState.y.tokenConfig } } : {},
      checkin: {
        ...t,
        successText: [...t.successText ?? []],
        alreadyText: [...t.alreadyText ?? []]
      },
      adapter: {
        ...e2.adapter,
        ...n,
        checkin: {
          ...e2.adapter?.checkin,
          ...n.checkin,
          pathPatterns: [...n.checkin?.pathPatterns ?? []],
          titleWords: [...n.checkin?.titleWords ?? []]
        }
      }
    };
  }
  function $a(e2) {
    if (F(e2) !== `api.denxio.top`) return false;
    let t = e2.checkin;
    return se(e2) ? false : !t || t.method === `none` ? true : t.method !== `auto` || t.buttonSelector || t.alreadySelector || t.successSelector || t.claimConfirmSelector || t.workflow || t.claimEntrySelector || t.logoutSelector || t.apiUrl && !I(e2, t.apiUrl, `/api/user/checkin`) ? false : !t.url || I(e2, t.url, `/check-in`) || I(e2, t.url, `/console/personal`) || I(e2, t.url, `/checkin`);
  }
  function eo(e2) {
    let t = bgSitesState.S.checkin, n = bgSitesState.S.adapter, r = (() => {
      try {
        let t2 = new URL(e2.loginUrl);
        return t2.pathname = `/login`, t2.search = ``, t2.hash = ``, t2.href;
      } catch {
        return e2.loginUrl;
      }
    })();
    return {
      ...e2,
      loginUrl: r,
      selectors: { ...bgSitesState.S.selectors, ...e2.selectors },
      loginMethod: e2.loginMethod || bgSitesState.S.loginMethod || `form`,
      ...bgSitesState.S.tokenConfig || e2.tokenConfig ? { tokenConfig: { ...bgSitesState.S.tokenConfig, ...e2.tokenConfig } } : {},
      checkin: {
        ...t,
        successText: [...t.successText ?? []],
        alreadyText: [...t.alreadyText ?? []]
      },
      adapter: {
        ...e2.adapter,
        ...n,
        checkin: {
          ...e2.adapter?.checkin,
          ...n.checkin,
          pathPatterns: [...n.checkin?.pathPatterns ?? []],
          titleWords: [...n.checkin?.titleWords ?? []]
        }
      }
    };
  }
  function to(e2) {
    if (F(e2) !== `tabitoken.com`) return false;
    let t = e2.checkin, n = !t || t.method === `auto` && (!t.url || t.url === `/console/personal`) && !t.buttonSelector && !t.alreadySelector && !t.successSelector && Object.keys(t).every((e3) => [`method`, `url`].includes(e3)), r = t?.method === `button` && I(e2, t.url, `/profile`) && t.buttonSelector === `button >> text=立即签到, button >> text=签到` && t.alreadySelector === `button >> text=已签到` && !t.entry;
    return n || r;
  }
  function no(e2, t) {
    return JSON.stringify(e2) === JSON.stringify(t) ? e2 : t;
  }
  function ro(e2) {
    let t = e2.checkin, n = t?.workflow;
    return !t || t.method !== `auto` || t.workflowReplayDisabled === true || !n || typeof n.identityPath != `string` || !n.identityPath.trim() || bgCheckinState.st(e2, n).length > 0 ? e2 : { ...e2, checkin: { ...t, method: `workflow` } };
  }
  function oo(e2) {
    return e2.successIndicator === bgSitesState.io ? { ...e2, successIndicator: bgSitesState.ao } : e2;
  }
  function so(e2) {
    let t = ka(e2);
    if (t = oo(t), t = ro(t), t = Ia(t), t = Ra(t), Va(t) && (t = Wa(t)), Ha(t) && (t = Ua(t)), Ma(t))
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
        loginMethod: e2.loginMethod || `auto`,
        checkin: {
          method: `button`,
          url: `/console/personal`,
          buttonSelector: `button >> text=立即签到`,
          alreadySelector: `button >> text=今日已签到`,
          alreadyText: [`今日已签到`]
        },
        adapter: {
          ...e2.adapter,
          siteType: bgSitesState.u.NEW_API,
          family: bgSitesState.d.NEW_API,
          checkinPath: `/console/personal`,
          checkin: { pathPatterns: [`/console/personal*`], titleWords: [`每日签到`] },
          quotaPerUnit: 5e5
        }
      };
    else return no(e2, t);
    return no(e2, t);
  }
  function co(e2) {
    return e2.map(so);
  }
  function lo(e2) {
    let t = !e2.checkin || e2.checkin.method === `auto` && (!e2.checkin.url || e2.checkin.url === `/console/personal`) && !e2.checkin.buttonSelector && !e2.checkin.alreadySelector && !e2.checkin.successSelector && Object.keys(e2.checkin).every((e3) => [`method`, `url`].includes(e3)), n = e2.checkin?.method === `button` && I(e2, e2.checkin.url, `/profile`) && e2.checkin.buttonSelector === `button >> text=立即签到, button >> text=签到` && e2.checkin.alreadySelector === `button >> text=已签到` && !e2.checkin.entry, r = bgSitesState.O.checkin, i = r.entry ? { ...r.entry, steps: r.entry.steps.map((e3) => ({ ...e3 })) } : void 0, a = (() => {
      try {
        let t2 = new URL(e2.loginUrl);
        return t2.pathname.replace(/\/+$/, ``) === `/login` ? (t2.pathname = `/sign-in`, t2.search = ``, t2.hash = ``, t2.href) : e2.loginUrl;
      } catch {
        return e2.loginUrl;
      }
    })();
    return {
      ...e2,
      loginUrl: a,
      loginMethod: e2.loginMethod || `auto`,
      pointerMode: e2.pointerMode ?? `trusted`,
      successIndicator: e2.successIndicator ?? bgSitesState.O.successIndicator,
      ...t ? {
        checkin: {
          ...r,
          successText: [...r.successText ?? []],
          alreadyText: [...r.alreadyText ?? []],
          ...i ? { entry: i } : {}
        }
      } : n && i ? { checkin: { ...e2.checkin, entry: i } } : {},
      adapter: {
        ...e2.adapter,
        siteType: bgSitesState.u.NEW_API,
        family: bgSitesState.d.NEW_API,
        ...t || n ? {
          checkinPath: `/profile`,
          checkin: { pathPatterns: [`/profile*`], titleWords: [`每日签到`] }
        } : {},
        quotaPerUnit: e2.adapter?.quotaPerUnit ?? 5e5
      }
    };
  }
  function uo(e2) {
    return {
      ...e2,
      loginMethod: e2.loginMethod || `auto`,
      checkin: { method: `none` },
      adapter: {
        ...e2.adapter,
        siteType: bgSitesState.u.ANYROUTER,
        family: bgSitesState.d.NEW_API,
        checkinPath: ``,
        checkin: { pathPatterns: [], titleWords: [] },
        quotaPerUnit: e2.adapter?.quotaPerUnit ?? 5e5
      }
    };
  }
  function fo(e2, t) {
    return e2.length !== t.length || e2.some((e3, n) => e3 !== t[n]);
  }
  function po(e2, t) {
    let n = new Set(t.map((e3) => e3.siteId));
    return e2.filter((e3) => !n.has(e3));
  }
  async function mo(e2, n) {
    let i = e2.filter(ya);
    if (!(i.length > 0 || n.some((e3) => e3.siteId === `real-sharedchat`)))
      return { userSites: e2, accounts: n };
    let a = bgSitesState.j.find((e3) => e3.id === bgSitesState.va);
    if (!a) return { userSites: e2, accounts: n };
    let o = e2.find((e3) => e3.id === bgSitesState.va), s = /* @__PURE__ */ new Set([
      ...a.checkin?.claimUsedTexts ?? [],
      ...o?.checkin?.claimUsedTexts ?? [],
      ...i.flatMap((e3) => e3.checkin?.claimUsedTexts ?? [])
    ]), c = {
      ...o ?? a,
      id: bgSitesState.va,
      builtin: true,
      checkin: { method: `claim`, ...(o ?? a).checkin, claimUsedTexts: [...s] }
    }, l2 = e2.filter((e3) => !ya(e3) && e3.id !== bgSitesState.va).concat(c), u = new Set(i.map((e3) => e3.id).concat(`real-sharedchat`)), d = n.map((e3) => u.has(e3.siteId) ? { ...e3, siteId: bgSitesState.va } : e3);
    return await bgPlatformState.t.setMany({
      [bgPlatformState.r.sites]: l2,
      [bgPlatformState.r.accounts]: d
    }), { userSites: l2, accounts: d };
  }
  async function ho(e2, n) {
    let i = new Set(bgSitesState.j.map((e3) => e3.id)), a = e2.filter((e3) => e3.id.startsWith(`builtin-`) && e3.builtin !== false && !i.has(e3.id));
    if (a.length === 0) return { userSites: e2, accounts: n };
    let o = new Set(a.map((e3) => e3.id)), s = new Set(n.map((e3) => e3.siteId)), c = e2.flatMap((e3) => o.has(e3.id) ? s.has(e3.id) ? [{ ...e3, builtin: false }] : [] : [e3]);
    return await bgPlatformState.t.set(bgPlatformState.r.sites, c), { userSites: c, accounts: n };
  }
  function Y(e2, t) {
    let n = bgSitesState.j.find((t2) => t2.id === e2), r = t.find((t2) => t2.id === e2), i = n ? pe(n, r) : r;
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
    Y
  });
  function loginProbeUrl(value) {
    try {
      const url = new URL(value);
      if (url.username || url.password || url.protocol !== `https:` && !(url.protocol === `http:` && [`localhost`, `127.0.0.1`, `[::1]`].includes(url.hostname)))
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
  function sanitizeLoginEntry(value) {
    if (!value || typeof value !== `object` || Array.isArray(value)) return null;
    const methods = [`form`, `github`, `oauth`, `passkey`, `manual`];
    if (!methods.includes(value.method)) return null;
    function text(field, maxLength) {
      const item = value[field];
      return typeof item === `string` && item.trim() && item.trim().length <= maxLength && !/[\u0000-\u001f\u007f]/.test(item) ? item.trim() : ``;
    }
    const key = text(`key`, 160), label = text(`label`, 120), provider = text(`provider`, 80), matchText = text(`matchText`, 240);
    if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(key) || !label) return null;
    const entry = { key, method: value.method, label };
    if (provider) entry.provider = provider;
    if (matchText) entry.matchText = matchText;
    if (typeof value.hrefPath === `string`) {
      const path = value.hrefPath.trim().split(/[?#]/, 1)[0];
      if (path.startsWith(`/`) && !path.startsWith(`//`) && path.length <= 1024 && !/[\\\u0000-\u0020\u007f]/.test(path))
        entry.hrefPath = path;
    }
    return entry;
  }
  function loginProbeEntries(value) {
    const keys = /* @__PURE__ */ new Set();
    return (Array.isArray(value) ? value : []).slice(0, 64).map(sanitizeLoginEntry).filter((entry) => entry && !keys.has(entry.key) && keys.add(entry.key));
  }
  function loginProbeResult(siteId, status, methods = [], evidence = [], pageUrl = ``, entries = []) {
    return {
      siteId,
      status,
      methods,
      entries,
      evidence,
      pageUrl: loginProbePageUrl(pageUrl),
      checkedAt: Date.now()
    };
  }
  async function loginDiscoveryUrlKey(loginUrl) {
    const digest = await crypto.subtle.digest(`SHA-256`, new TextEncoder().encode(loginUrl));
    return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, `0`)).join(``);
  }
  function readSavedLoginDiscovery(site, urlKey) {
    const saved = site.loginDiscovery;
    if (!saved || saved.version !== 1 || saved.result?.siteId !== site.id || !/^[a-f0-9]{64}$/.test(saved.urlKey) || !Number.isFinite(saved.result.checkedAt) || saved.result.checkedAt <= 0)
      return null;
    if (saved.urlKey !== urlKey)
      return {
        ...loginProbeResult(
          site.id,
          `outdated`,
          [],
          [`本站登录地址已修改，请点击「更新登录方式」重新读取；不会自动打开网页`]
        ),
        checkedAt: saved.result.checkedAt,
        source: `saved`,
        persisted: true
      };
    const statuses = [`detected`, `multiple`, `unknown`, `already-logged-in`, `unavailable`];
    if (!statuses.includes(saved.result.status)) return null;
    const entries = loginProbeEntries(saved.result.entries), methods = [
      .../* @__PURE__ */ new Set([
        ...Array.isArray(saved.result.methods) ? saved.result.methods : [],
        ...entries.map((entry) => entry.method)
      ])
    ].filter((method) => [`form`, `github`, `oauth`, `passkey`, `manual`].includes(method)), evidence = (Array.isArray(saved.result.evidence) ? saved.result.evidence : []).filter((line) => typeof line === `string`).slice(0, 8).map((line) => line.slice(0, 240)), status = methods.length ? methods.length > 1 || entries.length > 1 ? `multiple` : `detected` : [`detected`, `multiple`].includes(saved.result.status) ? `unknown` : saved.result.status;
    return {
      ...loginProbeResult(site.id, status, methods, evidence, saved.result.pageUrl, entries),
      checkedAt: saved.result.checkedAt,
      source: `saved`,
      persisted: true,
      ...typeof saved.lastUpdateError === `string` && saved.lastUpdateError ? { updateError: saved.lastUpdateError.slice(0, 240) } : {}
    };
  }
  async function saveLoginDiscovery(siteId, loginUrl, urlKey, result) {
    return bgPlatformState.R(async () => {
      const sites = await bgPlatformState.t.get(bgPlatformState.r.sites, []), removed = await bgPlatformState.t.get(bgPlatformState.r.removedBuiltinSiteIds, []), latest = bgSitesState.Y(siteId, sites);
      if (!latest || removed.includes(siteId))
        return {
          ...loginProbeResult(siteId, `unavailable`, [], [`本站已删除，未保存旧页面结果`]),
          persisted: false
        };
      if (loginProbeUrl(latest.loginUrl)?.href !== loginUrl)
        return {
          ...loginProbeResult(
            siteId,
            `outdated`,
            [],
            [`本站登录地址已变更，请点击「更新登录方式」重新读取`]
          ),
          persisted: false
        };
      const previous = readSavedLoginDiscovery(latest, urlKey), keepPrevious = previous?.methods.length && !result.methods.length, updateError = keepPrevious ? `更新未成功，继续使用已保存的登录方式：${result.evidence[0] || `本次未识别出可用入口`}` : void 0, savedResult = keepPrevious ? previous : result, loginDiscovery = {
        version: 1,
        urlKey,
        result: {
          siteId,
          status: savedResult.status,
          methods: [...savedResult.methods],
          entries: loginProbeEntries(savedResult.entries),
          evidence: [...savedResult.evidence],
          pageUrl: loginProbePageUrl(savedResult.pageUrl),
          checkedAt: savedResult.checkedAt
        },
        ...updateError ? { lastUpdateError: updateError, lastUpdateAttemptAt: Date.now() } : {}
      }, index = sites.findIndex((site) => site.id === siteId), updatedSites = [...sites];
      if (index >= 0) updatedSites[index] = { ...sites[index], loginDiscovery };
      else updatedSites.push({ ...latest, loginDiscovery });
      await bgPlatformState.t.set(bgPlatformState.r.sites, updatedSites);
      bgPlatformState.$();
      return {
        ...readSavedLoginDiscovery({ ...latest, loginDiscovery }, urlKey),
        source: keepPrevious ? `saved` : `page`
      };
    });
  }
  function loginProbeGithubPage(value) {
    try {
      const url = new URL(value);
      return url.protocol === `https:` && url.hostname === `github.com` && !url.port && /^\/(?:login|sessions)(?:\/|$)/i.test(url.pathname);
    } catch {
      return false;
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
        })
      ]);
    } finally {
      clearTimeout(timer);
    }
  }
  async function runLoginPageProbe(site, loginUrl, deadline) {
    let ownedTabId, finished = false, lastMethodsSignature, last = loginProbeResult(
      site.id,
      `unknown`,
      [],
      [`登录页尚未显示可识别的登录入口`],
      loginUrl.href
    );
    async function bounded(operation) {
      return loginProbeBounded(operation, deadline);
    }
    async function closeOwnedTab() {
      if (ownedTabId == null) return;
      const tabId = ownedTabId;
      ownedTabId = void 0;
      const closing = Promise.resolve().then(() => chrome.tabs.remove(tabId)).catch(() => {
      });
      if (Date.now() < deadline) await bounded(() => closing).catch(() => {
      });
    }
    try {
      const tabs = await bounded(() => chrome.tabs.query({})), existing = tabs.find((tab) => {
        const url = loginProbeUrl(tab.url);
        return tab.id != null && url?.href === loginUrl.href;
      });
      let tabId = existing?.id;
      if (tabId == null) {
        const created = await bounded(
          () => chrome.tabs.create({ url: loginUrl.href, active: false }).then((tab) => {
            ownedTabId = tab?.id;
            if (finished) void closeOwnedTab();
            return tab;
          })
        );
        tabId = created?.id;
      }
      if (tabId == null)
        return loginProbeResult(site.id, `unavailable`, [], [`无法打开本站登录页`], loginUrl.href);
      for (; Date.now() < deadline; ) {
        let nextPollMs = 120;
        const tab = await bounded(() => chrome.tabs.get(tabId)), observedUrl = tab.url || tab.pendingUrl || ``;
        if (loginProbeGithubPage(observedUrl))
          return loginProbeResult(
            site.id,
            `detected`,
            [`github`],
            [`本站登录页进入了 GitHub 官方登录或授权页面`],
            observedUrl,
            [{ key: `github`, method: `github`, provider: `github`, label: `GitHub` }]
          );
        let observed;
        try {
          observed = new URL(observedUrl);
        } catch {
        }
        if (observed && [`https:`, `http:`].includes(observed.protocol) && observed.origin !== loginUrl.origin)
          return loginProbeResult(
            site.id,
            `unknown`,
            [],
            [`本站登录页跳转到了其他站点，尚未确认登录方式`],
            observedUrl
          );
        if (observed?.origin === loginUrl.origin) {
          try {
            const response = await bounded(
              () => chrome.tabs.sendMessage(
                tabId,
                {
                  type: `READ_LOGIN_OPTIONS`,
                  site: {
                    id: site.id,
                    loginUrl: loginUrl.href,
                    selectors: Object.fromEntries(
                      [`username`, `password`, `submit`].filter(
                        (key) => typeof site.selectors?.[key] === `string` && site.selectors[key].length <= 2048
                      ).map((key) => [key, site.selectors[key]])
                    ),
                    ...typeof site.successIndicator === `string` && site.successIndicator.length <= 2048 ? { successIndicator: site.successIndicator } : {}
                  }
                },
                { frameId: 0 }
              )
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
                  observedUrl
                );
              } else {
                const entries = loginProbeEntries(options.entries), methods = [
                  .../* @__PURE__ */ new Set([
                    ...Array.isArray(options.methods) ? options.methods : [],
                    ...entries.map((entry) => entry.method)
                  ])
                ].filter(
                  (method) => [`form`, `github`, `oauth`, `passkey`, `manual`].includes(method)
                ), evidence = (Array.isArray(options.evidence) ? options.evidence : []).filter((line) => typeof line === `string`).slice(0, 8).map((line) => line.slice(0, 240));
                if (methods.length) {
                  const signature = JSON.stringify([
                    loginProbePageUrl(responseUrl),
                    [...methods].sort(),
                    [...entries].sort((left, right) => left.key.localeCompare(right.key))
                  ]);
                  if (signature === lastMethodsSignature)
                    return loginProbeResult(
                      site.id,
                      methods.length > 1 || entries.length > 1 ? `multiple` : `detected`,
                      methods,
                      evidence,
                      responseUrl,
                      entries
                    );
                  lastMethodsSignature = signature;
                  nextPollMs = 200;
                  last = loginProbeResult(
                    site.id,
                    `unknown`,
                    [],
                    [`登录入口正在加载，等待页面稳定后确认可用方式`],
                    responseUrl
                  );
                } else {
                  lastMethodsSignature = void 0;
                  if (options.status === `already-logged-in`)
                    return loginProbeResult(
                      site.id,
                      `already-logged-in`,
                      [],
                      evidence.length ? evidence : [`当前页面已经登录，未显示新的登录入口`],
                      responseUrl
                    );
                  if (options.status === `unavailable`)
                    return loginProbeResult(
                      site.id,
                      `unavailable`,
                      [],
                      evidence.length ? evidence : [`当前登录页无法读取`],
                      responseUrl
                    );
                  last = loginProbeResult(
                    site.id,
                    `unknown`,
                    [],
                    evidence.length ? evidence : [`登录页尚未显示可识别的登录入口`],
                    responseUrl
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
          /超时/.test(error instanceof Error ? error.message : String(error)) ? `登录页未能在 6 秒内完成识别，请确认页面可正常打开后重试` : `登录页已关闭或无法读取，请重新打开后重试`
        ],
        last.pageUrl || loginUrl.href
      );
    } finally {
      finished = true;
      await closeOwnedTab();
    }
  }
  async function probeSiteLoginPage(siteId, force = false, savedOnly = false) {
    const deadline = Date.now() + loginPageProbeTimeout;
    let sites;
    try {
      sites = await loginProbeBounded(
        () => bgPlatformState.t.get(bgPlatformState.r.sites, []),
        deadline
      );
    } catch {
      return loginProbeResult(siteId, `unavailable`, [], [`本站配置暂时无法读取，请重试`]);
    }
    const removed = await bgPlatformState.t.get(bgPlatformState.r.removedBuiltinSiteIds, []), site = removed.includes(siteId) ? null : bgSitesState.Y(siteId, sites), loginUrl = loginProbeUrl(site?.loginUrl);
    if (!site || !loginUrl)
      return loginProbeResult(
        siteId,
        `unavailable`,
        [],
        [`站点不存在或登录页地址无效，请先检查本站地址`]
      );
    const urlKey = await loginDiscoveryUrlKey(loginUrl.href), saved = readSavedLoginDiscovery(site, urlKey);
    if (!force && saved) return structuredClone(saved);
    if (savedOnly && !force)
      return {
        ...loginProbeResult(
          siteId,
          `not-detected`,
          [],
          [`本站尚未保存登录方式，点击「更新登录方式」读取一次`]
        ),
        source: `none`,
        persisted: false
      };
    const key = JSON.stringify([site.id, urlKey]), pending = loginPageProbePending.get(key);
    if (pending) return structuredClone(await pending);
    const operation = runLoginPageProbe(site, loginUrl, deadline).then(async (result) => {
      try {
        return await saveLoginDiscovery(siteId, loginUrl.href, urlKey, result);
      } catch {
        return {
          ...result,
          source: `page`,
          persisted: false,
          updateError: `本次登录方式未能保存，请点击「更新登录方式」重试`
        };
      }
    }).finally(() => {
      loginPageProbePending.delete(key);
    });
    loginPageProbePending.set(key, operation);
    return structuredClone(await operation);
  }
  async function handleSitesMessage(e2, i) {
    switch (e2.type) {
      case `PROBE_LOGIN_PAGE`:
        return bgEntryState.Q(i) ? {
          ok: true,
          feature: {
            loginOptions: await probeSiteLoginPage(
              String(e2.siteId ?? ``),
              e2.force === true,
              e2.savedOnly === true
            )
          }
        } : { ok: false, error: `仅扩展管理页可以识别本站登录方式` };
      case `PROBE_SITE`:
        return bgEntryState.Q(i) ? { ok: true, feature: { probe: await Jt(e2.url) } } : { ok: false, error: `仅扩展管理页可以探测站点` };
    }
  }
  async function handleSitesMutation(e2) {
    switch (e2.action) {
      case `add-site`:
        return await bgSitesState.store.addSite(e2.input), { ok: true };
      case `add-sites`: {
        let n = await bgPlatformState.t.get(bgPlatformState.r.sites, []), i = new Set([...n, ...bgSitesState.j].map((e3) => e3.loginUrl.trim()));
        return {
          ok: true,
          added: await bgSitesState.store.addSites(e2.inputs, i, e2.preserveDuplicates)
        };
      }
      case `update-site`:
        return await bgSitesState.store.updateSite(e2.siteId, e2.patch), { ok: true };
      case `move-site`:
        return await bgSitesState.store.moveSite(e2.siteId, e2.direction, e2.orderedIds), { ok: true };
    }
  }
  function initializeBackgroundSites(step) {
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
          UNKNOWN: `unknown`
        };
        break;
      }
      case 10: {
        bgSitesState.d = {
          NEW_API: `new-api`,
          SUB2API: `sub2api`,
          VO_API_V2: `voapi-v2`,
          UNSUPPORTED: `unsupported`
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
            submit: `button[type="submit"]`
          },
          closeModalSelectors: [
            `button >> text=今日关闭`,
            `button >> text=关闭公告`,
            ...bgCheckinState.o
          ],
          successIndicator: `div >> text=账户数据, div >> text=Account Data, a[href="/console/token"], a[href="/console/topup"]`,
          checkin: {
            method: `relogin`,
            url: `/console`,
            logoutApiUrl: `/api/user/logout`,
            logoutStorageKeys: [`user`, `token`, `access_token`],
            logoutMenuSelector: `.semi-navigation-footer .semi-avatar, .semi-navigation-footer .semi-dropdown`,
            logoutSelector: `text=退出`
          },
          adapter: {
            siteType: bgSitesState.u.NEW_API,
            family: bgSitesState.d.NEW_API,
            checkinPath: `/console`,
            checkin: { pathPatterns: [`/console*`], titleWords: [`每日签到`, `daily check-in`] },
            quotaPerUnit: 5e5
          }
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
            titleWords: [`agent router`, `agentrouter`]
          },
          preset: bgSitesState.f
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
              submit: `button[type="submit"]`
            },
            closeModalSelectors: bgCheckinState.o,
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
              siteType: bgSitesState.u.NEW_API,
              family: bgSitesState.d.NEW_API,
              checkinPath: `/profile`,
              checkin: { pathPatterns: [`/profile*`], titleWords: [`每日签到`] },
              quotaPerUnit: 5e5
            }
          }
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
              submit: `button.submit-btn, button >> text=用户登录`
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
              claimUniqueText: true,
              successText: [`领取成功`, `权益已领取`, `已生效`, `生效中`],
              alreadyText: [`已领取`, `今日已领取`]
            },
            adapter: {
              siteType: bgSitesState.u.NEW_API,
              family: bgSitesState.d.NEW_API,
              checkinPath: `/list/`,
              checkin: { pathPatterns: [`/list*`], titleWords: [`权益`, `benefit`] }
            }
          }
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
              submit: `button[type="submit"]`
            },
            loginMethod: `auto`,
            closeModalSelectors: bgCheckinState.o,
            checkin: { method: `auto`, url: `/console/tasks` },
            adapter: {
              siteType: bgSitesState.u.NEW_API,
              family: bgSitesState.d.NEW_API,
              checkinPath: `/console/tasks`,
              checkin: { pathPatterns: [`/console/tasks*`], titleWords: [`签到`, `任务`, `task`] },
              quotaPerUnit: 5e5
            }
          }
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
              submit: `button[type="submit"], button.semi-button-primary`
            },
            loginMethod: `auto`,
            closeModalSelectors: bgCheckinState.o,
            checkin: {
              method: `button`,
              url: `/console/personal`,
              buttonSelector: `button >> text=立即签到`,
              alreadySelector: `button >> text=今日已签到`,
              alreadyText: [`今日已签到`]
            },
            adapter: {
              siteType: bgSitesState.u.NEW_API,
              family: bgSitesState.d.NEW_API,
              checkinPath: `/console/personal`,
              checkin: { pathPatterns: [`/console/personal*`], titleWords: [`每日签到`] },
              quotaPerUnit: 5e5
            }
          }
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
              submit: `button[type="submit"], button.semi-button-primary`
            },
            loginMethod: `auto`,
            closeModalSelectors: bgCheckinState.o,
            checkin: { method: `none` },
            adapter: {
              siteType: bgSitesState.u.ANYROUTER,
              family: bgSitesState.d.NEW_API,
              checkinPath: ``,
              quotaPerUnit: 5e5
            }
          }
        };
        break;
      }
      case 18: {
        bgSitesState.y = {
          selectors: {
            username: `#email`,
            password: `#password`,
            submit: `button[type="submit"], .btn.btn-primary`
          },
          loginMethod: `form`,
          tokenConfig: {
            storageKey: `auth_token`,
            headerName: `Authorization`,
            headerPrefix: `Bearer `,
            identityEndpoint: `/api/v1/auth/me`
          },
          closeModalSelectors: bgCheckinState.o,
          checkin: {
            method: `button`,
            url: `/check-in`,
            buttonSelector: `button >> text=立即签到, button >> text=Check in`,
            alreadySelector: `button >> text=今日已签到, button >> text=Already checked in today`,
            successText: [`签到成功`, `Checked in — got`],
            alreadyText: [`今日已签到`, `今天已经签过了`, `Already checked in today`]
          },
          adapter: {
            siteType: bgSitesState.u.SUB2API,
            family: bgSitesState.d.SUB2API,
            checkinPath: `/check-in`,
            checkin: { pathPatterns: [`/check-in*`], titleWords: [`每日签到`, `daily check-in`] },
            quotaPerUnit: 1
          }
        };
        break;
      }
      case 19: {
        bgSitesState.b = {
          id: `linxi`,
          label: `林夕`,
          siteType: bgSitesState.u.SUB2API,
          fingerprints: { hostnames: [`k40.shengqainbang.cn`], titleWords: [`林夕`] },
          preset: bgSitesState.y
        };
        break;
      }
      case 20: {
        bgSitesState.x = {
          id: `baibei`,
          label: `百倍`,
          siteType: bgSitesState.u.SUB2API,
          fingerprints: { hostnames: [`sub.100xlabs.space`] },
          preset: bgSitesState.y
        };
        break;
      }
      case 21: {
        bgSitesState.S = {
          selectors: {
            username: `input[type="email"], #email, input[name="email"]`,
            password: `#password, input[type="password"]`,
            submit: `button[type="submit"]`
          },
          loginMethod: `form`,
          tokenConfig: {
            storageKey: `auth_token`,
            headerName: `Authorization`,
            headerPrefix: `Bearer `,
            identityEndpoint: `/api/v1/auth/me`
          },
          closeModalSelectors: bgCheckinState.o,
          checkin: {
            method: `auto`,
            url: `/checkin`,
            buttonSelector: `button >> text=立即签到`,
            alreadySelector: `button >> text=今日已签到, button >> text=今天已签到, button >> text=已签到`,
            claimConfirmSelector: `button >> text=领取奖励`,
            successText: [`签到成功`, `领取成功`, `领取完成`],
            alreadyText: [`今日已签到`, `今天已签到`, `已签到`]
          },
          adapter: {
            siteType: bgSitesState.u.SUB2API,
            family: bgSitesState.d.SUB2API,
            checkinPath: `/checkin`,
            checkin: { pathPatterns: [`/checkin*`], titleWords: [`每日签到`, `daily check-in`] },
            quotaPerUnit: 1
          }
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
            titleWords: [`登仙公益站`, `登仙`, `denxio`]
          },
          preset: bgSitesState.S
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
              `input[type="text"]`
            ].join(`, `),
            password: `input[name="password"], input[autocomplete="current-password"], input[type="password"]`,
            submit: `button[type="submit"], input[type="submit"], button >> text=登录`
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
              `input[type="button"][value*="签到"]`
            ].join(`, `),
            alreadySelector: [
              `.daily-checkin-page-action .daily-checkin-done`,
              `.daily-checkin-done`,
              `button >> text=今天已签到`,
              `button >> text=今日已签到`,
              `button >> text=已完成`,
              `input[value="今天已签到"]`,
              `input[value="今日已签到"]`,
              `input[value="已完成"]`
            ].join(`, `),
            successText: [`签到成功`, `签到完成`, `今天已签到`, `今日已签到`, `已完成`],
            alreadyText: [`今天已签到`, `今日已签到`, `已完成`]
          },
          adapter: {
            siteType: bgSitesState.u.UNKNOWN,
            family: bgSitesState.d.UNSUPPORTED,
            checkinPath: `/daily_checkin`,
            checkin: { pathPatterns: [`/daily_checkin*`], titleWords: [`每日签到`] }
          }
        };
        break;
      }
      case 24: {
        bgSitesState.T = {
          id: `linux-sb`,
          label: `Linux.SB`,
          siteType: bgSitesState.u.UNKNOWN,
          fingerprints: { hostnames: [`linux.sb`] },
          preset: bgSitesState.w
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
            closeModalSelectors: bgCheckinState.o,
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
              siteType: bgSitesState.u.NEW_API,
              family: bgSitesState.d.NEW_API,
              checkinPath: `/profile`,
              checkin: { pathPatterns: [`/profile*`], titleWords: [`每日签到`] },
              quotaPerUnit: 5e5
            }
          }
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
                `button >> text=Checked in`
              ].join(`, `),
              readyTimeoutMs: 15e3,
              fallbackToUrl: false,
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
                    `header [data-radix-dropdown-menu-trigger]:has([class*="rounded-full" i])`
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
                    `a >> text=Profile`
                  ].join(`, `),
                  timeoutMs: 12e3
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
                    `button >> text=Profile`
                  ].join(`, `),
                  waitFor: [
                    `button >> text=立即签到`,
                    `button >> text=已签到`,
                    `button >> text=Check in now`,
                    `button >> text=Checked in`
                  ].join(`, `),
                  timeoutMs: 15e3,
                  mayNavigate: true
                }
              ]
            }
          },
          adapter: {
            ...bgSitesState.E.preset.adapter,
            checkin: {
              ...bgSitesState.E.preset.adapter?.checkin,
              pathPatterns: [...bgSitesState.E.preset.adapter?.checkin?.pathPatterns ?? []],
              titleWords: [...bgSitesState.E.preset.adapter?.checkin?.titleWords ?? []]
            }
          }
        };
        break;
      }
      case 28: {
        bgSitesState.k = {
          id: `tabiai`,
          label: `TaBiAI`,
          siteType: bgSitesState.u.NEW_API,
          fingerprints: { hostnames: [`tabitoken.com`], titleWords: [`tabiai`, `tabitoken`] },
          preset: bgSitesState.O
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
            submit: `button[type="submit"], button >> text=登录, button >> text=Sign in`
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
              titleWords: [`浮梦引光`, `抽奖`, `每日签到`]
            },
            quotaPerUnit: 5e5
          },
          authBootstrap: { endpoint: `/api/user/auth/refresh` }
        };
        break;
      }
      case 30: {
        bgSitesState.ee = {
          id: `leilei`,
          label: `一梦五千年`,
          siteType: bgSitesState.u.NEW_API,
          fingerprints: { hostnames: [`fapi.leileihog.top`] },
          preset: bgSitesState.A
        };
        break;
      }
      case 31: {
        bgSitesState.te = {
          selectors: {
            username: bgCheckinState.s.join(`, `),
            password: bgCheckinState.c.join(`, `),
            submit: `button[type="submit"], button.semi-button-primary`
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
            alreadyText: [`今日已签到`, `已签到`]
          },
          adapter: {
            siteType: bgSitesState.u.NEW_API,
            family: bgSitesState.d.NEW_API,
            checkinPath: `/console/personal`,
            checkin: { pathPatterns: [`/console/personal*`], titleWords: [`每日签到`, `试试手气`] },
            quotaPerUnit: 5e5
          }
        };
        break;
      }
      case 32: {
        bgSitesState.ne = {
          id: `vsllm`,
          label: `VSLLM`,
          siteType: bgSitesState.u.NEW_API,
          fingerprints: { hostnames: [`vsllm.com`] },
          preset: bgSitesState.te
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
            submit: `button[type="submit"], input[type="submit"], button >> text=登录`
          },
          preLoginClickSelector: [
            `header a[href="/login"]`,
            `nav a[href="/login"]`,
            `a[href="/login"]`,
            `header button >> text=登录`,
            `nav button >> text=登录`,
            `header a >> text=登录`,
            `nav a >> text=登录`
          ].join(`, `),
          closeModalSelectors: bgCheckinState.o,
          checkin: {
            method: `button`,
            url: `/`,
            apiUrl: `/api/user/clock_in`,
            buttonSelector: `button >> text=每日签到, a >> text=每日签到`,
            alreadySelector: `button >> text=今日已签到, button >> text=今天已签到, button >> text=已签到`,
            successText: [`签到成功`, `恭喜获取`, `恭喜获得`],
            alreadyText: [`今日已签到`, `今天已签到`, `已经签到`, `已签到`]
          },
          adapter: {
            siteType: bgSitesState.u.UNKNOWN,
            family: bgSitesState.d.UNSUPPORTED,
            checkinPath: `/`,
            checkin: { pathPatterns: [`/`], titleWords: [`每日签到`] },
            quotaPerUnit: 1
          }
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
            preset: bgSitesState.re
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
                match: (e2) => bgPlatformState.l(e2) && typeof e2.code == `string`
              }
            },
            preset: {
              selectors: {
                username: `#email`,
                password: `#password`,
                submit: `button[type="submit"], .btn.btn-primary`
              },
              loginMethod: `token`,
              tokenConfig: {
                storageKey: `auth_token`,
                headerName: `Authorization`,
                headerPrefix: `Bearer `,
                identityEndpoint: `/api/v1/auth/me`
              },
              closeModalSelectors: bgCheckinState.o,
              checkin: { method: `auto`, url: `/check-in` },
              adapter: {
                siteType: bgSitesState.u.SUB2API,
                family: bgSitesState.d.SUB2API,
                checkinPath: `/check-in`,
                checkin: { pathPatterns: [`/check-in*`], titleWords: [`每日签到`, `daily check-in`] },
                quotaPerUnit: 1
              }
            }
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
                match: (e2) => bgPlatformState.l(e2) && e2.success === false
              }
            },
            preset: {
              selectors: {
                username: `#username`,
                password: `#password`,
                submit: `button[type="submit"]`
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
                  titleWords: [`每日签到`, `daily check-in`]
                },
                quotaPerUnit: 5e5
              }
            }
          }
        ];
        break;
      }
      case 35: {
        bgSitesState.j = [];
        break;
      }
      case 36: {
        bgSitesState.le = /* @__PURE__ */ new Set([`leilei-daily`]);
        break;
      }
      case 56: {
        bgSitesState.zt = 6e3;
        break;
      }
      case 57: {
        bgSitesState.Bt = {
          siteType: bgSitesState.u.UNKNOWN,
          evidence: `未能识别站点系统，请手动确认选择器`
        };
        break;
      }
      case 75: {
        bgSitesState.rr = {
          "New-API-User": bgSitesState.u.NEW_API,
          "Veloera-User": bgSitesState.u.VELOERA,
          "X-Api-User": bgSitesState.u.V_API,
          "voapi-user": bgSitesState.u.VO_API,
          "User-id": bgSitesState.u.SUPER_API,
          "Rix-Api-User": bgSitesState.u.RIX_API,
          "neo-api-user": bgSitesState.u.NEO_API
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
          [bgSitesState.d.UNSUPPORTED]: {}
        };
        break;
      }
      case 79: {
        bgSitesState.cr = /* @__PURE__ */ new Set([
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
          bgSitesState.u.ANYROUTER
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
          (bgSitesState.E.fingerprints.hostnames ?? []).map((e2) => e2.toLowerCase())
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
          async moveSite(e2, n, i) {
            return bgPlatformState.R(async () => {
              let a = await bgPlatformState.t.get(bgPlatformState.r.sites, []), o = bgSitesState.j.filter((e3) => !a.some((t) => t.id === e3.id)), s = [...a, ...o], c;
              if (i?.length) {
                let e3 = /* @__PURE__ */ new Map();
                for (let [t, n2] of i.entries()) e3.has(n2) || e3.set(n2, t);
                c = s.map((t, n2) => ({ site: t, key: e3.get(t.id) ?? i.length + n2 })).sort((e4, t) => e4.key - t.key).map(({ site: e4 }) => e4);
              } else {
                c = s.map((e3, t2) => ({ ...e3, sortOrder: e3.sortOrder ?? t2 })).sort((e3, t2) => e3.sortOrder - t2.sortOrder || e3.name.localeCompare(t2.name));
                let t = c.findIndex((t2) => t2.id === e2), r = n === `up` ? t - 1 : t + 1;
                if (t < 0 || r < 0 || r >= c.length) return;
                [c[t], c[r]] = [c[r], c[t]];
              }
              await bgPlatformState.t.set(
                bgPlatformState.r.sites,
                c.map((e3, t) => ({ ...e3, sortOrder: t }))
              );
            });
          }
        });
        break;
      }
      case 127: {
        Object.assign(bgSitesState.store, {
          addSite(e2) {
            return bgPlatformState.R(async () => {
              bgCheckinState.Dt(e2);
              let [n, i] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, [])
              ]);
              bgProxiesState.vo(e2.proxyId, bgProxiesState.go(i)), await bgPlatformState.t.set(
                bgPlatformState.r.sites,
                n.concat({ ...e2, id: bgPlatformState.Ti(`site`) })
              );
            });
          }
        });
        break;
      }
      case 128: {
        Object.assign(bgSitesState.store, {
          addSites(e2, n, i = false) {
            return bgPlatformState.R(async () => {
              e2.forEach(bgCheckinState.Dt);
              let [a, o] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, [])
              ]), s = bgProxiesState.go(o), c = new Set(n);
              a.forEach((e3) => c.add(e3.loginUrl.trim()));
              let l2 = [];
              for (let t of e2) {
                let e3 = t.loginUrl.trim();
                !e3 || !i && c.has(e3) || t.proxyId && !s.has(t.proxyId) || (c.add(e3), l2.push({ ...t, id: bgPlatformState.Ti(`site`) }));
              }
              return l2.length && await bgPlatformState.t.set(bgPlatformState.r.sites, a.concat(l2)), l2.length;
            });
          }
        });
        break;
      }
      case 129: {
        Object.assign(bgSitesState.store, {
          updateSite(e2, n) {
            return bgPlatformState.R(async () => {
              let [i, a] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, [])
              ]), o = bgSitesState.j.find((t) => t.id === e2), s = i.find((t) => t.id === e2) ?? o;
              `proxyId` in n && n.proxyId !== s?.proxyId && bgProxiesState.vo(n.proxyId, bgProxiesState.go(a));
              let c = false, l2 = i.map((t) => {
                if (t.id !== e2) return t;
                c = true;
                let r = { ...t, ...n, ...o ? { builtin: true } : {} };
                return bgCheckinState.Dt(r), r;
              });
              if (!c && o) {
                let e3 = { ...o, ...n, builtin: true };
                bgCheckinState.Dt(e3), l2.push(e3);
              }
              await bgPlatformState.t.set(bgPlatformState.r.sites, l2);
            });
          }
        });
        break;
      }
    }
  }
  var siteService = Object.freeze({
    list: async () => {
      const { userSites, removedBuiltinSiteIds } = await bgEntryState.store.load();
      const removed = new Set(removedBuiltinSiteIds);
      const ids = /* @__PURE__ */ new Set([
        ...userSites.map((site) => site.id),
        ...bgSitesState.j.filter((site) => !removed.has(site.id)).map((site) => site.id)
      ]);
      return [...ids].map((id) => Y(id, userSites)).filter(Boolean);
    },
    getConfig: (...args) => Y(...args),
    add: (...args) => bgSitesState.store.addSite(...args),
    addMany: (...args) => bgSitesState.store.addSites(...args),
    update: (...args) => bgSitesState.store.updateSite(...args),
    reorder: (...args) => bgSitesState.store.moveSite(...args),
    remove: (siteId) => bgEntryState.nh({
      action: "delete-entities",
      siteIds: [siteId],
      accountIds: []
    }),
    removeMany: (siteIds) => bgEntryState.nh({
      action: "delete-entities",
      siteIds: [...siteIds],
      accountIds: []
    }),
    handleMessage: handleSitesMessage,
    handleMutation: handleSitesMutation
  });

  // src/modules/accounts/service.js
  var bgAccountsState = { store: {} };
  function kt(e2, t, n) {
    return e2 ? { value: e2, source: `账号级` } : t ? { value: t, source: `站点默认` } : { value: n, source: `内置默认` };
  }
  function At(e2) {
    let t = !!e2.password, n = !!e2.githubUsername?.trim() && !!e2.githubPassword;
    return t === n ? null : n ? `github` : `form`;
  }
  function jt(e2, t) {
    const method = e2.loginMethod || `auto`;
    return {
      loginMethod: method,
      loginMethodSource: method === `auto` ? `当前页面识别` : `账号级`,
      checkinMethod: t.checkin?.method || `auto`
    };
  }
  function Mt(e2) {
    switch (e2) {
      case `token`:
        return { password: false, token: true, sessionCounts: true, github: false, passkey: false };
      case `github`:
        return { password: false, token: false, sessionCounts: false, github: true, passkey: false };
      case `passkey`:
        return { password: false, token: false, sessionCounts: false, github: false, passkey: true };
      case `oauth`:
      case `manual`:
        return { password: false, token: false, sessionCounts: false, github: false, passkey: false };
      case `auto`:
        return { password: false, token: false, sessionCounts: false, github: false, passkey: false };
      case `form`:
        return { password: true, token: false, sessionCounts: false, github: false, passkey: false };
    }
  }
  function Nt(e2) {
    return `登录方式：${e2.loginMethod}（${e2.loginMethodSource}）；签到方式：${e2.checkinMethod}（站点配置）`;
  }
  function Pt(e2) {
    let t = Math.floor(e2 / 16777216) % 256, n = Math.floor(e2 / 65536) % 256;
    return t === 0 || t === 127 || t === 10 || t === 172 && n >= 16 && n <= 31 || t === 192 && n === 168 || t === 169 && n === 254 || t === 100 && n >= 64 && n <= 127;
  }
  function Ft(e2) {
    let t = e2.split(`.`);
    if (t.length !== 4) return null;
    let n = 0;
    for (let e3 of t) {
      if (!/^\d{1,3}$/.test(e3)) return null;
      let t2 = Number(e3);
      if (t2 > 255) return null;
      n = n * 256 + t2;
    }
    return n;
  }
  function It(e2) {
    if (!e2.includes(`:`)) return null;
    let t = e2, n = /:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(t);
    if (n) {
      let e3 = Ft(n[1] ?? ``);
      if (e3 === null) return null;
      let r2 = (Math.floor(e3 / 65536) % 65536).toString(16), i2 = (e3 % 65536).toString(16);
      t = `${t.slice(0, n.index + 1)}${r2}:${i2}`;
    }
    let r = t.split(`::`);
    if (r.length > 2) return null;
    let i = (e3) => {
      if (e3 === ``) return [];
      let t2 = [];
      for (let n2 of e3.split(`:`)) {
        if (!/^[0-9a-f]{1,4}$/.test(n2)) return null;
        t2.push(parseInt(n2, 16));
      }
      return t2;
    };
    if (r.length === 2) {
      let e3 = i(r[0] ?? ``), t2 = i(r[1] ?? ``);
      if (!e3 || !t2) return null;
      let n2 = 8 - e3.length - t2.length;
      if (n2 < 1) return null;
      let a2 = [...e3, ...Array.from({ length: n2 }, () => 0), ...t2];
      return a2.length === 8 ? a2 : null;
    }
    let a = i(t);
    return a && a.length === 8 ? a : null;
  }
  function Lt(e2) {
    if (e2.every((e3) => e3 === 0) || e2.slice(0, 7).every((e3) => e3 === 0) && e2[7] === 1) return true;
    let t = e2.slice(0, 5).every((e3) => e3 === 0), n = t && e2[5] === 65535, r = t && e2[5] === 0 && (e2[6] !== 0 || e2[7] !== 0);
    return n || r ? Pt(e2[6] * 65536 + e2[7]) : e2[0] >= 64512 && e2[0] <= 65023 || e2[0] >= 65152 && e2[0] <= 65215;
  }
  function Rt(e2) {
    let t = e2.trim().toLowerCase().replace(/^\[|\]$/g, ``).replace(/\.$/, ``);
    if (!t) return true;
    let n = Ft(t);
    if (n !== null) return Pt(n);
    let r = It(t);
    return r ? Lt(r) : t === `localhost` || t.endsWith(`.localhost`) || t.endsWith(`.local`) || t.endsWith(`.internal`);
  }
  function P(e2) {
    throw Error(`CBOR 解码失败: ${e2}`);
  }
  function vr(e2) {
    let t = e2 & 32768 ? -1 : 1, n = e2 >> 10 & 31, r = e2 & 1023;
    return n === 0 ? t * r * 2 ** -24 : n === 31 ? r ? NaN : t * (1 / 0) : t * (1 + r / 1024) * 2 ** (n - 15);
  }
  function yr(e2, t) {
    e2 instanceof Uint8Array || P(`输入必须是 Uint8Array`), e2.byteLength === 0 && P(`数据为空`);
    let n = { ...bgAccountsState.hr, ...t };
    e2.byteLength > n.maxInputBytes && P(`超出输入长度上限`);
    let r = new bgAccountsState._r(e2, n), i = r.readItem(0);
    return r.done() || P(`数据尾部有多余字节`), i;
  }
  function br(e2) {
    return e2 === `api` ? `站点接口` : e2 === `storage` ? `本地登录态` : e2 === `visible` ? `页面文本` : `未知来源`;
  }
  function xr(e2) {
    if (!e2 || typeof e2 != `object`) return null;
    let t = e2;
    if (t.success === false) return null;
    let n = t.data ?? t;
    if (!n || typeof n != `object`) return null;
    let r = (e3) => {
      if (typeof e3 == `string` && e3.trim()) return e3.trim();
      if (typeof e3 == `number` && Number.isFinite(e3)) return String(e3);
    }, i = {
      userId: r(n.id) ?? r(n.user_id) ?? r(n.userId),
      username: r(n.username) ?? r(n.user_name) ?? r(n.name),
      email: r(n.email),
      displayName: r(n.display_name) ?? r(n.displayName) ?? r(n.nickname)
    };
    return Object.values(i).some(Boolean) ? i : null;
  }
  function Sr(e2) {
    return Nr(kr(e2));
  }
  function kr(e2, t = false) {
    if (!e2) return ``;
    let n = [], r = false, i = false;
    for (let a of e2.split(/[\r\n]+/).map((e3) => e3.trim()).filter(Boolean)) {
      if (bgAccountsState.wr.test(a)) {
        r = true, i = false;
        continue;
      }
      let e3 = bgAccountsState.Tr.test(a);
      if ((e3 || bgAccountsState.Er.test(a)) && (r = false), r || bgAccountsState.Cr.test(a)) {
        i = false;
        continue;
      }
      let o = e3 || bgAccountsState.Dr.test(a), s = i && /^[^\s<>]{2,80}(?:\s*[·|]\s*[^\r\n]{1,40})?$/.test(a);
      (t || o || s) && n.push(a), i = o;
    }
    return n.join(`
`);
  }
  function Ar(e2) {
    for (let t = e2; t; t = t.parentElement) {
      if (t.hidden || t.getAttribute(`aria-hidden`) === `true` || t.hasAttribute(`inert`)) return false;
      let e3 = getComputedStyle(t);
      if (e3.display === `none` || e3.visibility === `hidden` || e3.visibility === `collapse`) return false;
    }
    return true;
  }
  function jr() {
    let e2 = [kr(document.body?.innerText)];
    if (typeof document.querySelectorAll != `function`) return e2[0];
    for (let t of document.querySelectorAll(
      `[role="menu"], [aria-haspopup="menu"], [aria-haspopup="true"]`
    )) {
      if (!Ar(t) || t.closest(`table, [role="table"], [role="grid"], .lottery-sidebar`)) continue;
      let n = t.innerText ?? t.textContent ?? ``;
      if (!n.trim() || n.length > 2e3) continue;
      let r = t.getAttribute(`role`) === `menu` && bgAccountsState.Or.test(n), i = t.hasAttribute(`aria-haspopup`) && (!!t.closest(`header, nav, [role="banner"]`) || /user|account|profile|avatar|用户|账号|账户|个人|头像/i.test(
        `${t.getAttribute(`aria-label`) ?? ``} ${t.getAttribute(`title`) ?? ``}`
      ));
      (r || i) && e2.push(kr(n, true));
    }
    return e2.filter(Boolean).join(`
`);
  }
  function Mr(e2) {
    let t = new Map(e2.map((e3) => [e3.toLowerCase(), e3]));
    return t.size === 1 ? t.values().next().value : void 0;
  }
  function Nr(e2) {
    if (!e2) return null;
    let t = { source: `visible` }, n = Pr(e2);
    n && (t.userId = n);
    let r = [...e2.matchAll(/(?<![\w.+@*-])@([A-Za-z0-9][A-Za-z0-9._-]{1,38})\b/g)].map((e3) => e3[1]).filter((e3) => !e3.includes(`.`)), i = [
      ...e2.matchAll(
        /(?:^|\s)(?:用户名|登录名|当前(?:登录)?(?:账号|账户)|username|login name)(?:\s*[:：]\s*|\s+)([\p{L}\p{N}][\p{L}\p{N}._+@-]{1,79})/giu
      )
    ].map((e3) => e3[1]).filter((e3) => !e3.includes(`@`)), a = Mr(i.length ? i : r);
    a && (t.username = a);
    let o = Mr([...e2.matchAll(/(?<![\w.+*-])[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g)].map((e3) => e3[0]));
    return o && (t.email = o), t.userId || t.username || t.email ? t : null;
  }
  function Pr(e2) {
    let t = /(?<![A-Za-z])(?:用户\s*ID|User\s*ID|UID)\s*[:：#]?\s*(\d{1,12})\b/gi, n = /* @__PURE__ */ new Set();
    for (let r of e2.matchAll(t)) {
      let t2 = r[1];
      if (!t2) continue;
      let i = e2.slice(Math.max(0, (r.index ?? 0) - 14), r.index ?? 0);
      bgAccountsState.Cr.test(i) || n.add(t2);
    }
    return n.size === 1 ? [...n][0] : void 0;
  }
  function Rr(e2, t) {
    let n = e2.trim().toLowerCase(), r = t == null ? jr() : kr(t);
    if (!r || n.length < bgAccountsState.Fr) return null;
    if (zr(r.toLowerCase(), n)) return { matched: e2.trim(), masked: false };
    let i = n.lastIndexOf(`@`);
    if (i <= 0) return null;
    let a = n.slice(0, i), o = n.slice(i + 1);
    if (!o) return null;
    for (let e3 of r.matchAll(bgAccountsState.Lr)) {
      let t2 = (e3[1] ?? ``).toLowerCase(), n2 = (e3[2] ?? ``).toLowerCase();
      if ((t2 || n2) && (e3[3] ?? ``).toLowerCase() === o && (!t2 || a.startsWith(t2)) && (!n2 || a.endsWith(n2)))
        return { matched: e3[0], masked: true };
    }
    return null;
  }
  function zr(e2, t) {
    for (let n = 0; n <= e2.length; ) {
      let r = e2.indexOf(t, n);
      if (r < 0) return false;
      let i = e2[r - 1] ?? ` `, a = e2[r + t.length] ?? ` `;
      if (!bgAccountsState.Ir.test(i) && !bgAccountsState.Ir.test(a)) return true;
      n = r + 1;
    }
    return false;
  }
  function Br(e2, t) {
    return !e2 || !t ? false : e2.trim().toLowerCase() === t.trim().toLowerCase();
  }
  function Vr(e2, t) {
    let n = [e2.username, e2.email, e2.displayName].filter(Boolean), r = n.find((e3) => Br(e3, t));
    if (r) return r;
    let i = t.includes(`@`) ? t.split(`@`)[0] : null;
    return i ? n.find((e3) => !e3.includes(`@`) && Br(e3, i)) ?? null : null;
  }
  function Hr(e2, t, n = [], r) {
    let i = Vr(e2, t);
    if (i) return { value: i, expected: t, source: `primary` };
    if (r?.username && Br(e2.username, r.username))
      return { value: e2.username, expected: r.username, source: `stored` };
    if (r?.email && Br(e2.email, r.email))
      return { value: e2.email, expected: r.email, source: `stored` };
    let a = /* @__PURE__ */ new Set([t.trim().toLowerCase()]), o = n.map((e3) => e3.trim()).filter((e3) => {
      if (!e3) return false;
      let t2 = e3.toLowerCase();
      return !a.has(t2) && (a.add(t2), true);
    });
    for (let t2 of o) {
      let n2 = t2.includes(`@`) ? Br(e2.email, t2) ? e2.email : void 0 : Br(e2.username, t2) ? e2.username : void 0;
      if (n2) return { value: n2, expected: t2, source: `alias` };
    }
    return null;
  }
  function Ur(e2, t, n, r) {
    let i = r?.pageAccountMatch, a = i && (!e2 || e2.source === `visible`) && Br(i, t) ? i : null;
    if (!e2)
      return n ? { match: `unknown`, detail: `本账号已绑定用户 ID ${n}，当前页面尚未返回用户 ID` } : a ? { match: `confirmed`, detail: `页面显示账号 ${a} 一致（读自页面文本）` } : { match: `unknown`, detail: `读不到当前登录身份` };
    let o = `读自${br(e2.source)}`, s = Hr(e2, t, r?.expectedAliases, r?.expectedIdentity), c = e2.userId ? r?.knownUsers?.[e2.userId] : void 0;
    if (e2.userId && c)
      return {
        match: `mismatch`,
        detail: n ? `当前登录的是用户 ID ${e2.userId}（本站账号 ${c}，${o}），本次要签到的是 ${n}` : `当前登录的是用户 ID ${e2.userId}（本站账号 ${c}，${o}），不是本次账号 ${t}`
      };
    if (n) {
      if (!e2.userId)
        return {
          match: `unknown`,
          detail: `本账号已绑定用户 ID ${n}，当前页面尚未返回用户 ID（${o}）`
        };
      return String(e2.userId) === String(n) ? { match: `confirmed`, detail: `用户 ID ${e2.userId} 一致（${o}，账号备注不参与身份核验）` } : {
        match: `mismatch`,
        detail: `当前登录的是用户 ID ${e2.userId}（${o}），本次要签到的是 ${n}`
      };
    }
    let l2 = [e2.username, e2.email, e2.displayName].filter(Boolean);
    if (l2.length === 0) return { match: `unknown`, detail: `站点未返回可比对的用户名（${o}）` };
    let u = s?.value ?? a;
    return u ? {
      match: `confirmed`,
      detail: s?.source === `stored` ? `账号 ${t} 已保存的站点身份 ${s.expected} 与当前身份一致（${o}）` : s?.source === `alias` ? `账号 ${t} 保存的身份别名 ${s.expected} 与当前身份 ${u} 一致（${o}）` : Br(u, t) ? `账号 ${t} 一致（${o}）` : `账号 ${t} 与站点用户名 ${u} 一致（${o}）`
    } : { match: `mismatch`, detail: `当前登录的是 ${l2[0]}（${o}），本次要签到的是 ${t}` };
  }
  function Wr(e2, t = `rect`) {
    return e2.kind === `inset-left` ? `${t}.left + Math.min(${e2.px}, ${t}.width / 2)` : e2.kind === `relative` ? `${t}.left + ${t}.width * ${Gr(e2.rx)}` : `${t}.left + ${t}.width / 2`;
  }
  function Gr(e2) {
    return `(Number.isFinite(${e2}) ? Math.min(1, Math.max(0, ${e2})) : 0.5)`;
  }
  function yo(e2, t) {
    let n = { ...e2, ...t, id: e2.id };
    const entry = sanitizeLoginEntry(n.loginEntry), method = n.loginMethod || `auto`;
    if (entry && (method === `auto` || entry.method === method)) n.loginEntry = entry;
    else delete n.loginEntry;
    return `loginMethod` in t && !t.loginMethod && delete n.loginMethod, `proxyMode` in t && t.proxyMode !== `pool` && (delete n.proxyId, delete n.proxyPinned), `proxyMode` in t && t.proxyMode !== `custom` && delete n.customProxy, n;
  }
  function Io(e2, t) {
    let n = e2.effectiveLoginMethod ?? `auto`, r = e2.accountIdentityUserId, managedForm = n === `form` && e2.formCredentialsSubmitted === true && !!e2.username?.trim() && !!e2.password && t.verifiedByManagedLogin === true;
    if (t.source !== `api` && !(t.source === `visible` && managedForm))
      return `只有站点接口身份或本轮账密登录后核验的页面身份可以更新账号绑定`;
    if (t.userId && e2.siteAccountUserIds?.[t.userId])
      return `该用户 ID 已属于本站其他账号，已拒绝修改本账号绑定`;
    if (r && t.userId && String(r) !== String(t.userId))
      return `当前用户 ID 与本账号原有绑定不符，已保留原绑定`;
    if (!r && t.userId && n === `auto`)
      return `首次绑定需要先识别当前页面的登录方式，并使用本账号的凭据登录`;
    if (!r && t.userId && n === `form`)
      return managedForm ? null : `首次绑定需要本轮提交此账号的站点密码并确认登录成功`;
    if (n === `manual` && !r)
      return t.userId && [t.username, t.email].some((value) => Br(value, e2.username)) ? null : `手动登录首次绑定需要站点接口返回用户 ID，且用户名或完整邮箱与本账号精确一致`;
    let i = Ur(t, e2.username, r, {
      knownUsers: e2.siteAccountUserIds,
      expectedIdentity: { username: e2.accountIdentityUsername, email: e2.accountIdentityEmail },
      ...n === `github` && e2.githubUsername ? { expectedAliases: [e2.githubUsername] } : {}
    });
    return i.match === `confirmed` || i.match === `unknown` && t.verifiedByManagedLogin === true && n === `github` && e2.githubCredentialsSubmitted === true && e2.githubUsername?.trim() && e2.githubPassword && t.userId ? null : `账号身份未通过写入核验：${i.detail}`;
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
    Io
  });
  async function handleAccountsMessage(e2, i) {
    switch (e2.type) {
      case `SAVE_IDENTITY`:
        return bgPlatformState.X(async () => {
          let t = i.tab?.id;
          if (t == null) return { ok: false, error: `缺少任务标签页` };
          let n = await bgCheckinState.V.get(t);
          if (!n || n.runId !== e2.runId) return { ok: false, error: `任务已结束` };
          if (i.id !== chrome.runtime.id || i.frameId !== 0 || !bgCheckinState.ut(n, i.url ?? i.tab?.url ?? ``))
            return { ok: false, error: `只能由当前任务的本站顶层页面保存账号身份` };
          if (!await bgCheckinState.th(n))
            return { ok: false, error: `账号归属已变更，已拒绝写入旧站身份` };
          if (n.manualLoginWaitUntil) {
            const active = await bgCheckinState.Z.active();
            if (n.manualLoginWaitUntil <= Date.now() || active?.tabId !== n.tabId || active?.accountId !== n.accountId)
              return { ok: false, error: `页面登录等待已结束，已拒绝更新账号身份` };
          }
          if (!e2.identity || typeof e2.identity !== `object` || Array.isArray(e2.identity))
            return { ok: false, error: `账号身份格式无效` };
          if (e2.identity.userId !== void 0 && (typeof e2.identity.userId !== `string` || !e2.identity.userId.trim() || e2.identity.userId.length > 160))
            return { ok: false, error: `账号用户 ID 格式无效` };
          let accounts = await bgPlatformState.t.get(bgPlatformState.r.accounts, []), current = accounts.find((account) => account.id === n.accountId);
          if (!current || current.siteId !== n.siteId)
            return { ok: false, error: `账号归属已变更，已拒绝写入旧站身份` };
          if (n.effectiveLoginMethod === `manual` && (!current.username?.trim() || current.username.trim() !== n.username?.trim() || (current.loginMethod || `auto`) !== (n.loginMethodPreference || `auto`)))
            return { ok: false, error: `本账号的名称或登录偏好已改变，已拒绝旧页面的手动登录身份` };
          let r = n.effectiveLoginMethod === `github` && n.githubCredentialsSubmitted === true && !!n.githubUsername?.trim() && !!n.githubPassword && current.githubUsername?.trim() === n.githubUsername.trim() && current.githubPassword === n.githubPassword || n.effectiveLoginMethod === `form` && n.formCredentialsSubmitted === true && !!n.username?.trim() && !!n.password && current.username?.trim() === n.username.trim() && current.password === n.password, { verifiedByManagedLogin: a, ...o } = e2.identity, s = a === true && r ? { ...o, verifiedByManagedLogin: true } : o, c = Io(
            {
              ...n,
              formCredentialsSubmitted: n.effectiveLoginMethod === `form` && r,
              accountIdentityUserId: current.identity?.userId,
              siteAccountUserIds: Object.fromEntries(
                accounts.filter(
                  (account) => account.id !== current.id && account.siteId === current.siteId && account.identity?.userId
                ).map((account) => [account.identity.userId, account.label || account.username])
              )
            },
            s
          );
          return c ? { ok: false, error: c } : (await bgAccountsState.store.saveAccountIdentity(n.accountId, s, {
            preserveBinding: true
          }), await bgCheckinState.V.updateIdentity(t, e2.runId, s), { ok: true });
        });
      case `CAPTURE_SESSION`:
        return bgEntryState.Q(i) ? bgPlatformState.X(() => bgProxiesState.vh(e2.accountId, e2.tabId)) : { ok: false, error: `仅扩展管理页可以抓取登录态` };
      case `SESSION_REFRESHED`:
        return bgPlatformState.X(async () => {
          let t = i.tab?.id;
          if (t == null) return { ok: false, error: `缺少标签页信息` };
          let n = await bgCheckinState.V.get(t);
          return !n || n.runId !== e2.runId || n.accountId !== e2.accountId ? { ok: false, error: `任务已结束` } : await bgCheckinState.th(n) ? (await bgAccountsState.store.saveAccountSession(e2.accountId, {
            accessToken: e2.accessToken,
            refreshToken: e2.refreshToken,
            tokenExpiresAt: e2.tokenExpiresAt,
            capturedAt: Date.now(),
            ...n.site.adapter?.siteType ? { siteType: n.site.adapter.siteType } : {}
          }), { ok: true }) : { ok: false, error: `账号归属已变更，已拒绝写入旧站会话` };
        });
      case `CLEAR_SITE_COOKIES`:
        return bgPlatformState.X(async () => {
          let t = i.tab?.id, n = i.url ?? i.tab?.url;
          if (t == null || i.frameId !== 0) return { ok: false, error: `缺少顶层任务标签页` };
          let r = await bgCheckinState.V.get(t);
          if (!r || r.runId !== e2.runId) return { ok: false, error: `任务已结束` };
          if (!bgCheckinState.ut(r, n)) return { ok: false, error: `当前页面不属于该签到任务` };
          await bgCheckinState.V.setFormCredentialsSubmitted(t, r.runId, false);
          await bgCheckinState.V.setGithubCredentialsSubmitted(t, r.runId, false);
          return {
            ok: true,
            feature: { siteCookieClear: await bgLearningState.wu(t, r.site.loginUrl) }
          };
        });
    }
  }
  async function handleAccountsMutation(e2) {
    switch (e2.action) {
      case `add-account`:
        return await bgAccountsState.store.addAccount(e2.input), { ok: true };
      case `add-accounts`: {
        let n = await bgPlatformState.t.get(bgPlatformState.r.sites, []), i = new Set([...n, ...bgSitesState.j].map((e3) => e3.id));
        return {
          ok: true,
          ...await bgAccountsState.store.addAccounts(e2.inputs, i, e2.preserveDuplicates)
        };
      }
      case `update-account`: {
        let n = e2.patch.siteId;
        return typeof n == `string` ? bgPlatformState.X(
          async () => bgPlatformState.rm(async () => {
            let i = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find(
              (t) => t.id === e2.accountId
            );
            return i && n !== i.siteId && await bgCheckinState.eh([e2.accountId]), await bgAccountsState.store.updateAccount(e2.accountId, e2.patch), { ok: true };
          })
        ) : (await bgAccountsState.store.updateAccount(e2.accountId, e2.patch), { ok: true });
      }
    }
  }
  function initializeBackgroundAccounts(step) {
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
          maxTotalItems: 1e5
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
          constructor(e2, t) {
            this.bytes = e2, this.limits = t;
          }
          done() {
            return this.pos >= this.bytes.length;
          }
          readItem(e2) {
            e2 > this.limits.maxDepth && P(`超出深度上限`), this.items += 1, this.items > this.limits.maxTotalItems && P(`超出解码总量上限`);
            let t = this.readByte(), n = t >> 5, r = t & 31;
            if (r === 31 && P(`不支持不定长度`), r > 27 && P(`非法的类型字节（保留的 additional info）`), n === 7)
              return this.readSimpleOrFloat(r);
            let i = r < 24 ? r : this.readUintArgument(r);
            switch (n) {
              case 0:
                return i > bgAccountsState.gr && P(`整数超出安全范围`), i;
              case 1:
                return i >= bgAccountsState.gr && P(`整数超出安全范围`), -1 - i;
              case 2:
                P(`不支持字节串`);
              case 3:
                return this.readText(i);
              case 4:
                return this.readArray(i, e2);
              case 5:
                return this.readMap(i, e2);
              default:
                P(`不支持标签`);
            }
          }
          readSimpleOrFloat(e2) {
            switch (e2) {
              case 20:
                return false;
              case 21:
                return true;
              case 22:
                return null;
              case 25:
                return vr(this.readRaw16());
              case 26: {
                let e3 = this.readRaw32(), t = new DataView(new ArrayBuffer(4));
                return t.setUint32(0, e3), t.getFloat32(0);
              }
              case 27: {
                let e3 = this.readRaw32(), t = this.readRaw32(), n = new DataView(new ArrayBuffer(8));
                return n.setUint32(0, e3), n.setUint32(4, t), n.getFloat64(0);
              }
              default:
                P(`不支持的简单值`);
            }
          }
          readArray(e2, t) {
            this.checkContainerLength(e2);
            let n = [];
            for (let r = 0; r < e2; r += 1) n.push(this.readItem(t + 1));
            return n;
          }
          readMap(e2, t) {
            this.checkContainerLength(e2);
            let n = /* @__PURE__ */ Object.create(null);
            for (let r = 0; r < e2; r += 1) {
              let e3 = this.readItem(t + 1), r2 = this.readItem(t + 1);
              typeof e3 == `string` && (n[e3] = r2);
            }
            return n;
          }
          readText(e2) {
            e2 > this.limits.maxTextLength && P(`超出文本长度上限`);
            let t = this.readBytes(e2);
            try {
              return new TextDecoder(`utf-8`, { fatal: true }).decode(t);
            } catch {
              P(`文本不是合法 UTF-8`);
            }
          }
          checkContainerLength(e2) {
            e2 > this.limits.maxContainerLength && P(`超出容器长度上限`), e2 > this.bytes.length - this.pos && P(`数据不完整（容器长度超出剩余字节）`);
          }
          readUintArgument(e2) {
            switch (e2) {
              case 24:
                return this.readByte();
              case 25:
                return this.readRaw16();
              case 26:
                return this.readRaw32();
              case 27: {
                let e3 = this.readRaw32(), t = this.readRaw32(), n = e3 * 4294967296 + t;
                return n > bgAccountsState.gr && P(`整数超出安全范围`), n;
              }
              default:
                P(`非法的类型字节（保留的 additional info）`);
            }
          }
          readByte() {
            return this.pos >= this.bytes.length && P(`数据不完整`), this.bytes[this.pos++];
          }
          readRaw16() {
            return this.readByte() << 8 | this.readByte();
          }
          readRaw32() {
            return this.readByte() * 16777216 + (this.readByte() << 16) + (this.readByte() << 8) + this.readByte();
          }
          readBytes(e2) {
            e2 > this.bytes.length - this.pos && P(`数据不完整`);
            let t = this.bytes.subarray(this.pos, this.pos + e2);
            return this.pos += e2, t;
          }
        };
        break;
      }
      case 83: {
        bgAccountsState.Cr = /(邀请|受邀|推荐|推广|上级|下级|下线|团队|排行|榜|赞助|作者|客服|管理员|中奖|获奖|公告|invit|referr|sponsor|winner|leaderboard|announcement)/i;
        break;
      }
      case 84: {
        bgAccountsState.wr = /中奖(?:名单|记录|用户)|获奖(?:名单|记录)|排行榜|排名榜|用户列表|成员列表|历史记录|公告|\b(?:winners?|leaderboard|rankings?|draw history|announcements?)\b/i;
        break;
      }
      case 85: {
        bgAccountsState.Tr = /^(?:个人资料|个人信息|账户信息|账号信息|我的账户|我的账号|我的资料|profile|my account|account (?:info(?:rmation)?|details))\s*[:：]?$/i;
        break;
      }
      case 86: {
        bgAccountsState.Er = /^(?:当前(?:登录)?(?:账号|账户|用户)|我的(?:账号|账户|邮箱))\s*[:：]?/;
        break;
      }
      case 87: {
        bgAccountsState.Dr = /(?<![A-Za-z])(?:用户\s*ID|User\s*ID|UID)\s*[:：#]?\s*\d|当前(?:登录)?(?:账号|账户|用户)|用户名|登录名|账[号户]|邮箱|电子邮件|\b(?:e-?mail|username|account)\b|欢迎回来|welcome back/i;
        break;
      }
      case 88: {
        bgAccountsState.Or = /退出登录|退出账号|注销登录|个人资料|账户设置|账号设置|\b(?:log\s*out|sign\s*out|my account|account settings|profile)\b/i;
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
          `label`
        ].join(`, `);
        break;
      }
      case 109: {
        bgAccountsState.Hi = {
          accessToken: `auth_token`,
          refreshToken: `refresh_token`,
          expiresAt: `token_expires_at`,
          user: `auth_user`
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
            evidence: `Sub2API：localStorage 的 auth_token / refresh_token`
          },
          {
            siteType: bgSitesState.u.VO_API_V2,
            nestedToken: { key: `userStore`, path: [`auth`, `token`] },
            userKey: `user`,
            evidence: `VoAPI v2：localStorage 的 userStore.auth.token`
          },
          {
            siteType: bgSitesState.u.NEW_API,
            userKey: `user`,
            evidence: `new-api 系：localStorage 的 user（登录态在 cookie 里）`
          }
        ];
        break;
      }
      case 135: {
        Object.assign(bgAccountsState.store, {
          addAccount(e2) {
            return bgPlatformState.R(async () => {
              let [n, i] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, [])
              ]);
              if ((e2.proxyMode ?? `inherit`) === `pool`) {
                if (!e2.proxyId) throw Error(`账号选择了代理池，但没有指定真实出口`);
                bgProxiesState.vo(e2.proxyId, bgProxiesState.go(i));
              }
              await bgPlatformState.t.set(
                bgPlatformState.r.accounts,
                n.concat(yo({ id: bgPlatformState.Ti(`acc`) }, e2))
              );
            });
          }
        });
        break;
      }
      case 136: {
        Object.assign(bgAccountsState.store, {
          addAccounts(e2, n, i = false) {
            return bgPlatformState.R(async () => {
              let [a, o] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, [])
              ]), s = bgProxiesState.go(o), c = new Set(a.map((e3) => `${e3.siteId}\0${e3.username.trim().toLowerCase()}`)), l2 = [];
              for (let t of e2) {
                let e3 = t.username.trim(), r = `${t.siteId}\0${e3.toLowerCase()}`;
                n.has(t.siteId) && e3 && t.password && (i || !c.has(r)) && ((t.proxyMode ?? `inherit`) !== `pool` || t.proxyId && s.has(t.proxyId)) && (c.add(r), l2.push(
                  yo(
                    { id: bgPlatformState.Ti(`acc`) },
                    {
                      ...t,
                      username: e3,
                      label: t.label?.trim() || void 0
                    }
                  )
                ));
              }
              return l2.length && await bgPlatformState.t.set(bgPlatformState.r.accounts, a.concat(l2)), { added: l2.length, skipped: e2.length - l2.length };
            });
          }
        });
        break;
      }
      case 137: {
        Object.assign(bgAccountsState.store, {
          updateAccount(e2, n) {
            return bgPlatformState.R(async () => {
              let [i, a, o, s] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
                bgPlatformState.t.get(bgPlatformState.r.removedBuiltinSiteIds, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, [])
              ]), c = i.find((t) => t.id === e2);
              if (!c) throw Error(`账号不存在或已被删除`);
              let l2 = yo(c, n);
              if ((l2.proxyMode ?? `inherit`) === `pool` && (l2.proxyId !== c.proxyId || (c.proxyMode ?? `inherit`) !== `pool`)) {
                if (!l2.proxyId) throw Error(`账号选择了代理池，但没有指定真实出口`);
                bgProxiesState.vo(l2.proxyId, bgProxiesState.go(s));
              }
              if (typeof n.siteId != `string` || n.siteId === c.siteId) {
                await bgPlatformState.t.set(
                  bgPlatformState.r.accounts,
                  i.map((t) => t.id === e2 ? yo(t, n) : t)
                );
                return;
              }
              let u = n.siteId.trim(), d = new Set(o);
              if (!(a.some((e3) => e3.id === u) || bgSitesState.j.some((e3) => e3.id === u && !d.has(e3.id))))
                throw Error(`目标站点不存在，请重新选择`);
              let f = c.username.trim().toLowerCase();
              if (i.some((t) => t.id !== e2 && t.siteId === u && t.username.trim().toLowerCase() === f))
                throw Error(`目标站点已有同名账号，不能重复归属`);
              let p = yo(c, { ...n, siteId: u });
              delete p.identity, delete p.loginMethod, delete p.loginEntry, delete p.apiToken, delete p.githubUsername, delete p.githubPassword, delete p.passkey;
              let m = i.map((t) => t.id === e2 ? p : t), [h, g, _] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.status, {}),
                bgPlatformState.t.get(bgPlatformState.r.results, {}),
                bgPlatformState.t.get(bgPlatformState.r.balances, {})
              ]), v = `${e2}:`;
              await bgPlatformState.t.setMany({
                [bgPlatformState.r.accounts]: m,
                [bgPlatformState.r.status]: Object.fromEntries(
                  Object.entries(h).filter(([e3]) => !e3.startsWith(v))
                ),
                [bgPlatformState.r.results]: Object.fromEntries(
                  Object.entries(g).filter(([t]) => t !== e2)
                ),
                [bgPlatformState.r.balances]: Object.fromEntries(
                  Object.entries(_).filter(([t]) => t !== e2)
                )
              });
            });
          }
        });
        break;
      }
      case 138: {
        Object.assign(bgAccountsState.store, {
          saveAccountSession(e2, n) {
            return bgPlatformState.R(async () => {
              let i = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).map(
                (t) => t.id === e2 ? { ...t, identity: { ...t.identity, session: n } } : t
              );
              await bgPlatformState.t.set(bgPlatformState.r.accounts, i);
            });
          }
        });
        break;
      }
      case 139: {
        Object.assign(bgAccountsState.store, {
          saveAccountIdentity(e2, n, i = {}) {
            return bgPlatformState.R(async () => {
              let a = await bgPlatformState.t.get(bgPlatformState.r.accounts, []), o = a.find((t) => t.id === e2);
              if (!o) return;
              let s = Object.fromEntries(Object.entries(n).filter(([, e3]) => e3 != null && e3 !== ``)), c = typeof s.userId == `string` ? s.userId : void 0, l2 = new Set(
                c ? a.filter(
                  (t) => t.id !== e2 && t.siteId === o.siteId && t.identity?.userId === c
                ).map((e3) => e3.id) : []
              ), u = !!c && !!o.identity?.userId && o.identity.userId !== c;
              if (i.preserveBinding && (u || l2.size > 0))
                throw Error(`身份绑定发生冲突，已保留原账号及其他账号的数据`);
              let d = s.verifiedByManagedLogin === true || o.identity?.verifiedByManagedLogin === true && (!c || c === o.identity.userId) && s.source === void 0, f = a.map(
                (t) => t.id === e2 ? {
                  ...t,
                  identity: (() => {
                    let e3 = { ...t.identity, ...s, fetchedAt: Date.now() };
                    return d ? e3.verifiedByManagedLogin = true : delete e3.verifiedByManagedLogin, e3;
                  })()
                } : l2.has(t.id) ? {
                  ...t,
                  identity: t.identity?.session ? { session: t.identity.session } : void 0
                } : t
              );
              if (l2.size === 0 && !u) {
                await bgPlatformState.t.set(bgPlatformState.r.accounts, f);
                return;
              }
              let [p, m, h] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.status, {}),
                bgPlatformState.t.get(bgPlatformState.r.results, {}),
                bgPlatformState.t.get(bgPlatformState.r.balances, {})
              ]), g = new Set(l2);
              u && g.add(e2);
              let _ = [...l2].map((e3) => `${e3}:`);
              await bgPlatformState.t.setMany({
                [bgPlatformState.r.accounts]: f,
                [bgPlatformState.r.status]: Object.fromEntries(
                  Object.entries(p).filter(([e3]) => !_.some((t) => e3.startsWith(t)))
                ),
                [bgPlatformState.r.results]: Object.fromEntries(
                  Object.entries(m).filter(([e3]) => !g.has(e3))
                ),
                [bgPlatformState.r.balances]: Object.fromEntries(
                  Object.entries(h).filter(([e3]) => !g.has(e3))
                )
              });
            });
          }
        });
        break;
      }
    }
  }
  var accountService = Object.freeze({
    list: () => bgPlatformState.t.get(bgPlatformState.r.accounts, []),
    add: (...args) => bgAccountsState.store.addAccount(...args),
    addMany: (...args) => bgAccountsState.store.addAccounts(...args),
    update: (...args) => bgAccountsState.store.updateAccount(...args),
    remove: (accountId) => bgEntryState.nh({
      action: "delete-entities",
      siteIds: [],
      accountIds: [accountId]
    }),
    removeMany: (accountIds) => bgEntryState.nh({
      action: "delete-entities",
      siteIds: [],
      accountIds: [...accountIds]
    }),
    saveSession: (...args) => bgAccountsState.store.saveAccountSession(...args),
    saveIdentity: (...args) => bgAccountsState.store.saveAccountIdentity(...args),
    handleMessage: handleAccountsMessage,
    handleMutation: handleAccountsMutation
  });

  // src/entries/background.js
  var bgEntryState = { store: {} };
  function e(e2) {
    return e2 == null || typeof e2 == `function` ? { main: e2 } : e2;
  }
  function Q(e2) {
    let t = e2.url ?? e2.origin, n = chrome.runtime.getURL(``);
    return e2.id === chrome.runtime.id && !!t && (t === n.slice(0, -1) || t.startsWith(n));
  }
  async function Gm(e2, i) {
    await bgEntryState.Qp;
    const type = e2.type;
    const handler = typeof type === "string" && Object.hasOwn(backgroundMessageHandlers, type) ? backgroundMessageHandlers[type] : void 0;
    return handler ? handler(e2, i) : { ok: false, error: `后台未注册该消息类型，请重新加载扩展后重试` };
  }
  async function nh(e2) {
    const action = e2.action;
    const handler = typeof action === "string" && Object.hasOwn(backgroundMutationHandlers, action) ? backgroundMutationHandlers[action] : void 0;
    return handler ? handler(e2) : void 0;
  }
  Object.assign(bgEntryState, { e, Q, Gm, nh });
  async function handleEntryMessage(e2, i) {
    switch (e2.type) {
      case `MUTATE_APP`: {
        if (!Q(i)) return { ok: false, error: `仅扩展管理页可以修改数据` };
        let t = await nh(e2.mutation);
        return bgPlatformState.$(), t;
      }
    }
  }
  async function handleEntryMutation(e2) {
    switch (e2.action) {
      case `delete-entities`:
        return bgPlatformState.X(
          async () => bgPlatformState.rm(async () => {
            let n = await bgPlatformState.t.get(bgPlatformState.r.accounts, []), i = new Set(e2.siteIds), a = new Set(e2.accountIds);
            return await bgCheckinState.eh(
              n.filter((e3) => i.has(e3.siteId) || a.has(e3.id)).map((e3) => e3.id)
            ), await bgEntryState.store.deleteEntities(e2.siteIds, e2.accountIds), { ok: true };
          })
        );
    }
  }
  function initializeBackgroundEntry(step) {
    switch (step) {
      case 125: {
        Object.assign(bgEntryState.store, {
          async load() {
            return bgPlatformState.R(async () => {
              let [e2, n, i, a, o, s, c, l2, u, d] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, []),
                bgPlatformState.t.get(bgPlatformState.r.status, {}),
                bgPlatformState.t.get(bgPlatformState.r.results, {}),
                bgPlatformState.t.get(bgPlatformState.r.balances, {}),
                bgPlatformState.t.get(bgPlatformState.r.launchMode, bgSettingsState.Fe),
                bgPlatformState.t.get(bgPlatformState.r.schedule, bgCheckinState.Wi),
                bgPlatformState.t.get(bgPlatformState.r.removedBuiltinSiteIds, []),
                bgPlatformState.t.get(bgPlatformState.r.headlessStats, {})
              ]), { userSites: f, accounts: p } = await bgSitesState.mo(e2, n), m = await bgSitesState.ho(f, p), h = bgSitesState.co(m.userSites), g = bgSitesState.ba(m.accounts), _ = bgSitesState.xa(g), v = _.size ? g.map((e3) => _.has(e3.id) ? bgSitesState.Sa(e3) : e3) : g, y = [..._].map((e3) => `${e3}:`), b = _.size ? Object.fromEntries(
                Object.entries(a).filter(([e3]) => !y.some((t) => e3.startsWith(t)))
              ) : a, x = _.size ? Object.fromEntries(Object.entries(o).filter(([e3]) => !_.has(e3))) : o, S = _.size ? Object.fromEntries(Object.entries(s).filter(([e3]) => !_.has(e3))) : s, C = bgCheckinState.la(
                d,
                [...bgSitesState.j, ...h].map((e3) => e3.id)
              ), w = bgSitesState.po(u, v), T = {};
              return bgSitesState.fo(m.userSites, h) && (T[bgPlatformState.r.sites] = h), bgSitesState.fo(m.accounts, v) && (T[bgPlatformState.r.accounts] = v), _.size && (T[bgPlatformState.r.status] = b, T[bgPlatformState.r.results] = x, T[bgPlatformState.r.balances] = S), bgSitesState.fo(u, w) && (T[bgPlatformState.r.removedBuiltinSiteIds] = w), C !== d && (T[bgPlatformState.r.headlessStats] = C), Object.keys(T).length && await bgPlatformState.t.setMany(T), {
                userSites: h,
                accounts: v,
                proxies: i,
                status: b,
                results: x,
                balances: S,
                launchMode: c,
                schedule: bgCheckinState.Ki(l2),
                removedBuiltinSiteIds: w
              };
            });
          }
        });
        break;
      }
      case 130: {
        Object.assign(bgEntryState.store, {
          deleteEntities(e2, n) {
            return bgPlatformState.R(async () => {
              let i = new Set(e2), a = new Set(n), [o, s, c, l2, u, d, f, p] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.status, {}),
                bgPlatformState.t.get(bgPlatformState.r.results, {}),
                bgPlatformState.t.get(bgPlatformState.r.balances, {}),
                bgPlatformState.t.get(bgPlatformState.r.schedule, bgCheckinState.Wi),
                bgPlatformState.t.get(bgPlatformState.r.removedBuiltinSiteIds, []),
                bgPlatformState.t.get(bgPlatformState.r.headlessStats, {})
              ]), m = new Set(s.filter((e3) => a.has(e3.id)).map((e3) => e3.id)), h = [...m].map((e3) => `${e3}:`), g = bgCheckinState.qi(
                bgCheckinState.Ki(d),
                s.filter((e3) => !m.has(e3.id)).map((e3) => e3.id)
              ), _ = new Set(bgSitesState.j.map((e3) => e3.id)), v = e2.filter((e3) => _.has(e3)), y = [.../* @__PURE__ */ new Set([...f, ...v])];
              await bgPlatformState.t.setMany({
                [bgPlatformState.r.sites]: o.filter((e3) => !i.has(e3.id)),
                [bgPlatformState.r.accounts]: s.filter((e3) => !m.has(e3.id)),
                [bgPlatformState.r.status]: Object.fromEntries(
                  Object.entries(c).filter(([e3]) => !h.some((t) => e3.startsWith(t)))
                ),
                [bgPlatformState.r.results]: Object.fromEntries(
                  Object.entries(l2).filter(([e3]) => !m.has(e3))
                ),
                [bgPlatformState.r.balances]: Object.fromEntries(
                  Object.entries(u).filter(([e3]) => !m.has(e3))
                ),
                [bgPlatformState.r.schedule]: g,
                [bgPlatformState.r.removedBuiltinSiteIds]: y,
                [bgPlatformState.r.headlessStats]: Object.fromEntries(
                  Object.entries(p).filter(([e3]) => !i.has(e3))
                )
              });
            });
          }
        });
        break;
      }
      case 306: {
        bgEntryState.Qp = Promise.resolve();
        break;
      }
      case 312: {
        bgEntryState.am = e(() => {
          bgCheckinState.pm(), chrome.alarms.create(bgCheckinState.Rp, { periodInMinutes: 1 }), chrome.alarms.create(bgProxiesState.Bp, { periodInMinutes: 360 }), chrome.runtime.onInstalled.addListener(() => {
            bgCheckinState.pm();
          }), chrome.runtime.onStartup.addListener(() => {
            bgCheckinState.pm();
          }), chrome.alarms.onAlarm.addListener((e2) => {
            e2.name === bgCheckinState.Rp && (bgCheckinState.Ph(), bgCheckinState.Fh()), e2.name === bgCheckinState.zp && bgCheckinState.vm(e2.scheduledTime), e2.name === bgProxiesState.Bp && bgProxiesState._h().catch(() => {
            });
          }), chrome.webNavigation.onErrorOccurred.addListener((e2) => {
            e2.frameId === 0 && bgCheckinState.Nh(e2.tabId, e2.error);
          }), chrome.tabs.onCreated.addListener((e2) => {
            let t = e2.id, n = e2.openerTabId;
            t != null && n != null && (async () => {
              let r = await bgCheckinState.V.get(n);
              r?.runId && (await bgCheckinState.H.remember(t, n), bgCheckinState.Jo(r, e2.url ?? `about:blank`) ? await bgCheckinState.sm(t, e2.url ?? `about:blank`, n) : bgCheckinState.Wo(r) && r.usesExtensionProxy && e2.url && bgCheckinState.Ko(r, e2.url) && await bgCheckinState.fm(t, n, bgCheckinState.Go(r, e2.url)));
            })();
          }), chrome.tabs.onUpdated.addListener((e2, t, n) => {
            (t.status === `loading` || t.url) && bgCheckinState.sm(e2, t.url ?? n.url, n.openerTabId);
          }), chrome.action.onClicked.addListener(() => {
            (async () => {
              await bgEntryState.Qp, await bgPlatformState.t.get(bgPlatformState.r.launchMode, `sidepanel`) === `tab` && await chrome.runtime.openOptionsPage();
            })();
          }), chrome.runtime.onMessage.addListener(
            (e2, t, n) => (Gm(e2, t).then(n).catch((e3) => n({ ok: false, error: e3?.message ?? String(e3) })), true)
          ), chrome.tabs.onRemoved.addListener((e2) => {
            bgPlatformState.Yc(e2), bgCheckinState.lm(e2);
          });
        });
        break;
      }
      case 323: {
        globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
        break;
      }
      case 324: {
        bgEntryState.Lh = {
          debug: (...e2) => ([...e2], void 0),
          log: (...e2) => ([...e2], void 0),
          warn: (...e2) => ([...e2], void 0),
          error: (...e2) => ([...e2], void 0)
        };
        break;
      }
      case 325: {
        try {
          bgEntryState.Rh = bgEntryState.am.main(), bgEntryState.Rh instanceof Promise && console.warn(
            `The background's main() function return a promise, but it must be synchronous`
          );
        } catch (e2) {
          throw bgEntryState.Lh.error(`The background crashed on startup!`), e2;
        }
        break;
      }
    }
  }
  var backgroundMessageHandlers = {
    "SAVE_IDENTITY": handleAccountsMessage,
    "CAPTURE_SESSION": handleAccountsMessage,
    "SESSION_REFRESHED": handleAccountsMessage,
    "CLEAR_SITE_COOKIES": handleAccountsMessage,
    "PROBE_SITE": handleSitesMessage,
    "PROBE_LOGIN_PAGE": handleSitesMessage,
    "TOGGLE_LEARNING": handleLearningMessage,
    "LEARN_EVENT": handleLearningMessage,
    "LEARN_IDENTITY": handleLearningMessage,
    "GET_LEARNING": handleLearningMessage,
    "CANCEL_LEARNING": handleLearningMessage,
    "START_LOGIN": handleCheckinMessage,
    "START_BATCH": handleCheckinMessage,
    "CANCEL_CHECKIN": handleCheckinMessage,
    "GET_TASK": handleCheckinMessage,
    "RESOLVE_LOGIN_METHOD": handleCheckinMessage,
    "SET_STAGE": handleCheckinMessage,
    "GITHUB_LOGOUT_COMPLETE": handleCheckinMessage,
    "CONFIRM_IDENTITY": handleCheckinMessage,
    "FORM_CREDENTIALS_SUBMITTED": handleCheckinMessage,
    "SAVE_WORKFLOW_ROUTE": handleCheckinMessage,
    "NEEDS_USER": handleCheckinMessage,
    "MANUAL_LOGIN_WAITING": handleCheckinMessage,
    "TASK_RESULT": handleCheckinMessage,
    "GET_LIVE_TASKS": handleCheckinMessage,
    "SYNC_PROGRESS": handleCheckinMessage,
    "CLAIM_TEXT_USED": handleCheckinMessage,
    "SLIDER_FRAME_PREPARE": handleSliderMessage,
    "SLIDER_FRAME_CONNECT": handleSliderMessage,
    "SLIDER_FRAME_REPORT": handleSliderMessage,
    "SLIDER_FRAME_STATUS": handleSliderMessage,
    "SLIDER_FRAME_CANCEL": handleSliderMessage,
    "SLIDER_CRACK": handleSliderMessage,
    "TEST_PROXY": handleProxiesMessage,
    "SCAN_LOCAL_PORTS": handleProxiesMessage,
    "READ_CLASH_PROXIES": handleProxiesMessage,
    "DETECT_CLASH_CONTROLLER": handleProxiesMessage,
    "READ_CLASH_LISTENER_EXITS": handleProxiesMessage,
    "SYNC_CLASH_PROXIES": handleProxiesMessage,
    "FETCH_SUBSCRIPTION": handleProxiesMessage,
    "CHECK_LISTENER_DRIFT": handleProxiesMessage,
    "BALANCE_SNAPSHOT": handleRecordsMessage,
    "REFRESH_BALANCE": handleRecordsMessage,
    "CHECKIN_REWARD_OBSERVATION": handleRecordsMessage,
    "SET_LAUNCH_MODE": handleSettingsMessage,
    "TEST_NOTIFY": handleSettingsMessage,
    "TRUSTED_POINTER_CLICK": handleCheckinPointerMessage,
    "TRUSTED_POINTER_SCROLL": handleCheckinPointerMessage,
    "TRUSTED_POINTER_DRAG": handleCheckinPointerMessage,
    "MUTATE_APP": handleEntryMessage
  };
  var backgroundMutationHandlers = {
    "add-account": handleAccountsMutation,
    "add-accounts": handleAccountsMutation,
    "update-account": handleAccountsMutation,
    "add-site": handleSitesMutation,
    "add-sites": handleSitesMutation,
    "update-site": handleSitesMutation,
    "move-site": handleSitesMutation,
    "update-schedule": handleCheckinMutation,
    "set-status": handleCheckinMutation,
    "mark-done": handleCheckinMutation,
    "add-proxy": handleProxiesMutation,
    "add-proxies": handleProxiesMutation,
    "update-proxy": handleProxiesMutation,
    "remove-proxy": handleProxiesMutation,
    "assign-account-proxies": handleProxiesMutation,
    "delete-entities": handleEntryMutation
  };
  var backgroundStarted = false;
  function startBackground() {
    if (backgroundStarted) return bgEntryState.Rh;
    backgroundStarted = true;
    initializeBackgroundPlatform(0);
    initializeBackgroundPlatform(1);
    initializeBackgroundPlatform(2);
    initializeBackgroundCheckin(3);
    initializeBackgroundLearning(4);
    initializeBackgroundCheckin(5);
    initializeBackgroundCheckin(6);
    initializeBackgroundCheckin(7);
    initializeBackgroundCheckin(8);
    initializeBackgroundSites(9);
    initializeBackgroundSites(10);
    initializeBackgroundSites(11);
    initializeBackgroundSites(12);
    initializeBackgroundSites(13);
    initializeBackgroundSites(14);
    initializeBackgroundSites(15);
    initializeBackgroundSites(16);
    initializeBackgroundSites(17);
    initializeBackgroundSites(18);
    initializeBackgroundSites(19);
    initializeBackgroundSites(20);
    initializeBackgroundSites(21);
    initializeBackgroundSites(22);
    initializeBackgroundSites(23);
    initializeBackgroundSites(24);
    initializeBackgroundSites(25);
    initializeBackgroundSites(26);
    initializeBackgroundSites(27);
    initializeBackgroundSites(28);
    initializeBackgroundSites(29);
    initializeBackgroundSites(30);
    initializeBackgroundSites(31);
    initializeBackgroundSites(32);
    initializeBackgroundSites(33);
    initializeBackgroundSites(34);
    initializeBackgroundSites(35);
    initializeBackgroundSites(36);
    initializeBackgroundProxies(37);
    initializeBackgroundProxies(38);
    initializeBackgroundProxies(39);
    initializeBackgroundProxies(40);
    initializeBackgroundSettings(41);
    initializeBackgroundCheckin(42);
    initializeBackgroundCheckin(43);
    initializeBackgroundCheckin(44);
    initializeBackgroundCheckin(45);
    initializeBackgroundCheckin(46);
    initializeBackgroundCheckin(47);
    initializeBackgroundCheckin(48);
    initializeBackgroundCheckin(49);
    initializeBackgroundCheckin(50);
    initializeBackgroundCheckin(51);
    initializeBackgroundCheckin(52);
    initializeBackgroundCheckin(53);
    initializeBackgroundCheckin(54);
    initializeBackgroundAccounts(55);
    initializeBackgroundSites(56);
    initializeBackgroundSites(57);
    initializeBackgroundProxies(58);
    initializeBackgroundProxies(59);
    initializeBackgroundProxies(60);
    initializeBackgroundProxies(61);
    initializeBackgroundProxies(62);
    initializeBackgroundProxies(63);
    initializeBackgroundProxies(64);
    initializeBackgroundProxies(65);
    initializeBackgroundProxies(66);
    initializeBackgroundProxies(67);
    initializeBackgroundProxies(68);
    initializeBackgroundProxies(69);
    initializeBackgroundProxies(70);
    initializeBackgroundProxies(71);
    initializeBackgroundProxies(72);
    initializeBackgroundProxies(73);
    initializeBackgroundLearning(74);
    initializeBackgroundSites(75);
    initializeBackgroundSites(76);
    initializeBackgroundSites(77);
    initializeBackgroundSites(78);
    initializeBackgroundSites(79);
    initializeBackgroundAccounts(80);
    initializeBackgroundAccounts(81);
    initializeBackgroundAccounts(82);
    initializeBackgroundAccounts(83);
    initializeBackgroundAccounts(84);
    initializeBackgroundAccounts(85);
    initializeBackgroundAccounts(86);
    initializeBackgroundAccounts(87);
    initializeBackgroundAccounts(88);
    initializeBackgroundAccounts(89);
    initializeBackgroundAccounts(90);
    initializeBackgroundAccounts(91);
    initializeBackgroundAccounts(92);
    initializeBackgroundRecords(93);
    initializeBackgroundRecords(94);
    initializeBackgroundRecords(95);
    initializeBackgroundRecords(96);
    initializeBackgroundRecords(97);
    initializeBackgroundRecords(98);
    initializeBackgroundRecords(99);
    initializeBackgroundRecords(100);
    initializeBackgroundRecords(101);
    initializeBackgroundRecords(102);
    initializeBackgroundRecords(103);
    initializeBackgroundRecords(104);
    initializeBackgroundRecords(105);
    initializeBackgroundRecords(106);
    initializeBackgroundRecords(107);
    initializeBackgroundRecords(108);
    initializeBackgroundAccounts(109);
    initializeBackgroundAccounts(110);
    initializeBackgroundCheckin(111);
    initializeBackgroundCheckin(112);
    initializeBackgroundPlatform(113);
    initializeBackgroundPlatform(114);
    initializeBackgroundCheckin(115);
    initializeBackgroundCheckin(116);
    initializeBackgroundRecords(117);
    initializeBackgroundRecords(118);
    initializeBackgroundSites(119);
    initializeBackgroundSites(120);
    initializeBackgroundSites(121);
    initializeBackgroundSites(122);
    initializeBackgroundSites(123);
    initializeBackgroundSites(124);
    initializeBackgroundEntry(125);
    initializeBackgroundSites(126);
    initializeBackgroundSites(127);
    initializeBackgroundSites(128);
    initializeBackgroundSites(129);
    initializeBackgroundEntry(130);
    initializeBackgroundRecords(131);
    initializeBackgroundRecords(132);
    initializeBackgroundRecords(133);
    initializeBackgroundRecords(134);
    initializeBackgroundAccounts(135);
    initializeBackgroundAccounts(136);
    initializeBackgroundAccounts(137);
    initializeBackgroundAccounts(138);
    initializeBackgroundAccounts(139);
    initializeBackgroundProxies(140);
    initializeBackgroundProxies(141);
    initializeBackgroundProxies(142);
    initializeBackgroundProxies(143);
    initializeBackgroundProxies(144);
    initializeBackgroundProxies(145);
    initializeBackgroundCheckin(146);
    initializeBackgroundCheckin(147);
    initializeBackgroundCheckin(148);
    initializeBackgroundCheckin(149);
    initializeBackgroundCheckin(150);
    initializeBackgroundCheckin(151);
    initializeBackgroundCheckin(152);
    initializeBackgroundCheckin(153);
    initializeBackgroundCheckin(154);
    initializeBackgroundCheckin(155);
    initializeBackgroundCheckin(156);
    initializeBackgroundCheckin(157);
    initializeBackgroundCheckin(158);
    initializeBackgroundCheckin(159);
    initializeBackgroundCheckin(160);
    initializeBackgroundCheckin(161);
    initializeBackgroundCheckin(162);
    initializeBackgroundCheckin(163);
    initializeBackgroundCheckin(164);
    initializeBackgroundCheckin(165);
    initializeBackgroundCheckin(166);
    initializeBackgroundCheckin(167);
    initializeBackgroundCheckin(168);
    initializeBackgroundProxies(169);
    initializeBackgroundProxies(170);
    initializeBackgroundProxies(171);
    initializeBackgroundProxies(172);
    initializeBackgroundProxies(173);
    initializeBackgroundProxies(174);
    initializeBackgroundProxies(175);
    initializeBackgroundProxies(176);
    initializeBackgroundCheckin(177);
    initializeBackgroundCheckin(178);
    initializeBackgroundCheckin(179);
    initializeBackgroundCheckin(180);
    initializeBackgroundCheckin(181);
    initializeBackgroundCheckin(182);
    initializeBackgroundCheckin(183);
    initializeBackgroundCheckin(184);
    initializeBackgroundCheckin(185);
    initializeBackgroundCheckin(186);
    initializeBackgroundCheckin(187);
    initializeBackgroundCheckin(188);
    initializeBackgroundCheckin(189);
    initializeBackgroundCheckin(190);
    initializeBackgroundCheckin(191);
    initializeBackgroundCheckin(192);
    initializeBackgroundCheckin(193);
    initializeBackgroundPlatform(194);
    initializeBackgroundPlatform(195);
    initializeBackgroundPlatform(196);
    initializeBackgroundPlatform(197);
    initializeBackgroundPlatform(198);
    initializeBackgroundPlatform(199);
    initializeBackgroundPlatform(200);
    initializeBackgroundPlatform(201);
    initializeBackgroundPlatform(202);
    initializeBackgroundPlatform(203);
    initializeBackgroundPlatform(204);
    initializeBackgroundPlatform(205);
    initializeBackgroundPlatform(206);
    initializeBackgroundPlatform(207);
    initializeBackgroundPlatform(208);
    initializeBackgroundPlatform(209);
    initializeBackgroundPlatform(210);
    initializeBackgroundSlider(211);
    initializeBackgroundSlider(212);
    initializeBackgroundSlider(213);
    initializeBackgroundSlider(214);
    initializeBackgroundSlider(215);
    initializeBackgroundSlider(216);
    initializeBackgroundSlider(217);
    initializeBackgroundSlider(218);
    initializeBackgroundSlider(219);
    initializeBackgroundSlider(220);
    initializeBackgroundSlider(221);
    initializeBackgroundSlider(222);
    initializeBackgroundSlider(223);
    initializeBackgroundLearning(224);
    initializeBackgroundLearning(225);
    initializeBackgroundLearning(226);
    initializeBackgroundLearning(227);
    initializeBackgroundLearning(228);
    initializeBackgroundLearning(229);
    initializeBackgroundLearning(230);
    initializeBackgroundLearning(231);
    initializeBackgroundLearning(232);
    initializeBackgroundLearning(233);
    initializeBackgroundLearning(234);
    initializeBackgroundLearning(235);
    initializeBackgroundLearning(236);
    initializeBackgroundLearning(237);
    initializeBackgroundLearning(238);
    initializeBackgroundLearning(239);
    initializeBackgroundLearning(240);
    initializeBackgroundLearning(241);
    initializeBackgroundLearning(242);
    initializeBackgroundSlider(243);
    initializeBackgroundSlider(244);
    initializeBackgroundSlider(245);
    initializeBackgroundSlider(246);
    initializeBackgroundSlider(247);
    initializeBackgroundSlider(248);
    initializeBackgroundSlider(249);
    initializeBackgroundSlider(250);
    initializeBackgroundSlider(251);
    initializeBackgroundSlider(252);
    initializeBackgroundLearning(253);
    initializeBackgroundLearning(254);
    initializeBackgroundLearning(255);
    initializeBackgroundLearning(256);
    initializeBackgroundLearning(257);
    initializeBackgroundLearning(258);
    initializeBackgroundLearning(259);
    initializeBackgroundLearning(260);
    initializeBackgroundLearning(261);
    initializeBackgroundLearning(262);
    initializeBackgroundLearning(263);
    initializeBackgroundLearning(264);
    initializeBackgroundLearning(265);
    initializeBackgroundLearning(266);
    initializeBackgroundLearning(267);
    initializeBackgroundLearning(268);
    initializeBackgroundLearning(269);
    initializeBackgroundLearning(270);
    initializeBackgroundLearning(271);
    initializeBackgroundLearning(272);
    initializeBackgroundLearning(273);
    initializeBackgroundLearning(274);
    initializeBackgroundLearning(275);
    initializeBackgroundLearning(276);
    initializeBackgroundLearning(277);
    initializeBackgroundLearning(278);
    initializeBackgroundLearning(279);
    initializeBackgroundLearning(280);
    initializeBackgroundLearning(281);
    initializeBackgroundLearning(282);
    initializeBackgroundLearning(283);
    initializeBackgroundLearning(284);
    initializeBackgroundLearning(285);
    initializeBackgroundLearning(286);
    initializeBackgroundLearning(287);
    initializeBackgroundLearning(288);
    initializeBackgroundLearning(289);
    initializeBackgroundLearning(290);
    initializeBackgroundLearning(291);
    initializeBackgroundLearning(292);
    initializeBackgroundLearning(293);
    initializeBackgroundLearning(294);
    initializeBackgroundLearning(295);
    initializeBackgroundLearning(296);
    initializeBackgroundPlatform(297);
    initializeBackgroundCheckin(298);
    initializeBackgroundCheckin(299);
    initializeBackgroundProxies(300);
    initializeBackgroundCheckin(301);
    initializeBackgroundCheckin(302);
    initializeBackgroundLearning(303);
    initializeBackgroundLearning(304);
    initializeBackgroundSettings(305);
    initializeBackgroundEntry(306);
    initializeBackgroundPlatform(307);
    initializeBackgroundPlatform(308);
    initializeBackgroundPlatform(309);
    initializeBackgroundPlatform(310);
    initializeBackgroundCheckin(311);
    initializeBackgroundEntry(312);
    initializeBackgroundCheckin(313);
    initializeBackgroundProxies(314);
    initializeBackgroundProxies(315);
    initializeBackgroundLearning(316);
    initializeBackgroundCheckin(317);
    initializeBackgroundProxies(318);
    initializeBackgroundProxies(319);
    initializeBackgroundProxies(320);
    initializeBackgroundProxies(321);
    initializeBackgroundProxies(322);
    initializeBackgroundEntry(323);
    initializeBackgroundEntry(324);
    initializeBackgroundEntry(325);
    return bgEntryState.Rh;
  }
  startBackground();
})();
