const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const acorn = require('acorn');

const workspace = path.resolve(__dirname, '..');
const accountSource = fs.readFileSync(path.join(workspace, 'src/modules/accounts/view.js'), 'utf8');
const managementSource = fs.readFileSync(
  path.join(workspace, 'src/entries/management-app.js'),
  'utf8',
);
const parser = import(
  pathToFileURL(path.join(workspace, 'src/modules/accounts/batch-input.js')).href
);

// Execute the production render/handler bodies with a small hook and JSX host.
// Browser effects and unrelated child components stay outside these behavior tests.
function declaration(source, name, type) {
  const matches = [];
  const ast = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'module' });
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === type && (node.id?.name === name || node.key?.name === name)) {
      matches.push(source.slice(node.start, node.end));
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value?.type) visit(value);
    }
  }
  visit(ast);
  assert.equal(matches.length, 1, `Expected one ${name} declaration`);
  return matches[0];
}

function hookHost({ runEffects = false } = {}) {
  const slots = [];
  let cursor = 0;
  let pendingEffects = [];
  const element = (type, props = {}, ...children) => {
    const values = {
      ...props,
      ...(children.length ? { children: children.length === 1 ? children[0] : children } : {}),
    };
    if (
      typeof type === 'function' &&
      ['AccountAddModes', 'AccountBatchContent', 'AccountBatchFooter'].includes(type.name)
    ) {
      return type(values);
    }
    return { type, props: values };
  };
  return {
    React: {
      createElement: element,
      useState(initial) {
        const slot = cursor++;
        if (!(slot in slots)) slots[slot] = typeof initial === 'function' ? initial() : initial;
        return [
          slots[slot],
          (value) => {
            slots[slot] = typeof value === 'function' ? value(slots[slot]) : value;
          },
        ];
      },
      useRef(initial) {
        const slot = cursor++;
        if (!(slot in slots)) slots[slot] = { current: initial };
        return slots[slot];
      },
      useMemo: (factory) => factory(),
      useEffect(effect, dependencies) {
        if (!runEffects) return;
        const slot = cursor++;
        const previous = slots[slot];
        if (
          !previous ||
          dependencies?.some((value, index) => !Object.is(value, previous.dependencies[index]))
        ) {
          slots[slot] = { dependencies, cleanup: null };
          pendingEffects.push(() => {
            previous?.cleanup?.();
            slots[slot].cleanup = effect();
          });
        }
      },
      useId: () => 'batch-test',
    },
    jsx: {
      jsx: (type, props) => element(type, props),
      jsxs: (type, props) => element(type, props),
      Fragment: 'Fragment',
    },
    render(component, props) {
      cursor = 0;
      let tree = component(props);
      if (pendingEffects.length) {
        const effects = pendingEffects;
        pendingEffects = [];
        effects.forEach((effect) => effect());
        cursor = 0;
        tree = component(props);
      }
      return tree;
    },
  };
}

function descendants(tree) {
  const nodes = [];
  function visit(node) {
    if (Array.isArray(node)) node.forEach(visit);
    else if (node && typeof node === 'object' && 'type' in node) {
      nodes.push(node);
      visit(node.props.children);
      visit(node.props.footer);
    }
  }
  visit(tree);
  return nodes;
}

function find(tree, predicate) {
  const matches = descendants(tree).filter(predicate);
  assert.equal(matches.length, 1, 'Expected one matching rendered control');
  return matches[0];
}

function textOf(node) {
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node && typeof node === 'object') return textOf(node.props?.children);
  return typeof node === 'string' || typeof node === 'number' ? String(node) : '';
}

function managementFixture(surface, sites) {
  const hooks = hookHost();
  const imports = [];
  let loads = 0;
  const actions = {
    sites,
    accounts: [],
    proxies: [],
    status: {},
    live: {},
    queue: [],
    balances: {},
    loading: false,
    launchMode: 'tab',
    schedule: { enabled: false },
    refreshingBalances: new Set(),
    load: async () => loads++,
    statusOf: () => 'pending',
    resultOf: () => undefined,
    balanceOf: () => undefined,
  };
  Object.assign(
    actions,
    vm.runInNewContext(
      `({${declaration(accountSource, 'store_Ui_addAccounts', 'Property')}}).store_Ui_addAccounts`,
    )(
      {
        Vi: async (message) => {
          imports.push(message);
          return { ok: true, added: message.inputs.length, skipped: 0 };
        },
      },
      undefined,
      () => actions,
    ),
  );
  const store = () => actions;
  store.getState = () => actions;
  const scope = new Proxy(
    {
      G: hooks.React,
      W: hooks.jsx,
      Ui: store,
      w: { div: 'motion.div', span: 'motion.span', header: 'motion.header' },
      ql: () => ['manual', () => {}],
      Wl: () => ['manual', () => {}],
      tc: (accounts) => accounts,
      Ll: (entries) => entries,
      uu: (accounts) => ({
        total: accounts.length,
        done: 0,
        pending: accounts.length,
        running: 0,
        attention: 0,
        failed: 0,
      }),
      F: () => undefined,
      Ho: () => ({}),
      R: (...classes) => classes.filter(Boolean).join(' '),
    },
    { get: (target, key) => (key in target ? target[key] : key) },
  );
  vm.runInNewContext(
    `({${declaration(managementSource, 'register', 'Property')}}).register(scope)`,
    { scope, setTimeout: () => 0 },
  );
  return {
    render: () => hooks.render(scope.du, { surface }),
    imports,
    get loads() {
      return loads;
    },
  };
}

const sites = [
  { id: 'site-a', name: 'A', loginUrl: 'https://a.test/login' },
  { id: 'site-b', name: 'B', loginUrl: 'https://b.test/login', loginMethod: 'github' },
];

for (const surface of ['page', 'sidepanel']) {
  test(`${surface}: account adding uses one editor with current-site batch saving`, async () => {
    const fixture = managementFixture(surface, sites);
    let tree = fixture.render();
    assert.equal(
      descendants(tree).some((node) => node.props.label === '批量添加账号'),
      false,
    );
    find(tree, (node) => node.props.site?.id === 'site-b').props.onAddAccount('site-b');
    tree = fixture.render();
    const editor = find(tree, (node) => node.type === 'ms');
    assert.equal(editor.props.open, true);
    assert.equal(editor.props.defaultSiteId, 'site-b');
    assert.equal(editor.props.sites, sites);
    assert.deepEqual(editor.props.accounts, []);
    assert.equal(typeof editor.props.onSubmitMany, 'function');

    const inputs = [{ siteId: 'site-b', username: 'alice', password: 'test-password' }];
    const result = await editor.props.onSubmitMany(inputs);
    assert.equal(result.added, 1);
    assert.equal(result.skipped, 0);
    assert.equal(fixture.loads, 1);
    assert.equal(fixture.imports.length, 1);
    assert.equal(fixture.imports[0].action, 'add-accounts');
    assert.equal(fixture.imports[0].inputs, inputs);
    assert.equal(fixture.imports[0].preserveDuplicates, false);
    editor.props.onClose();
    tree = fixture.render();
    assert.equal(find(tree, (node) => node.type === 'ms').props.open, false);
  });
}

