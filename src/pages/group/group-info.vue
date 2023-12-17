<template>
	<view class="page group-info">
		<view class="group-members">
			<view class="member-items">
				<view class="invite-btn" @click="onInviteMember()">
					<uni-icons type="plusempty" size="28" color="#888888"></uni-icons>
				</view>
				<view v-for="(member,idx) in  groupMembers" :key="idx">
					<view class="member-item" v-if="idx<14">
						<head-image :id="member.userId" :name="member.aliasName" :url="member.headImage" :size="100"
							:online="member.online"></head-image>
						<view class="member-name">
							<text>{{member.aliasName}}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-if="groupMembers.length>14" class="member-more" @click="onShowMoreMmeber()">查看更多圈友 ></view>
		</view>
		<view class="group-detail">
			<uni-section title="圈子名称:" titleFontSize="30rpx" titleColor="#1D2129">
				<template v-slot:right>
					<view class="detail-right" @click="goEditGroupName()">
						<text class="detail-text">{{group.name}}</text>
						<image src="../../static/image/identityAuth/arrow_solid_right.svg" class="arricon" mode="">
						</image>
					</view>
				</template>
			</uni-section>
			<uni-section title="圈子头像:" titleFontSize="30rpx" titleColor="#1D2129">
				<template v-slot:right>
					<view class="detail-right">
						<!-- <image :src="group.headImage" mode="" class="pic"></image> -->
						<image-upload :onSuccess="onUnloadImageSuccess">
							<image :src="group.headImage" mode="" class="pic"></image>
						</image-upload>
						<image src="../../static/image/identityAuth/arrow_solid_right.svg" class="arricon" mode="">
						</image>
					</view>
				</template>
			</uni-section>
			<uni-section title="管理员:" titleFontSize="30rpx" titleColor="#1D2129">
				<template v-slot:right>
					<view class="detail-right">
						<text class="detail-text">{{ownerName}}</text>
						<image src="../../static/image/identityAuth/arrow_solid_right.svg" class="arricon" mode="">
						</image>
					</view>

				</template>
			</uni-section>

			<!-- <uni-section title="备注:" titleFontSize="30rpx" titleColor="#1D2129">
				<template v-slot:right>
					<text class="detail-text"> {{group.remark}}</text>
				</template>
			</uni-section> -->
			<uni-section title="我在本圈子的昵称:" titleFontSize="30rpx" titleColor="#1D2129">
				<template v-slot:right>
					<view class="detail-right" @click="goEditNickName()">
						<text class="detail-text"> {{group.aliasName}}</text>
						<image src="../../static/image/identityAuth/arrow_solid_right.svg" class="arricon" mode="">
						</image>
					</view>

				</template>
			</uni-section>
			<uni-section title="公告:" titleFontSize="30rpx" titleColor="#1D2129" v-if="group.notice">
				<template v-slot:right >
					<view class="detail-right"  @click="goEditNotice()">
						<image src="../../static/image/identityAuth/arrow_solid_right.svg" class="arricon" mode="">
						</image>
					</view>
				</template>
				<uni-notice-bar :text="group.notice" color="#86909C" background-color="#fff" />
			</uni-section>
			<uni-section title="公告:" titleFontSize="30rpx" titleColor="#1D2129" v-else>
				<template v-slot:right>
					<view class="detail-right" @click="goEditNotice()">
						<text class="default-text"> 未设置</text>
						<image src="../../static/image/identityAuth/arrow_solid_right.svg" class="arricon" mode="">
						</image>
					</view>
				</template>
			</uni-section>
			<!-- <view class="group-edit" @click="onEditGroup()">修改圈子资料 > </view> -->
		</view>
		<view class="btn-group">
			<!-- <button class="btn" type="primary" @click="onSendMessage()">发消息</button> -->
			<!-- <button class="btn" v-show="!isOwner" @click="onQuitGroup()">退出圈子</button>
			<button class="btn" v-show="isOwner" @click="onDissolveGroup()">解散圈子</button> -->
			<view class="btn" v-show="!isOwner" @click="onQuitGroup()">
				退出圈子
			</view>
			<view class="btn" v-show="isOwner" @click="onDissolveGroup()">
				解散圈子
			</view>
		</view>
		<uni-popup ref="popup" background-color="#fff">
			<view class="popup-content">
				<view class="item">
					拍摄
				</view>
				<view class="item" @click="chooseImg()">
					从手机相册选择
				</view>
				<view class="cancle" @click="closePop()">
					取消
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				groupId: null,
				group: {},
				groupMembers: []
			}
		},
		methods: {
			onFocusSearch() {},
			onInviteMember() {
				uni.navigateTo({
					url: `/pages/group/group-invite?id=${this.groupId}`
				})
			},
			onShowMoreMmeber() {
				uni.navigateTo({
					url: `/pages/group/group-member?id=${this.groupId}`
				})
			},
			onEditGroup() {
				uni.navigateTo({
					url: `/pages/group/group-edit?id=${this.groupId}`
				})
			},
			openOpt() {
				this.$refs.popup.open('bottom');
			},
			onUnloadImageSuccess(file, res) {
				console.log(res);
				this.group.headImage = res.data.originUrl;
				this.group.headImageThumb = res.data.thumbUrl;
			},
			closePop() {

			},
			chooseImg() {
				this.$refs.popup.close('bottom');
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log(chooseImageRes);
						uni.uploadFile({
							url: '/im/image/upload', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							success: (uploadFileRes) => {
								console.log(uploadFileRes.data);
							}
						});
					}
				});
			},
			onSendMessage() {
				let chat = {
					type: 'GROUP',
					targetId: this.group.id,
					showName: this.group.remark ? this.group.remark : this.group.name,
					headImage: this.group.headImage,
				};
				this.$store.commit("openChat", chat);
				uni.navigateTo({
					url: "/pages/chat/chat-box?chatIdx=0"
				})
			},
			goEditNickName() {
				let groupInfo = JSON.stringify({
					id: this.groupId,
					name: this.group.name,
					ownerId: this.group.ownerId,
					aliasName: this.group.aliasName
				})
				uni.navigateTo({
					url: `/pages/group/group-nickname?groupInfo=${groupInfo}`
				})
			},
			goEditGroupName() {
				if (this.isOwner) {
					let groupInfo = JSON.stringify({
						id: this.groupId,
						name: this.group.name,
						ownerId: this.group.ownerId
					})
					uni.navigateTo({
						url: `/pages/group/group-groupname?groupInfo=${groupInfo}`
					})
				} else {
					uni.showModal({
						title: "当前圈子只有管理员才能修改圈子名称",
						showCancel: false,
						confirmText: '我知道了'
					})
				}

			},
			goEditNotice() {
				let groupInfo = JSON.stringify({
					id: this.groupId,
					name: this.group.name,
					ownerId: this.group.ownerId,
					notice: this.group.notice
				})
				uni.navigateTo({
					url: `/pages/group/group-notice?groupInfo=${groupInfo}`
				})
			},
			onQuitGroup() {
				uni.showModal({
					title: '确认退出?',
					content: `退出圈子后将不再接受圈子里的消息，确认退出吗?`,
					success: (res) => {
						if (res.cancel)
							return;
						this.$http({
							url: `/im/group/quit/${this.groupId}`,
							method: 'DELETE'
						}).then(() => {
							uni.showModal({
								title: `退出成功`,
								content: `您已退出圈子'${this.group.name}'`,
								showCancel: false,
								success: () => {
									setTimeout(() => {
										uni.switchTab({
											url: "/pages/group/group"
										});
										this.$store.commit("removeGroup", this
											.groupId);
										this.$store.commit("removeGroupChat", this
											.groupId);
									}, 100)
								}
							})
						});
					}
				});
			},
			onDissolveGroup() {
				console.log(this.group.name)
				uni.showModal({
					title: '确认解散?',
					content: `确认要解散圈子'${this.group.name}'吗?`,
					success: (res) => {
						if (res.cancel)
							return;
						this.$http({
							url: `/im/group/delete/${this.groupId}`,
							method: 'delete'
						}).then(() => {
							uni.showModal({
								title: `解散成功`,
								content: `圈子'${this.group.name}'已解散`,
								showCancel: false,
								success: () => {
									setTimeout(() => {
										uni.switchTab({
											url: "/pages/group/group"
										});
										this.$store.commit("removeGroup", this
											.groupId);
										this.$store.commit("removeGroupChat", this
											.groupId);
									}, 100)
								}
							})
						});
					}
				});

			},
			loadGroupInfo() {
				this.$http({
					url: `/im/group/find/${this.groupId}`,
					method: 'GET'
				}).then((res) => {
					const group = res.data;
					this.group = group;
					// 更新聊天页面的圈子信息
					this.$store.commit("updateChatFromGroup", group);
					// 更新聊天列表的圈子信息
					this.$store.commit("updateGroup", group);

				});
			},
			loadGroupMembers() {
				console.log("loadGroupMembers")
				this.$http({
					url: `/im/group/members/${this.groupId}`,
					method: "GET"
				}).then((res) => {
					console.log(res)
					const members = res.data;
					this.groupMembers = members.filter(m => !m.quit);
				})
			}
		},
		computed: {
			ownerName() {
				let member = this.groupMembers.find((m) => m.userId == this.group.ownerId);
				return member && member.aliasName;
			},
			isOwner() {
				return this.group.ownerId == this.$store.state.userStore.userInfo.userId;
			}
		},
		onLoad(options) {
			this.groupId = options.id;
			// 查询圈子信息
			console.log(options);
			this.loadGroupInfo(options.id);
			// 查询圈子成员
			this.loadGroupMembers(options.id)
		}

	}
