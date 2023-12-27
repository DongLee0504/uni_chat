<template>
	<view class="content">
		<view class="status_bar" :style="{ height: state.systemInfo.safeAreaInsets.top + 'px' }">
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
			<view class="tab_header">
				<view :class="{ title: true, active: state.activeKey == 1 }" @click="state.activeKey = 1">手机登录</view>
				<view :class="{ title: true, active: state.activeKey == 2 }" @click="state.activeKey = 2">账号登录</view>
			</view>
			<view class="tab_content">
				<mobile-login ref="mobileLoginRef" class="mobile_form" v-if="state.activeKey == 1" :protocolChecked="state.checked"
					@showDialog="showDialog()"></mobile-login>
				<account-login ref="accountLoginRef" v-if="state.activeKey == 2" :protocolChecked="state.checked"
					@showDialog="showDialog()"></account-login>
			</view>
			<view class="protocol">
				<checkbox-group @change="checkboxChange">
					<checkbox :value="1" :checked="state.checked" color="#2EA7E0" style="transform: scale(0.7)" />
					<text>已阅读并同意</text>
					<text class="link">《用户协议》</text>
					<text>和</text>
					<text class="link">《隐私协议》</text>
				</checkbox-group>
			</view>
		</view>
		<common-dialog ref="commonDialogRef" class="common_dialog" @dialogConfirm="dialogConfirm()">
			<view>
				<text>已阅读并同意</text>
				<text class="link">《用户协议》</text>
				<text>和</text>
				<text class="link">《隐私协议》</text>
			</view>
		</common-dialog>
	</view>
</template>

<script setup>
import { getMenuButtonBoundingClientRect } from '../../common/util.js';
import Back from '../../components/back/back.vue';
import MobileLogin from '../../components/mobile-login/mobile-login.vue';
import AccountLogin from '../../components/account-login/account-login.vue';
import CommonDialog from '../../components/common-dialog/common-dialog.vue';
import { reactive, ref, toRaw } from 'vue';

const commonDialogRef = ref(null);
const mobileLoginRef = ref(null);
const accountLoginRef = ref(null);
const state = reactive({
	menuButtonInfo: getMenuButtonBoundingClientRect(),
	systemInfo: uni.getSystemInfoSync(),
	activeKey: 1,
	checked: false
});
const checkboxChange = (e) => {
	const values = e.detail.value;
	if (values.length > 0) {
		state.checked = true;
	} else {
		state.checked = false;
	}
}

const handleBack = () => {
	uni.navigateTo({
		url: '/pages/login/index'
	});
}
const formHeight = () => {
	return `calc(100vh - ${state.systemInfo.safeAreaInsets.top}px - ${state.menuButtonInfo.height}px - 80rpx -  225rpx)`;
}
const showDialog = () => {
	commonDialogRef.value.open();
}
const dialogConfirm = () => {
	state.checked = true;
	const formRef = state.activeKey == 1 ? mobileLoginRef : accountLoginRef;
	formRef.value.handleLogin();
}
</script>

<style lang="scss" scoped>
@import '../../static/style/common.scss';

.content {
	height: 100vh;
	background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/bg.svg') no-repeat;
	background-size: cover;

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

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
		background: #fff;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		position: relative;

		.tab_header {
			display: flex;
			background: #e0f1ff;
			border-top-left-radius: 40rpx;
			border-top-right-radius: 40rpx;

			.title {
				width: 50%;
				height: 100rpx;
				line-height: 100rpx;
				background: #e0f1ff;
				text-align: center;
				font-size: 30rpx;
				font-weight: bold;
				position: relative;
				border-top-right-radius: 40rpx;
				border-top-left-radius: 40rpx;

				&.active {
					color: #2ea7e0;
					border-top-left-radius: 40rpx;
					border-top-right-radius: 40rpx;
					background: #fff;

					&::after {
						content: '';
						position: absolute;
						width: 40rpx;
						height: 4rpx;
						background: #2ea7e0;
						bottom: 0;
						left: 50%;
						margin-left: -20rpx;
					}
				}
			}
		}

		.tab_content {
			margin-top: 60rpx;
			padding: 0 40rpx;

			.mobile_form {
				::v-deep .uni-forms-item:nth-child(2) {
					input {
						flex: 0 1 380rpx;
					}
				}
			}

			::v-deep .uni-forms-item__content {
				position: relative;
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

			::v-deep.uni-icons.uniui-mobile {
				display: inline-block;
				width: 44rpx;
				height: 44rpx;
				background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/shouji.svg') no-repeat;
				background-size: 100%;
			}

			::v-deep.uni-icons.uniui-code {
				display: inline-block;
				width: 44rpx;
				height: 44rpx;
				background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/yanzhengma.svg') no-repeat;
				background-size: 100%;
			}

			::v-deep.uni-icons.uniui-account {
				display: inline-block;
				width: 44rpx;
				height: 44rpx;
				background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/icon_account.svg') no-repeat;
				background-size: 100%;
			}

			::v-deep.uni-icons.uniui-psw {
				display: inline-block;
				width: 44rpx;
				height: 44rpx;
				background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/login_image/icon_psw.svg') no-repeat;
				background-size: 100%;
			}
		}

		.protocol {
			position: absolute;
			bottom: 20rpx;
			font-size: 28rpx;
			text-align: center;

			checkbox .uni-checkbox-input {
				border-radius: 50% !important;
			}

			.link {
				color: #2ea7e0;
			}
		}
	}

	.common_dialog {
		font-size: 28rpx;

		.link {
			color: #2ea7e0;
		}
	}
}
</style>
