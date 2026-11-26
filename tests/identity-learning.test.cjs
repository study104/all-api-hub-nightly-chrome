const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { before, after, test } = require('node:test');

let identity;
let IdentitySourceLearner;
const originalStyle = global.getComputedStyle;
before(async () => {
  identity = await import(
    pathToFileURL(path.resolve(__dirname, '../src/shared/account-identity.js'))
  );
  ({ IdentitySourceLearner } = await import(
    pathToFileURL(path.resolve(__dirname, '../src/modules/learning/identity-learning.js'))
  ));
  global.getComputedStyle = (node) => ({
    display: node.hidden ? 'none' : 'block',
    visibility: 'visible',
    opacity: '1',
  });
});
after(() => {
  global.getComputedStyle = originalStyle;
});

function pageFixture({
  text = 'ID: 194516',
  attributes = { 'data-testid': 'current-user-id' },
  tag = 'span',
} = {}) {
  function element(tag, attrs = {}, text = '') {
    const values = new Map(Object.entries(attrs));
    return {
      nodeType: 1,
      tagName: tag.toUpperCase(),
      textContent: text,
      innerText: text,
      children: [],
      parentElement: null,
      id: attrs.id ?? '',
      className: attrs.class ?? '',
      readOnly: Object.hasOwn(attrs, 'readonly'),
      disabled: Object.hasOwn(attrs, 'disabled'),
      type: attrs.type ?? '',
      value: attrs.value ?? '',
      hidden: false,
      getAttribute: (name) => values.get(name) ?? null,
      hasAttribute: (name) => values.has(name),
      setAttribute(name, value) {
        values.set(name, value);
        if (name === 'id') this.id = value;
      },
      getBoundingClientRect: () => ({ left: 10, top: 10, width: 100, height: 24 }),
      querySelector: () => null,
      closest(selector) {
        if (this.inUserList && /role="(?:list|grid)"/.test(selector)) return this;
        if (selector === 'form' && this.inLoginForm)
          return { querySelector: () => element('input', { type: 'password' }) };
        return null;
      },
      matches(selector) {
        return matches(this, selector);
      },
    };
  }
  const body = element('body', {}, '个人资料\n用户 ID: 194516');
  const main = element('main', { id: 'profile' });
  const node = element(tag, attributes, text);
  body.children = [main];
  main.parentElement = body;
  main.children = [node];
  node.parentElement = main;
  function matches(node, selector) {
    const found = selector
      .trim()
      .match(/^([a-z][\w-]*)?(?:\[([\w-]+)="([^"]*)"\])?(?::nth-of-type\((\d+)\))?$/i);
    if (!found) return false;
    if (found[1] && node.tagName.toLowerCase() !== found[1].toLowerCase()) return false;
    if (found[2] && node.getAttribute(found[2]) !== found[3]) return false;
    if (found[4]) {
      const siblings = node.parentElement.children.filter(
        (other) => other.tagName === node.tagName,
      );
      if (siblings.indexOf(node) + 1 !== Number(found[4])) return false;
    }
    return true;
  }
  const listeners = new Map();
  const document = {
    body,
    documentElement: null,
    querySelector: () => null,
    querySelectorAll(selector) {
      return [body, main, ...main.children].filter((node) => {
        return selector.split(',').some((selection) => {
          const parts = selection.split('>').map((part) => part.trim());
          let current = node;
          for (let index = parts.length - 1; index >= 0; index--) {
            if (!current || !matches(current, parts[index])) return false;
            current = current.parentElement;
          }
          return true;
        });
      });
    },
    addEventListener(name, callback) {
      const callbacks = listeners.get(name) ?? [];
      callbacks.push(callback);
      listeners.set(name, callbacks);
    },
    removeEventListener(name, callback) {
      listeners.set(
        name,
        (listeners.get(name) ?? []).filter((item) => item !== callback),
      );
    },
  };
  const location = {
    origin: 'https://site.test',
    pathname: '/member/preferences',
    hash: '',
    href: 'https://site.test/member/preferences',
  };
  function emit(name, target = node, extra = {}) {
    const event = {
      composedPath: () => [target, main, body],
      preventDefault() {
        this.prevented = true;
      },
      stopImmediatePropagation() {
        this.stopped = true;
      },
      ...extra,
    };
    for (const callback of listeners.get(name) ?? []) {
      callback(event);
      if (event.stopped) break;
    }
    return event;
  }
  return { document, location, node, main, body, emit, element };
}

function learnerFixture(options = {}) {
  const page = pageFixture(options.page);
  const sent = [];
  const learner = new IdentitySourceLearner({
    site: { id: 'site-a', loginUrl: 'https://site.test/login' },
    document: page.document,
    location: page.location,
    window: {},
    wait: async () => {},
    send: async (observation) => {
      sent.push(structuredClone(observation));
      return { ok: true };
    },
    ...options,
  });
  return { ...page, learner, sent };
}

test('identity learning: the current-user response supplies exact JSON paths', () => {
  const result = identity.discoverIdentityResponse({
    success: true,
    id: 'request-9',
    data: { user: { id: 194516, username: 'github_194515', email: 'alice@example.test' } },
  });
  assert.equal(result.identity.userId, '194516');
  assert.deepEqual(result.responseFields, {
    userId: 'data.user.id',
    username: 'data.user.username',
    email: 'data.user.email',
  });
});

test('identity learning: configured namespaces and name-only fields retain their actual paths', () => {
  const result = identity.discoverIdentityResponse(
    { result: { principal: { uid: 'member-a', tenant: 4, screen_name: 'alice' } } },
    { userId: 'result.principal.uid', username: 'result.principal.screen_name' },
  );
  assert.equal(result.identity.userId, 'member-a');
  assert.deepEqual(result.responseFields, {
    userId: 'result.principal.uid',
    username: 'result.principal.screen_name',
  });
  assert.equal(
    identity.discoverIdentityResponse({ data: [{ id: 'someone-else' }] }).identity,
    null,
  );
  assert.equal(identity.discoverIdentityResponse({ data: { nickname: 'Alice' } }).identity, null);
});

test('identity learning: resource discovery excludes foreign, account-specific and action URLs', () => {
  const urls = [
    '/backend/whoami',
    '/api/account/current',
    '/api/v1/auth/me',
    '/api/user/self',
    'https://foreign.test/api/user/self',
    '/api/user/194516/profile',
    '/api/user/self?token=secret',
    '/api/user/list',
    '/api/user/logout',
    '/api/checkin/me',
    '/assets/profile.js',
  ].map((name) => ({ name: new URL(name, 'https://site.test').href }));
  assert.deepEqual(identity.discoverIdentityEndpoints(urls, 'https://site.test'), [
    '/backend/whoami',
    '/api/account/current',
    '/api/v1/auth/me',
    '/api/user/self',
  ]);
});

test('identity learning: selecting an ID badge stores its label rule and reuses it for another account', () => {
  const { node, document } = pageFixture();
  const descriptor = identity.describeIdentityField(node, 'userId', document);
  assert.deepEqual(descriptor, {
    value: '194516',
    selector: 'span[data-testid="current-user-id"]',
    rule: { kind: 'text', prefix: 'ID: ' },
  });
  node.innerText = node.textContent = 'ID: 200701';
  assert.equal(identity.readIdentityField(node, 'userId', descriptor.rule), '200701');
  assert.doesNotMatch(
    JSON.stringify({ selector: descriptor.selector, rule: descriptor.rule }),
    /194516/,
  );
});

test('identity learning: the live Orevx ID badge ignores changing registration age across accounts', () => {
  const { node, document } = pageFixture({
    tag: 'div',
    attributes: {},
    text: 'ID 10496, Registered for 89 days',
  });
  const descriptor = identity.describeIdentityField(node, 'userId', document);
  assert.equal(descriptor.value, '10496');
  assert.deepEqual(descriptor.rule, { kind: 'text', prefix: 'ID ', stopAt: ',' });
  assert.equal(identity.readIdentityField(node, 'userId'), '10496');
  assert.doesNotMatch(JSON.stringify(descriptor.rule), /10496|89|Registered/);
  node.innerText = node.textContent = 'ID 200701, Registered for 90 days';
  assert.equal(identity.readIdentityField(node, 'userId', descriptor.rule), '200701');
  assert.deepEqual(
    identity.readIdentitySource({
      identitySource: {
        pageFieldRules: { userId: descriptor.rule },
        pageFields: { userId: descriptor.selector },
      },
    }).pageFieldRules.userId,
    descriptor.rule,
  );
});

test('identity learning: an ID repeated in its registration age still has one bounded extraction', () => {
  const { node, document } = pageFixture({ text: 'ID 89, Registered for 89 days' });
  const descriptor = identity.describeIdentityField(node, 'userId', document);
  assert.equal(descriptor.value, '89');
  assert.deepEqual(descriptor.rule, { kind: 'text', prefix: 'ID ', stopAt: ',' });
});

test('identity learning: a current-user profile card discovers the visible ID and its reusable reading rule', () => {
  const { node, main, body, document, location } = pageFixture({
    tag: 'div',
    attributes: {},
    text: 'ID 10496, Registered for 89 days',
  });
  location.pathname = '/user/profile';
  location.href = `${location.origin}${location.pathname}`;
  body.innerText = body.textContent = '';
  main.innerText = main.textContent = 'ID 10496, Registered for 89 days\nCURRENT USER\nYankangg302';
  const first = identity.readVisibleAccountIdentity(
    document,
    location,
    {},
    { collectSource: true },
  );
  assert.equal(first.userId, '10496');
  assert.equal(first.evidence, 'profile-card');
  assert.deepEqual(first.identitySource.pageFieldRules.userId, {
    kind: 'text',
    prefix: 'ID ',
    stopAt: ',',
  });
  node.innerText = node.textContent = 'ID 200701, Registered for 90 days';
  main.innerText = main.textContent =
    'ID 200701, Registered for 90 days\nCURRENT USER\nAnotherUser';
  const next = identity.readVisibleAccountIdentity(document, location, first.identitySource);
  assert.equal(next.userId, '200701');
});

test('identity learning: an unrelated ID badge and a user-list ID cannot become the current profile identity', () => {
  const { node, main, body, document, location } = pageFixture({
    tag: 'div',
    attributes: {},
    text: 'ID 10496, Registered for 89 days',
  });
  location.pathname = '/user/profile';
  location.href = `${location.origin}${location.pathname}`;
  body.innerText = body.textContent = '';
  main.innerText = main.textContent = 'Subscription information\nID 10496, Registered for 89 days';
  assert.equal(identity.readVisibleAccountIdentity(document, location), null);
  main.innerText = main.textContent = 'ID 10496, Registered for 89 days\nCURRENT USER\nYankangg302';
  node.inUserList = true;
  assert.equal(identity.readVisibleAccountIdentity(document, location), null);
});

test('identity learning: account-valued DOM IDs are replaced by a reusable structural selector', () => {
  const { node, document } = pageFixture({ attributes: { id: 'user-194516' } });
  const descriptor = identity.describeIdentityField(node, 'userId', document);
  assert.equal(descriptor.selector, '[id="profile"] > span');
  node.setAttribute('id', 'user-200701');
  node.innerText = node.textContent = 'ID: 200701';
  assert.equal(document.querySelectorAll(descriptor.selector)[0], node);
  assert.equal(identity.readIdentityField(node, 'userId', descriptor.rule), '200701');
});

test('identity learning: compact labels are stripped and attribute values cannot replace visible IDs', () => {
  for (const text of ['ID:194516', 'UID:194516', '用户 ID：194516']) {
    const { node, document } = pageFixture({
      text,
      attributes: { 'data-testid': 'current-user-id', 'data-user-id': 'tenant-77' },
    });
    const descriptor = identity.describeIdentityField(node, 'userId', document);
    assert.equal(descriptor.value, '194516');
    assert.equal(descriptor.rule.kind, 'text');
    assert.equal(identity.readIdentityField(node, 'userId', descriptor.rule), '194516');
  }
  const { node, document } = pageFixture({ text: 'Email:alice@example.test' });
  const email = identity.describeIdentityField(node, 'email', document);
  assert.equal(email.value, 'alice@example.test');
  assert.equal(email.rule.prefix, 'Email:');
});

test('identity learning: explicit page mappings select the chosen user ID namespace', () => {
  const { node, body, document, location } = pageFixture();
  const descriptor = identity.describeIdentityField(node, 'userId', document);
  body.innerText = '个人资料\n用户 ID: tenant-77';
  const source = {
    pagePath: location.pathname,
    pageFields: { userId: descriptor.selector },
    pageFieldRules: { userId: descriptor.rule },
  };
  const result = identity.readVisibleAccountIdentity(document, location, source, {
    collectSource: true,
  });
  assert.equal(result.userId, '194516');
  assert.equal(result.identitySource.pageFields.userId, descriptor.selector);
  assert.deepEqual(result.identitySource.pageFieldRules.userId, descriptor.rule);
});

test('identity learning: missing fields, changed labels and duplicate matches never use a stale body ID', () => {
  const { node, document, location, main, element } = pageFixture();
  const source = {
    pagePath: location.pathname,
    pageFields: { userId: 'span[data-testid="current-user-id"]' },
    pageFieldRules: { userId: { kind: 'text', prefix: 'ID: ' } },
  };
  node.innerText = node.textContent = '订单: 194516';
  assert.equal(identity.readVisibleAccountIdentity(document, location, source), null);
  node.innerText = node.textContent = 'ID: 194516';
  const duplicate = element('span', { 'data-testid': 'current-user-id' }, 'ID: 194516');
  duplicate.parentElement = main;
  main.children.push(duplicate);
  assert.match(
    identity.readVisibleAccountIdentity(document, location, source).identityConflict,
    /多个可见元素/,
  );
});

test('identity learning: editable credentials, hidden controls and masked email are unreadable', () => {
  const fixture = pageFixture({
    tag: 'input',
    text: '',
    attributes: { id: 'login', value: 'alice' },
  });
  assert.equal(identity.describeIdentityField(fixture.node, 'username', fixture.document), null);
  fixture.node.readOnly = true;
  assert.equal(
    identity.describeIdentityField(fixture.node, 'username', fixture.document).value,
    'alice',
  );
  fixture.node.type = 'hidden';
  assert.equal(identity.describeIdentityField(fixture.node, 'username', fixture.document), null);
  fixture.node.type = 'text';
  fixture.node.value = 'a***@example.test';
  assert.equal(identity.describeIdentityField(fixture.node, 'email', fixture.document), null);
});

test("identity learning: selecting another user's list row never creates an identity field", () => {
  const { node, document } = pageFixture();
  node.inUserList = true;
  assert.equal(identity.describeIdentityField(node, 'userId', document), null);
});

test('identity learning: a pick is blocked from both site actions and action recording', (t) => {
  const fixture = learnerFixture();
  fixture.learner.start();
  t.after(() => fixture.learner.stop());
  let siteClicks = 0;
  let recordedClicks = 0;
  fixture.document.addEventListener('click', () => {
    recordedClicks++;
  });
  fixture.document.addEventListener('click', () => {
    siteClicks++;
  });
  fixture.learner.pick('userId');
  const pointer = fixture.emit('pointerdown');
  const click = fixture.emit('click');
  assert.equal(pointer.prevented, true);
  assert.equal(click.prevented, true);
  assert.equal(siteClicks, 0);
  assert.equal(recordedClicks, 0);
  assert.deepEqual(fixture.learner.source.pageFieldRules.userId, { kind: 'text', prefix: 'ID: ' });
  assert.doesNotMatch(JSON.stringify(fixture.learner.source), /194516/);
  const observed = fixture.learner.readVisible();
  assert.deepEqual(observed.selectedFields, ['userId']);
  assert.equal(observed.userId, '194516');
});

test('identity learning: selecting a nickname cannot establish a unique login name', (t) => {
  const fixture = learnerFixture({ page: { text: 'Alice', attributes: { id: 'nickname' } } });
  fixture.learner.start();
  t.after(() => fixture.learner.stop());
  fixture.learner.pick('username');
  fixture.emit('click');
  assert.equal(fixture.learner.source.pageFields, undefined);
  assert.match(fixture.learner.status, /显示昵称/);
  fixture.emit('keydown', fixture.node, { key: 'Escape' });
  assert.equal(fixture.learner.picking, null);
});

test('identity learning: API source acquisition rereads the current session twice before reporting', async () => {
  let reads = 0;
  const fixture = learnerFixture({
    getProgress: () => ({ signedIn: true, loginAt: 1 }),
    requestIdentity: async (site, token, options) => {
      reads++;
      assert.equal(token, undefined);
      assert.equal(options.serverOnly, true);
      assert.equal(options.discover, true);
      return {
        userId: 'current-member',
        username: 'alice',
        source: 'api',
        identitySource: {
          endpoint: '/backend/whoami',
          responseFields: { userId: 'result.user.uid' },
        },
      };
    },
  });
  fixture.learner.active = true;
  await fixture.learner.probe();
  assert.equal(reads, 2);
  assert.equal(fixture.sent.length, 1);
  assert.equal(fixture.sent[0].stable, true);
  assert.equal(fixture.sent[0].identitySource.responseFields.userId, 'result.user.uid');
});

test('identity learning: changing API identity or source across samples cannot be reported', async () => {
  for (const changed of ['id', 'source']) {
    let reads = 0;
    const fixture = learnerFixture({
      getProgress: () => ({ signedIn: true, loginAt: 1 }),
      requestIdentity: async () => ({
        userId: ++reads === 2 && changed === 'id' ? 'another-member' : 'current-member',
        source: 'api',
        identitySource: {
          endpoint: reads === 2 && changed === 'source' ? '/api/user/info' : '/api/user/self',
          responseFields: { userId: 'data.id' },
        },
      }),
    });
    fixture.learner.active = true;
    await fixture.learner.probe();
    assert.equal(fixture.sent.length, 0, changed);
  }
});

test('identity learning: navigation during an API read discards its source and account values', async () => {
  let resume;
  let reads = 0;
  const fixture = learnerFixture({
    getProgress: () => ({ signedIn: true }),
    requestIdentity: async () => {
      if (++reads === 1)
        await new Promise((resolve) => {
          resume = resolve;
        });
      return {
        userId: 'current-member',
        source: 'api',
        identitySource: { endpoint: '/api/user/self', responseFields: { userId: 'data.id' } },
      };
    },
  });
  fixture.learner.active = true;
  const pending = fixture.learner.probe();
  fixture.location.pathname = '/other';
  resume();
  await pending;
  assert.equal(fixture.sent.length, 0);
});

test('identity learning: API probes wait for a demonstrated login and report no previous session', async () => {
  let reads = 0;
  const fixture = learnerFixture({
    requestIdentity: async () => {
      reads++;
      return null;
    },
  });
  fixture.learner.active = true;
  await fixture.learner.probe();
  assert.equal(reads, 0);
  assert.equal(fixture.sent.length, 0);
});
