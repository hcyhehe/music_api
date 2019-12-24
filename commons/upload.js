const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const tool = require('./tool');
const code = require('./code');
const config = require('../config/setting');


//此上传方式，fileName可自定义
exports.upload = function(req, res) {
    try{
        let form = new formidable.IncomingForm;
		form.keepExtensions = true;
		let uploadFileDir = path.resolve(__dirname, '../') + '/upload/file';

		//先判断文件夹是否存在
		let exist = fs.existsSync(uploadFileDir);
		if(!exist) tool.mkdirsSync(uploadFileDir);

		form.uploadDir = uploadFileDir;
        //console.log('path:'+form.uploadDir);
		form.onComplete = function(err, fields, files) {
			if(err) {
				res.send(JSON.stringify({ msg : '文件上传失败！',error : '文件上传失败!' + err} ));
			} else {
				let fileEntity;
				if(files.imgFile) fileEntity=files.imgFile;
				else if(files.fileToUpload) fileEntity=files.fileToUpload;
				else {
					for(var key in files) {
                        fileEntity=files[key];
                        break;
                    }
				}

				let ext = fileEntity.name.split('.');
				let newName = new Date().getTime() + "." + ext[ext.length - 1];
				let newPath = uploadFileDir + "/" + newName;
				//console.log("newPath " + newPath);
				fs.rename(fileEntity.path, newPath, function(err) {
					if(err)
						res.send({resultCode:'99',msg:'文件上传失败！',});
					else {
						let url = config.domain + "/upload/file/" + newName;
						res.send({resultCode:'0', msg:'文件上传成功！', name:newName, fileurl:url});
					}
				});
			}
		};
		form.parse(req, form.onComplete);
    }catch(e){
        console.log(e);
    }

}


exports.wangUpload = function(req, res) {
    try{
        let form = new formidable.IncomingForm;
		form.keepExtensions = true;
		let uploadFileDir = path.resolve(__dirname, '../') + '/upload/file';

		//先判断文件夹是否存在
		let exist = fs.existsSync(uploadFileDir);
		if(!exist) tool.mkdirsSync(uploadFileDir);

		form.uploadDir = uploadFileDir;
        //console.log('path:'+form.uploadDir);
		form.onComplete = function(err, fields, files) {
			if(err) {
				res.send(JSON.stringify({ msg : '文件上传失败！',error : '文件上传失败!' + err} ));
			} else {
				let fileEntity;
				if(files.imgFile) fileEntity=files.imgFile;
				else if(files.fileToUpload) fileEntity=files.fileToUpload;
				else {
					for(var key in files) {
                        fileEntity=files[key];
                        break;
                    }
				}

				let ext = fileEntity.name.split('.');
				let newName = new Date().getTime() + "." + ext[ext.length - 1];
				let newPath = uploadFileDir + "/" + newName;
				//console.log("newPath " + newPath);
				fs.rename(fileEntity.path, newPath, function(err) {
					if(err)
						res.send({errno:'99',msg:'文件上传失败！',});
					else {
						let url = config.domain + "/upload/file/" + newName;
						let arr = [];
						arr.push(url);
						res.send({errno:'0', data:arr});
					}
				});
			}
		};
		form.parse(req, form.onComplete);

    }catch(e){
        console.log(e);
    }

}


//kindeditor
exports.kindUpload = function(req, res) {
    try{
		var form = new formidable.IncomingForm();
		form.keepExtensions = true;
		form.uploadDir = path.resolve(__dirname, '../') + '/upload/file';
		form.parse(req, function (err, fields, files) {
			if (err) {
				throw err;
			}
			var imgPath = files.imgFile.path;
			var seq = path.sep;  //平台分隔符
			var url = config.domain + '/upload/file' + imgPath.substr(imgPath.lastIndexOf(seq), imgPath.length);
			//console.log(imgPath, seq, url);
			var info = { "error": 0, "url": url };
			console.log(info);
			res.send(info);
		});
	} catch(e) {
		var info = { "error": 1, "message": '' };
		res.send(info);
		console.log(e);
	}
}



exports.public = async function(req, res, next){
    try{
        let url = path.resolve(__dirname, '../') + req.url;
        let exist = fs.existsSync(url);
        if(exist){
            res.sendFile(url);
        } else {
            //console.log(url + ' not exist');
            res.send({"code": 4000004, "msg": code['4000004'] });
		}
	} catch(e) {
		console.log(e);
	}
}
