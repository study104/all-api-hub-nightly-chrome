const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const acorn = require('acorn');
const eslintScope = require('eslint-scope');
const ownership = require('./background-module-map.cjs');

const root = path.resolve(__dirname, '..', '..');
if (!process.argv[2])
  throw new Error('Provide the absolute path of an external background baseline.');
const input = path.resolve(process.argv[2]);
const source = fs.readFileSync(input, 'utf8');
const ast = acorn.parse(source, {
  ecmaVersion: 'latest',
  sourceType: 'script',
  locations: true,
  ranges: true,
});
const originalFunction = ast.body[0].declarations[0].init.callee;
const body = originalFunction.body.body;
const scopeManager = eslintScope.analyze(ast, {
  ecmaVersion: 2025,
  sourceType: 'script',
  optimistic: true,
});
const scope = scopeManager.acquire(originalFunction);
const moduleNames = [
  'accounts',
  'sites',
  'learning',
  'checkin',
  'slider',
  'proxies',
  'records',
  'settings',
  'platform',
  'entry',
];
const capital = (name) => name[0].toUpperCase() + name.slice(1);
const stateName = (name) => `bg${capital(name)}State`;
const initializerName = (name) => `initializeBackground${capital(name)}`;
const messageName = (name) => `handle${capital(name)}Message`;
const mutationName = (name) => `handle${capital(name)}Mutation`;
const filenames = Object.fromEntries(
  moduleNames.map((name) => [
    name,
    name === 'entry'
      ? 'src/entries/background.js'
      : name === 'platform'
        ? 'src/shared/background-platform.js'
        : `src/modules/${name}/service.js`,
  ]),
);
const modules = Object.fromEntries(
  moduleNames.map((name) => [
    name,
    {
      functions: [],
      functionNames: [],
      initializers: [],
      messages: [],
      mutations: [],
    },
  ]),
);
const parents = new Map();
function visit(node, parent, key) {
  if (!node || typeof node !== 'object' || !node.type) return;
  parents.set(node, { parent, key });
  for (const [property, value] of Object.entries(node)) {
    if (['loc', 'range'].includes(property)) continue;
    if (Array.isArray(value)) value.forEach((item) => visit(item, node, property));
    else if (value?.type) visit(value, node, property);
  }
}
visit(ast);
const owners = new Map();
const functionBindings = new Set();
for (const variable of scope.variables) {
  const definition = variable.defs[0];
  if (!definition || variable.name === 'arguments') continue;
  owners.set(variable.name, ownership.ownerFor(variable.name, definition.name.loc.start.line));
  if (definition.type === 'FunctionName') functionBindings.add(variable.name);
}

// Each reference comes from eslint-scope, so parameter/local shadows and property names
// remain untouched. Mutable module bindings use their owner's live state cell.
function render(node, owner) {
  const edits = [];
  for (const variable of scope.variables) {
    const targetOwner = owners.get(variable.name);
    if (!targetOwner) continue;
    for (const reference of variable.references) {
      const identifier = reference.identifier;
      if (identifier.start < node.start || identifier.end > node.end) continue;
      const relation = parents.get(identifier);
      if (relation?.parent?.type === 'VariableDeclarator' && relation.key === 'id') continue;
      if (variable.name === 'z') {
        const member = relation.parent;
        if (member.type !== 'MemberExpression' || member.object !== identifier || member.computed) {
          throw new Error(`Storage access must be a static member at ${identifier.loc.start.line}`);
        }
        const method = member.property.name;
        const methodOwner = ownership.storageMethods[method];
        if (!methodOwner) throw new Error(`Unclassified storage method ${method}`);
        edits.push({
          start: member.start,
          end: member.end,
          text: `${stateName(methodOwner)}.store.${method}`,
        });
        continue;
      }
      if (functionBindings.has(variable.name) && targetOwner === owner) continue;
      let replacement = `${stateName(targetOwner)}.${variable.name}`;
      if (
        relation?.parent?.type === 'Property' &&
        relation.parent.shorthand &&
        relation.key === 'value'
      ) {
        replacement = `${variable.name}: ${replacement}`;
      }
      edits.push({ start: identifier.start, end: identifier.end, text: replacement });
    }
  }
  const unique = [...new Map(edits.map((edit) => [`${edit.start}:${edit.end}`, edit])).values()];
  unique.sort((a, b) => b.start - a.start);
  let result = source.slice(node.start, node.end);
  let last = node.end;
  for (const edit of unique) {
    if (edit.end > last) throw new Error(`Overlapping scoped edits at ${edit.start}`);
    result =
      result.slice(0, edit.start - node.start) + edit.text + result.slice(edit.end - node.start);
    last = edit.start;
  }
  return result;
}

