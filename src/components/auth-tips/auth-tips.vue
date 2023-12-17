<template>
    <view class="popup-autotips">
        <uni-popup ref="authTipsPopup" :mask-click="false">
            <view :class="`popup-content ${type === 2 ? 'bg2' : 'bg3'}`" v-if="type === 2 || type === 3">
                <cover-image class="img-fork" :src="close" @click="closePopup"></cover-image>
                <view class="img-box">
                    <cover-image class="img" :src="info[type].img" :style="{width: info[type].imgWidth}"></cover-image>
                </view>
                <view class="text-box">
                    <view class="text1">
                        {{info[type].text1}}
                    </view>
                    <view class="text2" v-if="info[type].text2">               
                        {{info[type].text2}}
                    </view>
                </view>
                <view>
                    <button class="btn btn-blue" @click="goHome" v-if="type === 2">{{ info[type].btnText }}</button>
					<button class="btn btn-orange1" @click="closePopup" v-if="type === 3"></button>
                </view>
            </view>  
            <view class="popup-content1" v-if="type === 1">
                <cover-image class="img-fork" :src="close" @click="closePopup"></cover-image>
                <cover-image class="img" :src="info[type].img" :style="{width: info[type].imgWidth}"></cover-image>
                <view class="popup-inner">
                    <view class="text-box">
                        <view class="text1">
                            {{info[type].text1}}
                        </view>
                    </view>
                    <view>
                        <button class="btn btn-blue" @click="goAuth">立即认证</button>
                    </view>
                    <view>
                        <button class="btn-text" @click="closePopup">暂不认证</button>
                    </view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    const auth_bg = 'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/identityAuth_image/auth_bg.png';
    const head_success = 'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/identityAuth_image/head_success.svg';
    const head_fail = 'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/identityAuth_image/head_fail.svg';
    export default {
        name:'AuthTips',
        props:{
            visible: Boolean,
            type: Number, // 1首页提示 2成功 3失败
            text: String
        },
        data(){
            return{
                head_success,
                head_fail,
                head_auth: 'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/identityAuth_image/head_auth.svg',
                auth_bg,
                close: 'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/identityAuth_image/close.svg',
                info:{
                    1: {
                        img: auth_bg,
                        imgWidth:'',
                        text1: "暂无权限使用，请进行身份认证",           
                        btnText: ''             
                    },
                    2: {
                        img: head_success,
                        imgWidth:'110px',
                        text1: this.text || "恭喜认证成功",    
                        btnText: '好的'                      
                    },
                    3: {
                        img: head_fail,
                        imgWidth:'98px',
                        text1: "抱歉认证失败",    
                        text2: this.text || "您上传的名片信息和提交信息不一致",           
                        btnText: '重新上传'      
                    }
                },
            }
        },
        methods:{
            closePopup(){
                this.$refs.authTipsPopup.close();
                this.$emit('visibleChange', false);
            },
            goAuth(){
                this.closePopup();
                this.$emit('comfirm');
            },
			goHome(){
				this.closePopup();
                uni.reLaunch({url:'/pages/home/home'})
			}
        },
        watch:{
            visible(newValue){
                if(newValue){
                    this.$refs.authTipsPopup.open('center')
                }else{
                    this.$refs.authTipsPopup.close()
                }                
            }
        }
    }
</script>

<style lang="scss" scoped>
.popup-content1, .popup-content{
    width: 520rpx;
    border-radius: 32rpx;
    padding: 0 42rpx;
    padding-bottom: 36rpx;
}
.popup-content{
    padding-top: 60rpx;
	position: relative;
	.text1{
		font-weight: bold;
	}
	.img-fork{
		right: -6px;
	}
}
.bg2{	
    background: linear-gradient(#F0F5FF, #FBFCFF, #FFFFFF) ;
}
.bg2::after{
	content:'';
	display: block;
    border-radius: 40rpx;
	background:linear-gradient(#D3EAFF, #BCD5FF, #ACE7FF) ;
	position: absolute;
	top: -6px;
	right: -6px;
	bottom: -6px;
	left: -6px;
	z-index: -1;
}
.bg3{	
    background: linear-gradient(#FFEFE4, #FFFDFB, #FFFFFF) ;
}
.bg3::after{
	content:'';
	display: block;
    border-radius: 40rpx;
	background:linear-gradient(#FFE3CD, #FFD6BC, #FFECBE);
	position: absolute;
	top: -6px;
	right: -6px;
	bottom: -6px;
	left: -6px;
	z-index: -1;
}
.img-box{
    text-align: center;
    margin-bottom: 40rpx;
    .img{
        margin: auto;
        height: auto;
    }
}
.popup-content1{
    background: linear-gradient(#D0F3FF, #FFFFFF, #FFFFFF) ;
}
.popup-inner{
    margin-top: -246rpx;
}
.text-box{
    margin-bottom: 44rpx;
    .text1{
        font-size: 32rpx;
        color:#1D2129;
        text-align: center;
        margin-bottom: 30rpx;
    }
    .text2{
        font-size: 28rpx;
        color:#4E5969;
    }
}
.btn, .btn-hollow,.btn-text{
    font-size: 28rpx;
}
.btn{
    color:#fff;
    // background: linear-gradient(-90deg, #17A7EB, #128CEA);
}
.btn-blue{
    padding-top: 12rpx;
    padding-bottom: 30rpx;
    background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/identityAuth_image/btn_bg_blue.png') no-repeat;
    background-size: cover;
}
.btn-orange1{
	height: 118rpx;
    background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/identityAuth_image/btn_bg_orange1.png') no-repeat;
    background-size: cover;
}
.btn-blue::after, .btn-text::after, .btn-orange1::after{
    border:none
}
.btn-hollow{
    color:#2EA7E0;
    border: 1px solid #2EA7E0;
    background-color: #fff;
    box-sizing: border-box;
    margin-top: 30rpx
}
.btn-text{
    color:#86909C;
    background-color: #fff;
}
.img-fork{
    cursor: pointer;
    width: 44rpx;
    height: auto;
    position: absolute;
    top: -72rpx;
    right: 0;
}
</style>