function editorFixture(
  parseAccountBatch,
  {
    onSubmitMany,
    onClose = () => {},
    onSubmit = async () => {},
    editing,
    supportedMethods = ['form', 'github'],
    catalogue = [
      { value: 'form', label: '站点账号密码' },
      { value: 'github', label: 'GitHub 账号密码' },
    ],
    probe = async ({ siteId }) => ({
      ok: true,
      feature: { loginOptions: { siteId, status: 'unknown', methods: [] } },
    }),
  } = {},
) {
  const hooks = hookHost({ runEffects: true });
  const probes = [];
  const scope = new Proxy(
    {
      G: hooks.React,
      W: hooks.jsx,
      w: { div: 'motion.div', button: 'motion.button' },
      ps: 'auto',
      mn: () => false,
      Ho: () => ({}),
      Io: (method) => supportedMethods.includes(method),
      Ya: vm.runInNewContext(`(${declaration(accountSource, 'Ya', 'FunctionExpression')})`),
      Fo: { form: '站点账号密码', github: 'GitHub 账号密码' },
      Po: catalogue,
      fs: [{ value: 'inherit', label: '跟随站点设置' }],
      H: async (request) => {
        probes.push(request);
        return probe(request);
      },
    },
    { get: (target, key) => (key in target ? target[key] : key) },
  );
  const helpers = [
    'useAccountBatch',
    'AccountAddModes',
    'AccountBatchContent',
    'AccountBatchFooter',
  ]
    .map((name) => declaration(accountSource, name, 'FunctionDeclaration'))
    .join('\n');
  const component = vm.runInNewContext(
    `${helpers}\n(${declaration(accountSource, 'ms', 'FunctionExpression')})`,
    { appRuntime: { scope }, scope, parseAccountBatch, importAccountBatch: async () => {} },
  );
  const props = {
    open: true,
    sites,
    proxies: [],
    defaultSiteId: 'site-b',
    accounts: [{ siteId: 'site-b', username: 'saved' }],
    onClose,
    onSubmitMany,
    onSubmit,
    editing,
  };
  const render = () => hooks.render(component, props);
  return {
    render,
    props,
    probes,
    async settle() {
      await new Promise(setImmediate);
      return render();
    },
  };
}

function mode(tree, label) {
  return find(tree, (node) => node.props.role === 'radio' && node.props.children === label);
}

function siteSelect(tree) {
  return find(tree, (node) => node.props.label === '所属站点').props.children;
}

function loginSelect(tree) {
  return find(tree, (node) => node.props.label === '登录方式').props.children;
}

function probeResult(siteId, methods, status = methods.length > 1 ? 'multiple' : 'detected') {
  return { ok: true, feature: { loginOptions: { siteId, methods, status } } };
}

function probeEntries(siteId, entries) {
  return {
    ok: true,
    feature: {
      loginOptions: {
        siteId,
        entries,
        methods: [...new Set(entries.map((entry) => entry.method))],
        status: entries.length > 1 ? 'multiple' : 'detected',
      },
    },
  };
}

function deferred() {
  let resolve;
  const promise = new Promise((finish) => {
    resolve = finish;
  });
  return { promise, resolve };
}

function hasCredential(tree, label) {
  return descendants(tree).some((node) => node.props.label === label);
}

test('new accounts require a precise login choice instead of two unexplained credential forms', async () => {
  const { parseAccountBatch } = await parser;
  const fixture = editorFixture(parseAccountBatch);
  let tree = fixture.render();
  assert.equal(loginSelect(tree).props.value, 'auto');
  assert.deepEqual(
    descendants(loginSelect(tree))
      .filter((node) => node.type === 'option')
      .map((node) => [node.props.value, textOf(node)]),
    [
      ['auto', '请选择账号使用的登录方式'],
      ['form', '站点账号密码'],
      ['github', 'GitHub 账号密码'],
      ['oauth', '手动指定：第三方授权（在页面完成）'],
      ['manual', '手动指定：验证码 / 其他页面登录'],
      ['passkey', '手动指定：Passkey 登录'],
    ],
  );
  assert.equal(textOf(loginSelect(tree)).includes('跟随站点'), false);
  assert.equal(loginSelect(tree).props.children[0].props.disabled, true);
  assert.equal(
    descendants(tree).some((node) => node.props.label === '站点密码'),
    false,
  );
  assert.equal(
    descendants(tree).some((node) => node.props.label === 'GitHub 密码'),
    false,
  );
  assert.equal(tree.props.footer.props.disabled, true);
  siteSelect(tree).props.onChange({ target: { value: 'site-a' } });
  tree = fixture.render();
  assert.equal(loginSelect(tree).props.value, 'auto');
  const effectiveLogin = vm.runInNewContext(
    `(${declaration(accountSource, 'Ja', 'FunctionExpression')})`,
  );
  assert.equal(effectiveLogin({ password: 'site-only' }, sites[1]).loginMethod, 'auto');
  assert.equal(
    effectiveLogin({ githubUsername: 'github-only', githubPassword: 'test' }, sites[0]).loginMethod,
    'auto',
  );
  assert.equal(effectiveLogin({ loginMethod: 'form' }, sites[1]).loginMethod, 'form');
});

test('a detected GitHub-only page shows one credential group and saves without a site username', async () => {
  const { parseAccountBatch } = await parser;
  const pending = deferred();
  const submitted = [];
  const fixture = editorFixture(parseAccountBatch, {
    probe: () => pending.promise,
    onSubmit: async (input) => submitted.push(input),
  });
  let tree = fixture.render();
  assert.match(textOf(tree), /首次读取本站登录页/);
  assert.equal(hasCredential(tree, '站点密码'), false);
  assert.equal(hasCredential(tree, 'GitHub 密码'), false);
  pending.resolve(probeResult('site-b', ['github']));
  tree = await fixture.settle();
  assert.equal(fixture.probes.length, 1);
  assert.equal(fixture.probes[0].type, 'PROBE_LOGIN_PAGE');
  assert.equal(fixture.probes[0].siteId, 'site-b');
  assert.equal(loginSelect(tree).props.value, 'github');
  assert.match(textOf(tree), /本站已识别：GitHub 登录/);
  assert.equal(hasCredential(tree, '站点账号'), false);
  assert.equal(hasCredential(tree, '站点密码'), false);
  assert.equal(hasCredential(tree, 'GitHub 密码'), true);
  find(tree, (node) => node.props.placeholder === 'GitHub 用户名或邮箱').props.onChange({
    target: { value: 'github-owner' },
  });
  find(tree, (node) => node.props.placeholder === 'GitHub 登录密码').props.onChange({
    target: { value: 'github-test-only' },
  });
  tree = fixture.render();
  assert.equal(tree.props.footer.props.disabled, false);
  await tree.props.footer.props.onClick();
  assert.equal(submitted.length, 1);
  assert.equal(submitted[0].siteId, 'site-b');
  assert.equal(submitted[0].username, 'github-owner');
  assert.equal(submitted[0].loginMethod, 'github');
  assert.equal(submitted[0].githubUsername, 'github-owner');
  assert.equal(submitted[0].githubPassword, 'github-test-only');
  assert.equal(submitted[0].password, '');
});

