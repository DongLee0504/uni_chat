<template>
	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	<view class="tab-page group">
		<view class="nav-bar">
			<!-- <view class="nav-search">
				<uni-search-bar @focus="onFocusSearch" cancelButton="none" placeholder="点击搜索群聊"></uni-search-bar>
			</view> -->
			<view class="nav-search">
				<uni-search-bar :focus="true" bgColor="#fff" radius="8" cancelButton="none"
					placeholder="搜索"></uni-search-bar>
			</view>
			<!-- <view class="nav-add" @click="onCreateNewGroup()">
				<uni-icons type="personadd" size="30"></uni-icons>
			</view> -->
		</view>
		<view class="add-box" @click="openPop()">
			<view class="add-btn">+</view>
			<text class="btn-text">新建圈子</text>
		</view>

		<view class="group-tip" v-if="$store.state.groupStore.groups.length==0">
			温馨提示：您现在还没有加入任何群聊，点击'+'按钮可以创建群聊哦~
		</view>
		<view class="group-items" v-else>
			<scroll-view class="scroll-bar" scroll-with-animation="true" scroll-y="true">
				<view v-for="group in $store.state.groupStore.groups" :key="group.id">
					<group-item :group="group"></group-item>
				</view>
			</scroll-view>
		</view>
		<view>
			<uni-popup ref="popup" type="center" :mask-click="false">
				<view class="popup-content">
					<view class="close-btn" @click="closePop()">
						<image src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/share_image/close_icon.png" mode=""></image>
					</view>
					<image class="pic" src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/share_image/addgroup.png" mode=""></image>
					<view class="box">
						<view class="title">
							<image src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/share_image/add_group_title.png" mode=""></image>
						</view>
						<view class="inp-box">
							<input class="inp" maxlength="12" v-model="groupName" placeholder="请输入" />
							<text class="count">{{groupName.length}}/12</text>
						</view>
						<view class="opt-box">
							<button type="default" class="confirm-btn" @click="creatGroup()">确定</button>
						</view>
					</view>	
				</view>
			</uni-popup>
		</view>
	</view>
	<!-- wx audit -->
	<!-- 	<view v-else>
		<user-search></user-search>
	</view> -->
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				groupName: '',
			}
		},
		methods: {
			onFocusSearch() {},
			openPop() {
				// uni.navigateTo({
				// 	url: "/pages/group/group-edit"
				// })
				this.$refs.popup.open();
			},

			closePop() {
				this.$refs.popup.close();
				this.groupName = '';
			},

			creatGroup() {
				if (this.groupName == '') {
					uni.showToast({
						title: `请输入圈子名称`,
						icon: 'error',
						duration: 1000
					});
					return false
				}
				this.$http({
					url: "/im/group/create?groupName="+this.groupName,
					method: "POST",
				}).then((res) => {
					const group = res.data;
					this.$store.commit("addGroup", group);
					this.$refs.popup.close();
					this.groupName = '';
					uni.showToast({
						title: `群聊创建成功，快邀请小伙伴进群吧`,
						icon: 'none',
						duration: 1500
					});
					setTimeout(() => {
						let chat = {
							type: 'GROUP',
							targetId: group.id,
							showName: group.remark?group.remark:group.name,
							headImage: group.headImage,
						};
						this.$store.commit("openChat", chat);
						let msgInfo = {
						 content: '圈子建立成功',
						 groupId: group.id,
						 atUserIds: [],
						 type: 21,
						};
						this.$http({
							url: '/im/message/group/send',
							method: "POST",
							data: msgInfo,
						}).then((res)=>{
							msgInfo.id = res.data;
							msgInfo.sendTime = new Date().getTime();
							this.$store.commit("insertMessage", msgInfo);
							uni.navigateTo({
								url: "/pages/chat/chat-box?chatIdx=0"
							})
						})		
					}, 1500)
				})
			}
		},
		onShow() {
			const app = getApp();
			const unreadCount = app.getTotalUnreadCount();
			app.refreshUnreadBadge(unreadCount);
		}

	}
</script>

<style lang="scss" scoped>
	.group {
		position: relative;
		//border: #dddddd solid 1px;
		display: flex;
		flex-direction: column;

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
			}

			.nav-add {
				line-height: 56px;
				cursor: pointer;
			}
		}

		.add-box {
			height: 100rpx;
			display: flex;
			margin-bottom: 1rpx;
			position: relative;
			padding: 10rpx;
			padding-left: 20rpx;
			align-items: center;
			background-color: white;
			white-space: nowrap;

			.add-btn {
				width: 76rpx;
				height: 76rpx;
				background: linear-gradient(309deg, #17A7EB 0%, #128CEA 100%);
				border-radius: 38rpx;
				line-height: 66rpx;
				text-align: center;
				color: #ffffff;
				font-size: 56rpx;
			}

			.btn-text {
				margin-left: 24rpx;
				font-size: 32rpx;
			}
		}

		.group-tip {
			position: absolute;
			top: 400rpx;
			padding: 50rpx;
			text-align: left;
			line-height: 50rpx;
			color: darkblue;
			font-size: 30rpx;
		}

		.group-items {
			flex: 1;
			padding: 0;
			//border: #dddddd solid 1px;
			overflow: hidden;
			position: relative;

			.scroll-bar {
				height: 100%;
			}
		}

		.popup-content {
			width: 590rpx;
			height: 552rpx;
			position: relative;
			.close-btn{
				position: absolute;
				right: 0;
				top: 0;
				width: 48rpx;
				height: 48rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.pic{
				width: 332rpx;
				height: 170rpx;
				position: absolute;
				top: 0;
				left: 129rpx;
				z-index: 3;
			}
          .box{
			position: absolute;
			left: 0;
			bottom: 0;
			width: 562rpx;
			height: 468rpx;
			background: linear-gradient(180deg, #CDDEFF 0%, #FBFCFF 38%, #FEFFFF 100%);
			border-radius: 48rpx 120rpx 48rpx 48rpx;
			border: 14rpx solid #C1D9FF;
			// border-image: linear-gradient(180deg, rgba(230, 243, 255, 1), rgba(188, 213, 255, 1), rgba(172, 231, 255, 1));
			.title {
				margin: 100rpx auto 40rpx;
				width: 144rpx;
				height: 36rpx;
				image{
					width: 100%;
					height: 100%;
					
				}
			}
			.inp-box{
				width: 462rpx;
				height: 46rpx;
				background: #FFFFFF;
				border-radius: 16rpx;
				border: 2rpx solid #E5E6E8;
				padding: 22rpx 24rpx;
				margin: 40rpx auto;
				font-size: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.inp {
				   width: 380rpx;
				}
				.count{
					color: #C9CDD4;
				}
			}			
			.opt-box {
				display: flex;
				.confirm-btn {
					width: 510rpx;
					height: 90rpx;
					background: linear-gradient(309deg, #17A7EB 0%, #128CEA 100%);
					border-radius: 16rpx;
					font-size: 30rpx;
					color: #FFFFFF;
				}
			}
		  }
		}
	}
</style>