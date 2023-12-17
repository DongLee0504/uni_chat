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
    </view>
    <view class="friend-tip" v-if="$store.state.contactStore.contacts.length == 0"
      >温馨提示：您现在还没有任何好友，快点击右上方'+'按钮添加好友吧~</view
    >
    <view class="friend-items" v-else>
      <scroll-view class="scroll-bar" scroll-with-animation="true" scroll-y="true">
        <uv-index-list :index-list="indexList" customNavHeight="100rpx">
          <template v-for="(itemArr, index) in indexArr" :key="index">
            <uv-index-item>
              <uv-index-anchor :text="indexList[index]"></uv-index-anchor>
              <view v-for="(contact, index) in itemArr" :key="index" @click="handleItemClick(contact)">
                <friend-item :friend="contact" class="item">
                  <view v-if="contact.isRequest != 2" class="btn_add">
                    <uni-icons type="plusempty" size="12" color="#2EA7E0"></uni-icons>
                    <text>加好友</text>
                  </view>
                </friend-item>
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
  methods: {
    handleInput(value) {
      this.setIndexData(value);
    },

    handleItemClick(contact) {
      uni.navigateTo({ url: `/pages/common/user-info?id=${contact.id}` });
    },
    setIndexData(sKeyword = "") {
      const contacts = this.$store.state.contactStore.contacts.filter((f) => f.nickName.indexOf(sKeyword) > -1);
      this.indexList = contacts.length > 0 ? Array.from(new Set(contacts.map((f) => f.initial))) : [""];
      let indexArr = [];
      this.indexList.forEach((item) => {
        let tempArr = [];
        contacts.forEach((f) => {
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
        position: relative;
        .btn_add {
          position: absolute;
          right: 60rpx;
          width: 116rpx;
          height: 48rpx;
          line-height: 48rpx;
          border: 2rpx solid #2ea7e0;
          border-radius: 12rpx;
          font-size: 26rpx;
          background: #fff;
          color: #2ea7e0;
          text-align: center;
        }
      }
      ::v-deep .uv-index-anchor {
        background-color: #fff !important;
      }
    }
  }
}
</style>
