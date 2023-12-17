<template>
	<view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :cancelText="cancelText" :confirmText="confirmText" :title="title" @confirm="dialogConfirm" @close="dialogClose">
				<slot></slot>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
export default {
	name: 'dialog',
	data() {
		return {};
	},
	props: {
		cancelText: {
			type: String,
			default: '取消'
		},
		confirmText: {
			type: String,
			default: '确定'
		},
		title: {
			type: String,
			default: ''
		}
	},
	methods: {
		open() {
			this.$refs.alertDialog.open();
		},
		dialogClose() {
			this.$refs.alertDialog.close();
		},
		dialogConfirm() {
			this.$refs.alertDialog.close();
			this.$emit('dialogConfirm');
		}
	},
};
</script>

<style lang="scss" scoped>
	
</style>
