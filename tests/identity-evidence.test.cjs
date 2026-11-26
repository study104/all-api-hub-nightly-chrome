const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const esbuild = require('esbuild');

const workspace = path.resolve(__dirname, '..');
const plain = (value) => JSON.parse(JSON.stringify(value));
const runtimeBundle = esbuild.buildSync({
  stdin: {
    contents: `
      import { initializeContentModules } from './src/shared/content-runtime.js';
      import { createSharedAutoContent } from './src/shared/content-support.js';
      import { createCheckinAutoContent } from './src/modules/checkin/content.js';
      import { createLearningAutoContent } from './src/modules/learning/content.js';
      import { createSliderAutoContent } from './src/modules/slider/content.js';
      export function createRuntime() {
        const scope = Object.create(null);
        const modules = {
          shared: createSharedAutoContent(scope),
          checkin: createCheckinAutoContent(scope),
          learning: createLearningAutoContent(scope),
          slider: createSliderAutoContent(scope),
        };
        initializeContentModules(modules);
        return { scope, api: modules.checkin.api };
      }
    `,
    resolveDir: workspace,
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
});

function storage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    get length() {
      return values.size;
    },
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    key: (index) => [...values.keys()][index] ?? null,
  };
}

function element(tagName, attributes = {}, text = '') {
  const attributesMap = new Map(Object.entries(attributes));
  return {
    tagName: tagName.toUpperCase(),
    innerText: text,
    textContent: text,
    id: attributes.id ?? '',
    className: attributes.class ?? '',
    htmlFor: attributes.for ?? '',
    type: attributes.type ?? '',
    value: attributes.value ?? '',
    readOnly: 'readonly' in attributes,
    disabled: 'disabled' in attributes,
    hidden: 'hidden' in attributes,
    getBoundingClientRect() {
      return this.hidden ? { width: 0, height: 0 } : { width: 100, height: 24 };
    },
    parentElement: null,
    previousElementSibling: null,
    nextElementSibling: null,
    getAttribute: (key) => attributesMap.get(key) ?? null,
    hasAttribute: (key) => attributesMap.has(key),
    querySelector: () => null,
    closest(selector) {
      if (this.inTable && /table|grid|listitem/.test(selector)) return this;
      if (this.inPasswordForm && selector === 'form') {
        return { querySelector: () => element('input', { type: 'password' }) };
      }
      return null;
    },
  };
}

function page({ text = '', fields = [], definitions = [], cards = [], nodes = {} } = {}) {
  const labels = fields.map(({ label, control }) => {
    const labelNode = element('label', { for: control.id }, label);
    labelNode.control = control;
    labelNode.inTable = control.inTable;
    labelNode.inPasswordForm = control.inPasswordForm;
    return labelNode;
  });
  const controls = fields.map(({ control }) => control);
  const terms = definitions.map(({ label, value }) => {
    const term = element('dt', {}, label);
    term.nextElementSibling = element('dd', {}, value);
    return term;
  });
  return {
    body: element('body', {}, text),
    getElementById: (id) => controls.find((control) => control.id === id) ?? null,
    querySelector: () => null,
    querySelectorAll(selector) {
      if (selector === 'label') return labels;
      if (selector === 'dt') return terms;
      if (selector.startsWith('input[readonly]')) return controls;
      if (selector === '.semi-tag') return cards.map((card) => card.tag);
      if (nodes[selector]) return nodes[selector];
      return [];
    },
  };
}

function profileCard(id, username, { hidden = false, inTable = false, className = '' } = {}) {
  const tag = element('div', { class: 'semi-tag', ...(hidden ? { hidden: '' } : {}) }, `ID: ${id}`);
  const badges = element('div');
  const name = element('div', {}, username);
  const nameBlock = element('div');
  const card = element('div', { class: className }, `${username}\n普通用户\nID: ${id}`);
  const avatar = element('span', { class: 'semi-avatar', role: 'listitem' });
  tag.parentElement = badges;
  badges.previousElementSibling = name;
  badges.parentElement = nameBlock;
  name.parentElement = nameBlock;
  nameBlock.parentElement = card;
  avatar.parentElement = card;
  tag.inTable = inTable;
  card.inTable = inTable;
  card.querySelector = (selector) => (selector.includes('.semi-avatar') ? avatar : null);
  return { tag, card };
}

function field(label, id, value, attributes = {}) {
  return {
    label,
    control: element('input', { id, value, readonly: '', ...attributes }),
  };
}

function fixture({
  local = {},
  session = {},
  document = page(),
  pathname = '/profile',
  origin = 'https://site.test',
  reply,
} = {}) {
  const requests = [];
  const module = { exports: {} };
  const location = {
    origin,
    pathname,
    hash: '',
    href: `${origin}${pathname}`,
  };
  const getComputedStyle = (node) => ({
    display: node.hidden ? 'none' : 'block',
    visibility: 'visible',
    opacity: '1',
  });
  const context = vm.createContext({
    module,
    exports: module.exports,
    console: { log() {}, warn() {}, error() {} },
    URL,
    Event,
    AbortController,
    Uint8Array,
    TextDecoder,
    TextEncoder,
    setTimeout,
    clearTimeout,
    location,
    document,
    localStorage: storage(local),
    sessionStorage: storage(session),
    chrome: { runtime: { id: 'test-extension' } },
    getComputedStyle,
    window: { getComputedStyle },
    async fetch(url, options) {
      const request = {
        url,
        method: options.method,
        credentials: options.credentials,
        headers: plain(options.headers),
        cache: options.cache,
        redirect: options.redirect,
      };
      requests.push(request);
      const response = (await reply?.(request, requests.length)) ?? {
        status: 401,
        body: { success: false },
      };
      return {
        status: response.status ?? 200,
        ok: (response.status ?? 200) >= 200 && (response.status ?? 200) < 300,
        redirected: response.redirected ?? false,
        url: response.url ?? url,
        headers: {
          get: (name) => (name === 'content-type' ? (response.type ?? 'application/json') : null),
        },
        json: async () => response.body,
        arrayBuffer: async () => Uint8Array.from(response.bytes ?? []).buffer,
      };
    },
  });
  vm.runInContext(runtimeBundle.outputFiles[0].text, context);
  const runtime = module.exports.createRuntime();
  const site = {
    id: 'site-a',
    loginUrl: 'https://site.test/login',
    loginMethod: 'form',
    adapter: { family: 'new-api', siteType: 'new-api', userId: '299' },
  };
  return { ...runtime, site, requests, context };
}

test('identity evidence: fresh cookie API wins over stale storage, tokens and page ID', async () => {
  const runtime = fixture({
    local: {
      user: JSON.stringify({ id: 300, username: 'other-account' }),
      auth_token: 'stale-token-that-must-not-replace-cookie-authentication',
    },
    document: page({ text: '个人资料\n用户 ID: 300\n用户名: other-account' }),
    reply: () => ({ body: { success: true, data: { id: 299, username: '3306' } } }),
  });
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity.source, 'api');
  assert.equal(identity.userId, '299');
  assert.equal(runtime.api.compareIdentity(identity, '3306', '299', {}).match, 'confirmed');
  assert.equal(runtime.requests.length, 1);
  assert.deepEqual(runtime.requests[0].headers, { Accept: 'application/json' });
  assert.equal(runtime.requests[0].credentials, 'include');
  assert.equal(runtime.requests[0].cache, 'no-store');
  assert.equal(runtime.requests[0].redirect, 'error');
});

test('identity evidence: a real other-account API ID cannot be overridden by the expected ID', async () => {
  const runtime = fixture({
    document: page({ text: '个人资料\n用户 ID: 299\n用户名: 3306' }),
    reply: () => ({ body: { data: { id: 300, username: '3306' } } }),
  });
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity.userId, '300');
  assert.equal(
    runtime.api.compareIdentity(identity, '3306', '299', { pageAccountMatch: '3306' }).match,
    'mismatch',
  );
  assert.deepEqual(runtime.requests[0].headers, { Accept: 'application/json' });
});

