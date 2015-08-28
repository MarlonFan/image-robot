var express = require('express');

var Url = require('../modules/url');
var Image = require('../modules/image');
var paramValidator = require('../validator/param-validator');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/robot', function(req, res, next) {
    
    Url.getAllPrimaryLink()
        .then(function(docs) {
            res.render('users/index', {
                url: docs
            });
        })
        .catch(function (err) {
            throw new Error(err);
        });
});

router.get('/urlinfo', function(req, res, next) {
    
    var urlRecord;
    var urlSon;
    var imageRecords;
    
    if( ! paramValidator.isString(req.query.id, 'id', res)) {
        return;
    }
    
    Url.getUrlRecordById(req.query.id)
        .then(function(record) {
            urlRecord = record;
            return urlRecord;
        })
        .then(function(urlRecord) {
            return Url.getUrlSon(urlRecord.url);
        })
        .then(function(records) {
            urlSon = records;
            return Image.getUrlImg(urlRecord.url);
        })
        .then(function(records) {
            imageRecords = records;
            return res.render('users/urlinfo', {
                urlInfo: urlRecord,
                urlSon: urlSon,
                urlImg: imageRecords
            });
        });
});

module.exports = router;