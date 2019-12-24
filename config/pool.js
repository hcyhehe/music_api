const mysql = require('mysql2/promise'); 
const config = require('./setting.js');


const Pool = mysql.createPool(config.mysql);

exports.query = async function (sql) {
    try{
        let res = await Pool.query(sql);
        return res;
    } catch(e) {
        console.log(e);
    }
}