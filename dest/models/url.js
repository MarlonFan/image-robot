var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var UrlSchema = new Schema({
    url: String,
    urlDescription: String,
    urlKeyword: String,
    parentUrl: String,
    urlTitle: String,
    isDownload: Boolean
});
exports.Model = Mongoose.model('Url', UrlSchema);
//# sourceMappingURL=url.js.map