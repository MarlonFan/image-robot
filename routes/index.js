var express = require('express');
var paramValidator = require('../validator/param-validator');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  paramValidator.isNumber('xxx', 'text');
  res.render('index', { title: 'Express' });
});

module.exports = router;
