import * as Express from 'express';

import * as Url from '../modules/url';
import * as Image from '../modules/image';
import { Model as urlModel, ModelInterface as urlModelInterface, PropertyList as urlPropertyList } from '../models/url';
import { Model as imageModel, ModelInterface as imageModelInterface } from '../models/image';

var router = Express.Router();

router.get('/', (req, res, next) => {
	res.send('xxxx');
});

router.get('/robot', (req, res, next) => {
	Url.getAllPrimaryLink()
		.then(docs => {
			res.render('users/index', {url: docs});
		})
		.catch(err => {
			throw new Error(err);
		})
});

router.get('/urlinfo', (req, res, next) => {
	var urlRecord: urlPropertyList;
	var urlSon: urlModelInterface[];
	
	Url.getUrlRecordById(req.query.id)
		.then(record => {
			console.log(record);
			urlRecord = record;
			return Url.getUrlSon(urlRecord.url);
		})
		.then(records => {
			urlSon = records;
			return Image.getUrlImg(urlRecord.url);
		})
		.then(records => {
			console.log(records);
			return res.render('users/urlinfo', {
				urlInfo: urlRecord,
				urlSon,
				urlImg: records
			});
		})
		.catch(err => {
			console.log(err);
		});
});

module.exports = router;