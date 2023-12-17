<template>
	<view class="my-card">		
		<calling-card :info="info" :border="showBorder">			
			<view class="line-box" v-if="!isFromShare">
				<view class="line"></view>
			</view>
			<view class="data-box" v-if="!isFromShare">
				<view class="data-item">
					<view class="number">{{info.hitsNum}}</view>
					<view class="label">总访问量</view>
				</view>
				<view class="data-item">
					<view class="number">{{info.interviewNum}}</view>
					<view class="label">今日访问量</view>
				</view>
				<view class="data-item">
					<view class="number">{{info.shareNum}}</view>
					<view class="label">分享次数</view>
				</view>
			</view>
			<view class="btn-contact" v-if="isFromShare">
				<button class="btn2" @click="handlePhoneCall"><uni-icons type="phone-filled" size="16"></uni-icons>打电话</button>
				<button class="btn2" @click="handleEmail" v-if="info.mail"><uni-icons type="email-filled" size="16"></uni-icons>发邮件</button>
			</view>	
		</calling-card>
		<view class="btn-box" v-if="!isFromShare">
			<button class="btn-hollow" @click="handleEdit"> <cover-image class="img" :src="edit"></cover-image> 编辑名片</button>
		</view>
		<view class="btn-box" v-if="!isFromShare">
			<button open-type="share" class="btn"><cover-image class="img" :src="share"></cover-image>分享名片</button>
		</view>
		<view class="greet-wrap" v-if="isFromShare && visibleShowGreet">			
			<cover-image class="img-fork" :src="close" @click="hideGreet"></cover-image>
			<view class="greet-main">
				您好，我是{{ info.name }}
			</view>
			<view class="greet-aux">很高兴认识您，可以回递一张您的名片吗？</view>
			<view class="greet-btn-box">
				<button open-type="share" class="btn">回递名片</button>
			</view>			  
		</view>
		<uni-popup ref="emailPopup">
            <view class="popup-content">
                <cover-image class="img-fork" v-if="close" :src="close" @click="closePopup"></cover-image>
                <cover-image class="img" v-if="mailbox" :src="mailbox"></cover-image>
				<view class="text">邮箱地址：{{ info.mail }}</view>
				<view><button class="btn-copy" @click="handleCopy">复制</button></view>
            </view>               
        </uni-popup>		
		
		
		<canvas canvas-id="myCanvas" id='sss' style="width: 281px;height: 366px; visibility: hidden; position: absolute; left: 0; bottom: 0; z-index: -1;"></canvas>
	</view>
</template>

