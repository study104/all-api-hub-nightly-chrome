// Migration ownership map for the original background IIFE.
// Ranges identify AST declarations in the readable baseline; extraction is scope based.
const ranges = [
  [6, 47, 'platform'],
  [48, 48, 'checkin'],
  [49, 49, 'learning'],
  [50, 87, 'checkin'],
  [88, 90, 'platform'],
  [91, 842, 'sites'],
  [843, 1057, 'proxies'],
  [1058, 1069, 'settings'],
  [1070, 1615, 'checkin'],
  [1616, 1740, 'accounts'],
  [1741, 1856, 'sites'],
  [1857, 2451, 'proxies'],
  [2452, 2541, 'learning'],
  [2542, 2634, 'sites'],
  [2635, 3082, 'accounts'],
  [3083, 3560, 'records'],
  [3561, 3570, 'platform'],
  [3571, 3679, 'records'],
  [3680, 3706, 'accounts'],
  [3707, 3792, 'checkin'],
  [3793, 3815, 'platform'],
  [3816, 3836, 'checkin'],
  [3837, 3924, 'proxies'],
  [3925, 3987, 'records'],
  [3988, 4957, 'sites'],
  [4958, 4960, 'platform'],
  [4961, 5026, 'proxies'],
  [5027, 5035, 'accounts'],
  [5036, 5569, 'entry'],
  [5570, 6206, 'checkin'],
  [6207, 6312, 'proxies'],
  [6313, 6431, 'settings'],
  [6432, 6534, 'proxies'],
  [6535, 6768, 'checkin'],
  [6769, 6814, 'records'],
  [6815, 7119, 'checkin'],
  [7120, 8139, 'platform'],
  [8140, 10060, 'slider'],
  [10061, 10377, 'learning'],
  [10378, 10562, 'slider'],
  [10563, 11906, 'learning'],
  [11907, 11911, 'platform'],
  [11912, 11970, 'checkin'],
  [11971, 11976, 'sites'],
  [11977, 12024, 'checkin'],
  [12025, 12039, 'learning'],
  [12040, 12068, 'platform'],
  [12069, 12099, 'checkin'],
  [12100, 12157, 'entry'],
  [12158, 12468, 'checkin'],
  [12469, 12516, 'proxies'],
  [12517, 13128, 'learning'],
  [13129, 13633, 'entry'],
  [13634, 13756, 'checkin'],
  [13757, 13822, 'entry'],
  [13823, 14354, 'proxies'],
  [14355, 14762, 'checkin'],
  [14763, 14850, 'entry'],
];

const overrides = {
  e: 'entry',
  R: 'platform',
  Qp: 'entry',
  Zp: 'settings',
  Kp: 'learning',
  Q: 'entry',
  Gm: 'entry',
  nh: 'entry',
  X: 'platform',
  rm: 'platform',
  Bp: 'proxies',
  Io: 'accounts',
  wi: 'checkin',
  Ti: 'platform',
  F: 'sites',
  $: 'platform',
};

const storageMethods = {
  load: 'entry',
  moveSite: 'sites',
  addSite: 'sites',
  addSites: 'sites',
  updateSite: 'sites',
  deleteEntities: 'entry',
  saveBalance: 'records',
  saveCheckinReward: 'records',
  clearBalance: 'records',
  saveBalanceError: 'records',
  addAccount: 'accounts',
  addAccounts: 'accounts',
  updateAccount: 'accounts',
  saveAccountSession: 'accounts',
  saveAccountIdentity: 'accounts',
  addProxy: 'proxies',
  addProxies: 'proxies',
  syncClashProxies: 'proxies',
  updateProxy: 'proxies',
  removeProxy: 'proxies',
  assignAccountProxies: 'proxies',
  updateSchedule: 'checkin',
  setStatus: 'checkin',
  clearInFlightStatus: 'checkin',
  getStatus: 'checkin',
  markDone: 'checkin',
  setStatusUnlessTerminal: 'checkin',
  setStatusIfExpected: 'checkin',
  setStatusAndResult: 'checkin',
  setOutcome: 'checkin',
};

const messages = {
  learning: ['TOGGLE_LEARNING', 'LEARN_EVENT', 'LEARN_IDENTITY', 'GET_LEARNING', 'CANCEL_LEARNING'],
  accounts: ['SAVE_IDENTITY', 'CAPTURE_SESSION', 'SESSION_REFRESHED', 'CLEAR_SITE_COOKIES'],
  sites: ['PROBE_SITE'],
  proxies: [
    'TEST_PROXY',
    'SCAN_LOCAL_PORTS',
    'READ_CLASH_PROXIES',
    'DETECT_CLASH_CONTROLLER',
    'READ_CLASH_LISTENER_EXITS',
    'SYNC_CLASH_PROXIES',
    'FETCH_SUBSCRIPTION',
    'CHECK_LISTENER_DRIFT',
  ],
  records: ['BALANCE_SNAPSHOT', 'REFRESH_BALANCE', 'CHECKIN_REWARD_OBSERVATION'],
  slider: [
    'SLIDER_FRAME_PREPARE',
    'SLIDER_FRAME_CONNECT',
    'SLIDER_FRAME_REPORT',
    'SLIDER_FRAME_STATUS',
    'SLIDER_FRAME_CANCEL',
    'SLIDER_CRACK',
  ],
  settings: ['SET_LAUNCH_MODE', 'TEST_NOTIFY'],
  platform: ['TRUSTED_POINTER_CLICK', 'TRUSTED_POINTER_SCROLL', 'TRUSTED_POINTER_DRAG'],
  entry: ['MUTATE_APP'],
};

const mutations = {
  accounts: ['add-account', 'add-accounts', 'update-account'],
  sites: ['add-site', 'add-sites', 'update-site', 'move-site'],
  proxies: ['add-proxy', 'add-proxies', 'update-proxy', 'remove-proxy', 'assign-account-proxies'],
  checkin: ['update-schedule', 'set-status', 'mark-done'],
  entry: ['delete-entities'],
};

function ownerFor(name, line) {
  if (overrides[name]) return overrides[name];
  const range = ranges.find(([start, end]) => line >= start && line <= end);
  if (!range) throw new Error(`Unclassified declaration ${name} at ${line}`);
  return range[2];
}

function messageOwner(name) {
  return Object.entries(messages).find(([, names]) => names.includes(name))?.[0] ?? 'checkin';
}

function mutationOwner(name) {
  const owner = Object.entries(mutations).find(([, names]) => names.includes(name))?.[0];
  if (!owner) throw new Error(`Unknown mutation ${name}`);
  return owner;
}

module.exports = { ownerFor, storageMethods, messageOwner, mutationOwner };
