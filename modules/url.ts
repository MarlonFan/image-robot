import * as Promise from 'bluebird';
import * as Fs from 'fs';
import * as Request from 'request';
import * as Http from 'http'
import * as Mongoose from 'mongoose';

import {Model as urlModel, ModelInterface as urlModelInterface, PropertyList as urlPropertyList } from '../models/url';
import {Model as imageModel, ModelInterface as imageModelInterface, PropertyList as imagePropertyList } from '../models/image';
import * as Image from './image';

/** title keyword descript */
export interface TDKItem {
	title: string;
	keyword: string;
	description: string;
}
/**
 * 拉取页面信息,可以获取到要抓取的页面的信息
 * @param url: string
 * @return request body
 */
export function pullPage(url: string): Promise<any>{
	return new Promise<any>((resolve, reject) => {
		Request({
			url,
			method: 'GET',
			timeout: 20 * 1000,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:40.0) Gecko/20100101 Firefox/40.0',
				'Connection': 'keep-alive',
				'Content-Type': 'text/html; charset=utf-8'
			}
		}, (err, res, body) => {
			if (err || res.statusCode != 200) {
				reject(err);
				return;
			}
			resolve(body);
			return;
		})
	})
	.catch(err => {
		throw new Error('pull page error: ' + err);
	});
}

/**
 * 根据请求回来的url分析出当前页面所有图片
 * @param response body
 * @return imgList[]
 */
export function getImgByBody(body: string, url: string): Promise<imagePropertyList[]> {
	return Promise
		.resolve(body)
		.then(body => {
			return body.match(/<img([^>]*)\s*src=('|\")([^'\"]+)('|\").*?>/g);
		})
		.then(imgStringList => {
			var imgList: imagePropertyList[] = [];
			
			for(var i = 0; i < imgStringList.length; i++) {
				
				if(!imgStringList[i].match(/(http:\/\/|https:\/\/|\/\/|\/).*?(\.jpg|\.png|\.gif)/g)) {
					continue;
				}
				
				var keyword = imgStringList[i].match(/alt=".*?"/g) ? imgStringList[i].match(/alt=".*?"/g)[0].replace('alt="', '').replace('"', '') : 'get title failed';
				
				var imageUrl = imgStringList[i].match(/(http:\/\/|https:\/\/|\/\/|\/).*?(\.jpg|\.png|\.gif)/g)[0];
					imageUrl = RegExp('/(http:\/\/|https:\/\/)/').test(imageUrl) ? imageUrl : url + imageUrl;
					
				var imageName = (new Date()).valueOf().toString() + i.toString() + imageUrl.substr(-4, 4);
				
				var tmpImgObj: imagePropertyList = {
					imageUrl: imageUrl,
					pageUrl: url,
					imageName: imageName,
					imgKeyword: keyword,
					isDownload: false
				}
				imgList.push(tmpImgObj);
			}
			
			return imgList;
		})
}
/**
 * 根据请求回来的url分析出当前页面所有链接
 * @param response body
 * @return linkList[]
 */
export function getLinkByBody(body: string): Promise<string[]> {
	return Promise
		.resolve(body)
		.then(body => {
			return body.match(/<a([^>]*)\s*href=('|\")([^'\"]+)('|\")/g).join(',').match(/(http:|https:)\/\/.*?[^"]+/g);
		})
		.then(function(urlList) {
			var tmpRst: string[]  = [];
			
			for (var i = 0; i < urlList.length; i++) {
				var item = urlList[i];
				if(tmpRst.indexOf(item) == -1) {
					tmpRst.push(item);
				}
			}
			
			return new Promise<string[]>((resolve, reject) => {
				urlModel.find({url: {$in: tmpRst}}, (err: string, docs: urlModelInterface[]) => {
					if (err) {
						reject('数据库查重失败');
						return;
					}
					
					if (!docs) {
						resolve(tmpRst);
						return;
					}
					
					for (var i = 0; i < docs.length; i++) {
						var item = docs[i].url;
						if (tmpRst.indexOf(item) != -1) {
							tmpRst.splice(tmpRst.indexOf(item), 1);
						}
					}
					resolve(tmpRst);
					return;
				})
			})
		});
}

/**
 * 获取所有主域名链接
 * @return url[]
 */
export function getAllPrimaryLink(): Promise<urlModelInterface[]> {
	return new Promise<urlModelInterface[]>((resolve, reject) => {
		urlModel.find({parentUrl: null}, (err: string, docs: urlModelInterface[]) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(docs);
			return;		
		})
	})
}

/**
 * 添加一个url
 * @param url
 * @return promise:urlRecord
 */
export function createUrl(url: string): Promise<urlModelInterface> {
	return new Promise<urlModelInterface>((resolve, reject) => {
		var urlRecord: Mongoose.Document = new urlModel({url});
		urlRecord.save((err, res) => {
			if(err) {
				reject(err);
				return;
			} else {
				resolve(urlRecord);
				return;				
			}
		});
	})
}

/**
 * 获取url的TDK
 * @param urlRecord
 */
export function getUrlTDK(body: string): Promise<TDKItem> {
	return Promise
		.resolve(body)
		.then(function(body) {
			var tmpTitle = body.match(/<title>.*?<\/title>/);
			var	title: string = tmpTitle ? tmpTitle[0].replace('<title>', '').replace('<\/title>', '') : 'not found title';
			var tmpKeyword = body.match(/<meta.*?keywords.*?>/);
			var	keyword: string = tmpKeyword ? tmpKeyword[0].match(/content=.*?".*?"/)[0].match(/".*?"/)[0].replace('"', '').replace('"', '') : 'not found keyword';
			var tmpDescription = body.match(/<meta.*?description.*?>/);
			var	description: string = tmpDescription ? tmpDescription[0].match(/content=.*?".*?"/)[0].match(/".*?"/)[0].replace('"', '').replace('"', '') : 'not found keyword';

			return {title, keyword, description};
		});
}

/**
 * 根据url获取url记录
 */
export function getUrlRecordByUrl(url: string): Promise<urlModelInterface> {
	return new Promise<urlModelInterface>((resolve, reject) => {
		urlModel.findOne({url: url}, (err, doc) => {
			if(err) {
				reject(err);
				return;	
			} else {
				resolve(doc);
				return;							
			}
		})
	});
}

/**
 * 根据id获取url记录
 */
export function getUrlRecordById(id: string): Promise<urlModelInterface> {
	return new Promise<urlModelInterface>((resolve, reject) => {
		urlModel.findOne({_id: id}, (err, docs) => {
			if(err) {
				reject(err);
				return;
			} else {
				resolve(docs);
				return;	
			}
		})
	});
}

/**
 * 根据url来获取子链接
 */
export function getUrlSon(url: string): Promise<urlModelInterface[]> {
	return new Promise<urlModelInterface[]>((resolve, reject) => {
		urlModel.find({parentUrl: url}, (err, docs) => {
			if(err) {
				reject(err);
				return;
			} else {
				resolve(docs);
				return;
			}
		})
	})
}