test('a detected native page shows only site credentials without inheriting a GitHub site setting', async () => {
  const { parseAccountBatch } = await parser;
  const submitted = [];
  const fixture = editorFixture(parseAccountBatch, {
    probe: async ({ siteId }) => probeResult(siteId, ['form']),
    onSubmit: async (input) => submitted.push(input),
  });
  fixture.render();
  let tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'form');
  assert.match(textOf(tree), /本站已识别：站点账号密码/);
  assert.equal(hasCredential(tree, '站点密码'), true);
  assert.equal(hasCredential(tree, 'GitHub 密码'), false);
  find(tree, (node) => node.props.placeholder === '站点用户名或邮箱').props.onChange({
    target: { value: 'site-owner' },
  });
  find(tree, (node) => node.props.placeholder === '站点登录密码').props.onChange({
    target: { value: 'site-test-only' },
  });
  tree = fixture.render();
  await tree.props.footer.props.onClick();
  assert.equal(submitted[0].loginMethod, 'form');
  assert.equal(submitted[0].username, 'site-owner');
  assert.equal(submitted[0].password, 'site-test-only');
  assert.equal(Object.hasOwn(submitted[0], 'githubPassword'), false);
});

test('a page with both login routes asks which account the user owns before showing credentials', async () => {
  const { parseAccountBatch } = await parser;
  const fixture = editorFixture(parseAccountBatch, {
    probe: async ({ siteId }) => probeResult(siteId, ['form', 'github']),
  });
  fixture.render();
  let tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'auto');
  assert.match(textOf(tree), /本站支持多种登录方式/);
  assert.match(textOf(tree), /请选择你已有的账号使用哪种方式/);
  assert.equal(hasCredential(tree, '站点密码'), false);
  assert.equal(hasCredential(tree, 'GitHub 密码'), false);
  assert.equal(tree.props.footer.props.disabled, true);
  loginSelect(tree).props.onChange({ target: { value: 'github' } });
  tree = fixture.render();
  assert.equal(hasCredential(tree, 'GitHub 密码'), true);
  assert.equal(hasCredential(tree, '站点密码'), false);
  loginSelect(tree).props.onChange({ target: { value: 'form' } });
  tree = fixture.render();
  assert.equal(hasCredential(tree, 'GitHub 密码'), false);
  assert.equal(hasCredential(tree, '站点密码'), true);
});

test('a manual GitHub choice is not replaced by a later native-only probe result', async () => {
  const { parseAccountBatch } = await parser;
  const pending = deferred();
  const fixture = editorFixture(parseAccountBatch, { probe: () => pending.promise });
  let tree = fixture.render();
  loginSelect(tree).props.onChange({ target: { value: 'github' } });
  pending.resolve(probeResult('site-b', ['form']));
  tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'github');
  assert.equal(hasCredential(tree, 'GitHub 密码'), true);
  assert.equal(hasCredential(tree, '站点密码'), false);
  assert.match(textOf(tree), /本站已识别：站点账号密码/);
});

test('switching sites rejects an old probe result even when it arrives after the current result', async () => {
  const { parseAccountBatch } = await parser;
  const pending = new Map();
  const fixture = editorFixture(parseAccountBatch, {
    probe: ({ siteId }) => {
      const entry = deferred();
      pending.set(siteId, entry);
      return entry.promise;
    },
  });
  fixture.render();
  await fixture.settle();
  siteSelect(fixture.render()).props.onChange({ target: { value: 'site-a' } });
  fixture.render();
  await fixture.settle();
  pending.get('site-a').resolve(probeResult('site-a', ['form']));
  let tree = await fixture.settle();
  assert.equal(siteSelect(tree).props.value, 'site-a');
  assert.equal(loginSelect(tree).props.value, 'form');
  pending.get('site-b').resolve(probeResult('site-b', ['github']));
  tree = await fixture.settle();
  assert.equal(siteSelect(tree).props.value, 'site-a');
  assert.equal(loginSelect(tree).props.value, 'form');
  assert.match(textOf(tree), /本站已识别：站点账号密码/);
});

test('changing a site login URL invalidates its earlier probe despite the same site ID', async () => {
  const { parseAccountBatch } = await parser;
  const requests = [];
  const fixture = editorFixture(parseAccountBatch, {
    probe: () => {
      const entry = deferred();
      requests.push(entry);
      return entry.promise;
    },
  });
  fixture.render();
  await fixture.settle();
  fixture.props.sites = sites.map((site) =>
    site.id === 'site-b' ? { ...site, loginUrl: 'https://b.test/new-login' } : site,
  );
  fixture.render();
  await fixture.settle();
  assert.equal(requests.length, 2);
  requests[0].resolve(probeResult('site-b', ['github']));
  let tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'auto');
  requests[1].resolve(probeResult('site-b', ['form']));
  tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'form');
});

test('closing and reopening the modal cannot apply the closed session probe result', async () => {
  const { parseAccountBatch } = await parser;
  const requests = [];
  const fixture = editorFixture(parseAccountBatch, {
    probe: () => {
      const entry = deferred();
      requests.push(entry);
      return entry.promise;
    },
  });
  fixture.render();
  await fixture.settle();
  fixture.props.open = false;
  fixture.render();
  requests[0].resolve(probeResult('site-b', ['github']));
  let tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'auto');
  fixture.props.open = true;
  fixture.render();
  tree = await fixture.settle();
  assert.equal(requests.length, 2);
  assert.equal(loginSelect(tree).props.value, 'auto');
  assert.match(textOf(tree), /首次读取本站登录页/);
});

