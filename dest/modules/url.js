var Promise = require('bluebird');
var Request = require('request');
var url_1 = require('../models/url');
function pullPage(url) {
    return new Promise(function (resolve, reject) {
        Request({
            url: url,
            method: 'GET',
            timeout: 20 * 1000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:40.0) Gecko/20100101 Firefox/40.0',
                'Connection': 'keep-alive',
                'Content-Type': 'text/html; charset=utf-8'
            }
        }, function (err, res, body) {
            if (err || res.statusCode != 200) {
                reject(err);
            }
            resolve(body);
        });
    })
        .catch(function (err) {
        throw new Error('pull page error: ' + err);
    });
}
exports.pullPage = pullPage;
function getImgByBody(body, url) {
    return Promise
        .resolve(body)
        .then(function (body) {
        return body.match(/<img([^>]*)\s*src=('|\")([^'\"]+)('|\").*?>/g);
    })
        .then(function (imgStringList) {
        var imgList = [];
        for (var i = 0; i < imgStringList.length; i++) {
            if (!imgStringList[i].match(/(http:\/\/|https:\/\/|\/\/|\/).*?(\.jpg|\.png|\.gif)/g)) {
                continue;
            }
            var keyword = imgStringList[i].match(/alt=".*?"/g) ? imgStringList[i].match(/alt=".*?"/g)[0].replace('alt="', '').replace('"', '') : 'get title failed';
            var imageUrl = imgStringList[i].match(/(http:\/\/|https:\/\/|\/\/|\/).*?(\.jpg|\.png|\.gif)/g)[0];
            imageUrl = RegExp('/(http:\/\/|https:\/\/)/').test(imageUrl) ? imageUrl : url + imageUrl;
            var imageName = (new Date()).valueOf().toString() + i.toString() + imageUrl.substr(-4, 4);
            var tmpImgObj = {
                imageUrl: imageUrl,
                pageUrl: url,
                imageName: imageName,
                imgKeyword: keyword,
                isDownload: false
            };
            imgList.push(tmpImgObj);
        }
        return imgList;
    });
}
exports.getImgByBody = getImgByBody;
function getLinkByBody(body) {
    return Promise
        .resolve(body)
        .then(function (body) {
        return body.match(/<a([^>]*)\s*href=('|\")([^'\"]+)('|\")/g).join(',').match(/(http:|https:)\/\/.*?[^"]+/g);
    })
        .then(function (urlList) {
        var tmpRst = [];
        for (var i = 0; i < urlList.length; i++) {
            var item = urlList[i];
            if (tmpRst.indexOf(item) == -1) {
                tmpRst.push(item);
            }
        }
        return new Promise(function (resolve, reject) {
            url_1.Model.find({ url: { $in: tmpRst } }, function (err, docs) {
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
            });
        });
    });
}
exports.getLinkByBody = getLinkByBody;
function getAllPrimaryLink() {
    return new Promise(function (resolve, reject) {
        url_1.Model.find({ parentUrl: null }, function (err, docs) {
            if (err) {
                reject(err);
                return;
            }
            resolve(docs);
            return;
        });
    });
}
exports.getAllPrimaryLink = getAllPrimaryLink;
function createUrl(url) {
    return new Promise(function (resolve, reject) {
        var urlRecord = new url_1.Model({ url: url });
        urlRecord.save(function (err, res) {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(urlRecord);
                return;
            }
        });
    });
}
exports.createUrl = createUrl;
function getUrlTDK(body) {
    return Promise
        .resolve(body)
        .then(function (body) {
        var tmpTitle = body.match(/<title>.*?<\/title>/);
        var title = tmpTitle ? tmpTitle[0].replace('<title>', '').replace('<\/title>', '') : 'not found title';
        var tmpKeyword = body.match(/<meta.*?keywords.*?>/);
        var keyword = tmpKeyword ? tmpKeyword[0].match(/content=.*?".*?"/)[0].match(/".*?"/)[0].replace('"', '').replace('"', '') : 'not found keyword';
        var tmpDescription = body.match(/<meta.*?description.*?>/);
        var description = tmpDescription ? tmpDescription[0].match(/content=.*?".*?"/)[0].match(/".*?"/)[0].replace('"', '').replace('"', '') : 'not found keyword';
        return { title: title, keyword: keyword, description: description };
    });
}
exports.getUrlTDK = getUrlTDK;
function getUrlRecordByUrl(url) {
    return new Promise(function (resolve, reject) {
        url_1.Model.findOne({ url: url }, function (err, doc) {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(doc);
                return;
            }
        });
    });
}
exports.getUrlRecordByUrl = getUrlRecordByUrl;
function getUrlRecordById(id) {
    return new Promise(function (resolve, reject) {
        url_1.Model.findOne({ _id: id }, function (err, docs) {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(docs);
                return;
            }
        });
    });
}
exports.getUrlRecordById = getUrlRecordById;
function getUrlSon(url) {
    return new Promise(function (resolve, reject) {
        url_1.Model.find({ parentUrl: url }, function (err, docs) {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(docs);
                return;
            }
        });
    });
}
exports.getUrlSon = getUrlSon;
//# sourceMappingURL=url.js.map