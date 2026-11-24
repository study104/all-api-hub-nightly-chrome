const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const parser = import(
  pathToFileURL(path.resolve(__dirname, '../src/modules/accounts/batch-input.js')).href
);
const siteId = 'site-a';

test('manual batch parses tab-separated account/password/remark and blank lines', async () => {
  const { parseAccountBatch } = await parser;
  const parsed = parseAccountBatch('alice\tsecret-a\t主账号\r\n\r\nbob\tsecret-b\r\n', { siteId });
  assert.deepEqual(parsed.inputs, [
    { siteId, username: 'alice', password: 'secret-a', label: '主账号' },
    { siteId, username: 'bob', password: 'secret-b' },
  ]);
  assert.deepEqual(
    parsed.rows.map((row) => row.line),
    [1, 3],
  );
  assert.equal(parsed.counts.valid, 2);
});

test('CSV handles headers, escaped quotes, commas and preserves password spaces', async () => {
  const { parseAccountBatch } = await parser;
  const parsed = parseAccountBatch(
    '\uFEFF账号,密码,备注\nalice," pass,word ""quoted"" ","主,账号"\nbob,secret,备用',
    { siteId },
  );
  assert.equal(parsed.inputs[0].password, ' pass,word "quoted" ');
  assert.equal(parsed.inputs[0].label, '主,账号');
  assert.equal(parsed.rows[0].line, 2);
  assert.equal(parsed.counts.total, 2);
});

test('uniform password fills missing passwords without overriding row passwords', async () => {
  const { parseAccountBatch } = await parser;
  const parsed = parseAccountBatch('alice\nbob,,备注\ncharlie,own-password', {
    siteId,
    uniformPassword: 'common-secret',
  });
  assert.deepEqual(
    parsed.inputs.map((input) => input.password),
    ['common-secret', 'common-secret', 'own-password'],
  );
  assert.equal(parsed.inputs[1].label, '备注');
});

test('duplicate and existing accounts use current site plus case-insensitive username', async () => {
  const { parseAccountBatch } = await parser;
  const parsed = parseAccountBatch(' Alice ,one\nalice,two\nbob,three\ncharlie,four', {
    siteId,
    accounts: [
      { siteId, username: ' BOB ' },
      { siteId: 'other-site', username: 'charlie' },
    ],
  });
  assert.deepEqual(
    parsed.rows.map((row) => row.status),
    ['valid', 'duplicate', 'existing', 'valid'],
  );
  assert.equal(parsed.counts.skipped, 2);
  assert.deepEqual(
    parsed.inputs.map((input) => input.username),
    ['Alice', 'charlie'],
  );
});

test('invalid first occurrence does not prevent a later valid account from saving', async () => {
  const { parseAccountBatch } = await parser;
  const parsed = parseAccountBatch('alice,\nalice,password', { siteId });
  assert.deepEqual(
    parsed.rows.map((row) => row.status),
    ['invalid', 'valid'],
  );
  assert.equal(parsed.inputs.length, 1);
});

test('missing site, missing username/password and excessive columns cannot be submitted', async () => {
  const { parseAccountBatch } = await parser;
  assert.equal(parseAccountBatch('alice,secret').counts.invalid, 1);
  const parsed = parseAccountBatch(',secret\nalice,\nbob,password,remark,extra', { siteId });
  assert.equal(parsed.counts.invalid, 3);
  assert.deepEqual(parsed.inputs, []);
});

test('structural CSV errors do not echo credentials in diagnostics or preview rows', async () => {
  const { parseAccountBatch } = await parser;
  for (const text of [
    'alice,"super-private-password',
    'alice,"super-private-password"x',
    'alice,super-private-password"bad',
  ]) {
    const parsed = parseAccountBatch(text, { siteId });
    assert.equal(parsed.counts.invalid, 1);
    assert.equal(parsed.inputs.length, 0);
    assert.equal(JSON.stringify(parsed.rows).includes('super-private-password'), false);
  }
});

test('empty input and headers alone have no phantom accounts', async () => {
  const { parseAccountBatch } = await parser;
  assert.equal(parseAccountBatch('\r\n \n\t\n', { siteId }).counts.total, 0);
  assert.equal(parseAccountBatch('账号,密码,备注\n', { siteId }).counts.total, 0);
});
