const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const { test } = require('node:test');
const esbuild = require('esbuild');

const workspace = path.resolve(__dirname, '..');
const plain = (value) => JSON.parse(JSON.stringify(value));
const bundle = esbuild.buildSync({
  stdin: {
    contents: `
      export { bgEntryState } from './src/entries/background.js';
      export { handleSitesMessage, bgSitesState } from './src/modules/sites/service.js';
    `,
    resolveDir: workspace,
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
});

function site(id = 'site-a', loginUrl = 'https://shared.test/login') {
  return {
    id,
    name: id,
    loginUrl,
    selectors: { username: '#username', password: '#password', submit: '#submit' },
  };
}

async function fixture({
  sites = [site()],
  existingTabs = [],
  reply = (request, tab) => ({
    ok: true,
    feature: {
      loginOptions: {
        siteId: request.site.id,
        status: 'detected',
        methods: ['form'],
        evidence: ['页面显示站内账密表单'],
        pageUrl: tab.url,
      },
    },
  }),
  create,
} = {}) {
  const local = { sites: structuredClone(sites), accounts: [], proxies: [] },
    session = {},
    tabs = new Map(existingTabs.map((tab) => [tab.id, { ...tab }])),
    requests = [],
    created = [],
    removed = [],
    effects = { proxy: 0, cookie: 0 };
  let nextTabId = 100,
    now = 1700000000000,
    probeClock = false;
  const timers = new Set();
  const event = () => ({ addListener() {}, removeListener() {} });
  function area(data) {
    return {
      async get(keys) {
        if (keys == null) return structuredClone(data);
        if (typeof keys === 'string') return { [keys]: structuredClone(data[keys]) };
        if (Array.isArray(keys))
          return Object.fromEntries(keys.map((key) => [key, structuredClone(data[key])]));
        return structuredClone({ ...keys, ...data });
      },
      async set(values) {
        Object.assign(data, structuredClone(values));
      },
      async remove(keys) {
        for (const key of Array.isArray(keys) ? keys : [keys]) delete data[key];
      },
    };
  }
  class Clock extends Date {
    constructor(...args) {
      super(...(args.length ? args : [now]));
    }
    static now() {
      return now;
    }
  }
  const chrome = {
    storage: { local: area(local), session: area(session), onChanged: event() },
    runtime: {
      id: 'test-extension',
      getURL: (name) => `chrome-extension://test-extension/${name}`,
      getManifest: () => ({ version: '0.2.2' }),
      sendMessage: async () => ({ ok: true }),
      onInstalled: event(),
      onStartup: event(),
      onMessage: event(),
      openOptionsPage: async () => {},
    },
    alarms: { create: async () => {}, clear: async () => true, onAlarm: event() },
    proxy: {
      settings: {
        get: async () => ({
          value: { mode: 'system' },
          levelOfControl: 'controlled_by_this_extension',
        }),
        set: async () => {
          effects.proxy++;
        },
        clear: async () => {
          effects.proxy++;
        },
      },
    },
    tabs: {
      async query() {
        return [...tabs.values()].map((tab) => ({ ...tab }));
      },
      async create(options) {
        created.push(plain(options));
        if (create) return create(options, tabs);
        const tab = { id: nextTabId++, url: options.url, status: 'complete', windowId: 1 };
        tabs.set(tab.id, tab);
        return { ...tab };
      },
      async get(id) {
        if (!tabs.has(id)) throw new Error('No tab');
        return { ...tabs.get(id) };
      },
      async update(id, patch) {
        if (!tabs.has(id)) throw new Error('No tab');
        Object.assign(tabs.get(id), patch);
        return { ...tabs.get(id) };
      },
      async remove(id) {
        removed.push(id);
        tabs.delete(id);
      },
      async sendMessage(id, request, options) {
        requests.push({ tabId: id, request: plain(request), options: plain(options) });
        return reply(request, tabs.get(id), { local, tabs, now: () => now });
      },
      onCreated: event(),
      onUpdated: event(),
      onRemoved: event(),
    },
    action: {
      onClicked: event(),
      setBadgeText: async () => {},
      setBadgeBackgroundColor: async () => {},
    },
    sidePanel: { setPanelBehavior: async () => {} },
    webNavigation: { onErrorOccurred: event(), getAllFrames: async () => [] },
    webRequest: { onAuthRequired: event() },
    cookies: {
      getAll: async () => [],
      getAllCookieStores: async () => [],
      remove: async () => {
        effects.cookie++;
      },
    },
  };
  const module = { exports: {} };
  const context = vm.createContext({
    module,
    exports: module.exports,
    chrome,
    Date: Clock,
    console,
    URL,
    Blob,
    TextEncoder,
    TextDecoder,
    AbortController,
    structuredClone,
    crypto: webcrypto,
    setTimeout(callback, delay = 0, ...args) {
      const at = now + delay,
        scaled = probeClock && delay <= 6000,
        timer = setTimeout(
          () => {
            timers.delete(timer);
            if (scaled) now = Math.max(now, at);
            callback(...args);
          },
          scaled ? Math.max(1, Math.min(50, delay / 120)) : delay,
        );
      timers.add(timer);
      if (!scaled) timer.unref();
      return timer;
    },
    clearTimeout(timer) {
      timers.delete(timer);
      clearTimeout(timer);
    },
    setInterval(...args) {
      const timer = setInterval(...args);
      timer.unref();
      return timer;
    },
    clearInterval,
    fetch: async () => {
      throw new Error('Unexpected fetch during read-only page probe');
    },
  });
  vm.runInContext(bundle.outputFiles[0].text, context, { timeout: 10000 });
  await module.exports.bgEntryState.Qp;
  probeClock = true;
  const sender = { id: 'test-extension', url: 'chrome-extension://test-extension/options.html' };
  return {
    local,
    tabs,
    requests,
    created,
    removed,
    effects,
    sender,
    async probe(siteId = 'site-a', user = sender, extra = {}) {
      return module.exports.handleSitesMessage(
        { type: 'PROBE_LOGIN_PAGE', siteId, ...extra },
        user,
      );
    },
    advance(ms) {
      now += ms;
    },
    now: () => now,
    stop() {
      for (const timer of timers) clearTimeout(timer);
    },
  };
}

test('login page probe: only extension management pages may request an existing site', async (t) => {
  const runtime = await fixture();
  t.after(runtime.stop);
  for (const sender of [
    { id: 'test-extension', url: 'https://shared.test/login' },
    { id: 'other-extension', url: runtime.sender.url },
    { id: 'test-extension' },
  ])
    assert.equal((await runtime.probe('site-a', sender)).ok, false);
  const missing = await runtime.probe('missing', runtime.sender, {
    url: 'https://foreign.test/login',
  });
  assert.equal(missing.feature.loginOptions.status, 'unavailable');
  assert.deepEqual(plain(missing.feature.loginOptions.methods), []);
  assert.equal(runtime.created.length, 0);
  assert.equal(runtime.requests.length, 0);
});

test('login page probe: creates one read-only inactive tab and closes only that tab', async (t) => {
  const runtime = await fixture({ existingTabs: [{ id: 9, url: 'https://shared.test/profile' }] });
  t.after(runtime.stop);
  const before = { ...runtime.effects },
    result = await runtime.probe('site-a', runtime.sender, { url: 'https://foreign.test/login' });
  assert.equal(result.ok, true);
  assert.equal(result.feature.loginOptions.status, 'detected');
  assert.deepEqual(plain(result.feature.loginOptions.methods), ['form']);
  assert.deepEqual(runtime.created, [{ url: 'https://shared.test/login', active: false }]);
  assert.deepEqual(runtime.removed, [100]);
  assert.equal(runtime.tabs.has(9), true);
  assert.equal(runtime.requests[0].request.type, 'READ_LOGIN_OPTIONS');
  assert.deepEqual(runtime.requests[0].options, { frameId: 0 });
  assert.deepEqual(Object.keys(runtime.requests[0].request.site).sort(), [
    'id',
    'loginUrl',
    'selectors',
  ]);
  assert.deepEqual(runtime.effects, before);
});

test('login page probe: reuses only the exact login URL and never removes an existing tab', async (t) => {
  const runtime = await fixture({
    existingTabs: [
      { id: 8, url: 'https://shared.test/other-login' },
      { id: 9, url: 'https://shared.test/login' },
    ],
  });
  t.after(runtime.stop);
  await runtime.probe();
  assert.equal(runtime.created.length, 0);
  assert.equal(runtime.requests[0].tabId, 9);
  assert.deepEqual(runtime.removed, []);
  assert.equal(runtime.tabs.size, 2);
});

test('login page probe: saved results never expire and URL changes wait for an explicit update', async (t) => {
  const runtime = await fixture({ sites: [site(), site('site-b')] });
  t.after(runtime.stop);
  const [first, second] = await Promise.all([runtime.probe(), runtime.probe()]);
  assert.deepEqual(plain(first), plain(second));
  assert.equal(runtime.created.length, 1);
  await runtime.probe();
  assert.equal(runtime.created.length, 1);
  const other = await runtime.probe('site-b');
  assert.equal(other.feature.loginOptions.siteId, 'site-b');
  assert.equal(runtime.created.length, 2);
  runtime.local.sites[0].loginUrl = 'https://shared.test/new-login';
  const outdated = (await runtime.probe()).feature.loginOptions;
  assert.equal(outdated.status, 'outdated');
  assert.equal(runtime.created.length, 2);
  await runtime.probe('site-a', runtime.sender, { force: true });
  assert.equal(runtime.created.length, 3);
  assert.equal(runtime.created[2].url, 'https://shared.test/new-login');
  runtime.advance(30001);
  await runtime.probe('site-b');
  assert.equal(runtime.created.length, 3);
});

test('login page probe: a saved catalog survives a new background runtime without reopening a page', async (t) => {
  const original = await fixture({
    sites: [site('site-a', 'https://shared.test/login?private=source-secret')],
  });
  t.after(original.stop);
  const first = (await original.probe()).feature.loginOptions,
    saved = original.local.sites[0].loginDiscovery;
  assert.equal(first.persisted, true);
  assert.equal(first.source, 'page');
  assert.match(saved.urlKey, /^[a-f0-9]{64}$/);
  assert.equal(JSON.stringify(saved).includes('source-secret'), false);
  const restarted = await fixture({ sites: plain(original.local.sites) });
  t.after(restarted.stop);
  restarted.advance(30 * 86400000);
  const result = (await restarted.probe()).feature.loginOptions;
  assert.equal(result.source, 'saved');
  assert.equal(result.checkedAt, first.checkedAt);
  assert.deepEqual(plain(result.methods), ['form']);
  assert.equal(restarted.created.length, 0);
  assert.equal(restarted.requests.length, 0);
});

test('login page probe: saved-only account editing never opens a page before its explicit update', async (t) => {
  const runtime = await fixture();
  t.after(runtime.stop);
  const initial = (await runtime.probe('site-a', runtime.sender, { savedOnly: true })).feature
    .loginOptions;
  assert.equal(initial.status, 'not-detected');
  assert.equal(runtime.created.length, 0);
  assert.equal(runtime.requests.length, 0);
  await runtime.probe('site-a', runtime.sender, { force: true, savedOnly: true });
  const saved = (await runtime.probe('site-a', runtime.sender, { savedOnly: true })).feature
    .loginOptions;
  assert.equal(saved.source, 'saved');
  assert.equal(runtime.created.length, 1);
});

test('login page probe: an unsuccessful first attempt is remembered rather than retried for every account', async (t) => {
  const runtime = await fixture({
    reply: (request, tab) => ({
      ok: true,
      feature: {
        loginOptions: {
          siteId: request.site.id,
          status: 'already-logged-in',
          methods: [],
          pageUrl: tab.url,
        },
      },
    }),
  });
  t.after(runtime.stop);
  const first = (await runtime.probe()).feature.loginOptions;
  assert.equal(first.status, 'already-logged-in');
  runtime.advance(86400000);
  assert.equal((await runtime.probe()).feature.loginOptions.source, 'saved');
  assert.equal(runtime.created.length, 1);
  const restarted = await fixture({ sites: plain(runtime.local.sites) });
  t.after(restarted.stop);
  assert.equal((await restarted.probe()).feature.loginOptions.status, 'already-logged-in');
  assert.equal(restarted.created.length, 0);
});

test('login page probe: a failed manual update preserves usable saved entries until another explicit update succeeds', async (t) => {
  let method = 'form';
  const runtime = await fixture({
    reply: (request, tab) => ({
      ok: true,
      feature: {
        loginOptions: {
          siteId: request.site.id,
          status: method ? 'detected' : 'already-logged-in',
          methods: method ? [method] : [],
          pageUrl: tab.url,
          evidence: method ? [] : ['当前页面已经登录，未显示入口'],
        },
      },
    }),
  });
  t.after(runtime.stop);
  const first = (await runtime.probe()).feature.loginOptions;
  method = '';
  const failed = (await runtime.probe('site-a', runtime.sender, { force: true })).feature
    .loginOptions;
  assert.deepEqual(plain(failed.methods), ['form']);
  assert.equal(failed.checkedAt, first.checkedAt);
  assert.match(failed.updateError, /继续使用已保存/);
  assert.match((await runtime.probe()).feature.loginOptions.updateError, /继续使用已保存/);
  assert.equal(runtime.created.length, 2);
  method = 'github';
  const updated = (await runtime.probe('site-a', runtime.sender, { force: true })).feature
    .loginOptions;
  assert.deepEqual(plain(updated.methods), ['github']);
  assert.equal(updated.updateError, undefined);
  assert.equal(runtime.created.length, 3);
});

test('login page probe: explicit retry bypasses successful cache while concurrent retries still merge', async (t) => {
  let method = 'form';
  const runtime = await fixture({
    reply: (request, tab) => ({
      ok: true,
      feature: { loginOptions: { siteId: request.site.id, methods: [method], pageUrl: tab.url } },
    }),
  });
  t.after(runtime.stop);
  await runtime.probe();
  method = 'github';
  assert.deepEqual(plain((await runtime.probe()).feature.loginOptions.methods), ['form']);
  assert.equal(runtime.created.length, 1);
  const [first, second] = await Promise.all([
    runtime.probe('site-a', runtime.sender, { force: true }),
    runtime.probe('site-a', runtime.sender, { force: true }),
  ]);
  assert.deepEqual(plain(first.feature.loginOptions.methods), ['github']);
  assert.deepEqual(plain(first), plain(second));
  assert.equal(runtime.created.length, 2);
  assert.equal(runtime.requests.length, 4);
});

test('login page probe: missing and different response site IDs never supply methods', async (t) => {
  for (const responseSiteId of [undefined, 'another-site']) {
    const runtime = await fixture({
      reply: (request, tab) => ({
        ok: true,
        feature: {
          loginOptions: { siteId: responseSiteId, methods: ['github'], pageUrl: tab.url },
        },
      }),
    });
    t.after(runtime.stop);
    const result = (await runtime.probe()).feature.loginOptions;
    assert.equal(result.status, 'unknown');
    assert.deepEqual(plain(result.methods), []);
    assert.deepEqual(runtime.removed, [100]);
  }
});

test('login page probe: reports multiple actual methods and filters unsupported response fields', async (t) => {
  const runtime = await fixture({
    reply: (request, tab) => ({
      ok: true,
      feature: {
        loginOptions: {
          siteId: request.site.id,
          status: 'detected',
          methods: ['github', 'form', 'github', 'token', 'unsupported'],
          evidence: ['站内账密和 GitHub 入口都可见', null],
          pageUrl: tab.url,
        },
      },
    }),
  });
  t.after(runtime.stop);
  const result = (await runtime.probe()).feature.loginOptions;
  assert.equal(result.status, 'multiple');
  assert.deepEqual(plain(result.methods), ['github', 'form']);
  assert.deepEqual(plain(result.evidence), ['站内账密和 GitHub 入口都可见']);
});

test('login page probe: preserves exact provider entries and counts different OAuth providers separately', async (t) => {
  const runtime = await fixture({
    reply: (request, tab) => ({
      ok: true,
      feature: {
        loginOptions: {
          siteId: request.site.id,
          methods: ['oauth'],
          entries: [
            {
              key: 'oauth:google',
              method: 'oauth',
              provider: 'google',
              label: 'Google',
              matchText: '使用 Google 登录',
              hrefPath: '/oauth/google?token=not-returned#private',
              password: 'not-returned',
              selector: 'not-returned',
            },
            {
              key: 'oauth:linuxdo',
              method: 'oauth',
              provider: 'linuxdo',
              label: 'Linux DO',
              matchText: '使用 Linux DO 登录',
              hrefPath: '/oauth/linuxdo',
            },
          ],
          pageUrl: tab.url,
        },
      },
    }),
  });
  t.after(runtime.stop);
  const result = (await runtime.probe()).feature.loginOptions;
  assert.equal(result.status, 'multiple');
  assert.deepEqual(plain(result.methods), ['oauth']);
  assert.deepEqual(plain(result.entries), [
    {
      key: 'oauth:google',
      method: 'oauth',
      label: 'Google',
      provider: 'google',
      matchText: '使用 Google 登录',
      hrefPath: '/oauth/google',
    },
    {
      key: 'oauth:linuxdo',
      method: 'oauth',
      label: 'Linux DO',
      provider: 'linuxdo',
      matchText: '使用 Linux DO 登录',
      hrefPath: '/oauth/linuxdo',
    },
  ]);
  result.entries[0].label = 'changed by caller';
  assert.equal((await runtime.probe()).feature.loginOptions.entries[0].label, 'Google');
});

test('login page probe: validates catalog metadata and never sends site or account secrets', async (t) => {
  const secretSite = {
    ...site(),
    successIndicator: '#logged-in',
    tokenConfig: { storageKey: 'secret-token' },
    githubPassword: 'secret-github',
    selectors: {
      username: '#username',
      password: '#password',
      submit: '#submit',
      accessToken: 'secret-selector-token',
      account: { password: 'secret-account' },
    },
  };
  const runtime = await fixture({
    sites: [secretSite],
    reply: (request, tab) => ({
      ok: true,
      feature: {
        loginOptions: {
          siteId: request.site.id,
          entries: [
            {
              key: 'manual:email-code',
              method: 'manual',
              label: '邮箱验证码',
              provider: 'email-code',
              hrefPath: 'https://user:password@foreign.test/login?token=secret',
            },
            { key: 'manual:email-code', method: 'manual', label: 'duplicate' },
            { key: 'token:secret', method: 'token', label: 'unsupported' },
            { key: 'bad?token=secret', method: 'oauth', label: 'unsafe key' },
            { key: 'missing:label', method: 'oauth' },
            { key: 'bad:control', method: 'oauth', label: 'bad\u0000label' },
          ],
          pageUrl: tab.url,
        },
      },
    }),
  });
  t.after(runtime.stop);
  const before = { ...runtime.effects },
    result = (await runtime.probe()).feature.loginOptions;
  assert.equal(result.status, 'detected');
  assert.deepEqual(plain(result.methods), ['manual']);
  assert.deepEqual(plain(result.entries), [
    { key: 'manual:email-code', method: 'manual', label: '邮箱验证码', provider: 'email-code' },
  ]);
  assert.deepEqual(runtime.requests[0].request.site, {
    id: 'site-a',
    loginUrl: 'https://shared.test/login',
    selectors: { username: '#username', password: '#password', submit: '#submit' },
    successIndicator: '#logged-in',
  });
  assert.doesNotMatch(JSON.stringify(runtime.requests), /secret-/);
  assert.deepEqual(runtime.effects, before);
});

test('login page probe: provider changes with the same canonical method require stable entry samples', async (t) => {
  let calls = 0;
  const runtime = await fixture({
    reply: (request, tab) => {
      const provider = ++calls === 1 ? 'google' : 'linuxdo';
      return {
        ok: true,
        feature: {
          loginOptions: {
            siteId: request.site.id,
            methods: ['oauth'],
            entries: [{ key: `oauth:${provider}`, method: 'oauth', provider, label: provider }],
            pageUrl: tab.url,
          },
        },
      };
    },
  });
  t.after(runtime.stop);
  const before = runtime.now(),
    result = (await runtime.probe()).feature.loginOptions;
  assert.equal(result.status, 'detected');
  assert.equal(result.entries[0].provider, 'linuxdo');
  assert.equal(calls, 3);
  assert.equal(runtime.now() - before, 400);
});

test('login page probe: authenticated redirects remain unknown without clearing their session', async (t) => {
  const runtime = await fixture({
    reply: (request, tab) => {
      tab.url = 'https://shared.test/dashboard?access_token=must-not-return';
      return {
        ok: true,
        feature: {
          loginOptions: {
            siteId: request.site.id,
            status: 'already-logged-in',
            methods: [],
            evidence: ['当前页面已经登录'],
            pageUrl: tab.url,
          },
        },
      };
    },
  });
  t.after(runtime.stop);
  const before = { ...runtime.effects },
    result = (await runtime.probe()).feature.loginOptions;
  assert.equal(result.status, 'already-logged-in');
  assert.deepEqual(plain(result.methods), []);
  assert.equal(result.pageUrl, 'https://shared.test/dashboard');
  assert.deepEqual(runtime.effects, before);
  assert.deepEqual(runtime.removed, [100]);
});

test('login page probe: official GitHub redirects identify GitHub without dispatching any credentials', async (t) => {
  const runtime = await fixture({
    create: async (options, tabs) => {
      const tab = { id: 101, url: 'https://github.com/login/oauth/authorize?client_id=private' };
      tabs.set(tab.id, tab);
      return { ...tab };
    },
  });
  t.after(runtime.stop);
  const result = (await runtime.probe()).feature.loginOptions;
  assert.equal(result.status, 'detected');
  assert.deepEqual(plain(result.methods), ['github']);
  assert.equal(result.pageUrl, 'https://github.com/login/oauth/authorize');
  assert.equal(runtime.requests.length, 0);
  assert.deepEqual(runtime.removed, [101]);
});

test('login page probe: foreign redirects and stale site addresses never supply guessed methods', async (t) => {
  const foreign = await fixture({
    create: async (options, tabs) => {
      const tab = { id: 102, url: 'https://github.com.foreign.test/login' };
      tabs.set(tab.id, tab);
      return tab;
    },
  });
  t.after(foreign.stop);
  const redirected = (await foreign.probe()).feature.loginOptions;
  assert.equal(redirected.status, 'unknown');
  assert.deepEqual(plain(redirected.methods), []);
  assert.equal(foreign.requests.length, 0);
  const changed = await fixture({
    reply: (request, tab, state) => {
      state.local.sites[0].loginUrl = 'https://shared.test/changed';
      return {
        ok: true,
        feature: {
          loginOptions: { siteId: request.site.id, methods: ['form'], pageUrl: tab.url },
        },
      };
    },
  });
  t.after(changed.stop);
  const stale = (await changed.probe()).feature.loginOptions;
  assert.equal(stale.status, 'outdated');
  assert.deepEqual(plain(stale.methods), []);
  assert.match(stale.evidence[0], /已变更/);
});

test('login page probe: content readiness retries stay within six seconds and clean the owned tab', async (t) => {
  let calls = 0;
  const ready = await fixture({
    reply: (request, tab) => {
      if (++calls < 3) throw new Error('Receiving end does not exist');
      return {
        ok: true,
        feature: {
          loginOptions: { siteId: request.site.id, methods: ['github'], pageUrl: tab.url },
        },
      };
    },
  });
  t.after(ready.stop);
  const beforeReady = ready.now(),
    detected = (await ready.probe()).feature.loginOptions;
  assert.equal(detected.status, 'detected');
  assert.equal(calls, 4);
  assert.equal(ready.now() - beforeReady, 440);
  assert.deepEqual(ready.removed, [100]);
  const pending = await fixture({ reply: () => new Promise(() => {}) });
  t.after(pending.stop);
  const beforeTimeout = pending.now(),
    result = (await pending.probe()).feature.loginOptions;
  assert.equal(result.status, 'unavailable');
  assert.deepEqual(plain(result.methods), []);
  assert.equal(pending.now() - beforeTimeout, 6000);
  await Promise.resolve();
  assert.deepEqual(pending.removed, [100]);
});

test('login page probe: loading and changing method sets need consistent samples before completion', async (t) => {
  let calls = 0;
  const runtime = await fixture({
    reply: (request, tab) => {
      const methods = ++calls === 1 ? [] : calls === 2 ? ['form'] : ['form', 'github'];
      return {
        ok: true,
        feature: {
          loginOptions: {
            siteId: request.site.id,
            status: methods.length ? 'detected' : 'unknown',
            methods,
            evidence: ['登录控件正在渲染'],
            pageUrl: tab.url,
          },
        },
      };
    },
  });
  t.after(runtime.stop);
  const before = runtime.now(),
    result = (await runtime.probe()).feature.loginOptions;
  assert.equal(result.status, 'multiple');
  assert.deepEqual(plain(result.methods), ['form', 'github']);
  assert.equal(calls, 4);
  assert.equal(runtime.now() - before, 520);
});

test('login page probe: a delayed tab creation is also closed after the request times out', async (t) => {
  let resolveCreation;
  const runtime = await fixture({
    create: (options, tabs) =>
      new Promise((resolve) => {
        resolveCreation = () => {
          const tab = { id: 103, url: options.url };
          tabs.set(tab.id, tab);
          resolve(tab);
        };
      }),
  });
  t.after(runtime.stop);
  const result = (await runtime.probe()).feature.loginOptions;
  assert.equal(result.status, 'unavailable');
  assert.deepEqual(runtime.removed, []);
  resolveCreation();
  for (let index = 0; index < 8; index++) await Promise.resolve();
  assert.deepEqual(runtime.removed, [103]);
  assert.equal(runtime.tabs.has(103), false);
});
