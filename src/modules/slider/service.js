/** 滑块验证后台：图片匹配、拖动轨迹、验证码框架会话及失败回报。 */
import { bgCheckinState } from '../checkin/service.js';
import { bgPlatformState } from '../../shared/background-platform.js';

export const bgSliderState = { store: {} };

function $c(e, t) {
  return { width: e, height: t, data: new Uint8ClampedArray(e * t * 4) };
}

function el(e, t) {
  let n = Math.max(1, Math.round(t.width)),
    r = Math.max(1, Math.round(t.height)),
    i = $c(n, r),
    a = Math.round(t.x),
    o = Math.round(t.y);
  for (let t = 0; t < r; t += 1) {
    let r = o + t;
    if (!(r < 0 || r >= e.height))
      for (let o = 0; o < n; o += 1) {
        let s = a + o;
        if (s < 0 || s >= e.width) continue;
        let c = (r * e.width + s) * 4,
          l = (t * n + o) * 4;
        ((i.data[l] = e.data[c]),
          (i.data[l + 1] = e.data[c + 1]),
          (i.data[l + 2] = e.data[c + 2]),
          (i.data[l + 3] = e.data[c + 3]));
      }
  }
  return i;
}

function tl(e, t) {
  let n = t * 4;
  return 0.299 * e[n] + 0.587 * e[n + 1] + 0.114 * e[n + 2];
}

function nl(e) {
  let t = new Float32Array(e.width * e.height);
  for (let n = 0; n < t.length; n += 1) t[n] = tl(e.data, n);
  return t;
}

function rl(e, t, n, r, i) {
  let a = e[n],
    o = n % t,
    s = Math.floor(n / t),
    c = -1 / 0,
    l = 0;
  for (let n = 0; n < e.length; n += 1) {
    let a = e[n];
    if (!Number.isFinite(a)) continue;
    l += 1;
    let u = n % t,
      d = Math.floor(n / t);
    (Math.abs(u - o) <= r && Math.abs(d - s) <= i) || (a > c && (c = a));
  }
  return Number.isFinite(c)
    ? { margin: Math.max(0, a - c), candidateCount: l }
    : { candidateCount: l };
}

function il(e, t, n = 0.4) {
  let r = e.width,
    i = e.height,
    a = t.width,
    o = t.height;
  if (a > r || o > i || a < 1 || o < 1) return null;
  let s = a * o,
    c = [],
    l = 0;
  for (let e = 0; e < s; e += 1) {
    if (t.data[e * 4 + 3] < 32) continue;
    let n = tl(t.data, e);
    (c.push({ x: e % a, y: Math.floor(e / a), value: n, centered: 0 }), (l += n));
  }
  let u = c.length;
  if (u === 0) return null;
  let d = l / u,
    f = 0;
  for (let e of c) ((e.centered = e.value - d), (f += e.centered ** 2));
  let p = Math.sqrt(f / u),
    m = nl(e),
    h = r - a,
    g = i - o,
    _ = h + 1,
    v = new Float32Array(_ * (g + 1));
  v.fill(-1 / 0);
  let y = -1,
    b = -1 / 0,
    x = u === s,
    S,
    C,
    w = r + 1;
  if (x) {
    ((S = new Float64Array(w * (i + 1))), (C = new Float64Array(w * (i + 1))));
    for (let e = 0; e < i; e += 1) {
      let t = 0,
        n = 0;
      for (let i = 0; i < r; i += 1) {
        let a = m[e * r + i];
        ((t += a), (n += a * a));
        let o = (e + 1) * w + i + 1;
        ((S[o] = S[e * w + i + 1] + t), (C[o] = C[e * w + i + 1] + n));
      }
    }
  }
  let T = (e, t) => {
      let n = e + a,
        r = t + o,
        i = S[r * w + n] - S[t * w + n] - S[r * w + e] + S[t * w + e],
        s = C[r * w + n] - C[t * w + n] - C[r * w + e] + C[t * w + e],
        c = i / u;
      return { mean: c, variance: Math.max(0, s / u - c * c) };
    },
    E = (e, t) => {
      if (x) {
        let n = T(e, t);
        if (p < 1) return 1 - Math.abs(n.mean - d) / 255 - (0.3 * Math.sqrt(n.variance)) / 255;
        let i = Math.sqrt(n.variance);
        if (i < 1) return null;
        let a = 0;
        for (let i of c) {
          let o = m[(t + i.y) * r + e + i.x];
          a += i.centered * (o - n.mean);
        }
        return a / (u * p * i);
      }
      let n = 0;
      for (let i of c) n += m[(t + i.y) * r + e + i.x];
      let i = n / u;
      if (p < 1) {
        let n = 0;
        for (let i of c) {
          let a = m[(t + i.y) * r + e + i.x];
          n += a * a;
        }
        let a = Math.max(0, n / u - i * i);
        return 1 - Math.abs(i - d) / 255 - (0.3 * Math.sqrt(a)) / 255;
      }
      let a = 0,
        o = 0;
      for (let n of c) {
        let s = m[(t + n.y) * r + e + n.x];
        ((o += n.centered * (s - i)), (a += (s - i) ** 2));
      }
      let s = Math.sqrt(a / u);
      return s < 1 ? null : o / (u * p * s);
    };
  if (p < 1) {
    let e = 0,
      t = 0;
    for (let n of m) ((e += n), (t += n * n));
    let n = e / m.length,
      r = Math.max(0, t / m.length - n * n);
    if (Math.sqrt(r) < 1 && Math.abs(n - d) < 1) return null;
    for (let e = 0; e <= g; e += 1)
      for (let t = 0; t <= h; t += 1) {
        let n = E(t, e);
        if (n == null) continue;
        let r = e * _ + t;
        ((v[r] = n), n > b && ((b = n), (y = r)));
      }
  } else
    for (let e = 0; e <= g; e += 1)
      for (let t = 0; t <= h; t += 1) {
        let n = E(t, e);
        if (n == null) continue;
        let r = e * _ + t;
        ((v[r] = n), n > b && ((b = n), (y = r)));
      }
  if (y < 0 || b < n) return null;
  let D = rl(v, _, y, Math.max(2, Math.round(a * 0.25)), Math.max(2, Math.round(o * 0.25)));
  return {
    x: y % _,
    y: Math.floor(y / _),
    confidence: b,
    confidenceMargin: D.margin,
    candidateCount: D.candidateCount,
  };
}

function al(e) {
  let t = e.width,
    n = e.height,
    r = -1,
    i = -1,
    a = 0,
    o = 0;
  for (let s = 0; s < e.height; s += 1)
    for (let c = 0; c < e.width; c += 1)
      e.data[(s * e.width + c) * 4 + 3] < 24
        ? (a += 1)
        : ((o += 1),
          (t = Math.min(t, c)),
          (n = Math.min(n, s)),
          (r = Math.max(r, c)),
          (i = Math.max(i, s)));
  let s = e.width * e.height;
  if (!(a / Math.max(1, s) >= 0.08 && o / Math.max(1, s) >= 0.015) || r < t || i < n)
    return {
      image: e,
      originalWidth: e.width,
      originalHeight: e.height,
      bounds: { x: 0, y: 0, width: e.width, height: e.height },
      shapedAlpha: !1,
    };
  let c = Math.max(0, t - 1),
    l = Math.max(0, n - 1),
    u = Math.min(e.width - 1, r + 1),
    d = Math.min(e.height - 1, i + 1),
    f = { x: c, y: l, width: u - c + 1, height: d - l + 1 };
  return {
    image: el(e, f),
    originalWidth: e.width,
    originalHeight: e.height,
    bounds: f,
    shapedAlpha: !0,
  };
}

function ol(e) {
  let { width: t, height: n } = e,
    r = new Uint8Array(t * n),
    i = new Int32Array(t * n),
    a = 0,
    o = 0,
    s = (t) => {
      r[t] || e.data[t * 4 + 3] >= 32 || ((r[t] = 1), (i[o++] = t));
    };
  for (let e = 0; e < t; e += 1) (s(e), s((n - 1) * t + e));
  for (let e = 0; e < n; e += 1) (s(e * t), s(e * t + t - 1));
  for (; a < o;) {
    let e = i[a++],
      n = e % t;
    (n > 0 && s(e - 1), n + 1 < t && s(e + 1), e >= t && s(e - t), e + t < r.length && s(e + t));
  }
  let c = new Uint8ClampedArray(e.data);
  for (let e = 0; e < r.length; e += 1) !r[e] && c[e * 4 + 3] < 32 && (c[e * 4 + 3] = 255);
  return { width: t, height: n, data: c };
}

function sl(e) {
  let { width: t, height: n } = e;
  if (t < 12 || n < 12) return null;
  let r = [[], [], []],
    i = (n, i) => {
      let a = (i * t + n) * 4;
      (r[0].push(e.data[a]), r[1].push(e.data[a + 1]), r[2].push(e.data[a + 2]));
    };
  for (let e = 0; e < t; e += 1) for (let t = 0; t < 2; t += 1) (i(e, t), i(e, n - 1 - t));
  for (let e = 2; e < n - 2; e += 1) for (let n = 0; n < 2; n += 1) (i(n, e), i(t - 1 - n, e));
  if (r[0].length < 24) return null;
  let a = (e) => {
      let t = [...e].sort((e, t) => e - t);
      return t[Math.floor(t.length / 2)];
    },
    o = [a(r[0]), a(r[1]), a(r[2])],
    s = a(r[0].map((e) => Math.abs(e - o[0]))),
    c = Math.max(26, Math.min(80, s * 2.6 + 22)),
    l = $c(t, n),
    u = 0;
  for (let r = 0; r < t * n; r += 1) {
    let t = r * 4,
      n =
        (Math.abs(e.data[t] - o[0]) +
          Math.abs(e.data[t + 1] - o[1]) +
          Math.abs(e.data[t + 2] - o[2])) /
          3 >=
        c;
    ((l.data[t] = e.data[t]),
      (l.data[t + 1] = e.data[t + 1]),
      (l.data[t + 2] = e.data[t + 2]),
      (l.data[t + 3] = n ? 255 : 0),
      n && (u += 1));
  }
  let d = u / (t * n);
  return d < 0.18 || d > 0.9 ? null : ol(l);
}

function cl(e) {
  let t = new Uint8Array(256);
  for (let e = 0; e < 64; e += 1)
    t[`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`.charCodeAt(e)] = e;
  let n = e.length;
  for (; n > 0 && e[n - 1] === `=`;) --n;
  let r = Math.floor((n * 3) / 4),
    i = new Uint8Array(r),
    a = 0;
  for (let o = 0; o < n; o += 4) {
    let n = t[e.charCodeAt(o)],
      s = t[e.charCodeAt(o + 1)],
      c = t[e.charCodeAt(o + 2)],
      l = t[e.charCodeAt(o + 3)];
    ((i[a++] = (n << 2) | (s >> 4)),
      a < r && (i[a++] = ((s & 15) << 4) | (c >> 2)),
      a < r && (i[a++] = ((c & 3) << 6) | l));
  }
  return i;
}

