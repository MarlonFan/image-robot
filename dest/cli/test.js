var Url = require('../modules/url');
var Image = require('../modules/image');

var testUrl = 'http://zmlearn.com';

Image.getAllImage().then(function(err) {
	console.log(err);
})