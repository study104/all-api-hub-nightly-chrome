const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');
const esbuild = require('esbuild');
const vm = require('node:vm');

const bundle = esbuild.buildSync({
  entryPoints: [path.resolve(__dirname, '../src/shared/login-state.js')],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'cjs',
});
const moduleObject = { exports: {} };
vm.runInNewContext(bundle.outputFiles[0].text, {
  module: moduleObject,
  exports: moduleObject.exports,
  Date,
  URL,
  setTimeout,
});
const { LoginStateResolver, classifyLoginState } = moduleObject.exports;
const user = (userId, source = 'api') => ({ userId, source, username: 'current-user' });

function resolver({ identities = [], pages = [{ sameOrigin: true }], onRead } = {}) {
  let now = 0;
  let identityReads = 0;
  let pageReads = 0;
  const reader = new LoginStateResolver({
    readPage: () => pages[Math.min(pageReads++, pages.length - 1)],
    readIdentity: async (site, options) => {
      onRead?.(options);
      return identities[Math.min(identityReads++, identities.length - 1)];
    },
    sleep: async (ms) => {
      now += ms;
    },
    now: () => now,
  });
  return { reader, now: () => now, identityReads: () => identityReads };
}

test('login state: OAuth returning to the same page confirms two fresh server identities promptly', async () => {
  const fixture = resolver({
    identities: [user('42'), user('42')],
    onRead(options) {
      assert.equal(options.timeoutMs, 1500);
      assert.equal(options.discover, true);
    },
  });
  const state = await fixture.reader.wait({ loginUrl: 'https://site.test/login' });
  assert.equal(state.status, 'authenticated');
  assert.equal(state.reason, 'stable_api_identity');
  assert.equal(fixture.identityReads(), 2);
  assert.equal(fixture.now(), 300);
});

test('login state: redirects, cached users, balance and display names cannot prove login', async () => {
  for (const identities of [
    [user('42', 'storage'), user('42', 'storage')],
    [{ source: 'api', displayName: 'Current User' }],
    [null],
  ]) {
    const fixture = resolver({
      identities,
      pages: [{ sameOrigin: true, navigated: true, balance: '$500', checkinMethod: 'api' }],
    });
    const state = await fixture.reader.wait({}, { timeoutMs: 600 });
    assert.equal(state.status, 'pending');
    assert.equal(state.reason, 'success_evidence_missing');
  }
});

test('login state: a failed or changing re-read cannot reuse earlier identity evidence', async () => {
  for (const identities of [
    [user('42'), null],
    [user('42'), user('43'), user('44')],
    [{ source: 'api', username: 'first' }, { source: 'api', username: 'second' }, null],
  ]) {
    const fixture = resolver({ identities });
    const state = await fixture.reader.wait({}, { timeoutMs: 600 });
    assert.equal(state.status, 'pending');
    assert.equal(state.reason, 'identity_unstable');
  }
});

test('login state: name-only sites can confirm complete stable login identifiers', async () => {
  const identity = { source: 'visible', email: 'person@example.test' };
  const fixture = resolver({ identities: [identity, { ...identity }] });
  const state = await fixture.reader.wait({});
  assert.equal(state.status, 'authenticated');
  assert.equal(state.reason, 'stable_page_identity');
});

test('login state: authorization, verification, completion and login errors outrank success controls', () => {
  for (const [page, status, reason] of [
    [{ sameOrigin: false }, 'pending', 'oauth_pending'],
    [{ secondFactor: '二次验证验证码' }, 'blocked', 'second_factor_pending'],
    [{ challenge: { kind: 'Turnstile' } }, 'blocked', 'challenge_pending'],
    [{ completionRequired: true }, 'blocked', 'account_completion_required'],
    [{ loginError: 'Invalid credentials' }, 'failed', 'login_rejected'],
    [{ loginForm: true }, 'pending', 'login_form_visible'],
  ]) {
    const state = classifyLoginState(
      { sameOrigin: true, logoutControl: true, successIndicator: true, ...page },
      [user('42'), user('42')],
    );
    assert.equal(state.status, status);
    assert.equal(state.reason, reason);
  }
  const conflict = classifyLoginState({ sameOrigin: true, logoutControl: true }, [
    { source: 'api', identityConflict: 'multiple user IDs' },
  ]);
  assert.equal(conflict.status, 'failed');
  assert.equal(conflict.reason, 'identity_conflict');
  const changing = classifyLoginState({ sameOrigin: true, logoutControl: true }, [
    user('42'),
    user('43'),
  ]);
  assert.equal(changing.status, 'pending');
  assert.equal(changing.reason, 'identity_unstable');
});