test('identity learning: a live page resource supplies a reusable current-user endpoint and JSON paths', async () => {
  let currentUserId = 'member-alice';
  const runtime = fixture({
    reply: (request) =>
      request.url.endsWith('/backend/whoami')
        ? { body: { result: { current_user: { id: currentUserId, login: 'alice' } } } }
        : { status: 404, body: { success: false } },
  });
  runtime.site.adapter = {};
  runtime.context.performance = {
    getEntriesByType: () => [
      { name: 'https://foreign.test/api/user/self' },
      { name: 'https://site.test/backend/whoami' },
    ],
  };
  const first = await runtime.api.readIdentity(runtime.site, undefined, {
    discover: true,
    serverOnly: true,
  });
  assert.equal(first.userId, 'member-alice');
  assert.deepEqual(plain(first.identitySource), {
    endpoint: '/backend/whoami',
    responseFields: { userId: 'result.current_user.id', username: 'result.current_user.login' },
  });
  assert.equal(runtime.requests[0].credentials, 'include');
  assert.equal(runtime.requests[0].method, 'GET');
  currentUserId = 'member-bob';
  const second = await runtime.api.readIdentity(runtime.site, undefined, {
    discover: true,
    serverOnly: true,
  });
  assert.equal(second.userId, 'member-bob');
  assert.equal(runtime.requests.length, 2);
  assert.doesNotMatch(JSON.stringify(second.identitySource), /member-alice|member-bob/);
});

test('identity learning: a configured page token location authenticates the live user without Cookie mixing', async () => {
  const runtime = fixture({
    local: { dashboard_bearer: 'current-page-token-value' },
    reply: (request) =>
      request.headers.Authorization
        ? { body: { data: { id: 'member-alice', username: 'alice' } } }
        : { status: 401, body: { success: false } },
  });
  runtime.site.adapter = {};
  runtime.site.identitySource = { endpoint: '/api/user/self', tokenKey: 'dashboard_bearer' };
  const current = await runtime.api.readIdentity(runtime.site, undefined, { discover: true });
  assert.equal(current.userId, 'member-alice');
  const tokenRequest = runtime.requests.find((request) => request.headers.Authorization);
  assert.equal(tokenRequest.credentials, 'omit');
  assert.equal(tokenRequest.headers.Authorization, 'Bearer current-page-token-value');
  assert.doesNotMatch(JSON.stringify(current.identitySource), /current-page-token-value/);
});

test('identity evidence: saved adapter and storage IDs alone never confirm a browser session', async () => {
  const runtime = fixture({ local: { user: JSON.stringify({ id: 299, username: '3306' }) } });
  assert.equal(await runtime.api.readIdentity(runtime.site), null);
  assert.equal(await runtime.api.readIdentity(runtime.site, undefined, { serverOnly: true }), null);
  assert.equal(runtime.api.compareIdentity(null, '3306', '299', {}).match, 'unknown');
  assert.equal(
    runtime.requests.some((request) => Object.hasOwn(request.headers, 'Authorization')),
    false,
  );
});

test('identity evidence: compatibility headers use the current storage hint and still inspect the response', async () => {
  const runtime = fixture({
    local: { user: JSON.stringify({ id: 300, username: 'other-account' }) },
    reply: (request) =>
      request.headers['New-API-User']
        ? { body: { data: { id: 300, username: 'other-account' } } }
        : { status: 401, body: { success: false } },
  });
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity.userId, '300');
  assert.equal(runtime.api.compareIdentity(identity, '3306', '299', {}).match, 'mismatch');
  const compatible = runtime.requests.find((request) => request.headers['New-API-User']);
  assert.equal(compatible.headers['New-API-User'], '300');
  assert.equal(Object.values(compatible.headers).includes('299'), false);
});

test('identity evidence: username-only API data cannot hide the page current user ID', async () => {
  const runtime = fixture({
    document: page({ text: '个人资料\n用户 ID: 300\n用户名: 3306' }),
    reply: () => ({ body: { data: { username: '3306' } } }),
  });
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity.userId, '300');
  assert.equal(runtime.api.compareIdentity(identity, '3306', '299', {}).match, 'mismatch');
});

test('identity evidence: conflicting API name and page ID owner stays unknown', async () => {
  const runtime = fixture({
    document: page({ text: '个人资料\n用户 ID: 300\n用户名: other-account' }),
    reply: () => ({ body: { data: { username: '3306' } } }),
  });
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.ok(identity.identityConflict);
  assert.equal(identity.userId, undefined);
  assert.equal(
    runtime.api.compareIdentity(identity, '3306', '299', { pageAccountMatch: '3306' }).match,
    'unknown',
  );
});

test('identity evidence: HTTP failures, redirects, HTML and rejected JSON are not login evidence', async () => {
  for (const response of [
    { status: 401, body: { data: { id: 299 } } },
    { redirected: true, body: { data: { id: 299 } } },
    { url: 'https://site.test/login', body: { data: { id: 299 } } },
    { type: 'text/html', body: { data: { id: 299 } } },
    { body: { success: false, data: { id: 299 } } },
    { body: { code: 403, data: { id: 299 } } },
  ]) {
    const runtime = fixture({ reply: () => response });
    assert.equal(
      await runtime.api.readIdentity(runtime.site, undefined, { serverOnly: true }),
      null,
    );
  }
});

test('identity evidence: ordinary form login does not reuse an arbitrary stored token', async () => {
  const runtime = fixture({
    local: { auth_token: 'stale-token-that-belongs-to-another-user' },
  });
  assert.equal(await runtime.api.readIdentity(runtime.site), null);
  assert.equal(
    runtime.requests.some((request) => Object.hasOwn(request.headers, 'Authorization')),
    false,
  );
  assert.equal(
    runtime.requests.every((request) => request.credentials === 'include'),
    true,
  );
});

test('identity evidence: an explicit token uses token authentication without browser cookies', async () => {
  const runtime = fixture({
    reply: () => ({ body: { data: { id: 299, username: '3306' } } }),
  });
  const identity = await runtime.api.readIdentity(runtime.site, 'test-only-token');
  assert.equal(identity.userId, '299');
  assert.equal(runtime.requests.length, 1);
  assert.equal(runtime.requests[0].credentials, 'omit');
  assert.equal(runtime.requests[0].headers.Authorization, 'Bearer test-only-token');
  assert.equal(Object.values(runtime.requests[0].headers).includes('299'), false);
});

test('identity evidence: configured token fallback keeps cookie and token identity requests separate', async () => {
  const runtime = fixture({
    local: { configured_session: 'configured-test-token' },
    reply: (request) =>
      request.headers['X-Session']
        ? { body: { data: { id: 299 } } }
        : { status: 401, body: { success: false } },
  });
  runtime.site.tokenConfig = {
    storageKey: 'configured_session',
    storageType: 'localStorage',
    headerName: 'X-Session',
    headerPrefix: '',
    identityEndpoint: '/api/user/self',
  };
  assert.equal((await runtime.api.readIdentity(runtime.site)).userId, '299');
  assert.equal(runtime.requests[0].credentials, 'include');
  assert.equal(runtime.requests[0].headers['X-Session'], undefined);
  assert.equal(runtime.requests[1].credentials, 'omit');
  assert.equal(runtime.requests[1].headers['X-Session'], 'configured-test-token');
});

test('identity evidence: foreign configured identity endpoints do not receive credentials', async () => {
  const runtime = fixture();
  runtime.site.tokenConfig = {
    storageKey: 'token',
    headerName: 'Authorization',
    headerPrefix: 'Bearer ',
    identityEndpoint: 'https://foreign.test/api/user/self',
  };
  assert.equal(await runtime.api.readIdentity(runtime.site, 'test-only-token'), null);
  assert.deepEqual(runtime.requests, []);
});

