const auxiliaryLotteryText =
  /记录|紀錄|历史|歷史|规则|規則|概率|奖池|獎池|结果|結果|说明|說明|知道了|关闭|關閉|取消|返回|复制|複製|\b(?:history|records?|rules?|odds|results?|summary|close|cancel|back|copy)\b/i;
const lotteryActionText =
  /抽[奖獎签籤]|翻牌|(?:连|連)抽|[单單]抽|抽\s*(?:[1-9]\d*|[一二三四五六七八九十百]+)\s*次|(?:立即|开始|開始|免费|免費|再|点击|點擊)抽|\b(?:draw|spin|scratch)\b/i;
const lotteryRoute = /(?:^|\/)(?:lottery|lotteries|lucky[-_]?draw|draw|prize|spin)(?:\/|$)/i;
const graphicLotteryControl =
  /(?:^|[\s_-])(?:gift|spin|wheel|scratch|draw(?:[\s_-](?:btn|button|control))?|lottery[\s_-](?:btn|button|control))(?:$|[\s_-])/i;

export const lotteryCompletedWords = Object.freeze([
  '抽奖成功',
  '抽奖完成',
  '开奖成功',
  '恭喜中奖',
  '恭喜中獎',
  '谢谢参与',
  '謝謝參與',
  '未中奖',
  '未中獎',
  '未中',
  'You won',
  'Thanks for playing',
  'Better luck next time',
  'Draw successful',
  'Draw complete',
  'Draw completed',
]);
export const lotteryAlreadyWords = Object.freeze([
  '今日梦火抽签次数已耗尽',
  '今日抽奖次数已耗尽',
  '今日抽奖次数已用完',
  '今日抽奖次数已达上限',
  '已达到今日抽奖上限',
  'This draw is complete',
  'You have already drawn today',
  'Daily draw limit reached',
]);

const lotteryResultPanels = [
  '[data-lottery-result]',
  '[data-draw-result]',
  '.lottery-result',
  '.draw-result',
  '.result-pop',
  '[role="dialog"]',
  '[aria-modal="true"]',
  '[role="alert"]',
  '[role="status"]',
];

function compactText(value) {
  return typeof value === 'string' ? value.normalize('NFKC').replace(/\s+/g, ' ').trim() : '';
}

export function matchesLotteryActionText(value) {
  const text = compactText(value);
  return !!text && !auxiliaryLotteryText.test(text) && lotteryActionText.test(text);
}

export function mentionsLotteryAction(value) {
  return lotteryActionText.test(compactText(value));
}

