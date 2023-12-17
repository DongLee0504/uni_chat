<template>
	<view>		
		<calling-card :info="formData">
			<view class="btn-box">
				<button class="btn" @click="handleStyleEdit">更换名片样式</button>
			</view>
		</calling-card>
		<view class="edit-wrap">
			<view class="title">基本信息</view>
			<view class="inner">
				<view class="edit-item">
					<view class="edit-item-inner">
						<text class="label">头像</text>
						<view class="head-box">
							<image-upload :onSuccess="onUnloadImageSuccess">
								<cover-image class="head" v-if="formData.headImg" :src="formData.headImg"></cover-image>
							</image-upload>
						</view>
					</view>
				</view>
				<view class="edit-item">
					<view class="edit-item-inner">						
						<text class="label">姓名</text>
						<uni-easyinput :inputBorder="false" :styles="styles" :placeholderStyle="placeholderStyles" v-model="formData.name" placeholder="请输入姓名" :maxlength="30" />
					</view>
				</view> 
				<view class="edit-item">
					<view class="edit-item-inner">						
						<text class="label">企业</text>
						<uni-easyinput :inputBorder="false" :styles="styles" :placeholderStyle="placeholderStyles" v-model="formData.firm" placeholder="请输入企业名称" />
					</view>
				</view> 
				<view class="edit-item">
					<view class="edit-item-inner">						
						<text class="label">职位</text>
						<uni-easyinput :inputBorder="false" :styles="styles" :placeholderStyle="placeholderStyles" v-model="formData.position" placeholder="请输入所在部门/职位" />
					</view>					  
				</view>
			</view>
		</view>  
		<view class="edit-wrap">
			<view class="title">联系方式</view>
			<view class="inner">
				<view class="edit-item">
					<view class="edit-item-inner">
						<text class="label">手机号</text>
						<uni-easyinput type="number" :inputBorder="false" :styles="styles" :placeholderStyle="placeholderStyles" v-model="formData.phone" placeholder="请输入手机号" />
					</view>					  
					<view class="error-text" v-show="!validErrorText.phone.valid">{{ validErrorText.phone.text }}</view>
				</view>
				<view class="edit-item">					
					<view class="edit-item-inner">
						<text class="label">邮箱</text>
						<uni-easyinput :inputBorder="false" :styles="styles" :placeholderStyle="placeholderStyles" v-model="formData.mail" placeholder="请输入邮箱" />
					</view>
				</view>
				<!-- <view class="edit-item">
					<view class="edit-item-inner">						
						<text class="label">微信</text>
						<view class="content" style="cursor: pointer;" @click="handleWeixin">
							<text class="text" :style="placeholderStyles">微信号或者二维码</text>
							<cover-image class="icon" v-if="arrow_solid_right" :src="arrow_solid_right"></cover-image>
						</view>
					</view>					  
				</view> -->
			</view>
		</view>  
		<view class="btn-box-submit">
			<button class="btn" @click="handleSubmit">保存</button>			
		</view>
		  
	</view>
</template>

