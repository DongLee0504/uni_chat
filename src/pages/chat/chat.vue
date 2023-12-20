<template>
  <view class="tab-page">
    <view v-if="loading" class="chat-loading">
      <loading :size="50" :mask="false">
        <view>消息接收中...</view>
      </loading>
    </view>
    <view class="chat-tip" v-if="!loading && chatStore.chats.length == 0">
      温馨提示：您现在还没有任何聊天消息，快跟您的好友发起聊天吧~
    </view>
    <scroll-view class="scroll-bar" v-else scroll-with-animation="true" scroll-y="true">
      <view v-for="(chat, index) in chatStore.chats" :key="index">
        <chat-item :chat="chat" :index="index" @longpress.native="onShowMenu($event, index)"></chat-item>
      </view>
    </scroll-view>

    <pop-menu v-show="state.menu.show" :menu-style="state.menu.style" :items="state.menu.items" @close="state.menu.show = false"
      @select="onSelectMenu"></pop-menu>
  </view>
</template>

<script setup>
import { onShow } from "@dcloudio/uni-app";
import { computed, getCurrentInstance, ref, unref, nextTick } from 'vue'
const { proxy } = getCurrentInstance();
const state = ref({
  menu: {
    show: false,
    style: "",
    chatIdx: -1,
    items: [
      {
        key: "DELETE",
        name: "删除",
        icon: "icon_delete",
      },
      {
        key: "TOP",
        name: "置顶",
        icon: "arrow-up",
      },
    ],
  },
})
const onSelectMenu = (item) => {
  switch (item.key) {
    case "DELETE":
      removeChat(unref(state).menu.chatIdx);
      break;
    case "TOP":
      moveToTop(unref(state).menu.chatIdx);
      break;
    default:
      break;
  }
  state.menu.show = false;
}
const onShowMenu = (e, chatIdx) => {
  uni.getSystemInfo({
    success: (res) => {
      let touches = e.touches[0];
      let style = "";
      /* 因 非H5端不兼容 style 属性绑定 Object ，所以拼接字符 */
      if (touches.clientY > res.windowHeight / 2) {
        style = `bottom:${res.windowHeight - touches.clientY}px;`;
      } else {
        style = `top:${touches.clientY}px;`;
      }
      if (touches.clientX > res.windowWidth / 2) {
        style += `right:${res.windowWidth - touches.clientX}px;`;
      } else {
        style += `left:${touches.clientX}px;`;
      }
      unref(state).menu.style = style;
      unref(state).menu.chatIdx = chatIdx;
      //
      nextTick(() => {
        unref(state).menu.show = true;
      });
    },
  });
}
const removeChat = (chatIdx) => {
  proxy.$store.commit("removeChat", chatIdx);
}
const moveToTop = (chatIdx) => {
  proxy.$store.commit("moveTop", chatIdx);
}
const chatStore = computed(() => proxy.$store.state.chatStore)
const loading = computed(() => chatStore.loadingGroupMsg || chatStore.loadingPrivateMsg)
onShow(() => {
  const app = getApp();
  const unreadCount = app.getTotalUnreadCount();
  app.refreshUnreadBadge(unreadCount);
})
</script>

<style scoped lang="scss">
.chat-tip {
  position: absolute;
  top: 400rpx;
  padding: 50rpx;
  line-height: 50rpx;
  text-align: left;
  color: darkblue;
  font-size: 30rpx;
}

.chat-loading {
  display: block;
  height: 100rpx;
  background: white;
  position: relative;
  color: blue;
}
</style>