test('identity evidence: structured API envelopes parse the user rather than the request ID', () => {
  const runtime = fixture();
  for (const response of [
    { id: 777, data: { user: { id: 299, username: '3306' } } },
    { success: true, data: { current_user: { user_id: '299', email: '3306@example.test' } } },
    { user_info: { uid: 299, username: '3306' } },
  ]) {
    assert.equal(runtime.scope.Si(response).userId, '299');
  }
  for (const response of [
    { success: false, data: { id: 299 } },
    { ok: false, data: { id: 299 } },
    { code: 401, data: { id: 299 } },
    { status: 'unauthorized', data: { id: 299 } },
    { data: [{ id: 299 }, { id: 300 }] },
    { users: [{ id: 299 }] },
  ]) {
    assert.equal(runtime.scope.Si(response), null);
  }
});

test('identity evidence: conflicting structured API user IDs cannot confirm an account', () => {
  const runtime = fixture();
  const identity = runtime.scope.Si({
    data: { user: { id: 299 }, currentUser: { id: 300 } },
  });
  assert.match(identity.identityConflict, /299.*300/);
  assert.equal(identity.userId, undefined);
  assert.equal(runtime.api.compareIdentity(identity, '3306', '299', {}).match, 'unknown');
  const aliases = runtime.scope.Si({ data: { id: 299, user_id: 300 } });
  assert.match(aliases.identityConflict, /299.*300/);
  assert.equal(aliases.userId, undefined);
});

test('identity evidence: unsafe or malformed API IDs cannot become a stored account key', () => {
  const runtime = fixture();
  for (const id of [
    -1,
    299.5,
    Number.MAX_SAFE_INTEGER + 1,
    '299\n300',
    'Bearer credential-value',
  ]) {
    const identity = runtime.scope.Si({ data: { id } });
    assert.equal(identity?.userId, undefined);
  }
  assert.equal(
    runtime.scope.Si({ data: { id: '6042e613-f89d-4f3c-8fce-99e1de7c0ead' } }).userId,
    '6042e613-f89d-4f3c-8fce-99e1de7c0ead',
  );
});

test('identity evidence: profile readonly labels and definition fields provide precise user identity', () => {
  const runtime = fixture({
    document: page({
      fields: [field('用户 ID', 'profile-id', '299'), field('用户名', 'profile-name', '3306')],
      definitions: [{ label: '邮箱', value: '3306@example.test' }],
    }),
  });
  const identity = runtime.api.readPageIdentity();
  assert.equal(identity.userId, '299');
  assert.equal(identity.username, '3306');
  assert.equal(identity.email, '3306@example.test');
  assert.equal(identity.evidence, 'structured-fields');
});

test('identity evidence: hidden, list, invitation and login controls cannot contaminate profile identity', () => {
  const valid = field('用户 ID', 'profile-id', '299');
  const hidden = field('用户 ID', 'hidden-id', '998', { hidden: '' });
  const list = field('用户 ID', 'list-id', '997');
  list.control.inTable = true;
  const invitation = field('用户 ID', 'invitation-user-id', '996');
  invitation.control.parentElement = element('section', { class: 'invitation' });
  const login = field('用户名', 'username', 'other-account');
  login.control.inPasswordForm = true;
  const runtime = fixture({
    document: page({ fields: [valid, hidden, list, invitation, login] }),
  });
  const identity = runtime.api.readPageIdentity();
  assert.equal(identity.userId, '299');
  assert.equal(identity.username, undefined);
  assert.equal(identity.identityConflict, undefined);
});

test('identity evidence: editable login names and duplicate visible IDs are not confirmation', () => {
  const editable = {
    label: '用户名',
    control: element('input', { id: 'username', value: '3306' }),
  };
  const login = fixture({ pathname: '/login', document: page({ fields: [editable] }) });
  assert.equal(login.api.readPageIdentity(), null);
  const profile = fixture({
    document: page({
      fields: [field('用户 ID', 'one', '299'), field('用户 ID', 'two', '300')],
    }),
  });
  const identity = profile.api.readPageIdentity();
  assert.match(identity.identityConflict, /299.*300/);
  assert.equal(identity.userId, undefined);
  assert.equal(profile.api.compareIdentity(identity, '3306', '299', {}).match, 'unknown');
  const text = fixture({ document: page({ text: '个人资料\n用户 ID: 299\n用户 ID: 300' }) });
  assert.ok(text.api.readPageIdentity().identityConflict);
});

test('shared identity: Agent Router personal card exposes its plain ID when APIs return challenge HTML', async () => {
  const runtime = fixture({
    pathname: '/console/personal',
    local: { user: JSON.stringify({ id: 300, username: 'old-account' }) },
    document: page({ cards: [profileCard('299', 'github_3306')] }),
    reply: () => ({ type: 'text/html', body: '<h1>访问验证</h1>' }),
  });
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity.userId, '299');
  assert.equal(identity.username, 'github_3306');
  assert.equal(identity.source, 'visible');
  assert.equal(identity.evidence, 'profile-card');
  assert.equal(
    runtime.api.compareIdentity(identity, '3306@example.test', '299', {}).match,
    'confirmed',
  );
});

test('shared identity: API identity remains authoritative over a cached personal card', async () => {
  const runtime = fixture({
    pathname: '/console/personal',
    document: page({ cards: [profileCard('299', 'github_3306')] }),
    reply: () => ({ body: { data: { id: 300, username: 'other-account' } } }),
  });
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity.userId, '300');
  assert.equal(identity.source, 'api');
  assert.equal(
    runtime.api.compareIdentity(identity, '3306@example.test', '299', {}).match,
    'mismatch',
  );
});

test('shared identity: bare IDs outside a profile and hidden, list or invitation cards are ignored', () => {
  const unrelated = fixture({
    pathname: '/console',
    document: page({ cards: [profileCard('299', 'some-user')] }),
  });
  assert.equal(unrelated.api.readPageIdentity(), null);
  const profile = fixture({
    pathname: '/console/personal',
    document: page({
      cards: [
        profileCard('299', 'current-user'),
        profileCard('998', 'hidden-user', { hidden: true }),
        profileCard('997', 'listed-user', { inTable: true }),
        profileCard('996', 'invited-user', { className: 'invitation' }),
      ],
    }),
  });
  assert.equal(profile.api.readPageIdentity().userId, '299');
});

test('shared identity: inconsistent current-user cards stop with conflicting IDs', () => {
  const runtime = fixture({
    pathname: '/console/personal',
    document: page({ cards: [profileCard('299', 'first'), profileCard('300', 'second')] }),
  });
  assert.match(runtime.api.readPageIdentity().identityConflict, /299.*300/);
});

test('shared identity: new unsupported sites use the same current-user probes', async () => {
  const runtime = fixture({
    reply: (request) =>
      new URL(request.url).pathname === '/api/user/self'
        ? { body: { data: { id: 'uuid-299', username: 'new-user' } } }
        : { status: 404 },
  });
  runtime.site.adapter = { family: 'unsupported', siteType: 'unknown' };
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity.userId, 'uuid-299');
  assert.equal(runtime.api.compareIdentity(identity, 'new-user', 'uuid-299').match, 'confirmed');
});

test('shared identity: custom API fields provide a name-only site identity', async () => {
  const runtime = fixture({
    reply: (request) =>
      new URL(request.url).pathname === '/whoami'
        ? { body: { result: { principal: { screen_name: 'unique-user' } } } }
        : { status: 404 },
  });
  runtime.site.identitySource = {
    endpoint: '/whoami',
    responseFields: { username: 'result.principal.screen_name' },
  };
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity.userId, undefined);
  assert.equal(identity.username, 'unique-user');
  assert.equal(runtime.api.compareIdentity(identity, 'unique-user').match, 'confirmed');
  assert.equal(new URL(runtime.requests[0].url).pathname, '/whoami');
  assert.equal(runtime.requests[0].credentials, 'include');
});

