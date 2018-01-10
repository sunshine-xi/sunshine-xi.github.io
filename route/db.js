"use strict";
const util=require("./util.js");
const AV=require("leanengine");
const fs=require("fs");
//首页
var index=function(req,resp){
    resp.render("index",{
        nickname:req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    });
};
//用户注册跳转
var registed=function(req,resp){
    let username=req.session.username;
    let password=req.session.password;
    console.log(username);
    //1.sql语句 2.参数[] 3.回调函数--执行完sql之后会调用
    let sql="SELECT * FROM userinfo WHERE username=? AND PASSWORD=?";
    let use=[username,password];
    util.myConnect(sql,use,function(err,data){
        if(data==""){
            resp.redirect("login.html");
        }else{
            /*在session中存入用户名*/
            req.session.nickname=data[0].nickname;
            req.session.titleImg=data[0].titleImg;
            req.session.userId=data[0].user_id;
            resp.render("index",{
                nickname:data[0].nickname,
                titleImg:data[0].titleImg,
                userId:data[0].user_id,
                num:req.session.num
            });
        }
    });
};
//注册
var registered=function(req,resp){
    resp.redirect("registered.html");
};
//注册手机号码验证
var checkRegiTel=function(req,resp){
    let phone=req.body.phone;
    let sql="SELECT * FROM userinfo WHERE user_tel in(?)";
    util.myConnect(sql,phone,function(err,data){
        resp.send(data);
    });
};
//重新登录
var relogin=function(req,resp){
    resp.redirect("login.html");
};
//用户登录验证
var checkLogin=function(req,resp){
    let username=req.body.username;
    let password=req.body.password;
    let sql="SELECT * FROM userinfo WHERE username=? AND PASSWORD=?";
    let use=[username,password];
    util.myConnect(sql,use,function(err,data){
        var data=data;
        if(data==""){
            resp.redirect("login.html");
        }else {
            /*在session中存入用户名*/
            req.session.nickname=data[0].nickname;
            req.session.titleImg=data[0].titleImg;
            req.session.userId=data[0].user_id;
            req.session.userIntegral=data[0].integral;
            req.session.address=data[0].chose_privince;
            let sql="SELECT COUNT(*) FROM order_detail,userinfo WHERE order_detail.user_id=userinfo.user_id AND order_detail.order_state=0 AND order_detail.user_id=? GROUP BY order_detail.user_id";
            util.myConnect(sql,[data[0].user_id],function(err,data){
                var num=data;
                if(num==""){
                    req.session.num=0;
                    resp.render("index",{
                        nickname:req.session.nickname,
                        titleImg:req.session.titleImg,
                        userId:req.session.userId,
                        userIntegral:req.session.userIntegral,
                        num:req.session.num
                    });
                    //}
                }else{
                    req.session.num=num[0]["COUNT(*)"];
                    resp.render("index",{
                        nickname:req.session.nickname,
                        titleImg:req.session.titleImg,
                        userId:req.session.userId,
                        userIntegral:req.session.userIntegral,
                        num:req.session.num
                    });
                }
            });
        }
    });
};
//配置短信模块
AV.init({
    appId:"qQHkHANObzExS7rasS7eWYHG-gzGzoHsz",
    appKey:"OOnjKODqDvPBQw07uVI3aouP"
});
//发送登录验证码
var sendMsg=function(req,resp){
    let phone=req.body.phone;
    let sql="SELECT * FROM userinfo WHERE user_tel=?";
    util.myConnect(sql,phone,function(err,data){
        if(data==""){
            resp.redirect("login.html");
        }else{
            /*在session中存入用户名*/
            req.session.nickname=data[0].nickname;
            req.session.titleImg=data[0].titleImg;
            req.session.userId=data[0].user_id;
            AV.Cloud.requestSmsCode({
                mobilePhoneNumber:phone,//接受短信服务的手机号
                name:"登录验证",//服务
                op:"账号登录",//操作
                tt1:10//验证码失效时间，单位：分钟
            }).then(function(data){//短信发送完成后调用
                /*then(1.短信发送成功的函数)，2.短信发送不成功的函数*/
                console.log("发送成功");
            },function(err){
                console.log(err);
                resp.send("发送失败")
            });
        }
    });
};
//验证登录验证码
var checkCode=function(req,resp){
    let phone=req.session.phone=req.body.phone;
    let smscode=req.body.smscode;
    let sql="SELECT * FROM userinfo WHERE user_tel=?";
    console.log(phone+smscode);
    /*调用验证接口：
     * verifySmsCode(1.验证码 2. 手机号)*/
    AV.Cloud.verifySmsCode(smscode,phone).then(function(data){
        util.myConnect(sql,phone,function(err,data){
            var data=data;
            /*在session中存入用户名*/
            req.session.nickname=data[0].nickname;
            req.session.titleImg=data[0].titleImg;
            req.session.userId=data[0].user_id;
            req.session.userIntegral=data[0].integral;
            let sql="SELECT COUNT(*) FROM order_detail,userinfo WHERE order_detail.user_id=userinfo.user_id AND order_detail.order_state=0 AND order_detail.user_id=? GROUP BY order_detail.user_id";
            util.myConnect(sql,[data[0].user_id],function(err,data){
                var num=data;
                if(num==""){
                    req.session.num=0;
                    resp.render("index",{
                        nickname:req.session.nickname,
                        titleImg:req.session.titleImg,
                        userId:req.session.userId,
                        userIntegral:req.session.userIntegral,
                        num:req.session.num
                    });
                    //}
                }else{
                    if(data==""){
                        resp.redirect("login.html");
                    }else{
                        req.session.num=num[0]["COUNT(*)"];
                        resp.render("index",{
                            nickname:req.session.nickname,
                            titleImg:req.session.titleImg,
                            userId:req.session.userId,
                            num:req.session.num
                        });
                    }
                }
            });
        });
    },function(err){
        resp.redirect("login.html");
    })
};
//验证手机登录
var checkTelCode=function(req,resp){
    let phone=req.session.phone;
    let sql="SELECT * FROM userinfo WHERE user_tel=?";
    util.myConnect(sql,phone,function(err,data){
        if(data==""){
            resp.redirect("login.html");
        }else{
            console.log(data);
            /*在session中存入用户名*/
            req.session.nickname=data[0].nickname;
            req.session.titleImg=data[0].titleImg;
            req.session.userId=data[0].user_id;
            resp.render("index",{
                nickname:data[0].nickname,
                titleImg:data[0].titleImg,
                userId:data[0].user_id,
                num:req.session.num
            });
        }
    });
};
//发送注册验证码
var sendRegiMsg=function(req,resp){
    let phone=req.body.phone;
    let sql="SELECT * FROM userinfo WHERE user_tel in(?)";
    util.myConnect(sql,phone,function(err,data){
        if(data==""){
            AV.Cloud.requestSmsCode({
                mobilePhoneNumber:phone,//接受短信服务的手机号
                name:"注册验证",//服务
                op:"账号注册",//操作
                tt1:10//验证码失效时间，单位：分钟
            }).then(function(data){//短信发送完成后调用
                /*then(1.短信发送成功的函数)，2.短信发送不成功的函数*/
                console.log("发送成功");
            },function(err){
                console.log(err);
                resp.send("发送失败")
            });
        }else{
            resp.redirect("login.html");
        }
    });

};
//验证注册验证码
var checkRegiMsg=function(req,resp){
    let phone=req.body.inputAccount;
    let smscode=req.body.infValidation;
    let sql="SELECT * FROM userinfo WHERE user_tel in(?)";
    console.log(phone+smscode);
    AV.Cloud.verifySmsCode(smscode,phone).then(function(data){
        util.myConnect(sql,phone,function(err,data){
            if(data==""){
                let inputAccount=req.session.username=req.body.inputAccount;
                let inputPassword=req.session.password=req.body.inputPassword;
                let sql="INSERT INTO userinfo(username,user_tel,PASSWORD) VALUES(?,?,?)";
                let param=[inputAccount,inputAccount,inputPassword];
                util.myConnect(sql,param,function(err,data){
                    resp.send(data);
                });
            }else{
                resp.send(data);
            }
        });
    },function(err){
        resp.send("验证失败"+err);
    })
};
//注销账户
var deleteUser=function(req,resp){
    //session提供了方法彻底清除，释放内存空间
    req.session.destroy();
    resp.redirect("login.html");
};
//用户中心
var userCenter=function(req,resp){
    let userId= req.session.userId;
    let sql="SELECT *,(SELECT COUNT(*) FROM giftcard WHERE user_id=? GROUP BY user_id) giftNum, (SELECT COUNT(*) FROM voucher WHERE user_id=? GROUP BY user_id) vouNum FROM userinfo WHERE user_id=?";
    util.myConnect(sql,[userId,userId,userId],function(err,data){
        resp.render("userCenter",{
            mydata:data,
            nickname: req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        });
    });
};
//编辑个人信息
var personalInformation=function(req,resp){
    let userId= req.session.userId;
    let sql="SELECT * FROM userinfo WHERE user_id=? ";
    util.myConnect(sql,userId,function(err,data){
        console.log(data);
        resp.render("personalInformation",{
            mydata:data,
            nickname: req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        });
    });
};
//收货地址
var addess=function(req,resp){
    let userId= req.session.userId;
    let sql="SELECT * FROM userinfo,address WHERE userinfo.user_id=? AND userinfo.user_id=address.user_id";
    util.myConnect(sql,userId,function(err,data){
        if(data!=""){
            req.session.addressId=data[0].address_id;
            resp.render("address",{
                mydata:data,
                nickname: req.session.nickname,
                titleImg:req.session.titleImg,
                userId:req.session.userId,
                addressId:req.session.addressId,
                num:req.session.num
            });
        }else{
            resp.render("address",{
                mydata:data,
                nickname: req.session.nickname,
                titleImg:req.session.titleImg,
                userId:req.session.userId,
                addressId:req.session.addressId,
                num:req.session.num
            });
        }
    });
};
//优惠券
var coupons=function(req,resp){
    let userId= req.session.userId;
    let sql="SELECT * FROM userinfo,voucher WHERE userinfo.user_id=? AND userinfo.user_id=voucher.user_id  ";
    util.myConnect(sql,userId,function(err,data){
        console.log(data=="");
        resp.render("coupons",{
            mydata:data,
            nickname: req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        });
    });
};
//绑定优惠券
var addCoupons=function(req,resp){
    let couponsNum= req.body.couponsNum;
    let sql="SELECT * FROM voucher where voucher_id =?";
    util.myConnect(sql,couponsNum,function(err,data){
        if(data!=""){
            let userId= req.session.userId;
            let sql="UPDATE voucher SET user_id =? WHERE  voucher_id=?";
            util.myConnect(sql,[userId,couponsNum],function(err,data){
                //let dname= req.session.nickname;
                let sql="SELECT * FROM userinfo,voucher WHERE userinfo.user_id=? AND userinfo.user_id=voucher.user_id  ";
                util.myConnect(sql,userId,function(err,data){
                    resp.send(data);
                });
            });
        }
    });
};
//代金卡
var giftcard=function(req,resp){
    let userId= req.session.userId;
    let sql="SELECT * FROM userinfo,giftcard WHERE userinfo.user_id=? AND userinfo.user_id=giftcard.user_id  ";
    util.myConnect(sql,userId,function(err,data){
        console.log(data=="");
        resp.render("giftcard",{
            mydata:data,
            nickname: req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        });
    });
};

