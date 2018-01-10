//引入express模板
const express=require("express");
const app=module.exports=express();
//引入ejs模板
const ejs=require("ejs");
//引入session
const session=require("express-session");
//引入cookie
const cookieParser=require("cookie-parser");
const db = require("./route/db.js");
app.configure(function(){
    //ejs文件配置，通常配置在最上方
    app.set("views",__dirname+"/views");//视图模板都在当前文件夹
    app.set("views engine","ejs");//设置模板引擎，代表视图后缀名是ejs
    //调用cookieparser
    app.use(cookieParser());
    //调用和配置session
    app.use(session({
        name:"testItem",
        secret:"12345",
        cookie:{maxAge:999999999999999999999999999999999999},//cookie有效时间，毫秒为单位
        resave:true,//更新session的失效时间
        rooling:true//更新保存
    }));
    //配置express
    app.use(express.logger("dev"));
    app.use(express.bodyParser({
        uploadDir:"./public/temp"
    }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname+"/public"));
    app.use(express.favicon(__dirname+"/public/images/logo.ico"));
    app.use(express.errorHandler());
});
app.set("port",8885);
app.listen(app.get("port"),function(){
    console.log("服务器启动"+app.get("port"));
});
app.post("/login.do",db.checkLogin);//登录
app.get("/deleteUser.do",db.deleteUser);//注销登录
app.get("/userCenter.do",db.userCenter);//用户中心
app.get("/index.do",db.index);//首页
app.get("/personalInformation.do",db.personalInformation);//编辑个人信息
app.get("/address.do",db.address);//收货地址
app.get("/coupons.do",db.coupons);//优惠券
app.post("/addCoupons.do",db.addCoupons);//绑定优惠券
app.get("/giftcard.do",db.giftcard);//代金卡
app.get("/registered.do",db.registered);//跳转注册
app.post("/sendMsg.do",db.sendMsg);//发送登录验证码
app.post("/checkCode.do",db.checkCode);//验证登录验证码
app.post("/sendRegiMsg.do",db.sendRegiMsg);//发送注册验证码
app.post("/checkRegiMsg.do",db.checkRegiMsg);//验证注册验证码
app.post("/addAddress.do",db.addAddress);//添加地址
app.post("/deleteAddress.do",db.deleteAddress);//删除地址
app.post("/updateAddress.do",db.updateAddress);//修改地址
app.post("/settings.do",db.settings);//修改默认地址
app.post("/savePerson.do",db.savePerson);//修改个人信息
app.post("/sendRePassword.do",db.sendRePassword);//发送注册验证码
app.post("/checkTel.do",db.checkTel);//找回密码
app.post("/setNewPwd.do",db.setNewPwd);//设置新密码
app.get("/retrievePassword.do",db.retrievePassword);//忘记密码页面
app.get("/changePassword.do",db.changePassword);//修改密码密码页面
app.post("/changePwd.do",db.changePwd);//修改密码
app.get("/recommend.do",db.recommend);//推荐
app.get("/checkTelCode.do",db.checkTelCode);//电话登录跳转
app.get("/registed.do",db.registed);//电话注册跳转
app.get("/relogin.do",db.relogin);//重新登录
app.get("/announcement.do",db.announcement);//公告信息
app.post("/uploadImg.do",db.uploadImg);//上传图片
app.post("/checkRegiTel.do",db.checkRegiTel);//核对注册手机号码

app.get("/Creamtea.do",db.CreamTea);//下午茶
app.post("/allTea.do",db.teaCheck);//筛选下午茶
app.get("/teaMessage.do",db.teaMessage);//链接详情页面
app.post("/chosePrivince.do",db.chosePrivince);//获取nav里面session的值


//========zr====
app.post("/tijiao.do",db.tijiao);
app.get("/brandstory.do",db.brandstory);
app.get("/baking.do",db.baking);
app.get("/play.do",db.play);
app.get("/more.do",db.more);
app.get("/mores.do",db.mores);
app.get("/details.do",db.details);
app.get("/Theorder.do",db.Theorder);
app.get("/more1.do",db.more1);
app.get("/more2.do",db.more2);

//==========yy
app.get("/cake.do",db.showAll);//点击链接到蛋糕页面
app.post("/allCake.do",db.cakeCheck);//筛选蛋糕
app.get("/message.do",db.message);//链接详情页面
app.post("/notice.do",db.notice);//获取nav里面session的值
app.post("/addShop.do",db.addStory);//加入购物车
app.post("/addProduct.do",db.addProduct);//加入购物车
app.post("/addTea.do",db.addTea);//下午茶加入购物车

//====lsc
//拦截
app.get("/customized.do",db.tiaozhuan);//拦截定制页面
app.post("/dingzhitijiao.do",db.dingzhitijiao);//拦截定制订单的提交
app.get("/periphery.do",db.tiaozhuan1);//拦截周边页面
app.post("/fenlei.do",db.fenlei);//拦截周边分类
app.post("/gouwuche.do",db.gouwuche);//拦截周边商品加入购物车的请求


