<template>
	<view class="pop-menu" @tap="onClose()" @contextmenu.prevent="">
		<view class="menu" :style="menuStyle">
			<view class="menu-item" v-for="(item) in items" :key="item.key" @click.prevent="onSelectMenu(item)">
				<uni-icons class="icon" :class="item.icon" :type="item.icon" size="16" color="#fff"></uni-icons>
				<text class="text"> {{ item.name }}</text>
			</view>

		</view>
	</view>
</template>

<script>
export default {
	name: "pop-menu",
	data() {
		return {}
	},
	props: {
		menuStyle: {
			type: String
		},
		items: {
			type: Array
		}
	},
	methods: {
		onSelectMenu(item) {
			this.$emit("select", item);
		},
		onClose() {
			this.$emit("close");
		}
	}
}
</script>

<style lang="scss" scoped>
.pop-menu {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	z-index: 9999;
}

.menu {
	position: fixed;
	border-radius: 7px;
	overflow: hidden;
	box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.1);
	background-color: #3F3F3F;
	color: #fff;

	.menu-item {
		height: 25px;
		line-height: 25px;
		font-size: 18px;
		display: flex;
		padding: 20rpx 0;
		margin: 0 20rpx;
		align-items: center;
		justify-content: center;

		&+.menu-item {
			border-top: 1px solid #9e9e9e;
		}

		.icon {
			display: inline-block;
			width: 32rpx;
			height: 52rpx;
			margin-right: 10rpx;

			&.icon_delete {
				background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/chat_image/icon_delete.svg) no-repeat;
				background-size: contain;
				background-position: center;
			}

			&.icon_download {
				background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/chat_image/icon_download.svg) no-repeat;
				background-size: contain;
				background-position: center;
			}
		}

		.text {
			font-size: 26rpx;
		}
	}
}</style>