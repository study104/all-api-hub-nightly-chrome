import { initializeContentModules } from '../shared/content-runtime.js';
import { createSharedAutoContent } from '../shared/content-support.js';
import { createLearningAutoContent } from '../modules/learning/content.js';
import { createCheckinAutoContent } from '../modules/checkin/content.js';
import { createSliderAutoContent } from '../modules/slider/content.js';
export function createAutoLoginRuntime() {
  const __contentScope = Object.create(null);
  const modules = {
    shared: createSharedAutoContent(__contentScope),
    learning: createLearningAutoContent(__contentScope),
    checkin: createCheckinAutoContent(__contentScope),
    slider: createSliderAutoContent(__contentScope),
  };
  let initialized = false;
  return {
    scope: __contentScope,
    modules,
    initialize() {
      if (!initialized) {
        initializeContentModules(modules);
        initialized = true;
      }
      return this;
    },
    start() {
      this.initialize();
      return (async () => {
        try {
          let { main: e, ...t } = __contentScope.Gg;
          return await e(new __contentScope.Qg(`auto-login`, t));
        } catch (e) {
          throw (
            __contentScope.$g.error(`The content script "auto-login" crashed on startup!`, e),
            e
          );
        }
      })();
    },
  };
}
export function startAutoLogin() {
  return createAutoLoginRuntime().start();
}
startAutoLogin();