//添加地址
var addAddress=function(req,resp){
    let userId=req.session.userId;
    let name=req.body.name;
    let address=req.body.addressInf;
    let tel=req.body.tel;
    let sql="INSERT INTO address(user_id, address,address_name,address_tel,address_status) VALUES(?,?,?,?,2)";
    let param=[userId,address,name,tel];
    util.myConnect(sql,param,function(err,data){
        resp.send(data);
    });
};
//删除地址
var deleteAddress=function(req,resp){
    let userId=req.session.userId;
    let address=req.body.addressInf;
    let sql="DELETE FROM  address WHERE address=? AND user_id=?";
    let param=[address,userId];
    console.log(address);
    util.myConnect(sql,param,function(err,data){
        resp.send(data);
    });
};
//修改地址
var updateAddress=function(req,resp){
    let userId=req.session.userId;
    let addressBef=req.body.addressBef;
    let sql="SELECT address_id FROM address WHERE address=? and user_id=?";
    let param=[addressBef,userId];
    util.myConnect(sql,param,function(err,data){
        let dataID=data[0].address_id;
        let address=req.body.addressInf;
        let tel=req.body.tel;
        let sql="UPDATE address SET address =?,address_tel=? WHERE  address_id=?";
        util.myConnect(sql,[address,tel,dataID],function(err,data){
            resp.send(data);
        });

    });
};
//修改默认地址
var settings=function(req,resp){
    let userId=req.session.userId;
    let address=req.body.addressInf;
    let sql="SELECT address_id,address_status FROM address WHERE address=? AND user_id=?";
    let param=[address,userId];
    util.myConnect(sql,param,function(err,data){
        var dataID=data[0].address_id;
        let addressStatus=data[0].address_status;
        let sql="UPDATE address SET address_status =1 WHERE  address_id=? AND address_status=?";
        util.myConnect(sql,[dataID,addressStatus],function(err,data){
            let sql="UPDATE address SET address_status =2 WHERE  address_id NOT IN(?)";
            util.myConnect(sql,[dataID],function(err,data){
                resp.send(data);
            });
        });

    });
};
//修改个人信息
var savePerson=function(req,resp){
    let userId=req.session.userId;
    let name=req.body.name;
    let nickname=req.body.nickname;
    let sex=req.body.sex;
    let email=req.body.email;
    let address=req.body.addressInf;
    let myBirthday=req.body.myBirthday;
    let relation=req.body.relation;
    let birthday=req.body.birthday;
    let product=req.body.product;
    let sql="UPDATE userinfo SET user_name=?,nickname =?,user_sex=?,user_email=?,user_address=?,user_birthday= ?,user_rf_birthday=?,user_favorite=?,user_rf_relation=? WHERE user_id=?";
    let param=[name,nickname,sex,email,address,myBirthday,birthday,product,relation,userId];
    util.myConnect(sql,param,function(err,data){
        let sql="SELECT * FROM userinfo WHERE  user_id=? ";
        util.myConnect(sql,userId,function(err,data){
            req.session.nickname=data[0].nickname;
            req.session.titleImg=data[0].titleImg;
            req.session.userId=data[0].user_id;
            resp.send(data);
        });
    });
};
//忘记密码
var retrievePassword=function(req,resp){
    resp.render("retrievePassword",{
        nickname:req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    });
};
//公告信息
var announcement=function(req,resp){
    resp.render("announcement",{
        nickname:req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    });
};
//发送忘记密码验证码
var sendRePassword=function(req,resp){
    let phone=req.body.phone;
    let sql="SELECT * FROM userinfo WHERE user_tel=?";
    util.myConnect(sql,phone,function(err,data){
        AV.Cloud.requestSmsCode({
            mobilePhoneNumber:phone,//接受短信服务的手机号
            name:"忘记密码",//服务
            op:"忘记密码",//操作
            tt1:10//验证码失效时间，单位：分钟
        }).then(function(data){//短信发送完成后调用
            /*then(1.短信发送成功的函数)，2.短信发送不成功的函数*/
            console.log("发送成功");
        },function(err){
            console.log(err);
            resp.send("发送失败")
        });
    });
};
//忘记密码验证码
var checkTel=function(req,resp){
    let phone=req.body.phone;
    let smscode=req.body.smscode;
    let sql="SELECT * FROM userinfo WHERE user_tel=?";
    console.log(phone+smscode);
    /*调用验证接口：
     * verifySmsCode(1.验证码 2. 手机号)*/
    AV.Cloud.verifySmsCode(smscode,phone).then(function(data){
        resp.send(data);
        //util.myConnect(sql,phone,function(err,data){
        //    let userId=data[0].user_id;
        //    console.log(userId);
        //    let password=req.body.password;
        //    let sql="UPDATE userinfo SET password=?,username=? where user_tel=? and user_id=?";
        //    let param=[password,phone,phone,userId];
        //    util.myConnect(sql,param,function(err,data){
        //       resp.send(data);
        //    });
        //});
    });
};
//忘记密码设置新密码
var setNewPwd=function(req,resp){
    let phone=req.body.phone;
    let sql="SELECT * FROM userinfo WHERE user_tel=?";
    util.myConnect(sql,phone,function(err,data){
        let userId=data[0].user_id;
        let password=req.body.password;
        let sql="UPDATE userinfo SET password=?,username=? where user_tel=? and user_id=?";
        let param=[password,phone,phone,userId];
        util.myConnect(sql,param,function(err,data){
            resp.send(data);
        });
    });
};
//修改密码页面
var changePassword=function(req,resp){
    resp.render("changePassword",{
        nickname:req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    });
};
//修改密码
var changePwd=function(req,resp){
    let userId=req.session.userId;
    let nickname=req.session.nickname;
    let oddPwd=req.body.oddPwd;
    let sql="SELECT PASSWORD FROM userinfo WHERE PASSWORD=? and user_id=? and nickname=?";
    util.myConnect(sql,[oddPwd,userId,nickname],function(err,data){
        console.log(data);
        let newPwd=req.body.newPwd;
        if(data!=""){
            let sql="UPDATE userinfo SET PASSWORD=? WHERE user_id=? and nickname=?";
            util.myConnect(sql,[newPwd,userId,nickname],function(err,data){
                resp.send(data);
            });
        }else {
            resp.send(data);
        }
    });
};

//下午茶
var CreamTea=function(req,resp){
    let sql="SELECT * FROM product WHERE pro_name!=''AND ptype_id=14";
    util.myConnect(sql,[],function(err,data){
        var mydata=data;
        let sql="SELECT * FROM product WHERE pro_name!=''AND ptype_id=13";
        util.myConnect(sql,[],function(err,data){
            var smallcake=data;
            let sql="SELECT * FROM product WHERE pro_name!=''AND ptype_id=12";
            util.myConnect(sql,[],function(err,data){
                var normal=data;
                let sql="SELECT * FROM product WHERE pro_name!=''AND ptype_id=15";
                util.myConnect(sql,[],function(err,data){
                    var coffee=data;
                    resp.render("CreamTea",{
                        mydata:mydata,
                        smallcake:smallcake,
                        normal:normal,
                        coffee:coffee,
                        nickname: req.session.nickname,
                        titleImg:req.session.titleImg,
                        num:req.session.num
                    });
                });
            });
        });
    });
};
var teaCheck=function(req,resp){
    let teaValue=req.body.teaValue;
    let sql;
    if(teaValue=="全部分类"||teaValue=="全部口味"){
        sql="SELECT * FROM product WHERE pro_name!=''AND ptype_id=14";
    }else{
        if(teaValue=="冰淇淋"){
            teaValue="雪糕"
        }
        if(teaValue=="咖啡"){
            teaValue="coffee"
        }
        sql="SELECT * FROM product,product_type WHERE product.ptype_id= product_type.ptype_id AND product.ptype_id=(SELECT ptype_id FROM product_type WHERE ptype_name =?)";
    }
    if(teaValue=="乳脂奶油"||teaValue=="慕斯"||teaValue=="巧克力"||teaValue=="坚果"||teaValue=="水果"||teaValue=="咖啡"){
        sql="SELECT * FROM product WHERE  pro_descript8=? AND (ptype_id=14 OR ptype_id=13 OR ptype_id=12 OR ptype_id=15)";
    }
    util.myConnect(sql,[teaValue],function(err,data){
        resp.send(data);
    })
};
var teaMessage=function(req,resp){
    let name=req.query.name;
    console.log(name);
    let name1=name.split("/");
    console.log(name1[1]);
    let name2=name1[1].split(".");
    let name3="%"+name2[0]+"%";
    console.log(name3);
    let sql="SELECT * FROM product WHERE pro_img LIKE ? ";
    util.myConnect(sql,name3,function(err,data){
        resp.render("creamTeaMessage",{
            mydata:data,
            nickname: req.session.nickname,
            titleImg:req.session.titleImg,
            num:req.session.num
        })
    })
};
//选择城市
var chosePrivince=function(req,resp){
    let privince=req.body.chosePrivince;
    let userId=req.session.userId;
    let sql="UPDATE userinfo SET chose_privince=? WHERE user_id=?";
    util.myConnect(sql,[privince,userId],function(err,data){
        let sql="SELECT * FROM userinfo WHERE user_id=?";
        util.myConnect(sql,[userId],function(err,data){
            req.session.address=data[0].chose_privince;
            resp.render("creamTeaMessage",{
                mydata:data,
                nickname: req.session.nickname,
                titleImg:req.session.titleImg,
                num:req.session.num
            })
        })
    })
};
//上传头像
var uploadImg=function(req,resp){
    let tempPath=req.files.myImg.path;
    let userId=req.session.userId;
    let targetPath="./public/upload/"+req.files.myImg.name;
    fs.createReadStream(tempPath).pipe(fs.createWriteStream(targetPath));
    fs.unlink(tempPath);
    var name="/upload/"+req.files.myImg.name;
    console.log(name);
    let sql="UPDATE userinfo SET titleImg=? WHERE user_id=?";
    util.myConnect(sql,[name,userId],function(err,data){
        let sql="SELECT titleImg FROM userinfo WHERE user_id=?";
        util.myConnect(sql,[userId],function(err,data){
            req.session.titleImg=data[0].titleImg;
            resp.send(name);
        })
    })
};



//========zr=======
var tijiao=function(req,resp){
    let userId=req.session.userId;
    let u_name=req.body.u_name;
    let u_tel=req.body.u_tel;
    let u_text=req.body.u_text;
    let u_time=req.body.u_time;
    let sql="INSERT INTO kecheng(k_name,k_tel,k_kcname,k_time,user_id) VALUES(?,?,?,?,?)";
    util.myConnect(sql,[u_name,u_tel,u_text,u_time,userId],function(err,data){
        let sql="SELECT * FROM kecheng where user_id=?";
        util.myConnect(sql,[userId],function (err,data) {
            resp.send(data);
        })
    })
};

var brandstory=function (req, resp) {
    resp.render("brandstory",{
        nickname:req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    })
};
var baking=function (req, resp) {
    resp.render("baking",{
        nickname:req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    })
};
var play=function (req, resp) {
    resp.render("play",{
        nickname:req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    })
};
var more1=function (req, resp) {
    resp.render("more1",{
        nickname:req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    })
};
var more2=function (req, resp) {
    resp.render("more2",{
        nickname:req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    })
};

var more=function (req, resp) {
    resp.render("more",{
        nickname:req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    })
};

var mores=function (req, resp) {
    let userId=req.session.userId;
    let sql="SELECT * FROM kecheng where user_id=?";
    util.myConnect(sql,[userId],function (err,data) {
        resp.render("mores", {
            mydata: data,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        })
    })
};

var details=function (req, resp) {
    let uesrId=req.session.userId;
    let sql="SELECT *,MIN(o.final_orderid) FROM order_detail o JOIN product p ON o.pro_id=p.pro_id JOIN finalorder a ON o.final_orderid=a.final_orderid WHERE o.user_id=? GROUP BY o.final_orderid";
    util.myConnect(sql,[uesrId],function (err,data) {
        var mydata=data;
        let sql="SELECT *,MIN(o.final_orderid) FROM t_convert o JOIN product p ON o.pro_id=p.pro_id JOIN finalorder a ON o.final_orderid=a.final_orderid WHERE o.user_id=? GROUP BY o.final_orderid";
        util.myConnect(sql,[uesrId],function (err,data) {
            var mydata1=data;
            resp.render("details", {
                mydata: mydata,
                mydata1: mydata1,
                nickname:req.session.nickname,
                titleImg:req.session.titleImg,
                userId:req.session.userId,
                num:req.session.num
            })
        })
    })
};
var Theorder=function (req, resp) {
    let userId=req.session.userId;
    let myid=req.query.pro_id;
    let sql="SELECT * FROM order_detail o JOIN product p ON o.pro_id=p.pro_id JOIN finalorder a ON o.final_orderid=a.final_orderid WHERE o.user_id=? AND o.final_orderid=?";
    util.myConnect(sql,[userId,myid],function (err, data) {
        var mydata=data;
        let sql="SELECT * FROM t_convert o JOIN product p ON o.pro_id=p.pro_id JOIN finalorder a ON o.final_orderid=a.final_orderid WHERE o.user_id=? AND o.final_orderid=?";
        util.myConnect(sql,[userId,myid],function (err, data) {
            var mydata1=data;
            resp.render("Theorder",{
                mydata:mydata,
                mydata1:mydata1,
                nickname:req.session.nickname,
                titleImg:req.session.titleImg,
                userId:req.session.userId,
                num:req.session.num
            })
        })
    })
};