test('unknown, logged-in and unavailable pages explain the result and permit a manual GitHub choice', async () => {
  const { parseAccountBatch } = await parser;
  for (const [status, expected] of [
    ['unknown', /当前页面未识别出登录方式/],
    ['already-logged-in', /当前页面已登录，未显示登录入口/],
    ['unavailable', /暂时无法读取本站登录页/],
  ]) {
    const fixture = editorFixture(parseAccountBatch, {
      probe: async ({ siteId }) => probeResult(siteId, [], status),
    });
    fixture.render();
    let tree = await fixture.settle();
    assert.match(textOf(tree), expected);
    assert.equal(hasCredential(tree, '站点密码'), false);
    assert.equal(hasCredential(tree, 'GitHub 密码'), false);
    assert.ok(
      find(tree, (node) => node.type === 'button' && node.props.children === '更新登录方式'),
    );
    loginSelect(tree).props.onChange({ target: { value: 'github' } });
    tree = fixture.render();
    assert.equal(hasCredential(tree, 'GitHub 密码'), true);
    assert.equal(hasCredential(tree, '站点密码'), false);
  }
});

test('a probe response for another site is never used as a detected login method', async () => {
  const { parseAccountBatch } = await parser;
  const fixture = editorFixture(parseAccountBatch, {
    probe: async () => probeResult('site-a', ['github']),
  });
  fixture.render();
  const tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'auto');
  assert.match(textOf(tree), /暂时无法读取本站登录页/);
  assert.equal(hasCredential(tree, 'GitHub 密码'), false);
});

test('retry forces a fresh probe while site changes start an ordinary request', async () => {
  const { parseAccountBatch } = await parser;
  const fixture = editorFixture(parseAccountBatch, {
    probe: async ({ siteId }) => probeResult(siteId, ['form']),
  });
  fixture.render();
  let tree = await fixture.settle();
  assert.equal(Object.hasOwn(fixture.probes[0], 'force'), false);
  loginSelect(tree).props.onChange({ target: { value: 'github' } });
  find(
    tree,
    (node) => node.type === 'button' && node.props.children === '更新登录方式',
  ).props.onClick();
  fixture.render();
  tree = await fixture.settle();
  assert.equal(fixture.probes[1].force, true);
  assert.equal(loginSelect(tree).props.value, 'github');
  siteSelect(tree).props.onChange({ target: { value: 'site-a' } });
  fixture.render();
  tree = await fixture.settle();
  assert.equal(fixture.probes[2].siteId, 'site-a');
  assert.equal(Object.hasOwn(fixture.probes[2], 'force'), false);
  assert.equal(loginSelect(tree).props.value, 'form');
});

test('a saved site catalog names its saved source and offers only an explicit update', async () => {
  const { parseAccountBatch } = await parser;
  const google = { key: 'oauth:google', method: 'oauth', provider: 'google', label: 'Google' };
  const fixture = editorFixture(parseAccountBatch, {
    probe: async ({ siteId }) => ({
      ok: true,
      feature: {
        loginOptions: {
          siteId,
          status: 'detected',
          methods: ['oauth'],
          entries: [google],
          source: 'saved',
          persisted: true,
          checkedAt: 1700000000000,
        },
      },
    }),
  });
  fixture.render();
  const tree = await fixture.settle();
  assert.match(textOf(tree), /本站已保存：Google/);
  assert.match(textOf(tree), /仅手动更新时重新打开网页/);
  assert.equal(fixture.probes[0].force, undefined);
  assert.equal(loginSelect(tree).props.value, 'entry:oauth:google');
  assert.ok(find(tree, (node) => node.type === 'button' && node.props.children === '更新登录方式'));
});

test('editing reads only saved login choices and a manual site update preserves the account selected provider', async () => {
  const { parseAccountBatch } = await parser;
  const google = { key: 'oauth:google', method: 'oauth', provider: 'google', label: 'Google' },
    linuxdo = { key: 'oauth:linuxdo', method: 'oauth', provider: 'linuxdo', label: 'Linux DO' },
    submitted = [];
  const fixture = editorFixture(parseAccountBatch, {
    editing: {
      id: 'google-owner',
      siteId: 'site-b',
      username: 'owner@example.test',
      loginMethod: 'oauth',
      loginEntry: google,
      password: 'existing-test-only',
      identity: { userId: '299' },
    },
    probe: async ({ siteId, force }) => ({
      ...probeEntries(siteId, force ? [linuxdo] : [google, linuxdo]),
      feature: {
        loginOptions: {
          ...probeEntries(siteId, force ? [linuxdo] : [google, linuxdo]).feature.loginOptions,
          source: force ? 'page' : 'saved',
          persisted: true,
          checkedAt: 1700000000000,
        },
      },
    }),
    onSubmit: async (input) => submitted.push(input),
  });
  fixture.render();
  let tree = await fixture.settle();
  assert.equal(fixture.probes[0].savedOnly, true);
  assert.equal(fixture.probes[0].force, undefined);
  assert.equal(loginSelect(tree).props.value, 'entry:oauth:google');
  find(
    tree,
    (node) => node.type === 'button' && node.props.children === '更新登录方式',
  ).props.onClick();
  fixture.render();
  tree = await fixture.settle();
  assert.equal(fixture.probes[1].force, true);
  assert.equal(fixture.probes[1].savedOnly, undefined);
  assert.equal(loginSelect(tree).props.value, 'entry:oauth:google');
  assert.match(textOf(loginSelect(tree)), /Linux DO/);
  assert.match(textOf(loginSelect(tree)), /Google/);
  assert.match(textOf(tree), /本账号仍使用：Google/);
  assert.match(textOf(tree), /原设置已保留/);
  await tree.props.footer.props.onClick();
  assert.equal(submitted[0].loginMethod, 'oauth');
  assert.equal(submitted[0].password, 'existing-test-only');
  assert.deepEqual(JSON.parse(JSON.stringify(submitted[0].loginEntry)), google);
  assert.equal(Object.hasOwn(submitted[0], 'identity'), false);
});

test('a sole legacy OAuth or Passkey route is named accurately and selected without passwords', async () => {
  const { parseAccountBatch } = await parser;
  for (const [method, label] of [
    ['oauth', '第三方登录'],
    ['passkey', 'Passkey 登录'],
  ]) {
    const fixture = editorFixture(parseAccountBatch, {
      probe: async ({ siteId }) => probeResult(siteId, [method]),
    });
    fixture.render();
    let tree = await fixture.settle();
    assert.equal(loginSelect(tree).props.value, method);
    assert.match(textOf(tree), new RegExp(`本站已识别：${label}`));
    assert.equal(hasCredential(tree, 'GitHub 密码'), false);
    assert.equal(hasCredential(tree, '站点密码'), false);
    const option = find(
      loginSelect(tree),
      (node) => node.type === 'option' && node.props.value === method,
    );
    assert.equal(textOf(option), label);
    loginSelect(tree).props.onChange({ target: { value: method } });
    tree = fixture.render();
    assert.equal(loginSelect(tree).props.value, method);
    assert.equal(
      descendants(loginSelect(tree)).filter(
        (node) => node.type === 'option' && node.props.value === method,
      ).length,
      1,
    );
  }
});

