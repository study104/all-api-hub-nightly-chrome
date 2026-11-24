/** 记录统计后台：余额、奖励、快照、手动完成依据和执行结果采集。 */
import { bgAccountsState } from '../accounts/service.js';
import { bgSitesState } from '../sites/service.js';
import { bgCheckinState } from '../checkin/service.js';
import { bgProxiesState } from '../proxies/service.js';
import { bgPlatformState } from '../../shared/background-platform.js';
import { bgEntryState } from '../../entries/background.js';

export const bgRecordsState = { store: {} };

function Qr(e) {
  return Number.isNaN(e.getTime())
    ? null
    : { year: e.getFullYear(), month: e.getMonth() + 1, day: e.getDate() };
}

function $r(e) {
  let t = e
    .replace(/[年月日]/g, `/`)
    .replace(/[.\-]/g, `/`)
    .match(/((?:19|20)\d{2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{1,2})/);
  if (!t) return null;
  let n = Number(t[1]),
    r = Number(t[2]),
    i = Number(t[3]);
  if (!Number.isInteger(r) || r < 1 || r > 12 || !Number.isInteger(i) || i < 1 || i > 31)
    return null;
  let a = new Date(n, r - 1, i);
  return a.getFullYear() !== n || a.getMonth() + 1 !== r || a.getDate() !== i
    ? null
    : { year: n, month: r, day: i };
}

function ei(e, t = new Date()) {
  if (!e) return null;
  let n = Qr(t);
  if (!n) return null;
  let r = [...e.matchAll(bgRecordsState.Yr)];
  for (let t = 0; t < r.length; t += 1) {
    let i = r[t];
    if (!i) continue;
    let a = i.index ?? 0,
      o = r[t + 1]?.index ?? e.length,
      s = e.slice(a, o),
      c = s.match(/[+＋]\s*(\d[\d,]*(?:\.\d+)?)/);
    if (!c?.[1]) continue;
    let l = ii(c[1]);
    if (l == null || l <= 0) continue;
    let u = s.match(bgRecordsState.Zr);
    if (!u) continue;
    let d = $r(u[0]);
    if (d && d.year === n.year && d.month === n.month && d.day === n.day)
      return { reward: l, symbol: `积分` };
  }
  return null;
}

function ii(e) {
  if (e.includes(`,`)) {
    if (!/^-?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(e)) return null;
    e = e.replace(/,/g, ``);
  }
  let t = Number(e);
  return Number.isFinite(t) ? t : null;
}

function ai(e, t) {
  if (!t) return e;
  let n = e != null && Math.abs(t.reward - e.reward) <= bgRecordsState.bi,
    r = t.symbol ?? (n ? e?.symbol : void 0);
  return { reward: t.reward, ...(r ? { symbol: r } : {}) };
}

function oi(e) {
  if (e) return e === `¥` || e === `￥` ? e : /^(?:cny|rmb)$/i.test(e) ? `¥` : `$`;
}

function si(e) {
  let t = e.trim().match(/^(\d[\d,]*(?:\.\d+)?)\s*积分$/i);
  if (t?.[1]) {
    let e = ii(t[1]);
    return e == null ? null : { amount: e, symbol: `积分` };
  }
  let n = e.trim().match(/^(?:([$＄¥￥])|(?:usd|cny|rmb))?\s*(\d[\d,]*(?:\.\d+)?)$/i);
  if (!n?.[2]) return null;
  let r = ii(n[2]);
  if (r == null) return null;
  let i = oi(n[1] || e.trim().match(/^(usd|cny|rmb)/i)?.[1] || ``);
  return { amount: r, ...(i ? { symbol: i } : {}) };
}

function ci(e, t) {
  if (!e) return null;
  let n = ei(e);
  if (n) return n;
  if ((bgRecordsState.Xr.test(e) && bgRecordsState.Zr.test(e)) || !bgRecordsState.ri.test(e))
    return null;
  for (let { pattern: n, requiresCheckedIn: r } of bgRecordsState.ti) {
    if (r && !bgRecordsState.ni.test(e)) continue;
    let i = n.flags.includes(`g`) ? n.flags : `${n.flags}g`;
    for (let r of e.matchAll(new RegExp(n.source, i))) {
      let e = r[1];
      if (!e) continue;
      let n = si(e);
      if (!n || n.amount <= 0) continue;
      let i = n.symbol === `积分` ? 1 : t && t > 0 ? t : 1;
      return { reward: n.amount * i, ...(n.symbol ? { symbol: n.symbol } : {}) };
    }
  }
  return null;
}

function li(e, t) {
  if (!e || typeof e != `object`) return null;
  let n = e;
  if (n.success === !1) return null;
  let r = (e) => (e && typeof e == `object` && !Array.isArray(e) ? e : null),
    i = r(n.data),
    a = [n, i, r(i?.stats)].filter((e) => !!e);
  if (!a.some((e) => e.checked_in_today === !0 || e.checkedInToday === !0)) return null;
  for (let e of a) {
    let n = e.today_reward ?? e.todayReward,
      r = typeof n == `number` ? { amount: n } : typeof n == `string` ? si(n) : null;
    if (!r || !Number.isFinite(r.amount) || r.amount <= 0) continue;
    let i = t && t > 0 ? t : 1;
    return { reward: r.amount * i, ...(r.symbol ? { symbol: r.symbol } : {}) };
  }
  return null;
}

function ui(e, t) {
  if (!e) return null;
  let n = e.match(bgRecordsState.Jr);
  if (n?.[1]) {
    let e = ii(n[1]);
    if (e != null) return { quota: e, usedQuota: 0, symbol: `积分` };
  }
  let r = e.match(bgRecordsState.qr);
  if (r?.[1]) {
    let e = ii(r[1]);
    if (e != null) return { quota: e, usedQuota: 0, symbol: `积分` };
  }
  if (bgRecordsState.Xr.test(e)) return null;
  let i = e.match(/(?:当前余额|账户余额|剩余额度|可用余额)\s*[:：]?\s*([\s\S]{0,120})/i)?.[1];
  if (i) {
    let e = i.match(
        /(?:免费余额|免费)\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i,
      ),
      n = i.match(
        /(?:付费余额|付费)\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i,
      ),
      r = e?.[3] ? ii(e[3]) : null,
      a = n?.[3] ? ii(n[3]) : null;
    if (r != null || a != null) {
      let i = t && t > 0 ? t : 1,
        o = oi(e?.[1] ?? e?.[2] ?? n?.[1] ?? n?.[2]);
      return { quota: ((r ?? 0) + (a ?? 0)) * i, usedQuota: 0, ...(o ? { symbol: o } : {}) };
    }
  }
  for (let n of bgRecordsState.Kr) {
    let r = e.match(n),
      i = r?.[3];
    if (!i) continue;
    let a = i;
    if (i.includes(`,`)) {
      if (!/^-?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(i)) continue;
      a = i.replace(/,/g, ``);
    }
    let o = Number(a);
    if (!Number.isFinite(o)) continue;
    let s = t && t > 0 ? t : 1,
      c = oi(r?.[1] ?? r?.[2]);
    return { quota: o * s, usedQuota: 0, ...(c ? { symbol: c } : {}) };
  }
  return null;
}

function pi(e) {
  return typeof e == `number` && Number.isFinite(e)
    ? e
    : typeof e == `string` && e.trim() !== `` && Number.isFinite(Number(e))
      ? Number(e)
      : null;
}

function mi(e) {
  if (!e || typeof e != `object`) return null;
  let t = e;
  if (t.success === !1) return null;
  let n = t.data ?? t;
  if (!n || typeof n != `object`) return null;
  let r = pi,
    i = r(n.quota);
  if (i != null) return { quota: i, usedQuota: r(n.used_quota) ?? r(n.usedQuota) ?? 0 };
  let a = r(n.free_balance) ?? r(n.freeBalance),
    o = r(n.paid_balance) ?? r(n.paidBalance) ?? (a == null ? null : r(n.balance));
  if (a != null || o != null) return { quota: (a ?? 0) + (o ?? 0), usedQuota: 0 };
  let s = r(n.balance);
  return s == null ? null : { quota: s, usedQuota: 0 };
}

function hi(e) {
  if (!e || typeof e != `object`) return null;
  let t = pi(e.points);
  return t == null ? null : { quota: t, usedQuota: 0, symbol: `积分` };
}

function gi(e, t) {
  try {
    let n = atob(t),
      r = Uint8Array.from(n, (e) => e.charCodeAt(0));
    return e.includes(`cbor`)
      ? bgAccountsState.yr(r)
      : e.includes(`json`)
        ? JSON.parse(new TextDecoder().decode(r))
        : null;
  } catch {
    return null;
  }
}

function _i(e) {
  let t = bgCheckinState.pt(e);
  return !t?.endpoint || !t.tokenKey || !bgCheckinState.mt(e, t.endpoint)
    ? null
    : {
        url: t.endpoint,
        tokenKey: t.tokenKey,
        ...(t.tokenStorageType ? { tokenStorageType: t.tokenStorageType } : {}),
        ...(t.tokenHeader ? { tokenHeader: t.tokenHeader } : {}),
        ...(t.tokenPrefix === void 0 ? {} : { tokenPrefix: t.tokenPrefix }),
      };
}

function vi(e) {
  return yi(e);
}

function yi(e) {
  let t = bgSitesState.fr(e).family;
  return t === bgSitesState.d.SUB2API
    ? bgRecordsState.fi
    : t === bgSitesState.d.NEW_API
      ? bgRecordsState.di
      : [...bgRecordsState.di, ...bgRecordsState.fi];
}

function xi(e, t) {
  if (
    !e ||
    !t ||
    (e.fromVisibleText &&
      t.fromVisibleText &&
      e.visiblePath &&
      t.visiblePath &&
      e.visiblePath !== t.visiblePath)
  )
    return { verdict: `unknown` };
  let n = e.quota + e.usedQuota,
    r = t.quota + t.usedQuota - n,
    i = t.usedQuota - e.usedQuota,
    a = t.quota - e.quota,
    o;
  return (
    (o = r > bgRecordsState.bi ? `rewarded` : i > bgRecordsState.bi ? `already-used` : `unchanged`),
    {
      reward: r,
      usageDelta: i,
      balanceDelta: a,
      verdict: o,
      quotaAfter: t.quota,
      ...(t.symbol ? { balanceSymbol: t.symbol } : {}),
    }
  );
}

async function Si(e, t, n = !1, r = null, i = null) {
  let a = { Accept: `application/json` };
  try {
    let e = localStorage.getItem(`user`);
    if (e) {
      let n = JSON.parse(e),
        r = typeof n?.id == `number` || typeof n?.id == `string` ? String(n.id).trim() : ``;
      if (r) for (let e of t) a[e] = r;
    }
  } catch {}
  for (let e of [`auth_token`, `access_token`, `token`]) {
    let t = localStorage.getItem(e)?.trim();
    if (t && t.length > 20 && !t.startsWith(`{`)) {
      a.Authorization = `Bearer ${t}`;
      break;
    }
  }
  let o = i?.url ?? ``,
    s = (() => {
      try {
        return !!o && new URL(o, location.href).origin === location.origin;
      } catch {
        return !1;
      }
    })();
  if (i && s) {
    let e = `__aahBootstrapToken`,
      t = (() => {
        try {
          let t = window[e];
          if (!t || typeof t != `object`) return null;
          let n = t;
          return typeof n.at != `number` || Date.now() - n.at > 6e4
            ? null
            : typeof n.header == `string` && typeof n.value == `string`
              ? { header: n.header, value: n.value }
              : null;
        } catch {
          return null;
        }
      })();
    t && !a[t.header] && (a[t.header] = t.value);
    let n = new AbortController(),
      r = setTimeout(() => n.abort(), 4e3);
    try {
      if (!t) {
        let t = await fetch(i.url, {
          method: i.method,
          credentials: `include`,
          headers: { Accept: `application/json` },
          redirect: `error`,
          signal: n.signal,
        });
        if (t.ok) {
          let n = (t.headers.get(`content-type`)?.toLowerCase() ?? ``).includes(`json`)
              ? await t.json().catch(() => null)
              : null,
            r = i.tokenPath?.length
              ? [i.tokenPath]
              : [
                  [`data`, `access_token`],
                  [`access_token`],
                  [`data`, `accessToken`],
                  [`accessToken`],
                ],
            o;
          for (let e of r) {
            let t = n;
            for (let n of e) {
              if (typeof t != `object` || !t) {
                t = void 0;
                break;
              }
              t = t[n];
            }
            if (typeof t == `string` && t.trim().length > 20) {
              o = t.trim();
              break;
            }
          }
          if (typeof o == `string` && !a[i.header]) {
            let t = `${i.prefix}${o}`;
            a[i.header] = t;
            try {
              window[e] = { at: Date.now(), header: i.header, value: t };
            } catch {}
          }
        }
      }
    } catch {
    } finally {
      clearTimeout(r);
    }
  }
  let c = (async () => {
      if (!r) return null;
      let e = r.tokenStorageType ? [r.tokenStorageType] : [`localStorage`, `sessionStorage`],
        t;
      for (let n of e)
        try {
          let e = (n === `localStorage` ? localStorage : sessionStorage)
            ?.getItem(r.tokenKey)
            ?.trim();
          if (e) {
            t = e;
            break;
          }
        } catch {}
      if (!t) return null;
      let n = new AbortController(),
        i = setTimeout(() => n.abort(), 4e3);
      try {
        let e = { Accept: `application/cbor, application/json` };
        e[r.tokenHeader ?? `Authorization`] = `${r.tokenPrefix ?? `Bearer `}${t}`;
        let i = await fetch(r.url, {
          method: `GET`,
          credentials: `omit`,
          headers: e,
          signal: n.signal,
        });
        if (!i.ok) return null;
        let a = i.headers.get(`content-type`)?.toLowerCase() ?? ``;
        if (!a.includes(`cbor`) && !a.includes(`json`)) return null;
        let o = new Uint8Array(await i.arrayBuffer()),
          s = ``;
        for (let e = 0; e < o.length; e += 32768)
          s += String.fromCharCode(...o.subarray(e, e + 32768));
        return { url: r.url, contentType: a, base64: btoa(s) };
      } catch {
        return null;
      } finally {
        clearTimeout(i);
      }
    })(),
    l = await Promise.all(
      e.map(async (e) => {
        let t = new AbortController(),
          n = setTimeout(() => t.abort(), 4e3);
        try {
          let n = await fetch(new URL(e, location.origin).href, {
            method: `GET`,
            credentials: `include`,
            headers: a,
            signal: t.signal,
          });
          if (!n.ok) return null;
          let r = n.headers.get(`content-type`)?.toLowerCase() ?? ``;
          return { path: e, text: (await n.text()).slice(0, 4e3), json: r.includes(`json`) };
        } catch {
          return null;
        } finally {
          clearTimeout(n);
        }
      }),
    ),
    u = (document.body?.innerText ?? ``).slice(0, 2e4);
  if (n && !/(?:^|\n)\s*当前积分\s*[:：]?\s*-?\d/i.test(u)) {
    let e = () => document.body?.innerText ?? document.body?.textContent ?? ``,
      t = (e) => {
        let t = window.getComputedStyle(e),
          n = e.getBoundingClientRect();
        return (
          t.display !== `none` &&
          t.visibility !== `hidden` &&
          t.opacity !== `0` &&
          n.width > 0 &&
          n.height > 0
        );
      },
      n = [
        ...document.querySelectorAll(
          `button, [role="button"], a, [aria-haspopup], [aria-expanded], [tabindex="0"]`,
        ),
      ]
        .filter(t)
        .map((e) => {
          let t = e.getBoundingClientRect(),
            n = `${e.innerText ?? ``} ${e.getAttribute(`aria-label`) ?? ``}`.trim(),
            r = `${e.id} ${e.className} ${e.getAttribute(`data-testid`) ?? ``}`,
            i = 0;
          return (
            e.getAttribute(`aria-haspopup`)?.toLowerCase() === `menu` && (i += 30),
            e.getAttribute(`aria-expanded`) === `false` && (i += 8),
            /user|account|avatar|profile|dropdown|member|用户|账户|头像/i.test(r) && (i += 12),
            t.top <= 180 && t.right >= window.innerWidth * 0.65 && (i += 10),
            n.length >= 1 && n.length <= 32 && (i += 4),
            /登录|注册|签到|语言|主题|切换|导航|退出|logout|sign[ -]?in/i.test(n) && (i -= 30),
            { element: e, score: i }
          );
        })
        .filter((e) => e.score >= 10)
        .sort((e, t) => t.score - e.score)[0]?.element;
    if (n)
      try {
        (n.click(),
          await new Promise((e) => setTimeout(e, 250)),
          (u = e().slice(0, 2e4)),
          /(?:^|\n)\s*当前积分\s*[:：]?\s*-?\d/i.test(u) && n.isConnected && n.click());
      } catch {}
  }
  return { payloads: l.filter((e) => !!e), crossOrigin: await c, bodyText: u };
}

function Di(e) {
  return {
    quota: e.quota,
    usedQuota: e.usedQuota,
    ...(e.symbol ? { symbol: e.symbol } : {}),
    at: e.at,
    source: e.source ?? `api`,
  };
}

function Oi(e) {
  return bgPlatformState.Ci(new Date(e));
}

function ki(e, t, n = bgRecordsState.Ei) {
  if (!e || !Number.isFinite(t) || !Number.isFinite(n) || n < 0) return;
  let r = [];
  for (let t of Object.values(e.daily ?? {})) t.latest && r.push(t.latest);
  e.error || r.push(Di(e));
  let i;
  for (let e of r)
    !Number.isFinite(e.quota) ||
      !Number.isFinite(e.usedQuota) ||
      !Number.isFinite(e.at) ||
      e.at > t ||
      t - e.at > n ||
      ((!i || e.at > i.at || (e.at === i.at && !i.symbol && e.symbol)) && (i = e));
  if (!i) return;
  let a = i.symbol ?? e.symbol;
  return {
    quota: i.quota,
    usedQuota: i.usedQuota,
    ...(a ? { symbol: a } : {}),
    at: i.at,
    ...(i.source === `visible` ? { fromVisibleText: !0 } : {}),
  };
}

function Ai(e, t = 90) {
  let n = Object.keys(e).sort().slice(-t);
  return Object.fromEntries(n.map((t) => [t, e[t]]));
}

function ji(e, t, n = 90) {
  let r = { ...(e?.daily ?? {}) };
  if (e && !e.error && !e.daily && Number.isFinite(e.at)) {
    let t = Di(e);
    r[Oi(t.at)] = { first: t, latest: t };
  }
  let i = Di(t),
    a = Oi(i.at),
    o = r[a] ?? {},
    s = !o.first || i.at < o.first.at ? i : o.first,
    c = !o.latest || i.at >= o.latest.at ? i : o.latest;
  return ((r[a] = { ...o, first: s, latest: c }), Ai(r, n));
}

function Mi(e, t, n, r, i = 90, a) {
  let o = e?.[t],
    s = a ?? (o?.checkinReward === n ? o.checkinRewardSymbol : void 0),
    c = { ...(o ?? {}), checkinReward: n, checkinRewardAt: r };
  return (
    s ? (c.checkinRewardSymbol = s) : delete c.checkinRewardSymbol,
    Ai({ ...(e ?? {}), [t]: c }, i)
  );
}

function Ni(e) {
  return e ? `visible` : `api`;
}

function Li(e) {
  return `${e}，未用作登录前基线；本次只能刷新余额，无法计算登录带来的额度增加量`;
}

function Ri(e) {
  let t = new Date(e),
    n = (e) => String(e).padStart(2, `0`);
  return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}`;
}

function zi(e) {
  if (!e) return [];
  let t = [];
  for (let n of Object.values(e.daily ?? {})) n.latest && t.push(n.latest);
  return (
    e.error ||
      t.push({
        quota: e.quota,
        usedQuota: e.usedQuota,
        ...(e.symbol ? { symbol: e.symbol } : {}),
        at: e.at,
        source: e.source ?? `api`,
      }),
    t
  );
}

function Bi(e) {
  let t;
  for (let n of e) Number.isFinite(n.at) && (!t || n.at > t.at) && (t = n);
  return t;
}

function Vi(e, t) {
  if (ki(e, t)) return bgRecordsState.Pi;
  if (!Number.isFinite(t)) return bgRecordsState.Ii;
  let n = Bi(zi(e));
  if (!n) return bgRecordsState.Ii;
  let r = Ri(n.at);
  return n.at > t
    ? Li(
        `最近一次成功余额读取于 ${r}，晚于本次任务开始时间，不在 ${bgRecordsState.Fi} 小时归因窗口的可用范围内`,
      )
    : t - n.at > 1296e5
      ? Li(`最近一次成功余额读取于 ${r}，已超过 ${bgRecordsState.Fi} 小时归因窗口`)
      : Li(`最近一次成功余额读取于 ${r}，但该记录的额度数据不完整`);
}

function ha(e, t) {
  let n = t.quota + t.usedQuota - (e.quota + e.usedQuota),
    r = t.usedQuota - e.usedQuota;
  return {
    reward: n,
    usageDelta: r,
    balanceDelta: t.quota - e.quota,
    verdict:
      n > bgRecordsState.ma ? `rewarded` : r > bgRecordsState.ma ? `already-used` : `unchanged`,
    source: `balance-diff`,
    quotaAfter: t.quota,
    ...(t.symbol ? { balanceSymbol: t.symbol } : {}),
  };
}

function ga(e, t = bgPlatformState.Ci()) {
  let n = e?.daily;
  if (!n) return null;
  let r = n[t];
  if (!r?.latest) return null;
  let i = [];
  r.first &&
    r.latest.at > r.first.at &&
    i.push({
      metrics: ha(r.first, r.latest),
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
      i.push({ metrics: ha(o, r.latest), baselineDay: a, currentDay: t, basis: `previous-day` }),
    i.find((e) => e.metrics.verdict === `rewarded`) ?? i[0] ?? null
  );
}

function _a(e, t, n = bgPlatformState.Ci()) {
  let r = ga(t, n),
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
      ? `${bgRecordsState.pa}，已按余额差值计算增加量`
      : r
        ? `${bgRecordsState.pa}，余额差值未增加`
        : bgRecordsState.pa,
    steps: [
      `用户在管理页手动标记本次签到已完成`,
      ...(a ? [`已按${a}计算总额度差值`] : [`没有可用的历史余额基线，无法计算增加量`]),
      ...(i ? [`该增加量是余额期间差值，可能包含同期间充值或其它入账`] : []),
    ],
    ...(r ? { metrics: r.metrics } : {}),
  };
}

function Is(e, t) {
  return bgCheckinState.Ss(e, t).length > 0;
}

function Ls(e) {
  if (typeof e == `number` && Number.isFinite(e)) return e;
  if (typeof e == `string` && e.trim() !== ``) {
    let t = Number(e);
    if (Number.isFinite(t)) return t;
  }
  return null;
}

function Rs(e) {
  let t = new Date(e);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, `0`)}`;
}

