/** 后台入口：连接功能模块、消息路由、启动初始化和跨模块变更编排。 */
import {
  initializeBackgroundAccounts,
  handleAccountsMessage,
  handleAccountsMutation,
} from '../modules/accounts/service.js';
import {
  bgSitesState,
  initializeBackgroundSites,
  handleSitesMessage,
  handleSitesMutation,
} from '../modules/sites/service.js';
import {
  initializeBackgroundLearning,
  handleLearningMessage,
} from '../modules/learning/service.js';
import {
  bgCheckinState,
  initializeBackgroundCheckin,
  handleCheckinMessage,
  handleCheckinPointerMessage,
  handleCheckinMutation,
} from '../modules/checkin/service.js';
import { initializeBackgroundSlider, handleSliderMessage } from '../modules/slider/service.js';
import {
  bgProxiesState,
  initializeBackgroundProxies,
  handleProxiesMessage,
  handleProxiesMutation,
} from '../modules/proxies/service.js';
import { initializeBackgroundRecords, handleRecordsMessage } from '../modules/records/service.js';
import {
  bgSettingsState,
  initializeBackgroundSettings,
  handleSettingsMessage,
} from '../modules/settings/service.js';
import { bgPlatformState, initializeBackgroundPlatform } from '../shared/background-platform.js';

export const bgEntryState = { store: {} };

function e(e) {
  return e == null || typeof e == `function` ? { main: e } : e;
}

function Q(e) {
  let t = e.url ?? e.origin,
    n = chrome.runtime.getURL(``);
  return e.id === chrome.runtime.id && !!t && (t === n.slice(0, -1) || t.startsWith(n));
}

async function Gm(e, i) {
  await bgEntryState.Qp;
  const type = e.type;
  const handler =
    typeof type === 'string' && Object.hasOwn(backgroundMessageHandlers, type)
      ? backgroundMessageHandlers[type]
      : undefined;
  return handler
    ? handler(e, i)
    : { ok: false, error: `后台未注册该消息类型，请重新加载扩展后重试` };
}

async function nh(e) {
  const action = e.action;
  const handler =
    typeof action === 'string' && Object.hasOwn(backgroundMutationHandlers, action)
      ? backgroundMutationHandlers[action]
      : undefined;
  return handler ? handler(e) : undefined;
}

Object.assign(bgEntryState, { e, Q, Gm, nh });

export async function handleEntryMessage(e, i) {
  switch (e.type) {
    case `MUTATE_APP`: {
      if (!Q(i)) return { ok: !1, error: `仅扩展管理页可以修改数据` };
      let t = await nh(e.mutation);
      return (bgPlatformState.$(), t);
    }
  }
}

export async function handleEntryMutation(e) {
  switch (e.action) {
    case `delete-entities`:
      return bgPlatformState.X(async () =>
        bgPlatformState.rm(async () => {
          let n = await bgPlatformState.t.get(bgPlatformState.r.accounts, []),
            i = new Set(e.siteIds),
            a = new Set(e.accountIds);
          return (
            await bgCheckinState.eh(
              n.filter((e) => i.has(e.siteId) || a.has(e.id)).map((e) => e.id),
            ),
            await bgEntryState.store.deleteEntities(e.siteIds, e.accountIds),
            { ok: !0 }
          );
        }),
      );
  }
}

