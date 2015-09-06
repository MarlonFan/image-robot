export function successJson(data: any) {
	return {
		code: 0,
		data,
		msg: '',
		redirect: {
			need: false,
			url: ''
		}
	}
}

export function failedJson(msg: any) {
	return {
		code: 1,
		data: {},
		msg,
		redirect: {
			need: false,
			url: ''
		}
	}
}

export function redirectJson(url: string) {
	return {
		code: 0,
		data: {},
		msg: '',
		redirect: {
			need: true,
			url
		}
	}
}