<template>
  <view class="content">
    <image class="login_logo"
      src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/login_logo.png"
      mode="aspectFit">
    </image>
    <view class="login_slogen">欢迎使用智信</view>
    <button v-if="checked" class="btn weixin" open-type="getPhoneNumber" @getphonenumber="handleWeixinLogin">
      <image class="icon_weixin"
        src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/wechat.svg">
      </image>
      <text>微信登录</text>
    </button>
    <button v-else class="btn weixin" @click="handleWeixinLogin()">
      <image class="icon_weixin"
        src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/wechat.svg">
      </image>
      <text>微信登录</text>
    </button>
    <view class="btn account" @click="handleAccountLogin()">账号手机号登录</view>
    <view class="btn apply" @click="handleToApply()">申请账号</view>
    <view class="protocol">
      <checkbox-group @change="change">
        <checkbox :value="1" :checked="checked" color="#2EA7E0" style="transform: scale(0.7)" />
        <text>已阅读并同意 </text>
        <text class="link" @click="handleGoProtocol('agreement')">《用户协议》</text>
        <text>和</text>
        <text class="link" @click="handleGoProtocol('secrecy')">《隐私协议》</text>
      </checkbox-group>
    </view>
    <view class="mask" v-if="showMask">
      <view class="mask_box">
        <view class="content">
          <text>已阅读并同意 </text>
          <text class="link" @click="handleGoProtocol('agreement')">《用户协议》</text>
          <text>和</text>
          <text class="link" @click="handleGoProtocol('secrecy')">《隐私协议》</text>
        </view>
        <view class="footer">
          <button class="btn cancel" @click="showMask = false">取消</button>
          <button class="btn confirm" open-type="getPhoneNumber" @getphonenumber="handleConfirm">同意</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { loginSuccessCallback } from "../../common/util";
import { ref, unref, getCurrentInstance } from "vue"
const { proxy } = getCurrentInstance();
const checked = ref(false);
const showMask = ref(false);

const change = (e) => {
  const values = e.detail.value;
  if (values.length > 0) {
    checked.value = true;
  } else {
    checked.value = false;
  }
}
const handleWeixinLogin = (e) => {
  if (unref(checked)) {
    console.log(e, "e");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      ajaxWeixinLogin(e.detail.code);
    }
  } else {
    showMask.value = true;
  }
}
const handleConfirm = (e) => {
  checked.value = true;
  console.log(e, "e");
  if (e.detail.errMsg == "getPhoneNumber:ok") {
    ajaxWeixinLogin(e.detail.code);
  }
}
const handleAccountLogin = () => {
  uni.navigateTo({
    url: "/pages/login/account",
  });
}
const handleToApply = () => {
  uni.navigateTo({
    url: "/pages/login/apply",
  });
}
const handleGoProtocol = (type) => {
  let src = '';
  const baseUrl = process.env.H5_URL
  if (type == 'agreement') {
    src = encodeURIComponent(`${baseUrl}/agreementZhixin.html`)
  } else {
    src = encodeURIComponent(`${baseUrl}/secrecyZhixin.html`)
  }
  if (!src) return
  uni.navigateTo({
    url: `/pages/webview/webview?src=${src}`,
  })
}
const ajaxWeixinLogin = (code) => {
  proxy.$http({
    url: "/auth/user/appletLogin",
    method: "POST",
    data: { code, appletType: 3 },
  }).then((res) => {
    if (res.tars_ret == 0) {
      loginSuccessCallback(JSON.stringify(res.rsp.stXPUserInfo));
    } else {
      uni.showToast({
        icon: "error",
        title: res.msg || "接口异常",
      });
    }
  });
}
</script>

<style lang="scss" scoped>
.content {
  text-align: center;

  .login_logo {
    width: 750rpx;
    height: 560rpx;
  }

  .login_slogen {
    font-size: 48rpx;
    color: #1D2129;
    font-weight: bold;
    text-align: center;
  }

  .btn {
    width: 630rpx;
    height: 90rpx;
    line-height: 90rpx;
    margin: 0 auto;
    border-radius: 24rpx;
    text-align: center;
    font-size: 30rpx;
    color: #fff;

    &.weixin {
      margin-top: 150rpx;
      background: linear-gradient(309deg, #2AE874 0%, #05C789 100%);
      color: #fff;

      .icon_weixin {
        width: 52rpx;
        height: 36rpx;
        vertical-align: middle;
        margin-right: 10rpx;
      }
    }

    &.account {
      margin-top: 40rpx;
      background: linear-gradient(309deg, #17A7EB 0%, #128CEA 100%);
    }

    &.apply {
      color: #2ea7e0;
    }
  }

  .protocol {
    font-size: 28rpx;
    margin-top: 160rpx;

    checkbox .uni-checkbox-input {
      border-radius: 50% !important;
    }

    .link {
      color: #2ea7e0;
    }
  }

  .mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;

    .mask_box {
      width: 582rpx;
      padding: 40rpx 20rpx;
      box-sizing: border-box;
      border-radius: 24rpx;
      background: #fff;
      font-size: 28rpx;

      .link {
        color: #2ea7e0;
      }

      .footer {
        display: flex;
        margin-top: 48rpx;

        .btn {
          flex: 1;
          height: 80rpx;
          line-height: 80rpx;
          border-radius: 80rpx;

          &::after {
            border: none;
          }

          &.cancel {
            border: 2rpx solid #e8eaed;
            background: #fff;
            color: #1D2129;
          }

          &.confirm {
            margin-left: 40rpx;
            border: none;
            background: #2ea7e0;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
