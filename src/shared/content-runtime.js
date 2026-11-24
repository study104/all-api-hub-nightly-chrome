/**
 * 已发布内容脚本的作用域兼容桥接。
 *
 * 每个功能拥有自己的 state；scope 只提供原顶层名字的 live binding。
 * 原函数先注册，初始化仍按原语句顺序执行，不依赖动态执行或全局变量。
 */
export function bindContentState(scope, names) {
  const state = Object.create(null);
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(scope, name)) {
      throw new Error(`内容模块重复注册绑定：${name}`);
    }
    state[name] = undefined;
    Object.defineProperty(scope, name, {
      enumerable: true,
      get: () => state[name],
      set: (value) => {
        state[name] = value;
      },
    });
  }
  return state;
}

export function initializeContentModules(modules) {
  const steps = Object.values(modules)
    .flatMap((module) => module.initializers)
    .sort((left, right) => left.order - right.order);
  for (const step of steps) step.run();
}