function zs(e, t, n) {
  if (e !== 200 || bgCheckinState.Ps(t, n)) return null;
  let r = null;
  try {
    r = bgCheckinState.Ms(JSON.parse(n));
  } catch {
    return null;
  }
  if (!r) return null;
  let i = bgCheckinState.Ms(r.data),
    a = bgCheckinState.Ms(i?.stats);
  if (!i || !a) return null;
  let o = [];
  if (Array.isArray(a.records))
    for (let e of a.records) {
      let t = bgCheckinState.Ms(e);
      if (!t) continue;
      let n = t.checkin_date ?? t.date,
        r = Ls(t.quota_awarded ?? t.quota);
      typeof n == `string` && r != null && o.push({ date: n, quotaAwarded: r });
    }
  return { enabled: i.enabled !== !1, checkedInToday: a.checked_in_today === !0, records: o };
}

function Bs(e, t) {
  if (!e || !t) return null;
  let n = new Set(e.records.map((e) => e.date)),
    r = t.records.filter((e) => !n.has(e.date));
  if (r.length === 0) return null;
  let i = r.reduce((e, t) => e + t.quotaAwarded, 0);
  return i > 0 ? i : null;
}

Object.assign(bgRecordsState, {
  Qr,
  $r,
  ei,
  ii,
  ai,
  oi,
  si,
  ci,
  li,
  ui,
  pi,
  mi,
  hi,
  gi,
  _i,
  vi,
  yi,
  xi,
  Si,
  Di,
  Oi,
  ki,
  Ai,
  ji,
  Mi,
  Ni,
  Li,
  Ri,
  zi,
  Bi,
  Vi,
  ha,
  ga,
  _a,
  Is,
  Ls,
  Rs,
  zs,
  Bs,
});

