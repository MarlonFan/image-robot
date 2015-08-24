var ParamValidator = (function () {
    function ParamValidator() {
    }
    return ParamValidator;
})();

ParamValidator.prototype.isNumber = function (param, name) {
	if (!isNaN(param)) {
		return true;
	} else {
		throw new Error(name + ' is not a number');
	}
}

ParamValidator.prototype.isString = function (param, name) {
	if (typeof param == 'string') {
		return true;
	} else {
		throw new Error(name + ' is not a string');
	}
}

module.exports = new ParamValidator();