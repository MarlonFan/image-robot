import * as Express from 'express';

import * as Image from '../modules/image';
import * as Config from '../config';

var router = Express.Router();

router.get('/', function(req, res, next) {
	Image.getAllImage()
		.then(docs => {
			res.render('index', {imgList: docs, filePath: Config.path.downloadImagePath});
		})
		.catch(err => {
			res.send('err');
		})
}); 

module router {} 

export = router;