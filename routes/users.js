var express = require('express');

var Url = require('../modules/url');

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

module.exports = router;