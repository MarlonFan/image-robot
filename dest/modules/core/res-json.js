var ResJson = (function() {
	function resJson() {
		
	}
	return resJson;
})()

ResJson.prototype.successJson = function (data) {
	return {
		code: 0,
		data: data,
		msg: '',
		redirect: {
			need: false,
			url: ''
		}
	};
}

ResJson.prototype.failedJson = function (msg) {
	return {
		code: 1,
		data: {},
		msg: msg,
		redirect: {
			need: false,
			url: ''
		}
	}
}

ResJson.prototype.redirectJson = function (url) {
	return {
		code: 0,
		data: {},
		msg: '',
		redirect: {
			need: true,
			url: url
		}
	}
}

module.exports = new ResJson();