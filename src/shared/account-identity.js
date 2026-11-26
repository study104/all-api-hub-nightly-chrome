/**
 * 所有站点共用的当前账号身份读取与判断。
 * 站点提供读取位置；目标账号的 ID / 名称只用于比对，绝不作为当前身份填入请求。
 */
export function readIdentitySource(site) {
  const source = site.identitySource;
  if (!source || typeof source !== 'object' || Array.isArray(source)) return null;
  const text = (value) => (typeof value === 'string' && value.trim() ? value.trim() : undefined);
  const storageType = (value) =>
    value === 'localStorage' || value === 'sessionStorage' ? value : undefined;
  const fields = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
    const result = {};
    for (const field of ['userId', 'username', 'email', 'displayName']) {
      const selector = text(value[field]);
      if (selector && selector.length <= 500) result[field] = selector;
    }
    return Object.keys(result).length ? result : undefined;
  };
  const result = {
    storageKey: text(source.storageKey),
    storageType: storageType(source.storageType),
    endpoint: text(source.endpoint),
    pagePath: text(source.pagePath),
    pageFields: fields(source.pageFields),
    pageFieldRules: readIdentityFieldRules(source.pageFieldRules),
    responseFields: fields(source.responseFields),
    tokenKey: text(source.tokenKey),
    tokenStorageType: storageType(source.tokenStorageType),
    tokenHeader: text(source.tokenHeader),
    tokenPrefix: typeof source.tokenPrefix === 'string' ? source.tokenPrefix : undefined,
  };
  return result.storageKey ||
    result.endpoint ||
    result.pagePath ||
    result.pageFields ||
    result.responseFields
    ? result
    : null;
}

export function readIdentityFieldRules(rules) {
  if (!rules || typeof rules !== 'object' || Array.isArray(rules)) return undefined;
  const result = {};
  for (const field of ['userId', 'username', 'email', 'displayName']) {
    const rule = rules[field];
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) continue;
    if (!['text', 'value', 'attribute'].includes(rule.kind)) continue;
    if (
      rule.kind === 'attribute' &&
      !/^data-(?:user-id|uid|username|user-name|email)$/.test(rule.attribute ?? '')
    )
      continue;
    if (
      ['prefix', 'suffix'].some(
        (key) => rule[key] != null && (typeof rule[key] !== 'string' || rule[key].length > 80),
      )
    )
      continue;
    if (
      rule.stopAt != null &&
      (field !== 'userId' || ![',', '，', ';', '；'].includes(rule.stopAt))
    )
      continue;
    result[field] = {
      kind: rule.kind,
      ...(rule.kind === 'attribute' ? { attribute: rule.attribute } : {}),
      ...(rule.prefix ? { prefix: rule.prefix } : {}),
      ...(rule.suffix ? { suffix: rule.suffix } : {}),
      ...(rule.stopAt ? { stopAt: rule.stopAt } : {}),
    };
  }
  return Object.keys(result).length ? result : undefined;
}