</script>

<style lang="scss" scoped>
	.group-info {
		padding: 0 24rpx;

		.group-members {
			padding: 10rpx;
			background: white;

			.member-items {
				display: flex;
				flex-wrap: wrap;

				.member-item {
					width: 120rpx;
					display: flex;
					flex-direction: column;
					margin: 8rpx 2rpx;
					position: relative;
					align-items: center;
					padding-right: 5px;
					background-color: #fafafa;
					white-space: nowrap;

					.member-name {
						width: 100%;
						flex: 1;
						font-size: 14px;
						overflow: hidden;
						text-align: center;
						white-space: nowrap;
						text-overflow: ellipsis;
						color: #4E5969;
						font-size: 26rpx;
					}
				}

				.invite-btn {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100rpx;
					height: 100rpx;
					margin: 10rpx;
					border: #C9CDD4 dashed 1px;
					border-radius: 50%;
				}
			}

			.member-more {
				padding: 20rpx;
				text-align: center;
				font-size: 28rpx;
				color: #4E5969;
			}
		}


		.group-detail {
			margin-top: 30rpx;
			padding: 20rpx;
			background: white;

			.detail-right {
				display: flex;
				align-items: center;

				.detail-text {
					font-size: 28rpx;
					font-weight: 600;
				}

				.default-text {
					color: #C9CDD4;
					font-size: 28rpx;
					font-weight: 600;
				}

				.group-edit {
					padding: 20rpx;
					text-align: center;
					font-size: 30rpx;
				}

				.pic {
					width: 50rpx;
					height: 50rpx;
				}

				.arricon {
					width: 12rpx;
					height: 16rpx;
					margin-left: 20rpx;
				}
			}


		}


		.btn-group {
			// margin-top: 30rpx;
			// padding: 30rpx;
			//background: white;


			.btn {
				margin: 26rpx auto;
				background: #FFFFFF;
				border-radius: 16rpx;
				width: 702rpx;
				height: 90rpx;
				color: #E84444;
				font-size: 30rpx;
				text-align: center;
				line-height: 90rpx;
			}
		}

		.popup-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #F8FAFD;

			.item {
				width: 100%;
				height: 100rpx;
				text-align: center;
				line-height: 100rpx;
				background-color: #fff;
			}

			.cancle {
				width: 100%;
				height: 100rpx;
				text-align: center;
				line-height: 100rpx;
				background-color: #fff;
				margin-top: 20rpx;
			}
		}

	}
</style>