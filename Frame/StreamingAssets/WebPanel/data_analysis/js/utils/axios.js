// 封装统一请求，接受2个参数，api的url地址和参数
const apiUrl = 'http://192.168.1.100:8080/'
async function getApiData(url, params) {
	try {
		let newUrl = `${url}`
		const res = await axios.get(newUrl, {
			params: params,
		})
		return res.data
	} catch (err) {
		throw err
	}
}
async function getApiDataPost(url, data) {
	try {
		let newUrl = `${url}`
		const res = await axios.post(newUrl, data)
		return res.data
	} catch (err) {
		throw err
	}
}
async function getApiDataHeader(url, params) {
	try {
		let newUrl = `${url}`
		const res = await axios.get(newUrl, {
			params: params,
			headers: {
				// 'Content-Type': 'application/x-www-form-urlencoded',
				authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoxMiwidXNlcl9rZXkiOiJ3bXMiLCJ1c2VybmFtZSI6IndtcyJ9.pBjdiz6ME7dJ0fgBPLLGpyw-rIZXz4HglZz7Z9iViieAjiRqiwF5BJ_oasyP7j0uJtwJs_LmD0777WnG-iAomw`,
			},
		})
		return res.data
	} catch (err) {
		throw err
	}
}