test('shared identity: name and nickname fields cannot become a unique login name without a mapping', async () => {
  const runtime = fixture({
    reply: () => ({ body: { data: { name: 'Alice', email: 'someone@example.test' } } }),
  });
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity.username, undefined);
  assert.equal(identity.displayName, 'Alice');
  assert.notEqual(runtime.api.compareIdentity(identity, 'Alice').match, 'confirmed');
});

test('shared identity: explicit user ID mapping separates user and tenant identifiers', async () => {
  const runtime = fixture({
    reply: () => ({
      body: { data: { user_id: '299', account_id: '900', username: 'alice' } },
    }),
  });
  runtime.site.identitySource = {
    endpoint: '/api/user/self',
    responseFields: { userId: 'data.user_id' },
  };
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity.userId, '299');
  assert.equal(identity.identityConflict, undefined);
});

test('shared identity: configured visible identity fields work on unfamiliar profile routes', async () => {
  const name = element('span', {}, 'unique-user');
  const id = element('span', { 'data-user-id': 'uuid-299' });
  const runtime = fixture({
    pathname: '/member/preferences',
    document: page({ nodes: { '#member-name': [name], '#member-id': [id] } }),
  });
  runtime.site.identitySource = {
    pagePath: '/member/preferences',
    pageFields: { userId: '#member-id', username: '#member-name' },
  };
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity.userId, 'uuid-299');
  assert.equal(identity.username, 'unique-user');
  assert.equal(identity.evidence, 'structured-fields');
});

test('shared identity: only exact login names or complete emails confirm name-only accounts', () => {
  const runtime = fixture();
  for (const identity of [
    { username: 'alice@example.test', source: 'api' },
    { email: 'alice@example.test', source: 'visible' },
  ]) {
    assert.equal(runtime.api.compareIdentity(identity, 'alice@example.test').match, 'confirmed');
  }
  for (const identity of [
    { username: 'alice', source: 'api' },
    { displayName: 'alice@example.test', source: 'api' },
    { email: 'ali***@example.test', source: 'visible' },
    { username: 'alice@example.test', source: 'storage' },
  ]) {
    assert.notEqual(runtime.api.compareIdentity(identity, 'alice@example.test').match, 'confirmed');
  }
  assert.equal(
    runtime.api.compareIdentity(
      { username: 'site-user', source: 'api' },
      'account note',
      undefined,
      {
        expectedIdentity: { username: 'site-user' },
      },
    ).match,
    'confirmed',
  );
});

test('shared identity: another saved name-only account cannot supply this account identity', () => {
  const runtime = fixture();
  assert.equal(
    runtime.api.compareIdentity({ username: 'alice', source: 'api' }, 'alice', undefined, {
      knownIdentities: [{ username: 'ALICE', label: 'other account' }],
    }).match,
    'mismatch',
  );
});

test('shared identity: a saved site login name remains authoritative over a changed account label', () => {
  const runtime = fixture();
  assert.equal(
    runtime.api.compareIdentity({ username: 'new-label', source: 'api' }, 'new-label', undefined, {
      expectedIdentity: { username: 'original-user' },
    }).match,
    'mismatch',
  );
  assert.equal(
    runtime.api.compareIdentity(
      { email: 'new-label@example.test', source: 'api' },
      'new-label@example.test',
      undefined,
      {
        expectedIdentity: { username: 'original-user' },
      },
    ).match,
    'unknown',
  );
});

test('shared identity: failure diagnostics identify endpoint and response type without credentials', async () => {
  const diagnostics = [];
  const runtime = fixture({
    reply: () => ({ type: 'text/html', body: '<h1>访问验证</h1>' }),
  });
  runtime.site.tokenConfig = {
    storageKey: 'token',
    identityEndpoint: '/api/user/self?access_token=private-query-token',
  };
  assert.equal(
    await runtime.api.readIdentity(runtime.site, 'private-header-token', { diagnostics }),
    null,
  );
  assert.match(diagnostics.join('\n'), /身份接口 \/api\/user\/self.*HTML/);
  assert.doesNotMatch(diagnostics.join('\n'), /private-query-token|private-header-token/);
});

test('shared identity: even a single unbound account requires actual identity evidence', () => {
  const runtime = fixture();
  for (const loginMethod of ['form', 'github', 'auto', 'manual']) {
    assert.notEqual(
      runtime.scope.Qp({
        loginMethod,
        verdict: 'unknown',
        siteAccountCount: 1,
        checkinPageAvailable: false,
        canSwitchAccount: false,
      }).action,
      'proceed',
    );
  }
});

test('identity evidence: having one account cannot replace confirmation of its bound ID', () => {
  const runtime = fixture();
  const options = {
    loginMethod: 'form',
    verdict: 'unknown',
    expectedUserId: '299',
    siteAccountCount: 1,
    checkinPageAvailable: false,
    canSwitchAccount: false,
  };
  assert.notEqual(runtime.scope.Qp(options).action, 'proceed');
  assert.equal(runtime.scope.Qp({ ...options, identityConfirmedThisRun: true }).action, 'proceed');
  assert.notEqual(
    runtime.scope.Qp({ ...options, verdict: 'mismatch', identityConfirmedThisRun: true }).action,
    'proceed',
  );
});

test('identity performance: compatibility is tried beside its endpoint and the next sample is fresh', async () => {
  let currentId = '299';
  const runtime = fixture({
    local: { user: JSON.stringify({ id: 299 }) },
    reply: (request) =>
      request.headers['New-API-User']
        ? { body: { data: { id: currentId, username: 'current-user' } } }
        : { status: 401, body: { success: false } },
  });
  const first = await runtime.api.readIdentity(runtime.site);
  assert.equal(first.userId, '299');
  assert.equal(runtime.requests.length, 2);
  assert.equal(
    runtime.requests.every((request) => new URL(request.url).pathname === '/api/user/self'),
    true,
  );
  currentId = '300';
  runtime.context.localStorage.setItem('user', JSON.stringify({ id: 300 }));
  const second = await runtime.api.readIdentity(runtime.site);
  assert.equal(second.userId, '300');
  assert.equal(runtime.requests.length, 3);
  assert.equal(runtime.requests[2].headers['New-API-User'], '300');
  assert.equal(runtime.api.compareIdentity(second, '3306', '299', {}).match, 'mismatch');
  assert.deepEqual(plain([...runtime.scope.identityProbeHints.values()]), [
    { endpoint: '/api/user/self', mode: 'hint' },
  ]);
});

test('identity performance: remembered endpoints recover after failure and stay separate by site', async () => {
  let replacement = false;
  const runtime = fixture({
    reply: (request) => {
      const path = new URL(request.url).pathname;
      const available = replacement ? path === '/api/user/self' : path === '/api/user/info';
      return available
        ? { body: { data: { id: 299 } } }
        : { status: 404, body: { success: false } };
    },
  });
  await runtime.api.readIdentity(runtime.site);
  assert.equal(runtime.requests.length, 2);
  await runtime.api.readIdentity(runtime.site);
  assert.equal(runtime.requests.length, 3);
  assert.equal(new URL(runtime.requests[2].url).pathname, '/api/user/info');
  await runtime.api.readIdentity({ ...runtime.site, id: 'independent-site' });
  assert.equal(runtime.requests.length, 5);
  assert.equal(new URL(runtime.requests[3].url).pathname, '/api/user/self');
  replacement = true;
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity.userId, '299');
  assert.equal(runtime.requests.length, 7);
  assert.equal(new URL(runtime.requests[5].url).pathname, '/api/user/info');
  assert.equal(new URL(runtime.requests[6].url).pathname, '/api/user/self');
});

