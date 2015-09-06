var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var ImageSchema = new Schema({
    imageUrl: String,
    pageUrl: String,
    imageName: String,
    imgKeyword: String,
    isDownload: Boolean
});
exports.Model = Mongoose.model('Image', ImageSchema);
;
//# sourceMappingURL=image.js.map