import {
  describeIdentityField,
  readIdentitySource,
  readVisibleAccountIdentity,
  stableIdentitySamples,
} from '../../shared/account-identity.js';

const fieldLabels = { userId: '用户 ID', username: '登录名', email: '邮箱' };
const guideSelector = '[data-checkin-learning-guide], [data-checkin-identity-picker]';

export function identitySourceSummary(identity, source = identity?.identitySource) {
  const field = identity?.userId ? 'userId' : identity?.username ? 'username' : 'email';
  const value = identity?.[field];
  if (!value) return '尚未读到当前登录身份，可以点选自己的用户 ID 或唯一登录名';
  const position =
    identity.source === 'api'
      ? `${source?.endpoint ?? identity.endpoint ?? ''} → ${source?.responseFields?.[field] ?? field}`
      : source?.pageFields?.[field]
        ? `${source.pagePath ?? ''} → ${fieldLabels[field]}字段`
        : '当前页面';
  return `已识别${fieldLabels[field]} ${value} · ${position}`;
}

/** 学习期间自动取得身份读取位置，并提供直接点选页面字段的操作。 */
export class IdentitySourceLearner {
  constructor({
    site,
    send,
    requestIdentity,
    getProgress = () => ({}),
    onStatus = () => {},
    document = globalThis.document,
    location = globalThis.location,
    window = globalThis.window,
    wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  }) {
    Object.assign(this, {
      site,
      send,
      requestIdentity,
      getProgress,
      onStatus,
      document,
      location,
      window,
      wait,
    });
    this.source = readIdentitySource(site) ?? {};
    this.selectedFields = new Set();
    this.active = false;
    this.picking = null;
    this.status = '自动查找身份接口和资料字段；也可点选自己的用户 ID 或唯一登录名';
    this.pendingApi = null;
    this.sentApi = null;
    this.lastProbeAt = 0;
    this.probeAttempts = new Map();
    this.learnedPhase = null;
    this.onClick = this.onClick.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onKey = this.onKey.bind(this);
    this.onPointer = this.onPointer.bind(this);
  }

  path() {
    return this.location.pathname + this.location.hash;
  }

  setStatus(text) {
    this.status = text;
    this.onStatus(text, this.picking);
  }

  readVisible() {
    const identity = readVisibleAccountIdentity(this.document, this.location, this.source, {
      collectSource: true,
    });
    if (
      identity?.identitySource &&
      this.selectedFields.size &&
      this.source.pagePath === this.path()
    )
      identity.selectedFields = [...this.selectedFields];
    return identity;
  }

  async reportVisible(observation) {
    return this.report(observation);
  }

  async report(observation) {
    const result = await this.send({
      ...observation,
      stable: true,
      ...(observation.identity.identitySource
        ? { identitySource: observation.identity.identitySource }
        : {}),
      ...(observation.identity.selectedFields
        ? { selectedFields: observation.identity.selectedFields }
        : {}),
    });
    if (result?.ok && !result.ignored) {
      if (!this.picking) this.setStatus(identitySourceSummary(observation.identity));
    } else if (result?.ignored) {
      if (!this.picking)
        this.setStatus(result.reason || '已读到页面身份；请先演示本账号的登录，再建立绑定');
    } else {
      this.setStatus(result?.error || '身份读取位置保存失败');
    }
    return result;
  }

  canReadApi() {
    const progress = this.getProgress();
    return (
      !!(progress.signedIn || progress.login) &&
      !/(?:^|\/)(?:login|signin|oauth|authorize|logout)(?:\/|$)/i.test(this.path()) &&
      !this.document.querySelector?.('form input[type="password"]')
    );
  }

  probe(force = false) {
    if (this.pendingApi) return this.pendingApi;
    if (!this.requestIdentity || !this.canReadApi() || (!force && !this.active))
      return Promise.resolve();
    const path = this.path();
    const phase = JSON.stringify([path, this.getProgress().loginAt]);
    if (!force && (this.learnedPhase === phase || (this.probeAttempts.get(phase) ?? 0) >= 3))
      return Promise.resolve();
    this.probeAttempts.set(phase, (this.probeAttempts.get(phase) ?? 0) + 1);
    this.lastProbeAt = Date.now();
    this.pendingApi = (async () => {
      const read = () =>
        this.requestIdentity({ ...this.site, identitySource: this.source }, undefined, {
          discover: true,
          serverOnly: true,
          timeoutMs: 3000,
        });
      const first = await read();
      if (!first?.identitySource || first.source !== 'api') {
        if (!this.picking && !this.selectedFields.size && this.active)
          this.setStatus('身份接口未返回可核对字段；请点选个人资料页中自己的用户 ID 或唯一登录名');
        return;
      }
      await this.wait(350);
      const second = await read();
      if (
        (!this.active && !force) ||
        this.path() !== path ||
        !stableIdentitySamples(first, second) ||
        JSON.stringify(first.identitySource) !== JSON.stringify(second?.identitySource)
      )
        return;
      const key = JSON.stringify([
        phase,
        second.userId,
        second.username,
        second.email,
        second.identitySource,
      ]);
      if (this.sentApi === key) return;
      const result = await this.report({ identity: second, path });
      if (result?.ok && !result.ignored) {
        this.sentApi = key;
        this.learnedPhase = phase;
      }
    })().finally(() => {
      this.pendingApi = null;
    });
    return this.pendingApi;
  }