//=========yy=======
var showAll=function(req,resp){
    let sql="select * from product where pro_name!=''and ptype_id!='' and pro_descript=1";
    util.myConnect(sql,[],function(err,data){
        //console.log(data);
        resp.render("cake",{
            cake:data,
            nickname: req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        });
    });
};
var cakeCheck=function(req,resp){
    let cakeValue=req.body.cakeValue;
    let sql;
    if(cakeValue=="全部分类"||cakeValue=="全部口味"){
        sql="select * from product where pro_name!=''and ptype_id!='' and pro_descript=1";
    }else{
        sql="SELECT * FROM product,product_type WHERE product.ptype_id= product_type.ptype_id AND product.ptype_id=(SELECT ptype_id FROM product_type WHERE ptype_name =?)AND product.pro_descript=1";
    }
    util.myConnect(sql,[cakeValue],function(err,data){
        //console.log(data);
        resp.send(data);
    })
};
var message=function(req,resp){
    let name=req.query.name;
    //console.log(name);
    let name1=name.split("/");
    //console.log(name1[1]);
    let name2=name1[1].split(".");
    let name3="%"+name2[0]+"%";
    //console.log(name3);
    let sql="SELECT * FROM product WHERE pro_img LIKE ? ";
    util.myConnect(sql,name3,function(err,data){
        resp.render("cakeMessage",{
            mydata:data,
            banner:data[0].pro_bimg,
            name:data[0].pro_name,
            price:data[0].pro_price,
            pro_simg_one:data[0].pro_simg_one,
            pro_simg_two:data[0].pro_simg_two,
            pro_descript_img_one:data[0].pro_descript_img_one,
            nickname: req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        })
    })
};
var notice=function(req,resp){
    let sesionName=req.session.nickname;
    resp.send(sesionName);
};
var addStory=function(req,resp){
    let userId=req.session.userId;
    let picNam=req.body.picNam;
    let picNam1="%"+picNam+"%";
    let guige=req.body.guige;
    let price=req.body.price;
    let order_state=0;
    let sql="select * from product where pro_name like ?";
    util.myConnect(sql,[picNam1],function(err,data) {
        console.log(data);
        let storyId = data[0].pro_id;
        console.log(storyId);
        let sql = "select * from order_detail where pro_id = ? AND order_state=0 and order_pounds=? and user_id=?";
        util.myConnect(sql, [storyId,guige,userId], function (err, data) {
            console.log(data);
            if (data== "") {
                let sql = "INSERT INTO order_detail (pro_id,order_pounds,order_price,order_state,user_id,order_time) VALUES (?,?,?,?,?,NOW())";
                util.myConnect(sql, [storyId, guige, price, order_state, userId], function (err, data) {
                    console.log(err);
                    resp.send(data);
                })
            } else {
                let sql = "SELECT order_num FROM order_detail WHERE pro_id=? AND order_state=0 and order_pounds=? and user_id=?";
                util.myConnect(sql,[storyId,guige,userId], function (err, data) {
                    let proNum = data[0].order_num + 1;
                    let sql = "UPDATE order_detail SET order_num=? WHERE pro_id=? AND order_state=0 and order_pounds=? and user_id=?";
                    util.myConnect(sql, [proNum,storyId,guige,userId], function (err, data) {
                        console.log(data);
                        resp.send(data);
                    })
                });
            }
        })
    })
};
var addProduct=function(req,resp){
    let userId=req.session.userId;
    let picNam=req.body.picNam;
    let picNam1="%"+picNam+"%";
    let price=req.body.price;
    let guige="1.0磅";
    let order_state=0;
    let sql="select * from product where pro_name like ?";
    util.myConnect(sql,[picNam1],function(err,data) {
        let storyId = data[0].pro_id;
        console.log(storyId);
        let sql = "select * from order_detail where pro_id = ? AND order_state=0 and user_id=?";
        util.myConnect(sql, [storyId,userId], function (err, data) {
            console.log(data);
            if (data== "") {
                let sql = "INSERT INTO order_detail (pro_id,order_pounds,order_price,order_state,user_id,order_time) VALUES (?,?,?,?,?,NOW())";
                util.myConnect(sql, [storyId, guige, price, order_state, userId], function (err, data) {
                    console.log(err);
                    resp.send(data);
                })
            } else {
                let sql = "SELECT order_num FROM order_detail WHERE pro_id=? AND order_state=0 and user_id=?";
                util.myConnect(sql, [storyId,userId], function (err, data) {
                    let proNum = data[0].order_num + 1;
                    let sql = "UPDATE order_detail SET order_num=? WHERE pro_id=? AND order_state=0 and user_id=?";
                    util.myConnect(sql, [proNum,storyId,userId], function (err, data) {
                        console.log(data);
                        resp.send(data);
                    })
                });
            }
        })
    })
};
var addTea=function(req,resp){
    let userId=req.session.userId;
    let picNam=req.body.picNam;
    let picNam1="%"+picNam+"%";
    let price=req.body.price;
    let guige="份";
    let order_state=0;
    let sql="select * from product where pro_name like ?";
    util.myConnect(sql,[picNam1],function(err,data) {
        let storyId = data[0].pro_id;
        console.log(storyId);
        let sql = "select * from order_detail where pro_id = ? AND order_state=0 and user_id=?";
        util.myConnect(sql, [storyId,userId], function (err, data) {
            console.log(data);
            if (data== "") {
                let sql = "INSERT INTO order_detail (pro_id,order_pounds,order_price,order_state,user_id,order_time) VALUES (?,?,?,?,?,NOW())";
                util.myConnect(sql, [storyId, guige, price, order_state, userId], function (err, data) {
                    console.log(err);
                    resp.send(data);
                })
            } else {
                let sql = "SELECT order_num FROM order_detail WHERE pro_id=? AND order_state=0 and user_id=?";
                util.myConnect(sql, [storyId,userId], function (err, data) {
                    let proNum = data[0].order_num + 1;
                    let sql = "UPDATE order_detail SET order_num=? WHERE pro_id=? AND order_state=0 and user_id=?";
                    util.myConnect(sql, [proNum,storyId,userId], function (err, data) {
                        console.log(data);
                        resp.send(data);
                    })
                });
            }
        })
    })
};

//=========lsc
//通过导航返回定制页面
var tiaozhuan=function(req,resp){
    resp.render("customized",{
        nickname: req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    })
};
//定制提交加入数据库
var dingzhitijiao=function(req,resp){
    let chicun=req.body.chicun;
    let customizedName=req.body.zhucailiao+req.body.fuchailiao+req.body.zhuangshi;//通过用户点击获取定制蛋糕名称
    let userId=req.session.userId;//用户Id
    let sql="SELECT * FROM product WHERE pro_name=?";//查询商品Id和价格
    util.myConnect(sql,[customizedName],function(err,data){
        let pro_id=data[0].pro_id;
        let order_price=data[0].pro_price;
        if(chicun==""){
            let price=parseInt(order_price);
            let chicun="1.0磅";
            let sql="INSERT INTO order_detail (user_id,pro_id,order_price,order_time,order_state,order_pounds) VALUES (?,?,?,NOW(),0,?)";
            util.myConnect(sql,[userId,pro_id,price,chicun],function(err,data){
                resp.send(data);
            })
        }else{
            let sql = "select * from order_detail where pro_id = ? AND order_state=0 and order_pounds=? and user_id=?";
            util.myConnect(sql, [pro_id,chicun,userId], function (err, data) {
                console.log(data);
                if (data== "") {
                    let price=parseInt(chicun)*parseInt(order_price);
                    let sql="INSERT INTO order_detail (user_id,pro_id,order_price,order_time,order_state,order_pounds) VALUES (?,?,?,NOW(),0,?)";
                    util.myConnect(sql,[userId,pro_id,price,chicun],function(err,data){
                        resp.send(data);
                    })
                } else {
                    let sql = "SELECT order_num FROM order_detail WHERE pro_id=? AND order_state=0 and order_pounds=? and user_id=?";
                    util.myConnect(sql,[pro_id,chicun,userId], function (err, data) {
                        let proNum = data[0].order_num + 1;
                        let sql ="UPDATE order_detail SET order_num=? WHERE pro_id=? AND order_state=0 and order_pounds=? and user_id=?";
                        util.myConnect(sql, [proNum,pro_id,chicun,userId], function (err, data) {
                            console.log(data);
                            resp.send(data);
                        })
                    });
                }
            })
        }
    })
};
//返回周边页面的所有数据库信息
var tiaozhuan1=function(req,resp){
    let sql="SELECT * FROM periphery_type";//周边类型表
    util.myConnect(sql,[],function(err,data){
        //console.log(data);
        var data1=data;
        let sql="SELECT * FROM yulanimg ";//周边预览信息表
        util.myConnect(sql,[],function(err,data){
            var data2=data;
            let sql="SELECT * from periphery";//周边信息表
            util.myConnect(sql,[],function(err,data){
                console.log(data);
                var data3=data;
                resp.render("periphery",{
                    mydata:data1,
                    mydata1:data2,
                    mydata2:data3,
                    nickname: req.session.nickname,
                    titleImg:req.session.titleImg,
                    userId:req.session.userId,
                    num:req.session.num
                })
            });

        });
    });
};
//周边分类展示信息表
var fenlei=function(req,resp){
    let allCheck=req.body.zz;
    console.log(allCheck)
    console.log(allCheck=="美味甜品")
    let sql;
    if(allCheck=="美味甜品"){
        sql="SELECT * FROM periphery WHERE periphery_typeId=1";
    }else if(allCheck=="精美礼品"){
        sql="SELECT * FROM periphery WHERE periphery_typeId=2";
    }else if(allCheck=="美丽鲜花"){
        sql="SELECT * FROM periphery WHERE periphery_typeId=3";
    }else if(allCheck=="全部周边"){
        sql="SELECT * FROM periphery";
    }
    util.myConnect(sql,[],function(err,data){
        resp.send(data);
    })
};

//周边商品加入购物车
var gouwuche=function(req,resp){
    let peripheryName=req.body.peripheryName;//商品名
    let userId=req.session.userId;//用户编码
    let sql="SELECT * FROM product WHERE pro_name=?";//查询商品编号
    util.myConnect(sql,[peripheryName],function(err,data){
        let pro_id=data[0].pro_id;
        let order_price=data[0].pro_price;
        let order_state=0;
        let sql = "select * from order_detail where pro_id = ? AND order_state=0 and user_id=?";
        util.myConnect(sql, [pro_id,userId], function (err, data) {
            console.log(data);
            if (data== "") {
                let sql="INSERT INTO order_detail (user_id,pro_id,order_price,order_time,order_state,order_pounds) VALUES (?,?,?,NOW(),0,'份')";
                util.myConnect(sql,[userId,pro_id,order_price,order_state],function(err,data){
                    let sql="SELECT COUNT(*) FROM order_detail WHERE user_id=? AND order_state=0 GROUP BY order_detail.user_id";
                    util.myConnect(sql,[userId],function(err,data){
                        var num=data;
                        if(num==""){
                            req.session.num=0;
                            resp.render("gouwuche",{
                                userIntegral:req.session.userIntegral,
                                nickname: req.session.nickname,
                                titleImg:req.session.titleImg,
                                userId:req.session.userId,
                                num:req.session.num
                            });
                        }else{
                            req.session.num=num[0]["COUNT(*)"];
                            resp.render("gouwuche",{
                                userIntegral:req.session.userIntegral,
                                nickname: req.session.nickname,
                                titleImg:req.session.titleImg,
                                userId:req.session.userId,
                                num:req.session.num
                            });
                        }
                    })
                })
            } else {
                let sql = "SELECT order_num FROM order_detail WHERE pro_id=? AND order_state=0 and user_id=?";
                util.myConnect(sql,[pro_id,userId], function (err, data) {
                    let proNum = data[0].order_num + 1;
                    let sql = "UPDATE order_detail SET order_num=? WHERE pro_id=? AND order_state=0 and user_id=?";
                    util.myConnect(sql, [proNum,pro_id,userId], function (err, data) {
                        let sql="SELECT COUNT(*) FROM order_detail WHERE user_id=? AND order_state=0 GROUP BY order_detail.user_id";
                        util.myConnect(sql,[userId],function(err,data){
                            var num=data;
                            if(num==""){
                                req.session.num=0;
                                resp.render("gouwuche",{
                                    userIntegral:req.session.userIntegral,
                                    nickname: req.session.nickname,
                                    titleImg:req.session.titleImg,
                                    userId:req.session.userId,
                                    num:req.session.num
                                });
                            }else{
                                req.session.num=num[0]["COUNT(*)"];
                                resp.render("gouwuche",{
                                    userIntegral:req.session.userIntegral,
                                    nickname: req.session.nickname,
                                    titleImg:req.session.titleImg,
                                    userId:req.session.userId,
                                    num:req.session.num
                                });
                            }
                        })
                    })
                });
            }
        })

    })
};

