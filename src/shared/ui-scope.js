/**
 * Bridges the bindings of an extracted published scope to their owning module.
 * Business values stay in each module runtime; this object only exposes accessors.
 */
export function createUiModuleRuntime(definition) {
  return {
    bindings: Object.create(null),
    scope: undefined,
    ...definition,
  };
}

export function createUiScope(runtimes, importedBindings, exportBindings = {}) {
  const scope = Object.create(null);
  Object.defineProperties(scope, Object.getOwnPropertyDescriptors(importedBindings));
  for (const runtime of Object.values(runtimes)) {
    for (const name of runtime.bindingNames) {
      runtime.bindings[name] = undefined;
      Object.defineProperty(scope, name, {
        enumerable: true,
        get: () => runtime.bindings[name],
        set(value) {
          runtime.bindings[name] = value;
          runtime.publish?.(name, value);
          exportBindings[name]?.(value);
        },
      });
    }
  }
  return scope;
}

export function initializeUiScope(scope, runtimes, initializationOrder) {
  // Original declarations are hoisted before any initializer executes.
  for (const runtime of Object.values(runtimes)) {
    runtime.scope = scope;
    runtime.register(scope);
  }
  for (const [owner, step] of initializationOrder) {
    runtimes[owner].initialize(scope, step, runtimes);
  }
}
