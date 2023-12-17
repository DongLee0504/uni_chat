<template>
	<view class="invite">
		  <view class="head-image">
		  	<image :src="headImgUrl" mode=""></image>
		  </view>
		  <view class="tips">
		  	你的好友{{shareNickName}}正在邀请你加入智信
		  </view>
		  <image src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/share_image/share_title.png" class="title-pic" mode=""></image>
		  <view class="wrap">
			  <image src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/share_image/step_title.png" class="step-pic" mode=""></image>
			  <view class="step-box">
			  	<view class="steps">
			  		<view class="step">
			  			<view class="num">
			  				1
			  			</view>
						<text class="desc">点击 [立即加入] 智信小程序按钮</text>
			  		</view>
					<view class="step">
						<view class="num">
							2
						</view>
						<text class="desc">跳转小程序后，注册账号，手机号为邀请预留手机号码</text>
					</view>
					<view class="step">
						<view class="num">
							3
						</view>
						<text class="desc">获得账号后，登录小程序使用</text>
					</view>
			  	</view>
				<view class="line">
				</view>
			  </view>	
		  </view>
		  <view class="btn" @click="goHome()">
		  	  <image src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/share_image/button.svg" mode=""></image>
		  </view>
		  <image src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/share_image/share_logo.svg" class="share-logo" mode=""></image>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shareUserId: '',
				shareNickName: '',
				headImgUrl: '',
				shareDate:null
			};
		},
		methods:{
			goHome(){
				let curdate = new Date().getTime();
				let nums = parseInt(curdate) - parseInt(this.shareDate);
				if((nums-30*24*60*60*1000)>0){
					uni.navigateTo({
						url: `/pages/login/index`
					});
				}else{
					uni.navigateTo({
						url: `/pages/login/index?shareUserId=${this.shareUserId}`
					});
				}
				
			},
			getShareUserInfo(id){
				this.$http({
					url: "/auth/user/getPersonalInformation?userId=" + id,
					method: "GET"
				}).then((res) => {
					console.log(res);
					const data = res.rsp;
					this.headImgUrl = data.headSculpture;
					this.shareNickName =data.sName
				})
				
			}
		},
		onLoad(options){
			this.shareUserId = options.shareUserId;
			this.shareDate = options.date;
			this.getShareUserInfo(options.shareUserId);
			//this.getShareUserInfo('240695')
		}
	}
</script>

<style lang="scss" scoped>
.invite{
	min-height: calc( 100vh - 120rpx );
	background-image: url("https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/share_image/bg.png");
	background-size: 100% 100%;
	padding: 60rpx 24rpx;
    .head-image{
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		overflow: hidden;
		background-color: #72AFB5;
		margin: 0 auto;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.tips{
		width: 488rpx;
		height: 52rpx;
		background: linear-gradient(180deg, #FFFDF9 0%, #FFF2E6 100%);
		border-radius: 36rpx;
		margin: 0 auto;
		margin-top: 28rpx;
		color: #1D2129;
		font-size: 24rpx;
		line-height: 52rpx;
		text-align: center;
		
	}
	.title-pic{
		width: 612rpx;
		height: 154rpx;
		margin: 64rpx auto;
		display: block;
	}
	.wrap{
		width: 646rpx;
		height: 440rpx;
		padding: 18rpx 28rpx;
		background: linear-gradient(180deg, #FFF2E3 2%, #FFF7F4 100%);
		box-shadow: 0rpx 16rpx 20rpx 0rpx rgba(251,132,68,0.2);
		border-radius: 40rpx;
		margin: 16rpx auto;
		.step-pic{
			width: 588rpx;
			height: 96rpx;
			margin: 0 auto;
			display: block;
		}
		.step-box{
			width: 648rpx;
			height: 296rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			margin-top: 36rpx;
			position: relative;
			.steps{
				width: 588rpx;
				min-height: 186rpx;
				padding-top: 66rpx;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				.step{
					width: 156rpx;
					text-align: center;
					.num{
						width: 40rpx;
						height: 40rpx;
						background: #FF9C4F;
						border-radius: 50%;
						color: #FFFFFF;
						font-size: 24rpx;
						text-align: center;
						line-height: 40rpx;
						margin: 0 auto;
					}
					.desc{
						color: #4E5969;
						font-size: 22rpx;
						margin-top: 16rpx;
					}
				}
			}
			.line{
				position: absolute;
				top: 84rpx;
				left: 108rpx;
				width: 428rpx;
				height: 2rpx;
				background: #FF9C4F;
				opacity: 0.3;
			}
		}
	}
	.btn{
		width: 608rpx;
		height: 128rpx;
		margin: 24rpx auto;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.share-logo{
		width: 72rpx;
		height: 116rpx;
		margin: 24rpx auto;
		display: block;
	}
}
</style>