//===========ryy==============
//兑换页面
var in_exchange=function(req,resp){
    let sql="SELECT * FROM product p JOIN integral i ON i.integral_id = p.integral_id WHERE p.integral_id!=''";
    util.myConnect(sql,[],function(err,data){
        resp.render("convert",{
            mydata:data,
            userIntegral:req.session.userIntegral,
            nickname: req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        })
    })
};
//点击兑换页面的购物车
var convertPro=function(req,resp){
    let convertN=req.body.convertN;//兑换物品的名字
    let convertP=parseInt(req.body.convertP);//兑换的物品的果实币
    let accUser=req.session.userId;//用户编码
    let userIntegral=req.session.userIntegral;//用户的果实币
    let param=[];
    let sql="SELECT convert_total FROM t_convert WHERE convert_state=0 AND user_id=?";
    util.myConnect(sql,[accUser],function(err,data){
        var allTotoal=0;
        for(var i=0;i<data.length;i++){
            allTotoal+=data[i].convert_total;
        }
        var newallTotoal=parseInt(allTotoal)+convertP;
        //console.log(convertN);
        if(userIntegral >= newallTotoal){

            let sql="SELECT * FROM t_convert WHERE pro_id=(SELECT pro_id FROM product WHERE pro_name=?) AND convert_state=0 AND user_id=?";
            util.myConnect(sql,[convertN,accUser],function(err,data){

                //如果data不为空，则兑换订单表中已经有此商品
                //如果data为空，则兑换订单表中没有此商品
                if(data!=""){
                    let conProId=data[0].pro_id;
                    let sql="SELECT conver_num FROM t_convert WHERE pro_id=? AND user_id=?";
                    util.myConnect(sql,[conProId,accUser],function(err,data){
                        let proNum=data[0].conver_num+1;
                        let newTotal=convertP*proNum;
                        let sql="UPDATE t_convert SET conver_num=?,convert_total=? WHERE pro_id=? AND user_id=? AND convert_state=0";
                        util.myConnect(sql,[proNum,newTotal,conProId,accUser],function(err,data){
                            var data=true;
                            resp.send(data);
                        })
                    });
                }else{
                    let sql="SELECT pro_id FROM product WHERE pro_name=?";
                    util.myConnect(sql,[convertN],function(err,data){
                        let conProId=data[0].pro_id;
                        param=[accUser,conProId,convertP];
                        let sql="INSERT INTO t_convert(user_id,pro_id,convert_time,convert_state,convert_total) VALUES(?,?,NOW(),0,?)";
                        util.myConnect(sql,param,function(err,data){
                            var data=true;
                            resp.send(data);
                        })
                    });

                }
            })

        }else{
            resp.send(data);
        }
    });
};
//兑换商品购物车点击加号时
var convertaddNum=function(req,resp){
    let convertNum=req.body.convert_num;
    let convertName=req.body.convert_name;
    let userIntegral=req.session.userIntegral;
    let accUser=req.session.userId;//用户编码
    let sql="SELECT SUM(convert_total) c_allTotalprice FROM t_convert WHERE convert_state=0 AND user_id=?";
    util.myConnect(sql,[accUser],function(err,data){
        let c_allTotalprice=data[0].c_allTotalprice;
        let sql="SELECT i.integral_score,p.pro_id FROM integral i JOIN product p ON p.integral_id=i.integral_id WHERE p.pro_name=?";
        util.myConnect(sql,[convertName],function(err,data){
            let c_perice=data[0].integral_score;
            let pro_id=data[0].pro_id;
            let c_num=parseInt(convertNum)+1;
            let c_total=c_perice*c_num;
            let myallTotalprice=c_allTotalprice+c_perice;
            if(userIntegral >= myallTotalprice){
                let sql="UPDATE t_convert SET conver_num=?,convert_total=? WHERE  pro_id=? AND user_id=?";
                util.myConnect(sql,[c_num,c_total,pro_id,accUser],function(err,data){
                });
                resp.send(data)
            }
            else{
                data="";
                resp.send(data)
            }
        })
    });

};
//点击兑换页面减号
var convertsubNum=function(req,resp){
    let convertName=req.body.c_name;
    let c_Num=req.body.subtract;
    let sql="SELECT i.integral_score,p.pro_id FROM integral i JOIN product p ON p.integral_id=i.integral_id WHERE p.pro_name=?";
    util.myConnect(sql,[convertName],function(err,data){
        let pro_id=data[0].pro_id;
        let c_perice=data[0].integral_score;
        let convertNum=(c_Num-1);
        let c_total=c_perice*convertNum;
        let sql="UPDATE t_convert SET conver_num=?,convert_total=? WHERE  pro_id=?";
        util.myConnect(sql,[convertNum,c_total,pro_id],function(err,data){
            console.log(data);
        });
        resp.send(data)
    })
};

//购物车
var indent=function(req,resp){
    var userId=req.session.userId;//用户编码
    //查询订单表与产品表
    console.log(userId==undefined);
    if(userId==undefined){
        resp.redirect("login.html");
    }else {
        let sql="SELECT * FROM order_detail o JOIN product p ON o.pro_id=p.pro_id JOIN	userinfo u ON u.user_id=o.user_id WHERE o.user_id=? AND o.order_state=0";
        util.myConnect(sql,userId,function(err,data){
            req.session.shoppingL=data.length;
            req.session.myproId=data;
            var buydata=data;
            //查询兑换编与产品表
            let sql="SELECT * FROM t_convert c  JOIN product p ON c.pro_id=p.pro_id JOIN userinfo u ON u.user_id=c.user_id JOIN integral i ON i.integral_id=p.integral_id WHERE c.user_id=? AND c.convert_state=0";
            util.myConnect(sql,userId,function(err,data){
                req.session.conData=data;
                var conData=data;
                let sql="SELECT COUNT(*) FROM order_detail WHERE user_id=? AND order_state=0 GROUP BY order_detail.user_id";
                util.myConnect(sql,userId,function(err,data){
                    var num=data;
                    if(num==""){
                        req.session.num=0;
                        if(buydata==""&&conData==""){
                            resp.render("gouwuche",{
                                nickname:req.session.nickname,
                                userIntegral:req.session.userIntegral,
                                titleImg:req.session.titleImg,
                                userId:req.session.userId,
                                num:req.session.num
                            });
                        }if(buydata!=""||conData!=""){
                            resp.render("gouwuche2",{
                                buydata:buydata,
                                condata:conData,
                                userIntegral:req.session.userIntegral,
                                nickname: req.session.nickname,
                                titleImg:req.session.titleImg,
                                userId:req.session.userId,
                                num:req.session.num
                            })
                        }
                    }else {
                        req.session.num=num[0]["COUNT(*)"];
                        if(buydata==""&&conData==""){
                            resp.render("gouwuche",{
                                nickname:req.session.nickname,
                                userIntegral:req.session.userIntegral,
                                titleImg:req.session.titleImg,
                                userId:req.session.userId,
                                num:req.session.num
                            });
                        }if(buydata!=""||conData!=""){
                            resp.render("gouwuche2",{
                                buydata:buydata,
                                condata:conData,
                                userIntegral:req.session.userIntegral,
                                nickname: req.session.nickname,
                                titleImg:req.session.titleImg,
                                userId:req.session.userId,
                                num:req.session.num
                            })
                        }
                    }
                });
            });
        })
    }
};
//购物车中添加配件
var addAcc=function(req,resp){
    let accName=req.body.addName;//商品名称
    //根据前台传过来的商品名称查询商品的编码
    let sql1="SELECT pro_id FROM product  WHERE pro_name=? AND ptype_id=11";
    util.myConnect(sql1,[accName],function(err,data){
        req.session.accPro=data[0].pro_id;
        resp.send(data);
    })
};
var addAccFor=function(req,resp){
    var accPro=req.body.addProId;
    let myProId=req.session.myproId;
    let accUser=req.session.userId;//用户编码
    let addPrice=req.body.addPrice;
    var kaig=true;
    for(var i=0;i<myProId.length;i++){
        console.log(i+myProId[i].pro_id+accPro);
        if(myProId[i].pro_id==accPro){
            kaig=false;
            break;
        }

    }
    //如果点击的订单编码以存在，则开关为false。
    if(kaig==false){
        let sql="SELECT order_num FROM order_detail WHERE pro_id=? and user_id=?";
        util.myConnect(sql,[accPro,accUser],function(err,data){
            let proNum=data[0].order_num+1;
            let sql="UPDATE order_detail SET order_num=? WHERE pro_id=? and user_id=?";
            util.myConnect(sql,[proNum,accPro,accUser],function(err,data){
                resp.send(data);
            })
        });
    }else{
        let sql="INSERT INTO order_detail(user_id,pro_id,order_price,address_id,order_time,order_state) VALUES(?,?,?,1,NOW(),0)";
        util.myConnect(sql,[accUser,accPro,addPrice],function(err,data){
            //console.log(data);
            resp.send(data);
        });
    }
};

//点击叉叉删除单个订单
var deleteO=function(req,resp){
    let accUser=req.session.userId;//用户编码
    let h_name=req.body.h_name;
    let h_pounds=req.body.h_pounds;
    if(h_pounds==""){
        let sql="DELETE FROM order_detail WHERE pro_id=(SELECT pro_id FROM product WHERE pro_name=?) AND order_state=0 AND user_id=?";
        util.myConnect(sql,[h_name,accUser],function(err,data){
            resp.send(data);
        })
    }else{
        let sql="DELETE FROM order_detail WHERE pro_id=(SELECT pro_id FROM product WHERE pro_name=?) AND order_pounds=? AND order_state=0 AND user_id=?";
        util.myConnect(sql,[h_name,h_pounds,accUser],function(err,data){
            resp.send(data);
        })
    }
};

//在兑换页面点击删除时
var convertdelete=function(req,resp){
    let accUser=req.session.userId;//用户编码
    let h_name=req.body.h_name;
    let sql="DELETE	FROM t_convert WHERE pro_id=(SELECT pro_id FROM product WHERE pro_name=?) AND convert_state=0 AND user_id=?";
    util.myConnect(sql,[h_name,accUser],function(err,data){

    });
};

//删除所有
var deleteAll=function(req,resp){
    let userId=req.session.userId;
    let sql="DELETE	FROM order_detail WHERE user_id=? AND order_state=0";
    util.myConnect(sql,[userId],function(err,data){
        let sql="DELETE	FROM t_convert WHERE user_id=? AND convert_state=0";
        util.myConnect(sql,[userId],function(err,data){
            let sql="SELECT COUNT(*) FROM order_detail WHERE user_id=? AND order_state=0 GROUP BY order_detail.user_id";
            util.myConnect(sql,userId,function(err,data){
                var num=data;
                if(num==""){
                    req.session.num=0;
                    resp.render("gouwuche",{
                        userIntegral:req.session.userIntegral,
                        nickname: req.session.nickname,
                        titleImg:req.session.titleImg,
                        userId:req.session.userId,
                        num:req.session.num
                    });
                }else{
                    req.session.num=num[0]["COUNT(*)"];
                    resp.render("gouwuche",{
                        userIntegral:req.session.userIntegral,
                        nickname: req.session.nickname,
                        titleImg:req.session.titleImg,
                        userId:req.session.userId,
                        num:req.session.num
                    });
                }
            })
        })
    })
};
//结算
var settlement=function(req,resp){
    let userId=req.session.userId;
    let proName=req.body.proName;
    var proBirthCard=req.body.proBirthCard;
    var proNum=req.body.proNum;
    console.log("总结总价")
    var proTotalP=req.body.proTotalP;
    console.log(proTotalP)
    var convert=req.session.conData;
    for(var i=0;i<proName.length;i++){
        let param=[proNum[i],proBirthCard[i],proTotalP[i],proName[i],userId];
        let sql="UPDATE order_detail SET order_num=?,order_birth_card=?,order_total=? WHERE pro_id=(SELECT pro_id FROM product WHERE pro_name=?) AND order_state=0 and user_id=?";
        util.myConnect(sql,param,function(err,data){

        });

    }
    for(var c=0;c<convert.length;c++){
        let c_id=convert[c].pro_id;
        let sql="UPDATE t_convert SET convert_state=1 WHERE pro_id=? AND convert_state=0 and user_id=?";
        util.myConnect(sql,[c_id,userId],function(err,data){

        })
    }
};