  start() {
    if (this.active) return;
    this.active = true;
    // 先于动作录制器注册，点选字段时不会触发站点按钮或进入签到动作。
    this.document.addEventListener('click', this.onClick, true);
    this.document.addEventListener('pointermove', this.onMove, true);
    this.document.addEventListener('keydown', this.onKey, true);
    for (const name of ['pointerdown', 'pointerup', 'mousedown', 'mouseup'])
      this.document.addEventListener(name, this.onPointer, true);
    this.timer = setInterval(() => {
      if (Date.now() - this.lastProbeAt >= 5000) this.probe().catch(() => {});
    }, 650);
    this.setStatus(this.status);
    this.probe().catch(() => {});
  }

  stop() {
    this.active = false;
    clearInterval(this.timer);
    this.timer = undefined;
    this.document.removeEventListener('click', this.onClick, true);
    this.document.removeEventListener('pointermove', this.onMove, true);
    this.document.removeEventListener('keydown', this.onKey, true);
    for (const name of ['pointerdown', 'pointerup', 'mousedown', 'mouseup'])
      this.document.removeEventListener(name, this.onPointer, true);
    this.cancelPick(false);
  }

  async flush() {
    await this.pendingApi;
    await this.probe(true);
  }

  pick(field) {
    if (!fieldLabels[field] || !this.active) return;
    if (this.document.querySelector?.('form input[type="password"]')) {
      this.setStatus('请先登录并打开自己的个人资料页，再选择身份字段');
      return;
    }
    if (this.picking === field) {
      this.cancelPick();
      return;
    }
    this.picking = field;
    this.setStatus(`点击页面中自己的${fieldLabels[field]}；不要选择昵称或其他用户。按 Esc 取消`);
  }

  cancelPick(update = true) {
    this.picking = null;
    this.overlay?.remove();
    this.overlay = null;
    if (update) this.setStatus('已退出字段点选，可继续演示登录和签到');
  }

  target(event) {
    return event.composedPath().find((node) => node?.nodeType === 1 && node.tagName);
  }

  inGuide(event) {
    return event.composedPath().some((node) => node?.matches?.(guideSelector));
  }

  onPointer(event) {
    if (!this.picking || this.inGuide(event)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  onKey(event) {
    if (!this.picking || event.key !== 'Escape') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    this.cancelPick();
  }

  onMove(event) {
    if (!this.picking || this.inGuide(event)) return;
    const node = this.target(event);
    if (!node || node === this.document.body || node === this.document.documentElement) return;
    const rect = node.getBoundingClientRect();
    if (!this.overlay) {
      this.overlay = this.document.createElement('div');
      this.overlay.setAttribute('data-checkin-identity-picker', '');
      this.overlay.style.cssText =
        'position:fixed;z-index:2147483646;pointer-events:none;border:2px solid #fbbf24;background:rgba(251,191,36,.12);box-sizing:border-box;border-radius:3px';
      this.document.body.append(this.overlay);
    }
    Object.assign(this.overlay.style, {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
  }

  onClick(event) {
    if (!this.picking || this.inGuide(event)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const field = this.picking;
    const node = this.target(event);
    const labels = [
      node?.getAttribute?.('aria-label'),
      node?.getAttribute?.('name'),
      node?.id,
      node?.previousElementSibling?.textContent,
    ].join(' ');
    if (field === 'username' && /昵称|显示名|nickname|display[-_ ]?name/i.test(labels)) {
      this.setStatus('这是显示昵称，请选择本站的唯一登录名，或改选用户 ID');
      return;
    }
    const descriptor = describeIdentityField(node, field, this.document);
    if (!descriptor) {
      this.setStatus(
        `这个元素不能稳定读取${fieldLabels[field]}，请点中身份值本身；不要选登录输入框`,
      );
      return;
    }
    if (this.source.pagePath !== this.path()) {
      this.source = { ...this.source, pageFields: {}, pageFieldRules: {} };
      this.selectedFields.clear();
    }
    this.source = {
      ...this.source,
      pagePath: this.path(),
      pageFields: { ...this.source.pageFields, [field]: descriptor.selector },
      pageFieldRules: { ...this.source.pageFieldRules, [field]: descriptor.rule },
    };
    this.selectedFields.add(field);
    this.cancelPick(false);
    this.setStatus(`已选中${fieldLabels[field]} ${descriptor.value}，正在连续读取并核验`);
  }
}
