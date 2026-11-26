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
      const tag = candidate.match(/^[a-z][a-z0-9-]*/i)?.[0];
      if (tag && tag.toUpperCase() !== this.tagName) return false;
      const attributes = [
        ...candidate.matchAll(
          /\[([\w-]+)(?:([*^$~]?=)(?:"([^"]*)"|'([^']*)'|([^\]\s]+)))?(?:\s+([is]))?\]/g,
        ),
      ];
      if (attributes.length)
        return attributes.every(([, name, operator, quoted, singleQuoted, unquoted, flag]) => {
          let value = this.getAttribute(name);
          if (!operator) return value != null;
          if (value == null) return false;
          let expected = quoted ?? singleQuoted ?? unquoted;
          value = String(value);
          if (flag === 'i') {
            value = value.toLowerCase();
            expected = expected.toLowerCase();
          }
          if (operator === '*=') return value.includes(expected);
          if (operator === '^=') return value.startsWith(expected);
          if (operator === '$=') return value.endsWith(expected);
          if (operator === '~=') return value.split(/\s+/).includes(expected);
          return value === expected;
        });
      if (candidate.startsWith('.'))
        return this.className.split(/\s+/).includes(candidate.slice(1));
      return candidate === '*' || candidate.toUpperCase() === this.tagName;
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
    for (let node = this; node; node = node.parentElement) if (node.matches(selector)) return node;
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
  for (const button of buttons) button.parentElement = body;
  return {
    title: heading,
    body,
    querySelectorAll: (selector) => body.querySelectorAll(selector),
    querySelector: (selector) => body.querySelector(selector),
    getElementById: (id) => body.querySelector(`#${id}`),
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

function runtime({
  document = loginPage(),
  pathname = '/login',
  origin = 'https://site.test',
} = {}) {
  let now = 1000;
  class Clock extends Date {
    static now() {
      return now;
    }
  }
  const module = { exports: {} };
  const location = {
    origin,
    pathname,
    hash: '',
    href: `${origin}${pathname}`,
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

test('page login: real dashboard FAQ accordions are help controls and never login entries', () => {
  const questions = [
    '为什么无法在第三方应用中使用 AnyRouter API Key',
    'Invalid API Key · Please run /login 怎么解决？',
    'How do I sign in with Google?',
    '为什么使用 GitHub 登录失败？',
  ];
  const buttons = questions.map(
    (text) =>
      new Element(
        'div',
        { role: 'button', 'aria-expanded': 'false', 'aria-owns': 'answer', class: 'accordion' },
        text,
      ),
  );
  const fixture = runtime({
    document: loginPage({ buttons, heading: '账户数据' }),
    pathname: '/console',
  });
  for (const button of buttons)
    assert.equal(fixture.scope.describeLoginControl(button), null, button.innerText);
  assert.equal(fixture.scope.readLoginSnapshot(fixture.site).loginEntry, false);
  assert.equal(fixture.api.detectPageLogin(fixture.site, {}), null);
});

test('page login: an unknown dashboard with help questions reads its current session before any login action', async () => {
  const fixture = runtime({
    document: loginPage({
      buttons: [
        new Button('F\ncurrent-user', { 'aria-haspopup': 'true' }),
        new Element(
          'div',
          { role: 'button', 'aria-expanded': 'false', 'aria-owns': 'answer' },
          '为什么无法在第三方应用中使用 AnyRouter API Key',
        ),
      ],
      heading: '账户数据',
    }),
    pathname: '/console',
  });
  let reads = 0;
  fixture.scope.qi = async () => {
    reads += 1;
    return {
      userId: '210077',
      username: 'current-user',
      source: 'api',
      endpoint: '/api/user/self',
    };
  };
  const state = await fixture.api.readLoginState(fixture.site, { stopOnLoginForm: true });
  assert.equal(state.status, 'authenticated');
  assert.equal(state.identity.userId, '210077');
  assert.equal(reads, 2);
});

test('page login: login navigation and unknown OAuth actions are classified by their purpose', () => {
  const login = new Anchor('登录', { href: 'https://site.test/login' }),
    unknownProvider = new Button('使用 Contoso 登录'),
    thirdPartyBusiness = new Button('第三方应用 API Key');
  const fixture = runtime({
    document: loginPage({ buttons: [login, unknownProvider, thirdPartyBusiness], heading: '首页' }),
    pathname: '/',
  });
  assert.equal(fixture.scope.describeLoginControl(login), null);
  assert.equal(fixture.scope.Nn(), login);
  assert.equal(fixture.scope.describeLoginControl(unknownProvider).method, 'oauth');
  assert.equal(fixture.scope.describeLoginControl(thirdPartyBusiness), null);
  for (const text of ['登录', 'Sign in', 'Log in']) {
    const button = new Button(text);
    const current = runtime({ document: loginPage({ buttons: [button] }) });
    assert.equal(current.scope.In(), button, text);
  }
});

test('login success: a plain exit action belongs to the session only inside an account menu', async () => {
  const settings = new Element('li', { role: 'menuitem' }, '个人设置'),
    exit = new Element('li', { role: 'menuitem', 'aria-disabled': 'false' }, '退出'),
    menu = new Element('ul', { role: 'menu' });
  menu.children = [settings, exit];
  for (const item of menu.children) item.parentElement = menu;
  const fixture = runtime({
    document: loginPage({ buttons: [menu], heading: '控制台' }),
    pathname: '/console',
  });
  const state = await fixture.api.readLoginState(fixture.site);
  assert.equal(state.status, 'authenticated');
  assert.equal(state.reason, 'logout_control');
  const editor = runtime({
    document: loginPage({ buttons: [new Button('退出')], heading: '编辑文档' }),
    pathname: '/editor',
  });
  assert.equal(editor.scope.hasVisibleLogoutControl(editor.site), false);
  exit.attributes['aria-disabled'] = 'true';
  assert.equal(fixture.scope.hasVisibleLogoutControl(fixture.site), false);
});

test('page login: the complete task on an authenticated unknown dashboard reaches account and check-in handling without filling a form', async () => {
  const fixture = runtime({
    document: loginPage({
      buttons: [
        new Button('F\ncurrent-user', { 'aria-haspopup': 'true' }),
        new Element(
          'div',
          { role: 'button', 'aria-expanded': 'false', 'aria-owns': 'answer' },
          '为什么无法在第三方应用中使用 AnyRouter API Key',
        ),
      ],
      heading: '账户数据',
    }),
    pathname: '/console',
  });
  const actions = [];
  Object.assign(fixture.scope, {
    U: async () => {},
    Wp: () => null,
    Lu: async () => ({ resolved: true, detected: false }),
    zu: async () => ({ resolved: true, detected: false }),
    qi: async () => ({
      userId: '210077',
      username: 'current-user',
      source: 'api',
      endpoint: '/api/user/self',
    }),
    Gi: () => null,
    hr: async () => {
      actions.push('fill-password');
      throw new Error('Authenticated dashboard cannot fill a login form');
    },
    gr: async () => {
      actions.push('submit-password');
      throw new Error('Authenticated dashboard cannot submit a login form');
    },
    Nf: async (site, log, options) => {
      actions.push('checkin-handling');
      assert.equal(options.loginHappenedThisRun, false);
      return { status: 'failed', message: '本轮没有新的登录奖励证据' };
    },
  });
  const result = await fixture.api.runTask(
    {
      accountId: 'account-current',
      username: 'current-user',
      password: 'test-only',
      accountIdentityUserId: '210077',
      loginMethodPreference: 'form',
      effectiveLoginMethod: 'form',
      siteAccountCount: 1,
      stage: 'login',
      steps: [],
      site: { ...fixture.site, checkin: { method: 'none' } },
    },
    {
      async markStage() {},
      async saveIdentity() {},
      async confirmIdentity() {
        actions.push('confirm-account');
      },
      async needsUser() {
        actions.push('needs-user');
      },
      async navigate() {
        actions.push('navigate');
      },
      async clearSiteCookies() {
        actions.push('clear-session');
      },
    },
  );
  assert.ok(actions.includes('confirm-account'), result?.message);
  assert.ok(actions.includes('checkin-handling'), result?.message);
  assert.ok(actions.every((action) => !/password|clear-session|navigate/.test(action)));
  assert.doesNotMatch(result?.message ?? '', /未能识别登录表单|异常/);
  assert.ok(result.steps.some((line) => /登录状态核验\[stable_api_identity\]/.test(line)));
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

test('login success: a profile email editor is not a login form and stable live identity confirms it', async () => {
  const fixture = runtime({
    pathname: '/profile',
    document: loginPage({
      inputs: [new Input({ name: 'email', type: 'email', autocomplete: 'email' })],
      buttons: [new Button('保存资料')],
      heading: '个人资料',
    }),
  });
  fixture.scope.Nu = () => null;
  fixture.scope.nr = () => null;
  fixture.scope.qi = async () => ({ source: 'api', userId: '42' });
  assert.equal(fixture.scope.On(fixture.site), false);
  const state = await fixture.api.readLoginState(fixture.site);
  assert.equal(state.status, 'authenticated');
  assert.equal(state.reason, 'stable_api_identity');
});

test('login success: a dashboard route, check-in navigation link and API check-in configuration remain insufficient', () => {
  const fixture = runtime({
    pathname: '/dashboard',
    document: loginPage({
      buttons: [new Anchor('每日签到', { href: 'https://site.test/checkin' })],
      heading: 'Dashboard',
    }),
  });
  fixture.scope.Nu = () => null;
  fixture.scope.nr = () => null;
  for (const checkin of [
    { method: 'api', apiUrl: '/api/checkin' },
    { method: 'auto' },
    { method: 'none' },
  ])
    assert.equal(fixture.scope.ar({ ...fixture.site, checkin }), false);
});

test('login success: visible inline login failure is reported instead of missing-success evidence', async () => {
  const fixture = runtime({
    document: loginPage({
      buttons: [new Element('div', { role: 'alert' }, 'Login failed: invalid credentials')],
    }),
  });
  fixture.scope.Nu = () => null;
  fixture.scope.nr = () => null;
  const state = await fixture.api.readLoginState(fixture.site);
  assert.equal(state.status, 'failed');
  assert.equal(state.reason, 'login_rejected');
  assert.match(state.detail, /invalid credentials/);
});

test('login success: post-OAuth account completion forms outrank stored authentication and success markers', async () => {
  const form = new Element('form');
  form.children = [
    new Element('h1', {}, 'Complete your profile'),
    new Input({ name: 'email', type: 'email' }),
  ];
  const fixture = runtime({
    pathname: '/user/setup',
    document: loginPage({
      buttons: [form, new Button('退出登录')],
      heading: 'Complete your profile',
    }),
  });
  fixture.scope.Nu = () => null;
  fixture.scope.nr = () => null;
  const state = await fixture.api.readLoginState(fixture.site);
  assert.equal(state.status, 'blocked');
  assert.equal(state.reason, 'account_completion_required');
});

function orevxAccountPage({
  signOut = true,
  signOutLabel = 'Sign out',
  rowAttributes = {},
  menuAttributes = {},
  userAttributes = {},
} = {}) {
  const userControl = new Button('Yankangg302', {
    'aria-label': 'Current user: Yankangg302',
    'data-slot': 'button',
    ...userAttributes,
  });
  const menu = new Element('div', {
    role: 'treegrid',
    'aria-label': 'Account actions',
    'data-slot': 'sidebar-menu',
    ...menuAttributes,
  });
  const row = new Element('div', {
    role: 'row',
    'aria-label': signOutLabel,
    'data-slot': 'sidebar-menu-item',
    'data-key': 'sign-out',
    id: 'react-aria7857737485-_r_1a_-sign-out',
    ...rowAttributes,
  });
  const icon = new Element('svg', { class: 'iconify iconify--lucide size-4' });
  icon.parentElement = row;
  row.children = [icon];
  row.parentElement = menu;
  menu.children = signOut ? [row] : [];
  return loginPage({
    heading: 'Check-in',
    buttons: [userControl, menu],
  });
}

function orevxPageRuntime(options = {}) {
  const fixture = runtime({
    origin: 'https://orevx.ai',
    pathname: '/user/checkins',
    document: orevxAccountPage(options),
  });
  fixture.site = {
    id: 'orevx',
    loginUrl: 'https://orevx.ai/user/checkins',
    selectors: {},
    checkin: { method: 'auto' },
  };
  fixture.scope.Nu = () => null;
  fixture.scope.nr = () => null;
  return fixture;
}

test('Orevx page login: the real empty-text Sign out TreeGrid row confirms page login without admin-only attributes', async () => {
  const fixture = orevxPageRuntime();
  const snapshot = fixture.scope.readLoginSnapshot(fixture.site);
  assert.equal(snapshot.logoutControl, true);
  assert.equal(snapshot.accountShellVisible, true);
  assert.equal(snapshot.loginForm, false);
  assert.equal(snapshot.loginEntry, false);
  const state = await fixture.api.readLoginState(fixture.site);
  assert.equal(state.status, 'authenticated');
  assert.equal(state.reason, 'logout_control');
  assert.equal(state.identity, undefined);
  assert.equal(fixture.api.readPageIdentity(), null);
});

test('Orevx page login: the verified short sign-out key survives collapsed or localized account menus', async () => {
  for (const options of [
    { signOutLabel: '' },
    { signOutLabel: 'Se déconnecter', menuAttributes: { 'aria-label': 'Actions du compte' } },
  ]) {
    const fixture = orevxPageRuntime(options);
    assert.equal(fixture.scope.hasVisibleLogoutControl(fixture.site), true);
    const state = await fixture.api.readLoginState(fixture.site);
    assert.equal(state.status, 'authenticated');
    assert.equal(state.reason, 'logout_control');
  }
});

test('Orevx page login: a current-user header alone is pending and never supplies account identity', async () => {
  const fixture = orevxPageRuntime({ signOut: false });
  fixture.scope.qi = async () => null;
  const snapshot = fixture.scope.readLoginSnapshot(fixture.site);
  assert.equal(snapshot.accountShellVisible, true);
  assert.equal(snapshot.logoutControl, false);
  const state = await fixture.api.readLoginState(fixture.site, { timeoutMs: 600 });
  assert.equal(state.status, 'pending');
  assert.equal(state.reason, 'account_shell_unverified');
  assert.equal(state.identity, undefined);
  assert.equal(fixture.api.readPageIdentity(), null);
});

test('Orevx page login: hidden, disabled, aria-hidden and inert sign-out rows cannot prove login', async () => {
  for (const options of [
    { rowAttributes: { hidden: true } },
    { rowAttributes: { disabled: true } },
    { rowAttributes: { 'aria-disabled': 'true' } },
    { rowAttributes: { 'data-disabled': '' } },
    { menuAttributes: { hidden: true } },
    { menuAttributes: { 'aria-hidden': 'true' } },
    { menuAttributes: { inert: '' } },
  ]) {
    const fixture = orevxPageRuntime(options);
    fixture.scope.qi = async () => null;
    assert.equal(fixture.scope.hasVisibleLogoutControl(fixture.site), false);
    const state = await fixture.api.readLoginState(fixture.site, { timeoutMs: 600 });
    assert.equal(state.status, 'pending');
    assert.equal(state.reason, 'account_shell_unverified');
  }
  for (const userAttributes of [{ hidden: true }, { disabled: true }]) {
    const fixture = orevxPageRuntime({ signOut: false, userAttributes });
    assert.equal(fixture.scope.readLoginSnapshot(fixture.site).accountShellVisible, undefined);
  }
});

test('login success: aria-label, referenced labels and menu roles are read independently of visible control text', () => {
  const label = new Element('span', { id: 'logout-label' }, 'Sign out');
  for (const control of [
    new Button('Account', { 'aria-label': 'Sign out' }),
    new Element('div', { role: 'menuitem', 'aria-labelledby': 'logout-label' }),
    new Element('div', { role: 'treeitem', title: '退出当前账号' }),
  ]) {
    const fixture = runtime({ document: loginPage({ buttons: [control, label] }) });
    assert.equal(fixture.scope.hasVisibleLogoutControl(fixture.site), true);
  }
});

test('login success: business errors on authenticated pages do not become login rejection', async () => {
  for (const message of [
    'Network request failed',
    'sign-in failed',
    'Check-in failed: invalid credentials',
    '签到失败，请稍后重试',
    '抽奖失败：余额不足',
    'Insufficient balance',
    'Not enough credits to claim the daily reward',
  ]) {
    const fixture = runtime({
      pathname: '/user/checkins',
      document: loginPage({
        heading: 'Check-in',
        buttons: [
          new Button('Account', { 'aria-label': 'Sign out' }),
          new Element('div', { role: 'alert' }, message),
        ],
      }),
    });
    fixture.scope.Nu = () => null;
    fixture.scope.nr = () => null;
    const state = await fixture.api.readLoginState(fixture.site);
    assert.equal(state.status, 'authenticated', `${message}: ${state.detail}`);
    assert.equal(state.reason, 'logout_control');
  }
});

test('login success: profile password or binding errors remain separate from session verification', async () => {
  for (const message of [
    'Invalid password',
    '修改密码失败',
    'Password update failed: incorrect password',
    '绑定邮箱失败，请检查密码',
  ]) {
    const fixture = runtime({
      pathname: '/user/profile',
      document: loginPage({
        heading: 'Personal settings',
        inputs: [new Input({ type: 'password', name: 'password' })],
        buttons: [
          new Button('保存密码'),
          new Button('Sign out'),
          new Element('div', { role: 'alert' }, message),
        ],
      }),
    });
    fixture.scope.Nu = () => null;
    fixture.scope.nr = () => null;
    const state = await fixture.api.readLoginState(fixture.site);
    assert.equal(state.status, 'authenticated', `${message}: ${state.detail}`);
    assert.equal(state.reason, 'logout_control');
  }
});

test('login success: explicit session expiry and real credential errors retain priority on business or profile pages', async () => {
  for (const [pathname, message] of [
    ['/user/checkins', 'Your session has expired. Sign in again.'],
    ['/user/checkins', '签到失败，请重新登录'],
    ['/user/profile', '登录失败：凭据错误'],
  ]) {
    const fixture = runtime({
      pathname,
      document: loginPage({
        heading: 'Personal settings',
        buttons: [new Button('Sign out'), new Element('div', { role: 'alert' }, message)],
      }),
    });
    fixture.scope.Nu = () => null;
    fixture.scope.nr = () => null;
    const state = await fixture.api.readLoginState(fixture.site);
    assert.equal(state.status, 'failed', message);
    assert.equal(state.reason, 'login_rejected');
  }
});

test('login success: a footer login link does not suppress two fresh current-user readings', async () => {
  const footer = new Element('footer');
  const link = new Anchor('登录', { href: 'https://site.test/login' });
  link.parentElement = footer;
  footer.children = [link];
  const fixture = runtime({
    pathname: '/dashboard',
    document: loginPage({ heading: 'Dashboard', buttons: [footer] }),
  });
  fixture.scope.Nu = () => null;
  fixture.scope.nr = () => null;
  let reads = 0;
  fixture.scope.qi = async () => {
    reads += 1;
    return { source: 'api', userId: '42' };
  };
  const state = await fixture.api.readLoginState(fixture.site);
  assert.equal(state.status, 'authenticated');
  assert.equal(state.reason, 'stable_api_identity');
  assert.equal(reads, 2);
});

async function runAutomatic({
  document = nativePage(),
  pathname = '/login',
  resolve = (method) => method,
  omitResolver = false,
  alreadyLoggedIn = false,
  currentIdentity = { userId: '299', username: 'site-user', source: 'api' },
  pendingReason,
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
    Nu: () => null,
    nr: () => null,
    readLoginState: async (site) => {
      events.push('read-login-state');
      if (alreadyLoggedIn)
        return {
          status: 'authenticated',
          reason: 'stable_api_identity',
          detail: 'Fresh test session verified',
          identity: currentIdentity,
        };
      const page = fixture.scope.readLoginSnapshot(site);
      const reason =
        pendingReason ??
        (page.loginForm
          ? 'login_form_visible'
          : page.loginEntry
            ? 'login_entry_visible'
            : 'success_evidence_missing');
      return { status: 'pending', reason, detail: 'Test login state pending' };
    },
    qi: async () => (alreadyLoggedIn ? currentIdentity : null),
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
  assert.equal(outcome.events[0], 'read-login-state');
  assert.ok(outcome.events.indexOf('resolve:form') > outcome.events.indexOf('read-login-state'));
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

test('page login: unresolved account shells or identity APIs do not start OAuth or submit credentials', async () => {
  for (const pendingReason of [
    'account_shell_unverified',
    'session_token_missing',
    'session_probe_rejected',
    'identity_api_unavailable',
    'identity_response_unusable',
    'success_evidence_missing',
  ]) {
    const outcome = await runAutomatic({
      pathname: '/dashboard',
      document: loginPage({ heading: 'Dashboard' }),
      explicitMethod: 'oauth',
      pendingReason,
    });
    assert.equal(
      outcome.events.some((event) =>
        /resolve|provider-|fill|proof|submit|clear-session|checkin/.test(event),
      ),
      false,
      `${pendingReason}: ${outcome.result?.message}`,
    );
    assert.deepEqual(outcome.identities, []);
  }
});
