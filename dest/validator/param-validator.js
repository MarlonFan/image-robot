var ResJson = require('../modules/core/res-json');
function isNumber(param, name, res) {
    if (isNaN(param)) {
        res.json(ResJson.failedJson(name + ' is not a number'));
        return false;
    }
    return true;
}
exports.isNumber = isNumber;
function isString(param, name, res) {
    if (!(typeof param == 'string') || !param) {
        res.json(ResJson.failedJson(name + ' is not a string'));
        return false;
    }
    return true;
}
exports.isString = isString;
function isUrl(param, name, res) {
    return true;
}
exports.isUrl = isUrl;
//# sourceMappingURL=param-validator.js.map