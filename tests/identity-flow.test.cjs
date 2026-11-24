const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const acorn = require('acorn');

const root = path.resolve(__dirname, '..');

function readScript(base, relativePath) {
  const kind = relativePath.startsWith('content-scripts/') ? 'content' : 'background';
  const files = base
    ? [path.join(root, base, relativePath)]
    : [
        ...fs
          .readdirSync(path.join(root, 'src', 'modules'))
          .map((module) =>
            path.join(
              root,
              'src',
              'modules',
              module,
              kind === 'content' ? 'content.js' : 'service.js',
            ),
          ),
        path.join(
          root,
          'src',
          'shared',
          kind === 'content' ? 'content-support.js' : 'background-platform.js',
        ),
        ...(kind === 'background' ? [path.join(root, 'src', 'entries', 'background.js')] : []),
      ].filter((filename) => fs.existsSync(filename));
  const functions = new Map();
  for (const filename of files) {
    const source = fs.readFileSync(filename, 'utf8');
    const ast = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'module' });
    function visit(node) {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'FunctionDeclaration') {
        const found = functions.get(node.id.name) ?? [];
        found.push(source.slice(node.start, node.end));
        functions.set(node.id.name, found);
      }
      for (const value of Object.values(node)) {
        if (Array.isArray(value)) value.forEach(visit);
        else if (value && typeof value.type === 'string') visit(value);
      }
    }
    visit(ast);
  }
  return {
    functions(...names) {
      const implementation = names
        .map((name) => {
          const found = functions.get(name);
          assert.equal(found?.length, 1, `Expected one declaration of ${name}`);
          return found[0];
        })
        .join('\n');
      // Module-owned live bindings use the same dependencies that these behavior tests mock.
      // Only the binding transport is adapted; the production function bodies remain intact.
      const stateNames = [
        ...new Set(
          implementation.match(/\b(?:bg[A-Z]\w*State|__contentScope\d*|__contentState\d*)\b/g) ??
            [],
        ),
      ];
      const bindings = stateNames
        .map(
          (name) =>
            `var ${name} = new Proxy(globalThis, {
              get(target, key) { return key === "store" ? target.z : target[key]; },
              set(target, key, value) { target[key] = value; return true; }
            });`,
        )
        .join('\n');
      return `${bindings}\n${implementation}`;
    },
  };
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

