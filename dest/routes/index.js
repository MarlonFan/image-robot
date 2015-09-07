var Express = require('express');
var Image = require('../modules/image');
var Config = require('../config');
var router = Express.Router();
router.get('/', function (req, res, next) {
    Image.getAllImage()
        .then(function (docs) {
        res.render('index', { imgList: docs, filePath: Config.path.downloadImagePath });
    })
        .catch(function (err) {
        res.send('err');
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map