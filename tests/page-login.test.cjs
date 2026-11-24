const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const esbuild = require('esbuild');

const workspace = path.resolve(__dirname, '..');
const plain = (value) => JSON.parse(JSON.stringify(value));
const bundle = esbuild.buildSync({
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
    return this.children.filter((child) => child.matches(selector));
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

function loginPage({ inputs = [], buttons = [], heading = '登录' } = {}) {
  const form = new Element('form', {}, heading);
  form.children = inputs;
  for (const input of inputs) {
    input.form = form;
    input.parentElement = form;
  }
  const body = new Element('body', {}, heading);
  body.children = [...inputs, ...buttons];
  return {
    body,
    querySelectorAll: (selector) => body.querySelectorAll(selector),
    querySelector: (selector) => body.querySelector(selector),
    getElementById: (id) => body.children.find((element) => element.id === id) ?? null,
  };
}

function nativePage({ github = false, register = false, hidden = false } = {}) {
  return loginPage({
    inputs: [
      new Input({ name: 'username', autocomplete: 'username', hidden }),
      new Input({
        name: 'password',
        type: 'password',
        autocomplete: register ? 'new-password' : 'current-password',
        hidden,
      }),
    ],
    buttons: [
      new Button(register ? '注册' : '登录'),
      ...(github ? [new Button('使用 GitHub 登录')] : []),
    ],
    heading: register ? '创建账号' : '登录',
  });
}

function storage() {
  return { length: 0, getItem: () => null, removeItem() {}, key: () => null };
}

function runtime({ document = loginPage(), pathname = '/login' } = {}) {
  let now = 1000;
  class Clock extends Date {
    static now() {
      return now;
    }
  }
  const module = { exports: {} };
  const location = {
    origin: 'https://site.test',
    pathname,
    hash: '',
    href: `https://site.test${pathname}`,
  };
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
    AbortController,
    Uint8Array,
    TextDecoder,
    TextEncoder,
    setTimeout,
    clearTimeout,
    location,
    document,
    window: { getComputedStyle: computedStyle },
    getComputedStyle: computedStyle,
    HTMLElement: Element,
    HTMLInputElement: Input,
    HTMLAnchorElement: Anchor,
    HTMLButtonElement: Button,
    HTMLTextAreaElement: Textarea,
    localStorage: storage(),
    sessionStorage: storage(),
    chrome: { runtime: { id: 'test-extension' } },
    fetch: async () => {
      throw new Error('Unexpected network request in page detection test');
    },
  });
  vm.runInContext(bundle.outputFiles[0].text, context);
  const created = module.exports.createRuntime();
  created.scope.w = async (ms) => {
    now += ms;
  };
  return {
    ...created,
    context,
    site: {
      id: 'site-a',
      name: 'A',
      loginUrl: 'https://site.test/login',
      loginMethod: 'github',
      selectors: {},
      checkin: {
        method: 'workflow',
        workflow: {
          route: ['/profile'],
          identityPath: '/profile',
          steps: [{ type: 'click', selector: '#claim' }],
        },
      },
    },
  };
}

test('page login: a visible native password form determines form independently of the site default', () => {
  const fixture = runtime({ document: nativePage() });
  for (const loginMethod of ['github', 'oauth', 'passkey', 'token', 'form', 'auto']) {
    const result = fixture.api.detectPageLogin(
      { ...fixture.site, loginMethod },
      { password: 'site-only-password' },
    );
    assert.equal(result.method, 'form');
  }
});

test('page login: GitHub controls determine GitHub and dual-entry pages use the available credential family', () => {
  const github = runtime({ document: loginPage({ buttons: [new Button('使用 GitHub 登录')] }) });
  assert.equal(
    github.api.detectPageLogin({ ...github.site, loginMethod: 'form' }, {}).method,
    'github',
  );
  const dual = runtime({ document: nativePage({ github: true }) });
  assert.equal(
    dual.api.detectPageLogin(dual.site, { password: 'site-only-password' }).method,
    'form',
  );
  assert.equal(
    dual.api.detectPageLogin(dual.site, {
      githubUsername: 'github-user',
      githubPassword: 'github-only-password',
    }).method,
    'github',
  );
});

