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
var Url = Mongoose.model('Url', UrlSchema);
module.exports = Url;
//# sourceMappingURL=url.js.map