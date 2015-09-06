var Promise = require('bluebird');
var Fs = require('fs');
var Request = require('request');
var Config = require('../config');
var image_1 = require('../models/image');
function downloadAllImage(imageList, count) {
    var allNumber = imageList.length;
    return Promise
        .resolve(null)
        .then(function () {
        if (imageList.length == 0) {
            return;
        }
    });
}
exports.downloadAllImage = downloadAllImage;
function queueDownloadImage(imageList) {
    if (imageList.length == 0) {
        return;
    }
    var imgInfo = imageList.shift();
    Request.head(imgInfo.imageUrl, function (err, res, body) {
        var picStream = Fs.createWriteStream(Config.path.downloadImagePath + imgInfo.imageName);
        picStream.on('close', function (error) {
            if (error) {
                console.log(error);
                return;
            }
            imgInfo.isDownload = true;
            imgInfo.save();
            queueDownloadImage(imageList);
        });
        Request(imgInfo.imageUrl).pipe(picStream);
    });
}
exports.queueDownloadImage = queueDownloadImage;
function saveMultipleImage(imageList) {
    return Promise
        .resolve(image_1.Model.create(imageList));
}
exports.saveMultipleImage = saveMultipleImage;
function getAllImage() {
    return Promise
        .resolve(image_1.Model.find({ isDownload: true }));
}
exports.getAllImage = getAllImage;
function getAllNotDownloadImage() {
    return Promise
        .resolve(image_1.Model.find({ isDownload: false }));
}
exports.getAllNotDownloadImage = getAllNotDownloadImage;
function getUrlImg(url) {
    return Promise
        .resolve(image_1.Model.find({ url: url }));
}
exports.getUrlImg = getUrlImg;
//# sourceMappingURL=image.js.map