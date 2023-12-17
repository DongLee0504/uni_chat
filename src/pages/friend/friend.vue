<template>
  <view class="tab-page friend">
    <view class="nav-bar">
      <view class="nav-search">
        <uni-search-bar
          bgColor="#fff"
          radius="8"
          cancelButton="none"
          placeholder="搜索"
          @input="handleInput"
        ></uni-search-bar>
      </view>
      <!-- <view  class="nav-add" @click="onAddNewFriends()">
				<uni-icons type="personadd" size="30"></uni-icons>
			</view> -->
    </view>
    <view class="friend-tip" v-if="$store.state.friendStore.friends.length == 0"
      >温馨提示：您现在还没有任何好友，快点击右上方'+'按钮添加好友吧~</view
    >
    <view class="friend-items" v-else>
      <scroll-view class="scroll-bar" scroll-with-animation="true" scroll-y="true">
        <!-- <view v-for="(friend, index) in $store.state.friendStore.friends" :key="index">
					<friend-item :friend="friend"></friend-item>
				</view> -->
        <uv-index-list :index-list="indexList" customNavHeight="100rpx">
          <view class="item new_friend" @click="handleGoNewFriend()">
            <text class="icon icon_new_friend"></text>
            <text class="text">新的好友</text>
            <uni-badge
              class="num"
              size="noraml"
              v-if="$store.state.newFriendStore.friends.length"
              :text="$store.state.newFriendStore.friends.length"
            />
          </view>
          <view class="item address_book" @click="handleGoBook()">
            <text class="icon icon_address_book"></text>
            <text class="text">通讯录</text>
          </view>
          <template v-for="(itemArr, index) in indexArr" :key="index">
            <uv-index-item>
              <uv-index-anchor :text="indexList[index]"></uv-index-anchor>
              <view v-for="(friend, index) in itemArr" :key="index" @click="handleItemClick(friend)">
                <friend-item :friend="friend"></friend-item>
              </view>
            </uv-index-item>
          </template>
        </uv-index-list>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      indexList: [],
      indexArr: [],
    };
  },
  computed: {},
  watch: {
    "$store.state.friendStore.friends": {
      deep: true,
      handler(newVal, oldVal) {
        this.setIndexData();
      },
    },
  },
  methods: {
    handleInput(value) {
      this.setIndexData(value);
    },
    handleGoBook() {
      uni.navigateTo({
        url: "/pages/contact/contact",
      });
    },
    handleGoNewFriend() {
      uni.navigateTo({
        url: "/pages/newFriend/newFriend",
      });
    },
    handleItemClick(friend) {
      uni.navigateTo({ url: `/pages/common/user-info?id=${friend.id}` });
    },
    setIndexData(sKeyword = "") {
      const friends = this.$store.state.friendStore.friends.filter((f) => f.nickName.indexOf(sKeyword) > -1);
      this.indexList = friends.length > 0 ? Array.from(new Set(friends.map((f) => f.initial))) : [""];
      let indexArr = [];
      this.indexList.forEach((item) => {
        let tempArr = [];
        friends.forEach((f) => {
          if (f.initial == item) {
            tempArr.push(f);
          }
        });
        indexArr.push(tempArr);
      });
      this.indexArr = indexArr;
    },
  },
  created() {
    this.setIndexData();
  },
  onShow() {
    const app = getApp();
    const unreadCount = app.getTotalUnreadCount();
    app.refreshUnreadBadge(unreadCount);
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

  .nav-bar {
    margin: 5rpx;
    display: flex;
    align-items: center;
    background-color: white;
    .nav-search {
      flex: 1;
      &::v-deep .uni-searchbar {
        background: #f8fafd;
      }
      ::v-deep .uni-searchbar__box {
        justify-content: flex-start;
      }
    }

    .nav-add {
      line-height: 56px;
      cursor: pointer;
    }
  }

  .friend-items {
    flex: 1;
    padding: 0;
    overflow: hidden;
    position: relative;

    .scroll-bar {
      height: 100%;
      .item {
        height: 120rpx;
        display: flex;
        align-items: center;
        padding: 0 32rpx;
        background: #fff;
        margin-bottom: 2rpx;
        .text {
          font-size: 32rpx;
        }
        .num {
          margin-left: auto;
        }
        .icon {
          display: inline-block;
          width: 88rpx;
          height: 88rpx;
          margin-right: 24rpx;
          &.icon_new_friend {
            background: url("https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/icon_add_friend.svg")
              no-repeat;
            background-size: 100%;
          }
          &.icon_address_book {
            background: url("https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/icon_address_book.svg")
              no-repeat;
            background-size: 100%;
          }
        }
      }
      ::v-deep .uv-index-anchor {
        background-color: #fff !important;
      }
    }
  }
}
</style>
