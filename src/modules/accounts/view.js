/** src/modules/accounts/view.js: 功能模块实现，保留发布版本的符号以便逐步恢复命名。 */
import { createUiModuleRuntime, createUiScope, initializeUiScope } from '../../shared/ui-scope.js';
import { parseAccountBatch } from './batch-input.js';
export { parseAccountBatch } from './batch-input.js';

// 账号列表、保存、批量 CSV 导入、凭据与归属恢复 — sharedUi published scope.
export let AccountsOverview;
export const sharedUiRuntime = createUiModuleRuntime({
  bindingNames: ['Mm'],
  publish(name, value) {
    switch (name) {
      case 'Mm':
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
      onRefreshBalance: c,
      onToast: l,
    }) {
      let [u, p] = (0, scope.k.useState)(``),
        [m, g] = (0, scope.k.useState)(`全部`),
        y = (0, scope.k.useMemo)(() => new Map(e.map((e) => [e.id, e.name])), [e]),
        b = (0, scope.k.useMemo)(() => new Map(e.map((e) => [e.id, e])), [e]),
        x = n.filter((e) => {
          let t = b.get(e.siteId),
            n = `${e.username} ${e.label ?? ``} ${t?.name ?? ``}`.toLowerCase();
          return u.trim() && !n.includes(u.trim().toLowerCase())
            ? !1
            : m === `未获取余额`
              ? i(e.id) == null
              : m === `需处理`
                ? r(e.id) === `attention`
                : m !== `已完成` || r(e.id) === `done`;
        }),
        S = n.filter((e) => i(e.id) == null).length,
        C = n.filter((e) => r(e.id) === `attention`).length;
      return (0, scope.O.jsxs)(`div`, {
        className: `space-y-4`,
        children: [
          (0, scope.O.jsxs)(`div`, {
            children: [
              (0, scope.O.jsx)(`h1`, {
                className: `text-xl font-bold tracking-tight`,
                children: `账号总览`,
              }),
              (0, scope.O.jsx)(`p`, {
                className: `mt-1 text-[11px] text-ink-800/55 dark:text-ink-100/50`,
                children: `所有站点的账号放进一张表，按余额是否取到、是否需要人工处理来筛。`,
              }),
            ],
          }),
          (0, scope.O.jsxs)(`section`, {
            className: `grid gap-3 sm:grid-cols-2 xl:grid-cols-4`,
            'aria-label': `账号统计`,
            children: [
              (0, scope.O.jsx)(scope.jm, {
                label: `账号总数`,
                value: n.length,
                detail: `${e.length} 个站点`,
                tone: `blue`,
                icon: scope.h,
              }),
              (0, scope.O.jsx)(scope.jm, {
                label: `余额未获取`,
                value: S,
                detail: S ? `点行尾刷新重试` : `全部已获取`,
                tone: `amber`,
                icon: scope.a,
              }),
              (0, scope.O.jsx)(scope.jm, {
                label: `需处理`,
                value: C,
                detail: `等待人工验证`,
                tone: `coral`,
                icon: scope._,
              }),
              (0, scope.O.jsx)(scope.jm, {
                label: `已完成`,
                value: n.filter((e) => r(e.id) === `done`).length,
                detail: `今日已签到`,
                tone: `mint`,
                icon: scope.t,
              }),
            ],
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `flex flex-wrap items-center gap-2`,
            children: [
              (0, scope.O.jsx)(`div`, {
                className: `flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900`,
                role: `tablist`,
                'aria-label': `账号筛选`,
                children: [`全部`, `未获取余额`, `需处理`, `已完成`].map((e) =>
                  (0, scope.O.jsx)(
                    `button`,
                    {
                      type: `button`,
                      'aria-selected': m === e,
                      onClick: () => g(e),
                      className: (0, scope.$)(
                        `h-7 rounded-md px-2.5 text-[11px] font-medium transition-colors`,
                        m === e
                          ? `bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300`
                          : `text-ink-800/55 hover:text-ink-900 dark:text-ink-100/50`,
                      ),
                      children: e,
                    },
                    e,
                  ),
                ),
              }),
              (0, scope.O.jsxs)(`label`, {
                className: `relative min-w-52 flex-1 sm:max-w-xs`,
                children: [
                  (0, scope.O.jsx)(scope.d, {
                    'aria-hidden': `true`,
                    className: `pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-800/35 dark:text-ink-100/35`,
                  }),
                  (0, scope.O.jsx)(`input`, {
                    value: u,
                    onChange: (e) => p(e.target.value),
                    'aria-label': `搜索账号`,
                    placeholder: `搜索账号、标签或站点`,
                    className: `h-9 w-full rounded-lg border border-black/8 bg-white pl-8 pr-3 text-[11px] outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 dark:border-white/10 dark:bg-slate-900`,
                  }),
                ],
              }),
            ],
          }),
          (0, scope.O.jsxs)(`section`, {
            className: `overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950`,
            'aria-label': `账号列表`,
            children: [
              x.map((e) => {
                let t = r(e.id),
                  n = i(e.id),
                  a = b.get(e.siteId),
                  l = a ? (0, scope.ip)(a) : void 0,
                  u = o?.has(e.id) ?? !1;
                return (0, scope.O.jsxs)(
                  `div`,
                  {
                    className: `grid grid-cols-2 items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 md:grid-cols-[minmax(140px,1.4fr)_minmax(120px,1fr)_88px_130px_96px] dark:border-slate-800/70`,
                    children: [
                      (0, scope.O.jsxs)(`span`, {
                        className: `min-w-0 truncate text-xs font-semibold text-ink-900 dark:text-ink-50`,
                        children: [
                          e.label || e.username,
                          e.label &&
                            (0, scope.O.jsx)(`span`, {
                              className: `ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-ink-800/55 dark:bg-slate-800 dark:text-ink-100/50`,
                              children: e.username,
                            }),
                        ],
                      }),
                      (0, scope.O.jsx)(`span`, {
                        className: `min-w-0 truncate text-[11px] text-ink-800/60 dark:text-ink-100/55`,
                        children: y.get(e.siteId) ?? `未知站点`,
                      }),
                      (0, scope.O.jsx)(`span`, {
                        className: (0, scope.$)(
                          `inline-flex h-fit w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold`,
                          scope.Am[t],
                        ),
                        children: scope.km[t],
                      }),
                      (0, scope.O.jsx)(`span`, {
                        className: `text-[11px] font-semibold tabular-nums text-amber-700 dark:text-amber-300`,
                        children: n
                          ? (0, scope.hd)(
                              n.quota,
                              { quotaPerUnit: a?.adapter?.quotaPerUnit, family: l?.family },
                              n.symbol,
                            )
                          : (0, scope.O.jsx)(`span`, {
                              className: `font-medium text-ink-800/45 dark:text-ink-100/40`,
                              children: `未获取`,
                            }),
                      }),
                      (0, scope.O.jsxs)(`span`, {
                        className: `flex items-center justify-end gap-1.5`,
                        children: [
                          (0, scope.O.jsx)(`button`, {
                            type: `button`,
                            'aria-label': `执行 ${e.username}`,
                            title: `执行`,
                            onClick: () => s(e.id),
                            className: `grid size-7 place-items-center rounded-md text-ink-800/50 ring-1 ring-black/5 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-ink-100/50 dark:ring-white/10`,
                            children: (0, scope.O.jsx)(scope.v, { className: `size-3.5` }),
                          }),
                          (0, scope.O.jsx)(`button`, {
                            type: `button`,
                            'aria-label': `刷新 ${e.username} 的余额`,
                            title: `刷新余额`,
                            disabled: u,
                            onClick: () => c(e.id),
                            className: `grid size-7 place-items-center rounded-md text-ink-800/50 ring-1 ring-black/5 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:opacity-45 dark:text-ink-100/50 dark:ring-white/10`,
                            children: (0, scope.O.jsx)(scope.f, {
                              className: (0, scope.$)(`size-3.5`, u && `animate-spin`),
                            }),
                          }),
                        ],
                      }),
                    ],
                  },
                  e.id,
                );
              }),
              !x.length &&
                (0, scope.O.jsxs)(`div`, {
                  className: `flex flex-col items-center gap-2 px-4 py-14 text-center`,
                  children: [
                    (0, scope.O.jsx)(scope.h, {
                      className: `size-6 text-ink-800/25 dark:text-ink-100/20`,
                    }),
                    (0, scope.O.jsx)(`strong`, {
                      className: `text-xs text-ink-800/70 dark:text-ink-100/60`,
                      children: `没有匹配的账号`,
                    }),
                    (0, scope.O.jsx)(`span`, {
                      className: `text-[11px] text-ink-800/45 dark:text-ink-100/40`,
                      children: `换个关键词或筛选条件`,
                    }),
                  ],
                }),
            ],
          }),
          x.length === 0 &&
            n.length > 0 &&
            (0, scope.O.jsxs)(`p`, {
              className: `text-[11px] text-ink-800/45 dark:text-ink-100/40`,
              children: [
                `提示：账号添加入口在总览页顶部工具栏的 `,
                `'`,
                `添加账号`,
                `'`,
                ` 按钮。`,
              ],
            }),
        ],
      });
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
    }
  },
  storeProperties: {},
});

// 账号列表、保存、批量 CSV 导入、凭据与归属恢复 — app published scope.
export let AccountRow,
  AccountEditor,
  AccountImportDialog,
  parsePasswordCsv,
  matchImportedAccounts,
  RecoverAccountsPanel,
  SavedCredentialsPanel;
