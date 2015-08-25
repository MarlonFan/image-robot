var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var request = require('request');
var http = require('http');
var Config = require('../config');

var Image = (function () {
    function Image() {
    }
    return Image;
})();


/**
 * 下载图片
 * @param imageList
 */

Image.prototype.downloadImage = function (imageList) {
	return Promise
		.resolve(imageList)
		.map(function(img, index, length) {
			console.log('本页面' + length + '张图片, 当前采集第' + index + '张');
			request.head(img.imageUrl, function(err, res, body) {
				
				return new Promise(function (resolve, reject) {
					var picStream = fs.createWriteStream(Config.path.downloadImagePath + img.imageName);

					picStream.on('close', function(err) {
						if(err) {
							reject(err);
						}
						resolve();
					});
				
					request(img.imageUrl).pipe(picStream);	
				});
			});
			console.log('第' + index + '张采集完成');
		});
}

module.exports = new Image;