test('multiple third-party entries with the same canonical method require an exact provider choice', async () => {
  const { parseAccountBatch } = await parser;
  const submitted = [];
  const entries = [
    {
      key: 'google-login',
      method: 'oauth',
      label: 'Google 登录',
      provider: 'google',
      matchText: '使用 Google 登录',
      hrefPath: '/oauth/google',
    },
    {
      key: 'linuxdo-login',
      method: 'oauth',
      label: 'Linux DO 登录',
      provider: 'linuxdo',
      matchText: '使用 Linux DO 登录',
      hrefPath: '/oauth/linuxdo',
    },
    { key: 'discord-login', method: 'oauth', label: 'Discord 登录', provider: 'discord' },
    { key: 'microsoft-login', method: 'oauth', label: 'Microsoft 登录', provider: 'microsoft' },
  ];
  const fixture = editorFixture(parseAccountBatch, {
    probe: async ({ siteId }) => probeEntries(siteId, entries),
    onSubmit: async (input) => submitted.push(input),
  });
  fixture.render();
  let tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'auto');
  assert.equal(tree.props.footer.props.disabled, true);
  assert.deepEqual(
    descendants(loginSelect(tree))
      .filter((node) => node.type === 'option')
      .map((node) => [node.props.value, textOf(node)]),
    [
      ['auto', '请选择账号使用的登录方式'],
      ...entries.map((entry) => [`entry:${entry.key}`, entry.label]),
    ],
  );
  assert.match(textOf(tree), /Google 登录、Linux DO 登录、Discord 登录、Microsoft 登录/);
  assert.equal(hasCredential(tree, '站点密码'), false);
  assert.equal(hasCredential(tree, 'GitHub 密码'), false);
  loginSelect(tree).props.onChange({ target: { value: 'entry:linuxdo-login' } });
  tree = fixture.render();
  assert.equal(loginSelect(tree).props.value, 'entry:linuxdo-login');
  assert.match(textOf(tree), /将打开「Linux DO 登录」入口/);
  assert.match(textOf(tree), /第三方授权页登录并完成授权/);
  assert.match(textOf(tree), /不收集第三方密码/);
  const credentialNodes = descendants(tree),
    identifier = find(tree, (node) => node.props.label === '账号标识'),
    workflow = find(tree, (node) => node.type === 'details');
  assert.ok(credentialNodes.indexOf(identifier) < credentialNodes.indexOf(workflow));
  assert.equal(workflow.props.open, undefined);
  assert.match(textOf(tree), /已选择：Linux DO 登录/);
  assert.doesNotMatch(identifier.props.hint, /用户 ID/);
  find(tree, (node) => node.props.placeholder === '本站用户名或完整邮箱').props.onChange({
    target: { value: 'linuxdo-owner' },
  });
  tree = fixture.render();
  assert.equal(tree.props.footer.props.disabled, false);
  await tree.props.footer.props.onClick();
  assert.equal(submitted[0].loginMethod, 'oauth');
  assert.equal(submitted[0].username, 'linuxdo-owner');
  assert.equal(submitted[0].password, '');
  assert.deepEqual(JSON.parse(JSON.stringify(submitted[0].loginEntry)), entries[1]);
  assert.equal(Object.hasOwn(submitted[0], 'githubPassword'), false);
});

test('a sole concrete OAuth provider is selected and stores only safe entry metadata', async () => {
  const { parseAccountBatch } = await parser;
  const submitted = [];
  const entry = {
    key: 'google-login',
    method: 'oauth',
    label: 'Google 登录',
    provider: 'google',
    matchText: '使用 Google 登录',
    hrefPath: '/oauth/google?code=temporary-code#access_token=temporary-token',
    password: 'untrusted-secret',
    selector: '#provider-login',
    href: 'https://accounts.google.test/oauth?client_secret=temporary',
  };
  const fixture = editorFixture(parseAccountBatch, {
    probe: async ({ siteId }) => probeEntries(siteId, [entry]),
    onSubmit: async (input) => submitted.push(input),
  });
  fixture.render();
  let tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'entry:google-login');
  assert.match(textOf(tree), /本站已识别：Google 登录/);
  assert.equal(hasCredential(tree, '站点密码'), false);
  assert.equal(hasCredential(tree, 'GitHub 密码'), false);
  assert.equal(tree.props.footer.props.disabled, true);
  find(tree, (node) => node.props.placeholder === '本站用户名或完整邮箱').props.onChange({
    target: { value: 'site-google-owner' },
  });
  tree = fixture.render();
  await tree.props.footer.props.onClick();
  assert.equal(submitted[0].loginMethod, 'oauth');
  assert.deepEqual(JSON.parse(JSON.stringify(submitted[0].loginEntry)), {
    key: 'google-login',
    method: 'oauth',
    label: 'Google 登录',
    provider: 'google',
    matchText: '使用 Google 登录',
    hrefPath: '/oauth/google',
  });
  assert.equal(JSON.stringify(submitted[0]).includes('untrusted-secret'), false);
  assert.equal(JSON.stringify(submitted[0]).includes('temporary'), false);
});

test('a discovered email verification entry requires an identifier and never asks for a password', async () => {
  const { parseAccountBatch } = await parser;
  const submitted = [];
  const entry = {
    key: 'email-code',
    method: 'manual',
    label: '邮箱验证码登录',
    provider: 'email',
    matchText: '发送验证码',
    hrefPath: '/login/email',
  };
  const fixture = editorFixture(parseAccountBatch, {
    probe: async ({ siteId }) => probeEntries(siteId, [entry]),
    onSubmit: async (input) => submitted.push(input),
  });
  fixture.render();
  let tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'entry:email-code');
  assert.match(textOf(tree), /本站已识别：邮箱验证码登录/);
  assert.match(textOf(tree), /在页面完成验证码或其他验证/);
  assert.equal(hasCredential(tree, '站点密码'), false);
  assert.equal(hasCredential(tree, 'GitHub 密码'), false);
  assert.equal(tree.props.footer.props.disabled, true);
  await tree.props.footer.props.onClick();
  assert.equal(submitted.length, 0);
  assert.match(
    find(tree, (node) => node.props.label === '账号标识').props.hint,
    /首次登录后会与当前用户信息核对并绑定/,
  );
  find(tree, (node) => node.props.placeholder === '本站用户名或完整邮箱').props.onChange({
    target: { value: 'owner@example.test' },
  });
  tree = fixture.render();
  assert.equal(tree.props.footer.props.disabled, false);
  await tree.props.footer.props.onClick();
  assert.equal(submitted[0].loginMethod, 'manual');
  assert.equal(submitted[0].username, 'owner@example.test');
  assert.equal(submitted[0].password, '');
  assert.deepEqual(JSON.parse(JSON.stringify(submitted[0].loginEntry)), entry);
});

