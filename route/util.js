"use strict";
const mysql=require("mysql");
module.exports.myConnect=function(sql,param,callback){
    let db=mysql.createConnection({
        host:"localhost", //主机地址
        port:"3306",          //端口号
        user:"root",          //用户名
        password:"root",      //密码
        database:"item",   //数据库名称
        dateStrings:true
    });
    //打开链接
    db.connect();
    //发起sql语句
    db.query(sql,param,callback);
    //断开
    db.end();
};
