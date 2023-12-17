<template>
	<view class="groupname-box">
		<view class="inpbox">
			<input type="text" v-model="groupInfo.name" class="inp" maxlength="12" />
			<text>{{groupInfo.name.length}}/12</text>
		</view>
		<view class="desc">
			<text>名称修改后，将在圈子中通知其他成员</text>
		</view>
		<view class="btn" @click="updateGroupname()">
			确定
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				groupInfo: {
					name: ''
				}
			}
		},
		methods: {
			updateGroupname() {
				this.$http({
					url: "/im/group/modify",
					method: "PUT",
					data: this.groupInfo
				}).then((res) => {
					const group = res.data;
					this.$store.commit("updateGroup", group);
					uni.showToast({
						title: "圈子名称修改成功",
						icon: 'none'
					});
					setTimeout(() => {
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2];
						prevPage.$vm.loadGroupInfo();
						uni.navigateBack();
					}, 1000);
					let msgInfo = {
					 content: `管理员已经更改圈子名称为“${this.groupInfo.name}”`,
					 groupId: this.groupInfo.id,
					 atUserIds: [],
					 type: 21,
					};
					this.$http({
						url: '/im/message/group/send',
						method: "POST",
						data: msgInfo,
					}).then((res)=>{
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

<style lang="scss" scoped>
	.groupname-box {
		.inpbox {
			width: 600rpx;
			height: 90rpx;
			padding: 0 32rpx;
			background: #F5F7FA;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-radius: 16rpx;
			border: 2rpx solid #F0F1F2;
			margin: 40rpx auto 24rpx;

			.inp {
				width: 538rpx;
				height: 90rpx;
				background: #F5F7FA;
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