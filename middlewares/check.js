const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const code = require('../commons/code');
const config = require('../config/setting');
const jwtKey = config.jwt_key;
const adminHeader = config.admin_header;
const API_SECRET_KEY = config.API_SECRET_KEY;
const WX_SECRET_KEY = config.WX_SECRET_KEY;


exports.verifyClient = async function (req, res, next){
    try{
        let sign1 = req.query.SIGN || req.body.SIGN;
        let timestamp = req.query.TIMESTAMP || req.body.TIMESTAMP;
        //console.log(sign1, timestamp);

        let md5 = crypto.createHash("md5");
        md5.update((timestamp + API_SECRET_KEY).toLowerCase());
        let sign2 = md5.digest('hex');
        
        if(sign1 != sign2){
            return res.send({"code": 4030001, "msg": code['4030001'] });
        }
        next(); 
    } catch(e) {
        console.log(e);
        res.send({"code": 5000000,"msg": code['5000000'] });
    }
}


exports.authLogin = async function (req, res, next){
    try{
        let header = req.headers[adminHeader];
        try{
            let result = await jwt.verify(header, jwtKey);
        } catch(e) {
            return res.send({"code": 4000002, "msg": code['4000002']});
        }
        next();
    } catch(e) {
        console.log(e);
        res.send({"code": 5000000,"msg": code['5000000'] });
    }
}



exports.verifyWx = async function (req, res, next){
    try{
        let sign1 = req.query.SIGN || req.body.SIGN;
        let timestamp = req.query.TIMESTAMP || req.body.TIMESTAMP;
        //console.log(sign1, timestamp);

        let md5 = crypto.createHash("md5");
        md5.update((timestamp + WX_SECRET_KEY).toLowerCase());
        let sign2 = md5.digest('hex');
        
        if(sign1 != sign2){
            return res.send({"code": 4030001, "msg": code['4030001'] });
        }
        next();
    } catch(e) {
        console.log(e);
        res.send({"code": 5000000,"msg": code['5000000'] });
    }
}




