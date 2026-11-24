import { initializeContentModules } from '../shared/content-runtime.js';
import { createSharedFrameContent } from '../shared/content-support.js';
import { createSliderFrameContent } from '../modules/slider/content.js';
export function createSliderCaptchaFrameRuntime() {
  const __contentScope = Object.create(null);
  const modules = {
    shared: createSharedFrameContent(__contentScope),
    slider: createSliderFrameContent(__contentScope),
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
      return (() => {
        let e;
        try {
          ((e = __contentScope.Mt.main()),
            e instanceof Promise &&
              (e = e.catch((e) => {
                throw (
                  __contentScope.Nt.error(
                    `The unlisted script "slider-frame" crashed on startup!`,
                    e,
                  ),
                  e
                );
              })));
        } catch (e) {
          throw (
            __contentScope.Nt.error(`The unlisted script "slider-frame" crashed on startup!`, e),
            e
          );
        }
        return e;
      })();
    },
  };
}
export function startSliderCaptchaFrame() {
  return createSliderCaptchaFrameRuntime().start();
}
startSliderCaptchaFrame();
