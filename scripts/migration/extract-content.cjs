/**
 * 一次性从尚未迁移的发布脚本提取功能源码。
 *
 * 用法：node scripts/migration/extract-content.cjs [包含原发布文件的目录]
 * 正常构建直接使用 src，不再次运行此脚本。
 */
const fs = require('node:fs');
const path = require('node:path');
const acorn = require('acorn');
const eslintScope = require('eslint-scope');
const prettier = require('prettier');
const mappings = require('./content-module-map.cjs');

const workspace = path.resolve(__dirname, '..', '..');
if (!process.argv[2])
  throw new Error('Provide an external directory containing the original content scripts.');
const sourceRoot = path.resolve(process.argv[2]);
const scopeName = '__contentScope';
const stateName = '__contentState';

function visit(node, parents, parent = null) {
  if (!node || typeof node.type !== 'string') return;
  if (parent) parents.set(node, parent);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const child of value) visit(child, parents, node);
    } else if (value && typeof value.type === 'string') {
      visit(value, parents, node);
    }
  }
}

function declarationsOf(statement) {
  if (statement.type === 'FunctionDeclaration') return [statement];
  if (statement.type === 'VariableDeclaration') return statement.declarations;
  return [];
}

function parseScope(config, kind) {
  const filename = path.join(sourceRoot, config.source);
  const source = fs.readFileSync(filename, 'utf8');
  const ast = acorn.parse(source, {
    ecmaVersion: 'latest',
    sourceType: 'script',
    ranges: true,
    locations: true,
  });
  const wrapper = ast.body.find((statement) => statement.type === 'ExpressionStatement')?.expression
    ?.callee;
  if (wrapper?.type !== 'FunctionExpression') {
    throw new Error(`${filename} 不是原始发布脚本；请传入未迁移发布文件的目录。`);
  }
  const statements = wrapper.body.body;
  const declarations = statements.flatMap(declarationsOf);
  if (declarations.some((declaration) => declaration.id.type !== 'Identifier')) {
    throw new Error('发现顶层解构声明，需要显式迁移后再继续。');
  }
  const names = declarations.map((declaration) => declaration.id.name);
  if (new Set(names).size !== names.length) {
    throw new Error('发现重复顶层声明，需要保持覆盖顺序的显式迁移。');
  }
  if (names.includes(scopeName) || names.includes(stateName)) {
    throw new Error('原脚本占用了迁移作用域名。');
  }
  const ownerOf = Object.fromEntries(names.map((name) => [name, config.defaultOwner]));
  for (const range of config.ranges) {
    const start = names.indexOf(range.from);
    const end = names.indexOf(range.to);
    if (start < 0 || end < start) throw new Error(`模块范围不存在：${range.from} → ${range.to}`);
    for (const name of names.slice(start, end + 1)) ownerOf[name] = range.owner;
  }
  for (const [name, owner] of Object.entries(config.overrides)) {
    if (!names.includes(name)) throw new Error(`覆盖声明不存在：${name}`);
    ownerOf[name] = owner;
  }

  const manager = eslintScope.analyze(ast, {
    ecmaVersion: 2024,
    sourceType: 'script',
    fallback: 'iteration',
  });
  const lexicalScope = manager.acquire(wrapper);
  const parents = new Map();
  visit(ast, parents);
  const edits = new Map();
  for (const variable of lexicalScope.variables) {
    if (variable.name === 'arguments') continue;
    if (!Object.hasOwn(ownerOf, variable.name)) {
      throw new Error(`未归属的顶层绑定：${variable.name}`);
    }
    for (const reference of variable.references) {
      const identifier = reference.identifier;
      const parent = parents.get(identifier);
      let replacement = `${scopeName}.${identifier.name}`;
      if (
        (parent?.type === 'CallExpression' && parent.callee === identifier) ||
        (parent?.type === 'TaggedTemplateExpression' && parent.tag === identifier)
      ) {
        // 原来的 identifier 调用没有对象 receiver，保持其 this 行为。
        replacement = `(0, ${replacement})`;
      } else if (parent?.type === 'Property' && parent.shorthand && parent.value === identifier) {
        replacement = `${identifier.name}: ${replacement}`;
      } else if (parent?.type === 'UnaryExpression' && parent.operator === 'delete') {
        throw new Error('发现删除顶层绑定的操作，需要显式迁移。');
      }
      edits.set(identifier.start, { start: identifier.start, end: identifier.end, replacement });
    }
  }

  function rewritten(node) {
    const replacements = [...edits.values()]
      .filter((edit) => edit.start >= node.start && edit.end <= node.end)
      .sort((left, right) => right.start - left.start);
    let text = source.slice(node.start, node.end);
    for (const edit of replacements) {
      const start = edit.start - node.start;
      const end = edit.end - node.start;
      text = text.slice(0, start) + edit.replacement + text.slice(end);
    }
    return text;
  }

  const groups = Object.fromEntries(
    ['shared', 'learning', 'checkin', 'slider'].map((owner) => [
      owner,
      { names: [], functions: [], registrations: [], initializers: [] },
    ]),
  );
  for (const name of names) groups[ownerOf[name]].names.push(name);
  let order = 0;
  let lastOwner = config.defaultOwner;
  let startup;
  for (const statement of statements) {
    if (statement.type === 'FunctionDeclaration') {
      const name = statement.id.name;
      const owner = ownerOf[name];
      const declarationName = kind === 'sliderFrame' ? `frame_${name}` : name;
      let text = rewritten(statement);
      if (declarationName !== name) {
        const offset = statement.id.start - statement.start;
        text = text.slice(0, offset) + declarationName + text.slice(offset + name.length);
      }
      groups[owner].functions.push(text);
      groups[owner].registrations.push(`${stateName}.${name} = ${declarationName};`);
      lastOwner = owner;
    } else if (statement.type === 'VariableDeclaration') {
      if (statement.kind !== 'var') throw new Error('需要显式迁移顶层块级声明的暂时性死区。');
      for (const declaration of statement.declarations) {
        const owner = ownerOf[declaration.id.name];
        if (declaration.init) {
          groups[owner].initializers.push({
            order: order++,
            code: `${stateName}.${declaration.id.name} = ${rewritten(declaration.init)};`,
          });
        }
        lastOwner = owner;
      }
    } else if (statement.type === 'ReturnStatement') {
      startup = rewritten(statement.argument);
    } else {
      // 原繁简表的 for-of 修改归通用文本支持，其它副作用跟随所属声明。
      const owner =
        kind === 'autoLogin' && statement.type === 'ForOfStatement' ? 'shared' : lastOwner;
      groups[owner].initializers.push({ order: order++, code: rewritten(statement) });
    }
  }
  if (!startup) throw new Error('未找到内容脚本启动返回值。');
  return { groups, startup, bindingCount: names.length, initializerCount: order };
}

