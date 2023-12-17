<template>
  <view class="page chat-box">
    <view class="status_bar" :style="{ height: systemInfo.safeAreaInsets.top + 'px' }">
      <!-- 这里是状态栏 -->
    </view>
    <view class="bar_box" :style="{ height: menuButtonInfo.bottom - systemInfo.safeAreaInsets.top + 5 + 'px' }">
      <uni-icons class="btn-side left" type="back" size="28" @click="onNavBack()"></uni-icons>
      <view class="header">
        <view class="title">{{ title }}</view>
        <!-- <uni-icons class="btn-side right" type="more-filled" size="30" @click="onShowMore()"></uni-icons> -->
        <view class="desc" @click="onShowMore()" v-if="chat.type == 'GROUP'">
          <!-- <uni-icons class="btn-side right" type="more-filled" size="12" color="#2EA7E0" ></uni-icons> -->
          <image src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/identityAuth_image/info.svg" mode=""></image>
        </view>
        <view v-else class="status" :class="chat.online ? 'online' : 'offline'" title="用户当前在线"></view>
      </view>
    </view>
    <view class="chat-msg" @click="switchChatTabBox('none', true)">
      <scroll-view
        class="scroll-box"
        scroll-y="true"
        @scrolltoupper="onScrollToTop"
        :scroll-into-view="'chat-item-' + scrollMsgIdx"
      >
        <view v-for="(msgInfo, idx) in chat.messages" :key="idx">
          <chat-message-item
            v-if="idx >= showMinIdx"
            :headImage="headImage(msgInfo)"
            :showName="showName(msgInfo)"
            @recall="onRecallMessage"
            @delete="onDeleteMessage"
            @longPressHead="onLongPressHead(msgInfo)"
            @download="onDownloadFile"
            :id="'chat-item-' + idx"
            :msgInfo="msgInfo"
          >
          </chat-message-item>
        </view>
      </scroll-view>
    </view>
    <view v-if="atUserIds.length > 0" class="chat-at-bar" @click="openAtBox()">
      <view class="iconfont icon-at">:&nbsp;</view>
      <scroll-view v-if="atUserIds.length > 0" class="chat-at-scroll-box" scroll-x="true" scroll-left="120">
        <view class="chat-at-items">
          <view v-for="(m, index) in atUserItems" class="chat-at-item" :key="index">
            <head-image :name="m.aliasName" :url="m.headImage" :size="50"></head-image>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="send-bar">
      <view class="iconfont icon-emoji" @click="switchChatTabBox('emo', true)"></view>
      <view class="send-text">
        <textarea
          class="send-text-area"
          v-model="sendText"
          auto-height
          :show-confirm-bar="false"
          :adjust-position="false"
          @confirm="sendTextMessage()"
          @keyboardheightchange="onKeyboardheightchange"
          @input="onTextInput"
          confirm-type="send"
          confirm-hold
          :hold-keyboard="true"
        ></textarea>
      </view>
      <!-- <view v-if="chat.type == 'GROUP'" class="iconfont icon-at" @click="openAtBox()"></view> -->
      <view v-if="sendText == ''" class="iconfont icon-add-tools" @click="switchChatTabBox('tools', true)"> </view>
      <view
        v-if="sendText != '' || atUserIds.length > 0"
        class="btn-send"
        type="primary"
        @touchend.prevent="sendTextMessage()"
        size="mini"
      >
      </view>
    </view>

    <view class="chat-tab-bar" v-show="chatTabBox != 'none' || showKeyBoard" :style="{ height: `${keyboardHeight}px` }">
      <view v-if="chatTabBox == 'tools'" class="chat-tools">
        <view class="chat-tools-item">
          <image-upload
            :maxCount="9"
            sourceType="album"
            :onBefore="onUploadImageBefore"
            :onSuccess="onUploadImageSuccess"
            :onError="onUploadImageFail"
          >
            <view class="tool-icon iconfont icon-tool-picture"></view>
          </image-upload>
          <!-- <view class="tool-name">相册</view> -->
        </view>
        <!-- <view class="chat-tools-item">
          <image-upload
            sourceType="camera"
            :onBefore="onUploadImageBefore"
            :onSuccess="onUploadImageSuccess"
            :onError="onUploadImageFail"
          >
            <view class="tool-icon iconfont icon-camera"></view>
          </image-upload>
          <view class="tool-name">拍摄</view>
        </view> -->
        <view class="chat-tools-item">
          <file-upload :onBefore="onUploadFileBefore" :onSuccess="onUploadFileSuccess" :onError="onUploadFileFail">
            <view class="tool-icon iconfont icon-tool-file"></view>
          </file-upload>
          <!-- <view class="tool-name">文件</view> -->
        </view>
        <view class="chat-tools-item" @click="showTip()">
          <view class="tool-icon iconfont icon-tool-voice"></view>
          <!-- <view class="tool-name">语音输入</view> -->
        </view>
        <view class="chat-tools-item" @click="showTip()">
          <view class="tool-icon iconfont icon-tool-call"></view>
          <!-- <view class="tool-name">呼叫</view> -->
        </view>
      </view>
      <scroll-view v-if="chatTabBox === 'emo'" class="chat-emotion" scroll-y="true">
        <view class="emotion-item-list">
          <image
            class="emotion-item"
            :title="emoText"
            :src="$emo.textToPath(emoText)"
            v-for="(emoText, i) in $emo.emoTextList"
            :key="i"
            @click="selectEmoji(emoText)"
            mode="aspectFit"
            lazy-load="true"
          ></image>
        </view>
      </scroll-view>
      <view v-if="showKeyBoard"></view>
    </view>
    <chat-at-box ref="atBox" :ownerId="group.ownerId" :members="groupMembers" @complete="onAtComplete"></chat-at-box>
  </view>
