import * as Express from 'express';
import * as Promise from 'bluebird';

import * as Url from '../modules/url';
import * as Image from '../modules/image';
import { Model as urlModel, ModelInterface as urlModelInterface } from '../models/url';
import { Model as imageModel, ModelInterface as imageModelInterface } from '../models/image';
import * as paramValidator from '../validator/param-validator';
import * as ResJson from '../modules/core/res-json';

var router = Express.Router();

/**
 * 增加一个url
 */
router.post('/user/robot/add-url', (req, res, next) => {
	var url: string = req.body.url;
	var urlRecord: urlModelInterface;

	if (!paramValidator.isUrl(url, 'url', res)) {
		return;
	}
		
	Url.createUrl(url)
		.then(record => {
			urlRecord = record;
			return Url.pullPage(urlRecord.url);
		})
		.then(body => {
			return Url.getUrlTDK(body);
		})
		.then(pageInfo => {
			urlRecord.urlTitle = pageInfo.title;
			urlRecord.urlKeyword = pageInfo.keyword;
			urlRecord.urlDescription = pageInfo.description;
			return new Promise((resolve, reject) => {
				urlRecord.save((err, res) => {
					if (err) {
						reject(err);
						return;
					} else {
						resolve(res);
					}
				})
			})
		})
		.then(() => {
			res.json(ResJson.redirectJson(''));
		})
		.catch(err => {
			res.json(ResJson.failedJson(JSON.stringify(err)));
		})
})

/**
 * 根据一个url抓取他的链接
 * warning: !!没写完
 */
router.post('/user/urlinfo/get-son-url', (req, res, next) => {
	var url = req.body.url;
	
	if ( ! paramValidator.isUrl(url, 'url', res)) {
		return;
	}
	
	Url.getUrlRecordByUrl(url)
		.then(record => {
			return Url.pullPage(record.url);
		})
		.then(body => {
			return Url.getLinkByBody(body);
		})
		.map((item: string, index: number, length: number) => {
			return Url.createUrl(item)
				.then(record => {
					record.parentUrl = url;
					record.save();
				})
		})
		.then(() => {
			res.json(ResJson.redirectJson(''));
		})
})

/**
 * 根据url抓取他的图片
 */
router.post('/user/urlinfo/get-son-img', (req, res, next) => {
    var url = req.body.url;
   
    if( ! paramValidator.isUrl(url, 'url', res)) {
        return;
    }
	
	Url.getUrlRecordByUrl(url)
		.then(record => {
			return Url.pullPage(record.url);
		})
		.then(body => {
			return Url.getImgByBody(body, url);
		})
		.then(imgInfo => {
			return Image.saveMultipleImage(imgInfo);
		})
		.then(() => {
			res.json(ResJson.redirectJson(''));
		})
})

/**
 * 下载所有未下载图片
 */
router.get('/user/download-all-img', (req, res, next) => {
	Image.getAllNotDownloadImage()
		.then(records => {
			return Image.downloadAllImage(records, 1, req.query.clientId);
		})
		.then(() => {
			res.json(ResJson.successJson(''));
		})
})

module router {} 

export = router;