test('identity performance: clearing login state clears transport hints without caching identities', async () => {
  const runtime = fixture({
    reply: (request) =>
      new URL(request.url).pathname === '/api/user/info'
        ? { body: { data: { id: 299 } } }
        : { status: 404, body: { success: false } },
  });
  await runtime.api.readIdentity(runtime.site);
  await runtime.api.readIdentity(runtime.site);
  assert.equal(runtime.requests.length, 3);
  runtime.scope.di();
  assert.equal(runtime.scope.identityProbeHints.size, 0);
  await runtime.api.readIdentity(runtime.site);
  assert.equal(runtime.requests.length, 5);
});

test('identity performance: remembered explicit Token transport rebuilds credentials and never uses cookies', async () => {
  const runtime = fixture({
    reply: () => ({ body: { data: { id: 299 } } }),
  });
  await runtime.api.readIdentity(runtime.site);
  await runtime.api.readIdentity(runtime.site, 'first-test-token');
  await runtime.api.readIdentity(runtime.site, 'second-test-token');
  assert.equal(runtime.requests.length, 3);
  assert.equal(runtime.requests[0].credentials, 'include');
  assert.equal(runtime.requests[1].credentials, 'omit');
  assert.equal(runtime.requests[2].credentials, 'omit');
  assert.equal(runtime.requests[2].headers.Authorization, 'Bearer second-test-token');
  assert.equal(
    JSON.stringify([...runtime.scope.identityProbeHints.values()]).includes('test-token'),
    false,
  );
  assert.equal(
    runtime.requests.every(
      (request) => request.cache === 'no-store' && request.redirect === 'error',
    ),
    true,
  );
});

test('identity performance: credential query URLs are always rebuilt and never retained in transport hints', async () => {
  const runtime = fixture({
    reply: () => ({ body: { data: { id: 299 } } }),
  });
  runtime.site.tokenConfig = {
    storageKey: 'token',
    headerName: 'Authorization',
    headerPrefix: 'Bearer ',
    identityEndpoint: '/api/user/self?access_token=first-query-secret',
  };
  await runtime.api.readIdentity(runtime.site, 'first-header-secret');
  runtime.site.tokenConfig.identityEndpoint = '/api/user/self?access_token=second-query-secret';
  await runtime.api.readIdentity(runtime.site, 'second-header-secret');
  assert.equal(runtime.requests.length, 2);
  assert.match(runtime.requests[1].url, /second-query-secret/);
  assert.equal(runtime.scope.identityProbeHints.size, 0);
});

test('login performance: visible login forms and established sessions do not wait two seconds', async () => {
  const runtime = fixture({
    document: page({
      nodes: { 'button, a, [role="button"]': [element('button', {}, '退出登录')] },
    }),
  });
  const waits = [];
  runtime.scope.w = async (ms) => waits.push(ms);
  runtime.scope.Nu = () => null;
  runtime.scope.nr = () => null;
  runtime.scope.On = () => false;
  assert.equal(await runtime.scope.br(runtime.site, [], 6000), true);
  runtime.context.location.pathname = '/login';
  runtime.context.location.href = 'https://site.test/login';
  runtime.scope.On = () => true;
  assert.equal(await runtime.scope.br(runtime.site, [], 6000), false);
  assert.deepEqual(waits, []);
});

test('login performance: a loading page still waits for actual login evidence', async () => {
  const runtime = fixture();
  let now = 0;
  runtime.context.Date = class extends Date {
    static now() {
      return now;
    }
  };
  runtime.scope.w = async (ms) => {
    now += ms;
  };
  runtime.scope.Nu = () => null;
  runtime.scope.nr = () => null;
  runtime.scope.On = () => false;
  runtime.context.document.querySelectorAll = (selector) =>
    selector === 'button, a, [role="button"]' && now >= 600
      ? [element('button', {}, '退出登录')]
      : [];
  runtime.scope.qi = async () => null;
  assert.equal(await runtime.scope.br(runtime.site, [], 6000), true);
  assert.equal(now, 600);
});

test('popup performance: ready pages shorten empty grace while loading pages retain it', async () => {
  const runtime = fixture();
  let now = 0;
  runtime.context.Date = class extends Date {
    static now() {
      return now;
    }
  };
  runtime.scope.w = async (ms) => {
    now += ms;
  };
  runtime.scope.Ht = () => [];
  runtime.scope.Yt = async () => ({ closed: 0, kept: 0, lostEvidence: false });
  runtime.scope.Zt = async () => 'skipped';
  runtime.scope.Vt = () => false;
  runtime.scope.Ft = () => false;
  runtime.scope.qt = () => [];
  runtime.scope.On = () => true;
  runtime.scope.ar = () => false;
  await runtime.scope.Qt(runtime.site, [], { waitForAppear: true });
  assert.equal(now, 250);
  now = 0;
  runtime.scope.On = () => false;
  await runtime.scope.Qt(runtime.site, [], { waitForAppear: true });
  assert.equal(now, 2500);
});

test('popup performance: an overlay arriving during the short ready-page grace is still cleaned', async () => {
  const runtime = fixture();
  let now = 0;
  let cleanups = 0;
  runtime.context.Date = class extends Date {
    static now() {
      return now;
    }
  };
  runtime.scope.w = async (ms) => {
    now += ms;
  };
  runtime.scope.Ht = () => [];
  runtime.scope.Yt = async () => {
    cleanups += 1;
    return { closed: cleanups > 1 ? 1 : 0, kept: 0, lostEvidence: false };
  };
  runtime.scope.Zt = async () => 'skipped';
  runtime.scope.Vt = () => false;
  runtime.scope.Ft = () => false;
  runtime.scope.qt = () => (now >= 100 ? [{}] : []);
  runtime.scope.On = () => true;
  runtime.scope.ar = () => false;
  await runtime.scope.Qt(runtime.site, [], { waitForAppear: true });
  assert.equal(cleanups, 2);
  assert.equal(now, 250);
});

function appearanceFixture(options) {
  const runtime = fixture(options);
  let now = 0;
  runtime.context.Date = class extends Date {
    static now() {
      return now;
    }
  };
  runtime.scope.w = async (ms) => {
    now += ms;
  };
  runtime.scope.Nu = () => null;
  runtime.scope.zp = () => false;
  runtime.scope.Kc = () => null;
  runtime.scope.Zc = async () => {};
  runtime.scope.x = () => 'current-test-task';
  return { ...runtime, now: () => now };
}

test('challenge performance: explicit success ends an empty appearance window but missing evidence retains it', async () => {
  const ready = appearanceFixture();
  assert.deepEqual(
    plain(
      await ready.scope.zu([], async () => {}, 10000, {
        appearanceWaitMs: 2500,
        stopWhenReady: () => true,
      }),
    ),
    { detected: false, resolved: true },
  );
  assert.equal(ready.now(), 0);
  const waiting = appearanceFixture();
  await waiting.scope.zu([], async () => {}, 10000, {
    appearanceWaitMs: 2500,
    stopWhenReady: () => false,
  });
  assert.equal(waiting.now(), 2500);
});

test('challenge performance: a delayed challenge outranks success arriving in the same polling cycle', async () => {
  const runtime = appearanceFixture();
  let handled = 0;
  runtime.scope.Nu = () =>
    runtime.now() >= 500 ? { category: 'interactive', kind: 'Arithmetic' } : null;
  runtime.scope.Fu = () => {
    handled += 1;
    return true;
  };
  const result = await runtime.scope.zu([], async () => {}, 10000, {
    appearanceWaitMs: 2500,
    stopWhenReady: () => runtime.now() >= 500,
  });
  assert.equal(result.kind, 'Arithmetic');
  assert.equal(result.detected, true);
  assert.equal(result.resolved, true);
  assert.equal(handled, 1);
  assert.equal(runtime.now(), 500);
});

