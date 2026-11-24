const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const workspace = path.resolve(__dirname, '..');
const buildRoot = path.join(workspace, 'output', 'chrome-mv3');
const port = Number(process.env.AAH_LOGIN_PREVIEW_PORT || 4176);
const builtinIds = [
  ...fs
    .readFileSync(path.join(workspace, 'src', 'modules', 'sites', 'view.js'), 'utf8')
    .matchAll(/id:\s*[`'"](builtin-[^`'"]+)[`'"]/g),
].map((match) => match[1]);
const entries = {
  multi: [
    { key: 'form:site-password', method: 'form', provider: 'site-password', label: '站内账号密码' },
    {
      key: 'github:github',
      method: 'github',
      provider: 'github',
      label: 'GitHub',
      matchText: '使用 GitHub 登录',
    },
    {
      key: 'oauth:google',
      method: 'oauth',
      provider: 'google',
      label: 'Google',
      matchText: '使用 Google 登录',
      hrefPath: '/oauth/google',
    },
    {
      key: 'oauth:linuxdo',
      method: 'oauth',
      provider: 'linuxdo',
      label: 'Linux DO',
      matchText: '使用 Linux DO 登录',
      hrefPath: '/oauth/linuxdo',
    },
    {
      key: 'manual:email-code',
      method: 'manual',
      provider: 'email-code',
      label: '邮箱验证码',
      matchText: '邮箱验证码登录',
    },
    {
      key: 'passkey:passkey',
      method: 'passkey',
      provider: 'passkey',
      label: 'Passkey / 通行密钥',
      matchText: '通行密钥登录',
    },
  ],
  github: [
    {
      key: 'github:github',
      method: 'github',
      provider: 'github',
      label: 'GitHub',
      matchText: '使用 GitHub 登录',
    },
  ],
  native: [
    { key: 'form:site-password', method: 'form', provider: 'site-password', label: '站内账号密码' },
  ],
  code: [
    {
      key: 'manual:email-code',
      method: 'manual',
      provider: 'email-code',
      label: '邮箱验证码',
      matchText: '邮箱验证码登录',
    },
  ],
};
const seed = {
  sites: [
    { id: 'preview-multi', name: '多入口测试站点', loginUrl: 'https://multi.example.test/login' },
    { id: 'preview-github', name: 'GitHub 单入口', loginUrl: 'https://github.example.test/login' },
    { id: 'preview-native', name: '站内密码单入口', loginUrl: 'https://native.example.test/login' },
    { id: 'preview-code', name: '邮箱验证码单入口', loginUrl: 'https://code.example.test/login' },
  ].map((site, index) => ({
    ...site,
    sortOrder: index,
    favicon: '/icon/32.png',
    loginMethod: 'form',
    selectors: {},
    checkin: { method: 'none' },
  })),
  accounts: [],
  proxies: [],
  status: {},
  results: {},
  balances: {},
  removedBuiltinSiteIds: builtinIds,
};
const shim = `
(() => {
  const seed = ${JSON.stringify(seed)}, entries = ${JSON.stringify(entries)};
  const saved = localStorage.getItem('aah-local-login-preview');
  const local = saved ? JSON.parse(saved) : structuredClone(seed);
  const listeners = new Set();
  const event = () => ({ addListener() {}, removeListener() {} });
  const storage = {
    async get(keys) {
      if (keys == null) return structuredClone(local);
      if (typeof keys === 'string') return { [keys]: structuredClone(local[keys]) };
      if (Array.isArray(keys)) return Object.fromEntries(keys.map(key => [key, structuredClone(local[key])]));
      return structuredClone({ ...keys, ...local });
    },
    async set(values) { Object.assign(local, structuredClone(values)); localStorage.setItem('aah-local-login-preview', JSON.stringify(local)); },
    async remove(keys) { for (const key of Array.isArray(keys) ? keys : [keys]) delete local[key]; localStorage.setItem('aah-local-login-preview', JSON.stringify(local)); },
  };
  async function answer(message) {
    if (message.type === 'GET_LIVE_TASKS') return { ok: true, feature: { live: [], queue: { pending: [] } } };
    if (message.type === 'GET_LEARNING') return { ok: true, feature: { learningSessions: [] } };
    if (message.type === 'PROBE_LOGIN_PAGE') {
      const current = local.sites.find(site => site.id === message.siteId),
        saved = current?.loginDiscovery?.result;
      if (saved && !message.force)
        return { ok: true, feature: { loginOptions: { ...structuredClone(saved), source: 'saved', persisted: true } } };
      if (message.savedOnly && !message.force)
        return { ok: true, feature: { loginOptions: {
          siteId: message.siteId, status: 'not-detected', methods: [], entries: [],
          source: 'none', persisted: false,
        } } };
      const kind = message.siteId.replace('preview-', ''), actual = entries[kind] || [],
        result = {
        siteId: message.siteId, status: actual.length > 1 ? 'multiple' : actual.length ? 'detected' : 'unknown',
        entries: structuredClone(actual), methods: [...new Set(actual.map(entry => entry.method))],
        evidence: actual.map(entry => '页面可见「' + entry.label + '」登录入口'),
        checkedAt: Date.now(),
      };
      if (current) {
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(current.loginUrl));
        current.loginDiscovery = {
          version: 1, urlKey: [...new Uint8Array(hash)].map(value => value.toString(16).padStart(2, '0')).join(''),
          result: structuredClone(result),
        };
        await storage.set({ sites: local.sites });
      }
      return { ok: true, feature: { loginOptions: { ...result, source: 'page', persisted: !!current } } };
    }
    if (message.type === 'MUTATE_APP') {
      const mutation = message.mutation;
      if (mutation.action === 'add-account') {
        local.accounts.push({ ...structuredClone(mutation.input), id: 'preview-account-' + Date.now() });
        await storage.set({ accounts: local.accounts });
        return { ok: true };
      }
      if (mutation.action === 'update-account') {
        const index = local.accounts.findIndex(account => account.id === mutation.accountId);
        if (index >= 0) Object.assign(local.accounts[index], structuredClone(mutation.patch));
        await storage.set({ accounts: local.accounts });
        return { ok: true };
      }
      return { ok: false, error: '本地预览只演示新增和编辑测试账号' };
    }
    return { ok: false, error: '本地预览不执行真实签到、代理或网络操作' };
  }
  globalThis.chrome = {
    storage: { local: storage, session: storage, onChanged: event() },
    runtime: {
      id: 'local-ui-preview',
      getManifest: () => ({ version: '0.2.2', version_name: '本地 UI 验证', name: '自助签到中转站' }),
      getURL: value => new URL(value, location.origin).href,
      onMessage: { addListener: listener => listeners.add(listener), removeListener: listener => listeners.delete(listener) },
      sendMessage(message, callback) {
        const operation = answer(message);
        if (callback) operation.then(callback, error => callback({ ok: false, error: error.message }));
        return operation;
      },
      openOptionsPage: async () => {},
    },
    tabs: { query: async () => [], create: async () => ({ id: 1 }), get: async () => null },
    windows: { WINDOW_ID_CURRENT: 1, getCurrent: async () => ({ id: 1 }), onFocusChanged: event() },
    bookmarks: { getTree: async () => [] },
  };
})();
`;
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
};
const wrapper = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>新版登录入口 · 侧边栏预览</title><style>body{margin:0;background:#e8eef6;font:14px system-ui;color:#26354a}header{padding:14px 18px;background:white;border-bottom:1px solid #dbe3ef}header strong{display:block;margin-bottom:4px}header small{color:#66768d}main{display:flex;justify-content:center;padding:14px;height:calc(100vh - 102px)}iframe{width:420px;max-width:100%;height:100%;border:1px solid #ccd8e8;border-radius:14px;background:white;box-shadow:0 10px 30px #213b6010}</style><header><strong>新版登录入口 · 420px 侧边栏预览</strong><small>本地测试数据 · 可选择多入口、GitHub、站内密码或邮箱验证码测试站点</small></header><main><iframe title="扩展侧边栏" src="/sidepanel.html"></iframe></main></html>`;

http
  .createServer((request, response) => {
    try {
      const url = new URL(request.url, `http://127.0.0.1:${port}`);
      if (url.pathname === '/') {
        response.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        });
        response.end(wrapper);
        return;
      }
      if (url.pathname === '/preview-shim.js') {
        response.writeHead(200, {
          'Content-Type': 'text/javascript; charset=utf-8',
          'Cache-Control': 'no-store',
        });
        response.end(shim);
        return;
      }
      const filename = path.resolve(buildRoot, `.${decodeURIComponent(url.pathname)}`);
      if (!filename.startsWith(buildRoot + path.sep) || !fs.statSync(filename).isFile())
        throw Error('Not found');
      let data = fs.readFileSync(filename);
      if (path.extname(filename) === '.html')
        data = Buffer.from(
          data.toString('utf8').replace('<head>', '<head><script src="/preview-shim.js"></script>'),
        );
      response.writeHead(200, {
        'Content-Type': contentTypes[path.extname(filename)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      response.end(data);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Local login UI preview: http://127.0.0.1:${port}/`);
  });
