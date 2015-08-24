var mongoose = require('mongoose');
var mongodb = require('./index');

var Schema = mongoose.Schema;

var ImageSchema = new Schema({
	imageUrl: String,
	sourceUrlId: Number,
	imgName: String,
	imgKeyword: String,
	isDownload: Boolean
});

var Image = mongoose.model('Image', ImageSchema);

module.exports = Image;