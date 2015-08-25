var mongoose = require('mongoose');
var mongodb = require('./mongoose');

var Schema = mongoose.Schema;

var ImageSchema = new Schema({
	imageUrl: String,
	pageUrl: String,
	imageName: String,
	imgKeyword: String,
	isDownload: Boolean
});

var Image = mongoose.model('Image', ImageSchema);

module.exports = Image;