function caseName(node) {
  return node.test?.value ?? node.test?.quasis?.[0]?.value?.cooked;
}
function extractDispatch(node, kind) {
  const statement = node.body.body.find((item) => item.type === 'SwitchStatement');
  for (const branch of statement.cases) {
    const name = caseName(branch);
    if (name === undefined) continue;
    const owner =
      kind === 'messages' ? ownership.messageOwner(name) : ownership.mutationOwner(name);
    modules[owner][kind].push({ name, text: render(branch, owner) });
  }
}

const steps = [];
let step = 0;
function addInitializer(owner, text) {
  modules[owner].initializers.push({ step, text });
  steps.push({ owner, step });
  step++;
}
for (const statement of body) {
  if (statement.type === 'FunctionDeclaration') {
    const name = statement.id.name;
    if (name === 'Gm') {
      extractDispatch(statement, 'messages');
      continue;
    }
    if (name === 'nh') {
      extractDispatch(statement, 'mutations');
      continue;
    }
    const owner = owners.get(name);
    modules[owner].functions.push(render(statement, owner));
    modules[owner].functionNames.push(name);
  } else if (statement.type === 'VariableDeclaration') {
    for (const declaration of statement.declarations) {
      if (declaration.id.type !== 'Identifier') {
        throw new Error('Unexpected top-level destructuring declaration');
      }
      const name = declaration.id.name;
      if (name === 'z') {
        for (const property of declaration.init.properties) {
          const method = property.key.name;
          const owner = ownership.storageMethods[method];
          if (!owner) throw new Error(`Unclassified store method ${method}`);
          addInitializer(
            owner,
            `Object.assign(${stateName(owner)}.store, {${render(property, owner)}});`,
          );
        }
      } else if (declaration.init) {
        const owner = owners.get(name);
        addInitializer(owner, `${stateName(owner)}.${name} = ${render(declaration.init, owner)};`);
      }
    }
  } else if (statement.type !== 'ReturnStatement') {
    const owner = ownership.ownerFor('', statement.loc.start.line);
    addInitializer(owner, render(statement, owner));
  }
}

modules.entry.functions.push(
  `async function Gm(e, i) {
  await bgEntryState.Qp;
  const type = e.type;
  const handler = typeof type === 'string' && Object.hasOwn(backgroundMessageHandlers, type)
    ? backgroundMessageHandlers[type] : undefined;
  return handler ? handler(e, i) : { ok: true };
}`,
  `async function nh(e) {
  const action = e.action;
  const handler = typeof action === 'string' && Object.hasOwn(backgroundMutationHandlers, action)
    ? backgroundMutationHandlers[action] : undefined;
  return handler ? handler(e) : undefined;
}`,
);
modules.entry.functionNames.push('Gm', 'nh');

