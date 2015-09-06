import * as Image from '../modules/image';

Image.getAllNotDownloadImage().then(xxx => {console.log(xxx)}).catch(err => {console.log(err)});