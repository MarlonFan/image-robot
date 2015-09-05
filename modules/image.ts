import * as Promise from 'bluebird';
import * as Fs from 'fs';
import * as Request from 'request';
import * as Http from 'http';
import * as Io from 'socket.io';

import * as Config from '../config';
import { Model as imageModel, ModelInterface as ImageModelInterface } from '../models/image';

/**
 * 根据一个图片urlList来下载图片
 * @param imageList
 * @param count
 * @return promise:void
 */
export function downloadAllImage(imageList: ImageModelInterface[], count: number) {
	var allNumber: number = imageList.length;
	return Promise
		.resolve(null)
		.then(() => {
			if(imageList.length == 0) {
				return;
			}
			// Io.on('connection', function (socket) {
			// 	var notice = setInterval(function() {
			// 		socket.emit('news', [imageList.length,allNumber]);
			// 		if (imageList.length == 0) {
			// 			clearInterval(notice);
			// 		}
			// 	}, 1)
			// });
			// for(var i = 0; i < count; i++) {
			// 	queueDownloadImage(imageList);
			// }
		});
}

export function queueDownloadImage(imageList: ImageModelInterface[]) {
	if (imageList.length == 0) {
		return;
	}
	
	var imgInfo = imageList.shift();
	
	Request.head(imgInfo.imageUrl, (err, res, body) => {
		var picStream = Fs.createWriteStream(Config.path.downloadImagePath + imgInfo.imageName);
		
		picStream.on('close', err => {
			if (err) {
				console.log(err);
			}
			
			
		})
	})
}