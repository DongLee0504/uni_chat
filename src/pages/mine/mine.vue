<template>
	<view class="page">
		<view class="list">
			<view class="item" @click="handleToAccount()">
				<view class="left">账号管理</view>
				<view class="right">
					<text class="icon_arrow_right"></text>
				</view>
			</view><view class="item">
				<view class="left">资料编辑</view>
				<view class="right">
					<text class="icon_arrow_right"></text>
				</view>
			</view><view class="item" @click="goSharePage()">
				<view class="left">推荐智信</view>
				<view class="right">
					<text class="text">邀请好友获取丰富奖励</text>
					<text class="icon_arrow_right"></text>
				</view>
			</view>
		</view>
		<view class="btn" @click="onQuit()">退出登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			handleToAccount() {
				uni.navigateTo({
					url: '/pages/mine/mine-account'
				})
			},
			onQuit() {
				uni.showModal({
					title: '确认退出?',
					success: (res) => {
						if (res.confirm) {
							getApp().exit()
						}
					}
				});
			},
			goSharePage(){
				uni.navigateTo({
					url: '/pages/share/share'
				})
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userStore.userInfo;
			}
		}


	}
</script>

<style scoped lang="scss">
	.page {
		min-height: 100vh;
		overflow-y: auto;
		background: #F8FAFD;
		.list {
			background: #fff;
			margin: 26rpx 20rpx 0 20rpx;
			border-radius: 16rpx;
			.item {
				height: 100rpx;
				padding: 0 32rpx;
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #F0F1F2;
				&:last-child {
					border: none;
				}
				.left {
					color: #1D2129;
					font-size: 30rpx;
				}
				.right {
					margin-left: auto;
					.text {
						font-size: 28rpx;
						color: #86909C;
						margin-right: 24rpx;
					}
					.icon_arrow_right {
						display: inline-block;
						width: 12rpx;
						height: 16rpx;
						background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/icon_arrow_right.svg') no-repeat;
						background-size: 100%;
					}
				}
			}
		}
		.btn {
			height: 90rpx;
			margin: 80rpx 20rpx 0 20rpx;
			line-height: 90rpx;
			text-align: center;
			background: #FFFFFF;
			border-radius: 16rpx;
			color: #4E5969;
			font-size: 30rpx;
		}
	}
</style>