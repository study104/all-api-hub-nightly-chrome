/** 设置后台：管理页/侧栏打开方式与设置请求；备份处理在同模块界面。 */
import { bgPlatformState } from '../../shared/background-platform.js';

export const bgSettingsState = { store: {} };

async function Ie(e) {
  if (!chrome.sidePanel?.setPanelBehavior)
    throw Error(`当前 Chrome 版本不支持侧边栏启动模式，请升级浏览器`);
  let t = e === `sidepanel`;
  if (
    (await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: t }),
    chrome.sidePanel.getPanelBehavior &&
      (await chrome.sidePanel.getPanelBehavior()).openPanelOnActionClick !== t)
  )
    throw Error(`Chrome 未应用启动模式，请重新加载扩展后重试`);
}

function $o(e) {
  return e === `sidepanel` || e === `tab`;
}

async function es(e = bgSettingsState.Fe) {
  let n = await bgPlatformState.t.get(bgPlatformState.r.launchMode, e);
  return $o(n) ? n : e;
}

async function ts() {
  if (chrome.sidePanel?.getPanelBehavior)
    return (await chrome.sidePanel.getPanelBehavior()).openPanelOnActionClick ? `sidepanel` : `tab`;
}

async function ns(e) {
  (await es()) !== e && (await bgPlatformState.t.set(bgPlatformState.r.launchMode, e));
}

async function rs(e) {
  let t = [];
  try {
    await Ie(e);
    try {
      await ns(e);
      return;
    } catch (e) {
      t.push(e);
    }
  } catch (e) {
    t.push(e);
  }
  try {
    await Ie(await es());
    return;
  } catch (e) {
    t.push(e);
  }
  try {
    let e = await ts();
    if (e) {
      await ns(e);
      return;
    }
  } catch (e) {
    t.push(e);
  }
  throw Error(
    `无法恢复启动模式一致性：${t.map((e) => (e instanceof Error ? e.message : String(e))).join(`；`)}`,
  );
}

function is() {
  let e = 0,
    n = 0,
    i = 0,
    a,
    o = Promise.resolve();
  function s(e) {
    let t = o.then(e, e);
    return ((o = t.catch(() => {})), t);
  }
  function c(e) {
    return a?.requestId === e.requestId && a.sequence === e.sequence;
  }
  async function l(e) {
    let n = await es();
    if (c(e))
      try {
        if ((await Ie(e.mode), !c(e))) {
          await rs(n);
          return;
        }
        await bgPlatformState.t.set(bgPlatformState.r.launchMode, e.mode);
      } catch (e) {
        try {
          await rs(n);
        } catch (t) {
          let n = e instanceof Error ? e.message : String(e),
            r = t instanceof Error ? t.message : String(t);
          throw Error(`${n}；恢复失败：${r}`);
        }
        throw e;
      }
  }
  return {
    submit(t, r) {
      let o = { mode: t, requestId: r, sequence: ++e };
      return (
        (a = o),
        (n += 1),
        (i += 1),
        s(async () => {
          try {
            c(o) && (await l(o));
          } finally {
            (--i, i === 0 && a === o && (a = void 0));
          }
        })
      );
    },
    sync(e) {
      let t = n;
      return s(async () => {
        if (i > 0 || t !== n) return;
        let r = await es(e);
        if (!(i > 0 || t !== n))
          try {
            await Ie(r);
          } catch (e) {
            try {
              await rs(r);
            } catch (t) {
              let n = e instanceof Error ? e.message : String(e),
                r = t instanceof Error ? t.message : String(t);
              throw Error(`${n}；恢复失败：${r}`);
            }
            throw e;
          }
      });
    },
  };
}

Object.assign(bgSettingsState, { Ie, $o, es, ts, ns, rs, is });

export async function handleSettingsMessage(e, i) {
  switch (e.type) {
    case `SET_LAUNCH_MODE`:
      return (await bgSettingsState.Zp.submit(e.mode, e.requestId), { ok: !0 });
    case `TEST_NOTIFY`:
      return { ok: !1, error: `通知功能尚未实现，无法发送测试通知` };
  }
}

export async function handleSettingsMutation(e) {
  switch (e.action) {
  }
}

export function initializeBackgroundSettings(step) {
  switch (step) {
    case 41: {
      bgSettingsState.Fe = `sidepanel`;
      break;
    }
    case 305: {
      bgSettingsState.Zp = is();
      break;
    }
  }
}

export const settingsService = Object.freeze({
  getLaunchMode: (...args) => es(...args),
  setLaunchMode: (...args) => bgSettingsState.Zp.submit(...args),
  handleMessage: handleSettingsMessage,
});