//=================ly
//企业专区申请表单验证及加入数据库申请信息
var apply=function(req,resp){
    let companyId=req.body.companyName;
    let companyNum=req.body.number;
    let companyCity=req.body.city;
    let companyAddress=req.body.address;
    let bookname=req.body.bookname;
    let bookphone=req.body.telephone;
    let bookemail=req.body.email;
    let message=req.body.message;
    var ifcompanyNum=/^[0-9]*[1-9][0-9]*$/;
    var ifbookName=/^[\u4e00-\u9fa5]+$/;
    var ifbookphone=/[0-9-()（）]{7,18}/;
    var ifcompanyAddress=/^(?=.*?[\u4E00-\u9FA5])[\d\u4E00-\u9FA5]+/;
    var ifbookemail=/\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
    if(companyId!=''&&ifcompanyNum.test(companyNum)==true&&req.body.city!=0&&
        ifcompanyAddress.test(companyAddress)==true&&
        ifbookName.test(bookname)==true&&ifbookphone.test(bookphone)==true
        &&ifbookemail.test(bookemail)==true
    ){
        let param=[companyId,companyNum,companyCity,companyAddress,bookname,bookphone,bookemail,message];
        let sql = "INSERT INTO companyAdd(company_name,person_Num,company_City,company_Address,Book_name,Book_phone,Book_email,leave_message )  VALUES(?,?,?,?,?,?,?,?)";
        util.myConnect(sql,param,function(err,data){
            //resp.send(data);
            //console.log(err);
        });
        resp.render("success",{
            companyId:companyId,
            companyNum:companyNum,
            companyCity:companyCity,
            companyAddress:companyAddress,
            bookname:bookname,
            bookphone:bookphone,
            bookemail:bookemail,
            message:message,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        });
    }else{
        resp.render("companydetail",{
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        });
    }
};
//申请表修改调整
var applymessage=function(req,resp){
    //console.log("111");
    resp.render("companydetail.ejs",{
        nickname:req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    });
};
//申请确认提交跳转
var applysuccess=function(req,resp){
    let sql="SELECT* FROM product WHERE pro_name LIKE  '%company%' AND ptype_id=1";
    util.myConnect(sql,[],function(err,data){
        resp.render("company.ejs",{
            bannerIMmg1:data[0].pro_simg_one,
            bannerIMmg2:data[0].pro_simg_two,
            companyImg1:data[0].pro_simg_three,
            companyImg2:data[0].pro_bimg,
            companyImg3:data[0].pro_descript_img_one,
            companyImg4:data[0].pro_descript_img_two,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        })
    })
};
//企业专区试吃页面跳转拦截
var companydetail=function(req,resp){
    resp.render("companydetail",{
        nickname:req.session.nickname,
        titleImg:req.session.titleImg,
        userId:req.session.userId,
        num:req.session.num
    })
};
//企业专区蛋糕细节展示拦截
var giftdetailshow=function(req,resp){
    let sql=" SELECT* FROM product WHERE pro_name LIKE  '%企%' AND ptype_id=1";
    util.myConnect(sql,[],function(err,data){
        resp.render("giftdetail",{
            mydata:data,
            backImg:data[0].pro_bimg,
            pro_desImg:data[0].pro_descript_img_one,
            tuijoods1:data[0].pro_descript_img_four,
            tuijoods2:data[0].pro_descript_img_five,
            tuijoods3:data[0].pro_descript_img_six,
            tuijoods4:data[0].pro_descript_img_seven,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        });
    })
};

//专区主页面拦截
var zoneshow=function(req,resp){
    let sql=" SELECT* FROM product WHERE pro_name LIKE  '%zone%' AND ptype_id=1";
    util.myConnect(sql,[],function(err,data){
        resp.render("zone.ejs",{
            bannerIMmg1:data[0].pro_descript_img_one,
            bannerIMmg2:data[0].pro_descript_img_two,
            bannerIMmg3:data[0].pro_descript_img_three,
            zoneImg1:data[0].pro_simg_one,
            zoneImg2:data[0].pro_simg_two,
            zoneImg3:data[0].pro_simg_three,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        })
    })
};
//导航直接跳转生日专区页面拦截
var birthdayshow=function(req,resp){
    let sql=" SELECT* FROM product WHERE pro_name LIKE  '%birthday%'";
    util.myConnect(sql,[],function(err,data){
        resp.render("birthday.ejs",{
            mydata:data,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        });
    })
};
//导航直接跳转企业专区页面拦截
var companyshow=function(req,resp){
    let sql="SELECT* FROM product WHERE pro_name LIKE  '%company%' AND ptype_id=1";
    util.myConnect(sql,[],function(err,data){
        resp.render("company.ejs",{
            bannerIMmg1:data[0].pro_simg_one,
            bannerIMmg2:data[0].pro_simg_two,
            companyImg1:data[0].pro_simg_three,
            companyImg2:data[0].pro_bimg,
            companyImg3:data[0].pro_descript_img_one,
            companyImg4:data[0].pro_descript_img_two,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        })
    })
};
//专区跳转生日产品页面
var birthdayzone=function(req,resp){
    let sql=" SELECT* FROM product WHERE pro_name LIKE  '%birthday%'";
    util.myConnect(sql,[],function(err,data){
        resp.render("birthday.ejs",{
            mydata:data,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        });
    })
};
//专区跳转企业页面
var companyzone=function(req,resp){
    let sql="SELECT* FROM product WHERE pro_name LIKE  '%company%' AND ptype_id=1";
    util.myConnect(sql,[],function(err,data){
        resp.render("company.ejs",{
            bannerIMmg1:data[0].pro_simg_one,
            bannerIMmg2:data[0].pro_simg_two,
            companyImg1:data[0].pro_simg_three,
            companyImg2:data[0].pro_bimg,
            companyImg3:data[0].pro_descript_img_one,
            companyImg4:data[0].pro_descript_img_two,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        })
    })
};
//专区跳转设计师礼品页面
var teacherdesgin=function(req,resp){
    let sql="SELECT * FROM desgingift";
    util.myConnect(sql,[],function(err,data){
        resp.render("teacherdesgin.ejs",{
            mydata:data,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        });
    })
};
//设计师礼品页面商品筛选功能
var desginSearch=function(req,resp){
    let sql="SELECT * FROM desgingift";
    util.myConnect(sql,[],function(err,data){
        //console.log(err);
        resp.send(data);
    });
};
//设计师礼品刷新功能
var desginSearch2=function(req,resp){
    let sql="SELECT * FROM desgingift";
    util.myConnect(sql,[],function(err,data){
        //console.log(err);
        resp.send(data);
    })
};
//设计师礼品详情跳转拦截
var desgingift=function(req,resp){
    let name=req.query.name;
    //console.log(name);
    let name2=name.split("/");
    //console.log(name2[1]);
    let name3=name2[1].split(".");
    //console.log(name3[0]);
    let name4=name3[0].split("m");
    //console.log(name4[1]);
    let name5="%"+name4[1]+"%";
    let sql="SELECT * FROM desgingift df,giftdetail gf WHERE df.giftdetail_id=gf.giftdetail_id AND df.gift_img LIKE ? ";
    util.myConnect(sql,name5,function(err,data){
        resp.render("desgingift.ejs",{
            mydata:data,
            imgBanner:data[0].giftd_banner,
            Name:data[0].giftd_ms,
            Price:data[0].gift_price,
            Num:data[0].giftd_num,
            Time:data[0].giftd_time,
            img1:data[0].giftd_gg_img,
            img2:data[0].giftd_num_img,
            img3:data[0].giftd_time_img,
            gg:data[0].gift_gg,
            ms:data[0].giftd_gg,
            img4:data[0].giftd_img1,
            img5:data[0].giftd_img2,
            img6:data[0].giftd_img3,
            img7:data[0].giftd_img4,
            img8:data[0].giftd_img5,
            img9:data[0].giftd_img6,
            img10:data[0].giftd_img7,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        });
    })
};
//商品推荐
var tjgoods=function(req,resp){
    let name1=req.query.name1;
    //console.log(name1);
    let name2=name1.split("/");
    //console.log(name2[1]);
    let name3=name2[1].split(".");
    //console.log(name3[0]);
    let name4=name3[0].split("y");
    //console.log(name4[1]);
    let name5=parseInt(name4[1]);
    //console.log(typeof name5);
    if(name5==23){
        let sql="SELECT* FROM tuijian WHERE goods_id =1 ";
        util.myConnect(sql,[],function(err,data){
            //console.log(data);
            resp.render("tuijiangoods",{
                //mydata:data
                Imgbanner:data[0].goods_banner,
                name:data[0].goods_name,
                ms1:data[0].goods_ms1,
                ms2:data[0].goods_ms2,
                ms3:data[0].goods_ms3,
                img1:data[0].goods_ms_img1,
                img2:data[0].goods_ms_img2,
                img3:data[0].goods_ms_img3,
                img4:data[0].goods_ms_img4,
                icon1:data[0].goods_icon1,
                icon2:data[0].goods_icon2,
                icon3:data[0].goods_icon3,
                price:data[0].goods_price,
                iconms1:data[0].icon1_ms,
                iconms2:data[0].icon2_ms,
                iconms3:data[0].icon3_ms,
                tujian1:req.session.goods1,
                tujian2:req.session.goods2,
                tujian3:req.session.goods3,
                tujian4:req.session.goods4,
                pongss:req.session.pongs,
                nickname:req.session.nickname,
                titleImg:req.session.titleImg,
                userId:req.session.userId,
                num:req.session.num
            });
        });
    }
    if(name5==24){
        let sql="SELECT* FROM tuijian WHERE goods_id =2 ";
        util.myConnect(sql,[],function(err,data){
            resp.render("tuijiangoods.ejs",{
                //mydata:data
                Imgbanner:data[0].goods_banner,
                name:data[0].goods_name,
                ms1:data[0].goods_ms1,
                ms2:data[0].goods_ms2,
                ms3:data[0].goods_ms3,
                img1:data[0].goods_ms_img1,
                img2:data[0].goods_ms_img2,
                img3:data[0].goods_ms_img3,
                img4:data[0].goods_ms_img4,
                icon1:data[0].goods_icon1,
                icon2:data[0].goods_icon2,
                icon3:data[0].goods_icon3,
                price:data[0].goods_price,
                iconms1:data[0].icon1_ms,
                iconms2:data[0].icon2_ms,
                iconms3:data[0].icon3_ms,
                tujian1:req.session.goods1,
                tujian2:req.session.goods2,
                tujian3:req.session.goods3,
                tujian4:req.session.goods4,
                pongss:req.session.pongs,
                nickname:req.session.nickname,
                titleImg:req.session.titleImg,
                userId:req.session.userId,
                num:req.session.num
            })
        })
    }
    if(name5==25){
        let sql="SELECT* FROM tuijian WHERE goods_id =3 ";
        util.myConnect(sql,[],function(err,data){
            resp.render("tuijiangoods.ejs",{
                //mydata:data
                Imgbanner:data[0].goods_banner,
                name:data[0].goods_name,
                ms1:data[0].goods_ms1,
                ms2:data[0].goods_ms2,
                ms3:data[0].goods_ms3,
                img1:data[0].goods_ms_img1,
                img2:data[0].goods_ms_img2,
                img3:data[0].goods_ms_img3,
                img4:data[0].goods_ms_img4,
                icon1:data[0].goods_icon1,
                icon2:data[0].goods_icon2,
                icon3:data[0].goods_icon3,
                price:data[0].goods_price,
                iconms1:data[0].icon1_ms,
                iconms2:data[0].icon2_ms,
                iconms3:data[0].icon3_ms,
                tujian1:req.session.goods1,
                tujian2:req.session.goods2,
                tujian3:req.session.goods3,
                tujian4:req.session.goods4,
                pongss:req.session.pongs,
                nickname:req.session.nickname,
                titleImg:req.session.titleImg,
                userId:req.session.userId,
                num:req.session.num
            })
        })
    }else if(name5==26){
        let sql="SELECT * FROM tuijian WHERE goods_id =4 ";
        util.myConnect(sql,[],function(err,data){
            resp.render("tuijiangoods.ejs",{
                //mydata:data
                Imgbanner:data[0].goods_banner,
                name:data[0].goods_name,
                ms1:data[0].goods_ms1,
                ms2:data[0].goods_ms2,
                ms3:data[0].goods_ms3,
                img1:data[0].goods_ms_img1,
                img2:data[0].goods_ms_img2,
                img3:data[0].goods_ms_img3,
                img4:data[0].goods_ms_img4,
                icon1:data[0].goods_icon1,
                icon2:data[0].goods_icon2,
                icon3:data[0].goods_icon3,
                price:data[0].goods_price,
                iconms1:data[0].icon1_ms,
                iconms2:data[0].icon2_ms,
                iconms3:data[0].icon3_ms,
                tujian1:req.session.goods1,
                tujian2:req.session.goods2,
                tujian3:req.session.goods3,
                tujian4:req.session.goods4,
                pongss:req.session.pongs,
                nickname:req.session.nickname,
                titleImg:req.session.titleImg,
                userId:req.session.userId,
                num:req.session.num
            })
        });
    }
};
//冰淇淋查看拦截
var teamdetail=function(req,resp){
    let sql="SELECT * FROM product WHERE pro_name LIKE '拿铁冰淇淋' ";
    util.myConnect(sql,[],function(err,data){
        resp.render("teamdetail.ejs",{
            bannerImg:data[0].pro_name,
            name:data[0].pro_name,
            ms1:data[0].pro_descript,
            ms2:data[0].pro_descript1,
            ms3:data[0].pro_descript2,
            ms4:data[0].pro_descript3,
            ms5:data[0].pro_descript4,
            ms6:data[0].pro_descript5,
            ms7:data[0].pro_descript6,
            img1:data[0].pro_simg_two,
            img2:data[0].pro_simg_three,
            img3:data[0].pro_simg__four,
            img4:data[0].pro_bimg,
            price:data[0].pro_price,
            norm:data[0].pro_norm,
            tujian1:req.session.goods1,
            tujian2:req.session.goods2,
            tujian3:req.session.goods3,
            tujian4:req.session.goods4,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        })
    })
};
//生日专区详情查看拦截