async function ll(e) {
  if (e.size > bgSliderState.Xc) throw Error(`滑块图片超过允许大小`);
  let t = await createImageBitmap(e);
  try {
    if (
      !Number.isFinite(t.width) ||
      !Number.isFinite(t.height) ||
      t.width < 1 ||
      t.height < 1 ||
      t.width * t.height > bgSliderState.Zc
    )
      throw Error(`滑块图片解码尺寸无效或超过允许大小`);
    let e = new OffscreenCanvas(t.width, t.height).getContext(`2d`);
    if (!e) throw Error(`无法创建滑块图像上下文`);
    e.drawImage(t, 0, 0);
    let n = e.getImageData(0, 0, t.width, t.height);
    return { width: n.width, height: n.height, data: n.data };
  } finally {
    t.close();
  }
}

async function ul(e) {
  let t = cl(e);
  return ll(new Blob([t.buffer], { type: `image/png` }));
}

async function dl(e) {
  let t = new AbortController(),
    n = setTimeout(() => t.abort(), bgSliderState.Qc);
  try {
    let n = await fetch(e.value, {
      credentials: `omit`,
      cache: `no-store`,
      referrerPolicy: `no-referrer`,
      signal: t.signal,
    });
    if (!n.ok) throw Error(`滑块图片读取失败（HTTP ${n.status}）`);
    return await ll(await n.blob());
  } finally {
    clearTimeout(n);
  }
}

function pl(e, t) {
  return new Promise((n, r) => {
    let i = !1,
      a = setTimeout(() => {
        i || ((i = !0), r(Error(`${t} 超时`)));
      }, bgSliderState.fl);
    e().then(
      (e) => {
        i || ((i = !0), clearTimeout(a), n(e));
      },
      (e) => {
        i || ((i = !0), clearTimeout(a), r(e));
      },
    );
  });
}

async function ml(e) {
  let t = { tabId: e },
    n = !1;
  try {
    ((n = !0),
      await pl(() => chrome.debugger.attach(t, `1.3`), `CDP debugger.attach`),
      await pl(() => chrome.debugger.sendCommand(t, `Page.bringToFront`), `CDP Page.bringToFront`));
    let e = await pl(
      () =>
        chrome.debugger.sendCommand(t, `Page.captureScreenshot`, {
          format: `png`,
          fromSurface: !0,
          captureBeyondViewport: !1,
        }),
      `CDP Page.captureScreenshot`,
    );
    if (!e.data) throw Error(`CDP 截图返回空数据`);
    return await ul(e.data);
  } finally {
    n && (await pl(() => chrome.debugger.detach(t), `CDP debugger.detach`).catch(() => {}));
  }
}

function hl(e) {
  return e.width >= 80 && e.height >= 40 && e.width * e.height <= bgSliderState.Zc;
}

function gl(e) {
  return e.width >= 6 && e.height >= 6 && e.width * e.height <= 4e6;
}

function _l(e, t) {
  let n = e.width / Math.max(1, e.height),
    r = t.width / Math.max(1, t.height);
  return Math.abs(Math.log(n / r)) <= 0.09;
}

function vl(e, t, n) {
  if (
    ((t = Math.round(t)),
    (n = Math.round(n)),
    !Number.isFinite(t) || !Number.isFinite(n) || t < 1 || n < 1 || t * n > bgSliderState.Zc)
  )
    throw Error(`滑块图片缩放尺寸无效`);
  if (e.width === t && e.height === n) return e;
  let r = new OffscreenCanvas(e.width, e.height),
    i = new OffscreenCanvas(t, n),
    a = r.getContext(`2d`),
    o = i.getContext(`2d`);
  if (!a || !o) throw Error(`无法缩放滑块图片`);
  (a.putImageData(new ImageData(new Uint8ClampedArray(e.data), e.width, e.height), 0, 0),
    (o.imageSmoothingEnabled = !0),
    (o.imageSmoothingQuality = `high`),
    o.drawImage(r, 0, 0, t, n));
  let s = o.getImageData(0, 0, t, n);
  return { width: t, height: n, data: s.data };
}

async function yl(e, t) {
  if (t.backgroundSource && (t.pieceSource || t.referenceBackgroundSource))
    try {
      let e = await dl(t.backgroundSource),
        [n, r] = await Promise.all([
          t.pieceSource ? dl(t.pieceSource).catch(() => void 0) : void 0,
          t.referenceBackgroundSource
            ? dl(t.referenceBackgroundSource).catch(() => void 0)
            : void 0,
        ]);
      if (
        hl(e) &&
        _l(e, t.backgroundRect) &&
        (!n || (gl(n) && (!t.pieceRect || _l(n, t.pieceRect)))) &&
        (!r || (hl(r) && _l(r, t.backgroundRect))) &&
        (n || r)
      ) {
        let i = e.width / t.backgroundRect.width,
          a = e.height / t.backgroundRect.height,
          o = n && t.pieceRect ? vl(n, t.pieceRect.width * i, t.pieceRect.height * a) : n;
        return {
          background: e,
          referenceBackground: r ? vl(r, e.width, e.height) : void 0,
          template: o ? al(o) : void 0,
          source: `raw-image`,
          imageScaleX: i,
          imageScaleY: a,
          cropOffsetX: 0,
          cropOffsetPieceX: 0,
        };
      }
    } catch {}
  let n = await ml(e),
    r = n.width / t.viewportWidth,
    i = n.height / t.viewportHeight;
  if (!Number.isFinite(r) || !Number.isFinite(i) || r < 0.25 || i < 0.25 || r > 8 || i > 8)
    throw Error(`无法建立截图像素与页面坐标的比例`);
  let a = t.backgroundRect.x * r,
    o = el(n, {
      x: a,
      y: t.backgroundRect.y * i,
      width: t.backgroundRect.width * r,
      height: t.backgroundRect.height * i,
    }),
    s = a - Math.round(a),
    c,
    l = 0;
  if (t.pieceRect) {
    let e = t.pieceRect.x * r,
      a = el(n, {
        x: e,
        y: t.pieceRect.y * i,
        width: t.pieceRect.width * r,
        height: t.pieceRect.height * i,
      });
    ((l = e - Math.round(e)), (c = al(sl(a) ?? a)));
  }
  return {
    background: o,
    template: c,
    source: `viewport-screenshot`,
    imageScaleX: r,
    imageScaleY: i,
    cropOffsetX: s,
    cropOffsetPieceX: l,
  };
}

function Sl(e) {
  ((bgSliderState.xl = !0), (bgSliderState.bl = null));
  try {
    e.terminate();
  } catch {}
}

function Cl() {
  return (
    bgSliderState.bl ||
    (bgSliderState.xl
      ? Promise.resolve(null)
      : ((bgSliderState.bl = new Promise((e) => {
          try {
            let t = new Worker(chrome.runtime.getURL(`opencv/template-matching-worker.js`)),
              n = setTimeout(() => {
                (Sl(t), e(null));
              }, 8e3),
              r = (i) => {
                (i.data === `ready` || i.data === `error`) &&
                  (clearTimeout(n),
                  t.removeEventListener(`message`, r),
                  i.data === `ready` ? e(t) : (Sl(t), e(null)));
              };
            (t.addEventListener(`message`, r),
              t.addEventListener(`error`, () => {
                (clearTimeout(n), Sl(t), e(null));
              }));
          } catch {
            ((bgSliderState.xl = !0), (bgSliderState.bl = null), e(null));
          }
        })),
        bgSliderState.bl))
  );
}

