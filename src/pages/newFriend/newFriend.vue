<template>
  <view class="friend">
    <view class="friend-tip" v-if="$store.state.newFriendStore.friends.length == 0"
      >温馨提示：您现在还没有任何好友，快点击右上方'+'按钮添加好友吧~</view
    >
    <view class="friend-items" v-else>
      <scroll-view class="scroll-bar" scroll-with-animation="true" scroll-y="true">
        <view
          class="friend-item"
          v-for="(friend, index) in $store.state.newFriendStore.friends"
          :key="index"
          @click="handleItemClick(friend)"
        >
          <head-image :name="friend.nickName" :online="friend.online" :url="friend.headImage" :size="90"></head-image>
          <view class="friend-info">
            <view class="friend-name"
              ><text>{{ friend.nickName }}</text
              ><text class="friend-company">{{ friend.firmName ? "@" + friend.firmName : "" }}</text>
            </view>
            <view class="friend-remark">{{friend.remark }}</view>
          </view>
          <view class="btn_view">查看</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleItemClick(friend) {
      uni.navigateTo({
        url: `/pages/common/user-info?id=${friend.id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.friend {
  background: #f8fafd;
  position: relative;
  display: flex;
  flex-direction: column;
  .friend-tip {
    position: absolute;
    top: 400rpx;
    padding: 50rpx;
    text-align: center;
    line-height: 50rpx;
    text-align: left;
    color: darkblue;
    font-size: 30rpx;
  }
  .friend-items {
    flex: 1;
    padding: 0;
    overflow: hidden;
    position: relative;
    .scroll-bar {
      height: 100%;
      .friend-item {
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

        .friend-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-left: 20rpx;
          text-align: left;

          .friend-name {
            font-size: 30rpx;
            font-weight: 600;
            line-height: 60rpx;
            white-space: nowrap;
            overflow: hidden;
            .friend-company {
              font-size: 26rpx;
              color: #ff9f44;
            }
          }
          .friend-remark {
            font-size: 24rpx;
            color: #86909C;
          }

          .friend-online {
            .online {
              padding-right: 4rpx;
              width: 32rpx;
              height: 32rpx;
            }
          }
        }
        .btn_view {
          width: 92rpx;
          height: 52rpx;
          line-height: 52rpx;
          background: #f0f1f2;
          text-align: center;
          border-radius: 8rpx;
          font-size: 26rpx;
        }
      }
    }
  }
}
</style>
