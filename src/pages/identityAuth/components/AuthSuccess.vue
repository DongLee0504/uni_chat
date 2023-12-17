<template>
    <view>
        <uni-popup ref="authSuccessPopup" :mask-click="false">
            <view class="popup-content">       
                <view class="text1">
                    <text class="t">您已成功提交认证申请</text>
                </view>
                <view class="text2">             
                    <text class="t1">恭喜您获得</text>
                    <text class="t2">试用特权</text>
                </view>
                <view class="text4">试用期间，运营专员将对您提交的信息进行审核，请耐心等待~</view>
                <view class="text3">               
                    <view class="inner">
                        <text class="t1">48</text>        
                        <text class="t2">小时试用时间</text> 
                    </view>        
                </view>              
                <view class='text-tip'>
                    <view>注：</view>                  
                    <view>1、试用期间可正常使用智信，若超时审核未通过，则不能进入会话使用聊天工具；</view>
                    <view>2、您提交的认证信息（账号、企业、姓名、认证身份）将用于展示，若存疑请联系客服。</view>
                </view>
                <view>
                    <button class="btn" @click="closePopup"></button>
                </view>
            </view>
                            
        </uni-popup>
    </view>
</template>

<script>
    export default {
        name:'AuthSuccess',
        props:{
            visible: Boolean
        },
        data(){
            return{
                
            }
        },
        methods:{
            closePopup(){
                this.$refs.authSuccessPopup.close()
                this.$emit('visibleChange', false)
                uni.reLaunch({url:'/pages/home/home'})
            }
        },
        watch:{
            visible(newValue){
                if(newValue){
                    this.$refs.authSuccessPopup.open('center')
                }else{
                    this.$refs.authSuccessPopup.close()
                }                
            }
        }
    }
</script>

<style lang="scss" scoped>
.popup-content{
    width: 520rpx;
    border-radius: 32rpx;
    border-top-right-radius: 108rpx;
    background: linear-gradient(#FFF9F2, #FFFFFF);
    padding: 0 42rpx;
    padding-bottom: 56rpx;
    position: relative;
}
.popup-content::after{
	content:'';
	display: block;
    border-radius: 40rpx;
    border-top-right-radius: 120rpx;
	background:linear-gradient(#FFE2C8, #FFCDB3, #FFACAC);
	position: absolute;
	top: -6px;
	right: -6px;
	bottom: -6px;
	left: -6px;
	z-index: -1;
}
.text1, .text4{
    font-size: 24rpx;
}
.text1, .text2, .text3{
    text-align: center;
}
.text1{
    .t{
        display: inline-block;
        margin: 0 auto;
        background:linear-gradient(#FFE1C7, #FFD2A9);
        border-bottom-left-radius: 16rpx;
        border-bottom-right-radius: 16rpx;
        height: 48rpx;
        line-height: 48rpx;
        padding: 0 30rpx;
        color:#942F0D;
    }
}
.text2{
    margin-top: 52rpx;
    margin-bottom: 24rpx;
    font-size: 36rpx;
        font-weight: bold;
    .t1{
        color:#942F0D
    }
    .t2{
        color:#FF5A22
    }
}
.text3{
    background:linear-gradient(90deg, #EAB47D, #CF7D47);
    height: 168rpx;
    padding: 4rpx;
    box-sizing: border-box;
    border-radius: 40rpx;
    margin-bottom: 33rpx;
    .inner{
        font-size: 46rpx;
        font-weight: bold;
        color: #942F0D;
        height: 160rpx;
        line-height: 72rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 36rpx;
        background: linear-gradient(90deg,#FFF4EA, #FFCEA1);
        .t1{
            font-size: 52rpx;
        }
    }
}
.text4{
    color:#1D2129;
    margin-bottom: 48rpx;
    padding: 0 20rpx;
}
.text-tip{
    font-size: 24rpx;
    color:#86909C;
    margin-bottom: 50rpx;
}
.btn{
    height: 124rpx;
    background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/identityAuth_image/btn_bg_orange2.png') no-repeat;
    background-size: cover;
}
.btn::after{
    border:none
}
</style>