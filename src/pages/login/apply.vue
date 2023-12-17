<template>
	<view class="content">
		<view class="status_bar" :style="{ height: systemInfo.safeAreaInsets.top + 'px' }">
			<!-- 这里是状态栏 -->
		</view>
		<back @handleBack="handleBack()"></back>
		<view class="logo_box">
			<image class="logo"
				src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/logo.svg">
			</image>
		</view>
		<view class="slogen">欢迎使用智信</view>
		<view class="form_box" :style="{ height: formHeight() }">
			<view class="title">智信账号申请</view>
			<uni-forms ref="applyForm" :modelValue="applyForm" :rules="rules" validate-trigger="bind">
				<uni-forms-item name="sCompany">
					<uni-easyinput v-model="applyForm.sCompany" prefixIcon="icon_company" placeholder="请输入公司名称" />
				</uni-forms-item>
				<uni-forms-item name="sUserName">
					<uni-easyinput v-model="applyForm.sUserName" prefixIcon="icon_name" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item name="sTitle">
					<uni-easyinput v-model="applyForm.sTitle" prefixIcon="icon_position" placeholder="请输入职位" />
				</uni-forms-item>
				<uni-forms-item name="sPhone">
					<uni-easyinput v-model="applyForm.sPhone" prefixIcon="icon_mobile" placeholder="请输入联系电话" />
				</uni-forms-item>
				<uni-forms-item name="sMail">
					<uni-easyinput v-model="applyForm.sMail" prefixIcon="icon_email" placeholder="请输入邮箱" />
				</uni-forms-item>
				<uni-forms-item>
					<view class="btn_apply" @click="handleApply()">提交申请</view>
				</uni-forms-item>
			</uni-forms>
			<view class="tip">审核通过后，我们将为你开通智信账号，请保持联系方式畅通</view>
		</view>
	</view>
</template>

<script>
import { getMenuButtonBoundingClientRect } from '../../common/util.js';
import Back from '../../components/back/back.vue';
export default {
	data() {
		return {
			menuButtonInfo: getMenuButtonBoundingClientRect(),
			systemInfo: uni.getSystemInfoSync(),
			applyForm: {},
			rules: {
				sCompany: {
					rules: [
						{
							required: true,
							errorMessage: '请输入公司名称'
						}
					]
				},
				sUserName: {
					rules: [
						{
							required: true,
							errorMessage: '请输入姓名'
						}
					]
				},
				sTitle: {
					rules: [
						{
							required: true,
							errorMessage: '请输入职位'
						}
					]
				},
				sPhone: {
					rules: [
						{
							required: true,
							errorMessage: '请输入手机号'
						},
						{
							pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
							errorMessage: '请输入正确的手机号'
						}
					]
				},
				sMail: {
					rules: [
						{ required: true, errorMessage: '请输入邮箱' },
						{ format: 'email', errorMessage: '请输入正确的邮箱' }
					]
				}
			}
		};
	},
	methods: {
		handleBack() {
			uni.navigateBack();
		},
		formHeight() {
			return `calc(100vh - ${this.systemInfo.safeAreaInsets.top}px - ${this.menuButtonInfo.height}px - 80rpx -  225rpx)`;
		},
		handleApply() {
			this.$refs.applyForm.validate().then((res) => {
				const { sCompany, sUserName, sTitle, sPhone, sMail } = res;
				const data = { sCompany, sUserName, sTitle, sPhone, sMail };
				this.$http({
					url: '/userx/applyForRial',
					method: 'post',
					type: 'C++',
					data
				}).then((res) => {
					if (res.rsp.iRet == 0) {
						const launchOptions = uni.getLaunchOptionsSync();
						if (launchOptions.query.shareUserId) {
							this.$http({
								url: '/attend/bindAttendUser',
								method: 'post',
								data: {
									shareUserId: launchOptions.query.shareUserId,
									invitedUserPhone: sPhone
								}
							}).then((res) => {

							})
						}
						uni.showToast({
							icon: 'success',
							title: '申请成功'
						});
						setTimeout(function () {
							uni.navigateTo({
								url: '/pages/login/index'
							});
						}, 1500);
					} else {
						uni.showToast({
							icon: 'error',
							title: '申请失败'
						});
					}
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	height: 100vh;
	background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/bg.svg') no-repeat;
	background-size: cover;

	.logo_box {
		text-align: center;
		margin-top: 10rpx;

		.logo {
			width: 120rpx;
			height: 120rpx;
		}
	}

	.slogen {
		font-size: 40rpx;
		font-weight: bold;
		text-align: center;
		margin-top: 32rpx;
		background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/line.svg') no-repeat;
		background-position: bottom center;
	}

	.form_box {
		margin: 80rpx 40rpx 0 40rpx;
		padding: 0 40rpx;
		background: #fff;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		overflow-y: auto;

		.title {
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
			color: #1d2129;
			margin: 40rpx 0;
		}

		::v-deep .is-input-border {
			border-radius: 24rpx;
			height: 88rpx;
		}

		::v-deep .uni-forms-item__label {
			display: none !important;
		}

		::v-deep uni-icons {
			display: flex;
			align-items: center;
		}

		::v-deep.uni-icons.uniui-icon_company {
			display: inline-block;
			width: 44rpx;
			height: 44rpx;
			background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/icon_company.svg') no-repeat;
			background-size: 100%;
		}

		::v-deep.uni-icons.uniui-icon_name {
			display: inline-block;
			width: 44rpx;
			height: 44rpx;
			background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/icon_account.svg') no-repeat;
			background-size: 100%;
		}

		::v-deep.uni-icons.uniui-icon_position {
			display: inline-block;
			width: 44rpx;
			height: 44rpx;
			background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/icon_position.svg') no-repeat;
			background-size: 100%;
		}

		::v-deep.uni-icons.uniui-icon_mobile {
			display: inline-block;
			width: 44rpx;
			height: 44rpx;
			background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/shouji.svg') no-repeat;
			background-size: 100%;
		}

		::v-deep.uni-icons.uniui-icon_email {
			display: inline-block;
			width: 44rpx;
			height: 44rpx;
			background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/icon_email.svg') no-repeat;
			background-size: 100%;
		}

		.btn_apply {
			height: 90rpx;
			line-height: 90rpx;
			background: linear-gradient(309deg, #17a7eb 0%, #128cea 100%);
			border-radius: 24rpx;
			text-align: center;
			color: #fff;
		}

		.tip {
			font-size: 28rpx;
			color: #86909c;
		}
	}
}
</style>