export async function handleRecordsMessage(e, i) {
  switch (e.type) {
    case `BALANCE_SNAPSHOT`:
      return bgPlatformState.X(async () => {
        let t = i.tab?.id;
        if (t == null) return { ok: !1, error: `缺少任务标签页` };
        let n = await bgCheckinState.V.get(t);
        if (!n || n.runId !== e.runId) return { ok: !1, error: `任务已结束` };
        if (e.phase === `button-before`) {
          let e = i.url ?? i.tab?.url;
          if (i.frameId !== 0 || !bgCheckinState.ut(n, e))
            return { ok: !1, error: `当前页面不属于顶层签到任务` };
          let t = n.effectiveCheckinMethod ?? n.site.checkin?.method;
          if (n.stage !== `checkin` || t !== `button`)
            return { ok: !1, error: `当前任务不是有效的按钮签到阶段，已拒绝写入点击基线` };
        }
        if (!(await bgCheckinState.th(n)))
          return { ok: !1, error: `账号归属已变更，已拒绝写入旧站余额` };
        if ((n.siteAccountCount ?? 0) > 1 && !n.identityConfirmed)
          return { ok: !1, error: `账号身份尚未确认，已拒绝写入余额快照` };
        if (e.phase === `relogin-before`) {
          if ((n.effectiveCheckinMethod ?? n.site.checkin?.method) !== `relogin`)
            return { ok: !1, error: `当前任务不是退出重登流程，已拒绝写入重登基线` };
          if (!(await bgCheckinState.V.saveReloginBalanceBefore(t, n.runId, e.snapshot)))
            return { ok: !1, error: `任务已结束` };
        }
        return e.phase === `button-before` &&
          !(await bgCheckinState.V.saveButtonBalanceBefore(t, n.runId, e.snapshot))
          ? { ok: !1, error: `按钮签到阶段或账号身份已变化，点击基线未写入` }
          : (await bgRecordsState.store.saveBalance(n.accountId, {
              quota: e.snapshot.quota,
              usedQuota: e.snapshot.usedQuota,
              ...(e.snapshot.symbol ? { symbol: e.snapshot.symbol } : {}),
              at: e.snapshot.at,
              source: Ni(e.snapshot.fromVisibleText),
            }),
            bgPlatformState.$(),
            { ok: !0 });
      });
    case `REFRESH_BALANCE`:
      return bgEntryState.Q(i)
        ? bgProxiesState.bh(e.accountIds)
        : { ok: !1, error: `仅扩展管理页可以刷新余额` };
    case `CHECKIN_REWARD_OBSERVATION`: {
      let n = i.tab?.id;
      if (n == null) return { ok: !1, error: `缺少标签页信息` };
      let a = await bgCheckinState.V.get(n);
      if (!a || a.runId !== e.runId) return { ok: !1, error: `任务已结束` };
      let o = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find(
        (e) => e.id === a.accountId,
      );
      if (!o) return { ok: !1, error: `账号不存在` };
      let s = bgSitesState.Y(o.siteId, await bgPlatformState.t.get(bgPlatformState.r.sites, []));
      if (!s) return { ok: !1, error: `站点配置不存在` };
      let c = ci(e.bodyText, bgCheckinState.Th(s));
      return (
        c &&
          (await bgRecordsState.store.saveCheckinReward(
            o.id,
            c.reward,
            bgPlatformState.Ci(),
            Date.now(),
            c.symbol,
          ),
          bgPlatformState.$()),
        { ok: !0 }
      );
    }
  }
}

