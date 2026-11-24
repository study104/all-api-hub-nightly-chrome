const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const { test } = require('node:test');
const esbuild = require('esbuild');

const workspace = path.resolve(__dirname, '..');
const plain = (value) => JSON.parse(JSON.stringify(value));

const backgroundBundle = esbuild.buildSync({
  stdin: {
    contents: `
      import { handleEntryMutation } from './src/entries/background.js';
      export { handleEntryMutation };
      export { accountService } from './src/modules/accounts/service.js';
      export { siteService } from './src/modules/sites/service.js';
      export { proxyService } from './src/modules/proxies/service.js';
      export { recordService } from './src/modules/records/service.js';
      export { checkinService } from './src/modules/checkin/service.js';
      export { bgCheckinState } from './src/modules/checkin/service.js';
      export { learningService } from './src/modules/learning/service.js';
    `,
    resolveDir: workspace,
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
  // The real entry initializes every module; external events and browser APIs use fixture doubles.
});

function browserFixture(seed = {}, { checkinControlSeen = true } = {}) {
  const local = structuredClone(seed);
  const session = {};
  const tabs = new Set([1, 2]);
  const tabUrls = new Map();
  let nextTabId = 10;
  const proxy = { value: { mode: 'system' }, clears: 0, rejectControl: false };
  const event = () => ({ addListener() {}, removeListener() {} });
  function storageArea(data) {
    return {
      async get(keys) {
        if (keys == null) return structuredClone(data);
        if (typeof keys === 'string') return { [keys]: structuredClone(data[keys]) };
        if (Array.isArray(keys)) {
          return Object.fromEntries(keys.map((key) => [key, structuredClone(data[key])]));
        }
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
    storage: { local: storageArea(local), session: storageArea(session), onChanged: event() },
    runtime: {
      id: 'test-extension',
      getURL: (filename) => `chrome-extension://test-extension/${filename}`,
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
        async set({ value }) {
          proxy.value = structuredClone(value);
        },
        async get() {
          return {
            value: structuredClone(proxy.value),
            levelOfControl: proxy.rejectControl
              ? 'controlled_by_other_extensions'
              : 'controlled_by_this_extension',
          };
        },
        async clear() {
          proxy.clears++;
          proxy.value = { mode: 'system' };
        },
      },
    },
    tabs: {
      async get(id) {
        if (!tabs.has(id)) throw new Error('No tab');
        return { id, windowId: 1, url: tabUrls.get(id) ?? 'https://example.test/login' };
      },
      async create({ url }) {
        const id = nextTabId++;
        tabs.add(id);
        tabUrls.set(id, url);
        return { id, windowId: 1, url };
      },
      async update(id, patch) {
        if (!tabs.has(id)) throw new Error('No tab');
        if (patch.url) tabUrls.set(id, patch.url);
        return { id, windowId: 1, url: tabUrls.get(id) ?? 'https://example.test/login' };
      },
      query: async () => [],
      remove: async (id) => tabs.delete(id),
      sendMessage: async () => ({ ok: true, checkinControlSeen }),
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
      getAllFrames: async ({ tabId }) => [
        { frameId: 0, url: tabUrls.get(tabId) ?? 'https://example.test/login' },
      ],
    },
    webRequest: { onAuthRequired: event() },
    cookies: { getAll: async () => [], getAllCookieStores: async () => [] },
  };
  const module = { exports: {} };
  const context = vm.createContext({
    module,
    exports: module.exports,
    chrome,
    console,
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
      throw new Error('Unexpected network request in service test');
    },
  });
  vm.runInContext(backgroundBundle.outputFiles[0].text, context, { timeout: 10000 });
  return { services: module.exports, local, session, proxy, tabs, tabUrls };
}

test('learning: one workflow per site is updated by either account and isolated from same-origin sites', async () => {
  const site = {
    id: 'site-a',
    name: 'A',
    loginUrl: 'https://shared.test/login',
    loginMethod: 'form',
    selectors: { username: '#username', password: '#password', submit: '#login' },
    checkin: { method: 'auto' },
  };
  const otherWorkflow = {
    method: 'workflow',
    workflow: {
      route: ['/private-profile'],
      identityPath: '/private-profile',
      steps: [{ type: 'click', selector: '#private-checkin' }],
    },
  };
  const fixture = browserFixture({
    sites: [site, { ...site, id: 'site-b', name: 'B', checkin: otherWorkflow }],
    accounts: [
      {
        id: 'alice',
        siteId: site.id,
        username: 'alice',
        password: 'alice-password',
        identity: { userId: '101', source: 'visible' },
      },
      {
        id: 'bob',
        siteId: site.id,
        username: 'bob',
        password: 'bob-password',
        identity: { userId: '102', source: 'visible' },
      },
      {
        id: 'other-site-user',
        siteId: 'site-b',
        username: 'other-user',
        password: 'other-password',
        identity: { userId: '101', source: 'visible' },
      },
    ],
  });
  async function learn(accountId, selector) {
    const account = fixture.local.accounts.find((item) => item.id === accountId);
    fixture.tabUrls.set(1, 'https://shared.test/profile');
    fixture.session['learn:1'] = {
      runId: `learning-${accountId}`,
      accountId,
      siteId: site.id,
      tabId: 1,
      kind: 'both',
      createdAt: Date.now(),
      events: [
        {
          type: 'fill',
          selector: '#username',
          fieldRole: 'username',
          hasValue: true,
          path: '/login',
          at: 1,
        },
        {
          type: 'fill',
          selector: '#password',
          fieldRole: 'password',
          hasValue: true,
          path: '/login',
          at: 2,
        },
        {
          type: 'click',
          selector: '#login',
          label: '登录',
          loginAction: 'submit',
          path: '/login',
          at: 3,
        },
        { type: 'navigation', path: '/profile', at: 4 },
        {
          type: 'click',
          selector,
          label: '签到',
          path: '/profile',
          evidence: { kind: 'success', words: ['签到成功'] },
          at: 5,
        },
      ],
      learnedIdentities: {
        '/profile': {
          identity: {
            userId: account.identity.userId,
            username: account.username,
            source: 'visible',
            verifiedByLearning: true,
          },
          loginAt: 3,
          conflict: false,
        },
      },
    };
    const result = await fixture.services.learningService.toggle(accountId, 'both');
    assert.equal(result.ok, true, result.error);
    assert.equal(result.feature.learning.savedKinds.includes('checkin'), true);
    assert.equal(fixture.session['learn:1'], undefined);
    return structuredClone(fixture.local.sites.find((item) => item.id === site.id).checkin);
  }
  async function taskFor(accountId) {
    const started = await fixture.services.bgCheckinState.Ah(accountId, async () => {});
    assert.equal(started.ok, true, started.error);
    const task = plain(await fixture.services.bgCheckinState.V.get(started.tabId));
    await fixture.services.bgCheckinState.V.remove(started.tabId);
    return task;
  }

  const versionA = await learn('alice', '#claim-a');
  assert.equal(JSON.stringify(versionA).includes('#claim-a'), true);
  assert.deepEqual(fixture.local.sites.find((item) => item.id === 'site-b').checkin, otherWorkflow);
  for (const accountId of ['alice', 'bob']) {
    const task = await taskFor(accountId);
    assert.deepEqual(task.site.checkin, versionA);
    assert.equal(task.siteAccountCount, 2);
  }

  const versionB = await learn('bob', '#claim-b');
  assert.equal(JSON.stringify(versionB).includes('#claim-b'), true);
  assert.equal(JSON.stringify(versionB).includes('#claim-a'), false);
  for (const accountId of ['alice', 'bob']) {
    assert.deepEqual((await taskFor(accountId)).site.checkin, versionB);
  }
  assert.deepEqual(fixture.local.sites.find((item) => item.id === 'site-b').checkin, otherWorkflow);
  assert.deepEqual((await taskFor('other-site-user')).site.checkin, otherWorkflow);
  assert.equal(fixture.local.accounts.find((item) => item.id === 'alice').identity.userId, '101');
  assert.equal(fixture.local.accounts.find((item) => item.id === 'bob').identity.userId, '102');

  await fixture.services.accountService.add({
    siteId: site.id,
    username: 'new-account',
    password: 'new-password',
  });
  const newAccount = fixture.local.accounts.find((item) => item.username === 'new-account');
  assert.deepEqual((await taskFor(newAccount.id)).site.checkin, versionB);
  assert.equal(newAccount.identity, undefined);
  assert.equal(Object.hasOwn(newAccount, 'workflow'), false);
  assert.equal(Object.hasOwn(newAccount, 'checkin'), false);

  await fixture.services.siteService.add({
    ...site,
    id: undefined,
    name: 'New independent site',
    loginUrl: 'https://shared.test/new-login',
    checkin: { method: 'auto' },
  });
  const newSite = fixture.local.sites.find((item) => item.name === 'New independent site');
  assert.ok(newSite);
  await fixture.services.accountService.add({
    siteId: newSite.id,
    username: 'new-site-user',
    password: 'new-site-password',
  });
  const independentAccount = fixture.local.accounts.find(
    (item) => item.username === 'new-site-user',
  );
  const independentTask = await taskFor(independentAccount.id);
  assert.equal(independentTask.effectiveCheckinMethod, 'auto');
  assert.equal(independentTask.site.checkin.workflow, undefined);
});

test('learning: reassigning the recording account cannot update either site workflow', async () => {
  const workflow = (selector) => ({
    method: 'workflow',
    workflow: {
      route: ['/profile'],
      identityPath: '/profile',
      steps: [{ type: 'click', selector }],
    },
  });
  const site = {
    id: 'site-a',
    name: 'A',
    loginUrl: 'https://shared.test/login',
    loginMethod: 'form',
    selectors: { username: '#username', password: '#password', submit: '#login' },
    checkin: workflow('#claim-a'),
  };
  const fixture = browserFixture({
    sites: [site, { ...site, id: 'site-b', name: 'B', checkin: workflow('#claim-b') }],
    accounts: [{ id: 'alice', siteId: site.id, username: 'alice', password: 'alice-password' }],
  });
  const previousSites = structuredClone(fixture.local.sites);
  fixture.tabUrls.set(1, 'https://shared.test/profile');
  fixture.session['learn:1'] = {
    tabId: 1,
    runId: 'learn-alice',
    siteId: site.id,
    accountId: 'alice',
    kind: 'both',
    createdAt: Date.now(),
    events: [
      { type: 'navigation', path: '/profile', at: 1 },
      {
        type: 'click',
        selector: '#new-learning-action',
        label: '签到',
        path: '/profile',
        evidence: { kind: 'success', words: ['签到成功'] },
        at: 2,
      },
    ],
  };
  await fixture.services.accountService.update('alice', { siteId: 'site-b' });
  const result = await fixture.services.learningService.toggle('alice', 'both');
  assert.equal(result.ok, false);
  assert.match(result.error, /归属.*改变|站点.*改变|移到其他站点/);
  assert.deepEqual(fixture.local.sites, previousSites);
  assert.equal(fixture.local.accounts[0].siteId, 'site-b');
});

for (const [method, provider, label] of [
  ['manual', 'email-code', '邮箱验证码'],
  ['passkey', 'passkey', 'Passkey'],
  ['oauth', 'google', 'Google'],
]) {
  test(`learning: finishing a shared workflow preserves ${method} exact entry and all other account login preferences`, async () => {
    const oldWorkflow = {
        route: ['/profile'],
        identityPath: '/profile',
        steps: [{ type: 'click', selector: '#old-claim' }],
      },
      site = {
        id: 'site-a',
        name: 'A',
        loginUrl: 'https://shared.test/login',
        loginMethod: 'form',
        selectors: { username: '#username', password: '#password', submit: '#login' },
        checkin: { method: 'workflow', workflow: oldWorkflow },
      },
      entry = {
        key: `${method}:${provider}`,
        method,
        provider,
        label,
        matchText: label,
      },
      peerEntry = {
        key: 'oauth:linuxdo',
        method: 'oauth',
        provider: 'linuxdo',
        label: 'Linux DO',
        matchText: '使用 Linux DO 登录',
      },
      fixture = browserFixture({
        sites: [site, { ...site, id: 'site-b', name: 'B' }],
        accounts: [
          {
            id: 'teacher',
            siteId: site.id,
            username: 'teacher@example.test',
            loginMethod: method,
            loginEntry: entry,
            ...(method === 'passkey' ? { passkey: true } : {}),
            identity: { userId: '101', source: 'api' },
          },
          { id: 'default-auto', siteId: site.id, username: 'default-auto', password: 'auto-pass' },
          {
            id: 'explicit-auto',
            siteId: site.id,
            username: 'explicit-auto',
            password: 'explicit-auto-pass',
            loginMethod: 'auto',
          },
          {
            id: 'peer',
            siteId: site.id,
            username: 'peer',
            loginMethod: 'oauth',
            loginEntry: peerEntry,
          },
          {
            id: 'other-site-user',
            siteId: 'site-b',
            username: 'other',
            loginMethod: 'form',
            password: 'other-pass',
          },
        ],
      });
    const peersBefore = plain(fixture.local.accounts.filter((account) => account.id !== 'teacher')),
      otherSiteBefore = plain(fixture.local.sites.find((item) => item.id === 'site-b'));
    fixture.tabUrls.set(1, 'https://shared.test/profile');
    fixture.session['learn:1'] = {
      runId: `learning-${method}`,
      accountId: 'teacher',
      siteId: site.id,
      tabId: 1,
      kind: 'both',
      createdAt: Date.now(),
      events: [
        {
          type: 'click',
          selector: '#oauth-shared-demo',
          label: '使用 Google 登录',
          loginAction: 'oauth',
          path: '/login',
          at: 1,
        },
        { type: 'navigation', path: '/profile', at: 2 },
        {
          type: 'click',
          selector: '#new-claim',
          label: '签到',
          path: '/profile',
          evidence: { kind: 'success', words: ['签到成功'] },
          at: 3,
        },
      ],
      learnedIdentities: {
        '/profile': {
          identity: {
            userId: '101',
            email: 'teacher@example.test',
            source: 'visible',
            verifiedByLearning: true,
          },
          loginAt: 1,
          conflict: false,
        },
      },
    };
    const result = await fixture.services.learningService.toggle('teacher', 'both');
    assert.equal(result.ok, true, result.error);
    assert.deepEqual(plain(result.feature.learning.savedKinds), ['login', 'checkin']);
    assert.equal(fixture.session['learn:1'], undefined);
    const teacher = fixture.local.accounts.find((account) => account.id === 'teacher'),
      updatedSite = fixture.local.sites.find((item) => item.id === site.id);
    assert.equal(teacher.loginMethod, method);
    assert.deepEqual(plain(teacher.loginEntry), entry);
    assert.equal(teacher.identity.userId, '101');
    assert.deepEqual(
      plain(fixture.local.accounts.filter((account) => account.id !== 'teacher')),
      peersBefore,
    );
    assert.deepEqual(
      plain(fixture.local.sites.find((item) => item.id === 'site-b')),
      otherSiteBefore,
    );
    assert.equal(updatedSite.loginMethod, 'oauth');
    assert.equal(updatedSite.oauthButtonSelector, '#oauth-shared-demo');
    assert.equal(JSON.stringify(updatedSite.checkin.workflow).includes('#new-claim'), true);
    assert.equal(JSON.stringify(updatedSite.checkin.workflow).includes('#old-claim'), false);
    const started = await fixture.services.bgCheckinState.Ah('teacher', async () => {});
    assert.equal(started.ok, true, started.error);
    const task = plain(await fixture.services.bgCheckinState.V.get(started.tabId));
    assert.equal(task.effectiveLoginMethod, method);
    assert.deepEqual(task.loginEntry, entry);
    assert.deepEqual(task.site.loginEntry, entry);
    assert.deepEqual(task.site.checkin, plain(updatedSite.checkin));
  });
}

function formIdentityFixture() {
  const site = {
    id: 'site-a',
    name: 'A',
    loginUrl: 'https://shared.test/login',
    loginMethod: 'form',
    selectors: { username: '#username', password: '#password', submit: '#login' },
    checkin: {
      method: 'workflow',
      workflow: {
        route: ['/profile'],
        identityPath: '/profile',
        steps: [{ type: 'click', selector: '#claim' }],
      },
    },
  };
  const fixture = browserFixture({
    sites: [site, { ...site, id: 'other-site', name: 'Independent' }],
    accounts: [
      { id: 'alice', siteId: site.id, username: 'alice', password: 'alice-password' },
      {
        id: 'bob',
        siteId: site.id,
        username: 'bob',
        password: 'bob-password',
        identity: { userId: '102', source: 'visible' },
      },
      {
        id: 'other-site-user',
        siteId: 'other-site',
        username: 'other-user',
        password: 'other-password',
        identity: { userId: '101', source: 'visible' },
      },
    ],
  });
  fixture.session['task:1'] = {
    tabId: 1,
    runId: 'run-alice',
    accountId: 'alice',
    siteId: site.id,
    username: 'alice',
    password: 'alice-password',
    site,
    effectiveLoginMethod: 'form',
    effectiveCheckinMethod: 'workflow',
    siteAccountCount: 2,
    siteAccountUserIds: { 102: 'bob' },
    stage: 'verify',
    createdAt: Date.now(),
    steps: [],
  };
  const sender = {
    id: 'test-extension',
    frameId: 0,
    tab: { id: 1, url: 'https://shared.test/profile' },
    url: 'https://shared.test/profile',
  };
  return {
    ...fixture,
    sender,
    submit: (selectedSender = sender, runId = 'run-alice') =>
      fixture.services.checkinService.handleMessage(
        { type: 'FORM_CREDENTIALS_SUBMITTED', runId },
        selectedSender,
      ),
    save: (identity, selectedSender = sender, runId = 'run-alice') =>
      fixture.services.accountService.handleMessage(
        { type: 'SAVE_IDENTITY', runId, identity },
        selectedSender,
      ),
  };
}

test('login: each account defaults to page detection independent of site defaults and available credentials', async () => {
  const workflow = {
    method: 'workflow',
    workflow: {
      route: ['/profile'],
      identityPath: '/profile',
      steps: [{ type: 'click', selector: '#claim' }],
    },
  };
  const fixture = browserFixture({
    sites: [
      {
        id: 'site-a',
        name: 'A',
        loginUrl: 'https://shared.test/login',
        loginMethod: 'github',
        selectors: { username: '#username', password: '#password', submit: '#login' },
        checkin: workflow,
      },
      {
        id: 'site-b',
        name: 'B',
        loginUrl: 'https://shared.test/other-login',
        loginMethod: 'form',
        checkin: {
          ...workflow,
          workflow: {
            ...workflow.workflow,
            route: ['/private-profile'],
            identityPath: '/private-profile',
          },
        },
      },
    ],
    accounts: [
      {
        id: 'alice',
        siteId: 'site-a',
        username: 'alice',
        password: 'alice-password',
        githubUsername: 'alice-github',
        githubPassword: 'alice-github-password',
        identity: { userId: '101', source: 'visible' },
      },
      {
        id: 'bob',
        siteId: 'site-b',
        username: 'bob',
        githubUsername: 'bob-github',
        githubPassword: 'bob-github-password',
        identity: { userId: '102', source: 'api' },
      },
      {
        id: 'explicit',
        siteId: 'site-a',
        username: 'explicit',
        password: 'explicit-password',
        loginMethod: 'form',
      },
    ],
  });
  const sitesBefore = structuredClone(fixture.local.sites),
    accountsBefore = structuredClone(fixture.local.accounts),
    tasks = [];
  for (const id of ['alice', 'bob', 'explicit']) {
    const result = await fixture.services.bgCheckinState.Ah(id, async () => {});
    assert.equal(result.ok, true, result.error);
    tasks.push(plain(await fixture.services.bgCheckinState.V.get(result.tabId)));
  }
  const [alice, bob, explicit] = tasks;
  assert.equal(alice.loginMethodPreference, 'auto');
  assert.equal(alice.effectiveLoginMethod, 'auto');
  assert.equal(alice.accountIdentityUserId, '101');
  assert.equal(bob.loginMethodPreference, 'auto');
  assert.equal(bob.effectiveLoginMethod, 'auto');
  assert.equal(bob.accountIdentityUserId, '102');
  assert.equal(bob.password, undefined);
  assert.deepEqual(bob.site.checkin.workflow.route, ['/private-profile']);
  assert.equal(explicit.loginMethodPreference, 'form');
  assert.equal(explicit.effectiveLoginMethod, 'form');
  for (const [task, method] of [
    [alice, 'form'],
    [bob, 'github'],
  ]) {
    const result = await fixture.services.checkinService.handleMessage(
      { type: 'RESOLVE_LOGIN_METHOD', runId: task.runId, method },
      { id: 'test-extension', frameId: 0, tab: { id: task.tabId }, url: task.site.loginUrl },
    );
    assert.equal(result.ok, true, result.error);
    assert.equal(result.feature.effectiveLoginMethod, method);
  }
  assert.equal(
    (await fixture.services.bgCheckinState.V.get(alice.tabId)).effectiveLoginMethod,
    'form',
  );
  assert.equal(
    (await fixture.services.bgCheckinState.V.get(bob.tabId)).effectiveLoginMethod,
    'github',
  );
  assert.deepEqual(fixture.local.sites, sitesBefore);
  assert.deepEqual(fixture.local.accounts, accountsBefore);
});

test('login: only a current top-level site task can resolve automatic login with its own latest credentials', async () => {
  const fixture = formIdentityFixture();
  Object.assign(fixture.session['task:1'], {
    loginMethodPreference: 'auto',
    effectiveLoginMethod: 'auto',
    stage: 'login',
  });
  const resolve = (method, sender = fixture.sender, runId = 'run-alice') =>
    fixture.services.checkinService.handleMessage(
      { type: 'RESOLVE_LOGIN_METHOD', runId, method },
      sender,
    );
  const initial = structuredClone(fixture.session['task:1']);
  for (const sender of [
    { ...fixture.sender, id: 'another-extension' },
    { ...fixture.sender, frameId: 1 },
    { ...fixture.sender, tab: { id: 2 } },
    { ...fixture.sender, url: 'https://foreign.test/login' },
  ])
    assert.equal((await resolve('form', sender)).ok, false);
  assert.equal((await resolve('form', fixture.sender, 'stale-run')).ok, false);
  assert.equal((await resolve('token')).ok, false);
  assert.equal((await resolve('github')).ok, false);
  assert.equal((await resolve('passkey')).ok, false);
  fixture.local.accounts[0].password = 'changed-password';
  assert.equal((await resolve('form')).ok, false);
  fixture.local.accounts[0].password = 'alice-password';
  fixture.local.accounts[0].siteId = 'other-site';
  assert.equal((await resolve('form')).ok, false);
  fixture.local.accounts[0].siteId = 'site-a';
  fixture.local.accounts[0].loginMethod = 'github';
  assert.equal((await resolve('form')).ok, false);
  delete fixture.local.accounts[0].loginMethod;
  fixture.session['task:1'].stage = 'checkin';
  assert.equal((await resolve('form')).ok, false);
  fixture.session['task:1'].stage = 'login';
  assert.deepEqual(fixture.session['task:1'], initial);
  assert.equal((await fixture.submit()).ok, false);
  assert.equal((await fixture.save({ userId: '101', username: 'alice', source: 'api' })).ok, false);
  assert.equal(fixture.local.accounts[0].identity, undefined);
  assert.equal((await resolve('form')).ok, true);
  assert.equal((await fixture.submit()).ok, true);
  assert.equal(fixture.session['task:1'].formCredentialsSubmitted, true);
  assert.equal((await resolve('form')).ok, true);
  assert.equal(fixture.session['task:1'].formCredentialsSubmitted, true);
  assert.equal(
    (await fixture.save({ userId: '101', source: 'visible', verifiedByManagedLogin: true })).ok,
    true,
  );
});

test('login: changing a detected method clears proof while a new login detects again without changing explicit overrides', async () => {
  const fixture = formIdentityFixture();
  Object.assign(fixture.local.accounts[0], {
    githubUsername: 'alice-github',
    githubPassword: 'github-password',
    passkey: true,
  });
  Object.assign(fixture.session['task:1'], {
    loginMethodPreference: 'auto',
    effectiveLoginMethod: 'form',
    githubUsername: 'alice-github',
    githubPassword: 'github-password',
    passkey: true,
    identityConfirmed: true,
    formCredentialsSubmitted: true,
    workflowRouteIndex: 1,
  });
  for (const method of ['github', 'oauth', 'passkey']) {
    const result = await fixture.services.checkinService.handleMessage(
      { type: 'RESOLVE_LOGIN_METHOD', runId: 'run-alice', method },
      fixture.sender,
    );
    assert.equal(result.ok, true, result.error);
    assert.equal(fixture.session['task:1'].effectiveLoginMethod, method);
    assert.equal(fixture.session['task:1'].identityConfirmed, false);
    assert.equal(fixture.session['task:1'].formCredentialsSubmitted, false);
    assert.equal(fixture.session['task:1'].githubCredentialsSubmitted, false);
    assert.equal(fixture.session['task:1'].workflowRouteIndex, undefined);
  }
  fixture.session['task:1'].effectiveLoginMethod = 'github';
  await fixture.services.checkinService.handleMessage(
    { type: 'SET_STAGE', runId: 'run-alice', stage: 'github-logout', steps: [] },
    fixture.sender,
  );
  assert.equal(fixture.session['task:1'].effectiveLoginMethod, 'github');
  for (const stage of ['login', 'relogin']) {
    Object.assign(fixture.session['task:1'], {
      effectiveLoginMethod: 'github',
      githubCredentialsSubmitted: true,
    });
    await fixture.services.checkinService.handleMessage(
      { type: 'SET_STAGE', runId: 'run-alice', stage, steps: [] },
      fixture.sender,
    );
    assert.equal(fixture.session['task:1'].effectiveLoginMethod, 'auto');
    assert.equal(fixture.session['task:1'].githubCredentialsSubmitted, false);
  }
  fixture.session['task:1'].loginMethodPreference = 'github';
  fixture.session['task:1'].effectiveLoginMethod = 'github';
  await fixture.services.checkinService.handleMessage(
    { type: 'SET_STAGE', runId: 'run-alice', stage: 'login', steps: [] },
    fixture.sender,
  );
  assert.equal(fixture.session['task:1'].effectiveLoginMethod, 'github');
  assert.equal(
    (
      await fixture.services.checkinService.handleMessage(
        { type: 'RESOLVE_LOGIN_METHOD', runId: 'run-alice', method: 'form' },
        fixture.sender,
      )
    ).ok,
    false,
  );
});

test('login: recording the current login stage preserves its resolved method until a real navigation resets detection', async () => {
  const fixture = formIdentityFixture();
  Object.assign(fixture.session['task:1'], {
    loginMethodPreference: 'auto',
    effectiveLoginMethod: 'auto',
    stage: 'login',
  });
  assert.equal(
    (
      await fixture.services.checkinService.handleMessage(
        { type: 'RESOLVE_LOGIN_METHOD', runId: 'run-alice', method: 'form' },
        fixture.sender,
      )
    ).ok,
    true,
  );
  assert.equal(
    (
      await fixture.services.checkinService.handleMessage(
        { type: 'SET_STAGE', runId: 'run-alice', stage: 'login', steps: [] },
        fixture.sender,
      )
    ).ok,
    true,
  );
  assert.equal(fixture.session['task:1'].effectiveLoginMethod, 'form');
  assert.equal((await fixture.submit()).ok, true);
  assert.equal(fixture.session['task:1'].formCredentialsSubmitted, true);
  await fixture.services.checkinService.handleMessage(
    {
      type: 'SET_STAGE',
      runId: 'run-alice',
      stage: 'login',
      steps: [],
      resetLoginMethod: true,
    },
    fixture.sender,
  );
  assert.equal(fixture.session['task:1'].effectiveLoginMethod, 'auto');
  assert.equal(fixture.session['task:1'].formCredentialsSubmitted, false);
  assert.equal((await fixture.submit()).ok, false);
});

test('login: specific provider entries belong to each account and form login works without saved CSS selectors', async () => {
  const google = {
      key: 'oauth:google',
      method: 'oauth',
      provider: 'google',
      label: 'Google',
      hrefPath: '/oauth/google?token=discarded',
      password: 'discarded-entry-secret',
    },
    linuxdo = {
      key: 'oauth:linuxdo',
      method: 'oauth',
      provider: 'linuxdo',
      label: 'Linux DO',
    },
    manual = {
      key: 'manual:email-code',
      method: 'manual',
      provider: 'email-code',
      label: '邮箱验证码',
    },
    fixture = browserFixture({
      sites: [
        {
          id: 'site-a',
          name: 'A',
          loginUrl: 'https://shared.test/login',
          loginMethod: 'github',
          loginEntry: linuxdo,
          checkin: {
            method: 'workflow',
            workflow: {
              route: ['/profile'],
              identityPath: '/profile',
              steps: [{ type: 'click', selector: '#claim' }],
            },
          },
        },
      ],
      accounts: [
        {
          id: 'google-account',
          siteId: 'site-a',
          username: 'google@example.test',
          loginMethod: 'oauth',
          loginEntry: google,
        },
        {
          id: 'manual-account',
          siteId: 'site-a',
          username: 'manual@example.test',
          loginMethod: 'manual',
          loginEntry: manual,
          password: 'old-password',
          githubUsername: 'old-github',
          githubPassword: 'old-github-password',
          apiToken: 'old-token',
          identity: { userId: 'visible-only-id', source: 'visible' },
        },
        {
          id: 'native-account',
          siteId: 'site-a',
          username: 'native',
          password: 'native-password',
          loginMethod: 'form',
          loginEntry: linuxdo,
        },
        {
          id: 'auto-account',
          siteId: 'site-a',
          username: 'auto',
          loginEntry: linuxdo,
        },
      ],
    }),
    before = structuredClone(fixture.local),
    tasks = {};
  for (const account of fixture.local.accounts) {
    const started = await fixture.services.bgCheckinState.Ah(account.id, async () => {});
    assert.equal(started.ok, true, started.error);
    tasks[account.id] = plain(await fixture.services.bgCheckinState.V.get(started.tabId));
  }
  const googleTask = tasks['google-account'],
    manualTask = tasks['manual-account'],
    formTask = tasks['native-account'],
    autoTask = tasks['auto-account'];
  assert.deepEqual(googleTask.loginEntry, {
    key: 'oauth:google',
    method: 'oauth',
    label: 'Google',
    provider: 'google',
    hrefPath: '/oauth/google',
  });
  assert.deepEqual(googleTask.site.loginEntry, googleTask.loginEntry);
  assert.equal(manualTask.effectiveLoginMethod, 'manual');
  assert.deepEqual(manualTask.loginEntry, {
    key: 'manual:email-code',
    method: 'manual',
    label: '邮箱验证码',
    provider: 'email-code',
  });
  for (const key of [
    'password',
    'githubUsername',
    'githubPassword',
    'apiToken',
    'accountIdentityUserId',
  ])
    assert.equal(Object.hasOwn(manualTask, key), false, `${key} must not enter a manual task`);
  assert.equal(formTask.effectiveLoginMethod, 'form');
  assert.equal(formTask.password, 'native-password');
  assert.equal(formTask.loginEntry, undefined);
  assert.equal(formTask.site.loginEntry, undefined);
  assert.equal(autoTask.effectiveLoginMethod, 'auto');
  assert.equal(autoTask.loginEntry, undefined);
  assert.equal(autoTask.site.loginEntry, undefined);
  assert.deepEqual(fixture.local.accounts, before.accounts);
  assert.deepEqual(fixture.local.sites, before.sites);
});

test('login: exact entry resolution validates the method and resets identity proof when the provider changes', async () => {
  const fixture = formIdentityFixture();
  Object.assign(fixture.session['task:1'], {
    loginMethodPreference: 'auto',
    effectiveLoginMethod: 'auto',
    stage: 'login',
  });
  const resolve = (method, loginEntry) =>
      fixture.services.checkinService.handleMessage(
        { type: 'RESOLVE_LOGIN_METHOD', runId: 'run-alice', method, loginEntry },
        fixture.sender,
      ),
    google = {
      key: 'oauth:google',
      method: 'oauth',
      provider: 'google',
      label: 'Google',
      hrefPath: '/oauth/google?token=discarded',
      credential: 'discarded',
    },
    linuxdo = {
      key: 'oauth:linuxdo',
      method: 'oauth',
      provider: 'linuxdo',
      label: 'Linux DO',
    };
  assert.equal((await resolve('form', google)).ok, false);
  assert.equal((await resolve('oauth', { ...google, key: '' })).ok, false);
  assert.equal(fixture.session['task:1'].effectiveLoginMethod, 'auto');
  const resolved = await resolve('oauth', google);
  assert.equal(resolved.ok, true, resolved.error);
  assert.deepEqual(plain(resolved.feature.loginEntry), {
    key: 'oauth:google',
    method: 'oauth',
    label: 'Google',
    provider: 'google',
    hrefPath: '/oauth/google',
  });
  assert.deepEqual(fixture.session['task:1'].site.loginEntry, fixture.session['task:1'].loginEntry);
  Object.assign(fixture.session['task:1'], { identityConfirmed: true, workflowRouteIndex: 1 });
  assert.equal((await resolve('oauth', google)).ok, true);
  assert.equal(fixture.session['task:1'].identityConfirmed, true);
  assert.equal((await resolve('oauth', linuxdo)).ok, true);
  assert.equal(fixture.session['task:1'].identityConfirmed, false);
  assert.equal(fixture.session['task:1'].workflowRouteIndex, undefined);
  assert.equal(fixture.session['task:1'].loginEntry.provider, 'linuxdo');
  await fixture.services.checkinService.handleMessage(
    {
      type: 'SET_STAGE',
      runId: 'run-alice',
      stage: 'login',
      steps: [],
      resetLoginMethod: true,
    },
    fixture.sender,
  );
  assert.equal(fixture.session['task:1'].loginEntry, undefined);
  assert.equal(fixture.session['task:1'].site.loginEntry, undefined);
});

test('login: a new manual account never inherits an adapter identity or silently uses old Token credentials', async () => {
  const fixture = browserFixture({
    sites: [
      {
        id: 'site-a',
        name: 'A',
        loginUrl: 'https://shared.test/login',
        adapter: { userId: 'teacher-id' },
        checkin: { method: 'button', buttonSelector: '#claim', url: '/profile' },
      },
    ],
    accounts: [
      {
        id: 'manual-account',
        siteId: 'site-a',
        username: 'manual@example.test',
        loginMethod: 'manual',
        apiToken: 'old-token',
      },
    ],
  });
  const started = await fixture.services.bgCheckinState.Ah('manual-account', async () => {});
  assert.equal(started.ok, true, started.error);
  assert.equal(started.completedResult, undefined);
  const task = plain(await fixture.services.bgCheckinState.V.get(started.tabId));
  assert.equal(task.effectiveLoginMethod, 'manual');
  assert.equal(task.accountIdentityUserId, undefined);
  assert.equal(task.site.adapter.userId, undefined);
  assert.equal(task.apiToken, undefined);
  assert.equal(fixture.local.accounts[0].identity, undefined);
  assert.equal(fixture.local.headlessStats, undefined);
});

async function manualWaitingFixture(pendingAccountIds = []) {
  const site = { id: 'manual-site', name: 'Manual', loginUrl: 'https://manual.test/login' },
    fixture = browserFixture({
      sites: [site],
      accounts: [
        { id: 'alice', siteId: site.id, username: 'alice@example.test', loginMethod: 'manual' },
        { id: 'bob', siteId: site.id, username: 'bob@example.test', loginMethod: 'manual' },
      ],
    });
  fixture.session['task:1'] = {
    tabId: 1,
    runId: 'manual-run',
    accountId: 'alice',
    siteId: site.id,
    username: 'alice@example.test',
    site,
    loginMethodPreference: 'manual',
    effectiveLoginMethod: 'manual',
    stage: 'verify-manual',
    steps: [],
  };
  fixture.session.checkinQueue = {
    pendingAccountIds,
    active: { accountId: 'alice', tabId: 1, startedAt: Date.now() },
  };
  fixture.sender = {
    id: 'test-extension',
    frameId: 0,
    tab: { id: 1, url: site.loginUrl },
    url: site.loginUrl,
  };
  fixture.message = {
    type: 'MANUAL_LOGIN_WAITING',
    runId: 'manual-run',
    message: '请在当前页面完成邮箱验证码',
    steps: ['进入邮箱验证码登录'],
  };
  await fixture.services.proxyService.acquire(1, {
    scheme: 'http',
    host: '127.0.0.1',
    port: 7890,
  });
  return fixture;
}

test('manual wait: a pending same-site account cannot replace the active queue or proxy before user completion', async () => {
  const fixture = await manualWaitingFixture(['bob']),
    queue = plain(fixture.session.checkinQueue),
    clears = fixture.proxy.clears;
  const first = await fixture.services.checkinService.handleMessage(
    fixture.message,
    fixture.sender,
  );
  assert.equal(first.ok, true, first.error);
  assert.deepEqual(plain(fixture.session.checkinQueue), queue);
  assert.equal(fixture.session.proxyHolderTabId, 1);
  assert.equal(fixture.proxy.clears, clears);
  const deadline = fixture.session['task:1'].manualLoginWaitUntil;
  assert.ok(deadline > Date.now() && deadline <= Date.now() + 300000);
  const repeated = await fixture.services.checkinService.handleMessage(
    fixture.message,
    fixture.sender,
  );
  assert.equal(repeated.ok, true, repeated.error);
  assert.equal(fixture.session['task:1'].manualLoginWaitUntil, deadline);
  const cancelled = await fixture.services.checkinService.handleMessage(
    { type: 'CANCEL_CHECKIN', accountIds: ['alice', 'bob'] },
    { id: 'test-extension', url: 'chrome-extension://test-extension/options.html' },
  );
  assert.equal(cancelled.ok, true, cancelled.error);
  assert.equal(fixture.session['task:1'], undefined);
  assert.equal(fixture.session.proxyHolderTabId, undefined);
  assert.equal(fixture.session.checkinQueue.active, undefined);
  assert.deepEqual(plain(fixture.session.checkinQueue.pendingAccountIds), []);
});

test('manual wait: an identity conflict uses ordinary handoff and releases the active queue and proxy', async () => {
  const fixture = await manualWaitingFixture();
  assert.equal(
    (await fixture.services.checkinService.handleMessage(fixture.message, fixture.sender)).ok,
    true,
  );
  const response = await fixture.services.checkinService.handleMessage(
    { type: 'NEEDS_USER', runId: 'manual-run', message: '当前登录了其他账号', steps: [] },
    fixture.sender,
  );
  assert.equal(response.ok, true, response.error);
  assert.equal(fixture.session.proxyHolderTabId, undefined);
  assert.equal(fixture.session.checkinQueue.active, undefined);
  assert.equal(
    (await fixture.services.checkinService.handleMessage(fixture.message, fixture.sender)).ok,
    false,
  );
  const resume = await fixture.services.checkinService.handleMessage(
    { type: 'SET_STAGE', runId: 'manual-run', stage: 'checkin', steps: [] },
    fixture.sender,
  );
  assert.equal(resume.ok, false);
});

test('manual wait: expiry blocks identity writes and backend cleanup ends the old task before releasing its lease', async () => {
  const fixture = await manualWaitingFixture();
  assert.equal(
    (await fixture.services.checkinService.handleMessage(fixture.message, fixture.sender)).ok,
    true,
  );
  fixture.session['task:1'].manualLoginWaitUntil = Date.now() - 1;
  const save = await fixture.services.accountService.handleMessage(
    {
      type: 'SAVE_IDENTITY',
      runId: 'manual-run',
      identity: { userId: '101', email: 'alice@example.test', source: 'api' },
    },
    fixture.sender,
  );
  assert.equal(save.ok, false);
  assert.equal(fixture.local.accounts[0].identity, undefined);
  const stage = await fixture.services.checkinService.handleMessage(
    { type: 'SET_STAGE', runId: 'manual-run', stage: 'checkin', steps: [] },
    fixture.sender,
  );
  assert.equal(stage.ok, false);
  await fixture.services.bgCheckinState.Ph();
  assert.equal(fixture.session['task:1'], undefined);
  assert.equal(fixture.session.checkinQueue.active, undefined);
  assert.equal(fixture.session.proxyHolderTabId, undefined);
  // The fixture reports no other window tab, so the existing close policy keeps its final page.
  assert.equal(fixture.tabs.has(1), true);
  const oldPage = await fixture.services.checkinService.handleMessage(
    { type: 'GET_TASK' },
    fixture.sender,
  );
  assert.equal(oldPage.task, null);
});

test('accounts: manual login binds only an exact API username or full email and retains a fixed user ID', async () => {
  const fixture = formIdentityFixture();
  fixture.local.accounts[0].username = 'alice@example.test';
  delete fixture.local.accounts[0].password;
  Object.assign(fixture.session['task:1'], {
    username: 'alice@example.test',
    password: undefined,
    loginMethodPreference: 'auto',
    effectiveLoginMethod: 'auto',
    stage: 'verify-manual',
  });
  const resolved = await fixture.services.checkinService.handleMessage(
    {
      type: 'RESOLVE_LOGIN_METHOD',
      runId: 'run-alice',
      method: 'manual',
      loginEntry: {
        key: 'manual:email-code',
        method: 'manual',
        provider: 'email-code',
        label: '邮箱验证码',
      },
    },
    fixture.sender,
  );
  assert.equal(resolved.ok, true, resolved.error);
  assert.equal((await fixture.submit()).ok, false);
  for (const identity of [
    {
      userId: '101',
      username: 'alice@example.test',
      source: 'visible',
      verifiedByManagedLogin: true,
    },
    { userId: '101', displayName: 'alice@example.test', source: 'api' },
    { userId: '101', username: 'alice', source: 'api' },
    { userId: '101', email: 'someone@example.test', source: 'api' },
    { username: 'alice@example.test', source: 'api' },
    { userId: '102', email: 'alice@example.test', source: 'api' },
  ]) {
    assert.equal((await fixture.save(identity)).ok, false);
    assert.equal(fixture.local.accounts[0].identity, undefined);
  }
  assert.equal(
    (await fixture.save({ userId: '101', email: 'alice@example.test', source: 'api' })).ok,
    true,
  );
  assert.equal(fixture.local.accounts[0].identity.userId, '101');
  assert.equal(
    (await fixture.save({ userId: '103', email: 'alice@example.test', source: 'api' })).ok,
    false,
  );
  assert.equal(fixture.local.accounts[0].identity.userId, '101');
  fixture.local.accounts[0].username = 'renamed@example.test';
  assert.equal((await fixture.save({ userId: '101', source: 'api' })).ok, false);
  fixture.local.accounts[0].username = 'alice@example.test';
  fixture.local.accounts[0].loginMethod = 'oauth';
  assert.equal((await fixture.save({ userId: '101', source: 'api' })).ok, false);
});

test('accounts: saved login entries accept only safe matching metadata and changing methods clears old choices', async () => {
  const fixture = browserFixture({
    sites: [{ id: 'site-a', name: 'A', loginUrl: 'https://shared.test/login' }],
    accounts: [],
  });
  await fixture.services.accountService.add({
    siteId: 'site-a',
    username: 'alice',
    loginMethod: 'oauth',
    loginEntry: {
      key: 'oauth:google',
      method: 'oauth',
      label: 'Google',
      provider: 'google',
      hrefPath: '/oauth/google?token=discarded#private',
      password: 'discarded',
      accountId: 'discarded',
    },
  });
  const account = fixture.local.accounts[0];
  assert.deepEqual(account.loginEntry, {
    key: 'oauth:google',
    method: 'oauth',
    label: 'Google',
    provider: 'google',
    hrefPath: '/oauth/google',
  });
  await fixture.services.accountService.update(account.id, { loginMethod: 'manual' });
  assert.equal(fixture.local.accounts[0].loginEntry, undefined);
  await fixture.services.accountService.update(account.id, {
    loginEntry: {
      key: 'manual:email-code',
      method: 'manual',
      label: '邮箱验证码',
      hrefPath: '//foreign.test/login',
    },
  });
  assert.deepEqual(fixture.local.accounts[0].loginEntry, {
    key: 'manual:email-code',
    method: 'manual',
    label: '邮箱验证码',
  });
  await fixture.services.accountService.update(account.id, {
    loginEntry: { key: 'oauth:google', method: 'oauth', label: 'Google' },
  });
  assert.equal(fixture.local.accounts[0].loginEntry, undefined);
});

test('accounts: first workflow identity binds only after this account submits its own form credentials', async () => {
  const fixture = formIdentityFixture();
  const identity = {
    userId: '101',
    username: 'different-profile-handle',
    source: 'visible',
    verifiedByManagedLogin: true,
  };
  for (const source of ['api', 'visible']) {
    const rejected = await fixture.save({ ...identity, source });
    assert.equal(rejected.ok, false);
    assert.equal(fixture.local.accounts[0].identity, undefined);
  }
  for (const sender of [
    { ...fixture.sender, id: 'another-extension' },
    { ...fixture.sender, frameId: 1 },
    { ...fixture.sender, url: 'https://foreign.test/profile' },
  ]) {
    assert.equal((await fixture.submit(sender)).ok, false);
    assert.equal(fixture.session['task:1'].formCredentialsSubmitted, undefined);
  }
  assert.equal((await fixture.submit(fixture.sender, 'stale-run')).ok, false);
  assert.equal((await fixture.submit()).ok, true);
  assert.equal(fixture.session['task:1'].formCredentialsSubmitted, true);

  for (const sender of [
    { ...fixture.sender, id: 'another-extension' },
    { ...fixture.sender, frameId: 1 },
    { ...fixture.sender, url: 'https://foreign.test/profile' },
  ]) {
    assert.equal((await fixture.save(identity, sender)).ok, false);
  }
  assert.equal((await fixture.save(identity, fixture.sender, 'stale-run')).ok, false);
  assert.equal((await fixture.save({ ...identity, userId: '102' })).ok, false);
  assert.equal(fixture.local.accounts[0].identity, undefined);

  const saved = await fixture.save(identity);
  assert.equal(saved.ok, true, saved.error);
  assert.equal(fixture.local.accounts[0].identity.userId, '101');
  assert.equal(fixture.local.accounts[0].identity.verifiedByManagedLogin, true);
  assert.equal(fixture.local.accounts[1].identity.userId, '102');
  assert.equal(fixture.local.accounts[2].identity.userId, '101');
  assert.equal(fixture.session['task:1'].accountIdentityUserId, '101');
  assert.equal((await fixture.save({ ...identity, userId: '999' })).ok, false);
  assert.equal(fixture.local.accounts[0].identity.userId, '101');
});

test('accounts: form identity proof survives verification but resets on relogin and cookie clearing', async () => {
  const fixture = formIdentityFixture();
  const identity = { userId: '101', source: 'visible', verifiedByManagedLogin: true };
  fixture.local.accounts[0].password = 'changed-password';
  assert.equal((await fixture.submit()).ok, false);
  fixture.local.accounts[0].password = 'alice-password';
  assert.equal((await fixture.submit()).ok, true);
  for (const stage of ['verify', 'checkin']) {
    assert.equal(
      (
        await fixture.services.checkinService.handleMessage(
          { type: 'SET_STAGE', runId: 'run-alice', stage, steps: [] },
          fixture.sender,
        )
      ).ok,
      true,
    );
    assert.equal(fixture.session['task:1'].formCredentialsSubmitted, true);
  }
  fixture.local.accounts[0].password = 'changed-after-submit';
  assert.equal((await fixture.save(identity)).ok, false);
  assert.equal(fixture.local.accounts[0].identity, undefined);
  fixture.local.accounts[0].password = 'alice-password';

  await fixture.services.checkinService.handleMessage(
    { type: 'SET_STAGE', runId: 'run-alice', stage: 'login', steps: [] },
    fixture.sender,
  );
  assert.equal(fixture.session['task:1'].formCredentialsSubmitted, false);
  assert.equal((await fixture.save(identity)).ok, false);
  assert.equal((await fixture.submit()).ok, true);
  const cleared = await fixture.services.accountService.handleMessage(
    { type: 'CLEAR_SITE_COOKIES', runId: 'run-alice' },
    fixture.sender,
  );
  assert.equal(cleared.ok, true, cleared.error);
  assert.equal(fixture.session['task:1'].formCredentialsSubmitted, false);
  assert.equal((await fixture.save(identity)).ok, false);
});

test('learning: ending on a page without a button requires explicit login-as-checkin selection', async () => {
  const site = {
    id: 'site-a',
    name: 'A',
    loginUrl: 'https://a.test/login',
    loginMethod: 'form',
    selectors: { username: '#username', password: '#password', submit: '#login' },
    checkin: { method: 'auto' },
  };
  const fixture = browserFixture(
    {
      sites: [site],
      accounts: [{ id: 'alice', siteId: site.id, username: 'alice', password: 'alice-password' }],
    },
    { checkinControlSeen: false },
  );
  fixture.tabUrls.set(1, 'https://a.test/profile');
  fixture.session['learn:1'] = {
    tabId: 1,
    runId: 'learn-alice',
    siteId: site.id,
    accountId: 'alice',
    kind: 'both',
    createdAt: Date.now(),
    events: [
      {
        type: 'fill',
        selector: '#username',
        fieldRole: 'username',
        hasValue: true,
        path: '/login',
        at: 1,
      },
      {
        type: 'fill',
        selector: '#password',
        fieldRole: 'password',
        hasValue: true,
        path: '/login',
        at: 2,
      },
      {
        type: 'click',
        selector: '#login',
        label: '登录',
        loginAction: 'submit',
        path: '/login',
        at: 3,
      },
      { type: 'navigation', path: '/profile', at: 4 },
    ],
  };
  const unfinished = await fixture.services.learningService.toggle('alice', 'both');
  assert.equal(unfinished.ok, false);
  assert.match(unfinished.error, /没有录到签到动作/);
  assert.equal(fixture.local.sites[0].checkin.method, 'auto');
  assert.ok(fixture.session['learn:1']);
  const selected = await fixture.services.learningService.toggle('alice', 'both', {
    loginAsCheckin: true,
  });
  assert.equal(selected.ok, true, selected.error);
  assert.equal(fixture.local.sites[0].checkin.method, 'none');
  assert.equal(fixture.local.sites[0].checkin.learnedLoginAsCheckinSource, 'explicit');
});

test('checkin: a learned site adapter user ID never becomes a new account identity', async () => {
  const fixture = browserFixture({
    sites: [
      {
        id: 'site-a',
        name: 'A',
        loginUrl: 'https://a.test/login',
        loginMethod: 'form',
        selectors: { username: '#username', password: '#password', submit: '#login' },
        adapter: { userId: 'teacher-id' },
        checkin: {
          method: 'workflow',
          workflow: {
            route: ['/profile'],
            identityPath: '/profile',
            steps: [{ type: 'click', selector: '#claim' }],
          },
        },
      },
    ],
    accounts: [{ id: 'new-account', siteId: 'site-a', username: 'new', password: 'password' }],
  });
  const started = await fixture.services.bgCheckinState.Ah('new-account', async () => {});
  assert.equal(started.ok, true, started.error);
  const task = await fixture.services.bgCheckinState.V.get(started.tabId);
  assert.equal(task.accountIdentityUserId, undefined);
  assert.equal(task.site.adapter.userId, undefined);
  assert.equal(fixture.local.accounts[0].identity, undefined);
});

test('accounts: batch saving trims names, rejects invalid rows and preserves existing passwords', async () => {
  const fixture = browserFixture({
    accounts: [{ id: 'existing', siteId: 'site-a', username: 'Alice', password: 'original' }],
    sites: [{ id: 'site-a', loginUrl: 'https://a.test/login', name: 'A' }],
    proxies: [],
  });
  const result = await fixture.services.accountService.addMany(
    [
      { siteId: 'site-a', username: ' ALICE ', password: 'replacement' },
      { siteId: 'site-a', username: ' Bob ', password: 'first' },
      { siteId: 'site-a', username: 'bob', password: 'second' },
      { siteId: 'missing', username: 'Charlie', password: 'third' },
      { siteId: 'site-a', username: 'Dora', password: '' },
    ],
    new Set(['site-a']),
  );
  assert.deepEqual(plain(result), { added: 1, skipped: 4 });
  assert.equal(fixture.local.accounts.length, 2);
  assert.equal(fixture.local.accounts[0].password, 'original');
  assert.equal(fixture.local.accounts[1].username, 'Bob');
  assert.equal(fixture.local.accounts[1].password, 'first');
});

test('accounts/sites: deleting a site preserves its account; reassignment removes old-site identity and results', async () => {
  const fixture = browserFixture({
    sites: [
      { id: 'old-site', name: 'Old', loginUrl: 'https://old.test/login' },
      { id: 'new-site', name: 'New', loginUrl: 'https://new.test/login' },
    ],
    accounts: [
      {
        id: 'account-a',
        siteId: 'old-site',
        username: 'alice',
        password: 'preserved-password',
        label: 'preserved-note',
        proxyMode: 'inherit',
        identity: { userId: '304', session: { cookies: ['old-cookie'] } },
        apiToken: 'old-token',
        loginMethod: 'token',
        loginEntry: { key: 'oauth:google', method: 'oauth', label: 'Google' },
        githubUsername: 'old-github',
        githubPassword: 'old-github-password',
        passkey: { id: 'old-passkey' },
      },
    ],
    results: { 'account-a': { ok: true } },
    balances: { 'account-a': { quota: 100 } },
    status: { 'account-a:old': 'done' },
  });
  await fixture.services.siteService.remove('old-site');
  assert.equal(fixture.local.accounts.length, 1);
  assert.equal(fixture.local.accounts[0].siteId, 'old-site');
  assert.deepEqual(
    fixture.local.sites.map((site) => site.id),
    ['new-site'],
  );
  assert.deepEqual(
    plain(await fixture.services.siteService.list()).map((site) => site.id),
    ['new-site'],
  );
  await fixture.services.accountService.update('account-a', { siteId: 'new-site' });
  const account = fixture.local.accounts[0];
  assert.equal(account.password, 'preserved-password');
  assert.equal(account.label, 'preserved-note');
  assert.equal(account.proxyMode, 'inherit');
  assert.equal(account.siteId, 'new-site');
  for (const key of [
    'identity',
    'apiToken',
    'loginMethod',
    'loginEntry',
    'githubUsername',
    'githubPassword',
    'passkey',
  ]) {
    assert.equal(
      Object.hasOwn(account, key),
      false,
      `${key} must not follow an account to another site`,
    );
  }
  assert.deepEqual(fixture.local.results, {});
  assert.deepEqual(fixture.local.balances, {});
  assert.deepEqual(fixture.local.status, {});
  await fixture.services.accountService.removeMany(['account-a']);
  assert.deepEqual(fixture.local.accounts, []);
});

test('proxies: name-only entries cannot bind accounts; failed lease acquisition and cancellation release control', async () => {
  const fixture = browserFixture({
    sites: [{ id: 'site-a', name: 'A', loginUrl: 'https://a.test/login' }],
    proxies: [
      { id: 'name-only', name: 'Display node', nameOnly: true, scheme: 'http', host: '', port: 0 },
      { id: 'real', name: 'Real outlet', scheme: 'http', host: '127.0.0.1', port: 7890 },
    ],
    accounts: [],
  });
  await assert.rejects(
    fixture.services.accountService.add({
      siteId: 'site-a',
      username: 'alice',
      password: 'p',
      proxyMode: 'pool',
      proxyId: 'name-only',
    }),
    /真实|仅名称/,
  );
  assert.equal(fixture.local.accounts.length, 0);
  const outlet = fixture.local.proxies[1];
  fixture.proxy.rejectControl = true;
  await assert.rejects(fixture.services.proxyService.acquire(1, outlet), /其他扩展/);
  assert.equal(fixture.session.proxyHolderTabId, undefined);
  assert.equal(fixture.proxy.value.mode, 'system');
  fixture.proxy.rejectControl = false;
  assert.equal(await fixture.services.proxyService.acquire(1, outlet), true);
  assert.equal(await fixture.services.proxyService.acquire(2, outlet), false);
  await fixture.services.proxyService.release(1);
  assert.equal(fixture.session.proxyHolderTabId, undefined);
  assert.equal(fixture.proxy.value.mode, 'system');
  assert.equal(fixture.proxy.clears, 2);
});

test('records: failed refresh preserves the previous balance, while manual completion is explicitly identified', async () => {
  const fixture = browserFixture();
  const first = new Date(2026, 10, 23, 8).getTime();
  const last = new Date(2026, 10, 23, 12).getTime();
  await fixture.services.recordService.saveBalance('account-a', {
    quota: 100,
    usedQuota: 20,
    at: first,
    symbol: '$',
  });
  await fixture.services.recordService.saveBalance('account-a', {
    quota: 110,
    usedQuota: 22,
    at: last,
  });
  await fixture.services.recordService.saveBalanceError('account-a', '暂时无法读取');
  const balance = (await fixture.services.recordService.getBalances())['account-a'];
  assert.equal(balance.quota, 110);
  assert.equal(balance.usedQuota, 22);
  assert.equal(balance.symbol, '$');
  assert.equal(balance.error, '暂时无法读取');
  await fixture.services.checkinService.handleMutation({
    action: 'mark-done',
    accountId: 'account-a',
  });
  const result = (await fixture.services.recordService.getResults())['account-a'];
  assert.equal(result.ok, true);
  assert.equal(result.manual, true);
  assert.ok(Object.values(fixture.local.status).includes('done'));
});

test('accounts: Chrome CSV preserves quoted password fields and reports existing, duplicate and unmatched rows', async () => {
  const accounts = await import(
    pathToFileURL(path.join(workspace, 'src/modules/accounts/view.js'))
  );
  const { createUiScope } = await import(
    pathToFileURL(path.join(workspace, 'src/shared/ui-scope.js'))
  );
  const scope = createUiScope({ accounts: accounts.appRuntime }, {});
  accounts.appRuntime.scope = scope;
  accounts.appRuntime.register(scope);
  const rows = accounts.parsePasswordCsv(
    '\uFEFFname,url,username,password\n' +
      '"Site, A",https://a.test/login," Alice ","p,""word"""\n' +
      'A,https://a.test/login,Bob,first\n' +
      'A,https://a.test/login,bob,second\n' +
      'Unknown,https://unknown.test/login,Carol,third\n',
  );
  assert.equal(rows[0].name, 'Site, A');
  assert.equal(rows[0].username, 'Alice');
  assert.equal(rows[0].password, 'p,"word"');
  const matches = accounts.matchImportedAccounts(
    rows,
    [{ id: 'site-a', name: 'A', loginUrl: 'https://a.test/login' }],
    [{ siteId: 'site-a', username: 'alice' }],
  );
  assert.deepEqual(
    matches.map((row) => row.kind),
    ['existing', 'matched', 'duplicate', 'unmatched'],
  );
  assert.throws(
    () => accounts.parsePasswordCsv('url,username\nhttps://a.test/login,Alice'),
    /缺少列/,
  );
});

async function settingsFixture() {
  const module = await import(pathToFileURL(path.join(workspace, 'src/modules/settings/view.js')));
  const { createUiScope } = await import(
    pathToFileURL(path.join(workspace, 'src/shared/ui-scope.js'))
  );
  const scope = createUiScope({ settings: module.appRuntime }, {});
  module.appRuntime.scope = scope;
  module.appRuntime.register(scope);
  for (let step = 0; step < 8; step++) module.appRuntime.initialize(scope, step);
  return module;
}

test('settings: encrypted backup preserves its supported contents while excluding browser sessions and proxy passwords', async () => {
  const settings = await settingsFixture();
  const payload = settings.createBackupPayload(
    [{ id: 'site-a', name: 'A', loginUrl: 'https://a.test/login', proxyId: 'proxy-a' }],
    [
      {
        id: 'account-a',
        siteId: 'site-a',
        username: 'alice',
        password: 'login-password',
        proxyId: 'proxy-a',
        customProxy: { host: '127.0.0.1', port: 7891, password: 'custom-proxy-password' },
        identity: { userId: '304', session: { cookies: ['private-session'] } },
      },
    ],
    [
      {
        id: 'proxy-a',
        name: 'Outlet',
        scheme: 'http',
        host: '127.0.0.1',
        port: 7890,
        password: 'proxy-password',
      },
    ],
    [{ nodeName: 'Outlet', port: 7890, listenerName: 'hub-7890' }],
    'https://subscription.test/list',
  );
  assert.equal(payload.format, 'aah-backup-v1');
  assert.equal(payload.accounts[0].password, 'login-password');
  assert.equal(payload.accounts[0].identity.userId, '304');
  assert.equal(Object.hasOwn(payload.accounts[0].identity, 'session'), false);
  const serialized = JSON.stringify(payload);
  assert.equal(serialized.includes('private-session'), false);
  assert.equal(serialized.includes('proxy-password'), false);
  assert.equal(serialized.includes('custom-proxy-password'), false);
  const encrypted = await settings.encryptBackup(serialized, 'test-passphrase', {
    exportedAt: '2026-11-23T00:00:00.000Z',
    extensionVersion: '0.2.2',
  });
  assert.equal(encrypted.encrypted, true);
  assert.equal(encrypted.payload.includes('login-password'), false);
  assert.equal(await settings.decryptBackup(encrypted, 'test-passphrase'), serialized);
  await assert.rejects(settings.decryptBackup(encrypted, 'wrong-passphrase'), /口令不正确/);
  assert.equal(settings.validateBackupPayload(JSON.parse(serialized)).accounts.length, 1);
});