<script>
	import icon_phone from "@/static/image/mycard/phone.png"
	import icon_mail from "@/static/image/mycard/mail.png"
	export default {
		name:'MyCard',
		components:{},
		data(){
			return{
				edit:'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/mycard_image/edit.svg',
				share:'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/mycard_image/share.svg',
				close:'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/mycard_image/close.png',
				mailbox:'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/mycard_image/mailbox.png',
				bg01:'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/mycard_image/bg01.png',
				head_2x: 'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/mycard_image/head_2x.png',
				icon_phone,
				icon_mail,
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
				isFromShare: false,
				visibleShowGreet: true,
				showBorder: true,
				allInfoKeys:['企业', '职位', '电话', '邮箱', '头像'], // 全部信息(顺序不能改)
				mineInfo: {}
			}
		},
		onLoad(options){
			if(options.fromUserId){
				this.isFromShare = true;
				this.showBorder = false;
				this.getInfo(options.fromUserId);
			}else{			
				uni.setNavigationBarTitle({
				　　title: '我的名片'
				})
				this.isFromShare = false;
				this.showBorder = true;
				let loginInfo = uni.getStorageSync("zhixin_applets_loginInfo");
				if(loginInfo){
					this.getInfo(JSON.parse(loginInfo).sUserId)
				}
			}
		},
		async onShareAppMessage(res){
			let shareInfo = this.info;
			if(this.isFromShare){
				const userInfo = this.$store.state.userStore.userInfo;
				shareInfo = {
					headImg: userInfo.imgPath,
					name: userInfo.userName,
					firm: userInfo.secname,
					position: userInfo.section || '',
					phone: userInfo.phone,
					mail: userInfo.mail,
					backdropImg: userInfo.backdropImg,
					view: userInfo.view
				}
			}
			const cardUrl = await this.createCardImg(shareInfo);
			return {
				title: '这是我的名片，请您收下',
				path: `/pages/mycard/index?fromUserId=${this.$store.state.userStore.userInfo.userId}`,
				imageUrl: cardUrl
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
						this.info = {
							id: info.id,
							userId: info.userId,
							headImg: info.headImg,
							name: info.name,
							firm: info.firm,
							position: info.position || '',
							phone: info.phone,
							mail: info.mail,
							hitsNum: info.hitsNum,
							interviewNum: info.interviewNum,
							shareNum: info.shareNum,
							createTime: info.createTime,
							updateTime: info.updateTime,
							backdropImg:info.backdropImg,
							view: info.view
						}
						if(this.isFromShare){							
							uni.setNavigationBarTitle({
							　　title: info.name + '的名片'
							})
						}
					} else {
						uni.showToast({
							icon: 'error',
							title: res.msg || '获取名片信息失败'
						});
					}
				});
			},
			handleEdit(){
				uni.navigateTo({url:'/pages/mycard/edit'})
			},
            hideGreet(){
                this.visibleShowGreet = false;
            },
			handleEmail(){
				this.$refs.emailPopup.open('bottom')
			},
			closePopup(){
				this.$refs.emailPopup.close()
				uni.reLaunch({url:'/pages/home/home'})
			},
			async handleCopy(){
				uni.setClipboardData({
					data: this.info.mail,
					success: function () {
						console.log('copy success');
					}
				});
			},
			handlePhoneCall(){
				uni.makePhoneCall({
					phoneNumber: this.info.phone,
					fail(){
						console.log('拨打电话失败')
					}
				})
				// plus.device.dial(this.info.phone, true)
			},
			// 绘制名片
			createCardImg(info) {
				let cardInfo = {...info};
				const views = info.view ? info.view.split(',') : [];
				if(!views.includes(this.allInfoKeys[4])){
					cardInfo.headImg = undefined
				}
				if(!views.includes(this.allInfoKeys[0])){
					cardInfo.firm = undefined
				}
				if(!views.includes(this.allInfoKeys[1])){
					cardInfo.position = undefined
				}
				if(!views.includes(this.allInfoKeys[2])){
					cardInfo.phone = undefined
				}
				if(!views.includes(this.allInfoKeys[3])){
					cardInfo.mail = undefined
				}
				return new Promise(async (resolveF, rejectF)=>{
					const promise1 = new Promise((resolve, reject)=>{
						uni.getImageInfo({
							src: cardInfo.backdropImg || this.bg01,
							success(res){
								resolve(res.path)
							} , fail(){
								resolve()
							}
						})
					})
					const promise2 = new Promise((resolve, reject)=>{
						uni.getImageInfo({
							src: cardInfo.headImg || this.head_2x,
							success(res){
								resolve(res.path)
							} , fail(){
								resolve()
							}
						})
					})
					const res = await Promise.all([promise1, promise2]);
					if(res){
						const ww = 281; //准确的宽高
						const hh = 366;
						var ctx = uni.createCanvasContext('myCanvas') //绑定画布					
						this.drawRoundRect(ctx, 0, 0, ww, hh, 32, '#fff', '#E1F3FA', 1); // 白色底和边框
						ctx.drawImage(res[0], 2, 2, 279, 173); // 填充进背景图
						this.drawRoundHead(ctx, ww/2, hh/2-8, 35, res[1]); // 填充头像
						// 姓名
						ctx.setFillStyle('#1D2129')  // 设置字体颜色
						ctx.setFontSize(24); // 设置字号
						ctx.setTextAlign('center'); // 设置对于坐标点的对齐方式
						ctx.fillText(cardInfo.name, ww/2, hh/2+65) //计算距离，将文字定位于图片的某处
						// 企业·职位
						if(cardInfo.firm || cardInfo.position){
							ctx.setFillStyle('#86909C') 
							ctx.setFontSize(14);
							ctx.setTextAlign('center')  
							ctx.fillText(`${cardInfo.firm}${cardInfo.firm && cardInfo.position ? ' · ' : ''}${cardInfo.position}`,ww/2,hh/2+94)
						}
						// 电话
						if(cardInfo.phone){
							ctx.drawImage(this.icon_phone, 55, hh/2+117, 18, 18);
							ctx.setFillStyle('#4E5969')  
							ctx.setFontSize(14);
							ctx.setTextAlign('left')  
							ctx.fillText(cardInfo.phone, 55+22, hh/2+131)
						}
						// 邮箱
						if(cardInfo.mail){
							ctx.drawImage(this.icon_mail, 55, hh/2+140, 18, 18);
							ctx.setFillStyle('#4E5969')
							ctx.setFontSize(14);
							ctx.setTextAlign('left')
							ctx.fillText(cardInfo.mail, 55+22, hh/2+155)
						}
						ctx.draw();  //输出到画布中
						uni.showLoading({ //增加loading等待效果
							mask:true
						})
						const _this = this;
						setTimeout(()=>{  //不加延迟的话，base64有时候会赋予undefined
							uni.canvasToTempFilePath({
								canvasId:'myCanvas',
								success: async (res) => {
									const url = await this.saveCardImgFn(res.tempFilePath);
									resolveF(url)
								}
							})
							uni.hideLoading();
						},1200)
					}
				})			
			},
			//保存名片
			async saveCardImgFn(path){
				return new Promise(resolve=>{
					uni.uploadFile({
						url: process.env.BASE_URL + '/im/image/upload',
						header: {
							Authorization:  "Bearer " + JSON.parse(uni.getStorageSync("zhixin_applets_loginInfo")).token
						},
						filePath: path, // 要上传文件资源的路径
						name: 'file',
						success: (res) => {
							let data = JSON.parse(res.data);
							if(data.code === 0){
								resolve(data.data.originUrl);
							}
						},
						fail: (err) => {
							console.log(err);
						}
					})
				})
				// uni.saveImageToPhotosAlbum({  
				// 	filePath: path,  
				// 	success: (res) => {
				// 		console.log(res)
				// 	}
				// })
			},
			//圆角矩形
			drawRoundRect(ctx, x, y, width, height, radius, bgColor, borderColor, borderWidth) {
				ctx.save();
				ctx.beginPath();
				ctx.setFillStyle(bgColor);
				ctx.setStrokeStyle(borderColor)
				ctx.setLineJoin('round'); //交点设置成圆角
				ctx.setLineWidth(borderWidth);
				ctx.strokeRect(x, y, width, height);
				ctx.fillRect(0+borderWidth, 0+borderWidth, width - borderWidth * 2, height - borderWidth * 2);
				ctx.stroke();
				ctx.closePath();
				ctx.restore(); 
			},
			// 头像
			drawRoundHead(ctx, x, y, r, imgUrl){
				ctx.save();
				ctx.beginPath();			
				ctx.arc(x, y, r, 0, Math.PI * 2, false);
				ctx.clip();
				ctx.drawImage(imgUrl, x-r, y-r, r*2, r*2); //填充进头像
				ctx.closePath();
				ctx.restore(); // 恢复之前的绘制并可以继续绘制 
			}
		},
		watch: {
		},
	}