test('unknown and already logged-in pages offer explicit manual routes without claiming site support', async () => {
  const { parseAccountBatch } = await parser;
  for (const status of ['unknown', 'already-logged-in', 'unavailable']) {
    for (const method of ['oauth', 'manual', 'passkey']) {
      const submitted = [];
      const fixture = editorFixture(parseAccountBatch, {
        probe: async ({ siteId }) => probeResult(siteId, [], status),
        onSubmit: async (input) => submitted.push(input),
      });
      fixture.render();
      let tree = await fixture.settle();
      assert.equal(textOf(tree).includes('本站已识别：'), false);
      assert.equal(textOf(tree).includes('本站支持多种登录方式'), false);
      const option = find(
        loginSelect(tree),
        (node) => node.type === 'option' && node.props.value === method,
      );
      assert.match(textOf(option), /^手动指定：/);
      loginSelect(tree).props.onChange({ target: { value: method } });
      tree = fixture.render();
      assert.equal(loginSelect(tree).props.value, method);
      assert.equal(hasCredential(tree, '站点密码'), false);
      assert.equal(hasCredential(tree, 'GitHub 密码'), false);
      assert.equal(tree.props.footer.props.disabled, true);
      find(tree, (node) => node.props.placeholder === '本站用户名或完整邮箱').props.onChange({
        target: { value: 'site-owner@example.test' },
      });
      tree = fixture.render();
      await tree.props.footer.props.onClick();
      assert.equal(submitted[0].loginMethod, method);
      assert.equal(submitted[0].password, '');
      assert.equal(Object.hasOwn(submitted[0], 'loginEntry'), false);
    }
  }
});

test('an expanded shared login catalogue keeps manual declarations unique and explicitly named', async () => {
  const { parseAccountBatch } = await parser;
  const fixture = editorFixture(parseAccountBatch, {
    supportedMethods: ['form', 'github', 'oauth', 'manual', 'passkey'],
    catalogue: [
      { value: 'form', label: '站点账号密码' },
      { value: 'github', label: 'GitHub 账号密码' },
      { value: 'oauth', label: '第三方登录' },
      { value: 'manual', label: '人工登录' },
      { value: 'passkey', label: 'Passkey' },
    ],
  });
  fixture.render();
  const tree = await fixture.settle();
  for (const method of ['oauth', 'manual', 'passkey']) {
    const option = find(
      loginSelect(tree),
      (node) => node.type === 'option' && node.props.value === method,
    );
    assert.match(textOf(option), /^手动指定：/);
    assert.equal(option.props.disabled, undefined);
  }
});

test('a detected GitHub entry keeps its precise route while requiring only GitHub credentials', async () => {
  const { parseAccountBatch } = await parser;
  const submitted = [];
  const entry = {
    key: 'github-oauth',
    method: 'github',
    label: 'GitHub 登录',
    provider: 'github',
    hrefPath: '/api/oauth/github',
  };
  const fixture = editorFixture(parseAccountBatch, {
    probe: async ({ siteId }) => probeEntries(siteId, [entry]),
    onSubmit: async (input) => submitted.push(input),
  });
  fixture.render();
  let tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'entry:github-oauth');
  assert.equal(hasCredential(tree, '站点账号'), false);
  assert.equal(hasCredential(tree, '站点密码'), false);
  assert.equal(hasCredential(tree, 'GitHub 密码'), true);
  find(tree, (node) => node.props.placeholder === 'GitHub 用户名或邮箱').props.onChange({
    target: { value: 'github-owner' },
  });
  find(tree, (node) => node.props.placeholder === 'GitHub 登录密码').props.onChange({
    target: { value: 'github-test-only' },
  });
  tree = fixture.render();
  await tree.props.footer.props.onClick();
  assert.equal(submitted[0].loginMethod, 'github');
  assert.equal(submitted[0].username, 'github-owner');
  assert.equal(submitted[0].githubPassword, 'github-test-only');
  assert.equal(submitted[0].password, '');
  assert.deepEqual(JSON.parse(JSON.stringify(submitted[0].loginEntry)), entry);
});

test('an exact manually chosen OAuth entry survives forced probing without switching providers', async () => {
  const { parseAccountBatch } = await parser;
  const google = { key: 'google', method: 'oauth', label: 'Google 登录', provider: 'google' };
  const linuxdo = { key: 'linuxdo', method: 'oauth', label: 'Linux DO 登录', provider: 'linuxdo' };
  const pending = deferred();
  const fixture = editorFixture(parseAccountBatch, {
    probe: async ({ siteId, force }) =>
      force ? pending.promise : probeEntries(siteId, [google, linuxdo]),
  });
  fixture.render();
  let tree = await fixture.settle();
  loginSelect(tree).props.onChange({ target: { value: 'entry:linuxdo' } });
  tree = fixture.render();
  find(
    tree,
    (node) => node.type === 'button' && node.props.children === '更新登录方式',
  ).props.onClick();
  tree = fixture.render();
  assert.equal(loginSelect(tree).props.value, 'entry:linuxdo');
  assert.match(textOf(tree), /将打开「Linux DO 登录」入口/);
  await fixture.settle();
  pending.resolve(probeEntries('site-b', [google]));
  tree = await fixture.settle();
  assert.equal(fixture.probes[1].force, true);
  assert.equal(loginSelect(tree).props.value, 'entry:linuxdo');
  assert.match(textOf(tree), /将打开「Linux DO 登录」入口/);
  assert.equal(
    descendants(loginSelect(tree)).filter(
      (node) => node.type === 'option' && node.props.value === 'entry:linuxdo',
    ).length,
    1,
  );
});

test('editing a saved exact provider preserves the entry, credentials and identity while reading saved choices', async () => {
  const { parseAccountBatch } = await parser;
  const submitted = [];
  const entry = {
    key: 'google',
    method: 'oauth',
    label: 'Google 登录',
    provider: 'google',
    hrefPath: '/oauth/google',
  };
  const fixture = editorFixture(parseAccountBatch, {
    supportedMethods: ['form', 'github', 'oauth', 'manual', 'passkey'],
    editing: {
      id: 'saved-google-owner',
      siteId: 'site-b',
      username: 'site-google-owner',
      password: 'existing-test-only',
      loginMethod: 'oauth',
      loginEntry: entry,
      identity: { userId: '299' },
    },
    onSubmit: async (input) => submitted.push(input),
  });
  fixture.render();
  const tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'entry:google');
  assert.match(textOf(loginSelect(tree)), /Google 登录/);
  assert.equal(fixture.probes.length, 1);
  assert.equal(fixture.probes[0].savedOnly, true);
  assert.equal(fixture.probes[0].force, undefined);
  assert.equal(hasCredential(tree, '站点密码'), false);
  assert.equal(hasCredential(tree, 'GitHub 密码'), false);
  await tree.props.footer.props.onClick();
  assert.equal(submitted[0].loginMethod, 'oauth');
  assert.equal(submitted[0].password, 'existing-test-only');
  assert.deepEqual(JSON.parse(JSON.stringify(submitted[0].loginEntry)), entry);
  assert.equal(Object.hasOwn(submitted[0], 'identity'), false);
});