test('login state: a verification step appearing during an identity request still prevents success', async () => {
  const fixture = resolver({
    identities: [user('42'), user('42')],
    pages: [
      { sameOrigin: true },
      { sameOrigin: true },
      { sameOrigin: true },
      { sameOrigin: true, secondFactor: '二次验证验证码', logoutControl: true },
    ],
  });
  const state = await fixture.reader.wait({});
  assert.equal(state.status, 'blocked');
  assert.equal(state.reason, 'second_factor_pending');
  assert.equal(fixture.identityReads(), 2);
});

test('login state: a visible login form avoids probes and waiting while an established page is immediate', async () => {
  const loggedOut = resolver({
    identities: [user('42')],
    pages: [{ sameOrigin: true, loginForm: true }],
  });
  const first = await loggedOut.reader.wait({}, { stopOnLoginForm: true });
  assert.equal(first.reason, 'login_form_visible');
  assert.equal(loggedOut.now(), 0);
  assert.equal(loggedOut.identityReads(), 0);
  const loggedIn = resolver({ pages: [{ sameOrigin: true, logoutControl: true }] });
  const second = await loggedIn.reader.wait({});
  assert.equal(second.status, 'authenticated');
  assert.equal(loggedIn.now(), 0);
  assert.equal(loggedIn.identityReads(), 0);
});

test('login state: an account shell with a remaining login link still verifies two fresh current-user responses', async () => {
  const fixture = resolver({
    identities: [user('42'), user('42')],
    pages: [
      {
        sameOrigin: true,
        loginEntry: true,
        accountShellVisible: true,
        accountShellSource: 'Current user account controls',
      },
    ],
  });
  const state = await fixture.reader.wait({}, { stopOnLoginForm: true });
  assert.equal(state.status, 'authenticated');
  assert.equal(state.reason, 'stable_api_identity');
  assert.equal(state.identity.userId, '42');
  assert.equal(fixture.identityReads(), 2);
});

test('login state: every site reads the live session even when a real login entry remains visible without a known account shell', async () => {
  for (const loginUrl of ['https://site.test/login', 'https://unknown-new.test/auth/login']) {
    const fixture = resolver({
      identities: [
        { ...user('42'), endpoint: '/api/user/self' },
        { ...user('42'), endpoint: '/api/user/self' },
      ],
      pages: [{ sameOrigin: true, loginEntry: true }],
    });
    const state = await fixture.reader.wait({ loginUrl }, { stopOnLoginForm: true });
    assert.equal(state.status, 'authenticated', loginUrl);
    assert.equal(state.reason, 'stable_api_identity');
    assert.equal(state.identity.userId, '42');
    assert.match(state.detail, /\/api\/user\/self/);
    assert.equal(fixture.identityReads(), 2);
  }
});

test('login state: a real login entry is actionable only after reading a session with no current identity', async () => {
  const fixture = resolver({
    identities: [null],
    pages: [{ sameOrigin: true, loginEntry: true }],
  });
  const state = await fixture.reader.wait({}, { stopOnLoginForm: true, timeoutMs: 600 });
  assert.equal(state.status, 'pending');
  assert.equal(state.reason, 'login_entry_visible');
  assert.ok(fixture.identityReads() > 0);
});

test('login state: a remaining login entry cannot hide an interrupted or changing current-user identity', async () => {
  for (const identities of [
    [user('42'), null],
    [user('42'), user('43'), user('44')],
  ]) {
    const fixture = resolver({
      identities,
      pages: [{ sameOrigin: true, loginEntry: true }],
    });
    const state = await fixture.reader.wait({}, { stopOnLoginForm: true, timeoutMs: 600 });
    assert.equal(state.status, 'pending');
    assert.equal(state.reason, 'identity_unstable');
    assert.ok(fixture.identityReads() >= 2);
  }
});

