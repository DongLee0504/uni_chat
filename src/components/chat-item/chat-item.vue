<template>
  <view class="chat-item" @click="showChatBox()">
    <view class="left">
      <head-image
        :url="chat.headImage"
        :name="chat.showName"
        :size="90"
        :online="chat.online"
        :showOnline="chat.type == 'PRIVATE'"
      ></head-image>
    </view>
    <view class="chat-right">
      <view class="chat-name">
        <view class="chat-name-text">
          <text>{{ chat.showName }}</text>
          <text class="chat-secname">{{ chat.secname ? `@${chat.secname}` : "" }}</text>
        </view>
        <view class="chat-time">{{ $date.toTimeText(chat.lastSendTime) }}</view>
      </view>
      <view class="chat-content">
        <view class="chat-at-text">{{ atText }}</view>
        <view class="chat-send-name" v-show="chat.sendNickName">{{ chat.sendNickName + ":&nbsp;" }}</view>
        <rich-text class="chat-content-text" :nodes="$emo.transform(chat.lastContent)"></rich-text>
      </view>
      <view v-if="chat.unreadCount > 0" class="unread-text">
        <uni-badge size="normal" type="error" :text="chat.unreadCount"></uni-badge>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "chatItem",
  data() {
    return {};
  },
  props: {
    chat: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
  methods: {
    showChatBox() {
      uni.navigateTo({
        url: "/pages/chat/chat-box?chatIdx=" + this.index,
      });
    },
  },
  computed: {
    atText() {
      if (this.chat.atMe) {
        return "[有人@我]";
      } else if (this.chat.atAll) {
        return "[@全体成员]";
      }
      return "";
    },
  },
};
</script>

<style scoped lang="scss">
.chat-item {
  height: 100rpx;
  display: flex;
  margin-bottom: 2rpx;
  position: relative;
  padding: 10rpx;
  padding-left: 20rpx;
  align-items: center;
  background-color: white;
  white-space: nowrap;

  &:hover {
    background-color: #eeeeee;
  }

  .left {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
  }

  .chat-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 20rpx;
    text-align: left;
    overflow: hidden;
    position: relative;

    .chat-name {
      display: flex;
      line-height: 50rpx;
      height: 50rpx;

      .chat-name-text {
        flex: 1;
        font-size: 30rpx;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        .chat-secname {
          font-size: 26rpx;
          color: #ff9f44;
        }
      }

      .chat-time {
        font-size: 26rpx;
        text-align: right;
        color: #888888;
        white-space: nowrap;
        overflow: hidden;
      }
    }

    .chat-content {
      display: flex;
      line-height: 44rpx;
      .chat-at-text {
        color: #c70b0b;
        font-size: 24rpx;
      }

      .chat-send-name {
        font-size: 26rpx;
      }

      .chat-content-text {
        flex: 1;
        font-size: 28rpx;
        white-space: nowrap;
        overflow: hidden;
        line-height: 50rpx;
        text-overflow: ellipsis;
      }
    }
    .unread-text {
      position: absolute;
      right:0 ;
      top: 55rpx;
      color: white;
      border-radius: 16rpx;
      padding: 4rpx 12rpx;
      font-size: 20rpx;
      text-align: center;
      white-space: nowrap;
    }
  }
}
</style>
