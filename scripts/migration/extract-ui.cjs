const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const acorn = require('acorn');
const eslintScope = require('eslint-scope');
const prettier = require('prettier');
const { ownerFor, propertyOwners, publicAliases, publicApis } = require('./ui-module-map.cjs');

const root = path.resolve(__dirname, '..', '..');
if (!process.argv[2])
  throw new Error('Provide an external directory containing the original UI chunks.');
const sourceRoot = path.resolve(process.argv[2]);
const moduleNames = ['accounts', 'sites', 'learning', 'checkin', 'proxies', 'records', 'settings'];
const outputs = new Map();
const report = { inputs: {}, scopes: {}, modules: {} };
const descriptions = {
  accounts: '账号列表、保存、批量 CSV 导入、凭据与归属恢复',
  sites: '站点配置、书签导入、适配校验与站点视图',
  learning: '学习流程校验、录制结果说明与签到流程配置',
  checkin: '签到状态、执行队列、运行进度与定时配置',
  proxies: '代理管理、订阅导入、出口测试与账号代理分配',
  records: '执行记录、失败说明、余额汇总与余额历史',
  settings: '打开方式、备份加解密与迁移匹配',
  entry: '管理应用编排和跨功能数据快照',
  shared: 'React 运行引用、消息适配和公共界面',
  motion: '打包依赖：Motion、Lucide 和 Zustand 运行实现',
  search: '打包依赖：拼音、排序和搜索运行实现',
};

function outputFor(owner) {
  if (moduleNames.includes(owner)) return `src/modules/${owner}/view.js`;
  if (owner === 'entry') return 'src/entries/management-app.js';
  if (owner === 'shared') return 'src/shared/ui-runtime.js';
  return `src/vendor/ui-${owner}-runtime.js`;
}

function walk(node, parent, visit) {
  if (!node || typeof node !== 'object') return;
  if (node.type) visit(node, parent);
  for (const [key, value] of Object.entries(node)) {
    if (['loc', 'range', 'start', 'end'].includes(key)) continue;
    if (Array.isArray(value)) for (const child of value) walk(child, node, visit);
    else if (value && typeof value === 'object') walk(value, node, visit);
  }
}

function declaredNames(pattern) {
  if (pattern.type === 'Identifier') return [pattern.name];
  if (pattern.type === 'ObjectPattern') {
    return pattern.properties.flatMap((property) =>
      declaredNames(property.type === 'RestElement' ? property.argument : property.value),
    );
  }
  if (pattern.type === 'ArrayPattern')
    return pattern.elements.filter(Boolean).flatMap(declaredNames);
  if (pattern.type === 'RestElement') return declaredNames(pattern.argument);
  if (pattern.type === 'AssignmentPattern') return declaredNames(pattern.left);
  throw new Error(`Unsupported top-level pattern ${pattern.type}`);
}

function addOutput(filename, content) {
  outputs.set(filename, (outputs.get(filename) ?? '') + content + '\n');
}