export const appRuntime = createUiModuleRuntime({
  bindingNames: [
    'Pr',
    'Fr',
    'Ir',
    'Lr',
    'Rr',
    'zr',
    'Br',
    'Ii',
    'Aa',
    'Wa',
    'Ga',
    'Ka',
    'qa',
    'Ja',
    'Ya',
    'Xa',
    'Za',
    'Qa',
    '$a',
    'eo',
    'Ho',
    'Uo',
    'Wo',
    'Go',
    'Ko',
    'qo',
    'Jo',
    'Yo',
    'Xo',
    'Zo',
    'Qo',
    '$o',
    'es',
    'ts',
    'ns',
    'rs',
    'is',
    'as',
    'os',
    'ss',
    'cs',
    'ls',
    'us',
    'ds',
    'fs',
    'ps',
    'ms',
    'hs',
    'gs',
    '_s',
    'vs',
    'ys',
    'bs',
    'xs',
    'Ss',
    'Cs',
    'ws',
    'Qs',
    '$s',
    'ec',
    'tc',
    'Nl',
    'Pl',
    'Fl',
    'Il',
    'Ll',
    'Rl',
    'zl',
    'Ql',
    'iu',
    'au',
  ],
  publish(name, value) {
    switch (name) {
      case 'Aa':
        AccountRow = value;
        break;
      case 'ms':
        AccountEditor = value;
        break;
      case 'bs':
        AccountImportDialog = value;
        break;
      case 'hs':
        parsePasswordCsv = value;
        break;
      case 'gs':
        matchImportedAccounts = value;
        break;
      case 'au':
        RecoverAccountsPanel = value;
        break;
      case 'ls':
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
      return e.map((e) => {
        let t = e;
        if (!Object.prototype.hasOwnProperty.call(t, `checkinMethod`)) return e;
        let { checkinMethod: n, ...r } = t;
        return r;
      });
    };
    scope.Lr = function Lr(e) {
      let t = new Map();
      for (let n of e) {
        let e = n.identity?.userId?.trim();
        if (!e) continue;
        let r = `${n.siteId}\u0000${e}`,
          i = t.get(r) ?? [];
        (i.push(n.id), t.set(r, i));
      }
      return new Set([...t.values()].filter((e) => e.length > 1).flat());
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
      return (
        `loginMethod` in t && !t.loginMethod && delete n.loginMethod,
        `proxyMode` in t && t.proxyMode !== `pool` && (delete n.proxyId, delete n.proxyPinned),
        `proxyMode` in t && t.proxyMode !== `custom` && delete n.customProxy,
        n
      );
    };
    scope.Aa = function Aa({
      account: e,
      status: t,
      result: n,
      siteCheckinMethod: r,
      siteName: i,
      quotaPerUnit: s,
      adapterFamily: c,
      balance: l,
      balanceRefreshing: d = !1,
      liveTask: f,
      ref: g,
      queued: _ = !1,
      proxyLabel: S,
      onRun: C,
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
      selectionMode: L = !1,
      selected: oe = !1,
      selectionDisabled: se = !1,
      selectionDisabledReason: ce,
      onToggleSelect: le,
      proxies: ue = [],
      proxyUsage: z = new Map(),
      siteProxyName: B,
      proxyEndpoint: V,
      onSetProxy: H,
    }) {
      let [fe, ge] = (0, scope.G.useState)(!1),
        [_e, ye] = (0, scope.G.useState)(() => Date.now()),
        [be, xe] = (0, scope.G.useState)(!1),
        Se = t === `pending` || t === `failed`,
        Ce = ce ?? `删除站点后，该账号会保留到待恢复账号`,
        we = t === `running` || t === `attention`,
        K = _ && t === `pending`,
        Te = t === `done`,
        Ee = t !== `done` && t !== `running`,
        De = !P && !we && !_,
        Oe = f?.method || r,
        ke = (0, scope.Ki)(Oe),
        Ae = (0, scope.ea)(n),
        je =
          l?.checkinRewardDay === (0, scope.q)() && l.checkinReward != null
            ? (0, scope.ne)(l.checkinReward, { quotaPerUnit: s, family: c }, l.checkinRewardSymbol)
            : null,
        Me = je ? `+${je}` : (0, scope.Ua)(n?.metrics, s, c),
        Ne = je
          ? `今日签到奖励（余额刷新时从页面签到台账读取）`
          : n?.manual && Me
            ? `手动标记：按已保存余额的总额度差值估算，可能包含同期间其它入账`
            : void 0,
        Pe = { quotaPerUnit: s, family: c },
        Fe = (0, scope.te)(l, n),
        Ie = Fe.balance
          ? {
              text: `余额 ${(0, scope.ae)(Fe.balance.quota, Pe, Fe.balance.symbol)}`,
              age: Fe.fromCheckinResult ? null : (0, scope.ee)(Fe.balance.at),
            }
          : null,
        Le = l?.error,
        Re = f?.steps ?? n?.steps ?? [],
        ze = (0, scope.Or)(l),
        Be = !!(f || n || ze.length > 0),
        Ve = t === `running` || t === `attention`,
        He =
          e.proxyMode === `pool`
            ? (e.proxyId ?? ``)
            : e.proxyMode === `none`
              ? `__direct__`
              : e.proxyMode === `custom`
                ? `__custom__`
                : `__inherit__`,
        Ue = ue.filter((e) => !e.nameOnly).map((e) => z.get(e.id) ?? 0),
        We = Ue.length ? Math.min(...Ue) : 0;
      async function Ke(t) {
        if (H && !be && t !== He) {
          if (t === `__custom__`) ie?.({ ...e, proxyMode: `custom` });
          else {
            xe(!0);
            try {
              t === `__direct__`
                ? await H(e.id, { proxyMode: `none` })
                : t === `__inherit__`
                  ? await H(e.id, { proxyMode: `inherit` })
                  : await H(e.id, { proxyMode: `pool`, proxyId: t, proxyPinned: !0 });
            } finally {
              xe(!1);
            }
          }
        }
      }
      async function qe(t) {
        if (H && !be && e.proxyId) {
          xe(!0);
          try {
            await H(e.id, { proxyMode: `pool`, proxyId: e.proxyId, proxyPinned: t });
          } finally {
            xe(!1);
          }
        }
      }
      return (
        (0, scope.G.useEffect)(() => {
          if (!Ve || !f) return;
          let e = window.setInterval(() => ye(Date.now()), 1e3);
          return () => window.clearInterval(e);
        }, [Ve, f]),
        (0, scope.G.useEffect)(() => {
          Ve ? ge(!0) : t === `done` && ge(!1);
        }, [Ve, t]),
        (0, scope.W.jsxs)(scope.w.div, {
          ref: g,
          'data-account-id': e.id,
          'data-account-status': t,
          layout: `position`,
          initial: { opacity: 0, x: -6 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 6 },
          className: (0, scope.R)(
            `border-l-2 px-3 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50`,
            (0, scope.Wa)(t),
            oe && `bg-rose-50 dark:bg-rose-950/20`,
          ),
          children: [
            (0, scope.W.jsxs)(`div`, {
              className: `flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 sm:flex-nowrap sm:gap-3`,
              children: [
                (0, scope.W.jsxs)(`div`, {
                  'data-account-summary': !0,
                  className: `flex min-w-0 basis-full items-start gap-3 sm:basis-auto sm:flex-1 sm:items-center`,
                  children: [
                    L &&
                      (0, scope.W.jsx)(`button`, {
                        type: `button`,
                        disabled: se,
                        onClick: () => le?.(e.id),
                        'aria-pressed': oe,
                        'aria-label': se
                          ? `${e.label || e.username}：${Ce}`
                          : `${oe ? `取消选择` : `选择`}账号 ${e.label || e.username}`,
                        title: se ? Ce : oe ? `取消选择账号` : `选择账号`,
                        className: (0, scope.R)(
                          `grid size-6 shrink-0 place-items-center rounded-md disabled:cursor-not-allowed disabled:opacity-45`,
                          oe
                            ? `bg-rose-500 text-white`
                            : `bg-slate-100 text-slate-500 dark:bg-slate-900`,
                        ),
                        children: oe
                          ? (0, scope.W.jsx)(scope.o, { className: `size-3.5` })
                          : (0, scope.W.jsx)(scope.ve, { className: `size-4` }),
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
                              children: e.label || e.username,
                            }),
                            n &&
                              (0, scope.W.jsx)(`span`, {
                                className: `shrink-0 text-[10px] tabular-nums text-slate-400`,
                                children: new Date(n.at).toLocaleTimeString(`zh-CN`, {
                                  hour: `2-digit`,
                                  minute: `2-digit`,
                                }),
                              }),
                          ],
                        }),
                        e.label &&
                          (0, scope.W.jsx)(`p`, {
                            className: `truncate text-[11px] text-slate-500`,
                            title: e.username,
                            children: e.username,
                          }),
                        Ve &&
                          (0, scope.W.jsxs)(`p`, {
                            className: (0, scope.R)(
                              `mt-1 flex items-center gap-1.5 text-[11px] font-medium`,
                              t === `attention`
                                ? `text-cyan-700 dark:text-cyan-300`
                                : `text-blue-700 dark:text-blue-300`,
                            ),
                            children: [
                              t === `attention`
                                ? (0, scope.W.jsx)(scope.p, { className: `size-3` })
                                : (0, scope.W.jsx)(scope.u, { className: `size-3 animate-spin` }),
                              (0, scope.W.jsx)(`span`, {
                                className: `truncate`,
                                children: f ? (0, scope.da)(f.stage, Oe) : `正在执行`,
                              }),
                              (0, scope.W.jsx)(`span`, {
                                className: `shrink-0 tabular-nums opacity-65`,
                                children: (0, scope.fa)(_e - (f?.startedAt ?? _e)),
                              }),
                            ],
                          }),
                        !Ve &&
                          n?.message &&
                          (0, scope.W.jsx)(`p`, {
                            className: (0, scope.R)(
                              `mt-0.5 truncate text-[11px]`,
                              t === `failed`
                                ? `text-rose-600 dark:text-rose-400`
                                : `text-slate-500`,
                            ),
                            title: n.message,
                            children: n.message,
                          }),
                        _ &&
                          t === `pending` &&
                          (0, scope.W.jsx)(`p`, {
                            className: `mt-1 text-[11px] text-slate-500`,
                            children: `排队中，等待前一个账号完成`,
                          }),
                        N &&
                          !P &&
                          De &&
                          (0, scope.W.jsx)(`p`, {
                            className: `mt-1 text-[11px] leading-relaxed text-slate-500`,
                            children: `先手动登录，再完成一次签到，最后点「结束学习」；若本站登录成功后即算签到、没有签到按钮，登录后改点「登录即签到」。全程不要点「退出登录」。`,
                          }),
                        (0, scope.W.jsxs)(`div`, {
                          className: `mt-1 flex flex-wrap gap-1`,
                          children: [
                            i &&
                              (0, scope.W.jsxs)(scope.Ma, {
                                tone: `slate`,
                                title: `所属站点：${i}`,
                                children: [(0, scope.W.jsx)(scope.x, { className: `size-3` }), i],
                              }),
                            Me &&
                              (0, scope.W.jsxs)(scope.Ma, {
                                tone: `emerald`,
                                title: Ne,
                                children: [(0, scope.W.jsx)(scope.a, { className: `size-3` }), Me],
                              }),
                            d
                              ? (0, scope.W.jsxs)(scope.Ma, {
                                  tone: `slate`,
                                  children: [
                                    (0, scope.W.jsx)(scope.u, { className: `size-3 animate-spin` }),
                                    `读取余额…`,
                                  ],
                                })
                              : Ie
                                ? (0, scope.W.jsxs)(scope.Ma, {
                                    tone: `blue`,
                                    title: Ie.age ? `余额更新于 ${Ie.age}` : void 0,
                                    children: [
                                      (0, scope.W.jsx)(scope.a, { className: `size-3` }),
                                      Ie.text,
                                      Ie.age &&
                                        (0, scope.W.jsxs)(`span`, {
                                          className: `opacity-60`,
                                          children: [`· `, Ie.age],
                                        }),
                                    ],
                                  })
                                : Le
                                  ? (0, scope.W.jsxs)(scope.Ma, {
                                      tone: `slate`,
                                      title: Le,
                                      children: [
                                        (0, scope.W.jsx)(scope.a, { className: `size-3` }),
                                        `余额未获取`,
                                      ],
                                    })
                                  : null,
                            n?.via === `headless` &&
                              (0, scope.W.jsxs)(scope.Ma, {
                                tone: `emerald`,
                                children: [
                                  (0, scope.W.jsx)(scope.y, { className: `size-3` }),
                                  `API 直连`,
                                ],
                              }),
                            S &&
                              (0, scope.W.jsx)(scope.Ma, {
                                tone:
                                  S.kind === `invalid` || S.kind === `name-only` ? `rose` : `slate`,
                                title: V,
                                children:
                                  S.kind === `direct`
                                    ? `直连`
                                    : S.kind === `invalid`
                                      ? S.label
                                      : S.kind === `name-only`
                                        ? `节点名无出口 · ${S.label}`
                                        : `${S.inherited ? `站点代理` : e.proxyMode === `custom` ? `自定义代理` : e.proxyPinned ? `手动代理` : `自动代理`} · ${S.label}`,
                              }),
                            V &&
                              (0, scope.W.jsx)(scope.Ma, {
                                tone: `slate`,
                                title: `实际使用的代理地址`,
                                children: (0, scope.W.jsx)(`span`, {
                                  className: `max-w-[220px] truncate`,
                                  children: V,
                                }),
                              }),
                          ],
                        }),
                        !L &&
                          H &&
                          (0, scope.W.jsxs)(`div`, {
                            className: `mt-1.5 flex min-w-0 items-center gap-1.5`,
                            children: [
                              (0, scope.W.jsx)(scope.x, {
                                className: `size-3 shrink-0 text-slate-400`,
                              }),
                              (0, scope.W.jsx)(`span`, {
                                className: `shrink-0 text-[10px] text-slate-400`,
                                children: `分配代理`,
                              }),
                              (0, scope.W.jsxs)(`select`, {
                                value: He,
                                disabled: be || Ve || _,
                                onChange: (e) => {
                                  Ke(e.target.value);
                                },
                                'aria-label': `手动设置 ${e.label || e.username} 的代理`,
                                title:
                                  Ve || _
                                    ? `任务执行或排队期间不能更换代理，请先停止任务`
                                    : `选择后立即保存，并固定为手动代理`,
                                className: `min-w-0 max-w-full flex-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10px] text-slate-700 outline-none transition-colors focus:border-blue-400 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200`,
                                children: [
                                  (0, scope.W.jsxs)(`option`, {
                                    value: `__inherit__`,
                                    children: [`跟随站点代理`, B ? ` · ${B}` : ``],
                                  }),
                                  (0, scope.W.jsx)(`option`, {
                                    value: `__direct__`,
                                    children: `不使用代理（直连）`,
                                  }),
                                  (0, scope.W.jsx)(`option`, {
                                    value: `__custom__`,
                                    children: `自定义代理地址（打开账号编辑）`,
                                  }),
                                  ue.map((e) =>
                                    (0, scope.W.jsxs)(
                                      `option`,
                                      {
                                        value: e.id,
                                        disabled: e.nameOnly,
                                        children: [
                                          e.name,
                                          e.nameOnly
                                            ? `（仅名称，无出口）`
                                            : ` · ${(0, scope.de)(e)}://${e.host}:${e.port} · 已用 ${z.get(e.id) ?? 0}${(z.get(e.id) ?? 0) === We ? ` · 推荐` : ``}`,
                                        ],
                                      },
                                      e.id,
                                    ),
                                  ),
                                ],
                              }),
                              e.proxyMode === `pool` &&
                                e.proxyId &&
                                !Ve &&
                                !_ &&
                                (0, scope.W.jsx)(`button`, {
                                  type: `button`,
                                  onClick: () => {
                                    qe(!e.proxyPinned);
                                  },
                                  title: e.proxyPinned
                                    ? `取消手动固定，保留当前节点但允许后续自动分配覆盖`
                                    : `固定当前自动代理，后续自动分配不再覆盖`,
                                  'aria-label': `${e.proxyPinned ? `取消固定` : `固定`} ${e.label || e.username} 当前使用的代理`,
                                  className: `grid size-6 shrink-0 place-items-center rounded-md text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40`,
                                  children: e.proxyPinned
                                    ? (0, scope.W.jsx)(scope.at, { className: `size-3.5` })
                                    : (0, scope.W.jsx)(scope.st, { className: `size-3.5` }),
                                }),
                              be &&
                                (0, scope.W.jsx)(scope.u, {
                                  className: `size-3 shrink-0 animate-spin text-blue-500`,
                                }),
                            ],
                          }),
                      ],
                    }),
                  ],
                }),
                (0, scope.W.jsx)(`button`, {
                  'data-account-status-control': !0,
                  type: `button`,
                  disabled: L || !Se,
                  onClick: () => Se && C(e.id),
                  title: Se ? `执行${ke.noun}` : (0, scope.Ji)(t, Oe),
                  className: (0, scope.R)(`shrink-0 rounded-full`, Se && `cursor-pointer`),
                  children: (0, scope.W.jsx)(scope.Qi, {
                    status: t,
                    evidence: Ae ?? void 0,
                    method: Oe,
                  }),
                }),
                !L &&
                  (0, scope.W.jsxs)(`div`, {
                    'data-account-actions': !0,
                    className: `flex min-w-0 flex-1 flex-wrap items-center justify-end gap-0.5 sm:max-w-[16rem] sm:flex-none`,
                    children: [
                      Se &&
                        (0, scope.W.jsx)(scope.za, {
                          title: `执行${ke.noun}`,
                          accent: !0,
                          onClick: () => C(e.id),
                          children: (0, scope.W.jsx)(scope.m, {
                            className: `size-3.5 fill-current`,
                          }),
                        }),
                      ie &&
                        (0, scope.W.jsx)(scope.za, {
                          title: `编辑账号`,
                          onClick: () => ie(e),
                          children: (0, scope.W.jsx)(scope.he, { className: `size-3.5` }),
                        }),
                      T &&
                        (0, scope.W.jsx)(scope.za, {
                          title: d ? `正在读取余额` : `刷新余额`,
                          onClick: () => !d && T(e.id),
                          children: d
                            ? (0, scope.W.jsx)(scope.u, { className: `size-3.5 animate-spin` })
                            : (0, scope.W.jsx)(scope.a, { className: `size-3.5` }),
                        }),
                      M &&
                        (0, scope.W.jsx)(scope.za, {
                          title: `抓取或更新登录态`,
                          onClick: () => M(e.id),
                          children: (0, scope.W.jsx)(scope.Ge, { className: `size-3.5` }),
                        }),
                      N &&
                        (P || De) &&
                        (0, scope.W.jsx)(scope.za, {
                          label: P ? `结束学习` : `学习本站流程`,
                          title: P
                            ? `结束学习并保存${(P.kind ?? `both`) === `both` ? `登录与签到` : P.kind === `login` ? `登录` : `签到`}流程`
                            : `学习或更新本站共用流程：先手动登录，再完成一次签到，最后点「结束学习」。本站现有和新增账号都使用保存后的流程；每个账号使用自己的凭据与身份，不需要逐个学习`,
                          onClick: () => N(e.id, P ? (P.kind ?? `both`) : `both`),
                          accent: !0,
                          children: (0, scope.W.jsx)(scope.pe, { className: `size-3.5` }),
                        }),
                      P &&
                        F &&
                        (0, scope.W.jsx)(scope.za, {
                          title: `放弃本次学习，不保存流程`,
                          danger: !0,
                          onClick: () => F(e.id),
                          children: (0, scope.W.jsx)(scope.h, { className: `size-3.5` }),
                        }),
                      we &&
                        A &&
                        (0, scope.W.jsx)(scope.za, {
                          title: `停止并重新${ke.noun}`,
                          accent: !0,
                          onClick: () => A(e.id),
                          children: (0, scope.W.jsx)(scope.dt, { className: `size-3.5` }),
                        }),
                      (we || K) &&
                        k &&
                        (0, scope.W.jsx)(scope.za, {
                          title: we ? `停止任务，改回待执行` : `从队列中移除`,
                          onClick: () => k(e.id),
                          children: (0, scope.W.jsx)(scope.me, { className: `size-3.5` }),
                        }),
                      Ee &&
                        j &&
                        (0, scope.W.jsx)(scope.za, {
                          title: `手动标记为${ke.done}`,
                          onClick: () => j(e.id),
                          children: (0, scope.W.jsx)(scope.U, { className: `size-3.5` }),
                        }),
                      Te &&
                        D &&
                        (0, scope.W.jsx)(scope.za, {
                          title: `收回${ke.done}状态，改为${ke.pending}`,
                          accent: !0,
                          onClick: () => D(e.id),
                          children: (0, scope.W.jsx)(scope.lt, { className: `size-3.5` }),
                        }),
                      Be &&
                        (0, scope.W.jsx)(scope.za, {
                          title: fe ? `收起账号详情` : `查看账号详情`,
                          onClick: () => ge((e) => !e),
                          children: (0, scope.W.jsx)(scope.w.span, {
                            animate: { rotate: fe ? 180 : 0 },
                            className: `block`,
                            children: (0, scope.W.jsx)(scope.b, { className: `size-3.5` }),
                          }),
                        }),
                      (0, scope.W.jsx)(scope.za, {
                        title: `删除账号`,
                        danger: !0,
                        onClick: () => E(e.id),
                        children: (0, scope.W.jsx)(scope.v, { className: `size-3.5` }),
                      }),
                    ],
                  }),
              ],
            }),
            P &&
              (0, scope.W.jsxs)(`div`, {
                'data-learning-panel': !0,
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
                      ` 个动作`,
                    ],
                  }),
                  (0, scope.W.jsx)(scope.Fa, { guide: P.guide }),
                  (0, scope.W.jsx)(scope.Ra, {
                    title: `正在记录的动作`,
                    preview: P.preview,
                    testId: `learning-live-steps`,
                  }),
                  (0, scope.W.jsx)(`p`, {
                    className: `text-slate-500`,
                    children: P.guide?.hint ?? (0, scope.Pa)(P.kind),
                  }),
                  P.guide?.warning &&
                    (0, scope.W.jsx)(`p`, {
                      className: `text-amber-700 dark:text-amber-400`,
                      children: P.guide.warning,
                    }),
                  P.loginAsCheckinAvailable &&
                    N &&
                    (0, scope.W.jsx)(`div`, {
                      className: `pt-0.5`,
                      children: (0, scope.W.jsx)(`button`, {
                        type: `button`,
                        'data-learning-login-as-checkin': !0,
                        onClick: () => N(e.id, P.kind ?? `both`, { loginAsCheckin: !0 }),
                        title: `本站是「登录即签到」时点这里：登录成功后即算完成签到，不再需要点签到按钮。保存后自动签到按登录即签到收尾`,
                        className: `rounded-md bg-violet-600 px-2 py-1 text-[11px] font-medium text-white transition-colors hover:bg-violet-700`,
                        children: `登录即签到（没有签到按钮）`,
                      }),
                    }),
                ],
              }),
            !P &&
              (0, scope.W.jsx)(scope.Ra, {
                title: `这次学到的动作`,
                preview: I,
                testId: `learning-last-steps`,
                tone: `slate`,
              }),
            !P &&
              re &&
              re.lines.length > 0 &&
              (0, scope.W.jsxs)(`div`, {
                'data-learning-notice': re.verdict,
                className: `mt-1 rounded-lg bg-slate-100 px-2 py-1.5 text-[11px] leading-relaxed dark:bg-slate-800/70`,
                children: [
                  (0, scope.W.jsx)(`p`, {
                    className: `mb-1 font-medium text-slate-700 dark:text-slate-200`,
                    children: (0, scope.ma)(re.verdict),
                  }),
                  (0, scope.W.jsx)(`ul`, {
                    className: `space-y-0.5`,
                    children: re.lines.map((e, t) =>
                      (0, scope.W.jsx)(
                        `li`,
                        {
                          className: `break-words text-slate-600 dark:text-slate-300`,
                          children: e.text,
                        },
                        t,
                      ),
                    ),
                  }),
                ],
              }),
            (0, scope.W.jsx)(scope.O, {
              initial: !1,
              children:
                !L &&
                fe &&
                Be &&
                (0, scope.W.jsx)(scope.w.div, {
                  initial: { height: 0, opacity: 0 },
                  animate: { height: `auto`, opacity: 1 },
                  exit: { height: 0, opacity: 0 },
                  className: `mt-3 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60`,
                  children: (0, scope.W.jsxs)(`div`, {
                    className: `space-y-2 px-3 py-2.5`,
                    children: [
                      n &&
                        !n.ok &&
                        (0, scope.W.jsx)(scope.aa, {
                          code: (0, scope.ua)(n.message, n.steps).code,
                        }),
                      je &&
                        (0, scope.W.jsxs)(`p`, {
                          className: `text-[11px] text-emerald-700 dark:text-emerald-300`,
                          children: [`余额刷新读到今日签到奖励 +`, je, `（页面台账）`],
                        }),
                      n?.ok &&
                        (0, scope.ta)(Ae, n) &&
                        (0, scope.W.jsx)(`p`, {
                          className: `text-[11px] text-slate-500`,
                          children: (0, scope.ta)(Ae, n),
                        }),
                      ze.length > 0 &&
                        (0, scope.W.jsx)(scope.Ba, { rows: ze, quotaPerUnit: s, family: c }),
                      Re.length > 0 &&
                        (0, scope.W.jsx)(`ol`, {
                          className: (0, scope.R)(
                            `space-y-1.5`,
                            ze.length > 0 && `border-t border-slate-200 pt-2 dark:border-slate-700`,
                          ),
                          children: Re.map((e, t) =>
                            (0, scope.W.jsxs)(
                              `li`,
                              {
                                className: `flex items-start gap-2 text-[11px] leading-5 text-slate-600 dark:text-slate-300`,
                                children: [
                                  (0, scope.W.jsx)(`span`, {
                                    className: (0, scope.R)(
                                      `mt-1.5 size-1.5 shrink-0 rounded-full`,
                                      t === Re.length - 1 && Ve
                                        ? `bg-blue-500`
                                        : `bg-slate-300 dark:bg-slate-600`,
                                    ),
                                  }),
                                  (0, scope.W.jsx)(`span`, { children: e }),
                                ],
                              },
                              `${t}-${e}`,
                            ),
                          ),
                        }),
                    ],
                  }),
                }),
            }),
          ],
        })
      );
    };
    scope.Wa = function Wa(e) {
      return e === `done`
        ? `border-l-emerald-500`
        : e === `running`
          ? `border-l-blue-500`
          : e === `attention`
            ? `border-l-cyan-500`
            : e === `failed`
              ? `border-l-rose-500`
              : `border-l-amber-400`;
    };
    scope.Ka = function Ka(e, t, n) {
      return e
        ? { value: e, source: `账号级` }
        : t
          ? { value: t, source: `站点默认` }
          : { value: n, source: `内置默认` };
    };
    scope.qa = function qa(e) {
      let t = !!e.password,
        n = !!e.githubUsername?.trim() && !!e.githubPassword;
      return t === n ? null : n ? `github` : `form`;
    };
    scope.Ja = function Ja(e, t) {
      return {
        loginMethod: e.loginMethod || `auto`,
        loginMethodSource: !e.loginMethod || e.loginMethod === `auto` ? `当前页面` : `账号级`,
        checkinMethod: t.checkin?.method || `auto`,
      };
    };
    scope.Ya = function Ya(e) {
      switch (e) {
        case `token`:
          return { password: !1, token: !0, sessionCounts: !0, github: !1, passkey: !1 };
        case `github`:
          return { password: !1, token: !1, sessionCounts: !1, github: !0, passkey: !1 };
        case `passkey`:
          return { password: !1, token: !1, sessionCounts: !1, github: !1, passkey: !0 };
        case `oauth`:
        case `manual`:
          return { password: !1, token: !1, sessionCounts: !1, github: !1, passkey: !1 };
        case `form`:
          return { password: !0, token: !1, sessionCounts: !1, github: !1, passkey: !1 };
        case `auto`:
          return { password: !0, token: !1, sessionCounts: !0, github: !0, passkey: !1 };
      }
    };
    scope.Xa = function Xa(e) {
      let t = (0, scope.Qa)(e.loginUrl);
      if (!t) return [];
      let n = (0, scope.$a)(e.favicon, t),
        r = (0, scope.Za)(t.href),
        i = (0, scope.It)(t.href),
        a = [];
      return (r && a.push(r), n && n !== i && a.push(n), i && a.push(i), [...new Set(a)]);
    };
    scope.Za = function Za(e) {
      try {
        let t = globalThis.chrome?.runtime;
        if (!t?.getURL) return ``;
        let n = new URL(t.getURL(`/_favicon/`));
        return (
          n.searchParams.set(`pageUrl`, e),
          n.searchParams.set(`size`, `32`),
          n.searchParams.set(`forceEmptyDefaultFavicon`, `1`),
          n.searchParams.set(`allowGoogleServerFallback`, `0`),
          n.href
        );
      } catch {
        return ``;
      }
    };
    scope.Qa = function Qa(e) {
      try {
        let t = new URL(e.trim()),
          n = t.hostname === `localhost` || t.hostname === `127.0.0.1` || t.hostname === `[::1]`;
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
        let e = new URL(n, t);
        return (e.protocol !== `https:` &&
          !(e.protocol === `http:` && (0, scope.eo)(e.hostname))) ||
          (t.protocol === `https:` && e.protocol !== `https:`) ||
          (0, scope.to)(e)
          ? null
          : e.href;
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
      return `${e}:${t.trim().toLowerCase()}\u0000${n}`;
    };
    scope.Wo = function Wo(e, t) {
      if (t === `github`) {
        let t = e.githubUsername?.trim() ?? ``,
          n = e.githubPassword ?? ``;
        return t && n ? { username: t, password: n } : null;
      }
      let n = e.username.trim();
      return n && e.password ? { username: n, password: e.password } : null;
    };
    scope.Go = function Go(e) {
      return e.kind !== `site` && e.kind !== `github`
        ? `凭据类型无效`
        : e.username.trim()
          ? e.password
            ? null
            : `密码不能为空`
          : `用户名不能为空`;
    };
    scope.Ko = function Ko(e, t) {
      let n = e.find((e) => e.id === t);
      if (!n) return [t];
      let r = (0, scope.qo)(n.loginUrl);
      return r
        ? e
            .filter((e) => e.id !== t && (0, scope.qo)(e.loginUrl) === r)
            .map((e) => e.id)
            .concat(t)
        : [t];
    };
    scope.qo = function qo(e) {
      try {
        return new URL(e).hostname.toLowerCase();
      } catch {
        return ``;
      }
    };
    scope.Jo = function Jo(e, t, n = {}) {
      let r = [],
        i = new Map();
      for (let a = e.length - 1; a >= 0; --a) {
        let o = e[a];
        if (o.id === n.excludeAccountId || (n.allowedSiteIds && !n.allowedSiteIds.has(o.siteId)))
          continue;
        let s = (0, scope.Wo)(o, t);
        if (!s) continue;
        let c = (0, scope.Uo)(t, s.username, s.password),
          l = i.get(c);
        if (l) {
          ((l.accountCount = (l.accountCount ?? 1) + 1),
            (l.siteId ||= o.siteId),
            l.label === l.username && o.label?.trim() && (l.label = o.label.trim()));
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
            accountCount: 1,
          },
          d = n.siteNameOf?.(o.siteId);
        (d && (u.siteName = d), i.set(c, u), r.push(u));
      }
      return r;
    };
    scope.Yo = function Yo(e, t) {
      let n = e.map((e) => ({ ...e })),
        r = new Map(n.map((e) => [(0, scope.Uo)(e.kind, e.username, e.password), e]));
      for (let e of t) {
        let t = (0, scope.Uo)(e.kind, e.username, e.password),
          i = r.get(t);
        if (i) {
          ((i.presetId = e.id),
            e.label?.trim() && i.label === i.username && (i.label = e.label.trim()),
            e.updatedAt > i.updatedAt && (i.updatedAt = e.updatedAt),
            e.lastUsedAt &&
              (!i.lastUsedAt || e.lastUsedAt > i.lastUsedAt) &&
              (i.lastUsedAt = e.lastUsedAt),
            (i.useCount = Math.max(i.useCount ?? 0, e.useCount ?? 0)));
          continue;
        }
        let a = {
          id: e.id,
          kind: e.kind,
          username: e.username,
          password: e.password,
          label: e.label?.trim() || e.username,
          origin: `manual`,
          presetId: e.id,
          siteId: e.siteId,
          updatedAt: e.updatedAt,
          lastUsedAt: e.lastUsedAt,
          useCount: e.useCount,
        };
        (r.set(t, a), n.push(a));
      }
      return n;
    };
    scope.Xo = function Xo(e, t) {
      return [...e].sort((e, n) => {
        let r = t ? e.siteId === t : !1;
        if (r !== (t ? n.siteId === t : !1)) return r ? -1 : 1;
        let i = Math.max(e.lastUsedAt ?? 0, e.updatedAt ?? 0),
          a = Math.max(n.lastUsedAt ?? 0, n.updatedAt ?? 0);
        if (i !== a) return a - i;
        let o = e.label.localeCompare(n.label);
        return o === 0 ? (e.id < n.id ? -1 : +(e.id > n.id)) : o;
      });
    };
    scope.Zo = function Zo(e, t) {
      let n = (0, scope.Uo)(t.kind, t.username, t.password);
      return e
        .filter((e) => e.id !== t.id && (0, scope.Uo)(e.kind, e.username, e.password) !== n)
        .concat(t);
    };
    scope.Qo = function Qo(e, t, n = Date.now()) {
      return e.map((e) =>
        e.id === t ? { ...e, lastUsedAt: n, useCount: (e.useCount ?? 0) + 1 } : e,
      );
    };
    scope.$o = function $o(e, t) {
      return e.filter((e) => e.id !== t);
    };
    scope.es = function es(e) {
      if (!Array.isArray(e)) return [];
      let t = new Set(),
        n = new Map(),
        r = [];
      for (let i of e) {
        if (!i || typeof i != `object`) continue;
        let e = i,
          a = typeof e.id == `string` ? e.id : ``,
          o = e.kind === `site` || e.kind === `github` ? e.kind : null,
          s = typeof e.username == `string` ? e.username.trim() : ``,
          c = typeof e.password == `string` ? e.password : ``;
        if (!a || !o || !s || !c || t.has(a)) continue;
        t.add(a);
        let l = { id: a, kind: o, username: s, password: c, updatedAt: (0, scope.ts)(e.updatedAt) };
        (typeof e.label == `string` && e.label.trim() && (l.label = e.label.trim()),
          typeof e.siteId == `string` && e.siteId && (l.siteId = e.siteId));
        let u = (0, scope.ts)(e.lastUsedAt);
        u > 0 && (l.lastUsedAt = u);
        let d =
          typeof e.useCount == `number` && Number.isFinite(e.useCount)
            ? Math.max(0, Math.floor(e.useCount))
            : 0;
        (d > 0 && (l.useCount = d), n.set((0, scope.Uo)(o, s, c), l), r.push(l));
      }
      return r
        .filter((e) => n.get((0, scope.Uo)(e.kind, e.username, e.password)) === e)
        .sort((e, t) => t.updatedAt - e.updatedAt || (e.id < t.id ? -1 : +(e.id > t.id)))
        .slice(0, 200);
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
      let t = (t, n) => {
        n === `local` && `credentialPresets` in t && e((0, scope.es)(t[scope.ns]?.newValue));
      };
      return (
        chrome.storage.onChanged.addListener(t),
        () => chrome.storage.onChanged.removeListener(t)
      );
    };
    scope.os = function os() {
      let [e, t] = (0, scope.G.useState)([]),
        n = (0, scope.Ui)((e) => e.accounts),
        r = (0, scope.Ui)((e) => e.sites);
      (0, scope.G.useEffect)(() => {
        if (typeof chrome > `u` || !chrome.storage?.local) return;
        let e = !0;
        (0, scope.rs)().then((n) => {
          e && t(n);
        });
        let n = (0, scope.as)((n) => {
          e && t(n);
        });
        return () => {
          ((e = !1), n());
        };
      }, []);
      async function i(e) {
        (t(e), typeof chrome < `u` && chrome.storage?.local && (await (0, scope.is)(e)));
      }
      let a = (e) => r.find((t) => t.id === e)?.name;
      return {
        presets: e,
        async saveAsPreset(t) {
          let n = (0, scope.Go)(t);
          if (n) return n;
          let r = Date.now();
          return (
            await i(
              (0, scope.Zo)(e, {
                id: (0, scope.Ft)(`cp`),
                kind: t.kind,
                username: t.username.trim(),
                password: t.password,
                updatedAt: r,
                ...(t.label?.trim() ? { label: t.label.trim() } : {}),
                ...(t.siteId ? { siteId: t.siteId } : {}),
              }),
            ),
            null
          );
        },
        async renamePreset(t, n) {
          let r = e.map((e) =>
            e.id === t
              ? { ...e, ...(n.trim() ? { label: n.trim() } : {}), updatedAt: Date.now() }
              : e,
          );
          return n.trim() === ``
            ? i(
                r.map((e) => {
                  if (e.id !== t) return e;
                  let { label: n, ...r } = e;
                  return r;
                }),
              )
            : i(r);
        },
        async deletePreset(t) {
          return i((0, scope.$o)(e, t));
        },
        markUsed(t) {
          t.presetId && e.some((e) => e.id === t.presetId) && i((0, scope.Qo)(e, t.presetId));
        },
        optionsFor(t, i, o) {
          let s = t === `site` ? new Set((0, scope.Ko)(r, i)) : void 0;
          return (0, scope.Xo)(
            (0, scope.Yo)(
              (0, scope.Jo)(n, t, {
                excludeAccountId: o?.excludeAccountId,
                allowedSiteIds: s,
                siteNameOf: a,
              }),
              e.filter((e) => e.kind === t),
            ),
            i,
          );
        },
      };
    };
    scope.cs = function cs(e) {
      if (!e) return `—`;
      try {
        return new Date(e).toLocaleString(`zh-CN`, {
          month: `numeric`,
          day: `numeric`,
          hour: `2-digit`,
          minute: `2-digit`,
        });
      } catch {
        return `—`;
      }
    };
    scope.ls = function ls({ open: e, onClose: t }) {
      let { presets: n, saveAsPreset: r, renamePreset: i, deletePreset: a } = (0, scope.os)(),
        o = (0, scope.Ui)((e) => e.sites),
        [s, c] = (0, scope.G.useState)(new Set()),
        [l, u] = (0, scope.G.useState)(``),
        [d, f] = (0, scope.G.useState)(``),
        [p, m] = (0, scope.G.useState)(``),
        h = (0, scope.G.useRef)(null),
        [g, y] = (0, scope.G.useState)(`site`),
        [b, x] = (0, scope.G.useState)(``),
        [S, C] = (0, scope.G.useState)(``),
        [w, E] = (0, scope.G.useState)(``),
        [D, O] = (0, scope.G.useState)(``),
        [k, A] = (0, scope.G.useState)(!1),
        [M, N] = (0, scope.G.useState)(null);
      ((0, scope.G.useEffect)(
        () => () => {
          h.current && clearTimeout(h.current);
        },
        [],
      ),
        (0, scope.G.useEffect)(() => {
          e || (c(new Set()), u(``), f(``));
        }, [e]));
      let P = scope.ss.map((e) => ({
        ...e,
        presets: n.filter((t) => t.kind === e.kind).sort((e, t) => t.updatedAt - e.updatedAt),
      }));
      function ee(e) {
        c((t) => {
          let n = new Set(t);
          return (n.has(e) ? n.delete(e) : n.add(e), n);
        });
      }
      function te(e) {
        l === e
          ? (h.current && clearTimeout(h.current), u(``), a(e))
          : (u(e),
            h.current && clearTimeout(h.current),
            (h.current = setTimeout(() => u(``), 3e3)));
      }
      function F(e) {
        (f(e.id), m(e.label ?? ``));
      }
      async function ne(e) {
        (await i(e, p), f(``));
      }
      function re() {
        (f(``), m(``));
      }
      async function I() {
        if (k) return;
        (A(!0), N(null));
        let e = await r({
          kind: g,
          username: b,
          password: S,
          ...(w.trim() ? { label: w } : {}),
          ...(g === `site` && D ? { siteId: D } : {}),
        });
        (A(!1),
          e
            ? N({ type: `error`, text: e })
            : (x(``), C(``), E(``), N({ type: `ok`, text: `已保存到常用凭据` })));
      }
      return (0, scope.W.jsx)(scope.uo, {
        open: e,
        title: `管理常用凭据`,
        onClose: t,
        wide: !0,
        children: (0, scope.W.jsxs)(`div`, {
          className: `space-y-4`,
          children: [
            n.length === 0 &&
              (0, scope.W.jsxs)(`div`, {
                className: `rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center dark:border-ink-700`,
                children: [
                  (0, scope.W.jsx)(scope.Ge, {
                    className: `mx-auto size-6 text-ink-800/25 dark:text-ink-100/20`,
                  }),
                  (0, scope.W.jsx)(`p`, {
                    className: `mt-2 text-xs font-medium text-ink-800/65 dark:text-ink-100/55`,
                    children: `还没有保存的常用凭据`,
                  }),
                  (0, scope.W.jsx)(`p`, {
                    className: `mt-1 text-[11px] text-ink-800/40 dark:text-ink-100/30`,
                    children: `在账号表单里点「将当前输入存为常用」，或直接用下面的表单新增`,
                  }),
                ],
              }),
            P.map(
              (e) =>
                e.presets.length > 0 &&
                (0, scope.W.jsxs)(
                  `section`,
                  {
                    className: `space-y-1.5`,
                    children: [
                      (0, scope.W.jsx)(`h4`, {
                        className: `text-[11px] font-semibold uppercase tracking-wide text-ink-800/50 dark:text-ink-100/40`,
                        children: e.title,
                      }),
                      e.presets.map((e) => {
                        let t = e.label || e.username,
                          n = s.has(e.id),
                          r = l === e.id,
                          i = d === e.id;
                        return (0, scope.W.jsxs)(
                          `div`,
                          {
                            'data-kind': e.kind,
                            className: `rounded-lg bg-ink-50 p-3 ring-1 ring-black/5 dark:bg-ink-900 dark:ring-white/10`,
                            children: [
                              (0, scope.W.jsxs)(`div`, {
                                className: `flex items-center gap-2`,
                                children: [
                                  (0, scope.W.jsx)(`span`, {
                                    className: `shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${e.kind === `github` ? `bg-purple-500/10 text-purple-700 dark:text-purple-300` : `bg-sky-500/10 text-sky-700 dark:text-sky-300`}`,
                                    children: e.kind === `github` ? `GitHub` : `站点`,
                                  }),
                                  i
                                    ? (0, scope.W.jsxs)(`div`, {
                                        className: `flex min-w-0 flex-1 items-center gap-1`,
                                        children: [
                                          (0, scope.W.jsx)(`input`, {
                                            className: `min-w-0 flex-1 rounded-md bg-white px-2 py-1 text-xs text-ink-900 outline-none ring-1 ring-black/10 dark:bg-ink-800 dark:text-ink-50 dark:ring-white/10`,
                                            value: p,
                                            onChange: (e) => m(e.target.value),
                                            placeholder: `备注（留空清除）`,
                                          }),
                                          (0, scope.W.jsx)(`button`, {
                                            type: `button`,
                                            'aria-label': `确认改名`,
                                            onClick: () => void ne(e.id),
                                            className: `shrink-0 rounded-md px-1.5 py-1 text-[11px] font-semibold text-brand-600 hover:bg-brand-500/10 dark:text-brand-400`,
                                            children: `保存`,
                                          }),
                                          (0, scope.W.jsx)(`button`, {
                                            type: `button`,
                                            'aria-label': `取消改名`,
                                            onClick: re,
                                            className: `shrink-0 rounded-md px-1.5 py-1 text-[11px] text-ink-800/50 hover:bg-black/5 dark:text-ink-100/50 dark:hover:bg-white/10`,
                                            children: `取消`,
                                          }),
                                        ],
                                      })
                                    : (0, scope.W.jsxs)(`div`, {
                                        className: `min-w-0 flex-1`,
                                        children: [
                                          (0, scope.W.jsx)(`span`, {
                                            className: `block truncate text-xs font-medium text-ink-900 dark:text-ink-50`,
                                            children: t,
                                          }),
                                          (0, scope.W.jsx)(`span`, {
                                            className: `block truncate text-[11px] text-ink-800/45 dark:text-ink-100/35`,
                                            children: e.username,
                                          }),
                                        ],
                                      }),
                                  (0, scope.W.jsx)(`time`, {
                                    className: `shrink-0 text-[10px] tabular-nums text-ink-800/40 dark:text-ink-100/30`,
                                    children: (0, scope.cs)(e.updatedAt),
                                  }),
                                  !i &&
                                    (0, scope.W.jsx)(`button`, {
                                      type: `button`,
                                      'aria-label': `改名 ${t}`,
                                      onClick: () => F(e),
                                      className: `shrink-0 rounded-md p-1.5 text-ink-800/50 hover:bg-black/5 dark:text-ink-100/50 dark:hover:bg-white/10`,
                                      children: (0, scope.W.jsx)(scope.he, {
                                        className: `size-3.5`,
                                      }),
                                    }),
                                  (0, scope.W.jsx)(`button`, {
                                    type: `button`,
                                    'aria-label': r ? `确认删除 ${t}` : `删除 ${t}`,
                                    onClick: () => te(e.id),
                                    className: r
                                      ? `shrink-0 rounded-md bg-rose-500 px-2 py-1 text-[10px] font-semibold text-white`
                                      : `shrink-0 rounded-md p-1.5 text-rose-500 hover:bg-rose-500/10`,
                                    children: r
                                      ? `确认删除`
                                      : (0, scope.W.jsx)(scope.v, { className: `size-3.5` }),
                                  }),
                                ],
                              }),
                              (0, scope.W.jsxs)(`div`, {
                                className: `mt-1.5 flex items-center gap-2`,
                                children: [
                                  (0, scope.W.jsx)(`input`, {
                                    readOnly: !0,
                                    type: n ? `text` : `password`,
                                    value: e.password,
                                    'aria-label': `${t} 的密码`,
                                    className: `min-w-0 flex-1 rounded-md bg-white px-2 py-1 font-mono text-[11px] text-ink-800/70 outline-none ring-1 ring-black/5 dark:bg-ink-800 dark:text-ink-100/60 dark:ring-white/10`,
                                  }),
                                  (0, scope.W.jsx)(`button`, {
                                    type: `button`,
                                    onClick: () => ee(e.id),
                                    'aria-label': n ? `隐藏 ${t} 的密码` : `显示 ${t} 的密码`,
                                    className: `shrink-0 rounded-md p-1.5 text-ink-800/50 hover:bg-black/5 dark:text-ink-100/50 dark:hover:bg-white/10`,
                                    children: n
                                      ? (0, scope.W.jsx)(scope.T, { className: `size-3.5` })
                                      : (0, scope.W.jsx)(scope.j, { className: `size-3.5` }),
                                  }),
                                ],
                              }),
                            ],
                          },
                          e.id,
                        );
                      }),
                    ],
                  },
                  e.kind,
                ),
            ),
            (0, scope.W.jsxs)(`section`, {
              className: `rounded-xl bg-ink-50 p-3 ring-1 ring-black/5 dark:bg-ink-900/60 dark:ring-white/10`,
              children: [
                (0, scope.W.jsxs)(`p`, {
                  className: `flex items-center gap-1.5 text-xs font-semibold text-ink-900 dark:text-ink-50`,
                  children: [(0, scope.W.jsx)(scope._, { className: `size-3.5` }), `新增凭据`],
                }),
                (0, scope.W.jsxs)(`div`, {
                  className: `mt-2 space-y-2`,
                  children: [
                    (0, scope.W.jsx)(scope.Q, {
                      label: `类型`,
                      children: (0, scope.W.jsxs)(`select`, {
                        className: scope.$,
                        value: g,
                        onChange: (e) => y(e.target.value),
                        children: [
                          (0, scope.W.jsx)(`option`, { value: `site`, children: `站点账号` }),
                          (0, scope.W.jsx)(`option`, { value: `github`, children: `GitHub 账号` }),
                        ],
                      }),
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `grid grid-cols-2 gap-2`,
                      children: [
                        (0, scope.W.jsx)(scope.Q, {
                          label: `用户名`,
                          children: (0, scope.W.jsx)(`input`, {
                            className: scope.$,
                            value: b,
                            onChange: (e) => x(e.target.value),
                            placeholder: `用户名`,
                          }),
                        }),
                        (0, scope.W.jsx)(scope.Q, {
                          label: `密码`,
                          hint: `仅保存在本机浏览器`,
                          children: (0, scope.W.jsx)(`input`, {
                            type: `password`,
                            className: scope.$,
                            value: S,
                            onChange: (e) => C(e.target.value),
                            placeholder: `密码`,
                          }),
                        }),
                      ],
                    }),
                    (0, scope.W.jsx)(scope.Q, {
                      label: `备注`,
                      hint: `可选，用于区分同站多账号`,
                      children: (0, scope.W.jsx)(`input`, {
                        className: scope.$,
                        value: w,
                        onChange: (e) => E(e.target.value),
                        placeholder: `备注（可选）`,
                      }),
                    }),
                    g === `site` &&
                      (0, scope.W.jsx)(scope.Q, {
                        label: `来源站点`,
                        hint: `可选；选了之后会在这个站点的候选里排最前`,
                        children: (0, scope.W.jsxs)(`select`, {
                          className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                          value: D,
                          onChange: (e) => O(e.target.value),
                          children: [
                            (0, scope.W.jsx)(`option`, {
                              value: ``,
                              children: `不指定（任意站点可用）`,
                            }),
                            o.map((e) =>
                              (0, scope.W.jsx)(`option`, { value: e.id, children: e.name }, e.id),
                            ),
                          ],
                        }),
                      }),
                    (0, scope.W.jsx)(`button`, {
                      type: `button`,
                      className: scope.fo,
                      disabled: k,
                      onClick: () => void I(),
                      children: k ? `保存中…` : `保存凭据`,
                    }),
                    M &&
                      (0, scope.W.jsx)(`p`, {
                        role: `status`,
                        className: `text-[11px] ${M.type === `error` ? `text-rose-600 dark:text-rose-400` : `text-emerald-600 dark:text-emerald-400`}`,
                        children: M.text,
                      }),
                  ],
                }),
              ],
            }),
          ],
        }),
      });
    };
    scope.us = function us(e) {
      let t = [e.label || e.username];
      return (
        e.siteName && t.push(` · ${e.siteName}`),
        (e.accountCount ?? 1) > 1 && t.push(`（${e.accountCount} 个账号）`),
        t.join(``)
      );
    };
    scope.ds = function ds({
      kind: e,
      siteId: t,
      excludeAccountId: n,
      username: r,
      password: i,
      disabled: a,
      onPick: o,
    }) {
      let { optionsFor: s, markUsed: c, saveAsPreset: l } = (0, scope.os)(),
        u = s(e, t, { excludeAccountId: n }),
        [d, f] = (0, scope.G.useState)(``),
        [p, m] = (0, scope.G.useState)(``),
        [h, g] = (0, scope.G.useState)(!1),
        [_, v] = (0, scope.G.useState)(null),
        [y, b] = (0, scope.G.useState)(!1),
        x = (0, scope.G.useRef)(null);
      (0, scope.G.useEffect)(
        () => () => {
          x.current && clearTimeout(x.current);
        },
        [],
      );
      function S(e) {
        (x.current && clearTimeout(x.current), m(e), (x.current = setTimeout(() => m(``), 2600)));
      }
      function C(e) {
        if ((f(``), !e)) return;
        let t = u.find((t) => t.id === e);
        t &&
          (o({ username: t.username, password: t.password }),
          c(t),
          S(`已填入 ${t.label || t.username}`));
      }
      async function w() {
        if (h) return;
        (g(!0), v(null));
        let n = await l({ kind: e, username: r, password: i, siteId: t });
        (g(!1),
          v(
            n ? { type: `error`, text: n } : { type: `ok`, text: `已保存，之后可直接在下拉中选择` },
          ));
      }
      let T = e === `github` ? `选择已保存的 GitHub 账号` : `选择已保存的站点账号`,
        E = r.trim().length > 0 && i.length > 0;
      return (0, scope.W.jsxs)(`div`, {
        className: `rounded-xl bg-ink-50 p-3 ring-1 ring-black/5 dark:bg-ink-900/60 dark:ring-white/10`,
        children: [
          (0, scope.W.jsx)(scope.Q, {
            label: T,
            children: (0, scope.W.jsxs)(`select`, {
              className: scope.$,
              value: d,
              disabled: a || u.length === 0,
              onChange: (e) => C(e.target.value),
              children: [
                (0, scope.W.jsx)(`option`, { value: ``, children: `手动输入` }),
                u.map((e) =>
                  (0, scope.W.jsx)(`option`, { value: e.id, children: (0, scope.us)(e) }, e.id),
                ),
              ],
            }),
          }),
          u.length === 0 &&
            (0, scope.W.jsx)(`p`, {
              className: `mt-1.5 text-[11px] leading-relaxed text-ink-800/40 dark:text-ink-100/30`,
              children:
                e === `github`
                  ? `还没有可选的 GitHub 凭据：保存过的 GitHub 账号或「存为常用」的凭据会自动出现在这里`
                  : `还没有可选的站点凭据：本站（或同一登录主机）已保存的账号与常用凭据会自动出现在这里`,
            }),
          p &&
            (0, scope.W.jsx)(`p`, {
              role: `status`,
              className: `mt-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400`,
              children: p,
            }),
          (0, scope.W.jsxs)(`div`, {
            className: `mt-2 flex flex-wrap items-center gap-x-3 gap-y-1`,
            children: [
              (0, scope.W.jsx)(`button`, {
                type: `button`,
                onClick: () => void w(),
                disabled: a || h || !E,
                className: `text-[11px] font-medium text-brand-600 hover:underline disabled:cursor-default disabled:opacity-40 disabled:no-underline dark:text-brand-400`,
                children: h ? `保存中…` : `将当前输入存为常用`,
              }),
              (0, scope.W.jsx)(`button`, {
                type: `button`,
                onClick: () => b(!0),
                disabled: a,
                className: `text-[11px] font-medium text-brand-600 hover:underline disabled:opacity-40 dark:text-brand-400`,
                children: `管理常用凭据…`,
              }),
            ],
          }),
          _ &&
            (0, scope.W.jsx)(`p`, {
              role: `status`,
              className: `mt-1 text-[11px] ${_.type === `error` ? `text-rose-600 dark:text-rose-400` : `text-emerald-600 dark:text-emerald-400`}`,
              children: _.text,
            }),
          (0, scope.W.jsx)(scope.ls, { open: y, onClose: () => b(!1) }),
        ],
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
      onSubmitMany,
    }) {
      let [s, c] = (0, scope.G.useState)(r ?? t[0]?.id ?? ``),
        [l, u] = (0, scope.G.useState)(``),
        [d, f] = (0, scope.G.useState)(``),
        [p, m] = (0, scope.G.useState)(``),
        [githubAccountName, setGithubAccountName] = (0, scope.G.useState)(``),
        [loginEntry, setLoginEntry] = (0, scope.G.useState)(null),
        [h, g] = (0, scope.G.useState)(``),
        [_, v] = (0, scope.G.useState)(scope.ps),
        [y, b] = (0, scope.G.useState)(``),
        [x, S] = (0, scope.G.useState)(``),
        [C, T] = (0, scope.G.useState)(!1),
        [E, D] = (0, scope.G.useState)(`inherit`),
        [O, k] = (0, scope.G.useState)(``),
        [A, j] = (0, scope.G.useState)(`http`),
        [M, N] = (0, scope.G.useState)(``),
        [P, ee] = (0, scope.G.useState)(``),
        [te, F] = (0, scope.G.useState)(``),
        [ne, re] = (0, scope.G.useState)(``),
        [I, ie] = (0, scope.G.useState)(!1),
        [L, ae] = (0, scope.G.useState)(``),
        [loginProbe, setLoginProbe] = (0, scope.G.useState)({
          status: `idle`,
          methods: [],
          entries: [],
        }),
        [probeRetry, setProbeRetry] = (0, scope.G.useState)(0),
        probeGeneration = (0, scope.G.useRef)(0),
        probeSiteKey = (0, scope.G.useRef)(null),
        lastProbeAttempt = (0, scope.G.useRef)(null),
        manualLoginChoice = (0, scope.G.useRef)(!1),
        oe = n.filter((e) => e.nameOnly !== !0),
        se = (0, scope.G.useRef)(!1),
        [entryMode, setEntryMode] = (0, scope.G.useState)(`single`),
        batch = useAccountBatch({
          open: e,
          siteId: s,
          accounts,
          onImport: onSubmitMany,
        });
      const savedEntry = cleanLoginEntry(i?.loginEntry),
        savedLoginEntry =
          savedEntry &&
          (!i?.loginMethod || i.loginMethod === `auto` || i.loginMethod === savedEntry.method)
            ? savedEntry
            : null;
      (0, scope.G.useEffect)(() => {
        let n = e && !se.current;
        ((se.current = e),
          n &&
            (ae(``),
            setEntryMode(`single`),
            i
              ? (c(i.siteId),
                u(i.username),
                f(i.password ?? ``),
                m(i.label ?? ``),
                g(i.apiToken ?? ``),
                b(i.githubUsername ?? ``),
                S(i.githubPassword ?? ``),
                T(i.passkey ?? !1),
                setLoginEntry(savedLoginEntry),
                v(
                  savedLoginEntry && i.loginMethod && i.loginMethod !== `auto`
                    ? entryValue(savedLoginEntry)
                    : i.loginMethod || scope.ps,
                ),
                D(i.proxyMode ?? `inherit`),
                k(i.proxyId ?? ``),
                j(i.customProxy?.scheme ?? `http`),
                N(i.customProxy?.host ?? ``),
                ee(i.customProxy?.port ? String(i.customProxy.port) : ``),
                F(i.customProxy?.username ?? ``),
                re(i.customProxy?.password ?? ``))
              : (he(), c(r ?? t[0]?.id ?? ``))));
      }, [e, i, r, t]);
      let ce = t.find((e) => e.id === s),
        R = !!ce && (0, scope.mn)(ce),
        ue = ce?.checkin?.method === `none`,
        selectedLoginEntry = loginEntry && _ === entryValue(loginEntry) ? loginEntry : null,
        de = selectedLoginEntry?.method || _ || `auto`,
        autoLogin = de === `auto`,
        entryToSave =
          selectedLoginEntry ||
          (i && autoLogin && (!i.loginMethod || i.loginMethod === `auto`) ? savedLoginEntry : null),
        waitingForLoginChoice = !i && autoLogin,
        z =
          !selectedLoginEntry &&
          _ &&
          !autoLogin &&
          !(0, scope.Io)(de) &&
          (i || !loginProbe.methods.includes(de))
            ? de
            : null,
        B = waitingForLoginChoice
          ? { password: !1, token: !1, sessionCounts: !1, github: !1, passkey: !1 }
          : (0, scope.Ya)(de),
        V =
          !!i &&
          !autoLogin &&
          ![`form`, `github`].includes(de) &&
          d === (i.password ?? ``) &&
          h === (i.apiToken ?? ``) &&
          y === (i.githubUsername ?? ``) &&
          x === (i.githubPassword ?? ``) &&
          C === (i.passkey ?? !1),
        H = !!i?.identity?.session?.accessToken,
        githubIncomplete = (autoLogin || de === `github`) && !!y.trim() !== !!x,
        fe = autoLogin
          ? !githubIncomplete &&
            (d.length > 0 ||
              (y.trim().length > 0 && x.length > 0) ||
              !!i?.identity?.userId ||
              H ||
              C)
          : V ||
            (B.github
              ? y.trim().length > 0 && x.length > 0
              : B.token
                ? h.trim().length > 0 || (B.sessionCounts && H)
                : !B.password || d.length > 0),
        U = E === `pool` ? !!O : E !== `custom` || (M.trim().length > 0 && Number(P) > 0),
        pe =
          !waitingForLoginChoice &&
          s &&
          (l.trim() || (!i && de === `github` && y.trim())) &&
          fe &&
          U,
        me =
          E === `pool` && (!i || (i.proxyMode ?? `inherit`) !== `pool` || (i.proxyId ?? ``) !== O);
      (0, scope.G.useEffect)(() => {
        const generation = ++probeGeneration.current;
        if (!e || entryMode !== `single` || !ce) return;
        const siteKey = `${ce.id}|${ce.loginUrl}`;
        const force =
          lastProbeAttempt.current?.siteKey === siteKey &&
          probeRetry > lastProbeAttempt.current.retry;
        lastProbeAttempt.current = { siteKey, retry: probeRetry };
        if (probeSiteKey.current !== siteKey) {
          probeSiteKey.current = siteKey;
          manualLoginChoice.current = !!i;
          if (!i) {
            setLoginEntry(null);
            v(scope.ps);
          }
        }
        setLoginProbe({
          status: `loading`,
          methods: [],
          entries: [],
          siteId: ce.id,
          updating: force,
          readingSaved: !!i || !!ce.loginDiscovery,
        });
        Promise.resolve()
          .then(() =>
            (0, scope.H)({
              type: `PROBE_LOGIN_PAGE`,
              siteId: ce.id,
              ...(force ? { force: !0 } : {}),
              ...(i && !force ? { savedOnly: !0 } : {}),
            }),
          )
          .then((response) => {
            if (probeGeneration.current !== generation || probeSiteKey.current !== siteKey) return;
            const result = response?.ok ? response.feature?.loginOptions : null;
            if (!result || result.siteId !== ce.id) {
              setLoginProbe({ status: `unavailable`, methods: [], entries: [], siteId: ce.id });
              return;
            }
            const keys = new Set(),
              entries = (Array.isArray(result.entries) ? result.entries : [])
                .slice(0, 64)
                .map(cleanLoginEntry)
                .filter((entry) => entry && !keys.has(entry.key) && keys.add(entry.key));
            const methods = [
              ...new Set(
                entries.length
                  ? entries.map((entry) => entry.method)
                  : (Array.isArray(result.methods) ? result.methods : []).filter((method) =>
                      [`form`, `github`, `oauth`, `passkey`, `manual`].includes(method),
                    ),
              ),
            ];
            setLoginProbe({ ...result, methods, entries });
            if (!manualLoginChoice.current) {
              const soleEntry = entries.length === 1 ? entries[0] : null;
              setLoginEntry(soleEntry);
              v(
                soleEntry
                  ? entryValue(soleEntry)
                  : !entries.length && methods.length === 1
                    ? methods[0]
                    : scope.ps,
              );
            }
          })
          .catch(() => {
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
          manual: `页面验证登录`,
        },
        detectedChoices = loginProbe.entries.length
          ? loginProbe.entries.map((entry) => ({
              value: entryValue(entry),
              method: entry.method,
              label: entry.label,
              entry,
            }))
          : loginProbe.methods.map((method) => ({
              value: method,
              method,
              label: loginLabels[method],
            })),
        manualChoices = [
          ...scope.Po.filter((choice) => [`form`, `github`].includes(choice.value)),
          { value: `oauth`, label: `手动指定：第三方授权（在页面完成）` },
          { value: `manual`, label: `手动指定：验证码 / 其他页面登录` },
          { value: `passkey`, label: `手动指定：Passkey 登录` },
        ],
        loginChoices = i
          ? detectedChoices.length
            ? [...detectedChoices]
            : [...scope.Po]
          : detectedChoices.length
            ? [...detectedChoices]
            : [...manualChoices],
        retainedChoice = selectedLoginEntry
          ? {
              value: entryValue(selectedLoginEntry),
              method: selectedLoginEntry.method,
              label: selectedLoginEntry.label,
              entry: selectedLoginEntry,
            }
          : (i ? scope.Po : manualChoices).find((choice) => choice.value === _),
        probeHasMethods = detectedChoices.length > 0,
        chosenDetectedEntry = detectedChoices.find(
          (choice) =>
            choice.value === _ ||
            (selectedLoginEntry &&
              choice.entry &&
              choice.entry.method === selectedLoginEntry.method &&
              choice.entry.provider === selectedLoginEntry.provider &&
              choice.entry.provider !== `oauth`),
        ),
        selectedEntryMissing =
          !!selectedLoginEntry && !!loginProbe.entries.length && !chosenDetectedEntry,
        probeTitle =
          loginProbe.status === `loading`
            ? loginProbe.updating
              ? `正在更新本站登录方式…`
              : loginProbe.readingSaved
                ? `正在读取本站保存的登录方式…`
                : `首次读取本站登录页…`
            : probeHasMethods
              ? selectedEntryMissing
                ? `本站入口已更新，本账号仍使用：${selectedLoginEntry.label}`
                : detectedChoices.length === 1
                  ? `${loginProbe.source === `saved` ? `本站已保存` : `本站已识别`}：${detectedChoices[0].label}`
                  : chosenDetectedEntry
                    ? `已选择：${chosenDetectedEntry.label}`
                    : loginProbe.source === `saved`
                      ? `本站保存了多种登录方式`
                      : `本站支持多种登录方式`
              : loginProbe.status === `outdated`
                ? `本站登录地址已改变，等待手动更新`
                : loginProbe.status === `not-detected`
                  ? `本站尚未保存登录方式`
                  : loginProbe.status === `already-logged-in`
                    ? loginProbe.source === `saved`
                      ? `上次读取时已登录，未保存到登录入口`
                      : `当前页面已登录，未显示登录入口`
                    : loginProbe.status === `unavailable`
                      ? `暂时无法读取本站登录页`
                      : `当前页面未识别出登录方式`,
        probeDetail = probeHasMethods
          ? selectedEntryMissing
            ? `本站保存了${detectedChoices.map((choice) => choice.label).join(`、`)}。本次未找到账号原选定的「${selectedLoginEntry.label}」，原设置已保留；你可以从上方手动选择新的入口。`
            : detectedChoices.length === 1
              ? [`form`, `github`].includes(detectedChoices[0].method)
                ? `填写此入口对应的账号密码即可。`
                : detectedChoices[0].method === `oauth`
                  ? `请在「${detectedChoices[0].label}」的第三方授权页登录；这里只填写用于核对身份的账号标识，不收集第三方密码。`
                  : detectedChoices[0].method === `manual`
                    ? `填写账号标识，签到时在页面完成验证码或其他验证，无需填写密码。`
                    : `填写账号标识，签到时在浏览器或系统的 Passkey 提示中确认。`
              : chosenDetectedEntry
                ? `下方填写此入口对应的账号信息；需要切换时，可从上方选择其他入口。`
                : `本站支持${detectedChoices.map((choice) => choice.label).join(`、`)}。请选择你已有的账号使用哪种方式。`
          : loginProbe.status === `loading`
            ? loginProbe.readingSaved && !loginProbe.updating
              ? `读取本地保存结果；需要重新打开网页检测时，请点击「更新登录方式」。`
              : `只读取本次页面入口，结果会随站点保存，之后直接使用。`
            : loginProbe.status === `outdated`
              ? `保存结果对应的登录地址已改变。点击「更新登录方式」重新读取；不会自动打开网页。`
              : loginProbe.status === `not-detected`
                ? `点击「更新登录方式」读取一次；也可保留本账号已有的登录方式。`
                : loginProbe.status === `already-logged-in`
                  ? `当前保存结果未显示登录入口。可手动指定方式，或点击「更新登录方式」重新读取。`
                  : `可手动指定登录方式；需要重新读取网页时，点击「更新登录方式」。手动选择尚未确认本站支持该入口。`;
      if (retainedChoice && !loginChoices.some((choice) => choice.value === retainedChoice.value))
        loginChoices.push(retainedChoice);
      function entryValue(entry) {
        return `entry:${entry.key}`;
      }
      function cleanLoginEntry(value) {
        if (
          !value ||
          typeof value !== `object` ||
          Array.isArray(value) ||
          ![`form`, `github`, `oauth`, `passkey`, `manual`].includes(value.method)
        )
          return null;
        function text(field, maxLength) {
          const item = value[field];
          return typeof item === `string` &&
            item.trim() &&
            item.trim().length <= maxLength &&
            !/[\u0000-\u001f\u007f]/.test(item)
            ? item.trim()
            : ``;
        }
        const key = text(`key`, 160),
          label = text(`label`, 120),
          provider = text(`provider`, 80),
          matchText = text(`matchText`, 240);
        if (!key || !label) return null;
        const entry = { key, method: value.method, label };
        if (provider) entry.provider = provider;
        if (matchText) entry.matchText = matchText;
        if (typeof value.hrefPath === `string`) {
          const path = value.hrefPath.trim().split(/[?#]/, 1)[0];
          if (
            path.startsWith(`/`) &&
            !path.startsWith(`//`) &&
            path.length <= 1024 &&
            !/[\\\u0000-\u0020\u007f]/.test(path)
          )
            entry.hrefPath = path;
        }
        return entry;
      }
      function chooseLoginMethod(value) {
        manualLoginChoice.current = !0;
        setLoginEntry(loginChoices.find((choice) => choice.value === value)?.entry || null);
        v(value);
      }
      function he() {
        (u(``),
          f(``),
          m(``),
          setGithubAccountName(``),
          setLoginEntry(null),
          g(``),
          b(``),
          S(``),
          T(!1),
          v(scope.ps),
          (manualLoginChoice.current = !1),
          (probeSiteKey.current = null),
          (lastProbeAttempt.current = null),
          probeGeneration.current++,
          setProbeRetry(0),
          setLoginProbe({ status: `idle`, methods: [], entries: [] }),
          D(`inherit`),
          k(``),
          j(`http`),
          N(``),
          ee(``),
          F(``),
          re(``));
      }
      async function ge() {
        if (!pe || I) return;
        (ie(!0), ae(``));
        let e = !i && de === `github` ? githubAccountName.trim() || y.trim() : l.trim(),
          t = h.trim(),
          n = y.trim(),
          r = B.password ? d : ``,
          c = autoLogin || B.token ? t : ``,
          u = B.github ? n : ``,
          f = B.github ? x : ``,
          m = autoLogin ? C : B.passkey,
          g = i
            ? V
              ? {
                  password: i.password,
                  ...(i.apiToken === void 0 ? {} : { apiToken: i.apiToken }),
                  ...(i.githubUsername === void 0 ? {} : { githubUsername: i.githubUsername }),
                  ...(i.githubPassword === void 0 ? {} : { githubPassword: i.githubPassword }),
                  ...(i.passkey === void 0 ? {} : { passkey: i.passkey }),
                }
              : { password: r, apiToken: c, githubUsername: u, githubPassword: f, passkey: m }
            : {
                password: r,
                ...(c ? { apiToken: c } : {}),
                ...(u ? { githubUsername: u } : {}),
                ...(f ? { githubPassword: f } : {}),
                ...(m ? { passkey: !0 } : {}),
              },
          v = i?.loginMethod || `auto`,
          b =
            !!i &&
            (i.username !== e ||
              (v !== de && !autoLogin) ||
              (!autoLogin &&
                JSON.stringify(cleanLoginEntry(i.loginEntry)) !== JSON.stringify(entryToSave)) ||
              (B.password && (i.password ?? ``) !== r) ||
              (B.token && (i.apiToken ?? ``) !== c) ||
              (B.github && ((i.githubUsername ?? ``) !== u || (i.githubPassword ?? ``) !== f))),
          S = !!i && B.token && !t && H && i.username === e,
          clearIdentity = b && !S;
        try {
          (await o({
            siteId: s,
            username: e,
            ...g,
            label: p.trim() || void 0,
            loginMethod: de,
            ...(entryToSave
              ? { loginEntry: entryToSave }
              : i?.loginEntry
                ? { loginEntry: null }
                : {}),
            ...(clearIdentity ? { identity: {} } : {}),
            proxyMode: E,
            ...(E === `pool` && O ? { proxyId: O, ...(me ? { proxyPinned: !0 } : {}) } : {}),
            ...(E === `custom`
              ? {
                  customProxy: {
                    scheme: A,
                    host: M.trim(),
                    port: Number(P),
                    ...(te.trim() ? { username: te.trim() } : {}),
                    ...(ne ? { password: ne } : {}),
                  },
                }
              : {}),
          }),
            i || he(),
            a());
        } catch (e) {
          ae(e instanceof Error ? e.message : `账号保存失败`);
        } finally {
          ie(!1);
        }
      }
      return (0, scope.W.jsx)(scope.uo, {
        open: e,
        title: i ? `编辑账号` : `添加账号`,
        onClose: () => !I && !batch.savingRef.current && a(),
        footer:
          !i && entryMode === `batch`
            ? (0, scope.W.jsx)(AccountBatchFooter, { batch, onClose: a })
            : (0, scope.W.jsx)(scope.w.button, {
                whileTap: { scale: 0.98 },
                type: `button`,
                disabled: !pe || I,
                onClick: () => void ge(),
                className: scope.fo,
                children: I ? `保存中...` : i ? `保存修改` : `保存账号`,
              }),
        children: (0, scope.W.jsxs)(`div`, {
          className: `space-y-4`,
          children: [
            !i &&
              onSubmitMany &&
              (0, scope.W.jsx)(AccountAddModes, {
                mode: entryMode,
                disabled: I || batch.saving,
                onChange: (mode) => {
                  if (!I && !batch.savingRef.current) setEntryMode(mode);
                },
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
                  manualLoginChoice.current = !1;
                  probeSiteKey.current = null;
                  setLoginEntry(null);
                  setLoginProbe({ status: `idle`, methods: [], entries: [] });
                  v(scope.ps);
                  c(event.target.value);
                },
                children: t.map((e) =>
                  (0, scope.W.jsx)(`option`, { value: e.id, children: e.name }, e.id),
                ),
              }),
            }),
            !i && entryMode === `batch` && (0, scope.W.jsx)(AccountBatchContent, { batch }),
            (i || entryMode === `single`) &&
              (0, scope.W.jsxs)(`div`, {
                className: `space-y-4`,
                children: [
                  (0, scope.W.jsx)(scope.Q, {
                    label: `登录方式`,
                    hint: i
                      ? `为本账号选择登录方式；已有登录设置和凭据会保留。`
                      : `选择本站实际显示的登录入口，下面填写该入口需要的账号信息。`,
                    children: (0, scope.W.jsxs)(`select`, {
                      className: scope.$,
                      value: _,
                      onChange: (event) => chooseLoginMethod(event.target.value),
                      children: [
                        (0, scope.W.jsx)(`option`, {
                          value: scope.ps,
                          disabled: !i,
                          children: i ? `按页面识别（保留已有设置）` : `请选择账号使用的登录方式`,
                        }),
                        z &&
                          !loginChoices.some((choice) => choice.value === z) &&
                          (0, scope.W.jsxs)(`option`, {
                            value: z,
                            disabled: !0,
                            children: [`当前兼容配置：`, scope.Fo[z] || loginLabels[z] || z],
                          }),
                        loginChoices.map((e) =>
                          (0, scope.W.jsx)(
                            `option`,
                            { value: e.value, children: e.label },
                            e.value,
                          ),
                        ),
                      ],
                    }),
                  }),
                  (0, scope.W.jsxs)(`div`, {
                    role: `status`,
                    'aria-live': `polite`,
                    className: `rounded-lg border border-brand-500/15 bg-brand-500/[0.06] px-3 py-2 text-xs dark:border-brand-400/15 dark:bg-brand-400/[0.08]`,
                    children: [
                      (0, scope.W.jsx)(`p`, {
                        className: `font-medium text-brand-700 dark:text-brand-300`,
                        children: probeTitle,
                      }),
                      (0, scope.W.jsx)(`p`, {
                        className: `mt-1 leading-relaxed text-ink-800/70 dark:text-ink-100/70`,
                        children: probeDetail,
                      }),
                      loginProbe.persisted &&
                        Number.isFinite(loginProbe.checkedAt) &&
                        (0, scope.W.jsx)(`p`, {
                          className: `mt-1 text-[11px] text-ink-800/55 dark:text-ink-100/50`,
                          children: `已保存 · ${new Date(loginProbe.checkedAt).toLocaleString(`zh-CN`)} · 仅手动更新时重新打开网页`,
                        }),
                      loginProbe.updateError &&
                        (0, scope.W.jsx)(`p`, {
                          role: `alert`,
                          className: `mt-1 leading-relaxed text-amber-700 dark:text-amber-300`,
                          children: loginProbe.updateError,
                        }),
                      (0, scope.W.jsx)(`button`, {
                        type: `button`,
                        disabled: I || loginProbe.status === `loading`,
                        onClick: () => setProbeRetry((value) => value + 1),
                        className: `mt-1.5 font-medium text-brand-600 hover:underline disabled:opacity-40 dark:text-brand-400`,
                        children: `更新登录方式`,
                      }),
                    ],
                  }),
                  githubIncomplete &&
                    (0, scope.W.jsx)(`p`, {
                      role: `alert`,
                      className: `text-xs text-rose-600 dark:text-rose-400`,
                      children: `GitHub 凭据尚未填完整，请同时填写用户名和密码，或将两项都留空`,
                    }),
                  B.password &&
                    (0, scope.W.jsx)(scope.ds, {
                      kind: `site`,
                      siteId: s,
                      excludeAccountId: i?.id,
                      username: l,
                      password: d,
                      disabled: I,
                      onPick: (e) => {
                        (u(e.username), f(e.password));
                      },
                    }),
                  !waitingForLoginChoice &&
                    (0, scope.W.jsx)(scope.Q, {
                      label:
                        !i && de === `github`
                          ? `账号名称（可选）`
                          : B.password
                            ? `站点账号`
                            : `账号标识`,
                      hint:
                        !i && de === `github`
                          ? `留空默认使用 GitHub 用户名，仅用于区分账号。`
                          : B.password
                            ? `用于站点自身的账密登录`
                            : de === `manual`
                              ? `填写本站用户名或完整邮箱，首次登录后会与当前用户信息核对并绑定。`
                              : `填写本站登录后显示的用户名或完整邮箱，用于核对实际登录身份。`,
                      children: (0, scope.W.jsx)(`input`, {
                        className: scope.$,
                        value: !i && de === `github` ? githubAccountName : l,
                        onChange: (event) => {
                          if (!i && de === `github`) setGithubAccountName(event.target.value);
                          else u(event.target.value);
                        },
                        placeholder:
                          !i && de === `github`
                            ? `留空使用 GitHub 用户名`
                            : B.password || autoLogin
                              ? `站点用户名或邮箱`
                              : de === `manual`
                                ? `本站用户名或完整邮箱`
                                : `本站用户名或完整邮箱`,
                      }),
                    }),
                  B.password &&
                    (0, scope.W.jsx)(scope.Q, {
                      label: `站点密码`,
                      hint: autoLogin
                        ? `页面出现站内账密表单时使用；使用 GitHub 登录的账号可留空`
                        : `仅保存在本机浏览器，不会上传`,
                      children: (0, scope.W.jsx)(`input`, {
                        type: `password`,
                        className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                        value: d,
                        onChange: (e) => f(e.target.value),
                        placeholder: `站点登录密码`,
                      }),
                    }),
                  B.github &&
                    (0, scope.W.jsxs)(`div`, {
                      className: `space-y-3 rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
                      children: [
                        (0, scope.W.jsx)(`p`, {
                          className: `text-xs font-medium text-ink-800 dark:text-ink-100`,
                          children: `GitHub 凭据`,
                        }),
                        (0, scope.W.jsx)(scope.ds, {
                          kind: `github`,
                          siteId: s,
                          excludeAccountId: i?.id,
                          username: y,
                          password: x,
                          disabled: I,
                          onPick: (e) => {
                            (b(e.username), S(e.password));
                          },
                        }),
                        (0, scope.W.jsx)(scope.Q, {
                          label: `GitHub 用户名或邮箱`,
                          hint: `仅在跳转到 github.com 授权页时自动填写`,
                          children: (0, scope.W.jsx)(`input`, {
                            className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                            value: y,
                            onChange: (e) => b(e.target.value),
                            placeholder: `GitHub 用户名或邮箱`,
                          }),
                        }),
                        (0, scope.W.jsx)(scope.Q, {
                          label: `GitHub 密码`,
                          hint: `仅保存在本机；绝不会派发到站点或其他第三方页面`,
                          children: (0, scope.W.jsx)(`input`, {
                            type: `password`,
                            className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                            value: x,
                            onChange: (e) => S(e.target.value),
                            placeholder: `GitHub 登录密码`,
                          }),
                        }),
                      ],
                    }),
                  B.passkey &&
                    (0, scope.W.jsx)(`div`, {
                      className: `rounded-xl bg-ink-50 p-3 text-[11px] leading-relaxed text-ink-800/60 dark:bg-ink-900/60 dark:text-ink-100/50`,
                      children: `将使用浏览器/系统保存的 Passkey。扩展不会保存或模拟 Passkey 私钥；签到时会点站点的 Passkey 按钮，并等待你在原生系统提示中确认。`,
                    }),
                  de === `oauth` &&
                    (0, scope.W.jsx)(`div`, {
                      className: `rounded-xl bg-ink-50 p-3 text-xs leading-relaxed text-ink-800/70 dark:bg-ink-900/60 dark:text-ink-100/65`,
                      children: `将打开「${selectedLoginEntry?.label || `第三方登录`}」入口。请在第三方授权页登录并完成授权；这里只保存用于核对身份的账号标识，不收集第三方密码。`,
                    }),
                  de === `manual` &&
                    (0, scope.W.jsx)(`div`, {
                      className: `rounded-xl bg-ink-50 p-3 text-xs leading-relaxed text-ink-800/70 dark:bg-ink-900/60 dark:text-ink-100/65`,
                      children: `将使用「${selectedLoginEntry?.label || `页面验证登录`}」。填写账号标识，签到时在页面完成验证码或其他验证，无需填写密码。`,
                    }),
                  B.token
                    ? (0, scope.W.jsx)(scope.Q, {
                        label: H ? `API Token（可留空）` : `API Token`,
                        hint: H
                          ? `已抓取登录态（${new Date(i.identity.session.capturedAt).toLocaleString(`zh-CN`)}），不用填 token`
                          : `推荐：在站点手动登录后，用账号行上的钥匙按钮「抓取登录态」。也可手填 ${ce?.tokenConfig?.storageKey || `token`} 的值（会较快过期）`,
                        children: (0, scope.W.jsx)(`input`, {
                          type: `password`,
                          className: scope.$,
                          value: h,
                          onChange: (e) => g(e.target.value),
                          placeholder: H ? `已有登录态，留空即可` : `eyJhbGciOi...`,
                        }),
                      })
                    : null,
                  (0, scope.W.jsxs)(`details`, {
                    className: `rounded-lg border border-black/5 bg-ink-50 px-3 py-2 text-xs text-ink-800/70 dark:border-white/10 dark:bg-ink-900/60 dark:text-ink-100/65`,
                    children: [
                      (0, scope.W.jsxs)(`summary`, {
                        className: `cursor-pointer font-medium text-ink-800 dark:text-ink-100`,
                        children: [
                          `本站共用签到流程 · `,
                          R
                            ? `学习流程回放`
                            : ue
                              ? `登录即签到`
                              : ce?.checkin?.method && ce.checkin.method !== `auto`
                                ? `本站适配`
                                : `自动识别`,
                        ],
                      }),
                      (0, scope.W.jsxs)(`p`, {
                        className: `mt-2 leading-relaxed`,
                        children: [
                          `先登录并确认账号 → `,
                          R
                            ? `执行本站已保存的签到流程`
                            : ue
                              ? `登录成功后直接视为签到完成，不再寻找签到按钮`
                              : `自动完成签到；可从账号旁「学习本站流程」一次教会登录与签到`,
                        ],
                      }),
                      (0, scope.W.jsx)(`p`, {
                        className: `mt-1 leading-relaxed`,
                        children: `本站现有和新增账号共用；任一账号学习都会更新本站流程。各账号用自己的凭据登录，无需逐个学习。`,
                      }),
                    ],
                  }),
                  (0, scope.W.jsx)(scope.Q, {
                    label: `备注`,
                    hint: `可选，用于区分同站多个账号`,
                    children: (0, scope.W.jsx)(`input`, {
                      className: scope.$,
                      value: p,
                      onChange: (e) => m(e.target.value),
                      placeholder: `小号 / 主号`,
                    }),
                  }),
                  (0, scope.W.jsx)(scope.Q, {
                    label: `代理`,
                    hint: `同一站点的不同账号可以走不同出口`,
                    children: (0, scope.W.jsx)(`select`, {
                      className: scope.$,
                      value: E,
                      onChange: (e) => D(e.target.value),
                      children: scope.fs.map((e) =>
                        (0, scope.W.jsx)(`option`, { value: e.value, children: e.label }, e.value),
                      ),
                    }),
                  }),
                  E === `pool` &&
                    (0, scope.W.jsx)(scope.Q, {
                      label: `选择代理`,
                      hint: oe.length
                        ? void 0
                        : `还没有可用出口，请先在代理管理里同步 Clash Verge 配置`,
                      children: (0, scope.W.jsxs)(`select`, {
                        className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                        value: O,
                        onChange: (e) => k(e.target.value),
                        children: [
                          (0, scope.W.jsx)(`option`, { value: ``, children: `请选择` }),
                          i?.proxyId &&
                            n.find((e) => e.id === i.proxyId)?.nameOnly &&
                            (0, scope.W.jsxs)(`option`, {
                              value: i.proxyId,
                              disabled: !0,
                              children: [
                                n.find((e) => e.id === i.proxyId)?.name,
                                `（仅名称，无出口）`,
                              ],
                            }),
                          oe.map((e) =>
                            (0, scope.W.jsxs)(
                              `option`,
                              {
                                value: e.id,
                                children: [
                                  e.name,
                                  `（`,
                                  e.scheme,
                                  `://`,
                                  e.host,
                                  `:`,
                                  e.port,
                                  `）`,
                                ],
                              },
                              e.id,
                            ),
                          ),
                        ],
                      }),
                    }),
                  E === `custom` &&
                    (0, scope.W.jsxs)(scope.w.div, {
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: `auto` },
                      className: `space-y-3 overflow-hidden rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
                      children: [
                        (0, scope.W.jsx)(scope.Q, {
                          label: `协议`,
                          children: (0, scope.W.jsxs)(`select`, {
                            className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                            value: A,
                            onChange: (e) => j(e.target.value),
                            children: [
                              (0, scope.W.jsx)(`option`, { value: `http`, children: `HTTP` }),
                              (0, scope.W.jsx)(`option`, { value: `https`, children: `HTTPS` }),
                              (0, scope.W.jsx)(`option`, { value: `socks5`, children: `SOCKS5` }),
                              (0, scope.W.jsx)(`option`, { value: `socks4`, children: `SOCKS4` }),
                            ],
                          }),
                        }),
                        (0, scope.W.jsx)(scope.Q, {
                          label: `地址`,
                          children: (0, scope.W.jsx)(`input`, {
                            className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                            value: M,
                            onChange: (e) => N(e.target.value),
                            placeholder: `127.0.0.1`,
                          }),
                        }),
                        (0, scope.W.jsx)(scope.Q, {
                          label: `端口`,
                          children: (0, scope.W.jsx)(`input`, {
                            className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                            inputMode: `numeric`,
                            value: P,
                            onChange: (e) => ee(e.target.value.replace(/\D/g, ``)),
                            placeholder: `7890`,
                          }),
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
                                onChange: (e) => F(e.target.value),
                                placeholder: `用户名`,
                              }),
                              (0, scope.W.jsx)(`input`, {
                                type: `password`,
                                className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                                value: ne,
                                onChange: (e) => re(e.target.value),
                                placeholder: `密码`,
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  L &&
                    (0, scope.W.jsx)(`p`, {
                      role: `alert`,
                      className: `text-xs text-rose-600 dark:text-rose-400`,
                      children: L,
                    }),
                ],
              }),
          ],
        }),
      });
    };
    scope.hs = function hs(e) {
      let t = (0, scope.ys)(e);
      if (t.length < 2) throw Error(`CSV 中没有可导入的密码记录`);
      let n = t[0];
      if (!n) throw Error(`CSV 缺少表头`);
      let r = n.map((e, t) => (t === 0 ? e.replace(/^\uFEFF/, ``) : e).trim().toLowerCase()),
        i = [`name`, `url`, `username`, `password`],
        a = Object.fromEntries(i.map((e) => [e, r.indexOf(e)])),
        o = i.filter((e) => a[e] < 0);
      if (o.length > 0) throw Error(`不是 Chrome 密码 CSV，缺少列：${o.join(`, `)}`);
      return t
        .slice(1)
        .filter((e) => e.some((e) => e.trim().length > 0))
        .map((e, t) => {
          let n = e[a.url]?.trim() ?? ``;
          return {
            id: `password-${t + 1}`,
            name: e[a.name]?.trim() ?? ``,
            url: n,
            username: e[a.username]?.trim() ?? ``,
            password: e[a.password] ?? ``,
            host: (0, scope.vs)(n),
          };
        });
    };
    scope.gs = function gs(e, t, n) {
      let r = new Map();
      for (let e of t) {
        let t = (0, scope.vs)(e.loginUrl);
        t && r.set(t, [...(r.get(t) ?? []), e]);
      }
      let i = new Set(n.map((e) => (0, scope._s)(e.siteId, e.username))),
        a = new Set();
      return e.map((e) => {
        if (!e.host || !e.username || !e.password)
          return { credential: e, kind: `invalid`, candidateSiteIds: [] };
        let t = r.get(e.host) ?? [],
          n = t.map((e) => e.id);
        if (t.length === 0) return { credential: e, kind: `unmatched`, candidateSiteIds: n };
        if (t.length > 1) return { credential: e, kind: `ambiguous`, candidateSiteIds: n };
        let [o] = t;
        if (!o) return { credential: e, kind: `unmatched`, candidateSiteIds: n };
        let s = o.id,
          c = (0, scope._s)(s, e.username);
        return i.has(c)
          ? { credential: e, siteId: s, kind: `existing`, candidateSiteIds: n }
          : a.has(c)
            ? { credential: e, siteId: s, kind: `duplicate`, candidateSiteIds: n }
            : (a.add(c), { credential: e, siteId: s, kind: `matched`, candidateSiteIds: n });
      });
    };
    scope._s = function _s(e, t) {
      return `${e}\u0000${t.trim().toLowerCase()}`;
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
      let t = [],
        n = [],
        r = ``,
        i = !1;
      for (let a = 0; a < e.length; a += 1) {
        let o = e[a];
        i
          ? o === `"`
            ? e[a + 1] === `"`
              ? ((r += `"`), (a += 1))
              : (i = !1)
            : (r += o)
          : o === `"` && r.length === 0
            ? (i = !0)
            : o === `,`
              ? (n.push(r), (r = ``))
              : o ===
                    `
` || o === `\r`
                ? (n.push(r),
                  t.push(n),
                  (n = []),
                  (r = ``),
                  o === `\r` &&
                    e[a + 1] ===
                      `
` &&
                    (a += 1))
                : (r += o);
      }
      if (i) throw Error(`CSV 中存在未闭合的引号`);
      return ((r.length > 0 || n.length > 0) && (n.push(r), t.push(n)), t);
    };
    scope.bs = function bs({ open: e, sites: t, accounts: n, onClose: r, onImport: i }) {
      let a = (0, scope.G.useRef)(null),
        [s, c] = (0, scope.G.useState)([]),
        [d, f] = (0, scope.G.useState)(new Set()),
        [p, m] = (0, scope.G.useState)(``),
        [h, g] = (0, scope.G.useState)(``),
        [_, v] = (0, scope.G.useState)(`all`),
        [y, b] = (0, scope.G.useState)(``),
        [x, S] = (0, scope.G.useState)(!1);
      (0, scope.G.useEffect)(() => {
        (c([]), f(new Set()), m(``), g(``), v(`all`), b(``));
      }, [e]);
      let C = (0, scope.G.useMemo)(
          () => new Set(n.map((e) => (0, scope._s)(e.siteId, e.username))),
          [n],
        ),
        T = (0, scope.G.useMemo)(() => {
          let e = new Map();
          for (let t of s) {
            if (!t.siteId || !t.credential.username) continue;
            let n = (0, scope._s)(t.siteId, t.credential.username);
            e.set(n, (e.get(n) ?? 0) + 1);
          }
          return e;
        }, [s]),
        E = (0, scope.G.useMemo)(() => {
          let e = 0,
            t = 0,
            n = 0,
            r = 0;
          for (let i of s)
            i.kind === `invalid`
              ? (r += 1)
              : i.siteId && C.has((0, scope._s)(i.siteId, i.credential.username))
                ? (n += 1)
                : i.siteId
                  ? (e += 1)
                  : (t += 1);
          return { all: s.length, matched: e, unmatched: t, existing: n, invalid: r };
        }, [C, s]),
        D = (0, scope.G.useMemo)(() => {
          let e = h.trim().toLocaleLowerCase();
          return s.filter((n) => {
            let r = (0, scope.xs)(n, C) ? `existing` : n.siteId ? `matched` : `unmatched`;
            if (_ !== `all` && r !== _) return !1;
            if (!e) return !0;
            let i = t.find((e) => e.id === n.siteId)?.name ?? ``;
            return [n.credential.host, n.credential.username, n.credential.name, i].some((t) =>
              t.toLocaleLowerCase().includes(e),
            );
          });
        }, [C, _, s, h, t]);
      async function O(e) {
        if (e) {
          b(``);
          try {
            let r = (0, scope.gs)((0, scope.hs)(await e.text()), t, n);
            (c(r),
              f(new Set(r.filter((e) => e.kind === `matched`).map((e) => e.credential.id))),
              m(e.name),
              v(`all`),
              g(``));
          } catch (t) {
            (c([]),
              f(new Set()),
              m(e.name),
              b(t instanceof Error ? t.message : `无法读取 Chrome 密码 CSV`));
          }
        }
      }
      function k(e, t) {
        let n = s.find((t) => t.credential.id === e);
        if (!n) return;
        let r = t
          ? C.has((0, scope._s)(t, n.credential.username))
            ? `existing`
            : `manual`
          : n.candidateSiteIds.length > 1
            ? `ambiguous`
            : `unmatched`;
        (c((n) =>
          n.map((n) => (n.credential.id === e ? { ...n, siteId: t || void 0, kind: r } : n)),
        ),
          f((i) => {
            let a = new Set(i);
            if ((a.delete(e), t && r !== `existing`)) {
              let r = (0, scope._s)(t, n.credential.username);
              for (let e of s)
                e.siteId &&
                  (0, scope._s)(e.siteId, e.credential.username) === r &&
                  a.delete(e.credential.id);
              a.add(e);
            }
            return a;
          }));
      }
      function A(e) {
        e.siteId &&
          e.kind !== `invalid` &&
          !(0, scope.xs)(e, C) &&
          f((t) => {
            let n = new Set(t);
            if (n.has(e.credential.id)) return (n.delete(e.credential.id), n);
            let r = (0, scope._s)(e.siteId, e.credential.username);
            for (let e of s)
              e.siteId &&
                (0, scope._s)(e.siteId, e.credential.username) === r &&
                n.delete(e.credential.id);
            return (n.add(e.credential.id), n);
          });
      }
      async function j() {
        if (d.size === 0 || x) return;
        let e = s.flatMap((e) =>
          !d.has(e.credential.id) || !e.siteId || (0, scope.xs)(e, C)
            ? []
            : [
                {
                  siteId: e.siteId,
                  username: e.credential.username.trim(),
                  password: e.credential.password,
                },
              ],
        );
        if (e.length !== 0) {
          S(!0);
          try {
            (await i(e), r());
          } finally {
            S(!1);
          }
        }
      }
      return (0, scope.W.jsxs)(scope.uo, {
        open: e,
        title: `匹配导入账号`,
        onClose: () => !x && r(),
        wide: !0,
        children: [
          (0, scope.W.jsx)(`input`, {
            ref: a,
            type: `file`,
            accept: `.csv,text/csv`,
            className: `hidden`,
            onChange: (e) => {
              (O(e.target.files?.[0]), (e.target.value = ``));
            },
          }),
          s.length === 0
            ? (0, scope.W.jsxs)(`div`, {
                className: `space-y-3`,
                children: [
                  (0, scope.W.jsxs)(`button`, {
                    type: `button`,
                    onClick: () => a.current?.click(),
                    className: `flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-black/10 py-12 text-center transition-colors hover:border-brand-500/40 hover:bg-brand-500/[0.03] dark:border-white/10 dark:hover:bg-brand-500/[0.06]`,
                    children: [
                      (0, scope.W.jsx)(`span`, {
                        className: `mb-3 flex size-12 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400`,
                        children: (0, scope.W.jsx)(scope.Fe, { className: `size-5` }),
                      }),
                      (0, scope.W.jsx)(`span`, {
                        className: `text-sm font-semibold text-ink-900 dark:text-white`,
                        children: `选择 Chrome 密码 CSV`,
                      }),
                      (0, scope.W.jsx)(`span`, {
                        className: `mt-1 text-[11px] text-ink-800/40 dark:text-ink-100/35`,
                        children: `仅自动勾选域名唯一匹配的账号`,
                      }),
                    ],
                  }),
                  y &&
                    (0, scope.W.jsx)(`p`, {
                      className: `rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-300`,
                      children: y,
                    }),
                ],
              })
            : (0, scope.W.jsxs)(`div`, {
                className: `space-y-3`,
                children: [
                  (0, scope.W.jsxs)(`div`, {
                    className: `flex flex-wrap items-center gap-2`,
                    children: [
                      (0, scope.W.jsx)(`span`, {
                        className: `flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400`,
                        children: (0, scope.W.jsx)(scope.Fe, { className: `size-4` }),
                      }),
                      (0, scope.W.jsxs)(`div`, {
                        className: `min-w-[160px] flex-1`,
                        children: [
                          (0, scope.W.jsx)(`p`, {
                            className: `truncate text-xs font-semibold text-ink-900 dark:text-white`,
                            children: p,
                          }),
                          (0, scope.W.jsxs)(`p`, {
                            className: `text-[10px] text-ink-800/40 dark:text-ink-100/35`,
                            children: [`共 `, E.all, ` 条记录`],
                          }),
                        ],
                      }),
                      (0, scope.W.jsxs)(`button`, {
                        type: `button`,
                        disabled: x,
                        onClick: () => a.current?.click(),
                        className: `inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-brand-600 ring-1 ring-brand-500/20 hover:bg-brand-500/10 disabled:opacity-40 dark:text-brand-400`,
                        children: [
                          (0, scope.W.jsx)(scope.B, { className: `size-3.5` }),
                          `更换文件`,
                        ],
                      }),
                    ],
                  }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `grid grid-cols-2 gap-2 sm:grid-cols-4`,
                    children: [
                      (0, scope.W.jsx)(scope.Ss, {
                        label: `已匹配`,
                        value: E.matched,
                        tone: `emerald`,
                      }),
                      (0, scope.W.jsx)(scope.Ss, {
                        label: `待匹配`,
                        value: E.unmatched,
                        tone: `amber`,
                      }),
                      (0, scope.W.jsx)(scope.Ss, {
                        label: `已存在`,
                        value: E.existing,
                        tone: `ink`,
                      }),
                      (0, scope.W.jsx)(scope.Ss, { label: `无效`, value: E.invalid, tone: `rose` }),
                    ],
                  }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `flex flex-wrap items-center gap-2`,
                    children: [
                      (0, scope.W.jsxs)(`div`, {
                        className: `relative min-w-[180px] flex-1`,
                        children: [
                          (0, scope.W.jsx)(scope.l, {
                            className: `pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-800/30 dark:text-ink-100/25`,
                          }),
                          (0, scope.W.jsx)(`input`, {
                            value: h,
                            onChange: (e) => g(e.target.value),
                            placeholder: `搜索域名、用户名或站点`,
                            className: `h-9 w-full rounded-lg bg-ink-50 pl-8 pr-3 text-xs outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-brand-500/40 dark:bg-ink-950/50 dark:ring-white/10`,
                          }),
                        ],
                      }),
                      (0, scope.W.jsx)(`div`, {
                        className: `flex rounded-lg bg-ink-50 p-1 ring-1 ring-black/5 dark:bg-ink-950/50 dark:ring-white/10`,
                        children: [
                          [`all`, `全部`],
                          [`matched`, `已匹配`],
                          [`unmatched`, `待匹配`],
                          [`existing`, `已存在`],
                        ].map(([e, t]) =>
                          (0, scope.W.jsx)(
                            `button`,
                            {
                              type: `button`,
                              onClick: () => v(e),
                              className: (0, scope.R)(
                                `h-7 rounded-md px-2 text-[10px] font-medium transition-colors`,
                                _ === e
                                  ? `bg-white text-ink-900 shadow-sm dark:bg-ink-800 dark:text-white`
                                  : `text-ink-800/45 hover:text-ink-900 dark:text-ink-100/40 dark:hover:text-white`,
                              ),
                              children: t,
                            },
                            e,
                          ),
                        ),
                      }),
                    ],
                  }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `max-h-[360px] overflow-y-auto rounded-lg ring-1 ring-black/5 dark:ring-white/10`,
                    children: [
                      D.map((e) => {
                        let n = (0, scope.xs)(e, C),
                          r = e.siteId
                            ? (T.get((0, scope._s)(e.siteId, e.credential.username)) ?? 0) > 1
                            : !1,
                          i = d.has(e.credential.id),
                          a = !!e.siteId && e.kind !== `invalid` && !n,
                          s = [...t].sort(
                            (t, n) =>
                              Number(e.candidateSiteIds.includes(n.id)) -
                              Number(e.candidateSiteIds.includes(t.id)),
                          );
                        return (0, scope.W.jsxs)(
                          `div`,
                          {
                            className: (0, scope.R)(
                              `flex flex-wrap items-center gap-2 border-b border-black/5 px-3 py-2.5 last:border-b-0 dark:border-white/5`,
                              i && `bg-emerald-500/[0.045] dark:bg-emerald-500/[0.06]`,
                            ),
                            children: [
                              (0, scope.W.jsx)(`button`, {
                                type: `button`,
                                disabled: !a,
                                onClick: () => A(e),
                                'aria-label': `${i ? `取消选择` : `选择`}账号 ${e.credential.username || e.credential.host}`,
                                className: (0, scope.R)(
                                  `flex size-5 shrink-0 items-center justify-center rounded border transition-colors`,
                                  i
                                    ? `border-emerald-500 bg-emerald-500 text-white`
                                    : `border-black/15 text-transparent dark:border-white/20`,
                                  !a && `cursor-not-allowed opacity-35`,
                                ),
                                children: i
                                  ? (0, scope.W.jsx)(scope.o, { className: `size-3.5 stroke-[3]` })
                                  : (0, scope.W.jsx)(scope.ve, { className: `size-3.5` }),
                              }),
                              (0, scope.W.jsx)(`span`, {
                                className: `flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-800/35 ring-1 ring-black/5 dark:bg-white/5 dark:text-ink-100/35 dark:ring-white/10`,
                                children: (0, scope.W.jsx)(scope.Ge, { className: `size-3.5` }),
                              }),
                              (0, scope.W.jsxs)(`div`, {
                                className: `min-w-[130px] flex-1`,
                                children: [
                                  (0, scope.W.jsx)(`p`, {
                                    className: `truncate text-xs font-medium text-ink-900 dark:text-white`,
                                    children: e.credential.username || `缺少用户名`,
                                  }),
                                  (0, scope.W.jsx)(`p`, {
                                    className: `truncate text-[10px] text-ink-800/40 dark:text-ink-100/35`,
                                    children: e.credential.host || e.credential.url || `无效地址`,
                                  }),
                                ],
                              }),
                              (0, scope.W.jsxs)(`select`, {
                                'aria-label': `匹配站点 ${e.credential.username || e.credential.host}`,
                                value: e.siteId ?? ``,
                                disabled: e.kind === `invalid` || x,
                                onChange: (t) => k(e.credential.id, t.target.value),
                                className: `h-8 w-full rounded-lg bg-ink-50 px-2 text-[11px] text-ink-900 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-brand-500/40 disabled:opacity-40 dark:bg-ink-950/50 dark:text-white dark:ring-white/10 sm:w-44`,
                                children: [
                                  (0, scope.W.jsx)(`option`, { value: ``, children: `未匹配站点` }),
                                  s.map((e) =>
                                    (0, scope.W.jsx)(
                                      `option`,
                                      { value: e.id, children: e.name },
                                      e.id,
                                    ),
                                  ),
                                ],
                              }),
                              (0, scope.W.jsx)(scope.Cs, { match: e, existing: n, duplicate: r }),
                            ],
                          },
                          e.credential.id,
                        );
                      }),
                      D.length === 0 &&
                        (0, scope.W.jsx)(`div`, {
                          className: `py-10 text-center text-xs text-ink-800/40 dark:text-ink-100/35`,
                          children: `没有符合当前条件的记录`,
                        }),
                    ],
                  }),
                  (0, scope.W.jsxs)(`div`, {
                    className: `flex flex-wrap items-center justify-between gap-2`,
                    children: [
                      (0, scope.W.jsxs)(`span`, {
                        className: `text-xs text-ink-800/50 dark:text-ink-100/40`,
                        children: [`已选择 `, d.size, ` 个账号`],
                      }),
                      (0, scope.W.jsxs)(scope.w.button, {
                        whileTap: { scale: d.size ? 0.98 : 1 },
                        type: `button`,
                        disabled: d.size === 0 || x,
                        onClick: () => void j(),
                        className: `inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-500 px-4 text-xs font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600 disabled:opacity-40 disabled:shadow-none`,
                        children: [
                          x
                            ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` })
                            : (0, scope.W.jsx)(scope.Fe, { className: `size-4` }),
                          x ? `导入中` : `导入匹配账号 (${d.size})`,
                        ],
                      }),
                    ],
                  }),
                ],
              }),
        ],
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
            rose: `bg-rose-500/10 text-rose-700 dark:text-rose-300`,
          }[n],
        ),
        children: [
          (0, scope.W.jsx)(`span`, { className: `text-[10px] font-medium`, children: e }),
          (0, scope.W.jsx)(`span`, { className: `text-sm font-bold tabular-nums`, children: t }),
        ],
      });
    };
    scope.Cs = function Cs({ match: e, existing: t, duplicate: n }) {
      return e.kind === `invalid`
        ? (0, scope.W.jsx)(scope.ws, {
            label: `无效`,
            className: `bg-rose-500/10 text-rose-700 dark:text-rose-300`,
          })
        : t
          ? (0, scope.W.jsx)(scope.ws, {
              label: `已存在`,
              className: `bg-black/5 text-ink-800/55 dark:bg-white/10 dark:text-ink-100/50`,
            })
          : !e.siteId && e.kind === `ambiguous`
            ? (0, scope.W.jsx)(scope.ws, {
                label: `多个候选`,
                className: `bg-amber-500/10 text-amber-700 dark:text-amber-300`,
              })
            : e.siteId
              ? n || e.kind === `duplicate`
                ? (0, scope.W.jsx)(scope.ws, {
                    label: `同账号多条`,
                    className: `bg-amber-500/10 text-amber-700 dark:text-amber-300`,
                  })
                : e.kind === `manual`
                  ? (0, scope.W.jsx)(scope.ws, {
                      label: `手动匹配`,
                      className: `bg-brand-500/10 text-brand-700 dark:text-brand-300`,
                    })
                  : (0, scope.W.jsx)(scope.ws, {
                      label: `域名匹配`,
                      className: `bg-emerald-500/10 text-emerald-700 dark:text-emerald-300`,
                    })
              : (0, scope.W.jsx)(scope.ws, {
                  label: `未匹配`,
                  className: `bg-amber-500/10 text-amber-700 dark:text-amber-300`,
                });
    };
    scope.ws = function ws({ label: e, className: t }) {
      return (0, scope.W.jsx)(`span`, {
        className: (0, scope.R)(`shrink-0 rounded-md px-1.5 py-1 text-[10px] font-medium`, t),
        children: e,
      });
    };
    scope.$s = function $s(e) {
      return e === `name-desc` || e === `added` ? e : scope.Qs;
    };
    scope.tc = function tc(e, t = scope.Qs) {
      if (t === `added`) return [...e];
      let n = t === `name-desc` ? -1 : 1;
      return [...e].sort(
        (e, t) => n * scope.ec.compare(e.label || e.username, t.label || t.username),
      );
    };
    scope.Nl = function Nl(e, t) {
      if (((t = Object.assign(Object.assign({}, scope.Ml), t || {})), !(0, scope._l)(e))) return e;
      if (e === ``) return t.type === `array` || t.type === `all` ? [] : ``;
      (t.surname === void 0 && (t.mode === `surname` ? (t.surname = `all`) : (t.surname = `off`)),
        t.type === `all` && (t.pattern = `pinyin`),
        t.pattern === `num` && (t.toneType = `none`),
        t.removeNonZh && (t.nonZh = `removed`));
      let n = (0, scope.cc)(e),
        { list: r } = (0, scope.rl)(e, Array(n.length), t.surname, t.segmentit, t.traditional, n);
      ((r = (0, scope.jl)(r, t.toneSandhi)), (r = (0, scope.yl)(r, t)));
      let i = (0, scope.bl)(e, t);
      return (
        i && (r = i),
        (0, scope.xl)(r, t),
        (0, scope.Sl)(r, t),
        (0, scope.Cl)(r, t),
        (0, scope.wl)(r, t, e)
      );
    };
    scope.Fl = function Fl(e) {
      return e === `name-desc` || e === `manual` ? e : scope.Pl;
    };
    scope.Ll = function Ll(e, t = scope.Pl) {
      if (t === `manual`) return [...e];
      let n = t === `name-desc` ? -1 : 1;
      return e
        .map((e) => ({
          site: e,
          key: (0, scope.Nl)(e.name.trim(), { toneType: `none`, type: `array` }).join(``),
        }))
        .sort((e, t) => n * scope.Il.compare(e.key, t.key))
        .map(({ site: e }) => e);
    };
    scope.Rl = function Rl(e, t, n, r) {
      let i = [...e],
        a = i.indexOf(t);
      if (a < 0) return i;
      let o = (e) => !r || r.has(e);
      if (n === `up`) {
        let e = a - 1;
        for (; e >= 0 && !o(i[e]);) --e;
        return (e < 0 || (i.splice(a, 1), i.splice(e, 0, t)), i);
      }
      let s = a + 1;
      for (; s < i.length && !o(i[s]);) s += 1;
      return (s >= i.length || (i.splice(a, 1), i.splice(s, 0, t)), i);
    };
    scope.zl = function zl({ value: e, onChange: t, compact: n }) {
      return (0, scope.W.jsxs)(`label`, {
        className: (0, scope.R)(
          `flex h-8 min-w-0 items-center gap-1.5 rounded-md border border-black/8 bg-white px-2 text-[11px] dark:border-white/10 dark:bg-ink-900`,
          n ? `grow` : `shrink-0`,
        ),
        title: `按账号名称排序：有备注用备注，否则用用户名`,
        children: [
          (0, scope.W.jsx)(`span`, {
            className: `shrink-0 text-ink-800/60 dark:text-ink-100/60`,
            children: `账号排序`,
          }),
          (0, scope.W.jsxs)(`select`, {
            'aria-label': `账号排序`,
            value: e,
            onChange: (e) => t((0, scope.$s)(e.target.value)),
            className: `min-w-0 flex-1 cursor-pointer rounded bg-white py-1 text-ink-900 outline-none focus:ring-2 focus:ring-brand-500/30 dark:bg-ink-900 dark:text-ink-50`,
            children: [
              (0, scope.W.jsx)(`option`, { value: `name-asc`, children: `名称 A→Z（默认）` }),
              (0, scope.W.jsx)(`option`, { value: `name-desc`, children: `名称 Z→A` }),
              (0, scope.W.jsx)(`option`, { value: `added`, children: `添加顺序` }),
            ],
          }),
        ],
      });
    };
    scope.Ql = function Ql({
      siteCount: e,
      accountCount: t,
      onSelectAll: n,
      onClear: r,
      onDelete: i,
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
            children: (0, scope.W.jsx)(scope._t, { className: `size-4` }),
          }),
          (0, scope.W.jsxs)(`div`, {
            className: `min-w-[112px] flex-1`,
            children: [
              (0, scope.W.jsxs)(`p`, {
                className: `text-xs font-semibold`,
                children: [`已选 `, a, ` 项`],
              }),
              (0, scope.W.jsxs)(`p`, {
                className: `text-[10px] text-white/55 dark:text-ink-800/50`,
                children: [e, ` 个站点 · `, t, ` 个账号`],
              }),
            ],
          }),
          (0, scope.W.jsx)(`button`, {
            type: `button`,
            onClick: n,
            className: `h-8 rounded-lg px-2.5 text-[11px] font-medium text-white/70 hover:bg-white/10 hover:text-white dark:text-ink-800/60 dark:hover:bg-black/5 dark:hover:text-ink-900`,
            children: `全选`,
          }),
          (0, scope.W.jsx)(`button`, {
            type: `button`,
            onClick: r,
            disabled: a === 0,
            className: `h-8 rounded-lg px-2.5 text-[11px] font-medium text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-35 dark:text-ink-800/60 dark:hover:bg-black/5 dark:hover:text-ink-900`,
            children: `清空`,
          }),
          (0, scope.W.jsxs)(scope.w.button, {
            whileHover: { scale: a ? 1.03 : 1 },
            whileTap: { scale: a ? 0.97 : 1 },
            type: `button`,
            onClick: i,
            disabled: a === 0,
            className: `inline-flex h-8 items-center gap-1.5 rounded-lg bg-rose-500 px-3 text-[11px] font-semibold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-35`,
            children: [(0, scope.W.jsx)(scope.v, { className: `size-3.5` }), `删除选中`],
          }),
        ],
      });
    };
    scope.iu = function iu({ site: e, attention: t }) {
      let n = (e?.name || `?`).trim().slice(0, 1).toUpperCase();
      return (0, scope.W.jsx)(`span`, {
        className: (0, scope.R)(
          `grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg text-xs font-bold ring-1 ring-inset`,
          t
            ? `bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:ring-cyan-900`
            : `bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900`,
        ),
        children: e
          ? (0, scope.W.jsx)(scope.no, { site: e, className: `size-5 rounded`, fallback: n })
          : n,
      });
    };
    scope.au = function au({ accounts: e, sites: t, compact: n = !1, onRecover: r, onAddSite: i }) {
      let [a, o] = (0, scope.G.useState)({}),
        [c, l] = (0, scope.G.useState)(),
        [d, f] = (0, scope.G.useState)();
      async function p(e) {
        let t = a[e.id];
        if (t && !c) {
          (l(e.id), f(void 0));
          try {
            (await r(e.id, t),
              o((t) => {
                let n = { ...t };
                return (delete n[e.id], n);
              }));
          } catch (e) {
            f(e instanceof Error ? e.message : `恢复账号归属失败`);
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
                children: (0, scope.W.jsx)(scope.g, { className: `size-4` }),
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `min-w-0 flex-1`,
                children: [
                  (0, scope.W.jsxs)(`div`, {
                    className: `flex flex-wrap items-center gap-x-2 gap-y-1`,
                    children: [
                      (0, scope.W.jsx)(`h2`, {
                        className: `text-sm font-semibold text-slate-900 dark:text-white`,
                        children: `待恢复账号`,
                      }),
                      (0, scope.W.jsxs)(`span`, {
                        className: `text-[11px] font-medium text-amber-700 dark:text-amber-300`,
                        children: [e.length, ` 个`],
                      }),
                    ],
                  }),
                  (0, scope.W.jsx)(`p`, {
                    className: `mt-0.5 text-[11px] leading-5 text-slate-600 dark:text-slate-300`,
                    children: `原站点记录已不存在；恢复会保留账号密码、代理和备注，并清除旧站 token、登录方式与会话。`,
                  }),
                ],
              }),
              t.length === 0 &&
                (0, scope.W.jsxs)(`button`, {
                  type: `button`,
                  onClick: i,
                  className: `inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-amber-600 px-2.5 text-[11px] font-semibold text-white hover:bg-amber-700`,
                  children: [(0, scope.W.jsx)(scope.yt, { className: `size-3.5` }), `添加站点`],
                }),
            ],
          }),
          (0, scope.W.jsx)(`div`, {
            className: `divide-y divide-amber-200/80 border-t border-amber-200/80 dark:divide-amber-900/70 dark:border-amber-900/70`,
            children: e.map((e) => {
              let r = a[e.id] ?? ``,
                i = c === e.id;
              return (0, scope.W.jsxs)(
                `div`,
                {
                  className: (0, scope.R)(
                    `flex flex-wrap items-center gap-3 px-4 py-3`,
                    n && `px-3`,
                  ),
                  children: [
                    (0, scope.W.jsxs)(`div`, {
                      className: `min-w-[180px] flex-1`,
                      children: [
                        (0, scope.W.jsx)(`p`, {
                          className: `truncate text-sm font-semibold text-slate-900 dark:text-white`,
                          title: e.label || e.username,
                          children: e.label || e.username,
                        }),
                        e.label &&
                          (0, scope.W.jsx)(`p`, {
                            className: `truncate text-[11px] text-slate-500`,
                            title: e.username,
                            children: e.username,
                          }),
                        (0, scope.W.jsxs)(`p`, {
                          className: `mt-0.5 truncate font-mono text-[10px] text-slate-500`,
                          title: e.siteId,
                          children: [`原站点 ID: `, e.siteId],
                        }),
                      ],
                    }),
                    t.length > 0 &&
                      (0, scope.W.jsxs)(`div`, {
                        className: `flex min-w-0 basis-full items-center gap-2 sm:basis-auto`,
                        children: [
                          (0, scope.W.jsxs)(`select`, {
                            value: r,
                            disabled: i,
                            onChange: (t) => o((n) => ({ ...n, [e.id]: t.target.value })),
                            'aria-label': `选择 ${e.label || e.username} 的所属站点`,
                            className: `h-8 min-w-0 flex-1 rounded-md border border-amber-300 bg-white px-2 text-[11px] text-slate-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 disabled:opacity-50 dark:border-amber-900 dark:bg-slate-950 dark:text-slate-100 sm:w-48`,
                            children: [
                              (0, scope.W.jsx)(`option`, { value: ``, children: `选择所属站点` }),
                              t.map((e) =>
                                (0, scope.W.jsx)(`option`, { value: e.id, children: e.name }, e.id),
                              ),
                            ],
                          }),
                          (0, scope.W.jsxs)(`button`, {
                            type: `button`,
                            disabled: !r || i || !!c,
                            onClick: () => void p(e),
                            className: `inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-slate-900 px-2.5 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100`,
                            children: [
                              i
                                ? (0, scope.W.jsx)(scope.u, { className: `size-3.5 animate-spin` })
                                : (0, scope.W.jsx)(scope.s, { className: `size-3.5` }),
                              i ? `正在恢复` : `恢复归属`,
                            ],
                          }),
                        ],
                      }),
                  ],
                },
                e.id,
              );
            }),
          }),
          d &&
            (0, scope.W.jsx)(`p`, {
              className: `border-t border-rose-200 bg-rose-50 px-4 py-2 text-[11px] text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300`,
              children: d,
            }),
        ],
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
          { kind: `github`, title: `GitHub 账号` },
        ];
        break;
      }
      case 4: {
        scope.fs = [
          { value: `inherit`, label: `跟随站点设置` },
          { value: `none`, label: `不使用代理（直连）` },
          { value: `pool`, label: `选择已保存的代理` },
          { value: `custom`, label: `为这个账号单独填地址` },
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
        scope.ec = new Intl.Collator(`zh-CN`, { sensitivity: `base`, numeric: !0 });
        break;
      }
      case 8: {
        scope.Pl = `name-asc`;
        break;
      }
      case 9: {
        scope.Il = new Intl.Collator(`en`, { sensitivity: `base`, numeric: !0 });
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
              scope.z.get(scope.M.proxies, []),
            ]);
            if ((e.proxyMode ?? `inherit`) === `pool`) {
              if (!e.proxyId) throw Error(`账号选择了代理池，但没有指定真实出口`);
              (0, scope.Fi)(e.proxyId, (0, scope.Ni)(n));
            }
            await scope.z.set(scope.M.accounts, t.concat({ ...e, id: (0, scope.Ft)(`acc`) }));
          });
        },
      };
    },
    store_Li_addAccounts(scope) {
      return {
        addAccounts(e, t, n = !1) {
          return (0, scope.X)(async () => {
            let [r, i] = await Promise.all([
                scope.z.get(scope.M.accounts, []),
                scope.z.get(scope.M.proxies, []),
              ]),
              a = (0, scope.Ni)(i),
              o = new Set(r.map((e) => `${e.siteId}\u0000${e.username.trim().toLowerCase()}`)),
              s = [];
            for (let r of e) {
              let e = r.username.trim(),
                i = `${r.siteId}\u0000${e.toLowerCase()}`;
              t.has(r.siteId) &&
                e &&
                r.password &&
                (n || !o.has(i)) &&
                ((r.proxyMode ?? `inherit`) !== `pool` || (r.proxyId && a.has(r.proxyId))) &&
                (o.add(i),
                s.push({
                  ...r,
                  username: e,
                  label: r.label?.trim() || void 0,
                  id: (0, scope.Ft)(`acc`),
                }));
            }
            return (
              s.length && (await scope.z.set(scope.M.accounts, r.concat(s))),
              { added: s.length, skipped: e.length - s.length }
            );
          });
        },
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
                scope.z.get(scope.M.proxies, []),
              ]),
              o = n.find((t) => t.id === e);
            if (!o) throw Error(`账号不存在或已被删除`);
            let s = (0, scope.Ii)(o, t);
            if (
              (s.proxyMode ?? `inherit`) === `pool` &&
              (s.proxyId !== o.proxyId || (o.proxyMode ?? `inherit`) !== `pool`)
            ) {
              if (!s.proxyId) throw Error(`账号选择了代理池，但没有指定真实出口`);
              (0, scope.Fi)(s.proxyId, (0, scope.Ni)(a));
            }
            if (typeof t.siteId != `string` || t.siteId === o.siteId) {
              await scope.z.set(
                scope.M.accounts,
                n.map((n) => (n.id === e ? (0, scope.Ii)(n, t) : n)),
              );
              return;
            }
            let c = t.siteId.trim(),
              l = new Set(i);
            if (!(r.some((e) => e.id === c) || scope.pn.some((e) => e.id === c && !l.has(e.id))))
              throw Error(`目标站点不存在，请重新选择`);
            let u = o.username.trim().toLowerCase();
            if (
              n.some((t) => t.id !== e && t.siteId === c && t.username.trim().toLowerCase() === u)
            )
              throw Error(`目标站点已有同名账号，不能重复归属`);
            let d = (0, scope.Ii)(o, { ...t, siteId: c });
            (delete d.identity,
              delete d.loginMethod,
              delete d.loginEntry,
              delete d.apiToken,
              delete d.githubUsername,
              delete d.githubPassword,
              delete d.passkey);
            let f = n.map((t) => (t.id === e ? d : t)),
              [p, m, h] = await Promise.all([
                scope.z.get(scope.M.status, {}),
                scope.z.get(scope.M.results, {}),
                scope.z.get(scope.M.balances, {}),
              ]),
              g = `${e}:`;
            await scope.z.setMany({
              [scope.M.accounts]: f,
              [scope.M.status]: Object.fromEntries(
                Object.entries(p).filter(([e]) => !e.startsWith(g)),
              ),
              [scope.M.results]: Object.fromEntries(Object.entries(m).filter(([t]) => t !== e)),
              [scope.M.balances]: Object.fromEntries(Object.entries(h).filter(([t]) => t !== e)),
            });
          });
        },
      };
    },
    store_Li_saveAccountSession(scope) {
      return {
        saveAccountSession(e, t) {
          return (0, scope.X)(async () => {
            let n = (await scope.z.get(scope.M.accounts, [])).map((n) =>
              n.id === e ? { ...n, identity: { ...n.identity, session: t } } : n,
            );
            await scope.z.set(scope.M.accounts, n);
          });
        },
      };
    },
    store_Li_saveAccountIdentity(scope) {
      return {
        saveAccountIdentity(e, t, n = {}) {
          return (0, scope.X)(async () => {
            let r = await scope.z.get(scope.M.accounts, []),
              i = r.find((t) => t.id === e);
            if (!i) return;
            let a = Object.fromEntries(Object.entries(t).filter(([, e]) => e != null && e !== ``)),
              o = typeof a.userId == `string` ? a.userId : void 0,
              s = new Set(
                o
                  ? r
                      .filter(
                        (t) => t.id !== e && t.siteId === i.siteId && t.identity?.userId === o,
                      )
                      .map((e) => e.id)
                  : [],
              ),
              c = !!o && !!i.identity?.userId && i.identity.userId !== o;
            if (n.preserveBinding && (c || s.size > 0))
              throw Error(`身份绑定发生冲突，已保留原账号及其他账号的数据`);
            let l =
                a.verifiedByManagedLogin === !0 ||
                (i.identity?.verifiedByManagedLogin === !0 &&
                  (!o || o === i.identity.userId) &&
                  a.source === void 0),
              u = r.map((t) =>
                t.id === e
                  ? {
                      ...t,
                      identity: (() => {
                        let e = { ...t.identity, ...a, fetchedAt: Date.now() };
                        return (
                          l ? (e.verifiedByManagedLogin = !0) : delete e.verifiedByManagedLogin,
                          e
                        );
                      })(),
                    }
                  : s.has(t.id)
                    ? {
                        ...t,
                        identity: t.identity?.session ? { session: t.identity.session } : void 0,
                      }
                    : t,
              );
            if (s.size === 0 && !c) {
              await scope.z.set(scope.M.accounts, u);
              return;
            }
            let [d, f, p] = await Promise.all([
                scope.z.get(scope.M.status, {}),
                scope.z.get(scope.M.results, {}),
                scope.z.get(scope.M.balances, {}),
              ]),
              m = new Set(s);
            c && m.add(e);
            let h = [...s].map((e) => `${e}:`);
            await scope.z.setMany({
              [scope.M.accounts]: u,
              [scope.M.status]: Object.fromEntries(
                Object.entries(d).filter(([e]) => !h.some((t) => e.startsWith(t))),
              ),
              [scope.M.results]: Object.fromEntries(Object.entries(f).filter(([e]) => !m.has(e))),
              [scope.M.balances]: Object.fromEntries(Object.entries(p).filter(([e]) => !m.has(e))),
            });
          });
        },
      };
    },
    store_Ui_addAccount(scope, e, t) {
      return {
        async addAccount(e) {
          (await (0, scope.Vi)({ action: `add-account`, input: e }), await t().load());
        },
      };
    },
    store_Ui_addAccounts(scope, e, t) {
      return {
        async addAccounts(e, n = !1) {
          if (e.length === 0) return { added: 0, skipped: 0 };
          let r = await (0, scope.Vi)({ action: `add-accounts`, inputs: e, preserveDuplicates: n }),
            i = { added: r.added ?? 0, skipped: r.skipped ?? e.length };
          return (i.added && (await t().load()), i);
        },
      };
    },
    store_Ui_updateAccount(scope, e, t) {
      return {
        async updateAccount(e, n) {
          (await (0, scope.Vi)({ action: `update-account`, accountId: e, patch: n }),
            await t().load());
        },
      };
    },
    store_Ui_removeAccount(scope, e, t) {
      return {
        async removeAccount(e) {
          await t().removeMany([], [e]);
        },
      };
    },
  },
});

export function saveAccountDetails(input, accountId) {
  const actions = appRuntime.scope.Ui.getState();
  return accountId ? actions.updateAccount(accountId, input) : actions.addAccount(input);
}
export function importAccountBatch(inputs, preserveDuplicates = false) {
  return appRuntime.scope.Ui.getState().addAccounts(inputs, preserveDuplicates);
}

/** Keeps both entry modes in one account editor, including their unsaved input. */
export function useAccountBatch({
  open,
  siteId = '',
  accounts = [],
  onImport = importAccountBatch,
}) {
  const React = appRuntime.scope.G;
  const id = React.useId();
  const [text, updateText] = React.useState('');
  const [uniformPassword, updatePassword] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState(null);
  const savingRef = React.useRef(false);
  const wasOpen = React.useRef(false);
  const previousSite = React.useRef(siteId);
  const preview = React.useMemo(
    () => parseAccountBatch(text, { siteId, uniformPassword, accounts }),
    [text, siteId, uniformPassword, accounts],
  );

  React.useEffect(() => {
    if (open && !wasOpen.current) reset();
    wasOpen.current = open;
  }, [open]);
  React.useEffect(() => {
    if (previousSite.current !== siteId) {
      setError('');
      setResult(null);
      previousSite.current = siteId;
    }
  }, [siteId]);

  function reset() {
    if (savingRef.current) return;
    updateText('');
    updatePassword('');
    setError('');
    setResult(null);
  }
  function setText(value) {
    if (savingRef.current) return;
    updateText(value);
    setError('');
    setResult(null);
  }
  function setUniformPassword(value) {
    if (savingRef.current) return;
    updatePassword(value);
    setError('');
    setResult(null);
  }
  async function save(event) {
    event?.preventDefault();
    if (savingRef.current || preview.inputs.length === 0) return;
    savingRef.current = true;
    setSaving(true);
    setError('');
    try {
      const saved = await onImport(
        preview.inputs.map((input) => ({ ...input, loginMethod: 'auto' })),
      );
      if (
        !saved ||
        !Number.isInteger(saved.added) ||
        !Number.isInteger(saved.skipped) ||
        saved.added < 0 ||
        saved.skipped < 0
      ) {
        setError('保存结果尚未确认，请刷新账号列表查看。');
        return;
      }
      setResult({ added: saved.added, skipped: preview.counts.skipped + saved.skipped });
      updateText('');
      updatePassword('');
    } catch {
      setError('批量保存失败，请稍后重试。');
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
    reset,
  };
}

export function AccountAddModes({ mode, disabled, onChange }) {
  const h = appRuntime.scope.G.createElement;
  const modes = [
    { value: 'single', label: '单个添加' },
    { value: 'batch', label: '批量添加' },
  ];
  return h(
    'div',
    { className: 'aah-account-modes', role: 'radiogroup', 'aria-label': '账号添加方式' },
    modes.map(({ value, label }) =>
      h(
        'button',
        {
          key: value,
          type: 'button',
          role: 'radio',
          'aria-checked': mode === value,
          tabIndex: mode === value ? 0 : -1,
          disabled,
          onClick: () => onChange(value),
          onKeyDown: (event) => {
            if (!disabled && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
              event.preventDefault();
              const next =
                event.key === 'Home'
                  ? 'single'
                  : event.key === 'End'
                    ? 'batch'
                    : mode === 'single'
                      ? 'batch'
                      : 'single';
              onChange(next);
              event.currentTarget.parentElement
                .querySelectorAll('button')
                [next === 'single' ? 0 : 1].focus();
            }
          },
        },
        label,
      ),
    ),
  );
}

export function AccountBatchContent({ batch }) {
  const React = appRuntime.scope.G;
  const h = React.createElement;
  const content = React.useRef(null);
  React.useEffect(() => {
    const target = content.current;
    const scrollArea = target?.closest('.aah-modal-content');
    if (scrollArea) scrollArea.scrollTop = 0;
    (target?.querySelector('textarea') ?? target)?.focus();
  }, [batch.result]);

  if (batch.result) {
    return h(
      'section',
      {
        className: 'aah-batch-success',
        role: 'status',
        'aria-live': 'polite',
        ref: content,
        tabIndex: -1,
      },
      h('span', { className: 'aah-batch-success-mark', 'aria-hidden': true }, '✓'),
      h('h4', null, `已添加 ${batch.result.added} 个账号`),
      h(
        'p',
        null,
        batch.result.skipped
          ? `另有 ${batch.result.skipped} 行已跳过，账号列表已更新。`
          : '账号列表已更新，可以开始签到。',
      ),
    );
  }
  const labels = { valid: '可添加', invalid: '无效', duplicate: '重复', existing: '已存在' };
  return h(
    'form',
    {
      id: batch.id,
      className: 'aah-account-batch',
      onSubmit: batch.save,
      ref: content,
      'aria-busy': batch.saving,
    },
    h(
      'div',
      { className: 'aah-batch-field' },
      h('label', { htmlFor: `${batch.id}-text` }, '账号列表'),
      h('textarea', {
        id: `${batch.id}-text`,
        className: 'aah-account-input aah-batch-textarea',
        rows: 4,
        value: batch.text,
        disabled: batch.saving,
        spellCheck: false,
        autoComplete: 'off',
        placeholder: '账号,密码,备注（可选）\nalice,password1,主账号\nbob,password2,备用账号',
        onChange: (event) => batch.setText(event.target.value),
        onKeyDown: (event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            batch.save();
          }
        },
      }),
      h(
        'details',
        { className: 'aah-batch-format' },
        h('summary', null, '填写格式'),
        h(
          'p',
          null,
          '每行一个账号，用逗号或 Tab 分隔账号、密码、备注。支持从表格直接粘贴和带双引号的 CSV。',
        ),
        h(
          'p',
          null,
          '使用统一密码时，每行可以只填账号；需要备注时写成“账号,,备注”。每行已有密码优先使用。',
        ),
      ),
    ),
    h(
      'div',
      { className: 'aah-batch-field' },
      h('label', { htmlFor: `${batch.id}-password` }, '统一密码', h('span', null, '可选')),
      h('input', {
        id: `${batch.id}-password`,
        type: 'password',
        autoComplete: 'new-password',
        className: 'aah-account-input',
        value: batch.uniformPassword,
        disabled: batch.saving,
        placeholder: '用于列表中没有填写密码的账号',
        onChange: (event) => batch.setUniformPassword(event.target.value),
      }),
    ),
    h(
      'p',
      { className: 'aah-batch-context' },
      '仅导入站内账号密码 · GitHub 账号请使用单个添加 · 代理跟随站点设置',
    ),
    batch.preview.rows.length > 0 &&
      h(
        'section',
        { className: 'aah-batch-review' },
        h(
          'div',
          { className: 'aah-batch-review-heading', 'aria-live': 'polite' },
          h('h4', null, '添加预览'),
          h(
            'p',
            null,
            h('strong', null, `可添加 ${batch.preview.counts.valid}`),
            ` · 跳过 ${batch.preview.counts.skipped}`,
          ),
        ),
        h(
          'ol',
          { className: 'aah-batch-preview', 'aria-label': '账号解析预览' },
          batch.preview.rows
            .slice(0, 100)
            .map((row) =>
              h(
                'li',
                { key: row.line, className: `aah-batch-row aah-batch-row-${row.status}` },
                h(
                  'div',
                  { className: 'aah-batch-row-heading' },
                  h('span', { className: 'aah-batch-line' }, row.line),
                  h('strong', { className: 'aah-batch-username' }, row.username || '未填写账号'),
                  h('span', { className: 'aah-batch-row-status' }, labels[row.status]),
                ),
                h(
                  'p',
                  { className: 'aah-batch-row-detail' },
                  row.label ? `${row.label} · ` : '',
                  row.passwordSource === 'missing'
                    ? '未填写密码'
                    : row.passwordSource === 'uniform'
                      ? '使用统一密码'
                      : '密码已填写',
                ),
                row.status !== 'valid' &&
                  h('p', { className: 'aah-batch-row-reason' }, row.message),
              ),
            ),
        ),
        batch.preview.rows.length > 100 &&
          h('p', { className: 'aah-batch-context' }, '预览前 100 行，保存全部有效账号。'),
      ),
    batch.error && h('p', { className: 'aah-batch-error', role: 'alert' }, batch.error),
  );
}

export function AccountBatchFooter({ batch, onClose }) {
  const h = appRuntime.scope.G.createElement;
  return h(
    'div',
    { className: 'aah-account-actions' },
    h(
      'button',
      {
        type: 'button',
        className: 'aah-account-secondary',
        disabled: batch.saving,
        onClick: () => {
          if (!batch.savingRef.current) batch.result ? batch.reset() : onClose();
        },
      },
      batch.result ? '继续添加' : '取消',
    ),
    h(
      'button',
      {
        type: batch.result ? 'button' : 'submit',
        form: batch.result ? undefined : batch.id,
        className: 'aah-account-primary',
        disabled: batch.saving || (!batch.result && batch.preview.inputs.length === 0),
        onClick: batch.result ? onClose : undefined,
      },
      batch.result
        ? '完成'
        : batch.saving
          ? '保存中…'
          : batch.preview.counts.valid
            ? `添加 ${batch.preview.counts.valid} 个账号`
            : '添加账号',
    ),
  );
}
