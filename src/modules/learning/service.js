/** 学习签到后台：录制会话、步骤生成、路线学习与目标账号身份观察。 */
import { bgAccountsState } from '../accounts/service.js';
import { bgSitesState } from '../sites/service.js';
import { bgCheckinState } from '../checkin/service.js';
import { bgSliderState } from '../slider/service.js';
import { bgProxiesState } from '../proxies/service.js';
import { bgPlatformState } from '../../shared/background-platform.js';
import { bgEntryState } from '../../entries/background.js';

export const bgLearningState = { store: {} };

function Qn(e) {
  let t = e.trim(),
    n = t.startsWith(`text=`) ? t.slice(5).trim() : t;
  return Array.from(n).slice(0, bgLearningState.Zn).join(``);
}

function $n(e) {
  let t = e;
  return (
    !!t &&
    t.type === `drag` &&
    typeof t.selector == `string` &&
    typeof t.toSelector == `string` &&
    typeof t.path == `string` &&
    typeof t.at == `number` &&
    Number.isFinite(t.at)
  );
}

function er(e) {
  if (e.dragToSelector) return `把「${Qn(e.selector)}」拖到「${Qn(e.dragToSelector)}」`;
  let t =
      e.gesture === `double`
        ? `双击`
        : e.gesture === `right`
          ? `右键`
          : e.gesture === `long-press`
            ? `长按`
            : e.key
              ? `按 ${e.key} 键`
              : `点击`,
    n = e.anchor
      ? `（落点 ${Math.round(e.anchor.rx * 100)}%, ${Math.round(e.anchor.ry * 100)}%）`
      : ``;
  return `${t}「${Qn(e.selector)}」${n}`;
}

function tr(e) {
  let t = e,
    n = $n(t) ? t : void 0;
  if (n)
    return {
      kind: `drag`,
      text: `把「${Qn(n.selector)}」拖到「${Qn(n.toSelector)}」`,
      path: n.path,
      at: n.at,
    };
  switch (e.type) {
    case `navigation`:
      return { kind: `navigation`, text: `进入页面 ${e.path}`, path: e.path, at: e.at };
    case `click`:
      return { kind: e.dragToSelector ? `drag` : `click`, text: er(e), path: e.path, at: e.at };
    case `fill`: {
      let t = Qn(e.selector);
      return {
        kind: `fill`,
        text:
          e.control === `select`
            ? `在「${t}」选择第 ${(e.choice ?? 0) + 1} 项`
            : e.control === `checkbox` || e.control === `radio`
              ? `${e.checked ? `勾选` : `取消勾选`}「${t}」`
              : `在「${t}」填写内容`,
        path: e.path,
        at: e.at,
      };
    }
    case `drag`:
      return {
        kind: `drag`,
        text: `把「${Qn(e.selector)}」拖到「${Qn(e.toSelector)}」`,
        path: e.path,
        at: e.at,
      };
    case `scroll`: {
      let t = Math.round(e.ratio * 100);
      return {
        kind: `scroll`,
        text: e.container ? `滚动「${Qn(e.container)}」到 ${t}%` : `滚动页面到 ${t}%`,
        path: e.path,
        at: e.at,
      };
    }
    default:
      return null;
  }
}

function nr(e) {
  return e
    .map(tr)
    .filter((e) => e !== null)
    .slice(-20);
}

function bu(e, t) {
  let n = e.domain.replace(/^\./, ``).toLowerCase();
  return t === n || t.endsWith(`.${n}`);
}

function xu(e) {
  return [e.storeId, e.domain, e.path, e.name, JSON.stringify(e.partitionKey ?? null)].join(`\0`);
}

function Su(e, t) {
  return `${e.secure ? `https:` : t.protocol}//${e.domain.replace(/^\./, ``)}${(e.path.startsWith(`/`) ? e.path : `/${e.path}`) || `/`}`;
}

async function Cu(e, t) {
  let n = new Map();
  for (let r of bgSliderState.yu(e)) {
    let i = await chrome.cookies.getAll({ domain: r, ...(t ? { storeId: t } : {}) });
    for (let t of i) bu(t, e) && n.set(xu(t), t);
  }
  return n;
}

async function wu(e, t) {
  let n = new URL(t),
    r = n.hostname.toLowerCase();
  if (n.protocol !== `https:` && n.protocol !== `http:`)
    throw Error(`站点地址不是 HTTP(S)，不能清理 Cookie`);
  let i = (await chrome.cookies.getAllCookieStores()).find((t) => t.tabIds.includes(e))?.id,
    a = await Cu(r, i);
  for (let e of a.values())
    try {
      await chrome.cookies.remove({
        url: Su(e, n),
        name: e.name,
        storeId: e.storeId,
        ...(e.partitionKey ? { partitionKey: e.partitionKey } : {}),
      });
    } catch {}
  let o = await Cu(r, i),
    s = [...a.keys()].filter((e) => o.has(e)).length;
  return { matched: a.size, removed: a.size - s, failed: o.size };
}

function Eu(e) {
  return e.replace(bgLearningState.Tu, ``) || `/`;
}

function Du(e) {
  try {
    let t = new URL(e, `https://learning.invalid`),
      n = t.hash.slice(1),
      r = Eu(n.startsWith(`/`) ? n : t.pathname);
    return (
      !/(?:^|\/)(?:login|sign-?in|auth|oauth|register|password)(?:\/|$)/i.test(r) &&
      /^\/(?:dashboard|console|profile|personal|account|user|me|check-?in|daily|rewards?|lottery|draw|prize)(?:\/|$)/i.test(
        r,
      )
    );
  } catch {
    return !1;
  }
}

function Ou(e) {
  try {
    let t = new URL(e, `https://learning.invalid`),
      n = t.hash.slice(1),
      r = Eu(n.startsWith(`/`) ? n : t.pathname);
    return (
      r === `/` ||
      /^\/(?:home|index|main|app|apps|workspace|panel|overview|portal|hub|center|member|vip|admin)(?:\/|$)/i.test(
        r,
      )
    );
  } catch {
    return !1;
  }
}

function ku(e) {
  return e !== `login`;
}

function Au(e) {
  let t = e.indexOf(`#`);
  if (t < 0) return ``;
  let n = e.slice(t + 1);
  return n.startsWith(`/`) ? n : ``;
}

