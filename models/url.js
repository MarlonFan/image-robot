var mongoose = require('mongoose');
var mongodb = require('./index');

var Schema = mongoose.Schema;

var UrlSchema = new Schema({
	url: String,
	UrlDescription: String,
	UrlKeyword: String
});

var Url = mongoose.model('Url', UrlSchema);

module.exports = Url;