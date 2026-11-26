import { readIdentitySource } from './account-identity.js';

/**
 * 从站点公开前端验证过的当前用户读取位置。只补齐位置，始终用当前页面的会话令牌。
 * 用户保存的接口配置优先；域名必须精确匹配，不能将令牌发往相似域名。
 */
export function withSiteIdentityRecipe(site) {
  let origin;
  try {
    origin = new URL(site.loginUrl).origin;
  } catch {
    return site;
  }
  if (origin !== 'https://orevx.ai') return site;
  const source = readIdentitySource(site) ?? {};
  if (source.endpoint) return site;
  return {
    ...site,
    identitySource: {
      ...source,
      storageKey: source.storageKey ?? 'auth-user',
      tokenKey: source.tokenKey ?? 'auth-token',
      tokenHeader: source.tokenHeader ?? 'Authorization',
      tokenPrefix: source.tokenPrefix ?? 'Bearer ',
      pagePath: source.pagePath ?? '/user/profile',
      // An absent/blank endpoint is a request to use the validated current-user location.
      endpoint: 'https://server.orevx.ai/api/user/me',
    },
  };
}

/**
 * Orevx 的账号菜单使用 TreeGrid 菜单行；折叠时仍保留可访问标签和操作键。
 * 这些证据只判断登录界面状态，不返回、更不绑定当前用户名或用户 ID。
 */
export function readSiteLoginEvidence(site, document, location, isVisible) {
  let origin;
  try {
    origin = new URL(site.loginUrl).origin;
  } catch {
    return {};
  }
  if (
    origin !== 'https://orevx.ai' ||
    location.origin !== origin ||
    !/^\/(?:user|dashboard)(?:\/|$)/i.test(location.pathname)
  )
    return {};
  const visible = (node) => {
    if (!node || !isVisible(node)) return false;
    for (let parent = node; parent; parent = parent.parentElement)
      if (
        parent.hidden ||
        parent.getAttribute?.('aria-hidden') === 'true' ||
        parent.hasAttribute?.('inert')
      )
        return false;
    return true;
  };
  const enabled = (node) =>
    visible(node) &&
    !node.disabled &&
    !node.hasAttribute?.('disabled') &&
    node.getAttribute?.('aria-disabled') !== 'true' &&
    (!node.hasAttribute?.('data-disabled') || node.getAttribute?.('data-disabled') === 'false');
  const userControl = [...(document.querySelectorAll?.('button, [role="button"]') ?? [])].find(
    (node) =>
      enabled(node) &&
      !node.closest?.('table, [role="table"], [role="list"], [role="listitem"]') &&
      /^(?:当前用户|目前使用者|現在のユーザー|현재 사용자|Current user|Utilisateur actuel)\s*[:：]\s*\S+/i.test(
        node.getAttribute?.('aria-label') ?? '',
      ),
  );
  if (!userControl) return {};

  const actionKey = 'dashboard-account-action:sign-out';
  const keyedAction = (node, accountMenu) =>
    ['id', 'data-key', 'data-collection-key'].some((attribute) => {
      let key = node.getAttribute?.(attribute) ?? '';
      try {
        key = decodeURIComponent(key);
      } catch {}
      return (
        key === actionKey || key.endsWith(`-${actionKey}`) || (accountMenu && key === 'sign-out')
      );
    });
  const menus = [...(document.querySelectorAll?.('[data-slot="sidebar-menu"]') ?? [])].filter(
    visible,
  );
  const logoutControl = menus.some((menu) => {
    const accountMenu =
      menu.getAttribute?.('role') === 'treegrid' ||
      menu.getAttribute?.('aria-label') === 'Account actions';
    const actions = [...(menu.querySelectorAll?.('[data-slot="sidebar-menu-item"]') ?? [])].filter(
      enabled,
    );
    return actions.some(
      (node) =>
        keyedAction(node, accountMenu) ||
        /^(?:sign[\s-]?out|log[\s-]?out|退出\s*(?:当前\s*)?(?:登录|账号|账户)|注销\s*登录|登出)[.!。！]?$/i.test(
          (node.getAttribute?.('aria-label') ?? '').trim(),
        ),
    );
  });
  return {
    accountShellVisible: true,
    accountShellSource: 'Orevx 可见的当前用户账号栏',
    logoutControl,
    ...(logoutControl ? { logoutSource: 'Orevx 已适配的侧栏退出操作' } : {}),
  };
}
