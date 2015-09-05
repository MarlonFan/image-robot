var express = require('express');
var Q = require('q');
var promisePool = require('promise-pool');

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

router.get('/pool', function(req, res, next) {
     var pool = new promisePool.Pool(function() {
         throw new Error('err 2');
     }, Config.num.queueNumber);
    
     pool.retries = Config.num.errRetryNumber;
    
     for (var i = 0; i < 100; i++) {
         pool.add(i);
     }
    
     pool
         .start(function (progress) {
             if (progress.success) {
                
             }
             else {
                
             }
         })
         .then(function (result) {
             console.log('done');
         });
     res.send('ok!');
});

module.exports = router;