export function initializeBackgroundEntry(step) {
  switch (step) {
    case 125: {
      Object.assign(bgEntryState.store, {
        async load() {
          return bgPlatformState.R(async () => {
            let [e, n, i, a, o, s, c, l, u, d] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.proxies, []),
                bgPlatformState.t.get(bgPlatformState.r.status, {}),
                bgPlatformState.t.get(bgPlatformState.r.results, {}),
                bgPlatformState.t.get(bgPlatformState.r.balances, {}),
                bgPlatformState.t.get(bgPlatformState.r.launchMode, bgSettingsState.Fe),
                bgPlatformState.t.get(bgPlatformState.r.schedule, bgCheckinState.Wi),
                bgPlatformState.t.get(bgPlatformState.r.removedBuiltinSiteIds, []),
                bgPlatformState.t.get(bgPlatformState.r.headlessStats, {}),
              ]),
              { userSites: f, accounts: p } = await bgSitesState.mo(e, n),
              m = await bgSitesState.ho(f, p),
              h = bgSitesState.co(m.userSites),
              g = bgSitesState.ba(m.accounts),
              _ = bgSitesState.xa(g),
              v = _.size ? g.map((e) => (_.has(e.id) ? bgSitesState.Sa(e) : e)) : g,
              y = [..._].map((e) => `${e}:`),
              b = _.size
                ? Object.fromEntries(
                    Object.entries(a).filter(([e]) => !y.some((t) => e.startsWith(t))),
                  )
                : a,
              x = _.size ? Object.fromEntries(Object.entries(o).filter(([e]) => !_.has(e))) : o,
              S = _.size ? Object.fromEntries(Object.entries(s).filter(([e]) => !_.has(e))) : s,
              C = bgCheckinState.la(
                d,
                [...bgSitesState.j, ...h].map((e) => e.id),
              ),
              w = bgSitesState.po(u, v),
              T = {};
            return (
              bgSitesState.fo(m.userSites, h) && (T[bgPlatformState.r.sites] = h),
              bgSitesState.fo(m.accounts, v) && (T[bgPlatformState.r.accounts] = v),
              _.size &&
                ((T[bgPlatformState.r.status] = b),
                (T[bgPlatformState.r.results] = x),
                (T[bgPlatformState.r.balances] = S)),
              bgSitesState.fo(u, w) && (T[bgPlatformState.r.removedBuiltinSiteIds] = w),
              C !== d && (T[bgPlatformState.r.headlessStats] = C),
              Object.keys(T).length && (await bgPlatformState.t.setMany(T)),
              {
                userSites: h,
                accounts: v,
                proxies: i,
                status: b,
                results: x,
                balances: S,
                launchMode: c,
                schedule: bgCheckinState.Ki(l),
                removedBuiltinSiteIds: w,
              }
            );
          });
        },
      });
      break;
    }
    case 130: {
      Object.assign(bgEntryState.store, {
        deleteEntities(e, n) {
          return bgPlatformState.R(async () => {
            let i = new Set(e),
              a = new Set(n),
              [o, s, c, l, u, d, f, p] = await Promise.all([
                bgPlatformState.t.get(bgPlatformState.r.sites, []),
                bgPlatformState.t.get(bgPlatformState.r.accounts, []),
                bgPlatformState.t.get(bgPlatformState.r.status, {}),
                bgPlatformState.t.get(bgPlatformState.r.results, {}),
                bgPlatformState.t.get(bgPlatformState.r.balances, {}),
                bgPlatformState.t.get(bgPlatformState.r.schedule, bgCheckinState.Wi),
                bgPlatformState.t.get(bgPlatformState.r.removedBuiltinSiteIds, []),
                bgPlatformState.t.get(bgPlatformState.r.headlessStats, {}),
              ]),
              m = new Set(s.filter((e) => a.has(e.id)).map((e) => e.id)),
              h = [...m].map((e) => `${e}:`),
              g = bgCheckinState.qi(
                bgCheckinState.Ki(d),
                s.filter((e) => !m.has(e.id)).map((e) => e.id),
              ),
              _ = new Set(bgSitesState.j.map((e) => e.id)),
              v = e.filter((e) => _.has(e)),
              y = [...new Set([...f, ...v])];
            await bgPlatformState.t.setMany({
              [bgPlatformState.r.sites]: o.filter((e) => !i.has(e.id)),
              [bgPlatformState.r.accounts]: s.filter((e) => !m.has(e.id)),
              [bgPlatformState.r.status]: Object.fromEntries(
                Object.entries(c).filter(([e]) => !h.some((t) => e.startsWith(t))),
              ),
              [bgPlatformState.r.results]: Object.fromEntries(
                Object.entries(l).filter(([e]) => !m.has(e)),
              ),
              [bgPlatformState.r.balances]: Object.fromEntries(
                Object.entries(u).filter(([e]) => !m.has(e)),
              ),
              [bgPlatformState.r.schedule]: g,
              [bgPlatformState.r.removedBuiltinSiteIds]: y,
              [bgPlatformState.r.headlessStats]: Object.fromEntries(
                Object.entries(p).filter(([e]) => !i.has(e)),
              ),
            });
          });
        },
      });
      break;
    }
    case 306: {
      bgEntryState.Qp = Promise.resolve();
      break;
    }
    case 312: {
      bgEntryState.am = e(() => {
        (bgCheckinState.pm(),
          chrome.alarms.create(bgCheckinState.Rp, { periodInMinutes: 1 }),
          chrome.alarms.create(bgProxiesState.Bp, { periodInMinutes: 360 }),
          chrome.runtime.onInstalled.addListener(() => {
            bgCheckinState.pm();
          }),
          chrome.runtime.onStartup.addListener(() => {
            bgCheckinState.pm();
          }),
          chrome.alarms.onAlarm.addListener((e) => {
            (e.name === bgCheckinState.Rp && (bgCheckinState.Ph(), bgCheckinState.Fh()),
              e.name === bgCheckinState.zp && bgCheckinState.vm(e.scheduledTime),
              e.name === bgProxiesState.Bp && bgProxiesState._h().catch(() => {}));
          }),
          chrome.webNavigation.onErrorOccurred.addListener((e) => {
            e.frameId === 0 && bgCheckinState.Nh(e.tabId, e.error);
          }),
          chrome.tabs.onCreated.addListener((e) => {
            let t = e.id,
              n = e.openerTabId;
            t != null &&
              n != null &&
              (async () => {
                let r = await bgCheckinState.V.get(n);
                r?.runId &&
                  (await bgCheckinState.H.remember(t, n),
                  bgCheckinState.Jo(r, e.url ?? `about:blank`)
                    ? await bgCheckinState.sm(t, e.url ?? `about:blank`, n)
                    : bgCheckinState.Wo(r) &&
                      r.usesExtensionProxy &&
                      e.url &&
                      bgCheckinState.Ko(r, e.url) &&
                      (await bgCheckinState.fm(t, n, bgCheckinState.Go(r, e.url))));
              })();
          }),
          chrome.tabs.onUpdated.addListener((e, t, n) => {
            (t.status === `loading` || t.url) &&
              bgCheckinState.sm(e, t.url ?? n.url, n.openerTabId);
          }),
          chrome.action.onClicked.addListener(() => {
            (async () => {
              (await bgEntryState.Qp,
                (await bgPlatformState.t.get(bgPlatformState.r.launchMode, `sidepanel`)) ===
                  `tab` && (await chrome.runtime.openOptionsPage()));
            })();
          }),
          chrome.runtime.onMessage.addListener(
            (e, t, n) => (
              Gm(e, t)
                .then(n)
                .catch((e) => n({ ok: !1, error: e?.message ?? String(e) })),
              !0
            ),
          ),
          chrome.tabs.onRemoved.addListener((e) => {
            (bgPlatformState.Yc(e), bgCheckinState.lm(e));
          }));
      });
      break;
    }
    case 323: {
      globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
      break;
    }
    case 324: {
      bgEntryState.Lh = {
        debug: (...e) => ([...e], void 0),
        log: (...e) => ([...e], void 0),
        warn: (...e) => ([...e], void 0),
        error: (...e) => ([...e], void 0),
      };
      break;
    }
    case 325: {
      try {
        ((bgEntryState.Rh = bgEntryState.am.main()),
          bgEntryState.Rh instanceof Promise &&
            console.warn(
              `The background's main() function return a promise, but it must be synchronous`,
            ));
      } catch (e) {
        throw (bgEntryState.Lh.error(`The background crashed on startup!`), e);
      }
      break;
    }
  }
}

