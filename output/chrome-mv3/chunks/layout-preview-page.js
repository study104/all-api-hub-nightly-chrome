import {
  uiExport_i,
  uiExport_n,
  uiExport_r,
  uiExport_t
} from "./shared-LGI4SL6H.js";
import {
  c,
  f,
  g,
  v
} from "./shared-RH4UF5PN.js";

// src/previews/layout-preview.js
var c2 = g();
var l = c(f(), 1);
var u = v();
var d = [];
var f2 = [];
var p = /* @__PURE__ */ new Map();
var m = /* @__PURE__ */ new Map();
var h = (e) => `pending`;
var g2 = (e) => m.get(e);
var _ = (e) => ({ quota: e, usedQuota: 0, at: Date.now(), symbol: `$` });
p.set(`demo-1`, _(16092350)), p.set(`demo-2`, _(2660500));
var v2 = (e) => p.get(e);
var y = { version: `0.2.2-preview`, running: 1, attention: 1, total: 9, done: 6 };
function b() {
  let [e, t] = (0, l.useState)(`accounts`), [n, r] = (0, l.useState)(``), [c3, p2] = (0, l.useState)([]), [m2, _2] = (0, l.useState)(f2);
  return (0, u.jsxs)(uiExport_r, {
    view: e,
    onViewChange: (e2) => t(e2),
    search: n,
    onSearchChange: r,
    status: y,
    children: [
      e === `accounts` && (0, u.jsx)(uiExport_t, {
        sites: d,
        accounts: f2,
        statusOf: h,
        balanceOf: v2,
        onRunAccount: () => {
        },
        onRefreshBalance: () => {
        },
        onToast: () => {
        }
      }),
      e === `network` && (0, u.jsx)(uiExport_i, {
        proxies: c3,
        accounts: m2,
        sites: d,
        onAddMany: async (e2) => (p2((t2) => t2.concat(e2.map((e3) => ({ ...e3, id: crypto.randomUUID() })))), { added: e2.length, skipped: 0, upgraded: 0 }),
        onSyncClash: async (e2) => (p2(e2.map((e3) => ({ ...e3, id: crypto.randomUUID() }))), { added: e2.length, skipped: 0, upgraded: 0, removed: 0, keptInUse: 0 }),
        onRemove: async (e2) => p2((t2) => t2.filter((t3) => t3.id !== e2)),
        onAssign: async (e2) => {
          let t2 = new Map(e2.map((e3) => [e3.accountId, e3]));
          return _2(
            (e3) => e3.map((e4) => {
              let n2 = t2.get(e4.id);
              return n2 ? { ...e4, proxyMode: `pool`, proxyId: n2.proxyId, proxyPinned: n2.pinned } : e4;
            })
          ), e2.length;
        },
        onSetAccountProxy: async (e2, t2) => _2((n2) => n2.map((n3) => n3.id === e2 ? { ...n3, ...t2 } : n3))
      }),
      e === `records` && (0, u.jsx)(uiExport_n, { sites: d, accounts: f2, resultOf: g2, statusOf: h }),
      e === `overview` && (0, u.jsx)(`div`, {
        className: `text-sm text-ink-800/60`,
        children: `总览演示位（真实数据在扩展页）`
      })
    ]
  });
}
var x = globalThis;
var S = x.__shellPreviewRoot ?? (0, c2.createRoot)(document.getElementById(`root`));
x.__shellPreviewRoot = S, S.render((0, u.jsx)(b, {}));
