<template>
	<view>
		<uni-forms ref="mobileLoginForm" :modelValue="mobileLoginForm" :rules="rules" validate-trigger="bind">
			<uni-forms-item name="sAccountId">
				<uni-easyinput v-model="mobileLoginForm.sAccountId" type="number" prefixIcon="mobile"
					placeholder="请输入手机号" />
			</uni-forms-item>
			<uni-forms-item name="sPassword">
				<uni-easyinput v-model="mobileLoginForm.sPassword" type="number" prefixIcon="code"
					placeholder="请输入验证码" :clearable="false" />
				<text class="btn_code" :class="count > 0 ? 'count' : ''"
					@click.stop="handleGetCode()">{{ count > 0 ? count + '秒后重新获取' : '获取验证码' }}</text>
			</uni-forms-item>
			<uni-forms-item>
				<view class="btn_login" @click="handleLogin()">登录</view>
			</uni-forms-item>
		</uni-forms>
	</view>
</template>

<script>
	import { loginSuccessCallback }from '../../common/util.js'
	export default {
		name: 'mobileForm',
		data() {
			return {
				mobileLoginForm: {
					sAccountId: '',
					sPassword: ''
				},
				count: 0,
				rules: {
					sAccountId: {
						rules: [{
								required: true,
								errorMessage: '请输入手机号'
							},
							{
								pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
								errorMessage: '请输入正确的手机号'
							}
						]
					},
					sPassword: {
						rules: [{
							required: true,
							errorMessage: '请输入验证码'
						}]
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
		watch: {
			count(newValue, oldValue) {
				if (newValue > 0) {
					setTimeout(() => {
						this.count--;
					}, 1000);
				}
			}
		},
		methods: {
			handleGetCode() {
				if (this.count > 0) {
					return;
				}

				this.$refs.mobileLoginForm.validateField('sAccountId').then((res) => {
					if (res) {
						const {
							sAccountId
						} = res;
						this.$http({
							url: '/auth/user/sendPhoneCode',
							method: 'post',
							data: {
								sPhoneNum: sAccountId,
								stXPTerminalInfo: {
									iVersion: 1
								}
							}
						}).then((res) => {
							if (res.tars_ret == 0) {
								this.count = 60;
							} else {
								uni.showToast({
									icon: 'error',
									title: res.msg || '验证码发送失败'
								});
							}
						});
					}
				});
			},
			handleLogin() {
				this.$refs.mobileLoginForm.validate().then((res) => {
					if (res) {
						if (this.protocolChecked) {
							const {
								sAccountId,
								sPassword
							} = res;
							const data = {
								sAccountId,
								sPassword,
								eType: 2,
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
								if(res.tars_ret == 0) {
									loginSuccessCallback(JSON.stringify(res.rsp.stXPUserInfo))
								} else {
									uni.showToast({
										icon: 'error',
										title: res.msg || '接口异常'
									})
								}
							});
						} else {
							this.$emit('showDialog')
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

	.btn_code {
		position: absolute;
		right: 20rpx;
		top: 26rpx;
		color: #2ea7e0;
		font-size: 28rpx;

		&.count {
			color: #86909c;
		}
	}
</style>