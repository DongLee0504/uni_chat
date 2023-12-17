<template>
	<view class="back" :style="{height: menuButtonInfo.height + 'px'}" @click="handleBack()"></view>
</template>

<script>
	import {
		getMenuButtonBoundingClientRect
	} from '../../common/util.js'
	export default {
		data() {
			return {
				menuButtonInfo: getMenuButtonBoundingClientRect()
			};
		},
		methods: {
			handleBack() {
				this.$emit('handleBack')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.back {
		padding: 0 24rpx;
		background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/back.svg') no-repeat;
		background-position: left center;
		background-size: contain;
	}
</style>