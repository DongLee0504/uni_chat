import {USER_STATE} from "../common/enums"
import http from '../common/request'


export default {
	state: {
		userInfo: {},
		state: USER_STATE.FREE 
	},

	mutations: {
		setUserInfo(state, userInfo) {
			// 使用深拷贝方式，否则小程序页面不刷新
			Object.assign(state.userInfo, userInfo); 
		},
		setUserState(state, userState) {
			state.state = userState;
		},
		clear(state){
			state.userInfo = {};
			state.state = USER_STATE.FREE;
		}
	},
	actions:{
		loadUser(context){
			return new Promise((resolve, reject) => {
				http({
					url: '/im/user/findByUserId',
					method: 'GET'
				}).then((res) => {
					console.log((res))
					context.commit("setUserInfo",res.data);
					resolve();
				}).catch((res)=>{
					reject(res);
				});
			})
		}
	}
	
}