/** src/shared/ui-runtime.js: 功能模块实现，保留发布版本的符号以便逐步恢复命名。 */
import { createUiModuleRuntime, createUiScope, initializeUiScope } from './ui-scope.js';

const openModalPanels = new Set();
let modalBodyOverflow = '';
function topModalPanel() {
  return [...document.querySelectorAll('.aah-modal-panel')]
    .filter((panel) => openModalPanels.has(panel))
    .at(-1);
}

// React 运行引用、消息适配和公共界面 — sharedUi published scope.

export const sharedUiRuntime = createUiModuleRuntime({
  bindingNames: [
    'O',
    'k',
    'rd',
    'id',
    'ad',
    'od',
    'sd',
    'cd',
    'ld',
    'ud',
    'Dm',
    'Om',
    'km',
    'Am',
    'jm',
  ],

  register(scope) {
    scope.sd = function sd(e) {
      if (e.type === `SLIDER_FRAME_PREPARE`) return 8e3;
      if (
        e.type === `SLIDER_FRAME_CONNECT` ||
        e.type === `SLIDER_FRAME_REPORT` ||
        e.type === `SLIDER_FRAME_STATUS` ||
        e.type === `SLIDER_FRAME_CANCEL`
      )
        return 4e3;
      if (e.type === `SCAN_LOCAL_PORTS`) {
        let t = e.withExit === !0 ? scope.ad : scope.id;
        return e.ports.length * t + scope.od;
      }
      return e.type === `TEST_PROXY` ? 34e3 : scope.rd;
    };
    scope.cd = function cd(e) {
      return new Promise((t) => {
        let n = (0, scope.sd)(e),
          r = !1,
          i = (e) => {
            r || ((r = !0), clearTimeout(a), t(e));
          },
          a = setTimeout(() => {
            i({
              ok: !1,
              error: `后台在 ${Math.round(n / 1e3)} 秒内没有响应 ${e.type}（Service Worker 可能已被回收）`,
            });
          }, n);
        try {
          chrome.runtime.sendMessage(e, (e) => {
            chrome.runtime.lastError
              ? i({ ok: !1, error: chrome.runtime.lastError.message ?? `unknown` })
              : i(e ?? { ok: !0 });
          });
        } catch (e) {
          i({ ok: !1, error: e instanceof Error ? e.message : String(e) });
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
      shellVisible: s = !0,
    }) {
      if (!s) return (0, scope.O.jsx)(scope.O.Fragment, { children: o });
      let c = e === `settings` ? `设置` : (scope.Dm.find((t) => t.id === e)?.label ?? `总览`);
      return (0, scope.O.jsxs)(`div`, {
        className: `flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50`,
        children: [
          (0, scope.O.jsx)(`a`, {
            href: `#main-content`,
            className: `fixed left-1/2 top-2 z-[70] -translate-x-1/2 -translate-y-[180%] rounded-lg bg-ink-900 px-3.5 py-2 text-xs font-semibold text-white shadow-lg transition-transform focus-visible:translate-y-0 dark:bg-white dark:text-ink-900`,
            children: `跳到主要内容`,
          }),
          (0, scope.O.jsxs)(`aside`, {
            'aria-label': `侧边导航`,
            className: `sticky top-0 z-20 flex h-screen w-[68px] shrink-0 flex-col border-r border-slate-200 bg-white px-2 py-4 lg:w-[228px] lg:px-3 dark:border-slate-800 dark:bg-slate-950`,
            children: [
              (0, scope.O.jsxs)(`div`, {
                className: `mb-5 flex items-center gap-2.5 px-1 lg:px-2`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `grid size-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-600/25`,
                    'aria-hidden': `true`,
                    children: (0, scope.O.jsx)(scope.w, { className: `size-4`, strokeWidth: 2.5 }),
                  }),
                  (0, scope.O.jsxs)(`span`, {
                    className: `hidden min-w-0 lg:block`,
                    children: [
                      (0, scope.O.jsx)(`strong`, {
                        className: `block truncate text-sm font-bold tracking-tight`,
                        children: `签到管理台`,
                      }),
                      (0, scope.O.jsx)(`span`, {
                        className: `block truncate text-[10px] text-ink-800/50 dark:text-ink-100/45`,
                        children: `Nightly workspace`,
                      }),
                    ],
                  }),
                ],
              }),
              (0, scope.O.jsx)(`p`, {
                className: `mb-2 hidden px-2 text-[10px] font-semibold uppercase tracking-wider text-ink-800/35 lg:block dark:text-ink-100/30`,
                children: `工作台`,
              }),
              (0, scope.O.jsx)(`nav`, {
                className: `flex flex-col gap-1`,
                'aria-label': `主导航`,
                children: scope.Dm.map(({ id: n, label: r, icon: i }) => {
                  let o = e === n;
                  return (0, scope.O.jsxs)(
                    `button`,
                    {
                      type: `button`,
                      'aria-current': o ? `page` : void 0,
                      'aria-label': r,
                      title: r,
                      onClick: () => t(n),
                      className: (0, scope.$)(
                        `relative flex h-9 w-full items-center justify-center gap-2.5 rounded-lg text-xs font-medium transition-colors lg:justify-start lg:px-2.5`,
                        o
                          ? `bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`
                          : `text-ink-800/60 hover:bg-slate-100 hover:text-ink-900 dark:text-ink-100/55 dark:hover:bg-slate-900 dark:hover:text-ink-50`,
                      ),
                      children: [
                        o &&
                          (0, scope.O.jsx)(`span`, {
                            'aria-hidden': `true`,
                            className: `absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r bg-blue-600`,
                          }),
                        (0, scope.O.jsx)(i, { className: `size-4 shrink-0` }),
                        (0, scope.O.jsx)(`span`, {
                          className: `hidden truncate lg:block`,
                          children: r,
                        }),
                        n === `records` &&
                          a.done > 0 &&
                          (0, scope.O.jsx)(`em`, {
                            className: `ml-auto hidden rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold not-italic text-ink-800/55 lg:block dark:bg-slate-800 dark:text-ink-100/50`,
                            children: a.done,
                          }),
                      ],
                    },
                    n,
                  );
                }),
              }),
              (0, scope.O.jsx)(`div`, { className: `flex-1` }),
              (0, scope.O.jsx)(`nav`, {
                className: `mt-4 flex flex-col gap-1`,
                'aria-label': `系统导航`,
                children: (0, scope.O.jsxs)(`button`, {
                  type: `button`,
                  'aria-current': e === `settings` ? `page` : void 0,
                  'aria-label': `设置`,
                  title: `设置`,
                  onClick: () => t(`settings`),
                  className: (0, scope.$)(
                    `flex h-9 w-full items-center justify-center gap-2.5 rounded-lg text-xs font-medium transition-colors lg:justify-start lg:px-2.5`,
                    e === `settings`
                      ? `bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`
                      : `text-ink-800/60 hover:bg-slate-100 hover:text-ink-900 dark:text-ink-100/55 dark:hover:bg-slate-900`,
                  ),
                  children: [
                    (0, scope.O.jsx)(scope.T, { className: `size-4 shrink-0` }),
                    (0, scope.O.jsx)(`span`, {
                      className: `hidden truncate lg:block`,
                      children: `设置`,
                    }),
                  ],
                }),
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `mt-3 flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-2 py-2 text-[10px] text-ink-800/50 lg:justify-start dark:border-slate-800 dark:text-ink-100/45`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    'aria-hidden': `true`,
                    className: `size-1.5 shrink-0 rounded-full bg-mint-500`,
                  }),
                  (0, scope.O.jsx)(`span`, {
                    className: `hidden truncate lg:block`,
                    children: `后台服务正常`,
                  }),
                  (0, scope.O.jsxs)(`span`, {
                    className: `ml-auto hidden shrink-0 lg:block`,
                    children: [`v`, a.version],
                  }),
                ],
              }),
            ],
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `flex min-w-0 flex-1 flex-col`,
            children: [
              (0, scope.O.jsxs)(`header`, {
                className: `sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur lg:px-6 dark:border-slate-800 dark:bg-slate-950/85`,
                children: [
                  (0, scope.O.jsxs)(`nav`, {
                    'aria-label': `面包屑`,
                    className: `flex items-center gap-2 text-[11px] text-ink-800/45 dark:text-ink-100/40`,
                    children: [
                      (0, scope.O.jsx)(`span`, { children: `工作台` }),
                      (0, scope.O.jsx)(`span`, { 'aria-hidden': `true`, children: `/` }),
                      (0, scope.O.jsx)(`strong`, {
                        className: `font-semibold text-ink-900 dark:text-ink-50`,
                        children: c,
                      }),
                    ],
                  }),
                  (0, scope.O.jsxs)(`label`, {
                    className: `relative order-last w-full min-w-0 flex-1 lg:order-none lg:ml-auto lg:w-auto lg:max-w-sm lg:flex-none`,
                    children: [
                      (0, scope.O.jsx)(scope.d, {
                        'aria-hidden': `true`,
                        className: `pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-800/35 dark:text-ink-100/35`,
                      }),
                      (0, scope.O.jsx)(`input`, {
                        value: n,
                        onChange: (e) => i(e.target.value),
                        placeholder: `搜索站点、账号或备注`,
                        'aria-label': `搜索站点、账号或备注`,
                        className: `h-9 w-full rounded-lg border border-black/8 bg-slate-50 pr-16 pl-8 text-[11px] text-ink-900 outline-none placeholder:text-ink-800/35 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 dark:border-white/10 dark:bg-slate-900 dark:text-ink-50`,
                      }),
                      (0, scope.O.jsxs)(`kbd`, {
                        className: `pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] text-ink-800/45 dark:border-slate-700 dark:bg-slate-800 dark:text-ink-100/40`,
                        children: [(0, scope.O.jsx)(scope.D, { className: `size-2.5` }), `K`],
                      }),
                    ],
                  }),
                  (0, scope.O.jsxs)(`div`, {
                    className: `ml-auto flex items-center gap-1.5 lg:ml-0`,
                    children: [
                      a.running > 0 &&
                        (0, scope.O.jsxs)(`span`, {
                          className: `inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`,
                          children: [
                            (0, scope.O.jsx)(scope.Ju, {
                              className: `size-2.5`,
                              'aria-hidden': `true`,
                            }),
                            `执行中 `,
                            a.running,
                          ],
                        }),
                      a.attention > 0 &&
                        (0, scope.O.jsxs)(`span`, {
                          className: `inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300`,
                          children: [
                            (0, scope.O.jsx)(scope._, {
                              className: `size-2.5`,
                              'aria-hidden': `true`,
                            }),
                            `需处理 `,
                            a.attention,
                          ],
                        }),
                      (0, scope.O.jsxs)(`span`, {
                        className: `hidden items-center gap-1 rounded-full bg-mint-50 px-2 py-1 text-[10px] font-bold text-mint-700 sm:inline-flex dark:bg-mint-600/15 dark:text-mint-300`,
                        children: [
                          (0, scope.O.jsx)(scope.r, {
                            className: `size-2.5`,
                            'aria-hidden': `true`,
                          }),
                          a.done,
                          `/`,
                          a.total,
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, scope.O.jsx)(`main`, {
                id: `main-content`,
                tabIndex: -1,
                className: `min-w-0 flex-1 px-4 py-5 outline-none lg:px-6`,
                children: o,
              }),
            ],
          }),
        ],
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
                coral: `bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300`,
              }[r],
            ),
            children: (0, scope.O.jsx)(i, { className: `size-4` }),
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `min-w-0`,
            children: [
              (0, scope.O.jsx)(`span`, {
                className: `block text-[10px] text-ink-800/55 dark:text-ink-100/50`,
                children: e,
              }),
              (0, scope.O.jsx)(`strong`, {
                className: `mt-0.5 block text-xl font-semibold leading-none tracking-tight text-ink-900 tabular-nums dark:text-ink-50`,
                children: t,
              }),
              (0, scope.O.jsx)(`small`, {
                className: `mt-1 block text-[10px] text-ink-800/50 dark:text-ink-100/45`,
                children: n,
              }),
            ],
          }),
        ],
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
          },
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
          subscriptionSource: `subscriptionSource`,
        };
        break;
      }
      case 8: {
        scope.Dm = [
          { id: `overview`, label: `总览`, icon: scope.E },
          { id: `sites`, label: `站点`, icon: scope.te },
          { id: `accounts`, label: `账号`, icon: scope.h },
          { id: `network`, label: `代理与网络`, icon: scope.S },
          { id: `records`, label: `执行记录`, icon: scope.p },
        ];
        break;
      }
      case 9: {
        scope.km = {
          done: `已完成`,
          pending: `待签到`,
          running: `执行中`,
          attention: `需处理`,
          failed: `失败`,
        };
        break;
      }
      case 10: {
        scope.Am = {
          done: `bg-mint-50 text-mint-700 dark:bg-mint-600/15 dark:text-mint-300`,
          pending: `bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300`,
          running: `bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`,
          attention: `bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300`,
          failed: `bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300`,
        };
        break;
      }
    }
  },
  storeProperties: {},
});

