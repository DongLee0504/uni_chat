<template>
	<view class="page group-member">
		<view class="search-bar">
			<uni-search-bar v-model="searchText" cancelButton="none" placeholder="输入成员昵称搜索"></uni-search-bar>
		</view>
		<scroll-view class="scroll-bar" scroll-with-animation="true" scroll-y="true">
			<view class="member-items">
				<view class="invite-btn" @click="onInviteMember()">
					<uni-icons type="plusempty" size="28" color="#888888"></uni-icons>
				</view>
				<view v-for="(member,idx) in groupMembers"
					v-show="!searchText || member.aliasName.startsWith(searchText)" :key="idx">
					<view class="member-item" @click="onShowUserInfo(member.userId)">
						<head-image :name="member.aliasName" :online="member.online" :url="member.headImage"
							:size="100"></head-image>

						<view class="member-name">{{ member.aliasName}}</view>

						<view class="member-kick">
							<button type="warn" v-show="isOwner && !isSelf(member.userId)" size="mini"
								@click.stop="onKickOut(member,idx)">移出群聊</button>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isModify: false,
				searchText: "",
				group: {},
				groupMembers: []
			}
		},
		methods: {
			onShowUserInfo(userId) {
				uni.navigateTo({
					url: "/pages/common/user-info?id=" + userId
				})
			},
			onKickOut(member, idx) {
				uni.showModal({
					title: '确认移出?',
					content: `确定将成员'${member.aliasName}'移出群聊吗？`,
					success: (res) => {
						if (res.cancel)
							return;
						this.$http({
							url: `/group/kick/${this.group.id}?userId=${member.userId}`,
							method: 'DELETE'
						}).then(() => {
							uni.showToast({
								title: `已将${member.aliasName}移出群聊`,
								icon: 'none'
							})
							this.groupMembers.splice(idx, 1);
							this.isModify = true;
						});
					}
				})
			},
			loadGroupInfo(id) {
				this.$http({
					url: `/im/group/find/${id}`,
					method: 'GET'
				}).then((res) => {
					this.group = res.data;
				});
			},
			loadGroupMembers(id) {
				this.$http({
					url: `/im/group/members/${id}`,
					method: "GET"
				}).then((res) => {
					this.groupMembers = res.data.filter(m => !m.quit);
				})
			},
			isSelf(userId) {
				return this.$store.state.userStore.userInfo.userId == userId
			},
			onInviteMember() {
				uni.navigateTo({
					url: `/pages/group/group-invite?id=${this.group.id}`
				})
			}
		},
		computed: {
			isOwner() {
				return this.$store.state.userStore.userInfo.userId == this.group.ownerId;
			}
		},
		onLoad(options) {
			this.loadGroupInfo(options.id);
			this.loadGroupMembers(options.id);
		},
		onUnload() {
			if (this.isModify) {
				// 刷新页面
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				prevPage.$vm.loadGroupMembers();
			}
		}
	}
</script>

<style scoped lang="scss">
	.group-member {
		padding: 0 24rpx;
		.member-items {
			display: flex;
			flex-wrap: wrap;
            width: 702rpx;
			padding: 10rpx;
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

			.scroll-bar {
				height: 100%;
			}
		}
	}
</style>