function Iu(e) {
  return (
    bgLearningState.Fu.test(e.split(/[?#]/)[0] ?? ``) ||
    bgLearningState.Fu.test(Au(e).split(`?`)[0] ?? ``)
  );
}

function Hu(e) {
  let t = e.path;
  return typeof t == `string` && t.trim() ? t : void 0;
}

function Uu(e) {
  let t = Au(e);
  return bgLearningState.ju.test(e) || (!!t && bgLearningState.ju.test(t));
}

function Wu(e) {
  let t = Au(e);
  return bgLearningState.Mu.test(e) || (!!t && bgLearningState.Mu.test(t));
}

function Gu(e) {
  let t = (e) =>
      bgLearningState.Nu.test(e) || (bgLearningState.Fu.test(e) && !bgLearningState.Pu.test(e)),
    n = Au(e);
  return t(e) || (!!n && t(n));
}

function Ku(e) {
  if (Wu(Hu(e) ?? ``)) return !0;
  if (e.type === `navigation` || (e.type !== `click` && e.type !== `fill`)) return !1;
  if (bgLearningState.Lu.test((e.label ?? ``).trim())) return !0;
  if (e.type !== `click`) return !1;
  let t = e.href;
  if (typeof t != `string` || !t.trim()) return !1;
  try {
    return Wu(new URL(t, `https://learning.invalid`).pathname);
  } catch {
    return !1;
  }
}

function qu(e) {
  let t = (e.label ?? ``).trim();
  if (t && bgLearningState.zu.test(t)) return !0;
  let n = e.href,
    r = Hu(e);
  if (typeof n != `string` || !n.trim() || !r) return !1;
  try {
    return new URL(n, `https://learning.invalid`).pathname !== r;
  } catch {
    return !1;
  }
}

function Ju(e) {
  let t = (e.label ?? ``).trim();
  return !!t && bgLearningState.zu.test(t);
}

function Yu(e) {
  if (e.type === `click`) {
    let t = Hu(e);
    return (t && Uu(t)) ||
      (e.loginAction && !(e.loginAction === `submit` && bgLearningState.Ru.test(e.label ?? ``))) ||
      Ku(e) ||
      Ju(e)
      ? `none`
      : e.evidence?.kind === `already`
        ? `already`
        : e.evidence?.kind === `success`
          ? `confirmed`
          : qu(e)
            ? `none`
            : e.label && bgLearningState.Ru.test(e.label)
              ? `action`
              : `none`;
  }
  if (e.type === `fill` || e.type === `drag`) {
    let t = e.afterText ?? [];
    if (t.some((e) => bgLearningState.Bu.test(e))) return `already`;
    if (t.some((e) => bgLearningState.Vu.test(e))) return `confirmed`;
  }
  return `none`;
}

function Zu(e) {
  let t = [];
  for (let n of e) {
    let e = Hu(n);
    e && e !== t[t.length - 1] && t.push(e);
  }
  return t;
}

function Qu(e) {
  return e.filter((e) => e.type !== `navigation`).length;
}

function $u(e, t) {
  let n = `login`,
    r = `none`,
    i = !1,
    a = !1,
    o = !1,
    s = !1,
    c = !1,
    l = !1,
    u = !1,
    d = !1;
  for (let f of e) {
    if (Ku(f)) {
      ((i = !0),
        (n = `login`),
        (r = `none`),
        (a = !1),
        (o = !1),
        (s = !1),
        (c = !1),
        (u = !1),
        (l = !1),
        (d = !1));
      continue;
    }
    let e = Hu(f),
      p = !!e && Uu(e);
    (p && (u = !0), f.type === `fill` && (f.fieldRole !== void 0 || (p && f.hasValue)) && (a = !0));
    let m = s || c;
    if (
      (f.type === `click` && f.loginAction === `submit` && (s = !0),
      f.type === `click` && f.loginAction === `oauth` && (c = !0),
      f.type === `fill` && f.key === `Enter` && (f.fieldRole === `password` || p) && (s = !0),
      !ku(t))
    ) {
      (c || (a && s)) && ((n = `done`), (i = !1));
      continue;
    }
    if (p) continue;
    (e && Iu(e) && (d = !0), e && u && (l = !0));
    let h = !!e && Du(e),
      g = !!e && Gu(e);
    ((h || g || m || l) && (o = !0),
      i && o && (m || a) && (i = !1),
      n === `login` && o && (n = `profile`),
      n === `profile` && g && (n = `checkin`));
    let _ = Yu(f);
    _ !== `none` &&
      bgLearningState.Xu[_] > bgLearningState.Xu[r] &&
      ((r = _), n === `login` && (n = `profile`), n === `profile` && (n = `checkin`), (n = `done`));
  }
  let f = e[e.length - 1],
    p = f ? Hu(f) : void 0;
  return {
    kind: t,
    stage: n,
    ...(p ? { path: p } : {}),
    pages: Zu(e).length,
    actions: Qu(e),
    checkin: r,
    credentials: a,
    signedIn: o,
    login: c || (a && s),
    logout: i,
    loginAsCheckinAvailable: ku(t) && o && !i && r === `none` && !d,
  };
}

function ed(e, t) {
  return $u(e, t).loginAsCheckinAvailable;
}

function cd(e, t) {
  return ku(e)
    ? t === `login`
      ? `请登录`
      : t === `profile`
        ? `已检测到登录成功，请前往能显示当前账号的页面`
        : t === `checkin`
          ? `请完成一次签到`
          : `已录到签到动作`
    : t === `done`
      ? `已录到登录动作`
      : `请登录`;
}

function ld(e) {
  let t = e.kind === `login`,
    n = t ? 2 : 4,
    r = t
      ? e.stage === `done`
        ? 2
        : 1
      : e.stage === `login`
        ? 1
        : e.stage === `profile`
          ? 2
          : e.stage === `checkin`
            ? 3
            : 4,
    i = bgLearningState.td[r - 1] ?? ``,
    a = e.stage === `done`,
    o = t ? bgLearningState.sd[e.stage] : bgLearningState.ad[e.stage],
    s = (t ? bgLearningState.rd : bgLearningState.nd).map((e, t) => ({
      label: e,
      state: t + 1 < r ? `done` : t + 1 === r ? `current` : `todo`,
    }));
  return {
    step: r,
    total: n,
    title: `${i} ${cd(e.kind, e.stage)}${a ? `，可以点「结束学习」了` : ``}`,
    hint: !t && e.loginAsCheckinAvailable ? `${o}；${bgLearningState.od}` : o,
    steps: s,
    ...(e.logout ? { warning: bgLearningState.id } : {}),
  };
}

function Id(e) {
  return bgLearningState.Fd.test(e) ? `` : e;
}

function Ld(e, t) {
  if (t.trim())
    try {
      let n = new URL(t, e.loginUrl),
        r = new URL(e.loginUrl).origin;
      return n.origin === r ? `${n.pathname}${Id(n.hash)}` : void 0;
    } catch {
      return;
    }
}

function Rd(e) {
  let t = e.afterText;
  return Array.isArray(t)
    ? t
        .filter((e) => typeof e == `string`)
        .map((e) => e.replace(/\s+/g, ` `).trim())
        .filter(Wf)
        .slice(0, 6)
    : [];
}

function zd(e) {
  if (!e || (e.kind !== `success` && e.kind !== `already`) || !Array.isArray(e.words)) return;
  let t = e.words.filter((e) => typeof e == `string` && Wf(e)).slice(0, 4);
  return t.length ? { kind: e.kind, words: t } : void 0;
}

function Bd(e) {
  return /\[href\s*[*^$|~]?=\s*["']?([^"'\]]+)["']?\]/i.exec(e)?.[1];
}

function Vd(e) {
  if (!e) return !1;
  let t = e.scrollBeforeY;
  return typeof t == `number`
    ? Number.isFinite(t) && t > 0
    : e.scrollPageTop === !0 && t === void 0;
}

function Hd(e) {
  if (typeof e != `string`) return;
  let t = e.trim();
  return t && t.length <= 300 && !t.includes(`text=`) && !tp(t) ? t : void 0;
}

function Ud(e) {
  let t = e.scrollBeforeY,
    n = Hd(e.scrollContainer),
    r = n ? { scrollContainer: n } : {};
  return typeof t == `number` && Number.isFinite(t) && t > 0
    ? { scrollBeforeY: Math.min(Math.round(t), bgLearningState._d), ...r }
    : e.scrollPageTop === !0
      ? { scrollPageTop: !0, ...r }
      : {};
}

function Wd(e) {
  return ef(e)
    ? {
        [bgLearningState.vd]: !0,
        ...(e.scrollContainer ? { scrollContainer: e.scrollContainer } : {}),
      }
    : {};
}

function Gd(e) {
  let t = e.href ?? Bd(e.selector ?? ``);
  if (t)
    try {
      let e = new URL(t, `https://placeholder.invalid`);
      if (bgLearningState.Md.test(`${e.pathname}${e.search}`)) return !0;
    } catch {}
  return e.kind === `fill` && bgLearningState.Nd.test(`${e.selector ?? ``} ${e.label ?? ``}`)
    ? !0
    : bgLearningState.Pd.test((e.label ?? ``).trim());
}

function Kd(e) {
  return e.fieldRole === `username` || e.fieldRole === `password`
    ? !0
    : e.kind === `click`
      ? e.loginAction === `oauth` ||
        !(
          e.loginAction !== `submit` ||
          bgLearningState.Sd.test(e.label ?? ``) ||
          (e.href && !bgLearningState.Md.test(e.href))
        )
      : !1;
}

function qd(e) {
  return `${e.type}|${e.selector}|${e.path}|${e.at}`;
}

function Jd(e) {
  let t = [],
    n = new Map();
  for (let r of e) {
    if (r.type === `navigation`) continue;
    if (r.type === `scroll`) {
      let e = r.ratio;
      if (!Number.isFinite(e) || e <= 0 || e > 1) continue;
      let n = t.at(-1);
      if (
        n?.kind === `scroll` &&
        J(n.path) === J(r.path) &&
        (n.scrollContainer ?? ``) === (r.container ?? ``) &&
        Math.abs((n.ratio ?? 0) - Math.min(1, Math.max(0, e))) <= 0.02
      )
        continue;
      t.push({
        kind: `scroll`,
        path: r.path,
        ratio: Math.min(1, Math.max(0, e)),
        ...(r.container ? { scrollContainer: r.container } : {}),
        at: r.at,
      });
      continue;
    }
    if (r.type === `drag`) {
      let e = r.selector.trim(),
        n = r.toSelector.trim();
      if (!e || !n) continue;
      let i = t[t.length - 1];
      if (
        i?.kind === `drag` &&
        i.selector === e &&
        i.toSelector === n &&
        i.path === r.path &&
        i.at === r.at
      ) {
        let e = Rd(r),
          t = zd(r.evidence);
        (e.length && (i.afterText = e), t && (i.evidence = t), Vd(r) && Object.assign(i, Ud(r)));
        continue;
      }
      let a = Rd(r),
        o = zd(r.evidence);
      t.push({
        kind: `drag`,
        selector: e,
        toSelector: n,
        label: r.label ?? ``,
        path: r.path,
        ...(r.anchor ? { anchor: r.anchor } : {}),
        ...(r.toAnchor ? { toAnchor: r.toAnchor } : {}),
        ...(a.length ? { afterText: a } : {}),
        ...(o ? { evidence: o } : {}),
        ...(Vd(r) ? Ud(r) : {}),
        at: r.at,
      });
      continue;
    }
    let e = r.selector?.trim();
    if (!e) continue;
    let i = r.type === `click` ? zd(r.evidence) : void 0,
      a = n.get(qd(r));
    if (a !== void 0) {
      let e = t[a],
        n = Rd(r);
      (n.length && (e.afterText = n),
        i && (e.evidence = i),
        r.type === `fill` && (e.hasValue = r.hasValue),
        Vd(r) && Object.assign(e, Ud(r)));
      continue;
    }
    let o = Rd(r),
      s = {
        kind: r.type,
        selector: e,
        label: r.label ?? ``,
        path: r.path,
        ...(r.type === `click` && r.href ? { href: r.href } : {}),
        ...(r.type === `fill` ? { hasValue: r.hasValue } : {}),
        ...(r.type === `fill` && r.fieldRole ? { fieldRole: r.fieldRole } : {}),
        ...(r.type === `click` && r.anchor ? { anchor: r.anchor } : {}),
        ...(r.type === `click` && r.gesture ? { gesture: r.gesture } : {}),
        ...(r.type === `click` && r.key ? { key: r.key } : {}),
        ...(r.type === `click` && typeof r.holdMs == `number` ? { holdMs: r.holdMs } : {}),
        ...(r.type === `click` && r.dragToSelector ? { dragToSelector: r.dragToSelector } : {}),
        ...(r.type === `click` && r.dragToAnchor ? { dragToAnchor: r.dragToAnchor } : {}),
        ...(r.type === `click` && r.loginAction ? { loginAction: r.loginAction } : {}),
        ...(r.fingerprint ? { fingerprint: r.fingerprint } : {}),
        ...(r.type === `fill` && r.control ? { control: r.control } : {}),
        ...(r.type === `fill` && typeof r.choice == `number` ? { choice: r.choice } : {}),
        ...(r.type === `fill` && typeof r.checked == `boolean` ? { checked: r.checked } : {}),
        ...(o.length ? { afterText: o } : {}),
        ...(i ? { evidence: i } : {}),
        ...(Vd(r) ? Ud(r) : {}),
        at: r.at,
      };
    if (s.kind !== `scroll` && (Gd(s) || Kd(s))) continue;
    let c = t.at(-1);
    c &&
    c.selector === s.selector &&
    c.kind === s.kind &&
    c.path === s.path &&
    Math.abs(s.at - c.at) <= bgLearningState.gd &&
    !s.gesture &&
    !s.key &&
    !c.gesture &&
    !c.key
      ? (s.evidence && (c.evidence = s.evidence),
        s.afterText && (c.afterText = s.afterText),
        s.scrollBeforeY !== void 0 && (c.scrollBeforeY = s.scrollBeforeY),
        s.scrollPageTop && (c.scrollPageTop = !0),
        s.scrollContainer && (c.scrollContainer = s.scrollContainer),
        n.set(qd(r), t.length - 1))
      : (n.set(qd(r), t.length), t.push(s));
  }
  return t.filter((e) => e.kind !== `fill` || e.hasValue !== !1);
}

function Yd(e) {
  let t = e.indexOf(`#`);
  return (t >= 0 ? e.slice(0, t) : e) || `/`;
}

function J(e) {
  try {
    let t = new URL(e, `https://placeholder.invalid`);
    return `${t.pathname || `/`}${Id(t.hash)}`;
  } catch {
    return e.trim() || `/`;
  }
}

function Zd(e) {
  if (!Du(e.loginUrl))
    try {
      let t = new URL(e.loginUrl);
      return t.hash
        ? `${t.pathname}${t.hash}`
        : t.pathname && t.pathname !== `/`
          ? t.pathname
          : void 0;
    } catch {
      return;
    }
}

function Qd(e, t) {
  let n = Zd(e);
  if (n && (n.includes(`#`) ? t === n : Yd(t) === n)) return !0;
  let r = t.includes(`#`) ? t.slice(t.indexOf(`#`) + 1) : ``;
  return bgLearningState.Xd.test(Yd(t)) || (r.startsWith(`/`) && bgLearningState.Xd.test(r));
}

function $d(e, t) {
  return Ld(e, t.path) ?? Ld(e, t.href ?? ``);
}

function ef(e) {
  return typeof e.scrollBeforeY == `number`
    ? Number.isFinite(e.scrollBeforeY) && e.scrollBeforeY > 0
    : e.scrollPageTop === !0;
}

function tf(e, t) {
  if (t.kind !== `click`) return !1;
  if (bgLearningState.Dd.test(t.label ?? ``)) return !0;
  let n = t.href ? Ld(e, t.href) : void 0;
  return !!n && J(n) !== J(t.path);
}

function nf(e, t, n) {
  let r = [],
    i = (t) => {
      t && !Qd(e, t) && r.at(-1) !== t && r.push(t);
    },
    a = n.filter((t) => {
      let n = $d(e, t);
      return !!n && !Qd(e, n);
    }),
    o = [...a].reverse().find((e) => !!e.evidence),
    s = [...a]
      .reverse()
      .find((e) => bgLearningState.Sd.test(e.label ?? ``) || bgLearningState.Cd.test(e.path)),
    c = a.at(-1),
    l = o ?? s ?? c;
  if (l && !o) {
    let t = l.href ? Ld(e, l.href) : void 0;
    if ((t && J(t) !== J(l.path)) || (!s && tf(e, l))) return [];
  }
  let u = l ? $d(e, l) : void 0;
  if (!l || !u) return [];
  let d = [];
  for (let n of t)
    n.type !== `navigation` || n.at > l.at || d.push({ at: n.at, page: Ld(e, n.path) });
  for (let t of a) t.at > l.at || d.push({ at: t.at, page: $d(e, t) });
  d.sort((e, t) => e.at - t.at);
  for (let e of d) i(e.page);
  return (r.at(-1) !== u && r.push(u), df(r));
}

function rf(e, t) {
  try {
    let n = new URL(e, `https://placeholder.invalid`),
      r = n.hash.startsWith(`#`) ? n.hash.slice(1) : n.hash;
    return t(n.pathname) || (r.startsWith(`/`) && t(r));
  } catch {
    return t(e);
  }
}

function of(e) {
  return bgLearningState.Ed.test(e) && !bgLearningState.af.test(e);
}

function sf(e) {
  return rf(e, (e) => bgLearningState.Td.test(e) && !of(e));
}

function cf(e) {
  return rf(e, of);
}

function lf(e, t, n) {
  let r = n.at(-1);
  if (!r) return;
  let i = t
    .filter((e) => e.kind === `click` && bgLearningState.wd.test(e.label ?? ``) && !!e.href)
    .map((t) => ({ action: t, path: Ld(e, t.href ?? ``) }))
    .find(
      ({ action: t, path: n }) => !!n && n !== r && n !== $d(e, t) && !Qd(e, n) && !cf(n),
    )?.path;
  if (i) return i;
  let a = n.slice(0, -1).filter((t) => sf(t) && !Qd(e, t));
  return (
    (a.find((e) => rf(e, (e) => bgLearningState.af.test(e))) ?? a[0]) || (Qd(e, r) ? void 0 : r)
  );
}

function uf(e, t) {
  if (!t || e.length === 0 || e.includes(t)) return e;
  let n = e.at(-1),
    r = [...e.slice(0, -1), t, n];
  return r.length <= bgLearningState.yd ? r : [...r.slice(-12, -2), t, n];
}

function df(e) {
  return e.length <= bgLearningState.yd ? e : [...e.slice(0, 11), e[e.length - 1]];
}

function ff(e) {
  let t = [];
  for (let n of e) {
    let e = t.at(-1);
    e && J(e[0].path) === J(n.path) ? e.push(n) : t.push([n]);
  }
  return t;
}

function pf(e, t, n = bgLearningState.xd) {
  let r = J(t.at(-1) ?? e.at(-1)?.path ?? ``),
    i = (e) => (e.length ? ff(e).filter((e) => J(e[0].path) !== r).length : 0),
    a = e;
  for (; a.length > 0 && a.length + i(a) > bgLearningState.bd - n;) a = a.slice(1);
  let o = ff(a),
    s = bgLearningState.bd - n - a.length - i(a),
    c = new Set();
  for (let e = a.length - 1; e >= 0 && c.size < s; --e) a[e].afterText?.length && c.add(e);
  let l = [],
    u = 0;
  for (let e of o) {
    let t = [];
    for (let n of e) {
      let e = Wd(n);
      if (n.kind === `scroll`)
        (t.push({
          type: `scroll`,
          ratio: n.ratio ?? 0,
          ...(n.scrollContainer ? { container: n.scrollContainer } : {}),
        }),
          (u += 1));
      else if (n.selector) {
        if (n.kind === `drag`) {
          if (!n.toSelector) continue;
          let e = Wd(n);
          (t.push({
            type: `drag`,
            selector: n.selector,
            toSelector: n.toSelector,
            ...(n.anchor ? { anchor: n.anchor } : {}),
            ...(n.toAnchor ? { toAnchor: n.toAnchor } : {}),
            ...e,
          }),
            (u += 1));
        } else
          n.kind === `click` && n.dragToSelector
            ? (t.push({
                type: `drag`,
                selector: n.selector,
                ...(n.anchor ? { anchor: n.anchor } : {}),
                toSelector: n.dragToSelector,
                ...(n.dragToAnchor ? { toAnchor: n.dragToAnchor } : {}),
                ...(n.scrollContainer ? { scrollContainer: n.scrollContainer } : {}),
                ...(n.scrollBeforeY !== void 0 || n.scrollPageTop ? { scrollIntoView: !0 } : {}),
              }),
              (u += 1))
            : (t.push(
                n.kind === `fill`
                  ? {
                      type: `fill`,
                      selector: n.selector,
                      value: `{{claimText}}`,
                      ...e,
                      ...(n.control ? { control: n.control } : {}),
                      ...(n.choice === void 0 ? {} : { choice: n.choice }),
                      ...(n.checked === void 0 ? {} : { checked: n.checked }),
                      ...(n.fingerprint ? { fingerprint: n.fingerprint } : {}),
                    }
                  : {
                      type: `click`,
                      selector: n.selector,
                      ...e,
                      ...(n.anchor ? { anchor: n.anchor } : {}),
                      ...(n.gesture ? { gesture: n.gesture } : {}),
                      ...(n.key ? { key: n.key } : {}),
                      ...(n.holdMs === void 0 ? {} : { holdMs: n.holdMs }),
                      ...(n.fingerprint ? { fingerprint: n.fingerprint } : {}),
                    },
              ),
              c.has(u) &&
                n.afterText &&
                t.push({ type: `assert`, text: n.afterText, optional: !0, timeoutMs: 5e3 }),
              (u += 1));
      }
    }
    e[0] && J(e[0].path) !== r
      ? l.push({ type: `if`, condition: { type: `path`, pattern: J(e[0].path) }, then: t })
      : l.push(...t);
  }
  return l;
}

function hf(e) {
  let t = new Set();
  for (let n of e ?? []) {
    let e = n?.trim().toLowerCase();
    if (!e) continue;
    e.length >= bgLearningState.mf && t.add(e);
    let r = e.indexOf(`@`);
    r >= bgLearningState.mf && t.add(e.slice(0, r));
  }
  if (t.size === 0) return () => !1;
  let n = /[\p{L}\p{N}._+@-]/u;
  return (e) => {
    let r = e?.toLowerCase();
    if (!r) return !1;
    for (let e of t)
      for (let t = r.indexOf(e); t >= 0; t = r.indexOf(e, t + 1)) {
        let i = r[t - 1],
          a = r[t + e.length];
        if ((!i || !n.test(i)) && (!a || !n.test(a))) return !0;
      }
    return !1;
  };
}

function gf(e, t) {
  if (e.kind === `scroll` || e.evidence || bgLearningState.Sd.test(e.label ?? ``)) return e;
  let n = { ...e };
  if (n.afterText) {
    let e = n.afterText.filter((e) => !t(e));
    e.length ? (n.afterText = e) : delete n.afterText;
  }
  if (n.fingerprint) {
    let e = { ...n.fingerprint };
    (t(e.text) && delete e.text,
      t(e.aria) && delete e.aria,
      Object.keys(e).some((e) => e !== `tag`) ? (n.fingerprint = e) : delete n.fingerprint);
  }
  return n;
}

function _f(e, t, n = {}) {
  let r = t.reduce((e, t, n) => (Ku(t) ? n : e), -1),
    i = r >= 0 ? t.slice(r + 1) : [...t],
    a = hf(n.personalTexts),
    o = Jd(i)
      .filter((t) => {
        let n = $d(e, t);
        return !!n && !Qd(e, n);
      })
      .map((e) => gf(e, a));
  if (o.length === 0) return null;
  let s = nf(e, i, o),
    c = lf(e, o, s),
    l = uf(s, c),
    u = o.some((e) => bgCheckinState.Ds.test(e.label ?? ``)),
    d = pf(o, l, bgLearningState.xd + (u ? 3 : 0)),
    f = [...o].reverse().find((e) => e.evidence)?.evidence,
    p = u ? bgCheckinState.Ts : f?.kind === `success` ? f.words : bgLearningState.Od,
    m = u ? bgCheckinState.Es : f?.kind === `already` ? f.words : bgLearningState.kd;
  return (
    u &&
      (d.push({ type: `assert`, text: [...p, ...m], timeoutMs: 15e3 }),
      d.unshift({
        type: `if`,
        condition: { type: `text`, words: bgCheckinState.Es },
        then: [{ type: `assert`, text: bgCheckinState.Es, result: `already` }],
      })),
    d.push({
      type: `if`,
      condition: { type: `text`, words: p },
      then: [{ type: `assert`, text: p, result: `success`, timeoutMs: 5e3 }],
      else: [{ type: `assert`, text: m, result: u ? `success` : `already`, timeoutMs: 5e3 }],
    }),
    {
      workflow: l.length ? { steps: d, route: l, ...(c ? { identityPath: c } : {}) } : { steps: d },
      eventCount: t.length,
    }
  );
}

function vf(e, t, n = `both`, r = {}) {
  let i = t.length,
    a = wf(e, t),
    o = n !== `login` && r.loginAsCheckin === !0,
    s = o && ed(t, n === `checkin` ? `checkin` : `both`),
    c = n !== `login` && ed(t, n === `checkin` ? `checkin` : `both`),
    l = null;
  if (n !== `login`) {
    if (s) l = { kind: `login-as-checkin` };
    else {
      let n = _f(e, t, { personalTexts: r.personalTexts })?.workflow ?? null;
      n?.identityPath && (l = { kind: `workflow`, workflow: n });
    }
  }
  let u = [];
  return (
    n === `login`
      ? a || u.push(`还没有录到完整的登录动作；请手动完成登录后再结束学习`)
      : !a && !l
        ? u.push(
            c
              ? `这次演示还没有录到任何登录或签到动作。若本站是「登录即签到」（登录成功后自动完成、页面上没有签到按钮），在账号行点「登录即签到」即可保存完整流程；否则请继续在原页面演示：完成一遍登录并点到签到按钮，再点「结束学习」；本次学习还在继续，不需要重新开始`
              : `这次演示还没有录到任何登录或签到动作。请先在打开的站点页面里完成一遍登录、并点到签到按钮，再点「结束学习」；本次学习还在继续，不需要重新开始`,
          )
        : a
          ? l ||
            u.push(
              c
                ? `没有录到签到动作：若本站是「登录即签到」（登录成功后自动完成、页面上没有签到按钮），在账号行点「登录即签到」即可保存完整流程；否则请在签到按钮可点时重新演示一次`
                : `没有录到登录之后的签到动作，这次只保存登录配置；请在按钮可点时重新演示一次签到`,
            )
          : u.push(`没有录到完整的登录动作（账号/密码字段或第三方登录入口），这次只保存签到流程`),
    o &&
      !s &&
      u.push(
        `这次演示还不满足「登录即签到」的保存条件（需要先登录成功进入站内页面，且没有点到签到按钮），已按普通签到流程处理`,
      ),
    { login: a, checkin: l, eventCount: i, notices: u }
  );
}

function yf(e, t, n) {
  if (n !== !1) return !1;
  let r = $u(e, t);
  if (!r.loginAsCheckinAvailable) return !1;
  let i = [...e]
    .reverse()
    .map(Hu)
    .find((e) => !!e);
  if (!i) return !1;
  let a;
  for (let t = e.length - 1; t >= 0; --t) {
    let n = e[t];
    if (n.type !== `fill`) continue;
    let r = Hu(n);
    if (r && (n.fieldRole !== void 0 || (n.hasValue && Uu(r)))) {
      a = r;
      break;
    }
  }
  let o = r.login && Ou(i) && i !== a;
  return Gu(i) || Du(i) || o;
}

function bf(e) {
  return (
    e.intent !== `login` &&
    !e.loginAsCheckinRequested &&
    !e.alreadyPrompted &&
    e.loginAsCheckinPossible &&
    !!e.artifacts.login &&
    !e.artifacts.checkin
  );
}

function Sf(e) {
  return (
    e.intent !== `login` &&
    !e.alreadyPrompted &&
    e.artifacts.checkin?.kind === `workflow` &&
    e.checkinEvidence === `none`
  );
}

function wf(e, t) {
  let n = (e) => {
      let t = e.trim();
      if (!(t.length === 0 || t.length > 300) && !tp(t)) return t;
    },
    r = (t) => !!Ld(e, t.path),
    i = (e) => [...t].reverse().find((t) => t.type === `fill` && t.fieldRole === e && r(t)),
    a = i(`username`),
    o = i(`password`),
    s = {},
    c = (t) => {
      let n = Ld(e, t);
      if (!n) return;
      let r = new URL(n, e.loginUrl).href;
      r === new URL(e.loginUrl).href ? delete s.loginUrl : (s.loginUrl = r);
    },
    l = (i, a) => {
      let o = [],
        s = new Map();
      for (let e of t) {
        if (e.type !== `click` && e.type !== `fill`) continue;
        let t = JSON.stringify([e.type, e.at, e.path, e.selector]),
          n = s.get(t);
        s.set(t, { ...n, ...e });
      }
      for (let t of [...s.values()].sort((e, t) => e.at - t.at)) {
        if (t.at >= i) break;
        if (J(t.path) !== J(a) || !r(t) || t.type !== `click` || t.loginAction !== `entry`) {
          o.length = 0;
          continue;
        }
        let s = n(t.selector);
        s && (!t.href || Ld(e, t.href)) && o.push(s);
      }
      return o;
    },
    u = (n, i) => {
      let a = t.filter(
        (t) =>
          t.type === `click` &&
          t.loginAction === `entry` &&
          t.at < n &&
          r(t) &&
          (!t.href || !!Ld(e, t.href)),
      );
      if (i !== void 0) {
        let e = [...a].reverse().find((e) => J(e.path) === i);
        if (e) return e;
      }
      return a[0];
    };
  if (a?.type === `fill` && o?.type === `fill` && a.hasValue && o.hasValue) {
    let i = n(a.selector),
      d = n(o.selector);
    if (i && d) {
      ((s.loginMethod = `form`), c(a.path));
      let f = [...t]
          .reverse()
          .find(
            (t) =>
              t.type === `click` &&
              t.loginAction === `submit` &&
              t.at >= o.at &&
              r(t) &&
              (!t.href || !!Ld(e, t.href)),
          ),
        p = f?.type === `click` ? n(f.selector) : void 0;
      s.selectors = { username: i, password: d, ...(p ? { submit: p } : {}) };
      let m = Math.min(a.at, o.at),
        h = u(m, J(a.path));
      if (h?.type === `click`) {
        let e = n(h.selector);
        e && (s.preLoginClickSelector = e);
      }
      let g = l(m, a.path);
      g.length > 1 && (s.preLoginClickSelectors = g);
    }
  }
  let d = [...t].reverse().find((e) => e.type === `click` && e.loginAction === `oauth` && r(e));
  if (d?.type === `click`) {
    let i = n(d.selector);
    if (i) {
      ((s.loginMethod = `oauth`),
        c(d.path),
        (s.oauthButtonSelector = i),
        delete s.preLoginClickSelectors);
      if (/github/i.test(`${d.label ?? ``} ${d.selector} ${d.href ?? ``}`))
        s.oauthProvider = `github`;
      let a = [...t]
          .reverse()
          .find(
            (n) =>
              n.type === `click` &&
              n.loginAction === `entry` &&
              n.at < d.at &&
              r(n) &&
              J(n.path) === J(d.path) &&
              (!n.href || !!Ld(e, n.href)) &&
              !t.some((e) => e.type === `fill` && e.at > n.at && e.at < d.at),
          ),
        o = a?.type === `click` ? n(a.selector) : void 0;
      o ? (s.preLoginClickSelector = o) : delete s.preLoginClickSelector;
      let u = l(d.at, d.path);
      u.length > 1 && (s.preLoginClickSelectors = u);
    }
  }
  return Object.keys(s).length ? s : null;
}

function Tf(e, t = Date.now()) {
  return !Number.isFinite(e.createdAt) || t - e.createdAt > 18e5;
}

function Ef(e, t) {
  return e.find((e) => e.accountId !== t.accountId && e.siteId === t.siteId) ?? null;
}

function Df(e, t) {
  let n = Ef(e, t);
  return n ? { allowed: !1, conflict: n } : { allowed: !0 };
}

function Of(e, t = Date.now()) {
  let n = [],
    r = [];
  for (let [i, a] of e) {
    if (!i.startsWith(`learn:`) || !a || typeof a != `object`) continue;
    let e = a;
    if (
      typeof e.runId != `string` ||
      typeof e.accountId != `string` ||
      !Number.isFinite(e.createdAt)
    )
      continue;
    let o = typeof e.tabId == `number` ? e.tabId : Number(i.slice(6)),
      s = { ...e, tabId: o };
    (Tf(s, t) ? r : n).push(s);
  }
  return { active: n, expired: r };
}

function kf(e) {
  return JSON.stringify(e, (e, t) =>
    !t || typeof t != `object` || Array.isArray(t)
      ? t
      : Object.fromEntries(Object.entries(t).sort(([e], [t]) => e.localeCompare(t))),
  );
}

function Af(e) {
  if (e?.method !== `none`)
    return {
      ok: !1,
      error: `学到的「登录即签到」没有写入站点配置（签到方式未生效），旧配置未改动，请重试`,
    };
  let t = e?.workflow;
  return t && Array.isArray(t.steps) && t.steps.length > 0
    ? {
        ok: !1,
        error: `学到的「登录即签到」仍保留旧签到步骤，自动签到可能跳错页面；旧配置未改动，请重试`,
      }
    : [
          `entry`,
          `url`,
          `buttonSelector`,
          `alreadySelector`,
          `successSelector`,
          `claimConfirmSelector`,
          `apiUrl`,
          `logoutApiUrl`,
          `claimEntrySelector`,
          `claimInputSelector`,
          `claimSubmitSelector`,
        ].some((t) => e?.[t] !== void 0)
      ? {
          ok: !1,
          error: `学到的「登录即签到」仍保留旧签到入口配置，自动签到可能跳错页面；旧配置未改动，请重试`,
        }
      : { ok: !0 };
}

function jf(e, t) {
  let n = t?.method;
  if (!t || n !== `workflow`)
    return { ok: !1, error: `学到的流程未启用回放（当前是自动识别或其它签到方式），请重试` };
  let r = t.workflow;
  if (r?.steps?.length !== e.steps.length)
    return {
      ok: !1,
      error: `学到的流程未完整写入站点配置（步骤数不一致），旧配置未改动，请重试`,
    };
  if (kf(r.steps) !== kf(e.steps))
    return { ok: !1, error: `学到的动作或滚动配置未完整写入站点配置，请重试` };
  let i = e.route;
  if (i?.length) {
    let e = r.route;
    if (!Array.isArray(e) || e.length !== i.length || e.some((e, t) => e !== i[t]))
      return {
        ok: !1,
        error: `学到的页面路线未写入站点配置（自动签到将找不到签到页），旧配置未改动，请重试`,
      };
  }
  return r.identityPath === e.identityPath
    ? { ok: !0 }
    : { ok: !1, error: `学到的个人资料身份核验路径未写入站点配置，旧配置未改动，请重试` };
}

function Mf(e, t, n = Date.now()) {
  return Tf(e, n)
    ? { ok: !1, error: `学习会话已过期，请重新开始学习`, expired: !0 }
    : e.events.length >= 100
      ? { ok: !1, error: `学习事件已达到上限`, expired: !1 }
      : { ok: !0, learning: { ...e, events: [...e.events, t] } };
}

function Nf(e) {
  if (!Array.isArray(e)) return;
  let t = e
    .filter((e) => typeof e == `string`)
    .map((e) => e.replace(/\s+/g, ` `).trim())
    .filter((e) => !!e && e.length <= 60 && Wf(e))
    .slice(0, 6);
  return t.length ? t : void 0;
}

function Pf(e) {
  let t = {},
    n = e.scrollBeforeY;
  (typeof n == `number` &&
    Number.isFinite(n) &&
    n >= 0 &&
    n <= 1e6 &&
    (t.scrollBeforeY = Math.round(n)),
    e.scrollPageTop === !0 && (t.scrollPageTop = !0));
  let r = Hd(e.scrollContainer);
  return (r && (t.scrollPageTop || (t.scrollBeforeY ?? 0) > 0) && (t.scrollContainer = r), t);
}

function Ff(e) {
  try {
    let t = new URL(e, `https://learning.invalid`);
    return `${t.pathname || `/`}${Id(t.hash)}`.slice(0, 500);
  } catch {
    return (e.split(/[?#]/, 1)[0] ?? ``).slice(0, 500) || `/`;
  }
}

function If(e) {
  if (!(typeof e != `string` || e.length > 1e3))
    try {
      let t = new URL(e, `https://learning.invalid`);
      return t.protocol !== `http:` && t.protocol !== `https:`
        ? void 0
        : ((t.username = ``),
          (t.password = ``),
          (t.search = ``),
          (t.hash = ``),
          `${t.origin}${t.pathname}`.slice(0, 1e3));
    } catch {
      return;
    }
}

function Lf(e) {
  if (!e || typeof e != `object`) return;
  let { rx: t, ry: n } = e;
  if (typeof t != `number` || !Number.isFinite(t) || typeof n != `number` || !Number.isFinite(n))
    return;
  let r = (e) => Math.min(1, Math.max(0, e));
  return { rx: r(t), ry: r(n) };
}

function Rf(e) {
  if (!e || typeof e != `object`) return;
  let t = e,
    n = (e) => {
      let n = t[e];
      return typeof n == `string` && n.trim() && n.length <= 200 ? n.trim() : void 0;
    },
    r = {},
    i = n(`tag`);
  i && (r.tag = i);
  let a = n(`aria`);
  a && (r.aria = a);
  let o = n(`name`);
  o && (r.name = o);
  let s = n(`testId`);
  s && (r.testId = s);
  let c = n(`inputType`);
  c && (r.inputType = c);
  let l = n(`text`);
  l && (r.text = l);
  let u = n(`role`);
  return (u && (r.role = u), Object.keys(r).length ? r : void 0);
}

function Bf(e) {
  return e === `click` || e === `double` || e === `right` || e === `long-press` ? e : void 0;
}

function Vf(e) {
  return typeof e == `string` && bgLearningState.zf.has(e) ? e : void 0;
}

function Hf(e) {
  if (typeof e != `string`) return;
  let t = e.trim();
  if (!(!t || t.length > 300) && !tp(t)) return t;
}

function Uf(e) {
  if (!e || typeof e != `object` || !Number.isFinite(e.at)) return null;
  if (e.type === `navigation`)
    return typeof e.path == `string` && e.path.length <= 500
      ? { type: `navigation`, path: Ff(e.path), at: e.at }
      : null;
  if (e.type === `scroll`) {
    let t = e.ratio;
    if (
      typeof e.path != `string` ||
      e.path.length > 500 ||
      typeof t != `number` ||
      !Number.isFinite(t) ||
      t <= 0 ||
      t > 1
    )
      return null;
    let n = Hd(e.container);
    return {
      type: `scroll`,
      path: Ff(e.path),
      ratio: Math.min(1, Math.max(0, t)),
      ...(n ? { container: n } : {}),
      at: e.at,
    };
  }
  if (e.type === `drag`) {
    let t = e,
      n = Hf(t.selector),
      r = Hf(t.toSelector);
    if (
      !n ||
      !r ||
      typeof t.label != `string` ||
      t.label.length > 100 ||
      typeof t.path != `string` ||
      t.path.length > 500
    )
      return null;
    let i = Lf(e.anchor),
      a = Lf(e.toAnchor),
      o = Pf(e),
      s = Nf(e.afterText),
      c = e.evidence,
      l = c && typeof c == `object` ? zd(c) : void 0;
    return {
      type: `drag`,
      selector: n,
      toSelector: r,
      label: t.label.trim().slice(0, 100),
      path: Ff(t.path),
      ...o,
      ...(i ? { anchor: i } : {}),
      ...(a ? { toAnchor: a } : {}),
      ...(s ? { afterText: s } : {}),
      ...(l ? { evidence: l } : {}),
      at: e.at,
    };
  }
  if (
    (e.type !== `click` && e.type !== `fill`) ||
    typeof e.selector != `string` ||
    !e.selector.trim() ||
    e.selector.length > 300 ||
    typeof e.label != `string` ||
    e.label.length > 100 ||
    typeof e.path != `string` ||
    e.path.length > 500
  )
    return null;
  let t = Nf(e.afterText),
    n = Pf(e),
    r = e.label.trim().slice(0, 100),
    i = Ff(e.path),
    a = e.selector.trim();
  if (e.type === `fill`) {
    let o = Rf(e.fingerprint),
      s = Vf(e.key);
    return {
      type: `fill`,
      selector: a,
      label: r,
      path: i,
      hasValue: e.hasValue === !0,
      ...(e.fieldRole === `username` || e.fieldRole === `password`
        ? { fieldRole: e.fieldRole }
        : {}),
      ...(t ? { afterText: t } : {}),
      ...n,
      ...(o ? { fingerprint: o } : {}),
      ...(s ? { key: s } : {}),
      at: e.at,
    };
  }
  let o =
      e.evidence &&
      (e.evidence.kind === `success` || e.evidence.kind === `already`) &&
      Array.isArray(e.evidence.words)
        ? {
            kind: e.evidence.kind,
            words: e.evidence.words.filter((e) => typeof e == `string` && Wf(e)).slice(0, 4),
          }
        : void 0,
    s = Lf(e.anchor),
    c = Bf(e.gesture),
    l = Vf(e.key),
    u = e.holdMs,
    d = typeof u == `number` && Number.isFinite(u) && u > 0 && u <= 6e4 ? Math.round(u) : void 0,
    f = Lf(e.dragToAnchor),
    p = Rf(e.fingerprint),
    m = e.dragToSelector,
    h =
      typeof m == `string` && m.trim() && m.length <= 300 && !m.includes(`text=`) && !tp(m.trim())
        ? m.trim()
        : void 0;
  return {
    type: `click`,
    selector: a,
    label: r,
    path: i,
    ...(If(e.href) ? { href: If(e.href) } : {}),
    ...(e.loginAction === `entry` || e.loginAction === `submit` || e.loginAction === `oauth`
      ? { loginAction: e.loginAction }
      : {}),
    ...(o ? { evidence: o } : {}),
    ...(t ? { afterText: t } : {}),
    ...n,
    ...(s ? { anchor: s } : {}),
    ...(c ? { gesture: c } : {}),
    ...(l ? { key: l } : {}),
    ...(d === void 0 ? {} : { holdMs: d }),
    ...(h ? { dragToSelector: h } : {}),
    ...(f ? { dragToAnchor: f } : {}),
    ...(p ? { fingerprint: p } : {}),
    at: e.at,
  };
}

function Wf(e) {
  return !(
    !e ||
    e.length > 60 ||
    /@[\w-]+\.[\w-]+/.test(e) ||
    /\d{6,}/.test(e) ||
    /eyJ[\w-]{6,}|bearer\s|password|token|secret|密码/i.test(e) ||
    /\b(?:sk|pk|ghp|gho|ghu|ghs|glpat|xox[baprs])[-_][A-Za-z0-9]/i.test(e) ||
    e.match(/[A-Za-z0-9]{20,}/g)?.some((e) => /[A-Za-z]/.test(e) && /\d/.test(e))
  );
}

function Zf(e) {
  return e.length < bgLearningState.Xf || !/^[0-9a-f]+$/i.test(e)
    ? !1
    : /\d/.test(e) && /[a-f]/i.test(e);
}

function Qf(e) {
  let t = e.trim();
  return !bgLearningState.Gf.test(t) ||
    bgLearningState.Kf.test(t) ||
    bgLearningState.qf.test(t) ||
    bgLearningState.Jf.test(t) ||
    bgLearningState.Yf.test(t)
    ? !0
    : t.split(/[-_]/).some(Zf);
}

function tp(e) {
  let t = e.trim();
  if (!t) return !1;
  if (bgLearningState.ep.test(t)) return !0;
  for (let e of t.split(`>>`))
    if (!e.trim().startsWith(`text=`)) {
      for (let t of e.matchAll(bgLearningState.$f)) if (Qf(t[1])) return !0;
    }
  return !1;
}

function np(e) {
  if (!e) return null;
  try {
    let t = new URL(e.loginUrl).origin;
    return t && t !== `null` ? t : null;
  } catch {
    return null;
  }
}

function rp(e, t) {
  if (!t || !e) return !1;
  try {
    return new URL(e).origin === t;
  } catch {
    return !1;
  }
}

function ip(e, t) {
  let n = {};
  return (
    e.loginMethod && (n.loginMethod = e.loginMethod),
    e.loginUrl && (n.loginUrl = e.loginUrl),
    e.selectors && (n.selectors = { ...t.selectors, ...e.selectors }),
    (e.loginMethod === `form` || e.loginMethod === `oauth`) &&
      (n.preLoginClickSelectors = e.preLoginClickSelectors ?? []),
    e.loginMethod === `oauth`
      ? (e.oauthButtonSelector && (n.oauthButtonSelector = e.oauthButtonSelector),
        (n.preLoginClickSelector = e.preLoginClickSelector?.trim() || ``))
      : e.loginMethod === `form`
        ? ((n.preLoginClickSelector = e.preLoginClickSelector?.trim() || ``),
          (n.oauthButtonSelector = ``))
        : (e.preLoginClickSelector && (n.preLoginClickSelector = e.preLoginClickSelector),
          e.oauthButtonSelector && (n.oauthButtonSelector = e.oauthButtonSelector)),
    n
  );
}

function sp(e, t) {
  if (!t) return { ok: !1, error: `学习登录配置写入后无法读回站点` };
  if (e.loginMethod !== `form` && e.loginMethod !== `oauth`)
    return { ok: !1, error: `学习登录配置缺少可回放的登录方式` };
  if (e.loginMethod === `form` && (!e.selectors?.username || !e.selectors?.password))
    return { ok: !1, error: `学习登录配置不完整（缺少账号或密码字段）` };
  if (e.loginMethod === `oauth` && !e.oauthButtonSelector)
    return { ok: !1, error: `学习登录配置不完整（缺少 OAuth 按钮）` };
  if (e.loginUrl && t.loginUrl !== e.loginUrl)
    return { ok: !1, error: `学习登录配置写入后登录页面不一致` };
  if (
    JSON.stringify(t.preLoginClickSelectors ?? []) !==
    JSON.stringify(e.preLoginClickSelectors ?? [])
  )
    return { ok: !1, error: `学习登录配置写入后前置点击顺序不一致` };
  for (let t of [
    ...(e.preLoginClickSelectors ?? []),
    e.preLoginClickSelector,
    e.oauthButtonSelector,
  ])
    if (t && tp(t)) return { ok: !1, error: `学习登录配置包含不可回放的选择器` };
  for (let [n, r] of Object.entries(e.selectors ?? {})) {
    if (typeof r != `string` || !r.trim() || tp(r))
      return { ok: !1, error: `学习登录配置包含不可回放的选择器：${n}` };
    if (t.selectors?.[n] !== r)
      return { ok: !1, error: `学习登录配置写入后字段选择器不一致：${n}` };
  }
  return t.loginMethod === e.loginMethod
    ? e.loginMethod === `oauth`
      ? t.oauthButtonSelector === e.oauthButtonSelector
        ? (t.preLoginClickSelector ?? ``) === (e.preLoginClickSelector?.trim() || ``)
          ? { ok: !0 }
          : { ok: !1, error: `学习登录配置写入后 OAuth 入口不一致（不允许旧表单入口残留）` }
        : { ok: !1, error: `学习登录配置写入后 OAuth 按钮不一致` }
      : (t.preLoginClickSelector ?? ``) === (e.preLoginClickSelector?.trim() || ``)
        ? (t.oauthButtonSelector ?? ``) === ``
          ? { ok: !0 }
          : { ok: !1, error: `学习登录配置写入后仍残留旧 OAuth 入口` }
        : { ok: !1, error: `学习登录配置写入后登录入口不一致` }
    : { ok: !1, error: `学习登录配置写入后登录方式不一致` };
}

function cp(e) {
  switch (e) {
    case `缺少用户名输入框选择器`:
      return `站点还没配置登录表单：缺少账号（用户名）输入框选择器`;
    case `缺少密码输入框选择器`:
      return `站点还没配置登录表单：缺少密码输入框选择器`;
    case `缺少登录按钮选择器`:
      return `站点还没配置登录表单：缺少登录按钮选择器`;
    default:
      return e;
  }
}

function lp(e) {
  return `这次学到的内容没有写入站点：站点自己的配置还不完整（${cp(e)}）。请先在该站点的设置里补齐登录方式与字段选择器，再回到这个页面点「结束学习」；本次学习还在继续，不需要重新开始`;
}

function up(e) {
  let { saved: t, notices: n, failures: r, siteConfigBlockers: i } = e;
  if (t.length === 0)
    return i.length > 0
      ? { ok: !1, error: lp(i[0]) }
      : { ok: !1, error: r[0] ?? n[0] ?? `这次演示没有录到可保存的内容` };
  let a = [...n];
  return (
    i.length > 0 && a.push(`有内容没能保存：站点自己的配置还不完整（${cp(i[0])}）`),
    r.length > 0 &&
      a.push(
        `这次没有保存完整：另一半保存失败（原因：${r[0]}）。已保存的部分不受影响、会继续生效；本次学习已结束，失败的那半需要重新学习才能补上`,
      ),
    { ok: !0, notices: a }
  );
}

function mp(e, t) {
  return Array.isArray(e) ? e.filter((e) => typeof e == `string` && t.includes(e)) : [];
}

function hp(e, t) {
  let n = t === `success` ? bgLearningState.fp : bgLearningState.pp,
    r = new Set();
  for (let i of e) {
    let e = i.type === `click` ? i.evidence : void 0;
    if (e?.kind === t) for (let t of mp(e.words, n)) r.add(t);
  }
  return [...r];
}

function gp(e) {
  return e.some((e) => {
    let t = Yu(e);
    return t === `confirmed` || t === `already`;
  });
}

function _p(e) {
  return {
    username: e.some((e) => e.type === `fill` && e.fieldRole === `username`),
    password: e.some((e) => e.type === `fill` && e.fieldRole === `password`),
  };
}

function vp() {
  return { status: `warn`, text: `⚠️ 这次演示点了「退出登录」：会话已经断开，建议重新演示一遍` };
}

function yp(e) {
  let t = _p(e),
    n = e.some((e) => e.type === `click` && e.loginAction === `oauth`);
  return t.username && t.password
    ? [{ status: `ok`, text: `✅ 登录配置已学会（表单：用户名/密码已识别）` }]
    : n
      ? [{ status: `ok`, text: `✅ 登录配置已学会（第三方登录入口已识别）` }]
      : t.username || t.password
        ? [
            {
              status: `warn`,
              text: `⚠️ 只录到其中一个字段：账号或密码字段没被识别，自动登录可能填不全`,
            },
          ]
        : [{ status: `missing`, text: `⚠️ 没有录到登录动作（账号/密码字段或第三方登录入口）` }];
}

function bp(e, t) {
  return t.credentials && t.signedIn
    ? {
        status: `ok`,
        text: `✅ 登录配置已学会（表单：在登录页录到了账号/密码输入，并成功进入站内页面）`,
      }
    : t.credentials
      ? {
          status: `warn`,
          text: `⚠️ 登录部分可能学不全：只看到登录页上的输入，没看到登录成功（离开登录页）`,
        }
      : {
          status: `ok`,
          text: `ℹ️ 本次没有录到登录步骤（开始学习时可能已经是登录状态），只更新签到流程`,
        };
}

function xp(e, t) {
  if (t.checkin === `none`) return null;
  let n = hp(e, `success`);
  return n.length > 0
    ? { status: `ok`, text: `✅ 已录到「签到成功」证据（词：${n.join(`、`)}）` }
    : hp(e, `already`).length > 0 || t.checkin === `already`
      ? { status: `warn`, text: `⚠️ 页面显示今天已经签到：这遍录到的流程按「已完成」处理` }
      : gp(e)
        ? { status: `ok`, text: `✅ 已录到页面的签到结果提示` }
        : {
            status: `warn`,
            text: `⚠️ 没有录到「签到成功」证据 —— 可能是当天已签到，或你没点到真正的签到按钮`,
          };
}

function Ep(e, t) {
  return (t && t !== `form` && t !== `auto`) || (e.loginMethod ?? `form`) !== `form`
    ? !0
    : !!(
        e.selectors?.username?.trim() &&
        e.selectors?.password?.trim() &&
        e.selectors?.submit?.trim()
      );
}

function Dp(e, t) {
  return !e.credentials && !e.login && !t
    ? { status: `missing`, text: bgLearningState.Cp }
    : e.signedIn
      ? !e.login && !e.credentials
        ? { status: `warn`, text: bgLearningState.Tp }
        : { status: `ok`, text: bgLearningState.Sp }
      : { status: `warn`, text: bgLearningState.wp };
}

function Ap(e, t, n = {}) {
  let r = $u(e, t),
    i = [],
    a = e.some((e) => Iu(e.path));
  if (t === `login`) i.push(...yp(e));
  else if ((i.push(bp(e, r)), n.loginAsCheckin)) i.push(Dp(r, n.hasStoredLoginConfig === !0));
  else if (n.siteCheckinMethod === `none` && r.checkin === `none` && !a)
    i.push({ status: `ok`, text: bgLearningState.kp });
  else if (r.checkin === `none`)
    (i.push({
      status: `missing`,
      text: a
        ? `❌ 没有录到签到动作（抽奖站需要演示实际抽奖，只有进入页面不算学会）`
        : `❌ 没有录到签到动作（没有点到签到/领取按钮）`,
    }),
      r.loginAsCheckinAvailable && i.push({ status: `warn`, text: bgLearningState.Op }));
  else {
    let t = Zu(e).length;
    i.push({ status: `ok`, text: `✅ 签到流程已学会（经过 ${t} 个页面、${r.actions} 个动作）` });
    let n = xp(e, r);
    n && i.push(n);
  }
  return (r.logout && i.push(vp()), Mp(i, t, n));
}

function jp(e) {
  return e.some((e) => e.status === `missing`)
    ? `incomplete`
    : e.some((e) => e.status === `warn`)
      ? `partial`
      : `complete`;
}

function Mp(e, t, n = {}) {
  n.saveFailed === !0 &&
    e.push({ status: `missing`, text: `❌ 有内容没能保存成功，本次结论按「还差内容」处理` });
  let r = jp(e);
  return {
    verdict: r,
    lines: e,
    summary:
      r === `complete`
        ? n.loginAsCheckin
          ? `已按「登录即签到」学会，可以放心使用`
          : t === `login`
            ? `登录配置已学会，可以放心使用`
            : `登录配置与签到流程都已学会`
        : r === `partial`
          ? `已学会的内容可用，但有需要留意的地方`
          : `这次演示还不够，先别指望它自动签到`,
    warnings: e.filter((e) => e.status !== `ok`).map((e) => e.text.replace(bgLearningState.dp, ``)),
  };
}

function Kp(e, t, n) {
  return e.filter((account) => account.siteId === n.id);
}

function Jp(e) {
  return [
    e.username,
    e.githubUsername,
    e.identity?.username,
    e.identity?.displayName,
    e.identity?.email,
  ].filter((e) => typeof e == `string` && e.trim().length > 0);
}

function Yp(e) {
  return e === `login` ? `登录` : `登录与签到`;
}

async function Pm(e) {
  const account = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find(
    (item) => item.id === e.accountId,
  );
  if (!account || account.siteId !== e.siteId) return null;
  const sites = await bgPlatformState.t.get(bgPlatformState.r.sites, []);
  return np(bgSitesState.Y(e.siteId, sites));
}

async function Fm(e, t) {
  return rp(t.url ?? t.tab?.url, await Pm(e));
}

async function recordLearningIdentity(observation, sender, runId) {
  const tabId = sender.tab?.id;
  if (tabId == null || !bgProxiesState.Xn(sender.frameId))
    return { ok: false, error: '只能从学习标签页的顶层页面读取用户 ID' };
  const session = await bgPlatformState.n.get(bgLearningState.a(tabId), null);
  if (!session || session.runId !== runId) return { ok: false, error: '学习会话已结束' };
  if (!(await Fm(session, sender)))
    return { ok: false, error: '用户 ID 来自本站之外的页面，已忽略' };
  const account = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find(
    (item) => item.id === session.accountId,
  );
  if (!account || account.siteId !== session.siteId)
    return { ok: false, error: '学习目标账号归属已改变' };
  const identity = observation?.identity;
  if (
    identity?.source !== 'visible' ||
    typeof identity.userId !== 'string' ||
    !/^\d{1,12}$/.test(identity.userId)
  )
    return { ok: true, ignored: true };
  let currentPath;
  try {
    const url = new URL(sender.url ?? sender.tab.url);
    currentPath = url.pathname + url.hash;
  } catch {
    return { ok: true, ignored: true };
  }
  if (observation.path !== currentPath || currentPath.length > 500)
    return { ok: true, ignored: true };
  const login = [...session.events]
    .reverse()
    .find(
      (event) =>
        event.loginAction === 'submit' ||
        event.loginAction === 'oauth' ||
        (event.type === 'fill' && event.fieldRole === 'password' && event.key === 'Enter'),
    );
  if (!login && account.identity?.userId !== identity.userId) return { ok: true, ignored: true };
  if (login && Ff(login.path) === Ff(currentPath)) return { ok: true, ignored: true };
  const previous = session.learnedIdentities?.[currentPath];
  const clean = { userId: identity.userId, source: 'visible', verifiedByLearning: true };
  for (const field of ['username', 'email'])
    if (
      typeof identity[field] === 'string' &&
      identity[field].trim() &&
      identity[field].length <= 160
    )
      clean[field] = identity[field].trim();
  const value = {
    identity: clean,
    loginAt: login?.at,
    conflict:
      previous?.conflict === true || (!!previous && previous.identity.userId !== clean.userId),
  };
  await bgPlatformState.n.set(bgLearningState.a(tabId), {
    ...session,
    learnedIdentities: { ...session.learnedIdentities, [currentPath]: value },
  });
  return { ok: true };
}

async function prepareLearnedAccountIdentity(session, account, site, workflow) {
  if (!workflow?.identityPath) return null;
  const url = new URL(workflow.identityPath, site.loginUrl);
  if (!bgCheckinState.N(site, url.href)) throw Error('学习的身份核验页不在本站');
  const sample = session.learnedIdentities?.[url.pathname + url.hash];
  if (!sample) return null;
  if (sample.conflict) throw Error('学习期间身份核验页出现过不同用户 ID，请确认目标账号后重新学习');
  const identity = sample.identity;
  const accounts = await bgPlatformState.t.get(bgPlatformState.r.accounts, []),
    sites = await bgPlatformState.t.get(bgPlatformState.r.sites, []);
  const current = accounts.find((item) => item.id === account.id);
  if (!current || current.siteId !== site.id) throw Error('学习目标账号归属已改变');
  if (current.identity?.userId && current.identity.userId !== identity.userId)
    throw Error('学习页用户 ID 与本账号原有绑定不符，已保留原绑定，请确认当前登录账号');
  const conflict = Kp(accounts, sites, site).find(
    (item) => item.id !== account.id && item.identity?.userId === identity.userId,
  );
  if (conflict) throw Error('学习页用户 ID 已绑定给本站其他账号，已保留原有账号数据');
  return identity;
}

async function Im(e, i, o = {}) {
  let s = await bgProxiesState.Mm(e);
  if (!s) {
    let n = await bgPlatformState.t.get(bgPlatformState.r.accounts, []),
      a = n.find((t) => t.id === e);
    if (!a) return { ok: !1, error: `账号不存在` };
    let o = Of(Object.entries(await chrome.storage.session.get(null))).active,
      s = Df(o, { accountId: e, siteId: a.siteId, kind: i });
    if (!s.allowed) {
      let e = n.find((e) => e.id === s.conflict.accountId);
      return {
        ok: !1,
        error: `本站账号「${e?.label || e?.username || s.conflict.accountId}」正在学习${Yp(s.conflict.kind ?? `checkin`)}流程；同站点只能有一条录制，请先结束或放弃那条学习`,
      };
    }
  }
  if (s) {
    let c = s.kind ?? `checkin`,
      l = c === `login` ? `login` : `both`;
    if (i && i !== c && (i !== `both` || c !== `checkin`))
      return {
        ok: !1,
        error: `该账号正在进行${c === `login` ? `登录` : `登录与签到`}学习，请先结束或放弃当前学习`,
      };
    let u = await bgPlatformState.t.get(bgPlatformState.r.accounts, []),
      d = u.find((t) => t.id === e),
      f = await bgPlatformState.t.get(bgPlatformState.r.sites, []),
      p = d ? bgSitesState.Y(s.siteId, f) : void 0;
    if (!d || !p) return { ok: !1, error: `学习目标账号或站点不存在` };
    if (d.siteId !== s.siteId)
      return { ok: !1, error: `学习账号已移到其他站点，本次录制不能写入其他站点的流程` };
    let m = await zm(s.tabId, s.runId);
    if (!m.ok) return { ok: !1, error: m.error ?? `学习动作尚未保存，请返回学习标签页后重试` };
    let h = m.challengeSeen === !0,
      _ = s.tabId,
      v = s.runId,
      y = await bgLearningState.qp.run(async () => {
        let e = await bgPlatformState.n.get(bgLearningState.a(_), null);
        if (!e || e.runId !== v) return null;
        let t = { ...e, challengeSeen: h };
        return (await bgPlatformState.n.set(bgLearningState.a(_), t), t);
      });
    if (!y) return { ok: !1, error: `学习会话已结束，请重新开始` };
    s = y;
    let b = o.loginAsCheckin === !0,
      configuredLoginAsCheckin = p.checkin?.method === `none`,
      S = b || configuredLoginAsCheckin;
    if (b && l === `login`)
      return {
        ok: !1,
        error: `本次只学登录，不产出签到流程；「登录即签到」请用「学习本站流程」完成`,
      };
    if (b && !ed(s.events, c))
      return {
        ok: !1,
        error: `还不能按「登录即签到」保存：需要先登录成功并进入站内页面，且本次演示没有点到过签到按钮。请继续演示（或点「结束学习」按现有内容保存）`,
      };
    let C = Jp(d),
      w = vf(p, s.events, l, { loginAsCheckin: S, personalTexts: C }),
      T =
        w.checkin?.kind === `login-as-checkin`
          ? (_f(p, s.events, { personalTexts: C })?.workflow ?? null)
          : null,
      E = s.endLearningPrompted === !0,
      D = bf({
        intent: l,
        loginAsCheckinRequested: b,
        artifacts: w,
        loginAsCheckinPossible: ed(s.events, c),
        alreadyPrompted: E,
      })
        ? bgLearningState.xf
        : Sf({
              intent: l,
              artifacts: w,
              checkinEvidence: $u(s.events, c).checkin,
              alreadyPrompted: E,
            })
          ? bgLearningState.Cf
          : null;
    if (D)
      return (await bgLearningState.qp.run(async () => {
        let e = await bgPlatformState.n.get(bgLearningState.a(_), null);
        return !e || e.runId !== v
          ? !1
          : (await bgPlatformState.n.set(bgLearningState.a(_), { ...e, endLearningPrompted: !0 }),
            !0);
      }))
        ? { ok: !1, error: D }
        : { ok: !1, error: `学习会话已结束，请重新开始` };
    let learnedIdentity;
    try {
      learnedIdentity = await prepareLearnedAccountIdentity(s, d, p, w.checkin?.workflow ?? T);
    } catch (error) {
      return { ok: !1, error: error instanceof Error ? error.message : String(error) };
    }
    let O,
      k = [],
      A = [],
      ee = [...w.notices];
    let te = [],
      ne = (e) => {
        let [t] = bgCheckinState.Et(e);
        return t !== void 0 && (te.push(t), !0);
      },
      re = p;
    for (let e of (m.unlearnedNotes ?? []).slice(0, 4)) ee.push(e);
    if (w.login) {
      let e = w.login,
        n = ip(e, p);
      if (!ne({ ...p, ...n })) {
        try {
          // Learning updates this site's reusable login template. Each account retains its
          // independent login preference and selected provider, including automatic detection.
          await bgSitesState.store.updateSite(p.id, n);
        } catch (e) {
          A.push(e instanceof Error ? e.message : String(e));
        }
        if (A.length === 0) {
          let n = bgSitesState.Y(p.id, await bgPlatformState.t.get(bgPlatformState.r.sites, [])),
            i = sp(e, n);
          i.ok ? (k.push(`login`), n && (re = n)) : A.push(i.error);
        }
      }
    }
    if (w.checkin?.kind === `login-as-checkin` && A.length === 0) {
      const existing = configuredLoginAsCheckin ? p.checkin : {};
      const source = b ? `explicit` : existing.learnedLoginAsCheckinSource;
      let e = {
        checkin: {
          ...existing,
          method: `none`,
          learnedLoginAsCheckin: !0,
          ...(source ? { learnedLoginAsCheckinSource: source } : {}),
          ...(T
            ? {
                workflow: {
                  steps: [],
                  route: T.route,
                  ...(T.identityPath ? { identityPath: T.identityPath } : {}),
                },
              }
            : {}),
        },
      };
      if (!ne({ ...re, ...e })) {
        try {
          await bgSitesState.store.updateSite(p.id, e);
        } catch (e) {
          A.push(e instanceof Error ? e.message : String(e));
        }
        if (A.length === 0) {
          let e = bgSitesState.Y(p.id, await bgPlatformState.t.get(bgPlatformState.r.sites, [])),
            n = Af(e?.checkin);
          n.ok
            ? !e || !bgSitesState.se(e)
              ? A.push(`学到的「登录即签到」写入后被站点默认配置覆盖，请重试`)
              : (k.push(`checkin`), (O = `login-as-checkin`), (re = e))
            : A.push(n.error);
        }
      }
    } else if (
      w.checkin?.kind === `workflow` &&
      A.length === 0 &&
      bgSitesState.ue(p) &&
      $u(s.events, c).checkin === `none`
    )
      ee.push(`本次未录到签到或抽奖动作，保留原有专用流程；已录到的登录配置照常更新`);
    else if (w.checkin?.kind === `workflow` && A.length === 0) {
      let e = { workflow: w.checkin.workflow };
      if (!e.workflow.identityPath)
        A.push(
          `这次演示里没有点到真正的签到按钮（当天已签到、按钮已变成「已签到」时也会这样）。请在按钮可点时重新演示：先登录 → 进入能看到当前账号的页面 → 点击「立即签到」→ 再点「结束学习」；已经签到的当天无法学习签到流程`,
        );
      else {
        let n = bgCheckinState.st(p, e.workflow);
        if (n.length > 0) A.push(`学到的流程未通过校验：${n[0]}`);
        else {
          let {
              entry: n,
              url: i,
              learnedLoginAsCheckin: a,
              learnedLoginAsCheckinSource: o,
              ...s
            } = p.checkin ?? {},
            c = {
              checkin: {
                ...s,
                method: `workflow`,
                workflow: e.workflow,
                workflowReplayDisabled: !1,
              },
            };
          if (!ne({ ...re, ...c })) {
            try {
              await bgSitesState.store.updateSite(p.id, c);
            } catch (e) {
              A.push(e instanceof Error ? e.message : String(e));
            }
            if (A.length === 0) {
              let n = bgSitesState.Y(
                  p.id,
                  await bgPlatformState.t.get(bgPlatformState.r.sites, []),
                ),
                i = jf(e.workflow, n?.checkin);
              i.ok ? (k.push(`checkin`), (O = `workflow`), n && (re = n)) : A.push(i.error);
            }
          }
        }
      }
    }
    if (k.includes(`checkin`))
      ee.push(
        `已更新本站共用签到流程：本站现有和以后新增的账号都使用这一版；每个账号用自己的凭据登录并确认身份，无需逐个重新学习，其他站点保持各自的流程`,
      );
    if (k.length && A.length === 0 && learnedIdentity)
      try {
        await bgAccountsState.store.saveAccountIdentity(d.id, learnedIdentity, {
          preserveBinding: !0,
        });
        ee.push(
          `已将本账号绑定到本站用户 ID ${learnedIdentity.userId}，以后按 ID 核验，备注仅用于显示`,
        );
      } catch (error) {
        A.push(error instanceof Error ? error.message : String(error));
      }
    let ie = up({ saved: k, notices: ee, failures: A, siteConfigBlockers: te });
    if (!ie.ok) return { ok: !1, error: ie.error };
    let ae = ie.notices;
    (await Vm(s), bgPlatformState.$());
    let j = [...ae, ...(h ? [bgLearningState.Xp] : [])];
    return {
      ok: !0,
      feature: {
        learning: {
          active: !1,
          eventCount: s.events.length,
          tabId: s.tabId,
          saved: !0,
          kind: k.includes(`checkin`) ? `checkin` : `login`,
          savedKinds: k,
          intent: l === `login` ? `login` : `both`,
          ...(O ? { checkinSavedAs: O } : {}),
          ...(ed(s.events, c) ? { loginAsCheckinAvailable: !0 } : {}),
          ...(j.length ? { warnings: j } : {}),
          report: (() => {
            let e = Ap(s.events, c, {
              loginAsCheckin: O === `login-as-checkin`,
              hasStoredLoginConfig: Ep(re, d.loginMethod),
              siteCheckinMethod: re.checkin?.method,
              saveFailed: A.length > 0,
            });
            return { verdict: e.verdict, lines: e.lines };
          })(),
        },
      },
    };
  }
  let c = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find((t) => t.id === e);
  if (!c) return { ok: !1, error: `账号不存在` };
  let l = await bgPlatformState.t.get(bgPlatformState.r.sites, []),
    u = bgSitesState.Y(c.siteId, l);
  if (!u) return { ok: !1, error: `站点配置不存在` };
  if ((await bgCheckinState.Z.active())?.accountId === e)
    return { ok: !1, error: `该账号正在签到，请先停止任务` };
  let d = bgCheckinState.wh(u),
    f = await bgCheckinState.Eh(u);
  if (f != null) {
    let e = await bgCheckinState.Oh(c, u);
    (e.ok && bgProxiesState.Zo(e.proxy, await bgProxiesState.we())) || (f = void 0);
  }
  let p = await bgCheckinState.Oh(c, u);
  if (!p.ok) return { ok: !1, error: p.error };
  if (await bgCheckinState.Z.busy())
    return {
      ok: !1,
      error: `有签到任务正在执行或排队，请等它完成后再开始学习（学习与签到不能同时使用代理）`,
    };
  if (p.proxy) {
    let { active: e } = Of(Object.entries(await chrome.storage.session.get(null)));
    if (e.length > 0)
      return { ok: !1, error: `已有账号正在学习流程；学习会话之间不能互相打断，请先结束那一条` };
  }
  let m = f;
  if (m == null) {
    let e = await chrome.tabs.create({ url: `about:blank`, active: !0 }).catch(() => null);
    if (!e || e.id == null) return { ok: !1, error: `无法打开学习标签页` };
    m = e.id;
  }
  let h = !1;
  if (p.proxy) {
    if (!(await bgProxiesState.W.acquire(m, p.proxy).catch(() => !1)))
      return (
        f ?? (await bgCheckinState.Pp(m).catch(() => {})),
        { ok: !1, error: `代理正被其他任务占用，请等它完成后再开始学习` }
      );
    h = !0;
  }
  let g = bgProxiesState.Qo(p.proxy, await bgProxiesState.we());
  if (g)
    return (
      await bgPlatformState.n.remove(bgLearningState.a(m)).catch(() => {}),
      h && (await bgProxiesState.W.release(m).catch(() => {})),
      f ?? (await bgCheckinState.Pp(m).catch(() => {})),
      { ok: !1, error: g }
    );
  if (f == null)
    try {
      await bgCheckinState.kh(m, d);
    } catch (e) {
      return (
        await bgPlatformState.n.remove(bgLearningState.a(m)).catch(() => {}),
        await bgProxiesState.W.release(m).catch(() => {}),
        await bgCheckinState.Pp(m).catch(() => {}),
        { ok: !1, error: `学习页面加载失败：${e instanceof Error ? e.message : String(e)}` }
      );
    }
  let _ = {
    runId: bgPlatformState.Ti(`learn`),
    accountId: e,
    siteId: u.id,
    kind: i ?? `checkin`,
    tabId: m,
    createdAt: Date.now(),
    events: [],
    personalTexts: Jp(c),
  };
  (await bgPlatformState.n.set(bgLearningState.a(m), _),
    await chrome.tabs.update(m, { active: !0 }).catch(() => {}));
  let v = np(u),
    y = !1;
  for (let e = 0; e < 50 && !y; e += 1) {
    try {
      rp((await chrome.tabs.get(m)).url, v) &&
        (y =
          (await chrome.tabs.sendMessage(m, { type: `LEARN_MODE`, learning: _ }, { frameId: 0 }))
            ?.ok === !0);
    } catch {}
    y || (await new Promise((e) => setTimeout(e, 150)));
  }
  return (
    y && (await Rm(m, _, v)),
    y
      ? {
          ok: !0,
          feature: { learning: { active: !0, eventCount: 0, tabId: m, kind: i ?? `checkin` } },
        }
      : (await Vm(_), { ok: !1, error: `学习页面尚未准备好，未开始录制；请等待页面加载完成后重试` })
  );
}

async function Lm(e, t) {
  try {
    let n = await chrome.webNavigation.getAllFrames({ tabId: e });
    if (!n) return;
    let r = new Set([0]);
    for (let e of n) e.frameId != null && (t == null || rp(e.url, t)) && r.add(e.frameId);
    return [...r];
  } catch {
    return;
  }
}

async function Rm(e, t, n) {
  let r = await Lm(e, n);
  if (!r)
    return (
      (await chrome.tabs.sendMessage(e, { type: `LEARN_MODE`, learning: t }).catch(() => void 0))
        ?.ok === !0
    );
  let i = !1;
  for (let n of r)
    (
      await chrome.tabs
        .sendMessage(e, { type: `LEARN_MODE`, learning: t }, { frameId: n })
        .catch(() => void 0)
    )?.ok === !0 && (i = !0);
  return i;
}

async function zm(e, t) {
  let n = await chrome.tabs
    .sendMessage(e, { type: `FLUSH_LEARNING`, runId: t }, { frameId: 0 })
    .catch(() => ({
      ok: !1,
      error: `无法确认学习页面的末尾动作已保存，请保持学习标签页打开后重试`,
    }));
  if (n?.ok !== !0)
    return {
      ok: !1,
      error: n?.error ?? `无法确认学习页面的末尾动作已保存，请保持学习标签页打开后重试`,
      checkinControlSeen: void 0,
    };
  let r = new Set(
      Array.isArray(n.unlearnedNotes) ? n.unlearnedNotes.filter((e) => typeof e == `string`) : [],
    ),
    i = await chrome.webNavigation.getAllFrames({ tabId: e }).catch(() => null),
    a = typeof n.checkinControlSeen == `boolean` ? n.checkinControlSeen : void 0,
    o = (() => {
      let e = i?.find((e) => e.frameId === 0)?.url;
      if (!e) return null;
      try {
        return new URL(e).origin;
      } catch {
        return null;
      }
    })();
  if (i)
    for (let n of i) {
      if (n.frameId == null || n.frameId === 0) continue;
      let i = await chrome.tabs
        .sendMessage(e, { type: `FLUSH_LEARNING`, runId: t }, { frameId: n.frameId })
        .catch(() => void 0);
      if (Array.isArray(i?.unlearnedNotes))
        for (let e of i.unlearnedNotes) typeof e == `string` && r.add(e);
      if (i?.inactive === !0) continue;
      let s = typeof i?.checkinControlSeen == `boolean` ? i.checkinControlSeen : void 0;
      s === !0
        ? (a = !0)
        : s === void 0 &&
          a !== !0 &&
          (o == null ||
            (() => {
              try {
                return new URL(n.url).origin === o;
              } catch {
                return !0;
              }
            })()) &&
          (a = void 0);
    }
  return {
    ok: !0,
    challengeSeen: n.challengeSeen === !0,
    checkinControlSeen: a,
    unlearnedNotes: [...r].slice(0, 8),
  };
}

async function Bm(e) {
  await Rm(e, null, null);
}

async function Vm(e) {
  (await Bm(e.tabId),
    await bgLearningState.qp.run(async () => {
      (await bgPlatformState.n.get(bgLearningState.a(e.tabId), null))?.runId === e.runId &&
        (await bgPlatformState.n.remove(bgLearningState.a(e.tabId)));
    }),
    await bgProxiesState.W.release(e.tabId).catch(() => {}));
}

async function Hm() {
  let { active: e, expired: t } = Of(Object.entries(await chrome.storage.session.get(null)));
  for (let e of t) await bgCheckinState.Em(e);
  return {
    ok: !0,
    feature: {
      learningSessions: e.map((e) => ({
        accountId: e.accountId,
        tabId: e.tabId,
        eventCount: e.events.length,
        kind: e.kind ?? `checkin`,
        active: !0,
        guide: ld($u(e.events, e.kind ?? `checkin`)),
        ...(ed(e.events, e.kind ?? `checkin`) ? { loginAsCheckinAvailable: !0 } : {}),
        ...(e.preview ? { preview: e.preview } : {}),
      })),
    },
  };
}

async function Um(e) {
  let t = await bgProxiesState.Mm(e);
  return t
    ? (await Vm(t),
      bgPlatformState.$(),
      { ok: !0, feature: { learning: { active: !1, eventCount: 0, tabId: t.tabId } } })
    : { ok: !1, error: `该账号当前没有在进行的签到学习` };
}

async function Wm(e, t, r) {
  let i = t.tab?.id;
  if (i == null) return { ok: !1, error: `学习事件缺少顶层标签页` };
  let o = await bgPlatformState.n.get(bgLearningState.a(i), null);
  if (!o || o.runId !== r) return { ok: !1, error: `学习会话已结束` };
  if (!(await Fm(o, t))) return { ok: !1, error: `学习事件来自本站之外的页面，已忽略` };
  let s = Uf(e);
  if (!s) return { ok: !1, error: `学习事件格式无效` };
  let c = Mf(o, s);
  if (!c.ok) return (c.expired && (await bgCheckinState.Em(o)), { ok: !1, error: c.error });
  let l;
  try {
    l = nr(c.learning.events);
  } catch {}
  let u = l ? { ...c.learning, preview: l } : c.learning;
  return (
    await bgPlatformState.n.set(bgLearningState.a(i), u),
    {
      ok: !0,
      feature: {
        learning: {
          active: !0,
          eventCount: c.learning.events.length,
          tabId: i,
          ...(l ? { preview: l } : {}),
        },
      },
    }
  );
}

Object.assign(bgLearningState, {
  Qn,
  $n,
  er,
  tr,
  nr,
  bu,
  xu,
  Su,
  Cu,
  wu,
  Eu,
  Du,
  Ou,
  ku,
  Au,
  Iu,
  Hu,
  Uu,
  Wu,
  Gu,
  Ku,
  qu,
  Ju,
  Yu,
  Zu,
  Qu,
  $u,
  ed,
  cd,
  ld,
  Id,
  Ld,
  Rd,
  zd,
  Bd,
  Vd,
  Hd,
  Ud,
  Wd,
  Gd,
  Kd,
  qd,
  Jd,
  Yd,
  J,
  Zd,
  Qd,
  $d,
  ef,
  tf,
  nf,
  rf,
  of,
  sf,
  cf,
  lf,
  uf,
  df,
  ff,
  pf,
  hf,
  gf,
  _f,
  vf,
  yf,
  bf,
  Sf,
  wf,
  Tf,
  Ef,
  Df,
  Of,
  kf,
  Af,
  jf,
  Mf,
  Nf,
  Pf,
  Ff,
  If,
  Lf,
  Rf,
  Bf,
  Vf,
  Hf,
  Uf,
  Wf,
  Zf,
  Qf,
  tp,
  np,
  rp,
  ip,
  sp,
  cp,
  lp,
  up,
  mp,
  hp,
  gp,
  _p,
  vp,
  yp,
  bp,
  xp,
  Ep,
  Dp,
  Ap,
  jp,
  Mp,
  Kp,
  Jp,
  Yp,
  Pm,
  Fm,
  recordLearningIdentity,
  prepareLearnedAccountIdentity,
  Im,
  Lm,
  Rm,
  zm,
  Bm,
  Vm,
  Hm,
  Um,
  Wm,
});

export async function handleLearningMessage(e, i) {
  switch (e.type) {
    case `TOGGLE_LEARNING`:
      return bgEntryState.Q(i)
        ? bgPlatformState.X(async () => {
            try {
              return await Im(e.accountId, e.kind, { loginAsCheckin: e.loginAsCheckin === !0 });
            } finally {
              let t = await bgProxiesState.Mm(e.accountId);
              t && (await Rm(t.tabId, t, await Pm(t)));
            }
          })
        : { ok: !1, error: `仅扩展管理页可以操作学习流程` };
    case `LEARN_EVENT`:
      return bgLearningState.qp.run(() => Wm(e.event, i, e.runId));
    case `LEARN_IDENTITY`:
      return bgLearningState.qp.run(() => recordLearningIdentity(e.observation, i, e.runId));
    case `GET_LEARNING`:
      return bgEntryState.Q(i) ? Hm() : { ok: !1, error: `仅扩展管理页可以查看学习状态` };
    case `CANCEL_LEARNING`:
      return bgEntryState.Q(i)
        ? bgPlatformState.X(() => Um(e.accountId))
        : { ok: !1, error: `仅扩展管理页可以取消学习` };
  }
}

export async function handleLearningMutation(e) {
  switch (e.action) {
  }
}

export function initializeBackgroundLearning(step) {
  switch (step) {
    case 4: {
      bgLearningState.a = (e) => `learn:${e}`;
      break;
    }
    case 74: {
      bgLearningState.Zn = 20;
      break;
    }
    case 224: {
      bgLearningState.Tu = /^\/[a-z]{2}(?:[-_][a-z]{2})?(?=\/)/i;
      break;
    }
    case 225: {
      bgLearningState.ju =
        /(?:^|\/)(?:login|log-in|signin|sign-in|signup|sign-up|register|oauth|authorize|auth|password|reset|forgot)(?:\/|$)/i;
      break;
    }
    case 226: {
      bgLearningState.Mu = /(?:^|\/)(?:logout|log-out|signout|sign-out)(?:\/|$)/i;
      break;
    }
    case 227: {
      bgLearningState.Nu = /(?:^|\/)(?:profile|personal|account|user|me)\/?$/i;
      break;
    }
    case 228: {
      bgLearningState.Pu =
        /(?:^|\/)(?:settings?|preferences?|config|billing|payments?|invoices?|subscription|plans?|pricing|orders?|usage|logs?|tokens?|keys?|api-?keys?|security|passwords?|passkeys?|2fa|mfa|notifications?|invites?|affiliate|referrals?)(?:\/|$)/i;
      break;
    }
    case 229: {
      bgLearningState.Fu =
        /(?:^|\/)(?:check-?in|daily|rewards?|claim|points|lottery|draw|prize)(?:\/|$)/i;
      break;
    }
    case 230: {
      bgLearningState.Lu = bgCheckinState.xs(
        /^(?:退出登录|退出账号|退出|登出|注销|log\s?out|sign\s?out|logout)$/i,
      );
      break;
    }
    case 231: {
      bgLearningState.Ru = bgCheckinState.xs(
        /(?:签到|打卡|领取|抽奖|抽签|翻牌|check[\s-]?in|daily|claim|redeem|\b(?:start\s+)?draw\b)/i,
      );
      break;
    }
    case 232: {
      bgLearningState.zu = bgCheckinState.xs(
        /个人(?:资料|信息|中心)|账户信息|账号信息|我的(?:账户|账号|资料|信息)|控制台|首页|设置|偏好|仪表盘|退出|登出|profile|personal|account|dashboard|console|preferences?|logout|log\s?out/i,
      );
      break;
    }
    case 233: {
      bgLearningState.Bu = bgCheckinState.xs(/已签到|今日已|已经签到/);
      break;
    }
    case 234: {
      bgLearningState.Vu = bgCheckinState.xs(/签到成功|打卡成功|领取成功/);
      break;
    }
    case 235: {
      bgLearningState.Xu = { none: 0, action: 1, confirmed: 2, already: 3 };
      break;
    }
    case 236: {
      bgLearningState.td = [`①`, `②`, `③`, `④`];
      break;
    }
    case 237: {
      bgLearningState.nd = [`登录`, `账号页`, `签到`, `结束`];
      break;
    }
    case 238: {
      bgLearningState.rd = [`登录`, `结束`];
      break;
    }
    case 239: {
      bgLearningState.id = `检测到这次演示点了「退出登录」：会话已经断开，请重新登录后再继续演示（这段演示不建议保存）`;
      break;
    }
    case 240: {
      bgLearningState.ad = {
        login: `在打开的站点上手动登录；全程不要点「退出登录」`,
        profile: `先经过能显示当前账号的页面（如「个人资料 / 我的账户」），再进签到页`,
        checkin: `点一次真正的签到/领取按钮；当天已经签过的站点学不到签到流程`,
        done: `回到扩展里点「结束学习」保存`,
      };
      break;
    }
    case 241: {
      bgLearningState.od = `若本站是「登录即签到」（登录成功后自动完成、页面上没有签到按钮），回扩展里点「登录即签到」即可保存完整流程`;
      break;
    }
    case 242: {
      bgLearningState.sd = {
        login: `手动完成一次登录（填好账号密码并提交，或点第三方登录），全程不要点「退出登录」`,
        profile: bgLearningState.ad.profile,
        checkin: bgLearningState.ad.checkin,
        done: `回到扩展里点「结束学习」保存`,
      };
      break;
    }
    case 253: {
      bgLearningState.gd = 250;
      break;
    }
    case 254: {
      bgLearningState._d = 1e6;
      break;
    }
    case 255: {
      bgLearningState.vd = `scrollIntoView`;
      break;
    }
    case 256: {
      bgLearningState.yd = 12;
      break;
    }
    case 257: {
      bgLearningState.bd = 30;
      break;
    }
    case 258: {
      bgLearningState.xd = 3;
      break;
    }
    case 259: {
      bgLearningState.Sd = bgCheckinState.xs(
        /签到|打卡|领取|奖励|福利|抽奖|抽签|翻牌|check[\s-]?in|claim|attendance|daily|\b(?:start\s+)?draw\b/i,
      );
      break;
    }
    case 260: {
      bgLearningState.Cd =
        /(?:^|\/)(?:check-?in|daily-check-?in|sign-?in|attendance|rewards?|benefit|lottery|draw|prize)(?:\/|$)/i;
      break;
    }
    case 261: {
      bgLearningState.wd = bgCheckinState.xs(
        /个人资料|个人信息|账户信息|账号信息|我的(?:账户|账号|资料)|profile|my\s+account|account\s+(?:settings|info|details)|user\s+center/i,
      );
      break;
    }
    case 262: {
      bgLearningState.Td = /(?:^|\/)(?:profile|personal|account|user|me)(?:\/|$)/i;
      break;
    }
    case 263: {
      bgLearningState.Ed =
        /(?:^|\/)(?:settings?|preferences?|config|billing|payments?|invoices?|subscription|plans?|pricing|orders?|usage|logs?|tokens?|keys?|api-?keys?|security|passwords?|passkeys?|2fa|mfa|notifications?|invites?|affiliate|referrals?)(?:\/|$)/i;
      break;
    }
    case 264: {
      bgLearningState.Dd = bgCheckinState.xs(
        /个人(?:资料|信息|中心)|账户信息|账号信息|我的(?:账户|账号|资料|信息)|控制台|首页|设置|偏好|仪表盘|退出|登出|profile|personal|account|dashboard|console|preferences?|logout|log\s?out/i,
      );
      break;
    }
    case 265: {
      bgLearningState.Od = [...bgCheckinState.Cs, ...bgCheckinState.Ts];
      break;
    }
    case 266: {
      bgLearningState.kd = [...bgCheckinState.ws, ...bgCheckinState.Es];
      break;
    }
    case 267: {
      bgLearningState.Ad = [
        `领取失败`,
        `签到失败`,
        `操作失败`,
        `请稍后重试`,
        `系统繁忙`,
        `check-in failed`,
      ];
      break;
    }
    case 268: {
      bgLearningState.jd = [
        `请完成验证`,
        `人机验证`,
        `验证码`,
        `请先登录`,
        `登录已过期`,
        `verify you are human`,
      ];
      break;
    }
    case 269: {
      [...bgLearningState.kd, ...bgLearningState.Od, ...bgLearningState.Ad, ...bgLearningState.jd];
      break;
    }
    case 270: {
      bgLearningState.Md =
        /(?:^|\/)(?:login|log-in|signin|sign-in|signup|sign-up|register|oauth|authorize|auth|logout)(?:\/|$|\?)/i;
      break;
    }
    case 271: {
      bgLearningState.Nd = /password|passwd|pwd|token|secret|captcha|otp|验证码|密码/i;
      break;
    }
    case 272: {
      bgLearningState.Pd =
        /^(?:登录|登出|退出|退出登录|注销|注册|立即登录|去登录|免费注册|sign\s?in|sign\s?up|log\s?in|log\s?out|logout|oauth|github|google|passkey)$/i;
      break;
    }
    case 273: {
      bgLearningState.Fd =
        /(?:^#|[?&])(?:access[_-]?token|refresh[_-]?token|id[_-]?token|token|code|state|secret|password|credential|session|auth)=/i;
      break;
    }
    case 274: {
      bgLearningState.Xd =
        /(?:^|\/)(?:sign-?in|sign-?up|log-?in|log-?out|logout|register|auth|oauth|authorize|password|reset|forgot)(?:\/|$)/i;
      break;
    }
    case 275: {
      bgLearningState.af = /(?:^|\/)(?:profile|personal|account|user|me)\/?$/i;
      break;
    }
    case 276: {
      bgLearningState.mf = 3;
      break;
    }
    case 277: {
      bgLearningState.xf = `这次演示登录成功了，但没有录到签到动作。若本站登录成功就算签到（页面上没有签到按钮），请点账号行的「登录即签到（没有签到按钮）」保存；若本站有签到按钮，请在原页面点一次签到后再点「结束学习」。本次学习还在继续；确认只保存登录配置的话，再点一次「结束学习」`;
      break;
    }
    case 278: {
      bgLearningState.Cf = `这次演示没有录到签到动作（没有点到签到/领取按钮），保存后自动签到会回放刚才的点击，可能并不会签到。若本站登录成功就算签到：请先放弃本次学习，在站点上退出登录后重新开始学习并完成一次登录；若刚才点的就是签到按钮（文案比较特别），再点一次「结束学习」即按回放流程保存`;
      break;
    }
    case 279: {
      bgLearningState.zf = new Set([
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
    case 280: {
      bgLearningState.Gf = /^[A-Za-z][A-Za-z0-9_-]{0,80}$/;
      break;
    }
    case 281: {
      bgLearningState.Kf = /(?:^|[-_])_r_[0-9a-z]{1,4}_(?:$|[-_])/i;
      break;
    }
    case 282: {
      bgLearningState.qf = /^(?:radix|base-?ui)-/i;
      break;
    }
    case 283: {
      bgLearningState.Jf = /(?:^|[-_])(?:react-select|downshift)-\d+(?:[-_]|$)/i;
      break;
    }
    case 284: {
      bgLearningState.Yf = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      break;
    }
    case 285: {
      bgLearningState.Xf = 8;
      break;
    }
    case 286: {
      bgLearningState.$f = /(?:^|[\s>+~,(])#([^\s>+~,[\]]+)/g;
      break;
    }
    case 287: {
      bgLearningState.ep = /^[#.]?:r[0-9a-z]+:$/i;
      break;
    }
    case 288: {
      bgLearningState.dp = /^(?:\u26A0\uFE0F|\u2139\uFE0F|\u274C|\u26A0|\u2139)\s*/u;
      break;
    }
    case 289: {
      bgLearningState.fp = [...bgCheckinState.Cs, ...bgCheckinState.Ts];
      break;
    }
    case 290: {
      bgLearningState.pp = [...bgCheckinState.ws, ...bgCheckinState.Es];
      break;
    }
    case 291: {
      bgLearningState.Sp = `✅ 已按「登录即签到」学会：本站登录成功后即算签到，不需要点签到按钮`;
      break;
    }
    case 292: {
      bgLearningState.Cp = `❌ 「登录即签到」未保存：没有录到登录配置`;
      break;
    }
    case 293: {
      bgLearningState.wp = `⚠️ 「登录即签到」未保存：已录到登录配置，但没有确认成功进入站内页面`;
      break;
    }
    case 294: {
      bgLearningState.Tp = `⚠️ 已按「登录即签到」保存：本次没录到登录动作（可能打开时已登录）；运行时若已登录，无法证明本轮登录拿到奖励，会停在「需处理」而不记成功；要每轮强制退出重登，请把本站签到方式改成「退出再登录」`;
      break;
    }
    case 295: {
      bgLearningState.Op = `ℹ️ 若本站是「登录即签到」（登录成功后自动完成、页面上没有签到按钮）：开始学习并完成登录后，在账号行点「登录即签到」即可保存完整流程`;
      break;
    }
    case 296: {
      bgLearningState.kp = `✅ 本站签到方式为「登录即签到」：登录成功即算完成，页面上没有签到按钮属于正常情况`;
      break;
    }
    case 303: {
      bgLearningState.qp = bgProxiesState.Yn();
      break;
    }
    case 304: {
      bgLearningState.Xp = `学习过程中出现了验证码/二次验证（OTP）字段。按隐私设计，这类字段不会被学习，也不会采集任何内容；自动回放时需要你在页面上人工完成这一步。`;
      break;
    }
    case 316: {
      bgLearningState.Nm = new Map();
      break;
    }
  }
}

export const learningService = Object.freeze({
  toggle: (...args) => Im(...args),
  cancel: (...args) => Um(...args),
  getState: (...args) => Hm(...args),
  recordEvent: (...args) => Wm(...args),
  recordIdentity: (...args) => recordLearningIdentity(...args),
  handleMessage: handleLearningMessage,
});