async function wl(e, t, n = !1) {
  let r = await Cl();
  if (!r) return null;
  let i = `slider-match-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return new Promise((a) => {
    let o = (e) => {
        (clearTimeout(l),
          r.removeEventListener(`message`, s),
          r.removeEventListener(`error`, c),
          a(e));
      },
      s = (e) => {
        e.data?.id === i &&
          (e.data.error || e.data.uniform || e.data.maskUnsupported
            ? o(null)
            : o({ x: e.data.x, y: e.data.y, confidence: e.data.maxVal }));
      },
      c = () => {
        (Sl(r), o(null));
      },
      l = setTimeout(() => {
        (Sl(r), o(null));
      }, 12e3);
    (r.addEventListener(`message`, s), r.addEventListener(`error`, c));
    let u = new ImageData(new Uint8ClampedArray(e.data), e.width, e.height),
      d = new ImageData(new Uint8ClampedArray(t.data), t.width, t.height);
    try {
      r.postMessage({ id: i, search: u, template: d, useMask: n }, [u.data.buffer, d.data.buffer]);
    } catch {
      (Sl(r), o(null));
    }
  });
}

function Tl(e) {
  let t = nl(e),
    n = new Float32Array(e.width * e.height);
  for (let r = 1; r < e.height - 1; r += 1)
    for (let i = 1; i < e.width - 1; i += 1) {
      let a = t[(r - 1) * e.width + i - 1],
        o = t[(r - 1) * e.width + i],
        s = t[(r - 1) * e.width + i + 1],
        c = t[r * e.width + i - 1],
        l = t[r * e.width + i + 1],
        u = t[(r + 1) * e.width + i - 1],
        d = t[(r + 1) * e.width + i],
        f = t[(r + 1) * e.width + i + 1],
        p = -a + s - 2 * c + 2 * l - u + f,
        m = -a - 2 * o - s + u + 2 * d + f;
      n[r * e.width + i] = Math.hypot(p, m);
    }
  return n;
}

function El(e) {
  let { image: t } = e,
    n = [];
  if (!e.shapedAlpha) {
    for (let e = 1; e < t.width - 1; e += 2) n.push({ x: e, y: 1 }, { x: e, y: t.height - 2 });
    for (let e = 2; e < t.height - 2; e += 2) n.push({ x: 1, y: e }, { x: t.width - 2, y: e });
    return n;
  }
  let r = (e, n) =>
    e >= 0 && n >= 0 && e < t.width && n < t.height && t.data[(n * t.width + e) * 4 + 3] >= 24;
  for (let e = 1; e < t.height - 1; e += 1)
    for (let i = 1; i < t.width - 1; i += 1)
      r(i, e) &&
        (!r(i - 1, e) || !r(i + 1, e) || !r(i, e - 1) || !r(i, e + 1)) &&
        n.push({ x: i, y: e });
  return n;
}

function Dl(e, t, n, r, i = !1) {
  let a = El(t),
    o = t.image.width,
    s = t.image.height;
  if (a.length < 18 || o >= e.width || s >= e.height) return null;
  let c = Tl(e),
    l = Math.max(0, Math.round(n)),
    u = e.width - o,
    d = Math.max(4, Math.round(s * 0.22)),
    f = i ? 0 : Math.max(0, Math.round(r - d)),
    p = i ? e.height - s : Math.min(e.height - s, Math.round(r + d));
  if (l > u || f > p) return null;
  let m = u - l + 1,
    h = p - f + 1;
  if (m * h * a.length > 9e7) return null;
  let g = new Float32Array(m * h),
    _ = -1,
    v = -1 / 0,
    y = 0,
    b = 0;
  for (let t = f; t <= p; t += 1)
    for (let n = l; n <= u; n += 1) {
      let r = 0,
        i = 0;
      for (let o of a) {
        let a = c[(t + o.y) * e.width + n + o.x];
        ((r += Math.min(1020, a)), a >= 90 && (i += 1));
      }
      let o = r / a.length / 1020,
        s = i / a.length,
        u = o * 0.72 + s * 0.28,
        d = (t - f) * m + n - l;
      ((g[d] = u), (y += u), (b += u * u), u > v && ((v = u), (_ = d)));
    }
  if (_ < 0) return null;
  let x = g.length,
    S = y / x,
    C = Math.sqrt(Math.max(0, b / x - S * S)),
    w = C > 0 ? (v - S) / C : 0,
    T = rl(g, m, _, Math.max(3, Math.round(o * 0.3)), Math.max(2, Math.round(s * 0.25))),
    E = (T.margin ?? 0) / Math.max(0.01, Math.abs(v)),
    D = Math.max(0, Math.min(0.99, 0.32 + w * 0.065 + E * 1.8));
  return w < 1.25 || D < 0.46
    ? null
    : {
        x: l + (_ % m),
        y: f + Math.floor(_ / m),
        confidence: D,
        confidenceMargin: E,
        candidateCount: T.candidateCount,
        method: t.shapedAlpha ? `contour-alpha` : `contour-edge`,
      };
}

function Ol(e, t, n, r, i, a) {
  if (e.width !== t.width || e.height !== t.height) return null;
  let o = n.image.width,
    s = n.image.height;
  if (o >= e.width || s >= e.height) return null;
  let c = new Float32Array(e.width * e.height),
    l = e.width + 1,
    u = new Float64Array((e.width + 1) * (e.height + 1)),
    d = 0;
  for (let n = 0; n < e.height; n += 1) {
    let r = 0;
    for (let i = 0; i < e.width; i += 1) {
      let a = n * e.width + i,
        o = a * 4,
        s =
          (Math.abs(e.data[o] - t.data[o]) +
            Math.abs(e.data[o + 1] - t.data[o + 1]) +
            Math.abs(e.data[o + 2] - t.data[o + 2])) /
          3;
      ((c[a] = s), s >= 20 && (d += 1), (r += s), (u[(n + 1) * l + i + 1] = u[n * l + i + 1] + r));
    }
  }
  let f = d / c.length;
  if (f < 0.002 || f > 0.35) return null;
  let p = [];
  if (n.shapedAlpha)
    for (let e = 0; e < s; e += 2)
      for (let t = 0; t < o; t += 2)
        n.image.data[(e * o + t) * 4 + 3] >= 24 && p.push({ x: t, y: e });
  let m = (t, n) => {
      if (p.length > 0) {
        let r = 0;
        for (let i of p) r += c[(n + i.y) * e.width + t + i.x];
        return r / p.length;
      }
      let r = t + o,
        i = n + s;
      return (u[i * l + r] - u[n * l + r] - u[i * l + t] + u[n * l + t]) / (o * s);
    },
    h = Math.max(0, Math.round(r)),
    g = e.width - o,
    _ = Math.max(5, Math.round(s * 0.3)),
    v = a ? 0 : Math.max(0, Math.round(i - _)),
    y = a ? e.height - s : Math.min(e.height - s, Math.round(i + _));
  if (h > g || v > y) return null;
  let b = g - h + 1,
    x = y - v + 1;
  if (b * x * Math.max(1, p.length) > 9e7) return null;
  let S = new Float32Array(b * x),
    C = -1,
    w = -1 / 0,
    T = 0,
    E = 0;
  for (let e = v; e <= y; e += 1)
    for (let t = h; t <= g; t += 1) {
      let n = m(t, e),
        r = (e - v) * b + t - h;
      ((S[r] = n), (T += n), (E += n * n), n > w && ((w = n), (C = r)));
    }
  if (C < 0 || w < 6) return null;
  let D = T / S.length,
    O = Math.sqrt(Math.max(0, E / S.length - D * D)),
    k = O > 0 ? (w - D) / O : 0,
    A = rl(S, b, C, Math.max(3, Math.round(o * 0.35)), Math.max(3, Math.round(s * 0.35))),
    ee = (A.margin ?? 0) / Math.max(1, w),
    te = Math.max(
      0,
      Math.min(
        0.995,
        0.48 + Math.min(0.24, k * 0.045) + Math.min(0.2, ee * 1.8) + Math.min(0.06, w / 500),
      ),
    );
  return k < 1.4 || te < 0.55
    ? null
    : {
        x: h + (C % b),
        y: v + Math.floor(C / b),
        confidence: te,
        confidenceMargin: ee,
        candidateCount: A.candidateCount,
        method: `background-delta`,
      };
}

function kl(e, t = 2) {
  let { image: n } = e,
    r = [],
    i = [],
    a = [],
    o = (e, t) =>
      e >= 0 && t >= 0 && e < n.width && t < n.height ? n.data[(t * n.width + e) * 4 + 3] : 0,
    s = (e, t) =>
      o(e - 1, t) >= 200 && o(e + 1, t) >= 200 && o(e, t - 1) >= 200 && o(e, t + 1) >= 200,
    c = (e, t) => o(e - 1, t) <= 12 && o(e + 1, t) <= 12 && o(e, t - 1) <= 12 && o(e, t + 1) <= 12;
  for (let e = 0; e < n.height; e += t)
    for (let a = 0; a < n.width; a += t) {
      let t = o(a, e);
      t >= 200 && s(a, e) ? r.push({ x: a, y: e }) : t <= 12 && c(a, e) && i.push({ x: a, y: e });
    }
  let l = Math.max(1, Math.round(t / 2)),
    u = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
  for (let e = 1; e < n.height - 1; e += l)
    for (let t = 1; t < n.width - 1; t += l)
      if (!(o(t, e) < 200))
        for (let [r, i] of u) {
          if (o(t + r, e + i) > 12) continue;
          let s = t + r * 2,
            c = e + i * 2,
            l = t - r * 2,
            u = e - i * 2;
          if (
            !(s < 0 || c < 0 || s >= n.width || c >= n.height) &&
            !(l < 0 || u < 0 || l >= n.width || u >= n.height) &&
            !(o(l, u) < 200)
          ) {
            a.push({ inX: l, inY: u, outX: s, outY: c });
            break;
          }
        }
  return { inside: r, outside: i, boundary: a };
}

function Al(e, t, n, r, i) {
  let a = 0,
    o = 0;
  for (let s of i) {
    let i = e[(r + s.y) * t + n + s.x];
    ((a += i), (o += i * i));
  }
  let s = a / i.length;
  return { mean: s, std: Math.sqrt(Math.max(0, o / i.length - s * s)) };
}

function jl(e, t, n, r, i = !1) {
  if (!t.shapedAlpha) return null;
  let a = t.image.width,
    o = t.image.height;
  if (a >= e.width || o >= e.height) return null;
  let s = kl(t);
  if (s.inside.length < 24 || s.outside.length < 12 || s.boundary.length < 20) return null;
  let c = nl(e),
    l = Math.max(0, Math.round(n)),
    u = e.width - a,
    d = Math.max(4, Math.round(o * 0.25)),
    f = i ? 0 : Math.max(0, Math.round(r - d)),
    p = i ? e.height - o : Math.min(e.height - o, Math.round(r + d));
  if (l > u || f > p) return null;
  let m = u - l + 1,
    h = p - f + 1,
    g = s.inside.length + s.outside.length + s.boundary.length;
  if (m * h * g > 9e7) return null;
  let _ = new Float32Array(m * h);
  _.fill(-1 / 0);
  let v = -1,
    y = -1 / 0,
    b = 0,
    x = 0,
    S = 0,
    C = 0;
  for (let t = f; t <= p; t += 1)
    for (let n = l; n <= u; n += 1) {
      let r = Al(c, e.width, n, t, s.inside),
        i = Al(c, e.width, n, t, s.outside),
        u = Math.abs(i.mean - r.mean) / 255,
        d = 1 - Math.min(1, r.std / 40),
        p = Math.min(1, i.std / 18);
      if (u < 0.08 || r.std > 46) continue;
      let h = Math.sign(i.mean - r.mean),
        g = new Int32Array(9),
        w = new Int32Array(9);
      for (let r of s.boundary) {
        let i = c[(t + r.inY) * e.width + n + r.inX],
          s = c[(t + r.outY) * e.width + n + r.outX] - i,
          l =
            Math.min(2, Math.floor((r.inX / a) * 3)) + Math.min(2, Math.floor((r.inY / o) * 3)) * 3;
        ((w[l] += 1), Math.abs(s) >= 12 && Math.sign(s) === h && (g[l] += 1));
      }
      let T = 1,
        E = 0;
      for (let e = 0; e < w.length; e += 1) w[e] < 5 || ((E += 1), (T = Math.min(T, g[e] / w[e])));
      if (E < 4) continue;
      let D = T;
      if (D < 0.55) continue;
      let O = D * 0.45 + u * 0.25 + d * 0.18 + p * 0.12,
        k = (t - f) * m + n - l;
      ((_[k] = O), (b += 1), (x += O), (S += O * O), O > y && ((y = O), (v = k), (C = D)));
    }
  if (v < 0) return null;
  let w = x / b,
    T = Math.sqrt(Math.max(0, S / b - w * w)),
    E = T > 0 ? (y - w) / T : 0,
    D = rl(_, m, v, Math.max(3, Math.round(a * 0.4)), Math.max(3, Math.round(o * 0.3))),
    O = D.margin == null ? void 0 : D.margin / Math.max(0.01, y),
    k = Math.max(
      0,
      Math.min(0.99, 0.42 + y * 0.38 + Math.min(0.18, E * 0.05) + Math.min(0.16, (O ?? 0) * 1.6)),
    ),
    A = Math.min(k, 0.28 + C * 0.71);
  return (!(C >= 0.92) && E < 1.1) || A < 0.5
    ? null
    : {
        x: l + (v % m),
        y: f + Math.floor(v / m),
        confidence: A,
        confidenceMargin: O,
        candidateCount: D.candidateCount,
        method: `hole-silhouette`,
      };
}

function Ml(e) {
  let { width: t, height: n, data: r } = e.image,
    i = [],
    a = (e, n) => r[(n * t + e) * 4 + 3] >= 128;
  for (let e = 0; e < 4; e += 1) {
    let r = e < 2,
      o = r ? t : n,
      s = r ? n : t,
      c = Math.min(36, Math.max(9, o - 2)),
      l = !r,
      u = e === 0 || e === 2 ? 1 : -1;
    for (let t = 0; t < c; t += 1) {
      let n = Math.min(o - 2, Math.max(1, 1 + Math.round(((t + 0.5) * (o - 2)) / c)));
      for (let o = 0; o < s; o += 1) {
        let d = u > 0 ? o : s - 1 - o,
          f = r ? n : d,
          p = r ? d : n;
        if (a(f, p)) {
          i.push({
            x: f,
            y: p,
            normalX: l,
            normalSign: u,
            bin: e * 3 + Math.min(2, Math.floor((t / c) * 3)),
          });
          break;
        }
      }
    }
  }
  return [0, 1, 2, 3].some((e) => {
    let r = i.filter((t) => Math.floor(t.bin / 3) === e).map((e) => (e.normalX ? e.x : e.y));
    return r.length >= 4 && Math.max(...r) - Math.min(...r) >= Math.max(3, Math.min(t, n) * 0.07);
  })
    ? i
    : [];
}

function Nl(e, t, n, r, i = !1, a = []) {
  if (!t.shapedAlpha) return null;
  let { width: o, height: s } = t.image;
  if (o >= e.width || s >= e.height) return null;
  let c = Ml(t),
    l = new Uint16Array(12);
  for (let e of c) l[e.bin] += 1;
  let u = Array.from(l, (e, t) => ({ total: e, bin: t }))
      .filter(({ total: e }) => e >= 2)
      .map(({ bin: e }) => e),
    d = [0, 1, 2, 3].map((e) => u.filter((t) => Math.floor(t / 3) === e).length);
  if (c.length < 24 || u.length < 8 || d.some((e) => e < 2)) return null;
  let f = Math.max(1, Math.min(3, Math.round(Math.min(o, s) / 48))),
    p = Math.max(0, Math.ceil(n)),
    m = e.width - o,
    h = Math.max(3, Math.round(s * 0.18)),
    g = Math.max(0, i ? 0 : Math.floor(r - h)),
    _ = Math.min(e.height - s, i ? e.height - s : Math.ceil(r + h));
  if (p > m || g > _) return null;
  let v = m - p + 1,
    y = _ - g + 1;
  if (v * y * c.length * (f * 2 + 1) > 9e7) return null;
  let b = nl(e),
    x = new Float32Array(b.length),
    S = new Float32Array(b.length),
    C = e.width;
  for (let t = 1; t < e.height - 1; t += 1)
    for (let e = 1; e < C - 1; e += 1) {
      let n = t * C + e,
        r = Math.abs(
          b[n - C + 1] + 2 * b[n + 1] + b[n + C + 1] - b[n - C - 1] - 2 * b[n - 1] - b[n + C - 1],
        ),
        i = Math.abs(
          b[n + C - 1] + 2 * b[n + C] + b[n + C + 1] - b[n - C - 1] - 2 * b[n - C] - b[n - C + 1],
        );
      ((x[n] = Math.max(0, r - i * 0.3)), (S[n] = Math.max(0, i - r * 0.3)));
    }
  let w = new Float32Array(v * y);
  w.fill(-1 / 0);
  let T = new Uint16Array(12),
    E = (t, n, r, i, a) => {
      let o = a ? n + i : n,
        s = a ? r : r + i;
      return o < 0 || s < 0 || o >= C || s >= e.height ? 0 : t[s * C + o];
    },
    D = -1,
    O = -1 / 0;
  for (let e = g; e <= _; e += 1)
    for (let t = p; t <= m; t += 1) {
      if (a.some((e) => Math.abs(t - e.x) <= e.radius)) continue;
      T.fill(0);
      let n = 0,
        r = 0;
      for (let i of c) {
        let a = i.normalX ? x : S,
          o = t + i.x,
          s = e + i.y,
          c = 0;
        for (let e = -f; e <= f; e += 1) c = Math.max(c, E(a, o, s, e, i.normalX));
        let l = (f + 2) * i.normalSign,
          u = E(a, o, s, -l, i.normalX),
          d = E(a, o, s, l, i.normalX);
        (c >= 56 && c >= Math.max(u, d) * 0.75 && ((T[i.bin] += 1), (r += 1)), (n += c / (c + 64)));
      }
      let i = r / c.length,
        o = 1;
      for (let e = 0; e < l.length; e += 1) l[e] < 2 || (o = Math.min(o, T[e] / l[e]));
      let s = o * 0.6 + i * 0.3 + (n / c.length) * 0.1,
        u = (e - g) * v + t - p;
      ((w[u] = s), o >= 0.6 && i >= 0.8 && s > O && ((D = u), (O = s)));
    }
  if (D < 0 || O < 0.7) return null;
  let k = rl(
      w,
      v,
      D,
      Math.max(f * 2 + 1, Math.round(o * 0.35)),
      Math.max(f * 2 + 1, Math.round(s * 0.25)),
    ),
    A = k.margin == null ? void 0 : k.margin / O;
  return A != null && A < 0.035
    ? null
    : {
        x: p + (D % v),
        y: g + Math.floor(D / v),
        confidence: Math.min(0.98, O),
        confidenceMargin: A,
        candidateCount: k.candidateCount,
        method: `outline-profile`,
      };
}

function Pl(e) {
  return (
    e.method.split(`+`).some((e) => e === `hole-silhouette` || e === `outline-profile`) &&
    e.confidence >= 0.66 &&
    (e.confidenceMargin == null || e.confidenceMargin >= 0.015)
  );
}

function Fl(e) {
  if (!e.shapedAlpha) return !0;
  let t = kl(e);
  return t.inside.length < 24 || Al(nl(e.image), e.image.width, 0, 0, t.inside).std >= 10;
}

function Il(e, t, n, r = !1) {
  if (r) return { image: e, offsetY: 0 };
  let i = Math.max(5, Math.round(t.image.height * 0.28)),
    a = Math.max(0, Math.round(n - i)),
    o = Math.min(e.height, Math.round(n + t.image.height + i));
  return { image: el(e, { x: 0, y: a, width: e.width, height: o - a }), offsetY: a };
}

function Ll(e, t) {
  if (e.length === 0) return null;
  let n = Math.max(4, t * 0.16),
    r = [...e].sort((e, t) => t.confidence - e.confidence),
    i = r.filter(Pl);
  if (i.length > 0) {
    let e = i[0];
    return {
      candidate: e,
      rivalCount: i.filter((t) => Math.abs(t.x - e.x) > n && t.confidence >= e.confidence * 0.88)
        .length,
    };
  }
  let a = r[0],
    o = r.filter((e) => Math.abs(e.x - a.x) <= n),
    s = r.filter((e) => Math.abs(e.x - a.x) > n && e.confidence >= a.confidence * 0.88);
  if (o.length >= 2) {
    let e = o.reduce((e, t) => e + Math.max(0.01, t.confidence), 0);
    return {
      candidate: {
        ...a,
        x: o.reduce((e, t) => e + t.x * t.confidence, 0) / e,
        y: o.reduce((e, t) => e + t.y * t.confidence, 0) / e,
        confidence: Math.min(0.995, a.confidence + 0.08),
        method: o.map((e) => e.method).join(`+`),
        candidateCount: o.reduce((e, t) => e + (t.candidateCount ?? 0), 0),
      },
      rivalCount: s.length,
    };
  }
  return { candidate: a, rivalCount: s.length };
}

function Rl(e, t) {
  let n = e.pieceRect?.width ?? Math.max(28, Math.min(64, e.handleRect.width)),
    r = e.pieceRect?.height ?? n,
    i = Math.max(8, Math.min(t.background.width - 1, Math.round(n * t.imageScaleX))),
    a = Math.max(8, Math.min(t.background.height - 1, Math.round(r * t.imageScaleY))),
    o = $c(i, a);
  return (
    o.data.fill(255),
    {
      image: o,
      originalWidth: i,
      originalHeight: a,
      bounds: { x: 0, y: 0, width: i, height: a },
      shapedAlpha: !1,
    }
  );
}

async function Bl(e, t, n = []) {
  let r = t.template ?? Rl(e, t);
  if (r.image.width >= t.background.width || r.image.height >= t.background.height) return null;
  let i = e.pieceRect?.x ?? e.backgroundRect.x,
    a = Math.max(
      0,
      (i - e.backgroundRect.x) * t.imageScaleX +
        r.bounds.x *
          (e.pieceRect && t.source === `raw-image`
            ? (e.pieceRect.width / Math.max(1, r.originalWidth)) * t.imageScaleX
            : 1),
    ),
    o = e.pieceRect?.y ?? e.backgroundRect.y,
    s = Math.max(
      0,
      (o - e.backgroundRect.y) * t.imageScaleY +
        r.bounds.y *
          (e.pieceRect && t.source === `raw-image`
            ? (e.pieceRect.height / Math.max(1, r.originalHeight)) * t.imageScaleY
            : 1),
    ),
    c = e.pieceRect != null,
    l = t.template == null,
    u = [],
    d = a + Math.max(3, r.image.width * bgSliderState.zl);
  if (d > t.background.width - r.image.width) return null;
  if (t.referenceBackground) {
    let e = Ol(t.background, t.referenceBackground, r, d, s, !c);
    e && u.push(e);
  }
  let f = jl(t.background, r, d, s, !c);
  f && u.push(f);
  let p = (e) => e != null && Pl(e) && !n.some((t) => Math.abs(e.x - t.x) <= t.radius),
    m = p(f) ? null : Nl(t.background, r, d, s, !c, n);
  m && u.push(m);
  let h = r.shapedAlpha && ![f, m].some(p),
    g = [f, m].some(p),
    _ = g ? null : Dl(t.background, r, d, s, !c);
  _ && u.push(_);
  let v = Il(t.background, r, s, !c),
    y = l || g ? null : await wl(v.image, r.image, r.shapedAlpha);
  y &&
    y.confidence >= 0.42 &&
    y.x >= d &&
    u.push({ ...y, y: y.y + v.offsetY, method: `opencv`, candidateCount: 1 });
  let b =
    (v.image.width - r.image.width + 1) *
    (v.image.height - r.image.height + 1) *
    r.image.width *
    r.image.height;
  if (!l && !g && b > 0 && b <= 9e7) {
    let e = il(v.image, r.image, r.shapedAlpha ? 0.28 : 0.36);
    e && e.x >= d && u.push({ ...e, y: e.y + v.offsetY, method: `ncc` });
  }
  let x = n.length ? u.filter((e) => !n.some((t) => Math.abs(e.x - t.x) <= t.radius)) : u;
  if (x.length === 0) return null;
  let S = Ll(x, r.image.width);
  if (!S) return null;
  let { candidate: C, rivalCount: w } = S,
    T =
      t.source === `raw-image` &&
      x.some(
        (e) =>
          (e.method === `ncc` || e.method === `background-delta`) &&
          e.confidence >= 0.86 &&
          e.confidenceMargin != null &&
          e.confidenceMargin >= 0.05 &&
          Math.abs(e.x - C.x) <= Math.max(2, r.image.width * 0.06) &&
          Math.abs(e.y - C.y) <= Math.max(2, r.image.height * 0.06),
      ),
    E = h && !T,
    D = Pl(C),
    O = u.length >= 2 && C.method.includes(`+`) ? 0.48 : D ? 0.58 : r.shapedAlpha ? 0.62 : 0.68;
  if (C.confidence < O) return null;
  let k = E && !D ? Math.min(C.confidence, 0.6) : C.confidence;
  return {
    x: C.x,
    y: C.y,
    confidence: k,
    confidenceMargin: C.confidenceMargin,
    method: C.method,
    candidateCount: C.candidateCount ?? u.length,
    rivalCount: D ? w : E ? Math.max(1, w) : w,
    templateWidth: r.image.width,
    templateHeight: r.image.height,
    templateOffsetX: r.bounds.x,
    templateOffsetY: r.bounds.y,
    templateOriginalWidth: r.originalWidth,
    templateOriginalHeight: r.originalHeight,
  };
}

function Vl(e) {
  return !!e && [e.x, e.y, e.width, e.height].every(Number.isFinite) && e.width > 0 && e.height > 0;
}

function Hl(e, t, n) {
  let r = Math.max(0, e.x),
    i = Math.max(0, e.y),
    a = Math.min(t, e.x + e.width),
    o = Math.min(n, e.y + e.height);
  return (Math.max(0, a - r) * Math.max(0, o - i)) / Math.max(1, e.width * e.height);
}

function Ul(e) {
  if (
    !Number.isFinite(e.viewportWidth) ||
    !Number.isFinite(e.viewportHeight) ||
    e.viewportWidth < 100 ||
    e.viewportHeight < 100
  )
    return `页面视口尺寸无效`;
  if (!Vl(e.panelRect) || !Vl(e.backgroundRect) || !Vl(e.trackRect) || !Vl(e.handleRect))
    return `滑块控件包含无效几何信息`;
  if (e.pieceRect && !Vl(e.pieceRect)) return `拼图块几何信息无效`;
  if (e.backgroundRect.width < 80 || e.backgroundRect.height < 40) return `滑块背景图尺寸过小`;
  if (e.trackRect.width - e.handleRect.width < 20) return `滑块轨道没有足够的可拖动行程`;
  if (Hl(e.backgroundRect, e.viewportWidth, e.viewportHeight) < 0.96)
    return `滑块背景图没有完整显示在当前视口`;
  if (Hl(e.handleRect, e.viewportWidth, e.viewportHeight) < 0.98)
    return `滑块把手没有完整显示在当前视口`;
  let t = e.handleRect.y + e.handleRect.height / 2;
  return t < e.trackRect.y - e.handleRect.height ||
    t > e.trackRect.y + e.trackRect.height + e.handleRect.height
    ? `滑块把手与轨道位置不一致`
    : null;
}

function Wl(e, t, n) {
  return Math.min(n, Math.max(t, e));
}

function Gl(e, t, n, r = 0) {
  let i = Ul(e);
  if (i) return { ok: !1, errorCode: `invalid-geometry`, error: i };
  if (
    !Number.isFinite(t.imageScaleX) ||
    !Number.isFinite(t.imageScaleY) ||
    t.imageScaleX <= 0 ||
    t.imageScaleY <= 0
  )
    return { ok: !1, errorCode: `invalid-geometry`, error: `图片像素比例无效` };
  if (!Number.isFinite(n.confidence) || n.confidence < 0.45)
    return { ok: !1, errorCode: `match-not-found`, error: `缺口匹配置信度不足` };
  if (n.confidenceMargin != null && n.confidenceMargin < 0.006 && n.confidence < 0.72)
    return { ok: !1, errorCode: `match-ambiguous`, error: `缺口存在多个相近候选位置` };
  if (n.rivalCount > 0 && n.confidence < 0.86)
    return {
      ok: !1,
      errorCode: `match-ambiguous`,
      error: `图上有 ${n.rivalCount + 1} 个分数接近的候选缺口，无法确定唯一目标`,
    };
  let a = (n.x - t.cropOffsetX) / t.imageScaleX,
    o = e.pieceRect,
    s =
      o && t.source === `raw-image`
        ? (n.templateOffsetX / Math.max(1, n.templateOriginalWidth)) * o.width
        : n.templateOffsetX / t.imageScaleX,
    c = o ? o.x - e.backgroundRect.x + s - t.cropOffsetPieceX / t.imageScaleX : 0,
    l =
      o && t.source === `raw-image`
        ? (n.templateWidth / Math.max(1, n.templateOriginalWidth)) * o.width
        : n.templateWidth / t.imageScaleX,
    u = a - c,
    d = e.backgroundRect.width - (o?.width ?? l),
    f = e.trackRect.width - e.handleRect.width,
    p = e.trackRect.x + e.trackRect.width - (e.handleRect.x + e.handleRect.width);
  if (d < 20 || f < 20 || p < 2)
    return { ok: !1, errorCode: `invalid-geometry`, error: `滑块或拼图块没有有效行程` };
  if (u <= 1 || u > d + Math.max(3, l * 0.15))
    return {
      ok: !1,
      errorCode: `distance-out-of-range`,
      error: `识别出的拼图距离超出范围（${u.toFixed(1)}px）`,
    };
  let m = f / d,
    h = m >= 0.45 && m <= 1.8 ? m : 1,
    g = Wl(Number.isFinite(r) ? r : 0, -10, 10),
    _ = u * h + g;
  return _ < 2 || _ > p
    ? {
        ok: !1,
        errorCode: `distance-out-of-range`,
        error: `换算后的把手距离超出轨道（${_.toFixed(1)}/${p.toFixed(1)}px）`,
      }
    : {
        ok: !0,
        plan: {
          gapX: Math.round(a * 10) / 10,
          distance: Math.round(_ * 100) / 100,
          diagnostics: {
            source: t.source,
            imageScaleX: Math.round(t.imageScaleX * 1e3) / 1e3,
            imageScaleY: Math.round(t.imageScaleY * 1e3) / 1e3,
            imageDistance: Math.round(u * 10) / 10,
            handleRange: Math.round(f * 10) / 10,
            pieceRange: Math.round(d * 10) / 10,
            conversionRatio: Math.round(h * 1e3) / 1e3,
            correctionPx: g,
            candidateCount: n.candidateCount,
            confidenceMargin: n.confidenceMargin,
            rivalCount: n.rivalCount,
            cropOffsetX: Math.round(t.cropOffsetX * 100) / 100,
          },
        },
      };
}

function Jl(e, t) {
  return { width: e, height: t, data: new Uint8ClampedArray(e * t * 4) };
}

function Yl(e, t) {
  if (e.width !== t.width || e.height !== t.height) return null;
  let n = new Uint8Array(e.width * e.height);
  for (let r = 0; r < n.length; r += 1) {
    let i = r * 4,
      a =
        (Math.abs(t.data[i] - e.data[i]) +
          Math.abs(t.data[i + 1] - e.data[i + 1]) +
          Math.abs(t.data[i + 2] - e.data[i + 2])) /
        3;
    n[r] = +(a >= bgSliderState.ql);
  }
  return n;
}

function Xl(e, t, n, r = bgSliderState.Kl) {
  let i = new Uint8Array(e.length),
    a = [],
    o = [];
  for (let s = 0; s < e.length; s += 1) {
    if (!e[s] || i[s]) continue;
    ((o.length = 0), o.push(s), (i[s] = 1));
    let c = t,
      l = n,
      u = -1,
      d = -1,
      f = 0;
    for (; o.length > 0;) {
      let r = o.pop(),
        a = r % t,
        s = (r - a) / t;
      if (
        ((f += 1), a < c && (c = a), s < l && (l = s), a > u && (u = a), s > d && (d = s), a > 0)
      ) {
        let t = r - 1;
        e[t] && !i[t] && ((i[t] = 1), o.push(t));
      }
      if (a + 1 < t) {
        let t = r + 1;
        e[t] && !i[t] && ((i[t] = 1), o.push(t));
      }
      if (s > 0) {
        let n = r - t;
        e[n] && !i[n] && ((i[n] = 1), o.push(n));
      }
      if (s + 1 < n) {
        let n = r + t;
        e[n] && !i[n] && ((i[n] = 1), o.push(n));
      }
    }
    f >= r && a.push({ x: c, y: l, width: u - c + 1, height: d - l + 1, area: f });
  }
  return a.sort((e, t) => t.area - e.area);
}

function Zl(e) {
  let { before: t, after: n, handleDeltaCss: r, pixelRatio: i, backgroundRect: a } = e;
  if (!Number.isFinite(r) || Math.abs(r) < 4)
    return { ok: !1, reason: `探测位移过小，无法分离碎片` };
  if (!Number.isFinite(i) || i <= 0) return { ok: !1, reason: `截图像素比无效` };
  let o = Yl(t, n);
  if (!o) return { ok: !1, reason: `两张截图尺寸不一致` };
  let s = Math.max(0, Math.floor(a.x)),
    c = Math.max(0, Math.floor(a.y)),
    l = Math.min(t.width, Math.ceil(a.x + a.width)),
    u = Math.min(t.height, Math.ceil(a.y + a.height));
  if (l - s < 20 || u - c < 20) return { ok: !1, reason: `背景图区域过小` };
  for (let e = 0; e < t.height; e += 1) {
    let n = e >= c && e < u;
    for (let r = 0; r < t.width; r += 1) (!n || r < s || r >= l) && (o[e * t.width + r] = 0);
  }
  let d = Xl(o, t.width, t.height);
  if (d.length === 0)
    return { ok: !1, reason: `探测移动后画面没有可识别的变化，碎片可能没有跟随把手` };
  if (d.length === 1)
    return { ok: !1, reason: `只观察到一团变化，碎片的新旧位置可能重叠（探测位移不足）` };
  let [f, p] = d,
    m = f.x <= p.x ? f : p,
    h = f.x <= p.x ? p : f,
    g = h.x - m.x;
  if (g <= 2) return { ok: !1, reason: `两团变化没有水平分离，无法判断移动方向` };
  if (Math.abs(h.y - m.y) > Math.max(6, m.height * 0.35))
    return { ok: !1, reason: `两团变化的垂直位置差异过大，可能不是同一个碎片` };
  let _ = h.width / Math.max(1, m.width);
  if (_ < 0.6 || _ > 1.7) return { ok: !1, reason: `两团变化的尺寸差异过大，可能不是同一个碎片` };
  let v = r * i;
  if (h.width / Math.max(1, h.height) < 0.45)
    return { ok: !1, reason: `碎片的新旧位置部分重叠，差分只得到窄条（探测位移不足一个碎片宽）` };
  let y = g / v;
  if (!Number.isFinite(y) || y < 0.25 || y > 2.5)
    return { ok: !1, reason: `测得的行程比 ${y.toFixed(3)} 超出合理范围` };
  let b = Jl(h.width, h.height),
    x = 0;
  for (let e = 0; e < h.height; e += 1)
    for (let r = 0; r < h.width; r += 1) {
      let i = h.x + r,
        a = h.y + e,
        s = (e * h.width + r) * 4;
      if (i < 0 || a < 0 || i >= n.width || a >= n.height) continue;
      let c = (a * n.width + i) * 4,
        l = o[a * t.width + i] === 1;
      ((b.data[s] = n.data[c]),
        (b.data[s + 1] = n.data[c + 1]),
        (b.data[s + 2] = n.data[c + 2]),
        (b.data[s + 3] = l ? 255 : 0),
        l && (x += 1));
    }
  return x / Math.max(1, h.width * h.height) < 0.2
    ? { ok: !1, reason: `差分出的碎片形状过于稀疏，无法作为模板` }
    : {
        ok: !0,
        measurement: {
          pieceX: h.x,
          pieceY: h.y,
          pieceWidth: h.width,
          pieceHeight: h.height,
          originX: m.x,
          originY: m.y,
          measuredRatio: y,
          template: b,
        },
      };
}

function Ql(e, t, n) {
  return Math.min(n, Math.max(t, e));
}

function $l(e, t = Math.random, n = 1 / 0) {
  if (!Number.isFinite(e) || e <= 0)
    return [
      { dx: 0, delayMs: 20 },
      { dx: 0, delayMs: 20 },
    ];
  let r = Math.min(e, n),
    i = Ql(14 + Math.round(r / 45) + Math.round(t() * 3), 14, 23),
    a = r >= 45 ? 3 : 2,
    o = i - a,
    s = r * (r >= 45 ? 0.965 : 0.93),
    c = [],
    l = 0;
  for (let e = 1; e <= o; e += 1) {
    let n = e / o,
      r = n < 0.5 ? 4 * n ** 3 : 1 - (-2 * n + 2) ** 3 / 2,
      i = Math.min(s, Math.max(l, Math.round(s * r)));
    (c.push({
      dx: i - l,
      delayMs: n < 0.7 ? 14 + Math.round(t() * 14) : 22 + Math.round(t() * 24),
    }),
      (l = i));
  }
  for (let e = 1; e <= a; e += 1) {
    let n = r - l,
      i = e === a ? n : n * 0.5,
      o = e === a ? r : l + i;
    (c.push({ dx: o - l, delayMs: 34 + e * 12 + Math.round(t() * 26) }), (l = o));
  }
  let u = c.reduce((e, t) => e + t.dx, 0);
  return ((c[c.length - 1].dx += r - u), c);
}

function eu(e, t, n, r, i, a = Math.random) {
  let o = [],
    s = e,
    c = (a() - 0.5) * 2.4,
    l = Ql(e + n.reduce((e, t) => e + t.dx, 0), 1, r - 1),
    u = Ql(e, 1, r - 1);
  for (let e = 0; e < n.length; e += 1) {
    let d = n[e];
    s += d.dx;
    let f = (e + 1) / n.length,
      p = 1 - f,
      m = e === n.length - 1 ? 0 : (a() - 0.5) * 1.5 * p,
      h = t + Math.sin(f * Math.PI) * c + m,
      g = Math.min(l, Math.max(u, Math.round(Ql(s, 1, r - 1))));
    (o.push({ x: g, y: Math.round(Ql(h, 1, i - 1)), delayMs: d.delayMs }), (u = g));
  }
  let d = o[o.length - 1];
  return (
    d && ((d.x = Ql(e + n.reduce((e, t) => e + t.dx, 0), 1, r - 1)), (d.y = Ql(t, 1, i - 1))),
    o
  );
}

function nu(e) {
  let t = e.pieceRect?.width ?? Math.max(30, e.handleRect.width),
    n = e.trackRect.x + e.trackRect.width - (e.handleRect.x + e.handleRect.width);
  return Math.max(12, Math.min(t + 8, n * 0.42));
}

function ru(e, t, n, r) {
  let i = [];
  for (let a = 1; a <= 7; a += 1) {
    let o = 1 - (1 - a / 7) ** 2;
    i.push({ x: e + n * o, y: t + (r() - 0.5) * 1.2, delayMs: 16 + Math.round(r() * 14) });
  }
  return i;
}

function iu(e, t, n, r, i, a, o) {
  let s = {
      image: n,
      originalWidth: n.width,
      originalHeight: n.height,
      bounds: { x: 0, y: 0, width: n.width, height: n.height },
      shapedAlpha: !0,
    },
    c = (e) => Math.abs(e - r) >= n.width * 0.5 && !o.some((t) => Math.abs(e - t) < n.width / 3),
    l = jl(e, s, 0, a);
  if (l && Pl(l) && c(l.x))
    return { x: l.x, confidence: l.confidence, method: `measured+silhouette` };
  let u = Nl(e, s, 0, a, !1, [
    { x: r, radius: Math.max(6, n.width * 0.5) },
    ...o.map((e) => ({ x: e, radius: Math.max(6, n.width / 3) })),
  ]);
  if (u && Pl(u) && c(u.x))
    return { x: u.x, confidence: u.confidence, method: `measured+outline-profile` };
  let d = Math.max(0, Math.ceil(i + n.width)),
    f = Math.max(3, Math.round(n.height * 0.12)),
    p = Math.max(0, Math.floor(a - f)),
    m = Math.min(t.height, Math.ceil(a + n.height + f)),
    h = t.width - d,
    g = m - p;
  if (h < n.width || g < n.height) return null;
  let _ = (h - n.width + 1) * (g - n.height + 1) * n.width * n.height;
  if (_ <= 0 || _ > 12e7 || !Fl(s)) return null;
  let v = il(ou(t, d, p, h, g), n, 0.72);
  if (!v || v.confidenceMargin == null || v.confidenceMargin < 0.035) return null;
  let y = v.x + d;
  return o.some((e) => Math.abs(y - e) < n.width / 3)
    ? null
    : { x: y, confidence: v.confidence, method: `measured+ncc` };
}

async function au(e, t, n, r, i) {
  let a = t.handleRect.x + t.handleRect.width / 2,
    o = t.handleRect.y + t.handleRect.height / 2,
    s = nu(t),
    c = t.trackRect.x + t.trackRect.width - (t.handleRect.x + t.handleRect.width),
    l = await bgPlatformState.Jc(
      e,
      {
        startX: a,
        startY: o,
        viewportWidth: t.viewportWidth,
        viewportHeight: t.viewportHeight,
        targetToken: t.handleToken,
        frameTarget: i,
      },
      r,
    );
  try {
    let e = l.current,
      i = await ul(await l.screenshot()),
      a = i.width / t.viewportWidth,
      o = i.height / t.viewportHeight;
    if (![a, o].every((e) => Number.isFinite(e) && e >= 0.25 && e <= 8))
      return {
        solved: !1,
        errorCode: `image-unavailable`,
        error: `无法建立截图与页面坐标的比例`,
      };
    (await l.moveBy(ru(e.x, e.y, s, r)), await new Promise((e) => setTimeout(e, 110)));
    let u = l.current,
      d = await ul(await l.screenshot()),
      f = Zl({
        before: i,
        after: d,
        handleDeltaCss: u.x - e.x,
        pixelRatio: a,
        backgroundRect: {
          x: t.backgroundRect.x * a,
          y: t.backgroundRect.y * o,
          width: t.backgroundRect.width * a,
          height: t.backgroundRect.height * o,
        },
      });
    if (!f.ok)
      return { solved: !1, errorCode: `match-not-found`, error: `拖拽探测失败：${f.reason}` };
    let p = f.measurement,
      m = t.backgroundRect.x * a,
      h = t.backgroundRect.y * o,
      g = m - Math.round(m),
      _ = ou(
        d,
        Math.round(m),
        Math.round(h),
        Math.round(t.backgroundRect.width * a),
        Math.round(t.backgroundRect.height * o),
      ),
      v = ou(i, Math.round(m), Math.round(h), _.width, _.height),
      y = (n.excludedGapX ?? []).filter((e) => Number.isFinite(e)).map((e) => e * a + g),
      b = iu(
        _,
        v,
        p.template,
        p.pieceX - Math.round(m),
        p.originX - Math.round(m),
        p.pieceY - Math.round(h),
        y,
      );
    if (!b)
      return {
        solved: !1,
        errorCode: `match-not-found`,
        error: `用实测碎片模板仍未在背景图中找到匹配的缺口`,
      };
    let x = p.pieceX - Math.round(m),
      S = b.x - x,
      C = Number.isFinite(n.correctionPx ?? 0) ? (n.correctionPx ?? 0) : 0,
      w = S / (p.measuredRatio * a) + C,
      T = u.x - e.x + w,
      E = {
        source: `viewport-screenshot`,
        imageScaleX: Math.round(a * 1e3) / 1e3,
        imageScaleY: Math.round(o * 1e3) / 1e3,
        imageDistance: Math.round((S / a) * 10) / 10,
        handleRange: Math.round((t.trackRect.width - t.handleRect.width) * 10) / 10,
        pieceRange: Math.round(t.backgroundRect.width * 10) / 10,
        conversionRatio: Math.round(p.measuredRatio * 1e3) / 1e3,
        correctionPx: C,
        candidateCount: 1,
        probeDistance: Math.round(s * 10) / 10,
        measuredRatio: Math.round(p.measuredRatio * 1e3) / 1e3,
        cropOffsetX: Math.round(g * 100) / 100,
      };
    if (w < -2 || T > c + 2)
      return {
        solved: !1,
        errorCode: `distance-out-of-range`,
        error: `实测剩余距离 ${w.toFixed(1)}px 超出轨道可用行程（已移动 ${(u.x - e.x).toFixed(1)}/${c.toFixed(1)}px）`,
        method: b.method,
        confidence: b.confidence,
        diagnostics: E,
      };
    if (w > 0.5) {
      let n = $l(w, r, c - (u.x - e.x));
      await l.moveBy(eu(u.x, u.y, n, t.viewportWidth, t.viewportHeight, r));
    }
    return (
      await l.release(),
      {
        solved: !0,
        gapX: Math.round(((b.x - g) / a) * 10) / 10,
        distance: Math.round(T * 100) / 100,
        method: b.method,
        confidence: b.confidence,
        diagnostics: E,
      }
    );
  } finally {
    await l.release().catch(() => {});
  }
}

function ou(e, t, n, r, i) {
  let a = Math.max(1, r),
    o = Math.max(1, i),
    s = { width: a, height: o, data: new Uint8ClampedArray(a * o * 4) };
  for (let r = 0; r < o; r += 1) {
    let i = n + r;
    if (!(i < 0 || i >= e.height))
      for (let n = 0; n < a; n += 1) {
        let o = t + n;
        if (o < 0 || o >= e.width) continue;
        let c = (i * e.width + o) * 4,
          l = (r * a + n) * 4;
        ((s.data[l] = e.data[c]),
          (s.data[l + 1] = e.data[c + 1]),
          (s.data[l + 2] = e.data[c + 2]),
          (s.data[l + 3] = e.data[c + 3]));
      }
  }
  return s;
}

async function su(e, t, n, r, i) {
  let a = Ul(t);
  if (a) return { solved: !1, errorCode: `invalid-geometry`, error: a };
  if (
    t.backgroundSource != null && (t.pieceSource != null || t.referenceBackgroundSource != null)
      ? n.attempt % 2 == 0
      : n.attempt % 2 == 1
  )
    return au(e, t, n, r, i).catch((e) => ({
      solved: !1,
      errorCode: `drag-failed`,
      error: e instanceof Error ? e.message : String(e),
    }));
  let o;
  try {
    o = await yl(e, t);
  } catch (e) {
    return {
      solved: !1,
      errorCode: `image-unavailable`,
      error: e instanceof Error ? e.message : String(e),
    };
  }
  if (o.source === `viewport-screenshot` && o.template && !Fl(o.template))
    return {
      solved: !1,
      errorCode: `invalid-geometry`,
      error: `页面上识别出的「拼图块」是纯色填充，更像缺口本身，无法确定拖动起点`,
    };
  let s = (n.excludedGapX ?? [])
      .filter((e) => Number.isFinite(e))
      .map((e) => ({
        x: e * o.imageScaleX + o.cropOffsetX,
        radius: Math.max(6, (o.template?.image.width ?? 40) / 3),
      })),
    c = await Bl(t, o, s);
  if (!c)
    return {
      solved: !1,
      errorCode: `match-not-found`,
      error: s.length
        ? `排除 ${s.length} 个已失败位置后，没有找到置信度足够且唯一的滑块缺口`
        : `没有找到置信度足够且唯一的滑块缺口`,
    };
  let l = Gl(t, o, c, n.correctionPx);
  if (!l.ok)
    return {
      solved: !1,
      errorCode: l.errorCode,
      error: l.error,
      method: c.method,
      confidence: c.confidence,
    };
  let { plan: u } = l,
    d = t.trackRect.x + t.trackRect.width - (t.handleRect.x + t.handleRect.width),
    f = $l(u.distance, r, Math.max(u.distance, d - 1)),
    p = t.handleRect.x + t.handleRect.width / 2,
    m = t.handleRect.y + t.handleRect.height / 2,
    h = eu(p, m, f, t.viewportWidth, t.viewportHeight, r);
  try {
    await bgPlatformState.qc(
      e,
      {
        startX: p,
        startY: m,
        points: h,
        viewportWidth: t.viewportWidth,
        viewportHeight: t.viewportHeight,
        targetToken: t.handleToken,
        frameTarget: i,
      },
      r,
    );
  } catch (e) {
    return {
      solved: !1,
      errorCode: `drag-failed`,
      error: e instanceof Error ? e.message : String(e),
      gapX: u.gapX,
      distance: u.distance,
      method: c.method,
      confidence: c.confidence,
      diagnostics: u.diagnostics,
    };
  }
  return {
    solved: !0,
    gapX: u.gapX,
    distance: u.distance,
    method: `${o.source}:${c.method}`,
    confidence: c.confidence,
    diagnostics: u.diagnostics,
  };
}

function cu(e, t, n = { attempt: 1 }, r = Math.random, i) {
  let a = typeof n == `function` ? { attempt: 1 } : n,
    o = typeof n == `function` ? n : r,
    s = bgSliderState.tu.get(e);
  if (s)
    return s.challengeKey === t.challengeKey
      ? s.promise
      : Promise.resolve({
          solved: !1,
          errorCode: `busy`,
          error: `当前标签页已有滑块识别任务在执行`,
        });
  let c = su(e, t, a, o, i).finally(() => {
    bgSliderState.tu.get(e)?.promise === c && bgSliderState.tu.delete(e);
  });
  return (bgSliderState.tu.set(e, { challengeKey: t.challengeKey, promise: c }), c);
}

function lu(e) {
  try {
    let t = new URL(e);
    return (
      t.protocol === `https:` &&
      [
        `turing.captcha.qcloud.com`,
        `ca.turing.captcha.qcloud.com`,
        `turing.captcha.gtimg.com`,
        `global.turing.captcha.gtimg.com`,
      ].includes(t.hostname)
    );
  } catch {
    return !1;
  }
}

function pu(e) {
  (bgSliderState.fu.delete(e.sessionId),
    e.frameId != null &&
      chrome.tabs
        .sendMessage(
          e.tabId,
          { type: bgSliderState.uu, sessionId: e.sessionId },
          { frameId: e.frameId },
        )
        .catch(() => void 0));
}

function mu() {
  for (let e of bgSliderState.fu.values()) Date.now() >= e.deadline && pu(e);
}

function hu(e) {
  return { state: e.state, steps: e.steps, result: e.result };
}

async function gu(e, t) {
  mu();
  let n = t.tab?.id;
  if (n == null || !/^sf-[a-z0-9-]{8,80}$/i.test(e.sessionId))
    return { ok: !1, error: `验证码内嵌页会话无效` };
  let r = await bgCheckinState.V.get(n);
  if (!r) return { ok: !1, error: `签到任务已结束` };
  if (e.type === `SLIDER_FRAME_PREPARE`) {
    if (t.frameId !== 0 || e.runId !== r.runId || !bgCheckinState.ut(r, t.url))
      return { ok: !1, error: `只有当前签到任务的主页面可以启用验证码助手` };
    if (!lu(e.frameUrl) || !/^p-[a-z0-9-]{8,80}$/i.test(e.frameToken))
      return { ok: !1, error: `不是受支持的腾讯验证码 iframe` };
    await bgPlatformState.ac(n, e, [{ x: 0.5, y: 0.5 }]);
    let i = ((await chrome.webNavigation.getAllFrames({ tabId: n })) ?? [])
      .filter((t) => t.parentFrameId === 0 && t.url === e.frameUrl && !t.errorOccurred)
      .map((e) => e.frameId)
      .slice(0, 6);
    if (!i.length) return { ok: !1, error: `腾讯验证码内嵌页面仍在加载` };
    for (let e of bgSliderState.fu.values()) e.tabId === n && pu(e);
    let a = {
      ...e,
      tabId: n,
      candidateIds: i,
      state: `connecting`,
      steps: [],
      deadline: Date.now() + bgSliderState.du,
    };
    bgSliderState.fu.set(e.sessionId, a);
    try {
      await chrome.scripting.executeScript({
        target: { tabId: n, frameIds: i },
        files: [`content-scripts/slider-captcha-frame.js`],
      });
    } catch (e) {
      return (
        pu(a),
        { ok: !1, error: `无法载入验证码助手：${e instanceof Error ? e.message : String(e)}` }
      );
    }
    return { ok: !0, feature: { sliderFrame: hu(a) } };
  }
  let i = bgSliderState.fu.get(e.sessionId);
  if (!i || i.tabId !== n || i.runId !== r.runId)
    return { ok: !1, error: `验证码内嵌页会话已结束` };
  if (e.type === `SLIDER_FRAME_STATUS` || e.type === `SLIDER_FRAME_CANCEL`) {
    if (t.frameId !== 0 || e.runId !== i.runId || !bgCheckinState.ut(r, t.url))
      return { ok: !1, error: `验证码会话不属于当前主页面` };
    let n = hu(i);
    return (e.type === `SLIDER_FRAME_CANCEL` && pu(i), { ok: !0, feature: { sliderFrame: n } });
  }
  return t.frameId == null ||
    t.frameId === 0 ||
    t.url !== i.frameUrl ||
    !i.candidateIds.includes(t.frameId)
    ? { ok: !1, error: `验证码助手来自未经授权的内嵌页面` }
    : e.type === `SLIDER_FRAME_CONNECT`
      ? i.state === `connecting`
        ? (await bgPlatformState.ac(n, i, [{ x: 0.5, y: 0.5 }]),
          (i.frameId = t.frameId),
          (i.documentId = t.documentId),
          (i.state = `running`),
          {
            ok: !0,
            feature: { sliderFrame: { ...hu(i), runId: i.runId, deadline: i.deadline - 3e3 } },
          })
        : { ok: !1, error: `验证码助手已连接` }
      : t.frameId !== i.frameId || (i.documentId && t.documentId !== i.documentId)
        ? { ok: !1, error: `验证码文档已重建，旧助手不能继续操作` }
        : (e.steps.length >= i.steps.length &&
            (i.steps = e.steps.slice(0, 160).map((e) => String(e).slice(0, 1500))),
          e.result && ((i.result = e.result), (i.state = `finished`)),
          { ok: !0 });
}

async function _u(e, t, n) {
  mu();
  let r = n ? bgSliderState.fu.get(n) : void 0;
  if (
    !r ||
    r.state !== `running` ||
    r.runId !== t ||
    r.tabId !== e.tab?.id ||
    r.frameId !== e.frameId ||
    e.url !== r.frameUrl ||
    (r.documentId && e.documentId !== r.documentId)
  )
    throw Error(`验证码 iframe 没有有效的本轮拖动会话`);
  let i = await bgCheckinState.V.get(r.tabId),
    a = await chrome.tabs.get(r.tabId);
  if (!i || i.runId !== t || !bgCheckinState.ut(i, a.url))
    throw (pu(r), Error(`签到任务已结束或主页面已离开本站`));
  return {
    frameId: r.frameId,
    documentId: r.documentId,
    frameToken: r.frameToken,
    frameUrl: r.frameUrl,
  };
}

async function vu(e, t, n, r) {
  let i = t.backgroundRect,
    a = t.handleRect,
    o = await bgPlatformState.ac(e, r, [
      { x: (a.x + a.width / 2) / t.viewportWidth, y: (a.y + a.height / 2) / t.viewportHeight },
      ...[0.1, 0.5, 0.9].map((e) => ({
        x: (i.x + i.width * e) / t.viewportWidth,
        y: (i.y + i.height * e) / t.viewportHeight,
      })),
    ]),
    s = bgPlatformState.oc(o, t.viewportWidth, t.viewportHeight),
    c = (e) => bgPlatformState.sc(e, o, s),
    l = await cu(
      e,
      {
        ...t,
        panelRect: c(t.panelRect),
        backgroundRect: c(i),
        trackRect: c(t.trackRect),
        handleRect: c(a),
        pieceRect: t.pieceRect ? c(t.pieceRect) : void 0,
        viewportWidth: o.viewportWidth,
        viewportHeight: o.viewportHeight,
        devicePixelRatio: o.devicePixelRatio,
        challengeKey: `${r.frameToken}:${t.challengeKey}`,
      },
      {
        ...n,
        correctionPx: n.correctionPx == null ? void 0 : n.correctionPx * s.x,
        excludedGapX: n.excludedGapX?.map((e) => e * s.x),
      },
      Math.random,
      r,
    );
  return {
    ...l,
    gapX: l.gapX == null ? void 0 : l.gapX / s.x,
    distance: l.distance == null ? void 0 : l.distance / s.x,
    diagnostics: l.diagnostics
      ? {
          ...l.diagnostics,
          imageScaleX: l.diagnostics.imageScaleX * s.x,
          imageScaleY: l.diagnostics.imageScaleY * s.y,
          handleRange: l.diagnostics.handleRange / s.x,
          pieceRange: l.diagnostics.pieceRange / s.x,
          correctionPx: l.diagnostics.correctionPx / s.x,
          probeDistance:
            l.diagnostics.probeDistance == null ? void 0 : l.diagnostics.probeDistance / s.x,
        }
      : void 0,
  };
}

function yu(e) {
  let t = e.toLowerCase();
  if (t === `localhost` || t.includes(`:`) || /^\d+(?:\.\d+){3}$/.test(t)) return [t];
  let n = t.split(`.`).filter(Boolean),
    r = [];
  for (let e = 0; e < Math.max(1, n.length - 1); e += 1) r.push(n.slice(e).join(`.`));
  return r;
}

Object.assign(bgSliderState, {
  $c,
  el,
  tl,
  nl,
  rl,
  il,
  al,
  ol,
  sl,
  cl,
  ll,
  ul,
  dl,
  pl,
  ml,
  hl,
  gl,
  _l,
  vl,
  yl,
  Sl,
  Cl,
  wl,
  Tl,
  El,
  Dl,
  Ol,
  kl,
  Al,
  jl,
  Ml,
  Nl,
  Pl,
  Fl,
  Il,
  Ll,
  Rl,
  Bl,
  Vl,
  Hl,
  Ul,
  Wl,
  Gl,
  Jl,
  Yl,
  Xl,
  Zl,
  Ql,
  $l,
  eu,
  nu,
  ru,
  iu,
  au,
  ou,
  su,
  cu,
  lu,
  pu,
  mu,
  hu,
  gu,
  _u,
  vu,
  yu,
});

export async function handleSliderMessage(e, i) {
  switch (e.type) {
    case `SLIDER_FRAME_PREPARE`:
    case `SLIDER_FRAME_CONNECT`:
    case `SLIDER_FRAME_REPORT`:
    case `SLIDER_FRAME_STATUS`:
    case `SLIDER_FRAME_CANCEL`:
      return gu(e, i);
    case `SLIDER_CRACK`: {
      let t = i.tab?.id;
      if (t == null) return { ok: !1, error: `缺少任务标签页` };
      if (i.frameId !== 0) {
        let n = await _u(i, e.runId, e.frameSessionId);
        return { ok: !0, feature: { slider: await vu(t, e.slider, e.options, n) } };
      }
      let n = await bgCheckinState.V.get(t);
      return !n || n.runId !== e.runId
        ? { ok: !1, error: `任务已结束` }
        : bgCheckinState.ut(n, i.url ?? i.tab?.url)
          ? { ok: !0, feature: { slider: await cu(t, e.slider, e.options) } }
          : { ok: !1, error: `当前页面不属于该签到任务` };
    }
  }
}

export async function handleSliderMutation(e) {
  switch (e.action) {
  }
}

export function initializeBackgroundSlider(step) {
  switch (step) {
    case 211: {
      bgSliderState.Xc = 12582912;
      break;
    }
    case 212: {
      bgSliderState.Zc = 16e6;
      break;
    }
    case 213: {
      bgSliderState.Qc = 8e3;
      break;
    }
    case 214: {
      bgSliderState.fl = 8e3;
      break;
    }
    case 215: {
      bgSliderState.bl = null;
      break;
    }
    case 216: {
      bgSliderState.xl = !1;
      break;
    }
    case 217: {
      bgSliderState.zl = 0.75;
      break;
    }
    case 218: {
      bgSliderState.Kl = 60;
      break;
    }
    case 219: {
      bgSliderState.ql = 26;
      break;
    }
    case 220: {
      bgSliderState.tu = new Map();
      break;
    }
    case 221: {
      bgSliderState.uu = `aah-slider-frame-stop`;
      break;
    }
    case 222: {
      bgSliderState.du = 65e3;
      break;
    }
    case 223: {
      bgSliderState.fu = new Map();
      break;
    }
    case 243: {
      bgSliderState.ud = {
        widgets: [
          `.tencent-captcha-dy__slider-groove`,
          `.tencent-captcha-dy__slider-block`,
          `.tencent-captcha-dy__verify-bg`,
        ].join(`, `),
        success: [
          `.tencent-captcha-dy__slider-groove--success`,
          `.tencent-captcha-dy__slider-block--success`,
        ].join(`, `),
        handle: `.tencent-captcha-dy__slider-block`,
        background: `.tencent-captcha-dy__verify-bg`,
        backgroundImage: `.tencent-captcha-dy__verify-bg-img`,
        piece: `.tencent-captcha-dy__fg-item`,
        refresh: `.tencent-captcha-dy__footer-icon--refresh`,
      };
      break;
    }
    case 244: {
      bgSliderState.dd = [
        `.geetest_panel`,
        `.geetest_holder`,
        `.geetest_slider_button`,
        `.gt_holder`,
        `.gt_widget`,
        `.gt_slider_knob`,
        `.slide-verify`,
        `.slider-captcha`,
        `.captcha-slider`,
        `.verify-slider`,
        `.jigsaw-slider`,
        `.drag-captcha`,
        `.yidun_slider`,
        `.yidun_panel`,
        `.nc-container`,
        `.nc_iconfont.btn_slide`,
        `[class*="captcha" i][class*="slider" i]`,
        `[id*="captcha" i][id*="slider" i]`,
        `[class*="verify" i][class*="slider" i]`,
        `[class*="slider" i][class*="verify" i]`,
        `[class*="jigsaw" i][class*="slider" i]`,
        `[class*="slide-verify" i]`,
      ].join(`, `);
      break;
    }
    case 245: {
      ([
        `.geetest_success`,
        `.gt_info_success`,
        `.gt_success`,
        `.yidun_success`,
        `[class*="captcha" i][data-state="verified" i]`,
        `[class*="captcha" i][data-status="success" i]`,
        `[class*="slider" i][data-state="verified" i]`,
        `[class*="slider" i][data-status="success" i]`,
        `[class*="verify" i][data-state="success" i]`,
      ].join(`, `),
        [
          `[role="slider"]`,
          `[draggable="true"]`,
          `.geetest_slider_button`,
          `.gt_slider_knob`,
          `.nc_iconfont.btn_slide`,
          `[class*="slider" i][class*="btn" i]`,
          `[class*="slider" i][class*="button" i]`,
          `[class*="slider" i][class*="handle" i]`,
          `[class*="slider" i][class*="knob" i]`,
          `[class*="slide" i][class*="btn" i]`,
          `[class*="drag" i][class*="btn" i]`,
          `[class*="drag" i][class*="button" i]`,
          `[class*="move" i][class*="btn" i]`,
        ].join(`, `),
        [
          bgSliderState.dd,
          `[role="dialog"]`,
          `[aria-modal="true"]`,
          `[class*="captcha" i]`,
          `[id*="captcha" i]`,
          `[class*="verify" i]`,
          `[id*="verify" i]`,
          `img`,
          `canvas`,
          `[style*="background" i]`,
        ].join(`, `));
      break;
    }
    case 246: {
      bgSliderState.fd = [
        `iframe[src*="captcha" i]`,
        `iframe[src*="turnstile" i]`,
        `iframe[src*="challenge" i]`,
        `iframe[title*="captcha" i]`,
        `[class*="captcha" i]`,
        `[id*="captcha" i]`,
        `[class*="turnstile" i]`,
        `[class*="hcaptcha" i]`,
        `[class*="recaptcha" i]`,
      ];
      break;
    }
    case 247: {
      bgSliderState.pd = [
        `[class*="geetest" i]`,
        `[class*="yidun" i]`,
        `[class*="nc-container" i]`,
        `[class*="tcaptcha" i]`,
        `[class*="slider" i]`,
        `[class*="verify" i]`,
      ];
      break;
    }
    case 248: {
      [...bgSliderState.fd, ...bgSliderState.pd].join(`, `);
      break;
    }
    case 249: {
      bgSliderState.md = `[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)`;
      break;
    }
    case 250: {
      (RegExp(
        `^\\s*(${bgSliderState.md})\\s*([+\\-*/])\\s*(${bgSliderState.md})\\s*(?:=\\s*(?:\\?)?)?\\s*$`,
      ),
        RegExp(`(${bgSliderState.md}\\s*[+\\-*/]\\s*${bgSliderState.md}\\s*=\\s*(?:\\?)?)`),
        [
          `#challenge-running`,
          `#cf-challenge-running`,
          `.cf-challenge-running`,
          `#challenge-stage`,
          `form#challenge-form`,
        ].join(`, `),
        [
          `script[src*="/cdn-cgi/challenge-platform/"]`,
          `link[href*="/cdn-cgi/challenge-platform/"]`,
          `iframe[src*="/cdn-cgi/challenge-platform/"]`,
          `#cf-wrapper`,
          `[data-ray]`,
        ].join(`, `));
      break;
    }
    case 251: {
      bgSliderState.hd = [
        `.cf-turnstile`,
        `.turnstile-wrapper`,
        `.turnstile-container`,
        `[class*="turnstile" i]`,
        `[data-sitekey][class*="turnstile" i]`,
        `[id^="cf-chl-widget-"]:not(input):not(textarea)`,
        `#challenge-stage input[type="checkbox"]`,
        `#challenge-stage [role="checkbox"]`,
        `#challenge-stage button:not([disabled])`,
        `iframe[src*="challenges.cloudflare.com"]`,
        `iframe[title*="cloudflare security challenge" i]`,
      ].join(`, `);
      break;
    }
    case 252: {
      ([
        `.g-recaptcha`,
        `[class*="recaptcha" i][data-sitekey]`,
        `iframe[src*="recaptcha"]`,
        `iframe[title*="recaptcha" i]`,
      ].join(`, `),
        [
          `.h-captcha`,
          `[class*="hcaptcha" i][data-sitekey]`,
          `iframe[src*="hcaptcha.com"]`,
          `iframe[title*="hcaptcha" i]`,
        ].join(`, `),
        [
          bgSliderState.dd,
          bgSliderState.ud.widgets,
          bgSliderState.hd,
          `.g-recaptcha`,
          `[class*="recaptcha" i][data-sitekey]`,
          `iframe[src*="recaptcha"]`,
          `iframe[title*="recaptcha" i]`,
          `.h-captcha`,
          `[class*="hcaptcha" i][data-sitekey]`,
          `iframe[src*="hcaptcha.com"]`,
          `iframe[title*="hcaptcha" i]`,
        ].join(`, `),
        [
          `[class*="captcha" i]`,
          `[id*="captcha" i]`,
          `iframe[src*="captcha" i]`,
          `img[src*="captcha" i]`,
          `canvas[class*="captcha" i]`,
          `input[name*="captcha" i]:not([type="hidden"])`,
        ].join(`, `),
        [
          `iframe[src*="captcha" i]`,
          `img[src*="captcha" i]`,
          `canvas[class*="captcha" i]`,
          `input[name*="captcha" i]:not([type="hidden"])`,
        ].join(`, `),
        [`[class*="captcha" i]`, `[id*="captcha" i]`].join(`, `),
        [
          `iframe`,
          `img`,
          `canvas`,
          `svg`,
          `input:not([type="hidden"])`,
          `textarea`,
          `select`,
          `button`,
          `[role="button"]`,
          `[role="checkbox"]`,
          `[role="slider"]`,
          `[role="textbox"]`,
          `[contenteditable="true"]`,
          `[onclick]`,
          `[tabindex]`,
        ].join(`, `));
      break;
    }
  }
}

// solved:true means a drag was dispatched; the executing page verifies acceptance.
export const sliderService = Object.freeze({
  solve: (...args) => cu(...args),
  handleFrame: (...args) => gu(...args),
  handleMessage: handleSliderMessage,
});
