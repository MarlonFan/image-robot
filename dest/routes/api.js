var express = require('express');

var Url = require('../modules/url');
var Image = require('../modules/image');
var paramValidator = require('../validator/param-validator');
var ResJson = require('../modules/core/res-json');

var router = express.Router();

/**
 * 添加一个url
 */
router.post('/user/robot/add-url', function(req, res, next) {
    var url = req.body.url;
    var urlRecord;
    
    if (!paramValidator.isUrl(url, 'url', res)) {
        return;
    }
        
    Url.createUrl(url)
        .then(function(record) {
            urlRecord = record;
            return record.url;
        })
        .then(function(url) {
            return Url.pullPage(url)
        })
        .then(function(body) {
            return Url.getUrlTDK(body);
        })
        .then(function(pageInfo) {
            urlRecord.urlTitle = pageInfo.title;
            urlRecord.urlKeyword = pageInfo.keyword;
            urlRecord.urlDescription = pageInfo.description;
            urlRecord.save();
            res.json(ResJson.redirectJson(''));                        
        })
        .catch(function(err) {
            res.json(ResJson.failedJson(JSON.stringify(err)));
        });
});

/**
 * 根据一个url抓取他的链接
 */
router.post('/user/urlinfo/get-son-url', function(req, res, next) {
    var url = req.body.url;
   
    if( ! paramValidator.isUrl(url, 'url', res)) {
        return;
    }
    
    Url.getUrlRecordByUrl(url)
        .then(function(urlRecord) {
                return Url.pullPage(urlRecord.url);
            })
            .then(function(body) {
                return Url.getLinkByBody(body);
            })
            .map(function(tmpUrl) {
                return Url.createUrl(tmpUrl)
                    .then(function(record) {
                        record.parentUrl = url;
                        return record.save();     
                    });
            })
            .then(function() {
                res.json(ResJson.redirectJson(''));
            });
});

/**
 * 根据一个url抓取他的图片
 */
router.post('/user/urlinfo/get-son-img', function(req, res, next) {
    var url = req.body.url;
   
    if( ! paramValidator.isUrl(url, 'url', res)) {
        return;
    }
    
    Url.getUrlRecordByUrl(url)
        .then(function(urlRecord) {
                return Url.pullPage(urlRecord.url);
            })
            .then(function(body) {
                return Url.getImgByBody(body, url);
            })
            .then(function(imgInfo) {
                return Image.saveMultipleImage(imgInfo);
            })
            .then(function() {
                res.json(ResJson.redirectJson(''));
            });
});

/**
 * 下载所有未下载的图片
 */
router.get('/user/download-all-img', function(req, res, next) {
    Image.getAllNotDownloadImage()
        .then(function (imgRecords) {
            return Image.downloadAllImage(imgRecords, 1);
        })
        .then(function() {
            res.json(ResJson.redirectJson(''))
        });
});

module.exports = router;