for (const base of ['', 'output/chrome-mv3']) {
  const label = base || 'main';
  const content = readScript(base, 'content-scripts/auto-login.js');
  const background = readScript(base, 'background/checkin-service.js');

  for (const [kind, script, names, compare] of [
    ['content', content, ['xi', 'Ji', 'Yi', 'Xi', 'Zi'], 'Zi'],
    ['background', background, ['br', 'Br', 'Vr', 'Hr', 'Ur'], 'Ur'],
  ]) {
    const context = vm.createContext({});
    vm.runInContext(script.functions(...names), context);

    test(`${label}/${kind}: ID 304 confirms despite a different account note`, () => {
      assert.equal(
        context[compare](
          { userId: '304', username: '3914', source: 'visible' },
          '3914认识',
          '304',
          {},
        ).match,
        'confirmed',
      );
    });

    test(`${label}/${kind}: matching text cannot override ID 303 versus 304`, () => {
      for (const source of ['api', 'storage', 'visible']) {
        assert.equal(
          context[compare]({ userId: '303', username: '3914', source }, '3914', '304', {
            pageAccountMatch: '3914',
          }).match,
          'mismatch',
        );
      }
    });

    test(`${label}/${kind}: a bound ID requires the page to return its ID`, () => {
      assert.equal(
        context[compare]({ username: '3914', source: 'visible' }, '3914', '304', {}).match,
        'unknown',
      );
      assert.equal(
        context[compare](null, '3914', '304', { pageAccountMatch: '3914' }).match,
        'unknown',
      );
    });

    test(`${label}/${kind}: another account's ID is always rejected`, () => {
      assert.equal(
        context[compare]({ userId: '304', username: '3914', source: 'visible' }, '3914', '304', {
          knownUsers: { 304: 'other account' },
        }).match,
        'mismatch',
      );
    });
  }

  async function replay({
    pageId = '304',
    boundId = '304',
    steps = [],
    samples,
    cookies,
    formSubmitted = false,
    identitySaveOk = true,
    canSaveIdentity = true,
    pageIdentity,
    stage = 'checkin',
    loginMethod = 'form',
    workflow = true,
    siteAccountCount = 2,
  } = {}) {
    const actions = {
      checkins: 0,
      clears: 0,
      confirms: 0,
      identities: [],
      navigations: [],
      handoffs: [],
      handoffSteps: [],
      identityReads: 0,
      identityTokens: [],
      balanceReads: 0,
    };
    let now = 1000;
    let sampleIndex = 0;
    const identity = () => {
      const sample = samples?.[Math.min(sampleIndex++, samples.length - 1)] ?? pageId;
      return typeof sample === 'object'
        ? sample
        : { userId: sample, username: '3914', source: 'visible' };
    };
    const clock = class extends Date {
      static now() {
        return now;
      }
    };
    const emptyStorage = { length: 0, key() {}, removeItem() {} };
    const context = vm.createContext({
      URL,
      Date: clock,
      console: { log() {} },
      location: {
        href: 'https://skybaby.us.ci/profile',
        origin: 'https://skybaby.us.ci',
        pathname: '/profile',
        hash: '',
      },
      document: { body: { innerText: '' } },
      localStorage: emptyStorage,
      sessionStorage: emptyStorage,
      Wm: '切换账号:',
      Gm: 1,
      rh: '个人资料身份已核验:',
      ih: '本轮已全新登录:',
      nh: 12000,
      $: 300000,
      p: (site) => site.checkin?.method === 'workflow',
      rf: () => workflow,
      cf: () => workflow,
      sf: () => (workflow ? 'https://skybaby.us.ci/profile' : null),
      of: () => true,
      lh: () => false,
      uh: () => false,
      xm: () => false,
      An: () => stage === 'relogin',
      ir: () => true,
      Gi: () => null,
      Dr: () => 'https://skybaby.us.ci',
      xr: () => true,
      pr: async () => {},
      hr: async () => true,
      gr: async () => true,
      ea: () => true,
      za: async () => {
        actions.balanceReads += 1;
        return null;
      },
      qi: async (site, token) => {
        actions.identityReads += 1;
        actions.identityTokens.push(token ?? null);
        return identity();
      },
      Bi: () => pageIdentity ?? identity(),
      w: async (ms) => {
        now += ms;
      },
      U: async () => {},
      di: () => {},
      Wp: () => null,
      Lu: async () => ({ resolved: true, detected: false }),
      zu: async () => ({ resolved: true, detected: false }),
      Nf: async () => {
        actions.checkins += 1;
        return { status: 'already', message: '已确认签到' };
      },
    });
    vm.runInContext(
      content.functions('xi', 'Ji', 'Yi', 'Xi', 'Zi', 'Qi', '$i', 'Zp', 'Qp', 'hh'),
      context,
    );
    const task = {
      accountId: 'account-3914',
      username: '3914认识',
      password: 'test-only',
      apiToken: loginMethod === 'token' ? 'test-only-token' : undefined,
      effectiveLoginMethod: loginMethod,
      accountIdentityUserId: boundId,
      formCredentialsSubmitted: formSubmitted,
      siteAccountCount,
      siteAccountUserIds: { 303: '3241rgs' },
      stage,
      steps,
      site: {
        id: 'skybaby',
        loginUrl: 'https://skybaby.us.ci/login',
        loginMethod,
        checkin: {
          method: workflow ? 'workflow' : 'none',
          ...(workflow
            ? { workflow: { route: ['/login', '/profile'], identityPath: '/profile', steps: [] } }
            : {}),
        },
      },
    };
    const result = await context.hh(task, {
      async clearSiteCookies() {
        actions.clears += 1;
        return cookies ?? { matched: 2, removed: 2, failed: 0 };
      },
      async navigate(url, log, stage) {
        actions.navigations.push({ url, stage });
      },
      async needsUser(message, log) {
        actions.handoffs.push(message);
        actions.handoffSteps.push(plain(log ?? []));
      },
      async confirmIdentity() {
        actions.confirms += 1;
      },
      ...(canSaveIdentity
        ? {
            async saveIdentity(identity) {
              actions.identities.push(plain(identity));
              if (!identitySaveOk) throw Error('后台拒绝更新账号身份');
            },
          }
        : {}),
      async markStage() {},
    });
    if (identitySaveOk) assert.ok(!result?.message?.startsWith('异常:'), result?.message);
    assert.equal(task.accountIdentityUserId, boundId);
    return { actions, result };
  }

  async function replayProfileRoute({
    path = '/profile',
    pageId = '299',
    steps = [],
    apiIdentity = false,
    workflowReady = false,
  } = {}) {
    const actions = {
      checkins: 0,
      clears: 0,
      confirms: 0,
      identities: [],
      navigations: [],
      handoffs: [],
      workflowCalls: 0,
    };
    let now = 1000;
    const identity = () => ({
      userId: pageId,
      username: '3306',
      source: apiIdentity ? 'api' : 'visible',
      ...(apiIdentity ? { endpoint: '/api/user/self' } : {}),
    });
    const clock = class extends Date {
      static now() {
        return now;
      }
    };
    const emptyStorage = { length: 0, key() {}, removeItem() {} };
    const context = vm.createContext({
      URL,
      Date: clock,
      console: { log() {} },
      location: {
        href: `https://site.test${path}`,
        origin: 'https://site.test',
        pathname: path,
        hash: '',
      },
      document: { body: { innerText: '' } },
      localStorage: emptyStorage,
      sessionStorage: emptyStorage,
      Wm: '切换账号:',
      Km: '自动切换 GitHub 账号:',
      Um: '自动重试:',
      qm: '学习流程恢复登录:',
      Xm: '进入签到页: ',
      Zm: '学习路线进度:',
      Qm: 2,
      $m: 1,
      eh: 3,
      sh: [
        '切换账号:',
        '自动切换 GitHub 账号:',
        '自动重试:',
        '学习流程恢复登录:',
        '开始第二次登录',
        '已清除',
        '已调用站点退出接口',
      ],
      Gm: 1,
      rh: '个人资料身份已核验:',
      ih: '本轮已全新登录:',
      nh: 12000,
      $: 300000,
      p: (site) => site.checkin?.method === 'workflow',
      W: (site, url) => new URL(url, site.loginUrl).origin === new URL(site.loginUrl).origin,
      xm: () => false,
      An: () => false,
      ir: () => true,
      Gi: () => null,
      qi: async () => identity(),
      Bi: identity,
      w: async (ms) => {
        now += ms;
      },
      U: async () => {},
      di: () => {},
      Wp: () => null,
      Lu: async () => ({ resolved: true, detected: false }),
      zu: async () => ({ resolved: true, detected: false }),
      Nf: async (site, log) => {
        actions.workflowCalls += 1;
        if (path !== '/profile' && !workflowReady) {
          log.push(`工作流接入学习路线: 从当前业务页 ${path} 进入 /profile`);
          return { status: 'navigate', url: 'https://site.test/profile' };
        }
        actions.checkins += 1;
        return { status: 'already', message: '已确认签到' };
      },
    });
    vm.runInContext(
      content.functions(
        'xi',
        'Ji',
        'Yi',
        'Xi',
        'Zi',
        'Qi',
        '$i',
        'Zp',
        'Qp',
        'ah',
        'oh',
        'ch',
        'lh',
        'uh',
        'dh',
        'fh',
        'ph',
        'mh',
        'ef',
        'nf',
        'rf',
        'af',
        'of',
        'sf',
        'cf',
        'hh',
      ),
      context,
    );
    const task = {
      accountId: 'account-3306',
      username: '3306',
      password: 'test-only',
      accountIdentityUserId: '299',
      formCredentialsSubmitted: true,
      siteAccountCount: 2,
      siteAccountUserIds: { 300: 'other-account' },
      stage: 'checkin',
      steps,
      site: {
        id: 'site-a',
        loginUrl: 'https://site.test/login',
        checkin: {
          method: 'workflow',
          workflow: { route: ['/profile'], identityPath: '/profile', steps: [] },
        },
      },
    };
    const result = await context.hh(task, {
      async clearSiteCookies() {
        actions.clears += 1;
        return { matched: 2, removed: 2, failed: 0 };
      },
      async navigate(url, log, stage) {
        actions.navigations.push({ url, stage, steps: plain(log) });
      },
      async needsUser(message, log) {
        actions.handoffs.push({ message, steps: plain(log) });
      },
      async confirmIdentity() {
        actions.confirms += 1;
      },
      async saveIdentity(identity) {
        actions.identities.push(plain(identity));
      },
      async markStage() {},
    });
    assert.ok(!result?.message?.startsWith('异常:'), result?.message);
    assert.equal(task.accountIdentityUserId, '299');
    return { actions, result };
  }

  test(`${label}: switching from ID 300 to 299 resets only the learned-route redirect budget`, async () => {
    const beforeSwitch = [
      '工作流接入学习路线: 从当前业务页 /dashboard 进入 /profile',
      '进入签到页: /profile',
    ];
    const oldSession = await replayProfileRoute({ pageId: '300', steps: beforeSwitch });
    assert.equal(oldSession.actions.checkins, 0);
    assert.equal(oldSession.actions.clears, 1);
    assert.equal(oldSession.actions.navigations[0].stage, 'login');
    const afterLogin = [
      ...oldSession.actions.navigations[0].steps,
      '已提交账号 3306 的登录凭据',
      '本轮已全新登录:3306',
      '登录结果已确认(/dashboard)',
    ];
    const newSession = await replayProfileRoute({
      path: '/dashboard',
      pageId: '299',
      steps: afterLogin,
    });
    assert.equal(newSession.result, null);
    assert.deepEqual(newSession.actions.handoffs, []);
    assert.equal(newSession.actions.navigations.length, 1);
    assert.equal(newSession.actions.navigations[0].url, 'https://site.test/profile');
    assert.equal(newSession.actions.navigations[0].stage, 'checkin');
    const verified = await replayProfileRoute({
      pageId: '299',
      steps: newSession.actions.navigations[0].steps,
    });
    assert.equal(verified.result?.ok, true);
    assert.equal(verified.actions.checkins, 1);
    assert.equal(verified.actions.confirms, 1);
    assert.deepEqual(verified.actions.identities, []);
  });

  test(`${label}: a genuine redirect loop within the same login still stops with its reason`, async () => {
    const { actions, result } = await replayProfileRoute({
      path: '/dashboard',
      steps: [
        '切换账号: 本站 Cookie 已清除，重新打开登录页',
        '本轮已全新登录:3306',
        '工作流接入学习路线: 从当前业务页 /dashboard 进入 /profile',
        '进入签到页: /profile',
      ],
    });
    assert.equal(result, null);
    assert.equal(actions.checkins, 0);
    assert.deepEqual(actions.navigations, []);
    assert.equal(actions.handoffs.length, 1);
    assert.match(actions.handoffs[0].message, /当前页 \/dashboard.*跳了 1 次/);
    assert.match(actions.handoffs[0].message, /身份核验页未能到达/);
  });

  test(`${label}: redirect-budget reset never clears the fixed target account ID`, async () => {
    const { actions, result } = await replayProfileRoute({
      pageId: '300',
      steps: [
        '工作流接入学习路线: 从当前业务页 /dashboard 进入 /profile',
        '进入签到页: /profile',
        '切换账号: 本站 Cookie 已清除，重新打开登录页',
        '本轮已全新登录:3306',
      ],
    });
    assert.equal(actions.checkins, 0);
    assert.equal(actions.confirms, 0);
    assert.equal(actions.clears, 0);
    assert.deepEqual(actions.identities, []);
    assert.equal(result?.ok, false);
    assert.match(result.message, /身份仍不匹配|身份核验/);
  });

  test(`${label}: stable current-user API confirms before profile without skipping workflow execution`, async () => {
    const { actions, result } = await replayProfileRoute({
      path: '/dashboard',
      apiIdentity: true,
      workflowReady: true,
    });
    assert.equal(result?.ok, true);
    assert.equal(actions.confirms, 1);
    assert.equal(actions.workflowCalls, 1);
    assert.equal(actions.checkins, 1);
    assert.equal(actions.clears, 0);
    assert.deepEqual(actions.navigations, []);
    assert.deepEqual(actions.handoffs, []);
  });

  test(`${label}: stable API identity of another user cannot run the workflow from a business page`, async () => {
    const { actions, result } = await replayProfileRoute({
      path: '/dashboard',
      pageId: '300',
      apiIdentity: true,
      workflowReady: true,
    });
    assert.equal(result, null);
    assert.equal(actions.workflowCalls, 0);
    assert.equal(actions.checkins, 0);
    assert.equal(actions.confirms, 0);
    assert.equal(actions.clears, 1);
    assert.equal(actions.navigations[0].stage, 'login');
    assert.deepEqual(actions.identities, []);
  });

  test(`${label}: profile waiting rechecks the live API instead of accepting stale page samples`, async () => {
    const { actions, result } = await replay({
      pageIdentity: { userId: '303', username: 'other-user', source: 'visible' },
      samples: [
        { userId: '303', username: 'other-user', source: 'visible' },
        { userId: '304', username: '3914', source: 'api' },
        { userId: '304', username: '3914', source: 'api' },
      ],
    });
    assert.equal(result?.ok, true);
    assert.equal(actions.clears, 0);
    assert.equal(actions.checkins, 1);
    assert.equal(actions.confirms, 1);
    assert.ok(actions.identityReads >= 3);
  });

  test(`${label}: conflicting identity evidence never confirms, switches or rewrites a bound account`, async () => {
    const { actions, result } = await replay({
      samples: [
        {
          source: 'api',
          identityConflict: '身份接口同时返回不同用户 ID（303、304）',
        },
      ],
    });
    assert.equal(result, null);
    assert.equal(actions.clears, 0);
    assert.equal(actions.checkins, 0);
    assert.equal(actions.confirms, 0);
    assert.deepEqual(actions.identities, []);
    assert.equal(actions.handoffs.length, 1);
    assert.match(actions.handoffs[0], /冲突/);
  });

  for (const stage of ['relogin', 'relogin-verify']) {
    test(`${label}: ${stage} cannot finish for a different user or conflicting identity`, async () => {
      for (const sample of [
        { userId: '300', username: '3914', source: 'api' },
        { source: 'api', identityConflict: '身份接口同时返回不同用户 ID（299、300）' },
      ]) {
        const { actions, result } = await replay({
          boundId: '299',
          samples: [sample],
          stage,
          siteAccountCount: 1,
        });
        assert.equal(result, null);
        assert.equal(actions.confirms, 0);
        assert.equal(actions.checkins, 0);
        assert.equal(actions.balanceReads, 0);
        assert.deepEqual(actions.identities, []);
        assert.equal(actions.handoffs.length, 1);
        assert.match(actions.handoffs[0], /第二次登录身份核验未通过/);
        assert.ok(
          Array.isArray(actions.handoffSteps[0]),
          'identity handoff preserves the actual log',
        );
        assert.equal(
          actions.handoffSteps[0].some((line) => /第二次登录成功，签到完成/.test(line)),
          false,
        );
      }
    });

    test(`${label}: ${stage} records a successful result only after stable target identity`, async () => {
      const { actions, result } = await replay({
        boundId: '299',
        samples: [{ userId: '299', username: '3914', source: 'api' }],
        stage,
      });
      assert.equal(result?.ok, true);
      assert.equal(actions.confirms, 1);
      assert.ok(actions.identityReads >= 2);
      assert.ok(actions.balanceReads > 0);
      assert.deepEqual(actions.handoffs, []);
    });
  }

  test(`${label}: token second login rejects an existing identity object unless the target matches`, async () => {
    for (const sample of [
      { userId: '300', username: '3914', source: 'api' },
      { source: 'api', identityConflict: '身份接口同时返回不同用户 ID（299、300）' },
    ]) {
      const { actions, result } = await replay({
        boundId: '299',
        samples: [sample],
        stage: 'relogin',
        loginMethod: 'token',
      });
      assert.equal(result?.ok, false);
      assert.equal(actions.confirms, 0);
      assert.equal(actions.checkins, 0);
      assert.equal(actions.balanceReads, 0);
      assert.deepEqual(actions.identities, []);
      assert.deepEqual(actions.identityTokens, ['test-only-token']);
    }
  });

  test(`${label}: token second login keeps the explicitly verified token identity through result confirmation`, async () => {
    const { actions, result } = await replay({
      boundId: '299',
      samples: [{ userId: '299', username: '3914', source: 'api' }],
      stage: 'relogin',
      loginMethod: 'token',
    });
    assert.equal(result?.ok, true);
    assert.equal(actions.confirms, 1);
    assert.equal(actions.identityReads, 1);
    assert.deepEqual(actions.identityTokens, ['test-only-token']);
    assert.ok(actions.balanceReads > 0);
  });

  test(`${label}: non-workflow login success with a missing fixed ID cannot confirm or finish`, async () => {
    const { actions, result } = await replay({
      boundId: '299',
      samples: [{ username: '3914', source: 'api' }],
      stage: 'verify',
      workflow: false,
      siteAccountCount: 1,
    });
    assert.equal(result, null);
    assert.equal(actions.confirms, 0);
    assert.equal(actions.checkins, 0);
    assert.equal(actions.balanceReads, 0);
    assert.deepEqual(actions.identities, []);
    assert.equal(actions.handoffs.length, 1);
    assert.match(actions.handoffs[0], /身份|用户 ID/);
  });

  test(`${label}: replay continues for stable ID 304 and never clears its cookies`, async () => {
    const { actions, result } = await replay();
    assert.equal(result?.ok, true);
    assert.equal(actions.checkins, 1);
    assert.equal(actions.confirms, 1);
    assert.equal(actions.clears, 0);
  });

  test(`${label}: ID 303 switches once and cannot reach the check-in action`, async () => {
    const { actions, result } = await replay({ pageId: '303' });
    assert.equal(result, null);
    assert.equal(actions.clears, 1);
    assert.equal(actions.checkins, 0);
    assert.deepEqual(actions.navigations, [{ url: 'https://skybaby.us.ci/login', stage: 'login' }]);
  });

  test(`${label}: a transient matching ID cannot pass the profile check`, async () => {
    const { actions } = await replay({ samples: ['303', '303'] });
    assert.equal(actions.checkins, 0);
    assert.equal(actions.clears, 1);
  });

  test(`${label}: an unbound account starts its own login without relearning the site workflow`, async () => {
    const { actions, result } = await replay({ boundId: null });
    assert.equal(result, null);
    assert.equal(actions.checkins, 0);
    assert.equal(actions.clears, 1);
    assert.equal(actions.identities.length, 0);
    assert.deepEqual(actions.handoffs, []);
    assert.deepEqual(actions.navigations, [{ url: 'https://skybaby.us.ci/login', stage: 'login' }]);
  });

  test(`${label}: a stable first identity after managed login uses the site's shared workflow`, async () => {
    const { actions, result } = await replay({ boundId: null, formSubmitted: true });
    assert.equal(result?.ok, true);
    assert.equal(actions.clears, 0);
    assert.equal(actions.checkins, 1);
    assert.equal(actions.confirms, 1);
    assert.deepEqual(actions.handoffs, []);
    assert.deepEqual(actions.identities, [
      {
        userId: '304',
        username: '3914',
        source: 'visible',
        verifiedByManagedLogin: true,
      },
    ]);
  });

  test(`${label}: another saved account's ID cannot become this account's first identity`, async () => {
    const { actions } = await replay({
      pageId: '303',
      boundId: null,
      formSubmitted: true,
    });
    assert.equal(actions.checkins, 0);
    assert.equal(actions.confirms, 0);
    assert.deepEqual(actions.identities, []);
    assert.equal(actions.handoffs.length, 1);
    assert.doesNotMatch(actions.handoffs[0], /请为本账号重新学习/);
  });

  test(`${label}: changing first-login ID samples cannot bind or run the shared workflow`, async () => {
    const { actions } = await replay({
      boundId: null,
      formSubmitted: true,
      samples: ['304', '305'],
    });
    assert.equal(actions.checkins, 0);
    assert.equal(actions.confirms, 0);
    assert.deepEqual(actions.identities, []);
    assert.equal(actions.handoffs.length, 1);
    assert.match(actions.handoffs[0], /稳定/);
  });

  test(`${label}: failed first identity persistence stops before any check-in action`, async () => {
    const { actions, result } = await replay({
      boundId: null,
      formSubmitted: true,
      identitySaveOk: false,
    });
    assert.equal(result?.ok, false);
    assert.equal(actions.checkins, 0);
    assert.equal(actions.confirms, 0);
    assert.equal(actions.identities.length, 1);
  });

  test(`${label}: missing identity adapter cannot bypass first-account verification`, async () => {
    const { actions, result } = await replay({
      boundId: null,
      formSubmitted: true,
      canSaveIdentity: false,
    });
    assert.equal(result?.ok, false);
    assert.equal(actions.checkins, 0);
    assert.equal(actions.confirms, 0);
    assert.deepEqual(actions.identities, []);
    assert.match(result.message, /首次确认的身份/);
  });

  test(`${label}: exhausted switching is reported as identity failure`, async () => {
    const { actions, result } = await replay({ pageId: '303', steps: ['切换账号: 已清除'] });
    assert.equal(actions.clears, 0);
    assert.equal(actions.checkins, 0);
    assert.match(result.message, /身份仍不匹配，已达到自动切换次数上限/);
    assert.doesNotMatch(result.message, /无法清除.*Cookie/);
  });

  test(`${label}: actual cookie residue stops navigation and check-in`, async () => {
    const { actions, result } = await replay({
      pageId: '303',
      cookies: { matched: 2, removed: 1, failed: 1 },
    });
    assert.equal(actions.clears, 1);
    assert.equal(actions.navigations.length, 0);
    assert.equal(actions.checkins, 0);
    assert.match(result.message, /无法清除.*Cookie/);
  });

  function learningContext() {
    const site = { id: 'skybaby', loginUrl: 'https://skybaby.us.ci/login' };
    const account = { id: 'account-3914', siteId: site.id, username: '3914', label: '3914认识' };
    const state = {
      accounts: [account],
      sites: [site],
      session: {
        runId: 'learn-1',
        accountId: account.id,
        siteId: site.id,
        events: [{ type: 'click', loginAction: 'submit', path: '/login', at: 1 }],
      },
    };
    const context = vm.createContext({
      URL,
      t: { get: async (key) => state[key] },
      r: { accounts: 'accounts', sites: 'sites' },
      n: {
        get: async () => state.session,
        set: async (key, session) => {
          state.session = session;
        },
      },
      a: (tab) => `learn:${tab}`,
      Xn: (frame) => frame === 0,
      Fm: async (session, sender) => new URL(sender.url).origin === new URL(site.loginUrl).origin,
      Ff: (value) => new URL(value, site.loginUrl).pathname,
      N: (selected, value) => new URL(value).origin === new URL(selected.loginUrl).origin,
      M: (selected) => new URL(selected.loginUrl).hostname,
      Y: (id, sites) => sites.find((selected) => selected.id === id),
    });
    vm.runInContext(
      background.functions('Kp', 'recordLearningIdentity', 'prepareLearnedAccountIdentity'),
      context,
    );
    const sender = { tab: { id: 7 }, frameId: 0, url: 'https://skybaby.us.ci/profile' };
    const observation = {
      path: '/profile',
      identity: { userId: '304', username: '3914', source: 'visible' },
    };
    const workflow = { identityPath: '/profile' };
    return { context, state, site, account, sender, observation, workflow };
  }

  test(`${label}: learning binds ID from the recorded profile page`, async () => {
    const { context, state, site, account, sender, observation, workflow } = learningContext();
    assert.equal((await context.recordLearningIdentity(observation, sender, 'learn-1')).ok, true);
    const identity = await context.prepareLearnedAccountIdentity(
      state.session,
      account,
      site,
      workflow,
    );
    assert.deepEqual(plain(identity), {
      userId: '304',
      username: '3914',
      source: 'visible',
      verifiedByLearning: true,
    });
    assert.equal(
      await context.prepareLearnedAccountIdentity(state.session, account, site, {
        identityPath: '/other',
      }),
      null,
    );
  });

  test(`${label}: learning ignores the previous session before manual login`, async () => {
    const { context, state, sender, observation } = learningContext();
    state.session.events = [];
    assert.equal(
      (await context.recordLearningIdentity(observation, sender, 'learn-1')).ignored,
      true,
    );
    assert.equal(state.session.learnedIdentities, undefined);
  });

  test(`${label}: learning refuses changing IDs and preserves another account's binding`, async () => {
    const { context, state, site, account, sender, observation, workflow } = learningContext();
    await context.recordLearningIdentity(observation, sender, 'learn-1');
    state.accounts.push({
      id: 'another',
      siteId: site.id,
      identity: { userId: '304' },
    });
    await assert.rejects(
      () => context.prepareLearnedAccountIdentity(state.session, account, site, workflow),
      /已绑定给本站其他账号/,
    );
    state.accounts.pop();
    await context.recordLearningIdentity(
      { ...observation, identity: { ...observation.identity, userId: '303' } },
      sender,
      'learn-1',
    );
    await assert.rejects(
      () => context.prepareLearnedAccountIdentity(state.session, account, site, workflow),
      /出现过不同用户 ID/,
    );
  });

  test(`${label}: only the active learning page can submit an identity`, async () => {
    const { context, sender, observation } = learningContext();
    for (const other of [
      { ...sender, frameId: 1 },
      { ...sender, url: 'https://other.example/profile' },
    ]) {
      assert.equal((await context.recordLearningIdentity(observation, other, 'learn-1')).ok, false);
    }
    assert.equal((await context.recordLearningIdentity(observation, sender, 'expired')).ok, false);
  });

  test(`${label}: learning monitor requires stable samples and awaits saving on flush`, async () => {
    let currentId = '303';
    let tick;
    let clears = 0;
    let acknowledge;
    const sent = [];
    const context = vm.createContext({
      location: { pathname: '/profile', hash: '' },
      Bi: () => ({ userId: currentId, username: '3914', source: 'visible' }),
      setInterval(callback) {
        tick = callback;
        return 1;
      },
      clearInterval() {
        clears += 1;
      },
      w: async () => {},
    });
    vm.runInContext(content.functions('createLearningIdentityMonitor'), context);
    const monitor = context.createLearningIdentityMonitor((observation) => {
      sent.push(plain(observation));
      return new Promise((resolve) => {
        acknowledge = resolve;
      });
    });
    monitor.start();
    currentId = '304';
    tick();
    await Promise.resolve();
    assert.equal(sent.length, 0);
    tick();
    await Promise.resolve();
    assert.equal(sent[0].identity.userId, '304');
    monitor.stop();
    let flushed = false;
    const flush = monitor.flush().then(() => {
      flushed = true;
    });
    await Promise.resolve();
    assert.equal(flushed, false);
    acknowledge({ ok: true });
    await flush;
    assert.equal(flushed, true);
    assert.equal(clears, 1);
    assert.equal(sent.length, 1);
  });
}