export async function handleRecordsMutation(e) {
  switch (e.action) {
  }
}

export function initializeBackgroundRecords(step) {
  switch (step) {
    case 93: {
      bgRecordsState.Kr = [
        /(?:当前余额|账户余额|剩余额度|可用余额|余额)\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i,
        /\bbalance\b\s*[:：]?\s*(?:([$＄¥￥])|(USD|CNY|RMB))?\s*(-?\d[\d,]*(?:\.\d+)?)/i,
      ];
      break;
    }
    case 94: {
      bgRecordsState.qr = /(?:^|\n)\s*饼友\s*[·•・]\s*积分\s*[:：]?\s*(-?\d[\d,]*(?:\.\d+)?)/im;
      break;
    }
    case 95: {
      bgRecordsState.Jr = /(?:^|\n)\s*当前积分\s*[:：]?\s*(-?\d[\d,]*(?:\.\d+)?)/im;
      break;
    }
    case 96: {
      bgRecordsState.Yr = /每日签到奖励/g;
      break;
    }
    case 97: {
      bgRecordsState.Xr = /每日签到奖励\s*[+＋]\s*\d[\d,]*(?:\.\d+)?/;
      break;
    }
    case 98: {
      bgRecordsState.Zr = /((?:19|20)\d{2})\s*[\/\-.年]\s*(\d{1,2})\s*[\/\-.月]\s*(\d{1,2})\s*日?/;
      break;
    }
    case 99: {
      bgRecordsState.ti = [
        {
          pattern:
            /(?:今天|今日|today)[^\n]{0,24}?\+\s*((?:(?:[$＄¥￥]|(?:usd|cny|rmb)\s*)\s*)?\d[\d,]*(?:\.\d+)?)/i,
        },
        {
          pattern:
            /(?:签到|check[\s-]?in)[^\n]{0,24}?\+\s*((?:(?:[$＄¥￥]|(?:usd|cny|rmb)\s*)\s*)?\d[\d,]*(?:\.\d+)?)/i,
        },
        {
          pattern:
            /(?:今天|今日)\s*可得\s*[:：]?\s*((?:(?:[$＄¥￥]|(?:usd|cny|rmb)\s*)\s*)?\d[\d,]*(?:\.\d+)?)/i,
          requiresCheckedIn: !0,
        },
        {
          pattern:
            /(?:恭喜(?:获取|获得)|签到成功[^\n]{0,24}?(?:已)?获得)\s*(\d[\d,]*(?:\.\d+)?\s*积分)/i,
        },
      ];
      break;
    }
    case 100: {
      bgRecordsState.ni = /(?:今天|今日)\s*已签到|已签到\s*(?:今天|今日)|\bchecked\s+in\s+today\b/i;
      break;
    }
    case 101: {
      bgRecordsState.ri = /(?:每日签到|签到|check[\s-]?in|today\s+reward|(?:今天|今日)\s*\+)/i;
      break;
    }
    case 102: {
      bgRecordsState.di = [`/api/user/self`, `/api/user/info`];
      break;
    }
    case 103: {
      bgRecordsState.fi = [`/api/v1/check-in/status`, `/api/v1/auth/me`];
      break;
    }
    case 104: {
      bgRecordsState.bi = 1e-9;
      break;
    }
    case 105: {
      bgRecordsState.Ei = 1296e5;
      break;
    }
    case 106: {
      bgRecordsState.Pi = `已载入该账号最近一次成功余额，登录后将按总额度差计算今日增加量`;
      break;
    }
    case 107: {
      bgRecordsState.Fi = Math.round(bgRecordsState.Ei / 36e5);
      break;
    }
    case 108: {
      bgRecordsState.Ii = `该账号还没有成功读取过余额，本次只能刷新余额，无法计算登录带来的额度增加量`;
      break;
    }
    case 117: {
      bgRecordsState.pa = `手动标记为已签到`;
      break;
    }
    case 118: {
      bgRecordsState.ma = 1e-9;
      break;
    }
    case 131: {
      Object.assign(bgRecordsState.store, {
        async saveBalance(e, n) {
          return bgPlatformState.R(async () => {
            let i = await bgPlatformState.t.get(bgPlatformState.r.balances, {}),
              a = i[e],
              o = n.symbol ?? a?.symbol,
              s = o ? { ...n, symbol: o } : n,
              c = { ...(a ?? {}), ...s, daily: ji(a, s) };
            (delete c.error,
              await bgPlatformState.t.set(bgPlatformState.r.balances, { ...i, [e]: c }));
          });
        },
      });
      break;
    }
    case 132: {
      Object.assign(bgRecordsState.store, {
        async saveCheckinReward(e, n, i, a = Date.now(), o) {
          return bgPlatformState.R(async () => {
            let s = await bgPlatformState.t.get(bgPlatformState.r.balances, {}),
              c = s[e],
              l = c ?? { quota: 0, usedQuota: 0, at: a, error: `余额尚未读取` },
              u =
                o ??
                (c?.checkinRewardDay === i && c.checkinReward === n
                  ? c.checkinRewardSymbol
                  : void 0),
              d = {
                ...l,
                checkinReward: n,
                checkinRewardDay: i,
                checkinRewardAt: a,
                daily: Mi(l.daily, i, n, a, void 0, u),
              };
            (u ? (d.checkinRewardSymbol = u) : delete d.checkinRewardSymbol,
              await bgPlatformState.t.set(bgPlatformState.r.balances, { ...s, [e]: d }));
          });
        },
      });
      break;
    }
    case 133: {
      Object.assign(bgRecordsState.store, {
        async clearBalance(e) {
          return bgPlatformState.R(async () => {
            let n = await bgPlatformState.t.get(bgPlatformState.r.balances, {});
            if (!(e in n)) return;
            let i = { ...n };
            (delete i[e], await bgPlatformState.t.set(bgPlatformState.r.balances, i));
          });
        },
      });
      break;
    }
    case 134: {
      Object.assign(bgRecordsState.store, {
        async saveBalanceError(e, n) {
          return bgPlatformState.R(async () => {
            let i = await bgPlatformState.t.get(bgPlatformState.r.balances, {}),
              a = i[e];
            await bgPlatformState.t.set(bgPlatformState.r.balances, {
              ...i,
              [e]: {
                ...(a ?? {}),
                quota: a?.quota ?? 0,
                usedQuota: a?.usedQuota ?? 0,
                at: Date.now(),
                error: n,
              },
            });
          });
        },
      });
      break;
    }
  }
}

export const recordService = Object.freeze({
  getResults: () => bgPlatformState.t.get(bgPlatformState.r.results, {}),
  getBalances: () => bgPlatformState.t.get(bgPlatformState.r.balances, {}),
  saveBalance: (...args) => bgRecordsState.store.saveBalance(...args),
  saveReward: (...args) => bgRecordsState.store.saveCheckinReward(...args),
  saveBalanceError: (...args) => bgRecordsState.store.saveBalanceError(...args),
  handleMessage: handleRecordsMessage,
});
