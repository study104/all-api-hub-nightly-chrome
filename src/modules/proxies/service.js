/** 代理管理后台：导入、Clash、订阅、出口分配和浏览器代理租约。 */
import { bgAccountsState } from '../accounts/service.js';
import { bgSitesState } from '../sites/service.js';
import { bgLearningState } from '../learning/service.js';
import { bgCheckinState } from '../checkin/service.js';
import { bgRecordsState } from '../records/service.js';
import { bgPlatformState } from '../../shared/background-platform.js';
import { bgEntryState } from '../../entries/background.js';

export const bgProxiesState = { store: {} };

function he(e) {
  let t = e.trim().toLowerCase();
  return t === `localhost` || t === `127.0.0.1` || t === `::1` || t === `[::1]`;
}

function ge(e) {
  let t = String(e.scheme).trim().toLowerCase(),
    n =
      t === `socks`
        ? `socks5`
        : t === `mixed`
          ? `http`
          : t === `https` || t === `socks4` || t === `socks5`
            ? t
            : `http`;
  return n === `https` && he(e.host) ? `http` : n;
}

function _e(e) {
  let t = ge(e),
    n = String(e.host)
      .trim()
      .replace(/^\[|\]$/g, ``),
    r = Number(e.port);
  return t === e.scheme && n === e.host && r === e.port ? e : { ...e, scheme: t, host: n, port: r };
}

async function xe(e) {
  if (bgSitesState.me(e)) throw Error(bgProxiesState.be);
  let t = _e(e);
  if (!t.host || !Number.isInteger(t.port) || t.port < 1 || t.port > 65535)
    throw Error(`代理地址不完整，请重新导入或填写正确的主机和端口`);
  let n = { scheme: t.scheme, host: t.host, port: t.port };
  (await chrome.proxy.settings.set({
    value: {
      mode: `fixed_servers`,
      rules: { singleProxy: n, bypassList: [`localhost`, `127.0.0.1`, `<local>`] },
    },
    scope: `regular`,
  }),
    await Se(n));
  let r = e.username ?? ``,
    i = e.password ?? ``;
  r || i ? ((bgProxiesState.ve = { username: r, password: i }), De()) : (bgProxiesState.ve = null);
}

async function Se(e) {
  let t = await chrome.proxy.settings.get({ incognito: !1 }).catch(() => null);
  if (!t) throw Error(`无法读取浏览器代理设置，代理未生效`);
  let n = t.levelOfControl;
  if (n !== `controlled_by_this_extension`)
    throw Error(
      n === `controlled_by_other_extensions`
        ? `浏览器代理设置被其他扩展占用，本扩展改不动。请先停用那个扩展（常见的是 SwitchyOmega、各类加速器插件）`
        : n === `not_controllable`
          ? `浏览器代理设置被系统策略锁定，扩展无权修改`
          : `浏览器代理设置未被本扩展接管（${n}），代理未生效`,
    );
  let r = t.value?.rules?.singleProxy;
  if (!r || r.host !== e.host || r.port !== e.port)
    throw Error(
      `代理设置回读不一致：期望 ${e.host}:${e.port}，实际 ${r ? `${r.host}:${r.port}` : `空`}`,
    );
}

async function Ce() {
  ((bgProxiesState.ve = null), await chrome.proxy.settings.clear({ scope: `regular` }));
}

async function we() {
  let e = await chrome.proxy.settings.get({ incognito: !1 }).catch(() => null);
  if (!e || e.levelOfControl !== `controlled_by_this_extension`) return null;
  let t = e.value?.rules?.singleProxy;
  return !t?.host || !Number.isInteger(t.port)
    ? null
    : { host: String(t.host), port: Number(t.port) };
}

function Te(e, t) {
  return `本机 ${e}:${t} 上没有程序在监听 —— 内核（Clash Verge / mihomo 等）没启动，或该节点的本地端口还没生效`;
}

function Ee(e, t) {
  return t && he(t.host) ? Te(t.host, t.port) : e;
}

function De() {
  bgProxiesState.ye ||
    ((bgProxiesState.ye = !0),
    chrome.webRequest.onAuthRequired.addListener(
      (e, t) => {
        !e.isProxy || !bgProxiesState.ve
          ? t?.({})
          : t?.({ authCredentials: { ...bgProxiesState.ve } });
      },
      { urls: [`<all_urls>`] },
      [`asyncBlocking`],
    ));
}

async function ke() {
  for (let e of bgProxiesState.Oe)
    try {
      let t = new AbortController(),
        n = setTimeout(() => t.abort(), 6e3),
        r = await fetch(e.url, { signal: t.signal, cache: `no-store` });
      if ((clearTimeout(n), !r.ok)) continue;
      let i = await r.json(),
        a = i[e.ip],
        o = i[e.country];
      if (typeof a == `string` && a.trim())
        return {
          ip: a.trim(),
          ...(typeof o == `string` && o.trim() ? { country: o.trim() } : {}),
        };
    } catch {}
  return {};
}

async function Ae(e, t) {
  if (!he(e)) return;
  let n = new AbortController(),
    r = !1,
    i = setTimeout(() => {
      ((r = !0), n.abort());
    }, 2500);
  try {
    return (await fetch(`http://${e}:${t}/`, {
      signal: n.signal,
      cache: `no-store`,
      redirect: `manual`,
    }))
      ? `listening`
      : void 0;
  } catch {
    return r ? void 0 : `closed`;
  } finally {
    clearTimeout(i);
  }
}

async function je(e, t = `https://www.gstatic.com/generate_204`, n = !1, r = 12e3) {
  if (bgSitesState.me(e)) return { ok: !1, ms: 0, message: bgProxiesState.be };
  let i = Date.now(),
    a = _e(e),
    o = !1,
    s;
  try {
    (await xe(e), (o = !0), await new Promise((e) => setTimeout(e, 400)));
    let c = new AbortController();
    s = setTimeout(() => c.abort(), r);
    let l = await fetch(t, { signal: c.signal, cache: `no-store` });
    clearTimeout(s);
    let u = Date.now() - i,
      d = l.status === 204 || (l.status >= 200 && l.status < 400);
    if (!d) return { ok: d, ms: u, message: `返回 ${l.status}` };
    let f = n ? await ke() : {};
    return {
      ok: d,
      ms: u,
      message: `${a.scheme === e.scheme ? `` : `本地代理已自动改用 http，`}${f.country ? `${f.country} · ` : ``}连通，${u}ms`,
      ...f,
    };
  } catch (e) {
    let t = Date.now() - i,
      n = e instanceof Error ? e.message : String(e),
      s = Math.max(1, Math.round(r / 1e3));
    if (!o) return { ok: !1, ms: t, message: n };
    if (n.includes(`abort`)) return { ok: !1, ms: t, message: `超时（${s}s）` };
    if (he(a.host)) {
      let e = await Ae(a.host, a.port),
        n =
          e === `closed`
            ? `${a.host}:${a.port} 上没有任何程序在监听 —— Clash Verge 还没用上这份 listeners 配置(脚本没粘 / 粘错订阅 / 没重载)`
            : e === `listening`
              ? `${a.host}:${a.port} 端口正常在监听,但流量出不去 —— 多半是当前激活的订阅与脚本里的节点名对不上,或该节点已失效`
              : `探测 ${a.host}:${a.port} 是否有程序监听时超时,无法判断是端口没生效还是节点连不通；请先在 Clash Verge 里确认该端口处于监听状态`;
      return {
        ok: !1,
        ms: t,
        message: `无法通过本机代理 ${a.host}:${a.port} 连接测试地址。${n}`,
        ...(e ? { listenerProbe: e } : {}),
      };
    }
    return { ok: !1, ms: t, message: n };
  } finally {
    (s && clearTimeout(s), await Ce());
  }
}

function Me(e) {
  return !((e.activeTabId != null && e.activeTabId <= 0) || e.launchInFlight);
}

function Ne(e, t) {
  return e ? `${e}；也可能是${t}` : t;
}

function Pe(e, t, n) {
  let r = e.replace(/^net::/, ``);
  if (r === `ERR_ABORTED`) return null;
  let i = t ? `扩展代理` : `Chrome/系统网络`,
    a = t && n && he(n.host) ? Te(n.host, n.port) : null;
  return r === `ERR_PROXY_CONNECTION_FAILED`
    ? (a ?? `${i}连接失败，请检查代理协议、主机和端口`)
    : r === `ERR_TUNNEL_CONNECTION_FAILED`
      ? (a ?? `${i}无法建立 HTTPS 隧道`)
      : r === `ERR_NAME_NOT_RESOLVED`
        ? Ne(a, `站点域名解析失败`)
        : r === `ERR_CONNECTION_TIMED_OUT` || r === `ERR_TIMED_OUT`
          ? Ne(a, `连接站点超时`)
          : r === `ERR_CONNECTION_REFUSED`
            ? (a ?? `站点或代理拒绝连接`)
            : r === `ERR_CONNECTION_CLOSED`
              ? (a ?? `${i}提前关闭了连接`)
              : r === `ERR_CONNECTION_RESET`
                ? Ne(a, `连接被站点或代理重置`)
                : r === `ERR_ADDRESS_UNREACHABLE` || r === `ERR_INTERNET_DISCONNECTED`
                  ? `${i}当前不可达`
                  : r.startsWith(`ERR_CERT_`)
                    ? `站点 TLS 证书错误（${r}）`
                    : null;
}