test('page login: registration, new-password, subscription and hidden controls are not a native login form', () => {
  const pages = [
    nativePage({ register: true }),
    nativePage({ hidden: true }),
    loginPage({
      inputs: [new Input({ type: 'email', name: 'email', autocomplete: 'email' })],
      buttons: [new Button('订阅')],
      heading: '邮件订阅',
    }),
    loginPage({
      inputs: [new Input({ name: 'username', autocomplete: 'username' })],
      buttons: [new Button('下一步')],
      heading: '创建账号',
    }),
  ];
  for (const document of pages) {
    const fixture = runtime({ document });
    assert.equal(
      fixture.api.detectPageLogin(fixture.site, { password: 'site-only-password' }),
      null,
    );
  }
});

test('page login: an explicit login continuation can identify a two-step username page', () => {
  const fixture = runtime({
    document: loginPage({
      inputs: [new Input({ name: 'username', autocomplete: 'username' })],
      buttons: [new Button('下一步')],
    }),
  });
  assert.equal(fixture.api.detectPageLogin(fixture.site, {}).method, 'form');
});

test('page login: folded password and two-step username candidates remain native when a GitHub entry is also visible', () => {
  const passwordEntry = new Button('密码登录');
  for (const document of [
    loginPage({
      buttons: [new Button('登录'), new Button('使用 GitHub 登录'), passwordEntry],
    }),
    loginPage({
      inputs: [new Input({ name: 'username', autocomplete: 'username' })],
      buttons: [new Button('下一步'), new Button('使用 GitHub 登录')],
    }),
  ]) {
    const fixture = runtime({ document });
    const native = fixture.api.detectPageLogin(fixture.site, { password: 'site-only-password' });
    assert.equal(native.method, 'form');
    assert.equal(
      fixture.api.detectPageLogin(fixture.site, {
        githubUsername: 'github-user',
        githubPassword: 'github-only-password',
      }).method,
      'github',
    );
  }
  const linkedEntry = new Anchor('使用密码登录', { href: 'https://site.test/login/password' });
  const fixture = runtime({
    document: loginPage({ buttons: [new Button('登录'), linkedEntry] }),
  });
  const detected = fixture.api.detectPageLogin(fixture.site, {});
  assert.equal(detected.method, 'form');
  assert.equal(detected.entry, linkedEntry);
});

test('page login: only visible provider controls determine Passkey or generic OAuth', () => {
  const passkey = runtime({ document: loginPage({ buttons: [new Button('使用通行密钥登录')] }) });
  assert.equal(passkey.api.detectPageLogin(passkey.site, { passkey: true }).method, 'passkey');
  const oauth = runtime({ document: loginPage({ buttons: [new Button('使用 Google 登录')] }) });
  assert.equal(oauth.api.detectPageLogin(oauth.site, {}).method, 'oauth');
  const hidden = runtime({
    document: loginPage({ buttons: [new Button('使用 GitHub 登录', { hidden: true })] }),
  });
  assert.equal(hidden.api.detectPageLogin(hidden.site, {}), null);
});