test('login state: account shell text, cached users and an interrupted fresh read never establish a session', async () => {
  for (const identities of [[null], [user('42', 'storage')], [user('42'), null]]) {
    const fixture = resolver({
      identities,
      pages: [{ sameOrigin: true, accountShellVisible: true }],
    });
    const state = await fixture.reader.wait({}, { timeoutMs: 600 });
    assert.equal(state.status, 'pending');
    assert.equal(
      state.reason,
      identities[0]?.source === 'api' ? 'identity_unstable' : 'account_shell_unverified',
    );
    assert.equal(state.identity, undefined);
  }
});

test('login state: configured identity endpoint failures preserve their cause and remain pending', async () => {
  const site = {
    loginUrl: 'https://site.test/login',
    identitySource: { endpoint: '/api/user/me' },
  };
  for (const [diagnostic, reason] of [
    ['当前页面没有可用的会话 Token（存储键 auth-token）', 'session_token_missing'],
    ['HTTP 401', 'session_probe_rejected'],
    ['HTTP 403', 'session_probe_rejected'],
    ['HTTP 503', 'identity_api_unavailable'],
    ['返回 HTML 页面，可能是访问验证或登录页', 'identity_api_unavailable'],
    ['请求失败或被站点访问校验拦截', 'identity_api_unavailable'],
    ['请求超时', 'identity_api_unavailable'],
    ['响应发生跳转，未采用身份', 'identity_api_unavailable'],
    ['未返回有效的当前用户字段', 'identity_response_unusable'],
    ['JSON / CBOR 用户资料解析失败', 'identity_response_unusable'],
  ]) {
    const diagnostics = [];
    const fixture = resolver({
      identities: [null],
      pages: [{ sameOrigin: true, accountShellVisible: true }],
      onRead(options) {
        options.diagnostics.push(`身份接口 /api/user/me（当前会话）：${diagnostic}`);
      },
    });
    const state = await fixture.reader.wait(site, { timeoutMs: 600, diagnostics });
    assert.equal(state.status, 'pending', diagnostic);
    assert.equal(state.reason, reason, diagnostic);
    assert.ok(state.detail.includes(diagnostic));
    assert.equal(state.identity, undefined);
    assert.ok(diagnostics.some((message) => message.endsWith(diagnostic)));
  }
});

test('login state: guessed or foreign endpoint errors cannot replace the configured identity cause', async () => {
  for (const [site, diagnostic] of [
    [{ loginUrl: 'https://site.test/login' }, '身份接口 /api/user/self（当前会话）：HTTP 401'],
    [
      {
        loginUrl: 'https://site.test/login',
        identitySource: { endpoint: '/backend/current-user' },
      },
      '身份接口 /api/user/self（当前会话）：HTTP 401',
    ],
    [
      {
        loginUrl: 'https://site.test/login',
        identitySource: { endpoint: 'https://identity.site.test/api/user/me' },
      },
      '身份接口 https://foreign.test/api/user/me（本站 Token）：HTTP 401',
    ],
  ]) {
    const fixture = resolver({
      identities: [null],
      onRead(options) {
        options.diagnostics.push(diagnostic);
      },
    });
    const state = await fixture.reader.wait(site, { timeoutMs: 600 });
    assert.equal(state.status, 'pending');
    assert.equal(state.reason, 'success_evidence_missing');
  }
});

test('login state: progress diagnostics need only push and preserve the configured probe failure', async () => {
  const messages = [];
  const diagnostics = {
    push(message) {
      messages.push(message);
    },
  };
  const fixture = resolver({
    identities: [null],
    pages: [{ sameOrigin: true, accountShellVisible: true }],
    onRead(options) {
      options.diagnostics.push('身份接口 /api/user/me（当前会话）：HTTP 401');
    },
  });
  const state = await fixture.reader.wait(
    {
      loginUrl: 'https://site.test/login',
      identitySource: { endpoint: '/api/user/me' },
    },
    { timeoutMs: 600, diagnostics },
  );
  assert.equal(state.status, 'pending');
  assert.equal(state.reason, 'session_probe_rejected');
  assert.ok(messages.length > 0);
  assert.ok(messages.every((message) => message.endsWith('HTTP 401')));
});
