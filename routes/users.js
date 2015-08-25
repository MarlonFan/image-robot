var express = require('express');

var Url = require('../modules/url');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/robot', function(req, res, next) {
    var url;
    
    Url.getAllPrimaryLink
    
    
    res.render('users/index', {
        url: 
    });
});

module.exports = router;