</template>

<script>
import { getMenuButtonBoundingClientRect } from "../../common/util.js";
export default {
  data() {
    return {
      menuButtonInfo: getMenuButtonBoundingClientRect(),
      systemInfo: uni.getSystemInfoSync(),
      chat: {},
      friend: {},
      group: {},
      groupMembers: [],
      sendText: "",
      showVoice: false, // 是否显示语音录制弹窗
      scrollMsgIdx: 0, // 滚动条定位为到哪条消息
      chatTabBox: "none",
      showKeyBoard: false,
      keyboardHeight: 322,
      atUserIds: [],
      showMinIdx: 0, // 下标小于showMinIdx的消息不显示，否则可能很卡
    };
  },
  methods: {
    showTip() {
      uni.showToast({
        title: "加班开发中...",
        icon: "none",
      });
    },
    openAtBox() {
      this.$refs.atBox.init(this.atUserIds);
      this.$refs.atBox.open();
    },
    onAtComplete(atUserIds) {
      this.atUserIds = atUserIds;
    },
    onLongPressHead(msgInfo) {
      if (!msgInfo.selfSend && this.chat.type == "GROUP" && this.atUserIds.indexOf(msgInfo.sendId) < 0) {
        this.atUserIds.push(msgInfo.sendId);
      }
    },
    headImage(msgInfo) {
      if (this.chat.type == "GROUP") {
        let member = this.groupMembers.find((m) => m.userId == msgInfo.sendId);
        return member ? member.headImage : "";
      } else {
        return msgInfo.selfSend ? this.mine.imgPath : this.chat.headImage;
      }
    },
    showName(msgInfo) {
      if (this.chat.type == "GROUP") {
        let member = this.groupMembers.find((m) => m.userId == msgInfo.sendId);
        return member ? member.aliasName : "";
      } else {
        return msgInfo.selfSend ? this.mine.userName : this.chat.showName;
      }
    },
    sendTextMessage() {
      if (!this.sendText.trim() && this.atUserIds.length == 0) {
        return uni.showToast({
          title: "不能发送空白信息",
          icon: "none",
        });
      }
      let atText = this.createAtText();
      let msgInfo = {
        content: this.sendText + atText,
        atUserIds: this.atUserIds,
        type: 0,
      };
      // 填充对方id
      this.fillTargetId(msgInfo, this.chat.targetId);
      this.sendText = "";
      this.$http({
        url: this.messageAction,
        method: "POST",
        data: msgInfo,
      })
        .then((id) => {
          msgInfo.id = id;
          msgInfo.sendTime = new Date().getTime();
          msgInfo.sendId = this.$store.state.userStore.userInfo.userId;
          msgInfo.selfSend = true;
          msgInfo.status = this.$enums.MESSAGE_STATUS.UNSEND;
          this.$store.commit("insertMessage", msgInfo);
          this.sendText = "";
        })
        .finally(() => {
          // 滚动到底部
          this.scrollToBottom();
          // 清空@用户列表
          this.atUserIds = [];
        });
    },
    createAtText() {
      let atText = "";
      this.atUserIds.forEach((id) => {
        if (id == -1) {
          atText += ` @全体成员`;
        } else {
          let member = this.groupMembers.find((m) => m.userId == id);
          if (member) {
            atText += ` @${member.aliasName}`;
          }
        }
      });
      return atText;
    },
    fillTargetId(msgInfo, targetId) {
      if (this.chat.type == "GROUP") {
        msgInfo.groupId = targetId;
      } else {
        msgInfo.recvId = targetId;
      }
    },
    scrollToBottom() {
      let size = this.chat.messages.length;
      if (size > 0) {
        this.scrollToMsgIdx(size - 1);
      }
    },
    scrollToMsgIdx(idx) {
      // 如果scrollMsgIdx值没变化，滚动条不会移动
      if (idx == this.scrollMsgIdx && idx > 0) {
        this.$nextTick(() => {
          // 先滚动到上一条
          this.scrollMsgIdx = idx - 1;
          // 再滚动目标位置
          this.scrollToMsgIdx(idx);
        });
        return;
      }
      this.$nextTick(() => {
        console.log("scrollToMsgIdx", this.scrollMsgIdx);
        this.scrollMsgIdx = idx;
      });
    },
    switchChatTabBox(chatTabBox, hideKeyBoard) {
      this.chatTabBox = chatTabBox;
      if (hideKeyBoard) {
        uni.hideKeyboard();
      }
    },
    selectEmoji(emoText) {
      this.sendText += `#${emoText};`;
    },
    onNavBack() {
      uni.switchTab({
        url: "/pages/chat/chat",
      });
    },
    onKeyboardheightchange(e) {
      if (e.detail.height > 0) {
        this.showKeyBoard = true;
        this.switchChatTabBox("none", false);
        this.keyboardHeight = this.rpxTopx(e.detail.height);
      } else {
        this.showKeyBoard = false;
      }
    },
    onUploadImageBefore(file) {
      let data = {
        originUrl: file.path,
        thumbUrl: file.path,
      };
      let msgInfo = {
        id: 0,
        fileId: file.uid,
        sendId: this.mine.id,
        content: JSON.stringify(data),
        sendTime: new Date().getTime(),
        selfSend: true,
        type: this.$enums.MESSAGE_TYPE.IMAGE,
        loadStatus: "loading",
        status: this.$enums.MESSAGE_STATUS.UNSEND,
      };
      // 填充对方id
      this.fillTargetId(msgInfo, this.chat.targetId);
      // 插入消息
      this.$store.commit("insertMessage", msgInfo);
      // 借助file对象保存
      file.msgInfo = msgInfo;
      // 滚到最低部
      this.scrollToBottom();
      return true;
    },
    onUploadImageSuccess(file, res) {
      let msgInfo = JSON.parse(JSON.stringify(file.msgInfo));
      msgInfo.content = JSON.stringify(res.data);
      this.$http({
        url: this.messageAction,
        method: "POST",
        data: msgInfo,
      }).then((id) => {
        msgInfo.loadStatus = "ok";
        msgInfo.id = id;
        this.$store.commit("insertMessage", msgInfo);
      });
    },
    onUploadImageFail(file, err) {
      let msgInfo = JSON.parse(JSON.stringify(file.msgInfo));
      msgInfo.loadStatus = "fail";
      this.$store.commit("insertMessage", msgInfo);
    },
    onUploadFileBefore(file) {
      let data = {
        name: file.name,
        size: file.size,
        url: file.path,
      };
      let msgInfo = {
        id: 0,
        sendId: this.mine.id,
        content: JSON.stringify(data),
        sendTime: new Date().getTime(),
        selfSend: true,
        type: this.$enums.MESSAGE_TYPE.FILE,
        loadStatus: "loading",
        status: this.$enums.MESSAGE_STATUS.UNSEND,
      };
      // 填充对方id
      this.fillTargetId(msgInfo, this.chat.targetId);
      // 插入消息
      this.$store.commit("insertMessage", msgInfo);
      // 借助file对象保存
      file.msgInfo = msgInfo;
      // 滚到最低部
      this.scrollToBottom();
      return true;
    },
    onUploadFileSuccess(file, res) {
      let data = {
        name: file.name,
        size: file.size,
        url: res.data,
      };
      let msgInfo = JSON.parse(JSON.stringify(file.msgInfo));
      msgInfo.content = JSON.stringify(data);
      this.$http({
        url: this.messageAction,
        method: "POST",
        data: msgInfo,
      }).then((id) => {
        msgInfo.loadStatus = "ok";
        msgInfo.id = id;
        this.$store.commit("insertMessage", msgInfo);
      });
    },
    onUploadFileFail(file, res) {
      let msgInfo = JSON.parse(JSON.stringify(file.msgInfo));
      msgInfo.loadStatus = "fail";
      this.$store.commit("insertMessage", msgInfo);
    },
    onDeleteMessage(msgInfo) {
      uni.showModal({
        title: "删除消息",
        content: "确认删除消息?",
        success: (res) => {
          if (!res.cancel) {
            this.$store.commit("deleteMessage", msgInfo);
            uni.showToast({
              title: "删除成功",
              icon: "none",
            });
          }
        },
      });
    },
    onRecallMessage(msgInfo) {
      uni.showModal({
        title: "撤回消息",
        content: "确认撤回消息?",
        success: (res) => {
          if (!res.cancel) {
            let url = `/message/${this.chat.type.toLowerCase()}/recall/${msgInfo.id}`;
            this.$http({
              url: url,
              method: "DELETE",
            }).then(() => {
              msgInfo = JSON.parse(JSON.stringify(msgInfo));
              msgInfo.type = this.$enums.MESSAGE_TYPE.RECALL;
              msgInfo.content = "你撤回了一条消息";
              msgInfo.status = this.$enums.MESSAGE_STATUS.RECALL;
              this.$store.commit("insertMessage", msgInfo);
            });
          }
        },
      });
    },
    onDownloadFile(msgInfo) {
      let url = JSON.parse(msgInfo.content).url;
      uni.downloadFile({
        url: url,
        success(res) {
          if (res.statusCode === 200) {
            var filePath = encodeURI(res.tempFilePath);
            uni.openDocument({
              filePath: filePath,
              showMenu: true,
            });
          }
        },
        fail(e) {
          console.log(e);
          uni.showToast({
            title: "文件下载失败",
            icon: "none",
          });
        },
      });
    },
    onScrollToTop() {
      // #ifdef MP
      // 防止滚动条定格在顶部，不能一直往上滚
      this.scrollToMsgIdx(this.showMinIdx);
      // #endif

      // 多展示10条信息
      this.showMinIdx = this.showMinIdx > 10 ? this.showMinIdx - 10 : 0;
    },
    onShowMore() {
      if (this.chat.type == "GROUP") {
        uni.navigateTo({
          url: "/pages/group/group-info?id=" + this.group.id,
        });
      } else {
        uni.navigateTo({
          url: "/pages/common/user-info?id=" + this.friend.id,
        });
      }
    },
    onTextInput(e) {
      let idx = e.detail.cursor - 1;
      if (this.chat.type == "GROUP" && e.detail.value[idx] == "@") {
        this.openAtBox();
        let sendText = e.detail.value.replace("@", "");
        this.$nextTick(() => {
          this.sendText = sendText;
        });
      }
    },
    readedMessage() {
      if (this.chat.type == "GROUP") {
        var url = `/im/message/group/toRead/${this.chat.targetId}`;
      } else {
        url = `/im/message/private/toRead/${this.chat.targetId}`;
      }
      this.$http({
        url: url,
        method: "GET",
      }).then(() => {
        this.$store.commit("resetUnreadCount", this.chat);
        this.scrollToBottom();
      });
    },
    loadGroup(groupId) {
      this.$http({
        url: `/im/group/find/${groupId}`,
        method: "GET",
      }).then((res) => {
        const group = res.data;
        this.group = group;
        this.$store.commit("updateChatFromGroup", group);
        this.$store.commit("updateGroup", group);
      });

      this.$http({
        url: `/im/group/members/${groupId}`,
        method: "get",
      }).then((res) => {
        const groupMembers = res.data;
        this.groupMembers = groupMembers;
      });
    },
    loadFriend(friendId) {
      // 获取对方最新信息
      this.$http({
        url: `/im/user/find/${friendId}`,
        method: "GET",
      }).then((res) => {
        const friend = res.data;
        this.friend = friend;
        this.$store.commit("updateChatFromFriend", friend);
        this.$store.commit("updateFriend", friend);
      });
    },
    rpxTopx(rpx) {
      // px转换成rpx
      let info = uni.getSystemInfoSync();
      let px = (info.windowWidth * rpx) / 750;
      return Math.floor(rpx);
    },
  },
  computed: {
    mine() {
      return this.$store.state.userStore.userInfo;
    },
    title() {
      if (!this.chat) {
        return "";
      }
      let title = this.chat.showName;
      if (this.chat.type == "GROUP") {
        let size = this.groupMembers.filter((m) => !m.quit).length;
        title += `(${size})`;
      }
      return title;
    },
    messageAction() {
      return `/im/message/${this.chat.type.toLowerCase()}/send`;
    },
    messageSize() {
      if (!this.chat || !this.chat.messages) {
        return 0;
      }
      return this.chat.messages.length;
    },
    unreadCount() {
      return this.chat.unreadCount;
    },
    atUserItems() {
      let atUsers = [];
      this.atUserIds.forEach((id) => {
        if (id == -1) {
          atUsers.push({
            id: -1,
            aliasName: "全体成员",
          });
          return;
        }
        let member = this.groupMembers.find((m) => m.userId == id);
        if (member) {
          atUsers.push(member);
        }
      });
      return atUsers;
    },
  },
  watch: {
    messageSize: function (newSize, oldSize) {
      // 接收到消息时滚动到底部
      if (newSize > oldSize) {
        this.scrollToBottom();
      }
    },
    unreadCount: {
      handler(newCount, oldCount) {
        if (newCount > 0) {
          // 消息已读
          this.readedMessage();
        }
      },
    },
  },
  onLoad(options) {
    // 聊天数据
    this.chat = this.$store.state.chatStore.chats[options.chatIdx];
    console.log(this.chat);
    // 初始状态只显示30条消息
    let size = this.chat.messages.length;
    this.showMinIdx = size > 30 ? size - 30 : 0;
    // 激活当前会话
    this.$store.commit("activeChat", options.chatIdx);
    // 页面滚到底部
    this.scrollToBottom();
    // 消息已读
    this.readedMessage();
    // 加载好友或群聊信息
    if (this.chat.type == "GROUP") {
      this.loadGroup(this.chat.targetId);
    } else {
      this.loadFriend(this.chat.targetId);
    }
  },
  onUnload() {
    this.$store.commit("activeChat", -1);
  },
};
</script>