<script>
	export default {
		name:'MyCardEdit',
		data(){
			return{
				arrow_solid_right:'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/identityAuth_image/arrow_solid_right.svg',
				styles:{color:'#4E5969', disableColor:'#fff'},
				placeholderStyles: "color:#C9CDD4;font-size:15px",
				formData:{					
					id: 0,
					userId: 0,
					headImg:'',
					name:'',
					phone:'',
					mail:'',
					firm:'',
					position:'',		
					interviewNum: 0,
					hitsNum: 0,
					shareNum: 0,
					createTime: null,
					updateTime: null,
					backdropImg:'',
					view: ''
				},
				validErrorText: {
					phone: {valid: true, text:''}
				}
			}
		},
		onLoad(){
			let loginInfo = uni.getStorageSync("zhixin_applets_loginInfo");
			if(loginInfo){
				this.getInfo(JSON.parse(loginInfo).sUserId)
			}
		},
		methods:{
			getInfo(userId){
				this.$http({
					url: '/im/callingCard/getInfo/'+userId,
					method: 'get'
				}).then((res) => {
					console.log(res)
					if (res.code === 0) {
						const info = res.data;
						this.formData = {
							id: info.id,
							userId: info.userId,
							headImg: info.headImg,
							name: info.name,
							firm: info.firm,
							position: info.position,
							phone: info.phone,
							mail: info.mail,
							hitsNum: info.hitsNum,
							interviewNum: info.interviewNum,
							shareNum: info.shareNum,
							createTime: info.createTime,
							updateTime: info.updateTime,
							backdropImg: info.backdropImg,
							view: info.view
						}
					} else {
						uni.showToast({
							icon: 'error',
							title: res.msg || '获取名片信息失败'
						});
					}
				});
			},
			handleWeixin(){
				uni.navigateTo({url:'/pages/mycard/editWeixin'})
			},
			handleSubmit(){
				this.validErrorText.phone = this.validateFunction(this.formData.phone);
				if(!this.validErrorText.phone.valid){
					return
				}
				this.$http({
					url: '/im/callingCard/updateCardInfo',
					method: 'post',
					data: {
						id: this.formData.id,
						userId: this.formData.userId,
						headImg: this.formData.headImg,
						name: this.formData.name,
						firm: this.formData.firm,
						position: this.formData.position,
						phone: this.formData.phone,
						mail: this.formData.mail,
						hitsNum: this.formData.hitsNum,
						interviewNum: this.formData.interviewNum,
						shareNum: this.formData.shareNum,
						createTime: this.formData.createTime,
						updateTime: this.formData.updateTime,
						backdropImg: this.formData.backdropImg,
						view: this.formData.view
					}
				}).then((res) => {
					if (res.code === 0) {
						uni.showToast({
							icon: 'success',
							title: '保存成功'
						});
						uni.navigateTo({url:'/pages/mycard/index'})
					} else {
						uni.showToast({
							icon: 'error',
							title: res.msg || '保存失败'
						});
					}
				});
			},
			validateFunction(value){
				if(!value || value.length === 0){
					return {valid:false, text:'输入手机号'}
				}
				const pattern = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
				if (!pattern.test(value)) {
					return {valid:false, text:'请填写正确的手机号'}
				}
				return {valid:true, text:''}
			},
			handleStyleEdit(){
				uni.navigateTo({url:'/pages/mycard/editStyle'})
			},
			onUnloadImageSuccess(file, res) {
				this.formData.headImg = res.data.originUrl;
			},
		},
	}
</script>

<style lang="scss" scoped>
.btn-box{
	text-align: center;
	margin-top: 40rpx;
	// margin-bottom: 40rpx;
	.btn{
		background-color: #fff;
		border-radius: 32rpx;
		font-size: 24rpx;
		color:#2EA7E0;
		display: inline-block;
		border:1px solid #2EA7E0;
		height: 56rpx;
		line-height: 56rpx;
	}
}
.edit-wrap{
	margin-left: 30rpx;
	margin-right: 30rpx;
	margin-bottom: 28rpx;
	background-color: #fff;
	border-radius: 32rpx;
	padding: 0 28rpx;
	.title{
		font-size: 30rpx;
		color: #86909C;
		height: 88rpx;
		line-height: 88rpx;
	}
	.edit-item{
		border-top: 1px solid #F0F1F2;
		height: 110rpx;
		padding: 20rpx 0;		
		box-sizing: border-box;
		position: relative;
		.edit-item-inner{
			display: flex;
			justify-content: space-between;
			font-size: 30rpx;
			align-items: center;
			.label{
				color:#1D2129;
			}		
			::v-deep .uni-easyinput input{
				text-align:  right;		
				font-size: 30rpx;		
			}		
			.content{
				height: 70rpx;
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.icon{
					width: 12rpx;
					height: auto;
					margin-left: 20rpx;
				}
			}
			.head-box{
				width: 64rpx;
				height: 64rpx;
				.head{
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
		}
		.error-text{
			color:#F53F3F;
			font-size: 24rpx;
			line-height: 40rpx;
			position: absolute;
			left: 0;
			bottom: 0;
		}
	}
}
.btn-box-submit{
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;	
	z-index: 99;
	padding: 10rpx 30rpx 78rpx 30rpx;
	background-color: #fff;
	.btn{
		color:#fff;
		font-size: 30rpx;
		background: linear-gradient(-90deg, #17A7EB, #128CEA);
		border-radius: 16rpx;
	}
}
</style>
<style>
page{
	background-color: #F8FAFD;
	padding-bottom: 164rpx;
	box-sizing: border-box;
}
</style>