test('challenge performance: active challenges and verification-code fields prevent success shortcuts', async () => {
  const arithmetic = appearanceFixture();
  let readinessCalls = 0;
  arithmetic.scope.Nu = () => ({ category: 'interactive', kind: 'Arithmetic' });
  arithmetic.scope.Fu = () => true;
  const result = await arithmetic.scope.zu([], async () => {}, 10000, {
    appearanceWaitMs: 2500,
    stopWhenReady: () => {
      readinessCalls += 1;
      return true;
    },
  });
  assert.equal(result.detected, true);
  assert.equal(result.kind, 'Arithmetic');
  assert.equal(readinessCalls, 0);
  const code = appearanceFixture();
  code.scope.zp = () => true;
  await code.scope.zu([], async () => {}, 10000, {
    appearanceWaitMs: 2500,
    stopWhenReady: () => {
      readinessCalls += 1;
      return true;
    },
  });
  assert.equal(readinessCalls, 0);
  assert.equal(code.now(), 2500);
});

test('challenge performance: post-click success avoids empty iframe discovery without ignoring delayed verification', async () => {
  const ready = appearanceFixture();
  let discoveries = 0;
  ready.scope.Zc = async () => {
    discoveries += 1;
  };
  const immediate = await ready.scope.Vp([], async () => {}, 10000, 2500, '签到点击', {
    stopWhenReady: () => true,
  });
  assert.equal(immediate.resolved, true);
  assert.equal(immediate.detected, false);
  assert.equal(discoveries, 0);
  assert.equal(ready.now(), 0);
  const challenge = appearanceFixture();
  let handled = 0;
  challenge.scope.Nu = () =>
    challenge.now() >= 500 ? { category: 'interactive', kind: 'Arithmetic' } : null;
  challenge.scope.Fu = () => {
    handled += 1;
    return true;
  };
  const delayed = await challenge.scope.Vp([], async () => {}, 10000, 2500, '签到点击', {
    stopWhenReady: () => challenge.now() >= 500,
  });
  assert.equal(delayed.kind, 'Arithmetic');
  assert.equal(delayed.detected, true);
  assert.equal(handled, 1);
  assert.equal(challenge.now(), 500);
});

for (const scenario of ['fresh-result', 'no-result', 'old-result-with-late-challenge']) {
  test(`workflow performance: ${scenario} preserves actual click and challenge guards`, async () => {
    const runtime = appearanceFixture();
    runtime.site.checkin = {
      method: 'workflow',
      workflow: { route: ['/profile'], identityPath: '/profile', steps: [] },
    };
    runtime.scope.U = async () => {};
    runtime.scope.Lu = async () => ({ resolved: true, detected: false });
    let result =
      scenario === 'old-result-with-late-challenge'
        ? { kind: 'already', words: ['今日已签到'] }
        : { kind: 'unknown' };
    let clickedAt;
    let clickGuardDelay;
    let afterClickDelay;
    let handled = 0;
    runtime.scope.qi = async () => ({
      source: 'api',
      userId: '299',
      username: '3306',
      endpoint: '/api/user/self',
    });
    runtime.scope.Uu = () => result;
    runtime.scope.Nu = () =>
      scenario === 'old-result-with-late-challenge' &&
      clickedAt !== undefined &&
      runtime.now() - clickedAt >= 500 &&
      !handled
        ? { category: 'interactive', kind: 'Arithmetic' }
        : null;
    runtime.scope.Fu = () => {
      handled += 1;
      return true;
    };
    runtime.scope.Nf = async (site, log, callbacks) => {
      const beforeGuard = runtime.now();
      assert.equal(await callbacks.beforeCheckinClick(), true);
      clickGuardDelay = runtime.now() - beforeGuard;
      clickedAt = runtime.now();
      if (scenario === 'fresh-result') result = { kind: 'success', words: ['签到成功'] };
      assert.equal(await callbacks.afterCheckinClick({ checkinAction: true }), true);
      afterClickDelay = runtime.now() - clickedAt;
      return { status: 'already', message: '已验证工作流完成' };
    };
    const outcome = await runtime.api.runTask(
      {
        accountId: 'current-account',
        username: '3306',
        password: 'test-only',
        accountIdentityUserId: '299',
        siteAccountCount: 2,
        siteAccountUserIds: { 300: 'another-account' },
        effectiveLoginMethod: 'form',
        stage: 'checkin',
        site: runtime.site,
        steps: [],
      },
      {
        async confirmIdentity() {},
        async saveIdentity() {},
        async markStage(stage) {
          assert.equal(stage, 'checkin');
        },
        async needsUser(message) {
          assert.fail(message);
        },
        async navigate() {
          assert.fail('The guarded test workflow must stay on its current page');
        },
      },
    );
    assert.equal(outcome?.ok, true, outcome?.message);
    assert.equal(clickGuardDelay, 0);
    if (scenario === 'fresh-result') assert.equal(afterClickDelay, 0);
    else if (scenario === 'no-result') assert.equal(afterClickDelay, 2500);
    else {
      assert.equal(afterClickDelay, 500);
      assert.equal(handled, 1);
    }
  });
}

for (const scenario of [
  'login-entry',
  'visible-logout',
  'hidden-logout',
  'visible-success',
  'hidden-success',
  'logout-with-challenge',
  'logout-with-verification-code',
]) {
  test(`login completion performance: ${scenario} uses actual after-click evidence`, async () => {
    const runtime = appearanceFixture({ pathname: '/login' });
    runtime.site.checkin = {
      method: 'workflow',
      workflow: { route: ['/profile'], identityPath: '/profile', steps: [] },
    };
    const logout = element(
      'button',
      scenario === 'hidden-logout' ? { hidden: '' } : {},
      '退出登录',
    );
    const loginEntry = element('button', {}, '账号密码');
    const success = element(
      'div',
      { id: 'logged-in', ...(scenario === 'hidden-success' ? { hidden: '' } : {}) },
      '登录成功',
    );
    if (scenario.includes('success')) runtime.site.successIndicator = '#logged-in';
    runtime.context.document.querySelectorAll = (selector) => {
      if (selector === '#logged-in') return [success];
      if (selector === 'button, a, [role="button"]')
        return scenario === 'login-entry'
          ? [loginEntry]
          : scenario.includes('logout')
            ? [logout]
            : [];
      return [];
    };
    runtime.scope.U = async () => {};
    runtime.scope.Lu = async () => ({ resolved: true, detected: false });
    runtime.scope.pr = async () => {};
    runtime.scope.hr = async () => true;
    runtime.scope.qi = async () => ({
      source: 'api',
      userId: '299',
      username: '3306',
      endpoint: '/api/user/self',
    });
    runtime.scope.Nf = async () => ({ status: 'already', message: '已核验当前账号' });
    let submitted = false;
    let checkingAfterClick = false;
    let handled = 0;
    let afterClickDelay;
    runtime.scope.On = () => !submitted;
    runtime.scope.An = () => !submitted;
    runtime.scope.ar = () => submitted;
    runtime.scope.nr = () =>
      checkingAfterClick && scenario === 'logout-with-verification-code' ? '二次验证验证码' : null;
    runtime.scope.Nu = () =>
      submitted && scenario === 'logout-with-challenge' && !handled
        ? { category: 'interactive', kind: 'Arithmetic' }
        : null;
    runtime.scope.Fu = () => {
      handled += 1;
      return true;
    };
    runtime.scope.gr = async (site, log, callbacks) => {
      assert.equal(await callbacks.beforeClick(), true);
      await callbacks.beforeNavigate();
      submitted = true;
      checkingAfterClick = true;
      const started = runtime.now();
      assert.equal(await callbacks.afterClick(), true);
      afterClickDelay = runtime.now() - started;
      checkingAfterClick = false;
      return true;
    };
    const outcome = await runtime.api.runTask(
      {
        accountId: 'current-account',
        username: '3306',
        password: 'test-only',
        accountIdentityUserId: '299',
        siteAccountCount: 2,
        siteAccountUserIds: { 300: 'another-account' },
        effectiveLoginMethod: 'form',
        stage: 'login',
        site: runtime.site,
        steps: [],
      },
      {
        async confirmIdentity() {},
        async saveIdentity() {},
        async recordFormCredentialsSubmitted() {},
        async markStage() {},
        async needsUser(message) {
          assert.fail(message);
        },
        async navigate() {
          assert.fail('The after-click test should retain its controlled page');
        },
      },
    );
    assert.equal(outcome?.ok, true, outcome?.message);
    if (['visible-logout', 'visible-success', 'logout-with-challenge'].includes(scenario))
      assert.equal(afterClickDelay, 0);
    else assert.equal(afterClickDelay, 2500);
    assert.equal(handled, scenario === 'logout-with-challenge' ? 1 : 0);
  });
}

