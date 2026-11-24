// Functional ownership for the two published UI scopes. Ranges refer to the
// readable baseline chunks; the extractor records a hash of those inputs.
const appRanges = [
  [1, 509, 'motion'],
  [510, 537, 'shared'],
  [538, 1340, 'sites'],
  [1341, 1367, 'settings'],
  [1368, 1664, 'learning'],
  [1665, 1801, 'sites'],
  [1802, 1824, 'shared'],
  [1825, 1875, 'checkin'],
  [1876, 1968, 'proxies'],
  [1969, 2091, 'records'],
  [2092, 2131, 'accounts'],
  [2132, 3053, 'sites'],
  [3054, 3056, 'shared'],
  [3057, 3122, 'proxies'],
  [3123, 3131, 'accounts'],
  [3132, 3662, 'entry'],
  [3663, 3674, 'shared'],
  [3675, 3682, 'checkin'],
  [3683, 3887, 'entry'],
  [3888, 3926, 'checkin'],
  [3927, 4508, 'records'],
  [4509, 4671, 'learning'],
  [4672, 5311, 'accounts'],
  [5312, 5465, 'learning'],
  [5466, 5604, 'records'],
  [5605, 5705, 'accounts'],
  [5706, 5735, 'sites'],
  [5736, 6228, 'sites'],
  [6229, 6286, 'shared'],
  [6287, 6985, 'sites'],
  [6986, 7338, 'learning'],
  [7339, 7372, 'shared'],
  [7373, 8019, 'sites'],
  [8020, 9696, 'accounts'],
  [9697, 10440, 'settings'],
  [10441, 10836, 'checkin'],
  [10837, 10846, 'accounts'],
  [10847, 24879, 'search'],
  [24880, 24945, 'accounts'],
  [24946, 25235, 'sites'],
  [25236, 25299, 'settings'],
  [25300, 25347, 'accounts'],
  [25348, 25788, 'checkin'],
  [25789, 25938, 'accounts'],
  [25939, 25993, 'shared'],
  [25994, 27288, 'entry'],
  [27289, 27345, 'checkin'],
];

const sharedUiRanges = [
  [1, 644, 'motion'],
  [645, 6497, 'motion'],
  [6498, 6586, 'records'],
  [6587, 6616, 'proxies'],
  [6617, 6634, 'sites'],
  [6635, 7791, 'motion'],
  [7792, 8075, 'proxies'],
  [8076, 8439, 'proxies'],
  [8440, 11173, 'proxies'],
  [11174, 11443, 'shared'],
  [11444, 11663, 'accounts'],
  [11664, 11876, 'records'],
];

const appOverrides = {
  W: 'shared',
  G: 'shared',
  q: 'shared',
  Pt: 'shared',
  Ft: 'shared',
  Li: 'entry',
  Ui: 'entry',
  Ri: 'settings',
  zi: 'entry',
  Wi: 'checkin',
  Gi: 'checkin',
};

const sharedUiOverrides = {
  O: 'shared',
  k: 'shared',
  td: 'sites',
  nd: 'sites',
  rd: 'shared',
  id: 'shared',
  ad: 'shared',
  od: 'shared',
  sd: 'shared',
  cd: 'shared',
  ld: 'shared',
  ud: 'shared',
};

const propertyOwners = {
  moveSite: 'sites',
  addSite: 'sites',
  addSites: 'sites',
  updateSite: 'sites',
  removeSite: 'sites',
  addAccount: 'accounts',
  addAccounts: 'accounts',
  updateAccount: 'accounts',
  removeAccount: 'accounts',
  saveAccountSession: 'accounts',
  saveAccountIdentity: 'accounts',
  addProxy: 'proxies',
  addProxies: 'proxies',
  syncClashProxies: 'proxies',
  updateProxy: 'proxies',
  removeProxy: 'proxies',
  assignAccountProxies: 'proxies',
  setLaunchMode: 'settings',
  syncLaunchMode: 'settings',
  updateSchedule: 'checkin',
  setSchedule: 'checkin',
  setStatus: 'checkin',
  clearInFlightStatus: 'checkin',
  getStatus: 'checkin',
  markDone: 'checkin',
  setStatusUnlessTerminal: 'checkin',
  setStatusIfExpected: 'checkin',
  setStatusAndResult: 'checkin',
  setOutcome: 'checkin',
  statusOf: 'checkin',
  liveOf: 'checkin',
  isQueued: 'checkin',
  saveBalance: 'records',
  saveCheckinReward: 'records',
  clearBalance: 'records',
  saveBalanceError: 'records',
  resultOf: 'records',
  balanceOf: 'records',
  refreshBalances: 'records',
};