function extract(scopeName, filename) {
  const source = fs.readFileSync(path.join(sourceRoot, filename), 'utf8');
  const ast = acorn.parse(source, {
    sourceType: 'module',
    ecmaVersion: 'latest',
    locations: true,
    ranges: true,
  });
  const manager = eslintScope.analyze(ast, {
    sourceType: 'module',
    ecmaVersion: 2022,
    optimistic: true,
    ignoreEval: true,
  });
  const moduleScope = manager.scopes.find((scope) => scope.type === 'module');
  const variables = new Set(moduleScope.variables);
  const parents = new Map();
  walk(ast, null, (node, parent) => parents.set(node, parent));
  const references = new Map();
  for (const lexicalScope of manager.scopes) {
    for (const reference of lexicalScope.references) {
      if (!variables.has(reference.resolved)) continue;
      const identifier = reference.identifier;
      const parent = parents.get(identifier);
      let replacement = `scope.${identifier.name}`;
      if (
        (parent?.type === 'CallExpression' && parent.callee === identifier) ||
        (parent?.type === 'TaggedTemplateExpression' && parent.tag === identifier)
      ) {
        replacement = `(0, ${replacement})`;
      } else if (parent?.type === 'Property' && parent.shorthand) {
        replacement = `${identifier.name}: ${replacement}`;
      }
      references.set(identifier.start, {
        start: identifier.start,
        end: identifier.end,
        replacement,
      });
    }
  }
  const edits = [...references.values()].sort((left, right) => right.start - left.start);
  function rewrite(node) {
    let result = source.slice(node.start, node.end);
    for (const edit of edits) {
      if (edit.start < node.start || edit.end > node.end) continue;
      const start = edit.start - node.start;
      const end = edit.end - node.start;
      result = result.slice(0, start) + edit.replacement + result.slice(end);
    }
    return result;
  }

  const owners = {};
  function owned(owner) {
    return (owners[owner] ??= { names: [], functions: [], steps: [], storeFactories: [] });
  }
  const initializationOrder = [];
  function step(owner, code) {
    const list = owned(owner).steps;
    initializationOrder.push([owner, list.length]);
    list.push(code);
  }
  function extractStoreObject(group, object, captures) {
    const properties = object.properties.map((property) => {
      const name = property.key?.name ?? property.key?.value;
      const owner = propertyOwners[name];
      if (!property.method || !owner) return rewrite(property);
      const factory = `store_${group}_${name}`;
      const parameters = ['scope', ...captures].join(', ');
      owned(owner).storeFactories.push(
        `${factory}(${parameters}) { return { ${rewrite(property)} }; }`,
      );
      return `...modules.${owner}.storeProperties.${factory}(scope${captures.length ? ', ' + captures.join(', ') : ''})`;
    });
    return `{${properties.join(',\n')}}`;
  }

  for (const node of ast.body) {
    if (node.type === 'FunctionDeclaration') {
      const name = node.id.name;
      const owner = ownerFor(scopeName, node, name);
      owned(owner).names.push(name);
      owned(owner).functions.push(`scope.${name} = ${rewrite(node)};`);
    } else if (node.type === 'VariableDeclaration') {
      for (const declaration of node.declarations) {
        const names = declaredNames(declaration.id);
        const owner = ownerFor(scopeName, declaration, names[0]);
        owned(owner).names.push(...names);
        if (!declaration.init) continue;
        let initializer = rewrite(declaration.init);
        if (scopeName === 'app' && declaration.id.name === 'Li') {
          initializer = extractStoreObject('Li', declaration.init, []);
        } else if (scopeName === 'app' && declaration.id.name === 'Ui') {
          const factory = declaration.init.arguments[0];
          const parameters = factory.params.map((parameter) =>
            source.slice(parameter.start, parameter.end),
          );
          const object = extractStoreObject('Ui', factory.body, parameters);
          initializer = `(0, scope.Nt)((${parameters.join(', ')}) => (${object}))`;
        }
        if (declaration.id.type === 'Identifier') {
          step(owner, `scope.${declaration.id.name} = ${initializer};`);
        } else {
          step(owner, `(${rewrite(declaration.id)} = ${initializer});`);
        }
      }
    } else if (node.type === 'ExpressionStatement') {
      step(ownerFor(scopeName, node, 'side-effect'), rewrite(node));
    } else if (!['ImportDeclaration', 'ExportNamedDeclaration'].includes(node.type)) {
      throw new Error(`Unsupported top-level UI statement: ${node.type}`);
    }
  }

  for (const [owner, data] of Object.entries(owners)) {
    const aliases = publicAliases[owner]?.[scopeName] ?? {};
    for (const name of Object.keys(aliases)) {
      if (!data.names.includes(name))
        throw new Error(`Alias ${owner}:${scopeName}:${name} has wrong owner`);
    }
    const declarations = Object.values(aliases).length
      ? `export let ${Object.values(aliases).join(', ')};`
      : '';
    const publish = Object.entries(aliases).length
      ? `publish(name, value) { switch (name) { ${Object.entries(aliases)
          .map(([name, alias]) => `case ${JSON.stringify(name)}: ${alias} = value; break;`)
          .join('\n')} } },`
      : '';
    const runtime = `${scopeName}Runtime`;
    const content = `
// ${descriptions[owner]} — ${scopeName} published scope.
${declarations}
export const ${runtime} = createUiModuleRuntime({
  bindingNames: ${JSON.stringify(data.names)},
  ${publish}
  register(scope) {
    ${data.functions.join('\n')}
  },
  initialize(scope, step, modules) {
    switch (step) {
      ${data.steps.map((code, index) => `case ${index}: { ${code} break; }`).join('\n')}
    }
  },
  storeProperties: {
    ${data.storeFactories.join(',\n')}
  },
});
`;
    addOutput(outputFor(owner), content);
    if (scopeName === 'app' && publicApis[owner]) {
      addOutput(outputFor(owner), publicApis[owner]);
    }
    report.modules[owner] ??= { bindings: 0, functions: 0, initializers: 0, storeMethods: 0 };
    report.modules[owner].bindings += data.names.length;
    report.modules[owner].functions += data.functions.length;
    report.modules[owner].initializers += data.steps.length;
    report.modules[owner].storeMethods += data.storeFactories.length;
  }

  const orchestrator =
    scopeName === 'app' ? 'src/entries/management-app.js' : 'src/shared/ui-components.js';
  const orchestratorDirectory = path.posix.dirname(orchestrator);
  function relativeImport(file) {
    let relative = path.posix.relative(orchestratorDirectory, file);
    if (!relative.startsWith('.')) relative = './' + relative;
    return relative;
  }
  const originalImports = ast.body.filter((node) => node.type === 'ImportDeclaration');
  const dependencies = {
    './react-dom-and-shared-icons.js': 'src/vendor/react-dom-and-shared-icons.js',
    './ui-components-and-motion.js': 'src/shared/ui-components.js',
    './action-icons.js': 'src/vendor/action-icons.js',
  };
  const importText = originalImports
    .map((node) => {
      const dependency = dependencies[node.source.value];
      if (!dependency) throw new Error(`Unknown baseline UI import ${node.source.value}`);
      return (
        source.slice(node.start, node.source.start) +
        JSON.stringify(relativeImport(dependency)) +
        source.slice(node.source.end, node.end)
      );
    })
    .join('\n');
  const importedNames = originalImports.flatMap((node) =>
    node.specifiers.map((specifier) => specifier.local.name),
  );
  const ownerImports = Object.keys(owners)
    .filter((owner) => owner !== 'entry')
    .map(
      (owner) =>
        `import { ${scopeName}Runtime as ${owner}Runtime } from ${JSON.stringify(relativeImport(outputFor(owner)))};`,
    )
    .join('\n');
  const exported = ast.body
    .filter((node) => node.type === 'ExportNamedDeclaration')
    .flatMap((node) => node.specifiers);
  const exportDeclarations =
    scopeName === 'app'
      ? 'export let ManagementApp;\nexport { ManagementApp as t };'
      : `let ${exported.map((specifier) => `uiExport_${specifier.exported.name}`).join(', ')};\n` +
        `export { ${exported.map((specifier) => `uiExport_${specifier.exported.name} as ${specifier.exported.name}`).join(', ')} };`;
  const exportSetters = exported
    .map(
      (specifier) =>
        `${JSON.stringify(specifier.local.name)}: (value) => { ${scopeName === 'app' ? 'ManagementApp' : `uiExport_${specifier.exported.name}`} = value; }`,
    )
    .join(',\n');
  const runtimeNames = Object.keys(owners)
    .map(
      (owner) =>
        `${JSON.stringify(owner)}: ${owner === 'entry' ? `${scopeName}Runtime` : `${owner}Runtime`}`,
    )
    .join(',\n');
  const setup = `
${importText}
${ownerImports}
${exportDeclarations}
const ${scopeName}Modules = { ${runtimeNames} };
const ${scopeName}Scope = createUiScope(
  ${scopeName}Modules,
  { ${importedNames.map((name) => `get ${name}() { return ${name}; }`).join(',\n')} },
  { ${exportSetters} },
);
initializeUiScope(${scopeName}Scope, ${scopeName}Modules, ${JSON.stringify(initializationOrder)});
`;
  addOutput(orchestrator, setup);
  report.inputs[filename] = crypto.createHash('sha256').update(source).digest('hex');
  report.scopes[scopeName] = {
    bindings: Object.values(owners).reduce((count, owner) => count + owner.names.length, 0),
    rewrittenReferences: references.size,
    initializationSteps: initializationOrder.length,
  };
}

async function main() {
  extract('sharedUi', 'chunks/ui-components-and-motion.js');
  extract('app', 'chunks/checkin-manager-app.js');
  for (const [filename, body] of outputs) {
    const helper = path.posix.relative(path.posix.dirname(filename), 'src/shared/ui-scope.js');
    const importPath = helper.startsWith('.') ? helper : './' + helper;
    const source =
      `/** ${filename}: 功能模块实现，保留发布版本的符号以便逐步恢复命名。 */\n` +
      `import { createUiModuleRuntime, createUiScope, initializeUiScope } from ${JSON.stringify(importPath)};\n` +
      body;
    const formatted = await prettier.format(source, {
      parser: 'babel',
      ...(await prettier.resolveConfig(path.join(root, filename))),
    });
    const target = path.resolve(root, filename);
    if (!target.startsWith(root + path.sep)) throw new Error('UI output escaped workspace');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, formatted);
  }
  for (const name of ['react-dom-and-shared-icons.js', 'action-icons.js']) {
    const destination = path.join(root, 'src', 'vendor', name);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(sourceRoot, 'chunks', name), destination);
  }
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
