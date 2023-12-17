<template>
	<view class="head-image" @click="showUserInfo($event)" :title="name">
		<image class="avatar-image" :class="{ 'level1': shareLevel == 1, 'level2': shareLevel == 2, 'level3': shareLevel == 3 }"
			:src="url || 'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/default_avatar.svg'"
			:style="avatarImageStyle" lazy-load="true" mode="aspectFill" />
		<!-- <view class="avatar-text" v-if="!url" :style="avatarTextStyle">
			{{name.substring(0,1).toUpperCase()}}
		</view> -->
		<view v-if="showOnline" class="status" :class="online ? 'online' : 'offline'" title="用户当前在线"></view>
		<slot></slot>
	</view>
</template>

<script>
export default {
	name: 'head-image',
	data() {
		return {
			colors: ['#7dd24b', '#c7515a', '#db68ef', '#15d29b', '#85029b', '#c9b455', '#fb2609', '#bda818', '#af0831', '#326eb6']
		};
	},
	props: {
		id: {
			type: Number
		},
		size: {
			type: Number,
			default: 20
		},
		url: {
			type: String
		},
		name: {
			type: String,
			default: '?'
		},
		online: {
			type: Boolean,
			default: false
		},
		showOnline: {
			type: Boolean,
			default: true
		},
		shareLevel: {
			type: Number,
			default: 0
		}
	},
	methods: {
		showUserInfo(e) {
			if (this.id && this.id > 0) {
				uni.navigateTo({
					url: '/pages/common/user-info?id=' + this.id
				});
			}
		}
	},
	computed: {
		avatarImageStyle() {
			return `width:${this.size}rpx; height:${this.size}rpx;`;
		},
		avatarTextStyle() {
			return `width: ${this.size}rpx;height:${this.size}rpx;
				color:${this.textColor};font-size:${this.size * 0.6}rpx;`;
		},
		textColor() {
			let hash = 0;
			for (var i = 0; i < this.name.length; i++) {
				hash += this.name.charCodeAt(i);
			}
			return this.colors[hash % this.colors.length];
		}
	}
};
</script>

<style scoped lang="scss">
.head-image {
	position: relative;
	cursor: pointer;

	.avatar-image {
		position: relative;
		overflow: hidden;
		box-sizing: border-box;
		border: 4rpx solid #CFE6F6;
		// background: linear-gradient(180deg, rgba(193, 220, 221, 1), rgba(100, 167, 174, 1));
		// background-origin: border-box;
		// background-clip: border-box;
		border-radius: 50%;
		vertical-align: bottom;
		&.level1 {
			border-color: #64A7AE;
		}
		&.level2 {
			border-color: #A25EFF;
		}
		&.level3 {
			border-color: #E0427E;
		}
	}

	.avatar-text {
		background-color: #f2f2f2;
		/* 默认背景色 */
		border-radius: 50%;
		/* 圆角效果 */
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #ccc;
	}

	.status {
		position: absolute;
		right: 0;
		bottom: 0;
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
</style>
