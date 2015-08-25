var express = require('express');

var Url = require('../modules/url');
var Image = require('../modules/image');
var paramValidator = require('../validator/param-validator');

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

module.exports = router;