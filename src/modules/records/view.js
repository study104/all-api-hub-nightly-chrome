/** src/modules/records/view.js: 功能模块实现，保留发布版本的符号以便逐步恢复命名。 */
import { createUiModuleRuntime, createUiScope, initializeUiScope } from '../../shared/ui-scope.js';

// 执行记录、失败说明、余额汇总与余额历史 — sharedUi published scope.
export let ExecutionRecordsView, summarizeBalances;
export const sharedUiRuntime = createUiModuleRuntime({
  bindingNames: ['fd', 'pd', 'md', 'hd', 'gd', '_d', 'vd', 'yd', 'bd', 'xd', 'Sd', 'Cd', 'Nm'],
  publish(name, value) {
    switch (name) {
      case 'Nm':
        ExecutionRecordsView = value;
        break;
      case '_d':
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
      return e
        .toFixed(2)
        .replace(/\.00$/, ``)
        .replace(/(\.\d)0$/, `$1`);
    };
    scope.hd = function hd(e, t, n = `$`) {
      return n === `积分` ? `积分 ${(0, scope.md)(e)}` : `${n}${(0, scope.pd)(e, t).toFixed(4)}`;
    };
    scope.gd = function gd(e, t, n = `$`) {
      return n === `积分` ? `${(0, scope.md)(e)} 积分` : (0, scope.hd)(e, t, n);
    };
    scope._d = function _d(e) {
      let t = 0,
        n = 0,
        r = new Map();
      for (let { balance: i, scale: a } of e) {
        if (!i || i.error) {
          n += 1;
          continue;
        }
        let e = i.symbol ?? `$`,
          o = e === `$` ? `dollar` : e === `积分` ? `points` : `yuan`,
          s = r.get(o);
        (r.set(o, {
          symbol: s?.symbol ?? e,
          amount: (s?.amount ?? 0) + (e === `积分` ? i.quota : (0, scope.pd)(i.quota, a)),
          counted: (s?.counted ?? 0) + 1,
        }),
          (t += 1));
      }
      let i = (e) => (e === `$` ? 0 : e === `积分` ? 2 : 1),
        a = [...r.values()].sort((e, t) => i(e.symbol) - i(t.symbol));
      return { dollars: r.get(`dollar`)?.amount ?? 0, counted: t, missing: n, currencies: a };
    };
    scope.vd = function vd(e) {
      return e.counted === 0
        ? `未获取`
        : e.currencies.map(({ symbol: e, amount: t }) => (0, scope.hd)(t, {}, e)).join(` + `);
    };
    scope.yd = function yd(e, t, n = Date.now()) {
      if (e && !e.error) return { balance: e, fromCheckinResult: !1 };
      let r = t?.metrics?.quotaAfter;
      if (r == null) return { balance: e, fromCheckinResult: !1 };
      let i = t?.metrics?.balanceSymbol ?? e?.symbol;
      return {
        balance: {
          quota: r,
          usedQuota: e?.usedQuota ?? 0,
          ...(i ? { symbol: i } : {}),
          at: n,
          source: `api`,
        },
        fromCheckinResult: !0,
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
      return e.nameOnly === !0;
    };
    scope.Sd = function Sd(e) {
      let t = e.trim().toLowerCase();
      return t === `localhost` || t === `127.0.0.1` || t === `::1` || t === `[::1]`;
    };
    scope.Cd = function Cd(e) {
      let t = String(e.scheme).trim().toLowerCase(),
        n =
          t === `socks`
            ? `socks5`
            : t === `mixed`
              ? `http`
              : t === `https` || t === `socks4` || t === `socks5`
                ? t
                : `http`;
      return n === `https` && (0, scope.Sd)(e.host) ? `http` : n;
    };
    scope.Nm = function Nm({ sites: e, accounts: n, resultOf: i, statusOf: a }) {
      let [s, c] = (0, scope.k.useState)(`全部`),
        l = (0, scope.k.useMemo)(() => new Map(e.map((e) => [e.id, e.name])), [e]),
        u = (0, scope.k.useMemo)(
          () =>
            n
              .map((e) => ({ account: e, result: i(e.id), status: a(e.id) }))
              .filter((e) => e.result != null)
              .sort((e, t) => (t.result?.at ?? 0) - (e.result?.at ?? 0)),
          [n, i, a],
        ),
        d = u.filter((e) =>
          s === `成功` ? e.result?.ok === !0 : s !== `失败` || e.result?.ok === !1,
        ),
        f = u.filter((e) => e.result?.ok === !0).length,
        p = u.filter((e) => e.result?.ok === !1).length,
        m = u.length ? Math.round((f / u.length) * 100) : 0;
      return (0, scope.O.jsxs)(`div`, {
        className: `space-y-4`,
        children: [
          (0, scope.O.jsxs)(`div`, {
            children: [
              (0, scope.O.jsx)(`h1`, {
                className: `text-xl font-bold tracking-tight`,
                children: `执行记录`,
              }),
              (0, scope.O.jsx)(`p`, {
                className: `mt-1 text-[11px] text-ink-800/55 dark:text-ink-100/50`,
                children: `每个账号最近一次执行的步骤流水，失败的那一步直接标出原因。`,
              }),
            ],
          }),
          (0, scope.O.jsxs)(`section`, {
            className: `grid gap-3 sm:grid-cols-2 xl:grid-cols-4`,
            'aria-label': `执行统计`,
            children: [
              (0, scope.O.jsx)(scope.jm, {
                label: `有记录账号`,
                value: u.length,
                detail: `共 ${n.length} 个账号`,
                tone: `blue`,
                icon: scope.o,
              }),
              (0, scope.O.jsx)(scope.jm, {
                label: `成功率`,
                value: `${m}%`,
                detail: `成功 ${f} 条`,
                tone: `mint`,
                icon: scope.t,
              }),
              (0, scope.O.jsx)(scope.jm, {
                label: `失败`,
                value: p,
                detail: `最近一次未成功`,
                tone: `coral`,
                icon: scope.b,
              }),
              (0, scope.O.jsx)(scope.jm, {
                label: `需处理`,
                value: n.filter((e) => a(e.id) === `attention`).length,
                detail: `等待人工验证`,
                tone: `amber`,
                icon: scope._,
              }),
            ],
          }),
          (0, scope.O.jsx)(`div`, {
            className: `flex flex-wrap items-center gap-2`,
            children: (0, scope.O.jsx)(`div`, {
              className: `flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900`,
              role: `tablist`,
              'aria-label': `执行结果筛选`,
              children: [`全部`, `成功`, `失败`].map((e) =>
                (0, scope.O.jsx)(
                  `button`,
                  {
                    type: `button`,
                    'aria-selected': s === e,
                    onClick: () => c(e),
                    className: (0, scope.$)(
                      `h-7 rounded-md px-3 text-[11px] font-medium transition-colors`,
                      s === e
                        ? `bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300`
                        : `text-ink-800/55 hover:text-ink-900 dark:text-ink-100/50`,
                    ),
                    children: e,
                  },
                  e,
                ),
              ),
            }),
          }),
          (0, scope.O.jsxs)(`section`, {
            className: `space-y-2`,
            'aria-label': `执行流水`,
            children: [
              d.map(({ account: e, result: t, status: n }) => {
                let r = t?.ok === !0,
                  i = t?.steps ?? [];
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
                              r
                                ? `bg-mint-50 text-mint-700 dark:bg-mint-600/15 dark:text-mint-300`
                                : `bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300`,
                            ),
                            children: r
                              ? (0, scope.O.jsx)(scope.o, { className: `size-3.5` })
                              : (0, scope.O.jsx)(scope.b, { className: `size-3.5` }),
                          }),
                          (0, scope.O.jsxs)(`span`, {
                            className: `min-w-0 flex-1`,
                            children: [
                              (0, scope.O.jsxs)(`strong`, {
                                className: `block truncate text-xs font-semibold text-ink-900 dark:text-ink-50`,
                                children: [
                                  e.label || e.username,
                                  (0, scope.O.jsx)(`em`, {
                                    className: `ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium not-italic text-ink-800/55 dark:bg-slate-800 dark:text-ink-100/50`,
                                    children: l.get(e.siteId) ?? `未知站点`,
                                  }),
                                ],
                              }),
                              (0, scope.O.jsx)(`span`, {
                                className: `mt-0.5 block truncate text-[11px] text-ink-800/55 dark:text-ink-100/50`,
                                children: t?.message || `无附加说明`,
                              }),
                            ],
                          }),
                          (0, scope.O.jsx)(`span`, {
                            className: (0, scope.$)(
                              `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold`,
                              scope.Am[n],
                            ),
                            children: scope.km[n],
                          }),
                        ],
                      }),
                      i.length > 0 &&
                        (0, scope.O.jsx)(`ol`, {
                          className: `divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800/70 dark:border-slate-800/70`,
                          children: i.map((n, r) => {
                            let a = r === i.length - 1,
                              s = a && t?.ok === !1;
                            return (0, scope.O.jsxs)(
                              `li`,
                              {
                                className: `flex items-start gap-2.5 px-4 py-2`,
                                children: [
                                  (0, scope.O.jsx)(`span`, {
                                    className: (0, scope.$)(
                                      `mt-0.5 grid size-4 shrink-0 place-items-center rounded-full`,
                                      s
                                        ? `bg-rose-50 text-rose-600 dark:bg-rose-950/40`
                                        : `bg-mint-50 text-mint-700 dark:bg-mint-600/15`,
                                    ),
                                    children: s
                                      ? (0, scope.O.jsx)(scope.b, { className: `size-2.5` })
                                      : (0, scope.O.jsx)(scope.o, { className: `size-2.5` }),
                                  }),
                                  (0, scope.O.jsx)(`span`, {
                                    className: `min-w-0 flex-1 text-[11px] text-ink-800/75 dark:text-ink-100/65`,
                                    children: n,
                                  }),
                                  a &&
                                    (0, scope.O.jsx)(`span`, {
                                      className: (0, scope.$)(
                                        `shrink-0 text-[10px]`,
                                        s
                                          ? `text-rose-600 dark:text-rose-400`
                                          : `text-mint-700 dark:text-mint-300`,
                                      ),
                                      children: s ? `中断` : `完成`,
                                    }),
                                ],
                              },
                              `${e.id}-${r}`,
                            );
                          }),
                        }),
                      t?.manual &&
                        (0, scope.O.jsx)(`p`, {
                          className: `border-t border-amber-100 bg-amber-50/60 px-4 py-2 text-[10px] text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300`,
                          children: `用户手动标记的结果：这条没有扩展的守恒差分证据，仅作记录。`,
                        }),
                    ],
                  },
                  e.id,
                );
              }),
              !d.length &&
                (0, scope.O.jsxs)(`div`, {
                  className: `flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-14 text-center dark:border-slate-700`,
                  children: [
                    (0, scope.O.jsx)(scope.r, {
                      className: `size-6 text-ink-800/25 dark:text-ink-100/20`,
                    }),
                    (0, scope.O.jsx)(`strong`, {
                      className: `text-xs text-ink-800/70 dark:text-ink-100/60`,
                      children: `还没有执行记录`,
                    }),
                    (0, scope.O.jsx)(`span`, {
                      className: `text-[11px] text-ink-800/45 dark:text-ink-100/40`,
                      children: `先执行一次签到，这里会留下每一步的结果`,
                    }),
                  ],
                }),
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

// 执行记录、失败说明、余额汇总与余额历史 — app published scope.
export let BalanceHistoryDialog, classifyExecutionFailure, FailureGuidance;
export const appRuntime = createUiModuleRuntime({
  bindingNames: [
    'Sr',
    'Cr',
    'wr',
    'Tr',
    'Er',
    'Dr',
    'Or',
    'kr',
    'Ar',
    'jr',
    'Mr',
    'Nr',
    'Yi',
    'Xi',
    'Zi',
    'Qi',
    '$i',
    'ea',
    'ta',
    'Z',
    'na',
    'ra',
    'ia',
    'aa',
    'oa',
    'sa',
    'Ba',
    'Va',
    'Ha',
    'Ua',
  ],
  publish(name, value) {
    switch (name) {
      case 'Ba':
        BalanceHistoryDialog = value;
        break;
      case 'sa':
        classifyExecutionFailure = value;
        break;
      case 'aa':
        FailureGuidance = value;
        break;
    }
  },
  register(scope) {
    scope.Sr = function Sr(e) {
      return {
        quota: e.quota,
        usedQuota: e.usedQuota,
        ...(e.symbol ? { symbol: e.symbol } : {}),
        at: e.at,
        source: e.source ?? `api`,
      };
    };
    scope.Cr = function Cr(e) {
      return (0, scope.q)(new Date(e));
    };
    scope.wr = function wr(e, t = 90) {
      let n = Object.keys(e).sort().slice(-t);
      return Object.fromEntries(n.map((t) => [t, e[t]]));
    };
    scope.Tr = function Tr(e, t, n = 90) {
      let r = { ...(e?.daily ?? {}) };
      if (e && !e.error && !e.daily && Number.isFinite(e.at)) {
        let t = (0, scope.Sr)(e);
        r[(0, scope.Cr)(t.at)] = { first: t, latest: t };
      }
      let i = (0, scope.Sr)(t),
        a = (0, scope.Cr)(i.at),
        o = r[a] ?? {},
        s = !o.first || i.at < o.first.at ? i : o.first,
        c = !o.latest || i.at >= o.latest.at ? i : o.latest;
      return ((r[a] = { ...o, first: s, latest: c }), (0, scope.wr)(r, n));
    };
    scope.Er = function Er(e, t, n, r, i = 90, a) {
      let o = e?.[t],
        s = a ?? (o?.checkinReward === n ? o.checkinRewardSymbol : void 0),
        c = { ...(o ?? {}), checkinReward: n, checkinRewardAt: r };
      return (
        s ? (c.checkinRewardSymbol = s) : delete c.checkinRewardSymbol,
        (0, scope.wr)({ ...(e ?? {}), [t]: c }, i)
      );
    };
    scope.Or = function Or(e, t = 7) {
      if (!e?.daily) return [];
      let n = Object.entries(e.daily)
        .filter((e) => !!e[1].first && !!e[1].latest)
        .sort(([e], [t]) => e.localeCompare(t));
      return n
        .map(([e, t], r) => {
          let i = n[r - 1],
            a =
              t.latest.at > t.first.at ? (0, scope.Dr)(t.latest) - (0, scope.Dr)(t.first) : void 0;
          return {
            day: e,
            first: t.first,
            latest: t.latest,
            ...(a == null ? {} : { withinDayDelta: a }),
            ...(i
              ? {
                  previousDay: i[0],
                  previousDayDelta: (0, scope.Dr)(t.latest) - (0, scope.Dr)(i[1].latest),
                }
              : {}),
            ...(t.checkinReward == null
              ? {}
              : {
                  checkinReward: t.checkinReward,
                  ...(t.checkinRewardSymbol ? { checkinRewardSymbol: t.checkinRewardSymbol } : {}),
                }),
          };
        })
        .slice(-t)
        .reverse();
    };
    scope.jr = function jr(e, t) {
      let n = t.quota + t.usedQuota - (e.quota + e.usedQuota),
        r = t.usedQuota - e.usedQuota;
      return {
        reward: n,
        usageDelta: r,
        balanceDelta: t.quota - e.quota,
        verdict: n > scope.Ar ? `rewarded` : r > scope.Ar ? `already-used` : `unchanged`,
        source: `balance-diff`,
        quotaAfter: t.quota,
        ...(t.symbol ? { balanceSymbol: t.symbol } : {}),
      };
    };
    scope.Mr = function Mr(e, t = (0, scope.q)()) {
      let n = e?.daily;
      if (!n) return null;
      let r = n[t];
      if (!r?.latest) return null;
      let i = [];
      r.first &&
        r.latest.at > r.first.at &&
        i.push({
          metrics: (0, scope.jr)(r.first, r.latest),
          baselineDay: t,
          currentDay: t,
          basis: `within-day`,
        });
      let a = Object.keys(n)
          .filter((e) => e < t && !!n[e]?.latest)
          .sort()
          .pop(),
        o = a ? n[a]?.latest : void 0;
      return (
        a &&
          o &&
          i.push({
            metrics: (0, scope.jr)(o, r.latest),
            baselineDay: a,
            currentDay: t,
            basis: `previous-day`,
          }),
        i.find((e) => e.metrics.verdict === `rewarded`) ?? i[0] ?? null
      );
    };
    scope.Nr = function Nr(e, t, n = (0, scope.q)()) {
      let r = (0, scope.Mr)(t, n),
        i = r?.metrics.verdict === `rewarded`,
        a =
          r?.basis === `within-day`
            ? `今天首次与最新余额快照`
            : r
              ? `${r.baselineDay} 与今天的余额快照`
              : null;
      return {
        accountId: e,
        ok: !0,
        manual: !0,
        message: i
          ? `${scope.kr}，已按余额差值计算增加量`
          : r
            ? `${scope.kr}，余额差值未增加`
            : scope.kr,
        steps: [
          `用户在管理页手动标记本次签到已完成`,
          ...(a ? [`已按${a}计算总额度差值`] : [`没有可用的历史余额基线，无法计算增加量`]),
          ...(i ? [`该增加量是余额期间差值，可能包含同期间充值或其它入账`] : []),
        ],
        ...(r ? { metrics: r.metrics } : {}),
      };
    };
    scope.Qi = function Qi({ status: e, evidence: t, method: n }) {
      let r = (0, scope.Ki)(n),
        i = e === `done` && t ? scope.Zi[t] : scope.Yi[e],
        a = scope.Xi[e],
        o = {
          label:
            e === `attention`
              ? `需处理`
              : e === `failed`
                ? `失败`
                : e === `done`
                  ? t === `manual`
                    ? `手动标记`
                    : !t || t === `unverified`
                      ? `${r.done}?`
                      : r.done
                  : (0, scope.Ji)(e, n),
          cls: i,
        },
        s = e === `done` ? `done-${t ?? `none`}` : e;
      return (0, scope.W.jsx)(scope.O, {
        mode: `wait`,
        initial: !1,
        children: (0, scope.W.jsxs)(
          scope.w.span,
          {
            'data-status': e,
            'data-comic-state': a,
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
              o.cls,
            ),
            children: [(0, scope.W.jsx)(scope.$i, { status: e, evidence: t }), o.label],
          },
          s,
        ),
      });
    };
    scope.$i = function $i({ status: e, evidence: t }) {
      let n = scope.Xi[e],
        r = (0, scope.R)(`status-badge-indicator`, `status-badge-indicator-${n}`);
      return e === `running`
        ? (0, scope.W.jsx)(scope.u, { className: (0, scope.R)(r, `size-3 animate-spin`) })
        : e === `attention`
          ? (0, scope.W.jsx)(scope.p, { className: (0, scope.R)(r, `size-3`) })
          : e === `failed`
            ? (0, scope.W.jsx)(scope.g, { className: (0, scope.R)(r, `size-3`) })
            : e === `done`
              ? t === `manual`
                ? (0, scope.W.jsx)(scope.w.span, {
                    className: r,
                    initial: { scale: 0, rotate: -30 },
                    animate: { scale: 1, rotate: 0 },
                    transition: { type: `spring`, stiffness: 600, damping: 18 },
                    children: (0, scope.W.jsx)(scope.Tt, { className: `size-3` }),
                  })
                : t === `unverified` || !t
                  ? (0, scope.W.jsx)(scope.Se, { className: (0, scope.R)(r, `size-3`) })
                  : t === `verified`
                    ? (0, scope.W.jsx)(scope.w.span, {
                        className: r,
                        initial: { scale: 0, rotate: -30 },
                        animate: { scale: 1, rotate: 0 },
                        transition: { type: `spring`, stiffness: 600, damping: 18 },
                        children: (0, scope.W.jsx)(scope.U, { className: `size-3 stroke-[3]` }),
                      })
                    : (0, scope.W.jsx)(scope.w.span, {
                        className: r,
                        initial: { scale: 0, rotate: -30 },
                        animate: { scale: 1, rotate: 0 },
                        transition: { type: `spring`, stiffness: 600, damping: 18 },
                        children: (0, scope.W.jsx)(scope.o, { className: `size-3 stroke-[3]` }),
                      })
              : (0, scope.W.jsx)(`span`, {
                  className: (0, scope.R)(r, `size-1.5 rounded-full bg-current`),
                });
    };
    scope.ea = function ea(e) {
      if (!e?.ok) return null;
      if (e.manual) return `manual`;
      let t = e.metrics?.verdict;
      return t === `rewarded`
        ? e.metrics?.source === `visible-reward` || e.metrics?.source === `checkin-ledger`
          ? `reported`
          : `verified`
        : t === `unchanged` || t === `already-used`
          ? `observed`
          : `unverified`;
    };
    scope.ta = function ta(e, t) {
      return e === `verified`
        ? `额度确实增加了，签到成功可确认`
        : e === `reported` && t?.metrics?.source === `checkin-ledger`
          ? `签到卡记录了今天的奖励，余额差分未确认本轮增加`
          : e === `reported`
            ? `签到卡显示本次奖励，余额接口尚未同步`
            : e === `observed` && t?.metrics?.source === `checkin-ledger`
              ? `站点明确显示今日已签到，本次未重复点击，余额未变化`
              : e === `observed`
                ? `读到了签到前后的额度，但额度没有变化`
                : e === `unverified`
                  ? `读不到额度变化，「成功」仅来自站点提示，扩展无法确认`
                  : e === `manual` && t?.metrics?.verdict === `rewarded`
                    ? `你手动标记的；增加量按已保存余额的总额度差值估算，可能包含同期间其它入账`
                    : e === `manual` && t?.metrics
                      ? `你手动标记的；已比较历史余额，但总额度没有增加`
                      : e === `manual`
                        ? `你手动标记的；没有历史余额基线，无法计算增加量`
                        : null;
    };
    scope.aa = function aa({ code: e }) {
      let t = scope.ia[e];
      return t
        ? (0, scope.W.jsx)(scope.w.div, {
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.18 },
            'data-diagnosis-code': e,
            className: (0, scope.R)(
              `rounded-lg px-2.5 py-2 ring-1 ring-inset`,
              `bg-amber-500/[0.07] ring-amber-500/20 dark:bg-amber-400/[0.06]`,
            ),
            children: (0, scope.W.jsxs)(`div`, {
              className: `flex gap-2`,
              children: [
                (0, scope.W.jsx)(scope.g, {
                  className: `mt-px size-3.5 shrink-0 text-amber-600 dark:text-amber-400`,
                }),
                (0, scope.W.jsxs)(`div`, {
                  className: `min-w-0 space-y-1.5`,
                  children: [
                    (0, scope.W.jsx)(`p`, {
                      'data-diagnosis-title': !0,
                      className: `text-[11px] font-semibold text-amber-900 dark:text-amber-100`,
                      children: t.title,
                    }),
                    (0, scope.W.jsx)(`p`, {
                      className: `text-[11px] leading-relaxed text-ink-800/70 dark:text-ink-100/60`,
                      children: t.detail,
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `space-y-0.5`,
                      children: [
                        (0, scope.W.jsxs)(`p`, {
                          className: `flex items-center gap-1 text-[10px] font-medium text-amber-800/80 dark:text-amber-200/80`,
                          children: [
                            (0, scope.W.jsx)(scope.qe, { className: `size-3 shrink-0` }),
                            `下一步`,
                          ],
                        }),
                        (0, scope.W.jsx)(`ul`, {
                          'data-diagnosis-actions': !0,
                          className: `space-y-0.5`,
                          children: t.nextActions.map((e, t) =>
                            (0, scope.W.jsxs)(
                              `li`,
                              {
                                className: `flex gap-1.5 text-[11px] leading-relaxed text-ink-800/60 dark:text-ink-100/50`,
                                children: [
                                  (0, scope.W.jsxs)(`span`, {
                                    className: `shrink-0 opacity-45`,
                                    children: [t + 1, `.`],
                                  }),
                                  (0, scope.W.jsx)(`span`, { children: e }),
                                ],
                              },
                              t,
                            ),
                          ),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          })
        : null;
    };
    scope.Ba = function Ba({ rows: e, quotaPerUnit: t, family: n }) {
      let r = { quotaPerUnit: t, family: n };
      return (0, scope.W.jsxs)(`section`, {
        'aria-label': `余额历史`,
        children: [
          (0, scope.W.jsxs)(`div`, {
            className: `flex items-center justify-between gap-2 text-[10px] text-slate-500`,
            children: [
              (0, scope.W.jsxs)(`span`, {
                className: `inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200`,
                children: [(0, scope.W.jsx)(scope.a, { className: `size-3` }), `余额记录`],
              }),
              (0, scope.W.jsxs)(`span`, { children: [`最近 `, e.length, ` 个日期`] }),
            ],
          }),
          (0, scope.W.jsx)(`div`, {
            className: `mt-1 divide-y divide-slate-200 dark:divide-slate-700`,
            children: e.map((e) => {
              let t = (0, scope.Va)(e.day),
                n =
                  e.withinDayDelta == null
                    ? e.previousDay && e.previousDayDelta != null
                      ? {
                          label: `较${(0, scope.Va)(e.previousDay).label}`,
                          value: e.previousDayDelta,
                        }
                      : null
                    : { label: `当天`, value: e.withinDayDelta },
                i =
                  e.latest.source === `visible`
                    ? `页面可见余额；页面未提供累计消耗时，差额证据较弱`
                    : `结构化余额接口`;
              return (0, scope.W.jsxs)(
                `div`,
                {
                  'data-balance-day': e.day,
                  className: `grid min-w-0 grid-cols-[minmax(82px,0.8fr)_minmax(100px,1fr)] items-center gap-x-3 gap-y-1 py-1.5 text-[10px] sm:grid-cols-[minmax(100px,0.8fr)_minmax(110px,1fr)_minmax(150px,1.3fr)]`,
                  children: [
                    (0, scope.W.jsxs)(`div`, {
                      className: `min-w-0`,
                      children: [
                        (0, scope.W.jsx)(`span`, {
                          className: `font-semibold text-slate-700 dark:text-slate-200`,
                          children: t.label,
                        }),
                        t.detail &&
                          (0, scope.W.jsx)(`span`, {
                            className: `ml-1 text-slate-400`,
                            children: t.detail,
                          }),
                      ],
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `flex min-w-0 items-center gap-1.5`,
                      children: [
                        (0, scope.W.jsx)(`span`, {
                          className: `font-semibold tabular-nums text-slate-800 dark:text-slate-100`,
                          children: (0, scope.ae)(e.latest.quota, r, e.latest.symbol),
                        }),
                        (0, scope.W.jsx)(`span`, {
                          title: i,
                          className: (0, scope.R)(
                            `shrink-0 font-medium`,
                            e.latest.source === `visible`
                              ? `text-amber-600 dark:text-amber-400`
                              : `text-blue-600 dark:text-blue-400`,
                          ),
                          children: e.latest.source === `visible` ? `页面` : `API`,
                        }),
                      ],
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `col-span-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-500 sm:col-span-1 sm:justify-end`,
                      children: [
                        n &&
                          (0, scope.W.jsxs)(`span`, {
                            children: [
                              n.label,
                              ` `,
                              (0, scope.W.jsx)(`strong`, {
                                className: (0, scope.R)(
                                  `tabular-nums`,
                                  n.value > 0
                                    ? `text-emerald-600 dark:text-emerald-400`
                                    : n.value < 0
                                      ? `text-rose-600 dark:text-rose-400`
                                      : `text-slate-600 dark:text-slate-300`,
                                ),
                                children: (0, scope.Ha)(n.value, r, e.latest.symbol),
                              }),
                            ],
                          }),
                        e.checkinReward != null &&
                          (0, scope.W.jsxs)(`span`, {
                            className: `text-emerald-700 dark:text-emerald-300`,
                            children: [
                              `奖励 `,
                              (0, scope.W.jsxs)(`strong`, {
                                className: `tabular-nums`,
                                children: [
                                  `+`,
                                  (0, scope.ne)(e.checkinReward, r, e.checkinRewardSymbol),
                                ],
                              }),
                            ],
                          }),
                      ],
                    }),
                  ],
                },
                e.day,
              );
            }),
          }),
        ],
      });
    };
    scope.Va = function Va(e, t = new Date()) {
      let n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
      if (!n) return { label: e };
      let r = Number(n[1]),
        i = Number(n[2]),
        a = Number(n[3]),
        o = /^(\d{4})-(\d{2})-(\d{2})$/.exec((0, scope.q)(t));
      if (!o) return { label: e };
      let s = Number(o[1]),
        c = Date.UTC(s, Number(o[2]) - 1, Number(o[3])) / 864e5 - Date.UTC(r, i - 1, a) / 864e5,
        l = `${i}月${a}日`;
      return c === 0
        ? { label: `今天`, detail: l }
        : c === 1
          ? { label: `昨天`, detail: l }
          : c === 2
            ? { label: `前天`, detail: l }
            : r === s
              ? { label: l }
              : { label: `${r}年${l}` };
    };
    scope.Ha = function Ha(e, t, n) {
      let r = (0, scope.ne)(Math.abs(e), t, n);
      return e > 0 ? `+${r}` : e < 0 ? `-${r}` : r;
    };
    scope.Ua = function Ua(e, t, n) {
      let r = e?.rewardSymbol ?? e?.balanceSymbol;
      return e?.verdict === `rewarded` && e.reward
        ? `+${(0, scope.ne)(e.reward, { quotaPerUnit: t, family: n }, r)}`
        : null;
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
          failed: `bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/30`,
        };
        break;
      }
      case 4: {
        scope.Xi = {
          pending: `thunder-flicker`,
          running: `armor-reactor`,
          attention: `mystic-portal`,
          done: `shield-glint`,
          failed: `titan-impact`,
        };
        break;
      }
      case 5: {
        scope.Zi = {
          verified: `bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30`,
          reported: `bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 ring-cyan-500/30`,
          observed: `bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30`,
          unverified: `bg-ink-100 text-ink-800/70 ring-black/8 dark:bg-white/10 dark:text-ink-100/75 dark:ring-white/15`,
          manual: `bg-ink-100 text-ink-800/70 ring-black/8 dark:bg-white/10 dark:text-ink-100/75 dark:ring-white/15`,
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
          UNKNOWN: `unknown`,
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
              `展开账号详情，看最后一步卡在找什么元素；日志里的「页面可点元素」列出的是页面上真实存在的按钮`,
            ],
          },
          [scope.Z.ELEMENT_MISMATCH]: {
            title: `命中了错误的元素`,
            detail: `保存的选择器还在，但它现在指向的已经不是当初学习的那个控件 —— 同文案按钮变多、列表增删导致位置错位，都可能是原因。`,
            nextActions: [
              scope.na,
              `展开账号详情，对比日志里的「期望指纹 / 实际指纹」，能看出站点把哪个字段改掉了`,
            ],
          },
          [scope.Z.WORKFLOW_CONFIG]: {
            title: `已保存的学习流程配置不完整`,
            detail: `流程本身缺少必要环节（例如没有记录到能显示当前账号的资料页）。这不是登录状态失效，重试也不会变好。`,
            nextActions: [
              `在账号行点「学习本站流程」重录一遍：先访问能显示当前账号的个人资料页，再完成签到，最后点「结束学习」`,
              `若不想用录制流程：编辑本站，把签到方式切回「自动识别」`,
            ],
          },
          [scope.Z.IDENTITY_ROUTE_UNREACHABLE]: {
            title: `没有到达账号核验页面`,
            detail: `自动登录或换号后，流程没能进入账号核验页，或在页面间反复跳转后停止。当前账号尚未核对，因此本轮没有继续签到。`,
            nextActions: [
              `展开账号详情，查看最后停留的页面，确认本站登录页和账号核验页地址能够正常打开`,
              `保留已保存的本站流程，重新执行一次，让换号后的流程从起点进入账号核验页`,
              `若每次都跳回登录页，核对该账号密码及站点登录状态`,
            ],
          },
          [scope.Z.IDENTITY_UNCONFIRMED]: {
            title: `无法确认当前登录的是目标账号`,
            detail: `本轮没有取得足够且一致的身份信息，或自动换号后读到的仍是其他账号。扩展已停止签到，避免把结果记到错误账号。账号备注和第三方显示名不会覆盖已绑定的用户 ID。`,
            nextActions: [
              `展开账号详情，对照日志里的当前用户 ID、目标用户 ID 和最终核验原因`,
              `核对本账号保存的登录凭据；使用 GitHub 登录时，检查该账号的 GitHub 用户名或邮箱和密码`,
              `确认页面已完整加载后重新执行，扩展会使用已保存的本站流程重新登录和核对身份`,
            ],
          },
          [scope.Z.IDENTITY_EVIDENCE_CONFLICT]: {
            title: `账号身份信息相互冲突`,
            detail: `当前身份响应或页面读到了不同的用户 ID，复核后仍无法唯一确定当前账号。扩展已停止签到，并保留本账号原有的用户 ID 绑定。`,
            nextActions: [
              `展开账号详情，查看冲突的用户 ID、目标用户 ID 以及它们的读取来源`,
              `等待页面加载完成后重新执行，继续使用已保存的本站流程重新读取身份`,
              `若冲突持续存在，核对本账号的登录凭据，并确认站点页面显示的是目标账号`,
            ],
          },
          [scope.Z.AUTH_EXPIRED]: {
            title: `登录状态已失效`,
            detail: `站点不再认这个会话（cookie 过期、被别处登录顶下线，或站点主动清退了会话）。`,
            nextActions: [
              `直接再点一次执行，扩展会自动重新走登录`,
              `若反复失效，编辑账号核对密码是否仍然有效`,
            ],
          },
          [scope.Z.SESSION_SWITCH_FAILED]: {
            title: `无法安全切换到目标账号`,
            detail: `站点 cookie 没清干净，或当前会话仍是别的账号。扩展在这里停下是故意的：确认不了身份就继续签到，会把奖励记到错账号上。`,
            nextActions: [
              `确认当前加载的是最新版扩展（需要 Cookie 权限），然后在扩展管理页点一次「重新加载」`,
              `展开账号详情，看 Log 里是「清理失败」还是「仍有残留」，两者处理方式不同`,
              `关掉该站点的其它标签页后重试 —— 活着的页面会不断重建会话`,
            ],
          },
          [scope.Z.SITE_UNAVAILABLE]: {
            title: `站点暂时不可用`,
            detail: `站点源服务器返回了 5xx 或限流响应（网关错误、Cloudflare 源站故障）。这是站点侧的问题，与你的配置无关。`,
            nextActions: [
              `稍后重试，通常几分钟到几十分钟会自行恢复`,
              `确认在浏览器里直接打开该站点也是同样结果；如果你能打开、扩展不能，检查代理设置`,
            ],
          },
          [scope.Z.SITE_REJECTED]: {
            title: `站点明确拒绝了这次操作`,
            detail: `这是站点的业务规则（余额不足、活动结束、账号被封禁、理由与历史重复等），不是网络或配置问题。重试结果不会变。`,
            nextActions: [
              `展开账号详情，读站点返回的原话，通常会说明具体原因`,
              `按站点提示处理后（例如换一条领取理由、补充余额）再重试`,
            ],
          },
          [scope.Z.ACCESS_DENIED]: {
            title: `访问被站点拒绝（403）`,
            detail: `站点返回了 403 Forbidden。常见原因是出口 IP 所在地区被限制，或站点对你的 IP 做了风控拦截。`,
            nextActions: [
              `在账号行把代理换成与站点同地区的节点，再执行一次`,
              `确认该站点在浏览器里直接访问是否同样被拒；若直连正常，说明是代理出口被站点拉黑了`,
              `换一个浏览器配置（账号）访问对比，判断是站点风控还是账号问题`,
            ],
          },
          [scope.Z.MANUAL_REQUIRED]: {
            title: `需要你在页面上完成一步`,
            detail: `站点弹出了验证码、滑块或二次验证，扩展不会替你绕过。任务会停在这里等你，不会自动跳过。`,
            nextActions: [
              `切到扩展打开的站点标签页，按页面提示完成验证`,
              `完成后回到扩展页，点该账号的「执行」继续；扩展会接着往下跑`,
            ],
          },
          [scope.Z.NO_CHECKIN_ENTRY]: {
            title: `没找到可用的签到入口`,
            detail: `当前站点页面上没有可点击的签到控件，也没有能自动发现的签到入口链接。有的站点登录即算签到。`,
            nextActions: [
              `若该站点登录即算签到：编辑本站，把签到方式改为「登录即签到」`,
              `若签到入口在特定页面：编辑本站，手动指定签到页地址和按钮选择器`,
              scope.ra,
            ],
          },
          [scope.Z.PAGE_TIMEOUT]: {
            title: `页面长时间没有加载出来`,
            detail: `等待页面或页面里的元素超时。可能是站点响应慢、网络/代理慢，或者页面把自己渲染成了空白。`,
            nextActions: [
              `在浏览器里直接打开该站点，确认页面本身能打开；打不开说明是站点或网络问题`,
              `若用了代理，换一个节点再试 —— 慢节点会让每个请求都吃满超时`,
              `展开账号详情，看日志停在「打开页面」还是「等待控件」，据此判断是页面没来还是控件没来`,
            ],
          },
          [scope.Z.OBSCURED]: {
            title: `控件被弹窗挡住了`,
            detail: `页面上有公告或弹窗盖住了签到控件，扩展清完遮挡仍然点不到目标。`,
            nextActions: [
              `先手动把站点的公告/弹窗关掉，再重新执行一次`,
              `若每次都被同一个弹窗挡住：编辑本站，在「关闭弹窗选择器」里补上它的关闭按钮`,
              scope.ra,
            ],
          },
          [scope.Z.CHECKIN_UNVERIFIED]: {
            title: `登录即签到尚未确认`,
            detail: `本站配置为「登录即签到」：登录本身就算签到，页面上没有签到按钮。这一轮打开页面时已经是登录状态，扩展没有重新登录，所以没有一次可以归到今天的登录动作；页面上也没有「已签到 / 签到成功」之类的完成提示。为了不给你一个无法核实的绿色对勾，扩展没有把它记成已完成。`,
            nextActions: [
              `切到本站标签页确认今天的额度/余额是否已经增加；增加了就在账号行手动标记完成`,
              `想每轮都强制拿到奖励：编辑本站，把签到方式改成「退出再登录」（配好退出接口或退出按钮），每轮都重新走一次登录`,
              `若本站其实是登录后仍需点一次签到按钮的站点：在账号行点「学习本站流程」重录一遍（先过一遍资料页再进签到页）`,
            ],
          },
          [scope.Z.CHECKIN_NO_BASELINE]: {
            title: `已登录，但无法确认奖励到账`,
            detail: `本站配置为「登录即签到」，这一轮扩展已经完成登录。确认到账要对比登录前后的余额，但这个账号在本轮开始前 36 小时内没有一次成功读到的余额，没有可对比的基线；页面上也没有「已签到 / 签到成功」之类的完成提示。这次已经读到并保存了当前余额，下一轮就有基线可用。`,
            nextActions: [
              `切到本站标签页确认今天的额度/余额是否已经增加；增加了就在账号行手动标记完成`,
              `下一轮执行会用这次保存的余额做基线，通常不用额外处理；两次执行间隔不要超过 36 小时`,
              `若本站其实是登录后仍需点一次签到按钮的站点：在账号行点「学习本站流程」重录一遍（先过一遍资料页再进签到页）`,
            ],
          },
          [scope.Z.CONTROL_DISABLED]: {
            title: `签到控件存在但当前不可点`,
            detail: `按钮在页面上，但处于禁用态。常见两种原因：站点还没把签到状态拉回来（渲染早于接口返回），或这个账号今天已经完成、被限制。`,
            nextActions: [
              `在浏览器里打开该签到页，看按钮旁边写了什么 —— 写着「今日已签到」就无需再处理`,
              `若页面上没有已完成字样：等一分钟再执行一次，站点状态接口回来后按钮通常会解禁`,
              `若长期禁用：在账号行点「学习本站流程」重录一遍，录下真正可点的那个控件`,
            ],
          },
          [scope.Z.PROXY_UNREACHABLE]: {
            title: `本机代理端口没有程序在监听`,
            detail: `扩展把流量发到了本机代理端口，但那里没有任何程序接住它 —— 内核（Clash Verge / mihomo）没启动，或该节点的本地端口还没生效。`,
            nextActions: [
              `启动 Clash Verge（或其它内核），确认它正在运行且监听日志里能看到对应端口`,
              `在「代理管理」里重新同步 / 扫描本机出口，确认端口号是当前内核真实监听的那个`,
              `如果不用代理：编辑账号，把代理改为「不使用代理（直连）」`,
            ],
          },
          [scope.Z.NETWORK_FAILURE]: {
            title: `网络请求失败`,
            detail: `请求没能到达站点：DNS 解析不了、出口不通、连接被重置，或请求超时。`,
            nextActions: [
              `检查本机网络与站点是否可达（在浏览器里直接打开一次）`,
              `账号配了代理时：去「代理管理」测一次该出口，不通就换节点`,
              `若只有这个站点失败，多半是站点侧或该出口被墙，换一个节点再试`,
            ],
          },
          [scope.Z.ALREADY_DONE]: {
            title: `今天已经签到过了`,
            detail: `站点明确显示今日已完成。这不是失败，重复签到一般也不会再发奖励。`,
            nextActions: [
              `无需处理：这就是「今天已经签到」的结论，扩展已把该账号记为今日完成`,
              `若站点显示的不是你的账号，说明登录态串了 —— 重新执行一次，扩展会先核对身份`,
            ],
          },
          [scope.Z.UNKNOWN]: {
            title: `没能归类的失败`,
            detail: `日志里的线索不足以判断属于哪一类。`,
            nextActions: [
              `展开账号详情，把最后几步日志读完 —— 关键线索通常在最后两行`,
              `若仍看不出原因，去站点编辑里核对登录页和签到页地址是否还正确`,
            ],
          },
        };
        break;
      }
      case 10: {
        scope.oa = [
          {
            code: scope.Z.IDENTITY_EVIDENCE_CONFLICT,
            patterns: [/身份证据冲突/, /不同用户\s*ID/i],
          },
          {
            code: scope.Z.ALREADY_DONE,
            patterns: [
              /(?:今日|今天)[^，。；\n]{0,12}已(?:经)?签到/,
              /已(?:经)?签到[^，。；\n]{0,8}(?:无需|不用|不必)/,
              /(?:变为|变成|标记为|确认)今日已完成/,
              /今日签到已完成/,
            ],
          },
          { code: scope.Z.CHECKIN_NO_BASELINE, patterns: [/本轮已登录，但没有签到动作可确认/] },
          {
            code: scope.Z.CHECKIN_UNVERIFIED,
            patterns: [
              /没有签到动作可确认/,
              /无法确认「登录即签到」/,
              /无法把「登录即签到」归因到本轮/,
            ],
          },
          {
            code: scope.Z.WORKFLOW_CONFIG,
            patterns: [
              /学习签到路线缺少身份核验页/,
              /学习签到流程没有记录到可核验账号的身份页/,
              /工作流没有配置任何步骤/,
              /学到的流程未通过校验/,
            ],
          },
          {
            code: scope.Z.IDENTITY_ROUTE_UNREACHABLE,
            patterns: [
              /身份核验页(?:无法|未能|仍未)(?:到达|进入)/,
              /跳转(?:预算|次数|限制)[^，。；\n]{0,20}(?:用尽|耗尽|达到上限)/,
              /已达到(?:页面)?跳转(?:次数)?(?:上限|限制)/,
            ],
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
              /已自动切换过 GitHub 账号/,
            ],
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
              /(?:请完成|请先完成|需要你|等待你)[^，。；\n]{0,10}(?:滑块|图形|行为|智能)?(?:验证|校验)/,
            ],
          },
          {
            code: scope.Z.ELEMENT_MISMATCH,
            patterns: [/指纹失配/, /命中了错误的元素/, /命中的元素不符/],
          },
          {
            code: scope.Z.PROXY_UNREACHABLE,
            patterns: [/没有程序在监听/, /端口.{0,12}没人监听/, /没有任何程序接住/],
          },
          {
            code: scope.Z.SESSION_SWITCH_FAILED,
            patterns: [
              /无法清除.*Cookie/i,
              /Cookie.*(?:残留|权限|清理失败)/i,
              /无法退出当前(?:站点会话|账号)/,
              /无法安全切换.*账号/,
              /退出操作没有真正结束会话/,
              /退出后会话仍然有效/,
            ],
          },
          {
            code: scope.Z.AUTH_EXPIRED,
            patterns: [/登录态/, /未登录/, /凭据有误/, /401/, /登录失效/, /重新登录/],
          },
          {
            code: scope.Z.ACCESS_DENIED,
            patterns: [
              /403/,
              /forbidden/i,
              /access\s*denied/i,
              /访问被拒(?:绝)?/,
              /地区(?:限制|不可用|不支持)/,
              /不支持.{0,8}(?:国家|地区)/,
            ],
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
              /理由与历史重复/,
            ],
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
              /too many/i,
            ],
          },
          {
            code: scope.Z.OBSCURED,
            patterns: [/遮挡/, /被盖住/, /挡住了.*(?:按钮|控件|元素)/, /未关闭的公告/],
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
              /导航未生效/,
            ],
          },
          {
            code: scope.Z.CONTROL_DISABLED,
            patterns: [
              /按钮(?:当前)?(?:已|处于)?禁用/,
              /控件(?:当前)?不可点/,
              /按钮不可点/,
              /disabled.{0,12}(?:without|no)\s+.{0,12}(?:already|success)/i,
            ],
          },
          {
            code: scope.Z.NETWORK_FAILURE,
            patterns: [/网络/, /代理/, /dns/i, /连接被/, /err_/i, /timeout/i, /超时/],
          },
          {
            code: scope.Z.NO_CHECKIN_ENTRY,
            patterns: [/未自动发现同源签到入口/, /没有可点元素/, /不支持自动签到/],
          },
          {
            code: scope.Z.SELECTOR_MISMATCH,
            patterns: [/找不到/, /未找到/, /当前页没有/, /选择器/, /未命中/],
          },
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
          /^当前为自动识别签到：/,
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
            let n = await scope.z.get(scope.M.balances, {}),
              r = n[e],
              i = t.symbol ?? r?.symbol,
              a = i ? { ...t, symbol: i } : t,
              o = { ...(r ?? {}), ...a, daily: (0, scope.Tr)(r, a) };
            (delete o.error, await scope.z.set(scope.M.balances, { ...n, [e]: o }));
          });
        },
      };
    },
    store_Li_saveCheckinReward(scope) {
      return {
        async saveCheckinReward(e, t, n, r = Date.now(), i) {
          return (0, scope.X)(async () => {
            let a = await scope.z.get(scope.M.balances, {}),
              o = a[e],
              s = o ?? { quota: 0, usedQuota: 0, at: r, error: `余额尚未读取` },
              c =
                i ??
                (o?.checkinRewardDay === n && o.checkinReward === t
                  ? o.checkinRewardSymbol
                  : void 0),
              l = {
                ...s,
                checkinReward: t,
                checkinRewardDay: n,
                checkinRewardAt: r,
                daily: (0, scope.Er)(s.daily, n, t, r, void 0, c),
              };
            (c ? (l.checkinRewardSymbol = c) : delete l.checkinRewardSymbol,
              await scope.z.set(scope.M.balances, { ...a, [e]: l }));
          });
        },
      };
    },
    store_Li_clearBalance(scope) {
      return {
        async clearBalance(e) {
          return (0, scope.X)(async () => {
            let t = await scope.z.get(scope.M.balances, {});
            if (!(e in t)) return;
            let n = { ...t };
            (delete n[e], await scope.z.set(scope.M.balances, n));
          });
        },
      };
    },
    store_Li_saveBalanceError(scope) {
      return {
        async saveBalanceError(e, t) {
          return (0, scope.X)(async () => {
            let n = await scope.z.get(scope.M.balances, {}),
              r = n[e];
            await scope.z.set(scope.M.balances, {
              ...n,
              [e]: {
                ...(r ?? {}),
                quota: r?.quota ?? 0,
                usedQuota: r?.usedQuota ?? 0,
                at: Date.now(),
                error: t,
              },
            });
          });
        },
      };
    },
    store_Ui_resultOf(scope, e, t) {
      return {
        resultOf(e) {
          return t().results[e];
        },
      };
    },
    store_Ui_balanceOf(scope, e, t) {
      return {
        balanceOf(e) {
          return t().balances[e];
        },
      };
    },
    store_Ui_refreshBalances(scope, e, t) {
      return {
        async refreshBalances(n) {
          if (n.length === 0) return { refreshed: 0, failed: 0 };
          e({ refreshingBalances: new Set([...t().refreshingBalances, ...n]) });
          try {
            let e = await (0, scope.H)({ type: `REFRESH_BALANCE`, accountIds: n });
            if (!e.ok) throw Error(e.error);
            return (
              await t().load(),
              { refreshed: e.feature?.refreshed ?? 0, failed: e.feature?.failed ?? 0 }
            );
          } finally {
            let r = new Set(t().refreshingBalances);
            for (let e of n) r.delete(e);
            e({ refreshingBalances: r });
          }
        },
      };
    },
  },
});
