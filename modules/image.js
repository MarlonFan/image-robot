var Promise = require('bluebird');
var fs = require("fs");
var request = require('request');
var http = require('http');

var Config = require('../config');
var imageModel = require('../models/image');


var Image = (function () {
    function Image() {
    }
    return Image;
})();


/**
 * 根据一个图片urlList来下载图片
 * @param imageList
 * @param count
 * @return promise:void
 */
Image.prototype.downloadAllImage = function (imageList, count) {
	var that = this;
	return Promise
		.resolve(null)
		.then(function() {
			var currentCount = 0;

			if(imageList.length == 0) {
				return;
			}

			if(currentCount >= count) {
				return;
			}

			for(var i = 0; i < count; i++) {
				that.queueDownloadImage(imageList);
			}	
			
		});
}

/**
 * 用队列控制并发下载图片
 * @param urlList
 * @return viod
 */

Image.prototype.queueDownloadImage = function (imageList) {
	var that = this;
	
	if(imageList.length == 0) {
		return;
	}
	
	var imgInfo = imageList.shift();

	request.head(imgInfo.imageUrl, function(err, res, body) {
		var picStream = fs.createWriteStream(Config.path.downloadImagePath + imgInfo.imageName);

		picStream.on('close', function(err) {
			if(err) {
				console.log(err);
			}
			console.log(imgInfo.imageName + ' 下载完成');
			that.queueDownloadImage(imageList);
		});
		request(imgInfo.imageUrl).pipe(picStream);	
	});
}

/**
 * 保存多个image信息
 * @param imgList[];
 * @return promise:void
 */
Image.prototype.saveMultipleImage = function (imageList) {
	return new Promise(function(resolve, reject) {
		imageModel.create(imageList, function(err) {
			if (err) {
				reject(err);
			}
			resolve();
		})
	})
}

/**
 * 获取所有图片
 */
Image.prototype.getAllImage = function () {
	return new Promise(function(resolve, reject) {
		imageModel.find({}, function(err, docs) {
			if(err) {
				reject(err);
			}
			resolve(docs);
		})
	});
}

module.exports = new Image;