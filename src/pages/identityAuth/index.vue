




<template>
	<view class="my-form">		
		<uni-forms ref="identityAuthForm" :modelValue="formData" label-width="50px" :rules="rules">
			<view class="my-form-wrap">
				<uni-forms-item label="账号" name="account">
					<uni-easyinput :inputBorder="false" :styles="disabledStyles" :placeholderStyle="placeholderStyles" v-model="formData.account" placeholder="请输入账号" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="企业" name="company">
					<uni-easyinput :inputBorder="false" :styles="disabledStyles" :placeholderStyle="placeholderStyles" v-model="formData.company" placeholder="请输入企业名称" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="姓名" name="name">
					<uni-easyinput :inputBorder="false" :placeholderStyle="placeholderStyles" v-model="formData.name" placeholder="请输入姓名" :maxlength="30" />
				</uni-forms-item>
				<uni-forms-item label="手机号" name="mobile" label-width="66px">
					<uni-easyinput type="number" :inputBorder="false" :placeholderStyle="placeholderStyles" v-model="formData.mobile" placeholder="请输入手机号" />
				</uni-forms-item>
				<uni-forms-item label="验证码" name="code" label-width="66px">
					<view class="form-item-code">
						<uni-easyinput type="number" :inputBorder="false" :placeholderStyle="placeholderStyles" v-model="formData.code" placeholder="请输入验证码" />
						<text class="btn-code" :class="count > 0 ? 'count' : ''" @click.stop="handleGetCode()">{{ count > 0 ? count + '秒后重新获取' : '获取验证码' }}</text>
					</view>					  
				</uni-forms-item>
				<uni-forms-item label="单位类型" name="type" label-width="76px">
					<view class="form-item-select" @click="togglePopup('bottom', 'type')">
						<view class="text">
							<text v-show="formData.type !== null">{{ typeText }}</text>
							<text class="placeholder" v-show="formData.type === null">请选择</text>
						</view>
						<cover-image class="icon" :src="arrow_solid_right"></cover-image>
					</view>
				</uni-forms-item>
				<uni-forms-item label="认证身份" name="identity" label-width="76px">
					<view class="form-item-select" @click="togglePopup('bottom', 'identity')">
						<view class="text">
							<text v-show="formData.identity">{{ formData.identity }}</text>
							<text class="placeholder" v-show="!formData.identity">请选择</text>
						</view>
						<cover-image class="icon" :src="arrow_solid_right"></cover-image>					  
					</view>
					<uni-easyinput :inputBorder="false" :placeholderStyle="placeholderStyles" v-model="custom_identity" placeholder="请输入" :maxlength="20" v-if="customIdentityVisible" />
				</uni-forms-item>
				<uni-forms-item label="持股/基金总市值" name="marketValueType" label-width="130px" v-if="iVersion === 3 && formData.identity == '个人投资者'">
					<view class="form-item-select" @click="togglePopup('bottom', 'marketValueType')">
						<view class="text">
							<text v-show="formData.marketValueType">{{ marketValueTypeText }}</text>
							<text class="placeholder" v-show="!formData.marketValueType">请选择</text>
						</view>
						<cover-image class="icon" :src="arrow_solid_right"></cover-image>					  
					</view>
				</uni-forms-item>
				<uni-forms-item label="所在部门/职位" name="section" label-width="110px" v-if="iVersion === 3 && formData.type === 1">
					<uni-easyinput :inputBorder="false" :placeholderStyle="placeholderStyles" v-model="formData.section" placeholder="请输入所在部门/职位" />
				</uni-forms-item>
			</view>
			<view class="my-form-wrap form-item-imgupload">
				<uni-forms-item label="上传名片" name="imgPath" label-width="76px">
					<view class="form-item-imgupload-inner" v-if="formData.imgPath.length === 0">
						<view class="l">
							<cover-image class="img" :src="upload" ></cover-image>
							<view class="info">
								<view>上传附件名片</view>
								<view class="gray">支持png、jpg格式上传</view>
							</view>
						</view>						  
						<view class="r">
							<image-upload
								:maxCount="1"
								sourceType="album"
								:onSuccess="onUploadImageSuccess"
								:onError="onUploadImageFail"
							>
								<button class="btn-upload">上传</button>
							</image-upload>
						</view>						  
					</view>
					<view class="form-item-imgupload-inner2" v-if="formData.imgPath.length > 0">
						<view class="img-box">
							<cover-image class="img" :src="formData.imgPath"></cover-image>
						</view>
						<image-upload
							:maxCount="1"
							sourceType="album"
							:onSuccess="onUploadImageSuccess"
							:onError="onUploadImageFail"
						>
							<button class="btn-upload-hollow">重新上传</button>
						</image-upload>
					</view>
				</uni-forms-item>
			</view>
		</uni-forms>
		<view class="bottom-button">
			<button @click="handleSubmit">确定认证</button>
		</view>
		
		<!-- 下拉框弹窗 -->
		<view class="my-popup">
			<uni-popup ref="myPopup">
				<view class="popup-content">
					<view class="my-ul">
						<view class="my-li" v-for="(item) in options" :key="item" @click="()=>identityChange(item, i)">
							{{ optionsKey === 'identity' ? item : item.label }}
						</view>
					</view>
					<view class="gap"></view>
					<view class="btn-close" @click="closePopup">
						取消
					</view>
				</view>
			</uni-popup>
		</view>

		<!-- 认证的成功 -->
		<AuthSuccess :visible="successPopupVisible" @visibleChange="successPopupChange"></AuthSuccess>
		<!-- 认证提示 -->
		<auth-tips :type="tipsType" :text="tipsText" :visible="tipsPopupVisible" @visibleChange="tipsPopupChange"></auth-tips>
	</view>
