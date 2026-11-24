/** src/modules/checkin/view.js: 功能模块实现，保留发布版本的符号以便逐步恢复命名。 */
import { createUiModuleRuntime, createUiScope, initializeUiScope } from '../../shared/ui-scope.js';

// 签到状态、执行队列、运行进度与定时配置 — app published scope.
export let ScheduleEditor, LiveTaskPanel, CheckinQueuePanel;
export const appRuntime = createUiModuleRuntime({
  bindingNames: [
    'fr',
    'pr',
    'mr',
    'hr',
    'gr',
    '_r',
    'Hi',
    'Wi',
    'Gi',
    'Ki',
    'qi',
    'Ji',
    'qs',
    'Js',
    'Ys',
    'Xs',
    'Zs',
    '$l',
    'eu',
    'tu',
    'nu',
    'ru',
    'fu',
    'pu',
  ],
  publish(name, value) {
    switch (name) {
      case 'Zs':
        ScheduleEditor = value;
        break;
      case 'ru':
        LiveTaskPanel = value;
        break;
      case '$l':
        CheckinQueuePanel = value;
        break;
    }
  },
  register(scope) {
    scope.hr = function hr(e) {
      if (!e || typeof e != `object`) return { ...scope.fr };
      let t = e,
        n = t.time !== void 0,
        r = typeof t.time == `string` && scope.mr.test(t.time),
        i = t.weekdays !== void 0,
        a = t.accountIds !== void 0,
        o =
          Array.isArray(t.accountIds) &&
          t.accountIds.every((e) => typeof e == `string` && e.length > 0),
        s = Array.isArray(t.weekdays)
          ? [...new Set(t.weekdays.filter((e) => Number.isInteger(e) && e >= 0 && e <= 6))].sort(
              (e, t) => e - t,
            )
          : [],
        c = Array.isArray(t.accountIds)
          ? [...new Set(t.accountIds.filter((e) => typeof e == `string` && e.length > 0))].sort()
          : [],
        l = (t.enabled === !0 && (!n || !i)) || (n && !r) || (i && s.length === 0) || (a && !o),
        u = {
          enabled: t.enabled === !0 && !l,
          time: r ? t.time : scope.fr.time,
          weekdays: s.length ? s : [...scope.fr.weekdays],
        };
      return (a && (u.accountIds = c), u);
    };
    scope.gr = function gr(e, t) {
      let n = (0, scope.hr)(e);
      if (n.accountIds === void 0) return n;
      let r = new Set(t);
      return { ...n, accountIds: n.accountIds.filter((e) => r.has(e)) };
    };
    scope._r = function _r(e, t = new Date()) {
      let n = (0, scope.hr)(e);
      if (!n.enabled || n.weekdays.length === 0) return null;
      let [r = 0, i = 0] = n.time.split(`:`).map(Number),
        a = new Set(n.weekdays);
      for (let e = 0; e <= 7; e += 1) {
        let n = new Date(t);
        if (
          (n.setDate(t.getDate() + e),
          n.setHours(r, i, 0, 0),
          a.has(n.getDay()) && n.getTime() > t.getTime())
        )
          return n;
      }
      return null;
    };
    scope.Hi = async function Hi() {
      try {
        let e = await (0, scope.H)({ type: `GET_LIVE_TASKS` });
        if (e.ok && e.feature?.live && e.feature?.queue)
          return { live: e.feature.live, queue: e.feature.queue };
      } catch {}
      return { live: [], queue: { pending: [] } };
    };
    scope.Ki = function Ki(e) {
      return (e && scope.Gi[e]) ?? scope.Wi;
    };
    scope.qi = function qi(e, t) {
      let n = (0, scope.Ki)(t);
      switch (e) {
        case `login`:
          return `正在登录`;
        case `verify`:
          return `登录校验`;
        case `verify-oauth`:
          return `等待授权`;
        case `verify-manual`:
          return `等待页面登录`;
        case `relogin-verify-manual`:
          return `等待页面重登`;
        case `checkin`:
          return n.acting;
        case `github-logout`:
          return `正在切换 GitHub 账号`;
        case `relogin`:
          return `退出重登`;
        case `relogin-verify`:
          return `二次校验`;
        default:
          return `处理中`;
      }
    };
    scope.Ji = function Ji(e, t) {
      let n = (0, scope.Ki)(t);
      switch (e) {
        case `done`:
          return n.done;
        case `running`:
          return n.running;
        case `attention`:
          return `需要人工处理`;
        case `failed`:
          return n.failed;
        default:
          return n.pending;
      }
    };
    scope.qs = function qs({ label: e, value: t, tone: n }) {
      return (0, scope.W.jsxs)(`div`, {
        className: (0, scope.R)(
          `rounded-lg px-3 py-2.5`,
          {
            brand: `bg-brand-50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-300`,
            emerald: `bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300`,
            sky: `bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-300`,
            ink: `bg-ink-100 text-ink-800/70 dark:bg-ink-900 dark:text-ink-100/60`,
          }[n],
        ),
        children: [
          (0, scope.W.jsx)(`p`, { className: `text-[10px] opacity-70`, children: e }),
          (0, scope.W.jsx)(`p`, {
            className: `mt-0.5 text-lg font-semibold tabular-nums`,
            children: t,
          }),
        ],
      });
    };
    scope.Js = function Js(e) {
      let t = (0, scope._r)(e);
      if (!t) return `未安排`;
      let n = scope.pr[t.getDay()],
        r = new Date();
      return `${t.toDateString() === r.toDateString() ? `今天` : `${t.getMonth() + 1}/${t.getDate()} 周${n}`} ${e.time}`;
    };
    scope.Ys = function Ys(e, t, n) {
      return e.accountIds === void 0
        ? `全部账号${t ? ` (${t})` : ``}`
        : n === 0
          ? `未选择账号`
          : `已选 ${n} 个账号`;
    };
    scope.Xs = function Xs({ selected: e, partial: t = !1 }) {
      return (0, scope.W.jsx)(`span`, {
        className: (0, scope.R)(
          `flex size-4 shrink-0 items-center justify-center rounded border transition-colors`,
          e || t
            ? `border-brand-500 bg-brand-500 text-white`
            : `border-ink-800/20 bg-white/70 dark:border-white/20 dark:bg-ink-900/70`,
        ),
        'aria-hidden': `true`,
        children: t
          ? (0, scope.W.jsx)(scope.Ze, { className: `size-3` })
          : e
            ? (0, scope.W.jsx)(scope.o, { className: `size-3` })
            : null,
      });
    };
    scope.Zs = function Zs({ open: e, schedule: t, sites: n, accounts: r, onClose: i, onSave: a }) {
      let s = (0, scope.G.useMemo)(() => r.map((e) => e.id), [r]),
        c = (0, scope.G.useMemo)(() => new Set(s), [s]),
        l = (0, scope.G.useMemo)(() => {
          let e = n.map((e) => ({
              siteId: e.id,
              siteName: e.name,
              accounts: r.filter((t) => t.siteId === e.id),
            })),
            t = new Set(n.map((e) => e.id)),
            i = r.filter((e) => !t.has(e.siteId));
          return (
            i.length && e.push({ siteId: `__orphan__`, siteName: `未归属站点`, accounts: i }),
            e.filter((e) => e.accounts.length > 0)
          );
        }, [r, n]),
        [f, p] = (0, scope.G.useState)(() => (0, scope.gr)((0, scope.hr)(t), s)),
        [m, h] = (0, scope.G.useState)(!1),
        [g, _] = (0, scope.G.useState)();
      (0, scope.G.useEffect)(() => {
        e && (p((0, scope.gr)((0, scope.hr)(t), s)), _(void 0));
      }, [s, e, t]);
      let v = /^\d{2}:\d{2}$/.test(f.time) && f.weekdays.length > 0,
        y = (0, scope.G.useMemo)(
          () => new Set(f.accountIds === void 0 ? s : f.accountIds.filter((e) => c.has(e))),
          [c, s, f.accountIds],
        ),
        b = f.accountIds === void 0 ? r.length : y.size,
        S = f.accountIds === void 0,
        C = (0, scope.G.useMemo)(() => (v && f.enabled ? (0, scope.Js)(f) : `未启用`), [f, v]);
      function T(e) {
        p((t) => {
          let n = t.weekdays.includes(e)
            ? t.weekdays.filter((t) => t !== e)
            : [...t.weekdays, e].sort((e, t) => e - t);
          return { ...t, weekdays: n };
        });
      }
      function E(e) {
        let t = [...new Set(e)].filter((e) => c.has(e)).sort();
        p((e) => ({ ...e, accountIds: t }));
      }
      function D(e) {
        let t = new Set(y);
        (t.has(e) ? t.delete(e) : t.add(e), E(t));
      }
      function k(e) {
        let t = new Set(y),
          n = e.accounts.map((e) => e.id),
          r = n.every((e) => t.has(e));
        (n.forEach((e) => {
          r ? t.delete(e) : t.add(e);
        }),
          E(t));
      }
      function A() {
        p((e) => ({ ...e, accountIds: void 0 }));
      }
      function j() {
        p((e) => ({ ...e, accountIds: [] }));
      }
      async function M() {
        if (v && !m) {
          (h(!0), _(void 0));
          try {
            (await a(
              (0, scope.gr)(
                { ...f, time: f.time, weekdays: [...new Set(f.weekdays)].sort((e, t) => e - t) },
                s,
              ),
            ),
              i());
          } catch (e) {
            _(e instanceof Error ? e.message : `保存失败，请重试`);
          } finally {
            h(!1);
          }
        }
      }
      return (0, scope.W.jsx)(scope.uo, {
        open: e,
        title: `定时签到`,
        wide: !0,
        onClose: () => !m && i(),
        children: (0, scope.W.jsxs)(`div`, {
          className: `space-y-5`,
          children: [
            (0, scope.W.jsxs)(scope.w.div, {
              initial: { opacity: 0, y: -6 },
              animate: { opacity: 1, y: 0 },
              className: (0, scope.R)(
                `flex items-center gap-3 rounded-xl px-3.5 py-3 ring-1 transition-colors`,
                f.enabled
                  ? `bg-mint-500/10 text-mint-700 ring-mint-500/20 dark:text-mint-300`
                  : `bg-ink-50 text-ink-800/55 ring-black/5 dark:bg-ink-900/60 dark:text-ink-100/45 dark:ring-white/10`,
              ),
              children: [
                (0, scope.W.jsx)(`span`, {
                  className: `flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/80 shadow-sm dark:bg-white/10`,
                  children: (0, scope.W.jsx)(scope.ge, { className: `size-5` }),
                }),
                (0, scope.W.jsxs)(`div`, {
                  className: `min-w-0 flex-1`,
                  children: [
                    (0, scope.W.jsx)(`div`, {
                      className: `text-sm font-semibold`,
                      children: `后台计划`,
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `mt-0.5 text-[11px] opacity-70`,
                      children: [`下一次：`, C],
                    }),
                  ],
                }),
                (0, scope.W.jsxs)(`label`, {
                  className: `relative inline-flex shrink-0 cursor-pointer items-center`,
                  title: f.enabled ? `关闭定时签到` : `开启定时签到`,
                  children: [
                    (0, scope.W.jsx)(`input`, {
                      type: `checkbox`,
                      className: `peer sr-only`,
                      'aria-label': f.enabled ? `关闭定时签到` : `开启定时签到`,
                      checked: f.enabled,
                      onChange: (e) => p((t) => ({ ...t, enabled: e.target.checked })),
                    }),
                    (0, scope.W.jsx)(`span`, {
                      className: `h-6 w-11 rounded-full bg-ink-900/15 transition-colors peer-checked:bg-mint-500 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/50 dark:bg-white/15`,
                    }),
                    (0, scope.W.jsx)(`span`, {
                      className: `absolute left-1 top-1 flex size-4 items-center justify-center rounded-full bg-white shadow transition-transform peer-checked:translate-x-5 dark:bg-ink-50`,
                      children: (0, scope.W.jsx)(scope.xe, {
                        className: `size-2.5 text-ink-800/45`,
                      }),
                    }),
                  ],
                }),
              ],
            }),
            (0, scope.W.jsxs)(`div`, {
              className: `grid gap-4 sm:grid-cols-2`,
              children: [
                (0, scope.W.jsx)(scope.Q, {
                  label: `执行时间`,
                  children: (0, scope.W.jsx)(`input`, {
                    type: `time`,
                    className: scope.$,
                    value: f.time,
                    onChange: (e) => p((t) => ({ ...t, time: e.target.value })),
                  }),
                }),
                (0, scope.W.jsx)(scope.Q, {
                  label: `执行日`,
                  children: (0, scope.W.jsx)(`div`, {
                    className: `grid grid-cols-7 gap-1.5`,
                    children: scope.pr.map((e, t) => {
                      let n = f.weekdays.includes(t);
                      return (0, scope.W.jsxs)(
                        scope.w.button,
                        {
                          whileTap: { scale: 0.9 },
                          type: `button`,
                          'aria-pressed': n,
                          'aria-label': `星期${e}`,
                          onClick: () => T(t),
                          className: (0, scope.R)(
                            `relative flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors`,
                            n
                              ? `bg-brand-500 text-white shadow-md shadow-brand-500/20`
                              : `bg-ink-50 text-ink-800/50 ring-1 ring-black/5 hover:bg-brand-500/10 dark:bg-ink-900/60 dark:text-ink-100/45 dark:ring-white/10`,
                          ),
                          children: [
                            (0, scope.W.jsx)(scope.O, {
                              initial: !1,
                              children:
                                n &&
                                (0, scope.W.jsx)(scope.w.span, {
                                  initial: { opacity: 0, scale: 0.6 },
                                  animate: { opacity: 1, scale: 1 },
                                  exit: { opacity: 0, scale: 0.6 },
                                  className: `absolute inset-0 rounded-lg ring-2 ring-brand-300/50`,
                                  'aria-hidden': `true`,
                                }),
                            }),
                            (0, scope.W.jsx)(`span`, { className: `relative z-[1]`, children: e }),
                          ],
                        },
                        e,
                      );
                    }),
                  }),
                }),
              ],
            }),
            (0, scope.W.jsxs)(`section`, {
              className: `space-y-2`,
              'aria-label': `计划账号范围`,
              children: [
                (0, scope.W.jsxs)(`div`, {
                  className: `flex flex-wrap items-center justify-between gap-2`,
                  children: [
                    (0, scope.W.jsxs)(`div`, {
                      children: [
                        (0, scope.W.jsxs)(`div`, {
                          className: `flex items-center gap-1.5 text-xs font-medium text-ink-800/70 dark:text-ink-100/60`,
                          children: [
                            (0, scope.W.jsx)(scope.d, { className: `size-3.5` }),
                            `签到账号`,
                          ],
                        }),
                        (0, scope.W.jsx)(`div`, {
                          className: `mt-0.5 text-[11px] text-ink-800/40 dark:text-ink-100/35`,
                          children: (0, scope.Ys)(f, r.length, b),
                        }),
                      ],
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `flex items-center gap-1.5`,
                      children: [
                        (0, scope.W.jsxs)(`button`, {
                          type: `button`,
                          'aria-label': `全选账号`,
                          disabled: m || S,
                          onClick: A,
                          className: `inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-brand-600 ring-1 ring-brand-500/20 transition-colors hover:bg-brand-500/10 disabled:opacity-40 dark:text-brand-300`,
                          children: [(0, scope.W.jsx)(scope.U, { className: `size-3.5` }), `全选`],
                        }),
                        (0, scope.W.jsx)(`button`, {
                          type: `button`,
                          'aria-label': `清空账号`,
                          disabled: m || b === 0,
                          onClick: j,
                          className: `inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-ink-800/55 ring-1 ring-black/10 transition-colors hover:bg-black/5 disabled:opacity-40 dark:text-ink-100/50 dark:ring-white/10 dark:hover:bg-white/10`,
                          children: `清空`,
                        }),
                      ],
                    }),
                  ],
                }),
                (0, scope.W.jsx)(`div`, {
                  className: `max-h-64 space-y-2 overflow-y-auto rounded-xl bg-ink-50/70 p-2 ring-1 ring-black/5 dark:bg-ink-900/45 dark:ring-white/10`,
                  children:
                    l.length === 0
                      ? (0, scope.W.jsxs)(`div`, {
                          className: `flex items-center justify-center gap-2 py-8 text-xs text-ink-800/40 dark:text-ink-100/35`,
                          children: [
                            (0, scope.W.jsx)(scope.x, { className: `size-4` }),
                            `暂无可执行账号`,
                          ],
                        })
                      : l.map((e) => {
                          let t = e.accounts.every((e) => y.has(e.id)),
                            n = !t && e.accounts.some((e) => y.has(e.id));
                          return (0, scope.W.jsxs)(
                            scope.w.div,
                            {
                              layout: !0,
                              className: `rounded-lg bg-white/70 p-2 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10`,
                              children: [
                                (0, scope.W.jsxs)(`button`, {
                                  type: `button`,
                                  'aria-pressed': t,
                                  'aria-label': `选择站点 ${e.siteName}`,
                                  onClick: () => k(e),
                                  className: `flex w-full items-center gap-2 rounded-md px-1 py-1 text-left transition-colors hover:bg-brand-500/8`,
                                  children: [
                                    (0, scope.W.jsx)(scope.Xs, { selected: t, partial: n }),
                                    (0, scope.W.jsx)(scope.x, {
                                      className: (0, scope.R)(
                                        `size-3.5`,
                                        t || n
                                          ? `text-brand-500`
                                          : `text-ink-800/40 dark:text-ink-100/35`,
                                      ),
                                    }),
                                    (0, scope.W.jsx)(`span`, {
                                      className: `min-w-0 flex-1 truncate text-xs font-semibold text-ink-900 dark:text-ink-50`,
                                      children: e.siteName,
                                    }),
                                    (0, scope.W.jsxs)(`span`, {
                                      className: `text-[10px] text-ink-800/40 dark:text-ink-100/35`,
                                      children: [e.accounts.length, ` 个账号`],
                                    }),
                                  ],
                                }),
                                (0, scope.W.jsx)(`div`, {
                                  className: `mt-1 grid gap-1 sm:grid-cols-2`,
                                  children: e.accounts.map((e) => {
                                    let t = y.has(e.id),
                                      n = e.label?.trim() || e.username;
                                    return (0, scope.W.jsxs)(
                                      `button`,
                                      {
                                        type: `button`,
                                        'aria-pressed': t,
                                        'aria-label': `选择账号 ${n}`,
                                        onClick: () => D(e.id),
                                        className: `flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-brand-500/8`,
                                        children: [
                                          (0, scope.W.jsx)(scope.Xs, { selected: t }),
                                          (0, scope.W.jsx)(`span`, {
                                            className: `min-w-0 flex-1 truncate text-[11px] text-ink-800/70 dark:text-ink-100/65`,
                                            children: n,
                                          }),
                                        ],
                                      },
                                      e.id,
                                    );
                                  }),
                                }),
                              ],
                            },
                            e.siteId,
                          );
                        }),
                }),
              ],
            }),
            (0, scope.W.jsxs)(`div`, {
              className: `flex items-center justify-between rounded-lg bg-sun-500/10 px-3 py-2 text-[11px] text-ink-800/60 dark:text-ink-100/55`,
              children: [
                (0, scope.W.jsx)(`span`, { children: `下一次执行` }),
                (0, scope.W.jsx)(`span`, {
                  className: `font-semibold text-ink-900 dark:text-ink-50`,
                  children:
                    f.enabled && v
                      ? `${(0, scope.Js)(f)} · ${(0, scope.Ys)(f, r.length, b)}`
                      : `未启用`,
                }),
              ],
            }),
            g &&
              (0, scope.W.jsx)(`p`, {
                className: `text-xs text-rose-600 dark:text-rose-400`,
                children: g,
              }),
            !f.weekdays.length &&
              (0, scope.W.jsx)(`p`, {
                className: `text-xs text-amber-600 dark:text-amber-400`,
                children: `至少选择一天`,
              }),
            (0, scope.W.jsxs)(`div`, {
              className: `flex gap-2`,
              children: [
                (0, scope.W.jsx)(`button`, {
                  type: `button`,
                  disabled: m,
                  onClick: i,
                  className: `h-10 flex-1 rounded-xl px-4 text-sm font-medium text-ink-800 ring-1 ring-black/10 transition-colors hover:bg-black/5 disabled:opacity-40 dark:text-ink-100 dark:ring-white/10 dark:hover:bg-white/10`,
                  children: `取消`,
                }),
                (0, scope.W.jsxs)(scope.w.button, {
                  whileTap: { scale: 0.98 },
                  type: `button`,
                  disabled: !v || m,
                  onClick: () => void M(),
                  className: (0, scope.R)(
                    scope.fo,
                    `flex h-10 flex-1 items-center justify-center gap-1.5`,
                  ),
                  children: [
                    m
                      ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` })
                      : (0, scope.W.jsx)(scope.o, { className: `size-4` }),
                    m ? `保存中...` : `保存计划`,
                  ],
                }),
              ],
            }),
          ],
        }),
      });
    };
    scope.$l = function $l({
      stats: e,
      balanceTotal: n,
      onRunAll: r,
      actionableCount: i,
      searchScoped: o = !1,
      compact: s = !1,
    }) {
      let c = (0, scope.Te)(),
        l = Math.min(Math.max(e.progress, 0), 100),
        d = (0, scope.nu)(e),
        f = i ?? e.actionable;
      return (0, scope.W.jsxs)(`section`, {
        className: `mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950`,
        children: [
          (0, scope.W.jsxs)(`div`, {
            className: `flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-4 py-3.5 dark:border-slate-800`,
            children: [
              (0, scope.W.jsxs)(`div`, {
                className: `min-w-0`,
                children: [
                  (0, scope.W.jsx)(`p`, {
                    className: `text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500`,
                    children: `今日队列`,
                  }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1`,
                    children: [
                      (0, scope.W.jsxs)(`strong`, {
                        className: `text-2xl font-bold tabular-nums text-slate-950 dark:text-white`,
                        children: [
                          e.done,
                          (0, scope.W.jsx)(`span`, {
                            className: `text-slate-300 dark:text-slate-700`,
                            children: ` / `,
                          }),
                          e.total,
                        ],
                      }),
                      (0, scope.W.jsx)(`span`, {
                        className: `text-sm text-slate-500`,
                        children: `个账号已完成`,
                      }),
                    ],
                  }),
                  (0, scope.W.jsx)(`p`, {
                    className: `mt-1 text-xs text-slate-500 dark:text-slate-400`,
                    children: d,
                  }),
                ],
              }),
              (0, scope.W.jsx)(`div`, {
                className: `flex flex-wrap items-center justify-end gap-2`,
                children:
                  f > 0 &&
                  (0, scope.W.jsxs)(scope.w.button, {
                    whileHover: c ? void 0 : { y: -1 },
                    whileTap: c ? void 0 : { scale: 0.98 },
                    type: `button`,
                    onClick: r,
                    title: o ? `按当前搜索范围执行` : void 0,
                    className: `inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700`,
                    children: [
                      (0, scope.W.jsx)(scope.m, { className: `size-3.5 fill-current` }),
                      `执行待签到（`,
                      f,
                      `）`,
                    ],
                  }),
              }),
            ],
          }),
          (0, scope.W.jsxs)(`div`, {
            className: `px-4 pt-3.5`,
            children: [
              (0, scope.W.jsxs)(`div`, {
                className: `mb-2 flex items-center justify-between text-[11px] font-medium text-slate-500`,
                children: [
                  (0, scope.W.jsx)(`span`, { children: `执行进度` }),
                  (0, scope.W.jsxs)(`span`, { className: `tabular-nums`, children: [l, `%`] }),
                ],
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `relative flex h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800`,
                role: `progressbar`,
                'aria-label': `今日执行进度`,
                'aria-valuemin': 0,
                'aria-valuemax': 100,
                'aria-valuenow': l,
                children: [
                  (0, scope.W.jsx)(scope.eu, {
                    value: e.done,
                    total: e.total,
                    className: `bg-emerald-500`,
                  }),
                  (0, scope.W.jsx)(scope.eu, {
                    value: e.running,
                    total: e.total,
                    className: `bg-blue-500`,
                  }),
                  (0, scope.W.jsx)(scope.eu, {
                    value: e.pending,
                    total: e.total,
                    className: `bg-amber-400`,
                  }),
                  (0, scope.W.jsx)(scope.eu, {
                    value: e.attention,
                    total: e.total,
                    className: `bg-cyan-500`,
                  }),
                  (0, scope.W.jsx)(scope.eu, {
                    value: e.failed,
                    total: e.total,
                    className: `bg-rose-500`,
                  }),
                  !c &&
                    e.running > 0 &&
                    (0, scope.W.jsx)(scope.w.span, {
                      className: `absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 shadow-sm dark:border-slate-950`,
                      initial: !1,
                      animate: {
                        left: [
                          `${Math.max(1, l - 2)}%`,
                          `${Math.min(98, l + 2)}%`,
                          `${Math.max(1, l - 2)}%`,
                        ],
                      },
                      transition: { duration: 1.8, repeat: 1 / 0, ease: `easeInOut` },
                      'aria-hidden': `true`,
                    }),
                ],
              }),
            ],
          }),
          (0, scope.W.jsxs)(`div`, {
            className: (0, scope.R)(
              `grid gap-px bg-slate-100 p-px dark:bg-slate-800`,
              s ? `grid-cols-2` : `grid-cols-2 md:grid-cols-6`,
            ),
            children: [
              (0, scope.W.jsx)(scope.tu, {
                icon: (0, scope.W.jsx)(scope.t, {}),
                label: `已完成`,
                value: e.done,
                tone: `text-emerald-600`,
              }),
              (0, scope.W.jsx)(scope.tu, {
                icon: (0, scope.W.jsx)(scope.ye, {}),
                label: `待签到`,
                value: e.pending,
                tone: `text-amber-600`,
              }),
              (0, scope.W.jsx)(scope.tu, {
                icon: (0, scope.W.jsx)(scope.u, { className: e.running ? `animate-spin` : `` }),
                label: `执行中`,
                value: e.running,
                tone: `text-blue-600`,
              }),
              (0, scope.W.jsx)(scope.tu, {
                icon: (0, scope.W.jsx)(scope.p, {}),
                label: `需处理`,
                value: e.attention,
                tone: `text-cyan-600`,
              }),
              (0, scope.W.jsx)(scope.tu, {
                icon: (0, scope.W.jsx)(scope.g, {}),
                label: `失败`,
                value: e.failed,
                tone: `text-rose-600`,
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `flex items-center gap-2 bg-white px-3 py-2.5 dark:bg-slate-950`,
                children: [
                  (0, scope.W.jsx)(`span`, {
                    className: `grid size-7 place-items-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300`,
                    children: (0, scope.W.jsx)(scope.a, { className: `size-3.5` }),
                  }),
                  (0, scope.W.jsxs)(`span`, {
                    className: `min-w-0`,
                    children: [
                      (0, scope.W.jsx)(`span`, {
                        className: `block text-[11px] text-slate-500`,
                        children: `已读余额`,
                      }),
                      (0, scope.W.jsx)(`strong`, {
                        className: `block text-sm tabular-nums text-slate-900 dark:text-white`,
                        children: (0, scope.ce)(n),
                      }),
                      n.missing > 0 &&
                        (0, scope.W.jsxs)(`span`, {
                          className: `block text-[10px] text-amber-600`,
                          children: [n.missing, ` 个未获取`],
                        }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    };
    scope.eu = function eu({ value: e, total: t, className: n }) {
      let r = t > 0 ? `${(e / t) * 100}%` : `0%`;
      return (0, scope.W.jsx)(scope.w.span, {
        initial: !1,
        animate: { width: r },
        transition: { type: `spring`, stiffness: 180, damping: 25 },
        className: (0, scope.R)(`h-full shrink-0`, n),
      });
    };
    scope.tu = function tu({ icon: e, label: t, value: n, tone: r }) {
      return (0, scope.W.jsxs)(`div`, {
        className: `flex items-center gap-2 bg-white px-3 py-2.5 dark:bg-slate-950`,
        children: [
          (0, scope.W.jsx)(`span`, {
            className: (0, scope.R)(
              `grid size-7 place-items-center rounded-md bg-slate-50 dark:bg-slate-900`,
              r,
            ),
            children: e,
          }),
          (0, scope.W.jsxs)(`span`, {
            className: `min-w-0`,
            children: [
              (0, scope.W.jsx)(`span`, {
                className: `block text-[11px] text-slate-500`,
                children: t,
              }),
              (0, scope.W.jsx)(`strong`, {
                className: `block text-sm tabular-nums text-slate-900 dark:text-white`,
                children: n,
              }),
            ],
          }),
        ],
      });
    };
    scope.nu = function nu(e) {
      return e.failed > 0
        ? `${e.failed} 个账号失败，建议先查看失败原因后重试。`
        : e.attention > 0
          ? `${e.attention} 个账号等待人工处理页面验证。`
          : e.running > 0
            ? `${e.running} 个账号正在执行，队列将自动继续。`
            : e.actionable > 0
              ? `${e.actionable} 个账号已准备好，可以开始执行。`
              : e.total > 0
                ? `今天的队列已经完成。`
                : `先添加站点和账号，再开始管理签到任务。`;
    };
    scope.ru = function ru({
      accounts: e,
      sites: t,
      live: n,
      queue: i,
      compact: a = !1,
      statusOf: o,
      onStopAll: s,
    }) {
      let [c, l] = (0, scope.G.useState)(() => Date.now()),
        d = (0, scope.Te)(),
        f = (0, scope.G.useMemo)(() => new Map(e.map((e) => [e.id, e])), [e]),
        p = (0, scope.G.useMemo)(() => new Map(t.map((e) => [e.id, e])), [t]);
      return (
        (0, scope.G.useEffect)(() => {
          if (!n.length) return;
          let e = window.setInterval(() => l(Date.now()), 1e3);
          return () => window.clearInterval(e);
        }, [n.length]),
        !n.length && !i.pending.length
          ? null
          : (0, scope.W.jsxs)(scope.w.section, {
              layout: !0,
              initial: { opacity: 0, y: -8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -8 },
              className: `live-console mb-5 overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm dark:border-blue-900/60 dark:bg-slate-950`,
              children: [
                (0, scope.W.jsxs)(`div`, {
                  className: `flex flex-wrap items-center gap-3 border-b border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-950 dark:bg-blue-950/25`,
                  children: [
                    (0, scope.W.jsx)(`span`, {
                      className: `grid size-9 place-items-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-600/25`,
                      children: (0, scope.W.jsx)(scope.r, {
                        className: (0, scope.R)(`size-4`, n.length && !d && `animate-pulse`),
                      }),
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `min-w-0 flex-1`,
                      children: [
                        (0, scope.W.jsx)(`h2`, {
                          className: `text-sm font-semibold text-slate-950 dark:text-white`,
                          children: `实时执行`,
                        }),
                        (0, scope.W.jsxs)(`p`, {
                          className: `mt-0.5 text-[11px] text-slate-500 dark:text-slate-400`,
                          children: [
                            n.length
                              ? `${n.length} 个账号正在执行`
                              : `执行队列已建立，等待下一个账号启动`,
                            i.pending.length ? ` · ${i.pending.length} 个排队` : ``,
                          ],
                        }),
                      ],
                    }),
                    (0, scope.W.jsxs)(`span`, {
                      className: `inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-200 dark:bg-slate-900 dark:text-blue-300 dark:ring-blue-900`,
                      children: [
                        (0, scope.W.jsx)(`span`, {
                          className: `size-1.5 animate-pulse rounded-full bg-blue-500`,
                        }),
                        `运行中`,
                      ],
                    }),
                    s &&
                      (0, scope.W.jsxs)(`button`, {
                        type: `button`,
                        onClick: s,
                        title: `停止正在执行和排队中的全部任务`,
                        className: `inline-flex h-7 items-center gap-1 rounded-md bg-white px-2 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800 dark:hover:text-white`,
                        children: [(0, scope.W.jsx)(scope.me, { className: `size-3` }), `全部停止`],
                      }),
                  ],
                }),
                (0, scope.W.jsx)(`div`, {
                  className: (0, scope.R)(
                    `grid`,
                    n.length > 1 && !a ? `lg:grid-cols-2` : `grid-cols-1`,
                  ),
                  children: (0, scope.W.jsx)(scope.O, {
                    mode: `popLayout`,
                    children: n.map((e, t) => {
                      let r = f.get(e.accountId),
                        i = p.get(e.siteId),
                        s = o(e.accountId) === `attention`,
                        l = e.steps.at(-1);
                      return (0, scope.W.jsx)(
                        scope.w.article,
                        {
                          layout: `position`,
                          initial: { opacity: 0, x: 10 },
                          animate: { opacity: 1, x: 0 },
                          exit: { opacity: 0, x: -10 },
                          className: (0, scope.R)(
                            `min-w-0 px-4 py-3.5`,
                            t > 0 && `border-t border-slate-100 dark:border-slate-800`,
                            n.length > 1 && !a && t % 2 == 1 && `lg:border-t-0 lg:border-l`,
                          ),
                          children: (0, scope.W.jsxs)(`div`, {
                            className: `flex min-w-0 items-start gap-3`,
                            children: [
                              (0, scope.W.jsx)(scope.iu, { site: i, attention: s }),
                              (0, scope.W.jsxs)(`div`, {
                                className: `min-w-0 flex-1`,
                                children: [
                                  (0, scope.W.jsx)(`div`, {
                                    className: `truncate text-xs font-semibold text-slate-900 dark:text-white`,
                                    children: r?.label || r?.username || e.accountId,
                                  }),
                                  (0, scope.W.jsx)(`div`, {
                                    className: `mt-0.5 truncate text-[11px] text-slate-500`,
                                    children: i?.name ?? `未知站点`,
                                  }),
                                  (0, scope.W.jsxs)(`div`, {
                                    className: (0, scope.R)(
                                      `mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]`,
                                      s
                                        ? `text-cyan-700 dark:text-cyan-300`
                                        : `text-blue-700 dark:text-blue-300`,
                                    ),
                                    children: [
                                      s
                                        ? (0, scope.W.jsx)(scope.g, { className: `size-3` })
                                        : (0, scope.W.jsx)(scope.u, {
                                            className: `size-3 animate-spin`,
                                          }),
                                      (0, scope.W.jsx)(`span`, {
                                        className: `font-medium`,
                                        children: (0, scope.da)(
                                          e.stage,
                                          e.method ?? i?.checkin?.method,
                                        ),
                                      }),
                                      (0, scope.W.jsxs)(`span`, {
                                        className: `inline-flex items-center gap-1 text-slate-500 dark:text-slate-400`,
                                        children: [
                                          (0, scope.W.jsx)(scope.ye, { className: `size-3` }),
                                          (0, scope.fa)(c - e.startedAt),
                                        ],
                                      }),
                                    ],
                                  }),
                                  l &&
                                    (0, scope.W.jsx)(`p`, {
                                      className: `mt-1.5 truncate text-[11px] text-slate-500 dark:text-slate-400`,
                                      title: l,
                                      children: l,
                                    }),
                                  (0, scope.W.jsx)(`ol`, {
                                    className: `mt-2 space-y-1 border-t border-slate-100 pt-2 dark:border-slate-800`,
                                    children: e.steps.map((t, n) =>
                                      (0, scope.W.jsxs)(
                                        `li`,
                                        {
                                          className: (0, scope.R)(
                                            `flex items-start gap-1.5 text-[10px] leading-4`,
                                            n === e.steps.length - 1
                                              ? `font-medium text-slate-700 dark:text-slate-200`
                                              : `text-slate-500 dark:text-slate-400`,
                                          ),
                                          children: [
                                            (0, scope.W.jsx)(`span`, {
                                              className: (0, scope.R)(
                                                `mt-1.5 size-1 shrink-0 rounded-full`,
                                                n === e.steps.length - 1
                                                  ? `bg-blue-500`
                                                  : `bg-slate-300 dark:bg-slate-600`,
                                              ),
                                            }),
                                            (0, scope.W.jsx)(`span`, { children: t }),
                                          ],
                                        },
                                        `${n}-${t}`,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                              (0, scope.W.jsxs)(`span`, {
                                className: `shrink-0 text-[10px] tabular-nums text-slate-400`,
                                children: [e.steps.length, ` 步`],
                              }),
                            ],
                          }),
                        },
                        e.runId,
                      );
                    }),
                  }),
                }),
                i.pending.length > 0 &&
                  (0, scope.W.jsxs)(`div`, {
                    className: `flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/60`,
                    children: [
                      (0, scope.W.jsxs)(`span`, {
                        className: `inline-flex items-center gap-1 text-[11px] font-medium text-slate-500`,
                        children: [
                          (0, scope.W.jsx)(scope.Ct, { className: `size-3.5` }),
                          `等待队列`,
                        ],
                      }),
                      i.pending.map((e, t) => {
                        let n = f.get(e);
                        return (0, scope.W.jsxs)(
                          `span`,
                          {
                            className: `inline-flex max-w-full items-center gap-1.5 rounded-md bg-white px-2 py-1 text-[10px] text-slate-600 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:ring-slate-800`,
                            children: [
                              (0, scope.W.jsx)(`span`, {
                                className: `font-semibold tabular-nums text-blue-600`,
                                children: t + 1,
                              }),
                              (0, scope.W.jsx)(`span`, {
                                className: `max-w-40 truncate`,
                                children: n?.label || n?.username || e,
                              }),
                            ],
                          },
                          e,
                        );
                      }),
                    ],
                  }),
              ],
            })
      );
    };
    scope.fu = function fu(e, t) {
      if (e.size !== t.size) return !1;
      for (let [n, r] of e) {
        let e = t.get(n);
        if (
          !e ||
          e.eventCount !== r.eventCount ||
          e.kind !== r.kind ||
          (e.guide?.step ?? 0) !== (r.guide?.step ?? 0) ||
          (e.loginAsCheckinAvailable ?? !1) !== (r.loginAsCheckinAvailable ?? !1) ||
          (e.preview?.length ?? 0) !== (r.preview?.length ?? 0)
        )
          return !1;
        if (e.preview && r.preview) {
          for (let t = 0; t < e.preview.length; t += 1)
            if (e.preview[t]?.text !== r.preview[t]?.text) return !1;
        }
      }
      return !0;
    };
    scope.pu = function pu({ onDone: e }) {
      return (0, scope.W.jsxs)(scope.w.div, {
        className: `launch-burst`,
        initial: { opacity: 0 },
        animate: { opacity: [0, 1, 1, 0] },
        transition: { duration: 0.86, times: [0, 0.12, 0.68, 1], ease: `easeOut` },
        onAnimationComplete: e,
        'aria-hidden': `true`,
        children: [
          (0, scope.W.jsx)(scope.w.span, {
            className: `launch-burst-wave`,
            initial: { x: `-50%`, scaleX: 0.02, opacity: 0.95 },
            animate: { x: `-50%`, scaleX: 1, opacity: 0 },
            transition: { duration: 0.78, ease: [0.16, 1, 0.3, 1] },
          }),
          (0, scope.W.jsx)(scope.w.span, {
            className: `launch-burst-ring`,
            initial: { scale: 0.2, opacity: 0.9 },
            animate: { scale: 3.4, opacity: 0 },
            transition: { duration: 0.72, ease: `easeOut` },
          }),
          (0, scope.W.jsx)(scope.w.span, {
            className: `launch-burst-ring launch-burst-ring-late`,
            initial: { scale: 0.35, opacity: 0.72 },
            animate: { scale: 2.5, opacity: 0 },
            transition: { duration: 0.68, delay: 0.08, ease: `easeOut` },
          }),
          (0, scope.W.jsx)(scope.w.span, {
            className: `launch-burst-core`,
            initial: { scale: 0.4, rotate: -45 },
            animate: { scale: [0.4, 1.25, 0], rotate: 45 },
            transition: { duration: 0.62, ease: `easeOut` },
            children: (0, scope.W.jsx)(scope.y, { className: `size-4` }),
          }),
        ],
      });
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.fr = { enabled: !1, time: `09:00`, weekdays: [1, 2, 3, 4, 5] };
        break;
      }
      case 1: {
        scope.pr = [`日`, `一`, `二`, `三`, `四`, `五`, `六`];
        break;
      }
      case 2: {
        scope.mr = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
        break;
      }
      case 3: {
        scope.Wi = {
          noun: `签到`,
          running: `签到中`,
          done: `已签到`,
          pending: `待签到`,
          failed: `签到失败`,
          acting: `正在签到`,
        };
        break;
      }
      case 4: {
        scope.Gi = {
          claim: {
            noun: `领取权益`,
            running: `领取中`,
            done: `已领取`,
            pending: `待领取`,
            failed: `领取失败`,
            acting: `正在领取权益`,
          },
          relogin: {
            noun: `登录奖励`,
            running: `领取中`,
            done: `已领取`,
            pending: `待领取`,
            failed: `领取失败`,
            acting: `正在重登领奖`,
          },
        };
        break;
      }
    }
  },
  storeProperties: {
    store_Li_updateSchedule(scope) {
      return {
        updateSchedule(e) {
          return (0, scope.X)(async () => {
            await scope.z.set(scope.M.schedule, (0, scope.hr)(e));
          });
        },
      };
    },
    store_Li_setStatus(scope) {
      return {
        async setStatus(e, t) {
          return (0, scope.X)(async () => {
            let n = await scope.z.get(scope.M.status, {});
            return (
              t === `pending` ? delete n[e] : (n[e] = t),
              await scope.z.set(scope.M.status, n),
              { ...n }
            );
          });
        },
      };
    },
    store_Li_clearInFlightStatus(scope) {
      return {
        async clearInFlightStatus(e) {
          return (0, scope.X)(async () => {
            let t = await scope.z.get(scope.M.status, {});
            return t[e] !== `running` && t[e] !== `attention`
              ? !1
              : (delete t[e], await scope.z.set(scope.M.status, t), !0);
          });
        },
      };
    },
    store_Li_getStatus(scope) {
      return {
        async getStatus(e) {
          return (await scope.z.get(scope.M.status, {}))[e];
        },
      };
    },
    store_Li_markDone(scope) {
      return {
        markDone(e) {
          return (0, scope.X)(async () => {
            let [t, n, r] = await Promise.all([
                scope.z.get(scope.M.status, {}),
                scope.z.get(scope.M.results, {}),
                scope.z.get(scope.M.balances, {}),
              ]),
              i = (0, scope.Nr)(e, r[e]);
            ((t[(0, scope.Pt)(e)] = `done`),
              (n[e] = { ...i, at: Date.now() }),
              await scope.z.setMany({ [scope.M.status]: t, [scope.M.results]: n }));
          });
        },
      };
    },
    store_Li_setStatusUnlessTerminal(scope) {
      return {
        async setStatusUnlessTerminal(e, t) {
          return (0, scope.X)(async () => {
            let n = await scope.z.get(scope.M.status, {});
            return n[e] === `done` || n[e] === `failed`
              ? !1
              : (t === `pending` ? delete n[e] : (n[e] = t),
                await scope.z.set(scope.M.status, n),
                !0);
          });
        },
      };
    },
    store_Li_setStatusIfExpected(scope) {
      return {
        async setStatusIfExpected(e, t, n) {
          return (0, scope.X)(async () => {
            let r = await scope.z.get(scope.M.status, {});
            return (
              r[e] === t &&
              (n === `pending` ? delete r[e] : (r[e] = n), await scope.z.set(scope.M.status, r), !0)
            );
          });
        },
      };
    },
    store_Li_setStatusAndResult(scope) {
      return {
        setStatusAndResult(e, t) {
          return (0, scope.X)(async () => {
            let [n, r] = await Promise.all([
              scope.z.get(scope.M.status, {}),
              scope.z.get(scope.M.results, {}),
            ]);
            ((n[(0, scope.Pt)(t.accountId)] = e),
              (r[t.accountId] = { ...t, at: Date.now() }),
              await scope.z.setMany({ [scope.M.status]: n, [scope.M.results]: r }));
          });
        },
      };
    },
    store_Li_setOutcome(scope) {
      return {
        setOutcome(e) {
          return this.setStatusAndResult(e.ok ? `done` : `failed`, e);
        },
      };
    },
    store_Ui_setSchedule(scope, e, t) {
      return {
        async setSchedule(t) {
          (await (0, scope.Vi)({ action: `update-schedule`, schedule: t }), e({ schedule: t }));
        },
      };
    },
    store_Ui_statusOf(scope, e, t) {
      return {
        statusOf(e) {
          let n = t().status[(0, scope.Pt)(e)];
          return n === `done` || n === `failed` || n === `running` || n === `attention`
            ? n
            : `pending`;
        },
      };
    },
    store_Ui_liveOf(scope, e, t) {
      return {
        liveOf(e) {
          return t().live.find((t) => t.accountId === e);
        },
      };
    },
    store_Ui_isQueued(scope, e, t) {
      return {
        isQueued(e) {
          return t().queue.pending.includes(e);
        },
      };
    },
    store_Ui_setStatus(scope, e, t) {
      return {
        async setStatus(e, n) {
          (await (0, scope.Vi)({ action: `set-status`, accountId: e, value: n }), await t().load());
        },
      };
    },
    store_Ui_markDone(scope, e, t) {
      return {
        async markDone(e) {
          (await (0, scope.Vi)({ action: `mark-done`, accountId: e }), await t().load());
        },
      };
    },
  },
});
