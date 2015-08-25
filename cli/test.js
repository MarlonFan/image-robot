var Url = require('../modules/url');
var Image = require('../modules/image');

var testUrl = 'http://www.meizitu.com/a/2.html';

// console.log('-------------------拉取页面测试和分析图片链接-------------------');
// /**
//  * 拉取页面测试 and 分析图片测试
//  */
// Url.pullPage(testUrl)
// 	.then(function(body) {
// 		return Url.getImgByBody(body, testUrl);
// 	})
// 	.then(function(imgList) {
// 		return Image.downloadAllImage(imgList, 4);
// 	});
	
	
console.log('-------------------拉取页面测试和分析页面链接-------------------');	
/**
 * 拉取页面测试 and 分析链接测试
 */

Url.pullPage(testUrl)
	.then(function(body) {
		console.log(body);
		return Url.getLinkByBody(body);
	})
	.then(function(linkList) {
		console.log(linkList);
	});