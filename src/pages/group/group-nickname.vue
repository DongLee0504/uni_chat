<template>
	<view class="nickname-box">
		<view class="inpbox">
			<input type="text" v-model="groupInfo.aliasName" class="inp" maxlength="12" />
			<text>{{groupInfo.aliasName.length}}/12</text>
		</view>
		<view class="btn" @click="updateNickname()">
			确定
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			    groupInfo:{
					aliasName: ''
				}
			}
		},
		methods: {
			updateNickname() {
                this.$http({
                	url: "/im/group/modify",
                	method: "PUT",
                	data: this.groupInfo
                }).then((res) => {
                	const group = res.data;
                	this.$store.commit("updateGroup", group);
                	uni.showToast({
                		title: "昵称修改成功",
                		icon: 'none'
                	});
                	setTimeout(() => {
                		let pages = getCurrentPages();
                		let prevPage = pages[pages.length - 2];
                		prevPage.$vm.loadGroupInfo();
                		uni.navigateBack();
                	}, 1000);
                
                })
			}
		},
		onLoad(options){
			console.log(options);
			this.groupInfo = JSON.parse(options.groupInfo);
		}
	}
</script>

<style lang="scss" scoped>
	.nickname-box {
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
			margin: 50rpx auto;
			.inp {
				width: 538rpx;
				height: 90rpx;
				background: #F5F7FA;


			}
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