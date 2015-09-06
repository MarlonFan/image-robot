var Express = require('express');
var Url = require('../modules/url');
var Image = require('../modules/image');
var router = Express.Router();
router.get('/', function (req, res, next) {
    res.send('xxxx');
});
router.get('/robot', function (req, res, next) {
    Url.getAllPrimaryLink()
        .then(function (docs) {
        res.render('users/index', { url: docs });
    })
        .catch(function (err) {
        throw new Error(err);
    });
});
router.get('/urlinfo', function (req, res, next) {
    var urlRecord;
    var urlSon;
    Url.getUrlRecordById(req.query.id)
        .then(function (record) {
        console.log(record);
        urlRecord = record;
        return Url.getUrlSon(urlRecord.url);
    })
        .then(function (records) {
        urlSon = records;
        return Image.getUrlImg(urlRecord.url);
    })
        .then(function (records) {
        console.log(records);
        return res.render('users/urlinfo', {
            urlInfo: urlRecord,
            urlSon: urlSon,
            urlImg: records
        });
    })
        .catch(function (err) {
        console.log(err);
    });
});
module.exports = router;
//# sourceMappingURL=users.js.map