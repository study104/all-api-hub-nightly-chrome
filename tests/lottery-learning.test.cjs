const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const { test } = require('node:test');
const esbuild = require('esbuild');

const workspace = path.resolve(__dirname, '..');
const plain = (value) => JSON.parse(JSON.stringify(value));
const lotteryLearning = import(
  pathToFileURL(path.join(workspace, 'src/modules/learning/lottery-learning.js')).href
);
const contentBundle = esbuild.buildSync({
  stdin: {
    contents: `
      import { initializeContentModules } from './src/shared/content-runtime.js';
      import { createSharedAutoContent } from './src/shared/content-support.js';
      import { createLearningAutoContent } from './src/modules/learning/content.js';
      import { createCheckinAutoContent } from './src/modules/checkin/content.js';
      import { createSliderAutoContent } from './src/modules/slider/content.js';
      export function createRuntime() {
        const scope = Object.create(null);
        const modules = {
          shared: createSharedAutoContent(scope),
          learning: createLearningAutoContent(scope),
          checkin: createCheckinAutoContent(scope),
          slider: createSliderAutoContent(scope),
        };
        initializeContentModules(modules);
        return scope;
      }
    `,
    resolveDir: workspace,
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
}).outputFiles[0].text;

class Element {
  constructor(tag, attributes = {}, text = '') {
    this.tagName = tag.toUpperCase();
    this.nodeType = 1;
    this.attributes = { ...attributes };
    this.id = attributes.id ?? '';
    this.className = attributes.class ?? '';
    this.type = attributes.type ?? (tag === 'input' ? 'text' : '');
    this.href = attributes.href ?? '';
    this.disabled = attributes.disabled === true;
    this.hidden = attributes.hidden === true;
    this.cursor = attributes.cursor;
    this.text = text;
    this.children = [];
    this.parentElement = null;
    this.isConnected = true;
    this.scrollTop = 0;
    this.scrollHeight = 600;
    this.clientHeight = 600;
  }
  append(...children) {
    for (const child of children) {
      child.parentElement = this;
      this.children.push(child);
    }
    return this;
  }
  get textContent() {
    return [this.text, ...this.children.map((child) => child.textContent)]
      .filter(Boolean)
      .join(' ');
  }
  get innerText() {
    return this.hidden
      ? ''
      : [this.text, ...this.children.map((child) => child.innerText)].filter(Boolean).join(' ');
  }
  getAttribute(name) {
    return this.attributes[name] ?? null;
  }
  hasAttribute(name) {
    return Object.hasOwn(this.attributes, name);
  }
  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }
  getRootNode() {
    let root = this;
    while (root.parentElement) root = root.parentElement;
    return root.ownerDocument ?? root;
  }
  getBoundingClientRect() {
    let visible = true;
    for (let element = this; element; element = element.parentElement)
      if (element.hidden) visible = false;
    return {
      left: 20,
      top: 20,
      width: visible ? 160 : 0,
      height: visible ? 80 : 0,
      right: 180,
      bottom: 100,
    };
  }
  contains(element) {
    return element === this || this.children.some((child) => child.contains(element));
  }
  matches(selector) {
    return selector.split(',').some((candidate) => this.matchesComplex(candidate.trim()));
  }
  matchesComplex(selector) {
    const direct = selector.split(/\s*>\s*/);
    if (direct.length > 1) {
      return (
        this.matchesComplex(direct.pop()) &&
        !!this.parentElement?.matchesComplex(direct.join(' > '))
      );
    }
    const descendants = selector.split(/\s+(?![^\[]*\])/);
    if (descendants.length > 1) {
      return (
        this.matchesComplex(descendants.pop()) &&
        !!this.parentElement?.closest(descendants.join(' '))
      );
    }
    for (const [, negative] of selector.matchAll(/:not\(([^)]+)\)/g))
      if (this.matchesComplex(negative)) return false;
    let candidate = selector.replace(/:not\([^)]+\)/g, '');
    const nth = candidate.match(/:nth-of-type\((\d+)\)/);
    if (nth) {
      const siblings = this.parentElement?.children.filter(
        (element) => element.tagName === this.tagName,
      ) ?? [this];
      if (siblings.indexOf(this) + 1 !== Number(nth[1])) return false;
      candidate = candidate.replace(nth[0], '');
    }
    const tag = candidate.match(/^[a-z][\w-]*/i)?.[0];
    if (tag && tag.toUpperCase() !== this.tagName) return false;
    for (const [
      ,
      attribute,
      operator,
      quoted,
      singleQuoted,
      unquoted,
      insensitive,
    ] of candidate.matchAll(
      /\[([\w-]+)(?:\s*([*^$|~]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]+)))?\s*(i)?\]/g,
    )) {
      const value = this.getAttribute(attribute);
      if (value === null) return false;
      if (!operator) continue;
      const raw = quoted ?? singleQuoted ?? unquoted;
      const expected = insensitive ? raw.toLowerCase() : raw;
      const actual = insensitive ? String(value).toLowerCase() : String(value);
      if (operator === '=' && actual !== expected) return false;
      if (operator === '*=' && !actual.includes(expected)) return false;
      if (operator === '^=' && !actual.startsWith(expected)) return false;
      if (operator === '$=' && !actual.endsWith(expected)) return false;
    }
    candidate = candidate.replace(/\[[^\]]+\]/g, '');
    for (const [, prefix, value] of candidate.matchAll(/([.#])([\w-]+)/g)) {
      if (prefix === '#' && this.id !== value) return false;
      if (prefix === '.' && !this.className.split(/\s+/).includes(value)) return false;
    }
    return !!selector;
  }
  closest(selector) {
    for (let element = this; element; element = element.parentElement)
      if (element.matches(selector)) return element;
    return null;
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
}
class Button extends Element {
  constructor(text, attributes = {}) {
    super('button', attributes, text);
  }
}
class Input extends Element {}
class Textarea extends Element {}
class Anchor extends Element {
  constructor(text, href) {
    super('a', { href }, text);
  }
}

function recorderFixture({ url = 'https://sub.100xlabs.space/lottery', kind = 'checkin' } = {}) {
  let now = 1000;
  let nextTimer = 0;
  const timers = new Map();
  const body = new Element('body');
  const html = new Element('html').append(body);
  const document = {
    body,
    documentElement: html,
    querySelectorAll: (selector) => body.querySelectorAll(selector),
    querySelector: (selector) => body.querySelector(selector),
    addEventListener() {},
    removeEventListener() {},
  };
  html.ownerDocument = document;
  const location = new URL(url);
  class Clock extends Date {
    static now() {
      return now;
    }
  }
  const computedStyle = (element) => {
    let cursor = 'auto';
    for (let node = element; node; node = node.parentElement) {
      if (node.cursor) {
        cursor = node.cursor;
        break;
      }
    }
    return {
      display: element.hidden ? 'none' : 'block',
      visibility: 'visible',
      opacity: '1',
      overflowY: 'visible',
      cursor,
    };
  };
  const module = { exports: {} };
  const context = vm.createContext({
    module,
    exports: module.exports,
    console,
    URL,
    Date: Clock,
    Event,
    CustomEvent: class CustomEvent extends Event {
      constructor(type, options = {}) {
        super(type, options);
        this.detail = options.detail;
      }
    },
    AbortController,
    Element,
    HTMLElement: Element,
    HTMLButtonElement: Button,
    HTMLInputElement: Input,
    HTMLTextAreaElement: Textarea,
    HTMLAnchorElement: Anchor,
    ShadowRoot: class ShadowRoot {},
    Uint8Array,
    TextDecoder,
    TextEncoder,
    location,
    document,
    window: { getComputedStyle: computedStyle, innerWidth: 1024, innerHeight: 768, scrollY: 0 },
    getComputedStyle: computedStyle,
    setTimeout(callback, delay) {
      const timer = ++nextTimer;
      timers.set(timer, { callback, at: now + delay });
      return timer;
    },
    clearTimeout: (timer) => timers.delete(timer),
    setInterval: () => ++nextTimer,
    clearInterval() {},
    chrome: { runtime: { id: 'test-extension' } },
    fetch: async () => {
      throw new Error('Learning recorder must not execute a draw or make network requests');
    },
  });
  vm.runInContext(contentBundle, context);
  const scope = module.exports.createRuntime();
  const events = [];
  const recorder = new scope.Ng({
    kind,
    onEvent: (event) => events.push(plain(event)),
  });
  recorder.attached = true;
  function click(target) {
    const composedPath = [];
    for (let node = target; node; node = node.parentElement) composedPath.push(node);
    composedPath.push(document);
    recorder.onClick({
      target,
      composedPath: () => composedPath,
      clientX: 60,
      clientY: 50,
      detail: 1,
    });
  }
  function advance(milliseconds) {
    const end = now + milliseconds;
    for (;;) {
      const due = [...timers].sort((a, b) => a[1].at - b[1].at)[0];
      if (!due || due[1].at > end) break;
      const [timer, { callback, at }] = due;
      timers.delete(timer);
      now = at;
      callback();
    }
    now = end;
  }
  return { body, document, scope, recorder, events, click, advance, timers };
}

function baibeiGift(fixture, { semantic = true, disabled = false } = {}) {
  // These are the actual public Baibei LotteryView element attributes and decoration classes.
  const gift = new Element('div', {
    class: 'gift',
    cursor: 'pointer',
    ...(semantic ? { role: 'button', tabindex: '0' } : {}),
    'aria-disabled': String(disabled),
  }).append(new Element('div', { class: 'lid' }), new Element('div', { class: 'body' }));
  fixture.body.append(
    new Element('div', { class: 'lottery-page' }).append(
      new Element('div', { class: 'box-stage' }).append(
        gift,
        new Element('p', { class: 'box-caption' }, '点击礼盒或下方按钮开始'),
      ),
      new Button('抽 1 次', { class: 'lottery-btn gold', type: 'button' }),
    ),
  );
  return gift;
}

test('lottery learning: Baibei quantity buttons and graphical gift clicks count as actual actions', async () => {
  const { matchesLotteryActionText } = await lotteryLearning;
  for (const label of [
    '抽 1 次',
    '抽 10 次',
    '三连抽',
    '单抽',
    '抽獎',
    'Draw once',
    'Draw ×3',
    'Spin',
  ])
    assert.equal(matchesLotteryActionText(label), true, label);
  for (const label of ['我的抽奖记录', '三连抽结果', 'Draw history', 'Draw result', '知道了'])
    assert.equal(matchesLotteryActionText(label), false, label);

  const fixture = recorderFixture();
  const gift = baibeiGift(fixture);
  assert.equal(fixture.scope.R(gift), false);
  assert.equal(fixture.scope.Ql(gift), false, fixture.scope.Zl);
  fixture.click(gift.children[0]);
  const event = fixture.events.find((event) => event.type === 'click');
  assert.equal(event.label, '');
  assert.equal(event.checkinAction, 'lottery');
  assert.deepEqual(event.fingerprint, { tag: 'div', role: 'button' });
  assert.equal(event.selector, 'div.gift');
  assert.equal(fixture.scope.xe(event.selector)[0], gift);
  assert.equal(fixture.scope.Dm(event), 'action');
  assert.deepEqual(
    [...fixture.timers.values()].map(({ at }) => at - 1000),
    [700, 2500, 6000, 12000],
  );
});

test('lottery learning: pointer-only decorations resolve to their explicit gift control', () => {
  const fixture = recorderFixture();
  const gift = baibeiGift(fixture, { semantic: false });
  fixture.click(gift.children[0]);
  const event = fixture.events.find((event) => event.type === 'click');
  assert.equal(event.checkinAction, 'lottery');
  assert.equal(fixture.scope.xe(event.selector)[0], gift);
});

test('lottery learning: the gift selector survives optional layout blocks and refuses ambiguous class targets', async () => {
  const { stableLotteryControlSelector } = await lotteryLearning;
  const fixture = recorderFixture();
  const gift = baibeiGift(fixture);
  const selector = stableLotteryControlSelector(gift, fixture.document);
  assert.equal(selector, 'div.gift');
  gift.parentElement.children.unshift(
    new Element('div', { class: 'barrier-broadcast' }, '本账号的可选区块'),
  );
  assert.equal(fixture.scope.xe(selector)[0], gift);
  fixture.body.append(new Element('div', { class: 'gift', role: 'button', tabindex: '0' }));
  assert.equal(stableLotteryControlSelector(gift, fixture.document), undefined);
});

test('lottery learning: page entry, unrelated controls and login-only learning are not lottery actions', () => {
  const fixture = recorderFixture({ url: 'https://sub.100xlabs.space/dashboard' });
  const entry = new Anchor('抽奖', 'https://sub.100xlabs.space/lottery');
  const unrelated = new Button('复制兑换码', { class: 'lottery-btn ghost', type: 'button' });
  const history = new Button('我的抽奖记录', { class: 'lottery-btn ghost', type: 'button' });
  fixture.body.append(entry, unrelated, history);
  fixture.click(entry);
  fixture.click(unrelated);
  fixture.click(history);
  assert.equal(fixture.events.filter((event) => event.type === 'click').length, 3);
  for (const event of fixture.events.filter((event) => event.type === 'click')) {
    assert.equal(event.checkinAction, undefined);
    assert.equal(fixture.scope.Dm(event), 'none');
  }
  const login = recorderFixture({ kind: 'login' });
  const gift = baibeiGift(login);
  login.click(gift);
  assert.equal(login.events.find((event) => event.type === 'click').checkinAction, undefined);
  assert.equal(login.timers.size, 0);
});

test('lottery learning: a same-page navigation link is still distinct from an actual draw submit', () => {
  const fixture = recorderFixture();
  const entry = new Anchor('抽奖', 'https://sub.100xlabs.space/lottery');
  const submit = new Button('抽 1 次', { type: 'submit' });
  fixture.body.append(entry, submit);
  fixture.click(entry);
  fixture.click(submit);
  const clicks = fixture.events.filter((event) => event.type === 'click');
  assert.equal(fixture.scope.Dm(clicks[0]), 'none');
  assert.equal(clicks[1].loginAction, 'submit');
  assert.equal(clicks[1].checkinAction, 'lottery');
  assert.equal(fixture.scope.Dm(clicks[1]), 'action');
});

test('lottery learning: disabled gifts and CAPTCHA controls do not produce replay clicks', () => {
  const disabled = recorderFixture();
  disabled.click(baibeiGift(disabled, { disabled: true }));
  assert.equal(
    disabled.events.some((event) => event.type === 'click'),
    false,
  );

  const captcha = recorderFixture();
  const gift = new Element('div', { class: 'gift', role: 'button', tabindex: '0' });
  captcha.body.append(new Element('div', { class: 'g-recaptcha' }).append(gift));
  captcha.click(gift);
  assert.equal(
    captcha.events.some((event) => event.type === 'click'),
    false,
  );
  assert.equal(
    captcha.recorder.unlearnedNotes.some((note) => note.includes('人机验证')),
    true,
  );
});

for (const resultText of ['恭喜中奖', '谢谢参与', 'You won', 'Thanks for playing']) {
  test(`lottery learning: delayed ${resultText} becomes scoped completion evidence without recording prize codes`, () => {
    const fixture = recorderFixture();
    const gift = baibeiGift(fixture);
    // The prize table already contains a miss outcome; that text cannot prove this draw succeeded.
    fixture.body.append(new Element('table').append(new Element('td', {}, '谢谢参与')));
    fixture.click(gift);
    fixture.advance(700);
    assert.equal(
      fixture.events.some((event) => event.evidence),
      false,
    );

    fixture.body.append(
      new Element('div', { class: 'result-pop on' }).append(
        new Element('span', { class: 'pill' }, resultText),
        new Element('code', {}, 'private-prize-code'),
      ),
    );
    fixture.advance(1800);
    const evidence = fixture.events.find((event) => event.evidence);
    assert.equal(evidence.evidence.kind, 'success');
    assert.equal(evidence.evidence.selector, '.result-pop');
    assert.ok(evidence.evidence.words.includes(resultText));
    assert.deepEqual(evidence.afterText, evidence.evidence.words);
    assert.equal(fixture.scope.Dm(evidence), 'confirmed');
    assert.equal(JSON.stringify(fixture.events).includes('private-prize-code'), false);
    assert.equal(fixture.events.filter((event) => event.type === 'click').length, 2);
  });
}

test('lottery learning: an unchanged result dialog and a failure toast cannot confirm a new draw', () => {
  const fixture = recorderFixture();
  const gift = baibeiGift(fixture);
  fixture.body.append(
    new Element('div', { class: 'result-pop on' }, '谢谢参与'),
    new Element('table').append(new Element('td', {}, '恭喜中奖')),
  );
  fixture.click(gift);
  fixture.advance(700);
  fixture.body.append(new Element('div', { role: 'alert' }, '抽奖失败：余额不足'));
  fixture.advance(11300);
  assert.equal(
    fixture.events.some((event) => event.evidence),
    false,
  );
  assert.equal(
    fixture.events.some((event) => event.afterText),
    false,
  );
});

test('lottery learning: hiding and reopening a reused result panel proves a fresh identical result', () => {
  const fixture = recorderFixture();
  const gift = baibeiGift(fixture);
  const result = new Element('div', { class: 'result-pop on' }, '谢谢参与');
  fixture.body.append(result);
  fixture.click(gift);
  result.hidden = true;
  fixture.advance(700);
  result.hidden = false;
  fixture.advance(1800);
  assert.equal(fixture.events.find((event) => event.evidence).evidence.kind, 'success');
});

test('lottery learning: new daily quota evidence is distinct from a completed draw', () => {
  const fixture = recorderFixture();
  fixture.click(baibeiGift(fixture));
  fixture.body.append(new Element('div', { role: 'alert' }, '今日抽奖次数已用完'));
  fixture.advance(700);
  const event = fixture.events.find((event) => event.evidence);
  assert.equal(event.evidence.kind, 'already');
  assert.equal(fixture.scope.Dm(event), 'already');
});

test('lottery learning: later draw results are not assigned to an earlier click', () => {
  const fixture = recorderFixture();
  const gift = baibeiGift(fixture);
  fixture.click(gift);
  fixture.advance(800);
  fixture.click(gift);
  fixture.body.append(new Element('div', { class: 'result-pop on' }, '谢谢参与'));
  fixture.advance(12000);
  const outcomes = fixture.events.filter((event) => event.evidence);
  assert.ok(outcomes.length);
  assert.equal(
    outcomes.every((event) => event.at === 1800),
    true,
  );
});

test('lottery learning: generated result selectors require the actual result panel', async () => {
  const { lotteryResultAssertionSelector, lotteryCompletedWords } = await lotteryLearning;
  const fixture = recorderFixture();
  fixture.body.append(new Element('table').append(new Element('td', {}, '谢谢参与')));
  const selector = lotteryResultAssertionSelector(['.result-pop'], lotteryCompletedWords);
  assert.equal(fixture.scope.D(selector), null);
  const result = new Element('div', { class: 'result-pop on' }, '谢谢参与');
  fixture.body.append(result);
  assert.equal(fixture.scope.D(selector), result);
  result.hidden = true;
  assert.equal(fixture.scope.D(selector), null);
});