var brhgoods=function(req,resp){
    let name=req.query.name;
    //console.log(name);
    let name2=name.split("/");
    //console.log(name2[1]);
    let name3=name2[1].split(".");
    //console.log(name3[0]);
    let name4=name3[0].split("y");
    //console.log(name4[1]);
    let name5="%"+name4[1]+"%";
    let sql=" SELECT* FROM product WHERE pro_name LIKE  '%birthday%' AND pro_bimg LIKE ? ";
    util.myConnect(sql,name5,function(err,data){
        var ourdata=data;
        req.session.goods1=data[0].pro_descript_img_four;
        req.session.goods2=data[0].pro_descript_img_five;
        req.session.goods3=data[0].pro_descript_img_six;
        req.session.goods4=data[0].pro_descript_img_seven;
        let sql="SELECT* FROM pongs";
        util.myConnect(sql,[],function(err,data1){
            req.session.pongs=data1;
            resp.render("brhgoods.ejs",{
                bannerImg:data[0].pro_simg__four,
                ms1:data[0].pro_descript4,
                ms2:data[0].pro_descript5,
                ms3:data[0].pro_descript6,
                ms4:data[0].pro_descript7,
                ms5:data[0].pro_descript1,
                //simg1:data[0].pro_simg_one,
                simg2:data[0].pro_simg_two,
                simg3:data[0].pro_simg_three,
                bprice:data[0].pro_price,
                img1:data[0].pro_descript_img_one,
                img2:data[0].pro_descript_img_two,
                img3:data[0].pro_descript_img_three,
                img4:data[0].pro_descript_img_four,
                img5:data[0].pro_descript_img_five,
                img6:data[0].pro_descript_img_six,
                img7:data[0].pro_descript_img_seven,
                img8:data[0].pro_simg_one,
                img9:data[0].pro_simg_iocn,
                img10:data[0].pro_simg_icon2,
                mydata:data1,
                ourdata:ourdata,
                nickname:req.session.nickname,
                titleImg:req.session.titleImg,
                userId:req.session.userId,
                num:req.session.num
            });
        });
    });
};
//磅数选择
var pongs=function(req,resp){
    let pongs=req.body.pons;
    let sql="SELECT* FROM pongs WHERE ps_price = ? ";
    util.myConnect(sql,pongs,function(err,data){
        resp.send(data);
    });
};

//导航推荐拦截
var recommend=function(req,resp){
    let sql="SELECT * FROM product WHERE pro_name LIKE '%lycake%' ";
    util.myConnect(sql,[],function(err,data){
        //console.log(data[0].pro_price);
        resp.render("recommend",{
            mydata:data,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        })
    })
};

//推荐专区详情查看拦截
var brhgoodss=function(req,resp){
    let name=req.query.name;
    //console.log(name);
    let name2=name.split("/");
    //console.log(name2[1]);
    let name3=name2[1].split(".");
    //console.log(name3[0]);
    let name4=name3[0].split("e");
    //console.log(name4[1]);
    let name5="%"+name4[1]+"%";
    let sql="SELECT* FROM product WHERE pro_name LIKE  '%lycake%' AND pro_bimg LIKE ? ";
    util.myConnect(sql,name5,function(err,data){
        var ourdata=data;
        req.session.goods1=data[0].pro_descript_img_four;
        req.session.goods2=data[0].pro_descript_img_five;
        req.session.goods3=data[0].pro_descript_img_six;
        req.session.goods4=data[0].pro_descript_img_seven;
        let sql="SELECT* FROM pongs";
        util.myConnect(sql,[],function(err,data1){
            req.session.pongs=data1;
            resp.render("brhgoods.ejs",{
                bannerImg:data[0].pro_simg__four,
                ms1:data[0].pro_descript4,
                ms2:data[0].pro_descript5,
                ms3:data[0].pro_descript6,
                ms4:data[0].pro_descript7,
                ms5:data[0].pro_descript1,
                simg2:data[0].pro_simg_two,
                simg3:data[0].pro_simg_three,
                bprice:data[0].pro_price,
                img1:data[0].pro_descript_img_one,
                img2:data[0].pro_descript_img_two,
                img3:data[0].pro_descript_img_three,
                img4:data[0].pro_descript_img_four,
                img5:data[0].pro_descript_img_five,
                img6:data[0].pro_descript_img_six,
                img7:data[0].pro_descript_img_seven,
                img8:data[0].pro_simg_one,
                img9:data[0].pro_simg_iocn,
                img10:data[0].pro_simg_icon2,
                mydata:data1,
                ourdata:ourdata,
                nickname:req.session.nickname,
                titleImg:req.session.titleImg,
                userId:req.session.userId,
                num:req.session.num
            });
        });
    });
};

//生日专区加入购物车（已修改删除描述）
var shopping=function(req,resp){
    let Totalsum=parseInt(req.body.Totalsum);
    //console.log(typeof Totalsum);
    let wg=req.body.wg;
    //console.log(wg);
    let productid=req.body.productid;
    //console.log(productid);
    let name2=productid.split("/");
    //console.log(name2[1]);
    let name3=name2[1].split(".");
    //console.log(name3[0]);
    let name4=name3[0].split("y");
    let name5="%"+name4[1]+"%";
    let number=0;
    let  userId=req.session.userId;
    //console.log(name4[1]);
    //console.log(typeof Totalsum);
    //console.log(typeof wg);
    //console.log(typeof goodsTittle);
    let sql="SELECT * FROM product WHERE pro_name LIKE '%bir%' AND pro_bimg LIKE ? ";
    util.myConnect(sql,name5,function(err,data){
        var  productid=parseInt(data[0].pro_id);
        //console.log(productid);
        //let param=[productid,pangshu];
        let param=[productid,wg,userId];
        let sql="SELECT* FROM order_detail WHERE pro_id = ? AND order_state=0 and order_pounds=? and user_id=?";
        util.myConnect(sql,param,function(err,data){
            if(data!=''){
                let sql="SELECT order_num FROM order_detail WHERE pro_id=? AND order_state=0 and order_pounds=? and user_id=?";
                util.myConnect(sql,[productid,wg,userId],function(err,data){
                    let proNum=data[0].order_num+1;
                    let sql="UPDATE order_detail SET order_num=? WHERE pro_id=? AND order_state=0 and order_pounds=? and user_id=?";
                    util.myConnect(sql,[proNum,productid,wg,userId],function(err,data){
                        resp.send(data);
                    })
                })
            }else{
                let paarm=[productid,wg,Totalsum,number,userId];
                let sql ="INSERT INTO order_detail (pro_id,order_pounds,order_price,order_state,user_id,order_time) VALUES (?,?,?,?,?,NOW())";
                util.myConnect(sql,paarm,function(err,data){
                    resp.send(data);
                })
            }
        });
    })
};
//导航推荐商品加入购物车(已修改)
var tjshopping=function(req,resp){
    let Totalsum=parseInt(req.body.Totalsum);
    //console.log(Totalsum);
    let wg=req.body.wg;
    let pangshu="%"+wg+"%";
    console.log(wg);
    console.log(pangshu);
    let productid=req.body.productid;
    console.log(productid);
    //let name2=productid.split("/");
    //let name3=name2[1].split(".");
    //console.log(name3[0]);
    //let name6="%"+name3[0]+"%";
    //console.log(name6);
    console.log(11111);
    let order_state=0;
    let  userId=req.session.userId;
    let sql="SELECT * FROM product WHERE pro_name LIKE '%lycake%' AND pro_orimg=?";
    util.myConnect(sql,productid,function(err,data){
        var  productid=data[0].pro_id;
        console.log(productid);
        //let param=[productid,pangshu];
        let param=[productid,wg,userId];
        let sql="SELECT* FROM order_detail WHERE pro_id = ? AND order_state=0 and order_pounds=? and user_id=?";
        util.myConnect(sql,param,function(err,data){
            if(data!=''){
                let sql="SELECT order_num FROM order_detail WHERE pro_id=? AND order_state=0 and order_pounds=? and user_id=?";
                util.myConnect(sql,[productid,wg,userId],function(err,data){
                    let proNum=data[0].order_num+1;
                    let sql="UPDATE order_detail SET order_num=? WHERE pro_id=? AND order_state=0 and order_pounds=? and user_id=?";
                    util.myConnect(sql,[proNum,productid,wg,userId],function(err,data){
                        resp.send(data);
                    })
                })
            }else{
                let paarm=[productid,wg,Totalsum,order_state,userId];
                let sql ="INSERT INTO order_detail (pro_id,order_pounds,order_price,order_state,user_id,order_time) VALUES (?,?,?,?,?,NOW())";
                util.myConnect(sql,paarm,function(err,data){
                    resp.send(data)
                })
            }
        });
    })
};
//生日专区商品详情加入购物车功能拦截(已修改)
var Addsee=function(req,resp){
    let money=req.body.money;
    //console.log( money);
    let money2=money.split("/");
    let money3=money2[0].split("￥");
    let money4=parseInt(money3[1]);
    //console.log(money4);
    let pongs=req.body.pongs;
    //console.log(pongs);
    let productId=req.body.productId;
    //console.log(productId);
    let name2=productId.split("/");
    //console.log(name2[1]);
    let name3=name2[1].split(".");
    //console.log(name3[0]);
    let name5="%"+name3[0]+"%";
    let order_state=0;
    let  userId=req.session.userId;
    let sql="SELECT * FROM product WHERE pro_simg__four LIKE ?";
    util.myConnect(sql,name5,function(err,data){
        //console.log(data);
        var  productid=parseInt(data[0].pro_id);
        //console.log(productid);
        let param=[productid,pongs,userId];
        let sql="SELECT* FROM order_detail WHERE pro_id = ? AND order_state=0 and order_pounds=? and user_id=?";
        util.myConnect(sql,param,function(err,data){
            if(data!=''){
                let sql="SELECT order_num FROM order_detail WHERE pro_id=? AND order_state=0 and order_pounds=? and user_id=?";
                util.myConnect(sql,[productid,pongs,userId],function(err,data){
                    let proNum=data[0].order_num+1;
                    let sql="UPDATE order_detail SET order_num=? WHERE pro_id=? AND order_state=0 and order_pounds=? and user_id=?";
                    util.myConnect(sql,[proNum,productid,pongs,userId],function(err,data){
                        resp.send(data);
                    })
                })
            }else{
                let paarm=[productid,pongs,money4,order_state,userId];
                let sql ="INSERT INTO order_detail (pro_id,order_pounds,order_price,order_state,user_id,order_time) VALUES (?,?,?,?,?,NOW())";
                util.myConnect(sql,paarm,function(err,data){
                    resp.send(data)
                });
            }
        });
    })
};