test('editing an existing automatic account preserves its saved route and automatic credential behavior', async () => {
  const { parseAccountBatch } = await parser;
  const submitted = [];
  const entry = {
    key: 'google',
    method: 'oauth',
    label: 'Google 登录',
    provider: 'google',
    hrefPath: '/oauth/google',
  };
  const fixture = editorFixture(parseAccountBatch, {
    editing: {
      id: 'automatic-owner',
      siteId: 'site-b',
      username: 'site-owner',
      password: 'existing-site-only',
      githubUsername: 'github-owner',
      githubPassword: 'existing-github-only',
      loginMethod: 'auto',
      loginEntry: entry,
      identity: { userId: '299' },
    },
    onSubmit: async (input) => submitted.push(input),
  });
  fixture.render();
  const tree = await fixture.settle();
  assert.equal(loginSelect(tree).props.value, 'auto');
  assert.equal(hasCredential(tree, '站点密码'), true);
  assert.equal(hasCredential(tree, 'GitHub 密码'), true);
  assert.equal(fixture.probes.length, 1);
  assert.equal(fixture.probes[0].savedOnly, true);
  await tree.props.footer.props.onClick();
  assert.equal(submitted[0].loginMethod, 'auto');
  assert.equal(submitted[0].password, 'existing-site-only');
  assert.equal(submitted[0].githubPassword, 'existing-github-only');
  assert.deepEqual(JSON.parse(JSON.stringify(submitted[0].loginEntry)), entry);
  assert.equal(Object.hasOwn(submitted[0], 'identity'), false);
});

test('switching a saved provider to site credentials clears its incompatible entry and binding', async () => {
  const { parseAccountBatch } = await parser;
  const submitted = [];
  const fixture = editorFixture(parseAccountBatch, {
    editing: {
      id: 'saved-google-owner',
      siteId: 'site-b',
      username: 'site-owner',
      password: 'site-test-only',
      loginMethod: 'oauth',
      loginEntry: { key: 'google', method: 'oauth', label: 'Google 登录', provider: 'google' },
      identity: { userId: '299' },
    },
    onSubmit: async (input) => submitted.push(input),
  });
  let tree = fixture.render();
  loginSelect(tree).props.onChange({ target: { value: 'form' } });
  tree = fixture.render();
  await tree.props.footer.props.onClick();
  assert.equal(submitted[0].loginMethod, 'form');
  assert.equal(submitted[0].loginEntry, null);
  assert.equal(submitted[0].password, 'site-test-only');
  assert.deepEqual(JSON.parse(JSON.stringify(submitted[0].identity)), {});
  assert.equal(fixture.probes.length, 1);
  assert.equal(fixture.probes[0].savedOnly, true);
});

test('switching credential groups keeps draft values but saves only the chosen GitHub account', async () => {
  const { parseAccountBatch } = await parser;
  const submitted = [];
  const fixture = editorFixture(parseAccountBatch, {
    probe: async ({ siteId }) => probeResult(siteId, ['form', 'github']),
    onSubmit: async (input) => submitted.push(input),
  });
  fixture.render();
  let tree = await fixture.settle();
  loginSelect(tree).props.onChange({ target: { value: 'form' } });
  tree = fixture.render();
  find(tree, (node) => node.props.placeholder === '站点用户名或邮箱').props.onChange({
    target: { value: 'native-owner' },
  });
  find(tree, (node) => node.props.placeholder === '站点登录密码').props.onChange({
    target: { value: 'native-test-only' },
  });
  loginSelect(tree).props.onChange({ target: { value: 'github' } });
  tree = fixture.render();
  assert.equal(
    find(tree, (node) => node.props.placeholder === '留空使用 GitHub 用户名').props.value,
    '',
  );
  find(tree, (node) => node.props.placeholder === 'GitHub 用户名或邮箱').props.onChange({
    target: { value: 'github-owner' },
  });
  find(tree, (node) => node.props.placeholder === 'GitHub 登录密码').props.onChange({
    target: { value: 'github-test-only' },
  });
  loginSelect(tree).props.onChange({ target: { value: 'form' } });
  tree = fixture.render();
  assert.equal(
    find(tree, (node) => node.props.placeholder === '站点用户名或邮箱').props.value,
    'native-owner',
  );
  assert.equal(
    find(tree, (node) => node.props.placeholder === '站点登录密码').props.value,
    'native-test-only',
  );
  loginSelect(tree).props.onChange({ target: { value: 'github' } });
  tree = fixture.render();
  assert.equal(
    find(tree, (node) => node.props.placeholder === 'GitHub 用户名或邮箱').props.value,
    'github-owner',
  );
  await tree.props.footer.props.onClick();
  assert.equal(submitted[0].username, 'github-owner');
  assert.equal(submitted[0].loginMethod, 'github');
  assert.equal(submitted[0].password, '');
  assert.equal(submitted[0].githubPassword, 'github-test-only');
});

test('changing an account to page detection preserves both credential sets and its binding', async () => {
  const { parseAccountBatch } = await parser;
  const submitted = [];
  const fixture = editorFixture(parseAccountBatch, {
    editing: {
      id: 'alice',
      siteId: 'site-b',
      username: 'alice',
      password: 'site-test-password',
      githubUsername: 'alice-github',
      githubPassword: 'github-test-password',
      apiToken: 'existing-test-token',
      passkey: true,
      loginMethod: 'form',
      identity: { userId: '299' },
    },
    onSubmit: async (input) => submitted.push(input),
  });
  let tree = fixture.render();
  assert.equal(loginSelect(tree).props.value, 'form');
  loginSelect(tree).props.onChange({ target: { value: 'auto' } });
  tree = fixture.render();
  assert.equal(tree.props.footer.props.disabled, false);
  await tree.props.footer.props.onClick();
  assert.equal(submitted.length, 1);
  assert.equal(submitted[0].loginMethod, 'auto');
  assert.equal(submitted[0].password, 'site-test-password');
  assert.equal(submitted[0].githubUsername, 'alice-github');
  assert.equal(submitted[0].githubPassword, 'github-test-password');
  assert.equal(submitted[0].apiToken, 'existing-test-token');
  assert.equal(submitted[0].passkey, true);
  assert.equal(Object.hasOwn(submitted[0], 'identity'), false);
  assert.equal(fixture.probes.length, 1);
  assert.equal(fixture.probes[0].savedOnly, true);
});