async function runAutomatic({
  document = nativePage(),
  pathname = '/login',
  resolve = (method) => method,
  omitResolver = false,
  alreadyLoggedIn = false,
  boundId = '299',
  explicitMethod,
  oauthSelector,
} = {}) {
  const fixture = runtime({ document, pathname });
  if (oauthSelector) fixture.site.oauthButtonSelector = oauthSelector;
  const events = [],
    identities = [],
    navigations = [],
    handoffs = [],
    providerSelectors = [];
  Object.assign(fixture.scope, {
    U: async () => {},
    Wp: () => null,
    Lu: async () => ({ resolved: true, detected: false }),
    zu: async () => ({ resolved: true, detected: false }),
    br: async () => alreadyLoggedIn,
    qi: async () =>
      alreadyLoggedIn ? { userId: '299', username: 'site-user', source: 'api' } : null,
    Gi: () => null,
    dr: async (element) => {
      assert.match(element.innerText || element.textContent, /密码登录|password/i);
      events.push('native-entry-click');
    },
    pr: async () => {
      events.push('native-entry');
    },
    hr: async (site, username, password, log, beforeFill) => {
      await beforeFill?.();
      assert.equal(username, 'site-user');
      assert.equal(password, 'site-only-password');
      events.push('native-fill');
      return true;
    },
    gr: async (site, log, hooks) => {
      if (!(await hooks.beforeClick())) return false;
      events.push('native-submit');
      return false;
    },
    mr: async (site, log, method) => {
      providerSelectors.push(site.oauthButtonSelector);
      events.push(`provider-entry:${method}`);
    },
    vr: async (site, log, hooks, method) => {
      providerSelectors.push(site.oauthButtonSelector);
      await hooks.beforeClick();
      events.push(`provider-submit:${method}`);
      return false;
    },
    Nf: async () => {
      events.push('checkin');
      return { status: 'already', message: '已确认签到' };
    },
  });
  const task = {
    accountId: 'account-a',
    username: 'site-user',
    password: 'site-only-password',
    githubUsername: 'github-user',
    githubPassword: 'github-only-password',
    loginMethodPreference: explicitMethod ?? 'auto',
    effectiveLoginMethod: explicitMethod ?? 'auto',
    accountIdentityUserId: boundId,
    siteAccountCount: 2,
    siteAccountUserIds: { 300: 'other-user' },
    site: fixture.site,
    stage: 'login',
    steps: [],
  };
  const callbacks = {
    ...(!omitResolver
      ? {
          async resolveLoginMethod(method) {
            events.push(`resolve:${method}`);
            return resolve(method);
          },
        }
      : {}),
    async recordFormCredentialsSubmitted() {
      events.push('native-proof');
    },
    async markStage(stage) {
      events.push(`stage:${stage}`);
    },
    async clearSiteCookies() {
      events.push('clear-session');
      return { matched: 2, removed: 2, failed: 0 };
    },
    async navigate(url, log, stage) {
      navigations.push({ url, stage });
    },
    async needsUser(message) {
      handoffs.push(message);
    },
    async saveIdentity(identity) {
      identities.push(plain(identity));
    },
    async confirmIdentity() {
      events.push('confirm-identity');
    },
  };
  const result = await fixture.api.runTask(task, callbacks);
  return { task, result, events, identities, navigations, handoffs, providerSelectors };
}

test('page login: automatic form selection is confirmed before filling and proving this account credentials', async () => {
  const outcome = await runAutomatic();
  assert.ok(!outcome.result.message.startsWith('异常'), outcome.result.message);
  assert.deepEqual(
    outcome.events.filter((event) => /resolve|fill|proof|submit/.test(event)),
    ['resolve:form', 'native-fill', 'native-proof', 'native-submit'],
  );
  assert.equal(
    outcome.events.some((event) => event.startsWith('provider-')),
    false,
  );
});

test('page login: automatic GitHub selection never sends the site password to provider controls', async () => {
  const outcome = await runAutomatic({
    document: loginPage({ buttons: [new Button('使用 GitHub 登录')] }),
  });
  assert.deepEqual(
    outcome.events.filter((event) => /resolve|proof|submit/.test(event)),
    ['resolve:github', 'provider-submit:github'],
  );
  assert.equal(
    outcome.events.some((event) => event.startsWith('native-')),
    false,
  );
});

