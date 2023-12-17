<template>
  <view class="page">
    <view class="content">
      <view class="info_box"
        :class="{ 'level1': shareLevelInfo.level == 1, 'level2': shareLevelInfo.level == 2, 'level3': shareLevelInfo.level == 3 }">
        <head-image :name="userInfo.userName" :url="userInfo.imgPath" :size="132" :showOnline="false"
          :shareLevel="shareLevelInfo.level">
          <icon class="icon icon_1" v-if="shareLevelInfo.level > 0"></icon>
        </head-image>
        <text class="text">{{ userInfo.userName }}</text>
        <image class="image_level" v-if="shareLevelInfo.level > 0" :src="shareLevelInfo.src">
        </image>
      </view>
      <view class="company_item">
        <text class="label">企业：</text>
        <text>{{ userInfo.secname }}</text>
      </view>
      <view class="company_item item2">
        <text class="label">认证身份：</text>
        <text>{{ userInfo.identity }}</text>
      </view>
      <view class="signature_text" v-if="userInfo.signature">{{ userInfo.signature }}</view>
      <view class="box label_box" v-if="userInfo.labelList && userInfo.labelList.length">
        <text class="title">个人标签</text>
        <view class="label_content">
          <text class="label_item" v-for="(label, index) in userInfo.labelList" :key="index">{{ label }}</text>
        </view>
      </view>
      <view class="box apply_box" v-if="!isFriend">
        <text class="title">申请备注</text>
        <uni-easyinput type="textarea" v-model="userInfo.remark" :disabled="userInfo.isRequest == 1"
          placeholder="请输入申请备注"></uni-easyinput>
      </view>
      <view class="btn_group">
        <button class="btn" v-show="isFriend" type="primary" @click="onSendMessage()">发消息</button>
        <button class="btn" v-show="isFriend" type="warn" @click="onDelFriend()">删除好友</button>
        <button class="btn" v-show="!isFriend && userInfo.isRequest != 1" type="primary" @click="onSendAddFriend()">
          申请添加
        </button>
        <button class="btn" v-show="userInfo.isRequest == 1" type="primary" @click="onDealApply(1)">
          <uni-icons type="icon_pass"></uni-icons><text>通过</text>
        </button>
        <button class="btn" v-show="userInfo.isRequest == 1" @click="onDealApply(2)">
          <uni-icons type="icon_reject"></uni-icons>拒绝
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { getShareLevelInfo } from '../../common/util';
export default {
  data() {
    return {
      userInfo: {},
    };
  },
  methods: {
    onShowFullImage() {
      let imageUrl = this.userInfo.headImage;
      if (imageUrl) {
        uni.previewImage({
          urls: [imageUrl],
        });
      }
    },
    onSendMessage() {
      let chat = {
        type: "PRIVATE",
        targetId: this.userInfo.userId,
        showName: this.userInfo.userName,
        headImage: this.userInfo.imgPath,
        secname: this.userInfo.secname,
      };
      this.$store.commit("openChat", chat);
      uni.navigateTo({
        url: "/pages/chat/chat-box?chatIdx=0",
      });
    },
    // 申请添加
    onSendAddFriend() {
      this.$http({
        url: "/im/friend/addNewFriend",
        method: "post",
        data: {
          friendId: this.userInfo.userId,
          remark: this.userInfo.remark,
        },
      }).then((res) => {
        if (res.code == 0) {
          uni.showToast({
            title: "申请已发送",
            icon: "none",
          });
        }
      });
    },
    // 处理申请
    onDealApply(type) {
      this.$http({
        url: "/im/friend/addNewFriendOk",
        method: "POST",
        data: {
          type,
          userId: this.userInfo.userId,
        },
      }).then((res) => {
        if (type == 1) {
          const friend = this.$store.state.contactStore.contacts.find((f) => f.id == this.userInfo.userId);
          const _friend = JSON.parse(JSON.stringify(friend));
          _friend.online = this.userInfo.online;
          _friend.isRequest = 2;
          this.userInfo.isRequest = 2;
          this.$store.commit("addFriend", _friend);
          this.$store.dispatch("loadContact");
          this.$store.dispatch("loadNewFriend");
          uni.showToast({
            title: "添加成功，对方已成为您的好友",
            icon: "none",
          });
        } else {
          this.$store.dispatch("loadNewFriend");
        }
      });
    },
    onDelFriend() {
      uni.showModal({
        title: "确认删除",
        content: `确认要删除与 '${this.userInfo.userName}'的好友关系吗?`,
        success: (res) => {
          if (res.cancel) return;
          this.$http({
            url: `/im/friend/delete/${this.userInfo.userId}`,
            method: "delete",
          }).then((res) => {
            this.$store.commit("removeFriend", this.userInfo.userId);
            this.$store.commit("removePrivateChat", this.userInfo.userId);
            this.$store.dispatch("loadContact");
            uni.showToast({
              title: `与 '${this.userInfo.userName}'的好友关系已解除`,
              icon: "none",
            });
          });
        },
      });
    },
    updateFriendInfo() {
      // store的数据不能直接修改，深拷贝一份store的数据
      let friend = JSON.parse(JSON.stringify(this.friendInfo));
      friend.headImage = this.userInfo.imgPath;
      friend.nickName = this.userInfo.userName;
      this.$http({
        url: "/friend/update",
        method: "PUT",
        data: friend,
      }).then(() => {
        // 更新好友列表中的昵称和头像
        this.$store.commit("updateFriend", friend);
        // 更新通讯录中的头像和昵称
        this.$store.commit("updateContact", friend);
        // 更新会话中的头像和昵称
        this.$store.commit("updateChatFromFriend", this.userInfo);
      });
    },
    loadUserInfo(id) {
      this.$http({
        url: "/im/user/find/" + id,
        method: "GET",
      }).then((res) => {
        this.userInfo = res.data;
        this.userInfo.remark = `你好，我是${this.userStore.userInfo.secname}的${this.userStore.userInfo.userName}`;
        // 如果发现好友的头像和昵称改了，进行更新
        if (
          this.isFriend &&
          (this.userInfo.imgPath != this.friendInfo.headImage || this.userInfo.userName != this.friendInfo.nickName)
        ) {
          this.updateFriendInfo();
        }
      });
    },
  },
  computed: {
    isFriend() {
      return this.friendInfo != undefined;
    },
    friendInfo() {
      let friends = this.$store.state.friendStore.friends;
      let friend = friends.find((f) => f.id == this.userInfo.userId);
      return friend;
    },
    userStore() {
      return this.$store.state.userStore;
    },
    shareLevelInfo() {
      const { attendCount } = this.userInfo
      return getShareLevelInfo(attendCount)
    }
  },
  onLoad(options) {
    // 查询用户信息
    this.loadUserInfo(options.id);
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f8fafd;
  overflow-y: auto;

  .content {
    margin: 24rpx;
    background: #fff;
    min-height: calc(100vh - 48rpx);

    .info_box {
      height: 236rpx;
      padding: 0 34rpx;
      background: linear-gradient(270deg, #DCEAFF 0%, #E7F3FF 100%);
      border-radius: 32rpx 32rpx 0rpx 0rpx;
      display: flex;
      align-items: center;

      .icon {
        position: absolute;
        bottom: -10rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 130rpx;
        height: 46rpx;
        background: url("https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/user_info_image/icon_level1.svg") no-repeat;
        background-size: 100%;
      }

      .text {
        font-weight: bold;
        color: #1d2129;
        font-size: 44rpx;
        margin-left: 22rpx;
      }

      .image_level {
        width: 200rpx;
        height: 174rpx;
        margin-left: auto;
      }

      &.level1 {
        background: linear-gradient(270deg, #DFF0F6 0%, #E7F5FB 100%);

        & .icon {
          background: url("https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/user_info_image/icon_level1.svg") no-repeat;
          background-size: 100%;
        }
      }

      &.level2 {
        background: linear-gradient(270deg, #EFE8FF 0%, #F3EEFF 100%);

        & .icon {
          background: url("https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/user_info_image/icon_level2.svg") no-repeat;
          background-size: 100%;
        }
      }

      &.level3 {
        background: linear-gradient(270deg, #FFE7E9 0%, #FBEAF0 100%);

        & .icon {
          background: url("https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/user_info_image/icon_level3.svg") no-repeat;
          background-size: 100%;
        }
      }
    }

    .company_item {
      color: #1d2129;
      font-size: 28rpx;
      height: 40rpx;
      line-height: 40rpx;
      padding: 0 34rpx;
      margin: 40rpx 0 16rpx 0;

      &.item2 {
        margin: 0;
      }

      .label {
        display: inline-block;
        width: 150rpx;
        text-align: justify;
        text-align-last: justify;
      }
    }

    .signature_text {
      display: inline-block;
      font-size: 28rpx;
      color: #86909c;
      margin-top: 40rpx;
      position: relative;
      padding: 0 65rpx;

      &:before {
        position: absolute;
        left: 34rpx;
        top: 0;
        content: "";
        width: 28rpx;
        height: 30rpx;
        background: url("https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/user_info_image/icon_signature1.svg") no-repeat;
        background-size: 100%;
      }

      &::after {
        position: absolute;
        right: 34rpx;
        top: 0;
        content: "";
        width: 28rpx;
        height: 30rpx;
        background: url("https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/user_info_image/icon_signature2.svg") no-repeat;
        background-size: 100%;
      }
    }

    .box {
      padding: 0 34rpx;
      margin-top: 40rpx;

      .title {
        font-size: 28rpx;
        font-weight: bold;
        color: #1d2129;
        margin-bottom: 24rpx;
        display: inline-block;
      }

      &.label_box {
        .label_content {
          display: flex;
          flex-wrap: wrap;

          .label_item {
            height: 56rpx;
            line-height: 56rpx;
            padding: 0 20rpx;
            border-radius: 56rpx;
            background: #eef2f7;
            font-size: 26rpx;
            color: #1d2129;
            margin-right: 16rpx;
            margin-bottom: 24rpx;
          }
        }
      }

      &.apply_box {
        &::v-deep .uni-easyinput__content {
          background: #f5f7fa !important;
        }
      }
    }

    .btn_group {
      margin: 60rpx 32rpx 0 32rpx;

      button {
        font-size: 30rpx;
        height: 90rpx;
        line-height: 90rpx;

        &+button {
          margin-top: 24rpx;
        }
      }

      button[type="primary"] {
        background: linear-gradient(309deg, #17a7eb 0%, #128cea 100%);
        border-radius: 16rpx;
        color: #fff;
      }

      button[type="warn"] {
        background: #fff;
        border: 2rpx solid #e5e6e8;
        color: #e84444;
      }

      ::v-deep .uni-icons {
        display: inline-block;
        width: 40rpx;
        height: 40rpx;
        vertical-align: middle;

        &.uniui-icon_pass {
          background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/user_info_image/icon_pass.svg) no-repeat;
          background-size: 100%;
        }

        &.uniui-icon_reject {
          background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/user_info_image/icon_reject.svg) no-repeat;
          background-size: 100%;
        }
      }
    }
  }
}
</style>
