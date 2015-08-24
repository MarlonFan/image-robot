var mongoose = require('mongoose');
var mongodb = require('./index');

var Schema = mongoose.Schema;

var UrlSchema = new Schema({
	url: String,
	parentUrlId: Number,
	UrlDescription: String,
	UrlKeyword: String,
	level: Number,
});

var Url = mongoose.model('Url', UrlSchema);

module.exports = Url;