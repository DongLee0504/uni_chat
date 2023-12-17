<template>
    <view :class="`info-wrap ${from !== 'cardStyle' ? 'info1' : 'info2'}`" :style="{border:'1px solid transparent', borderColor: border ? borderColorList[bgList.indexOf(cardbg)] : ''}">
        <cover-image class="bg" v-if="cardbg && from !== 'cardStyle'" :src="cardbg"></cover-image>
        <view class="info-inner">
            <view class="head-box">
				<cover-image class="head" v-if="info.headImg || head_2x" :src="!showInfoKeys.includes(allInfoKeys[4]) ? head_2x : info.headImg || head_2x"></cover-image>
			</view>
            <view class="name">
                <text>{{info.name}}</text>
            </view>
            <view class="position" v-if="from === 'cardStyle' ? showInfoKeys.includes(allInfoKeys[0]) || showInfoKeys.includes(allInfoKeys[1]) : info.firm || info.position">
                <text v-if="showInfoKeys.includes(allInfoKeys[0])">{{info.firm}}</text>
				<text v-if="from === 'cardStyle' ? showInfoKeys.includes(allInfoKeys[0]) && showInfoKeys.includes(allInfoKeys[1]) : info.firm && info.position"> · </text>
				<text v-if="showInfoKeys.includes(allInfoKeys[1])">{{info.position}}</text>
            </view>
            <view class="contact-box" v-if="from === 'cardStyle' ? showInfoKeys.includes(allInfoKeys[2]) || showInfoKeys.includes(allInfoKeys[3]) : info.phone || info.mail">
                <view>
                    <view class="contact-item" v-if="info.phone && showInfoKeys.includes(allInfoKeys[2])">
                        <uni-icons type="phone-filled" size="14"></uni-icons><text @click="handlePhoneCall">{{info.phone}}</text>
                    </view>
                    <view class="contact-item" v-if="info.mail && showInfoKeys.includes(allInfoKeys[3])">
                        <uni-icons type="email-filled" size="14"></uni-icons><text>{{info.mail}}</text>
                    </view>
                </view>
            </view>
            <slot></slot>
        </view>			  
    </view>
</template>

<script>
	export default {
		name:'calling-card',
        props:{
			showall: Boolean, // 是否展示所有信息
            info: {
                type:Object,
                default:()=>{}
            },
			from:String,
			border: Boolean
        },
		data(){
			return{
				bg01:'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/mycard_image/bg01.png',
				head_2x: 'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/mycard_image/head_2x.png',
				cardbg: '',
				allInfoKeys:['企业', '职位', '电话', '邮箱', '头像'], // 全部信息(顺序不能改)
				showInfoKeys:[], // 用户选择展示的信息
				bgList:[
					"https://realizedongmi.oss-cn-shanghai.aliyuncs.com/user/realize-im/im-img/2023/12/14/user_242083/1735189748364124160.jpg",
					"https://realizedongmi.oss-cn-shanghai.aliyuncs.com/user/realize-im/im-img/2023/12/14/user_242083/1735189987389120512.jpg",
					"https://realizedongmi.oss-cn-shanghai.aliyuncs.com/user/realize-im/im-img/2023/12/14/user_242083/1735190089239404544.jpg",
					"https://realizedongmi.oss-cn-shanghai.aliyuncs.com/user/realize-im/im-img/2023/12/14/user_242083/1735190183825154048.jpg"
				], // 背景样式图(顺序不能改)
				borderColorList:['#FFF2E1', '#E1F3FA', '#FFE5FE', '#FFF2E1']
			}
		},
		mounted(){
			// this.showInfoKeys = this.showall ? this.allInfoKeys : this.info.view ? this.info.view.split(',') : [];
			// this.cardbg = this.showall ? this.bg01 : this.info.backdropImg || this.bg01;
			this.showInfoKeys = this.info.view ? this.info.view.split(',') : [];
			this.cardbg = this.info.backdropImg || this.bg01;
		},
		methods:{
			handlePhoneCall(){
				uni.makePhoneCall({
					phoneNumber: this.info.phone,
					fail(){
						console.log('拨打电话失败')
					}
				})
				// plus.device.dial(this.info.phone, true)
			},
		},
		watch:{
			info:{
				handler(val){
					this.showInfoKeys = this.info.view ? this.info.view.split(',') : [];
					this.cardbg = this.info.backdropImg || this.bg01;
				},
				deep:true,
				immediate: true
			}
		}
	}
</script>

<style lang="scss" scoped>
.info1{
	margin-left: 30rpx;
	margin-right: 30rpx;
	margin-top: 20rpx;
	margin-bottom: 28rpx;
	background-color: #fff;
	border-radius: 32rpx;
	-moz-box-shadow: 0 0 12px 1px #EFF6FB;
	-webkit-box-shadow: 0 0 12px 1px #EFF6FB;
	box-shadow: 0 0 12px 1px #EFF6FB;
}
.info-wrap{
	padding-bottom: 48rpx;
	.bg{
		border-top-left-radius: 32rpx;
		border-top-right-radius: 32rpx;
	}
	.info-inner{
		margin-top: -70rpx;
		overflow: hidden;
		.head-box{
			width: 140rpx;
			height: 140rpx;
			margin: 0 auto;
			border-radius: 50%;
			border:2px solid #EFF6FB;
			position: relative;
			z-index: 1;
			.head{
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.name, .position{
			margin-top: 20rpx;
			text-align: center;
		}
        .name{
            font-size: 44rpx;
			letter-spacing: 4px;
        }
        .position{
            font-size: 28rpx;
            color: #86909C;
			letter-spacing: 1px;
        }
		.contact-box{
			display: flex;
			justify-content: center;
			margin-top: 30rpx;
			.contact-item{
				color: #4E5969;
				font-size: 28rpx;
				margin-bottom: 8rpx;
				cursor: pointer;
			}
		}
	}	
}
</style>