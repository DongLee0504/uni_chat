<template>
	<view class="notice-box">
		<view class="inpbox">
			<textarea type="text" v-model="groupInfo.notice" class="inp" maxlength="100">
				<text class="num">{{groupInfo.notice.length}}/100</text>
			</textarea>
		</view>
		<view class="desc">
			<text>公告修改后，将在圈子中通知其他成员</text>
		</view>
		<view class="btn" @click="updateInfo()">
			确定
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				groupInfo: {
					notice: ''
				}
			}
		},
		methods: {
			updateInfo() {
				this.$http({
					url: "/im/group/modify",
					method: "PUT",
					data: this.groupInfo
				}).then((res) => {
					const group = res.data;
					this.$store.commit("updateGroup", group);
					uni.showToast({
						title: "圈子公告信息设置成功",
						icon: 'none'
					});
					setTimeout(() => {
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2];
						prevPage.$vm.loadGroupInfo();
						uni.navigateBack();
					}, 1000);
					let msgInfo = {
						content: `管理员设置了群公告`,
						groupId: this.groupInfo.id,
						atUserIds: [],
						type: 21,
					};
					this.$http({
						url: '/im/message/group/send',
						method: "POST",
						data: msgInfo,
					}).then((res) => {
						console.log(res);
						msgInfo.id = res.data;
						msgInfo.sendTime = new Date().getTime();
						this.$store.commit("insertMessage", msgInfo);
					})
				})
			}
		},
		onLoad(options) {
			console.log(options);
			this.groupInfo = JSON.parse(options.groupInfo);
		}
	}
</script>

<style lang="scss">
	.notice-box {
		.inpbox {
			width: 600rpx;
			padding: 24rpx 32rpx;
			background: #F5F7FA;
			border-radius: 16rpx;
			border: 2rpx solid #F0F1F2;
			margin: 40rpx auto 24rpx;

			.inp {
				position: relative;

				.num {
					position: absolute;
					bottom: 0;
					right: 0;
					color: #4E5969;
					font-size: 26rpx;
				}
			}

		}

		.desc {
			color: #86909C;
			margin: 0 auto 50rpx;
			width: 580rpx;
			font-size: 26rpx;
		}

		.btn {
			margin: 0 auto;
			width: 670rpx;
			height: 90rpx;
			background: linear-gradient(309deg, #17A7EB 0%, #128CEA 100%);
			border-radius: 16rpx;
			font-size: 30rpx;
			color: #fff;
			text-align: center;
			line-height: 90rpx;
		}

	}
</style>