test('a manually selected GitHub account needs only its own complete credential pair', async () => {
  const { parseAccountBatch } = await parser;
  const submitted = [];
  const fixture = editorFixture(parseAccountBatch, {
    onSubmit: async (input) => submitted.push(input),
  });
  let tree = fixture.render();
  loginSelect(tree).props.onChange({ target: { value: 'github' } });
  tree = fixture.render();
  assert.equal(
    descendants(tree).some((node) => node.props.label === '站点密码'),
    false,
  );
  find(tree, (node) => node.props.placeholder === 'GitHub 用户名或邮箱').props.onChange({
    target: { value: 'alice-github' },
  });
  tree = fixture.render();
  assert.equal(tree.props.footer.props.disabled, true);
  assert.match(textOf(find(tree, (node) => node.props.role === 'alert')), /GitHub.*同时填写/);
  await tree.props.footer.props.onClick();
  assert.deepEqual(submitted, []);
  find(tree, (node) => node.props.placeholder === 'GitHub 登录密码').props.onChange({
    target: { value: 'github-test-password' },
  });
  tree = fixture.render();
  assert.equal(tree.props.footer.props.disabled, false);
  await tree.props.footer.props.onClick();
  assert.equal(submitted[0].loginMethod, 'github');
  assert.equal(submitted[0].username, 'alice-github');
  assert.equal(submitted[0].password, '');
  assert.equal(submitted[0].githubPassword, 'github-test-password');
});

test('one account modal preserves both modes and saves batches with page-detected login', async () => {
  const { parseAccountBatch } = await parser;
  const submitted = [];
  const fixture = editorFixture(parseAccountBatch, {
    onSubmitMany: async (inputs) => {
      submitted.push(inputs);
      return { added: inputs.length, skipped: 0 };
    },
  });
  let tree = fixture.render();
  assert.equal(tree.type, 'uo');
  assert.equal(tree.props.title, '添加账号');
  assert.equal(siteSelect(tree).props.value, 'site-b');
  loginSelect(tree).props.onChange({ target: { value: 'form' } });
  tree = fixture.render();
  find(tree, (node) => node.props.placeholder === '站点用户名或邮箱').props.onChange({
    target: { value: 'single-account' },
  });
  mode(tree, '批量添加').props.onClick();
  tree = fixture.render();
  assert.equal(mode(tree, '批量添加').props['aria-checked'], true);
  assert.equal(siteSelect(tree).props.value, 'site-b');
  find(tree, (node) => node.type === 'textarea').props.onChange({
    target: { value: 'alice,secret-a,主账号\nALICE,duplicate\nsaved,existing\nbob,secret-b' },
  });
  tree = fixture.render();
  const preview = find(tree, (node) => node.props['aria-label'] === '账号解析预览');
  assert.equal(JSON.stringify(preview).includes('secret-a'), false);
  assert.equal(JSON.stringify(preview).includes('secret-b'), false);
  assert.equal(
    descendants(tree).some((node) => node.type === 'table'),
    false,
  );

  mode(tree, '单个添加').props.onClick();
  tree = fixture.render();
  assert.equal(
    find(tree, (node) => node.props.placeholder === '站点用户名或邮箱').props.value,
    'single-account',
  );
  assert.equal(siteSelect(tree).props.value, 'site-b');
  mode(tree, '批量添加').props.onClick();
  tree = fixture.render();
  assert.equal(
    find(tree, (node) => node.type === 'textarea').props.value,
    'alice,secret-a,主账号\nALICE,duplicate\nsaved,existing\nbob,secret-b',
  );
  const form = find(tree, (node) => node.type === 'form');
  assert.equal(
    find(tree, (node) => node.type === 'button' && node.props.children === '添加 2 个账号').props
      .form,
    form.props.id,
  );
  await form.props.onSubmit({ preventDefault() {} });

  assert.equal(submitted.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(submitted[0])), [
    {
      siteId: 'site-b',
      username: 'alice',
      password: 'secret-a',
      label: '主账号',
      loginMethod: 'auto',
    },
    { siteId: 'site-b', username: 'bob', password: 'secret-b', loginMethod: 'auto' },
  ]);
  tree = fixture.render();
  const success = textOf(find(tree, (node) => node.props.role === 'status'));
  assert.ok(success.includes('已添加 2 个账号'));
  assert.ok(success.includes('另有 2 行已跳过'));
  assert.equal(
    descendants(tree).some((node) => node.type === 'textarea'),
    false,
  );
  find(
    tree,
    (node) => node.type === 'button' && node.props.children === '继续添加',
  ).props.onClick();
  tree = fixture.render();
  assert.equal(find(tree, (node) => node.type === 'textarea').props.value, '');
});

test('batch saving locks the shared modal, mode and site until the request completes', async () => {
  const { parseAccountBatch } = await parser;
  let finish;
  const pending = new Promise((resolve) => {
    finish = resolve;
  });
  let closes = 0;
  let saves = 0;
  const fixture = editorFixture(parseAccountBatch, {
    onClose: () => closes++,
    onSubmitMany: () => {
      saves++;
      return pending;
    },
  });
  let tree = fixture.render();
  mode(tree, '批量添加').props.onClick();
  tree = fixture.render();
  find(tree, (node) => node.type === 'textarea').props.onChange({
    target: { value: 'alice,secret' },
  });
  tree = fixture.render();
  const submit = find(tree, (node) => node.type === 'form').props.onSubmit;
  const saving = submit({ preventDefault() {} });
  submit({ preventDefault() {} });
  tree = fixture.render();
  assert.equal(saves, 1);
  assert.equal(siteSelect(tree).props.disabled, true);
  assert.equal(mode(tree, '单个添加').props.disabled, true);
  assert.equal(mode(tree, '批量添加').props.disabled, true);
  assert.equal(find(tree, (node) => node.type === 'textarea').props.disabled, true);
  assert.equal(
    find(tree, (node) => node.type === 'button' && node.props.children === '取消').props.disabled,
    true,
  );
  tree.props.onClose();
  mode(tree, '单个添加').props.onClick();
  assert.equal(closes, 0);
  tree = fixture.render();
  assert.equal(mode(tree, '批量添加').props['aria-checked'], true);

  finish({ added: 1, skipped: 0 });
  await saving;
  tree = fixture.render();
  assert.equal(siteSelect(tree).props.disabled, false);
  assert.equal(mode(tree, '单个添加').props.disabled, false);
  find(tree, (node) => node.type === 'button' && node.props.children === '完成').props.onClick();
  assert.equal(closes, 1);
});
