<template>
	<view class="page group-invite">
		<view class="nav-bar">
			<view class="nav-search">
				<uni-search-bar :focus="true" bgColor="#fff" radius="8" cancelButton="none" placeholder="搜索"
					@input="handleInput"></uni-search-bar>
			</view>
		</view>
		<view class="box">
			<view class="tabs">
				<uni-segmented-control :current="current" :values="items" style-type="button" active-color="#2EA7E0"
					@clickItem="onClickItem" />
			</view>
		</view>
		<view class="friend-items">
			<scroll-view class="scroll-bar" scroll-with-animation="true" scroll-y="true">
				<uv-index-list :index-list="indexList" customNavHeight="100rpx">
					<template v-for="(itemArr, index) in indexArr" :key="index">
						<uv-index-item>
							<uv-index-anchor :text="indexList[index]"></uv-index-anchor>
							<view v-for="(friend, index) in itemArr" :key="index" >
								<!-- <friend-item :friend="friend"></friend-item> -->
								<view class="friend-item" @click="onSwitchChecked(friend)">
									<view class="friend-checked">
										<radio :checked="friend.checked" :disabled="friend.disabled"
											@click.stop="onSwitchChecked(friend)" />
									</view>

									<head-image :name="friend.nickName" :online="friend.online" :url="friend.headImage"
										:size="100"></head-image>
									<view class="intro">
										<view class="friend-name">{{ friend.nickName}}</view>
										<view class="company-name">{{friend.firmName ? '@' + friend.firmName : ''}}</view>
									</view>

								</view>
							</view>
						</uv-index-item>
					</template>
				</uv-index-list>

			</scroll-view>
		</view>
		<view class="btn-wrap">
			<view>
				已选 <text class="num">{{inviteSize}}</text>个
			</view>
			<button class="invite-btn" :disabled="inviteSize==0" @click="onInviteFriends()">完成</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				groupId: null,
				groupMembers: [],
				items: ['我的好友', '通讯录'],
				current: 0,
				indexList: [],
				indexArr: [],
			}
		},
		methods: {
			handleInput(value) {
				this.initFriendItems(value);
			},
			onInviteFriends() {
				let inviteVo = {
					groupId: this.groupId,
					friendIds: []
				}
				let arr = [].concat.apply([], this.indexArr);
				inviteVo.friendIds = arr.filter(f => !f.disabled && f.checked).map(item => item.id);
				console.log(inviteVo);
				if (inviteVo.friendIds.length > 0) {
					this.$http({
						url: "/im/group/invite",
						method: 'POST',
						data: inviteVo
					}).then(() => {
						uni.showToast({
							title: "邀请成功",
							icon: 'none'
						})
						setTimeout(() => {
							// 回退并刷新
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2];
							prevPage.$vm.loadGroupMembers(this.groupId);
							uni.navigateBack();
						}, 1000);

					})
				}
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
					this.initFriendItems();
				}
			},
			onShowUserInfo(userId) {
				uni.navigateTo({
					url: "/pages/common/user-info?id=" + userId
				})
			},
			onSwitchChecked(friend) {
				if (!friend.disabled) {
					friend.checked = !friend.checked;
				}
				console.log(this.inviteSize)
			},
			initFriendItems(sKeyword = "") {
				let list = [];
				if (this.current == 0) {
					list = this.$store.state.friendStore.friends.filter((f) => f.nickName.indexOf(sKeyword) > -1);
				} else {
					list = this.$store.state.contactStore.contacts.filter((f) => f.nickName.indexOf(sKeyword) > -1);
				}
				this.indexList = list.length > 0 ? Array.from(new Set(list.map((f) => f.initial))) : [""];
				let indexArr = [];
				this.indexList.forEach((item) => {
					let tempArr = [];
					list.forEach((f) => {
						if (f.initial == item) {
							let obj = {
								...f,
								disabled: this.isGroupMember(f.id),
							}
							obj.checked = obj.disabled;
							tempArr.push(obj);
						}
					});
					indexArr.push(tempArr);
				});
				this.indexArr = indexArr;
			},
			loadGroupMembers(id) {
				this.$http({
					url: `/im/group/members/${id}`,
					method: "GET"
				}).then((res) => {
					this.groupMembers = res.data.filter(m => !m.quit);
					this.initFriendItems();
				})
			},

			isGroupMember(id) {
				return this.groupMembers.some(m => m.userId == id);
			},
			getItemIds(list) {
				let arr = [];
				list.forEach((f) => {
					if (!f.disabled && f.checked) {
						arr.push(f.id)
					}
				});
				console.log(arr);
				return arr
			}
		},
		computed: {
			inviteSize() {
				//console.log(this.indexArr);
				//return this.indexArr.filter(f => !f.disabled && f.checked).length;
				let arr = [].concat.apply([], this.indexArr);
				return arr.filter(f => !f.disabled && f.checked).length;
			}
		},
		onLoad(options) {
			this.groupId = options.id;
			this.loadGroupMembers(options.id);
		}
	}
</script>

<style lang="scss" scoped>
	.group-invite {
		display: flex;
		flex-direction: column;

		.nav-bar {
			margin: 5rpx;
			display: flex;
			align-items: center;
			background-color: white;

			.nav-search {
				flex: 1;

				&::v-deep .uni-searchbar {
					background: #f8fafd;
				}
			}

			.nav-add {
				line-height: 56px;
				cursor: pointer;
			}
		}

		.box {
			background-color: #fff;
			padding-top: 24rpx;

			.tabs {
				width: 320rpx;
				margin: 0 auto;
				margin-bottom: 24rpx;
			}
		}

		.friend-items {
			position: relative;
			overflow: hidden;
			height: calc(100vh - 376rpx);

			.friend-item {
				height: 120rpx;
				display: flex;
				margin-bottom: 1rpx;
				position: relative;
				padding: 0 30rpx;
				align-items: center;
				background-color: white;
				white-space: nowrap;

				.intro {
					padding-left: 20rpx;
					font-size: 30rpx;
					font-weight: 600;

					.friend-name {
						flex: 1;
						line-height: 60rpx;
						white-space: nowrap;
						overflow: hidden;
					}

					.company-name {
                        font-size: 26rpx;
						color: #FF9F44;
					}
				}
			}

			.scroll-bar {
				height: 100%;

				::v-deep .uv-index-anchor {
					background-color: #fff !important;
				}
			}
		}

		.btn-wrap {
			height: 100rpx;
			display: flex;
			padding: 18rpx 40rpx;
			justify-content: space-between;
			align-items: center;
			background-color: #fff;
			font-size: 30rpx;
			color: #4E5969;

			.num {
				color: #2EA7E0;
			}

			.invite-btn {
				width: 144rpx;
				height: 64rpx;
				background: linear-gradient(309deg, #17A7EB 0%, #128CEA 100%);
				border-radius: 16rpx;
				margin: 0;
				color: #fff;
				line-height: 64rpx;
			}
		}

	}
</style>