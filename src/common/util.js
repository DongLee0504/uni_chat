/**
 * 获取小程序分享胶囊按钮的信息 width height top right bottom left
 */
export const getMenuButtonBoundingClientRect = () => {
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  return menuButtonInfo || {};
};
export const loginSuccessCallback = (value) => {
  uni.setStorageSync("zhixin_applets_loginInfo", value);
  uni.switchTab({
    url: "/pages/home/home",
    success: () => {
      const app = getApp();
      if (app == undefined || app == null) {
        return;
      }
      app.init();
    },
  });
};
export const getShareLevelInfo = (attendCount) => {
  let level = 0;
  let src = "";
  if (attendCount == 0) {
    level = 0;
    src = "";
  } else if (attendCount > 0 && attendCount <= 3) {
    level = 1;
    src = "https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/user_info_image/level1.svg";
  } else if (attendCount > 3 && attendCount <= 9) {
    level = 2;
    src = "https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/user_info_image/level2.svg";
  } else if (attendCount > 9) {
    level = 3;
    src = "https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/user_info_image/level3.svg";
  }
  return {
    level,
    src,
  };
};
