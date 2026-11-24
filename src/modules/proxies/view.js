/** src/modules/proxies/view.js: 功能模块实现，保留发布版本的符号以便逐步恢复命名。 */
import { createUiModuleRuntime, createUiScope, initializeUiScope } from '../../shared/ui-scope.js';

// 代理管理、订阅导入、出口测试与账号代理分配 — sharedUi published scope.
export let ProxyManagementView, AccountProxyEditor, BatchProxyAssignment, SubscriptionImportPanel;
export const sharedUiRuntime = createUiModuleRuntime({
  bindingNames: [
    'wd',
    'Td',
    '$',
    '$f',
    'ep',
    'tp',
    'np',
    'rp',
    'ip',
    'ap',
    'op',
    'sp',
    'cp',
    'lp',
    'up',
    'dp',
    'fp',
    'pp',
    'mp',
    'hp',
    'gp',
    '_p',
    'vp',
    'yp',
    'bp',
    'xp',
    'Sp',
    'Cp',
    'wp',
    'Tp',
    'Ep',
    'Dp',
    'Op',
    'kp',
    'Ap',
    'jp',
    'Mp',
    'Np',
    'Pp',
    'Fp',
    'Ip',
    'Lp',
    'Rp',
    'zp',
    'Bp',
    'Vp',
    'Hp',
    'Up',
    'Wp',
    'Gp',
    'Kp',
    'qp',
    'Jp',
    'Yp',
    'Xp',
    'Zp',
    'Qp',
    '$p',
    'em',
    'tm',
    'nm',
    'rm',
    'im',
    'am',
    'om',
    'sm',
    'cm',
    'lm',
    'um',
    'dm',
    'fm',
    'pm',
    'mm',
    'hm',
    'gm',
    '_m',
    'vm',
    'ym',
    'bm',
    'xm',
    'Sm',
    'Cm',
    'wm',
    'Tm',
    'Em',
  ],
  publish(name, value) {
    switch (name) {
      case 'Em':
        ProxyManagementView = value;
        break;
      case '_p':
        AccountProxyEditor = value;
        break;
      case 'Ap':
        BatchProxyAssignment = value;
        break;
      case 'Cm':
        SubscriptionImportPanel = value;
        break;
    }
  },
  register(scope) {
    scope.wd = function wd(e, t, n) {
      let r = e.proxyMode ?? `inherit`;
      if (r === `none`) return { kind: `direct` };
      if (r === `custom`) {
        let t = e.customProxy;
        return !t?.host || !t.port
          ? { kind: `invalid`, label: `自定义代理未填完` }
          : { kind: `proxy`, label: `${t.host}:${t.port}`, inherited: !1 };
      }
      let i = r === `pool` ? e.proxyId : t.proxyId;
      if (!i)
        return r === `pool` ? { kind: `invalid`, label: `未选择代理池节点` } : { kind: `direct` };
      let a = n.find((e) => e.id === i);
      return a
        ? (0, scope.xd)(a)
          ? { kind: `name-only`, label: a.name }
          : { kind: `proxy`, label: a.name || `${a.host}:${a.port}`, inherited: r === `inherit` }
        : { kind: `invalid`, label: `代理已被删除` };
    };
    scope.Td = function Td(e, t, n) {
      let r = e.proxyMode ?? `inherit`;
      if (r === `none`) return;
      if (r === `custom`) {
        let t = e.customProxy;
        return t?.host && t.port ? `${(0, scope.Cd)(t)}://${t.host}:${t.port}` : void 0;
      }
      let i = r === `pool` ? e.proxyId : t.proxyId;
      if (!i) return;
      let a = n.find((e) => e.id === i);
      if (a && !(0, scope.xd)(a)) return `${(0, scope.Cd)(a)}://${a.host}:${a.port}`;
    };
    scope.$ = function $(...e) {
      return (0, scope.Qf)((0, scope.Dd)(e));
    };
    scope.tp = function tp(e) {
      return typeof e == `string` && Object.values(scope.nd).includes(e);
    };
    scope.np = function np(e) {
      return e === scope.td.SUB2API
        ? scope.nd.SUB2API
        : e === scope.td.VO_API_V2
          ? scope.nd.VO_API_V2
          : e && scope.ep.has(e)
            ? scope.nd.NEW_API
            : scope.nd.UNSUPPORTED;
    };
    scope.rp = function rp(e) {
      let t = e?.trim();
      if (t) return t.startsWith(`/`) ? t : `/${t}`;
    };
    scope.ip = function ip(e) {
      let t = e.adapter,
        n = (0, scope.tp)(t?.family) ? t.family : (0, scope.np)(t?.siteType),
        r =
          t && Object.prototype.hasOwnProperty.call(t, `checkinPath`)
            ? (0, scope.rp)(t?.checkinPath)
            : scope.$f[n].checkinPath,
        i = (t?.checkin?.pathPatterns ?? [])
          .map((e) => (0, scope.rp)(e.replace(/\*$/, ``)))
          .filter((e) => !!e),
        a = (t?.checkin?.titleWords ?? []).map((e) => e.trim()).filter(Boolean);
      return {
        family: n,
        ...(t?.siteType ? { siteType: t.siteType } : {}),
        ...(r ? { checkinPath: r } : {}),
        checkinPathPatterns: i,
        checkinTitleWords: a,
      };
    };
    scope.sp = function sp(e) {
      let t = e.replace(/^\uFEFF/, ``).split(/\r?\n/),
        n = (0, scope.cp)(t, `listeners`),
        r = (0, scope.cp)(t, `proxies`),
        i = (0, scope.cp)(t, `proxy-groups`),
        a = new Set(r.map((e) => e.name?.trim()).filter(Boolean)),
        o = new Set([...a].filter(scope.fp)),
        s = new Set([...a].filter((e) => !o.has(e))),
        c = new Set(i.map((e) => e.name?.trim()).filter(Boolean)),
        l = r.length > 0,
        u = [],
        d = new Set(),
        f = new Set(),
        p = 0,
        m = 0,
        h = 0;
      for (let e of n) {
        let t = scope.op[e.type?.toLowerCase() ?? ``],
          n = Number(e.port),
          r = e.proxy?.trim();
        if (!t || !r || !Number.isInteger(n) || n <= 0 || n > 65535) {
          p += 1;
          continue;
        }
        let i = `${t}:${n}`;
        if (f.has(i)) p += 1;
        else {
          if ((f.add(i), l)) {
            if (o.has(r)) {
              p += 1;
              continue;
            }
            if (c.has(r)) {
              ((m += 1), (p += 1));
              continue;
            }
            if (!s.has(r)) {
              ((h += 1), (p += 1));
              continue;
            }
            if (d.has(r)) {
              p += 1;
              continue;
            }
            d.add(r);
          }
          u.push({ name: r, scheme: t, host: `127.0.0.1`, port: n, sourceLabel: `Clash Verge` });
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
          missingListenerNames: l ? [...s].filter((e) => !d.has(e)) : [],
          groupListeners: m,
          staleListeners: h,
        },
      };
    };
    scope.cp = function cp(e, t) {
      let n = [],
        r = null,
        i = !1,
        a = RegExp(`^${(0, scope.pp)(t)}\\s*:\\s*(?:#.*)?$`),
        o = () => {
          (r && n.push(r), (r = null));
        };
      for (let t of e) {
        if (!i) {
          a.test(t) && (i = !0);
          continue;
        }
        if (/^[^\s#-][^:]*\s*:/.test(t)) {
          o();
          break;
        }
        let e = /^\s*-\s*(.*?)\s*$/.exec(t);
        if (e) {
          o();
          let t = e[1].trim(),
            n = /^([\w-]+)\s*:\s*(.*?)\s*$/.exec(t);
          n
            ? ((r = {}), (r[n[1]] = (0, scope.mp)(n[2])))
            : (r = t.startsWith(`{`) && t.endsWith(`}`) ? (0, scope.lp)(t) : null);
          continue;
        }
        let n = /^\s+([\w-]+)\s*:\s*(.*?)\s*$/.exec(t);
        r && n && (r[n[1]] = (0, scope.mp)(n[2]));
      }
      return (i && o(), n);
    };
    scope.lp = function lp(e) {
      let t = e.trim().slice(1, -1),
        n = {};
      for (let e of (0, scope.up)(t)) {
        let t = (0, scope.dp)(e);
        if (t < 0) continue;
        let r = e.slice(0, t).trim();
        /^[\w-]+$/.test(r) && (n[r] = (0, scope.mp)(e.slice(t + 1)));
      }
      return n;
    };
    scope.up = function up(e) {
      let t = [],
        n = 0,
        r = ``,
        i = !1,
        a = 0;
      for (let o = 0; o < e.length; o += 1) {
        let s = e[o];
        if (r) {
          if (r === `"` && s === `\\` && !i) {
            i = !0;
            continue;
          }
          (s === r && !i && (r = ``), (i = !1));
        } else
          s === `"` || s === `'`
            ? (r = s)
            : s === `{` || s === `[`
              ? (a += 1)
              : s === `}` || s === `]`
                ? (a = Math.max(0, a - 1))
                : s === `,` && a === 0 && (t.push(e.slice(n, o)), (n = o + 1));
      }
      return (t.push(e.slice(n)), t);
    };
    scope.dp = function dp(e) {
      let t = ``,
        n = !1,
        r = 0;
      for (let i = 0; i < e.length; i += 1) {
        let a = e[i];
        if (t) {
          if (t === `"` && a === `\\` && !n) {
            n = !0;
            continue;
          }
          (a === t && !n && (t = ``), (n = !1));
        } else if (a === `"` || a === `'`) t = a;
        else if (a === `{` || a === `[`) r += 1;
        else if (a === `}` || a === `]`) r = Math.max(0, r - 1);
        else if (a === `:` && r === 0) return i;
      }
      return -1;
    };
    scope.fp = function fp(e) {
      let t = e.trim();
      return (
        /^(?:剩余流量|距离下次重置|套餐到期|有超过.*节点|每次使用前更新订阅|电报群|防失联)/u.test(
          t,
        ) ||
        /^(?:remaining\s+traffic|traffic\s+remaining|reset\s+in|expires?\s+(?:in|at|on))/iu.test(t)
      );
    };
    scope.pp = function pp(e) {
      return e.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    };
    scope.mp = function mp(e) {
      let t = (0, scope.hp)(e.trim()).trim(),
        n = /^(['"])([\s\S]*)\1$/.exec(t);
      return n
        ? n[1] === `'`
          ? n[2].replace(/''/g, `'`)
          : n[2].replace(/\\"/g, `"`).replace(/\\\\/g, `\\`)
        : t;
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
          total: 0,
        };
      let n = e.filter((e) => e.test.ok).length;
      if (n === t) return { kind: `ok`, title: `${t} 个端口全部连通`, passed: n, total: t };
      let r = e.filter((e) => e.probe === `closed`),
        i = e.filter((e) => e.probe === `listening` && !e.test.ok);
      if (n === 0 && r.length === t)
        return {
          kind: `listener-missing`,
          title: `${t} 个端口没有一个在监听`,
          hint: `说明 Clash Verge 还没用上这份配置:确认已「复制自动更新脚本」并且粘进了对应订阅的扩展配置 → Script,然后重载内核。若刚重载过,再等几秒。`,
          passed: n,
          total: t,
        };
      if (n === 0 && i.length === t)
        return {
          kind: `node-mismatch`,
          title: `${t} 个端口都在监听,但全部连不通`,
          hint: `端口本身是好的,失败在节点这一层。最常见的原因是 Clash Verge 当前激活的订阅不是生成脚本时用的那一份(节点名对不上会被内核拒绝),或这些节点确实已失效。先在「全部节点」逐个测活,并确认 Verge 里激活的是飞鸟云订阅。`,
          passed: n,
          total: t,
        };
      let a = r.length ? `${r.length} 个端口没人监听` : ``,
        o = i.length ? `${i.length} 个端口在监听但连不通` : ``,
        s = t - n - r.length - i.length;
      return {
        kind: `partial`,
        title: `${n}/${t} 个端口连通`,
        hint:
          [
            a && `${a}(脚本可能只生效了一部分,重载一次内核试试)`,
            o && `${o}(节点失效或名字对不上)`,
            s > 0 && `${s} 个非本机端口无法用这种方式判断`,
          ]
            .filter(Boolean)
            .join(`;`) || `对失败项逐个排查。`,
        passed: n,
        total: t,
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
      disabled: c = !1,
      onBusyChange: l,
      onProxyChange: u,
    }) {
      let f = (0, scope.k.useMemo)(() => n.filter((e) => !(0, scope.xd)(e)), [n]),
        [p, g] = (0, scope.k.useState)(t ?? ``),
        [_, v] = (0, scope.k.useState)(new Set()),
        [y, b] = (0, scope.k.useState)(``),
        [x, S] = (0, scope.k.useState)(!1),
        [C, w] = (0, scope.k.useState)(null),
        [T, E] = (0, scope.k.useState)(null),
        ee = (0, scope.k.useRef)(!1),
        D = c || x || C !== null;
      ((0, scope.k.useEffect)(() => {
        e && g(t ?? ``);
      }, [e, t]),
        (0, scope.k.useEffect)(() => {
          e && (v(new Set()), b(``), E(null));
        }, [e]),
        (0, scope.k.useEffect)(() => {
          E(null);
        }, [p]));
      let A = f.find((e) => e.id === p),
        j = (0, scope.k.useMemo)(() => new Map(i.map((e) => [e.id, e])), [i]),
        M = r.filter((e) => {
          let t = j.get(e.siteId);
          return (
            !y.trim() ||
            `${e.username} ${e.label ?? ``} ${t?.name ?? ``}`
              .toLowerCase()
              .includes(y.trim().toLowerCase())
          );
        }),
        N = r.filter((e) => _.has(e.id)),
        P = M.length > 0 && M.every((e) => _.has(e.id)),
        ne = new Map();
      for (let e of M) {
        let t = ne.get(e.siteId) ?? {
          siteId: e.siteId,
          siteName: j.get(e.siteId)?.name ?? `未知站点`,
          accounts: [],
        };
        (t.accounts.push(e), ne.set(e.siteId, t));
      }
      let re = [...ne.values()];
      function ie(e) {
        (E(null),
          v((t) => {
            let n = new Set(t);
            return (n.has(e) ? n.delete(e) : n.add(e), n);
          }));
      }
      function ae() {
        (E(null),
          v((e) => {
            let t = new Set(e);
            for (let e of M) P ? t.delete(e.id) : t.add(e.id);
            return t;
          }));
      }
      async function F() {
        if (c || !A || ee.current || !_.size) return;
        let e = N.map((e) => ({ accountId: e.id, proxyId: A.id, pinned: !0 }));
        if (e.length) {
          ((ee.current = !0), S(!0), l?.(!0), E(null));
          try {
            let t = await a(e);
            (v(new Set()), E({ text: `已为 ${t} 个账号绑定到“${A.name}”。` }));
          } catch (e) {
            E({ text: e instanceof Error ? e.message : `保存失败，请重试。`, error: !0 });
          } finally {
            ((ee.current = !1), S(!1), l?.(!1));
          }
        }
      }
      async function I(e) {
        if (!(c || ee.current)) {
          ((ee.current = !0), w(e.id), l?.(!0), E(null));
          try {
            (await o(e.id, { proxyMode: `inherit` }),
              E({ text: `${e.label || e.username} 已取消绑定，将跟随站点设置。` }));
          } catch (e) {
            E({ text: e instanceof Error ? e.message : `取消绑定失败，请重试。`, error: !0 });
          } finally {
            ((ee.current = !1), w(null), l?.(!1));
          }
        }
      }
      return r.length
        ? (0, scope.O.jsxs)(`div`, {
            children: [
              (0, scope.O.jsxs)(`div`, {
                className: `grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]`,
                children: [
                  (0, scope.O.jsxs)(`label`, {
                    className: `block min-w-0 space-y-1.5`,
                    children: [
                      (0, scope.O.jsx)(`span`, {
                        className: `text-xs font-medium text-slate-600 dark:text-slate-300`,
                        children: `绑定到`,
                      }),
                      (0, scope.O.jsxs)(`select`, {
                        value: A?.id ?? ``,
                        onChange: (e) => {
                          (g(e.target.value), u?.(e.target.value));
                        },
                        disabled: D || !f.length,
                        'aria-label': `选择绑定代理`,
                        className: `h-9 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-[13px] outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900`,
                        children: [
                          (0, scope.O.jsx)(`option`, {
                            value: ``,
                            children: f.length ? `选择代理` : `暂无代理`,
                          }),
                          f.map((e) =>
                            (0, scope.O.jsxs)(
                              `option`,
                              {
                                value: e.id,
                                children: [
                                  e.name,
                                  ` · `,
                                  (0, scope.Cd)(e),
                                  `://`,
                                  e.host,
                                  `:`,
                                  e.port,
                                ],
                              },
                              e.id,
                            ),
                          ),
                        ],
                      }),
                    ],
                  }),
                  (0, scope.O.jsxs)(`label`, {
                    className: `block min-w-0 space-y-1.5`,
                    children: [
                      (0, scope.O.jsx)(`span`, {
                        className: `text-xs font-medium text-slate-600 dark:text-slate-300`,
                        children: `查找账号`,
                      }),
                      (0, scope.O.jsxs)(`span`, {
                        className: `relative block`,
                        children: [
                          (0, scope.O.jsx)(scope.d, {
                            className: `pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400`,
                          }),
                          (0, scope.O.jsx)(`input`, {
                            value: y,
                            onChange: (e) => b(e.target.value),
                            disabled: D,
                            'aria-label': `搜索绑定账号`,
                            placeholder: `账号或站点名称`,
                            className: `h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[13px] outline-none placeholder:text-slate-400 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900`,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              !f.length &&
                (0, scope.O.jsxs)(`p`, {
                  className: `px-4 pb-3 text-xs text-slate-500 dark:text-slate-400`,
                  children: [
                    `尚无可绑定的代理。`,
                    (0, scope.O.jsx)(`button`, {
                      type: `button`,
                      onClick: s,
                      disabled: D,
                      className: `ml-1 font-medium text-blue-600 hover:underline disabled:opacity-40 dark:text-blue-400`,
                      children: `去添加代理`,
                    }),
                  ],
                }),
              (0, scope.O.jsxs)(`div`, {
                className: `grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_2.5rem] items-center gap-2 border-y border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400`,
                children: [
                  (0, scope.O.jsxs)(`label`, {
                    className: `flex cursor-pointer items-center gap-2.5`,
                    children: [
                      (0, scope.O.jsx)(`input`, {
                        type: `checkbox`,
                        'aria-label': `全选当前结果`,
                        className: `size-4 shrink-0 accent-blue-600`,
                        checked: P,
                        onChange: ae,
                        disabled: D || !M.length,
                      }),
                      `账号`,
                    ],
                  }),
                  (0, scope.O.jsx)(`span`, { children: `当前代理` }),
                  (0, scope.O.jsx)(`span`, { className: `text-right`, children: `操作` }),
                ],
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `max-h-[28rem] overflow-y-auto xl:max-h-[clamp(12rem,calc(100dvh_-_42rem),28rem)]`,
                children: [
                  re.map((e) =>
                    (0, scope.O.jsxs)(
                      `section`,
                      {
                        'aria-label': e.siteName,
                        children: [
                          (0, scope.O.jsxs)(`header`, {
                            className: `sticky top-0 z-10 flex items-center gap-1.5 border-b border-slate-100 bg-slate-50/95 px-4 py-2 text-xs text-slate-500 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-400`,
                            children: [
                              (0, scope.O.jsx)(scope.te, { className: `size-3.5 shrink-0` }),
                              (0, scope.O.jsx)(`strong`, {
                                className: `min-w-0 flex-1 truncate font-medium`,
                                children: e.siteName,
                              }),
                              (0, scope.O.jsxs)(`span`, {
                                children: [e.accounts.length, ` 个账号`],
                              }),
                            ],
                          }),
                          e.accounts.map((e) => {
                            let t = (0, scope.wd)(e, j.get(e.siteId) ?? {}, n),
                              r =
                                t.kind === `direct`
                                  ? `直连`
                                  : t.kind === `name-only`
                                    ? `${t.label}（缺少地址）`
                                    : t.label,
                              i =
                                t.kind === `proxy` && t.inherited
                                  ? `跟随站点`
                                  : e.proxyMode === `pool`
                                    ? e.proxyPinned
                                      ? `手动绑定`
                                      : `自动分配`
                                    : ``,
                              a = _.has(e.id),
                              o = C === e.id;
                            return (0, scope.O.jsxs)(
                              `div`,
                              {
                                className: `grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_2.5rem] items-center gap-2 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-slate-800 ${a ? `bg-blue-50/70 dark:bg-blue-950/25` : `hover:bg-slate-50/70 dark:hover:bg-slate-900/40`}`,
                                children: [
                                  (0, scope.O.jsxs)(`label`, {
                                    className: `flex min-w-0 cursor-pointer items-center gap-2.5`,
                                    children: [
                                      (0, scope.O.jsx)(`input`, {
                                        type: `checkbox`,
                                        className: `size-4 shrink-0 accent-blue-600`,
                                        checked: a,
                                        onChange: () => ie(e.id),
                                        disabled: D,
                                        'aria-label': `选择 ${e.label || e.username}`,
                                      }),
                                      (0, scope.O.jsxs)(`span`, {
                                        className: `min-w-0`,
                                        children: [
                                          (0, scope.O.jsx)(`strong`, {
                                            title: e.label || e.username,
                                            className: `block truncate text-[13px] font-medium`,
                                            children: e.label || e.username,
                                          }),
                                          e.label &&
                                            (0, scope.O.jsx)(`span`, {
                                              title: e.username,
                                              className: `mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400`,
                                              children: e.username,
                                            }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, scope.O.jsxs)(`span`, {
                                    className: `min-w-0`,
                                    children: [
                                      (0, scope.O.jsx)(`span`, {
                                        title: r,
                                        className: `block truncate text-[13px] ${t.kind === `invalid` || t.kind === `name-only` ? `text-amber-700 dark:text-amber-300` : `text-slate-600 dark:text-slate-300`}`,
                                        children: r,
                                      }),
                                      i &&
                                        (0, scope.O.jsx)(`span`, {
                                          className: `mt-0.5 block text-xs text-slate-500 dark:text-slate-400`,
                                          children: i,
                                        }),
                                    ],
                                  }),
                                  e.proxyMode === `pool` && e.proxyId
                                    ? (0, scope.O.jsx)(`button`, {
                                        type: `button`,
                                        onClick: () => void I(e),
                                        disabled: D,
                                        'aria-label': `取消 ${e.label || e.username} 的绑定`,
                                        className: `h-8 rounded-md text-right text-xs text-slate-500 hover:text-blue-600 disabled:opacity-40 dark:text-slate-400 dark:hover:text-blue-300`,
                                        children: o
                                          ? (0, scope.O.jsx)(scope.m, {
                                              className: `ml-auto size-3.5 animate-spin`,
                                            })
                                          : `解绑`,
                                      })
                                    : (0, scope.O.jsx)(`span`, {
                                        className: `text-right text-xs text-slate-300 dark:text-slate-600`,
                                        children: `—`,
                                      }),
                                ],
                              },
                              e.id,
                            );
                          }),
                        ],
                      },
                      e.siteId,
                    ),
                  ),
                  !re.length &&
                    (0, scope.O.jsx)(`p`, {
                      className: `px-4 py-10 text-center text-[13px] text-slate-500 dark:text-slate-400`,
                      children: `没有匹配的账号。`,
                    }),
                ],
              }),
              (0, scope.O.jsxs)(`footer`, {
                className: `flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40`,
                children: [
                  (0, scope.O.jsxs)(`div`, {
                    className: `min-w-0 text-xs text-slate-500 dark:text-slate-400`,
                    children: [
                      (0, scope.O.jsx)(`span`, {
                        children: N.length ? `已选 ${N.length} 个账号` : `勾选要绑定的账号`,
                      }),
                      N.length > 0 &&
                        !A &&
                        (0, scope.O.jsx)(`span`, {
                          className: `ml-2 text-amber-700 dark:text-amber-300`,
                          children: `请选择目标代理`,
                        }),
                    ],
                  }),
                  (0, scope.O.jsxs)(`button`, {
                    type: `button`,
                    disabled: D || !A || !N.length,
                    onClick: () => void F(),
                    className: `inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-[13px] font-medium text-white hover:bg-blue-700 disabled:opacity-40`,
                    children: [
                      x
                        ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` })
                        : (0, scope.O.jsx)(scope.h, { className: `size-3.5` }),
                      x ? `保存中…` : `保存绑定`,
                    ],
                  }),
                ],
              }),
              T &&
                (0, scope.O.jsx)(`p`, {
                  role: T.error ? `alert` : `status`,
                  className: `border-t border-slate-100 px-4 py-3 text-[13px] dark:border-slate-800 ${T.error ? `text-rose-600 dark:text-rose-400` : `text-emerald-700 dark:text-emerald-400`}`,
                  children: T.text,
                }),
            ],
          })
        : (0, scope.O.jsx)(`p`, {
            className: `px-4 py-12 text-center text-[13px] text-slate-500 dark:text-slate-400`,
            children: `还没有账号，添加账号后即可分配代理。`,
          });
    };
    scope.vp = function vp(e) {
      let t = e.proxyMode ?? `inherit`;
      return t === `pool` ? !!e.proxyId && e.proxyPinned === !0 : t === `custom` || t === `none`;
    };
    scope.yp = function yp(e, t, n = `unassigned`) {
      if (!t.length) return { assignments: [], skipped: 0, unusedProxies: 0 };
      let r = n === `all` ? [...e] : e.filter((e) => !(0, scope.vp)(e));
      return {
        assignments: r.map((e, n) => ({ accountId: e.id, proxyId: t[n % t.length] })),
        skipped: e.length - r.length,
        unusedProxies: Math.max(0, t.length - r.length),
      };
    };
    scope.Sp = function Sp(e) {
      let t = e.trim();
      if (!t) return { ...scope.xp };
      for (let e of [0, 1])
        for (let n of scope.bp) {
          let r = n.patterns[e];
          if (r && r.test(t)) return { key: n.key, label: n.label };
        }
      return { ...scope.xp };
    };
    scope.Cp = function Cp(e, t) {
      let n = new Map();
      for (let r of e) {
        let e = (0, scope.Sp)(t(r)),
          i = n.get(e.key);
        i ? i.items.push(r) : n.set(e.key, { key: e.key, label: e.label, items: [r] });
      }
      return [...n.values()].sort((e, t) =>
        e.key === scope.xp.key
          ? 1
          : t.key === scope.xp.key
            ? -1
            : t.items.length - e.items.length || e.label.localeCompare(t.label, `zh-Hans-CN`),
      );
    };
    scope.wp = function wp(e, t, n) {
      let r = new Map();
      for (let e of t)
        n.has(e.id) ||
          ((e.proxyMode ?? `inherit`) === `pool` &&
            e.proxyId &&
            r.set(e.proxyId, (r.get(e.proxyId) ?? 0) + 1));
      let i = new Map(),
        a = [];
      return (
        e
          .filter((e) => !(0, scope.xd)(e))
          .forEach((e, t) => {
            let n = { id: e.id, used: r.get(e.id) ?? 0, order: t };
            a.push(n);
            let o = (0, scope.Sp)(e.name).key,
              s = i.get(o);
            s ? s.push(n) : i.set(o, [n]);
          }),
        { byRegion: i, all: a }
      );
    };
    scope.Tp = function Tp(e) {
      return e.reduce(
        (e, t) => (!e || t.used < e.used || (t.used === e.used && t.order < e.order) ? t : e),
        void 0,
      );
    };
    scope.Ep = function Ep(e, t, n) {
      let r = (0, scope.Tp)(e.byRegion.get(t) ?? []);
      if (r) return { candidate: r, crossRegion: !1 };
      if (!n) return;
      let i = (0, scope.Tp)(e.all);
      return i ? { candidate: i, crossRegion: !0 } : void 0;
    };
    scope.Dp = function Dp(e, t) {
      let n = new Map(t.map((e) => [e.id, e]));
      return e.filter((e) => {
        if ((e.proxyMode ?? `inherit`) !== `pool` || !e.proxyId) return !1;
        let t = n.get(e.proxyId);
        return !!t && (0, scope.xd)(t);
      });
    };
    scope.Op = function Op(e, t, n = !0) {
      let r = new Map(t.map((e) => [e.id, e])),
        i = (0, scope.Dp)(e, t);
      if (!i.length) return { assignments: [], crossRegion: 0, unresolved: [] };
      let a = (0, scope.wp)(t, e, new Set(i.map((e) => e.id))),
        o = [],
        s = [],
        c = 0;
      for (let e of i) {
        let t = r.get(e.proxyId),
          i = (0, scope.Ep)(a, (0, scope.Sp)(t.name).key, n);
        i
          ? (i.crossRegion && (c += 1),
            (i.candidate.used += 1),
            o.push({ accountId: e.id, proxyId: i.candidate.id }))
          : s.push({ accountId: e.id, proxyName: t.name });
      }
      return { assignments: o, crossRegion: c, unresolved: s };
    };
    scope.Ap = function Ap({
      proxies: e,
      pool: t,
      accounts: n,
      onAssign: r,
      disabled: i = !1,
      onBusyChange: a,
      onTestProxy: o,
    }) {
      let s = t ?? e,
        c = (0, scope.k.useMemo)(() => e.filter((e) => !(0, scope.xd)(e)), [e]),
        l = (0, scope.k.useRef)(!1),
        [d, f] = (0, scope.k.useState)(`unassigned`),
        [p, h] = (0, scope.k.useState)(!1),
        [g, _] = (0, scope.k.useState)(null),
        [v, y] = (0, scope.k.useState)(null),
        [b, x] = (0, scope.k.useState)(!1),
        [S, C] = (0, scope.k.useState)(null),
        w = (0, scope.yp)(
          n,
          c.map((e) => e.id),
          d,
        ).assignments.length,
        T = (0, scope.k.useMemo)(() => (0, scope.Dp)(n, s), [n, s]);
      async function E() {
        if (i || l.current) return;
        let e = (0, scope.Op)(n, s);
        if (!e.assignments.length)
          C(
            e.unresolved.length
              ? `没有可匹配的代理，${e.unresolved.length} 个账号尚未换绑。请先添加代理。`
              : `没有需要换绑的账号。`,
          );
        else {
          ((l.current = !0), x(!0), a?.(!0), C(null));
          try {
            let t = await r(e.assignments);
            C(
              [
                `已把 ${t} 个账号换到真实出口`,
                e.crossRegion
                  ? `其中 ${e.crossRegion} 个只能跨区顶上（同地区没有可用出口），出口国家已改变`
                  : ``,
                e.unresolved.length ? `${e.unresolved.length} 个账号尚未找到可匹配的代理` : ``,
              ]
                .filter(Boolean)
                .join(` · `),
            );
          } catch (e) {
            C(e instanceof Error ? `换绑失败：${e.message}` : `换绑失败，请重试。`);
          } finally {
            ((l.current = !1), x(!1), a?.(!1));
          }
        }
      }
      async function ee() {
        if (!(i || !w || l.current)) {
          ((l.current = !0), h(!0), a?.(!0), y(null));
          try {
            let e = [];
            for (let [t, n] of c.entries())
              (_(`测活 ${t + 1}/${c.length} · ${n.name}`),
                (o
                  ? await o(n)
                  : await (0, scope.cd)({ type: `TEST_PROXY`, proxy: n }).then(
                      (e) => e.ok && e.test?.ok === !0,
                    )) && e.push(n.id));
            if ((_(null), !e.length)) {
              y(`池里 ${c.length} 个已配置出口全部不通，没有写入任何绑定`);
              return;
            }
            let t = (0, scope.yp)(n, e, d);
            if (!t.assignments.length) {
              y(`所有账号均有手动代理设置，没有需要分配的账号`);
              return;
            }
            let i = await r(t.assignments);
            y(
              [
                `已为 ${i} 个账号绑定节点`,
                e.length < c.length ? `排除不通节点 ${c.length - e.length} 个` : ``,
                t.skipped ? `保留手动设置 ${t.skipped} 个` : ``,
                t.unusedProxies ? `剩余未使用节点 ${t.unusedProxies} 个` : ``,
              ]
                .filter(Boolean)
                .join(` · `),
            );
          } catch (e) {
            y(e instanceof Error ? `测活或分配失败：${e.message}` : `测活或分配失败，请重试。`);
          } finally {
            ((l.current = !1), _(null), h(!1), a?.(!1));
          }
        }
      }
      return (0, scope.O.jsxs)(`section`, {
        'aria-labelledby': `bulk-assign-heading`,
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
                    className: `size-4 text-blue-600 dark:text-blue-400`,
                  }),
                  `批量分配`,
                ],
              }),
              (0, scope.O.jsxs)(`span`, {
                className: `text-xs text-slate-500 dark:text-slate-400`,
                children: [c.length, ` 个代理 · `, n.length, ` 个账号`],
              }),
            ],
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
                    children: `分配方式`,
                  }),
                  (0, scope.O.jsx)(`div`, {
                    className: `grid grid-cols-2 gap-2`,
                    children: scope.kp.map((e) =>
                      (0, scope.O.jsxs)(
                        `label`,
                        {
                          className: (0, scope.$)(
                            `flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-[13px] transition-colors`,
                            d === e.value
                              ? `border-blue-400 bg-blue-50/70 text-blue-800 dark:border-blue-500 dark:bg-blue-950/30 dark:text-blue-200`
                              : `border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900`,
                          ),
                          children: [
                            (0, scope.O.jsx)(`input`, {
                              type: `radio`,
                              name: `assign-mode`,
                              className: `mt-0.5 size-4 shrink-0 accent-blue-600`,
                              'aria-label': e.label,
                              value: e.value,
                              checked: d === e.value,
                              disabled: i || p || b,
                              onChange: () => f(e.value),
                            }),
                            (0, scope.O.jsxs)(`span`, {
                              children: [
                                (0, scope.O.jsx)(`span`, {
                                  className: `block font-medium`,
                                  children: e.label,
                                }),
                                (0, scope.O.jsx)(`span`, {
                                  className: `mt-0.5 hidden text-xs leading-relaxed text-slate-500 sm:block dark:text-slate-400`,
                                  children: e.hint,
                                }),
                              ],
                            }),
                          ],
                        },
                        e.value,
                      ),
                    ),
                  }),
                  (0, scope.O.jsx)(`p`, {
                    className: `mt-2 text-xs leading-relaxed text-slate-500 sm:hidden dark:text-slate-400`,
                    children: scope.kp.find((e) => e.value === d)?.hint,
                  }),
                ],
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `space-y-2 lg:pt-6`,
                children: [
                  (0, scope.O.jsxs)(scope.Mu.button, {
                    whileTap: { scale: 0.98 },
                    type: `button`,
                    disabled: i || !w || p || b,
                    onClick: ee,
                    className: `flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-45`,
                    children: [
                      p
                        ? (0, scope.O.jsx)(scope.m, { className: `size-4 animate-spin` })
                        : (0, scope.O.jsx)(scope.u, { className: `size-4` }),
                      p ? `正在测活并分配…` : `测活并分配`,
                    ],
                  }),
                  (0, scope.O.jsxs)(`p`, {
                    className: `text-center text-xs text-slate-500 dark:text-slate-400`,
                    children: [`本次分配 `, w, ` 个账号`],
                  }),
                ],
              }),
            ],
          }),
          (0, scope.O.jsx)(`p`, {
            className: `text-xs leading-relaxed text-slate-500 dark:text-slate-400`,
            children: `先检查连接，再把通过测活的代理按顺序分给账号；代理不足时循环使用。`,
          }),
          g &&
            (0, scope.O.jsx)(`p`, {
              role: `status`,
              className: `break-words rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`,
              children: g,
            }),
          !c.length &&
            (0, scope.O.jsx)(`p`, {
              className: `text-xs text-amber-700 dark:text-amber-300`,
              children: `请先添加代理。`,
            }),
          !!c.length &&
            !w &&
            (0, scope.O.jsx)(`p`, {
              className: `text-xs text-slate-500 dark:text-slate-400`,
              children: n.length
                ? `当前账号均有手动设置。如需覆盖，请选择“全部重新分配”。`
                : `请先添加账号。`,
            }),
          v &&
            (0, scope.O.jsx)(`p`, {
              role: `status`,
              className: `rounded-lg bg-slate-50 px-3 py-2.5 text-[13px] leading-relaxed text-slate-700 dark:bg-slate-900 dark:text-slate-200`,
              children: v,
            }),
          T.length > 0 &&
            (0, scope.O.jsxs)(`div`, {
              className: `space-y-2 rounded-lg bg-amber-50 p-2.5 ring-1 ring-amber-500/20 dark:bg-amber-950/30`,
              children: [
                (0, scope.O.jsxs)(`p`, {
                  className: `text-[11px] leading-relaxed text-amber-800 dark:text-amber-200`,
                  children: [T.length, ` 个账号绑定的节点缺少代理地址，可尝试匹配同地区的代理。`],
                }),
                (0, scope.O.jsxs)(scope.Mu.button, {
                  whileTap: { scale: 0.98 },
                  type: `button`,
                  disabled: i || p || b,
                  onClick: E,
                  className: `flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-[11px] font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-40`,
                  children: [
                    b
                      ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` })
                      : (0, scope.O.jsx)(scope.ed, { className: `size-3.5` }),
                    b ? `换绑中...` : `换到同地区的真实出口（${T.length} 个）`,
                  ],
                }),
              ],
            }),
          S &&
            (0, scope.O.jsx)(`p`, {
              className: `rounded-lg bg-amber-50 p-2.5 text-[11px] leading-relaxed text-amber-800 ring-1 ring-amber-500/20 dark:bg-amber-950/30 dark:text-amber-200`,
              children: S,
            }),
        ],
      });
    };
    scope.jp = function jp({ onSync: e, onMissingNames: t }) {
      let n = (0, scope.k.useRef)(null),
        [r, i] = (0, scope.k.useState)(!1),
        [a, o] = (0, scope.k.useState)(null);
      async function s(n) {
        (i(!0), o(null), t?.([]));
        try {
          let r = (0, scope.sp)(await n.text());
          if (!r.nodes.length && !r.catalog.missingListenerNames.length) {
            let e = r.catalog.detected ? `已读到 ${r.catalog.realNodes} 个真实节点，但` : ``;
            o({ ok: !1, text: `${e}没有节点配置独立 HTTP/SOCKS listener` });
            return;
          }
          t?.(r.catalog.missingListenerNames);
          let i = r.catalog.missingListenerNames.map((e) => ({
              name: e,
              scheme: `http`,
              host: `-`,
              port: 0,
              nameOnly: !0,
              sourceLabel: `Clash Verge`,
            })),
            a = await e(r.nodes.concat(i));
          if (r.catalog.detected) {
            let e = [
              n.name ? n.name : ``,
              `真实节点 ${r.catalog.realNodes}`,
              `可绑定 ${r.catalog.fixedNodes}/${r.catalog.realNodes}`,
              r.catalog.missingListenerNames.length
                ? `缺 listener ${r.catalog.missingListenerNames.length}`
                : ``,
              r.catalog.groupListeners ? `忽略策略组 ${r.catalog.groupListeners}` : ``,
              r.catalog.staleListeners ? `忽略失效项 ${r.catalog.staleListeners}` : ``,
              a.removed ? `清理旧出口 ${a.removed}` : ``,
              a.keptInUse ? `保留仍在使用的旧出口 ${a.keptInUse}（账号绑定不受影响）` : ``,
            ].filter(Boolean);
            o({ ok: !0, text: e.join(` · `), missingNames: r.catalog.missingListenerNames });
          } else
            o({
              ok: !0,
              text: `同步 ${r.nodes.length} 个固定出口${a.keptInUse ? ` · 保留仍在使用的旧出口 ${a.keptInUse}` : ``}`,
            });
        } catch (e) {
          o({
            ok: !1,
            text: e instanceof Error ? `读取失败：${e.message}` : `读取 Clash 配置失败`,
          });
        } finally {
          i(!1);
        }
      }
      return (0, scope.O.jsxs)(`div`, {
        className: `flex flex-col gap-3 rounded-lg border border-brand-200 bg-brand-50/60 p-3 sm:flex-row sm:items-center dark:border-brand-900/70 dark:bg-brand-950/20`,
        children: [
          (0, scope.O.jsx)(`span`, {
            className: `grid size-9 shrink-0 place-items-center rounded-lg bg-brand-500 text-white`,
            children: (0, scope.O.jsx)(scope.f, {
              className: (0, scope.$)(`size-4`, r && `animate-spin`),
            }),
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `min-w-0 flex-1`,
            children: [
              (0, scope.O.jsx)(`p`, {
                className: `text-xs font-semibold text-ink-900 dark:text-ink-50`,
                children: `Clash Verge 固定节点`,
              }),
              (0, scope.O.jsx)(`p`, {
                className: (0, scope.$)(
                  `mt-0.5 text-[10px] leading-relaxed`,
                  a?.ok === !1
                    ? `text-rose-600 dark:text-rose-400`
                    : `text-ink-800/55 dark:text-ink-100/45`,
                ),
                children:
                  a?.text ??
                  `选择当前运行的 clash-verge.yaml；profiles 配置也能读取，缺少 listener 时会在下方生成配置`,
              }),
              !a &&
                (0, scope.O.jsx)(`p`, {
                  className: `mt-1 break-all font-mono text-[10px] text-ink-800/40 dark:text-ink-100/30`,
                  children: `%APPDATA%\\io.github.clash-verge-rev.clash-verge-rev\\clash-verge.yaml`,
                }),
              a?.missingNames?.length
                ? (0, scope.O.jsxs)(`p`, {
                    className: `mt-0.5 truncate text-[10px] text-amber-700 dark:text-amber-300`,
                    title: a.missingNames.join(`、`),
                    children: [`无固定端口：`, a.missingNames.join(`、`)],
                  })
                : null,
            ],
          }),
          (0, scope.O.jsxs)(`button`, {
            type: `button`,
            disabled: r,
            onClick: () => n.current?.click(),
            className: `flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 text-xs font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-40`,
            children: [
              r
                ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` })
                : (0, scope.O.jsx)(scope.Wu, { className: `size-3.5` }),
              r ? `同步中` : `同步节点`,
            ],
          }),
          (0, scope.O.jsx)(`input`, {
            ref: n,
            type: `file`,
            accept: `.yaml,.yml,text/yaml,text/x-yaml,text/plain`,
            'aria-label': `选择 Clash Verge 配置文件`,
            className: `hidden`,
            onChange: (e) => {
              let t = e.target.files?.[0];
              (t && s(t), (e.target.value = ``));
            },
          }),
        ],
      });
    };
    scope.Fp = function Fp(e) {
      if (typeof e != `string` && typeof e != `number`) return null;
      let t = String(e).trim();
      if (!t) return null;
      (/^\d+$/.test(t) && (t = `127.0.0.1:${t}`),
        /^[a-z][a-z\d+.-]*:\/\//i.test(t) || (t = `http://${t}`));
      try {
        let e = new URL(t);
        if (!scope.Pp.has(e.protocol) || !e.hostname || e.username || e.password) return null;
        let n = e.hostname.toLowerCase().replace(/^\[|\]$/g, ``);
        return n !== `localhost` && n !== `127.0.0.1` && n !== `::1` ? null : e.origin;
      } catch {
        return null;
      }
    };
    scope.Vp = function Vp(e, t, n) {
      let r = new Set([...t, ...n]);
      for (let t = Math.max(1, e); t <= scope.Bp; t++) if (!r.has(t)) return t;
      return NaN;
    };
    scope.Hp = function Hp(e, t = scope.Rp, n = scope.Lp, r = []) {
      let i = Number.isInteger(t) && t > 0 && t <= scope.Bp ? t : scope.Rp,
        a = [];
      for (let t of e) {
        let e = String(t ?? ``).trim();
        e && !a.includes(e) && a.push(e);
      }
      if (!a.length) return { entries: [], yaml: ``, script: ``, poolEntries: [], dropped: 0 };
      let o = new Map(),
        s = new Set(n);
      for (let e of r) {
        let t = String(e?.nodeName ?? ``).trim(),
          n = Number(e?.port);
        !t || !Number.isInteger(n) || n < 1 || n > scope.Bp || (o.has(t) || o.set(t, n), s.add(n));
      }
      let c = new Set(n),
        l = [],
        u = 0;
      for (let e of a) {
        let t = o.get(e);
        if (t != null && !c.has(t)) {
          l.push({ nodeName: e, port: t, listenerName: `hub-${t}` });
          continue;
        }
        let r = (0, scope.Vp)(i, s, n);
        !Number.isInteger(r) || r > scope.Bp
          ? (u += 1)
          : (s.add(r), l.push({ nodeName: e, port: r, listenerName: `hub-${r}` }));
      }
      return (
        l.sort((e, t) => e.port - t.port),
        {
          entries: l,
          yaml: (0, scope.Up)(l),
          script: (0, scope.Wp)(l),
          poolEntries: l.map((e) => ({
            name: e.nodeName,
            scheme: `http`,
            host: scope.zp,
            port: e.port,
          })),
          dropped: u,
        }
      );
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
          `    proxy: ${(0, scope.Kp)(n.nodeName)}`,
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
        `  var map = {`,
      ];
      for (let n of e) t.push(`    ${(0, scope.Jp)(n.nodeName)}: ${n.port},`);
      return (
        t.push(
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
          `}`,
        ),
        t.join(`
`)
      );
    };
    scope.Kp = function Kp(e) {
      return `"${e
        .replace(/\\/g, `\\\\`)
        .replace(/"/g, `\\"`)
        .replace(/\t/g, `\\t`)
        .replace(/\n/g, `\\n`)
        .replace(/\r/g, `\\r`)
        .replace(scope.Gp, (e) => {
          let t = e.charCodeAt(0);
          return t <= 255
            ? `\\x${t.toString(16).toUpperCase().padStart(2, `0`)}`
            : `\\u${t.toString(16).toUpperCase().padStart(4, `0`)}`;
        })}"`;
    };
    scope.qp = function qp(e) {
      return {
        name: e.nodeName,
        scheme: e.listenerType === `socks` ? `socks5` : `http`,
        host: scope.zp,
        port: e.port,
        sourceLabel: `Clash Verge`,
      };
    };
    scope.Jp = function Jp(e) {
      return (
        `"` +
        e
          .replace(/\\/g, `\\\\`)
          .replace(/"/g, `\\"`)
          .replace(/'/g, `\\'`)
          .replace(/`/g, '\\`')
          .replace(/\t/g, `\\t`)
          .replace(/\n/g, `\\n`)
          .replace(/\r/g, `\\r`)
          .replace(scope.Gp, ``) +
        `"`
      );
    };
    scope.Yp = function Yp({ onNamesRead: e, onUseLocalProxy: t, onSync: n }) {
      let [r, i] = (0, scope.k.useState)({ address: scope.Np, secret: `` }),
        [a, o] = (0, scope.k.useState)(!1),
        [s, c] = (0, scope.k.useState)(null),
        [u, d] = (0, scope.k.useState)(null),
        f = !!(0, scope.Fp)(r.address);
      (0, scope.k.useEffect)(() => {
        let e = !1;
        return (
          chrome.storage.local
            .get(scope.Mp)
            .then((t) => {
              if (e) return;
              let n = t[scope.Mp];
              if (!n || typeof n != `object`) return;
              let r = n.address,
                a = n.secret;
              i((e) => ({
                address: typeof r == `string` && r ? r : e.address,
                secret: typeof a == `string` ? a : e.secret,
              }));
            })
            .catch(() => {}),
          () => {
            e = !0;
          }
        );
      }, []);
      let p = (0, scope.k.useRef)(!1);
      (0, scope.k.useEffect)(() => {
        p.current ? chrome.storage.local.set({ [scope.Mp]: r }).catch(() => {}) : (p.current = !0);
      }, [r]);
      function h() {
        return { address: r.address, ...(r.secret.trim() ? { secret: r.secret } : {}) };
      }
      async function g() {
        if (!s) {
          (c(`detect`), d(null));
          try {
            let e = await (0, scope.cd)({ type: `DETECT_CLASH_CONTROLLER`, controller: h() });
            if (!e.ok) throw Error(e.error);
            let t = e.feature?.clashControllerDetect;
            if (!t || t.status !== `found`) {
              d({
                tone: `info`,
                text:
                  t?.message ??
                  `未连接到本机 HTTP 控制接口，这不代表 Clash Verge / mihomo 未启动。Clash Verge 可能只启用了 Windows 命名管道；如需同步节点，请在 Clash Verge 设置中启用外部控制器（HTTP），例如 127.0.0.1:9097，再填写地址和密钥。仅使用当前代理出口无需控制接口，可检测本机代理端口（Verge 默认 7897）。`,
              });
              return;
            }
            (i((e) => ({
              address: t.address,
              secret: (0, scope.Fp)(e.address) === t.address ? e.secret : ``,
            })),
              d(
                t.needsSecret
                  ? {
                      tone: `info`,
                      text: `该 HTTP 接口要求认证；请核对它是 Clash 控制接口，并填写正确密钥后再检测。接口可达不等于代理节点不可用。`,
                    }
                  : { tone: `ok`, text: `已验证 Clash/Mihomo HTTP 控制接口，地址已填入` },
              ));
          } catch (e) {
            d({ tone: `err`, text: e instanceof Error ? e.message : `自动检测失败` });
          } finally {
            c(null);
          }
        }
      }
      async function _() {
        let e = await (0, scope.cd)({ type: `READ_CLASH_PROXIES`, controller: h() });
        return e.ok ? (e.feature?.clashController?.names ?? []) : null;
      }
      async function v() {
        if (f && !s) {
          (c(`sync`), d(null));
          try {
            let t = await (0, scope.cd)({ type: `READ_CLASH_LISTENER_EXITS`, controller: h() });
            if (!t.ok) throw Error(t.error);
            let r = t.feature?.clashListenerExits?.exits ?? [],
              i = await _();
            if (i) {
              let t = new Set(r.map((e) => e.nodeName));
              e?.(i.filter((e) => !t.has(e)));
            }
            if (!r.length) {
              d({
                tone: `info`,
                text: `内核里还没有每节点本地端口：请在 Clash Verge 的这份订阅里加一段 listeners（扩展代理管理→导入页可以生成），重载后再点同步`,
              });
              return;
            }
            let a = r.map((e) => (0, scope.qp)(e)),
              o = n
                ? await n(a)
                : await (async () => {
                    let e = await (0, scope.cd)({ type: `SYNC_CLASH_PROXIES`, inputs: a });
                    if (!e.ok) throw Error(e.error);
                    return e.feature?.clashConfigSync;
                  })();
            d({
              tone: `ok`,
              text: `已同步 ${r.length} 个出口（新增 ${o?.added ?? 0} / 补全 ${o?.upgraded ?? 0} / 已存在 ${o?.skipped ?? 0}${o?.keptInUse ? ` / 保留在用旧出口 ${o.keptInUse}` : ``}）`,
            });
          } catch (e) {
            d({ tone: `err`, text: e instanceof Error ? e.message : `同步内核出口失败` });
          } finally {
            c(null);
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
                    children: `Clash HTTP 控制接口（同步节点用）`,
                  }),
                  (0, scope.O.jsx)(`p`, {
                    className: `mt-0.5 text-[10px] leading-relaxed text-ink-800/55 dark:text-ink-100/45`,
                    children: `只读读取内核的节点与本地出口，不修改配置或切换节点。这里检测的是 HTTP 控制接口，不是内核进程。 Clash Verge 若仅使用 Windows 命名管道，需要另行启用外部控制器（HTTP）才能同步；代理端口 7897 不等于控制端口 9097。`,
                  }),
                ],
              }),
            ],
          }),
          (0, scope.O.jsxs)(`button`, {
            type: `button`,
            disabled: s !== null,
            onClick: () => void g(),
            className: `flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink-100 px-3 py-2 text-[11px] font-semibold text-ink-900 transition-colors hover:bg-ink-200 disabled:opacity-40 dark:bg-ink-900 dark:text-ink-50 dark:hover:bg-ink-800`,
            children: [
              s === `detect`
                ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` })
                : (0, scope.O.jsx)(scope.Qu, { className: `size-3.5` }),
              s === `detect` ? `正在检测...` : `检测 HTTP 控制接口`,
            ],
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `grid gap-2 sm:grid-cols-[1fr_1fr]`,
            children: [
              (0, scope.O.jsxs)(`label`, {
                className: `space-y-1`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `block text-[10px] text-ink-800/55 dark:text-ink-100/45`,
                    children: `Controller 地址`,
                  }),
                  (0, scope.O.jsx)(`input`, {
                    value: r.address,
                    onChange: (e) => i((t) => ({ ...t, address: e.target.value })),
                    placeholder: `127.0.0.1:9097`,
                    'aria-label': `Clash controller 地址`,
                    className: `h-8 w-full rounded-md border border-black/8 bg-white px-2 text-[11px] text-ink-900 outline-none focus:border-brand-500/50 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`,
                  }),
                ],
              }),
              (0, scope.O.jsxs)(`label`, {
                className: `space-y-1`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `block text-[10px] text-ink-800/55 dark:text-ink-100/45`,
                    children: `密钥`,
                  }),
                  (0, scope.O.jsxs)(`span`, {
                    className: `relative block`,
                    children: [
                      (0, scope.O.jsx)(`input`, {
                        type: a ? `text` : `password`,
                        value: r.secret,
                        onChange: (e) => i((t) => ({ ...t, secret: e.target.value })),
                        placeholder: `未设置密钥可留空`,
                        'aria-label': `Clash controller 密钥`,
                        className: `h-8 w-full rounded-md border border-black/8 bg-white pl-2 pr-8 text-[11px] text-ink-900 outline-none focus:border-brand-500/50 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`,
                      }),
                      (0, scope.O.jsx)(`button`, {
                        type: `button`,
                        onClick: () => o((e) => !e),
                        title: a ? `隐藏密钥` : `显示密钥`,
                        'aria-label': a ? `隐藏 Clash 密钥` : `显示 Clash 密钥`,
                        className: `absolute right-1 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded text-ink-800/45 hover:bg-black/5 dark:text-ink-100/40 dark:hover:bg-white/5`,
                        children: a
                          ? (0, scope.O.jsx)(scope.Bu, { className: `size-3.5` })
                          : (0, scope.O.jsx)(scope.Hu, { className: `size-3.5` }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          !f &&
            r.address.trim() &&
            (0, scope.O.jsx)(`p`, {
              className: `text-[10px] text-rose-600 dark:text-rose-400`,
              children: `地址格式无效，请填写端口、主机:端口或 http(s) 地址`,
            }),
          (0, scope.O.jsxs)(`button`, {
            type: `button`,
            disabled: !f || s !== null,
            onClick: () => void v(),
            className: `flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-40`,
            children: [
              s === `sync`
                ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` })
                : (0, scope.O.jsx)(scope.l, { className: `size-3.5` }),
              s === `sync` ? `正在同步...` : `同步内核出口到代理池`,
            ],
          }),
          t &&
            (0, scope.O.jsx)(`button`, {
              type: `button`,
              onClick: t,
              className: `text-[11px] font-medium text-brand-600 underline dark:text-brand-300`,
              children: `只使用当前 Clash 出口（无需控制接口）`,
            }),
          u &&
            (0, scope.O.jsx)(`p`, {
              role: `status`,
              className: (0, scope.$)(
                `text-[10px] leading-relaxed`,
                u.tone === `ok` && `text-emerald-600 dark:text-emerald-400`,
                u.tone === `info` && `text-amber-700 dark:text-amber-400`,
                u.tone === `err` && `text-rose-600 dark:text-rose-400`,
              ),
              children: u.text,
            }),
        ],
      });
    };
    scope.Xp = function Xp({ names: e, selected: t, onChange: n, noteOf: r }) {
      let [i, a] = (0, scope.k.useState)(``),
        [o, s] = (0, scope.k.useState)(``),
        [c, l] = (0, scope.k.useState)(new Set()),
        u = (0, scope.k.useMemo)(() => {
          let t = i.trim().toLowerCase();
          return t ? e.filter((e) => e.toLowerCase().includes(t)) : [...e];
        }, [e, i]),
        f = (0, scope.k.useMemo)(() => (0, scope.Cp)(u, (e) => e), [u]),
        p = (0, scope.k.useMemo)(() => new Map(e.map((e, t) => [e, t])), [e]);
      function m(e) {
        let r = new Set(t);
        (e(r), n(r));
      }
      function h(e) {
        m((t) => {
          t.has(e) ? t.delete(e) : t.add(e);
        });
      }
      function g(e) {
        let n = e.every((e) => t.has(e));
        m((t) => {
          for (let r of e) n ? t.delete(r) : t.add(r);
        });
      }
      function _() {
        let e = o.trim().toLowerCase();
        e &&
          m((t) => {
            for (let n of u) n.toLowerCase().includes(e) && t.add(n);
          });
      }
      function v(e) {
        l((t) => {
          let n = new Set(t);
          return (n.has(e) ? n.delete(e) : n.add(e), n);
        });
      }
      let b = u.filter((e) => t.has(e)).length;
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
                    className: `pointer-events-none absolute left-2 top-1/2 size-3 -translate-y-1/2 text-ink-800/35 dark:text-ink-100/35`,
                  }),
                  (0, scope.O.jsx)(`input`, {
                    value: i,
                    onChange: (e) => a(e.target.value),
                    placeholder: `搜索节点，如 日本`,
                    'aria-label': `搜索节点`,
                    className: `h-7 w-full rounded-md border border-black/8 bg-white pl-7 pr-6 text-[11px] text-ink-900 outline-none placeholder:text-ink-800/35 focus:border-brand-500/50 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`,
                  }),
                  i &&
                    (0, scope.O.jsx)(`button`, {
                      type: `button`,
                      onClick: () => a(``),
                      'aria-label': `清空节点搜索`,
                      className: `absolute right-1 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-800/40 hover:bg-black/5 dark:text-ink-100/40`,
                      children: (0, scope.O.jsx)(scope.y, { className: `size-3` }),
                    }),
                ],
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `flex items-center gap-1`,
                children: [
                  (0, scope.O.jsx)(`input`, {
                    value: o,
                    onChange: (e) => s(e.target.value),
                    onKeyDown: (e) => {
                      e.key === `Enter` && (e.preventDefault(), _());
                    },
                    placeholder: `关键词，如 优化`,
                    'aria-label': `按关键词批量勾选`,
                    className: `h-7 w-28 rounded-md border border-black/8 bg-white px-2 text-[11px] text-ink-900 outline-none placeholder:text-ink-800/35 focus:border-brand-500/50 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`,
                  }),
                  (0, scope.O.jsx)(`button`, {
                    type: `button`,
                    disabled: !o.trim(),
                    onClick: _,
                    className: `h-7 shrink-0 rounded-md bg-ink-100 px-2 text-[11px] font-medium text-ink-900 disabled:opacity-40 dark:bg-white/10 dark:text-ink-50`,
                    children: `勾选含此词`,
                  }),
                ],
              }),
            ],
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `flex items-center justify-between rounded-md bg-white px-2 py-1.5 text-[10px] ring-1 ring-black/5 dark:bg-ink-900 dark:ring-white/10`,
            children: [
              (0, scope.O.jsx)(`span`, {
                className: `text-ink-800/60 dark:text-ink-100/50`,
                children: i
                  ? `筛出 ${u.length} 个 · 其中已选 ${b} 个`
                  : `共 ${e.length} 个节点 · 已选 ${t.size} 个`,
              }),
              (0, scope.O.jsxs)(`span`, {
                className: `flex items-center gap-2`,
                children: [
                  (0, scope.O.jsx)(`button`, {
                    type: `button`,
                    onClick: () => g(u),
                    className: `font-medium text-brand-600 hover:underline dark:text-brand-400`,
                    children:
                      u.length > 0 && u.every((e) => t.has(e)) ? `取消当前结果` : `选中当前结果`,
                  }),
                  (0, scope.O.jsx)(`button`, {
                    type: `button`,
                    onClick: () => n(new Set()),
                    className: `text-ink-800/50 hover:underline dark:text-ink-100/40`,
                    children: `清空`,
                  }),
                ],
              }),
            ],
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `max-h-72 space-y-1.5 overflow-y-auto`,
            children: [
              f.map((e) => {
                let n = c.has(e.key),
                  i = e.items.filter((e) => t.has(e)).length,
                  a = i === e.items.length;
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
                            checked: a,
                            onChange: () => g(e.items),
                            'aria-label': `${a ? `取消选择` : `选择`}${e.label}全部节点`,
                            className: `size-3.5 shrink-0`,
                          }),
                          (0, scope.O.jsxs)(`button`, {
                            type: `button`,
                            onClick: () => v(e.key),
                            className: `flex min-w-0 flex-1 items-center gap-1.5 text-left`,
                            children: [
                              (0, scope.O.jsx)(`span`, {
                                className: `truncate text-[11px] font-semibold text-ink-900 dark:text-ink-50`,
                                children: e.label,
                              }),
                              (0, scope.O.jsxs)(`span`, {
                                className: `shrink-0 text-[10px] tabular-nums text-ink-800/45 dark:text-ink-100/35`,
                                children: [i, `/`, e.items.length],
                              }),
                              (0, scope.O.jsx)(scope.ee, {
                                className: (0, scope.$)(
                                  `ml-auto size-3 shrink-0 text-ink-800/40 transition-transform dark:text-ink-100/35`,
                                  n && `-rotate-90`,
                                ),
                              }),
                            ],
                          }),
                        ],
                      }),
                      !n &&
                        (0, scope.O.jsx)(`div`, {
                          className: `divide-y divide-black/5 dark:divide-white/5`,
                          children: e.items.map((e) => {
                            let n = p.get(e) ?? 0;
                            return (0, scope.O.jsxs)(
                              `label`,
                              {
                                className: `flex cursor-pointer items-center gap-2 bg-white px-2 py-1.5 dark:bg-ink-950`,
                                children: [
                                  (0, scope.O.jsx)(`input`, {
                                    type: `checkbox`,
                                    checked: t.has(e),
                                    onChange: () => h(e),
                                    'aria-label': `选择节点 ${e}`,
                                    className: `size-3.5 shrink-0`,
                                  }),
                                  (0, scope.O.jsx)(`span`, {
                                    className: `min-w-0 flex-1 truncate text-[11px] text-ink-900 dark:text-ink-50`,
                                    title: e,
                                    children: e,
                                  }),
                                  r &&
                                    (0, scope.O.jsx)(`span`, {
                                      className: `shrink-0 text-[10px] text-ink-800/45 dark:text-ink-100/35`,
                                      children: r(e, n),
                                    }),
                                ],
                              },
                              e,
                            );
                          }),
                        }),
                    ],
                  },
                  e.key,
                );
              }),
              !f.length &&
                (0, scope.O.jsxs)(`p`, {
                  className: `rounded-lg bg-white px-2.5 py-3 text-center text-[11px] text-ink-800/45 ring-1 ring-black/5 dark:bg-ink-900 dark:text-ink-100/35 dark:ring-white/10`,
                  children: [`没有匹配「`, i, `」的节点`],
                }),
            ],
          }),
        ],
      });
    };
    scope.Zp = function Zp({ names: e, onImport: t }) {
      let [n, r] = (0, scope.k.useState)(() => new Set(e)),
        [i, a] = (0, scope.k.useState)(String(scope.Ip)),
        [s, c] = (0, scope.k.useState)(!1),
        [l, u] = (0, scope.k.useState)(!1),
        [d, p] = (0, scope.k.useState)(null),
        [h, g] = (0, scope.k.useState)(!0),
        [_, v] = (0, scope.k.useState)(!1),
        [y, b] = (0, scope.k.useState)(null),
        [x, S] = (0, scope.k.useState)(!1);
      (0, scope.k.useEffect)(() => {
        r(new Set(e));
      }, [e]);
      let C = Number(i),
        w = Number.isInteger(C) && C > 0 && C <= 65535,
        T = (0, scope.k.useMemo)(() => e.filter((e) => n.has(e)), [e, n]),
        [E, ee] = (0, scope.k.useState)([]);
      ((0, scope.k.useEffect)(() => {
        let e = !1;
        return (
          scope.ld
            .get(scope.ud.listenerPlan, [])
            .then((t) => {
              !e && Array.isArray(t) && ee(t);
            })
            .catch(() => {}),
          () => {
            e = !0;
          }
        );
      }, []),
        (0, scope.k.useEffect)(() => {
          let e = !1;
          return (
            scope.ld
              .get(scope.ud.subscriptionSource, null)
              .then((t) => {
                !e && t && (S(typeof t.url == `string` && t.url.length > 0), g(t.autoSync !== !1));
              })
              .catch(() => {}),
            () => {
              e = !0;
            }
          );
        }, []));
      let D = (0, scope.k.useMemo)(
        () => (0, scope.Hp)(T, w ? C : scope.Ip, void 0, E),
        [T, C, w, E],
      );
      (0, scope.k.useEffect)(() => {
        D.entries.length && scope.ld.set(scope.ud.listenerPlan, D.entries).catch(() => {});
      }, [D.entries]);
      let te = (0, scope.k.useMemo)(
        () => new Map(D.entries.map((e) => [e.nodeName, e.port])),
        [D.entries],
      );
      async function A() {
        if (D.yaml)
          try {
            (await navigator.clipboard.writeText(D.yaml), u(!0), setTimeout(() => u(!1), 1800));
          } catch {
            p(`复制失败，请手动选中下面的配置文本`);
          }
      }
      let [j, M] = (0, scope.k.useState)(!1);
      async function N() {
        if (D.script)
          try {
            (await navigator.clipboard.writeText(D.script), M(!0), setTimeout(() => M(!1), 1800));
          } catch {
            p(`复制失败，请手动选中下面的脚本文本`);
          }
      }
      async function P() {
        if (!_) {
          (v(!0), p(null));
          try {
            let e = await (0, scope.cd)({ type: `CHECK_LISTENER_DRIFT` });
            if (!e.ok) throw Error(e.error);
            let t = e.feature?.listenerDrift;
            if (!t) throw Error(`后台没有返回检查结果`);
            (b({
              added: t.added,
              removed: t.removed,
              needsResync: t.needsResync,
              checkedAt: t.checkedAt,
            }),
              p(
                t.needsResync
                  ? `订阅里有 ${t.added} 个新节点已补进代理池;请重新「复制自动更新脚本」并粘回 Clash Verge,它们才会真正监听`
                  : `订阅无新增节点${t.removed ? `;${t.removed} 个节点已从订阅消失(端口保留不复用)` : ``}`,
              ));
          } catch (e) {
            p(e instanceof Error ? `检查失败:${e.message}` : `检查失败`);
          } finally {
            v(!1);
          }
        }
      }
      async function ne() {
        let e = !h;
        g(e);
        let t = await scope.ld.get(scope.ud.subscriptionSource, null);
        t &&
          (await scope.ld.set(scope.ud.subscriptionSource, { ...t, autoSync: e }).catch(() => {}));
      }
      async function re() {
        if (D.poolEntries.length && !s) {
          (c(!0), p(null));
          try {
            let e = await t(D.poolEntries.map((e) => ({ ...e, sourceLabel: `Clash Verge` }))),
              n = [`已按方案入池 ${D.poolEntries.length} 个出口`];
            (e.added && n.push(`新增 ${e.added}`),
              e.upgraded && n.push(`补上真实出口 ${e.upgraded}`),
              e.skipped && n.push(`已存在 ${e.skipped}`),
              p(`${n.join(` · `)}。改完 Clash 配置并重载后，用列表里的测试按钮确认连通性。`));
          } catch (e) {
            p(e instanceof Error ? `入池失败：${e.message}` : `入池失败`);
          } finally {
            c(!1);
          }
        }
      }
      return e.length
        ? (0, scope.O.jsxs)(`section`, {
            className: `space-y-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3 dark:border-brand-900/70 dark:bg-brand-950/20`,
            children: [
              (0, scope.O.jsxs)(`div`, {
                className: `flex items-start gap-2`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `grid size-8 shrink-0 place-items-center rounded-lg bg-brand-500 text-white`,
                    children: (0, scope.O.jsx)(scope.Qu, { className: `size-4` }),
                  }),
                  (0, scope.O.jsxs)(`div`, {
                    className: `min-w-0 flex-1`,
                    children: [
                      (0, scope.O.jsx)(`h4`, {
                        className: `text-xs font-semibold text-ink-900 dark:text-ink-50`,
                        children: `生成 listeners 配置（第 1 / 3 步）`,
                      }),
                      (0, scope.O.jsxs)(`p`, {
                        className: `mt-0.5 text-[11px] leading-relaxed text-ink-800/60 dark:text-ink-100/50`,
                        children: [
                          `vmess / vless / trojan / hysteria2 这些协议浏览器不能直连，但让 Clash 为每个节点 各开一个本地端口，浏览器就能用了。下面 `,
                          e.length,
                          ` 个节点都还没有自己的端口。`,
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, scope.O.jsx)(scope.Xp, {
                names: e,
                selected: n,
                onChange: r,
                noteOf: (e) => {
                  let t = te.get(e);
                  return t ? `:${t}` : ``;
                },
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `flex flex-wrap items-end gap-2`,
                children: [
                  (0, scope.O.jsxs)(`label`, {
                    className: `space-y-1`,
                    children: [
                      (0, scope.O.jsx)(`span`, {
                        className: `block text-[10px] text-ink-800/55 dark:text-ink-100/45`,
                        children: `起始端口`,
                      }),
                      (0, scope.O.jsx)(`input`, {
                        value: i,
                        onChange: (e) => a(e.target.value.replace(/\D/g, ``)),
                        inputMode: `numeric`,
                        'aria-label': `listener 起始端口`,
                        className: `h-8 w-24 rounded-md border border-black/8 bg-white px-2 text-[11px] tabular-nums text-ink-900 outline-none focus:border-brand-500/50 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`,
                      }),
                    ],
                  }),
                  (0, scope.O.jsxs)(`p`, {
                    className: `min-w-0 flex-1 text-[10px] leading-relaxed text-ink-800/50 dark:text-ink-100/40`,
                    children: [
                      `依次递增，避开内核自己占用的 7890 / 7891 / 7897。`,
                      D.dropped > 0 &&
                        (0, scope.O.jsxs)(`span`, {
                          className: `text-amber-600 dark:text-amber-400`,
                          children: [`　有 `, D.dropped, ` 个节点因端口越界未分配`],
                        }),
                    ],
                  }),
                ],
              }),
              (0, scope.O.jsx)(scope.Bc, {
                initial: !1,
                children:
                  D.yaml &&
                  (0, scope.O.jsx)(scope.Mu.div, {
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
                                D.entries[D.entries.length - 1].port,
                              ],
                            }),
                            (0, scope.O.jsxs)(`button`, {
                              type: `button`,
                              onClick: () => void A(),
                              className: `flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-medium text-brand-600 ring-1 ring-black/5 hover:bg-brand-50 dark:bg-ink-900 dark:text-brand-400 dark:ring-white/10`,
                              children: [
                                l
                                  ? (0, scope.O.jsx)(scope.o, { className: `size-3` })
                                  : (0, scope.O.jsx)(scope.Iu, { className: `size-3` }),
                                l ? `已复制` : `复制配置`,
                              ],
                            }),
                            (0, scope.O.jsxs)(`button`, {
                              type: `button`,
                              onClick: () => void N(),
                              title: `粘进 Clash Verge「扩展配置 → Script」：订阅更新后端口映射自动重建，无需再粘`,
                              className: `flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-white bg-brand-500 hover:bg-brand-600`,
                              children: [
                                j
                                  ? (0, scope.O.jsx)(scope.o, { className: `size-3` })
                                  : (0, scope.O.jsx)(scope.Iu, { className: `size-3` }),
                                j ? `脚本已复制` : `复制自动更新脚本`,
                              ],
                            }),
                          ],
                        }),
                        (0, scope.O.jsx)(`pre`, {
                          className: `max-h-40 overflow-auto rounded-lg bg-white px-2.5 py-2 font-mono text-[10px] leading-relaxed text-ink-900 ring-1 ring-black/5 dark:bg-ink-950 dark:text-ink-50 dark:ring-white/10`,
                          children: D.yaml,
                        }),
                      ],
                    }),
                  }),
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `space-y-2 rounded-lg bg-white/70 px-3 py-2 ring-1 ring-black/5 dark:bg-ink-950/50 dark:ring-white/10`,
                children: [
                  (0, scope.O.jsxs)(`div`, {
                    className: `flex flex-wrap items-center gap-2`,
                    children: [
                      (0, scope.O.jsx)(`span`, {
                        className: `text-[10px] font-semibold text-ink-900 dark:text-ink-50`,
                        children: `订阅自动更新`,
                      }),
                      x
                        ? (0, scope.O.jsxs)(scope.O.Fragment, {
                            children: [
                              (0, scope.O.jsx)(`button`, {
                                type: `button`,
                                role: `switch`,
                                'aria-checked': h,
                                onClick: () => void ne(),
                                className: (0, scope.$)(
                                  `rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 transition-colors`,
                                  h
                                    ? `bg-emerald-500/12 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300`
                                    : `bg-ink-100 text-ink-800/50 ring-black/5 dark:bg-ink-900 dark:text-ink-100/40 dark:ring-white/10`,
                                ),
                                children: h ? `已开启 · 每 6 小时检查` : `已关闭`,
                              }),
                              (0, scope.O.jsxs)(`button`, {
                                type: `button`,
                                disabled: _,
                                onClick: () => void P(),
                                className: `flex items-center gap-1 rounded-md bg-brand-500 px-2 py-1 text-[10px] font-semibold text-white hover:bg-brand-600 disabled:opacity-40`,
                                children: [
                                  _
                                    ? (0, scope.O.jsx)(scope.m, {
                                        className: `size-3 animate-spin`,
                                      })
                                    : (0, scope.O.jsx)(scope.f, { className: `size-3` }),
                                  _ ? `检查中...` : `立即检查`,
                                ],
                              }),
                            ],
                          })
                        : (0, scope.O.jsx)(`span`, {
                            className: `text-[10px] text-ink-800/50 dark:text-ink-100/40`,
                            children: `先在导入页粘一次订阅地址，即可自动跟随更新`,
                          }),
                    ],
                  }),
                  y &&
                    (0, scope.O.jsx)(`p`, {
                      className: (0, scope.$)(
                        `text-[10px] leading-relaxed`,
                        y.needsResync
                          ? `text-amber-700 dark:text-amber-300`
                          : `text-ink-800/55 dark:text-ink-100/45`,
                      ),
                      children: y.needsResync
                        ? `新增 ${y.added} 个节点 · 需重新复制并粘贴 Script（已自动补进代理池）`
                        : `无新增节点${y.removed ? ` · ${y.removed} 个节点已消失（端口保留，不复用）` : ``}`,
                    }),
                ],
              }),
              (0, scope.O.jsxs)(`p`, {
                className: `text-[10px] leading-relaxed text-brand-700 dark:text-brand-300`,
                children: [
                  `推荐:`,
                  (0, scope.O.jsx)(`b`, { children: `复制自动更新脚本` }),
                  ` → 粘到 Clash Verge 飞鸟云订阅的「右键 → 编辑扩展配置 → Script」并保存。 之后订阅每次更新,Verge 会按这份映射自动重建所有端口,端口由本扩展锁定永不漂移。 想完全回滚:清空那个 Script 文件并重载即可,不留任何痕迹。`,
                ],
              }),
              (0, scope.O.jsxs)(`ol`, {
                className: `space-y-1 rounded-lg bg-white/70 px-3 py-2 text-[10px] leading-relaxed text-ink-800/70 ring-1 ring-black/5 dark:bg-ink-950/50 dark:text-ink-100/60 dark:ring-white/10`,
                children: [
                  (0, scope.O.jsxs)(`li`, {
                    children: [
                      (0, scope.O.jsx)(`span`, {
                        className: `font-semibold`,
                        children: `兼容模式`,
                      }),
                      `　复制上面的配置，粘进 Clash Verge 的「扩展配置(Merge)」并保存`,
                      (0, scope.O.jsx)(`span`, {
                        className: `opacity-70`,
                        children: `（不要粘进订阅本身：订阅一更新就被覆盖）`,
                      }),
                    ],
                  }),
                  (0, scope.O.jsxs)(`li`, {
                    children: [
                      (0, scope.O.jsx)(`span`, { className: `font-semibold`, children: `3 / 3` }),
                      `　在 Clash Verge 里重载 / 重启一次内核，让新端口生效`,
                    ],
                  }),
                  (0, scope.O.jsx)(`li`, {
                    className: `pt-0.5 opacity-70`,
                    children: `端口已生效后再点下面的按钮入池；之后到「全部节点」逐个测试连通性。`,
                  }),
                ],
              }),
              (0, scope.O.jsxs)(`button`, {
                type: `button`,
                disabled: !D.poolEntries.length || s,
                onClick: () => void re(),
                className: `flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-40`,
                children: [
                  s
                    ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` })
                    : (0, scope.O.jsx)(scope.Xu, { className: `size-3.5` }),
                  s ? `入池中...` : `重载完成后，把这 ${D.poolEntries.length} 个出口加入代理池`,
                ],
              }),
              d &&
                (0, scope.O.jsx)(`p`, {
                  className: `text-[10px] leading-relaxed text-ink-800/60 dark:text-ink-100/50`,
                  children: d,
                }),
            ],
          })
        : (0, scope.O.jsxs)(`section`, {
            className: `rounded-xl border border-dashed border-ink-200 px-4 py-6 text-center dark:border-ink-700`,
            children: [
              (0, scope.O.jsx)(scope.Xu, {
                className: `mx-auto size-5 text-ink-800/25 dark:text-ink-100/20`,
              }),
              (0, scope.O.jsx)(`p`, {
                className: `mt-2 text-[11px] leading-relaxed text-ink-800/55 dark:text-ink-100/45`,
                children: `先用上面的「读取控制器节点目录」或「从订阅导入」取到节点名， 这里就能替你把每个节点的本地监听端口写出来。`,
              }),
            ],
          });
    };
    scope.$p = function $p({ onImport: e, onBusyChange: n }) {
      let [r, i] = (0, scope.k.useState)(`127.0.0.1`),
        [a, o] = (0, scope.k.useState)(`7897`),
        [s, c] = (0, scope.k.useState)(`http`),
        [l, u] = (0, scope.k.useState)(!1),
        [d, f] = (0, scope.k.useState)(null),
        p = Number(a),
        h = !!r.trim() && Number.isInteger(p) && p > 0 && p <= 65535;
      async function g() {
        if (h && !l) {
          (u(!0), n?.(!0), f(null));
          try {
            let t = r.trim(),
              n = await (0, scope.cd)({
                type: `SCAN_LOCAL_PORTS`,
                host: t,
                ports: [p],
                scheme: s,
                withExit: !0,
              });
            if (!n.ok) {
              f({ state: `fail`, title: n.error });
              return;
            }
            let i = n.feature?.portScan?.entries[0];
            if (!i?.ok) {
              f({
                state: `fail`,
                title: `${s.toUpperCase()}://${t}:${p} 不可用`,
                detail: i?.message ?? `没有检测到可连接的本机代理服务`,
              });
              return;
            }
            let a = await e([
                {
                  name: t === `127.0.0.1` && p === 7897 ? `Clash 当前出口` : `${t}:${p}`,
                  sourceLabel: `本机代理`,
                  scheme: s,
                  host: t,
                  port: p,
                },
              ]),
              o = a.added ? `已加入代理池` : a.upgraded ? `已更新代理池` : `代理池中已存在`,
              c = [i.country, i.ip].filter(Boolean).join(` · `);
            f({
              state: `ok`,
              title: `${o}：${s.toUpperCase()}://${t}:${p}`,
              detail: c ? `当前出口 ${c} · ${i.ms}ms` : `连通正常 · ${i.ms}ms`,
            });
          } catch (e) {
            f({ state: `fail`, title: e instanceof Error ? e.message : `检测本机代理失败` });
          } finally {
            (u(!1), n?.(!1));
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
                children: (0, scope.O.jsx)(scope.Ku, { className: `size-4` }),
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `min-w-0`,
                children: [
                  (0, scope.O.jsx)(`h4`, {
                    className: `text-xs font-semibold text-ink-900 dark:text-ink-50`,
                    children: `添加 Clash 本机出口`,
                  }),
                  (0, scope.O.jsx)(`p`, {
                    className: `mt-0.5 text-[11px] leading-relaxed text-ink-800/55 dark:text-ink-100/45`,
                    children: `默认检测 Clash Verge 的 mixed-port 7897。这个端口会跟随 Clash 当前选中的节点，扩展不会切换节点或修改 Clash 配置。`,
                  }),
                ],
              }),
            ],
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `grid grid-cols-[minmax(0,1fr)_88px] gap-2`,
            children: [
              (0, scope.O.jsxs)(`label`, {
                className: `col-span-2 space-y-1 sm:col-span-1`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `block text-[10px] text-ink-800/55 dark:text-ink-100/45`,
                    children: `主机`,
                  }),
                  (0, scope.O.jsx)(`input`, {
                    value: r,
                    onChange: (e) => i(e.target.value),
                    'aria-label': `本机代理主机`,
                    autoComplete: `off`,
                    className: `h-9 w-full rounded-lg border border-black/8 bg-white px-2.5 text-xs text-ink-900 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`,
                  }),
                ],
              }),
              (0, scope.O.jsxs)(`label`, {
                className: `space-y-1`,
                children: [
                  (0, scope.O.jsx)(`span`, {
                    className: `block text-[10px] text-ink-800/55 dark:text-ink-100/45`,
                    children: `端口`,
                  }),
                  (0, scope.O.jsx)(`input`, {
                    value: a,
                    onChange: (e) => o(e.target.value.replace(/\D/g, ``)),
                    inputMode: `numeric`,
                    'aria-label': `本机代理端口`,
                    className: `h-9 w-full rounded-lg border border-black/8 bg-white px-2.5 text-xs tabular-nums text-ink-900 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50`,
                  }),
                ],
              }),
            ],
          }),
          (0, scope.O.jsxs)(`div`, {
            children: [
              (0, scope.O.jsx)(`span`, {
                className: `mb-1 block text-[10px] text-ink-800/55 dark:text-ink-100/45`,
                children: `协议`,
              }),
              (0, scope.O.jsx)(`div`, {
                className: `grid grid-cols-2 gap-1 rounded-lg bg-ink-100 p-1 dark:bg-ink-900`,
                children: scope.Qp.map((e) =>
                  (0, scope.O.jsx)(
                    `button`,
                    {
                      type: `button`,
                      onClick: () => c(e.value),
                      'aria-pressed': s === e.value,
                      className: (0, scope.$)(
                        `h-8 rounded-md text-[11px] font-medium transition-colors`,
                        s === e.value
                          ? `bg-white text-ink-900 shadow-sm dark:bg-ink-800 dark:text-ink-50`
                          : `text-ink-800/50 hover:text-ink-900 dark:text-ink-100/40 dark:hover:text-ink-50`,
                      ),
                      children: e.label,
                    },
                    e.value,
                  ),
                ),
              }),
            ],
          }),
          (0, scope.O.jsxs)(`button`, {
            type: `button`,
            disabled: !h || l,
            onClick: () => void g(),
            className: `flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-40`,
            children: [
              l
                ? (0, scope.O.jsx)(scope.m, { className: `size-4 animate-spin` })
                : (0, scope.O.jsx)(scope.Ku, { className: `size-4` }),
              l ? `正在检测出口...` : `检测并加入代理池`,
            ],
          }),
          d &&
            (0, scope.O.jsxs)(`div`, {
              className: (0, scope.$)(
                `flex items-start gap-2 rounded-lg px-3 py-2.5 ring-1`,
                d.state === `ok`
                  ? `bg-emerald-500/10 text-emerald-800 ring-emerald-500/20 dark:text-emerald-200`
                  : `bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300`,
              ),
              children: [
                d.state === `ok`
                  ? (0, scope.O.jsx)(scope.t, { className: `mt-0.5 size-4 shrink-0` })
                  : (0, scope.O.jsx)(scope.Pu, { className: `mt-0.5 size-4 shrink-0` }),
                (0, scope.O.jsxs)(`div`, {
                  className: `min-w-0`,
                  children: [
                    (0, scope.O.jsx)(`p`, {
                      className: `break-words text-[11px] font-medium`,
                      children: d.title,
                    }),
                    d.detail &&
                      (0, scope.O.jsx)(`p`, {
                        className: `mt-0.5 break-words text-[10px] opacity-75`,
                        children: d.detail,
                      }),
                  ],
                }),
              ],
            }),
        ],
      });
    };
    scope.nm = function nm(e) {
      let t = e.trim().toLowerCase();
      return !t || scope.tm.some((e) => t.includes(e.toLowerCase()));
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
      let n = new Set(),
        r = [],
        i = 0;
      for (let t of e.nodes) {
        let e = `${t.scheme}://${t.host.toLowerCase()}:${t.port}`;
        n.has(e) ? (i += 1) : (n.add(e), r.push(t));
      }
      let a = new Map(),
        o = [],
        s = new Set();
      for (let t of e.skips) {
        let e = `${t.reason}:${t.scheme ?? ``}`,
          n = a.get(e);
        (n
          ? (n.count += 1)
          : a.set(e, { reason: t.reason, ...(t.scheme ? { scheme: t.scheme } : {}), count: 1 }),
          t.reason === `unsupported-scheme` &&
            t.name &&
            !s.has(t.name) &&
            !(0, scope.nm)(t.name) &&
            (s.add(t.name), o.push(t.name)));
      }
      return {
        nodes: r,
        skipped: [...a.values()].sort(
          (e, t) => t.count - e.count || (e.scheme ?? ``).localeCompare(t.scheme ?? ``),
        ),
        duplicates: i,
        unsupportedNames: o,
        format: t,
      };
    };
    scope.sm = function sm(e) {
      let t = e.replace(/\s+/g, ``);
      if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(t)) return null;
      try {
        let e = t.replace(/-/g, `+`).replace(/_/g, `/`),
          n = e.padEnd(Math.ceil(e.length / 4) * 4, `=`),
          r = (0, scope.cm)(atob(n));
        return r.includes(`://`) ? r : null;
      } catch {
        return null;
      }
    };
    scope.cm = function cm(e) {
      let t = Uint8Array.from(e, (e) => e.charCodeAt(0));
      return new TextDecoder().decode(t);
    };
    scope.lm = function lm(e) {
      let t = { nodes: [], skips: [] };
      for (let n of e.split(/\r?\n/)) {
        let e = n.trim().replace(/^[-*]\s+/, ``);
        if (!e || e.startsWith(`#`)) continue;
        let r = /^([a-z][a-z0-9+.-]*):\/\/(.*)$/i.exec(e);
        if (!r) {
          let n = (0, scope.um)(e);
          n && t.nodes.push(n);
          continue;
        }
        let i = r[1].toLowerCase(),
          a = scope.rm[i];
        if (!a || !scope.em.has(a)) {
          let e = (0, scope.dm)(i, r[2]);
          t.skips.push({ reason: `unsupported-scheme`, scheme: i, ...(e ? { name: e } : {}) });
          continue;
        }
        let o = (0, scope.fm)(a, r[2]);
        o ? t.nodes.push(o) : t.skips.push({ reason: `malformed`, scheme: i });
      }
      return t;
    };
    scope.um = function um(e) {
      let t = /^(?:(https?|socks4|socks5|socks)\s+)?(\[[^\]]+\]|[^\s:@]+)(?::|\s+)(\d{1,5})$/i.exec(
        e,
      );
      if (!t) return null;
      let n = scope.rm[(t[1] ?? `http`).toLowerCase()],
        r = t[2],
        i = Number(t[3]);
      return !n || !r || !Number.isInteger(i) || i < 1 || i > 65535
        ? null
        : {
            name: `${r.replace(/^\[|\]$/g, ``)}:${i}`,
            scheme: (0, scope.Cd)({ scheme: n, host: r }),
            host: r.replace(/^\[|\]$/g, ``),
            port: i,
            sourceLabel: `手动导入`,
          };
    };
    scope.dm = function dm(e, t) {
      if (e === `vmess`) {
        let e = (0, scope.gm)(t.split(/[?#]/)[0] ?? ``);
        if (!e) return null;
        try {
          let t = JSON.parse(e),
            n = t.ps ?? t.remarks;
          return typeof n == `string` && n.trim() ? n.trim() : null;
        } catch {
          return null;
        }
      }
      let n = t.indexOf(`#`);
      return n < 0 ? null : (0, scope._m)(t.slice(n + 1)).trim() || null;
    };
    scope.fm = function fm(e, t) {
      let n = t.indexOf(`#`),
        r = n >= 0 ? (0, scope._m)(t.slice(n + 1)).trim() : ``,
        i = n >= 0 ? t.slice(0, n) : t;
      if (((i = i.split(/[/?]/)[0] ?? ``), !i)) return null;
      let a = ``,
        o = i.lastIndexOf(`@`);
      o >= 0 && ((a = i.slice(0, o)), (i = i.slice(o + 1)));
      let s = (0, scope.pm)(i);
      if (!s) return null;
      let c = s.port ?? scope.im[e];
      if (!Number.isInteger(c) || c <= 0 || c > 65535) return null;
      let { username: l, password: u } = (0, scope.hm)(a);
      return {
        name: r || `${s.host}:${c}`,
        scheme: (0, scope.Cd)({ scheme: e, host: s.host }),
        host: s.host,
        port: c,
        ...(l ? { username: l } : {}),
        ...(u ? { password: u } : {}),
      };
    };
    scope.pm = function pm(e) {
      if (e.startsWith(`[`)) {
        let t = e.indexOf(`]`);
        if (t < 0) return null;
        let n = e.slice(0, t + 1),
          r = e.slice(t + 1);
        return r
          ? r.startsWith(`:`)
            ? { host: n, port: (0, scope.mm)(r.slice(1)) ?? void 0 }
            : null
          : { host: n };
      }
      let t = e.lastIndexOf(`:`);
      if (t < 0) return e ? { host: e } : null;
      let n = e.slice(0, t),
        r = (0, scope.mm)(e.slice(t + 1));
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
        let e = (0, scope.gm)(t);
        e?.includes(`:`) && (t = e);
      }
      let n = t.indexOf(`:`);
      if (n < 0) return t ? { username: t } : {};
      let r = t.slice(0, n),
        i = t.slice(n + 1);
      return { ...(r ? { username: r } : {}), ...(i ? { password: i } : {}) };
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
      let t = { nodes: [], skips: [] },
        n = e.split(/\r?\n/),
        r = !1,
        i = [],
        a = () => {
          if (!i.length) return;
          let e = (0, scope.bm)(
            i.join(`
`),
            t,
          );
          (e && t.nodes.push(e), (i = []));
        };
      for (let e of n)
        /^\s*proxies\s*:/.test(e)
          ? (r = !0)
          : r &&
            (/^[^\s#-]/.test(e)
              ? (a(), (r = !1))
              : /^\s*-\s/.test(e)
                ? (a(), i.push(e.replace(/^\s*-\s/, ``)))
                : i.length && e.trim() && i.push(e.trim()));
      return (a(), t);
    };
    scope.bm = function bm(e, t) {
      let n = (0, scope.xm)(e, `type`)?.toLowerCase();
      if (!n) return null;
      let r = scope.rm[n];
      if (!r || !scope.em.has(r)) {
        let r = (0, scope.xm)(e, `name`);
        return (
          t.skips.push({ reason: `unsupported-scheme`, scheme: n, ...(r ? { name: r } : {}) }),
          null
        );
      }
      let i = (0, scope.xm)(e, `server`),
        a = (0, scope.mm)((0, scope.xm)(e, `port`) ?? ``);
      if (!i || a == null) return (t.skips.push({ reason: `malformed`, scheme: n }), null);
      let o = (0, scope.xm)(e, `tls`)?.toLowerCase() === `true`,
        s = r === `http` && o ? `https` : r,
        c = (0, scope.xm)(e, `username`),
        l = (0, scope.xm)(e, `password`);
      return {
        name: (0, scope.xm)(e, `name`) || `${i}:${a}`,
        scheme: (0, scope.Cd)({ scheme: s, host: i }),
        host: i,
        port: a,
        ...(c ? { username: c } : {}),
        ...(l ? { password: l } : {}),
      };
    };
    scope.xm = function xm(e, t) {
      let n = RegExp(`(?:^|[\\s{,])${t}\\s*:\\s*([^,}\\n]+)`, `i`).exec(e);
      if (!n) return null;
      let r = n[1]
          .trim()
          .replace(/\s+#.*$/, ``)
          .trim(),
        i = /^(['"])(.*)\1$/.exec(r);
      return (i ? i[2] : r).trim() || null;
    };
    scope.Sm = function Sm(e, t) {
      let n = [
        ...new Set(
          e.filter((e) => e.reason === `unsupported-scheme` && e.scheme).map((e) => e.scheme),
        ),
      ];
      return {
        tone: `info`,
        text: `识别到 ${t} 个节点，都是浏览器不能直连的协议${n.length ? `（${n.join(`、`)}）` : ``}。已在下方列出它们：复制 listeners 配置 → 粘进 Clash Verge 的 Merge / 扩展配置 → 重载 → 回来点「加入代理池」。`,
        hint: `只想先用起来？展开下面的「检测一个本地端口」，默认 7897 就是 Clash 当前选中的出口（所有账号共用同一个出口）。`,
      };
    };
    scope.Cm = function Cm({ onImport: e, onNamesParsed: t, onBusyChange: n }) {
      let [r, i] = (0, scope.k.useState)(``),
        [a, o] = (0, scope.k.useState)(``),
        [c, u] = (0, scope.k.useState)(!1),
        [d, f] = (0, scope.k.useState)(null);
      async function p(n) {
        let r = (0, scope.am)(n);
        if ((t?.(r.unsupportedNames), !r.nodes.length)) {
          if (r.unsupportedNames.length) {
            f((0, scope.Sm)(r.skipped, r.unsupportedNames.length));
            return;
          }
          throw Error(`没有识别到代理地址，请使用 host:port 或 http/socks 地址`);
        }
        let i = await e(
            r.nodes.map((e) => ((0, scope.wm)(e.host) ? { ...e, sourceLabel: `Clash Verge` } : e)),
          ),
          a = [
            i.added ? `新增 ${i.added} 个` : ``,
            i.upgraded ? `补全 ${i.upgraded} 个` : ``,
            i.skipped ? `已有 ${i.skipped} 个` : ``,
            r.unsupportedNames.length
              ? `另有 ${r.unsupportedNames.length} 个节点需要 Clash listener`
              : ``,
          ].filter(Boolean);
        f({ tone: `ok`, text: a.length ? a.join(`，`) : `代理已经在列表中` });
      }
      async function h() {
        if (r.trim() && !c) {
          (u(!0), n?.(!0), f(null));
          try {
            let e = await (0, scope.cd)({ type: `FETCH_SUBSCRIPTION`, url: r.trim() });
            if (!e.ok) throw Error(e.error);
            (await scope.ld
              .set(scope.ud.subscriptionSource, {
                url: r.trim(),
                autoSync: !0,
                lastCheckedAt: Date.now(),
              })
              .catch(() => {}),
              await p(e.feature?.subscription?.text ?? ``));
          } catch (e) {
            f({ tone: `err`, text: e instanceof Error ? e.message : `订阅导入失败` });
          } finally {
            (u(!1), n?.(!1));
          }
        }
      }
      async function g() {
        if (a.trim() && !c) {
          (u(!0), n?.(!0), f(null));
          try {
            await p(a);
          } catch (e) {
            f({ tone: `err`, text: e instanceof Error ? e.message : `代理导入失败` });
          } finally {
            (u(!1), n?.(!1));
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
                children: (0, scope.O.jsx)(scope.s, { className: `size-4` }),
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `min-w-0`,
                children: [
                  (0, scope.O.jsx)(`p`, {
                    className: `text-sm font-semibold text-slate-900 dark:text-slate-100`,
                    children: `订阅地址`,
                  }),
                  (0, scope.O.jsx)(`p`, {
                    className: `mt-0.5 text-xs text-slate-500 dark:text-slate-400`,
                    children: `粘贴地址后直接导入`,
                  }),
                ],
              }),
            ],
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `flex gap-2`,
            children: [
              (0, scope.O.jsx)(`input`, {
                value: r,
                onChange: (e) => i(e.target.value),
                onKeyDown: (e) => {
                  e.key === `Enter` && h();
                },
                placeholder: `https://...`,
                'aria-label': `代理订阅地址`,
                className: `h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100`,
              }),
              (0, scope.O.jsxs)(`button`, {
                type: `button`,
                disabled: !r.trim() || c,
                onClick: () => void h(),
                className: `flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 text-[13px] font-medium text-white hover:bg-blue-700 disabled:opacity-40`,
                children: [
                  c
                    ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` })
                    : (0, scope.O.jsx)(scope.l, { className: `size-3.5` }),
                  `导入`,
                ],
              }),
            ],
          }),
          (0, scope.O.jsxs)(`details`, {
            className: `group`,
            children: [
              (0, scope.O.jsxs)(`summary`, {
                className: `flex cursor-pointer list-none items-center gap-1.5 text-[13px] font-medium text-slate-600 dark:text-slate-300`,
                children: [
                  (0, scope.O.jsx)(scope.Ru, { className: `size-3.5` }),
                  `直接粘贴代理地址`,
                ],
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `mt-2 space-y-2`,
                children: [
                  (0, scope.O.jsx)(`textarea`, {
                    value: a,
                    onChange: (e) => o(e.target.value),
                    placeholder: `127.0.0.1:7890
socks5://127.0.0.1:7891`,
                    'aria-label': `代理地址列表`,
                    rows: 4,
                    className: `w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-[13px] leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100`,
                  }),
                  (0, scope.O.jsxs)(`button`, {
                    type: `button`,
                    disabled: !a.trim() || c,
                    onClick: () => void g(),
                    className: `flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 text-[13px] font-medium text-white hover:bg-blue-700 disabled:opacity-40`,
                    children: [
                      c
                        ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` })
                        : (0, scope.O.jsx)(scope.Ru, { className: `size-3.5` }),
                      `导入这些地址`,
                    ],
                  }),
                ],
              }),
            ],
          }),
          d &&
            (0, scope.O.jsxs)(`div`, {
              role: `status`,
              className: (0, scope.$)(
                `space-y-1 rounded-md px-3 py-2 text-xs leading-relaxed`,
                d.tone === `ok` &&
                  `bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-300`,
                d.tone === `info` &&
                  `bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-300`,
                d.tone === `err` &&
                  `bg-rose-50 text-rose-700 dark:bg-rose-950/25 dark:text-rose-300`,
              ),
              children: [
                (0, scope.O.jsx)(`p`, { children: d.text }),
                d.hint && (0, scope.O.jsx)(`p`, { className: `opacity-75`, children: d.hint }),
              ],
            }),
        ],
      });
    };
    scope.wm = function wm(e) {
      let t = e
        .trim()
        .toLowerCase()
        .replace(/^\[|\]$/g, ``);
      return t === `127.0.0.1` || t === `localhost` || t === `::1`;
    };
    scope.Tm = function Tm({ open: e, busy: t, onClose: n, children: r }) {
      let i = (0, scope.k.useRef)(null);
      return (
        (0, scope.k.useEffect)(() => {
          let t = i.current;
          t && (e && !t.open ? t.showModal() : !e && t.open && t.close());
        }, [e]),
        (0, scope.O.jsx)(`dialog`, {
          ref: i,
          id: `proxy-import`,
          'aria-labelledby': `proxy-import-heading`,
          onCancel: (e) => {
            (e.preventDefault(), t || n());
          },
          onClick: (e) => {
            if (t || e.target !== e.currentTarget) return;
            let r = e.currentTarget.getBoundingClientRect();
            (e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom) &&
              n();
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
                        children: `添加代理`,
                      }),
                      (0, scope.O.jsx)(`p`, {
                        className: `mt-1 text-xs text-slate-500 dark:text-slate-400`,
                        children: `导入后自动加入代理列表。`,
                      }),
                    ],
                  }),
                  (0, scope.O.jsx)(`button`, {
                    type: `button`,
                    onClick: n,
                    disabled: t,
                    'aria-label': `关闭添加代理`,
                    className: `grid size-8 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800`,
                    children: (0, scope.O.jsx)(scope.y, { className: `size-4` }),
                  }),
                ],
              }),
              (0, scope.O.jsx)(`div`, {
                className: `min-h-0 overflow-y-auto p-4 sm:p-5`,
                children: r,
              }),
              (0, scope.O.jsx)(`footer`, {
                className: `flex shrink-0 justify-end border-t border-slate-200 px-5 py-3 dark:border-slate-800`,
                children: (0, scope.O.jsx)(`button`, {
                  type: `button`,
                  onClick: n,
                  disabled: t,
                  className: `h-9 rounded-lg bg-blue-600 px-5 text-[13px] font-medium text-white hover:bg-blue-700 disabled:opacity-40`,
                  children: `完成`,
                }),
              }),
            ],
          }),
        })
      );
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
      compact: u = !1,
      onReturn: f,
    }) {
      let [p, h] = (0, scope.k.useState)(``),
        [g, _] = (0, scope.k.useState)({}),
        [v, y] = (0, scope.k.useState)(!1),
        [b, w] = (0, scope.k.useState)(null),
        T = (0, scope.k.useRef)(null),
        E = b !== null,
        [ee, D] = (0, scope.k.useState)(0),
        [A, j] = (0, scope.k.useState)(null),
        [M, N] = (0, scope.k.useState)(null),
        [P, ne] = (0, scope.k.useState)(null),
        [re, ie] = (0, scope.k.useState)([]),
        [ae, F] = (0, scope.k.useState)(``),
        [I, oe] = (0, scope.k.useState)(`accounts`),
        [se, L] = (0, scope.k.useState)(!1),
        ce = (0, scope.k.useRef)(null),
        le = (0, scope.k.useRef)(null),
        R = (0, scope.k.useMemo)(() => e.filter((e) => !(0, scope.xd)(e)), [e]),
        z = (0, scope.k.useMemo)(() => {
          let t = p.trim().toLowerCase();
          return t ? e.filter((e) => `${e.name} ${e.host}:${e.port}`.toLowerCase().includes(t)) : e;
        }, [e, p]),
        ue = (0, scope.k.useMemo)(() => {
          let e = new Map(),
            t = new Map(r.map((e) => [e.id, e.proxyId]));
          for (let r of n) {
            let n = r.proxyMode ?? `inherit`,
              i = n === `pool` ? r.proxyId : n === `inherit` ? t.get(r.siteId) : void 0;
            i && e.set(i, (e.get(i) ?? 0) + 1);
          }
          return e;
        }, [n, r]);
      function de(e) {
        return !T.current && ((T.current = e), w(e), !0);
      }
      function fe() {
        ((T.current = null), w(null));
      }
      function pe(e, t) {
        e ? (de(t), ne(null), t === `assign` && (j(null), N(null))) : T.current === t && fe();
      }
      async function me(e) {
        _((t) => ({ ...t, [e.id]: { state: `testing` } }));
        try {
          let t = await (0, scope.cd)({ type: `TEST_PROXY`, proxy: e }),
            n = t.ok ? t.test : void 0,
            r = {
              ok: n?.ok === !0,
              message: n?.message || (n?.ok ? `连接正常` : t.ok ? `未收到测试结果` : t.error),
              listenerProbe: n?.listenerProbe ?? `unknown`,
            };
          return (
            _((t) => ({ ...t, [e.id]: { state: r.ok ? `ok` : `fail`, message: r.message } })),
            r
          );
        } catch (t) {
          let n = t instanceof Error ? t.message : `连接测试失败`;
          return (
            _((t) => ({ ...t, [e.id]: { state: `fail`, message: n } })),
            { ok: !1, message: n, listenerProbe: `unknown` }
          );
        }
      }
      async function he(e) {
        if (!(0, scope.xd)(e) && de(`test`)) {
          (j(null), N(null), ne(null));
          try {
            await me(e);
          } finally {
            fe();
          }
        }
      }
      async function ge() {
        if (!R.length || !de(`test-all`)) return;
        (y(!0), D(0), j(null), N(null), ne(null));
        let e = 0,
          t = [];
        try {
          for (let [n, r] of R.entries()) {
            let i = await me(r);
            (i.ok && (e += 1), t.push({ port: r.port, probe: i.listenerProbe, test: i }), D(n + 1));
          }
          (j({ passed: e, total: R.length }), N((0, scope.gp)(t)));
        } catch (e) {
          ne(e instanceof Error ? e.message : `连接测试失败，请重试。`);
        } finally {
          (y(!1), fe());
        }
      }
      async function _e(e) {
        if (de(`remove`)) {
          ne(null);
          try {
            (await o(e.id), ae === e.id && F(``), j(null), N(null));
          } catch (e) {
            ne(e instanceof Error ? e.message : `删除失败，请重试。`);
          } finally {
            fe();
          }
        }
      }
      function ve() {
        L(!0);
      }
      function ye(e) {
        (F(e),
          oe(`accounts`),
          u &&
            requestAnimationFrame(() =>
              ce.current?.scrollIntoView?.({ behavior: `smooth`, block: `start` }),
            ));
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
                    children: `代理与网络`,
                  }),
                  (0, scope.O.jsx)(`p`, {
                    className: `mt-1.5 text-[13px] text-slate-500 dark:text-slate-400`,
                    children: `批量分配可用代理，也可以为账号单独指定。`,
                  }),
                ],
              }),
              (0, scope.O.jsxs)(`div`, {
                className: `flex items-center gap-2`,
                children: [
                  u &&
                    f &&
                    (0, scope.O.jsx)(`button`, {
                      type: `button`,
                      onClick: f,
                      disabled: E,
                      className: `h-9 rounded-lg border border-slate-200 px-3 text-xs font-medium hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-900`,
                      children: `返回总览`,
                    }),
                  (0, scope.O.jsxs)(`button`, {
                    type: `button`,
                    onClick: ve,
                    disabled: E,
                    'aria-haspopup': `dialog`,
                    'aria-controls': `proxy-import`,
                    className: `inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-[13px] font-medium hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900`,
                    children: [(0, scope.O.jsx)(scope.x, { className: `size-4` }), `添加代理`],
                  }),
                ],
              }),
            ],
          }),
          (0, scope.O.jsx)(scope.Tm, {
            open: se,
            busy: E,
            onClose: () => L(!1),
            children: (0, scope.O.jsxs)(`fieldset`, {
              disabled: E,
              className: `min-w-0 space-y-3`,
              children: [
                (0, scope.O.jsx)(`legend`, { className: `sr-only`, children: `代理导入方式` }),
                (0, scope.O.jsx)(scope.Cm, {
                  onImport: i,
                  onNamesParsed: ie,
                  onBusyChange: (e) => pe(e, `import`),
                }),
                re.length > 0 && (0, scope.O.jsx)(scope.Zp, { names: re, onImport: i }),
                (0, scope.O.jsxs)(`details`, {
                  ref: le,
                  className: `rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-900`,
                  children: [
                    (0, scope.O.jsx)(`summary`, {
                      className: `cursor-pointer text-[13px] font-medium`,
                      children: `检测一个本地端口`,
                    }),
                    (0, scope.O.jsx)(`div`, {
                      className: `mt-3`,
                      children: (0, scope.O.jsx)(scope.$p, {
                        onImport: i,
                        onBusyChange: (e) => pe(e, `import`),
                      }),
                    }),
                  ],
                }),
                (0, scope.O.jsxs)(`details`, {
                  className: `rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-900`,
                  children: [
                    (0, scope.O.jsx)(`summary`, {
                      className: `cursor-pointer text-[13px] font-medium`,
                      children: `其他导入方式`,
                    }),
                    (0, scope.O.jsxs)(`div`, {
                      className: `mt-3 space-y-3`,
                      children: [
                        (0, scope.O.jsx)(scope.jp, { onSync: a, onMissingNames: ie }),
                        (0, scope.O.jsx)(scope.Yp, {
                          onSync: a,
                          onNamesRead: ie,
                          onUseLocalProxy: () => {
                            le.current &&
                              ((le.current.open = !0),
                              le.current.scrollIntoView?.({ block: `nearest` }));
                          },
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
          (0, scope.O.jsx)(scope.Ap, {
            proxies: R,
            pool: e,
            accounts: n,
            onAssign: s,
            disabled: E,
            onBusyChange: (e) => pe(e, `assign`),
            onTestProxy: async (e) => (await me(e)).ok,
          }),
          (0, scope.O.jsx)(`nav`, {
            'aria-label': `代理与账号`,
            className: `flex gap-1 rounded-lg bg-slate-200/60 p-1 xl:hidden dark:bg-slate-900`,
            children: [
              [`proxies`, `代理列表`, e.length],
              [`accounts`, `账号绑定`, n.length],
            ].map(([e, t, n]) =>
              (0, scope.O.jsxs)(
                `button`,
                {
                  type: `button`,
                  'aria-pressed': I === e,
                  onClick: () => oe(e),
                  className: (0, scope.$)(
                    `h-9 flex-1 rounded-md text-[13px] font-medium`,
                    I === e
                      ? `bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300`
                      : `text-slate-600 dark:text-slate-400`,
                  ),
                  children: [t, ` · `, n],
                },
                e,
              ),
            ),
          }),
          (0, scope.O.jsxs)(`div`, {
            className: `grid items-start gap-5 xl:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.4fr)]`,
            children: [
              (0, scope.O.jsxs)(`section`, {
                id: `proxy-management`,
                className: (0, scope.$)(
                  `min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950`,
                  I !== `proxies` && `hidden xl:block`,
                ),
                'aria-labelledby': `proxy-list-heading`,
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
                            children: e.length,
                          }),
                        ],
                      }),
                      (0, scope.O.jsxs)(`button`, {
                        type: `button`,
                        onClick: () => void ge(),
                        disabled: !R.length || E,
                        className: `inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-40 dark:text-blue-300 dark:hover:bg-blue-950/40`,
                        children: [
                          v
                            ? (0, scope.O.jsx)(scope.m, { className: `size-3.5 animate-spin` })
                            : (0, scope.O.jsx)(scope.S, { className: `size-3.5` }),
                          v ? `测活中 ${ee}/${R.length}` : `全部测活`,
                        ],
                      }),
                    ],
                  }),
                  (0, scope.O.jsxs)(`div`, {
                    className: `space-y-3 px-4 pb-3 pt-3`,
                    children: [
                      (0, scope.O.jsxs)(`label`, {
                        className: `relative block`,
                        children: [
                          (0, scope.O.jsx)(scope.d, {
                            className: `pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400`,
                          }),
                          (0, scope.O.jsx)(`input`, {
                            value: p,
                            onChange: (e) => h(e.target.value),
                            placeholder: `搜索代理名称或地址`,
                            'aria-label': `搜索代理出口`,
                            className: `h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[13px] outline-none placeholder:text-slate-400 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900`,
                          }),
                        ],
                      }),
                      (0, scope.O.jsx)(`p`, {
                        className: `text-xs text-slate-500 dark:text-slate-400`,
                        children: `点击代理名称，为账号指定此代理。`,
                      }),
                      A &&
                        (0, scope.O.jsxs)(`p`, {
                          role: `status`,
                          className: `text-xs text-slate-600 dark:text-slate-300`,
                          children: [`测试完成，`, A.passed, `/`, A.total, ` 个连接正常。`],
                        }),
                      M &&
                        M.kind !== `ok` &&
                        (0, scope.O.jsxs)(`div`, {
                          role: `status`,
                          className: `rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800 dark:bg-amber-950/30 dark:text-amber-200`,
                          children: [
                            (0, scope.O.jsx)(`p`, { className: `font-medium`, children: M.title }),
                            M.hint &&
                              (0, scope.O.jsx)(`p`, { className: `mt-1`, children: M.hint }),
                          ],
                        }),
                      P &&
                        (0, scope.O.jsx)(`p`, {
                          role: `alert`,
                          className: `text-xs text-rose-600 dark:text-rose-400`,
                          children: P,
                        }),
                    ],
                  }),
                  (0, scope.O.jsxs)(`div`, {
                    className: `max-h-[34rem] divide-y divide-slate-100 overflow-y-auto border-t border-slate-100 xl:max-h-[clamp(12rem,calc(100dvh_-_34rem),34rem)] dark:divide-slate-800 dark:border-slate-800`,
                    children: [
                      (0, scope.O.jsx)(scope.Bc, {
                        initial: !1,
                        children: z.map((e) => {
                          let n = g[e.id] ?? { state: `idle` },
                            r = (0, scope.xd)(e),
                            i = !r && ae === e.id,
                            a = ue.get(e.id) ?? 0;
                          return (0, scope.O.jsxs)(
                            scope.Mu.article,
                            {
                              'aria-label': `代理 ${e.name}`,
                              initial: { opacity: 0 },
                              animate: { opacity: 1 },
                              exit: { opacity: 0 },
                              className: (0, scope.$)(
                                `border-l-2 px-3 py-3 transition-colors`,
                                i
                                  ? `border-l-blue-500 bg-blue-50/60 dark:bg-blue-950/25`
                                  : `border-l-transparent hover:bg-slate-50/70 dark:hover:bg-slate-900/40`,
                              ),
                              children: [
                                (0, scope.O.jsxs)(`div`, {
                                  className: `flex items-start gap-2`,
                                  children: [
                                    (0, scope.O.jsxs)(`button`, {
                                      type: `button`,
                                      onClick: () => ye(e.id),
                                      disabled: r || E,
                                      'aria-pressed': i,
                                      'aria-label': `绑定账号到 ${e.name}`,
                                      className: `flex min-w-0 flex-1 items-start gap-2.5 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-default`,
                                      children: [
                                        (0, scope.O.jsx)(`span`, {
                                          className: (0, scope.$)(
                                            `mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg`,
                                            r
                                              ? `bg-amber-50 text-amber-600 dark:bg-amber-950/30`
                                              : i
                                                ? `bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300`
                                                : `bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400`,
                                          ),
                                          children: r
                                            ? (0, scope.O.jsx)(scope.c, { className: `size-4` })
                                            : (0, scope.O.jsx)(scope.te, { className: `size-4` }),
                                        }),
                                        (0, scope.O.jsxs)(`span`, {
                                          className: `min-w-0 flex-1`,
                                          children: [
                                            (0, scope.O.jsx)(`span`, {
                                              title: e.name,
                                              className: `block truncate text-[13px] font-semibold`,
                                              children: e.name,
                                            }),
                                            (0, scope.O.jsx)(`span`, {
                                              className: `mt-1 block truncate text-xs text-slate-500 dark:text-slate-400`,
                                              children: r
                                                ? `缺少代理地址，暂不能绑定`
                                                : `${(0, scope.Cd)(e)}://${e.host}:${e.port}`,
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    (0, scope.O.jsxs)(`span`, {
                                      className: `pt-0.5 text-xs text-slate-500 dark:text-slate-400`,
                                      children: [a, ` 个账号`],
                                    }),
                                  ],
                                }),
                                (0, scope.O.jsxs)(`div`, {
                                  className: `mt-2 flex items-center gap-2 pl-10`,
                                  children: [
                                    (0, scope.O.jsx)(`span`, {
                                      title: n.message,
                                      className: (0, scope.$)(
                                        `min-w-0 flex-1 truncate text-xs`,
                                        n.state === `ok`
                                          ? `text-emerald-700 dark:text-emerald-400`
                                          : n.state === `fail`
                                            ? `text-rose-600 dark:text-rose-400`
                                            : `text-slate-500 dark:text-slate-400`,
                                      ),
                                      children: r
                                        ? `待补充`
                                        : n.state === `testing`
                                          ? `测活中…`
                                          : n.state === `idle`
                                            ? `未测活`
                                            : n.message,
                                    }),
                                    (0, scope.O.jsxs)(`button`, {
                                      type: `button`,
                                      onClick: () => void he(e),
                                      disabled: r || E,
                                      'aria-label': `测试 ${e.name}`,
                                      title: `测活`,
                                      className: `inline-flex h-7 shrink-0 items-center gap-1 rounded px-1.5 text-xs text-blue-700 hover:bg-blue-50 disabled:opacity-35 dark:text-blue-300 dark:hover:bg-blue-950`,
                                      children: [
                                        n.state === `testing`
                                          ? (0, scope.O.jsx)(scope.m, {
                                              className: `size-3.5 animate-spin`,
                                            })
                                          : n.state === `ok`
                                            ? (0, scope.O.jsx)(scope.t, { className: `size-3.5` })
                                            : n.state === `fail`
                                              ? (0, scope.O.jsx)(scope.Pu, {
                                                  className: `size-3.5`,
                                                })
                                              : (0, scope.O.jsx)(scope.S, {
                                                  className: `size-3.5`,
                                                }),
                                        `测活`,
                                      ],
                                    }),
                                    (0, scope.O.jsx)(`button`, {
                                      type: `button`,
                                      onClick: () => void _e(e),
                                      disabled: E,
                                      'aria-label': `删除 ${e.name}`,
                                      title: `删除代理`,
                                      className: `grid size-7 shrink-0 place-items-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-35 dark:hover:bg-rose-950/30`,
                                      children: (0, scope.O.jsx)(scope.C, {
                                        className: `size-3.5`,
                                      }),
                                    }),
                                  ],
                                }),
                              ],
                            },
                            e.id,
                          );
                        }),
                      }),
                      !z.length &&
                        (0, scope.O.jsx)(`p`, {
                          className: `px-4 py-10 text-center text-[13px] text-slate-500 dark:text-slate-400`,
                          children: e.length
                            ? `没有匹配的代理。`
                            : `还没有代理，点击右上方“添加代理”。`,
                        }),
                    ],
                  }),
                ],
              }),
              (0, scope.O.jsxs)(`section`, {
                ref: ce,
                id: `account-proxy-binding`,
                'aria-labelledby': `account-proxy-binding-heading`,
                className: (0, scope.$)(
                  `min-w-0 scroll-mt-20 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950`,
                  I !== `accounts` && `hidden xl:block`,
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
                            children: n.length,
                          }),
                        ],
                      }),
                      (0, scope.O.jsx)(`p`, {
                        className: `mt-1.5 text-xs text-slate-500 dark:text-slate-400`,
                        children: `查看当前代理，勾选账号后可批量指定。`,
                      }),
                    ],
                  }),
                  (0, scope.O.jsx)(scope._p, {
                    open: !0,
                    initialProxyId: ae || void 0,
                    onProxyChange: F,
                    proxies: e,
                    accounts: n,
                    sites: r,
                    onAssign: s,
                    onSetAccountProxy: l,
                    disabled: E,
                    onBusyChange: (e) => pe(e, `bind`),
                    onShowImport: ve,
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
      case 0: {
        scope.$f = {
          [scope.nd.NEW_API]: { checkinPath: `/console/personal` },
          [scope.nd.SUB2API]: { checkinPath: `/check-in` },
          [scope.nd.VO_API_V2]: {},
          [scope.nd.UNSUPPORTED]: {},
        };
        break;
      }
      case 1: {
        scope.ep = new Set([
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
          scope.td.ANYROUTER,
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
          socks4: `socks4`,
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
          { key: `cn`, label: `中国大陆`, patterns: [/中国大陆|回国|大陆/] },
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
            hint: `分配其余账号，保留手动绑定、直连和自定义代理`,
          },
          { value: `all`, label: `全部重新分配`, hint: `覆盖已有绑定，包括直连和自定义地址` },
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
        scope.Pp = new Set([`http:`, `https:`]);
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
          ...Array.from({ length: 10 }, (e, t) => 9090 + t),
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
          { value: `socks5`, label: `SOCKS5` },
        ];
        break;
      }
      case 17: {
        scope.em = new Set([`http`, `https`, `socks4`, `socks5`]);
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
          `频道`,
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
          socks5h: `socks5`,
        };
        break;
      }
      case 20: {
        scope.im = { http: 80, https: 443, socks4: 1080, socks5: 1080 };
        break;
      }
    }
  },
  storeProperties: {},
});

