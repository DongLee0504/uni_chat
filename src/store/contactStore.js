import http from "../common/request";
import { TERMINAL_TYPE } from "../common/enums.js";

export default {
  state: {
    contacts: [],
    timer: null,
  },
  mutations: {
    setContacts(state, contacts) {
      state.contacts = contacts;
    },
    updateContact(state, friend) {
      state.contacts.forEach((f, index) => {
        if (f.id == friend.id) {
          // 拷贝属性
          let online = state.contacts[index].online;
          Object.assign(state.contacts[index], friend);
          state.contacts[index].online = online;
        }
      });
    },
    removeContact(state, id) {
      state.contacts.forEach((f, idx) => {
        if (f.id == id) {
          state.contacts.splice(idx, 1);
        }
      });
    },
    addContact(state, friend) {
      state.contacts.push(friend);
    },

    setOnlineStatus(state, onlineIds) {
      state.contacts.forEach((f) => {
        const online = onlineIds.find((id) => f.id == id);
        if (online) {
          f.online = true;
          // f.onlineTerminals = userTerminal.terminals;
          // f.onlineWeb = userTerminal.terminals.indexOf(TERMINAL_TYPE.WEB) >= 0
          // f.onlineApp = userTerminal.terminals.indexOf(TERMINAL_TYPE.APP) >= 0
        } else {
          f.online = false;
          f.onlineTerminals = [];
          f.onlineWeb = false;
          f.onlineApp = false;
        }
      });

      // state.contacts.sort((f1, f2) => {
      // 	if (f1.online && !f2.online) {
      // 		return -1;
      // 	}
      // 	if (f2.online && !f1.online) {
      // 		return 1;
      // 	}
      // 	return 0;
      // });
    },
    refreshOnlineStatus(state) {
      if (state.contacts.length > 0) {
        let userIds = [];
        state.contacts.forEach((f) => {
          userIds.push(f.id);
        });
        http({
          url: "/im/user/online",
          method: "POST",
          data: { userIds },
        }).then((res) => {
          let onlineIds = res.data;
          this.commit("setOnlineStatus", onlineIds);
        });
      }
      // 30s后重新拉取
      clearTimeout(state.timer);
      state.timer = setTimeout(() => {
        this.commit("refreshOnlineStatus");
      }, 30000);
    },
    clear(state) {
      clearTimeout(state.timer);
      state.contacts = [];
      state.timer = null;
    },
  },
  actions: {
    loadContact(context) {
      return new Promise((resolve, reject) => {
        http({
          url: "/im/auth/getAddressBook",
          method: "GET",
        })
          .then((res) => {
            let contacts = res.data;
            context.commit("setContacts", contacts);
            context.commit("refreshOnlineStatus");
            resolve();
          })
          .catch((res) => {
            reject();
          });
      });
    },
  },
};
