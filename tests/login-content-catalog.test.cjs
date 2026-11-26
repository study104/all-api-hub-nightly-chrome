const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const esbuild = require('esbuild');

const workspace = path.resolve(__dirname, '..');
const plain = (value) => JSON.parse(JSON.stringify(value));
const script = esbuild.buildSync({
  stdin: {
    contents: `
      import { initializeContentModules } from './src/shared/content-runtime.js';
      import { createSharedAutoContent } from './src/shared/content-support.js';
      import { createLearningAutoContent } from './src/modules/learning/content.js';
      import { createCheckinAutoContent } from './src/modules/checkin/content.js';
      import { createSliderAutoContent } from './src/modules/slider/content.js';
      export function createRuntime() {
        const scope = Object.create(null);
        const modules = {
          shared: createSharedAutoContent(scope),
          learning: createLearningAutoContent(scope),
          checkin: createCheckinAutoContent(scope),
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
}).outputFiles[0].text;
const sourceEntry = esbuild.buildSync({
  stdin: {
    contents: `import './src/entries/auto-login.js';`,
    resolveDir: workspace,
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
}).outputFiles[0].text;

class Element {
  constructor(tag, attributes = {}, text = '') {
    this.tagName = tag.toUpperCase();
    this.attributes = { ...attributes };
    this.id = attributes.id ?? '';
    this.name = attributes.name ?? '';
    this.className = attributes.class ?? '';
    this.type = attributes.type ?? (tag === 'input' ? 'text' : '');
    this.autocomplete = attributes.autocomplete ?? '';
    this.placeholder = attributes.placeholder ?? '';
    this.href = attributes.href ?? '';
    this.value = attributes.value ?? '';
    this.textContent = text;
    this.innerText = text;
    this.hidden = attributes.hidden === true;
    this.disabled = attributes.disabled === true;
    this.readOnly = attributes.readonly === true;
    this.labels = [];
    this.children = [];
    this.isConnected = true;
    this.parentElement = null;
    this.form = null;
  }
  getAttribute(name) {
    return this.attributes[name] ?? null;
  }
  hasAttribute(name) {
    return Object.hasOwn(this.attributes, name);
  }
  getBoundingClientRect() {
    return { width: this.hidden ? 0 : 160, height: this.hidden ? 0 : 32 };
  }
  matches(selector) {
    return selector.split(',').some((part) => {
      const candidate = part.trim();
      if (!candidate) return false;
      if (candidate.startsWith('#')) return this.id === candidate.slice(1);
      const tag = candidate.match(/^[a-z]+/i)?.[0];
      if (tag && tag.toUpperCase() !== this.tagName) return false;
      const attribute = candidate.match(/\[([\w-]+)(?:=["']?([^"' \]]+)["']?)?(?:\s+i)?\]/);
      if (attribute) {
        const value = this.getAttribute(attribute[1]) ?? this[attribute[1]];
        return attribute[2] ? String(value) === attribute[2] : value != null;
      }
      return candidate.toUpperCase() === this.tagName;
    });
  }
  querySelectorAll(selector) {
    return this.children.flatMap((child) => [
      ...(child.matches(selector) ? [child] : []),
      ...child.querySelectorAll(selector),
    ]);
  }
  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }
  closest(selector) {
    if (selector.split(',').some((part) => part.trim() === 'form')) return this.form;
    return null;
  }
}
class Input extends Element {
  constructor(attributes) {
    super('input', attributes);
  }
}
class Button extends Element {
  constructor(text, attributes = {}) {
    super('button', attributes, text);
  }
}
class Anchor extends Element {
  constructor(text, attributes = {}) {
    super('a', attributes, text);
  }
}
class Textarea extends Element {}

function page(controls = [], { native = false, heading = '登录' } = {}) {
  const body = new Element('body', {}, heading);
  body.children = [...controls];
  if (native) {
    const form = new Element('form', {}, '登录');
    form.children = [
      new Input({ name: 'username', autocomplete: 'username' }),
      new Input({
        name: 'password',
        type: 'password',
        autocomplete: 'current-password',
        value: 'do-not-return-this-password',
      }),
      new Button('登录', { type: 'submit' }),
    ];
    for (const child of form.children) {
      child.form = form;
      child.parentElement = form;
    }
    body.children.unshift(form);
  }
  return {
    title: heading,
    body,
    dispatchEvent: () => true,
    addEventListener() {},
    removeEventListener() {},
    querySelectorAll: (selector) => body.querySelectorAll(selector),
    querySelector: (selector) => body.querySelector(selector),
    getElementById: (id) =>
      body.querySelectorAll('button, a, input, form').find((element) => element.id === id) ?? null,
  };
}

function fixture({
  document = page(),
  url = 'https://site.test/login',
  scriptText = script,
  exportedRuntime = true,
} = {}) {
  let now = 1000;
  class Clock extends Date {
    static now() {
      return now;
    }
  }
  const parsed = new URL(url);
  const location = {
    origin: parsed.origin,
    pathname: parsed.pathname,
    hash: parsed.hash,
    href: parsed.href,
  };
  const listeners = [];
  const messages = [];
  const module = { exports: {} };
  const emptyStorage = { length: 0, getItem: () => null, removeItem() {}, key: () => null };
  const computedStyle = (element) => ({
    display: element.hidden ? 'none' : 'block',
    visibility: 'visible',
    opacity: '1',
  });
  const context = vm.createContext({
    module,
    exports: module.exports,
    console: { log() {}, warn() {}, error() {} },
    URL,
    Date: Clock,
    Event,
    CustomEvent: class extends Event {
      constructor(type, options = {}) {
        super(type, options);
        this.detail = options.detail;
      }
    },
    AbortController,
    Uint8Array,
    TextDecoder,
    TextEncoder,
    setTimeout,
    clearTimeout,
    location,
    document,
    window: { getComputedStyle: computedStyle, postMessage() {} },
    getComputedStyle: computedStyle,
    HTMLElement: Element,
    HTMLInputElement: Input,
    HTMLAnchorElement: Anchor,
    HTMLButtonElement: Button,
    HTMLTextAreaElement: Textarea,
    localStorage: emptyStorage,
    sessionStorage: emptyStorage,
    chrome: {
      runtime: {
        id: 'test-extension',
        onMessage: { addListener: (listener) => listeners.push(listener) },
        sendMessage(message, callback) {
          messages.push(plain(message));
          callback({ ok: true, task: null });
        },
      },
    },
    fetch: async () => {
      throw new Error('Login discovery must not query identity or make network requests');
    },
  });
  vm.runInContext(scriptText, context);
  const created = exportedRuntime ? module.exports.createRuntime() : {};
  const site = {
    id: 'site-a',
    name: 'A',
    loginUrl: 'https://site.test/login',
    selectors: {},
    loginMethod: 'github',
  };
  function dispatch(message, sender = { id: 'test-extension' }) {
    const responses = [];
    for (const listener of listeners) {
      listener(message, sender, (response) => responses.push(plain(response)));
    }
    assert.equal(responses.length, 1);
    return responses[0];
  }
  return {
    ...created,
    context,
    site,
    document,
    listeners,
    messages,
    dispatch,
    tick: (ms) => {
      now += ms;
    },
  };
}

for (const kind of ['source', 'output']) {
  test(`${kind} login catalog: the actual content entry can answer discovery with no checkin task`, async () => {
    const current = fixture({
      document: page([new Button('使用 Google 登录')]),
      scriptText:
        kind === 'source'
          ? sourceEntry
          : fs.readFileSync(
              path.join(workspace, 'output', 'chrome-mv3', 'content-scripts', 'auto-login.js'),
              'utf8',
            ),
      exportedRuntime: false,
    });
    await Promise.resolve();
    assert.deepEqual(current.messages, [{ type: 'GET_TASK' }]);
    const response = current.dispatch({ type: 'READ_LOGIN_OPTIONS', site: current.site });
    assert.equal(response.ok, true, response.error);
    assert.equal(response.feature.loginOptions.status, 'detected');
    assert.equal(response.feature.loginOptions.entries[0].method, 'oauth');
    assert.match(response.feature.loginOptions.entries[0].label, /Google/);
  });
}

test('login catalog: the installed content listener survives GET_TASK with no active task', async () => {
  const current = fixture({ document: page([], { native: true }) });
  await current.api.install();
  assert.deepEqual(current.messages, [{ type: 'GET_TASK' }]);
  const response = current.dispatch({ type: 'READ_LOGIN_OPTIONS', site: current.site });
  assert.equal(response.ok, true, response.error);
  assert.equal(response.feature.loginOptions.status, 'detected');
  assert.deepEqual(response.feature.loginOptions.methods, ['form']);
  assert.equal(response.feature.loginOptions.siteId, current.site.id);
});

test('login catalog: a foreign extension cannot invoke read-only discovery', async () => {
  const current = fixture({ document: page([], { native: true }) });
  await current.api.install();
  const response = current.dispatch(
    { type: 'READ_LOGIN_OPTIONS', site: current.site },
    { id: 'foreign-extension' },
  );
  assert.equal(response.ok, false);
  assert.match(response.error, /后台|扩展/);
  assert.equal(response.feature, undefined);
});

test('login catalog: each visible provider is distinct and GitHub is not duplicated as generic OAuth', () => {
  const current = fixture({
    document: page([
      new Button('使用 Google 登录'),
      new Button('使用 Linux DO 登录'),
      new Button('使用 GitHub 登录'),
      new Button('使用 Discord 登录'),
      new Button('使用 Microsoft 登录'),
    ]),
  });
  const result = plain(current.api.readLoginOptions(current.site));
  assert.equal(result.status, 'multiple');
  assert.equal(result.entries.length, 5);
  assert.equal(new Set(result.entries.map((entry) => entry.key)).size, 5);
  assert.equal(result.entries.filter((entry) => entry.method === 'github').length, 1);
  assert.equal(result.entries.filter((entry) => entry.method === 'oauth').length, 4);
  assert.ok(result.entries.some((entry) => /Google/i.test(entry.label)));
  assert.ok(result.entries.some((entry) => /Linux\s*DO/i.test(entry.label)));
  assert.ok(result.entries.some((entry) => /Discord/i.test(entry.label)));
  assert.ok(result.entries.some((entry) => /Microsoft/i.test(entry.label)));
});

test('login catalog: multiple OAuth entries remain multiple even when the coarse method is the same', () => {
  const current = fixture({
    document: page([new Button('使用 Google 登录'), new Button('使用 Linux DO 登录')]),
  });
  const result = plain(current.api.readLoginOptions(current.site));
  assert.equal(result.status, 'multiple');
  assert.equal(result.entries.length, 2);
  assert.ok(result.entries.every((entry) => entry.method === 'oauth'));
  assert.deepEqual(result.methods, ['oauth']);
});

test('login catalog: hidden provider and account settings controls do not become login choices', () => {
  const current = fixture({
    document: page([
      new Button('使用 Google 登录'),
      new Button('使用 GitHub 登录', { hidden: true }),
      new Button('绑定 Microsoft 账号'),
      new Button('重置邮箱验证码'),
    ]),
  });
  const result = plain(current.api.readLoginOptions(current.site));
  assert.equal(result.status, 'detected');
  assert.equal(result.entries.length, 1);
  assert.match(result.entries[0].label, /Google/);
});

test('login catalog: provider promotion buttons are excluded while bare provider login buttons remain available', () => {
  const promotion = fixture({
    document: page([
      new Button('查看 GitHub 项目'),
      new Button('Google Play 下载'),
      new Button('访问 Linux DO 社区'),
    ]),
  });
  const rejected = plain(promotion.api.readLoginOptions(promotion.site));
  assert.deepEqual(rejected.entries, []);
  assert.deepEqual(rejected.methods, []);
  for (const label of ['Google', 'GitHub', 'Linux DO']) {
    const current = fixture({ document: page([new Button(label)]) });
    const result = plain(current.api.readLoginOptions(current.site));
    assert.equal(result.status, 'detected');
    assert.equal(result.entries.length, 1);
    assert.equal(result.entries[0].label, label);
  }
});

test('login catalog: metadata contains neither credentials nor authorization query strings', () => {
  const current = fixture({
    document: page(
      [
        new Anchor('使用 Google 登录', {
          href: 'https://site.test/oauth/google?token=private-token&state=private-state#private-fragment',
        }),
      ],
      { native: true },
    ),
    url: 'https://site.test/login?token=private-page-token#private-page-fragment',
  });
  const result = plain(current.api.readLoginOptions(current.site));
  assert.equal(result.pageUrl, 'https://site.test/login');
  const serialized = JSON.stringify(result);
  assert.doesNotMatch(
    serialized,
    /private-token|private-state|private-fragment|private-page-token|private-page-fragment|do-not-return-this-password/,
  );
  const google = result.entries.find((entry) => /Google/.test(entry.label));
  assert.equal(google.hrefPath, '/oauth/google');
  for (const entry of result.entries) {
    assert.equal(Object.hasOwn(entry, 'element'), false);
    assert.equal(Object.hasOwn(entry, 'password'), false);
  }
});

test('login catalog: a page on another origin never supplies entries for the selected site', () => {
  const current = fixture({
    document: page([new Button('使用 Google 登录')]),
    url: 'https://foreign.test/login',
  });
  const result = plain(current.api.readLoginOptions(current.site));
  assert.equal(result.status, 'unavailable');
  assert.deepEqual(result.methods, []);
  assert.deepEqual(result.entries, []);
});

test('login catalog: page-completed email-code and Passkey login show separate concrete entries', () => {
  const current = fixture({
    document: page([new Button('邮箱验证码登录'), new Button('使用通行密钥登录')]),
  });
  const result = plain(current.api.readLoginOptions(current.site));
  assert.equal(result.status, 'multiple');
  assert.equal(result.entries.length, 2);
  assert.ok(
    result.entries.some((entry) => entry.method === 'manual' && /邮箱|验证码/.test(entry.label)),
  );
  assert.ok(result.entries.some((entry) => entry.method === 'passkey'));
});

test('login catalog: selected OAuth provider is found independently of page order and cosmetic classes', () => {
  const google = new Button('使用 Google 登录', { class: 'new-layout-provider-button' });
  const linuxdo = new Button('使用 Linux DO 登录', { class: 'old-layout-provider-button' });
  const current = fixture({ document: page([google, linuxdo]) });
  const entry = {
    key: 'oauth:linuxdo',
    method: 'oauth',
    provider: 'linuxdo',
    label: 'Linux DO',
    matchText: '使用 Linux DO 登录',
  };
  assert.equal(current.scope.findSelectedLoginControl(entry, 'oauth'), linuxdo);
  current.document.body.children = [linuxdo, google];
  linuxdo.className = 'another-unrelated-class';
  assert.equal(current.scope.findSelectedLoginControl(entry, 'oauth'), linuxdo);
});

test('login catalog: absent or hidden selected provider never falls back to a different OAuth entry', () => {
  const google = new Button('使用 Google 登录');
  const current = fixture({ document: page([google]) });
  const entry = {
    key: 'oauth:linuxdo',
    method: 'oauth',
    provider: 'linuxdo',
    label: 'Linux DO',
    matchText: '使用 Linux DO 登录',
  };
  assert.equal(current.scope.findSelectedLoginControl(entry, 'oauth'), null);
  current.document.body.children.push(new Button('使用 Linux DO 登录', { hidden: true }));
  assert.equal(current.scope.findSelectedLoginControl(entry, 'oauth'), null);
  assert.equal(current.scope.findSelectedLoginControl(entry, 'github'), null);
});

test('login catalog: exact provider matching uses safe semantic evidence after authorization URL queries change', () => {
  const google = new Anchor('使用 Google 登录', {
    href: 'https://site.test/oauth/google?state=old-state',
  });
  const linuxdo = new Anchor('使用 Linux DO 登录', {
    href: 'https://site.test/oauth/linuxdo?state=new-state',
  });
  const current = fixture({ document: page([google, linuxdo]) });
  const entry = {
    key: 'oauth:linuxdo',
    method: 'oauth',
    provider: 'linuxdo',
    label: 'Linux DO',
    matchText: '使用 Linux DO 登录',
    hrefPath: '/oauth/linuxdo',
  };
  assert.equal(current.scope.findSelectedLoginControl(entry, 'oauth'), linuxdo);
  linuxdo.href = 'https://site.test/oauth/linuxdo?state=another-session#updated';
  assert.equal(current.scope.findSelectedLoginControl(entry, 'oauth'), linuxdo);
});

test('login catalog: unknown providers sharing an authorization pathname retain exact text selection', () => {
  const acme = new Anchor('使用 Acme 登录', {
    href: 'https://site.test/oauth/authorize?provider=Acme&state=private-state',
  });
  const contoso = new Anchor('使用 Contoso 登录', {
    href: 'https://site.test/oauth/authorize?provider=Contoso&state=another-private-state',
  });
  const current = fixture({ document: page([acme, contoso]) });
  const result = plain(current.api.readLoginOptions(current.site));
  assert.equal(result.status, 'multiple');
  assert.equal(result.entries.length, 2);
  assert.ok(result.entries.every((entry) => entry.provider === 'oauth'));
  assert.ok(result.entries.every((entry) => entry.hrefPath === '/oauth/authorize'));
  const selected = result.entries.find((entry) => /Contoso/.test(entry.label));
  assert.equal(current.scope.findSelectedLoginControl(selected, 'oauth'), contoso);
  current.document.body.children = [contoso, acme];
  assert.equal(current.scope.findSelectedLoginControl(selected, 'oauth'), contoso);
  assert.doesNotMatch(JSON.stringify(result), /private-state|provider=/);
});

test('login catalog: an absent unknown provider cannot match another provider sharing its safe pathname', () => {
  const acme = new Anchor('使用 Acme 登录', {
    href: 'https://site.test/oauth/authorize?provider=Acme',
  });
  const current = fixture({ document: page([acme]) });
  const selected = {
    key: 'oauth:oauth:selected-contoso',
    method: 'oauth',
    provider: 'oauth',
    label: '使用 Contoso 登录',
    matchText: '使用 Contoso 登录',
    hrefPath: '/oauth/authorize',
  };
  assert.equal(current.scope.findSelectedLoginControl(selected, 'oauth'), null);
  current.document.body.children.push(
    new Anchor('', { href: 'https://site.test/oauth/authorize?provider=Contoso' }),
  );
  assert.equal(current.scope.findSelectedLoginControl(selected, 'oauth'), null);
});

test('login catalog: unnamed unknown provider controls require one unambiguous safe-path candidate', () => {
  const first = new Anchor('', {
    href: 'https://site.test/oauth/authorize?provider=Acme',
  });
  const second = new Anchor('', {
    href: 'https://site.test/oauth/authorize?provider=Contoso',
  });
  const current = fixture({ document: page([first, second]) });
  const selected = {
    key: 'oauth:oauth:unnamed',
    method: 'oauth',
    provider: 'oauth',
    label: '第三方授权',
    hrefPath: '/oauth/authorize',
  };
  assert.equal(current.scope.findSelectedLoginControl(selected, 'oauth'), null);
  current.document.body.children = [first];
  assert.equal(current.scope.findSelectedLoginControl(selected, 'oauth'), first);
  current.document.body.children = [
    new Anchor('使用 Acme 登录', {
      href: 'https://site.test/oauth/authorize?provider=Acme',
    }),
  ];
  assert.equal(current.scope.findSelectedLoginControl(selected, 'oauth'), null);
});

test('page login: visible explicit account entries first read the current session before using the saved method', async () => {
  for (const [method, provider, label] of [
    ['github', 'github', 'GitHub'],
    ['oauth', 'google', 'Google'],
    ['passkey', 'passkey', '使用通行密钥登录'],
    ['manual', 'email-code', '邮箱验证码登录'],
  ]) {
    const current = fixture({ document: page([new Button(label)]) });
    let brCalls = 0;
    let identityProbesBeforeAction = 0;
    let loginActionStarted = false;
    const events = [];
    Object.assign(current.scope, {
      w: async (ms) => current.tick(ms),
      $: 2500,
      Wp: () => null,
      U: async () => {},
      Lu: async () => ({ resolved: true, detected: false }),
      zu: async () => ({ resolved: true, detected: false }),
      br: async () => {
        brCalls += 1;
        throw new Error('Explicit visible login entry must bypass session polling');
      },
      qi: async () => {
        if (!loginActionStarted) identityProbesBeforeAction += 1;
        return loginActionStarted && method === 'manual'
          ? { userId: '299', email: 'alice@example.test', source: 'api' }
          : null;
      },
      Gi: () => null,
      B: async () => null,
      M: async (control) => {
        loginActionStarted = true;
        events.push(`click:${control.innerText}`);
      },
      mr: async (site, log, selectedMethod) => {
        assert.equal(site.loginEntry.provider, provider);
        assert.equal(selectedMethod, method);
        loginActionStarted = true;
        events.push(`provider-entry:${method}`);
      },
      vr: async (site, log, hooks, selectedMethod) => {
        assert.equal(site.loginEntry.provider, provider);
        assert.equal(selectedMethod, method);
        await hooks.beforeClick();
        events.push(`provider-submit:${method}`);
        return false;
      },
      hr: async () => {
        throw new Error('An explicit external entry must not fill native credentials');
      },
      gr: async () => {
        throw new Error('An explicit external entry must not submit native credentials');
      },
      Nf: async () => {
        events.push('checkin');
        return { status: 'already', message: '身份已确认' };
      },
    });
    const result = await current.api.runTask(
      {
        accountId: 'account-a',
        username: 'alice@example.test',
        githubUsername: 'github-user',
        githubPassword: 'github-password',
        passkey: true,
        loginMethodPreference: method,
        effectiveLoginMethod: method,
        loginEntry: {
          key: `${method}:${provider}`,
          method,
          provider,
          label,
          matchText: label,
        },
        siteAccountCount: 2,
        siteAccountUserIds: { 300: 'other-user' },
        site: {
          ...current.site,
          oauthButtonSelector: '#stale-site-selector',
          checkin: { method: 'none' },
        },
        stage: 'login',
        steps: [],
      },
      {
        async needsUser() {},
        async waitForManualLogin() {},
        async markStage() {},
        async saveIdentity() {},
        async confirmIdentity() {},
        async recordFormCredentialsSubmitted() {
          throw new Error('External login cannot report native password submission');
        },
      },
    );
    assert.equal(brCalls, 0, method);
    assert.ok(identityProbesBeforeAction > 0, method);
    assert.doesNotMatch(result?.message ?? '', /session polling/, method);
    if (method === 'manual') {
      assert.ok(events.includes(`click:${label}`));
      assert.equal(result?.ok, true, result?.message);
    } else {
      assert.deepEqual(events, [`provider-entry:${method}`, `provider-submit:${method}`]);
    }
  }
});

async function runManual({
  username = 'alice@example.test',
  identities = [{ userId: '299', email: 'alice@example.test', source: 'api' }],
  boundId,
  knownUsers = { 300: 'other-user' },
  stage = 'verify-manual',
  authenticated = true,
  controls = [],
  omitWaitCallback = false,
} = {}) {
  const current = fixture({
    document: page(controls, { heading: authenticated ? '个人资料' : '登录' }),
    url: authenticated ? 'https://site.test/profile' : 'https://site.test/login',
  });
  const saved = [],
    handoffs = [],
    events = [];
  let readCount = 0,
    manualLoginCompleted = authenticated;
  Object.assign(current.scope, {
    w: async (ms) => current.tick(ms),
    $: 2500,
    Wp: () => null,
    U: async () => {},
    Lu: async () => ({ resolved: true, detected: false }),
    zu: async () => ({ resolved: true, detected: false }),
    br: async () => authenticated,
    B: async () => null,
    M: async (control) => {
      events.push(`entry-click:${control.innerText}`);
    },
    qi: async () => {
      if (stage === 'login' && !manualLoginCompleted) return null;
      const identity = identities[Math.min(readCount, identities.length - 1)];
      readCount += 1;
      return identity ? { ...identity } : null;
    },
    Gi: () => null,
    hr: async () => {
      events.push('password-fill');
      throw new Error('Page-completed login must never fill a password form');
    },
    gr: async () => {
      events.push('password-submit');
      throw new Error('Page-completed login must never submit a password form');
    },
    Nf: async () => {
      events.push('checkin');
      return { status: 'already', message: '身份已确认，签到已完成' };
    },
  });
  const task = {
    accountId: 'account-a',
    username,
    password: 'site-password-that-must-not-be-used',
    githubUsername: 'github-user',
    githubPassword: 'github-password-that-must-not-be-used',
    loginMethodPreference: 'manual',
    effectiveLoginMethod: 'manual',
    loginEntry: {
      key: 'manual:email-code',
      method: 'manual',
      provider: 'email-code',
      label: '邮箱验证码登录',
      matchText: '邮箱验证码登录',
    },
    accountIdentityUserId: boundId,
    siteAccountCount: 2,
    siteAccountUserIds: knownUsers,
    site: { ...current.site, checkin: { method: 'none' } },
    stage,
    steps: [],
  };
  const result = await current.api.runTask(task, {
    ...(!omitWaitCallback
      ? {
          async waitForManualLogin(message) {
            handoffs.push(message);
            events.push('manual-wait');
            manualLoginCompleted = true;
          },
        }
      : {}),
    async needsUser(message) {
      handoffs.push(message);
    },
    async saveIdentity(identity) {
      saved.push({ identity: plain(identity), readCount });
      events.push('save-identity');
    },
    async confirmIdentity() {
      events.push('confirm-identity');
    },
    async markStage(nextStage) {
      events.push(`stage:${nextStage}`);
    },
    async recordFormCredentialsSubmitted() {
      events.push('password-proof');
      throw new Error('Manual login cannot create a form submission proof');
    },
    async navigate() {
      events.push('navigate');
    },
    async clearSiteCookies() {
      events.push('clear-cookies');
      return { matched: 0, removed: 0, failed: 0 };
    },
  });
  return { result, saved, handoffs, events, readCount };
}

test('manual login: a runtime without lease-preserving wait support stops before continuing', async () => {
  const outcome = await runManual({ omitWaitCallback: true });
  assert.equal(outcome.result?.ok, false);
  assert.match(outcome.result?.message ?? '', /等待|运行环境|重新加载|任务/);
  assert.deepEqual(outcome.saved, []);
  assert.equal(outcome.events.includes('checkin'), false);
  assert.equal(outcome.events.includes('manual-wait'), false);
});

test('manual login: an unbound target binds only after two stable live API identities match its email', async () => {
  const outcome = await runManual({
    username: 'ALICE@example.test',
    identities: [{ userId: '299', email: 'alice@example.test', source: 'api' }],
  });
  assert.equal(outcome.result?.ok, true, outcome.result?.message);
  assert.equal(outcome.saved.length, 1);
  assert.equal(outcome.saved[0].identity.userId, '299');
  assert.ok(outcome.saved[0].readCount >= 2);
  assert.deepEqual(
    outcome.events.filter((event) => /save|confirm|checkin/.test(event)),
    ['save-identity', 'confirm-identity', 'stage:checkin', 'checkin'],
  );
  assert.equal(
    outcome.events.some((event) => /password/.test(event)),
    false,
  );
  assert.equal(outcome.handoffs.length, 1);
  assert.match(outcome.handoffs[0], /验证码|页面登录/);
});

test('manual login: a fixed ID mismatch preserves the binding and stops checkin despite a matching email', async () => {
  const outcome = await runManual({
    boundId: '299',
    identities: [{ userId: '300', email: 'alice@example.test', source: 'api' }],
  });
  assert.equal(outcome.result, null);
  assert.deepEqual(outcome.saved, []);
  assert.equal(outcome.events.includes('checkin'), false);
  assert.equal(
    outcome.events.some((event) => /password/.test(event)),
    false,
  );
  assert.ok(outcome.handoffs.some((message) => /不一致|不是|切换/.test(message)));
});

test('manual login: another account ID cannot be claimed by an unbound target with the same visible email', async () => {
  const outcome = await runManual({
    identities: [{ userId: '300', email: 'alice@example.test', source: 'api' }],
  });
  assert.equal(outcome.result, null);
  assert.deepEqual(outcome.saved, []);
  assert.equal(outcome.events.includes('checkin'), false);
});

test('manual login: visible identity alone and a different API account never establish the target', async () => {
  for (const identity of [
    { userId: '299', email: 'alice@example.test', source: 'visible' },
    { userId: '299', username: 'a-different-account', source: 'api' },
    {
      userId: '299',
      email: 'alice@example.test',
      source: 'api',
      identityConflict: 'simultaneous API and page IDs disagree',
    },
  ]) {
    const outcome = await runManual({ identities: [identity] });
    assert.notEqual(outcome.result?.ok, true);
    assert.deepEqual(outcome.saved, []);
    assert.equal(outcome.events.includes('checkin'), false);
    assert.equal(
      outcome.events.some((event) => /password/.test(event)),
      false,
    );
  }
});

test('manual login: ID changes between samples stop before identity persistence or checkin', async () => {
  const outcome = await runManual({
    identities: [
      { userId: '299', email: 'alice@example.test', source: 'api' },
      { userId: '300', email: 'alice@example.test', source: 'api' },
    ],
  });
  assert.deepEqual(outcome.saved, []);
  assert.equal(outcome.events.includes('checkin'), false);
  assert.equal(outcome.result, null);
});

test('manual login: an existing browser session still needs stable target identity before checkin', async () => {
  const accepted = await runManual({ stage: 'login' });
  assert.equal(accepted.result?.ok, true, accepted.result?.message);
  assert.equal(accepted.saved.length, 1);
  assert.ok(accepted.saved[0].readCount >= 2);
  const rejected = await runManual({
    stage: 'login',
    identities: [{ userId: '299', email: 'someone-else@example.test', source: 'api' }],
  });
  assert.equal(rejected.result, null);
  assert.deepEqual(rejected.saved, []);
  assert.equal(rejected.events.includes('checkin'), false);
});

test('manual login: the selected code entry starts a manual stage and never uses either stored password', async () => {
  const target = { userId: '299', email: 'alice@example.test', source: 'api' };
  const outcome = await runManual({
    stage: 'login',
    authenticated: false,
    controls: [new Button('使用 Google 登录'), new Button('邮箱验证码登录')],
    identities: [null, target, target],
  });
  assert.equal(outcome.result?.ok, true, outcome.result?.message);
  assert.ok(outcome.events.includes('stage:verify-manual'));
  assert.ok(outcome.events.includes('entry-click:邮箱验证码登录'));
  assert.equal(outcome.events.includes('entry-click:使用 Google 登录'), false);
  assert.equal(
    outcome.events.some((event) => /password/.test(event)),
    false,
  );
  assert.equal(outcome.saved[0].identity.userId, '299');
});

test('manual login: a code button with the browser default submit type is left for user completion', async () => {
  const button = new Button('邮箱验证码登录');
  button.type = 'submit';
  button.form = new Element('form', {}, '登录');
  assert.equal(button.getAttribute('type'), null);
  const target = { userId: '299', email: 'alice@example.test', source: 'api' };
  const outcome = await runManual({
    stage: 'login',
    authenticated: false,
    controls: [button],
    identities: [null, target, target],
  });
  assert.equal(outcome.result?.ok, true, outcome.result?.message);
  assert.ok(outcome.events.includes('stage:verify-manual'));
  assert.equal(outcome.events.includes('entry-click:邮箱验证码登录'), false);
  assert.equal(
    outcome.events.some((event) => /password/.test(event)),
    false,
  );
});
