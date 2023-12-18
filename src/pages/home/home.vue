<template>
	<view class="home">
		<view class="status_bar" :style="{ height: systemInfo.safeAreaInsets.top + 'px' }">
			<!-- 这里是状态栏 -->
		</view>
		<view class="bar_box" :style="{ height: menuButtonInfo.height + 'px' }" @click="handleToMine()"><uni-icons type="bars"
				size="18"></uni-icons></view>
		<view class="tabs">
			<view class="tab" :class="state.curTab == 1 ? 'active' : ''" @click="changeTab(1)">首页</view>
			<view class="tab" :class="state.curTab == 2 ? 'active' : ''" @click="changeTab(2)">知本家课程</view>
			<view class="tab" :class="state.curTab == 3 ? 'active' : ''" @click="changeTab(3)">智信资讯</view>
		</view>
		<view class="content" v-show="state.curTab === 1">
			<view class="card"
				:class="{ orange: userStore.userInfo.status == 0, red: userStore.userInfo.status == 2 || userStore.userInfo.status == 3 }">
				<view class="card_content">
					<view class="card_arrow_right" @click="handleCardClick()">我的名片</view>
					<image class="avatar" :class="userStore.userInfo.status == 1 ? 'authed' : ''" :src="userStore.userInfo.imgPath">
					</image>
					<view class="text_box">
						<view class="text1">{{ userStore.userInfo.userName }}</view>
						<view class="text2">
							{{ userStore.userInfo.secname || '--' }} · {{ userStore.userInfo.section || '--' }}
						</view>
					</view>
				</view>
				<view class="card_tip"
					:class="{ space_between: userStore.userInfo.status != 0 && userStore.userInfo.status != 1 }">
					<text class="text"
						:class="{ orange: userStore.userInfo.status == 0, red: userStore.userInfo.status == 2 || userStore.userInfo.status == 3 }">
						{{ state.statusObj[userStore.userInfo.status] || '您暂未认证个人信息，暂无权限使用本功能' }}
					</text>
					<text class="btn_auth" :class="{ red: userStore.userInfo.status == 2 || userStore.userInfo.status == 3 }"
						v-if="userStore.userInfo.status != 0 && userStore.userInfo.status != 1">
						点击认证
					</text>
				</view>
			</view>
			<view class="stat_box">
				<view class="item item1">
					<view class="s_i_left">
						<text class="text1">{{ state.censusCountInfo.authUserCount.toLocaleString() }}</text>
						<text class="text2">总用户数</text>
					</view>
					<icon class="s_i_icon"></icon>
				</view>
				<view class="item item2">
					<view class="s_i_left">
						<text class="text1">{{ state.censusCountInfo.authCompanyCount.toLocaleString() }}</text>
						<text class="text2">总机构数</text>
					</view>
					<icon class="s_i_icon"></icon>
				</view>
			</view>
			<view class="list_box">
				<view class="list_tabs">
					<view class="tab" :class="state.curListTab == 1 ? 'active' : ''" @click="handleListTabChange(1)">活跃用户</view>
					<view class="tab" :class="state.curListTab == 2 ? 'active' : ''" @click="handleListTabChange(2)">活跃企业</view>
					<view class="tab" :class="state.curListTab == 3 ? 'active' : ''" @click="handleListTabChange(3)">热门圈子</view>
					<view class="tab" :class="state.curListTab == 4 ? 'active' : ''" @click="handleListTabChange(4)">在线时长榜</view>
				</view>
				<view class="list_content" v-if="state.curListTab == 1" :style="{ height: listContentHeight() }">
					<view class="item" :class="{ item1: index == 0, item2: index == 1, item3: index == 2 }"
						v-for="(user, index) in state.dynamicUserList" :key="user.userId">
						<image mode="aspectFill" class="avatar"
							:class="{ avatar1: index == 0, avatar2: index == 1, avatar3: index == 2 }" :src="user.imgPath"></image>
						<view class="text_box">
							<text class="text1">{{ user.userName }}</text>
							<text class="text2">{{ user.secname }}</text>
						</view>
						<view class="btn" @click="handleItemBtnClick(user)">{{ user.isFriend ? '发消息' : '加好友' }}</view>
					</view>
				</view>
				<view class="list_content" v-if="state.curListTab == 2" :style="{ height: listContentHeight() }">
					<view class="item" :class="{ item1: index == 0, item2: index == 1, item3: index == 2 }"
						v-for="(company, index) in state.dynamicCompanyList" :key="company.dtseccode">
						<image mode="aspectFill" class="avatar square"
							:class="{ avatar1: index == 0, avatar2: index == 1, avatar3: index == 2 }" :src="company.companyLogo">
						</image>
						<view class="text_box">
							<text class="text1">{{ company.secname }}</text>
							<text class="text2">{{ company.identity }}</text>
						</view>
					</view>
				</view>
				<view class="list_content" v-if="state.curListTab == 3" :style="{ height: listContentHeight() }">
					<view class="item" :class="{ item1: index == 0, item2: index == 1, item3: index == 2 }"
						v-for="(group, index) in state.popularGroupList" :key="group.groupId">
						<image mode="aspectFill" class="avatar"
							:class="{ avatar1: index == 0, avatar2: index == 1, avatar3: index == 2 }" :src="group.headImage"></image>
						<view class="text_box">
							<text class="text1">{{ group.groupName }}</text>
							<text class="text2">粉丝 {{ group.groupCount }}</text>
						</view>
					</view>
				</view>
				<view class="list_content" v-if="state.curListTab == 4" :style="{ height: listContentHeight() }">
					<view class="duration_tabs">
						<text class="tab_item" :class="state.curDurationTab == 1 ? 'active' : ''"
							@click="handleDurationTabChange(1)">本周</text>
						<text class="tab_item" :class="state.curDurationTab == 2 ? 'active' : ''"
							@click="handleDurationTabChange(2)">本月</text>
					</view>
					<view class="item" :class="{ item1: index == 0, item2: index == 1, item3: index == 2 }"
						v-for="(user, index) in state.onlineDurationList" :key="user.userId">
						<image mode="aspectFill" class="avatar"
							:class="{ avatar1: index == 0, avatar2: index == 1, avatar3: index == 2 }" :src="user.imgPath"></image>
						<view class="text_box">
							<text class="text1">{{ user.userName }}</text>
							<text class="text2">{{ user.secname }}</text>
						</view>
						<view class="right_text" :class="{ text1: index == 0, text2: index == 1, text3: index == 2 }">{{ user.duration
						}}</view>
					</view>
				</view>
			</view>
		</view>

		<course-list v-show="state.curTab === 2"></course-list>
		<zixun v-show="state.curTab === 3"></zixun>

		<auth-tips :type="1" :visible="state.authTipsPopupVisible" @comfirm="handleConfirm"
			@visibleChange="handleCancel"></auth-tips>
	</view>
