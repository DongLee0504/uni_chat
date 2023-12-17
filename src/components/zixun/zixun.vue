<template>
  <scroll-view class="list" :style="{height: listHeight()}" scroll-with-animation="true" scroll-y="true">
    <view class="item" v-for="(item, idx) in list" :key="idx" @click="goDetail(item)">
      <text class="title">{{ item.title }}</text>
      <text class="time">{{ item.publishTime }}</text>
    </view>
  </scroll-view>
</template>
<script>
import { getMenuButtonBoundingClientRect } from '../../common/util.js';
export default {
  name: "zixun",
  data() {
    return {
      list: [],
      menuButtonInfo: getMenuButtonBoundingClientRect(),
      systemInfo: uni.getSystemInfoSync(),
    };
  },
  methods: {
    ajaxGetNews() {
      this.$http({
        url: "/im/auth/getNews",
        method: "GET",
      }).then((res) => {
        if (res.code == 0) {
          this.list = res.data;
        }
      });
    },
    listHeight() {
      return `calc(100vh - ${this.systemInfo.safeAreaInsets.top}px - ${this.menuButtonInfo.height}px - 60rpx - 20rpx - 24rpx)`
    },
    goDetail(item) {
      uni.navigateTo({
        url: `/pages/webview/webview?src=${encodeURIComponent(item.url)}`,
      })
    }
  },
  mounted() {
    this.ajaxGetNews();
  },
};
</script>
<style lang="scss" scoped>
.list {
  margin-top: 24rpx;

  .item {
    padding: 24rpx 32rpx;
    margin-bottom: 24rpx;
    background: #ffffff;
    border-radius: 16rpx;

    .title {
      font-size: 32rpx;
      color: #1d2129;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 20rpx;
    }

    .time {
      font-size: 24rpx;
      color: #86909c;
    }
  }
}
</style>
