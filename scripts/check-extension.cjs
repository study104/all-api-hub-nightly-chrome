const fs = require('node:fs');
const path = require('node:path');
const acorn = require('acorn');

const workspace = path.resolve(__dirname, '..');
const roots = [path.join(workspace, 'output', 'chrome-mv3')];
const resourceDirectories = ['background', 'chunks', 'content-scripts', 'opencv', 'assets', 'icon'];
const errors = [];
const expectedModules = [
  'accounts',
  'sites',
  'learning',
  'checkin',
  'slider',
  'proxies',
  'records',
  'settings',
];

function filesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(filename) : [filename];
  });
}

function staticString(node) {
  if (node?.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node?.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis[0].value.cooked;
  }
  return null;
}

function propertyName(node) {
  return node?.computed ? staticString(node.property) : node?.property?.name;
}

function checkSources() {
  const sourceRoot = path.join(workspace, 'src');
  const moduleRoot = path.join(sourceRoot, 'modules');
  const actualModules = fs
    .readdirSync(moduleRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  if (JSON.stringify(actualModules) !== JSON.stringify([...expectedModules].sort())) {
    errors.push(`src/modules 必须只包含约定的 8 个功能模块，实际为 ${actualModules.join(', ')}`);
  }
  for (const name of expectedModules) {
    const required = ['service.js'];
    if (name !== 'slider') required.push('view.js');
    if (['learning', 'checkin', 'slider'].includes(name)) required.push('content.js');
    for (const basename of required) {
      const filename = path.join(moduleRoot, name, basename);
      if (!fs.existsSync(filename)) errors.push(`功能模块缺少实现：${name}/${basename}`);
    }
  }
  let count = 0;
  for (const filename of filesIn(sourceRoot).filter((name) => name.endsWith('.js'))) {
    count++;
    try {
      const ast = acorn.parse(fs.readFileSync(filename, 'utf8'), {
        ecmaVersion: 'latest',
        sourceType: 'module',
      });
      for (const node of ast.body) {
        if (!node.source?.value) continue;
        const target = node.source.value;
        if (
          target.startsWith('.') &&
          !fs.existsSync(path.resolve(path.dirname(filename), target))
        ) {
          errors.push(`${path.relative(workspace, filename)} 引用了不存在的源码模块 ${target}`);
        }
      }
    } catch (error) {
      errors.push(`${path.relative(workspace, filename)} 语法错误：${error.message}`);
    }
  }
  const metadataPath = path.join(roots[0], 'build-meta.json');
  if (!fs.existsSync(metadataPath)) {
    errors.push('没有构建信息；请先运行 npm run build。');
  } else {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const inputs = Object.keys(metadata.inputs).map((name) => name.replaceAll('\\', '/'));
    for (const name of expectedModules) {
      if (!inputs.some((input) => input.startsWith(`src/modules/${name}/`))) {
        errors.push(`构建产物没有使用 ${name} 模块。`);
      }
    }
    for (const input of inputs) {
      if (!input.startsWith('src/')) errors.push(`构建仍依赖 src 之外的业务文件：${input}`);
    }
  }
  console.log(`src/: 已检查 ${count} 个源码文件和 8 个功能模块的实现及构建输入。`);
}

function checkRoot(root) {
  const label = path.relative(workspace, root) || '项目根目录';
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  const files = [
    ...fs
      .readdirSync(root)
      .filter((name) => /\.(js|css|html)$/.test(name))
      .map((name) => path.join(root, name)),
    ...resourceDirectories.flatMap((name) => {
      const directory = path.join(root, name);
      return fs.existsSync(directory) ? filesIn(directory) : [];
    }),
  ];
  const modules = new Map();
  const imports = [];
  let referenceCount = 0;
  let scriptCount = 0;

  function reference(value, from, extensionRoot = false) {
    if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) return null;
    // Chrome favicon API 提供的虚拟资源，由浏览器生成，不是扩展内的文件。
    if (extensionRoot && /^\/?_favicon\/?$/.test(value)) return null;
    referenceCount++;
    const clean = value.split(/[?#]/)[0];
    const target = path.resolve(
      extensionRoot || clean.startsWith('/') ? root : path.dirname(from),
      clean.replace(/^\/+/, ''),
    );
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      errors.push(`${label}: ${path.relative(root, from)} 引用了不存在的资源 ${value}`);
    }
    return target;
  }

  const manifestFile = path.join(root, 'manifest.json');
  const manifestResources = [
    ...Object.values(manifest.icons ?? {}),
    ...Object.values(manifest.action?.default_icon ?? {}),
    manifest.action?.default_popup,
    manifest.background?.service_worker,
    ...(manifest.background?.scripts ?? []),
    manifest.options_ui?.page,
    manifest.options_page,
    manifest.side_panel?.default_path,
    ...(manifest.content_scripts ?? []).flatMap((script) => [
      ...(script.js ?? []),
      ...(script.css ?? []),
    ]),
  ];
  for (const value of manifestResources) reference(value, manifestFile, true);

  for (const filename of files) {
    if (!/\.(js|css|html)$/.test(filename)) continue;
    const text = fs.readFileSync(filename, 'utf8');

    if (filename.endsWith('.html')) {
      for (const match of text.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/g)) {
        reference(match[1], filename);
      }
      continue;
    }
    if (filename.endsWith('.css')) {
      for (const match of text.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/g)) {
        reference(match[1] ?? match[2] ?? match[3], filename);
      }
      continue;
    }

    scriptCount++;
    let ast;
    const sourceType = path.relative(root, filename).startsWith(`chunks${path.sep}`)
      ? 'module'
      : 'script';
    try {
      ast = acorn.parse(text, { ecmaVersion: 'latest', sourceType });
    } catch (error) {
      errors.push(`${label}: ${path.relative(root, filename)} 语法错误：${error.message}`);
      continue;
    }
    const exported = new Set();
    if (sourceType === 'module') modules.set(filename, exported);
    const stack = [ast];

    while (stack.length) {
      const node = stack.pop();
      if (!node || typeof node !== 'object') continue;

      if (node.type === 'ImportDeclaration') {
        const target = reference(node.source.value, filename);
        imports.push({ filename, target, specifiers: node.specifiers });
      } else if (node.type === 'ImportExpression') {
        reference(staticString(node.source), filename);
      } else if (node.type === 'ExportNamedDeclaration') {
        if (node.source) reference(node.source.value, filename);
        for (const specifier of node.specifiers) {
          exported.add(specifier.exported.name ?? specifier.exported.value);
        }
        if (node.declaration?.id) exported.add(node.declaration.id.name);
        for (const declaration of node.declaration?.declarations ?? []) {
          if (declaration.id.type === 'Identifier') exported.add(declaration.id.name);
        }
      } else if (node.type === 'ExportDefaultDeclaration') {
        exported.add('default');
      } else if (node.type === 'ExportAllDeclaration') {
        reference(node.source.value, filename);
      } else if (node.type === 'CallExpression') {
        if (node.callee.type === 'Identifier' && node.callee.name === 'importScripts') {
          for (const argument of node.arguments) reference(staticString(argument), filename);
        } else if (propertyName(node.callee) === 'getURL') {
          reference(staticString(node.arguments[0]), filename, true);
        }
      } else if (node.type === 'NewExpression' && node.callee.type === 'Identifier') {
        if (['Worker', 'SharedWorker'].includes(node.callee.name)) {
          // 当前扩展使用 chrome.runtime.getURL()；内层调用由 getURL 分支检查。
          reference(staticString(node.arguments[0]), filename);
        } else if (
          node.callee.name === 'URL' &&
          node.arguments[1]?.object?.type === 'MetaProperty' &&
          node.arguments[1].object.meta.name === 'import' &&
          propertyName(node.arguments[1]) === 'url'
        ) {
          reference(staticString(node.arguments[0]), filename);
        }
      } else if (node.type === 'Property' && (node.key.name ?? node.key.value) === 'files') {
        for (const element of node.value?.elements ?? []) {
          const value = staticString(element);
          if (value?.endsWith('.js')) reference(value, filename, true);
        }
      }

      for (const value of Object.values(node)) {
        if (Array.isArray(value)) stack.push(...value);
        else if (value && typeof value === 'object') stack.push(value);
      }
    }
  }

  for (const { filename, target, specifiers } of imports) {
    const exported = modules.get(target);
    if (!exported) continue;
    for (const specifier of specifiers) {
      if (specifier.type === 'ImportNamespaceSpecifier') continue;
      const name =
        specifier.type === 'ImportDefaultSpecifier'
          ? 'default'
          : (specifier.imported.name ?? specifier.imported.value);
      if (!exported.has(name)) {
        errors.push(`${label}: ${path.relative(root, filename)} 导入了未导出的 ${name}`);
      }
    }
  }
  console.log(
    `${label}: 已检查 ${scriptCount} 个 JS 文件、${referenceCount} 处资源引用及模块导出。`,
  );
}

try {
  checkSources();
} catch (error) {
  errors.push(`源码检查失败：${error.message}`);
}

for (const root of roots) {
  try {
    checkRoot(root);
  } catch (error) {
    errors.push(`${path.relative(workspace, root) || '项目根目录'}: ${error.message}`);
  }
}

if (errors.length) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log('8 个源码模块和构建扩展的语法、静态资源路径、模块导入检查均通过。');
}