</template>

<script>
	import AuthSuccess from "./components/AuthSuccess.vue"
	export default {
		name:'IdentityAuth',
		components:{AuthSuccess},
		data(){
			return{
				arrow_solid_right:'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/identityAuth_image/arrow_solid_right.svg',
				upload:'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/identityAuth_image/upload.svg',
				disabledStyles:{color:'#86909C', disableColor:'#fff'},
				placeholderStyles: "color:#C9CDD4",
				formData: {
					account:'',
					company:'',
					name:"",
					mobile:'',
					code:'',
					type: null,
					identity:'',
					marketValueType: null,
					section:"",
					imgPath:''
				},
				custom_identity:'',
				types:{
					'1': [{value: 0, label: '上市公司'}],
					'2': [{value: 1, label: '机构'}, {value: 2, label: '拟上市公司'}, {value: 3, label: '个人'}]
				},
				typesKey:'2',
				typeText:'',
				identitys:{
					'1': ['券商', '会计师事务所', '律师事务所', '财关', 'ESG', '其他'],
					'2': ['董秘', '董事', '监事', '公司总经理', '其他'],
					'3': ['个人投资者', '其他']
				},
				marketValueTypes:[{value:1, label:'1亿以下'}, {value:2, label:'1亿~5亿'}, {value:3, label:'5亿~10亿'}, {value:4, label:'10亿以上'}],
				marketValueTypeText:'',
				iAccountType: 1, //  是否为内部账号 2是
				iVersion: 3, // 1、收费版，2、免费版，3、IPO版
				rules:{
					name:{
						rules:[{
							required: true,
							errorMessage: '输入姓名',
						}]
					},
					mobile:{
						rules:[{
								required: true,
								errorMessage: '输入手机号',
							},
							{
								validateFunction:function(rule,value,data,callback){
									const pattern = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
									if (!pattern.test(value)) {
										callback('请填写正确的手机号')
									}
									return true
								}
							}
						]
					},
					code:{
						rules:[{
							required: true,
							errorMessage: '请输入验证码',
						}]
					},
					identity:{
						rules:[{
							required: true,
							errorMessage: '请选择认证身份',
						}]
					},
					marketValueType:{
						rules:[{
							required: true,
							errorMessage: '请选择持股/基金总市值',
						}]
					},
					imgPath:{
						rules:[{
							required: true,
							errorMessage: '请上传名片',
						}]
					}
				},
				options:[],
				optionsKey:'',
				isUploading:false,
				count: 0,
				successPopupVisible:false,
				tipsPopupVisible: true,
				tipsType: 2,
				tipsText: ''
			}
		},
		mounted(){
			let loginInfo = JSON.parse(uni.getStorageSync("zhixin_applets_loginInfo") || 'null');
			this.iVersion = loginInfo.iVersion || this.iVersion;
			if(this.iAccountType === 2){
				this.typesKey = '2';
				this.typeText = this.types['2'][0].label;
				this.formData.type = this.types['2'][0].value;
			}else if(this.iVersion === 1){
				this.typesKey = '1';
				this.typeText = this.types['1'][0].label;
				this.formData.type = this.types['1'][0].value;
			}else{
				this.typesKey = '2';
				this.typeText = this.types['2'][1].label;
				this.formData.type = this.types['2'][1].value;
			}
			this.formData.account = loginInfo.sUid;
			this.formData.company = loginInfo.struSecInfo.sSecName;
			this.formData.name = loginInfo.sName;
			this.formData.mobile = loginInfo.sPhone;
		},
		methods:{
			togglePopup(type, value){
				this.$refs.myPopup.open(type);
				this.optionsKey = value;
				if(value === 'identity'){
					this.options = this.identitys[this.iVersion+''];
				}
				if(value === 'marketValueType'){
					this.options = this.marketValueTypes;
				}
				if(value === 'type'){
					this.options = this.types[this.typesKey];
				}
			},
			identityChange(value, index){
				this.formData[this.optionsKey] = this.optionsKey === 'identity' ? value : value.value;
				if(this.optionsKey === 'type'){
					this.typeText = value.label;
				}
				if(this.optionsKey === 'marketValueType'){
					this.marketValueTypeText = value.label;
				}
				this.closePopup();
			},
			closePopup(){
				this.$refs.myPopup.close()
			},
			onUploadImageSuccess(file, res){
				this.formData.imgPath = res.data.originUrl;
			},
			onUploadImageFail(file, err) {
				console.log('上传图片失败', file, err)
			},
			handleGetCode(){	
				if (this.count > 0) {
					return;
				}
				this.$refs.identityAuthForm.validateField('mobile').then((res) => {
					if (res) {
						const {mobile} = res;
						this.$http({
							url: '/auth/user/sendPhoneCode',
							method: 'post',
							data: {
								sPhoneNum: mobile,
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
			handleSubmit(form) {
				this.$refs.identityAuthForm.validate().then(async res=>{					
					try {
						let params = res;
						if (this.customIdentityVisible && this.custom_identity.length > 0) {
							params.identity = this.custom_identity;
						}
						// 校验验证码
						const res1 = await this.updateUserPhoneNumJava({ sPhoneNum: params.mobile, sPhoneCode: params.code });
						if (res1) {
							// 认证
							const res2 = await this.authApply(params);
							console.log('认证结果', res2)
							if (res2.data) {
								this.successPopupVisible = true;
							} else {
								this.tipsType = 3;
								this.tipsText = res2.msg;
								this.tipsPopupVisible = true;
							}
						}
					} catch (error) {
						console.error(error);
					}
				}).catch(err =>{
					console.log('表单错误信息：', err);
				})
			},
			updateUserPhoneNumJava(data){
				return new Promise((resolve,reject)=>{
					this.$http({
						url: '/user/accountInfo/updateUserPhoneNum',
						method: 'post',
						data
					}).then((res) => {
						if (res.tars_ret == 0) {
							this.count = 60;
							resolve(res);
						} else {
							uni.showToast({
								icon: 'error',
								title: res.msg || '验证码错误'
							});
							reject()
						}
					});
				})
			},
			authApply(data){
				return new Promise((resolve,reject)=>{					
					this.$http({
						url: '/im/auth/apply',
						method: 'post',
						data
					}).then((res) => {
						if (res.tars_ret == 0) {
							resolve(res);
						} else {
							reject()
						}
					}).catch(err=>{
						reject(err)
					});
				})
			},
			successPopupChange(paload){
				this.successPopupVisible = paload;
			},
			tipsPopupChange(paload){
				this.tipsPopupVisible = paload;
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
		computed:{
			customIdentityVisible(){
				return this.formData.identity === '其他';
			},
		}
	}
</script>

<style lang="scss" scoped>
.my-form{
	padding:0 30rpx;
	padding-top: 4rpx;
	padding-bottom: 180rpx;
	::v-deep .uni-easyinput input{
		text-align:  right;
	}
	::v-deep .uni-forms-item {
		margin-bottom: 28rpx;
		.uni-forms-item__content{
			position: initial;
		}
	}
	.my-form-wrap{
		background-color: #fff;
		border-radius: 16rpx;
		padding: 12rpx 28rpx;
		margin-bottom: 20rpx;
		::v-deep .uni-forms-item:last-child{
			margin-bottom: 0;
		}
		::v-deep .uni-forms-item .uni-forms-item__content .is-disabled{
			color: #86909C
		}
	}
}
.form-item-code{
	display: flex;	
	.btn-code{
		cursor: pointer;
		color: #2ea7e0;
		font-size: 28rpx;
		line-height: 70rpx;
		margin-left: 30rpx;
		&.count {
			color: #86909c;
		}
	}
}
.form-item-select{
	cursor: pointer;
	width: 100%;
	flex: 1;
	position: relative;
	display: flex;
	justify-content: right;
	height: 72rpx;
	.text{
		flex: 1;
		width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 72rpx;
		text-align: right;
		.placeholder{
			color:#C9CDD4;
		}
	}
	.icon{
		width: 12rpx;
		height: auto;
		margin-left: 20rpx;
	}
}
.form-item-imgupload{
	::v-deep .uni-forms-item.is-direction-left{
		flex-direction: column;
	}
	::v-deep .uni-file-picker__lists{
		display: none !important;
	}
	.form-item-imgupload-inner{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
		.l{
			flex: 1;
			display: flex;
			.img{
				width: 56rpx;
				height: auto;
				margin-right: 16rpx;
			}
			.info{
				font-size: 28rpx;
				.gray{
					color:#86909C;
					font-size: 24rpx;
				}
			}
		}
		.r{
			width: 100rpx;
			margin-left: 20rpx;
			.btn-upload{
				width: 100%;
				height: 52rpx;
				padding: 0;
				line-height: 52rpx;
				background: linear-gradient(90deg, #128CEA, #17A7EB);
				border-radius: 24rpx;
				color: #fff;
				font-size: 24rpx;
			}
		}
	}
	.form-item-imgupload-inner2{	
		margin-bottom: 24rpx;
		.img-box{
			background-color: #F8F9FC;
			width: 100%;
			height: 280rpx;
			border-radius: 16rpx;
			margin-bottom: 24rpx;
			.img{
				object-fit:scale-down;
			}
		}	
		.btn-upload-hollow{
			width: 220rpx;
			height: 52rpx;
			border-radius: 24rpx;
			border: 1px solid #2EA7E0;
			color: #2EA7E0;
			font-size: 24rpx;
			line-height: 52rpx;
			background-color: #fff;
		}
	}
}
.bottom-button{
	background-color: #F8FAFD;
	box-sizing: border-box;
	width: 100%;
	padding: 16rpx 30rpx;
	padding-bottom: 98rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 99;
	button{
		background: linear-gradient(90deg, #128CEA, #17A7EB);
		color: #fff;
		border-radius: 16rpx;
		font-size: 32rpx;
	}
}
.my-popup{
	.popup-content{
		background-color: #fff;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		.my-li, .btn-close{
			text-align: center;
			height: 100rpx;
			line-height: 100rpx;	
			cursor: pointer;			
		}
		.gap{
			margin-top: 20rpx;
			background-color: #F8FAFD;
			height: 20rpx;
		}
	}
}
</style>
<style>
page{
	background-color: #F8FAFD;	
	padding-bottom: 68rpx;
	box-sizing: border-box;
}
</style>