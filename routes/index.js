var express = require('express');

var Image = require('../modules/image');
var Config = require('../config');
var paramValidator = require('../validator/param-validator');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    Image.getAllImage()
        .then(function(docs) {
            res.render('index', {imgList: docs, filePath: Config.path.downloadImagePath});
        })
        .catch(function(err) {
            res.send('err');
        });
});

module.exports = router;
