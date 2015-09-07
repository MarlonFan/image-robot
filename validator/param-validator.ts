import * as Express from 'express';

import * as ResJson from '../modules/core/res-json';

export function isNumber(param: any, name: string, res: Express.Response) {
	if (isNaN(param)) {
		res.json(ResJson.failedJson(name + ' is not a number'));
		return false;
	}
	return true;
}

export function isString(param: any, name: string, res: Express.Response) {
	if (!(typeof param == 'string') || !param) {
		res.json(ResJson.failedJson(name + ' is not a string'));
		return false;
	}
	return true;
}

export function isUrl(param: any, name: string, res: Express.Response) {
	// if (!RegExp('//g').test(param)
	// ) {
	// 	res.json(ResJson.failedJson(name + ' is a not url'))
	// 	return false;
	// }
	return true;
}