const publicAliases = {
  accounts: {
    app: {
      Aa: 'AccountRow',
      ms: 'AccountEditor',
      bs: 'AccountImportDialog',
      hs: 'parsePasswordCsv',
      gs: 'matchImportedAccounts',
      au: 'RecoverAccountsPanel',
      ls: 'SavedCredentialsPanel',
    },
    sharedUi: { Mm: 'AccountsOverview' },
  },
  sites: {
    app: {
      ro: 'SiteCard',
      Vo: 'SiteEditor',
      Oo: 'BookmarkImportPanel',
      ho: 'parseChromeBookmarkJson',
      vo: 'parseBookmarkHtml',
      pn: 'builtinSites',
    },
  },
  learning: {
    app: {
      Yn: 'validateLearnedWorkflow',
      Mo: 'LearnedCheckinSettings',
      Oa: 'LearningSteps',
      Fa: 'LearningSummary',
      Pa: 'learningInstructions',
    },
  },
  checkin: {
    app: {
      Zs: 'ScheduleEditor',
      ru: 'LiveTaskPanel',
      $l: 'CheckinQueuePanel',
    },
  },
  proxies: {
    sharedUi: {
      Em: 'ProxyManagementView',
      _p: 'AccountProxyEditor',
      Ap: 'BatchProxyAssignment',
      Cm: 'SubscriptionImportPanel',
    },
  },
  records: {
    app: { Ba: 'BalanceHistoryDialog', sa: 'classifyExecutionFailure', aa: 'FailureGuidance' },
    sharedUi: { Nm: 'ExecutionRecordsView', _d: 'summarizeBalances' },
  },
  settings: {
    app: {
      Ks: 'BackupMigrationDialog',
      Is: 'encryptBackup',
      Ls: 'decryptBackup',
      zs: 'createBackupPayload',
      Vs: 'validateBackupPayload',
      Zl: 'LaunchModeSettings',
    },
  },
};

const publicApis = {
  accounts: `
export function saveAccountDetails(input, accountId) {
  const actions = appRuntime.scope.Ui.getState();
  return accountId ? actions.updateAccount(accountId, input) : actions.addAccount(input);
}
export function importAccountBatch(inputs, preserveDuplicates = false) {
  return appRuntime.scope.Ui.getState().addAccounts(inputs, preserveDuplicates);
}
`,
  sites: `
export function saveSiteConfiguration(input, siteId) {
  const actions = appRuntime.scope.Ui.getState();
  return siteId ? actions.updateSite(siteId, input) : actions.addSite(input);
}
export function importSiteBatch(inputs, preserveDuplicates = false) {
  return appRuntime.scope.Ui.getState().addSites(inputs, preserveDuplicates);
}
`,
};

function ownerFor(scopeName, node, name) {
  const overrides = scopeName === 'app' ? appOverrides : sharedUiOverrides;
  if (overrides[name]) return overrides[name];
  const ranges = scopeName === 'app' ? appRanges : sharedUiRanges;
  const line = node.loc.start.line;
  const match = ranges.find(([start, end]) => line >= start && line <= end);
  if (!match) throw new Error(`No UI owner for ${scopeName}:${name} on line ${line}`);
  return match[2];
}

module.exports = { ownerFor, propertyOwners, publicAliases, publicApis };
