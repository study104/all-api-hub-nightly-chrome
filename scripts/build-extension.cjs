const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const workspace = path.resolve(__dirname, '..');
const sourceRoot = path.join(workspace, 'src');
const publicRoot = path.join(workspace, 'public');
const outputRoot = path.join(workspace, 'output', 'chrome-mv3');
const legacyMarker = path.join(workspace, '.legacy-root-build.json');
const legacyEntries = [
  'assets',
  'background',
  'chunks',
  'content-scripts',
  'icon',
  'opencv',
  'manifest.json',
  'options.html',
  'sidepanel.html',
  'preview.html',
  'shell-preview.html',
];

function legacyTarget(name) {
  const target = path.resolve(workspace, name);
  if (!legacyEntries.includes(name) || !target.startsWith(workspace + path.sep)) {
    throw new Error(`Refusing to change a non-build path: ${target}`);
  }
  if (fs.existsSync(target)) {
    const relative = path.relative(fs.realpathSync(workspace), fs.realpathSync(target));
    if (relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative) || relative === '..') {
      throw new Error(`Build path resolves outside this workspace: ${target}`);
    }
  }
  return target;
}

function cleanLegacyRoot() {
  if (!fs.existsSync(legacyMarker)) {
    console.log('No temporary root extension build to remove.');
    return;
  }
  const marker = JSON.parse(fs.readFileSync(legacyMarker, 'utf8'));
  if (marker.format !== 'checkin-legacy-root-v1') throw new Error('Invalid legacy build marker.');
  for (const name of legacyEntries) {
    // Every resolved delete target belongs to the fixed list of temporary build artifacts.
    fs.rmSync(legacyTarget(name), { recursive: true, force: true });
  }
  fs.unlinkSync(legacyMarker);
  console.log('Removed the temporary root build; src/, public/ and output/ were preserved.');
}

function copyTree(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else fs.copyFileSync(from, to);
  }
}

async function build() {
  // Only the extension build directory is disposable. Sources and public assets stay outside it.
  const expectedOutput = path.resolve(workspace, 'output', 'chrome-mv3');
  if (outputRoot !== expectedOutput || !outputRoot.startsWith(workspace + path.sep)) {
    throw new Error(`Refusing to replace a directory outside this workspace: ${outputRoot}`);
  }
  fs.rmSync(outputRoot, { recursive: true, force: true });
  copyTree(publicRoot, outputRoot);

  const common = {
    absWorkingDir: workspace,
    bundle: true,
    platform: 'browser',
    target: ['chrome120'],
    outdir: outputRoot,
    minify: false,
    sourcemap: 'external',
    sourcesContent: true,
    legalComments: 'inline',
    charset: 'utf8',
    logLevel: 'warning',
    metafile: true,
  };

  const classic = await esbuild.build({
    ...common,
    format: 'iife',
    entryPoints: {
      'background/checkin-service': path.join(sourceRoot, 'entries', 'background.js'),
      'content-scripts/auto-login': path.join(sourceRoot, 'entries', 'auto-login.js'),
      'content-scripts/slider-captcha-frame': path.join(
        sourceRoot,
        'entries',
        'slider-captcha-frame.js',
      ),
    },
  });
  const pages = await esbuild.build({
    ...common,
    format: 'esm',
    splitting: true,
    chunkNames: 'chunks/shared-[hash]',
    entryPoints: {
      'chunks/management-page': path.join(sourceRoot, 'entries', 'management-page.js'),
      'chunks/sidepanel-page': path.join(sourceRoot, 'entries', 'sidepanel-page.js'),
      'chunks/design-preview-page': path.join(sourceRoot, 'entries', 'design-preview-page.js'),
      'chunks/layout-preview-page': path.join(sourceRoot, 'entries', 'layout-preview-page.js'),
    },
  });
  const metadata = {
    inputs: { ...classic.metafile.inputs, ...pages.metafile.inputs },
    outputs: { ...classic.metafile.outputs, ...pages.metafile.outputs },
  };
  fs.writeFileSync(
    path.join(outputRoot, 'build-meta.json'),
    JSON.stringify(metadata, null, 2) + '\n',
  );
  if (process.argv.includes('--legacy-root')) {
    for (const name of legacyEntries) {
      if (fs.existsSync(legacyTarget(name)) && !fs.existsSync(legacyMarker)) {
        throw new Error(`Root path already exists and is not a marked build artifact: ${name}`);
      }
    }
    for (const name of legacyEntries) {
      const source = path.join(outputRoot, name);
      const target = legacyTarget(name);
      if (fs.statSync(source).isDirectory()) copyTree(source, target);
      else fs.copyFileSync(source, target);
    }
    fs.writeFileSync(legacyMarker, JSON.stringify({ format: 'checkin-legacy-root-v1' }) + '\n');
    console.log('Created a temporary root build to retain the previous unpacked extension ID.');
  }
  console.log(`Built Chrome MV3 extension from src/ and public/: ${outputRoot}`);
}

const operation = process.argv.includes('--clean-legacy-root')
  ? Promise.resolve().then(cleanLegacyRoot)
  : build();
operation.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