//===========ryy
//兑换页面拦截
app.get("/convert.do",db.exchange);
//兑换添加到购物车
app.post("/convertPro.do",db.convertPro);
//兑换商品购物车点击加号时
app.post("/addNum.do",db.convertaddNum);
//兑换商品购物车点击减号时
app.post("/subtractnum.do",db.convertsubNum);

//购物车
app.get("/gouwuche.do",db.indent);
//购物车中添加配件
app.post("/addAccessories.do",db.addAccessories);
app.post("/addAccFor",db.addAccFor);
//app.post("/addAccUp",db.addAccUp);
//点击叉叉删除
app.post("/deleteAcc.do",db.deleteOnly);
//点击全部清空时
app.get("/deleteAll.do",db.deleteAll);
//点击结算时
app.post("/settlement.do",db.settlement);
//兑换点击叉叉时
app.post("/convertdeleteAcc.do",db.convertdelete);




//==========ly

//企业申请表拦截
app.post("/apply.do",db.apply);
//企业申请表信息确认修改拦截
app.get("/companymessage.do",db.applymessage);
//企业申请信息申请成功跳转页面拦截
app.get("/apppp.do",db.applysuccess);
//企业专区蛋糕购买产品加载页面拦截
app.get("/giftdetailshow.do",db.giftdetailshow);
//企业专区试吃申请表跳转拦截
app.get("/companydetail.do",db.companydetail);
//导航专区页面拦截
app.get("/zone.do",db.zoneshow);
//导航生日专区页面拦截
app.get("/birthday.do",db.birthdayshow);
//导航企业专区页面拦截
app.get("/company.do",db.companyshow);
//专区跳转生日专区拦截
app.get("/birthdayzone.do",db.birthdayzone);
//专区跳转企业专区拦截
app.get("/companyzone.do",db.companyzone);
//专区跳转设计师礼品拦截
app.get("/teacherdesgin.do",db.teacherdesgin);
//冰淇淋组合页面详情拦截
app.get("/teamdetail.do",db.teamdetail);
//生日专区产品详情拦截
app.get("/brhgoods.do",db.brhgoods);
//设计师礼品页面点击局部刷新
app.post("/desginSearch.do",db.desginSearch);
//设计师礼品页面点击局部刷新二
app.post("/desginSearch2.do",db.desginSearch2);
//设计师礼品详情跳转页面
app.get("/desgingift.do",db.desgingift);
////页脚商品推荐一拦截
app.get("/tjgoods.do",db.tjgoods);
//商品磅数选择拦截
app.post("/pongs.do",db.pongs);
//导航商品推荐拦截
app.get("/recommend.do",db.recommend);
//导航商品推荐商品详情拦截
app.get("/brhgoodss.do",db.brhgoodss);
//生日专区加入购物车拦截
app.post("/shopping.do",db.shopping);
//导航推荐商品加入购物车拦截
app.post("/tjshopping.do",db.tjshopping);
//商品详情加入购物车拦截
app.post("/Addsee.do",db.Addsee);
//企业专区详情页面购物车拦截
app.post("/companyAdd.do",db.companyAdd);
//设计师礼品详情页面购买
app.post("/giftshopping.do",db.giftshopping);
//设计师礼品主页立即购买拦截
app.post("/Adding.do",db.Adding);
//商品详情下面的组合套餐加入购物车拦截
app.post("/teamprice.do",db.teamprice);
//组合冰淇淋详情加入购物车
app.post("/teamdetailing.do",db.teamdetailing);
//商品详情加入购物车拦截
//app.post("/tocart.do",db.tocart);

//hyp
app.get("/peisongxinxi",db.peisong);//配送页面的加载
app.get("/qiehuandizhi.do",db.qhadress);//切换地址动态获取地址信息
app.get("/hsaveqiehuan.do",db.xiugaimoren);//切换配送地址
app.post("/h_address.do",db.tiajiadizhi);//确认修改默认地址
app.post("/addyouhuiquan.do",db.addyouhuiquan);//添加优惠券
app.post("/h_tjgoldcard.do",db.h_tjgoldcard);//添加金卡
app.post("/giftsure.do",db.giftsure);//确定使用金卡
app.post("/xiadanjiesuan.do",db.h_jiesuan);//下单结算
app.post("/xianshidizhi.do",db.xianshidizhi);//站点自取模态框内容
app.get("/h_order.do",db.ordersuccess);//下单成功页面
app.get("/zhifubaozhifu.do",db.zhifubao);//支付宝支付
app.get("/weixinzhifu.do",db.weixinzhifu);//微信支付
app.get("/orderawncheng.do",db.orderawncheng);//支付結果
app.post("/guanbidingdan.do",db.guanbidingdan);//超时关闭订单
