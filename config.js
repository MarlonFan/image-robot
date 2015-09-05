var Config = {
	path: {
		downloadImagePath: __dirname + '/public/download-image/',
		cssPath: __dirname + '/public/stylesheets/',
		imagePath: __dirname + '/public/images',
		jsPath: __dirname + '/public/javascripts/'
	},
	num: {
		errRetryNumber: 5,
		queueNumber: 4
	}
}

module.exports = Config;