// React 运行引用、消息适配和公共界面 — app published scope.

export const appRuntime = createUiModuleRuntime({
  bindingNames: [
    'W',
    'G',
    'q',
    'Pt',
    'Ft',
    'It',
    'Lt',
    'sr',
    'cr',
    'lr',
    'ur',
    'dr',
    'X',
    'Bi',
    'Vi',
    'uo',
    'Q',
    'No',
    'ou',
    'su',
    'cu',
    'lu',
    'uu',
  ],

  register(scope) {
    scope.q = function q(e = new Date()) {
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
        let t = new URL(e),
          n = t.hostname === `localhost` || t.hostname === `127.0.0.1` || t.hostname === `[::1]`;
        return t.protocol !== `https:` && !(t.protocol === `http:` && n)
          ? ``
          : new URL(`/favicon.ico`, t.origin).href;
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
      return (
        scope.sr.set(
          e,
          n.then(
            () => void 0,
            () => void 0,
          ),
        ),
        n
      );
    };
    scope.ur = function ur() {
      let e = globalThis.navigator?.locks;
      return typeof e?.request == `function` ? e : void 0;
    };
    scope.dr = function dr(e, t) {
      let n = (0, scope.ur)();
      return n
        ? (0, scope.lr)(e, async () => await n.request(e, { mode: `exclusive` }, () => t()))
        : (0, scope.lr)(e, t);
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
              `[aria-checked="true"]:not(:disabled), select:not(:disabled), input:not(:disabled), textarea:not(:disabled)`,
            ),
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
                `button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary`,
              ),
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
        children:
          e &&
          (0, scope.W.jsx)(scope.w.div, {
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
              'aria-modal': !0,
              'aria-label': t,
              onClick: (e) => e.stopPropagation(),
              className: `aah-modal-panel ${footer ? `aah-modal-with-footer ` : ``}${i ? `max-w-2xl` : `max-w-md`} max-h-full w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 dark:bg-ink-800 dark:ring-white/10`,
              children: [
                (0, scope.W.jsxs)(`header`, {
                  className: `aah-modal-header flex items-center justify-between border-b border-black/5 px-5 py-3.5 dark:border-white/5`,
                  children: [
                    (0, scope.W.jsx)(`h3`, {
                      className: `text-sm font-semibold text-ink-900 dark:text-ink-50`,
                      children: t,
                    }),
                    (0, scope.W.jsx)(scope.w.button, {
                      whileHover: { scale: 1.12, rotate: 90 },
                      whileTap: { scale: 0.9 },
                      type: `button`,
                      onClick: n,
                      className: `rounded-lg p-1.5 text-ink-800/50 hover:bg-black/5 dark:text-ink-100/50 dark:hover:bg-white/10`,
                      children: (0, scope.W.jsx)(scope.h, { className: `size-4` }),
                    }),
                  ],
                }),
                (0, scope.W.jsx)(`div`, {
                  className: `${footer ? `aah-modal-content ` : ``}p-5`,
                  children: r,
                }),
                footer &&
                  (0, scope.W.jsx)(`footer`, {
                    className: `aah-modal-footer`,
                    children: footer,
                  }),
              ],
            }),
          }),
      });
    };
    scope.Q = function Q({ label: e, hint: t, children: n }) {
      return (0, scope.W.jsxs)(`label`, {
        className: `block space-y-1.5`,
        children: [
          (0, scope.W.jsx)(`span`, {
            className: `text-xs font-medium text-ink-800/70 dark:text-ink-100/60`,
            children: e,
          }),
          n,
          t &&
            (0, scope.W.jsx)(`span`, {
              className: `block text-[11px] text-ink-800/40 dark:text-ink-100/30`,
              children: t,
            }),
        ],
      });
    };
    scope.No = function No({ steps: e }) {
      return (0, scope.W.jsx)(`ol`, {
        className: `mt-1 space-y-1.5`,
        children: e.map((e, t) =>
          (0, scope.W.jsxs)(
            `li`,
            {
              className: `break-words`,
              children: [
                t + 1,
                `. `,
                (0, scope.Ao)(e),
                e.type === `if` &&
                  (0, scope.W.jsxs)(`div`, {
                    className: `ml-3 border-l border-black/10 pl-2 dark:border-white/10`,
                    children: [
                      (0, scope.W.jsx)(`p`, { children: `满足条件时：` }),
                      (0, scope.W.jsx)(scope.No, { steps: e.then }),
                      !!e.else?.length &&
                        (0, scope.W.jsxs)(scope.W.Fragment, {
                          children: [
                            (0, scope.W.jsx)(`p`, { className: `mt-1`, children: `否则：` }),
                            (0, scope.W.jsx)(scope.No, { steps: e.else }),
                          ],
                        }),
                    ],
                  }),
              ],
            },
            t,
          ),
        ),
      });
    };
    scope.uu = function uu(e, t) {
      let n = { total: e.length, done: 0, pending: 0, running: 0, attention: 0, failed: 0 };
      for (let r of e) n[t(r.id)] += 1;
      return {
        ...n,
        actionable: n.pending + n.failed,
        progress: n.total ? Math.round((n.done / n.total) * 100) : 0,
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
        scope.sr = new Map();
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
            (this.setState({ info: t.componentStack ?? `` }),
              console.error(`[签到管理台] 渲染崩溃`, e, t.componentStack));
          }
          render() {
            let { error: e, info: t } = this.state;
            return e
              ? (0, scope.W.jsxs)(`div`, {
                  className: `mx-auto max-w-2xl px-6 py-16`,
                  children: [
                    (0, scope.W.jsx)(`h1`, {
                      className: `text-base font-bold text-rose-700 dark:text-rose-300`,
                      children: `签到管理台渲染出错`,
                    }),
                    (0, scope.W.jsx)(`p`, {
                      className: `mt-2 text-xs text-ink-800/65 dark:text-ink-100/55`,
                      children: `不是你操作的问题，是界面代码崩了。把下面的报错发给开发者即可定位。`,
                    }),
                    (0, scope.W.jsxs)(`pre`, {
                      className: `mt-4 overflow-auto rounded-lg bg-rose-50 p-3 text-[11px] leading-relaxed text-rose-900 ring-1 ring-rose-500/20 dark:bg-rose-950/30 dark:text-rose-200`,
                      children: [e.message, e.stack],
                    }),
                    t &&
                      (0, scope.W.jsx)(`pre`, {
                        className: `mt-3 overflow-auto rounded-lg bg-slate-100 p-3 text-[10px] leading-relaxed text-ink-800/70 dark:bg-slate-900 dark:text-ink-100/60`,
                        children: t,
                      }),
                    (0, scope.W.jsx)(`button`, {
                      type: `button`,
                      onClick: () => this.setState({ error: null, info: `` }),
                      className: `mt-4 h-9 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700`,
                      children: `重试渲染`,
                    }),
                  ],
                })
              : this.props.children;
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
  storeProperties: {},
});
