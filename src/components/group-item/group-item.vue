<template>
	<view class="group-item" @click="showGroupInfo()">
		<view class="item-left">
			<head-image :name="group.remark" :url="group.headImage" :size="90"></head-image>
			<view class="group-name">
				<view class="name">{{ group.remark?group.remark:group.name}}</view>
				<view class="num">
					<uni-icons type="person" size="14" color="#86909C"></uni-icons>
					<text class="txtnum">{{group.vermicelliNum}}</text>
				</view>
			</view>
		</view>
		<view class="item-right" v-if="group.type == 2">
			+ 圈子
		</view>

	</view>
</template>

<script>
	export default {
		name: "group-item",
		data() {
			return {}
		},
		methods: {
			showGroupInfo() {
				// uni.navigateTo({
				// 	url: "/pages/group/group-info?id=" + this.group.id
				// })
				if (this.group.type == 2) {
					let groupInfo = JSON.stringify(this.group)
					uni.navigateTo({
						url: "/pages/group/group-add?groupInfo=" + groupInfo
					})
				} else {
					let chat = {
						type: 'GROUP',
						targetId: this.group.id,
						showName: this.group.remark ? this.group.remark : this.group.name,
						headImage: this.group.headImage,
					};
					this.$store.commit("openChat", chat);
					uni.navigateTo({
						url: "/pages/chat/chat-box?chatIdx=0"
					})
				}
			},
		},
		props: {
			group: {
				type: Object
			}
		}
	}
</script>

<style scope lang="scss">
	.group-item {
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rpx;
		position: relative;
		padding: 10rpx 20rpx;
		align-items: center;
		background-color: white;
		white-space: nowrap;

		&:hover {
			background-color: #eeeeee;
		}

		.item-left {
			display: flex;
			align-items: center;
			.group-name {
				font-size: 32rpx;
				padding-left: 20rpx;
				font-weight: 600;
				width: 400rpx;
				.name {
					text-align: left;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.num {
				.txtnum {
					font-size: 24rpx;
					color: #86909C;
					margin-left: 5rpx;
				}
			}
		}

		.item-right {
			width: 116rpx;
			height: 48rpx;
			border-radius: 12rpx;
			border: 1rpx solid #2EA7E0;
			font-size: 26rpx;
			color: #2EA7E0;
			text-align: center;
			line-height: 46rpx;
		}

	}
</style>