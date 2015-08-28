var express = require('express');

var Url = require('../modules/url');
var Image = require('../modules/image');
var paramValidator = require('../validator/param-validator');
var ResJson = require('../modules/core/res-json');

var router = express.Router();

/* GET home page. */
router.get('/get-image', function(req, res, next) {
    var testUrl = 'http://www.douban.com';
    var imgList;
    
    Url.pullPage(testUrl)
        .then(function(body) {
            return Url.getImgByBody(body, testUrl);
        })
        .then(function(list) {
            imgList = list;
            return Image.downloadAllImage(list, 4);
        })
        .then(function() {
            return Image.saveMultipleImage(imgList);
        })
        .then(function() {
            res.send('success');
        })
        .catch(function(err) {
            res.send('failed');
            throw new Error(err);
        })
});

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
})

module.exports = router;