const backgroundMessageHandlers = {
  'SAVE_IDENTITY': handleAccountsMessage,
  'CAPTURE_SESSION': handleAccountsMessage,
  'SESSION_REFRESHED': handleAccountsMessage,
  'CLEAR_SITE_COOKIES': handleAccountsMessage,
  'PROBE_SITE': handleSitesMessage,
  'PROBE_LOGIN_PAGE': handleSitesMessage,
  'TOGGLE_LEARNING': handleLearningMessage,
  'LEARN_EVENT': handleLearningMessage,
  'LEARN_IDENTITY': handleLearningMessage,
  'GET_LEARNING': handleLearningMessage,
  'CANCEL_LEARNING': handleLearningMessage,
  'START_LOGIN': handleCheckinMessage,
  'START_BATCH': handleCheckinMessage,
  'CANCEL_CHECKIN': handleCheckinMessage,
  'GET_TASK': handleCheckinMessage,
  'RESOLVE_LOGIN_METHOD': handleCheckinMessage,
  'SET_STAGE': handleCheckinMessage,
  'GITHUB_LOGOUT_COMPLETE': handleCheckinMessage,
  'CONFIRM_IDENTITY': handleCheckinMessage,
  'FORM_CREDENTIALS_SUBMITTED': handleCheckinMessage,
  'SAVE_WORKFLOW_ROUTE': handleCheckinMessage,
  'NEEDS_USER': handleCheckinMessage,
  'MANUAL_LOGIN_WAITING': handleCheckinMessage,
  'TASK_RESULT': handleCheckinMessage,
  'GET_LIVE_TASKS': handleCheckinMessage,
  'SYNC_PROGRESS': handleCheckinMessage,
  'CLAIM_TEXT_USED': handleCheckinMessage,
  'SLIDER_FRAME_PREPARE': handleSliderMessage,
  'SLIDER_FRAME_CONNECT': handleSliderMessage,
  'SLIDER_FRAME_REPORT': handleSliderMessage,
  'SLIDER_FRAME_STATUS': handleSliderMessage,
  'SLIDER_FRAME_CANCEL': handleSliderMessage,
  'SLIDER_CRACK': handleSliderMessage,
  'TEST_PROXY': handleProxiesMessage,
  'SCAN_LOCAL_PORTS': handleProxiesMessage,
  'READ_CLASH_PROXIES': handleProxiesMessage,
  'DETECT_CLASH_CONTROLLER': handleProxiesMessage,
  'READ_CLASH_LISTENER_EXITS': handleProxiesMessage,
  'SYNC_CLASH_PROXIES': handleProxiesMessage,
  'FETCH_SUBSCRIPTION': handleProxiesMessage,
  'CHECK_LISTENER_DRIFT': handleProxiesMessage,
  'BALANCE_SNAPSHOT': handleRecordsMessage,
  'REFRESH_BALANCE': handleRecordsMessage,
  'CHECKIN_REWARD_OBSERVATION': handleRecordsMessage,
  'SET_LAUNCH_MODE': handleSettingsMessage,
  'TEST_NOTIFY': handleSettingsMessage,
  'TRUSTED_POINTER_CLICK': handleCheckinPointerMessage,
  'TRUSTED_POINTER_SCROLL': handleCheckinPointerMessage,
  'TRUSTED_POINTER_DRAG': handleCheckinPointerMessage,
  'MUTATE_APP': handleEntryMessage,
};

