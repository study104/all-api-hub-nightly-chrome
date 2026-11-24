/** src/modules/learning/view.js: 功能模块实现，保留发布版本的符号以便逐步恢复命名。 */
import { createUiModuleRuntime, createUiScope, initializeUiScope } from '../../shared/ui-scope.js';

// 学习流程校验、录制结果说明与签到流程配置 — app published scope.
export let validateLearnedWorkflow,
  LearnedCheckinSettings,
  LearningSteps,
  LearningSummary,
  learningInstructions;
export const appRuntime = createUiModuleRuntime({
  bindingNames: [
    'Tn',
    'En',
    'Dn',
    'On',
    'kn',
    'An',
    'jn',
    'Mn',
    'Nn',
    'Pn',
    'Fn',
    'In',
    'Ln',
    'Rn',
    'zn',
    'Bn',
    'Vn',
    'Hn',
    'Un',
    'Wn',
    'Gn',
    'Kn',
    'qn',
    'Jn',
    'Yn',
    'Xn',
    'ca',
    'la',
    'ua',
    'da',
    'fa',
    'pa',
    'ma',
    'ha',
    'ga',
    '_a',
    'va',
    'ya',
    'ba',
    'xa',
    'Sa',
    'Ca',
    'wa',
    'Ta',
    'Ea',
    'Da',
    'Oa',
    'ka',
    'ja',
    'Ma',
    'Na',
    'Pa',
    'Fa',
    'Ia',
    'La',
    'Ra',
    'za',
    'ko',
    'Ao',
    'jo',
    'Mo',
  ],
  publish(name, value) {
    switch (name) {
      case 'Yn':
        validateLearnedWorkflow = value;
        break;
      case 'Mo':
        LearnedCheckinSettings = value;
        break;
      case 'Oa':
        LearningSteps = value;
        break;
      case 'Fa':
        LearningSummary = value;
        break;
      case 'Pa':
        learningInstructions = value;
        break;
    }
  },
  register(scope) {
    scope.Fn = function Fn(e) {
      return typeof e == `object` && !!e && !Array.isArray(e);
    };
    scope.In = function In(e, t = 0, n = scope.En) {
      return typeof e == `number` && Number.isFinite(e) && e >= t && e <= n;
    };
    scope.Ln = function Ln(e) {
      return (0, scope.In)(e, 0, 1);
    };
    scope.Rn = function Rn(e) {
      return typeof e == `string` && e.trim().length > 0 && e.length <= scope.On;
    };
    scope.zn = function zn(e) {
      return (0, scope.Rn)(e) && !e.includes(`text=`);
    };
    scope.Bn = function Bn(e) {
      let t = e.trim();
      return /^(?:https?:)?\/\//i.test(t)
        ? !0
        : /(?:^|[\s,>+~])(?:[a-z0-9-]+\.)+[a-z]{2,}\//i.test(t);
    };
    scope.Vn = function Vn(e, t, n) {
      (e.scrollIntoView !== void 0 &&
        typeof e.scrollIntoView != `boolean` &&
        n.push(`${t}的 scrollIntoView 必须是布尔值`),
        e.scrollContainer !== void 0 &&
          (!(0, scope.zn)(e.scrollContainer) || e.scrollIntoView !== !0) &&
          n.push(`${t}的 scrollContainer 必须是启用滚动定位的 CSS 选择器`));
    };
    scope.Hn = function Hn(e, t, n, r) {
      let i = e[t];
      typeof i != `string` || !i.trim()
        ? r.push(`${n}缺少 ${t}`)
        : i.length > scope.On
          ? r.push(`${n}的 ${t} 过长`)
          : (0, scope.Bn)(i) && r.push(`${n}的 ${t} 不能包含跨站地址`);
    };
    scope.Un = function Un(e, t, n, r) {
      (!(0, scope.Fn)(e) || !(0, scope.Ln)(e.rx) || !(0, scope.Ln)(e.ry)) &&
        r.push(`${n}的 ${t} 必须是 rx/ry 均在 0..1 的坐标`);
    };
    scope.Wn = function Wn(e, t, n) {
      (e.anchor !== void 0 && (0, scope.Un)(e.anchor, `anchor`, t, n),
        e.gesture !== void 0 &&
          (typeof e.gesture != `string` || !scope.Nn.has(e.gesture)) &&
          n.push(`${t}的 gesture 无效`),
        e.key !== void 0 &&
          (typeof e.key != `string` || !scope.Mn.has(e.key)) &&
          n.push(`${t}的 key 只允许非打印功能键`));
    };
    scope.Gn = function Gn(e, t, n) {
      (e.control !== void 0 &&
        (typeof e.control != `string` || !scope.Pn.has(e.control)) &&
        n.push(`${t}的 control 无效`),
        e.choice !== void 0 &&
          (!Number.isSafeInteger(e.choice) || e.choice < 0 || e.choice > scope.An) &&
          n.push(`${t}的 choice 必须是 ${scope.An} 以内的非负整数`),
        e.checked !== void 0 &&
          typeof e.checked != `boolean` &&
          n.push(`${t}的 checked 必须是布尔值`));
      let r = typeof e.control == `string` ? e.control : void 0;
      (e.choice !== void 0 &&
        r !== `select` &&
        n.push(`${t}的 choice 只能用于 control 为 select 的填写步骤`),
        e.checked !== void 0 &&
          r !== `checkbox` &&
          r !== `radio` &&
          n.push(`${t}的 checked 只能用于 control 为 checkbox/radio 的填写步骤`),
        r === `select` && e.choice === void 0 && n.push(`${t}的 select 步骤必须指定 choice`),
        (r === `checkbox` || r === `radio`) &&
          e.checked === void 0 &&
          n.push(`${t}的 ${r} 步骤必须指定 checked`));
    };
    scope.Kn = function Kn(e, t) {
      try {
        return new URL(t, e.loginUrl).origin === new URL(e.loginUrl).origin;
      } catch {
        return !1;
      }
    };
    scope.qn = function qn(e, t) {
      if (t === void 0) return [];
      if (!Array.isArray(t)) return [`工作流学习路线必须是字符串数组`];
      if (t.length > scope.jn) return [`工作流学习路线最多 ${scope.jn} 个页面`];
      let n = [];
      return (
        t.forEach((t, r) => {
          typeof t != `string` || !t.trim()
            ? n.push(`工作流学习路线第 ${r + 1} 项必须是非空地址`)
            : (0, scope.Kn)(e, t) || n.push(`工作流学习路线第 ${r + 1} 项必须与登录站点同源`);
        }),
        n
      );
    };
    scope.Jn = function Jn(e, t, n) {
      if (t === void 0) return [];
      if (typeof t != `string` || !t.trim()) return [`工作流身份核验路径必须是非空字符串`];
      if (t.length > 500) return [`工作流身份核验路径过长`];
      if (!(0, scope.Kn)(e, t)) return [`工作流身份核验路径必须与登录站点同源`];
      try {
        let r = new URL(t, e.loginUrl);
        if (
          r.username ||
          r.password ||
          r.search ||
          /(?:access_token|refresh_token|id_token|code|state|token|secret|password)=/i.test(r.hash)
        )
          return [`工作流身份核验路径不能包含查询参数或凭据`];
        if (!Array.isArray(n) || n.length === 0) return [`工作流身份核验路径必须位于学习路线中`];
        let i = `${r.pathname}${r.hash}`;
        return n
          .map((t) => {
            if (typeof t != `string` || !t.trim()) return;
            let n = new URL(t, e.loginUrl);
            if (n.origin === r.origin) return `${n.pathname}${n.hash}`;
          })
          .indexOf(i) >= 0
          ? []
          : [`工作流身份核验路径必须位于学习路线中`];
      } catch {
        return [`工作流身份核验路径必须位于学习路线中`];
      }
    };
    scope.Yn = function Yn(e, t) {
      let n = [];
      if (!t || !Array.isArray(t.steps) || t.steps.length === 0) return [`工作流至少需要一个步骤`];
      (n.push(...(0, scope.qn)(e, t.route)), n.push(...(0, scope.Jn)(e, t.identityPath, t.route)));
      let r = 0,
        i = 0,
        a = (t, o, s, c) => {
          s > scope.Dn
            ? n.push(`${o}条件嵌套超过 ${scope.Dn} 层`)
            : ((r += t.length),
              !(r > scope.Tn) &&
                t.forEach((t, r) => {
                  let l = `${o}${r + 1}`;
                  if (!(0, scope.Fn)(t) || typeof t.type != `string`) n.push(`${l}格式无效`);
                  else
                    switch (t.type) {
                      case `if`: {
                        let e = t.condition;
                        (!(0, scope.Fn)(e) || typeof e.type != `string`
                          ? n.push(`${l}缺少有效 condition`)
                          : e.type === `text`
                            ? ((!Array.isArray(e.words) ||
                                e.words.length === 0 ||
                                e.words.some((e) => typeof e != `string` || !e.trim())) &&
                                n.push(`${l}的 text 条件需要非空 words`),
                              e.match !== void 0 &&
                                e.match !== `any` &&
                                e.match !== `all` &&
                                n.push(`${l}的 text 条件 match 无效`))
                            : e.type === `selector`
                              ? (typeof e.selector != `string` || !e.selector.trim()) &&
                                n.push(`${l}的 selector 条件缺少 selector`)
                              : e.type === `path`
                                ? (typeof e.pattern != `string` || !e.pattern.trim()) &&
                                  n.push(`${l}的 path 条件缺少 pattern`)
                                : n.push(`${l}包含不支持的 condition 类型`),
                          !Array.isArray(t.then) || t.then.length === 0
                            ? n.push(`${l}的 then 分支不能为空`)
                            : a(t.then, `${l}.then.`, s + 1, !1),
                          t.else !== void 0 &&
                            (Array.isArray(t.else)
                              ? a(t.else, `${l}.else.`, s + 1, !1)
                              : n.push(`${l}的 else 分支格式无效`)));
                        break;
                      }
                      case `navigate`:
                        ((i += 1),
                          (!c || r !== 0) && n.push(`${l}只能把 navigate 放在第一步`),
                          typeof t.url != `string` || !t.url.trim()
                            ? n.push(`${l}缺少 url`)
                            : (0, scope.Kn)(e, t.url) || n.push(`${l}必须与登录站点同源`));
                        break;
                      case `click`:
                        ((typeof t.selector != `string` || !t.selector.trim()) &&
                          n.push(`${l}缺少 selector`),
                          t.waitFor !== void 0 &&
                            (typeof t.waitFor != `string` || !t.waitFor.trim()) &&
                            n.push(`${l}的 waitFor 无效`),
                          t.timeoutMs !== void 0 &&
                            !(0, scope.In)(t.timeoutMs, 0) &&
                            n.push(`${l}的 timeoutMs 超出范围`),
                          (0, scope.Wn)(t, l, n),
                          (0, scope.Vn)(t, l, n));
                        break;
                      case `fill`:
                        ((typeof t.selector != `string` || !t.selector.trim()) &&
                          n.push(`${l}缺少 selector`),
                          typeof t.value != `string` && n.push(`${l}缺少 value`),
                          t.timeoutMs !== void 0 &&
                            !(0, scope.In)(t.timeoutMs, 0) &&
                            n.push(`${l}的 timeoutMs 超出范围`),
                          (0, scope.Gn)(t, l, n),
                          (0, scope.Vn)(t, l, n));
                        break;
                      case `scroll`:
                        ((0, scope.Ln)(t.ratio) || n.push(`${l}的 ratio 必须是 0..1 的数字`),
                          t.container !== void 0 &&
                            !(0, scope.zn)(t.container) &&
                            n.push(`${l}的 container 必须是安全的 CSS 选择器`),
                          t.settleMs !== void 0 &&
                            !(0, scope.In)(t.settleMs, 0) &&
                            n.push(`${l}的 settleMs 超出范围`),
                          t.timeoutMs !== void 0 &&
                            !(0, scope.In)(t.timeoutMs, 0) &&
                            n.push(`${l}的 timeoutMs 超出范围`));
                        break;
                      case `drag`:
                        ((0, scope.Hn)(t, `selector`, l, n),
                          (0, scope.Hn)(t, `toSelector`, l, n),
                          t.anchor !== void 0 && (0, scope.Un)(t.anchor, `anchor`, l, n),
                          t.toAnchor !== void 0 && (0, scope.Un)(t.toAnchor, `toAnchor`, l, n),
                          t.steps !== void 0 &&
                            (!Number.isSafeInteger(t.steps) || t.steps < 0 || t.steps > scope.kn) &&
                            n.push(`${l}的 steps 必须是 0-${scope.kn} 的整数`),
                          t.timeoutMs !== void 0 &&
                            !(0, scope.In)(t.timeoutMs, 0) &&
                            n.push(`${l}的 timeoutMs 超出范围`),
                          (0, scope.Vn)(t, l, n));
                        break;
                      case `wait`: {
                        let e = typeof t.selector == `string` && t.selector.trim().length > 0,
                          r = t.ms !== void 0;
                        (e && r && n.push(`${l}只能设置 selector 或 ms 其中一个`),
                          r && !(0, scope.In)(t.ms, 0) && n.push(`${l}的 ms 超出范围`),
                          t.timeoutMs !== void 0 &&
                            !(0, scope.In)(t.timeoutMs, 0) &&
                            n.push(`${l}的 timeoutMs 超出范围`));
                        break;
                      }
                      case `assert`: {
                        let e = typeof t.selector == `string` && t.selector.trim().length > 0,
                          r =
                            Array.isArray(t.text) &&
                            t.text.some((e) => typeof e == `string` && e.trim());
                        (!e && !r && n.push(`${l}需要 selector 或 text`),
                          t.text !== void 0 &&
                            (!Array.isArray(t.text) || t.text.some((e) => typeof e != `string`)) &&
                            n.push(`${l}的 text 必须是字符串数组`),
                          t.result !== void 0 &&
                            t.result !== `success` &&
                            t.result !== `already` &&
                            n.push(`${l}的 result 无效`),
                          t.timeoutMs !== void 0 &&
                            !(0, scope.In)(t.timeoutMs, 0) &&
                            n.push(`${l}的 timeoutMs 超出范围`));
                        break;
                      }
                      case `leilei-daily`: {
                        let t = ``;
                        try {
                          t = new URL(e.loginUrl).hostname.toLowerCase();
                        } catch {}
                        let r = !1;
                        try {
                          let t = new URL(e.loginUrl);
                          r =
                            t.protocol === `https:` &&
                            t.hostname.toLowerCase() === `fapi.leileihog.top` &&
                            !t.port;
                        } catch {}
                        (t !== `fapi.leileihog.top` || !r) &&
                          n.push(`${l}的 leilei-daily 仅允许用于 fapi.leileihog.top`);
                        break;
                      }
                      default:
                        n.push(`${l}包含不支持的步骤类型`);
                    }
                }));
        };
      return (
        a(t.steps, `工作流第 `, 0, !0),
        (t.steps.length > scope.Tn || r > scope.Tn) && n.push(`工作流最多支持 ${scope.Tn} 个步骤`),
        i > 1 && n.push(`工作流当前只允许一个 navigate 步骤`),
        n
      );
    };
    scope.Xn = function Xn(e) {
      let t = (0, scope.Zn)(e.loginUrl);
      return t ? new URL(t).origin : null;
    };
    scope.ca = function ca(e) {
      return !scope.sa.some((t) => t.test(e));
    };
    scope.la = function la(e, t = []) {
      let lines = [
        String(e ?? ``),
        ...(Array.isArray(t) ? t : [])
          .filter((line) => typeof line === `string` && (0, scope.ca)(line))
          .reverse(),
      ];
      for (let line of lines)
        for (let { code, patterns } of scope.oa)
          if (patterns.some((pattern) => pattern.test(line))) return code;
      return scope.Z.UNKNOWN;
    };
    scope.ua = function ua(e, t = []) {
      let n = (0, scope.la)(e, t);
      return { code: n, message: e, ...scope.ia[n] };
    };
    scope.da = function da(e, t) {
      return (0, scope.qi)(e, t);
    };
    scope.fa = function fa(e) {
      let t = Math.max(0, Math.floor(e / 1e3)),
        n = Math.floor(t / 60),
        r = t % 60;
      return n <= 0 ? `${r} 秒` : `${n} 分 ${r} 秒`;
    };
    scope.ma = function ma(e) {
      return scope.pa[e] ?? scope.pa.incomplete;
    };
    scope.ha = function ha(e) {
      return e === `ok` || e === `warn` || e === `missing`;
    };
    scope.ga = function ga(e) {
      return e === `complete` || e === `partial` || e === `incomplete`;
    };
    scope._a = function _a(e) {
      if (!e) return null;
      let t = (e.report?.lines ?? []).filter(
        (e) => !!e && typeof e.text == `string` && (0, scope.ha)(e.status),
      );
      if ((0, scope.ga)(e.report?.verdict) && t.length > 0)
        return { verdict: e.report.verdict, lines: t };
      let n = (e.warnings ?? []).filter((e) => typeof e == `string` && e.trim().length > 0);
      return n.length === 0
        ? null
        : { verdict: `partial`, lines: n.map((e) => ({ status: `warn`, text: e })) };
    };
    scope.va = function va(e) {
      if (!e) return null;
      let t = e.lines[0]?.text;
      return t ? `${(0, scope.ma)(e.verdict)}：${t}` : (0, scope.ma)(e.verdict);
    };
    scope.ya = function ya(e, t, n) {
      let r =
          e.includes(`login`) && e.includes(`checkin`)
            ? `登录配置与签到流程`
            : e.includes(`login`)
              ? `登录配置`
              : e.includes(`checkin`)
                ? `签到流程`
                : `任何配置`,
        i =
          e.length > 0
            ? `已保存本站${r}（录到 ${t} 个事件）`
            : `本次没有保存任何配置（录到 ${t} 个事件）`,
        a = n
          .map((e) => e.trim())
          .filter(Boolean)
          .join(`；`);
      return a ? `${i}，但这次演示没录全：${a}` : i;
    };
    scope.ba = function ba(e, t, n) {
      let r = (0, scope.va)(n),
        i = r ? `.${r}` : ``;
      return e === `both`
        ? `已更新本站共用登录与签到流程（录到 ${t} 个事件）：本站现有和新增账号各自登录、核验身份后使用这版流程，无需逐个学习${i}`
        : e === `login`
          ? `已更新本站共用登录流程（录到 ${t} 个事件）：本站现有和新增账号按这版入口与字段，使用各自凭据登录${i}`
          : `已更新本站共用签到流程（录到 ${t} 个事件）：本站现有和新增账号各自登录、核验身份后使用这版流程，无需逐个学习${i}`;
    };
    scope.xa = function xa(e) {
      let t = [...(e.savedKinds ?? [])],
        n = e.intent ?? (e.kind === `login` ? `login` : `both`),
        r = t.includes(`login`),
        i = t.includes(`checkin`);
      return {
        intent: n,
        saved: t,
        savedLogin: r,
        savedCheckin: i,
        complete: n === `login` ? r : r && i,
      };
    };
    scope.Sa = function Sa(e) {
      let t = (0, scope.xa)(e),
        n = (0, scope._a)(e),
        r = n?.verdict ?? (t.complete ? `complete` : `incomplete`);
      if (r !== `incomplete` && e.checkinSavedAs === `login-as-checkin` && t.savedCheckin) {
        let t = n ? (0, scope.va)(n) : null,
          r = t ? `。${t}` : ``;
        return `已保存本站共用「登录即签到」流程（录到 ${e.eventCount} 个事件）：本站现有和新增账号使用各自凭据登录并确认身份后即完成签到${r}`;
      }
      if (r === `complete`)
        return (0, scope.ba)(
          t.savedLogin && t.savedCheckin ? `both` : t.savedCheckin ? `checkin` : `login`,
          e.eventCount,
          n,
        );
      if (r === `partial`) {
        let r = (0, scope.ya)(t.saved, e.eventCount, e.warnings ?? []);
        return r.includes(`没录全`)
          ? r
          : `${r}，但这次演示有需要注意的地方：${n?.lines.map((e) => e.text).join(`；`) ?? ``}`;
      }
      return (0, scope.ya)(t.saved, e.eventCount, e.warnings ?? []);
    };
    scope.Ta = function Ta(e) {
      return typeof e == `string` && Object.hasOwn(scope.Ca, e) ? scope.Ca[e] : scope.wa;
    };
    scope.Ea = function Ea(e) {
      return typeof e == `string` && Object.hasOwn(scope.Ca, e) ? e : `unknown`;
    };
    scope.Da = function Da(e) {
      return !!e && typeof e.text == `string` && e.text.trim().length > 0;
    };
    scope.Oa = function Oa(e, t = 5) {
      let n = (Array.isArray(e) ? e : [])
          .map((e, t) => ({ item: e, index: t }))
          .filter((e) => (0, scope.Da)(e.item)),
        r = new Map(),
        i = [];
      for (let e of n) {
        let t = e.item.at;
        if (typeof t != `number` || !Number.isFinite(t)) {
          i.push(e);
          continue;
        }
        let n = `${String(e.item.kind)}\u0000${t}\u0000${String(e.item.path ?? ``)}`,
          a = r.get(n),
          o = a && typeof a.item.text == `string` ? a.item.text : ``,
          s = typeof e.item.text == `string` ? e.item.text : ``;
        !a || !(s.startsWith(o) || o.startsWith(s))
          ? (r.set(n, e), i.push(e))
          : s.length > o.length && (a.item = e.item);
      }
      let a = Math.max(0, Math.floor(t)),
        o = a > 0 ? i.slice(-a) : [];
      return {
        items: o.map((e) => ({
          kind: (0, scope.Ea)(e.item.kind),
          label: (0, scope.Ta)(e.item.kind),
          text: e.item.text,
          index: e.index + 1,
        })),
        hidden: i.length - o.length,
        total: i.length,
      };
    };
    scope.ka = function ka(e, t) {
      let n = (0, scope.Oa)(e).total;
      return n > 0 ? n : Math.max(0, Math.floor(t) || 0);
    };
    scope.ja = function ja({ name: e, status: t }) {
      return (0, scope.W.jsx)(`span`, {
        className: (0, scope.R)(
          `grid size-9 shrink-0 place-items-center rounded-lg text-xs font-bold`,
          t === `done`
            ? `bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300`
            : t === `failed`
              ? `bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300`
              : t === `attention`
                ? `bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300`
                : t === `running`
                  ? `bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`
                  : `bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300`,
        ),
        children: e.trim().slice(0, 1).toUpperCase(),
      });
    };
    scope.Ma = function Ma({ children: e, tone: t, title: n }) {
      return (0, scope.W.jsx)(`span`, {
        title: n,
        className: (0, scope.R)(
          `inline-flex max-w-full items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium`,
          {
            emerald: `bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300`,
            blue: `bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300`,
            rose: `bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300`,
            slate: `bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300`,
          }[t],
        ),
        children: e,
      });
    };
    scope.Na = function Na(e) {
      return e === `login`
        ? `登录`
        : e === `both`
          ? `登录与签到`
          : e === `checkin`
            ? `签到`
            : `登录与签到`;
    };
    scope.Pa = function Pa(e) {
      return e === `login`
        ? `本次请手动完成登录，再点「结束学习」。保存后更新本站共用登录配置，现有和新增账号使用各自凭据登录；不会保存这次输入的账号或密码内容。`
        : `本次请先手动登录，进入能显示当前账号的页面，再完成一次签到，最后点「结束学习」。保存后更新本站唯一的共用流程，现有和新增账号无需逐个学习；每个账号使用自己的凭据并确认自己的身份。`;
    };
    scope.Fa = function Fa({ guide: e }) {
      return !e || e.steps.length === 0
        ? null
        : (0, scope.W.jsx)(`div`, {
            'data-learning-steps-bar': e.step,
            className: `flex flex-wrap items-center gap-1`,
            children: e.steps.map((e, t) =>
              (0, scope.W.jsxs)(
                `span`,
                {
                  'data-learning-step': e.state,
                  className: (0, scope.R)(
                    `inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium`,
                    e.state === `current` &&
                      `bg-violet-600/15 text-violet-700 dark:text-violet-300`,
                    e.state === `done` &&
                      `bg-emerald-500/10 text-emerald-700 dark:text-emerald-300`,
                    e.state === `todo` && `bg-slate-500/10 text-slate-500 dark:text-slate-400`,
                  ),
                  children: [
                    (0, scope.W.jsx)(`span`, { className: `opacity-60`, children: t + 1 }),
                    e.label,
                  ],
                },
                `${t}-${e.label}`,
              ),
            ),
          });
    };
    scope.Ia = function Ia({ kind: e }) {
      let t = `size-3 shrink-0 opacity-70`;
      return e === `click`
        ? (0, scope.W.jsx)(scope.$e, { className: t, 'aria-hidden': `true` })
        : e === `fill`
          ? (0, scope.W.jsx)(scope.xt, { className: t, 'aria-hidden': `true` })
          : e === `scroll`
            ? (0, scope.W.jsx)(scope.ht, { className: t, 'aria-hidden': `true` })
            : e === `drag`
              ? (0, scope.W.jsx)(scope.tt, { className: t, 'aria-hidden': `true` })
              : e === `navigation`
                ? (0, scope.W.jsx)(scope.Ne, { className: t, 'aria-hidden': `true` })
                : (0, scope.W.jsx)(scope.je, { className: t, 'aria-hidden': `true` });
    };
    scope.Ra = function Ra({ title: e, preview: t, testId: n, tone: r = `violet` }) {
      let i = (0, scope.Oa)(t);
      if (i.items.length === 0) return null;
      let a = scope.La[r];
      return (0, scope.W.jsxs)(`div`, {
        'data-learning-steps': n,
        className: a.box,
        children: [
          (0, scope.W.jsx)(`p`, { className: `mb-1 font-medium ${a.title}`, children: e }),
          (0, scope.W.jsxs)(`ul`, {
            className: `space-y-0.5`,
            children: [
              i.items.map((e) =>
                (0, scope.W.jsxs)(
                  `li`,
                  {
                    className: `flex items-start gap-1.5 ${a.row}`,
                    children: [
                      (0, scope.W.jsxs)(`span`, {
                        className: `shrink-0 tabular-nums opacity-60`,
                        children: [e.index, `.`],
                      }),
                      (0, scope.W.jsx)(scope.Ia, { kind: e.kind }),
                      (0, scope.W.jsx)(`span`, { className: `break-all`, children: e.text }),
                    ],
                  },
                  e.index,
                ),
              ),
              i.hidden > 0 &&
                (0, scope.W.jsxs)(`li`, {
                  className: `opacity-70 ${a.row}`,
                  children: [`… 还有 `, i.hidden, ` 个动作`],
                }),
            ],
          }),
        ],
      });
    };
    scope.za = function za({
      title: e,
      label: t,
      onClick: n,
      children: r,
      accent: i = !1,
      danger: a = !1,
    }) {
      return (0, scope.W.jsxs)(scope.w.button, {
        whileTap: { scale: 0.92 },
        type: `button`,
        title: e,
        'aria-label': e,
        onClick: n,
        className: (0, scope.R)(
          `shrink-0 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white`,
          t
            ? `inline-flex h-7 items-center gap-1 whitespace-nowrap px-2 text-[11px] font-medium`
            : `grid size-7 place-items-center`,
          i && `text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40`,
          a &&
            `hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400`,
        ),
        children: [r, t],
      });
    };
    scope.ko = function ko({ link: e, checked: t, selectable: n, detail: r, onToggle: i }) {
      return (0, scope.W.jsxs)(`button`, {
        type: `button`,
        onClick: i,
        disabled: !n,
        className: `flex w-full items-start gap-2.5 border-b border-black/5 px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/5 dark:hover:bg-white/[0.04]`,
        children: [
          (0, scope.W.jsx)(`span`, {
            className: (0, scope.R)(
              `mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border text-white transition-colors`,
              t
                ? `border-brand-500 bg-brand-500`
                : `border-black/15 bg-transparent dark:border-white/15`,
            ),
            children: t && (0, scope.W.jsx)(scope.o, { className: `size-3` }),
          }),
          (0, scope.W.jsx)(scope.ze, {
            className: `mt-0.5 size-3.5 shrink-0 text-ink-800/25 dark:text-ink-100/20`,
          }),
          (0, scope.W.jsxs)(`span`, {
            className: `min-w-0 flex-1`,
            children: [
              (0, scope.W.jsx)(`span`, {
                className: `block truncate text-xs font-medium text-ink-900 dark:text-ink-50`,
                children: e.name,
              }),
              (0, scope.W.jsx)(`span`, {
                className: `block truncate text-[11px] text-ink-800/45 dark:text-ink-100/35`,
                children: e.url,
              }),
              (0, scope.W.jsx)(`span`, {
                className: (0, scope.R)(
                  `mt-0.5 block truncate text-[10px]`,
                  n ? `text-ink-800/40 dark:text-ink-100/30` : `text-amber-700 dark:text-amber-300`,
                ),
                children: r,
              }),
              e.folderPath &&
                (0, scope.W.jsx)(`span`, {
                  className: `block truncate text-[10px] text-ink-800/35 dark:text-ink-100/25`,
                  children: e.folderPath,
                }),
            ],
          }),
        ],
      });
    };
    scope.Ao = function Ao(e) {
      switch (e.type) {
        case `click`: {
          let t = `「${(0, scope.jo)(e.selector)}」`;
          return `${e.gesture === `double` ? `双击` : e.gesture === `right` ? `右键` : e.gesture === `long-press` ? `长按` : e.key ? `按 ${e.key} 键触发` : `点击`}${t}${e.anchor ? `（落点 ${Math.round(e.anchor.rx * 100)}%, ${Math.round(e.anchor.ry * 100)}%）` : ``}`;
        }
        case `fill`:
          return e.control === `select`
            ? `在「${(0, scope.jo)(e.selector)}」选择第 ${(e.choice ?? 0) + 1} 项`
            : e.control === `checkbox` || e.control === `radio`
              ? `${e.checked ? `勾选` : `取消勾选`}「${(0, scope.jo)(e.selector)}」`
              : `在「${(0, scope.jo)(e.selector)}」填写内容`;
        case `scroll`: {
          let t = Math.round(e.ratio * 100);
          return e.container ? `「${(0, scope.jo)(e.container)}」滚动到 ${t}%` : `页面滚动到 ${t}%`;
        }
        case `drag`:
          return `把「${(0, scope.jo)(e.selector)}」拖到「${(0, scope.jo)(e.toSelector)}」`;
        case `navigate`:
          return `进入页面 ${e.url}`;
        case `wait`:
          return e.selector
            ? `等待「${(0, scope.jo)(e.selector)}」出现`
            : `等待 ${e.ms ?? 500} 毫秒`;
        case `assert`: {
          let t = e.selector
            ? `「${(0, scope.jo)(e.selector)}」`
            : `文字 ${(e.text ?? []).join(` / `)}`;
          return e.result === `success`
            ? `确认签到成功：${t}`
            : e.result === `already`
              ? `确认今日已完成：${t}`
              : `检查 ${t}`;
        }
        case `if`:
          return `如果 ${e.condition.type === `text` ? `页面出现 ${e.condition.words.join(` / `)}` : e.condition.type === `selector` ? `存在「${(0, scope.jo)(e.condition.selector)}」` : `路径匹配 ${e.condition.pattern}`}`;
        case `leilei-daily`:
          return `执行一梦五千年的每日签到与抽奖`;
        default:
          return `未知步骤`;
      }
    };
    scope.jo = function jo(e) {
      let t = e.trim();
      return t.startsWith(`text=`) ? t.slice(5).trim() : t;
    };
    scope.Mo = function Mo({ form: e, onChange: n }) {
      let r = (0, scope.mn)(e),
        i = e.checkin?.workflow,
        a = i !== void 0,
        o = a || r ? (0, scope.Yn)(e, i) : [],
        s = Array.isArray(i?.steps) ? i.steps : [],
        c = Array.isArray(i?.route) ? i.route : [],
        l = !r && e.checkin?.method === `none`,
        u = !r && !l && e.checkin?.method && e.checkin.method !== `auto`,
        d = e.checkin?.claimText ?? ``,
        f = e.checkin?.claimMinLength ?? (e.checkin?.method === `claim` ? 10 : 0),
        p = d.trim().length,
        m = r && JSON.stringify(i ?? {}).includes(`{{claimText}}`),
        h = m || e.checkin?.method === `claim` || !!d,
        g = p > 0 && p < f;
      return (0, scope.W.jsxs)(`section`, {
        'aria-label': `签到设置`,
        className: `space-y-3`,
        children: [
          (0, scope.W.jsxs)(`div`, {
            className: `space-y-2`,
            children: [
              (0, scope.W.jsx)(`span`, {
                className: `text-xs font-medium text-ink-800/70 dark:text-ink-100/60`,
                children: `自主学习`,
              }),
              (0, scope.W.jsxs)(`div`, {
                className: `rounded-xl bg-brand-500/10 p-3 ring-1 ring-brand-500/30`,
                children: [
                  (0, scope.W.jsxs)(`p`, {
                    className: `flex items-center gap-2 text-xs font-semibold text-brand-700 dark:text-brand-300`,
                    children: [
                      (0, scope.W.jsx)(scope.t, { className: `size-4 shrink-0` }),
                      r
                        ? `已学会本站流程，自动回放`
                        : l
                          ? `登录即签到（本站没有签到按钮）`
                          : u
                            ? `沿用本站已有的签到适配`
                            : `自动识别签到`,
                    ],
                  }),
                  (0, scope.W.jsx)(`p`, {
                    className: `mt-1.5 text-[11px] leading-relaxed text-ink-800/70 dark:text-ink-100/60`,
                    children: r
                      ? `按学习时记录的页面路线与操作顺序执行，遇到页面改版会自动兜底查找。`
                      : l
                        ? `登录成功后即视为完成签到，不再寻找签到按钮。`
                        : u
                          ? `沿用本站已有的按钮、接口或专用签到适配；不会套用学习记录。`
                          : `在本站自动寻找签到入口与今日状态；学到流程后会自动改为回放。`,
                  }),
                  (0, scope.W.jsxs)(`ol`, {
                    className: `mt-2 space-y-2 text-[11px] leading-relaxed text-ink-800/75 dark:text-ink-100/70`,
                    children: [
                      (0, scope.W.jsxs)(`li`, {
                        children: [
                          (0, scope.W.jsx)(`strong`, {
                            className: `font-medium`,
                            children: `① 登录并确认账号`,
                          }),
                          (0, scope.W.jsx)(`br`, {}),
                          `按登录设置进入站点，确认当前要签到的账号。`,
                        ],
                      }),
                      (0, scope.W.jsxs)(`li`, {
                        children: [
                          (0, scope.W.jsx)(`strong`, {
                            className: `font-medium`,
                            children: `② 完成签到`,
                          }),
                          (0, scope.W.jsx)(`br`, {}),
                          r
                            ? `按本站保存的页面路线与操作顺序执行，不使用其它站点的流程。`
                            : l
                              ? `登录成功后直接视为本次签到完成，不再执行额外的签到按钮或接口操作。`
                              : u
                                ? `沿用本站已有的按钮、接口或专用签到适配；不会自动套用学习记录。`
                                : `按本站适配和当前页面寻找签到入口、按钮及今日状态，不执行旧学习记录。`,
                        ],
                      }),
                    ],
                  }),
                  (0, scope.W.jsx)(`p`, {
                    className: `mt-2 text-[11px] leading-relaxed text-ink-800/50 dark:text-ink-100/40`,
                    children: `找不到入口时会滚动查找，遇到验证时先处理验证，当天已签到则按已完成收尾。「登录即签到」由你明确选择，未找到按钮不会自行切换。要更新本站共用流程，在任一账号旁点「学习本站流程」再演示一次即可。`,
                  }),
                ],
              }),
            ],
          }),
          (0, scope.W.jsxs)(`div`, {
            className: `rounded-xl bg-ink-50 p-3 dark:bg-ink-900/60`,
            children: [
              (0, scope.W.jsxs)(`p`, {
                className: `flex items-center gap-1.5 text-xs font-medium text-ink-900 dark:text-ink-50`,
                children: [
                  (0, scope.W.jsx)(scope.pe, { className: `size-3.5 shrink-0` }),
                  a || r ? `已保存签到流程` : `还没有学习签到流程`,
                  a &&
                    !r &&
                    (0, scope.W.jsx)(`span`, {
                      className: `text-[10px] text-amber-700 dark:text-amber-400`,
                      children: `（未启用，仅保留记录）`,
                    }),
                ],
              }),
              (0, scope.W.jsx)(`p`, {
                className: `mt-1.5 text-[11px] leading-relaxed text-ink-800/60 dark:text-ink-100/50`,
                children: `本站只保存一套签到流程，现有和新增账号共用。其他站点拥有各自的流程，即使地址使用同一域名也互不继承。`,
              }),
              (0, scope.W.jsx)(`p`, {
                className: `mt-1.5 text-[11px] leading-relaxed text-ink-800/60 dark:text-ink-100/50`,
                children: a
                  ? `任一账号重新学习都会更新本站共用流程，其他账号下次执行直接使用新流程。新增账号只需使用自己的凭据正常登录并确认身份，无需重新学习；也可切回自动识别，保留记录但不执行。`
                  : `本站尚未录制时可以使用自动识别。需要录制时，在任一账号旁点「学习本站流程」，手动登录并完成一次签到后保存；本站其他账号无需重复学习。`,
              }),
              a &&
                (0, scope.W.jsx)(`div`, {
                  className: `mt-2 flex flex-wrap gap-2`,
                  children: r
                    ? (0, scope.W.jsx)(`button`, {
                        type: `button`,
                        className: `rounded-md px-2 py-1 text-[11px] font-medium text-ink-800/80 ring-1 ring-black/10 hover:bg-black/5 dark:text-ink-100/80 dark:ring-white/15 dark:hover:bg-white/10`,
                        onClick: () => n({ method: `auto`, workflowReplayDisabled: !0 }),
                        children: `自动识别（自主签到）`,
                      })
                    : o.length === 0
                      ? (0, scope.W.jsx)(`button`, {
                          type: `button`,
                          className: `rounded-md px-2 py-1 text-[11px] font-medium text-brand-700 ring-1 ring-brand-500/30 hover:bg-brand-500/10 dark:text-brand-300`,
                          onClick: () => n({ method: `workflow`, workflowReplayDisabled: !1 }),
                          children: `重新启用学习流程回放`,
                        })
                      : null,
                }),
              (a || r) &&
                (0, scope.W.jsxs)(`details`, {
                  className: `mt-3 rounded-lg border border-black/5 p-2.5 dark:border-white/10`,
                  children: [
                    (0, scope.W.jsxs)(`summary`, {
                      className: `cursor-pointer text-[11px] font-medium text-brand-700 dark:text-brand-300`,
                      children: [
                        `查看保存的流程（`,
                        s.length,
                        ` 个步骤 · `,
                        c.length,
                        ` 个页面）`,
                        o.length > 0 && ` · 需要重新学习`,
                      ],
                    }),
                    o.length > 0
                      ? (0, scope.W.jsxs)(`p`, {
                          role: `alert`,
                          className: `mt-2 text-[11px] leading-relaxed text-amber-700 dark:text-amber-400`,
                          children: [
                            `已保存的流程需要修正后才能回放：`,
                            o.join(`；`),
                            `。可重新学习；选择自动识别时不执行此记录，也不受此错误影响。`,
                          ],
                        })
                      : (0, scope.W.jsxs)(`div`, {
                          className: `mt-2 space-y-3 text-[11px] leading-relaxed text-ink-800/70 dark:text-ink-100/60`,
                          children: [
                            (0, scope.W.jsxs)(`div`, {
                              children: [
                                (0, scope.W.jsx)(`p`, {
                                  className: `font-medium`,
                                  children: `登录后的页面路线`,
                                }),
                                c.length > 0
                                  ? (0, scope.W.jsx)(`ol`, {
                                      className: `mt-1 space-y-1`,
                                      children: c.map((e, t) =>
                                        (0, scope.W.jsxs)(
                                          `li`,
                                          { className: `break-all`, children: [t + 1, `. `, e] },
                                          `${t}-${e}`,
                                        ),
                                      ),
                                    })
                                  : (0, scope.W.jsx)(`p`, {
                                      className: `mt-1`,
                                      children: `未单独记录路线，从登录后的页面开始执行步骤。`,
                                    }),
                              ],
                            }),
                            (0, scope.W.jsxs)(`div`, {
                              children: [
                                (0, scope.W.jsx)(`p`, {
                                  className: `font-medium`,
                                  children: `到达签到页后执行`,
                                }),
                                (0, scope.W.jsx)(scope.No, { steps: s }),
                              ],
                            }),
                          ],
                        }),
                  ],
                }),
            ],
          }),
          u &&
            (0, scope.W.jsx)(`p`, {
              className: `text-[11px] leading-relaxed text-ink-800/50 dark:text-ink-100/40`,
              children: `本站已有的签到适配设置会继续使用；只有主动切换方式或保存新的学习流程才会更改。`,
            }),
          h &&
            (0, scope.W.jsxs)(`div`, {
              className: `space-y-2`,
              children: [
                (0, scope.W.jsx)(scope.Q, {
                  label: `签到时填写的文本`,
                  hint: `学习会记住填写动作，但不会保存当时输入的内容；回放时统一填写这里的文本，本站账号共用。`,
                  children: (0, scope.W.jsx)(`textarea`, {
                    rows: 3,
                    className: `w-full rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-900 outline-none ring-1 ring-black/5 transition-shadow placeholder:text-ink-800/30 focus:ring-2 focus:ring-brand-500/50 dark:bg-ink-900 dark:text-ink-50 dark:ring-white/10 dark:placeholder:text-ink-100/25`,
                    placeholder: `填写本站签到表单需要的内容`,
                    value: d,
                    onChange: (e) => n({ claimText: e.target.value }),
                  }),
                }),
                (0, scope.W.jsx)(`p`, {
                  className: (0, scope.R)(
                    `text-[11px]`,
                    (m && p === 0) || g
                      ? `text-amber-700 dark:text-amber-400`
                      : `text-ink-800/50 dark:text-ink-100/40`,
                  ),
                  children:
                    m && p === 0
                      ? `已保存流程包含填写动作，请补充文本后再执行。`
                      : `当前 ${p} 字${g ? `，少于 ${f} 字，站点可能不接受` : ``}`,
                }),
              ],
            }),
          (0, scope.W.jsxs)(`details`, {
            className: `rounded-xl border border-black/5 p-3 dark:border-white/10`,
            children: [
              (0, scope.W.jsx)(`summary`, {
                className: `cursor-pointer text-[11px] text-ink-800/60 dark:text-ink-100/50`,
                children: `补充签到判定`,
              }),
              (0, scope.W.jsx)(`div`, {
                className: `mt-3`,
                children: (0, scope.W.jsx)(scope.Q, {
                  label: `「已签到」判定词`,
                  hint: `可选，逗号分隔。留空用内置词表（已签到、重复签到…）`,
                  children: (0, scope.W.jsx)(`input`, {
                    className: scope.$,
                    placeholder: `已签到, 重复签到`,
                    value: (e.checkin?.alreadyText ?? []).join(`, `),
                    onChange: (e) =>
                      n({
                        alreadyText: e.target.value
                          .split(`,`)
                          .map((e) => e.trim())
                          .filter(Boolean),
                      }),
                  }),
                }),
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
        scope.Tn = 30;
        break;
      }
      case 1: {
        scope.En = 3e4;
        break;
      }
      case 2: {
        scope.Dn = 4;
        break;
      }
      case 3: {
        scope.On = 300;
        break;
      }
      case 4: {
        scope.kn = 200;
        break;
      }
      case 5: {
        scope.An = 1e4;
        break;
      }
      case 6: {
        scope.jn = 12;
        break;
      }
      case 7: {
        scope.Mn = new Set([
          `Enter`,
          `Space`,
          `Escape`,
          `Tab`,
          `ArrowUp`,
          `ArrowDown`,
          `ArrowLeft`,
          `ArrowRight`,
        ]);
        break;
      }
      case 8: {
        scope.Nn = new Set([`click`, `double`, `right`, `long-press`]);
        break;
      }
      case 9: {
        scope.Pn = new Set([`text`, `select`, `checkbox`, `radio`]);
        break;
      }
      case 10: {
        (scope.Z.SITE_UNAVAILABLE,
          scope.Z.NETWORK_FAILURE,
          scope.Z.PAGE_TIMEOUT,
          scope.Z.AUTH_EXPIRED);
        break;
      }
      case 11: {
        scope.pa = {
          complete: `完整性自检：已录全`,
          partial: `完整性自检：可用，但有需要注意的地方`,
          incomplete: `完整性自检：还差内容`,
        };
        break;
      }
      case 12: {
        scope.Ca = {
          navigation: `打开`,
          scroll: `滚动`,
          click: `点击`,
          drag: `拖动`,
          fill: `填写`,
        };
        break;
      }
      case 13: {
        scope.wa = `动作`;
        break;
      }
      case 14: {
        scope.La = {
          violet: {
            box: `rounded-lg bg-violet-50 px-2 py-1.5 dark:bg-violet-950/40`,
            title: `text-violet-800 dark:text-violet-200`,
            row: `text-violet-700/80 dark:text-violet-300/80`,
          },
          slate: {
            box: `rounded-lg bg-slate-100 px-2 py-1.5 dark:bg-slate-800/70`,
            title: `text-slate-700 dark:text-slate-200`,
            row: `text-slate-600 dark:text-slate-300`,
          },
        };
        break;
      }
    }
  },
  storeProperties: {},
});
