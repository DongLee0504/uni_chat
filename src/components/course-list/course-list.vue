<template>
	<view class="course-content">
		<!-- 知本家课程 -->		
		<view class="tab">
			<view class="tab-item" @click.native="sortClick(0)">
				<text>全部</text>
			</view>
			<view :class="`tab-item ${sortStatus1 === 0 ? '' : 'light'}`" @click.native="sortClick(1)">
				<text>最新</text>
				<cover-image class="img" v-if="sortIcons[sortStatus1]" :src="sortIcons[sortStatus1]"></cover-image>
			</view>
			<view :class="`tab-item ${sortStatus2 === 0 ? '' : 'light'}`" @click.native="sortClick(2)">
				<text>价格</text>
				<cover-image class="img" v-if="sortIcons[sortStatus2]" :src="sortIcons[sortStatus2]"></cover-image>
			</view>
		</view>
		<view class="c-list">
			<view class="c-list-item" v-for="item in courseList" :key="item.id" @click="goDetailClick(item)">
				<view class="item-img">
					<cover-image class="img" :src="item.lessonCover"></cover-image>
				</view>
				<view class="item-info">
					<view class="c-title">
						{{item.lessonName}}
					</view>
					<view class="c-des">
						<text v-if="item.lessonTutor">讲师：{{item.lessonTutor}}</text>
						<text class="c-progress">课程进度{{item.currentLesson}}/{{item.lessonCount}}节</text>
					</view>
					<view class="c-price">
						<text v-if="item.lessonType === 2">￥</text>
						<text class="big">{{item.lessonType === 2 ? item.lessonPrice : '免费'}}</text>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadStatusTypes[loadStatus]" ></uni-load-more>
	</view>
</template>

<script>
	const paixuIcon0  = 'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/course_image/paixu.svg';
	const paixuIcon1  = 'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/course_image/paixu_up.svg';
	const paixuIcon2  = 'https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/course_image/paixu_down.svg';
	export default {
		name:'CourseList',
		data(){
			return{
				sortIcons:[paixuIcon0, paixuIcon1, paixuIcon2],
				sortStatus1:0,
				sortStatus2:0,
				courseListCopy:[],
				courseList: [],
				loadStatus: 0,
				loadStatusTypes:['more', 'loading', 'noMore'],
				queryParams:{
					pageNum: 1,
					pageSize: 10,
					allDate: false
				},
				pageIndex: 1
			}
		},
		mounted(){
			this.getList(1)
		},
		onPullDownRefresh (){
			uni.startPullDownRefresh();
			this.getList(1);
		},
		onReachBottom(){
			this.loadStatus = 1;
			this.getList()
		},
		methods:{
			sortClick(type){
				if(type === 0){
					this.courseList = [...this.courseListCopy];
					this.sortStatus1 = 0;
					this.sortStatus2 = 0;
					return;
				}
				if(type === 1){
					this.sortStatus2 = 0;
				}else{
					this.sortStatus1 = 0;
				} 
				if(this[`sortStatus${type}`] === this.sortIcons.length-1){
					this[`sortStatus${type}`] = 0;
				}else{
					this[`sortStatus${type}`] += 1;
				}
				const status = this[`sortStatus${type}`];
				if(status === 0){
					this.courseList = [...this.courseListCopy];
				}else{
					const sortFn = (a, b)=>{
						const l = type === 1 ? new Date(a.createTime.replace(/-/g, '/')).getTime() : a.price;
						const r = type === 1 ? new Date(b.createTime.replace(/-/g, '/')).getTime() : b.price;
						const d = status === 1 ? l - r : r - l;
						return d;
					}
					this.courseList = this.courseList.sort(sortFn);
				}
			},
			getList(pageIndex){
				try{
					if(pageIndex !== undefined) this.pageIndex = pageIndex;
					this.queryParams.pageNum = this.pageIndex;
					this.$http({
						url: '/im/lesson/getLessonInfoList',
						method: 'post',
						data: this.queryParams
					}).then(res=>{
						uni.stopPullDownRefresh();
						if(res.code === 0){
							const newList = res.data.map(c=>{return{...c, price: c.lessonType === 1 ? 0 : c.lessonPrice}})
							this.courseListCopy = this.courseListCopy.concat(newList || []);
							this.courseList = this.courseList.concat(newList || []);
							this.pageIndex += 1;
							this.loadStatus = this.courseList.length < this.queryParams.pageSize ? 2 : 0;
						}else{
							this.loadStatus = 2;
						}
					}).catch(err=>{
						throw new Error();
					})
				}catch(err){
					uni.stopPullDownRefresh();
					this.loadStatus = 0;
				}
			},
			goDetailClick(item){
				try{
					this.$http({
						url: '/im/lesson/addLessonNumber?lessonId='+item.id,
						method: 'get'
					}).then(res=>{
						if(res.code !== 0){
							throw new Error();
						}
					}).catch(err=>{
						throw new Error();
					})
				}catch(err){
					console.log(err)
				}
				uni.navigateTo({
					url: `/pages/course/detail?data=${JSON.stringify(item)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab{
		display: flex;
		.tab-item{
			display: flex;
			align-items: center;
			white-space: nowrap;
			padding-right:20rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 28rpx;
			cursor: pointer;
			margin-right: 8rpx;
			.img{
				align-items: center;
				width: 24rpx;
				height: auto;
				margin-left: 4rpx;
			}
		}
		.tab-item.light{
			color:#2EA7E0;
		}
	}
	.c-list{
		padding: 20rpx 0;
	}
	.c-list-item{
		display:flex;
		margin-bottom: 28rpx;
		.item-img{
			width: 36%;
			margin-right: 20rpx;
			.img{
				width: 100%;
				height: 100%;
				border-radius: 16rpx;
			}
		}
		.item-info{
			flex: 1;
			.c-title{
				font-size: 28rpx;
				line-height: 40rpx;
				color:#1D2129;
				height: 80rpx;
				word-break: break-all;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				margin-bottom: 12rpx;
			}
			.c-des{
				font-size: 24rpx;
				color: #4E5969;
				margin-bottom: 18rpx;
				.c-progress{
					border:1px solid #2EA7E0;
					border-radius: 6rpx;
					color: #2EA7E0;
					font-size: 20rpx;
					margin-left: 8rpx;
					padding:0 8rpx;
				}
			}
			.c-price{
				font-size: 24rpx;
				color: #F53F3F;
				font-weight: bold;
				.big{					
					font-size: 32rpx;
				}
			}
		}
	}
</style>