const orevxCborUser = [
  0xa1,
  0x64,
  ...Buffer.from('data'),
  0xa2,
  0x62,
  ...Buffer.from('id'),
  0x19,
  0x01,
  0x2b,
  0x68,
  ...Buffer.from('username'),
  0x68,
  ...Buffer.from('googkang'),
];

function orevxFixture({
  sessionOnly = false,
  cbor = false,
  userId = 299,
  status = 200,
  type = 'application/json',
  responseBody,
} = {}) {
  const token = 'orevx-test-session-token';
  const runtime = appearanceFixture({
    origin: 'https://orevx.ai',
    pathname: '/user/checkins',
    local: {
      'auth-user': JSON.stringify({ id: 300, username: 'stale-other-account' }),
      ...(sessionOnly ? {} : { 'auth-token': token }),
      'api-key': 'api-key-is-not-the-dashboard-session',
    },
    session: sessionOnly ? { 'auth-token': token } : {},
    reply: () => ({
      status,
      ...(cbor
        ? { type: 'application/cbor', bytes: orevxCborUser }
        : {
            type,
            body:
              responseBody === undefined
                ? { data: { id: userId, username: 'googkang' } }
                : responseBody,
          }),
    }),
  });
  runtime.site = {
    id: 'orevx',
    name: 'Orevx Engine',
    loginUrl: 'https://orevx.ai/user/checkins',
    selectors: {},
    checkin: { method: 'auto' },
  };
  runtime.scope.On = () => false;
  runtime.scope.An = () => false;
  runtime.scope.nr = () => null;
  runtime.scope.U = async () => {};
  runtime.scope.Lu = async () => ({ resolved: true, detected: false });
  return runtime;
}

for (const [label, options] of [
  ['persistent JSON login', {}],
  ['session-only JSON login', { sessionOnly: true }],
  ['CBOR login', { cbor: true }],
]) {
  test(`Orevx login: ${label} reads the real current-user endpoint with the current session token`, async () => {
    const runtime = orevxFixture(options);
    const state = await runtime.api.readLoginState(runtime.site);
    assert.equal(state.status, 'authenticated');
    assert.equal(state.reason, 'stable_api_identity');
    assert.equal(state.identity.userId, '299');
    assert.equal(state.identity.username, 'googkang');
    assert.equal(runtime.requests.length, 2);
    assert.equal(runtime.now(), 300);
    for (const request of runtime.requests) {
      assert.equal(request.url, 'https://server.orevx.ai/api/user/me');
      assert.equal(request.headers.Authorization, 'Bearer orevx-test-session-token');
      assert.equal(request.credentials, 'omit');
      assert.equal(request.method, 'GET');
      assert.equal(request.cache, 'no-store');
      assert.equal(request.redirect, 'error');
      assert.equal(request.headers['New-Api-User'], undefined);
    }
    assert.equal(runtime.site.identitySource, undefined);
  });
}

test('Orevx login: expired tokens and stale auth-user storage cannot confirm a session', async () => {
  const runtime = orevxFixture({ status: 401 });
  const state = await runtime.api.readLoginState(runtime.site, { timeoutMs: 600 });
  assert.equal(state.status, 'pending');
  assert.equal(state.reason, 'session_probe_rejected');
  assert.equal(state.identity, undefined);
  assert.equal(
    runtime.requests.every(
      (request) => request.headers.Authorization === 'Bearer orevx-test-session-token',
    ),
    true,
  );
});

test('Orevx login: failure diagnostics distinguish expired sessions, HTML and absent tokens without logging secrets', async () => {
  for (const [options, expected, reason] of [
    [{ status: 401 }, /HTTP 401/, 'session_probe_rejected'],
    [{ status: 403 }, /HTTP 403/, 'session_probe_rejected'],
    [{ type: 'text/html' }, /返回 HTML/, 'identity_api_unavailable'],
    [{ removeToken: true }, /没有可用的会话 Token.*auth-token/, 'session_token_missing'],
    [{ responseBody: {} }, /未返回有效的当前用户字段/, 'identity_response_unusable'],
    [{ responseBody: null }, /用户资料解析失败/, 'identity_response_unusable'],
  ]) {
    const runtime = orevxFixture(options);
    if (options.removeToken) runtime.context.localStorage.removeItem('auth-token');
    const diagnostics = [];
    const state = await runtime.api.readLoginState(runtime.site, {
      timeoutMs: 600,
      diagnostics,
    });
    assert.equal(state.status, 'pending');
    assert.equal(state.reason, reason);
    assert.ok(diagnostics.some((message) => expected.test(message)));
    assert.equal(
      diagnostics.some((message) => /orevx-test-session-token|api-key-is-not/.test(message)),
      false,
    );
  }
});

test('Orevx login: validated defaults preserve site configuration and never match a lookalike origin', async () => {
  const runtime = orevxFixture();
  assert.equal(runtime.scope.Mr(runtime.site).pagePath, '/user/profile');
  for (const loginUrl of [
    'https://orevx.ai.evil.test/user/checkins',
    'https://orevx.ai:8443/user/checkins',
    'http://orevx.ai/user/checkins',
  ])
    assert.equal(runtime.scope.Mr({ ...runtime.site, loginUrl }), null);
  const identitySource = {
    endpoint: 'https://server.orevx.ai/custom/current-user',
    tokenKey: 'custom-session-key',
    responseFields: { userId: 'data.account_id' },
  };
  const configured = { ...runtime.site, identitySource };
  assert.equal(runtime.scope.Mr(configured).endpoint, identitySource.endpoint);
  assert.equal(runtime.scope.Mr(configured).tokenKey, identitySource.tokenKey);
  assert.equal(configured.identitySource, identitySource);
  runtime.context.location.origin = 'https://accounts.google.com';
  runtime.context.location.href = 'https://accounts.google.com/signin';
  runtime.context.location.pathname = '/signin';
  const identity = await runtime.api.readIdentity(runtime.site);
  assert.equal(identity, null);
  assert.equal(runtime.requests.length, 0);
});

test('Orevx login: account token changes are read again rather than reusing the previous session', async () => {
  const runtime = orevxFixture();
  await runtime.api.readIdentity(runtime.site);
  runtime.context.localStorage.setItem('auth-token', 'new-orevx-test-session-token');
  await runtime.api.readIdentity(runtime.site);
  assert.equal(runtime.requests.length, 2);
  assert.equal(runtime.requests[0].headers.Authorization, 'Bearer orevx-test-session-token');
  assert.equal(runtime.requests[1].headers.Authorization, 'Bearer new-orevx-test-session-token');
});

test('Orevx login: an incomplete stale local token does not hide the active sessionStorage auth bundle', async () => {
  const runtime = orevxFixture();
  runtime.context.sessionStorage.setItem('auth-token', 'active-session-test-token');
  runtime.context.sessionStorage.setItem('auth-session-id', 'active-session-test-id');
  runtime.context.sessionStorage.setItem(
    'auth-user',
    JSON.stringify({ id: 299, username: 'googkang' }),
  );
  const state = await runtime.api.readLoginState(runtime.site);
  assert.equal(state.status, 'authenticated');
  assert.equal(state.reason, 'stable_api_identity');
  assert.equal(state.identity.userId, '299');
  assert.equal(runtime.requests.length, 2);
  assert.equal(
    runtime.requests.every(
      (request) => request.headers.Authorization === 'Bearer active-session-test-token',
    ),
    true,
  );
  assert.equal(runtime.scope.Ti('auth-token', 'localStorage'), 'orevx-test-session-token');
});

