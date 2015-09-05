var Promise = require('bluebird');
var fs = require("fs");
var request = require('request');
var http = require('http');

var Config = require('../config');
var imageModel = require('../models/image');
var io = require('../socket/socket');


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
	var allNumber = imageList.length;
	return Promise
		.resolve(null)
		.then(function() {
			if(imageList.length == 0) {
				return;
			}
			io.on('connection', function (socket) {
				var notice = setInterval(function() {
					socket.emit('news', [imageList.length,allNumber]);
					if (imageList.length == 0) {
						clearInterval(notice);
					}
				}, 1)
			});
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
		var startTime = (new Date()).valueOf();
		var picStream = fs.createWriteStream(Config.path.downloadImagePath + imgInfo.imageName);
		
		picStream.on('close', function(err) {
			if(err) {
				console.log(err);
			}
			
			imgInfo.isDownload = true;
			imgInfo.save();
			
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
 * 获取所有已下载图片
 */
Image.prototype.getAllImage = function () {
	return new Promise(function(resolve, reject) {
		imageModel.find({isDownload: true}, function(err, docs) {
			if(err) {
				reject(err);
			}
			resolve(docs);
		})
	});
}

/**
 * 获取所有未下载图片
 */
Image.prototype.getAllNotDownloadImage = function () {
	return new Promise(function(resolve, reject) {
		imageModel.find({isDownload: false}, function(err, docs) {
			if(err) {
				reject(err);
			}
			resolve(docs);
		})
	});
}

/**
 * 根据url来获取图片列表
 */
Image.prototype.getUrlImg = function(url) {
	return new Promise(function(resolve, reject) {
		imageModel.find({pageUrl: url}, function(err, docs) {
			if(err) {
				reject(err);
			}
			resolve(docs);
		})
	})
}

module.exports = new Image;