function en(e, t, n) {
  let r = new Set([...t, ...n]);
  for (let t = Math.max(1, e); t <= bgProxiesState.$t; t++) if (!r.has(t)) return t;
  return NaN;
}

function tn(e, t = bgProxiesState.Zt, n = bgProxiesState.Xt, r = []) {
  let i = Number.isInteger(t) && t > 0 && t <= bgProxiesState.$t ? t : bgProxiesState.Zt,
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
    !t ||
      !Number.isInteger(n) ||
      n < 1 ||
      n > bgProxiesState.$t ||
      (o.has(t) || o.set(t, n), s.add(n));
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
    let r = en(i, s, n);
    !Number.isInteger(r) || r > bgProxiesState.$t
      ? (u += 1)
      : (s.add(r), l.push({ nodeName: e, port: r, listenerName: `hub-${r}` }));
  }
  return (
    l.sort((e, t) => e.port - t.port),
    {
      entries: l,
      yaml: rn(l),
      script: an(l),
      poolEntries: l.map((e) => ({
        name: e.nodeName,
        scheme: `http`,
        host: bgProxiesState.Qt,
        port: e.port,
      })),
      dropped: u,
    }
  );
}

function nn(e, t) {
  let n = new Set();
  for (let t of e) {
    let e = String(t ?? ``).trim();
    e && n.add(e);
  }
  let r = [],
    i = [],
    a = new Set();
  for (let e of t) {
    let t = String(e?.nodeName ?? ``).trim(),
      o = Number(e?.port);
    t &&
      Number.isInteger(o) &&
      (a.has(t) ||
        (a.add(t), (n.has(t) ? r : i).push({ nodeName: t, port: o, listenerName: `hub-${o}` })));
  }
  let o = [];
  for (let e of n) a.has(e) || o.push(e);
  return { kept: r, addedNames: o, removed: i };
}

function rn(e) {
  if (!e.length) return ``;
  let t = [`listeners:`];
  for (let n of e)
    t.push(
      `  - name: ${n.listenerName}`,
      `    type: mixed`,
      `    port: ${n.port}`,
      `    listen: ${bgProxiesState.Qt}`,
      `    proxy: ${sn(n.nodeName)}`,
    );
  return t.join(`
`);
}

function an(e) {
  if (!e.length) return ``;
  let t = [
    `// 由「自助签到中转站」扩展生成 —— 一节点一本地端口，按名字锁定端口不漂移。`,
    `// 粘到 Clash Verge 对应订阅的「扩展配置 → Script」里；想完全回滚就清空这个文件再重载。`,
    `function main(config) {`,
    `  if (!config) return config;`,
    `  var map = {`,
  ];
  for (let n of e) t.push(`    ${bn(n.nodeName)}: ${n.port},`);
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
}

function sn(e) {
  return `"${e
    .replace(/\\/g, `\\\\`)
    .replace(/"/g, `\\"`)
    .replace(/\t/g, `\\t`)
    .replace(/\n/g, `\\n`)
    .replace(/\r/g, `\\r`)
    .replace(bgProxiesState.on, (e) => {
      let t = e.charCodeAt(0);
      return t <= 255
        ? `\\x${t.toString(16).toUpperCase().padStart(2, `0`)}`
        : `\\u${t.toString(16).toUpperCase().padStart(4, `0`)}`;
    })}"`;
}

function cn(e, t) {
  let n = new Map(),
    r = Array.isArray(e)
      ? e
      : e && typeof e == `object` && Array.isArray(e.listeners)
        ? e.listeners
        : e && typeof e == `object` && e.listeners && typeof e.listeners == `object`
          ? Object.values(e.listeners)
          : [];
  for (let e of r) {
    if (!e || typeof e != `object`) continue;
    let r = e,
      i = typeof r.port == `number` ? r.port : Number(r.port),
      a =
        typeof r.proxy == `string` && r.proxy.trim()
          ? r.proxy.trim()
          : typeof r.name == `string` && r.name.trim()
            ? r.name.trim()
            : ``;
    Number.isInteger(i) && t.has(i) && a && n.set(i, a);
  }
  return n;
}

function mn(e) {
  let t = [],
    n = new Set();
  for (let r of hn(e)) {
    if (!yn(r)) continue;
    let e = gn(r.port);
    if (e === null || n.has(e)) continue;
    let i = _n(r.name),
      a = _n(r.proxy);
    if (!i || !a) continue;
    let o = vn(r.type);
    bgProxiesState.pn.has(o) ||
      bgProxiesState.fn.has(a.toUpperCase()) ||
      (n.add(e), t.push({ listenerName: i, nodeName: a, port: e, listenerType: o }));
  }
  return t;
}

function hn(e) {
  if (Array.isArray(e)) return e;
  if (!yn(e)) return [];
  let t = e.listeners;
  return Array.isArray(t) ? t : yn(t) ? Object.values(t) : [];
}

function gn(e) {
  return typeof e != `number` ||
    !Number.isInteger(e) ||
    e < bgProxiesState.ln ||
    e > bgProxiesState.un
    ? null
    : e;
}

function _n(e) {
  if (typeof e != `string`) return ``;
  let t = e.trim();
  return !t || t.length > bgProxiesState.dn ? `` : t;
}

function vn(e) {
  return typeof e == `string`
    ? e
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, ``)
    : ``;
}

function yn(e) {
  return !!e && typeof e == `object` && !Array.isArray(e);
}

function bn(e) {
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
      .replace(bgProxiesState.on, ``) +
    `"`
  );
}

function Cn(e) {
  let t = e.trim().toLowerCase();
  return !t || bgProxiesState.Sn.some((e) => t.includes(e.toLowerCase()));
}

function En(e) {
  let t = e.trim();
  if (!t) return { nodes: [], skipped: [], duplicates: 0, unsupportedNames: [], format: `unknown` };
  if (zn(t)) return Dn(Bn(t), `clash-yaml`);
  let n = On(t);
  if (n !== null) return Dn(An(n), `base64`);
  let r = An(t);
  return Dn(r, r.nodes.length > 0 || r.skips.length > 0 ? `uri-list` : `unknown`);
}

function Dn(e, t) {
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
        !Cn(t.name) &&
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
}

function On(e) {
  let t = e.replace(/\s+/g, ``);
  if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(t)) return null;
  try {
    let e = t.replace(/-/g, `+`).replace(/_/g, `/`),
      n = e.padEnd(Math.ceil(e.length / 4) * 4, `=`),
      r = kn(atob(n));
    return r.includes(`://`) ? r : null;
  } catch {
    return null;
  }
}

function kn(e) {
  let t = Uint8Array.from(e, (e) => e.charCodeAt(0));
  return new TextDecoder().decode(t);
}

function An(e) {
  let t = { nodes: [], skips: [] };
  for (let n of e.split(/\r?\n/)) {
    let e = n.trim().replace(/^[-*]\s+/, ``);
    if (!e || e.startsWith(`#`)) continue;
    let r = /^([a-z][a-z0-9+.-]*):\/\/(.*)$/i.exec(e);
    if (!r) {
      let n = jn(e);
      n && t.nodes.push(n);
      continue;
    }
    let i = r[1].toLowerCase(),
      a = bgProxiesState.wn[i];
    if (!a || !bgProxiesState.xn.has(a)) {
      let e = Mn(i, r[2]);
      t.skips.push({ reason: `unsupported-scheme`, scheme: i, ...(e ? { name: e } : {}) });
      continue;
    }
    let o = Nn(a, r[2]);
    o ? t.nodes.push(o) : t.skips.push({ reason: `malformed`, scheme: i });
  }
  return t;
}

function jn(e) {
  let t = /^(?:(https?|socks4|socks5|socks)\s+)?(\[[^\]]+\]|[^\s:@]+)(?::|\s+)(\d{1,5})$/i.exec(e);
  if (!t) return null;
  let n = bgProxiesState.wn[(t[1] ?? `http`).toLowerCase()],
    r = t[2],
    i = Number(t[3]);
  return !n || !r || !Number.isInteger(i) || i < 1 || i > 65535
    ? null
    : {
        name: `${r.replace(/^\[|\]$/g, ``)}:${i}`,
        scheme: ge({ scheme: n, host: r }),
        host: r.replace(/^\[|\]$/g, ``),
        port: i,
        sourceLabel: `手动导入`,
      };
}