const headers = {
  learning: '学习签到内容逻辑：安全动作录制、页面引导、用户 ID 观察和学习事件回报。',
  checkin: '签到执行内容逻辑：登录、身份闸门、工作流回放、签到确认和任务进度。',
  slider: '滑块验证内容逻辑：验证码定位、框架会话、图片取样、拖动和页面终态确认。',
  shared: '内容脚本通用支持：DOM、文本、可信指针、消息超时和扩展生命周期。',
};

function capabilityCode(owner, kind) {
  if (kind === 'sliderFrame') {
    if (owner !== 'slider') return '{}';
    return `{
      solve(log, sessionId, deadline) { return (0, ${scopeName}.jt)(log, sessionId, deadline); },
      install() { return ${scopeName}.Mt.main(); }
    }`;
  }
  const capabilities = {
    learning: `{
      startRecording(session) { return (0, ${scopeName}.Ug)(session); },
      stopRecording() { return (0, ${scopeName}.Hg)(); },
      createIdentityMonitor(send) { return (0, ${scopeName}.createLearningIdentityMonitor)(send); },
      createRecorder(...args) { return (0, ${scopeName}.zg)(...args); }
    }`,
    checkin: `{
      runTask(task, callbacks) { return (0, ${scopeName}.hh)(task, callbacks); },
      compareIdentity(...args) { return (0, ${scopeName}.Zi)(...args); },
      install() { return ${scopeName}.Gg.main(); }
    }`,
    slider: `{
      solve(log) { return (0, ${scopeName}.Sc)(log); },
      solveTencent(log) { return (0, ${scopeName}.Cc)(log); },
      solveFrame(...args) { return (0, ${scopeName}.Ul)(...args); },
      resolveChallenge(...args) { return (0, ${scopeName}.zu)(...args); }
    }`,
  };
  return capabilities[owner] ?? '{}';
}