//企业专区蛋糕预订详情页面购物车拦截（已修改）
var  companyAdd=function(req,resp){
    let money=req.body.money;
    console.log( money);
    let money2=money.split("/");
    let money3=money2[0].split("￥");
    let money4=parseInt(money3[1]);
    console.log(money4);
    let pongs=req.body.pongs;
    let productId=req.body.productId;
    console.log(productId);
    let name2=productId.split("/");
    //console.log(name2[1]);
    let name3=name2[1].split(".");
    //console.log(name3[0]);
    let name5="%"+name3[0]+"%";
    let  userId=req.session.userId;
    let order_state=0;
    let sql="SELECT * FROM product WHERE pro_bimg LIKE ?  ";
    util.myConnect(sql,name5,function(err,data){
        //console.log(data);
        var  productid=data[0].pro_id;
        let param=[productid,pongs,userId];
        let sql="SELECT* FROM order_detail WHERE pro_id = ? AND order_state=0 and order_pounds=? and user_id=?";
        util.myConnect(sql,param,function(err,data){
            if(data!=''){
                let sql="SELECT order_num FROM order_detail WHERE pro_id=? AND order_state=0 and order_pounds=? and user_id=?";
                util.myConnect(sql,[productid,pongs,userId],function(err,data){
                    let proNum=data[0].order_num+1;
                    let sql="UPDATE order_detail SET order_num=? WHERE pro_id=? AND order_state=0 and order_pounds=? and user_id=?";
                    util.myConnect(sql,[proNum,productid,pongs,userId],function(err,data){
                        resp.send(data);
                    })
                })
            }else{
                let paarm=[productid,pongs,money4,order_state,userId];
                let sql ="INSERT INTO order_detail (pro_id,order_pounds,order_price,order_state,user_id,order_time) VALUES (?,?,?,?,?,NOW())";
                util.myConnect(sql,paarm,function(err,data){
                    resp.send(data);
                })
            }
        });
    });
};
//设计师礼品详情页面购买
var giftshopping=function(req,resp){
    let money=parseInt(req.body.price);
    //console.log( money);
    let pongs=req.body.guige;
    //console.log(pongs);
    let productId=req.body.productid;
    //console.log(productId);
    let name2=productId.split("/");
    //console.log(name2[1]);
    let name3=name2[1].split(".");
    //console.log(name3[0]);
    let name5="%"+name3[0]+"%";
    let order_state=0;
    let  userId=req.session.userId;
    let sql="SELECT * FROM product WHERE pro_bimg LIKE ?  ";
    util.myConnect(sql,name5,function(err,data){
        var  productid=parseInt(data[0].pro_id);
        let sql="SELECT * FROM order_detail WHERE pro_id = ? AND order_state=0 and user_id=?";
        util.myConnect(sql,[productid,userId],function(err,data){
            if(data!=''){
                let sql="SELECT order_num FROM order_detail WHERE pro_id=? AND order_state=0 and user_id=?";
                util.myConnect(sql,[productid,userId],function(err,data){
                    let proNum=data[0].order_num+1;
                    let sql="UPDATE order_detail SET order_num=? WHERE pro_id=? AND order_state=0 and user_id=?";
                    util.myConnect(sql,[proNum,productid,userId],function(err,data){
                        resp.send(data);
                    })
                });
            }else{
                let paarm=[productid,pongs,money,order_state,userId];
                let sql ="INSERT INTO order_detail (pro_id,order_pounds,order_price,order_state,user_id,order_time) VALUES (?,?,?,?,?,NOW())";
                util.myConnect(sql,paarm,function(err,data){
                    resp.send(data)
                })
            }
        });
    });
};
//设计师礼品主页立即购买拦截
var Adding=function(req,resp){
    let money=req.body.price;
    //console.log( money);
    let money2=money.split("/");
    //console.log(money2);
    let money3=money2[0].split("￥");
    let pongs=money2[1].split("￥")[0];
    let money4=parseInt(money3[1]);
    //console.log(money4);
    let productId=req.body.productid;
    //console.log(productId);
    let name2=productId.split("/");
    //console.log(name2[1]);
    let name3=name2[1].split(".");
    //console.log(name3[0]);
    let name5="%"+name3[0]+"%";
    let order_state=0;
    let  userId=req.session.userId;
    let sql="SELECT * FROM product WHERE pro_simg__four LIKE ?  ";
    util.myConnect(sql,name5,function(err,data){
        var  productid=parseInt(data[0].pro_id);
        //console.log(productid);
        let sql="SELECT * FROM order_detail WHERE pro_id = ? AND order_state=0 and user_id=?";
        util.myConnect(sql,[productid,userId],function(err,data){
            if(data!=''){
                let sql="SELECT order_num FROM order_detail WHERE pro_id=? AND order_state=0 and user_id=?";
                util.myConnect(sql,[productid,userId],function(err,data){
                    let proNum=data[0].order_num+1;
                    let sql="UPDATE order_detail SET order_num=? WHERE pro_id=? AND order_state=0 and user_id=?";
                    util.myConnect(sql,[proNum,productid,userId],function(err,data){
                        resp.send(data);
                    })
                })
            }else{
                let paarm=[productid,pongs,money4,order_state,userId];
                let sql ="INSERT INTO order_detail (pro_id,order_pounds,order_price,order_state,user_id,order_time) VALUES (?,?,?,?,?,NOW())";
                util.myConnect(sql,paarm,function(err,data){
                    resp.send(data);
                })
            }
        });
    });
};
//商品详情页面组合套餐加入购物车(已修改)
var teamprice=function(req,resp){
    let money=req.body.teamSum;
    //console.log( money);
    let money2=money.split("/");
    //console.log(money2);
    let money3=money2[0].split("￥");
    let pongs=money2[1];
    //console.log(pongs);
    let money4=parseInt(money3[1]);
    //console.log(money4);
    let productId=req.body.productid;
    //console.log(productId);
    let name2=productId.split("/");
    //console.log(name2[1]);
    let name3=name2[1].split(".");
    //console.log(name3[0]);
    let name5="%"+name3[0]+"%";
    let order_state=0;
    let  userId=req.session.userId;
    let sql="SELECT * FROM product WHERE pro_simg_two LIKE ?  ";
    util.myConnect(sql,name5,function(err,data){
        var  productid=parseInt(data[0].pro_id);
        //console.log(productid);
        let paarm=[productid,pongs,money4,order_state,userId];
        let sql ="INSERT INTO order_detail (pro_id,order_pounds,order_price,order_state,user_id,order_time) VALUES (?,?,?,?,?,NOW())";
        util.myConnect(sql,paarm,function(err,data){
            resp.send(data)
        })
    });
};

//组合商品详情页面加入购物车
var teamdetailing=function(req,resp){
    let money=parseInt(req.body.price);
    //console.log( money);
    let pongs=req.body.guige;
    //console.log(pongs);
    let productId=req.body.productid;
    //console.log(productId);
    let name2=productId.split("/");
    //console.log(name2[1]);
    let name3=name2[1].split(".");
    //console.log(name3[0]);
    let name5="%"+name3[0]+"%";
    let order_state=0;
    let  userId=req.session.userId;
    let sql="SELECT * FROM product WHERE pro_name LIKE ?  ";
    util.myConnect(sql,name5,function(err,data){
        var  productid=parseInt(data[0].pro_id);
        //console.log(productid);
        let paarm=[productid,pongs,money,order_state,userId];
        let sql ="INSERT INTO order_detail (pro_id,order_pounds,order_price,order_state,user_id,order_time) VALUES (?,?,?,?,?,NOW())";
        util.myConnect(sql,paarm,function(err,data){
            resp.send(data);
        })
    });
};

//ly结束；


//hyp
//配送信息页面加载初始化显示一个默认地址
var peisong=function(req,resp){
    let userId=req.session.userId;
    let sql1="SELECT COUNT(*) AS address_nums FROM address WHERE user_id=?";
    util.myConnect(sql1,userId,function(err,data){
        let data1=data;
        let sql3="SELECT COUNT(*) AS youhui_nums FROM voucher WHERE user_id=? AND voucher_status='待使用'";
        util.myConnect(sql3,userId,function(err,data){
            let data3=data;
            let sql4="SELECT * FROM voucher WHERE user_id=? AND voucher_status='待使用'";
            util.myConnect(sql4,userId,function(err,data){
                let data4=data;
                let sql5="select * from order_detail orsder1 LEFT join product product1 on orsder1.pro_id=product1.pro_id where order_state=0 and user_id=?";
                util.myConnect(sql5,userId,function(err,data){
                    let data5=data;
                    console.log(data5);
                    let sql8="select SUM(order_total) AS totalprice from order_detail orsder1 LEFT join product product1 on orsder1.pro_id=product1.pro_id where order_state=0 and user_id=?";
                    util.myConnect(sql8,userId,function(err,data){
                        let data8=data;
                        let sql6="SELECT * FROM userinfo WHERE user_id=?;";
                        util.myConnect(sql6,userId,function(err,data){
                            let data6=data;
                            let sql7="SELECT * FROM t_convert dh  LEFT JOIN product pd2 ON dh.pro_id=pd2.pro_id LEFT JOIN integral jf1 ON jf1.integral_id=pd2.integral_id WHERE user_id=? AND dh.convert_state=1";
                            util.myConnect(sql7,userId,function(err,data){
                                let data7=data;
                                let sql9="SELECT SUM(integral_score) AS totalgb FROM t_convert dh  LEFT JOIN product pd2 ON dh.pro_id=pd2.pro_id LEFT JOIN integral jf1 ON jf1.integral_id=pd2.integral_id WHERE user_id=? AND dh.convert_state=1;";
                                util.myConnect(sql9,userId,function(err,data){
                                    let data9=data;
                                    let sql="SELECT * FROM address WHERE user_id=?;";// AND address_status=1
                                    util.myConnect(sql,userId,function(err,data){
                                        let data2=data;
                                        resp.render("peisongxinxi",{
                                            mydata:data2, //默认地址的信息
                                            mydata1:data1, //地址的总数
                                            mydata3:data3, //优惠券的总数
                                            mydata4:data4,//展开的优惠券
                                            data5:data5, //订单详情展示
                                            data6:data6, //用户信息表
                                            data7:data7, //积分兑换的商品展示
                                            data8:data8,//页面加载时显示的总价
                                            data9:data9,//页面加载时有积分兑换的总个数
                                            nickname:req.session.nickname,
                                            titleImg:req.session.titleImg,
                                            userId:req.session.userId,
                                            num:req.session.num
                                        });
                                    });
                                })
                            });
                        });
                    });
                })
            });
        });
    });
};

//切换地址模态框加载时添加数据库的地址
var qhadress=function(req,reps){
    let userId=req.session.userId;
    let sql="SELECT * FROM address WHERE user_id=? AND address_status=2;";
    util.myConnect(sql,userId,function(err,data){
        reps.send(data)
    })
};

//确认修改默认地址
var xiugaimoren=function(req,resp){
    let h_dressid=req.query.h_dressid;
    let sql1="SELECT * FROM address WHERE address_id=?";
    util.myConnect(sql1,h_dressid,function(err,data){
        resp.send(data)
    });
};

//添加地址
var tiajiadizhi=function(req,resp) {
    let userId = req.session.userId;
    console.log(req.body);
    let h_addizhi = req.body.city + req.body.location + req.body.Detailed_address;
    let h_gxmoren = req.body.h_gxmoren;
    console.log(h_gxmoren);
    if (h_gxmoren == 1) {
        let sql = "UPDATE address SET address_status=2 WHERE user_id=? AND address_status=1;";
        util.myConnect(sql, userId, function (err, data) {
            let sql2 = "INSERT INTO address (user_id,address,address_status,address_tel,address_name) VALUES(?,?,?,?,?)";
            util.myConnect(sql2, [req.session.userId, h_addizhi, h_gxmoren, req.body.contact_way, req.body.shoujianren], function (err,data) {
                resp.send(data)
            })
        });
    }
    else if(h_gxmoren!=1) {
        console.log(h_addizhi);
        let sql = "INSERT INTO address (user_id,address,address_status,address_tel,address_name) VALUES(?,?,?,?,?)";
        util.myConnect(sql, [userId, h_addizhi, 2, req.body.contact_way, req.body.shoujianren], function (err,data) {
            resp.send(data)
        })
    }
};

//添加优惠券
var addyouhuiquan=function(req,resp){
    let userId=req.session.userId;
    let myyhno=req.body.yhuino;
    let sql1="SELECT COUNT(*) AS yhidno FROM voucher WHERE voucher_id=? AND voucher_status='待使用' AND ISNULL(user_id)=1";
    util.myConnect(sql1,myyhno,function(err,data){
        console.log(data[0].yhidno);
        if(data[0].yhidno<=0){
            resp.send(data)
        }
        else {
            let sql2 = "UPDATE voucher SET user_id=? WHERE voucher_id=?";
            util.myConnect(sql2,[userId,myyhno],function(err,data){
                let sql3="SELECT * FROM voucher WHERE voucher_id=?";
                util.myConnect(sql3,[myyhno],function(err,data){
                    resp.send(data)
                })
            })
        }
    })
};

//添加代金卡
var h_tjgoldcard=function(req,resp){
    let hcar_no=req.body.hcar_no;//代金卡号
    let hcar_pwd=req.body.hcar_pwd;//密码
    let userId=req.session.userId;
    let sql="SELECT COUNT(*) AS giftcard_nums FROM giftcard WHERE giftCard_status='未使用' AND giftCard_id=? AND giftCard_pwd=?";
    util.myConnect(sql,[hcar_no,hcar_pwd],function(err,data){
        if(data[0].giftcard_nums<=0){
            resp.send(data)
        }
        else{
            let sql1="UPDATE giftcard SET user_id=? WHERE giftCard_id=?";
            util.myConnect(sql1,[userId,hcar_no],function(err,data){
                let sql2="SELECT * FROM giftcard WHERE giftCard_id=?";
                util.myConnect(sql2,hcar_no,function(err,data){
                    console.log(data);
                    console.log(9696969);
                    resp.send(data)
                })
            })
        }
    })
};

//确定使用金卡
var giftsure=function(req,resp){
    let h_giftid=req.body.h_giftid;
    let sql="UPDATE giftcard SET giftCard_status='已使用' WHERE giftCard_id=?";
    util.myConnect(sql,h_giftid,function(err,data){
        let sql1="SELECT giftCard_money FROM giftcard WHERE giftCard_id=?";
        util.myConnect(sql1,h_giftid,function(err,data){
            resp.send(data)
        })
    })
};

