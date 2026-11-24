const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test } = require('node:test');

const workspace = path.resolve(__dirname, '..');
const runtimes = Promise.all(
  ['learning', 'records'].map(
    (module) =>
      import(pathToFileURL(path.join(workspace, 'src', 'modules', module, 'view.js')).href),
  ),
);

async function classifier() {
  const [learning, records] = await runtimes;
  const scope = Object.create(null);
  learning.appRuntime.register(scope);
  for (let step = 6; step <= 11; step++) records.appRuntime.initialize(scope, step);
  return scope;
}

const routeFailure =
  '身份核验页未能到达：当前页 /dashboard 不在学习路线上，已为此跳了 1 次仍未落到路线上。本轮跳转预算已用尽；为避免给错账号签到，已停止签到。';

test('diagnostics: terminal identity-route failure beats earlier selector and login logs', async () => {
  const scope = await classifier();
  const result = scope.ua(routeFailure, [
    '找不到控件: text=密码登录',
    '已定位账号和密码字段',
    '已填好账号 3306',
    '已点提交登录',
    '登录结果已确认(/dashboard)',
    '工作流接入学习路线: 从当前业务页 /dashboard 进入 /profile',
    '进入签到页: /profile',
    '今天已经签到，无需再次签到',
  ]);
  assert.equal(result.code, 'identity-route-unreachable');
  assert.equal(result.message, routeFailure);
  assert.match(result.title, /身份|核验/);
  assert.equal(
    result.nextActions.some((action) => /重新学习|重录/.test(action)),
    false,
  );
});

test('diagnostics: newest meaningful failure is used when final message is generic', async () => {
  const scope = await classifier();
  const result = scope.ua('本轮执行失败', [
    '找不到控件: text=密码登录',
    '今天已经签到，无需再次签到',
    '已点提交登录',
    '登录结果已确认(/dashboard)',
    routeFailure,
  ]);
  assert.equal(result.code, 'identity-route-unreachable');
});

test('diagnostics: a genuine terminal missing-control failure remains a selector failure', async () => {
  const scope = await classifier();
  const result = scope.ua('找不到控件: #login-submit', [
    routeFailure,
    '已定位账号和密码字段',
    '登录结果已确认(/dashboard)',
  ]);
  assert.equal(result.code, scope.Z.SELECTOR_MISMATCH);
  assert.match(result.title, /控件/);
});

test('diagnostics: conflicting identity evidence outranks stale route and selector failures', async () => {
  const scope = await classifier();
  const failure =
    '身份证据冲突：本站接口同一响应返回不同用户 ID 299、300；目标用户 ID 299，复核后仍不一致，已停止签到。';
  const result = scope.ua(failure, [
    '找不到控件: #login-submit',
    routeFailure,
    '登录结果已确认(/dashboard)',
  ]);
  assert.equal(result.code, 'identity-evidence-conflict');
  assert.equal(result.message, failure);
  assert.match(result.title, /身份.*冲突/);
  assert.match(result.detail, /保留.*用户 ID/);
  assert.equal(
    result.nextActions.some((action) => /重新学习|重录/.test(action)),
    false,
  );
});

test('diagnostics: latest conflicting user IDs are recognized with a generic final message', async () => {
  const scope = await classifier();
  const result = scope.ua('本轮执行失败', [
    '找不到控件: #profile',
    '身份读取返回不同用户 ID：299、300，无法确认当前账号。',
  ]);
  assert.equal(result.code, 'identity-evidence-conflict');
});

test('diagnostics: terminal selector failure remains authoritative after a past identity conflict', async () => {
  const scope = await classifier();
  const result = scope.ua('找不到控件: #checkin-submit', [
    '身份证据冲突：299、300',
    '已重新核对当前用户 ID 299 与目标用户 ID 299 一致',
  ]);
  assert.equal(result.code, scope.Z.SELECTOR_MISMATCH);
});

test('diagnostics: unconfirmed identity explains credential and ID checks for all login methods', async () => {
  const scope = await classifier();
  const result = scope.ua('个人资料页当前登录的不是账号 3306，已停止签到。');
  assert.equal(result.code, scope.Z.IDENTITY_UNCONFIRMED);
  assert.doesNotMatch(result.detail, /没法自己换号/);
  assert.match(result.detail, /自动换号/);
  assert.match(result.nextActions[0], /当前用户 ID.*目标用户 ID/);
  assert.match(result.nextActions[1], /本账号保存的登录凭据/);
});

test('diagnostics: login and Token identity failures are classified as unconfirmed identity', async () => {
  const scope = await classifier();
  for (const message of [
    '登录身份核验未通过：本账号已绑定用户 ID 299，当前尚未返回用户 ID，已停止签到。',
    'Token 身份尚未确认：当前身份未知，已停止签到。',
    'Token 身份未能确认：第二次登录身份不稳定，已停止签到。',
  ]) {
    const result = scope.ua(message, ['找不到控件: #old-login-button']);
    assert.equal(result.code, scope.Z.IDENTITY_UNCONFIRMED, message);
    assert.match(result.nextActions[0], /当前用户 ID.*目标用户 ID/);
  }
});
