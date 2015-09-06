function successJson(data) {
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
exports.successJson = successJson;
function failedJson(msg) {
    return {
        code: 1,
        data: {},
        msg: msg,
        redirect: {
            need: false,
            url: ''
        }
    };
}
exports.failedJson = failedJson;
function redirectJson(url) {
    return {
        code: 0,
        data: {},
        msg: '',
        redirect: {
            need: true,
            url: url
        }
    };
}
exports.redirectJson = redirectJson;
//# sourceMappingURL=res-json.js.map