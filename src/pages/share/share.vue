<template>
	<view class="share">
		<view class="share-notice" v-show="noticeList.length>0">
			<swiper :autoplay="true" :interval="3000" :duration="1000" :circular="true">
				<swiper-item v-for="(item,index) in noticeList" :key="index">
					<view class="swiper-item">
						<text>{{item}}</text>
					</view>
				</swiper-item>
			</swiper>
			
		</view>
		<img src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/share_image/sharebg.png" alt="" srcset="" class="bgimg" />
		<view class="num-box">
			<img src="https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/share_image/numbox.png" alt="" class="numimg" />
			<view class="count">
				<text v-if="count>0">{{count}}</text>
				<text v-else class="nodata">- 暂无数据 -</text>
			</view>
		</view>
		<button open-type="share" type="default" class="invite-btn" >立即邀请</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noticeList: [],
				count: 0
			}
		},
		methods: {
			//查询推荐用户列表
			  getAttendUserList(){
				  this.$http({
				  	url: `/im/attend/getAttendUserList`,
				  	method: 'GET'
				  }).then((res) => {
                      console.log(res);
					  this.noticeList = res.data.attendUserList;
					  this.count = res.data.attendCount;
				  });
			  }
			
		},
		onLoad(){
			this.getAttendUserList()
		},
		onShareAppMessage() {
			let date = new Date().getTime();
			let shareId = this.$store.state.userStore.userInfo.userId
			return {
				title: '智信',
				path: `/pages/invite/invite?shareUserId=${shareId}&&date=${date}`,	
			}
		}
	}
</script>

<style lang="scss" scoped >
	.share{
		width: 100%;
		min-height: 100vh;
		position: relative;
		.share-notice{
			position: fixed;
			top: 24rpx;
			left: 132rpx;
			width: 408rpx;
			height: 52rpx;
			line-height: 52rpx;
			background-color: #fff;
			border-radius: 25rpx;
			padding: 0 40rpx;
			z-index: 5;
			font-size: 24rpx;
		}
		.bgimg{
			width: 100%;
			height: 1714rpx;
		}
		.num-box{
			position: absolute;
			top: 1146rpx;
			left: 4rpx;
			width: 742rpx;
			height: 360rpx;
			.numimg{
				width: 100%;
				height: 100%;
			}
			.count{
				font-size: 36rpx;
				font-weight: 800;
				color: #4E5969;
				text-align: center;
				margin-top: -180rpx;
				.nodata{
					color: #C9CDD4;
					font-size: 26rpx;
				}
			}
		}
		.invite-btn{
			position: fixed;
			left: 49rpx;
			bottom: 50rpx;
			width: 652rpx;
			height: 100rpx;
			background-color: #F76F20;
			border-radius: 46rpx;
			color: #fff;
			font-weight: bold;
		}
	}

</style>