const publicApis = {
  accounts: `
export const accountService = Object.freeze({
  list: () => bgPlatformState.t.get(bgPlatformState.r.accounts, []),
  add: (...args) => bgAccountsState.store.addAccount(...args),
  addMany: (...args) => bgAccountsState.store.addAccounts(...args),
  update: (...args) => bgAccountsState.store.updateAccount(...args),
  saveSession: (...args) => bgAccountsState.store.saveAccountSession(...args),
  saveIdentity: (...args) => bgAccountsState.store.saveAccountIdentity(...args),
  handleMessage: handleAccountsMessage,
  handleMutation: handleAccountsMutation,
});`,
  sites: `
export const siteService = Object.freeze({
  getConfig: (...args) => Y(...args),
  add: (...args) => bgSitesState.store.addSite(...args),
  addMany: (...args) => bgSitesState.store.addSites(...args),
  update: (...args) => bgSitesState.store.updateSite(...args),
  reorder: (...args) => bgSitesState.store.moveSite(...args),
  handleMessage: handleSitesMessage,
  handleMutation: handleSitesMutation,
});`,
  learning: `
export const learningService = Object.freeze({
  toggle: (...args) => Im(...args),
  cancel: (...args) => Um(...args),
  getState: (...args) => Hm(...args),
  recordEvent: (...args) => Wm(...args),
  recordIdentity: (...args) => recordLearningIdentity(...args),
  handleMessage: handleLearningMessage,
});`,
  checkin: `
export const checkinService = Object.freeze({
  startBatch: (...args) => $m(...args),
  cancel: (...args) => eh(...args),
  getQueue: () => bgCheckinState.Z.snapshot(),
  saveSchedule: (...args) => bgCheckinState.store.updateSchedule(...args),
  handleMessage: handleCheckinMessage,
  handleMutation: handleCheckinMutation,
});`,
  slider: `
// solved:true means a drag was dispatched; the executing page verifies acceptance.
export const sliderService = Object.freeze({
  solve: (...args) => cu(...args),
  handleFrame: (...args) => gu(...args),
  handleMessage: handleSliderMessage,
});`,
  proxies: `
export const proxyService = Object.freeze({
  list: () => bgPlatformState.t.get(bgPlatformState.r.proxies, []),
  add: (...args) => bgProxiesState.store.addProxy(...args),
  importMany: (...args) => bgProxiesState.store.addProxies(...args),
  update: (...args) => bgProxiesState.store.updateProxy(...args),
  remove: (...args) => bgProxiesState.store.removeProxy(...args),
  assignAccounts: (...args) => bgProxiesState.store.assignAccountProxies(...args),
  acquire: (...args) => bgProxiesState.W.acquire(...args),
  transfer: (...args) => bgProxiesState.W.transfer(...args),
  release: (...args) => bgProxiesState.W.release(...args),
  recover: (...args) => bgProxiesState.W.recover(...args),
  handleMessage: handleProxiesMessage,
  handleMutation: handleProxiesMutation,
});`,
  records: `
export const recordService = Object.freeze({
  getResults: () => bgPlatformState.t.get(bgPlatformState.r.results, {}),
  getBalances: () => bgPlatformState.t.get(bgPlatformState.r.balances, {}),
  saveBalance: (...args) => bgRecordsState.store.saveBalance(...args),
  saveReward: (...args) => bgRecordsState.store.saveCheckinReward(...args),
  saveBalanceError: (...args) => bgRecordsState.store.saveBalanceError(...args),
  handleMessage: handleRecordsMessage,
});`,
  settings: `
export const settingsService = Object.freeze({
  getLaunchMode: (...args) => es(...args),
  setLaunchMode: (...args) => bgSettingsState.Zp.submit(...args),
  handleMessage: handleSettingsMessage,
});`,
};

