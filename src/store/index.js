import chatStore from './chatStore.js';
import friendStore from './friendStore.js';
import userStore from './userStore.js';
import groupStore from './groupStore.js';
import contactStore from './contactStore.js'
import newFriendStore from './newFriendStore.js';
import {
	createStore
} from 'vuex';
const store = createStore({
	modules: {
		chatStore,
		friendStore,
		userStore,
		groupStore,
		contactStore,
		newFriendStore
	},
	state: {},
	actions: {
		load(context) {
			return this.dispatch("loadUser").then(() => {
				const promises = [];
				promises.push(this.dispatch("loadFriend"));
				promises.push(this.dispatch("loadGroup"));
				promises.push(this.dispatch("loadChat"));
				promises.push(this.dispatch('loadContact'));
				promises.push(this.dispatch('loadNewFriend'));
				return Promise.all(promises);
			})
		},
		unload(context) {
			context.commit("clear");
		}
	},
	strict: true
})

export default store;