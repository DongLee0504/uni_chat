// 请求队列
let requestList = [];
// 是否正在刷新中
let isRefreshToken = false;
const request = (options) => {
	const header = options.header || {};
	const sLoginInfo = uni.getStorageSync("zhixin_applets_loginInfo");
	let oLoginInfo = ''
	if (sLoginInfo) oLoginInfo = JSON.parse(sLoginInfo)
	if (oLoginInfo && options.type == undefined) {
		// 默认 java
		header.Authorization = "Bearer " + oLoginInfo.token;
	}
	if (options.type == 'C++') {
		header['X-Token'] = 'dongmi'
	}
	const base_url = options.type == 'C++' ? import.meta.env.VITE_BASE_URL_C : import.meta.env.VITE_BASE_URL
	return new Promise(function(resolve, reject) {
		uni.request({
			url: base_url + options.url,
			method: options.method || 'GET',
			header: header,
			data: options.type == 'C++' ? JSON.stringify({
				req: options.data
			}) : options.data || {},
			async success(res) {
				if (res.statusCode == 200) {
					if(res.data.code == 30200) {
						console.log(getApp(), 11111)
						getApp().exit();

						return res.data
					}
					if((res.data.tars_ret && res.data.tars_ret != 0) || (res.data.code && res.data.code != 0) ) {
						uni.showToast({
							icon: 'error', title: res.data.msg || '接口错误'
						})
						return false
					}
					return resolve(res.data)
				} else if (res.statusCode == 400) {
					// getApp().exit();
				} else if (res.statusCode == 401) {
					console.log("token失效，尝试重新获取")
					if (isRefreshToken) {
						// 正在刷新token,把其他请求存起来
						requestList.push(() => {
							resolve(request(options))
						})
						return;
					}
					isRefreshToken = true;
					// 发送请求, 进行刷新token操作, 获取新的token
					const res = await reqRefreshToken(loginInfo);
					if (!res || res.data.code != 200) {
						requestList = [];
						isRefreshToken = false;
						console.log("刷新token失败")
						getApp().exit();
						return;
					}
					uni.setStorageSync("loginInfo", res.data.data);
					requestList.forEach(cb => cb());
					requestList = [];
					isRefreshToken = false;
					// 重新发送刚才的请求
					return resolve(request(options))

				} else {
					uni.showToast({
						icon: "none",
						title: res.data.message,
						duration: 1500
					})
					return reject(res.data)
				}
			},
			fail(error) {
				uni.showToast({
					title: "网络似乎有点不给力，请稍后重试",
					duration: 1500
				})
				return reject(error)
			}
		});
	});
}


const reqRefreshToken = (loginInfo) => {
	return new Promise(function(resolve, reject) {
		uni.request({
			method: 'PUT',
			url: import.meta.env.VITE_BASE_URL + '/refreshToken',
			header: {
				refreshToken: loginInfo.refreshToken
			},
			success: (res) => {
				resolve(res);
			},
			fail: (res) => {
				reject(res);
			}
		});
	});
}

export default request;