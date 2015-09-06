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

			// io.on('connection', function (socket) {
			// 	var notice = setInterval(function() {
			// 		socket.emit('news', [imageList.length,allNumber]);
			// 		if (imageList.length == 0) {
			// 			clearInterval(notice);
			// 		}
			// 	}, 1)
			// });

			// for(var i = 0; i < count; i++) {
			// 	that.queueDownloadImage(imageList);
			// }

		});
}

/**
 * 用队列控制并发下载图片
 * @param urlList
 * @return viod
 */
export function queueDownloadImage(imageList: ImageModelInterface[]) {
	if (imageList.length == 0) {
		return;
	}
	
	var imgInfo = imageList.shift();
	
	Request.head(imgInfo.imageUrl, (err, res, body) => {
		var picStream = Fs.createWriteStream(Config.path.downloadImagePath + imgInfo.imageName);
		
		picStream.on('close', (error: any) => {
			if (error) {
				console.log(error);
				return;
			}
			
			imgInfo.isDownload = true;
			imgInfo.save();
			queueDownloadImage(imageList);
		});
		
		Request(imgInfo.imageUrl).pipe(picStream);
	});
}

/**
 * 保存多个image信息
 * @param imgList[];
 * @return promise:void
 */
export function saveMultipleImage(imageList: ImageModelInterface[]) {
	return Promise
		.resolve(imageModel.create(imageList));
}

/**
 * 获取所有已下载图片
 */
export function getAllImage() {
	return Promise
		.resolve(imageModel.find({isDownload: true}));
}

/**
 * 获取所有未下载图片
 */
export function getAllNotDownloadImage() {
	return Promise
		.resolve(imageModel.find({isDownload: false}));
}

/**
 * 根据url来获取图片列表
 */

export function getUrlImg(url: string) {
	return Promise
		.resolve(imageModel.find({url}));
}