function factoryCode(owner, kind, group) {
  if (!group.names.length && !group.initializers.length) return '';
  const suffix = kind === 'autoLogin' ? 'Auto' : 'Frame';
  const factory = `create${owner[0].toUpperCase()}${owner.slice(1)}${suffix}Content`;
  return `
    /** ${headers[owner]} ${kind === 'sliderFrame' ? '验证码子框架独立作用域。' : ''} */
    export function ${factory}(${scopeName}) {
      const ${stateName} = bindContentState(${scopeName}, ${JSON.stringify(group.names)});
      ${group.functions.join('\n\n')}
      ${group.registrations.join('\n')}
      return {
        state: ${stateName},
        api: ${capabilityCode(owner, kind)},
        initializers: [
          ${group.initializers
            .map((step) => `{ order: ${step.order}, run() { ${step.code} } }`)
            .join(',\n')}
        ]
      };
    }
  `;
}

function entryCode(kind, parsed) {
  const frame = kind === 'sliderFrame';
  const suffix = frame ? 'Frame' : 'Auto';
  const featureOwners = frame ? ['slider'] : ['learning', 'checkin', 'slider'];
  const publicName = frame ? 'SliderCaptchaFrame' : 'AutoLogin';
  return `
    import { initializeContentModules } from '../shared/content-runtime.js';
    import { createShared${suffix}Content } from '../shared/content-support.js';
    ${featureOwners
      .map(
        (owner) =>
          `import { create${owner[0].toUpperCase()}${owner.slice(1)}${suffix}Content } from '../modules/${owner}/content.js';`,
      )
      .join('\n')}
    export function create${publicName}Runtime() {
      const ${scopeName} = Object.create(null);
      const modules = {
        shared: createShared${suffix}Content(${scopeName}),
        ${featureOwners
          .map(
            (owner) =>
              `${owner}: create${owner[0].toUpperCase()}${owner.slice(1)}${suffix}Content(${scopeName})`,
          )
          .join(',\n')}
      };
      let initialized = false;
      return {
        scope: ${scopeName},
        modules,
        initialize() {
          if (!initialized) {
            initializeContentModules(modules);
            initialized = true;
          }
          return this;
        },
        start() {
          this.initialize();
          return ${parsed.startup};
        }
      };
    }
    export function start${publicName}() {
      return create${publicName}Runtime().start();
    }
    start${publicName}();
  `;
}

async function writeSource(relative, code) {
  const target = path.join(workspace, relative);
  if (!target.startsWith(workspace + path.sep)) throw new Error('输出目录越界。');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const configuration = await prettier.resolveConfig(workspace);
  const formatted = await prettier.format(code, {
    ...configuration,
    filepath: target,
    parser: 'babel',
  });
  fs.writeFileSync(target, formatted);
}

async function main() {
  const parsed = Object.fromEntries(
    Object.entries(mappings).map(([kind, config]) => [kind, parseScope(config, kind)]),
  );
  for (const owner of ['shared', 'learning', 'checkin', 'slider']) {
    const relative =
      owner === 'shared' ? 'src/shared/content-support.js' : `src/modules/${owner}/content.js`;
    const runtime =
      owner === 'shared'
        ? "import { bindContentState } from './content-runtime.js';"
        : "import { bindContentState } from '../../shared/content-runtime.js';";
    await writeSource(
      relative,
      runtime +
        '\n' +
        Object.entries(parsed)
          .map(([kind, value]) => factoryCode(owner, kind, value.groups[owner]))
          .join('\n'),
    );
  }
  await writeSource('src/entries/auto-login.js', entryCode('autoLogin', parsed.autoLogin));
  await writeSource(
    'src/entries/slider-captcha-frame.js',
    entryCode('sliderFrame', parsed.sliderFrame),
  );
  for (const [kind, value] of Object.entries(parsed)) {
    console.log(
      `${kind}: ${value.bindingCount} 个绑定，${value.initializerCount} 个按序初始化步骤；` +
        Object.entries(value.groups)
          .filter(([, group]) => group.names.length)
          .map(([owner, group]) => `${owner} ${group.names.length} 个绑定`)
          .join('，'),
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
