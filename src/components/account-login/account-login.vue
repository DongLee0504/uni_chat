<template>
	<view class="account_form">
		<uni-forms ref="accountLoginForm" :modelValue="accountLoginForm" :rules="rules" validate-trigger="bind">
			<uni-forms-item name="sAccountId">
				<uni-easyinput v-model="accountLoginForm.sAccountId" prefixIcon="account" placeholder="请输入账号" />
			</uni-forms-item>
			<uni-forms-item name="sPassword">
				<uni-easyinput v-model="accountLoginForm.sPassword" prefixIcon="psw" placeholder="请输入密码" type="password" />
			</uni-forms-item>
			<uni-forms-item>
				<view class="btn_login" @click="handleLogin">登录</view>
			</uni-forms-item>
		</uni-forms>
	</view>
	<view class="btn_forget" @click="handleSetPsw()">忘记密码？</view>
</template>

<script>
import { loginSuccessCallback } from '../../common/util.js';
export default {
	data() {
		return {
			accountLoginForm: {
				sAccountId: '',
				sPassword: ''
			},
			rules: {
				sAccountId: {
					rules: [
						{
							required: true,
							errorMessage: '请输入账号'
						}
					]
				},
				sPassword: {
					rules: [
						{
							required: true,
							errorMessage: '请输入密码'
						}
					]
				}
			}
		};
	},
	props: {
		protocolChecked: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		handleSetPsw() {
			uni.navigateTo({
				url: '/pages/login/setPsw'
			});
		},
		handleLogin() {
			this.$refs.accountLoginForm.validate().then((res) => {
				if (res) {
					if (this.protocolChecked) {
						const { sAccountId, sPassword } = res;
						const data = {
							sAccountId,
							sPassword,
							eType: 1,
							stXPTerminalInfo: {
								iSubType: 1,
								iTerminalType: 7,
								iVersion: 1
							}
						};
						this.$http({
							url: '/auth/user/login',
							method: 'post',
							data
						}).then((res) => {
							if (res.tars_ret == 0) {
								loginSuccessCallback(JSON.stringify(res.rsp.stXPUserInfo));
							} else {
								uni.showToast({
									icon: 'error',
									title: res.msg || '接口异常'
								});
							}
						});
					} else {
						this.$emit('showDialog');
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.btn_login {
	height: 90rpx;
	line-height: 90rpx;
	background: linear-gradient(309deg, #17a7eb 0%, #128cea 100%);
	border-radius: 24rpx;
	text-align: center;
	color: #fff;
}

.btn_forget {
	font-size: 28rpx;
	color: #2ea7e0;
	text-align: center;
}
</style>
