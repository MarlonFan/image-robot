var mongoose = require('mongoose');
var mongodb = require('./mongoose');

var Schema = mongoose.Schema;

var ConfigSchema = new Schema({
	key: String,
	value: String
});

var Config = mongoose.model('Config', ConfigSchema);

module.exports = Config;