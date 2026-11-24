/** src/modules/settings/view.js: 功能模块实现，保留发布版本的符号以便逐步恢复命名。 */
import { createUiModuleRuntime, createUiScope, initializeUiScope } from '../../shared/ui-scope.js';

// 打开方式、备份加解密与迁移匹配 — app published scope.
export let BackupMigrationDialog,
  encryptBackup,
  decryptBackup,
  createBackupPayload,
  validateBackupPayload,
  LaunchModeSettings;
export const appRuntime = createUiModuleRuntime({
  bindingNames: [
    'Cn',
    'wn',
    'Ri',
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
    'Xl',
    'Zl',
  ],
  publish(name, value) {
    switch (name) {
      case 'Ks':
        BackupMigrationDialog = value;
        break;
      case 'Is':
        encryptBackup = value;
        break;
      case 'Ls':
        decryptBackup = value;
        break;
      case 'zs':
        createBackupPayload = value;
        break;
      case 'Vs':
        validateBackupPayload = value;
        break;
      case 'Zl':
        LaunchModeSettings = value;
        break;
    }
  },
  register(scope) {
    scope.wn = async function wn(e, t, n) {
      let r = n ?? chrome.windows.WINDOW_ID_CURRENT;
      if (e === `sidepanel`) {
        if (t === `sidepanel`) return { optionsOpened: !1, sidePanelClosed: !0 };
        if (typeof chrome.sidePanel?.open != `function`)
          throw Error(`当前 Chrome 不支持直接打开侧边栏，请点击扩展图标打开`);
        return (
          await chrome.sidePanel.open({ windowId: r }),
          { optionsOpened: !1, sidePanelClosed: !0 }
        );
      }
      let i = !1;
      if (
        (t === `sidepanel` && (await chrome.runtime.openOptionsPage(), (i = !0)),
        typeof chrome.sidePanel?.close != `function`)
      )
        return { optionsOpened: i, sidePanelClosed: t !== `sidepanel` };
      try {
        return (
          await chrome.sidePanel.close({ windowId: r }),
          { optionsOpened: i, sidePanelClosed: !0 }
        );
      } catch {
        return { optionsOpened: i, sidePanelClosed: t !== `sidepanel` };
      }
    };
    scope.js = function js(e) {
      let t = ``,
        n = 32768;
      for (let r = 0; r < e.length; r += n) t += String.fromCharCode(...e.subarray(r, r + n));
      return btoa(t);
    };
    scope.Ms = function Ms(e) {
      let t = atob(e),
        n = new Uint8Array(t.length);
      for (let e = 0; e < t.length; e += 1) n[e] = t.charCodeAt(e);
      return n;
    };
    scope.Ns = async function Ns(e, t, n) {
      let r = await crypto.subtle.importKey(`raw`, new TextEncoder().encode(e), `PBKDF2`, !1, [
        `deriveKey`,
      ]);
      return crypto.subtle.deriveKey(
        { name: `PBKDF2`, salt: t, iterations: n, hash: `SHA-256` },
        r,
        { name: `AES-GCM`, length: 256 },
        !1,
        [`encrypt`, `decrypt`],
      );
    };
    scope.Ps = function Ps(e) {
      return typeof e == `number` && Number.isInteger(e) && e >= scope.Ds && e <= scope.Es;
    };
    scope.Fs = function Fs(e) {
      if (typeof e != `object` || !e) return !1;
      let t = e;
      return (
        t.encrypted === !0 &&
        t.cipher === `AES-GCM` &&
        typeof t.iv == `string` &&
        typeof t.payload == `string` &&
        typeof t.kdf == `object` &&
        t.kdf !== null &&
        t.kdf.algo === `PBKDF2-SHA256` &&
        (0, scope.Ps)(t.kdf.iterations) &&
        typeof t.kdf.salt == `string`
      );
    };
    scope.Is = async function Is(e, t, n) {
      if (!t) throw Error(`导出口令不能为空`);
      let r = crypto.getRandomValues(new Uint8Array(scope.Os)),
        i = crypto.getRandomValues(new Uint8Array(scope.ks)),
        a = await (0, scope.Ns)(t, r, scope.Ts),
        o = await crypto.subtle.encrypt({ name: `AES-GCM`, iv: i }, a, new TextEncoder().encode(e));
      return {
        format: scope.As,
        exportedAt: n.exportedAt,
        ...(n.extensionVersion ? { extensionVersion: n.extensionVersion } : {}),
        encrypted: !0,
        kdf: { algo: `PBKDF2-SHA256`, iterations: scope.Ts, salt: (0, scope.js)(r) },
        cipher: `AES-GCM`,
        iv: (0, scope.js)(i),
        payload: (0, scope.js)(new Uint8Array(o)),
      };
    };
    scope.Ls = async function Ls(e, t) {
      if (!t) throw Error(`请输入导出时设置的口令`);
      if (!(0, scope.Ps)(e.kdf.iterations))
        throw Error(`备份文件参数超出安全范围，可能不是本插件导出的文件或已被篡改`);
      let n = e.kdf.iterations,
        r,
        i,
        a;
      try {
        ((r = (0, scope.Ms)(e.kdf.salt)),
          (i = (0, scope.Ms)(e.iv)),
          (a = (0, scope.Ms)(e.payload)));
      } catch {
        throw Error(`备份文件的加密字段不是有效的 base64，文件可能已损坏`);
      }
      let o = await (0, scope.Ns)(t, r, n),
        s;
      try {
        s = await crypto.subtle.decrypt({ name: `AES-GCM`, iv: i }, o, a);
      } catch {
        throw Error(`解密失败：口令不正确，或备份文件已损坏`);
      }
      return new TextDecoder().decode(s);
    };
    scope.Rs = function Rs(e, t, n, r) {
      let {
          id: i,
          siteId: a,
          migrationSourceId: o,
          proxyId: s,
          identity: c,
          customProxy: l,
          ...u
        } = e,
        d = c ? { ...c } : void 0;
      d && delete d.session;
      let f = s ? r.get(s) : void 0;
      return {
        ...u,
        backupAccountKey: o ?? e.id,
        backupSiteKey: n,
        siteLoginUrl: t,
        ...(f ? { proxyName: f } : {}),
        ...(l ? { customProxy: { ...l, password: void 0 } } : {}),
        ...(d && Object.keys(d).length > 0 ? { identity: d } : {}),
      };
    };
    scope.zs = function zs(e, t, n = [], r = [], i) {
      let a = new Map(e.map((e) => [e.id, e])),
        o = new Map(n.map((e) => [e.id, e.name])),
        s = e.map((e) => {
          let { id: t, migrationSourceId: n, proxyId: r, ...i } = e,
            a = r ? o.get(r) : void 0;
          return { ...i, backupSiteKey: n ?? e.id, ...(a ? { proxyName: a } : {}) };
        }),
        c = [];
      for (let e of t) {
        let t = a.get(e.siteId);
        t && c.push((0, scope.Rs)(e, t.loginUrl, t.migrationSourceId ?? t.id, o));
      }
      return {
        format: scope.As,
        sites: s,
        accounts: c,
        proxies: n.map((e) => {
          let { id: t, password: n, ...r } = e;
          return r;
        }),
        ...(r.length ? { listenerPlan: [...r] } : {}),
        ...(i ? { subscriptionUrl: i } : {}),
      };
    };
    scope.Bs = function Bs(e) {
      return typeof e == `object` && !!e && !Array.isArray(e);
    };
    scope.Vs = function Vs(e) {
      if (!(0, scope.Bs)(e)) throw Error(`备份内容不是一个对象`);
      if (e.format !== `aah-backup-v1`)
        throw Error(
          typeof e.format == `string`
            ? `不支持的备份格式「${e.format}」，当前扩展只能读取 ${scope.As}`
            : `备份文件缺少 format 标记，无法确认它是 ${scope.As} 格式`,
        );
      if (!Array.isArray(e.sites) || !Array.isArray(e.accounts))
        throw Error(`备份内容缺少 sites 或 accounts 列表`);
      let t = e.sites.filter(
          (e) => (0, scope.Bs)(e) && typeof e.loginUrl == `string` && typeof e.name == `string`,
        ),
        n = e.accounts.filter(
          (e) =>
            (0, scope.Bs)(e) && typeof e.siteLoginUrl == `string` && typeof e.username == `string`,
        ),
        r = Array.isArray(e.proxies)
          ? e.proxies.flatMap((e) => {
              if (
                !(0, scope.Bs)(e) ||
                typeof e.name != `string` ||
                typeof e.host != `string` ||
                typeof e.scheme != `string`
              )
                return [];
              let t = e.scheme.trim().toLowerCase(),
                n =
                  t === `socks`
                    ? `socks5`
                    : t === `mixed`
                      ? `http`
                      : t === `http` || t === `https` || t === `socks4` || t === `socks5`
                        ? t
                        : void 0,
                r = Number(e.port),
                i = e.nameOnly === !0;
              return !n || (!i && (!Number.isInteger(r) || r < 1 || r > 65535))
                ? []
                : [
                    {
                      ...e,
                      name: e.name,
                      host: e.host.trim().replace(/^\[|\]$/g, ``),
                      scheme: n,
                      port: i ? 0 : r,
                    },
                  ];
            })
          : [],
        i = Array.isArray(e.listenerPlan) && e.listenerPlan.length > 0,
        a = typeof e.subscriptionUrl == `string` && !!e.subscriptionUrl.trim();
      if (!t.length && !n.length && !r.length && !i && !a)
        throw Error(`备份文件里没有可导入的站点、账号或代理`);
      let o = Array.isArray(e.listenerPlan)
          ? e.listenerPlan.flatMap((e) => {
              if (!e || typeof e != `object`) return [];
              let t = e,
                n = typeof t.nodeName == `string` ? t.nodeName.trim() : ``,
                r = Number(t.port);
              return !n || !Number.isInteger(r) || r < 1 || r > 65535
                ? []
                : [{ nodeName: n, port: r, listenerName: `hub-${r}` }];
            })
          : void 0,
        s = (typeof e.subscriptionUrl == `string` && e.subscriptionUrl.trim()) || void 0;
      return {
        format: scope.As,
        sites: t,
        accounts: n,
        proxies: r,
        ...(o?.length ? { listenerPlan: o } : {}),
        ...(s ? { subscriptionUrl: s } : {}),
      };
    };
    scope.Hs = function Hs(e, t, n, r = []) {
      let i = new Map(),
        a = new Map();
      for (let e of t) {
        i.set(e.migrationSourceId ?? e.id, e.id);
        let t = (0, scope._n)(e.loginUrl);
        a.set(t, [...(a.get(t) ?? []), e.id]);
      }
      let o = [],
        s = [],
        c = new Set(),
        l = new Map(),
        u = new Map(),
        d = new Map(),
        f = [],
        p = 0;
      for (let t of e.sites) {
        let e = (0, scope._n)(t.loginUrl),
          n = d.get(e) ?? 0;
        d.set(e, n + 1);
        let r = t.backupSiteKey?.trim() || `legacy-site:${e}:${n}`,
          m = i.get(r);
        (m && c.add(m), m || ((m = (a.get(e) ?? []).find((e) => !c.has(e))), m && c.add(m)));
        let { backupSiteKey: h, proxyName: g, ..._ } = t;
        (m
          ? ((p += 1), l.set(r, m))
          : ((m = `pending-site:${r}`),
            l.set(r, m),
            s.push(r),
            o.push({ ..._, migrationSourceId: r })),
          u.set(e, [...(u.get(e) ?? []), m]),
          g &&
            f.push({
              ...(m.startsWith(`pending-site:`) ? { siteSourceId: r } : { siteId: m }),
              loginUrlKey: e,
              proxyName: g,
            }));
      }
      let m = new Map(),
        h = new Map(),
        g = new Map();
      for (let e of r)
        (m.set((0, scope.yr)(e.name), e.id),
          e.nameOnly !== !0 && (h.set((0, scope.br)(e), e.id), g.set((0, scope.yr)(e.name), e.id)));
      let _ = [],
        v = new Set(),
        y = new Set(),
        b = 0;
      for (let t of e.proxies) {
        let e = (0, scope.yr)(t.name),
          n = t.nameOnly === !0 ? void 0 : (0, scope.br)(t);
        m.has(e) || (n && h.has(n))
          ? (b += 1)
          : y.has(e) || (y.add(e), t.nameOnly !== !0 && v.add(e), _.push(t));
      }
      let x = new Set(n.map((e) => e.migrationSourceId ?? e.id)),
        S = [],
        C = [],
        w = 0,
        T = 0,
        E = new Map();
      for (let t of e.accounts) {
        let { siteLoginUrl: e, proxyName: n, backupAccountKey: r, backupSiteKey: i, ...o } = t;
        if (r && x.has(r)) {
          w += 1;
          continue;
        }
        let s = {};
        if (t.proxyMode === `pool` && n) {
          let e = (0, scope.yr)(n),
            t = g.get(e);
          t
            ? ((s.proxyMode = `pool`), (s.proxyId = t))
            : v.has(e)
              ? ((s.proxyMode = `pool`), (s.proxyId = `pending-proxy:${e}`))
              : ((T += 1), (s.proxyMode = `inherit`));
        } else t.proxyMode && (s.proxyMode = t.proxyMode);
        let c = (0, scope._n)(e),
          d = E.get(c) ?? 0;
        E.set(c, d + 1);
        let f =
          (i ? l.get(i) : void 0) ??
          u.get(c)?.[d % Math.max(1, u.get(c)?.length ?? 1)] ??
          a.get(c)?.[0];
        f
          ? S.push({ ...o, ...s, ...(r ? { migrationSourceId: r } : {}), siteId: f })
          : C.push({ username: t.username, siteLoginUrl: e });
      }
      return {
        newSites: o,
        newSiteKeys: s,
        reusedSiteCount: p,
        accounts: S,
        duplicateCount: w,
        unmatched: C,
        newProxies: _,
        reusedProxyCount: b,
        unresolvedProxyBindings: T,
        siteProxyNames: f,
        ...(e.listenerPlan?.length ? { listenerPlan: e.listenerPlan } : {}),
        ...(e.subscriptionUrl ? { subscriptionUrl: e.subscriptionUrl } : {}),
      };
    };
    scope.Us = function Us(e, t, n) {
      if (!e.length) return [];
      let r = new Map(),
        i = new Map();
      for (let e of t)
        (r.set((0, scope._n)(e.loginUrl), e.id),
          e.migrationSourceId && i.set(e.migrationSourceId, e.id));
      let a = new Map();
      for (let e of n) e.nameOnly !== !0 && a.set((0, scope.yr)(e.name), e.id);
      let o = [];
      for (let { siteSourceId: t, siteId: n, loginUrlKey: s, proxyName: c } of e) {
        let e = n ?? (t ? i.get(t) : void 0) ?? r.get(s),
          l = a.get((0, scope.yr)(c));
        e && l && o.push({ siteId: e, proxyId: l });
      }
      return o;
    };
    scope.Ws = function Ws(e, t, n, r = []) {
      let i = new Map(),
        a = new Map();
      for (let e of t)
        (i.set((0, scope._n)(e.loginUrl), e.id),
          e.migrationSourceId && a.set(e.migrationSourceId, e.id));
      let o = new Map();
      for (let e of r) e.nameOnly !== !0 && o.set((0, scope.yr)(e.name), e.id);
      let s = new Set(n.map((e) => e.migrationSourceId ?? e.id)),
        c = [],
        l = 0,
        u = 0,
        d = 0;
      for (let t of e) {
        let e = t.siteId;
        if (e.startsWith(`pending-site:`)) {
          let t = a.get(e.slice(13));
          if (!t) {
            l += 1;
            continue;
          }
          e = t;
        } else if (e.startsWith(`pending:`)) {
          let t = i.get(e.slice(8));
          if (!t) {
            l += 1;
            continue;
          }
          e = t;
        }
        if (t.migrationSourceId && s.has(t.migrationSourceId)) {
          u += 1;
          continue;
        }
        let n = { ...t, siteId: e };
        if (n.proxyId?.startsWith(`pending-proxy:`)) {
          let e = o.get(n.proxyId.slice(14));
          e ? (n.proxyId = e) : ((d += 1), delete n.proxyId, (n.proxyMode = `inherit`));
        }
        (n.migrationSourceId && s.add(n.migrationSourceId), c.push(n));
      }
      return { resolved: c, unresolved: l, duplicateCount: u, droppedProxyBindings: d };
    };
    scope.Gs = function Gs(e) {
      let t = (e) => String(e).padStart(2, `0`);
      return `aah-backup-${e.getFullYear()}${t(e.getMonth() + 1)}${t(e.getDate())}-${t(e.getHours())}${t(e.getMinutes())}.json`;
    };
    scope.Ks = function Ks({
      open: e,
      sites: t,
      accounts: n,
      proxies: r,
      onClose: i,
      onImport: a,
    }) {
      let [s, l] = (0, scope.G.useState)(`import`),
        [d, f] = (0, scope.G.useState)(``),
        [p, m] = (0, scope.G.useState)(``),
        [h, _] = (0, scope.G.useState)(!1),
        [v, y] = (0, scope.G.useState)(``),
        [b, x] = (0, scope.G.useState)(``),
        S = (0, scope.G.useRef)(null),
        [C, w] = (0, scope.G.useState)(``),
        [T, E] = (0, scope.G.useState)(``),
        [D, O] = (0, scope.G.useState)(!1),
        [k, A] = (0, scope.G.useState)(``),
        [j, M] = (0, scope.G.useState)(null),
        [N, P] = (0, scope.G.useState)(``),
        [ee, te] = (0, scope.G.useState)(!1),
        [F, ne] = (0, scope.G.useState)(``);
      (0, scope.G.useEffect)(() => {
        (l(`import`),
          f(``),
          m(``),
          _(!1),
          y(``),
          x(``),
          w(``),
          E(``),
          O(!1),
          A(``),
          M(null),
          P(``),
          te(!1),
          ne(``));
      }, [e]);
      let re = p.length > 0 && d !== p,
        I = d.length > 0 && d === p && !h;
      async function ie() {
        if (!I) return;
        (_(!0), y(``), x(``));
        let e = ``;
        try {
          let i = (0, scope.zs)(t, n, r),
            a = await (0, scope.Is)(JSON.stringify(i), d, {
              exportedAt: Date.now(),
              extensionVersion: chrome.runtime?.getManifest?.().version,
            }),
            o = (0, scope.Gs)(new Date()),
            s = new Blob([JSON.stringify(a, null, 2)], { type: `application/json` });
          e = URL.createObjectURL(s);
          let c = document.createElement(`a`);
          ((c.href = e),
            (c.download = o),
            document.body.appendChild(c),
            c.click(),
            c.remove(),
            x(o));
        } catch (e) {
          y(e instanceof Error ? e.message : `导出失败`);
        } finally {
          (e && URL.revokeObjectURL(e), _(!1));
        }
      }
      function L(e) {
        (P(``), M(null));
        let t;
        try {
          t = JSON.parse(e);
        } catch {
          P(`这个文件不是有效的 JSON，请确认选的是扩展导出的备份文件`);
          return;
        }
        (0, scope.Fs)(t) ? O(!0) : (O(!1), ae(t));
      }
      function ae(e) {
        try {
          let i = (0, scope.Hs)((0, scope.Vs)(e), t, n, r);
          return (M(i), i);
        } catch (e) {
          return (P(e instanceof Error ? e.message : `备份内容无法解析`), null);
        }
      }
      async function oe(e) {
        (w(e.name), A(``), ne(``));
        let t = await e.text();
        (E(t), L(t));
      }
      async function se() {
        if (!ee) {
          (te(!0), P(``));
          try {
            let e = j;
            if (!e && D && T) {
              let t = JSON.parse(T);
              if (!(0, scope.Fs)(t)) throw Error(`备份文件的加密结构不完整`);
              let n = await (0, scope.Ls)(t, k);
              e = ae(JSON.parse(n));
            }
            if (!e) throw Error(`没有可导入的数据`);
            let t = await a(e),
              n = [
                t.sites ? `新建站点 ${t.sites}` : ``,
                `导入账号 ${t.accounts}`,
                t.proxies ? `代理节点 ${t.proxies}` : ``,
                t.skipped ? `已有记录 ${t.skipped}` : ``,
              ].filter(Boolean);
            (ne(n.join(` · `)), M(null));
          } catch (e) {
            P(e instanceof Error ? e.message : `导入失败`);
          } finally {
            te(!1);
          }
        }
      }
      let ce = !!C && !ee && (j !== null || (D && k.length > 0));
      return (0, scope.W.jsx)(scope.uo, {
        open: e,
        title: `数据迁移`,
        onClose: i,
        wide: !0,
        children: (0, scope.W.jsxs)(`div`, {
          className: `space-y-4`,
          children: [
            (0, scope.W.jsx)(`div`, {
              className: `grid grid-cols-2 gap-1 rounded-lg bg-ink-100 p-1 dark:bg-ink-900`,
              children: [
                [`import`, scope.Ce, `导入到本机`],
                [`export`, scope.c, `导出备份`],
              ].map(([e, t, n]) =>
                (0, scope.W.jsxs)(
                  `button`,
                  {
                    type: `button`,
                    onClick: () => l(e),
                    className: (0, scope.R)(
                      `flex min-w-0 items-center justify-center gap-1.5 rounded-md px-1.5 py-2 text-xs font-medium transition-colors`,
                      s === e
                        ? `bg-white text-ink-900 shadow-sm dark:bg-ink-800 dark:text-ink-50`
                        : `text-ink-800/55 hover:text-ink-900 dark:text-ink-100/45 dark:hover:text-ink-50`,
                    ),
                    children: [(0, scope.W.jsx)(t, { className: `size-3.5` }), n],
                  },
                  e,
                ),
              ),
            }),
            s === `export`
              ? (0, scope.W.jsxs)(`div`, {
                  className: `space-y-3`,
                  children: [
                    (0, scope.W.jsxs)(`div`, {
                      className: `rounded-lg bg-ink-50 px-3 py-2.5 text-xs text-ink-800/70 dark:bg-ink-900 dark:text-ink-100/60`,
                      children: [
                        `将导出 `,
                        (0, scope.W.jsx)(`b`, { className: `tabular-nums`, children: t.length }),
                        ` 个站点、`,
                        (0, scope.W.jsx)(`b`, { className: `tabular-nums`, children: n.length }),
                        ` 个账号（含密码）、`,
                        (0, scope.W.jsx)(`b`, { className: `tabular-nums`, children: r.length }),
                        ` 个代理节点及其绑定关系。`,
                        (0, scope.W.jsx)(`span`, {
                          className: `mt-1 block text-[11px] text-ink-800/45 dark:text-ink-100/35`,
                          children: `不含签到历史、抓取的登录态，以及代理认证密码 —— 这些都与本机绑定，换机器后需重新配置。`,
                        }),
                      ],
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 dark:bg-amber-950/20`,
                      children: [
                        (0, scope.W.jsx)(scope.Ye, {
                          className: `mt-0.5 size-3.5 shrink-0 text-amber-700 dark:text-amber-300`,
                        }),
                        (0, scope.W.jsxs)(`p`, {
                          className: `text-[11px] leading-relaxed text-amber-800 dark:text-amber-200`,
                          children: [
                            `文件用你设的口令加密（PBKDF2 + AES-GCM）。`,
                            (0, scope.W.jsx)(`b`, { children: `口令不会保存在任何地方` }),
                            ` —— 忘了就打不开这个文件，只能重新导出。`,
                          ],
                        }),
                      ],
                    }),
                    (0, scope.W.jsx)(scope.Q, {
                      label: `导出口令`,
                      children: (0, scope.W.jsx)(`input`, {
                        type: `password`,
                        value: d,
                        onChange: (e) => f(e.target.value),
                        className: scope.$,
                        placeholder: `用于加密备份文件`,
                        autoComplete: `new-password`,
                      }),
                    }),
                    (0, scope.W.jsx)(scope.Q, {
                      label: `再输一次`,
                      hint: re ? `两次输入不一致` : void 0,
                      children: (0, scope.W.jsx)(`input`, {
                        type: `password`,
                        value: p,
                        onChange: (e) => m(e.target.value),
                        className: (0, scope.R)(scope.$, re && `ring-2 ring-rose-500/50`),
                        autoComplete: `new-password`,
                      }),
                    }),
                    v &&
                      (0, scope.W.jsx)(`p`, {
                        className: `text-xs text-rose-600 dark:text-rose-400`,
                        children: v,
                      }),
                    b &&
                      (0, scope.W.jsxs)(`p`, {
                        className: `flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400`,
                        children: [
                          (0, scope.W.jsx)(scope.o, { className: `size-3.5` }),
                          `已导出 `,
                          b,
                        ],
                      }),
                    (0, scope.W.jsxs)(`button`, {
                      type: `button`,
                      disabled: !I,
                      onClick: () => void ie(),
                      className: `flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600 disabled:opacity-40 disabled:shadow-none`,
                      children: [
                        h
                          ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` })
                          : (0, scope.W.jsx)(scope.c, { className: `size-4` }),
                        h ? `加密中` : `导出备份文件`,
                      ],
                    }),
                  ],
                })
              : (0, scope.W.jsxs)(`div`, {
                  className: `space-y-3`,
                  children: [
                    (0, scope.W.jsxs)(`button`, {
                      type: `button`,
                      onClick: () => S.current?.click(),
                      className: `flex min-h-20 w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-brand-300 bg-brand-50/60 px-4 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:border-brand-800 dark:bg-brand-950/20 dark:text-brand-300`,
                      children: [
                        (0, scope.W.jsx)(scope.B, { className: `size-4` }),
                        C || `选择备份文件开始迁移`,
                      ],
                    }),
                    (0, scope.W.jsx)(`input`, {
                      ref: S,
                      type: `file`,
                      accept: `.json,application/json`,
                      'aria-label': `选择备份文件`,
                      className: `hidden`,
                      onChange: (e) => {
                        let t = e.target.files?.[0];
                        (t && oe(t), (e.target.value = ``));
                      },
                    }),
                    D &&
                      (0, scope.W.jsx)(scope.Q, {
                        label: `备份口令`,
                        hint: `导出这个文件时设置的口令`,
                        children: (0, scope.W.jsx)(`input`, {
                          type: `password`,
                          value: k,
                          onChange: (e) => A(e.target.value),
                          className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                          placeholder: `输入导出时设置的口令`,
                          autoComplete: `current-password`,
                          onKeyDown: (e) => {
                            e.key === `Enter` && ce && se();
                          },
                        }),
                      }),
                    N &&
                      (0, scope.W.jsx)(`p`, {
                        className: `text-xs text-rose-600 dark:text-rose-400`,
                        children: N,
                      }),
                    j &&
                      (0, scope.W.jsxs)(`div`, {
                        className: `space-y-2`,
                        children: [
                          (0, scope.W.jsxs)(`div`, {
                            className: `grid grid-cols-4 gap-2`,
                            children: [
                              (0, scope.W.jsx)(scope.qs, {
                                label: `新建站点`,
                                value: j.newSites.length,
                                tone: `brand`,
                              }),
                              (0, scope.W.jsx)(scope.qs, {
                                label: `导入账号`,
                                value: j.accounts.length,
                                tone: `emerald`,
                              }),
                              (0, scope.W.jsx)(scope.qs, {
                                label: `代理节点`,
                                value: j.newProxies.length,
                                tone: `sky`,
                              }),
                              (0, scope.W.jsx)(scope.qs, {
                                label: `已导入过`,
                                value: j.duplicateCount,
                                tone: `ink`,
                              }),
                            ],
                          }),
                          (j.reusedSiteCount > 0 || j.reusedProxyCount > 0) &&
                            (0, scope.W.jsxs)(`p`, {
                              className: `text-[11px] text-ink-800/50 dark:text-ink-100/40`,
                              children: [
                                j.reusedSiteCount > 0 &&
                                  `另有 ${j.reusedSiteCount} 个站点本机已存在，账号会挂到已有站点上。`,
                                j.reusedProxyCount > 0 &&
                                  `${j.reusedSiteCount > 0 ? ` ` : ``}${j.reusedProxyCount} 个代理节点本机已存在，按节点名复用。`,
                              ],
                            }),
                          j.newProxies.length > 0 &&
                            (0, scope.W.jsxs)(`div`, {
                              className: `rounded-lg bg-sky-50 px-3 py-2.5 dark:bg-sky-950/20`,
                              children: [
                                (0, scope.W.jsxs)(`p`, {
                                  className: `text-[11px] leading-relaxed text-sky-800 dark:text-sky-200`,
                                  children: [
                                    (0, scope.W.jsx)(`b`, {
                                      children: `代理端口是导出那台电脑的。`,
                                    }),
                                    `导入后请到「代理」面板点「同步节点」， 选择本机当前运行的 `,
                                    (0, scope.W.jsx)(`code`, {
                                      className: `rounded bg-sky-100 px-1 dark:bg-sky-900/50`,
                                      children: `clash-verge.yaml`,
                                    }),
                                    `， 同名节点会自动补上本机的真实端口。`,
                                  ],
                                }),
                                (0, scope.W.jsx)(`p`, {
                                  className: `mt-1 break-all font-mono text-[10px] text-sky-700/70 dark:text-sky-300/60`,
                                  children: `%APPDATA%\\io.github.clash-verge-rev.clash-verge-rev\\clash-verge.yaml`,
                                }),
                              ],
                            }),
                          j.unmatched.length > 0 &&
                            (0, scope.W.jsxs)(`div`, {
                              className: `flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 dark:bg-amber-950/20`,
                              children: [
                                (0, scope.W.jsx)(scope.g, {
                                  className: `mt-0.5 size-3.5 shrink-0 text-amber-700 dark:text-amber-300`,
                                }),
                                (0, scope.W.jsxs)(`div`, {
                                  className: `min-w-0 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200`,
                                  children: [
                                    (0, scope.W.jsxs)(`b`, {
                                      children: [j.unmatched.length, ` 个账号找不到对应站点`],
                                    }),
                                    `，不会被导入：`,
                                    (0, scope.W.jsxs)(`span`, {
                                      className: `mt-0.5 block truncate`,
                                      title: j.unmatched
                                        .map((e) => `${e.username} @ ${e.siteLoginUrl}`)
                                        .join(`、`),
                                      children: [
                                        j.unmatched
                                          .slice(0, 3)
                                          .map((e) => e.username)
                                          .join(`、`),
                                        j.unmatched.length > 3
                                          ? ` 等 ${j.unmatched.length} 个`
                                          : ``,
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                        ],
                      }),
                    C &&
                      (0, scope.W.jsxs)(`button`, {
                        type: `button`,
                        disabled: !ce,
                        onClick: () => void se(),
                        className: `flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-brand-500 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600 disabled:opacity-40 disabled:shadow-none`,
                        children: [
                          ee
                            ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` })
                            : (0, scope.W.jsx)(scope.Ce, { className: `size-4` }),
                          ee ? `正在迁移` : `全部导入到本机`,
                        ],
                      }),
                    F &&
                      (0, scope.W.jsxs)(`p`, {
                        className: `flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400`,
                        children: [(0, scope.W.jsx)(scope.o, { className: `size-3.5` }), F],
                      }),
                  ],
                }),
          ],
        }),
      });
    };
    scope.Zl = function Zl({ mode: e, compact: t, surface: n, disabled: r = !1, onChange: i }) {
      return (0, scope.W.jsxs)(`div`, {
        role: `radiogroup`,
        'aria-label': `扩展打开方式`,
        'data-mode': e,
        'aria-busy': r,
        className: (0, scope.R)(
          `launch-mode-switch inline-flex h-9 items-center gap-0.5 rounded-lg bg-white p-1 text-ink-800 ring-1 ring-black/5 dark:bg-white/5 dark:text-ink-100 dark:ring-white/10`,
          r && `launch-mode-switch-busy`,
        ),
        children: [
          (0, scope.W.jsx)(`span`, {
            className: (0, scope.R)(
              `launch-mode-caption px-1.5 text-[9px] font-bold uppercase text-ink-800/45 dark:text-ink-100/45`,
              t && `sr-only`,
            ),
            children: `打开方式`,
          }),
          scope.Xl.map(({ value: a, label: o, Icon: s }) => {
            let c = e === a,
              l = a === `tab` ? n === `page` : n === `sidepanel`;
            return (0, scope.W.jsxs)(
              scope.w.button,
              {
                whileTap: { scale: 0.92 },
                type: `button`,
                disabled: r,
                role: `radio`,
                'aria-checked': c,
                'aria-label': `${o}模式`,
                title: c && l ? `当前为${o}模式` : `切换到${o}并立即打开`,
                onClick: () => {
                  (!c || !l) && i(a);
                },
                className: (0, scope.R)(`launch-mode-option`, c && `launch-mode-option-active`),
                children: [
                  c &&
                    (0, scope.W.jsx)(scope.w.span, {
                      layoutId: `launch-mode-active`,
                      className: `launch-mode-active-plate`,
                      transition: { type: `spring`, stiffness: 460, damping: 34 },
                      'aria-hidden': `true`,
                    }),
                  (0, scope.W.jsx)(`span`, {
                    className: `launch-mode-icon`,
                    'aria-hidden': `true`,
                    children: (0, scope.W.jsx)(s, { className: `size-3.5` }),
                  }),
                  (0, scope.W.jsx)(`span`, {
                    className: (0, scope.R)(`launch-mode-label`, t && `sr-only`),
                    children: o,
                  }),
                ],
              },
              a,
            );
          }),
        ],
      });
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.Cn = `sidepanel`;
        break;
      }
      case 1: {
        scope.Ri = 0;
        break;
      }
      case 2: {
        scope.Ts = 25e4;
        break;
      }
      case 3: {
        scope.Es = scope.Ts * 10;
        break;
      }
      case 4: {
        scope.Ds = 1e4;
        break;
      }
      case 5: {
        scope.Os = 16;
        break;
      }
      case 6: {
        scope.ks = 12;
        break;
      }
      case 7: {
        scope.As = `aah-backup-v1`;
        break;
      }
      case 8: {
        scope.Xl = [
          { value: `sidepanel`, label: `侧边栏`, Icon: scope.rt },
          { value: `tab`, label: `独立页`, Icon: scope.fe },
        ];
        break;
      }
    }
  },
  storeProperties: {
    store_Ui_setLaunchMode(scope, e, t) {
      return {
        async setLaunchMode(n) {
          let r = t().launchMode;
          if (r === n) return;
          let i = ++scope.Ri;
          e({ launchMode: n });
          let a = await (0, scope.H)({ type: `SET_LAUNCH_MODE`, mode: n, requestId: i });
          if (i === scope.Ri && !a.ok)
            throw ((scope.Ri += 1), e({ launchMode: r }), Error(a.error));
        },
      };
    },
    store_Ui_syncLaunchMode(scope, e, t) {
      return {
        syncLaunchMode(n) {
          t().launchMode !== n && ((scope.Ri += 1), e({ launchMode: n }));
        },
      };
    },
  },
});