</script>

<style lang="scss" scoped>
.line-box{
	text-align: center;
	margin-top: 48rpx;
	.line{
		width: 400rpx;
		height: 1px;
		background-color: #EFF6FB;
		margin: 0 auto;
	}
}
.data-box{
	display: flex;
	justify-content: center;
	align-items: center;
	padding-top: 48rpx;
	.data-item{
		flex: 1;
		text-align: center;
		border-left: 1px solid #EFF6FB;
		.label{
			font-size: 28rpx;
			color: #86909C;
			margin-top: 6rpx;
		}
		.number{
			font-size: 40rpx;
			font-weight: bold;
		}
	}
	.data-item:first-child{
		border-left: none;
	}
}
.btn-box {
	margin-top: 40rpx;
}
.btn, .btn-hollow{
	margin-left: 60rpx;
	margin-right: 60rpx;
    font-size: 30rpx;
	border-radius: 16rpx;
	.img{
		width: 30rpx;
		height: auto;
		display: inline-block;
		vertical-align: middle;
		margin-right: 4rpx;
	}
}
.btn{
    color:#fff;
    background: linear-gradient(-90deg, #17A7EB, #128CEA);
}
.btn-hollow{
    color:#2EA7E0;
    border: 1px solid #2EA7E0;
    background-color: #F0FAFF;
    box-sizing: border-box;
}
.btn-contact{
	padding: 60rpx 30rpx 0 30rpx;
	display: flex;
	justify-content: space-between;
	.btn2{
		flex: 1;
		margin-left: 30rpx;
		font-size: 30rpx;
		color: #4E5969;
		background-color: #F5F7FA;
	}
	.btn2:first-child{
		margin-left: 0;
	}
	.btn2::after{
		border-color:#E5E6E8 ;
	}
}
.greet-wrap{
	margin-left: 30rpx;
	margin-right: 30rpx;
	background-color: #fff;
	border-radius: 32rpx;
	box-shadow: 0 0 12px 1px #EFF6FB;
	padding: 40rpx 30rpx;
	margin-bottom: 28rpx;
	position: relative;
	.greet-main{
		font-size: 44rpx;
		margin-bottom: 10rpx;
	}
	.greet-aux{
		font-size: 28rpx;
		color: #86909C;
	}
	.greet-btn-box{
		margin-top: 120rpx;
		.btn{
			font-size: 30rpx;
		}
	}
}
.img-fork{
    cursor: pointer;
    width: 48rpx;
    height: auto;
    position: absolute;
    top: 16rpx;
    right: 20rpx;
}
.popup-content{
	position: relative;
	background: linear-gradient(#D0F3FF,#FFFFFF);
	padding-bottom: 98rpx;
	text-align: center;
	overflow: hidden;
	border-top-left-radius: 32rpx;
	border-top-right-radius: 32rpx;
	.img{
		margin: 80rpx;
		margin: 0 auto;
		margin-top: 80rpx;
		margin-bottom: 60rpx;
		width: 160rpx;
		height: auto;
	}
	.text{
		margin-bottom: 40rpx;
	}
	.btn-copy{
		background-color: #FF9F44;
		color: #fff;
		font-size: 30rpx;
		width: 160rpx;
		border-radius: 16rpx;
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