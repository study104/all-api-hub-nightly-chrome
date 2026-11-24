# 8 个功能模块的维护说明

功能拆分已经实施。当前源码由 8 个业务模块、平台与公共界面代码、运行入口组成。
新增或修改功能时，优先在所属模块中完成，批量导入、加密、队列、识别算法等
仍是模块内部能力，不再各自建立业务目录。

## 模块职责与数据

| 模块     | 主要公开能力                                                                                                                                                      | 数据与协作边界                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| accounts | `accountService.list/add/addMany/update/saveIdentity/saveSession`；界面的 `parsePasswordCsv`、`matchImportedAccounts`、`saveAccountDetails`、`importAccountBatch` | 持有账号、凭据、身份和账号代理引用；读取站点配置，使用代理校验                       |
| sites    | `siteService` 的查询、增加、批量增加、修改、删除；`SiteEditor`、`BookmarkImportPanel` 和站点保存/导入接口                                                         | 持有站点配置及学习后保存的公共流程；站点删除保留待恢复账号                           |
| learning | `learningService`；内容模块的录制、身份监控、事件回报；学习步骤与配置界面                                                                                         | `learn:<tabId>` 临时会话归学习；公共流程由站点保存，个人用户 ID 由账号保存           |
| checkin  | `checkinService.startBatch/cancel/getQueue/saveSchedule`；内容模块的任务执行与身份核验                                                                            | `status`、`checkinQueue`、`task:*`、`headlessStats` 和定时计划归执行；结果交记录模块 |
| slider   | `sliderService`；内容模块的验证码定位、求解及框架交互                                                                                                             | 处理单次挑战，持有对应图像和 frame 会话；拖动派发不等于站点确认通过                  |
| proxies  | `proxyService` 的导入、测试、分配及 `acquire/transfer/release/recover`                                                                                            | 持有代理、监听计划、订阅来源和浏览器代理租约；账号/站点保留绑定信息                  |
| records  | `recordService.getResults/getBalances/saveBalance/saveReward/saveBalanceError`；记录和余额展示                                                                    | 持有 `results`、`balances` 和展示计算；任务有效性和最终身份闸门仍由执行验证          |
| settings | `settingsService.getLaunchMode/setLaunchMode`；`createBackupPayload/validateBackupPayload/encryptBackup/decryptBackup`                                            | 通用设置与备份协调；定时归执行，订阅归代理，实际数据通过各模块保存                   |

## 入口和运行环境

- 后台入口连接服务、注册事件并将既有消息分发到对应模块。
  `MUTATE_APP` 和原有操作名、返回值保持兼容。
- 管理页和侧边栏使用相同应用编排，模块各自提供界面、规则和客户端操作。
- 内容脚本入口连接学习、执行、滑块与通用页面能力，构建时打包成经典脚本。
- OpenCV 运行库及经典模板匹配 Worker 继续作为静态资源加载。

后台 service 模块各自拥有 `bg*State` 和存储方法。
内容与界面通过模块 owner state 的 getter/setter 桥接原始作用域。
这层桥接只维持既有 live binding；函数、业务方法和消息分支实际位于功能模块。
函数声明先注册，初始化步骤按原顺序执行，避免重排造成闭包或异步行为变化。

后台公开服务接口可供新代码调用；模块间的兼容绑定可以逐步替换为描述性接口，
同时保留行为测试。本次保留部分原压缩命名，没有声称恢复丢失的原始源码。

## 保留的业务规则

- 批量账号按站点和规范化用户名判重，返回原有新增/跳过结果；不同登录方式
  的凭据要求保持各自规则。
- 删除站点保留账号到待恢复列表。账号改归属保留普通账密、代理和备注，
  清理旧站专属身份、会话、凭据、状态、结果和余额。
- 学习流程供本站账号共用，不保存演示时的账号密码。学习读到的个人身份只绑定
  目标账号，拒绝覆盖既有冲突绑定。
- 签到仍使用单活动任务的串行队列，学习、代理测试和扫描继续遵守网络资源互斥。
- session 中的队列和任务可在 Service Worker 唤醒后恢复；浏览器完全退出后的
  原队列续跑没有新增保证。
- 代理属于浏览器级全局资源，获取、转移、取消、超时和恢复都通过同一租约管理。
  仅名称条目不能分配为真实出口。
- 余额和任务结果经过当前任务、站点和账号身份验证后写入。手动标记的余额差值
  继续标明估算依据，不当成已证实的签到奖励。
- 备份保留 `aah-backup-v1`、PBKDF2-SHA256 和 AES-GCM 格式。
  范围仍为站点、账号、代理、监听计划及订阅来源；会话、代理密码等字段仍排除。
- 通知发送、并发签到、TypeScript 和 WXT 没有加入本轮功能。

## 构建与测试

只修改 `src/` 和 `public/`，由 `npm run build` 生成 `output/chrome-mv3/`。
输出包含 source map，便于从扩展调试器定位模块源码。
`npm run verify` 完成构建、行为测试、静态资源检查和源码排版检查。

身份测试保留原有用户 ID、学习采样、账号冲突和 Cookie 残留断言，
分别从源码与产物提取实际实现进行验证。模块行为测试通过真实服务与模拟
Chrome 平台检查批量保存、账号恢复、代理释放、余额与备份规则。
浏览器验证使用独立测试配置加载生成扩展，不使用日常浏览器账号配置。

一次性迁移工具在 `scripts/migration/`，包含功能归属映射及作用域抽取实现。
这些工具以外部旧基线为输入，供审计和复核，不属于构建链，也不作为源码来源。
