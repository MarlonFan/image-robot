import * as Mongoose from 'mongoose';

var Schema = Mongoose.Schema;

var UrlSchema = new Schema({
	url: String,
	urlDescription: String,
	urlKeyword: String,
	parentUrl: String,
	urlTitle: String,
	isDownload: Boolean
});

export var Model = Mongoose.model('Url', UrlSchema);

export interface ModelInterface extends Mongoose.Document {
	url?: string;
	urlDescription?: string;
	urlKeyword?: string;
	parentUrl?: string;
	urlTitle?: string;
	isDownload?: boolean;
}

export interface PropertyList {
	url?: string;
	urlDescription?: string;
	urlKeyword?: string;
	parentUrl?: string;
	urlTitle?: string;
	isDownload?: boolean;
}