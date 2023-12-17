<template>
	<view class="group-add">
		<view class="img-box">
			<image :src="group.headImage" mode=""></image>
		</view>
		<view class="intro">
			<view class="intro-item">
				公告：{{group.notice}}
			</view>
			<view class="intro-item">
				圈子名称：{{group.name}}
			</view>
			<view class="num-info">
				<view class="num">
					<uni-icons type="person" size="14" color="#86909C"></uni-icons>
					<text class="txtnum">{{group.vermicelliNum}}</text>
				</view>
				<text class="friends">{{group.friendNum}}个好友已加入</text>
			</view>
		</view>
	 <view class="join-btn" @click="addGroup()">
	 	加入圈子
	 </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				groupId: null,
				group: {}
			}
		},
		methods: {
			addGroup() {
				this.$http({
					url: `/im/group/come/${this.groupId}`,
					method: "get",
				}).then((res) => {
					console.log(res);
					this.$store.commit("updateGroup", this.group);
					let chat = {
						type: 'GROUP',
						targetId: this.group.id,
						showName: this.group.remark?this.group.remark:this.group.name,
						headImage: this.group.headImage,
					};
					this.$store.commit("openChat", chat);
					uni.navigateTo({
						url: "/pages/chat/chat-box?chatIdx=0"
					})
				});
			}
		},
		onLoad(options) {
			this.group = JSON.parse(options.groupInfo);
			this.groupId = JSON.parse(options.groupInfo).id;
		}
	}
</script>

<style lang="scss" scoped>
	.group-add {
		padding: 24rpx;

		.img-box {
			width: 100%;
			height: 332rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.intro{
			margin: 80rpx auto;
			.intro-item{
				margin: 10rpx auto;
				font-size: 28rpx;
			}
			.num-info{
				display: flex;
				align-items: center;
				.num{
					display: flex;
					align-items: center;
					.txtnum{
						color: #86909C;
						font-size: 24rpx;
						margin-left: 3rpx;
					}
				}
				.friends{
					font-size: 24rpx;
					color: #2EA7E0;
					margin-left: 40rpx;
				}
			}
		}
		.join-btn{
			width: 638rpx;
			height: 90rpx;
			background: linear-gradient(309deg, #17A7EB 0%, #128CEA 100%);
			border-radius: 16rpx;
			color: #fff;
			font-size: 30rpx;
			line-height: 90rpx;
			text-align: center;
			margin: 0 auto;
		}
	}
</style>