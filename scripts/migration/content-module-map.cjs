/**
 * 内容脚本迁移归属表。
 *
 * 范围以原发布代码的顶层声明名定位，避免按不稳定的行号切分。
 * 每一段的真实声明和初始化都会写入功能模块，入口仅保留启动顺序。
 */
module.exports = {
  autoLogin: {
    source: 'content-scripts/auto-login.js',
    defaultOwner: 'checkin',
    ranges: [
      {
        owner: 'shared',
        from: 'p',
        to: 'Ye',
        description: 'DOM 选择器、可见性、指针操作和等待支持',
      },
      {
        owner: 'shared',
        from: 'Xe',
        to: 'et',
        description: '繁简文字归一和正则兼容',
      },
      {
        owner: 'slider',
        from: 'wo',
        to: 'zu',
        description: '滑块定位、图像取样、可信拖动、框架会话和验证码状态',
      },
      {
        owner: 'slider',
        from: 'Ap',
        to: 'Wp',
        description: '验证重试边界与人工接管判定',
      },
      {
        owner: 'learning',
        from: 'sm',
        to: 'Bm',
        description: '录制意图、动作分类和学习引导进度',
      },
      {
        owner: 'learning',
        from: 'gh',
        to: 'Wg',
        description: '安全动作录制、页面引导、用户 ID 观察和录制会话',
      },
    ],
    overrides: {
      e: 'shared',
      t: 'shared',
      n: 'shared',
      f: 'checkin',
      H: 'shared',
      V: 'shared',
      I: 'shared',
      L: 'shared',
      R: 'shared',
      z: 'shared',
      Kg: 'shared',
      qg: 'shared',
      Jg: 'shared',
      Yg: 'shared',
      Xg: 'shared',
      Zg: 'shared',
      Qg: 'shared',
      $g: 'shared',
    },
    expressionOwners: {
      localeTable: 'shared',
    },
  },
  sliderFrame: {
    source: 'content-scripts/slider-captcha-frame.js',
    defaultOwner: 'slider',
    ranges: [
      {
        owner: 'shared',
        from: 'i',
        to: 'ae',
        description: '框架内 DOM、指针和等待支持',
      },
    ],
    overrides: {
      e: 'shared',
      t: 'shared',
      n: 'shared',
    },
  },
};