export function isLotteryPagePath(path) {
  const text = compactText(path);
  return lotteryRoute.test(text.split(/[?#]/, 1)[0]) || lotteryRoute.test(text.split('#')[1] ?? '');
}

/** 动作来源与页面路线分开保存，进入抽奖页本身不能证明已抽奖。 */
export function isLearnedLotteryAction(event) {
  if ((event?.type ?? event?.kind) !== 'click' || event.href || event.gesture === 'right')
    return false;
  if (event.loginAction === 'entry' || event.loginAction === 'oauth') return false;
  if (auxiliaryLotteryText.test(event.label ?? '')) return false;
  return event.checkinAction === 'lottery' || matchesLotteryActionText(event.label);
}

/** 无文字礼盒必须同时有明确的控件语义与抽奖上下文，不能只靠页面标题猜测。 */
export function describeLotteryClick(element, label, path, isPointer = () => false) {
  if (
    !element ||
    element.disabled === true ||
    element.getAttribute('aria-disabled') === 'true' ||
    element.matches('a[href], [role="link"], label, input[type="radio"], input[type="checkbox"]')
  )
    return;
  const interactive = element.matches(
    'button, [role="button"], input[type="button"], input[type="submit"], [onclick], [tabindex]:not([tabindex="-1"])',
  );
  const accessibleText = [label, element.getAttribute('aria-label'), element.getAttribute('title')]
    .filter(Boolean)
    .join(' ');
  if (auxiliaryLotteryText.test(accessibleText)) return;
  if (interactive && matchesLotteryActionText(accessibleText)) return 'lottery';

  const metadata = [
    element.id,
    element.getAttribute('class'),
    element.getAttribute('data-testid'),
    element.getAttribute('data-action'),
  ]
    .filter((value) => typeof value === 'string')
    .join(' ');
  if (!graphicLotteryControl.test(metadata) || (!interactive && !isPointer(element))) return;
  if (element.querySelector('button, a[href], [role="button"], input, select')) return;

  if (isLotteryPagePath(path)) return 'lottery';
  for (let parent = element.parentElement, depth = 0; parent && depth < 2; depth++) {
    if (parent.matches('body, nav, aside, form, table')) break;
    const context = compactText(parent.innerText ?? parent.textContent ?? '');
    if (
      context.length <= 300 &&
      /抽[奖獎签籤]|开奖|開獎|\blottery\b|\blucky\s+draw\b/i.test(context)
    )
      return 'lottery';
    parent = parent.parentElement;
  }
}

/** 动画或其它账号的页面区块增减时，唯一的语义类名仍可定位同一个抽奖控件。 */
export function stableLotteryControlSelector(element, root) {
  const classes = (element.getAttribute('class') ?? '')
    .split(/\s+/)
    .filter((name) =>
      /^(?:gift|wheel|scratch|(?:lottery|draw|spin)[-_](?:btn|button|control|gift))$/i.test(name),
    );
  for (const name of classes) {
    const selector = `${element.tagName.toLowerCase()}.${name}`;
    const matches = root.querySelectorAll(selector);
    if (matches.length === 1 && matches[0] === element) return selector;
  }
}

/** 仅保存当前可见结果区域的瞬时快照，不把奖池、历史或兑换码写入学习事件。 */
export function snapshotLotteryResults(root, isVisible) {
  const snapshot = new Map();
  for (const selector of lotteryResultPanels) {
    let elements;
    try {
      elements = root.querySelectorAll(selector);
    } catch {
      continue;
    }
    for (const element of elements) {
      if (snapshot.size >= 80) return snapshot;
      if (!isVisible(element)) continue;
      snapshot.set(
        element,
        compactText(element.innerText ?? element.textContent ?? '').slice(0, 1500),
      );
    }
  }
  return snapshot;
}

function matchedOutcome(text) {
  const normalized = compactText(text).toLowerCase();
  const words = (candidates) =>
    candidates.filter((word) => normalized.includes(compactText(word).toLowerCase())).slice(0, 4);
  const already = words(lotteryAlreadyWords);
  if (already.length) return { kind: 'already', words: already };
  if (
    /抽奖失败|抽獎失敗|余额不足|餘額不足|\b(?:draw|lottery) failed\b|insufficient (?:balance|funds)|network error/i.test(
      normalized,
    )
  )
    return;
  const completed = words(lotteryCompletedWords);
  if (completed.length) return { kind: 'success', words: completed };
}

function resultPanelSelector(element, root, isVisible, selectorFor) {
  for (const selector of lotteryResultPanels) {
    if (!element.matches(selector)) continue;
    const visible = [...root.querySelectorAll(selector)].filter(isVisible);
    if (visible.length === 1 && visible[0] === element) return selector;
  }
  const selector = selectorFor?.(element);
  return typeof selector === 'string' &&
    selector.length <= 300 &&
    selector.trim() &&
    !selector.includes('text=')
    ? selector.trim()
    : undefined;
}

export function readLotteryResultEvidence(before, root, isVisible, selectorFor) {
  const current = snapshotLotteryResults(root, isVisible);
  for (const element of before.keys()) if (!current.has(element)) before.delete(element);
  for (const [element, text] of current) {
    if (before.get(element) === text) continue;
    const outcome = matchedOutcome(text);
    if (!outcome) continue;
    const selector = resultPanelSelector(element, root, isVisible, selectorFor);
    return { ...outcome, ...(selector ? { selector } : {}) };
  }
}

/** 使用扩展已有的 CSS >> text 语法，把完成证据限定在开奖区域。 */
export function lotteryResultAssertionSelector(scopes, words) {
  return [...new Set(scopes)]
    .filter((scope) => typeof scope === 'string' && scope.trim() && !scope.includes('text='))
    .slice(-2)
    .flatMap((scope) =>
      [...new Set(words)]
        .filter((word) => typeof word === 'string' && word.trim() && !word.includes(','))
        .map((word) => `${scope} >> text=${word}`),
    )
    .join(', ');
}
