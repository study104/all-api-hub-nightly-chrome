import {
  Be,
  C,
  Ce,
  De,
  He,
  Ie,
  Je,
  Ke,
  Me,
  Pe,
  Qe,
  Re,
  Te,
  We,
  Xe,
  _e,
  c,
  de,
  et,
  f,
  he,
  it,
  je,
  ke,
  nt,
  pe,
  v,
  w,
  xe,
  ye
} from "./shared-RH4UF5PN.js";

// src/shared/ui-scope.js
function createUiModuleRuntime(definition) {
  return {
    bindings: /* @__PURE__ */ Object.create(null),
    scope: void 0,
    ...definition
  };
}
function createUiScope(runtimes, importedBindings, exportBindings = {}) {
  const scope = /* @__PURE__ */ Object.create(null);
  Object.defineProperties(scope, Object.getOwnPropertyDescriptors(importedBindings));
  for (const runtime of Object.values(runtimes)) {
    for (const name of runtime.bindingNames) {
      runtime.bindings[name] = void 0;
      Object.defineProperty(scope, name, {
        enumerable: true,
        get: () => runtime.bindings[name],
        set(value) {
          runtime.bindings[name] = value;
          runtime.publish?.(name, value);
          exportBindings[name]?.(value);
        }
      });
    }
  }
  return scope;
}
function initializeUiScope(scope, runtimes, initializationOrder) {
  for (const runtime of Object.values(runtimes)) {
    runtime.scope = scope;
    runtime.register(scope);
  }
  for (const [owner, step] of initializationOrder) {
    runtimes[owner].initialize(scope, step, runtimes);
  }
}

// src/shared/ui-runtime.js
var openModalPanels = /* @__PURE__ */ new Set();
var modalBodyOverflow = "";
function topModalPanel() {
  return [...document.querySelectorAll(".aah-modal-panel")].filter((panel) => openModalPanels.has(panel)).at(-1);
}
var sharedUiRuntime = createUiModuleRuntime({
  bindingNames: [
    "O",
    "k",
    "rd",
    "id",
    "ad",
    "od",
    "sd",
    "cd",
    "ld",
    "ud",
    "Dm",
    "Om",
    "km",
    "Am",
    "jm"
  ],
  register(scope) {
    scope.sd = function sd(e) {
      if (e.type === `SLIDER_FRAME_PREPARE`) return 8e3;
      if (e.type === `SLIDER_FRAME_CONNECT` || e.type === `SLIDER_FRAME_REPORT` || e.type === `SLIDER_FRAME_STATUS` || e.type === `SLIDER_FRAME_CANCEL`)
        return 4e3;
      if (e.type === `SCAN_LOCAL_PORTS`) {
        let t = e.withExit === true ? scope.ad : scope.id;
        return e.ports.length * t + scope.od;
      }
      return e.type === `TEST_PROXY` ? 34e3 : scope.rd;
    };
    scope.cd = function cd(e) {
      return new Promise((t) => {
        let n = (0, scope.sd)(e), r = false, i = (e2) => {
          r || (r = true, clearTimeout(a), t(e2));
        }, a = setTimeout(() => {
          i({
            ok: false,
            error: `后台在 ${Math.round(n / 1e3)} 秒内没有响应 ${e.type}（Service Worker 可能已被回收）`
          });
        }, n);
        try {
          chrome.runtime.sendMessage(e, (e2) => {
            chrome.runtime.lastError ? i({ ok: false, error: chrome.runtime.lastError.message ?? `unknown` }) : i(e2 ?? { ok: true });
          });
        } catch (e2) {
          i({ ok: false, error: e2 instanceof Error ? e2.message : String(e2) });
        }
      });
    };
    scope.Om = function Om({
      view: e,
      onViewChange: t,
      search: n,
      onSearchChange: i,
      status: a,
      children: o,
      shellVisible: s = true
    }) {
      if (!s) return (0, scope.O.jsx)(scope.O.Fragment, { children: o });
      let c2 = e === `settings` ? `设置` : scope.Dm.find((t2) => t2.id === e)?.label ?? `总览`;
      return (0, scope.O.jsxs)(`div`, {
        className: `flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50`,
        children: [
          (0, scope.O.jsx)(`a`, {
            href: `#main-content`,
            className: `fixed left-1/2 top-2 z-[70] -translate-x-1/2 -translate-y-[180%] rounded-lg bg-ink-900 px-3.5 py-2 text-xs font-semibold text-white shadow-lg transition-transform focus-visible:translate-y-0 dark:bg-white dark:text-ink-900`,
            children: `跳到主要内容`
          }),
          (0, scope.O.jsxs)(`aside`, {
            "aria-label": `侧边导航`,
            className: `sticky top-0 z-20 flex h-screen w-[68px] shrink-0 flex-col border-r border-slate-200 bg-white px-2 py-4 lg:w-[228px] lg:px-3 dark:border-slate-800 dark:bg-slate-950`,
            children: [
              (0, scope.O.jsxs)(`div`, {
                className: `mb-5 flex items-center gap-2.5 px-1 lg:px-2`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `grid size-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-600/25`,
                    "aria-hidden": `true`,
                    children: (0, scope.O.jsx)(scope.w, { className: `size-4`, strokeWidth: 2.5 })
                  }),
                  (0, scope.O.jsxs)(`span`, {
                    className: `hidden min-w-0 lg:block`,
                    children: [
                      (0, scope.O.jsx)(`strong`, {
                        className: `block truncate text-sm font-bold tracking-tight`,
                        children: `签到管理台`
                      }),
                      (0, scope.O.jsx)(`span`, {
                        className: `block truncate text-[10px] text-ink-800/50 dark:text-ink-100/45`,
                        children: `Nightly workspace`
                      })
                    ]
                  })
                ]
              }),
              (0, scope.O.jsx)(`p`, {
                className: `mb-2 hidden px-2 text-[10px] font-semibold uppercase tracking-wider text-ink-800/35 lg:block dark:text-ink-100/30`,
                children: `工作台`
              }),
              (0, scope.O.jsx)(`nav`, {
                className: `flex flex-col gap-1`,
                "aria-label": `主导航`,
                children: scope.Dm.map(({ id: n2, label: r, icon: i2 }) => {
                  let o2 = e === n2;
                  return (0, scope.O.jsxs)(
                    `button`,
                    {
                      type: `button`,
                      "aria-current": o2 ? `page` : void 0,
                      "aria-label": r,
                      title: r,
                      onClick: () => t(n2),
                      className: (0, scope.$)(
                        `relative flex h-9 w-full items-center justify-center gap-2.5 rounded-lg text-xs font-medium transition-colors lg:justify-start lg:px-2.5`,
                        o2 ? `bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300` : `text-ink-800/60 hover:bg-slate-100 hover:text-ink-900 dark:text-ink-100/55 dark:hover:bg-slate-900 dark:hover:text-ink-50`
                      ),
                      children: [
                        o2 && (0, scope.O.jsx)(`span`, {
                          "aria-hidden": `true`,
                          className: `absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r bg-blue-600`
                        }),
                        (0, scope.O.jsx)(i2, { className: `size-4 shrink-0` }),
                        (0, scope.O.jsx)(`span`, {
                          className: `hidden truncate lg:block`,
                          children: r
                        }),
                        n2 === `records` && a.done > 0 && (0, scope.O.jsx)(`em`, {
                          className: `ml-auto hidden rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold not-italic text-ink-800/55 lg:block dark:bg-slate-800 dark:text-ink-100/50`,
                          children: a.done
                        })
                      ]
                    },
                    n2
                  );
                })
              }),
              (0, scope.O.jsx)(`div`, { className: `flex-1` }),
              (0, scope.O.jsx)(`nav`, {
                className: `mt-4 flex flex-col gap-1`,
                "aria-label": `系统导航`,
                children: (0, scope.O.jsxs)(`button`, {
                  type: `button`,
                  "aria-current": e === `settings` ? `page` : void 0,
                  "aria-label": `设置`,
                  title: `设置`,
                  onClick: () => t(`settings`),
                  className: (0, scope.$)(
                    `flex h-9 w-full items-center justify-center gap-2.5 rounded-lg text-xs font-medium transition-colors lg:justify-start lg:px-2.5`,
                    e === `settings` ? `bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300` : `text-ink-800/60 hover:bg-slate-100 hover:text-ink-900 dark:text-ink-100/55 dark:hover:bg-slate-900`
                  ),
                  children: [
                    (0, scope.O.jsx)(scope.T, { className: `size-4 shrink-0` }),
                    (0, scope.O.jsx)(`span`, {
                      className: `hidden truncate lg:block`,
                      children: `设置`
                    })
                  ]
                })
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `mt-3 flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-2 py-2 text-[10px] text-ink-800/50 lg:justify-start dark:border-slate-800 dark:text-ink-100/45`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    "aria-hidden": `true`,
                    className: `size-1.5 shrink-0 rounded-full bg-mint-500`
                  }),
                  (0, scope.O.jsx)(`span`, {
                    className: `hidden truncate lg:block`,
                    children: `后台服务正常`
                  }),
                  (0, scope.O.jsxs)(`span`, {
                    className: `ml-auto hidden shrink-0 lg:block`,
                    children: [`v`, a.version]
                  })
                ]
              })
            ]
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `flex min-w-0 flex-1 flex-col`,
            children: [
              (0, scope.O.jsxs)(`header`, {
                className: `sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur lg:px-6 dark:border-slate-800 dark:bg-slate-950/85`,
                children: [
                  (0, scope.O.jsxs)(`nav`, {
                    "aria-label": `面包屑`,
                    className: `flex items-center gap-2 text-[11px] text-ink-800/45 dark:text-ink-100/40`,
                    children: [
                      (0, scope.O.jsx)(`span`, { children: `工作台` }),
                      (0, scope.O.jsx)(`span`, { "aria-hidden": `true`, children: `/` }),
                      (0, scope.O.jsx)(`strong`, {
                        className: `font-semibold text-ink-900 dark:text-ink-50`,
                        children: c2
                      })
                    ]
                  }),
                  (0, scope.O.jsxs)(`label`, {
                    className: `relative order-last w-full min-w-0 flex-1 lg:order-none lg:ml-auto lg:w-auto lg:max-w-sm lg:flex-none`,
                    children: [
                      (0, scope.O.jsx)(scope.d, {
                        "aria-hidden": `true`,
                        className: `pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-800/35 dark:text-ink-100/35`
                      }),
                      (0, scope.O.jsx)(`input`, {
                        value: n,
                        onChange: (e2) => i(e2.target.value),
                        placeholder: `搜索站点、账号或备注`,
                        "aria-label": `搜索站点、账号或备注`,
                        className: `h-9 w-full rounded-lg border border-black/8 bg-slate-50 pr-16 pl-8 text-[11px] text-ink-900 outline-none placeholder:text-ink-800/35 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 dark:border-white/10 dark:bg-slate-900 dark:text-ink-50`
                      }),
                      (0, scope.O.jsxs)(`kbd`, {
                        className: `pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] text-ink-800/45 dark:border-slate-700 dark:bg-slate-800 dark:text-ink-100/40`,
                        children: [(0, scope.O.jsx)(scope.D, { className: `size-2.5` }), `K`]
                      })
                    ]
                  }),
                  (0, scope.O.jsxs)(`div`, {
                    className: `ml-auto flex items-center gap-1.5 lg:ml-0`,
                    children: [
                      a.running > 0 && (0, scope.O.jsxs)(`span`, {
                        className: `inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`,
                        children: [
                          (0, scope.O.jsx)(scope.Ju, {
                            className: `size-2.5`,
                            "aria-hidden": `true`
                          }),
                          `执行中 `,
                          a.running
                        ]
                      }),
                      a.attention > 0 && (0, scope.O.jsxs)(`span`, {
                        className: `inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300`,
                        children: [
                          (0, scope.O.jsx)(scope._, {
                            className: `size-2.5`,
                            "aria-hidden": `true`
                          }),
                          `需处理 `,
                          a.attention
                        ]
                      }),
                      (0, scope.O.jsxs)(`span`, {
                        className: `hidden items-center gap-1 rounded-full bg-mint-50 px-2 py-1 text-[10px] font-bold text-mint-700 sm:inline-flex dark:bg-mint-600/15 dark:text-mint-300`,
                        children: [
                          (0, scope.O.jsx)(scope.r, {
                            className: `size-2.5`,
                            "aria-hidden": `true`
                          }),
                          a.done,
                          `/`,
                          a.total
                        ]
                      })
                    ]
                  })
                ]
              }),
              (0, scope.O.jsx)(`main`, {
                id: `main-content`,
                tabIndex: -1,
                className: `min-w-0 flex-1 px-4 py-5 outline-none lg:px-6`,
                children: o
              })
            ]
          })
        ]
      });
    };
    scope.jm = function jm({ label: e, value: t, detail: n, tone: r, icon: i }) {
      return (0, scope.O.jsxs)(`article`, {
        className: `relative flex min-h-24 items-start gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950`,
        children: [
          (0, scope.O.jsx)(`span`, {
            className: (0, scope.$)(
              `grid size-8 shrink-0 place-items-center rounded-lg`,
              {
                blue: `bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`,
                mint: `bg-mint-50 text-mint-700 dark:bg-mint-600/15 dark:text-mint-300`,
                amber: `bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300`,
                coral: `bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300`
              }[r]
            ),
            children: (0, scope.O.jsx)(i, { className: `size-4` })
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `min-w-0`,
            children: [
              (0, scope.O.jsx)(`span`, {
                className: `block text-[10px] text-ink-800/55 dark:text-ink-100/50`,
                children: e
              }),
              (0, scope.O.jsx)(`strong`, {
                className: `mt-0.5 block text-xl font-semibold leading-none tracking-tight text-ink-900 tabular-nums dark:text-ink-50`,
                children: t
              }),
              (0, scope.O.jsx)(`small`, {
                className: `mt-1 block text-[10px] text-ink-800/50 dark:text-ink-100/45`,
                children: n
              })
            ]
          })
        ]
      });
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.O = (0, scope.i)();
        break;
      }
      case 1: {
        scope.k = (0, scope.g)((0, scope.e)(), 1);
        break;
      }
      case 2: {
        scope.rd = 45e3;
        break;
      }
      case 3: {
        scope.id = 8e3;
        break;
      }
      case 4: {
        scope.ad = 24e3;
        break;
      }
      case 5: {
        scope.od = 1e4;
        break;
      }
      case 6: {
        scope.ld = {
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
          }
        };
        break;
      }
      case 7: {
        scope.ud = {
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
      case 8: {
        scope.Dm = [
          { id: `overview`, label: `总览`, icon: scope.E },
          { id: `sites`, label: `站点`, icon: scope.te },
          { id: `accounts`, label: `账号`, icon: scope.h },
          { id: `network`, label: `代理与网络`, icon: scope.S },
          { id: `records`, label: `执行记录`, icon: scope.p }
        ];
        break;
      }
      case 9: {
        scope.km = {
          done: `已完成`,
          pending: `待签到`,
          running: `执行中`,
          attention: `需处理`,
          failed: `失败`
        };
        break;
      }
      case 10: {
        scope.Am = {
          done: `bg-mint-50 text-mint-700 dark:bg-mint-600/15 dark:text-mint-300`,
          pending: `bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300`,
          running: `bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`,
          attention: `bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300`,
          failed: `bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300`
        };
        break;
      }
    }
  },
  storeProperties: {}
});
var appRuntime = createUiModuleRuntime({
  bindingNames: [
    "W",
    "G",
    "q",
    "Pt",
    "Ft",
    "It",
    "Lt",
    "sr",
    "cr",
    "lr",
    "ur",
    "dr",
    "X",
    "Bi",
    "Vi",
    "uo",
    "Q",
    "No",
    "ou",
    "su",
    "cu",
    "lu",
    "uu"
  ],
  register(scope) {
    scope.q = function q(e = /* @__PURE__ */ new Date()) {
      return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`;
    };
    scope.Pt = function Pt(e, t = (0, scope.q)()) {
      return `${e}:${t}`;
    };
    scope.Ft = function Ft(e = ``) {
      let t = Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
      return e ? `${e}-${t}` : t;
    };
    scope.It = function It(e) {
      try {
        let t = new URL(e), n = t.hostname === `localhost` || t.hostname === `127.0.0.1` || t.hostname === `[::1]`;
        return t.protocol !== `https:` && !(t.protocol === `http:` && n) ? `` : new URL(`/favicon.ico`, t.origin).href;
      } catch {
        return ``;
      }
    };
    scope.Lt = function Lt(e) {
      try {
        return new URL(e).hostname;
      } catch {
        return e;
      }
    };
    scope.lr = function lr(e, t) {
      let n = (scope.sr.get(e) ?? Promise.resolve()).then(t, t);
      return scope.sr.set(
        e,
        n.then(
          () => void 0,
          () => void 0
        )
      ), n;
    };
    scope.ur = function ur() {
      let e = globalThis.navigator?.locks;
      return typeof e?.request == `function` ? e : void 0;
    };
    scope.dr = function dr(e, t) {
      let n = (0, scope.ur)();
      return n ? (0, scope.lr)(e, async () => await n.request(e, { mode: `exclusive` }, () => t())) : (0, scope.lr)(e, t);
    };
    scope.X = function X(e) {
      return (0, scope.dr)(scope.cr.APP_DATA, e);
    };
    scope.Bi = function Bi(e) {
      try {
        return new URL(e).hostname.toLowerCase();
      } catch {
        return ``;
      }
    };
    scope.Vi = async function Vi(e) {
      let t = await (0, scope.H)({ type: `MUTATE_APP`, mutation: e });
      if (!t.ok) throw Error(t.error);
      return t;
    };
    scope.uo = function uo({ open: e, title: t, onClose: n, children: r, wide: i, footer }) {
      const panel = scope.G.useRef(null);
      const close = scope.G.useRef(n);
      close.current = n;
      const hasFooter = !!footer;
      scope.G.useEffect(() => {
        if (!e || !panel.current) return;
        const activePanel = panel.current;
        const previousFocus = document.activeElement;
        if (openModalPanels.size === 0) modalBodyOverflow = document.body.style.overflow;
        openModalPanels.add(activePanel);
        document.body.style.overflow = `hidden`;
        const frame = requestAnimationFrame(() => {
          if (topModalPanel() !== activePanel) return;
          const first = [
            ...activePanel.querySelectorAll(
              `[aria-checked="true"]:not(:disabled), select:not(:disabled), input:not(:disabled), textarea:not(:disabled)`
            )
          ].find((element) => element.getClientRects().length);
          (first ?? activePanel).focus();
        });
        function onKeyDown(event) {
          if (topModalPanel() !== activePanel) return;
          if (event.key === `Escape`) {
            event.preventDefault();
            event.stopImmediatePropagation();
            close.current?.();
          } else if (event.key === `Tab`) {
            const controls = [
              ...panel.current.querySelectorAll(
                `button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary`
              )
            ].filter((element) => element.tabIndex >= 0 && element.getClientRects().length);
            const first = controls[0];
            const last = controls.at(-1);
            if (!first) return;
            if (!panel.current.contains(document.activeElement)) {
              event.preventDefault();
              first.focus();
            } else if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }
        document.addEventListener(`keydown`, onKeyDown, true);
        return () => {
          cancelAnimationFrame(frame);
          document.removeEventListener(`keydown`, onKeyDown, true);
          openModalPanels.delete(activePanel);
          if (openModalPanels.size === 0) document.body.style.overflow = modalBodyOverflow;
          const topPanel = topModalPanel();
          if (previousFocus?.isConnected && (!topPanel || topPanel.contains(previousFocus))) {
            previousFocus.focus();
          }
        };
      }, [e]);
      return (0, scope.W.jsx)(scope.O, {
        children: e && (0, scope.W.jsx)(scope.w.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: `fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm`,
          onClick: n,
          children: (0, scope.W.jsxs)(scope.w.div, {
            initial: { opacity: 0, scale: 0.94, y: 16 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.96, y: 8 },
            transition: { type: `spring`, stiffness: 400, damping: 30 },
            ref: panel,
            role: `dialog`,
            tabIndex: -1,
            "aria-modal": true,
            "aria-label": t,
            onClick: (e2) => e2.stopPropagation(),
            className: `aah-modal-panel ${footer ? `aah-modal-with-footer ` : ``}${i ? `max-w-2xl` : `max-w-md`} max-h-full w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 dark:bg-ink-800 dark:ring-white/10`,
            children: [
              (0, scope.W.jsxs)(`header`, {
                className: `aah-modal-header flex items-center justify-between border-b border-black/5 px-5 py-3.5 dark:border-white/5`,
                children: [
                  (0, scope.W.jsx)(`h3`, {
                    className: `text-sm font-semibold text-ink-900 dark:text-ink-50`,
                    children: t
                  }),
                  (0, scope.W.jsx)(scope.w.button, {
                    whileHover: { scale: 1.12, rotate: 90 },
                    whileTap: { scale: 0.9 },
                    type: `button`,
                    onClick: n,
                    className: `rounded-lg p-1.5 text-ink-800/50 hover:bg-black/5 dark:text-ink-100/50 dark:hover:bg-white/10`,
                    children: (0, scope.W.jsx)(scope.h, { className: `size-4` })
                  })
                ]
              }),
              (0, scope.W.jsx)(`div`, {
                className: `${footer ? `aah-modal-content ` : ``}p-5`,
                children: r
              }),
              footer && (0, scope.W.jsx)(`footer`, {
                className: `aah-modal-footer`,
                children: footer
              })
            ]
          })
        })
      });
    };
    scope.Q = function Q({ label: e, hint: t, children: n }) {
      return (0, scope.W.jsxs)(`label`, {
        className: `block space-y-1.5`,
        children: [
          (0, scope.W.jsx)(`span`, {
            className: `text-xs font-medium text-ink-800/70 dark:text-ink-100/60`,
            children: e
          }),
          n,
          t && (0, scope.W.jsx)(`span`, {
            className: `block text-[11px] text-ink-800/40 dark:text-ink-100/30`,
            children: t
          })
        ]
      });
    };
    scope.No = function No({ steps: e }) {
      return (0, scope.W.jsx)(`ol`, {
        className: `mt-1 space-y-1.5`,
        children: e.map(
          (e2, t) => (0, scope.W.jsxs)(
            `li`,
            {
              className: `break-words`,
              children: [
                t + 1,
                `. `,
                (0, scope.Ao)(e2),
                e2.type === `if` && (0, scope.W.jsxs)(`div`, {
                  className: `ml-3 border-l border-black/10 pl-2 dark:border-white/10`,
                  children: [
                    (0, scope.W.jsx)(`p`, { children: `满足条件时：` }),
                    (0, scope.W.jsx)(scope.No, { steps: e2.then }),
                    !!e2.else?.length && (0, scope.W.jsxs)(scope.W.Fragment, {
                      children: [
                        (0, scope.W.jsx)(`p`, { className: `mt-1`, children: `否则：` }),
                        (0, scope.W.jsx)(scope.No, { steps: e2.else })
                      ]
                    })
                  ]
                })
              ]
            },
            t
          )
        )
      });
    };
    scope.uu = function uu(e, t) {
      let n = { total: e.length, done: 0, pending: 0, running: 0, attention: 0, failed: 0 };
      for (let r of e) n[t(r.id)] += 1;
      return {
        ...n,
        actionable: n.pending + n.failed,
        progress: n.total ? Math.round(n.done / n.total * 100) : 0
      };
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.W = (0, scope.i)();
        break;
      }
      case 1: {
        scope.G = (0, scope.f)((0, scope.e)(), 1);
        break;
      }
      case 2: {
        scope.sr = /* @__PURE__ */ new Map();
        break;
      }
      case 3: {
        scope.cr = { APP_DATA: `checkin:app-data`, BALANCE: `checkin:balance` };
        break;
      }
      case 4: {
        scope.ou = class extends scope.G.Component {
          state = { error: null, info: `` };
          static getDerivedStateFromError(e) {
            return { error: e };
          }
          componentDidCatch(e, t) {
            this.setState({ info: t.componentStack ?? `` }), console.error(`[签到管理台] 渲染崩溃`, e, t.componentStack);
          }
          render() {
            let { error: e, info: t } = this.state;
            return e ? (0, scope.W.jsxs)(`div`, {
              className: `mx-auto max-w-2xl px-6 py-16`,
              children: [
                (0, scope.W.jsx)(`h1`, {
                  className: `text-base font-bold text-rose-700 dark:text-rose-300`,
                  children: `签到管理台渲染出错`
                }),
                (0, scope.W.jsx)(`p`, {
                  className: `mt-2 text-xs text-ink-800/65 dark:text-ink-100/55`,
                  children: `不是你操作的问题，是界面代码崩了。把下面的报错发给开发者即可定位。`
                }),
                (0, scope.W.jsxs)(`pre`, {
                  className: `mt-4 overflow-auto rounded-lg bg-rose-50 p-3 text-[11px] leading-relaxed text-rose-900 ring-1 ring-rose-500/20 dark:bg-rose-950/30 dark:text-rose-200`,
                  children: [e.message, e.stack]
                }),
                t && (0, scope.W.jsx)(`pre`, {
                  className: `mt-3 overflow-auto rounded-lg bg-slate-100 p-3 text-[10px] leading-relaxed text-ink-800/70 dark:bg-slate-900 dark:text-ink-100/60`,
                  children: t
                }),
                (0, scope.W.jsx)(`button`, {
                  type: `button`,
                  onClick: () => this.setState({ error: null, info: `` }),
                  className: `mt-4 h-9 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700`,
                  children: `重试渲染`
                })
              ]
            }) : this.props.children;
          }
        };
        break;
      }
      case 5: {
        scope.su = null;
        break;
      }
      case 6: {
        scope.cu = chrome.runtime.getManifest();
        break;
      }
      case 7: {
        scope.lu = scope.cu.version_name ?? scope.cu.version;
        break;
      }
    }
  },
  storeProperties: {}
});

// src/vendor/ui-motion-runtime.js
var sharedUiRuntime2 = createUiModuleRuntime({
  bindingNames: [
    "A",
    "j",
    "M",
    "N",
    "P",
    "ne",
    "re",
    "ie",
    "ae",
    "F",
    "I",
    "oe",
    "se",
    "L",
    "ce",
    "le",
    "R",
    "z",
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
    "xe",
    "Se",
    "Ce",
    "we",
    "Te",
    "Ee",
    "De",
    "Oe",
    "ke",
    "Ae",
    "je",
    "Me",
    "B",
    "Ne",
    "Pe",
    "V",
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
    "Je",
    "Ye",
    "Xe",
    "Ze",
    "Qe",
    "$e",
    "et",
    "tt",
    "nt",
    "rt",
    "H",
    "it",
    "at",
    "ot",
    "st",
    "U",
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
    "W",
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
    "G",
    "Xt",
    "Zt",
    "Qt",
    "$t",
    "en",
    "tn",
    "nn",
    "K",
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
    "si",
    "ci",
    "li",
    "ui",
    "di",
    "fi",
    "pi",
    "mi",
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
    "q",
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
    "J",
    "ho",
    "go",
    "_o",
    "vo",
    "yo",
    "bo",
    "xo",
    "So",
    "Co",
    "wo",
    "To",
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
    "dd",
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
    "Y",
    "cf",
    "lf",
    "uf",
    "df",
    "ff",
    "pf",
    "mf",
    "hf",
    "gf",
    "X",
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
    "Z",
    "Of",
    "kf",
    "Af",
    "jf",
    "Mf",
    "Nf",
    "Pf",
    "Q",
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
    "Qf"
  ],
  register(scope) {
    scope.j = function j(e) {
      let t = (0, scope.k.useRef)(null);
      return t.current === null && (t.current = e()), t.current;
    };
    scope.P = function P(e, t) {
      e.indexOf(t) === -1 && e.push(t);
    };
    scope.ne = function ne(e, t) {
      let n = e.indexOf(t);
      n > -1 && e.splice(n, 1);
    };
    scope.oe = function oe(e) {
      let t;
      return () => (t === void 0 && (t = e()), t);
    };
    scope.me = function me(e, t, n, r, i) {
      let a, o, s = 0;
      do
        o = t + (n - t) / 2, a = (0, scope.de)(o, r, i) - e, a > 0 ? n = o : t = o;
      while (Math.abs(a) > scope.fe && ++s < scope.pe);
      return o;
    };
    scope.he = function he2(e, t, n, r) {
      if (e === t && n === r) return scope.se;
      let i = (t2) => (0, scope.me)(t2, 0, 1, e, n);
      return (e2) => e2 === 0 || e2 === 1 ? e2 : (0, scope.de)(i(e2), t, r);
    };
    scope.Pe = function Pe2() {
      scope.Ne = void 0;
    };
    scope.Ve = function Ve(e) {
      return typeof e == `string` && e.split(`/*`)[0].includes(`var(--`);
    };
    scope.Ke = function Ke2(e) {
      return e == null;
    };
    scope.$e = function $e(e) {
      let t = ``, n = ``, r = ``, i = ``;
      return e.length > 5 ? (t = e.substring(1, 3), n = e.substring(3, 5), r = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), n = e.substring(2, 3), r = e.substring(3, 4), i = e.substring(4, 5), t += t, n += n, r += r, i += i), {
        red: parseInt(t, 16),
        green: parseInt(n, 16),
        blue: parseInt(r, 16),
        alpha: i ? parseInt(i, 16) / 255 : 1
      };
    };
    scope.dt = function dt(e) {
      return isNaN(e) && typeof e == `string` && (scope.lt.test(e) || scope.ut.test(e));
    };
    scope.vt = function vt(e) {
      let t = e.toString();
      return scope.lt.test(t) || scope.ut.test(t);
    };
    scope.yt = function yt(e) {
      let t = e.toString(), n = [], r = { color: [], number: [], var: [] }, i = [], a = 0;
      return {
        values: n,
        split: t.replace(
          scope._t,
          (e2) => (scope.U.test(e2) ? (r.color.push(a), i.push(scope.pt), n.push(scope.U.parse(e2))) : e2.startsWith(scope.ht) ? (r.var.push(a), i.push(scope.mt), n.push(e2)) : (r.number.push(a), i.push(scope.ft), n.push(parseFloat(e2))), ++a, scope.gt)
        ).split(scope.gt),
        indexes: r,
        types: i
      };
    };
    scope.bt = function bt(e) {
      return (0, scope.yt)(e).values;
    };
    scope.xt = function xt({ split: e, types: t }) {
      let n = e.length;
      return (r) => {
        let i = ``;
        for (let a = 0; a < n; a++)
          if (i += e[a], r[a] !== void 0) {
            let e2 = t[a];
            i += e2 === scope.ft ? (0, scope.Fe)(r[a]) : e2 === scope.pt ? scope.U.transform(r[a]) : r[a];
          }
        return i;
      };
    };
    scope.St = function St(e) {
      return (0, scope.xt)((0, scope.yt)(e));
    };
    scope.Tt = function Tt(e) {
      let t = (0, scope.yt)(e);
      return (0, scope.xt)(t)(t.values.map((e2, n) => (0, scope.wt)(e2, t.split[n])));
    };
    scope.Dt = function Dt(e, t, n) {
      return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
    };
    scope.Ot = function Ot({ hue: e, saturation: t, lightness: n, alpha: r }) {
      e /= 360, t /= 100, n /= 100;
      let i = 0, a = 0, o = 0;
      if (!t) i = a = o = n;
      else {
        let r2 = n < 0.5 ? n * (1 + t) : n + t - n * t, s = 2 * n - r2;
        i = (0, scope.Dt)(s, r2, e + 1 / 3), a = (0, scope.Dt)(s, r2, e), o = (0, scope.Dt)(s, r2, e - 1 / 3);
      }
      return {
        red: Math.round(i * 255),
        green: Math.round(a * 255),
        blue: Math.round(o * 255),
        alpha: r
      };
    };
    scope.kt = function kt(e, t) {
      return (n) => n > 0 ? t : e;
    };
    scope.Nt = function Nt(e) {
      let t = (0, scope.Mt)(e);
      if (!t) return `${e}`, false;
      let n = t.parse(e);
      return t === scope.st && (n = (0, scope.Ot)(n)), n;
    };
    scope.It = function It(e, t) {
      return scope.Ft.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
    };
    scope.Lt = function Lt(e, t) {
      return (n) => (0, scope.W)(e, t, n);
    };
    scope.Rt = function Rt(e) {
      return typeof e == `number` ? scope.Lt : typeof e == `string` ? (0, scope.ze)(e) ? scope.kt : scope.U.test(e) ? scope.Pt : scope.Ht : Array.isArray(e) ? scope.zt : typeof e == `object` ? scope.U.test(e) ? scope.Pt : scope.Bt : scope.kt;
    };
    scope.zt = function zt(e, t) {
      let n = [...e], r = n.length, i = e.map((e2, n2) => (0, scope.Rt)(e2)(e2, t[n2]));
      return (e2) => {
        for (let t2 = 0; t2 < r; t2++) n[t2] = i[t2](e2);
        return n;
      };
    };
    scope.Bt = function Bt(e, t) {
      let n = { ...e, ...t }, r = {};
      for (let i in n)
        e[i] !== void 0 && t[i] !== void 0 && (r[i] = (0, scope.Rt)(e[i])(e[i], t[i]));
      return (e2) => {
        for (let t2 in r) n[t2] = r[t2](e2);
        return n;
      };
    };
    scope.Vt = function Vt(e, t) {
      let n = [], r = { color: 0, var: 0, number: 0 };
      for (let i = 0; i < t.values.length; i++) {
        let a = t.types[i], o = e.indexes[a][r[a]], s = e.values[o] ?? 0;
        n[i] = s, r[a]++;
      }
      return n;
    };
    scope.Wt = function Wt(e, t) {
      let n = scope.Ut.exec(e);
      if (!n) return;
      let r = scope.Ut.exec(t);
      if (!r || n[2] !== r[2]) return;
      let i = n[2], a = parseFloat(n[1]), o = parseFloat(r[1]);
      return (e2) => (0, scope.Fe)((0, scope.W)(a, o, e2)) + i;
    };
    scope.Gt = function Gt(e, t, n) {
      if (typeof e == `number` && typeof t == `number` && typeof n == `number`)
        return (0, scope.W)(e, t, n);
      if (typeof e == `string` && typeof t == `string`) {
        let n2 = (0, scope.Wt)(e, t);
        if (n2) return n2;
      }
      return (0, scope.Rt)(e)(e, t);
    };
    scope.qt = function qt(e) {
      let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = false, i = false, a = /* @__PURE__ */ new Set(), o = { delta: 0, timestamp: 0, isProcessing: false };
      function s(t2) {
        a.has(t2) && (n.add(t2), e()), t2(o);
      }
      let c2 = {
        schedule: (e2, i2 = false, o2 = false) => {
          let s2 = o2 && r ? t : n;
          return i2 && a.add(e2), s2.add(e2), e2;
        },
        cancel: (e2) => {
          n.delete(e2), a.delete(e2);
        },
        process: (e2) => {
          if (o = e2, r) {
            i = true;
            return;
          }
          r = true;
          let a2 = t;
          t = n, n = a2, t.forEach(s), t.clear(), r = false, i && (i = false, c2.process(e2));
        }
      };
      return c2;
    };
    scope.Yt = function Yt(e, t, n = { delta: 0, timestamp: 0, isProcessing: false }) {
      let r = false, i = true, a = () => r = true, o = scope.Kt.reduce((e2, t2) => (e2[t2] = (0, scope.qt)(a), e2), {}), {
        setup: s,
        read: c2,
        resolveKeyframes: l,
        preUpdate: u,
        update: d,
        preRender: f2,
        render: p,
        postRender: m
      } = o, h = () => {
        let a2 = scope.ie.useManualTiming, o2 = a2 ? n.timestamp : performance.now();
        r = false, a2 || (n.delta = i ? 1e3 / 60 : Math.max(Math.min(o2 - n.timestamp, scope.Jt), 1)), n.timestamp = o2, n.isProcessing = true, s.process(n), c2.process(n), l.process(n), u.process(n), d.process(n), f2.process(n), p.process(n), m.process(n), n.isProcessing = false, r && t && (i = false, e(h));
      }, g = () => {
        r = true, i = true, n.isProcessing || e(h);
      };
      return {
        schedule: scope.Kt.reduce((e2, t2) => {
          let n2 = o[t2];
          return e2[t2] = (e3, t3 = false, i2 = false) => (r || g(), n2.schedule(e3, t3, i2)), e2;
        }, {}),
        cancel: (e2) => {
          for (let t2 = 0; t2 < scope.Kt.length; t2++) o[scope.Kt[t2]].cancel(e2);
        },
        state: n,
        steps: o
      };
    };
    scope.tn = function tn(e, t = 50, n = scope.en, r) {
      let i = 0, a = e.next(i);
      for (r?.push(a.value); !a.done && i < n; ) i += t, a = e.next(i), r?.push(a.value);
      return i >= n ? 1 / 0 : i;
    };
    scope.nn = function nn(e, t = 100, n) {
      let r = n({ ...e, keyframes: [0, t] }), i = Math.min((0, scope.tn)(r), scope.en);
      return { type: `keyframes`, ease: (e2) => r.next(i * e2).value / t, duration: (0, scope.z)(i) };
    };
    scope.an = function an(e, t) {
      if (!(e > 1)) return 1;
      let n = Math.sqrt(e * e - 1), r = e - n, i = e + n, a = 2 * n * Math.exp(-t) * (1 + t);
      return (0, scope.cn)(
        (e2) => i * Math.exp(-r * e2) - r * Math.exp(-i * e2) - a,
        (e2) => Math.exp(-i * e2) - Math.exp(-r * e2),
        t
      ) / t;
    };
    scope.on = function on(e, t) {
      return e * Math.sqrt(1 - t * t);
    };
    scope.cn = function cn(e, t, n) {
      let r = n;
      for (let n2 = 1; n2 < scope.sn; n2++) r -= e(r) / t(r);
      return r;
    };
    scope.un = function un({ duration: e = scope.K.duration, bounce: t = scope.K.bounce }) {
      let n, r;
      scope.K.maxDuration;
      let i = (0, scope.rn)(t);
      e = (0, scope.re)(scope.K.minDuration, scope.K.maxDuration, (0, scope.z)(e)), i < 1 ? (n = (t2) => {
        let n2 = t2 * i, r2 = n2 * e, a2 = (0, scope.on)(t2, i), o2 = Math.exp(-r2);
        return scope.ln - n2 / a2 * o2;
      }, r = (t2) => {
        let r2 = t2 * i * e, a2 = i * i * t2 * t2 * e, o2 = Math.exp(-r2), s2 = (0, scope.on)(t2 * t2, i);
        return (-n(t2) + scope.ln > 0 ? -1 : 1) * -a2 * o2 / s2;
      }) : (n = (t2) => -1e-3 + Math.exp(-t2 * e) * (t2 * e + 1), r = (t2) => Math.exp(-t2 * e) * (-t2 * (e * e)));
      let a = 5 / e, o = (0, scope.cn)(n, r, a), s = o * (0, scope.an)(i, o * e), c2 = s * s;
      return { stiffness: c2, damping: i * 2 * Math.sqrt(c2), duration: (0, scope.R)(e) };
    };
    scope.fn = function fn(e, t) {
      if ((0, scope.dn)(e, t)) return e;
    };
    scope.pn = function pn(e) {
      let t = (0, scope.fn)(e.stiffness), n = (0, scope.fn)(e.damping, true), r = (0, scope.fn)(e.mass), i = {
        ...e,
        stiffness: t ?? scope.K.stiffness,
        damping: n ?? scope.K.damping,
        mass: r ?? scope.K.mass,
        isResolvedFromDuration: false,
        isTimeDefined: (t ?? n ?? r) === void 0 && (e.duration !== void 0 || e.bounce !== void 0)
      };
      if (i.isTimeDefined) {
        if (e.visualDuration) {
          let t2 = (0, scope.rn)(e.bounce || 0), n2 = 2 * Math.PI / (e.visualDuration * 1.2) * (0, scope.an)(t2, 2 * Math.PI / 1.2);
          i.stiffness = n2 * n2, i.damping = 2 * t2 * Math.sqrt(i.stiffness);
        } else Object.assign(i, (0, scope.un)(i)), i.isResolvedFromDuration = true;
        (!(0, scope.dn)(i.stiffness) || !(0, scope.dn)(i.damping, true)) && (i.stiffness = scope.K.stiffness, i.damping = scope.K.damping);
      }
      return i;
    };
    scope.mn = function mn(e = scope.K.visualDuration, t = scope.K.bounce) {
      let n = typeof e == `object` ? e : { visualDuration: e, keyframes: [0, 1], bounce: t }, r = n.keyframes[0], i = n.keyframes[n.keyframes.length - 1], a = { done: false, value: r }, {
        stiffness: o,
        damping: s,
        mass: c2,
        duration: l,
        isResolvedFromDuration: u,
        isTimeDefined: d
      } = (0, scope.pn)({ ...n }), f2 = (e2) => d ? 0 : -(0, scope.z)(e2), p = s / (2 * Math.sqrt(o * c2)), m = (0, scope.z)(Math.sqrt(o / c2)), h = p * m, g = {
        target: i,
        delta: i - r,
        velocity: f2(n.velocity || 0) || 0,
        restSpeed: 0,
        restDelta: 0
      }, _ = () => {
        let e2 = Math.abs(g.delta) < 5;
        g.restSpeed = n.restSpeed || (e2 ? scope.K.restSpeed.granular : scope.K.restSpeed.default), g.restDelta = n.restDelta || (e2 ? scope.K.restDelta.granular : scope.K.restDelta.default);
      };
      _();
      let v2, y, b;
      if (p < 1) {
        let e2 = (0, scope.on)(m, p), t2 = { A: 0, sinC: 0, cosC: 0, t: -1, env: 0, sin: 0, cos: 0 };
        b = () => {
          t2.A = (g.velocity + h * g.delta) / e2, t2.sinC = h * t2.A + g.delta * e2, t2.cosC = h * g.delta - t2.A * e2;
        };
        let n2 = (n3) => {
          n3 !== t2.t && (t2.t = n3, t2.env = Math.exp(-h * n3), t2.sin = Math.sin(e2 * n3), t2.cos = Math.cos(e2 * n3));
        };
        v2 = (e3) => (n2(e3), g.target - t2.env * (t2.A * t2.sin + g.delta * t2.cos)), y = (e3) => (n2(e3), t2.env * (t2.sinC * t2.sin + t2.cosC * t2.cos));
      } else if (p === 1) {
        v2 = (e3) => g.target - Math.exp(-m * e3) * (g.delta + (g.velocity + m * g.delta) * e3);
        let e2 = { C: 0 };
        b = () => {
          e2.C = g.velocity + m * g.delta;
        }, y = (t2) => Math.exp(-m * t2) * (m * e2.C * t2 - g.velocity);
      } else {
        let e2 = m * Math.sqrt(p * p - 1), t2 = h - e2, n2 = h + e2, r2 = d ? 1 / 0 : 300 / e2, i2 = (e3, t3) => Math.exp(t3 > r2 ? -e3 * r2 - h * (t3 - r2) : -e3 * t3), a2 = { S: 0, F: 0 };
        b = () => {
          let t3 = (g.velocity + h * g.delta) / e2;
          a2.S = (g.delta + t3) / 2, a2.F = (g.delta - t3) / 2;
        }, v2 = (e3) => g.target - a2.S * i2(t2, e3) - a2.F * i2(n2, e3), y = (e3) => t2 * a2.S * i2(t2, e3) + n2 * a2.F * i2(n2, e3);
      }
      b();
      let x = u && l || null, S = {
        calculatedDuration: x,
        retarget: (e2, t2) => {
          g.target = e2[e2.length - 1], g.delta = g.target - e2[0], g.velocity = f2(t2), n.restSpeed && n.restDelta || _(), S.calculatedDuration = x, a.done = false, b();
        },
        velocity: (e2) => (0, scope.R)(y(e2)),
        next: (e2) => {
          let t2 = v2(e2);
          if (u) a.done = e2 >= l;
          else {
            let n2 = (0, scope.R)(y(e2));
            a.done = Math.abs(n2) <= g.restSpeed && Math.abs(g.target - t2) <= g.restDelta;
          }
          return a.value = a.done ? g.target : t2, a;
        },
        toString: () => {
          let e2 = Math.min((0, scope.tn)(S), scope.en), t2 = (0, scope.$t)((t3) => S.next(e2 * t3).value, e2, 30);
          return e2 + `ms ` + t2;
        },
        toTransition: () => {
        }
      };
      return S;
    };
    scope.hn = function hn({
      keyframes: e,
      velocity: t = 0,
      power: n = 0.8,
      timeConstant: r = 325,
      bounceDamping: i = 10,
      bounceStiffness: a = 500,
      modifyTarget: o,
      min: s,
      max: c2,
      restDelta: l = 0.5,
      restSpeed: u
    }) {
      let d = e[0], f2 = { done: false, value: d }, p = (e2) => e2 < s || e2 > c2, m = (e2) => s === void 0 ? c2 : c2 === void 0 || Math.abs(s - e2) < Math.abs(c2 - e2) ? s : c2, h = n * t, g = d + h, _ = o === void 0 ? g : o(g);
      _ !== g && (h = _ - d);
      let v2 = (e2) => -h * Math.exp(-e2 / r), y = (e2) => {
        let t2 = v2(e2);
        f2.done = Math.abs(t2) <= l, f2.value = f2.done ? _ : _ + t2;
      }, b, x, S = (e2) => {
        p(f2.value) && (b = e2, x = (0, scope.mn)({
          keyframes: [f2.value, m(f2.value)],
          velocity: -v2(e2) / r * 1e3,
          damping: i,
          stiffness: a,
          restDelta: l,
          restSpeed: u
        }));
      };
      return S(0), {
        calculatedDuration: null,
        next: (e2) => {
          let t2 = false;
          return !x && b === void 0 && (t2 = true, y(e2), S(e2)), b !== void 0 && e2 >= b ? x.next(e2 - b) : (!t2 && y(e2), f2);
        }
      };
    };
    scope.gn = function gn(e, t, n) {
      let r = [], i = n || scope.ie.mix || scope.Gt, a = e.length - 1;
      for (let n2 = 0; n2 < a; n2++) {
        let a2 = i(e[n2], e[n2 + 1]);
        t && (a2 = (0, scope.L)(Array.isArray(t) ? t[n2] || scope.se : t, a2)), r.push(a2);
      }
      return r;
    };
    scope._n = function _n(e, t, { clamp: n = true, ease: r, mixer: i } = {}) {
      let a = e.length;
      if (t.length, a === 1) return () => t[0];
      if (a === 2 && t[0] === t[1]) return () => t[1];
      let o = e[0] === e[1];
      e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
      let s = (0, scope.gn)(t, r, i), c2 = s.length, l = (n2) => {
        if (o && n2 < e[0]) return t[0];
        let r2 = 0;
        if (c2 > 1) for (; r2 < e.length - 2 && !(n2 < e[r2 + 1]); r2++) ;
        let i2 = (0, scope.ce)(e[r2], e[r2 + 1], n2);
        return s[r2](i2);
      };
      return n ? (t2) => l((0, scope.re)(e[0], e[a - 1], t2)) : l;
    };
    scope.vn = function vn(e, t) {
      let n = e[e.length - 1];
      for (let r = 1; r <= t; r++) {
        let i = (0, scope.ce)(0, t, r);
        e.push((0, scope.W)(n, 1, i));
      }
    };
    scope.yn = function yn(e) {
      let t = [0];
      return (0, scope.vn)(t, e.length - 1), t;
    };
    scope.bn = function bn(e, t) {
      return e.map((e2) => e2 * t);
    };
    scope.xn = function xn(e, t) {
      return e.map(() => t || scope.De).splice(0, e.length - 1);
    };
    scope.Sn = function Sn({ duration: e = 300, keyframes: t, times: n, ease: r = `easeInOut` }) {
      let i = (0, scope.Oe)(r) ? r.map(scope.Me) : (0, scope.Me)(r) || scope.De, a = { done: false, value: t[0] };
      if (t.length === 2 && !Array.isArray(i) && (!n || n.length !== 2 || n[0] === 0 && n[1] === 1)) {
        let [n2, r2] = t, o2 = n2 === r2 ? void 0 : (scope.ie.mix || scope.Gt)(n2, r2);
        return {
          calculatedDuration: e,
          next: (t2) => (a.value = o2 ? o2(i(e > 0 ? (0, scope.re)(0, 1, t2 / e) : 1)) : r2, a.done = t2 >= e, a)
        };
      }
      let o = (0, scope._n)(
        (0, scope.bn)(n && n.length === t.length ? n : (0, scope.yn)(t), e),
        t,
        {
          ease: Array.isArray(i) ? i : (0, scope.xn)(t, i)
        }
      );
      return { calculatedDuration: e, next: (t2) => (a.value = o(t2), a.done = t2 >= e, a) };
    };
    scope.wn = function wn(e, t, n) {
      let r = Math.max(t - scope.Cn, 0);
      return (0, scope.ue)(n - e(r), t - r);
    };
    scope.Tn = function Tn(e, t, n = 0) {
      return t <= 0 ? n : e.velocity ? e.velocity(t) : (0, scope.wn)((t2) => e.next(t2).value, t, e.next(t).value);
    };
    scope.Dn = function Dn(e, { repeat: t, repeatType: n = `loop` }, r, i = 1) {
      let a = e.filter(scope.En), o = i < 0 || t && n !== `loop` && t % 2 == 1 ? 0 : a.length - 1;
      return !o || r === void 0 ? a[o] : r;
    };
    scope.kn = function kn(e) {
      typeof e.type == `string` && (e.type = scope.On[e.type]);
    };
    scope.An = function An(e, t) {
      return {
        kind: e,
        animation: t,
        timestamp: scope.V.now(),
        frameTimestamp: scope.B.timestamp,
        frameIsProcessing: scope.B.isProcessing
      };
    };
    scope.jn = function jn(e, t, n) {
      let r = globalThis.__MOTION_INSPECT__;
      if (r)
        try {
          r({ ...(0, scope.An)(`animation-start`, e), options: n ? { ...t, ...n } : t });
        } catch {
        }
    };
    scope.Mn = function Mn(e, t) {
      let n = globalThis.__MOTION_INSPECT__;
      if (n)
        try {
          n({ ...(0, scope.An)(`layout-animation-start`, e), node: t });
        } catch {
        }
    };
    scope.Ln = function Ln(e) {
      let [t, n] = e.slice(0, -1).split(`(`);
      if (t === `drop-shadow`) return e;
      let [r] = n.match(scope.Ge) || [];
      if (!r) return e;
      let i = n.replace(r, ``), a = +!!scope.In.has(t);
      return r !== n && (a *= 100), t + `(` + a + i + `)`;
    };
    scope.Kn = function Kn(e, t) {
      let n = (0, scope.Wn)(e);
      return scope.Gn.has(n) || (n = scope.Et), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0;
    };
    scope.qn = function qn(e) {
      for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
    };
    scope.nr = function nr(e) {
      return +!!e.includes(`scale`);
    };
    scope.rr = function rr(e, t) {
      if (!e || e === `none`) return (0, scope.nr)(t);
      let n = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u), r, i;
      if (n) r = scope.tr, i = n;
      else {
        let t2 = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
        r = scope.Xn, i = t2;
      }
      if (!i) return (0, scope.nr)(t);
      let a = r[t], o = i[1].split(`,`).map(scope.ar);
      return typeof a == `function` ? a(o) : o[a];
    };
    scope.ar = function ar(e) {
      return parseFloat(e.trim());
    };
    scope.dr = function dr(e) {
      let t = [];
      return scope.ur.forEach((n) => {
        let r = e.getValue(n);
        if (r !== void 0) {
          let e2 = r.get(), i = +!!n.startsWith(`scale`);
          if (e2 === i) return;
          t.push([n, e2]), r.set(i);
        }
      }), t;
    };
    scope.pr = function pr(e, t, n, r, i, a) {
      let o = parseFloat(e);
      if (!isNaN(o)) return o;
      let { min: s, max: c2 } = t()[n], l = c2 - s;
      return a === `border-box` ? l : l - parseFloat(r) - parseFloat(i);
    };
    scope.yr = function yr() {
      if (scope._r) {
        let e = [], t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
        scope.hr.forEach((r2) => {
          r2.needsMeasurement && (e.push(r2), t.add(r2.element), scope.fr.has(r2.name) && n.add(r2.element));
        });
        let r = /* @__PURE__ */ new Map();
        n.forEach((e2) => {
          let t2 = (0, scope.dr)(e2);
          t2.length && (r.set(e2, t2), e2.render());
        }), e.forEach((e2) => e2.measureInitialState()), t.forEach((e2) => {
          e2.render();
          let t2 = r.get(e2);
          t2 && t2.forEach(([t3, n2]) => {
            e2.getValue(t3)?.set(n2);
          });
        }), e.forEach((e2) => e2.measureEndState()), e.forEach((e2) => {
          e2.suspendedScrollY !== void 0 && window.scrollTo(0, e2.suspendedScrollY);
        });
      }
      scope._r = false, scope.gr = false, scope.hr.forEach((e) => e.complete(scope.vr)), scope.hr.clear();
    };
    scope.br = function br() {
      scope.hr.forEach((e) => {
        e.readKeyframes(), e.needsMeasurement && (scope._r = true);
      });
    };
    scope.xr = function xr() {
      scope.vr = true, (0, scope.br)(), (0, scope.yr)(), scope.vr = false;
    };
    scope.Sr = function Sr(e, t, n) {
      if (typeof e == `string`) {
        if ((0, scope.ae)(e) || (0, scope.I)(e)) return parseFloat(e);
        if (!scope.Et.test(e) && scope.Et.test(n)) return (0, scope.Kn)(t, n);
      }
      return e ?? void 0;
    };
    scope.Tr = function Tr(e, t, n) {
      (0, scope.wr)(t) ? e.style.setProperty(t, n) : e.style[t] = n;
    };
    scope.Dr = function Dr(e, t) {
      let n = (0, scope.oe)(e);
      return () => scope.Er[t] ?? n();
    };
    scope.Mr = function Mr(e, t) {
      if (e)
        return typeof e == `function` ? (0, scope.kr)() ? (0, scope.$t)(e, t) : `ease-out` : (0, scope.ke)(e) ? (0, scope.Ar)(e) : Array.isArray(e) ? e.map((e2) => (0, scope.Mr)(e2, t) || scope.jr.easeOut) : scope.jr[e];
    };
    scope.Nr = function Nr(e, t, n, {
      delay: r = 0,
      duration: i = 300,
      repeat: a = 0,
      repeatType: o = `loop`,
      ease: s = `easeOut`,
      times: c2
    } = {}, l = void 0) {
      let u = { [t]: n };
      c2 && (u.offset = c2);
      let d = (0, scope.Mr)(s, i);
      Array.isArray(d) && (u.easing = d);
      let f2 = {
        delay: r,
        duration: i,
        easing: Array.isArray(d) ? `linear` : d,
        fill: `both`,
        iterations: a + 1,
        direction: o === `reverse` ? `alternate` : `normal`
      };
      return l && (f2.pseudoElement = l), e.animate(u, f2);
    };
    scope.Pr = function Pr(e) {
      return typeof e == `function` && `applyToOptions` in e;
    };
    scope.Fr = function Fr({ type: e, ...t }) {
      return (0, scope.Pr)(e) && (0, scope.kr)() ? e.applyToOptions(t) : (t.duration ??= 300, t.ease ??= `easeOut`, t);
    };
    scope.Rr = function Rr(e) {
      return e in scope.Lr;
    };
    scope.zr = function zr(e) {
      typeof e.ease == `string` && (0, scope.Rr)(e.ease) && (e.ease = scope.Lr[e.ease]);
    };
    scope.Ur = function Ur(e) {
      let t = e[0];
      if (e.length === 1) return true;
      for (let n = 0; n < e.length; n++) if (e[n] !== t) return true;
    };
    scope.Wr = function Wr(e, t, n, r) {
      let i = e[0];
      if (i === null) return false;
      if (t === `display` || t === `visibility`) return true;
      let a = e[e.length - 1], o = (0, scope.Hr)(i, t), s = (0, scope.Hr)(a, t);
      return !o || !s ? (o !== s && `${t}${i}${a}${o ? a : i}`, false) : (0, scope.Ur)(e) || (n === `spring` || (0, scope.Pr)(n)) && r;
    };
    scope.Gr = function Gr(e) {
      e.duration = 0, e.type = `keyframes`;
    };
    scope.Jr = function Jr(e) {
      for (let t = 0; t < e.length; t++)
        if (typeof e[t] == `string` && scope.qr.test(e[t])) return true;
      return false;
    };
    scope.Zr = function Zr(e) {
      let {
        motionValue: t,
        name: n,
        repeatDelay: r,
        repeatType: i,
        damping: a,
        type: o,
        keyframes: s
      } = e;
      if (!n || !(scope.Kr.has(n) || scope.Yr.has(n))) return false;
      let c2 = t?.owner?.current;
      if (!(c2 instanceof HTMLElement) && !(c2 instanceof SVGElement)) return false;
      let { onUpdate: l, transformTemplate: u } = t.owner.getProps();
      return (0, scope.Xr)() && (scope.Kr.has(n) || scope.Yr.has(n) && (0, scope.Jr)(s)) && (n !== `transform` || !u) && !l && !r && i !== `mirror` && a !== 0 && o !== `inertia`;
    };
    scope.ei = function ei(e, t, n, r = 0, i = 1) {
      let a = Array.from(e).sort((e2, t2) => e2.sortNodePosition(t2)).indexOf(t), o = e.size, s = (o - 1) * r;
      return typeof n == `function` ? n(a, o) : i === 1 ? a * r : s - a * r;
    };
    scope.ai = function ai(e, t) {
      return new scope.ii(e, t);
    };
    scope.oi = function oi(e, t) {
      if (e?.inherit && t) {
        let { inherit: n, ...r } = e;
        return { ...t, ...r };
      }
      return e;
    };
    scope.si = function si(e, t) {
      let n = e?.[t] ?? e?.default ?? e;
      return n === e ? n : (0, scope.oi)(n, e);
    };
    scope.mi = function mi(e) {
      for (let t in e) if (!scope.pi.has(t)) return true;
      return false;
    };
    scope._i = function _i(e) {
      let t = scope.gi.exec(e);
      if (!t) return [,];
      let [, n, r, i] = t;
      return [`--${n ?? r}`, i];
    };
    scope.vi = function vi(e, t, n = 1) {
      `${e}`;
      let [r, i] = (0, scope._i)(e);
      if (!r) return;
      let a = window.getComputedStyle(t).getPropertyValue(r);
      if (a) {
        let e2 = a.trim();
        return (0, scope.ae)(e2) ? parseFloat(e2) : e2;
      }
      return (0, scope.ze)(i) ? (0, scope.vi)(i, t, n + 1) : i;
    };
    scope.yi = function yi(e) {
      let t = [{}, {}];
      return e?.values.forEach((e2, n) => {
        t[0][n] = e2.get(), t[1][n] = e2.getVelocity();
      }), t;
    };
    scope.bi = function bi(e, t, n, r) {
      let i = (t2) => typeof t2 == `function` ? t2(n === void 0 ? e.custom : n, ...(0, scope.yi)(r)) : t2;
      return t = i(t), typeof t == `string` && (t = e.variants && e.variants[t]), i(t);
    };
    scope.xi = function xi(e, t, n) {
      return (0, scope.bi)(e.getProps(), t, n, e);
    };
    scope.Ti = function Ti(e, t, n) {
      e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, (0, scope.ai)(n));
    };
    scope.Ei = function Ei(e) {
      return (0, scope.wi)(e) ? e[e.length - 1] || 0 : e;
    };
    scope.Di = function Di(e, t) {
      let { transitionEnd: n = {}, transition: r = {}, ...i } = (0, scope.xi)(e, t) || {};
      i = { ...i, ...n };
      for (let t2 in i) (0, scope.Ti)(e, t2, (0, scope.Ei)(i[t2]));
    };
    scope.Oi = function Oi(e) {
      return !!((0, scope.q)(e) && e.add);
    };
    scope.ki = function ki(e, t) {
      let n = e.getValue(`willChange`);
      if ((0, scope.Oi)(n)) return n.add(t);
      if (!n && scope.ie.WillChange) {
        let n2 = new scope.ie.WillChange(`auto`);
        e.addValue(`willChange`, n2), n2.add(t);
      }
    };
    scope.Ai = function Ai(e) {
      return e.replace(/([A-Z])/g, (e2) => `-${e2.toLowerCase()}`);
    };
    scope.Mi = function Mi(e) {
      return e.props[scope.ji];
    };
    scope.Pi = function Pi({ protectedKeys: e, needsAnimating: t }, n) {
      let r = n in e && !t[n];
      return t[n] = false, r;
    };
    scope.Fi = function Fi(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
      let { transition: a, transitionEnd: o, ...s } = t, c2 = e.getDefaultTransition();
      a = a ? (0, scope.oi)(a, c2) : c2;
      let l = a?.reduceMotion, u = a?.skipAnimations;
      r && (a = r);
      let d = [], f2 = i && e.animationState?.getState()[i], p = a?.path;
      p && p.animateVisualElement(e, s, a, n, d);
      for (let t2 in s) {
        let r2 = e.getValue(t2, e.latestValues[t2] ?? null), i2 = s[t2];
        if (i2 === void 0 || f2 && (0, scope.Pi)(f2, t2)) continue;
        let o2 = { delay: n, ...(0, scope.si)(a || {}, t2) };
        u && (o2.skipAnimations = true);
        let c3 = r2.get();
        if (c3 !== void 0 && !r2.isAnimating() && !Array.isArray(i2) && i2 === c3 && !o2.velocity) {
          scope.G.update(() => r2.set(i2));
          continue;
        }
        let p2 = false;
        if (scope.Ni && window.MotionHandoffAnimation) {
          let n2 = (0, scope.Mi)(e);
          if (n2) {
            let e2 = window.MotionHandoffAnimation(n2, t2, scope.G);
            e2 !== null && (o2.startTime = e2, p2 = true);
          }
        }
        (0, scope.ki)(e, t2);
        let m = l ?? e.shouldReduceMotion;
        r2.start((0, scope.hi)(t2, r2, i2, m && scope.Ci.has(t2) ? { type: false } : o2, e, p2));
        let h = r2.animation;
        h && d.push(h);
      }
      if (o) {
        let t2 = () => scope.G.update(() => {
          o && (0, scope.Di)(e, o);
        });
        d.length ? Promise.all(d).then(t2) : t2();
      }
      return d;
    };
    scope.Ii = function Ii(e, t, n = {}) {
      let r = (0, scope.xi)(e, t, (0, scope.Si)(e, n.type)), i = n.transitionOverride || (r?.transition ?? (e.getDefaultTransition() || {})), a = () => Promise.all(r ? (0, scope.Fi)(e, r, n) : []), o = (r2 = 0) => {
        let { variantChildren: a2 } = e, { delayChildren: o2 = 0, staggerChildren: s2, staggerDirection: c2 } = i, l = [];
        return a2?.forEach((e2) => {
          e2.notify(`AnimationStart`, t), l.push(
            (0, scope.Ii)(e2, t, {
              ...n,
              delay: r2 + (typeof o2 == `function` ? 0 : o2) + (0, scope.ei)(a2, e2, o2, s2, c2)
            }).then(() => e2.notify(`AnimationComplete`, t))
          );
        }), Promise.all(l);
      }, { when: s } = i;
      return s ? s === `beforeChildren` ? a().then(() => o()) : o().then(a) : Promise.all([a(), o(n.delay)]);
    };
    scope.Li = function Li(e, t, n = {}) {
      return e.notify(`AnimationStart`, t), (Array.isArray(t) ? Promise.all(t.map((t2) => (0, scope.Ii)(e, t2, n))) : typeof t == `string` ? (0, scope.Ii)(e, t, n) : Promise.all((0, scope.Fi)(e, (0, scope.xi)(e, t, n.custom), n))).then(() => {
        e.notify(`AnimationComplete`, t);
      });
    };
    scope.Hi = function Hi(e) {
      return typeof e == `number` ? e === 0 : e === null || e === `none` || e === `0` || (0, scope.I)(e);
    };
    scope.Wi = function Wi(e, t, n) {
      let r = 0, i;
      for (; r < e.length && !i; ) {
        let t2 = e[r];
        typeof t2 == `string` && !scope.Ui.has(t2) && (0, scope.vt)(t2) && (i = e[r]), r++;
      }
      if (i && n) for (let r2 of t) e[r2] !== i && (e[r2] = (0, scope.Kn)(n, i));
    };
    scope.qi = function qi(e) {
      return (0, scope.F)(e) && `offsetHeight` in e && !(`ownerSVGElement` in e);
    };
    scope.Ji = function Ji(e) {
      return (0, scope.F)(e) && `ownerSVGElement` in e;
    };
    scope.Xi = function Xi(e, t, n) {
      if (e == null) return [];
      if (e instanceof EventTarget) return [e];
      if (typeof e == `string`) {
        let r = document;
        t && (r = t.current);
        let i = n?.[e] ?? r.querySelectorAll(e);
        return i ? Array.from(i) : [];
      }
      return Array.from(e).filter((e2) => e2 != null);
    };
    scope.$i = function $i(e, t, n) {
      let r = ``, i = true;
      for (let a2 = 0; a2 < scope.Qi; a2++) {
        let o = scope.or[a2], s = e[o];
        if (s === void 0) continue;
        let c2 = true;
        if (typeof s == `number`) c2 = s === +!!o.startsWith(`scale`);
        else {
          let e2 = parseFloat(s);
          c2 = o.startsWith(`scale`) ? e2 === 1 : e2 === 0;
        }
        if (!c2 || n) {
          let e2 = (0, scope.Yi)(s, scope.Hn[o]);
          if (!c2) {
            i = false;
            let t2 = scope.Zi[o] || o;
            r += `${t2}(${e2}) `;
          }
          n && (t[o] = e2);
        }
      }
      let a = e.pathRotation;
      return a && (i = false, r += `rotate(${(0, scope.Yi)(a, scope.Hn.pathRotation)}) `), r = r.trim(), n ? r = n(t, i ? `` : r) : i && (r = `none`), r;
    };
    scope.ea = function ea(e, t, n) {
      let { style: r, vars: i, transformOrigin: a } = e, o = false, s = false;
      for (let e2 in t) {
        let n2 = t[e2];
        if (scope.sr.has(e2)) o = true;
        else if ((0, scope.Le)(e2)) i[e2] = n2;
        else {
          let t2 = (0, scope.Yi)(n2, scope.Hn[e2]);
          e2.startsWith(`origin`) ? (s = true, a[e2] = t2) : r[e2] = t2;
        }
      }
      if (t.transform || (o || n ? r.transform = (0, scope.$i)(t, e.transform, n) : r.transform &&= `none`), s) {
        let { originX: e2 = `50%`, originY: t2 = `50%`, originZ: n2 = 0 } = a;
        r.transformOrigin = `${e2} ${t2} ${n2}`;
      }
    };
    scope.ra = function ra(e, t, n = 1, r = 0, i = true) {
      e.pathLength = 1;
      let a = i ? scope.ta : scope.na;
      e[a.offset] = `${-r}`, e[a.array] = `${t} ${n}`;
    };
    scope.aa = function aa(e, {
      attrX: t,
      attrY: n,
      attrScale: r,
      pathLength: i,
      pathSpacing: a = 1,
      pathOffset: o = 0,
      ...s
    }, c2, l, u) {
      if ((0, scope.ea)(e, s, l), c2) {
        e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
        return;
      }
      e.attrs = e.style, e.style = {};
      let { attrs: d, style: f2 } = e;
      for (let e2 of scope.ia) d[e2] !== void 0 && (f2[e2] = d[e2], delete d[e2]);
      (f2.transform || d.transformOrigin) && (f2.transformOrigin = d.transformOrigin ?? `50% 50%`, delete d.transformOrigin), f2.transform && (f2.transformBox = u?.transformBox ?? `fill-box`, delete d.transformBox), t !== void 0 && (d.x = t), n !== void 0 && (d.y = n), r !== void 0 && (d.scale = r), i !== void 0 && (0, scope.ra)(d, i, a, o, false);
    };
    scope.oa = function oa({ top: e, left: t, right: n, bottom: r }) {
      return { x: { min: t, max: n }, y: { min: e, max: r } };
    };
    scope.sa = function sa({ x: e, y: t }) {
      return { top: t.min, right: e.max, bottom: t.max, left: e.min };
    };
    scope.ca = function ca(e, t) {
      if (!t) return e;
      let n = t({ x: e.left, y: e.top }), r = t({ x: e.right, y: e.bottom });
      return { top: n.y, left: n.x, bottom: r.y, right: r.x };
    };
    scope.la = function la(e) {
      return e === void 0 || e === 1;
    };
    scope.ua = function ua({ scale: e, scaleX: t, scaleY: n }) {
      return !(0, scope.la)(e) || !(0, scope.la)(t) || !(0, scope.la)(n);
    };
    scope.da = function da(e) {
      return (0, scope.ua)(e) || (0, scope.fa)(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
    };
    scope.fa = function fa(e) {
      return (0, scope.pa)(e.x) || (0, scope.pa)(e.y);
    };
    scope.pa = function pa(e) {
      return e && e !== `0%`;
    };
    scope.ma = function ma(e, t, n) {
      return n + t * (e - n);
    };
    scope.ha = function ha(e, t, n, r, i) {
      return i !== void 0 && (e = (0, scope.ma)(e, i, r)), (0, scope.ma)(e, n, r) + t;
    };
    scope.ga = function ga(e, t = 0, n = 1, r, i) {
      e.min = (0, scope.ha)(e.min, t, n, r, i), e.max = (0, scope.ha)(e.max, t, n, r, i);
    };
    scope._a = function _a(e, { x: t, y: n }) {
      (0, scope.ga)(e.x, t.translate, t.scale, t.originPoint), (0, scope.ga)(e.y, n.translate, n.scale, n.originPoint);
    };
    scope.ba = function ba(e, t, n, r = false) {
      let i = n.length;
      if (!i) return;
      t.x = t.y = 1;
      let a, o;
      for (let s = 0; s < i; s++) {
        a = n[s], o = a.projectionDelta;
        let { visualElement: i2 } = a.options;
        i2 && i2.props.style && i2.props.style.display === `contents` || (r && a.options.layoutScroll && a.scroll && a !== a.root && ((0, scope.xa)(e.x, -a.scroll.offset.x), (0, scope.xa)(e.y, -a.scroll.offset.y)), o && (t.x *= o.x.scale, t.y *= o.y.scale, (0, scope._a)(e, o)), r && (0, scope.da)(a.latestValues) && (0, scope.wa)(e, a.latestValues, a.layout?.layoutBox));
      }
      t.x < scope.ya && t.x > scope.va && (t.x = 1), t.y < scope.ya && t.y > scope.va && (t.y = 1);
    };
    scope.xa = function xa(e, t) {
      e.min += t, e.max += t;
    };
    scope.Sa = function Sa(e, t, n, r, i = 0.5) {
      (0, scope.ga)(e, t, n, (0, scope.W)(e.min, e.max, i), r);
    };
    scope.Ca = function Ca(e, t) {
      return typeof e == `string` ? parseFloat(e) / 100 * (t.max - t.min) : e;
    };
    scope.wa = function wa(e, t, n) {
      let r = n ?? e;
      (0, scope.Sa)(e.x, (0, scope.Ca)(t.x, r.x), t.scaleX, t.scale, t.originX), (0, scope.Sa)(e.y, (0, scope.Ca)(t.y, r.y), t.scaleY, t.scale, t.originY);
    };
    scope.Ta = function Ta(e, t) {
      return (0, scope.oa)((0, scope.ca)(e.getBoundingClientRect(), t));
    };
    scope.Ea = function Ea(e, t, n) {
      let r = (0, scope.Ta)(e, n), { scroll: i } = t;
      return i && ((0, scope.xa)(r.x, i.offset.x), (0, scope.xa)(r.y, i.offset.y)), r;
    };
    scope.Aa = function Aa() {
      return scope.ka.x || scope.ka.y;
    };
    scope.ja = function ja(e) {
      return e === `x` || e === `y` ? scope.ka[e] ? null : (scope.ka[e] = true, () => {
        scope.ka[e] = false;
      }) : scope.ka.x || scope.ka.y ? null : (scope.ka.x = scope.ka.y = true, () => {
        scope.ka.x = scope.ka.y = false;
      });
    };
    scope.Ma = function Ma(e, t) {
      let n = (0, scope.Xi)(e), r = new AbortController();
      return [n, { passive: true, ...t, signal: r.signal }, () => r.abort()];
    };
    scope.Na = function Na(e) {
      return !(e.pointerType === `touch` || (0, scope.Aa)());
    };
    scope.Pa = function Pa(e, t, n = {}) {
      let [r, i, a] = (0, scope.Ma)(e, n);
      return r.forEach((e2) => {
        let n2 = false, r2 = false, a2, o = () => {
          e2.removeEventListener(`pointerleave`, u);
        }, s = (e3) => {
          a2 &&= (a2(e3), void 0), o();
        }, c2 = (e3) => {
          n2 = false, window.removeEventListener(`pointerup`, c2), window.removeEventListener(`pointercancel`, c2), r2 && (r2 = false, s(e3));
        }, l = () => {
          n2 = true, window.addEventListener(`pointerup`, c2, i), window.addEventListener(`pointercancel`, c2, i);
        }, u = (e3) => {
          e3.pointerType !== `touch` && (n2 ? r2 = true : s(e3));
        };
        e2.addEventListener(
          `pointerenter`,
          (n3) => {
            if (!(0, scope.Na)(n3)) return;
            r2 = false;
            let o2 = t(e2, n3);
            typeof o2 == `function` && (a2 = o2, e2.addEventListener(`pointerleave`, u, i));
          },
          i
        ), e2.addEventListener(`pointerdown`, l, i);
      }), a;
    };
    scope.Ra = function Ra(e) {
      return scope.La.has(e.tagName) || e.isContentEditable === true;
    };
    scope.Ba = function Ba(e) {
      return scope.za.has(e.tagName) || e.isContentEditable === true;
    };
    scope.Ha = function Ha(e) {
      return (t) => {
        t.key === `Enter` && e(t);
      };
    };
    scope.Ua = function Ua(e, t) {
      e.dispatchEvent(new PointerEvent(`pointer` + t, { isPrimary: true, bubbles: true }));
    };
    scope.Ga = function Ga(e) {
      return (0, scope.Ia)(e) && !(0, scope.Aa)();
    };
    scope.qa = function qa(e, t, n = {}) {
      let [r, i, a] = (0, scope.Ma)(e, n), o = (e2) => {
        let r2 = e2.currentTarget;
        if (!(0, scope.Ga)(e2) || scope.Ka.has(e2)) return;
        scope.Va.add(r2), n.stopPropagation && scope.Ka.add(e2);
        let a2 = t(r2, e2), o2 = { ...i, capture: true }, s = (e3, t2) => {
          window.removeEventListener(`pointerup`, c2, o2), window.removeEventListener(`pointercancel`, l, o2), scope.Va.has(r2) && scope.Va.delete(r2), (0, scope.Ga)(e3) && typeof a2 == `function` && a2(e3, { success: t2 });
        }, c2 = (e3) => {
          s(
            e3,
            r2 === window || r2 === document || n.useGlobalTarget || (0, scope.Fa)(r2, e3.target)
          );
        }, l = (e3) => {
          s(e3, false);
        };
        window.addEventListener(`pointerup`, c2, o2), window.addEventListener(`pointercancel`, l, o2);
      };
      return r.forEach((e2) => {
        (n.useGlobalTarget ? window : e2).addEventListener(`pointerdown`, o, i), (0, scope.qi)(e2) && (e2.addEventListener(`focus`, (e3) => (0, scope.Wa)(e3, i)), !(0, scope.Ra)(e2) && !e2.hasAttribute(`tabindex`) && (e2.tabIndex = 0));
      }), a;
    };
    scope.$a = function $a({ target: e, borderBoxSize: t }) {
      scope.Ja.get(e)?.forEach((n) => {
        n(e, {
          get width() {
            return (0, scope.Za)(e, t);
          },
          get height() {
            return (0, scope.Qa)(e, t);
          }
        });
      });
    };
    scope.eo = function eo(e) {
      e.forEach(scope.$a);
    };
    scope.to = function to() {
      typeof ResizeObserver < `u` && (scope.Ya = new ResizeObserver(scope.eo));
    };
    scope.no = function no(e, t) {
      scope.Ya || (0, scope.to)();
      let n = (0, scope.Xi)(e);
      return n.forEach((e2) => {
        let n2 = scope.Ja.get(e2);
        n2 || (n2 = /* @__PURE__ */ new Set(), scope.Ja.set(e2, n2)), n2.add(t), scope.Ya?.observe(e2);
      }), () => {
        n.forEach((e2) => {
          let n2 = scope.Ja.get(e2);
          n2?.delete(t), n2?.size || scope.Ya?.unobserve(e2);
        });
      };
    };
    scope.ao = function ao() {
      scope.io = () => {
        let e = {
          get width() {
            return window.innerWidth;
          },
          get height() {
            return window.innerHeight;
          }
        };
        scope.ro.forEach((t) => t(e));
      }, window.addEventListener(`resize`, scope.io);
    };
    scope.oo = function oo(e) {
      return scope.ro.add(e), scope.io || (0, scope.ao)(), () => {
        scope.ro.delete(e), !scope.ro.size && typeof scope.io == `function` && (window.removeEventListener(`resize`, scope.io), scope.io = void 0);
      };
    };
    scope.so = function so(e, t) {
      return typeof e == `function` ? (0, scope.oo)(e) : (0, scope.no)(e, t);
    };
    scope.lo = function lo(e) {
      return (0, scope.Ji)(e) && e.tagName === `svg`;
    };
    scope.go = function go(e) {
      return typeof e == `object` && !!e && typeof e.start == `function`;
    };
    scope._o = function _o(e) {
      return typeof e == `string` || Array.isArray(e);
    };
    scope.bo = function bo(e) {
      if ((0, scope.go)(e.animate)) return true;
      for (let t = 0; t < scope.yo.length; t++) if ((0, scope._o)(e[scope.yo[t]])) return true;
      return false;
    };
    scope.xo = function xo(e) {
      return !!((0, scope.bo)(e) || e.variants);
    };
    scope.So = function So(e, t, n) {
      for (let r in t) {
        let i = t[r], a = n[r];
        if ((0, scope.q)(i)) e.addValue(r, i);
        else if ((0, scope.q)(a)) e.addValue(r, (0, scope.ai)(i, { owner: e }));
        else if (a !== i) {
          if (e.hasValue(r)) {
            let t2 = e.getValue(r);
            t2.liveStyle === true ? t2.jump(i) : t2.hasAnimated || t2.set(i);
          } else {
            let t2 = e.getStaticValue(r);
            e.addValue(r, (0, scope.ai)(t2 === void 0 ? i : t2, { owner: e }));
          }
        }
      }
      for (let r in n) t[r] === void 0 && e.removeValue(r);
      return t;
    };
    scope.Eo = function Eo() {
      if (scope.wo.current = true, scope.To) {
        if (window.matchMedia) {
          let e = window.matchMedia(`(prefers-reduced-motion)`), t = () => scope.Co.current = e.matches;
          e.addEventListener(`change`, t), t();
        } else scope.Co.current = false;
      }
    };
    scope.ko = function ko(e) {
      scope.Oo = e;
    };
    scope.Ao = function Ao() {
      return scope.Oo;
    };
    scope.Po = function Po(e, { style: t, vars: n }, r, i) {
      let a = e.style, o;
      for (o in t) a[o] = t[o];
      for (o in i?.applyProjectionStyles(a, r), n) a.setProperty(o, n[o]);
    };
    scope.Io = function Io(e, { layout: t, layoutId: n }) {
      return scope.sr.has(e) || e.startsWith(`origin`) || (t || n !== void 0) && (!!scope.Fo[e] || e === `opacity`);
    };
    scope.Lo = function Lo(e, t, n) {
      let r = e.style, i = t?.style, a = {};
      if (!r) return a;
      for (let t2 in r)
        ((0, scope.q)(r[t2]) || i && (0, scope.q)(i[t2]) || (0, scope.Io)(t2, e) || n?.getValue(t2)?.liveStyle !== void 0) && (a[t2] = r[t2]);
      return a;
    };
    scope.Ro = function Ro(e) {
      return window.getComputedStyle(e);
    };
    scope.Ho = function Ho(e, t, n, r) {
      (0, scope.Po)(e, t, void 0, r);
      for (let n2 in t.attrs) e.setAttribute(scope.Bo.has(n2) ? n2 : (0, scope.Ai)(n2), t.attrs[n2]);
    };
    scope.Uo = function Uo(e, t, n) {
      let r = (0, scope.Lo)(e, t, n);
      for (let n2 in e)
        if ((0, scope.q)(e[n2]) || (0, scope.q)(t[n2])) {
          let t2 = scope.or.indexOf(n2) === -1 ? n2 : `attr` + n2.charAt(0).toUpperCase() + n2.substring(1);
          r[t2] = e[n2];
        }
      return r;
    };
    scope.Go = function Go(e, t) {
      if (!Array.isArray(t)) return false;
      let n = t.length;
      if (n !== e.length) return false;
      for (let r = 0; r < n; r++) if (t[r] !== e[r]) return false;
      return true;
    };
    scope.qo = function qo(e) {
      let t = (t2) => Promise.all(t2.map(({ animation: t3, options: n2 }) => (0, scope.Li)(e, t3, n2))), n = (0, scope.Yo)(), r = true, i = false;
      function a(a2) {
        let { props: o2, parent: s, manuallyAnimateOnMount: c2 } = e, l = r || i, u = [], d = /* @__PURE__ */ new Set(), f2 = {}, p = 1 / 0, m = e;
        do
          m = m.props.inherit !== false && m.parent;
        while (m && !m.isControllingVariants);
        if (scope.Ko.forEach((t2, r2) => {
          let i2 = n[t2], h2 = o2[t2], g = m && m.props[t2], _ = h2 === void 0 ? (0, scope._o)(g) || g === false ? g : void 0 : h2, v2 = (0, scope._o)(_), y = t2 === a2 ? i2.isActive : null;
          y === false && (p = r2);
          let b = v2 && h2 === void 0 && !(l && c2);
          if (i2.protectedKeys = { ...f2 }, !i2.isActive && y === null || !_ && !i2.prevProp || (0, scope.go)(_) || typeof _ == `boolean`)
            return;
          if (t2 === `exit` && i2.isActive && y !== true) {
            f2 = { ...f2, ...i2.prevResolvedValues };
            return;
          }
          let x = (0, scope.Jo)(i2.prevProp, _), S = x || v2 && (y && !b || r2 > p), C2 = false, w2 = Array.isArray(_) ? _ : [_], T = {};
          if (y !== false)
            for (let n2 of w2) {
              let {
                transition: r3,
                transitionEnd: i3,
                ...a3
              } = (0, scope.xi)(e, n2, (0, scope.Si)(e, t2)) || {};
              T = { ...T, ...a3, ...i3 };
            }
          let { prevResolvedValues: E } = i2;
          for (let t3 in { ...E, ...T }) {
            if (t3 in f2) continue;
            let n2 = T[t3], r3 = E[t3], a3 = Array.isArray(n2) && Array.isArray(r3) ? !(0, scope.Go)(n2, r3) || x : n2 !== r3;
            if (a3 && n2 == null) d.add(t3);
            else if (a3 || n2 !== void 0 && d.has(t3)) {
              S = true, d.delete(t3) && (C2 = true), i2.needsAnimating[t3] = true;
              let n3 = e.getValue(t3);
              n3 && (n3.liveStyle = false);
            } else i2.protectedKeys[t3] = true;
          }
          if (i2.prevProp = _, i2.prevResolvedValues = T, i2.isActive && (f2 = { ...f2, ...T }), S && (!(b && x) || C2))
            for (let n2 of w2) {
              let r3 = { type: t2 };
              if (typeof n2 == `string` && l && c2 && s?.enteringChildren) {
                let t3 = (0, scope.xi)(s, n2)?.transition?.delayChildren;
                r3.delay = (0, scope.ei)(s.enteringChildren, e, t3);
              }
              u.push({ animation: n2, options: r3 });
            }
        }), d.size) {
          let { initial: t2 } = o2, n2 = {}, r2 = typeof t2 != `boolean` && (0, scope.xi)(e, Array.isArray(t2) ? t2[0] : t2, e.presenceContext?.custom);
          r2 && r2.transition && (n2.transition = r2.transition), d.forEach((i2) => {
            let a3 = e.getValue(i2);
            a3 && (a3.liveStyle = true);
            let s2 = r2 && !Array.isArray(t2) ? r2[i2] : void 0, c3 = e.getBaseTargetFromProps(o2, i2);
            n2[i2] = (s2 === void 0 ? c3 !== void 0 && !(0, scope.q)(c3) ? c3 : e.initialValues[i2] === void 0 ? e.baseTarget[i2] : void 0 : s2) ?? null;
          }), u.push({ animation: n2 });
        }
        let h = l && e.blockInitialAnimation || r && !c2 && (o2.initial === false || o2.initial === o2.animate);
        return r = i = false, !h && u.length ? t(u) : Promise.resolve();
      }
      function o(t2, r2) {
        if (n[t2].isActive === r2) return Promise.resolve();
        e.variantChildren?.forEach((e2) => e2.animationState?.setActive(t2, r2)), n[t2].isActive = r2;
        let i2 = a(t2);
        for (let e2 in n) n[e2].protectedKeys = {};
        return i2;
      }
      return {
        animateChanges: a,
        setActive: o,
        setAnimateFunction: (n2) => {
          t = n2(e);
        },
        getState: () => n,
        reset: () => {
          n = (0, scope.Yo)(), i = true;
        }
      };
    };
    scope.Jo = function Jo(e, t) {
      return typeof t == `string` ? t !== e : Array.isArray(t) ? !(0, scope.Go)(t, e) : false;
    };
    scope.Yo = function Yo() {
      let e = {};
      for (let t of scope.vo)
        e[t] = {
          isActive: t === `animate`,
          protectedKeys: {},
          needsAnimating: {},
          prevResolvedValues: {}
        };
      return e;
    };
    scope.Xo = function Xo(e, t) {
      e.min = t.min, e.max = t.max;
    };
    scope.Zo = function Zo(e, t) {
      (0, scope.Xo)(e.x, t.x), (0, scope.Xo)(e.y, t.y);
    };
    scope.Qo = function Qo(e, t) {
      e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
    };
    scope.rs = function rs(e) {
      return e.max - e.min;
    };
    scope.is = function is(e, t, n) {
      return Math.abs(e - t) <= n;
    };
    scope.as = function as(e, t, n, r = 0.5) {
      e.origin = r, e.originPoint = (0, scope.W)(t.min, t.max, e.origin), e.scale = (0, scope.rs)(n) / (0, scope.rs)(t), e.translate = (0, scope.W)(n.min, n.max, e.origin) - e.originPoint, (e.scale >= scope.$o && e.scale <= scope.es || isNaN(e.scale)) && (e.scale = 1), (e.translate >= scope.ts && e.translate <= scope.ns || isNaN(e.translate)) && (e.translate = 0);
    };
    scope.os = function os(e, t, n, r) {
      (0, scope.as)(e.x, t.x, n.x, r ? r.originX : void 0), (0, scope.as)(e.y, t.y, n.y, r ? r.originY : void 0);
    };
    scope.ss = function ss(e, t, n, r = 0) {
      e.min = (r ? (0, scope.W)(n.min, n.max, r) : n.min) + t.min, e.max = e.min + (0, scope.rs)(t);
    };
    scope.cs = function cs(e, t, n, r) {
      (0, scope.ss)(e.x, t.x, n.x, r?.x), (0, scope.ss)(e.y, t.y, n.y, r?.y);
    };
    scope.ls = function ls(e, t, n, r = 0) {
      let i = r ? (0, scope.W)(n.min, n.max, r) : n.min;
      e.min = t.min - i, e.max = e.min + (0, scope.rs)(t);
    };
    scope.us = function us(e, t, n, r) {
      (0, scope.ls)(e.x, t.x, n.x, r?.x), (0, scope.ls)(e.y, t.y, n.y, r?.y);
    };
    scope.ds = function ds(e, t, n, r, i) {
      return e -= t, e = (0, scope.ma)(e, 1 / n, r), i !== void 0 && (e = (0, scope.ma)(e, 1 / i, r)), e;
    };
    scope.fs = function fs(e, t = 0, n = 1, r = 0.5, i, a = e, o = e) {
      if (scope.rt.test(t) && (t = parseFloat(t), t = (0, scope.W)(o.min, o.max, t / 100) - o.min), typeof t != `number`)
        return;
      let s = (0, scope.W)(a.min, a.max, r);
      e === a && (s -= t), e.min = (0, scope.ds)(e.min, t, n, s, i), e.max = (0, scope.ds)(e.max, t, n, s, i);
    };
    scope.ps = function ps(e, t, [n, r, i], a, o) {
      (0, scope.fs)(e, t[n], t[r], t[i], t.scale, a, o);
    };
    scope.gs = function gs(e, t, n, r) {
      (0, scope.ps)(e.x, t, scope.ms, n ? n.x : void 0, r ? r.x : void 0), (0, scope.ps)(e.y, t, scope.hs, n ? n.y : void 0, r ? r.y : void 0);
    };
    scope._s = function _s(e) {
      return e.translate === 0 && e.scale === 1;
    };
    scope.vs = function vs(e) {
      return (0, scope._s)(e.x) && (0, scope._s)(e.y);
    };
    scope.ys = function ys(e, t) {
      return e.min === t.min && e.max === t.max;
    };
    scope.bs = function bs(e, t) {
      return (0, scope.ys)(e.x, t.x) && (0, scope.ys)(e.y, t.y);
    };
    scope.xs = function xs(e, t) {
      return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
    };
    scope.Ss = function Ss(e, t) {
      return (0, scope.xs)(e.x, t.x) && (0, scope.xs)(e.y, t.y);
    };
    scope.Cs = function Cs(e) {
      return (0, scope.rs)(e.x) / (0, scope.rs)(e.y);
    };
    scope.ws = function ws(e, t) {
      return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
    };
    scope.Ts = function Ts(e) {
      return [e(`x`), e(`y`)];
    };
    scope.Es = function Es(e, t) {
      return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
    };
    scope.ks = function ks(e, t, n) {
      let r = ``, i = e.x.translate / t.x, a = e.y.translate / t.y, o = n?.z || 0;
      if ((i || a || o) && (r = `translate3d(${i}px, ${a}px, ${o}px) `), (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `), n) {
        let {
          transformPerspective: e2,
          rotate: t2,
          pathRotation: i2,
          rotateX: a2,
          rotateY: o2,
          skewX: s2,
          skewY: c3
        } = n;
        e2 && (r = `perspective(${e2}px) ${r}`), t2 && (r += `rotate(${t2}deg) `), i2 && (r += `rotate(${i2}deg) `), a2 && (r += `rotateX(${a2}deg) `), o2 && (r += `rotateY(${o2}deg) `), s2 && (r += `skewX(${s2}deg) `), c3 && (r += `skewY(${c3}deg) `);
      }
      let s = e.x.scale * t.x, c2 = e.y.scale * t.y;
      return (s !== 1 || c2 !== 1) && (r += `scale(${s}, ${c2})`), r || `none`;
    };
    scope.Ms = function Ms(e, t, n, r, i, a) {
      i ? (e.opacity = (0, scope.W)(0, n.opacity ?? 1, (0, scope.Ps)(r)), e.opacityExit = (0, scope.W)(t.opacity ?? 1, 0, (0, scope.Fs)(r))) : a && (e.opacity = (0, scope.W)(t.opacity ?? 1, n.opacity ?? 1, r));
      for (let i2 = 0; i2 < scope.As; i2++) {
        let a2 = scope.Ki[i2], o = (0, scope.Ns)(t, a2), s = (0, scope.Ns)(n, a2);
        (o !== void 0 || s !== void 0) && (o ||= 0, s ||= 0, o === 0 || s === 0 || (0, scope.js)(o) === (0, scope.js)(s) ? (e[a2] = Math.max((0, scope.W)((0, scope.uo)(o), (0, scope.uo)(s), r), 0), (scope.rt.test(s) || scope.rt.test(o)) && (e[a2] += `%`)) : e[a2] = s);
      }
      (t.rotate || n.rotate) && (e.rotate = (0, scope.W)(t.rotate || 0, n.rotate || 0, r));
    };
    scope.Ns = function Ns(e, t) {
      return e[t] === void 0 ? e.borderRadius : e[t];
    };
    scope.Is = function Is(e, t, n) {
      return (r) => r < e ? 0 : r > t ? 1 : n((0, scope.ce)(e, t, r));
    };
    scope.Ls = function Ls(e, t, n) {
      let r = (0, scope.q)(e) ? e : (0, scope.ai)(e);
      return r.start((0, scope.hi)(``, r, t, n)), r.animation;
    };
    scope.Rs = function Rs(e, t, n, r = { passive: true }) {
      return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
    };
    scope.Vs = function Vs(e, t) {
      let n = scope.V.now(), r = ({ timestamp: i }) => {
        let a = i - n;
        a >= t && ((0, scope.Xt)(r), e(a - t));
      };
      return scope.G.setup(r, true), () => (0, scope.Xt)(r);
    };
    scope.Hs = function Hs(e) {
      return (0, scope.q)(e) ? e.get() : e;
    };
    scope.Xs = function Xs(e, t, n, r) {
      let { latestValues: i } = t;
      i[e] && (n[e] = i[e], t.setStaticValue(e, 0), r && (r[e] = 0));
    };
    scope.Zs = function Zs(e) {
      if (e.hasCheckedOptimisedAppear = true, e.root === e) return;
      let { visualElement: t } = e.options;
      if (!t) return;
      let n = (0, scope.Mi)(t);
      if (window.MotionHasOptimisedAnimation(n, `transform`)) {
        let { layout: t2, layoutId: r2 } = e.options;
        window.MotionCancelOptimisedAnimation(n, `transform`, scope.G, !(t2 || r2));
      }
      let { parent: r } = e;
      r && !r.hasCheckedOptimisedAppear && (0, scope.Zs)(r);
    };
    scope.Qs = function Qs({
      attachResizeListener: e,
      defaultParent: t,
      measureScroll: n,
      checkIsScrollRoot: r,
      resetTransform: i
    }) {
      return class {
        constructor(e2 = {}, n2 = t?.()) {
          this.id = scope.Ys++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = false, this.isAnimationBlocked = false, this.isLayoutDirty = false, this.isProjectionDirty = false, this.isSharedProjectionDirty = false, this.isTransformDirty = false, this.updateManuallyBlocked = false, this.updateBlockedByResize = false, this.isUpdating = false, this.isSVG = false, this.needsReset = false, this.shouldResetTransform = false, this.hasCheckedOptimisedAppear = false, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = false, this.updateScheduled = false, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = false, this.checkUpdateFailed = () => {
            this.isUpdating && (this.isUpdating = false, this.clearAllSnapshots());
          }, this.updateProjection = () => {
            this.projectionUpdateScheduled = false, scope.co.value && (scope.Ks.nodes = scope.Ks.calculatedTargetDeltas = scope.Ks.calculatedProjections = 0), this.nodes.forEach(scope.tc), this.nodes.forEach(scope.dc), this.nodes.forEach(scope.fc), this.nodes.forEach(scope.nc), scope.co.addProjectionMetrics && scope.co.addProjectionMetrics(scope.Ks);
          }, this.resolvedRelativeTargetAt = 0, this.hasProjected = false, this.isVisible = true, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = e2, this.root = n2 ? n2.root || n2 : this, this.path = n2 ? [...n2.path, n2] : [], this.parent = n2, this.depth = n2 ? n2.depth + 1 : 0;
          for (let e3 = 0; e3 < this.path.length; e3++) this.path[e3].shouldResetTransform = true;
          this.root === this && (this.nodes = new scope.Bs());
        }
        addEventListener(e2, t2) {
          return this.eventHandlers.has(e2) || this.eventHandlers.set(e2, new scope.le()), this.eventHandlers.get(e2).add(t2);
        }
        notifyListeners(e2, ...t2) {
          let n2 = this.eventHandlers.get(e2);
          n2 && n2.notify(...t2);
        }
        hasListeners(e2) {
          return this.eventHandlers.has(e2);
        }
        mount(t2) {
          if (this.instance) return;
          this.isSVG = (0, scope.Ji)(t2) && !(0, scope.lo)(t2), this.instance = t2;
          let { layoutId: n2, layout: r2, visualElement: i2 } = this.options;
          if (i2 && !i2.current && i2.mount(t2), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (r2 || n2) && (this.isLayoutDirty = true), e) {
            let n3, r3 = 0, i3 = () => this.root.updateBlockedByResize = false;
            scope.G.read(() => {
              r3 = window.innerWidth;
            }), e(t2, () => {
              let e2 = window.innerWidth;
              e2 !== r3 && (r3 = e2, this.root.updateBlockedByResize = true, n3 && n3(), n3 = (0, scope.Vs)(i3, 250), scope.Gs.hasAnimatedSinceResize && (scope.Gs.hasAnimatedSinceResize = false, this.nodes.forEach(scope.uc)));
            });
          }
          n2 && this.root.registerSharedNode(n2, this), this.options.animate !== false && i2 && (n2 || r2) && this.addEventListener(
            `didUpdate`,
            ({ delta: e2, hasLayoutChanged: t3, hasRelativeLayoutChanged: n3, layout: r3 }) => {
              if (this.isTreeAnimationBlocked()) {
                this.target = void 0, this.relativeTarget = void 0;
                return;
              }
              let a = this.options.transition || i2.getDefaultTransition() || scope.yc, { onLayoutAnimationStart: o, onLayoutAnimationComplete: s } = i2.getProps(), c2 = !this.targetLayout || !(0, scope.Ss)(this.targetLayout, r3), l = !t3 && n3;
              if (this.options.layoutRoot || this.resumeFrom || l || t3 && (c2 || !this.currentAnimation)) {
                this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
                let t4 = { ...(0, scope.si)(a, `layout`), onPlay: o, onComplete: s };
                (i2.shouldReduceMotion || this.options.layoutRoot) && (t4.delay = 0, t4.type = false), this.startAnimation(t4), this.setAnimationOrigin(e2, l, t4.path);
              } else
                t3 || (0, scope.uc)(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
              this.targetLayout = r3;
            }
          );
        }
        unmount() {
          this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
          let e2 = this.getStack();
          e2 && e2.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), (0, scope.Xt)(this.updateProjection);
        }
        blockUpdate() {
          this.updateManuallyBlocked = true;
        }
        unblockUpdate() {
          this.updateManuallyBlocked = false;
        }
        isUpdateBlocked() {
          return this.updateManuallyBlocked || this.updateBlockedByResize;
        }
        isTreeAnimationBlocked() {
          return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
        }
        startUpdate() {
          this.isUpdateBlocked() || (this.isUpdating = true, this.nodes && this.nodes.forEach(scope.pc), this.animationId++);
        }
        getTransformTemplate() {
          let { visualElement: e2 } = this.options;
          return e2 && e2.getProps().transformTemplate;
        }
        willUpdate(e2 = true) {
          if (this.root.hasTreeAnimated = true, this.root.isUpdateBlocked()) {
            this.options.onExitComplete && this.options.onExitComplete();
            return;
          }
          if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && (0, scope.Zs)(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
            return;
          this.isLayoutDirty = true;
          for (let e3 = 0; e3 < this.path.length; e3++) {
            let t3 = this.path[e3];
            t3.shouldResetTransform = true, (typeof t3.latestValues.x == `string` || typeof t3.latestValues.y == `string`) && (t3.isLayoutDirty = true), t3.updateScroll(`snapshot`), t3.options.layoutRoot && t3.willUpdate(false);
          }
          let { layoutId: t2, layout: n2 } = this.options;
          if (t2 === void 0 && !n2) return;
          let r2 = this.getTransformTemplate();
          this.prevTransformTemplateValue = r2 ? r2(this.latestValues, ``) : void 0, this.updateSnapshot(), e2 && this.notifyListeners(`willUpdate`);
        }
        update() {
          if (this.updateScheduled = false, this.isUpdateBlocked()) {
            let e3 = this.updateBlockedByResize;
            this.unblockUpdate(), this.updateBlockedByResize = false, this.clearAllSnapshots(), e3 && this.nodes.forEach(scope.ac), this.nodes.forEach(scope.ic);
            return;
          }
          if (this.animationId <= this.animationCommitId) {
            this.nodes.forEach(scope.oc);
            return;
          }
          this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = false, this.nodes.forEach(scope.sc), this.nodes.forEach(scope.cc), this.nodes.forEach(scope.lc), this.nodes.forEach(scope.$s), this.nodes.forEach(scope.ec)) : this.nodes.forEach(scope.oc), this.clearAllSnapshots();
          let e2 = scope.V.now();
          scope.B.delta = (0, scope.re)(0, 1e3 / 60, e2 - scope.B.timestamp), scope.B.timestamp = e2, scope.B.isProcessing = true, scope.Zt.update.process(scope.B), scope.Zt.preRender.process(scope.B), scope.Zt.render.process(scope.B), scope.B.isProcessing = false;
        }
        didUpdate() {
          this.updateScheduled || (this.updateScheduled = true, scope.Da.read(this.scheduleUpdate));
        }
        clearAllSnapshots() {
          this.nodes.forEach(scope.rc), this.sharedNodes.forEach(scope.mc);
        }
        scheduleUpdateProjection() {
          this.projectionUpdateScheduled || (this.projectionUpdateScheduled = true, scope.G.preRender(this.updateProjection, false, true));
        }
        scheduleCheckAfterUnmount() {
          scope.G.postRender(() => {
            this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
          });
        }
        updateSnapshot() {
          !this.snapshot && this.instance && (this.snapshot = this.measure(), this.snapshot && !(0, scope.rs)(this.snapshot.measuredBox.x) && !(0, scope.rs)(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
        }
        updateLayout() {
          if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
            return;
          if (this.resumeFrom && !this.resumeFrom.instance)
            for (let e3 = 0; e3 < this.path.length; e3++) this.path[e3].updateScroll();
          let e2 = this.layout;
          this.layout = this.measure(false), this.layoutCorrected ||= (0, scope.J)(), this.isLayoutDirty = false, this.projectionDelta = void 0, this.notifyListeners(`measure`, this.layout.layoutBox);
          let { visualElement: t2 } = this.options;
          t2 && t2.notify(`LayoutMeasure`, this.layout.layoutBox, e2 ? e2.layoutBox : void 0);
        }
        updateScroll(e2 = `measure`) {
          let t2 = !!(this.options.layoutScroll && this.instance);
          if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === e2 && (t2 = false), t2 && this.instance) {
            let t3 = r(this.instance);
            this.scroll = {
              animationId: this.root.animationId,
              phase: e2,
              isRoot: t3,
              offset: n(this.instance),
              wasRoot: this.scroll ? this.scroll.isRoot : t3
            };
          }
        }
        resetTransform() {
          if (!i) return;
          let e2 = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, t2 = this.projectionDelta && !(0, scope.vs)(this.projectionDelta), n2 = this.getTransformTemplate(), r2 = n2 ? n2(this.latestValues, ``) : void 0, a = r2 !== this.prevTransformTemplateValue;
          e2 && this.instance && (t2 || (0, scope.da)(this.latestValues) || a) && (i(this.instance, r2), this.shouldResetTransform = false, this.scheduleRender());
        }
        measure(e2 = true) {
          let t2 = this.measurePageBox(), n2 = this.removeElementScroll(t2);
          return e2 && (n2 = this.removeTransform(n2)), (0, scope.Cc)(n2), {
            animationId: this.root.animationId,
            measuredBox: t2,
            layoutBox: n2,
            latestValues: {},
            source: this.id
          };
        }
        measurePageBox() {
          let { visualElement: e2 } = this.options;
          if (!e2) return (0, scope.J)();
          let t2 = e2.measureViewportBox();
          if (!(this.scroll?.wasRoot || this.path.some(scope.Tc))) {
            let { scroll: e3 } = this.root;
            e3 && ((0, scope.xa)(t2.x, e3.offset.x), (0, scope.xa)(t2.y, e3.offset.y));
          }
          return t2;
        }
        removeElementScroll(e2) {
          let t2 = (0, scope.J)();
          if ((0, scope.Zo)(t2, e2), this.scroll?.wasRoot) return t2;
          for (let n2 = 0; n2 < this.path.length; n2++) {
            let r2 = this.path[n2], { scroll: i2, options: a } = r2;
            r2 !== this.root && i2 && a.layoutScroll && (i2.wasRoot && (0, scope.Zo)(t2, e2), (0, scope.xa)(t2.x, i2.offset.x), (0, scope.xa)(t2.y, i2.offset.y));
          }
          return t2;
        }
        applyTransform(e2, t2 = false, n2) {
          let r2 = n2 || (0, scope.J)();
          (0, scope.Zo)(r2, e2);
          for (let e3 = 0; e3 < this.path.length; e3++) {
            let n3 = this.path[e3];
            !t2 && n3.options.layoutScroll && n3.scroll && n3 !== n3.root && ((0, scope.xa)(r2.x, -n3.scroll.offset.x), (0, scope.xa)(r2.y, -n3.scroll.offset.y)), (0, scope.da)(n3.latestValues) && (0, scope.wa)(r2, n3.latestValues, n3.layout?.layoutBox);
          }
          return (0, scope.da)(this.latestValues) && (0, scope.wa)(r2, this.latestValues, this.layout?.layoutBox), r2;
        }
        removeTransform(e2) {
          let t2 = (0, scope.J)();
          (0, scope.Zo)(t2, e2);
          for (let e3 = 0; e3 < this.path.length; e3++) {
            let n2 = this.path[e3];
            if (!(0, scope.da)(n2.latestValues)) continue;
            let r2;
            n2.instance && ((0, scope.ua)(n2.latestValues) && n2.updateSnapshot(), r2 = (0, scope.J)(), (0, scope.Zo)(r2, n2.measurePageBox())), (0, scope.gs)(t2, n2.latestValues, n2.snapshot?.layoutBox, r2);
          }
          return (0, scope.da)(this.latestValues) && (0, scope.gs)(t2, this.latestValues), t2;
        }
        setTargetDelta(e2) {
          this.targetDelta = e2, this.root.scheduleUpdateProjection(), this.isProjectionDirty = true;
        }
        setOptions(e2) {
          this.options = {
            ...this.options,
            ...e2,
            crossfade: e2.crossfade === void 0 || e2.crossfade
          };
        }
        clearMeasurements() {
          this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = false;
        }
        forceRelativeParentToResolveTarget() {
          this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== scope.B.timestamp && this.relativeParent.resolveTargetDelta(true);
        }
        resolveTargetDelta(e2 = false) {
          let t2 = this.getLead();
          this.isProjectionDirty ||= t2.isProjectionDirty, this.isTransformDirty ||= t2.isTransformDirty, this.isSharedProjectionDirty ||= t2.isSharedProjectionDirty;
          let n2 = !!this.resumingFrom || this !== t2;
          if (!(e2 || n2 && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
            return;
          let { layout: r2, layoutId: i2 } = this.options;
          if (!this.layout || !(r2 || i2)) return;
          this.resolvedRelativeTargetAt = scope.B.timestamp;
          let a = this.getClosestProjectingParent();
          !this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== false && a && a.layout ? this.createRelativeTarget(a, this.layout.layoutBox, a.layout.layoutBox) : this.removeRelativeTarget()), (this.relativeTarget || this.targetDelta) && (this.target || (this.target = (0, scope.J)(), this.targetWithTransforms = (0, scope.J)()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), (0, scope.cs)(
            this.target,
            this.relativeTarget,
            this.relativeParent.target,
            this.options.layoutAnchor || void 0
          )) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, false, this.target) : (0, scope.Zo)(this.target, this.layout.layoutBox), (0, scope._a)(this.target, this.targetDelta)) : (0, scope.Zo)(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = false, this.options.layoutAnchor !== false && a && !!a.resumingFrom == !!this.resumingFrom && !a.options.layoutScroll && a.target && this.animationProgress !== 1 ? this.createRelativeTarget(a, this.target, a.target) : this.relativeParent = this.relativeTarget = void 0), scope.co.value && scope.Ks.calculatedTargetDeltas++);
        }
        getClosestProjectingParent() {
          if (!(!this.parent || (0, scope.ua)(this.parent.latestValues) || (0, scope.fa)(this.parent.latestValues)))
            return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
        }
        isProjecting() {
          return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
        }
        createRelativeTarget(e2, t2, n2) {
          this.relativeParent = e2, this.forceRelativeParentToResolveTarget(), this.relativeTarget = (0, scope.J)(), this.relativeTargetOrigin = (0, scope.J)(), (0, scope.us)(this.relativeTargetOrigin, t2, n2, this.options.layoutAnchor || void 0), (0, scope.Zo)(this.relativeTarget, this.relativeTargetOrigin);
        }
        removeRelativeTarget() {
          this.relativeParent = this.relativeTarget = void 0;
        }
        calcProjection() {
          let e2 = this.getLead(), t2 = !!this.resumingFrom || this !== e2, n2 = true;
          if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n2 = false), t2 && (this.isSharedProjectionDirty || this.isTransformDirty) && (n2 = false), this.resolvedRelativeTargetAt === scope.B.timestamp && (n2 = false), n2)
            return;
          let { layout: r2, layoutId: i2 } = this.options;
          if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(r2 || i2))
            return;
          (0, scope.Zo)(this.layoutCorrected, this.layout.layoutBox);
          let a = this.treeScale.x, o = this.treeScale.y;
          (0, scope.ba)(this.layoutCorrected, this.treeScale, this.path, t2), e2.layout && !e2.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (e2.target = e2.layout.layoutBox, e2.targetWithTransforms = (0, scope.J)());
          let { target: s } = e2;
          s ? (!this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : ((0, scope.Qo)(this.prevProjectionDelta.x, this.projectionDelta.x), (0, scope.Qo)(this.prevProjectionDelta.y, this.projectionDelta.y)), (0, scope.os)(this.projectionDelta, this.layoutCorrected, s, this.latestValues), (this.treeScale.x !== a || this.treeScale.y !== o || !(0, scope.ws)(this.projectionDelta.x, this.prevProjectionDelta.x) || !(0, scope.ws)(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = true, this.scheduleRender(), this.notifyListeners(`projectionUpdate`, s)), scope.co.value && scope.Ks.calculatedProjections++) : this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        }
        hide() {
          this.isVisible = false;
        }
        show() {
          this.isVisible = true;
        }
        scheduleRender(e2 = true) {
          if (this.options.visualElement?.scheduleRender(), e2) {
            let e3 = this.getStack();
            e3 && e3.scheduleRender();
          }
          this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
        }
        createProjectionDeltas() {
          this.prevProjectionDelta = (0, scope.po)(), this.projectionDelta = (0, scope.po)(), this.projectionDeltaWithTransform = (0, scope.po)();
        }
        setAnimationOrigin(e2, t2 = false, n2) {
          let r2 = this.snapshot, i2 = r2 ? r2.latestValues : {}, a = { ...this.latestValues }, o = (0, scope.po)();
          (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !t2;
          let s = (0, scope.J)(), c2 = (r2 ? r2.source : void 0) !== (this.layout ? this.layout.source : void 0), l = this.getStack(), u = !l || l.members.length <= 1, d = !(!c2 || u || this.options.crossfade !== true || this.path.some(scope.vc));
          this.animationProgress = 0;
          let f2, p = n2?.interpolateProjection(e2);
          this.mixTargetDelta = (t3) => {
            let n3 = t3 / 1e3, r3 = p?.(n3);
            r3 ? (o.x.translate = r3.x, o.x.scale = (0, scope.W)(e2.x.scale, 1, n3), o.x.origin = e2.x.origin, o.x.originPoint = e2.x.originPoint, o.y.translate = r3.y, o.y.scale = (0, scope.W)(e2.y.scale, 1, n3), o.y.origin = e2.y.origin, o.y.originPoint = e2.y.originPoint) : ((0, scope.hc)(o.x, e2.x, n3), (0, scope.hc)(o.y, e2.y, n3)), this.setTargetDelta(o), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && ((0, scope.us)(
              s,
              this.layout.layoutBox,
              this.relativeParent.layout.layoutBox,
              this.options.layoutAnchor || void 0
            ), (0, scope._c)(this.relativeTarget, this.relativeTargetOrigin, s, n3), f2 && (0, scope.bs)(this.relativeTarget, f2) && (this.isProjectionDirty = false), f2 ||= (0, scope.J)(), (0, scope.Zo)(f2, this.relativeTarget)), c2 && (this.animationValues = a, (0, scope.Ms)(a, i2, this.latestValues, n3, d, u)), r3 && r3.rotate !== void 0 && (this.animationValues ||= a, this.animationValues.pathRotation = r3.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = n3;
          }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
        }
        startAnimation(e2) {
          this.notifyListeners(`animationStart`), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation &&= ((0, scope.Xt)(this.pendingAnimation), void 0), this.pendingAnimation = scope.G.update(() => {
            scope.Gs.hasAnimatedSinceResize = true, this.motionValue ||= (0, scope.ai)(0), this.motionValue.jump(0, false), this.currentAnimation = (0, scope.Ls)(this.motionValue, [0, 1e3], {
              ...e2,
              velocity: 0,
              isSync: true,
              onUpdate: (t2) => {
                this.mixTargetDelta(t2), e2.onUpdate && e2.onUpdate(t2);
              },
              onComplete: () => {
                e2.onComplete && e2.onComplete(), this.completeAnimation();
              }
            }), (0, scope.Mn)(this.currentAnimation, this), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
          });
        }
        completeAnimation() {
          this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
          let e2 = this.getStack();
          e2 && e2.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners(`animationComplete`);
        }
        finishAnimation() {
          this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(scope.Js), this.currentAnimation.stop()), this.completeAnimation();
        }
        applyTransformsToTarget() {
          let e2 = this.getLead(), { targetWithTransforms: t2, layout: n2, latestValues: r2 } = e2, { target: i2 } = e2;
          if (t2 && i2 && n2) {
            if (this !== e2 && this.layout && n2 && (0, scope.wc)(this.options.animationType, this.layout.layoutBox, n2.layoutBox)) {
              i2 = this.target || (0, scope.J)();
              let t3 = (0, scope.rs)(this.layout.layoutBox.x);
              i2.x.min = e2.target.x.min, i2.x.max = i2.x.min + t3;
              let n3 = (0, scope.rs)(this.layout.layoutBox.y);
              i2.y.min = e2.target.y.min, i2.y.max = i2.y.min + n3;
            }
            (0, scope.Zo)(t2, i2), (0, scope.wa)(t2, r2), (0, scope.os)(this.projectionDeltaWithTransform, this.layoutCorrected, t2, r2);
          }
        }
        registerSharedNode(e2, t2) {
          this.sharedNodes.has(e2) || this.sharedNodes.set(e2, new scope.Us()), this.sharedNodes.get(e2).add(t2);
          let n2 = t2.options.initialPromotionConfig;
          t2.promote({
            transition: n2 ? n2.transition : void 0,
            preserveFollowOpacity: n2 && n2.shouldPreserveFollowOpacity ? n2.shouldPreserveFollowOpacity(t2) : void 0
          });
        }
        isLead() {
          let e2 = this.getStack();
          return !e2 || e2.lead === this;
        }
        getLead() {
          let { layoutId: e2 } = this.options;
          return e2 && this.getStack()?.lead || this;
        }
        getPrevLead() {
          let { layoutId: e2 } = this.options;
          return e2 ? this.getStack()?.prevLead : void 0;
        }
        getStack() {
          let { layoutId: e2 } = this.options;
          if (e2) return this.root.sharedNodes.get(e2);
        }
        promote({ needsReset: e2, transition: t2, preserveFollowOpacity: n2 } = {}) {
          let r2 = this.getStack();
          r2 && r2.promote(this, n2), e2 && (this.projectionDelta = void 0, this.needsReset = true), t2 && this.setOptions({ transition: t2 });
        }
        relegate() {
          let e2 = this.getStack();
          return e2 ? e2.relegate(this) : false;
        }
        resetSkewAndRotation() {
          let { visualElement: e2 } = this.options;
          if (!e2) return;
          let t2 = false, { latestValues: n2 } = e2;
          if ((n2.z || n2.rotate || n2.rotateX || n2.rotateY || n2.rotateZ || n2.skewX || n2.skewY) && (t2 = true), !t2)
            return;
          let r2 = {};
          n2.z && (0, scope.Xs)(`z`, e2, r2, this.animationValues);
          for (let t3 = 0; t3 < scope.qs.length; t3++)
            (0, scope.Xs)(`rotate${scope.qs[t3]}`, e2, r2, this.animationValues), (0, scope.Xs)(`skew${scope.qs[t3]}`, e2, r2, this.animationValues);
          e2.render();
          for (let t3 in r2)
            e2.setStaticValue(t3, r2[t3]), this.animationValues && (this.animationValues[t3] = r2[t3]);
          e2.scheduleRender();
        }
        applyProjectionStyles(e2, t2) {
          if (!this.instance || this.isSVG) return;
          if (!this.isVisible) {
            e2.visibility = `hidden`;
            return;
          }
          let n2 = this.getTransformTemplate();
          if (this.needsReset) {
            this.needsReset = false, e2.visibility = ``, e2.opacity = ``, e2.pointerEvents = (0, scope.Hs)(t2?.pointerEvents) || ``, e2.transform = n2 ? n2(this.latestValues, ``) : `none`;
            return;
          }
          let r2 = this.getLead();
          if (!this.projectionDelta || !this.layout || !r2.target) {
            this.options.layoutId && (e2.opacity = this.latestValues.opacity === void 0 ? 1 : this.latestValues.opacity, e2.pointerEvents = (0, scope.Hs)(t2?.pointerEvents) || ``), this.hasProjected && !(0, scope.da)(this.latestValues) && (e2.transform = n2 ? n2({}, ``) : `none`, this.hasProjected = false);
            return;
          }
          e2.visibility = ``;
          let i2 = r2.animationValues || r2.latestValues;
          this.applyTransformsToTarget();
          let a = (0, scope.ks)(this.projectionDeltaWithTransform, this.treeScale, i2);
          n2 && (a = n2(i2, a)), e2.transform = a;
          let { x: o, y: s } = this.projectionDelta;
          e2.transformOrigin = `${o.origin * 100}% ${s.origin * 100}% 0`, e2.opacity = r2.animationValues ? r2 === this ? i2.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : i2.opacityExit : r2 === this ? i2.opacity === void 0 ? `` : i2.opacity : i2.opacityExit === void 0 ? 0 : i2.opacityExit;
          for (let t3 in scope.Fo) {
            if (i2[t3] === void 0) continue;
            let { correct: n3, applyTo: o2, isCSSVariable: s2 } = scope.Fo[t3], c2 = a === `none` ? i2[t3] : n3(i2[t3], r2);
            if (o2) {
              let t4 = o2.length;
              for (let n4 = 0; n4 < t4; n4++) e2[o2[n4]] = c2;
            } else s2 ? this.options.visualElement.renderState.vars[t3] = c2 : e2[t3] = c2;
          }
          this.options.layoutId && (e2.pointerEvents = r2 === this ? (0, scope.Hs)(t2?.pointerEvents) || `` : `none`);
        }
        clearSnapshot() {
          this.resumeFrom = this.snapshot = void 0;
        }
        resetTree() {
          this.root.nodes.forEach((e2) => e2.currentAnimation?.stop()), this.root.nodes.forEach(scope.ic), this.root.sharedNodes.clear();
        }
      };
    };
    scope.$s = function $s(e) {
      e.updateLayout();
    };
    scope.ec = function ec(e) {
      let t = e.resumeFrom?.snapshot || e.snapshot;
      if (e.isLead() && e.layout && t && e.hasListeners(`didUpdate`)) {
        let { layoutBox: n, measuredBox: r } = e.layout, { animationType: i } = e.options, a = t.source !== e.layout.source;
        if (i === `size`)
          (0, scope.Ts)((e2) => {
            let r2 = a ? t.measuredBox[e2] : t.layoutBox[e2], i2 = (0, scope.rs)(r2);
            r2.min = n[e2].min, r2.max = r2.min + i2;
          });
        else if (i === `x` || i === `y`) {
          let e2 = i === `x` ? `y` : `x`;
          (0, scope.Xo)(a ? t.measuredBox[e2] : t.layoutBox[e2], n[e2]);
        } else
          (0, scope.wc)(i, t.layoutBox, n) && (0, scope.Ts)((r2) => {
            let i2 = a ? t.measuredBox[r2] : t.layoutBox[r2], o2 = (0, scope.rs)(n[r2]);
            i2.max = i2.min + o2, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = true, e.relativeTarget[r2].max = e.relativeTarget[r2].min + o2);
          });
        let o = (0, scope.po)();
        (0, scope.os)(o, n, t.layoutBox);
        let s = (0, scope.po)();
        a ? (0, scope.os)(s, e.applyTransform(r, true), t.measuredBox) : (0, scope.os)(s, n, t.layoutBox);
        let c2 = !(0, scope.vs)(o), l = false;
        if (!e.resumeFrom) {
          let r2 = e.getClosestProjectingParent();
          if (r2 && !r2.resumeFrom) {
            let { snapshot: i2, layout: a2 } = r2;
            if (i2 && a2) {
              let o2 = e.options.layoutAnchor || void 0, s2 = (0, scope.J)();
              (0, scope.us)(s2, t.layoutBox, i2.layoutBox, o2);
              let c3 = (0, scope.J)();
              (0, scope.us)(c3, n, a2.layoutBox, o2), (0, scope.Ss)(s2, c3) || (l = true), r2.options.layoutRoot && (e.relativeTarget = c3, e.relativeTargetOrigin = s2, e.relativeParent = r2);
            }
          }
        }
        e.notifyListeners(`didUpdate`, {
          layout: n,
          snapshot: t,
          delta: s,
          layoutDelta: o,
          hasLayoutChanged: c2,
          hasRelativeLayoutChanged: l
        });
      } else if (e.isLead()) {
        let { onExitComplete: t2 } = e.options;
        t2 && t2();
      }
      e.options.transition = void 0;
    };
    scope.tc = function tc(e) {
      scope.co.value && scope.Ks.nodes++, e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty ||= !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty), e.isTransformDirty ||= e.parent.isTransformDirty);
    };
    scope.nc = function nc(e) {
      e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = false;
    };
    scope.rc = function rc(e) {
      e.clearSnapshot();
    };
    scope.ic = function ic(e) {
      e.clearMeasurements();
    };
    scope.ac = function ac(e) {
      e.isLayoutDirty = true, e.updateLayout();
    };
    scope.oc = function oc(e) {
      e.isLayoutDirty = false;
    };
    scope.sc = function sc(e) {
      e.isAnimationBlocked && e.layout && !e.isLayoutDirty && (e.snapshot = e.layout, e.isLayoutDirty = true);
    };
    scope.cc = function cc(e) {
      e.relativeTarget && e.relativeParent?.isLayoutDirty && (e.currentAnimation ? e.isLayoutDirty = true : (e.targetDelta = void 0, e.removeRelativeTarget()));
    };
    scope.lc = function lc(e) {
      let { visualElement: t } = e.options;
      t && t.getProps().onBeforeLayoutMeasure && t.notify(`BeforeLayoutMeasure`), e.resetTransform();
    };
    scope.uc = function uc(e) {
      e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = true;
    };
    scope.dc = function dc(e) {
      e.resolveTargetDelta();
    };
    scope.fc = function fc(e) {
      e.calcProjection();
    };
    scope.pc = function pc(e) {
      e.resetSkewAndRotation();
    };
    scope.mc = function mc(e) {
      e.removeLeadSnapshot();
    };
    scope.hc = function hc(e, t, n) {
      e.translate = (0, scope.W)(t.translate, 0, n), e.scale = (0, scope.W)(t.scale, 1, n), e.origin = t.origin, e.originPoint = t.originPoint;
    };
    scope.gc = function gc(e, t, n, r) {
      e.min = (0, scope.W)(t.min, n.min, r), e.max = (0, scope.W)(t.max, n.max, r);
    };
    scope._c = function _c(e, t, n, r) {
      (0, scope.gc)(e.x, t.x, n.x, r), (0, scope.gc)(e.y, t.y, n.y, r);
    };
    scope.vc = function vc(e) {
      return e.animationValues && e.animationValues.opacityExit !== void 0;
    };
    scope.Sc = function Sc(e) {
      e.min = (0, scope.xc)(e.min), e.max = (0, scope.xc)(e.max);
    };
    scope.Cc = function Cc(e) {
      (0, scope.Sc)(e.x), (0, scope.Sc)(e.y);
    };
    scope.wc = function wc(e, t, n) {
      return e === `position` || e === `preserve-aspect` && !(0, scope.is)((0, scope.Cs)(t), (0, scope.Cs)(n), 0.2);
    };
    scope.Tc = function Tc(e) {
      return e !== e.root && e.scroll?.wasRoot;
    };
    scope.Ac = function Ac(e, t) {
      if (typeof e == `function`) return e(t);
      e != null && (e.current = t);
    };
    scope.jc = function jc(...e) {
      return (t) => {
        let n = false, r = e.map((e2) => {
          let r2 = (0, scope.Ac)(e2, t);
          return !n && typeof r2 == `function` && (n = true), r2;
        });
        if (n)
          return () => {
            for (let t2 = 0; t2 < r.length; t2++) {
              let n2 = r[t2];
              typeof n2 == `function` ? n2() : (0, scope.Ac)(e[t2], null);
            }
          };
      };
    };
    scope.Mc = function Mc(...e) {
      return scope.k.useCallback((0, scope.jc)(...e), e);
    };
    scope.Pc = function Pc({ children: e, isPresent: t, anchorX: n, anchorY: r, root: i, pop: a }) {
      let o = (0, scope.k.useId)(), s = (0, scope.k.useRef)(null), c2 = (0, scope.k.useRef)({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        direction: `ltr`
      }), { nonce: l } = (0, scope.k.useContext)(scope.kc), u = (0, scope.Mc)(s, a === false ? void 0 : e.props?.ref ?? e?.ref);
      return (0, scope.k.useInsertionEffect)(() => {
        let {
          width: e2,
          height: u2,
          top: d,
          left: f2,
          right: p,
          bottom: m,
          direction: h
        } = c2.current;
        if (t || a === false || !s.current || !e2 || !u2) return;
        let g = h === `rtl`, _ = n === `left` ? g ? `right: ${p}` : `left: ${f2}` : g ? `left: ${f2}` : `right: ${p}`, v2 = r === `bottom` ? `bottom: ${m}` : `top: ${d}`;
        s.current.dataset.motionPopId = o;
        let y = document.createElement(`style`);
        l && (y.nonce = l);
        let b = i ?? document.head;
        return b.appendChild(y), y.sheet && y.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${e2}px !important;
            height: ${u2}px !important;
            ${_}px !important;
            ${v2}px !important;
          }
        `), () => {
          s.current?.removeAttribute(`data-motion-pop-id`), b.contains(y) && b.removeChild(y);
        };
      }, [t]), (0, scope.O.jsx)(scope.Nc, {
        isPresent: t,
        childRef: s,
        sizeRef: c2,
        pop: a,
        children: a === false ? e : scope.k.cloneElement(e, { ref: u })
      });
    };
    scope.Ic = function Ic() {
      return /* @__PURE__ */ new Map();
    };
    scope.Lc = function Lc(e = true) {
      let t = (0, scope.k.useContext)(scope.N);
      if (t === null) return [true, null];
      let { isPresent: n, onExitComplete: r, register: i } = t, a = (0, scope.k.useId)();
      (0, scope.k.useEffect)(() => {
        if (e) return i(a);
      }, [e]);
      let o = (0, scope.k.useCallback)(() => e && r && r(a), [a, r, e]);
      return !n && r ? [false, o] : [true];
    };
    scope.zc = function zc(e) {
      let t = [];
      return scope.k.Children.forEach(e, (e2) => {
        (0, scope.k.isValidElement)(e2) && t.push(e2);
      }), t;
    };
    scope.Wc = function Wc() {
      if (scope.Uc) return;
      let e = {};
      for (let t in scope.Hc) e[t] = { isEnabled: (e2) => scope.Hc[t].some((t2) => !!e2[t2]) };
      (0, scope.ko)(e), scope.Uc = true;
    };
    scope.Gc = function Gc() {
      return (0, scope.Wc)(), (0, scope.Ao)();
    };
    scope.Kc = function Kc(e) {
      let t = (0, scope.Gc)();
      for (let n in e) t[n] = { ...t[n], ...e[n] };
      (0, scope.ko)(t);
    };
    scope.Jc = function Jc(e, t) {
      if ((0, scope.bo)(e)) {
        let { initial: t2, animate: n } = e;
        return {
          initial: t2 === false || (0, scope._o)(t2) ? t2 : void 0,
          animate: (0, scope._o)(n) ? n : void 0
        };
      }
      return e.inherit === false ? {} : t;
    };
    scope.Yc = function Yc(e) {
      let { initial: t, animate: n } = (0, scope.Jc)(e, (0, scope.k.useContext)(scope.qc));
      return (0, scope.k.useMemo)(
        () => ({ initial: t, animate: n }),
        [(0, scope.Xc)(t), (0, scope.Xc)(n)]
      );
    };
    scope.Xc = function Xc(e) {
      return Array.isArray(e) ? e.join(` `) : e;
    };
    scope.Qc = function Qc(e, t, n) {
      for (let r in t) !(0, scope.q)(t[r]) && !(0, scope.Io)(r, n) && (e[r] = t[r]);
    };
    scope.$c = function $c({ transformTemplate: e }, t) {
      return (0, scope.k.useMemo)(() => {
        let n = (0, scope.Zc)();
        return (0, scope.ea)(n, t, e), Object.assign({}, n.vars, n.style);
      }, [t]);
    };
    scope.el = function el(e, t) {
      let n = e.style || {}, r = {};
      return (0, scope.Qc)(r, n, e), Object.assign(r, (0, scope.$c)(e, t)), r;
    };
    scope.tl = function tl(e, t) {
      let n = {}, r = (0, scope.el)(e, t);
      return e.drag && e.dragListener !== false && (n.draggable = false, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = `none`, r.touchAction = e.drag === true ? `none` : `pan-${e.drag === `x` ? `y` : `x`}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0), n.style = r, n;
    };
    scope.rl = function rl(e, t, n, r) {
      let i = (0, scope.k.useMemo)(() => {
        let n2 = (0, scope.nl)();
        return (0, scope.aa)(n2, t, (0, scope.Vo)(r), e.transformTemplate, e.style), { ...n2.attrs, style: { ...n2.style } };
      }, [t]);
      if (e.style) {
        let t2 = {};
        (0, scope.Qc)(t2, e.style, e), i.style = { ...t2, ...i.style };
      }
      return i;
    };
    scope.al = function al(e) {
      return e.startsWith(`while`) || e.startsWith(`drag`) && e !== `draggable` || e.startsWith(`layout`) || e.startsWith(`onTap`) || e.startsWith(`onPan`) || e.startsWith(`onLayout`) || scope.il.has(e);
    };
    scope.ol = function ol(e, t) {
      return e.startsWith(`on`) ? !(0, scope.al)(e) : t?.(e) ?? !(0, scope.al)(e);
    };
    scope.sl = function sl(e, t, n, r) {
      let i = {};
      for (let a in e)
        (a !== `values` || typeof e.values != `object`) && ((0, scope.q)(e[a]) || ((0, scope.ol)(a, r) || n === true && (0, scope.al)(a) || !t && !(0, scope.al)(a) || e.draggable && a.startsWith(`onDrag`)) && (i[a] = e[a]));
      return i;
    };
    scope.ll = function ll(e) {
      return typeof e != `string` || e.includes(`-`) ? false : !!(scope.cl.indexOf(e) > -1 || /[A-Z]/u.test(e));
    };
    scope.ul = function ul(e, t, n, { latestValues: r }, i, a = false, o, s) {
      let c2 = (o ?? (0, scope.ll)(e) ? scope.rl : scope.tl)(t, r, i, e), l = (0, scope.sl)(t, typeof e == `string`, a, s), u = e === scope.k.Fragment ? {} : { ...l, ...c2, ref: n }, { children: d } = t, f2 = (0, scope.k.useMemo)(() => (0, scope.q)(d) ? d.get() : d, [d]);
      return (0, scope.k.createElement)(e, { ...u, children: f2 });
    };
    scope.dl = function dl({ scrapeMotionValuesFromProps: e, createRenderState: t }, n, r, i) {
      return { latestValues: (0, scope.fl)(n, r, i, e), renderState: t() };
    };
    scope.fl = function fl(e, t, n, r) {
      let i = {}, a = r(e, {});
      for (let e2 in a) i[e2] = (0, scope.Hs)(a[e2]);
      let { initial: o, animate: s } = e, c2 = (0, scope.bo)(e), l = (0, scope.xo)(e);
      t && l && !c2 && e.inherit !== false && (o === void 0 && (o = t.initial), s === void 0 && (s = t.animate));
      let u = n ? n.initial === false : false;
      u ||= o === false;
      let d = u ? s : o;
      if (d && typeof d != `boolean` && !(0, scope.go)(d)) {
        let t2 = Array.isArray(d) ? d : [d];
        for (let n2 = 0; n2 < t2.length; n2++) {
          let r2 = (0, scope.bi)(e, t2[n2]);
          if (r2) {
            let { transitionEnd: e2, transition: t3, ...n3 } = r2;
            for (let e3 in n3) {
              let t4 = n3[e3];
              if (Array.isArray(t4)) {
                let e4 = u ? t4.length - 1 : 0;
                t4 = t4[e4];
              }
              t4 !== null && (i[e3] = t4);
            }
            for (let t4 in e2) i[t4] = e2[t4];
          }
        }
      }
      return i;
    };
    scope._l = function _l(e, t, n) {
      let r = (0, scope.k.useRef)(n);
      (0, scope.k.useInsertionEffect)(() => {
        r.current = n;
      });
      let i = (0, scope.k.useRef)(null);
      return (0, scope.k.useCallback)(
        (n2) => {
          n2 && e.onMount?.(n2), t && (n2 ? t.mount(n2) : t.unmount());
          let a = r.current;
          if (typeof a == `function`) {
            if (n2) {
              let e2 = a(n2);
              typeof e2 == `function` && (i.current = e2);
            } else i.current ? (i.current(), i.current = null) : a(n2);
          } else a && (a.current = n2);
        },
        [t]
      );
    };
    scope.yl = function yl(e) {
      return e && typeof e == `object` && Object.prototype.hasOwnProperty.call(e, `current`);
    };
    scope.bl = function bl(e, t, n, r, i, a) {
      let { visualElement: o } = (0, scope.k.useContext)(scope.qc), s = (0, scope.k.useContext)(scope.Vc), c2 = (0, scope.k.useContext)(scope.N), l = (0, scope.k.useContext)(scope.kc), u = l.reducedMotion, d = l.skipAnimations, f2 = (0, scope.k.useRef)(null), p = (0, scope.k.useRef)(false);
      r ||= s.renderer, !f2.current && r && (f2.current = r(e, {
        visualState: t,
        parent: o,
        props: n,
        presenceContext: c2,
        blockInitialAnimation: c2 ? c2.initial === false : false,
        reducedMotionConfig: u,
        skipAnimations: d,
        isSVG: a
      }), p.current && f2.current && (f2.current.manuallyAnimateOnMount = true));
      let m = f2.current, h = (0, scope.k.useContext)(scope.vl);
      m && !m.projection && i && (m.type === `html` || m.type === `svg`) && (0, scope.xl)(f2.current, n, i, h);
      let g = (0, scope.k.useRef)(false);
      (0, scope.k.useInsertionEffect)(() => {
        m && g.current && m.update(n, c2);
      });
      let _ = n[scope.ji], v2 = (0, scope.k.useRef)(
        !!_ && typeof window < `u` && !window.MotionHandoffIsComplete?.(_) && window.MotionHasOptimisedAnimation?.(_)
      );
      return (0, scope.M)(() => {
        p.current && m && (m.animationState?.animateChanges(), m.enteringChildren = void 0);
      }, []), (0, scope.M)(() => {
        p.current = true, m && (g.current = true, window.MotionIsMounted = true, m.updateFeatures(), m.scheduleRenderMicrotask(), v2.current && m.animationState && m.animationState.animateChanges());
      }), (0, scope.k.useEffect)(() => {
        m && (!v2.current && m.animationState && m.animationState.animateChanges(), v2.current &&= (queueMicrotask(() => {
          window.MotionHandoffMarkAsComplete?.(_);
        }), false), m.enteringChildren = void 0);
      }), m;
    };
    scope.xl = function xl(e, t, n, r) {
      let {
        layoutId: i,
        layout: a,
        drag: o,
        dragConstraints: s,
        layoutScroll: c2,
        layoutRoot: l,
        layoutAnchor: u,
        layoutCrossfade: d
      } = t;
      e.projection = new n(
        e.latestValues,
        t[`data-framer-portal-id`] ? void 0 : (0, scope.Sl)(e.parent)
      ), e.projection.setOptions({
        layoutId: i,
        layout: a,
        alwaysMeasureLayout: !!o || s && (0, scope.yl)(s),
        visualElement: e,
        animationType: typeof a == `string` ? a : `both`,
        initialPromotionConfig: r,
        crossfade: d,
        layoutScroll: c2,
        layoutRoot: l,
        layoutAnchor: u
      });
    };
    scope.Sl = function Sl(e) {
      if (e) return e.options.allowProjection === false ? (0, scope.Sl)(e.parent) : e.projection;
    };
    scope.Cl = function Cl(e, { forwardMotionProps: t = false, type: n } = {}, r, i) {
      r && (0, scope.Kc)(r);
      let a = n ? n === `svg` : (0, scope.ll)(e), o = a ? scope.hl : scope.ml;
      function s(n2, s2) {
        let c3, l = { ...(0, scope.k.useContext)(scope.kc), ...n2, layoutId: (0, scope.wl)(n2) }, { isStatic: u, isValidProp: d } = l, f2 = (0, scope.Yc)(n2), p = o(n2, u);
        if (!u && typeof window < `u`) {
          (0, scope.Tl)(l, r);
          let t2 = (0, scope.El)(l);
          c3 = t2.MeasureLayout, f2.visualElement = (0, scope.bl)(e, p, l, i, t2.ProjectionNode, a);
        }
        return (0, scope.O.jsxs)(scope.qc.Provider, {
          value: f2,
          children: [
            c3 && f2.visualElement ? (0, scope.O.jsx)(c3, { visualElement: f2.visualElement, ...l }) : null,
            (0, scope.ul)(e, n2, (0, scope._l)(p, f2.visualElement, s2), p, u, t, a, d)
          ]
        });
      }
      s.displayName = `motion.${typeof e == `string` ? e : `create(${e.displayName ?? e.name ?? ``})`}`;
      let c2 = (0, scope.k.forwardRef)(s);
      return c2[scope.gl] = e, c2;
    };
    scope.wl = function wl({ layoutId: e }) {
      let t = (0, scope.k.useContext)(scope.A).id;
      return t && e !== void 0 ? t + `-` + e : e;
    };
    scope.Tl = function Tl(e, t) {
      (0, scope.k.useContext)(scope.Vc).strict;
    };
    scope.El = function El(e) {
      let { drag: t, layout: n } = (0, scope.Gc)();
      if (!t && !n) return {};
      let r = { ...t, ...n };
      return {
        MeasureLayout: t?.isEnabled(e) || n?.isEnabled(e) ? r.MeasureLayout : void 0,
        ProjectionNode: r.ProjectionNode
      };
    };
    scope.Dl = function Dl(e, t) {
      if (typeof Proxy > `u`) return scope.Cl;
      let n = /* @__PURE__ */ new Map(), r = (n2, r2) => (0, scope.Cl)(n2, r2, e, t);
      return new Proxy((e2, t2) => r(e2, t2), {
        get: (i, a) => a === `create` ? r : (n.has(a) || n.set(a, (0, scope.Cl)(a, void 0, e, t)), n.get(a))
      });
    };
    scope.Ml = function Ml(e) {
      return { point: { x: e.pageX, y: e.pageY } };
    };
    scope.Pl = function Pl(e, t, n, r) {
      return (0, scope.Rs)(e, t, (0, scope.Nl)(n), r);
    };
    scope.Ll = function Ll(e, t) {
      let n = (0, scope.Il)(e.x, t.x), r = (0, scope.Il)(e.y, t.y);
      return Math.sqrt(n ** 2 + r ** 2);
    };
    scope.Bl = function Bl(e, t) {
      return t ? { point: t(e.point) } : e;
    };
    scope.Vl = function Vl(e, t) {
      return { x: e.x - t.x, y: e.y - t.y };
    };
    scope.Hl = function Hl({ point: e }, t) {
      return {
        point: e,
        delta: (0, scope.Vl)(e, (0, scope.Wl)(t)),
        offset: (0, scope.Vl)(e, (0, scope.Ul)(t)),
        velocity: (0, scope.Gl)(t, 0.1)
      };
    };
    scope.Ul = function Ul(e) {
      return e[0];
    };
    scope.Wl = function Wl(e) {
      return e[e.length - 1];
    };
    scope.Gl = function Gl(e, t) {
      if (e.length < 2) return { x: 0, y: 0 };
      let n = e.length - 1, r = null, i = (0, scope.Wl)(e);
      for (; n >= 0 && (r = e[n], !(i.timestamp - r.timestamp > (0, scope.R)(t))); ) n--;
      if (!r) return { x: 0, y: 0 };
      r === e[0] && e.length > 2 && i.timestamp - r.timestamp > (0, scope.R)(t) * 2 && (r = e[1]);
      let a = (0, scope.z)(i.timestamp - r.timestamp);
      if (a === 0) return { x: 0, y: 0 };
      let o = { x: (i.x - r.x) / a, y: (i.y - r.y) / a };
      return o.x === 1 / 0 && (o.x = 0), o.y === 1 / 0 && (o.y = 0), o;
    };
    scope.Kl = function Kl(e, { min: t, max: n }, r) {
      return t !== void 0 && e < t ? e = r ? (0, scope.W)(t, e, r.min) : Math.max(e, t) : n !== void 0 && e > n && (e = r ? (0, scope.W)(n, e, r.max) : Math.min(e, n)), e;
    };
    scope.ql = function ql(e, t, n) {
      return {
        min: t === void 0 ? void 0 : e.min + t,
        max: n === void 0 ? void 0 : e.max + n - (e.max - e.min)
      };
    };
    scope.Jl = function Jl(e, { top: t, left: n, bottom: r, right: i }) {
      return { x: (0, scope.ql)(e.x, n, i), y: (0, scope.ql)(e.y, t, r) };
    };
    scope.Yl = function Yl(e, t) {
      let n = t.min - e.min, r = t.max - e.max;
      return t.max - t.min < e.max - e.min && ([n, r] = [r, n]), { min: n, max: r };
    };
    scope.Xl = function Xl(e, t) {
      return { x: (0, scope.Yl)(e.x, t.x), y: (0, scope.Yl)(e.y, t.y) };
    };
    scope.Zl = function Zl(e, t) {
      let n = 0.5, r = (0, scope.rs)(e), i = (0, scope.rs)(t);
      return i > r ? n = (0, scope.ce)(t.min, t.max - r, e.min) : r > i && (n = (0, scope.ce)(e.min, e.max - i, t.min)), (0, scope.re)(0, 1, n);
    };
    scope.Ql = function Ql(e, t) {
      let n = {};
      return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
    };
    scope.eu = function eu(e = scope.$l) {
      return e === false ? e = 0 : e === true && (e = scope.$l), { x: (0, scope.tu)(e, `left`, `right`), y: (0, scope.tu)(e, `top`, `bottom`) };
    };
    scope.tu = function tu(e, t, n) {
      return { min: (0, scope.nu)(e, t), max: (0, scope.nu)(e, n) };
    };
    scope.nu = function nu(e, t) {
      return typeof e == `number` ? e : e[t] || 0;
    };
    scope.au = function au(e) {
      let t = true;
      return () => {
        t ? t = false : e();
      };
    };
    scope.ou = function ou(e, t, n) {
      let r = (0, scope.so)(e, (0, scope.au)(n)), i = (0, scope.so)(t, (0, scope.au)(n));
      return () => {
        r(), i();
      };
    };
    scope.su = function su(e, t, n) {
      return (t === true || t === e) && (n === null || n === e);
    };
    scope.cu = function cu(e, t = 10) {
      let n = null;
      return Math.abs(e.y) > t ? n = `y` : Math.abs(e.x) > t && (n = `x`), n;
    };
    scope.mu = function mu(e) {
      let [t, n] = (0, scope.Lc)(), r = (0, scope.k.useContext)(scope.A);
      return (0, scope.O.jsx)(scope.pu, {
        ...e,
        layoutGroup: r,
        switchLayoutGroup: (0, scope.k.useContext)(scope.vl),
        isPresent: t,
        safeToRemove: n
      });
    };
    scope.gu = function gu(e, t, n) {
      let { props: r } = e;
      e.animationState && r.whileHover && e.animationState.setActive(`whileHover`, n === `Start`);
      let i = r[`onHover` + n];
      i && scope.G.postRender(() => i(t, (0, scope.Ml)(t)));
    };
    scope.yu = function yu(e, t, n) {
      let { props: r } = e;
      if (e.current instanceof HTMLButtonElement && e.current.disabled) return;
      e.animationState && r.whileTap && e.animationState.setActive(`whileTap`, n === `Start`);
      let i = r[`onTap` + (n === `End` ? `` : n)];
      i && scope.G.postRender(() => i(t, (0, scope.Ml)(t)));
    };
    scope.Tu = function Tu({ root: e, ...t }) {
      let n = e || document;
      scope.Su.has(n) || scope.Su.set(n, {});
      let r = scope.Su.get(n), i = JSON.stringify(t);
      return r[i] || (r[i] = new IntersectionObserver(scope.wu, { root: e, ...t })), r[i];
    };
    scope.Eu = function Eu(e, t, n) {
      let r = (0, scope.Tu)(t);
      return scope.xu.set(e, n), r.observe(e), () => {
        scope.xu.delete(e), r.unobserve(e);
      };
    };
    scope.ku = function ku({ viewport: e = {} }, { viewport: t = {} } = {}) {
      return (n) => e[n] !== t[n];
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.A = (0, scope.k.createContext)({});
        break;
      }
      case 1: {
        scope.M = typeof window < `u` ? scope.k.useLayoutEffect : scope.k.useEffect;
        break;
      }
      case 2: {
        scope.N = (0, scope.k.createContext)(null);
        break;
      }
      case 3: {
        scope.re = (e, t, n) => n > t ? t : n < e ? e : n;
        break;
      }
      case 4: {
        scope.ie = {};
        break;
      }
      case 5: {
        scope.ae = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e);
        break;
      }
      case 6: {
        scope.F = (e) => typeof e == `object` && !!e;
        break;
      }
      case 7: {
        scope.I = (e) => /^0[^.\s]+$/u.test(e);
        break;
      }
      case 8: {
        scope.se = (e) => e;
        break;
      }
      case 9: {
        scope.L = (...e) => e.reduce((e2, t) => (n) => t(e2(n)));
        break;
      }
      case 10: {
        scope.ce = (e, t, n) => {
          let r = t - e;
          return r ? (n - e) / r : 1;
        };
        break;
      }
      case 11: {
        scope.le = class {
          constructor() {
            this.subscriptions = [];
          }
          add(e) {
            return (0, scope.P)(this.subscriptions, e), () => this.remove(e);
          }
          remove(e) {
            (0, scope.ne)(this.subscriptions, e);
          }
          notify(e, t, n) {
            let r = this.subscriptions.length;
            if (r) {
              if (r === 1) this.subscriptions[0](e, t, n);
              else
                for (let i = 0; i < r; i++) {
                  let r2 = this.subscriptions[i];
                  r2 && r2(e, t, n);
                }
            }
          }
          getSize() {
            return this.subscriptions.length;
          }
          clear() {
            this.subscriptions.length = 0;
          }
        };
        break;
      }
      case 12: {
        scope.R = (e) => e * 1e3;
        break;
      }
      case 13: {
        scope.z = (e) => e / 1e3;
        break;
      }
      case 14: {
        scope.ue = (e, t) => t ? 1e3 / t * e : 0;
        break;
      }
      case 15: {
        scope.de = (e, t, n) => (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e;
        break;
      }
      case 16: {
        scope.fe = 1e-7;
        break;
      }
      case 17: {
        scope.pe = 12;
        break;
      }
      case 18: {
        scope.ge = (e) => (t) => t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2;
        break;
      }
      case 19: {
        scope._e = (e) => (t) => 1 - e(1 - t);
        break;
      }
      case 20: {
        scope.ve = (0, scope.he)(0.33, 1.53, 0.69, 0.99);
        break;
      }
      case 21: {
        scope.ye = (0, scope._e)(scope.ve);
        break;
      }
      case 22: {
        scope.be = (0, scope.ge)(scope.ye);
        break;
      }
      case 23: {
        scope.xe = (e) => e >= 1 ? 1 : (e *= 2) < 1 ? 0.5 * (0, scope.ye)(e) : 0.5 * (2 - 2 ** (-10 * (e - 1)));
        break;
      }
      case 24: {
        scope.Se = (e) => 1 - Math.sin(Math.acos(e));
        break;
      }
      case 25: {
        scope.Ce = (0, scope._e)(scope.Se);
        break;
      }
      case 26: {
        scope.we = (0, scope.ge)(scope.Se);
        break;
      }
      case 27: {
        scope.Te = (0, scope.he)(0.42, 0, 1, 1);
        break;
      }
      case 28: {
        scope.Ee = (0, scope.he)(0, 0, 0.58, 1);
        break;
      }
      case 29: {
        scope.De = (0, scope.he)(0.42, 0, 0.58, 1);
        break;
      }
      case 30: {
        scope.Oe = (e) => Array.isArray(e) && typeof e[0] != `number`;
        break;
      }
      case 31: {
        scope.ke = (e) => Array.isArray(e) && typeof e[0] == `number`;
        break;
      }
      case 32: {
        scope.Ae = {
          linear: scope.se,
          easeIn: scope.Te,
          easeInOut: scope.De,
          easeOut: scope.Ee,
          circIn: scope.Se,
          circInOut: scope.we,
          circOut: scope.Ce,
          backIn: scope.ye,
          backInOut: scope.be,
          backOut: scope.ve,
          anticipate: scope.xe
        };
        break;
      }
      case 33: {
        scope.je = (e) => typeof e == `string`;
        break;
      }
      case 34: {
        scope.Me = (e) => {
          if ((0, scope.ke)(e)) {
            e.length;
            let [t, n, r, i] = e;
            return (0, scope.he)(t, n, r, i);
          }
          return (0, scope.je)(e) ? (scope.Ae[e], `${e}`, scope.Ae[e]) : e;
        };
        break;
      }
      case 35: {
        scope.B = { delta: 0, timestamp: 0, isProcessing: false };
        break;
      }
      case 36: {
        scope.V = {
          now: () => (scope.Ne === void 0 && scope.V.set(
            scope.B.isProcessing || scope.ie.useManualTiming ? scope.B.timestamp : performance.now()
          ), scope.Ne),
          set: (e) => {
            scope.Ne = e, queueMicrotask(scope.Pe);
          }
        };
        break;
      }
      case 37: {
        scope.Fe = (e) => Math.round(e * 1e5) / 1e5;
        break;
      }
      case 38: {
        scope.Ie = (e) => (t) => typeof t == `string` && t.startsWith(e);
        break;
      }
      case 39: {
        scope.Le = (0, scope.Ie)(`--`);
        break;
      }
      case 40: {
        scope.Re = (0, scope.Ie)(`var(--`);
        break;
      }
      case 41: {
        scope.ze = (e) => (0, scope.Re)(e) ? scope.Be.test(e.split(`/*`)[0].trim()) : false;
        break;
      }
      case 42: {
        scope.Be = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
        break;
      }
      case 43: {
        scope.He = { test: (e) => typeof e == `number`, parse: parseFloat, transform: (e) => e };
        break;
      }
      case 44: {
        scope.Ue = { ...scope.He, transform: (e) => (0, scope.re)(0, 1, e) };
        break;
      }
      case 45: {
        scope.We = { ...scope.He, default: 1 };
        break;
      }
      case 46: {
        scope.Ge = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
        break;
      }
      case 47: {
        scope.qe = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
        break;
      }
      case 48: {
        scope.Je = (e, t) => (n) => !!(typeof n == `string` && scope.qe.test(n) && n.startsWith(e) || t && !(0, scope.Ke)(n) && Object.prototype.hasOwnProperty.call(n, t));
        break;
      }
      case 49: {
        scope.Ye = (e, t, n) => (r) => {
          if (typeof r != `string`) return r;
          let [i, a, o, s] = r.match(scope.Ge);
          return {
            [e]: parseFloat(i),
            [t]: parseFloat(a),
            [n]: parseFloat(o),
            alpha: s === void 0 ? 1 : parseFloat(s)
          };
        };
        break;
      }
      case 50: {
        scope.Xe = (e) => (0, scope.re)(0, 255, e);
        break;
      }
      case 51: {
        scope.Ze = { ...scope.He, transform: (e) => Math.round((0, scope.Xe)(e)) };
        break;
      }
      case 52: {
        scope.Qe = {
          test: (0, scope.Je)(`rgb`, `red`),
          parse: (0, scope.Ye)(`red`, `green`, `blue`),
          transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => `rgba(` + scope.Ze.transform(e) + `, ` + scope.Ze.transform(t) + `, ` + scope.Ze.transform(n) + `, ` + (0, scope.Fe)(scope.Ue.transform(r)) + `)`
        };
        break;
      }
      case 53: {
        scope.et = { test: (0, scope.Je)(`#`), parse: scope.$e, transform: scope.Qe.transform };
        break;
      }
      case 54: {
        scope.tt = (e) => ({
          test: (t) => typeof t == `string` && t.endsWith(e) && t.split(` `).length === 1,
          parse: parseFloat,
          transform: (t) => `${t}${e}`
        });
        break;
      }
      case 55: {
        scope.nt = (0, scope.tt)(`deg`);
        break;
      }
      case 56: {
        scope.rt = (0, scope.tt)(`%`);
        break;
      }
      case 57: {
        scope.H = (0, scope.tt)(`px`);
        break;
      }
      case 58: {
        scope.it = (0, scope.tt)(`vh`);
        break;
      }
      case 59: {
        scope.at = (0, scope.tt)(`vw`);
        break;
      }
      case 60: {
        scope.ot = {
          ...scope.rt,
          parse: (e) => scope.rt.parse(e) / 100,
          transform: (e) => scope.rt.transform(e * 100)
        };
        break;
      }
      case 61: {
        scope.st = {
          test: (0, scope.Je)(`hsl`, `hue`),
          parse: (0, scope.Ye)(`hue`, `saturation`, `lightness`),
          transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => `hsla(` + Math.round(e) + `, ` + scope.rt.transform((0, scope.Fe)(t)) + `, ` + scope.rt.transform((0, scope.Fe)(n)) + `, ` + (0, scope.Fe)(scope.Ue.transform(r)) + `)`
        };
        break;
      }
      case 62: {
        scope.U = {
          test: (e) => scope.Qe.test(e) || scope.et.test(e) || scope.st.test(e),
          parse: (e) => scope.Qe.test(e) ? scope.Qe.parse(e) : scope.st.test(e) ? scope.st.parse(e) : scope.et.parse(e),
          transform: (e) => typeof e == `string` ? e : e.hasOwnProperty(`red`) ? scope.Qe.transform(e) : scope.st.transform(e),
          getAnimatableNone: (e) => {
            let t = scope.U.parse(e);
            return t.alpha = 0, scope.U.transform(t);
          }
        };
        break;
      }
      case 63: {
        scope.ct = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
        break;
      }
      case 64: {
        scope.lt = new RegExp(scope.Ge.source);
        break;
      }
      case 65: {
        scope.ut = new RegExp(scope.ct.source, `i`);
        break;
      }
      case 66: {
        scope.ft = `number`;
        break;
      }
      case 67: {
        scope.pt = `color`;
        break;
      }
      case 68: {
        scope.mt = `var`;
        break;
      }
      case 69: {
        scope.ht = `var(`;
        break;
      }
      case 70: {
        scope.gt = "${}";
        break;
      }
      case 71: {
        scope._t = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
        break;
      }
      case 72: {
        scope.Ct = (e) => typeof e == `number` ? 0 : scope.U.test(e) ? scope.U.getAnimatableNone(e) : e;
        break;
      }
      case 73: {
        scope.wt = (e, t) => typeof e == `number` ? t?.trim().endsWith(`/`) ? e : 0 : (0, scope.Ct)(e);
        break;
      }
      case 74: {
        scope.Et = {
          test: scope.dt,
          parse: scope.bt,
          createTransformer: scope.St,
          getAnimatableNone: scope.Tt
        };
        break;
      }
      case 75: {
        scope.W = (e, t, n) => e + (t - e) * n;
        break;
      }
      case 76: {
        scope.At = (e, t, n) => {
          let r = e * e, i = n * (t * t - r) + r;
          return i < 0 ? 0 : Math.sqrt(i);
        };
        break;
      }
      case 77: {
        scope.jt = [scope.et, scope.Qe, scope.st];
        break;
      }
      case 78: {
        scope.Mt = (e) => scope.jt.find((t) => t.test(e));
        break;
      }
      case 79: {
        scope.Pt = (e, t) => {
          let n = (0, scope.Nt)(e), r = (0, scope.Nt)(t);
          if (!n || !r) return (0, scope.kt)(e, t);
          let i = { ...n };
          return (e2) => (i.red = (0, scope.At)(n.red, r.red, e2), i.green = (0, scope.At)(n.green, r.green, e2), i.blue = (0, scope.At)(n.blue, r.blue, e2), i.alpha = (0, scope.W)(n.alpha, r.alpha, e2), scope.Qe.transform(i));
        };
        break;
      }
      case 80: {
        scope.Ft = /* @__PURE__ */ new Set([`none`, `hidden`]);
        break;
      }
      case 81: {
        scope.Ht = (e, t) => {
          let n = scope.Et.createTransformer(t), r = (0, scope.yt)(e), i = (0, scope.yt)(t);
          return r.indexes.var.length === i.indexes.var.length && r.indexes.color.length === i.indexes.color.length && r.indexes.number.length >= i.indexes.number.length ? scope.Ft.has(e) && !i.values.length || scope.Ft.has(t) && !r.values.length ? (0, scope.It)(e, t) : (0, scope.L)((0, scope.zt)((0, scope.Vt)(r, i), i.values), n) : (`${e}${t}`, (0, scope.kt)(e, t));
        };
        break;
      }
      case 82: {
        scope.Ut = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
        break;
      }
      case 83: {
        scope.Kt = [
          `setup`,
          `read`,
          `resolveKeyframes`,
          `preUpdate`,
          `update`,
          `preRender`,
          `render`,
          `postRender`
        ];
        break;
      }
      case 84: {
        scope.Jt = 40;
        break;
      }
      case 85: {
        ({
          schedule: scope.G,
          cancel: scope.Xt,
          steps: scope.Zt
        } = (0, scope.Yt)(
          typeof requestAnimationFrame < `u` ? requestAnimationFrame : scope.se,
          true,
          scope.B
        ));
        break;
      }
      case 86: {
        scope.Qt = (e) => {
          let t = ({ timestamp: t2 }) => e(t2);
          return {
            start: (e2 = true) => scope.G.update(t, e2),
            stop: () => (0, scope.Xt)(t),
            now: () => scope.B.isProcessing ? scope.B.timestamp : scope.V.now()
          };
        };
        break;
      }
      case 87: {
        scope.$t = (e, t, n = 10) => {
          let r = ``, i = Math.max(Math.round(t / n), 2);
          for (let t2 = 0; t2 < i; t2++) r += Math.round(e(t2 / (i - 1)) * 1e4) / 1e4 + `, `;
          return `linear(${r.substring(0, r.length - 2)})`;
        };
        break;
      }
      case 88: {
        scope.en = 2e4;
        break;
      }
      case 89: {
        scope.K = {
          stiffness: 100,
          damping: 10,
          mass: 1,
          duration: 800,
          bounce: 0.3,
          visualDuration: 0.3,
          restSpeed: { granular: 0.01, default: 2 },
          restDelta: { granular: 5e-3, default: 0.5 },
          minDuration: 0.01,
          maxDuration: 10,
          minDamping: 0.05
        };
        break;
      }
      case 90: {
        scope.rn = (e) => e < 0 ? 1 / Math.max(1 + e, scope.K.minDamping) : Math.max(1 - e, scope.K.minDamping);
        break;
      }
      case 91: {
        scope.sn = 12;
        break;
      }
      case 92: {
        scope.ln = 1e-3;
        break;
      }
      case 93: {
        scope.dn = (e, t) => (t ? e >= 0 : e > 0) && e < 1 / 0;
        break;
      }
      case 94: {
        scope.mn.applyToOptions = (e) => {
          let t = (0, scope.nn)(e, 100, scope.mn);
          return e.ease = t.ease, e.duration = (0, scope.R)(t.duration), e.type = `keyframes`, e;
        };
        break;
      }
      case 95: {
        scope.Cn = 5;
        break;
      }
      case 96: {
        scope.En = (e) => e !== null;
        break;
      }
      case 97: {
        scope.On = {
          decay: scope.hn,
          inertia: scope.hn,
          tween: scope.Sn,
          keyframes: scope.Sn,
          spring: scope.mn
        };
        break;
      }
      case 98: {
        scope.Nn = class {
          constructor() {
            this.isResolved = false;
          }
          get finished() {
            return this._finished ||= this.isResolved ? Promise.resolve() : new Promise((e) => {
              this._resolve = e;
            }), this._finished;
          }
          updateFinished() {
            this._finished = this._resolve = void 0, this.isResolved = false;
          }
          notifyFinished() {
            this.isResolved = true, this._resolve?.();
          }
          then(e, t) {
            return this.finished.then(e, t);
          }
        };
        break;
      }
      case 99: {
        scope.Pn = (e) => e / 100;
        break;
      }
      case 100: {
        scope.Fn = class extends scope.Nn {
          constructor(e) {
            super(), this.state = `idle`, this.startTime = null, this.isStopped = false, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = { done: false, value: void 0 }, this.stop = () => {
              let { motionValue: e2 } = this.options;
              e2 && e2.updatedAt !== scope.V.now() && this.tick(scope.V.now()), this.isStopped = true, this.state !== `idle` && (this.teardown(), this.options.onStop?.());
            }, this.options = e, this.initAnimation(), this.play(), e.autoplay === false && this.pause(), (0, scope.jn)(this, this.options);
          }
          initAnimation() {
            let { options: e } = this;
            (0, scope.kn)(e);
            let {
              type: t = scope.Sn,
              repeat: n = 0,
              repeatDelay: r = 0,
              repeatType: i,
              velocity: a = 0
            } = e, { keyframes: o } = e, s = t || scope.Sn;
            s !== scope.Sn && typeof o[0] != `number` && (this.mixKeyframes = (0, scope.L)(scope.Pn, (0, scope.Gt)(o[0], o[1])), o = [0, 100]);
            let c2 = s(o === e.keyframes ? e : { ...e, keyframes: o });
            i === `mirror` && (this.mirroredGenerator = s({ ...e, keyframes: [...o].reverse(), velocity: -a })), c2.calculatedDuration === null && (c2.calculatedDuration = (0, scope.tn)(c2));
            let { calculatedDuration: l } = c2;
            this.calculatedDuration = l, this.resolvedDuration = l + r, this.totalDuration = this.resolvedDuration * (n + 1) - r, this.generator = c2;
          }
          updateTime(e) {
            let t = Math.round(e - this.startTime) * this.playbackSpeed;
            this.currentTime = this.holdTime === null ? t : this.holdTime;
          }
          tick(e, t = false) {
            let {
              generator: n,
              totalDuration: r,
              mixKeyframes: i,
              mirroredGenerator: a,
              resolvedDuration: o,
              calculatedDuration: s
            } = this;
            if (this.startTime === null) return n.next(0);
            let {
              delay: c2 = 0,
              keyframes: l,
              repeat: u,
              repeatType: d,
              repeatDelay: f2,
              type: p,
              onUpdate: m,
              finalKeyframe: h
            } = this.options;
            this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - r / this.speed, this.startTime)), t ? this.currentTime = e : this.updateTime(e);
            let g = this.currentTime - c2 * (this.playbackSpeed >= 0 ? 1 : -1), _ = this.playbackSpeed >= 0 ? g < 0 : g > r;
            this.currentTime = Math.max(g, 0), this.state === `finished` && this.holdTime === null && (this.currentTime = r);
            let v2 = this.currentTime, y = n;
            if (u) {
              let e2 = Math.min(this.currentTime, r) / o, t2 = Math.floor(e2), n2 = e2 % 1;
              !n2 && e2 >= 1 && (n2 = 1), n2 === 1 && t2--, t2 = Math.min(t2, u + 1), t2 % 2 && (d === `reverse` ? (n2 = 1 - n2, f2 && (n2 -= f2 / o)) : d === `mirror` && (y = a)), v2 = (0, scope.re)(0, 1, n2) * o;
            }
            let b;
            _ ? (this.delayState.value = l[0], b = this.delayState) : b = y.next(v2), i && !_ && (b.value = i(b.value));
            let { done: x } = b;
            !_ && s !== null && (x = this.playbackSpeed >= 0 ? this.currentTime >= r : this.currentTime <= 0);
            let S = this.holdTime === null && (this.state === `finished` || this.state === `running` && x);
            return S && p !== scope.hn && (b.value = (0, scope.Dn)(l, this.options, h, this.speed)), m && m(b.value), S && this.finish(), b;
          }
          then(e, t) {
            return this.finished.then(e, t);
          }
          get duration() {
            return (0, scope.z)(this.calculatedDuration);
          }
          get iterationDuration() {
            let { delay: e = 0 } = this.options || {};
            return this.duration + (0, scope.z)(e);
          }
          get time() {
            return (0, scope.z)(this.currentTime);
          }
          set time(e) {
            e = (0, scope.R)(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver ? this.driver.start(false) : (this.startTime = 0, this.state = `paused`, this.holdTime = e, this.tick(e));
          }
          getGeneratorVelocity() {
            return (0, scope.Tn)(this.generator, this.currentTime, this.options.velocity);
          }
          get speed() {
            return this.playbackSpeed;
          }
          set speed(e) {
            let t = this.playbackSpeed !== e;
            t && this.driver && this.updateTime(scope.V.now()), this.playbackSpeed = e, t && this.driver && (this.time = (0, scope.z)(this.currentTime));
          }
          play() {
            if (this.isStopped) return;
            let { driver: e = scope.Qt, startTime: t } = this.options;
            this.driver ||= e((e2) => this.tick(e2)), this.options.onPlay?.();
            let n = this.driver.now();
            this.state === `finished` ? (this.updateFinished(), this.startTime = n) : this.holdTime === null ? this.startTime ||= t ?? n : this.startTime = n - this.holdTime, this.state === `finished` && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = `running`, this.driver.start();
          }
          pause() {
            this.state = `paused`, this.updateTime(scope.V.now()), this.holdTime = this.currentTime;
          }
          complete() {
            this.state !== `running` && this.play(), this.state = `finished`, this.holdTime = null;
          }
          finish() {
            this.notifyFinished(), this.teardown(), this.state = `finished`, this.options.onComplete?.();
          }
          cancel() {
            this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.();
          }
          teardown() {
            this.state = `idle`, this.stopDriver(), this.startTime = this.holdTime = null;
          }
          stopDriver() {
            this.driver &&= (this.driver.stop(), void 0);
          }
          sample(e) {
            return this.startTime = 0, this.tick(e, true);
          }
          attachTimeline(e) {
            return this.options.allowFlatten && (this.options.type = `keyframes`, this.options.ease = `linear`, this.initAnimation()), this.driver?.stop(), e.observe(this);
          }
        };
        break;
      }
      case 101: {
        scope.In = /* @__PURE__ */ new Set([`brightness`, `contrast`, `saturate`, `opacity`]);
        break;
      }
      case 102: {
        scope.Rn = /\b([a-z-]*)\(.*?\)/gu;
        break;
      }
      case 103: {
        scope.zn = {
          ...scope.Et,
          getAnimatableNone: (e) => {
            let t = e.match(scope.Rn);
            return t ? t.map(scope.Ln).join(` `) : e;
          }
        };
        break;
      }
      case 104: {
        scope.Bn = {
          ...scope.Et,
          getAnimatableNone: (e) => {
            let t = scope.Et.parse(e);
            return scope.Et.createTransformer(e)(
              t.map(
                (e2) => typeof e2 == `number` ? 0 : typeof e2 == `object` ? { ...e2, alpha: 1 } : e2
              )
            );
          }
        };
        break;
      }
      case 105: {
        scope.Vn = { ...scope.He, transform: Math.round };
        break;
      }
      case 106: {
        scope.Hn = {
          borderWidth: scope.H,
          borderTopWidth: scope.H,
          borderRightWidth: scope.H,
          borderBottomWidth: scope.H,
          borderLeftWidth: scope.H,
          borderRadius: scope.H,
          borderTopLeftRadius: scope.H,
          borderTopRightRadius: scope.H,
          borderBottomRightRadius: scope.H,
          borderBottomLeftRadius: scope.H,
          width: scope.H,
          maxWidth: scope.H,
          height: scope.H,
          maxHeight: scope.H,
          top: scope.H,
          right: scope.H,
          bottom: scope.H,
          left: scope.H,
          inset: scope.H,
          insetBlock: scope.H,
          insetBlockStart: scope.H,
          insetBlockEnd: scope.H,
          insetInline: scope.H,
          insetInlineStart: scope.H,
          insetInlineEnd: scope.H,
          padding: scope.H,
          paddingTop: scope.H,
          paddingRight: scope.H,
          paddingBottom: scope.H,
          paddingLeft: scope.H,
          paddingBlock: scope.H,
          paddingBlockStart: scope.H,
          paddingBlockEnd: scope.H,
          paddingInline: scope.H,
          paddingInlineStart: scope.H,
          paddingInlineEnd: scope.H,
          margin: scope.H,
          marginTop: scope.H,
          marginRight: scope.H,
          marginBottom: scope.H,
          marginLeft: scope.H,
          marginBlock: scope.H,
          marginBlockStart: scope.H,
          marginBlockEnd: scope.H,
          marginInline: scope.H,
          marginInlineStart: scope.H,
          marginInlineEnd: scope.H,
          fontSize: scope.H,
          backgroundPositionX: scope.H,
          backgroundPositionY: scope.H,
          rotate: scope.nt,
          pathRotation: scope.nt,
          rotateX: scope.nt,
          rotateY: scope.nt,
          rotateZ: scope.nt,
          scale: scope.We,
          scaleX: scope.We,
          scaleY: scope.We,
          scaleZ: scope.We,
          skew: scope.nt,
          skewX: scope.nt,
          skewY: scope.nt,
          distance: scope.H,
          translateX: scope.H,
          translateY: scope.H,
          translateZ: scope.H,
          x: scope.H,
          y: scope.H,
          z: scope.H,
          perspective: scope.H,
          transformPerspective: scope.H,
          opacity: scope.Ue,
          originX: scope.ot,
          originY: scope.ot,
          originZ: scope.H,
          zIndex: scope.Vn,
          fillOpacity: scope.Ue,
          strokeOpacity: scope.Ue,
          numOctaves: scope.Vn
        };
        break;
      }
      case 107: {
        scope.Un = {
          ...scope.Hn,
          color: scope.U,
          backgroundColor: scope.U,
          outlineColor: scope.U,
          fill: scope.U,
          stroke: scope.U,
          borderColor: scope.U,
          borderTopColor: scope.U,
          borderRightColor: scope.U,
          borderBottomColor: scope.U,
          borderLeftColor: scope.U,
          filter: scope.zn,
          WebkitFilter: scope.zn,
          mask: scope.Bn,
          WebkitMask: scope.Bn
        };
        break;
      }
      case 108: {
        scope.Wn = (e) => scope.Un[e];
        break;
      }
      case 109: {
        scope.Gn = /* @__PURE__ */ new Set([scope.zn, scope.Bn]);
        break;
      }
      case 110: {
        scope.Jn = (e) => e * 180 / Math.PI;
        break;
      }
      case 111: {
        scope.Yn = (e) => (0, scope.Zn)((0, scope.Jn)(Math.atan2(e[1], e[0])));
        break;
      }
      case 112: {
        scope.Xn = {
          x: 4,
          y: 5,
          translateX: 4,
          translateY: 5,
          scaleX: 0,
          scaleY: 3,
          scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
          rotate: scope.Yn,
          rotateZ: scope.Yn,
          skewX: (e) => (0, scope.Jn)(Math.atan(e[1])),
          skewY: (e) => (0, scope.Jn)(Math.atan(e[2])),
          skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
        };
        break;
      }
      case 113: {
        scope.Zn = (e) => (e %= 360, e < 0 && (e += 360), e);
        break;
      }
      case 114: {
        scope.Qn = scope.Yn;
        break;
      }
      case 115: {
        scope.$n = (e) => Math.sqrt(e[0] * e[0] + e[1] * e[1]);
        break;
      }
      case 116: {
        scope.er = (e) => Math.sqrt(e[4] * e[4] + e[5] * e[5]);
        break;
      }
      case 117: {
        scope.tr = {
          x: 12,
          y: 13,
          z: 14,
          translateX: 12,
          translateY: 13,
          translateZ: 14,
          scaleX: scope.$n,
          scaleY: scope.er,
          scale: (e) => ((0, scope.$n)(e) + (0, scope.er)(e)) / 2,
          rotateX: (e) => (0, scope.Zn)((0, scope.Jn)(Math.atan2(e[6], e[5]))),
          rotateY: (e) => (0, scope.Zn)((0, scope.Jn)(Math.atan2(-e[2], e[0]))),
          rotateZ: scope.Qn,
          rotate: scope.Qn,
          skewX: (e) => (0, scope.Jn)(Math.atan(e[4])),
          skewY: (e) => (0, scope.Jn)(Math.atan(e[1])),
          skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
        };
        break;
      }
      case 118: {
        scope.ir = (e, t) => {
          let { transform: n = `none` } = getComputedStyle(e);
          return (0, scope.rr)(n, t);
        };
        break;
      }
      case 119: {
        scope.or = [
          `transformPerspective`,
          `x`,
          `y`,
          `z`,
          `translateX`,
          `translateY`,
          `translateZ`,
          `scale`,
          `scaleX`,
          `scaleY`,
          `rotate`,
          `rotateX`,
          `rotateY`,
          `rotateZ`,
          `skew`,
          `skewX`,
          `skewY`
        ];
        break;
      }
      case 120: {
        scope.sr = /* @__PURE__ */ new Set([...scope.or, `pathRotation`]);
        break;
      }
      case 121: {
        scope.cr = (e) => e === scope.He || e === scope.H;
        break;
      }
      case 122: {
        scope.lr = /* @__PURE__ */ new Set([`x`, `y`, `z`]);
        break;
      }
      case 123: {
        scope.ur = scope.or.filter((e) => !scope.lr.has(e));
        break;
      }
      case 124: {
        scope.fr = /* @__PURE__ */ new Set([`bottom`, `right`]);
        break;
      }
      case 125: {
        scope.mr = {
          width: ({ width: e, paddingLeft: t = `0`, paddingRight: n = `0`, boxSizing: r }, i) => (0, scope.pr)(e, i, `x`, t, n, r),
          height: ({ height: e, paddingTop: t = `0`, paddingBottom: n = `0`, boxSizing: r }, i) => (0, scope.pr)(e, i, `y`, t, n, r),
          top: ({ top: e }) => parseFloat(e),
          left: ({ left: e }) => parseFloat(e),
          bottom: ({ top: e }, t) => {
            let { y: n } = t();
            return parseFloat(e) + (n.max - n.min);
          },
          right: ({ left: e }, t) => {
            let { x: n } = t();
            return parseFloat(e) + (n.max - n.min);
          },
          x: ({ transform: e }) => (0, scope.rr)(e, `x`),
          y: ({ transform: e }) => (0, scope.rr)(e, `y`)
        };
        break;
      }
      case 126: {
        scope.mr.translateX = scope.mr.x, scope.mr.translateY = scope.mr.y;
        break;
      }
      case 127: {
        scope.hr = /* @__PURE__ */ new Set();
        break;
      }
      case 128: {
        scope.gr = false;
        break;
      }
      case 129: {
        scope._r = false;
        break;
      }
      case 130: {
        scope.vr = false;
        break;
      }
      case 131: {
        scope.Cr = class {
          constructor(e, t, n, r, i, a = false) {
            this.state = `pending`, this.isAsync = false, this.needsMeasurement = false, this.unresolvedKeyframes = [...e], this.onComplete = t, this.name = n, this.motionValue = r, this.element = i, this.isAsync = a;
          }
          scheduleResolve() {
            this.state = `scheduled`, this.isAsync ? (scope.hr.add(this), scope.gr || (scope.gr = true, scope.G.read(scope.br), scope.G.resolveKeyframes(scope.yr))) : (this.readKeyframes(), this.complete());
          }
          readKeyframes() {
            let { unresolvedKeyframes: e, name: t, element: n, motionValue: r } = this;
            if (e[0] === null) {
              let i = r?.get(), a = e[e.length - 1];
              if (i !== void 0) e[0] = i;
              else if (n && t) {
                let r2 = (0, scope.Sr)(n.readValue(t, a), t, a);
                r2 !== void 0 && (e[0] = r2);
              }
              e[0] === void 0 && (e[0] = a), r && i === void 0 && r.set(e[0]);
            }
            (0, scope.qn)(e);
          }
          setFinalKeyframe() {
          }
          measureInitialState() {
          }
          renderEndStyles() {
          }
          measureEndState() {
          }
          complete(e = false) {
            this.state = `complete`, this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), scope.hr.delete(this);
          }
          cancel() {
            this.state === `scheduled` && (scope.hr.delete(this), this.state = `pending`);
          }
          resume() {
            this.state === `pending` && this.scheduleResolve();
          }
        };
        break;
      }
      case 132: {
        scope.wr = (e) => e.startsWith(`--`);
        break;
      }
      case 133: {
        scope.Er = {};
        break;
      }
      case 134: {
        scope.Or = (0, scope.Dr)(() => window.ScrollTimeline !== void 0, `scrollTimeline`);
        break;
      }
      case 135: {
        scope.kr = (0, scope.Dr)(() => {
          try {
            document.createElement(`div`).animate({ opacity: 0 }, { easing: `linear(0, 1)` });
          } catch {
            return false;
          }
          return true;
        }, `linearEasing`);
        break;
      }
      case 136: {
        scope.Ar = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`;
        break;
      }
      case 137: {
        scope.jr = {
          linear: `linear`,
          ease: `ease`,
          easeIn: `ease-in`,
          easeOut: `ease-out`,
          easeInOut: `ease-in-out`,
          circIn: (0, scope.Ar)([0, 0.65, 0.55, 1]),
          circOut: (0, scope.Ar)([0.55, 0, 1, 0.45]),
          backIn: (0, scope.Ar)([0.31, 0.01, 0.66, -0.59]),
          backOut: (0, scope.Ar)([0.33, 1.53, 0.69, 0.99])
        };
        break;
      }
      case 138: {
        scope.Ir = class extends scope.Nn {
          constructor(e) {
            if (super(), this.finishedTime = null, this.isStopped = false, this.manualStartTime = null, !e)
              return;
            let {
              element: t,
              name: n,
              keyframes: r,
              pseudoElement: i,
              allowFlatten: a = false,
              finalKeyframe: o,
              onComplete: s
            } = e;
            this.isPseudoElement = !!i, this.allowFlatten = a, this.options = e, e.type;
            let c2 = (0, scope.Fr)(e);
            this.animation = (0, scope.Nr)(t, n, r, c2, i), c2.autoplay === false && this.animation.pause(), this.animation.onfinish = () => {
              if (this.finishedTime = this.time, !i) {
                let e2 = (0, scope.Dn)(r, this.options, o, this.speed);
                this.updateMotionValue && this.updateMotionValue(e2), (0, scope.Tr)(t, n, e2), this.animation.cancel();
              }
              s?.(), this.notifyFinished();
            }, (0, scope.jn)(this, e, c2);
          }
          play() {
            this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === `finished` && this.updateFinished());
          }
          pause() {
            this.animation.pause();
          }
          complete() {
            this.animation.finish?.();
          }
          cancel() {
            try {
              this.animation.cancel();
            } catch {
            }
          }
          stop() {
            if (this.isStopped) return;
            this.isStopped = true;
            let { state: e } = this;
            e !== `idle` && e !== `finished` && (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
          }
          commitStyles() {
            let e = this.options?.element;
            !this.isPseudoElement && e?.isConnected && this.animation.commitStyles?.();
          }
          get duration() {
            let e = this.animation.effect?.getComputedTiming?.().duration || 0;
            return (0, scope.z)(Number(e));
          }
          get iterationDuration() {
            let { delay: e = 0 } = this.options || {};
            return this.duration + (0, scope.z)(e);
          }
          get time() {
            return (0, scope.z)(Number(this.animation.currentTime) || 0);
          }
          set time(e) {
            let t = this.finishedTime !== null;
            this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = (0, scope.R)(e), t && this.animation.pause();
          }
          get speed() {
            return this.animation.playbackRate;
          }
          set speed(e) {
            e < 0 && (this.finishedTime = null), this.animation.playbackRate = e;
          }
          get state() {
            return this.finishedTime === null ? this.animation.playState : `finished`;
          }
          get startTime() {
            return this.manualStartTime ?? Number(this.animation.startTime);
          }
          set startTime(e) {
            this.manualStartTime = this.animation.startTime = e;
          }
          attachTimeline({ timeline: e, onAttach: t, observe: n, ...r }) {
            return this.allowFlatten && this.animation.effect?.updateTiming({ easing: `linear` }), this.animation.onfinish = null, e && (0, scope.Or)() ? (this.animation.timeline = e, Object.assign(this.animation, r), t?.(this.animation), scope.se) : n(this);
          }
        };
        break;
      }
      case 139: {
        scope.Lr = { anticipate: scope.xe, backInOut: scope.be, circInOut: scope.we };
        break;
      }
      case 140: {
        scope.Br = 10;
        break;
      }
      case 141: {
        scope.Vr = class extends scope.Ir {
          constructor(e) {
            (0, scope.zr)(e), (0, scope.kn)(e), super(e), e.startTime !== void 0 && e.autoplay !== false && (this.startTime = e.startTime), this.options = e;
          }
          updateMotionValue(e) {
            let { motionValue: t, onUpdate: n, onComplete: r, element: i, ...a } = this.options;
            if (!t) return;
            if (e !== void 0) {
              t.set(e);
              return;
            }
            let o = new scope.Fn({ ...a, autoplay: false }), s = Math.max(scope.Br, scope.V.now() - this.startTime), c2 = (0, scope.re)(0, scope.Br, s - scope.Br), l = o.sample(s).value, { name: u } = this.options;
            i && u && (0, scope.Tr)(i, u, l), t.setWithVelocity(o.sample(Math.max(0, s - c2)).value, l, c2), o.stop();
          }
        };
        break;
      }
      case 142: {
        scope.Hr = (e, t) => t !== `zIndex` && !!(typeof e == `number` || Array.isArray(e) || typeof e == `string` && (scope.Et.test(e) || e === `0`) && !e.startsWith(`url(`));
        break;
      }
      case 143: {
        scope.Kr = /* @__PURE__ */ new Set([`opacity`, `clipPath`, `filter`, `transform`, `backgroundColor`]);
        break;
      }
      case 144: {
        scope.qr = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
        break;
      }
      case 145: {
        scope.Yr = /* @__PURE__ */ new Set([
          `color`,
          `backgroundColor`,
          `outlineColor`,
          `fill`,
          `stroke`,
          `borderColor`,
          `borderTopColor`,
          `borderRightColor`,
          `borderBottomColor`,
          `borderLeftColor`
        ]);
        break;
      }
      case 146: {
        scope.Xr = (0, scope.oe)(() => Object.hasOwnProperty.call(Element.prototype, `animate`));
        break;
      }
      case 147: {
        scope.Qr = 40;
        break;
      }
      case 148: {
        scope.$r = class extends scope.Nn {
          constructor(e) {
            super(), this.stop = () => {
              this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel();
            }, this.createdAt = scope.V.now();
            let { keyframes: t, name: n, motionValue: r, element: i } = e, a = e;
            a.autoplay ??= true, a.delay ??= 0, a.type ??= `keyframes`, a.repeat ??= 0, a.repeatDelay ??= 0, a.repeatType ??= `loop`;
            let o = i?.KeyframeResolver || scope.Cr;
            this.keyframeResolver = new o(
              t,
              (e2, t2, n2) => this.onKeyframesResolved(e2, t2, a, !n2),
              n,
              r,
              i
            ), this.keyframeResolver?.scheduleResolve();
          }
          onKeyframesResolved(e, t, n, r) {
            this.keyframeResolver = void 0;
            let { name: i, type: a, velocity: o, delay: s, isHandoff: c2, onUpdate: l } = n;
            this.resolvedAt = scope.V.now();
            let u = true;
            (0, scope.Wr)(e, i, a, o) || (u = false, (scope.ie.instantAnimations || !s) && l?.((0, scope.Dn)(e, n, t)), e[0] = e[e.length - 1], (0, scope.Gr)(n), n.repeat = 0);
            let d = r ? this.resolvedAt && this.resolvedAt - this.createdAt > scope.Qr ? this.resolvedAt : this.createdAt : void 0, { onComplete: f2 } = n;
            n.startTime ??= d, n.finalKeyframe = t, n.keyframes = e, n.onComplete = () => {
              f2?.(), this.notifyFinished();
            };
            let p = u && !c2 && (0, scope.Zr)(n), m;
            if (p) {
              n.element = n.motionValue?.owner?.current;
              try {
                m = new scope.Vr(n);
              } catch {
                m = new scope.Fn(n);
              }
            } else m = new scope.Fn(n);
            this.pendingTimeline &&= (this.stopTimeline = m.attachTimeline(this.pendingTimeline), void 0), this._animation = m;
          }
          get finished() {
            return this._animation ? this._animation.finished : super.finished;
          }
          then(e, t) {
            return this.finished.finally(e).then(() => {
            });
          }
          get animation() {
            return this._animation || (this.keyframeResolver?.resume(), (0, scope.xr)()), this._animation;
          }
          get duration() {
            return this.animation.duration;
          }
          get iterationDuration() {
            return this.animation.iterationDuration;
          }
          get time() {
            return this.animation.time;
          }
          set time(e) {
            this.animation.time = e;
          }
          get speed() {
            return this.animation.speed;
          }
          get state() {
            return this.animation.state;
          }
          set speed(e) {
            this.animation.speed = e;
          }
          get startTime() {
            return this.animation.startTime;
          }
          attachTimeline(e) {
            return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop();
          }
          play() {
            this.animation.play();
          }
          pause() {
            this.animation.pause();
          }
          complete() {
            this.animation.complete();
          }
          cancel() {
            this._animation && this.animation.cancel(), this.keyframeResolver?.cancel();
          }
        };
        break;
      }
      case 149: {
        scope.ti = 30;
        break;
      }
      case 150: {
        scope.ni = (e) => !isNaN(parseFloat(e));
        break;
      }
      case 151: {
        scope.ri = { current: void 0 };
        break;
      }
      case 152: {
        scope.ii = class {
          constructor(e, t = {}) {
            this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (e2) => {
              let t2 = scope.V.now();
              if (this.updatedAt !== t2 && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(e2), this.current !== this.prev && (this.notifyChange(), this.dependents))
                for (let e3 of this.dependents) e3.dirty();
            }, this.hasAnimated = false, this.setCurrent(e), this.owner = t.owner;
          }
          setCurrent(e) {
            this.current = e, this.updatedAt = scope.V.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = (0, scope.ni)(this.current));
          }
          setPrevFrameValue(e = this.current) {
            this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
          }
          onChange(e) {
            return this.on(`change`, e);
          }
          on(e, t) {
            var n;
            return e === `change` ? this.onChangeSubscribe(t) : ((n = this.events)[e] || (n[e] = new scope.le())).add(t);
          }
          onChangeSubscribe(e) {
            let { events: t } = this;
            return !t.change && !this.changeSubscriber ? this.changeSubscriber = e : (t.change || (t.change = new scope.le(), t.change.add(this.changeSubscriber), this.changeSubscriber = void 0), t.change.add(e)), () => {
              this.changeSubscriber === e ? this.changeSubscriber = void 0 : t.change?.remove(e), this.stopIfUnobserved();
            };
          }
          stopIfUnobserved() {
            scope.G.read(() => {
              !this.changeSubscriber && !this.events.change?.getSize() && this.stop();
            });
          }
          clearListeners() {
            this.changeSubscriber = void 0;
            for (let e in this.events) this.events[e].clear();
          }
          attach(e, t) {
            this.passiveEffect = e, this.stopPassiveEffect = t;
          }
          set(e) {
            this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
          }
          setWithVelocity(e, t, n) {
            this.set(t), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - n;
          }
          jump(e, t = true) {
            this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, t && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
          }
          dirty() {
            this.notifyChange();
          }
          notifyChange() {
            let { current: e, changeSubscriber: t } = this;
            t ? t(e) : this.events.change?.notify(e);
          }
          addDependent(e) {
            this.dependents ||= /* @__PURE__ */ new Set(), this.dependents.add(e);
          }
          removeDependent(e) {
            this.dependents && this.dependents.delete(e);
          }
          get() {
            return scope.ri.current && scope.ri.current.push(this), this.current;
          }
          getPrevious() {
            return this.prev;
          }
          getVelocity() {
            let e = scope.V.now();
            if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > scope.ti)
              return 0;
            let t = Math.min(this.updatedAt - this.prevUpdatedAt, scope.ti);
            return (0, scope.ue)(parseFloat(this.current) - parseFloat(this.prevFrameValue), t);
          }
          start(e) {
            return this.stop(), new Promise((t) => {
              this.hasAnimated = true;
              let n = false, r;
              r = e(() => {
                n = true, this.events.animationComplete?.notify(), this.animation === r && this.clearAnimation(), t();
              }), n || (this.animation = r), this.events.animationStart?.notify();
            });
          }
          stop() {
            this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
          }
          isAnimating() {
            return !!this.animation;
          }
          clearAnimation() {
            this.animation = void 0;
          }
          destroy() {
            this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
          }
        };
        break;
      }
      case 153: {
        scope.ci = { type: `spring`, stiffness: 500, damping: 25, restSpeed: 10 };
        break;
      }
      case 154: {
        scope.li = (e) => ({
          type: `spring`,
          stiffness: 550,
          damping: e === 0 ? 2 * Math.sqrt(550) : 30,
          restSpeed: 10
        });
        break;
      }
      case 155: {
        scope.ui = { type: `keyframes`, duration: 0.8 };
        break;
      }
      case 156: {
        scope.di = { type: `keyframes`, ease: [0.25, 0.1, 0.35, 1], duration: 0.3 };
        break;
      }
      case 157: {
        scope.fi = (e, { keyframes: t }) => t.length > 2 ? scope.ui : scope.sr.has(e) ? e.startsWith(`scale`) ? (0, scope.li)(t[1]) : scope.ci : scope.di;
        break;
      }
      case 158: {
        scope.pi = /* @__PURE__ */ new Set([
          `when`,
          `delay`,
          `delayChildren`,
          `staggerChildren`,
          `staggerDirection`,
          `repeat`,
          `repeatType`,
          `repeatDelay`,
          `from`,
          `elapsed`
        ]);
        break;
      }
      case 159: {
        scope.hi = (e, t, n, r = {}, i, a) => (o) => {
          let s = (0, scope.si)(r, e) || {}, c2 = s.delay || r.delay || 0, { elapsed: l = 0 } = r;
          l -= (0, scope.R)(c2);
          let u = {
            keyframes: Array.isArray(n) ? n : [null, n],
            ease: `easeOut`,
            velocity: t.getVelocity(),
            ...s,
            delay: -l,
            onUpdate: (e2) => {
              t.set(e2), s.onUpdate && s.onUpdate(e2);
            },
            onComplete: () => {
              o(), s.onComplete && s.onComplete();
            },
            name: e,
            motionValue: t,
            element: a ? void 0 : i
          };
          (0, scope.mi)(s) || Object.assign(u, (0, scope.fi)(e, u)), u.duration &&= (0, scope.R)(u.duration), u.repeatDelay &&= (0, scope.R)(u.repeatDelay), u.from !== void 0 && (u.keyframes[0] = u.from);
          let d = false;
          if ((u.type === false || u.duration === 0 && !u.repeatDelay) && ((0, scope.Gr)(u), u.delay === 0 && (d = true)), (scope.ie.instantAnimations || scope.ie.skipAnimations || i?.shouldSkipAnimations || s.skipAnimations) && (d = true, (0, scope.Gr)(u), u.delay = 0), u.allowFlatten = !s.type && !s.ease, d && !a && t.get() !== void 0) {
            let e2 = (0, scope.Dn)(u.keyframes, s);
            if (e2 !== void 0) {
              scope.G.update(() => {
                u.onUpdate(e2), u.onComplete();
              });
              return;
            }
          }
          return s.isSync ? new scope.Fn(u) : new scope.$r(u);
        };
        break;
      }
      case 160: {
        scope.gi = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
        break;
      }
      case 161: {
        scope.Si = (e, t) => t === `exit` ? e.presenceContext?.custom : void 0;
        break;
      }
      case 162: {
        scope.Ci = /* @__PURE__ */ new Set([`width`, `height`, `top`, `left`, `right`, `bottom`, ...scope.or]);
        break;
      }
      case 163: {
        scope.wi = (e) => Array.isArray(e);
        break;
      }
      case 164: {
        scope.q = (e) => !!(e && e.getVelocity);
        break;
      }
      case 165: {
        scope.ji = `data-` + (0, scope.Ai)(`framerAppearId`);
        break;
      }
      case 166: {
        scope.Ni = typeof window < `u`;
        break;
      }
      case 167: {
        scope.Ri = { test: (e) => e === `auto`, parse: (e) => e };
        break;
      }
      case 168: {
        scope.zi = (e) => (t) => t.test(e);
        break;
      }
      case 169: {
        scope.Bi = [scope.He, scope.H, scope.rt, scope.nt, scope.at, scope.it, scope.Ri];
        break;
      }
      case 170: {
        scope.Vi = (e) => scope.Bi.find((0, scope.zi)(e));
        break;
      }
      case 171: {
        scope.Ui = /* @__PURE__ */ new Set([`auto`, `none`, `0`]);
        break;
      }
      case 172: {
        scope.Gi = class extends scope.Cr {
          constructor(e, t, n, r, i) {
            super(e, t, n, r, i, true);
          }
          readKeyframes() {
            let { unresolvedKeyframes: e, element: t, name: n } = this;
            if (!t || !t.current) return;
            super.readKeyframes();
            for (let n2 = 0; n2 < e.length; n2++) {
              let r2 = e[n2];
              if (typeof r2 == `string` && (r2 = r2.trim(), (0, scope.ze)(r2))) {
                let i2 = (0, scope.vi)(r2, t.current);
                i2 !== void 0 && (e[n2] = i2), n2 === e.length - 1 && (this.finalKeyframe = r2);
              }
            }
            if (this.resolveNoneKeyframes(), !scope.Ci.has(n) || e.length !== 2) return;
            let [r, i] = e;
            if (typeof r == `number` && typeof i == `number`) return;
            let a = (0, scope.Vi)(r), o = (0, scope.Vi)(i);
            if ((0, scope.Ve)(r) !== (0, scope.Ve)(i) && scope.mr[n]) this.needsMeasurement = true;
            else if (a !== o) {
              if ((0, scope.cr)(a) && (0, scope.cr)(o))
                for (let t2 = 0; t2 < e.length; t2++) {
                  let n2 = e[t2];
                  typeof n2 == `string` && (e[t2] = parseFloat(n2));
                }
              else scope.mr[n] && (this.needsMeasurement = true);
            }
          }
          resolveNoneKeyframes() {
            let { unresolvedKeyframes: e, name: t } = this, n = [];
            for (let t2 = 0; t2 < e.length; t2++) (e[t2] === null || (0, scope.Hi)(e[t2])) && n.push(t2);
            n.length && (0, scope.Wi)(e, n, t);
          }
          measure() {
            let { element: e, name: t } = this;
            return scope.mr[t](window.getComputedStyle(e.current), () => e.measureViewportBox());
          }
          measureInitialState() {
            let { element: e, unresolvedKeyframes: t, name: n } = this;
            if (!e || !e.current) return;
            n === `height` && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = this.measure(), t[0] = this.measuredOrigin;
            let r = t[t.length - 1];
            r !== void 0 && this.motionValue?.jump(r, false);
          }
          measureEndState() {
            let { element: e, unresolvedKeyframes: t } = this;
            if (!e || !e.current) return;
            this.motionValue?.jump(this.measuredOrigin, false);
            let n = t.length - 1, r = t[n];
            t[n] = this.measure(), r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r), this.removedTransforms?.length && this.removedTransforms.forEach(([t2, n2]) => {
              e.getValue(t2).set(n2);
            }), this.resolveNoneKeyframes();
          }
        };
        break;
      }
      case 173: {
        scope.Ki = [
          `borderTopLeftRadius`,
          `borderTopRightRadius`,
          `borderBottomRightRadius`,
          `borderBottomLeftRadius`
        ];
        break;
      }
      case 174: {
        scope.Yi = (e, t) => t && typeof e == `number` ? t.transform(e) : e;
        break;
      }
      case 175: {
        scope.Zi = {
          x: `translateX`,
          y: `translateY`,
          z: `translateZ`,
          transformPerspective: `perspective`
        };
        break;
      }
      case 176: {
        scope.Qi = scope.or.length;
        break;
      }
      case 177: {
        scope.ta = { offset: `stroke-dashoffset`, array: `stroke-dasharray` };
        break;
      }
      case 178: {
        scope.na = { offset: `strokeDashoffset`, array: `strokeDasharray` };
        break;
      }
      case 179: {
        scope.ia = [
          `transform`,
          `opacity`,
          `offsetDistance`,
          `offsetPath`,
          `offsetRotate`,
          `offsetAnchor`
        ];
        break;
      }
      case 180: {
        scope.va = 0.999999999999;
        break;
      }
      case 181: {
        scope.ya = 1.0000000000001;
        break;
      }
      case 182: {
        ({ schedule: scope.Da, cancel: scope.Oa } = (0, scope.Yt)(queueMicrotask, false));
        break;
      }
      case 183: {
        scope.ka = { x: false, y: false };
        break;
      }
      case 184: {
        scope.Fa = (e, t) => t ? e === t || (0, scope.Fa)(e, t.parentElement) : false;
        break;
      }
      case 185: {
        scope.Ia = (e) => e.pointerType === `mouse` ? typeof e.button != `number` || e.button <= 0 : e.isPrimary !== false;
        break;
      }
      case 186: {
        scope.La = /* @__PURE__ */ new Set([`BUTTON`, `INPUT`, `SELECT`, `TEXTAREA`, `A`]);
        break;
      }
      case 187: {
        scope.za = /* @__PURE__ */ new Set([`INPUT`, `SELECT`, `TEXTAREA`]);
        break;
      }
      case 188: {
        scope.Va = /* @__PURE__ */ new WeakSet();
        break;
      }
      case 189: {
        scope.Wa = (e, t) => {
          let n = e.currentTarget;
          if (!n) return;
          let r = (0, scope.Ha)(() => {
            if (scope.Va.has(n)) return;
            (0, scope.Ua)(n, `down`);
            let e2 = (0, scope.Ha)(() => {
              (0, scope.Ua)(n, `up`);
            });
            n.addEventListener(`keyup`, e2, t), n.addEventListener(`blur`, () => (0, scope.Ua)(n, `cancel`), t);
          });
          n.addEventListener(`keydown`, r, t), n.addEventListener(`blur`, () => n.removeEventListener(`keydown`, r), t);
        };
        break;
      }
      case 190: {
        scope.Ka = /* @__PURE__ */ new WeakSet();
        break;
      }
      case 191: {
        scope.Ja = /* @__PURE__ */ new WeakMap();
        break;
      }
      case 192: {
        scope.Xa = (e, t, n) => (r, i) => i && i[0] ? i[0][e + `Size`] : (0, scope.Ji)(r) && `getBBox` in r ? r.getBBox()[t] : r[n];
        break;
      }
      case 193: {
        scope.Za = (0, scope.Xa)(`inline`, `width`, `offsetWidth`);
        break;
      }
      case 194: {
        scope.Qa = (0, scope.Xa)(`block`, `height`, `offsetHeight`);
        break;
      }
      case 195: {
        scope.ro = /* @__PURE__ */ new Set();
        break;
      }
      case 196: {
        scope.co = { value: null, addProjectionMetrics: null };
        break;
      }
      case 197: {
        scope.uo = (e) => typeof e == `number` ? e : parseFloat(e);
        break;
      }
      case 198: {
        scope.fo = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 });
        break;
      }
      case 199: {
        scope.po = () => ({ x: (0, scope.fo)(), y: (0, scope.fo)() });
        break;
      }
      case 200: {
        scope.mo = () => ({ min: 0, max: 0 });
        break;
      }
      case 201: {
        scope.J = () => ({ x: (0, scope.mo)(), y: (0, scope.mo)() });
        break;
      }
      case 202: {
        scope.ho = /* @__PURE__ */ new WeakMap();
        break;
      }
      case 203: {
        scope.vo = [
          `animate`,
          `whileInView`,
          `whileFocus`,
          `whileHover`,
          `whileTap`,
          `whileDrag`,
          `exit`
        ];
        break;
      }
      case 204: {
        scope.yo = [`initial`, ...scope.vo];
        break;
      }
      case 205: {
        scope.Co = { current: null };
        break;
      }
      case 206: {
        scope.wo = { current: false };
        break;
      }
      case 207: {
        scope.To = typeof window < `u`;
        break;
      }
      case 208: {
        scope.Do = [
          `AnimationStart`,
          `AnimationComplete`,
          `Update`,
          `BeforeLayoutMeasure`,
          `LayoutMeasure`,
          `LayoutAnimationStart`,
          `LayoutAnimationComplete`
        ];
        break;
      }
      case 209: {
        scope.Oo = {};
        break;
      }
      case 210: {
        scope.jo = class {
          scrapeMotionValuesFromProps(e, t, n) {
            return {};
          }
          constructor({
            parent: e,
            props: t,
            presenceContext: n,
            reducedMotionConfig: r,
            skipAnimations: i,
            blockInitialAnimation: a,
            visualState: o
          }, s = {}) {
            this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = false, this.isControllingVariants = false, this.shouldReduceMotion = null, this.shouldSkipAnimations = false, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = scope.Cr, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = false, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify(`Update`, this.latestValues), this.render = () => {
              this.current && (this.triggerBuild(), this.renderInstance(
                this.current,
                this.renderState,
                this.props.style,
                this.projection
              ));
            }, this.renderScheduledAt = 0, this.scheduleRender = () => {
              let e2 = scope.V.now();
              this.renderScheduledAt < e2 && (this.renderScheduledAt = e2, scope.G.render(this.render, false, true));
            };
            let { latestValues: c2, renderState: l } = o;
            this.latestValues = c2, this.baseTarget = { ...c2 }, this.initialValues = t.initial ? { ...c2 } : {}, this.renderState = l, this.parent = e, this.props = t, this.presenceContext = n, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = r, this.skipAnimationsConfig = i, this.options = s, this.blockInitialAnimation = !!a, this.isControllingVariants = (0, scope.bo)(t), this.isVariantNode = (0, scope.xo)(t), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
            let { willChange: u, ...d } = this.scrapeMotionValuesFromProps(t, {}, this);
            for (let e2 in d) {
              let t2 = d[e2];
              c2[e2] !== void 0 && (0, scope.q)(t2) && t2.set(c2[e2]);
            }
          }
          mount(e) {
            if (this.hasBeenMounted)
              for (let e2 in this.initialValues)
                this.values.get(e2)?.jump(this.initialValues[e2]), this.latestValues[e2] = this.initialValues[e2];
            if (this.current = e, scope.ho.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.isVariantNode && !this.isControllingVariants) {
              let e2 = this;
              do
                e2 = e2.props.inherit !== false && e2.parent;
              while (e2 && !e2.isVariantNode);
              if (e2) {
                let { variantChildren: t } = e2;
                t.add(this), this.removeFromVariantTree = () => t.delete(this);
              }
            }
            this.values.forEach((e2, t) => this.bindToMotionValue(t, e2)), this.reducedMotionConfig === `never` ? this.shouldReduceMotion = false : this.reducedMotionConfig === `always` ? this.shouldReduceMotion = true : (scope.wo.current || (0, scope.Eo)(), this.shouldReduceMotion = scope.Co.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? false, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = true;
          }
          unmount() {
            this.projection && this.projection.unmount(), (0, scope.Xt)(this.notifyUpdate), (0, scope.Xt)(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), this.parent?.removeChild(this);
            for (let e in this.events) this.events[e].clear();
            for (let e in this.features) {
              let t = this.features[e];
              t && (t.unmount(), t.isMounted = false);
            }
            this.current = null;
          }
          addChild(e) {
            this.children.add(e), this.enteringChildren ??= /* @__PURE__ */ new Set(), this.enteringChildren.add(e);
          }
          removeChild(e) {
            this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e);
          }
          bindToMotionValue(e, t) {
            if (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(), t.accelerate && scope.Kr.has(e) && this.current instanceof HTMLElement) {
              let { factory: n2, keyframes: r2, times: i2, ease: a, duration: o } = t.accelerate, s = new scope.Ir({
                element: this.current,
                name: e,
                keyframes: r2,
                times: i2,
                ease: a,
                duration: (0, scope.R)(o)
              }), c2 = n2(s);
              this.valueSubscriptions.set(e, () => {
                c2(), s.cancel();
              });
              return;
            }
            let n = scope.sr.has(e);
            n && this.onBindTransform && this.onBindTransform();
            let r = t.on(`change`, (t2) => {
              this.latestValues[e] = t2, this.props.onUpdate && scope.G.preRender(this.notifyUpdate), n && this.projection && (this.projection.isTransformDirty = true), this.scheduleRender();
            }), i;
            typeof window < `u` && window.MotionCheckAppearSync && (i = window.MotionCheckAppearSync(this, e, t)), this.valueSubscriptions.set(e, () => {
              r(), i && i();
            });
          }
          sortNodePosition(e) {
            return !this.current || !e.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
          }
          updateFeatures() {
            let e = `animation`;
            for (e in scope.Oo) {
              let t = scope.Oo[e];
              if (!t) continue;
              let { isEnabled: n, Feature: r } = t;
              if (!this.features[e] && r && n(this.props) && (this.features[e] = new r(this)), this.features[e]) {
                let t2 = this.features[e];
                t2.isMounted ? t2.update() : (t2.mount(), t2.isMounted = true);
              }
            }
          }
          triggerBuild() {
            this.build(this.renderState, this.latestValues, this.props);
          }
          measureViewportBox() {
            return this.current ? this.measureInstanceViewportBox(this.current, this.props) : (0, scope.J)();
          }
          getStaticValue(e) {
            return this.latestValues[e];
          }
          setStaticValue(e, t) {
            this.latestValues[e] = t;
          }
          update(e, t) {
            (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = t;
            for (let t2 = 0; t2 < scope.Do.length; t2++) {
              let n = scope.Do[t2];
              this.propEventSubscriptions[n] && (this.propEventSubscriptions[n](), delete this.propEventSubscriptions[n]);
              let r = e[`on` + n];
              r && (this.propEventSubscriptions[n] = this.on(n, r));
            }
            this.prevMotionValues = (0, scope.So)(
              this,
              this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this),
              this.prevMotionValues
            ), this.handleChildMotionValue && this.handleChildMotionValue();
          }
          getProps() {
            return this.props;
          }
          getVariant(e) {
            return this.props.variants ? this.props.variants[e] : void 0;
          }
          getDefaultTransition() {
            return this.props.transition;
          }
          getTransformPagePoint() {
            return this.props.transformPagePoint;
          }
          addValue(e, t) {
            let n = this.values.get(e);
            if (t !== n) {
              n && this.removeValue(e), this.bindToMotionValue(e, t), this.values.set(e, t);
              let r = t.get();
              r !== void 0 && (this.latestValues[e] = r);
            }
          }
          removeValue(e) {
            this.values.delete(e);
            let t = this.valueSubscriptions.get(e);
            t && (t(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
          }
          hasValue(e) {
            return this.values.has(e);
          }
          getValue(e, t) {
            if (this.props.values && this.props.values[e]) return this.props.values[e];
            let n = this.values.get(e);
            return n === void 0 && t !== void 0 && (n = (0, scope.ai)(t ?? this.getDefaultValue?.(e), { owner: this }), this.addValue(e, n)), n;
          }
          readValue(e, t) {
            let n = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
            return n != null && (typeof n == `string` && ((0, scope.ae)(n) || (0, scope.I)(n)) ? n = parseFloat(n) : typeof n != `number` && !scope.Et.test(n) && scope.Et.test(t) && (n = (0, scope.Kn)(e, t)), this.setBaseTarget(e, (0, scope.q)(n) ? n.get() : n)), (0, scope.q)(n) ? n.get() : n;
          }
          setBaseTarget(e, t) {
            this.baseTarget[e] = t;
          }
          on(e, t) {
            return this.events[e] || (this.events[e] = new scope.le()), this.events[e].add(t);
          }
          notify(e, ...t) {
            this.events[e] && this.events[e].notify(...t);
          }
          scheduleRenderMicrotask() {
            scope.Da.render(this.render);
          }
        };
        break;
      }
      case 211: {
        scope.Mo = class extends scope.jo {
          constructor() {
            super(...arguments), this.KeyframeResolver = scope.Gi;
          }
          sortInstanceNodePosition(e, t) {
            return e.compareDocumentPosition(t) & 2 ? 1 : -1;
          }
          getBaseTargetFromProps(e, t) {
            let n = e.style;
            return n ? n[t] : void 0;
          }
          removeValueFromRenderState(e, { vars: t, style: n }) {
            delete t[e], delete n[e];
          }
          handleChildMotionValue() {
            this.childSubscription && (this.childSubscription(), delete this.childSubscription);
            let { children: e } = this.props;
            (0, scope.q)(e) && (this.childSubscription = e.on(`change`, (e2) => {
              this.current && (this.current.textContent = `${e2}`);
            }));
          }
        };
        break;
      }
      case 212: {
        scope.No = class {
          constructor(e) {
            this.isMounted = false, this.node = e;
          }
          update() {
          }
        };
        break;
      }
      case 213: {
        scope.Fo = {};
        break;
      }
      case 214: {
        scope.zo = class extends scope.Mo {
          constructor() {
            super(...arguments), this.type = `html`, this.renderInstance = scope.Po;
          }
          mount(e) {
            e.style, super.mount(e);
          }
          readValueFromInstance(e, t) {
            if (scope.sr.has(t))
              return this.projection?.isProjecting ? (0, scope.nr)(t) : (0, scope.ir)(e, t);
            {
              let n = (0, scope.Ro)(e), r = ((0, scope.Le)(t) ? n.getPropertyValue(t) : n[t]) || 0;
              return typeof r == `string` ? r.trim() : r;
            }
          }
          measureInstanceViewportBox(e, { transformPagePoint: t }) {
            return (0, scope.Ta)(e, t);
          }
          build(e, t, n) {
            (0, scope.ea)(e, t, n.transformTemplate);
          }
          scrapeMotionValuesFromProps(e, t, n) {
            return (0, scope.Lo)(e, t, n);
          }
        };
        break;
      }
      case 215: {
        scope.Bo = /* @__PURE__ */ new Set([
          `baseFrequency`,
          `diffuseConstant`,
          `kernelMatrix`,
          `kernelUnitLength`,
          `keySplines`,
          `keyTimes`,
          `limitingConeAngle`,
          `markerHeight`,
          `markerWidth`,
          `numOctaves`,
          `targetX`,
          `targetY`,
          `surfaceScale`,
          `specularConstant`,
          `specularExponent`,
          `stdDeviation`,
          `tableValues`,
          `viewBox`,
          `gradientTransform`,
          `pathLength`,
          `startOffset`,
          `textLength`,
          `lengthAdjust`
        ]);
        break;
      }
      case 216: {
        scope.Vo = (e) => typeof e == `string` && e.toLowerCase() === `svg`;
        break;
      }
      case 217: {
        scope.Wo = class extends scope.Mo {
          constructor() {
            super(...arguments), this.type = `svg`, this.isSVGTag = false, this.measureInstanceViewportBox = scope.J;
          }
          getBaseTargetFromProps(e, t) {
            return scope.sr.has(t) ? super.getBaseTargetFromProps(e, t) ?? (0, scope.nr)(t) : e[t];
          }
          getDefaultValue(e) {
            return scope.sr.has(e) ? this.latestValues[e] ?? (0, scope.nr)(e) : void 0;
          }
          readValueFromInstance(e, t) {
            if (scope.sr.has(t)) {
              let e2 = (0, scope.Wn)(t);
              return e2 && e2.default || 0;
            }
            if (scope.ia.includes(t)) {
              let n = getComputedStyle(e)[t];
              if (typeof n == `string` && n) return n.trim();
            }
            return t = scope.Bo.has(t) ? t : (0, scope.Ai)(t), e.getAttribute(t);
          }
          scrapeMotionValuesFromProps(e, t, n) {
            return (0, scope.Uo)(e, t, n);
          }
          build(e, t, n) {
            (0, scope.aa)(e, t, this.isSVGTag, n.transformTemplate, n.style);
          }
          renderInstance(e, t, n, r) {
            (0, scope.Ho)(e, t, n, r);
          }
          mount(e) {
            this.isSVGTag = (0, scope.Vo)(e.tagName), super.mount(e);
          }
        };
        break;
      }
      case 218: {
        scope.Ko = [...scope.vo].reverse();
        break;
      }
      case 219: {
        scope.$o = 0.9999;
        break;
      }
      case 220: {
        scope.es = 1.0001;
        break;
      }
      case 221: {
        scope.ts = -0.01;
        break;
      }
      case 222: {
        scope.ns = 0.01;
        break;
      }
      case 223: {
        scope.ms = [`x`, `scaleX`, `originX`];
        break;
      }
      case 224: {
        scope.hs = [`y`, `scaleY`, `originY`];
        break;
      }
      case 225: {
        scope.Ds = {
          correct: (e, t) => {
            if (!t.target) return e;
            if (typeof e == `string`) {
              if (scope.H.test(e)) e = parseFloat(e);
              else return e;
            }
            return `${(0, scope.Es)(e, t.target.x)}% ${(0, scope.Es)(e, t.target.y)}%`;
          }
        };
        break;
      }
      case 226: {
        scope.Os = {
          correct: (e, { treeScale: t, projectionDelta: n }) => {
            let r = e, i = scope.Et.parse(e);
            if (i.length > 5) return r;
            let a = scope.Et.createTransformer(e), o = typeof i[0] == `number` ? 0 : 1, s = n.x.scale * t.x, c2 = n.y.scale * t.y;
            i[0 + o] /= s, i[1 + o] /= c2;
            let l = (0, scope.W)(s, c2, 0.5);
            return typeof i[2 + o] == `number` && (i[2 + o] /= l), typeof i[3 + o] == `number` && (i[3 + o] /= l), a(i);
          }
        };
        break;
      }
      case 227: {
        scope.As = scope.Ki.length;
        break;
      }
      case 228: {
        scope.js = (e) => typeof e == `number` || scope.H.test(e);
        break;
      }
      case 229: {
        scope.Ps = (0, scope.Is)(0, 0.5, scope.Ce);
        break;
      }
      case 230: {
        scope.Fs = (0, scope.Is)(0.5, 0.95, scope.se);
        break;
      }
      case 231: {
        scope.zs = (e, t) => e.depth - t.depth;
        break;
      }
      case 232: {
        scope.Bs = class {
          constructor() {
            this.children = [], this.isDirty = false;
          }
          add(e) {
            (0, scope.P)(this.children, e), this.isDirty = true;
          }
          remove(e) {
            (0, scope.ne)(this.children, e), this.isDirty = true;
          }
          forEach(e) {
            this.isDirty && this.children.sort(scope.zs), this.isDirty = false, this.children.forEach(e);
          }
        };
        break;
      }
      case 233: {
        scope.Us = class {
          constructor() {
            this.members = [];
          }
          add(e) {
            (0, scope.P)(this.members, e);
            for (let t = this.members.length - 1; t >= 0; t--) {
              let n = this.members[t];
              if (n === e || n === this.lead || n === this.prevLead) continue;
              let r = n.instance;
              (!r || r.isConnected === false) && !n.snapshot && ((0, scope.ne)(this.members, n), n.unmount());
            }
            e.scheduleRender();
          }
          remove(e) {
            if ((0, scope.ne)(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
              let e2 = this.members[this.members.length - 1];
              e2 && this.promote(e2);
            }
          }
          relegate(e) {
            for (let t = this.members.indexOf(e) - 1; t >= 0; t--) {
              let e2 = this.members[t];
              if (e2.isPresent !== false && e2.instance?.isConnected !== false)
                return this.promote(e2), true;
            }
            return false;
          }
          promote(e, t) {
            let n = this.lead;
            if (e !== n && (this.prevLead = n, this.lead = e, e.show(), n)) {
              n.updateSnapshot(), e.scheduleRender();
              let { layoutDependency: r } = n.options, { layoutDependency: i } = e.options;
              (r === void 0 || r !== i) && (e.resumeFrom = n, t && (n.preserveOpacity = true), n.snapshot && (e.snapshot = n.snapshot, e.snapshot.latestValues = n.animationValues || n.latestValues), e.root?.isUpdating && (e.isLayoutDirty = true)), e.options.crossfade === false && n.hide();
            }
          }
          exitAnimationComplete() {
            this.members.forEach((e) => {
              e.options.onExitComplete?.(), e.resumingFrom?.options.onExitComplete?.();
            });
          }
          scheduleRender() {
            this.members.forEach((e) => e.instance && e.scheduleRender(false));
          }
          removeLeadSnapshot() {
            this.lead?.snapshot && (this.lead.snapshot = void 0);
          }
        };
        break;
      }
      case 234: {
        scope.Ws = {
          borderRadius: { ...scope.Ds, applyTo: [...scope.Ki] },
          borderTopLeftRadius: scope.Ds,
          borderTopRightRadius: scope.Ds,
          borderBottomLeftRadius: scope.Ds,
          borderBottomRightRadius: scope.Ds,
          boxShadow: scope.Os
        };
        break;
      }
      case 235: {
        scope.Gs = { hasAnimatedSinceResize: true, hasEverUpdated: false };
        break;
      }
      case 236: {
        Object.assign(scope.Fo, { ...scope.Ws, ...scope.Fo });
        break;
      }
      case 237: {
        scope.Ks = { nodes: 0, calculatedTargetDeltas: 0, calculatedProjections: 0 };
        break;
      }
      case 238: {
        scope.qs = [``, `X`, `Y`, `Z`];
        break;
      }
      case 239: {
        scope.Js = 1e3;
        break;
      }
      case 240: {
        scope.Ys = 0;
        break;
      }
      case 241: {
        scope.yc = { duration: 0.45, ease: [0.4, 0, 0.1, 1] };
        break;
      }
      case 242: {
        scope.bc = (e) => typeof navigator < `u` && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e);
        break;
      }
      case 243: {
        scope.xc = (0, scope.bc)(`applewebkit/`) && !(0, scope.bc)(`chrome/`) ? Math.round : scope.se;
        break;
      }
      case 244: {
        scope.Ec = (0, scope.Qs)({
          attachResizeListener: (e, t) => (0, scope.Rs)(e, `resize`, t),
          measureScroll: () => ({
            x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
            y: document.documentElement.scrollTop || document.body?.scrollTop || 0
          }),
          checkIsScrollRoot: () => true
        });
        break;
      }
      case 245: {
        scope.Dc = { current: void 0 };
        break;
      }
      case 246: {
        scope.Oc = (0, scope.Qs)({
          measureScroll: (e) => ({ x: e.scrollLeft, y: e.scrollTop }),
          defaultParent: () => {
            if (!scope.Dc.current) {
              let e = new scope.Ec({});
              e.mount(window), e.setOptions({ layoutScroll: true }), scope.Dc.current = e;
            }
            return scope.Dc.current;
          },
          resetTransform: (e, t) => {
            e.style.transform = t === void 0 ? `none` : t;
          },
          checkIsScrollRoot: (e) => window.getComputedStyle(e).position === `fixed`
        });
        break;
      }
      case 247: {
        scope.kc = (0, scope.k.createContext)({
          transformPagePoint: (e) => e,
          isStatic: false,
          reducedMotion: `never`
        });
        break;
      }
      case 248: {
        scope.Nc = class extends scope.k.Component {
          getSnapshotBeforeUpdate(e) {
            let t = this.props.childRef.current;
            if ((0, scope.qi)(t) && e.isPresent && !this.props.isPresent && this.props.pop !== false) {
              let e2 = t.offsetParent, n = (0, scope.qi)(e2) && e2.offsetWidth || 0, r = (0, scope.qi)(e2) && e2.offsetHeight || 0, i = getComputedStyle(t), a = this.props.sizeRef.current;
              a.height = parseFloat(i.height), a.width = parseFloat(i.width), a.top = t.offsetTop, a.left = t.offsetLeft, a.right = n - a.width - a.left, a.bottom = r - a.height - a.top, a.direction = i.direction;
            }
            return null;
          }
          componentDidUpdate() {
          }
          render() {
            return this.props.children;
          }
        };
        break;
      }
      case 249: {
        scope.Fc = ({
          children: e,
          initial: t,
          isPresent: n,
          onExitComplete: r,
          custom: i,
          presenceAffectsLayout: a,
          mode: o,
          anchorX: s,
          anchorY: c2,
          root: l
        }) => {
          let u = (0, scope.j)(scope.Ic), d = (0, scope.k.useId)(), f2 = (0, scope.k.useRef)(n), p = (0, scope.k.useRef)(r);
          (0, scope.M)(() => {
            f2.current = n, p.current = r;
          });
          let m = true, h = (0, scope.k.useMemo)(
            () => (m = false, {
              id: d,
              initial: t,
              isPresent: n,
              custom: i,
              onExitComplete: (e2) => {
                u.set(e2, true);
                for (let e3 of u.values()) if (!e3) return;
                r && r();
              },
              register: (e2) => (u.set(e2, false), () => {
                u.delete(e2), !f2.current && !u.size && p.current?.();
              })
            }),
            [n, u, r]
          );
          return a && m && (h = { ...h }), (0, scope.k.useMemo)(() => {
            u.forEach((e2, t2) => u.set(t2, false));
          }, [n]), scope.k.useEffect(() => {
            !n && !u.size && r && r();
          }, [n]), e = (0, scope.O.jsx)(scope.Pc, {
            pop: o === `popLayout`,
            isPresent: n,
            anchorX: s,
            anchorY: c2,
            root: l,
            children: e
          }), (0, scope.O.jsx)(scope.N.Provider, { value: h, children: e });
        };
        break;
      }
      case 250: {
        scope.Rc = (e) => e.key || ``;
        break;
      }
      case 251: {
        scope.Bc = ({
          children: e,
          custom: t,
          initial: n = true,
          onExitComplete: r,
          presenceAffectsLayout: i = true,
          mode: a = `sync`,
          propagate: o = false,
          anchorX: s = `left`,
          anchorY: c2 = `top`,
          root: l
        }) => {
          let [u, d] = (0, scope.Lc)(o), f2 = (0, scope.k.useMemo)(() => (0, scope.zc)(e), [e]), p = o && !u ? [] : f2.map(scope.Rc), m = (0, scope.k.useRef)(true), h = (0, scope.j)(() => /* @__PURE__ */ new Map()), g = (0, scope.k.useRef)(/* @__PURE__ */ new Set()), [_, v2] = (0, scope.k.useState)(f2), [y, b] = (0, scope.k.useState)(f2);
          (0, scope.M)(() => {
            o && !u && !y.length && d?.();
          }, [u, o, y.length, d]), (0, scope.M)(() => {
            m.current = false;
            for (let e2 = 0; e2 < y.length; e2++) {
              let t2 = (0, scope.Rc)(y[e2]);
              p.includes(t2) ? (h.delete(t2), g.current.delete(t2)) : h.get(t2) !== true && h.set(t2, false);
            }
          }, [y, p.length, p.join(`-`)]);
          let x = [];
          if (f2 !== _) {
            let e2 = [...f2], t2 = 0;
            for (let n2 of y) {
              let r2 = p.indexOf((0, scope.Rc)(n2));
              r2 === -1 ? (e2.splice(t2++, 0, n2), x.push(n2)) : t2 = r2 + x.length + 1;
            }
            return x.every((e3) => h.get((0, scope.Rc)(e3))) ? e2 = f2 : a === `wait` && (e2 = x), b((0, scope.zc)(e2)), v2(f2), null;
          }
          let { forceRender: S } = (0, scope.k.useContext)(scope.A);
          return (0, scope.O.jsx)(scope.O.Fragment, {
            children: y.map((e2) => {
              let _2 = (0, scope.Rc)(e2), b2 = o && !u ? false : f2 === y || p.includes(_2);
              return (0, scope.O.jsx)(
                scope.Fc,
                {
                  isPresent: b2,
                  initial: !m.current || n ? void 0 : false,
                  custom: t,
                  presenceAffectsLayout: i,
                  mode: a,
                  root: l,
                  onExitComplete: b2 ? void 0 : () => {
                    if (g.current.has(_2)) return;
                    if (h.has(_2)) g.current.add(_2), h.set(_2, true);
                    else return;
                    let e3 = true;
                    h.forEach((t2) => {
                      t2 || (e3 = false);
                    }), e3 && (S?.(), v2([]), o && d?.(), r && r());
                  },
                  anchorX: s,
                  anchorY: c2,
                  children: e2
                },
                _2
              );
            })
          });
        };
        break;
      }
      case 252: {
        scope.Vc = (0, scope.k.createContext)({ strict: false });
        break;
      }
      case 253: {
        scope.Hc = {
          animation: [
            `animate`,
            `variants`,
            `whileHover`,
            `whileTap`,
            `exit`,
            `whileInView`,
            `whileFocus`,
            `whileDrag`
          ],
          exit: [`exit`],
          drag: [`drag`, `dragControls`],
          focus: [`whileFocus`],
          hover: [`whileHover`, `onHoverStart`, `onHoverEnd`],
          tap: [`whileTap`, `onTap`, `onTapStart`, `onTapCancel`],
          pan: [`onPan`, `onPanStart`, `onPanSessionStart`, `onPanEnd`],
          inView: [`whileInView`, `onViewportEnter`, `onViewportLeave`],
          layout: [`layout`, `layoutId`]
        };
        break;
      }
      case 254: {
        scope.Uc = false;
        break;
      }
      case 255: {
        scope.qc = (0, scope.k.createContext)({});
        break;
      }
      case 256: {
        scope.Zc = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} });
        break;
      }
      case 257: {
        scope.nl = () => ({ ...(0, scope.Zc)(), attrs: {} });
        break;
      }
      case 258: {
        scope.il = new Set(
          `animate.exit.variants.initial.style.values.transition.transformTemplate.custom.inherit.onBeforeLayoutMeasure.onAnimationStart.onAnimationComplete.onUpdate.onDragStart.onDrag.onDragEnd.onMeasureDragConstraints.onDirectionLock.onDragTransitionEnd._dragX._dragY.onHoverStart.onHoverEnd.onViewportEnter.onViewportLeave.globalTapTarget.propagate.ignoreStrict.viewport`.split(
            `.`
          )
        );
        break;
      }
      case 259: {
        scope.cl = [
          `animate`,
          `circle`,
          `defs`,
          `desc`,
          `ellipse`,
          `g`,
          `image`,
          `line`,
          `filter`,
          `marker`,
          `mask`,
          `metadata`,
          `path`,
          `pattern`,
          `polygon`,
          `polyline`,
          `rect`,
          `stop`,
          `switch`,
          `symbol`,
          `svg`,
          `text`,
          `tspan`,
          `use`,
          `view`
        ];
        break;
      }
      case 260: {
        scope.pl = (e) => (t, n) => {
          let r = (0, scope.k.useContext)(scope.qc), i = (0, scope.k.useContext)(scope.N), a = () => (0, scope.dl)(e, t, r, i);
          return n ? a() : (0, scope.j)(a);
        };
        break;
      }
      case 261: {
        scope.ml = (0, scope.pl)({
          scrapeMotionValuesFromProps: scope.Lo,
          createRenderState: scope.Zc
        });
        break;
      }
      case 262: {
        scope.hl = (0, scope.pl)({
          scrapeMotionValuesFromProps: scope.Uo,
          createRenderState: scope.nl
        });
        break;
      }
      case 263: {
        scope.gl = /* @__PURE__ */ Symbol.for(`motionComponentSymbol`);
        break;
      }
      case 264: {
        scope.vl = (0, scope.k.createContext)({});
        break;
      }
      case 265: {
        scope.Ol = (e, t) => t.isSVG ?? (0, scope.ll)(e) ? new scope.Wo(t) : new scope.zo(t, { allowProjection: e !== scope.k.Fragment });
        break;
      }
      case 266: {
        scope.kl = class extends scope.No {
          constructor(e) {
            super(e), e.animationState ||= (0, scope.qo)(e);
          }
          updateAnimationControlsSubscription() {
            let { animate: e } = this.node.getProps();
            (0, scope.go)(e) && (this.unmountControls = e.subscribe(this.node));
          }
          mount() {
            this.updateAnimationControlsSubscription();
          }
          update() {
            let { animate: e } = this.node.getProps(), { animate: t } = this.node.prevProps || {};
            e !== t && this.updateAnimationControlsSubscription();
          }
          unmount() {
            this.node.animationState.reset(), this.unmountControls?.();
          }
        };
        break;
      }
      case 267: {
        scope.Al = 0;
        break;
      }
      case 268: {
        scope.jl = {
          animation: { Feature: scope.kl },
          exit: {
            Feature: class extends scope.No {
              constructor() {
                super(...arguments), this.id = scope.Al++;
              }
              update() {
                let { presenceContext: e, prevPresenceContext: t, animationState: n } = this.node;
                if (!e || !n) return;
                let { isPresent: r, onExitComplete: i } = e, a = t?.isPresent;
                if (r === a) return;
                if (r && a === false) {
                  if (this.exit === true) {
                    let { initial: e2 } = this.node.getProps();
                    if (e2 && !Array.isArray(e2)) {
                      let {
                        transition: t2,
                        transitionEnd: n2,
                        ...r2
                      } = (0, scope.xi)(this.node, e2) || {};
                      for (let e3 in r2) this.node.getValue(e3)?.jump(r2[e3]);
                    }
                    this.node.blockInitialAnimation = false, n.reset(), n.animateChanges();
                  } else n.setActive(`exit`, false);
                  this.exit = void 0;
                  return;
                }
                let o = this.exit = n.setActive(`exit`, !r);
                i && !r && o.then(() => {
                  this.exit === o && (this.exit = true, i(this.id));
                });
              }
              mount() {
                let { register: e, onExitComplete: t } = this.node.presenceContext || {};
                t && t(this.id), e && (this.unmount = e(this.id));
              }
              unmount() {
              }
            }
          }
        };
        break;
      }
      case 269: {
        scope.Nl = (e) => (t) => (0, scope.Ia)(t) && e(t, (0, scope.Ml)(t));
        break;
      }
      case 270: {
        scope.Fl = ({ current: e }) => e ? e.ownerDocument.defaultView : null;
        break;
      }
      case 271: {
        scope.Il = (e, t) => Math.abs(e - t);
        break;
      }
      case 272: {
        scope.Rl = /* @__PURE__ */ new Set([`auto`, `scroll`]);
        break;
      }
      case 273: {
        scope.zl = class {
          constructor(e, t, {
            transformPagePoint: n,
            contextWindow: r = window,
            dragSnapToOrigin: i = false,
            distanceThreshold: a = 3,
            element: o
          } = {}) {
            if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (e2) => {
              this.handleScroll(e2.target);
            }, this.onWindowScroll = () => {
              this.handleScroll(window);
            }, this.updatePoint = () => {
              if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
              this.hasPendingMove = false, this.lastRawMoveEventInfo && (this.lastMoveEventInfo = (0, scope.Bl)(
                this.lastRawMoveEventInfo,
                this.transformPagePoint
              ));
              let e2 = (0, scope.Hl)(this.lastMoveEventInfo, this.history), t2 = this.startEvent !== null, n2 = (0, scope.Ll)(e2.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
              if (!t2 && !n2) return;
              let { point: r2 } = e2;
              this.history.push({ ...r2, timestamp: scope.V.now() });
              let { onStart: i2, onMove: a2 } = this.handlers;
              t2 || (i2 && i2(this.lastMoveEvent, e2), this.startEvent = this.lastMoveEvent), a2 && a2(this.lastMoveEvent, e2);
            }, this.handlePointerMove = (e2, t2) => {
              this.lastMoveEvent = e2, this.lastRawMoveEventInfo = t2, this.lastMoveEventInfo = (0, scope.Bl)(t2, this.transformPagePoint), this.hasPendingMove = true, scope.G.update(this.updatePoint, true);
            }, this.handlePointerUp = (e2, t2) => {
              this.hasPendingMove && this.updatePoint(), this.end();
              let { onEnd: n2, onSessionEnd: r2, resumeAnimation: i2 } = this.handlers;
              if ((this.dragSnapToOrigin || !this.startEvent) && i2 && i2(), !(this.lastMoveEvent && this.lastMoveEventInfo))
                return;
              let a2 = (0, scope.Hl)(
                e2.type === `pointercancel` ? this.lastMoveEventInfo : (0, scope.Bl)(t2, this.transformPagePoint),
                this.history
              );
              this.startEvent && n2 && n2(e2, a2), r2 && r2(e2, a2);
            }, !(0, scope.Ia)(e))
              return;
            this.dragSnapToOrigin = i, this.handlers = t, this.transformPagePoint = n, this.distanceThreshold = a, this.contextWindow = r || window;
            let s = (0, scope.Bl)((0, scope.Ml)(e), this.transformPagePoint), { point: c2 } = s, { timestamp: l } = scope.B;
            this.history = [{ ...c2, timestamp: l }];
            let { onSessionStart: u } = t;
            u && u(e, (0, scope.Hl)(s, this.history));
            let d = { passive: true, capture: true };
            this.removeListeners = (0, scope.L)(
              (0, scope.Pl)(this.contextWindow, `pointermove`, this.handlePointerMove, d),
              (0, scope.Pl)(this.contextWindow, `pointerup`, this.handlePointerUp, d),
              (0, scope.Pl)(this.contextWindow, `pointercancel`, this.handlePointerUp, d)
            ), o && this.startScrollTracking(o);
          }
          startScrollTracking(e) {
            let t = e.parentElement;
            for (; t; ) {
              let e2 = getComputedStyle(t);
              (scope.Rl.has(e2.overflowX) || scope.Rl.has(e2.overflowY)) && this.scrollPositions.set(t, { x: t.scrollLeft, y: t.scrollTop }), t = t.parentElement;
            }
            this.scrollPositions.set(window, { x: window.scrollX, y: window.scrollY }), window.addEventListener(`scroll`, this.onElementScroll, { capture: true }), window.addEventListener(`scroll`, this.onWindowScroll), this.removeScrollListeners = () => {
              window.removeEventListener(`scroll`, this.onElementScroll, { capture: true }), window.removeEventListener(`scroll`, this.onWindowScroll);
            };
          }
          handleScroll(e) {
            let t = this.scrollPositions.get(e);
            if (!t) return;
            let n = e === window, r = n ? { x: window.scrollX, y: window.scrollY } : { x: e.scrollLeft, y: e.scrollTop }, i = { x: r.x - t.x, y: r.y - t.y };
            (i.x !== 0 || i.y !== 0) && (n ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += i.x, this.lastMoveEventInfo.point.y += i.y) : this.history.length > 0 && (this.history[0].x -= i.x, this.history[0].y -= i.y), this.scrollPositions.set(e, r), scope.G.update(this.updatePoint, true));
          }
          updateHandlers(e) {
            this.handlers = e;
          }
          end() {
            this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), (0, scope.Xt)(this.updatePoint);
          }
        };
        break;
      }
      case 274: {
        scope.$l = 0.35;
        break;
      }
      case 275: {
        scope.ru = /* @__PURE__ */ new WeakMap();
        break;
      }
      case 276: {
        scope.iu = class {
          constructor(e) {
            this.openDragLock = null, this.isDragging = false, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = false, this.hasMutatedConstraints = false, this.elastic = (0, scope.J)(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e;
          }
          start(e, { snapToCursor: t = false, distanceThreshold: n } = {}) {
            let { presenceContext: r } = this.visualElement;
            if (r && r.isPresent === false) return;
            let i = (e2) => {
              t && this.snapToCursor(e2), this.stopAnimation();
            }, a = (e2, t2) => {
              let { drag: n2, dragPropagation: r2, onDragStart: i2 } = this.getProps();
              if (n2 && !r2 && (this.openDragLock && this.openDragLock(), this.openDragLock = (0, scope.ja)(n2), !this.openDragLock))
                return;
              this.latestPointerEvent = e2, this.latestPanInfo = t2, this.isDragging = true, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = true, this.visualElement.projection.target = void 0), (0, scope.Ts)((e3) => {
                let t3 = this.getAxisMotionValue(e3).get() || 0;
                if (scope.rt.test(t3)) {
                  let { projection: n3 } = this.visualElement;
                  if (n3 && n3.layout) {
                    let r3 = n3.layout.layoutBox[e3];
                    r3 && (t3 = (0, scope.rs)(r3) * (parseFloat(t3) / 100));
                  }
                }
                this.originPoint[e3] = t3;
              }), i2 && scope.G.update(() => i2(e2, t2), false, true), (0, scope.ki)(this.visualElement, `transform`);
              let { animationState: a2 } = this.visualElement;
              a2 && a2.setActive(`whileDrag`, true);
            }, o = (e2, t2) => {
              this.latestPointerEvent = e2, this.latestPanInfo = t2;
              let {
                dragPropagation: n2,
                dragDirectionLock: r2,
                onDirectionLock: i2,
                onDrag: a2
              } = this.getProps();
              if (!n2 && !this.openDragLock) return;
              let { offset: o2 } = t2;
              r2 && this.currentDirection === null ? (this.currentDirection = (0, scope.cu)(o2), this.currentDirection !== null && i2 && i2(this.currentDirection)) : (this.updateAxis(`x`, t2.point, o2), this.updateAxis(`y`, t2.point, o2), this.visualElement.render(), a2 && scope.G.update(() => a2(e2, t2), false, true));
            }, s = (e2, t2) => {
              this.latestPointerEvent = e2, this.latestPanInfo = t2, this.stop(e2, t2), this.latestPointerEvent = null, this.latestPanInfo = null;
            }, c2 = () => {
              let { dragSnapToOrigin: e2 } = this.getProps();
              (e2 || this.constraints) && this.startAnimation({ x: 0, y: 0 });
            }, { dragSnapToOrigin: l } = this.getProps();
            this.panSession = new scope.zl(
              e,
              { onSessionStart: i, onStart: a, onMove: o, onSessionEnd: s, resumeAnimation: c2 },
              {
                transformPagePoint: this.visualElement.getTransformPagePoint(),
                dragSnapToOrigin: l,
                distanceThreshold: n,
                contextWindow: (0, scope.Fl)(this.visualElement),
                element: this.visualElement.current
              }
            );
          }
          stop(e, t) {
            let n = e || this.latestPointerEvent, r = t || this.latestPanInfo, i = this.isDragging;
            if (this.cancel(), !i || !r || !n) return;
            let { velocity: a } = r;
            this.startAnimation(a);
            let { onDragEnd: o } = this.getProps();
            o && scope.G.postRender(() => o(n, r));
          }
          cancel() {
            this.isDragging = false;
            let { projection: e, animationState: t } = this.visualElement;
            e && (e.isAnimationBlocked = false), this.endPanSession();
            let { dragPropagation: n } = this.getProps();
            !n && this.openDragLock && (this.openDragLock(), this.openDragLock = null), t && t.setActive(`whileDrag`, false);
          }
          endPanSession() {
            this.panSession && this.panSession.end(), this.panSession = void 0;
          }
          updateAxis(e, t, n) {
            let { drag: r } = this.getProps();
            if (!n || !(0, scope.su)(e, r, this.currentDirection)) return;
            let i = this.getAxisMotionValue(e), a = this.originPoint[e] + n[e];
            this.constraints && this.constraints[e] && (a = (0, scope.Kl)(a, this.constraints[e], this.elastic[e])), i.set(a);
          }
          resolveConstraints() {
            let { dragConstraints: e, dragElastic: t } = this.getProps(), n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : this.visualElement.projection?.layout, r = this.constraints;
            e && (0, scope.yl)(e) ? this.constraints ||= this.resolveRefConstraints() : this.constraints = e && n ? (0, scope.Jl)(n.layoutBox, e) : false, this.elastic = (0, scope.eu)(t), r !== this.constraints && !(0, scope.yl)(e) && n && this.constraints && !this.hasMutatedConstraints && (0, scope.Ts)((e2) => {
              this.constraints !== false && this.getAxisMotionValue(e2) && (this.constraints[e2] = (0, scope.Ql)(n.layoutBox[e2], this.constraints[e2]));
            });
          }
          resolveRefConstraints() {
            let { dragConstraints: e, onMeasureDragConstraints: t } = this.getProps();
            if (!e || !(0, scope.yl)(e)) return false;
            let n = e.current, { projection: r } = this.visualElement;
            if (!r || !r.layout) return false;
            r.root && (r.root.scroll = void 0, r.root.updateScroll());
            let i = (0, scope.Ea)(n, r.root, this.visualElement.getTransformPagePoint()), a = (0, scope.Xl)(r.layout.layoutBox, i);
            if (t) {
              let e2 = t((0, scope.sa)(a));
              this.hasMutatedConstraints = !!e2, e2 && (a = (0, scope.oa)(e2));
            }
            return a;
          }
          startAnimation(e) {
            let {
              drag: t,
              dragMomentum: n,
              dragElastic: r,
              dragTransition: i,
              dragSnapToOrigin: a,
              onDragTransitionEnd: o
            } = this.getProps(), s = this.constraints || {}, c2 = (0, scope.Ts)((o2) => {
              if (!(0, scope.su)(o2, t, this.currentDirection)) return;
              let c3 = s && s[o2] || {};
              (a === true || a === o2) && (c3 = { min: 0, max: 0 });
              let l = r ? 200 : 1e6, u = r ? 40 : 1e7, d = {
                type: `inertia`,
                velocity: n ? e[o2] : 0,
                bounceStiffness: l,
                bounceDamping: u,
                timeConstant: 750,
                restDelta: 1,
                restSpeed: 10,
                ...i,
                ...c3
              };
              return this.startAxisValueAnimation(o2, d);
            });
            return Promise.all(c2).then(o);
          }
          startAxisValueAnimation(e, t) {
            let n = this.getAxisMotionValue(e);
            return (0, scope.ki)(this.visualElement, e), n.start((0, scope.hi)(e, n, 0, t, this.visualElement, false));
          }
          stopAnimation() {
            (0, scope.Ts)((e) => this.getAxisMotionValue(e).stop());
          }
          getAxisMotionValue(e) {
            let t = `_drag${e.toUpperCase()}`;
            return this.visualElement.getProps()[t] || this.visualElement.getValue(e, this.visualElement.latestValues[e] ?? 0);
          }
          snapToCursor({ clientX: e, clientY: t }) {
            let { drag: n } = this.getProps(), r = { x: e, y: t }, i = this.visualElement.getTransformPagePoint()?.(r) || r, a = this.visualElement.measureViewportBox();
            (0, scope.Ts)((e2) => {
              if (!(0, scope.su)(e2, n, this.currentDirection)) return;
              let t2 = this.getAxisMotionValue(e2), { min: r2, max: o } = a[e2];
              t2.set((t2.get() || 0) + i[e2] - (0, scope.W)(r2, o, 0.5));
            });
          }
          scalePositionWithinConstraints() {
            if (!this.visualElement.current) return;
            let { drag: e, dragConstraints: t } = this.getProps(), { projection: n } = this.visualElement;
            if (!(0, scope.yl)(t) || !n || !this.constraints) return;
            this.stopAnimation();
            let r = this.constraints, i = { x: 0, y: 0 };
            (0, scope.Ts)((e2) => {
              let t2 = this.getAxisMotionValue(e2).get();
              i[e2] = (0, scope.Zl)({ min: t2, max: t2 }, r[e2]);
            });
            let { transformTemplate: a } = this.visualElement.getProps();
            this.visualElement.current.style.transform = a ? a({}, ``) : `none`, n.root && n.root.updateScroll(), n.updateLayout(), this.constraints = false, this.resolveConstraints(), (0, scope.Ts)((t2) => {
              let n2 = this.getAxisMotionValue(t2);
              if (!(0, scope.su)(t2, e, null) || !n2.get()) return;
              let { min: r2, max: a2 } = this.constraints[t2];
              n2.set((0, scope.W)(r2, a2, i[t2]));
            }), this.visualElement.render();
          }
          addListeners() {
            if (!this.visualElement.current) return;
            scope.ru.set(this.visualElement, this);
            let e = this.visualElement.current, t = (0, scope.Pl)(e, `pointerdown`, (t2) => {
              let { drag: n2, dragListener: r2 = true } = this.getProps(), i2 = t2.target, a2 = i2 !== e && (0, scope.Ba)(i2);
              n2 && r2 && !a2 && this.start(t2);
            }), n, r = () => {
              let { dragConstraints: t2 } = this.getProps();
              (0, scope.yl)(t2) && t2.current && (this.constraints = this.resolveRefConstraints(), n ||= (0, scope.ou)(e, t2.current, () => this.scalePositionWithinConstraints()));
            }, { projection: i } = this.visualElement, a = i.addEventListener(`measure`, r);
            i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), scope.G.read(r);
            let o = (0, scope.Rs)(window, `resize`, () => this.scalePositionWithinConstraints()), s = i.addEventListener(`didUpdate`, ({ delta: e2, hasLayoutChanged: t2 }) => {
              this.isDragging && t2 && ((0, scope.Ts)((t3) => {
                let n2 = this.getAxisMotionValue(t3);
                n2 && (this.originPoint[t3] += e2[t3].translate, n2.set(n2.get() + e2[t3].translate));
              }), this.visualElement.render());
            });
            return () => {
              o(), t(), a(), s && s(), n && n();
            };
          }
          getProps() {
            let e = this.visualElement.getProps(), {
              drag: t = false,
              dragDirectionLock: n = false,
              dragPropagation: r = false,
              dragConstraints: i = false,
              dragElastic: a = scope.$l,
              dragMomentum: o = true
            } = e;
            return {
              ...e,
              drag: t,
              dragDirectionLock: n,
              dragPropagation: r,
              dragConstraints: i,
              dragElastic: a,
              dragMomentum: o
            };
          }
        };
        break;
      }
      case 277: {
        scope.lu = class extends scope.No {
          constructor(e) {
            super(e), this.removeGroupControls = scope.se, this.removeListeners = scope.se, this.controls = new scope.iu(e);
          }
          mount() {
            let { dragControls: e } = this.node.getProps();
            e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || scope.se;
          }
          update() {
            let { dragControls: e } = this.node.getProps(), { dragControls: t } = this.node.prevProps || {};
            e !== t && (this.removeGroupControls(), e && (this.removeGroupControls = e.subscribe(this.controls)));
          }
          unmount() {
            this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
          }
        };
        break;
      }
      case 278: {
        scope.uu = (e) => (t, n) => {
          e && scope.G.update(() => e(t, n), false, true);
        };
        break;
      }
      case 279: {
        scope.du = class extends scope.No {
          constructor() {
            super(...arguments), this.removePointerDownListener = scope.se;
          }
          onPointerDown(e) {
            this.session = new scope.zl(e, this.createPanHandlers(), {
              transformPagePoint: this.node.getTransformPagePoint(),
              contextWindow: (0, scope.Fl)(this.node)
            });
          }
          createPanHandlers() {
            let {
              onPanSessionStart: e,
              onPanStart: t,
              onPan: n,
              onPanEnd: r
            } = this.node.getProps();
            return {
              onSessionStart: (0, scope.uu)(e),
              onStart: (0, scope.uu)(t),
              onMove: (0, scope.uu)(n),
              onEnd: (e2, t2) => {
                delete this.session, r && scope.G.postRender(() => r(e2, t2));
              }
            };
          }
          mount() {
            this.removePointerDownListener = (0, scope.Pl)(
              this.node.current,
              `pointerdown`,
              (e) => this.onPointerDown(e)
            );
          }
          update() {
            this.session && this.session.updateHandlers(this.createPanHandlers());
          }
          unmount() {
            this.removePointerDownListener(), this.session && this.session.end();
          }
        };
        break;
      }
      case 280: {
        scope.fu = false;
        break;
      }
      case 281: {
        scope.pu = class extends scope.k.Component {
          componentDidMount() {
            let {
              visualElement: e,
              layoutGroup: t,
              switchLayoutGroup: n,
              layoutId: r
            } = this.props, { projection: i } = e;
            i && (t.group && t.group.add(i), n && n.register && r && n.register(i), scope.fu && i.root.didUpdate(), i.addEventListener(`animationComplete`, () => {
              this.safeToRemove();
            }), i.setOptions({
              ...i.options,
              layoutDependency: this.props.layoutDependency,
              onExitComplete: () => this.safeToRemove()
            })), scope.Gs.hasEverUpdated = true;
          }
          getSnapshotBeforeUpdate(e) {
            let { layoutDependency: t, visualElement: n, drag: r, isPresent: i } = this.props, { projection: a } = n;
            return a && (a.isPresent = i, e.layoutDependency !== t && a.setOptions({ ...a.options, layoutDependency: t }), scope.fu = true, r || e.layoutDependency !== t || t === void 0 || e.isPresent !== i ? a.willUpdate() : this.safeToRemove(), e.isPresent !== i && (i ? a.promote() : a.relegate() || scope.G.postRender(() => {
              let e2 = a.getStack();
              (!e2 || !e2.members.length) && this.safeToRemove();
            }))), null;
          }
          componentDidUpdate() {
            let { visualElement: e, layoutAnchor: t } = this.props, { projection: n } = e;
            n && (n.options.layoutAnchor = t, n.root.didUpdate(), scope.Da.postRender(() => {
              !n.currentAnimation && n.isLead() && this.safeToRemove();
            }));
          }
          componentWillUnmount() {
            let { visualElement: e, layoutGroup: t, switchLayoutGroup: n } = this.props, { projection: r } = e;
            scope.fu = true, r && (r.scheduleCheckAfterUnmount(), t && t.group && t.group.remove(r), n && n.deregister && n.deregister(r));
          }
          safeToRemove() {
            let { safeToRemove: e } = this.props;
            e && e();
          }
          render() {
            return null;
          }
        };
        break;
      }
      case 282: {
        scope.hu = {
          pan: { Feature: scope.du },
          drag: { Feature: scope.lu, ProjectionNode: scope.Oc, MeasureLayout: scope.mu }
        };
        break;
      }
      case 283: {
        scope._u = class extends scope.No {
          mount() {
            let { current: e } = this.node;
            e && (this.unmount = (0, scope.Pa)(
              e,
              (e2, t) => ((0, scope.gu)(this.node, t, `Start`), (e3) => (0, scope.gu)(this.node, e3, `End`))
            ));
          }
          unmount() {
          }
        };
        break;
      }
      case 284: {
        scope.vu = class extends scope.No {
          constructor() {
            super(...arguments), this.isActive = false;
          }
          onFocus() {
            let e = false;
            try {
              e = this.node.current.matches(`:focus-visible`);
            } catch {
              e = true;
            }
            e && this.node.animationState && (this.node.animationState.setActive(`whileFocus`, true), this.isActive = true);
          }
          onBlur() {
            this.isActive && this.node.animationState && (this.node.animationState.setActive(`whileFocus`, false), this.isActive = false);
          }
          mount() {
            this.unmount = (0, scope.L)(
              (0, scope.Rs)(this.node.current, `focus`, () => this.onFocus()),
              (0, scope.Rs)(this.node.current, `blur`, () => this.onBlur())
            );
          }
          unmount() {
          }
        };
        break;
      }
      case 285: {
        scope.bu = class extends scope.No {
          mount() {
            let { current: e } = this.node;
            if (!e) return;
            let { globalTapTarget: t, propagate: n } = this.node.props;
            this.unmount = (0, scope.qa)(
              e,
              (e2, t2) => ((0, scope.yu)(this.node, t2, `Start`), (e3, { success: t3 }) => (0, scope.yu)(this.node, e3, t3 ? `End` : `Cancel`)),
              { useGlobalTarget: t, stopPropagation: n?.tap === false }
            );
          }
          unmount() {
          }
        };
        break;
      }
      case 286: {
        scope.xu = /* @__PURE__ */ new WeakMap();
        break;
      }
      case 287: {
        scope.Su = /* @__PURE__ */ new WeakMap();
        break;
      }
      case 288: {
        scope.Cu = (e) => {
          let t = scope.xu.get(e.target);
          t && t(e);
        };
        break;
      }
      case 289: {
        scope.wu = (e) => {
          e.forEach(scope.Cu);
        };
        break;
      }
      case 290: {
        scope.Du = { some: 0, all: 1 };
        break;
      }
      case 291: {
        scope.Ou = class extends scope.No {
          constructor() {
            super(...arguments), this.hasEnteredView = false, this.isInView = false;
          }
          startObserver() {
            this.stopObserver?.();
            let { viewport: e = {} } = this.node.getProps(), { root: t, margin: n, amount: r = `some`, once: i } = e, a = {
              root: t ? t.current : void 0,
              rootMargin: n,
              threshold: typeof r == `number` ? r : scope.Du[r]
            }, o = (e2) => {
              let { isIntersecting: t2 } = e2;
              if (this.isInView === t2 || (this.isInView = t2, i && !t2 && this.hasEnteredView))
                return;
              t2 && (this.hasEnteredView = true), this.node.animationState && this.node.animationState.setActive(`whileInView`, t2);
              let { onViewportEnter: n2, onViewportLeave: r2 } = this.node.getProps(), a2 = t2 ? n2 : r2;
              a2 && a2(e2);
            };
            this.stopObserver = (0, scope.Eu)(this.node.current, a, o);
          }
          mount() {
            this.startObserver();
          }
          update() {
            if (typeof IntersectionObserver > `u`) return;
            let { props: e, prevProps: t } = this.node;
            [`amount`, `margin`, `root`].some((0, scope.ku)(e, t)) && this.startObserver();
          }
          unmount() {
            this.stopObserver?.(), this.hasEnteredView = false, this.isInView = false;
          }
        };
        break;
      }
      case 292: {
        scope.Au = {
          inView: { Feature: scope.Ou },
          tap: { Feature: scope.bu },
          focus: { Feature: scope.vu },
          hover: { Feature: scope._u }
        };
        break;
      }
      case 293: {
        scope.ju = { layout: { ProjectionNode: scope.Oc, MeasureLayout: scope.mu } };
        break;
      }
      case 294: {
        scope.Mu = (0, scope.Dl)({ ...scope.jl, ...scope.Au, ...scope.hu, ...scope.ju }, scope.Ol);
        break;
      }
      case 295: {
        scope.Nu = {
          name: `circle-x`,
          size: 24,
          node: [
            [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
            [`path`, { d: `m15 9-6 6`, key: `1uzhvr` }],
            [`path`, { d: `m9 9 6 6`, key: `z0biqf` }]
          ],
          aliases: [`x-circle`]
        };
        break;
      }
      case 296: {
        scope.Nu.node;
        break;
      }
      case 297: {
        scope.Pu = (0, scope.n)(scope.Nu);
        break;
      }
      case 298: {
        scope.Fu = {
          name: `clipboard-copy`,
          size: 24,
          node: [
            [`rect`, { width: `8`, height: `4`, x: `8`, y: `2`, rx: `1`, ry: `1`, key: `tgr4d6` }],
            [
              `path`,
              { d: `M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2`, key: `4jdomd` }
            ],
            [`path`, { d: `M16 4h2a2 2 0 0 1 2 2v4`, key: `3hqy98` }],
            [`path`, { d: `M21 14H11`, key: `1bme5i` }],
            [`path`, { d: `m15 10-4 4 4 4`, key: `5dvupr` }]
          ]
        };
        break;
      }
      case 299: {
        scope.Fu.node;
        break;
      }
      case 300: {
        scope.Iu = (0, scope.n)(scope.Fu);
        break;
      }
      case 301: {
        scope.Lu = {
          name: `clipboard-paste`,
          size: 24,
          node: [
            [`path`, { d: `M11 14h10`, key: `1w8e9d` }],
            [`path`, { d: `M16 4h2a2 2 0 0 1 2 2v1.344`, key: `1e62lh` }],
            [`path`, { d: `m17 18 4-4-4-4`, key: `z2g111` }],
            [
              `path`,
              {
                d: `M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113`,
                key: `bjbb7m`
              }
            ],
            [`rect`, { x: `8`, y: `2`, width: `8`, height: `4`, rx: `1`, key: `ublpy` }]
          ]
        };
        break;
      }
      case 302: {
        scope.Lu.node;
        break;
      }
      case 303: {
        scope.Ru = (0, scope.n)(scope.Lu);
        break;
      }
      case 304: {
        scope.zu = {
          name: `eye-off`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49`,
                key: `ct8e1f`
              }
            ],
            [`path`, { d: `M14.084 14.158a3 3 0 0 1-4.242-4.242`, key: `151rxh` }],
            [
              `path`,
              {
                d: `M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143`,
                key: `13bj9a`
              }
            ],
            [`path`, { d: `m2 2 20 20`, key: `1ooewy` }]
          ]
        };
        break;
      }
      case 305: {
        scope.zu.node;
        break;
      }
      case 306: {
        scope.Bu = (0, scope.n)(scope.zu);
        break;
      }
      case 307: {
        scope.Vu = {
          name: `eye`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`,
                key: `1nclc0`
              }
            ],
            [`circle`, { cx: `12`, cy: `12`, r: `3`, key: `1v7zrd` }]
          ]
        };
        break;
      }
      case 308: {
        scope.Vu.node;
        break;
      }
      case 309: {
        scope.Hu = (0, scope.n)(scope.Vu);
        break;
      }
      case 310: {
        scope.Uu = {
          name: `file-up`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
                key: `1oefj6`
              }
            ],
            [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5`, key: `wfsgrz` }],
            [`path`, { d: `M12 12v6`, key: `3ahymv` }],
            [`path`, { d: `m15 15-3-3-3 3`, key: `15xj92` }]
          ]
        };
        break;
      }
      case 311: {
        scope.Uu.node;
        break;
      }
      case 312: {
        scope.Wu = (0, scope.n)(scope.Uu);
        break;
      }
      case 313: {
        scope.Gu = {
          name: `plug-zap`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z`,
                key: `goz73y`
              }
            ],
            [`path`, { d: `m2 22 3-3`, key: `19mgm9` }],
            [`path`, { d: `M7.5 13.5 10 11`, key: `7xgeeb` }],
            [`path`, { d: `M10.5 16.5 13 14`, key: `10btkg` }],
            [`path`, { d: `m18 3-4 4h6l-4 4`, key: `16psg9` }]
          ],
          aliases: [`plug-zap-2`]
        };
        break;
      }
      case 314: {
        scope.Gu.node;
        break;
      }
      case 315: {
        scope.Ku = (0, scope.n)(scope.Gu);
        break;
      }
      case 316: {
        scope.qu = {
          name: `radio`,
          size: 24,
          node: [
            [`path`, { d: `M16.247 7.761a6 6 0 0 1 0 8.478`, key: `1fwjs5` }],
            [`path`, { d: `M19.075 4.933a10 10 0 0 1 0 14.134`, key: `ehdyv1` }],
            [`path`, { d: `M4.925 19.067a10 10 0 0 1 0-14.134`, key: `1q22gi` }],
            [`path`, { d: `M7.753 16.239a6 6 0 0 1 0-8.478`, key: `r2q7qm` }],
            [`circle`, { cx: `12`, cy: `12`, r: `2`, key: `1c9p78` }]
          ]
        };
        break;
      }
      case 317: {
        scope.qu.node;
        break;
      }
      case 318: {
        scope.Ju = (0, scope.n)(scope.qu);
        break;
      }
      case 319: {
        scope.Yu = {
          name: `server`,
          size: 24,
          node: [
            [`rect`, { width: `20`, height: `8`, x: `2`, y: `2`, rx: `2`, ry: `2`, key: `ngkwjq` }],
            [
              `rect`,
              { width: `20`, height: `8`, x: `2`, y: `14`, rx: `2`, ry: `2`, key: `iecqi9` }
            ],
            [`line`, { x1: `6`, x2: `6.01`, y1: `6`, y2: `6`, key: `16zg32` }],
            [`line`, { x1: `6`, x2: `6.01`, y1: `18`, y2: `18`, key: `nzw8ys` }]
          ]
        };
        break;
      }
      case 320: {
        scope.Yu.node;
        break;
      }
      case 321: {
        scope.Xu = (0, scope.n)(scope.Yu);
        break;
      }
      case 322: {
        scope.Zu = {
          name: `wand-sparkles`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72`,
                key: `ul74o6`
              }
            ],
            [`path`, { d: `m14 7 3 3`, key: `1r5n42` }],
            [`path`, { d: `M5 6v4`, key: `ilb8ba` }],
            [`path`, { d: `M19 14v4`, key: `blhpug` }],
            [`path`, { d: `M10 2v2`, key: `7u0qdc` }],
            [`path`, { d: `M7 8H3`, key: `zfb6yr` }],
            [`path`, { d: `M21 16h-4`, key: `1cnmox` }],
            [`path`, { d: `M11 3H9`, key: `1obp7u` }]
          ],
          aliases: [`wand-2`]
        };
        break;
      }
      case 323: {
        scope.Zu.node;
        break;
      }
      case 324: {
        scope.Qu = (0, scope.n)(scope.Zu);
        break;
      }
      case 325: {
        scope.$u = {
          name: `wrench`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z`,
                key: `1ngwbx`
              }
            ]
          ]
        };
        break;
      }
      case 326: {
        scope.$u.node;
        break;
      }
      case 327: {
        scope.ed = (0, scope.n)(scope.$u);
        break;
      }
      case 328: {
        scope.dd = 5e5;
        break;
      }
      case 329: {
        scope.Od = (e, t) => {
          let n = Array(e.length + t.length);
          for (let t2 = 0; t2 < e.length; t2++) n[t2] = e[t2];
          for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
          return n;
        };
        break;
      }
      case 330: {
        scope.kd = (e, t) => ({ classGroupId: e, validator: t });
        break;
      }
      case 331: {
        scope.Ad = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
          nextPart: e,
          validators: t,
          classGroupId: n
        });
        break;
      }
      case 332: {
        scope.jd = `-`;
        break;
      }
      case 333: {
        scope.Md = [];
        break;
      }
      case 334: {
        scope.Nd = `arbitrary..`;
        break;
      }
      case 335: {
        scope.Pd = (e) => {
          let t = (0, scope.Ld)(e), { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
          return {
            getClassGroupId: (e2) => {
              if (e2.startsWith(`[`) && e2.endsWith(`]`)) return (0, scope.Id)(e2);
              let n2 = e2.split(scope.jd);
              return (0, scope.Fd)(n2, +(n2[0] === `` && n2.length > 1), t);
            },
            getConflictingClassGroupIds: (e2, t2) => {
              if (t2) {
                let t3 = r[e2], i = n[e2];
                return t3 ? i ? (0, scope.Od)(i, t3) : t3 : i || scope.Md;
              }
              return n[e2] || scope.Md;
            }
          };
        };
        break;
      }
      case 336: {
        scope.Fd = (e, t, n) => {
          if (e.length - t === 0) return n.classGroupId;
          let r = e[t], i = n.nextPart.get(r);
          if (i) {
            let n2 = (0, scope.Fd)(e, t + 1, i);
            if (n2) return n2;
          }
          let a = n.validators;
          if (a === null) return;
          let o = t === 0 ? e.join(scope.jd) : e.slice(t).join(scope.jd), s = a.length;
          for (let e2 = 0; e2 < s; e2++) {
            let t2 = a[e2];
            if (t2.validator(o)) return t2.classGroupId;
          }
        };
        break;
      }
      case 337: {
        scope.Id = (e) => e.slice(1, -1).indexOf(`:`) === -1 ? void 0 : (() => {
          let t = e.slice(1, -1), n = t.indexOf(`:`), r = t.slice(0, n);
          return r ? scope.Nd + r : void 0;
        })();
        break;
      }
      case 338: {
        scope.Ld = (e) => {
          let { theme: t, classGroups: n } = e;
          return (0, scope.Rd)(n, t);
        };
        break;
      }
      case 339: {
        scope.Rd = (e, t) => {
          let n = (0, scope.Ad)();
          for (let r in e) {
            let i = e[r];
            (0, scope.zd)(i, n, r, t);
          }
          return n;
        };
        break;
      }
      case 340: {
        scope.zd = (e, t, n, r) => {
          let i = e.length;
          for (let a = 0; a < i; a++) {
            let i2 = e[a];
            (0, scope.Bd)(i2, t, n, r);
          }
        };
        break;
      }
      case 341: {
        scope.Bd = (e, t, n, r) => {
          typeof e == `string` ? (0, scope.Vd)(e, t, n) : typeof e == `function` ? (0, scope.Hd)(e, t, n, r) : (0, scope.Ud)(e, t, n, r);
        };
        break;
      }
      case 342: {
        scope.Vd = (e, t, n) => {
          let r = e === `` ? t : (0, scope.Wd)(t, e);
          r.classGroupId = n;
        };
        break;
      }
      case 343: {
        scope.Hd = (e, t, n, r) => {
          (0, scope.Gd)(e) ? (0, scope.zd)(e(r), t, n, r) : (t.validators === null && (t.validators = []), t.validators.push((0, scope.kd)(n, e)));
        };
        break;
      }
      case 344: {
        scope.Ud = (e, t, n, r) => {
          let i = Object.entries(e), a = i.length;
          for (let e2 = 0; e2 < a; e2++) {
            let [a2, o] = i[e2];
            (0, scope.zd)(o, (0, scope.Wd)(t, a2), n, r);
          }
        };
        break;
      }
      case 345: {
        scope.Wd = (e, t) => {
          let n = e, r = t.split(scope.jd), i = r.length;
          for (let e2 = 0; e2 < i; e2++) {
            let t2 = r[e2], i2 = n.nextPart.get(t2);
            i2 || (i2 = (0, scope.Ad)(), n.nextPart.set(t2, i2)), n = i2;
          }
          return n;
        };
        break;
      }
      case 346: {
        scope.Gd = (e) => `isThemeGetter` in e && e.isThemeGetter === true;
        break;
      }
      case 347: {
        scope.Kd = (e) => {
          if (e < 1) return { get: () => void 0, set: () => {
          } };
          let t = 0, n = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null), i = (i2, a) => {
            n[i2] = a, t++, t > e && (t = 0, r = n, n = /* @__PURE__ */ Object.create(null));
          };
          return {
            get(e2) {
              let t2 = n[e2];
              if (t2 !== void 0) return t2;
              if ((t2 = r[e2]) !== void 0) return i(e2, t2), t2;
            },
            set(e2, t2) {
              e2 in n ? n[e2] = t2 : i(e2, t2);
            }
          };
        };
        break;
      }
      case 348: {
        scope.qd = `!`;
        break;
      }
      case 349: {
        scope.Jd = `:`;
        break;
      }
      case 350: {
        scope.Yd = [];
        break;
      }
      case 351: {
        scope.Xd = (e, t, n, r, i) => ({
          modifiers: e,
          hasImportantModifier: t,
          baseClassName: n,
          maybePostfixModifierPosition: r,
          isExternal: i
        });
        break;
      }
      case 352: {
        scope.Zd = (e) => {
          let { prefix: t, experimentalParseClassName: n } = e, r = (e2) => {
            let t2 = [], n2 = 0, r2 = 0, i = 0, a, o = e2.length;
            for (let s2 = 0; s2 < o; s2++) {
              let o2 = e2[s2];
              if (n2 === 0 && r2 === 0) {
                if (o2 === scope.Jd) {
                  t2.push(e2.slice(i, s2)), i = s2 + 1;
                  continue;
                }
                if (o2 === `/`) {
                  a = s2;
                  continue;
                }
              }
              o2 === `[` ? n2++ : o2 === `]` ? n2-- : o2 === `(` ? r2++ : o2 === `)` && r2--;
            }
            let s = t2.length === 0 ? e2 : e2.slice(i), c2 = s, l = false;
            s.endsWith(scope.qd) ? (c2 = s.slice(0, -1), l = true) : s.startsWith(scope.qd) && (c2 = s.slice(1), l = true);
            let u = a && a > i ? a - i : void 0;
            return (0, scope.Xd)(t2, l, c2, u);
          };
          if (t) {
            let e2 = t + scope.Jd, n2 = r;
            r = (t2) => t2.startsWith(e2) ? n2(t2.slice(e2.length)) : (0, scope.Xd)(scope.Yd, false, t2, void 0, true);
          }
          if (n) {
            let e2 = r;
            r = (t2) => n({ className: t2, parseClassName: e2 });
          }
          return r;
        };
        break;
      }
      case 353: {
        scope.Qd = (e) => {
          let t = /* @__PURE__ */ new Map();
          return e.orderSensitiveModifiers.forEach((e2, n) => {
            t.set(e2, 1e6 + n);
          }), (e2) => {
            let n = [], r = [];
            for (let i = 0; i < e2.length; i++) {
              let a = e2[i], o = a[0] === `[`, s = t.has(a);
              o || s ? (r.length > 0 && (r.sort(), n.push(...r), r = []), n.push(a)) : r.push(a);
            }
            return r.length > 0 && (r.sort(), n.push(...r)), n;
          };
        };
        break;
      }
      case 354: {
        scope.$d = (e) => ({
          cache: (0, scope.Kd)(e.cacheSize),
          parseClassName: (0, scope.Zd)(e),
          sortModifiers: (0, scope.Qd)(e),
          postfixLookupClassGroupIds: (0, scope.ef)(e),
          ...(0, scope.Pd)(e)
        });
        break;
      }
      case 355: {
        scope.ef = (e) => {
          let t = /* @__PURE__ */ Object.create(null), n = e.postfixLookupClassGroups;
          if (n) for (let e2 = 0; e2 < n.length; e2++) t[n[e2]] = true;
          return t;
        };
        break;
      }
      case 356: {
        scope.tf = /\s+/;
        break;
      }
      case 357: {
        scope.nf = (e, t) => {
          let {
            parseClassName: n,
            getClassGroupId: r,
            getConflictingClassGroupIds: i,
            sortModifiers: a,
            postfixLookupClassGroupIds: o
          } = t, s = [], c2 = e.trim().split(scope.tf), l = ``;
          for (let e2 = c2.length - 1; e2 >= 0; --e2) {
            let t2 = c2[e2], {
              isExternal: u,
              modifiers: d,
              hasImportantModifier: f2,
              baseClassName: p,
              maybePostfixModifierPosition: m
            } = n(t2);
            if (u) {
              l = t2 + (l.length > 0 ? ` ` + l : l);
              continue;
            }
            let h = !!m, g;
            if (h) {
              g = r(p.substring(0, m));
              let e3 = g && o[g] ? r(p) : void 0;
              e3 && e3 !== g && (g = e3, h = false);
            } else g = r(p);
            if (!g) {
              if (!h || (g = r(p), !g)) {
                l = t2 + (l.length > 0 ? ` ` + l : l);
                continue;
              }
              h = false;
            }
            let _ = d.length === 0 ? `` : d.length === 1 ? d[0] : a(d).join(`:`), v2 = f2 ? _ + scope.qd : _, y = v2 + g;
            if (s.indexOf(y) > -1) continue;
            s.push(y);
            let b = i(g, h);
            for (let e3 = 0; e3 < b.length; ++e3) {
              let t3 = b[e3];
              s.push(v2 + t3);
            }
            l = t2 + (l.length > 0 ? ` ` + l : l);
          }
          return l;
        };
        break;
      }
      case 358: {
        scope.rf = (...e) => {
          let t = 0, n, r, i = ``;
          for (; t < e.length; )
            (n = e[t++]) && (r = (0, scope.af)(n)) && (i && (i += ` `), i += r);
          return i;
        };
        break;
      }
      case 359: {
        scope.af = (e) => {
          if (typeof e == `string`) return e;
          let t, n = ``;
          for (let r = 0; r < e.length; r++)
            e[r] && (t = (0, scope.af)(e[r])) && (n && (n += ` `), n += t);
          return n;
        };
        break;
      }
      case 360: {
        scope.of = (e, ...t) => {
          let n, r, i, a, o = (o2) => (n = (0, scope.$d)(t.reduce((e2, t2) => t2(e2), e())), r = n.cache.get, i = n.cache.set, a = s, s(o2)), s = (e2) => {
            let t2 = r(e2);
            if (t2) return t2;
            let a2 = (0, scope.nf)(e2, n);
            return i(e2, a2), a2;
          };
          return a = o, (...e2) => a((0, scope.rf)(...e2));
        };
        break;
      }
      case 361: {
        scope.sf = [];
        break;
      }
      case 362: {
        scope.Y = (e) => {
          let t = (t2) => t2[e] || scope.sf;
          return t.isThemeGetter = true, t.themeKey = e, t;
        };
        break;
      }
      case 363: {
        scope.cf = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
        break;
      }
      case 364: {
        scope.lf = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
        break;
      }
      case 365: {
        scope.uf = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/;
        break;
      }
      case 366: {
        scope.df = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
        break;
      }
      case 367: {
        scope.ff = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
        break;
      }
      case 368: {
        scope.pf = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/;
        break;
      }
      case 369: {
        scope.mf = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
        break;
      }
      case 370: {
        scope.hf = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
        break;
      }
      case 371: {
        scope.gf = (e) => scope.uf.test(e);
        break;
      }
      case 372: {
        scope.X = (e) => !!e && !Number.isNaN(Number(e));
        break;
      }
      case 373: {
        scope._f = (e) => !!e && Number.isInteger(Number(e));
        break;
      }
      case 374: {
        scope.vf = (e) => e.endsWith(`%`) && (0, scope.X)(e.slice(0, -1));
        break;
      }
      case 375: {
        scope.yf = (e) => scope.df.test(e);
        break;
      }
      case 376: {
        scope.bf = () => true;
        break;
      }
      case 377: {
        scope.xf = (e) => scope.ff.test(e) && !scope.pf.test(e);
        break;
      }
      case 378: {
        scope.Sf = () => false;
        break;
      }
      case 379: {
        scope.Cf = (e) => scope.mf.test(e);
        break;
      }
      case 380: {
        scope.wf = (e) => scope.hf.test(e);
        break;
      }
      case 381: {
        scope.Tf = (e) => !(0, scope.Z)(e) && !(0, scope.Q)(e);
        break;
      }
      case 382: {
        scope.Ef = (e) => e.startsWith(`@container`) && (e[10] === `/` && e[11] !== void 0 || e[11] === `s` && e[16] !== void 0 && e.startsWith(`-size/`, 10) || e[11] === `n` && e[18] !== void 0 && e.startsWith(`-normal/`, 10));
        break;
      }
      case 383: {
        scope.Df = (e) => (0, scope.Hf)(e, scope.Kf, scope.Sf);
        break;
      }
      case 384: {
        scope.Z = (e) => scope.cf.test(e);
        break;
      }
      case 385: {
        scope.Of = (e) => (0, scope.Hf)(e, scope.qf, scope.xf);
        break;
      }
      case 386: {
        scope.kf = (e) => (0, scope.Hf)(e, scope.Jf, scope.X);
        break;
      }
      case 387: {
        scope.Af = (e) => (0, scope.Hf)(e, scope.Xf, scope.bf);
        break;
      }
      case 388: {
        scope.jf = (e) => (0, scope.Hf)(e, scope.Yf, scope.Sf);
        break;
      }
      case 389: {
        scope.Mf = (e) => (0, scope.Hf)(e, scope.Wf, scope.Sf);
        break;
      }
      case 390: {
        scope.Nf = (e) => (0, scope.Hf)(e, scope.Gf, scope.wf);
        break;
      }
      case 391: {
        scope.Pf = (e) => (0, scope.Hf)(e, scope.Zf, scope.Cf);
        break;
      }
      case 392: {
        scope.Q = (e) => scope.lf.test(e);
        break;
      }
      case 393: {
        scope.Ff = (e) => (0, scope.Uf)(e, scope.qf);
        break;
      }
      case 394: {
        scope.If = (e) => (0, scope.Uf)(e, scope.Yf);
        break;
      }
      case 395: {
        scope.Lf = (e) => (0, scope.Uf)(e, scope.Wf);
        break;
      }
      case 396: {
        scope.Rf = (e) => (0, scope.Uf)(e, scope.Kf);
        break;
      }
      case 397: {
        scope.zf = (e) => (0, scope.Uf)(e, scope.Gf);
        break;
      }
      case 398: {
        scope.Bf = (e) => (0, scope.Uf)(e, scope.Zf, true);
        break;
      }
      case 399: {
        scope.Vf = (e) => (0, scope.Uf)(e, scope.Xf, true);
        break;
      }
      case 400: {
        scope.Hf = (e, t, n) => {
          let r = scope.cf.exec(e);
          return r ? r[1] ? t(r[1]) : n(r[2]) : false;
        };
        break;
      }
      case 401: {
        scope.Uf = (e, t, n = false) => {
          let r = scope.lf.exec(e);
          return r ? r[1] ? t(r[1]) : n : false;
        };
        break;
      }
      case 402: {
        scope.Wf = (e) => e === `position` || e === `percentage`;
        break;
      }
      case 403: {
        scope.Gf = (e) => e === `image` || e === `url`;
        break;
      }
      case 404: {
        scope.Kf = (e) => e === `length` || e === `size` || e === `bg-size`;
        break;
      }
      case 405: {
        scope.qf = (e) => e === `length`;
        break;
      }
      case 406: {
        scope.Jf = (e) => e === `number`;
        break;
      }
      case 407: {
        scope.Yf = (e) => e === `family-name`;
        break;
      }
      case 408: {
        scope.Xf = (e) => e === `number` || e === `weight`;
        break;
      }
      case 409: {
        scope.Zf = (e) => e === `shadow`;
        break;
      }
      case 410: {
        scope.Qf = (0, scope.of)(() => {
          let e = (0, scope.Y)(`color`), t = (0, scope.Y)(`font`), n = (0, scope.Y)(`text`), r = (0, scope.Y)(`font-weight`), i = (0, scope.Y)(`tracking`), a = (0, scope.Y)(`leading`), o = (0, scope.Y)(`breakpoint`), s = (0, scope.Y)(`container`), c2 = (0, scope.Y)(`spacing`), l = (0, scope.Y)(`radius`), u = (0, scope.Y)(`shadow`), d = (0, scope.Y)(`inset-shadow`), f2 = (0, scope.Y)(`text-shadow`), p = (0, scope.Y)(`drop-shadow`), m = (0, scope.Y)(`blur`), h = (0, scope.Y)(`perspective`), g = (0, scope.Y)(`aspect`), _ = (0, scope.Y)(`ease`), v2 = (0, scope.Y)(`animate`), y = () => [`auto`, `avoid`, `all`, `avoid-page`, `page`, `left`, `right`, `column`], b = () => [
            `center`,
            `top`,
            `bottom`,
            `left`,
            `right`,
            `top-left`,
            `left-top`,
            `top-right`,
            `right-top`,
            `bottom-right`,
            `right-bottom`,
            `bottom-left`,
            `left-bottom`
          ], x = () => [...b(), scope.Q, scope.Z], S = () => [`auto`, `hidden`, `clip`, `visible`, `scroll`], C2 = () => [`auto`, `contain`, `none`], w2 = () => [scope.Q, scope.Z, c2], T = () => [scope.gf, `full`, `auto`, ...w2()], E = () => [scope._f, `none`, `subgrid`, scope.Q, scope.Z], ee = () => [
            `auto`,
            { span: [`full`, scope._f, scope.Q, scope.Z] },
            scope._f,
            scope.Q,
            scope.Z
          ], D = () => [scope._f, `auto`, scope.Q, scope.Z], te = () => [`auto`, `min`, `max`, `fr`, scope.Q, scope.Z], O = () => [
            `start`,
            `end`,
            `center`,
            `between`,
            `around`,
            `evenly`,
            `stretch`,
            `baseline`,
            `center-safe`,
            `end-safe`
          ], k = () => [`start`, `end`, `center`, `stretch`, `center-safe`, `end-safe`], A = () => [`auto`, ...w2()], j = () => [
            scope.gf,
            `auto`,
            `full`,
            `dvw`,
            `dvh`,
            `lvw`,
            `lvh`,
            `svw`,
            `svh`,
            `min`,
            `max`,
            `fit`,
            ...w2()
          ], M = () => [
            s,
            scope.gf,
            `screen`,
            `full`,
            `dvw`,
            `lvw`,
            `svw`,
            `min`,
            `max`,
            `fit`,
            ...w2()
          ], N = () => [
            scope.gf,
            `screen`,
            `full`,
            `lh`,
            `dvh`,
            `lvh`,
            `svh`,
            `min`,
            `max`,
            `fit`,
            ...w2()
          ], P = () => [e, scope.Q, scope.Z], ne = () => [...b(), scope.Lf, scope.Mf, { position: [scope.Q, scope.Z] }], re = () => [`no-repeat`, { repeat: [``, `x`, `y`, `space`, `round`] }], ie = () => [
            `auto`,
            `cover`,
            `contain`,
            scope.Rf,
            scope.Df,
            { size: [scope.Q, scope.Z] }
          ], ae = () => [scope.vf, scope.Ff, scope.Of], F = () => [``, `none`, `full`, l, scope.Q, scope.Z], I = () => [``, scope.X, scope.Ff, scope.Of], oe = () => [`solid`, `dashed`, `dotted`, `double`], se = () => [
            `normal`,
            `multiply`,
            `screen`,
            `overlay`,
            `darken`,
            `lighten`,
            `color-dodge`,
            `color-burn`,
            `hard-light`,
            `soft-light`,
            `difference`,
            `exclusion`,
            `hue`,
            `saturation`,
            `color`,
            `luminosity`
          ], L = () => [scope.X, scope.vf, scope.Lf, scope.Mf], ce = () => [``, `none`, m, scope.Q, scope.Z], le = () => [`none`, scope.X, scope.Q, scope.Z], R = () => [`none`, scope.X, scope.Q, scope.Z], z = () => [scope.X, scope.Q, scope.Z], ue = () => [scope.gf, `full`, ...w2()];
          return {
            cacheSize: 500,
            theme: {
              animate: [`spin`, `ping`, `pulse`, `bounce`],
              aspect: [`video`],
              blur: [scope.yf],
              breakpoint: [scope.yf],
              color: [scope.bf],
              container: [scope.yf],
              "drop-shadow": [scope.yf],
              ease: [`in`, `out`, `in-out`],
              font: [scope.Tf],
              "font-weight": [
                `thin`,
                `extralight`,
                `light`,
                `normal`,
                `medium`,
                `semibold`,
                `bold`,
                `extrabold`,
                `black`
              ],
              "inset-shadow": [scope.yf],
              leading: [`none`, `tight`, `snug`, `normal`, `relaxed`, `loose`],
              perspective: [`dramatic`, `near`, `normal`, `midrange`, `distant`, `none`],
              radius: [scope.yf],
              shadow: [scope.yf],
              spacing: [`px`, scope.X],
              text: [scope.yf],
              "text-shadow": [scope.yf],
              tracking: [`tighter`, `tight`, `normal`, `wide`, `wider`, `widest`]
            },
            classGroups: {
              aspect: [{ aspect: [`auto`, `square`, scope.gf, scope.Z, scope.Q, g] }],
              container: [`container`],
              "container-type": [{ "@container": [``, `normal`, `size`, scope.Q, scope.Z] }],
              "container-named": [scope.Ef],
              columns: [{ columns: [scope.X, `auto`, scope.Z, scope.Q, s] }],
              "break-after": [{ "break-after": y() }],
              "break-before": [{ "break-before": y() }],
              "break-inside": [{ "break-inside": [`auto`, `avoid`, `avoid-page`, `avoid-column`] }],
              "box-decoration": [{ "box-decoration": [`slice`, `clone`] }],
              box: [{ box: [`border`, `content`] }],
              display: [
                `block`,
                `inline-block`,
                `inline`,
                `flex`,
                `inline-flex`,
                `table`,
                `inline-table`,
                `table-caption`,
                `table-cell`,
                `table-column`,
                `table-column-group`,
                `table-footer-group`,
                `table-header-group`,
                `table-row-group`,
                `table-row`,
                `flow-root`,
                `grid`,
                `inline-grid`,
                `contents`,
                `list-item`,
                `hidden`
              ],
              sr: [`sr-only`, `not-sr-only`],
              float: [{ float: [`right`, `left`, `none`, `start`, `end`] }],
              clear: [{ clear: [`left`, `right`, `both`, `none`, `start`, `end`] }],
              isolation: [`isolate`, `isolation-auto`],
              "object-fit": [{ object: [`contain`, `cover`, `fill`, `none`, `scale-down`] }],
              "object-position": [{ object: x() }],
              overflow: [{ overflow: S() }],
              "overflow-x": [{ "overflow-x": S() }],
              "overflow-y": [{ "overflow-y": S() }],
              overscroll: [{ overscroll: C2() }],
              "overscroll-x": [{ "overscroll-x": C2() }],
              "overscroll-y": [{ "overscroll-y": C2() }],
              position: [`static`, `fixed`, `absolute`, `relative`, `sticky`],
              inset: [{ inset: T() }],
              "inset-x": [{ "inset-x": T() }],
              "inset-y": [{ "inset-y": T() }],
              start: [{ "inset-s": T(), start: T() }],
              end: [{ "inset-e": T(), end: T() }],
              "inset-bs": [{ "inset-bs": T() }],
              "inset-be": [{ "inset-be": T() }],
              top: [{ top: T() }],
              right: [{ right: T() }],
              bottom: [{ bottom: T() }],
              left: [{ left: T() }],
              visibility: [`visible`, `invisible`, `collapse`],
              z: [{ z: [scope._f, `auto`, scope.Q, scope.Z] }],
              basis: [{ basis: [scope.gf, `full`, `auto`, s, ...w2()] }],
              "flex-direction": [{ flex: [`row`, `row-reverse`, `col`, `col-reverse`] }],
              "flex-wrap": [{ flex: [`nowrap`, `wrap`, `wrap-reverse`] }],
              flex: [{ flex: [scope.X, scope.gf, `auto`, `initial`, `none`, scope.Z] }],
              grow: [{ grow: [``, scope.X, scope.Q, scope.Z] }],
              shrink: [{ shrink: [``, scope.X, scope.Q, scope.Z] }],
              order: [{ order: [scope._f, `first`, `last`, `none`, scope.Q, scope.Z] }],
              "grid-cols": [{ "grid-cols": E() }],
              "col-start-end": [{ col: ee() }],
              "col-start": [{ "col-start": D() }],
              "col-end": [{ "col-end": D() }],
              "grid-rows": [{ "grid-rows": E() }],
              "row-start-end": [{ row: ee() }],
              "row-start": [{ "row-start": D() }],
              "row-end": [{ "row-end": D() }],
              "grid-flow": [{ "grid-flow": [`row`, `col`, `dense`, `row-dense`, `col-dense`] }],
              "auto-cols": [{ "auto-cols": te() }],
              "auto-rows": [{ "auto-rows": te() }],
              gap: [{ gap: w2() }],
              "gap-x": [{ "gap-x": w2() }],
              "gap-y": [{ "gap-y": w2() }],
              "justify-content": [{ justify: [...O(), `normal`] }],
              "justify-items": [{ "justify-items": [...k(), `normal`] }],
              "justify-self": [{ "justify-self": [`auto`, ...k()] }],
              "align-content": [{ content: [`normal`, ...O()] }],
              "align-items": [{ items: [...k(), { baseline: [``, `last`] }] }],
              "align-self": [{ self: [`auto`, ...k(), { baseline: [``, `last`] }] }],
              "place-content": [{ "place-content": O() }],
              "place-items": [{ "place-items": [...k(), `baseline`] }],
              "place-self": [{ "place-self": [`auto`, ...k()] }],
              p: [{ p: w2() }],
              px: [{ px: w2() }],
              py: [{ py: w2() }],
              ps: [{ ps: w2() }],
              pe: [{ pe: w2() }],
              pbs: [{ pbs: w2() }],
              pbe: [{ pbe: w2() }],
              pt: [{ pt: w2() }],
              pr: [{ pr: w2() }],
              pb: [{ pb: w2() }],
              pl: [{ pl: w2() }],
              m: [{ m: A() }],
              mx: [{ mx: A() }],
              my: [{ my: A() }],
              ms: [{ ms: A() }],
              me: [{ me: A() }],
              mbs: [{ mbs: A() }],
              mbe: [{ mbe: A() }],
              mt: [{ mt: A() }],
              mr: [{ mr: A() }],
              mb: [{ mb: A() }],
              ml: [{ ml: A() }],
              "space-x": [{ "space-x": w2() }],
              "space-x-reverse": [`space-x-reverse`],
              "space-y": [{ "space-y": w2() }],
              "space-y-reverse": [`space-y-reverse`],
              size: [{ size: j() }],
              "inline-size": [{ inline: [`auto`, ...M()] }],
              "min-inline-size": [{ "min-inline": [`auto`, ...M()] }],
              "max-inline-size": [{ "max-inline": [`none`, ...M()] }],
              "block-size": [{ block: [`auto`, ...N()] }],
              "min-block-size": [{ "min-block": [`auto`, ...N()] }],
              "max-block-size": [{ "max-block": [`none`, ...N()] }],
              w: [{ w: [s, `screen`, ...j()] }],
              "min-w": [{ "min-w": [s, `screen`, `none`, ...j()] }],
              "max-w": [{ "max-w": [s, `screen`, `none`, `prose`, { screen: [o] }, ...j()] }],
              h: [{ h: [`screen`, `lh`, ...j()] }],
              "min-h": [{ "min-h": [`screen`, `lh`, `none`, ...j()] }],
              "max-h": [{ "max-h": [`screen`, `lh`, `none`, ...j()] }],
              "font-size": [{ text: [`base`, n, scope.Ff, scope.Of] }],
              "font-smoothing": [`antialiased`, `subpixel-antialiased`],
              "font-style": [`italic`, `not-italic`],
              "font-weight": [{ font: [r, scope.Vf, scope.Af] }],
              "font-stretch": [
                {
                  "font-stretch": [
                    `ultra-condensed`,
                    `extra-condensed`,
                    `condensed`,
                    `semi-condensed`,
                    `normal`,
                    `semi-expanded`,
                    `expanded`,
                    `extra-expanded`,
                    `ultra-expanded`,
                    scope.vf,
                    scope.Z
                  ]
                }
              ],
              "font-family": [{ font: [scope.If, scope.jf, t] }],
              "font-features": [{ "font-features": [scope.Z] }],
              "fvn-normal": [`normal-nums`],
              "fvn-ordinal": [`ordinal`],
              "fvn-slashed-zero": [`slashed-zero`],
              "fvn-figure": [`lining-nums`, `oldstyle-nums`],
              "fvn-spacing": [`proportional-nums`, `tabular-nums`],
              "fvn-fraction": [`diagonal-fractions`, `stacked-fractions`],
              tracking: [{ tracking: [i, scope.Q, scope.Z] }],
              "line-clamp": [{ "line-clamp": [scope.X, `none`, scope.Q, scope.kf] }],
              leading: [{ leading: [`none`, a, ...w2()] }],
              "list-image": [{ "list-image": [`none`, scope.Q, scope.Z] }],
              "list-style-position": [{ list: [`inside`, `outside`] }],
              "list-style-type": [{ list: [`disc`, `decimal`, `none`, scope.Q, scope.Z] }],
              "text-alignment": [{ text: [`left`, `center`, `right`, `justify`, `start`, `end`] }],
              "placeholder-color": [{ placeholder: P() }],
              "text-color": [{ text: P() }],
              "text-decoration": [`underline`, `overline`, `line-through`, `no-underline`],
              "text-decoration-style": [{ decoration: [...oe(), `wavy`] }],
              "text-decoration-thickness": [
                { decoration: [scope.X, `from-font`, `auto`, scope.Q, scope.Of] }
              ],
              "text-decoration-color": [{ decoration: P() }],
              "underline-offset": [{ "underline-offset": [scope.X, `auto`, scope.Q, scope.Z] }],
              "text-transform": [`uppercase`, `lowercase`, `capitalize`, `normal-case`],
              "text-overflow": [`truncate`, `text-ellipsis`, `text-clip`],
              "text-wrap": [{ text: [`wrap`, `nowrap`, `balance`, `pretty`] }],
              indent: [{ indent: w2() }],
              "tab-size": [{ tab: [scope._f, scope.Q, scope.Z] }],
              "vertical-align": [
                {
                  align: [
                    `baseline`,
                    `top`,
                    `middle`,
                    `bottom`,
                    `text-top`,
                    `text-bottom`,
                    `sub`,
                    `super`,
                    scope.Q,
                    scope.Z
                  ]
                }
              ],
              whitespace: [
                { whitespace: [`normal`, `nowrap`, `pre`, `pre-line`, `pre-wrap`, `break-spaces`] }
              ],
              break: [{ break: [`normal`, `words`, `all`, `keep`] }],
              wrap: [{ wrap: [`break-word`, `anywhere`, `normal`] }],
              hyphens: [{ hyphens: [`none`, `manual`, `auto`] }],
              content: [{ content: [`none`, scope.Q, scope.Z] }],
              "bg-attachment": [{ bg: [`fixed`, `local`, `scroll`] }],
              "bg-clip": [{ "bg-clip": [`border`, `padding`, `content`, `text`] }],
              "bg-origin": [{ "bg-origin": [`border`, `padding`, `content`] }],
              "bg-position": [{ bg: ne() }],
              "bg-repeat": [{ bg: re() }],
              "bg-size": [{ bg: ie() }],
              "bg-image": [
                {
                  bg: [
                    `none`,
                    {
                      linear: [
                        { to: [`t`, `tr`, `r`, `br`, `b`, `bl`, `l`, `tl`] },
                        scope._f,
                        scope.Q,
                        scope.Z
                      ],
                      radial: [``, scope.Q, scope.Z],
                      conic: [``, scope._f, scope.Q, scope.Z]
                    },
                    scope.zf,
                    scope.Nf
                  ]
                }
              ],
              "bg-color": [{ bg: P() }],
              "gradient-from-pos": [{ from: ae() }],
              "gradient-via-pos": [{ via: ae() }],
              "gradient-to-pos": [{ to: ae() }],
              "gradient-from": [{ from: P() }],
              "gradient-via": [{ via: P() }],
              "gradient-to": [{ to: P() }],
              rounded: [{ rounded: F() }],
              "rounded-s": [{ "rounded-s": F() }],
              "rounded-e": [{ "rounded-e": F() }],
              "rounded-t": [{ "rounded-t": F() }],
              "rounded-r": [{ "rounded-r": F() }],
              "rounded-b": [{ "rounded-b": F() }],
              "rounded-l": [{ "rounded-l": F() }],
              "rounded-ss": [{ "rounded-ss": F() }],
              "rounded-se": [{ "rounded-se": F() }],
              "rounded-ee": [{ "rounded-ee": F() }],
              "rounded-es": [{ "rounded-es": F() }],
              "rounded-tl": [{ "rounded-tl": F() }],
              "rounded-tr": [{ "rounded-tr": F() }],
              "rounded-br": [{ "rounded-br": F() }],
              "rounded-bl": [{ "rounded-bl": F() }],
              "border-w": [{ border: I() }],
              "border-w-x": [{ "border-x": I() }],
              "border-w-y": [{ "border-y": I() }],
              "border-w-s": [{ "border-s": I() }],
              "border-w-e": [{ "border-e": I() }],
              "border-w-bs": [{ "border-bs": I() }],
              "border-w-be": [{ "border-be": I() }],
              "border-w-t": [{ "border-t": I() }],
              "border-w-r": [{ "border-r": I() }],
              "border-w-b": [{ "border-b": I() }],
              "border-w-l": [{ "border-l": I() }],
              "divide-x": [{ "divide-x": I() }],
              "divide-x-reverse": [`divide-x-reverse`],
              "divide-y": [{ "divide-y": I() }],
              "divide-y-reverse": [`divide-y-reverse`],
              "border-style": [{ border: [...oe(), `hidden`, `none`] }],
              "divide-style": [{ divide: [...oe(), `hidden`, `none`] }],
              "border-color": [{ border: P() }],
              "border-color-x": [{ "border-x": P() }],
              "border-color-y": [{ "border-y": P() }],
              "border-color-s": [{ "border-s": P() }],
              "border-color-e": [{ "border-e": P() }],
              "border-color-bs": [{ "border-bs": P() }],
              "border-color-be": [{ "border-be": P() }],
              "border-color-t": [{ "border-t": P() }],
              "border-color-r": [{ "border-r": P() }],
              "border-color-b": [{ "border-b": P() }],
              "border-color-l": [{ "border-l": P() }],
              "divide-color": [{ divide: P() }],
              "outline-style": [{ outline: [...oe(), `none`, `hidden`] }],
              "outline-offset": [{ "outline-offset": [scope.X, scope.Q, scope.Z] }],
              "outline-w": [{ outline: [``, scope.X, scope.Ff, scope.Of] }],
              "outline-color": [{ outline: P() }],
              shadow: [{ shadow: [``, `inner`, `none`, u, scope.Bf, scope.Pf] }],
              "shadow-color": [{ shadow: P() }],
              "inset-shadow": [{ "inset-shadow": [`none`, d, scope.Bf, scope.Pf] }],
              "inset-shadow-color": [{ "inset-shadow": P() }],
              "ring-w": [{ ring: I() }],
              "ring-w-inset": [`ring-inset`],
              "ring-color": [{ ring: P() }],
              "ring-offset-w": [{ "ring-offset": [scope.X, scope.Of] }],
              "ring-offset-color": [{ "ring-offset": P() }],
              "inset-ring-w": [{ "inset-ring": I() }],
              "inset-ring-color": [{ "inset-ring": P() }],
              "text-shadow": [{ "text-shadow": [`none`, f2, scope.Bf, scope.Pf] }],
              "text-shadow-color": [{ "text-shadow": P() }],
              opacity: [{ opacity: [scope.X, scope.Q, scope.Z] }],
              "mix-blend": [{ "mix-blend": [...se(), `plus-darker`, `plus-lighter`] }],
              "bg-blend": [{ "bg-blend": se() }],
              "mask-clip": [
                { "mask-clip": [`border`, `padding`, `content`, `fill`, `stroke`, `view`] },
                `mask-no-clip`
              ],
              "mask-composite": [{ mask: [`add`, `subtract`, `intersect`, `exclude`] }],
              "mask-image-linear-pos": [{ "mask-linear": [scope.X] }],
              "mask-image-linear-from-pos": [{ "mask-linear-from": L() }],
              "mask-image-linear-to-pos": [{ "mask-linear-to": L() }],
              "mask-image-linear-from-color": [{ "mask-linear-from": P() }],
              "mask-image-linear-to-color": [{ "mask-linear-to": P() }],
              "mask-image-t-from-pos": [{ "mask-t-from": L() }],
              "mask-image-t-to-pos": [{ "mask-t-to": L() }],
              "mask-image-t-from-color": [{ "mask-t-from": P() }],
              "mask-image-t-to-color": [{ "mask-t-to": P() }],
              "mask-image-r-from-pos": [{ "mask-r-from": L() }],
              "mask-image-r-to-pos": [{ "mask-r-to": L() }],
              "mask-image-r-from-color": [{ "mask-r-from": P() }],
              "mask-image-r-to-color": [{ "mask-r-to": P() }],
              "mask-image-b-from-pos": [{ "mask-b-from": L() }],
              "mask-image-b-to-pos": [{ "mask-b-to": L() }],
              "mask-image-b-from-color": [{ "mask-b-from": P() }],
              "mask-image-b-to-color": [{ "mask-b-to": P() }],
              "mask-image-l-from-pos": [{ "mask-l-from": L() }],
              "mask-image-l-to-pos": [{ "mask-l-to": L() }],
              "mask-image-l-from-color": [{ "mask-l-from": P() }],
              "mask-image-l-to-color": [{ "mask-l-to": P() }],
              "mask-image-x-from-pos": [{ "mask-x-from": L() }],
              "mask-image-x-to-pos": [{ "mask-x-to": L() }],
              "mask-image-x-from-color": [{ "mask-x-from": P() }],
              "mask-image-x-to-color": [{ "mask-x-to": P() }],
              "mask-image-y-from-pos": [{ "mask-y-from": L() }],
              "mask-image-y-to-pos": [{ "mask-y-to": L() }],
              "mask-image-y-from-color": [{ "mask-y-from": P() }],
              "mask-image-y-to-color": [{ "mask-y-to": P() }],
              "mask-image-radial": [{ "mask-radial": [scope.Q, scope.Z] }],
              "mask-image-radial-from-pos": [{ "mask-radial-from": L() }],
              "mask-image-radial-to-pos": [{ "mask-radial-to": L() }],
              "mask-image-radial-from-color": [{ "mask-radial-from": P() }],
              "mask-image-radial-to-color": [{ "mask-radial-to": P() }],
              "mask-image-radial-shape": [{ "mask-radial": [`circle`, `ellipse`] }],
              "mask-image-radial-size": [
                { "mask-radial": [{ closest: [`side`, `corner`], farthest: [`side`, `corner`] }] }
              ],
              "mask-image-radial-pos": [{ "mask-radial-at": b() }],
              "mask-image-conic-pos": [{ "mask-conic": [scope.X] }],
              "mask-image-conic-from-pos": [{ "mask-conic-from": L() }],
              "mask-image-conic-to-pos": [{ "mask-conic-to": L() }],
              "mask-image-conic-from-color": [{ "mask-conic-from": P() }],
              "mask-image-conic-to-color": [{ "mask-conic-to": P() }],
              "mask-mode": [{ mask: [`alpha`, `luminance`, `match`] }],
              "mask-origin": [
                { "mask-origin": [`border`, `padding`, `content`, `fill`, `stroke`, `view`] }
              ],
              "mask-position": [{ mask: ne() }],
              "mask-repeat": [{ mask: re() }],
              "mask-size": [{ mask: ie() }],
              "mask-type": [{ "mask-type": [`alpha`, `luminance`] }],
              "mask-image": [{ mask: [`none`, scope.Q, scope.Z] }],
              filter: [{ filter: [``, `none`, scope.Q, scope.Z] }],
              blur: [{ blur: ce() }],
              brightness: [{ brightness: [scope.X, scope.Q, scope.Z] }],
              contrast: [{ contrast: [scope.X, scope.Q, scope.Z] }],
              "drop-shadow": [{ "drop-shadow": [``, `none`, p, scope.Bf, scope.Pf] }],
              "drop-shadow-color": [{ "drop-shadow": P() }],
              grayscale: [{ grayscale: [``, scope.X, scope.Q, scope.Z] }],
              "hue-rotate": [{ "hue-rotate": [scope.X, scope.Q, scope.Z] }],
              invert: [{ invert: [``, scope.X, scope.Q, scope.Z] }],
              saturate: [{ saturate: [scope.X, scope.Q, scope.Z] }],
              sepia: [{ sepia: [``, scope.X, scope.Q, scope.Z] }],
              "backdrop-filter": [{ "backdrop-filter": [``, `none`, scope.Q, scope.Z] }],
              "backdrop-blur": [{ "backdrop-blur": ce() }],
              "backdrop-brightness": [{ "backdrop-brightness": [scope.X, scope.Q, scope.Z] }],
              "backdrop-contrast": [{ "backdrop-contrast": [scope.X, scope.Q, scope.Z] }],
              "backdrop-grayscale": [{ "backdrop-grayscale": [``, scope.X, scope.Q, scope.Z] }],
              "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [scope.X, scope.Q, scope.Z] }],
              "backdrop-invert": [{ "backdrop-invert": [``, scope.X, scope.Q, scope.Z] }],
              "backdrop-opacity": [{ "backdrop-opacity": [scope.X, scope.Q, scope.Z] }],
              "backdrop-saturate": [{ "backdrop-saturate": [scope.X, scope.Q, scope.Z] }],
              "backdrop-sepia": [{ "backdrop-sepia": [``, scope.X, scope.Q, scope.Z] }],
              "border-collapse": [{ border: [`collapse`, `separate`] }],
              "border-spacing": [{ "border-spacing": w2() }],
              "border-spacing-x": [{ "border-spacing-x": w2() }],
              "border-spacing-y": [{ "border-spacing-y": w2() }],
              "table-layout": [{ table: [`auto`, `fixed`] }],
              caption: [{ caption: [`top`, `bottom`] }],
              transition: [
                {
                  transition: [
                    ``,
                    `all`,
                    `colors`,
                    `opacity`,
                    `shadow`,
                    `transform`,
                    `none`,
                    scope.Q,
                    scope.Z
                  ]
                }
              ],
              "transition-behavior": [{ transition: [`normal`, `discrete`] }],
              duration: [{ duration: [scope.X, `initial`, scope.Q, scope.Z] }],
              ease: [{ ease: [`linear`, `initial`, _, scope.Q, scope.Z] }],
              delay: [{ delay: [scope.X, scope.Q, scope.Z] }],
              animate: [{ animate: [`none`, v2, scope.Q, scope.Z] }],
              backface: [{ backface: [`hidden`, `visible`] }],
              perspective: [{ perspective: [h, scope.Q, scope.Z] }],
              "perspective-origin": [{ "perspective-origin": x() }],
              rotate: [{ rotate: le() }],
              "rotate-x": [{ "rotate-x": le() }],
              "rotate-y": [{ "rotate-y": le() }],
              "rotate-z": [{ "rotate-z": le() }],
              scale: [{ scale: R() }],
              "scale-x": [{ "scale-x": R() }],
              "scale-y": [{ "scale-y": R() }],
              "scale-z": [{ "scale-z": R() }],
              "scale-3d": [`scale-3d`],
              skew: [{ skew: z() }],
              "skew-x": [{ "skew-x": z() }],
              "skew-y": [{ "skew-y": z() }],
              transform: [{ transform: [scope.Q, scope.Z, ``, `none`, `gpu`, `cpu`] }],
              "transform-origin": [{ origin: x() }],
              "transform-style": [{ transform: [`3d`, `flat`] }],
              translate: [{ translate: ue() }],
              "translate-x": [{ "translate-x": ue() }],
              "translate-y": [{ "translate-y": ue() }],
              "translate-z": [{ "translate-z": ue() }],
              "translate-none": [`translate-none`],
              zoom: [{ zoom: [scope._f, scope.Q, scope.Z] }],
              accent: [{ accent: P() }],
              appearance: [{ appearance: [`none`, `auto`] }],
              "caret-color": [{ caret: P() }],
              "color-scheme": [
                { scheme: [`normal`, `dark`, `light`, `light-dark`, `only-dark`, `only-light`] }
              ],
              cursor: [
                {
                  cursor: [
                    `auto`,
                    `default`,
                    `pointer`,
                    `wait`,
                    `text`,
                    `move`,
                    `help`,
                    `not-allowed`,
                    `none`,
                    `context-menu`,
                    `progress`,
                    `cell`,
                    `crosshair`,
                    `vertical-text`,
                    `alias`,
                    `copy`,
                    `no-drop`,
                    `grab`,
                    `grabbing`,
                    `all-scroll`,
                    `col-resize`,
                    `row-resize`,
                    `n-resize`,
                    `e-resize`,
                    `s-resize`,
                    `w-resize`,
                    `ne-resize`,
                    `nw-resize`,
                    `se-resize`,
                    `sw-resize`,
                    `ew-resize`,
                    `ns-resize`,
                    `nesw-resize`,
                    `nwse-resize`,
                    `zoom-in`,
                    `zoom-out`,
                    scope.Q,
                    scope.Z
                  ]
                }
              ],
              "field-sizing": [{ "field-sizing": [`fixed`, `content`] }],
              "pointer-events": [{ "pointer-events": [`auto`, `none`] }],
              resize: [{ resize: [`none`, ``, `y`, `x`] }],
              "scroll-behavior": [{ scroll: [`auto`, `smooth`] }],
              "scrollbar-thumb-color": [{ "scrollbar-thumb": P() }],
              "scrollbar-track-color": [{ "scrollbar-track": P() }],
              "scrollbar-gutter": [{ "scrollbar-gutter": [`auto`, `stable`, `both`] }],
              "scrollbar-w": [{ scrollbar: [`auto`, `thin`, `none`] }],
              "scroll-m": [{ "scroll-m": w2() }],
              "scroll-mx": [{ "scroll-mx": w2() }],
              "scroll-my": [{ "scroll-my": w2() }],
              "scroll-ms": [{ "scroll-ms": w2() }],
              "scroll-me": [{ "scroll-me": w2() }],
              "scroll-mbs": [{ "scroll-mbs": w2() }],
              "scroll-mbe": [{ "scroll-mbe": w2() }],
              "scroll-mt": [{ "scroll-mt": w2() }],
              "scroll-mr": [{ "scroll-mr": w2() }],
              "scroll-mb": [{ "scroll-mb": w2() }],
              "scroll-ml": [{ "scroll-ml": w2() }],
              "scroll-p": [{ "scroll-p": w2() }],
              "scroll-px": [{ "scroll-px": w2() }],
              "scroll-py": [{ "scroll-py": w2() }],
              "scroll-ps": [{ "scroll-ps": w2() }],
              "scroll-pe": [{ "scroll-pe": w2() }],
              "scroll-pbs": [{ "scroll-pbs": w2() }],
              "scroll-pbe": [{ "scroll-pbe": w2() }],
              "scroll-pt": [{ "scroll-pt": w2() }],
              "scroll-pr": [{ "scroll-pr": w2() }],
              "scroll-pb": [{ "scroll-pb": w2() }],
              "scroll-pl": [{ "scroll-pl": w2() }],
              "snap-align": [{ snap: [`start`, `end`, `center`, `align-none`] }],
              "snap-stop": [{ snap: [`normal`, `always`] }],
              "snap-type": [{ snap: [`none`, `x`, `y`, `both`] }],
              "snap-strictness": [{ snap: [`mandatory`, `proximity`] }],
              touch: [{ touch: [`auto`, `none`, `manipulation`] }],
              "touch-x": [{ "touch-pan": [`x`, `left`, `right`] }],
              "touch-y": [{ "touch-pan": [`y`, `up`, `down`] }],
              "touch-pz": [`touch-pinch-zoom`],
              select: [{ select: [`none`, `text`, `all`, `auto`] }],
              "will-change": [
                { "will-change": [`auto`, `scroll`, `contents`, `transform`, scope.Q, scope.Z] }
              ],
              fill: [{ fill: [`none`, ...P()] }],
              "stroke-w": [{ stroke: [scope.X, scope.Ff, scope.Of, scope.kf] }],
              stroke: [{ stroke: [`none`, ...P()] }],
              "forced-color-adjust": [{ "forced-color-adjust": [`auto`, `none`] }]
            },
            conflictingClassGroups: {
              "container-named": [`container-type`],
              overflow: [`overflow-x`, `overflow-y`],
              overscroll: [`overscroll-x`, `overscroll-y`],
              inset: [
                `inset-x`,
                `inset-y`,
                `inset-bs`,
                `inset-be`,
                `start`,
                `end`,
                `top`,
                `right`,
                `bottom`,
                `left`
              ],
              "inset-x": [`start`, `end`, `right`, `left`],
              "inset-y": [`inset-bs`, `inset-be`, `top`, `bottom`],
              flex: [`basis`, `grow`, `shrink`],
              gap: [`gap-x`, `gap-y`],
              p: [`px`, `py`, `ps`, `pe`, `pbs`, `pbe`, `pt`, `pr`, `pb`, `pl`],
              px: [`ps`, `pe`, `pr`, `pl`],
              py: [`pbs`, `pbe`, `pt`, `pb`],
              m: [`mx`, `my`, `ms`, `me`, `mbs`, `mbe`, `mt`, `mr`, `mb`, `ml`],
              mx: [`ms`, `me`, `mr`, `ml`],
              my: [`mbs`, `mbe`, `mt`, `mb`],
              size: [`w`, `h`],
              "font-size": [`leading`],
              "fvn-normal": [
                `fvn-ordinal`,
                `fvn-slashed-zero`,
                `fvn-figure`,
                `fvn-spacing`,
                `fvn-fraction`
              ],
              "fvn-ordinal": [`fvn-normal`],
              "fvn-slashed-zero": [`fvn-normal`],
              "fvn-figure": [`fvn-normal`],
              "fvn-spacing": [`fvn-normal`],
              "fvn-fraction": [`fvn-normal`],
              "line-clamp": [`display`, `overflow`],
              rounded: [
                `rounded-s`,
                `rounded-e`,
                `rounded-t`,
                `rounded-r`,
                `rounded-b`,
                `rounded-l`,
                `rounded-ss`,
                `rounded-se`,
                `rounded-ee`,
                `rounded-es`,
                `rounded-tl`,
                `rounded-tr`,
                `rounded-br`,
                `rounded-bl`
              ],
              "rounded-s": [`rounded-ss`, `rounded-es`],
              "rounded-e": [`rounded-se`, `rounded-ee`],
              "rounded-t": [`rounded-tl`, `rounded-tr`],
              "rounded-r": [`rounded-tr`, `rounded-br`],
              "rounded-b": [`rounded-br`, `rounded-bl`],
              "rounded-l": [`rounded-tl`, `rounded-bl`],
              "border-spacing": [`border-spacing-x`, `border-spacing-y`],
              "border-w": [
                `border-w-x`,
                `border-w-y`,
                `border-w-s`,
                `border-w-e`,
                `border-w-bs`,
                `border-w-be`,
                `border-w-t`,
                `border-w-r`,
                `border-w-b`,
                `border-w-l`
              ],
              "border-w-x": [`border-w-s`, `border-w-e`, `border-w-r`, `border-w-l`],
              "border-w-y": [`border-w-bs`, `border-w-be`, `border-w-t`, `border-w-b`],
              "border-color": [
                `border-color-x`,
                `border-color-y`,
                `border-color-s`,
                `border-color-e`,
                `border-color-bs`,
                `border-color-be`,
                `border-color-t`,
                `border-color-r`,
                `border-color-b`,
                `border-color-l`
              ],
              "border-color-x": [
                `border-color-s`,
                `border-color-e`,
                `border-color-r`,
                `border-color-l`
              ],
              "border-color-y": [
                `border-color-bs`,
                `border-color-be`,
                `border-color-t`,
                `border-color-b`
              ],
              translate: [`translate-x`, `translate-y`, `translate-none`],
              "translate-none": [`translate`, `translate-x`, `translate-y`, `translate-z`],
              "scroll-m": [
                `scroll-mx`,
                `scroll-my`,
                `scroll-ms`,
                `scroll-me`,
                `scroll-mbs`,
                `scroll-mbe`,
                `scroll-mt`,
                `scroll-mr`,
                `scroll-mb`,
                `scroll-ml`
              ],
              "scroll-mx": [`scroll-ms`, `scroll-me`, `scroll-mr`, `scroll-ml`],
              "scroll-my": [`scroll-mbs`, `scroll-mbe`, `scroll-mt`, `scroll-mb`],
              "scroll-p": [
                `scroll-px`,
                `scroll-py`,
                `scroll-ps`,
                `scroll-pe`,
                `scroll-pbs`,
                `scroll-pbe`,
                `scroll-pt`,
                `scroll-pr`,
                `scroll-pb`,
                `scroll-pl`
              ],
              "scroll-px": [`scroll-ps`, `scroll-pe`, `scroll-pr`, `scroll-pl`],
              "scroll-py": [`scroll-pbs`, `scroll-pbe`, `scroll-pt`, `scroll-pb`],
              touch: [`touch-x`, `touch-y`, `touch-pz`],
              "touch-x": [`touch`],
              "touch-y": [`touch`],
              "touch-pz": [`touch`]
            },
            conflictingClassGroupModifiers: { "font-size": [`leading`] },
            postfixLookupClassGroups: [`container-type`],
            orderSensitiveModifiers: [
              `*`,
              `**`,
              `after`,
              `backdrop`,
              `before`,
              `details-content`,
              `file`,
              `first-letter`,
              `first-line`,
              `marker`,
              `placeholder`,
              `selection`
            ]
          };
        });
        break;
      }
    }
  },
  storeProperties: {}
});
var appRuntime2 = createUiModuleRuntime({
  bindingNames: [
    "K",
    "Te",
    "Ee",
    "De",
    "Oe",
    "ke",
    "Ae",
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
    "tt",
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
    "Nt"
  ],
  register(scope) {
    scope.K = function K({ children: e, ...t }) {
      let n = (0, scope.G.useContext)(scope.ie);
      t = { ...n, ...t }, t.transition = (0, scope.D)(t.transition, n.transition), t.isStatic = (0, scope.k)(() => t.isStatic);
      let r = (0, scope.G.useMemo)(
        () => t,
        [
          JSON.stringify(t.transition),
          t.transformPagePoint,
          t.reducedMotion,
          t.skipAnimations,
          t.isValidProp
        ]
      );
      return (0, scope.W.jsx)(scope.ie.Provider, { value: r, children: e });
    };
    scope.Te = function Te2() {
      !scope.I.current && (0, scope.S)();
      let [e] = (0, scope.G.useState)(scope.E.current);
      return e;
    };
    scope.jt = function jt(e, t = scope.At) {
      let n = scope.G.useSyncExternalStore(
        e.subscribe,
        scope.G.useCallback(() => t(e.getState()), [e, t]),
        scope.G.useCallback(() => t(e.getInitialState()), [e, t])
      );
      return scope.G.useDebugValue(n), n;
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.Ee = {
          name: `arrow-down-up`,
          size: 24,
          node: [
            [`path`, { d: `m3 16 4 4 4-4`, key: `1co6wj` }],
            [`path`, { d: `M7 20V4`, key: `1yoxec` }],
            [`path`, { d: `m21 8-4-4-4 4`, key: `1c9v7m` }],
            [`path`, { d: `M17 4v16`, key: `7dpous` }]
          ]
        };
        break;
      }
      case 1: {
        scope.Ee.node;
        break;
      }
      case 2: {
        scope.De = (0, scope.n)(scope.Ee);
        break;
      }
      case 3: {
        scope.Oe = {
          name: `chevron-right`,
          size: 24,
          node: [[`path`, { d: `m9 18 6-6-6-6`, key: `mthhwq` }]]
        };
        break;
      }
      case 4: {
        scope.Oe.node;
        break;
      }
      case 5: {
        scope.ke = (0, scope.n)(scope.Oe);
        break;
      }
      case 6: {
        scope.Ae = {
          name: `circle-dot`,
          size: 24,
          node: [
            [`circle`, { cx: `12`, cy: `12`, r: `1`, key: `41hilf` }],
            [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }]
          ]
        };
        break;
      }
      case 7: {
        scope.Ae.node;
        break;
      }
      case 8: {
        scope.je = (0, scope.n)(scope.Ae);
        break;
      }
      case 9: {
        scope.Me = {
          name: `compass`,
          size: 24,
          node: [
            [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
            [
              `path`,
              {
                d: `m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z`,
                key: `9ktpf1`
              }
            ]
          ]
        };
        break;
      }
      case 10: {
        scope.Me.node;
        break;
      }
      case 11: {
        scope.Ne = (0, scope.n)(scope.Me);
        break;
      }
      case 12: {
        scope.Pe = {
          name: `file-key`,
          size: 24,
          node: [
            [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5`, key: `wfsgrz` }],
            [`path`, { d: `M4 12v6`, key: `bg1pfk` }],
            [`path`, { d: `M4 14h2`, key: `1sf9f8` }],
            [
              `path`,
              {
                d: `M9.65 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v4`,
                key: `d56i0q`
              }
            ],
            [`circle`, { cx: `4`, cy: `20`, r: `2`, key: `6kqj1y` }]
          ],
          aliases: [`file-key-2`]
        };
        break;
      }
      case 13: {
        scope.Pe.node;
        break;
      }
      case 14: {
        scope.Fe = (0, scope.n)(scope.Pe);
        break;
      }
      case 15: {
        scope.Ie = {
          name: `folder`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,
                key: `1kt360`
              }
            ]
          ]
        };
        break;
      }
      case 16: {
        scope.Ie.node;
        break;
      }
      case 17: {
        scope.Le = (0, scope.n)(scope.Ie);
        break;
      }
      case 18: {
        scope.Re = {
          name: `globe`,
          size: 24,
          node: [
            [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
            [`path`, { d: `M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20`, key: `13o1zl` }],
            [`path`, { d: `M2 12h20`, key: `9i4pu4` }]
          ]
        };
        break;
      }
      case 19: {
        scope.Re.node;
        break;
      }
      case 20: {
        scope.ze = (0, scope.n)(scope.Re);
        break;
      }
      case 21: {
        scope.Be = {
          name: `house`,
          size: 24,
          node: [
            [`path`, { d: `M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8`, key: `5wwlr5` }],
            [
              `path`,
              {
                d: `M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z`,
                key: `r6nss1`
              }
            ]
          ],
          aliases: [`home`]
        };
        break;
      }
      case 22: {
        scope.Be.node;
        break;
      }
      case 23: {
        scope.Ve = (0, scope.n)(scope.Be);
        break;
      }
      case 24: {
        scope.He = {
          name: `import`,
          size: 24,
          node: [
            [`path`, { d: `M12 3v12`, key: `1x0j5s` }],
            [`path`, { d: `m8 11 4 4 4-4`, key: `1dohi6` }],
            [
              `path`,
              {
                d: `M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4`,
                key: `1ywtjm`
              }
            ]
          ]
        };
        break;
      }
      case 25: {
        scope.He.node;
        break;
      }
      case 26: {
        scope.Ue = (0, scope.n)(scope.He);
        break;
      }
      case 27: {
        scope.We = {
          name: `key-round`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`,
                key: `1s6t7t`
              }
            ],
            [`circle`, { cx: `16.5`, cy: `7.5`, r: `.5`, fill: `currentColor`, key: `w0ekpg` }]
          ]
        };
        break;
      }
      case 28: {
        scope.We.node;
        break;
      }
      case 29: {
        scope.Ge = (0, scope.n)(scope.We);
        break;
      }
      case 30: {
        scope.Ke = {
          name: `lightbulb`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5`,
                key: `1gvzjb`
              }
            ],
            [`path`, { d: `M9 18h6`, key: `x1upvd` }],
            [`path`, { d: `M10 22h4`, key: `ceow96` }]
          ]
        };
        break;
      }
      case 31: {
        scope.Ke.node;
        break;
      }
      case 32: {
        scope.qe = (0, scope.n)(scope.Ke);
        break;
      }
      case 33: {
        scope.Je = {
          name: `lock`,
          size: 24,
          node: [
            [
              `rect`,
              { width: `18`, height: `11`, x: `3`, y: `11`, rx: `2`, ry: `2`, key: `1w4ew1` }
            ],
            [`path`, { d: `M7 11V7a5 5 0 0 1 10 0v4`, key: `fwvmzm` }]
          ]
        };
        break;
      }
      case 34: {
        scope.Je.node;
        break;
      }
      case 35: {
        scope.Ye = (0, scope.n)(scope.Je);
        break;
      }
      case 36: {
        scope.Xe = { name: `minus`, size: 24, node: [[`path`, { d: `M5 12h14`, key: `1ays0h` }]] };
        break;
      }
      case 37: {
        scope.Xe.node;
        break;
      }
      case 38: {
        scope.Ze = (0, scope.n)(scope.Xe);
        break;
      }
      case 39: {
        scope.Qe = {
          name: `mouse-pointer-click`,
          size: 24,
          node: [
            [`path`, { d: `M14 4.1 12 6`, key: `ita8i4` }],
            [`path`, { d: `m5.1 8-2.9-.8`, key: `1go3kf` }],
            [`path`, { d: `m6 12-1.9 2`, key: `mnht97` }],
            [`path`, { d: `M7.2 2.2 8 5.1`, key: `1cfko1` }],
            [
              `path`,
              {
                d: `M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z`,
                key: `s0h3yz`
              }
            ]
          ]
        };
        break;
      }
      case 40: {
        scope.Qe.node;
        break;
      }
      case 41: {
        scope.$e = (0, scope.n)(scope.Qe);
        break;
      }
      case 42: {
        scope.et = {
          name: `move`,
          size: 24,
          node: [
            [`path`, { d: `M12 2v20`, key: `t6zp3m` }],
            [`path`, { d: `m15 19-3 3-3-3`, key: `11eu04` }],
            [`path`, { d: `m19 9 3 3-3 3`, key: `1mg7y2` }],
            [`path`, { d: `M2 12h20`, key: `9i4pu4` }],
            [`path`, { d: `m5 9-3 3 3 3`, key: `j64kie` }],
            [`path`, { d: `m9 5 3-3 3 3`, key: `l8vdw6` }]
          ]
        };
        break;
      }
      case 43: {
        scope.et.node;
        break;
      }
      case 44: {
        scope.tt = (0, scope.n)(scope.et);
        break;
      }
      case 45: {
        scope.nt = {
          name: `panel-right`,
          size: 24,
          node: [
            [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, key: `afitv7` }],
            [`path`, { d: `M15 3v18`, key: `14nvp0` }]
          ]
        };
        break;
      }
      case 46: {
        scope.nt.node;
        break;
      }
      case 47: {
        scope.rt = (0, scope.n)(scope.nt);
        break;
      }
      case 48: {
        scope.it = {
          name: `pin-off`,
          size: 24,
          node: [
            [`path`, { d: `M12 17v5`, key: `bb1du9` }],
            [`path`, { d: `M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89`, key: `znwnzq` }],
            [`path`, { d: `m2 2 20 20`, key: `1ooewy` }],
            [
              `path`,
              {
                d: `M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11`,
                key: `c9qhm2`
              }
            ]
          ]
        };
        break;
      }
      case 49: {
        scope.it.node;
        break;
      }
      case 50: {
        scope.at = (0, scope.n)(scope.it);
        break;
      }
      case 51: {
        scope.ot = {
          name: `pin`,
          size: 24,
          node: [
            [`path`, { d: `M12 17v5`, key: `bb1du9` }],
            [
              `path`,
              {
                d: `M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z`,
                key: `1nkz8b`
              }
            ]
          ]
        };
        break;
      }
      case 52: {
        scope.ot.node;
        break;
      }
      case 53: {
        scope.st = (0, scope.n)(scope.ot);
        break;
      }
      case 54: {
        scope.ct = {
          name: `rotate-ccw`,
          size: 24,
          node: [
            [`path`, { d: `M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`, key: `1357e3` }],
            [`path`, { d: `M3 3v5h5`, key: `1xhq8a` }]
          ]
        };
        break;
      }
      case 55: {
        scope.ct.node;
        break;
      }
      case 56: {
        scope.lt = (0, scope.n)(scope.ct);
        break;
      }
      case 57: {
        scope.ut = {
          name: `rotate-cw`,
          size: 24,
          node: [
            [`path`, { d: `M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8`, key: `1p45f6` }],
            [`path`, { d: `M21 3v5h-5`, key: `1q7to0` }]
          ]
        };
        break;
      }
      case 58: {
        scope.ut.node;
        break;
      }
      case 59: {
        scope.dt = (0, scope.n)(scope.ut);
        break;
      }
      case 60: {
        scope.ft = {
          name: `save`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z`,
                key: `1c8476`
              }
            ],
            [`path`, { d: `M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7`, key: `1ydtos` }],
            [`path`, { d: `M7 3v4a1 1 0 0 0 1 1h7`, key: `t51u73` }]
          ]
        };
        break;
      }
      case 61: {
        scope.ft.node;
        break;
      }
      case 62: {
        scope.pt = (0, scope.n)(scope.ft);
        break;
      }
      case 63: {
        scope.mt = {
          name: `scroll-text`,
          size: 24,
          node: [
            [`path`, { d: `M15 12h-5`, key: `r7krc0` }],
            [`path`, { d: `M15 8h-5`, key: `1khuty` }],
            [`path`, { d: `M19 17V5a2 2 0 0 0-2-2H4`, key: `zz82l3` }],
            [
              `path`,
              {
                d: `M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3`,
                key: `1ph1d7`
              }
            ]
          ]
        };
        break;
      }
      case 64: {
        scope.mt.node;
        break;
      }
      case 65: {
        scope.ht = (0, scope.n)(scope.mt);
        break;
      }
      case 66: {
        scope.gt = {
          name: `square-check`,
          size: 24,
          node: [
            [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, key: `afitv7` }],
            [`path`, { d: `m16 9-5.5 5.5L8 12`, key: `xofnsj` }]
          ],
          aliases: [`check-square-2`]
        };
        break;
      }
      case 67: {
        scope.gt.node;
        break;
      }
      case 68: {
        scope._t = (0, scope.n)(scope.gt);
        break;
      }
      case 69: {
        scope.vt = {
          name: `square-plus`,
          size: 24,
          node: [
            [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, key: `afitv7` }],
            [`path`, { d: `M8 12h8`, key: `1wcyev` }],
            [`path`, { d: `M12 8v8`, key: `napkw2` }]
          ],
          aliases: [`plus-square`]
        };
        break;
      }
      case 70: {
        scope.vt.node;
        break;
      }
      case 71: {
        scope.yt = (0, scope.n)(scope.vt);
        break;
      }
      case 72: {
        scope.bt = {
          name: `text-cursor-input`,
          size: 24,
          node: [
            [`path`, { d: `M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6`, key: `1528k5` }],
            [`path`, { d: `M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7`, key: `13ksps` }],
            [`path`, { d: `M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1`, key: `1n9rhb` }],
            [`path`, { d: `M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1`, key: `1mj8rg` }],
            [`path`, { d: `M9 6v12`, key: `velyjx` }]
          ]
        };
        break;
      }
      case 73: {
        scope.bt.node;
        break;
      }
      case 74: {
        scope.xt = (0, scope.n)(scope.bt);
        break;
      }
      case 75: {
        scope.St = {
          name: `timer`,
          size: 24,
          node: [
            [`line`, { x1: `10`, x2: `14`, y1: `2`, y2: `2`, key: `14vaq8` }],
            [`line`, { x1: `12`, x2: `15`, y1: `14`, y2: `11`, key: `17fdiu` }],
            [`circle`, { cx: `12`, cy: `14`, r: `8`, key: `1e1u0o` }]
          ]
        };
        break;
      }
      case 76: {
        scope.St.node;
        break;
      }
      case 77: {
        scope.Ct = (0, scope.n)(scope.St);
        break;
      }
      case 78: {
        scope.wt = {
          name: `user-check`,
          size: 24,
          node: [
            [`path`, { d: `m16 11 2 2 4-4`, key: `9rsbq5` }],
            [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`, key: `1yyitq` }],
            [`circle`, { cx: `9`, cy: `7`, r: `4`, key: `nufk8` }]
          ]
        };
        break;
      }
      case 79: {
        scope.wt.node;
        break;
      }
      case 80: {
        scope.Tt = (0, scope.n)(scope.wt);
        break;
      }
      case 81: {
        scope.Et = {
          name: `user-plus`,
          size: 24,
          node: [
            [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`, key: `1yyitq` }],
            [`circle`, { cx: `9`, cy: `7`, r: `4`, key: `nufk8` }],
            [`line`, { x1: `19`, x2: `19`, y1: `8`, y2: `14`, key: `1bvyxn` }],
            [`line`, { x1: `22`, x2: `16`, y1: `11`, y2: `11`, key: `1shjgl` }]
          ]
        };
        break;
      }
      case 82: {
        scope.Et.node;
        break;
      }
      case 83: {
        scope.Dt = (0, scope.n)(scope.Et);
        break;
      }
      case 84: {
        scope.Ot = (e) => {
          let t, n = /* @__PURE__ */ new Set(), r = (e2, r2) => {
            let i2 = typeof e2 == `function` ? e2(t) : e2;
            if (!Object.is(i2, t)) {
              let e3 = t;
              t = r2 ?? (typeof i2 != `object` || !i2) ? i2 : Object.assign({}, t, i2), n.forEach((n2) => n2(t, e3));
            }
          }, i = () => t, a = {
            setState: r,
            getState: i,
            getInitialState: () => o,
            subscribe: (e2) => (n.add(e2), () => n.delete(e2))
          }, o = t = e(r, i, a);
          return a;
        };
        break;
      }
      case 85: {
        scope.kt = (e) => e ? (0, scope.Ot)(e) : scope.Ot;
        break;
      }
      case 86: {
        scope.At = (e) => e;
        break;
      }
      case 87: {
        scope.Mt = (e) => {
          let t = (0, scope.kt)(e), n = (e2) => (0, scope.jt)(t, e2);
          return Object.assign(n, t), n;
        };
        break;
      }
      case 88: {
        scope.Nt = (e) => e ? (0, scope.Mt)(e) : scope.Mt;
        break;
      }
    }
  },
  storeProperties: {}
});

// src/modules/sites/view.js
var sharedUiRuntime3 = createUiModuleRuntime({
  bindingNames: ["td", "nd", "Ed", "Dd"],
  register(scope) {
    scope.Ed = function Ed(e) {
      var t, n, r = ``;
      if (typeof e == `string` || typeof e == `number`) r += e;
      else if (typeof e == `object`) {
        if (Array.isArray(e)) {
          var i = e.length;
          for (t = 0; t < i; t++) e[t] && (n = (0, scope.Ed)(e[t])) && (r && (r += ` `), r += n);
        } else for (n in e) e[n] && (r && (r += ` `), r += n);
      }
      return r;
    };
    scope.Dd = function Dd() {
      for (var e, t, n = 0, r = ``, i = arguments.length; n < i; n++)
        (e = arguments[n]) && (t = (0, scope.Ed)(e)) && (r && (r += ` `), r += t);
      return r;
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.td = {
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
      case 1: {
        scope.nd = {
          NEW_API: `new-api`,
          SUB2API: `sub2api`,
          VO_API_V2: `voapi-v2`,
          UNSUPPORTED: `unsupported`
        };
        break;
      }
    }
  },
  storeProperties: {}
});
var SiteCard;
var SiteEditor;
var BookmarkImportPanel;
var parseChromeBookmarkJson;
var parseBookmarkHtml;
var builtinSites;
var appRuntime3 = createUiModuleRuntime({
  bindingNames: [
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
    "$t",
    "en",
    "tn",
    "J",
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
    "Zn",
    "Qn",
    "$n",
    "er",
    "tr",
    "nr",
    "rr",
    "ir",
    "ar",
    "or",
    "Vr",
    "Hr",
    "Ur",
    "Wr",
    "Gr",
    "Kr",
    "qr",
    "Y",
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
    "si",
    "ci",
    "li",
    "ui",
    "di",
    "fi",
    "pi",
    "mi",
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
    "to",
    "no",
    "ro",
    "io",
    "ao",
    "oo",
    "so",
    "co",
    "lo",
    "$",
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
    "wo",
    "To",
    "Eo",
    "Do",
    "Oo",
    "Po",
    "Fo",
    "Io",
    "Lo",
    "Ro",
    "zo",
    "Bo",
    "Vo",
    "Bl",
    "Vl",
    "Hl",
    "Ul",
    "Wl",
    "Gl",
    "Kl",
    "ql",
    "Jl",
    "Yl"
  ],
  publish(name, value) {
    switch (name) {
      case "ro":
        SiteCard = value;
        break;
      case "Vo":
        SiteEditor = value;
        break;
      case "Oo":
        BookmarkImportPanel = value;
        break;
      case "ho":
        parseChromeBookmarkJson = value;
        break;
      case "vo":
        parseBookmarkHtml = value;
        break;
      case "pn":
        builtinSites = value;
        break;
    }
  },
  register(scope) {
    scope.Vt = function Vt(e) {
      return typeof e == `object` && !!e && !Array.isArray(e);
    };
    scope.fn = function fn(e, t, n, r) {
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
    };
    scope.mn = function mn(e) {
      return e.checkin?.method === `workflow`;
    };
    scope.hn = function hn(e) {
      return e.checkin?.method === `none` && e.checkin.learnedLoginAsCheckin === true;
    };
    scope.gn = function gn(e) {
      return (0, scope.mn)(e) || (0, scope.hn)(e);
    };
    scope._n = function _n(e, t = (0, scope.vn)(e)) {
      try {
        let n = new URL(e);
        return t?.id === `hvoy` ? (n.pathname = `/`, n.search = ``, n.hash = ``) : (t?.id === `vsllm` || t?.id === `monkeycode` || t?.id === `anyrouter` || t?.id === `denxio` || t?.id === `agentrouter`) && (n.pathname = `/login`, n.search = ``, n.hash = ``), (t?.id === `new-api-next` || t?.id === `tabiai` || t?.id === `leilei`) && (n.pathname = `/sign-in`, n.search = ``, n.hash = ``), t?.id === `baibei` && (n.pathname = `/login`, n.search = ``, n.hash = ``), t?.id === `linxi` && (n.pathname = `/login`, n.search = ``, n.hash = ``), t?.id === `linux-sb` && (n.pathname = `/login`, n.search = ``, n.hash = ``), n.href;
      } catch {
        return e;
      }
    };
    scope.vn = function vn(e) {
      let t = ``;
      try {
        t = new URL(e).hostname.toLowerCase();
      } catch {
      }
      if (t) {
        for (let e2 of scope.dn)
          if ((e2.fingerprints.hostnames ?? []).some((e3) => e3.toLowerCase() === t)) return e2;
      }
      let n = e.toLowerCase();
      for (let e2 of scope.dn)
        for (let t2 of e2.fingerprints.titleWords ?? []) if (n.includes(t2.toLowerCase())) return e2;
      return null;
    };
    scope.yn = function yn(e, t) {
      let n = t.checkin;
      return e.id === `builtin-futurehub` && n?.method === `auto` && n.workflow === void 0 && (!n.url || n.url === `/console/personal`) && !n.buttonSelector && !n.alreadySelector && !n.successSelector;
    };
    scope.bn = function bn(e, t) {
      let n = t.checkin;
      return e.id === `builtin-anyrouter` && n?.method === `auto` && n.workflow === void 0 && (!n.url || n.url === `/console/personal`) && !n.buttonSelector && !n.alreadySelector && !n.successSelector;
    };
    scope.xn = function xn(e, t) {
      if (!t) return { ...e, builtin: true };
      let n = (0, scope.yn)(e, t), r = (0, scope.bn)(e, t), i = n || r, a = !!t.checkin && (0, scope.hn)(t);
      return {
        ...e,
        ...t,
        selectors: { ...e.selectors, ...t.selectors },
        closeModalSelectors: t.closeModalSelectors?.length ? t.closeModalSelectors : e.closeModalSelectors,
        ...e.checkin || t.checkin ? {
          checkin: a ? { ...t.checkin, method: `none` } : i ? { ...e.checkin, method: e.checkin?.method ?? `auto` } : {
            ...e.checkin,
            ...t.checkin,
            method: t.checkin?.method ?? e.checkin?.method ?? `auto`
          }
        } : {},
        ...e.adapter || t.adapter ? { adapter: { ...e.adapter, ...t.adapter } } : {},
        ...e.tokenConfig || t.tokenConfig ? { tokenConfig: { ...e.tokenConfig, ...t.tokenConfig } } : {},
        builtin: true
      };
    };
    scope.Sn = function Sn() {
      return {
        name: ``,
        loginUrl: ``,
        loginMethod: `form`,
        selectors: {
          username: scope.zt.join(`, `),
          password: scope.Bt.join(`, `),
          submit: `button[type="submit"]`
        },
        closeModalSelectors: [...scope.Rt],
        checkin: { method: `auto` }
      };
    };
    scope.Zn = function Zn(e) {
      try {
        let t = new URL(e.trim());
        return (0, scope.$n)(t) ? t.href : null;
      } catch {
        return null;
      }
    };
    scope.Qn = function Qn(e) {
      return (0, scope.Zn)(e) !== null;
    };
    scope.$n = function $n(e) {
      let t = e.hostname === `localhost` || e.hostname === `127.0.0.1` || e.hostname === `[::1]`;
      return e.protocol === `https:` || e.protocol === `http:` && t;
    };
    scope.er = function er(e, t) {
      if (!t) return true;
      let n = (0, scope.Xn)(e);
      if (!n) return false;
      try {
        return new URL(t, e.loginUrl).origin === n;
      } catch {
        return false;
      }
    };
    scope.tr = function tr(e) {
      return e === `localStorage` || e === `sessionStorage` ? e : void 0;
    };
    scope.nr = function nr(e) {
      return typeof e == `string` && e.trim() ? e.trim() : void 0;
    };
    scope.rr = function rr(e) {
      let t = e.identitySource;
      if (!t || typeof t != `object` || Array.isArray(t)) return null;
      let n = t, r = {
        storageKey: (0, scope.nr)(n.storageKey),
        storageType: (0, scope.tr)(n.storageType),
        endpoint: (0, scope.nr)(n.endpoint),
        tokenKey: (0, scope.nr)(n.tokenKey),
        tokenStorageType: (0, scope.tr)(n.tokenStorageType),
        tokenHeader: (0, scope.nr)(n.tokenHeader),
        tokenPrefix: typeof n.tokenPrefix == `string` ? n.tokenPrefix : void 0
      };
      return !r.storageKey && !r.endpoint ? null : r;
    };
    scope.ir = function ir(e, t) {
      if (!t) return false;
      let n = (0, scope.Xn)(e);
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
    };
    scope.ar = function ar(e) {
      let t = [];
      (0, scope.Xn)(e) || t.push(`登录页必须使用 HTTPS（本机测试可使用 localhost HTTP）`);
      let n = e.loginMethod ?? `form`;
      if (n === `token`) {
        let n2 = e.tokenConfig;
        n2?.storageKey?.trim() || t.push(`Token 认证需要填写存储键名（如 auth_token）`), n2?.headerName?.trim() || t.push(`Token 认证需要填写请求头名称（如 Authorization）`), n2?.identityEndpoint && !(0, scope.er)(e, n2.identityEndpoint) && t.push(`身份接口必须与登录站点同源`);
      }
      n !== `oauth` && n !== `github` && n !== `passkey` && n !== `manual` && n !== `auto` && n !== `token` && (e.selectors?.username?.trim() || t.push(`缺少用户名输入框选择器`), e.selectors?.password?.trim() || t.push(`缺少密码输入框选择器`), e.selectors?.submit?.trim() || t.push(`缺少登录按钮选择器`));
      let r = (0, scope.rr)(e);
      r?.endpoint && !(0, scope.ir)(e, r.endpoint) && t.push(`跨域身份接口必须使用 HTTPS，且主机必须是登录站点域名的自身或子域`), r?.endpoint && !r.tokenKey && t.push(`跨域身份接口需要同时填写 token 存储键（tokenKey）`), e.logoutApiUrl && !(0, scope.er)(e, e.logoutApiUrl) && t.push(`退出接口必须与登录站点同源`);
      let i = e.authBootstrap?.endpoint?.trim();
      if (i) {
        let n2 = null;
        try {
          n2 = new URL(i, e.loginUrl).href;
        } catch {
          n2 = null;
        }
        (!n2 || !(0, scope.er)(e, n2)) && t.push(`令牌引导接口必须是登录站点同源的地址`);
      }
      let a = e.checkin, o = a?.method === `workflow` && !a.workflow?.route?.length;
      if (a?.entry && (!(0, scope.mn)(e) || o)) {
        if (a.entry.readySelector?.trim() || t.push(`签到入口需要填写页面就绪选择器`), !Array.isArray(a.entry.steps) || a.entry.steps.length === 0)
          t.push(`签到入口至少需要一个站内点击步骤`);
        else
          for (let [e2, n2] of a.entry.steps.entries())
            n2?.selector?.trim() || t.push(`签到入口第 ${e2 + 1} 步缺少点击选择器`);
      }
      if (a?.method === `api` && (a.apiUrl?.trim() ? (0, scope.er)(e, a.apiUrl) || t.push(`签到接口必须与登录站点同源`) : t.push(`API 签到需要填写接口地址`)), a?.method === `button` && (a.buttonSelector?.trim() || t.push(`按钮签到需要填写按钮选择器`), a.url && !(0, scope.er)(e, a.url) && t.push(`签到页面必须与登录站点同源`)), a?.method === `claim`) {
        a.claimEntrySelector?.trim() || t.push(`领取签到需要填写领取入口选择器`), a.claimInputSelector?.trim() || t.push(`领取签到需要填写输入框选择器`), a.claimSubmitSelector?.trim() || t.push(`领取签到需要填写提交按钮选择器`);
        let n2 = a.claimMinLength ?? 10, r2 = a.claimText?.trim();
        r2 && r2.length < n2 && t.push(`领取文本至少需要 ${n2} 字，当前 ${r2.length} 字`), a.url && !(0, scope.er)(e, a.url) && t.push(`领取页面必须与登录站点同源`);
      }
      return a?.method === `relogin` && (!a.logoutApiUrl?.trim() && !a.logoutSelector?.trim() && t.push(`退出重登需要填写退出接口或退出按钮选择器`), a.logoutApiUrl && !(0, scope.er)(e, a.logoutApiUrl) && t.push(`退出接口必须与登录站点同源`)), (0, scope.mn)(e) && t.push(...(0, scope.Yn)(e, a?.workflow)), t;
    };
    scope.or = function or(e) {
      let t = (0, scope.ar)(e);
      if (t.length) throw Error(t[0]);
    };
    scope.Vr = function Vr(e) {
      let t = (() => {
        try {
          let t2 = new URL(e.loginUrl);
          return t2.pathname = `/login`, t2.search = ``, t2.hash = ``, t2.href;
        } catch {
          return e.loginUrl;
        }
      })(), n = !e.successIndicator || e.successIndicator === `a[href="/console/token"], a[href="/console/topup"]`, r = e.checkin?.method === `relogin` ? {
        ...scope.Ht.checkin,
        ...e.checkin,
        logoutStorageKeys: [
          .../* @__PURE__ */ new Set([
            ...e.checkin.logoutStorageKeys ?? [],
            ...scope.Ht.checkin?.logoutStorageKeys ?? []
          ])
        ]
      } : e.checkin;
      return {
        ...e,
        loginUrl: t,
        pointerMode: e.pointerMode ?? scope.Ht.pointerMode,
        successIndicator: n ? scope.Ht.successIndicator : e.successIndicator,
        closeModalSelectors: [
          .../* @__PURE__ */ new Set([
            `button >> text=今日关闭`,
            `button >> text=关闭公告`,
            ...(e.closeModalSelectors ?? []).filter(
              (e2) => e2 !== `button >> text=今日关闭` && e2 !== `button >> text=关闭公告`
            )
          ])
        ],
        ...r ? { checkin: r } : {}
      };
    };
    scope.Hr = function Hr(e) {
      if ((0, scope.zr)(e) !== `api.futureppo.top` || (0, scope.hn)(e)) return false;
      let t = e.checkin;
      return !t || (t.method === `auto` || t.method === `none`) && t.workflow === void 0 && !t.buttonSelector && !t.alreadySelector && !t.successSelector;
    };
    scope.Ur = function Ur(e) {
      if ((0, scope.zr)(e) !== `anyrouter.top` || (0, scope.hn)(e)) return false;
      let t = e.checkin;
      return !t || (t.method === `auto` || t.method === `none`) && t.workflow === void 0 && !t.buttonSelector && !t.alreadySelector && !t.successSelector;
    };
    scope.Wr = function Wr(e) {
      if ((0, scope.zr)(e) !== `linux.sb`) return false;
      let t = e.checkin;
      return t ? t.method !== `auto` && t.method !== `button` ? false : !t.url && !t.apiUrl && !t.entry && !t.claimEntrySelector && !t.claimConfirmSelector && !t.logoutSelector && !t.logoutApiUrl && !t.workflow : true;
    };
    scope.Gr = function Gr(e) {
      if ((0, scope.zr)(e) !== `linux.sb`) return false;
      try {
        return new URL(e.loginUrl).pathname.replace(/\/+$/, ``) === ``;
      } catch {
        return false;
      }
    };
    scope.Kr = function Kr(e) {
      if (!(0, scope.Gr)(e)) return e;
      try {
        let t = new URL(e.loginUrl);
        return t.pathname = `/login`, t.search = ``, t.hash = ``, { ...e, loginUrl: t.href };
      } catch {
        return e;
      }
    };
    scope.qr = function qr(e) {
      let t = scope.en.checkin, n = scope.en.adapter, r = e.checkin, i = (() => {
        try {
          let t2 = new URL(e.loginUrl);
          return t2.pathname = `/login`, t2.search = ``, t2.hash = ``, t2.href;
        } catch {
          return e.loginUrl;
        }
      })();
      return {
        ...e,
        loginUrl: i,
        pointerMode: e.pointerMode ?? scope.en.pointerMode,
        loginMethod: e.loginMethod || scope.en.loginMethod || `form`,
        selectors: { ...scope.en.selectors, ...e.selectors },
        closeModalSelectors: e.closeModalSelectors?.length ? [...e.closeModalSelectors] : [...scope.en.closeModalSelectors],
        successIndicator: e.successIndicator ?? scope.en.successIndicator,
        checkin: {
          ...t,
          ...r,
          url: t.url,
          successText: r?.successText ? [...r.successText] : [...t.successText ?? []],
          alreadyText: r?.alreadyText ? [...r.alreadyText] : [...t.alreadyText ?? []]
        },
        adapter: {
          ...e.adapter,
          ...n,
          checkin: {
            ...e.adapter?.checkin,
            ...n.checkin,
            pathPatterns: [...n.checkin?.pathPatterns ?? []],
            titleWords: [...n.checkin?.titleWords ?? []]
          }
        }
      };
    };
    scope.Y = function Y(e, t, n) {
      if (!t) return false;
      try {
        let r = (e2) => e2.replace(/\/+$/, ``) || `/`;
        return r(new URL(t, e.loginUrl).pathname) === r(n);
      } catch {
        return false;
      }
    };
    scope.Jr = function Jr(e, t) {
      return !!e && e.length === t.length && e.every((e2, n) => e2 === t[n]);
    };
    scope.Xr = function Xr(e) {
      if ((0, scope.zr)(e) !== scope.Yr) return false;
      try {
        let t2 = new URL(e.loginUrl), n2 = t2.pathname.replace(/\/+$/, ``) || `/`;
        if (t2.protocol !== `https:` || t2.hostname.toLowerCase() !== scope.Yr || t2.port || !(/* @__PURE__ */ new Set([
          `/`,
          `/login`,
          `/user/login`,
          `/console`,
          `/console/personal`,
          `/dashboard`
        ])).has(n2))
          return false;
      } catch {
        return false;
      }
      let t = e.checkin;
      if (!t || t.method !== `auto` || !Object.keys(t).every((e2) => [`method`, `url`, `apiUrl`].includes(e2)) || t.url && !(0, scope.Y)(e, t.url, `/`) && !(0, scope.Y)(e, t.url, `/console/personal`) || t.apiUrl && !(0, scope.Y)(e, t.apiUrl, `/api/user/checkin`))
        return false;
      let n = e.adapter;
      return !(n?.family && n.family !== scope.N.NEW_API || n?.siteType && n.siteType !== scope.V.NEW_API || n?.checkinPath && !(0, scope.Y)(e, n.checkinPath, `/console/personal`) || n?.quotaPerUnit != null && n.quotaPerUnit !== 5e5 || n?.checkin?.pathPatterns && !(0, scope.Jr)(n.checkin.pathPatterns, [`/console/personal*`, `/dashboard*`]) || n?.checkin?.titleWords && !(0, scope.Jr)(n.checkin.titleWords, [`每日签到`, `daily check-in`]));
    };
    scope.Zr = function Zr(e) {
      let t = scope.un, n = t.checkin, r = t.adapter, i = (() => {
        try {
          let t2 = new URL(e.loginUrl), n2 = t2.pathname.replace(/\/+$/, ``) || `/`;
          return (/* @__PURE__ */ new Set([
            `/`,
            `/login`,
            `/user/login`,
            `/console`,
            `/console/personal`,
            `/dashboard`
          ])).has(n2) ? (t2.pathname = `/`, t2.search = ``, t2.hash = ``, t2.href) : e.loginUrl;
        } catch {
          return e.loginUrl;
        }
      })();
      return {
        ...e,
        loginUrl: i,
        pointerMode: e.pointerMode ?? t.pointerMode,
        preLoginClickSelector: e.preLoginClickSelector ?? t.preLoginClickSelector,
        loginMethod: e.loginMethod === `auto` ? t.loginMethod ?? `form` : e.loginMethod || t.loginMethod || `form`,
        selectors: { ...t.selectors, ...e.selectors },
        closeModalSelectors: e.closeModalSelectors?.length ? [...e.closeModalSelectors] : [...t.closeModalSelectors],
        checkin: {
          ...n,
          successText: [...n.successText ?? []],
          alreadyText: [...n.alreadyText ?? []]
        },
        adapter: {
          ...e.adapter,
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
    };
    scope.Qr = function Qr(e) {
      if ((0, scope.zr)(e) !== `vsllm.com`) return false;
      let t = e.checkin;
      return !t || !(t.method !== `auto` || !Object.keys(t).every((e2) => [`method`, `url`, `apiUrl`].includes(e2)) || t.url && !(0, scope.Y)(e, t.url, `/console/personal`) || t.apiUrl && !(0, scope.Y)(e, t.apiUrl, `/api/user/checkin`));
    };
    scope.$r = function $r(e) {
      let t = scope.cn, n = t.adapter, r = (() => {
        try {
          let t2 = new URL(e.loginUrl), n2 = t2.pathname.replace(/\/+$/, ``);
          return (/* @__PURE__ */ new Set([``, `/login`, `/console`, `/console/personal`, `/console/topup`])).has(n2) ? (t2.pathname = `/login`, t2.search = ``, t2.hash = ``, t2.href) : e.loginUrl;
        } catch {
          return e.loginUrl;
        }
      })();
      return {
        ...e,
        loginUrl: r,
        pointerMode: e.pointerMode ?? t.pointerMode,
        loginMethod: e.loginMethod || t.loginMethod || `auto`,
        selectors: { ...t.selectors, ...e.selectors },
        closeModalSelectors: e.closeModalSelectors?.length ? [...e.closeModalSelectors] : [...t.closeModalSelectors],
        checkin: {
          ...t.checkin,
          successText: [...t.checkin?.successText ?? []],
          alreadyText: [...t.checkin?.alreadyText ?? []]
        },
        adapter: {
          ...e.adapter,
          siteType: n.siteType,
          family: n.family,
          checkinPath: n.checkinPath,
          checkin: {
            pathPatterns: [...n.checkin?.pathPatterns ?? []],
            titleWords: [...n.checkin?.titleWords ?? []]
          },
          quotaPerUnit: e.adapter?.quotaPerUnit ?? n.quotaPerUnit
        }
      };
    };
    scope.ei = function ei(e) {
      if ((0, scope.zr)(e) !== `vsllm.com`) return e;
      let t = e.checkin?.workflow?.steps;
      if (!Array.isArray(t) || !t.some((e2) => e2?.type === `vsllm-daily`)) return e;
      let n = scope.cn.checkin;
      return {
        ...e,
        checkin: {
          ...n,
          successText: [...n.successText ?? []],
          alreadyText: [...n.alreadyText ?? []]
        }
      };
    };
    scope.ni = function ni(e) {
      let t = e.checkin;
      if (t?.method !== `none` || !t.learnedLoginAsCheckin || t.learnedLoginAsCheckinSource === `explicit` || (t.workflow?.steps.length ?? 0) > 0)
        return e;
      try {
        let t2 = new URL(e.loginUrl);
        if (t2.protocol !== `https:` || t2.hostname !== scope.ti || t2.port) return e;
      } catch {
        return e;
      }
      return {
        ...e,
        checkin: { method: `workflow`, workflow: { steps: [{ type: `leilei-daily` }] } }
      };
    };
    scope.ri = function ri(e) {
      if ((0, scope.zr)(e) !== scope.ti) return false;
      try {
        let t2 = new URL(e.loginUrl);
        if (t2.protocol !== `https:` || t2.hostname.toLowerCase() !== scope.ti || t2.port) return false;
        let n2 = t2.pathname.replace(/\/+$/, ``) || `/`;
        if (!(/* @__PURE__ */ new Set([`/`, `/login`, `/sign-in`, `/profile`, `/console`, `/console/personal`])).has(n2))
          return false;
      } catch {
        return false;
      }
      let t = e.checkin;
      if (t?.method === `workflow` || t && t.method !== `auto` && t.method !== `button` || t?.method === `button` && (!(0, scope.Y)(e, t.url, `/profile`) || t.buttonSelector !== `button >> text=立即签到, button >> text=签到` || t.alreadySelector !== `button >> text=已签到` || t.successText && !(0, scope.Jr)(t.successText, [`签到成功`, `今天 +`]) || t.alreadyText && !(0, scope.Jr)(t.alreadyText, [`已签到`, `今日已签到`]) || !Object.keys(t).every(
        (e2) => [
          `method`,
          `url`,
          `buttonSelector`,
          `alreadySelector`,
          `successText`,
          `alreadyText`
        ].includes(e2)
      )) || t?.method === `auto` && (!Object.keys(t).every((e2) => [`method`, `url`, `apiUrl`].includes(e2)) || t.url && !(0, scope.Y)(e, t.url, `/profile`) && !(0, scope.Y)(e, t.url, `/console/personal`) || t.apiUrl && !(0, scope.Y)(e, t.apiUrl, `/api/user/checkin`)))
        return false;
      let n = e.adapter;
      return !(n?.family && n.family !== scope.N.NEW_API || n?.siteType && n.siteType !== scope.V.NEW_API || n?.checkinPath && !(0, scope.Y)(e, n.checkinPath, `/profile`) && !(0, scope.Y)(e, n.checkinPath, `/console/personal`) || n?.checkin?.pathPatterns && !(0, scope.Jr)(n.checkin.pathPatterns, [`/profile*`]) && !(0, scope.Jr)(n.checkin.pathPatterns, [`/profile*`, `/lottery*`]) && !(0, scope.Jr)(n.checkin.pathPatterns, [`/console/personal*`]) || n?.checkin?.titleWords && !(0, scope.Jr)(n.checkin.titleWords, [`每日签到`]) && !(0, scope.Jr)(n.checkin.titleWords, [`每日签到`, `浮梦引光`, `抽奖`]) && !(0, scope.Jr)(n.checkin.titleWords, [`每日签到`, `daily check-in`]));
    };
    scope.ii = function ii(e) {
      let t = scope.on, n = t.adapter, r = t.checkin?.workflow, i = (() => {
        try {
          let t2 = new URL(e.loginUrl);
          return t2.pathname = `/sign-in`, t2.search = ``, t2.hash = ``, t2.href;
        } catch {
          return e.loginUrl;
        }
      })();
      return {
        ...e,
        loginUrl: i,
        pointerMode: e.pointerMode ?? t.pointerMode,
        loginMethod: e.loginMethod || t.loginMethod || `auto`,
        selectors: { ...t.selectors, ...e.selectors },
        successIndicator: e.successIndicator || t.successIndicator,
        closeModalSelectors: e.closeModalSelectors?.length ? [...e.closeModalSelectors] : [...t.closeModalSelectors],
        checkin: {
          method: `workflow`,
          workflow: { steps: (r?.steps ?? []).map((e2) => ({ ...e2 })) }
        },
        adapter: {
          ...e.adapter,
          siteType: n.siteType,
          family: n.family,
          checkinPath: n.checkinPath,
          checkin: {
            pathPatterns: [...n.checkin?.pathPatterns ?? []],
            titleWords: [...n.checkin?.titleWords ?? []]
          },
          quotaPerUnit: e.adapter?.quotaPerUnit ?? n.quotaPerUnit
        },
        ...t.authBootstrap ? { authBootstrap: { ...t.authBootstrap } } : {}
      };
    };
    scope.ai = function ai(e) {
      if ((0, scope.zr)(e) !== scope.ti || e.checkin?.method !== `workflow` || !(e.checkin.workflow?.steps ?? []).some((e2) => e2.type === `leilei-daily`))
        return false;
      let t = e.adapter?.checkinPath, n = e.adapter?.checkin?.pathPatterns ?? [];
      return t === `/profile` || !n.some((e2) => e2.startsWith(`/lottery`));
    };
    scope.oi = function oi(e) {
      return (0, scope.zr)(e) !== scope.ti || e.checkin?.method !== `workflow` ? false : !e.authBootstrap?.endpoint;
    };
    scope.si = function si(e) {
      let t = scope.on.authBootstrap;
      return t ? { ...e, authBootstrap: { ...t } } : e;
    };
    scope.ci = function ci(e) {
      let t = scope.on.adapter;
      return {
        ...e,
        adapter: {
          ...e.adapter,
          siteType: e.adapter?.siteType ?? t.siteType,
          family: e.adapter?.family ?? t.family,
          checkinPath: t.checkinPath,
          checkin: {
            pathPatterns: [...t.checkin?.pathPatterns ?? []],
            titleWords: [...t.checkin?.titleWords ?? []]
          },
          quotaPerUnit: e.adapter?.quotaPerUnit ?? t.quotaPerUnit
        }
      };
    };
    scope.ui = function ui(e) {
      if ((0, scope.zr)(e) !== `sub.100xlabs.space`) return false;
      let t = e.checkin;
      if (!t) return true;
      if ((0, scope.hn)(e)) return false;
      if (t.method === `none`)
        return Object.keys(t).every((e2) => [`method`, `url`].includes(e2)) && (!t.url || (0, scope.Y)(e, t.url, `/check-in`) || (0, scope.Y)(e, t.url, `/console/personal`));
      if (t.method !== `auto` || !Object.keys(t).every((e2) => [`method`, `url`, `apiUrl`].includes(e2)))
        return false;
      let n = (0, scope.Y)(e, t.url, `/check-in`) && !t.apiUrl, r = (0, scope.Y)(e, t.url, `/console/personal`) && (0, scope.Y)(e, t.apiUrl, `/api/user/checkin`);
      return n || r;
    };
    scope.di = function di(e) {
      let t = scope.Yt, n = t.checkin, r = t.adapter, i = (() => {
        try {
          let t2 = new URL(e.loginUrl), n2 = t2.pathname.replace(/\/+$/, ``);
          return [``, `/check-in`, `/dashboard`, `/console/personal`].includes(n2) ? (t2.pathname = `/login`, t2.search = ``, t2.hash = ``, t2.href) : e.loginUrl;
        } catch {
          return e.loginUrl;
        }
      })();
      return {
        ...e,
        loginUrl: i,
        loginMethod: e.loginMethod || t.loginMethod || `form`,
        selectors: { ...t.selectors, ...e.selectors },
        closeModalSelectors: e.closeModalSelectors?.length ? [...e.closeModalSelectors] : [...t.closeModalSelectors],
        ...t.tokenConfig || e.tokenConfig ? { tokenConfig: { ...t.tokenConfig, ...e.tokenConfig } } : {},
        checkin: {
          ...n,
          successText: [...n.successText ?? []],
          alreadyText: [...n.alreadyText ?? []]
        },
        adapter: {
          ...e.adapter,
          ...r,
          checkin: {
            ...r.checkin,
            pathPatterns: [...r.checkin?.pathPatterns ?? []],
            titleWords: [...r.checkin?.titleWords ?? []]
          }
        }
      };
    };
    scope.fi = function fi(e) {
      return scope.li.has((0, scope.zr)(e));
    };
    scope.pi = function pi(e) {
      let t = e.checkin;
      return !t || !((0, scope.hn)(e) || t.method !== `auto` && t.method !== `none` || !Object.keys(t).every((e2) => [`method`, `url`, `apiUrl`].includes(e2)) || t.url && !(0, scope.Y)(e, t.url, `/console/personal`) && !(0, scope.Y)(e, t.url, `/profile`) || t.apiUrl && !(0, scope.Y)(e, t.apiUrl, `/api/user/checkin`));
    };
    scope.mi = function mi(e) {
      let t = scope.nn, n = (0, scope.pi)(e), r = n || (0, scope.Y)(e, e.checkin?.url, `/profile`), i = (() => {
        try {
          let t2 = new URL(e.loginUrl), n2 = t2.pathname.replace(/\/+$/, ``);
          return (/* @__PURE__ */ new Set([
            ``,
            `/login`,
            `/profile`,
            `/console`,
            `/console/personal`,
            `/keys`,
            `/wallet`
          ])).has(n2) ? (t2.pathname = `/sign-in`, t2.search = ``, t2.hash = ``, t2.href) : e.loginUrl;
        } catch {
          return e.loginUrl;
        }
      })(), a = t.checkin, o = t.adapter, s = e.selectors.submit === `button[type="submit"]`, c2 = e.successIndicator === `a[href="/console/token"], a[href="/console/topup"]`;
      return {
        ...e,
        loginUrl: i,
        pointerMode: e.pointerMode ?? t.pointerMode,
        loginMethod: e.loginMethod || t.loginMethod || `auto`,
        selectors: { ...t.selectors, ...e.selectors, ...s ? { submit: t.selectors.submit } : {} },
        successIndicator: !e.successIndicator || c2 ? t.successIndicator : e.successIndicator,
        ...n ? {
          checkin: {
            ...a,
            successText: [...a.successText ?? []],
            alreadyText: [...a.alreadyText ?? []]
          }
        } : {},
        adapter: {
          ...e.adapter,
          siteType: scope.V.NEW_API,
          family: scope.N.NEW_API,
          ...r ? {
            checkinPath: `/profile`,
            checkin: e.adapter?.checkin ?? {
              pathPatterns: [...o.checkin?.pathPatterns ?? []],
              titleWords: [...o.checkin?.titleWords ?? []]
            }
          } : {},
          quotaPerUnit: e.adapter?.quotaPerUnit ?? o.quotaPerUnit
        }
      };
    };
    scope.hi = function hi(e) {
      if ((0, scope.zr)(e) !== `k40.shengqainbang.cn`) return false;
      let t = e.checkin;
      if (!t) return true;
      if ((0, scope.hn)(e)) return false;
      if (t.method === `none` || t.method === `button` && (0, scope.Y)(e, t.url, `/profile`) && t.buttonSelector === `button >> text=立即签到, button >> text=立即簽到, button >> text=Check in now` && t.alreadySelector === `button >> text=已签到, button >> text=已簽到, button >> text=Checked in` && (0, scope.Jr)(t.successText, [`签到成功`, `簽到成功`, `Check-in successful`]) && (0, scope.Jr)(t.alreadyText, [
        `已签到`,
        `今日已签到`,
        `已簽到`,
        `今日已簽到`,
        `Checked in`
      ]) && Object.keys(t).every(
        (e2) => [
          `method`,
          `url`,
          `buttonSelector`,
          `alreadySelector`,
          `successText`,
          `alreadyText`
        ].includes(e2)
      ) && e.adapter?.family === scope.N.NEW_API && e.adapter?.checkinPath === `/profile` && e.adapter?.quotaPerUnit === 5e5)
        return true;
      if (t.method !== `auto`) return false;
      let n = (0, scope.Y)(e, t.url, `/console/personal`) && (0, scope.Y)(e, t.apiUrl, `/api/user/checkin`) && Object.keys(t).every((e2) => [`method`, `url`, `apiUrl`].includes(e2)), r = (0, scope.Y)(e, t.url, `/check-in`) && Object.keys(t).every((e2) => [`method`, `url`].includes(e2));
      return n || r;
    };
    scope.gi = function gi(e) {
      let t = scope.Yt.checkin, n = scope.Yt.adapter, r = (() => {
        try {
          let t2 = new URL(e.loginUrl);
          return t2.pathname = `/login`, t2.search = ``, t2.hash = ``, t2.href;
        } catch {
          return e.loginUrl;
        }
      })();
      return {
        ...e,
        loginUrl: r,
        selectors: { ...e.selectors, ...scope.Yt.selectors },
        loginMethod: scope.Yt.loginMethod || `form`,
        ...scope.Yt.tokenConfig || e.tokenConfig ? { tokenConfig: { ...e.tokenConfig, ...scope.Yt.tokenConfig } } : {},
        checkin: {
          ...t,
          successText: [...t.successText ?? []],
          alreadyText: [...t.alreadyText ?? []]
        },
        adapter: {
          ...e.adapter,
          ...n,
          checkin: {
            ...e.adapter?.checkin,
            ...n.checkin,
            pathPatterns: [...n.checkin?.pathPatterns ?? []],
            titleWords: [...n.checkin?.titleWords ?? []]
          }
        }
      };
    };
    scope._i = function _i(e) {
      if ((0, scope.zr)(e) !== `api.denxio.top`) return false;
      let t = e.checkin;
      return (0, scope.hn)(e) ? false : !t || t.method === `none` ? true : t.method !== `auto` || t.buttonSelector || t.alreadySelector || t.successSelector || t.claimConfirmSelector || t.workflow || t.claimEntrySelector || t.logoutSelector || t.apiUrl && !(0, scope.Y)(e, t.apiUrl, `/api/user/checkin`) ? false : !t.url || (0, scope.Y)(e, t.url, `/check-in`) || (0, scope.Y)(e, t.url, `/console/personal`) || (0, scope.Y)(e, t.url, `/checkin`);
    };
    scope.vi = function vi(e) {
      let t = scope.Qt.checkin, n = scope.Qt.adapter, r = (() => {
        try {
          let t2 = new URL(e.loginUrl);
          return t2.pathname = `/login`, t2.search = ``, t2.hash = ``, t2.href;
        } catch {
          return e.loginUrl;
        }
      })();
      return {
        ...e,
        loginUrl: r,
        selectors: { ...scope.Qt.selectors, ...e.selectors },
        loginMethod: e.loginMethod || scope.Qt.loginMethod || `form`,
        ...scope.Qt.tokenConfig || e.tokenConfig ? { tokenConfig: { ...scope.Qt.tokenConfig, ...e.tokenConfig } } : {},
        checkin: {
          ...t,
          successText: [...t.successText ?? []],
          alreadyText: [...t.alreadyText ?? []]
        },
        adapter: {
          ...e.adapter,
          ...n,
          checkin: {
            ...e.adapter?.checkin,
            ...n.checkin,
            pathPatterns: [...n.checkin?.pathPatterns ?? []],
            titleWords: [...n.checkin?.titleWords ?? []]
          }
        }
      };
    };
    scope.yi = function yi(e) {
      if ((0, scope.zr)(e) !== `tabitoken.com`) return false;
      let t = e.checkin, n = !t || t.method === `auto` && (!t.url || t.url === `/console/personal`) && !t.buttonSelector && !t.alreadySelector && !t.successSelector && Object.keys(t).every((e2) => [`method`, `url`].includes(e2)), r = t?.method === `button` && (0, scope.Y)(e, t.url, `/profile`) && t.buttonSelector === `button >> text=立即签到, button >> text=签到` && t.alreadySelector === `button >> text=已签到` && !t.entry;
      return n || r;
    };
    scope.bi = function bi(e, t) {
      return JSON.stringify(e) === JSON.stringify(t) ? e : t;
    };
    scope.xi = function xi(e) {
      let t = e.checkin, n = t?.workflow;
      return !t || t.method !== `auto` || t.workflowReplayDisabled === true || !n || typeof n.identityPath != `string` || !n.identityPath.trim() || (0, scope.Yn)(e, n).length > 0 ? e : { ...e, checkin: { ...t, method: `workflow` } };
    };
    scope.wi = function wi(e) {
      return e.successIndicator === scope.Si ? { ...e, successIndicator: scope.Ci } : e;
    };
    scope.Ti = function Ti(e) {
      let t = (0, scope.Kr)(e);
      if (t = (0, scope.wi)(t), t = (0, scope.xi)(t), t = (0, scope.ei)(t), t = (0, scope.ni)(t), (0, scope.ai)(t) && (t = (0, scope.ci)(t)), (0, scope.oi)(t) && (t = (0, scope.si)(t)), (0, scope.Xr)(t))
        t = (0, scope.Zr)(t);
      else if ((0, scope.Qr)(t)) t = (0, scope.$r)(t);
      else if ((0, scope.ri)(t)) t = (0, scope.ii)(t);
      else if ((0, scope.ui)(t)) t = (0, scope.di)(t);
      else if ((0, scope.fi)(t)) t = (0, scope.mi)(t);
      else if ((0, scope.Br)(t)) t = (0, scope.Vr)(t);
      else if ((0, scope.Wr)(t)) t = (0, scope.qr)(t);
      else if ((0, scope._i)(t)) t = (0, scope.vi)(t);
      else if ((0, scope.hi)(t)) t = (0, scope.gi)(t);
      else if ((0, scope.yi)(t)) t = (0, scope.Di)(t);
      else if ((0, scope.Ur)(t)) t = (0, scope.Oi)(t);
      else if ((0, scope.Hr)(t))
        t = {
          ...t,
          loginUrl: `https://api.futureppo.top/login`,
          loginMethod: e.loginMethod || `auto`,
          checkin: {
            method: `button`,
            url: `/console/personal`,
            buttonSelector: `button >> text=立即签到`,
            alreadySelector: `button >> text=今日已签到`,
            alreadyText: [`今日已签到`]
          },
          adapter: {
            ...e.adapter,
            siteType: scope.V.NEW_API,
            family: scope.N.NEW_API,
            checkinPath: `/console/personal`,
            checkin: { pathPatterns: [`/console/personal*`], titleWords: [`每日签到`] },
            quotaPerUnit: 5e5
          }
        };
      else return (0, scope.bi)(e, t);
      return (0, scope.bi)(e, t);
    };
    scope.Ei = function Ei(e) {
      return e.map(scope.Ti);
    };
    scope.Di = function Di(e) {
      let t = !e.checkin || e.checkin.method === `auto` && (!e.checkin.url || e.checkin.url === `/console/personal`) && !e.checkin.buttonSelector && !e.checkin.alreadySelector && !e.checkin.successSelector && Object.keys(e.checkin).every((e2) => [`method`, `url`].includes(e2)), n = e.checkin?.method === `button` && (0, scope.Y)(e, e.checkin.url, `/profile`) && e.checkin.buttonSelector === `button >> text=立即签到, button >> text=签到` && e.checkin.alreadySelector === `button >> text=已签到` && !e.checkin.entry, r = scope.rn.checkin, i = r.entry ? { ...r.entry, steps: r.entry.steps.map((e2) => ({ ...e2 })) } : void 0, a = (() => {
        try {
          let t2 = new URL(e.loginUrl);
          return t2.pathname.replace(/\/+$/, ``) === `/login` ? (t2.pathname = `/sign-in`, t2.search = ``, t2.hash = ``, t2.href) : e.loginUrl;
        } catch {
          return e.loginUrl;
        }
      })();
      return {
        ...e,
        loginUrl: a,
        loginMethod: e.loginMethod || `auto`,
        pointerMode: e.pointerMode ?? `trusted`,
        successIndicator: e.successIndicator ?? scope.rn.successIndicator,
        ...t ? {
          checkin: {
            ...r,
            successText: [...r.successText ?? []],
            alreadyText: [...r.alreadyText ?? []],
            ...i ? { entry: i } : {}
          }
        } : n && i ? { checkin: { ...e.checkin, entry: i } } : {},
        adapter: {
          ...e.adapter,
          siteType: scope.V.NEW_API,
          family: scope.N.NEW_API,
          ...t || n ? {
            checkinPath: `/profile`,
            checkin: { pathPatterns: [`/profile*`], titleWords: [`每日签到`] }
          } : {},
          quotaPerUnit: e.adapter?.quotaPerUnit ?? 5e5
        }
      };
    };
    scope.Oi = function Oi(e) {
      return {
        ...e,
        loginMethod: e.loginMethod || `auto`,
        checkin: { method: `none` },
        adapter: {
          ...e.adapter,
          siteType: scope.V.ANYROUTER,
          family: scope.N.NEW_API,
          checkinPath: ``,
          checkin: { pathPatterns: [], titleWords: [] },
          quotaPerUnit: e.adapter?.quotaPerUnit ?? 5e5
        }
      };
    };
    scope.ki = function ki(e, t) {
      return e.length !== t.length || e.some((e2, n) => e2 !== t[n]);
    };
    scope.Ai = function Ai(e, t) {
      let n = new Set(t.map((e2) => e2.siteId));
      return e.filter((e2) => !n.has(e2));
    };
    scope.ji = async function ji(e, t) {
      let n = e.filter(scope.Fr);
      if (!(n.length > 0 || t.some((e2) => e2.siteId === `real-sharedchat`)))
        return { userSites: e, accounts: t };
      let r = scope.pn.find((e2) => e2.id === scope.Pr);
      if (!r) return { userSites: e, accounts: t };
      let i = e.find((e2) => e2.id === scope.Pr), a = /* @__PURE__ */ new Set([
        ...r.checkin?.claimUsedTexts ?? [],
        ...i?.checkin?.claimUsedTexts ?? [],
        ...n.flatMap((e2) => e2.checkin?.claimUsedTexts ?? [])
      ]), o = {
        ...i ?? r,
        id: scope.Pr,
        builtin: true,
        checkin: { method: `claim`, ...(i ?? r).checkin, claimUsedTexts: [...a] }
      }, s = e.filter((e2) => !(0, scope.Fr)(e2) && e2.id !== scope.Pr).concat(o), c2 = new Set(n.map((e2) => e2.id).concat(`real-sharedchat`)), l = t.map((e2) => c2.has(e2.siteId) ? { ...e2, siteId: scope.Pr } : e2);
      return await scope.z.setMany({ [scope.M.sites]: s, [scope.M.accounts]: l }), { userSites: s, accounts: l };
    };
    scope.Mi = async function Mi(e, t) {
      let n = new Set(scope.pn.map((e2) => e2.id)), r = e.filter((e2) => e2.id.startsWith(`builtin-`) && e2.builtin !== false && !n.has(e2.id));
      if (r.length === 0) return { userSites: e, accounts: t };
      let i = new Set(r.map((e2) => e2.id)), a = new Set(t.map((e2) => e2.siteId)), o = e.flatMap((e2) => i.has(e2.id) ? a.has(e2.id) ? [{ ...e2, builtin: false }] : [] : [e2]);
      return await scope.z.set(scope.M.sites, o), { userSites: o, accounts: t };
    };
    scope.to = function to(e) {
      return (e.hostname === `google.com` || e.hostname.endsWith(`.google.com`)) && e.pathname === `/s2/favicons`;
    };
    scope.no = function no({ site: e, className: t, fallback: n }) {
      let r = (0, scope.Xa)(e), i = r.join(`\0`), [a, o] = (0, scope.G.useState)(null), s = a?.key === i ? a.index : 0, c2 = r[s], l = () => o((e2) => (e2?.key === i ? e2.index : 0) === s ? { key: i, index: s + 1 } : e2);
      return c2 ? (0, scope.W.jsx)(`img`, {
        src: c2,
        alt: ``,
        className: t,
        onError: l,
        onLoad: (e2) => {
          e2.currentTarget.naturalWidth === 0 && l();
        }
      }) : (0, scope.W.jsx)(`span`, {
        role: `img`,
        "aria-label": `${e.name || `站点`}暂无可用的原生图标`,
        title: `站点未提供可读取的原生图标`,
        children: n
      });
    };
    scope.ro = function ro({
      site: e,
      sharedFlowFrom: n,
      accounts: r,
      proxy: i,
      proxies: s,
      proxyUsage: c2,
      statusOf: l,
      resultOf: d,
      liveOf: f2,
      balanceOf: p,
      refreshingBalanceIds: h,
      onRefreshBalances: y,
      isQueued: S,
      onRun: C2,
      onRunAll: T,
      onStopAll: E,
      onResetAccount: D,
      onStopAccount: k,
      onRetryAccount: A,
      onMarkAccountDone: j,
      onCaptureSession: M,
      onLearnAccount: N,
      learningAccounts: ee,
      learningNotices: ne,
      learnedSteps: re,
      onCancelLearnAccount: I,
      onEditAccount: ie,
      onSetAccountProxy: ae,
      onRemoveAccount: oe,
      onAddAccount: le,
      onEditSite: ue,
      onRemoveSite: de2,
      canMoveUp: z = false,
      canMoveDown: B = false,
      onMove: V,
      searchActive: H = false,
      selectionMode: fe,
      siteSelected: U,
      selectedAccountIds: pe2,
      onToggleSite: ge,
      onToggleAccount: xe2,
      ref: Se
    }) {
      let [Ce2, we] = (0, scope.G.useState)(() => r.length > 0), K = r.reduce((e2, t) => ({ ...e2, [l(t.id)]: e2[l(t.id)] + 1 }), {
        pending: 0,
        running: 0,
        attention: 0,
        done: 0,
        failed: 0
      }), Te2 = K.pending + K.failed, Ee = K.running + K.attention + r.filter((e2) => l(e2.id) === `pending` && S(e2.id)).length, De2 = K.failed ? `failed` : K.attention ? `attention` : K.running ? `running` : r.length && K.done === r.length ? `done` : `pending`, Oe = r.length > 0 && K.done === r.length, ke2 = r.length ? Math.round(K.done / r.length * 100) : 0, Ae = e.checkin?.method ?? `auto`, je2 = (0, scope.se)(e), Me2 = (0, scope.io)(e), Ne = (0, scope.F)(
        r.map((t) => ({
          balance: (0, scope.te)(p(t.id), d(t.id)).balance,
          scale: { quotaPerUnit: e.adapter?.quotaPerUnit, family: je2.family }
        }))
      ), Pe2 = r.some((e2) => h?.has(e2.id));
      (0, scope.G.useEffect)(() => {
        Oe && we(true);
      }, [Oe]);
      let Fe = fe ? `批量选择期间不能收起账号` : H ? `搜索命中期间保持展开` : K.running + K.attention > 0 ? `有账号正在执行或待处理` : null, Ie2 = !!Fe || !Ce2, Le = r.find((e2) => l(e2.id) === `failed`), Re2 = Le ? d(Le.id) : void 0, ze = Re2 && !Re2.ok ? (0, scope.ua)(Re2.message, Re2.steps) : null;
      return (0, scope.W.jsxs)(scope.w.section, {
        ref: Se,
        layout: `position`,
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { type: `spring`, stiffness: 320, damping: 30 },
        className: (0, scope.R)(
          `relative overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none dark:bg-slate-950 dark:hover:shadow-black/20`,
          (0, scope.co)(De2),
          U && `ring-2 ring-rose-500/30`
        ),
        children: [
          (0, scope.W.jsx)(`span`, {
            className: (0, scope.R)(`absolute inset-y-0 left-0 w-1`, (0, scope.lo)(De2)),
            "aria-hidden": `true`
          }),
          (0, scope.W.jsxs)(`header`, {
            className: `border-b border-slate-100 px-4 py-3.5 dark:border-slate-800`,
            children: [
              (0, scope.W.jsxs)(`div`, {
                className: `flex flex-wrap items-start gap-3`,
                children: [
                  fe && (0, scope.W.jsx)(`button`, {
                    type: `button`,
                    disabled: e.builtin,
                    onClick: () => ge(e.id),
                    "aria-label": e.builtin ? `内置站点 ${e.name} 不可删除` : `${U ? `取消选择` : `选择`}站点 ${e.name}`,
                    title: e.builtin ? `内置站点不可删除` : void 0,
                    className: (0, scope.R)(
                      `mt-1 grid size-7 place-items-center rounded-md disabled:cursor-not-allowed disabled:opacity-40`,
                      U ? `bg-rose-500 text-white` : `bg-slate-100 text-slate-500 dark:bg-slate-900`
                    ),
                    children: U ? (0, scope.W.jsx)(scope.o, { className: `size-4` }) : (0, scope.W.jsx)(scope.ve, { className: `size-4` })
                  }),
                  (0, scope.W.jsx)(scope.ao, { site: e }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `min-w-[160px] flex-1`,
                    children: [
                      (0, scope.W.jsxs)(`div`, {
                        className: `flex flex-wrap items-center gap-2`,
                        children: [
                          (0, scope.W.jsx)(`a`, {
                            href: e.loginUrl,
                            target: `_blank`,
                            rel: `noreferrer noopener`,
                            title: `打开 ${e.name}`,
                            className: `truncate text-sm font-semibold text-slate-950 hover:text-blue-600 dark:text-white dark:hover:text-blue-400`,
                            children: e.name
                          }),
                          (0, scope.W.jsx)(`span`, {
                            className: `rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300`,
                            children: (0, scope.mn)(e) || n ? `学习流程回放` : Ae === `none` ? `登录即签到` : Ae === `auto` ? `自动识别` : `本站适配`
                          }),
                          i && (0, scope.W.jsxs)(`span`, {
                            className: `inline-flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-300`,
                            children: [
                              (0, scope.W.jsx)(scope.x, { className: `size-2.5` }),
                              i.name
                            ]
                          }),
                          (0, scope.W.jsxs)(`span`, {
                            className: `inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`,
                            children: [
                              (0, scope.W.jsx)(scope.a, { className: `size-2.5` }),
                              `本站余额 `,
                              (0, scope.ce)(Ne),
                              Ne.missing > 0 && ` · ${Ne.missing} 个未获取`
                            ]
                          })
                        ]
                      }),
                      (0, scope.W.jsx)(`p`, {
                        className: `mt-0.5 truncate text-[11px] text-slate-500`,
                        children: (0, scope.Lt)(e.loginUrl)
                      }),
                      (0, scope.W.jsxs)(`p`, {
                        className: `mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300`,
                        children: [
                          (0, scope.W.jsx)(`span`, {
                            className: `mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500`
                          }),
                          (0, scope.W.jsx)(`span`, { children: Me2 })
                        ]
                      })
                    ]
                  }),
                  !fe && (0, scope.W.jsxs)(`div`, {
                    className: `flex items-center gap-1`,
                    children: [
                      Te2 > 0 && (0, scope.W.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => T(e.id),
                        className: `inline-flex h-8 items-center gap-1 rounded-md bg-blue-600 px-2.5 text-[11px] font-semibold text-white hover:bg-blue-700`,
                        children: [
                          (0, scope.W.jsx)(scope.m, { className: `size-3 fill-current` }),
                          `执行 `,
                          Te2
                        ]
                      }),
                      Ee > 0 && (0, scope.W.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => E(e.id),
                        title: `停止本站正在执行和排队中的任务`,
                        className: `inline-flex h-8 items-center gap-1 rounded-md bg-slate-100 px-2.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700`,
                        children: [
                          (0, scope.W.jsx)(scope.me, { className: `size-3` }),
                          `停止 `,
                          Ee
                        ]
                      }),
                      y && (0, scope.W.jsx)(scope.oo, {
                        title: Pe2 ? `正在刷新本站余额` : `刷新本站余额`,
                        disabled: Pe2 || r.length === 0,
                        onClick: () => y(r.map((e2) => e2.id)),
                        children: Pe2 ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` }) : (0, scope.W.jsx)(scope.a, { className: `size-4` })
                      }),
                      (0, scope.W.jsx)(scope.oo, {
                        title: `添加账号`,
                        onClick: () => le(e.id),
                        children: (0, scope.W.jsx)(scope._, { className: `size-4` })
                      }),
                      V && (0, scope.W.jsxs)(scope.W.Fragment, {
                        children: [
                          (0, scope.W.jsx)(scope.oo, {
                            title: `上移站点`,
                            disabled: !z,
                            onClick: () => V(e.id, `up`),
                            children: (0, scope.W.jsx)(scope.be, { className: `size-4` })
                          }),
                          (0, scope.W.jsx)(scope.oo, {
                            title: `下移站点`,
                            disabled: !B,
                            onClick: () => V(e.id, `down`),
                            children: (0, scope.W.jsx)(scope._e, { className: `size-4` })
                          })
                        ]
                      }),
                      (0, scope.W.jsx)(scope.oo, {
                        title: `编辑站点`,
                        onClick: () => ue(e),
                        children: (0, scope.W.jsx)(scope.he, { className: `size-4` })
                      }),
                      !e.builtin && (0, scope.W.jsx)(scope.oo, {
                        title: `删除站点`,
                        danger: true,
                        onClick: () => de2(e.id),
                        children: (0, scope.W.jsx)(scope.v, { className: `size-4` })
                      })
                    ]
                  })
                ]
              }),
              ze && !Ie2 && (0, scope.W.jsxs)(`div`, {
                "data-site-diagnosis": ze.code,
                className: `mt-3 rounded-lg bg-amber-500/[0.07] px-2.5 py-2 ring-1 ring-inset ring-amber-500/20 dark:bg-amber-400/[0.06]`,
                children: [
                  (0, scope.W.jsx)(`p`, {
                    "data-diagnosis-title": true,
                    className: `text-[11px] font-semibold text-amber-900 dark:text-amber-100`,
                    children: ze.title
                  }),
                  (0, scope.W.jsxs)(`p`, {
                    className: `mt-0.5 text-[11px] leading-relaxed text-ink-800/60 dark:text-ink-100/50`,
                    children: [`下一步：`, ze.nextActions[0]]
                  }),
                  (0, scope.W.jsx)(`button`, {
                    type: `button`,
                    onClick: () => we(false),
                    className: `mt-1 text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400`,
                    children: `展开账号查看完整排查步骤`
                  })
                ]
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `mt-3 flex items-center gap-3`,
                children: [
                  (0, scope.W.jsx)(`div`, {
                    className: `h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800`,
                    children: (0, scope.W.jsx)(scope.w.span, {
                      className: (0, scope.R)(
                        `block h-full origin-left rounded-full`,
                        (0, scope.lo)(De2)
                      ),
                      initial: false,
                      animate: { scaleX: ke2 / 100 }
                    })
                  }),
                  (0, scope.W.jsxs)(`span`, {
                    className: `text-[11px] font-semibold tabular-nums text-slate-500`,
                    children: [K.done, `/`, r.length]
                  })
                ]
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-medium`,
                children: [
                  (0, scope.W.jsx)(scope.so, {
                    icon: (0, scope.W.jsx)(scope.t, {}),
                    label: `完成`,
                    value: K.done,
                    tone: `text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40`
                  }),
                  (0, scope.W.jsx)(scope.so, {
                    icon: (0, scope.W.jsx)(scope.ye, {}),
                    label: `待签`,
                    value: K.pending,
                    tone: `text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40`
                  }),
                  K.running > 0 && (0, scope.W.jsx)(scope.so, {
                    icon: (0, scope.W.jsx)(scope.u, { className: `animate-spin` }),
                    label: `执行中`,
                    value: K.running,
                    tone: `text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40`
                  }),
                  K.attention > 0 && (0, scope.W.jsx)(scope.so, {
                    icon: (0, scope.W.jsx)(scope.g, {}),
                    label: `需处理`,
                    value: K.attention,
                    tone: `text-cyan-700 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-950/40`
                  }),
                  K.failed > 0 && (0, scope.W.jsx)(scope.so, {
                    icon: (0, scope.W.jsx)(scope.g, {}),
                    label: `失败`,
                    value: K.failed,
                    tone: `text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/40`
                  }),
                  !fe && r.length > 0 && (0, scope.W.jsxs)(`button`, {
                    type: `button`,
                    title: Fe ?? void 0,
                    "aria-label": `${Ie2 ? `收起` : `展开`}账号 ${e.name}`,
                    "aria-expanded": Ie2,
                    disabled: !!Fe,
                    onClick: () => we((e2) => !e2),
                    className: `ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-45 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-900 dark:hover:text-white`,
                    children: [
                      (0, scope.W.jsx)(scope.w.span, {
                        animate: { rotate: Ie2 ? 180 : 0 },
                        className: `block`,
                        children: (0, scope.W.jsx)(scope.b, { className: `size-3` })
                      }),
                      Ie2 ? `收起` : `展开`,
                      ` `,
                      r.length,
                      ` 个账号`
                    ]
                  })
                ]
              })
            ]
          }),
          (0, scope.W.jsx)(scope.O, {
            initial: false,
            children: Ie2 && (0, scope.W.jsx)(scope.w.div, {
              initial: { height: 0, opacity: 0 },
              animate: { height: `auto`, opacity: 1 },
              exit: { height: 0, opacity: 0 },
              className: `overflow-hidden`,
              children: (0, scope.W.jsxs)(`div`, {
                className: `divide-y divide-slate-100 dark:divide-slate-800`,
                children: [
                  (0, scope.W.jsx)(scope.O, {
                    mode: `popLayout`,
                    children: r.map((t) => {
                      let n2 = l(t.id), r2 = S(t.id), a = ee?.get(t.id), o = typeof a == `number` ? { eventCount: a, kind: `checkin` } : a;
                      return (0, scope.W.jsx)(
                        scope.Aa,
                        {
                          account: t,
                          status: n2,
                          result: d(t.id),
                          siteCheckinMethod: Ae,
                          siteName: e.name,
                          quotaPerUnit: e.adapter?.quotaPerUnit,
                          adapterFamily: je2.family,
                          balance: p(t.id),
                          balanceRefreshing: h?.has(t.id),
                          onRefreshBalance: y ? () => y([t.id]) : void 0,
                          liveTask: f2(t.id),
                          queued: r2,
                          proxyLabel: (0, scope.P)(t, e, s),
                          proxyEndpoint: (0, scope.L)(t, e, s),
                          proxies: s,
                          proxyUsage: c2,
                          siteProxyName: i?.name,
                          onSetProxy: ae,
                          onRun: C2,
                          onReset: D,
                          onStop: k,
                          onRetry: A,
                          onMarkDone: j,
                          onLearn: N,
                          learning: o,
                          learningNotice: ne?.get(t.id),
                          learnedSteps: re?.get(t.id),
                          onCancelLearn: I,
                          onCaptureSession: (0, scope.Ya)((0, scope.Ja)(t, e).loginMethod).sessionCounts ? M : void 0,
                          onEdit: ie,
                          onRemove: oe,
                          selectionMode: fe,
                          selected: U || pe2.has(t.id),
                          selectionDisabled: U,
                          onToggleSelect: xe2
                        },
                        t.id
                      );
                    })
                  }),
                  !r.length && !fe && (0, scope.W.jsxs)(`button`, {
                    type: `button`,
                    onClick: () => le(e.id),
                    className: `m-3 flex w-[calc(100%-1.5rem)] items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-3 text-xs text-slate-500 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700`,
                    children: [
                      (0, scope.W.jsx)(scope._, { className: `size-3.5` }),
                      `添加本站账号`
                    ]
                  })
                ]
              })
            })
          })
        ]
      });
    };
    scope.io = function io(e) {
      return (0, scope.mn)(e) ? `通用登录 → 核对当前账号 → 执行已保存签到流程 · 本站账号共用，可重新学习` : e.checkin?.method === `none` ? `通用登录 → 登录成功即完成签到 · 不再寻找签到按钮 · 可重新学习` : e.checkin?.method && e.checkin.method !== `auto` ? `通用登录 → 确认账号 → 按本站已有适配完成签到 · 可学习` : `通用登录 → 确认账号 → 自动识别签到 · 可一次学习登录与签到`;
    };
    scope.ao = function ao({ site: e }) {
      let t = e.name.trim().slice(0, 1).toUpperCase();
      return (0, scope.W.jsx)(`span`, {
        className: `grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800`,
        children: (0, scope.W.jsx)(scope.no, { site: e, className: `size-5 rounded`, fallback: t })
      });
    };
    scope.oo = function oo({
      title: e,
      onClick: t,
      children: n,
      danger: r = false,
      disabled: i = false
    }) {
      return (0, scope.W.jsx)(`button`, {
        type: `button`,
        title: e,
        disabled: i,
        onClick: t,
        className: (0, scope.R)(
          `grid size-8 place-items-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white`,
          r && `hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400`
        ),
        children: n
      });
    };
    scope.so = function so({ icon: e, label: t, value: n, tone: r }) {
      return (0, scope.W.jsxs)(`span`, {
        className: (0, scope.R)(`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5`, r),
        children: [e, t, ` `, n]
      });
    };
    scope.co = function co(e) {
      return e === `failed` ? `border-rose-200 dark:border-rose-950` : e === `attention` ? `border-cyan-200 dark:border-cyan-950` : e === `running` ? `border-blue-200 dark:border-blue-950` : `border-slate-200 dark:border-slate-800`;
    };
    scope.lo = function lo(e) {
      return e === `done` ? `bg-emerald-500` : e === `running` ? `bg-blue-500` : e === `attention` ? `bg-cyan-500` : e === `failed` ? `bg-rose-500` : `bg-amber-400`;
    };
    scope.mo = function mo(e) {
      let t = e.trim();
      if (!t) throw Error(`书签文件是空的`);
      return t.startsWith(`{`) ? (0, scope.ho)(t) : (0, scope.vo)(e);
    };
    scope.ho = function ho(e) {
      let t;
      try {
        t = JSON.parse(e);
      } catch {
        throw Error(`无法解析 Chrome Bookmarks JSON`);
      }
      if (!t.roots) throw Error(`没有找到 Chrome 书签根节点`);
      let n = (0, scope.yo)(), r = Object.entries(t.roots);
      for (let [e2, t2] of r) {
        let r2 = [scope.po[e2] || t2.name?.trim() || e2];
        n.rememberFolder(r2);
        for (let e3 of t2.children ?? []) (0, scope._o)(e3, r2, n);
      }
      return { source: `chrome-json`, folders: n.folders(), links: n.links };
    };
    scope.go = function go(e) {
      let t = (0, scope.yo)();
      for (let n of e)
        for (let e2 of n.children ?? []) {
          let n2 = (e2.title ?? ``).trim() || `未命名`;
          if (e2.url) t.addLink([], e2.title ?? ``, e2.url);
          else {
            t.rememberFolder([n2]);
            for (let r of e2.children ?? []) (0, scope._o)(r, [n2], t);
          }
        }
      if (t.links.length === 0) throw Error(`浏览器书签里还没有任何网址书签`);
      return { source: `browser`, folders: t.folders(), links: t.links };
    };
    scope._o = function _o(e, t, n) {
      let r = (e.name ?? e.title ?? ``).trim();
      if (e.url) {
        n.addLink(t, r, e.url);
        return;
      }
      let i = r ? [...t, r] : t;
      n.rememberFolder(i);
      for (let t2 of e.children ?? []) (0, scope._o)(t2, i, n);
    };
    scope.vo = function vo(e) {
      let t = (0, scope.yo)(), n = [], r = null, i = false;
      for (let a of e.matchAll(
        /<(\/?DL)\b[^>]*>|<H3\b[^>]*>([\s\S]*?)<\/H3>|<A\b([^>]*)>([\s\S]*?)<\/A>/gi
      )) {
        let e2 = a[1]?.toUpperCase();
        if (e2 === `DL`) {
          r &&= (n.push(r), t.rememberFolder(n), null);
          continue;
        }
        if (e2 === `/DL`) {
          n.length > 0 && n.pop(), r = null;
          continue;
        }
        if (a[2] != null) {
          r = (0, scope.xo)(a[2]);
          continue;
        }
        let o = a[3], s = a[4], c2 = o ? (0, scope.bo)(o, `href`) : ``;
        c2 && (t.addLink(n, (0, scope.xo)(s ?? ``), (0, scope.So)(c2)), i = true);
      }
      if (!i) throw Error(`没有找到 Google/Chrome 书签链接`);
      return { source: `chrome-html`, folders: t.folders(), links: t.links };
    };
    scope.yo = function yo() {
      let e = /* @__PURE__ */ new Map(), t = [];
      function n(t2) {
        if (t2.length === 0) return;
        let n2 = t2.join(` / `);
        e.has(n2) || e.set(n2, { id: n2, name: t2[t2.length - 1] ?? n2, path: n2, depth: t2.length, count: 0 });
      }
      function r(r2, i, a) {
        let o = (0, scope.Co)(a);
        if (!o) return;
        for (let t2 = 1; t2 <= r2.length; t2 += 1) {
          let i2 = r2.slice(0, t2);
          n(i2);
          let a2 = e.get(i2.join(` / `));
          a2 && (a2.count += 1);
        }
        let s = r2.join(` / `);
        t.push({
          id: `bookmark-${t.length + 1}`,
          name: i.trim() || o,
          url: o,
          folderId: s || `__all_bookmarks__`,
          folderPath: s,
          depth: r2.length
        });
      }
      return {
        rememberFolder: n,
        addLink: r,
        get links() {
          return t;
        },
        folders() {
          return Array.from(e.values());
        }
      };
    };
    scope.bo = function bo(e, t) {
      let n = e.match(RegExp(`\\s${t}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, `i`));
      return (0, scope.So)(n?.[1] || n?.[2] || n?.[3] || ``);
    };
    scope.xo = function xo(e) {
      return (0, scope.So)(
        e.replace(/<[^>]+>/g, ` `).replace(/\s+/g, ` `).trim()
      );
    };
    scope.So = function So(e) {
      let t = { amp: `&`, lt: `<`, gt: `>`, quot: `"`, apos: `'`, "#39": `'`, nbsp: ` ` };
      return e.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (e2, n) => {
        let r = n.toLowerCase();
        return r.startsWith(`#x`) ? String.fromCodePoint(Number.parseInt(r.slice(2), 16)) : r.startsWith(`#`) ? String.fromCodePoint(Number.parseInt(r.slice(1), 10)) : t[r] ?? e2;
      });
    };
    scope.Co = function Co(e) {
      try {
        let t = new URL(e);
        return t.protocol !== `http:` && t.protocol !== `https:` ? `` : (t.hash = ``, t.toString());
      } catch {
        return ``;
      }
    };
    scope.wo = function wo(e) {
      try {
        let t = new URL(e);
        if (t.protocol !== `http:` && t.protocol !== `https:`) return null;
        let n = t.port || (t.protocol === `https:` ? `443` : `80`);
        return `${t.hostname.toLowerCase()}:${n}`;
      } catch {
        return null;
      }
    };
    scope.To = function To(e, t) {
      let n = (0, scope.wo)(e);
      if (n === null) return { kind: `none` };
      let r = t.filter((e2) => (0, scope.wo)(e2.loginUrl) === n);
      return r.length === 1 ? r[0].loginUrl === e ? { kind: `exact`, site: r[0] } : { kind: `normalized`, site: r[0] } : r.length > 1 ? {
        kind: `ambiguous`,
        matchKind: r.every((t2) => t2.loginUrl === e) ? `exact` : `normalized`,
        sites: r
      } : { kind: `none` };
    };
    scope.Eo = function Eo(e) {
      let t = (0, scope.Zn)(e.url);
      if (!t) return null;
      let n = (0, scope.Sn)(), r = (0, scope.vn)(t) ?? (0, scope.vn)(e.name);
      return r ? {
        ...n,
        ...r.preset,
        name: e.name.trim() || (0, scope.Lt)(t),
        loginUrl: (0, scope._n)(t, r)
      } : { ...n, name: e.name.trim() || (0, scope.Lt)(t), loginUrl: t };
    };
    scope.Do = function Do(e, t, n = {}) {
      let r = {
        additions: [],
        updates: [],
        ambiguous: 0,
        duplicates: 0,
        invalid: 0,
        alreadyExists: 0
      }, i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map();
      for (let o of e) {
        let e2 = (0, scope.wo)(o.loginUrl);
        if (!e2) {
          r.invalid += 1;
          continue;
        }
        if (i.has(e2)) {
          r.duplicates += 1;
          continue;
        }
        i.add(e2);
        let s = (0, scope.To)(o.loginUrl, t);
        s.kind === `ambiguous` ? r.ambiguous += 1 : s.kind === `none` ? r.additions.push(o) : n.overwriteExisting ? a.set(s.site.id, { name: o.name, loginUrl: o.loginUrl }) : r.alreadyExists += 1;
      }
      return r.updates = [...a].map(([e2, t2]) => ({ siteId: e2, patch: t2 })), r;
    };
    scope.Oo = function Oo({ sites: e, disabled: t, onImport: n }) {
      let r = (0, scope.G.useRef)(null), [i, a] = (0, scope.G.useState)(null), [s, c2] = (0, scope.G.useState)(true), [d, f2] = (0, scope.G.useState)(``), [p, m] = (0, scope.G.useState)(``), [h, g] = (0, scope.G.useState)(``), [_, v2] = (0, scope.G.useState)(/* @__PURE__ */ new Set()), [y, b] = (0, scope.G.useState)(`skip`), [x, S] = (0, scope.G.useState)(1), [C2, T] = (0, scope.G.useState)(false);
      function E(e2) {
        a(e2), m(``), g(``), v2(/* @__PURE__ */ new Set()), S(1), f2(``);
      }
      async function D() {
        c2(true), f2(``);
        try {
          if (typeof chrome > `u` || !chrome.bookmarks?.getTree)
            throw Error(`当前环境读不到浏览器书签，请改用书签文件导入`);
          E({ ...(0, scope.go)(await chrome.bookmarks.getTree()), label: `浏览器书签` });
        } catch (e2) {
          a(null), f2(e2 instanceof Error ? e2.message : `读取浏览器书签失败`);
        } finally {
          c2(false);
        }
      }
      (0, scope.G.useEffect)(() => {
        D();
      }, []);
      async function k(e2) {
        if (e2) {
          c2(true);
          try {
            E({ ...(0, scope.mo)(await e2.text()), label: e2.name });
          } catch (e3) {
            a(null), f2(e3 instanceof Error ? e3.message : `无法读取书签文件`);
          } finally {
            c2(false);
          }
        }
      }
      let A = p ? p.split(` / `) : [], j = A.length, M = h.trim().length > 0, N = (0, scope.G.useMemo)(
        () => i ? i.folders.filter((e2) => e2.depth === j + 1 && (!p || e2.path.startsWith(`${p} / `))) : [],
        [i, j, p]
      ), P = (0, scope.G.useMemo)(() => {
        if (!i) return [];
        let e2 = h.trim().toLowerCase();
        return e2 ? i.links.filter(
          (t2) => t2.name.toLowerCase().includes(e2) || t2.url.toLowerCase().includes(e2) || t2.folderPath.toLowerCase().includes(e2)
        ) : i.links.filter((e3) => e3.folderPath === p);
      }, [i, h, p]), ee = (0, scope.G.useMemo)(() => i?.links.filter((e2) => (0, scope.Qn)(e2.url)) ?? [], [i]), te = (0, scope.G.useMemo)(
        () => new Map(ee.map((t2) => [t2.id, (0, scope.To)(t2.url, e)])),
        [ee, e]
      ), F = (0, scope.G.useMemo)(
        () => ee.filter((e2) => {
          let t2 = te.get(e2.id);
          return !t2 || t2.kind === `ambiguous` ? false : y === `overwrite` || t2.kind === `none`;
        }),
        [ee, te, y]
      ), ne = (0, scope.G.useMemo)(() => new Set(F.map((e2) => e2.id)), [F]), re = (0, scope.G.useMemo)(() => P.filter((e2) => ne.has(e2.id)), [P, ne]), I = (0, scope.G.useMemo)(() => F.filter((e2) => _.has(e2.id)), [F, _]), ie = re.filter((e2) => _.has(e2.id)).length, L = re.length > 0 && ie === re.length, ae = F.length > 0 && I.length === F.length, oe = (i?.links.length ?? 0) - ee.length, se = ee.filter((e2) => {
        let t2 = te.get(e2.id);
        return t2 && t2.kind !== `none` && t2.kind !== `ambiguous`;
      }).length, ce = ee.filter((e2) => te.get(e2.id)?.kind === `ambiguous`).length;
      function le(e2, t2) {
        S(t2), m(e2), g(``);
      }
      function ue(e2) {
        ne.has(e2) && v2((t2) => {
          let n2 = new Set(t2);
          return n2.has(e2) ? n2.delete(e2) : n2.add(e2), n2;
        });
      }
      function de2() {
        v2((e2) => {
          let t2 = new Set(e2);
          for (let e3 of re) L ? t2.delete(e3.id) : t2.add(e3.id);
          return t2;
        });
      }
      function z() {
        v2(
          (e2) => F.length > 0 && F.every((t2) => e2.has(t2.id)) ? /* @__PURE__ */ new Set() : new Set(F.map((e3) => e3.id))
        );
      }
      async function V() {
        if (!(I.length === 0 || C2 || t)) {
          T(true), f2(``);
          try {
            let e2 = [];
            for (let t2 of I) {
              let n2 = (0, scope.Eo)(t2);
              n2 && e2.push(n2);
            }
            if (e2.length === 0)
              throw Error(`所选书签没有可导入的 HTTPS 或本机 localhost HTTP 地址`);
            await n(e2, { overwriteExisting: y === `overwrite` });
          } catch (e2) {
            f2(e2 instanceof Error ? e2.message : `书签导入失败`);
          } finally {
            T(false);
          }
        }
      }
      let H = M ? `q:${h.trim()}` : p || `__root__`;
      return (0, scope.W.jsxs)(`section`, {
        className: `overflow-hidden rounded-xl bg-ink-50 ring-1 ring-black/5 dark:bg-ink-900/60 dark:ring-white/10`,
        children: [
          (0, scope.W.jsxs)(`div`, {
            className: `flex items-center justify-between gap-2 px-3 pt-3`,
            children: [
              (0, scope.W.jsxs)(`div`, {
                className: `flex min-w-0 items-center gap-2`,
                children: [
                  (0, scope.W.jsx)(scope.w.span, {
                    initial: { rotate: -12, scale: 0.8 },
                    animate: { rotate: 0, scale: 1 },
                    transition: { type: `spring`, stiffness: 300, damping: 18 },
                    className: `flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400`,
                    children: (0, scope.W.jsx)(scope.we, { className: `size-4` })
                  }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `min-w-0`,
                    children: [
                      (0, scope.W.jsx)(`h4`, {
                        className: `text-xs font-semibold text-ink-900 dark:text-ink-50`,
                        children: `从书签导入`
                      }),
                      (0, scope.W.jsx)(`p`, {
                        className: `truncate text-[11px] text-ink-800/45 dark:text-ink-100/35`,
                        children: i ? `${i.label} · ${i.links.length} 个链接` : `与 Chrome 书签管理器结构一致`
                      })
                    ]
                  })
                ]
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `flex shrink-0 items-center gap-1`,
                children: [
                  (0, scope.W.jsx)(`input`, {
                    ref: r,
                    type: `file`,
                    accept: `.html,.htm,.json`,
                    className: `hidden`,
                    onChange: (e2) => {
                      k(e2.target.files?.[0]), e2.target.value = ``;
                    }
                  }),
                  (0, scope.W.jsx)(scope.w.button, {
                    whileTap: { scale: 0.9, rotate: -30 },
                    type: `button`,
                    title: `重新读取浏览器书签`,
                    disabled: t || C2 || s,
                    onClick: () => void D(),
                    className: `rounded-lg p-2 text-ink-800/55 hover:bg-black/5 disabled:opacity-40 dark:text-ink-100/55 dark:hover:bg-white/10`,
                    children: (0, scope.W.jsx)(scope.dt, {
                      className: (0, scope.R)(`size-4`, s && `animate-spin`)
                    })
                  }),
                  (0, scope.W.jsx)(scope.w.button, {
                    whileTap: { scale: 0.9 },
                    type: `button`,
                    title: `从导出的书签文件导入（HTML / JSON）`,
                    disabled: t || C2,
                    onClick: () => r.current?.click(),
                    className: `rounded-lg p-2 text-ink-800/55 hover:bg-black/5 disabled:opacity-40 dark:text-ink-100/55 dark:hover:bg-white/10`,
                    children: (0, scope.W.jsx)(scope.B, { className: `size-4` })
                  })
                ]
              })
            ]
          }),
          (0, scope.W.jsxs)(`div`, {
            className: `space-y-2.5 p-3`,
            children: [
              d && (0, scope.W.jsxs)(scope.w.div, {
                initial: { opacity: 0, y: -6 },
                animate: { opacity: 1, y: 0 },
                className: `flex items-center justify-between gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-[11px] leading-relaxed text-rose-700 dark:text-rose-300`,
                children: [
                  (0, scope.W.jsx)(`span`, { children: d }),
                  (0, scope.W.jsx)(`button`, {
                    type: `button`,
                    onClick: () => void D(),
                    className: `shrink-0 font-medium hover:underline`,
                    children: `重试`
                  })
                ]
              }),
              s && !i && (0, scope.W.jsxs)(`div`, {
                className: `flex items-center justify-center gap-2 py-10 text-xs text-ink-800/45 dark:text-ink-100/35`,
                children: [
                  (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` }),
                  `正在读取浏览器书签...`
                ]
              }),
              i && (0, scope.W.jsxs)(scope.W.Fragment, {
                children: [
                  oe > 0 && (0, scope.W.jsxs)(`p`, {
                    className: `rounded-lg bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300`,
                    children: [
                      oe,
                      ` 个地址不符合导入安全规则，已从选择中排除（HTTPS 和本机 localhost HTTP 可导入）。`
                    ]
                  }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-black/5 dark:bg-ink-950/40 dark:ring-white/10`,
                    children: [
                      (0, scope.W.jsxs)(`div`, {
                        className: `flex items-center gap-2 text-[11px]`,
                        children: [
                          (0, scope.W.jsx)(`span`, {
                            className: `font-medium text-ink-800/65 dark:text-ink-100/55`,
                            children: `重复站点`
                          }),
                          (0, scope.W.jsx)(`button`, {
                            type: `button`,
                            "aria-pressed": y === `skip`,
                            onClick: () => b(`skip`),
                            className: (0, scope.R)(
                              `rounded-md px-2 py-1 transition-colors`,
                              y === `skip` ? `bg-brand-500/10 font-semibold text-brand-700 dark:text-brand-300` : `text-ink-800/50 hover:bg-ink-50 dark:text-ink-100/40 dark:hover:bg-white/5`
                            ),
                            children: `跳过已有`
                          }),
                          (0, scope.W.jsx)(`button`, {
                            type: `button`,
                            "aria-pressed": y === `overwrite`,
                            onClick: () => b(`overwrite`),
                            className: (0, scope.R)(
                              `rounded-md px-2 py-1 transition-colors`,
                              y === `overwrite` ? `bg-brand-500/10 font-semibold text-brand-700 dark:text-brand-300` : `text-ink-800/50 hover:bg-ink-50 dark:text-ink-100/40 dark:hover:bg-white/5`
                            ),
                            children: `更新已有站点`
                          })
                        ]
                      }),
                      (0, scope.W.jsxs)(`span`, {
                        className: `text-[10px] text-ink-800/40 dark:text-ink-100/30`,
                        children: [
                          `更新只替换名称和登录地址，保留原配置 · 已匹配 `,
                          se,
                          ` · 歧义 `,
                          ce
                        ]
                      })
                    ]
                  }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `relative`,
                    children: [
                      (0, scope.W.jsx)(scope.l, {
                        className: `pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-800/30 dark:text-ink-100/25`
                      }),
                      (0, scope.W.jsx)(`input`, {
                        className: `h-9 w-full rounded-lg bg-white pl-8 pr-2.5 text-xs text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/45 dark:bg-ink-950/40 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                        value: h,
                        onChange: (e2) => g(e2.target.value),
                        placeholder: `搜索全部书签：站点名 / 域名 / 文件夹`
                      })
                    ]
                  }),
                  !M && (0, scope.W.jsxs)(`div`, {
                    className: `flex items-center gap-1 overflow-x-auto whitespace-nowrap text-[11px]`,
                    children: [
                      (0, scope.W.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => le(``, -1),
                        className: (0, scope.R)(
                          `flex items-center gap-1 rounded-md px-1.5 py-1 font-medium transition-colors`,
                          A.length === 0 ? `text-ink-900 dark:text-ink-50` : `text-brand-600 hover:bg-brand-500/10 dark:text-brand-400`
                        ),
                        children: [
                          (0, scope.W.jsx)(scope.Ve, { className: `size-3` }),
                          `全部书签`
                        ]
                      }),
                      A.map(
                        (e2, t2) => (0, scope.W.jsxs)(
                          scope.G.Fragment,
                          {
                            children: [
                              (0, scope.W.jsx)(scope.ke, {
                                className: `size-3 shrink-0 text-ink-800/25 dark:text-ink-100/20`
                              }),
                              t2 === A.length - 1 ? (0, scope.W.jsx)(`span`, {
                                className: `px-1.5 py-1 font-medium text-ink-900 dark:text-ink-50`,
                                children: e2
                              }) : (0, scope.W.jsx)(`button`, {
                                type: `button`,
                                onClick: () => le(A.slice(0, t2 + 1).join(` / `), -1),
                                className: `rounded-md px-1.5 py-1 font-medium text-brand-600 transition-colors hover:bg-brand-500/10 dark:text-brand-400`,
                                children: e2
                              })
                            ]
                          },
                          t2
                        )
                      )
                    ]
                  }),
                  (0, scope.W.jsx)(`div`, {
                    className: `overflow-hidden rounded-lg bg-white ring-1 ring-black/5 dark:bg-ink-950/40 dark:ring-white/10`,
                    children: (0, scope.W.jsx)(scope.O, {
                      mode: `wait`,
                      initial: false,
                      children: (0, scope.W.jsxs)(
                        scope.w.div,
                        {
                          initial: { opacity: 0, x: 26 * x },
                          animate: { opacity: 1, x: 0 },
                          exit: { opacity: 0, x: -26 * x },
                          transition: { duration: 0.16, ease: `easeOut` },
                          className: `max-h-56 overflow-y-auto`,
                          children: [
                            !M && N.map(
                              (e2, t2) => (0, scope.W.jsxs)(
                                scope.w.button,
                                {
                                  type: `button`,
                                  initial: { opacity: 0, y: 6 },
                                  animate: { opacity: 1, y: 0 },
                                  transition: { delay: Math.min(t2 * 0.03, 0.24) },
                                  onClick: () => le(e2.path, 1),
                                  className: `flex w-full items-center gap-2.5 border-b border-black/5 px-3 py-2 text-left transition-colors hover:bg-ink-50 dark:border-white/5 dark:hover:bg-white/[0.04]`,
                                  children: [
                                    (0, scope.W.jsx)(`span`, {
                                      className: `flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400`,
                                      children: (0, scope.W.jsx)(scope.Le, {
                                        className: `size-3.5`
                                      })
                                    }),
                                    (0, scope.W.jsx)(`span`, {
                                      className: `min-w-0 flex-1 truncate text-xs font-medium text-ink-900 dark:text-ink-50`,
                                      children: e2.name
                                    }),
                                    (0, scope.W.jsxs)(`span`, {
                                      className: `shrink-0 text-[10px] text-ink-800/35 dark:text-ink-100/25`,
                                      children: [e2.count, ` 个链接`]
                                    }),
                                    (0, scope.W.jsx)(scope.ke, {
                                      className: `size-3.5 shrink-0 text-ink-800/25 dark:text-ink-100/20`
                                    })
                                  ]
                                },
                                e2.id
                              )
                            ),
                            P.map((e2, t2) => {
                              let n2 = te.get(e2.id), r2 = (0, scope.Qn)(e2.url), i2 = n2?.kind === `ambiguous`, a2 = !!n2 && n2.kind !== `none` && !i2, o = r2 && !i2 && (y === `overwrite` || !a2), s2 = r2 ? i2 ? `匹配到 ${n2.sites.length} 个相同地址的站点，请先整理重复项` : a2 ? y === `overwrite` ? `将更新「${n2.site.name}」的名称和登录地址` : `站点已存在；选择“更新已有站点”可覆盖名称和登录地址` : `将新建站点` : `请使用 HTTPS（本机 localhost 可使用 HTTP）`;
                              return (0, scope.W.jsx)(
                                scope.w.div,
                                {
                                  initial: { opacity: 0, y: 6 },
                                  animate: { opacity: 1, y: 0 },
                                  transition: { delay: Math.min((N.length + t2) * 0.03, 0.3) },
                                  children: (0, scope.W.jsx)(scope.ko, {
                                    link: e2,
                                    checked: _.has(e2.id),
                                    selectable: o,
                                    detail: s2,
                                    onToggle: () => ue(e2.id)
                                  })
                                },
                                e2.id
                              );
                            }),
                            !M && N.length === 0 && P.length === 0 && (0, scope.W.jsx)(`div`, {
                              className: `px-3 py-8 text-center text-xs text-ink-800/40 dark:text-ink-100/30`,
                              children: `这个文件夹是空的`
                            }),
                            M && P.length === 0 && (0, scope.W.jsx)(`div`, {
                              className: `px-3 py-8 text-center text-xs text-ink-800/40 dark:text-ink-100/30`,
                              children: `没有匹配的书签`
                            })
                          ]
                        },
                        H
                      )
                    })
                  }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5`,
                    children: [
                      (0, scope.W.jsxs)(`div`, {
                        className: `flex flex-wrap items-center gap-x-3 gap-y-1`,
                        children: [
                          (0, scope.W.jsxs)(`button`, {
                            type: `button`,
                            onClick: z,
                            disabled: !F.length || C2 || t,
                            className: `inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-600 hover:underline disabled:opacity-40 dark:text-brand-400`,
                            children: [
                              ae ? (0, scope.W.jsx)(scope.o, { className: `size-3.5` }) : (0, scope.W.jsx)(scope.ve, { className: `size-3.5` }),
                              ae ? `取消全选` : `全选全部书签`
                            ]
                          }),
                          (0, scope.W.jsxs)(`button`, {
                            type: `button`,
                            onClick: de2,
                            disabled: re.length === 0 || C2 || t,
                            className: `inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-600 hover:underline disabled:opacity-40 dark:text-brand-400`,
                            children: [
                              L ? (0, scope.W.jsx)(scope.o, { className: `size-3.5` }) : (0, scope.W.jsx)(scope.ve, { className: `size-3.5` }),
                              L ? `取消当前列表` : `选择当前列表`
                            ]
                          })
                        ]
                      }),
                      (0, scope.W.jsxs)(`span`, {
                        className: `text-[11px] text-ink-800/45 dark:text-ink-100/35`,
                        children: [
                          `已选 `,
                          I.length,
                          ` / 可选择 `,
                          F.length,
                          ` · 共 `,
                          i.links.length
                        ]
                      })
                    ]
                  }),
                  (0, scope.W.jsxs)(scope.w.button, {
                    whileTap: { scale: 0.98 },
                    type: `button`,
                    disabled: I.length === 0 || C2 || t,
                    onClick: V,
                    className: `inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-600 disabled:opacity-40 disabled:shadow-none`,
                    children: [
                      (0, scope.W.jsx)(scope.B, { className: `size-4` }),
                      C2 ? `导入中...` : `导入选中站点 (${I.length})`
                    ]
                  })
                ]
              })
            ]
          })
        ]
      });
    };
    scope.Io = function Io(e) {
      return [`form`, `github`, `oauth`, `passkey`, `manual`].includes(e);
    };
    scope.Ro = function Ro({ form: e, onChange: t }) {
      let n = e.loginMethod ?? `form`, r = (0, scope.Io)(n) ? null : n;
      return (0, scope.W.jsxs)(scope.W.Fragment, {
        children: [
          (0, scope.W.jsxs)(`div`, {
            className: `space-y-2`,
            children: [
              (0, scope.W.jsx)(`span`, {
                className: `text-xs font-medium text-ink-800/70 dark:text-ink-100/60`,
                children: `登录方式`
              }),
              (0, scope.W.jsx)(`div`, {
                className: `grid gap-2`,
                children: scope.Po.map(
                  (e2) => (0, scope.W.jsxs)(
                    `button`,
                    {
                      type: `button`,
                      onClick: () => t({ loginMethod: e2.value }),
                      className: (0, scope.R)(
                        `flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors`,
                        n === e2.value ? `bg-brand-500/10 ring-2 ring-brand-500/50` : `bg-ink-50 ring-1 ring-black/5 hover:bg-ink-100 dark:bg-ink-900 dark:ring-white/10`
                      ),
                      children: [
                        (0, scope.W.jsx)(`span`, {
                          className: (0, scope.R)(
                            `mt-0.5 size-3.5 shrink-0 rounded-full ring-2 transition-colors`,
                            n === e2.value ? `bg-brand-500 ring-brand-500/40` : `ring-black/15 dark:ring-white/20`
                          )
                        }),
                        (0, scope.W.jsxs)(`span`, {
                          className: `min-w-0`,
                          children: [
                            (0, scope.W.jsx)(`span`, {
                              className: `block text-xs font-medium text-ink-900 dark:text-ink-50`,
                              children: e2.label
                            }),
                            (0, scope.W.jsx)(`span`, {
                              className: `block text-[11px] text-ink-800/50 dark:text-ink-100/40`,
                              children: e2.description
                            })
                          ]
                        })
                      ]
                    },
                    e2.value
                  )
                )
              }),
              r && (0, scope.W.jsxs)(`p`, {
                role: `status`,
                className: `text-[11px] text-ink-800/45 dark:text-ink-100/40`,
                children: [`当前兼容配置：`, scope.Fo[r]]
              })
            ]
          }),
          (n === `oauth` || n === `github` || n === `passkey` || n === `auto`) && (0, scope.W.jsxs)(scope.w.div, {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: `auto` },
            className: `space-y-3 overflow-hidden rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
            children: [
              (0, scope.W.jsx)(scope.Q, {
                label: n === `passkey` ? `Passkey 按钮选择器` : n === `github` ? `GitHub 按钮选择器` : `OAuth 按钮选择器`,
                hint: n === `oauth` ? `可选。留空会自动识别 GitHub/SSO 按钮；识别不准时再填精确选择器` : n === `passkey` ? `可选。留空会自动识别 Passkey 按钮` : `可选。留空会自动识别 GitHub OAuth 按钮`,
                children: (0, scope.W.jsx)(`input`, {
                  className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                  placeholder: `text=使用 GitHub 继续, .oauth-github`,
                  value: e.oauthButtonSelector ?? ``,
                  onChange: (e2) => t({ oauthButtonSelector: e2.target.value })
                })
              }),
              (0, scope.W.jsxs)(`p`, {
                className: `text-[11px] leading-relaxed text-amber-700 dark:text-amber-400`,
                children: [
                  n === `github` && `站点会点站点的 OAuth 按钮跳到 GitHub；扩展在 GitHub 登录页自动填 GitHub 账密。`,
                  n === `passkey` && `Passkey 会触发浏览器/系统原生确认；扩展不会保存或模拟 Passkey 私钥。`,
                  n === `oauth` && `OAuth 会优先使用上面的选择器；留空时会自动寻找 GitHub / Google / LinuxDO / SSO 登录按钮。浏览器里需要已经登录过对应平台，否则会停在授权页等你手动操作。`
                ]
              })
            ]
          }),
          n === `token` && (0, scope.W.jsxs)(scope.w.div, {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: `auto` },
            className: `space-y-3 overflow-hidden rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
            children: [
              (0, scope.W.jsx)(scope.Q, {
                label: `Token 存储键名`,
                hint: `必填。站点把 token 存在哪个键下，F12 → Application → Local Storage 里能看到`,
                children: (0, scope.W.jsx)(`input`, {
                  className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                  placeholder: `auth_token`,
                  value: e.tokenConfig?.storageKey ?? ``,
                  onChange: (n2) => t({
                    tokenConfig: { ...scope.Lo, ...e.tokenConfig, storageKey: n2.target.value }
                  })
                })
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `存储位置`,
                hint: `多数站点用 localStorage；关掉标签页就失效的站点用 sessionStorage`,
                children: (0, scope.W.jsxs)(`select`, {
                  className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                  value: e.tokenConfig?.storageType ?? `localStorage`,
                  onChange: (n2) => t({
                    tokenConfig: { ...scope.Lo, ...e.tokenConfig, storageType: n2.target.value }
                  }),
                  children: [
                    (0, scope.W.jsx)(`option`, {
                      value: `localStorage`,
                      children: `localStorage`
                    }),
                    (0, scope.W.jsx)(`option`, {
                      value: `sessionStorage`,
                      children: `sessionStorage`
                    })
                  ]
                })
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `请求头名称`,
                hint: `必填。验证身份时用哪个头发 token，一般是 Authorization`,
                children: (0, scope.W.jsx)(`input`, {
                  className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                  placeholder: `Authorization`,
                  value: e.tokenConfig?.headerName ?? ``,
                  onChange: (n2) => t({
                    tokenConfig: { ...scope.Lo, ...e.tokenConfig, headerName: n2.target.value }
                  })
                })
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `请求头前缀`,
                hint: `一般是 Bearer 加一个空格；有的站点不需要前缀，留空即可`,
                children: (0, scope.W.jsx)(`input`, {
                  className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                  placeholder: `Bearer `,
                  value: e.tokenConfig?.headerPrefix ?? ``,
                  onChange: (n2) => t({
                    tokenConfig: {
                      ...scope.Lo,
                      ...e.tokenConfig,
                      headerPrefix: n2.target.value
                    }
                  })
                })
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `身份接口`,
                hint: `可选。留空会依次试 /api/user/self、/api/user/info、/api/v1/auth/me`,
                children: (0, scope.W.jsx)(`input`, {
                  className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                  placeholder: `/api/v1/auth/me`,
                  value: e.tokenConfig?.identityEndpoint ?? ``,
                  onChange: (n2) => t({
                    tokenConfig: {
                      ...scope.Lo,
                      ...e.tokenConfig,
                      identityEndpoint: n2.target.value
                    }
                  })
                })
              }),
              (0, scope.W.jsx)(`p`, {
                className: `text-[11px] leading-relaxed text-amber-700 dark:text-amber-400`,
                children: `Token 填在**每个账号**的设置里，这里只描述站点怎么存和怎么用。 同一站点的多个账号各自持有独立 token，切换时会自动覆盖。`
              })
            ]
          }),
          (0, scope.W.jsx)(scope.Q, {
            label: `登录成功标志选择器`,
            hint: `可选。只在登录后才出现的元素（控制台导航、头像菜单等）。打开站点时用它判断是否已经登录、提交登录后用它确认成功；留空则看登录表单是否消失、是否离开登录页`,
            children: (0, scope.W.jsx)(`input`, {
              className: scope.$,
              placeholder: `.dashboard, #user-avatar`,
              value: e.successIndicator ?? ``,
              onChange: (e2) => t({ successIndicator: e2.target.value })
            })
          }),
          (0, scope.W.jsxs)(`div`, {
            className: `space-y-3 rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
            children: [
              (0, scope.W.jsx)(`span`, {
                className: `text-xs font-medium text-ink-800/70 dark:text-ink-100/60`,
                children: `身份读取扩展（可选）`
              }),
              (0, scope.W.jsx)(`p`, {
                className: `text-[11px] leading-relaxed text-ink-800/50 dark:text-ink-100/40`,
                children: `签到要核对「当前登录的是哪个账号」，而站点身份既不在同源接口、也不在页面文字上时填写 （典型：页面在 orevx.ai、身份在 server.orevx.ai 的接口与 localStorage）。默认关闭； 全部只读，不会写入任何存储，也不会把凭据发去无关主机。跨域接口的响应里带 points （总积分）时，本站余额也复用它读取 —— 不需要额外配置。`
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `身份存储键`,
                hint: `可选。站点把当前用户信息（JSON）存在哪个键下，如 orevx 的 auth-user`,
                children: (0, scope.W.jsx)(`input`, {
                  className: scope.$,
                  placeholder: `auth-user`,
                  value: e.identitySource?.storageKey ?? ``,
                  onChange: (n2) => t({ identitySource: { ...e.identitySource, storageKey: n2.target.value } })
                })
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `身份存储位置`,
                hint: `可选。不确定就留在「自动」：依次查 localStorage 和 sessionStorage`,
                children: (0, scope.W.jsxs)(`select`, {
                  className: scope.$,
                  value: e.identitySource?.storageType ?? ``,
                  onChange: (n2) => t({
                    identitySource: {
                      ...e.identitySource,
                      storageType: n2.target.value || void 0
                    }
                  }),
                  children: [
                    (0, scope.W.jsx)(`option`, { value: ``, children: `自动（推荐）` }),
                    (0, scope.W.jsx)(`option`, { value: `localStorage`, children: `localStorage` }),
                    (0, scope.W.jsx)(`option`, {
                      value: `sessionStorage`,
                      children: `sessionStorage`
                    })
                  ]
                })
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `跨域身份接口`,
                hint: `可选。仅 https，且必须是本站域名本身或其父/子域（orevx.ai ↔ server.orevx.ai）；只读 GET。响应里带 points 时该接口同时用于读取本站余额`,
                children: (0, scope.W.jsx)(`input`, {
                  className: scope.$,
                  placeholder: `https://server.orevx.ai/api/user/me`,
                  value: e.identitySource?.endpoint ?? ``,
                  onChange: (n2) => t({ identitySource: { ...e.identitySource, endpoint: n2.target.value } })
                })
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `接口 Token 存储键`,
                hint: `填了跨域接口时必填。该接口用哪个存储键里的 token 做 Bearer 认证，如 auth-token`,
                children: (0, scope.W.jsx)(`input`, {
                  className: scope.$,
                  placeholder: `auth-token`,
                  value: e.identitySource?.tokenKey ?? ``,
                  onChange: (n2) => t({ identitySource: { ...e.identitySource, tokenKey: n2.target.value } })
                })
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `Token 存储位置`,
                hint: `可选。不确定就留在「自动」`,
                children: (0, scope.W.jsxs)(`select`, {
                  className: scope.$,
                  value: e.identitySource?.tokenStorageType ?? ``,
                  onChange: (n2) => t({
                    identitySource: {
                      ...e.identitySource,
                      tokenStorageType: n2.target.value || void 0
                    }
                  }),
                  children: [
                    (0, scope.W.jsx)(`option`, { value: ``, children: `自动（推荐）` }),
                    (0, scope.W.jsx)(`option`, { value: `localStorage`, children: `localStorage` }),
                    (0, scope.W.jsx)(`option`, {
                      value: `sessionStorage`,
                      children: `sessionStorage`
                    })
                  ]
                })
              })
            ]
          }),
          (0, scope.W.jsx)(scope.Q, {
            label: `令牌引导接口`,
            hint: `可选。站点用「会话 cookie 换短命 Bearer 令牌」时填（新版 new-api 分叉常见，如一梦五千年的 /api/user/auth/refresh）。填了之后，扩展读余额与身份之前会先换一枚令牌再用 —— 否则这类站点的接口一律 401，余额和签到前后的快照都读不到。只允许本站同源地址`,
            children: (0, scope.W.jsx)(`input`, {
              className: scope.$,
              placeholder: `/api/user/auth/refresh`,
              value: e.authBootstrap?.endpoint ?? ``,
              onChange: (n2) => t({
                authBootstrap: n2.target.value.trim() ? { ...e.authBootstrap, endpoint: n2.target.value } : void 0
              })
            })
          }),
          (0, scope.W.jsx)(scope.Q, {
            label: `退出接口`,
            hint: `强烈建议填。同站多账号切换时，只有调它才能清掉服务端 cookie；不填则改用重载登录页，部分站点会失败`,
            children: (0, scope.W.jsx)(`input`, {
              className: scope.$,
              placeholder: `/api/user/logout`,
              value: e.logoutApiUrl ?? ``,
              onChange: (e2) => t({ logoutApiUrl: e2.target.value })
            })
          }),
          (n === `form` || n === `auto`) && (0, scope.W.jsx)(scope.Q, {
            label: `展开表单的前置点击`,
            hint: `可选。新版 new-api 登录页要先点「使用 邮箱或用户名 登录」才出现账密框。可写 text=按钮文字`,
            children: (0, scope.W.jsx)(`input`, {
              className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
              placeholder: `text=使用 邮箱或用户名 登录`,
              value: e.preLoginClickSelector ?? ``,
              onChange: (e2) => t({ preLoginClickSelector: e2.target.value })
            })
          })
        ]
      });
    };
    scope.zo = function zo({ form: e, advanced: t, onToggle: n, onChange: r }) {
      return (0, scope.W.jsxs)(scope.W.Fragment, {
        children: [
          (0, scope.W.jsxs)(`button`, {
            type: `button`,
            onClick: n,
            className: `text-xs font-medium text-brand-600 hover:underline dark:text-brand-400`,
            children: [t ? `收起` : `展开`, `登录表单选择器`]
          }),
          t && (0, scope.W.jsxs)(scope.w.div, {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: `auto` },
            className: `space-y-3 overflow-hidden rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
            children: [
              (0, scope.W.jsx)(scope.Q, {
                label: `用户名输入框选择器`,
                children: (0, scope.W.jsx)(`input`, {
                  className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                  value: e.selectors.username,
                  onChange: (t2) => r({ selectors: { ...e.selectors, username: t2.target.value } })
                })
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `密码输入框选择器`,
                children: (0, scope.W.jsx)(`input`, {
                  className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                  value: e.selectors.password,
                  onChange: (t2) => r({ selectors: { ...e.selectors, password: t2.target.value } })
                })
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `登录按钮选择器`,
                children: (0, scope.W.jsx)(`input`, {
                  className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                  value: e.selectors.submit,
                  onChange: (t2) => r({ selectors: { ...e.selectors, submit: t2.target.value } })
                })
              }),
              (0, scope.W.jsx)(scope.Q, {
                label: `公告弹窗关闭选择器`,
                hint: `每行一个，已预填常见中转站的通用选择器`,
                children: (0, scope.W.jsx)(`textarea`, {
                  rows: 4,
                  className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                  value: (e.closeModalSelectors ?? []).join(`
`),
                  onChange: (e2) => r({
                    closeModalSelectors: e2.target.value.split(
                      `
`
                    ).map((e3) => e3.trim()).filter(Boolean)
                  })
                })
              }),
              (0, scope.W.jsx)(`button`, {
                type: `button`,
                onClick: () => r({ closeModalSelectors: [...scope.Rt] }),
                className: `text-xs text-brand-600 hover:underline dark:text-brand-400`,
                children: `重置为通用选择器`
              })
            ]
          })
        ]
      });
    };
    scope.Bo = function Bo({ form: e, proxies: t, onChange: n, onUrlSettled: r }) {
      let i = t.filter((e2) => e2.nameOnly !== true);
      return (0, scope.W.jsxs)(scope.W.Fragment, {
        children: [
          (0, scope.W.jsx)(scope.Q, {
            label: `登录页地址`,
            hint: `必填，例如 https://api.example.com/login`,
            children: (0, scope.W.jsx)(`input`, {
              className: scope.$,
              placeholder: `https://...`,
              value: e.loginUrl,
              onChange: (e2) => n({ loginUrl: e2.target.value }),
              onBlur: (e2) => r?.(e2.target.value)
            })
          }),
          (0, scope.W.jsx)(scope.Q, {
            label: `站点名称`,
            hint: `留空则自动使用域名`,
            children: (0, scope.W.jsx)(`input`, {
              className: scope.$,
              placeholder: `我的中转站`,
              value: e.name,
              onChange: (e2) => n({ name: e2.target.value })
            })
          }),
          (0, scope.W.jsx)(scope.Q, {
            label: `访问代理`,
            hint: i.length ? `默认跟随 Chrome；只有需要强制指定出口时才选择` : `默认跟随 Chrome/系统网络设置`,
            children: (0, scope.W.jsxs)(`select`, {
              className: scope.$,
              value: e.proxyId ?? ``,
              onChange: (e2) => n({ proxyId: e2.target.value || void 0 }),
              children: [
                (0, scope.W.jsx)(`option`, { value: ``, children: `跟随 Chrome/系统代理（推荐）` }),
                e.proxyId && t.find((t2) => t2.id === e.proxyId)?.nameOnly && (0, scope.W.jsxs)(`option`, {
                  value: e.proxyId,
                  disabled: true,
                  children: [t.find((t2) => t2.id === e.proxyId)?.name, `（仅名称，无出口）`]
                }),
                i.map(
                  (e2) => (0, scope.W.jsxs)(
                    `option`,
                    {
                      value: e2.id,
                      children: [e2.name, ` — `, (0, scope.de)(e2), `://`, e2.host, `:`, e2.port]
                    },
                    e2.id
                  )
                )
              ]
            })
          })
        ]
      });
    };
    scope.Vo = function Vo({
      open: e,
      mode: t,
      editing: n,
      accountSetupRequested: r,
      sites: i,
      proxies: a,
      onClose: o,
      onSubmit: s,
      onSubmitAndAddAccount: c2,
      onSubmitMany: l
    }) {
      let [d, f2] = (0, scope.G.useState)((0, scope.Sn)()), [p, m] = (0, scope.G.useState)(false), [h, g] = (0, scope.G.useState)(false), [_, v2] = (0, scope.G.useState)(``), [y, b] = (0, scope.G.useState)(null), [x, S] = (0, scope.G.useState)(null), [C2, T] = (0, scope.G.useState)(false), E = (0, scope.G.useRef)(``);
      (0, scope.G.useEffect)(() => {
        e && (f2(n ? { ...n } : (0, scope.Sn)()), m(!!n), v2(``), b(null), S(null), T(false), E.current = ``);
      }, [e, n]);
      let D = async (e2) => {
        let t2 = e2.trim();
        if (t2 && !n && t2 !== E.current) {
          E.current = t2, T(true);
          try {
            let e3 = await (0, scope.H)({ type: `PROBE_SITE`, url: t2 }), n2 = e3.ok ? e3.feature?.probe : void 0;
            if (!n2 || !n2.preset) {
              S(null);
              return;
            }
            b(n2.templateLabel ?? null), S(n2.evidence);
            let r2 = (0, scope._n)(
              t2,
              (n2.templateId ? scope.dn.find((e4) => e4.id === n2.templateId) : void 0) ?? (0, scope.vn)(t2)
            );
            f2((e4) => ({ ...e4, ...n2.preset, name: e4.name, loginUrl: r2 }));
          } finally {
            T(false);
          }
        }
      }, O = d.loginUrl.trim().length > 0, k = (e2) => {
        let t2 = { ...d, ...e2 };
        if (!n && e2.loginUrl !== void 0 && !y) {
          let n2 = (0, scope.vn)(e2.loginUrl);
          if (n2) {
            let r2 = (0, scope._n)(e2.loginUrl, n2);
            b(n2.label), f2({ ...t2, ...n2.preset, name: t2.name, loginUrl: r2 });
            return;
          }
        }
        f2(t2);
      }, j = (e2) => f2({ ...d, checkin: { ...d.checkin ?? { method: `auto` }, ...e2 } });
      async function M(e2 = false) {
        if (!(!O || h || C2)) {
          g(true), v2(``);
          try {
            let t2 = { ...d, name: d.name.trim() || (0, scope.Lt)(d.loginUrl) };
            e2 && c2 ? await c2(t2) : await s(t2), o();
          } catch (e3) {
            v2(e3 instanceof Error ? e3.message : `站点保存失败`);
          } finally {
            g(false);
          }
        }
      }
      async function N(e2, t2) {
        if (!(e2.length === 0 || h)) {
          g(true), v2(``);
          try {
            if (!l) throw Error(`批量书签导入不可用`);
            await l(e2, t2), o();
          } catch (e3) {
            v2(e3 instanceof Error ? e3.message : `书签导入失败`);
          } finally {
            g(false);
          }
        }
      }
      return (0, scope.W.jsx)(scope.uo, {
        open: e,
        title: n ? `编辑站点` : t === `import` ? `从书签导入站点` : r ? `先添加所属站点` : `添加站点`,
        onClose: () => !h && o(),
        wide: !n && t === `import`,
        children: (0, scope.W.jsx)(`div`, {
          className: `space-y-4`,
          children: !n && t === `import` ? (0, scope.W.jsxs)(scope.W.Fragment, {
            children: [
              (0, scope.W.jsx)(scope.Oo, { sites: i, disabled: h, onImport: N }),
              _ && (0, scope.W.jsx)(`p`, {
                role: `alert`,
                className: `text-xs text-rose-600 dark:text-rose-400`,
                children: _
              })
            ]
          }) : (0, scope.W.jsxs)(scope.W.Fragment, {
            children: [
              r && !n && (0, scope.W.jsx)(`div`, {
                className: `rounded-lg border border-brand-500/15 bg-brand-500/[0.06] px-3 py-2 text-xs leading-relaxed text-ink-800/70 dark:border-brand-400/15 dark:bg-brand-400/[0.08] dark:text-ink-100/65`,
                children: `添加账号需要先选择所属站点。保存这个站点后，将继续填写账号信息。`
              }),
              (0, scope.W.jsx)(scope.Bo, {
                form: d,
                proxies: a,
                onChange: k,
                onUrlSettled: (e2) => void D(e2)
              }),
              C2 && (0, scope.W.jsxs)(`div`, {
                className: `flex items-center gap-2 rounded-lg bg-ink-100/70 px-3 py-2 text-[11px] text-ink-800/60 dark:bg-white/8 dark:text-ink-100/50`,
                children: [
                  (0, scope.W.jsx)(scope.u, {
                    className: `size-3.5 shrink-0 animate-spin`
                  }),
                  (0, scope.W.jsx)(`span`, { children: `正在识别站点系统…` })
                ]
              }),
              !C2 && y && (0, scope.W.jsxs)(`div`, {
                className: `flex items-start gap-2 rounded-lg bg-brand-500/8 px-3 py-2 text-[11px] text-brand-700 dark:text-brand-300`,
                children: [
                  (0, scope.W.jsx)(scope.A, { className: `mt-px size-3.5 shrink-0` }),
                  (0, scope.W.jsxs)(`span`, {
                    children: [
                      `已识别为 `,
                      (0, scope.W.jsx)(`strong`, { className: `font-medium`, children: y }),
                      `， 已自动填好本站适配设置。自动识别与学习流程回放可在下方独立选择。`,
                      x && (0, scope.W.jsxs)(`span`, {
                        className: `mt-0.5 block opacity-60`,
                        children: [`依据：`, x]
                      })
                    ]
                  })
                ]
              }),
              (0, scope.W.jsx)(scope.Ro, { form: d, onChange: k }),
              (0, scope.W.jsx)(scope.Mo, { form: d, onChange: j }),
              (0, scope.W.jsx)(scope.zo, {
                form: d,
                advanced: p,
                onToggle: () => m(!p),
                onChange: k
              }),
              _ && (0, scope.W.jsx)(`p`, {
                role: `alert`,
                className: `text-xs text-rose-600 dark:text-rose-400`,
                children: _
              }),
              n ? (0, scope.W.jsxs)(scope.w.button, {
                whileTap: { scale: 0.98 },
                type: `button`,
                disabled: !O || h,
                onClick: () => void M(),
                className: `${scope.fo} inline-flex items-center justify-center gap-1.5`,
                children: [
                  h ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` }) : (0, scope.W.jsx)(scope.pt, { className: `size-4` }),
                  h ? `保存中...` : `保存修改`
                ]
              }) : (0, scope.W.jsxs)(`div`, {
                className: `grid gap-2 sm:grid-cols-2`,
                children: [
                  (0, scope.W.jsxs)(scope.w.button, {
                    whileTap: { scale: 0.98 },
                    type: `button`,
                    disabled: !O || h || C2,
                    onClick: () => void M(),
                    className: `inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink-50 px-4 py-2.5 text-sm font-medium text-ink-800 ring-1 ring-black/5 transition-colors hover:bg-ink-100 disabled:opacity-40 dark:bg-white/5 dark:text-ink-100 dark:ring-white/10 dark:hover:bg-white/10`,
                    children: [
                      (0, scope.W.jsx)(scope.pt, { className: `size-4` }),
                      `仅保存站点`
                    ]
                  }),
                  (0, scope.W.jsxs)(scope.w.button, {
                    whileTap: { scale: 0.98 },
                    type: `button`,
                    disabled: !O || h || C2,
                    onClick: () => void M(true),
                    className: `${scope.fo} inline-flex items-center justify-center gap-1.5`,
                    children: [
                      h ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` }) : (0, scope.W.jsx)(scope.Dt, { className: `size-4` }),
                      h ? `保存中...` : r ? `保存并继续` : `保存并添加账号`
                    ]
                  })
                ]
              })
            ]
          })
        })
      });
    };
    scope.Vl = function Vl({ value: e, onChange: t, accountSortMode: n, onAccountSortChange: r }) {
      let i = (0, scope.G.useId)(), a = (0, scope.G.useRef)(null), o = (0, scope.G.useRef)(null), [s, c2] = (0, scope.G.useState)(false), [l, u] = (0, scope.G.useState)(0);
      return (0, scope.G.useEffect)(() => {
        if (!s) return;
        let e2 = (e3) => {
          e3.target instanceof Node && !a.current?.contains(e3.target) && c2(false);
        }, t2 = (e3) => {
          e3.key === `Escape` && (c2(false), o.current?.focus());
        }, n2 = () => c2(false);
        return document.addEventListener(`pointerdown`, e2), document.addEventListener(`focusin`, e2), document.addEventListener(`keydown`, t2), window.addEventListener(`resize`, n2), () => {
          document.removeEventListener(`pointerdown`, e2), document.removeEventListener(`focusin`, e2), document.removeEventListener(`keydown`, t2), window.removeEventListener(`resize`, n2);
        };
      }, [s]), (0, scope.W.jsxs)(`div`, {
        ref: a,
        className: `relative shrink-0`,
        children: [
          (0, scope.W.jsx)(scope.w.button, {
            ref: o,
            type: `button`,
            "aria-label": `排序设置`,
            "aria-expanded": s,
            "aria-controls": s ? i : void 0,
            title: `排序设置 · 站点：${scope.Bl.find((t2) => t2.value === e)?.name ?? `已微调`}`,
            onClick: () => {
              let e2 = o.current?.getBoundingClientRect().right ?? 0;
              u(Math.min(0, e2 - Math.min(224, window.innerWidth - 16) - 8)), c2((e3) => !e3);
            },
            whileTap: { scale: 0.94 },
            className: (0, scope.R)(
              `grid size-8 place-items-center rounded-md border shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-offset-slate-950`,
              s ? `border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500` : `border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:text-blue-300`
            ),
            children: (0, scope.W.jsx)(scope.De, { className: `size-4`, "aria-hidden": `true` })
          }),
          s && (0, scope.W.jsxs)(scope.w.div, {
            id: i,
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.16 },
            style: { right: l },
            className: `absolute top-full z-50 mt-2 w-56 max-w-[calc(100vw-16px)] rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30`,
            children: [
              (0, scope.W.jsxs)(`div`, {
                role: `group`,
                "aria-label": `站点排序`,
                children: [
                  (0, scope.W.jsx)(`p`, {
                    className: `mb-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300`,
                    children: `站点排序`
                  }),
                  (0, scope.W.jsx)(`div`, {
                    className: `isolate flex rounded-lg bg-slate-100 p-1 dark:bg-slate-950`,
                    children: scope.Bl.map(
                      (n2) => (0, scope.W.jsxs)(
                        scope.w.button,
                        {
                          type: `button`,
                          "aria-label": n2.name,
                          "aria-pressed": e === n2.value,
                          title: n2.hint,
                          onClick: () => t(n2.value),
                          whileTap: { scale: 0.96 },
                          className: (0, scope.R)(
                            `relative flex-1 whitespace-nowrap rounded-md px-2 py-1.5 text-[11px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transition-none`,
                            e === n2.value ? `text-white` : `text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100`
                          ),
                          children: [
                            e === n2.value && (0, scope.W.jsx)(scope.w.span, {
                              layoutId: `${i}-selection`,
                              className: `absolute inset-0 -z-10 rounded-md bg-blue-600 shadow-sm dark:bg-blue-500`,
                              transition: { type: `spring`, stiffness: 430, damping: 34 },
                              "aria-hidden": `true`
                            }),
                            n2.label
                          ]
                        },
                        n2.value
                      )
                    )
                  }),
                  (0, scope.W.jsx)(`p`, {
                    className: `mt-2 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400`,
                    children: e === `manual` ? `当前是手动微调后的顺序（可继续用卡片箭头调整）· 选字母排序可恢复` : `中文按拼音，1、2、10 按数值 · 卡片箭头可随时微调`
                  })
                ]
              }),
              (0, scope.W.jsx)(`div`, {
                className: `mt-3 border-t border-slate-100 pt-3 dark:border-slate-800`,
                children: (0, scope.W.jsx)(scope.zl, { value: n, onChange: r })
              })
            ]
          })
        ]
      });
    };
    scope.Wl = function Wl() {
      let [e, t] = (0, scope.G.useState)(scope.Pl), n = (0, scope.G.useRef)(0);
      return (0, scope.G.useEffect)(() => {
        let e2 = false, r = n.current, i = (e3, r2) => {
          r2 === `local` && `siteSortMode` in e3 && (n.current += 1, t((0, scope.Fl)(e3[scope.Hl].newValue)));
        };
        return chrome.storage.onChanged.addListener(i), chrome.storage.local.get(scope.Hl).then((i2) => {
          !e2 && n.current === r && t((0, scope.Fl)(i2[scope.Hl]));
        }).catch(() => {
        }), () => {
          e2 = true, chrome.storage.onChanged.removeListener(i);
        };
      }, []), [
        e,
        (0, scope.G.useCallback)((e2) => {
          let r = (0, scope.Fl)(e2);
          n.current += 1, t(r);
          let i = scope.Ul.then(() => chrome.storage.local.set({ [scope.Hl]: r }));
          return scope.Ul = i.catch(() => {
          }), i;
        }, [])
      ];
    };
    scope.ql = function ql() {
      let [e, t] = (0, scope.G.useState)(scope.Qs), n = (0, scope.G.useRef)(0);
      return (0, scope.G.useEffect)(() => {
        let e2 = false, r = n.current, i = (e3, r2) => {
          r2 === `local` && `accountSortMode` in e3 && (n.current += 1, t((0, scope.$s)(e3[scope.Gl].newValue)));
        };
        return chrome.storage.onChanged.addListener(i), chrome.storage.local.get(scope.Gl).then((i2) => {
          !e2 && n.current === r && t((0, scope.$s)(i2[scope.Gl]));
        }).catch(() => {
        }), () => {
          e2 = true, chrome.storage.onChanged.removeListener(i);
        };
      }, []), [
        e,
        (0, scope.G.useCallback)((e2) => {
          let r = (0, scope.$s)(e2);
          n.current += 1, t(r);
          let i = scope.Kl.then(() => chrome.storage.local.set({ [scope.Gl]: r }));
          return scope.Kl = i.catch(() => {
          }), i;
        }, [])
      ];
    };
    scope.Jl = function Jl({
      icon: e,
      label: t,
      onClick: n,
      primary: r,
      accent: i,
      danger: a,
      compact: o,
      disabled: s
    }) {
      return (0, scope.W.jsxs)(scope.w.button, {
        whileHover: { scale: s ? 1 : 1.04, y: s ? 0 : -1 },
        whileTap: { scale: s ? 1 : 0.97 },
        type: `button`,
        onClick: n,
        disabled: s,
        title: t,
        "aria-label": t,
        className: (0, scope.R)(
          `action-btn inline-flex h-9 items-center gap-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40`,
          o ? `w-9 justify-center px-0` : `px-3`,
          r && `action-btn-primary bg-mint-600 text-white shadow-lg shadow-mint-600/20 hover:bg-mint-700`,
          i && `action-btn-accent bg-coral-500 text-white shadow-lg shadow-coral-500/20 hover:bg-coral-600`,
          a && `action-btn-danger bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600`,
          !r && !i && !a && `bg-white text-ink-800 ring-1 ring-black/5 hover:bg-sun-100 dark:bg-white/5 dark:text-ink-100 dark:ring-white/10 dark:hover:bg-white/10`
        ),
        children: [
          (0, scope.W.jsx)(`span`, { className: `action-btn-energy`, "aria-hidden": `true` }),
          (0, scope.W.jsx)(`span`, {
            className: `action-btn-icon`,
            "aria-hidden": `true`,
            children: e
          }),
          (0, scope.W.jsx)(`span`, {
            className: (0, scope.R)(`action-label relative z-[2]`, o && `sr-only`),
            children: t
          })
        ]
      });
    };
    scope.Yl = function Yl({ onAdd: e, onImport: t }) {
      return (0, scope.W.jsxs)(scope.w.div, {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        className: `flex flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-black/10 bg-white px-4 py-10 dark:border-white/10 dark:bg-white/[0.03]`,
        children: [
          (0, scope.W.jsx)(`img`, {
            src: `/pelican-bicycle.svg`,
            alt: `鹈鹕骑自行车`,
            className: `mb-2 h-auto w-full max-w-[460px]`
          }),
          (0, scope.W.jsx)(`h3`, { className: `text-sm font-semibold`, children: `还没有站点` }),
          (0, scope.W.jsx)(`p`, {
            className: `mt-1 mb-4 text-xs text-ink-800/50 dark:text-ink-100/40`,
            children: `手动添加一个站点，或从 Chrome 书签中批量导入`
          }),
          (0, scope.W.jsxs)(`div`, {
            className: `flex flex-wrap items-center justify-center gap-2`,
            children: [
              (0, scope.W.jsxs)(scope.w.button, {
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.97 },
                type: `button`,
                onClick: e,
                className: `inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-brand-500/25`,
                children: [(0, scope.W.jsx)(scope.yt, { className: `size-4` }), `添加第一个站点`]
              }),
              (0, scope.W.jsxs)(scope.w.button, {
                whileHover: { scale: 1.04 },
                whileTap: { scale: 0.97 },
                type: `button`,
                onClick: t,
                className: `inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-medium text-ink-800 ring-1 ring-black/10 hover:bg-ink-50 dark:bg-white/5 dark:text-ink-100 dark:ring-white/10 dark:hover:bg-white/10`,
                children: [(0, scope.W.jsx)(scope.Ue, { className: `size-4` }), `从书签导入`]
              })
            ]
          })
        ]
      });
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.Rt = [
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
      case 1: {
        scope.zt = [
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
      case 2: {
        scope.Bt = [
          `input[autocomplete="current-password"]`,
          `#password`,
          `input[name="password"]`,
          `input[type="password"]`
        ];
        break;
      }
      case 3: {
        [
          `button:has(> span:only-child)`,
          `.checkin-btn`,
          `#checkin`,
          `[data-testid="checkin"]`
        ].join(`, `);
        break;
      }
      case 4: {
        scope.Ht = {
          pointerMode: `trusted`,
          loginMethod: `github`,
          oauthButtonSelector: `text=GitHub`,
          selectors: {
            username: `#username, input[name="username"]`,
            password: `#password, input[name="password"]`,
            submit: `button[type="submit"]`
          },
          closeModalSelectors: [`button >> text=今日关闭`, `button >> text=关闭公告`, ...scope.Rt],
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
            siteType: scope.V.NEW_API,
            family: scope.N.NEW_API,
            checkinPath: `/console`,
            checkin: { pathPatterns: [`/console*`], titleWords: [`每日签到`, `daily check-in`] },
            quotaPerUnit: 5e5
          }
        };
        break;
      }
      case 5: {
        scope.Ut = {
          id: `agentrouter`,
          label: `Agent Router`,
          siteType: scope.V.NEW_API,
          fingerprints: {
            hostnames: [`agentrouter.org`, `ps.air-outer.com`],
            titleWords: [`agent router`, `agentrouter`]
          },
          preset: scope.Ht
        };
        break;
      }
      case 6: {
        scope.Wt = {
          id: `kid1412`,
          label: `1412's API`,
          siteType: scope.V.NEW_API,
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
            closeModalSelectors: scope.Rt,
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
              siteType: scope.V.NEW_API,
              family: scope.N.NEW_API,
              checkinPath: `/profile`,
              checkin: { pathPatterns: [`/profile*`], titleWords: [`每日签到`] },
              quotaPerUnit: 5e5
            }
          }
        };
        break;
      }
      case 7: {
        scope.Gt = {
          id: `sharedchat`,
          label: `SharedChat 权益领取`,
          siteType: scope.V.NEW_API,
          fingerprints: { hostnames: [`new.sharedchat.cc`], titleWords: [`sharedchat`, `chatai`] },
          preset: {
            pointerMode: `trusted`,
            loginMethod: `auto`,
            selectors: {
              username: `input[placeholder*="用户名"], input[placeholder*="邮箱"]`,
              password: `input[type="password"]`,
              submit: `button.submit-btn, button >> text=用户登录`
            },
            closeModalSelectors: scope.Rt,
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
              siteType: scope.V.NEW_API,
              family: scope.N.NEW_API,
              checkinPath: `/list/`,
              checkin: { pathPatterns: [`/list*`], titleWords: [`权益`, `benefit`] }
            }
          }
        };
        break;
      }
      case 8: {
        scope.Kt = {
          id: `monkeycode`,
          label: `MonkeyCode`,
          siteType: scope.V.NEW_API,
          fingerprints: { hostnames: [`monkeycode-ai.com`] },
          preset: {
            selectors: {
              username: scope.zt.join(`, `),
              password: scope.Bt.join(`, `),
              submit: `button[type="submit"]`
            },
            loginMethod: `auto`,
            closeModalSelectors: scope.Rt,
            checkin: { method: `auto`, url: `/console/tasks` },
            adapter: {
              siteType: scope.V.NEW_API,
              family: scope.N.NEW_API,
              checkinPath: `/console/tasks`,
              checkin: { pathPatterns: [`/console/tasks*`], titleWords: [`签到`, `任务`, `task`] },
              quotaPerUnit: 5e5
            }
          }
        };
        break;
      }
      case 9: {
        scope.qt = {
          id: `futurehub`,
          label: `Future Hub`,
          siteType: scope.V.NEW_API,
          fingerprints: { hostnames: [`api.futureppo.top`] },
          preset: {
            selectors: {
              username: scope.zt.join(`, `),
              password: scope.Bt.join(`, `),
              submit: `button[type="submit"], button.semi-button-primary`
            },
            loginMethod: `auto`,
            closeModalSelectors: scope.Rt,
            checkin: {
              method: `button`,
              url: `/console/personal`,
              buttonSelector: `button >> text=立即签到`,
              alreadySelector: `button >> text=今日已签到`,
              alreadyText: [`今日已签到`]
            },
            adapter: {
              siteType: scope.V.NEW_API,
              family: scope.N.NEW_API,
              checkinPath: `/console/personal`,
              checkin: { pathPatterns: [`/console/personal*`], titleWords: [`每日签到`] },
              quotaPerUnit: 5e5
            }
          }
        };
        break;
      }
      case 10: {
        scope.Jt = {
          id: `anyrouter`,
          label: `AnyRouter（登录即签到）`,
          siteType: scope.V.ANYROUTER,
          fingerprints: { hostnames: [`anyrouter.top`], titleWords: [`any router`, `anyrouter`] },
          preset: {
            selectors: {
              username: scope.zt.join(`, `),
              password: scope.Bt.join(`, `),
              submit: `button[type="submit"], button.semi-button-primary`
            },
            loginMethod: `auto`,
            closeModalSelectors: scope.Rt,
            checkin: { method: `none` },
            adapter: {
              siteType: scope.V.ANYROUTER,
              family: scope.N.NEW_API,
              checkinPath: ``,
              quotaPerUnit: 5e5
            }
          }
        };
        break;
      }
      case 11: {
        scope.Yt = {
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
          closeModalSelectors: scope.Rt,
          checkin: {
            method: `button`,
            url: `/check-in`,
            buttonSelector: `button >> text=立即签到, button >> text=Check in`,
            alreadySelector: `button >> text=今日已签到, button >> text=Already checked in today`,
            successText: [`签到成功`, `Checked in — got`],
            alreadyText: [`今日已签到`, `今天已经签过了`, `Already checked in today`]
          },
          adapter: {
            siteType: scope.V.SUB2API,
            family: scope.N.SUB2API,
            checkinPath: `/check-in`,
            checkin: { pathPatterns: [`/check-in*`], titleWords: [`每日签到`, `daily check-in`] },
            quotaPerUnit: 1
          }
        };
        break;
      }
      case 12: {
        scope.Xt = {
          id: `linxi`,
          label: `林夕`,
          siteType: scope.V.SUB2API,
          fingerprints: { hostnames: [`k40.shengqainbang.cn`], titleWords: [`林夕`] },
          preset: scope.Yt
        };
        break;
      }
      case 13: {
        scope.Zt = {
          id: `baibei`,
          label: `百倍`,
          siteType: scope.V.SUB2API,
          fingerprints: { hostnames: [`sub.100xlabs.space`] },
          preset: scope.Yt
        };
        break;
      }
      case 14: {
        scope.Qt = {
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
          closeModalSelectors: scope.Rt,
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
            siteType: scope.V.SUB2API,
            family: scope.N.SUB2API,
            checkinPath: `/checkin`,
            checkin: { pathPatterns: [`/checkin*`], titleWords: [`每日签到`, `daily check-in`] },
            quotaPerUnit: 1
          }
        };
        break;
      }
      case 15: {
        scope.$t = {
          id: `denxio`,
          label: `登仙公益站`,
          siteType: scope.V.SUB2API,
          fingerprints: {
            hostnames: [`api.denxio.top`],
            titleWords: [`登仙公益站`, `登仙`, `denxio`]
          },
          preset: scope.Qt
        };
        break;
      }
      case 16: {
        scope.en = {
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
          closeModalSelectors: scope.Rt,
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
            siteType: scope.V.UNKNOWN,
            family: scope.N.UNSUPPORTED,
            checkinPath: `/daily_checkin`,
            checkin: { pathPatterns: [`/daily_checkin*`], titleWords: [`每日签到`] }
          }
        };
        break;
      }
      case 17: {
        scope.tn = {
          id: `linux-sb`,
          label: `Linux.SB`,
          siteType: scope.V.UNKNOWN,
          fingerprints: { hostnames: [`linux.sb`] },
          preset: scope.en
        };
        break;
      }
      case 18: {
        scope.J = {
          id: `new-api-next`,
          label: `已识别 new-api 中转站（新版界面）`,
          siteType: scope.V.NEW_API,
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
            closeModalSelectors: scope.Rt,
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
              siteType: scope.V.NEW_API,
              family: scope.N.NEW_API,
              checkinPath: `/profile`,
              checkin: { pathPatterns: [`/profile*`], titleWords: [`每日签到`] },
              quotaPerUnit: 5e5
            }
          }
        };
        break;
      }
      case 19: {
        scope.nn = scope.J.preset;
        break;
      }
      case 20: {
        scope.rn = {
          ...scope.J.preset,
          selectors: { ...scope.J.preset.selectors },
          closeModalSelectors: [...scope.J.preset.closeModalSelectors],
          oauthButtonSelector: `text=GitHub`,
          checkin: {
            ...scope.J.preset.checkin,
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
            ...scope.J.preset.adapter,
            checkin: {
              ...scope.J.preset.adapter?.checkin,
              pathPatterns: [...scope.J.preset.adapter?.checkin?.pathPatterns ?? []],
              titleWords: [...scope.J.preset.adapter?.checkin?.titleWords ?? []]
            }
          }
        };
        break;
      }
      case 21: {
        scope.an = {
          id: `tabiai`,
          label: `TaBiAI`,
          siteType: scope.V.NEW_API,
          fingerprints: { hostnames: [`tabitoken.com`], titleWords: [`tabiai`, `tabitoken`] },
          preset: scope.rn
        };
        break;
      }
      case 22: {
        scope.on = {
          pointerMode: `trusted`,
          loginMethod: `auto`,
          selectors: {
            username: `input[name="username"]`,
            password: `input[name="password"]`,
            submit: `button[type="submit"], button >> text=登录, button >> text=Sign in`
          },
          successIndicator: `a[href="/keys"], a[href="/wallet"], text=浮梦引光, a[href="/lottery"]`,
          closeModalSelectors: scope.Rt,
          checkin: { method: `workflow`, workflow: { steps: [{ type: `leilei-daily` }] } },
          adapter: {
            siteType: scope.V.NEW_API,
            family: scope.N.NEW_API,
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
      case 23: {
        scope.sn = {
          id: `leilei`,
          label: `一梦五千年`,
          siteType: scope.V.NEW_API,
          fingerprints: { hostnames: [`fapi.leileihog.top`] },
          preset: scope.on
        };
        break;
      }
      case 24: {
        scope.cn = {
          selectors: {
            username: scope.zt.join(`, `),
            password: scope.Bt.join(`, `),
            submit: `button[type="submit"], button.semi-button-primary`
          },
          pointerMode: `trusted`,
          loginMethod: `auto`,
          closeModalSelectors: scope.Rt,
          checkin: {
            method: `button`,
            url: `/console/personal`,
            buttonSelector: `button >> text=立即签到`,
            alreadySelector: `button >> text=今日已签到, button >> text=已签到`,
            successText: [`签到成功`, `今日已签到`],
            alreadyText: [`今日已签到`, `已签到`]
          },
          adapter: {
            siteType: scope.V.NEW_API,
            family: scope.N.NEW_API,
            checkinPath: `/console/personal`,
            checkin: { pathPatterns: [`/console/personal*`], titleWords: [`每日签到`, `试试手气`] },
            quotaPerUnit: 5e5
          }
        };
        break;
      }
      case 25: {
        scope.ln = {
          id: `vsllm`,
          label: `VSLLM`,
          siteType: scope.V.NEW_API,
          fingerprints: { hostnames: [`vsllm.com`] },
          preset: scope.cn
        };
        break;
      }
      case 26: {
        scope.un = {
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
          closeModalSelectors: scope.Rt,
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
            siteType: scope.V.UNKNOWN,
            family: scope.N.UNSUPPORTED,
            checkinPath: `/`,
            checkin: { pathPatterns: [`/`], titleWords: [`每日签到`] },
            quotaPerUnit: 1
          }
        };
        break;
      }
      case 27: {
        scope.dn = [
          scope.Ut,
          scope.Wt,
          scope.Gt,
          scope.Kt,
          scope.qt,
          scope.Jt,
          scope.Xt,
          scope.Zt,
          scope.$t,
          scope.tn,
          scope.an,
          scope.sn,
          scope.J,
          scope.ln,
          {
            id: `hvoy`,
            label: `Hvoy AI`,
            siteType: scope.V.UNKNOWN,
            fingerprints: { hostnames: [`www.hvoy.ai`] },
            preset: scope.un
          },
          {
            id: `sub2api`,
            label: `Sub2API 系`,
            siteType: scope.V.SUB2API,
            fingerprints: {
              titleWords: [`sub2api`],
              selectors: [`#email + *, input#email`],
              endpoint: {
                path: `/api/v1/auth/me`,
                match: (e) => (0, scope.Vt)(e) && typeof e.code == `string`
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
              closeModalSelectors: scope.Rt,
              checkin: { method: `auto`, url: `/check-in` },
              adapter: {
                siteType: scope.V.SUB2API,
                family: scope.N.SUB2API,
                checkinPath: `/check-in`,
                checkin: {
                  pathPatterns: [`/check-in*`],
                  titleWords: [`每日签到`, `daily check-in`]
                },
                quotaPerUnit: 1
              }
            }
          },
          {
            id: `new-api`,
            label: `new-api / one-api 系`,
            siteType: scope.V.NEW_API,
            fingerprints: {
              titleWords: [`new-api`, `one-api`, `veloera`, `voapi`],
              selectors: [`.semi-modal-close`, `.semi-button`, `#username`],
              endpoint: {
                path: `/api/user/self`,
                match: (e) => (0, scope.Vt)(e) && e.success === false
              }
            },
            preset: {
              selectors: {
                username: `#username`,
                password: `#password`,
                submit: `button[type="submit"]`
              },
              loginMethod: `auto`,
              closeModalSelectors: scope.Rt,
              successIndicator: `a[href="/console/token"], a[href="/console/topup"]`,
              checkin: { method: `auto`, url: `/console/personal`, apiUrl: `/api/user/checkin` },
              adapter: {
                siteType: scope.V.NEW_API,
                family: scope.N.NEW_API,
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
      case 28: {
        scope.pn = [];
        break;
      }
      case 29: {
        scope.Yr = `www.hvoy.ai`;
        break;
      }
      case 30: {
        scope.ti = `fapi.leileihog.top`;
        break;
      }
      case 31: {
        scope.li = new Set((scope.J.fingerprints.hostnames ?? []).map((e) => e.toLowerCase()));
        break;
      }
      case 32: {
        scope.Si = `button.refresh-btn, button.invite-entry-button, button.el-button--primary.el-button--large`;
        break;
      }
      case 33: {
        scope.Ci = `button.refresh-btn, button.invite-entry-button`;
        break;
      }
      case 34: {
        scope.$ = `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`;
        break;
      }
      case 35: {
        scope.fo = `w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600 disabled:opacity-40 disabled:shadow-none`;
        break;
      }
      case 36: {
        scope.po = { bookmark_bar: `书签栏`, other: `其他书签`, synced: `移动设备书签` };
        break;
      }
      case 37: {
        scope.Po = [
          { value: `form`, label: `站点账号密码`, description: `填站点用户名密码并提交，最常见` },
          {
            value: `github`,
            label: `GitHub 账号密码`,
            description: `点站点 OAuth 按钮，跳到 GitHub 后自动填 GitHub 账密`
          },
          {
            value: `oauth`,
            label: `第三方授权登录`,
            description: `在提供方页面完成授权；添加账号时选择本站检测到的具体入口`
          },
          {
            value: `passkey`,
            label: `Passkey / 通行密钥`,
            description: `在浏览器或系统提示中确认登录`
          },
          {
            value: `manual`,
            label: `验证码 / 页面登录`,
            description: `在站点页面完成验证码或扫码，并核验本站账号身份`
          }
        ];
        break;
      }
      case 38: {
        scope.Fo = {
          form: `站点账号密码`,
          github: `GitHub 账号密码`,
          passkey: `Passkey 登录`,
          oauth: `其他 OAuth 授权`,
          manual: `验证码 / 页面登录`,
          token: `API 通行令牌`,
          auto: `自动检测`
        };
        break;
      }
      case 39: {
        scope.Lo = { storageKey: ``, headerName: `Authorization`, headerPrefix: `Bearer ` };
        break;
      }
      case 40: {
        scope.Bl = [
          {
            value: `name-asc`,
            label: `A → Z`,
            name: `名称 A→Z`,
            hint: `中文按全拼与字母混排；1、2、10 按数值排列`
          },
          {
            value: `name-desc`,
            label: `Z → A`,
            name: `名称 Z→A`,
            hint: `按名称降序；一、壹等汉字按拼音，不当数字`
          }
        ];
        break;
      }
      case 41: {
        scope.Hl = `siteSortMode`;
        break;
      }
      case 42: {
        scope.Ul = Promise.resolve();
        break;
      }
      case 43: {
        scope.Gl = `accountSortMode`;
        break;
      }
      case 44: {
        scope.Kl = Promise.resolve();
        break;
      }
    }
  },
  storeProperties: {
    store_Li_moveSite(scope) {
      return {
        async moveSite(e, t, n) {
          return (0, scope.X)(async () => {
            let r = await scope.z.get(scope.M.sites, []), i = scope.pn.filter((e2) => !r.some((t2) => t2.id === e2.id)), a = [...r, ...i], o;
            if (n?.length) {
              let e2 = /* @__PURE__ */ new Map();
              for (let [t2, r2] of n.entries()) e2.has(r2) || e2.set(r2, t2);
              o = a.map((t2, r2) => ({ site: t2, key: e2.get(t2.id) ?? n.length + r2 })).sort((e3, t2) => e3.key - t2.key).map(({ site: e3 }) => e3);
            } else {
              o = a.map((e2, t2) => ({ ...e2, sortOrder: e2.sortOrder ?? t2 })).sort((e2, t2) => e2.sortOrder - t2.sortOrder || e2.name.localeCompare(t2.name));
              let n2 = o.findIndex((t2) => t2.id === e), r2 = t === `up` ? n2 - 1 : n2 + 1;
              if (n2 < 0 || r2 < 0 || r2 >= o.length) return;
              [o[n2], o[r2]] = [o[r2], o[n2]];
            }
            await scope.z.set(
              scope.M.sites,
              o.map((e2, t2) => ({ ...e2, sortOrder: t2 }))
            );
          });
        }
      };
    },
    store_Li_addSite(scope) {
      return {
        addSite(e) {
          return (0, scope.X)(async () => {
            (0, scope.or)(e);
            let [t, n] = await Promise.all([
              scope.z.get(scope.M.sites, []),
              scope.z.get(scope.M.proxies, [])
            ]);
            (0, scope.Fi)(e.proxyId, (0, scope.Ni)(n)), await scope.z.set(scope.M.sites, t.concat({ ...e, id: (0, scope.Ft)(`site`) }));
          });
        }
      };
    },
    store_Li_addSites(scope) {
      return {
        addSites(e, t, n = false) {
          return (0, scope.X)(async () => {
            e.forEach(scope.or);
            let [r, i] = await Promise.all([
              scope.z.get(scope.M.sites, []),
              scope.z.get(scope.M.proxies, [])
            ]), a = (0, scope.Ni)(i), o = new Set(t);
            r.forEach((e2) => o.add(e2.loginUrl.trim()));
            let s = [];
            for (let t2 of e) {
              let e2 = t2.loginUrl.trim();
              !e2 || !n && o.has(e2) || t2.proxyId && !a.has(t2.proxyId) || (o.add(e2), s.push({ ...t2, id: (0, scope.Ft)(`site`) }));
            }
            return s.length && await scope.z.set(scope.M.sites, r.concat(s)), s.length;
          });
        }
      };
    },
    store_Li_updateSite(scope) {
      return {
        updateSite(e, t) {
          return (0, scope.X)(async () => {
            let [n, r] = await Promise.all([
              scope.z.get(scope.M.sites, []),
              scope.z.get(scope.M.proxies, [])
            ]), i = scope.pn.find((t2) => t2.id === e), a = n.find((t2) => t2.id === e) ?? i;
            `proxyId` in t && t.proxyId !== a?.proxyId && (0, scope.Fi)(t.proxyId, (0, scope.Ni)(r));
            let o = false, s = n.map((n2) => {
              if (n2.id !== e) return n2;
              o = true;
              let r2 = { ...n2, ...t, ...i ? { builtin: true } : {} };
              return (0, scope.or)(r2), r2;
            });
            if (!o && i) {
              let e2 = { ...i, ...t, builtin: true };
              (0, scope.or)(e2), s.push(e2);
            }
            await scope.z.set(scope.M.sites, s);
          });
        }
      };
    },
    store_Ui_addSite(scope, e, t) {
      return {
        async addSite(e2) {
          await (0, scope.Vi)({ action: `add-site`, input: e2 }), await t().load();
        }
      };
    },
    store_Ui_addSites(scope, e, t) {
      return {
        async addSites(e2, n = false) {
          e2.length !== 0 && (await (0, scope.Vi)({ action: `add-sites`, inputs: e2, preserveDuplicates: n })).added && await t().load();
        }
      };
    },
    store_Ui_updateSite(scope, e, t) {
      return {
        async updateSite(e2, n) {
          await (0, scope.Vi)({ action: `update-site`, siteId: e2, patch: n }), await t().load();
        }
      };
    },
    store_Ui_moveSite(scope, e, t) {
      return {
        async moveSite(e2, n, r) {
          await (0, scope.Vi)({ action: `move-site`, siteId: e2, direction: n, orderedIds: r }), await t().load();
        }
      };
    },
    store_Ui_removeSite(scope, e, t) {
      return {
        async removeSite(e2) {
          await t().removeMany([e2], []);
        }
      };
    }
  }
});

// src/modules/records/view.js
var ExecutionRecordsView;
var summarizeBalances;
var sharedUiRuntime4 = createUiModuleRuntime({
  bindingNames: ["fd", "pd", "md", "hd", "gd", "_d", "vd", "yd", "bd", "xd", "Sd", "Cd", "Nm"],
  publish(name, value) {
    switch (name) {
      case "Nm":
        ExecutionRecordsView = value;
        break;
      case "_d":
        summarizeBalances = value;
        break;
    }
  },
  register(scope) {
    scope.fd = function fd({ quotaPerUnit: e, family: t }) {
      return e && e > 0 ? e : t === `new-api` ? scope.dd : 1;
    };
    scope.pd = function pd(e, t) {
      return e / (0, scope.fd)(t);
    };
    scope.md = function md(e) {
      return e.toFixed(2).replace(/\.00$/, ``).replace(/(\.\d)0$/, `$1`);
    };
    scope.hd = function hd(e, t, n = `$`) {
      return n === `积分` ? `积分 ${(0, scope.md)(e)}` : `${n}${(0, scope.pd)(e, t).toFixed(4)}`;
    };
    scope.gd = function gd(e, t, n = `$`) {
      return n === `积分` ? `${(0, scope.md)(e)} 积分` : (0, scope.hd)(e, t, n);
    };
    scope._d = function _d(e) {
      let t = 0, n = 0, r = /* @__PURE__ */ new Map();
      for (let { balance: i2, scale: a2 } of e) {
        if (!i2 || i2.error) {
          n += 1;
          continue;
        }
        let e2 = i2.symbol ?? `$`, o = e2 === `$` ? `dollar` : e2 === `积分` ? `points` : `yuan`, s = r.get(o);
        r.set(o, {
          symbol: s?.symbol ?? e2,
          amount: (s?.amount ?? 0) + (e2 === `积分` ? i2.quota : (0, scope.pd)(i2.quota, a2)),
          counted: (s?.counted ?? 0) + 1
        }), t += 1;
      }
      let i = (e2) => e2 === `$` ? 0 : e2 === `积分` ? 2 : 1, a = [...r.values()].sort((e2, t2) => i(e2.symbol) - i(t2.symbol));
      return { dollars: r.get(`dollar`)?.amount ?? 0, counted: t, missing: n, currencies: a };
    };
    scope.vd = function vd(e) {
      return e.counted === 0 ? `未获取` : e.currencies.map(({ symbol: e2, amount: t }) => (0, scope.hd)(t, {}, e2)).join(` + `);
    };
    scope.yd = function yd(e, t, n = Date.now()) {
      if (e && !e.error) return { balance: e, fromCheckinResult: false };
      let r = t?.metrics?.quotaAfter;
      if (r == null) return { balance: e, fromCheckinResult: false };
      let i = t?.metrics?.balanceSymbol ?? e?.symbol;
      return {
        balance: {
          quota: r,
          usedQuota: e?.usedQuota ?? 0,
          ...i ? { symbol: i } : {},
          at: n,
          source: `api`
        },
        fromCheckinResult: true
      };
    };
    scope.bd = function bd(e, t = Date.now()) {
      let n = Math.max(0, Math.round((t - e) / 1e3));
      if (n < 60) return `刚刚更新`;
      let r = Math.round(n / 60);
      if (r < 60) return `${r} 分钟前`;
      let i = Math.round(r / 60);
      return i < 24 ? `${i} 小时前` : `${Math.round(i / 24)} 天前`;
    };
    scope.xd = function xd(e) {
      return e.nameOnly === true;
    };
    scope.Sd = function Sd(e) {
      let t = e.trim().toLowerCase();
      return t === `localhost` || t === `127.0.0.1` || t === `::1` || t === `[::1]`;
    };
    scope.Cd = function Cd(e) {
      let t = String(e.scheme).trim().toLowerCase(), n = t === `socks` ? `socks5` : t === `mixed` ? `http` : t === `https` || t === `socks4` || t === `socks5` ? t : `http`;
      return n === `https` && (0, scope.Sd)(e.host) ? `http` : n;
    };
    scope.Nm = function Nm({ sites: e, accounts: n, resultOf: i, statusOf: a }) {
      let [s, c2] = (0, scope.k.useState)(`全部`), l = (0, scope.k.useMemo)(() => new Map(e.map((e2) => [e2.id, e2.name])), [e]), u = (0, scope.k.useMemo)(
        () => n.map((e2) => ({ account: e2, result: i(e2.id), status: a(e2.id) })).filter((e2) => e2.result != null).sort((e2, t) => (t.result?.at ?? 0) - (e2.result?.at ?? 0)),
        [n, i, a]
      ), d = u.filter(
        (e2) => s === `成功` ? e2.result?.ok === true : s !== `失败` || e2.result?.ok === false
      ), f2 = u.filter((e2) => e2.result?.ok === true).length, p = u.filter((e2) => e2.result?.ok === false).length, m = u.length ? Math.round(f2 / u.length * 100) : 0;
      return (0, scope.O.jsxs)(`div`, {
        className: `space-y-4`,
        children: [
          (0, scope.O.jsxs)(`div`, {
            children: [
              (0, scope.O.jsx)(`h1`, {
                className: `text-xl font-bold tracking-tight`,
                children: `执行记录`
              }),
              (0, scope.O.jsx)(`p`, {
                className: `mt-1 text-[11px] text-ink-800/55 dark:text-ink-100/50`,
                children: `每个账号最近一次执行的步骤流水，失败的那一步直接标出原因。`
              })
            ]
          }),
          (0, scope.O.jsxs)(`section`, {
            className: `grid gap-3 sm:grid-cols-2 xl:grid-cols-4`,
            "aria-label": `执行统计`,
            children: [
              (0, scope.O.jsx)(scope.jm, {
                label: `有记录账号`,
                value: u.length,
                detail: `共 ${n.length} 个账号`,
                tone: `blue`,
                icon: scope.o
              }),
              (0, scope.O.jsx)(scope.jm, {
                label: `成功率`,
                value: `${m}%`,
                detail: `成功 ${f2} 条`,
                tone: `mint`,
                icon: scope.t
              }),
              (0, scope.O.jsx)(scope.jm, {
                label: `失败`,
                value: p,
                detail: `最近一次未成功`,
                tone: `coral`,
                icon: scope.b
              }),
              (0, scope.O.jsx)(scope.jm, {
                label: `需处理`,
                value: n.filter((e2) => a(e2.id) === `attention`).length,
                detail: `等待人工验证`,
                tone: `amber`,
                icon: scope._
              })
            ]
          }),
          (0, scope.O.jsx)(`div`, {
            className: `flex flex-wrap items-center gap-2`,
            children: (0, scope.O.jsx)(`div`, {
              className: `flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900`,
              role: `tablist`,
              "aria-label": `执行结果筛选`,
              children: [`全部`, `成功`, `失败`].map(
                (e2) => (0, scope.O.jsx)(
                  `button`,
                  {
                    type: `button`,
                    "aria-selected": s === e2,
                    onClick: () => c2(e2),
                    className: (0, scope.$)(
                      `h-7 rounded-md px-3 text-[11px] font-medium transition-colors`,
                      s === e2 ? `bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300` : `text-ink-800/55 hover:text-ink-900 dark:text-ink-100/50`
                    ),
                    children: e2
                  },
                  e2
                )
              )
            })
          }),
          (0, scope.O.jsxs)(`section`, {
            className: `space-y-2`,
            "aria-label": `执行流水`,
            children: [
              d.map(({ account: e2, result: t, status: n2 }) => {
                let r = t?.ok === true, i2 = t?.steps ?? [];
                return (0, scope.O.jsxs)(
                  `article`,
                  {
                    className: `overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950`,
                    children: [
                      (0, scope.O.jsxs)(`header`, {
                        className: `flex flex-wrap items-center gap-3 px-4 py-3`,
                        children: [
                          (0, scope.O.jsx)(`span`, {
                            className: (0, scope.$)(
                              `grid size-7 shrink-0 place-items-center rounded-lg`,
                              r ? `bg-mint-50 text-mint-700 dark:bg-mint-600/15 dark:text-mint-300` : `bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300`
                            ),
                            children: r ? (0, scope.O.jsx)(scope.o, { className: `size-3.5` }) : (0, scope.O.jsx)(scope.b, { className: `size-3.5` })
                          }),
                          (0, scope.O.jsxs)(`span`, {
                            className: `min-w-0 flex-1`,
                            children: [
                              (0, scope.O.jsxs)(`strong`, {
                                className: `block truncate text-xs font-semibold text-ink-900 dark:text-ink-50`,
                                children: [
                                  e2.label || e2.username,
                                  (0, scope.O.jsx)(`em`, {
                                    className: `ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium not-italic text-ink-800/55 dark:bg-slate-800 dark:text-ink-100/50`,
                                    children: l.get(e2.siteId) ?? `未知站点`
                                  })
                                ]
                              }),
                              (0, scope.O.jsx)(`span`, {
                                className: `mt-0.5 block truncate text-[11px] text-ink-800/55 dark:text-ink-100/50`,
                                children: t?.message || `无附加说明`
                              })
                            ]
                          }),
                          (0, scope.O.jsx)(`span`, {
                            className: (0, scope.$)(
                              `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold`,
                              scope.Am[n2]
                            ),
                            children: scope.km[n2]
                          })
                        ]
                      }),
                      i2.length > 0 && (0, scope.O.jsx)(`ol`, {
                        className: `divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800/70 dark:border-slate-800/70`,
                        children: i2.map((n3, r2) => {
                          let a2 = r2 === i2.length - 1, s2 = a2 && t?.ok === false;
                          return (0, scope.O.jsxs)(
                            `li`,
                            {
                              className: `flex items-start gap-2.5 px-4 py-2`,
                              children: [
                                (0, scope.O.jsx)(`span`, {
                                  className: (0, scope.$)(
                                    `mt-0.5 grid size-4 shrink-0 place-items-center rounded-full`,
                                    s2 ? `bg-rose-50 text-rose-600 dark:bg-rose-950/40` : `bg-mint-50 text-mint-700 dark:bg-mint-600/15`
                                  ),
                                  children: s2 ? (0, scope.O.jsx)(scope.b, { className: `size-2.5` }) : (0, scope.O.jsx)(scope.o, { className: `size-2.5` })
                                }),
                                (0, scope.O.jsx)(`span`, {
                                  className: `min-w-0 flex-1 text-[11px] text-ink-800/75 dark:text-ink-100/65`,
                                  children: n3
                                }),
                                a2 && (0, scope.O.jsx)(`span`, {
                                  className: (0, scope.$)(
                                    `shrink-0 text-[10px]`,
                                    s2 ? `text-rose-600 dark:text-rose-400` : `text-mint-700 dark:text-mint-300`
                                  ),
                                  children: s2 ? `中断` : `完成`
                                })
                              ]
                            },
                            `${e2.id}-${r2}`
                          );
                        })
                      }),
                      t?.manual && (0, scope.O.jsx)(`p`, {
                        className: `border-t border-amber-100 bg-amber-50/60 px-4 py-2 text-[10px] text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300`,
                        children: `用户手动标记的结果：这条没有扩展的守恒差分证据，仅作记录。`
                      })
                    ]
                  },
                  e2.id
                );
              }),
              !d.length && (0, scope.O.jsxs)(`div`, {
                className: `flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-14 text-center dark:border-slate-700`,
                children: [
                  (0, scope.O.jsx)(scope.r, {
                    className: `size-6 text-ink-800/25 dark:text-ink-100/20`
                  }),
                  (0, scope.O.jsx)(`strong`, {
                    className: `text-xs text-ink-800/70 dark:text-ink-100/60`,
                    children: `还没有执行记录`
                  }),
                  (0, scope.O.jsx)(`span`, {
                    className: `text-[11px] text-ink-800/45 dark:text-ink-100/40`,
                    children: `先执行一次签到，这里会留下每一步的结果`
                  })
                ]
              })
            ]
          })
        ]
      });
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
    }
  },
  storeProperties: {}
});
var BalanceHistoryDialog;
var classifyExecutionFailure;
var FailureGuidance;
var appRuntime4 = createUiModuleRuntime({
  bindingNames: [
    "Sr",
    "Cr",
    "wr",
    "Tr",
    "Er",
    "Dr",
    "Or",
    "kr",
    "Ar",
    "jr",
    "Mr",
    "Nr",
    "Yi",
    "Xi",
    "Zi",
    "Qi",
    "$i",
    "ea",
    "ta",
    "Z",
    "na",
    "ra",
    "ia",
    "aa",
    "oa",
    "sa",
    "Ba",
    "Va",
    "Ha",
    "Ua"
  ],
  publish(name, value) {
    switch (name) {
      case "Ba":
        BalanceHistoryDialog = value;
        break;
      case "sa":
        classifyExecutionFailure = value;
        break;
      case "aa":
        FailureGuidance = value;
        break;
    }
  },
  register(scope) {
    scope.Sr = function Sr(e) {
      return {
        quota: e.quota,
        usedQuota: e.usedQuota,
        ...e.symbol ? { symbol: e.symbol } : {},
        at: e.at,
        source: e.source ?? `api`
      };
    };
    scope.Cr = function Cr(e) {
      return (0, scope.q)(new Date(e));
    };
    scope.wr = function wr(e, t = 90) {
      let n = Object.keys(e).sort().slice(-t);
      return Object.fromEntries(n.map((t2) => [t2, e[t2]]));
    };
    scope.Tr = function Tr(e, t, n = 90) {
      let r = { ...e?.daily ?? {} };
      if (e && !e.error && !e.daily && Number.isFinite(e.at)) {
        let t2 = (0, scope.Sr)(e);
        r[(0, scope.Cr)(t2.at)] = { first: t2, latest: t2 };
      }
      let i = (0, scope.Sr)(t), a = (0, scope.Cr)(i.at), o = r[a] ?? {}, s = !o.first || i.at < o.first.at ? i : o.first, c2 = !o.latest || i.at >= o.latest.at ? i : o.latest;
      return r[a] = { ...o, first: s, latest: c2 }, (0, scope.wr)(r, n);
    };
    scope.Er = function Er(e, t, n, r, i = 90, a) {
      let o = e?.[t], s = a ?? (o?.checkinReward === n ? o.checkinRewardSymbol : void 0), c2 = { ...o ?? {}, checkinReward: n, checkinRewardAt: r };
      return s ? c2.checkinRewardSymbol = s : delete c2.checkinRewardSymbol, (0, scope.wr)({ ...e ?? {}, [t]: c2 }, i);
    };
    scope.Or = function Or(e, t = 7) {
      if (!e?.daily) return [];
      let n = Object.entries(e.daily).filter((e2) => !!e2[1].first && !!e2[1].latest).sort(([e2], [t2]) => e2.localeCompare(t2));
      return n.map(([e2, t2], r) => {
        let i = n[r - 1], a = t2.latest.at > t2.first.at ? (0, scope.Dr)(t2.latest) - (0, scope.Dr)(t2.first) : void 0;
        return {
          day: e2,
          first: t2.first,
          latest: t2.latest,
          ...a == null ? {} : { withinDayDelta: a },
          ...i ? {
            previousDay: i[0],
            previousDayDelta: (0, scope.Dr)(t2.latest) - (0, scope.Dr)(i[1].latest)
          } : {},
          ...t2.checkinReward == null ? {} : {
            checkinReward: t2.checkinReward,
            ...t2.checkinRewardSymbol ? { checkinRewardSymbol: t2.checkinRewardSymbol } : {}
          }
        };
      }).slice(-t).reverse();
    };
    scope.jr = function jr(e, t) {
      let n = t.quota + t.usedQuota - (e.quota + e.usedQuota), r = t.usedQuota - e.usedQuota;
      return {
        reward: n,
        usageDelta: r,
        balanceDelta: t.quota - e.quota,
        verdict: n > scope.Ar ? `rewarded` : r > scope.Ar ? `already-used` : `unchanged`,
        source: `balance-diff`,
        quotaAfter: t.quota,
        ...t.symbol ? { balanceSymbol: t.symbol } : {}
      };
    };
    scope.Mr = function Mr(e, t = (0, scope.q)()) {
      let n = e?.daily;
      if (!n) return null;
      let r = n[t];
      if (!r?.latest) return null;
      let i = [];
      r.first && r.latest.at > r.first.at && i.push({
        metrics: (0, scope.jr)(r.first, r.latest),
        baselineDay: t,
        currentDay: t,
        basis: `within-day`
      });
      let a = Object.keys(n).filter((e2) => e2 < t && !!n[e2]?.latest).sort().pop(), o = a ? n[a]?.latest : void 0;
      return a && o && i.push({
        metrics: (0, scope.jr)(o, r.latest),
        baselineDay: a,
        currentDay: t,
        basis: `previous-day`
      }), i.find((e2) => e2.metrics.verdict === `rewarded`) ?? i[0] ?? null;
    };
    scope.Nr = function Nr(e, t, n = (0, scope.q)()) {
      let r = (0, scope.Mr)(t, n), i = r?.metrics.verdict === `rewarded`, a = r?.basis === `within-day` ? `今天首次与最新余额快照` : r ? `${r.baselineDay} 与今天的余额快照` : null;
      return {
        accountId: e,
        ok: true,
        manual: true,
        message: i ? `${scope.kr}，已按余额差值计算增加量` : r ? `${scope.kr}，余额差值未增加` : scope.kr,
        steps: [
          `用户在管理页手动标记本次签到已完成`,
          ...a ? [`已按${a}计算总额度差值`] : [`没有可用的历史余额基线，无法计算增加量`],
          ...i ? [`该增加量是余额期间差值，可能包含同期间充值或其它入账`] : []
        ],
        ...r ? { metrics: r.metrics } : {}
      };
    };
    scope.Qi = function Qi({ status: e, evidence: t, method: n }) {
      let r = (0, scope.Ki)(n), i = e === `done` && t ? scope.Zi[t] : scope.Yi[e], a = scope.Xi[e], o = {
        label: e === `attention` ? `需处理` : e === `failed` ? `失败` : e === `done` ? t === `manual` ? `手动标记` : !t || t === `unverified` ? `${r.done}?` : r.done : (0, scope.Ji)(e, n),
        cls: i
      }, s = e === `done` ? `done-${t ?? `none`}` : e;
      return (0, scope.W.jsx)(scope.O, {
        mode: `wait`,
        initial: false,
        children: (0, scope.W.jsxs)(
          scope.w.span,
          {
            "data-status": e,
            "data-comic-state": a,
            initial: { opacity: 0, scale: 0.8, y: -2 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.8, y: 2 },
            transition: { type: `spring`, stiffness: 500, damping: 28 },
            className: (0, scope.R)(
              `status-badge`,
              `status-badge-${e}`,
              `status-badge-${a}`,
              `inline-flex min-w-[76px] select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1`,
              `text-[11px] font-medium ring-1 ring-inset`,
              o.cls
            ),
            children: [(0, scope.W.jsx)(scope.$i, { status: e, evidence: t }), o.label]
          },
          s
        )
      });
    };
    scope.$i = function $i({ status: e, evidence: t }) {
      let n = scope.Xi[e], r = (0, scope.R)(`status-badge-indicator`, `status-badge-indicator-${n}`);
      return e === `running` ? (0, scope.W.jsx)(scope.u, { className: (0, scope.R)(r, `size-3 animate-spin`) }) : e === `attention` ? (0, scope.W.jsx)(scope.p, { className: (0, scope.R)(r, `size-3`) }) : e === `failed` ? (0, scope.W.jsx)(scope.g, { className: (0, scope.R)(r, `size-3`) }) : e === `done` ? t === `manual` ? (0, scope.W.jsx)(scope.w.span, {
        className: r,
        initial: { scale: 0, rotate: -30 },
        animate: { scale: 1, rotate: 0 },
        transition: { type: `spring`, stiffness: 600, damping: 18 },
        children: (0, scope.W.jsx)(scope.Tt, { className: `size-3` })
      }) : t === `unverified` || !t ? (0, scope.W.jsx)(scope.Se, { className: (0, scope.R)(r, `size-3`) }) : t === `verified` ? (0, scope.W.jsx)(scope.w.span, {
        className: r,
        initial: { scale: 0, rotate: -30 },
        animate: { scale: 1, rotate: 0 },
        transition: { type: `spring`, stiffness: 600, damping: 18 },
        children: (0, scope.W.jsx)(scope.U, { className: `size-3 stroke-[3]` })
      }) : (0, scope.W.jsx)(scope.w.span, {
        className: r,
        initial: { scale: 0, rotate: -30 },
        animate: { scale: 1, rotate: 0 },
        transition: { type: `spring`, stiffness: 600, damping: 18 },
        children: (0, scope.W.jsx)(scope.o, { className: `size-3 stroke-[3]` })
      }) : (0, scope.W.jsx)(`span`, {
        className: (0, scope.R)(r, `size-1.5 rounded-full bg-current`)
      });
    };
    scope.ea = function ea(e) {
      if (!e?.ok) return null;
      if (e.manual) return `manual`;
      let t = e.metrics?.verdict;
      return t === `rewarded` ? e.metrics?.source === `visible-reward` || e.metrics?.source === `checkin-ledger` ? `reported` : `verified` : t === `unchanged` || t === `already-used` ? `observed` : `unverified`;
    };
    scope.ta = function ta(e, t) {
      return e === `verified` ? `额度确实增加了，签到成功可确认` : e === `reported` && t?.metrics?.source === `checkin-ledger` ? `签到卡记录了今天的奖励，余额差分未确认本轮增加` : e === `reported` ? `签到卡显示本次奖励，余额接口尚未同步` : e === `observed` && t?.metrics?.source === `checkin-ledger` ? `站点明确显示今日已签到，本次未重复点击，余额未变化` : e === `observed` ? `读到了签到前后的额度，但额度没有变化` : e === `unverified` ? `读不到额度变化，「成功」仅来自站点提示，扩展无法确认` : e === `manual` && t?.metrics?.verdict === `rewarded` ? `你手动标记的；增加量按已保存余额的总额度差值估算，可能包含同期间其它入账` : e === `manual` && t?.metrics ? `你手动标记的；已比较历史余额，但总额度没有增加` : e === `manual` ? `你手动标记的；没有历史余额基线，无法计算增加量` : null;
    };
    scope.aa = function aa({ code: e }) {
      let t = scope.ia[e];
      return t ? (0, scope.W.jsx)(scope.w.div, {
        initial: { opacity: 0, y: -4 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.18 },
        "data-diagnosis-code": e,
        className: (0, scope.R)(
          `rounded-lg px-2.5 py-2 ring-1 ring-inset`,
          `bg-amber-500/[0.07] ring-amber-500/20 dark:bg-amber-400/[0.06]`
        ),
        children: (0, scope.W.jsxs)(`div`, {
          className: `flex gap-2`,
          children: [
            (0, scope.W.jsx)(scope.g, {
              className: `mt-px size-3.5 shrink-0 text-amber-600 dark:text-amber-400`
            }),
            (0, scope.W.jsxs)(`div`, {
              className: `min-w-0 space-y-1.5`,
              children: [
                (0, scope.W.jsx)(`p`, {
                  "data-diagnosis-title": true,
                  className: `text-[11px] font-semibold text-amber-900 dark:text-amber-100`,
                  children: t.title
                }),
                (0, scope.W.jsx)(`p`, {
                  className: `text-[11px] leading-relaxed text-ink-800/70 dark:text-ink-100/60`,
                  children: t.detail
                }),
                (0, scope.W.jsxs)(`div`, {
                  className: `space-y-0.5`,
                  children: [
                    (0, scope.W.jsxs)(`p`, {
                      className: `flex items-center gap-1 text-[10px] font-medium text-amber-800/80 dark:text-amber-200/80`,
                      children: [
                        (0, scope.W.jsx)(scope.qe, { className: `size-3 shrink-0` }),
                        `下一步`
                      ]
                    }),
                    (0, scope.W.jsx)(`ul`, {
                      "data-diagnosis-actions": true,
                      className: `space-y-0.5`,
                      children: t.nextActions.map(
                        (e2, t2) => (0, scope.W.jsxs)(
                          `li`,
                          {
                            className: `flex gap-1.5 text-[11px] leading-relaxed text-ink-800/60 dark:text-ink-100/50`,
                            children: [
                              (0, scope.W.jsxs)(`span`, {
                                className: `shrink-0 opacity-45`,
                                children: [t2 + 1, `.`]
                              }),
                              (0, scope.W.jsx)(`span`, { children: e2 })
                            ]
                          },
                          t2
                        )
                      )
                    })
                  ]
                })
              ]
            })
          ]
        })
      }) : null;
    };
    scope.Ba = function Ba({ rows: e, quotaPerUnit: t, family: n }) {
      let r = { quotaPerUnit: t, family: n };
      return (0, scope.W.jsxs)(`section`, {
        "aria-label": `余额历史`,
        children: [
          (0, scope.W.jsxs)(`div`, {
            className: `flex items-center justify-between gap-2 text-[10px] text-slate-500`,
            children: [
              (0, scope.W.jsxs)(`span`, {
                className: `inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200`,
                children: [(0, scope.W.jsx)(scope.a, { className: `size-3` }), `余额记录`]
              }),
              (0, scope.W.jsxs)(`span`, { children: [`最近 `, e.length, ` 个日期`] })
            ]
          }),
          (0, scope.W.jsx)(`div`, {
            className: `mt-1 divide-y divide-slate-200 dark:divide-slate-700`,
            children: e.map((e2) => {
              let t2 = (0, scope.Va)(e2.day), n2 = e2.withinDayDelta == null ? e2.previousDay && e2.previousDayDelta != null ? {
                label: `较${(0, scope.Va)(e2.previousDay).label}`,
                value: e2.previousDayDelta
              } : null : { label: `当天`, value: e2.withinDayDelta }, i = e2.latest.source === `visible` ? `页面可见余额；页面未提供累计消耗时，差额证据较弱` : `结构化余额接口`;
              return (0, scope.W.jsxs)(
                `div`,
                {
                  "data-balance-day": e2.day,
                  className: `grid min-w-0 grid-cols-[minmax(82px,0.8fr)_minmax(100px,1fr)] items-center gap-x-3 gap-y-1 py-1.5 text-[10px] sm:grid-cols-[minmax(100px,0.8fr)_minmax(110px,1fr)_minmax(150px,1.3fr)]`,
                  children: [
                    (0, scope.W.jsxs)(`div`, {
                      className: `min-w-0`,
                      children: [
                        (0, scope.W.jsx)(`span`, {
                          className: `font-semibold text-slate-700 dark:text-slate-200`,
                          children: t2.label
                        }),
                        t2.detail && (0, scope.W.jsx)(`span`, {
                          className: `ml-1 text-slate-400`,
                          children: t2.detail
                        })
                      ]
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `flex min-w-0 items-center gap-1.5`,
                      children: [
                        (0, scope.W.jsx)(`span`, {
                          className: `font-semibold tabular-nums text-slate-800 dark:text-slate-100`,
                          children: (0, scope.ae)(e2.latest.quota, r, e2.latest.symbol)
                        }),
                        (0, scope.W.jsx)(`span`, {
                          title: i,
                          className: (0, scope.R)(
                            `shrink-0 font-medium`,
                            e2.latest.source === `visible` ? `text-amber-600 dark:text-amber-400` : `text-blue-600 dark:text-blue-400`
                          ),
                          children: e2.latest.source === `visible` ? `页面` : `API`
                        })
                      ]
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `col-span-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-500 sm:col-span-1 sm:justify-end`,
                      children: [
                        n2 && (0, scope.W.jsxs)(`span`, {
                          children: [
                            n2.label,
                            ` `,
                            (0, scope.W.jsx)(`strong`, {
                              className: (0, scope.R)(
                                `tabular-nums`,
                                n2.value > 0 ? `text-emerald-600 dark:text-emerald-400` : n2.value < 0 ? `text-rose-600 dark:text-rose-400` : `text-slate-600 dark:text-slate-300`
                              ),
                              children: (0, scope.Ha)(n2.value, r, e2.latest.symbol)
                            })
                          ]
                        }),
                        e2.checkinReward != null && (0, scope.W.jsxs)(`span`, {
                          className: `text-emerald-700 dark:text-emerald-300`,
                          children: [
                            `奖励 `,
                            (0, scope.W.jsxs)(`strong`, {
                              className: `tabular-nums`,
                              children: [
                                `+`,
                                (0, scope.ne)(e2.checkinReward, r, e2.checkinRewardSymbol)
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                },
                e2.day
              );
            })
          })
        ]
      });
    };
    scope.Va = function Va(e, t = /* @__PURE__ */ new Date()) {
      let n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
      if (!n) return { label: e };
      let r = Number(n[1]), i = Number(n[2]), a = Number(n[3]), o = /^(\d{4})-(\d{2})-(\d{2})$/.exec((0, scope.q)(t));
      if (!o) return { label: e };
      let s = Number(o[1]), c2 = Date.UTC(s, Number(o[2]) - 1, Number(o[3])) / 864e5 - Date.UTC(r, i - 1, a) / 864e5, l = `${i}月${a}日`;
      return c2 === 0 ? { label: `今天`, detail: l } : c2 === 1 ? { label: `昨天`, detail: l } : c2 === 2 ? { label: `前天`, detail: l } : r === s ? { label: l } : { label: `${r}年${l}` };
    };
    scope.Ha = function Ha(e, t, n) {
      let r = (0, scope.ne)(Math.abs(e), t, n);
      return e > 0 ? `+${r}` : e < 0 ? `-${r}` : r;
    };
    scope.Ua = function Ua(e, t, n) {
      let r = e?.rewardSymbol ?? e?.balanceSymbol;
      return e?.verdict === `rewarded` && e.reward ? `+${(0, scope.ne)(e.reward, { quotaPerUnit: t, family: n }, r)}` : null;
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.Dr = (e) => e.quota + e.usedQuota;
        break;
      }
      case 1: {
        scope.kr = `手动标记为已签到`;
        break;
      }
      case 2: {
        scope.Ar = 1e-9;
        break;
      }
      case 3: {
        scope.Yi = {
          pending: `bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/30`,
          running: `bg-brand-500/15 text-brand-600 dark:text-brand-400 ring-brand-500/30`,
          attention: `bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 ring-cyan-500/30`,
          done: `bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30`,
          failed: `bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/30`
        };
        break;
      }
      case 4: {
        scope.Xi = {
          pending: `thunder-flicker`,
          running: `armor-reactor`,
          attention: `mystic-portal`,
          done: `shield-glint`,
          failed: `titan-impact`
        };
        break;
      }
      case 5: {
        scope.Zi = {
          verified: `bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30`,
          reported: `bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 ring-cyan-500/30`,
          observed: `bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30`,
          unverified: `bg-ink-100 text-ink-800/70 ring-black/8 dark:bg-white/10 dark:text-ink-100/75 dark:ring-white/15`,
          manual: `bg-ink-100 text-ink-800/70 ring-black/8 dark:bg-white/10 dark:text-ink-100/75 dark:ring-white/15`
        };
        break;
      }
      case 6: {
        scope.Z = {
          SELECTOR_MISMATCH: `selector-mismatch`,
          ELEMENT_MISMATCH: `element-mismatch`,
          WORKFLOW_CONFIG: `workflow-config`,
          IDENTITY_ROUTE_UNREACHABLE: `identity-route-unreachable`,
          IDENTITY_EVIDENCE_CONFLICT: `identity-evidence-conflict`,
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
        break;
      }
      case 7: {
        scope.na = `在账号行点「学习本站流程」重新演示一遍：登录入口/字段不对就重演登录，签到控件不对就演到完成一次签到`;
        break;
      }
      case 8: {
        scope.ra = `在账号行点「学习本站流程」重新演示一遍（先过一遍资料页再进签到页）`;
        break;
      }
      case 9: {
        scope.ia = {
          [scope.Z.SELECTOR_MISMATCH]: {
            title: `页面上找不到要操作的控件`,
            detail: `登录页或签到页的结构与保存的选择器对不上，通常是站点改版了（class 变了、按钮改名、控件挪了位置）。`,
            nextActions: [
              scope.na,
              `展开账号详情，看最后一步卡在找什么元素；日志里的「页面可点元素」列出的是页面上真实存在的按钮`
            ]
          },
          [scope.Z.ELEMENT_MISMATCH]: {
            title: `命中了错误的元素`,
            detail: `保存的选择器还在，但它现在指向的已经不是当初学习的那个控件 —— 同文案按钮变多、列表增删导致位置错位，都可能是原因。`,
            nextActions: [
              scope.na,
              `展开账号详情，对比日志里的「期望指纹 / 实际指纹」，能看出站点把哪个字段改掉了`
            ]
          },
          [scope.Z.WORKFLOW_CONFIG]: {
            title: `已保存的学习流程配置不完整`,
            detail: `流程本身缺少必要环节（例如没有记录到能显示当前账号的资料页）。这不是登录状态失效，重试也不会变好。`,
            nextActions: [
              `在账号行点「学习本站流程」重录一遍：先访问能显示当前账号的个人资料页，再完成签到，最后点「结束学习」`,
              `若不想用录制流程：编辑本站，把签到方式切回「自动识别」`
            ]
          },
          [scope.Z.IDENTITY_ROUTE_UNREACHABLE]: {
            title: `没有到达账号核验页面`,
            detail: `自动登录或换号后，流程没能进入账号核验页，或在页面间反复跳转后停止。当前账号尚未核对，因此本轮没有继续签到。`,
            nextActions: [
              `展开账号详情，查看最后停留的页面，确认本站登录页和账号核验页地址能够正常打开`,
              `保留已保存的本站流程，重新执行一次，让换号后的流程从起点进入账号核验页`,
              `若每次都跳回登录页，核对该账号密码及站点登录状态`
            ]
          },
          [scope.Z.IDENTITY_UNCONFIRMED]: {
            title: `无法确认当前登录的是目标账号`,
            detail: `本轮没有取得足够且一致的身份信息，或自动换号后读到的仍是其他账号。扩展已停止签到，避免把结果记到错误账号。账号备注和第三方显示名不会覆盖已绑定的用户 ID。`,
            nextActions: [
              `展开账号详情，对照日志里的当前用户 ID、目标用户 ID 和最终核验原因`,
              `核对本账号保存的登录凭据；使用 GitHub 登录时，检查该账号的 GitHub 用户名或邮箱和密码`,
              `确认页面已完整加载后重新执行，扩展会使用已保存的本站流程重新登录和核对身份`
            ]
          },
          [scope.Z.IDENTITY_EVIDENCE_CONFLICT]: {
            title: `账号身份信息相互冲突`,
            detail: `当前身份响应或页面读到了不同的用户 ID，复核后仍无法唯一确定当前账号。扩展已停止签到，并保留本账号原有的用户 ID 绑定。`,
            nextActions: [
              `展开账号详情，查看冲突的用户 ID、目标用户 ID 以及它们的读取来源`,
              `等待页面加载完成后重新执行，继续使用已保存的本站流程重新读取身份`,
              `若冲突持续存在，核对本账号的登录凭据，并确认站点页面显示的是目标账号`
            ]
          },
          [scope.Z.AUTH_EXPIRED]: {
            title: `登录状态已失效`,
            detail: `站点不再认这个会话（cookie 过期、被别处登录顶下线，或站点主动清退了会话）。`,
            nextActions: [
              `直接再点一次执行，扩展会自动重新走登录`,
              `若反复失效，编辑账号核对密码是否仍然有效`
            ]
          },
          [scope.Z.SESSION_SWITCH_FAILED]: {
            title: `无法安全切换到目标账号`,
            detail: `站点 cookie 没清干净，或当前会话仍是别的账号。扩展在这里停下是故意的：确认不了身份就继续签到，会把奖励记到错账号上。`,
            nextActions: [
              `确认当前加载的是最新版扩展（需要 Cookie 权限），然后在扩展管理页点一次「重新加载」`,
              `展开账号详情，看 Log 里是「清理失败」还是「仍有残留」，两者处理方式不同`,
              `关掉该站点的其它标签页后重试 —— 活着的页面会不断重建会话`
            ]
          },
          [scope.Z.SITE_UNAVAILABLE]: {
            title: `站点暂时不可用`,
            detail: `站点源服务器返回了 5xx 或限流响应（网关错误、Cloudflare 源站故障）。这是站点侧的问题，与你的配置无关。`,
            nextActions: [
              `稍后重试，通常几分钟到几十分钟会自行恢复`,
              `确认在浏览器里直接打开该站点也是同样结果；如果你能打开、扩展不能，检查代理设置`
            ]
          },
          [scope.Z.SITE_REJECTED]: {
            title: `站点明确拒绝了这次操作`,
            detail: `这是站点的业务规则（余额不足、活动结束、账号被封禁、理由与历史重复等），不是网络或配置问题。重试结果不会变。`,
            nextActions: [
              `展开账号详情，读站点返回的原话，通常会说明具体原因`,
              `按站点提示处理后（例如换一条领取理由、补充余额）再重试`
            ]
          },
          [scope.Z.ACCESS_DENIED]: {
            title: `访问被站点拒绝（403）`,
            detail: `站点返回了 403 Forbidden。常见原因是出口 IP 所在地区被限制，或站点对你的 IP 做了风控拦截。`,
            nextActions: [
              `在账号行把代理换成与站点同地区的节点，再执行一次`,
              `确认该站点在浏览器里直接访问是否同样被拒；若直连正常，说明是代理出口被站点拉黑了`,
              `换一个浏览器配置（账号）访问对比，判断是站点风控还是账号问题`
            ]
          },
          [scope.Z.MANUAL_REQUIRED]: {
            title: `需要你在页面上完成一步`,
            detail: `站点弹出了验证码、滑块或二次验证，扩展不会替你绕过。任务会停在这里等你，不会自动跳过。`,
            nextActions: [
              `切到扩展打开的站点标签页，按页面提示完成验证`,
              `完成后回到扩展页，点该账号的「执行」继续；扩展会接着往下跑`
            ]
          },
          [scope.Z.NO_CHECKIN_ENTRY]: {
            title: `没找到可用的签到入口`,
            detail: `当前站点页面上没有可点击的签到控件，也没有能自动发现的签到入口链接。有的站点登录即算签到。`,
            nextActions: [
              `若该站点登录即算签到：编辑本站，把签到方式改为「登录即签到」`,
              `若签到入口在特定页面：编辑本站，手动指定签到页地址和按钮选择器`,
              scope.ra
            ]
          },
          [scope.Z.PAGE_TIMEOUT]: {
            title: `页面长时间没有加载出来`,
            detail: `等待页面或页面里的元素超时。可能是站点响应慢、网络/代理慢，或者页面把自己渲染成了空白。`,
            nextActions: [
              `在浏览器里直接打开该站点，确认页面本身能打开；打不开说明是站点或网络问题`,
              `若用了代理，换一个节点再试 —— 慢节点会让每个请求都吃满超时`,
              `展开账号详情，看日志停在「打开页面」还是「等待控件」，据此判断是页面没来还是控件没来`
            ]
          },
          [scope.Z.OBSCURED]: {
            title: `控件被弹窗挡住了`,
            detail: `页面上有公告或弹窗盖住了签到控件，扩展清完遮挡仍然点不到目标。`,
            nextActions: [
              `先手动把站点的公告/弹窗关掉，再重新执行一次`,
              `若每次都被同一个弹窗挡住：编辑本站，在「关闭弹窗选择器」里补上它的关闭按钮`,
              scope.ra
            ]
          },
          [scope.Z.CHECKIN_UNVERIFIED]: {
            title: `登录即签到尚未确认`,
            detail: `本站配置为「登录即签到」：登录本身就算签到，页面上没有签到按钮。这一轮打开页面时已经是登录状态，扩展没有重新登录，所以没有一次可以归到今天的登录动作；页面上也没有「已签到 / 签到成功」之类的完成提示。为了不给你一个无法核实的绿色对勾，扩展没有把它记成已完成。`,
            nextActions: [
              `切到本站标签页确认今天的额度/余额是否已经增加；增加了就在账号行手动标记完成`,
              `想每轮都强制拿到奖励：编辑本站，把签到方式改成「退出再登录」（配好退出接口或退出按钮），每轮都重新走一次登录`,
              `若本站其实是登录后仍需点一次签到按钮的站点：在账号行点「学习本站流程」重录一遍（先过一遍资料页再进签到页）`
            ]
          },
          [scope.Z.CHECKIN_NO_BASELINE]: {
            title: `已登录，但无法确认奖励到账`,
            detail: `本站配置为「登录即签到」，这一轮扩展已经完成登录。确认到账要对比登录前后的余额，但这个账号在本轮开始前 36 小时内没有一次成功读到的余额，没有可对比的基线；页面上也没有「已签到 / 签到成功」之类的完成提示。这次已经读到并保存了当前余额，下一轮就有基线可用。`,
            nextActions: [
              `切到本站标签页确认今天的额度/余额是否已经增加；增加了就在账号行手动标记完成`,
              `下一轮执行会用这次保存的余额做基线，通常不用额外处理；两次执行间隔不要超过 36 小时`,
              `若本站其实是登录后仍需点一次签到按钮的站点：在账号行点「学习本站流程」重录一遍（先过一遍资料页再进签到页）`
            ]
          },
          [scope.Z.CONTROL_DISABLED]: {
            title: `签到控件存在但当前不可点`,
            detail: `按钮在页面上，但处于禁用态。常见两种原因：站点还没把签到状态拉回来（渲染早于接口返回），或这个账号今天已经完成、被限制。`,
            nextActions: [
              `在浏览器里打开该签到页，看按钮旁边写了什么 —— 写着「今日已签到」就无需再处理`,
              `若页面上没有已完成字样：等一分钟再执行一次，站点状态接口回来后按钮通常会解禁`,
              `若长期禁用：在账号行点「学习本站流程」重录一遍，录下真正可点的那个控件`
            ]
          },
          [scope.Z.PROXY_UNREACHABLE]: {
            title: `本机代理端口没有程序在监听`,
            detail: `扩展把流量发到了本机代理端口，但那里没有任何程序接住它 —— 内核（Clash Verge / mihomo）没启动，或该节点的本地端口还没生效。`,
            nextActions: [
              `启动 Clash Verge（或其它内核），确认它正在运行且监听日志里能看到对应端口`,
              `在「代理管理」里重新同步 / 扫描本机出口，确认端口号是当前内核真实监听的那个`,
              `如果不用代理：编辑账号，把代理改为「不使用代理（直连）」`
            ]
          },
          [scope.Z.NETWORK_FAILURE]: {
            title: `网络请求失败`,
            detail: `请求没能到达站点：DNS 解析不了、出口不通、连接被重置，或请求超时。`,
            nextActions: [
              `检查本机网络与站点是否可达（在浏览器里直接打开一次）`,
              `账号配了代理时：去「代理管理」测一次该出口，不通就换节点`,
              `若只有这个站点失败，多半是站点侧或该出口被墙，换一个节点再试`
            ]
          },
          [scope.Z.ALREADY_DONE]: {
            title: `今天已经签到过了`,
            detail: `站点明确显示今日已完成。这不是失败，重复签到一般也不会再发奖励。`,
            nextActions: [
              `无需处理：这就是「今天已经签到」的结论，扩展已把该账号记为今日完成`,
              `若站点显示的不是你的账号，说明登录态串了 —— 重新执行一次，扩展会先核对身份`
            ]
          },
          [scope.Z.UNKNOWN]: {
            title: `没能归类的失败`,
            detail: `日志里的线索不足以判断属于哪一类。`,
            nextActions: [
              `展开账号详情，把最后几步日志读完 —— 关键线索通常在最后两行`,
              `若仍看不出原因，去站点编辑里核对登录页和签到页地址是否还正确`
            ]
          }
        };
        break;
      }
      case 10: {
        scope.oa = [
          {
            code: scope.Z.IDENTITY_EVIDENCE_CONFLICT,
            patterns: [/身份证据冲突/, /不同用户\s*ID/i]
          },
          {
            code: scope.Z.ALREADY_DONE,
            patterns: [
              /(?:今日|今天)[^，。；\n]{0,12}已(?:经)?签到/,
              /已(?:经)?签到[^，。；\n]{0,8}(?:无需|不用|不必)/,
              /(?:变为|变成|标记为|确认)今日已完成/,
              /今日签到已完成/
            ]
          },
          { code: scope.Z.CHECKIN_NO_BASELINE, patterns: [/本轮已登录，但没有签到动作可确认/] },
          {
            code: scope.Z.CHECKIN_UNVERIFIED,
            patterns: [
              /没有签到动作可确认/,
              /无法确认「登录即签到」/,
              /无法把「登录即签到」归因到本轮/
            ]
          },
          {
            code: scope.Z.WORKFLOW_CONFIG,
            patterns: [
              /学习签到路线缺少身份核验页/,
              /学习签到流程没有记录到可核验账号的身份页/,
              /工作流没有配置任何步骤/,
              /学到的流程未通过校验/
            ]
          },
          {
            code: scope.Z.IDENTITY_ROUTE_UNREACHABLE,
            patterns: [
              /身份核验页(?:无法|未能|仍未)(?:到达|进入)/,
              /跳转(?:预算|次数|限制)[^，。；\n]{0,20}(?:用尽|耗尽|达到上限)/,
              /已达到(?:页面)?跳转(?:次数)?(?:上限|限制)/
            ]
          },
          {
            code: scope.Z.IDENTITY_UNCONFIRMED,
            patterns: [
              /登录身份核验未通过/,
              /Token 身份(?:尚未|未能)确认/,
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
            code: scope.Z.MANUAL_REQUIRED,
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
            code: scope.Z.ELEMENT_MISMATCH,
            patterns: [/指纹失配/, /命中了错误的元素/, /命中的元素不符/]
          },
          {
            code: scope.Z.PROXY_UNREACHABLE,
            patterns: [/没有程序在监听/, /端口.{0,12}没人监听/, /没有任何程序接住/]
          },
          {
            code: scope.Z.SESSION_SWITCH_FAILED,
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
            code: scope.Z.AUTH_EXPIRED,
            patterns: [/登录态/, /未登录/, /凭据有误/, /401/, /登录失效/, /重新登录/]
          },
          {
            code: scope.Z.ACCESS_DENIED,
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
            code: scope.Z.SITE_REJECTED,
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
            code: scope.Z.SITE_UNAVAILABLE,
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
            code: scope.Z.OBSCURED,
            patterns: [/遮挡/, /被盖住/, /挡住了.*(?:按钮|控件|元素)/, /未关闭的公告/]
          },
          {
            code: scope.Z.PAGE_TIMEOUT,
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
            code: scope.Z.CONTROL_DISABLED,
            patterns: [
              /按钮(?:当前)?(?:已|处于)?禁用/,
              /控件(?:当前)?不可点/,
              /按钮不可点/,
              /disabled.{0,12}(?:without|no)\s+.{0,12}(?:already|success)/i
            ]
          },
          {
            code: scope.Z.NETWORK_FAILURE,
            patterns: [/网络/, /代理/, /dns/i, /连接被/, /err_/i, /timeout/i, /超时/]
          },
          {
            code: scope.Z.NO_CHECKIN_ENTRY,
            patterns: [/未自动发现同源签到入口/, /没有可点元素/, /不支持自动签到/]
          },
          {
            code: scope.Z.SELECTOR_MISMATCH,
            patterns: [/找不到/, /未找到/, /当前页没有/, /选择器/, /未命中/]
          }
        ];
        break;
      }
      case 11: {
        scope.sa = [
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
        break;
      }
    }
  },
  storeProperties: {
    store_Li_saveBalance(scope) {
      return {
        async saveBalance(e, t) {
          return (0, scope.X)(async () => {
            let n = await scope.z.get(scope.M.balances, {}), r = n[e], i = t.symbol ?? r?.symbol, a = i ? { ...t, symbol: i } : t, o = { ...r ?? {}, ...a, daily: (0, scope.Tr)(r, a) };
            delete o.error, await scope.z.set(scope.M.balances, { ...n, [e]: o });
          });
        }
      };
    },
    store_Li_saveCheckinReward(scope) {
      return {
        async saveCheckinReward(e, t, n, r = Date.now(), i) {
          return (0, scope.X)(async () => {
            let a = await scope.z.get(scope.M.balances, {}), o = a[e], s = o ?? { quota: 0, usedQuota: 0, at: r, error: `余额尚未读取` }, c2 = i ?? (o?.checkinRewardDay === n && o.checkinReward === t ? o.checkinRewardSymbol : void 0), l = {
              ...s,
              checkinReward: t,
              checkinRewardDay: n,
              checkinRewardAt: r,
              daily: (0, scope.Er)(s.daily, n, t, r, void 0, c2)
            };
            c2 ? l.checkinRewardSymbol = c2 : delete l.checkinRewardSymbol, await scope.z.set(scope.M.balances, { ...a, [e]: l });
          });
        }
      };
    },
    store_Li_clearBalance(scope) {
      return {
        async clearBalance(e) {
          return (0, scope.X)(async () => {
            let t = await scope.z.get(scope.M.balances, {});
            if (!(e in t)) return;
            let n = { ...t };
            delete n[e], await scope.z.set(scope.M.balances, n);
          });
        }
      };
    },
    store_Li_saveBalanceError(scope) {
      return {
        async saveBalanceError(e, t) {
          return (0, scope.X)(async () => {
            let n = await scope.z.get(scope.M.balances, {}), r = n[e];
            await scope.z.set(scope.M.balances, {
              ...n,
              [e]: {
                ...r ?? {},
                quota: r?.quota ?? 0,
                usedQuota: r?.usedQuota ?? 0,
                at: Date.now(),
                error: t
              }
            });
          });
        }
      };
    },
    store_Ui_resultOf(scope, e, t) {
      return {
        resultOf(e2) {
          return t().results[e2];
        }
      };
    },
    store_Ui_balanceOf(scope, e, t) {
      return {
        balanceOf(e2) {
          return t().balances[e2];
        }
      };
    },
    store_Ui_refreshBalances(scope, e, t) {
      return {
        async refreshBalances(n) {
          if (n.length === 0) return { refreshed: 0, failed: 0 };
          e({ refreshingBalances: /* @__PURE__ */ new Set([...t().refreshingBalances, ...n]) });
          try {
            let e2 = await (0, scope.H)({ type: `REFRESH_BALANCE`, accountIds: n });
            if (!e2.ok) throw Error(e2.error);
            return await t().load(), { refreshed: e2.feature?.refreshed ?? 0, failed: e2.feature?.failed ?? 0 };
          } finally {
            let r = new Set(t().refreshingBalances);
            for (let e2 of n) r.delete(e2);
            e({ refreshingBalances: r });
          }
        }
      };
    }
  }
});

// src/modules/proxies/view.js
var ProxyManagementView;
var AccountProxyEditor;
var BatchProxyAssignment;
var SubscriptionImportPanel;
var sharedUiRuntime5 = createUiModuleRuntime({
  bindingNames: [
    "wd",
    "Td",
    "$",
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
    "Wp",
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
    "Em"
  ],
  publish(name, value) {
    switch (name) {
      case "Em":
        ProxyManagementView = value;
        break;
      case "_p":
        AccountProxyEditor = value;
        break;
      case "Ap":
        BatchProxyAssignment = value;
        break;
      case "Cm":
        SubscriptionImportPanel = value;
        break;
    }
  },
  register(scope) {
    scope.wd = function wd(e, t, n) {
      let r = e.proxyMode ?? `inherit`;
      if (r === `none`) return { kind: `direct` };
      if (r === `custom`) {
        let t2 = e.customProxy;
        return !t2?.host || !t2.port ? { kind: `invalid`, label: `自定义代理未填完` } : { kind: `proxy`, label: `${t2.host}:${t2.port}`, inherited: false };
      }
      let i = r === `pool` ? e.proxyId : t.proxyId;
      if (!i)
        return r === `pool` ? { kind: `invalid`, label: `未选择代理池节点` } : { kind: `direct` };
      let a = n.find((e2) => e2.id === i);
      return a ? (0, scope.xd)(a) ? { kind: `name-only`, label: a.name } : { kind: `proxy`, label: a.name || `${a.host}:${a.port}`, inherited: r === `inherit` } : { kind: `invalid`, label: `代理已被删除` };
    };
    scope.Td = function Td(e, t, n) {
      let r = e.proxyMode ?? `inherit`;
      if (r === `none`) return;
      if (r === `custom`) {
        let t2 = e.customProxy;
        return t2?.host && t2.port ? `${(0, scope.Cd)(t2)}://${t2.host}:${t2.port}` : void 0;
      }
      let i = r === `pool` ? e.proxyId : t.proxyId;
      if (!i) return;
      let a = n.find((e2) => e2.id === i);
      if (a && !(0, scope.xd)(a)) return `${(0, scope.Cd)(a)}://${a.host}:${a.port}`;
    };
    scope.$ = function $(...e) {
      return (0, scope.Qf)((0, scope.Dd)(e));
    };
    scope.tp = function tp(e) {
      return typeof e == `string` && Object.values(scope.nd).includes(e);
    };
    scope.np = function np(e) {
      return e === scope.td.SUB2API ? scope.nd.SUB2API : e === scope.td.VO_API_V2 ? scope.nd.VO_API_V2 : e && scope.ep.has(e) ? scope.nd.NEW_API : scope.nd.UNSUPPORTED;
    };
    scope.rp = function rp(e) {
      let t = e?.trim();
      if (t) return t.startsWith(`/`) ? t : `/${t}`;
    };
    scope.ip = function ip(e) {
      let t = e.adapter, n = (0, scope.tp)(t?.family) ? t.family : (0, scope.np)(t?.siteType), r = t && Object.prototype.hasOwnProperty.call(t, `checkinPath`) ? (0, scope.rp)(t?.checkinPath) : scope.$f[n].checkinPath, i = (t?.checkin?.pathPatterns ?? []).map((e2) => (0, scope.rp)(e2.replace(/\*$/, ``))).filter((e2) => !!e2), a = (t?.checkin?.titleWords ?? []).map((e2) => e2.trim()).filter(Boolean);
      return {
        family: n,
        ...t?.siteType ? { siteType: t.siteType } : {},
        ...r ? { checkinPath: r } : {},
        checkinPathPatterns: i,
        checkinTitleWords: a
      };
    };
    scope.sp = function sp(e) {
      let t = e.replace(/^\uFEFF/, ``).split(/\r?\n/), n = (0, scope.cp)(t, `listeners`), r = (0, scope.cp)(t, `proxies`), i = (0, scope.cp)(t, `proxy-groups`), a = new Set(r.map((e2) => e2.name?.trim()).filter(Boolean)), o = new Set([...a].filter(scope.fp)), s = new Set([...a].filter((e2) => !o.has(e2))), c2 = new Set(i.map((e2) => e2.name?.trim()).filter(Boolean)), l = r.length > 0, u = [], d = /* @__PURE__ */ new Set(), f2 = /* @__PURE__ */ new Set(), p = 0, m = 0, h = 0;
      for (let e2 of n) {
        let t2 = scope.op[e2.type?.toLowerCase() ?? ``], n2 = Number(e2.port), r2 = e2.proxy?.trim();
        if (!t2 || !r2 || !Number.isInteger(n2) || n2 <= 0 || n2 > 65535) {
          p += 1;
          continue;
        }
        let i2 = `${t2}:${n2}`;
        if (f2.has(i2)) p += 1;
        else {
          if (f2.add(i2), l) {
            if (o.has(r2)) {
              p += 1;
              continue;
            }
            if (c2.has(r2)) {
              m += 1, p += 1;
              continue;
            }
            if (!s.has(r2)) {
              h += 1, p += 1;
              continue;
            }
            if (d.has(r2)) {
              p += 1;
              continue;
            }
            d.add(r2);
          }
          u.push({ name: r2, scheme: t2, host: `127.0.0.1`, port: n2, sourceLabel: `Clash Verge` });
        }
      }
      return {
        nodes: u,
        skipped: p,
        catalog: {
          detected: l,
          totalEntries: a.size,
          realNodes: s.size,
          noticeEntries: o.size,
          fixedNodes: l ? d.size : u.length,
          missingListenerNames: l ? [...s].filter((e2) => !d.has(e2)) : [],
          groupListeners: m,
          staleListeners: h
        }
      };
    };
    scope.cp = function cp(e, t) {
      let n = [], r = null, i = false, a = RegExp(`^${(0, scope.pp)(t)}\\s*:\\s*(?:#.*)?$`), o = () => {
        r && n.push(r), r = null;
      };
      for (let t2 of e) {
        if (!i) {
          a.test(t2) && (i = true);
          continue;
        }
        if (/^[^\s#-][^:]*\s*:/.test(t2)) {
          o();
          break;
        }
        let e2 = /^\s*-\s*(.*?)\s*$/.exec(t2);
        if (e2) {
          o();
          let t3 = e2[1].trim(), n3 = /^([\w-]+)\s*:\s*(.*?)\s*$/.exec(t3);
          n3 ? (r = {}, r[n3[1]] = (0, scope.mp)(n3[2])) : r = t3.startsWith(`{`) && t3.endsWith(`}`) ? (0, scope.lp)(t3) : null;
          continue;
        }
        let n2 = /^\s+([\w-]+)\s*:\s*(.*?)\s*$/.exec(t2);
        r && n2 && (r[n2[1]] = (0, scope.mp)(n2[2]));
      }
      return i && o(), n;
    };
    scope.lp = function lp(e) {
      let t = e.trim().slice(1, -1), n = {};
      for (let e2 of (0, scope.up)(t)) {
        let t2 = (0, scope.dp)(e2);
        if (t2 < 0) continue;
        let r = e2.slice(0, t2).trim();
        /^[\w-]+$/.test(r) && (n[r] = (0, scope.mp)(e2.slice(t2 + 1)));
      }
      return n;
    };
    scope.up = function up(e) {
      let t = [], n = 0, r = ``, i = false, a = 0;
      for (let o = 0; o < e.length; o += 1) {
        let s = e[o];
        if (r) {
          if (r === `"` && s === `\\` && !i) {
            i = true;
            continue;
          }
          s === r && !i && (r = ``), i = false;
        } else
          s === `"` || s === `'` ? r = s : s === `{` || s === `[` ? a += 1 : s === `}` || s === `]` ? a = Math.max(0, a - 1) : s === `,` && a === 0 && (t.push(e.slice(n, o)), n = o + 1);
      }
      return t.push(e.slice(n)), t;
    };
    scope.dp = function dp(e) {
      let t = ``, n = false, r = 0;
      for (let i = 0; i < e.length; i += 1) {
        let a = e[i];
        if (t) {
          if (t === `"` && a === `\\` && !n) {
            n = true;
            continue;
          }
          a === t && !n && (t = ``), n = false;
        } else if (a === `"` || a === `'`) t = a;
        else if (a === `{` || a === `[`) r += 1;
        else if (a === `}` || a === `]`) r = Math.max(0, r - 1);
        else if (a === `:` && r === 0) return i;
      }
      return -1;
    };
    scope.fp = function fp(e) {
      let t = e.trim();
      return /^(?:剩余流量|距离下次重置|套餐到期|有超过.*节点|每次使用前更新订阅|电报群|防失联)/u.test(
        t
      ) || /^(?:remaining\s+traffic|traffic\s+remaining|reset\s+in|expires?\s+(?:in|at|on))/iu.test(t);
    };
    scope.pp = function pp(e) {
      return e.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    };
    scope.mp = function mp(e) {
      let t = (0, scope.hp)(e.trim()).trim(), n = /^(['"])([\s\S]*)\1$/.exec(t);
      return n ? n[1] === `'` ? n[2].replace(/''/g, `'`) : n[2].replace(/\\"/g, `"`).replace(/\\\\/g, `\\`) : t;
    };
    scope.hp = function hp(e) {
      let t = ``;
      for (let n = 0; n < e.length; n += 1) {
        let r = e[n];
        if ((r === `"` || r === `'`) && e[n - 1] !== `\\`) t = t === r ? `` : t || r;
        else if (r === `#` && !t && (n === 0 || /\s/.test(e[n - 1]))) return e.slice(0, n);
      }
      return e;
    };
    scope.gp = function gp(e) {
      let t = e.length;
      if (!t)
        return {
          kind: `no-local-ports`,
          title: `代理池里没有本机端口条目`,
          hint: `先在导入页粘贴订阅并生成 listeners 配置。`,
          passed: 0,
          total: 0
        };
      let n = e.filter((e2) => e2.test.ok).length;
      if (n === t) return { kind: `ok`, title: `${t} 个端口全部连通`, passed: n, total: t };
      let r = e.filter((e2) => e2.probe === `closed`), i = e.filter((e2) => e2.probe === `listening` && !e2.test.ok);
      if (n === 0 && r.length === t)
        return {
          kind: `listener-missing`,
          title: `${t} 个端口没有一个在监听`,
          hint: `说明 Clash Verge 还没用上这份配置:确认已「复制自动更新脚本」并且粘进了对应订阅的扩展配置 → Script,然后重载内核。若刚重载过,再等几秒。`,
          passed: n,
          total: t
        };
      if (n === 0 && i.length === t)
        return {
          kind: `node-mismatch`,
          title: `${t} 个端口都在监听,但全部连不通`,
          hint: `端口本身是好的,失败在节点这一层。最常见的原因是 Clash Verge 当前激活的订阅不是生成脚本时用的那一份(节点名对不上会被内核拒绝),或这些节点确实已失效。先在「全部节点」逐个测活,并确认 Verge 里激活的是飞鸟云订阅。`,
          passed: n,
          total: t
        };
      let a = r.length ? `${r.length} 个端口没人监听` : ``, o = i.length ? `${i.length} 个端口在监听但连不通` : ``, s = t - n - r.length - i.length;
      return {
        kind: `partial`,
        title: `${n}/${t} 个端口连通`,
        hint: [
          a && `${a}(脚本可能只生效了一部分,重载一次内核试试)`,
          o && `${o}(节点失效或名字对不上)`,
          s > 0 && `${s} 个非本机端口无法用这种方式判断`
        ].filter(Boolean).join(`;`) || `对失败项逐个排查。`,
        passed: n,
        total: t
      };
    };
    scope._p = function _p({
      open: e,
      initialProxyId: t,
      proxies: n,
      accounts: r,
      sites: i,
      onAssign: a,
      onSetAccountProxy: o,
      onShowImport: s,
      disabled: c2 = false,
      onBusyChange: l,
      onProxyChange: u
    }) {
      let f2 = (0, scope.k.useMemo)(() => n.filter((e2) => !(0, scope.xd)(e2)), [n]), [p, g] = (0, scope.k.useState)(t ?? ``), [_, v2] = (0, scope.k.useState)(/* @__PURE__ */ new Set()), [y, b] = (0, scope.k.useState)(``), [x, S] = (0, scope.k.useState)(false), [C2, w2] = (0, scope.k.useState)(null), [T, E] = (0, scope.k.useState)(null), ee = (0, scope.k.useRef)(false), D = c2 || x || C2 !== null;
      (0, scope.k.useEffect)(() => {
        e && g(t ?? ``);
      }, [e, t]), (0, scope.k.useEffect)(() => {
        e && (v2(/* @__PURE__ */ new Set()), b(``), E(null));
      }, [e]), (0, scope.k.useEffect)(() => {
        E(null);
      }, [p]);
      let A = f2.find((e2) => e2.id === p), j = (0, scope.k.useMemo)(() => new Map(i.map((e2) => [e2.id, e2])), [i]), M = r.filter((e2) => {
        let t2 = j.get(e2.siteId);
        return !y.trim() || `${e2.username} ${e2.label ?? ``} ${t2?.name ?? ``}`.toLowerCase().includes(y.trim().toLowerCase());
      }), N = r.filter((e2) => _.has(e2.id)), P = M.length > 0 && M.every((e2) => _.has(e2.id)), ne = /* @__PURE__ */ new Map();
      for (let e2 of M) {
        let t2 = ne.get(e2.siteId) ?? {
          siteId: e2.siteId,
          siteName: j.get(e2.siteId)?.name ?? `未知站点`,
          accounts: []
        };
        t2.accounts.push(e2), ne.set(e2.siteId, t2);
      }
      let re = [...ne.values()];
      function ie(e2) {
        E(null), v2((t2) => {
          let n2 = new Set(t2);
          return n2.has(e2) ? n2.delete(e2) : n2.add(e2), n2;
        });
      }
      function ae() {
        E(null), v2((e2) => {
          let t2 = new Set(e2);
          for (let e3 of M) P ? t2.delete(e3.id) : t2.add(e3.id);
          return t2;
        });
      }
      async function F() {
        if (c2 || !A || ee.current || !_.size) return;
        let e2 = N.map((e3) => ({ accountId: e3.id, proxyId: A.id, pinned: true }));
        if (e2.length) {
          ee.current = true, S(true), l?.(true), E(null);
          try {
            let t2 = await a(e2);
            v2(/* @__PURE__ */ new Set()), E({ text: `已为 ${t2} 个账号绑定到“${A.name}”。` });
          } catch (e3) {
            E({ text: e3 instanceof Error ? e3.message : `保存失败，请重试。`, error: true });
          } finally {
            ee.current = false, S(false), l?.(false);
          }
        }
      }
      async function I(e2) {
        if (!(c2 || ee.current)) {
          ee.current = true, w2(e2.id), l?.(true), E(null);
          try {
            await o(e2.id, { proxyMode: `inherit` }), E({ text: `${e2.label || e2.username} 已取消绑定，将跟随站点设置。` });
          } catch (e3) {
            E({ text: e3 instanceof Error ? e3.message : `取消绑定失败，请重试。`, error: true });
          } finally {
            ee.current = false, w2(null), l?.(false);
          }
        }
      }
      return r.length ? (0, scope.O.jsxs)(`div`, {
        children: [
          (0, scope.O.jsxs)(`div`, {
            className: `grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]`,
            children: [
              (0, scope.O.jsxs)(`label`, {
                className: `block min-w-0 space-y-1.5`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `text-xs font-medium text-slate-600 dark:text-slate-300`,
                    children: `绑定到`
                  }),
                  (0, scope.O.jsxs)(`select`, {
                    value: A?.id ?? ``,
                    onChange: (e2) => {
                      g(e2.target.value), u?.(e2.target.value);
                    },
                    disabled: D || !f2.length,
                    "aria-label": `选择绑定代理`,
                    className: `h-9 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-[13px] outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900`,
                    children: [
                      (0, scope.O.jsx)(`option`, {
                        value: ``,
                        children: f2.length ? `选择代理` : `暂无代理`
                      }),
                      f2.map(
                        (e2) => (0, scope.O.jsxs)(
                          `option`,
                          {
                            value: e2.id,
                            children: [
                              e2.name,
                              ` · `,
                              (0, scope.Cd)(e2),
                              `://`,
                              e2.host,
                              `:`,
                              e2.port
                            ]
                          },
                          e2.id
                        )
                      )
                    ]
                  })
                ]
              }),
              (0, scope.O.jsxs)(`label`, {
                className: `block min-w-0 space-y-1.5`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `text-xs font-medium text-slate-600 dark:text-slate-300`,
                    children: `查找账号`
                  }),
                  (0, scope.O.jsxs)(`span`, {
                    className: `relative block`,
                    children: [
                      (0, scope.O.jsx)(scope.d, {
                        className: `pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400`
                      }),
                      (0, scope.O.jsx)(`input`, {
                        value: y,
                        onChange: (e2) => b(e2.target.value),
                        disabled: D,
                        "aria-label": `搜索绑定账号`,
                        placeholder: `账号或站点名称`,
                        className: `h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[13px] outline-none placeholder:text-slate-400 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900`
                      })
                    ]
                  })
                ]
              })
            ]
          }),
          !f2.length && (0, scope.O.jsxs)(`p`, {
            className: `px-4 pb-3 text-xs text-slate-500 dark:text-slate-400`,
            children: [
              `尚无可绑定的代理。`,
              (0, scope.O.jsx)(`button`, {
                type: `button`,
                onClick: s,
                disabled: D,
                className: `ml-1 font-medium text-blue-600 hover:underline disabled:opacity-40 dark:text-blue-400`,
                children: `去添加代理`
              })
            ]
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_2.5rem] items-center gap-2 border-y border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400`,
            children: [
              (0, scope.O.jsxs)(`label`, {
                className: `flex cursor-pointer items-center gap-2.5`,
                children: [
                  (0, scope.O.jsx)(`input`, {
                    type: `checkbox`,
                    "aria-label": `全选当前结果`,
                    className: `size-4 shrink-0 accent-blue-600`,
                    checked: P,
                    onChange: ae,
                    disabled: D || !M.length
                  }),
                  `账号`
                ]
              }),
              (0, scope.O.jsx)(`span`, { children: `当前代理` }),
              (0, scope.O.jsx)(`span`, { className: `text-right`, children: `操作` })
            ]
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `max-h-[28rem] overflow-y-auto xl:max-h-[clamp(12rem,calc(100dvh_-_42rem),28rem)]`,
            children: [
              re.map(
                (e2) => (0, scope.O.jsxs)(
                  `section`,
                  {
                    "aria-label": e2.siteName,
                    children: [
                      (0, scope.O.jsxs)(`header`, {
                        className: `sticky top-0 z-10 flex items-center gap-1.5 border-b border-slate-100 bg-slate-50/95 px-4 py-2 text-xs text-slate-500 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-400`,
                        children: [
                          (0, scope.O.jsx)(scope.te, { className: `size-3.5 shrink-0` }),
                          (0, scope.O.jsx)(`strong`, {
                            className: `min-w-0 flex-1 truncate font-medium`,
                            children: e2.siteName
                          }),
                          (0, scope.O.jsxs)(`span`, {
                            children: [e2.accounts.length, ` 个账号`]
                          })
                        ]
                      }),
                      e2.accounts.map((e3) => {
                        let t2 = (0, scope.wd)(e3, j.get(e3.siteId) ?? {}, n), r2 = t2.kind === `direct` ? `直连` : t2.kind === `name-only` ? `${t2.label}（缺少地址）` : t2.label, i2 = t2.kind === `proxy` && t2.inherited ? `跟随站点` : e3.proxyMode === `pool` ? e3.proxyPinned ? `手动绑定` : `自动分配` : ``, a2 = _.has(e3.id), o2 = C2 === e3.id;
                        return (0, scope.O.jsxs)(
                          `div`,
                          {
                            className: `grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_2.5rem] items-center gap-2 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-slate-800 ${a2 ? `bg-blue-50/70 dark:bg-blue-950/25` : `hover:bg-slate-50/70 dark:hover:bg-slate-900/40`}`,
                            children: [
                              (0, scope.O.jsxs)(`label`, {
                                className: `flex min-w-0 cursor-pointer items-center gap-2.5`,
                                children: [
                                  (0, scope.O.jsx)(`input`, {
                                    type: `checkbox`,
                                    className: `size-4 shrink-0 accent-blue-600`,
                                    checked: a2,
                                    onChange: () => ie(e3.id),
                                    disabled: D,
                                    "aria-label": `选择 ${e3.label || e3.username}`
                                  }),
                                  (0, scope.O.jsxs)(`span`, {
                                    className: `min-w-0`,
                                    children: [
                                      (0, scope.O.jsx)(`strong`, {
                                        title: e3.label || e3.username,
                                        className: `block truncate text-[13px] font-medium`,
                                        children: e3.label || e3.username
                                      }),
                                      e3.label && (0, scope.O.jsx)(`span`, {
                                        title: e3.username,
                                        className: `mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400`,
                                        children: e3.username
                                      })
                                    ]
                                  })
                                ]
                              }),
                              (0, scope.O.jsxs)(`span`, {
                                className: `min-w-0`,
                                children: [
                                  (0, scope.O.jsx)(`span`, {
                                    title: r2,
                                    className: `block truncate text-[13px] ${t2.kind === `invalid` || t2.kind === `name-only` ? `text-amber-700 dark:text-amber-300` : `text-slate-600 dark:text-slate-300`}`,
                                    children: r2
                                  }),
                                  i2 && (0, scope.O.jsx)(`span`, {
                                    className: `mt-0.5 block text-xs text-slate-500 dark:text-slate-400`,
                                    children: i2
                                  })
                                ]
                              }),
                              e3.proxyMode === `pool` && e3.proxyId ? (0, scope.O.jsx)(`button`, {
                                type: `button`,
                                onClick: () => void I(e3),
                                disabled: D,
                                "aria-label": `取消 ${e3.label || e3.username} 的绑定`,
                                className: `h-8 rounded-md text-right text-xs text-slate-500 hover:text-blue-600 disabled:opacity-40 dark:text-slate-400 dark:hover:text-blue-300`,
                                children: o2 ? (0, scope.O.jsx)(scope.m, {
                                  className: `ml-auto size-3.5 animate-spin`
                                }) : `解绑`
                              }) : (0, scope.O.jsx)(`span`, {
                                className: `text-right text-xs text-slate-300 dark:text-slate-600`,
                                children: `—`
                              })
                            ]
                          },
                          e3.id
                        );
                      })
                    ]
                  },
                  e2.siteId
                )
              ),
              !re.length && (0, scope.O.jsx)(`p`, {
                className: `px-4 py-10 text-center text-[13px] text-slate-500 dark:text-slate-400`,
                children: `没有匹配的账号。`
              })
            ]
          }),
          (0, scope.O.jsxs)(`footer`, {
            className: `flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40`,
            children: [
              (0, scope.O.jsxs)(`div`, {
                className: `min-w-0 text-xs text-slate-500 dark:text-slate-400`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    children: N.length ? `已选 ${N.length} 个账号` : `勾选要绑定的账号`
                  }),
                  N.length > 0 && !A && (0, scope.O.jsx)(`span`, {
                    className: `ml-2 text-amber-700 dark:text-amber-300`,
                    children: `请选择目标代理`
                  })
                ]
              }),
              (0, scope.O.jsxs)(`button`, {
                type: `button`,
                disabled: D || !A || !N.length,
                onClick: () => void F(),
                className: `inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-[13px] font-medium text-white hover:bg-blue-700 disabled:opacity-40`,
                children: [
                  x ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` }) : (0, scope.O.jsx)(scope.h, { className: `size-3.5` }),
                  x ? `保存中…` : `保存绑定`
                ]
              })
            ]
          }),
          T && (0, scope.O.jsx)(`p`, {
            role: T.error ? `alert` : `status`,
            className: `border-t border-slate-100 px-4 py-3 text-[13px] dark:border-slate-800 ${T.error ? `text-rose-600 dark:text-rose-400` : `text-emerald-700 dark:text-emerald-400`}`,
            children: T.text
          })
        ]
      }) : (0, scope.O.jsx)(`p`, {
        className: `px-4 py-12 text-center text-[13px] text-slate-500 dark:text-slate-400`,
        children: `还没有账号，添加账号后即可分配代理。`
      });
    };
    scope.vp = function vp(e) {
      let t = e.proxyMode ?? `inherit`;
      return t === `pool` ? !!e.proxyId && e.proxyPinned === true : t === `custom` || t === `none`;
    };
    scope.yp = function yp(e, t, n = `unassigned`) {
      if (!t.length) return { assignments: [], skipped: 0, unusedProxies: 0 };
      let r = n === `all` ? [...e] : e.filter((e2) => !(0, scope.vp)(e2));
      return {
        assignments: r.map((e2, n2) => ({ accountId: e2.id, proxyId: t[n2 % t.length] })),
        skipped: e.length - r.length,
        unusedProxies: Math.max(0, t.length - r.length)
      };
    };
    scope.Sp = function Sp(e) {
      let t = e.trim();
      if (!t) return { ...scope.xp };
      for (let e2 of [0, 1])
        for (let n of scope.bp) {
          let r = n.patterns[e2];
          if (r && r.test(t)) return { key: n.key, label: n.label };
        }
      return { ...scope.xp };
    };
    scope.Cp = function Cp(e, t) {
      let n = /* @__PURE__ */ new Map();
      for (let r of e) {
        let e2 = (0, scope.Sp)(t(r)), i = n.get(e2.key);
        i ? i.items.push(r) : n.set(e2.key, { key: e2.key, label: e2.label, items: [r] });
      }
      return [...n.values()].sort(
        (e2, t2) => e2.key === scope.xp.key ? 1 : t2.key === scope.xp.key ? -1 : t2.items.length - e2.items.length || e2.label.localeCompare(t2.label, `zh-Hans-CN`)
      );
    };
    scope.wp = function wp(e, t, n) {
      let r = /* @__PURE__ */ new Map();
      for (let e2 of t)
        n.has(e2.id) || (e2.proxyMode ?? `inherit`) === `pool` && e2.proxyId && r.set(e2.proxyId, (r.get(e2.proxyId) ?? 0) + 1);
      let i = /* @__PURE__ */ new Map(), a = [];
      return e.filter((e2) => !(0, scope.xd)(e2)).forEach((e2, t2) => {
        let n2 = { id: e2.id, used: r.get(e2.id) ?? 0, order: t2 };
        a.push(n2);
        let o = (0, scope.Sp)(e2.name).key, s = i.get(o);
        s ? s.push(n2) : i.set(o, [n2]);
      }), { byRegion: i, all: a };
    };
    scope.Tp = function Tp(e) {
      return e.reduce(
        (e2, t) => !e2 || t.used < e2.used || t.used === e2.used && t.order < e2.order ? t : e2,
        void 0
      );
    };
    scope.Ep = function Ep(e, t, n) {
      let r = (0, scope.Tp)(e.byRegion.get(t) ?? []);
      if (r) return { candidate: r, crossRegion: false };
      if (!n) return;
      let i = (0, scope.Tp)(e.all);
      return i ? { candidate: i, crossRegion: true } : void 0;
    };
    scope.Dp = function Dp(e, t) {
      let n = new Map(t.map((e2) => [e2.id, e2]));
      return e.filter((e2) => {
        if ((e2.proxyMode ?? `inherit`) !== `pool` || !e2.proxyId) return false;
        let t2 = n.get(e2.proxyId);
        return !!t2 && (0, scope.xd)(t2);
      });
    };
    scope.Op = function Op(e, t, n = true) {
      let r = new Map(t.map((e2) => [e2.id, e2])), i = (0, scope.Dp)(e, t);
      if (!i.length) return { assignments: [], crossRegion: 0, unresolved: [] };
      let a = (0, scope.wp)(t, e, new Set(i.map((e2) => e2.id))), o = [], s = [], c2 = 0;
      for (let e2 of i) {
        let t2 = r.get(e2.proxyId), i2 = (0, scope.Ep)(a, (0, scope.Sp)(t2.name).key, n);
        i2 ? (i2.crossRegion && (c2 += 1), i2.candidate.used += 1, o.push({ accountId: e2.id, proxyId: i2.candidate.id })) : s.push({ accountId: e2.id, proxyName: t2.name });
      }
      return { assignments: o, crossRegion: c2, unresolved: s };
    };
    scope.Ap = function Ap({
      proxies: e,
      pool: t,
      accounts: n,
      onAssign: r,
      disabled: i = false,
      onBusyChange: a,
      onTestProxy: o
    }) {
      let s = t ?? e, c2 = (0, scope.k.useMemo)(() => e.filter((e2) => !(0, scope.xd)(e2)), [e]), l = (0, scope.k.useRef)(false), [d, f2] = (0, scope.k.useState)(`unassigned`), [p, h] = (0, scope.k.useState)(false), [g, _] = (0, scope.k.useState)(null), [v2, y] = (0, scope.k.useState)(null), [b, x] = (0, scope.k.useState)(false), [S, C2] = (0, scope.k.useState)(null), w2 = (0, scope.yp)(
        n,
        c2.map((e2) => e2.id),
        d
      ).assignments.length, T = (0, scope.k.useMemo)(() => (0, scope.Dp)(n, s), [n, s]);
      async function E() {
        if (i || l.current) return;
        let e2 = (0, scope.Op)(n, s);
        if (!e2.assignments.length)
          C2(
            e2.unresolved.length ? `没有可匹配的代理，${e2.unresolved.length} 个账号尚未换绑。请先添加代理。` : `没有需要换绑的账号。`
          );
        else {
          l.current = true, x(true), a?.(true), C2(null);
          try {
            let t2 = await r(e2.assignments);
            C2(
              [
                `已把 ${t2} 个账号换到真实出口`,
                e2.crossRegion ? `其中 ${e2.crossRegion} 个只能跨区顶上（同地区没有可用出口），出口国家已改变` : ``,
                e2.unresolved.length ? `${e2.unresolved.length} 个账号尚未找到可匹配的代理` : ``
              ].filter(Boolean).join(` · `)
            );
          } catch (e3) {
            C2(e3 instanceof Error ? `换绑失败：${e3.message}` : `换绑失败，请重试。`);
          } finally {
            l.current = false, x(false), a?.(false);
          }
        }
      }
      async function ee() {
        if (!(i || !w2 || l.current)) {
          l.current = true, h(true), a?.(true), y(null);
          try {
            let e2 = [];
            for (let [t3, n2] of c2.entries())
              _(`测活 ${t3 + 1}/${c2.length} · ${n2.name}`), (o ? await o(n2) : await (0, scope.cd)({ type: `TEST_PROXY`, proxy: n2 }).then(
                (e3) => e3.ok && e3.test?.ok === true
              )) && e2.push(n2.id);
            if (_(null), !e2.length) {
              y(`池里 ${c2.length} 个已配置出口全部不通，没有写入任何绑定`);
              return;
            }
            let t2 = (0, scope.yp)(n, e2, d);
            if (!t2.assignments.length) {
              y(`所有账号均有手动代理设置，没有需要分配的账号`);
              return;
            }
            let i2 = await r(t2.assignments);
            y(
              [
                `已为 ${i2} 个账号绑定节点`,
                e2.length < c2.length ? `排除不通节点 ${c2.length - e2.length} 个` : ``,
                t2.skipped ? `保留手动设置 ${t2.skipped} 个` : ``,
                t2.unusedProxies ? `剩余未使用节点 ${t2.unusedProxies} 个` : ``
              ].filter(Boolean).join(` · `)
            );
          } catch (e2) {
            y(e2 instanceof Error ? `测活或分配失败：${e2.message}` : `测活或分配失败，请重试。`);
          } finally {
            l.current = false, _(null), h(false), a?.(false);
          }
        }
      }
      return (0, scope.O.jsxs)(`section`, {
        "aria-labelledby": `bulk-assign-heading`,
        className: `space-y-4 rounded-xl border border-blue-200 bg-white p-4 sm:p-5 dark:border-blue-900 dark:bg-slate-950`,
        children: [
          (0, scope.O.jsxs)(`div`, {
            className: `flex flex-wrap items-center justify-between gap-2`,
            children: [
              (0, scope.O.jsxs)(`h2`, {
                id: `bulk-assign-heading`,
                className: `flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100`,
                children: [
                  (0, scope.O.jsx)(scope.u, {
                    className: `size-4 text-blue-600 dark:text-blue-400`
                  }),
                  `批量分配`
                ]
              }),
              (0, scope.O.jsxs)(`span`, {
                className: `text-xs text-slate-500 dark:text-slate-400`,
                children: [c2.length, ` 个代理 · `, n.length, ` 个账号`]
              })
            ]
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_12rem]`,
            children: [
              (0, scope.O.jsxs)(`fieldset`, {
                className: `min-w-0`,
                disabled: i || p || b,
                children: [
                  (0, scope.O.jsx)(`legend`, {
                    className: `mb-2 text-xs font-medium text-slate-600 dark:text-slate-300`,
                    children: `分配方式`
                  }),
                  (0, scope.O.jsx)(`div`, {
                    className: `grid grid-cols-2 gap-2`,
                    children: scope.kp.map(
                      (e2) => (0, scope.O.jsxs)(
                        `label`,
                        {
                          className: (0, scope.$)(
                            `flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-[13px] transition-colors`,
                            d === e2.value ? `border-blue-400 bg-blue-50/70 text-blue-800 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-200` : `border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900`
                          ),
                          children: [
                            (0, scope.O.jsx)(`input`, {
                              type: `radio`,
                              name: `assign-mode`,
                              className: `mt-0.5 size-4 shrink-0 accent-blue-600`,
                              "aria-label": e2.label,
                              value: e2.value,
                              checked: d === e2.value,
                              disabled: i || p || b,
                              onChange: () => f2(e2.value)
                            }),
                            (0, scope.O.jsxs)(`span`, {
                              children: [
                                (0, scope.O.jsx)(`span`, {
                                  className: `block font-medium`,
                                  children: e2.label
                                }),
                                (0, scope.O.jsx)(`span`, {
                                  className: `mt-0.5 hidden text-xs leading-relaxed text-slate-500 sm:block dark:text-slate-400`,
                                  children: e2.hint
                                })
                              ]
                            })
                          ]
                        },
                        e2.value
                      )
                    )
                  }),
                  (0, scope.O.jsx)(`p`, {
                    className: `mt-2 text-xs leading-relaxed text-slate-500 sm:hidden dark:text-slate-400`,
                    children: scope.kp.find((e2) => e2.value === d)?.hint
                  })
                ]
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `space-y-2 lg:pt-6`,
                children: [
                  (0, scope.O.jsxs)(scope.Mu.button, {
                    whileTap: { scale: 0.98 },
                    type: `button`,
                    disabled: i || !w2 || p || b,
                    onClick: ee,
                    className: `flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-45`,
                    children: [
                      p ? (0, scope.O.jsx)(scope.m, { className: `size-4 animate-spin` }) : (0, scope.O.jsx)(scope.u, { className: `size-4` }),
                      p ? `正在测活并分配…` : `测活并分配`
                    ]
                  }),
                  (0, scope.O.jsxs)(`p`, {
                    className: `text-center text-xs text-slate-500 dark:text-slate-400`,
                    children: [`本次分配 `, w2, ` 个账号`]
                  })
                ]
              })
            ]
          }),
          (0, scope.O.jsx)(`p`, {
            className: `text-xs leading-relaxed text-slate-500 dark:text-slate-400`,
            children: `先检查连接，再把通过测活的代理按顺序分给账号；代理不足时循环使用。`
          }),
          g && (0, scope.O.jsx)(`p`, {
            role: `status`,
            className: `break-words rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`,
            children: g
          }),
          !c2.length && (0, scope.O.jsx)(`p`, {
            className: `text-xs text-amber-700 dark:text-amber-300`,
            children: `请先添加代理。`
          }),
          !!c2.length && !w2 && (0, scope.O.jsx)(`p`, {
            className: `text-xs text-slate-500 dark:text-slate-400`,
            children: n.length ? `当前账号均有手动设置。如需覆盖，请选择“全部重新分配”。` : `请先添加账号。`
          }),
          v2 && (0, scope.O.jsx)(`p`, {
            role: `status`,
            className: `rounded-lg bg-slate-50 px-3 py-2.5 text-[13px] leading-relaxed text-slate-700 dark:bg-slate-900 dark:text-slate-200`,
            children: v2
          }),
          T.length > 0 && (0, scope.O.jsxs)(`div`, {
            className: `space-y-2 rounded-lg bg-amber-50 p-2.5 ring-1 ring-amber-500/20 dark:bg-amber-950/30`,
            children: [
              (0, scope.O.jsxs)(`p`, {
                className: `text-[11px] leading-relaxed text-amber-800 dark:text-amber-200`,
                children: [T.length, ` 个账号绑定的节点缺少代理地址，可尝试匹配同地区的代理。`]
              }),
              (0, scope.O.jsxs)(scope.Mu.button, {
                whileTap: { scale: 0.98 },
                type: `button`,
                disabled: i || p || b,
                onClick: E,
                className: `flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-[11px] font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-40`,
                children: [
                  b ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` }) : (0, scope.O.jsx)(scope.ed, { className: `size-3.5` }),
                  b ? `换绑中...` : `换到同地区的真实出口（${T.length} 个）`
                ]
              })
            ]
          }),
          S && (0, scope.O.jsx)(`p`, {
            className: `rounded-lg bg-amber-50 p-2.5 text-[11px] leading-relaxed text-amber-800 ring-1 ring-amber-500/20 dark:bg-amber-950/30 dark:text-amber-200`,
            children: S
          })
        ]
      });
    };
    scope.jp = function jp({ onSync: e, onMissingNames: t }) {
      let n = (0, scope.k.useRef)(null), [r, i] = (0, scope.k.useState)(false), [a, o] = (0, scope.k.useState)(null);
      async function s(n2) {
        i(true), o(null), t?.([]);
        try {
          let r2 = (0, scope.sp)(await n2.text());
          if (!r2.nodes.length && !r2.catalog.missingListenerNames.length) {
            let e2 = r2.catalog.detected ? `已读到 ${r2.catalog.realNodes} 个真实节点，但` : ``;
            o({ ok: false, text: `${e2}没有节点配置独立 HTTP/SOCKS listener` });
            return;
          }
          t?.(r2.catalog.missingListenerNames);
          let i2 = r2.catalog.missingListenerNames.map((e2) => ({
            name: e2,
            scheme: `http`,
            host: `-`,
            port: 0,
            nameOnly: true,
            sourceLabel: `Clash Verge`
          })), a2 = await e(r2.nodes.concat(i2));
          if (r2.catalog.detected) {
            let e2 = [
              n2.name ? n2.name : ``,
              `真实节点 ${r2.catalog.realNodes}`,
              `可绑定 ${r2.catalog.fixedNodes}/${r2.catalog.realNodes}`,
              r2.catalog.missingListenerNames.length ? `缺 listener ${r2.catalog.missingListenerNames.length}` : ``,
              r2.catalog.groupListeners ? `忽略策略组 ${r2.catalog.groupListeners}` : ``,
              r2.catalog.staleListeners ? `忽略失效项 ${r2.catalog.staleListeners}` : ``,
              a2.removed ? `清理旧出口 ${a2.removed}` : ``,
              a2.keptInUse ? `保留仍在使用的旧出口 ${a2.keptInUse}（账号绑定不受影响）` : ``
            ].filter(Boolean);
            o({ ok: true, text: e2.join(` · `), missingNames: r2.catalog.missingListenerNames });
          } else
            o({
              ok: true,
              text: `同步 ${r2.nodes.length} 个固定出口${a2.keptInUse ? ` · 保留仍在使用的旧出口 ${a2.keptInUse}` : ``}`
            });
        } catch (e2) {
          o({
            ok: false,
            text: e2 instanceof Error ? `读取失败：${e2.message}` : `读取 Clash 配置失败`
          });
        } finally {
          i(false);
        }
      }
      return (0, scope.O.jsxs)(`div`, {
        className: `flex flex-col gap-3 rounded-lg border border-brand-200 bg-brand-50/60 p-3 sm:flex-row sm:items-center dark:border-brand-900/70 dark:bg-brand-950/20`,
        children: [
          (0, scope.O.jsx)(`span`, {
            className: `grid size-9 shrink-0 place-items-center rounded-lg bg-brand-500 text-white`,
            children: (0, scope.O.jsx)(scope.f, {
              className: (0, scope.$)(`size-4`, r && `animate-spin`)
            })
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `min-w-0 flex-1`,
            children: [
              (0, scope.O.jsx)(`p`, {
                className: `text-xs font-semibold text-ink-900 dark:text-ink-50`,
                children: `Clash Verge 固定节点`
              }),
              (0, scope.O.jsx)(`p`, {
                className: (0, scope.$)(
                  `mt-0.5 text-[10px] leading-relaxed`,
                  a?.ok === false ? `text-rose-600 dark:text-rose-400` : `text-ink-800/55 dark:text-ink-100/45`
                ),
                children: a?.text ?? `选择当前运行的 clash-verge.yaml；profiles 配置也能读取，缺少 listener 时会在下方生成配置`
              }),
              !a && (0, scope.O.jsx)(`p`, {
                className: `mt-1 break-all font-mono text-[10px] text-ink-800/40 dark:text-ink-100/30`,
                children: `%APPDATA%\\io.github.clash-verge-rev.clash-verge-rev\\clash-verge.yaml`
              }),
              a?.missingNames?.length ? (0, scope.O.jsxs)(`p`, {
                className: `mt-0.5 truncate text-[10px] text-amber-700 dark:text-amber-300`,
                title: a.missingNames.join(`、`),
                children: [`无固定端口：`, a.missingNames.join(`、`)]
              }) : null
            ]
          }),
          (0, scope.O.jsxs)(`button`, {
            type: `button`,
            disabled: r,
            onClick: () => n.current?.click(),
            className: `flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 text-xs font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-40`,
            children: [
              r ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` }) : (0, scope.O.jsx)(scope.Wu, { className: `size-3.5` }),
              r ? `同步中` : `同步节点`
            ]
          }),
          (0, scope.O.jsx)(`input`, {
            ref: n,
            type: `file`,
            accept: `.yaml,.yml,text/yaml,text/x-yaml,text/plain`,
            "aria-label": `选择 Clash Verge 配置文件`,
            className: `hidden`,
            onChange: (e2) => {
              let t2 = e2.target.files?.[0];
              t2 && s(t2), e2.target.value = ``;
            }
          })
        ]
      });
    };
    scope.Fp = function Fp(e) {
      if (typeof e != `string` && typeof e != `number`) return null;
      let t = String(e).trim();
      if (!t) return null;
      /^\d+$/.test(t) && (t = `127.0.0.1:${t}`), /^[a-z][a-z\d+.-]*:\/\//i.test(t) || (t = `http://${t}`);
      try {
        let e2 = new URL(t);
        if (!scope.Pp.has(e2.protocol) || !e2.hostname || e2.username || e2.password) return null;
        let n = e2.hostname.toLowerCase().replace(/^\[|\]$/g, ``);
        return n !== `localhost` && n !== `127.0.0.1` && n !== `::1` ? null : e2.origin;
      } catch {
        return null;
      }
    };
    scope.Vp = function Vp(e, t, n) {
      let r = /* @__PURE__ */ new Set([...t, ...n]);
      for (let t2 = Math.max(1, e); t2 <= scope.Bp; t2++) if (!r.has(t2)) return t2;
      return NaN;
    };
    scope.Hp = function Hp(e, t = scope.Rp, n = scope.Lp, r = []) {
      let i = Number.isInteger(t) && t > 0 && t <= scope.Bp ? t : scope.Rp, a = [];
      for (let t2 of e) {
        let e2 = String(t2 ?? ``).trim();
        e2 && !a.includes(e2) && a.push(e2);
      }
      if (!a.length) return { entries: [], yaml: ``, script: ``, poolEntries: [], dropped: 0 };
      let o = /* @__PURE__ */ new Map(), s = new Set(n);
      for (let e2 of r) {
        let t2 = String(e2?.nodeName ?? ``).trim(), n2 = Number(e2?.port);
        !t2 || !Number.isInteger(n2) || n2 < 1 || n2 > scope.Bp || (o.has(t2) || o.set(t2, n2), s.add(n2));
      }
      let c2 = new Set(n), l = [], u = 0;
      for (let e2 of a) {
        let t2 = o.get(e2);
        if (t2 != null && !c2.has(t2)) {
          l.push({ nodeName: e2, port: t2, listenerName: `hub-${t2}` });
          continue;
        }
        let r2 = (0, scope.Vp)(i, s, n);
        !Number.isInteger(r2) || r2 > scope.Bp ? u += 1 : (s.add(r2), l.push({ nodeName: e2, port: r2, listenerName: `hub-${r2}` }));
      }
      return l.sort((e2, t2) => e2.port - t2.port), {
        entries: l,
        yaml: (0, scope.Up)(l),
        script: (0, scope.Wp)(l),
        poolEntries: l.map((e2) => ({
          name: e2.nodeName,
          scheme: `http`,
          host: scope.zp,
          port: e2.port
        })),
        dropped: u
      };
    };
    scope.Up = function Up(e) {
      if (!e.length) return ``;
      let t = [`listeners:`];
      for (let n of e)
        t.push(
          `  - name: ${n.listenerName}`,
          `    type: mixed`,
          `    port: ${n.port}`,
          `    listen: ${scope.zp}`,
          `    proxy: ${(0, scope.Kp)(n.nodeName)}`
        );
      return t.join(`
`);
    };
    scope.Wp = function Wp(e) {
      if (!e.length) return ``;
      let t = [
        `// 由「自助签到中转站」扩展生成 —— 一节点一本地端口，按名字锁定端口不漂移。`,
        `// 粘到 Clash Verge 对应订阅的「扩展配置 → Script」里；想完全回滚就清空这个文件再重载。`,
        `function main(config) {`,
        `  if (!config) return config;`,
        `  var map = {`
      ];
      for (let n of e) t.push(`    ${(0, scope.Jp)(n.nodeName)}: ${n.port},`);
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
    };
    scope.Kp = function Kp(e) {
      return `"${e.replace(/\\/g, `\\\\`).replace(/"/g, `\\"`).replace(/\t/g, `\\t`).replace(/\n/g, `\\n`).replace(/\r/g, `\\r`).replace(scope.Gp, (e2) => {
        let t = e2.charCodeAt(0);
        return t <= 255 ? `\\x${t.toString(16).toUpperCase().padStart(2, `0`)}` : `\\u${t.toString(16).toUpperCase().padStart(4, `0`)}`;
      })}"`;
    };
    scope.qp = function qp(e) {
      return {
        name: e.nodeName,
        scheme: e.listenerType === `socks` ? `socks5` : `http`,
        host: scope.zp,
        port: e.port,
        sourceLabel: `Clash Verge`
      };
    };
    scope.Jp = function Jp(e) {
      return `"` + e.replace(/\\/g, `\\\\`).replace(/"/g, `\\"`).replace(/'/g, `\\'`).replace(/`/g, "\\`").replace(/\t/g, `\\t`).replace(/\n/g, `\\n`).replace(/\r/g, `\\r`).replace(scope.Gp, ``) + `"`;
    };
    scope.Yp = function Yp({ onNamesRead: e, onUseLocalProxy: t, onSync: n }) {
      let [r, i] = (0, scope.k.useState)({ address: scope.Np, secret: `` }), [a, o] = (0, scope.k.useState)(false), [s, c2] = (0, scope.k.useState)(null), [u, d] = (0, scope.k.useState)(null), f2 = !!(0, scope.Fp)(r.address);
      (0, scope.k.useEffect)(() => {
        let e2 = false;
        return chrome.storage.local.get(scope.Mp).then((t2) => {
          if (e2) return;
          let n2 = t2[scope.Mp];
          if (!n2 || typeof n2 != `object`) return;
          let r2 = n2.address, a2 = n2.secret;
          i((e3) => ({
            address: typeof r2 == `string` && r2 ? r2 : e3.address,
            secret: typeof a2 == `string` ? a2 : e3.secret
          }));
        }).catch(() => {
        }), () => {
          e2 = true;
        };
      }, []);
      let p = (0, scope.k.useRef)(false);
      (0, scope.k.useEffect)(() => {
        p.current ? chrome.storage.local.set({ [scope.Mp]: r }).catch(() => {
        }) : p.current = true;
      }, [r]);
      function h() {
        return { address: r.address, ...r.secret.trim() ? { secret: r.secret } : {} };
      }
      async function g() {
        if (!s) {
          c2(`detect`), d(null);
          try {
            let e2 = await (0, scope.cd)({ type: `DETECT_CLASH_CONTROLLER`, controller: h() });
            if (!e2.ok) throw Error(e2.error);
            let t2 = e2.feature?.clashControllerDetect;
            if (!t2 || t2.status !== `found`) {
              d({
                tone: `info`,
                text: t2?.message ?? `未连接到本机 HTTP 控制接口，这不代表 Clash Verge / mihomo 未启动。Clash Verge 可能只启用了 Windows 命名管道；如需同步节点，请在 Clash Verge 设置中启用外部控制器（HTTP），例如 127.0.0.1:9097，再填写地址和密钥。仅使用当前代理出口无需控制接口，可检测本机代理端口（Verge 默认 7897）。`
              });
              return;
            }
            i((e3) => ({
              address: t2.address,
              secret: (0, scope.Fp)(e3.address) === t2.address ? e3.secret : ``
            })), d(
              t2.needsSecret ? {
                tone: `info`,
                text: `该 HTTP 接口要求认证；请核对它是 Clash 控制接口，并填写正确密钥后再检测。接口可达不等于代理节点不可用。`
              } : { tone: `ok`, text: `已验证 Clash/Mihomo HTTP 控制接口，地址已填入` }
            );
          } catch (e2) {
            d({ tone: `err`, text: e2 instanceof Error ? e2.message : `自动检测失败` });
          } finally {
            c2(null);
          }
        }
      }
      async function _() {
        let e2 = await (0, scope.cd)({ type: `READ_CLASH_PROXIES`, controller: h() });
        return e2.ok ? e2.feature?.clashController?.names ?? [] : null;
      }
      async function v2() {
        if (f2 && !s) {
          c2(`sync`), d(null);
          try {
            let t2 = await (0, scope.cd)({ type: `READ_CLASH_LISTENER_EXITS`, controller: h() });
            if (!t2.ok) throw Error(t2.error);
            let r2 = t2.feature?.clashListenerExits?.exits ?? [], i2 = await _();
            if (i2) {
              let t3 = new Set(r2.map((e2) => e2.nodeName));
              e?.(i2.filter((e2) => !t3.has(e2)));
            }
            if (!r2.length) {
              d({
                tone: `info`,
                text: `内核里还没有每节点本地端口：请在 Clash Verge 的这份订阅里加一段 listeners（扩展代理管理→导入页可以生成），重载后再点同步`
              });
              return;
            }
            let a2 = r2.map((e2) => (0, scope.qp)(e2)), o2 = n ? await n(a2) : await (async () => {
              let e2 = await (0, scope.cd)({ type: `SYNC_CLASH_PROXIES`, inputs: a2 });
              if (!e2.ok) throw Error(e2.error);
              return e2.feature?.clashConfigSync;
            })();
            d({
              tone: `ok`,
              text: `已同步 ${r2.length} 个出口（新增 ${o2?.added ?? 0} / 补全 ${o2?.upgraded ?? 0} / 已存在 ${o2?.skipped ?? 0}${o2?.keptInUse ? ` / 保留在用旧出口 ${o2.keptInUse}` : ``}）`
            });
          } catch (e2) {
            d({ tone: `err`, text: e2 instanceof Error ? e2.message : `同步内核出口失败` });
          } finally {
            c2(null);
          }
        }
      }
      return (0, scope.O.jsxs)(`div`, {
        className: `space-y-3 rounded-lg border border-brand-500/25 bg-white p-3 dark:border-brand-500/20 dark:bg-ink-950`,
        children: [
          (0, scope.O.jsxs)(`div`, {
            className: `flex items-start gap-2`,
            children: [
              (0, scope.O.jsx)(scope.Xu, { className: `mt-0.5 size-4 shrink-0 text-brand-500` }),
              (0, scope.O.jsxs)(`div`, {
                className: `min-w-0`,
                children: [
                  (0, scope.O.jsx)(`p`, {
                    className: `text-xs font-semibold text-ink-900 dark:text-ink-50`,
                    children: `Clash HTTP 控制接口（同步节点用）`
                  }),
                  (0, scope.O.jsx)(`p`, {
                    className: `mt-0.5 text-[10px] leading-relaxed text-ink-800/55 dark:text-ink-100/45`,
                    children: `只读读取内核的节点与本地出口，不修改配置或切换节点。这里检测的是 HTTP 控制接口，不是内核进程。 Clash Verge 若仅使用 Windows 命名管道，需要另行启用外部控制器（HTTP）才能同步；代理端口 7897 不等于控制端口 9097。`
                  })
                ]
              })
            ]
          }),
          (0, scope.O.jsxs)(`button`, {
            type: `button`,
            disabled: s !== null,
            onClick: () => void g(),
            className: `flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink-100 px-3 py-2 text-[11px] font-semibold text-ink-900 transition-colors hover:bg-ink-200 disabled:opacity-40 dark:bg-ink-900 dark:text-ink-50 dark:hover:bg-ink-800`,
            children: [
              s === `detect` ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` }) : (0, scope.O.jsx)(scope.Qu, { className: `size-3.5` }),
              s === `detect` ? `正在检测...` : `检测 HTTP 控制接口`
            ]
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `grid gap-2 sm:grid-cols-[1fr_1fr]`,
            children: [
              (0, scope.O.jsxs)(`label`, {
                className: `space-y-1`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `block text-[10px] text-ink-800/55 dark:text-ink-100/45`,
                    children: `Controller 地址`
                  }),
                  (0, scope.O.jsx)(`input`, {
                    value: r.address,
                    onChange: (e2) => i((t2) => ({ ...t2, address: e2.target.value })),
                    placeholder: `127.0.0.1:9097`,
                    "aria-label": `Clash controller 地址`,
                    className: `h-8 w-full rounded-md border border-black/8 bg-white px-2 text-[11px] text-ink-900 outline-none focus:border-brand-500/50 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`
                  })
                ]
              }),
              (0, scope.O.jsxs)(`label`, {
                className: `space-y-1`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `block text-[10px] text-ink-800/55 dark:text-ink-100/45`,
                    children: `密钥`
                  }),
                  (0, scope.O.jsxs)(`span`, {
                    className: `relative block`,
                    children: [
                      (0, scope.O.jsx)(`input`, {
                        type: a ? `text` : `password`,
                        value: r.secret,
                        onChange: (e2) => i((t2) => ({ ...t2, secret: e2.target.value })),
                        placeholder: `未设置密钥可留空`,
                        "aria-label": `Clash controller 密钥`,
                        className: `h-8 w-full rounded-md border border-black/8 bg-white pl-2 pr-8 text-[11px] text-ink-900 outline-none focus:border-brand-500/50 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`
                      }),
                      (0, scope.O.jsx)(`button`, {
                        type: `button`,
                        onClick: () => o((e2) => !e2),
                        title: a ? `隐藏密钥` : `显示密钥`,
                        "aria-label": a ? `隐藏 Clash 密钥` : `显示 Clash 密钥`,
                        className: `absolute right-1 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded text-ink-800/45 hover:bg-black/5 dark:text-ink-100/40 dark:hover:bg-white/5`,
                        children: a ? (0, scope.O.jsx)(scope.Bu, { className: `size-3.5` }) : (0, scope.O.jsx)(scope.Hu, { className: `size-3.5` })
                      })
                    ]
                  })
                ]
              })
            ]
          }),
          !f2 && r.address.trim() && (0, scope.O.jsx)(`p`, {
            className: `text-[10px] text-rose-600 dark:text-rose-400`,
            children: `地址格式无效，请填写端口、主机:端口或 http(s) 地址`
          }),
          (0, scope.O.jsxs)(`button`, {
            type: `button`,
            disabled: !f2 || s !== null,
            onClick: () => void v2(),
            className: `flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-40`,
            children: [
              s === `sync` ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` }) : (0, scope.O.jsx)(scope.l, { className: `size-3.5` }),
              s === `sync` ? `正在同步...` : `同步内核出口到代理池`
            ]
          }),
          t && (0, scope.O.jsx)(`button`, {
            type: `button`,
            onClick: t,
            className: `text-[11px] font-medium text-brand-600 underline dark:text-brand-300`,
            children: `只使用当前 Clash 出口（无需控制接口）`
          }),
          u && (0, scope.O.jsx)(`p`, {
            role: `status`,
            className: (0, scope.$)(
              `text-[10px] leading-relaxed`,
              u.tone === `ok` && `text-emerald-600 dark:text-emerald-400`,
              u.tone === `info` && `text-amber-700 dark:text-amber-400`,
              u.tone === `err` && `text-rose-600 dark:text-rose-400`
            ),
            children: u.text
          })
        ]
      });
    };
    scope.Xp = function Xp({ names: e, selected: t, onChange: n, noteOf: r }) {
      let [i, a] = (0, scope.k.useState)(``), [o, s] = (0, scope.k.useState)(``), [c2, l] = (0, scope.k.useState)(/* @__PURE__ */ new Set()), u = (0, scope.k.useMemo)(() => {
        let t2 = i.trim().toLowerCase();
        return t2 ? e.filter((e2) => e2.toLowerCase().includes(t2)) : [...e];
      }, [e, i]), f2 = (0, scope.k.useMemo)(() => (0, scope.Cp)(u, (e2) => e2), [u]), p = (0, scope.k.useMemo)(() => new Map(e.map((e2, t2) => [e2, t2])), [e]);
      function m(e2) {
        let r2 = new Set(t);
        e2(r2), n(r2);
      }
      function h(e2) {
        m((t2) => {
          t2.has(e2) ? t2.delete(e2) : t2.add(e2);
        });
      }
      function g(e2) {
        let n2 = e2.every((e3) => t.has(e3));
        m((t2) => {
          for (let r2 of e2) n2 ? t2.delete(r2) : t2.add(r2);
        });
      }
      function _() {
        let e2 = o.trim().toLowerCase();
        e2 && m((t2) => {
          for (let n2 of u) n2.toLowerCase().includes(e2) && t2.add(n2);
        });
      }
      function v2(e2) {
        l((t2) => {
          let n2 = new Set(t2);
          return n2.has(e2) ? n2.delete(e2) : n2.add(e2), n2;
        });
      }
      let b = u.filter((e2) => t.has(e2)).length;
      return (0, scope.O.jsxs)(`div`, {
        className: `space-y-2`,
        children: [
          (0, scope.O.jsxs)(`div`, {
            className: `flex flex-wrap items-center gap-2`,
            children: [
              (0, scope.O.jsxs)(`label`, {
                className: `relative min-w-[150px] flex-1`,
                children: [
                  (0, scope.O.jsx)(scope.d, {
                    className: `pointer-events-none absolute left-2 top-1/2 size-3 -translate-y-1/2 text-ink-800/35 dark:text-ink-100/35`
                  }),
                  (0, scope.O.jsx)(`input`, {
                    value: i,
                    onChange: (e2) => a(e2.target.value),
                    placeholder: `搜索节点，如 日本`,
                    "aria-label": `搜索节点`,
                    className: `h-7 w-full rounded-md border border-black/8 bg-white pl-7 pr-6 text-[11px] text-ink-900 outline-none placeholder:text-ink-800/35 focus:border-brand-500/50 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`
                  }),
                  i && (0, scope.O.jsx)(`button`, {
                    type: `button`,
                    onClick: () => a(``),
                    "aria-label": `清空节点搜索`,
                    className: `absolute right-1 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-800/40 hover:bg-black/5 dark:text-ink-100/40`,
                    children: (0, scope.O.jsx)(scope.y, { className: `size-3` })
                  })
                ]
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `flex items-center gap-1`,
                children: [
                  (0, scope.O.jsx)(`input`, {
                    value: o,
                    onChange: (e2) => s(e2.target.value),
                    onKeyDown: (e2) => {
                      e2.key === `Enter` && (e2.preventDefault(), _());
                    },
                    placeholder: `关键词，如 优化`,
                    "aria-label": `按关键词批量勾选`,
                    className: `h-7 w-28 rounded-md border border-black/8 bg-white px-2 text-[11px] text-ink-900 outline-none placeholder:text-ink-800/35 focus:border-brand-500/50 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`
                  }),
                  (0, scope.O.jsx)(`button`, {
                    type: `button`,
                    disabled: !o.trim(),
                    onClick: _,
                    className: `h-7 shrink-0 rounded-md bg-ink-100 px-2 text-[11px] font-medium text-ink-900 disabled:opacity-40 dark:bg-white/10 dark:text-ink-50`,
                    children: `勾选含此词`
                  })
                ]
              })
            ]
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `flex items-center justify-between rounded-md bg-white px-2 py-1.5 text-[10px] ring-1 ring-black/5 dark:bg-ink-900 dark:ring-white/10`,
            children: [
              (0, scope.O.jsx)(`span`, {
                className: `text-ink-800/60 dark:text-ink-100/50`,
                children: i ? `筛出 ${u.length} 个 · 其中已选 ${b} 个` : `共 ${e.length} 个节点 · 已选 ${t.size} 个`
              }),
              (0, scope.O.jsxs)(`span`, {
                className: `flex items-center gap-2`,
                children: [
                  (0, scope.O.jsx)(`button`, {
                    type: `button`,
                    onClick: () => g(u),
                    className: `font-medium text-brand-600 hover:underline dark:text-brand-400`,
                    children: u.length > 0 && u.every((e2) => t.has(e2)) ? `取消当前结果` : `选中当前结果`
                  }),
                  (0, scope.O.jsx)(`button`, {
                    type: `button`,
                    onClick: () => n(/* @__PURE__ */ new Set()),
                    className: `text-ink-800/50 hover:underline dark:text-ink-100/40`,
                    children: `清空`
                  })
                ]
              })
            ]
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `max-h-72 space-y-1.5 overflow-y-auto`,
            children: [
              f2.map((e2) => {
                let n2 = c2.has(e2.key), i2 = e2.items.filter((e3) => t.has(e3)).length, a2 = i2 === e2.items.length;
                return (0, scope.O.jsxs)(
                  `div`,
                  {
                    className: `overflow-hidden rounded-lg ring-1 ring-black/5 dark:ring-white/10`,
                    children: [
                      (0, scope.O.jsxs)(`div`, {
                        className: `flex items-center gap-2 bg-ink-50 px-2 py-1.5 dark:bg-ink-900`,
                        children: [
                          (0, scope.O.jsx)(`input`, {
                            type: `checkbox`,
                            checked: a2,
                            onChange: () => g(e2.items),
                            "aria-label": `${a2 ? `取消选择` : `选择`}${e2.label}全部节点`,
                            className: `size-3.5 shrink-0`
                          }),
                          (0, scope.O.jsxs)(`button`, {
                            type: `button`,
                            onClick: () => v2(e2.key),
                            className: `flex min-w-0 flex-1 items-center gap-1.5 text-left`,
                            children: [
                              (0, scope.O.jsx)(`span`, {
                                className: `truncate text-[11px] font-semibold text-ink-900 dark:text-ink-50`,
                                children: e2.label
                              }),
                              (0, scope.O.jsxs)(`span`, {
                                className: `shrink-0 text-[10px] tabular-nums text-ink-800/45 dark:text-ink-100/35`,
                                children: [i2, `/`, e2.items.length]
                              }),
                              (0, scope.O.jsx)(scope.ee, {
                                className: (0, scope.$)(
                                  `ml-auto size-3 shrink-0 text-ink-800/40 transition-transform dark:text-ink-100/35`,
                                  n2 && `-rotate-90`
                                )
                              })
                            ]
                          })
                        ]
                      }),
                      !n2 && (0, scope.O.jsx)(`div`, {
                        className: `divide-y divide-black/5 dark:divide-white/5`,
                        children: e2.items.map((e3) => {
                          let n3 = p.get(e3) ?? 0;
                          return (0, scope.O.jsxs)(
                            `label`,
                            {
                              className: `flex cursor-pointer items-center gap-2 bg-white px-2 py-1.5 dark:bg-ink-950`,
                              children: [
                                (0, scope.O.jsx)(`input`, {
                                  type: `checkbox`,
                                  checked: t.has(e3),
                                  onChange: () => h(e3),
                                  "aria-label": `选择节点 ${e3}`,
                                  className: `size-3.5 shrink-0`
                                }),
                                (0, scope.O.jsx)(`span`, {
                                  className: `min-w-0 flex-1 truncate text-[11px] text-ink-900 dark:text-ink-50`,
                                  title: e3,
                                  children: e3
                                }),
                                r && (0, scope.O.jsx)(`span`, {
                                  className: `shrink-0 text-[10px] text-ink-800/45 dark:text-ink-100/35`,
                                  children: r(e3, n3)
                                })
                              ]
                            },
                            e3
                          );
                        })
                      })
                    ]
                  },
                  e2.key
                );
              }),
              !f2.length && (0, scope.O.jsxs)(`p`, {
                className: `rounded-lg bg-white px-2.5 py-3 text-center text-[11px] text-ink-800/45 ring-1 ring-black/5 dark:bg-ink-900 dark:text-ink-100/35 dark:ring-white/10`,
                children: [`没有匹配「`, i, `」的节点`]
              })
            ]
          })
        ]
      });
    };
    scope.Zp = function Zp({ names: e, onImport: t }) {
      let [n, r] = (0, scope.k.useState)(() => new Set(e)), [i, a] = (0, scope.k.useState)(String(scope.Ip)), [s, c2] = (0, scope.k.useState)(false), [l, u] = (0, scope.k.useState)(false), [d, p] = (0, scope.k.useState)(null), [h, g] = (0, scope.k.useState)(true), [_, v2] = (0, scope.k.useState)(false), [y, b] = (0, scope.k.useState)(null), [x, S] = (0, scope.k.useState)(false);
      (0, scope.k.useEffect)(() => {
        r(new Set(e));
      }, [e]);
      let C2 = Number(i), w2 = Number.isInteger(C2) && C2 > 0 && C2 <= 65535, T = (0, scope.k.useMemo)(() => e.filter((e2) => n.has(e2)), [e, n]), [E, ee] = (0, scope.k.useState)([]);
      (0, scope.k.useEffect)(() => {
        let e2 = false;
        return scope.ld.get(scope.ud.listenerPlan, []).then((t2) => {
          !e2 && Array.isArray(t2) && ee(t2);
        }).catch(() => {
        }), () => {
          e2 = true;
        };
      }, []), (0, scope.k.useEffect)(() => {
        let e2 = false;
        return scope.ld.get(scope.ud.subscriptionSource, null).then((t2) => {
          !e2 && t2 && (S(typeof t2.url == `string` && t2.url.length > 0), g(t2.autoSync !== false));
        }).catch(() => {
        }), () => {
          e2 = true;
        };
      }, []);
      let D = (0, scope.k.useMemo)(
        () => (0, scope.Hp)(T, w2 ? C2 : scope.Ip, void 0, E),
        [T, C2, w2, E]
      );
      (0, scope.k.useEffect)(() => {
        D.entries.length && scope.ld.set(scope.ud.listenerPlan, D.entries).catch(() => {
        });
      }, [D.entries]);
      let te = (0, scope.k.useMemo)(
        () => new Map(D.entries.map((e2) => [e2.nodeName, e2.port])),
        [D.entries]
      );
      async function A() {
        if (D.yaml)
          try {
            await navigator.clipboard.writeText(D.yaml), u(true), setTimeout(() => u(false), 1800);
          } catch {
            p(`复制失败，请手动选中下面的配置文本`);
          }
      }
      let [j, M] = (0, scope.k.useState)(false);
      async function N() {
        if (D.script)
          try {
            await navigator.clipboard.writeText(D.script), M(true), setTimeout(() => M(false), 1800);
          } catch {
            p(`复制失败，请手动选中下面的脚本文本`);
          }
      }
      async function P() {
        if (!_) {
          v2(true), p(null);
          try {
            let e2 = await (0, scope.cd)({ type: `CHECK_LISTENER_DRIFT` });
            if (!e2.ok) throw Error(e2.error);
            let t2 = e2.feature?.listenerDrift;
            if (!t2) throw Error(`后台没有返回检查结果`);
            b({
              added: t2.added,
              removed: t2.removed,
              needsResync: t2.needsResync,
              checkedAt: t2.checkedAt
            }), p(
              t2.needsResync ? `订阅里有 ${t2.added} 个新节点已补进代理池;请重新「复制自动更新脚本」并粘回 Clash Verge,它们才会真正监听` : `订阅无新增节点${t2.removed ? `;${t2.removed} 个节点已从订阅消失(端口保留不复用)` : ``}`
            );
          } catch (e2) {
            p(e2 instanceof Error ? `检查失败:${e2.message}` : `检查失败`);
          } finally {
            v2(false);
          }
        }
      }
      async function ne() {
        let e2 = !h;
        g(e2);
        let t2 = await scope.ld.get(scope.ud.subscriptionSource, null);
        t2 && await scope.ld.set(scope.ud.subscriptionSource, { ...t2, autoSync: e2 }).catch(() => {
        });
      }
      async function re() {
        if (D.poolEntries.length && !s) {
          c2(true), p(null);
          try {
            let e2 = await t(D.poolEntries.map((e3) => ({ ...e3, sourceLabel: `Clash Verge` }))), n2 = [`已按方案入池 ${D.poolEntries.length} 个出口`];
            e2.added && n2.push(`新增 ${e2.added}`), e2.upgraded && n2.push(`补上真实出口 ${e2.upgraded}`), e2.skipped && n2.push(`已存在 ${e2.skipped}`), p(`${n2.join(` · `)}。改完 Clash 配置并重载后，用列表里的测试按钮确认连通性。`);
          } catch (e2) {
            p(e2 instanceof Error ? `入池失败：${e2.message}` : `入池失败`);
          } finally {
            c2(false);
          }
        }
      }
      return e.length ? (0, scope.O.jsxs)(`section`, {
        className: `space-y-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3 dark:border-brand-900/70 dark:bg-brand-950/20`,
        children: [
          (0, scope.O.jsxs)(`div`, {
            className: `flex items-start gap-2`,
            children: [
              (0, scope.O.jsx)(`span`, {
                className: `grid size-8 shrink-0 place-items-center rounded-lg bg-brand-500 text-white`,
                children: (0, scope.O.jsx)(scope.Qu, { className: `size-4` })
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `min-w-0 flex-1`,
                children: [
                  (0, scope.O.jsx)(`h4`, {
                    className: `text-xs font-semibold text-ink-900 dark:text-ink-50`,
                    children: `生成 listeners 配置（第 1 / 3 步）`
                  }),
                  (0, scope.O.jsxs)(`p`, {
                    className: `mt-0.5 text-[11px] leading-relaxed text-ink-800/60 dark:text-ink-100/50`,
                    children: [
                      `vmess / vless / trojan / hysteria2 这些协议浏览器不能直连，但让 Clash 为每个节点 各开一个本地端口，浏览器就能用了。下面 `,
                      e.length,
                      ` 个节点都还没有自己的端口。`
                    ]
                  })
                ]
              })
            ]
          }),
          (0, scope.O.jsx)(scope.Xp, {
            names: e,
            selected: n,
            onChange: r,
            noteOf: (e2) => {
              let t2 = te.get(e2);
              return t2 ? `:${t2}` : ``;
            }
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `flex flex-wrap items-end gap-2`,
            children: [
              (0, scope.O.jsxs)(`label`, {
                className: `space-y-1`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `block text-[10px] text-ink-800/55 dark:text-ink-100/45`,
                    children: `起始端口`
                  }),
                  (0, scope.O.jsx)(`input`, {
                    value: i,
                    onChange: (e2) => a(e2.target.value.replace(/\D/g, ``)),
                    inputMode: `numeric`,
                    "aria-label": `listener 起始端口`,
                    className: `h-8 w-24 rounded-md border border-black/8 bg-white px-2 text-[11px] tabular-nums text-ink-900 outline-none focus:border-brand-500/50 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`
                  })
                ]
              }),
              (0, scope.O.jsxs)(`p`, {
                className: `min-w-0 flex-1 text-[10px] leading-relaxed text-ink-800/50 dark:text-ink-100/40`,
                children: [
                  `依次递增，避开内核自己占用的 7890 / 7891 / 7897。`,
                  D.dropped > 0 && (0, scope.O.jsxs)(`span`, {
                    className: `text-amber-600 dark:text-amber-400`,
                    children: [`　有 `, D.dropped, ` 个节点因端口越界未分配`]
                  })
                ]
              })
            ]
          }),
          (0, scope.O.jsx)(scope.Bc, {
            initial: false,
            children: D.yaml && (0, scope.O.jsx)(scope.Mu.div, {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: `auto` },
              exit: { opacity: 0, height: 0 },
              className: `overflow-hidden`,
              children: (0, scope.O.jsxs)(`div`, {
                className: `space-y-2`,
                children: [
                  (0, scope.O.jsxs)(`div`, {
                    className: `flex items-center justify-between gap-2`,
                    children: [
                      (0, scope.O.jsxs)(`span`, {
                        className: `min-w-0 text-[10px] font-medium text-ink-800/60 dark:text-ink-100/50`,
                        children: [
                          D.entries.length,
                          ` 个 listener · 端口 `,
                          D.entries[0].port,
                          `–`,
                          D.entries[D.entries.length - 1].port
                        ]
                      }),
                      (0, scope.O.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => void A(),
                        className: `flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-medium text-brand-600 ring-1 ring-black/5 hover:bg-brand-50 dark:bg-ink-900 dark:text-brand-400 dark:ring-white/10`,
                        children: [
                          l ? (0, scope.O.jsx)(scope.o, { className: `size-3` }) : (0, scope.O.jsx)(scope.Iu, { className: `size-3` }),
                          l ? `已复制` : `复制配置`
                        ]
                      }),
                      (0, scope.O.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => void N(),
                        title: `粘进 Clash Verge「扩展配置 → Script」：订阅更新后端口映射自动重建，无需再粘`,
                        className: `flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-white bg-brand-500 hover:bg-brand-600`,
                        children: [
                          j ? (0, scope.O.jsx)(scope.o, { className: `size-3` }) : (0, scope.O.jsx)(scope.Iu, { className: `size-3` }),
                          j ? `脚本已复制` : `复制自动更新脚本`
                        ]
                      })
                    ]
                  }),
                  (0, scope.O.jsx)(`pre`, {
                    className: `max-h-40 overflow-auto rounded-lg bg-white px-2.5 py-2 font-mono text-[10px] leading-relaxed text-ink-900 ring-1 ring-black/5 dark:bg-ink-950 dark:text-ink-50 dark:ring-white/10`,
                    children: D.yaml
                  })
                ]
              })
            })
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `space-y-2 rounded-lg bg-white/70 px-3 py-2 ring-1 ring-black/5 dark:bg-ink-950/50 dark:ring-white/10`,
            children: [
              (0, scope.O.jsxs)(`div`, {
                className: `flex flex-wrap items-center gap-2`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `text-[10px] font-semibold text-ink-900 dark:text-ink-50`,
                    children: `订阅自动更新`
                  }),
                  x ? (0, scope.O.jsxs)(scope.O.Fragment, {
                    children: [
                      (0, scope.O.jsx)(`button`, {
                        type: `button`,
                        role: `switch`,
                        "aria-checked": h,
                        onClick: () => void ne(),
                        className: (0, scope.$)(
                          `rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 transition-colors`,
                          h ? `bg-emerald-500/12 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300` : `bg-ink-100 text-ink-800/50 ring-black/5 dark:bg-ink-900 dark:text-ink-100/40 dark:ring-white/10`
                        ),
                        children: h ? `已开启 · 每 6 小时检查` : `已关闭`
                      }),
                      (0, scope.O.jsxs)(`button`, {
                        type: `button`,
                        disabled: _,
                        onClick: () => void P(),
                        className: `flex items-center gap-1 rounded-md bg-brand-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-brand-600 disabled:opacity-40`,
                        children: [
                          _ ? (0, scope.O.jsx)(scope.m, {
                            className: `size-3 animate-spin`
                          }) : (0, scope.O.jsx)(scope.f, { className: `size-3` }),
                          _ ? `检查中...` : `立即检查`
                        ]
                      })
                    ]
                  }) : (0, scope.O.jsx)(`span`, {
                    className: `text-[10px] text-ink-800/50 dark:text-ink-100/40`,
                    children: `先在导入页粘一次订阅地址，即可自动跟随更新`
                  })
                ]
              }),
              y && (0, scope.O.jsx)(`p`, {
                className: (0, scope.$)(
                  `text-[10px] leading-relaxed`,
                  y.needsResync ? `text-amber-700 dark:text-amber-300` : `text-ink-800/55 dark:text-ink-100/45`
                ),
                children: y.needsResync ? `新增 ${y.added} 个节点 · 需重新复制并粘贴 Script（已自动补进代理池）` : `无新增节点${y.removed ? ` · ${y.removed} 个节点已消失（端口保留，不复用）` : ``}`
              })
            ]
          }),
          (0, scope.O.jsxs)(`p`, {
            className: `text-[10px] leading-relaxed text-brand-700 dark:text-brand-300`,
            children: [
              `推荐:`,
              (0, scope.O.jsx)(`b`, { children: `复制自动更新脚本` }),
              ` → 粘到 Clash Verge 飞鸟云订阅的「右键 → 编辑扩展配置 → Script」并保存。 之后订阅每次更新,Verge 会按这份映射自动重建所有端口,端口由本扩展锁定永不漂移。 想完全回滚:清空那个 Script 文件并重载即可,不留任何痕迹。`
            ]
          }),
          (0, scope.O.jsxs)(`ol`, {
            className: `space-y-1 rounded-lg bg-white/70 px-3 py-2 text-[10px] leading-relaxed text-ink-800/70 ring-1 ring-black/5 dark:bg-ink-950/50 dark:text-ink-100/60 dark:ring-white/10`,
            children: [
              (0, scope.O.jsxs)(`li`, {
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `font-semibold`,
                    children: `兼容模式`
                  }),
                  `　复制上面的配置，粘进 Clash Verge 的「扩展配置(Merge)」并保存`,
                  (0, scope.O.jsx)(`span`, {
                    className: `opacity-70`,
                    children: `（不要粘进订阅本身：订阅一更新就被覆盖）`
                  })
                ]
              }),
              (0, scope.O.jsxs)(`li`, {
                children: [
                  (0, scope.O.jsx)(`span`, { className: `font-semibold`, children: `3 / 3` }),
                  `　在 Clash Verge 里重载 / 重启一次内核，让新端口生效`
                ]
              }),
              (0, scope.O.jsx)(`li`, {
                className: `pt-0.5 opacity-70`,
                children: `端口已生效后再点下面的按钮入池；之后到「全部节点」逐个测试连通性。`
              })
            ]
          }),
          (0, scope.O.jsxs)(`button`, {
            type: `button`,
            disabled: !D.poolEntries.length || s,
            onClick: () => void re(),
            className: `flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-40`,
            children: [
              s ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` }) : (0, scope.O.jsx)(scope.Xu, { className: `size-3.5` }),
              s ? `入池中...` : `重载完成后，把这 ${D.poolEntries.length} 个出口加入代理池`
            ]
          }),
          d && (0, scope.O.jsx)(`p`, {
            className: `text-[10px] leading-relaxed text-ink-800/60 dark:text-ink-100/50`,
            children: d
          })
        ]
      }) : (0, scope.O.jsxs)(`section`, {
        className: `rounded-xl border border-dashed border-ink-200 px-4 py-6 text-center dark:border-ink-700`,
        children: [
          (0, scope.O.jsx)(scope.Xu, {
            className: `mx-auto size-5 text-ink-800/25 dark:text-ink-100/20`
          }),
          (0, scope.O.jsx)(`p`, {
            className: `mt-2 text-[11px] leading-relaxed text-ink-800/55 dark:text-ink-100/45`,
            children: `先用上面的「读取控制器节点目录」或「从订阅导入」取到节点名， 这里就能替你把每个节点的本地监听端口写出来。`
          })
        ]
      });
    };
    scope.$p = function $p({ onImport: e, onBusyChange: n }) {
      let [r, i] = (0, scope.k.useState)(`127.0.0.1`), [a, o] = (0, scope.k.useState)(`7897`), [s, c2] = (0, scope.k.useState)(`http`), [l, u] = (0, scope.k.useState)(false), [d, f2] = (0, scope.k.useState)(null), p = Number(a), h = !!r.trim() && Number.isInteger(p) && p > 0 && p <= 65535;
      async function g() {
        if (h && !l) {
          u(true), n?.(true), f2(null);
          try {
            let t = r.trim(), n2 = await (0, scope.cd)({
              type: `SCAN_LOCAL_PORTS`,
              host: t,
              ports: [p],
              scheme: s,
              withExit: true
            });
            if (!n2.ok) {
              f2({ state: `fail`, title: n2.error });
              return;
            }
            let i2 = n2.feature?.portScan?.entries[0];
            if (!i2?.ok) {
              f2({
                state: `fail`,
                title: `${s.toUpperCase()}://${t}:${p} 不可用`,
                detail: i2?.message ?? `没有检测到可连接的本机代理服务`
              });
              return;
            }
            let a2 = await e([
              {
                name: t === `127.0.0.1` && p === 7897 ? `Clash 当前出口` : `${t}:${p}`,
                sourceLabel: `本机代理`,
                scheme: s,
                host: t,
                port: p
              }
            ]), o2 = a2.added ? `已加入代理池` : a2.upgraded ? `已更新代理池` : `代理池中已存在`, c3 = [i2.country, i2.ip].filter(Boolean).join(` · `);
            f2({
              state: `ok`,
              title: `${o2}：${s.toUpperCase()}://${t}:${p}`,
              detail: c3 ? `当前出口 ${c3} · ${i2.ms}ms` : `连通正常 · ${i2.ms}ms`
            });
          } catch (e2) {
            f2({ state: `fail`, title: e2 instanceof Error ? e2.message : `检测本机代理失败` });
          } finally {
            u(false), n?.(false);
          }
        }
      }
      return (0, scope.O.jsxs)(`section`, {
        className: `space-y-4`,
        children: [
          (0, scope.O.jsxs)(`div`, {
            className: `flex items-start gap-2.5`,
            children: [
              (0, scope.O.jsx)(`span`, {
                className: `grid size-8 shrink-0 place-items-center rounded-lg bg-brand-500 text-white`,
                children: (0, scope.O.jsx)(scope.Ku, { className: `size-4` })
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `min-w-0`,
                children: [
                  (0, scope.O.jsx)(`h4`, {
                    className: `text-xs font-semibold text-ink-900 dark:text-ink-50`,
                    children: `添加 Clash 本机出口`
                  }),
                  (0, scope.O.jsx)(`p`, {
                    className: `mt-0.5 text-[11px] leading-relaxed text-ink-800/55 dark:text-ink-100/45`,
                    children: `默认检测 Clash Verge 的 mixed-port 7897。这个端口会跟随 Clash 当前选中的节点，扩展不会切换节点或修改 Clash 配置。`
                  })
                ]
              })
            ]
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `grid grid-cols-[minmax(0,1fr)_88px] gap-2`,
            children: [
              (0, scope.O.jsxs)(`label`, {
                className: `col-span-2 space-y-1 sm:col-span-1`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `block text-[10px] text-ink-800/55 dark:text-ink-100/45`,
                    children: `主机`
                  }),
                  (0, scope.O.jsx)(`input`, {
                    value: r,
                    onChange: (e2) => i(e2.target.value),
                    "aria-label": `本机代理主机`,
                    autoComplete: `off`,
                    className: `h-9 w-full rounded-lg border border-black/8 bg-white px-2.5 text-xs text-ink-900 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`
                  })
                ]
              }),
              (0, scope.O.jsxs)(`label`, {
                className: `space-y-1`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `block text-[10px] text-ink-800/55 dark:text-ink-100/45`,
                    children: `端口`
                  }),
                  (0, scope.O.jsx)(`input`, {
                    value: a,
                    onChange: (e2) => o(e2.target.value.replace(/\D/g, ``)),
                    inputMode: `numeric`,
                    "aria-label": `本机代理端口`,
                    className: `h-9 w-full rounded-lg border border-black/8 bg-white px-2.5 text-xs tabular-nums text-ink-900 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`
                  })
                ]
              })
            ]
          }),
          (0, scope.O.jsxs)(`div`, {
            children: [
              (0, scope.O.jsx)(`span`, {
                className: `mb-1 block text-[10px] text-ink-800/55 dark:text-ink-100/45`,
                children: `协议`
              }),
              (0, scope.O.jsx)(`div`, {
                className: `grid grid-cols-2 gap-1 rounded-lg bg-ink-100 p-1 dark:bg-ink-900`,
                children: scope.Qp.map(
                  (e2) => (0, scope.O.jsx)(
                    `button`,
                    {
                      type: `button`,
                      onClick: () => c2(e2.value),
                      "aria-pressed": s === e2.value,
                      className: (0, scope.$)(
                        `h-8 rounded-md text-[11px] font-medium transition-colors`,
                        s === e2.value ? `bg-white text-ink-900 shadow-sm dark:bg-ink-800 dark:text-ink-50` : `text-ink-800/50 hover:text-ink-900 dark:text-ink-100/40 dark:hover:text-ink-50`
                      ),
                      children: e2.label
                    },
                    e2.value
                  )
                )
              })
            ]
          }),
          (0, scope.O.jsxs)(`button`, {
            type: `button`,
            disabled: !h || l,
            onClick: () => void g(),
            className: `flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-40`,
            children: [
              l ? (0, scope.O.jsx)(scope.m, { className: `size-4 animate-spin` }) : (0, scope.O.jsx)(scope.Ku, { className: `size-4` }),
              l ? `正在检测出口...` : `检测并加入代理池`
            ]
          }),
          d && (0, scope.O.jsxs)(`div`, {
            className: (0, scope.$)(
              `flex items-start gap-2 rounded-lg px-3 py-2.5 ring-1`,
              d.state === `ok` ? `bg-emerald-500/10 text-emerald-800 ring-emerald-500/20 dark:text-emerald-200` : `bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300`
            ),
            children: [
              d.state === `ok` ? (0, scope.O.jsx)(scope.t, { className: `mt-0.5 size-4 shrink-0` }) : (0, scope.O.jsx)(scope.Pu, { className: `mt-0.5 size-4 shrink-0` }),
              (0, scope.O.jsxs)(`div`, {
                className: `min-w-0`,
                children: [
                  (0, scope.O.jsx)(`p`, {
                    className: `break-words text-[11px] font-medium`,
                    children: d.title
                  }),
                  d.detail && (0, scope.O.jsx)(`p`, {
                    className: `mt-0.5 break-words text-[10px] opacity-75`,
                    children: d.detail
                  })
                ]
              })
            ]
          })
        ]
      });
    };
    scope.nm = function nm(e) {
      let t = e.trim().toLowerCase();
      return !t || scope.tm.some((e2) => t.includes(e2.toLowerCase()));
    };
    scope.am = function am(e) {
      let t = e.trim();
      if (!t)
        return { nodes: [], skipped: [], duplicates: 0, unsupportedNames: [], format: `unknown` };
      if ((0, scope.vm)(t)) return (0, scope.om)((0, scope.ym)(t), `clash-yaml`);
      let n = (0, scope.sm)(t);
      if (n !== null) return (0, scope.om)((0, scope.lm)(n), `base64`);
      let r = (0, scope.lm)(t);
      return (0, scope.om)(r, r.nodes.length > 0 || r.skips.length > 0 ? `uri-list` : `unknown`);
    };
    scope.om = function om(e, t) {
      let n = /* @__PURE__ */ new Set(), r = [], i = 0;
      for (let t2 of e.nodes) {
        let e2 = `${t2.scheme}://${t2.host.toLowerCase()}:${t2.port}`;
        n.has(e2) ? i += 1 : (n.add(e2), r.push(t2));
      }
      let a = /* @__PURE__ */ new Map(), o = [], s = /* @__PURE__ */ new Set();
      for (let t2 of e.skips) {
        let e2 = `${t2.reason}:${t2.scheme ?? ``}`, n2 = a.get(e2);
        n2 ? n2.count += 1 : a.set(e2, { reason: t2.reason, ...t2.scheme ? { scheme: t2.scheme } : {}, count: 1 }), t2.reason === `unsupported-scheme` && t2.name && !s.has(t2.name) && !(0, scope.nm)(t2.name) && (s.add(t2.name), o.push(t2.name));
      }
      return {
        nodes: r,
        skipped: [...a.values()].sort(
          (e2, t2) => t2.count - e2.count || (e2.scheme ?? ``).localeCompare(t2.scheme ?? ``)
        ),
        duplicates: i,
        unsupportedNames: o,
        format: t
      };
    };
    scope.sm = function sm(e) {
      let t = e.replace(/\s+/g, ``);
      if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(t)) return null;
      try {
        let e2 = t.replace(/-/g, `+`).replace(/_/g, `/`), n = e2.padEnd(Math.ceil(e2.length / 4) * 4, `=`), r = (0, scope.cm)(atob(n));
        return r.includes(`://`) ? r : null;
      } catch {
        return null;
      }
    };
    scope.cm = function cm(e) {
      let t = Uint8Array.from(e, (e2) => e2.charCodeAt(0));
      return new TextDecoder().decode(t);
    };
    scope.lm = function lm(e) {
      let t = { nodes: [], skips: [] };
      for (let n of e.split(/\r?\n/)) {
        let e2 = n.trim().replace(/^[-*]\s+/, ``);
        if (!e2 || e2.startsWith(`#`)) continue;
        let r = /^([a-z][a-z0-9+.-]*):\/\/(.*)$/i.exec(e2);
        if (!r) {
          let n2 = (0, scope.um)(e2);
          n2 && t.nodes.push(n2);
          continue;
        }
        let i = r[1].toLowerCase(), a = scope.rm[i];
        if (!a || !scope.em.has(a)) {
          let e3 = (0, scope.dm)(i, r[2]);
          t.skips.push({ reason: `unsupported-scheme`, scheme: i, ...e3 ? { name: e3 } : {} });
          continue;
        }
        let o = (0, scope.fm)(a, r[2]);
        o ? t.nodes.push(o) : t.skips.push({ reason: `malformed`, scheme: i });
      }
      return t;
    };
    scope.um = function um(e) {
      let t = /^(?:(https?|socks4|socks5|socks)\s+)?(\[[^\]]+\]|[^\s:@]+)(?::|\s+)(\d{1,5})$/i.exec(
        e
      );
      if (!t) return null;
      let n = scope.rm[(t[1] ?? `http`).toLowerCase()], r = t[2], i = Number(t[3]);
      return !n || !r || !Number.isInteger(i) || i < 1 || i > 65535 ? null : {
        name: `${r.replace(/^\[|\]$/g, ``)}:${i}`,
        scheme: (0, scope.Cd)({ scheme: n, host: r }),
        host: r.replace(/^\[|\]$/g, ``),
        port: i,
        sourceLabel: `手动导入`
      };
    };
    scope.dm = function dm(e, t) {
      if (e === `vmess`) {
        let e2 = (0, scope.gm)(t.split(/[?#]/)[0] ?? ``);
        if (!e2) return null;
        try {
          let t2 = JSON.parse(e2), n2 = t2.ps ?? t2.remarks;
          return typeof n2 == `string` && n2.trim() ? n2.trim() : null;
        } catch {
          return null;
        }
      }
      let n = t.indexOf(`#`);
      return n < 0 ? null : (0, scope._m)(t.slice(n + 1)).trim() || null;
    };
    scope.fm = function fm(e, t) {
      let n = t.indexOf(`#`), r = n >= 0 ? (0, scope._m)(t.slice(n + 1)).trim() : ``, i = n >= 0 ? t.slice(0, n) : t;
      if (i = i.split(/[/?]/)[0] ?? ``, !i) return null;
      let a = ``, o = i.lastIndexOf(`@`);
      o >= 0 && (a = i.slice(0, o), i = i.slice(o + 1));
      let s = (0, scope.pm)(i);
      if (!s) return null;
      let c2 = s.port ?? scope.im[e];
      if (!Number.isInteger(c2) || c2 <= 0 || c2 > 65535) return null;
      let { username: l, password: u } = (0, scope.hm)(a);
      return {
        name: r || `${s.host}:${c2}`,
        scheme: (0, scope.Cd)({ scheme: e, host: s.host }),
        host: s.host,
        port: c2,
        ...l ? { username: l } : {},
        ...u ? { password: u } : {}
      };
    };
    scope.pm = function pm(e) {
      if (e.startsWith(`[`)) {
        let t2 = e.indexOf(`]`);
        if (t2 < 0) return null;
        let n2 = e.slice(0, t2 + 1), r2 = e.slice(t2 + 1);
        return r2 ? r2.startsWith(`:`) ? { host: n2, port: (0, scope.mm)(r2.slice(1)) ?? void 0 } : null : { host: n2 };
      }
      let t = e.lastIndexOf(`:`);
      if (t < 0) return e ? { host: e } : null;
      let n = e.slice(0, t), r = (0, scope.mm)(e.slice(t + 1));
      return !n || r == null ? null : { host: n, port: r };
    };
    scope.mm = function mm(e) {
      if (!/^\d+$/.test(e)) return null;
      let t = Number(e);
      return t > 0 && t <= 65535 ? t : null;
    };
    scope.hm = function hm(e) {
      if (!e) return {};
      let t = (0, scope._m)(e);
      if (!t.includes(`:`)) {
        let e2 = (0, scope.gm)(t);
        e2?.includes(`:`) && (t = e2);
      }
      let n = t.indexOf(`:`);
      if (n < 0) return t ? { username: t } : {};
      let r = t.slice(0, n), i = t.slice(n + 1);
      return { ...r ? { username: r } : {}, ...i ? { password: i } : {} };
    };
    scope.gm = function gm(e) {
      if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(e)) return null;
      try {
        let t = e.replace(/-/g, `+`).replace(/_/g, `/`);
        return (0, scope.cm)(atob(t.padEnd(Math.ceil(t.length / 4) * 4, `=`)));
      } catch {
        return null;
      }
    };
    scope._m = function _m(e) {
      try {
        return decodeURIComponent(e);
      } catch {
        return e;
      }
    };
    scope.vm = function vm(e) {
      return /^\s*proxies\s*:/m.test(e);
    };
    scope.ym = function ym(e) {
      let t = { nodes: [], skips: [] }, n = e.split(/\r?\n/), r = false, i = [], a = () => {
        if (!i.length) return;
        let e2 = (0, scope.bm)(
          i.join(`
`),
          t
        );
        e2 && t.nodes.push(e2), i = [];
      };
      for (let e2 of n)
        /^\s*proxies\s*:/.test(e2) ? r = true : r && (/^[^\s#-]/.test(e2) ? (a(), r = false) : /^\s*-\s/.test(e2) ? (a(), i.push(e2.replace(/^\s*-\s/, ``))) : i.length && e2.trim() && i.push(e2.trim()));
      return a(), t;
    };
    scope.bm = function bm(e, t) {
      let n = (0, scope.xm)(e, `type`)?.toLowerCase();
      if (!n) return null;
      let r = scope.rm[n];
      if (!r || !scope.em.has(r)) {
        let r2 = (0, scope.xm)(e, `name`);
        return t.skips.push({ reason: `unsupported-scheme`, scheme: n, ...r2 ? { name: r2 } : {} }), null;
      }
      let i = (0, scope.xm)(e, `server`), a = (0, scope.mm)((0, scope.xm)(e, `port`) ?? ``);
      if (!i || a == null) return t.skips.push({ reason: `malformed`, scheme: n }), null;
      let o = (0, scope.xm)(e, `tls`)?.toLowerCase() === `true`, s = r === `http` && o ? `https` : r, c2 = (0, scope.xm)(e, `username`), l = (0, scope.xm)(e, `password`);
      return {
        name: (0, scope.xm)(e, `name`) || `${i}:${a}`,
        scheme: (0, scope.Cd)({ scheme: s, host: i }),
        host: i,
        port: a,
        ...c2 ? { username: c2 } : {},
        ...l ? { password: l } : {}
      };
    };
    scope.xm = function xm(e, t) {
      let n = RegExp(`(?:^|[\\s{,])${t}\\s*:\\s*([^,}\\n]+)`, `i`).exec(e);
      if (!n) return null;
      let r = n[1].trim().replace(/\s+#.*$/, ``).trim(), i = /^(['"])(.*)\1$/.exec(r);
      return (i ? i[2] : r).trim() || null;
    };
    scope.Sm = function Sm(e, t) {
      let n = [
        ...new Set(
          e.filter((e2) => e2.reason === `unsupported-scheme` && e2.scheme).map((e2) => e2.scheme)
        )
      ];
      return {
        tone: `info`,
        text: `识别到 ${t} 个节点，都是浏览器不能直连的协议${n.length ? `（${n.join(`、`)}）` : ``}。已在下方列出它们：复制 listeners 配置 → 粘进 Clash Verge 的 Merge / 扩展配置 → 重载 → 回来点「加入代理池」。`,
        hint: `只想先用起来？展开下面的「检测一个本地端口」，默认 7897 就是 Clash 当前选中的出口（所有账号共用同一个出口）。`
      };
    };
    scope.Cm = function Cm({ onImport: e, onNamesParsed: t, onBusyChange: n }) {
      let [r, i] = (0, scope.k.useState)(``), [a, o] = (0, scope.k.useState)(``), [c2, u] = (0, scope.k.useState)(false), [d, f2] = (0, scope.k.useState)(null);
      async function p(n2) {
        let r2 = (0, scope.am)(n2);
        if (t?.(r2.unsupportedNames), !r2.nodes.length) {
          if (r2.unsupportedNames.length) {
            f2((0, scope.Sm)(r2.skipped, r2.unsupportedNames.length));
            return;
          }
          throw Error(`没有识别到代理地址，请使用 host:port 或 http/socks 地址`);
        }
        let i2 = await e(
          r2.nodes.map((e2) => (0, scope.wm)(e2.host) ? { ...e2, sourceLabel: `Clash Verge` } : e2)
        ), a2 = [
          i2.added ? `新增 ${i2.added} 个` : ``,
          i2.upgraded ? `补全 ${i2.upgraded} 个` : ``,
          i2.skipped ? `已有 ${i2.skipped} 个` : ``,
          r2.unsupportedNames.length ? `另有 ${r2.unsupportedNames.length} 个节点需要 Clash listener` : ``
        ].filter(Boolean);
        f2({ tone: `ok`, text: a2.length ? a2.join(`，`) : `代理已经在列表中` });
      }
      async function h() {
        if (r.trim() && !c2) {
          u(true), n?.(true), f2(null);
          try {
            let e2 = await (0, scope.cd)({ type: `FETCH_SUBSCRIPTION`, url: r.trim() });
            if (!e2.ok) throw Error(e2.error);
            await scope.ld.set(scope.ud.subscriptionSource, {
              url: r.trim(),
              autoSync: true,
              lastCheckedAt: Date.now()
            }).catch(() => {
            }), await p(e2.feature?.subscription?.text ?? ``);
          } catch (e2) {
            f2({ tone: `err`, text: e2 instanceof Error ? e2.message : `订阅导入失败` });
          } finally {
            u(false), n?.(false);
          }
        }
      }
      async function g() {
        if (a.trim() && !c2) {
          u(true), n?.(true), f2(null);
          try {
            await p(a);
          } catch (e2) {
            f2({ tone: `err`, text: e2 instanceof Error ? e2.message : `代理导入失败` });
          } finally {
            u(false), n?.(false);
          }
        }
      }
      return (0, scope.O.jsxs)(`div`, {
        className: `space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/40`,
        children: [
          (0, scope.O.jsxs)(`div`, {
            className: `flex items-center gap-2`,
            children: [
              (0, scope.O.jsx)(`span`, {
                className: `grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white`,
                children: (0, scope.O.jsx)(scope.s, { className: `size-4` })
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `min-w-0`,
                children: [
                  (0, scope.O.jsx)(`p`, {
                    className: `text-sm font-semibold text-slate-900 dark:text-slate-100`,
                    children: `订阅地址`
                  }),
                  (0, scope.O.jsx)(`p`, {
                    className: `mt-0.5 text-xs text-slate-500 dark:text-slate-400`,
                    children: `粘贴地址后直接导入`
                  })
                ]
              })
            ]
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `flex gap-2`,
            children: [
              (0, scope.O.jsx)(`input`, {
                value: r,
                onChange: (e2) => i(e2.target.value),
                onKeyDown: (e2) => {
                  e2.key === `Enter` && h();
                },
                placeholder: `https://...`,
                "aria-label": `代理订阅地址`,
                className: `h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100`
              }),
              (0, scope.O.jsxs)(`button`, {
                type: `button`,
                disabled: !r.trim() || c2,
                onClick: () => void h(),
                className: `flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 text-[13px] font-medium text-white hover:bg-blue-700 disabled:opacity-40`,
                children: [
                  c2 ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` }) : (0, scope.O.jsx)(scope.l, { className: `size-3.5` }),
                  `导入`
                ]
              })
            ]
          }),
          (0, scope.O.jsxs)(`details`, {
            className: `group`,
            children: [
              (0, scope.O.jsxs)(`summary`, {
                className: `flex cursor-pointer list-none items-center gap-1.5 text-[13px] font-medium text-slate-600 dark:text-slate-300`,
                children: [
                  (0, scope.O.jsx)(scope.Ru, { className: `size-3.5` }),
                  `直接粘贴代理地址`
                ]
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `mt-2 space-y-2`,
                children: [
                  (0, scope.O.jsx)(`textarea`, {
                    value: a,
                    onChange: (e2) => o(e2.target.value),
                    placeholder: `127.0.0.1:7890
socks5://127.0.0.1:7891`,
                    "aria-label": `代理地址列表`,
                    rows: 4,
                    className: `w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-[13px] leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100`
                  }),
                  (0, scope.O.jsxs)(`button`, {
                    type: `button`,
                    disabled: !a.trim() || c2,
                    onClick: () => void g(),
                    className: `flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 text-[13px] font-medium text-white hover:bg-blue-700 disabled:opacity-40`,
                    children: [
                      c2 ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` }) : (0, scope.O.jsx)(scope.Ru, { className: `size-3.5` }),
                      `导入这些地址`
                    ]
                  })
                ]
              })
            ]
          }),
          d && (0, scope.O.jsxs)(`div`, {
            role: `status`,
            className: (0, scope.$)(
              `space-y-1 rounded-md px-3 py-2 text-xs leading-relaxed`,
              d.tone === `ok` && `bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-300`,
              d.tone === `info` && `bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-300`,
              d.tone === `err` && `bg-rose-50 text-rose-700 dark:bg-rose-950/25 dark:text-rose-300`
            ),
            children: [
              (0, scope.O.jsx)(`p`, { children: d.text }),
              d.hint && (0, scope.O.jsx)(`p`, { className: `opacity-75`, children: d.hint })
            ]
          })
        ]
      });
    };
    scope.wm = function wm(e) {
      let t = e.trim().toLowerCase().replace(/^\[|\]$/g, ``);
      return t === `127.0.0.1` || t === `localhost` || t === `::1`;
    };
    scope.Tm = function Tm({ open: e, busy: t, onClose: n, children: r }) {
      let i = (0, scope.k.useRef)(null);
      return (0, scope.k.useEffect)(() => {
        let t2 = i.current;
        t2 && (e && !t2.open ? t2.showModal() : !e && t2.open && t2.close());
      }, [e]), (0, scope.O.jsx)(`dialog`, {
        ref: i,
        id: `proxy-import`,
        "aria-labelledby": `proxy-import-heading`,
        onCancel: (e2) => {
          e2.preventDefault(), t || n();
        },
        onClick: (e2) => {
          if (t || e2.target !== e2.currentTarget) return;
          let r2 = e2.currentTarget.getBoundingClientRect();
          (e2.clientX < r2.left || e2.clientX > r2.right || e2.clientY < r2.top || e2.clientY > r2.bottom) && n();
        },
        className: `fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/45 backdrop:backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100`,
        children: (0, scope.O.jsxs)(`div`, {
          className: `flex max-h-[calc(100dvh-2rem)] flex-col`,
          children: [
            (0, scope.O.jsxs)(`header`, {
              className: `flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800`,
              children: [
                (0, scope.O.jsxs)(`div`, {
                  children: [
                    (0, scope.O.jsx)(`h2`, {
                      id: `proxy-import-heading`,
                      className: `text-base font-semibold`,
                      children: `添加代理`
                    }),
                    (0, scope.O.jsx)(`p`, {
                      className: `mt-1 text-xs text-slate-500 dark:text-slate-400`,
                      children: `导入后自动加入代理列表。`
                    })
                  ]
                }),
                (0, scope.O.jsx)(`button`, {
                  type: `button`,
                  onClick: n,
                  disabled: t,
                  "aria-label": `关闭添加代理`,
                  className: `grid size-8 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800`,
                  children: (0, scope.O.jsx)(scope.y, { className: `size-4` })
                })
              ]
            }),
            (0, scope.O.jsx)(`div`, {
              className: `min-h-0 overflow-y-auto p-4 sm:p-5`,
              children: r
            }),
            (0, scope.O.jsx)(`footer`, {
              className: `flex shrink-0 justify-end border-t border-slate-200 px-5 py-3 dark:border-slate-800`,
              children: (0, scope.O.jsx)(`button`, {
                type: `button`,
                onClick: n,
                disabled: t,
                className: `h-9 rounded-lg bg-blue-600 px-5 text-[13px] font-medium text-white hover:bg-blue-700 disabled:opacity-40`,
                children: `完成`
              })
            })
          ]
        })
      });
    };
    scope.Em = function Em({
      proxies: e,
      accounts: n,
      sites: r,
      onAddMany: i,
      onSyncClash: a,
      onRemove: o,
      onAssign: s,
      onSetAccountProxy: l,
      compact: u = false,
      onReturn: f2
    }) {
      let [p, h] = (0, scope.k.useState)(``), [g, _] = (0, scope.k.useState)({}), [v2, y] = (0, scope.k.useState)(false), [b, w2] = (0, scope.k.useState)(null), T = (0, scope.k.useRef)(null), E = b !== null, [ee, D] = (0, scope.k.useState)(0), [A, j] = (0, scope.k.useState)(null), [M, N] = (0, scope.k.useState)(null), [P, ne] = (0, scope.k.useState)(null), [re, ie] = (0, scope.k.useState)([]), [ae, F] = (0, scope.k.useState)(``), [I, oe] = (0, scope.k.useState)(`accounts`), [se, L] = (0, scope.k.useState)(false), ce = (0, scope.k.useRef)(null), le = (0, scope.k.useRef)(null), R = (0, scope.k.useMemo)(() => e.filter((e2) => !(0, scope.xd)(e2)), [e]), z = (0, scope.k.useMemo)(() => {
        let t = p.trim().toLowerCase();
        return t ? e.filter((e2) => `${e2.name} ${e2.host}:${e2.port}`.toLowerCase().includes(t)) : e;
      }, [e, p]), ue = (0, scope.k.useMemo)(() => {
        let e2 = /* @__PURE__ */ new Map(), t = new Map(r.map((e3) => [e3.id, e3.proxyId]));
        for (let r2 of n) {
          let n2 = r2.proxyMode ?? `inherit`, i2 = n2 === `pool` ? r2.proxyId : n2 === `inherit` ? t.get(r2.siteId) : void 0;
          i2 && e2.set(i2, (e2.get(i2) ?? 0) + 1);
        }
        return e2;
      }, [n, r]);
      function de2(e2) {
        return !T.current && (T.current = e2, w2(e2), true);
      }
      function fe() {
        T.current = null, w2(null);
      }
      function pe2(e2, t) {
        e2 ? (de2(t), ne(null), t === `assign` && (j(null), N(null))) : T.current === t && fe();
      }
      async function me(e2) {
        _((t) => ({ ...t, [e2.id]: { state: `testing` } }));
        try {
          let t = await (0, scope.cd)({ type: `TEST_PROXY`, proxy: e2 }), n2 = t.ok ? t.test : void 0, r2 = {
            ok: n2?.ok === true,
            message: n2?.message || (n2?.ok ? `连接正常` : t.ok ? `未收到测试结果` : t.error),
            listenerProbe: n2?.listenerProbe ?? `unknown`
          };
          return _((t2) => ({ ...t2, [e2.id]: { state: r2.ok ? `ok` : `fail`, message: r2.message } })), r2;
        } catch (t) {
          let n2 = t instanceof Error ? t.message : `连接测试失败`;
          return _((t2) => ({ ...t2, [e2.id]: { state: `fail`, message: n2 } })), { ok: false, message: n2, listenerProbe: `unknown` };
        }
      }
      async function he2(e2) {
        if (!(0, scope.xd)(e2) && de2(`test`)) {
          j(null), N(null), ne(null);
          try {
            await me(e2);
          } finally {
            fe();
          }
        }
      }
      async function ge() {
        if (!R.length || !de2(`test-all`)) return;
        y(true), D(0), j(null), N(null), ne(null);
        let e2 = 0, t = [];
        try {
          for (let [n2, r2] of R.entries()) {
            let i2 = await me(r2);
            i2.ok && (e2 += 1), t.push({ port: r2.port, probe: i2.listenerProbe, test: i2 }), D(n2 + 1);
          }
          j({ passed: e2, total: R.length }), N((0, scope.gp)(t));
        } catch (e3) {
          ne(e3 instanceof Error ? e3.message : `连接测试失败，请重试。`);
        } finally {
          y(false), fe();
        }
      }
      async function _e2(e2) {
        if (de2(`remove`)) {
          ne(null);
          try {
            await o(e2.id), ae === e2.id && F(``), j(null), N(null);
          } catch (e3) {
            ne(e3 instanceof Error ? e3.message : `删除失败，请重试。`);
          } finally {
            fe();
          }
        }
      }
      function ve() {
        L(true);
      }
      function ye2(e2) {
        F(e2), oe(`accounts`), u && requestAnimationFrame(
          () => ce.current?.scrollIntoView?.({ behavior: `smooth`, block: `start` })
        );
      }
      return (0, scope.O.jsxs)(`div`, {
        className: (0, scope.$)(`w-full space-y-5 text-slate-900 dark:text-slate-100`, u && `p-3`),
        children: [
          (0, scope.O.jsxs)(`header`, {
            className: `flex flex-wrap items-center justify-between gap-3`,
            children: [
              (0, scope.O.jsxs)(`div`, {
                children: [
                  (0, scope.O.jsx)(`h1`, {
                    className: `text-xl font-bold tracking-tight`,
                    children: `代理与网络`
                  }),
                  (0, scope.O.jsx)(`p`, {
                    className: `mt-1.5 text-[13px] text-slate-500 dark:text-slate-400`,
                    children: `批量分配可用代理，也可以为账号单独指定。`
                  })
                ]
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `flex items-center gap-2`,
                children: [
                  u && f2 && (0, scope.O.jsx)(`button`, {
                    type: `button`,
                    onClick: f2,
                    disabled: E,
                    className: `h-9 rounded-lg border border-slate-200 px-3 text-xs font-medium hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-900`,
                    children: `返回总览`
                  }),
                  (0, scope.O.jsxs)(`button`, {
                    type: `button`,
                    onClick: ve,
                    disabled: E,
                    "aria-haspopup": `dialog`,
                    "aria-controls": `proxy-import`,
                    className: `inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900`,
                    children: [(0, scope.O.jsx)(scope.x, { className: `size-4` }), `添加代理`]
                  })
                ]
              })
            ]
          }),
          (0, scope.O.jsx)(scope.Tm, {
            open: se,
            busy: E,
            onClose: () => L(false),
            children: (0, scope.O.jsxs)(`fieldset`, {
              disabled: E,
              className: `min-w-0 space-y-3`,
              children: [
                (0, scope.O.jsx)(`legend`, { className: `sr-only`, children: `代理导入方式` }),
                (0, scope.O.jsx)(scope.Cm, {
                  onImport: i,
                  onNamesParsed: ie,
                  onBusyChange: (e2) => pe2(e2, `import`)
                }),
                re.length > 0 && (0, scope.O.jsx)(scope.Zp, { names: re, onImport: i }),
                (0, scope.O.jsxs)(`details`, {
                  ref: le,
                  className: `rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-900`,
                  children: [
                    (0, scope.O.jsx)(`summary`, {
                      className: `cursor-pointer text-[13px] font-medium`,
                      children: `检测一个本地端口`
                    }),
                    (0, scope.O.jsx)(`div`, {
                      className: `mt-3`,
                      children: (0, scope.O.jsx)(scope.$p, {
                        onImport: i,
                        onBusyChange: (e2) => pe2(e2, `import`)
                      })
                    })
                  ]
                }),
                (0, scope.O.jsxs)(`details`, {
                  className: `rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-900`,
                  children: [
                    (0, scope.O.jsx)(`summary`, {
                      className: `cursor-pointer text-[13px] font-medium`,
                      children: `其他导入方式`
                    }),
                    (0, scope.O.jsxs)(`div`, {
                      className: `mt-3 space-y-3`,
                      children: [
                        (0, scope.O.jsx)(scope.jp, { onSync: a, onMissingNames: ie }),
                        (0, scope.O.jsx)(scope.Yp, {
                          onSync: a,
                          onNamesRead: ie,
                          onUseLocalProxy: () => {
                            le.current && (le.current.open = true, le.current.scrollIntoView?.({ block: `nearest` }));
                          }
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          }),
          (0, scope.O.jsx)(scope.Ap, {
            proxies: R,
            pool: e,
            accounts: n,
            onAssign: s,
            disabled: E,
            onBusyChange: (e2) => pe2(e2, `assign`),
            onTestProxy: async (e2) => (await me(e2)).ok
          }),
          (0, scope.O.jsx)(`nav`, {
            "aria-label": `代理与账号`,
            className: `flex gap-1 rounded-lg bg-slate-200/60 p-1 xl:hidden dark:bg-slate-900`,
            children: [
              [`proxies`, `代理列表`, e.length],
              [`accounts`, `账号绑定`, n.length]
            ].map(
              ([e2, t, n2]) => (0, scope.O.jsxs)(
                `button`,
                {
                  type: `button`,
                  "aria-pressed": I === e2,
                  onClick: () => oe(e2),
                  className: (0, scope.$)(
                    `h-9 flex-1 rounded-md text-[13px] font-medium`,
                    I === e2 ? `bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300` : `text-slate-600 dark:text-slate-400`
                  ),
                  children: [t, ` · `, n2]
                },
                e2
              )
            )
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `grid items-start gap-5 xl:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.4fr)]`,
            children: [
              (0, scope.O.jsxs)(`section`, {
                id: `proxy-management`,
                className: (0, scope.$)(
                  `min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950`,
                  I !== `proxies` && `hidden xl:block`
                ),
                "aria-labelledby": `proxy-list-heading`,
                children: [
                  (0, scope.O.jsxs)(`header`, {
                    className: `flex flex-wrap items-center justify-between gap-2 px-4 pt-4`,
                    children: [
                      (0, scope.O.jsxs)(`h2`, {
                        id: `proxy-list-heading`,
                        className: `text-sm font-semibold`,
                        children: [
                          `代理列表 `,
                          (0, scope.O.jsx)(`span`, {
                            className: `ml-1 text-xs font-normal text-slate-500 dark:text-slate-400`,
                            children: e.length
                          })
                        ]
                      }),
                      (0, scope.O.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => void ge(),
                        disabled: !R.length || E,
                        className: `inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-40 dark:text-blue-300 dark:hover:bg-blue-950/40`,
                        children: [
                          v2 ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` }) : (0, scope.O.jsx)(scope.S, { className: `size-3.5` }),
                          v2 ? `测活中 ${ee}/${R.length}` : `全部测活`
                        ]
                      })
                    ]
                  }),
                  (0, scope.O.jsxs)(`div`, {
                    className: `space-y-3 px-4 pb-3 pt-3`,
                    children: [
                      (0, scope.O.jsxs)(`label`, {
                        className: `relative block`,
                        children: [
                          (0, scope.O.jsx)(scope.d, {
                            className: `pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400`
                          }),
                          (0, scope.O.jsx)(`input`, {
                            value: p,
                            onChange: (e2) => h(e2.target.value),
                            placeholder: `搜索代理名称或地址`,
                            "aria-label": `搜索代理出口`,
                            className: `h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[13px] outline-none placeholder:text-slate-400 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900`
                          })
                        ]
                      }),
                      (0, scope.O.jsx)(`p`, {
                        className: `text-xs text-slate-500 dark:text-slate-400`,
                        children: `点击代理名称，为账号指定此代理。`
                      }),
                      A && (0, scope.O.jsxs)(`p`, {
                        role: `status`,
                        className: `text-xs text-slate-600 dark:text-slate-300`,
                        children: [`测试完成，`, A.passed, `/`, A.total, ` 个连接正常。`]
                      }),
                      M && M.kind !== `ok` && (0, scope.O.jsxs)(`div`, {
                        role: `status`,
                        className: `rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800 dark:bg-amber-950/30 dark:text-amber-200`,
                        children: [
                          (0, scope.O.jsx)(`p`, { className: `font-medium`, children: M.title }),
                          M.hint && (0, scope.O.jsx)(`p`, { className: `mt-1`, children: M.hint })
                        ]
                      }),
                      P && (0, scope.O.jsx)(`p`, {
                        role: `alert`,
                        className: `text-xs text-rose-600 dark:text-rose-400`,
                        children: P
                      })
                    ]
                  }),
                  (0, scope.O.jsxs)(`div`, {
                    className: `max-h-[34rem] divide-y divide-slate-100 overflow-y-auto border-t border-slate-100 xl:max-h-[clamp(12rem,calc(100dvh_-_34rem),34rem)] dark:divide-slate-800 dark:border-slate-800`,
                    children: [
                      (0, scope.O.jsx)(scope.Bc, {
                        initial: false,
                        children: z.map((e2) => {
                          let n2 = g[e2.id] ?? { state: `idle` }, r2 = (0, scope.xd)(e2), i2 = !r2 && ae === e2.id, a2 = ue.get(e2.id) ?? 0;
                          return (0, scope.O.jsxs)(
                            scope.Mu.article,
                            {
                              "aria-label": `代理 ${e2.name}`,
                              initial: { opacity: 0 },
                              animate: { opacity: 1 },
                              exit: { opacity: 0 },
                              className: (0, scope.$)(
                                `border-l-2 px-3 py-3 transition-colors`,
                                i2 ? `border-l-blue-500 bg-blue-50/60 dark:bg-blue-950/25` : `border-l-transparent hover:bg-slate-50/70 dark:hover:bg-slate-900/40`
                              ),
                              children: [
                                (0, scope.O.jsxs)(`div`, {
                                  className: `flex items-start gap-2`,
                                  children: [
                                    (0, scope.O.jsxs)(`button`, {
                                      type: `button`,
                                      onClick: () => ye2(e2.id),
                                      disabled: r2 || E,
                                      "aria-pressed": i2,
                                      "aria-label": `绑定账号到 ${e2.name}`,
                                      className: `flex min-w-0 flex-1 items-start gap-2.5 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-default`,
                                      children: [
                                        (0, scope.O.jsx)(`span`, {
                                          className: (0, scope.$)(
                                            `mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg`,
                                            r2 ? `bg-amber-50 text-amber-600 dark:bg-amber-950/30` : i2 ? `bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300` : `bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400`
                                          ),
                                          children: r2 ? (0, scope.O.jsx)(scope.c, { className: `size-4` }) : (0, scope.O.jsx)(scope.te, { className: `size-4` })
                                        }),
                                        (0, scope.O.jsxs)(`span`, {
                                          className: `min-w-0 flex-1`,
                                          children: [
                                            (0, scope.O.jsx)(`span`, {
                                              title: e2.name,
                                              className: `block truncate text-[13px] font-semibold`,
                                              children: e2.name
                                            }),
                                            (0, scope.O.jsx)(`span`, {
                                              className: `mt-1 block truncate text-xs text-slate-500 dark:text-slate-400`,
                                              children: r2 ? `缺少代理地址，暂不能绑定` : `${(0, scope.Cd)(e2)}://${e2.host}:${e2.port}`
                                            })
                                          ]
                                        })
                                      ]
                                    }),
                                    (0, scope.O.jsxs)(`span`, {
                                      className: `pt-0.5 text-xs text-slate-500 dark:text-slate-400`,
                                      children: [a2, ` 个账号`]
                                    })
                                  ]
                                }),
                                (0, scope.O.jsxs)(`div`, {
                                  className: `mt-2 flex items-center gap-2 pl-10`,
                                  children: [
                                    (0, scope.O.jsx)(`span`, {
                                      title: n2.message,
                                      className: (0, scope.$)(
                                        `min-w-0 flex-1 truncate text-xs`,
                                        n2.state === `ok` ? `text-emerald-700 dark:text-emerald-400` : n2.state === `fail` ? `text-rose-600 dark:text-rose-400` : `text-slate-500 dark:text-slate-400`
                                      ),
                                      children: r2 ? `待补充` : n2.state === `testing` ? `测活中…` : n2.state === `idle` ? `未测活` : n2.message
                                    }),
                                    (0, scope.O.jsxs)(`button`, {
                                      type: `button`,
                                      onClick: () => void he2(e2),
                                      disabled: r2 || E,
                                      "aria-label": `测试 ${e2.name}`,
                                      title: `测活`,
                                      className: `inline-flex h-7 shrink-0 items-center gap-1 rounded px-1.5 text-xs text-blue-700 hover:bg-blue-50 disabled:opacity-35 dark:text-blue-300 dark:hover:bg-blue-950`,
                                      children: [
                                        n2.state === `testing` ? (0, scope.O.jsx)(scope.m, {
                                          className: `size-3.5 animate-spin`
                                        }) : n2.state === `ok` ? (0, scope.O.jsx)(scope.t, { className: `size-3.5` }) : n2.state === `fail` ? (0, scope.O.jsx)(scope.Pu, {
                                          className: `size-3.5`
                                        }) : (0, scope.O.jsx)(scope.S, {
                                          className: `size-3.5`
                                        }),
                                        `测活`
                                      ]
                                    }),
                                    (0, scope.O.jsx)(`button`, {
                                      type: `button`,
                                      onClick: () => void _e2(e2),
                                      disabled: E,
                                      "aria-label": `删除 ${e2.name}`,
                                      title: `删除代理`,
                                      className: `grid size-7 shrink-0 place-items-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-35 dark:hover:bg-rose-950/30`,
                                      children: (0, scope.O.jsx)(scope.C, {
                                        className: `size-3.5`
                                      })
                                    })
                                  ]
                                })
                              ]
                            },
                            e2.id
                          );
                        })
                      }),
                      !z.length && (0, scope.O.jsx)(`p`, {
                        className: `px-4 py-10 text-center text-[13px] text-slate-500 dark:text-slate-400`,
                        children: e.length ? `没有匹配的代理。` : `还没有代理，点击右上方“添加代理”。`
                      })
                    ]
                  })
                ]
              }),
              (0, scope.O.jsxs)(`section`, {
                ref: ce,
                id: `account-proxy-binding`,
                "aria-labelledby": `account-proxy-binding-heading`,
                className: (0, scope.$)(
                  `min-w-0 scroll-mt-20 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950`,
                  I !== `accounts` && `hidden xl:block`
                ),
                children: [
                  (0, scope.O.jsxs)(`header`, {
                    className: `border-b border-slate-100 px-4 py-4 dark:border-slate-800`,
                    children: [
                      (0, scope.O.jsxs)(`h2`, {
                        id: `account-proxy-binding-heading`,
                        className: `text-sm font-semibold`,
                        children: [
                          `账号绑定 `,
                          (0, scope.O.jsx)(`span`, {
                            className: `ml-1 text-xs font-normal text-slate-500 dark:text-slate-400`,
                            children: n.length
                          })
                        ]
                      }),
                      (0, scope.O.jsx)(`p`, {
                        className: `mt-1.5 text-xs text-slate-500 dark:text-slate-400`,
                        children: `查看当前代理，勾选账号后可批量指定。`
                      })
                    ]
                  }),
                  (0, scope.O.jsx)(scope._p, {
                    open: true,
                    initialProxyId: ae || void 0,
                    onProxyChange: F,
                    proxies: e,
                    accounts: n,
                    sites: r,
                    onAssign: s,
                    onSetAccountProxy: l,
                    disabled: E,
                    onBusyChange: (e2) => pe2(e2, `bind`),
                    onShowImport: ve
                  })
                ]
              })
            ]
          })
        ]
      });
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.$f = {
          [scope.nd.NEW_API]: { checkinPath: `/console/personal` },
          [scope.nd.SUB2API]: { checkinPath: `/check-in` },
          [scope.nd.VO_API_V2]: {},
          [scope.nd.UNSUPPORTED]: {}
        };
        break;
      }
      case 1: {
        scope.ep = /* @__PURE__ */ new Set([
          scope.td.NEW_API,
          scope.td.ONE_API,
          scope.td.VELOERA,
          scope.td.ONE_HUB,
          scope.td.DONE_HUB,
          scope.td.V_API,
          scope.td.VO_API,
          scope.td.SUPER_API,
          scope.td.RIX_API,
          scope.td.NEO_API,
          scope.td.ANYROUTER
        ]);
        break;
      }
      case 2: {
        scope.ap = `%APPDATA%\\io.github.clash-verge-rev.clash-verge-rev\\clash-verge.yaml`;
        break;
      }
      case 3: {
        scope.op = {
          mixed: `http`,
          http: `http`,
          socks: `socks5`,
          socks5: `socks5`,
          socks4: `socks4`
        };
        break;
      }
      case 4: {
        scope.bp = [
          { key: `hk`, label: `香港`, patterns: [/香港/, /\bHK[A-Z0-9-]*/i] },
          { key: `tw`, label: `台湾`, patterns: [/台湾|台灣/, /\bTW\b/i] },
          { key: `jp`, label: `日本`, patterns: [/日本/, /\bJP[A-Z0-9-]*/i] },
          { key: `kr`, label: `韩国`, patterns: [/韩国|韓國/, /\bKR\b/i] },
          { key: `sg`, label: `新加坡`, patterns: [/新加坡|狮城/, /\bSG[A-Z0-9-]*/i] },
          { key: `us`, label: `美国`, patterns: [/美国|美國/, /\bUS[A-Z0-9-]*/i, /\bLA\b/] },
          { key: `ca`, label: `加拿大`, patterns: [/加拿大/, /\bCA\b/i] },
          { key: `gb`, label: `英国`, patterns: [/英国|英國/, /\bUK\b|\bGB\b/i] },
          { key: `de`, label: `德国`, patterns: [/德国|德國/, /\bDE\b/i] },
          { key: `fr`, label: `法国`, patterns: [/法国|法國/, /\bFR\b/i] },
          { key: `nl`, label: `荷兰`, patterns: [/荷兰|荷蘭/, /\bNL\b/i] },
          { key: `ru`, label: `俄罗斯`, patterns: [/俄罗斯|俄羅斯/, /\bRU\b/i] },
          { key: `ua`, label: `乌克兰`, patterns: [/乌克兰|烏克蘭/, /\bUA\b/i] },
          { key: `tr`, label: `土耳其`, patterns: [/土耳其/, /\bTR\b/i] },
          { key: `in`, label: `印度`, patterns: [/印度/, /\bIN\b/] },
          { key: `vn`, label: `越南`, patterns: [/越南/, /\bVN\b/i] },
          { key: `th`, label: `泰国`, patterns: [/泰国|泰國/, /\bTH\b/i] },
          { key: `my`, label: `马来西亚`, patterns: [/马来|馬來/, /\bMY\b/i] },
          { key: `ph`, label: `菲律宾`, patterns: [/菲律宾|菲律賓/, /\bPH\b/i] },
          { key: `id`, label: `印尼`, patterns: [/印尼|印度尼西亚/, /\bID\b/i] },
          { key: `au`, label: `澳大利亚`, patterns: [/澳大利亚|澳洲/, /\bAU\b/i] },
          { key: `br`, label: `巴西`, patterns: [/巴西/, /\bBR\b/i] },
          { key: `ar`, label: `阿根廷`, patterns: [/阿根廷/, /\bAR\b/i] },
          { key: `ng`, label: `尼日利亚`, patterns: [/尼日利亚|尼日利亞/, /\bNG\b/i] },
          { key: `za`, label: `南非`, patterns: [/南非/, /\bZA\b/i] },
          { key: `ae`, label: `阿联酋`, patterns: [/阿联酋|迪拜/, /\bAE\b/i] },
          { key: `il`, label: `以色列`, patterns: [/以色列/, /\bIL\b/i] },
          { key: `ch`, label: `瑞士`, patterns: [/瑞士/, /\bCH\b/i] },
          { key: `se`, label: `瑞典`, patterns: [/瑞典/, /\bSE\b/i] },
          { key: `es`, label: `西班牙`, patterns: [/西班牙/, /\bES\b/i] },
          { key: `it`, label: `意大利`, patterns: [/意大利/, /\bIT\b/i] },
          { key: `pl`, label: `波兰`, patterns: [/波兰|波蘭/, /\bPL\b/i] },
          { key: `mx`, label: `墨西哥`, patterns: [/墨西哥/, /\bMX\b/i] },
          { key: `cn`, label: `中国大陆`, patterns: [/中国大陆|回国|大陆/] }
        ];
        break;
      }
      case 5: {
        scope.xp = { key: `other`, label: `未识别` };
        break;
      }
      case 6: {
        scope.kp = [
          {
            value: `unassigned`,
            label: `保留手动绑定`,
            hint: `分配其余账号，保留手动绑定、直连和自定义代理`
          },
          { value: `all`, label: `全部重新分配`, hint: `覆盖已有绑定，包括直连和自定义地址` }
        ];
        break;
      }
      case 7: {
        scope.Mp = `clashControllerSettings`;
        break;
      }
      case 8: {
        scope.Np = `127.0.0.1:9097`;
        break;
      }
      case 9: {
        scope.Pp = /* @__PURE__ */ new Set([`http:`, `https:`]);
        break;
      }
      case 10: {
        scope.Ip = 7901;
        break;
      }
      case 11: {
        scope.Lp = [
          1053,
          7890,
          7891,
          7897,
          7898,
          7899,
          ...Array.from({ length: 10 }, (e, t) => 9090 + t)
        ];
        break;
      }
      case 12: {
        scope.Rp = scope.Ip;
        break;
      }
      case 13: {
        scope.zp = `127.0.0.1`;
        break;
      }
      case 14: {
        scope.Bp = 65535;
        break;
      }
      case 15: {
        scope.Gp = RegExp(`[\\u0000-\\u001f\\u007f\\u0085\u2028\u2029]`, `g`);
        break;
      }
      case 16: {
        scope.Qp = [
          { value: `http`, label: `HTTP` },
          { value: `socks5`, label: `SOCKS5` }
        ];
        break;
      }
      case 17: {
        scope.em = /* @__PURE__ */ new Set([`http`, `https`, `socks4`, `socks5`]);
        break;
      }
      case 18: {
        scope.tm = [
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
      case 19: {
        scope.rm = {
          http: `http`,
          https: `https`,
          socks: `socks5`,
          socks4: `socks4`,
          socks5: `socks5`,
          socks5h: `socks5`
        };
        break;
      }
      case 20: {
        scope.im = { http: 80, https: 443, socks4: 1080, socks5: 1080 };
        break;
      }
    }
  },
  storeProperties: {}
});
var appRuntime5 = createUiModuleRuntime({
  bindingNames: ["vr", "yr", "br", "xr", "Ni", "Pi", "Fi"],
  register(scope) {
    scope.vr = function vr(e, t) {
      let n = new Set(t), r = Object.entries(e).filter(([e2]) => n.has(e2));
      return r.length === Object.keys(e).length ? e : Object.fromEntries(r);
    };
    scope.yr = function yr(e) {
      return e.replace(/^\s*[[［(（]\s*[A-Za-z]{2}\s*[\]］)）]\s*/u, ``).replace(/[(（]\s*\d{2,5}\s*[)）]\s*$/u, ``).replace(/[\s_\-—－]+/gu, ``).toLowerCase().trim();
    };
    scope.br = function br(e) {
      let t = e.host.trim().toLowerCase(), n = t.startsWith(`[`) && t.endsWith(`]`) ? t.slice(1, -1) : t;
      return n === `localhost` || n === `127.0.0.1` || n === `::1` || n === `0:0:0:0:0:0:0:1` ? `local-listener:${e.port}` : `${e.scheme}://${n}:${e.port}`;
    };
    scope.xr = function xr(e, t) {
      let n = /* @__PURE__ */ new Map();
      for (let t2 of e) {
        if (t2.nameOnly !== true) continue;
        let e2 = (0, scope.yr)(t2.name);
        if (!e2) continue;
        let r2 = n.get(e2) ?? [];
        r2.push(t2), n.set(e2, r2);
      }
      let r = /* @__PURE__ */ new Map();
      for (let t2 of e) {
        if (t2.nameOnly === true) continue;
        let e2 = (0, scope.br)(t2), n2 = r.get(e2) ?? [];
        n2.push(t2), r.set(e2, n2);
      }
      let i = [], a = [], o = [], s = /* @__PURE__ */ new Set(), c2 = /* @__PURE__ */ new Set();
      for (let e2 of t) {
        if (e2.nameOnly === true) {
          o.push(e2);
          continue;
        }
        let t2 = (0, scope.br)(e2);
        if (c2.has(t2)) continue;
        c2.add(t2);
        let l = (0, scope.yr)(e2.name), u = l ? n.get(l) ?? [] : [], d = l && !s.has(l) ? u[0] : void 0, f2 = r.get(t2) ?? [];
        if (f2.length) {
          if (e2.sourceLabel !== `Clash Verge`) continue;
          if (d) {
            s.add(l), i.push({
              id: d.id,
              patch: {
                name: e2.name,
                scheme: e2.scheme,
                host: e2.host,
                port: e2.port,
                sourceLabel: e2.sourceLabel
              }
            });
            for (let e3 of u) e3.id !== d.id && a.push({ fromId: e3.id, toId: d.id });
            for (let e3 of f2) e3.id !== d.id && a.push({ fromId: e3.id, toId: d.id });
            continue;
          }
          let t3 = f2[0], n2 = f2.slice(1);
          (t3.name !== e2.name || t3.sourceLabel !== e2.sourceLabel || n2.length) && i.push({ id: t3.id, patch: { name: e2.name, sourceLabel: e2.sourceLabel } });
          for (let e3 of n2) a.push({ fromId: e3.id, toId: t3.id });
        } else if (d) {
          s.add(l), i.push({
            id: d.id,
            patch: {
              name: e2.name,
              scheme: e2.scheme,
              host: e2.host,
              port: e2.port,
              ...e2.sourceLabel === void 0 ? {} : { sourceLabel: e2.sourceLabel }
            }
          });
          for (let e3 of u) e3.id !== d.id && a.push({ fromId: e3.id, toId: d.id });
        } else o.push(e2);
      }
      return { upgrades: i, merges: a, additions: o };
    };
    scope.Ni = function Ni(e) {
      return new Set(e.filter((e2) => e2.nameOnly !== true).map((e2) => e2.id));
    };
    scope.Pi = function Pi(e, t, n, r, i) {
      let { upgrades: a, merges: o, additions: s } = (0, scope.xr)(e, r), c2 = new Map(a.map((e2) => [e2.id, e2.patch])), l = new Map(o.map(({ fromId: e2, toId: t2 }) => [e2, t2])), u = new Set(l.keys()), d = (e2) => e2.nameOnly ? `name:${e2.name.trim()}` : (0, scope.br)(e2), f2 = e.flatMap((e2) => {
        if (u.has(e2.id)) return [];
        let t2 = c2.get(e2.id);
        if (!t2) return [e2];
        let { nameOnly: n2, ...r2 } = e2;
        return [{ ...r2, ...t2 }];
      }), p = new Set(f2.map(d)), m = [];
      for (let e2 of s) {
        let t2 = d(e2);
        p.has(t2) || (p.add(t2), m.push({ ...e2, id: (0, scope.Ft)(`px`) }));
      }
      let h = i ? new Set(r.filter((e2) => e2.nameOnly !== true).map(scope.br)) : void 0, g = i ? new Set(r.filter((e2) => e2.nameOnly === true).map((e2) => (0, scope.yr)(e2.name))) : void 0, _ = /* @__PURE__ */ new Set();
      for (let e2 of t) e2.proxyId && _.add(e2.proxyId);
      for (let e2 of n) e2.proxyId && _.add(e2.proxyId);
      let v2 = /* @__PURE__ */ new Set(), y = 0;
      return {
        proxies: f2.concat(m).filter(
          (e2) => !i || e2.sourceLabel !== i || e2.nameOnly !== true && h?.has((0, scope.br)(e2)) || e2.nameOnly === true && g?.has((0, scope.yr)(e2.name)) ? true : _.has(e2.id) ? (y += 1, true) : (v2.add(e2.id), false)
        ),
        accounts: t.map((e2) => {
          if (!e2.proxyId) return e2;
          let t2 = l.get(e2.proxyId);
          if (t2) return { ...e2, proxyId: t2 };
          if (!v2.has(e2.proxyId)) return e2;
          let n2 = { ...e2, proxyMode: `inherit` };
          return delete n2.proxyId, delete n2.proxyPinned, n2;
        }),
        sites: n.map((e2) => {
          if (!e2.proxyId) return e2;
          let t2 = l.get(e2.proxyId);
          return t2 ? { ...e2, proxyId: t2 } : v2.has(e2.proxyId) ? { ...e2, proxyId: void 0 } : e2;
        }),
        added: m.length,
        skipped: r.length - m.length - a.length,
        upgraded: a.length,
        removed: v2.size,
        keptInUse: y,
        changed: m.length > 0 || a.length > 0 || u.size > 0 || v2.size > 0
      };
    };
    scope.Fi = function Fi(e, t) {
      if (e && !t.has(e)) throw Error(`只能绑定有真实 HTTP/SOCKS 出口的代理；仅名称条目不能分配`);
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
    }
  },
  storeProperties: {
    store_Li_addProxy(scope) {
      return {
        addProxy(e) {
          return (0, scope.X)(async () => {
            let t = await scope.z.get(scope.M.proxies, []);
            await scope.z.set(scope.M.proxies, t.concat({ ...e, id: (0, scope.Ft)(`px`) }));
          });
        }
      };
    },
    store_Li_addProxies(scope) {
      return {
        addProxies(e) {
          return (0, scope.X)(async () => {
            let [t, n, r] = await Promise.all([
              scope.z.get(scope.M.proxies, []),
              scope.z.get(scope.M.accounts, []),
              scope.z.get(scope.M.sites, [])
            ]), i = (0, scope.Pi)(t, n, r, e);
            if (i.changed) {
              let e2 = { [scope.M.proxies]: i.proxies };
              i.accounts.some((e3, t2) => e3 !== n[t2]) && (e2[scope.M.accounts] = i.accounts), i.sites.some((e3, t2) => e3 !== r[t2]) && (e2[scope.M.sites] = i.sites), await scope.z.setMany(e2);
            }
            return { added: i.added, skipped: i.skipped, upgraded: i.upgraded };
          });
        }
      };
    },
    store_Li_syncClashProxies(scope) {
      return {
        syncClashProxies(e) {
          return (0, scope.X)(async () => {
            let [t, n, r] = await Promise.all([
              scope.z.get(scope.M.proxies, []),
              scope.z.get(scope.M.accounts, []),
              scope.z.get(scope.M.sites, [])
            ]), i = (0, scope.Pi)(t, n, r, e, `Clash Verge`);
            return i.changed && await scope.z.setMany({
              [scope.M.proxies]: i.proxies,
              [scope.M.accounts]: i.accounts,
              [scope.M.sites]: i.sites
            }), {
              added: i.added,
              skipped: i.skipped,
              upgraded: i.upgraded,
              removed: i.removed,
              keptInUse: i.keptInUse
            };
          });
        }
      };
    },
    store_Li_updateProxy(scope) {
      return {
        updateProxy(e, t) {
          return (0, scope.X)(async () => {
            let n = await scope.z.get(scope.M.proxies, []);
            await scope.z.set(
              scope.M.proxies,
              n.map((n2) => n2.id === e ? { ...n2, ...t } : n2)
            );
          });
        }
      };
    },
    store_Li_removeProxy(scope) {
      return {
        removeProxy(e) {
          return (0, scope.X)(async () => {
            let [t, n, r] = await Promise.all([
              scope.z.get(scope.M.proxies, []),
              scope.z.get(scope.M.sites, []),
              scope.z.get(scope.M.accounts, [])
            ]);
            await scope.z.setMany({
              [scope.M.proxies]: t.filter((t2) => t2.id !== e),
              [scope.M.sites]: n.map((t2) => t2.proxyId === e ? { ...t2, proxyId: void 0 } : t2),
              [scope.M.accounts]: r.map((t2) => {
                if (t2.proxyId !== e) return t2;
                let n2 = { ...t2, proxyMode: `inherit` };
                return delete n2.proxyId, n2;
              })
            });
          });
        }
      };
    },
    store_Li_assignAccountProxies(scope) {
      return {
        assignAccountProxies(e) {
          return (0, scope.X)(async () => {
            let [t, n] = await Promise.all([
              scope.z.get(scope.M.accounts, []),
              scope.z.get(scope.M.proxies, [])
            ]), r = (0, scope.Ni)(n), i = new Map(e.filter((e2) => r.has(e2.proxyId)).map((e2) => [e2.accountId, e2]));
            if (!i.size) return { assigned: 0 };
            let a = 0, o = t.map((e2) => {
              let t2 = i.get(e2.id);
              if (!t2) return e2;
              a += 1;
              let n2 = (0, scope.Ii)(e2, { proxyMode: `pool`, proxyId: t2.proxyId });
              if (t2.pinned) return { ...n2, proxyPinned: true };
              let { proxyPinned: r2, ...o2 } = n2;
              return o2;
            });
            return a && await scope.z.set(scope.M.accounts, o), { assigned: a };
          });
        }
      };
    },
    store_Ui_addProxy(scope, e, t) {
      return {
        async addProxy(e2) {
          await (0, scope.Vi)({ action: `add-proxy`, input: e2 }), await t().load();
        }
      };
    },
    store_Ui_addProxies(scope, e, t) {
      return {
        async addProxies(e2) {
          if (e2.length === 0) return { added: 0, skipped: 0, upgraded: 0 };
          let n = await (0, scope.Vi)({ action: `add-proxies`, inputs: e2 }), r = { added: n.added ?? 0, skipped: n.skipped ?? e2.length, upgraded: n.upgraded ?? 0 };
          return (r.added || r.upgraded) && await t().load(), r;
        }
      };
    },
    store_Ui_syncClashProxies(scope, e, t) {
      return {
        async syncClashProxies(e2) {
          let n = await (0, scope.H)({ type: `SYNC_CLASH_PROXIES`, inputs: e2 });
          if (!n.ok) throw Error(n.error);
          let r = n.feature?.clashConfigSync ?? {
            added: 0,
            skipped: e2.length,
            upgraded: 0,
            removed: 0,
            keptInUse: 0
          };
          return await t().load(), r;
        }
      };
    },
    store_Ui_updateProxy(scope, e, t) {
      return {
        async updateProxy(e2, n) {
          await (0, scope.Vi)({ action: `update-proxy`, proxyId: e2, patch: n }), await t().load();
        }
      };
    },
    store_Ui_removeProxy(scope, e, t) {
      return {
        async removeProxy(e2) {
          await (0, scope.Vi)({ action: `remove-proxy`, proxyId: e2 }), await t().load();
        }
      };
    },
    store_Ui_assignAccountProxies(scope, e, t) {
      return {
        async assignAccountProxies(e2) {
          if (e2.length === 0) return 0;
          let n = (await (0, scope.Vi)({ action: `assign-account-proxies`, assignments: e2 })).assigned ?? 0;
          return n && await t().load(), n;
        }
      };
    }
  }
});

// src/modules/accounts/batch-input.js
function detectDelimiter(text) {
  let quoted = false;
  let commas = false;
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') index++;
      else quoted = !quoted;
    } else if (!quoted && character === "	") {
      return "	";
    } else if (!quoted && character === ",") {
      commas = true;
    }
  }
  return commas ? "," : null;
}
function readRecords(text, delimiter) {
  const records = [];
  let fields = [];
  let value = "";
  let quoted = false;
  let afterQuote = false;
  let problem = "";
  let line = 1;
  let startLine = 1;
  function finishField() {
    fields.push(value);
    value = "";
    afterQuote = false;
  }
  function finishRecord() {
    finishField();
    if (problem || fields.some((field) => field.trim() !== "")) {
      records.push({ line: startLine, fields, problem });
    }
    fields = [];
    problem = "";
    startLine = line + 1;
  }
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          value += '"';
          index++;
        } else {
          quoted = false;
          afterQuote = true;
        }
      } else {
        value += character;
        if (character === "\n") line++;
      }
      continue;
    }
    if (delimiter && character === delimiter) {
      finishField();
    } else if (character === "\n" || character === "\r") {
      finishRecord();
      if (character === "\r" && text[index + 1] === "\n") index++;
      line++;
    } else if (afterQuote) {
      if (character !== " ") problem = "双引号后只能是分隔符或换行";
    } else if (character === '"') {
      if (value.trim() === "") {
        value = "";
        quoted = true;
      } else {
        problem = "双引号需要包住整个字段";
      }
    } else {
      value += character;
    }
  }
  if (quoted) problem = "双引号未闭合";
  if (value || fields.length || problem) finishRecord();
  return records;
}
function hasHeader(record) {
  const [username, password, label] = record.fields.map((field) => field.trim().toLowerCase());
  return !record.problem && ["账号", "用户名", "username", "account", "email", "邮箱"].includes(username) && ["密码", "password"].includes(password) && (label === void 0 || ["备注", "名称", "label", "note", "remark"].includes(label));
}
function parseAccountBatch(text, { siteId = "", uniformPassword = "", accounts = [] } = {}) {
  const content = String(text ?? "").replace(/^\uFEFF/, "");
  const delimiter = detectDelimiter(content);
  const records = readRecords(content, delimiter);
  if (records[0] && hasHeader(records[0])) records.shift();
  const existing = new Set(
    accounts.filter((account) => account.siteId === siteId).map(
      (account) => String(account.username ?? "").trim().toLowerCase()
    )
  );
  const seen = /* @__PURE__ */ new Set();
  const inputs = [];
  const rows = records.map((record) => {
    const username = record.problem ? "" : record.fields[0]?.trim() ?? "";
    const password = record.fields[1] || uniformPassword;
    const label = record.problem ? "" : record.fields[2]?.trim() ?? "";
    const row = {
      line: record.line,
      username,
      label,
      status: "invalid",
      message: "",
      passwordSource: record.fields[1] ? "row" : uniformPassword ? "uniform" : "missing"
    };
    if (record.problem) row.message = record.problem;
    else if (record.fields.length > 3) row.message = "最多填写账号、密码、备注三列";
    else if (!siteId) row.message = "请先选择所属站点";
    else if (!username) row.message = "缺少账号";
    else if (!password) row.message = "缺少密码，可填写统一密码";
    else if (existing.has(username.toLowerCase())) {
      row.status = "existing";
      row.message = "此站点已保存该账号";
    } else if (seen.has(username.toLowerCase())) {
      row.status = "duplicate";
      row.message = "与前面的有效账号重复";
    } else {
      seen.add(username.toLowerCase());
      row.status = "valid";
      row.message = "可以保存";
      inputs.push({ siteId, username, password, ...label ? { label } : {} });
    }
    return row;
  });
  const counts = { total: rows.length, valid: 0, invalid: 0, duplicate: 0, existing: 0 };
  for (const row of rows) counts[row.status]++;
  counts.skipped = counts.invalid + counts.duplicate + counts.existing;
  return { delimiter, rows, inputs, counts };
}

// src/modules/accounts/view.js
var AccountsOverview;
var sharedUiRuntime6 = createUiModuleRuntime({
  bindingNames: ["Mm"],
  publish(name, value) {
    switch (name) {
      case "Mm":
        AccountsOverview = value;
        break;
    }
  },
  register(scope) {
    scope.Mm = function Mm({
      sites: e,
      accounts: n,
      statusOf: r,
      balanceOf: i,
      refreshingBalanceIds: o,
      onRunAccount: s,
      onRefreshBalance: c2,
      onToast: l
    }) {
      let [u, p] = (0, scope.k.useState)(``), [m, g] = (0, scope.k.useState)(`全部`), y = (0, scope.k.useMemo)(() => new Map(e.map((e2) => [e2.id, e2.name])), [e]), b = (0, scope.k.useMemo)(() => new Map(e.map((e2) => [e2.id, e2])), [e]), x = n.filter((e2) => {
        let t = b.get(e2.siteId), n2 = `${e2.username} ${e2.label ?? ``} ${t?.name ?? ``}`.toLowerCase();
        return u.trim() && !n2.includes(u.trim().toLowerCase()) ? false : m === `未获取余额` ? i(e2.id) == null : m === `需处理` ? r(e2.id) === `attention` : m !== `已完成` || r(e2.id) === `done`;
      }), S = n.filter((e2) => i(e2.id) == null).length, C2 = n.filter((e2) => r(e2.id) === `attention`).length;
      return (0, scope.O.jsxs)(`div`, {
        className: `space-y-4`,
        children: [
          (0, scope.O.jsxs)(`div`, {
            children: [
              (0, scope.O.jsx)(`h1`, {
                className: `text-xl font-bold tracking-tight`,
                children: `账号总览`
              }),
              (0, scope.O.jsx)(`p`, {
                className: `mt-1 text-[11px] text-ink-800/55 dark:text-ink-100/50`,
                children: `所有站点的账号放进一张表，按余额是否取到、是否需要人工处理来筛。`
              })
            ]
          }),
          (0, scope.O.jsxs)(`section`, {
            className: `grid gap-3 sm:grid-cols-2 xl:grid-cols-4`,
            "aria-label": `账号统计`,
            children: [
              (0, scope.O.jsx)(scope.jm, {
                label: `账号总数`,
                value: n.length,
                detail: `${e.length} 个站点`,
                tone: `blue`,
                icon: scope.h
              }),
              (0, scope.O.jsx)(scope.jm, {
                label: `余额未获取`,
                value: S,
                detail: S ? `点行尾刷新重试` : `全部已获取`,
                tone: `amber`,
                icon: scope.a
              }),
              (0, scope.O.jsx)(scope.jm, {
                label: `需处理`,
                value: C2,
                detail: `等待人工验证`,
                tone: `coral`,
                icon: scope._
              }),
              (0, scope.O.jsx)(scope.jm, {
                label: `已完成`,
                value: n.filter((e2) => r(e2.id) === `done`).length,
                detail: `今日已签到`,
                tone: `mint`,
                icon: scope.t
              })
            ]
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `flex flex-wrap items-center gap-2`,
            children: [
              (0, scope.O.jsx)(`div`, {
                className: `flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900`,
                role: `tablist`,
                "aria-label": `账号筛选`,
                children: [`全部`, `未获取余额`, `需处理`, `已完成`].map(
                  (e2) => (0, scope.O.jsx)(
                    `button`,
                    {
                      type: `button`,
                      "aria-selected": m === e2,
                      onClick: () => g(e2),
                      className: (0, scope.$)(
                        `h-7 rounded-md px-2.5 text-[11px] font-medium transition-colors`,
                        m === e2 ? `bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300` : `text-ink-800/55 hover:text-ink-900 dark:text-ink-100/50`
                      ),
                      children: e2
                    },
                    e2
                  )
                )
              }),
              (0, scope.O.jsxs)(`label`, {
                className: `relative min-w-52 flex-1 sm:max-w-xs`,
                children: [
                  (0, scope.O.jsx)(scope.d, {
                    "aria-hidden": `true`,
                    className: `pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-800/35 dark:text-ink-100/35`
                  }),
                  (0, scope.O.jsx)(`input`, {
                    value: u,
                    onChange: (e2) => p(e2.target.value),
                    "aria-label": `搜索账号`,
                    placeholder: `搜索账号、标签或站点`,
                    className: `h-9 w-full rounded-lg border border-black/8 bg-white pl-8 pr-3 text-[11px] outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 dark:border-white/10 dark:bg-slate-900`
                  })
                ]
              })
            ]
          }),
          (0, scope.O.jsxs)(`section`, {
            className: `overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950`,
            "aria-label": `账号列表`,
            children: [
              x.map((e2) => {
                let t = r(e2.id), n2 = i(e2.id), a = b.get(e2.siteId), l2 = a ? (0, scope.ip)(a) : void 0, u2 = o?.has(e2.id) ?? false;
                return (0, scope.O.jsxs)(
                  `div`,
                  {
                    className: `grid grid-cols-2 items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 md:grid-cols-[minmax(140px,1.4fr)_minmax(120px,1fr)_88px_130px_96px] dark:border-slate-800/70`,
                    children: [
                      (0, scope.O.jsxs)(`span`, {
                        className: `min-w-0 truncate text-xs font-semibold text-ink-900 dark:text-ink-50`,
                        children: [
                          e2.label || e2.username,
                          e2.label && (0, scope.O.jsx)(`span`, {
                            className: `ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-ink-800/55 dark:bg-slate-800 dark:text-ink-100/50`,
                            children: e2.username
                          })
                        ]
                      }),
                      (0, scope.O.jsx)(`span`, {
                        className: `min-w-0 truncate text-[11px] text-ink-800/60 dark:text-ink-100/55`,
                        children: y.get(e2.siteId) ?? `未知站点`
                      }),
                      (0, scope.O.jsx)(`span`, {
                        className: (0, scope.$)(
                          `inline-flex h-fit w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold`,
                          scope.Am[t]
                        ),
                        children: scope.km[t]
                      }),
                      (0, scope.O.jsx)(`span`, {
                        className: `text-[11px] font-semibold tabular-nums text-amber-700 dark:text-amber-300`,
                        children: n2 ? (0, scope.hd)(
                          n2.quota,
                          { quotaPerUnit: a?.adapter?.quotaPerUnit, family: l2?.family },
                          n2.symbol
                        ) : (0, scope.O.jsx)(`span`, {
                          className: `font-medium text-ink-800/45 dark:text-ink-100/40`,
                          children: `未获取`
                        })
                      }),
                      (0, scope.O.jsxs)(`span`, {
                        className: `flex items-center justify-end gap-1.5`,
                        children: [
                          (0, scope.O.jsx)(`button`, {
                            type: `button`,
                            "aria-label": `执行 ${e2.username}`,
                            title: `执行`,
                            onClick: () => s(e2.id),
                            className: `grid size-7 place-items-center rounded-md text-ink-800/50 ring-1 ring-black/5 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-ink-100/50 dark:ring-white/10`,
                            children: (0, scope.O.jsx)(scope.v, { className: `size-3.5` })
                          }),
                          (0, scope.O.jsx)(`button`, {
                            type: `button`,
                            "aria-label": `刷新 ${e2.username} 的余额`,
                            title: `刷新余额`,
                            disabled: u2,
                            onClick: () => c2(e2.id),
                            className: `grid size-7 place-items-center rounded-md text-ink-800/50 ring-1 ring-black/5 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:opacity-45 dark:text-ink-100/50 dark:ring-white/10`,
                            children: (0, scope.O.jsx)(scope.f, {
                              className: (0, scope.$)(`size-3.5`, u2 && `animate-spin`)
                            })
                          })
                        ]
                      })
                    ]
                  },
                  e2.id
                );
              }),
              !x.length && (0, scope.O.jsxs)(`div`, {
                className: `flex flex-col items-center gap-2 px-4 py-14 text-center`,
                children: [
                  (0, scope.O.jsx)(scope.h, {
                    className: `size-6 text-ink-800/25 dark:text-ink-100/20`
                  }),
                  (0, scope.O.jsx)(`strong`, {
                    className: `text-xs text-ink-800/70 dark:text-ink-100/60`,
                    children: `没有匹配的账号`
                  }),
                  (0, scope.O.jsx)(`span`, {
                    className: `text-[11px] text-ink-800/45 dark:text-ink-100/40`,
                    children: `换个关键词或筛选条件`
                  })
                ]
              })
            ]
          }),
          x.length === 0 && n.length > 0 && (0, scope.O.jsxs)(`p`, {
            className: `text-[11px] text-ink-800/45 dark:text-ink-100/40`,
            children: [
              `提示：账号添加入口在总览页顶部工具栏的 `,
              `'`,
              `添加账号`,
              `'`,
              ` 按钮。`
            ]
          })
        ]
      });
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
    }
  },
  storeProperties: {}
});
var AccountRow;
var AccountEditor;
var AccountImportDialog;
var parsePasswordCsv;
var matchImportedAccounts;
var RecoverAccountsPanel;
var SavedCredentialsPanel;
var appRuntime6 = createUiModuleRuntime({
  bindingNames: [
    "Pr",
    "Fr",
    "Ir",
    "Lr",
    "Rr",
    "zr",
    "Br",
    "Ii",
    "Aa",
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
    "Qs",
    "$s",
    "ec",
    "tc",
    "Nl",
    "Pl",
    "Fl",
    "Il",
    "Ll",
    "Rl",
    "zl",
    "Ql",
    "iu",
    "au"
  ],
  publish(name, value) {
    switch (name) {
      case "Aa":
        AccountRow = value;
        break;
      case "ms":
        AccountEditor = value;
        break;
      case "bs":
        AccountImportDialog = value;
        break;
      case "hs":
        parsePasswordCsv = value;
        break;
      case "gs":
        matchImportedAccounts = value;
        break;
      case "au":
        RecoverAccountsPanel = value;
        break;
      case "ls":
        SavedCredentialsPanel = value;
        break;
    }
  },
  register(scope) {
    scope.Fr = function Fr(e) {
      try {
        return e.id === `real-sharedchat` || new URL(e.loginUrl).hostname === `new.sharedchat.cc`;
      } catch {
        return e.id === `real-sharedchat`;
      }
    };
    scope.Ir = function Ir(e) {
      return e.map((e2) => {
        let t = e2;
        if (!Object.prototype.hasOwnProperty.call(t, `checkinMethod`)) return e2;
        let { checkinMethod: n, ...r } = t;
        return r;
      });
    };
    scope.Lr = function Lr(e) {
      let t = /* @__PURE__ */ new Map();
      for (let n of e) {
        let e2 = n.identity?.userId?.trim();
        if (!e2) continue;
        let r = `${n.siteId}\0${e2}`, i = t.get(r) ?? [];
        i.push(n.id), t.set(r, i);
      }
      return new Set([...t.values()].filter((e2) => e2.length > 1).flat());
    };
    scope.Rr = function Rr(e) {
      return { ...e, identity: e.identity?.session ? { session: e.identity.session } : void 0 };
    };
    scope.zr = function zr(e) {
      try {
        return new URL(e.loginUrl).hostname.toLowerCase();
      } catch {
        return ``;
      }
    };
    scope.Br = function Br(e) {
      return (0, scope.zr)(e) === `agentrouter.org` || (0, scope.zr)(e) === `ps.air-outer.com`;
    };
    scope.Ii = function Ii(e, t) {
      let n = { ...e, ...t, id: e.id };
      return `loginMethod` in t && !t.loginMethod && delete n.loginMethod, `proxyMode` in t && t.proxyMode !== `pool` && (delete n.proxyId, delete n.proxyPinned), `proxyMode` in t && t.proxyMode !== `custom` && delete n.customProxy, n;
    };
    scope.Aa = function Aa({
      account: e,
      status: t,
      result: n,
      siteCheckinMethod: r,
      siteName: i,
      quotaPerUnit: s,
      adapterFamily: c2,
      balance: l,
      balanceRefreshing: d = false,
      liveTask: f2,
      ref: g,
      queued: _ = false,
      proxyLabel: S,
      onRun: C2,
      onRefreshBalance: T,
      onRemove: E,
      onReset: D,
      onStop: k,
      onRetry: A,
      onMarkDone: j,
      onCaptureSession: M,
      onLearn: N,
      learning: P,
      onCancelLearn: F,
      learningNotice: re,
      learnedSteps: I,
      onEdit: ie,
      selectionMode: L = false,
      selected: oe = false,
      selectionDisabled: se = false,
      selectionDisabledReason: ce,
      onToggleSelect: le,
      proxies: ue = [],
      proxyUsage: z = /* @__PURE__ */ new Map(),
      siteProxyName: B,
      proxyEndpoint: V,
      onSetProxy: H
    }) {
      let [fe, ge] = (0, scope.G.useState)(false), [_e2, ye2] = (0, scope.G.useState)(() => Date.now()), [be, xe2] = (0, scope.G.useState)(false), Se = t === `pending` || t === `failed`, Ce2 = ce ?? `删除站点后，该账号会保留到待恢复账号`, we = t === `running` || t === `attention`, K = _ && t === `pending`, Te2 = t === `done`, Ee = t !== `done` && t !== `running`, De2 = !P && !we && !_, Oe = f2?.method || r, ke2 = (0, scope.Ki)(Oe), Ae = (0, scope.ea)(n), je2 = l?.checkinRewardDay === (0, scope.q)() && l.checkinReward != null ? (0, scope.ne)(l.checkinReward, { quotaPerUnit: s, family: c2 }, l.checkinRewardSymbol) : null, Me2 = je2 ? `+${je2}` : (0, scope.Ua)(n?.metrics, s, c2), Ne = je2 ? `今日签到奖励（余额刷新时从页面签到台账读取）` : n?.manual && Me2 ? `手动标记：按已保存余额的总额度差值估算，可能包含同期间其它入账` : void 0, Pe2 = { quotaPerUnit: s, family: c2 }, Fe = (0, scope.te)(l, n), Ie2 = Fe.balance ? {
        text: `余额 ${(0, scope.ae)(Fe.balance.quota, Pe2, Fe.balance.symbol)}`,
        age: Fe.fromCheckinResult ? null : (0, scope.ee)(Fe.balance.at)
      } : null, Le = l?.error, Re2 = f2?.steps ?? n?.steps ?? [], ze = (0, scope.Or)(l), Be2 = !!(f2 || n || ze.length > 0), Ve = t === `running` || t === `attention`, He2 = e.proxyMode === `pool` ? e.proxyId ?? `` : e.proxyMode === `none` ? `__direct__` : e.proxyMode === `custom` ? `__custom__` : `__inherit__`, Ue = ue.filter((e2) => !e2.nameOnly).map((e2) => z.get(e2.id) ?? 0), We2 = Ue.length ? Math.min(...Ue) : 0;
      async function Ke2(t2) {
        if (H && !be && t2 !== He2) {
          if (t2 === `__custom__`) ie?.({ ...e, proxyMode: `custom` });
          else {
            xe2(true);
            try {
              t2 === `__direct__` ? await H(e.id, { proxyMode: `none` }) : t2 === `__inherit__` ? await H(e.id, { proxyMode: `inherit` }) : await H(e.id, { proxyMode: `pool`, proxyId: t2, proxyPinned: true });
            } finally {
              xe2(false);
            }
          }
        }
      }
      async function qe(t2) {
        if (H && !be && e.proxyId) {
          xe2(true);
          try {
            await H(e.id, { proxyMode: `pool`, proxyId: e.proxyId, proxyPinned: t2 });
          } finally {
            xe2(false);
          }
        }
      }
      return (0, scope.G.useEffect)(() => {
        if (!Ve || !f2) return;
        let e2 = window.setInterval(() => ye2(Date.now()), 1e3);
        return () => window.clearInterval(e2);
      }, [Ve, f2]), (0, scope.G.useEffect)(() => {
        Ve ? ge(true) : t === `done` && ge(false);
      }, [Ve, t]), (0, scope.W.jsxs)(scope.w.div, {
        ref: g,
        "data-account-id": e.id,
        "data-account-status": t,
        layout: `position`,
        initial: { opacity: 0, x: -6 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 6 },
        className: (0, scope.R)(
          `border-l-2 px-3 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50`,
          (0, scope.Wa)(t),
          oe && `bg-rose-50 dark:bg-rose-950/20`
        ),
        children: [
          (0, scope.W.jsxs)(`div`, {
            className: `flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 sm:flex-nowrap sm:gap-3`,
            children: [
              (0, scope.W.jsxs)(`div`, {
                "data-account-summary": true,
                className: `flex min-w-0 basis-full items-start gap-3 sm:basis-auto sm:flex-1 sm:items-center`,
                children: [
                  L && (0, scope.W.jsx)(`button`, {
                    type: `button`,
                    disabled: se,
                    onClick: () => le?.(e.id),
                    "aria-pressed": oe,
                    "aria-label": se ? `${e.label || e.username}：${Ce2}` : `${oe ? `取消选择` : `选择`}账号 ${e.label || e.username}`,
                    title: se ? Ce2 : oe ? `取消选择账号` : `选择账号`,
                    className: (0, scope.R)(
                      `grid size-6 shrink-0 place-items-center rounded-md disabled:cursor-not-allowed disabled:opacity-45`,
                      oe ? `bg-rose-500 text-white` : `bg-slate-100 text-slate-500 dark:bg-slate-900`
                    ),
                    children: oe ? (0, scope.W.jsx)(scope.o, { className: `size-3.5` }) : (0, scope.W.jsx)(scope.ve, { className: `size-4` })
                  }),
                  (0, scope.W.jsx)(scope.ja, { status: t, name: e.label || e.username }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `min-w-0 flex-1`,
                    children: [
                      (0, scope.W.jsxs)(`div`, {
                        className: `flex min-w-0 items-center gap-2`,
                        children: [
                          (0, scope.W.jsx)(`strong`, {
                            className: `truncate text-sm text-slate-900 dark:text-white`,
                            title: e.label || e.username,
                            children: e.label || e.username
                          }),
                          n && (0, scope.W.jsx)(`span`, {
                            className: `shrink-0 text-[10px] tabular-nums text-slate-400`,
                            children: new Date(n.at).toLocaleTimeString(`zh-CN`, {
                              hour: `2-digit`,
                              minute: `2-digit`
                            })
                          })
                        ]
                      }),
                      e.label && (0, scope.W.jsx)(`p`, {
                        className: `truncate text-[11px] text-slate-500`,
                        title: e.username,
                        children: e.username
                      }),
                      Ve && (0, scope.W.jsxs)(`p`, {
                        className: (0, scope.R)(
                          `mt-1 flex items-center gap-1.5 text-[11px] font-medium`,
                          t === `attention` ? `text-cyan-700 dark:text-cyan-300` : `text-blue-700 dark:text-blue-300`
                        ),
                        children: [
                          t === `attention` ? (0, scope.W.jsx)(scope.p, { className: `size-3` }) : (0, scope.W.jsx)(scope.u, { className: `size-3 animate-spin` }),
                          (0, scope.W.jsx)(`span`, {
                            className: `truncate`,
                            children: f2 ? (0, scope.da)(f2.stage, Oe) : `正在执行`
                          }),
                          (0, scope.W.jsx)(`span`, {
                            className: `shrink-0 tabular-nums opacity-65`,
                            children: (0, scope.fa)(_e2 - (f2?.startedAt ?? _e2))
                          })
                        ]
                      }),
                      !Ve && n?.message && (0, scope.W.jsx)(`p`, {
                        className: (0, scope.R)(
                          `mt-0.5 truncate text-[11px]`,
                          t === `failed` ? `text-rose-600 dark:text-rose-400` : `text-slate-500`
                        ),
                        title: n.message,
                        children: n.message
                      }),
                      _ && t === `pending` && (0, scope.W.jsx)(`p`, {
                        className: `mt-1 text-[11px] text-slate-500`,
                        children: `排队中，等待前一个账号完成`
                      }),
                      N && !P && De2 && (0, scope.W.jsx)(`p`, {
                        className: `mt-1 text-[11px] leading-relaxed text-slate-500`,
                        children: `先手动登录，再完成一次签到，最后点「结束学习」；若本站登录成功后即算签到、没有签到按钮，登录后改点「登录即签到」。全程不要点「退出登录」。`
                      }),
                      (0, scope.W.jsxs)(`div`, {
                        className: `mt-1 flex flex-wrap gap-1`,
                        children: [
                          i && (0, scope.W.jsxs)(scope.Ma, {
                            tone: `slate`,
                            title: `所属站点：${i}`,
                            children: [(0, scope.W.jsx)(scope.x, { className: `size-3` }), i]
                          }),
                          Me2 && (0, scope.W.jsxs)(scope.Ma, {
                            tone: `emerald`,
                            title: Ne,
                            children: [(0, scope.W.jsx)(scope.a, { className: `size-3` }), Me2]
                          }),
                          d ? (0, scope.W.jsxs)(scope.Ma, {
                            tone: `slate`,
                            children: [
                              (0, scope.W.jsx)(scope.u, { className: `size-3 animate-spin` }),
                              `读取余额…`
                            ]
                          }) : Ie2 ? (0, scope.W.jsxs)(scope.Ma, {
                            tone: `blue`,
                            title: Ie2.age ? `余额更新于 ${Ie2.age}` : void 0,
                            children: [
                              (0, scope.W.jsx)(scope.a, { className: `size-3` }),
                              Ie2.text,
                              Ie2.age && (0, scope.W.jsxs)(`span`, {
                                className: `opacity-60`,
                                children: [`· `, Ie2.age]
                              })
                            ]
                          }) : Le ? (0, scope.W.jsxs)(scope.Ma, {
                            tone: `slate`,
                            title: Le,
                            children: [
                              (0, scope.W.jsx)(scope.a, { className: `size-3` }),
                              `余额未获取`
                            ]
                          }) : null,
                          n?.via === `headless` && (0, scope.W.jsxs)(scope.Ma, {
                            tone: `emerald`,
                            children: [
                              (0, scope.W.jsx)(scope.y, { className: `size-3` }),
                              `API 直连`
                            ]
                          }),
                          S && (0, scope.W.jsx)(scope.Ma, {
                            tone: S.kind === `invalid` || S.kind === `name-only` ? `rose` : `slate`,
                            title: V,
                            children: S.kind === `direct` ? `直连` : S.kind === `invalid` ? S.label : S.kind === `name-only` ? `节点名无出口 · ${S.label}` : `${S.inherited ? `站点代理` : e.proxyMode === `custom` ? `自定义代理` : e.proxyPinned ? `手动代理` : `自动代理`} · ${S.label}`
                          }),
                          V && (0, scope.W.jsx)(scope.Ma, {
                            tone: `slate`,
                            title: `实际使用的代理地址`,
                            children: (0, scope.W.jsx)(`span`, {
                              className: `max-w-[220px] truncate`,
                              children: V
                            })
                          })
                        ]
                      }),
                      !L && H && (0, scope.W.jsxs)(`div`, {
                        className: `mt-1.5 flex min-w-0 items-center gap-1.5`,
                        children: [
                          (0, scope.W.jsx)(scope.x, {
                            className: `size-3 shrink-0 text-slate-400`
                          }),
                          (0, scope.W.jsx)(`span`, {
                            className: `shrink-0 text-[10px] text-slate-400`,
                            children: `分配代理`
                          }),
                          (0, scope.W.jsxs)(`select`, {
                            value: He2,
                            disabled: be || Ve || _,
                            onChange: (e2) => {
                              Ke2(e2.target.value);
                            },
                            "aria-label": `手动设置 ${e.label || e.username} 的代理`,
                            title: Ve || _ ? `任务执行或排队期间不能更换代理，请先停止任务` : `选择后立即保存，并固定为手动代理`,
                            className: `min-w-0 max-w-full flex-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10px] text-slate-700 outline-none transition-colors focus:border-blue-400 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200`,
                            children: [
                              (0, scope.W.jsxs)(`option`, {
                                value: `__inherit__`,
                                children: [`跟随站点代理`, B ? ` · ${B}` : ``]
                              }),
                              (0, scope.W.jsx)(`option`, {
                                value: `__direct__`,
                                children: `不使用代理（直连）`
                              }),
                              (0, scope.W.jsx)(`option`, {
                                value: `__custom__`,
                                children: `自定义代理地址（打开账号编辑）`
                              }),
                              ue.map(
                                (e2) => (0, scope.W.jsxs)(
                                  `option`,
                                  {
                                    value: e2.id,
                                    disabled: e2.nameOnly,
                                    children: [
                                      e2.name,
                                      e2.nameOnly ? `（仅名称，无出口）` : ` · ${(0, scope.de)(e2)}://${e2.host}:${e2.port} · 已用 ${z.get(e2.id) ?? 0}${(z.get(e2.id) ?? 0) === We2 ? ` · 推荐` : ``}`
                                    ]
                                  },
                                  e2.id
                                )
                              )
                            ]
                          }),
                          e.proxyMode === `pool` && e.proxyId && !Ve && !_ && (0, scope.W.jsx)(`button`, {
                            type: `button`,
                            onClick: () => {
                              qe(!e.proxyPinned);
                            },
                            title: e.proxyPinned ? `取消手动固定，保留当前节点但允许后续自动分配覆盖` : `固定当前自动代理，后续自动分配不再覆盖`,
                            "aria-label": `${e.proxyPinned ? `取消固定` : `固定`} ${e.label || e.username} 当前使用的代理`,
                            className: `grid size-6 shrink-0 place-items-center rounded-md text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40`,
                            children: e.proxyPinned ? (0, scope.W.jsx)(scope.at, { className: `size-3.5` }) : (0, scope.W.jsx)(scope.st, { className: `size-3.5` })
                          }),
                          be && (0, scope.W.jsx)(scope.u, {
                            className: `size-3 shrink-0 animate-spin text-blue-500`
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),
              (0, scope.W.jsx)(`button`, {
                "data-account-status-control": true,
                type: `button`,
                disabled: L || !Se,
                onClick: () => Se && C2(e.id),
                title: Se ? `执行${ke2.noun}` : (0, scope.Ji)(t, Oe),
                className: (0, scope.R)(`shrink-0 rounded-full`, Se && `cursor-pointer`),
                children: (0, scope.W.jsx)(scope.Qi, {
                  status: t,
                  evidence: Ae ?? void 0,
                  method: Oe
                })
              }),
              !L && (0, scope.W.jsxs)(`div`, {
                "data-account-actions": true,
                className: `flex min-w-0 flex-1 flex-wrap items-center justify-end gap-0.5 sm:max-w-[16rem] sm:flex-none`,
                children: [
                  Se && (0, scope.W.jsx)(scope.za, {
                    title: `执行${ke2.noun}`,
                    accent: true,
                    onClick: () => C2(e.id),
                    children: (0, scope.W.jsx)(scope.m, {
                      className: `size-3.5 fill-current`
                    })
                  }),
                  ie && (0, scope.W.jsx)(scope.za, {
                    title: `编辑账号`,
                    onClick: () => ie(e),
                    children: (0, scope.W.jsx)(scope.he, { className: `size-3.5` })
                  }),
                  T && (0, scope.W.jsx)(scope.za, {
                    title: d ? `正在读取余额` : `刷新余额`,
                    onClick: () => !d && T(e.id),
                    children: d ? (0, scope.W.jsx)(scope.u, { className: `size-3.5 animate-spin` }) : (0, scope.W.jsx)(scope.a, { className: `size-3.5` })
                  }),
                  M && (0, scope.W.jsx)(scope.za, {
                    title: `抓取或更新登录态`,
                    onClick: () => M(e.id),
                    children: (0, scope.W.jsx)(scope.Ge, { className: `size-3.5` })
                  }),
                  N && (P || De2) && (0, scope.W.jsx)(scope.za, {
                    label: P ? `结束学习` : `学习本站流程`,
                    title: P ? `结束学习并保存${(P.kind ?? `both`) === `both` ? `登录与签到` : P.kind === `login` ? `登录` : `签到`}流程` : `学习或更新本站共用流程：先手动登录，再完成一次签到，最后点「结束学习」。本站现有和新增账号都使用保存后的流程；每个账号使用自己的凭据与身份，不需要逐个学习`,
                    onClick: () => N(e.id, P ? P.kind ?? `both` : `both`),
                    accent: true,
                    children: (0, scope.W.jsx)(scope.pe, { className: `size-3.5` })
                  }),
                  P && F && (0, scope.W.jsx)(scope.za, {
                    title: `放弃本次学习，不保存流程`,
                    danger: true,
                    onClick: () => F(e.id),
                    children: (0, scope.W.jsx)(scope.h, { className: `size-3.5` })
                  }),
                  we && A && (0, scope.W.jsx)(scope.za, {
                    title: `停止并重新${ke2.noun}`,
                    accent: true,
                    onClick: () => A(e.id),
                    children: (0, scope.W.jsx)(scope.dt, { className: `size-3.5` })
                  }),
                  (we || K) && k && (0, scope.W.jsx)(scope.za, {
                    title: we ? `停止任务，改回待执行` : `从队列中移除`,
                    onClick: () => k(e.id),
                    children: (0, scope.W.jsx)(scope.me, { className: `size-3.5` })
                  }),
                  Ee && j && (0, scope.W.jsx)(scope.za, {
                    title: `手动标记为${ke2.done}`,
                    onClick: () => j(e.id),
                    children: (0, scope.W.jsx)(scope.U, { className: `size-3.5` })
                  }),
                  Te2 && D && (0, scope.W.jsx)(scope.za, {
                    title: `收回${ke2.done}状态，改为${ke2.pending}`,
                    accent: true,
                    onClick: () => D(e.id),
                    children: (0, scope.W.jsx)(scope.lt, { className: `size-3.5` })
                  }),
                  Be2 && (0, scope.W.jsx)(scope.za, {
                    title: fe ? `收起账号详情` : `查看账号详情`,
                    onClick: () => ge((e2) => !e2),
                    children: (0, scope.W.jsx)(scope.w.span, {
                      animate: { rotate: fe ? 180 : 0 },
                      className: `block`,
                      children: (0, scope.W.jsx)(scope.b, { className: `size-3.5` })
                    })
                  }),
                  (0, scope.W.jsx)(scope.za, {
                    title: `删除账号`,
                    danger: true,
                    onClick: () => E(e.id),
                    children: (0, scope.W.jsx)(scope.v, { className: `size-3.5` })
                  })
                ]
              })
            ]
          }),
          P && (0, scope.W.jsxs)(`div`, {
            "data-learning-panel": true,
            className: `mt-2 space-y-1 rounded-lg bg-violet-50 px-2.5 py-2 text-[11px] leading-relaxed dark:bg-violet-950/40`,
            children: [
              (0, scope.W.jsxs)(`p`, {
                className: `flex items-center gap-1.5 font-medium text-violet-700 dark:text-violet-300`,
                children: [
                  (0, scope.W.jsx)(scope.pe, { className: `size-3 shrink-0` }),
                  `正在学习`,
                  (0, scope.Na)(P.kind),
                  `，已记录 `,
                  (0, scope.ka)(P.preview, P.eventCount),
                  ` 个动作`
                ]
              }),
              (0, scope.W.jsx)(scope.Fa, { guide: P.guide }),
              (0, scope.W.jsx)(scope.Ra, {
                title: `正在记录的动作`,
                preview: P.preview,
                testId: `learning-live-steps`
              }),
              (0, scope.W.jsx)(`p`, {
                className: `text-slate-500`,
                children: P.guide?.hint ?? (0, scope.Pa)(P.kind)
              }),
              P.guide?.warning && (0, scope.W.jsx)(`p`, {
                className: `text-amber-700 dark:text-amber-400`,
                children: P.guide.warning
              }),
              P.loginAsCheckinAvailable && N && (0, scope.W.jsx)(`div`, {
                className: `pt-0.5`,
                children: (0, scope.W.jsx)(`button`, {
                  type: `button`,
                  "data-learning-login-as-checkin": true,
                  onClick: () => N(e.id, P.kind ?? `both`, { loginAsCheckin: true }),
                  title: `本站是「登录即签到」时点这里：登录成功后即算完成签到，不再需要点签到按钮。保存后自动签到按登录即签到收尾`,
                  className: `rounded-md bg-violet-600 px-2 py-1 text-[11px] font-medium text-white transition-colors hover:bg-violet-700`,
                  children: `登录即签到（没有签到按钮）`
                })
              })
            ]
          }),
          !P && (0, scope.W.jsx)(scope.Ra, {
            title: `这次学到的动作`,
            preview: I,
            testId: `learning-last-steps`,
            tone: `slate`
          }),
          !P && re && re.lines.length > 0 && (0, scope.W.jsxs)(`div`, {
            "data-learning-notice": re.verdict,
            className: `mt-1 rounded-lg bg-slate-100 px-2 py-1.5 text-[11px] leading-relaxed dark:bg-slate-800/70`,
            children: [
              (0, scope.W.jsx)(`p`, {
                className: `mb-1 font-medium text-slate-700 dark:text-slate-200`,
                children: (0, scope.ma)(re.verdict)
              }),
              (0, scope.W.jsx)(`ul`, {
                className: `space-y-0.5`,
                children: re.lines.map(
                  (e2, t2) => (0, scope.W.jsx)(
                    `li`,
                    {
                      className: `break-words text-slate-600 dark:text-slate-300`,
                      children: e2.text
                    },
                    t2
                  )
                )
              })
            ]
          }),
          (0, scope.W.jsx)(scope.O, {
            initial: false,
            children: !L && fe && Be2 && (0, scope.W.jsx)(scope.w.div, {
              initial: { height: 0, opacity: 0 },
              animate: { height: `auto`, opacity: 1 },
              exit: { height: 0, opacity: 0 },
              className: `mt-3 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60`,
              children: (0, scope.W.jsxs)(`div`, {
                className: `space-y-2 px-3 py-2.5`,
                children: [
                  n && !n.ok && (0, scope.W.jsx)(scope.aa, {
                    code: (0, scope.ua)(n.message, n.steps).code
                  }),
                  je2 && (0, scope.W.jsxs)(`p`, {
                    className: `text-[11px] text-emerald-700 dark:text-emerald-300`,
                    children: [`余额刷新读到今日签到奖励 +`, je2, `（页面台账）`]
                  }),
                  n?.ok && (0, scope.ta)(Ae, n) && (0, scope.W.jsx)(`p`, {
                    className: `text-[11px] text-slate-500`,
                    children: (0, scope.ta)(Ae, n)
                  }),
                  ze.length > 0 && (0, scope.W.jsx)(scope.Ba, { rows: ze, quotaPerUnit: s, family: c2 }),
                  Re2.length > 0 && (0, scope.W.jsx)(`ol`, {
                    className: (0, scope.R)(
                      `space-y-1.5`,
                      ze.length > 0 && `border-t border-slate-200 pt-2 dark:border-slate-700`
                    ),
                    children: Re2.map(
                      (e2, t2) => (0, scope.W.jsxs)(
                        `li`,
                        {
                          className: `flex items-start gap-2 text-[11px] leading-5 text-slate-600 dark:text-slate-300`,
                          children: [
                            (0, scope.W.jsx)(`span`, {
                              className: (0, scope.R)(
                                `mt-1.5 size-1.5 shrink-0 rounded-full`,
                                t2 === Re2.length - 1 && Ve ? `bg-blue-500` : `bg-slate-300 dark:bg-slate-600`
                              )
                            }),
                            (0, scope.W.jsx)(`span`, { children: e2 })
                          ]
                        },
                        `${t2}-${e2}`
                      )
                    )
                  })
                ]
              })
            })
          })
        ]
      });
    };
    scope.Wa = function Wa(e) {
      return e === `done` ? `border-l-emerald-500` : e === `running` ? `border-l-blue-500` : e === `attention` ? `border-l-cyan-500` : e === `failed` ? `border-l-rose-500` : `border-l-amber-400`;
    };
    scope.Ka = function Ka(e, t, n) {
      return e ? { value: e, source: `账号级` } : t ? { value: t, source: `站点默认` } : { value: n, source: `内置默认` };
    };
    scope.qa = function qa(e) {
      let t = !!e.password, n = !!e.githubUsername?.trim() && !!e.githubPassword;
      return t === n ? null : n ? `github` : `form`;
    };
    scope.Ja = function Ja(e, t) {
      return {
        loginMethod: e.loginMethod || `auto`,
        loginMethodSource: !e.loginMethod || e.loginMethod === `auto` ? `当前页面` : `账号级`,
        checkinMethod: t.checkin?.method || `auto`
      };
    };
    scope.Ya = function Ya(e) {
      switch (e) {
        case `token`:
          return { password: false, token: true, sessionCounts: true, github: false, passkey: false };
        case `github`:
          return { password: false, token: false, sessionCounts: false, github: true, passkey: false };
        case `passkey`:
          return { password: false, token: false, sessionCounts: false, github: false, passkey: true };
        case `oauth`:
        case `manual`:
          return { password: false, token: false, sessionCounts: false, github: false, passkey: false };
        case `form`:
          return { password: true, token: false, sessionCounts: false, github: false, passkey: false };
        case `auto`:
          return { password: true, token: false, sessionCounts: true, github: true, passkey: false };
      }
    };
    scope.Xa = function Xa(e) {
      let t = (0, scope.Qa)(e.loginUrl);
      if (!t) return [];
      let n = (0, scope.$a)(e.favicon, t), r = (0, scope.Za)(t.href), i = (0, scope.It)(t.href), a = [];
      return r && a.push(r), n && n !== i && a.push(n), i && a.push(i), [...new Set(a)];
    };
    scope.Za = function Za(e) {
      try {
        let t = globalThis.chrome?.runtime;
        if (!t?.getURL) return ``;
        let n = new URL(t.getURL(`/_favicon/`));
        return n.searchParams.set(`pageUrl`, e), n.searchParams.set(`size`, `32`), n.searchParams.set(`forceEmptyDefaultFavicon`, `1`), n.searchParams.set(`allowGoogleServerFallback`, `0`), n.href;
      } catch {
        return ``;
      }
    };
    scope.Qa = function Qa(e) {
      try {
        let t = new URL(e.trim()), n = t.hostname === `localhost` || t.hostname === `127.0.0.1` || t.hostname === `[::1]`;
        return t.protocol !== `https:` && !(t.protocol === `http:` && n) ? null : t;
      } catch {
        return null;
      }
    };
    scope.$a = function $a(e, t) {
      let n = typeof e == `string` ? e.trim() : ``;
      if (!n) return null;
      if (/^data:image\/(?:png|gif|jpe?g|webp|svg\+xml|x-icon|vnd\.microsoft\.icon);/i.test(n))
        return n;
      try {
        let e2 = new URL(n, t);
        return e2.protocol !== `https:` && !(e2.protocol === `http:` && (0, scope.eo)(e2.hostname)) || t.protocol === `https:` && e2.protocol !== `https:` || (0, scope.to)(e2) ? null : e2.href;
      } catch {
        return null;
      }
    };
    scope.eo = function eo(e) {
      return e === `localhost` || e === `127.0.0.1` || e === `[::1]`;
    };
    scope.Ho = function Ho(e) {
      return { site: e };
    };
    scope.Uo = function Uo(e, t, n) {
      return `${e}:${t.trim().toLowerCase()}\0${n}`;
    };
    scope.Wo = function Wo(e, t) {
      if (t === `github`) {
        let t2 = e.githubUsername?.trim() ?? ``, n2 = e.githubPassword ?? ``;
        return t2 && n2 ? { username: t2, password: n2 } : null;
      }
      let n = e.username.trim();
      return n && e.password ? { username: n, password: e.password } : null;
    };
    scope.Go = function Go(e) {
      return e.kind !== `site` && e.kind !== `github` ? `凭据类型无效` : e.username.trim() ? e.password ? null : `密码不能为空` : `用户名不能为空`;
    };
    scope.Ko = function Ko(e, t) {
      let n = e.find((e2) => e2.id === t);
      if (!n) return [t];
      let r = (0, scope.qo)(n.loginUrl);
      return r ? e.filter((e2) => e2.id !== t && (0, scope.qo)(e2.loginUrl) === r).map((e2) => e2.id).concat(t) : [t];
    };
    scope.qo = function qo(e) {
      try {
        return new URL(e).hostname.toLowerCase();
      } catch {
        return ``;
      }
    };
    scope.Jo = function Jo(e, t, n = {}) {
      let r = [], i = /* @__PURE__ */ new Map();
      for (let a = e.length - 1; a >= 0; --a) {
        let o = e[a];
        if (o.id === n.excludeAccountId || n.allowedSiteIds && !n.allowedSiteIds.has(o.siteId))
          continue;
        let s = (0, scope.Wo)(o, t);
        if (!s) continue;
        let c2 = (0, scope.Uo)(t, s.username, s.password), l = i.get(c2);
        if (l) {
          l.accountCount = (l.accountCount ?? 1) + 1, l.siteId ||= o.siteId, l.label === l.username && o.label?.trim() && (l.label = o.label.trim());
          continue;
        }
        let u = {
          id: `account:${o.id}:${t}`,
          kind: t,
          username: s.username,
          password: s.password,
          label: o.label?.trim() || s.username,
          origin: `account`,
          accountId: o.id,
          siteId: o.siteId,
          updatedAt: 0,
          accountCount: 1
        }, d = n.siteNameOf?.(o.siteId);
        d && (u.siteName = d), i.set(c2, u), r.push(u);
      }
      return r;
    };
    scope.Yo = function Yo(e, t) {
      let n = e.map((e2) => ({ ...e2 })), r = new Map(n.map((e2) => [(0, scope.Uo)(e2.kind, e2.username, e2.password), e2]));
      for (let e2 of t) {
        let t2 = (0, scope.Uo)(e2.kind, e2.username, e2.password), i = r.get(t2);
        if (i) {
          i.presetId = e2.id, e2.label?.trim() && i.label === i.username && (i.label = e2.label.trim()), e2.updatedAt > i.updatedAt && (i.updatedAt = e2.updatedAt), e2.lastUsedAt && (!i.lastUsedAt || e2.lastUsedAt > i.lastUsedAt) && (i.lastUsedAt = e2.lastUsedAt), i.useCount = Math.max(i.useCount ?? 0, e2.useCount ?? 0);
          continue;
        }
        let a = {
          id: e2.id,
          kind: e2.kind,
          username: e2.username,
          password: e2.password,
          label: e2.label?.trim() || e2.username,
          origin: `manual`,
          presetId: e2.id,
          siteId: e2.siteId,
          updatedAt: e2.updatedAt,
          lastUsedAt: e2.lastUsedAt,
          useCount: e2.useCount
        };
        r.set(t2, a), n.push(a);
      }
      return n;
    };
    scope.Xo = function Xo(e, t) {
      return [...e].sort((e2, n) => {
        let r = t ? e2.siteId === t : false;
        if (r !== (t ? n.siteId === t : false)) return r ? -1 : 1;
        let i = Math.max(e2.lastUsedAt ?? 0, e2.updatedAt ?? 0), a = Math.max(n.lastUsedAt ?? 0, n.updatedAt ?? 0);
        if (i !== a) return a - i;
        let o = e2.label.localeCompare(n.label);
        return o === 0 ? e2.id < n.id ? -1 : +(e2.id > n.id) : o;
      });
    };
    scope.Zo = function Zo(e, t) {
      let n = (0, scope.Uo)(t.kind, t.username, t.password);
      return e.filter((e2) => e2.id !== t.id && (0, scope.Uo)(e2.kind, e2.username, e2.password) !== n).concat(t);
    };
    scope.Qo = function Qo(e, t, n = Date.now()) {
      return e.map(
        (e2) => e2.id === t ? { ...e2, lastUsedAt: n, useCount: (e2.useCount ?? 0) + 1 } : e2
      );
    };
    scope.$o = function $o(e, t) {
      return e.filter((e2) => e2.id !== t);
    };
    scope.es = function es(e) {
      if (!Array.isArray(e)) return [];
      let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), r = [];
      for (let i of e) {
        if (!i || typeof i != `object`) continue;
        let e2 = i, a = typeof e2.id == `string` ? e2.id : ``, o = e2.kind === `site` || e2.kind === `github` ? e2.kind : null, s = typeof e2.username == `string` ? e2.username.trim() : ``, c2 = typeof e2.password == `string` ? e2.password : ``;
        if (!a || !o || !s || !c2 || t.has(a)) continue;
        t.add(a);
        let l = { id: a, kind: o, username: s, password: c2, updatedAt: (0, scope.ts)(e2.updatedAt) };
        typeof e2.label == `string` && e2.label.trim() && (l.label = e2.label.trim()), typeof e2.siteId == `string` && e2.siteId && (l.siteId = e2.siteId);
        let u = (0, scope.ts)(e2.lastUsedAt);
        u > 0 && (l.lastUsedAt = u);
        let d = typeof e2.useCount == `number` && Number.isFinite(e2.useCount) ? Math.max(0, Math.floor(e2.useCount)) : 0;
        d > 0 && (l.useCount = d), n.set((0, scope.Uo)(o, s, c2), l), r.push(l);
      }
      return r.filter((e2) => n.get((0, scope.Uo)(e2.kind, e2.username, e2.password)) === e2).sort((e2, t2) => t2.updatedAt - e2.updatedAt || (e2.id < t2.id ? -1 : +(e2.id > t2.id))).slice(0, 200);
    };
    scope.ts = function ts(e) {
      return typeof e == `number` && Number.isFinite(e) && e >= 0 ? e : 0;
    };
    scope.rs = async function rs() {
      return (0, scope.es)((await chrome.storage.local.get(scope.ns))[scope.ns]);
    };
    scope.is = async function is(e) {
      await chrome.storage.local.set({ [scope.ns]: (0, scope.es)(e) });
    };
    scope.as = function as(e) {
      let t = (t2, n) => {
        n === `local` && `credentialPresets` in t2 && e((0, scope.es)(t2[scope.ns]?.newValue));
      };
      return chrome.storage.onChanged.addListener(t), () => chrome.storage.onChanged.removeListener(t);
    };
    scope.os = function os() {
      let [e, t] = (0, scope.G.useState)([]), n = (0, scope.Ui)((e2) => e2.accounts), r = (0, scope.Ui)((e2) => e2.sites);
      (0, scope.G.useEffect)(() => {
        if (typeof chrome > `u` || !chrome.storage?.local) return;
        let e2 = true;
        (0, scope.rs)().then((n3) => {
          e2 && t(n3);
        });
        let n2 = (0, scope.as)((n3) => {
          e2 && t(n3);
        });
        return () => {
          e2 = false, n2();
        };
      }, []);
      async function i(e2) {
        t(e2), typeof chrome < `u` && chrome.storage?.local && await (0, scope.is)(e2);
      }
      let a = (e2) => r.find((t2) => t2.id === e2)?.name;
      return {
        presets: e,
        async saveAsPreset(t2) {
          let n2 = (0, scope.Go)(t2);
          if (n2) return n2;
          let r2 = Date.now();
          return await i(
            (0, scope.Zo)(e, {
              id: (0, scope.Ft)(`cp`),
              kind: t2.kind,
              username: t2.username.trim(),
              password: t2.password,
              updatedAt: r2,
              ...t2.label?.trim() ? { label: t2.label.trim() } : {},
              ...t2.siteId ? { siteId: t2.siteId } : {}
            })
          ), null;
        },
        async renamePreset(t2, n2) {
          let r2 = e.map(
            (e2) => e2.id === t2 ? { ...e2, ...n2.trim() ? { label: n2.trim() } : {}, updatedAt: Date.now() } : e2
          );
          return n2.trim() === `` ? i(
            r2.map((e2) => {
              if (e2.id !== t2) return e2;
              let { label: n3, ...r3 } = e2;
              return r3;
            })
          ) : i(r2);
        },
        async deletePreset(t2) {
          return i((0, scope.$o)(e, t2));
        },
        markUsed(t2) {
          t2.presetId && e.some((e2) => e2.id === t2.presetId) && i((0, scope.Qo)(e, t2.presetId));
        },
        optionsFor(t2, i2, o) {
          let s = t2 === `site` ? new Set((0, scope.Ko)(r, i2)) : void 0;
          return (0, scope.Xo)(
            (0, scope.Yo)(
              (0, scope.Jo)(n, t2, {
                excludeAccountId: o?.excludeAccountId,
                allowedSiteIds: s,
                siteNameOf: a
              }),
              e.filter((e2) => e2.kind === t2)
            ),
            i2
          );
        }
      };
    };
    scope.cs = function cs(e) {
      if (!e) return `—`;
      try {
        return new Date(e).toLocaleString(`zh-CN`, {
          month: `numeric`,
          day: `numeric`,
          hour: `2-digit`,
          minute: `2-digit`
        });
      } catch {
        return `—`;
      }
    };
    scope.ls = function ls({ open: e, onClose: t }) {
      let { presets: n, saveAsPreset: r, renamePreset: i, deletePreset: a } = (0, scope.os)(), o = (0, scope.Ui)((e2) => e2.sites), [s, c2] = (0, scope.G.useState)(/* @__PURE__ */ new Set()), [l, u] = (0, scope.G.useState)(``), [d, f2] = (0, scope.G.useState)(``), [p, m] = (0, scope.G.useState)(``), h = (0, scope.G.useRef)(null), [g, y] = (0, scope.G.useState)(`site`), [b, x] = (0, scope.G.useState)(``), [S, C2] = (0, scope.G.useState)(``), [w2, E] = (0, scope.G.useState)(``), [D, O] = (0, scope.G.useState)(``), [k, A] = (0, scope.G.useState)(false), [M, N] = (0, scope.G.useState)(null);
      (0, scope.G.useEffect)(
        () => () => {
          h.current && clearTimeout(h.current);
        },
        []
      ), (0, scope.G.useEffect)(() => {
        e || (c2(/* @__PURE__ */ new Set()), u(``), f2(``));
      }, [e]);
      let P = scope.ss.map((e2) => ({
        ...e2,
        presets: n.filter((t2) => t2.kind === e2.kind).sort((e3, t2) => t2.updatedAt - e3.updatedAt)
      }));
      function ee(e2) {
        c2((t2) => {
          let n2 = new Set(t2);
          return n2.has(e2) ? n2.delete(e2) : n2.add(e2), n2;
        });
      }
      function te(e2) {
        l === e2 ? (h.current && clearTimeout(h.current), u(``), a(e2)) : (u(e2), h.current && clearTimeout(h.current), h.current = setTimeout(() => u(``), 3e3));
      }
      function F(e2) {
        f2(e2.id), m(e2.label ?? ``);
      }
      async function ne(e2) {
        await i(e2, p), f2(``);
      }
      function re() {
        f2(``), m(``);
      }
      async function I() {
        if (k) return;
        A(true), N(null);
        let e2 = await r({
          kind: g,
          username: b,
          password: S,
          ...w2.trim() ? { label: w2 } : {},
          ...g === `site` && D ? { siteId: D } : {}
        });
        A(false), e2 ? N({ type: `error`, text: e2 }) : (x(``), C2(``), E(``), N({ type: `ok`, text: `已保存到常用凭据` }));
      }
      return (0, scope.W.jsx)(scope.uo, {
        open: e,
        title: `管理常用凭据`,
        onClose: t,
        wide: true,
        children: (0, scope.W.jsxs)(`div`, {
          className: `space-y-4`,
          children: [
            n.length === 0 && (0, scope.W.jsxs)(`div`, {
              className: `rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center dark:border-ink-700`,
              children: [
                (0, scope.W.jsx)(scope.Ge, {
                  className: `mx-auto size-6 text-ink-800/25 dark:text-ink-100/20`
                }),
                (0, scope.W.jsx)(`p`, {
                  className: `mt-2 text-xs font-medium text-ink-800/65 dark:text-ink-100/55`,
                  children: `还没有保存的常用凭据`
                }),
                (0, scope.W.jsx)(`p`, {
                  className: `mt-1 text-[11px] text-ink-800/40 dark:text-ink-100/30`,
                  children: `在账号表单里点「将当前输入存为常用」，或直接用下面的表单新增`
                })
              ]
            }),
            P.map(
              (e2) => e2.presets.length > 0 && (0, scope.W.jsxs)(
                `section`,
                {
                  className: `space-y-1.5`,
                  children: [
                    (0, scope.W.jsx)(`h4`, {
                      className: `text-[11px] font-semibold uppercase tracking-wide text-ink-800/50 dark:text-ink-100/40`,
                      children: e2.title
                    }),
                    e2.presets.map((e3) => {
                      let t2 = e3.label || e3.username, n2 = s.has(e3.id), r2 = l === e3.id, i2 = d === e3.id;
                      return (0, scope.W.jsxs)(
                        `div`,
                        {
                          "data-kind": e3.kind,
                          className: `rounded-lg bg-ink-50 p-3 ring-1 ring-black/5 dark:bg-ink-900 dark:ring-white/10`,
                          children: [
                            (0, scope.W.jsxs)(`div`, {
                              className: `flex items-center gap-2`,
                              children: [
                                (0, scope.W.jsx)(`span`, {
                                  className: `shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${e3.kind === `github` ? `bg-purple-500/10 text-purple-700 dark:text-purple-300` : `bg-sky-500/10 text-sky-700 dark:text-sky-300`}`,
                                  children: e3.kind === `github` ? `GitHub` : `站点`
                                }),
                                i2 ? (0, scope.W.jsxs)(`div`, {
                                  className: `flex min-w-0 flex-1 items-center gap-1`,
                                  children: [
                                    (0, scope.W.jsx)(`input`, {
                                      className: `min-w-0 flex-1 rounded-md bg-white px-2 py-1 text-xs text-ink-900 outline-none ring-1 ring-black/10 dark:bg-ink-800 dark:text-ink-50 dark:ring-white/10`,
                                      value: p,
                                      onChange: (e4) => m(e4.target.value),
                                      placeholder: `备注（留空清除）`
                                    }),
                                    (0, scope.W.jsx)(`button`, {
                                      type: `button`,
                                      "aria-label": `确认改名`,
                                      onClick: () => void ne(e3.id),
                                      className: `shrink-0 rounded-md px-1.5 py-1 text-[11px] font-semibold text-brand-600 hover:bg-brand-500/10 dark:text-brand-400`,
                                      children: `保存`
                                    }),
                                    (0, scope.W.jsx)(`button`, {
                                      type: `button`,
                                      "aria-label": `取消改名`,
                                      onClick: re,
                                      className: `shrink-0 rounded-md px-1.5 py-1 text-[11px] text-ink-800/50 hover:bg-black/5 dark:text-ink-100/50 dark:hover:bg-white/10`,
                                      children: `取消`
                                    })
                                  ]
                                }) : (0, scope.W.jsxs)(`div`, {
                                  className: `min-w-0 flex-1`,
                                  children: [
                                    (0, scope.W.jsx)(`span`, {
                                      className: `block truncate text-xs font-medium text-ink-900 dark:text-ink-50`,
                                      children: t2
                                    }),
                                    (0, scope.W.jsx)(`span`, {
                                      className: `block truncate text-[11px] text-ink-800/45 dark:text-ink-100/35`,
                                      children: e3.username
                                    })
                                  ]
                                }),
                                (0, scope.W.jsx)(`time`, {
                                  className: `shrink-0 text-[10px] tabular-nums text-ink-800/40 dark:text-ink-100/30`,
                                  children: (0, scope.cs)(e3.updatedAt)
                                }),
                                !i2 && (0, scope.W.jsx)(`button`, {
                                  type: `button`,
                                  "aria-label": `改名 ${t2}`,
                                  onClick: () => F(e3),
                                  className: `shrink-0 rounded-md p-1.5 text-ink-800/50 hover:bg-black/5 dark:text-ink-100/50 dark:hover:bg-white/10`,
                                  children: (0, scope.W.jsx)(scope.he, {
                                    className: `size-3.5`
                                  })
                                }),
                                (0, scope.W.jsx)(`button`, {
                                  type: `button`,
                                  "aria-label": r2 ? `确认删除 ${t2}` : `删除 ${t2}`,
                                  onClick: () => te(e3.id),
                                  className: r2 ? `shrink-0 rounded-md bg-rose-500 px-2 py-1 text-[10px] font-semibold text-white` : `shrink-0 rounded-md p-1.5 text-rose-500 hover:bg-rose-500/10`,
                                  children: r2 ? `确认删除` : (0, scope.W.jsx)(scope.v, { className: `size-3.5` })
                                })
                              ]
                            }),
                            (0, scope.W.jsxs)(`div`, {
                              className: `mt-1.5 flex items-center gap-2`,
                              children: [
                                (0, scope.W.jsx)(`input`, {
                                  readOnly: true,
                                  type: n2 ? `text` : `password`,
                                  value: e3.password,
                                  "aria-label": `${t2} 的密码`,
                                  className: `min-w-0 flex-1 rounded-md bg-white px-2 py-1 font-mono text-[11px] text-ink-800/70 outline-none ring-1 ring-black/5 dark:bg-ink-800 dark:text-ink-100/60 dark:ring-white/10`
                                }),
                                (0, scope.W.jsx)(`button`, {
                                  type: `button`,
                                  onClick: () => ee(e3.id),
                                  "aria-label": n2 ? `隐藏 ${t2} 的密码` : `显示 ${t2} 的密码`,
                                  className: `shrink-0 rounded-md p-1.5 text-ink-800/50 hover:bg-black/5 dark:text-ink-100/50 dark:hover:bg-white/10`,
                                  children: n2 ? (0, scope.W.jsx)(scope.T, { className: `size-3.5` }) : (0, scope.W.jsx)(scope.j, { className: `size-3.5` })
                                })
                              ]
                            })
                          ]
                        },
                        e3.id
                      );
                    })
                  ]
                },
                e2.kind
              )
            ),
            (0, scope.W.jsxs)(`section`, {
              className: `rounded-xl bg-ink-50 p-3 ring-1 ring-black/5 dark:bg-ink-900/60 dark:ring-white/10`,
              children: [
                (0, scope.W.jsxs)(`p`, {
                  className: `flex items-center gap-1.5 text-xs font-semibold text-ink-900 dark:text-ink-50`,
                  children: [(0, scope.W.jsx)(scope._, { className: `size-3.5` }), `新增凭据`]
                }),
                (0, scope.W.jsxs)(`div`, {
                  className: `mt-2 space-y-2`,
                  children: [
                    (0, scope.W.jsx)(scope.Q, {
                      label: `类型`,
                      children: (0, scope.W.jsxs)(`select`, {
                        className: scope.$,
                        value: g,
                        onChange: (e2) => y(e2.target.value),
                        children: [
                          (0, scope.W.jsx)(`option`, { value: `site`, children: `站点账号` }),
                          (0, scope.W.jsx)(`option`, { value: `github`, children: `GitHub 账号` })
                        ]
                      })
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `grid grid-cols-2 gap-2`,
                      children: [
                        (0, scope.W.jsx)(scope.Q, {
                          label: `用户名`,
                          children: (0, scope.W.jsx)(`input`, {
                            className: scope.$,
                            value: b,
                            onChange: (e2) => x(e2.target.value),
                            placeholder: `用户名`
                          })
                        }),
                        (0, scope.W.jsx)(scope.Q, {
                          label: `密码`,
                          hint: `仅保存在本机浏览器`,
                          children: (0, scope.W.jsx)(`input`, {
                            type: `password`,
                            className: scope.$,
                            value: S,
                            onChange: (e2) => C2(e2.target.value),
                            placeholder: `密码`
                          })
                        })
                      ]
                    }),
                    (0, scope.W.jsx)(scope.Q, {
                      label: `备注`,
                      hint: `可选，用于区分同站多账号`,
                      children: (0, scope.W.jsx)(`input`, {
                        className: scope.$,
                        value: w2,
                        onChange: (e2) => E(e2.target.value),
                        placeholder: `备注（可选）`
                      })
                    }),
                    g === `site` && (0, scope.W.jsx)(scope.Q, {
                      label: `来源站点`,
                      hint: `可选；选了之后会在这个站点的候选里排最前`,
                      children: (0, scope.W.jsxs)(`select`, {
                        className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                        value: D,
                        onChange: (e2) => O(e2.target.value),
                        children: [
                          (0, scope.W.jsx)(`option`, {
                            value: ``,
                            children: `不指定（任意站点可用）`
                          }),
                          o.map(
                            (e2) => (0, scope.W.jsx)(`option`, { value: e2.id, children: e2.name }, e2.id)
                          )
                        ]
                      })
                    }),
                    (0, scope.W.jsx)(`button`, {
                      type: `button`,
                      className: scope.fo,
                      disabled: k,
                      onClick: () => void I(),
                      children: k ? `保存中…` : `保存凭据`
                    }),
                    M && (0, scope.W.jsx)(`p`, {
                      role: `status`,
                      className: `text-[11px] ${M.type === `error` ? `text-rose-600 dark:text-rose-400` : `text-emerald-600 dark:text-emerald-400`}`,
                      children: M.text
                    })
                  ]
                })
              ]
            })
          ]
        })
      });
    };
    scope.us = function us(e) {
      let t = [e.label || e.username];
      return e.siteName && t.push(` · ${e.siteName}`), (e.accountCount ?? 1) > 1 && t.push(`（${e.accountCount} 个账号）`), t.join(``);
    };
    scope.ds = function ds({
      kind: e,
      siteId: t,
      excludeAccountId: n,
      username: r,
      password: i,
      disabled: a,
      onPick: o
    }) {
      let { optionsFor: s, markUsed: c2, saveAsPreset: l } = (0, scope.os)(), u = s(e, t, { excludeAccountId: n }), [d, f2] = (0, scope.G.useState)(``), [p, m] = (0, scope.G.useState)(``), [h, g] = (0, scope.G.useState)(false), [_, v2] = (0, scope.G.useState)(null), [y, b] = (0, scope.G.useState)(false), x = (0, scope.G.useRef)(null);
      (0, scope.G.useEffect)(
        () => () => {
          x.current && clearTimeout(x.current);
        },
        []
      );
      function S(e2) {
        x.current && clearTimeout(x.current), m(e2), x.current = setTimeout(() => m(``), 2600);
      }
      function C2(e2) {
        if (f2(``), !e2) return;
        let t2 = u.find((t3) => t3.id === e2);
        t2 && (o({ username: t2.username, password: t2.password }), c2(t2), S(`已填入 ${t2.label || t2.username}`));
      }
      async function w2() {
        if (h) return;
        g(true), v2(null);
        let n2 = await l({ kind: e, username: r, password: i, siteId: t });
        g(false), v2(
          n2 ? { type: `error`, text: n2 } : { type: `ok`, text: `已保存，之后可直接在下拉中选择` }
        );
      }
      let T = e === `github` ? `选择已保存的 GitHub 账号` : `选择已保存的站点账号`, E = r.trim().length > 0 && i.length > 0;
      return (0, scope.W.jsxs)(`div`, {
        className: `rounded-xl bg-ink-50 p-3 ring-1 ring-black/5 dark:bg-ink-900/60 dark:ring-white/10`,
        children: [
          (0, scope.W.jsx)(scope.Q, {
            label: T,
            children: (0, scope.W.jsxs)(`select`, {
              className: scope.$,
              value: d,
              disabled: a || u.length === 0,
              onChange: (e2) => C2(e2.target.value),
              children: [
                (0, scope.W.jsx)(`option`, { value: ``, children: `手动输入` }),
                u.map(
                  (e2) => (0, scope.W.jsx)(`option`, { value: e2.id, children: (0, scope.us)(e2) }, e2.id)
                )
              ]
            })
          }),
          u.length === 0 && (0, scope.W.jsx)(`p`, {
            className: `mt-1.5 text-[11px] leading-relaxed text-ink-800/40 dark:text-ink-100/30`,
            children: e === `github` ? `还没有可选的 GitHub 凭据：保存过的 GitHub 账号或「存为常用」的凭据会自动出现在这里` : `还没有可选的站点凭据：本站（或同一登录主机）已保存的账号与常用凭据会自动出现在这里`
          }),
          p && (0, scope.W.jsx)(`p`, {
            role: `status`,
            className: `mt-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400`,
            children: p
          }),
          (0, scope.W.jsxs)(`div`, {
            className: `mt-2 flex flex-wrap items-center gap-x-3 gap-y-1`,
            children: [
              (0, scope.W.jsx)(`button`, {
                type: `button`,
                onClick: () => void w2(),
                disabled: a || h || !E,
                className: `text-[11px] font-medium text-brand-600 hover:underline disabled:cursor-default disabled:opacity-40 disabled:no-underline dark:text-brand-400`,
                children: h ? `保存中…` : `将当前输入存为常用`
              }),
              (0, scope.W.jsx)(`button`, {
                type: `button`,
                onClick: () => b(true),
                disabled: a,
                className: `text-[11px] font-medium text-brand-600 hover:underline disabled:opacity-40 dark:text-brand-400`,
                children: `管理常用凭据…`
              })
            ]
          }),
          _ && (0, scope.W.jsx)(`p`, {
            role: `status`,
            className: `mt-1 text-[11px] ${_.type === `error` ? `text-rose-600 dark:text-rose-400` : `text-emerald-600 dark:text-emerald-400`}`,
            children: _.text
          }),
          (0, scope.W.jsx)(scope.ls, { open: y, onClose: () => b(false) })
        ]
      });
    };
    scope.ms = function ms({
      open: e,
      sites: t,
      accounts = [],
      proxies: n,
      defaultSiteId: r,
      editing: i,
      onClose: a,
      onSubmit: o,
      onSubmitMany
    }) {
      let [s, c2] = (0, scope.G.useState)(r ?? t[0]?.id ?? ``), [l, u] = (0, scope.G.useState)(``), [d, f2] = (0, scope.G.useState)(``), [p, m] = (0, scope.G.useState)(``), [githubAccountName, setGithubAccountName] = (0, scope.G.useState)(``), [loginEntry, setLoginEntry] = (0, scope.G.useState)(null), [h, g] = (0, scope.G.useState)(``), [_, v2] = (0, scope.G.useState)(scope.ps), [y, b] = (0, scope.G.useState)(``), [x, S] = (0, scope.G.useState)(``), [C2, T] = (0, scope.G.useState)(false), [E, D] = (0, scope.G.useState)(`inherit`), [O, k] = (0, scope.G.useState)(``), [A, j] = (0, scope.G.useState)(`http`), [M, N] = (0, scope.G.useState)(``), [P, ee] = (0, scope.G.useState)(``), [te, F] = (0, scope.G.useState)(``), [ne, re] = (0, scope.G.useState)(``), [I, ie] = (0, scope.G.useState)(false), [L, ae] = (0, scope.G.useState)(``), [loginProbe, setLoginProbe] = (0, scope.G.useState)({
        status: `idle`,
        methods: [],
        entries: []
      }), [probeRetry, setProbeRetry] = (0, scope.G.useState)(0), probeGeneration = (0, scope.G.useRef)(0), probeSiteKey = (0, scope.G.useRef)(null), lastProbeAttempt = (0, scope.G.useRef)(null), manualLoginChoice = (0, scope.G.useRef)(false), oe = n.filter((e2) => e2.nameOnly !== true), se = (0, scope.G.useRef)(false), [entryMode, setEntryMode] = (0, scope.G.useState)(`single`), batch = useAccountBatch({
        open: e,
        siteId: s,
        accounts,
        onImport: onSubmitMany
      });
      const savedEntry = cleanLoginEntry(i?.loginEntry), savedLoginEntry = savedEntry && (!i?.loginMethod || i.loginMethod === `auto` || i.loginMethod === savedEntry.method) ? savedEntry : null;
      (0, scope.G.useEffect)(() => {
        let n2 = e && !se.current;
        se.current = e, n2 && (ae(``), setEntryMode(`single`), i ? (c2(i.siteId), u(i.username), f2(i.password ?? ``), m(i.label ?? ``), g(i.apiToken ?? ``), b(i.githubUsername ?? ``), S(i.githubPassword ?? ``), T(i.passkey ?? false), setLoginEntry(savedLoginEntry), v2(
          savedLoginEntry && i.loginMethod && i.loginMethod !== `auto` ? entryValue(savedLoginEntry) : i.loginMethod || scope.ps
        ), D(i.proxyMode ?? `inherit`), k(i.proxyId ?? ``), j(i.customProxy?.scheme ?? `http`), N(i.customProxy?.host ?? ``), ee(i.customProxy?.port ? String(i.customProxy.port) : ``), F(i.customProxy?.username ?? ``), re(i.customProxy?.password ?? ``)) : (he2(), c2(r ?? t[0]?.id ?? ``)));
      }, [e, i, r, t]);
      let ce = t.find((e2) => e2.id === s), R = !!ce && (0, scope.mn)(ce), ue = ce?.checkin?.method === `none`, selectedLoginEntry = loginEntry && _ === entryValue(loginEntry) ? loginEntry : null, de2 = selectedLoginEntry?.method || _ || `auto`, autoLogin = de2 === `auto`, entryToSave = selectedLoginEntry || (i && autoLogin && (!i.loginMethod || i.loginMethod === `auto`) ? savedLoginEntry : null), waitingForLoginChoice = !i && autoLogin, z = !selectedLoginEntry && _ && !autoLogin && !(0, scope.Io)(de2) && (i || !loginProbe.methods.includes(de2)) ? de2 : null, B = waitingForLoginChoice ? { password: false, token: false, sessionCounts: false, github: false, passkey: false } : (0, scope.Ya)(de2), V = !!i && !autoLogin && ![`form`, `github`].includes(de2) && d === (i.password ?? ``) && h === (i.apiToken ?? ``) && y === (i.githubUsername ?? ``) && x === (i.githubPassword ?? ``) && C2 === (i.passkey ?? false), H = !!i?.identity?.session?.accessToken, githubIncomplete = (autoLogin || de2 === `github`) && !!y.trim() !== !!x, fe = autoLogin ? !githubIncomplete && (d.length > 0 || y.trim().length > 0 && x.length > 0 || !!i?.identity?.userId || H || C2) : V || (B.github ? y.trim().length > 0 && x.length > 0 : B.token ? h.trim().length > 0 || B.sessionCounts && H : !B.password || d.length > 0), U = E === `pool` ? !!O : E !== `custom` || M.trim().length > 0 && Number(P) > 0, pe2 = !waitingForLoginChoice && s && (l.trim() || !i && de2 === `github` && y.trim()) && fe && U, me = E === `pool` && (!i || (i.proxyMode ?? `inherit`) !== `pool` || (i.proxyId ?? ``) !== O);
      (0, scope.G.useEffect)(() => {
        const generation = ++probeGeneration.current;
        if (!e || entryMode !== `single` || !ce) return;
        const siteKey = `${ce.id}|${ce.loginUrl}`;
        const force = lastProbeAttempt.current?.siteKey === siteKey && probeRetry > lastProbeAttempt.current.retry;
        lastProbeAttempt.current = { siteKey, retry: probeRetry };
        if (probeSiteKey.current !== siteKey) {
          probeSiteKey.current = siteKey;
          manualLoginChoice.current = !!i;
          if (!i) {
            setLoginEntry(null);
            v2(scope.ps);
          }
        }
        setLoginProbe({
          status: `loading`,
          methods: [],
          entries: [],
          siteId: ce.id,
          updating: force,
          readingSaved: !!i || !!ce.loginDiscovery
        });
        Promise.resolve().then(
          () => (0, scope.H)({
            type: `PROBE_LOGIN_PAGE`,
            siteId: ce.id,
            ...force ? { force: true } : {},
            ...i && !force ? { savedOnly: true } : {}
          })
        ).then((response) => {
          if (probeGeneration.current !== generation || probeSiteKey.current !== siteKey) return;
          const result = response?.ok ? response.feature?.loginOptions : null;
          if (!result || result.siteId !== ce.id) {
            setLoginProbe({ status: `unavailable`, methods: [], entries: [], siteId: ce.id });
            return;
          }
          const keys = /* @__PURE__ */ new Set(), entries = (Array.isArray(result.entries) ? result.entries : []).slice(0, 64).map(cleanLoginEntry).filter((entry) => entry && !keys.has(entry.key) && keys.add(entry.key));
          const methods = [
            ...new Set(
              entries.length ? entries.map((entry) => entry.method) : (Array.isArray(result.methods) ? result.methods : []).filter(
                (method) => [`form`, `github`, `oauth`, `passkey`, `manual`].includes(method)
              )
            )
          ];
          setLoginProbe({ ...result, methods, entries });
          if (!manualLoginChoice.current) {
            const soleEntry = entries.length === 1 ? entries[0] : null;
            setLoginEntry(soleEntry);
            v2(
              soleEntry ? entryValue(soleEntry) : !entries.length && methods.length === 1 ? methods[0] : scope.ps
            );
          }
        }).catch(() => {
          if (probeGeneration.current === generation && probeSiteKey.current === siteKey)
            setLoginProbe({ status: `unavailable`, methods: [], entries: [], siteId: ce.id });
        });
        return () => {
          if (probeGeneration.current === generation) probeGeneration.current++;
        };
      }, [e, i?.id, s, ce?.loginUrl, entryMode, probeRetry]);
      const loginLabels = {
        form: `站点账号密码`,
        github: `GitHub 登录`,
        oauth: `第三方登录`,
        passkey: `Passkey 登录`,
        manual: `页面验证登录`
      }, detectedChoices = loginProbe.entries.length ? loginProbe.entries.map((entry) => ({
        value: entryValue(entry),
        method: entry.method,
        label: entry.label,
        entry
      })) : loginProbe.methods.map((method) => ({
        value: method,
        method,
        label: loginLabels[method]
      })), manualChoices = [
        ...scope.Po.filter((choice) => [`form`, `github`].includes(choice.value)),
        { value: `oauth`, label: `手动指定：第三方授权（在页面完成）` },
        { value: `manual`, label: `手动指定：验证码 / 其他页面登录` },
        { value: `passkey`, label: `手动指定：Passkey 登录` }
      ], loginChoices = i ? detectedChoices.length ? [...detectedChoices] : [...scope.Po] : detectedChoices.length ? [...detectedChoices] : [...manualChoices], retainedChoice = selectedLoginEntry ? {
        value: entryValue(selectedLoginEntry),
        method: selectedLoginEntry.method,
        label: selectedLoginEntry.label,
        entry: selectedLoginEntry
      } : (i ? scope.Po : manualChoices).find((choice) => choice.value === _), probeHasMethods = detectedChoices.length > 0, chosenDetectedEntry = detectedChoices.find(
        (choice) => choice.value === _ || selectedLoginEntry && choice.entry && choice.entry.method === selectedLoginEntry.method && choice.entry.provider === selectedLoginEntry.provider && choice.entry.provider !== `oauth`
      ), selectedEntryMissing = !!selectedLoginEntry && !!loginProbe.entries.length && !chosenDetectedEntry, probeTitle = loginProbe.status === `loading` ? loginProbe.updating ? `正在更新本站登录方式…` : loginProbe.readingSaved ? `正在读取本站保存的登录方式…` : `首次读取本站登录页…` : probeHasMethods ? selectedEntryMissing ? `本站入口已更新，本账号仍使用：${selectedLoginEntry.label}` : detectedChoices.length === 1 ? `${loginProbe.source === `saved` ? `本站已保存` : `本站已识别`}：${detectedChoices[0].label}` : chosenDetectedEntry ? `已选择：${chosenDetectedEntry.label}` : loginProbe.source === `saved` ? `本站保存了多种登录方式` : `本站支持多种登录方式` : loginProbe.status === `outdated` ? `本站登录地址已改变，等待手动更新` : loginProbe.status === `not-detected` ? `本站尚未保存登录方式` : loginProbe.status === `already-logged-in` ? loginProbe.source === `saved` ? `上次读取时已登录，未保存到登录入口` : `当前页面已登录，未显示登录入口` : loginProbe.status === `unavailable` ? `暂时无法读取本站登录页` : `当前页面未识别出登录方式`, probeDetail = probeHasMethods ? selectedEntryMissing ? `本站保存了${detectedChoices.map((choice) => choice.label).join(`、`)}。本次未找到账号原选定的「${selectedLoginEntry.label}」，原设置已保留；你可以从上方手动选择新的入口。` : detectedChoices.length === 1 ? [`form`, `github`].includes(detectedChoices[0].method) ? `填写此入口对应的账号密码即可。` : detectedChoices[0].method === `oauth` ? `请在「${detectedChoices[0].label}」的第三方授权页登录；这里只填写用于核对身份的账号标识，不收集第三方密码。` : detectedChoices[0].method === `manual` ? `填写账号标识，签到时在页面完成验证码或其他验证，无需填写密码。` : `填写账号标识，签到时在浏览器或系统的 Passkey 提示中确认。` : chosenDetectedEntry ? `下方填写此入口对应的账号信息；需要切换时，可从上方选择其他入口。` : `本站支持${detectedChoices.map((choice) => choice.label).join(`、`)}。请选择你已有的账号使用哪种方式。` : loginProbe.status === `loading` ? loginProbe.readingSaved && !loginProbe.updating ? `读取本地保存结果；需要重新打开网页检测时，请点击「更新登录方式」。` : `只读取本次页面入口，结果会随站点保存，之后直接使用。` : loginProbe.status === `outdated` ? `保存结果对应的登录地址已改变。点击「更新登录方式」重新读取；不会自动打开网页。` : loginProbe.status === `not-detected` ? `点击「更新登录方式」读取一次；也可保留本账号已有的登录方式。` : loginProbe.status === `already-logged-in` ? `当前保存结果未显示登录入口。可手动指定方式，或点击「更新登录方式」重新读取。` : `可手动指定登录方式；需要重新读取网页时，点击「更新登录方式」。手动选择尚未确认本站支持该入口。`;
      if (retainedChoice && !loginChoices.some((choice) => choice.value === retainedChoice.value))
        loginChoices.push(retainedChoice);
      function entryValue(entry) {
        return `entry:${entry.key}`;
      }
      function cleanLoginEntry(value) {
        if (!value || typeof value !== `object` || Array.isArray(value) || ![`form`, `github`, `oauth`, `passkey`, `manual`].includes(value.method))
          return null;
        function text(field, maxLength) {
          const item = value[field];
          return typeof item === `string` && item.trim() && item.trim().length <= maxLength && !/[\u0000-\u001f\u007f]/.test(item) ? item.trim() : ``;
        }
        const key = text(`key`, 160), label = text(`label`, 120), provider = text(`provider`, 80), matchText = text(`matchText`, 240);
        if (!key || !label) return null;
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
      function chooseLoginMethod(value) {
        manualLoginChoice.current = true;
        setLoginEntry(loginChoices.find((choice) => choice.value === value)?.entry || null);
        v2(value);
      }
      function he2() {
        u(``), f2(``), m(``), setGithubAccountName(``), setLoginEntry(null), g(``), b(``), S(``), T(false), v2(scope.ps), manualLoginChoice.current = false, probeSiteKey.current = null, lastProbeAttempt.current = null, probeGeneration.current++, setProbeRetry(0), setLoginProbe({ status: `idle`, methods: [], entries: [] }), D(`inherit`), k(``), j(`http`), N(``), ee(``), F(``), re(``);
      }
      async function ge() {
        if (!pe2 || I) return;
        ie(true), ae(``);
        let e2 = !i && de2 === `github` ? githubAccountName.trim() || y.trim() : l.trim(), t2 = h.trim(), n2 = y.trim(), r2 = B.password ? d : ``, c3 = autoLogin || B.token ? t2 : ``, u2 = B.github ? n2 : ``, f3 = B.github ? x : ``, m2 = autoLogin ? C2 : B.passkey, g2 = i ? V ? {
          password: i.password,
          ...i.apiToken === void 0 ? {} : { apiToken: i.apiToken },
          ...i.githubUsername === void 0 ? {} : { githubUsername: i.githubUsername },
          ...i.githubPassword === void 0 ? {} : { githubPassword: i.githubPassword },
          ...i.passkey === void 0 ? {} : { passkey: i.passkey }
        } : { password: r2, apiToken: c3, githubUsername: u2, githubPassword: f3, passkey: m2 } : {
          password: r2,
          ...c3 ? { apiToken: c3 } : {},
          ...u2 ? { githubUsername: u2 } : {},
          ...f3 ? { githubPassword: f3 } : {},
          ...m2 ? { passkey: true } : {}
        }, v3 = i?.loginMethod || `auto`, b2 = !!i && (i.username !== e2 || v3 !== de2 && !autoLogin || !autoLogin && JSON.stringify(cleanLoginEntry(i.loginEntry)) !== JSON.stringify(entryToSave) || B.password && (i.password ?? ``) !== r2 || B.token && (i.apiToken ?? ``) !== c3 || B.github && ((i.githubUsername ?? ``) !== u2 || (i.githubPassword ?? ``) !== f3)), S2 = !!i && B.token && !t2 && H && i.username === e2, clearIdentity = b2 && !S2;
        try {
          await o({
            siteId: s,
            username: e2,
            ...g2,
            label: p.trim() || void 0,
            loginMethod: de2,
            ...entryToSave ? { loginEntry: entryToSave } : i?.loginEntry ? { loginEntry: null } : {},
            ...clearIdentity ? { identity: {} } : {},
            proxyMode: E,
            ...E === `pool` && O ? { proxyId: O, ...me ? { proxyPinned: true } : {} } : {},
            ...E === `custom` ? {
              customProxy: {
                scheme: A,
                host: M.trim(),
                port: Number(P),
                ...te.trim() ? { username: te.trim() } : {},
                ...ne ? { password: ne } : {}
              }
            } : {}
          }), i || he2(), a();
        } catch (e3) {
          ae(e3 instanceof Error ? e3.message : `账号保存失败`);
        } finally {
          ie(false);
        }
      }
      return (0, scope.W.jsx)(scope.uo, {
        open: e,
        title: i ? `编辑账号` : `添加账号`,
        onClose: () => !I && !batch.savingRef.current && a(),
        footer: !i && entryMode === `batch` ? (0, scope.W.jsx)(AccountBatchFooter, { batch, onClose: a }) : (0, scope.W.jsx)(scope.w.button, {
          whileTap: { scale: 0.98 },
          type: `button`,
          disabled: !pe2 || I,
          onClick: () => void ge(),
          className: scope.fo,
          children: I ? `保存中...` : i ? `保存修改` : `保存账号`
        }),
        children: (0, scope.W.jsxs)(`div`, {
          className: `space-y-4`,
          children: [
            !i && onSubmitMany && (0, scope.W.jsx)(AccountAddModes, {
              mode: entryMode,
              disabled: I || batch.saving,
              onChange: (mode) => {
                if (!I && !batch.savingRef.current) setEntryMode(mode);
              }
            }),
            (0, scope.W.jsx)(scope.Q, {
              label: `所属站点`,
              hint: i ? `账号归属不能改；要换站点请新建一个账号` : void 0,
              children: (0, scope.W.jsx)(`select`, {
                className: scope.$,
                value: s,
                disabled: !!i || I || batch.saving,
                onChange: (event) => {
                  probeGeneration.current++;
                  manualLoginChoice.current = false;
                  probeSiteKey.current = null;
                  setLoginEntry(null);
                  setLoginProbe({ status: `idle`, methods: [], entries: [] });
                  v2(scope.ps);
                  c2(event.target.value);
                },
                children: t.map(
                  (e2) => (0, scope.W.jsx)(`option`, { value: e2.id, children: e2.name }, e2.id)
                )
              })
            }),
            !i && entryMode === `batch` && (0, scope.W.jsx)(AccountBatchContent, { batch }),
            (i || entryMode === `single`) && (0, scope.W.jsxs)(`div`, {
              className: `space-y-4`,
              children: [
                (0, scope.W.jsx)(scope.Q, {
                  label: `登录方式`,
                  hint: i ? `为本账号选择登录方式；已有登录设置和凭据会保留。` : `选择本站实际显示的登录入口，下面填写该入口需要的账号信息。`,
                  children: (0, scope.W.jsxs)(`select`, {
                    className: scope.$,
                    value: _,
                    onChange: (event) => chooseLoginMethod(event.target.value),
                    children: [
                      (0, scope.W.jsx)(`option`, {
                        value: scope.ps,
                        disabled: !i,
                        children: i ? `按页面识别（保留已有设置）` : `请选择账号使用的登录方式`
                      }),
                      z && !loginChoices.some((choice) => choice.value === z) && (0, scope.W.jsxs)(`option`, {
                        value: z,
                        disabled: true,
                        children: [`当前兼容配置：`, scope.Fo[z] || loginLabels[z] || z]
                      }),
                      loginChoices.map(
                        (e2) => (0, scope.W.jsx)(
                          `option`,
                          { value: e2.value, children: e2.label },
                          e2.value
                        )
                      )
                    ]
                  })
                }),
                (0, scope.W.jsxs)(`div`, {
                  role: `status`,
                  "aria-live": `polite`,
                  className: `rounded-lg border border-brand-500/15 bg-brand-500/[0.06] px-3 py-2 text-xs dark:border-brand-400/15 dark:bg-brand-400/[0.08]`,
                  children: [
                    (0, scope.W.jsx)(`p`, {
                      className: `font-medium text-brand-700 dark:text-brand-300`,
                      children: probeTitle
                    }),
                    (0, scope.W.jsx)(`p`, {
                      className: `mt-1 leading-relaxed text-ink-800/70 dark:text-ink-100/70`,
                      children: probeDetail
                    }),
                    loginProbe.persisted && Number.isFinite(loginProbe.checkedAt) && (0, scope.W.jsx)(`p`, {
                      className: `mt-1 text-[11px] text-ink-800/55 dark:text-ink-100/50`,
                      children: `已保存 · ${new Date(loginProbe.checkedAt).toLocaleString(`zh-CN`)} · 仅手动更新时重新打开网页`
                    }),
                    loginProbe.updateError && (0, scope.W.jsx)(`p`, {
                      role: `alert`,
                      className: `mt-1 leading-relaxed text-amber-700 dark:text-amber-300`,
                      children: loginProbe.updateError
                    }),
                    (0, scope.W.jsx)(`button`, {
                      type: `button`,
                      disabled: I || loginProbe.status === `loading`,
                      onClick: () => setProbeRetry((value) => value + 1),
                      className: `mt-1.5 font-medium text-brand-600 hover:underline disabled:opacity-40 dark:text-brand-400`,
                      children: `更新登录方式`
                    })
                  ]
                }),
                githubIncomplete && (0, scope.W.jsx)(`p`, {
                  role: `alert`,
                  className: `text-xs text-rose-600 dark:text-rose-400`,
                  children: `GitHub 凭据尚未填完整，请同时填写用户名和密码，或将两项都留空`
                }),
                B.password && (0, scope.W.jsx)(scope.ds, {
                  kind: `site`,
                  siteId: s,
                  excludeAccountId: i?.id,
                  username: l,
                  password: d,
                  disabled: I,
                  onPick: (e2) => {
                    u(e2.username), f2(e2.password);
                  }
                }),
                !waitingForLoginChoice && (0, scope.W.jsx)(scope.Q, {
                  label: !i && de2 === `github` ? `账号名称（可选）` : B.password ? `站点账号` : `账号标识`,
                  hint: !i && de2 === `github` ? `留空默认使用 GitHub 用户名，仅用于区分账号。` : B.password ? `用于站点自身的账密登录` : de2 === `manual` ? `填写本站用户名或完整邮箱，首次登录后会与当前用户信息核对并绑定。` : `填写本站登录后显示的用户名或完整邮箱，用于核对实际登录身份。`,
                  children: (0, scope.W.jsx)(`input`, {
                    className: scope.$,
                    value: !i && de2 === `github` ? githubAccountName : l,
                    onChange: (event) => {
                      if (!i && de2 === `github`) setGithubAccountName(event.target.value);
                      else u(event.target.value);
                    },
                    placeholder: !i && de2 === `github` ? `留空使用 GitHub 用户名` : B.password || autoLogin ? `站点用户名或邮箱` : de2 === `manual` ? `本站用户名或完整邮箱` : `本站用户名或完整邮箱`
                  })
                }),
                B.password && (0, scope.W.jsx)(scope.Q, {
                  label: `站点密码`,
                  hint: autoLogin ? `页面出现站内账密表单时使用；使用 GitHub 登录的账号可留空` : `仅保存在本机浏览器，不会上传`,
                  children: (0, scope.W.jsx)(`input`, {
                    type: `password`,
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    value: d,
                    onChange: (e2) => f2(e2.target.value),
                    placeholder: `站点登录密码`
                  })
                }),
                B.github && (0, scope.W.jsxs)(`div`, {
                  className: `space-y-3 rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
                  children: [
                    (0, scope.W.jsx)(`p`, {
                      className: `text-xs font-medium text-ink-800 dark:text-ink-100`,
                      children: `GitHub 凭据`
                    }),
                    (0, scope.W.jsx)(scope.ds, {
                      kind: `github`,
                      siteId: s,
                      excludeAccountId: i?.id,
                      username: y,
                      password: x,
                      disabled: I,
                      onPick: (e2) => {
                        b(e2.username), S(e2.password);
                      }
                    }),
                    (0, scope.W.jsx)(scope.Q, {
                      label: `GitHub 用户名或邮箱`,
                      hint: `仅在跳转到 github.com 授权页时自动填写`,
                      children: (0, scope.W.jsx)(`input`, {
                        className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                        value: y,
                        onChange: (e2) => b(e2.target.value),
                        placeholder: `GitHub 用户名或邮箱`
                      })
                    }),
                    (0, scope.W.jsx)(scope.Q, {
                      label: `GitHub 密码`,
                      hint: `仅保存在本机；绝不会派发到站点或其他第三方页面`,
                      children: (0, scope.W.jsx)(`input`, {
                        type: `password`,
                        className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                        value: x,
                        onChange: (e2) => S(e2.target.value),
                        placeholder: `GitHub 登录密码`
                      })
                    })
                  ]
                }),
                B.passkey && (0, scope.W.jsx)(`div`, {
                  className: `rounded-xl bg-ink-50 p-3 text-[11px] leading-relaxed text-ink-800/60 dark:bg-ink-900/60 dark:text-ink-100/50`,
                  children: `将使用浏览器/系统保存的 Passkey。扩展不会保存或模拟 Passkey 私钥；签到时会点站点的 Passkey 按钮，并等待你在原生系统提示中确认。`
                }),
                de2 === `oauth` && (0, scope.W.jsx)(`div`, {
                  className: `rounded-xl bg-ink-50 p-3 text-xs leading-relaxed text-ink-800/70 dark:bg-ink-900/60 dark:text-ink-100/65`,
                  children: `将打开「${selectedLoginEntry?.label || `第三方登录`}」入口。请在第三方授权页登录并完成授权；这里只保存用于核对身份的账号标识，不收集第三方密码。`
                }),
                de2 === `manual` && (0, scope.W.jsx)(`div`, {
                  className: `rounded-xl bg-ink-50 p-3 text-xs leading-relaxed text-ink-800/70 dark:bg-ink-900/60 dark:text-ink-100/65`,
                  children: `将使用「${selectedLoginEntry?.label || `页面验证登录`}」。填写账号标识，签到时在页面完成验证码或其他验证，无需填写密码。`
                }),
                B.token ? (0, scope.W.jsx)(scope.Q, {
                  label: H ? `API Token（可留空）` : `API Token`,
                  hint: H ? `已抓取登录态（${new Date(i.identity.session.capturedAt).toLocaleString(`zh-CN`)}），不用填 token` : `推荐：在站点手动登录后，用账号行上的钥匙按钮「抓取登录态」。也可手填 ${ce?.tokenConfig?.storageKey || `token`} 的值（会较快过期）`,
                  children: (0, scope.W.jsx)(`input`, {
                    type: `password`,
                    className: scope.$,
                    value: h,
                    onChange: (e2) => g(e2.target.value),
                    placeholder: H ? `已有登录态，留空即可` : `eyJhbGciOi...`
                  })
                }) : null,
                (0, scope.W.jsxs)(`details`, {
                  className: `rounded-lg border border-black/5 bg-ink-50 px-3 py-2 text-xs text-ink-800/70 dark:border-white/10 dark:bg-ink-900/60 dark:text-ink-100/65`,
                  children: [
                    (0, scope.W.jsxs)(`summary`, {
                      className: `cursor-pointer font-medium text-ink-800 dark:text-ink-100`,
                      children: [
                        `本站共用签到流程 · `,
                        R ? `学习流程回放` : ue ? `登录即签到` : ce?.checkin?.method && ce.checkin.method !== `auto` ? `本站适配` : `自动识别`
                      ]
                    }),
                    (0, scope.W.jsxs)(`p`, {
                      className: `mt-2 leading-relaxed`,
                      children: [
                        `先登录并确认账号 → `,
                        R ? `执行本站已保存的签到流程` : ue ? `登录成功后直接视为签到完成，不再寻找签到按钮` : `自动完成签到；可从账号旁「学习本站流程」一次教会登录与签到`
                      ]
                    }),
                    (0, scope.W.jsx)(`p`, {
                      className: `mt-1 leading-relaxed`,
                      children: `本站现有和新增账号共用；任一账号学习都会更新本站流程。各账号用自己的凭据登录，无需逐个学习。`
                    })
                  ]
                }),
                (0, scope.W.jsx)(scope.Q, {
                  label: `备注`,
                  hint: `可选，用于区分同站多个账号`,
                  children: (0, scope.W.jsx)(`input`, {
                    className: scope.$,
                    value: p,
                    onChange: (e2) => m(e2.target.value),
                    placeholder: `小号 / 主号`
                  })
                }),
                (0, scope.W.jsx)(scope.Q, {
                  label: `代理`,
                  hint: `同一站点的不同账号可以走不同出口`,
                  children: (0, scope.W.jsx)(`select`, {
                    className: scope.$,
                    value: E,
                    onChange: (e2) => D(e2.target.value),
                    children: scope.fs.map(
                      (e2) => (0, scope.W.jsx)(`option`, { value: e2.value, children: e2.label }, e2.value)
                    )
                  })
                }),
                E === `pool` && (0, scope.W.jsx)(scope.Q, {
                  label: `选择代理`,
                  hint: oe.length ? void 0 : `还没有可用出口，请先在代理管理里同步 Clash Verge 配置`,
                  children: (0, scope.W.jsxs)(`select`, {
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    value: O,
                    onChange: (e2) => k(e2.target.value),
                    children: [
                      (0, scope.W.jsx)(`option`, { value: ``, children: `请选择` }),
                      i?.proxyId && n.find((e2) => e2.id === i.proxyId)?.nameOnly && (0, scope.W.jsxs)(`option`, {
                        value: i.proxyId,
                        disabled: true,
                        children: [
                          n.find((e2) => e2.id === i.proxyId)?.name,
                          `（仅名称，无出口）`
                        ]
                      }),
                      oe.map(
                        (e2) => (0, scope.W.jsxs)(
                          `option`,
                          {
                            value: e2.id,
                            children: [
                              e2.name,
                              `（`,
                              e2.scheme,
                              `://`,
                              e2.host,
                              `:`,
                              e2.port,
                              `）`
                            ]
                          },
                          e2.id
                        )
                      )
                    ]
                  })
                }),
                E === `custom` && (0, scope.W.jsxs)(scope.w.div, {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: `auto` },
                  className: `space-y-3 overflow-hidden rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
                  children: [
                    (0, scope.W.jsx)(scope.Q, {
                      label: `协议`,
                      children: (0, scope.W.jsxs)(`select`, {
                        className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                        value: A,
                        onChange: (e2) => j(e2.target.value),
                        children: [
                          (0, scope.W.jsx)(`option`, { value: `http`, children: `HTTP` }),
                          (0, scope.W.jsx)(`option`, { value: `https`, children: `HTTPS` }),
                          (0, scope.W.jsx)(`option`, { value: `socks5`, children: `SOCKS5` }),
                          (0, scope.W.jsx)(`option`, { value: `socks4`, children: `SOCKS4` })
                        ]
                      })
                    }),
                    (0, scope.W.jsx)(scope.Q, {
                      label: `地址`,
                      children: (0, scope.W.jsx)(`input`, {
                        className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                        value: M,
                        onChange: (e2) => N(e2.target.value),
                        placeholder: `127.0.0.1`
                      })
                    }),
                    (0, scope.W.jsx)(scope.Q, {
                      label: `端口`,
                      children: (0, scope.W.jsx)(`input`, {
                        className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                        inputMode: `numeric`,
                        value: P,
                        onChange: (e2) => ee(e2.target.value.replace(/\D/g, ``)),
                        placeholder: `7890`
                      })
                    }),
                    (0, scope.W.jsx)(scope.Q, {
                      label: `认证`,
                      hint: `可选，需要账号密码的代理才填`,
                      children: (0, scope.W.jsxs)(`div`, {
                        className: `grid grid-cols-2 gap-2`,
                        children: [
                          (0, scope.W.jsx)(`input`, {
                            className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                            value: te,
                            onChange: (e2) => F(e2.target.value),
                            placeholder: `用户名`
                          }),
                          (0, scope.W.jsx)(`input`, {
                            type: `password`,
                            className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                            value: ne,
                            onChange: (e2) => re(e2.target.value),
                            placeholder: `密码`
                          })
                        ]
                      })
                    })
                  ]
                }),
                L && (0, scope.W.jsx)(`p`, {
                  role: `alert`,
                  className: `text-xs text-rose-600 dark:text-rose-400`,
                  children: L
                })
              ]
            })
          ]
        })
      });
    };
    scope.hs = function hs(e) {
      let t = (0, scope.ys)(e);
      if (t.length < 2) throw Error(`CSV 中没有可导入的密码记录`);
      let n = t[0];
      if (!n) throw Error(`CSV 缺少表头`);
      let r = n.map((e2, t2) => (t2 === 0 ? e2.replace(/^\uFEFF/, ``) : e2).trim().toLowerCase()), i = [`name`, `url`, `username`, `password`], a = Object.fromEntries(i.map((e2) => [e2, r.indexOf(e2)])), o = i.filter((e2) => a[e2] < 0);
      if (o.length > 0) throw Error(`不是 Chrome 密码 CSV，缺少列：${o.join(`, `)}`);
      return t.slice(1).filter((e2) => e2.some((e3) => e3.trim().length > 0)).map((e2, t2) => {
        let n2 = e2[a.url]?.trim() ?? ``;
        return {
          id: `password-${t2 + 1}`,
          name: e2[a.name]?.trim() ?? ``,
          url: n2,
          username: e2[a.username]?.trim() ?? ``,
          password: e2[a.password] ?? ``,
          host: (0, scope.vs)(n2)
        };
      });
    };
    scope.gs = function gs(e, t, n) {
      let r = /* @__PURE__ */ new Map();
      for (let e2 of t) {
        let t2 = (0, scope.vs)(e2.loginUrl);
        t2 && r.set(t2, [...r.get(t2) ?? [], e2]);
      }
      let i = new Set(n.map((e2) => (0, scope._s)(e2.siteId, e2.username))), a = /* @__PURE__ */ new Set();
      return e.map((e2) => {
        if (!e2.host || !e2.username || !e2.password)
          return { credential: e2, kind: `invalid`, candidateSiteIds: [] };
        let t2 = r.get(e2.host) ?? [], n2 = t2.map((e3) => e3.id);
        if (t2.length === 0) return { credential: e2, kind: `unmatched`, candidateSiteIds: n2 };
        if (t2.length > 1) return { credential: e2, kind: `ambiguous`, candidateSiteIds: n2 };
        let [o] = t2;
        if (!o) return { credential: e2, kind: `unmatched`, candidateSiteIds: n2 };
        let s = o.id, c2 = (0, scope._s)(s, e2.username);
        return i.has(c2) ? { credential: e2, siteId: s, kind: `existing`, candidateSiteIds: n2 } : a.has(c2) ? { credential: e2, siteId: s, kind: `duplicate`, candidateSiteIds: n2 } : (a.add(c2), { credential: e2, siteId: s, kind: `matched`, candidateSiteIds: n2 });
      });
    };
    scope._s = function _s(e, t) {
      return `${e}\0${t.trim().toLowerCase()}`;
    };
    scope.vs = function vs(e) {
      try {
        let t = new URL(e);
        if (t.protocol !== `http:` && t.protocol !== `https:`) return ``;
        let n = t.hostname.toLowerCase().replace(/\.$/, ``);
        return n.startsWith(`www.`) ? n.slice(4) : n;
      } catch {
        return ``;
      }
    };
    scope.ys = function ys(e) {
      let t = [], n = [], r = ``, i = false;
      for (let a = 0; a < e.length; a += 1) {
        let o = e[a];
        i ? o === `"` ? e[a + 1] === `"` ? (r += `"`, a += 1) : i = false : r += o : o === `"` && r.length === 0 ? i = true : o === `,` ? (n.push(r), r = ``) : o === `
` || o === `\r` ? (n.push(r), t.push(n), n = [], r = ``, o === `\r` && e[a + 1] === `
` && (a += 1)) : r += o;
      }
      if (i) throw Error(`CSV 中存在未闭合的引号`);
      return (r.length > 0 || n.length > 0) && (n.push(r), t.push(n)), t;
    };
    scope.bs = function bs({ open: e, sites: t, accounts: n, onClose: r, onImport: i }) {
      let a = (0, scope.G.useRef)(null), [s, c2] = (0, scope.G.useState)([]), [d, f2] = (0, scope.G.useState)(/* @__PURE__ */ new Set()), [p, m] = (0, scope.G.useState)(``), [h, g] = (0, scope.G.useState)(``), [_, v2] = (0, scope.G.useState)(`all`), [y, b] = (0, scope.G.useState)(``), [x, S] = (0, scope.G.useState)(false);
      (0, scope.G.useEffect)(() => {
        c2([]), f2(/* @__PURE__ */ new Set()), m(``), g(``), v2(`all`), b(``);
      }, [e]);
      let C2 = (0, scope.G.useMemo)(
        () => new Set(n.map((e2) => (0, scope._s)(e2.siteId, e2.username))),
        [n]
      ), T = (0, scope.G.useMemo)(() => {
        let e2 = /* @__PURE__ */ new Map();
        for (let t2 of s) {
          if (!t2.siteId || !t2.credential.username) continue;
          let n2 = (0, scope._s)(t2.siteId, t2.credential.username);
          e2.set(n2, (e2.get(n2) ?? 0) + 1);
        }
        return e2;
      }, [s]), E = (0, scope.G.useMemo)(() => {
        let e2 = 0, t2 = 0, n2 = 0, r2 = 0;
        for (let i2 of s)
          i2.kind === `invalid` ? r2 += 1 : i2.siteId && C2.has((0, scope._s)(i2.siteId, i2.credential.username)) ? n2 += 1 : i2.siteId ? e2 += 1 : t2 += 1;
        return { all: s.length, matched: e2, unmatched: t2, existing: n2, invalid: r2 };
      }, [C2, s]), D = (0, scope.G.useMemo)(() => {
        let e2 = h.trim().toLocaleLowerCase();
        return s.filter((n2) => {
          let r2 = (0, scope.xs)(n2, C2) ? `existing` : n2.siteId ? `matched` : `unmatched`;
          if (_ !== `all` && r2 !== _) return false;
          if (!e2) return true;
          let i2 = t.find((e3) => e3.id === n2.siteId)?.name ?? ``;
          return [n2.credential.host, n2.credential.username, n2.credential.name, i2].some(
            (t2) => t2.toLocaleLowerCase().includes(e2)
          );
        });
      }, [C2, _, s, h, t]);
      async function O(e2) {
        if (e2) {
          b(``);
          try {
            let r2 = (0, scope.gs)((0, scope.hs)(await e2.text()), t, n);
            c2(r2), f2(new Set(r2.filter((e3) => e3.kind === `matched`).map((e3) => e3.credential.id))), m(e2.name), v2(`all`), g(``);
          } catch (t2) {
            c2([]), f2(/* @__PURE__ */ new Set()), m(e2.name), b(t2 instanceof Error ? t2.message : `无法读取 Chrome 密码 CSV`);
          }
        }
      }
      function k(e2, t2) {
        let n2 = s.find((t3) => t3.credential.id === e2);
        if (!n2) return;
        let r2 = t2 ? C2.has((0, scope._s)(t2, n2.credential.username)) ? `existing` : `manual` : n2.candidateSiteIds.length > 1 ? `ambiguous` : `unmatched`;
        c2(
          (n3) => n3.map((n4) => n4.credential.id === e2 ? { ...n4, siteId: t2 || void 0, kind: r2 } : n4)
        ), f2((i2) => {
          let a2 = new Set(i2);
          if (a2.delete(e2), t2 && r2 !== `existing`) {
            let r3 = (0, scope._s)(t2, n2.credential.username);
            for (let e3 of s)
              e3.siteId && (0, scope._s)(e3.siteId, e3.credential.username) === r3 && a2.delete(e3.credential.id);
            a2.add(e2);
          }
          return a2;
        });
      }
      function A(e2) {
        e2.siteId && e2.kind !== `invalid` && !(0, scope.xs)(e2, C2) && f2((t2) => {
          let n2 = new Set(t2);
          if (n2.has(e2.credential.id)) return n2.delete(e2.credential.id), n2;
          let r2 = (0, scope._s)(e2.siteId, e2.credential.username);
          for (let e3 of s)
            e3.siteId && (0, scope._s)(e3.siteId, e3.credential.username) === r2 && n2.delete(e3.credential.id);
          return n2.add(e2.credential.id), n2;
        });
      }
      async function j() {
        if (d.size === 0 || x) return;
        let e2 = s.flatMap(
          (e3) => !d.has(e3.credential.id) || !e3.siteId || (0, scope.xs)(e3, C2) ? [] : [
            {
              siteId: e3.siteId,
              username: e3.credential.username.trim(),
              password: e3.credential.password
            }
          ]
        );
        if (e2.length !== 0) {
          S(true);
          try {
            await i(e2), r();
          } finally {
            S(false);
          }
        }
      }
      return (0, scope.W.jsxs)(scope.uo, {
        open: e,
        title: `匹配导入账号`,
        onClose: () => !x && r(),
        wide: true,
        children: [
          (0, scope.W.jsx)(`input`, {
            ref: a,
            type: `file`,
            accept: `.csv,text/csv`,
            className: `hidden`,
            onChange: (e2) => {
              O(e2.target.files?.[0]), e2.target.value = ``;
            }
          }),
          s.length === 0 ? (0, scope.W.jsxs)(`div`, {
            className: `space-y-3`,
            children: [
              (0, scope.W.jsxs)(`button`, {
                type: `button`,
                onClick: () => a.current?.click(),
                className: `flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-black/10 py-12 text-center transition-colors hover:border-brand-500/40 hover:bg-brand-500/[0.03] dark:border-white/10 dark:hover:bg-brand-500/[0.06]`,
                children: [
                  (0, scope.W.jsx)(`span`, {
                    className: `mb-3 flex size-12 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400`,
                    children: (0, scope.W.jsx)(scope.Fe, { className: `size-5` })
                  }),
                  (0, scope.W.jsx)(`span`, {
                    className: `text-sm font-semibold text-ink-900 dark:text-white`,
                    children: `选择 Chrome 密码 CSV`
                  }),
                  (0, scope.W.jsx)(`span`, {
                    className: `mt-1 text-[11px] text-ink-800/40 dark:text-ink-100/35`,
                    children: `仅自动勾选域名唯一匹配的账号`
                  })
                ]
              }),
              y && (0, scope.W.jsx)(`p`, {
                className: `rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-300`,
                children: y
              })
            ]
          }) : (0, scope.W.jsxs)(`div`, {
            className: `space-y-3`,
            children: [
              (0, scope.W.jsxs)(`div`, {
                className: `flex flex-wrap items-center gap-2`,
                children: [
                  (0, scope.W.jsx)(`span`, {
                    className: `flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400`,
                    children: (0, scope.W.jsx)(scope.Fe, { className: `size-4` })
                  }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `min-w-[160px] flex-1`,
                    children: [
                      (0, scope.W.jsx)(`p`, {
                        className: `truncate text-xs font-semibold text-ink-900 dark:text-white`,
                        children: p
                      }),
                      (0, scope.W.jsxs)(`p`, {
                        className: `text-[10px] text-ink-800/40 dark:text-ink-100/35`,
                        children: [`共 `, E.all, ` 条记录`]
                      })
                    ]
                  }),
                  (0, scope.W.jsxs)(`button`, {
                    type: `button`,
                    disabled: x,
                    onClick: () => a.current?.click(),
                    className: `inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-brand-600 ring-1 ring-brand-500/20 hover:bg-brand-500/10 disabled:opacity-40 dark:text-brand-400`,
                    children: [
                      (0, scope.W.jsx)(scope.B, { className: `size-3.5` }),
                      `更换文件`
                    ]
                  })
                ]
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `grid grid-cols-2 gap-2 sm:grid-cols-4`,
                children: [
                  (0, scope.W.jsx)(scope.Ss, {
                    label: `已匹配`,
                    value: E.matched,
                    tone: `emerald`
                  }),
                  (0, scope.W.jsx)(scope.Ss, {
                    label: `待匹配`,
                    value: E.unmatched,
                    tone: `amber`
                  }),
                  (0, scope.W.jsx)(scope.Ss, {
                    label: `已存在`,
                    value: E.existing,
                    tone: `ink`
                  }),
                  (0, scope.W.jsx)(scope.Ss, { label: `无效`, value: E.invalid, tone: `rose` })
                ]
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `flex flex-wrap items-center gap-2`,
                children: [
                  (0, scope.W.jsxs)(`div`, {
                    className: `relative min-w-[180px] flex-1`,
                    children: [
                      (0, scope.W.jsx)(scope.l, {
                        className: `pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-800/30 dark:text-ink-100/25`
                      }),
                      (0, scope.W.jsx)(`input`, {
                        value: h,
                        onChange: (e2) => g(e2.target.value),
                        placeholder: `搜索域名、用户名或站点`,
                        className: `h-9 w-full rounded-lg bg-ink-50 pl-8 pr-3 text-xs outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-brand-500/40 dark:bg-ink-950/50 dark:ring-white/10`
                      })
                    ]
                  }),
                  (0, scope.W.jsx)(`div`, {
                    className: `flex rounded-lg bg-ink-50 p-1 ring-1 ring-black/5 dark:bg-ink-950/50 dark:ring-white/10`,
                    children: [
                      [`all`, `全部`],
                      [`matched`, `已匹配`],
                      [`unmatched`, `待匹配`],
                      [`existing`, `已存在`]
                    ].map(
                      ([e2, t2]) => (0, scope.W.jsx)(
                        `button`,
                        {
                          type: `button`,
                          onClick: () => v2(e2),
                          className: (0, scope.R)(
                            `h-7 rounded-md px-2 text-[10px] font-medium transition-colors`,
                            _ === e2 ? `bg-white text-ink-900 shadow-sm dark:bg-ink-800 dark:text-white` : `text-ink-800/45 hover:text-ink-900 dark:text-ink-100/40 dark:hover:text-white`
                          ),
                          children: t2
                        },
                        e2
                      )
                    )
                  })
                ]
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `max-h-[360px] overflow-y-auto rounded-lg ring-1 ring-black/5 dark:ring-white/10`,
                children: [
                  D.map((e2) => {
                    let n2 = (0, scope.xs)(e2, C2), r2 = e2.siteId ? (T.get((0, scope._s)(e2.siteId, e2.credential.username)) ?? 0) > 1 : false, i2 = d.has(e2.credential.id), a2 = !!e2.siteId && e2.kind !== `invalid` && !n2, s2 = [...t].sort(
                      (t2, n3) => Number(e2.candidateSiteIds.includes(n3.id)) - Number(e2.candidateSiteIds.includes(t2.id))
                    );
                    return (0, scope.W.jsxs)(
                      `div`,
                      {
                        className: (0, scope.R)(
                          `flex flex-wrap items-center gap-2 border-b border-black/5 px-3 py-2.5 last:border-b-0 dark:border-white/5`,
                          i2 && `bg-emerald-500/[0.045] dark:bg-emerald-500/[0.06]`
                        ),
                        children: [
                          (0, scope.W.jsx)(`button`, {
                            type: `button`,
                            disabled: !a2,
                            onClick: () => A(e2),
                            "aria-label": `${i2 ? `取消选择` : `选择`}账号 ${e2.credential.username || e2.credential.host}`,
                            className: (0, scope.R)(
                              `flex size-5 shrink-0 items-center justify-center rounded border transition-colors`,
                              i2 ? `border-emerald-500 bg-emerald-500 text-white` : `border-black/15 text-transparent dark:border-white/20`,
                              !a2 && `cursor-not-allowed opacity-35`
                            ),
                            children: i2 ? (0, scope.W.jsx)(scope.o, { className: `size-3.5 stroke-[3]` }) : (0, scope.W.jsx)(scope.ve, { className: `size-3.5` })
                          }),
                          (0, scope.W.jsx)(`span`, {
                            className: `flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-800/35 ring-1 ring-black/5 dark:bg-white/5 dark:text-ink-100/35 dark:ring-white/10`,
                            children: (0, scope.W.jsx)(scope.Ge, { className: `size-3.5` })
                          }),
                          (0, scope.W.jsxs)(`div`, {
                            className: `min-w-[130px] flex-1`,
                            children: [
                              (0, scope.W.jsx)(`p`, {
                                className: `truncate text-xs font-medium text-ink-900 dark:text-white`,
                                children: e2.credential.username || `缺少用户名`
                              }),
                              (0, scope.W.jsx)(`p`, {
                                className: `truncate text-[10px] text-ink-800/40 dark:text-ink-100/35`,
                                children: e2.credential.host || e2.credential.url || `无效地址`
                              })
                            ]
                          }),
                          (0, scope.W.jsxs)(`select`, {
                            "aria-label": `匹配站点 ${e2.credential.username || e2.credential.host}`,
                            value: e2.siteId ?? ``,
                            disabled: e2.kind === `invalid` || x,
                            onChange: (t2) => k(e2.credential.id, t2.target.value),
                            className: `h-8 w-full rounded-lg bg-ink-50 px-2 text-[11px] text-ink-900 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-brand-500/40 disabled:opacity-40 dark:bg-ink-950/50 dark:text-white dark:ring-white/10 sm:w-44`,
                            children: [
                              (0, scope.W.jsx)(`option`, { value: ``, children: `未匹配站点` }),
                              s2.map(
                                (e3) => (0, scope.W.jsx)(
                                  `option`,
                                  { value: e3.id, children: e3.name },
                                  e3.id
                                )
                              )
                            ]
                          }),
                          (0, scope.W.jsx)(scope.Cs, { match: e2, existing: n2, duplicate: r2 })
                        ]
                      },
                      e2.credential.id
                    );
                  }),
                  D.length === 0 && (0, scope.W.jsx)(`div`, {
                    className: `py-10 text-center text-xs text-ink-800/40 dark:text-ink-100/35`,
                    children: `没有符合当前条件的记录`
                  })
                ]
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `flex flex-wrap items-center justify-between gap-2`,
                children: [
                  (0, scope.W.jsxs)(`span`, {
                    className: `text-xs text-ink-800/50 dark:text-ink-100/40`,
                    children: [`已选择 `, d.size, ` 个账号`]
                  }),
                  (0, scope.W.jsxs)(scope.w.button, {
                    whileTap: { scale: d.size ? 0.98 : 1 },
                    type: `button`,
                    disabled: d.size === 0 || x,
                    onClick: () => void j(),
                    className: `inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-500 px-4 text-xs font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600 disabled:opacity-40 disabled:shadow-none`,
                    children: [
                      x ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` }) : (0, scope.W.jsx)(scope.Fe, { className: `size-4` }),
                      x ? `导入中` : `导入匹配账号 (${d.size})`
                    ]
                  })
                ]
              })
            ]
          })
        ]
      });
    };
    scope.xs = function xs(e, t) {
      return !!e.siteId && t.has((0, scope._s)(e.siteId, e.credential.username));
    };
    scope.Ss = function Ss({ label: e, value: t, tone: n }) {
      return (0, scope.W.jsxs)(`div`, {
        className: (0, scope.R)(
          `flex items-center justify-between rounded-lg px-3 py-2`,
          {
            emerald: `bg-emerald-500/10 text-emerald-700 dark:text-emerald-300`,
            amber: `bg-amber-500/10 text-amber-700 dark:text-amber-300`,
            ink: `bg-black/5 text-ink-800/60 dark:bg-white/10 dark:text-ink-100/55`,
            rose: `bg-rose-500/10 text-rose-700 dark:text-rose-300`
          }[n]
        ),
        children: [
          (0, scope.W.jsx)(`span`, { className: `text-[10px] font-medium`, children: e }),
          (0, scope.W.jsx)(`span`, { className: `text-sm font-bold tabular-nums`, children: t })
        ]
      });
    };
    scope.Cs = function Cs({ match: e, existing: t, duplicate: n }) {
      return e.kind === `invalid` ? (0, scope.W.jsx)(scope.ws, {
        label: `无效`,
        className: `bg-rose-500/10 text-rose-700 dark:text-rose-300`
      }) : t ? (0, scope.W.jsx)(scope.ws, {
        label: `已存在`,
        className: `bg-black/5 text-ink-800/55 dark:bg-white/10 dark:text-ink-100/50`
      }) : !e.siteId && e.kind === `ambiguous` ? (0, scope.W.jsx)(scope.ws, {
        label: `多个候选`,
        className: `bg-amber-500/10 text-amber-700 dark:text-amber-300`
      }) : e.siteId ? n || e.kind === `duplicate` ? (0, scope.W.jsx)(scope.ws, {
        label: `同账号多条`,
        className: `bg-amber-500/10 text-amber-700 dark:text-amber-300`
      }) : e.kind === `manual` ? (0, scope.W.jsx)(scope.ws, {
        label: `手动匹配`,
        className: `bg-brand-500/10 text-brand-700 dark:text-brand-300`
      }) : (0, scope.W.jsx)(scope.ws, {
        label: `域名匹配`,
        className: `bg-emerald-500/10 text-emerald-700 dark:text-emerald-300`
      }) : (0, scope.W.jsx)(scope.ws, {
        label: `未匹配`,
        className: `bg-amber-500/10 text-amber-700 dark:text-amber-300`
      });
    };
    scope.ws = function ws({ label: e, className: t }) {
      return (0, scope.W.jsx)(`span`, {
        className: (0, scope.R)(`shrink-0 rounded-md px-1.5 py-1 text-[10px] font-medium`, t),
        children: e
      });
    };
    scope.$s = function $s(e) {
      return e === `name-desc` || e === `added` ? e : scope.Qs;
    };
    scope.tc = function tc(e, t = scope.Qs) {
      if (t === `added`) return [...e];
      let n = t === `name-desc` ? -1 : 1;
      return [...e].sort(
        (e2, t2) => n * scope.ec.compare(e2.label || e2.username, t2.label || t2.username)
      );
    };
    scope.Nl = function Nl(e, t) {
      if (t = Object.assign(Object.assign({}, scope.Ml), t || {}), !(0, scope._l)(e)) return e;
      if (e === ``) return t.type === `array` || t.type === `all` ? [] : ``;
      t.surname === void 0 && (t.mode === `surname` ? t.surname = `all` : t.surname = `off`), t.type === `all` && (t.pattern = `pinyin`), t.pattern === `num` && (t.toneType = `none`), t.removeNonZh && (t.nonZh = `removed`);
      let n = (0, scope.cc)(e), { list: r } = (0, scope.rl)(e, Array(n.length), t.surname, t.segmentit, t.traditional, n);
      r = (0, scope.jl)(r, t.toneSandhi), r = (0, scope.yl)(r, t);
      let i = (0, scope.bl)(e, t);
      return i && (r = i), (0, scope.xl)(r, t), (0, scope.Sl)(r, t), (0, scope.Cl)(r, t), (0, scope.wl)(r, t, e);
    };
    scope.Fl = function Fl(e) {
      return e === `name-desc` || e === `manual` ? e : scope.Pl;
    };
    scope.Ll = function Ll(e, t = scope.Pl) {
      if (t === `manual`) return [...e];
      let n = t === `name-desc` ? -1 : 1;
      return e.map((e2) => ({
        site: e2,
        key: (0, scope.Nl)(e2.name.trim(), { toneType: `none`, type: `array` }).join(``)
      })).sort((e2, t2) => n * scope.Il.compare(e2.key, t2.key)).map(({ site: e2 }) => e2);
    };
    scope.Rl = function Rl(e, t, n, r) {
      let i = [...e], a = i.indexOf(t);
      if (a < 0) return i;
      let o = (e2) => !r || r.has(e2);
      if (n === `up`) {
        let e2 = a - 1;
        for (; e2 >= 0 && !o(i[e2]); ) --e2;
        return e2 < 0 || (i.splice(a, 1), i.splice(e2, 0, t)), i;
      }
      let s = a + 1;
      for (; s < i.length && !o(i[s]); ) s += 1;
      return s >= i.length || (i.splice(a, 1), i.splice(s, 0, t)), i;
    };
    scope.zl = function zl({ value: e, onChange: t, compact: n }) {
      return (0, scope.W.jsxs)(`label`, {
        className: (0, scope.R)(
          `flex h-8 min-w-0 items-center gap-1.5 rounded-md border border-black/8 bg-white px-2 text-[11px] dark:border-white/10 dark:bg-ink-900`,
          n ? `grow` : `shrink-0`
        ),
        title: `按账号名称排序：有备注用备注，否则用用户名`,
        children: [
          (0, scope.W.jsx)(`span`, {
            className: `shrink-0 text-ink-800/60 dark:text-ink-100/60`,
            children: `账号排序`
          }),
          (0, scope.W.jsxs)(`select`, {
            "aria-label": `账号排序`,
            value: e,
            onChange: (e2) => t((0, scope.$s)(e2.target.value)),
            className: `min-w-0 flex-1 cursor-pointer rounded bg-white py-1 text-ink-900 outline-none focus:ring-2 focus:ring-brand-500/30 dark:bg-ink-900 dark:text-ink-50`,
            children: [
              (0, scope.W.jsx)(`option`, { value: `name-asc`, children: `名称 A→Z（默认）` }),
              (0, scope.W.jsx)(`option`, { value: `name-desc`, children: `名称 Z→A` }),
              (0, scope.W.jsx)(`option`, { value: `added`, children: `添加顺序` })
            ]
          })
        ]
      });
    };
    scope.Ql = function Ql({
      siteCount: e,
      accountCount: t,
      onSelectAll: n,
      onClear: r,
      onDelete: i
    }) {
      let a = e + t;
      return (0, scope.W.jsxs)(scope.w.div, {
        initial: { opacity: 0, y: 30, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.97 },
        transition: { type: `spring`, stiffness: 420, damping: 32 },
        className: `fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 flex-wrap items-center gap-2 rounded-xl bg-ink-900 px-3 py-2.5 text-white shadow-2xl ring-1 ring-white/10 dark:bg-white dark:text-ink-900 dark:ring-black/10`,
        children: [
          (0, scope.W.jsx)(`span`, {
            className: `flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-rose-300 dark:bg-rose-500/10 dark:text-rose-600`,
            children: (0, scope.W.jsx)(scope._t, { className: `size-4` })
          }),
          (0, scope.W.jsxs)(`div`, {
            className: `min-w-[112px] flex-1`,
            children: [
              (0, scope.W.jsxs)(`p`, {
                className: `text-xs font-semibold`,
                children: [`已选 `, a, ` 项`]
              }),
              (0, scope.W.jsxs)(`p`, {
                className: `text-[10px] text-white/55 dark:text-ink-800/50`,
                children: [e, ` 个站点 · `, t, ` 个账号`]
              })
            ]
          }),
          (0, scope.W.jsx)(`button`, {
            type: `button`,
            onClick: n,
            className: `h-8 rounded-lg px-2.5 text-[11px] font-medium text-white/70 hover:bg-white/10 hover:text-white dark:text-ink-800/60 dark:hover:bg-black/5 dark:hover:text-ink-900`,
            children: `全选`
          }),
          (0, scope.W.jsx)(`button`, {
            type: `button`,
            onClick: r,
            disabled: a === 0,
            className: `h-8 rounded-lg px-2.5 text-[11px] font-medium text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-35 dark:text-ink-800/60 dark:hover:bg-black/5 dark:hover:text-ink-900`,
            children: `清空`
          }),
          (0, scope.W.jsxs)(scope.w.button, {
            whileHover: { scale: a ? 1.03 : 1 },
            whileTap: { scale: a ? 0.97 : 1 },
            type: `button`,
            onClick: i,
            disabled: a === 0,
            className: `inline-flex h-8 items-center gap-1.5 rounded-lg bg-rose-500 px-3 text-[11px] font-semibold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-35`,
            children: [(0, scope.W.jsx)(scope.v, { className: `size-3.5` }), `删除选中`]
          })
        ]
      });
    };
    scope.iu = function iu({ site: e, attention: t }) {
      let n = (e?.name || `?`).trim().slice(0, 1).toUpperCase();
      return (0, scope.W.jsx)(`span`, {
        className: (0, scope.R)(
          `grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg text-xs font-bold ring-1 ring-inset`,
          t ? `bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:ring-cyan-900` : `bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900`
        ),
        children: e ? (0, scope.W.jsx)(scope.no, { site: e, className: `size-5 rounded`, fallback: n }) : n
      });
    };
    scope.au = function au({ accounts: e, sites: t, compact: n = false, onRecover: r, onAddSite: i }) {
      let [a, o] = (0, scope.G.useState)({}), [c2, l] = (0, scope.G.useState)(), [d, f2] = (0, scope.G.useState)();
      async function p(e2) {
        let t2 = a[e2.id];
        if (t2 && !c2) {
          l(e2.id), f2(void 0);
          try {
            await r(e2.id, t2), o((t3) => {
              let n2 = { ...t3 };
              return delete n2[e2.id], n2;
            });
          } catch (e3) {
            f2(e3 instanceof Error ? e3.message : `恢复账号归属失败`);
          } finally {
            l(void 0);
          }
        }
      }
      return (0, scope.W.jsxs)(`section`, {
        className: `mb-4 overflow-hidden border-y border-amber-300 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/20`,
        children: [
          (0, scope.W.jsxs)(`div`, {
            className: (0, scope.R)(`flex items-start gap-3 px-4 py-3`, n && `px-3`),
            children: [
              (0, scope.W.jsx)(`span`, {
                className: `grid size-8 shrink-0 place-items-center rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300`,
                children: (0, scope.W.jsx)(scope.g, { className: `size-4` })
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `min-w-0 flex-1`,
                children: [
                  (0, scope.W.jsxs)(`div`, {
                    className: `flex flex-wrap items-center gap-x-2 gap-y-1`,
                    children: [
                      (0, scope.W.jsx)(`h2`, {
                        className: `text-sm font-semibold text-slate-900 dark:text-white`,
                        children: `待恢复账号`
                      }),
                      (0, scope.W.jsxs)(`span`, {
                        className: `text-[11px] font-medium text-amber-700 dark:text-amber-300`,
                        children: [e.length, ` 个`]
                      })
                    ]
                  }),
                  (0, scope.W.jsx)(`p`, {
                    className: `mt-0.5 text-[11px] leading-5 text-slate-600 dark:text-slate-300`,
                    children: `原站点记录已不存在；恢复会保留账号密码、代理和备注，并清除旧站 token、登录方式与会话。`
                  })
                ]
              }),
              t.length === 0 && (0, scope.W.jsxs)(`button`, {
                type: `button`,
                onClick: i,
                className: `inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-amber-600 px-2.5 text-[11px] font-semibold text-white hover:bg-amber-700`,
                children: [(0, scope.W.jsx)(scope.yt, { className: `size-3.5` }), `添加站点`]
              })
            ]
          }),
          (0, scope.W.jsx)(`div`, {
            className: `divide-y divide-amber-200/80 border-t border-amber-200/80 dark:divide-amber-900/70 dark:border-amber-900/70`,
            children: e.map((e2) => {
              let r2 = a[e2.id] ?? ``, i2 = c2 === e2.id;
              return (0, scope.W.jsxs)(
                `div`,
                {
                  className: (0, scope.R)(
                    `flex flex-wrap items-center gap-3 px-4 py-3`,
                    n && `px-3`
                  ),
                  children: [
                    (0, scope.W.jsxs)(`div`, {
                      className: `min-w-[180px] flex-1`,
                      children: [
                        (0, scope.W.jsx)(`p`, {
                          className: `truncate text-sm font-semibold text-slate-900 dark:text-white`,
                          title: e2.label || e2.username,
                          children: e2.label || e2.username
                        }),
                        e2.label && (0, scope.W.jsx)(`p`, {
                          className: `truncate text-[11px] text-slate-500`,
                          title: e2.username,
                          children: e2.username
                        }),
                        (0, scope.W.jsxs)(`p`, {
                          className: `mt-0.5 truncate font-mono text-[10px] text-slate-500`,
                          title: e2.siteId,
                          children: [`原站点 ID: `, e2.siteId]
                        })
                      ]
                    }),
                    t.length > 0 && (0, scope.W.jsxs)(`div`, {
                      className: `flex min-w-0 basis-full items-center gap-2 sm:basis-auto`,
                      children: [
                        (0, scope.W.jsxs)(`select`, {
                          value: r2,
                          disabled: i2,
                          onChange: (t2) => o((n2) => ({ ...n2, [e2.id]: t2.target.value })),
                          "aria-label": `选择 ${e2.label || e2.username} 的所属站点`,
                          className: `h-8 min-w-0 flex-1 rounded-md border border-amber-300 bg-white px-2 text-[11px] text-slate-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 disabled:opacity-50 dark:border-amber-900 dark:bg-slate-950 dark:text-slate-100 sm:w-48`,
                          children: [
                            (0, scope.W.jsx)(`option`, { value: ``, children: `选择所属站点` }),
                            t.map(
                              (e3) => (0, scope.W.jsx)(`option`, { value: e3.id, children: e3.name }, e3.id)
                            )
                          ]
                        }),
                        (0, scope.W.jsxs)(`button`, {
                          type: `button`,
                          disabled: !r2 || i2 || !!c2,
                          onClick: () => void p(e2),
                          className: `inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-slate-900 px-2.5 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100`,
                          children: [
                            i2 ? (0, scope.W.jsx)(scope.u, { className: `size-3.5 animate-spin` }) : (0, scope.W.jsx)(scope.s, { className: `size-3.5` }),
                            i2 ? `正在恢复` : `恢复归属`
                          ]
                        })
                      ]
                    })
                  ]
                },
                e2.id
              );
            })
          }),
          d && (0, scope.W.jsx)(`p`, {
            className: `border-t border-rose-200 bg-rose-50 px-4 py-2 text-[11px] text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300`,
            children: d
          })
        ]
      });
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.Pr = `builtin-chatai-codex`;
        break;
      }
      case 1: {
        scope.Ga = `auto`;
        break;
      }
      case 2: {
        scope.ns = `credentialPresets`;
        break;
      }
      case 3: {
        scope.ss = [
          { kind: `site`, title: `站点账号` },
          { kind: `github`, title: `GitHub 账号` }
        ];
        break;
      }
      case 4: {
        scope.fs = [
          { value: `inherit`, label: `跟随站点设置` },
          { value: `none`, label: `不使用代理（直连）` },
          { value: `pool`, label: `选择已保存的代理` },
          { value: `custom`, label: `为这个账号单独填地址` }
        ];
        break;
      }
      case 5: {
        scope.ps = `auto`;
        break;
      }
      case 6: {
        scope.Qs = `name-asc`;
        break;
      }
      case 7: {
        scope.ec = new Intl.Collator(`zh-CN`, { sensitivity: `base`, numeric: true });
        break;
      }
      case 8: {
        scope.Pl = `name-asc`;
        break;
      }
      case 9: {
        scope.Il = new Intl.Collator(`en`, { sensitivity: `base`, numeric: true });
        break;
      }
    }
  },
  storeProperties: {
    store_Li_addAccount(scope) {
      return {
        addAccount(e) {
          return (0, scope.X)(async () => {
            let [t, n] = await Promise.all([
              scope.z.get(scope.M.accounts, []),
              scope.z.get(scope.M.proxies, [])
            ]);
            if ((e.proxyMode ?? `inherit`) === `pool`) {
              if (!e.proxyId) throw Error(`账号选择了代理池，但没有指定真实出口`);
              (0, scope.Fi)(e.proxyId, (0, scope.Ni)(n));
            }
            await scope.z.set(scope.M.accounts, t.concat({ ...e, id: (0, scope.Ft)(`acc`) }));
          });
        }
      };
    },
    store_Li_addAccounts(scope) {
      return {
        addAccounts(e, t, n = false) {
          return (0, scope.X)(async () => {
            let [r, i] = await Promise.all([
              scope.z.get(scope.M.accounts, []),
              scope.z.get(scope.M.proxies, [])
            ]), a = (0, scope.Ni)(i), o = new Set(r.map((e2) => `${e2.siteId}\0${e2.username.trim().toLowerCase()}`)), s = [];
            for (let r2 of e) {
              let e2 = r2.username.trim(), i2 = `${r2.siteId}\0${e2.toLowerCase()}`;
              t.has(r2.siteId) && e2 && r2.password && (n || !o.has(i2)) && ((r2.proxyMode ?? `inherit`) !== `pool` || r2.proxyId && a.has(r2.proxyId)) && (o.add(i2), s.push({
                ...r2,
                username: e2,
                label: r2.label?.trim() || void 0,
                id: (0, scope.Ft)(`acc`)
              }));
            }
            return s.length && await scope.z.set(scope.M.accounts, r.concat(s)), { added: s.length, skipped: e.length - s.length };
          });
        }
      };
    },
    store_Li_updateAccount(scope) {
      return {
        updateAccount(e, t) {
          return (0, scope.X)(async () => {
            let [n, r, i, a] = await Promise.all([
              scope.z.get(scope.M.accounts, []),
              scope.z.get(scope.M.sites, []),
              scope.z.get(scope.M.removedBuiltinSiteIds, []),
              scope.z.get(scope.M.proxies, [])
            ]), o = n.find((t2) => t2.id === e);
            if (!o) throw Error(`账号不存在或已被删除`);
            let s = (0, scope.Ii)(o, t);
            if ((s.proxyMode ?? `inherit`) === `pool` && (s.proxyId !== o.proxyId || (o.proxyMode ?? `inherit`) !== `pool`)) {
              if (!s.proxyId) throw Error(`账号选择了代理池，但没有指定真实出口`);
              (0, scope.Fi)(s.proxyId, (0, scope.Ni)(a));
            }
            if (typeof t.siteId != `string` || t.siteId === o.siteId) {
              await scope.z.set(
                scope.M.accounts,
                n.map((n2) => n2.id === e ? (0, scope.Ii)(n2, t) : n2)
              );
              return;
            }
            let c2 = t.siteId.trim(), l = new Set(i);
            if (!(r.some((e2) => e2.id === c2) || scope.pn.some((e2) => e2.id === c2 && !l.has(e2.id))))
              throw Error(`目标站点不存在，请重新选择`);
            let u = o.username.trim().toLowerCase();
            if (n.some((t2) => t2.id !== e && t2.siteId === c2 && t2.username.trim().toLowerCase() === u))
              throw Error(`目标站点已有同名账号，不能重复归属`);
            let d = (0, scope.Ii)(o, { ...t, siteId: c2 });
            delete d.identity, delete d.loginMethod, delete d.loginEntry, delete d.apiToken, delete d.githubUsername, delete d.githubPassword, delete d.passkey;
            let f2 = n.map((t2) => t2.id === e ? d : t2), [p, m, h] = await Promise.all([
              scope.z.get(scope.M.status, {}),
              scope.z.get(scope.M.results, {}),
              scope.z.get(scope.M.balances, {})
            ]), g = `${e}:`;
            await scope.z.setMany({
              [scope.M.accounts]: f2,
              [scope.M.status]: Object.fromEntries(
                Object.entries(p).filter(([e2]) => !e2.startsWith(g))
              ),
              [scope.M.results]: Object.fromEntries(Object.entries(m).filter(([t2]) => t2 !== e)),
              [scope.M.balances]: Object.fromEntries(Object.entries(h).filter(([t2]) => t2 !== e))
            });
          });
        }
      };
    },
    store_Li_saveAccountSession(scope) {
      return {
        saveAccountSession(e, t) {
          return (0, scope.X)(async () => {
            let n = (await scope.z.get(scope.M.accounts, [])).map(
              (n2) => n2.id === e ? { ...n2, identity: { ...n2.identity, session: t } } : n2
            );
            await scope.z.set(scope.M.accounts, n);
          });
        }
      };
    },
    store_Li_saveAccountIdentity(scope) {
      return {
        saveAccountIdentity(e, t, n = {}) {
          return (0, scope.X)(async () => {
            let r = await scope.z.get(scope.M.accounts, []), i = r.find((t2) => t2.id === e);
            if (!i) return;
            let a = Object.fromEntries(Object.entries(t).filter(([, e2]) => e2 != null && e2 !== ``)), o = typeof a.userId == `string` ? a.userId : void 0, s = new Set(
              o ? r.filter(
                (t2) => t2.id !== e && t2.siteId === i.siteId && t2.identity?.userId === o
              ).map((e2) => e2.id) : []
            ), c2 = !!o && !!i.identity?.userId && i.identity.userId !== o;
            if (n.preserveBinding && (c2 || s.size > 0))
              throw Error(`身份绑定发生冲突，已保留原账号及其他账号的数据`);
            let l = a.verifiedByManagedLogin === true || i.identity?.verifiedByManagedLogin === true && (!o || o === i.identity.userId) && a.source === void 0, u = r.map(
              (t2) => t2.id === e ? {
                ...t2,
                identity: (() => {
                  let e2 = { ...t2.identity, ...a, fetchedAt: Date.now() };
                  return l ? e2.verifiedByManagedLogin = true : delete e2.verifiedByManagedLogin, e2;
                })()
              } : s.has(t2.id) ? {
                ...t2,
                identity: t2.identity?.session ? { session: t2.identity.session } : void 0
              } : t2
            );
            if (s.size === 0 && !c2) {
              await scope.z.set(scope.M.accounts, u);
              return;
            }
            let [d, f2, p] = await Promise.all([
              scope.z.get(scope.M.status, {}),
              scope.z.get(scope.M.results, {}),
              scope.z.get(scope.M.balances, {})
            ]), m = new Set(s);
            c2 && m.add(e);
            let h = [...s].map((e2) => `${e2}:`);
            await scope.z.setMany({
              [scope.M.accounts]: u,
              [scope.M.status]: Object.fromEntries(
                Object.entries(d).filter(([e2]) => !h.some((t2) => e2.startsWith(t2)))
              ),
              [scope.M.results]: Object.fromEntries(Object.entries(f2).filter(([e2]) => !m.has(e2))),
              [scope.M.balances]: Object.fromEntries(Object.entries(p).filter(([e2]) => !m.has(e2)))
            });
          });
        }
      };
    },
    store_Ui_addAccount(scope, e, t) {
      return {
        async addAccount(e2) {
          await (0, scope.Vi)({ action: `add-account`, input: e2 }), await t().load();
        }
      };
    },
    store_Ui_addAccounts(scope, e, t) {
      return {
        async addAccounts(e2, n = false) {
          if (e2.length === 0) return { added: 0, skipped: 0 };
          let r = await (0, scope.Vi)({ action: `add-accounts`, inputs: e2, preserveDuplicates: n }), i = { added: r.added ?? 0, skipped: r.skipped ?? e2.length };
          return i.added && await t().load(), i;
        }
      };
    },
    store_Ui_updateAccount(scope, e, t) {
      return {
        async updateAccount(e2, n) {
          await (0, scope.Vi)({ action: `update-account`, accountId: e2, patch: n }), await t().load();
        }
      };
    },
    store_Ui_removeAccount(scope, e, t) {
      return {
        async removeAccount(e2) {
          await t().removeMany([], [e2]);
        }
      };
    }
  }
});
function importAccountBatch(inputs, preserveDuplicates = false) {
  return appRuntime6.scope.Ui.getState().addAccounts(inputs, preserveDuplicates);
}
function useAccountBatch({
  open,
  siteId = "",
  accounts = [],
  onImport = importAccountBatch
}) {
  const React = appRuntime6.scope.G;
  const id = React.useId();
  const [text, updateText] = React.useState("");
  const [uniformPassword, updatePassword] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [result, setResult] = React.useState(null);
  const savingRef = React.useRef(false);
  const wasOpen = React.useRef(false);
  const previousSite = React.useRef(siteId);
  const preview = React.useMemo(
    () => parseAccountBatch(text, { siteId, uniformPassword, accounts }),
    [text, siteId, uniformPassword, accounts]
  );
  React.useEffect(() => {
    if (open && !wasOpen.current) reset();
    wasOpen.current = open;
  }, [open]);
  React.useEffect(() => {
    if (previousSite.current !== siteId) {
      setError("");
      setResult(null);
      previousSite.current = siteId;
    }
  }, [siteId]);
  function reset() {
    if (savingRef.current) return;
    updateText("");
    updatePassword("");
    setError("");
    setResult(null);
  }
  function setText(value) {
    if (savingRef.current) return;
    updateText(value);
    setError("");
    setResult(null);
  }
  function setUniformPassword(value) {
    if (savingRef.current) return;
    updatePassword(value);
    setError("");
    setResult(null);
  }
  async function save(event) {
    event?.preventDefault();
    if (savingRef.current || preview.inputs.length === 0) return;
    savingRef.current = true;
    setSaving(true);
    setError("");
    try {
      const saved = await onImport(
        preview.inputs.map((input) => ({ ...input, loginMethod: "auto" }))
      );
      if (!saved || !Number.isInteger(saved.added) || !Number.isInteger(saved.skipped) || saved.added < 0 || saved.skipped < 0) {
        setError("保存结果尚未确认，请刷新账号列表查看。");
        return;
      }
      setResult({ added: saved.added, skipped: preview.counts.skipped + saved.skipped });
      updateText("");
      updatePassword("");
    } catch {
      setError("批量保存失败，请稍后重试。");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }
  return {
    id,
    text,
    setText,
    uniformPassword,
    setUniformPassword,
    preview,
    saving,
    savingRef,
    error,
    result,
    save,
    reset
  };
}
function AccountAddModes({ mode, disabled, onChange }) {
  const h = appRuntime6.scope.G.createElement;
  const modes = [
    { value: "single", label: "单个添加" },
    { value: "batch", label: "批量添加" }
  ];
  return h(
    "div",
    { className: "aah-account-modes", role: "radiogroup", "aria-label": "账号添加方式" },
    modes.map(
      ({ value, label }) => h(
        "button",
        {
          key: value,
          type: "button",
          role: "radio",
          "aria-checked": mode === value,
          tabIndex: mode === value ? 0 : -1,
          disabled,
          onClick: () => onChange(value),
          onKeyDown: (event) => {
            if (!disabled && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              const next = event.key === "Home" ? "single" : event.key === "End" ? "batch" : mode === "single" ? "batch" : "single";
              onChange(next);
              event.currentTarget.parentElement.querySelectorAll("button")[next === "single" ? 0 : 1].focus();
            }
          }
        },
        label
      )
    )
  );
}
function AccountBatchContent({ batch }) {
  const React = appRuntime6.scope.G;
  const h = React.createElement;
  const content = React.useRef(null);
  React.useEffect(() => {
    const target = content.current;
    const scrollArea = target?.closest(".aah-modal-content");
    if (scrollArea) scrollArea.scrollTop = 0;
    (target?.querySelector("textarea") ?? target)?.focus();
  }, [batch.result]);
  if (batch.result) {
    return h(
      "section",
      {
        className: "aah-batch-success",
        role: "status",
        "aria-live": "polite",
        ref: content,
        tabIndex: -1
      },
      h("span", { className: "aah-batch-success-mark", "aria-hidden": true }, "✓"),
      h("h4", null, `已添加 ${batch.result.added} 个账号`),
      h(
        "p",
        null,
        batch.result.skipped ? `另有 ${batch.result.skipped} 行已跳过，账号列表已更新。` : "账号列表已更新，可以开始签到。"
      )
    );
  }
  const labels = { valid: "可添加", invalid: "无效", duplicate: "重复", existing: "已存在" };
  return h(
    "form",
    {
      id: batch.id,
      className: "aah-account-batch",
      onSubmit: batch.save,
      ref: content,
      "aria-busy": batch.saving
    },
    h(
      "div",
      { className: "aah-batch-field" },
      h("label", { htmlFor: `${batch.id}-text` }, "账号列表"),
      h("textarea", {
        id: `${batch.id}-text`,
        className: "aah-account-input aah-batch-textarea",
        rows: 4,
        value: batch.text,
        disabled: batch.saving,
        spellCheck: false,
        autoComplete: "off",
        placeholder: "账号,密码,备注（可选）\nalice,password1,主账号\nbob,password2,备用账号",
        onChange: (event) => batch.setText(event.target.value),
        onKeyDown: (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            batch.save();
          }
        }
      }),
      h(
        "details",
        { className: "aah-batch-format" },
        h("summary", null, "填写格式"),
        h(
          "p",
          null,
          "每行一个账号，用逗号或 Tab 分隔账号、密码、备注。支持从表格直接粘贴和带双引号的 CSV。"
        ),
        h(
          "p",
          null,
          "使用统一密码时，每行可以只填账号；需要备注时写成“账号,,备注”。每行已有密码优先使用。"
        )
      )
    ),
    h(
      "div",
      { className: "aah-batch-field" },
      h("label", { htmlFor: `${batch.id}-password` }, "统一密码", h("span", null, "可选")),
      h("input", {
        id: `${batch.id}-password`,
        type: "password",
        autoComplete: "new-password",
        className: "aah-account-input",
        value: batch.uniformPassword,
        disabled: batch.saving,
        placeholder: "用于列表中没有填写密码的账号",
        onChange: (event) => batch.setUniformPassword(event.target.value)
      })
    ),
    h(
      "p",
      { className: "aah-batch-context" },
      "仅导入站内账号密码 · GitHub 账号请使用单个添加 · 代理跟随站点设置"
    ),
    batch.preview.rows.length > 0 && h(
      "section",
      { className: "aah-batch-review" },
      h(
        "div",
        { className: "aah-batch-review-heading", "aria-live": "polite" },
        h("h4", null, "添加预览"),
        h(
          "p",
          null,
          h("strong", null, `可添加 ${batch.preview.counts.valid}`),
          ` · 跳过 ${batch.preview.counts.skipped}`
        )
      ),
      h(
        "ol",
        { className: "aah-batch-preview", "aria-label": "账号解析预览" },
        batch.preview.rows.slice(0, 100).map(
          (row) => h(
            "li",
            { key: row.line, className: `aah-batch-row aah-batch-row-${row.status}` },
            h(
              "div",
              { className: "aah-batch-row-heading" },
              h("span", { className: "aah-batch-line" }, row.line),
              h("strong", { className: "aah-batch-username" }, row.username || "未填写账号"),
              h("span", { className: "aah-batch-row-status" }, labels[row.status])
            ),
            h(
              "p",
              { className: "aah-batch-row-detail" },
              row.label ? `${row.label} · ` : "",
              row.passwordSource === "missing" ? "未填写密码" : row.passwordSource === "uniform" ? "使用统一密码" : "密码已填写"
            ),
            row.status !== "valid" && h("p", { className: "aah-batch-row-reason" }, row.message)
          )
        )
      ),
      batch.preview.rows.length > 100 && h("p", { className: "aah-batch-context" }, "预览前 100 行，保存全部有效账号。")
    ),
    batch.error && h("p", { className: "aah-batch-error", role: "alert" }, batch.error)
  );
}
function AccountBatchFooter({ batch, onClose }) {
  const h = appRuntime6.scope.G.createElement;
  return h(
    "div",
    { className: "aah-account-actions" },
    h(
      "button",
      {
        type: "button",
        className: "aah-account-secondary",
        disabled: batch.saving,
        onClick: () => {
          if (!batch.savingRef.current) batch.result ? batch.reset() : onClose();
        }
      },
      batch.result ? "继续添加" : "取消"
    ),
    h(
      "button",
      {
        type: batch.result ? "button" : "submit",
        form: batch.result ? void 0 : batch.id,
        className: "aah-account-primary",
        disabled: batch.saving || !batch.result && batch.preview.inputs.length === 0,
        onClick: batch.result ? onClose : void 0
      },
      batch.result ? "完成" : batch.saving ? "保存中…" : batch.preview.counts.valid ? `添加 ${batch.preview.counts.valid} 个账号` : "添加账号"
    )
  );
}

// src/shared/ui-components.js
var uiExport_A;
var uiExport_C;
var uiExport_D;
var uiExport_E;
var uiExport_M;
var uiExport_N;
var uiExport_O;
var uiExport_P;
var uiExport_S;
var uiExport_T;
var uiExport__;
var uiExport_a;
var uiExport_b;
var uiExport_c;
var uiExport_d;
var uiExport_f;
var uiExport_g;
var uiExport_h;
var uiExport_i;
var uiExport_j;
var uiExport_k;
var uiExport_l;
var uiExport_m;
var uiExport_n;
var uiExport_o;
var uiExport_p;
var uiExport_r;
var uiExport_s;
var uiExport_t;
var uiExport_u;
var uiExport_v;
var uiExport_w;
var uiExport_x;
var uiExport_y;
var sharedUiModules = {
  "shared": sharedUiRuntime,
  "motion": sharedUiRuntime2,
  "sites": sharedUiRuntime3,
  "records": sharedUiRuntime4,
  "proxies": sharedUiRuntime5,
  "accounts": sharedUiRuntime6
};
var sharedUiScope = createUiScope(
  sharedUiModules,
  {
    get e() {
      return f;
    },
    get t() {
      return _e;
    },
    get n() {
      return C;
    },
    get r() {
      return de;
    },
    get i() {
      return v;
    },
    get a() {
      return ye;
    },
    get o() {
      return pe;
    },
    get s() {
      return De;
    },
    get c() {
      return Xe;
    },
    get l() {
      return Ce;
    },
    get u() {
      return We;
    },
    get d() {
      return Re;
    },
    get f() {
      return Ie;
    },
    get p() {
      return ke;
    },
    get m() {
      return je;
    },
    get h() {
      return Qe;
    },
    get g() {
      return c;
    },
    get _() {
      return He;
    },
    get v() {
      return Me;
    },
    get y() {
      return nt;
    },
    get b() {
      return Je;
    },
    get x() {
      return Pe;
    },
    get S() {
      return et;
    },
    get C() {
      return Ke;
    },
    get w() {
      return it;
    },
    get T() {
      return Be;
    },
    get E() {
      return w;
    },
    get ee() {
      return he;
    },
    get D() {
      return xe;
    },
    get te() {
      return Te;
    }
  },
  {
    "Eo": (value) => {
      uiExport_A = value;
    },
    "Ju": (value) => {
      uiExport_C = value;
    },
    "Mu": (value) => {
      uiExport_D = value;
    },
    "Bu": (value) => {
      uiExport_E = value;
    },
    "Co": (value) => {
      uiExport_M = value;
    },
    "oi": (value) => {
      uiExport_N = value;
    },
    "Bc": (value) => {
      uiExport_O = value;
    },
    "j": (value) => {
      uiExport_P = value;
    },
    "Qu": (value) => {
      uiExport_S = value;
    },
    "Hu": (value) => {
      uiExport_T = value;
    },
    "ud": (value) => {
      uiExport__ = value;
    },
    "ap": (value) => {
      uiExport_a = value;
    },
    "nd": (value) => {
      uiExport_b = value;
    },
    "wd": (value) => {
      uiExport_c = value;
    },
    "bd": (value) => {
      uiExport_d = value;
    },
    "yd": (value) => {
      uiExport_f = value;
    },
    "_d": (value) => {
      uiExport_g = value;
    },
    "gd": (value) => {
      uiExport_h = value;
    },
    "Em": (value) => {
      uiExport_i = value;
    },
    "wo": (value) => {
      uiExport_j = value;
    },
    "kc": (value) => {
      uiExport_k = value;
    },
    "Td": (value) => {
      uiExport_l = value;
    },
    "hd": (value) => {
      uiExport_m = value;
    },
    "Nm": (value) => {
      uiExport_n = value;
    },
    "ip": (value) => {
      uiExport_o = value;
    },
    "vd": (value) => {
      uiExport_p = value;
    },
    "Om": (value) => {
      uiExport_r = value;
    },
    "$": (value) => {
      uiExport_s = value;
    },
    "Mm": (value) => {
      uiExport_t = value;
    },
    "Cd": (value) => {
      uiExport_u = value;
    },
    "ld": (value) => {
      uiExport_v = value;
    },
    "Wu": (value) => {
      uiExport_w = value;
    },
    "td": (value) => {
      uiExport_x = value;
    },
    "cd": (value) => {
      uiExport_y = value;
    }
  }
);
initializeUiScope(sharedUiScope, sharedUiModules, [
  ["shared", 0],
  ["shared", 1],
  ["motion", 0],
  ["motion", 1],
  ["motion", 2],
  ["motion", 3],
  ["motion", 4],
  ["motion", 5],
  ["motion", 6],
  ["motion", 7],
  ["motion", 8],
  ["motion", 9],
  ["motion", 10],
  ["motion", 11],
  ["motion", 12],
  ["motion", 13],
  ["motion", 14],
  ["motion", 15],
  ["motion", 16],
  ["motion", 17],
  ["motion", 18],
  ["motion", 19],
  ["motion", 20],
  ["motion", 21],
  ["motion", 22],
  ["motion", 23],
  ["motion", 24],
  ["motion", 25],
  ["motion", 26],
  ["motion", 27],
  ["motion", 28],
  ["motion", 29],
  ["motion", 30],
  ["motion", 31],
  ["motion", 32],
  ["motion", 33],
  ["motion", 34],
  ["motion", 35],
  ["motion", 36],
  ["motion", 37],
  ["motion", 38],
  ["motion", 39],
  ["motion", 40],
  ["motion", 41],
  ["motion", 42],
  ["motion", 43],
  ["motion", 44],
  ["motion", 45],
  ["motion", 46],
  ["motion", 47],
  ["motion", 48],
  ["motion", 49],
  ["motion", 50],
  ["motion", 51],
  ["motion", 52],
  ["motion", 53],
  ["motion", 54],
  ["motion", 55],
  ["motion", 56],
  ["motion", 57],
  ["motion", 58],
  ["motion", 59],
  ["motion", 60],
  ["motion", 61],
  ["motion", 62],
  ["motion", 63],
  ["motion", 64],
  ["motion", 65],
  ["motion", 66],
  ["motion", 67],
  ["motion", 68],
  ["motion", 69],
  ["motion", 70],
  ["motion", 71],
  ["motion", 72],
  ["motion", 73],
  ["motion", 74],
  ["motion", 75],
  ["motion", 76],
  ["motion", 77],
  ["motion", 78],
  ["motion", 79],
  ["motion", 80],
  ["motion", 81],
  ["motion", 82],
  ["motion", 83],
  ["motion", 84],
  ["motion", 85],
  ["motion", 86],
  ["motion", 87],
  ["motion", 88],
  ["motion", 89],
  ["motion", 90],
  ["motion", 91],
  ["motion", 92],
  ["motion", 93],
  ["motion", 94],
  ["motion", 95],
  ["motion", 96],
  ["motion", 97],
  ["motion", 98],
  ["motion", 99],
  ["motion", 100],
  ["motion", 101],
  ["motion", 102],
  ["motion", 103],
  ["motion", 104],
  ["motion", 105],
  ["motion", 106],
  ["motion", 107],
  ["motion", 108],
  ["motion", 109],
  ["motion", 110],
  ["motion", 111],
  ["motion", 112],
  ["motion", 113],
  ["motion", 114],
  ["motion", 115],
  ["motion", 116],
  ["motion", 117],
  ["motion", 118],
  ["motion", 119],
  ["motion", 120],
  ["motion", 121],
  ["motion", 122],
  ["motion", 123],
  ["motion", 124],
  ["motion", 125],
  ["motion", 126],
  ["motion", 127],
  ["motion", 128],
  ["motion", 129],
  ["motion", 130],
  ["motion", 131],
  ["motion", 132],
  ["motion", 133],
  ["motion", 134],
  ["motion", 135],
  ["motion", 136],
  ["motion", 137],
  ["motion", 138],
  ["motion", 139],
  ["motion", 140],
  ["motion", 141],
  ["motion", 142],
  ["motion", 143],
  ["motion", 144],
  ["motion", 145],
  ["motion", 146],
  ["motion", 147],
  ["motion", 148],
  ["motion", 149],
  ["motion", 150],
  ["motion", 151],
  ["motion", 152],
  ["motion", 153],
  ["motion", 154],
  ["motion", 155],
  ["motion", 156],
  ["motion", 157],
  ["motion", 158],
  ["motion", 159],
  ["motion", 160],
  ["motion", 161],
  ["motion", 162],
  ["motion", 163],
  ["motion", 164],
  ["motion", 165],
  ["motion", 166],
  ["motion", 167],
  ["motion", 168],
  ["motion", 169],
  ["motion", 170],
  ["motion", 171],
  ["motion", 172],
  ["motion", 173],
  ["motion", 174],
  ["motion", 175],
  ["motion", 176],
  ["motion", 177],
  ["motion", 178],
  ["motion", 179],
  ["motion", 180],
  ["motion", 181],
  ["motion", 182],
  ["motion", 183],
  ["motion", 184],
  ["motion", 185],
  ["motion", 186],
  ["motion", 187],
  ["motion", 188],
  ["motion", 189],
  ["motion", 190],
  ["motion", 191],
  ["motion", 192],
  ["motion", 193],
  ["motion", 194],
  ["motion", 195],
  ["motion", 196],
  ["motion", 197],
  ["motion", 198],
  ["motion", 199],
  ["motion", 200],
  ["motion", 201],
  ["motion", 202],
  ["motion", 203],
  ["motion", 204],
  ["motion", 205],
  ["motion", 206],
  ["motion", 207],
  ["motion", 208],
  ["motion", 209],
  ["motion", 210],
  ["motion", 211],
  ["motion", 212],
  ["motion", 213],
  ["motion", 214],
  ["motion", 215],
  ["motion", 216],
  ["motion", 217],
  ["motion", 218],
  ["motion", 219],
  ["motion", 220],
  ["motion", 221],
  ["motion", 222],
  ["motion", 223],
  ["motion", 224],
  ["motion", 225],
  ["motion", 226],
  ["motion", 227],
  ["motion", 228],
  ["motion", 229],
  ["motion", 230],
  ["motion", 231],
  ["motion", 232],
  ["motion", 233],
  ["motion", 234],
  ["motion", 235],
  ["motion", 236],
  ["motion", 237],
  ["motion", 238],
  ["motion", 239],
  ["motion", 240],
  ["motion", 241],
  ["motion", 242],
  ["motion", 243],
  ["motion", 244],
  ["motion", 245],
  ["motion", 246],
  ["motion", 247],
  ["motion", 248],
  ["motion", 249],
  ["motion", 250],
  ["motion", 251],
  ["motion", 252],
  ["motion", 253],
  ["motion", 254],
  ["motion", 255],
  ["motion", 256],
  ["motion", 257],
  ["motion", 258],
  ["motion", 259],
  ["motion", 260],
  ["motion", 261],
  ["motion", 262],
  ["motion", 263],
  ["motion", 264],
  ["motion", 265],
  ["motion", 266],
  ["motion", 267],
  ["motion", 268],
  ["motion", 269],
  ["motion", 270],
  ["motion", 271],
  ["motion", 272],
  ["motion", 273],
  ["motion", 274],
  ["motion", 275],
  ["motion", 276],
  ["motion", 277],
  ["motion", 278],
  ["motion", 279],
  ["motion", 280],
  ["motion", 281],
  ["motion", 282],
  ["motion", 283],
  ["motion", 284],
  ["motion", 285],
  ["motion", 286],
  ["motion", 287],
  ["motion", 288],
  ["motion", 289],
  ["motion", 290],
  ["motion", 291],
  ["motion", 292],
  ["motion", 293],
  ["motion", 294],
  ["motion", 295],
  ["motion", 296],
  ["motion", 297],
  ["motion", 298],
  ["motion", 299],
  ["motion", 300],
  ["motion", 301],
  ["motion", 302],
  ["motion", 303],
  ["motion", 304],
  ["motion", 305],
  ["motion", 306],
  ["motion", 307],
  ["motion", 308],
  ["motion", 309],
  ["motion", 310],
  ["motion", 311],
  ["motion", 312],
  ["motion", 313],
  ["motion", 314],
  ["motion", 315],
  ["motion", 316],
  ["motion", 317],
  ["motion", 318],
  ["motion", 319],
  ["motion", 320],
  ["motion", 321],
  ["motion", 322],
  ["motion", 323],
  ["motion", 324],
  ["motion", 325],
  ["motion", 326],
  ["motion", 327],
  ["sites", 0],
  ["sites", 1],
  ["shared", 2],
  ["shared", 3],
  ["shared", 4],
  ["shared", 5],
  ["shared", 6],
  ["shared", 7],
  ["motion", 328],
  ["motion", 329],
  ["motion", 330],
  ["motion", 331],
  ["motion", 332],
  ["motion", 333],
  ["motion", 334],
  ["motion", 335],
  ["motion", 336],
  ["motion", 337],
  ["motion", 338],
  ["motion", 339],
  ["motion", 340],
  ["motion", 341],
  ["motion", 342],
  ["motion", 343],
  ["motion", 344],
  ["motion", 345],
  ["motion", 346],
  ["motion", 347],
  ["motion", 348],
  ["motion", 349],
  ["motion", 350],
  ["motion", 351],
  ["motion", 352],
  ["motion", 353],
  ["motion", 354],
  ["motion", 355],
  ["motion", 356],
  ["motion", 357],
  ["motion", 358],
  ["motion", 359],
  ["motion", 360],
  ["motion", 361],
  ["motion", 362],
  ["motion", 363],
  ["motion", 364],
  ["motion", 365],
  ["motion", 366],
  ["motion", 367],
  ["motion", 368],
  ["motion", 369],
  ["motion", 370],
  ["motion", 371],
  ["motion", 372],
  ["motion", 373],
  ["motion", 374],
  ["motion", 375],
  ["motion", 376],
  ["motion", 377],
  ["motion", 378],
  ["motion", 379],
  ["motion", 380],
  ["motion", 381],
  ["motion", 382],
  ["motion", 383],
  ["motion", 384],
  ["motion", 385],
  ["motion", 386],
  ["motion", 387],
  ["motion", 388],
  ["motion", 389],
  ["motion", 390],
  ["motion", 391],
  ["motion", 392],
  ["motion", 393],
  ["motion", 394],
  ["motion", 395],
  ["motion", 396],
  ["motion", 397],
  ["motion", 398],
  ["motion", 399],
  ["motion", 400],
  ["motion", 401],
  ["motion", 402],
  ["motion", 403],
  ["motion", 404],
  ["motion", 405],
  ["motion", 406],
  ["motion", 407],
  ["motion", 408],
  ["motion", 409],
  ["motion", 410],
  ["proxies", 0],
  ["proxies", 1],
  ["proxies", 2],
  ["proxies", 3],
  ["proxies", 4],
  ["proxies", 5],
  ["proxies", 6],
  ["proxies", 7],
  ["proxies", 8],
  ["proxies", 9],
  ["proxies", 10],
  ["proxies", 11],
  ["proxies", 12],
  ["proxies", 13],
  ["proxies", 14],
  ["proxies", 15],
  ["proxies", 16],
  ["proxies", 17],
  ["proxies", 18],
  ["proxies", 19],
  ["proxies", 20],
  ["shared", 8],
  ["shared", 9],
  ["shared", 10]
]);

export {
  createUiModuleRuntime,
  createUiScope,
  initializeUiScope,
  appRuntime,
  appRuntime2,
  appRuntime3,
  appRuntime4,
  appRuntime5,
  appRuntime6,
  uiExport_A,
  uiExport_C,
  uiExport_D,
  uiExport_E,
  uiExport_M,
  uiExport_N,
  uiExport_O,
  uiExport_P,
  uiExport_S,
  uiExport_T,
  uiExport__,
  uiExport_b,
  uiExport_c,
  uiExport_d,
  uiExport_f,
  uiExport_g,
  uiExport_h,
  uiExport_i,
  uiExport_j,
  uiExport_k,
  uiExport_l,
  uiExport_m,
  uiExport_n,
  uiExport_o,
  uiExport_p,
  uiExport_r,
  uiExport_s,
  uiExport_t,
  uiExport_u,
  uiExport_v,
  uiExport_w,
  uiExport_x,
  uiExport_y
};
