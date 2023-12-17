<template>
	<view class="form_box">
		<uni-forms ref="form" :modelValue="formData" label-position="top" :rules="rules" validate-trigger="bind">
			<uni-forms-item label="手机号码" name="sPhoneNum">
				<uni-easyinput type="text" v-model="formData.sPhoneNum" placeholder="请输入手机号码" />
			</uni-forms-item>
			<uni-forms-item label="短信验证码" name="sPhoneCode" label-width="100">
				<uni-easyinput type="text" v-model="formData.sPhoneCode" placeholder="请输入短信验证码" />
				<text class="btn_code" :class="count > 0 ? 'count' : ''" @click.stop="handleGetCode()">{{ count > 0 ? count + '秒后重新获取' : '获取验证码' }}</text>
			</uni-forms-item>
			<uni-forms-item label="设置密码" name="sPassword">
				<uni-easyinput type="password" v-model="formData.sPassword" placeholder="请输入6-20位字母、数字或符号(除空格" />
			</uni-forms-item>
			<uni-forms-item label="再次确认密码" name="sRepeatPassword" label-width="100">
				<uni-easyinput type="password" v-model="formData.sRepeatPassword" placeholder="请输入6-20位字母、数字或符号(除空格" />
			</uni-forms-item>
			<uni-forms-item>
				<view class="btn_confirm" @click="handleConfirm()">确认修改</view>
			</uni-forms-item>
		</uni-forms>
	</view>
</template>

<script>
export default {
	data() {
		return {
			formData: {},
			rules: {
				sPhoneNum: {
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
				sPhoneCode: {
					rules: [
						{
							required: true,
							errorMessage: '请输入验证码'
						}
					]
				},
				sPassword: {
					rules: [
						{
							required: true,
							errorMessage: '请输入密码'
						},
						{
							minLength: 6,
							errorMessage: '密码长度不能小于6'
						},
						{
							maxLength: 20,
							errorMessage: '密码长度不能大于20'
						}
					]
				},
				sRepeatPassword: {
					rules: [
						{
							required: true,
							errorMessage: '请输入密码'
						},
						{
							minLength: 6,
							errorMessage: '密码长度不能小于6'
						},
						{
							maxLength: 20,
							errorMessage: '密码长度不能大于20'
						},
						{
							validateFunction: function (rule, value, data, callback) {
								if (value != data.sPassword) {
									callback('密码不一致，请重新输入');
								}
							}
						}
					]
				}
			},
			count: 0
		};
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

			this.$refs.form.validateField('sPhoneNum').then((res) => {
				if (res) {
					const { sPhoneNum } = res;
					this.$http({
						url: '/auth/user/sendPhoneCode',
						method: 'post',
						data: {
							sPhoneNum,
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
		handleConfirm() {
			this.$refs.form.validate().then((res) => {
				const { sPhoneNum, sPhoneCode, sPassword, sRepeatPassword } = res;
				this.$http({
					url: '/auth/user/retrievePassword',
					method: 'post',
					data: {
						sPhoneNum,
						sPhoneCode,
						sPassword,
						sRepeatPassword
					}
				}).then((res) => {
					if (res.tars_ret == 0) {
						uni.showToast({
							icon: 'success',
							title: '密码修改成功'
						});
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/login/index'
							});
						},1500);
					}
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.form_box {
	padding: 0 32rpx;
	::v-deep .uni-forms-item:nth-child(2) {
		input {
			flex: 0 1 500rpx;
		}
	}
	::v-deep .uni-forms-item__content {
		position: relative;
	}

	::v-deep .uni-forms-item__label {
		font-weight: bold;
		font-size: 32rpx;
		color: #1d2129;

		.is-required {
			display: none;
		}
	}

	::v-deep .uni-forms-item__content {
		.is-input-border {
			border: 0;
		}
	}

	.btn_code {
		position: absolute;
		right: 20rpx;
		top: 20rpx;
		color: #2ea7e0;
		font-size: 28rpx;

		&.count {
			color: #86909c;
		}
	}
	.btn_confirm {
		text-align: center;
		height: 90rpx;
		line-height: 90rpx;
		background: linear-gradient(309deg, #17a7eb 0%, #128cea 100%);
		border-radius: 24rpx;
		color: #fff;
	}
}
</style>