function Mn(e, t) {
  if (e === `vmess`) {
    let e = Ln(t.split(/[?#]/)[0] ?? ``);
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
  return n < 0 ? null : Rn(t.slice(n + 1)).trim() || null;
}

function Nn(e, t) {
  let n = t.indexOf(`#`),
    r = n >= 0 ? Rn(t.slice(n + 1)).trim() : ``,
    i = n >= 0 ? t.slice(0, n) : t;
  if (((i = i.split(/[/?]/)[0] ?? ``), !i)) return null;
  let a = ``,
    o = i.lastIndexOf(`@`);
  o >= 0 && ((a = i.slice(0, o)), (i = i.slice(o + 1)));
  let s = Pn(i);
  if (!s) return null;
  let c = s.port ?? bgProxiesState.Tn[e];
  if (!Number.isInteger(c) || c <= 0 || c > 65535) return null;
  let { username: l, password: u } = In(a);
  return {
    name: r || `${s.host}:${c}`,
    scheme: ge({ scheme: e, host: s.host }),
    host: s.host,
    port: c,
    ...(l ? { username: l } : {}),
    ...(u ? { password: u } : {}),
  };
}

function Pn(e) {
  if (e.startsWith(`[`)) {
    let t = e.indexOf(`]`);
    if (t < 0) return null;
    let n = e.slice(0, t + 1),
      r = e.slice(t + 1);
    return r
      ? r.startsWith(`:`)
        ? { host: n, port: Fn(r.slice(1)) ?? void 0 }
        : null
      : { host: n };
  }
  let t = e.lastIndexOf(`:`);
  if (t < 0) return e ? { host: e } : null;
  let n = e.slice(0, t),
    r = Fn(e.slice(t + 1));
  return !n || r == null ? null : { host: n, port: r };
}

function Fn(e) {
  if (!/^\d+$/.test(e)) return null;
  let t = Number(e);
  return t > 0 && t <= 65535 ? t : null;
}

function In(e) {
  if (!e) return {};
  let t = Rn(e);
  if (!t.includes(`:`)) {
    let e = Ln(t);
    e?.includes(`:`) && (t = e);
  }
  let n = t.indexOf(`:`);
  if (n < 0) return t ? { username: t } : {};
  let r = t.slice(0, n),
    i = t.slice(n + 1);
  return { ...(r ? { username: r } : {}), ...(i ? { password: i } : {}) };
}

function Ln(e) {
  if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(e)) return null;
  try {
    let t = e.replace(/-/g, `+`).replace(/_/g, `/`);
    return kn(atob(t.padEnd(Math.ceil(t.length / 4) * 4, `=`)));
  } catch {
    return null;
  }
}

function Rn(e) {
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
}

function zn(e) {
  return /^\s*proxies\s*:/m.test(e);
}

function Bn(e) {
  let t = { nodes: [], skips: [] },
    n = e.split(/\r?\n/),
    r = !1,
    i = [],
    a = () => {
      if (!i.length) return;
      let e = Vn(
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
}

function Vn(e, t) {
  let n = Hn(e, `type`)?.toLowerCase();
  if (!n) return null;
  let r = bgProxiesState.wn[n];
  if (!r || !bgProxiesState.xn.has(r)) {
    let r = Hn(e, `name`);
    return (
      t.skips.push({ reason: `unsupported-scheme`, scheme: n, ...(r ? { name: r } : {}) }),
      null
    );
  }
  let i = Hn(e, `server`),
    a = Fn(Hn(e, `port`) ?? ``);
  if (!i || a == null) return (t.skips.push({ reason: `malformed`, scheme: n }), null);
  let o = Hn(e, `tls`)?.toLowerCase() === `true`,
    s = r === `http` && o ? `https` : r,
    c = Hn(e, `username`),
    l = Hn(e, `password`);
  return {
    name: Hn(e, `name`) || `${i}:${a}`,
    scheme: ge({ scheme: s, host: i }),
    host: i,
    port: a,
    ...(c ? { username: c } : {}),
    ...(l ? { password: l } : {}),
  };
}

function Hn(e, t) {
  let n = RegExp(`(?:^|[\\s{,])${t}\\s*:\\s*([^,}\\n]+)`, `i`).exec(e);
  if (!n) return null;
  let r = n[1]
      .trim()
      .replace(/\s+#.*$/, ``)
      .trim(),
    i = /^(['"])(.*)\1$/.exec(r);
  return (i ? i[2] : r).trim() || null;
}

function Un(e) {
  let t = String(e ?? ``).trim();
  if (!t) return null;
  let n;
  try {
    n = new URL(t);
  } catch {
    return null;
  }
  if (n.protocol !== `http:` && n.protocol !== `https:`) return null;
  let r = n.hostname.toLowerCase();
  return r === `localhost` ||
    r === `127.0.0.1` ||
    r === `::1` ||
    r === `0.0.0.0` ||
    /^10\./.test(r) ||
    /^192\.168\./.test(r) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(r) ||
    r.endsWith(`.local`) ||
    r === `169.254.169.254`
    ? null
    : n.href;
}

function Gn(e) {
  let t = e.trim().toLowerCase();
  return !t || bgProxiesState.Wn.some((e) => t.includes(e.toLowerCase()));
}

function Kn(e, t) {
  let n = En(e).unsupportedNames.filter((e) => !Gn(e)),
    r = t.filter((e) => !Gn(e.nodeName)),
    i = nn(n, r),
    a = tn([...i.kept.map((e) => e.nodeName), ...i.addedNames], void 0, void 0, r),
    o = new Set(i.addedNames);
  return {
    entries: a.entries,
    addedEntries: a.entries.filter((e) => o.has(e.nodeName)),
    removedNames: i.removed.map((e) => e.nodeName),
    poolEntries: a.poolEntries.filter((e) => o.has(e.name)),
  };
}

async function qn() {
  let e = await bgPlatformState.t.get(bgPlatformState.r.listenerPlan, []);
  return Array.isArray(e) ? e : [];
}

async function Jn(e) {
  await bgPlatformState.t.set(bgPlatformState.r.listenerPlan, [...e]);
}

function Yn() {
  let e = Promise.resolve();
  return {
    run(t) {
      let n = e.then(t, t);
      return ((e = n.catch(() => void 0)), n);
    },
  };
}

function Xn(e) {
  return e === 0;
}

function ua(e) {
  return e
    .replace(/^\s*[[［(（]\s*[A-Za-z]{2}\s*[\]］)）]\s*/u, ``)
    .replace(/[(（]\s*\d{2,5}\s*[)）]\s*$/u, ``)
    .replace(/[\s_\-—－]+/gu, ``)
    .toLowerCase()
    .trim();
}

function da(e) {
  let t = e.host.trim().toLowerCase(),
    n = t.startsWith(`[`) && t.endsWith(`]`) ? t.slice(1, -1) : t;
  return n === `localhost` || n === `127.0.0.1` || n === `::1` || n === `0:0:0:0:0:0:0:1`
    ? `local-listener:${e.port}`
    : `${e.scheme}://${n}:${e.port}`;
}

function fa(e, t) {
  let n = new Map();
  for (let t of e) {
    if (t.nameOnly !== !0) continue;
    let e = ua(t.name);
    if (!e) continue;
    let r = n.get(e) ?? [];
    (r.push(t), n.set(e, r));
  }
  let r = new Map();
  for (let t of e) {
    if (t.nameOnly === !0) continue;
    let e = da(t),
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
    let t = da(e);
    if (c.has(t)) continue;
    c.add(t);
    let l = ua(e.name),
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
}

function go(e) {
  return new Set(e.filter((e) => e.nameOnly !== !0).map((e) => e.id));
}

function _o(e, t, n, r, i) {
  let { upgrades: a, merges: o, additions: s } = fa(e, r),
    c = new Map(a.map((e) => [e.id, e.patch])),
    l = new Map(o.map(({ fromId: e, toId: t }) => [e, t])),
    u = new Set(l.keys()),
    d = (e) => (e.nameOnly ? `name:${e.name.trim()}` : da(e)),
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
    p.has(t) || (p.add(t), m.push({ ...e, id: bgPlatformState.Ti(`px`) }));
  }
  let h = i ? new Set(r.filter((e) => e.nameOnly !== !0).map(da)) : void 0,
    g = i ? new Set(r.filter((e) => e.nameOnly === !0).map((e) => ua(e.name))) : void 0,
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
        (e.nameOnly !== !0 && h?.has(da(e))) ||
        (e.nameOnly === !0 && g?.has(ua(e.name)))
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
}

function vo(e, t) {
  if (e && !t.has(e)) throw Error(`只能绑定有真实 HTTP/SOCKS 出口的代理；仅名称条目不能分配`);
}

function Xo(e) {
  let t = bgProxiesState.Yo.then(e, e);
  return (
    (bgProxiesState.Yo = t.then(
      () => void 0,
      () => void 0,
    )),
    t
  );
}

function Zo(e, t) {
  if (!e) return t == null;
  let n = _e(e);
  return t != null && t.host === n.host && t.port === n.port;
}

function Qo(e, t) {
  if (!e)
    return t == null
      ? null
      : `这个账号按配置应该直连，但浏览器此刻仍被 ${t.host}:${t.port} 这条代理接管（通常是另一个签到任务或学习会话还没结束）；已放弃开始，避免在别人的出口上演示或签到`;
  let n = _e(e),
    r = `${n.host}:${n.port}`;
  return t == null
    ? `账号配置的代理 ${r} 没有生效（浏览器此刻未走本扩展代理）；已放弃开始，避免直连泄露`
    : t.host === n.host && t.port === n.port
      ? null
      : `浏览器此刻走的是 ${t.host}:${t.port}，不是这个账号配置的 ${r}；已放弃在错误的出口上开始，避免学习与回放走的不是同一条线路`;
}

function ls(e) {
  if (typeof e != `string` && typeof e != `number`) return null;
  let t = String(e).trim();
  if (!t) return null;
  (/^\d+$/.test(t) && (t = `127.0.0.1:${t}`),
    /^[a-z][a-z\d+.-]*:\/\//i.test(t) || (t = `http://${t}`));
  try {
    let e = new URL(t);
    if (!bgProxiesState.as.has(e.protocol) || !e.hostname || e.username || e.password) return null;
    let n = e.hostname.toLowerCase().replace(/^\[|\]$/g, ``);
    return n !== `localhost` && n !== `127.0.0.1` && n !== `::1` ? null : e.origin;
  } catch {
    return null;
  }
}

function us(e) {
  if (typeof e != `string`) return {};
  let t = e.trim();
  return !t || /[\r\n]/.test(t) ? {} : { Authorization: `Bearer ${t}` };
}

function ds(e) {
  if (!ps(e) || !ps(e.proxies)) return [];
  let t = [],
    n = new Set();
  for (let [r, i] of Object.entries(e.proxies)) {
    if (!ps(i)) continue;
    let e = fs(i.type),
      a = typeof i.name == `string` && i.name.trim() ? i.name.trim() : r.trim();
    if (!a || n.has(a)) continue;
    let o = Array.isArray(i.all) || bgProxiesState.ss.has(e),
      s = bgProxiesState.os.has(e) || (!e && bgProxiesState.cs.has(a.toUpperCase()));
    o || s || (n.add(a), t.push(a));
  }
  return t;
}

function fs(e) {
  return typeof e == `string`
    ? e
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, ``)
    : ``;
}

function ps(e) {
  return !!e && typeof e == `object` && !Array.isArray(e);
}

function hs(e) {
  if (!e || typeof e != `object` || Array.isArray(e)) return !1;
  let t = e.version;
  return typeof t == `string` && t.trim().length > 0 && t.length <= 128;
}

async function gs(e, { fetcher: t = fetch, timeoutMs: n = 800 } = {}) {
  let r = e ? ls(e.address) : null;
  if (e && !r) throw Error(`Clash controller 地址无效：只允许本机 HTTP(S) 地址`);
  let i = [
      ...new Set([
        ...(r ? [r] : []),
        ...bgProxiesState.ms.map((e) => `http://127.0.0.1:${e}`),
        ...bgProxiesState.ms.map((e) => `http://[::1]:${e}`),
      ]),
    ],
    a = async (i) => {
      let a = new AbortController(),
        o = setTimeout(() => a.abort(), n);
      try {
        let n = await t(`${i}/version`, {
          signal: a.signal,
          cache: `no-store`,
          credentials: `omit`,
          redirect: `error`,
          headers: i === r ? us(e?.secret) : {},
        });
        if (n.status === 401 || n.status === 403)
          return { status: `found`, address: i, needsSecret: !0, verified: !1 };
        if (!n.ok) return null;
        let o = await n.text();
        return o.length > 4096 || !hs(JSON.parse(o))
          ? null
          : { status: `found`, address: i, needsSecret: !1, verified: !0 };
      } catch {
        return null;
      } finally {
        clearTimeout(o);
      }
    };
  if (r) {
    let e = await a(r);
    if (e) return e;
  }
  let o = await Promise.all(i.filter((e) => e !== r).map(a));
  return (
    o.find((e) => e?.verified) ??
    o.find((e) => e?.needsSecret) ?? {
      status: `not-found`,
      message: `未连接到本机 HTTP 控制接口，这不代表 Clash Verge / mihomo 未启动。Clash Verge 可能只启用了 Windows 命名管道；如需同步节点，请在 Clash Verge 设置中启用外部控制器（HTTP），例如 127.0.0.1:9097，再填写地址和密钥。仅使用当前代理出口无需控制接口，可检测本机代理端口（Verge 默认 7897）。`,
    }
  );
}

async function km(e) {
  return (
    await bgPlatformState.n.set(bgProxiesState.Dm, { kind: e, at: Date.now() }),
    async () => {
      (await bgPlatformState.n.get(bgProxiesState.Dm, null))?.kind === e &&
        (await bgPlatformState.n.remove(bgProxiesState.Dm).catch(() => {}));
    }
  );
}

async function Am() {
  let e = await bgPlatformState.n.get(bgProxiesState.Dm, null);
  return !e ||
    typeof e.kind != `string` ||
    typeof e.at != `number` ||
    Date.now() - e.at > bgProxiesState.Om
    ? null
    : e.kind === `scan`
      ? `scan`
      : e.kind === `test`
        ? `test`
        : null;
}

async function jm(e) {
  if (await bgCheckinState.Z.busy())
    return e === `scan`
      ? `签到队列正在使用网络配置，请完成后再扫描`
      : e === `queue`
        ? `签到队列正在使用网络配置`
        : `签到队列正在使用网络配置，请完成后再测试代理`;
  let { active: t } = bgLearningState.Of(Object.entries(await chrome.storage.session.get(null)));
  if (t.length > 0)
    return e === `scan`
      ? `有账号正在学习流程，学习会话占用着网络配置；请先结束学习再扫描`
      : e === `queue`
        ? `有账号正在学习流程，请先结束学习再开始签到（两者不能同时使用代理）`
        : `有账号正在学习流程，学习会话占用着网络配置；请先结束学习再测试代理`;
  let n = await Am();
  if (n) {
    let t = n === `scan` ? `本机端口扫描` : `代理测活`;
    return e === `queue`
      ? `${t}正在使用网络配置，请完成后再开始签到`
      : `${t}正在使用网络配置，请完成后再试`;
  }
  return null;
}

async function Mm(e) {
  let { active: t, expired: n } = bgLearningState.Of(
    Object.entries(await chrome.storage.session.get(null)),
  );
  for (let e of n) await bgCheckinState.Em(e);
  return t.find((t) => !e || t.accountId === e) ?? null;
}

async function oh(e, t, n, r = !1, i) {
  let a = e.trim();
  if (!he(a)) return { ok: !1, error: `只支持扫描本机地址（127.0.0.1 / localhost）` };
  let o = [...new Set(t)].filter((e) => Number.isInteger(e) && e > 0 && e <= 65535);
  if (!o.length) return { ok: !1, error: `没有要扫描的端口` };
  if (o.length > bgProxiesState.rh)
    return { ok: !1, error: `一次最多扫 ${bgProxiesState.rh} 个端口，请缩小范围` };
  let s = await sh(o, i);
  return bgPlatformState.X(async () => {
    let e = await jm(`scan`);
    if (e) return { ok: !1, error: e };
    let t = await km(`scan`);
    try {
      let e = [];
      for (let t of o.sort((e, t) => e - t)) {
        let i = await je(
          { id: `scan:${t}`, name: `${a}:${t}`, scheme: n, host: a, port: t },
          void 0,
          r,
          r ? 12e3 : bgProxiesState.ih,
        );
        e.push({
          port: t,
          ok: i.ok,
          ms: i.ms,
          message: i.message,
          ...(s.namesByPort.get(t) ? { name: s.namesByPort.get(t) } : {}),
          ...(i.ip ? { ip: i.ip } : {}),
          ...(i.country ? { country: i.country } : {}),
        });
      }
      let t = e.filter((e) => e.ok).length,
        i = e.filter((e) => e.name).length;
      return {
        ok: !0,
        feature: {
          portScan: {
            entries: e,
            live: t,
            exitChecked: r,
            ...(r ? { distinctExits: new Set(e.filter((e) => e.ip).map((e) => e.ip)).size } : {}),
            ...(i ? { named: i } : {}),
            ...(s.controllerPort ? { controllerPort: s.controllerPort } : {}),
            ...(s.controllerOrigin ? { controllerOrigin: s.controllerOrigin } : {}),
            ...(s.status ? { listenerStatus: s.status } : {}),
          },
        },
      };
    } finally {
      await t();
    }
  });
}

async function sh(e, t) {
  let n = new Set(e),
    r = t ? ls(t.address) : null;
  if (t && !r) return { namesByPort: new Map(), status: `invalid` };
  let i = r ? [r] : bgProxiesState.ms.map((e) => `http://127.0.0.1:${e}`),
    a = await Promise.all(
      i.map(async (e) => {
        let r = new AbortController(),
          i = setTimeout(() => r.abort(), bgProxiesState.ah);
        try {
          let i = await fetch(`${e}/listeners`, {
              signal: r.signal,
              cache: `no-store`,
              redirect: `error`,
              credentials: `omit`,
              headers: us(t?.secret),
            }),
            a = lh(e);
          if (i.status === 401 || i.status === 403)
            return {
              namesByPort: new Map(),
              controllerPort: a,
              controllerOrigin: e,
              status: `unauthorized`,
            };
          if (i.status === 404)
            return {
              namesByPort: new Map(),
              controllerPort: a,
              controllerOrigin: e,
              status: `unsupported`,
            };
          if (!i.ok)
            return {
              namesByPort: new Map(),
              controllerPort: a,
              controllerOrigin: e,
              status: `unavailable`,
            };
          let o = cn(await i.json(), n);
          return {
            namesByPort: o,
            controllerPort: a,
            controllerOrigin: e,
            status: o.size ? `mapped` : `empty`,
          };
        } catch {
          return { namesByPort: new Map(), controllerOrigin: e, status: `unavailable` };
        } finally {
          clearTimeout(i);
        }
      }),
    );
  return (
    a.find((e) => e.status === `mapped`) ??
    a.find((e) => e.status !== `unavailable`) ?? { namesByPort: new Map(), status: `unavailable` }
  );
}

async function ch(e) {
  let t = ls(e.address);
  if (!t)
    return { ok: !1, error: `Clash controller 地址无效，请填写端口、主机:端口或 http(s) 地址` };
  let n = new AbortController(),
    r = setTimeout(() => n.abort(), bgProxiesState.ah * 2);
  try {
    let r = await fetch(`${t}/proxies`, {
      signal: n.signal,
      cache: `no-store`,
      redirect: `error`,
      credentials: `omit`,
      headers: us(e.secret),
    });
    return r.status === 401 || r.status === 403
      ? { ok: !1, error: `Clash controller 认证失败，请检查密钥` }
      : r.status === 404
        ? { ok: !1, error: `当前 Clash/Mihomo controller 不提供 /proxies 接口` }
        : r.ok
          ? { ok: !0, feature: { clashController: { origin: t, names: ds(await r.json()) } } }
          : { ok: !1, error: `Clash controller 返回 HTTP ${r.status}` };
  } catch (e) {
    return {
      ok: !1,
      error: (e instanceof Error ? e.message : String(e)).toLowerCase().includes(`abort`)
        ? `连接 Clash controller 超时`
        : `无法连接 Clash controller，请检查地址、external-controller 和防火墙`,
    };
  } finally {
    clearTimeout(r);
  }
}

function lh(e) {
  try {
    let t = new URL(e),
      n = t.port ? Number(t.port) : t.protocol === `https:` ? 443 : 80;
    return Number.isInteger(n) ? n : void 0;
  } catch {
    return;
  }
}

async function uh(e) {
  try {
    return { ok: !0, feature: { clashControllerDetect: await gs(e) } };
  } catch (e) {
    return { ok: !1, error: e instanceof Error ? e.message : `检测 HTTP 控制接口失败` };
  }
}

function dh() {
  let e = mn;
  return typeof e == `function` ? e : void 0;
}

async function fh(e) {
  let t = ls(e.address);
  if (!t)
    return { ok: !1, error: `Clash controller 地址无效，请填写端口、主机:端口或 http(s) 地址` };
  let n = dh();
  if (!n)
    return {
      ok: !1,
      error: `BLOCKER: parseClashListenerExits 尚未导出（lib/clash/clash-listeners），无法解析内核本地出口`,
    };
  let r = new AbortController(),
    i = setTimeout(() => r.abort(), bgProxiesState.ah * 2);
  try {
    let i = await fetch(`${t}/listeners`, {
      signal: r.signal,
      cache: `no-store`,
      redirect: `error`,
      credentials: `omit`,
      headers: us(e.secret),
    });
    return i.status === 401 || i.status === 403
      ? { ok: !1, error: `内核控制器认证失败，请检查密钥` }
      : i.status === 404
        ? { ok: !1, error: `当前内核不提供 /listeners 接口` }
        : i.ok
          ? { ok: !0, feature: { clashListenerExits: { origin: t, exits: n(await i.json()) } } }
          : { ok: !1, error: `内核控制器返回 HTTP ${i.status}` };
  } catch (e) {
    return {
      ok: !1,
      error: (e instanceof Error ? e.message : String(e)).toLowerCase().includes(`abort`)
        ? `连接内核控制器超时`
        : `无法连接内核控制器，请检查地址、external-controller 和防火墙`,
    };
  } finally {
    clearTimeout(i);
  }
}

async function hh(e) {
  let t;
  try {
    t = new URL(e.trim());
  } catch {
    return { ok: !1, error: `订阅地址格式不对，请填完整的 http(s) 链接` };
  }
  if (t.protocol !== `http:` && t.protocol !== `https:`)
    return { ok: !1, error: `只支持 http/https 的订阅地址` };
  if (bgAccountsState.Rt(t.hostname)) return { ok: !1, error: `订阅地址指向本机或内网，已拒绝` };
  let n = new AbortController(),
    r = setTimeout(() => n.abort(), bgProxiesState.mh);
  try {
    let e = await fetch(t.href, { signal: n.signal, cache: `no-store` });
    if (!e.ok) return { ok: !1, error: `订阅返回 ${e.status}` };
    let r = await e.text(),
      i = new TextEncoder().encode(r).length;
    return i > bgProxiesState.ph
      ? { ok: !1, error: `订阅内容过大（超过 2MB），请确认地址是否正确` }
      : r.trim()
        ? { ok: !0, feature: { subscription: { text: r, bytes: i } } }
        : { ok: !1, error: `订阅内容为空` };
  } catch (e) {
    let t = e instanceof Error ? e.message : String(e);
    return { ok: !1, error: t.includes(`abort`) ? `拉取订阅超时（15 秒）` : `拉取失败: ${t}` };
  } finally {
    clearTimeout(r);
  }
}

async function gh() {
  let e = await bgPlatformState.t.get(bgPlatformState.r.subscriptionSource, null),
    n = e && typeof e.url == `string` ? Un(e.url) : null;
  if (!n) return { ok: !1, error: `还没有保存订阅地址:先在导入页粘一次订阅并生成配置` };
  let i = await hh(n);
  if (!i.ok)
    return (
      await bgPlatformState.t.set(bgPlatformState.r.subscriptionSource, {
        ...e,
        lastError: i.error,
      }),
      { ok: !1, error: i.error }
    );
  let a = i.feature?.subscription?.text ?? ``,
    o = await qn();
  if (!o.length) return { ok: !1, error: `还没有端口映射:先在导入页生成一次 listeners 配置` };
  let s = Kn(a, o);
  (await Jn(s.entries),
    s.poolEntries.length &&
      (await bgProxiesState.store.addProxies(
        s.poolEntries.map((e) => ({ ...e, sourceLabel: `Clash Verge` })),
      )));
  let c = Date.now();
  return (
    await bgPlatformState.t.set(bgPlatformState.r.subscriptionSource, {
      ...e,
      lastCheckedAt: c,
      lastError: void 0,
    }),
    {
      ok: !0,
      feature: {
        listenerDrift: {
          ok: !0,
          added: s.poolEntries.length,
          removed: s.removedNames.length,
          total: s.entries.length,
          checkedAt: c,
          needsResync: s.addedEntries.length > 0,
        },
      },
    }
  );
}

async function _h() {
  let e = await bgPlatformState.t.get(bgPlatformState.r.subscriptionSource, null);
  e && e.autoSync === !0 && typeof e.url == `string` && (await gh());
}

async function vh(e, n) {
  let i = (await bgPlatformState.t.get(bgPlatformState.r.accounts, [])).find((t) => t.id === e);
  if (!i) return { ok: !1, error: `账号不存在` };
  let a = await bgPlatformState.t.get(bgPlatformState.r.sites, []),
    o = bgSitesState.Y(i.siteId, a);
  if (!o) return { ok: !1, error: `站点配置不存在` };
  let s = n ?? (await bgCheckinState.Eh(o));
  if (s == null) return { ok: !1, error: `没找到该站点的标签页；请先在浏览器里打开并登录该站点` };
  let c = await chrome.scripting
    .executeScript({
      target: { tabId: s },
      world: `ISOLATED`,
      func: yh,
      args: [[...bgAccountsState.Ui], o.adapter?.siteType ?? ``],
    })
    .catch((e) => (e instanceof Error ? e.message : String(e)));
  if (typeof c == `string`) return { ok: !1, error: `无法读取该标签页：${c}` };
  let l = c[0]?.result;
  if (!l) return { ok: !1, error: `这个页面上没找到登录凭据；请确认已经登录，然后刷新页面重试` };
  let u = {
    ...(l.accessToken ? { accessToken: l.accessToken } : {}),
    ...(l.refreshToken ? { refreshToken: l.refreshToken } : {}),
    ...(l.tokenExpiresAt ? { tokenExpiresAt: l.tokenExpiresAt } : {}),
    capturedAt: Date.now(),
    ...(l.siteType ? { siteType: l.siteType } : {}),
  };
  return (
    await bgAccountsState.store.saveAccountSession(e, u),
    bgPlatformState.$(),
    { ok: !0, feature: { captured: { session: u, identity: l.identity, evidence: l.evidence } } }
  );
}

function yh(e, t) {
  let n = (e) => {
      if (typeof e == `string` && e.trim()) return e.trim();
      if (typeof e == `number` && Number.isFinite(e)) return String(e);
    },
    r = (e) => {
      let t = localStorage.getItem(e);
      if (!t) return null;
      try {
        let e = JSON.parse(t);
        return e && typeof e == `object` && !Array.isArray(e) ? e : null;
      } catch {
        return null;
      }
    },
    i = [...e.filter((e) => e.siteType === t), ...e.filter((e) => e.siteType !== t)];
  for (let e of i) {
    let t;
    if (e.tokenKey) t = localStorage.getItem(e.tokenKey)?.trim() || void 0;
    else if (e.nestedToken) {
      let i = r(e.nestedToken.key);
      for (let t of e.nestedToken.path) i = i && typeof i == `object` ? i[t] : void 0;
      t = n(i);
    }
    let i = e.userKey ? r(e.userKey) : null,
      a = { userId: n(i?.id), username: n(i?.username), email: n(i?.email) };
    if (!(t || (!e.tokenKey && !e.nestedToken && a.userId))) continue;
    let o = e.expiresKey ? localStorage.getItem(e.expiresKey) : null,
      s = o ? Number.parseInt(o, 10) : NaN;
    return {
      identity: a,
      accessToken: t,
      refreshToken: (e.refreshKey && localStorage.getItem(e.refreshKey)?.trim()) || void 0,
      tokenExpiresAt: Number.isFinite(s) ? s : void 0,
      siteType: e.siteType,
      evidence: e.evidence,
    };
  }
  return null;
}

async function bh(e) {
  return bgPlatformState.X(async () => {
    let n = await jm(`test`);
    if (n) return { ok: !1, error: n };
    let [i, a] = await Promise.all([
        bgPlatformState.t.get(bgPlatformState.r.accounts, []),
        bgPlatformState.t.get(bgPlatformState.r.sites, []),
      ]),
      o = 0,
      s = 0;
    for (let t of e) {
      let e = i.find((e) => e.id === t);
      if (!e) {
        s += 1;
        continue;
      }
      let n = bgSitesState.Y(e.siteId, a);
      n
        ? (await xh(e, n)) === `refreshed`
          ? (o += 1)
          : (s += 1)
        : (await bgRecordsState.store.saveBalanceError(t, `站点配置不存在`), (s += 1));
    }
    return (bgPlatformState.$(), { ok: !0, feature: { refreshed: o, failed: s } });
  });
}

async function xh(e, t) {
  if (!bgCheckinState.M(t))
    return (
      await bgRecordsState.store.saveBalanceError(e.id, `站点地址无效，无法读取余额`),
      `failed`
    );
  let n = await bgCheckinState.Eh(t, { preferCheckinPage: !0 });
  if (n != null) {
    let r = await bgCheckinState.Oh(e, t);
    if (r.ok && Zo(r.proxy, await we())) return Ch(e, t, n);
  }
  let r = await bgCheckinState.Oh(e, t);
  if (!r.ok) return (await bgRecordsState.store.saveBalanceError(e.id, r.error), `failed`);
  let i = await chrome.tabs.create({ url: `about:blank`, active: !1 }).catch(() => null);
  if (!i || i.id == null)
    return (await bgRecordsState.store.saveBalanceError(e.id, `无法创建标签页`), `failed`);
  let a = i.id;
  try {
    if (r.proxy && !(await bgProxiesState.W.acquire(a, r.proxy)))
      return (
        await bgRecordsState.store.saveBalanceError(e.id, `代理正被其他任务占用，请稍后再刷新`),
        `failed`
      );
    if (!r.proxy) {
      let t = Qo(void 0, await we());
      if (t) return (await bgRecordsState.store.saveBalanceError(e.id, t), `failed`);
    }
    return Zo(r.proxy, await we())
      ? (await chrome.tabs.update(a, { url: bgCheckinState.wh(t) }), await Sh(a), await Ch(e, t, a))
      : (await bgRecordsState.store.saveBalanceError(
          e.id,
          `代理未能按账号配置生效，已放弃本次余额刷新（出口不一致时读到的余额不可信）`,
        ),
        `failed`);
  } finally {
    (r.proxy && (await bgProxiesState.W.release(a).catch(() => {})),
      await bgCheckinState.Pp(a).catch(() => {}));
  }
}

async function Sh(e, t = 15e3) {
  let n = Date.now() + t;
  for (;;) {
    let t = await chrome.tabs.get(e).catch(() => null);
    if (!t || t.status === `complete` || Date.now() >= n) return;
    await new Promise((e) => setTimeout(e, 300));
  }
}

async function Ch(e, n, i) {
  let a = (() => {
      try {
        return new URL(n.loginUrl).hostname.toLowerCase() === `www.hvoy.ai`;
      } catch {
        return !1;
      }
    })(),
    o = (a ? [] : bgRecordsState.vi(n)).filter((e) => bgCheckinState.N(n, e)),
    s = bgRecordsState._i(n),
    c = await chrome.scripting
      .executeScript({
        target: { tabId: i },
        world: `ISOLATED`,
        func: bgRecordsState.Si,
        args: [o, [...bgSitesState.ar], a, s, bgSitesState.mr(n)],
      })
      .catch((e) => (e instanceof Error ? e.message : String(e)));
  if (typeof c == `string`)
    return (
      await bgRecordsState.store.saveBalanceError(e.id, `无法读取该站点页面：${c}`),
      `failed`
    );
  let l = c[0]?.result;
  if (!l)
    return (await bgRecordsState.store.saveBalanceError(e.id, `页面没有返回余额数据`), `failed`);
  let u = l.payloads.flatMap((e) => {
      if (!e.json) return [];
      try {
        return [{ path: e.path, value: JSON.parse(e.text) }];
      } catch {
        return [];
      }
    }),
    d = l.crossOrigin ? bgRecordsState.gi(l.crossOrigin.contentType, l.crossOrigin.base64) : null,
    f =
      u
        .filter((e) => /\/(?:auth\/me|user\/(?:self|info))(?:\/|\?|#|$)/i.test(e.path))
        .map((e) => bgAccountsState.xr(e.value))
        .find((e) => !!e) ?? (d == null ? void 0 : (bgAccountsState.xr(d) ?? void 0)),
    p = f ? { ...f, source: `api` } : bgAccountsState.Sr(l.bodyText),
    [m, h] = await Promise.all([
      bgPlatformState.t.get(bgPlatformState.r.accounts, []),
      bgPlatformState.t.get(bgPlatformState.r.sites, []),
    ]),
    g = bgLearningState.Kp(m, h, n),
    _ = Object.fromEntries(
      g
        .filter((t) => t.id !== e.id && t.identity?.userId)
        .map((e) => [e.identity.userId, e.label || e.username]),
    ),
    v = e.identity?.userId ? _[e.identity.userId] : void 0,
    y = bgAccountsState.Rr(e.username, l.bodyText)?.matched,
    b = bgAccountsState.jt(e, n).loginMethod === `github` ? e.githubUsername?.trim() : void 0,
    x = e.identity?.source === `api` ? e.identity : void 0,
    S = bgAccountsState.Ur(p, e.username, v ? void 0 : e.identity?.userId, {
      knownUsers: _,
      ...(y ? { pageAccountMatch: y } : {}),
      ...(b ? { expectedAliases: [b] } : {}),
      ...(x?.username || x?.email
        ? {
            expectedIdentity: {
              ...(x.username ? { username: x.username } : {}),
              ...(x.email ? { email: x.email } : {}),
            },
          }
        : {}),
    });
  if (S.match === `mismatch` || (g.length > 1 && S.match !== `confirmed`))
    return (
      await bgRecordsState.store.clearBalance(e.id),
      await bgRecordsState.store.saveBalanceError(
        e.id,
        `余额刷新已停止：当前页面身份未通过账号 ${e.username} 的核对（${S.detail}）`,
      ),
      `failed`
    );
  S.match === `confirmed` &&
    p?.source === `api` &&
    (await bgAccountsState.store.saveAccountIdentity(e.id, p, { preserveBinding: !0 }));
  let C = Date.now(),
    w = bgRecordsState.ci(l.bodyText, bgCheckinState.Th(n));
  w != null &&
    (await bgRecordsState.store.saveCheckinReward(
      e.id,
      w.reward,
      bgPlatformState.Ci(),
      C,
      w.symbol,
    ));
  for (let t of u) {
    let r = t.value,
      i = bgRecordsState.li(r, bgCheckinState.Th(n)),
      a = bgRecordsState.ai(w, i);
    a != null &&
      (!w || a.reward !== w.reward || a.symbol !== w.symbol) &&
      ((w = a),
      await bgRecordsState.store.saveCheckinReward(
        e.id,
        a.reward,
        bgPlatformState.Ci(),
        C,
        a.symbol,
      ));
    let o = bgRecordsState.mi(r);
    if (o)
      return (
        await bgRecordsState.store.saveBalance(e.id, {
          quota: o.quota,
          usedQuota: o.usedQuota,
          ...(o.symbol ? { symbol: o.symbol } : {}),
          at: C,
          source: `api`,
        }),
        `refreshed`
      );
  }
  let T = d == null ? null : bgRecordsState.hi(d);
  if (T)
    return (
      await bgRecordsState.store.saveBalance(e.id, {
        quota: T.quota,
        usedQuota: T.usedQuota,
        ...(T.symbol ? { symbol: T.symbol } : {}),
        at: C,
        source: `api`,
      }),
      `refreshed`
    );
  let E = bgRecordsState.ui(l.bodyText, n.adapter?.quotaPerUnit);
  return E
    ? (await bgRecordsState.store.saveBalance(e.id, {
        quota: E.quota,
        usedQuota: E.usedQuota,
        ...(E.symbol ? { symbol: E.symbol } : {}),
        at: C,
        source: `visible`,
      }),
      `refreshed`)
    : (await bgRecordsState.store.saveBalanceError(
        e.id,
        l.payloads.length
          ? `站点返回的数据里没有余额字段`
          : `读不到余额：可能登录态已失效，或该站点没有余额接口`,
      ),
      `failed`);
}

Object.assign(bgProxiesState, {
  he,
  ge,
  _e,
  xe,
  Se,
  Ce,
  we,
  Te,
  Ee,
  De,
  ke,
  Ae,
  je,
  Me,
  Ne,
  Pe,
  en,
  tn,
  nn,
  rn,
  an,
  sn,
  cn,
  mn,
  hn,
  gn,
  _n,
  vn,
  yn,
  bn,
  Cn,
  En,
  Dn,
  On,
  kn,
  An,
  jn,
  Mn,
  Nn,
  Pn,
  Fn,
  In,
  Ln,
  Rn,
  zn,
  Bn,
  Vn,
  Hn,
  Un,
  Gn,
  Kn,
  qn,
  Jn,
  Yn,
  Xn,
  ua,
  da,
  fa,
  go,
  _o,
  vo,
  Xo,
  Zo,
  Qo,
  ls,
  us,
  ds,
  fs,
  ps,
  hs,
  gs,
  km,
  Am,
  jm,
  Mm,
  oh,
  sh,
  ch,
  lh,
  uh,
  dh,
  fh,
  hh,
  gh,
  _h,
  vh,
  yh,
  bh,
  xh,
  Sh,
  Ch,
});

export async function handleProxiesMessage(e, i) {
  switch (e.type) {
    case `TEST_PROXY`:
      return bgEntryState.Q(i)
        ? bgSitesState.me(e.proxy)
          ? {
              ok: !0,
              test: { ok: !1, ms: 0, message: `这是订阅节点名称，没有可用的浏览器代理出口` },
            }
          : bgPlatformState.X(async () => {
              let t = await jm(`test`);
              if (t) return { ok: !1, error: t };
              let n = await km(`test`);
              try {
                return { ok: !0, test: await je(e.proxy) };
              } finally {
                await n();
              }
            })
        : { ok: !1, error: `仅扩展管理页可以测试代理` };
    case `SCAN_LOCAL_PORTS`:
      return bgEntryState.Q(i)
        ? oh(e.host, e.ports, e.scheme, e.withExit === !0, e.controller)
        : { ok: !1, error: `仅扩展管理页可以扫描本机端口` };
    case `READ_CLASH_PROXIES`:
      return bgEntryState.Q(i)
        ? ch(e.controller)
        : { ok: !1, error: `仅扩展管理页可以读取 Clash 节点` };
    case `DETECT_CLASH_CONTROLLER`:
      return bgEntryState.Q(i)
        ? uh(e.controller)
        : { ok: !1, error: `仅扩展管理页可以读取内核信息` };
    case `READ_CLASH_LISTENER_EXITS`:
      return bgEntryState.Q(i)
        ? fh(e.controller)
        : { ok: !1, error: `仅扩展管理页可以读取内核信息` };
    case `SYNC_CLASH_PROXIES`:
      return bgEntryState.Q(i)
        ? {
            ok: !0,
            feature: { clashConfigSync: await bgProxiesState.store.syncClashProxies(e.inputs) },
          }
        : { ok: !1, error: `仅扩展管理页可以同步 Clash 配置` };
    case `FETCH_SUBSCRIPTION`:
      return bgEntryState.Q(i) ? hh(e.url) : { ok: !1, error: `仅扩展管理页可以拉取订阅` };
    case `CHECK_LISTENER_DRIFT`:
      return bgEntryState.Q(i) ? gh() : { ok: !1, error: `仅扩展管理页可以检查订阅更新` };
  }
}

export async function handleProxiesMutation(e) {
  switch (e.action) {
    case `add-proxy`:
      return (await bgProxiesState.store.addProxy(e.input), { ok: !0 });
    case `add-proxies`:
      return { ok: !0, ...(await bgProxiesState.store.addProxies(e.inputs)) };
    case `update-proxy`:
      return (await bgProxiesState.store.updateProxy(e.proxyId, e.patch), { ok: !0 });
    case `remove-proxy`:
      return (await bgProxiesState.store.removeProxy(e.proxyId), { ok: !0 });
    case `assign-account-proxies`:
      return { ok: !0, ...(await bgProxiesState.store.assignAccountProxies(e.assignments)) };
  }
}

export function initializeBackgroundProxies(step) {
  switch (step) {
    case 37: {
      bgProxiesState.ve = null;
      break;
    }
    case 38: {
      bgProxiesState.ye = !1;
      break;
    }
    case 39: {
      bgProxiesState.be = `这是订阅节点名称，没有可用的浏览器代理出口`;
      break;
    }
    case 40: {
      bgProxiesState.Oe = [
        { url: `https://ipapi.co/json/`, ip: `ip`, country: `country_name` },
        { url: `https://ipwho.is/`, ip: `ip`, country: `country` },
      ];
      break;
    }
    case 58: {
      bgProxiesState.Yt = 7901;
      break;
    }
    case 59: {
      bgProxiesState.Xt = [
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
    case 60: {
      bgProxiesState.Zt = bgProxiesState.Yt;
      break;
    }
    case 61: {
      bgProxiesState.Qt = `127.0.0.1`;
      break;
    }
    case 62: {
      bgProxiesState.$t = 65535;
      break;
    }
    case 63: {
      bgProxiesState.on = RegExp(`[\\u0000-\\u001f\\u007f\\u0085\u2028\u2029]`, `g`);
      break;
    }
    case 64: {
      bgProxiesState.ln = 1;
      break;
    }
    case 65: {
      bgProxiesState.un = 65535;
      break;
    }
    case 66: {
      bgProxiesState.dn = 200;
      break;
    }
    case 67: {
      bgProxiesState.fn = new Set([
        `COMPATIBLE`,
        `DIRECT`,
        `GLOBAL`,
        `PASS`,
        `REJECT`,
        `REJECT-DROP`,
      ]);
      break;
    }
    case 68: {
      bgProxiesState.pn = new Set([`compatible`, `direct`, `pass`, `reject`, `rejectdrop`]);
      break;
    }
    case 69: {
      bgProxiesState.xn = new Set([`http`, `https`, `socks4`, `socks5`]);
      break;
    }
    case 70: {
      bgProxiesState.Sn = [
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
    case 71: {
      bgProxiesState.wn = {
        http: `http`,
        https: `https`,
        socks: `socks5`,
        socks4: `socks4`,
        socks5: `socks5`,
        socks5h: `socks5`,
      };
      break;
    }
    case 72: {
      bgProxiesState.Tn = { http: 80, https: 443, socks4: 1080, socks5: 1080 };
      break;
    }
    case 73: {
      bgProxiesState.Wn = [
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
        `发布页`,
        `频道`,
      ];
      break;
    }
    case 140: {
      Object.assign(bgProxiesState.store, {
        addProxy(e) {
          return bgPlatformState.R(async () => {
            let n = await bgPlatformState.t.get(bgPlatformState.r.proxies, []);
            await bgPlatformState.t.set(
              bgPlatformState.r.proxies,
              n.concat({ ...e, id: bgPlatformState.Ti(`px`) }),
            );
          });
        },
      });
      break;
    }
    case 141: {
      Object.assign(bgProxiesState.store, {
        addProxies(e) {
          return bgPlatformState.R(async () => {
            let [n, i, a] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.proxies, []),
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
              ]),
              o = _o(n, i, a, e);
            if (o.changed) {
              let e = { [bgPlatformState.r.proxies]: o.proxies };
              (o.accounts.some((e, t) => e !== i[t]) &&
                (e[bgPlatformState.r.accounts] = o.accounts),
                o.sites.some((e, t) => e !== a[t]) && (e[bgPlatformState.r.sites] = o.sites),
                await bgPlatformState.t.setMany(e));
            }
            return { added: o.added, skipped: o.skipped, upgraded: o.upgraded };
          });
        },
      });
      break;
    }
    case 142: {
      Object.assign(bgProxiesState.store, {
        syncClashProxies(e) {
          return bgPlatformState.R(async () => {
            let [n, i, a] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.proxies, []),
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
              ]),
              o = _o(n, i, a, e, `Clash Verge`);
            return (
              o.changed &&
                (await bgPlatformState.t.setMany({
                  [bgPlatformState.r.proxies]: o.proxies,
                  [bgPlatformState.r.accounts]: o.accounts,
                  [bgPlatformState.r.sites]: o.sites,
                })),
              {
                added: o.added,
                skipped: o.skipped,
                upgraded: o.upgraded,
                removed: o.removed,
                keptInUse: o.keptInUse,
              }
            );
          });
        },
      });
      break;
    }
    case 143: {
      Object.assign(bgProxiesState.store, {
        updateProxy(e, n) {
          return bgPlatformState.R(async () => {
            let i = await bgPlatformState.t.get(bgPlatformState.r.proxies, []);
            await bgPlatformState.t.set(
              bgPlatformState.r.proxies,
              i.map((t) => (t.id === e ? { ...t, ...n } : t)),
            );
          });
        },
      });
      break;
    }
    case 144: {
      Object.assign(bgProxiesState.store, {
        removeProxy(e) {
          return bgPlatformState.R(async () => {
            let [n, i, a] = await Promise.all([
              bgPlatformState.t.get(bgPlatformState.r.proxies, []),
              bgPlatformState.t.get(bgPlatformState.r.sites, []),
              bgPlatformState.t.get(bgPlatformState.r.accounts, []),
            ]);
            await bgPlatformState.t.setMany({
              [bgPlatformState.r.proxies]: n.filter((t) => t.id !== e),
              [bgPlatformState.r.sites]: i.map((t) =>
                t.proxyId === e ? { ...t, proxyId: void 0 } : t,
              ),
              [bgPlatformState.r.accounts]: a.map((t) => {
                if (t.proxyId !== e) return t;
                let n = { ...t, proxyMode: `inherit` };
                return (delete n.proxyId, n);
              }),
            });
          });
        },
      });
      break;
    }
    case 145: {
      Object.assign(bgProxiesState.store, {
        assignAccountProxies(e) {
          return bgPlatformState.R(async () => {
            let [n, i] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, []),
              ]),
              a = go(i),
              o = new Map(e.filter((e) => a.has(e.proxyId)).map((e) => [e.accountId, e]));
            if (!o.size) return { assigned: 0 };
            let s = 0,
              c = n.map((e) => {
                let t = o.get(e.id);
                if (!t) return e;
                s += 1;
                let n = bgAccountsState.yo(e, { proxyMode: `pool`, proxyId: t.proxyId });
                if (t.pinned) return { ...n, proxyPinned: !0 };
                let { proxyPinned: r, ...i } = n;
                return i;
              });
            return (
              s && (await bgPlatformState.t.set(bgPlatformState.r.accounts, c)),
              { assigned: s }
            );
          });
        },
      });
      break;
    }
    case 169: {
      bgProxiesState.U = `proxyHolderTabId`;
      break;
    }
    case 170: {
      bgProxiesState.Yo = Promise.resolve();
      break;
    }
    case 171: {
      bgProxiesState.W = {
        holder() {
          return Xo(() => bgPlatformState.n.get(bgProxiesState.U, null));
        },
        acquire(e, t) {
          return Xo(async () => {
            let r = await bgPlatformState.n.get(bgProxiesState.U, null);
            if (r != null && r !== e) {
              if (
                await chrome.tabs
                  .get(r)
                  .then(() => !0)
                  .catch(() => !1)
              )
                return !1;
              (await Ce(), await bgPlatformState.n.remove(bgProxiesState.U));
            }
            await bgPlatformState.n.set(bgProxiesState.U, e);
            try {
              return (await xe(t), !0);
            } catch (t) {
              throw (
                await Ce().catch(() => {}),
                (await bgPlatformState.n.get(bgProxiesState.U, null)) === e &&
                  (await bgPlatformState.n.remove(bgProxiesState.U)),
                t
              );
            }
          });
        },
        transfer(e, t) {
          return Xo(async () => {
            if (e === t) return !0;
            let r = await bgPlatformState.n.get(bgProxiesState.U, null);
            return r === t
              ? chrome.tabs
                  .get(t)
                  .then(() => !0)
                  .catch(() => !1)
              : r !== e ||
                  !(await chrome.tabs
                    .get(t)
                    .then(() => !0)
                    .catch(() => !1))
                ? !1
                : (await bgPlatformState.n.set(bgProxiesState.U, t), !0);
          });
        },
        release(e) {
          return Xo(async () => {
            let t = await bgPlatformState.n.get(bgProxiesState.U, null);
            if (t !== e) {
              if (
                t == null ||
                (await chrome.tabs
                  .get(t)
                  .then(() => !0)
                  .catch(() => !1))
              )
                return;
              (await Ce(), await bgPlatformState.n.remove(bgProxiesState.U));
            } else (await Ce(), await bgPlatformState.n.remove(bgProxiesState.U));
          });
        },
        recover(e = []) {
          return Xo(async () => {
            let t = await bgPlatformState.n.get(bgProxiesState.U, null);
            (t != null &&
              e.includes(t) &&
              (await chrome.tabs
                .get(t)
                .then(() => !0)
                .catch(() => !1))) ||
              (t != null && (await Ce(), await bgPlatformState.n.remove(bgProxiesState.U)));
          });
        },
      };
      break;
    }
    case 172: {
      bgProxiesState.as = new Set([`http:`, `https:`]);
      break;
    }
    case 173: {
      bgProxiesState.os = new Set([`compatible`, `direct`, `pass`, `reject`, `rejectdrop`]);
      break;
    }
    case 174: {
      bgProxiesState.ss = new Set([
        `fallback`,
        `loadbalance`,
        `relay`,
        `selector`,
        `smart`,
        `urltest`,
      ]);
      break;
    }
    case 175: {
      bgProxiesState.cs = new Set([
        `COMPATIBLE`,
        `DIRECT`,
        `GLOBAL`,
        `PASS`,
        `REJECT`,
        `REJECT-DROP`,
      ]);
      break;
    }
    case 176: {
      bgProxiesState.ms = [9097, 9090, 9095, 9096, 9091, 9092, 9093, 9094, 9098, 9099];
      break;
    }
    case 300: {
      bgProxiesState.Bp = `listener-sync`;
      break;
    }
    case 314: {
      bgProxiesState.Dm = `networkToolLock`;
      break;
    }
    case 315: {
      bgProxiesState.Om = 3e5;
      break;
    }
    case 318: {
      bgProxiesState.rh = 64;
      break;
    }
    case 319: {
      bgProxiesState.ih = 8e3;
      break;
    }
    case 320: {
      bgProxiesState.ah = 1500;
      break;
    }
    case 321: {
      bgProxiesState.ph = 2097152;
      break;
    }
    case 322: {
      bgProxiesState.mh = 15e3;
      break;
    }
  }
}

export const proxyService = Object.freeze({
  list: () => bgPlatformState.t.get(bgPlatformState.r.proxies, []),
  add: (...args) => bgProxiesState.store.addProxy(...args),
  importMany: (...args) => bgProxiesState.store.addProxies(...args),
  update: (...args) => bgProxiesState.store.updateProxy(...args),
  remove: (...args) => bgProxiesState.store.removeProxy(...args),
  assignAccounts: (...args) => bgProxiesState.store.assignAccountProxies(...args),
  acquire: (...args) => bgProxiesState.W.acquire(...args),
  transfer: (...args) => bgProxiesState.W.transfer(...args),
  release: (...args) => bgProxiesState.W.release(...args),
  recover: (...args) => bgProxiesState.W.recover(...args),
  handleMessage: handleProxiesMessage,
  handleMutation: handleProxiesMutation,
});
