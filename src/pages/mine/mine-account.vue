<template>
	<view class="page">
		<view class="list">
			<view class="item">
				<view class="left">账号</view>
				<view class="middle">{{ accountInfo.sUid }}</view>
			</view>
			<view class="item" @click="handlePopup(1)">
				<view class="left">绑定手机号</view>
				<view class="middle">{{ accountInfo.sPhone }}</view>
				<view class="right">
					<text class="text">更换手机号</text>
					<text class="icon_arrow_right"></text>
				</view>
			</view>
			<view class="item" @click="handlePopup(2)">
				<view class="left">密码</view>
				<view class="middle">******</view>
				<view class="right">
					<text class="text">更换密码</text>
					<text class="icon_arrow_right"></text>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" @change="(e) => popupChange(e)">
			<view v-if="type == 1" class="popup_content">
				<view class="header">
					<text class="icon_close" @click="handleClose()"></text>
					<text>修改手机号</text>
				</view>
				<view class="form_wrapper mobile_form">
					<uni-forms ref="updatePhoneForm" :modelValue="updatePhoneForm" :rules="rules" validate-trigger="bind">
						<uni-forms-item name="sPhoneNum">
							<uni-easyinput v-model="updatePhoneForm.sPhoneNum" type="number" prefixIcon="mobile" placeholder="请输入手机号" />
						</uni-forms-item>
						<uni-forms-item name="sPhoneCode">
							<uni-easyinput v-model="updatePhoneForm.sPhoneCode" type="number" prefixIcon="code" placeholder="请输入验证码" :clearable="false" />
							<text class="btn_code" :class="count > 0 ? 'count' : ''" @click.stop="handleGetCode()">{{ count > 0 ? count + '秒后重新获取' : '获取验证码' }}</text>
						</uni-forms-item>
						<uni-forms-item>
							<view class="btn_confirm" @click="handleUpdatePhone()">确定</view>
						</uni-forms-item>
					</uni-forms>
				</view>
			</view>
			<view v-if="type == 2" class="popup_content">
				<view class="header">
					<text class="icon_close" @click="handleClose()"></text>
					<text>修改密码</text>
				</view>
				<view class="form_wrapper paw_form">
					<uni-forms ref="updatePswForm" :modelValue="updatePswForm" :rules="pswRules" validate-trigger="bind">
						<uni-forms-item name="sOldPassword">
							<uni-easyinput type="password" v-model="updatePswForm.sOldPassword" placeholder="请输入原密码" />
						</uni-forms-item>
						<uni-forms-item name="sNewPassword">
							<uni-easyinput type="password" v-model="updatePswForm.sNewPassword" placeholder="请输入新密码" />
						</uni-forms-item>
						<uni-forms-item name="otherPassword">
							<uni-easyinput type="password" v-model="updatePswForm.otherPassword" placeholder="请再次输入新密码" />
						</uni-forms-item>
						<uni-forms-item>
							<view class="btn_confirm" @click="handleUpdatePsw()">确定</view>
						</uni-forms-item>
					</uni-forms>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: 1, // 修改手机号=1 修改密码=2
			accountInfo: {},
			updatePhoneForm: {
				sPhoneNum: '',
				sPhoneCode: ''
			},
			updatePswForm: {},
			count: 0,
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
				}
			},
			pswRules: {
				sOldPassword: {
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
				sNewPassword: {
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
				otherPassword: {
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
								if (value != data.sNewPassword) {
									callback('密码不一致，请重新输入');
								}
							}
						}
					]
				}
			}
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
		handlePopup(type) {
			this.type = type;
			this.$refs.popup.open('bottom');
		},
		handleClose() {
			this.$refs.popup.close();
		},
		handleGetCode() {
			if (this.count > 0) {
				return;
			}

			this.$refs.updatePhoneForm.validateField('sPhoneNum').then((res) => {
				if (res) {
					const { sPhoneNum } = res;
					this.$http({
						url: '/auth/user/sendPhoneCode',
						method: 'post',
						data: {
							sPhoneNum: sPhoneNum,
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
		handleUpdatePhone() {
			this.$refs.updatePhoneForm.validate().then((res) => {
				const { sPhoneNum, sPhoneCode } = res;
				this.$http({
					url: '/user/accountInfo/updateUserPhoneNum',
					method: 'post',
					data: {
						sPhoneNum,
						sPhoneCode
					}
				}).then((res) => {
					if (res.tars_ret == 0) {
						uni.showToast({
							icon: 'success',
							title: '手机号修改成功'
						});
						this.$refs.popup.close();
						this.ajaxGetAccountInfo();
					} else {
						uni.showToast({
							icon: 'error',
							title: res.msg
						});
					}
				});
			});
		},
		handleUpdatePsw() {
			this.$refs.updatePswForm.validate().then((res) => {
				const { sOldPassword, sNewPassword, otherPassword } = res;
				this.$http({
					url: '/user/accountInfo/updatePasswordXP',
					method: 'post',
					data: {
						sOldPassword,
						sNewPassword,
						otherPassword,
						iType: 1
					}
				}).then((res) => {
					if (res.tars_ret == 0) {
						uni.showToast({
							icon: 'success',
							title: '密码修改成功'
						});
						this.$refs.popup.close();
						this.ajaxGetAccountInfo();
					}
				});
			});
		},
		popupChange(e) {
			if (e.show) {
				this.updatePhoneForm = {};
				this.updatePswForm = {};
				if (this.type == 1) {
					setTimeout(() => {
						this.$refs.updatePhoneForm.clearValidate();
					}, 100);
				} else {
					setTimeout(() => {
						this.$refs.updatePswForm.clearValidate();
					}, 100);
				}
			}
		},
		ajaxGetAccountInfo() {
			this.$http({
				url: '/user/accountInfo/getIdentyInformationXPSingle',
				method: 'post',
				data: {}
			}).then((res) => {
				if (res) {
					this.accountInfo = res.rsp.stIdentyInformation;
				}
			});
		}
	},
	computed: {},
	mounted() {
		this.ajaxGetAccountInfo();
	}
};
</script>

<style scoped lang="scss">
.page {
	min-height: 100vh;
	overflow-y: auto;
	background: #f8fafd;
	.list {
		background: #fff;
		margin: 26rpx 20rpx 0 20rpx;
		border-radius: 16rpx;
		.item {
			height: 100rpx;
			padding: 0 32rpx;
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #f0f1f2;
			&:last-child {
				border: none;
			}
			.left {
				color: #1d2129;
				font-size: 30rpx;
				width: 200rpx;
			}
			.middle {
				color: #86909c;
				font-size: 30rpx;
			}
			.right {
				margin-left: auto;
				.text {
					font-size: 28rpx;
					color: #86909c;
					margin-right: 24rpx;
				}
				.icon_arrow_right {
					display: inline-block;
					width: 12rpx;
					height: 16rpx;
					background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/icon_arrow_right.svg') no-repeat;
					background-size: 100%;
				}
			}
		}
	}
	.btn {
		height: 90rpx;
		margin: 80rpx 20rpx 0 20rpx;
		line-height: 90rpx;
		text-align: center;
		background: #ffffff;
		border-radius: 16rpx;
		color: #4e5969;
		font-size: 30rpx;
	}
	.popup_content {
		background: #fff;
		padding: 48rpx;
		border-top-left-radius: 32rpx;
		border-top-right-radius: 32rpx;
		.header {
			position: relative;
			text-align: center;
			font-weight: bold;
			color: #1d2129;
			font-size: 36rpx;
			.icon_close {
				position: absolute;
				top: 0;
				right: 0;
				width: 48rpx;
				height: 48rpx;
				background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/icon_close.svg') no-repeat;
				background-size: 100%;
			}
		}
		.form_wrapper {
			margin-top: 66rpx;
			&.mobile_form {
				::v-deep .uni-forms-item:nth-child(2) {
					input {
						flex: 0 1 380rpx;
					}
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
			}
			::v-deep .uni-forms-item__content {
				position: relative;
			}

			::v-deep .is-input-border {
				border-radius: 24rpx;
				height: 88rpx;
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
			.btn_confirm {
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				color: #fff;
				background: linear-gradient(309deg, #17a7eb 0%, #128cea 100%);
				border-radius: 24rpx;
			}
		}
	}
}
</style>
