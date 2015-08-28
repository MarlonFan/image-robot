var Promise = require('bluebird');
var fs = require('fs');
var request = require('request');
var http = require('http');
var url = require('url');

var urlModel = require('../models/url');

var Url = (function () {
    function Url() {
    }
    return Url;
})();


/**
 * 拉取页面信息,可以获取到要抓取的页面的信息
 * @param url: string
 * @return request body
 */
Url.prototype.pullPage = function(url) {
	return new Promise(function(resolve, reject) {
		request({
			url: url,
			method: 'GET',
			timeout: 20 * 1000,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:40.0) Gecko/20100101 Firefox/40.0',
				'Connection': 'keep-alive',
				'Content-Type': 'text/html; charset=utf-8'
			}
		}, function(err, res, body) {
			if (err || res.statusCode != 200) {
				reject(err);
			}
			resolve(body);
		});
	})
	.catch(function(err) {
		throw new Error('pull page error: ' + err);
	});
}

/**
 * 根据请求回来的url分析出当前页面所有图片
 * @param response body
 * @return imgList[]
 */
Url.prototype.getImgByBody = function(body, url) {
	
	return Promise
		.resolve(body)
		.then(function(body) {
			return body.match(/<img([^>]*)\s*src=('|\")([^'\"]+)('|\").*?>/g);
		})
		.then(function(imgStringList) {
			var imgList = [];
			
			for(var i = 0; i < imgStringList.length; i++) {
				
				if(!imgStringList[i].match(/(http:\/\/|https:\/\/|\/\/|\/).*?(\.jpg|\.png|\.gif)/g)) {
					continue;
				}
				
				var keyword = imgStringList[i].match(/alt=".*?"/g) ? imgStringList[i].match(/alt=".*?"/g)[0].replace('alt="', '').replace('"', '') : 'get title failed';
				
				var imageUrl = imgStringList[i].match(/(http:\/\/|https:\/\/|\/\/|\/).*?(\.jpg|\.png|\.gif)/g)[0];
					imageUrl = RegExp(/(http:\/\/|https:\/\/)/).test(imageUrl) ? imageUrl : url + imageUrl;
					
				var imageName = (new Date()).valueOf().toString() + i.toString() + imageUrl.substr(-4, 4);
				
				var tmpImgObj = {
					imageUrl: imageUrl,
					pageUrl: url,
					imageName: imageName,
					imgKeyword: keyword,
					isDownload: false
				}
				imgList.push(tmpImgObj);
			}
			
			return imgList;
		});
}

/**
 * 根据请求回来的url分析出当前页面所有链接
 * @param response body
 * @return linkList[]
 */
Url.prototype.getLinkByBody = function(body) {
	return Promise
		.resolve(body)
		.then(function(body) {
			return body.match(/<a([^>]*)\s*href=('|\")([^'\"]+)('|\")/g).join(',').match(/(http:|https:)\/\/.*?[^"]+/g);
		});
}

/**
 * 获取所有主域名链接
 * @return url[]
 */
Url.prototype.getAllPrimaryLink = function () {
	return new Promise(function(resolve, reject) {
		urlModel.find({parentUrl: null}, function(err, docs) {
			if (err) {
				reject(err);
			}
			resolve(docs);
		})
	})
}

/**
 * 添加一个url
 * @param url
 * @return promise:urlRecord
 */
Url.prototype.createUrl = function (url) {
	return new Promise(function(resolve, reject) {
		var urlRecord = new urlModel({url: url});
		urlRecord.save(function(err, res) {
			if(err) {
				reject(err);
			}
			resolve(urlRecord);
		});
	});
}

/**
 * 获取url的TDK
 * @param urlRecord
 */
Url.prototype.getUrlTDK = function (body) {
	return Promise
		.resolve(body)
		.then(function(body) {
			var title = body.match(/<title>.*?<\/title>/);
				title = title ? title[0].replace('<title>', '').replace('<\/title>', '') : 'not found title';
			var keyword = body.match(/<meta.*?keywords.*?>/);
				keyword = keyword ? keyword[0].match(/content=.*?".*?"/)[0].match(/".*?"/)[0].replace('"', '').replace('"', '') : 'not found keyword';
			var description = body.match(/<meta.*?description.*?>/);
				description = description ? description[0].match(/content=.*?".*?"/)[0].match(/".*?"/)[0].replace('"', '').replace('"', '') : 'not found keyword';

			var rst = {title: title, keyword: keyword, description: description};
			return rst;
		});
}

/**
 * 根据url获取url记录
 */
Url.prototype.getUrlRecord = function (url) {
	return new Promise(function(resolve, reject) {
		urlModel.find({url: url}, function(err, docs) {
			if(err) {
				reject(err);
			}
			resolve(docs);
		})
	});
}

module.exports = new Url();