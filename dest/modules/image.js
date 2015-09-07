var Promise = require('bluebird');
var Fs = require('fs');
var Request = require('request');
var Io = require('../modules/core/socket');
var Config = require('../config');
var image_1 = require('../models/image');
Io.on('connection', function (socket) {
    socket.emit('client id', socket.id);
});
function downloadAllImage(imageList, count, clientId) {
    var allNumber = imageList.length;
    return Promise
        .resolve(null)
        .then(function () {
        if (imageList.length == 0) {
            return;
        }
        if (Io.sockets.connected[clientId]) {
            var notice = setInterval(function () {
                Io.sockets.connected[clientId].emit('news', [imageList.length, allNumber]);
                if (imageList.length == 0) {
                    clearInterval(notice);
                }
            }, 100);
        }
        for (var i = 0; i < count; i++) {
            queueDownloadImage(imageList);
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
    return new Promise(function (resolve, reject) {
        image_1.Model.create(imageList, function (err, res) {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(res);
                return;
            }
        });
    });
}
exports.saveMultipleImage = saveMultipleImage;
function getAllImage() {
    return new Promise(function (resolve, reject) {
        image_1.Model.find({ isDownload: true }, function (err, res) {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(res);
                return;
            }
        });
    });
}
exports.getAllImage = getAllImage;
function getAllNotDownloadImage() {
    return new Promise(function (resolve, reject) {
        image_1.Model.find({ isDownload: false }, function (err, res) {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(res);
                return;
            }
        });
    });
}
exports.getAllNotDownloadImage = getAllNotDownloadImage;
function getUrlImg(url) {
    console.log(url);
    return new Promise(function (resolve, reject) {
        image_1.Model.find({ pageUrl: url }, function (err, res) {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(res);
                return;
            }
        });
    });
}
exports.getUrlImg = getUrlImg;
//# sourceMappingURL=image.js.map