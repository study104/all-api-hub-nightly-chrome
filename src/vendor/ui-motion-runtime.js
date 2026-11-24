/** src/vendor/ui-motion-runtime.js: 功能模块实现，保留发布版本的符号以便逐步恢复命名。 */
import { createUiModuleRuntime, createUiScope, initializeUiScope } from '../shared/ui-scope.js';

// 打包依赖：Motion、Lucide 和 Zustand 运行实现 — sharedUi published scope.

export const sharedUiRuntime = createUiModuleRuntime({
  bindingNames: [
    'A',
    'j',
    'M',
    'N',
    'P',
    'ne',
    're',
    'ie',
    'ae',
    'F',
    'I',
    'oe',
    'se',
    'L',
    'ce',
    'le',
    'R',
    'z',
    'ue',
    'de',
    'fe',
    'pe',
    'me',
    'he',
    'ge',
    '_e',
    've',
    'ye',
    'be',
    'xe',
    'Se',
    'Ce',
    'we',
    'Te',
    'Ee',
    'De',
    'Oe',
    'ke',
    'Ae',
    'je',
    'Me',
    'B',
    'Ne',
    'Pe',
    'V',
    'Fe',
    'Ie',
    'Le',
    'Re',
    'ze',
    'Be',
    'Ve',
    'He',
    'Ue',
    'We',
    'Ge',
    'Ke',
    'qe',
    'Je',
    'Ye',
    'Xe',
    'Ze',
    'Qe',
    '$e',
    'et',
    'tt',
    'nt',
    'rt',
    'H',
    'it',
    'at',
    'ot',
    'st',
    'U',
    'ct',
    'lt',
    'ut',
    'dt',
    'ft',
    'pt',
    'mt',
    'ht',
    'gt',
    '_t',
    'vt',
    'yt',
    'bt',
    'xt',
    'St',
    'Ct',
    'wt',
    'Tt',
    'Et',
    'Dt',
    'Ot',
    'kt',
    'W',
    'At',
    'jt',
    'Mt',
    'Nt',
    'Pt',
    'Ft',
    'It',
    'Lt',
    'Rt',
    'zt',
    'Bt',
    'Vt',
    'Ht',
    'Ut',
    'Wt',
    'Gt',
    'Kt',
    'qt',
    'Jt',
    'Yt',
    'G',
    'Xt',
    'Zt',
    'Qt',
    '$t',
    'en',
    'tn',
    'nn',
    'K',
    'rn',
    'an',
    'on',
    'sn',
    'cn',
    'ln',
    'un',
    'dn',
    'fn',
    'pn',
    'mn',
    'hn',
    'gn',
    '_n',
    'vn',
    'yn',
    'bn',
    'xn',
    'Sn',
    'Cn',
    'wn',
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
    'Zn',
    'Qn',
    '$n',
    'er',
    'tr',
    'nr',
    'rr',
    'ir',
    'ar',
    'or',
    'sr',
    'cr',
    'lr',
    'ur',
    'dr',
    'fr',
    'pr',
    'mr',
    'hr',
    'gr',
    '_r',
    'vr',
    'yr',
    'br',
    'xr',
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
    'Pr',
    'Fr',
    'Ir',
    'Lr',
    'Rr',
    'zr',
    'Br',
    'Vr',
    'Hr',
    'Ur',
    'Wr',
    'Gr',
    'Kr',
    'qr',
    'Jr',
    'Yr',
    'Xr',
    'Zr',
    'Qr',
    '$r',
    'ei',
    'ti',
    'ni',
    'ri',
    'ii',
    'ai',
    'oi',
    'si',
    'ci',
    'li',
    'ui',
    'di',
    'fi',
    'pi',
    'mi',
    'hi',
    'gi',
    '_i',
    'vi',
    'yi',
    'bi',
    'xi',
    'Si',
    'Ci',
    'wi',
    'Ti',
    'Ei',
    'Di',
    'q',
    'Oi',
    'ki',
    'Ai',
    'ji',
    'Mi',
    'Ni',
    'Pi',
    'Fi',
    'Ii',
    'Li',
    'Ri',
    'zi',
    'Bi',
    'Vi',
    'Hi',
    'Ui',
    'Wi',
    'Gi',
    'Ki',
    'qi',
    'Ji',
    'Yi',
    'Xi',
    'Zi',
    'Qi',
    '$i',
    'ea',
    'ta',
    'na',
    'ra',
    'ia',
    'aa',
    'oa',
    'sa',
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
    'Aa',
    'ja',
    'Ma',
    'Na',
    'Pa',
    'Fa',
    'Ia',
    'La',
    'Ra',
    'za',
    'Ba',
    'Va',
    'Ha',
    'Ua',
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
    'to',
    'no',
    'ro',
    'io',
    'ao',
    'oo',
    'so',
    'co',
    'lo',
    'uo',
    'fo',
    'po',
    'mo',
    'J',
    'ho',
    'go',
    '_o',
    'vo',
    'yo',
    'bo',
    'xo',
    'So',
    'Co',
    'wo',
    'To',
    'Eo',
    'Do',
    'Oo',
    'ko',
    'Ao',
    'jo',
    'Mo',
    'No',
    'Po',
    'Fo',
    'Io',
    'Lo',
    'Ro',
    'zo',
    'Bo',
    'Vo',
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
    'Ts',
    'Es',
    'Ds',
    'Os',
    'ks',
    'As',
    'js',
    'Ms',
    'Ns',
    'Ps',
    'Fs',
    'Is',
    'Ls',
    'Rs',
    'zs',
    'Bs',
    'Vs',
    'Hs',
    'Us',
    'Ws',
    'Gs',
    'Ks',
    'qs',
    'Js',
    'Ys',
    'Xs',
    'Zs',
    'Qs',
    '$s',
    'ec',
    'tc',
    'nc',
    'rc',
    'ic',
    'ac',
    'oc',
    'sc',
    'cc',
    'lc',
    'uc',
    'dc',
    'fc',
    'pc',
    'mc',
    'hc',
    'gc',
    '_c',
    'vc',
    'yc',
    'bc',
    'xc',
    'Sc',
    'Cc',
    'wc',
    'Tc',
    'Ec',
    'Dc',
    'Oc',
    'kc',
    'Ac',
    'jc',
    'Mc',
    'Nc',
    'Pc',
    'Fc',
    'Ic',
    'Lc',
    'Rc',
    'zc',
    'Bc',
    'Vc',
    'Hc',
    'Uc',
    'Wc',
    'Gc',
    'Kc',
    'qc',
    'Jc',
    'Yc',
    'Xc',
    'Zc',
    'Qc',
    '$c',
    'el',
    'tl',
    'nl',
    'rl',
    'il',
    'al',
    'ol',
    'sl',
    'cl',
    'll',
    'ul',
    'dl',
    'fl',
    'pl',
    'ml',
    'hl',
    'gl',
    '_l',
    'vl',
    'yl',
    'bl',
    'xl',
    'Sl',
    'Cl',
    'wl',
    'Tl',
    'El',
    'Dl',
    'Ol',
    'kl',
    'Al',
    'jl',
    'Ml',
    'Nl',
    'Pl',
    'Fl',
    'Il',
    'Ll',
    'Rl',
    'zl',
    'Bl',
    'Vl',
    'Hl',
    'Ul',
    'Wl',
    'Gl',
    'Kl',
    'ql',
    'Jl',
    'Yl',
    'Xl',
    'Zl',
    'Ql',
    '$l',
    'eu',
    'tu',
    'nu',
    'ru',
    'iu',
    'au',
    'ou',
    'su',
    'cu',
    'lu',
    'uu',
    'du',
    'fu',
    'pu',
    'mu',
    'hu',
    'gu',
    '_u',
    'vu',
    'yu',
    'bu',
    'xu',
    'Su',
    'Cu',
    'wu',
    'Tu',
    'Eu',
    'Du',
    'Ou',
    'ku',
    'Au',
    'ju',
    'Mu',
    'Nu',
    'Pu',
    'Fu',
    'Iu',
    'Lu',
    'Ru',
    'zu',
    'Bu',
    'Vu',
    'Hu',
    'Uu',
    'Wu',
    'Gu',
    'Ku',
    'qu',
    'Ju',
    'Yu',
    'Xu',
    'Zu',
    'Qu',
    '$u',
    'ed',
    'dd',
    'Od',
    'kd',
    'Ad',
    'jd',
    'Md',
    'Nd',
    'Pd',
    'Fd',
    'Id',
    'Ld',
    'Rd',
    'zd',
    'Bd',
    'Vd',
    'Hd',
    'Ud',
    'Wd',
    'Gd',
    'Kd',
    'qd',
    'Jd',
    'Yd',
    'Xd',
    'Zd',
    'Qd',
    '$d',
    'ef',
    'tf',
    'nf',
    'rf',
    'af',
    'of',
    'sf',
    'Y',
    'cf',
    'lf',
    'uf',
    'df',
    'ff',
    'pf',
    'mf',
    'hf',
    'gf',
    'X',
    '_f',
    'vf',
    'yf',
    'bf',
    'xf',
    'Sf',
    'Cf',
    'wf',
    'Tf',
    'Ef',
    'Df',
    'Z',
    'Of',
    'kf',
    'Af',
    'jf',
    'Mf',
    'Nf',
    'Pf',
    'Q',
    'Ff',
    'If',
    'Lf',
    'Rf',
    'zf',
    'Bf',
    'Vf',
    'Hf',
    'Uf',
    'Wf',
    'Gf',
    'Kf',
    'qf',
    'Jf',
    'Yf',
    'Xf',
    'Zf',
    'Qf',
  ],

  register(scope) {
    scope.j = function j(e) {
      let t = (0, scope.k.useRef)(null);
      return (t.current === null && (t.current = e()), t.current);
    };
    scope.P = function P(e, t) {
      e.indexOf(t) === -1 && e.push(t);
    };
    scope.ne = function ne(e, t) {
      let n = e.indexOf(t);
      n > -1 && e.splice(n, 1);
    };
    scope.oe = function oe(e) {
      let t;
      return () => (t === void 0 && (t = e()), t);
    };
    scope.me = function me(e, t, n, r, i) {
      let a,
        o,
        s = 0;
      do ((o = t + (n - t) / 2), (a = (0, scope.de)(o, r, i) - e), a > 0 ? (n = o) : (t = o));
      while (Math.abs(a) > scope.fe && ++s < scope.pe);
      return o;
    };
    scope.he = function he(e, t, n, r) {
      if (e === t && n === r) return scope.se;
      let i = (t) => (0, scope.me)(t, 0, 1, e, n);
      return (e) => (e === 0 || e === 1 ? e : (0, scope.de)(i(e), t, r));
    };
    scope.Pe = function Pe() {
      scope.Ne = void 0;
    };
    scope.Ve = function Ve(e) {
      return typeof e == `string` && e.split(`/*`)[0].includes(`var(--`);
    };
    scope.Ke = function Ke(e) {
      return e == null;
    };
    scope.$e = function $e(e) {
      let t = ``,
        n = ``,
        r = ``,
        i = ``;
      return (
        e.length > 5
          ? ((t = e.substring(1, 3)),
            (n = e.substring(3, 5)),
            (r = e.substring(5, 7)),
            (i = e.substring(7, 9)))
          : ((t = e.substring(1, 2)),
            (n = e.substring(2, 3)),
            (r = e.substring(3, 4)),
            (i = e.substring(4, 5)),
            (t += t),
            (n += n),
            (r += r),
            (i += i)),
        {
          red: parseInt(t, 16),
          green: parseInt(n, 16),
          blue: parseInt(r, 16),
          alpha: i ? parseInt(i, 16) / 255 : 1,
        }
      );
    };
    scope.dt = function dt(e) {
      return isNaN(e) && typeof e == `string` && (scope.lt.test(e) || scope.ut.test(e));
    };
    scope.vt = function vt(e) {
      let t = e.toString();
      return scope.lt.test(t) || scope.ut.test(t);
    };
    scope.yt = function yt(e) {
      let t = e.toString(),
        n = [],
        r = { color: [], number: [], var: [] },
        i = [],
        a = 0;
      return {
        values: n,
        split: t
          .replace(
            scope._t,
            (e) => (
              scope.U.test(e)
                ? (r.color.push(a), i.push(scope.pt), n.push(scope.U.parse(e)))
                : e.startsWith(scope.ht)
                  ? (r.var.push(a), i.push(scope.mt), n.push(e))
                  : (r.number.push(a), i.push(scope.ft), n.push(parseFloat(e))),
              ++a,
              scope.gt
            ),
          )
          .split(scope.gt),
        indexes: r,
        types: i,
      };
    };
    scope.bt = function bt(e) {
      return (0, scope.yt)(e).values;
    };
    scope.xt = function xt({ split: e, types: t }) {
      let n = e.length;
      return (r) => {
        let i = ``;
        for (let a = 0; a < n; a++)
          if (((i += e[a]), r[a] !== void 0)) {
            let e = t[a];
            i +=
              e === scope.ft
                ? (0, scope.Fe)(r[a])
                : e === scope.pt
                  ? scope.U.transform(r[a])
                  : r[a];
          }
        return i;
      };
    };
    scope.St = function St(e) {
      return (0, scope.xt)((0, scope.yt)(e));
    };
    scope.Tt = function Tt(e) {
      let t = (0, scope.yt)(e);
      return (0, scope.xt)(t)(t.values.map((e, n) => (0, scope.wt)(e, t.split[n])));
    };
    scope.Dt = function Dt(e, t, n) {
      return (
        n < 0 && (n += 1),
        n > 1 && --n,
        n < 1 / 6
          ? e + (t - e) * 6 * n
          : n < 1 / 2
            ? t
            : n < 2 / 3
              ? e + (t - e) * (2 / 3 - n) * 6
              : e
      );
    };
    scope.Ot = function Ot({ hue: e, saturation: t, lightness: n, alpha: r }) {
      ((e /= 360), (t /= 100), (n /= 100));
      let i = 0,
        a = 0,
        o = 0;
      if (!t) i = a = o = n;
      else {
        let r = n < 0.5 ? n * (1 + t) : n + t - n * t,
          s = 2 * n - r;
        ((i = (0, scope.Dt)(s, r, e + 1 / 3)),
          (a = (0, scope.Dt)(s, r, e)),
          (o = (0, scope.Dt)(s, r, e - 1 / 3)));
      }
      return {
        red: Math.round(i * 255),
        green: Math.round(a * 255),
        blue: Math.round(o * 255),
        alpha: r,
      };
    };
    scope.kt = function kt(e, t) {
      return (n) => (n > 0 ? t : e);
    };
    scope.Nt = function Nt(e) {
      let t = (0, scope.Mt)(e);
      if (!t) return (`${e}`, !1);
      let n = t.parse(e);
      return (t === scope.st && (n = (0, scope.Ot)(n)), n);
    };
    scope.It = function It(e, t) {
      return scope.Ft.has(e) ? (n) => (n <= 0 ? e : t) : (n) => (n >= 1 ? t : e);
    };
    scope.Lt = function Lt(e, t) {
      return (n) => (0, scope.W)(e, t, n);
    };
    scope.Rt = function Rt(e) {
      return typeof e == `number`
        ? scope.Lt
        : typeof e == `string`
          ? (0, scope.ze)(e)
            ? scope.kt
            : scope.U.test(e)
              ? scope.Pt
              : scope.Ht
          : Array.isArray(e)
            ? scope.zt
            : typeof e == `object`
              ? scope.U.test(e)
                ? scope.Pt
                : scope.Bt
              : scope.kt;
    };
    scope.zt = function zt(e, t) {
      let n = [...e],
        r = n.length,
        i = e.map((e, n) => (0, scope.Rt)(e)(e, t[n]));
      return (e) => {
        for (let t = 0; t < r; t++) n[t] = i[t](e);
        return n;
      };
    };
    scope.Bt = function Bt(e, t) {
      let n = { ...e, ...t },
        r = {};
      for (let i in n)
        e[i] !== void 0 && t[i] !== void 0 && (r[i] = (0, scope.Rt)(e[i])(e[i], t[i]));
      return (e) => {
        for (let t in r) n[t] = r[t](e);
        return n;
      };
    };
    scope.Vt = function Vt(e, t) {
      let n = [],
        r = { color: 0, var: 0, number: 0 };
      for (let i = 0; i < t.values.length; i++) {
        let a = t.types[i],
          o = e.indexes[a][r[a]],
          s = e.values[o] ?? 0;
        ((n[i] = s), r[a]++);
      }
      return n;
    };
    scope.Wt = function Wt(e, t) {
      let n = scope.Ut.exec(e);
      if (!n) return;
      let r = scope.Ut.exec(t);
      if (!r || n[2] !== r[2]) return;
      let i = n[2],
        a = parseFloat(n[1]),
        o = parseFloat(r[1]);
      return (e) => (0, scope.Fe)((0, scope.W)(a, o, e)) + i;
    };
    scope.Gt = function Gt(e, t, n) {
      if (typeof e == `number` && typeof t == `number` && typeof n == `number`)
        return (0, scope.W)(e, t, n);
      if (typeof e == `string` && typeof t == `string`) {
        let n = (0, scope.Wt)(e, t);
        if (n) return n;
      }
      return (0, scope.Rt)(e)(e, t);
    };
    scope.qt = function qt(e) {
      let t = new Set(),
        n = new Set(),
        r = !1,
        i = !1,
        a = new Set(),
        o = { delta: 0, timestamp: 0, isProcessing: !1 };
      function s(t) {
        (a.has(t) && (n.add(t), e()), t(o));
      }
      let c = {
        schedule: (e, i = !1, o = !1) => {
          let s = o && r ? t : n;
          return (i && a.add(e), s.add(e), e);
        },
        cancel: (e) => {
          (n.delete(e), a.delete(e));
        },
        process: (e) => {
          if (((o = e), r)) {
            i = !0;
            return;
          }
          r = !0;
          let a = t;
          ((t = n), (n = a), t.forEach(s), t.clear(), (r = !1), i && ((i = !1), c.process(e)));
        },
      };
      return c;
    };
    scope.Yt = function Yt(e, t, n = { delta: 0, timestamp: 0, isProcessing: !1 }) {
      let r = !1,
        i = !0,
        a = () => (r = !0),
        o = scope.Kt.reduce((e, t) => ((e[t] = (0, scope.qt)(a)), e), {}),
        {
          setup: s,
          read: c,
          resolveKeyframes: l,
          preUpdate: u,
          update: d,
          preRender: f,
          render: p,
          postRender: m,
        } = o,
        h = () => {
          let a = scope.ie.useManualTiming,
            o = a ? n.timestamp : performance.now();
          ((r = !1),
            a || (n.delta = i ? 1e3 / 60 : Math.max(Math.min(o - n.timestamp, scope.Jt), 1)),
            (n.timestamp = o),
            (n.isProcessing = !0),
            s.process(n),
            c.process(n),
            l.process(n),
            u.process(n),
            d.process(n),
            f.process(n),
            p.process(n),
            m.process(n),
            (n.isProcessing = !1),
            r && t && ((i = !1), e(h)));
        },
        g = () => {
          ((r = !0), (i = !0), n.isProcessing || e(h));
        };
      return {
        schedule: scope.Kt.reduce((e, t) => {
          let n = o[t];
          return ((e[t] = (e, t = !1, i = !1) => (r || g(), n.schedule(e, t, i))), e);
        }, {}),
        cancel: (e) => {
          for (let t = 0; t < scope.Kt.length; t++) o[scope.Kt[t]].cancel(e);
        },
        state: n,
        steps: o,
      };
    };
    scope.tn = function tn(e, t = 50, n = scope.en, r) {
      let i = 0,
        a = e.next(i);
      for (r?.push(a.value); !a.done && i < n;) ((i += t), (a = e.next(i)), r?.push(a.value));
      return i >= n ? 1 / 0 : i;
    };
    scope.nn = function nn(e, t = 100, n) {
      let r = n({ ...e, keyframes: [0, t] }),
        i = Math.min((0, scope.tn)(r), scope.en);
      return { type: `keyframes`, ease: (e) => r.next(i * e).value / t, duration: (0, scope.z)(i) };
    };
    scope.an = function an(e, t) {
      if (!(e > 1)) return 1;
      let n = Math.sqrt(e * e - 1),
        r = e - n,
        i = e + n,
        a = 2 * n * Math.exp(-t) * (1 + t);
      return (
        (0, scope.cn)(
          (e) => i * Math.exp(-r * e) - r * Math.exp(-i * e) - a,
          (e) => Math.exp(-i * e) - Math.exp(-r * e),
          t,
        ) / t
      );
    };
    scope.on = function on(e, t) {
      return e * Math.sqrt(1 - t * t);
    };
    scope.cn = function cn(e, t, n) {
      let r = n;
      for (let n = 1; n < scope.sn; n++) r -= e(r) / t(r);
      return r;
    };
    scope.un = function un({ duration: e = scope.K.duration, bounce: t = scope.K.bounce }) {
      let n, r;
      scope.K.maxDuration;
      let i = (0, scope.rn)(t);
      ((e = (0, scope.re)(scope.K.minDuration, scope.K.maxDuration, (0, scope.z)(e))),
        i < 1
          ? ((n = (t) => {
              let n = t * i,
                r = n * e,
                a = (0, scope.on)(t, i),
                o = Math.exp(-r);
              return scope.ln - (n / a) * o;
            }),
            (r = (t) => {
              let r = t * i * e,
                a = i * i * t * t * e,
                o = Math.exp(-r),
                s = (0, scope.on)(t * t, i);
              return ((-n(t) + scope.ln > 0 ? -1 : 1) * -a * o) / s;
            }))
          : ((n = (t) => -0.001 + Math.exp(-t * e) * (t * e + 1)),
            (r = (t) => Math.exp(-t * e) * (-t * (e * e)))));
      let a = 5 / e,
        o = (0, scope.cn)(n, r, a),
        s = o * (0, scope.an)(i, o * e),
        c = s * s;
      return { stiffness: c, damping: i * 2 * Math.sqrt(c), duration: (0, scope.R)(e) };
    };
    scope.fn = function fn(e, t) {
      if ((0, scope.dn)(e, t)) return e;
    };
    scope.pn = function pn(e) {
      let t = (0, scope.fn)(e.stiffness),
        n = (0, scope.fn)(e.damping, !0),
        r = (0, scope.fn)(e.mass),
        i = {
          ...e,
          stiffness: t ?? scope.K.stiffness,
          damping: n ?? scope.K.damping,
          mass: r ?? scope.K.mass,
          isResolvedFromDuration: !1,
          isTimeDefined: (t ?? n ?? r) === void 0 && (e.duration !== void 0 || e.bounce !== void 0),
        };
      if (i.isTimeDefined) {
        if (e.visualDuration) {
          let t = (0, scope.rn)(e.bounce || 0),
            n = ((2 * Math.PI) / (e.visualDuration * 1.2)) * (0, scope.an)(t, (2 * Math.PI) / 1.2);
          ((i.stiffness = n * n), (i.damping = 2 * t * Math.sqrt(i.stiffness)));
        } else (Object.assign(i, (0, scope.un)(i)), (i.isResolvedFromDuration = !0));
        (!(0, scope.dn)(i.stiffness) || !(0, scope.dn)(i.damping, !0)) &&
          ((i.stiffness = scope.K.stiffness), (i.damping = scope.K.damping));
      }
      return i;
    };
    scope.mn = function mn(e = scope.K.visualDuration, t = scope.K.bounce) {
      let n = typeof e == `object` ? e : { visualDuration: e, keyframes: [0, 1], bounce: t },
        r = n.keyframes[0],
        i = n.keyframes[n.keyframes.length - 1],
        a = { done: !1, value: r },
        {
          stiffness: o,
          damping: s,
          mass: c,
          duration: l,
          isResolvedFromDuration: u,
          isTimeDefined: d,
        } = (0, scope.pn)({ ...n }),
        f = (e) => (d ? 0 : -(0, scope.z)(e)),
        p = s / (2 * Math.sqrt(o * c)),
        m = (0, scope.z)(Math.sqrt(o / c)),
        h = p * m,
        g = {
          target: i,
          delta: i - r,
          velocity: f(n.velocity || 0) || 0,
          restSpeed: 0,
          restDelta: 0,
        },
        _ = () => {
          let e = Math.abs(g.delta) < 5;
          ((g.restSpeed =
            n.restSpeed || (e ? scope.K.restSpeed.granular : scope.K.restSpeed.default)),
            (g.restDelta =
              n.restDelta || (e ? scope.K.restDelta.granular : scope.K.restDelta.default)));
        };
      _();
      let v, y, b;
      if (p < 1) {
        let e = (0, scope.on)(m, p),
          t = { A: 0, sinC: 0, cosC: 0, t: -1, env: 0, sin: 0, cos: 0 };
        b = () => {
          ((t.A = (g.velocity + h * g.delta) / e),
            (t.sinC = h * t.A + g.delta * e),
            (t.cosC = h * g.delta - t.A * e));
        };
        let n = (n) => {
          n !== t.t &&
            ((t.t = n),
            (t.env = Math.exp(-h * n)),
            (t.sin = Math.sin(e * n)),
            (t.cos = Math.cos(e * n)));
        };
        ((v = (e) => (n(e), g.target - t.env * (t.A * t.sin + g.delta * t.cos))),
          (y = (e) => (n(e), t.env * (t.sinC * t.sin + t.cosC * t.cos))));
      } else if (p === 1) {
        v = (e) => g.target - Math.exp(-m * e) * (g.delta + (g.velocity + m * g.delta) * e);
        let e = { C: 0 };
        ((b = () => {
          e.C = g.velocity + m * g.delta;
        }),
          (y = (t) => Math.exp(-m * t) * (m * e.C * t - g.velocity)));
      } else {
        let e = m * Math.sqrt(p * p - 1),
          t = h - e,
          n = h + e,
          r = d ? 1 / 0 : 300 / e,
          i = (e, t) => Math.exp(t > r ? -e * r - h * (t - r) : -e * t),
          a = { S: 0, F: 0 };
        ((b = () => {
          let t = (g.velocity + h * g.delta) / e;
          ((a.S = (g.delta + t) / 2), (a.F = (g.delta - t) / 2));
        }),
          (v = (e) => g.target - a.S * i(t, e) - a.F * i(n, e)),
          (y = (e) => t * a.S * i(t, e) + n * a.F * i(n, e)));
      }
      b();
      let x = (u && l) || null,
        S = {
          calculatedDuration: x,
          retarget: (e, t) => {
            ((g.target = e[e.length - 1]),
              (g.delta = g.target - e[0]),
              (g.velocity = f(t)),
              (n.restSpeed && n.restDelta) || _(),
              (S.calculatedDuration = x),
              (a.done = !1),
              b());
          },
          velocity: (e) => (0, scope.R)(y(e)),
          next: (e) => {
            let t = v(e);
            if (u) a.done = e >= l;
            else {
              let n = (0, scope.R)(y(e));
              a.done = Math.abs(n) <= g.restSpeed && Math.abs(g.target - t) <= g.restDelta;
            }
            return ((a.value = a.done ? g.target : t), a);
          },
          toString: () => {
            let e = Math.min((0, scope.tn)(S), scope.en),
              t = (0, scope.$t)((t) => S.next(e * t).value, e, 30);
            return e + `ms ` + t;
          },
          toTransition: () => {},
        };
      return S;
    };
    scope.hn = function hn({
      keyframes: e,
      velocity: t = 0,
      power: n = 0.8,
      timeConstant: r = 325,
      bounceDamping: i = 10,
      bounceStiffness: a = 500,
      modifyTarget: o,
      min: s,
      max: c,
      restDelta: l = 0.5,
      restSpeed: u,
    }) {
      let d = e[0],
        f = { done: !1, value: d },
        p = (e) => e < s || e > c,
        m = (e) => (s === void 0 ? c : c === void 0 || Math.abs(s - e) < Math.abs(c - e) ? s : c),
        h = n * t,
        g = d + h,
        _ = o === void 0 ? g : o(g);
      _ !== g && (h = _ - d);
      let v = (e) => -h * Math.exp(-e / r),
        y = (e) => {
          let t = v(e);
          ((f.done = Math.abs(t) <= l), (f.value = f.done ? _ : _ + t));
        },
        b,
        x,
        S = (e) => {
          p(f.value) &&
            ((b = e),
            (x = (0, scope.mn)({
              keyframes: [f.value, m(f.value)],
              velocity: (-v(e) / r) * 1e3,
              damping: i,
              stiffness: a,
              restDelta: l,
              restSpeed: u,
            })));
        };
      return (
        S(0),
        {
          calculatedDuration: null,
          next: (e) => {
            let t = !1;
            return (
              !x && b === void 0 && ((t = !0), y(e), S(e)),
              b !== void 0 && e >= b ? x.next(e - b) : (!t && y(e), f)
            );
          },
        }
      );
    };
    scope.gn = function gn(e, t, n) {
      let r = [],
        i = n || scope.ie.mix || scope.Gt,
        a = e.length - 1;
      for (let n = 0; n < a; n++) {
        let a = i(e[n], e[n + 1]);
        (t && (a = (0, scope.L)(Array.isArray(t) ? t[n] || scope.se : t, a)), r.push(a));
      }
      return r;
    };
    scope._n = function _n(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
      let a = e.length;
      if ((t.length, a === 1)) return () => t[0];
      if (a === 2 && t[0] === t[1]) return () => t[1];
      let o = e[0] === e[1];
      e[0] > e[a - 1] && ((e = [...e].reverse()), (t = [...t].reverse()));
      let s = (0, scope.gn)(t, r, i),
        c = s.length,
        l = (n) => {
          if (o && n < e[0]) return t[0];
          let r = 0;
          if (c > 1) for (; r < e.length - 2 && !(n < e[r + 1]); r++);
          let i = (0, scope.ce)(e[r], e[r + 1], n);
          return s[r](i);
        };
      return n ? (t) => l((0, scope.re)(e[0], e[a - 1], t)) : l;
    };
    scope.vn = function vn(e, t) {
      let n = e[e.length - 1];
      for (let r = 1; r <= t; r++) {
        let i = (0, scope.ce)(0, t, r);
        e.push((0, scope.W)(n, 1, i));
      }
    };
    scope.yn = function yn(e) {
      let t = [0];
      return ((0, scope.vn)(t, e.length - 1), t);
    };
    scope.bn = function bn(e, t) {
      return e.map((e) => e * t);
    };
    scope.xn = function xn(e, t) {
      return e.map(() => t || scope.De).splice(0, e.length - 1);
    };
    scope.Sn = function Sn({ duration: e = 300, keyframes: t, times: n, ease: r = `easeInOut` }) {
      let i = (0, scope.Oe)(r) ? r.map(scope.Me) : (0, scope.Me)(r) || scope.De,
        a = { done: !1, value: t[0] };
      if (
        t.length === 2 &&
        !Array.isArray(i) &&
        (!n || n.length !== 2 || (n[0] === 0 && n[1] === 1))
      ) {
        let [n, r] = t,
          o = n === r ? void 0 : (scope.ie.mix || scope.Gt)(n, r);
        return {
          calculatedDuration: e,
          next: (t) => (
            (a.value = o ? o(i(e > 0 ? (0, scope.re)(0, 1, t / e) : 1)) : r),
            (a.done = t >= e),
            a
          ),
        };
      }
      let o = (0, scope._n)(
        (0, scope.bn)(n && n.length === t.length ? n : (0, scope.yn)(t), e),
        t,
        {
          ease: Array.isArray(i) ? i : (0, scope.xn)(t, i),
        },
      );
      return { calculatedDuration: e, next: (t) => ((a.value = o(t)), (a.done = t >= e), a) };
    };
    scope.wn = function wn(e, t, n) {
      let r = Math.max(t - scope.Cn, 0);
      return (0, scope.ue)(n - e(r), t - r);
    };
    scope.Tn = function Tn(e, t, n = 0) {
      return t <= 0
        ? n
        : e.velocity
          ? e.velocity(t)
          : (0, scope.wn)((t) => e.next(t).value, t, e.next(t).value);
    };
    scope.Dn = function Dn(e, { repeat: t, repeatType: n = `loop` }, r, i = 1) {
      let a = e.filter(scope.En),
        o = i < 0 || (t && n !== `loop` && t % 2 == 1) ? 0 : a.length - 1;
      return !o || r === void 0 ? a[o] : r;
    };
    scope.kn = function kn(e) {
      typeof e.type == `string` && (e.type = scope.On[e.type]);
    };
    scope.An = function An(e, t) {
      return {
        kind: e,
        animation: t,
        timestamp: scope.V.now(),
        frameTimestamp: scope.B.timestamp,
        frameIsProcessing: scope.B.isProcessing,
      };
    };
    scope.jn = function jn(e, t, n) {
      let r = globalThis.__MOTION_INSPECT__;
      if (r)
        try {
          r({ ...(0, scope.An)(`animation-start`, e), options: n ? { ...t, ...n } : t });
        } catch {}
    };
    scope.Mn = function Mn(e, t) {
      let n = globalThis.__MOTION_INSPECT__;
      if (n)
        try {
          n({ ...(0, scope.An)(`layout-animation-start`, e), node: t });
        } catch {}
    };
    scope.Ln = function Ln(e) {
      let [t, n] = e.slice(0, -1).split(`(`);
      if (t === `drop-shadow`) return e;
      let [r] = n.match(scope.Ge) || [];
      if (!r) return e;
      let i = n.replace(r, ``),
        a = +!!scope.In.has(t);
      return (r !== n && (a *= 100), t + `(` + a + i + `)`);
    };
    scope.Kn = function Kn(e, t) {
      let n = (0, scope.Wn)(e);
      return (
        scope.Gn.has(n) || (n = scope.Et),
        n.getAnimatableNone ? n.getAnimatableNone(t) : void 0
      );
    };
    scope.qn = function qn(e) {
      for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
    };
    scope.nr = function nr(e) {
      return +!!e.includes(`scale`);
    };
    scope.rr = function rr(e, t) {
      if (!e || e === `none`) return (0, scope.nr)(t);
      let n = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u),
        r,
        i;
      if (n) ((r = scope.tr), (i = n));
      else {
        let t = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
        ((r = scope.Xn), (i = t));
      }
      if (!i) return (0, scope.nr)(t);
      let a = r[t],
        o = i[1].split(`,`).map(scope.ar);
      return typeof a == `function` ? a(o) : o[a];
    };
    scope.ar = function ar(e) {
      return parseFloat(e.trim());
    };
    scope.dr = function dr(e) {
      let t = [];
      return (
        scope.ur.forEach((n) => {
          let r = e.getValue(n);
          if (r !== void 0) {
            let e = r.get(),
              i = +!!n.startsWith(`scale`);
            if (e === i) return;
            (t.push([n, e]), r.set(i));
          }
        }),
        t
      );
    };
    scope.pr = function pr(e, t, n, r, i, a) {
      let o = parseFloat(e);
      if (!isNaN(o)) return o;
      let { min: s, max: c } = t()[n],
        l = c - s;
      return a === `border-box` ? l : l - parseFloat(r) - parseFloat(i);
    };
    scope.yr = function yr() {
      if (scope._r) {
        let e = [],
          t = new Set(),
          n = new Set();
        scope.hr.forEach((r) => {
          r.needsMeasurement &&
            (e.push(r), t.add(r.element), scope.fr.has(r.name) && n.add(r.element));
        });
        let r = new Map();
        (n.forEach((e) => {
          let t = (0, scope.dr)(e);
          t.length && (r.set(e, t), e.render());
        }),
          e.forEach((e) => e.measureInitialState()),
          t.forEach((e) => {
            e.render();
            let t = r.get(e);
            t &&
              t.forEach(([t, n]) => {
                e.getValue(t)?.set(n);
              });
          }),
          e.forEach((e) => e.measureEndState()),
          e.forEach((e) => {
            e.suspendedScrollY !== void 0 && window.scrollTo(0, e.suspendedScrollY);
          }));
      }
      ((scope._r = !1),
        (scope.gr = !1),
        scope.hr.forEach((e) => e.complete(scope.vr)),
        scope.hr.clear());
    };
    scope.br = function br() {
      scope.hr.forEach((e) => {
        (e.readKeyframes(), e.needsMeasurement && (scope._r = !0));
      });
    };
    scope.xr = function xr() {
      ((scope.vr = !0), (0, scope.br)(), (0, scope.yr)(), (scope.vr = !1));
    };
    scope.Sr = function Sr(e, t, n) {
      if (typeof e == `string`) {
        if ((0, scope.ae)(e) || (0, scope.I)(e)) return parseFloat(e);
        if (!scope.Et.test(e) && scope.Et.test(n)) return (0, scope.Kn)(t, n);
      }
      return e ?? void 0;
    };
    scope.Tr = function Tr(e, t, n) {
      (0, scope.wr)(t) ? e.style.setProperty(t, n) : (e.style[t] = n);
    };
    scope.Dr = function Dr(e, t) {
      let n = (0, scope.oe)(e);
      return () => scope.Er[t] ?? n();
    };
    scope.Mr = function Mr(e, t) {
      if (e)
        return typeof e == `function`
          ? (0, scope.kr)()
            ? (0, scope.$t)(e, t)
            : `ease-out`
          : (0, scope.ke)(e)
            ? (0, scope.Ar)(e)
            : Array.isArray(e)
              ? e.map((e) => (0, scope.Mr)(e, t) || scope.jr.easeOut)
              : scope.jr[e];
    };
    scope.Nr = function Nr(
      e,
      t,
      n,
      {
        delay: r = 0,
        duration: i = 300,
        repeat: a = 0,
        repeatType: o = `loop`,
        ease: s = `easeOut`,
        times: c,
      } = {},
      l = void 0,
    ) {
      let u = { [t]: n };
      c && (u.offset = c);
      let d = (0, scope.Mr)(s, i);
      Array.isArray(d) && (u.easing = d);
      let f = {
        delay: r,
        duration: i,
        easing: Array.isArray(d) ? `linear` : d,
        fill: `both`,
        iterations: a + 1,
        direction: o === `reverse` ? `alternate` : `normal`,
      };
      return (l && (f.pseudoElement = l), e.animate(u, f));
    };
    scope.Pr = function Pr(e) {
      return typeof e == `function` && `applyToOptions` in e;
    };
    scope.Fr = function Fr({ type: e, ...t }) {
      return (0, scope.Pr)(e) && (0, scope.kr)()
        ? e.applyToOptions(t)
        : ((t.duration ??= 300), (t.ease ??= `easeOut`), t);
    };
    scope.Rr = function Rr(e) {
      return e in scope.Lr;
    };
    scope.zr = function zr(e) {
      typeof e.ease == `string` && (0, scope.Rr)(e.ease) && (e.ease = scope.Lr[e.ease]);
    };
    scope.Ur = function Ur(e) {
      let t = e[0];
      if (e.length === 1) return !0;
      for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0;
    };
    scope.Wr = function Wr(e, t, n, r) {
      let i = e[0];
      if (i === null) return !1;
      if (t === `display` || t === `visibility`) return !0;
      let a = e[e.length - 1],
        o = (0, scope.Hr)(i, t),
        s = (0, scope.Hr)(a, t);
      return !o || !s
        ? (o !== s && `${t}${i}${a}${o ? a : i}`, !1)
        : (0, scope.Ur)(e) || ((n === `spring` || (0, scope.Pr)(n)) && r);
    };
    scope.Gr = function Gr(e) {
      ((e.duration = 0), (e.type = `keyframes`));
    };
    scope.Jr = function Jr(e) {
      for (let t = 0; t < e.length; t++)
        if (typeof e[t] == `string` && scope.qr.test(e[t])) return !0;
      return !1;
    };
    scope.Zr = function Zr(e) {
      let {
        motionValue: t,
        name: n,
        repeatDelay: r,
        repeatType: i,
        damping: a,
        type: o,
        keyframes: s,
      } = e;
      if (!n || !(scope.Kr.has(n) || scope.Yr.has(n))) return !1;
      let c = t?.owner?.current;
      if (!(c instanceof HTMLElement) && !(c instanceof SVGElement)) return !1;
      let { onUpdate: l, transformTemplate: u } = t.owner.getProps();
      return (
        (0, scope.Xr)() &&
        (scope.Kr.has(n) || (scope.Yr.has(n) && (0, scope.Jr)(s))) &&
        (n !== `transform` || !u) &&
        !l &&
        !r &&
        i !== `mirror` &&
        a !== 0 &&
        o !== `inertia`
      );
    };
    scope.ei = function ei(e, t, n, r = 0, i = 1) {
      let a = Array.from(e)
          .sort((e, t) => e.sortNodePosition(t))
          .indexOf(t),
        o = e.size,
        s = (o - 1) * r;
      return typeof n == `function` ? n(a, o) : i === 1 ? a * r : s - a * r;
    };
    scope.ai = function ai(e, t) {
      return new scope.ii(e, t);
    };
    scope.oi = function oi(e, t) {
      if (e?.inherit && t) {
        let { inherit: n, ...r } = e;
        return { ...t, ...r };
      }
      return e;
    };
    scope.si = function si(e, t) {
      let n = e?.[t] ?? e?.default ?? e;
      return n === e ? n : (0, scope.oi)(n, e);
    };
    scope.mi = function mi(e) {
      for (let t in e) if (!scope.pi.has(t)) return !0;
      return !1;
    };
    scope._i = function _i(e) {
      let t = scope.gi.exec(e);
      if (!t) return [,];
      let [, n, r, i] = t;
      return [`--${n ?? r}`, i];
    };
    scope.vi = function vi(e, t, n = 1) {
      `${e}`;
      let [r, i] = (0, scope._i)(e);
      if (!r) return;
      let a = window.getComputedStyle(t).getPropertyValue(r);
      if (a) {
        let e = a.trim();
        return (0, scope.ae)(e) ? parseFloat(e) : e;
      }
      return (0, scope.ze)(i) ? (0, scope.vi)(i, t, n + 1) : i;
    };
    scope.yi = function yi(e) {
      let t = [{}, {}];
      return (
        e?.values.forEach((e, n) => {
          ((t[0][n] = e.get()), (t[1][n] = e.getVelocity()));
        }),
        t
      );
    };
    scope.bi = function bi(e, t, n, r) {
      let i = (t) =>
        typeof t == `function` ? t(n === void 0 ? e.custom : n, ...(0, scope.yi)(r)) : t;
      return ((t = i(t)), typeof t == `string` && (t = e.variants && e.variants[t]), i(t));
    };
    scope.xi = function xi(e, t, n) {
      return (0, scope.bi)(e.getProps(), t, n, e);
    };
    scope.Ti = function Ti(e, t, n) {
      e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, (0, scope.ai)(n));
    };
    scope.Ei = function Ei(e) {
      return (0, scope.wi)(e) ? e[e.length - 1] || 0 : e;
    };
    scope.Di = function Di(e, t) {
      let { transitionEnd: n = {}, transition: r = {}, ...i } = (0, scope.xi)(e, t) || {};
      i = { ...i, ...n };
      for (let t in i) (0, scope.Ti)(e, t, (0, scope.Ei)(i[t]));
    };
    scope.Oi = function Oi(e) {
      return !!((0, scope.q)(e) && e.add);
    };
    scope.ki = function ki(e, t) {
      let n = e.getValue(`willChange`);
      if ((0, scope.Oi)(n)) return n.add(t);
      if (!n && scope.ie.WillChange) {
        let n = new scope.ie.WillChange(`auto`);
        (e.addValue(`willChange`, n), n.add(t));
      }
    };
    scope.Ai = function Ai(e) {
      return e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
    };
    scope.Mi = function Mi(e) {
      return e.props[scope.ji];
    };
    scope.Pi = function Pi({ protectedKeys: e, needsAnimating: t }, n) {
      let r = n in e && !t[n];
      return ((t[n] = !1), r);
    };
    scope.Fi = function Fi(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
      let { transition: a, transitionEnd: o, ...s } = t,
        c = e.getDefaultTransition();
      a = a ? (0, scope.oi)(a, c) : c;
      let l = a?.reduceMotion,
        u = a?.skipAnimations;
      r && (a = r);
      let d = [],
        f = i && e.animationState?.getState()[i],
        p = a?.path;
      p && p.animateVisualElement(e, s, a, n, d);
      for (let t in s) {
        let r = e.getValue(t, e.latestValues[t] ?? null),
          i = s[t];
        if (i === void 0 || (f && (0, scope.Pi)(f, t))) continue;
        let o = { delay: n, ...(0, scope.si)(a || {}, t) };
        u && (o.skipAnimations = !0);
        let c = r.get();
        if (c !== void 0 && !r.isAnimating() && !Array.isArray(i) && i === c && !o.velocity) {
          scope.G.update(() => r.set(i));
          continue;
        }
        let p = !1;
        if (scope.Ni && window.MotionHandoffAnimation) {
          let n = (0, scope.Mi)(e);
          if (n) {
            let e = window.MotionHandoffAnimation(n, t, scope.G);
            e !== null && ((o.startTime = e), (p = !0));
          }
        }
        (0, scope.ki)(e, t);
        let m = l ?? e.shouldReduceMotion;
        r.start((0, scope.hi)(t, r, i, m && scope.Ci.has(t) ? { type: !1 } : o, e, p));
        let h = r.animation;
        h && d.push(h);
      }
      if (o) {
        let t = () =>
          scope.G.update(() => {
            o && (0, scope.Di)(e, o);
          });
        d.length ? Promise.all(d).then(t) : t();
      }
      return d;
    };
    scope.Ii = function Ii(e, t, n = {}) {
      let r = (0, scope.xi)(e, t, (0, scope.Si)(e, n.type)),
        i = n.transitionOverride || (r?.transition ?? (e.getDefaultTransition() || {})),
        a = () => Promise.all(r ? (0, scope.Fi)(e, r, n) : []),
        o = (r = 0) => {
          let { variantChildren: a } = e,
            { delayChildren: o = 0, staggerChildren: s, staggerDirection: c } = i,
            l = [];
          return (
            a?.forEach((e) => {
              (e.notify(`AnimationStart`, t),
                l.push(
                  (0, scope.Ii)(e, t, {
                    ...n,
                    delay: r + (typeof o == `function` ? 0 : o) + (0, scope.ei)(a, e, o, s, c),
                  }).then(() => e.notify(`AnimationComplete`, t)),
                ));
            }),
            Promise.all(l)
          );
        },
        { when: s } = i;
      return s
        ? s === `beforeChildren`
          ? a().then(() => o())
          : o().then(a)
        : Promise.all([a(), o(n.delay)]);
    };
    scope.Li = function Li(e, t, n = {}) {
      return (
        e.notify(`AnimationStart`, t),
        (Array.isArray(t)
          ? Promise.all(t.map((t) => (0, scope.Ii)(e, t, n)))
          : typeof t == `string`
            ? (0, scope.Ii)(e, t, n)
            : Promise.all((0, scope.Fi)(e, (0, scope.xi)(e, t, n.custom), n))
        ).then(() => {
          e.notify(`AnimationComplete`, t);
        })
      );
    };
    scope.Hi = function Hi(e) {
      return typeof e == `number`
        ? e === 0
        : e === null || e === `none` || e === `0` || (0, scope.I)(e);
    };
    scope.Wi = function Wi(e, t, n) {
      let r = 0,
        i;
      for (; r < e.length && !i;) {
        let t = e[r];
        (typeof t == `string` && !scope.Ui.has(t) && (0, scope.vt)(t) && (i = e[r]), r++);
      }
      if (i && n) for (let r of t) e[r] !== i && (e[r] = (0, scope.Kn)(n, i));
    };
    scope.qi = function qi(e) {
      return (0, scope.F)(e) && `offsetHeight` in e && !(`ownerSVGElement` in e);
    };
    scope.Ji = function Ji(e) {
      return (0, scope.F)(e) && `ownerSVGElement` in e;
    };
    scope.Xi = function Xi(e, t, n) {
      if (e == null) return [];
      if (e instanceof EventTarget) return [e];
      if (typeof e == `string`) {
        let r = document;
        t && (r = t.current);
        let i = n?.[e] ?? r.querySelectorAll(e);
        return i ? Array.from(i) : [];
      }
      return Array.from(e).filter((e) => e != null);
    };
    scope.$i = function $i(e, t, n) {
      let r = ``,
        i = !0;
      for (let a = 0; a < scope.Qi; a++) {
        let o = scope.or[a],
          s = e[o];
        if (s === void 0) continue;
        let c = !0;
        if (typeof s == `number`) c = s === +!!o.startsWith(`scale`);
        else {
          let e = parseFloat(s);
          c = o.startsWith(`scale`) ? e === 1 : e === 0;
        }
        if (!c || n) {
          let e = (0, scope.Yi)(s, scope.Hn[o]);
          if (!c) {
            i = !1;
            let t = scope.Zi[o] || o;
            r += `${t}(${e}) `;
          }
          n && (t[o] = e);
        }
      }
      let a = e.pathRotation;
      return (
        a && ((i = !1), (r += `rotate(${(0, scope.Yi)(a, scope.Hn.pathRotation)}) `)),
        (r = r.trim()),
        n ? (r = n(t, i ? `` : r)) : i && (r = `none`),
        r
      );
    };
    scope.ea = function ea(e, t, n) {
      let { style: r, vars: i, transformOrigin: a } = e,
        o = !1,
        s = !1;
      for (let e in t) {
        let n = t[e];
        if (scope.sr.has(e)) o = !0;
        else if ((0, scope.Le)(e)) i[e] = n;
        else {
          let t = (0, scope.Yi)(n, scope.Hn[e]);
          e.startsWith(`origin`) ? ((s = !0), (a[e] = t)) : (r[e] = t);
        }
      }
      if (
        (t.transform ||
          (o || n ? (r.transform = (0, scope.$i)(t, e.transform, n)) : (r.transform &&= `none`)),
        s)
      ) {
        let { originX: e = `50%`, originY: t = `50%`, originZ: n = 0 } = a;
        r.transformOrigin = `${e} ${t} ${n}`;
      }
    };
    scope.ra = function ra(e, t, n = 1, r = 0, i = !0) {
      e.pathLength = 1;
      let a = i ? scope.ta : scope.na;
      ((e[a.offset] = `${-r}`), (e[a.array] = `${t} ${n}`));
    };
    scope.aa = function aa(
      e,
      {
        attrX: t,
        attrY: n,
        attrScale: r,
        pathLength: i,
        pathSpacing: a = 1,
        pathOffset: o = 0,
        ...s
      },
      c,
      l,
      u,
    ) {
      if (((0, scope.ea)(e, s, l), c)) {
        e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
        return;
      }
      ((e.attrs = e.style), (e.style = {}));
      let { attrs: d, style: f } = e;
      for (let e of scope.ia) d[e] !== void 0 && ((f[e] = d[e]), delete d[e]);
      ((f.transform || d.transformOrigin) &&
        ((f.transformOrigin = d.transformOrigin ?? `50% 50%`), delete d.transformOrigin),
        f.transform && ((f.transformBox = u?.transformBox ?? `fill-box`), delete d.transformBox),
        t !== void 0 && (d.x = t),
        n !== void 0 && (d.y = n),
        r !== void 0 && (d.scale = r),
        i !== void 0 && (0, scope.ra)(d, i, a, o, !1));
    };
    scope.oa = function oa({ top: e, left: t, right: n, bottom: r }) {
      return { x: { min: t, max: n }, y: { min: e, max: r } };
    };
    scope.sa = function sa({ x: e, y: t }) {
      return { top: t.min, right: e.max, bottom: t.max, left: e.min };
    };
    scope.ca = function ca(e, t) {
      if (!t) return e;
      let n = t({ x: e.left, y: e.top }),
        r = t({ x: e.right, y: e.bottom });
      return { top: n.y, left: n.x, bottom: r.y, right: r.x };
    };
    scope.la = function la(e) {
      return e === void 0 || e === 1;
    };
    scope.ua = function ua({ scale: e, scaleX: t, scaleY: n }) {
      return !(0, scope.la)(e) || !(0, scope.la)(t) || !(0, scope.la)(n);
    };
    scope.da = function da(e) {
      return (
        (0, scope.ua)(e) ||
        (0, scope.fa)(e) ||
        e.z ||
        e.rotate ||
        e.rotateX ||
        e.rotateY ||
        e.skewX ||
        e.skewY
      );
    };
    scope.fa = function fa(e) {
      return (0, scope.pa)(e.x) || (0, scope.pa)(e.y);
    };
    scope.pa = function pa(e) {
      return e && e !== `0%`;
    };
    scope.ma = function ma(e, t, n) {
      return n + t * (e - n);
    };
    scope.ha = function ha(e, t, n, r, i) {
      return (i !== void 0 && (e = (0, scope.ma)(e, i, r)), (0, scope.ma)(e, n, r) + t);
    };
    scope.ga = function ga(e, t = 0, n = 1, r, i) {
      ((e.min = (0, scope.ha)(e.min, t, n, r, i)), (e.max = (0, scope.ha)(e.max, t, n, r, i)));
    };
    scope._a = function _a(e, { x: t, y: n }) {
      ((0, scope.ga)(e.x, t.translate, t.scale, t.originPoint),
        (0, scope.ga)(e.y, n.translate, n.scale, n.originPoint));
    };
    scope.ba = function ba(e, t, n, r = !1) {
      let i = n.length;
      if (!i) return;
      t.x = t.y = 1;
      let a, o;
      for (let s = 0; s < i; s++) {
        ((a = n[s]), (o = a.projectionDelta));
        let { visualElement: i } = a.options;
        (i && i.props.style && i.props.style.display === `contents`) ||
          (r &&
            a.options.layoutScroll &&
            a.scroll &&
            a !== a.root &&
            ((0, scope.xa)(e.x, -a.scroll.offset.x), (0, scope.xa)(e.y, -a.scroll.offset.y)),
          o && ((t.x *= o.x.scale), (t.y *= o.y.scale), (0, scope._a)(e, o)),
          r &&
            (0, scope.da)(a.latestValues) &&
            (0, scope.wa)(e, a.latestValues, a.layout?.layoutBox));
      }
      (t.x < scope.ya && t.x > scope.va && (t.x = 1),
        t.y < scope.ya && t.y > scope.va && (t.y = 1));
    };
    scope.xa = function xa(e, t) {
      ((e.min += t), (e.max += t));
    };
    scope.Sa = function Sa(e, t, n, r, i = 0.5) {
      (0, scope.ga)(e, t, n, (0, scope.W)(e.min, e.max, i), r);
    };
    scope.Ca = function Ca(e, t) {
      return typeof e == `string` ? (parseFloat(e) / 100) * (t.max - t.min) : e;
    };
    scope.wa = function wa(e, t, n) {
      let r = n ?? e;
      ((0, scope.Sa)(e.x, (0, scope.Ca)(t.x, r.x), t.scaleX, t.scale, t.originX),
        (0, scope.Sa)(e.y, (0, scope.Ca)(t.y, r.y), t.scaleY, t.scale, t.originY));
    };
    scope.Ta = function Ta(e, t) {
      return (0, scope.oa)((0, scope.ca)(e.getBoundingClientRect(), t));
    };
    scope.Ea = function Ea(e, t, n) {
      let r = (0, scope.Ta)(e, n),
        { scroll: i } = t;
      return (i && ((0, scope.xa)(r.x, i.offset.x), (0, scope.xa)(r.y, i.offset.y)), r);
    };
    scope.Aa = function Aa() {
      return scope.ka.x || scope.ka.y;
    };
    scope.ja = function ja(e) {
      return e === `x` || e === `y`
        ? scope.ka[e]
          ? null
          : ((scope.ka[e] = !0),
            () => {
              scope.ka[e] = !1;
            })
        : scope.ka.x || scope.ka.y
          ? null
          : ((scope.ka.x = scope.ka.y = !0),
            () => {
              scope.ka.x = scope.ka.y = !1;
            });
    };
    scope.Ma = function Ma(e, t) {
      let n = (0, scope.Xi)(e),
        r = new AbortController();
      return [n, { passive: !0, ...t, signal: r.signal }, () => r.abort()];
    };
    scope.Na = function Na(e) {
      return !(e.pointerType === `touch` || (0, scope.Aa)());
    };
    scope.Pa = function Pa(e, t, n = {}) {
      let [r, i, a] = (0, scope.Ma)(e, n);
      return (
        r.forEach((e) => {
          let n = !1,
            r = !1,
            a,
            o = () => {
              e.removeEventListener(`pointerleave`, u);
            },
            s = (e) => {
              ((a &&= (a(e), void 0)), o());
            },
            c = (e) => {
              ((n = !1),
                window.removeEventListener(`pointerup`, c),
                window.removeEventListener(`pointercancel`, c),
                r && ((r = !1), s(e)));
            },
            l = () => {
              ((n = !0),
                window.addEventListener(`pointerup`, c, i),
                window.addEventListener(`pointercancel`, c, i));
            },
            u = (e) => {
              e.pointerType !== `touch` && (n ? (r = !0) : s(e));
            };
          (e.addEventListener(
            `pointerenter`,
            (n) => {
              if (!(0, scope.Na)(n)) return;
              r = !1;
              let o = t(e, n);
              typeof o == `function` && ((a = o), e.addEventListener(`pointerleave`, u, i));
            },
            i,
          ),
            e.addEventListener(`pointerdown`, l, i));
        }),
        a
      );
    };
    scope.Ra = function Ra(e) {
      return scope.La.has(e.tagName) || e.isContentEditable === !0;
    };
    scope.Ba = function Ba(e) {
      return scope.za.has(e.tagName) || e.isContentEditable === !0;
    };
    scope.Ha = function Ha(e) {
      return (t) => {
        t.key === `Enter` && e(t);
      };
    };
    scope.Ua = function Ua(e, t) {
      e.dispatchEvent(new PointerEvent(`pointer` + t, { isPrimary: !0, bubbles: !0 }));
    };
    scope.Ga = function Ga(e) {
      return (0, scope.Ia)(e) && !(0, scope.Aa)();
    };
    scope.qa = function qa(e, t, n = {}) {
      let [r, i, a] = (0, scope.Ma)(e, n),
        o = (e) => {
          let r = e.currentTarget;
          if (!(0, scope.Ga)(e) || scope.Ka.has(e)) return;
          (scope.Va.add(r), n.stopPropagation && scope.Ka.add(e));
          let a = t(r, e),
            o = { ...i, capture: !0 },
            s = (e, t) => {
              (window.removeEventListener(`pointerup`, c, o),
                window.removeEventListener(`pointercancel`, l, o),
                scope.Va.has(r) && scope.Va.delete(r),
                (0, scope.Ga)(e) && typeof a == `function` && a(e, { success: t }));
            },
            c = (e) => {
              s(
                e,
                r === window || r === document || n.useGlobalTarget || (0, scope.Fa)(r, e.target),
              );
            },
            l = (e) => {
              s(e, !1);
            };
          (window.addEventListener(`pointerup`, c, o),
            window.addEventListener(`pointercancel`, l, o));
        };
      return (
        r.forEach((e) => {
          ((n.useGlobalTarget ? window : e).addEventListener(`pointerdown`, o, i),
            (0, scope.qi)(e) &&
              (e.addEventListener(`focus`, (e) => (0, scope.Wa)(e, i)),
              !(0, scope.Ra)(e) && !e.hasAttribute(`tabindex`) && (e.tabIndex = 0)));
        }),
        a
      );
    };
    scope.$a = function $a({ target: e, borderBoxSize: t }) {
      scope.Ja.get(e)?.forEach((n) => {
        n(e, {
          get width() {
            return (0, scope.Za)(e, t);
          },
          get height() {
            return (0, scope.Qa)(e, t);
          },
        });
      });
    };
    scope.eo = function eo(e) {
      e.forEach(scope.$a);
    };
    scope.to = function to() {
      typeof ResizeObserver < `u` && (scope.Ya = new ResizeObserver(scope.eo));
    };
    scope.no = function no(e, t) {
      scope.Ya || (0, scope.to)();
      let n = (0, scope.Xi)(e);
      return (
        n.forEach((e) => {
          let n = scope.Ja.get(e);
          (n || ((n = new Set()), scope.Ja.set(e, n)), n.add(t), scope.Ya?.observe(e));
        }),
        () => {
          n.forEach((e) => {
            let n = scope.Ja.get(e);
            (n?.delete(t), n?.size || scope.Ya?.unobserve(e));
          });
        }
      );
    };
    scope.ao = function ao() {
      ((scope.io = () => {
        let e = {
          get width() {
            return window.innerWidth;
          },
          get height() {
            return window.innerHeight;
          },
        };
        scope.ro.forEach((t) => t(e));
      }),
        window.addEventListener(`resize`, scope.io));
    };
    scope.oo = function oo(e) {
      return (
        scope.ro.add(e),
        scope.io || (0, scope.ao)(),
        () => {
          (scope.ro.delete(e),
            !scope.ro.size &&
              typeof scope.io == `function` &&
              (window.removeEventListener(`resize`, scope.io), (scope.io = void 0)));
        }
      );
    };
    scope.so = function so(e, t) {
      return typeof e == `function` ? (0, scope.oo)(e) : (0, scope.no)(e, t);
    };
    scope.lo = function lo(e) {
      return (0, scope.Ji)(e) && e.tagName === `svg`;
    };
    scope.go = function go(e) {
      return typeof e == `object` && !!e && typeof e.start == `function`;
    };
    scope._o = function _o(e) {
      return typeof e == `string` || Array.isArray(e);
    };
    scope.bo = function bo(e) {
      if ((0, scope.go)(e.animate)) return !0;
      for (let t = 0; t < scope.yo.length; t++) if ((0, scope._o)(e[scope.yo[t]])) return !0;
      return !1;
    };
    scope.xo = function xo(e) {
      return !!((0, scope.bo)(e) || e.variants);
    };
    scope.So = function So(e, t, n) {
      for (let r in t) {
        let i = t[r],
          a = n[r];
        if ((0, scope.q)(i)) e.addValue(r, i);
        else if ((0, scope.q)(a)) e.addValue(r, (0, scope.ai)(i, { owner: e }));
        else if (a !== i) {
          if (e.hasValue(r)) {
            let t = e.getValue(r);
            t.liveStyle === !0 ? t.jump(i) : t.hasAnimated || t.set(i);
          } else {
            let t = e.getStaticValue(r);
            e.addValue(r, (0, scope.ai)(t === void 0 ? i : t, { owner: e }));
          }
        }
      }
      for (let r in n) t[r] === void 0 && e.removeValue(r);
      return t;
    };
    scope.Eo = function Eo() {
      if (((scope.wo.current = !0), scope.To)) {
        if (window.matchMedia) {
          let e = window.matchMedia(`(prefers-reduced-motion)`),
            t = () => (scope.Co.current = e.matches);
          (e.addEventListener(`change`, t), t());
        } else scope.Co.current = !1;
      }
    };
    scope.ko = function ko(e) {
      scope.Oo = e;
    };
    scope.Ao = function Ao() {
      return scope.Oo;
    };
    scope.Po = function Po(e, { style: t, vars: n }, r, i) {
      let a = e.style,
        o;
      for (o in t) a[o] = t[o];
      for (o in (i?.applyProjectionStyles(a, r), n)) a.setProperty(o, n[o]);
    };
    scope.Io = function Io(e, { layout: t, layoutId: n }) {
      return (
        scope.sr.has(e) ||
        e.startsWith(`origin`) ||
        ((t || n !== void 0) && (!!scope.Fo[e] || e === `opacity`))
      );
    };
    scope.Lo = function Lo(e, t, n) {
      let r = e.style,
        i = t?.style,
        a = {};
      if (!r) return a;
      for (let t in r)
        ((0, scope.q)(r[t]) ||
          (i && (0, scope.q)(i[t])) ||
          (0, scope.Io)(t, e) ||
          n?.getValue(t)?.liveStyle !== void 0) &&
          (a[t] = r[t]);
      return a;
    };
    scope.Ro = function Ro(e) {
      return window.getComputedStyle(e);
    };
    scope.Ho = function Ho(e, t, n, r) {
      (0, scope.Po)(e, t, void 0, r);
      for (let n in t.attrs) e.setAttribute(scope.Bo.has(n) ? n : (0, scope.Ai)(n), t.attrs[n]);
    };
    scope.Uo = function Uo(e, t, n) {
      let r = (0, scope.Lo)(e, t, n);
      for (let n in e)
        if ((0, scope.q)(e[n]) || (0, scope.q)(t[n])) {
          let t =
            scope.or.indexOf(n) === -1 ? n : `attr` + n.charAt(0).toUpperCase() + n.substring(1);
          r[t] = e[n];
        }
      return r;
    };
    scope.Go = function Go(e, t) {
      if (!Array.isArray(t)) return !1;
      let n = t.length;
      if (n !== e.length) return !1;
      for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1;
      return !0;
    };
    scope.qo = function qo(e) {
      let t = (t) => Promise.all(t.map(({ animation: t, options: n }) => (0, scope.Li)(e, t, n))),
        n = (0, scope.Yo)(),
        r = !0,
        i = !1;
      function a(a) {
        let { props: o, parent: s, manuallyAnimateOnMount: c } = e,
          l = r || i,
          u = [],
          d = new Set(),
          f = {},
          p = 1 / 0,
          m = e;
        do m = m.props.inherit !== !1 && m.parent;
        while (m && !m.isControllingVariants);
        if (
          (scope.Ko.forEach((t, r) => {
            let i = n[t],
              h = o[t],
              g = m && m.props[t],
              _ = h === void 0 ? ((0, scope._o)(g) || g === !1 ? g : void 0) : h,
              v = (0, scope._o)(_),
              y = t === a ? i.isActive : null;
            y === !1 && (p = r);
            let b = v && h === void 0 && !(l && c);
            if (
              ((i.protectedKeys = { ...f }),
              (!i.isActive && y === null) ||
                (!_ && !i.prevProp) ||
                (0, scope.go)(_) ||
                typeof _ == `boolean`)
            )
              return;
            if (t === `exit` && i.isActive && y !== !0) {
              f = { ...f, ...i.prevResolvedValues };
              return;
            }
            let x = (0, scope.Jo)(i.prevProp, _),
              S = x || (v && ((y && !b) || r > p)),
              C = !1,
              w = Array.isArray(_) ? _ : [_],
              T = {};
            if (y !== !1)
              for (let n of w) {
                let {
                  transition: r,
                  transitionEnd: i,
                  ...a
                } = (0, scope.xi)(e, n, (0, scope.Si)(e, t)) || {};
                T = { ...T, ...a, ...i };
              }
            let { prevResolvedValues: E } = i;
            for (let t in { ...E, ...T }) {
              if (t in f) continue;
              let n = T[t],
                r = E[t],
                a = Array.isArray(n) && Array.isArray(r) ? !(0, scope.Go)(n, r) || x : n !== r;
              if (a && n == null) d.add(t);
              else if (a || (n !== void 0 && d.has(t))) {
                ((S = !0), d.delete(t) && (C = !0), (i.needsAnimating[t] = !0));
                let n = e.getValue(t);
                n && (n.liveStyle = !1);
              } else i.protectedKeys[t] = !0;
            }
            if (
              ((i.prevProp = _),
              (i.prevResolvedValues = T),
              i.isActive && (f = { ...f, ...T }),
              S && (!(b && x) || C))
            )
              for (let n of w) {
                let r = { type: t };
                if (typeof n == `string` && l && c && s?.enteringChildren) {
                  let t = (0, scope.xi)(s, n)?.transition?.delayChildren;
                  r.delay = (0, scope.ei)(s.enteringChildren, e, t);
                }
                u.push({ animation: n, options: r });
              }
          }),
          d.size)
        ) {
          let { initial: t } = o,
            n = {},
            r =
              typeof t != `boolean` &&
              (0, scope.xi)(e, Array.isArray(t) ? t[0] : t, e.presenceContext?.custom);
          (r && r.transition && (n.transition = r.transition),
            d.forEach((i) => {
              let a = e.getValue(i);
              a && (a.liveStyle = !0);
              let s = r && !Array.isArray(t) ? r[i] : void 0,
                c = e.getBaseTargetFromProps(o, i);
              n[i] =
                (s === void 0
                  ? c !== void 0 && !(0, scope.q)(c)
                    ? c
                    : e.initialValues[i] === void 0
                      ? e.baseTarget[i]
                      : void 0
                  : s) ?? null;
            }),
            u.push({ animation: n }));
        }
        let h =
          (l && e.blockInitialAnimation) ||
          (r && !c && (o.initial === !1 || o.initial === o.animate));
        return ((r = i = !1), !h && u.length ? t(u) : Promise.resolve());
      }
      function o(t, r) {
        if (n[t].isActive === r) return Promise.resolve();
        (e.variantChildren?.forEach((e) => e.animationState?.setActive(t, r)), (n[t].isActive = r));
        let i = a(t);
        for (let e in n) n[e].protectedKeys = {};
        return i;
      }
      return {
        animateChanges: a,
        setActive: o,
        setAnimateFunction: (n) => {
          t = n(e);
        },
        getState: () => n,
        reset: () => {
          ((n = (0, scope.Yo)()), (i = !0));
        },
      };
    };
    scope.Jo = function Jo(e, t) {
      return typeof t == `string` ? t !== e : Array.isArray(t) ? !(0, scope.Go)(t, e) : !1;
    };
    scope.Yo = function Yo() {
      let e = {};
      for (let t of scope.vo)
        e[t] = {
          isActive: t === `animate`,
          protectedKeys: {},
          needsAnimating: {},
          prevResolvedValues: {},
        };
      return e;
    };
    scope.Xo = function Xo(e, t) {
      ((e.min = t.min), (e.max = t.max));
    };
    scope.Zo = function Zo(e, t) {
      ((0, scope.Xo)(e.x, t.x), (0, scope.Xo)(e.y, t.y));
    };
    scope.Qo = function Qo(e, t) {
      ((e.translate = t.translate),
        (e.scale = t.scale),
        (e.originPoint = t.originPoint),
        (e.origin = t.origin));
    };
    scope.rs = function rs(e) {
      return e.max - e.min;
    };
    scope.is = function is(e, t, n) {
      return Math.abs(e - t) <= n;
    };
    scope.as = function as(e, t, n, r = 0.5) {
      ((e.origin = r),
        (e.originPoint = (0, scope.W)(t.min, t.max, e.origin)),
        (e.scale = (0, scope.rs)(n) / (0, scope.rs)(t)),
        (e.translate = (0, scope.W)(n.min, n.max, e.origin) - e.originPoint),
        ((e.scale >= scope.$o && e.scale <= scope.es) || isNaN(e.scale)) && (e.scale = 1),
        ((e.translate >= scope.ts && e.translate <= scope.ns) || isNaN(e.translate)) &&
          (e.translate = 0));
    };
    scope.os = function os(e, t, n, r) {
      ((0, scope.as)(e.x, t.x, n.x, r ? r.originX : void 0),
        (0, scope.as)(e.y, t.y, n.y, r ? r.originY : void 0));
    };
    scope.ss = function ss(e, t, n, r = 0) {
      ((e.min = (r ? (0, scope.W)(n.min, n.max, r) : n.min) + t.min),
        (e.max = e.min + (0, scope.rs)(t)));
    };
    scope.cs = function cs(e, t, n, r) {
      ((0, scope.ss)(e.x, t.x, n.x, r?.x), (0, scope.ss)(e.y, t.y, n.y, r?.y));
    };
    scope.ls = function ls(e, t, n, r = 0) {
      let i = r ? (0, scope.W)(n.min, n.max, r) : n.min;
      ((e.min = t.min - i), (e.max = e.min + (0, scope.rs)(t)));
    };
    scope.us = function us(e, t, n, r) {
      ((0, scope.ls)(e.x, t.x, n.x, r?.x), (0, scope.ls)(e.y, t.y, n.y, r?.y));
    };
    scope.ds = function ds(e, t, n, r, i) {
      return (
        (e -= t),
        (e = (0, scope.ma)(e, 1 / n, r)),
        i !== void 0 && (e = (0, scope.ma)(e, 1 / i, r)),
        e
      );
    };
    scope.fs = function fs(e, t = 0, n = 1, r = 0.5, i, a = e, o = e) {
      if (
        (scope.rt.test(t) &&
          ((t = parseFloat(t)), (t = (0, scope.W)(o.min, o.max, t / 100) - o.min)),
        typeof t != `number`)
      )
        return;
      let s = (0, scope.W)(a.min, a.max, r);
      (e === a && (s -= t),
        (e.min = (0, scope.ds)(e.min, t, n, s, i)),
        (e.max = (0, scope.ds)(e.max, t, n, s, i)));
    };
    scope.ps = function ps(e, t, [n, r, i], a, o) {
      (0, scope.fs)(e, t[n], t[r], t[i], t.scale, a, o);
    };
    scope.gs = function gs(e, t, n, r) {
      ((0, scope.ps)(e.x, t, scope.ms, n ? n.x : void 0, r ? r.x : void 0),
        (0, scope.ps)(e.y, t, scope.hs, n ? n.y : void 0, r ? r.y : void 0));
    };
    scope._s = function _s(e) {
      return e.translate === 0 && e.scale === 1;
    };
    scope.vs = function vs(e) {
      return (0, scope._s)(e.x) && (0, scope._s)(e.y);
    };
    scope.ys = function ys(e, t) {
      return e.min === t.min && e.max === t.max;
    };
    scope.bs = function bs(e, t) {
      return (0, scope.ys)(e.x, t.x) && (0, scope.ys)(e.y, t.y);
    };
    scope.xs = function xs(e, t) {
      return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
    };
    scope.Ss = function Ss(e, t) {
      return (0, scope.xs)(e.x, t.x) && (0, scope.xs)(e.y, t.y);
    };
    scope.Cs = function Cs(e) {
      return (0, scope.rs)(e.x) / (0, scope.rs)(e.y);
    };
    scope.ws = function ws(e, t) {
      return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
    };
    scope.Ts = function Ts(e) {
      return [e(`x`), e(`y`)];
    };
    scope.Es = function Es(e, t) {
      return t.max === t.min ? 0 : (e / (t.max - t.min)) * 100;
    };
    scope.ks = function ks(e, t, n) {
      let r = ``,
        i = e.x.translate / t.x,
        a = e.y.translate / t.y,
        o = n?.z || 0;
      if (
        ((i || a || o) && (r = `translate3d(${i}px, ${a}px, ${o}px) `),
        (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `),
        n)
      ) {
        let {
          transformPerspective: e,
          rotate: t,
          pathRotation: i,
          rotateX: a,
          rotateY: o,
          skewX: s,
          skewY: c,
        } = n;
        (e && (r = `perspective(${e}px) ${r}`),
          t && (r += `rotate(${t}deg) `),
          i && (r += `rotate(${i}deg) `),
          a && (r += `rotateX(${a}deg) `),
          o && (r += `rotateY(${o}deg) `),
          s && (r += `skewX(${s}deg) `),
          c && (r += `skewY(${c}deg) `));
      }
      let s = e.x.scale * t.x,
        c = e.y.scale * t.y;
      return ((s !== 1 || c !== 1) && (r += `scale(${s}, ${c})`), r || `none`);
    };
    scope.Ms = function Ms(e, t, n, r, i, a) {
      i
        ? ((e.opacity = (0, scope.W)(0, n.opacity ?? 1, (0, scope.Ps)(r))),
          (e.opacityExit = (0, scope.W)(t.opacity ?? 1, 0, (0, scope.Fs)(r))))
        : a && (e.opacity = (0, scope.W)(t.opacity ?? 1, n.opacity ?? 1, r));
      for (let i = 0; i < scope.As; i++) {
        let a = scope.Ki[i],
          o = (0, scope.Ns)(t, a),
          s = (0, scope.Ns)(n, a);
        (o !== void 0 || s !== void 0) &&
          ((o ||= 0),
          (s ||= 0),
          o === 0 || s === 0 || (0, scope.js)(o) === (0, scope.js)(s)
            ? ((e[a] = Math.max((0, scope.W)((0, scope.uo)(o), (0, scope.uo)(s), r), 0)),
              (scope.rt.test(s) || scope.rt.test(o)) && (e[a] += `%`))
            : (e[a] = s));
      }
      (t.rotate || n.rotate) && (e.rotate = (0, scope.W)(t.rotate || 0, n.rotate || 0, r));
    };
    scope.Ns = function Ns(e, t) {
      return e[t] === void 0 ? e.borderRadius : e[t];
    };
    scope.Is = function Is(e, t, n) {
      return (r) => (r < e ? 0 : r > t ? 1 : n((0, scope.ce)(e, t, r)));
    };
    scope.Ls = function Ls(e, t, n) {
      let r = (0, scope.q)(e) ? e : (0, scope.ai)(e);
      return (r.start((0, scope.hi)(``, r, t, n)), r.animation);
    };
    scope.Rs = function Rs(e, t, n, r = { passive: !0 }) {
      return (e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r));
    };
    scope.Vs = function Vs(e, t) {
      let n = scope.V.now(),
        r = ({ timestamp: i }) => {
          let a = i - n;
          a >= t && ((0, scope.Xt)(r), e(a - t));
        };
      return (scope.G.setup(r, !0), () => (0, scope.Xt)(r));
    };
    scope.Hs = function Hs(e) {
      return (0, scope.q)(e) ? e.get() : e;
    };
    scope.Xs = function Xs(e, t, n, r) {
      let { latestValues: i } = t;
      i[e] && ((n[e] = i[e]), t.setStaticValue(e, 0), r && (r[e] = 0));
    };
    scope.Zs = function Zs(e) {
      if (((e.hasCheckedOptimisedAppear = !0), e.root === e)) return;
      let { visualElement: t } = e.options;
      if (!t) return;
      let n = (0, scope.Mi)(t);
      if (window.MotionHasOptimisedAnimation(n, `transform`)) {
        let { layout: t, layoutId: r } = e.options;
        window.MotionCancelOptimisedAnimation(n, `transform`, scope.G, !(t || r));
      }
      let { parent: r } = e;
      r && !r.hasCheckedOptimisedAppear && (0, scope.Zs)(r);
    };
    scope.Qs = function Qs({
      attachResizeListener: e,
      defaultParent: t,
      measureScroll: n,
      checkIsScrollRoot: r,
      resetTransform: i,
    }) {
      return class {
        constructor(e = {}, n = t?.()) {
          ((this.id = scope.Ys++),
            (this.animationId = 0),
            (this.animationCommitId = 0),
            (this.children = new Set()),
            (this.options = {}),
            (this.isTreeAnimating = !1),
            (this.isAnimationBlocked = !1),
            (this.isLayoutDirty = !1),
            (this.isProjectionDirty = !1),
            (this.isSharedProjectionDirty = !1),
            (this.isTransformDirty = !1),
            (this.updateManuallyBlocked = !1),
            (this.updateBlockedByResize = !1),
            (this.isUpdating = !1),
            (this.isSVG = !1),
            (this.needsReset = !1),
            (this.shouldResetTransform = !1),
            (this.hasCheckedOptimisedAppear = !1),
            (this.treeScale = { x: 1, y: 1 }),
            (this.eventHandlers = new Map()),
            (this.hasTreeAnimated = !1),
            (this.updateScheduled = !1),
            (this.scheduleUpdate = () => this.update()),
            (this.projectionUpdateScheduled = !1),
            (this.checkUpdateFailed = () => {
              this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
            }),
            (this.updateProjection = () => {
              ((this.projectionUpdateScheduled = !1),
                scope.co.value &&
                  (scope.Ks.nodes =
                    scope.Ks.calculatedTargetDeltas =
                    scope.Ks.calculatedProjections =
                      0),
                this.nodes.forEach(scope.tc),
                this.nodes.forEach(scope.dc),
                this.nodes.forEach(scope.fc),
                this.nodes.forEach(scope.nc),
                scope.co.addProjectionMetrics && scope.co.addProjectionMetrics(scope.Ks));
            }),
            (this.resolvedRelativeTargetAt = 0),
            (this.hasProjected = !1),
            (this.isVisible = !0),
            (this.animationProgress = 0),
            (this.sharedNodes = new Map()),
            (this.latestValues = e),
            (this.root = n ? n.root || n : this),
            (this.path = n ? [...n.path, n] : []),
            (this.parent = n),
            (this.depth = n ? n.depth + 1 : 0));
          for (let e = 0; e < this.path.length; e++) this.path[e].shouldResetTransform = !0;
          this.root === this && (this.nodes = new scope.Bs());
        }
        addEventListener(e, t) {
          return (
            this.eventHandlers.has(e) || this.eventHandlers.set(e, new scope.le()),
            this.eventHandlers.get(e).add(t)
          );
        }
        notifyListeners(e, ...t) {
          let n = this.eventHandlers.get(e);
          n && n.notify(...t);
        }
        hasListeners(e) {
          return this.eventHandlers.has(e);
        }
        mount(t) {
          if (this.instance) return;
          ((this.isSVG = (0, scope.Ji)(t) && !(0, scope.lo)(t)), (this.instance = t));
          let { layoutId: n, layout: r, visualElement: i } = this.options;
          if (
            (i && !i.current && i.mount(t),
            this.root.nodes.add(this),
            this.parent && this.parent.children.add(this),
            this.root.hasTreeAnimated && (r || n) && (this.isLayoutDirty = !0),
            e)
          ) {
            let n,
              r = 0,
              i = () => (this.root.updateBlockedByResize = !1);
            (scope.G.read(() => {
              r = window.innerWidth;
            }),
              e(t, () => {
                let e = window.innerWidth;
                e !== r &&
                  ((r = e),
                  (this.root.updateBlockedByResize = !0),
                  n && n(),
                  (n = (0, scope.Vs)(i, 250)),
                  scope.Gs.hasAnimatedSinceResize &&
                    ((scope.Gs.hasAnimatedSinceResize = !1), this.nodes.forEach(scope.uc)));
              }));
          }
          (n && this.root.registerSharedNode(n, this),
            this.options.animate !== !1 &&
              i &&
              (n || r) &&
              this.addEventListener(
                `didUpdate`,
                ({ delta: e, hasLayoutChanged: t, hasRelativeLayoutChanged: n, layout: r }) => {
                  if (this.isTreeAnimationBlocked()) {
                    ((this.target = void 0), (this.relativeTarget = void 0));
                    return;
                  }
                  let a = this.options.transition || i.getDefaultTransition() || scope.yc,
                    { onLayoutAnimationStart: o, onLayoutAnimationComplete: s } = i.getProps(),
                    c = !this.targetLayout || !(0, scope.Ss)(this.targetLayout, r),
                    l = !t && n;
                  if (
                    this.options.layoutRoot ||
                    this.resumeFrom ||
                    l ||
                    (t && (c || !this.currentAnimation))
                  ) {
                    this.resumeFrom &&
                      ((this.resumingFrom = this.resumeFrom),
                      (this.resumingFrom.resumingFrom = void 0));
                    let t = { ...(0, scope.si)(a, `layout`), onPlay: o, onComplete: s };
                    ((i.shouldReduceMotion || this.options.layoutRoot) &&
                      ((t.delay = 0), (t.type = !1)),
                      this.startAnimation(t),
                      this.setAnimationOrigin(e, l, t.path));
                  } else
                    (t || (0, scope.uc)(this),
                      this.isLead() &&
                        this.options.onExitComplete &&
                        this.options.onExitComplete());
                  this.targetLayout = r;
                },
              ));
        }
        unmount() {
          (this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this));
          let e = this.getStack();
          (e && e.remove(this),
            this.parent && this.parent.children.delete(this),
            (this.instance = void 0),
            this.eventHandlers.clear(),
            (0, scope.Xt)(this.updateProjection));
        }
        blockUpdate() {
          this.updateManuallyBlocked = !0;
        }
        unblockUpdate() {
          this.updateManuallyBlocked = !1;
        }
        isUpdateBlocked() {
          return this.updateManuallyBlocked || this.updateBlockedByResize;
        }
        isTreeAnimationBlocked() {
          return (
            this.isAnimationBlocked || (this.parent && this.parent.isTreeAnimationBlocked()) || !1
          );
        }
        startUpdate() {
          this.isUpdateBlocked() ||
            ((this.isUpdating = !0),
            this.nodes && this.nodes.forEach(scope.pc),
            this.animationId++);
        }
        getTransformTemplate() {
          let { visualElement: e } = this.options;
          return e && e.getProps().transformTemplate;
        }
        willUpdate(e = !0) {
          if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
            this.options.onExitComplete && this.options.onExitComplete();
            return;
          }
          if (
            (window.MotionCancelOptimisedAnimation &&
              !this.hasCheckedOptimisedAppear &&
              (0, scope.Zs)(this),
            !this.root.isUpdating && this.root.startUpdate(),
            this.isLayoutDirty)
          )
            return;
          this.isLayoutDirty = !0;
          for (let e = 0; e < this.path.length; e++) {
            let t = this.path[e];
            ((t.shouldResetTransform = !0),
              (typeof t.latestValues.x == `string` || typeof t.latestValues.y == `string`) &&
                (t.isLayoutDirty = !0),
              t.updateScroll(`snapshot`),
              t.options.layoutRoot && t.willUpdate(!1));
          }
          let { layoutId: t, layout: n } = this.options;
          if (t === void 0 && !n) return;
          let r = this.getTransformTemplate();
          ((this.prevTransformTemplateValue = r ? r(this.latestValues, ``) : void 0),
            this.updateSnapshot(),
            e && this.notifyListeners(`willUpdate`));
        }
        update() {
          if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
            let e = this.updateBlockedByResize;
            (this.unblockUpdate(),
              (this.updateBlockedByResize = !1),
              this.clearAllSnapshots(),
              e && this.nodes.forEach(scope.ac),
              this.nodes.forEach(scope.ic));
            return;
          }
          if (this.animationId <= this.animationCommitId) {
            this.nodes.forEach(scope.oc);
            return;
          }
          ((this.animationCommitId = this.animationId),
            this.isUpdating
              ? ((this.isUpdating = !1),
                this.nodes.forEach(scope.sc),
                this.nodes.forEach(scope.cc),
                this.nodes.forEach(scope.lc),
                this.nodes.forEach(scope.$s),
                this.nodes.forEach(scope.ec))
              : this.nodes.forEach(scope.oc),
            this.clearAllSnapshots());
          let e = scope.V.now();
          ((scope.B.delta = (0, scope.re)(0, 1e3 / 60, e - scope.B.timestamp)),
            (scope.B.timestamp = e),
            (scope.B.isProcessing = !0),
            scope.Zt.update.process(scope.B),
            scope.Zt.preRender.process(scope.B),
            scope.Zt.render.process(scope.B),
            (scope.B.isProcessing = !1));
        }
        didUpdate() {
          this.updateScheduled || ((this.updateScheduled = !0), scope.Da.read(this.scheduleUpdate));
        }
        clearAllSnapshots() {
          (this.nodes.forEach(scope.rc), this.sharedNodes.forEach(scope.mc));
        }
        scheduleUpdateProjection() {
          this.projectionUpdateScheduled ||
            ((this.projectionUpdateScheduled = !0),
            scope.G.preRender(this.updateProjection, !1, !0));
        }
        scheduleCheckAfterUnmount() {
          scope.G.postRender(() => {
            this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
          });
        }
        updateSnapshot() {
          !this.snapshot &&
            this.instance &&
            ((this.snapshot = this.measure()),
            this.snapshot &&
              !(0, scope.rs)(this.snapshot.measuredBox.x) &&
              !(0, scope.rs)(this.snapshot.measuredBox.y) &&
              (this.snapshot = void 0));
        }
        updateLayout() {
          if (
            !this.instance ||
            (this.updateScroll(),
            !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)
          )
            return;
          if (this.resumeFrom && !this.resumeFrom.instance)
            for (let e = 0; e < this.path.length; e++) this.path[e].updateScroll();
          let e = this.layout;
          ((this.layout = this.measure(!1)),
            (this.layoutCorrected ||= (0, scope.J)()),
            (this.isLayoutDirty = !1),
            (this.projectionDelta = void 0),
            this.notifyListeners(`measure`, this.layout.layoutBox));
          let { visualElement: t } = this.options;
          t && t.notify(`LayoutMeasure`, this.layout.layoutBox, e ? e.layoutBox : void 0);
        }
        updateScroll(e = `measure`) {
          let t = !!(this.options.layoutScroll && this.instance);
          if (
            (this.scroll &&
              this.scroll.animationId === this.root.animationId &&
              this.scroll.phase === e &&
              (t = !1),
            t && this.instance)
          ) {
            let t = r(this.instance);
            this.scroll = {
              animationId: this.root.animationId,
              phase: e,
              isRoot: t,
              offset: n(this.instance),
              wasRoot: this.scroll ? this.scroll.isRoot : t,
            };
          }
        }
        resetTransform() {
          if (!i) return;
          let e =
              this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout,
            t = this.projectionDelta && !(0, scope.vs)(this.projectionDelta),
            n = this.getTransformTemplate(),
            r = n ? n(this.latestValues, ``) : void 0,
            a = r !== this.prevTransformTemplateValue;
          e &&
            this.instance &&
            (t || (0, scope.da)(this.latestValues) || a) &&
            (i(this.instance, r), (this.shouldResetTransform = !1), this.scheduleRender());
        }
        measure(e = !0) {
          let t = this.measurePageBox(),
            n = this.removeElementScroll(t);
          return (
            e && (n = this.removeTransform(n)),
            (0, scope.Cc)(n),
            {
              animationId: this.root.animationId,
              measuredBox: t,
              layoutBox: n,
              latestValues: {},
              source: this.id,
            }
          );
        }
        measurePageBox() {
          let { visualElement: e } = this.options;
          if (!e) return (0, scope.J)();
          let t = e.measureViewportBox();
          if (!(this.scroll?.wasRoot || this.path.some(scope.Tc))) {
            let { scroll: e } = this.root;
            e && ((0, scope.xa)(t.x, e.offset.x), (0, scope.xa)(t.y, e.offset.y));
          }
          return t;
        }
        removeElementScroll(e) {
          let t = (0, scope.J)();
          if (((0, scope.Zo)(t, e), this.scroll?.wasRoot)) return t;
          for (let n = 0; n < this.path.length; n++) {
            let r = this.path[n],
              { scroll: i, options: a } = r;
            r !== this.root &&
              i &&
              a.layoutScroll &&
              (i.wasRoot && (0, scope.Zo)(t, e),
              (0, scope.xa)(t.x, i.offset.x),
              (0, scope.xa)(t.y, i.offset.y));
          }
          return t;
        }
        applyTransform(e, t = !1, n) {
          let r = n || (0, scope.J)();
          (0, scope.Zo)(r, e);
          for (let e = 0; e < this.path.length; e++) {
            let n = this.path[e];
            (!t &&
              n.options.layoutScroll &&
              n.scroll &&
              n !== n.root &&
              ((0, scope.xa)(r.x, -n.scroll.offset.x), (0, scope.xa)(r.y, -n.scroll.offset.y)),
              (0, scope.da)(n.latestValues) &&
                (0, scope.wa)(r, n.latestValues, n.layout?.layoutBox));
          }
          return (
            (0, scope.da)(this.latestValues) &&
              (0, scope.wa)(r, this.latestValues, this.layout?.layoutBox),
            r
          );
        }
        removeTransform(e) {
          let t = (0, scope.J)();
          (0, scope.Zo)(t, e);
          for (let e = 0; e < this.path.length; e++) {
            let n = this.path[e];
            if (!(0, scope.da)(n.latestValues)) continue;
            let r;
            (n.instance &&
              ((0, scope.ua)(n.latestValues) && n.updateSnapshot(),
              (r = (0, scope.J)()),
              (0, scope.Zo)(r, n.measurePageBox())),
              (0, scope.gs)(t, n.latestValues, n.snapshot?.layoutBox, r));
          }
          return ((0, scope.da)(this.latestValues) && (0, scope.gs)(t, this.latestValues), t);
        }
        setTargetDelta(e) {
          ((this.targetDelta = e),
            this.root.scheduleUpdateProjection(),
            (this.isProjectionDirty = !0));
        }
        setOptions(e) {
          this.options = {
            ...this.options,
            ...e,
            crossfade: e.crossfade === void 0 || e.crossfade,
          };
        }
        clearMeasurements() {
          ((this.scroll = void 0),
            (this.layout = void 0),
            (this.snapshot = void 0),
            (this.prevTransformTemplateValue = void 0),
            (this.targetDelta = void 0),
            (this.target = void 0),
            (this.isLayoutDirty = !1));
        }
        forceRelativeParentToResolveTarget() {
          this.relativeParent &&
            this.relativeParent.resolvedRelativeTargetAt !== scope.B.timestamp &&
            this.relativeParent.resolveTargetDelta(!0);
        }
        resolveTargetDelta(e = !1) {
          let t = this.getLead();
          ((this.isProjectionDirty ||= t.isProjectionDirty),
            (this.isTransformDirty ||= t.isTransformDirty),
            (this.isSharedProjectionDirty ||= t.isSharedProjectionDirty));
          let n = !!this.resumingFrom || this !== t;
          if (!(
            e ||
            (n && this.isSharedProjectionDirty) ||
            this.isProjectionDirty ||
            this.parent?.isProjectionDirty ||
            this.attemptToResolveRelativeTarget ||
            this.root.updateBlockedByResize
          ))
            return;
          let { layout: r, layoutId: i } = this.options;
          if (!this.layout || !(r || i)) return;
          this.resolvedRelativeTargetAt = scope.B.timestamp;
          let a = this.getClosestProjectingParent();
          (!this.targetDelta &&
            !this.relativeTarget &&
            (this.options.layoutAnchor !== !1 && a && a.layout
              ? this.createRelativeTarget(a, this.layout.layoutBox, a.layout.layoutBox)
              : this.removeRelativeTarget()),
            (this.relativeTarget || this.targetDelta) &&
              (this.target ||
                ((this.target = (0, scope.J)()), (this.targetWithTransforms = (0, scope.J)())),
              this.relativeTarget &&
              this.relativeTargetOrigin &&
              this.relativeParent &&
              this.relativeParent.target
                ? (this.forceRelativeParentToResolveTarget(),
                  (0, scope.cs)(
                    this.target,
                    this.relativeTarget,
                    this.relativeParent.target,
                    this.options.layoutAnchor || void 0,
                  ))
                : this.targetDelta
                  ? (this.resumingFrom
                      ? this.applyTransform(this.layout.layoutBox, !1, this.target)
                      : (0, scope.Zo)(this.target, this.layout.layoutBox),
                    (0, scope._a)(this.target, this.targetDelta))
                  : (0, scope.Zo)(this.target, this.layout.layoutBox),
              this.attemptToResolveRelativeTarget &&
                ((this.attemptToResolveRelativeTarget = !1),
                this.options.layoutAnchor !== !1 &&
                a &&
                !!a.resumingFrom == !!this.resumingFrom &&
                !a.options.layoutScroll &&
                a.target &&
                this.animationProgress !== 1
                  ? this.createRelativeTarget(a, this.target, a.target)
                  : (this.relativeParent = this.relativeTarget = void 0)),
              scope.co.value && scope.Ks.calculatedTargetDeltas++));
        }
        getClosestProjectingParent() {
          if (!(
            !this.parent ||
            (0, scope.ua)(this.parent.latestValues) ||
            (0, scope.fa)(this.parent.latestValues)
          ))
            return this.parent.isProjecting()
              ? this.parent
              : this.parent.getClosestProjectingParent();
        }
        isProjecting() {
          return !!(
            (this.relativeTarget || this.targetDelta || this.options.layoutRoot) &&
            this.layout
          );
        }
        createRelativeTarget(e, t, n) {
          ((this.relativeParent = e),
            this.forceRelativeParentToResolveTarget(),
            (this.relativeTarget = (0, scope.J)()),
            (this.relativeTargetOrigin = (0, scope.J)()),
            (0, scope.us)(this.relativeTargetOrigin, t, n, this.options.layoutAnchor || void 0),
            (0, scope.Zo)(this.relativeTarget, this.relativeTargetOrigin));
        }
        removeRelativeTarget() {
          this.relativeParent = this.relativeTarget = void 0;
        }
        calcProjection() {
          let e = this.getLead(),
            t = !!this.resumingFrom || this !== e,
            n = !0;
          if (
            ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n = !1),
            t && (this.isSharedProjectionDirty || this.isTransformDirty) && (n = !1),
            this.resolvedRelativeTargetAt === scope.B.timestamp && (n = !1),
            n)
          )
            return;
          let { layout: r, layoutId: i } = this.options;
          if (
            ((this.isTreeAnimating = !!(
              (this.parent && this.parent.isTreeAnimating) ||
              this.currentAnimation ||
              this.pendingAnimation
            )),
            this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0),
            !this.layout || !(r || i))
          )
            return;
          (0, scope.Zo)(this.layoutCorrected, this.layout.layoutBox);
          let a = this.treeScale.x,
            o = this.treeScale.y;
          ((0, scope.ba)(this.layoutCorrected, this.treeScale, this.path, t),
            e.layout &&
              !e.target &&
              (this.treeScale.x !== 1 || this.treeScale.y !== 1) &&
              ((e.target = e.layout.layoutBox), (e.targetWithTransforms = (0, scope.J)())));
          let { target: s } = e;
          s
            ? (!this.projectionDelta || !this.prevProjectionDelta
                ? this.createProjectionDeltas()
                : ((0, scope.Qo)(this.prevProjectionDelta.x, this.projectionDelta.x),
                  (0, scope.Qo)(this.prevProjectionDelta.y, this.projectionDelta.y)),
              (0, scope.os)(this.projectionDelta, this.layoutCorrected, s, this.latestValues),
              (this.treeScale.x !== a ||
                this.treeScale.y !== o ||
                !(0, scope.ws)(this.projectionDelta.x, this.prevProjectionDelta.x) ||
                !(0, scope.ws)(this.projectionDelta.y, this.prevProjectionDelta.y)) &&
                ((this.hasProjected = !0),
                this.scheduleRender(),
                this.notifyListeners(`projectionUpdate`, s)),
              scope.co.value && scope.Ks.calculatedProjections++)
            : this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        }
        hide() {
          this.isVisible = !1;
        }
        show() {
          this.isVisible = !0;
        }
        scheduleRender(e = !0) {
          if ((this.options.visualElement?.scheduleRender(), e)) {
            let e = this.getStack();
            e && e.scheduleRender();
          }
          this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
        }
        createProjectionDeltas() {
          ((this.prevProjectionDelta = (0, scope.po)()),
            (this.projectionDelta = (0, scope.po)()),
            (this.projectionDeltaWithTransform = (0, scope.po)()));
        }
        setAnimationOrigin(e, t = !1, n) {
          let r = this.snapshot,
            i = r ? r.latestValues : {},
            a = { ...this.latestValues },
            o = (0, scope.po)();
          ((!this.relativeParent || !this.relativeParent.options.layoutRoot) &&
            (this.relativeTarget = this.relativeTargetOrigin = void 0),
            (this.attemptToResolveRelativeTarget = !t));
          let s = (0, scope.J)(),
            c = (r ? r.source : void 0) !== (this.layout ? this.layout.source : void 0),
            l = this.getStack(),
            u = !l || l.members.length <= 1,
            d = !(!c || u || this.options.crossfade !== !0 || this.path.some(scope.vc));
          this.animationProgress = 0;
          let f,
            p = n?.interpolateProjection(e);
          ((this.mixTargetDelta = (t) => {
            let n = t / 1e3,
              r = p?.(n);
            (r
              ? ((o.x.translate = r.x),
                (o.x.scale = (0, scope.W)(e.x.scale, 1, n)),
                (o.x.origin = e.x.origin),
                (o.x.originPoint = e.x.originPoint),
                (o.y.translate = r.y),
                (o.y.scale = (0, scope.W)(e.y.scale, 1, n)),
                (o.y.origin = e.y.origin),
                (o.y.originPoint = e.y.originPoint))
              : ((0, scope.hc)(o.x, e.x, n), (0, scope.hc)(o.y, e.y, n)),
              this.setTargetDelta(o),
              this.relativeTarget &&
                this.relativeTargetOrigin &&
                this.layout &&
                this.relativeParent &&
                this.relativeParent.layout &&
                ((0, scope.us)(
                  s,
                  this.layout.layoutBox,
                  this.relativeParent.layout.layoutBox,
                  this.options.layoutAnchor || void 0,
                ),
                (0, scope._c)(this.relativeTarget, this.relativeTargetOrigin, s, n),
                f && (0, scope.bs)(this.relativeTarget, f) && (this.isProjectionDirty = !1),
                (f ||= (0, scope.J)()),
                (0, scope.Zo)(f, this.relativeTarget)),
              c && ((this.animationValues = a), (0, scope.Ms)(a, i, this.latestValues, n, d, u)),
              r &&
                r.rotate !== void 0 &&
                ((this.animationValues ||= a), (this.animationValues.pathRotation = r.rotate)),
              this.root.scheduleUpdateProjection(),
              this.scheduleRender(),
              (this.animationProgress = n));
          }),
            this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0));
        }
        startAnimation(e) {
          (this.notifyListeners(`animationStart`),
            this.currentAnimation?.stop(),
            this.resumingFrom?.currentAnimation?.stop(),
            (this.pendingAnimation &&= ((0, scope.Xt)(this.pendingAnimation), void 0)),
            (this.pendingAnimation = scope.G.update(() => {
              ((scope.Gs.hasAnimatedSinceResize = !0),
                (this.motionValue ||= (0, scope.ai)(0)),
                this.motionValue.jump(0, !1),
                (this.currentAnimation = (0, scope.Ls)(this.motionValue, [0, 1e3], {
                  ...e,
                  velocity: 0,
                  isSync: !0,
                  onUpdate: (t) => {
                    (this.mixTargetDelta(t), e.onUpdate && e.onUpdate(t));
                  },
                  onComplete: () => {
                    (e.onComplete && e.onComplete(), this.completeAnimation());
                  },
                })),
                (0, scope.Mn)(this.currentAnimation, this),
                this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation),
                (this.pendingAnimation = void 0));
            })));
        }
        completeAnimation() {
          this.resumingFrom &&
            ((this.resumingFrom.currentAnimation = void 0),
            (this.resumingFrom.preserveOpacity = void 0));
          let e = this.getStack();
          (e && e.exitAnimationComplete(),
            (this.resumingFrom = this.currentAnimation = this.animationValues = void 0),
            this.notifyListeners(`animationComplete`));
        }
        finishAnimation() {
          (this.currentAnimation &&
            (this.mixTargetDelta && this.mixTargetDelta(scope.Js), this.currentAnimation.stop()),
            this.completeAnimation());
        }
        applyTransformsToTarget() {
          let e = this.getLead(),
            { targetWithTransforms: t, layout: n, latestValues: r } = e,
            { target: i } = e;
          if (t && i && n) {
            if (
              this !== e &&
              this.layout &&
              n &&
              (0, scope.wc)(this.options.animationType, this.layout.layoutBox, n.layoutBox)
            ) {
              i = this.target || (0, scope.J)();
              let t = (0, scope.rs)(this.layout.layoutBox.x);
              ((i.x.min = e.target.x.min), (i.x.max = i.x.min + t));
              let n = (0, scope.rs)(this.layout.layoutBox.y);
              ((i.y.min = e.target.y.min), (i.y.max = i.y.min + n));
            }
            ((0, scope.Zo)(t, i),
              (0, scope.wa)(t, r),
              (0, scope.os)(this.projectionDeltaWithTransform, this.layoutCorrected, t, r));
          }
        }
        registerSharedNode(e, t) {
          (this.sharedNodes.has(e) || this.sharedNodes.set(e, new scope.Us()),
            this.sharedNodes.get(e).add(t));
          let n = t.options.initialPromotionConfig;
          t.promote({
            transition: n ? n.transition : void 0,
            preserveFollowOpacity:
              n && n.shouldPreserveFollowOpacity ? n.shouldPreserveFollowOpacity(t) : void 0,
          });
        }
        isLead() {
          let e = this.getStack();
          return !e || e.lead === this;
        }
        getLead() {
          let { layoutId: e } = this.options;
          return (e && this.getStack()?.lead) || this;
        }
        getPrevLead() {
          let { layoutId: e } = this.options;
          return e ? this.getStack()?.prevLead : void 0;
        }
        getStack() {
          let { layoutId: e } = this.options;
          if (e) return this.root.sharedNodes.get(e);
        }
        promote({ needsReset: e, transition: t, preserveFollowOpacity: n } = {}) {
          let r = this.getStack();
          (r && r.promote(this, n),
            e && ((this.projectionDelta = void 0), (this.needsReset = !0)),
            t && this.setOptions({ transition: t }));
        }
        relegate() {
          let e = this.getStack();
          return e ? e.relegate(this) : !1;
        }
        resetSkewAndRotation() {
          let { visualElement: e } = this.options;
          if (!e) return;
          let t = !1,
            { latestValues: n } = e;
          if (
            ((n.z || n.rotate || n.rotateX || n.rotateY || n.rotateZ || n.skewX || n.skewY) &&
              (t = !0),
            !t)
          )
            return;
          let r = {};
          n.z && (0, scope.Xs)(`z`, e, r, this.animationValues);
          for (let t = 0; t < scope.qs.length; t++)
            ((0, scope.Xs)(`rotate${scope.qs[t]}`, e, r, this.animationValues),
              (0, scope.Xs)(`skew${scope.qs[t]}`, e, r, this.animationValues));
          e.render();
          for (let t in r)
            (e.setStaticValue(t, r[t]), this.animationValues && (this.animationValues[t] = r[t]));
          e.scheduleRender();
        }
        applyProjectionStyles(e, t) {
          if (!this.instance || this.isSVG) return;
          if (!this.isVisible) {
            e.visibility = `hidden`;
            return;
          }
          let n = this.getTransformTemplate();
          if (this.needsReset) {
            ((this.needsReset = !1),
              (e.visibility = ``),
              (e.opacity = ``),
              (e.pointerEvents = (0, scope.Hs)(t?.pointerEvents) || ``),
              (e.transform = n ? n(this.latestValues, ``) : `none`));
            return;
          }
          let r = this.getLead();
          if (!this.projectionDelta || !this.layout || !r.target) {
            (this.options.layoutId &&
              ((e.opacity = this.latestValues.opacity === void 0 ? 1 : this.latestValues.opacity),
              (e.pointerEvents = (0, scope.Hs)(t?.pointerEvents) || ``)),
              this.hasProjected &&
                !(0, scope.da)(this.latestValues) &&
                ((e.transform = n ? n({}, ``) : `none`), (this.hasProjected = !1)));
            return;
          }
          e.visibility = ``;
          let i = r.animationValues || r.latestValues;
          this.applyTransformsToTarget();
          let a = (0, scope.ks)(this.projectionDeltaWithTransform, this.treeScale, i);
          (n && (a = n(i, a)), (e.transform = a));
          let { x: o, y: s } = this.projectionDelta;
          ((e.transformOrigin = `${o.origin * 100}% ${s.origin * 100}% 0`),
            (e.opacity = r.animationValues
              ? r === this
                ? (i.opacity ?? this.latestValues.opacity ?? 1)
                : this.preserveOpacity
                  ? this.latestValues.opacity
                  : i.opacityExit
              : r === this
                ? i.opacity === void 0
                  ? ``
                  : i.opacity
                : i.opacityExit === void 0
                  ? 0
                  : i.opacityExit));
          for (let t in scope.Fo) {
            if (i[t] === void 0) continue;
            let { correct: n, applyTo: o, isCSSVariable: s } = scope.Fo[t],
              c = a === `none` ? i[t] : n(i[t], r);
            if (o) {
              let t = o.length;
              for (let n = 0; n < t; n++) e[o[n]] = c;
            } else s ? (this.options.visualElement.renderState.vars[t] = c) : (e[t] = c);
          }
          this.options.layoutId &&
            (e.pointerEvents = r === this ? (0, scope.Hs)(t?.pointerEvents) || `` : `none`);
        }
        clearSnapshot() {
          this.resumeFrom = this.snapshot = void 0;
        }
        resetTree() {
          (this.root.nodes.forEach((e) => e.currentAnimation?.stop()),
            this.root.nodes.forEach(scope.ic),
            this.root.sharedNodes.clear());
        }
      };
    };
    scope.$s = function $s(e) {
      e.updateLayout();
    };
    scope.ec = function ec(e) {
      let t = e.resumeFrom?.snapshot || e.snapshot;
      if (e.isLead() && e.layout && t && e.hasListeners(`didUpdate`)) {
        let { layoutBox: n, measuredBox: r } = e.layout,
          { animationType: i } = e.options,
          a = t.source !== e.layout.source;
        if (i === `size`)
          (0, scope.Ts)((e) => {
            let r = a ? t.measuredBox[e] : t.layoutBox[e],
              i = (0, scope.rs)(r);
            ((r.min = n[e].min), (r.max = r.min + i));
          });
        else if (i === `x` || i === `y`) {
          let e = i === `x` ? `y` : `x`;
          (0, scope.Xo)(a ? t.measuredBox[e] : t.layoutBox[e], n[e]);
        } else
          (0, scope.wc)(i, t.layoutBox, n) &&
            (0, scope.Ts)((r) => {
              let i = a ? t.measuredBox[r] : t.layoutBox[r],
                o = (0, scope.rs)(n[r]);
              ((i.max = i.min + o),
                e.relativeTarget &&
                  !e.currentAnimation &&
                  ((e.isProjectionDirty = !0),
                  (e.relativeTarget[r].max = e.relativeTarget[r].min + o)));
            });
        let o = (0, scope.po)();
        (0, scope.os)(o, n, t.layoutBox);
        let s = (0, scope.po)();
        a
          ? (0, scope.os)(s, e.applyTransform(r, !0), t.measuredBox)
          : (0, scope.os)(s, n, t.layoutBox);
        let c = !(0, scope.vs)(o),
          l = !1;
        if (!e.resumeFrom) {
          let r = e.getClosestProjectingParent();
          if (r && !r.resumeFrom) {
            let { snapshot: i, layout: a } = r;
            if (i && a) {
              let o = e.options.layoutAnchor || void 0,
                s = (0, scope.J)();
              (0, scope.us)(s, t.layoutBox, i.layoutBox, o);
              let c = (0, scope.J)();
              ((0, scope.us)(c, n, a.layoutBox, o),
                (0, scope.Ss)(s, c) || (l = !0),
                r.options.layoutRoot &&
                  ((e.relativeTarget = c), (e.relativeTargetOrigin = s), (e.relativeParent = r)));
            }
          }
        }
        e.notifyListeners(`didUpdate`, {
          layout: n,
          snapshot: t,
          delta: s,
          layoutDelta: o,
          hasLayoutChanged: c,
          hasRelativeLayoutChanged: l,
        });
      } else if (e.isLead()) {
        let { onExitComplete: t } = e.options;
        t && t();
      }
      e.options.transition = void 0;
    };
    scope.tc = function tc(e) {
      (scope.co.value && scope.Ks.nodes++,
        e.parent &&
          (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty),
          (e.isSharedProjectionDirty ||= !!(
            e.isProjectionDirty ||
            e.parent.isProjectionDirty ||
            e.parent.isSharedProjectionDirty
          )),
          (e.isTransformDirty ||= e.parent.isTransformDirty)));
    };
    scope.nc = function nc(e) {
      e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
    };
    scope.rc = function rc(e) {
      e.clearSnapshot();
    };
    scope.ic = function ic(e) {
      e.clearMeasurements();
    };
    scope.ac = function ac(e) {
      ((e.isLayoutDirty = !0), e.updateLayout());
    };
    scope.oc = function oc(e) {
      e.isLayoutDirty = !1;
    };
    scope.sc = function sc(e) {
      e.isAnimationBlocked &&
        e.layout &&
        !e.isLayoutDirty &&
        ((e.snapshot = e.layout), (e.isLayoutDirty = !0));
    };
    scope.cc = function cc(e) {
      e.relativeTarget &&
        e.relativeParent?.isLayoutDirty &&
        (e.currentAnimation
          ? (e.isLayoutDirty = !0)
          : ((e.targetDelta = void 0), e.removeRelativeTarget()));
    };
    scope.lc = function lc(e) {
      let { visualElement: t } = e.options;
      (t && t.getProps().onBeforeLayoutMeasure && t.notify(`BeforeLayoutMeasure`),
        e.resetTransform());
    };
    scope.uc = function uc(e) {
      (e.finishAnimation(),
        (e.targetDelta = e.relativeTarget = e.target = void 0),
        (e.isProjectionDirty = !0));
    };
    scope.dc = function dc(e) {
      e.resolveTargetDelta();
    };
    scope.fc = function fc(e) {
      e.calcProjection();
    };
    scope.pc = function pc(e) {
      e.resetSkewAndRotation();
    };
    scope.mc = function mc(e) {
      e.removeLeadSnapshot();
    };
    scope.hc = function hc(e, t, n) {
      ((e.translate = (0, scope.W)(t.translate, 0, n)),
        (e.scale = (0, scope.W)(t.scale, 1, n)),
        (e.origin = t.origin),
        (e.originPoint = t.originPoint));
    };
    scope.gc = function gc(e, t, n, r) {
      ((e.min = (0, scope.W)(t.min, n.min, r)), (e.max = (0, scope.W)(t.max, n.max, r)));
    };
    scope._c = function _c(e, t, n, r) {
      ((0, scope.gc)(e.x, t.x, n.x, r), (0, scope.gc)(e.y, t.y, n.y, r));
    };
    scope.vc = function vc(e) {
      return e.animationValues && e.animationValues.opacityExit !== void 0;
    };
    scope.Sc = function Sc(e) {
      ((e.min = (0, scope.xc)(e.min)), (e.max = (0, scope.xc)(e.max)));
    };
    scope.Cc = function Cc(e) {
      ((0, scope.Sc)(e.x), (0, scope.Sc)(e.y));
    };
    scope.wc = function wc(e, t, n) {
      return (
        e === `position` ||
        (e === `preserve-aspect` && !(0, scope.is)((0, scope.Cs)(t), (0, scope.Cs)(n), 0.2))
      );
    };
    scope.Tc = function Tc(e) {
      return e !== e.root && e.scroll?.wasRoot;
    };
    scope.Ac = function Ac(e, t) {
      if (typeof e == `function`) return e(t);
      e != null && (e.current = t);
    };
    scope.jc = function jc(...e) {
      return (t) => {
        let n = !1,
          r = e.map((e) => {
            let r = (0, scope.Ac)(e, t);
            return (!n && typeof r == `function` && (n = !0), r);
          });
        if (n)
          return () => {
            for (let t = 0; t < r.length; t++) {
              let n = r[t];
              typeof n == `function` ? n() : (0, scope.Ac)(e[t], null);
            }
          };
      };
    };
    scope.Mc = function Mc(...e) {
      return scope.k.useCallback((0, scope.jc)(...e), e);
    };
    scope.Pc = function Pc({ children: e, isPresent: t, anchorX: n, anchorY: r, root: i, pop: a }) {
      let o = (0, scope.k.useId)(),
        s = (0, scope.k.useRef)(null),
        c = (0, scope.k.useRef)({
          width: 0,
          height: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          direction: `ltr`,
        }),
        { nonce: l } = (0, scope.k.useContext)(scope.kc),
        u = (0, scope.Mc)(s, a === !1 ? void 0 : (e.props?.ref ?? e?.ref));
      return (
        (0, scope.k.useInsertionEffect)(() => {
          let {
            width: e,
            height: u,
            top: d,
            left: f,
            right: p,
            bottom: m,
            direction: h,
          } = c.current;
          if (t || a === !1 || !s.current || !e || !u) return;
          let g = h === `rtl`,
            _ =
              n === `left` ? (g ? `right: ${p}` : `left: ${f}`) : g ? `left: ${f}` : `right: ${p}`,
            v = r === `bottom` ? `bottom: ${m}` : `top: ${d}`;
          s.current.dataset.motionPopId = o;
          let y = document.createElement(`style`);
          l && (y.nonce = l);
          let b = i ?? document.head;
          return (
            b.appendChild(y),
            y.sheet &&
              y.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${u}px !important;
            ${_}px !important;
            ${v}px !important;
          }
        `),
            () => {
              (s.current?.removeAttribute(`data-motion-pop-id`), b.contains(y) && b.removeChild(y));
            }
          );
        }, [t]),
        (0, scope.O.jsx)(scope.Nc, {
          isPresent: t,
          childRef: s,
          sizeRef: c,
          pop: a,
          children: a === !1 ? e : scope.k.cloneElement(e, { ref: u }),
        })
      );
    };
    scope.Ic = function Ic() {
      return new Map();
    };
    scope.Lc = function Lc(e = !0) {
      let t = (0, scope.k.useContext)(scope.N);
      if (t === null) return [!0, null];
      let { isPresent: n, onExitComplete: r, register: i } = t,
        a = (0, scope.k.useId)();
      (0, scope.k.useEffect)(() => {
        if (e) return i(a);
      }, [e]);
      let o = (0, scope.k.useCallback)(() => e && r && r(a), [a, r, e]);
      return !n && r ? [!1, o] : [!0];
    };
    scope.zc = function zc(e) {
      let t = [];
      return (
        scope.k.Children.forEach(e, (e) => {
          (0, scope.k.isValidElement)(e) && t.push(e);
        }),
        t
      );
    };
    scope.Wc = function Wc() {
      if (scope.Uc) return;
      let e = {};
      for (let t in scope.Hc) e[t] = { isEnabled: (e) => scope.Hc[t].some((t) => !!e[t]) };
      ((0, scope.ko)(e), (scope.Uc = !0));
    };
    scope.Gc = function Gc() {
      return ((0, scope.Wc)(), (0, scope.Ao)());
    };
    scope.Kc = function Kc(e) {
      let t = (0, scope.Gc)();
      for (let n in e) t[n] = { ...t[n], ...e[n] };
      (0, scope.ko)(t);
    };
    scope.Jc = function Jc(e, t) {
      if ((0, scope.bo)(e)) {
        let { initial: t, animate: n } = e;
        return {
          initial: t === !1 || (0, scope._o)(t) ? t : void 0,
          animate: (0, scope._o)(n) ? n : void 0,
        };
      }
      return e.inherit === !1 ? {} : t;
    };
    scope.Yc = function Yc(e) {
      let { initial: t, animate: n } = (0, scope.Jc)(e, (0, scope.k.useContext)(scope.qc));
      return (0, scope.k.useMemo)(
        () => ({ initial: t, animate: n }),
        [(0, scope.Xc)(t), (0, scope.Xc)(n)],
      );
    };
    scope.Xc = function Xc(e) {
      return Array.isArray(e) ? e.join(` `) : e;
    };
    scope.Qc = function Qc(e, t, n) {
      for (let r in t) !(0, scope.q)(t[r]) && !(0, scope.Io)(r, n) && (e[r] = t[r]);
    };
    scope.$c = function $c({ transformTemplate: e }, t) {
      return (0, scope.k.useMemo)(() => {
        let n = (0, scope.Zc)();
        return ((0, scope.ea)(n, t, e), Object.assign({}, n.vars, n.style));
      }, [t]);
    };
    scope.el = function el(e, t) {
      let n = e.style || {},
        r = {};
      return ((0, scope.Qc)(r, n, e), Object.assign(r, (0, scope.$c)(e, t)), r);
    };
    scope.tl = function tl(e, t) {
      let n = {},
        r = (0, scope.el)(e, t);
      return (
        e.drag &&
          e.dragListener !== !1 &&
          ((n.draggable = !1),
          (r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = `none`),
          (r.touchAction = e.drag === !0 ? `none` : `pan-${e.drag === `x` ? `y` : `x`}`)),
        e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0),
        (n.style = r),
        n
      );
    };
    scope.rl = function rl(e, t, n, r) {
      let i = (0, scope.k.useMemo)(() => {
        let n = (0, scope.nl)();
        return (
          (0, scope.aa)(n, t, (0, scope.Vo)(r), e.transformTemplate, e.style),
          { ...n.attrs, style: { ...n.style } }
        );
      }, [t]);
      if (e.style) {
        let t = {};
        ((0, scope.Qc)(t, e.style, e), (i.style = { ...t, ...i.style }));
      }
      return i;
    };
    scope.al = function al(e) {
      return (
        e.startsWith(`while`) ||
        (e.startsWith(`drag`) && e !== `draggable`) ||
        e.startsWith(`layout`) ||
        e.startsWith(`onTap`) ||
        e.startsWith(`onPan`) ||
        e.startsWith(`onLayout`) ||
        scope.il.has(e)
      );
    };
    scope.ol = function ol(e, t) {
      return e.startsWith(`on`) ? !(0, scope.al)(e) : (t?.(e) ?? !(0, scope.al)(e));
    };
    scope.sl = function sl(e, t, n, r) {
      let i = {};
      for (let a in e)
        (a !== `values` || typeof e.values != `object`) &&
          ((0, scope.q)(e[a]) ||
            (((0, scope.ol)(a, r) ||
              (n === !0 && (0, scope.al)(a)) ||
              (!t && !(0, scope.al)(a)) ||
              (e.draggable && a.startsWith(`onDrag`))) &&
              (i[a] = e[a])));
      return i;
    };
    scope.ll = function ll(e) {
      return typeof e != `string` || e.includes(`-`)
        ? !1
        : !!(scope.cl.indexOf(e) > -1 || /[A-Z]/u.test(e));
    };
    scope.ul = function ul(e, t, n, { latestValues: r }, i, a = !1, o, s) {
      let c = ((o ?? (0, scope.ll)(e)) ? scope.rl : scope.tl)(t, r, i, e),
        l = (0, scope.sl)(t, typeof e == `string`, a, s),
        u = e === scope.k.Fragment ? {} : { ...l, ...c, ref: n },
        { children: d } = t,
        f = (0, scope.k.useMemo)(() => ((0, scope.q)(d) ? d.get() : d), [d]);
      return (0, scope.k.createElement)(e, { ...u, children: f });
    };
    scope.dl = function dl({ scrapeMotionValuesFromProps: e, createRenderState: t }, n, r, i) {
      return { latestValues: (0, scope.fl)(n, r, i, e), renderState: t() };
    };
    scope.fl = function fl(e, t, n, r) {
      let i = {},
        a = r(e, {});
      for (let e in a) i[e] = (0, scope.Hs)(a[e]);
      let { initial: o, animate: s } = e,
        c = (0, scope.bo)(e),
        l = (0, scope.xo)(e);
      t &&
        l &&
        !c &&
        e.inherit !== !1 &&
        (o === void 0 && (o = t.initial), s === void 0 && (s = t.animate));
      let u = n ? n.initial === !1 : !1;
      u ||= o === !1;
      let d = u ? s : o;
      if (d && typeof d != `boolean` && !(0, scope.go)(d)) {
        let t = Array.isArray(d) ? d : [d];
        for (let n = 0; n < t.length; n++) {
          let r = (0, scope.bi)(e, t[n]);
          if (r) {
            let { transitionEnd: e, transition: t, ...n } = r;
            for (let e in n) {
              let t = n[e];
              if (Array.isArray(t)) {
                let e = u ? t.length - 1 : 0;
                t = t[e];
              }
              t !== null && (i[e] = t);
            }
            for (let t in e) i[t] = e[t];
          }
        }
      }
      return i;
    };
    scope._l = function _l(e, t, n) {
      let r = (0, scope.k.useRef)(n);
      (0, scope.k.useInsertionEffect)(() => {
        r.current = n;
      });
      let i = (0, scope.k.useRef)(null);
      return (0, scope.k.useCallback)(
        (n) => {
          (n && e.onMount?.(n), t && (n ? t.mount(n) : t.unmount()));
          let a = r.current;
          if (typeof a == `function`) {
            if (n) {
              let e = a(n);
              typeof e == `function` && (i.current = e);
            } else i.current ? (i.current(), (i.current = null)) : a(n);
          } else a && (a.current = n);
        },
        [t],
      );
    };
    scope.yl = function yl(e) {
      return e && typeof e == `object` && Object.prototype.hasOwnProperty.call(e, `current`);
    };
    scope.bl = function bl(e, t, n, r, i, a) {
      let { visualElement: o } = (0, scope.k.useContext)(scope.qc),
        s = (0, scope.k.useContext)(scope.Vc),
        c = (0, scope.k.useContext)(scope.N),
        l = (0, scope.k.useContext)(scope.kc),
        u = l.reducedMotion,
        d = l.skipAnimations,
        f = (0, scope.k.useRef)(null),
        p = (0, scope.k.useRef)(!1);
      ((r ||= s.renderer),
        !f.current &&
          r &&
          ((f.current = r(e, {
            visualState: t,
            parent: o,
            props: n,
            presenceContext: c,
            blockInitialAnimation: c ? c.initial === !1 : !1,
            reducedMotionConfig: u,
            skipAnimations: d,
            isSVG: a,
          })),
          p.current && f.current && (f.current.manuallyAnimateOnMount = !0)));
      let m = f.current,
        h = (0, scope.k.useContext)(scope.vl);
      m &&
        !m.projection &&
        i &&
        (m.type === `html` || m.type === `svg`) &&
        (0, scope.xl)(f.current, n, i, h);
      let g = (0, scope.k.useRef)(!1);
      (0, scope.k.useInsertionEffect)(() => {
        m && g.current && m.update(n, c);
      });
      let _ = n[scope.ji],
        v = (0, scope.k.useRef)(
          !!_ &&
            typeof window < `u` &&
            !window.MotionHandoffIsComplete?.(_) &&
            window.MotionHasOptimisedAnimation?.(_),
        );
      return (
        (0, scope.M)(() => {
          p.current && m && (m.animationState?.animateChanges(), (m.enteringChildren = void 0));
        }, []),
        (0, scope.M)(() => {
          ((p.current = !0),
            m &&
              ((g.current = !0),
              (window.MotionIsMounted = !0),
              m.updateFeatures(),
              m.scheduleRenderMicrotask(),
              v.current && m.animationState && m.animationState.animateChanges()));
        }),
        (0, scope.k.useEffect)(() => {
          m &&
            (!v.current && m.animationState && m.animationState.animateChanges(),
            (v.current &&=
              (queueMicrotask(() => {
                window.MotionHandoffMarkAsComplete?.(_);
              }),
              !1)),
            (m.enteringChildren = void 0));
        }),
        m
      );
    };
    scope.xl = function xl(e, t, n, r) {
      let {
        layoutId: i,
        layout: a,
        drag: o,
        dragConstraints: s,
        layoutScroll: c,
        layoutRoot: l,
        layoutAnchor: u,
        layoutCrossfade: d,
      } = t;
      ((e.projection = new n(
        e.latestValues,
        t[`data-framer-portal-id`] ? void 0 : (0, scope.Sl)(e.parent),
      )),
        e.projection.setOptions({
          layoutId: i,
          layout: a,
          alwaysMeasureLayout: !!o || (s && (0, scope.yl)(s)),
          visualElement: e,
          animationType: typeof a == `string` ? a : `both`,
          initialPromotionConfig: r,
          crossfade: d,
          layoutScroll: c,
          layoutRoot: l,
          layoutAnchor: u,
        }));
    };
    scope.Sl = function Sl(e) {
      if (e) return e.options.allowProjection === !1 ? (0, scope.Sl)(e.parent) : e.projection;
    };
    scope.Cl = function Cl(e, { forwardMotionProps: t = !1, type: n } = {}, r, i) {
      r && (0, scope.Kc)(r);
      let a = n ? n === `svg` : (0, scope.ll)(e),
        o = a ? scope.hl : scope.ml;
      function s(n, s) {
        let c,
          l = { ...(0, scope.k.useContext)(scope.kc), ...n, layoutId: (0, scope.wl)(n) },
          { isStatic: u, isValidProp: d } = l,
          f = (0, scope.Yc)(n),
          p = o(n, u);
        if (!u && typeof window < `u`) {
          (0, scope.Tl)(l, r);
          let t = (0, scope.El)(l);
          ((c = t.MeasureLayout),
            (f.visualElement = (0, scope.bl)(e, p, l, i, t.ProjectionNode, a)));
        }
        return (0, scope.O.jsxs)(scope.qc.Provider, {
          value: f,
          children: [
            c && f.visualElement
              ? (0, scope.O.jsx)(c, { visualElement: f.visualElement, ...l })
              : null,
            (0, scope.ul)(e, n, (0, scope._l)(p, f.visualElement, s), p, u, t, a, d),
          ],
        });
      }
      s.displayName = `motion.${typeof e == `string` ? e : `create(${e.displayName ?? e.name ?? ``})`}`;
      let c = (0, scope.k.forwardRef)(s);
      return ((c[scope.gl] = e), c);
    };
    scope.wl = function wl({ layoutId: e }) {
      let t = (0, scope.k.useContext)(scope.A).id;
      return t && e !== void 0 ? t + `-` + e : e;
    };
    scope.Tl = function Tl(e, t) {
      (0, scope.k.useContext)(scope.Vc).strict;
    };
    scope.El = function El(e) {
      let { drag: t, layout: n } = (0, scope.Gc)();
      if (!t && !n) return {};
      let r = { ...t, ...n };
      return {
        MeasureLayout: t?.isEnabled(e) || n?.isEnabled(e) ? r.MeasureLayout : void 0,
        ProjectionNode: r.ProjectionNode,
      };
    };
    scope.Dl = function Dl(e, t) {
      if (typeof Proxy > `u`) return scope.Cl;
      let n = new Map(),
        r = (n, r) => (0, scope.Cl)(n, r, e, t);
      return new Proxy((e, t) => r(e, t), {
        get: (i, a) =>
          a === `create` ? r : (n.has(a) || n.set(a, (0, scope.Cl)(a, void 0, e, t)), n.get(a)),
      });
    };
    scope.Ml = function Ml(e) {
      return { point: { x: e.pageX, y: e.pageY } };
    };
    scope.Pl = function Pl(e, t, n, r) {
      return (0, scope.Rs)(e, t, (0, scope.Nl)(n), r);
    };
    scope.Ll = function Ll(e, t) {
      let n = (0, scope.Il)(e.x, t.x),
        r = (0, scope.Il)(e.y, t.y);
      return Math.sqrt(n ** 2 + r ** 2);
    };
    scope.Bl = function Bl(e, t) {
      return t ? { point: t(e.point) } : e;
    };
    scope.Vl = function Vl(e, t) {
      return { x: e.x - t.x, y: e.y - t.y };
    };
    scope.Hl = function Hl({ point: e }, t) {
      return {
        point: e,
        delta: (0, scope.Vl)(e, (0, scope.Wl)(t)),
        offset: (0, scope.Vl)(e, (0, scope.Ul)(t)),
        velocity: (0, scope.Gl)(t, 0.1),
      };
    };
    scope.Ul = function Ul(e) {
      return e[0];
    };
    scope.Wl = function Wl(e) {
      return e[e.length - 1];
    };
    scope.Gl = function Gl(e, t) {
      if (e.length < 2) return { x: 0, y: 0 };
      let n = e.length - 1,
        r = null,
        i = (0, scope.Wl)(e);
      for (; n >= 0 && ((r = e[n]), !(i.timestamp - r.timestamp > (0, scope.R)(t)));) n--;
      if (!r) return { x: 0, y: 0 };
      r === e[0] && e.length > 2 && i.timestamp - r.timestamp > (0, scope.R)(t) * 2 && (r = e[1]);
      let a = (0, scope.z)(i.timestamp - r.timestamp);
      if (a === 0) return { x: 0, y: 0 };
      let o = { x: (i.x - r.x) / a, y: (i.y - r.y) / a };
      return (o.x === 1 / 0 && (o.x = 0), o.y === 1 / 0 && (o.y = 0), o);
    };
    scope.Kl = function Kl(e, { min: t, max: n }, r) {
      return (
        t !== void 0 && e < t
          ? (e = r ? (0, scope.W)(t, e, r.min) : Math.max(e, t))
          : n !== void 0 && e > n && (e = r ? (0, scope.W)(n, e, r.max) : Math.min(e, n)),
        e
      );
    };
    scope.ql = function ql(e, t, n) {
      return {
        min: t === void 0 ? void 0 : e.min + t,
        max: n === void 0 ? void 0 : e.max + n - (e.max - e.min),
      };
    };
    scope.Jl = function Jl(e, { top: t, left: n, bottom: r, right: i }) {
      return { x: (0, scope.ql)(e.x, n, i), y: (0, scope.ql)(e.y, t, r) };
    };
    scope.Yl = function Yl(e, t) {
      let n = t.min - e.min,
        r = t.max - e.max;
      return (t.max - t.min < e.max - e.min && ([n, r] = [r, n]), { min: n, max: r });
    };
    scope.Xl = function Xl(e, t) {
      return { x: (0, scope.Yl)(e.x, t.x), y: (0, scope.Yl)(e.y, t.y) };
    };
    scope.Zl = function Zl(e, t) {
      let n = 0.5,
        r = (0, scope.rs)(e),
        i = (0, scope.rs)(t);
      return (
        i > r
          ? (n = (0, scope.ce)(t.min, t.max - r, e.min))
          : r > i && (n = (0, scope.ce)(e.min, e.max - i, t.min)),
        (0, scope.re)(0, 1, n)
      );
    };
    scope.Ql = function Ql(e, t) {
      let n = {};
      return (
        t.min !== void 0 && (n.min = t.min - e.min),
        t.max !== void 0 && (n.max = t.max - e.min),
        n
      );
    };
    scope.eu = function eu(e = scope.$l) {
      return (
        e === !1 ? (e = 0) : e === !0 && (e = scope.$l),
        { x: (0, scope.tu)(e, `left`, `right`), y: (0, scope.tu)(e, `top`, `bottom`) }
      );
    };
    scope.tu = function tu(e, t, n) {
      return { min: (0, scope.nu)(e, t), max: (0, scope.nu)(e, n) };
    };
    scope.nu = function nu(e, t) {
      return typeof e == `number` ? e : e[t] || 0;
    };
    scope.au = function au(e) {
      let t = !0;
      return () => {
        t ? (t = !1) : e();
      };
    };
    scope.ou = function ou(e, t, n) {
      let r = (0, scope.so)(e, (0, scope.au)(n)),
        i = (0, scope.so)(t, (0, scope.au)(n));
      return () => {
        (r(), i());
      };
    };
    scope.su = function su(e, t, n) {
      return (t === !0 || t === e) && (n === null || n === e);
    };
    scope.cu = function cu(e, t = 10) {
      let n = null;
      return (Math.abs(e.y) > t ? (n = `y`) : Math.abs(e.x) > t && (n = `x`), n);
    };
    scope.mu = function mu(e) {
      let [t, n] = (0, scope.Lc)(),
        r = (0, scope.k.useContext)(scope.A);
      return (0, scope.O.jsx)(scope.pu, {
        ...e,
        layoutGroup: r,
        switchLayoutGroup: (0, scope.k.useContext)(scope.vl),
        isPresent: t,
        safeToRemove: n,
      });
    };
    scope.gu = function gu(e, t, n) {
      let { props: r } = e;
      e.animationState && r.whileHover && e.animationState.setActive(`whileHover`, n === `Start`);
      let i = r[`onHover` + n];
      i && scope.G.postRender(() => i(t, (0, scope.Ml)(t)));
    };
    scope.yu = function yu(e, t, n) {
      let { props: r } = e;
      if (e.current instanceof HTMLButtonElement && e.current.disabled) return;
      e.animationState && r.whileTap && e.animationState.setActive(`whileTap`, n === `Start`);
      let i = r[`onTap` + (n === `End` ? `` : n)];
      i && scope.G.postRender(() => i(t, (0, scope.Ml)(t)));
    };
    scope.Tu = function Tu({ root: e, ...t }) {
      let n = e || document;
      scope.Su.has(n) || scope.Su.set(n, {});
      let r = scope.Su.get(n),
        i = JSON.stringify(t);
      return (r[i] || (r[i] = new IntersectionObserver(scope.wu, { root: e, ...t })), r[i]);
    };
    scope.Eu = function Eu(e, t, n) {
      let r = (0, scope.Tu)(t);
      return (
        scope.xu.set(e, n),
        r.observe(e),
        () => {
          (scope.xu.delete(e), r.unobserve(e));
        }
      );
    };
    scope.ku = function ku({ viewport: e = {} }, { viewport: t = {} } = {}) {
      return (n) => e[n] !== t[n];
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.A = (0, scope.k.createContext)({});
        break;
      }
      case 1: {
        scope.M = typeof window < `u` ? scope.k.useLayoutEffect : scope.k.useEffect;
        break;
      }
      case 2: {
        scope.N = (0, scope.k.createContext)(null);
        break;
      }
      case 3: {
        scope.re = (e, t, n) => (n > t ? t : n < e ? e : n);
        break;
      }
      case 4: {
        scope.ie = {};
        break;
      }
      case 5: {
        scope.ae = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e);
        break;
      }
      case 6: {
        scope.F = (e) => typeof e == `object` && !!e;
        break;
      }
      case 7: {
        scope.I = (e) => /^0[^.\s]+$/u.test(e);
        break;
      }
      case 8: {
        scope.se = (e) => e;
        break;
      }
      case 9: {
        scope.L = (...e) => e.reduce((e, t) => (n) => t(e(n)));
        break;
      }
      case 10: {
        scope.ce = (e, t, n) => {
          let r = t - e;
          return r ? (n - e) / r : 1;
        };
        break;
      }
      case 11: {
        scope.le = class {
          constructor() {
            this.subscriptions = [];
          }
          add(e) {
            return ((0, scope.P)(this.subscriptions, e), () => this.remove(e));
          }
          remove(e) {
            (0, scope.ne)(this.subscriptions, e);
          }
          notify(e, t, n) {
            let r = this.subscriptions.length;
            if (r) {
              if (r === 1) this.subscriptions[0](e, t, n);
              else
                for (let i = 0; i < r; i++) {
                  let r = this.subscriptions[i];
                  r && r(e, t, n);
                }
            }
          }
          getSize() {
            return this.subscriptions.length;
          }
          clear() {
            this.subscriptions.length = 0;
          }
        };
        break;
      }
      case 12: {
        scope.R = (e) => e * 1e3;
        break;
      }
      case 13: {
        scope.z = (e) => e / 1e3;
        break;
      }
      case 14: {
        scope.ue = (e, t) => (t ? (1e3 / t) * e : 0);
        break;
      }
      case 15: {
        scope.de = (e, t, n) => (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e;
        break;
      }
      case 16: {
        scope.fe = 1e-7;
        break;
      }
      case 17: {
        scope.pe = 12;
        break;
      }
      case 18: {
        scope.ge = (e) => (t) => (t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2);
        break;
      }
      case 19: {
        scope._e = (e) => (t) => 1 - e(1 - t);
        break;
      }
      case 20: {
        scope.ve = (0, scope.he)(0.33, 1.53, 0.69, 0.99);
        break;
      }
      case 21: {
        scope.ye = (0, scope._e)(scope.ve);
        break;
      }
      case 22: {
        scope.be = (0, scope.ge)(scope.ye);
        break;
      }
      case 23: {
        scope.xe = (e) =>
          e >= 1 ? 1 : (e *= 2) < 1 ? 0.5 * (0, scope.ye)(e) : 0.5 * (2 - 2 ** (-10 * (e - 1)));
        break;
      }
      case 24: {
        scope.Se = (e) => 1 - Math.sin(Math.acos(e));
        break;
      }
      case 25: {
        scope.Ce = (0, scope._e)(scope.Se);
        break;
      }
      case 26: {
        scope.we = (0, scope.ge)(scope.Se);
        break;
      }
      case 27: {
        scope.Te = (0, scope.he)(0.42, 0, 1, 1);
        break;
      }
      case 28: {
        scope.Ee = (0, scope.he)(0, 0, 0.58, 1);
        break;
      }
      case 29: {
        scope.De = (0, scope.he)(0.42, 0, 0.58, 1);
        break;
      }
      case 30: {
        scope.Oe = (e) => Array.isArray(e) && typeof e[0] != `number`;
        break;
      }
      case 31: {
        scope.ke = (e) => Array.isArray(e) && typeof e[0] == `number`;
        break;
      }
      case 32: {
        scope.Ae = {
          linear: scope.se,
          easeIn: scope.Te,
          easeInOut: scope.De,
          easeOut: scope.Ee,
          circIn: scope.Se,
          circInOut: scope.we,
          circOut: scope.Ce,
          backIn: scope.ye,
          backInOut: scope.be,
          backOut: scope.ve,
          anticipate: scope.xe,
        };
        break;
      }
      case 33: {
        scope.je = (e) => typeof e == `string`;
        break;
      }
      case 34: {
        scope.Me = (e) => {
          if ((0, scope.ke)(e)) {
            e.length;
            let [t, n, r, i] = e;
            return (0, scope.he)(t, n, r, i);
          }
          return (0, scope.je)(e) ? (scope.Ae[e], `${e}`, scope.Ae[e]) : e;
        };
        break;
      }
      case 35: {
        scope.B = { delta: 0, timestamp: 0, isProcessing: !1 };
        break;
      }
      case 36: {
        scope.V = {
          now: () => (
            scope.Ne === void 0 &&
              scope.V.set(
                scope.B.isProcessing || scope.ie.useManualTiming
                  ? scope.B.timestamp
                  : performance.now(),
              ),
            scope.Ne
          ),
          set: (e) => {
            ((scope.Ne = e), queueMicrotask(scope.Pe));
          },
        };
        break;
      }
      case 37: {
        scope.Fe = (e) => Math.round(e * 1e5) / 1e5;
        break;
      }
      case 38: {
        scope.Ie = (e) => (t) => typeof t == `string` && t.startsWith(e);
        break;
      }
      case 39: {
        scope.Le = (0, scope.Ie)(`--`);
        break;
      }
      case 40: {
        scope.Re = (0, scope.Ie)(`var(--`);
        break;
      }
      case 41: {
        scope.ze = (e) => ((0, scope.Re)(e) ? scope.Be.test(e.split(`/*`)[0].trim()) : !1);
        break;
      }
      case 42: {
        scope.Be =
          /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
        break;
      }
      case 43: {
        scope.He = { test: (e) => typeof e == `number`, parse: parseFloat, transform: (e) => e };
        break;
      }
      case 44: {
        scope.Ue = { ...scope.He, transform: (e) => (0, scope.re)(0, 1, e) };
        break;
      }
      case 45: {
        scope.We = { ...scope.He, default: 1 };
        break;
      }
      case 46: {
        scope.Ge = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
        break;
      }
      case 47: {
        scope.qe =
          /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
        break;
      }
      case 48: {
        scope.Je = (e, t) => (n) =>
          !!(
            (typeof n == `string` && scope.qe.test(n) && n.startsWith(e)) ||
            (t && !(0, scope.Ke)(n) && Object.prototype.hasOwnProperty.call(n, t))
          );
        break;
      }
      case 49: {
        scope.Ye = (e, t, n) => (r) => {
          if (typeof r != `string`) return r;
          let [i, a, o, s] = r.match(scope.Ge);
          return {
            [e]: parseFloat(i),
            [t]: parseFloat(a),
            [n]: parseFloat(o),
            alpha: s === void 0 ? 1 : parseFloat(s),
          };
        };
        break;
      }
      case 50: {
        scope.Xe = (e) => (0, scope.re)(0, 255, e);
        break;
      }
      case 51: {
        scope.Ze = { ...scope.He, transform: (e) => Math.round((0, scope.Xe)(e)) };
        break;
      }
      case 52: {
        scope.Qe = {
          test: (0, scope.Je)(`rgb`, `red`),
          parse: (0, scope.Ye)(`red`, `green`, `blue`),
          transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) =>
            `rgba(` +
            scope.Ze.transform(e) +
            `, ` +
            scope.Ze.transform(t) +
            `, ` +
            scope.Ze.transform(n) +
            `, ` +
            (0, scope.Fe)(scope.Ue.transform(r)) +
            `)`,
        };
        break;
      }
      case 53: {
        scope.et = { test: (0, scope.Je)(`#`), parse: scope.$e, transform: scope.Qe.transform };
        break;
      }
      case 54: {
        scope.tt = (e) => ({
          test: (t) => typeof t == `string` && t.endsWith(e) && t.split(` `).length === 1,
          parse: parseFloat,
          transform: (t) => `${t}${e}`,
        });
        break;
      }
      case 55: {
        scope.nt = (0, scope.tt)(`deg`);
        break;
      }
      case 56: {
        scope.rt = (0, scope.tt)(`%`);
        break;
      }
      case 57: {
        scope.H = (0, scope.tt)(`px`);
        break;
      }
      case 58: {
        scope.it = (0, scope.tt)(`vh`);
        break;
      }
      case 59: {
        scope.at = (0, scope.tt)(`vw`);
        break;
      }
      case 60: {
        scope.ot = {
          ...scope.rt,
          parse: (e) => scope.rt.parse(e) / 100,
          transform: (e) => scope.rt.transform(e * 100),
        };
        break;
      }
      case 61: {
        scope.st = {
          test: (0, scope.Je)(`hsl`, `hue`),
          parse: (0, scope.Ye)(`hue`, `saturation`, `lightness`),
          transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) =>
            `hsla(` +
            Math.round(e) +
            `, ` +
            scope.rt.transform((0, scope.Fe)(t)) +
            `, ` +
            scope.rt.transform((0, scope.Fe)(n)) +
            `, ` +
            (0, scope.Fe)(scope.Ue.transform(r)) +
            `)`,
        };
        break;
      }
      case 62: {
        scope.U = {
          test: (e) => scope.Qe.test(e) || scope.et.test(e) || scope.st.test(e),
          parse: (e) =>
            scope.Qe.test(e)
              ? scope.Qe.parse(e)
              : scope.st.test(e)
                ? scope.st.parse(e)
                : scope.et.parse(e),
          transform: (e) =>
            typeof e == `string`
              ? e
              : e.hasOwnProperty(`red`)
                ? scope.Qe.transform(e)
                : scope.st.transform(e),
          getAnimatableNone: (e) => {
            let t = scope.U.parse(e);
            return ((t.alpha = 0), scope.U.transform(t));
          },
        };
        break;
      }
      case 63: {
        scope.ct =
          /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
        break;
      }
      case 64: {
        scope.lt = new RegExp(scope.Ge.source);
        break;
      }
      case 65: {
        scope.ut = new RegExp(scope.ct.source, `i`);
        break;
      }
      case 66: {
        scope.ft = `number`;
        break;
      }
      case 67: {
        scope.pt = `color`;
        break;
      }
      case 68: {
        scope.mt = `var`;
        break;
      }
      case 69: {
        scope.ht = `var(`;
        break;
      }
      case 70: {
        scope.gt = '${}';
        break;
      }
      case 71: {
        scope._t =
          /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
        break;
      }
      case 72: {
        scope.Ct = (e) =>
          typeof e == `number` ? 0 : scope.U.test(e) ? scope.U.getAnimatableNone(e) : e;
        break;
      }
      case 73: {
        scope.wt = (e, t) =>
          typeof e == `number` ? (t?.trim().endsWith(`/`) ? e : 0) : (0, scope.Ct)(e);
        break;
      }
      case 74: {
        scope.Et = {
          test: scope.dt,
          parse: scope.bt,
          createTransformer: scope.St,
          getAnimatableNone: scope.Tt,
        };
        break;
      }
      case 75: {
        scope.W = (e, t, n) => e + (t - e) * n;
        break;
      }
      case 76: {
        scope.At = (e, t, n) => {
          let r = e * e,
            i = n * (t * t - r) + r;
          return i < 0 ? 0 : Math.sqrt(i);
        };
        break;
      }
      case 77: {
        scope.jt = [scope.et, scope.Qe, scope.st];
        break;
      }
      case 78: {
        scope.Mt = (e) => scope.jt.find((t) => t.test(e));
        break;
      }
      case 79: {
        scope.Pt = (e, t) => {
          let n = (0, scope.Nt)(e),
            r = (0, scope.Nt)(t);
          if (!n || !r) return (0, scope.kt)(e, t);
          let i = { ...n };
          return (e) => (
            (i.red = (0, scope.At)(n.red, r.red, e)),
            (i.green = (0, scope.At)(n.green, r.green, e)),
            (i.blue = (0, scope.At)(n.blue, r.blue, e)),
            (i.alpha = (0, scope.W)(n.alpha, r.alpha, e)),
            scope.Qe.transform(i)
          );
        };
        break;
      }
      case 80: {
        scope.Ft = new Set([`none`, `hidden`]);
        break;
      }
      case 81: {
        scope.Ht = (e, t) => {
          let n = scope.Et.createTransformer(t),
            r = (0, scope.yt)(e),
            i = (0, scope.yt)(t);
          return r.indexes.var.length === i.indexes.var.length &&
            r.indexes.color.length === i.indexes.color.length &&
            r.indexes.number.length >= i.indexes.number.length
            ? (scope.Ft.has(e) && !i.values.length) || (scope.Ft.has(t) && !r.values.length)
              ? (0, scope.It)(e, t)
              : (0, scope.L)((0, scope.zt)((0, scope.Vt)(r, i), i.values), n)
            : (`${e}${t}`, (0, scope.kt)(e, t));
        };
        break;
      }
      case 82: {
        scope.Ut = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;
        break;
      }
      case 83: {
        scope.Kt = [
          `setup`,
          `read`,
          `resolveKeyframes`,
          `preUpdate`,
          `update`,
          `preRender`,
          `render`,
          `postRender`,
        ];
        break;
      }
      case 84: {
        scope.Jt = 40;
        break;
      }
      case 85: {
        ({
          schedule: scope.G,
          cancel: scope.Xt,
          steps: scope.Zt,
        } = (0, scope.Yt)(
          typeof requestAnimationFrame < `u` ? requestAnimationFrame : scope.se,
          !0,
          scope.B,
        ));
        break;
      }
      case 86: {
        scope.Qt = (e) => {
          let t = ({ timestamp: t }) => e(t);
          return {
            start: (e = !0) => scope.G.update(t, e),
            stop: () => (0, scope.Xt)(t),
            now: () => (scope.B.isProcessing ? scope.B.timestamp : scope.V.now()),
          };
        };
        break;
      }
      case 87: {
        scope.$t = (e, t, n = 10) => {
          let r = ``,
            i = Math.max(Math.round(t / n), 2);
          for (let t = 0; t < i; t++) r += Math.round(e(t / (i - 1)) * 1e4) / 1e4 + `, `;
          return `linear(${r.substring(0, r.length - 2)})`;
        };
        break;
      }
      case 88: {
        scope.en = 2e4;
        break;
      }
      case 89: {
        scope.K = {
          stiffness: 100,
          damping: 10,
          mass: 1,
          duration: 800,
          bounce: 0.3,
          visualDuration: 0.3,
          restSpeed: { granular: 0.01, default: 2 },
          restDelta: { granular: 0.005, default: 0.5 },
          minDuration: 0.01,
          maxDuration: 10,
          minDamping: 0.05,
        };
        break;
      }
      case 90: {
        scope.rn = (e) =>
          e < 0 ? 1 / Math.max(1 + e, scope.K.minDamping) : Math.max(1 - e, scope.K.minDamping);
        break;
      }
      case 91: {
        scope.sn = 12;
        break;
      }
      case 92: {
        scope.ln = 0.001;
        break;
      }
      case 93: {
        scope.dn = (e, t) => (t ? e >= 0 : e > 0) && e < 1 / 0;
        break;
      }
      case 94: {
        scope.mn.applyToOptions = (e) => {
          let t = (0, scope.nn)(e, 100, scope.mn);
          return (
            (e.ease = t.ease),
            (e.duration = (0, scope.R)(t.duration)),
            (e.type = `keyframes`),
            e
          );
        };
        break;
      }
      case 95: {
        scope.Cn = 5;
        break;
      }
      case 96: {
        scope.En = (e) => e !== null;
        break;
      }
      case 97: {
        scope.On = {
          decay: scope.hn,
          inertia: scope.hn,
          tween: scope.Sn,
          keyframes: scope.Sn,
          spring: scope.mn,
        };
        break;
      }
      case 98: {
        scope.Nn = class {
          constructor() {
            this.isResolved = !1;
          }
          get finished() {
            return (
              (this._finished ||= this.isResolved
                ? Promise.resolve()
                : new Promise((e) => {
                    this._resolve = e;
                  })),
              this._finished
            );
          }
          updateFinished() {
            ((this._finished = this._resolve = void 0), (this.isResolved = !1));
          }
          notifyFinished() {
            ((this.isResolved = !0), this._resolve?.());
          }
          then(e, t) {
            return this.finished.then(e, t);
          }
        };
        break;
      }
      case 99: {
        scope.Pn = (e) => e / 100;
        break;
      }
      case 100: {
        scope.Fn = class extends scope.Nn {
          constructor(e) {
            (super(),
              (this.state = `idle`),
              (this.startTime = null),
              (this.isStopped = !1),
              (this.currentTime = 0),
              (this.holdTime = null),
              (this.playbackSpeed = 1),
              (this.delayState = { done: !1, value: void 0 }),
              (this.stop = () => {
                let { motionValue: e } = this.options;
                (e && e.updatedAt !== scope.V.now() && this.tick(scope.V.now()),
                  (this.isStopped = !0),
                  this.state !== `idle` && (this.teardown(), this.options.onStop?.()));
              }),
              (this.options = e),
              this.initAnimation(),
              this.play(),
              e.autoplay === !1 && this.pause(),
              (0, scope.jn)(this, this.options));
          }
          initAnimation() {
            let { options: e } = this;
            (0, scope.kn)(e);
            let {
                type: t = scope.Sn,
                repeat: n = 0,
                repeatDelay: r = 0,
                repeatType: i,
                velocity: a = 0,
              } = e,
              { keyframes: o } = e,
              s = t || scope.Sn;
            s !== scope.Sn &&
              typeof o[0] != `number` &&
              ((this.mixKeyframes = (0, scope.L)(scope.Pn, (0, scope.Gt)(o[0], o[1]))),
              (o = [0, 100]));
            let c = s(o === e.keyframes ? e : { ...e, keyframes: o });
            (i === `mirror` &&
              (this.mirroredGenerator = s({ ...e, keyframes: [...o].reverse(), velocity: -a })),
              c.calculatedDuration === null && (c.calculatedDuration = (0, scope.tn)(c)));
            let { calculatedDuration: l } = c;
            ((this.calculatedDuration = l),
              (this.resolvedDuration = l + r),
              (this.totalDuration = this.resolvedDuration * (n + 1) - r),
              (this.generator = c));
          }
          updateTime(e) {
            let t = Math.round(e - this.startTime) * this.playbackSpeed;
            this.currentTime = this.holdTime === null ? t : this.holdTime;
          }
          tick(e, t = !1) {
            let {
              generator: n,
              totalDuration: r,
              mixKeyframes: i,
              mirroredGenerator: a,
              resolvedDuration: o,
              calculatedDuration: s,
            } = this;
            if (this.startTime === null) return n.next(0);
            let {
              delay: c = 0,
              keyframes: l,
              repeat: u,
              repeatType: d,
              repeatDelay: f,
              type: p,
              onUpdate: m,
              finalKeyframe: h,
            } = this.options;
            (this.speed > 0
              ? (this.startTime = Math.min(this.startTime, e))
              : this.speed < 0 && (this.startTime = Math.min(e - r / this.speed, this.startTime)),
              t ? (this.currentTime = e) : this.updateTime(e));
            let g = this.currentTime - c * (this.playbackSpeed >= 0 ? 1 : -1),
              _ = this.playbackSpeed >= 0 ? g < 0 : g > r;
            ((this.currentTime = Math.max(g, 0)),
              this.state === `finished` && this.holdTime === null && (this.currentTime = r));
            let v = this.currentTime,
              y = n;
            if (u) {
              let e = Math.min(this.currentTime, r) / o,
                t = Math.floor(e),
                n = e % 1;
              (!n && e >= 1 && (n = 1),
                n === 1 && t--,
                (t = Math.min(t, u + 1)),
                t % 2 &&
                  (d === `reverse` ? ((n = 1 - n), f && (n -= f / o)) : d === `mirror` && (y = a)),
                (v = (0, scope.re)(0, 1, n) * o));
            }
            let b;
            (_ ? ((this.delayState.value = l[0]), (b = this.delayState)) : (b = y.next(v)),
              i && !_ && (b.value = i(b.value)));
            let { done: x } = b;
            !_ &&
              s !== null &&
              (x = this.playbackSpeed >= 0 ? this.currentTime >= r : this.currentTime <= 0);
            let S =
              this.holdTime === null &&
              (this.state === `finished` || (this.state === `running` && x));
            return (
              S && p !== scope.hn && (b.value = (0, scope.Dn)(l, this.options, h, this.speed)),
              m && m(b.value),
              S && this.finish(),
              b
            );
          }
          then(e, t) {
            return this.finished.then(e, t);
          }
          get duration() {
            return (0, scope.z)(this.calculatedDuration);
          }
          get iterationDuration() {
            let { delay: e = 0 } = this.options || {};
            return this.duration + (0, scope.z)(e);
          }
          get time() {
            return (0, scope.z)(this.currentTime);
          }
          set time(e) {
            ((e = (0, scope.R)(e)),
              (this.currentTime = e),
              this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0
                ? (this.holdTime = e)
                : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed),
              this.driver
                ? this.driver.start(!1)
                : ((this.startTime = 0),
                  (this.state = `paused`),
                  (this.holdTime = e),
                  this.tick(e)));
          }
          getGeneratorVelocity() {
            return (0, scope.Tn)(this.generator, this.currentTime, this.options.velocity);
          }
          get speed() {
            return this.playbackSpeed;
          }
          set speed(e) {
            let t = this.playbackSpeed !== e;
            (t && this.driver && this.updateTime(scope.V.now()),
              (this.playbackSpeed = e),
              t && this.driver && (this.time = (0, scope.z)(this.currentTime)));
          }
          play() {
            if (this.isStopped) return;
            let { driver: e = scope.Qt, startTime: t } = this.options;
            ((this.driver ||= e((e) => this.tick(e))), this.options.onPlay?.());
            let n = this.driver.now();
            (this.state === `finished`
              ? (this.updateFinished(), (this.startTime = n))
              : this.holdTime === null
                ? (this.startTime ||= t ?? n)
                : (this.startTime = n - this.holdTime),
              this.state === `finished` &&
                this.speed < 0 &&
                (this.startTime += this.calculatedDuration),
              (this.holdTime = null),
              (this.state = `running`),
              this.driver.start());
          }
          pause() {
            ((this.state = `paused`),
              this.updateTime(scope.V.now()),
              (this.holdTime = this.currentTime));
          }
          complete() {
            (this.state !== `running` && this.play(),
              (this.state = `finished`),
              (this.holdTime = null));
          }
          finish() {
            (this.notifyFinished(),
              this.teardown(),
              (this.state = `finished`),
              this.options.onComplete?.());
          }
          cancel() {
            ((this.holdTime = null),
              (this.startTime = 0),
              this.tick(0),
              this.teardown(),
              this.options.onCancel?.());
          }
          teardown() {
            ((this.state = `idle`), this.stopDriver(), (this.startTime = this.holdTime = null));
          }
          stopDriver() {
            this.driver &&= (this.driver.stop(), void 0);
          }
          sample(e) {
            return ((this.startTime = 0), this.tick(e, !0));
          }
          attachTimeline(e) {
            return (
              this.options.allowFlatten &&
                ((this.options.type = `keyframes`),
                (this.options.ease = `linear`),
                this.initAnimation()),
              this.driver?.stop(),
              e.observe(this)
            );
          }
        };
        break;
      }
      case 101: {
        scope.In = new Set([`brightness`, `contrast`, `saturate`, `opacity`]);
        break;
      }
      case 102: {
        scope.Rn = /\b([a-z-]*)\(.*?\)/gu;
        break;
      }
      case 103: {
        scope.zn = {
          ...scope.Et,
          getAnimatableNone: (e) => {
            let t = e.match(scope.Rn);
            return t ? t.map(scope.Ln).join(` `) : e;
          },
        };
        break;
      }
      case 104: {
        scope.Bn = {
          ...scope.Et,
          getAnimatableNone: (e) => {
            let t = scope.Et.parse(e);
            return scope.Et.createTransformer(e)(
              t.map((e) =>
                typeof e == `number` ? 0 : typeof e == `object` ? { ...e, alpha: 1 } : e,
              ),
            );
          },
        };
        break;
      }
      case 105: {
        scope.Vn = { ...scope.He, transform: Math.round };
        break;
      }
      case 106: {
        scope.Hn = {
          borderWidth: scope.H,
          borderTopWidth: scope.H,
          borderRightWidth: scope.H,
          borderBottomWidth: scope.H,
          borderLeftWidth: scope.H,
          borderRadius: scope.H,
          borderTopLeftRadius: scope.H,
          borderTopRightRadius: scope.H,
          borderBottomRightRadius: scope.H,
          borderBottomLeftRadius: scope.H,
          width: scope.H,
          maxWidth: scope.H,
          height: scope.H,
          maxHeight: scope.H,
          top: scope.H,
          right: scope.H,
          bottom: scope.H,
          left: scope.H,
          inset: scope.H,
          insetBlock: scope.H,
          insetBlockStart: scope.H,
          insetBlockEnd: scope.H,
          insetInline: scope.H,
          insetInlineStart: scope.H,
          insetInlineEnd: scope.H,
          padding: scope.H,
          paddingTop: scope.H,
          paddingRight: scope.H,
          paddingBottom: scope.H,
          paddingLeft: scope.H,
          paddingBlock: scope.H,
          paddingBlockStart: scope.H,
          paddingBlockEnd: scope.H,
          paddingInline: scope.H,
          paddingInlineStart: scope.H,
          paddingInlineEnd: scope.H,
          margin: scope.H,
          marginTop: scope.H,
          marginRight: scope.H,
          marginBottom: scope.H,
          marginLeft: scope.H,
          marginBlock: scope.H,
          marginBlockStart: scope.H,
          marginBlockEnd: scope.H,
          marginInline: scope.H,
          marginInlineStart: scope.H,
          marginInlineEnd: scope.H,
          fontSize: scope.H,
          backgroundPositionX: scope.H,
          backgroundPositionY: scope.H,
          rotate: scope.nt,
          pathRotation: scope.nt,
          rotateX: scope.nt,
          rotateY: scope.nt,
          rotateZ: scope.nt,
          scale: scope.We,
          scaleX: scope.We,
          scaleY: scope.We,
          scaleZ: scope.We,
          skew: scope.nt,
          skewX: scope.nt,
          skewY: scope.nt,
          distance: scope.H,
          translateX: scope.H,
          translateY: scope.H,
          translateZ: scope.H,
          x: scope.H,
          y: scope.H,
          z: scope.H,
          perspective: scope.H,
          transformPerspective: scope.H,
          opacity: scope.Ue,
          originX: scope.ot,
          originY: scope.ot,
          originZ: scope.H,
          zIndex: scope.Vn,
          fillOpacity: scope.Ue,
          strokeOpacity: scope.Ue,
          numOctaves: scope.Vn,
        };
        break;
      }
      case 107: {
        scope.Un = {
          ...scope.Hn,
          color: scope.U,
          backgroundColor: scope.U,
          outlineColor: scope.U,
          fill: scope.U,
          stroke: scope.U,
          borderColor: scope.U,
          borderTopColor: scope.U,
          borderRightColor: scope.U,
          borderBottomColor: scope.U,
          borderLeftColor: scope.U,
          filter: scope.zn,
          WebkitFilter: scope.zn,
          mask: scope.Bn,
          WebkitMask: scope.Bn,
        };
        break;
      }
      case 108: {
        scope.Wn = (e) => scope.Un[e];
        break;
      }
      case 109: {
        scope.Gn = new Set([scope.zn, scope.Bn]);
        break;
      }
      case 110: {
        scope.Jn = (e) => (e * 180) / Math.PI;
        break;
      }
      case 111: {
        scope.Yn = (e) => (0, scope.Zn)((0, scope.Jn)(Math.atan2(e[1], e[0])));
        break;
      }
      case 112: {
        scope.Xn = {
          x: 4,
          y: 5,
          translateX: 4,
          translateY: 5,
          scaleX: 0,
          scaleY: 3,
          scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
          rotate: scope.Yn,
          rotateZ: scope.Yn,
          skewX: (e) => (0, scope.Jn)(Math.atan(e[1])),
          skewY: (e) => (0, scope.Jn)(Math.atan(e[2])),
          skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2,
        };
        break;
      }
      case 113: {
        scope.Zn = (e) => ((e %= 360), e < 0 && (e += 360), e);
        break;
      }
      case 114: {
        scope.Qn = scope.Yn;
        break;
      }
      case 115: {
        scope.$n = (e) => Math.sqrt(e[0] * e[0] + e[1] * e[1]);
        break;
      }
      case 116: {
        scope.er = (e) => Math.sqrt(e[4] * e[4] + e[5] * e[5]);
        break;
      }
      case 117: {
        scope.tr = {
          x: 12,
          y: 13,
          z: 14,
          translateX: 12,
          translateY: 13,
          translateZ: 14,
          scaleX: scope.$n,
          scaleY: scope.er,
          scale: (e) => ((0, scope.$n)(e) + (0, scope.er)(e)) / 2,
          rotateX: (e) => (0, scope.Zn)((0, scope.Jn)(Math.atan2(e[6], e[5]))),
          rotateY: (e) => (0, scope.Zn)((0, scope.Jn)(Math.atan2(-e[2], e[0]))),
          rotateZ: scope.Qn,
          rotate: scope.Qn,
          skewX: (e) => (0, scope.Jn)(Math.atan(e[4])),
          skewY: (e) => (0, scope.Jn)(Math.atan(e[1])),
          skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2,
        };
        break;
      }
      case 118: {
        scope.ir = (e, t) => {
          let { transform: n = `none` } = getComputedStyle(e);
          return (0, scope.rr)(n, t);
        };
        break;
      }
      case 119: {
        scope.or = [
          `transformPerspective`,
          `x`,
          `y`,
          `z`,
          `translateX`,
          `translateY`,
          `translateZ`,
          `scale`,
          `scaleX`,
          `scaleY`,
          `rotate`,
          `rotateX`,
          `rotateY`,
          `rotateZ`,
          `skew`,
          `skewX`,
          `skewY`,
        ];
        break;
      }
      case 120: {
        scope.sr = new Set([...scope.or, `pathRotation`]);
        break;
      }
      case 121: {
        scope.cr = (e) => e === scope.He || e === scope.H;
        break;
      }
      case 122: {
        scope.lr = new Set([`x`, `y`, `z`]);
        break;
      }
      case 123: {
        scope.ur = scope.or.filter((e) => !scope.lr.has(e));
        break;
      }
      case 124: {
        scope.fr = new Set([`bottom`, `right`]);
        break;
      }
      case 125: {
        scope.mr = {
          width: ({ width: e, paddingLeft: t = `0`, paddingRight: n = `0`, boxSizing: r }, i) =>
            (0, scope.pr)(e, i, `x`, t, n, r),
          height: ({ height: e, paddingTop: t = `0`, paddingBottom: n = `0`, boxSizing: r }, i) =>
            (0, scope.pr)(e, i, `y`, t, n, r),
          top: ({ top: e }) => parseFloat(e),
          left: ({ left: e }) => parseFloat(e),
          bottom: ({ top: e }, t) => {
            let { y: n } = t();
            return parseFloat(e) + (n.max - n.min);
          },
          right: ({ left: e }, t) => {
            let { x: n } = t();
            return parseFloat(e) + (n.max - n.min);
          },
          x: ({ transform: e }) => (0, scope.rr)(e, `x`),
          y: ({ transform: e }) => (0, scope.rr)(e, `y`),
        };
        break;
      }
      case 126: {
        ((scope.mr.translateX = scope.mr.x), (scope.mr.translateY = scope.mr.y));
        break;
      }
      case 127: {
        scope.hr = new Set();
        break;
      }
      case 128: {
        scope.gr = !1;
        break;
      }
      case 129: {
        scope._r = !1;
        break;
      }
      case 130: {
        scope.vr = !1;
        break;
      }
      case 131: {
        scope.Cr = class {
          constructor(e, t, n, r, i, a = !1) {
            ((this.state = `pending`),
              (this.isAsync = !1),
              (this.needsMeasurement = !1),
              (this.unresolvedKeyframes = [...e]),
              (this.onComplete = t),
              (this.name = n),
              (this.motionValue = r),
              (this.element = i),
              (this.isAsync = a));
          }
          scheduleResolve() {
            ((this.state = `scheduled`),
              this.isAsync
                ? (scope.hr.add(this),
                  scope.gr ||
                    ((scope.gr = !0), scope.G.read(scope.br), scope.G.resolveKeyframes(scope.yr)))
                : (this.readKeyframes(), this.complete()));
          }
          readKeyframes() {
            let { unresolvedKeyframes: e, name: t, element: n, motionValue: r } = this;
            if (e[0] === null) {
              let i = r?.get(),
                a = e[e.length - 1];
              if (i !== void 0) e[0] = i;
              else if (n && t) {
                let r = (0, scope.Sr)(n.readValue(t, a), t, a);
                r !== void 0 && (e[0] = r);
              }
              (e[0] === void 0 && (e[0] = a), r && i === void 0 && r.set(e[0]));
            }
            (0, scope.qn)(e);
          }
          setFinalKeyframe() {}
          measureInitialState() {}
          renderEndStyles() {}
          measureEndState() {}
          complete(e = !1) {
            ((this.state = `complete`),
              this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e),
              scope.hr.delete(this));
          }
          cancel() {
            this.state === `scheduled` && (scope.hr.delete(this), (this.state = `pending`));
          }
          resume() {
            this.state === `pending` && this.scheduleResolve();
          }
        };
        break;
      }
      case 132: {
        scope.wr = (e) => e.startsWith(`--`);
        break;
      }
      case 133: {
        scope.Er = {};
        break;
      }
      case 134: {
        scope.Or = (0, scope.Dr)(() => window.ScrollTimeline !== void 0, `scrollTimeline`);
        break;
      }
      case 135: {
        scope.kr = (0, scope.Dr)(() => {
          try {
            document.createElement(`div`).animate({ opacity: 0 }, { easing: `linear(0, 1)` });
          } catch {
            return !1;
          }
          return !0;
        }, `linearEasing`);
        break;
      }
      case 136: {
        scope.Ar = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`;
        break;
      }
      case 137: {
        scope.jr = {
          linear: `linear`,
          ease: `ease`,
          easeIn: `ease-in`,
          easeOut: `ease-out`,
          easeInOut: `ease-in-out`,
          circIn: (0, scope.Ar)([0, 0.65, 0.55, 1]),
          circOut: (0, scope.Ar)([0.55, 0, 1, 0.45]),
          backIn: (0, scope.Ar)([0.31, 0.01, 0.66, -0.59]),
          backOut: (0, scope.Ar)([0.33, 1.53, 0.69, 0.99]),
        };
        break;
      }
      case 138: {
        scope.Ir = class extends scope.Nn {
          constructor(e) {
            if (
              (super(),
              (this.finishedTime = null),
              (this.isStopped = !1),
              (this.manualStartTime = null),
              !e)
            )
              return;
            let {
              element: t,
              name: n,
              keyframes: r,
              pseudoElement: i,
              allowFlatten: a = !1,
              finalKeyframe: o,
              onComplete: s,
            } = e;
            ((this.isPseudoElement = !!i), (this.allowFlatten = a), (this.options = e), e.type);
            let c = (0, scope.Fr)(e);
            ((this.animation = (0, scope.Nr)(t, n, r, c, i)),
              c.autoplay === !1 && this.animation.pause(),
              (this.animation.onfinish = () => {
                if (((this.finishedTime = this.time), !i)) {
                  let e = (0, scope.Dn)(r, this.options, o, this.speed);
                  (this.updateMotionValue && this.updateMotionValue(e),
                    (0, scope.Tr)(t, n, e),
                    this.animation.cancel());
                }
                (s?.(), this.notifyFinished());
              }),
              (0, scope.jn)(this, e, c));
          }
          play() {
            this.isStopped ||
              ((this.manualStartTime = null),
              this.animation.play(),
              this.state === `finished` && this.updateFinished());
          }
          pause() {
            this.animation.pause();
          }
          complete() {
            this.animation.finish?.();
          }
          cancel() {
            try {
              this.animation.cancel();
            } catch {}
          }
          stop() {
            if (this.isStopped) return;
            this.isStopped = !0;
            let { state: e } = this;
            e !== `idle` &&
              e !== `finished` &&
              (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(),
              this.isPseudoElement || this.cancel());
          }
          commitStyles() {
            let e = this.options?.element;
            !this.isPseudoElement && e?.isConnected && this.animation.commitStyles?.();
          }
          get duration() {
            let e = this.animation.effect?.getComputedTiming?.().duration || 0;
            return (0, scope.z)(Number(e));
          }
          get iterationDuration() {
            let { delay: e = 0 } = this.options || {};
            return this.duration + (0, scope.z)(e);
          }
          get time() {
            return (0, scope.z)(Number(this.animation.currentTime) || 0);
          }
          set time(e) {
            let t = this.finishedTime !== null;
            ((this.manualStartTime = null),
              (this.finishedTime = null),
              (this.animation.currentTime = (0, scope.R)(e)),
              t && this.animation.pause());
          }
          get speed() {
            return this.animation.playbackRate;
          }
          set speed(e) {
            (e < 0 && (this.finishedTime = null), (this.animation.playbackRate = e));
          }
          get state() {
            return this.finishedTime === null ? this.animation.playState : `finished`;
          }
          get startTime() {
            return this.manualStartTime ?? Number(this.animation.startTime);
          }
          set startTime(e) {
            this.manualStartTime = this.animation.startTime = e;
          }
          attachTimeline({ timeline: e, onAttach: t, observe: n, ...r }) {
            return (
              this.allowFlatten && this.animation.effect?.updateTiming({ easing: `linear` }),
              (this.animation.onfinish = null),
              e && (0, scope.Or)()
                ? ((this.animation.timeline = e),
                  Object.assign(this.animation, r),
                  t?.(this.animation),
                  scope.se)
                : n(this)
            );
          }
        };
        break;
      }
      case 139: {
        scope.Lr = { anticipate: scope.xe, backInOut: scope.be, circInOut: scope.we };
        break;
      }
      case 140: {
        scope.Br = 10;
        break;
      }
      case 141: {
        scope.Vr = class extends scope.Ir {
          constructor(e) {
            ((0, scope.zr)(e),
              (0, scope.kn)(e),
              super(e),
              e.startTime !== void 0 && e.autoplay !== !1 && (this.startTime = e.startTime),
              (this.options = e));
          }
          updateMotionValue(e) {
            let { motionValue: t, onUpdate: n, onComplete: r, element: i, ...a } = this.options;
            if (!t) return;
            if (e !== void 0) {
              t.set(e);
              return;
            }
            let o = new scope.Fn({ ...a, autoplay: !1 }),
              s = Math.max(scope.Br, scope.V.now() - this.startTime),
              c = (0, scope.re)(0, scope.Br, s - scope.Br),
              l = o.sample(s).value,
              { name: u } = this.options;
            (i && u && (0, scope.Tr)(i, u, l),
              t.setWithVelocity(o.sample(Math.max(0, s - c)).value, l, c),
              o.stop());
          }
        };
        break;
      }
      case 142: {
        scope.Hr = (e, t) =>
          t !== `zIndex` &&
          !!(
            typeof e == `number` ||
            Array.isArray(e) ||
            (typeof e == `string` && (scope.Et.test(e) || e === `0`) && !e.startsWith(`url(`))
          );
        break;
      }
      case 143: {
        scope.Kr = new Set([`opacity`, `clipPath`, `filter`, `transform`, `backgroundColor`]);
        break;
      }
      case 144: {
        scope.qr = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
        break;
      }
      case 145: {
        scope.Yr = new Set([
          `color`,
          `backgroundColor`,
          `outlineColor`,
          `fill`,
          `stroke`,
          `borderColor`,
          `borderTopColor`,
          `borderRightColor`,
          `borderBottomColor`,
          `borderLeftColor`,
        ]);
        break;
      }
      case 146: {
        scope.Xr = (0, scope.oe)(() => Object.hasOwnProperty.call(Element.prototype, `animate`));
        break;
      }
      case 147: {
        scope.Qr = 40;
        break;
      }
      case 148: {
        scope.$r = class extends scope.Nn {
          constructor(e) {
            (super(),
              (this.stop = () => {
                (this._animation && (this._animation.stop(), this.stopTimeline?.()),
                  this.keyframeResolver?.cancel());
              }),
              (this.createdAt = scope.V.now()));
            let { keyframes: t, name: n, motionValue: r, element: i } = e,
              a = e;
            ((a.autoplay ??= !0),
              (a.delay ??= 0),
              (a.type ??= `keyframes`),
              (a.repeat ??= 0),
              (a.repeatDelay ??= 0),
              (a.repeatType ??= `loop`));
            let o = i?.KeyframeResolver || scope.Cr;
            ((this.keyframeResolver = new o(
              t,
              (e, t, n) => this.onKeyframesResolved(e, t, a, !n),
              n,
              r,
              i,
            )),
              this.keyframeResolver?.scheduleResolve());
          }
          onKeyframesResolved(e, t, n, r) {
            this.keyframeResolver = void 0;
            let { name: i, type: a, velocity: o, delay: s, isHandoff: c, onUpdate: l } = n;
            this.resolvedAt = scope.V.now();
            let u = !0;
            (0, scope.Wr)(e, i, a, o) ||
              ((u = !1),
              (scope.ie.instantAnimations || !s) && l?.((0, scope.Dn)(e, n, t)),
              (e[0] = e[e.length - 1]),
              (0, scope.Gr)(n),
              (n.repeat = 0));
            let d = r
                ? this.resolvedAt && this.resolvedAt - this.createdAt > scope.Qr
                  ? this.resolvedAt
                  : this.createdAt
                : void 0,
              { onComplete: f } = n;
            ((n.startTime ??= d),
              (n.finalKeyframe = t),
              (n.keyframes = e),
              (n.onComplete = () => {
                (f?.(), this.notifyFinished());
              }));
            let p = u && !c && (0, scope.Zr)(n),
              m;
            if (p) {
              n.element = n.motionValue?.owner?.current;
              try {
                m = new scope.Vr(n);
              } catch {
                m = new scope.Fn(n);
              }
            } else m = new scope.Fn(n);
            ((this.pendingTimeline &&=
              ((this.stopTimeline = m.attachTimeline(this.pendingTimeline)), void 0)),
              (this._animation = m));
          }
          get finished() {
            return this._animation ? this._animation.finished : super.finished;
          }
          then(e, t) {
            return this.finished.finally(e).then(() => {});
          }
          get animation() {
            return (
              this._animation || (this.keyframeResolver?.resume(), (0, scope.xr)()),
              this._animation
            );
          }
          get duration() {
            return this.animation.duration;
          }
          get iterationDuration() {
            return this.animation.iterationDuration;
          }
          get time() {
            return this.animation.time;
          }
          set time(e) {
            this.animation.time = e;
          }
          get speed() {
            return this.animation.speed;
          }
          get state() {
            return this.animation.state;
          }
          set speed(e) {
            this.animation.speed = e;
          }
          get startTime() {
            return this.animation.startTime;
          }
          attachTimeline(e) {
            return (
              this._animation
                ? (this.stopTimeline = this.animation.attachTimeline(e))
                : (this.pendingTimeline = e),
              () => this.stop()
            );
          }
          play() {
            this.animation.play();
          }
          pause() {
            this.animation.pause();
          }
          complete() {
            this.animation.complete();
          }
          cancel() {
            (this._animation && this.animation.cancel(), this.keyframeResolver?.cancel());
          }
        };
        break;
      }
      case 149: {
        scope.ti = 30;
        break;
      }
      case 150: {
        scope.ni = (e) => !isNaN(parseFloat(e));
        break;
      }
      case 151: {
        scope.ri = { current: void 0 };
        break;
      }
      case 152: {
        scope.ii = class {
          constructor(e, t = {}) {
            ((this.canTrackVelocity = null),
              (this.events = {}),
              (this.updateAndNotify = (e) => {
                let t = scope.V.now();
                if (
                  (this.updatedAt !== t && this.setPrevFrameValue(),
                  (this.prev = this.current),
                  this.setCurrent(e),
                  this.current !== this.prev && (this.notifyChange(), this.dependents))
                )
                  for (let e of this.dependents) e.dirty();
              }),
              (this.hasAnimated = !1),
              this.setCurrent(e),
              (this.owner = t.owner));
          }
          setCurrent(e) {
            ((this.current = e),
              (this.updatedAt = scope.V.now()),
              this.canTrackVelocity === null &&
                e !== void 0 &&
                (this.canTrackVelocity = (0, scope.ni)(this.current)));
          }
          setPrevFrameValue(e = this.current) {
            ((this.prevFrameValue = e), (this.prevUpdatedAt = this.updatedAt));
          }
          onChange(e) {
            return this.on(`change`, e);
          }
          on(e, t) {
            var n;
            return e === `change`
              ? this.onChangeSubscribe(t)
              : ((n = this.events)[e] || (n[e] = new scope.le())).add(t);
          }
          onChangeSubscribe(e) {
            let { events: t } = this;
            return (
              !t.change && !this.changeSubscriber
                ? (this.changeSubscriber = e)
                : (t.change ||
                    ((t.change = new scope.le()),
                    t.change.add(this.changeSubscriber),
                    (this.changeSubscriber = void 0)),
                  t.change.add(e)),
              () => {
                (this.changeSubscriber === e
                  ? (this.changeSubscriber = void 0)
                  : t.change?.remove(e),
                  this.stopIfUnobserved());
              }
            );
          }
          stopIfUnobserved() {
            scope.G.read(() => {
              !this.changeSubscriber && !this.events.change?.getSize() && this.stop();
            });
          }
          clearListeners() {
            this.changeSubscriber = void 0;
            for (let e in this.events) this.events[e].clear();
          }
          attach(e, t) {
            ((this.passiveEffect = e), (this.stopPassiveEffect = t));
          }
          set(e) {
            this.passiveEffect
              ? this.passiveEffect(e, this.updateAndNotify)
              : this.updateAndNotify(e);
          }
          setWithVelocity(e, t, n) {
            (this.set(t),
              (this.prev = void 0),
              (this.prevFrameValue = e),
              (this.prevUpdatedAt = this.updatedAt - n));
          }
          jump(e, t = !0) {
            (this.updateAndNotify(e),
              (this.prev = e),
              (this.prevUpdatedAt = this.prevFrameValue = void 0),
              t && this.stop(),
              this.stopPassiveEffect && this.stopPassiveEffect());
          }
          dirty() {
            this.notifyChange();
          }
          notifyChange() {
            let { current: e, changeSubscriber: t } = this;
            t ? t(e) : this.events.change?.notify(e);
          }
          addDependent(e) {
            ((this.dependents ||= new Set()), this.dependents.add(e));
          }
          removeDependent(e) {
            this.dependents && this.dependents.delete(e);
          }
          get() {
            return (scope.ri.current && scope.ri.current.push(this), this.current);
          }
          getPrevious() {
            return this.prev;
          }
          getVelocity() {
            let e = scope.V.now();
            if (
              !this.canTrackVelocity ||
              this.prevFrameValue === void 0 ||
              e - this.updatedAt > scope.ti
            )
              return 0;
            let t = Math.min(this.updatedAt - this.prevUpdatedAt, scope.ti);
            return (0, scope.ue)(parseFloat(this.current) - parseFloat(this.prevFrameValue), t);
          }
          start(e) {
            return (
              this.stop(),
              new Promise((t) => {
                this.hasAnimated = !0;
                let n = !1,
                  r;
                ((r = e(() => {
                  ((n = !0),
                    this.events.animationComplete?.notify(),
                    this.animation === r && this.clearAnimation(),
                    t());
                })),
                  n || (this.animation = r),
                  this.events.animationStart?.notify());
              })
            );
          }
          stop() {
            (this.animation &&
              (this.animation.stop(),
              this.events.animationCancel && this.events.animationCancel.notify()),
              this.clearAnimation());
          }
          isAnimating() {
            return !!this.animation;
          }
          clearAnimation() {
            this.animation = void 0;
          }
          destroy() {
            (this.dependents?.clear(),
              this.events.destroy?.notify(),
              this.clearListeners(),
              this.stop(),
              this.stopPassiveEffect && this.stopPassiveEffect());
          }
        };
        break;
      }
      case 153: {
        scope.ci = { type: `spring`, stiffness: 500, damping: 25, restSpeed: 10 };
        break;
      }
      case 154: {
        scope.li = (e) => ({
          type: `spring`,
          stiffness: 550,
          damping: e === 0 ? 2 * Math.sqrt(550) : 30,
          restSpeed: 10,
        });
        break;
      }
      case 155: {
        scope.ui = { type: `keyframes`, duration: 0.8 };
        break;
      }
      case 156: {
        scope.di = { type: `keyframes`, ease: [0.25, 0.1, 0.35, 1], duration: 0.3 };
        break;
      }
      case 157: {
        scope.fi = (e, { keyframes: t }) =>
          t.length > 2
            ? scope.ui
            : scope.sr.has(e)
              ? e.startsWith(`scale`)
                ? (0, scope.li)(t[1])
                : scope.ci
              : scope.di;
        break;
      }
      case 158: {
        scope.pi = new Set([
          `when`,
          `delay`,
          `delayChildren`,
          `staggerChildren`,
          `staggerDirection`,
          `repeat`,
          `repeatType`,
          `repeatDelay`,
          `from`,
          `elapsed`,
        ]);
        break;
      }
      case 159: {
        scope.hi =
          (e, t, n, r = {}, i, a) =>
          (o) => {
            let s = (0, scope.si)(r, e) || {},
              c = s.delay || r.delay || 0,
              { elapsed: l = 0 } = r;
            l -= (0, scope.R)(c);
            let u = {
              keyframes: Array.isArray(n) ? n : [null, n],
              ease: `easeOut`,
              velocity: t.getVelocity(),
              ...s,
              delay: -l,
              onUpdate: (e) => {
                (t.set(e), s.onUpdate && s.onUpdate(e));
              },
              onComplete: () => {
                (o(), s.onComplete && s.onComplete());
              },
              name: e,
              motionValue: t,
              element: a ? void 0 : i,
            };
            ((0, scope.mi)(s) || Object.assign(u, (0, scope.fi)(e, u)),
              (u.duration &&= (0, scope.R)(u.duration)),
              (u.repeatDelay &&= (0, scope.R)(u.repeatDelay)),
              u.from !== void 0 && (u.keyframes[0] = u.from));
            let d = !1;
            if (
              ((u.type === !1 || (u.duration === 0 && !u.repeatDelay)) &&
                ((0, scope.Gr)(u), u.delay === 0 && (d = !0)),
              (scope.ie.instantAnimations ||
                scope.ie.skipAnimations ||
                i?.shouldSkipAnimations ||
                s.skipAnimations) &&
                ((d = !0), (0, scope.Gr)(u), (u.delay = 0)),
              (u.allowFlatten = !s.type && !s.ease),
              d && !a && t.get() !== void 0)
            ) {
              let e = (0, scope.Dn)(u.keyframes, s);
              if (e !== void 0) {
                scope.G.update(() => {
                  (u.onUpdate(e), u.onComplete());
                });
                return;
              }
            }
            return s.isSync ? new scope.Fn(u) : new scope.$r(u);
          };
        break;
      }
      case 160: {
        scope.gi = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
        break;
      }
      case 161: {
        scope.Si = (e, t) => (t === `exit` ? e.presenceContext?.custom : void 0);
        break;
      }
      case 162: {
        scope.Ci = new Set([`width`, `height`, `top`, `left`, `right`, `bottom`, ...scope.or]);
        break;
      }
      case 163: {
        scope.wi = (e) => Array.isArray(e);
        break;
      }
      case 164: {
        scope.q = (e) => !!(e && e.getVelocity);
        break;
      }
      case 165: {
        scope.ji = `data-` + (0, scope.Ai)(`framerAppearId`);
        break;
      }
      case 166: {
        scope.Ni = typeof window < `u`;
        break;
      }
      case 167: {
        scope.Ri = { test: (e) => e === `auto`, parse: (e) => e };
        break;
      }
      case 168: {
        scope.zi = (e) => (t) => t.test(e);
        break;
      }
      case 169: {
        scope.Bi = [scope.He, scope.H, scope.rt, scope.nt, scope.at, scope.it, scope.Ri];
        break;
      }
      case 170: {
        scope.Vi = (e) => scope.Bi.find((0, scope.zi)(e));
        break;
      }
      case 171: {
        scope.Ui = new Set([`auto`, `none`, `0`]);
        break;
      }
      case 172: {
        scope.Gi = class extends scope.Cr {
          constructor(e, t, n, r, i) {
            super(e, t, n, r, i, !0);
          }
          readKeyframes() {
            let { unresolvedKeyframes: e, element: t, name: n } = this;
            if (!t || !t.current) return;
            super.readKeyframes();
            for (let n = 0; n < e.length; n++) {
              let r = e[n];
              if (typeof r == `string` && ((r = r.trim()), (0, scope.ze)(r))) {
                let i = (0, scope.vi)(r, t.current);
                (i !== void 0 && (e[n] = i), n === e.length - 1 && (this.finalKeyframe = r));
              }
            }
            if ((this.resolveNoneKeyframes(), !scope.Ci.has(n) || e.length !== 2)) return;
            let [r, i] = e;
            if (typeof r == `number` && typeof i == `number`) return;
            let a = (0, scope.Vi)(r),
              o = (0, scope.Vi)(i);
            if ((0, scope.Ve)(r) !== (0, scope.Ve)(i) && scope.mr[n]) this.needsMeasurement = !0;
            else if (a !== o) {
              if ((0, scope.cr)(a) && (0, scope.cr)(o))
                for (let t = 0; t < e.length; t++) {
                  let n = e[t];
                  typeof n == `string` && (e[t] = parseFloat(n));
                }
              else scope.mr[n] && (this.needsMeasurement = !0);
            }
          }
          resolveNoneKeyframes() {
            let { unresolvedKeyframes: e, name: t } = this,
              n = [];
            for (let t = 0; t < e.length; t++) (e[t] === null || (0, scope.Hi)(e[t])) && n.push(t);
            n.length && (0, scope.Wi)(e, n, t);
          }
          measure() {
            let { element: e, name: t } = this;
            return scope.mr[t](window.getComputedStyle(e.current), () => e.measureViewportBox());
          }
          measureInitialState() {
            let { element: e, unresolvedKeyframes: t, name: n } = this;
            if (!e || !e.current) return;
            (n === `height` && (this.suspendedScrollY = window.pageYOffset),
              (this.measuredOrigin = this.measure()),
              (t[0] = this.measuredOrigin));
            let r = t[t.length - 1];
            r !== void 0 && this.motionValue?.jump(r, !1);
          }
          measureEndState() {
            let { element: e, unresolvedKeyframes: t } = this;
            if (!e || !e.current) return;
            this.motionValue?.jump(this.measuredOrigin, !1);
            let n = t.length - 1,
              r = t[n];
            ((t[n] = this.measure()),
              r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r),
              this.removedTransforms?.length &&
                this.removedTransforms.forEach(([t, n]) => {
                  e.getValue(t).set(n);
                }),
              this.resolveNoneKeyframes());
          }
        };
        break;
      }
      case 173: {
        scope.Ki = [
          `borderTopLeftRadius`,
          `borderTopRightRadius`,
          `borderBottomRightRadius`,
          `borderBottomLeftRadius`,
        ];
        break;
      }
      case 174: {
        scope.Yi = (e, t) => (t && typeof e == `number` ? t.transform(e) : e);
        break;
      }
      case 175: {
        scope.Zi = {
          x: `translateX`,
          y: `translateY`,
          z: `translateZ`,
          transformPerspective: `perspective`,
        };
        break;
      }
      case 176: {
        scope.Qi = scope.or.length;
        break;
      }
      case 177: {
        scope.ta = { offset: `stroke-dashoffset`, array: `stroke-dasharray` };
        break;
      }
      case 178: {
        scope.na = { offset: `strokeDashoffset`, array: `strokeDasharray` };
        break;
      }
      case 179: {
        scope.ia = [
          `transform`,
          `opacity`,
          `offsetDistance`,
          `offsetPath`,
          `offsetRotate`,
          `offsetAnchor`,
        ];
        break;
      }
      case 180: {
        scope.va = 0.999999999999;
        break;
      }
      case 181: {
        scope.ya = 1.0000000000001;
        break;
      }
      case 182: {
        ({ schedule: scope.Da, cancel: scope.Oa } = (0, scope.Yt)(queueMicrotask, !1));
        break;
      }
      case 183: {
        scope.ka = { x: !1, y: !1 };
        break;
      }
      case 184: {
        scope.Fa = (e, t) => (t ? e === t || (0, scope.Fa)(e, t.parentElement) : !1);
        break;
      }
      case 185: {
        scope.Ia = (e) =>
          e.pointerType === `mouse`
            ? typeof e.button != `number` || e.button <= 0
            : e.isPrimary !== !1;
        break;
      }
      case 186: {
        scope.La = new Set([`BUTTON`, `INPUT`, `SELECT`, `TEXTAREA`, `A`]);
        break;
      }
      case 187: {
        scope.za = new Set([`INPUT`, `SELECT`, `TEXTAREA`]);
        break;
      }
      case 188: {
        scope.Va = new WeakSet();
        break;
      }
      case 189: {
        scope.Wa = (e, t) => {
          let n = e.currentTarget;
          if (!n) return;
          let r = (0, scope.Ha)(() => {
            if (scope.Va.has(n)) return;
            (0, scope.Ua)(n, `down`);
            let e = (0, scope.Ha)(() => {
              (0, scope.Ua)(n, `up`);
            });
            (n.addEventListener(`keyup`, e, t),
              n.addEventListener(`blur`, () => (0, scope.Ua)(n, `cancel`), t));
          });
          (n.addEventListener(`keydown`, r, t),
            n.addEventListener(`blur`, () => n.removeEventListener(`keydown`, r), t));
        };
        break;
      }
      case 190: {
        scope.Ka = new WeakSet();
        break;
      }
      case 191: {
        scope.Ja = new WeakMap();
        break;
      }
      case 192: {
        scope.Xa = (e, t, n) => (r, i) =>
          i && i[0] ? i[0][e + `Size`] : (0, scope.Ji)(r) && `getBBox` in r ? r.getBBox()[t] : r[n];
        break;
      }
      case 193: {
        scope.Za = (0, scope.Xa)(`inline`, `width`, `offsetWidth`);
        break;
      }
      case 194: {
        scope.Qa = (0, scope.Xa)(`block`, `height`, `offsetHeight`);
        break;
      }
      case 195: {
        scope.ro = new Set();
        break;
      }
      case 196: {
        scope.co = { value: null, addProjectionMetrics: null };
        break;
      }
      case 197: {
        scope.uo = (e) => (typeof e == `number` ? e : parseFloat(e));
        break;
      }
      case 198: {
        scope.fo = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 });
        break;
      }
      case 199: {
        scope.po = () => ({ x: (0, scope.fo)(), y: (0, scope.fo)() });
        break;
      }
      case 200: {
        scope.mo = () => ({ min: 0, max: 0 });
        break;
      }
      case 201: {
        scope.J = () => ({ x: (0, scope.mo)(), y: (0, scope.mo)() });
        break;
      }
      case 202: {
        scope.ho = new WeakMap();
        break;
      }
      case 203: {
        scope.vo = [
          `animate`,
          `whileInView`,
          `whileFocus`,
          `whileHover`,
          `whileTap`,
          `whileDrag`,
          `exit`,
        ];
        break;
      }
      case 204: {
        scope.yo = [`initial`, ...scope.vo];
        break;
      }
      case 205: {
        scope.Co = { current: null };
        break;
      }
      case 206: {
        scope.wo = { current: !1 };
        break;
      }
      case 207: {
        scope.To = typeof window < `u`;
        break;
      }
      case 208: {
        scope.Do = [
          `AnimationStart`,
          `AnimationComplete`,
          `Update`,
          `BeforeLayoutMeasure`,
          `LayoutMeasure`,
          `LayoutAnimationStart`,
          `LayoutAnimationComplete`,
        ];
        break;
      }
      case 209: {
        scope.Oo = {};
        break;
      }
      case 210: {
        scope.jo = class {
          scrapeMotionValuesFromProps(e, t, n) {
            return {};
          }
          constructor(
            {
              parent: e,
              props: t,
              presenceContext: n,
              reducedMotionConfig: r,
              skipAnimations: i,
              blockInitialAnimation: a,
              visualState: o,
            },
            s = {},
          ) {
            ((this.current = null),
              (this.children = new Set()),
              (this.isVariantNode = !1),
              (this.isControllingVariants = !1),
              (this.shouldReduceMotion = null),
              (this.shouldSkipAnimations = !1),
              (this.values = new Map()),
              (this.KeyframeResolver = scope.Cr),
              (this.features = {}),
              (this.valueSubscriptions = new Map()),
              (this.prevMotionValues = {}),
              (this.hasBeenMounted = !1),
              (this.events = {}),
              (this.propEventSubscriptions = {}),
              (this.notifyUpdate = () => this.notify(`Update`, this.latestValues)),
              (this.render = () => {
                this.current &&
                  (this.triggerBuild(),
                  this.renderInstance(
                    this.current,
                    this.renderState,
                    this.props.style,
                    this.projection,
                  ));
              }),
              (this.renderScheduledAt = 0),
              (this.scheduleRender = () => {
                let e = scope.V.now();
                this.renderScheduledAt < e &&
                  ((this.renderScheduledAt = e), scope.G.render(this.render, !1, !0));
              }));
            let { latestValues: c, renderState: l } = o;
            ((this.latestValues = c),
              (this.baseTarget = { ...c }),
              (this.initialValues = t.initial ? { ...c } : {}),
              (this.renderState = l),
              (this.parent = e),
              (this.props = t),
              (this.presenceContext = n),
              (this.depth = e ? e.depth + 1 : 0),
              (this.reducedMotionConfig = r),
              (this.skipAnimationsConfig = i),
              (this.options = s),
              (this.blockInitialAnimation = !!a),
              (this.isControllingVariants = (0, scope.bo)(t)),
              (this.isVariantNode = (0, scope.xo)(t)),
              this.isVariantNode && (this.variantChildren = new Set()),
              (this.manuallyAnimateOnMount = !!(e && e.current)));
            let { willChange: u, ...d } = this.scrapeMotionValuesFromProps(t, {}, this);
            for (let e in d) {
              let t = d[e];
              c[e] !== void 0 && (0, scope.q)(t) && t.set(c[e]);
            }
          }
          mount(e) {
            if (this.hasBeenMounted)
              for (let e in this.initialValues)
                (this.values.get(e)?.jump(this.initialValues[e]),
                  (this.latestValues[e] = this.initialValues[e]));
            if (
              ((this.current = e),
              scope.ho.set(e, this),
              this.projection && !this.projection.instance && this.projection.mount(e),
              this.isVariantNode && !this.isControllingVariants)
            ) {
              let e = this;
              do e = e.props.inherit !== !1 && e.parent;
              while (e && !e.isVariantNode);
              if (e) {
                let { variantChildren: t } = e;
                (t.add(this), (this.removeFromVariantTree = () => t.delete(this)));
              }
            }
            (this.values.forEach((e, t) => this.bindToMotionValue(t, e)),
              this.reducedMotionConfig === `never`
                ? (this.shouldReduceMotion = !1)
                : this.reducedMotionConfig === `always`
                  ? (this.shouldReduceMotion = !0)
                  : (scope.wo.current || (0, scope.Eo)(),
                    (this.shouldReduceMotion = scope.Co.current)),
              (this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1),
              this.parent?.addChild(this),
              this.update(this.props, this.presenceContext),
              (this.hasBeenMounted = !0));
          }
          unmount() {
            (this.projection && this.projection.unmount(),
              (0, scope.Xt)(this.notifyUpdate),
              (0, scope.Xt)(this.render),
              this.valueSubscriptions.forEach((e) => e()),
              this.valueSubscriptions.clear(),
              this.removeFromVariantTree && this.removeFromVariantTree(),
              this.parent?.removeChild(this));
            for (let e in this.events) this.events[e].clear();
            for (let e in this.features) {
              let t = this.features[e];
              t && (t.unmount(), (t.isMounted = !1));
            }
            this.current = null;
          }
          addChild(e) {
            (this.children.add(e),
              (this.enteringChildren ??= new Set()),
              this.enteringChildren.add(e));
          }
          removeChild(e) {
            (this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e));
          }
          bindToMotionValue(e, t) {
            if (
              (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(),
              t.accelerate && scope.Kr.has(e) && this.current instanceof HTMLElement)
            ) {
              let { factory: n, keyframes: r, times: i, ease: a, duration: o } = t.accelerate,
                s = new scope.Ir({
                  element: this.current,
                  name: e,
                  keyframes: r,
                  times: i,
                  ease: a,
                  duration: (0, scope.R)(o),
                }),
                c = n(s);
              this.valueSubscriptions.set(e, () => {
                (c(), s.cancel());
              });
              return;
            }
            let n = scope.sr.has(e);
            n && this.onBindTransform && this.onBindTransform();
            let r = t.on(`change`, (t) => {
                ((this.latestValues[e] = t),
                  this.props.onUpdate && scope.G.preRender(this.notifyUpdate),
                  n && this.projection && (this.projection.isTransformDirty = !0),
                  this.scheduleRender());
              }),
              i;
            (typeof window < `u` &&
              window.MotionCheckAppearSync &&
              (i = window.MotionCheckAppearSync(this, e, t)),
              this.valueSubscriptions.set(e, () => {
                (r(), i && i());
              }));
          }
          sortNodePosition(e) {
            return !this.current ||
              !e.current ||
              !this.sortInstanceNodePosition ||
              this.type !== e.type
              ? 0
              : this.sortInstanceNodePosition(this.current, e.current);
          }
          updateFeatures() {
            let e = `animation`;
            for (e in scope.Oo) {
              let t = scope.Oo[e];
              if (!t) continue;
              let { isEnabled: n, Feature: r } = t;
              if (
                (!this.features[e] && r && n(this.props) && (this.features[e] = new r(this)),
                this.features[e])
              ) {
                let t = this.features[e];
                t.isMounted ? t.update() : (t.mount(), (t.isMounted = !0));
              }
            }
          }
          triggerBuild() {
            this.build(this.renderState, this.latestValues, this.props);
          }
          measureViewportBox() {
            return this.current
              ? this.measureInstanceViewportBox(this.current, this.props)
              : (0, scope.J)();
          }
          getStaticValue(e) {
            return this.latestValues[e];
          }
          setStaticValue(e, t) {
            this.latestValues[e] = t;
          }
          update(e, t) {
            ((e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(),
              (this.prevProps = this.props),
              (this.props = e),
              (this.prevPresenceContext = this.presenceContext),
              (this.presenceContext = t));
            for (let t = 0; t < scope.Do.length; t++) {
              let n = scope.Do[t];
              this.propEventSubscriptions[n] &&
                (this.propEventSubscriptions[n](), delete this.propEventSubscriptions[n]);
              let r = e[`on` + n];
              r && (this.propEventSubscriptions[n] = this.on(n, r));
            }
            ((this.prevMotionValues = (0, scope.So)(
              this,
              this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this),
              this.prevMotionValues,
            )),
              this.handleChildMotionValue && this.handleChildMotionValue());
          }
          getProps() {
            return this.props;
          }
          getVariant(e) {
            return this.props.variants ? this.props.variants[e] : void 0;
          }
          getDefaultTransition() {
            return this.props.transition;
          }
          getTransformPagePoint() {
            return this.props.transformPagePoint;
          }
          addValue(e, t) {
            let n = this.values.get(e);
            if (t !== n) {
              (n && this.removeValue(e), this.bindToMotionValue(e, t), this.values.set(e, t));
              let r = t.get();
              r !== void 0 && (this.latestValues[e] = r);
            }
          }
          removeValue(e) {
            this.values.delete(e);
            let t = this.valueSubscriptions.get(e);
            (t && (t(), this.valueSubscriptions.delete(e)),
              delete this.latestValues[e],
              this.removeValueFromRenderState(e, this.renderState));
          }
          hasValue(e) {
            return this.values.has(e);
          }
          getValue(e, t) {
            if (this.props.values && this.props.values[e]) return this.props.values[e];
            let n = this.values.get(e);
            return (
              n === void 0 &&
                t !== void 0 &&
                ((n = (0, scope.ai)(t ?? this.getDefaultValue?.(e), { owner: this })),
                this.addValue(e, n)),
              n
            );
          }
          readValue(e, t) {
            let n =
              this.latestValues[e] !== void 0 || !this.current
                ? this.latestValues[e]
                : (this.getBaseTargetFromProps(this.props, e) ??
                  this.readValueFromInstance(this.current, e, this.options));
            return (
              n != null &&
                (typeof n == `string` && ((0, scope.ae)(n) || (0, scope.I)(n))
                  ? (n = parseFloat(n))
                  : typeof n != `number` &&
                    !scope.Et.test(n) &&
                    scope.Et.test(t) &&
                    (n = (0, scope.Kn)(e, t)),
                this.setBaseTarget(e, (0, scope.q)(n) ? n.get() : n)),
              (0, scope.q)(n) ? n.get() : n
            );
          }
          setBaseTarget(e, t) {
            this.baseTarget[e] = t;
          }
          on(e, t) {
            return (this.events[e] || (this.events[e] = new scope.le()), this.events[e].add(t));
          }
          notify(e, ...t) {
            this.events[e] && this.events[e].notify(...t);
          }
          scheduleRenderMicrotask() {
            scope.Da.render(this.render);
          }
        };
        break;
      }
      case 211: {
        scope.Mo = class extends scope.jo {
          constructor() {
            (super(...arguments), (this.KeyframeResolver = scope.Gi));
          }
          sortInstanceNodePosition(e, t) {
            return e.compareDocumentPosition(t) & 2 ? 1 : -1;
          }
          getBaseTargetFromProps(e, t) {
            let n = e.style;
            return n ? n[t] : void 0;
          }
          removeValueFromRenderState(e, { vars: t, style: n }) {
            (delete t[e], delete n[e]);
          }
          handleChildMotionValue() {
            this.childSubscription && (this.childSubscription(), delete this.childSubscription);
            let { children: e } = this.props;
            (0, scope.q)(e) &&
              (this.childSubscription = e.on(`change`, (e) => {
                this.current && (this.current.textContent = `${e}`);
              }));
          }
        };
        break;
      }
      case 212: {
        scope.No = class {
          constructor(e) {
            ((this.isMounted = !1), (this.node = e));
          }
          update() {}
        };
        break;
      }
      case 213: {
        scope.Fo = {};
        break;
      }
      case 214: {
        scope.zo = class extends scope.Mo {
          constructor() {
            (super(...arguments), (this.type = `html`), (this.renderInstance = scope.Po));
          }
          mount(e) {
            (e.style, super.mount(e));
          }
          readValueFromInstance(e, t) {
            if (scope.sr.has(t))
              return this.projection?.isProjecting ? (0, scope.nr)(t) : (0, scope.ir)(e, t);
            {
              let n = (0, scope.Ro)(e),
                r = ((0, scope.Le)(t) ? n.getPropertyValue(t) : n[t]) || 0;
              return typeof r == `string` ? r.trim() : r;
            }
          }
          measureInstanceViewportBox(e, { transformPagePoint: t }) {
            return (0, scope.Ta)(e, t);
          }
          build(e, t, n) {
            (0, scope.ea)(e, t, n.transformTemplate);
          }
          scrapeMotionValuesFromProps(e, t, n) {
            return (0, scope.Lo)(e, t, n);
          }
        };
        break;
      }
      case 215: {
        scope.Bo = new Set([
          `baseFrequency`,
          `diffuseConstant`,
          `kernelMatrix`,
          `kernelUnitLength`,
          `keySplines`,
          `keyTimes`,
          `limitingConeAngle`,
          `markerHeight`,
          `markerWidth`,
          `numOctaves`,
          `targetX`,
          `targetY`,
          `surfaceScale`,
          `specularConstant`,
          `specularExponent`,
          `stdDeviation`,
          `tableValues`,
          `viewBox`,
          `gradientTransform`,
          `pathLength`,
          `startOffset`,
          `textLength`,
          `lengthAdjust`,
        ]);
        break;
      }
      case 216: {
        scope.Vo = (e) => typeof e == `string` && e.toLowerCase() === `svg`;
        break;
      }
      case 217: {
        scope.Wo = class extends scope.Mo {
          constructor() {
            (super(...arguments),
              (this.type = `svg`),
              (this.isSVGTag = !1),
              (this.measureInstanceViewportBox = scope.J));
          }
          getBaseTargetFromProps(e, t) {
            return scope.sr.has(t)
              ? (super.getBaseTargetFromProps(e, t) ?? (0, scope.nr)(t))
              : e[t];
          }
          getDefaultValue(e) {
            return scope.sr.has(e) ? (this.latestValues[e] ?? (0, scope.nr)(e)) : void 0;
          }
          readValueFromInstance(e, t) {
            if (scope.sr.has(t)) {
              let e = (0, scope.Wn)(t);
              return (e && e.default) || 0;
            }
            if (scope.ia.includes(t)) {
              let n = getComputedStyle(e)[t];
              if (typeof n == `string` && n) return n.trim();
            }
            return ((t = scope.Bo.has(t) ? t : (0, scope.Ai)(t)), e.getAttribute(t));
          }
          scrapeMotionValuesFromProps(e, t, n) {
            return (0, scope.Uo)(e, t, n);
          }
          build(e, t, n) {
            (0, scope.aa)(e, t, this.isSVGTag, n.transformTemplate, n.style);
          }
          renderInstance(e, t, n, r) {
            (0, scope.Ho)(e, t, n, r);
          }
          mount(e) {
            ((this.isSVGTag = (0, scope.Vo)(e.tagName)), super.mount(e));
          }
        };
        break;
      }
      case 218: {
        scope.Ko = [...scope.vo].reverse();
        break;
      }
      case 219: {
        scope.$o = 0.9999;
        break;
      }
      case 220: {
        scope.es = 1.0001;
        break;
      }
      case 221: {
        scope.ts = -0.01;
        break;
      }
      case 222: {
        scope.ns = 0.01;
        break;
      }
      case 223: {
        scope.ms = [`x`, `scaleX`, `originX`];
        break;
      }
      case 224: {
        scope.hs = [`y`, `scaleY`, `originY`];
        break;
      }
      case 225: {
        scope.Ds = {
          correct: (e, t) => {
            if (!t.target) return e;
            if (typeof e == `string`) {
              if (scope.H.test(e)) e = parseFloat(e);
              else return e;
            }
            return `${(0, scope.Es)(e, t.target.x)}% ${(0, scope.Es)(e, t.target.y)}%`;
          },
        };
        break;
      }
      case 226: {
        scope.Os = {
          correct: (e, { treeScale: t, projectionDelta: n }) => {
            let r = e,
              i = scope.Et.parse(e);
            if (i.length > 5) return r;
            let a = scope.Et.createTransformer(e),
              o = typeof i[0] == `number` ? 0 : 1,
              s = n.x.scale * t.x,
              c = n.y.scale * t.y;
            ((i[0 + o] /= s), (i[1 + o] /= c));
            let l = (0, scope.W)(s, c, 0.5);
            return (
              typeof i[2 + o] == `number` && (i[2 + o] /= l),
              typeof i[3 + o] == `number` && (i[3 + o] /= l),
              a(i)
            );
          },
        };
        break;
      }
      case 227: {
        scope.As = scope.Ki.length;
        break;
      }
      case 228: {
        scope.js = (e) => typeof e == `number` || scope.H.test(e);
        break;
      }
      case 229: {
        scope.Ps = (0, scope.Is)(0, 0.5, scope.Ce);
        break;
      }
      case 230: {
        scope.Fs = (0, scope.Is)(0.5, 0.95, scope.se);
        break;
      }
      case 231: {
        scope.zs = (e, t) => e.depth - t.depth;
        break;
      }
      case 232: {
        scope.Bs = class {
          constructor() {
            ((this.children = []), (this.isDirty = !1));
          }
          add(e) {
            ((0, scope.P)(this.children, e), (this.isDirty = !0));
          }
          remove(e) {
            ((0, scope.ne)(this.children, e), (this.isDirty = !0));
          }
          forEach(e) {
            (this.isDirty && this.children.sort(scope.zs),
              (this.isDirty = !1),
              this.children.forEach(e));
          }
        };
        break;
      }
      case 233: {
        scope.Us = class {
          constructor() {
            this.members = [];
          }
          add(e) {
            (0, scope.P)(this.members, e);
            for (let t = this.members.length - 1; t >= 0; t--) {
              let n = this.members[t];
              if (n === e || n === this.lead || n === this.prevLead) continue;
              let r = n.instance;
              (!r || r.isConnected === !1) &&
                !n.snapshot &&
                ((0, scope.ne)(this.members, n), n.unmount());
            }
            e.scheduleRender();
          }
          remove(e) {
            if (
              ((0, scope.ne)(this.members, e),
              e === this.prevLead && (this.prevLead = void 0),
              e === this.lead)
            ) {
              let e = this.members[this.members.length - 1];
              e && this.promote(e);
            }
          }
          relegate(e) {
            for (let t = this.members.indexOf(e) - 1; t >= 0; t--) {
              let e = this.members[t];
              if (e.isPresent !== !1 && e.instance?.isConnected !== !1)
                return (this.promote(e), !0);
            }
            return !1;
          }
          promote(e, t) {
            let n = this.lead;
            if (e !== n && ((this.prevLead = n), (this.lead = e), e.show(), n)) {
              (n.updateSnapshot(), e.scheduleRender());
              let { layoutDependency: r } = n.options,
                { layoutDependency: i } = e.options;
              ((r === void 0 || r !== i) &&
                ((e.resumeFrom = n),
                t && (n.preserveOpacity = !0),
                n.snapshot &&
                  ((e.snapshot = n.snapshot),
                  (e.snapshot.latestValues = n.animationValues || n.latestValues)),
                e.root?.isUpdating && (e.isLayoutDirty = !0)),
                e.options.crossfade === !1 && n.hide());
            }
          }
          exitAnimationComplete() {
            this.members.forEach((e) => {
              (e.options.onExitComplete?.(), e.resumingFrom?.options.onExitComplete?.());
            });
          }
          scheduleRender() {
            this.members.forEach((e) => e.instance && e.scheduleRender(!1));
          }
          removeLeadSnapshot() {
            this.lead?.snapshot && (this.lead.snapshot = void 0);
          }
        };
        break;
      }
      case 234: {
        scope.Ws = {
          borderRadius: { ...scope.Ds, applyTo: [...scope.Ki] },
          borderTopLeftRadius: scope.Ds,
          borderTopRightRadius: scope.Ds,
          borderBottomLeftRadius: scope.Ds,
          borderBottomRightRadius: scope.Ds,
          boxShadow: scope.Os,
        };
        break;
      }
      case 235: {
        scope.Gs = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 };
        break;
      }
      case 236: {
        Object.assign(scope.Fo, { ...scope.Ws, ...scope.Fo });
        break;
      }
      case 237: {
        scope.Ks = { nodes: 0, calculatedTargetDeltas: 0, calculatedProjections: 0 };
        break;
      }
      case 238: {
        scope.qs = [``, `X`, `Y`, `Z`];
        break;
      }
      case 239: {
        scope.Js = 1e3;
        break;
      }
      case 240: {
        scope.Ys = 0;
        break;
      }
      case 241: {
        scope.yc = { duration: 0.45, ease: [0.4, 0, 0.1, 1] };
        break;
      }
      case 242: {
        scope.bc = (e) =>
          typeof navigator < `u` &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().includes(e);
        break;
      }
      case 243: {
        scope.xc =
          (0, scope.bc)(`applewebkit/`) && !(0, scope.bc)(`chrome/`) ? Math.round : scope.se;
        break;
      }
      case 244: {
        scope.Ec = (0, scope.Qs)({
          attachResizeListener: (e, t) => (0, scope.Rs)(e, `resize`, t),
          measureScroll: () => ({
            x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
            y: document.documentElement.scrollTop || document.body?.scrollTop || 0,
          }),
          checkIsScrollRoot: () => !0,
        });
        break;
      }
      case 245: {
        scope.Dc = { current: void 0 };
        break;
      }
      case 246: {
        scope.Oc = (0, scope.Qs)({
          measureScroll: (e) => ({ x: e.scrollLeft, y: e.scrollTop }),
          defaultParent: () => {
            if (!scope.Dc.current) {
              let e = new scope.Ec({});
              (e.mount(window), e.setOptions({ layoutScroll: !0 }), (scope.Dc.current = e));
            }
            return scope.Dc.current;
          },
          resetTransform: (e, t) => {
            e.style.transform = t === void 0 ? `none` : t;
          },
          checkIsScrollRoot: (e) => window.getComputedStyle(e).position === `fixed`,
        });
        break;
      }
      case 247: {
        scope.kc = (0, scope.k.createContext)({
          transformPagePoint: (e) => e,
          isStatic: !1,
          reducedMotion: `never`,
        });
        break;
      }
      case 248: {
        scope.Nc = class extends scope.k.Component {
          getSnapshotBeforeUpdate(e) {
            let t = this.props.childRef.current;
            if ((0, scope.qi)(t) && e.isPresent && !this.props.isPresent && this.props.pop !== !1) {
              let e = t.offsetParent,
                n = ((0, scope.qi)(e) && e.offsetWidth) || 0,
                r = ((0, scope.qi)(e) && e.offsetHeight) || 0,
                i = getComputedStyle(t),
                a = this.props.sizeRef.current;
              ((a.height = parseFloat(i.height)),
                (a.width = parseFloat(i.width)),
                (a.top = t.offsetTop),
                (a.left = t.offsetLeft),
                (a.right = n - a.width - a.left),
                (a.bottom = r - a.height - a.top),
                (a.direction = i.direction));
            }
            return null;
          }
          componentDidUpdate() {}
          render() {
            return this.props.children;
          }
        };
        break;
      }
      case 249: {
        scope.Fc = ({
          children: e,
          initial: t,
          isPresent: n,
          onExitComplete: r,
          custom: i,
          presenceAffectsLayout: a,
          mode: o,
          anchorX: s,
          anchorY: c,
          root: l,
        }) => {
          let u = (0, scope.j)(scope.Ic),
            d = (0, scope.k.useId)(),
            f = (0, scope.k.useRef)(n),
            p = (0, scope.k.useRef)(r);
          (0, scope.M)(() => {
            ((f.current = n), (p.current = r));
          });
          let m = !0,
            h = (0, scope.k.useMemo)(
              () => (
                (m = !1),
                {
                  id: d,
                  initial: t,
                  isPresent: n,
                  custom: i,
                  onExitComplete: (e) => {
                    u.set(e, !0);
                    for (let e of u.values()) if (!e) return;
                    r && r();
                  },
                  register: (e) => (
                    u.set(e, !1),
                    () => {
                      (u.delete(e), !f.current && !u.size && p.current?.());
                    }
                  ),
                }
              ),
              [n, u, r],
            );
          return (
            a && m && (h = { ...h }),
            (0, scope.k.useMemo)(() => {
              u.forEach((e, t) => u.set(t, !1));
            }, [n]),
            scope.k.useEffect(() => {
              !n && !u.size && r && r();
            }, [n]),
            (e = (0, scope.O.jsx)(scope.Pc, {
              pop: o === `popLayout`,
              isPresent: n,
              anchorX: s,
              anchorY: c,
              root: l,
              children: e,
            })),
            (0, scope.O.jsx)(scope.N.Provider, { value: h, children: e })
          );
        };
        break;
      }
      case 250: {
        scope.Rc = (e) => e.key || ``;
        break;
      }
      case 251: {
        scope.Bc = ({
          children: e,
          custom: t,
          initial: n = !0,
          onExitComplete: r,
          presenceAffectsLayout: i = !0,
          mode: a = `sync`,
          propagate: o = !1,
          anchorX: s = `left`,
          anchorY: c = `top`,
          root: l,
        }) => {
          let [u, d] = (0, scope.Lc)(o),
            f = (0, scope.k.useMemo)(() => (0, scope.zc)(e), [e]),
            p = o && !u ? [] : f.map(scope.Rc),
            m = (0, scope.k.useRef)(!0),
            h = (0, scope.j)(() => new Map()),
            g = (0, scope.k.useRef)(new Set()),
            [_, v] = (0, scope.k.useState)(f),
            [y, b] = (0, scope.k.useState)(f);
          ((0, scope.M)(() => {
            o && !u && !y.length && d?.();
          }, [u, o, y.length, d]),
            (0, scope.M)(() => {
              m.current = !1;
              for (let e = 0; e < y.length; e++) {
                let t = (0, scope.Rc)(y[e]);
                p.includes(t)
                  ? (h.delete(t), g.current.delete(t))
                  : h.get(t) !== !0 && h.set(t, !1);
              }
            }, [y, p.length, p.join(`-`)]));
          let x = [];
          if (f !== _) {
            let e = [...f],
              t = 0;
            for (let n of y) {
              let r = p.indexOf((0, scope.Rc)(n));
              r === -1 ? (e.splice(t++, 0, n), x.push(n)) : (t = r + x.length + 1);
            }
            return (
              x.every((e) => h.get((0, scope.Rc)(e))) ? (e = f) : a === `wait` && (e = x),
              b((0, scope.zc)(e)),
              v(f),
              null
            );
          }
          let { forceRender: S } = (0, scope.k.useContext)(scope.A);
          return (0, scope.O.jsx)(scope.O.Fragment, {
            children: y.map((e) => {
              let _ = (0, scope.Rc)(e),
                b = o && !u ? !1 : f === y || p.includes(_);
              return (0, scope.O.jsx)(
                scope.Fc,
                {
                  isPresent: b,
                  initial: !m.current || n ? void 0 : !1,
                  custom: t,
                  presenceAffectsLayout: i,
                  mode: a,
                  root: l,
                  onExitComplete: b
                    ? void 0
                    : () => {
                        if (g.current.has(_)) return;
                        if (h.has(_)) (g.current.add(_), h.set(_, !0));
                        else return;
                        let e = !0;
                        (h.forEach((t) => {
                          t || (e = !1);
                        }),
                          e && (S?.(), v([]), o && d?.(), r && r()));
                      },
                  anchorX: s,
                  anchorY: c,
                  children: e,
                },
                _,
              );
            }),
          });
        };
        break;
      }
      case 252: {
        scope.Vc = (0, scope.k.createContext)({ strict: !1 });
        break;
      }
      case 253: {
        scope.Hc = {
          animation: [
            `animate`,
            `variants`,
            `whileHover`,
            `whileTap`,
            `exit`,
            `whileInView`,
            `whileFocus`,
            `whileDrag`,
          ],
          exit: [`exit`],
          drag: [`drag`, `dragControls`],
          focus: [`whileFocus`],
          hover: [`whileHover`, `onHoverStart`, `onHoverEnd`],
          tap: [`whileTap`, `onTap`, `onTapStart`, `onTapCancel`],
          pan: [`onPan`, `onPanStart`, `onPanSessionStart`, `onPanEnd`],
          inView: [`whileInView`, `onViewportEnter`, `onViewportLeave`],
          layout: [`layout`, `layoutId`],
        };
        break;
      }
      case 254: {
        scope.Uc = !1;
        break;
      }
      case 255: {
        scope.qc = (0, scope.k.createContext)({});
        break;
      }
      case 256: {
        scope.Zc = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} });
        break;
      }
      case 257: {
        scope.nl = () => ({ ...(0, scope.Zc)(), attrs: {} });
        break;
      }
      case 258: {
        scope.il = new Set(
          `animate.exit.variants.initial.style.values.transition.transformTemplate.custom.inherit.onBeforeLayoutMeasure.onAnimationStart.onAnimationComplete.onUpdate.onDragStart.onDrag.onDragEnd.onMeasureDragConstraints.onDirectionLock.onDragTransitionEnd._dragX._dragY.onHoverStart.onHoverEnd.onViewportEnter.onViewportLeave.globalTapTarget.propagate.ignoreStrict.viewport`.split(
            `.`,
          ),
        );
        break;
      }
      case 259: {
        scope.cl = [
          `animate`,
          `circle`,
          `defs`,
          `desc`,
          `ellipse`,
          `g`,
          `image`,
          `line`,
          `filter`,
          `marker`,
          `mask`,
          `metadata`,
          `path`,
          `pattern`,
          `polygon`,
          `polyline`,
          `rect`,
          `stop`,
          `switch`,
          `symbol`,
          `svg`,
          `text`,
          `tspan`,
          `use`,
          `view`,
        ];
        break;
      }
      case 260: {
        scope.pl = (e) => (t, n) => {
          let r = (0, scope.k.useContext)(scope.qc),
            i = (0, scope.k.useContext)(scope.N),
            a = () => (0, scope.dl)(e, t, r, i);
          return n ? a() : (0, scope.j)(a);
        };
        break;
      }
      case 261: {
        scope.ml = (0, scope.pl)({
          scrapeMotionValuesFromProps: scope.Lo,
          createRenderState: scope.Zc,
        });
        break;
      }
      case 262: {
        scope.hl = (0, scope.pl)({
          scrapeMotionValuesFromProps: scope.Uo,
          createRenderState: scope.nl,
        });
        break;
      }
      case 263: {
        scope.gl = Symbol.for(`motionComponentSymbol`);
        break;
      }
      case 264: {
        scope.vl = (0, scope.k.createContext)({});
        break;
      }
      case 265: {
        scope.Ol = (e, t) =>
          (t.isSVG ?? (0, scope.ll)(e))
            ? new scope.Wo(t)
            : new scope.zo(t, { allowProjection: e !== scope.k.Fragment });
        break;
      }
      case 266: {
        scope.kl = class extends scope.No {
          constructor(e) {
            (super(e), (e.animationState ||= (0, scope.qo)(e)));
          }
          updateAnimationControlsSubscription() {
            let { animate: e } = this.node.getProps();
            (0, scope.go)(e) && (this.unmountControls = e.subscribe(this.node));
          }
          mount() {
            this.updateAnimationControlsSubscription();
          }
          update() {
            let { animate: e } = this.node.getProps(),
              { animate: t } = this.node.prevProps || {};
            e !== t && this.updateAnimationControlsSubscription();
          }
          unmount() {
            (this.node.animationState.reset(), this.unmountControls?.());
          }
        };
        break;
      }
      case 267: {
        scope.Al = 0;
        break;
      }
      case 268: {
        scope.jl = {
          animation: { Feature: scope.kl },
          exit: {
            Feature: class extends scope.No {
              constructor() {
                (super(...arguments), (this.id = scope.Al++));
              }
              update() {
                let { presenceContext: e, prevPresenceContext: t, animationState: n } = this.node;
                if (!e || !n) return;
                let { isPresent: r, onExitComplete: i } = e,
                  a = t?.isPresent;
                if (r === a) return;
                if (r && a === !1) {
                  if (this.exit === !0) {
                    let { initial: e } = this.node.getProps();
                    if (e && !Array.isArray(e)) {
                      let {
                        transition: t,
                        transitionEnd: n,
                        ...r
                      } = (0, scope.xi)(this.node, e) || {};
                      for (let e in r) this.node.getValue(e)?.jump(r[e]);
                    }
                    ((this.node.blockInitialAnimation = !1), n.reset(), n.animateChanges());
                  } else n.setActive(`exit`, !1);
                  this.exit = void 0;
                  return;
                }
                let o = (this.exit = n.setActive(`exit`, !r));
                i &&
                  !r &&
                  o.then(() => {
                    this.exit === o && ((this.exit = !0), i(this.id));
                  });
              }
              mount() {
                let { register: e, onExitComplete: t } = this.node.presenceContext || {};
                (t && t(this.id), e && (this.unmount = e(this.id)));
              }
              unmount() {}
            },
          },
        };
        break;
      }
      case 269: {
        scope.Nl = (e) => (t) => (0, scope.Ia)(t) && e(t, (0, scope.Ml)(t));
        break;
      }
      case 270: {
        scope.Fl = ({ current: e }) => (e ? e.ownerDocument.defaultView : null);
        break;
      }
      case 271: {
        scope.Il = (e, t) => Math.abs(e - t);
        break;
      }
      case 272: {
        scope.Rl = new Set([`auto`, `scroll`]);
        break;
      }
      case 273: {
        scope.zl = class {
          constructor(
            e,
            t,
            {
              transformPagePoint: n,
              contextWindow: r = window,
              dragSnapToOrigin: i = !1,
              distanceThreshold: a = 3,
              element: o,
            } = {},
          ) {
            if (
              ((this.startEvent = null),
              (this.lastMoveEvent = null),
              (this.lastMoveEventInfo = null),
              (this.lastRawMoveEventInfo = null),
              (this.handlers = {}),
              (this.contextWindow = window),
              (this.scrollPositions = new Map()),
              (this.removeScrollListeners = null),
              (this.onElementScroll = (e) => {
                this.handleScroll(e.target);
              }),
              (this.onWindowScroll = () => {
                this.handleScroll(window);
              }),
              (this.updatePoint = () => {
                if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
                ((this.hasPendingMove = !1),
                  this.lastRawMoveEventInfo &&
                    (this.lastMoveEventInfo = (0, scope.Bl)(
                      this.lastRawMoveEventInfo,
                      this.transformPagePoint,
                    )));
                let e = (0, scope.Hl)(this.lastMoveEventInfo, this.history),
                  t = this.startEvent !== null,
                  n = (0, scope.Ll)(e.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
                if (!t && !n) return;
                let { point: r } = e;
                this.history.push({ ...r, timestamp: scope.V.now() });
                let { onStart: i, onMove: a } = this.handlers;
                (t || (i && i(this.lastMoveEvent, e), (this.startEvent = this.lastMoveEvent)),
                  a && a(this.lastMoveEvent, e));
              }),
              (this.handlePointerMove = (e, t) => {
                ((this.lastMoveEvent = e),
                  (this.lastRawMoveEventInfo = t),
                  (this.lastMoveEventInfo = (0, scope.Bl)(t, this.transformPagePoint)),
                  (this.hasPendingMove = !0),
                  scope.G.update(this.updatePoint, !0));
              }),
              (this.handlePointerUp = (e, t) => {
                (this.hasPendingMove && this.updatePoint(), this.end());
                let { onEnd: n, onSessionEnd: r, resumeAnimation: i } = this.handlers;
                if (
                  ((this.dragSnapToOrigin || !this.startEvent) && i && i(),
                  !(this.lastMoveEvent && this.lastMoveEventInfo))
                )
                  return;
                let a = (0, scope.Hl)(
                  e.type === `pointercancel`
                    ? this.lastMoveEventInfo
                    : (0, scope.Bl)(t, this.transformPagePoint),
                  this.history,
                );
                (this.startEvent && n && n(e, a), r && r(e, a));
              }),
              !(0, scope.Ia)(e))
            )
              return;
            ((this.dragSnapToOrigin = i),
              (this.handlers = t),
              (this.transformPagePoint = n),
              (this.distanceThreshold = a),
              (this.contextWindow = r || window));
            let s = (0, scope.Bl)((0, scope.Ml)(e), this.transformPagePoint),
              { point: c } = s,
              { timestamp: l } = scope.B;
            this.history = [{ ...c, timestamp: l }];
            let { onSessionStart: u } = t;
            u && u(e, (0, scope.Hl)(s, this.history));
            let d = { passive: !0, capture: !0 };
            ((this.removeListeners = (0, scope.L)(
              (0, scope.Pl)(this.contextWindow, `pointermove`, this.handlePointerMove, d),
              (0, scope.Pl)(this.contextWindow, `pointerup`, this.handlePointerUp, d),
              (0, scope.Pl)(this.contextWindow, `pointercancel`, this.handlePointerUp, d),
            )),
              o && this.startScrollTracking(o));
          }
          startScrollTracking(e) {
            let t = e.parentElement;
            for (; t;) {
              let e = getComputedStyle(t);
              ((scope.Rl.has(e.overflowX) || scope.Rl.has(e.overflowY)) &&
                this.scrollPositions.set(t, { x: t.scrollLeft, y: t.scrollTop }),
                (t = t.parentElement));
            }
            (this.scrollPositions.set(window, { x: window.scrollX, y: window.scrollY }),
              window.addEventListener(`scroll`, this.onElementScroll, { capture: !0 }),
              window.addEventListener(`scroll`, this.onWindowScroll),
              (this.removeScrollListeners = () => {
                (window.removeEventListener(`scroll`, this.onElementScroll, { capture: !0 }),
                  window.removeEventListener(`scroll`, this.onWindowScroll));
              }));
          }
          handleScroll(e) {
            let t = this.scrollPositions.get(e);
            if (!t) return;
            let n = e === window,
              r = n
                ? { x: window.scrollX, y: window.scrollY }
                : { x: e.scrollLeft, y: e.scrollTop },
              i = { x: r.x - t.x, y: r.y - t.y };
            (i.x !== 0 || i.y !== 0) &&
              (n
                ? this.lastMoveEventInfo &&
                  ((this.lastMoveEventInfo.point.x += i.x), (this.lastMoveEventInfo.point.y += i.y))
                : this.history.length > 0 &&
                  ((this.history[0].x -= i.x), (this.history[0].y -= i.y)),
              this.scrollPositions.set(e, r),
              scope.G.update(this.updatePoint, !0));
          }
          updateHandlers(e) {
            this.handlers = e;
          }
          end() {
            (this.removeListeners && this.removeListeners(),
              this.removeScrollListeners && this.removeScrollListeners(),
              this.scrollPositions.clear(),
              (0, scope.Xt)(this.updatePoint));
          }
        };
        break;
      }
      case 274: {
        scope.$l = 0.35;
        break;
      }
      case 275: {
        scope.ru = new WeakMap();
        break;
      }
      case 276: {
        scope.iu = class {
          constructor(e) {
            ((this.openDragLock = null),
              (this.isDragging = !1),
              (this.currentDirection = null),
              (this.originPoint = { x: 0, y: 0 }),
              (this.constraints = !1),
              (this.hasMutatedConstraints = !1),
              (this.elastic = (0, scope.J)()),
              (this.latestPointerEvent = null),
              (this.latestPanInfo = null),
              (this.visualElement = e));
          }
          start(e, { snapToCursor: t = !1, distanceThreshold: n } = {}) {
            let { presenceContext: r } = this.visualElement;
            if (r && r.isPresent === !1) return;
            let i = (e) => {
                (t && this.snapToCursor(e), this.stopAnimation());
              },
              a = (e, t) => {
                let { drag: n, dragPropagation: r, onDragStart: i } = this.getProps();
                if (
                  n &&
                  !r &&
                  (this.openDragLock && this.openDragLock(),
                  (this.openDragLock = (0, scope.ja)(n)),
                  !this.openDragLock)
                )
                  return;
                ((this.latestPointerEvent = e),
                  (this.latestPanInfo = t),
                  (this.isDragging = !0),
                  (this.currentDirection = null),
                  this.resolveConstraints(),
                  this.visualElement.projection &&
                    ((this.visualElement.projection.isAnimationBlocked = !0),
                    (this.visualElement.projection.target = void 0)),
                  (0, scope.Ts)((e) => {
                    let t = this.getAxisMotionValue(e).get() || 0;
                    if (scope.rt.test(t)) {
                      let { projection: n } = this.visualElement;
                      if (n && n.layout) {
                        let r = n.layout.layoutBox[e];
                        r && (t = (0, scope.rs)(r) * (parseFloat(t) / 100));
                      }
                    }
                    this.originPoint[e] = t;
                  }),
                  i && scope.G.update(() => i(e, t), !1, !0),
                  (0, scope.ki)(this.visualElement, `transform`));
                let { animationState: a } = this.visualElement;
                a && a.setActive(`whileDrag`, !0);
              },
              o = (e, t) => {
                ((this.latestPointerEvent = e), (this.latestPanInfo = t));
                let {
                  dragPropagation: n,
                  dragDirectionLock: r,
                  onDirectionLock: i,
                  onDrag: a,
                } = this.getProps();
                if (!n && !this.openDragLock) return;
                let { offset: o } = t;
                r && this.currentDirection === null
                  ? ((this.currentDirection = (0, scope.cu)(o)),
                    this.currentDirection !== null && i && i(this.currentDirection))
                  : (this.updateAxis(`x`, t.point, o),
                    this.updateAxis(`y`, t.point, o),
                    this.visualElement.render(),
                    a && scope.G.update(() => a(e, t), !1, !0));
              },
              s = (e, t) => {
                ((this.latestPointerEvent = e),
                  (this.latestPanInfo = t),
                  this.stop(e, t),
                  (this.latestPointerEvent = null),
                  (this.latestPanInfo = null));
              },
              c = () => {
                let { dragSnapToOrigin: e } = this.getProps();
                (e || this.constraints) && this.startAnimation({ x: 0, y: 0 });
              },
              { dragSnapToOrigin: l } = this.getProps();
            this.panSession = new scope.zl(
              e,
              { onSessionStart: i, onStart: a, onMove: o, onSessionEnd: s, resumeAnimation: c },
              {
                transformPagePoint: this.visualElement.getTransformPagePoint(),
                dragSnapToOrigin: l,
                distanceThreshold: n,
                contextWindow: (0, scope.Fl)(this.visualElement),
                element: this.visualElement.current,
              },
            );
          }
          stop(e, t) {
            let n = e || this.latestPointerEvent,
              r = t || this.latestPanInfo,
              i = this.isDragging;
            if ((this.cancel(), !i || !r || !n)) return;
            let { velocity: a } = r;
            this.startAnimation(a);
            let { onDragEnd: o } = this.getProps();
            o && scope.G.postRender(() => o(n, r));
          }
          cancel() {
            this.isDragging = !1;
            let { projection: e, animationState: t } = this.visualElement;
            (e && (e.isAnimationBlocked = !1), this.endPanSession());
            let { dragPropagation: n } = this.getProps();
            (!n && this.openDragLock && (this.openDragLock(), (this.openDragLock = null)),
              t && t.setActive(`whileDrag`, !1));
          }
          endPanSession() {
            (this.panSession && this.panSession.end(), (this.panSession = void 0));
          }
          updateAxis(e, t, n) {
            let { drag: r } = this.getProps();
            if (!n || !(0, scope.su)(e, r, this.currentDirection)) return;
            let i = this.getAxisMotionValue(e),
              a = this.originPoint[e] + n[e];
            (this.constraints &&
              this.constraints[e] &&
              (a = (0, scope.Kl)(a, this.constraints[e], this.elastic[e])),
              i.set(a));
          }
          resolveConstraints() {
            let { dragConstraints: e, dragElastic: t } = this.getProps(),
              n =
                this.visualElement.projection && !this.visualElement.projection.layout
                  ? this.visualElement.projection.measure(!1)
                  : this.visualElement.projection?.layout,
              r = this.constraints;
            (e && (0, scope.yl)(e)
              ? (this.constraints ||= this.resolveRefConstraints())
              : (this.constraints = e && n ? (0, scope.Jl)(n.layoutBox, e) : !1),
              (this.elastic = (0, scope.eu)(t)),
              r !== this.constraints &&
                !(0, scope.yl)(e) &&
                n &&
                this.constraints &&
                !this.hasMutatedConstraints &&
                (0, scope.Ts)((e) => {
                  this.constraints !== !1 &&
                    this.getAxisMotionValue(e) &&
                    (this.constraints[e] = (0, scope.Ql)(n.layoutBox[e], this.constraints[e]));
                }));
          }
          resolveRefConstraints() {
            let { dragConstraints: e, onMeasureDragConstraints: t } = this.getProps();
            if (!e || !(0, scope.yl)(e)) return !1;
            let n = e.current,
              { projection: r } = this.visualElement;
            if (!r || !r.layout) return !1;
            r.root && ((r.root.scroll = void 0), r.root.updateScroll());
            let i = (0, scope.Ea)(n, r.root, this.visualElement.getTransformPagePoint()),
              a = (0, scope.Xl)(r.layout.layoutBox, i);
            if (t) {
              let e = t((0, scope.sa)(a));
              ((this.hasMutatedConstraints = !!e), e && (a = (0, scope.oa)(e)));
            }
            return a;
          }
          startAnimation(e) {
            let {
                drag: t,
                dragMomentum: n,
                dragElastic: r,
                dragTransition: i,
                dragSnapToOrigin: a,
                onDragTransitionEnd: o,
              } = this.getProps(),
              s = this.constraints || {},
              c = (0, scope.Ts)((o) => {
                if (!(0, scope.su)(o, t, this.currentDirection)) return;
                let c = (s && s[o]) || {};
                (a === !0 || a === o) && (c = { min: 0, max: 0 });
                let l = r ? 200 : 1e6,
                  u = r ? 40 : 1e7,
                  d = {
                    type: `inertia`,
                    velocity: n ? e[o] : 0,
                    bounceStiffness: l,
                    bounceDamping: u,
                    timeConstant: 750,
                    restDelta: 1,
                    restSpeed: 10,
                    ...i,
                    ...c,
                  };
                return this.startAxisValueAnimation(o, d);
              });
            return Promise.all(c).then(o);
          }
          startAxisValueAnimation(e, t) {
            let n = this.getAxisMotionValue(e);
            return (
              (0, scope.ki)(this.visualElement, e),
              n.start((0, scope.hi)(e, n, 0, t, this.visualElement, !1))
            );
          }
          stopAnimation() {
            (0, scope.Ts)((e) => this.getAxisMotionValue(e).stop());
          }
          getAxisMotionValue(e) {
            let t = `_drag${e.toUpperCase()}`;
            return (
              this.visualElement.getProps()[t] ||
              this.visualElement.getValue(e, this.visualElement.latestValues[e] ?? 0)
            );
          }
          snapToCursor({ clientX: e, clientY: t }) {
            let { drag: n } = this.getProps(),
              r = { x: e, y: t },
              i = this.visualElement.getTransformPagePoint()?.(r) || r,
              a = this.visualElement.measureViewportBox();
            (0, scope.Ts)((e) => {
              if (!(0, scope.su)(e, n, this.currentDirection)) return;
              let t = this.getAxisMotionValue(e),
                { min: r, max: o } = a[e];
              t.set((t.get() || 0) + i[e] - (0, scope.W)(r, o, 0.5));
            });
          }
          scalePositionWithinConstraints() {
            if (!this.visualElement.current) return;
            let { drag: e, dragConstraints: t } = this.getProps(),
              { projection: n } = this.visualElement;
            if (!(0, scope.yl)(t) || !n || !this.constraints) return;
            this.stopAnimation();
            let r = this.constraints,
              i = { x: 0, y: 0 };
            (0, scope.Ts)((e) => {
              let t = this.getAxisMotionValue(e).get();
              i[e] = (0, scope.Zl)({ min: t, max: t }, r[e]);
            });
            let { transformTemplate: a } = this.visualElement.getProps();
            ((this.visualElement.current.style.transform = a ? a({}, ``) : `none`),
              n.root && n.root.updateScroll(),
              n.updateLayout(),
              (this.constraints = !1),
              this.resolveConstraints(),
              (0, scope.Ts)((t) => {
                let n = this.getAxisMotionValue(t);
                if (!(0, scope.su)(t, e, null) || !n.get()) return;
                let { min: r, max: a } = this.constraints[t];
                n.set((0, scope.W)(r, a, i[t]));
              }),
              this.visualElement.render());
          }
          addListeners() {
            if (!this.visualElement.current) return;
            scope.ru.set(this.visualElement, this);
            let e = this.visualElement.current,
              t = (0, scope.Pl)(e, `pointerdown`, (t) => {
                let { drag: n, dragListener: r = !0 } = this.getProps(),
                  i = t.target,
                  a = i !== e && (0, scope.Ba)(i);
                n && r && !a && this.start(t);
              }),
              n,
              r = () => {
                let { dragConstraints: t } = this.getProps();
                (0, scope.yl)(t) &&
                  t.current &&
                  ((this.constraints = this.resolveRefConstraints()),
                  (n ||= (0, scope.ou)(e, t.current, () => this.scalePositionWithinConstraints())));
              },
              { projection: i } = this.visualElement,
              a = i.addEventListener(`measure`, r);
            (i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()),
              scope.G.read(r));
            let o = (0, scope.Rs)(window, `resize`, () => this.scalePositionWithinConstraints()),
              s = i.addEventListener(`didUpdate`, ({ delta: e, hasLayoutChanged: t }) => {
                this.isDragging &&
                  t &&
                  ((0, scope.Ts)((t) => {
                    let n = this.getAxisMotionValue(t);
                    n && ((this.originPoint[t] += e[t].translate), n.set(n.get() + e[t].translate));
                  }),
                  this.visualElement.render());
              });
            return () => {
              (o(), t(), a(), s && s(), n && n());
            };
          }
          getProps() {
            let e = this.visualElement.getProps(),
              {
                drag: t = !1,
                dragDirectionLock: n = !1,
                dragPropagation: r = !1,
                dragConstraints: i = !1,
                dragElastic: a = scope.$l,
                dragMomentum: o = !0,
              } = e;
            return {
              ...e,
              drag: t,
              dragDirectionLock: n,
              dragPropagation: r,
              dragConstraints: i,
              dragElastic: a,
              dragMomentum: o,
            };
          }
        };
        break;
      }
      case 277: {
        scope.lu = class extends scope.No {
          constructor(e) {
            (super(e),
              (this.removeGroupControls = scope.se),
              (this.removeListeners = scope.se),
              (this.controls = new scope.iu(e)));
          }
          mount() {
            let { dragControls: e } = this.node.getProps();
            (e && (this.removeGroupControls = e.subscribe(this.controls)),
              (this.removeListeners = this.controls.addListeners() || scope.se));
          }
          update() {
            let { dragControls: e } = this.node.getProps(),
              { dragControls: t } = this.node.prevProps || {};
            e !== t &&
              (this.removeGroupControls(),
              e && (this.removeGroupControls = e.subscribe(this.controls)));
          }
          unmount() {
            (this.removeGroupControls(),
              this.removeListeners(),
              this.controls.isDragging || this.controls.endPanSession());
          }
        };
        break;
      }
      case 278: {
        scope.uu = (e) => (t, n) => {
          e && scope.G.update(() => e(t, n), !1, !0);
        };
        break;
      }
      case 279: {
        scope.du = class extends scope.No {
          constructor() {
            (super(...arguments), (this.removePointerDownListener = scope.se));
          }
          onPointerDown(e) {
            this.session = new scope.zl(e, this.createPanHandlers(), {
              transformPagePoint: this.node.getTransformPagePoint(),
              contextWindow: (0, scope.Fl)(this.node),
            });
          }
          createPanHandlers() {
            let {
              onPanSessionStart: e,
              onPanStart: t,
              onPan: n,
              onPanEnd: r,
            } = this.node.getProps();
            return {
              onSessionStart: (0, scope.uu)(e),
              onStart: (0, scope.uu)(t),
              onMove: (0, scope.uu)(n),
              onEnd: (e, t) => {
                (delete this.session, r && scope.G.postRender(() => r(e, t)));
              },
            };
          }
          mount() {
            this.removePointerDownListener = (0, scope.Pl)(this.node.current, `pointerdown`, (e) =>
              this.onPointerDown(e),
            );
          }
          update() {
            this.session && this.session.updateHandlers(this.createPanHandlers());
          }
          unmount() {
            (this.removePointerDownListener(), this.session && this.session.end());
          }
        };
        break;
      }
      case 280: {
        scope.fu = !1;
        break;
      }
      case 281: {
        scope.pu = class extends scope.k.Component {
          componentDidMount() {
            let {
                visualElement: e,
                layoutGroup: t,
                switchLayoutGroup: n,
                layoutId: r,
              } = this.props,
              { projection: i } = e;
            (i &&
              (t.group && t.group.add(i),
              n && n.register && r && n.register(i),
              scope.fu && i.root.didUpdate(),
              i.addEventListener(`animationComplete`, () => {
                this.safeToRemove();
              }),
              i.setOptions({
                ...i.options,
                layoutDependency: this.props.layoutDependency,
                onExitComplete: () => this.safeToRemove(),
              })),
              (scope.Gs.hasEverUpdated = !0));
          }
          getSnapshotBeforeUpdate(e) {
            let { layoutDependency: t, visualElement: n, drag: r, isPresent: i } = this.props,
              { projection: a } = n;
            return (
              a &&
                ((a.isPresent = i),
                e.layoutDependency !== t && a.setOptions({ ...a.options, layoutDependency: t }),
                (scope.fu = !0),
                r || e.layoutDependency !== t || t === void 0 || e.isPresent !== i
                  ? a.willUpdate()
                  : this.safeToRemove(),
                e.isPresent !== i &&
                  (i
                    ? a.promote()
                    : a.relegate() ||
                      scope.G.postRender(() => {
                        let e = a.getStack();
                        (!e || !e.members.length) && this.safeToRemove();
                      }))),
              null
            );
          }
          componentDidUpdate() {
            let { visualElement: e, layoutAnchor: t } = this.props,
              { projection: n } = e;
            n &&
              ((n.options.layoutAnchor = t),
              n.root.didUpdate(),
              scope.Da.postRender(() => {
                !n.currentAnimation && n.isLead() && this.safeToRemove();
              }));
          }
          componentWillUnmount() {
            let { visualElement: e, layoutGroup: t, switchLayoutGroup: n } = this.props,
              { projection: r } = e;
            ((scope.fu = !0),
              r &&
                (r.scheduleCheckAfterUnmount(),
                t && t.group && t.group.remove(r),
                n && n.deregister && n.deregister(r)));
          }
          safeToRemove() {
            let { safeToRemove: e } = this.props;
            e && e();
          }
          render() {
            return null;
          }
        };
        break;
      }
      case 282: {
        scope.hu = {
          pan: { Feature: scope.du },
          drag: { Feature: scope.lu, ProjectionNode: scope.Oc, MeasureLayout: scope.mu },
        };
        break;
      }
      case 283: {
        scope._u = class extends scope.No {
          mount() {
            let { current: e } = this.node;
            e &&
              (this.unmount = (0, scope.Pa)(
                e,
                (e, t) => (
                  (0, scope.gu)(this.node, t, `Start`),
                  (e) => (0, scope.gu)(this.node, e, `End`)
                ),
              ));
          }
          unmount() {}
        };
        break;
      }
      case 284: {
        scope.vu = class extends scope.No {
          constructor() {
            (super(...arguments), (this.isActive = !1));
          }
          onFocus() {
            let e = !1;
            try {
              e = this.node.current.matches(`:focus-visible`);
            } catch {
              e = !0;
            }
            e &&
              this.node.animationState &&
              (this.node.animationState.setActive(`whileFocus`, !0), (this.isActive = !0));
          }
          onBlur() {
            this.isActive &&
              this.node.animationState &&
              (this.node.animationState.setActive(`whileFocus`, !1), (this.isActive = !1));
          }
          mount() {
            this.unmount = (0, scope.L)(
              (0, scope.Rs)(this.node.current, `focus`, () => this.onFocus()),
              (0, scope.Rs)(this.node.current, `blur`, () => this.onBlur()),
            );
          }
          unmount() {}
        };
        break;
      }
      case 285: {
        scope.bu = class extends scope.No {
          mount() {
            let { current: e } = this.node;
            if (!e) return;
            let { globalTapTarget: t, propagate: n } = this.node.props;
            this.unmount = (0, scope.qa)(
              e,
              (e, t) => (
                (0, scope.yu)(this.node, t, `Start`),
                (e, { success: t }) => (0, scope.yu)(this.node, e, t ? `End` : `Cancel`)
              ),
              { useGlobalTarget: t, stopPropagation: n?.tap === !1 },
            );
          }
          unmount() {}
        };
        break;
      }
      case 286: {
        scope.xu = new WeakMap();
        break;
      }
      case 287: {
        scope.Su = new WeakMap();
        break;
      }
      case 288: {
        scope.Cu = (e) => {
          let t = scope.xu.get(e.target);
          t && t(e);
        };
        break;
      }
      case 289: {
        scope.wu = (e) => {
          e.forEach(scope.Cu);
        };
        break;
      }
      case 290: {
        scope.Du = { some: 0, all: 1 };
        break;
      }
      case 291: {
        scope.Ou = class extends scope.No {
          constructor() {
            (super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1));
          }
          startObserver() {
            this.stopObserver?.();
            let { viewport: e = {} } = this.node.getProps(),
              { root: t, margin: n, amount: r = `some`, once: i } = e,
              a = {
                root: t ? t.current : void 0,
                rootMargin: n,
                threshold: typeof r == `number` ? r : scope.Du[r],
              },
              o = (e) => {
                let { isIntersecting: t } = e;
                if (this.isInView === t || ((this.isInView = t), i && !t && this.hasEnteredView))
                  return;
                (t && (this.hasEnteredView = !0),
                  this.node.animationState && this.node.animationState.setActive(`whileInView`, t));
                let { onViewportEnter: n, onViewportLeave: r } = this.node.getProps(),
                  a = t ? n : r;
                a && a(e);
              };
            this.stopObserver = (0, scope.Eu)(this.node.current, a, o);
          }
          mount() {
            this.startObserver();
          }
          update() {
            if (typeof IntersectionObserver > `u`) return;
            let { props: e, prevProps: t } = this.node;
            [`amount`, `margin`, `root`].some((0, scope.ku)(e, t)) && this.startObserver();
          }
          unmount() {
            (this.stopObserver?.(), (this.hasEnteredView = !1), (this.isInView = !1));
          }
        };
        break;
      }
      case 292: {
        scope.Au = {
          inView: { Feature: scope.Ou },
          tap: { Feature: scope.bu },
          focus: { Feature: scope.vu },
          hover: { Feature: scope._u },
        };
        break;
      }
      case 293: {
        scope.ju = { layout: { ProjectionNode: scope.Oc, MeasureLayout: scope.mu } };
        break;
      }
      case 294: {
        scope.Mu = (0, scope.Dl)({ ...scope.jl, ...scope.Au, ...scope.hu, ...scope.ju }, scope.Ol);
        break;
      }
      case 295: {
        scope.Nu = {
          name: `circle-x`,
          size: 24,
          node: [
            [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
            [`path`, { d: `m15 9-6 6`, key: `1uzhvr` }],
            [`path`, { d: `m9 9 6 6`, key: `z0biqf` }],
          ],
          aliases: [`x-circle`],
        };
        break;
      }
      case 296: {
        scope.Nu.node;
        break;
      }
      case 297: {
        scope.Pu = (0, scope.n)(scope.Nu);
        break;
      }
      case 298: {
        scope.Fu = {
          name: `clipboard-copy`,
          size: 24,
          node: [
            [`rect`, { width: `8`, height: `4`, x: `8`, y: `2`, rx: `1`, ry: `1`, key: `tgr4d6` }],
            [
              `path`,
              { d: `M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2`, key: `4jdomd` },
            ],
            [`path`, { d: `M16 4h2a2 2 0 0 1 2 2v4`, key: `3hqy98` }],
            [`path`, { d: `M21 14H11`, key: `1bme5i` }],
            [`path`, { d: `m15 10-4 4 4 4`, key: `5dvupr` }],
          ],
        };
        break;
      }
      case 299: {
        scope.Fu.node;
        break;
      }
      case 300: {
        scope.Iu = (0, scope.n)(scope.Fu);
        break;
      }
      case 301: {
        scope.Lu = {
          name: `clipboard-paste`,
          size: 24,
          node: [
            [`path`, { d: `M11 14h10`, key: `1w8e9d` }],
            [`path`, { d: `M16 4h2a2 2 0 0 1 2 2v1.344`, key: `1e62lh` }],
            [`path`, { d: `m17 18 4-4-4-4`, key: `z2g111` }],
            [
              `path`,
              {
                d: `M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113`,
                key: `bjbb7m`,
              },
            ],
            [`rect`, { x: `8`, y: `2`, width: `8`, height: `4`, rx: `1`, key: `ublpy` }],
          ],
        };
        break;
      }
      case 302: {
        scope.Lu.node;
        break;
      }
      case 303: {
        scope.Ru = (0, scope.n)(scope.Lu);
        break;
      }
      case 304: {
        scope.zu = {
          name: `eye-off`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49`,
                key: `ct8e1f`,
              },
            ],
            [`path`, { d: `M14.084 14.158a3 3 0 0 1-4.242-4.242`, key: `151rxh` }],
            [
              `path`,
              {
                d: `M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143`,
                key: `13bj9a`,
              },
            ],
            [`path`, { d: `m2 2 20 20`, key: `1ooewy` }],
          ],
        };
        break;
      }
      case 305: {
        scope.zu.node;
        break;
      }
      case 306: {
        scope.Bu = (0, scope.n)(scope.zu);
        break;
      }
      case 307: {
        scope.Vu = {
          name: `eye`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`,
                key: `1nclc0`,
              },
            ],
            [`circle`, { cx: `12`, cy: `12`, r: `3`, key: `1v7zrd` }],
          ],
        };
        break;
      }
      case 308: {
        scope.Vu.node;
        break;
      }
      case 309: {
        scope.Hu = (0, scope.n)(scope.Vu);
        break;
      }
      case 310: {
        scope.Uu = {
          name: `file-up`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
                key: `1oefj6`,
              },
            ],
            [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5`, key: `wfsgrz` }],
            [`path`, { d: `M12 12v6`, key: `3ahymv` }],
            [`path`, { d: `m15 15-3-3-3 3`, key: `15xj92` }],
          ],
        };
        break;
      }
      case 311: {
        scope.Uu.node;
        break;
      }
      case 312: {
        scope.Wu = (0, scope.n)(scope.Uu);
        break;
      }
      case 313: {
        scope.Gu = {
          name: `plug-zap`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z`,
                key: `goz73y`,
              },
            ],
            [`path`, { d: `m2 22 3-3`, key: `19mgm9` }],
            [`path`, { d: `M7.5 13.5 10 11`, key: `7xgeeb` }],
            [`path`, { d: `M10.5 16.5 13 14`, key: `10btkg` }],
            [`path`, { d: `m18 3-4 4h6l-4 4`, key: `16psg9` }],
          ],
          aliases: [`plug-zap-2`],
        };
        break;
      }
      case 314: {
        scope.Gu.node;
        break;
      }
      case 315: {
        scope.Ku = (0, scope.n)(scope.Gu);
        break;
      }
      case 316: {
        scope.qu = {
          name: `radio`,
          size: 24,
          node: [
            [`path`, { d: `M16.247 7.761a6 6 0 0 1 0 8.478`, key: `1fwjs5` }],
            [`path`, { d: `M19.075 4.933a10 10 0 0 1 0 14.134`, key: `ehdyv1` }],
            [`path`, { d: `M4.925 19.067a10 10 0 0 1 0-14.134`, key: `1q22gi` }],
            [`path`, { d: `M7.753 16.239a6 6 0 0 1 0-8.478`, key: `r2q7qm` }],
            [`circle`, { cx: `12`, cy: `12`, r: `2`, key: `1c9p78` }],
          ],
        };
        break;
      }
      case 317: {
        scope.qu.node;
        break;
      }
      case 318: {
        scope.Ju = (0, scope.n)(scope.qu);
        break;
      }
      case 319: {
        scope.Yu = {
          name: `server`,
          size: 24,
          node: [
            [`rect`, { width: `20`, height: `8`, x: `2`, y: `2`, rx: `2`, ry: `2`, key: `ngkwjq` }],
            [
              `rect`,
              { width: `20`, height: `8`, x: `2`, y: `14`, rx: `2`, ry: `2`, key: `iecqi9` },
            ],
            [`line`, { x1: `6`, x2: `6.01`, y1: `6`, y2: `6`, key: `16zg32` }],
            [`line`, { x1: `6`, x2: `6.01`, y1: `18`, y2: `18`, key: `nzw8ys` }],
          ],
        };
        break;
      }
      case 320: {
        scope.Yu.node;
        break;
      }
      case 321: {
        scope.Xu = (0, scope.n)(scope.Yu);
        break;
      }
      case 322: {
        scope.Zu = {
          name: `wand-sparkles`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72`,
                key: `ul74o6`,
              },
            ],
            [`path`, { d: `m14 7 3 3`, key: `1r5n42` }],
            [`path`, { d: `M5 6v4`, key: `ilb8ba` }],
            [`path`, { d: `M19 14v4`, key: `blhpug` }],
            [`path`, { d: `M10 2v2`, key: `7u0qdc` }],
            [`path`, { d: `M7 8H3`, key: `zfb6yr` }],
            [`path`, { d: `M21 16h-4`, key: `1cnmox` }],
            [`path`, { d: `M11 3H9`, key: `1obp7u` }],
          ],
          aliases: [`wand-2`],
        };
        break;
      }
      case 323: {
        scope.Zu.node;
        break;
      }
      case 324: {
        scope.Qu = (0, scope.n)(scope.Zu);
        break;
      }
      case 325: {
        scope.$u = {
          name: `wrench`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z`,
                key: `1ngwbx`,
              },
            ],
          ],
        };
        break;
      }
      case 326: {
        scope.$u.node;
        break;
      }
      case 327: {
        scope.ed = (0, scope.n)(scope.$u);
        break;
      }
      case 328: {
        scope.dd = 5e5;
        break;
      }
      case 329: {
        scope.Od = (e, t) => {
          let n = Array(e.length + t.length);
          for (let t = 0; t < e.length; t++) n[t] = e[t];
          for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
          return n;
        };
        break;
      }
      case 330: {
        scope.kd = (e, t) => ({ classGroupId: e, validator: t });
        break;
      }
      case 331: {
        scope.Ad = (e = new Map(), t = null, n) => ({
          nextPart: e,
          validators: t,
          classGroupId: n,
        });
        break;
      }
      case 332: {
        scope.jd = `-`;
        break;
      }
      case 333: {
        scope.Md = [];
        break;
      }
      case 334: {
        scope.Nd = `arbitrary..`;
        break;
      }
      case 335: {
        scope.Pd = (e) => {
          let t = (0, scope.Ld)(e),
            { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
          return {
            getClassGroupId: (e) => {
              if (e.startsWith(`[`) && e.endsWith(`]`)) return (0, scope.Id)(e);
              let n = e.split(scope.jd);
              return (0, scope.Fd)(n, +(n[0] === `` && n.length > 1), t);
            },
            getConflictingClassGroupIds: (e, t) => {
              if (t) {
                let t = r[e],
                  i = n[e];
                return t ? (i ? (0, scope.Od)(i, t) : t) : i || scope.Md;
              }
              return n[e] || scope.Md;
            },
          };
        };
        break;
      }
      case 336: {
        scope.Fd = (e, t, n) => {
          if (e.length - t === 0) return n.classGroupId;
          let r = e[t],
            i = n.nextPart.get(r);
          if (i) {
            let n = (0, scope.Fd)(e, t + 1, i);
            if (n) return n;
          }
          let a = n.validators;
          if (a === null) return;
          let o = t === 0 ? e.join(scope.jd) : e.slice(t).join(scope.jd),
            s = a.length;
          for (let e = 0; e < s; e++) {
            let t = a[e];
            if (t.validator(o)) return t.classGroupId;
          }
        };
        break;
      }
      case 337: {
        scope.Id = (e) =>
          e.slice(1, -1).indexOf(`:`) === -1
            ? void 0
            : (() => {
                let t = e.slice(1, -1),
                  n = t.indexOf(`:`),
                  r = t.slice(0, n);
                return r ? scope.Nd + r : void 0;
              })();
        break;
      }
      case 338: {
        scope.Ld = (e) => {
          let { theme: t, classGroups: n } = e;
          return (0, scope.Rd)(n, t);
        };
        break;
      }
      case 339: {
        scope.Rd = (e, t) => {
          let n = (0, scope.Ad)();
          for (let r in e) {
            let i = e[r];
            (0, scope.zd)(i, n, r, t);
          }
          return n;
        };
        break;
      }
      case 340: {
        scope.zd = (e, t, n, r) => {
          let i = e.length;
          for (let a = 0; a < i; a++) {
            let i = e[a];
            (0, scope.Bd)(i, t, n, r);
          }
        };
        break;
      }
      case 341: {
        scope.Bd = (e, t, n, r) => {
          typeof e == `string`
            ? (0, scope.Vd)(e, t, n)
            : typeof e == `function`
              ? (0, scope.Hd)(e, t, n, r)
              : (0, scope.Ud)(e, t, n, r);
        };
        break;
      }
      case 342: {
        scope.Vd = (e, t, n) => {
          let r = e === `` ? t : (0, scope.Wd)(t, e);
          r.classGroupId = n;
        };
        break;
      }
      case 343: {
        scope.Hd = (e, t, n, r) => {
          (0, scope.Gd)(e)
            ? (0, scope.zd)(e(r), t, n, r)
            : (t.validators === null && (t.validators = []),
              t.validators.push((0, scope.kd)(n, e)));
        };
        break;
      }
      case 344: {
        scope.Ud = (e, t, n, r) => {
          let i = Object.entries(e),
            a = i.length;
          for (let e = 0; e < a; e++) {
            let [a, o] = i[e];
            (0, scope.zd)(o, (0, scope.Wd)(t, a), n, r);
          }
        };
        break;
      }
      case 345: {
        scope.Wd = (e, t) => {
          let n = e,
            r = t.split(scope.jd),
            i = r.length;
          for (let e = 0; e < i; e++) {
            let t = r[e],
              i = n.nextPart.get(t);
            (i || ((i = (0, scope.Ad)()), n.nextPart.set(t, i)), (n = i));
          }
          return n;
        };
        break;
      }
      case 346: {
        scope.Gd = (e) => `isThemeGetter` in e && e.isThemeGetter === !0;
        break;
      }
      case 347: {
        scope.Kd = (e) => {
          if (e < 1) return { get: () => void 0, set: () => {} };
          let t = 0,
            n = Object.create(null),
            r = Object.create(null),
            i = (i, a) => {
              ((n[i] = a), t++, t > e && ((t = 0), (r = n), (n = Object.create(null))));
            };
          return {
            get(e) {
              let t = n[e];
              if (t !== void 0) return t;
              if ((t = r[e]) !== void 0) return (i(e, t), t);
            },
            set(e, t) {
              e in n ? (n[e] = t) : i(e, t);
            },
          };
        };
        break;
      }
      case 348: {
        scope.qd = `!`;
        break;
      }
      case 349: {
        scope.Jd = `:`;
        break;
      }
      case 350: {
        scope.Yd = [];
        break;
      }
      case 351: {
        scope.Xd = (e, t, n, r, i) => ({
          modifiers: e,
          hasImportantModifier: t,
          baseClassName: n,
          maybePostfixModifierPosition: r,
          isExternal: i,
        });
        break;
      }
      case 352: {
        scope.Zd = (e) => {
          let { prefix: t, experimentalParseClassName: n } = e,
            r = (e) => {
              let t = [],
                n = 0,
                r = 0,
                i = 0,
                a,
                o = e.length;
              for (let s = 0; s < o; s++) {
                let o = e[s];
                if (n === 0 && r === 0) {
                  if (o === scope.Jd) {
                    (t.push(e.slice(i, s)), (i = s + 1));
                    continue;
                  }
                  if (o === `/`) {
                    a = s;
                    continue;
                  }
                }
                o === `[` ? n++ : o === `]` ? n-- : o === `(` ? r++ : o === `)` && r--;
              }
              let s = t.length === 0 ? e : e.slice(i),
                c = s,
                l = !1;
              s.endsWith(scope.qd)
                ? ((c = s.slice(0, -1)), (l = !0))
                : s.startsWith(scope.qd) && ((c = s.slice(1)), (l = !0));
              let u = a && a > i ? a - i : void 0;
              return (0, scope.Xd)(t, l, c, u);
            };
          if (t) {
            let e = t + scope.Jd,
              n = r;
            r = (t) =>
              t.startsWith(e) ? n(t.slice(e.length)) : (0, scope.Xd)(scope.Yd, !1, t, void 0, !0);
          }
          if (n) {
            let e = r;
            r = (t) => n({ className: t, parseClassName: e });
          }
          return r;
        };
        break;
      }
      case 353: {
        scope.Qd = (e) => {
          let t = new Map();
          return (
            e.orderSensitiveModifiers.forEach((e, n) => {
              t.set(e, 1e6 + n);
            }),
            (e) => {
              let n = [],
                r = [];
              for (let i = 0; i < e.length; i++) {
                let a = e[i],
                  o = a[0] === `[`,
                  s = t.has(a);
                o || s
                  ? (r.length > 0 && (r.sort(), n.push(...r), (r = [])), n.push(a))
                  : r.push(a);
              }
              return (r.length > 0 && (r.sort(), n.push(...r)), n);
            }
          );
        };
        break;
      }
      case 354: {
        scope.$d = (e) => ({
          cache: (0, scope.Kd)(e.cacheSize),
          parseClassName: (0, scope.Zd)(e),
          sortModifiers: (0, scope.Qd)(e),
          postfixLookupClassGroupIds: (0, scope.ef)(e),
          ...(0, scope.Pd)(e),
        });
        break;
      }
      case 355: {
        scope.ef = (e) => {
          let t = Object.create(null),
            n = e.postfixLookupClassGroups;
          if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0;
          return t;
        };
        break;
      }
      case 356: {
        scope.tf = /\s+/;
        break;
      }
      case 357: {
        scope.nf = (e, t) => {
          let {
              parseClassName: n,
              getClassGroupId: r,
              getConflictingClassGroupIds: i,
              sortModifiers: a,
              postfixLookupClassGroupIds: o,
            } = t,
            s = [],
            c = e.trim().split(scope.tf),
            l = ``;
          for (let e = c.length - 1; e >= 0; --e) {
            let t = c[e],
              {
                isExternal: u,
                modifiers: d,
                hasImportantModifier: f,
                baseClassName: p,
                maybePostfixModifierPosition: m,
              } = n(t);
            if (u) {
              l = t + (l.length > 0 ? ` ` + l : l);
              continue;
            }
            let h = !!m,
              g;
            if (h) {
              g = r(p.substring(0, m));
              let e = g && o[g] ? r(p) : void 0;
              e && e !== g && ((g = e), (h = !1));
            } else g = r(p);
            if (!g) {
              if (!h || ((g = r(p)), !g)) {
                l = t + (l.length > 0 ? ` ` + l : l);
                continue;
              }
              h = !1;
            }
            let _ = d.length === 0 ? `` : d.length === 1 ? d[0] : a(d).join(`:`),
              v = f ? _ + scope.qd : _,
              y = v + g;
            if (s.indexOf(y) > -1) continue;
            s.push(y);
            let b = i(g, h);
            for (let e = 0; e < b.length; ++e) {
              let t = b[e];
              s.push(v + t);
            }
            l = t + (l.length > 0 ? ` ` + l : l);
          }
          return l;
        };
        break;
      }
      case 358: {
        scope.rf = (...e) => {
          let t = 0,
            n,
            r,
            i = ``;
          for (; t < e.length;)
            (n = e[t++]) && (r = (0, scope.af)(n)) && (i && (i += ` `), (i += r));
          return i;
        };
        break;
      }
      case 359: {
        scope.af = (e) => {
          if (typeof e == `string`) return e;
          let t,
            n = ``;
          for (let r = 0; r < e.length; r++)
            e[r] && (t = (0, scope.af)(e[r])) && (n && (n += ` `), (n += t));
          return n;
        };
        break;
      }
      case 360: {
        scope.of = (e, ...t) => {
          let n,
            r,
            i,
            a,
            o = (o) => (
              (n = (0, scope.$d)(t.reduce((e, t) => t(e), e()))),
              (r = n.cache.get),
              (i = n.cache.set),
              (a = s),
              s(o)
            ),
            s = (e) => {
              let t = r(e);
              if (t) return t;
              let a = (0, scope.nf)(e, n);
              return (i(e, a), a);
            };
          return ((a = o), (...e) => a((0, scope.rf)(...e)));
        };
        break;
      }
      case 361: {
        scope.sf = [];
        break;
      }
      case 362: {
        scope.Y = (e) => {
          let t = (t) => t[e] || scope.sf;
          return ((t.isThemeGetter = !0), (t.themeKey = e), t);
        };
        break;
      }
      case 363: {
        scope.cf = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
        break;
      }
      case 364: {
        scope.lf = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
        break;
      }
      case 365: {
        scope.uf = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/;
        break;
      }
      case 366: {
        scope.df = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
        break;
      }
      case 367: {
        scope.ff =
          /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
        break;
      }
      case 368: {
        scope.pf = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/;
        break;
      }
      case 369: {
        scope.mf = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
        break;
      }
      case 370: {
        scope.hf =
          /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
        break;
      }
      case 371: {
        scope.gf = (e) => scope.uf.test(e);
        break;
      }
      case 372: {
        scope.X = (e) => !!e && !Number.isNaN(Number(e));
        break;
      }
      case 373: {
        scope._f = (e) => !!e && Number.isInteger(Number(e));
        break;
      }
      case 374: {
        scope.vf = (e) => e.endsWith(`%`) && (0, scope.X)(e.slice(0, -1));
        break;
      }
      case 375: {
        scope.yf = (e) => scope.df.test(e);
        break;
      }
      case 376: {
        scope.bf = () => !0;
        break;
      }
      case 377: {
        scope.xf = (e) => scope.ff.test(e) && !scope.pf.test(e);
        break;
      }
      case 378: {
        scope.Sf = () => !1;
        break;
      }
      case 379: {
        scope.Cf = (e) => scope.mf.test(e);
        break;
      }
      case 380: {
        scope.wf = (e) => scope.hf.test(e);
        break;
      }
      case 381: {
        scope.Tf = (e) => !(0, scope.Z)(e) && !(0, scope.Q)(e);
        break;
      }
      case 382: {
        scope.Ef = (e) =>
          e.startsWith(`@container`) &&
          ((e[10] === `/` && e[11] !== void 0) ||
            (e[11] === `s` && e[16] !== void 0 && e.startsWith(`-size/`, 10)) ||
            (e[11] === `n` && e[18] !== void 0 && e.startsWith(`-normal/`, 10)));
        break;
      }
      case 383: {
        scope.Df = (e) => (0, scope.Hf)(e, scope.Kf, scope.Sf);
        break;
      }
      case 384: {
        scope.Z = (e) => scope.cf.test(e);
        break;
      }
      case 385: {
        scope.Of = (e) => (0, scope.Hf)(e, scope.qf, scope.xf);
        break;
      }
      case 386: {
        scope.kf = (e) => (0, scope.Hf)(e, scope.Jf, scope.X);
        break;
      }
      case 387: {
        scope.Af = (e) => (0, scope.Hf)(e, scope.Xf, scope.bf);
        break;
      }
      case 388: {
        scope.jf = (e) => (0, scope.Hf)(e, scope.Yf, scope.Sf);
        break;
      }
      case 389: {
        scope.Mf = (e) => (0, scope.Hf)(e, scope.Wf, scope.Sf);
        break;
      }
      case 390: {
        scope.Nf = (e) => (0, scope.Hf)(e, scope.Gf, scope.wf);
        break;
      }
      case 391: {
        scope.Pf = (e) => (0, scope.Hf)(e, scope.Zf, scope.Cf);
        break;
      }
      case 392: {
        scope.Q = (e) => scope.lf.test(e);
        break;
      }
      case 393: {
        scope.Ff = (e) => (0, scope.Uf)(e, scope.qf);
        break;
      }
      case 394: {
        scope.If = (e) => (0, scope.Uf)(e, scope.Yf);
        break;
      }
      case 395: {
        scope.Lf = (e) => (0, scope.Uf)(e, scope.Wf);
        break;
      }
      case 396: {
        scope.Rf = (e) => (0, scope.Uf)(e, scope.Kf);
        break;
      }
      case 397: {
        scope.zf = (e) => (0, scope.Uf)(e, scope.Gf);
        break;
      }
      case 398: {
        scope.Bf = (e) => (0, scope.Uf)(e, scope.Zf, !0);
        break;
      }
      case 399: {
        scope.Vf = (e) => (0, scope.Uf)(e, scope.Xf, !0);
        break;
      }
      case 400: {
        scope.Hf = (e, t, n) => {
          let r = scope.cf.exec(e);
          return r ? (r[1] ? t(r[1]) : n(r[2])) : !1;
        };
        break;
      }
      case 401: {
        scope.Uf = (e, t, n = !1) => {
          let r = scope.lf.exec(e);
          return r ? (r[1] ? t(r[1]) : n) : !1;
        };
        break;
      }
      case 402: {
        scope.Wf = (e) => e === `position` || e === `percentage`;
        break;
      }
      case 403: {
        scope.Gf = (e) => e === `image` || e === `url`;
        break;
      }
      case 404: {
        scope.Kf = (e) => e === `length` || e === `size` || e === `bg-size`;
        break;
      }
      case 405: {
        scope.qf = (e) => e === `length`;
        break;
      }
      case 406: {
        scope.Jf = (e) => e === `number`;
        break;
      }
      case 407: {
        scope.Yf = (e) => e === `family-name`;
        break;
      }
      case 408: {
        scope.Xf = (e) => e === `number` || e === `weight`;
        break;
      }
      case 409: {
        scope.Zf = (e) => e === `shadow`;
        break;
      }
      case 410: {
        scope.Qf = (0, scope.of)(() => {
          let e = (0, scope.Y)(`color`),
            t = (0, scope.Y)(`font`),
            n = (0, scope.Y)(`text`),
            r = (0, scope.Y)(`font-weight`),
            i = (0, scope.Y)(`tracking`),
            a = (0, scope.Y)(`leading`),
            o = (0, scope.Y)(`breakpoint`),
            s = (0, scope.Y)(`container`),
            c = (0, scope.Y)(`spacing`),
            l = (0, scope.Y)(`radius`),
            u = (0, scope.Y)(`shadow`),
            d = (0, scope.Y)(`inset-shadow`),
            f = (0, scope.Y)(`text-shadow`),
            p = (0, scope.Y)(`drop-shadow`),
            m = (0, scope.Y)(`blur`),
            h = (0, scope.Y)(`perspective`),
            g = (0, scope.Y)(`aspect`),
            _ = (0, scope.Y)(`ease`),
            v = (0, scope.Y)(`animate`),
            y = () => [`auto`, `avoid`, `all`, `avoid-page`, `page`, `left`, `right`, `column`],
            b = () => [
              `center`,
              `top`,
              `bottom`,
              `left`,
              `right`,
              `top-left`,
              `left-top`,
              `top-right`,
              `right-top`,
              `bottom-right`,
              `right-bottom`,
              `bottom-left`,
              `left-bottom`,
            ],
            x = () => [...b(), scope.Q, scope.Z],
            S = () => [`auto`, `hidden`, `clip`, `visible`, `scroll`],
            C = () => [`auto`, `contain`, `none`],
            w = () => [scope.Q, scope.Z, c],
            T = () => [scope.gf, `full`, `auto`, ...w()],
            E = () => [scope._f, `none`, `subgrid`, scope.Q, scope.Z],
            ee = () => [
              `auto`,
              { span: [`full`, scope._f, scope.Q, scope.Z] },
              scope._f,
              scope.Q,
              scope.Z,
            ],
            D = () => [scope._f, `auto`, scope.Q, scope.Z],
            te = () => [`auto`, `min`, `max`, `fr`, scope.Q, scope.Z],
            O = () => [
              `start`,
              `end`,
              `center`,
              `between`,
              `around`,
              `evenly`,
              `stretch`,
              `baseline`,
              `center-safe`,
              `end-safe`,
            ],
            k = () => [`start`, `end`, `center`, `stretch`, `center-safe`, `end-safe`],
            A = () => [`auto`, ...w()],
            j = () => [
              scope.gf,
              `auto`,
              `full`,
              `dvw`,
              `dvh`,
              `lvw`,
              `lvh`,
              `svw`,
              `svh`,
              `min`,
              `max`,
              `fit`,
              ...w(),
            ],
            M = () => [
              s,
              scope.gf,
              `screen`,
              `full`,
              `dvw`,
              `lvw`,
              `svw`,
              `min`,
              `max`,
              `fit`,
              ...w(),
            ],
            N = () => [
              scope.gf,
              `screen`,
              `full`,
              `lh`,
              `dvh`,
              `lvh`,
              `svh`,
              `min`,
              `max`,
              `fit`,
              ...w(),
            ],
            P = () => [e, scope.Q, scope.Z],
            ne = () => [...b(), scope.Lf, scope.Mf, { position: [scope.Q, scope.Z] }],
            re = () => [`no-repeat`, { repeat: [``, `x`, `y`, `space`, `round`] }],
            ie = () => [
              `auto`,
              `cover`,
              `contain`,
              scope.Rf,
              scope.Df,
              { size: [scope.Q, scope.Z] },
            ],
            ae = () => [scope.vf, scope.Ff, scope.Of],
            F = () => [``, `none`, `full`, l, scope.Q, scope.Z],
            I = () => [``, scope.X, scope.Ff, scope.Of],
            oe = () => [`solid`, `dashed`, `dotted`, `double`],
            se = () => [
              `normal`,
              `multiply`,
              `screen`,
              `overlay`,
              `darken`,
              `lighten`,
              `color-dodge`,
              `color-burn`,
              `hard-light`,
              `soft-light`,
              `difference`,
              `exclusion`,
              `hue`,
              `saturation`,
              `color`,
              `luminosity`,
            ],
            L = () => [scope.X, scope.vf, scope.Lf, scope.Mf],
            ce = () => [``, `none`, m, scope.Q, scope.Z],
            le = () => [`none`, scope.X, scope.Q, scope.Z],
            R = () => [`none`, scope.X, scope.Q, scope.Z],
            z = () => [scope.X, scope.Q, scope.Z],
            ue = () => [scope.gf, `full`, ...w()];
          return {
            cacheSize: 500,
            theme: {
              animate: [`spin`, `ping`, `pulse`, `bounce`],
              aspect: [`video`],
              blur: [scope.yf],
              breakpoint: [scope.yf],
              color: [scope.bf],
              container: [scope.yf],
              'drop-shadow': [scope.yf],
              ease: [`in`, `out`, `in-out`],
              font: [scope.Tf],
              'font-weight': [
                `thin`,
                `extralight`,
                `light`,
                `normal`,
                `medium`,
                `semibold`,
                `bold`,
                `extrabold`,
                `black`,
              ],
              'inset-shadow': [scope.yf],
              leading: [`none`, `tight`, `snug`, `normal`, `relaxed`, `loose`],
              perspective: [`dramatic`, `near`, `normal`, `midrange`, `distant`, `none`],
              radius: [scope.yf],
              shadow: [scope.yf],
              spacing: [`px`, scope.X],
              text: [scope.yf],
              'text-shadow': [scope.yf],
              tracking: [`tighter`, `tight`, `normal`, `wide`, `wider`, `widest`],
            },
            classGroups: {
              aspect: [{ aspect: [`auto`, `square`, scope.gf, scope.Z, scope.Q, g] }],
              container: [`container`],
              'container-type': [{ '@container': [``, `normal`, `size`, scope.Q, scope.Z] }],
              'container-named': [scope.Ef],
              columns: [{ columns: [scope.X, `auto`, scope.Z, scope.Q, s] }],
              'break-after': [{ 'break-after': y() }],
              'break-before': [{ 'break-before': y() }],
              'break-inside': [{ 'break-inside': [`auto`, `avoid`, `avoid-page`, `avoid-column`] }],
              'box-decoration': [{ 'box-decoration': [`slice`, `clone`] }],
              box: [{ box: [`border`, `content`] }],
              display: [
                `block`,
                `inline-block`,
                `inline`,
                `flex`,
                `inline-flex`,
                `table`,
                `inline-table`,
                `table-caption`,
                `table-cell`,
                `table-column`,
                `table-column-group`,
                `table-footer-group`,
                `table-header-group`,
                `table-row-group`,
                `table-row`,
                `flow-root`,
                `grid`,
                `inline-grid`,
                `contents`,
                `list-item`,
                `hidden`,
              ],
              sr: [`sr-only`, `not-sr-only`],
              float: [{ float: [`right`, `left`, `none`, `start`, `end`] }],
              clear: [{ clear: [`left`, `right`, `both`, `none`, `start`, `end`] }],
              isolation: [`isolate`, `isolation-auto`],
              'object-fit': [{ object: [`contain`, `cover`, `fill`, `none`, `scale-down`] }],
              'object-position': [{ object: x() }],
              overflow: [{ overflow: S() }],
              'overflow-x': [{ 'overflow-x': S() }],
              'overflow-y': [{ 'overflow-y': S() }],
              overscroll: [{ overscroll: C() }],
              'overscroll-x': [{ 'overscroll-x': C() }],
              'overscroll-y': [{ 'overscroll-y': C() }],
              position: [`static`, `fixed`, `absolute`, `relative`, `sticky`],
              inset: [{ inset: T() }],
              'inset-x': [{ 'inset-x': T() }],
              'inset-y': [{ 'inset-y': T() }],
              start: [{ 'inset-s': T(), start: T() }],
              end: [{ 'inset-e': T(), end: T() }],
              'inset-bs': [{ 'inset-bs': T() }],
              'inset-be': [{ 'inset-be': T() }],
              top: [{ top: T() }],
              right: [{ right: T() }],
              bottom: [{ bottom: T() }],
              left: [{ left: T() }],
              visibility: [`visible`, `invisible`, `collapse`],
              z: [{ z: [scope._f, `auto`, scope.Q, scope.Z] }],
              basis: [{ basis: [scope.gf, `full`, `auto`, s, ...w()] }],
              'flex-direction': [{ flex: [`row`, `row-reverse`, `col`, `col-reverse`] }],
              'flex-wrap': [{ flex: [`nowrap`, `wrap`, `wrap-reverse`] }],
              flex: [{ flex: [scope.X, scope.gf, `auto`, `initial`, `none`, scope.Z] }],
              grow: [{ grow: [``, scope.X, scope.Q, scope.Z] }],
              shrink: [{ shrink: [``, scope.X, scope.Q, scope.Z] }],
              order: [{ order: [scope._f, `first`, `last`, `none`, scope.Q, scope.Z] }],
              'grid-cols': [{ 'grid-cols': E() }],
              'col-start-end': [{ col: ee() }],
              'col-start': [{ 'col-start': D() }],
              'col-end': [{ 'col-end': D() }],
              'grid-rows': [{ 'grid-rows': E() }],
              'row-start-end': [{ row: ee() }],
              'row-start': [{ 'row-start': D() }],
              'row-end': [{ 'row-end': D() }],
              'grid-flow': [{ 'grid-flow': [`row`, `col`, `dense`, `row-dense`, `col-dense`] }],
              'auto-cols': [{ 'auto-cols': te() }],
              'auto-rows': [{ 'auto-rows': te() }],
              gap: [{ gap: w() }],
              'gap-x': [{ 'gap-x': w() }],
              'gap-y': [{ 'gap-y': w() }],
              'justify-content': [{ justify: [...O(), `normal`] }],
              'justify-items': [{ 'justify-items': [...k(), `normal`] }],
              'justify-self': [{ 'justify-self': [`auto`, ...k()] }],
              'align-content': [{ content: [`normal`, ...O()] }],
              'align-items': [{ items: [...k(), { baseline: [``, `last`] }] }],
              'align-self': [{ self: [`auto`, ...k(), { baseline: [``, `last`] }] }],
              'place-content': [{ 'place-content': O() }],
              'place-items': [{ 'place-items': [...k(), `baseline`] }],
              'place-self': [{ 'place-self': [`auto`, ...k()] }],
              p: [{ p: w() }],
              px: [{ px: w() }],
              py: [{ py: w() }],
              ps: [{ ps: w() }],
              pe: [{ pe: w() }],
              pbs: [{ pbs: w() }],
              pbe: [{ pbe: w() }],
              pt: [{ pt: w() }],
              pr: [{ pr: w() }],
              pb: [{ pb: w() }],
              pl: [{ pl: w() }],
              m: [{ m: A() }],
              mx: [{ mx: A() }],
              my: [{ my: A() }],
              ms: [{ ms: A() }],
              me: [{ me: A() }],
              mbs: [{ mbs: A() }],
              mbe: [{ mbe: A() }],
              mt: [{ mt: A() }],
              mr: [{ mr: A() }],
              mb: [{ mb: A() }],
              ml: [{ ml: A() }],
              'space-x': [{ 'space-x': w() }],
              'space-x-reverse': [`space-x-reverse`],
              'space-y': [{ 'space-y': w() }],
              'space-y-reverse': [`space-y-reverse`],
              size: [{ size: j() }],
              'inline-size': [{ inline: [`auto`, ...M()] }],
              'min-inline-size': [{ 'min-inline': [`auto`, ...M()] }],
              'max-inline-size': [{ 'max-inline': [`none`, ...M()] }],
              'block-size': [{ block: [`auto`, ...N()] }],
              'min-block-size': [{ 'min-block': [`auto`, ...N()] }],
              'max-block-size': [{ 'max-block': [`none`, ...N()] }],
              w: [{ w: [s, `screen`, ...j()] }],
              'min-w': [{ 'min-w': [s, `screen`, `none`, ...j()] }],
              'max-w': [{ 'max-w': [s, `screen`, `none`, `prose`, { screen: [o] }, ...j()] }],
              h: [{ h: [`screen`, `lh`, ...j()] }],
              'min-h': [{ 'min-h': [`screen`, `lh`, `none`, ...j()] }],
              'max-h': [{ 'max-h': [`screen`, `lh`, `none`, ...j()] }],
              'font-size': [{ text: [`base`, n, scope.Ff, scope.Of] }],
              'font-smoothing': [`antialiased`, `subpixel-antialiased`],
              'font-style': [`italic`, `not-italic`],
              'font-weight': [{ font: [r, scope.Vf, scope.Af] }],
              'font-stretch': [
                {
                  'font-stretch': [
                    `ultra-condensed`,
                    `extra-condensed`,
                    `condensed`,
                    `semi-condensed`,
                    `normal`,
                    `semi-expanded`,
                    `expanded`,
                    `extra-expanded`,
                    `ultra-expanded`,
                    scope.vf,
                    scope.Z,
                  ],
                },
              ],
              'font-family': [{ font: [scope.If, scope.jf, t] }],
              'font-features': [{ 'font-features': [scope.Z] }],
              'fvn-normal': [`normal-nums`],
              'fvn-ordinal': [`ordinal`],
              'fvn-slashed-zero': [`slashed-zero`],
              'fvn-figure': [`lining-nums`, `oldstyle-nums`],
              'fvn-spacing': [`proportional-nums`, `tabular-nums`],
              'fvn-fraction': [`diagonal-fractions`, `stacked-fractions`],
              tracking: [{ tracking: [i, scope.Q, scope.Z] }],
              'line-clamp': [{ 'line-clamp': [scope.X, `none`, scope.Q, scope.kf] }],
              leading: [{ leading: [`none`, a, ...w()] }],
              'list-image': [{ 'list-image': [`none`, scope.Q, scope.Z] }],
              'list-style-position': [{ list: [`inside`, `outside`] }],
              'list-style-type': [{ list: [`disc`, `decimal`, `none`, scope.Q, scope.Z] }],
              'text-alignment': [{ text: [`left`, `center`, `right`, `justify`, `start`, `end`] }],
              'placeholder-color': [{ placeholder: P() }],
              'text-color': [{ text: P() }],
              'text-decoration': [`underline`, `overline`, `line-through`, `no-underline`],
              'text-decoration-style': [{ decoration: [...oe(), `wavy`] }],
              'text-decoration-thickness': [
                { decoration: [scope.X, `from-font`, `auto`, scope.Q, scope.Of] },
              ],
              'text-decoration-color': [{ decoration: P() }],
              'underline-offset': [{ 'underline-offset': [scope.X, `auto`, scope.Q, scope.Z] }],
              'text-transform': [`uppercase`, `lowercase`, `capitalize`, `normal-case`],
              'text-overflow': [`truncate`, `text-ellipsis`, `text-clip`],
              'text-wrap': [{ text: [`wrap`, `nowrap`, `balance`, `pretty`] }],
              indent: [{ indent: w() }],
              'tab-size': [{ tab: [scope._f, scope.Q, scope.Z] }],
              'vertical-align': [
                {
                  align: [
                    `baseline`,
                    `top`,
                    `middle`,
                    `bottom`,
                    `text-top`,
                    `text-bottom`,
                    `sub`,
                    `super`,
                    scope.Q,
                    scope.Z,
                  ],
                },
              ],
              whitespace: [
                { whitespace: [`normal`, `nowrap`, `pre`, `pre-line`, `pre-wrap`, `break-spaces`] },
              ],
              break: [{ break: [`normal`, `words`, `all`, `keep`] }],
              wrap: [{ wrap: [`break-word`, `anywhere`, `normal`] }],
              hyphens: [{ hyphens: [`none`, `manual`, `auto`] }],
              content: [{ content: [`none`, scope.Q, scope.Z] }],
              'bg-attachment': [{ bg: [`fixed`, `local`, `scroll`] }],
              'bg-clip': [{ 'bg-clip': [`border`, `padding`, `content`, `text`] }],
              'bg-origin': [{ 'bg-origin': [`border`, `padding`, `content`] }],
              'bg-position': [{ bg: ne() }],
              'bg-repeat': [{ bg: re() }],
              'bg-size': [{ bg: ie() }],
              'bg-image': [
                {
                  bg: [
                    `none`,
                    {
                      linear: [
                        { to: [`t`, `tr`, `r`, `br`, `b`, `bl`, `l`, `tl`] },
                        scope._f,
                        scope.Q,
                        scope.Z,
                      ],
                      radial: [``, scope.Q, scope.Z],
                      conic: [``, scope._f, scope.Q, scope.Z],
                    },
                    scope.zf,
                    scope.Nf,
                  ],
                },
              ],
              'bg-color': [{ bg: P() }],
              'gradient-from-pos': [{ from: ae() }],
              'gradient-via-pos': [{ via: ae() }],
              'gradient-to-pos': [{ to: ae() }],
              'gradient-from': [{ from: P() }],
              'gradient-via': [{ via: P() }],
              'gradient-to': [{ to: P() }],
              rounded: [{ rounded: F() }],
              'rounded-s': [{ 'rounded-s': F() }],
              'rounded-e': [{ 'rounded-e': F() }],
              'rounded-t': [{ 'rounded-t': F() }],
              'rounded-r': [{ 'rounded-r': F() }],
              'rounded-b': [{ 'rounded-b': F() }],
              'rounded-l': [{ 'rounded-l': F() }],
              'rounded-ss': [{ 'rounded-ss': F() }],
              'rounded-se': [{ 'rounded-se': F() }],
              'rounded-ee': [{ 'rounded-ee': F() }],
              'rounded-es': [{ 'rounded-es': F() }],
              'rounded-tl': [{ 'rounded-tl': F() }],
              'rounded-tr': [{ 'rounded-tr': F() }],
              'rounded-br': [{ 'rounded-br': F() }],
              'rounded-bl': [{ 'rounded-bl': F() }],
              'border-w': [{ border: I() }],
              'border-w-x': [{ 'border-x': I() }],
              'border-w-y': [{ 'border-y': I() }],
              'border-w-s': [{ 'border-s': I() }],
              'border-w-e': [{ 'border-e': I() }],
              'border-w-bs': [{ 'border-bs': I() }],
              'border-w-be': [{ 'border-be': I() }],
              'border-w-t': [{ 'border-t': I() }],
              'border-w-r': [{ 'border-r': I() }],
              'border-w-b': [{ 'border-b': I() }],
              'border-w-l': [{ 'border-l': I() }],
              'divide-x': [{ 'divide-x': I() }],
              'divide-x-reverse': [`divide-x-reverse`],
              'divide-y': [{ 'divide-y': I() }],
              'divide-y-reverse': [`divide-y-reverse`],
              'border-style': [{ border: [...oe(), `hidden`, `none`] }],
              'divide-style': [{ divide: [...oe(), `hidden`, `none`] }],
              'border-color': [{ border: P() }],
              'border-color-x': [{ 'border-x': P() }],
              'border-color-y': [{ 'border-y': P() }],
              'border-color-s': [{ 'border-s': P() }],
              'border-color-e': [{ 'border-e': P() }],
              'border-color-bs': [{ 'border-bs': P() }],
              'border-color-be': [{ 'border-be': P() }],
              'border-color-t': [{ 'border-t': P() }],
              'border-color-r': [{ 'border-r': P() }],
              'border-color-b': [{ 'border-b': P() }],
              'border-color-l': [{ 'border-l': P() }],
              'divide-color': [{ divide: P() }],
              'outline-style': [{ outline: [...oe(), `none`, `hidden`] }],
              'outline-offset': [{ 'outline-offset': [scope.X, scope.Q, scope.Z] }],
              'outline-w': [{ outline: [``, scope.X, scope.Ff, scope.Of] }],
              'outline-color': [{ outline: P() }],
              shadow: [{ shadow: [``, `inner`, `none`, u, scope.Bf, scope.Pf] }],
              'shadow-color': [{ shadow: P() }],
              'inset-shadow': [{ 'inset-shadow': [`none`, d, scope.Bf, scope.Pf] }],
              'inset-shadow-color': [{ 'inset-shadow': P() }],
              'ring-w': [{ ring: I() }],
              'ring-w-inset': [`ring-inset`],
              'ring-color': [{ ring: P() }],
              'ring-offset-w': [{ 'ring-offset': [scope.X, scope.Of] }],
              'ring-offset-color': [{ 'ring-offset': P() }],
              'inset-ring-w': [{ 'inset-ring': I() }],
              'inset-ring-color': [{ 'inset-ring': P() }],
              'text-shadow': [{ 'text-shadow': [`none`, f, scope.Bf, scope.Pf] }],
              'text-shadow-color': [{ 'text-shadow': P() }],
              opacity: [{ opacity: [scope.X, scope.Q, scope.Z] }],
              'mix-blend': [{ 'mix-blend': [...se(), `plus-darker`, `plus-lighter`] }],
              'bg-blend': [{ 'bg-blend': se() }],
              'mask-clip': [
                { 'mask-clip': [`border`, `padding`, `content`, `fill`, `stroke`, `view`] },
                `mask-no-clip`,
              ],
              'mask-composite': [{ mask: [`add`, `subtract`, `intersect`, `exclude`] }],
              'mask-image-linear-pos': [{ 'mask-linear': [scope.X] }],
              'mask-image-linear-from-pos': [{ 'mask-linear-from': L() }],
              'mask-image-linear-to-pos': [{ 'mask-linear-to': L() }],
              'mask-image-linear-from-color': [{ 'mask-linear-from': P() }],
              'mask-image-linear-to-color': [{ 'mask-linear-to': P() }],
              'mask-image-t-from-pos': [{ 'mask-t-from': L() }],
              'mask-image-t-to-pos': [{ 'mask-t-to': L() }],
              'mask-image-t-from-color': [{ 'mask-t-from': P() }],
              'mask-image-t-to-color': [{ 'mask-t-to': P() }],
              'mask-image-r-from-pos': [{ 'mask-r-from': L() }],
              'mask-image-r-to-pos': [{ 'mask-r-to': L() }],
              'mask-image-r-from-color': [{ 'mask-r-from': P() }],
              'mask-image-r-to-color': [{ 'mask-r-to': P() }],
              'mask-image-b-from-pos': [{ 'mask-b-from': L() }],
              'mask-image-b-to-pos': [{ 'mask-b-to': L() }],
              'mask-image-b-from-color': [{ 'mask-b-from': P() }],
              'mask-image-b-to-color': [{ 'mask-b-to': P() }],
              'mask-image-l-from-pos': [{ 'mask-l-from': L() }],
              'mask-image-l-to-pos': [{ 'mask-l-to': L() }],
              'mask-image-l-from-color': [{ 'mask-l-from': P() }],
              'mask-image-l-to-color': [{ 'mask-l-to': P() }],
              'mask-image-x-from-pos': [{ 'mask-x-from': L() }],
              'mask-image-x-to-pos': [{ 'mask-x-to': L() }],
              'mask-image-x-from-color': [{ 'mask-x-from': P() }],
              'mask-image-x-to-color': [{ 'mask-x-to': P() }],
              'mask-image-y-from-pos': [{ 'mask-y-from': L() }],
              'mask-image-y-to-pos': [{ 'mask-y-to': L() }],
              'mask-image-y-from-color': [{ 'mask-y-from': P() }],
              'mask-image-y-to-color': [{ 'mask-y-to': P() }],
              'mask-image-radial': [{ 'mask-radial': [scope.Q, scope.Z] }],
              'mask-image-radial-from-pos': [{ 'mask-radial-from': L() }],
              'mask-image-radial-to-pos': [{ 'mask-radial-to': L() }],
              'mask-image-radial-from-color': [{ 'mask-radial-from': P() }],
              'mask-image-radial-to-color': [{ 'mask-radial-to': P() }],
              'mask-image-radial-shape': [{ 'mask-radial': [`circle`, `ellipse`] }],
              'mask-image-radial-size': [
                { 'mask-radial': [{ closest: [`side`, `corner`], farthest: [`side`, `corner`] }] },
              ],
              'mask-image-radial-pos': [{ 'mask-radial-at': b() }],
              'mask-image-conic-pos': [{ 'mask-conic': [scope.X] }],
              'mask-image-conic-from-pos': [{ 'mask-conic-from': L() }],
              'mask-image-conic-to-pos': [{ 'mask-conic-to': L() }],
              'mask-image-conic-from-color': [{ 'mask-conic-from': P() }],
              'mask-image-conic-to-color': [{ 'mask-conic-to': P() }],
              'mask-mode': [{ mask: [`alpha`, `luminance`, `match`] }],
              'mask-origin': [
                { 'mask-origin': [`border`, `padding`, `content`, `fill`, `stroke`, `view`] },
              ],
              'mask-position': [{ mask: ne() }],
              'mask-repeat': [{ mask: re() }],
              'mask-size': [{ mask: ie() }],
              'mask-type': [{ 'mask-type': [`alpha`, `luminance`] }],
              'mask-image': [{ mask: [`none`, scope.Q, scope.Z] }],
              filter: [{ filter: [``, `none`, scope.Q, scope.Z] }],
              blur: [{ blur: ce() }],
              brightness: [{ brightness: [scope.X, scope.Q, scope.Z] }],
              contrast: [{ contrast: [scope.X, scope.Q, scope.Z] }],
              'drop-shadow': [{ 'drop-shadow': [``, `none`, p, scope.Bf, scope.Pf] }],
              'drop-shadow-color': [{ 'drop-shadow': P() }],
              grayscale: [{ grayscale: [``, scope.X, scope.Q, scope.Z] }],
              'hue-rotate': [{ 'hue-rotate': [scope.X, scope.Q, scope.Z] }],
              invert: [{ invert: [``, scope.X, scope.Q, scope.Z] }],
              saturate: [{ saturate: [scope.X, scope.Q, scope.Z] }],
              sepia: [{ sepia: [``, scope.X, scope.Q, scope.Z] }],
              'backdrop-filter': [{ 'backdrop-filter': [``, `none`, scope.Q, scope.Z] }],
              'backdrop-blur': [{ 'backdrop-blur': ce() }],
              'backdrop-brightness': [{ 'backdrop-brightness': [scope.X, scope.Q, scope.Z] }],
              'backdrop-contrast': [{ 'backdrop-contrast': [scope.X, scope.Q, scope.Z] }],
              'backdrop-grayscale': [{ 'backdrop-grayscale': [``, scope.X, scope.Q, scope.Z] }],
              'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [scope.X, scope.Q, scope.Z] }],
              'backdrop-invert': [{ 'backdrop-invert': [``, scope.X, scope.Q, scope.Z] }],
              'backdrop-opacity': [{ 'backdrop-opacity': [scope.X, scope.Q, scope.Z] }],
              'backdrop-saturate': [{ 'backdrop-saturate': [scope.X, scope.Q, scope.Z] }],
              'backdrop-sepia': [{ 'backdrop-sepia': [``, scope.X, scope.Q, scope.Z] }],
              'border-collapse': [{ border: [`collapse`, `separate`] }],
              'border-spacing': [{ 'border-spacing': w() }],
              'border-spacing-x': [{ 'border-spacing-x': w() }],
              'border-spacing-y': [{ 'border-spacing-y': w() }],
              'table-layout': [{ table: [`auto`, `fixed`] }],
              caption: [{ caption: [`top`, `bottom`] }],
              transition: [
                {
                  transition: [
                    ``,
                    `all`,
                    `colors`,
                    `opacity`,
                    `shadow`,
                    `transform`,
                    `none`,
                    scope.Q,
                    scope.Z,
                  ],
                },
              ],
              'transition-behavior': [{ transition: [`normal`, `discrete`] }],
              duration: [{ duration: [scope.X, `initial`, scope.Q, scope.Z] }],
              ease: [{ ease: [`linear`, `initial`, _, scope.Q, scope.Z] }],
              delay: [{ delay: [scope.X, scope.Q, scope.Z] }],
              animate: [{ animate: [`none`, v, scope.Q, scope.Z] }],
              backface: [{ backface: [`hidden`, `visible`] }],
              perspective: [{ perspective: [h, scope.Q, scope.Z] }],
              'perspective-origin': [{ 'perspective-origin': x() }],
              rotate: [{ rotate: le() }],
              'rotate-x': [{ 'rotate-x': le() }],
              'rotate-y': [{ 'rotate-y': le() }],
              'rotate-z': [{ 'rotate-z': le() }],
              scale: [{ scale: R() }],
              'scale-x': [{ 'scale-x': R() }],
              'scale-y': [{ 'scale-y': R() }],
              'scale-z': [{ 'scale-z': R() }],
              'scale-3d': [`scale-3d`],
              skew: [{ skew: z() }],
              'skew-x': [{ 'skew-x': z() }],
              'skew-y': [{ 'skew-y': z() }],
              transform: [{ transform: [scope.Q, scope.Z, ``, `none`, `gpu`, `cpu`] }],
              'transform-origin': [{ origin: x() }],
              'transform-style': [{ transform: [`3d`, `flat`] }],
              translate: [{ translate: ue() }],
              'translate-x': [{ 'translate-x': ue() }],
              'translate-y': [{ 'translate-y': ue() }],
              'translate-z': [{ 'translate-z': ue() }],
              'translate-none': [`translate-none`],
              zoom: [{ zoom: [scope._f, scope.Q, scope.Z] }],
              accent: [{ accent: P() }],
              appearance: [{ appearance: [`none`, `auto`] }],
              'caret-color': [{ caret: P() }],
              'color-scheme': [
                { scheme: [`normal`, `dark`, `light`, `light-dark`, `only-dark`, `only-light`] },
              ],
              cursor: [
                {
                  cursor: [
                    `auto`,
                    `default`,
                    `pointer`,
                    `wait`,
                    `text`,
                    `move`,
                    `help`,
                    `not-allowed`,
                    `none`,
                    `context-menu`,
                    `progress`,
                    `cell`,
                    `crosshair`,
                    `vertical-text`,
                    `alias`,
                    `copy`,
                    `no-drop`,
                    `grab`,
                    `grabbing`,
                    `all-scroll`,
                    `col-resize`,
                    `row-resize`,
                    `n-resize`,
                    `e-resize`,
                    `s-resize`,
                    `w-resize`,
                    `ne-resize`,
                    `nw-resize`,
                    `se-resize`,
                    `sw-resize`,
                    `ew-resize`,
                    `ns-resize`,
                    `nesw-resize`,
                    `nwse-resize`,
                    `zoom-in`,
                    `zoom-out`,
                    scope.Q,
                    scope.Z,
                  ],
                },
              ],
              'field-sizing': [{ 'field-sizing': [`fixed`, `content`] }],
              'pointer-events': [{ 'pointer-events': [`auto`, `none`] }],
              resize: [{ resize: [`none`, ``, `y`, `x`] }],
              'scroll-behavior': [{ scroll: [`auto`, `smooth`] }],
              'scrollbar-thumb-color': [{ 'scrollbar-thumb': P() }],
              'scrollbar-track-color': [{ 'scrollbar-track': P() }],
              'scrollbar-gutter': [{ 'scrollbar-gutter': [`auto`, `stable`, `both`] }],
              'scrollbar-w': [{ scrollbar: [`auto`, `thin`, `none`] }],
              'scroll-m': [{ 'scroll-m': w() }],
              'scroll-mx': [{ 'scroll-mx': w() }],
              'scroll-my': [{ 'scroll-my': w() }],
              'scroll-ms': [{ 'scroll-ms': w() }],
              'scroll-me': [{ 'scroll-me': w() }],
              'scroll-mbs': [{ 'scroll-mbs': w() }],
              'scroll-mbe': [{ 'scroll-mbe': w() }],
              'scroll-mt': [{ 'scroll-mt': w() }],
              'scroll-mr': [{ 'scroll-mr': w() }],
              'scroll-mb': [{ 'scroll-mb': w() }],
              'scroll-ml': [{ 'scroll-ml': w() }],
              'scroll-p': [{ 'scroll-p': w() }],
              'scroll-px': [{ 'scroll-px': w() }],
              'scroll-py': [{ 'scroll-py': w() }],
              'scroll-ps': [{ 'scroll-ps': w() }],
              'scroll-pe': [{ 'scroll-pe': w() }],
              'scroll-pbs': [{ 'scroll-pbs': w() }],
              'scroll-pbe': [{ 'scroll-pbe': w() }],
              'scroll-pt': [{ 'scroll-pt': w() }],
              'scroll-pr': [{ 'scroll-pr': w() }],
              'scroll-pb': [{ 'scroll-pb': w() }],
              'scroll-pl': [{ 'scroll-pl': w() }],
              'snap-align': [{ snap: [`start`, `end`, `center`, `align-none`] }],
              'snap-stop': [{ snap: [`normal`, `always`] }],
              'snap-type': [{ snap: [`none`, `x`, `y`, `both`] }],
              'snap-strictness': [{ snap: [`mandatory`, `proximity`] }],
              touch: [{ touch: [`auto`, `none`, `manipulation`] }],
              'touch-x': [{ 'touch-pan': [`x`, `left`, `right`] }],
              'touch-y': [{ 'touch-pan': [`y`, `up`, `down`] }],
              'touch-pz': [`touch-pinch-zoom`],
              select: [{ select: [`none`, `text`, `all`, `auto`] }],
              'will-change': [
                { 'will-change': [`auto`, `scroll`, `contents`, `transform`, scope.Q, scope.Z] },
              ],
              fill: [{ fill: [`none`, ...P()] }],
              'stroke-w': [{ stroke: [scope.X, scope.Ff, scope.Of, scope.kf] }],
              stroke: [{ stroke: [`none`, ...P()] }],
              'forced-color-adjust': [{ 'forced-color-adjust': [`auto`, `none`] }],
            },
            conflictingClassGroups: {
              'container-named': [`container-type`],
              overflow: [`overflow-x`, `overflow-y`],
              overscroll: [`overscroll-x`, `overscroll-y`],
              inset: [
                `inset-x`,
                `inset-y`,
                `inset-bs`,
                `inset-be`,
                `start`,
                `end`,
                `top`,
                `right`,
                `bottom`,
                `left`,
              ],
              'inset-x': [`start`, `end`, `right`, `left`],
              'inset-y': [`inset-bs`, `inset-be`, `top`, `bottom`],
              flex: [`basis`, `grow`, `shrink`],
              gap: [`gap-x`, `gap-y`],
              p: [`px`, `py`, `ps`, `pe`, `pbs`, `pbe`, `pt`, `pr`, `pb`, `pl`],
              px: [`ps`, `pe`, `pr`, `pl`],
              py: [`pbs`, `pbe`, `pt`, `pb`],
              m: [`mx`, `my`, `ms`, `me`, `mbs`, `mbe`, `mt`, `mr`, `mb`, `ml`],
              mx: [`ms`, `me`, `mr`, `ml`],
              my: [`mbs`, `mbe`, `mt`, `mb`],
              size: [`w`, `h`],
              'font-size': [`leading`],
              'fvn-normal': [
                `fvn-ordinal`,
                `fvn-slashed-zero`,
                `fvn-figure`,
                `fvn-spacing`,
                `fvn-fraction`,
              ],
              'fvn-ordinal': [`fvn-normal`],
              'fvn-slashed-zero': [`fvn-normal`],
              'fvn-figure': [`fvn-normal`],
              'fvn-spacing': [`fvn-normal`],
              'fvn-fraction': [`fvn-normal`],
              'line-clamp': [`display`, `overflow`],
              rounded: [
                `rounded-s`,
                `rounded-e`,
                `rounded-t`,
                `rounded-r`,
                `rounded-b`,
                `rounded-l`,
                `rounded-ss`,
                `rounded-se`,
                `rounded-ee`,
                `rounded-es`,
                `rounded-tl`,
                `rounded-tr`,
                `rounded-br`,
                `rounded-bl`,
              ],
              'rounded-s': [`rounded-ss`, `rounded-es`],
              'rounded-e': [`rounded-se`, `rounded-ee`],
              'rounded-t': [`rounded-tl`, `rounded-tr`],
              'rounded-r': [`rounded-tr`, `rounded-br`],
              'rounded-b': [`rounded-br`, `rounded-bl`],
              'rounded-l': [`rounded-tl`, `rounded-bl`],
              'border-spacing': [`border-spacing-x`, `border-spacing-y`],
              'border-w': [
                `border-w-x`,
                `border-w-y`,
                `border-w-s`,
                `border-w-e`,
                `border-w-bs`,
                `border-w-be`,
                `border-w-t`,
                `border-w-r`,
                `border-w-b`,
                `border-w-l`,
              ],
              'border-w-x': [`border-w-s`, `border-w-e`, `border-w-r`, `border-w-l`],
              'border-w-y': [`border-w-bs`, `border-w-be`, `border-w-t`, `border-w-b`],
              'border-color': [
                `border-color-x`,
                `border-color-y`,
                `border-color-s`,
                `border-color-e`,
                `border-color-bs`,
                `border-color-be`,
                `border-color-t`,
                `border-color-r`,
                `border-color-b`,
                `border-color-l`,
              ],
              'border-color-x': [
                `border-color-s`,
                `border-color-e`,
                `border-color-r`,
                `border-color-l`,
              ],
              'border-color-y': [
                `border-color-bs`,
                `border-color-be`,
                `border-color-t`,
                `border-color-b`,
              ],
              translate: [`translate-x`, `translate-y`, `translate-none`],
              'translate-none': [`translate`, `translate-x`, `translate-y`, `translate-z`],
              'scroll-m': [
                `scroll-mx`,
                `scroll-my`,
                `scroll-ms`,
                `scroll-me`,
                `scroll-mbs`,
                `scroll-mbe`,
                `scroll-mt`,
                `scroll-mr`,
                `scroll-mb`,
                `scroll-ml`,
              ],
              'scroll-mx': [`scroll-ms`, `scroll-me`, `scroll-mr`, `scroll-ml`],
              'scroll-my': [`scroll-mbs`, `scroll-mbe`, `scroll-mt`, `scroll-mb`],
              'scroll-p': [
                `scroll-px`,
                `scroll-py`,
                `scroll-ps`,
                `scroll-pe`,
                `scroll-pbs`,
                `scroll-pbe`,
                `scroll-pt`,
                `scroll-pr`,
                `scroll-pb`,
                `scroll-pl`,
              ],
              'scroll-px': [`scroll-ps`, `scroll-pe`, `scroll-pr`, `scroll-pl`],
              'scroll-py': [`scroll-pbs`, `scroll-pbe`, `scroll-pt`, `scroll-pb`],
              touch: [`touch-x`, `touch-y`, `touch-pz`],
              'touch-x': [`touch`],
              'touch-y': [`touch`],
              'touch-pz': [`touch`],
            },
            conflictingClassGroupModifiers: { 'font-size': [`leading`] },
            postfixLookupClassGroups: [`container-type`],
            orderSensitiveModifiers: [
              `*`,
              `**`,
              `after`,
              `backdrop`,
              `before`,
              `details-content`,
              `file`,
              `first-letter`,
              `first-line`,
              `marker`,
              `placeholder`,
              `selection`,
            ],
          };
        });
        break;
      }
    }
  },
  storeProperties: {},
});

// 打包依赖：Motion、Lucide 和 Zustand 运行实现 — app published scope.

export const appRuntime = createUiModuleRuntime({
  bindingNames: [
    'K',
    'Te',
    'Ee',
    'De',
    'Oe',
    'ke',
    'Ae',
    'je',
    'Me',
    'Ne',
    'Pe',
    'Fe',
    'Ie',
    'Le',
    'Re',
    'ze',
    'Be',
    'Ve',
    'He',
    'Ue',
    'We',
    'Ge',
    'Ke',
    'qe',
    'Je',
    'Ye',
    'Xe',
    'Ze',
    'Qe',
    '$e',
    'et',
    'tt',
    'nt',
    'rt',
    'it',
    'at',
    'ot',
    'st',
    'ct',
    'lt',
    'ut',
    'dt',
    'ft',
    'pt',
    'mt',
    'ht',
    'gt',
    '_t',
    'vt',
    'yt',
    'bt',
    'xt',
    'St',
    'Ct',
    'wt',
    'Tt',
    'Et',
    'Dt',
    'Ot',
    'kt',
    'At',
    'jt',
    'Mt',
    'Nt',
  ],

  register(scope) {
    scope.K = function K({ children: e, ...t }) {
      let n = (0, scope.G.useContext)(scope.ie);
      ((t = { ...n, ...t }),
        (t.transition = (0, scope.D)(t.transition, n.transition)),
        (t.isStatic = (0, scope.k)(() => t.isStatic)));
      let r = (0, scope.G.useMemo)(
        () => t,
        [
          JSON.stringify(t.transition),
          t.transformPagePoint,
          t.reducedMotion,
          t.skipAnimations,
          t.isValidProp,
        ],
      );
      return (0, scope.W.jsx)(scope.ie.Provider, { value: r, children: e });
    };
    scope.Te = function Te() {
      !scope.I.current && (0, scope.S)();
      let [e] = (0, scope.G.useState)(scope.E.current);
      return e;
    };
    scope.jt = function jt(e, t = scope.At) {
      let n = scope.G.useSyncExternalStore(
        e.subscribe,
        scope.G.useCallback(() => t(e.getState()), [e, t]),
        scope.G.useCallback(() => t(e.getInitialState()), [e, t]),
      );
      return (scope.G.useDebugValue(n), n);
    };
  },
  initialize(scope, step, modules) {
    switch (step) {
      case 0: {
        scope.Ee = {
          name: `arrow-down-up`,
          size: 24,
          node: [
            [`path`, { d: `m3 16 4 4 4-4`, key: `1co6wj` }],
            [`path`, { d: `M7 20V4`, key: `1yoxec` }],
            [`path`, { d: `m21 8-4-4-4 4`, key: `1c9v7m` }],
            [`path`, { d: `M17 4v16`, key: `7dpous` }],
          ],
        };
        break;
      }
      case 1: {
        scope.Ee.node;
        break;
      }
      case 2: {
        scope.De = (0, scope.n)(scope.Ee);
        break;
      }
      case 3: {
        scope.Oe = {
          name: `chevron-right`,
          size: 24,
          node: [[`path`, { d: `m9 18 6-6-6-6`, key: `mthhwq` }]],
        };
        break;
      }
      case 4: {
        scope.Oe.node;
        break;
      }
      case 5: {
        scope.ke = (0, scope.n)(scope.Oe);
        break;
      }
      case 6: {
        scope.Ae = {
          name: `circle-dot`,
          size: 24,
          node: [
            [`circle`, { cx: `12`, cy: `12`, r: `1`, key: `41hilf` }],
            [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
          ],
        };
        break;
      }
      case 7: {
        scope.Ae.node;
        break;
      }
      case 8: {
        scope.je = (0, scope.n)(scope.Ae);
        break;
      }
      case 9: {
        scope.Me = {
          name: `compass`,
          size: 24,
          node: [
            [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
            [
              `path`,
              {
                d: `m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z`,
                key: `9ktpf1`,
              },
            ],
          ],
        };
        break;
      }
      case 10: {
        scope.Me.node;
        break;
      }
      case 11: {
        scope.Ne = (0, scope.n)(scope.Me);
        break;
      }
      case 12: {
        scope.Pe = {
          name: `file-key`,
          size: 24,
          node: [
            [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5`, key: `wfsgrz` }],
            [`path`, { d: `M4 12v6`, key: `bg1pfk` }],
            [`path`, { d: `M4 14h2`, key: `1sf9f8` }],
            [
              `path`,
              {
                d: `M9.65 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v4`,
                key: `d56i0q`,
              },
            ],
            [`circle`, { cx: `4`, cy: `20`, r: `2`, key: `6kqj1y` }],
          ],
          aliases: [`file-key-2`],
        };
        break;
      }
      case 13: {
        scope.Pe.node;
        break;
      }
      case 14: {
        scope.Fe = (0, scope.n)(scope.Pe);
        break;
      }
      case 15: {
        scope.Ie = {
          name: `folder`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,
                key: `1kt360`,
              },
            ],
          ],
        };
        break;
      }
      case 16: {
        scope.Ie.node;
        break;
      }
      case 17: {
        scope.Le = (0, scope.n)(scope.Ie);
        break;
      }
      case 18: {
        scope.Re = {
          name: `globe`,
          size: 24,
          node: [
            [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
            [`path`, { d: `M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20`, key: `13o1zl` }],
            [`path`, { d: `M2 12h20`, key: `9i4pu4` }],
          ],
        };
        break;
      }
      case 19: {
        scope.Re.node;
        break;
      }
      case 20: {
        scope.ze = (0, scope.n)(scope.Re);
        break;
      }
      case 21: {
        scope.Be = {
          name: `house`,
          size: 24,
          node: [
            [`path`, { d: `M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8`, key: `5wwlr5` }],
            [
              `path`,
              {
                d: `M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z`,
                key: `r6nss1`,
              },
            ],
          ],
          aliases: [`home`],
        };
        break;
      }
      case 22: {
        scope.Be.node;
        break;
      }
      case 23: {
        scope.Ve = (0, scope.n)(scope.Be);
        break;
      }
      case 24: {
        scope.He = {
          name: `import`,
          size: 24,
          node: [
            [`path`, { d: `M12 3v12`, key: `1x0j5s` }],
            [`path`, { d: `m8 11 4 4 4-4`, key: `1dohi6` }],
            [
              `path`,
              {
                d: `M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4`,
                key: `1ywtjm`,
              },
            ],
          ],
        };
        break;
      }
      case 25: {
        scope.He.node;
        break;
      }
      case 26: {
        scope.Ue = (0, scope.n)(scope.He);
        break;
      }
      case 27: {
        scope.We = {
          name: `key-round`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`,
                key: `1s6t7t`,
              },
            ],
            [`circle`, { cx: `16.5`, cy: `7.5`, r: `.5`, fill: `currentColor`, key: `w0ekpg` }],
          ],
        };
        break;
      }
      case 28: {
        scope.We.node;
        break;
      }
      case 29: {
        scope.Ge = (0, scope.n)(scope.We);
        break;
      }
      case 30: {
        scope.Ke = {
          name: `lightbulb`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5`,
                key: `1gvzjb`,
              },
            ],
            [`path`, { d: `M9 18h6`, key: `x1upvd` }],
            [`path`, { d: `M10 22h4`, key: `ceow96` }],
          ],
        };
        break;
      }
      case 31: {
        scope.Ke.node;
        break;
      }
      case 32: {
        scope.qe = (0, scope.n)(scope.Ke);
        break;
      }
      case 33: {
        scope.Je = {
          name: `lock`,
          size: 24,
          node: [
            [
              `rect`,
              { width: `18`, height: `11`, x: `3`, y: `11`, rx: `2`, ry: `2`, key: `1w4ew1` },
            ],
            [`path`, { d: `M7 11V7a5 5 0 0 1 10 0v4`, key: `fwvmzm` }],
          ],
        };
        break;
      }
      case 34: {
        scope.Je.node;
        break;
      }
      case 35: {
        scope.Ye = (0, scope.n)(scope.Je);
        break;
      }
      case 36: {
        scope.Xe = { name: `minus`, size: 24, node: [[`path`, { d: `M5 12h14`, key: `1ays0h` }]] };
        break;
      }
      case 37: {
        scope.Xe.node;
        break;
      }
      case 38: {
        scope.Ze = (0, scope.n)(scope.Xe);
        break;
      }
      case 39: {
        scope.Qe = {
          name: `mouse-pointer-click`,
          size: 24,
          node: [
            [`path`, { d: `M14 4.1 12 6`, key: `ita8i4` }],
            [`path`, { d: `m5.1 8-2.9-.8`, key: `1go3kf` }],
            [`path`, { d: `m6 12-1.9 2`, key: `mnht97` }],
            [`path`, { d: `M7.2 2.2 8 5.1`, key: `1cfko1` }],
            [
              `path`,
              {
                d: `M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z`,
                key: `s0h3yz`,
              },
            ],
          ],
        };
        break;
      }
      case 40: {
        scope.Qe.node;
        break;
      }
      case 41: {
        scope.$e = (0, scope.n)(scope.Qe);
        break;
      }
      case 42: {
        scope.et = {
          name: `move`,
          size: 24,
          node: [
            [`path`, { d: `M12 2v20`, key: `t6zp3m` }],
            [`path`, { d: `m15 19-3 3-3-3`, key: `11eu04` }],
            [`path`, { d: `m19 9 3 3-3 3`, key: `1mg7y2` }],
            [`path`, { d: `M2 12h20`, key: `9i4pu4` }],
            [`path`, { d: `m5 9-3 3 3 3`, key: `j64kie` }],
            [`path`, { d: `m9 5 3-3 3 3`, key: `l8vdw6` }],
          ],
        };
        break;
      }
      case 43: {
        scope.et.node;
        break;
      }
      case 44: {
        scope.tt = (0, scope.n)(scope.et);
        break;
      }
      case 45: {
        scope.nt = {
          name: `panel-right`,
          size: 24,
          node: [
            [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, key: `afitv7` }],
            [`path`, { d: `M15 3v18`, key: `14nvp0` }],
          ],
        };
        break;
      }
      case 46: {
        scope.nt.node;
        break;
      }
      case 47: {
        scope.rt = (0, scope.n)(scope.nt);
        break;
      }
      case 48: {
        scope.it = {
          name: `pin-off`,
          size: 24,
          node: [
            [`path`, { d: `M12 17v5`, key: `bb1du9` }],
            [`path`, { d: `M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89`, key: `znwnzq` }],
            [`path`, { d: `m2 2 20 20`, key: `1ooewy` }],
            [
              `path`,
              {
                d: `M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11`,
                key: `c9qhm2`,
              },
            ],
          ],
        };
        break;
      }
      case 49: {
        scope.it.node;
        break;
      }
      case 50: {
        scope.at = (0, scope.n)(scope.it);
        break;
      }
      case 51: {
        scope.ot = {
          name: `pin`,
          size: 24,
          node: [
            [`path`, { d: `M12 17v5`, key: `bb1du9` }],
            [
              `path`,
              {
                d: `M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z`,
                key: `1nkz8b`,
              },
            ],
          ],
        };
        break;
      }
      case 52: {
        scope.ot.node;
        break;
      }
      case 53: {
        scope.st = (0, scope.n)(scope.ot);
        break;
      }
      case 54: {
        scope.ct = {
          name: `rotate-ccw`,
          size: 24,
          node: [
            [`path`, { d: `M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`, key: `1357e3` }],
            [`path`, { d: `M3 3v5h5`, key: `1xhq8a` }],
          ],
        };
        break;
      }
      case 55: {
        scope.ct.node;
        break;
      }
      case 56: {
        scope.lt = (0, scope.n)(scope.ct);
        break;
      }
      case 57: {
        scope.ut = {
          name: `rotate-cw`,
          size: 24,
          node: [
            [`path`, { d: `M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8`, key: `1p45f6` }],
            [`path`, { d: `M21 3v5h-5`, key: `1q7to0` }],
          ],
        };
        break;
      }
      case 58: {
        scope.ut.node;
        break;
      }
      case 59: {
        scope.dt = (0, scope.n)(scope.ut);
        break;
      }
      case 60: {
        scope.ft = {
          name: `save`,
          size: 24,
          node: [
            [
              `path`,
              {
                d: `M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z`,
                key: `1c8476`,
              },
            ],
            [`path`, { d: `M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7`, key: `1ydtos` }],
            [`path`, { d: `M7 3v4a1 1 0 0 0 1 1h7`, key: `t51u73` }],
          ],
        };
        break;
      }
      case 61: {
        scope.ft.node;
        break;
      }
      case 62: {
        scope.pt = (0, scope.n)(scope.ft);
        break;
      }
      case 63: {
        scope.mt = {
          name: `scroll-text`,
          size: 24,
          node: [
            [`path`, { d: `M15 12h-5`, key: `r7krc0` }],
            [`path`, { d: `M15 8h-5`, key: `1khuty` }],
            [`path`, { d: `M19 17V5a2 2 0 0 0-2-2H4`, key: `zz82l3` }],
            [
              `path`,
              {
                d: `M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3`,
                key: `1ph1d7`,
              },
            ],
          ],
        };
        break;
      }
      case 64: {
        scope.mt.node;
        break;
      }
      case 65: {
        scope.ht = (0, scope.n)(scope.mt);
        break;
      }
      case 66: {
        scope.gt = {
          name: `square-check`,
          size: 24,
          node: [
            [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, key: `afitv7` }],
            [`path`, { d: `m16 9-5.5 5.5L8 12`, key: `xofnsj` }],
          ],
          aliases: [`check-square-2`],
        };
        break;
      }
      case 67: {
        scope.gt.node;
        break;
      }
      case 68: {
        scope._t = (0, scope.n)(scope.gt);
        break;
      }
      case 69: {
        scope.vt = {
          name: `square-plus`,
          size: 24,
          node: [
            [`rect`, { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, key: `afitv7` }],
            [`path`, { d: `M8 12h8`, key: `1wcyev` }],
            [`path`, { d: `M12 8v8`, key: `napkw2` }],
          ],
          aliases: [`plus-square`],
        };
        break;
      }
      case 70: {
        scope.vt.node;
        break;
      }
      case 71: {
        scope.yt = (0, scope.n)(scope.vt);
        break;
      }
      case 72: {
        scope.bt = {
          name: `text-cursor-input`,
          size: 24,
          node: [
            [`path`, { d: `M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6`, key: `1528k5` }],
            [`path`, { d: `M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7`, key: `13ksps` }],
            [`path`, { d: `M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1`, key: `1n9rhb` }],
            [`path`, { d: `M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1`, key: `1mj8rg` }],
            [`path`, { d: `M9 6v12`, key: `velyjx` }],
          ],
        };
        break;
      }
      case 73: {
        scope.bt.node;
        break;
      }
      case 74: {
        scope.xt = (0, scope.n)(scope.bt);
        break;
      }
      case 75: {
        scope.St = {
          name: `timer`,
          size: 24,
          node: [
            [`line`, { x1: `10`, x2: `14`, y1: `2`, y2: `2`, key: `14vaq8` }],
            [`line`, { x1: `12`, x2: `15`, y1: `14`, y2: `11`, key: `17fdiu` }],
            [`circle`, { cx: `12`, cy: `14`, r: `8`, key: `1e1u0o` }],
          ],
        };
        break;
      }
      case 76: {
        scope.St.node;
        break;
      }
      case 77: {
        scope.Ct = (0, scope.n)(scope.St);
        break;
      }
      case 78: {
        scope.wt = {
          name: `user-check`,
          size: 24,
          node: [
            [`path`, { d: `m16 11 2 2 4-4`, key: `9rsbq5` }],
            [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`, key: `1yyitq` }],
            [`circle`, { cx: `9`, cy: `7`, r: `4`, key: `nufk8` }],
          ],
        };
        break;
      }
      case 79: {
        scope.wt.node;
        break;
      }
      case 80: {
        scope.Tt = (0, scope.n)(scope.wt);
        break;
      }
      case 81: {
        scope.Et = {
          name: `user-plus`,
          size: 24,
          node: [
            [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`, key: `1yyitq` }],
            [`circle`, { cx: `9`, cy: `7`, r: `4`, key: `nufk8` }],
            [`line`, { x1: `19`, x2: `19`, y1: `8`, y2: `14`, key: `1bvyxn` }],
            [`line`, { x1: `22`, x2: `16`, y1: `11`, y2: `11`, key: `1shjgl` }],
          ],
        };
        break;
      }
      case 82: {
        scope.Et.node;
        break;
      }
      case 83: {
        scope.Dt = (0, scope.n)(scope.Et);
        break;
      }
      case 84: {
        scope.Ot = (e) => {
          let t,
            n = new Set(),
            r = (e, r) => {
              let i = typeof e == `function` ? e(t) : e;
              if (!Object.is(i, t)) {
                let e = t;
                ((t = (r ?? (typeof i != `object` || !i)) ? i : Object.assign({}, t, i)),
                  n.forEach((n) => n(t, e)));
              }
            },
            i = () => t,
            a = {
              setState: r,
              getState: i,
              getInitialState: () => o,
              subscribe: (e) => (n.add(e), () => n.delete(e)),
            },
            o = (t = e(r, i, a));
          return a;
        };
        break;
      }
      case 85: {
        scope.kt = (e) => (e ? (0, scope.Ot)(e) : scope.Ot);
        break;
      }
      case 86: {
        scope.At = (e) => e;
        break;
      }
      case 87: {
        scope.Mt = (e) => {
          let t = (0, scope.kt)(e),
            n = (e) => (0, scope.jt)(t, e);
          return (Object.assign(n, t), n);
        };
        break;
      }
      case 88: {
        scope.Nt = (e) => (e ? (0, scope.Mt)(e) : scope.Mt);
        break;
      }
    }
  },
  storeProperties: {},
});