</template>

<script setup>
import { getMenuButtonBoundingClientRect } from '../../common/util.js';
import { getCurrentInstance, onMounted, reactive, computed} from 'vue';
import { onShow } from "@dcloudio/uni-app";
const { proxy } = getCurrentInstance();
const systemInfo = uni.getSystemInfoSync()
const menuButtonInfo = getMenuButtonBoundingClientRect()
const state = reactive({
	curTab: 1,
	curListTab: 1,
	curDurationTab: 1,
	statusObj: {
		0: '审核中，请耐心等待~，您目前有48小时的试用时间。',
		1: '认证成功，好友列表可能发生变动，请悉知！',
		2: '驳回',
		3: '停用'
	},
	censusCountInfo: {
		authUserCount: 0,
		authCompanyCount: 0
	}, // 统计
	dynamicUserList: [], // 活跃用户
	dynamicCompanyList: [], // 活跃企业
	popularGroupList: [], // 热门圈子
	onlineDurationList: [], // 在线时长
	authTipsPopupVisible: false
})
const userStore = computed(() => proxy.$store.state.userStore)
const changeTab = (tab) => {
	state.curTab = tab;
}
// 跳转我的
const handleToMine = () => {
	uni.navigateTo({
		url: '/pages/mine/mine'
	});
}
const handleCardClick = () => {
	if (userStore.userInfo.status != 0 && userStore.userInfo.status != 1) {
		// 未认证
		state.authTipsPopupVisible = true;
	} else {
		uni.navigateTo({ url: '/pages/mycard/index' })
	}
}
// 认证提示关闭
const handleCancel = () => {
	state.authTipsPopupVisible = false;
}
// 认证提示确定
const handleConfirm = () => {
	state.authTipsPopupVisible = false;
	uni.navigateTo({ url: '/pages/identityAuth/index' })
}
const handleListTabChange = (tab) => {
	if (state.curListTab == tab) return;
	state.curListTab = tab;
}
const handleDurationTabChange = (tab) => {
	if (state.curDurationTab == tab) return;
	state.curDurationTab = tab;
	ajaxGetOnlineDurationList();
}
// 活跃用户点击
const handleItemBtnClick = (user) => {
	if (user.isFriend) {
		const chat = {
			type: "PRIVATE",
			targetId: user.userId,
			showName: user.userName,
			headImage: user.imgPath,
			secname: user.secname,
		};
		proxy.$store.commit("openChat", chat);
		uni.navigateTo({
			url: '/pages/chat/chat-box?chatIdx=0'
		})
	} else {
		uni.navigateTo({
			url: '/pages/common/user-info?id=' + user.userId
		})
	}
}
const listContentHeight = () => {
	return `calc(100vh - ${systemInfo.safeAreaInsets.top}px - ${menuButtonInfo.height}px - 80rpx - 302rpx - 132rpx - 190rpx)`;
}
// 统计
const ajaxGetCensusCount = () => {
	proxy.$http({
		url: '/im/auth/getCensusCount',
		method: 'get'
	}).then((res) => {
		state.censusCountInfo = res.data;
	});
}
// 活跃用户
const ajaxGetDynamicUserList = () => {
	proxy.$http({
		url: '/im/dynamic/getDynamicUserList',
		method: 'get'
	}).then((res) => {
		state.dynamicUserList = res.data;
	});
}
//活跃企业
const ajaxGetDynamicCompanyList = () => {
	proxy.$http({
		url: '/im/dynamic/getDynamicCompanyList',
		method: 'get'
	}).then((res) => {
		state.dynamicCompanyList = res.data;
	});
}
// 热门圈子
const ajaxGetPopularGroupList = () => {
	proxy.$http({
		url: '/im/dynamic/getPopularGroupList',
		method: 'get'
	}).then((res) => {
		state.popularGroupList = res.data;
	});
}
// 在线时长
const ajaxGetOnlineDurationList = () => {
	proxy.$http({
		url: '/im/dynamic/getOnlineDurationList',
		method: 'post',
		data: {
			selectedMonth: state.curDurationTab == 1 ? false : true
		}
	}).then((res) => {
		state.onlineDurationList = res.data;
	});
}
onMounted(() => {
	ajaxGetCensusCount();
	ajaxGetDynamicUserList();
	ajaxGetDynamicCompanyList();
	ajaxGetPopularGroupList();
	ajaxGetOnlineDurationList();
})
onShow(() => {
	const app = getApp();
	const unreadCount = app.getTotalUnreadCount();
	app.refreshUnreadBadge(unreadCount);
})
</script>

