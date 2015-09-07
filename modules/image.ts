import * as Promise from 'bluebird';
import * as Fs from 'fs';
import * as Request from 'request';
import * as Http from 'http';
import * as Io from '../modules/core/socket';

import * as Config from '../config';
import * as Url from './url';
import { Model as imageModel, ModelInterface as ImageModelInterface, PropertyList as imagePropertyList } from '../models/image';


Io.on('connection', function (socket: any) {
	socket.emit('client id', socket.id);
});

/**
 * 根据一个图片urlList来下载图片
 * @param imageList
 * @param count
 * @return promise:void
 */
export function downloadAllImage(imageList: ImageModelInterface[], count: number, clientId: string): Promise<void> {
	var allNumber: number = imageList.length;
	return Promise
		.resolve(null)
		.then(() => {
			if(imageList.length == 0) {
				return;
			}
			
			if (Io.sockets.connected[clientId]) {
				var notice = setInterval(function() {
					Io.sockets.connected[clientId].emit('news', [imageList.length,allNumber]);
					if (imageList.length == 0) {
						clearInterval(notice);
					}
				}, 100)
			}

			for(var i = 0; i < count; i++) {
				queueDownloadImage(imageList);
			}

		});
}

/**
 * 用队列控制并发下载图片
 * @param urlList
 * @return viod
 */
export function queueDownloadImage(imageList: ImageModelInterface[]): void {
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
export function saveMultipleImage(imageList: imagePropertyList[]): Promise<ImageModelInterface> {
	return new Promise<ImageModelInterface>((resolve, reject) => {
		imageModel.create(imageList, (err, res) => {
			if(err) {
				reject(err);
				return;
			} else {
				resolve(res);
				return;
			}			
		})
	});
}

/**
 * 获取所有已下载图片
 */
export function getAllImage(): Promise<ImageModelInterface[]> {
	return new Promise<ImageModelInterface[]>((resolve, reject) => {
		imageModel.find({isDownload: true}, (err, res) => {
			if (err) {
				reject(err);
				return;
			} else {
				resolve(res);
				return;
			}
		});
	});
}

/**
 * 获取所有未下载图片
 */
export function getAllNotDownloadImage(): Promise<ImageModelInterface[]> {
	return new Promise<ImageModelInterface[]>((resolve, reject) => {
		imageModel.find({isDownload: false}, (err, res) => {
			if (err) {
				reject(err);
				return;
			} else {
				resolve(res);
				return;
			}
		});
	});
}

/**
 * 根据url来获取图片列表
 */
export function getUrlImg(url: string): Promise<ImageModelInterface[]> {
	return new Promise<ImageModelInterface[]>((resolve, reject) => {
		imageModel.find({pageUrl: url}, (err, res) => {
			if (err) {
				reject(err);
				return;
			} else {
				resolve(res);
				return;
			}
		});
	});
}

/**
 * 删除所有图片
 */
export function deleteAll(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		imageModel.remove({}, err => {
			if (err) {
				reject(err);
				return;
			}
			resolve(null);
			return;
		})
	})
}

/**
 * 删除指定照片
 * @param imageId: number
 */
export function deleteImageById(id: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		imageModel.remove({_id: id}, err => {
			if (err) {
				reject(err);
				return;
			} else {
				resolve(null);
				return;
			}
		})
	})
}

/**
 * 根据id获取某张图片
 * @param imageId: number
 */
export function getImageRecordById(id: string): Promise<ImageModelInterface> {
	return new Promise<ImageModelInterface>((resolve, reject) => {
		imageModel.findOne({_id: id}, (err, doc) => {
			if (err) {
				reject(err);
				return;
			} else {
				resolve(doc);
				return;
			}
		})
	})
}