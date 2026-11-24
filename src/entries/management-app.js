/** src/entries/management-app.js: 功能模块实现，保留发布版本的符号以便逐步恢复命名。 */
import { createUiModuleRuntime, createUiScope, initializeUiScope } from '../shared/ui-scope.js';

// 管理应用编排和跨功能数据快照 — app published scope.

export const appRuntime = createUiModuleRuntime({
  bindingNames: ['Li', 'zi', 'Ui', 'du'],

  register(scope) {
    scope.du = function du({ surface: e = `page` }) {
      let {
          sites: t,
          accounts: n,
          proxies: r,
          status: i,
          live: a,
          queue: o,
          loading: s,
          launchMode: c,
          schedule: d,
          balances: f,
          load: p,
          setLaunchMode: m,
          syncLaunchMode: _,
          addSite: b,
          addSites: S,
          updateSite: T,
          moveSite: E,
          removeSite: D,
          removeMany: k,
          addAccount: A,
          addAccounts: j,
          updateAccount: M,
          removeAccount: N,
          addProxies: P,
          syncClashProxies: ee,
          removeProxy: ne,
          assignAccountProxies: I,
          setSchedule: ie,
          statusOf: L,
          resultOf: ae,
          balanceOf: se,
          refreshingBalances: ce,
          refreshBalances: de,
          liveOf: z,
          isQueued: B,
          setStatus: V,
          markDone: fe,
        } = (0, scope.Ui)(),
        U = e === `sidepanel`,
        [pe, me] = (0, scope.G.useState)(`overview`),
        he = e === `page`,
        _e = (0, scope.G.useMemo)(
          () => r.filter((e) => e.nameOnly !== !0 || e.sourceLabel === `Clash Verge`).length,
          [r],
        ),
        [ve, ye] = (0, scope.G.useState)(!1),
        [be, xe] = (0, scope.G.useState)(`add`),
        [Se, Ce] = (0, scope.G.useState)(!1),
        [we, Te] = (0, scope.G.useState)(null),
        [Ee, Oe] = (0, scope.G.useState)(null),
        [ke, Ae] = (0, scope.G.useState)(!1),
        [je, Me] = (0, scope.G.useState)(!1),
        [Ne, Pe] = (0, scope.G.useState)(!1),
        [Ie, Le] = (0, scope.G.useState)(),
        [Re, ze] = (0, scope.G.useState)(null),
        [Be, Ve] = (0, scope.G.useState)(!1),
        [He, We] = (0, scope.G.useState)(!1),
        [Ge, Ke] = (0, scope.G.useState)(new Set()),
        [qe, Je] = (0, scope.G.useState)(new Set()),
        [Ye, Xe] = (0, scope.G.useState)(!1),
        [Ze, Qe] = (0, scope.G.useState)(null),
        [$e, et] = (0, scope.G.useState)(!1),
        [tt, nt] = (0, scope.G.useState)(null),
        [rt, it] = (0, scope.G.useState)(null),
        [at, ot] = (0, scope.G.useState)(``),
        [st, ct] = (0, scope.ql)(),
        [lt, ut] = (0, scope.Wl)(),
        [dt, ft] = (0, scope.G.useState)(),
        pt = (0, scope.G.useRef)(!1),
        [mt, ht] = (0, scope.G.useState)(!1),
        [gt, _t] = (0, scope.G.useState)(() => new Map()),
        [vt, bt] = (0, scope.G.useState)(() => new Map()),
        [xt, St] = (0, scope.G.useState)(() => new Map()),
        Ct = (0, scope.G.useRef)(new Set());
      ((0, scope.G.useEffect)(() => {
        p();
        let e = (e) => {
          e?.type === `STATUS_CHANGED` && p();
        };
        chrome.runtime.onMessage.addListener(e);
        let t = (e, t) => {
          let n = e.launchMode?.newValue;
          t === `local` && (n === `sidepanel` || n === `tab`) && _(n);
        };
        return (
          chrome.storage.onChanged.addListener(t),
          () => {
            (chrome.runtime.onMessage.removeListener(e),
              chrome.storage.onChanged.removeListener(t));
          }
        );
      }, [p, _]),
        (0, scope.G.useEffect)(() => {
          let e = !1,
            t,
            n = (e) => {
              t = window.setTimeout(() => {
                r();
              }, e);
            },
            r = async () => {
              if (e) return;
              let t = await (0, scope.H)({ type: `GET_LEARNING` }).catch(() => null);
              if (e) return;
              let r = new Map();
              if (t?.ok)
                for (let e of t.feature?.learningSessions ?? [])
                  r.set(e.accountId, {
                    eventCount: e.eventCount,
                    kind: e.kind ?? `checkin`,
                    ...(e.preview ? { preview: e.preview } : {}),
                    ...(e.guide ? { guide: e.guide } : {}),
                    ...(e.loginAsCheckinAvailable ? { loginAsCheckinAvailable: !0 } : {}),
                  });
              (_t((e) => ((0, scope.fu)(e, r) ? e : r)),
                (Ct.current = new Set(r.keys())),
                n(r.size > 0 ? 3e3 : 3e4));
            };
          return (
            (scope.su = () => {
              e || (t !== void 0 && window.clearTimeout(t), r());
            }),
            r(),
            () => {
              ((e = !0), (scope.su = null), t !== void 0 && window.clearTimeout(t));
            }
          );
        }, []),
        (0, scope.G.useEffect)(() => {
          let e = () => {
            chrome.windows
              .getCurrent()
              .then((e) => {
                e.id != null && ft(e.id);
              })
              .catch(() => {});
          };
          return (
            e(),
            chrome.windows.onFocusChanged.addListener(e),
            () => chrome.windows.onFocusChanged.removeListener(e)
          );
        }, []),
        (0, scope.G.useEffect)(() => {
          if (ve || !we) return;
          let e = we,
            t = window.setTimeout(() => {
              (Te(null), Le(e), ze(null), Ae(!0));
            }, 180);
          return () => window.clearTimeout(t);
        }, [we, ve]));
      let wt = (0, scope.G.useMemo)(() => (0, scope.tc)(n, st), [n, st]),
        Tt = (0, scope.G.useMemo)(() => (0, scope.Ll)(t, lt), [t, lt]),
        Et = (0, scope.G.useMemo)(
          () =>
            Tt.map((e) => {
              let t = wt.filter((t) => t.siteId === e.id);
              return { site: e, accounts: t, ...(0, scope.uu)(t, L) };
            }),
          [wt, Tt, i, a, o, L],
        ),
        Ot = (0, scope.G.useMemo)(() => new Map(Et.map((e, t) => [e.site.id, t])), [Et]),
        kt = (0, scope.G.useMemo)(() => new Set(t.map((e) => e.id)), [t]),
        At = (0, scope.G.useMemo)(() => wt.filter((e) => !kt.has(e.siteId)), [wt, kt]),
        jt = (0, scope.G.useMemo)(() => {
          let e = new Map(t.map((e) => [e.id, e.proxyId])),
            r = new Map();
          for (let t of n) {
            let n = t.proxyMode ?? `inherit`,
              i = n === `pool` ? t.proxyId : n === `inherit` ? e.get(t.siteId) : void 0;
            i && r.set(i, (r.get(i) ?? 0) + 1);
          }
          return r;
        }, [n, t]),
        Mt = (0, scope.G.useMemo)(() => {
          let e = at.trim().toLowerCase();
          return e
            ? Et.flatMap((t) => {
                if (`${t.site.name} ${t.site.loginUrl}`.toLowerCase().includes(e)) return [t];
                let n = t.accounts.filter((t) =>
                  `${t.username} ${t.label ?? ``}`.toLowerCase().includes(e),
                );
                return n.length ? [{ ...t, accounts: n, ...(0, scope.uu)(n, L) }] : [];
              })
            : Et;
        }, [at, Et, L]),
        Nt = (0, scope.G.useMemo)(() => {
          let e = at.trim().toLowerCase();
          return e
            ? At.filter((t) =>
                `${t.username} ${t.label ?? ``} ${t.siteId}`.toLowerCase().includes(e),
              )
            : At;
        }, [At, at]),
        q = (0, scope.G.useMemo)(() => {
          let e = Et.reduce(
            (e, t) => ({
              total: e.total + t.total,
              done: e.done + t.done,
              pending: e.pending + t.pending,
              running: e.running + t.running,
              attention: e.attention + t.attention,
              failed: e.failed + t.failed,
            }),
            { total: 0, done: 0, pending: 0, running: 0, attention: 0, failed: 0 },
          );
          return {
            ...e,
            actionable: e.pending + e.failed,
            progress: e.total ? Math.round((e.done / e.total) * 100) : 0,
          };
        }, [Et]),
        Pt = (0, scope.G.useMemo)(
          () =>
            (0, scope.F)(
              t.flatMap((e) => {
                let t = e.adapter?.family;
                return n
                  .filter((t) => t.siteId === e.id)
                  .map((n) => ({
                    balance: (0, scope.te)(se(n.id), ae(n.id)).balance,
                    scale: { quotaPerUnit: e.adapter?.quotaPerUnit, family: t },
                  }));
              }),
            ),
          [n, t, f, se, ae],
        ),
        Ft = Ge.size,
        It = qe.size,
        Lt = n.filter((e) => Ge.has(e.siteId)).length,
        Rt = Ft + It,
        zt = (0, scope.G.useMemo)(
          () =>
            Mt.flatMap((e) =>
              e.accounts
                .filter((e) => {
                  let t = L(e.id);
                  return t === `pending` || t === `failed`;
                })
                .map((e) => e.id),
            ),
          [Mt, L],
        ),
        Bt = ve || ke || je || Be || Ye || !!Ze;
      async function Vt(e) {
        let t = await (0, scope.H)({ type: `START_LOGIN`, accountId: e });
        (t.ok
          ? t.queued === 0
            ? J(`该账号已在执行或排队中，可先停止再重试`)
            : it(Date.now())
          : J(`启动失败: ${t.error}`),
          p());
      }
      async function Ht(e, t = !1) {
        if (e.length === 0) return;
        let n = await (0, scope.H)({ type: `CANCEL_CHECKIN`, accountIds: e });
        if (!n.ok) {
          J(`停止失败: ${n.error}`);
          return;
        }
        let r = n.feature?.stopped ?? 0;
        if (!t) {
          (J(r ? `已停止 ${r} 个任务，可以重新执行了` : `这些账号当前没有在执行的任务`), p());
          return;
        }
        let i = await (0, scope.H)({ type: `START_BATCH`, accountIds: e });
        (p(),
          i.ok
            ? (it(Date.now()),
              J(
                i.queued ? `已停止并重新排队 ${i.queued} 个账号` : `已停止，但没有可重新执行的账号`,
              ))
            : J(`已停止，但重新执行失败: ${i.error}`));
      }
      async function Ut(e) {
        try {
          (await V(e, `pending`), J(`已改回待签到，可以重新签到了`));
        } catch (e) {
          J(`重置失败: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
      async function Wt(e) {
        try {
          (await fe(e), J(`已标记为已签到，今天不再提醒`));
        } catch (e) {
          J(`标记失败: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
      async function Gt(e) {
        let t = await (0, scope.H)({ type: `CAPTURE_SESSION`, accountId: e });
        if (!t.ok) {
          J(`抓取失败: ${t.error}`);
          return;
        }
        let n = t.feature?.captured;
        if (!n) {
          J(`没抓到登录凭据，请确认已在该站点登录`);
          return;
        }
        p();
        let r = n.identity.email ?? n.identity.username ?? n.identity.userId;
        J(
          n.session.refreshToken
            ? `已抓取登录态${r ? `（${r}）` : ``}，之后签到不用再登录`
            : `已抓取登录态${r ? `（${r}）` : ``}，但站点没给 refresh token，过期后需重新抓取`,
        );
      }
      async function Kt(e, t, n) {
        let r = Ct.current.has(e) ? await qt(e) : void 0,
          i = await (0, scope.H)({
            type: `TOGGLE_LEARNING`,
            accountId: e,
            kind: t,
            ...(n?.loginAsCheckin ? { loginAsCheckin: !0 } : {}),
          });
        if (!i.ok) return (J(`学习失败: ${i.error}`), !1);
        let a = i.feature?.learning;
        if (a?.active)
          ((Ct.current = new Set([...Ct.current, e])),
            _t((n) => {
              let r = new Map(n);
              return (
                r.set(e, {
                  eventCount: a.eventCount,
                  kind: a.kind ?? t,
                  ...(a.preview ? { preview: a.preview } : {}),
                }),
                r
              );
            }),
            Yt(e),
            Jt(e),
            (0, scope.su)?.(),
            J(
              a.kind === `login`
                ? `已开始学习登录：点开始 → 手动登录 → 点结束。只保存安全选择器，不保存账号或密码内容`
                : `已开始学习本站流程：一次演示里先手动登录 → 再完成一次签到 → 点结束；登录配置与签到步骤会一起保存。全程不要点「退出登录」`,
            ));
        else if (a?.saved) {
          let t = new Set(Ct.current);
          (t.delete(e),
            (Ct.current = t),
            _t((t) => {
              let n = new Map(t);
              return (n.delete(e), n);
            }));
          let n = (0, scope._a)(a);
          (bt((t) => {
            let r = new Map(t);
            return (n ? r.set(e, n) : r.delete(e), r);
          }),
            St((t) => {
              let n = new Map(t);
              return (r && r.length > 0 ? n.set(e, [...r]) : n.delete(e), n);
            }),
            (0, scope.su)?.(),
            J((0, scope.Sa)(a)),
            p());
        }
        return !0;
      }
      async function qt(e) {
        let t = await (0, scope.H)({ type: `GET_LEARNING` }).catch(() => null),
          n =
            (t?.ok ? t.feature?.learningSessions : void 0)?.find((t) => t.accountId === e)
              ?.preview ?? gt.get(e)?.preview;
        return n && n.length > 0 ? [...n] : void 0;
      }
      function Jt(e) {
        St((t) => {
          if (!t.has(e)) return t;
          let n = new Map(t);
          return (n.delete(e), n);
        });
      }
      function Yt(e) {
        bt((t) => {
          if (!t.has(e)) return t;
          let n = new Map(t);
          return (n.delete(e), n);
        });
      }
      async function Xt(e) {
        let t = await (0, scope.H)({ type: `CANCEL_LEARNING`, accountId: e });
        if (!t.ok) {
          J(`取消失败: ${t.error}`);
          return;
        }
        let n = new Set(Ct.current);
        (n.delete(e),
          (Ct.current = n),
          _t((t) => {
            let n = new Map(t);
            return (n.delete(e), n);
          }),
          Yt(e),
          Jt(e),
          (0, scope.su)?.(),
          J(`已放弃本次学习，站点配置未改动`));
      }
      async function Zt(e) {
        if (e.length === 0) return { ok: !1, queued: 0 };
        let t = await (0, scope.H)({ type: `START_BATCH`, accountIds: e });
        if (!t.ok) return (J(`批量启动失败: ${t.error}`), { ok: !1, queued: 0 });
        let n = t.queued ?? 0;
        return (
          it(Date.now()),
          p(),
          J(n ? `已加入后台队列 ${n} 个账号` : `这些账号已经在签到队列中`),
          { ok: !0, queued: n }
        );
      }
      let Qt = (e) =>
          n
            .filter((t) => !e || t.siteId === e)
            .filter((e) => {
              let t = L(e.id);
              return t === `running` || t === `attention` || (t === `pending` && B(e.id));
            })
            .map((e) => e.id),
        $t = (e) =>
          n
            .filter((t) => (e ? t.siteId === e : kt.has(t.siteId)))
            .filter((e) => {
              let t = L(e.id);
              return t === `pending` || t === `failed`;
            })
            .map((e) => e.id);
      async function en(e, r) {
        let i = n.find((t) => t.id === e),
          a = t.find((e) => e.id === r);
        if (!i || !a) throw Error(`账号或目标站点已发生变化，请刷新后重试`);
        (await M(e, { siteId: r }),
          J(
            `已将 ${i.label || i.username} 恢复到 ${a.name}；账号密码和代理已保留，旧站专属凭据已清除`,
          ));
      }
      async function tn() {
        if (!Ze || $e) return;
        let e = Ze;
        et(!0);
        try {
          (e.kind === `account`
            ? (await N(e.id), J(`已删除账号 ${e.name}`))
            : (await D(e.id),
              J(
                e.accountCount
                  ? `已删除站点 ${e.name}，${e.accountCount} 个账号已移到待恢复账号`
                  : `已删除站点 ${e.name}`,
              )),
            Qe(null));
        } finally {
          et(!1);
        }
      }
      function J(e) {
        (nt(e), setTimeout(() => nt(null), 2600));
      }
      function nn(e = !1) {
        (Oe(null), xe(`add`), Ce(e), ye(!0));
      }
      function rn() {
        (Oe(null), xe(`import`), Ce(!1), ye(!0));
      }
      function an(e) {
        (ze(null), t.length === 0 ? (Le(void 0), nn(!0)) : (Le(e), Ae(!0)));
      }
      async function on(e) {
        let t = new Set(scope.Ui.getState().sites.map((e) => e.id));
        await b(e);
        let n = scope.Ui.getState().sites,
          r =
            n.find((n) => !t.has(n.id) && n.loginUrl.trim() === e.loginUrl.trim()) ??
            n.find((e) => !t.has(e.id));
        r ? Te(r.id) : J(`站点已保存，请从站点卡片添加账号`);
      }
      async function sn(t) {
        let n = t === `tab` ? e === `page` : e === `sidepanel`;
        if (pt.current || (t === c && n)) return;
        let r = c;
        ((pt.current = !0), ht(!0));
        let i = (e, t) => (e instanceof Error ? e.message : t);
        try {
          if (t === `sidepanel`) {
            let n = (0, scope.wn)(t, e, dt),
              a = m(t),
              [o, s] = await Promise.allSettled([a, n]);
            if (o.status === `rejected`) {
              (s.status === `fulfilled` &&
                r === `tab` &&
                (await (0, scope.wn)(`tab`, e, dt).catch(() => {})),
                J(`启动模式保存失败：${i(o.reason, `请重试`)}`));
              return;
            }
            if (s.status === `rejected`) {
              J(`模式已保存，但当前界面未能立即切换：${i(s.reason, `请点击扩展图标重试`)}`);
              return;
            }
            J(`已切换并打开侧边栏`);
            return;
          }
          try {
            await m(t);
          } catch (e) {
            J(`启动模式保存失败：${i(e, `请重试`)}`);
            return;
          }
          try {
            (await (0, scope.wn)(t, e, dt)).sidePanelClosed
              ? J(`已切换并打开独立页面`)
              : J(`独立页模式已开启；当前 Chrome 版本请手动关闭侧栏`);
          } catch (e) {
            J(`模式已保存，但当前界面未能立即切换：${i(e, `请点击扩展图标重试`)}`);
          }
        } finally {
          ((pt.current = !1), ht(!1));
        }
      }
      function cn() {
        (Ke(new Set()), Je(new Set()));
      }
      function ln() {
        (He && cn(), We((e) => !e), Xe(!1));
      }
      function un(e) {
        let r = t.find((t) => t.id === e);
        if (!r || r.builtin) return;
        let i = !Ge.has(e);
        (Ke((t) => {
          let n = new Set(t);
          return (i ? n.add(e) : n.delete(e), n);
        }),
          i &&
            Je((t) => {
              let r = new Set(t);
              return (n.filter((t) => t.siteId === e).forEach((e) => r.delete(e.id)), r);
            }));
      }
      function dn(e) {
        let t = n.find((t) => t.id === e);
        t &&
          !Ge.has(t.siteId) &&
          Je((t) => {
            let n = new Set(t);
            return (n.has(e) ? n.delete(e) : n.add(e), n);
          });
      }
      function fn() {
        let e = new Set(t.filter((e) => !e.builtin).map((e) => e.id));
        (Ke(e), Je(new Set()));
      }
      async function pn() {
        if (Rt === 0) return;
        let e = [...Ge],
          t = [...qe];
        et(!0);
        try {
          (await k(e, t),
            Xe(!1),
            We(!1),
            cn(),
            J(
              Lt
                ? `已删除 ${e.length} 个站点、${It} 个账号；${Lt} 个站点账号已保留待恢复`
                : `已删除 ${e.length} 个站点、${It} 个账号`,
            ));
        } finally {
          et(!1);
        }
      }
      let mn =
        q.running > 0
          ? `running`
          : q.attention > 0
            ? `attention`
            : q.failed > 0
              ? `failed`
              : `idle`;
      return (0, scope.W.jsx)(scope.K, {
        reducedMotion: `user`,
        children: (0, scope.W.jsx)(scope.ou, {
          children: (0, scope.W.jsxs)(`div`, {
            className: (0, scope.R)(
              `min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50`,
              U && `min-h-full`,
            ),
            'data-phase': mn,
            children: [
              (0, scope.W.jsxs)(scope.le, {
                shellVisible: !U,
                view: pe,
                onViewChange: me,
                search: at,
                onSearchChange: ot,
                status: {
                  version: scope.lu,
                  running: q.running,
                  attention: q.attention,
                  total: q.total,
                  done: q.done,
                },
                children: [
                  (0, scope.W.jsx)(scope.O, {
                    children:
                      rt !== null && (0, scope.W.jsx)(scope.pu, { onDone: () => it(null) }, rt),
                  }),
                  he &&
                    pe === `accounts` &&
                    (0, scope.W.jsx)(`div`, {
                      className: `space-y-4`,
                      children: (0, scope.W.jsx)(scope.ue, {
                        sites: t,
                        accounts: n,
                        statusOf: L,
                        balanceOf: se,
                        refreshingBalanceIds: ce,
                        onRunAccount: (e) => {
                          Vt(e);
                        },
                        onRefreshBalance: (e) => {
                          de([e]).catch((e) => J(e instanceof Error ? e.message : String(e)));
                        },
                        onToast: J,
                      }),
                    }),
                  pe === `network` &&
                    (0, scope.W.jsx)(scope.re, {
                      proxies: r,
                      accounts: n,
                      sites: t,
                      compact: U,
                      onReturn: () => me(`overview`),
                      onAddMany: P,
                      onSyncClash: ee,
                      onRemove: ne,
                      onAssign: I,
                      onSetAccountProxy: async (e, t) => M(e, t),
                    }),
                  he &&
                    pe === `records` &&
                    (0, scope.W.jsx)(scope.oe, {
                      sites: t,
                      accounts: n,
                      resultOf: ae,
                      statusOf: L,
                    }),
                  he &&
                    pe === `settings` &&
                    (0, scope.W.jsxs)(`section`, {
                      className: `rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950`,
                      children: [
                        (0, scope.W.jsx)(`h1`, {
                          className: `text-base font-bold tracking-tight`,
                          children: `设置`,
                        }),
                        (0, scope.W.jsx)(`p`, {
                          className: `mt-1.5 text-[11px] text-ink-800/55 dark:text-ink-100/50`,
                          children: `扩展打开方式、站点与账号排序在总览页顶部工具栏。`,
                        }),
                      ],
                    }),
                  (0, scope.W.jsx)(`div`, {
                    className:
                      (he && pe !== `overview` && pe !== `sites`) || (U && pe === `network`)
                        ? `hidden`
                        : void 0,
                    children: (0, scope.W.jsxs)(`div`, {
                      className: (0, scope.R)(
                        `relative z-10 mx-auto px-4 pt-5 pb-7 sm:px-5 sm:pt-6`,
                        U ? `max-w-none px-3 pt-4 sm:px-3 sm:pt-4` : `w-full max-w-none`,
                        He && `pb-28`,
                      ),
                      children: [
                        (0, scope.W.jsxs)(scope.w.header, {
                          initial: { opacity: 0, y: -12 },
                          animate: { opacity: 1, y: 0 },
                          transition: { type: `spring`, stiffness: 320, damping: 28, delay: 0.04 },
                          className: (0, scope.R)(
                            `relative z-20 mb-5 flex flex-wrap items-center rounded-xl border border-slate-200 bg-white px-3.5 py-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-950`,
                            (q.running > 0 || q.attention > 0) &&
                              `border-blue-200 dark:border-blue-900`,
                            U ? `gap-3` : `gap-4 sm:px-4 sm:py-4`,
                          ),
                          children: [
                            (0, scope.W.jsx)(`div`, {
                              className: `grid size-10 shrink-0 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm shadow-blue-600/20`,
                              'aria-hidden': `true`,
                              children: `签`,
                            }),
                            (0, scope.W.jsxs)(`div`, {
                              className: `min-w-0 flex-1 sm:min-w-[260px]`,
                              children: [
                                (0, scope.W.jsxs)(`h1`, {
                                  className: (0, scope.R)(
                                    `flex min-w-0 items-center gap-2 font-bold tracking-tight`,
                                    U ? `flex-wrap text-base` : `text-lg`,
                                  ),
                                  children: [
                                    (0, scope.W.jsx)(`span`, {
                                      className: (0, scope.R)(
                                        U ? `basis-full whitespace-nowrap` : `truncate`,
                                      ),
                                      children: `签到管理台`,
                                    }),
                                    (0, scope.W.jsxs)(`span`, {
                                      title: `当前扩展构建版本`,
                                      className: `shrink-0 rounded-md bg-slate-900 px-1.5 py-0.5 text-[9px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900`,
                                      children: [`v`, scope.lu],
                                    }),
                                    (q.running > 0 || q.attention > 0) &&
                                      (0, scope.W.jsxs)(scope.w.span, {
                                        initial: { opacity: 0, scale: 0.8 },
                                        animate: { opacity: 1, scale: 1 },
                                        className: `inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300`,
                                        children: [
                                          (0, scope.W.jsx)(scope.C, {
                                            className: `size-2.5 animate-pulse`,
                                          }),
                                          ` LIVE`,
                                        ],
                                      }),
                                  ],
                                }),
                                (0, scope.W.jsxs)(`p`, {
                                  className: `text-xs text-ink-800/50 dark:text-ink-100/40`,
                                  children: [
                                    `今日 `,
                                    q.done,
                                    `/`,
                                    q.total,
                                    ` 已完成`,
                                    q.pending > 0 &&
                                      (0, scope.W.jsxs)(`span`, {
                                        className: `ml-1 text-amber-600 dark:text-amber-400`,
                                        children: [`· `, q.pending, ` 个待签到`],
                                      }),
                                    q.running > 0 &&
                                      (0, scope.W.jsxs)(`span`, {
                                        className: `ml-1 text-brand-600 dark:text-brand-400`,
                                        children: [`· `, q.running, ` 个进行中`],
                                      }),
                                    q.attention > 0 &&
                                      (0, scope.W.jsxs)(`span`, {
                                        className: `ml-1 text-cyan-700 dark:text-cyan-300`,
                                        children: [`· `, q.attention, ` 个需处理`],
                                      }),
                                    q.failed > 0 &&
                                      (0, scope.W.jsxs)(`span`, {
                                        className: `ml-1 text-rose-600 dark:text-rose-400`,
                                        children: [`· `, q.failed, ` 个失败`],
                                      }),
                                  ],
                                }),
                              ],
                            }),
                            (0, scope.W.jsxs)(`div`, {
                              className: (0, scope.R)(
                                `flex w-full flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-900/60`,
                                U ? `justify-start` : `justify-end lg:w-auto`,
                              ),
                              children: [
                                (0, scope.W.jsxs)(`label`, {
                                  className: (0, scope.R)(
                                    `relative min-w-[160px] flex-1`,
                                    !U && `lg:w-56 lg:flex-none`,
                                  ),
                                  children: [
                                    (0, scope.W.jsx)(scope.l, {
                                      className: `pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-800/35 dark:text-ink-100/35`,
                                    }),
                                    (0, scope.W.jsx)(`input`, {
                                      value: at,
                                      onChange: (e) => ot(e.target.value),
                                      placeholder: `搜索站点、账号或备注`,
                                      'aria-label': `搜索站点、账号或备注`,
                                      className: `h-8 w-full rounded-md border border-black/8 bg-white py-1 pl-8 pr-7 text-[11px] text-ink-900 outline-none placeholder:text-ink-800/35 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50 dark:placeholder:text-ink-100/30`,
                                    }),
                                    at &&
                                      (0, scope.W.jsx)(`button`, {
                                        type: `button`,
                                        onClick: () => ot(``),
                                        'aria-label': `清空搜索`,
                                        className: `absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-800/40 hover:bg-black/5 hover:text-ink-800 dark:text-ink-100/40 dark:hover:bg-white/10 dark:hover:text-ink-100`,
                                        children: (0, scope.W.jsx)(scope.h, {
                                          className: `size-3`,
                                        }),
                                      }),
                                  ],
                                }),
                                (0, scope.W.jsx)(scope.Vl, {
                                  value: lt,
                                  onChange: (e) => {
                                    ut(e).catch(() => J(`站点排序已切换，但偏好保存失败，请重试`));
                                  },
                                  accountSortMode: st,
                                  onAccountSortChange: (e) => {
                                    ct(e).catch(() => J(`账号排序已切换，但偏好保存失败，请重试`));
                                  },
                                }),
                                (0, scope.W.jsx)(scope.Zl, {
                                  mode: c,
                                  compact: U,
                                  surface: e,
                                  disabled: mt,
                                  onChange: sn,
                                }),
                                q.actionable > 0 &&
                                  (0, scope.W.jsx)(scope.Jl, {
                                    icon: (0, scope.W.jsx)(scope.y, { className: `size-4` }),
                                    label: `全部签到 (${q.actionable})`,
                                    accent: !0,
                                    compact: U,
                                    onClick: () => Zt($t()),
                                  }),
                                (0, scope.W.jsx)(scope.Jl, {
                                  icon: (0, scope.W.jsx)(scope.x, { className: `size-4` }),
                                  label: _e ? `代理 (${_e})` : `代理`,
                                  compact: U,
                                  onClick: () => me(`network`),
                                }),
                                (0, scope.W.jsx)(scope.Jl, {
                                  icon: (0, scope.W.jsx)(scope.De, { className: `size-4` }),
                                  label: `备份迁移`,
                                  compact: U,
                                  onClick: () => Pe(!0),
                                }),
                                (0, scope.W.jsx)(scope.Jl, {
                                  icon: (0, scope.W.jsx)(scope.ge, { className: `size-4` }),
                                  label: d.enabled ? `定时 ${d.time}` : `定时签到`,
                                  primary: d.enabled,
                                  compact: U,
                                  onClick: () => Ve(!0),
                                }),
                                (0, scope.W.jsx)(scope.Jl, {
                                  icon: (0, scope.W.jsx)(scope.yt, { className: `size-4` }),
                                  label: `添加站点`,
                                  compact: U,
                                  onClick: () => nn(),
                                }),
                                (0, scope.W.jsx)(scope.Jl, {
                                  icon: (0, scope.W.jsx)(scope.Ue, { className: `size-4` }),
                                  label: `从书签导入`,
                                  compact: U,
                                  onClick: rn,
                                }),
                                (0, scope.W.jsx)(scope.Jl, {
                                  icon: (0, scope.W.jsx)(scope.Dt, { className: `size-4` }),
                                  label: `添加账号`,
                                  primary: !0,
                                  compact: U,
                                  onClick: () => an(),
                                }),
                                (0, scope.W.jsx)(scope.Jl, {
                                  icon: (0, scope.W.jsx)(scope.Fe, { className: `size-4` }),
                                  label: `导入账号`,
                                  compact: U,
                                  onClick: () => {
                                    t.length === 0 ? J(`请先添加或导入站点，再导入账号`) : Me(!0);
                                  },
                                }),
                                t.length > 0 &&
                                  (0, scope.W.jsx)(scope.Jl, {
                                    icon: He
                                      ? (0, scope.W.jsx)(scope.h, { className: `size-4` })
                                      : (0, scope.W.jsx)(scope.v, { className: `size-4` }),
                                    label: He ? `退出批量` : `批量删除`,
                                    danger: He,
                                    compact: U,
                                    onClick: ln,
                                  }),
                              ],
                            }),
                          ],
                        }),
                        (0, scope.W.jsx)(scope.O, {
                          initial: !1,
                          children: (0, scope.W.jsx)(scope.ru, {
                            accounts: n,
                            sites: t,
                            live: a,
                            queue: o,
                            compact: U,
                            statusOf: L,
                            onStopAll: () => {
                              Ht(Qt());
                            },
                          }),
                        }),
                        (0, scope.W.jsx)(scope.w.div, {
                          initial: { opacity: 0, y: 10 },
                          animate: { opacity: 1, y: 0 },
                          transition: { type: `spring`, stiffness: 300, damping: 30, delay: 0.1 },
                          children: (0, scope.W.jsx)(scope.$l, {
                            stats: q,
                            balanceTotal: Pt,
                            onRunAll: () => Zt(zt),
                            actionableCount: zt.length,
                            searchScoped: at.trim().length > 0,
                            compact: U,
                          }),
                        }),
                        s
                          ? (0, scope.W.jsx)(`div`, {
                              className: `py-20 text-center text-sm text-ink-800/40 dark:text-ink-100/30`,
                              children: `加载中...`,
                            })
                          : (0, scope.W.jsxs)(scope.W.Fragment, {
                              children: [
                                Nt.length > 0 &&
                                  (0, scope.W.jsx)(scope.au, {
                                    accounts: Nt,
                                    sites: t,
                                    compact: U,
                                    onRecover: en,
                                    onAddSite: () => nn(),
                                  }),
                                t.length === 0
                                  ? (0, scope.W.jsx)(scope.Yl, { onAdd: () => nn(), onImport: rn })
                                  : (0, scope.W.jsx)(scope.w.div, {
                                      layout: !0,
                                      initial: `hidden`,
                                      animate: `show`,
                                      variants: {
                                        hidden: {},
                                        show: {
                                          transition: {
                                            staggerChildren: 0.055,
                                            delayChildren: 0.14,
                                          },
                                        },
                                      },
                                      className: `grid gap-4 lg:grid-cols-2`,
                                      children: (0, scope.W.jsx)(scope.O, {
                                        mode: `popLayout`,
                                        children: Mt.map(({ site: e, accounts: i }) =>
                                          (0, scope.W.jsx)(
                                            scope.ro,
                                            {
                                              site: e,
                                              sharedFlowFrom: (0, scope.Ho)(e, t).sharedFrom,
                                              accounts: i,
                                              proxy: r.find((t) => t.id === e.proxyId),
                                              proxies: r,
                                              proxyUsage: jt,
                                              statusOf: L,
                                              resultOf: ae,
                                              liveOf: z,
                                              balanceOf: se,
                                              refreshingBalanceIds: ce,
                                              onRefreshBalances: (e) => {
                                                de(e).catch((e) =>
                                                  J(e instanceof Error ? e.message : String(e)),
                                                );
                                              },
                                              isQueued: B,
                                              onRun: Vt,
                                              onRunAll: (e) => Zt($t(e)),
                                              onStopAll: (e) => {
                                                Ht(Qt(e));
                                              },
                                              onResetAccount: Ut,
                                              onStopAccount: (e) => {
                                                Ht([e]);
                                              },
                                              onRetryAccount: (e) => {
                                                Ht([e], !0);
                                              },
                                              onMarkAccountDone: Wt,
                                              onCaptureSession: Gt,
                                              onLearnAccount: Kt,
                                              learningAccounts: gt,
                                              learningNotices: vt,
                                              learnedSteps: xt,
                                              onCancelLearnAccount: (e) => {
                                                Xt(e);
                                              },
                                              onEditAccount: (e) => {
                                                (ze(e), Ae(!0));
                                              },
                                              onSetAccountProxy: async (e, t) => {
                                                try {
                                                  (await M(e, t),
                                                    J(
                                                      t.proxyMode === `pool`
                                                        ? t.proxyPinned === !1
                                                          ? `已取消手动固定，后续可由自动分配调整`
                                                          : `已固定该账号的代理节点`
                                                        : t.proxyMode === `none`
                                                          ? `该账号已设为直连`
                                                          : `该账号已改为跟随站点代理`,
                                                    ));
                                                } catch (e) {
                                                  J(e instanceof Error ? e.message : String(e));
                                                }
                                              },
                                              onRemoveAccount: (e) => {
                                                let t = n.find((t) => t.id === e);
                                                t &&
                                                  Qe({
                                                    kind: `account`,
                                                    id: t.id,
                                                    name: t.label || t.username,
                                                  });
                                              },
                                              onAddAccount: an,
                                              onEditSite: (e) => {
                                                (Oe(e), xe(`add`), Ce(!1), ye(!0));
                                              },
                                              onRemoveSite: (e) => {
                                                let r = t.find((t) => t.id === e);
                                                r &&
                                                  Qe({
                                                    kind: `site`,
                                                    id: r.id,
                                                    name: r.name,
                                                    accountCount: n.filter((e) => e.siteId === r.id)
                                                      .length,
                                                  });
                                              },
                                              canMoveUp: (Ot.get(e.id) ?? 0) > 0,
                                              canMoveDown: (Ot.get(e.id) ?? 0) < Et.length - 1,
                                              onMove: (e, t) => {
                                                let n = new Set(Mt.map((e) => e.site.id)),
                                                  r = (0, scope.Rl)(
                                                    Et.map((e) => e.site.id),
                                                    e,
                                                    t,
                                                    n,
                                                  );
                                                E(e, t, r)
                                                  .then(() => {
                                                    lt !== `manual` &&
                                                      ut(`manual`).catch(() =>
                                                        J(`顺序已调整，但偏好保存失败`),
                                                      );
                                                  })
                                                  .catch(() => J(`站点顺序调整失败，请重试`));
                                              },
                                              searchActive: at.trim().length > 0,
                                              selectionMode: He,
                                              siteSelected: Ge.has(e.id),
                                              selectedAccountIds: qe,
                                              onToggleSite: un,
                                              onToggleAccount: dn,
                                            },
                                            e.id,
                                          ),
                                        ),
                                      }),
                                    }),
                              ],
                            }),
                      ],
                    }),
                  }),
                ],
              }),
              (0, scope.W.jsx)(scope.Vo, {
                open: ve,
                mode: be,
                editing: Ee,
                accountSetupRequested: Se,
                sites: t,
                proxies: r,
                onClose: () => {
                  (ye(!1), Ce(!1));
                },
                onSubmitMany: async (e, t) => {
                  let n = scope.Ui.getState().sites,
                    r = (0, scope.Do)(e, n, t),
                    i = new Set(scope.Ui.getState().sites.map((e) => e.id)),
                    a = 0;
                  for (let e of r.updates)
                    try {
                      (await T(e.siteId, e.patch), (a += 1));
                    } catch {}
                  r.additions.length > 0 && (await S(r.additions));
                  let o = scope.Ui.getState().sites.filter((e) => !i.has(e.id)).length,
                    s = Math.max(0, e.length - o - a);
                  return (
                    J(`书签导入完成：新增 ${o} 个，更新 ${a} 个，跳过 ${s} 个`),
                    { added: o, updated: a, skipped: s }
                  );
                },
                onSubmit: async (e) => {
                  Ee ? (await T(Ee.id, e), J(`站点设置已保存`)) : (await b(e), J(`站点已添加`));
                },
                onSubmitAndAddAccount: on,
              }),
              (0, scope.W.jsx)(scope.ms, {
                open: ke,
                sites: t,
                accounts: n,
                proxies: r,
                defaultSiteId: Ie,
                editing: Re,
                onClose: () => {
                  (Ae(!1), ze(null));
                },
                onSubmit: async (e) => {
                  Re ? (await M(Re.id, e), J(`账号设置已保存`)) : (await A(e), J(`账号已添加`));
                },
                onSubmitMany: j,
              }),
              (0, scope.W.jsx)(scope.bs, {
                open: je,
                sites: t,
                accounts: n,
                onClose: () => Me(!1),
                onImport: async (e) => {
                  let t = await j(e);
                  J(
                    t.skipped > 0
                      ? `已导入 ${t.added} 个账号，跳过 ${t.skipped} 个重复项`
                      : `已导入 ${t.added} 个匹配账号`,
                  );
                },
              }),
              (0, scope.W.jsx)(scope.Ks, {
                open: Ne,
                sites: t,
                accounts: n,
                proxies: r,
                onClose: () => Pe(!1),
                onImport: async (e) => {
                  let t = new Set(scope.Ui.getState().proxies.map((e) => e.id));
                  e.newProxies.length > 0 && (await P(e.newProxies));
                  let n = new Set(scope.Ui.getState().sites.map((e) => e.id));
                  e.newSites.length > 0 && (await S(e.newSites, !0));
                  let r = scope.Ui.getState().sites,
                    i = scope.Ui.getState().accounts,
                    a = scope.Ui.getState().proxies;
                  for (let t of (0, scope.Us)(e.siteProxyNames, r, a))
                    await T(t.siteId, { proxyId: t.proxyId });
                  let {
                      resolved: o,
                      unresolved: s,
                      duplicateCount: c,
                      droppedProxyBindings: l,
                    } = (0, scope.Ws)(e.accounts, r, i, a),
                    u = o.length > 0 ? await j(o, !0) : { added: 0, skipped: 0 },
                    d = r.filter((e) => !n.has(e.id)).length,
                    f = a.filter((e) => !t.has(e.id)).length;
                  s > 0 && J(`有 ${s} 个账号所属的站点没能建立，请检查备份文件`);
                  let p = l + e.unresolvedProxyBindings;
                  return (
                    p > 0 && J(`${p} 个账号的代理绑定找不到对应节点，已改为跟随站点`),
                    {
                      sites: d,
                      accounts: u.added,
                      proxies: f,
                      skipped: u.skipped + c + e.duplicateCount,
                    }
                  );
                },
              }),
              (0, scope.W.jsx)(scope.Zs, {
                open: Be,
                schedule: d,
                sites: t,
                accounts: n,
                onClose: () => Ve(!1),
                onSave: async (e) => {
                  (await ie(e), J(e.enabled ? `定时签到已开启：${e.time}` : `定时签到已关闭`));
                },
              }),
              (0, scope.W.jsx)(scope.uo, {
                open: Ye,
                title: `确认批量删除`,
                onClose: () => !$e && Xe(!1),
                children: (0, scope.W.jsxs)(`div`, {
                  className: `space-y-4`,
                  children: [
                    (0, scope.W.jsxs)(`div`, {
                      className: `flex items-start gap-3`,
                      children: [
                        (0, scope.W.jsx)(`span`, {
                          className: `flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/12 text-rose-600 dark:text-rose-400`,
                          children: (0, scope.W.jsx)(scope.g, { className: `size-5` }),
                        }),
                        (0, scope.W.jsxs)(`div`, {
                          children: [
                            (0, scope.W.jsx)(`p`, {
                              className: `text-sm font-semibold text-ink-900 dark:text-white`,
                              children: `确认删除所选项目`,
                            }),
                            (0, scope.W.jsxs)(`p`, {
                              className: `mt-1 text-xs leading-5 text-ink-800/55 dark:text-ink-100/45`,
                              children: [
                                `将删除 `,
                                Ft,
                                ` 个站点和 `,
                                It,
                                ` 个明确选中的账号。`,
                                Lt > 0
                                  ? ` 所选站点下的 ${Lt} 个账号会保留到「待恢复账号」，不会丢失凭据。`
                                  : ` 被删除账号的签到状态与执行记录也会一并清理。`,
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `flex justify-end gap-2`,
                      children: [
                        (0, scope.W.jsx)(`button`, {
                          type: `button`,
                          disabled: $e,
                          onClick: () => Xe(!1),
                          className: `h-9 rounded-lg px-3 text-xs font-medium text-ink-800 ring-1 ring-black/10 hover:bg-black/5 disabled:opacity-50 dark:text-ink-100 dark:ring-white/10 dark:hover:bg-white/10`,
                          children: `取消`,
                        }),
                        (0, scope.W.jsxs)(`button`, {
                          type: `button`,
                          disabled: $e,
                          onClick: () => void pn(),
                          className: `inline-flex h-9 items-center gap-1.5 rounded-lg bg-rose-500 px-3 text-xs font-semibold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 disabled:opacity-50`,
                          children: [
                            $e
                              ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` })
                              : (0, scope.W.jsx)(scope.v, { className: `size-4` }),
                            $e ? `正在删除` : `确认删除`,
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              (0, scope.W.jsx)(scope.uo, {
                open: !!Ze,
                title: Ze?.kind === `site` ? `确认删除站点` : `确认删除账号`,
                onClose: () => !$e && Qe(null),
                children: (0, scope.W.jsxs)(`div`, {
                  className: `space-y-4`,
                  children: [
                    (0, scope.W.jsxs)(`div`, {
                      className: `flex items-start gap-3`,
                      children: [
                        (0, scope.W.jsx)(`span`, {
                          className: `flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/12 text-rose-600 dark:text-rose-400`,
                          children: (0, scope.W.jsx)(scope.g, { className: `size-5` }),
                        }),
                        (0, scope.W.jsxs)(`div`, {
                          children: [
                            (0, scope.W.jsx)(`p`, {
                              className: `text-sm font-semibold text-ink-900 dark:text-white`,
                              children:
                                Ze?.kind === `site`
                                  ? `删除站点「${Ze.name}」？`
                                  : `永久删除账号「${Ze?.name ?? ``}」？`,
                            }),
                            (0, scope.W.jsx)(`p`, {
                              className: `mt-1 text-xs leading-5 text-ink-800/55 dark:text-ink-100/45`,
                              children:
                                Ze?.kind === `site`
                                  ? Ze.accountCount > 0
                                    ? `站点配置会删除，${Ze.accountCount} 个账号及其凭据会保留到「待恢复账号」。`
                                    : `该站点没有账号，删除后只移除站点配置。`
                                  : `账号凭据、签到状态、执行记录和余额都会删除，当前没有历史回收站。`,
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, scope.W.jsxs)(`div`, {
                      className: `flex justify-end gap-2`,
                      children: [
                        (0, scope.W.jsx)(`button`, {
                          type: `button`,
                          disabled: $e,
                          onClick: () => Qe(null),
                          className: `h-9 rounded-lg px-3 text-xs font-medium text-ink-800 ring-1 ring-black/10 hover:bg-black/5 disabled:opacity-50 dark:text-ink-100 dark:ring-white/10 dark:hover:bg-white/10`,
                          children: `取消`,
                        }),
                        (0, scope.W.jsxs)(`button`, {
                          type: `button`,
                          disabled: $e,
                          onClick: () => void tn(),
                          className: `inline-flex h-9 items-center gap-1.5 rounded-lg bg-rose-500 px-3 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-50`,
                          children: [
                            $e
                              ? (0, scope.W.jsx)(scope.u, { className: `size-4 animate-spin` })
                              : (0, scope.W.jsx)(scope.v, { className: `size-4` }),
                            $e ? `正在删除` : `确认删除`,
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              (0, scope.W.jsx)(scope.O, {
                children:
                  He &&
                  (0, scope.W.jsx)(scope.Ql, {
                    siteCount: Ft,
                    accountCount: It,
                    onSelectAll: fn,
                    onClear: cn,
                    onDelete: () => Xe(!0),
                  }),
              }),
              (0, scope.W.jsx)(scope.O, {
                children:
                  tt &&
                  !Bt &&
                  (0, scope.W.jsx)(scope.w.div, {
                    initial: { opacity: 0, y: 20, scale: 0.95 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: 10, scale: 0.96 },
                    className: (0, scope.R)(
                      `fixed left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-ink-900 px-4 py-2.5 text-xs font-medium text-white shadow-2xl dark:bg-white dark:text-ink-900`,
                      He ? `bottom-24` : `bottom-5`,
                    ),
                    children: tt,
                  }),
              }),
            ],
          }),
        }),
      });
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.Li = {
          async load() {
            return (0, scope.X)(async () => {
              let [e, t, n, r, i, a, o, s, c, l] = await Promise.all([
                  scope.z.get(scope.M.sites, []),
                  scope.z.get(scope.M.accounts, []),
                  scope.z.get(scope.M.proxies, []),
                  scope.z.get(scope.M.status, {}),
                  scope.z.get(scope.M.results, {}),
                  scope.z.get(scope.M.balances, {}),
                  scope.z.get(scope.M.launchMode, scope.Cn),
                  scope.z.get(scope.M.schedule, scope.fr),
                  scope.z.get(scope.M.removedBuiltinSiteIds, []),
                  scope.z.get(scope.M.headlessStats, {}),
                ]),
                { userSites: u, accounts: d } = await (0, scope.ji)(e, t),
                f = await (0, scope.Mi)(u, d),
                p = (0, scope.Ei)(f.userSites),
                m = (0, scope.Ir)(f.accounts),
                h = (0, scope.Lr)(m),
                g = h.size ? m.map((e) => (h.has(e.id) ? (0, scope.Rr)(e) : e)) : m,
                _ = [...h].map((e) => `${e}:`),
                v = h.size
                  ? Object.fromEntries(
                      Object.entries(r).filter(([e]) => !_.some((t) => e.startsWith(t))),
                    )
                  : r,
                y = h.size ? Object.fromEntries(Object.entries(i).filter(([e]) => !h.has(e))) : i,
                b = h.size ? Object.fromEntries(Object.entries(a).filter(([e]) => !h.has(e))) : a,
                x = (0, scope.vr)(
                  l,
                  [...scope.pn, ...p].map((e) => e.id),
                ),
                S = (0, scope.Ai)(c, g),
                C = {};
              return (
                (0, scope.ki)(f.userSites, p) && (C[scope.M.sites] = p),
                (0, scope.ki)(f.accounts, g) && (C[scope.M.accounts] = g),
                h.size &&
                  ((C[scope.M.status] = v), (C[scope.M.results] = y), (C[scope.M.balances] = b)),
                (0, scope.ki)(c, S) && (C[scope.M.removedBuiltinSiteIds] = S),
                x !== l && (C[scope.M.headlessStats] = x),
                Object.keys(C).length && (await scope.z.setMany(C)),
                {
                  userSites: p,
                  accounts: g,
                  proxies: n,
                  status: v,
                  results: y,
                  balances: b,
                  launchMode: o,
                  schedule: (0, scope.hr)(s),
                  removedBuiltinSiteIds: S,
                }
              );
            });
          },
          ...modules.sites.storeProperties.store_Li_moveSite(scope),
          ...modules.sites.storeProperties.store_Li_addSite(scope),
          ...modules.sites.storeProperties.store_Li_addSites(scope),
          ...modules.sites.storeProperties.store_Li_updateSite(scope),
          deleteEntities(e, t) {
            return (0, scope.X)(async () => {
              let n = new Set(e),
                r = new Set(t),
                [i, a, o, s, c, l, u, d] = await Promise.all([
                  scope.z.get(scope.M.sites, []),
                  scope.z.get(scope.M.accounts, []),
                  scope.z.get(scope.M.status, {}),
                  scope.z.get(scope.M.results, {}),
                  scope.z.get(scope.M.balances, {}),
                  scope.z.get(scope.M.schedule, scope.fr),
                  scope.z.get(scope.M.removedBuiltinSiteIds, []),
                  scope.z.get(scope.M.headlessStats, {}),
                ]),
                f = new Set(a.filter((e) => r.has(e.id)).map((e) => e.id)),
                p = [...f].map((e) => `${e}:`),
                m = (0, scope.gr)(
                  (0, scope.hr)(l),
                  a.filter((e) => !f.has(e.id)).map((e) => e.id),
                ),
                h = new Set(scope.pn.map((e) => e.id)),
                g = e.filter((e) => h.has(e)),
                _ = [...new Set([...u, ...g])];
              await scope.z.setMany({
                [scope.M.sites]: i.filter((e) => !n.has(e.id)),
                [scope.M.accounts]: a.filter((e) => !f.has(e.id)),
                [scope.M.status]: Object.fromEntries(
                  Object.entries(o).filter(([e]) => !p.some((t) => e.startsWith(t))),
                ),
                [scope.M.results]: Object.fromEntries(Object.entries(s).filter(([e]) => !f.has(e))),
                [scope.M.balances]: Object.fromEntries(
                  Object.entries(c).filter(([e]) => !f.has(e)),
                ),
                [scope.M.schedule]: m,
                [scope.M.removedBuiltinSiteIds]: _,
                [scope.M.headlessStats]: Object.fromEntries(
                  Object.entries(d).filter(([e]) => !n.has(e)),
                ),
              });
            });
          },
          ...modules.records.storeProperties.store_Li_saveBalance(scope),
          ...modules.records.storeProperties.store_Li_saveCheckinReward(scope),
          ...modules.records.storeProperties.store_Li_clearBalance(scope),
          ...modules.records.storeProperties.store_Li_saveBalanceError(scope),
          ...modules.accounts.storeProperties.store_Li_addAccount(scope),
          ...modules.accounts.storeProperties.store_Li_addAccounts(scope),
          ...modules.accounts.storeProperties.store_Li_updateAccount(scope),
          ...modules.accounts.storeProperties.store_Li_saveAccountSession(scope),
          ...modules.accounts.storeProperties.store_Li_saveAccountIdentity(scope),
          ...modules.proxies.storeProperties.store_Li_addProxy(scope),
          ...modules.proxies.storeProperties.store_Li_addProxies(scope),
          ...modules.proxies.storeProperties.store_Li_syncClashProxies(scope),
          ...modules.proxies.storeProperties.store_Li_updateProxy(scope),
          ...modules.proxies.storeProperties.store_Li_removeProxy(scope),
          ...modules.proxies.storeProperties.store_Li_assignAccountProxies(scope),
          ...modules.checkin.storeProperties.store_Li_updateSchedule(scope),
          ...modules.checkin.storeProperties.store_Li_setStatus(scope),
          ...modules.checkin.storeProperties.store_Li_clearInFlightStatus(scope),
          ...modules.checkin.storeProperties.store_Li_getStatus(scope),
          ...modules.checkin.storeProperties.store_Li_markDone(scope),
          ...modules.checkin.storeProperties.store_Li_setStatusUnlessTerminal(scope),
          ...modules.checkin.storeProperties.store_Li_setStatusIfExpected(scope),
          ...modules.checkin.storeProperties.store_Li_setStatusAndResult(scope),
          ...modules.checkin.storeProperties.store_Li_setOutcome(scope),
        };
        break;
      }
      case 1: {
        scope.zi = 0;
        break;
      }
      case 2: {
        scope.Ui = (0, scope.Nt)((e, t) => ({
          sites: [],
          accounts: [],
          proxies: [],
          status: {},
          results: {},
          balances: {},
          refreshingBalances: new Set(),
          live: [],
          queue: { pending: [] },
          loading: !0,
          launchMode: scope.Cn,
          schedule: scope.fr,
          async load() {
            let t = ++scope.zi,
              n = scope.Ri,
              [
                {
                  userSites: r,
                  accounts: i,
                  proxies: a,
                  status: o,
                  results: s,
                  balances: c,
                  launchMode: l,
                  schedule: u,
                  removedBuiltinSiteIds: d,
                },
                f,
              ] = await Promise.all([scope.Li.load(), (0, scope.Hi)()]);
            if (t !== scope.zi) return;
            let p = new Set(d),
              m = new Set(scope.pn.map((e) => e.id)),
              h = r.filter((e) => !m.has(e.id)),
              g = new Set(i.map((e) => e.siteId)),
              _ = new Set(h.map((e) => (0, scope.Bi)(e.loginUrl)).filter(Boolean)),
              v = scope.pn.filter((e) =>
                p.has(e.id) ? !1 : g.has(e.id) ? !0 : !_.has((0, scope.Bi)(e.loginUrl)),
              ),
              y = new Set(v.map((e) => e.id)),
              b = new Map(r.filter((e) => y.has(e.id)).map((e) => [e.id, e])),
              x = v.map((e) => (0, scope.xn)(e, b.get(e.id)));
            e({
              sites: [...h, ...x].sort(
                (e, t) =>
                  (e.sortOrder ?? 2 ** 53 - 1) - (t.sortOrder ?? 2 ** 53 - 1) ||
                  e.name.localeCompare(t.name),
              ),
              accounts: i,
              proxies: a,
              status: o,
              results: s,
              balances: c,
              live: f.live,
              queue: f.queue,
              ...(n === scope.Ri ? { launchMode: l } : {}),
              schedule: u,
              loading: !1,
            });
          },
          ...modules.settings.storeProperties.store_Ui_setLaunchMode(scope, e, t),
          ...modules.settings.storeProperties.store_Ui_syncLaunchMode(scope, e, t),
          ...modules.checkin.storeProperties.store_Ui_setSchedule(scope, e, t),
          ...modules.sites.storeProperties.store_Ui_addSite(scope, e, t),
          ...modules.sites.storeProperties.store_Ui_addSites(scope, e, t),
          ...modules.sites.storeProperties.store_Ui_updateSite(scope, e, t),
          ...modules.sites.storeProperties.store_Ui_moveSite(scope, e, t),
          ...modules.sites.storeProperties.store_Ui_removeSite(scope, e, t),
          async removeMany(e, n) {
            (e.length !== 0 || n.length !== 0) &&
              (await (0, scope.Vi)({ action: `delete-entities`, siteIds: e, accountIds: n }),
              await t().load());
          },
          ...modules.accounts.storeProperties.store_Ui_addAccount(scope, e, t),
          ...modules.accounts.storeProperties.store_Ui_addAccounts(scope, e, t),
          ...modules.accounts.storeProperties.store_Ui_updateAccount(scope, e, t),
          ...modules.accounts.storeProperties.store_Ui_removeAccount(scope, e, t),
          ...modules.proxies.storeProperties.store_Ui_addProxy(scope, e, t),
          ...modules.proxies.storeProperties.store_Ui_addProxies(scope, e, t),
          ...modules.proxies.storeProperties.store_Ui_syncClashProxies(scope, e, t),
          ...modules.proxies.storeProperties.store_Ui_updateProxy(scope, e, t),
          ...modules.proxies.storeProperties.store_Ui_removeProxy(scope, e, t),
          ...modules.proxies.storeProperties.store_Ui_assignAccountProxies(scope, e, t),
          ...modules.checkin.storeProperties.store_Ui_statusOf(scope, e, t),
          ...modules.records.storeProperties.store_Ui_resultOf(scope, e, t),
          ...modules.records.storeProperties.store_Ui_balanceOf(scope, e, t),
          ...modules.records.storeProperties.store_Ui_refreshBalances(scope, e, t),
          ...modules.checkin.storeProperties.store_Ui_liveOf(scope, e, t),
          ...modules.checkin.storeProperties.store_Ui_isQueued(scope, e, t),
          ...modules.checkin.storeProperties.store_Ui_setStatus(scope, e, t),
          ...modules.checkin.storeProperties.store_Ui_markDone(scope, e, t),
        }));
        break;
      }
    }
  },
  storeProperties: {},
});

import {
  A as e,
  C as t,
  D as n,
  E as r,
  O as i,
  S as a,
  T as o,
  _ as s,
  b as c,
  d as l,
  h as u,
  i as d,
  j as f,
  l as p,
  m,
  n as h,
  o as g,
  p as _,
  s as v,
  t as y,
  w as b,
  y as x,
} from '../vendor/react-dom-and-shared-icons.js';
import {
  A as S,
  C,
  D as w,
  E as T,
  M as E,
  N as D,
  O,
  P as k,
  S as A,
  T as j,
  _ as M,
  b as N,
  c as P,
  d as ee,
  f as te,
  g as F,
  h as ne,
  i as re,
  j as I,
  k as ie,
  l as L,
  m as ae,
  n as oe,
  o as se,
  p as ce,
  r as le,
  s as R,
  t as ue,
  u as de,
  v as z,
  w as B,
  x as V,
  y as H,
} from '../shared/ui-components.js';
import {
  a as fe,
  c as U,
  d as pe,
  f as me,
  i as he,
  l as ge,
  m as _e,
  n as ve,
  o as ye,
  p as be,
  r as xe,
  s as Se,
  t as Ce,
  u as we,
} from '../vendor/action-icons.js';
import { appRuntime as sharedRuntime } from '../shared/ui-runtime.js';
import { appRuntime as motionRuntime } from '../vendor/ui-motion-runtime.js';
import { appRuntime as sitesRuntime } from '../modules/sites/view.js';
import { appRuntime as settingsRuntime } from '../modules/settings/view.js';
import { appRuntime as learningRuntime } from '../modules/learning/view.js';
import { appRuntime as checkinRuntime } from '../modules/checkin/view.js';
import { appRuntime as proxiesRuntime } from '../modules/proxies/view.js';
import { appRuntime as recordsRuntime } from '../modules/records/view.js';
import { appRuntime as accountsRuntime } from '../modules/accounts/view.js';
import { appRuntime as searchRuntime } from '../vendor/ui-search-runtime.js';
export let ManagementApp;
export { ManagementApp as t };
const appModules = {
  'shared': sharedRuntime,
  'motion': motionRuntime,
  'sites': sitesRuntime,
  'settings': settingsRuntime,
  'learning': learningRuntime,
  'checkin': checkinRuntime,
  'proxies': proxiesRuntime,
  'records': recordsRuntime,
  'accounts': accountsRuntime,
  'entry': appRuntime,
  'search': searchRuntime,
};
const appScope = createUiScope(
  appModules,
  {
    get e() {
      return e;
    },
    get t() {
      return t;
    },
    get n() {
      return n;
    },
    get r() {
      return r;
    },
    get i() {
      return i;
    },
    get a() {
      return a;
    },
    get o() {
      return o;
    },
    get s() {
      return s;
    },
    get c() {
      return c;
    },
    get l() {
      return l;
    },
    get u() {
      return u;
    },
    get d() {
      return d;
    },
    get f() {
      return f;
    },
    get p() {
      return p;
    },
    get m() {
      return m;
    },
    get h() {
      return h;
    },
    get g() {
      return g;
    },
    get _() {
      return _;
    },
    get v() {
      return v;
    },
    get y() {
      return y;
    },
    get b() {
      return b;
    },
    get x() {
      return x;
    },
    get S() {
      return S;
    },
    get C() {
      return C;
    },
    get w() {
      return w;
    },
    get T() {
      return T;
    },
    get E() {
      return E;
    },
    get D() {
      return D;
    },
    get O() {
      return O;
    },
    get k() {
      return k;
    },
    get A() {
      return A;
    },
    get j() {
      return j;
    },
    get M() {
      return M;
    },
    get N() {
      return N;
    },
    get P() {
      return P;
    },
    get ee() {
      return ee;
    },
    get te() {
      return te;
    },
    get F() {
      return F;
    },
    get ne() {
      return ne;
    },
    get re() {
      return re;
    },
    get I() {
      return I;
    },
    get ie() {
      return ie;
    },
    get L() {
      return L;
    },
    get ae() {
      return ae;
    },
    get oe() {
      return oe;
    },
    get se() {
      return se;
    },
    get ce() {
      return ce;
    },
    get le() {
      return le;
    },
    get R() {
      return R;
    },
    get ue() {
      return ue;
    },
    get de() {
      return de;
    },
    get z() {
      return z;
    },
    get B() {
      return B;
    },
    get V() {
      return V;
    },
    get H() {
      return H;
    },
    get fe() {
      return fe;
    },
    get U() {
      return U;
    },
    get pe() {
      return pe;
    },
    get me() {
      return me;
    },
    get he() {
      return he;
    },
    get ge() {
      return ge;
    },
    get _e() {
      return _e;
    },
    get ve() {
      return ve;
    },
    get ye() {
      return ye;
    },
    get be() {
      return be;
    },
    get xe() {
      return xe;
    },
    get Se() {
      return Se;
    },
    get Ce() {
      return Ce;
    },
    get we() {
      return we;
    },
  },
  {
    'du': (value) => {
      ManagementApp = value;
    },
  },
);
initializeUiScope(appScope, appModules, [
  ['shared', 0],
  ['shared', 1],
  ['motion', 0],
  ['motion', 1],
  ['motion', 2],
  ['motion', 3],
  ['motion', 4],
  ['motion', 5],
  ['motion', 6],
  ['motion', 7],
  ['motion', 8],
  ['motion', 9],
  ['motion', 10],
  ['motion', 11],
  ['motion', 12],
  ['motion', 13],
  ['motion', 14],
  ['motion', 15],
  ['motion', 16],
  ['motion', 17],
  ['motion', 18],
  ['motion', 19],
  ['motion', 20],
  ['motion', 21],
  ['motion', 22],
  ['motion', 23],
  ['motion', 24],
  ['motion', 25],
  ['motion', 26],
  ['motion', 27],
  ['motion', 28],
  ['motion', 29],
  ['motion', 30],
  ['motion', 31],
  ['motion', 32],
  ['motion', 33],
  ['motion', 34],
  ['motion', 35],
  ['motion', 36],
  ['motion', 37],
  ['motion', 38],
  ['motion', 39],
  ['motion', 40],
  ['motion', 41],
  ['motion', 42],
  ['motion', 43],
  ['motion', 44],
  ['motion', 45],
  ['motion', 46],
  ['motion', 47],
  ['motion', 48],
  ['motion', 49],
  ['motion', 50],
  ['motion', 51],
  ['motion', 52],
  ['motion', 53],
  ['motion', 54],
  ['motion', 55],
  ['motion', 56],
  ['motion', 57],
  ['motion', 58],
  ['motion', 59],
  ['motion', 60],
  ['motion', 61],
  ['motion', 62],
  ['motion', 63],
  ['motion', 64],
  ['motion', 65],
  ['motion', 66],
  ['motion', 67],
  ['motion', 68],
  ['motion', 69],
  ['motion', 70],
  ['motion', 71],
  ['motion', 72],
  ['motion', 73],
  ['motion', 74],
  ['motion', 75],
  ['motion', 76],
  ['motion', 77],
  ['motion', 78],
  ['motion', 79],
  ['motion', 80],
  ['motion', 81],
  ['motion', 82],
  ['motion', 83],
  ['motion', 84],
  ['motion', 85],
  ['motion', 86],
  ['motion', 87],
  ['motion', 88],
  ['sites', 0],
  ['sites', 1],
  ['sites', 2],
  ['sites', 3],
  ['sites', 4],
  ['sites', 5],
  ['sites', 6],
  ['sites', 7],
  ['sites', 8],
  ['sites', 9],
  ['sites', 10],
  ['sites', 11],
  ['sites', 12],
  ['sites', 13],
  ['sites', 14],
  ['sites', 15],
  ['sites', 16],
  ['sites', 17],
  ['sites', 18],
  ['sites', 19],
  ['sites', 20],
  ['sites', 21],
  ['sites', 22],
  ['sites', 23],
  ['sites', 24],
  ['sites', 25],
  ['sites', 26],
  ['sites', 27],
  ['sites', 28],
  ['settings', 0],
  ['learning', 0],
  ['learning', 1],
  ['learning', 2],
  ['learning', 3],
  ['learning', 4],
  ['learning', 5],
  ['learning', 6],
  ['learning', 7],
  ['learning', 8],
  ['learning', 9],
  ['shared', 2],
  ['shared', 3],
  ['checkin', 0],
  ['checkin', 1],
  ['checkin', 2],
  ['records', 0],
  ['records', 1],
  ['records', 2],
  ['accounts', 0],
  ['sites', 29],
  ['sites', 30],
  ['sites', 31],
  ['sites', 32],
  ['sites', 33],
  ['entry', 0],
  ['settings', 1],
  ['entry', 1],
  ['entry', 2],
  ['checkin', 3],
  ['checkin', 4],
  ['records', 3],
  ['records', 4],
  ['records', 5],
  ['records', 6],
  ['records', 7],
  ['records', 8],
  ['records', 9],
  ['records', 10],
  ['records', 11],
  ['learning', 10],
  ['learning', 11],
  ['learning', 12],
  ['learning', 13],
  ['learning', 14],
  ['accounts', 1],
  ['sites', 34],
  ['sites', 35],
  ['sites', 36],
  ['sites', 37],
  ['sites', 38],
  ['sites', 39],
  ['accounts', 2],
  ['accounts', 3],
  ['accounts', 4],
  ['accounts', 5],
  ['settings', 2],
  ['settings', 3],
  ['settings', 4],
  ['settings', 5],
  ['settings', 6],
  ['settings', 7],
  ['accounts', 6],
  ['accounts', 7],
  ['search', 0],
  ['search', 1],
  ['search', 2],
  ['search', 3],
  ['search', 4],
  ['search', 5],
  ['search', 6],
  ['search', 7],
  ['search', 8],
  ['search', 9],
  ['search', 10],
  ['search', 11],
  ['search', 12],
  ['search', 13],
  ['search', 14],
  ['search', 15],
  ['search', 16],
  ['search', 17],
  ['search', 18],
  ['search', 19],
  ['search', 20],
  ['search', 21],
  ['search', 22],
  ['search', 23],
  ['search', 24],
  ['search', 25],
  ['search', 26],
  ['search', 27],
  ['search', 28],
  ['search', 29],
  ['search', 30],
  ['search', 31],
  ['search', 32],
  ['search', 33],
  ['search', 34],
  ['search', 35],
  ['search', 36],
  ['search', 37],
  ['search', 38],
  ['search', 39],
  ['search', 40],
  ['search', 41],
  ['search', 42],
  ['search', 43],
  ['search', 44],
  ['search', 45],
  ['search', 46],
  ['search', 47],
  ['search', 48],
  ['search', 49],
  ['search', 50],
  ['search', 51],
  ['search', 52],
  ['search', 53],
  ['search', 54],
  ['search', 55],
  ['search', 56],
  ['search', 57],
  ['search', 58],
  ['search', 59],
  ['search', 60],
  ['search', 61],
  ['search', 62],
  ['search', 63],
  ['search', 64],
  ['search', 65],
  ['accounts', 8],
  ['accounts', 9],
  ['sites', 40],
  ['sites', 41],
  ['sites', 42],
  ['sites', 43],
  ['sites', 44],
  ['settings', 8],
  ['shared', 4],
  ['shared', 5],
  ['shared', 6],
  ['shared', 7],
]);