<style lang="scss" scoped>
.home {
	background: linear-gradient(180deg, #f0f8ff 0%, #f9fbfe 100%);
	padding: 0 20rpx;
	min-height: 100%;

	.bar_box {
		width: 64rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		border-radius: 50%;
	}

	.tabs {
		display: flex;
		align-items: center;
		margin-top: 20rpx;

		.tab {
			margin-right: 48rpx;
			font-size: 32rpx;
			color: #4e5969;
			font-weight: bold;
		}

		.active {
			font-size: 44rpx;
			font-weight: bold;
			color: #1d2129;
		}
	}

	.content {
		.card {
			height: 292rpx;
			margin-top: 20rpx;
			box-sizing: border-box;
			background: linear-gradient(270deg, #dcf4ff 0%, #d8eeff 100%);
			overflow-y: hidden;
			border-radius: 32rpx;
			position: relative;

			&.orange {
				background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/home_image/card_bg_orange.svg') no-repeat;
				background-size: cover;
			}

			&.red {
				background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/home_image/card_bg_red.svg') no-repeat;
				background-size: cover;
			}

			.card_content {
				display: flex;
				height: 208rpx;
				padding: 0 24rpx;
				align-items: center;
				background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/home_image/card_bg.png) no-repeat;
				background-size: cover;
				position: relative;

				.avatar {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					margin-right: 16rpx;

					&.authed::after {
						position: absolute;
						content: '';
						width: 108rpx;
						height: 32rpx;
						bottom: 26rpx;
						left: 30rpx;
						background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/home_image/icon_authed.svg) no-repeat;
						background-size: 100% 100%;
					}
				}

				.text_box {
					.text1 {
						font-size: 40rpx;
						font-weight: bold;
						color: #fff;
					}

					.text2 {
						color: #8CCEFE;
						font-size: 28rpx;

						.icon_authed {
							width: 32rpx;
							height: 32rpx;
							vertical-align: middle;
						}
					}
				}

				.card_arrow_right {
					position: absolute;
					right: 0;
					top: 32rpx;
					height: 48rpx;
					width: 144rpx;
					line-height: 48rpx;
					background: linear-gradient(90deg, #f3f8ff 0%, #cfe3ff 100%);
					border-radius: 24rpx 0rpx 0rpx 24rpx;
					font-size: 24rpx;
					color: #058bd6;
					text-align: center;

					&::after {
						position: absolute;
						right: 6rpx;
						top: 50%;
						transform: translateY(-50%);
						content: '';
						width: 12rpx;
						height: 16rpx;
						background: url('https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/home_image/icon_arrow_right.svg') no-repeat;
						background-size: 12rpx 16rpx;
						background-position: right center;
					}
				}
			}

			.card_tip {
				padding: 0 24rpx;
				height: 84rpx;
				font-size: 26rpx;
				color: #4E5969;
				display: flex;
				justify-content: center;
				align-items: center;

				&.space_between {
					justify-content: space-between;
				}

				.text.orange {
					color: #db832d;
				}

				.text.red {
					color: #f53f3f;
				}

				.btn_auth {
					width: 128rpx;
					height: 50rpx;
					line-height: 50rpx;
					background: linear-gradient(309deg, #17A7EB 0%, #128CEA 100%);
					border-radius: 24rpx;
					text-align: center;
					font-size: 24rpx;
					color: #fff;

					&.red {
						background: linear-gradient(90deg, #ff6c51 0%, #ff4242 100%);
						color: #fff;
					}
				}
			}
		}

		.stat_box {
			height: 140rpx;
			margin: 22rpx 0;
			display: flex;
			justify-content: space-around;

			.item {
				width: calc(50% - 10rpx);
				display: flex;
				align-items: center;
				justify-content: space-around;

				.s_i_left {
					display: flex;
					flex-direction: column;
					align-items: center;

					.text1 {
						color: #1d2129;
						font-weight: bold;
						font-size: 40rpx;
					}

					.text2 {
						font-size: 24rpx;
						color: #86909c;
					}
				}

				.s_i_icon {
					width: 88rpx;
					height: 88rpx;
				}

				&.item1 {
					background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/home_image/stat_bg1.png) no-repeat;
					background-size: cover;

					& .s_i_icon {
						background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/home_image/icon_user.png) no-repeat;
						background-size: 100%;
					}
				}

				&.item2 {
					background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/home_image/stat_bg2.png) no-repeat;
					background-size: cover;

					& .s_i_icon {
						background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/home_image/icon_org.png) no-repeat;
						background-size: 100%;
					}
				}
			}
		}

		.list_box {
			padding: 32rpx 0;
			background: #fff;
			border-radius: 16rpx;

			.list_tabs {
				display: flex;
				justify-content: space-between;

				.tab {
					text-align: center;
					font-size: 28rpx;
					color: #86909c;
					flex: 1;
					position: relative;

					&.active {
						color: #1d2129;
						font-weight: bold;

						&::after {
							content: '';
							position: absolute;
							bottom: -16rpx;
							left: 50%;
							transform: translateX(-50%);
							width: 40rpx;
							height: 16rpx;
							background: url(https://idtcdn-1309770014.oss-cn-shanghai.aliyuncs.com/rz/zhixin_applets/images/home_image/icon_active.png) no-repeat;
							background-size: 100%;
						}
					}
				}
			}

			.list_content {
				margin-top: 30rpx;
				overflow-y: auto;

				.duration_tabs {
					text-align: center;
					margin: 20rpx 0;

					.tab_item {
						display: inline-block;
						width: 112rpx;
						height: 52rpx;
						line-height: 52rpx;
						color: #86909c;
						font-size: 26rpx;

						&.active {
							color: #1d2129;
							background: #f5f7fa;
							border-radius: 28rpx;
						}
					}
				}

				.item {
					margin-bottom: 12rpx;
					height: 132rpx;
					padding: 0 32rpx;
					background: #fff;
					border-radius: 16rpx;
					display: flex;
					align-items: center;

					// &.item1 {
					// 	background: linear-gradient(90deg, #fff6ed 0%, rgba(255, 246, 237, 0) 100%);
					// }
					// &.item2 {
					// 	background: linear-gradient(90deg, #eff6ff 0%, rgba(239, 246, 255, 0) 100%);
					// }
					// &.item3 {
					// 	background: linear-gradient(90deg, #fff2f0 0%, rgba(255, 234, 231, 0) 100%);
					// }
					.avatar {
						width: 96rpx;
						height: 96rpx;
						border-radius: 50%;
						margin-right: 16rpx;
						border: 2rpx solid #f0f1f2;

						&.avatar1 {
							border: 2rpx solid #ffb244;
						}

						&.avatar2 {
							border: 2rpx solid #2ea7e0;
						}

						&.avatar3 {
							border: 2rpx solid #ff7d00;
						}

						&.square {
							border-radius: 16rpx;
						}
					}

					.text_box {
						display: flex;
						flex-direction: column;

						.text1 {
							font-size: 28rpx;
							font-weight: bold;
							color: #1d2129;
						}

						.text2 {
							font-size: 24rpx;
							font-weight: 400;
							color: #86909c;
						}
					}

					.btn {
						height: 50rpx;
						line-height: 50rpx;
						background: linear-gradient(90deg, #35c6eb 0%, #2ea7e0 100%);
						border-radius: 50rpx;
						padding: 0 24rpx;
						margin-left: auto;
						font-size: 24rpx;
						color: #fff;
					}

					.right_text {
						margin-left: auto;
						font-size: 26rpx;
						color: #4e5969;

						&.text1 {
							color: #ffb244;
						}

						&.text2 {
							color: #2ea7e0;
						}

						&.text3 {
							color: #ff7d00;
						}
					}
				}
			}
		}
	}
}

.auth_pop_content {
	width: 590rpx;
	height: 660rpx;
	background: #ffffff;
	border-radius: 32rpx;
	overflow: hidden;

	.header {
		text-align: right;
		margin: 24rpx 24rpx 0 0;

		.icon_close {
			width: 48rpx;
			height: 48rpx;
		}
	}

	.avatar_box {
		text-align: center;

		.avatar {
			width: 188rpx;
			height: 188rpx;
			border-radius: 50%;
			margin: 0 auto;
		}
	}

	.text {
		font-weight: bold;
		color: #1d2129;
		font-size: 34rpx;
		margin-top: 38rpx;
		text-align: center;
	}

	.btn {
		margin: 0 40rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		border-radius: 16rpx;
		margin-top: 48rpx;

		&.confirm {
			background: linear-gradient(309deg, #17a7eb 0%, #128cea 100%);
			color: #fff;
		}

		&.cancel {
			background: #fff;
			color: #2ea7e0;
			border: 2rpx solid #2ea7e0;
		}

		&+.btn {
			margin-top: 32rpx;
		}
	}
}
</style>
<style>
page {
	height: 100%;
}
</style>