// 代理管理、订阅导入、出口测试与账号代理分配 — app published scope.

export const appRuntime = createUiModuleRuntime({
  bindingNames: ['vr', 'yr', 'br', 'xr', 'Ni', 'Pi', 'Fi'],

  register(scope) {
    scope.vr = function vr(e, t) {
      let n = new Set(t),
        r = Object.entries(e).filter(([e]) => n.has(e));
      return r.length === Object.keys(e).length ? e : Object.fromEntries(r);
    };
    scope.yr = function yr(e) {
      return e
        .replace(/^\s*[[［(（]\s*[A-Za-z]{2}\s*[\]］)）]\s*/u, ``)
        .replace(/[(（]\s*\d{2,5}\s*[)）]\s*$/u, ``)
        .replace(/[\s_\-—－]+/gu, ``)
        .toLowerCase()
        .trim();
    };
    scope.br = function br(e) {
      let t = e.host.trim().toLowerCase(),
        n = t.startsWith(`[`) && t.endsWith(`]`) ? t.slice(1, -1) : t;
      return n === `localhost` || n === `127.0.0.1` || n === `::1` || n === `0:0:0:0:0:0:0:1`
        ? `local-listener:${e.port}`
        : `${e.scheme}://${n}:${e.port}`;
    };
    scope.xr = function xr(e, t) {
      let n = new Map();
      for (let t of e) {
        if (t.nameOnly !== !0) continue;
        let e = (0, scope.yr)(t.name);
        if (!e) continue;
        let r = n.get(e) ?? [];
        (r.push(t), n.set(e, r));
      }
      let r = new Map();
      for (let t of e) {
        if (t.nameOnly === !0) continue;
        let e = (0, scope.br)(t),
          n = r.get(e) ?? [];
        (n.push(t), r.set(e, n));
      }
      let i = [],
        a = [],
        o = [],
        s = new Set(),
        c = new Set();
      for (let e of t) {
        if (e.nameOnly === !0) {
          o.push(e);
          continue;
        }
        let t = (0, scope.br)(e);
        if (c.has(t)) continue;
        c.add(t);
        let l = (0, scope.yr)(e.name),
          u = l ? (n.get(l) ?? []) : [],
          d = l && !s.has(l) ? u[0] : void 0,
          f = r.get(t) ?? [];
        if (f.length) {
          if (e.sourceLabel !== `Clash Verge`) continue;
          if (d) {
            (s.add(l),
              i.push({
                id: d.id,
                patch: {
                  name: e.name,
                  scheme: e.scheme,
                  host: e.host,
                  port: e.port,
                  sourceLabel: e.sourceLabel,
                },
              }));
            for (let e of u) e.id !== d.id && a.push({ fromId: e.id, toId: d.id });
            for (let e of f) e.id !== d.id && a.push({ fromId: e.id, toId: d.id });
            continue;
          }
          let t = f[0],
            n = f.slice(1);
          (t.name !== e.name || t.sourceLabel !== e.sourceLabel || n.length) &&
            i.push({ id: t.id, patch: { name: e.name, sourceLabel: e.sourceLabel } });
          for (let e of n) a.push({ fromId: e.id, toId: t.id });
        } else if (d) {
          (s.add(l),
            i.push({
              id: d.id,
              patch: {
                name: e.name,
                scheme: e.scheme,
                host: e.host,
                port: e.port,
                ...(e.sourceLabel === void 0 ? {} : { sourceLabel: e.sourceLabel }),
              },
            }));
          for (let e of u) e.id !== d.id && a.push({ fromId: e.id, toId: d.id });
        } else o.push(e);
      }
      return { upgrades: i, merges: a, additions: o };
    };
    scope.Ni = function Ni(e) {
      return new Set(e.filter((e) => e.nameOnly !== !0).map((e) => e.id));
    };
    scope.Pi = function Pi(e, t, n, r, i) {
      let { upgrades: a, merges: o, additions: s } = (0, scope.xr)(e, r),
        c = new Map(a.map((e) => [e.id, e.patch])),
        l = new Map(o.map(({ fromId: e, toId: t }) => [e, t])),
        u = new Set(l.keys()),
        d = (e) => (e.nameOnly ? `name:${e.name.trim()}` : (0, scope.br)(e)),
        f = e.flatMap((e) => {
          if (u.has(e.id)) return [];
          let t = c.get(e.id);
          if (!t) return [e];
          let { nameOnly: n, ...r } = e;
          return [{ ...r, ...t }];
        }),
        p = new Set(f.map(d)),
        m = [];
      for (let e of s) {
        let t = d(e);
        p.has(t) || (p.add(t), m.push({ ...e, id: (0, scope.Ft)(`px`) }));
      }
      let h = i ? new Set(r.filter((e) => e.nameOnly !== !0).map(scope.br)) : void 0,
        g = i
          ? new Set(r.filter((e) => e.nameOnly === !0).map((e) => (0, scope.yr)(e.name)))
          : void 0,
        _ = new Set();
      for (let e of t) e.proxyId && _.add(e.proxyId);
      for (let e of n) e.proxyId && _.add(e.proxyId);
      let v = new Set(),
        y = 0;
      return {
        proxies: f
          .concat(m)
          .filter((e) =>
            !i ||
            e.sourceLabel !== i ||
            (e.nameOnly !== !0 && h?.has((0, scope.br)(e))) ||
            (e.nameOnly === !0 && g?.has((0, scope.yr)(e.name)))
              ? !0
              : _.has(e.id)
                ? ((y += 1), !0)
                : (v.add(e.id), !1),
          ),
        accounts: t.map((e) => {
          if (!e.proxyId) return e;
          let t = l.get(e.proxyId);
          if (t) return { ...e, proxyId: t };
          if (!v.has(e.proxyId)) return e;
          let n = { ...e, proxyMode: `inherit` };
          return (delete n.proxyId, delete n.proxyPinned, n);
        }),
        sites: n.map((e) => {
          if (!e.proxyId) return e;
          let t = l.get(e.proxyId);
          return t ? { ...e, proxyId: t } : v.has(e.proxyId) ? { ...e, proxyId: void 0 } : e;
        }),
        added: m.length,
        skipped: r.length - m.length - a.length,
        upgraded: a.length,
        removed: v.size,
        keptInUse: y,
        changed: m.length > 0 || a.length > 0 || u.size > 0 || v.size > 0,
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
        },
      };
    },
    store_Li_addProxies(scope) {
      return {
        addProxies(e) {
          return (0, scope.X)(async () => {
            let [t, n, r] = await Promise.all([
                scope.z.get(scope.M.proxies, []),
                scope.z.get(scope.M.accounts, []),
                scope.z.get(scope.M.sites, []),
              ]),
              i = (0, scope.Pi)(t, n, r, e);
            if (i.changed) {
              let e = { [scope.M.proxies]: i.proxies };
              (i.accounts.some((e, t) => e !== n[t]) && (e[scope.M.accounts] = i.accounts),
                i.sites.some((e, t) => e !== r[t]) && (e[scope.M.sites] = i.sites),
                await scope.z.setMany(e));
            }
            return { added: i.added, skipped: i.skipped, upgraded: i.upgraded };
          });
        },
      };
    },
    store_Li_syncClashProxies(scope) {
      return {
        syncClashProxies(e) {
          return (0, scope.X)(async () => {
            let [t, n, r] = await Promise.all([
                scope.z.get(scope.M.proxies, []),
                scope.z.get(scope.M.accounts, []),
                scope.z.get(scope.M.sites, []),
              ]),
              i = (0, scope.Pi)(t, n, r, e, `Clash Verge`);
            return (
              i.changed &&
                (await scope.z.setMany({
                  [scope.M.proxies]: i.proxies,
                  [scope.M.accounts]: i.accounts,
                  [scope.M.sites]: i.sites,
                })),
              {
                added: i.added,
                skipped: i.skipped,
                upgraded: i.upgraded,
                removed: i.removed,
                keptInUse: i.keptInUse,
              }
            );
          });
        },
      };
    },
    store_Li_updateProxy(scope) {
      return {
        updateProxy(e, t) {
          return (0, scope.X)(async () => {
            let n = await scope.z.get(scope.M.proxies, []);
            await scope.z.set(
              scope.M.proxies,
              n.map((n) => (n.id === e ? { ...n, ...t } : n)),
            );
          });
        },
      };
    },
    store_Li_removeProxy(scope) {
      return {
        removeProxy(e) {
          return (0, scope.X)(async () => {
            let [t, n, r] = await Promise.all([
              scope.z.get(scope.M.proxies, []),
              scope.z.get(scope.M.sites, []),
              scope.z.get(scope.M.accounts, []),
            ]);
            await scope.z.setMany({
              [scope.M.proxies]: t.filter((t) => t.id !== e),
              [scope.M.sites]: n.map((t) => (t.proxyId === e ? { ...t, proxyId: void 0 } : t)),
              [scope.M.accounts]: r.map((t) => {
                if (t.proxyId !== e) return t;
                let n = { ...t, proxyMode: `inherit` };
                return (delete n.proxyId, n);
              }),
            });
          });
        },
      };
    },
    store_Li_assignAccountProxies(scope) {
      return {
        assignAccountProxies(e) {
          return (0, scope.X)(async () => {
            let [t, n] = await Promise.all([
                scope.z.get(scope.M.accounts, []),
                scope.z.get(scope.M.proxies, []),
              ]),
              r = (0, scope.Ni)(n),
              i = new Map(e.filter((e) => r.has(e.proxyId)).map((e) => [e.accountId, e]));
            if (!i.size) return { assigned: 0 };
            let a = 0,
              o = t.map((e) => {
                let t = i.get(e.id);
                if (!t) return e;
                a += 1;
                let n = (0, scope.Ii)(e, { proxyMode: `pool`, proxyId: t.proxyId });
                if (t.pinned) return { ...n, proxyPinned: !0 };
                let { proxyPinned: r, ...o } = n;
                return o;
              });
            return (a && (await scope.z.set(scope.M.accounts, o)), { assigned: a });
          });
        },
      };
    },
    store_Ui_addProxy(scope, e, t) {
      return {
        async addProxy(e) {
          (await (0, scope.Vi)({ action: `add-proxy`, input: e }), await t().load());
        },
      };
    },
    store_Ui_addProxies(scope, e, t) {
      return {
        async addProxies(e) {
          if (e.length === 0) return { added: 0, skipped: 0, upgraded: 0 };
          let n = await (0, scope.Vi)({ action: `add-proxies`, inputs: e }),
            r = { added: n.added ?? 0, skipped: n.skipped ?? e.length, upgraded: n.upgraded ?? 0 };
          return ((r.added || r.upgraded) && (await t().load()), r);
        },
      };
    },
    store_Ui_syncClashProxies(scope, e, t) {
      return {
        async syncClashProxies(e) {
          let n = await (0, scope.H)({ type: `SYNC_CLASH_PROXIES`, inputs: e });
          if (!n.ok) throw Error(n.error);
          let r = n.feature?.clashConfigSync ?? {
            added: 0,
            skipped: e.length,
            upgraded: 0,
            removed: 0,
            keptInUse: 0,
          };
          return (await t().load(), r);
        },
      };
    },
    store_Ui_updateProxy(scope, e, t) {
      return {
        async updateProxy(e, n) {
          (await (0, scope.Vi)({ action: `update-proxy`, proxyId: e, patch: n }), await t().load());
        },
      };
    },
    store_Ui_removeProxy(scope, e, t) {
      return {
        async removeProxy(e) {
          (await (0, scope.Vi)({ action: `remove-proxy`, proxyId: e }), await t().load());
        },
      };
    },
    store_Ui_assignAccountProxies(scope, e, t) {
      return {
        async assignAccountProxies(e) {
          if (e.length === 0) return 0;
          let n =
            (await (0, scope.Vi)({ action: `assign-account-proxies`, assignments: e })).assigned ??
            0;
          return (n && (await t().load()), n);
        },
      };
    },
  },
});
