export default {
  pages: [
    'pages/index/index',
    'pages/publish/index',
    'pages/event-detail/index',
    'pages/chat/index',
    'pages/profile/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '闪现',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#636E72',
    selectedColor: '#FF6B6B',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布',
      },
      {
        pagePath: 'pages/chat/index',
        text: '消息',
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
      },
    ],
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于发现附近的闪现活动',
    },
  },
  requiredPrivateInfos: ['getLocation', 'chooseLocation'],
};