const headers = {
  accounts: '账号管理后台：账号保存、批量添加、身份绑定、登录态与凭据。',
  sites: '站点管理后台：内置适配、配置校验、站点保存与学习流程配置。',
  learning: '学习签到后台：录制会话、步骤生成、路线学习与目标账号身份观察。',
  checkin: '签到执行后台：串行队列、任务、定时计划、身份闸门、取消与恢复。',
  slider: '滑块验证后台：图片匹配、拖动轨迹、验证码框架会话及失败回报。',
  proxies: '代理管理后台：导入、Clash、订阅、出口分配和浏览器代理租约。',
  records: '记录统计后台：余额、奖励、快照、手动完成依据和执行结果采集。',
  settings: '设置后台：管理页/侧栏打开方式与设置请求；备份处理在同模块界面。',
  platform: '共用后台平台：Chrome 存储、串行事务、可信指针与标签页薄适配。',
  entry: '后台入口：连接功能模块、消息路由、启动初始化和跨模块变更编排。',
};

for (const owner of moduleNames) {
  const module = modules[owner];
  let text = `/** ${headers[owner]} */\n`;
  const sections = [
    module.functions.join('\n\n'),
    ...['messages', 'mutations'].map((kind) => {
      const name = kind === 'messages' ? messageName(owner) : mutationName(owner);
      const input = kind === 'messages' ? 'e, i' : 'e';
      const key = kind === 'messages' ? 'e.type' : 'e.action';
      return `export async function ${name}(${input}) {
  switch (${key}) {
    ${module[kind].map((branch) => branch.text).join('\n')}
  }
}`;
    }),
    `export function ${initializerName(owner)}(step) {
  switch (step) {
    ${module.initializers.map(({ step, text }) => `case ${step}: { ${text} break; }`).join('\n')}
  }
}`,
    publicApis[owner] || '',
  ];
  if (owner === 'entry') {
    const messageMap = moduleNames.flatMap((name) =>
      modules[name].messages.map(
        (branch) => `${JSON.stringify(branch.name)}: ${messageName(name)}`,
      ),
    );
    const mutationMap = moduleNames.flatMap((name) =>
      modules[name].mutations.map(
        (branch) => `${JSON.stringify(branch.name)}: ${mutationName(name)}`,
      ),
    );
    sections.push(
      `const backgroundMessageHandlers = { ${messageMap.join(',\n')} };`,
      `const backgroundMutationHandlers = { ${mutationMap.join(',\n')} };`,
      `let backgroundStarted = false;
export function startBackground() {
  if (backgroundStarted) return bgEntryState.Rh;
  backgroundStarted = true;
  ${steps.map(({ owner, step }) => `${initializerName(owner)}(${step});`).join('\n')}
  return bgEntryState.Rh;
}
startBackground();`,
    );
  }
  const combined = sections.join('\n\n');
  for (const dependency of moduleNames) {
    if (dependency === owner) continue;
    const imports = [
      stateName(dependency),
      ...(owner === 'entry'
        ? [initializerName(dependency), messageName(dependency), mutationName(dependency)]
        : []),
    ].filter((name) => combined.includes(name));
    if (!imports.length) continue;
    let relative = path.posix.relative(path.posix.dirname(filenames[owner]), filenames[dependency]);
    if (!relative.startsWith('.')) relative = `./${relative}`;
    text += `import { ${imports.join(', ')} } from ${JSON.stringify(relative)};\n`;
  }
  text += `\nexport const ${stateName(owner)} = { store: {} };\n\n`;
  text += module.functions.join('\n\n') + '\n\n';
  text += `Object.assign(${stateName(owner)}, {${module.functionNames.join(', ')}});\n\n`;
  text += sections.slice(1).join('\n\n') + '\n';
  const filename = path.join(root, filenames[owner]);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, text);
  acorn.parse(text, { ecmaVersion: 'latest', sourceType: 'module' });
  console.log(
    `${owner}: ${module.functions.length} functions, ${module.initializers.length} initialization steps, ${module.messages.length} message cases`,
  );
}

