const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const { test } = require('node:test');
const esbuild = require('esbuild');

const workspace = path.resolve(__dirname, '..');
const source = esbuild.buildSync({
  stdin: {
    contents: `import './src/entries/background.js';`,
    resolveDir: workspace,
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
}).outputFiles[0].text;
const plain = (value) => JSON.parse(JSON.stringify(value));

function fixture(script) {
  const site = {
    id: 'site-a',
    name: 'A',
    loginUrl: 'https://site.test/login',
    loginMethod: 'github',
    selectors: {},
    checkin: {
      method: 'workflow',
      workflow: { route: ['/profile'], identityPath: '/profile', steps: [] },
    },
  };
  const account = {
    id: 'alice',
    siteId: site.id,
    username: 'alice',
    password: 'test-site-password',
    githubUsername: 'alice-github',
    githubPassword: 'test-github-password',
    loginMethod: 'auto',
  };
  const local = { sites: [site], accounts: [account] };
  const session = {};
  const listeners = [];
  const event = () => ({ addListener() {}, removeListener() {} });
  function storage(data) {
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
  const chrome = {
    storage: { local: storage(local), session: storage(session), onChanged: event() },
    runtime: {
      id: 'test-extension',
      getURL: (filename) => `chrome-extension://test-extension/${filename}`,
      getManifest: () => ({ version: '0.2.2' }),
      sendMessage: async () => ({ ok: true }),
      onInstalled: event(),
      onStartup: event(),
      onMessage: { addListener: (listener) => listeners.push(listener) },
      openOptionsPage: async () => {},
    },
    alarms: { create: async () => {}, clear: async () => true, onAlarm: event() },
    proxy: {
      settings: {
        set: async () => {},
        get: async () => ({
          value: { mode: 'system' },
          levelOfControl: 'controlled_by_this_extension',
        }),
        clear: async () => {},
      },
    },
    tabs: {
      get: async (id) => ({ id, windowId: 1, url: site.loginUrl }),
      query: async () => [],
      create: async ({ url }) => ({ id: 10, windowId: 1, url }),
      update: async (id, patch) => ({ id, windowId: 1, url: patch.url ?? site.loginUrl }),
      remove: async () => {},
      sendMessage: async () => ({ ok: true }),
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
    webNavigation: {
      onErrorOccurred: event(),
      getAllFrames: async () => [{ frameId: 0, url: site.loginUrl }],
    },
    webRequest: { onAuthRequired: event() },
    cookies: { getAll: async () => [], getAllCookieStores: async () => [] },
  };
  const context = vm.createContext({
    module: { exports: {} },
    chrome,
    console: { log() {}, warn() {}, error() {}, info() {}, debug() {} },
    URL,
    Blob,
    TextEncoder,
    TextDecoder,
    AbortController,
    crypto: webcrypto,
    setTimeout: (...args) => {
      const timer = setTimeout(...args);
      timer.unref();
      return timer;
    },
    clearTimeout,
    setInterval: (...args) => {
      const timer = setInterval(...args);
      timer.unref();
      return timer;
    },
    clearInterval,
    fetch: async () => {
      throw Error('A routing test must not access a live site');
    },
  });
  vm.runInContext(script, context, { timeout: 10000 });
  assert.equal(listeners.length, 1, 'The actual entry must install one background dispatcher');
  session['task:1'] = {
    tabId: 1,
    runId: 'run-alice',
    accountId: account.id,
    siteId: site.id,
    username: account.username,
    password: account.password,
    githubUsername: account.githubUsername,
    githubPassword: account.githubPassword,
    site,
    loginMethodPreference: 'auto',
    effectiveLoginMethod: 'auto',
    effectiveCheckinMethod: 'workflow',
    stage: 'login',
    steps: [],
    siteAccountCount: 1,
    siteAccountUserIds: {},
    createdAt: Date.now(),
  };
  const sender = {
    id: chrome.runtime.id,
    frameId: 0,
    tab: { id: 1, url: site.loginUrl },
    url: site.loginUrl,
  };
  async function dispatch(message, selectedSender = sender) {
    return new Promise((resolve) => {
      assert.equal(listeners[0](message, selectedSender, resolve), true);
    });
  }
  return { account, site, local, session, sender, dispatch };
}

for (const kind of ['source', 'output']) {
  const script =
    kind === 'source'
      ? source
      : fs.readFileSync(
          path.join(workspace, 'output', 'chrome-mv3', 'background', 'checkin-service.js'),
          'utf8',
        );

  test(`${kind} routing: detected native login reaches resolution, proof and identity handlers`, async () => {
    const current = fixture(script);
    const resolve = await current.dispatch({
      type: 'RESOLVE_LOGIN_METHOD',
      runId: 'run-alice',
      method: 'form',
    });
    assert.equal(resolve.ok, true, resolve.error);
    assert.equal(resolve.feature?.effectiveLoginMethod, 'form');
    assert.equal(current.session['task:1'].effectiveLoginMethod, 'form');
    const stage = await current.dispatch({
      type: 'SET_STAGE',
      runId: 'run-alice',
      stage: 'login',
      steps: [],
    });
    assert.equal(stage.ok, true, stage.error);
    const proof = await current.dispatch({
      type: 'FORM_CREDENTIALS_SUBMITTED',
      runId: 'run-alice',
    });
    assert.equal(proof.ok, true, proof.error);
    assert.equal(proof.feature?.formCredentialsSubmitted, true);
    const identity = await current.dispatch({
      type: 'SAVE_IDENTITY',
      runId: 'run-alice',
      identity: {
        userId: '101',
        username: 'alice',
        source: 'visible',
        verifiedByManagedLogin: true,
      },
    });
    assert.equal(identity.ok, true, identity.error);
    assert.equal(current.local.accounts[0].identity?.userId, '101');
    assert.equal(current.session['task:1'].accountIdentityUserId, '101');
    assert.equal(current.local.sites[0].loginMethod, 'github');
    assert.equal(current.local.accounts[0].loginMethod, 'auto');
  });

  test(`${kind} routing: detected GitHub reaches the handler and invalid senders cannot select credentials`, async () => {
    const current = fixture(script);
    const before = plain(current.session['task:1']);
    for (const sender of [
      { ...current.sender, id: 'another-extension' },
      { ...current.sender, frameId: 1 },
      { ...current.sender, url: 'https://foreign.test/login' },
      { ...current.sender, tab: { id: 2 } },
    ]) {
      const rejected = await current.dispatch(
        { type: 'RESOLVE_LOGIN_METHOD', runId: 'run-alice', method: 'github' },
        sender,
      );
      assert.equal(rejected.ok, false);
    }
    assert.deepEqual(plain(current.session['task:1']), before);
    const accepted = await current.dispatch({
      type: 'RESOLVE_LOGIN_METHOD',
      runId: 'run-alice',
      method: 'github',
    });
    assert.equal(accepted.ok, true, accepted.error);
    assert.equal(accepted.feature?.effectiveLoginMethod, 'github');
    assert.equal(current.session['task:1'].effectiveLoginMethod, 'github');
    assert.equal(current.local.accounts[0].password, 'test-site-password');
    assert.equal(current.local.accounts[0].githubPassword, 'test-github-password');
  });

  test(`${kind} routing: page-completed email-code login resolves without claiming password submission`, async () => {
    const current = fixture(script);
    delete current.local.accounts[0].password;
    delete current.session['task:1'].password;
    const response = await current.dispatch({
      type: 'RESOLVE_LOGIN_METHOD',
      runId: 'run-alice',
      method: 'manual',
      loginEntry: {
        key: 'manual:email-code',
        method: 'manual',
        label: '邮箱验证码登录',
        provider: 'email-code',
        matchText: '邮箱验证码登录',
        hrefPath: '/login/code?state=private-state#private-fragment',
      },
    });
    assert.equal(response.ok, true, response.error);
    assert.equal(response.feature?.effectiveLoginMethod, 'manual');
    assert.equal(current.session['task:1'].effectiveLoginMethod, 'manual');
    assert.equal(current.session['task:1'].loginEntry.provider, 'email-code');
    assert.equal(current.session['task:1'].loginEntry.hrefPath, '/login/code');
    const proof = await current.dispatch({
      type: 'FORM_CREDENTIALS_SUBMITTED',
      runId: 'run-alice',
    });
    assert.equal(proof.ok, false);
    assert.notEqual(current.session['task:1'].formCredentialsSubmitted, true);
    assert.equal(current.local.accounts[0].password, undefined);
  });

  test(`${kind} routing: manual login waiting retains the active queue and accepts only its own page`, async () => {
    const current = fixture(script);
    const task = current.session['task:1'];
    task.effectiveLoginMethod = 'manual';
    task.stage = 'verify-manual';
    current.session.checkinQueue = {
      pendingAccountIds: [],
      active: { accountId: 'alice', tabId: 1, startedAt: Date.now() },
    };
    const message = {
      type: 'MANUAL_LOGIN_WAITING',
      runId: 'run-alice',
      message: '请在当前页面完成邮箱验证码，完成后继续签到',
      steps: ['进入邮箱验证码登录'],
    };
    const before = plain(current.session);
    for (const sender of [
      { ...current.sender, id: 'another-extension' },
      { ...current.sender, frameId: 1 },
      { ...current.sender, url: 'https://foreign.test/login' },
      { ...current.sender, tab: { id: 2 } },
    ]) {
      const rejected = await current.dispatch(message, sender);
      assert.equal(rejected.ok, false);
    }
    assert.deepEqual(plain(current.session), before);
    const accepted = await current.dispatch(message);
    assert.equal(accepted.ok, true, accepted.error);
    assert.equal(current.session.checkinQueue.active?.accountId, 'alice');
    assert.equal(current.session.checkinQueue.active?.tabId, 1);
    assert.equal(current.session['task:1'].stage, 'verify-manual');
    assert.equal(current.session['task:1'].runId, 'run-alice');
    const resumed = await current.dispatch({
      type: 'SET_STAGE',
      runId: 'run-alice',
      stage: 'checkin',
      steps: ['实时身份已确认'],
    });
    assert.equal(resumed.ok, true, resumed.error);
    assert.equal(current.session.checkinQueue.active?.tabId, 1);
    assert.equal(current.session['task:1'].stage, 'checkin');
  });

  test(`${kind} routing: manual wait cannot reactivate a released queue or a different login mode`, async () => {
    const current = fixture(script);
    const message = {
      type: 'MANUAL_LOGIN_WAITING',
      runId: 'run-alice',
      message: '等待页面验证',
      steps: [],
    };
    current.session['task:1'].stage = 'verify-manual';
    current.session.checkinQueue = {
      pendingAccountIds: [],
      active: { accountId: 'alice', tabId: 1, startedAt: Date.now() },
    };
    assert.equal((await current.dispatch(message)).ok, false);
    current.session['task:1'].effectiveLoginMethod = 'manual';
    current.session.checkinQueue = { pendingAccountIds: [] };
    assert.equal((await current.dispatch(message)).ok, false);
    assert.equal(current.session.checkinQueue.active, undefined);
  });

  test(`${kind} routing: the page probe reaches the permission-checked site handler`, async () => {
    const current = fixture(script);
    const rejected = await current.dispatch({
      type: 'PROBE_LOGIN_PAGE',
      siteId: current.site.id,
    });
    assert.equal(rejected.ok, false);
    assert.match(rejected.error, /管理|扩展/);
    const missing = await current.dispatch(
      { type: 'PROBE_LOGIN_PAGE', siteId: 'missing-routing-test-site' },
      { id: 'test-extension', url: 'chrome-extension://test-extension/options.html' },
    );
    assert.equal(missing.ok, true, missing.error);
    assert.equal(missing.feature?.loginOptions?.siteId, 'missing-routing-test-site');
    assert.deepEqual(plain(missing.feature.loginOptions.methods), []);
    assert.match(missing.feature.loginOptions.status, /unknown|unavailable/);
  });

  test(`${kind} routing: unregistered operations cannot silently claim success`, async () => {
    const current = fixture(script);
    const response = await current.dispatch({ type: 'UNREGISTERED_LOGIN_ROUTING_TEST' });
    assert.equal(response.ok, false);
    assert.match(response.error, /消息/);
  });
}