const backgroundMutationHandlers = {
  'add-account': handleAccountsMutation,
  'add-accounts': handleAccountsMutation,
  'update-account': handleAccountsMutation,
  'add-site': handleSitesMutation,
  'add-sites': handleSitesMutation,
  'update-site': handleSitesMutation,
  'move-site': handleSitesMutation,
  'update-schedule': handleCheckinMutation,
  'set-status': handleCheckinMutation,
  'mark-done': handleCheckinMutation,
  'add-proxy': handleProxiesMutation,
  'add-proxies': handleProxiesMutation,
  'update-proxy': handleProxiesMutation,
  'remove-proxy': handleProxiesMutation,
  'assign-account-proxies': handleProxiesMutation,
  'delete-entities': handleEntryMutation,
};

let backgroundStarted = false;
export function startBackground() {
  if (backgroundStarted) return bgEntryState.Rh;
  backgroundStarted = true;
  initializeBackgroundPlatform(0);
  initializeBackgroundPlatform(1);
  initializeBackgroundPlatform(2);
  initializeBackgroundCheckin(3);
  initializeBackgroundLearning(4);
  initializeBackgroundCheckin(5);
  initializeBackgroundCheckin(6);
  initializeBackgroundCheckin(7);
  initializeBackgroundCheckin(8);
  initializeBackgroundSites(9);
  initializeBackgroundSites(10);
  initializeBackgroundSites(11);
  initializeBackgroundSites(12);
  initializeBackgroundSites(13);
  initializeBackgroundSites(14);
  initializeBackgroundSites(15);
  initializeBackgroundSites(16);
  initializeBackgroundSites(17);
  initializeBackgroundSites(18);
  initializeBackgroundSites(19);
  initializeBackgroundSites(20);
  initializeBackgroundSites(21);
  initializeBackgroundSites(22);
  initializeBackgroundSites(23);
  initializeBackgroundSites(24);
  initializeBackgroundSites(25);
  initializeBackgroundSites(26);
  initializeBackgroundSites(27);
  initializeBackgroundSites(28);
  initializeBackgroundSites(29);
  initializeBackgroundSites(30);
  initializeBackgroundSites(31);
  initializeBackgroundSites(32);
  initializeBackgroundSites(33);
  initializeBackgroundSites(34);
  initializeBackgroundSites(35);
  initializeBackgroundSites(36);
  initializeBackgroundProxies(37);
  initializeBackgroundProxies(38);
  initializeBackgroundProxies(39);
  initializeBackgroundProxies(40);
  initializeBackgroundSettings(41);
  initializeBackgroundCheckin(42);
  initializeBackgroundCheckin(43);
  initializeBackgroundCheckin(44);
  initializeBackgroundCheckin(45);
  initializeBackgroundCheckin(46);
  initializeBackgroundCheckin(47);
  initializeBackgroundCheckin(48);
  initializeBackgroundCheckin(49);
  initializeBackgroundCheckin(50);
  initializeBackgroundCheckin(51);
  initializeBackgroundCheckin(52);
  initializeBackgroundCheckin(53);
  initializeBackgroundCheckin(54);
  initializeBackgroundAccounts(55);
  initializeBackgroundSites(56);
  initializeBackgroundSites(57);
  initializeBackgroundProxies(58);
  initializeBackgroundProxies(59);
  initializeBackgroundProxies(60);
  initializeBackgroundProxies(61);
  initializeBackgroundProxies(62);
  initializeBackgroundProxies(63);
  initializeBackgroundProxies(64);
  initializeBackgroundProxies(65);
  initializeBackgroundProxies(66);
  initializeBackgroundProxies(67);
  initializeBackgroundProxies(68);
  initializeBackgroundProxies(69);
  initializeBackgroundProxies(70);
  initializeBackgroundProxies(71);
  initializeBackgroundProxies(72);
  initializeBackgroundProxies(73);
  initializeBackgroundLearning(74);
  initializeBackgroundSites(75);
  initializeBackgroundSites(76);
  initializeBackgroundSites(77);
  initializeBackgroundSites(78);
  initializeBackgroundSites(79);
  initializeBackgroundAccounts(80);
  initializeBackgroundAccounts(81);
  initializeBackgroundAccounts(82);
  initializeBackgroundAccounts(83);
  initializeBackgroundAccounts(84);
  initializeBackgroundAccounts(85);
  initializeBackgroundAccounts(86);
  initializeBackgroundAccounts(87);
  initializeBackgroundAccounts(88);
  initializeBackgroundAccounts(89);
  initializeBackgroundAccounts(90);
  initializeBackgroundAccounts(91);
  initializeBackgroundAccounts(92);
  initializeBackgroundRecords(93);
  initializeBackgroundRecords(94);
  initializeBackgroundRecords(95);
  initializeBackgroundRecords(96);
  initializeBackgroundRecords(97);
  initializeBackgroundRecords(98);
  initializeBackgroundRecords(99);
  initializeBackgroundRecords(100);
  initializeBackgroundRecords(101);
  initializeBackgroundRecords(102);
  initializeBackgroundRecords(103);
  initializeBackgroundRecords(104);
  initializeBackgroundRecords(105);
  initializeBackgroundRecords(106);
  initializeBackgroundRecords(107);
  initializeBackgroundRecords(108);
  initializeBackgroundAccounts(109);
  initializeBackgroundAccounts(110);
  initializeBackgroundCheckin(111);
  initializeBackgroundCheckin(112);
  initializeBackgroundPlatform(113);
  initializeBackgroundPlatform(114);
  initializeBackgroundCheckin(115);
  initializeBackgroundCheckin(116);
  initializeBackgroundRecords(117);
  initializeBackgroundRecords(118);
  initializeBackgroundSites(119);
  initializeBackgroundSites(120);
  initializeBackgroundSites(121);
  initializeBackgroundSites(122);
  initializeBackgroundSites(123);
  initializeBackgroundSites(124);
  initializeBackgroundEntry(125);
  initializeBackgroundSites(126);
  initializeBackgroundSites(127);
  initializeBackgroundSites(128);
  initializeBackgroundSites(129);
  initializeBackgroundEntry(130);
  initializeBackgroundRecords(131);
  initializeBackgroundRecords(132);
  initializeBackgroundRecords(133);
  initializeBackgroundRecords(134);
  initializeBackgroundAccounts(135);
  initializeBackgroundAccounts(136);
  initializeBackgroundAccounts(137);
  initializeBackgroundAccounts(138);
  initializeBackgroundAccounts(139);
  initializeBackgroundProxies(140);
  initializeBackgroundProxies(141);
  initializeBackgroundProxies(142);
  initializeBackgroundProxies(143);
  initializeBackgroundProxies(144);
  initializeBackgroundProxies(145);
  initializeBackgroundCheckin(146);
  initializeBackgroundCheckin(147);
  initializeBackgroundCheckin(148);
  initializeBackgroundCheckin(149);
  initializeBackgroundCheckin(150);
  initializeBackgroundCheckin(151);
  initializeBackgroundCheckin(152);
  initializeBackgroundCheckin(153);
  initializeBackgroundCheckin(154);
  initializeBackgroundCheckin(155);
  initializeBackgroundCheckin(156);
  initializeBackgroundCheckin(157);
  initializeBackgroundCheckin(158);
  initializeBackgroundCheckin(159);
  initializeBackgroundCheckin(160);
  initializeBackgroundCheckin(161);
  initializeBackgroundCheckin(162);
  initializeBackgroundCheckin(163);
  initializeBackgroundCheckin(164);
  initializeBackgroundCheckin(165);
  initializeBackgroundCheckin(166);
  initializeBackgroundCheckin(167);
  initializeBackgroundCheckin(168);
  initializeBackgroundProxies(169);
  initializeBackgroundProxies(170);
  initializeBackgroundProxies(171);
  initializeBackgroundProxies(172);
  initializeBackgroundProxies(173);
  initializeBackgroundProxies(174);
  initializeBackgroundProxies(175);
  initializeBackgroundProxies(176);
  initializeBackgroundCheckin(177);
  initializeBackgroundCheckin(178);
  initializeBackgroundCheckin(179);
  initializeBackgroundCheckin(180);
  initializeBackgroundCheckin(181);
  initializeBackgroundCheckin(182);
  initializeBackgroundCheckin(183);
  initializeBackgroundCheckin(184);
  initializeBackgroundCheckin(185);
  initializeBackgroundCheckin(186);
  initializeBackgroundCheckin(187);
  initializeBackgroundCheckin(188);
  initializeBackgroundCheckin(189);
  initializeBackgroundCheckin(190);
  initializeBackgroundCheckin(191);
  initializeBackgroundCheckin(192);
  initializeBackgroundCheckin(193);
  initializeBackgroundPlatform(194);
  initializeBackgroundPlatform(195);
  initializeBackgroundPlatform(196);
  initializeBackgroundPlatform(197);
  initializeBackgroundPlatform(198);
  initializeBackgroundPlatform(199);
  initializeBackgroundPlatform(200);
  initializeBackgroundPlatform(201);
  initializeBackgroundPlatform(202);
  initializeBackgroundPlatform(203);
  initializeBackgroundPlatform(204);
  initializeBackgroundPlatform(205);
  initializeBackgroundPlatform(206);
  initializeBackgroundPlatform(207);
  initializeBackgroundPlatform(208);
  initializeBackgroundPlatform(209);
  initializeBackgroundPlatform(210);
  initializeBackgroundSlider(211);
  initializeBackgroundSlider(212);
  initializeBackgroundSlider(213);
  initializeBackgroundSlider(214);
  initializeBackgroundSlider(215);
  initializeBackgroundSlider(216);
  initializeBackgroundSlider(217);
  initializeBackgroundSlider(218);
  initializeBackgroundSlider(219);
  initializeBackgroundSlider(220);
  initializeBackgroundSlider(221);
  initializeBackgroundSlider(222);
  initializeBackgroundSlider(223);
  initializeBackgroundLearning(224);
  initializeBackgroundLearning(225);
  initializeBackgroundLearning(226);
  initializeBackgroundLearning(227);
  initializeBackgroundLearning(228);
  initializeBackgroundLearning(229);
  initializeBackgroundLearning(230);
  initializeBackgroundLearning(231);
  initializeBackgroundLearning(232);
  initializeBackgroundLearning(233);
  initializeBackgroundLearning(234);
  initializeBackgroundLearning(235);
  initializeBackgroundLearning(236);
  initializeBackgroundLearning(237);
  initializeBackgroundLearning(238);
  initializeBackgroundLearning(239);
  initializeBackgroundLearning(240);
  initializeBackgroundLearning(241);
  initializeBackgroundLearning(242);
  initializeBackgroundSlider(243);
  initializeBackgroundSlider(244);
  initializeBackgroundSlider(245);
  initializeBackgroundSlider(246);
  initializeBackgroundSlider(247);
  initializeBackgroundSlider(248);
  initializeBackgroundSlider(249);
  initializeBackgroundSlider(250);
  initializeBackgroundSlider(251);
  initializeBackgroundSlider(252);
  initializeBackgroundLearning(253);
  initializeBackgroundLearning(254);
  initializeBackgroundLearning(255);
  initializeBackgroundLearning(256);
  initializeBackgroundLearning(257);
  initializeBackgroundLearning(258);
  initializeBackgroundLearning(259);
  initializeBackgroundLearning(260);
  initializeBackgroundLearning(261);
  initializeBackgroundLearning(262);
  initializeBackgroundLearning(263);
  initializeBackgroundLearning(264);
  initializeBackgroundLearning(265);
  initializeBackgroundLearning(266);
  initializeBackgroundLearning(267);
  initializeBackgroundLearning(268);
  initializeBackgroundLearning(269);
  initializeBackgroundLearning(270);
  initializeBackgroundLearning(271);
  initializeBackgroundLearning(272);
  initializeBackgroundLearning(273);
  initializeBackgroundLearning(274);
  initializeBackgroundLearning(275);
  initializeBackgroundLearning(276);
  initializeBackgroundLearning(277);
  initializeBackgroundLearning(278);
  initializeBackgroundLearning(279);
  initializeBackgroundLearning(280);
  initializeBackgroundLearning(281);
  initializeBackgroundLearning(282);
  initializeBackgroundLearning(283);
  initializeBackgroundLearning(284);
  initializeBackgroundLearning(285);
  initializeBackgroundLearning(286);
  initializeBackgroundLearning(287);
  initializeBackgroundLearning(288);
  initializeBackgroundLearning(289);
  initializeBackgroundLearning(290);
  initializeBackgroundLearning(291);
  initializeBackgroundLearning(292);
  initializeBackgroundLearning(293);
  initializeBackgroundLearning(294);
  initializeBackgroundLearning(295);
  initializeBackgroundLearning(296);
  initializeBackgroundPlatform(297);
  initializeBackgroundCheckin(298);
  initializeBackgroundCheckin(299);
  initializeBackgroundProxies(300);
  initializeBackgroundCheckin(301);
  initializeBackgroundCheckin(302);
  initializeBackgroundLearning(303);
  initializeBackgroundLearning(304);
  initializeBackgroundSettings(305);
  initializeBackgroundEntry(306);
  initializeBackgroundPlatform(307);
  initializeBackgroundPlatform(308);
  initializeBackgroundPlatform(309);
  initializeBackgroundPlatform(310);
  initializeBackgroundCheckin(311);
  initializeBackgroundEntry(312);
  initializeBackgroundCheckin(313);
  initializeBackgroundProxies(314);
  initializeBackgroundProxies(315);
  initializeBackgroundLearning(316);
  initializeBackgroundCheckin(317);
  initializeBackgroundProxies(318);
  initializeBackgroundProxies(319);
  initializeBackgroundProxies(320);
  initializeBackgroundProxies(321);
  initializeBackgroundProxies(322);
  initializeBackgroundEntry(323);
  initializeBackgroundEntry(324);
  initializeBackgroundEntry(325);
  return bgEntryState.Rh;
}
startBackground();