//下单结算
var h_jiesuan=function(req,resp){
    let userId=req.session.userId;
    let xz_payway=req.body.xz_payway;//选择支付方式的编码1、在线支付，2、货到付款，3、货到刷卡
    let h_liuyan=req.body.h_liuyan;//留言
    let userdress=req.body.userdress;//收件地址
    let h_date=req.body.h_date;//配送日期
    let h_time=req.body.h_time;//配送时间



    let h_psway=req.body.h_psway;//配送方式
    let youhuimoney=req.body.youhuimoney;//本次订单优惠的金额
    let totalmoney=req.body.totalmoney;//总价
    let shouhuoname=req.body.shouhuoname;//收货人姓名
    let shouhuotel=req.body.shouhuotel;  //收货人电话
    let nowyhid=req.body.nowyhid;//使用了的优惠券的编码
    let h_sygsb=req.body.h_sygsb;//使用了的果实币
    //向最终订单表添加数据
    let sql="INSERT INTO finalorder (psway,final_orderid,senddate,sendtime,payway,message,user_id,totalmoney,phone,username,userdress,youhuimoney,finalorder_status)VALUES (?,NULL,?,?,?,?,?,?,?,?,?,?,2);";
    util.myConnect(sql,[h_psway,h_date,h_time,xz_payway,h_liuyan,userId,totalmoney,shouhuotel,shouhuoname,userdress,youhuimoney],function(err,data){
        let userId=req.session.userId;

        //把购物车订单表的订单数据状态改为2，已下单
        let sql1="UPDATE order_detail SET order_state=2 WHERE user_id=? AND order_state='0'";
        util.myConnect(sql1,[userId],function(err,data){
            let userId=req.session.userId;
            //把积分兑换订单表的订单数据状态改为2，已下单
            let sql8="UPDATE t_convert SET convert_state=2 WHERE user_id=? AND convert_state='1'";
            util.myConnect(sql8,userId,function(err,data){
                let userId=req.session.userId;
                //找出最终订单表里面的信息（订单标号。。。）
                let sql2="SELECT * FROM finalorder WHERE user_id=? AND finalorder_status=2 ORDER BY final_orderid DESC LIMIT 0,1";
                util.myConnect(sql2,[userId],function(err,data){
                    console.log(data)
                    let final_orderid=data[0].final_orderid;
                    //向积分兑换里面的商品添加订单编号
                    let sql7="UPDATE t_convert SET final_orderid=? WHERE user_id=? AND convert_state=2";
                    util.myConnect(sql7,[final_orderid,userId],function(err,data){
                        if(nowyhid!=null){
                            let sql5="UPDATE voucher SET voucher_status='已使用' WHERE user_id=? AND voucher_id=?";
                            util.myConnect(sql5,[userId,nowyhid],function(err,data){
                                //向购物车里面的商品添加订单编号
                                let sql3="UPDATE order_detail SET final_orderid=? WHERE user_id=? AND order_state=2 and final_orderid IS NULL";
                                util.myConnect(sql3,[final_orderid,userId],function(err,data){
                                    console.log(data);
                                    resp.send(data)
                                });
                            })
                        }else if(h_sygsb>=0){
                            let sql6="UPDATE userinfo SET integral=? WHERE user_id=?";
                            util.myConnect(sql6,[h_sygsb,userId],function(err,data){
                                let sql3="UPDATE order_detail SET final_orderid=? WHERE user_id=? AND order_state=2 and final_orderid IS NULL";
                                util.myConnect(sql3,[final_orderid,userId],function(err,data){
                                    resp.send(data)
                                });
                            })
                        }else if(nowyhid!=null && h_sygsb>=0){
                            let sql5="UPDATE voucher SET voucher_status='已使用' WHERE user_id=? AND voucher_id=?";
                            util.myConnect(sql5,[userId,nowyhid],function(err,data){
                                let sql6="UPDATE userinfo SET integral=? WHERE user_id=?";
                                util.myConnect(sql6,[h_sygsb,userId],function(err,data){
                                    let sql3="UPDATE order_detail SET final_orderid=? WHERE user_id=? AND order_state=2 and final_orderid IS NULL";
                                    util.myConnect(sql3,[final_orderid,userId],function(err,data){
                                        resp.send(data)
                                    });
                                })
                            })
                        }else{
                            let sql3="UPDATE order_detail SET final_orderid=? WHERE user_id=? AND order_state=2 and final_orderid IS NULL";
                            util.myConnect(sql3,[final_orderid,userId],function(err,data){
                                resp.send(data)
                            });
                        }
                    });
                })
            });
        })
    })
};
var ordersuccess=function(req,resp){
    let userId=req.session.userId;
    let sql="SELECT * FROM  finalorder WHERE user_id=? ORDER BY final_orderid DESC LIMIT 0,1";
    util.myConnect(sql,userId,function(err,data){
        if(data[0].payway=="在线支付"){
            resp.render("payway_page", {
                mydata:data,
                nickname:req.session.nickname,
                titleImg:req.session.titleImg,
                userId:req.session.userId,
                num:req.session.num
            })
        }
        else{
            resp.render("h_order", {
                mydata:data,
                nickname:req.session.nickname,
                titleImg:req.session.titleImg,
                userId:req.session.userId,
                num:req.session.num
            })
        }
    })
};

var zhifubao=function(req,resp){
    let userId=req.session.userId;
    let sql="SELECT * FROM  finalorder WHERE user_id=? ORDER BY final_orderid DESC LIMIT 0,1";
    util.myConnect(sql,userId,function(err,data){
        var mydata=data;
        let sql="SELECT COUNT(*) FROM order_detail,userinfo WHERE order_detail.user_id=userinfo.user_id AND order_detail.order_state=0 AND order_detail.user_id=? GROUP BY order_detail.user_id";
        util.myConnect(sql,userId,function(err,data){
            var num=data;
            if(num==""){
                req.session.num=0;
                resp.render("z_payindex",{
                    mydata:mydata,
                    nickname:req.session.nickname,
                    titleImg:req.session.titleImg,
                    userId:req.session.userId,
                    num:req.session.num
                })
            }else{
                req.session.num=num[0]["COUNT(*)"];
                resp.render("z_payindex",{
                    mydata:mydata,
                    nickname:req.session.nickname,
                    titleImg:req.session.titleImg,
                    userId:req.session.userId,
                    num:req.session.num
                })
            }
        });
    })
};

var weixinzhifu=function(req,resp){
    let userId=req.session.userId;
    let sql="SELECT * FROM  finalorder WHERE user_id=? ORDER BY final_orderid DESC LIMIT 0,1";
    util.myConnect(sql,userId,function(err,data){
        var mydata=data;
        let sql="SELECT COUNT(*) FROM order_detail,userinfo WHERE order_detail.user_id=userinfo.user_id AND order_detail.order_state=0 AND order_detail.user_id=? GROUP BY order_detail.user_id";
        util.myConnect(sql,userId,function(err,data){
            var num=data;
            if(num==""){
                req.session.num=0;
                resp.render("h_payindex",{
                    mydata:mydata,
                    nickname:req.session.nickname,
                    titleImg:req.session.titleImg,
                    userId:req.session.userId,
                    num:req.session.num
                })
            }else{
                req.session.num=num[0]["COUNT(*)"];
                resp.render("h_payindex",{
                    mydata:mydata,
                    nickname:req.session.nickname,
                    titleImg:req.session.titleImg,
                    userId:req.session.userId,
                    num:req.session.num
                })
            }
        });
    })
};

var orderawncheng=function(req,resp){
    let userId=req.session.userId;
    let sql="SELECT * FROM  finalorder WHERE user_id=? ORDER BY final_orderid DESC LIMIT 0,1";
    util.myConnect(sql,userId,function(err,data){
        resp.render("h_order",{
            mydata:data,
            nickname:req.session.nickname,
            titleImg:req.session.titleImg,
            userId:req.session.userId,
            num:req.session.num
        })
    })
};
//订单取消
var guanbidingdan=function(req,resp){
    let dingdanbh=req.body.h_dingdanhao;
    let userId=req.session.userId;
    let sql="UPDATE order_detail SET order_state=4 WHERE final_orderid=? AND user_id=?";
    util.myConnect(sql,[dingdanbh,userId],function(err,data){
        resp.send(data)
    })

};
var xianshidizhi=function(req,resp){
    let userId=req.session.userId;
    let myaddress=req.session.address;
    let sql="SELECT * FROM t_partition WHERE site=?";
    util.myConnect(sql,[myaddress],function(err,data){
        resp.send(data)
    })

};
module.exports={
    checkLogin:checkLogin,//登录
    sendRegiMsg:sendRegiMsg,//发送注册验证码
    checkRegiMsg:checkRegiMsg,//验证注册验证码
    deleteUser:deleteUser,//注销
    registered:registered,//跳转注册
    index:index,//首页
    userCenter:userCenter,//用户中心
    personalInformation:personalInformation,//编辑用户信息
    address:addess,//收货地址
    coupons:coupons,//优惠券
    addCoupons:addCoupons,//绑定优惠券
    giftcard:giftcard,//代金卡
    sendMsg:sendMsg,//发送登录验证码
    checkCode:checkCode,//验证登录短信验证码
    addAddress:addAddress, //添加地址
    deleteAddress:deleteAddress, //删除地址
    updateAddress:updateAddress, //修改地址
    settings:settings, //修改默认地址
    savePerson:savePerson,//修改个人信息
    checkTel:checkTel, //找回密码
    setNewPwd:setNewPwd,//设置新密码
    sendRePassword:sendRePassword, //发送密码验证
    retrievePassword:retrievePassword,//忘记密码
    changePassword:changePassword,//修改密码页面
    changePwd:changePwd,//修改密码
    CreamTea:CreamTea,//下午茶
    checkTelCode:checkTelCode,//登录页面跳转
    registed:registed,//注册页面跳转
    relogin:relogin,//重新登录
    chosePrivince:chosePrivince,//选择城市
    uploadImg:uploadImg,//上传头像
    checkRegiTel:checkRegiTel,//注册手机号码验证

    announcement:announcement,//公告信息
    teaCheck:teaCheck,//下午茶商品筛选
    teaMessage:teaMessage,

    //zr
    tijiao:tijiao,
    brandstory:brandstory,
    baking:baking,
    play:play,
    more:more,
    mores:mores,
    details:details,
    Theorder:Theorder,
    more1:more1,
    more2:more2,

    //yy
    showAll:showAll,
    cakeCheck:cakeCheck,
    message:message,
    notice:notice,
    addStory:addStory,
    addProduct:addProduct,
    addTea:addTea,

    //lsc
    tiaozhuan:tiaozhuan,
    tiaozhuan1:tiaozhuan1,
    fenlei:fenlei,
    gouwuche:gouwuche,
    dingzhitijiao:dingzhitijiao,

    //========ryy
    exchange:in_exchange,
    indent:indent,
    addAccessories:addAcc,
    deleteOnly:deleteO,
    deleteAll:deleteAll,
    settlement:settlement,
    addAccFor:addAccFor,
    convertPro:convertPro,
    convertaddNum:convertaddNum,
    convertsubNum:convertsubNum,
    convertdelete:convertdelete,

    //Linyue
    apply:apply,
    applymessage:applymessage,
    applysuccess:applysuccess,
    giftdetailshow:giftdetailshow,
    zoneshow:zoneshow,
    birthdayshow:birthdayshow,
    companyshow:companyshow,
    birthdayzone:birthdayzone,
    companyzone:companyzone,
    teacherdesgin:teacherdesgin,
    teamdetail:teamdetail,
    brhgoods:brhgoods,
    desginSearch:desginSearch,
    desginSearch2:desginSearch2,
    desgingift:desgingift,
    tjgoods:tjgoods,
    pongs:pongs,
    recommend:recommend,
    brhgoodss:brhgoodss,
    shopping:shopping,
    tjshopping:tjshopping,
    Addsee:Addsee,
    companyAdd:companyAdd,
    giftshopping:giftshopping,
    Adding:Adding,
    teamprice:teamprice,
    teamdetailing:teamdetailing,
    companydetail:companydetail,

    //hyp
    peisong:peisong,//配送页面出现的默认地址
    qhadress:qhadress,//切换地址动态获取地址信息
    xiugaimoren:xiugaimoren,//确认修改默认地址
    tiajiadizhi:tiajiadizhi,//添加地址
    addyouhuiquan:addyouhuiquan,//添加优惠券
    h_tjgoldcard:h_tjgoldcard,//添加金卡
    giftsure:giftsure, //确定使用金卡
    h_jiesuan:h_jiesuan ,//下单结算
    ordersuccess:ordersuccess,//下单成功页面
    zhifubao:zhifubao,//支付宝支付
    weixinzhifu:weixinzhifu,//微信支付
    orderawncheng:orderawncheng,//订单完成的页面
    guanbidingdan:guanbidingdan,//订单取消
    xianshidizhi:xianshidizhi//站点自取模态框内容
};