<style lang="scss" scoped>
.chat-box {
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;

  .bar_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 500rpx;

    .header {
      width: 350rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      .title {
        font-size: 34rpx;
        max-width: 315rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .btn-side {
        font-size: 28rpx;
        cursor: pointer;

        &.left {
          left: 30rpx;
        }
      }

      .desc {
        width: 32rpx;
        height: 32rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 2rpx;

        image {
          width: 100%;
          height: 100%;
        }
      }
      .status {
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
        border: 6rpx solid white;
        &.online {
          background: #10c579;
        }
        &.offline {
          background: #c9cdd4;
        }
      }
    }
  }

  .chat-msg {
    flex: 1;
    padding: 0;
    border: #dddddd solid 1px;
    overflow: hidden;
    position: relative;
    background-color: #f8f8f8;

    .scroll-box {
      height: 100%;
    }
  }

  .chat-at-bar {
    display: flex;
    align-items: center;
    padding: 0 10rpx;
    border: #dddddd solid 1px;

    .icon-at {
      font-size: 35rpx;
      color: darkblue;
      font-weight: 600;
    }

    .chat-at-scroll-box {
      flex: 1;
      width: 80%;

      .chat-at-items {
        display: flex;
        align-items: center;
        height: 70rpx;

        .chat-at-item {
          padding: 0 3rpx;
        }
      }
    }
  }

  .send-bar {
    display: flex;
    align-items: center;
    padding: 16rpx 32rpx;
    margin-bottom: 24rpx;
    background-color: white;

    .iconfont {
      font-size: 60rpx;
      margin: 3rpx;
      &.icon-emoji {
        display: inline-block;
        width: 48rpx;
        height: 48rpx;
        background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/chat_image/icon_emogi.svg) no-repeat;
        background-size: 100%;
      }
      &.icon-add-tools {
        display: inline-block;
        width: 48rpx;
        height: 48rpx;
        background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/chat_image/icon_add.svg) no-repeat;
        background-size: 100%;
      }
    }

    .send-text {
      flex: 1;
      background-color: #f8f8f8 !important;
      overflow: auto;
      padding: 20rpx;
      margin: 0 24rpx;
      background-color: #fff;
      border-radius: 20rpx;
      max-height: 300rpx;
      min-height: 85rpx;
      font-size: 30rpx;
      box-sizing: border-box;

      .send-text-area {
        width: 100%;
      }
    }

    .btn-send {
      width: 48rpx;
      height: 48rpx;
      background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/chat_image/icon_send.svg) no-repeat;
      background-size: 100%;
    }
  }

  .chat-tab-bar {
    height: 364rpx !important;
    padding: 20rpx;
    background-color: #fff;
    border-top: 2rpx solid #F0F1F2;

    .chat-tools {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .chat-tools-item {
        width: 140rpx;
        padding: 15rpx;
        display: flex;
        flex-direction: column;
        align-items: center;

        .tool-icon {
          // padding: 15rpx;
          // font-size: 80rpx;
          // background-color: white;
          // border-radius: 20%;
          width: 116rpx;
          height: 116rpx;
          &.icon-tool-picture {
            background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/chat_image/icon_picture.svg) no-repeat;
            background-size: 100%;
          }
          &.icon-tool-file {
            background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/chat_image/icon_file.svg) no-repeat;
            background-size: 100%;
          }
          &.icon-tool-voice {
            background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/chat_image/icon_voice.svg) no-repeat;
            background-size: 100%;
          }
          &.icon-tool-call {
            background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/chat_image/icon_phone.svg) no-repeat;
            background-size: 100%;
          }
        }

        .tool-name {
          height: 60rpx;
          line-height: 60rpx;
          font-size: 25rpx;
        }
      }
    }

    .chat-emotion {
      height: 100%;

      .emotion-item-list {
        display: flex;
        flex-wrap: wrap;

        .emotion-item {
          width: 40px;
          height: 40px;
          text-align: center;
          cursor: pointer;
          padding: 6px;
        }
      }
    }
  }
}
</style>
