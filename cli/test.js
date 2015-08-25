var Url = require('../modules/url');
var Image = require('../modules/image');

var testUrl = 'http://zmlearn.com';

/**
 * 拉取页面测试 and 分析图片测试
 */
 
 
 
// Url.pullPage(testUrl)
// 	.then(function(body) {
// 		return Url.getImgByBody(body, testUrl);
// 	})
// 	.then(function(imgList) {
// 		return Image.downloadAllImage(imgList, 4);
// 	});	


/**
 * 拉取页面测试 and 分析链接测试
 */
 
 

// Url.pullPage(testUrl)
// 	.then(function(body) {
// 		console.log(body);
// 		return Url.getLinkByBody(body);
// 	})
// 	.then(function(linkList) {
// 		console.log(linkList);
// 	});