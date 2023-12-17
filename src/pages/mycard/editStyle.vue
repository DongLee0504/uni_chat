<template>
	<view>		
		<view class="info-wrap">
			<view class="swiper-wrap">
				<swiper class="swiper" 
					circular 
					:indicator-dots="true" 
					:autoplay="false" 
					:duration="500" 
					indicator-color="#C9CDD4" 
					indicator-active-color="#2EA7E0" 
					:current="initBgIndex"
					@change="swiperChange"
				>
					<swiper-item v-for="(item, i) in bgList" :key="item">
						<view class="swiper-item">											
							<view class="cardinfo">
								<cover-image class="cardbg-img" :src="item"></cover-image>	
								<calling-card from="cardStyle" :info="info"></calling-card>
							</view>
							<button class="cardbg-name">样式{{i+1}}</button>
						</view>	
					</swiper-item>
				</swiper>
			</view>					  
		</view>
		<view class="edit-wrap">
			<view class="title">信息展示</view>
			<view class="inner">
				<view v-for="item in allInfoKeys" :key="item" :class="`tag ${showInfoKeys.includes(item) ? 'active' : ''}`" @click="handleInfoTag(item)">{{ item }}</view>
			</view>
		</view>  
		<view class="btn-box-submit">
			<button class="btn" @click="handleSubmit">保存</button>
		</view>
		  
	</view>
</template>

<script>
import callingCard from '../../components/calling-card/calling-card.vue';
	export default {
  components: { callingCard },
		name:'MyCardEditStyle',
		data(){
			return{
				info:{					
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
				allInfoKeys:['企业', '职位', '电话', '邮箱', '头像'], // 全部信息(顺序不能改)
				showInfoKeys:[], // 用户选择展示的信息
				bgList:[
					"https://realizedongmi.oss-cn-shanghai.aliyuncs.com/user/realize-im/im-img/2023/12/14/user_242083/1735189748364124160.jpg",
					"https://realizedongmi.oss-cn-shanghai.aliyuncs.com/user/realize-im/im-img/2023/12/14/user_242083/1735189987389120512.jpg",
					"https://realizedongmi.oss-cn-shanghai.aliyuncs.com/user/realize-im/im-img/2023/12/14/user_242083/1735190089239404544.jpg",
					"https://realizedongmi.oss-cn-shanghai.aliyuncs.com/user/realize-im/im-img/2023/12/14/user_242083/1735190183825154048.jpg"
				], // 背景样式图(顺序不能改)
				initBgIndex: 0,
				showBackdropImg:'', // 用户选择的背景
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
					if (res.code === 0) {
						const info = res.data;
						this.showBackdropImg = info.backdropImg || this.bgList[0];
						this.showInfoKeys = info.view ? info.view.split(',') : [...this.allInfoKeys];
						this.initBgIndex = this.bgList.findIndex(bg=>bg === this.showBackdropImg);
						this.info = {
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
							backdropImg: this.showBackdropImg,
							view: info.view || this.allInfoKeys.join(',')
						}
						console.log(this.info)
					} else {
						uni.showToast({
							icon: 'error',
							title: res.msg || '获取名片信息失败'
						});
					}
				});
			},
			handleSubmit(){
				this.$http({
					url: '/im/callingCard/updateCardInfo',
					method: 'post',
					data: {
						id: this.info.id,
						userId: this.info.userId,
						headImg: this.info.headImg,
						name: this.info.name,
						firm: this.info.firm,
						position: this.info.position,
						phone: this.info.phone,
						mail: this.info.mail,
						hitsNum: this.info.hitsNum,
						interviewNum: this.info.interviewNum,
						shareNum: this.info.shareNum,
						createTime: this.info.createTime,
						updateTime: this.info.updateTime,
						backdropImg: this.showBackdropImg,
						view: this.showInfoKeys.join(',')
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
			swiperChange(value){
				this.showBackdropImg = this.bgList[value.detail.current];
			},
			handleInfoTag(item){
				if(this.showInfoKeys.includes(item)){
					this.showInfoKeys.splice(this.showInfoKeys.findIndex(k=>k===item), 1);
				}else{
					this.showInfoKeys.push(item)
				}
				this.info.view = this.showInfoKeys.join(',');
			}
		},
	}
</script>

<style lang="scss" scoped>
.info-wrap{	
	margin-left: 30rpx;
	margin-right: 30rpx;
	margin-bottom: 16rpx;
	box-sizing: border-box;
	.swiper-wrap{
		background: url('https://realizedongmi.oss-cn-shanghai.aliyuncs.com/user/realize-im/im-img/2023/12/13/user_242083/1734842323392323584.png') no-repeat;
		background-size: contain;
		background-position-y: 36rpx;
		.swiper{
			height: 814rpx;
			.swiper-item{
				height: 780rpx;
				padding: 0 48rpx;
				position: relative;
				.cardinfo{
					background-color: #fff;
					border-radius: 32rpx;
					-moz-box-shadow: 0 4px 12px 0 rgba(46, 167, 224, 0.06);
					-webkit-box-shadow: 0 4px 12px 0 rgba(46, 167, 224, 0.06);
					box-shadow: 0 4px 12px 0 rgba(46, 167, 224, 0.06);
					.cardbg-img{
						height: auto;
					}
				}
				.cardbg-name{
					background-color: #fff;
					border-radius: 24rpx;
					height: 44rpx;
					line-height: 44rpx;
					padding-left: 24rpx;
					padding-right: 24rpx;
					font-size: 24rpx;
					color:#4E5969;
					position: absolute;
					right: 96rpx;
					top: 40rpx;
				}
			}
		}
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
		border-bottom: 1px solid #F0F1F2;
	}
    .inner{
		overflow: hidden;
		padding: 30rpx 0;
		.tag{
			background-color: #EEF2F7;
			border-radius: 16rpx;
			height: 64rpx;
			line-height: 64rpx;
			margin-right: 20rpx;
			margin-bottom: 24rpx;
			padding:0 40rpx;
			font-size: 26rpx;
			color: #1D2129;
			float: left;
			cursor: pointer;
		}
		.tag.active{			
			background-color: #E6F7FF;
			color: #2EA7E0;
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