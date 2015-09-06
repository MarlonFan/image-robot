var Express = require('express');
var Promise = require('bluebird');
var Url = require('../modules/url');
var Image = require('../modules/image');
var paramValidator = require('../validator/param-validator');
var ResJson = require('../modules/core/res-json');
var router = Express.Router();
router.post('/user/robot/add-url', function (req, res, next) {
    var url = req.body.url;
    var urlRecord;
    if (!paramValidator.isUrl(url, 'url', res)) {
        return;
    }
    Url.createUrl(url)
        .then(function (record) {
        urlRecord = record;
        return Url.pullPage(urlRecord.url);
    })
        .then(function (body) {
        return Url.getUrlTDK(body);
    })
        .then(function (pageInfo) {
        urlRecord.urlTitle = pageInfo.title;
        urlRecord.urlKeyword = pageInfo.keyword;
        urlRecord.urlDescription = pageInfo.description;
        return new Promise(function (resolve, reject) {
            urlRecord.save(function (err, res) {
                if (err) {
                    reject(err);
                    return;
                }
                else {
                    resolve(res);
                }
            });
        });
    })
        .then(function () {
        res.json(ResJson.redirectJson(''));
    })
        .catch(function (err) {
        res.json(ResJson.failedJson(JSON.stringify(err)));
    });
});
router.post('/user/urlinfo/get-son-url', function (req, res, next) {
    var url = req.body.url;
    if (!paramValidator.isUrl(url, 'url', res)) {
        return;
    }
    Url.getUrlRecordByUrl(url)
        .then(function (record) {
        return Url.pullPage(record.url);
    })
        .then(function (body) {
        return Url.getLinkByBody(body);
    })
        .map(function (item, index, length) {
        return Url.createUrl(item)
            .then(function (record) {
            record.parentUrl = url;
            record.save();
        });
    })
        .then(function () {
        res.json(ResJson.redirectJson(''));
    });
});
router.post('/user/urlinfo/get-son-img', function (req, res, next) {
    var url = req.body.url;
    if (!paramValidator.isUrl(url, 'url', res)) {
        return;
    }
    Url.getUrlRecordByUrl(url)
        .then(function (record) {
        return Url.pullPage(record.url);
    })
        .then(function (body) {
        return Url.getImgByBody(body, url);
    })
        .then(function (imgInfo) {
        return Image.saveMultipleImage(imgInfo);
    })
        .then(function () {
        res.json(ResJson.redirectJson(''));
    });
});
router.get('/user/download-all-img', function (req, res, next) {
    Image.getAllNotDownloadImage()
        .then(function (records) {
        return Image.downloadAllImage(records, 1);
    })
        .then(function () {
        res.json(ResJson.redirectJson(''));
    });
});
module.exports = router;
//# sourceMappingURL=api.js.map