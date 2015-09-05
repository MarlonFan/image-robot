import * as Mongoose from 'mongoose';

var Schema = Mongoose.Schema;

var ImageSchema = new Schema({
	imageUrl: String,
	pageUrl: String,
	imageName: String,
	imgKeyword: String,
	isDownload: Boolean
});

export var Model = Mongoose.model('Image', ImageSchema);

export interface ModelInterface {
	imageUrl?: string;
	pageUrl?: string;
	imageName?: string;
	imgKeyword?: string;
	isDownload?: boolean;
};