export function normalizeIdentityFieldValue(field, value) {
  if (typeof value !== 'string') return undefined;
  const text = value.trim();
  if (!text || text.length > 128 || /[\r\n*•●]/.test(text)) return undefined;
  if (field === 'userId') return /^[\w.:-]{1,128}$/.test(text) ? text : undefined;
  if (field === 'email')
    return /^[\p{L}\p{N}._+%-]+@[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)+$/u.test(text)
      ? text
      : undefined;
  if (field === 'username')
    return /^[\p{L}\p{N}@][\p{L}\p{N}._+@'-]{1,79}$/u.test(text) ? text : undefined;
  return field === 'displayName' ? text : undefined;
}

/** ID 标签后可带注册天数等变化信息；只读取标签后的标识，不保存这些变化值。 */
export function parseVisibleUserIdLabel(text) {
  if (typeof text !== 'string') return null;
  const match = text
    .replace(/\s+/g, ' ')
    .trim()
    .match(
      /^((?:用户\s*ID|User\s*ID|UID|ID)(?:\s*[:：#]\s*|\s+))([\w.:-]{1,128})(?:\s*([,，;；])\s*(.+))?$/i,
    );
  return match
    ? { prefix: match[1], value: match[2], ...(match[3] ? { stopAt: match[3] } : {}) }
    : null;
}

/** 读取已选中的单个字段。选择器定位元素，规则去掉标签，不包含账号的身份值。 */
export function readIdentityField(node, field, rule = {}) {
  if (!node || !isIdentityElementVisible(node)) return undefined;
  if (node.closest?.('form')?.querySelector?.('input[type="password"]')) return undefined;
  if (node.closest?.('[role="grid"], [role="list"], [role="listitem"], .lottery-sidebar'))
    return undefined;
  const table = node.closest?.('table, [role="table"]');
  if (table?.querySelector?.('thead') && table.querySelectorAll?.('tbody tr')?.length > 1)
    return undefined;
  for (let current = node; current && current.tagName !== 'BODY'; current = current.parentElement) {
    const metadata = [
      current.id,
      current.className,
      current.getAttribute?.('data-testid'),
      current.getAttribute?.('aria-label'),
    ].join(' ');
    if (
      /用户列表|成员列表|邀请|排行榜|中奖|(?:^|[\s_-])(?:user[-_ ]list|member[-_ ]list|invitation|referral|leaderboard|winners?)(?:$|[\s_-])/i.test(
        metadata,
      )
    )
      return undefined;
  }
  const tag = node.tagName?.toUpperCase();
  const control = /^(?:INPUT|TEXTAREA)$/.test(tag ?? '');
  if (
    control &&
    (!(
      node.readOnly ||
      node.disabled ||
      node.hasAttribute?.('readonly') ||
      node.hasAttribute?.('disabled')
    ) ||
      /^(?:password|hidden)$/i.test(node.type ?? ''))
  )
    return undefined;
  let value;
  if (rule.kind === 'attribute') value = node.getAttribute?.(rule.attribute);
  else if (rule.kind === 'value' || (!rule.kind && control)) value = control ? node.value : null;
  else
    value =
      (!rule.kind && field === 'userId' ? node.getAttribute?.('data-user-id') : null) ??
      node.innerText ??
      node.textContent;
  if (typeof value !== 'string') return undefined;
  value = value.replace(/\s+/g, ' ').trim();
  if (rule.prefix) {
    if (!value.startsWith(rule.prefix)) return undefined;
    value = value.slice(rule.prefix.length);
  }
  if (rule.suffix) {
    if (!value.endsWith(rule.suffix)) return undefined;
    value = value.slice(0, -rule.suffix.length);
  }
  if (rule.stopAt) {
    const stop = value.indexOf(rule.stopAt);
    if (stop >= 0) value = value.slice(0, stop).trim();
  }
  if (!rule.kind && field === 'userId') value = parseVisibleUserIdLabel(value)?.value ?? value;
  return normalizeIdentityFieldValue(field, value);
}

/** 仅使用结构或固定属性定位，不能生成 text=当前账号 / [data-user-id=当前ID]。 */
export function buildIdentityFieldSelector(node, document, currentValue) {
  const quote = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const stable = (value) =>
    typeof value === 'string' &&
    !!value &&
    value.length <= 100 &&
    !/\d{5,}|@|token|password|secret|^:r[\w:]+:$/i.test(value) &&
    (!currentValue || !value.toLowerCase().includes(currentValue.toLowerCase()));
  const unique = (selector) => {
    try {
      const nodes = document.querySelectorAll(selector);
      return nodes.length === 1 && nodes[0] === node;
    } catch {
      return false;
    }
  };
  for (const attribute of ['data-testid', 'id', 'name', 'aria-label']) {
    const value = node.getAttribute?.(attribute);
    if (!stable(value)) continue;
    const selector = `${node.tagName.toLowerCase()}[${attribute}="${quote(value)}"]`;
    if (unique(selector)) return selector;
  }
  const parts = [];
  for (let current = node; current && parts.length < 12; current = current.parentElement) {
    if (current === document.body || current === document.documentElement) {
      parts.unshift(current.tagName.toLowerCase());
      break;
    }
    const testId = current.getAttribute?.('data-testid');
    const id = current.getAttribute?.('id');
    if (current !== node && (stable(testId) || stable(id))) {
      parts.unshift(stable(testId) ? `[data-testid="${quote(testId)}"]` : `[id="${quote(id)}"]`);
      break;
    }
    const tag = current.tagName?.toLowerCase();
    if (!tag) return undefined;
    const siblings = [...(current.parentElement?.children ?? [current])].filter(
      (sibling) => sibling.tagName === current.tagName,
    );
    const index = siblings.indexOf(current);
    parts.unshift(siblings.length > 1 ? `${tag}:nth-of-type(${index + 1})` : tag);
  }
  const selector = parts.join(' > ');
  return selector.length <= 500 && unique(selector) ? selector : undefined;
}

export function describeIdentityField(node, field, document, observedValue) {
  if (!node || node === document.body || node === document.documentElement) return null;
  let kind = /^(?:INPUT|TEXTAREA)$/.test(node.tagName ?? '') ? 'value' : 'text';
  let raw = kind === 'value' ? node.value : (node.innerText ?? node.textContent);
  if (typeof raw !== 'string' || raw.length > 250) return null;
  raw = raw.replace(/\s+/g, ' ').trim();
  const idLabel = field === 'userId' ? parseVisibleUserIdLabel(raw) : null;
  if (idLabel && observedValue && idLabel.value !== observedValue) return null;
  let value = observedValue || normalizeIdentityFieldValue(field, idLabel?.value ?? raw);
  if (!value) {
    const labeled = raw.match(/^(.{1,50}?[:：#]\s*)([^\r\n]+)$/);
    if (labeled) value = normalizeIdentityFieldValue(field, labeled[2]);
  }
  if (!value) return null;
  const rule = { kind };
  const attributes =
    field === 'userId'
      ? ['data-user-id', 'data-uid']
      : field === 'username'
        ? ['data-username', 'data-user-name']
        : field === 'email'
          ? ['data-email']
          : [];
  for (const name of attributes)
    if (normalizeIdentityFieldValue(field, node.getAttribute?.(name)) === value) {
      rule.kind = 'attribute';
      rule.attribute = name;
      raw = value;
      break;
    }
  if (raw !== value && idLabel?.value === value && rule.kind === 'text') {
    rule.prefix = idLabel.prefix;
    if (idLabel.stopAt) rule.stopAt = idLabel.stopAt;
  } else if (raw !== value) {
    const index = raw.indexOf(value);
    if (index < 0 || raw.indexOf(value, index + value.length) >= 0) return null;
    if (index) rule.prefix = raw.slice(0, index);
    if (index + value.length < raw.length) rule.suffix = raw.slice(index + value.length);
  }
  if (!readIdentityFieldRules({ [field]: rule })) return null;
  if (readIdentityField(node, field, rule) !== value) return null;
  const selector = buildIdentityFieldSelector(node, document, value);
  return selector ? { value, selector, rule } : null;
}

/** 学习只重读页面实际访问过的、没有账号参数的当前用户接口。 */
export function discoverIdentityEndpoints(entries, origin) {
  const result = [];
  for (const entry of entries ?? []) {
    try {
      const url = new URL(typeof entry === 'string' ? entry : entry.name, origin);
      if (
        url.origin !== origin ||
        !/^https?:$/.test(url.protocol) ||
        url.username ||
        url.password ||
        url.search ||
        url.hash ||
        /\/(?:\d+|[0-9a-f]{8}-[0-9a-f-]{20,})(?:\/|$)/i.test(url.pathname) ||
        /(?:logout|signout|login|signin|register|check.?in|claim|delete|remove|token|keys?|invite|referral|list|search)/i.test(
          url.pathname,
        ) ||
        !/(?:^|\/)(?:me|self|whoami|who-am-i|current[-_]?user|current[-_]?account|userinfo|user[-_]?info|profile)(?:\/|$)|\/(?:user|account)\/(?:current|info)$/i.test(
          url.pathname,
        )
      )
        continue;
      if (!result.includes(url.pathname)) result.push(url.pathname);
      if (result.length >= 6) break;
    } catch {}
  }
  return result;
}

export function identitySourceLabel(source) {
  return source === 'api'
    ? '站点接口'
    : source === 'storage'
      ? '本地登录态'
      : source === 'visible'
        ? '页面文本'
        : '未知来源';
}

export function identitiesEqual(first, second) {
  return (
    typeof first === 'string' &&
    typeof second === 'string' &&
    !!first.trim() &&
    first.trim().toLowerCase() === second.trim().toLowerCase()
  );
}

/** 只解析当前用户对象及明确的响应容器，不扫描用户列表、令牌或邀请对象。 */
export function parseIdentityResponse(response, fieldPaths) {
  const record = (value) => !!value && typeof value === 'object' && !Array.isArray(value);
  const successful = (value) => {
    if (value.success === false || value.ok === false || value.status === false) return false;
    if (/^(?:error|failed|failure|unauthorized|forbidden)$/i.test(String(value.status ?? '')))
      return false;
    return value.code == null || /^(?:0|200|success|ok)$/i.test(String(value.code).trim());
  };
  const scalar = (value) => {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  };
  const identifier = (value) => {
    if (typeof value === 'number')
      return Number.isSafeInteger(value) && value >= 0 ? String(value) : undefined;
    if (typeof value === 'string' && /^[\w.:-]{1,128}$/.test(value.trim())) return value.trim();
  };
  const containers = [
    'user',
    'current_user',
    'currentUser',
    'user_info',
    'userInfo',
    'profile',
    'identity',
    'account',
    'current_account',
    'currentAccount',
    'me',
  ];
  const candidates = [];
  const conflictingIds = new Set();
  const seen = new Set();
  function collect(value, depth = 0) {
    if (!record(value) || depth > 4 || seen.has(value) || !successful(value)) return;
    seen.add(value);
    // Envelope IDs may identify a request rather than its user.
    const envelopes = ['data', 'result'].filter((key) => record(value[key]));
    if (Object.prototype.hasOwnProperty.call(value, 'data') || envelopes.length) {
      for (const key of envelopes) collect(value[key], depth + 1);
      for (const key of containers) if (record(value[key])) collect(value[key], depth + 1);
      return;
    }
    const nested = containers.filter((key) => record(value[key]));
    const ids = new Set(
      [value.id, value.user_id, value.userId, value.uid, value.account_id, value.accountId]
        .map(identifier)
        .filter(Boolean),
    );
    if (ids.size > 1) for (const id of ids) conflictingIds.add(id);
    const identity = {
      userId: ids.size === 1 ? [...ids][0] : undefined,
      username:
        scalar(value.username) ??
        scalar(value.user_name) ??
        scalar(value.login) ??
        scalar(value.handle),
      email: scalar(value.email),
      displayName:
        scalar(value.display_name) ??
        scalar(value.displayName) ??
        scalar(value.nickname) ??
        scalar(value.name),
    };
    if (identity.userId || identity.username || identity.email) {
      if (!nested.length || identity.username || identity.email || identity.displayName)
        candidates.push(identity);
    }
    for (const key of nested) collect(value[key], depth + 1);
  }
  collect(response);
  if (record(response) && successful(response) && record(fieldPaths)) {
    const mapped = {};
    const mappedFields = new Set();
    for (const field of ['userId', 'username', 'email', 'displayName']) {
      const path = fieldPaths[field];
      if (typeof path !== 'string' || !/^[\w-]+(?:\.[\w-]+)*$/.test(path)) continue;
      mappedFields.add(field);
      let value = response;
      for (const key of path.split('.')) {
        if (!record(value) || !successful(value) || !Object.hasOwn(value, key)) {
          value = undefined;
          break;
        }
        value = value[key];
      }
      mapped[field] = field === 'userId' ? identifier(value) : scalar(value);
    }
    // Explicit mappings select the site's actual user-ID namespace and
    // login fields; generic aliases may refer to a tenant or display name.
    for (const identity of candidates) for (const field of mappedFields) delete identity[field];
    if (mappedFields.has('userId')) conflictingIds.clear();
    if (mapped.userId || mapped.username || mapped.email) candidates.push(mapped);
  }
  const ids = new Set([
    ...conflictingIds,
    ...candidates.map((identity) => identity.userId).filter(Boolean),
  ]);
  if (ids.size > 1)
    return { identityConflict: `身份接口同时返回不同用户 ID（${[...ids].join('、')}）` };
  const result = {};
  for (const field of ['userId', 'username', 'email', 'displayName']) {
    const values = [...new Set(candidates.map((identity) => identity[field]).filter(Boolean))];
    if (values.length === 1) result[field] = values[0];
    else if (values.length > 1 && field !== 'displayName')
      return { identityConflict: `身份接口同时返回不同${field === 'email' ? '邮箱' : '用户名'}` };
  }
  return Object.keys(result).length ? result : null;
}

/** 从共用解析器认可的当前用户对象中取得字段路径，供本站以后所有账号重读。 */
export function discoverIdentityResponse(response, configuredFields) {
  const identity = parseIdentityResponse(response, configuredFields);
  if (!identity || identity.identityConflict) return { identity, responseFields: undefined };
  const aliases = {
    userId: ['id', 'user_id', 'userId', 'uid', 'account_id', 'accountId'],
    username: ['username', 'user_name', 'login', 'handle'],
    email: ['email'],
    displayName: ['display_name', 'displayName', 'nickname', 'name'],
  };
  const containers = [
    'user',
    'current_user',
    'currentUser',
    'user_info',
    'userInfo',
    'profile',
    'identity',
    'account',
    'current_account',
    'currentAccount',
    'me',
  ];
  const paths = new Map();
  function visit(value, path = [], depth = 0) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || depth > 4) return;
    const envelopes = ['data', 'result'].filter(
      (key) => value[key] && typeof value[key] === 'object' && !Array.isArray(value[key]),
    );
    if (!Object.hasOwn(value, 'data') && !envelopes.length)
      for (const [field, keys] of Object.entries(aliases)) {
        if (!identity[field] || configuredFields?.[field]) continue;
        for (const key of keys)
          if (
            Object.hasOwn(value, key) &&
            ['string', 'number'].includes(typeof value[key]) &&
            String(value[key]).trim() === identity[field]
          ) {
            const matches = paths.get(field) ?? [];
            matches.push([...path, key].join('.'));
            paths.set(field, matches);
          }
      }
    for (const key of [...envelopes, ...containers])
      if (Object.hasOwn(value, key)) visit(value[key], [...path, key], depth + 1);
  }
  visit(response);
  const responseFields = {};
  for (const field of Object.keys(aliases)) {
    if (!identity[field]) continue;
    const configured = configuredFields?.[field];
    if (typeof configured === 'string' && /^[\w-]+(?:\.[\w-]+)*$/.test(configured))
      responseFields[field] = configured;
    else {
      const candidates = paths.get(field);
      if (candidates?.length === 1) responseFields[field] = candidates[0];
    }
  }
  return {
    identity,
    responseFields: Object.keys(responseFields).length ? responseFields : undefined,
  };
}

export function findIdentityMatch(identity, username, aliases = [], expectedIdentity) {
  for (const field of ['username', 'email'])
    if (identitiesEqual(identity[field], expectedIdentity?.[field]))
      return { value: identity[field], expected: expectedIdentity[field], source: 'stored' };
  if (expectedIdentity?.username || expectedIdentity?.email) return null;
  for (const value of [identity.username, identity.email])
    if (identitiesEqual(value, username)) return { value, expected: username, source: 'primary' };
  for (const alias of aliases) {
    const field = typeof alias === 'string' && alias.includes('@') ? 'email' : 'username';
    if (identitiesEqual(identity[field], alias))
      return { value: identity[field], expected: alias, source: 'alias' };
  }
  return null;
}

export function findIdentityOwner(identity, knownIdentities = []) {
  return knownIdentities.find((known) => {
    if (identity?.userId && known.userId) return String(identity.userId) === String(known.userId);
    return ['username', 'email'].some((field) => identitiesEqual(identity?.[field], known[field]));
  });
}

export function conflictingIdentitySamples(first, second) {
  if (first?.identityConflict || second?.identityConflict) return true;
  if (first?.userId && second?.userId) return String(first.userId) !== String(second.userId);
  return ['username', 'email'].some(
    (field) => first?.[field] && second?.[field] && !identitiesEqual(first[field], second[field]),
  );
}

/** ID 已绑定时必须核对 ID；没有 ID 的站点才按完整用户名 / 邮箱核对。 */
export function compareAccountIdentity(identity, username, expectedUserId, options = {}) {
  if (identity?.identityConflict)
    return { match: 'unknown', detail: `身份证据冲突：${identity.identityConflict}` };
  if (!identity)
    return {
      match: 'unknown',
      detail: expectedUserId
        ? `本账号已绑定用户 ID ${expectedUserId}，当前页面尚未返回用户 ID`
        : '读不到当前登录身份',
    };
  const origin = `读自${identitySourceLabel(identity.source)}`;
  const owner = identity.userId ? options.knownUsers?.[identity.userId] : undefined;
  if (owner)
    return {
      match: 'mismatch',
      detail: `当前登录的是用户 ID ${identity.userId}（本站账号 ${owner}，${origin}），本次要签到的是 ${expectedUserId ?? username}`,
    };
  if (expectedUserId) {
    if (!identity.userId)
      return {
        match: 'unknown',
        detail: `本账号已绑定用户 ID ${expectedUserId}，当前页面尚未返回用户 ID（${origin}）`,
      };
    if (String(identity.userId) !== String(expectedUserId))
      return {
        match: 'mismatch',
        detail: `当前登录的是用户 ID ${identity.userId}（${origin}），本次要签到的是 ${expectedUserId}`,
      };
    if (identity.source === 'storage')
      return { match: 'unknown', detail: '本地保存的用户 ID 相同，但尚未确认当前登录会话' };
    return {
      match: 'confirmed',
      detail: `用户 ID ${identity.userId} 一致（${origin}，账号备注不参与身份核验）`,
    };
  }
  if (identity.source === 'storage')
    return { match: 'unknown', detail: '本地登录态只是身份提示，不能证明当前登录账号' };
  const nameOwner = findIdentityOwner(identity, options.knownIdentities);
  if (nameOwner)
    return {
      match: 'mismatch',
      detail: `当前登录名已绑定给本站其他账号 ${nameOwner.label ?? nameOwner.username ?? nameOwner.email}`,
    };
  const match = findIdentityMatch(
    identity,
    username,
    options.expectedAliases,
    options.expectedIdentity,
  );
  if (match)
    return {
      match: 'confirmed',
      detail:
        match.source === 'stored'
          ? `账号 ${username} 已保存的站点身份 ${match.expected} 与当前身份一致（${origin}）`
          : match.source === 'alias'
            ? `账号 ${username} 保存的身份别名 ${match.expected} 与当前身份 ${match.value} 一致（${origin}）`
            : `账号 ${username} 的完整登录标识一致（${origin}）`,
    };
  if (
    (options.expectedIdentity?.username || options.expectedIdentity?.email) &&
    !['username', 'email'].some((field) => options.expectedIdentity[field] && identity[field])
  )
    return {
      match: 'unknown',
      detail: `本站已绑定登录标识 ${options.expectedIdentity.username ?? options.expectedIdentity.email}，当前尚未返回可核对的字段（${origin}）`,
    };
  const currentName = identity.username ?? identity.email;
  return currentName
    ? {
        match: 'mismatch',
        detail: `当前登录的是 ${currentName}（${origin}），本次要签到的是 ${options.expectedIdentity?.username ?? options.expectedIdentity?.email ?? username}`,
      }
    : { match: 'unknown', detail: `站点未返回可比对的登录名（${origin}，昵称不作为唯一身份）` };
}

export function identitySampleKey(identity) {
  if (!identity || identity.identityConflict || identity.source === 'storage') return null;
  if (identity.userId) return JSON.stringify([identity.source, 'id', String(identity.userId)]);
  if (!identity.username && !identity.email) return null;
  return JSON.stringify([
    identity.source,
    'name',
    identity.username?.trim().toLowerCase(),
    identity.email?.trim().toLowerCase(),
  ]);
}

export function stableIdentitySamples(first, second) {
  const key = identitySampleKey(first);
  return !!key && key === identitySampleKey(second);
}

/** 在已确认的身份页内才使用简写 ID；绝不从整页任意 ID / 昵称猜测当前账号。 */
export function resolveIdentityPage(site, document, location) {
  const safeUrl = (path) => {
    try {
      const url = new URL(path, site.loginUrl);
      if (
        url.origin !== new URL(site.loginUrl).origin ||
        url.origin !== location.origin ||
        url.username ||
        url.password ||
        url.search ||
        /(?:access_token|refresh_token|id_token|code|state|token|secret|password)=/i.test(url.hash)
      )
        return null;
      return url.href;
    } catch {
      return null;
    }
  };
  const configured = readIdentitySource(site)?.pagePath;
  if (configured) return safeUrl(configured);
  for (const link of document?.querySelectorAll?.('a[href]') ?? []) {
    if (
      !isIdentityElementVisible(link) ||
      !link.closest?.('header, nav, aside, [role="banner"], [role="navigation"], .semi-navigation')
    )
      continue;
    const label = [
      link.innerText,
      link.getAttribute('aria-label'),
      link.getAttribute('title'),
    ].join(' ');
    if (
      !/个人(?:设置|资料|中心|信息)|我的(?:账户|账号)|\b(?:profile|personal|my account|account settings)\b/i.test(
        label,
      )
    )
      continue;
    const url = safeUrl(link.getAttribute('href'));
    if (url) return url;
  }
  return null;
}

export class SiteIdentityResolver {
  constructor({
    getFamily = (site) => site.adapter?.family,
    readStorage = () => undefined,
    readPage = (site) =>
      readVisibleAccountIdentity(
        globalThis.document,
        globalThis.location,
        readIdentitySource(site),
      ),
    userIdHeaders = () => ({}),
    bootstrapHeaders = async () => ({}),
    readExternal = async () => null,
    getOrigin = () => globalThis.location.origin,
    getResources = () => globalThis.performance?.getEntriesByType?.('resource') ?? [],
    fetch: request = (...args) => globalThis.fetch(...args),
    transportHints = new Map(),
  } = {}) {
    Object.assign(this, {
      getFamily,
      readStorage,
      readPage,
      userIdHeaders,
      bootstrapHeaders,
      readExternal,
      getOrigin,
      getResources,
      request,
      transportHints,
    });
  }

  /** 每次都请求当前会话；只记住成功的接口位置，不缓存身份或凭据。 */
  async read(site, explicitToken, options = {}) {
    const family = this.getFamily(site);
    const source = readIdentitySource(site);
    const origin = this.getOrigin();
    const sameOrigin = (endpoint) => {
      try {
        const url = new URL(endpoint, origin);
        return url.origin === origin && url.origin === new URL(site.loginUrl).origin;
      } catch {
        return false;
      }
    };
    const stored = (key, type) => {
      if (!key) return null;
      try {
        return parseIdentityResponse(JSON.parse(this.readStorage(key, type)));
      } catch {
        return null;
      }
    };
    const hint =
      (source?.storageKey && stored(source.storageKey, source.storageType)?.userId) ??
      stored('user')?.userId ??
      (family === 'sub2api' ? stored('auth_user')?.userId : undefined);
    const defaults =
      family === 'sub2api'
        ? ['/api/v1/auth/me', '/api/user/self', '/api/user/info']
        : ['/api/user/self', '/api/user/info', '/api/v1/auth/me'];
    const endpoints = [
      ...new Set(
        site.tokenConfig?.identityEndpoint
          ? [site.tokenConfig.identityEndpoint]
          : source?.endpoint && !sameOrigin(source.endpoint)
            ? []
            : [
                ...(source?.endpoint && sameOrigin(source.endpoint) ? [source.endpoint] : []),
                ...(options.discover === true
                  ? discoverIdentityEndpoints(this.getResources(), origin)
                  : []),
                ...defaults,
              ],
      ),
    ];
    const deadline = Date.now() + (options.timeoutMs ?? 4000);
    const key = JSON.stringify([
      site.id,
      origin,
      explicitToken ? 'explicit-token' : 'browser-session',
      endpoints.map((endpoint) => {
        try {
          const url = new URL(endpoint, origin);
          return `${url.origin}${url.pathname}`;
        } catch {
          return null;
        }
      }),
      site.tokenConfig?.headerName,
      source?.responseFields,
      !!source?.endpoint,
      !!site.authBootstrap?.endpoint,
    ]);
    const canRemember = endpoints.every((endpoint) => {
      try {
        const url = new URL(endpoint, origin);
        return !url.search && !url.hash;
      } catch {
        return false;
      }
    });
    const remembered = canRemember ? this.transportHints.get(key) : null;
    const attempted = new Set();
    let partial = null;
    const diagnostics = new Set();
    const trace = (endpoint, mode, detail) => {
      if (!options.diagnostics?.push) return;
      const message = `身份接口 ${endpoint}（${mode}）：${detail}`;
      if (!diagnostics.has(message)) {
        diagnostics.add(message);
        options.diagnostics.push(message);
      }
    };
    const modes = {
      cookie: '当前会话',
      hint: '当前页面用户提示头',
      token: '本站 Token',
      bootstrap: '会话令牌引导',
    };
    const read = async (headers, credentials, candidates = endpoints, mode = 'cookie') => {
      for (const endpoint of candidates) {
        let url;
        try {
          url = new URL(endpoint, origin);
        } catch {
          continue;
        }
        const attempt = `${mode}|${url.href}`;
        if (!sameOrigin(url.href) || Date.now() >= deadline || attempted.has(attempt)) continue;
        attempted.add(attempt);
        const controller = new AbortController();
        const timer = setTimeout(
          () => controller.abort(),
          Math.min(1500, Math.max(1, deadline - Date.now())),
        );
        try {
          const response = await this.request(url.href, {
            method: 'GET',
            credentials,
            headers: { Accept: 'application/json', ...headers },
            cache: 'no-store',
            redirect: 'error',
            signal: controller.signal,
          });
          if (!response.ok) {
            trace(url.pathname, modes[mode], `HTTP ${response.status}`);
            continue;
          }
          if (response.redirected || (response.url && new URL(response.url).href !== url.href)) {
            trace(url.pathname, modes[mode], '响应发生跳转，未采用身份');
            continue;
          }
          const type = response.headers.get('content-type')?.toLowerCase() ?? '';
          if (!type.includes('json')) {
            trace(
              url.pathname,
              modes[mode],
              type.includes('html')
                ? '返回 HTML 页面，可能是访问验证或登录页'
                : '响应不是 JSON 用户资料',
            );
            continue;
          }
          const body = await response.json().catch(() => null);
          const discovered =
            options.discover === true
              ? discoverIdentityResponse(body, source?.responseFields)
              : null;
          const identity =
            discovered?.identity ?? parseIdentityResponse(body, source?.responseFields);
          if (!identity) {
            trace(url.pathname, modes[mode], '未返回有效的当前用户字段');
            continue;
          }
          const evidence = {
            ...identity,
            source: 'api',
            endpoint: url.pathname,
            ...(options.discover === true && !url.search && !url.hash && discovered?.responseFields
              ? {
                  identitySource: {
                    endpoint: url.pathname,
                    responseFields: discovered.responseFields,
                  },
                }
              : {}),
          };
          if (identity.identityConflict) return evidence;
          // Name-only sites also remember their transport and still read fresh samples.
          if (identity.userId || (!partial && (identity.username || identity.email))) {
            if (!url.search && !url.hash) this.transportHints.set(key, { endpoint, mode });
            if (identity.userId) return evidence;
          }
          partial ??= evidence;
        } catch (error) {
          trace(
            url.pathname,
            modes[mode],
            error?.name === 'AbortError' ? '请求超时' : '请求失败或被站点访问校验拦截',
          );
        } finally {
          clearTimeout(timer);
        }
      }
      return null;
    };
    const readCookie = async (candidates = endpoints) => {
      for (const endpoint of candidates) {
        let identity = await read({}, 'include', [endpoint], 'cookie');
        if (identity) return identity;
        if (hint) {
          identity = await read(this.userIdHeaders(hint), 'include', [endpoint], 'hint');
          if (identity) return identity;
        }
      }
      return null;
    };
    let token =
      explicitToken ??
      (site.tokenConfig
        ? this.readStorage(site.tokenConfig.storageKey, site.tokenConfig.storageType)
        : source?.tokenKey
          ? this.readStorage(source.tokenKey, source.tokenStorageType)
          : undefined);
    if (!token && family === 'sub2api')
      for (const storageKey of ['auth_token', 'access_token', 'token']) {
        const value = this.readStorage(storageKey);
        if (value && value.length > 20 && !value.startsWith('{')) {
          token = value;
          break;
        }
      }
    const authorization = token
      ? {
          [site.tokenConfig?.headerName || source?.tokenHeader || 'Authorization']:
            `${site.tokenConfig?.headerPrefix ?? source?.tokenPrefix ?? 'Bearer '}${token}`,
        }
      : null;
    if (remembered) {
      let identity = null;
      if (explicitToken && remembered.mode === 'token' && authorization)
        identity = await read(
          { ...authorization, ...this.userIdHeaders(hint) },
          'omit',
          [remembered.endpoint],
          'token',
        );
      else if (!explicitToken) {
        identity =
          remembered.mode === 'hint' && hint
            ? await read(this.userIdHeaders(hint), 'include', [remembered.endpoint], 'hint')
            : await readCookie([remembered.endpoint]);
        if (!identity && remembered.mode === 'token' && authorization)
          identity = await read(
            { ...authorization, ...this.userIdHeaders(hint) },
            'omit',
            [remembered.endpoint],
            'token',
          );
        if (!identity && remembered.mode === 'bootstrap' && site.authBootstrap) {
          const headers = await this.bootstrapHeaders(site);
          if (Object.keys(headers).length)
            identity = await read(
              { ...headers, ...this.userIdHeaders(hint) },
              'omit',
              [remembered.endpoint],
              'bootstrap',
            );
        }
      }
      if (identity) return identity;
      this.transportHints.delete(key);
    }
    if (!explicitToken) {
      const identity = await readCookie();
      if (identity) return identity;
    }
    if (authorization) {
      const identity = await read(
        { ...authorization, ...this.userIdHeaders(hint) },
        'omit',
        endpoints,
        'token',
      );
      if (identity) return identity;
    }
    if (source?.endpoint && !sameOrigin(source.endpoint) && Date.now() < deadline) {
      const identity = await this.readExternal(site, source, explicitToken);
      if (identity?.userId || identity?.identityConflict) return identity;
      partial ??= identity;
    }
    if (!explicitToken && site.authBootstrap && Date.now() < deadline) {
      const headers = await this.bootstrapHeaders(site);
      if (Object.keys(headers).length) {
        const identity = await read(
          { ...headers, ...this.userIdHeaders(hint) },
          'omit',
          endpoints,
          'bootstrap',
        );
        if (identity) return identity;
      }
    }
    if (options.serverOnly === true || explicitToken) return partial;
    const visible = this.readPage(site);
    if (!partial) return visible;
    if (visible?.identityConflict) return visible;
    if (visible?.userId) {
      if (
        (partial.username &&
          visible.username &&
          !identitiesEqual(partial.username, visible.username)) ||
        (partial.email && visible.email && !identitiesEqual(partial.email, visible.email))
      )
        return {
          source: 'visible',
          identityConflict: `身份接口的登录名与页面用户 ID ${visible.userId} 所属账号不一致`,
        };
      return { ...partial, ...visible };
    }
    return partial;
  }
}

const identityPatterns = {
  excludedText:
    /(邀请|受邀|推荐|推广|上级|下级|下线|团队|排行|榜|赞助|作者|客服|管理员|中奖|获奖|公告|invit|referr|sponsor|winner|leaderboard|announcement)/i,
  excludedSection:
    /中奖(?:名单|记录|用户)|获奖(?:名单|记录)|排行榜|排名榜|用户列表|成员列表|历史记录|公告|\b(?:winners?|leaderboard|rankings?|draw history|announcements?)\b/i,
  profileTitle:
    /^(?:个人资料|个人信息|账户信息|账号信息|我的账户|我的账号|我的资料|profile|my account|account (?:info(?:rmation)?|details))\s*[:：]?$/i,
  personalLabel: /^(?:当前(?:登录)?(?:账号|账户|用户)|我的(?:账号|账户|邮箱))\s*[:：]?/,
  identityLabel:
    /(?<![A-Za-z])(?:用户\s*ID|User\s*ID|UID)\s*[:：#]?\s*\d|当前(?:登录)?(?:账号|账户|用户)|用户名|登录名|账[号户]|邮箱|电子邮件|\b(?:e-?mail|username|account)\b|欢迎回来|welcome back/i,
  accountMenu:
    /退出登录|退出账号|注销登录|个人资料|账户设置|账号设置|\b(?:log\s*out|sign\s*out|my account|account settings|profile)\b/i,
};

function filterIdentityText(e, t = !1) {
  if (!e) return ``;
  let n = [],
    r = !1,
    i = !1;
  for (let a of e
    .split(/[\r\n]+/)
    .map((e) => e.trim())
    .filter(Boolean)) {
    if (identityPatterns.excludedSection.test(a)) {
      ((r = !0), (i = !1));
      continue;
    }
    let e = identityPatterns.profileTitle.test(a);
    if (
      ((e || identityPatterns.personalLabel.test(a)) && (r = !1),
      r || identityPatterns.excludedText.test(a))
    ) {
      i = !1;
      continue;
    }
    let o = e || identityPatterns.identityLabel.test(a),
      s = i && /^[^\s<>]{2,80}(?:\s*[·|]\s*[^\r\n]{1,40})?$/.test(a);
    ((t || o || s) && n.push(a), (i = o));
  }
  return n.join(`
`);
}

function isIdentityElementVisible(e) {
  for (let t = e; t; t = t.parentElement) {
    if (t.hidden || t.getAttribute(`aria-hidden`) === `true` || t.hasAttribute(`inert`)) return !1;
    let e = getComputedStyle(t);
    if (
      e.display === `none` ||
      e.visibility === `hidden` ||
      e.visibility === `collapse` ||
      Number.parseFloat(e.opacity || `1`) <= 0.02
    )
      return !1;
  }
  return !0;
}

function collectIdentityText(document = globalThis.document) {
  let bodyText = document.body?.innerText;
  if (document.body && typeof document.createTreeWalker === 'function') {
    const text = [];
    const walker = document.createTreeWalker(document.body, 4);
    let node;
    let count = 0;
    while ((node = walker.nextNode()) && count++ < 6000) {
      const parent = node.parentElement;
      if (
        !parent ||
        parent.closest?.(
          'script, style, table, [role="table"], [role="grid"], [role="list"], [role="listitem"], .lottery-sidebar, [data-checkin-learning-guide]',
        ) ||
        parent.closest?.('form')?.querySelector?.('input[type="password"]') ||
        !isIdentityElementVisible(parent)
      )
        continue;
      if (node.textContent?.trim()) text.push(node.textContent.trim());
    }
    bodyText = text.join('\n');
  }
  let e = [(0, filterIdentityText)(bodyText)];
  if (typeof document.querySelectorAll != `function`) return e[0];
  for (let t of document.querySelectorAll(
    `[role="menu"], [aria-haspopup="menu"], [aria-haspopup="true"]`,
  )) {
    if (
      !(0, isIdentityElementVisible)(t) ||
      t.closest(`table, [role="table"], [role="grid"], .lottery-sidebar`)
    )
      continue;
    let n = t.innerText ?? t.textContent ?? ``;
    if (!n.trim() || n.length > 2e3) continue;
    let r = t.getAttribute(`role`) === `menu` && identityPatterns.accountMenu.test(n),
      i =
        t.hasAttribute(`aria-haspopup`) &&
        (!!t.closest(`header, nav, [role="banner"]`) ||
          /user|account|profile|avatar|用户|账号|账户|个人|头像/i.test(
            `${t.getAttribute(`aria-label`) ?? ``} ${t.getAttribute(`title`) ?? ``}`,
          ));
    (r || i) && e.push((0, filterIdentityText)(n, !0));
  }
  return e.filter(Boolean).join(`
`);
}

function uniqueIdentityValue(e) {
  let t = new Map(e.map((e) => [e.toLowerCase(), e]));
  return t.size === 1 ? t.values().next().value : void 0;
}

function parseVisibleIdentity(e) {
  if (!e) return null;
  let t = { source: `visible` },
    ids = (0, findVisibleUserIds)(e, !0);
  if (ids.length > 1)
    return {
      source: `visible`,
      identityConflict: `页面同时显示多个当前用户 ID（${ids.join(`、`)}）`,
    };
  ids[0] && (t.userId = ids[0]);
  let r = [...e.matchAll(/(?<![\w.+@*-])@([A-Za-z0-9][A-Za-z0-9._-]{1,38})\b/g)]
      .map((e) => e[1])
      .filter((e) => !e.includes(`.`)),
    i = [
      ...e.matchAll(
        /(?:^|\s)(?:用户名|登录名|当前(?:登录)?(?:账号|账户)|username|login name)(?:\s*[:：]\s*|\s+)([\p{L}\p{N}][\p{L}\p{N}._+@-]{1,79})/giu,
      ),
    ]
      .map((e) => e[1])
      .filter((e) => !e.includes(`@`)),
    a = (0, uniqueIdentityValue)(i.length ? i : r);
  a && (t.username = a);
  let o = (0, uniqueIdentityValue)(
    [...e.matchAll(/(?<![\w.+*-])[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g)].map((e) => e[0]),
  );
  return (o && (t.email = o), t.userId || t.username || t.email ? t : null);
}

export function readVisibleAccountIdentity(
  document = globalThis.document,
  location = globalThis.location,
  source = {},
  options = {},
) {
  if (!document) return null;
  const textIdentity = (0, parseVisibleIdentity)((0, collectIdentityText)(document));
  if (typeof document.querySelectorAll !== `function`) return textIdentity;
  const values = new Map();
  const locations = new Map();
  const profileWords =
    /个人资料|个人信息|我的(?:账户|账号|资料)|(?:^|[\s_-])(?:profile|personal|my[-_ ]account|account[-_ ](?:info|details)|user[-_ ]info)(?:$|[\s_-])/i;
  const excludedWords =
    /中奖|获奖|邀请|推荐|排行榜|用户列表|成员列表|公告|(?:^|[\s_-])(?:winners?|leaderboard|rankings?|user[-_ ]list|member[-_ ]list|invitation|referral|announcement)(?:$|[\s_-])/i;
  const profilePath = /\/(?:profile|personal|account|account-settings|my-account)(?:\/|$)/i.test(
    `${typeof location === `undefined` ? `` : location.pathname}${typeof location === `undefined` ? `` : location.hash}`,
  );
  function fieldName(label) {
    const name = String(label ?? ``)
      .replace(/[:：#*＊]/g, ``)
      .replace(/[\s_-]+/g, ``)
      .toLowerCase();
    if (/^(?:用户id|用户编号|账号id|账户id|userid|uid|accountid|id)$/.test(name)) return `userId`;
    if (
      /^(?:用户名|登录名|账号名|账户名|账号|账户|当前(?:登录)?(?:账号|账户|用户)|我的(?:账号|账户)|username|loginname|account|currentuser|currentaccount|myaccount)$/.test(
        name,
      )
    )
      return `username`;
    if (/^(?:邮箱|电子邮箱|电子邮件|我的邮箱|email|emailaddress)$/.test(name)) return `email`;
    if (/^(?:昵称|显示名称|displayname|nickname)$/.test(name)) return `displayName`;
    return null;
  }
  function metadata(node) {
    return [
      node.getAttribute?.(`aria-label`),
      node.getAttribute?.(`title`),
      node.getAttribute?.(`data-testid`),
      node.id,
      typeof node.className === `string` ? node.className : ``,
    ]
      .filter(Boolean)
      .join(` `);
  }
  function excluded(node) {
    if (!(0, isIdentityElementVisible)(node)) return !0;
    if (
      node.closest?.(
        `table, [role="table"], [role="grid"], [role="list"], [role="listitem"], .lottery-sidebar`,
      )
    )
      return !0;
    for (
      let current = node;
      current && !/^(?:BODY|HTML)$/.test(current.tagName);
      current = current.parentElement
    ) {
      if (excludedWords.test(metadata(current))) return !0;
      const heading = current.querySelector?.(
        `:scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > [role="heading"]`,
      );
      if (heading && excludedWords.test(heading.innerText ?? heading.textContent ?? ``)) return !0;
    }
    const form = node.closest?.(`form`);
    return !!form?.querySelector?.(`input[type="password"]`);
  }
  function profileArea(node, label) {
    if (/^(?:当前|我的|current\s|my\s)/i.test(String(label ?? ``).trim())) return !0;
    if (profilePath) return !0;
    if (source?.pagePath) {
      try {
        const url = new URL(source.pagePath, location.href);
        if (
          url.origin === location.origin &&
          `${url.pathname}${url.hash}` === `${location.pathname}${location.hash}`
        )
          return !0;
      } catch {}
    }
    for (
      let current = node;
      current && !/^(?:BODY|HTML)$/.test(current.tagName);
      current = current.parentElement
    ) {
      if (profileWords.test(metadata(current))) return !0;
      const heading = current.querySelector?.(
        `:scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > [role="heading"]`,
      );
      if (heading && profileWords.test(heading.innerText ?? heading.textContent ?? ``)) return !0;
    }
    return !1;
  }
  function add(label, node, value, explicit = false) {
    const field = fieldName(label);
    if (!field || !node || excluded(node) || (!explicit && !profileArea(node, label))) return;
    const normalized = String(value ?? ``).trim();
    if (!normalized || normalized.length > 128 || /[\r\n]/.test(normalized)) return;
    if (field === `userId` && !/^[\w.:-]{1,128}$/.test(normalized)) return;
    if (field === `username` && !/^[\p{L}\p{N}@][\p{L}\p{N}._+@'-]{1,79}$/u.test(normalized))
      return;
    if (field === `email` && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return;
    const candidates = values.get(field) ?? new Set();
    candidates.add(normalized);
    values.set(field, candidates);
    if (options.collectSource === true) {
      const descriptor = describeIdentityField(node, field, document, normalized);
      if (descriptor) {
        const fields = locations.get(field) ?? [];
        fields.push(descriptor);
        locations.set(field, fields);
      }
    }
  }
  function controlValue(control) {
    const tag = control?.tagName?.toUpperCase();
    if (tag === `OUTPUT`) return control.innerText ?? control.textContent;
    if (
      (tag === `INPUT` || tag === `TEXTAREA`) &&
      (control.readOnly ||
        control.disabled ||
        control.hasAttribute?.(`readonly`) ||
        control.hasAttribute?.(`disabled`)) &&
      !/^(?:password|hidden)$/i.test(control.type ?? ``)
    )
      return control.value;
    return null;
  }
  for (const term of document.querySelectorAll(`dt`)) {
    const description = term.nextElementSibling;
    if (description?.tagName?.toUpperCase() !== `DD` || excluded(term)) continue;
    add(
      term.innerText ?? term.textContent,
      description,
      description.innerText ?? description.textContent,
    );
  }
  for (const label of document.querySelectorAll(`label`)) {
    if (excluded(label)) continue;
    const id = label.htmlFor || label.getAttribute?.(`for`);
    const control = id
      ? document.getElementById?.(id)
      : label.querySelector?.(`input, textarea, output`);
    add(label.innerText ?? label.textContent, control, controlValue(control));
  }
  for (const control of document.querySelectorAll(
    `input[readonly], input[disabled], textarea[readonly], textarea[disabled], output`,
  )) {
    const label =
      control.getAttribute?.(`aria-label`) || control.getAttribute?.(`name`) || control.id;
    add(label, control, controlValue(control));
  }
  let profileCardFound = false;
  for (const tag of document.querySelectorAll(`.semi-tag`)) {
    const match = (tag.innerText ?? tag.textContent ?? ``)
      .trim()
      .match(/^(?:用户\s*ID|User\s*ID|UID|ID)\s*[:：#]\s*([\w.:-]{1,128})$/i);
    if (!match || excluded(tag) || !profileArea(tag, `ID`)) continue;
    // 当前用户卡片：头像 + 登录名 + 用户角色 / ID 徽章。
    const nameNode = tag.parentElement?.previousElementSibling;
    const name = (nameNode?.innerText ?? nameNode?.textContent ?? ``).trim();
    if (!nameNode || !/^[\p{L}\p{N}@][\p{L}\p{N}._+@'-]{1,79}$/u.test(name)) continue;
    let card = tag.parentElement;
    for (let depth = 0; card && depth < 4; depth++, card = card.parentElement) {
      if (excluded(card)) break;
      if (
        card.querySelector?.(`.semi-avatar, [data-testid="user-avatar"], [aria-label="用户头像"]`)
      ) {
        add(`用户 ID`, tag, match[1]);
        add(`用户名`, nameNode, name);
        profileCardFound = true;
        break;
      }
    }
  }
  for (const node of [...document.querySelectorAll(`div, span, p`)].slice(0, 1500)) {
    if (node.children?.length || excluded(node) || !profileArea(node, `ID`)) continue;
    const label = parseVisibleUserIdLabel(node.innerText ?? node.textContent);
    if (!label) continue;
    let currentCard = false;
    for (
      let card = node.parentElement, depth = 0;
      card && depth < 3;
      depth++, card = card.parentElement
    ) {
      if (excluded(card) || /^(?:BODY|HTML)$/.test(card.tagName)) break;
      const context = (card.innerText ?? card.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (
        context.length <= 350 &&
        /(?:^|\s)(?:current\s+(?:user|account)|当前(?:用户|账号|账户))(?:\s|[:：]|$)/i.test(context)
      ) {
        currentCard = true;
        break;
      }
    }
    if (currentCard) {
      add(`用户 ID`, node, label.value);
      profileCardFound = true;
    }
  }
  const fieldLabels = {
    userId: `用户 ID`,
    username: `用户名`,
    email: `邮箱`,
    displayName: `昵称`,
  };
  const mappedFields = new Set(
    Object.keys(source?.pageFields ?? {}).filter((field) => fieldLabels[field]),
  );
  for (const field of mappedFields) {
    values.delete(field);
    locations.delete(field);
  }
  let onIdentityPage = true;
  if (source?.pagePath) {
    try {
      const page = new URL(source.pagePath, location.href);
      onIdentityPage =
        page.origin === location.origin &&
        page.pathname + page.hash === location.pathname + location.hash;
    } catch {
      onIdentityPage = false;
    }
  }
  let mappedConflict;
  for (const [field, selector] of Object.entries(source?.pageFields ?? {})) {
    if (!fieldLabels[field]) continue;
    let nodes;
    try {
      nodes = onIdentityPage
        ? [...document.querySelectorAll(selector)].filter(isIdentityElementVisible)
        : [];
    } catch {
      continue;
    }
    if (nodes.length > 1) {
      mappedConflict = `本站保存的${fieldLabels[field]}读取位置命中了多个可见元素`;
      continue;
    }
    const node = nodes[0];
    const rule = source.pageFieldRules?.[field];
    const value = readIdentityField(node, field, rule);
    if (!value) continue;
    values.set(field, new Set([value]));
    if (options.collectSource === true) {
      const descriptor = describeIdentityField(node, field, document, value);
      if (descriptor)
        locations.set(field, [{ ...descriptor, selector, ...(rule ? { rule } : {}) }]);
    }
  }
  if (mappedConflict) return { source: 'visible', identityConflict: mappedConflict };
  const ids = new Set(values.get(`userId`) ?? []);
  if (textIdentity?.userId && !mappedFields.has('userId')) ids.add(textIdentity.userId);
  if (textIdentity?.identityConflict && !mappedFields.has('userId')) return textIdentity;
  if (ids.size > 1)
    return {
      source: `visible`,
      identityConflict: `页面同时显示多个当前用户 ID（${[...ids].join(`、`)}）`,
    };
  const identity = { ...textIdentity, source: `visible` };
  for (const field of mappedFields) delete identity[field];
  if (mappedFields.has('userId')) delete identity.identityConflict;
  for (const [field, candidates] of values)
    if (candidates.size === 1) identity[field] = [...candidates][0];
  if (values.size) identity.evidence = profileCardFound ? `profile-card` : `structured-fields`;
  if (options.collectSource === true && location?.origin) {
    const pageFields = {};
    const pageFieldRules = {};
    for (const [field, descriptors] of locations) {
      const descriptor = descriptors.find((item) => item.value === identity[field]);
      if (!descriptor || new Set(descriptors.map((item) => item.selector)).size !== 1) continue;
      pageFields[field] = descriptor.selector;
      pageFieldRules[field] = descriptor.rule;
    }
    if (Object.keys(pageFields).length)
      identity.identitySource = {
        pagePath: location.pathname + location.hash,
        pageFields,
        pageFieldRules,
      };
  }
  return identity.userId || identity.username || identity.email ? identity : null;
}

function findVisibleUserIds(e, all = !1) {
  let t = /(?<![A-Za-z])(?:用户\s*ID|User\s*ID|UID)\s*[:：#]?\s*(\d{1,12})\b/gi,
    n = new Set();
  for (let r of e.matchAll(t)) {
    let t = r[1];
    if (!t) continue;
    let i = e.slice(Math.max(0, (r.index ?? 0) - 14), r.index ?? 0);
    identityPatterns.excludedText.test(i) || n.add(t);
  }
  return all ? [...n] : n.size === 1 ? [...n][0] : void 0;
}
