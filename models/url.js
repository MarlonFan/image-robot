var mongoose = require('mongoose');
var mongodb = require('./mongoose');

var Schema = mongoose.Schema;

var UrlSchema = new Schema({
	url: String,
	urlDescription: String,
	urlKeyword: String,
	parentUrl: String,
	urlTitle: String
});

var Url = mongoose.model('Url', UrlSchema);

module.exports = Url;