test('page login: a folded password entry is clicked only after resolution and before filling or submission', async () => {
  const document = loginPage({
    buttons: [new Button('登录'), new Button('使用 GitHub 登录'), new Button('密码登录')],
  });
  const outcome = await runAutomatic({ document });
  assert.deepEqual(
    outcome.events.filter((event) => /resolve|click|fill|proof|submit/.test(event)),
    ['resolve:form', 'native-entry-click', 'native-fill', 'native-proof', 'native-submit'],
  );
  assert.equal(
    outcome.events.some((event) => event.startsWith('provider-')),
    false,
  );
  for (const options of [{ omitResolver: true }, { resolve: () => 'github' }]) {
    const rejected = await runAutomatic({ document, ...options });
    assert.equal(rejected.events.includes('native-entry-click'), false);
    assert.equal(
      rejected.events.some((event) => /fill|proof|submit/.test(event)),
      false,
    );
  }
});

test('page login: a missing or rejected resolution cannot fill or submit either credential family', async () => {
  for (const options of [
    { omitResolver: true },
    { resolve: () => 'github' },
    {
      resolve: () => {
        throw new Error('后台拒绝识别结果');
      },
    },
  ]) {
    const outcome = await runAutomatic(options);
    assert.equal(outcome.result.ok, false);
    assert.equal(
      outcome.events.some((event) => /fill|proof|submit/.test(event)),
      false,
    );
    assert.deepEqual(outcome.identities, []);
  }
});

test('page login: detected provider controls ignore a stale site selector without modifying its saved configuration', async () => {
  const document = loginPage({ buttons: [new Button('使用 GitHub 登录')] });
  const automatic = await runAutomatic({ document, oauthSelector: '#obsolete-oauth-button' });
  assert.equal(automatic.providerSelectors.length, 2);
  assert.equal(
    automatic.providerSelectors.every((selector) => !selector),
    true,
  );
  assert.equal(automatic.task.site.oauthButtonSelector, '#obsolete-oauth-button');
  const explicit = await runAutomatic({
    document,
    oauthSelector: '#explicit-oauth-button',
    explicitMethod: 'github',
  });
  assert.deepEqual(explicit.providerSelectors, [
    '#explicit-oauth-button',
    '#explicit-oauth-button',
  ]);
  assert.equal(
    explicit.events.some((event) => event.startsWith('resolve:')),
    false,
  );
});

test('page login: an explicit account method retains its override and does not resolve automatically', async () => {
  const outcome = await runAutomatic({ explicitMethod: 'form' });
  assert.equal(
    outcome.events.some((event) => event.startsWith('resolve:')),
    false,
  );
  assert.equal(outcome.events.includes('native-proof'), true);
  assert.equal(outcome.events.includes('native-submit'), true);
});

test('page login: a bound account on an authenticated business page can continue without guessing a login method', async () => {
  const outcome = await runAutomatic({
    document: loginPage({ heading: 'Dashboard' }),
    pathname: '/dashboard',
    alreadyLoggedIn: true,
  });
  assert.equal(outcome.result?.ok, true, outcome.result?.message);
  assert.equal(outcome.events.includes('checkin'), true);
  assert.equal(
    outcome.events.some((event) => event.startsWith('resolve:')),
    false,
  );
  assert.equal(outcome.task.accountIdentityUserId, '299');
});

test('page login: an unbound automatic account cannot inherit the browser session before its own login', async () => {
  const outcome = await runAutomatic({
    document: loginPage({ heading: 'Dashboard' }),
    pathname: '/dashboard',
    alreadyLoggedIn: true,
    boundId: null,
  });
  assert.equal(outcome.result, null);
  assert.equal(outcome.events.includes('clear-session'), true);
  assert.equal(outcome.events.includes('checkin'), false);
  assert.deepEqual(outcome.identities, []);
  assert.deepEqual(outcome.navigations, [{ url: 'https://site.test/login', stage: 'login' }]);
});
