import * as Mongoose from 'mongoose';

var Schema = Mongoose.Schema;

var ImageSchema = new Schema({
	imageUrl: String,
	pageUrl: String,
	imageName: String,
	imgKeyword: String,
	isDownload: Boolean
});

var Image = Mongoose.model('Image', ImageSchema);

module.exports = Image;