// Reversing the scoped access syntax must recover every original function/method AST.
// This verifies extraction independently from the browser smoke and behavior tests.
const stateIdentifiers = new Set(moduleNames.map(stateName));
function comparable(node) {
  if (Array.isArray(node)) return node.map(comparable);
  if (!node || typeof node !== 'object') return node;
  if (
    node.type === 'MemberExpression' &&
    !node.computed &&
    node.object.type === 'MemberExpression' &&
    stateIdentifiers.has(node.object.object?.name) &&
    node.object.property?.name === 'store'
  ) {
    return comparable({
      ...node,
      object: { type: 'Identifier', name: 'z' },
    });
  }
  if (
    node.type === 'MemberExpression' &&
    !node.computed &&
    stateIdentifiers.has(node.object.name)
  ) {
    return { type: 'Identifier', name: node.property.name };
  }
  return Object.fromEntries(
    Object.entries(node)
      .filter(([key]) => !['start', 'end', 'loc', 'range', 'raw', 'shorthand'].includes(key))
      .map(([key, value]) => [key, comparable(value)]),
  );
}
const migratedFunctions = new Map();
const migratedMethods = new Map();
const migratedCases = { Gm: new Map(), nh: new Map() };
for (const filename of Object.values(filenames)) {
  const parsed = acorn.parse(fs.readFileSync(path.join(root, filename), 'utf8'), {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });
  for (const node of parsed.body) {
    if (node.type === 'FunctionDeclaration') migratedFunctions.set(node.id.name, node);
    if (
      node.type === 'ExportNamedDeclaration' &&
      node.declaration?.type === 'FunctionDeclaration'
    ) {
      const declaration = node.declaration;
      const kind = declaration.id.name.endsWith('Message')
        ? 'Gm'
        : declaration.id.name.endsWith('Mutation')
          ? 'nh'
          : null;
      if (kind) {
        const statement = declaration.body.body.find((item) => item.type === 'SwitchStatement');
        for (const branch of statement.cases) {
          migratedCases[kind].set(caseName(branch), branch);
        }
      }
    }
  }
  function collectMethods(node) {
    if (!node || typeof node !== 'object') return;
    if (
      node.type === 'CallExpression' &&
      node.callee.object?.name === 'Object' &&
      node.callee.property?.name === 'assign' &&
      node.arguments[0]?.object?.name &&
      stateIdentifiers.has(node.arguments[0].object.name) &&
      node.arguments[0].property?.name === 'store'
    ) {
      for (const property of node.arguments[1]?.properties ?? []) {
        migratedMethods.set(property.key.name, property);
      }
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(collectMethods);
      else if (value && typeof value === 'object') collectMethods(value);
    }
  }
  collectMethods(parsed);
}
let verifiedFunctions = 0;
let verifiedCases = 0;
for (const original of body) {
  if (original.type !== 'FunctionDeclaration') continue;
  if (['Gm', 'nh'].includes(original.id.name)) {
    const statement = original.body.body.find((node) => node.type === 'SwitchStatement');
    for (const branch of statement.cases) {
      const name = caseName(branch);
      if (name === undefined) continue;
      assert.deepEqual(
        comparable(migratedCases[original.id.name].get(name)),
        comparable(branch),
        `Message extraction changed ${name}`,
      );
      verifiedCases++;
    }
    continue;
  }
  assert.deepEqual(
    comparable(migratedFunctions.get(original.id.name)),
    comparable(original),
    `Function extraction changed ${original.id.name}`,
  );
  verifiedFunctions++;
}
const originalStore = body
  .flatMap((node) => node.declarations ?? [])
  .find((node) => node.id.name === 'z').init;
for (const property of originalStore.properties) {
  assert.deepEqual(
    comparable(migratedMethods.get(property.key.name)),
    comparable(property),
    `Storage extraction changed ${property.key.name}`,
  );
}
console.log(
  `Verified ${verifiedFunctions} original function ASTs, ${originalStore.properties.length} storage method ASTs and ${verifiedCases} message/mutation case ASTs.`,
);