test('Orevx login: bundle selection matches frontend restore validation and never supplies identity from storage', async () => {
  for (const storedUser of [null, { id: 0 }, { id: '300' }, { id: 3.5 }, { id: -1 }]) {
    const runtime = orevxFixture();
    runtime.context.localStorage.setItem('auth-session-id', 'stale-local-session-test-id');
    runtime.context.localStorage.setItem('auth-user', JSON.stringify(storedUser));
    runtime.context.sessionStorage.setItem('auth-token', 'active-session-test-token');
    runtime.context.sessionStorage.setItem('auth-session-id', 'active-session-test-id');
    runtime.context.sessionStorage.setItem(
      'auth-user',
      JSON.stringify({ id: 123456, username: 'stale-storage-name' }),
    );
    const identity = await runtime.api.readIdentity(runtime.site);
    assert.equal(identity.source, 'api');
    assert.equal(identity.userId, '299');
    assert.equal(identity.username, 'googkang');
    assert.equal(runtime.requests[0].headers.Authorization, 'Bearer active-session-test-token');
    assert.equal(runtime.requests[0].headers['New-Api-User'], undefined);
  }
});

test('Orevx login: complete local bundles keep restore order and explicit storage choices remain exact', async () => {
  const runtime = orevxFixture();
  runtime.context.localStorage.setItem('auth-session-id', 'local-session-test-id');
  runtime.context.sessionStorage.setItem('auth-token', 'session-test-token');
  runtime.context.sessionStorage.setItem('auth-session-id', 'session-test-id');
  runtime.context.sessionStorage.setItem('auth-user', JSON.stringify({ id: 299 }));
  assert.equal(runtime.scope.Ti('auth-token'), 'orevx-test-session-token');
  assert.equal(runtime.scope.Ti('auth-token', 'sessionStorage'), 'session-test-token');
  runtime.context.location.origin = 'https://orevx.ai.evil.test';
  runtime.context.localStorage.removeItem('auth-session-id');
  assert.equal(runtime.scope.Ti('auth-token'), 'orevx-test-session-token');
});

test('Orevx login: OAuth completing in the opener does not wait for a nonexistent navigation', async () => {
  const runtime = orevxFixture();
  const navigated = await runtime.scope.yr(runtime.site, [], 10000);
  assert.equal(navigated, false);
  assert.equal(runtime.now(), 300);
  assert.equal(runtime.requests.length, 2);
});

for (const [boundId, expectedCheckins] of [
  ['299', 1],
  ['300', 0],
]) {
  test(`Orevx login: real OAuth verification preserves the target-account gate for bound ID ${boundId}`, async () => {
    const runtime = orevxFixture();
    let checkins = 0;
    const handoffs = [];
    const saved = [];
    runtime.scope.Nf = async () => {
      checkins += 1;
      return { status: 'already', message: '已核验账号并确认今日已签到' };
    };
    const outcome = await runtime.api.runTask(
      {
        accountId: 'orevx-account',
        username: 'googkang',
        accountIdentityUserId: boundId,
        siteAccountCount: 2,
        siteAccountUserIds: {},
        effectiveLoginMethod: 'oauth',
        stage: 'verify-oauth',
        site: runtime.site,
        steps: [],
      },
      {
        async confirmIdentity() {},
        async saveIdentity(identity) {
          saved.push(plain(identity));
        },
        async markStage() {},
        async needsUser(message) {
          handoffs.push(message);
        },
        async navigate() {
          assert.fail('These OAuth-return fixtures remain on their existing site page');
        },
      },
    );
    assert.equal(checkins, expectedCheckins);
    if (expectedCheckins) assert.equal(outcome?.ok, true, outcome?.message);
    else {
      assert.equal(saved.length, 0);
      assert.ok(handoffs.some((message) => /账号|身份|299|300/.test(message)));
    }
  });
}

for (const initialStage of ['login', 'verify']) {
  test(`login success: a learned workflow in ${initialStage} obtains profile evidence through a read-only handoff before confirming login`, async () => {
    const runtime = appearanceFixture({ pathname: '/dashboard' });
    runtime.site = {
      ...runtime.site,
      selectors: {},
      checkin: {
        method: 'workflow',
        workflow: { route: ['/profile', '/checkins'], identityPath: '/profile', steps: [] },
      },
    };
    runtime.scope.On = () => false;
    runtime.scope.An = () => false;
    runtime.scope.nr = () => null;
    runtime.scope.U = async () => {};
    runtime.scope.Lu = async () => ({ resolved: true, detected: false });
    let checkins = 0;
    const navigations = [];
    const saved = [];
    runtime.scope.Nf = async () => {
      checkins += 1;
      return { status: 'already', message: '已核验资料页账号' };
    };
    const callbacks = {
      async confirmIdentity() {},
      async saveIdentity(identity) {
        saved.push(plain(identity));
      },
      async markStage() {},
      async needsUser(message) {
        assert.fail(message);
      },
      async navigate(url, steps, stage) {
        navigations.push({ url, stage, steps: [...steps] });
      },
    };
    const task = {
      accountId: 'profile-account',
      username: '3306',
      accountIdentityUserId: '299',
      formCredentialsSubmitted: initialStage === 'verify',
      siteAccountCount: 2,
      siteAccountUserIds: {},
      effectiveLoginMethod: 'form',
      stage: initialStage,
      site: runtime.site,
      steps: [],
    };
    const pending = await runtime.api.runTask(task, callbacks);
    assert.equal(pending, null);
    assert.equal(checkins, 0);
    assert.equal(saved.length, 0);
    assert.equal(navigations.length, 1);
    assert.equal(navigations[0].url, 'https://site.test/profile');
    assert.equal(navigations[0].stage, initialStage);
    assert.equal(
      navigations[0].steps.some((step) => /登录结果已确认|OAuth 授权完成/.test(step)),
      false,
    );
    runtime.context.location.pathname = '/profile';
    runtime.context.location.href = 'https://site.test/profile';
    runtime.context.document = page({ cards: [profileCard('299', '3306')] });
    const outcome = await runtime.api.runTask(
      { ...task, stage: navigations[0].stage, steps: navigations[0].steps },
      callbacks,
    );
    assert.equal(outcome?.ok, true, outcome?.message);
    assert.equal(checkins, 1);
    assert.equal(navigations.length, 1);
  });
}

test('login success: an unanswered OAuth opener never navigates away merely because a profile route is saved', async () => {
  const runtime = appearanceFixture({ pathname: '/login' });
  runtime.site = {
    ...runtime.site,
    selectors: {},
    checkin: {
      method: 'workflow',
      workflow: { route: ['/profile', '/checkins'], identityPath: '/profile', steps: [] },
    },
  };
  runtime.scope.On = () => false;
  runtime.scope.An = () => false;
  runtime.scope.nr = () => null;
  runtime.scope.U = async () => {};
  runtime.scope.Lu = async () => ({ resolved: true, detected: false });
  let navigations = 0;
  let checkins = 0;
  runtime.scope.Nf = async () => {
    checkins += 1;
    return { status: 'already', message: 'must not be reached' };
  };
  const outcome = await runtime.api.runTask(
    {
      accountId: 'oauth-account',
      username: '3306',
      accountIdentityUserId: '299',
      siteAccountCount: 2,
      siteAccountUserIds: {},
      effectiveLoginMethod: 'oauth',
      stage: 'verify-oauth',
      site: runtime.site,
      steps: [],
    },
    {
      async markStage() {},
      async needsUser(message) {
        assert.fail(message);
      },
      async navigate() {
        navigations += 1;
      },
    },
  );
  assert.equal(outcome?.ok, false);
  assert.equal(navigations, 0);
  assert.equal(checkins, 0);
});
