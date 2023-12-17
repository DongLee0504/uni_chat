<template>
	<view class="">
		<view class="img-wrap" v-if="info.lessonCover">
			<cover-image class="img" :src="info.lessonCover"></cover-image>
		</view>
		<view class="info-wrap">
			<view class="info-item">
				<view class="l">课程名称：</view>
				<view class="r"><text class="title">{{info.lessonName}}</text> </view>
			</view>
			<view class="info-item" v-if="info.lessonTutor">
				<view class="l">讲师：</view>
				<view class="r">{{info.lessonTutor}}</view>
			</view>
			<view class="info-item" v-if="info.currentLesson || info.lessonCount">
				<view class="l">课程进度：</view>
				<view class="r"><text class="light">第{{ info.currentLesson }}节</text>/共{{info.lessonCount}}节</view>
			</view>
			<view class="info-item" v-if="info.lessonBeginTime || info.lessonEndTime">
				<view class="l">课程时间：</view>
				<view class="r">{{ info.lessonBeginTime }} ~ {{info.lessonEndTime}}</view>
			</view>
			<view class="info-item" v-if="info.teachType">
				<view class="l">授课方式：</view>
				<view class="r">{{info.teachType}}</view>
			</view>
			<view class="info-item" v-if="info.teachPlace">
				<view class="l">授课地点：</view>
				<view class="r">{{info.teachPlace}}</view>
			</view>
			<view class="info-item">
				<view class="l">价格：</view>
				<view class="r price">
					<text v-if="info.lessonType === 2">￥</text>
					<text class="big">{{info.lessonType === 2 ? info.lessonPrice : '免费'}}</text>
				</view>
			</view>
			<view class="info-item" v-if="info.applyPerson || info.applyPhone">
				<view class="l">报名联系人：</view>
				<view class="r" @click="handlePhoneCall">{{info.applyPerson}} {{info.applyPhone}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'CourseDetail',
		data(){
			return{
				info:{}
			}
		},
		onLoad(option){
			this.info = JSON.parse(option.data);
		},
		methods:{
			handlePhoneCall(){
				uni.makePhoneCall({
					phoneNumber: this.info.applyPhone				
				})
				plus.device.dial(this.info.applyPhone, true)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info-wrap{
		padding: 30rpx;
	}
	.info-item{
		display: flex;
		margin-bottom: 24rpx;
		font-size: 28rpx;
		.l{
			width: 168rpx;
			color: #86909C;
		}
		.r{
			flex: 1;
			.light{
				color: #2EA7E0;
			}
		}
		.title{
			font-weight: bold;
		}
		.price{
			color: #F53F3F;
			font-weight: bold;
			.big{
				font-size: 36rpx;
			}
		}
	}
</style>