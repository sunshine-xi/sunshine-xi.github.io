$(function(){
    var h_offbtn1=true;//点击发票的开关
    var h_offbtn=true;//选择果实币的开关
    var h_zfbtn=true;//支付方式收起展开
    var h_gbbtn=true;//果币支付展开
    var h_mrdzbtn=true;//设置添加地址选为默认地址时的开关
    var hfinaliyprice=0;//先声明最终的总价变量
    var nowyhid;//点击最近一次的优惠券id
    var xz_payway="在线支付";//选择支付方式的编码1、在线支付，2、货到付款，3、货到刷卡
    var talmoney=parseFloat($("#pretotalmaoey").text());//第一个总价
    var h_zqdress;//存放站点自取的地址，好提交给结算按钮下面的地址
    var h_usegsb= $("#xz_gbiinput");//选择使用果实币的勾勾
    var h_dressid;//最后一次点击的那个地址的地址id


    //页面加载的时候出现的价格
    if(talmoney<300){
        $("#h_sendprice").text("12.00")
    }
    else {
        $("#h_sendprice").text("0.00")
    }
    //页面加载时最终总价格
    $("#pay_total_price").text((talmoney+parseFloat($("#h_sendprice").text())).toFixed(2));
    //hfinaliyprice=talmoney-(parseFloat($("#h_giftmoney2").text())+($("#h_sendprice").text()-$("#h_yhzekou").text()));
    //if(hfinaliyprice<=0){//第一个总价减去金卡抵扣小于0就等于0
    //    $("#pay_total_price").text("0.00")
    //}
    //else {
    //    $("#pay_total_price").text(hfinaliyprice.toFixed(2))
    //}
    $("#sure_name").text($("#h_name").text());
    $("#sure_phone").text($("#h_phone").text());
    $("#sure_address").text($("#h_adress").text());

    //   点击站点自取，站点模态框出现，和地址的提交
    //点击配送时，给结算按钮下面的地址复制

    $("#qj_btn").click(function(){
        $("#sure_address").text($("#h_adress").text());
        $("#qj_modal").modal("show");
        $.ajax({
            type:"post",
            url:"/xianshidizhi.do",
            async: false,
            data:{

            },
            success:function(data){
                console.log(data.length);
                $("#zhandianul>li").remove();
                for(var i=0;i<data.length;i++){
                    var allzhandian= "<li class='h_qiehuan_li'><div class='qj_modal-left'> <h6>"+data[i].site_name+"</h6> <span>"+data[i].site_phone+"</span> </div> <div class='qj_modal-right'> <span>"+data[i].site_area+"</span> <span>"+data[i].site_detail+"</span> </div> </li>"
                    $("#zhandianul").append(allzhandian)
                }
            }
        })
    });

    //<!--/*点击站点自取模态框*/-->
    $("#qj_modal").on("click",".h_qiehuan_li",function(){
        var zdiandji=$("#qj_modal .modal-body>ul>.h_qiehuan_li");//站点自取模态框里面的每一站点
        zdiandji.css("background","none");
        $(".qj_modal-right").css("color","rgb(51,51,51)");
        $(this).css("background-color","rgb(240, 239, 237)");
        $(this).children(".qj_modal-right").css("color","rgb(186,153,120)");
        h_zqdress=$(this).find(".qj_modal-right span:nth-of-type(2)").text();
    });

    //<!--/*点击站点自取模态框的确认按钮*/-->
    $("#qj_sure_btn").click(function(){
        $("#qj_adress").text(h_zqdress);
        $("#sure_address").text(h_zqdress);
        $("#qj_modal").modal("hide");
    });




    //添加地址模态框的显示
    $("#add_address").click(function(){
        $("#address_modal").modal("show")
    });
    //切换地址时模态框的显示隐藏
    $("#qh_add_address").click(function(){
        $("#qh_modal").modal("hide");
        $("#address_modal").modal("show")
    });

    //点击选择配送方式
    $("input:radio[name='ps_way']").click(function(){

        $("input:radio[name='ps_way']").next().css("display","inline-block");
        $("input:radio[name='ps_way']").next().next().css("display","none");
        $(this).next().css("display","none");
        $(this).next().next().css("display","inline-block");
    });

    //点击选择发票的时候i显示哪一个，点击发票显示隐藏下边部分
    $("input:checkbox[name='my_fapiao']").click(function(){
        if(h_offbtn1==true){
            $(this).next().css("display","none");
            $(this).next().next().css("display","inline-block");
            $("#xz_invoice").next().css("border-color","white");
            $("#xz_invoice").next().children("i").fadeIn(200);
            $("#invoice_top").slideDown(200);
            h_offbtn1=false;
        }
        else{
            $(this).next().css("display","inline-block");
            $(this).next().next().css("display","none");
            $("#xz_invoice").next().css("border-color","rgb(207, 207, 214)");
            $("#xz_invoice").next().children("i").fadeOut(300);
            $("#invoice_top").slideUp(320);
            h_offbtn1=true;
        }
    });

    //点击选择公司发票还是个人发票的i
    $("input:radio[name='invoice_lei']").click(function(){
        $("input:radio[name='invoice_lei']").next().css("display","inline-block");
        $("input:radio[name='invoice_lei']").next().next().css("display","none");
        $(this).next().css("display","none");
        $(this).next().next().css("display","inline-block");
    });

    $("#company").click(function(){
        if($("#company").is(":checked")){
            $("#h_nasuiren").css("display","block")
        }
        else {
            $("#h_nasuiren").css("display","none")
        }
    });
    $("#personal").click(function(){
        if($("#personal").is(":checked")){
            $("#h_nasuiren").css("display","none")
        }
        else {
            $("#h_nasuiren").css("display","block")
        }
    });

    //点击使用果实币的样式
    $("#xz_gbi>p").click(function(){
        if(h_gbbtn){
            $(this).next().css("display","block");
            $(this).next().next().css("display","inline-block");
            $(this).children("i").removeClass("fa-minus").addClass("fa-plus");
            h_gbbtn=false;
        }
        else {
            $(this).next().css("display","none");
            $(this).next().next().css("display","none");
            $(this).children("i").removeClass("fa-plus").addClass("fa-minus");
            h_gbbtn=true;
        }
    });
    //使用果实币之后点击折扣i 使用果实币抵扣
    h_usegsb.click(function(){
        var dikoumoney=parseFloat($(this).siblings("span").text());//抵扣的多少元

        if(h_offbtn==true){//第二个i是选中的
            h_usegsb.next().css("display","none");
            h_usegsb.next().next().css("display","inline-block");

            //如果总价大于果币抵扣价，就显示实际果币抵扣借
            if(parseFloat($("#pay_total_price").text())-dikoumoney>0){
                $("#h_gsbdikou").text(dikoumoney.toFixed(2))
            }
            else {//如果总价小于果币抵扣价，就显示果币抵扣价为最终价格
                $("#h_gsbdikou").text(parseFloat($("#pay_total_price").text()).toFixed(2));
            }

            hfinaliyprice=parseFloat($("#pretotalmaoey").text())+parseFloat($("#h_sendprice").text())-parseFloat($("#h_giftmoney").text())-parseFloat($("#h_yhzekou").text())-parseFloat($("#h_gsbdikou").text());
            $("#pay_total_price").text(hfinaliyprice.toFixed(2))
            h_offbtn=false;
        }
        else{//第二个i是选中的
            h_usegsb.next().css("display","inline-block");
            h_usegsb.next().next().css("display","none");

            $("#h_gsbdikou").text("0.00");
            hfinaliyprice=$("#pretotalmaoey").text()-parseFloat($("#h_giftmoney").text())+parseFloat($("#h_sendprice").text())-parseFloat($("#h_yhzekou").text())-parseFloat($("#h_gsbdikou").text());
            $("#pay_total_price").text(hfinaliyprice.toFixed(2));
            h_offbtn=true;
        }
    });



    //$("#xz_gbiinput").click(function(){
    //
    //    if ($('#xz_gbiinput').is(':checked')) {
    //        // do something
    //        var dikoumoney=$(this).siblings("span").text();
    //
    //        if(parseFloat($("#pay_total_price").text())-dikoumoney>0){
    //            //如果总价大于果币抵扣价，就显示实际果币抵扣借
    //            $("#h_gsbdikou").text(dikoumoney.toFixed(2))
    //        }
    //        else {
    //            //如果总价小于果币抵扣价，就显示果币抵扣价为最终价格
    //            $("#h_gsbdikou").text(parseFloat($("#pay_total_price").text()).toFixed(2));
    //
    //        }
    //        hfinaliyprice=$("#pretotalmaoey").text()-parseFloat($("#h_giftmoney").text())+parseFloat($("#h_sendprice").text())-parseFloat($("#h_yhzekou").text())-parseFloat($("#h_gsbdikou").text());
    //        $("#pay_total_price").text(hfinaliyprice.toFixed(2))
    //    }
    //    else {
    //        $("#h_gsbdikou").text("0.00");
    //        hfinaliyprice=$("#pretotalmaoey").text()-parseFloat($("#h_giftmoney").text())+parseFloat($("#h_sendprice").text())-parseFloat($("#h_yhzekou").text())-parseFloat($("#h_gsbdikou").text());
    //        $("#pay_total_price").text(hfinaliyprice.toFixed(2))
    //    }
    //
    //
    //    //if ($("#xz_gbiinput").prop("checked",true)){
    //    //    var dikoumoney=$(this).siblings("span").text();
    //    //    //console.log(dikoumoney)
    //    //    //console.log($("#pay_total_price").text())
    //    //    if(parseFloat($("#pay_total_price").text())-dikoumoney>0){
    //    //        //如果总价大于果币抵扣价，就显示实际果币抵扣借
    //    //        $("#h_gsbdikou").text(dikoumoney)
    //    //
    //    //    }
    //    //    else {
    //    //        //如果总价小于果币抵扣价，就显示果币抵扣价为最终价格
    //    //        $("#h_gsbdikou").text(parseFloat($("#pay_total_price").text()));
    //    //
    //    //    }
    //    //    hfinaliyprice=talmoney-parseFloat($("#h_giftmoney").text())+parseFloat($("#h_sendprice").text())-parseFloat($("#h_yhzekou").text())-parseFloat($("#h_gsbdikou").text());
    //    //    $("#pay_total_price").text(hfinaliyprice)
    //    //}
    //    //else {
    //    //    $("#h_gsbdikou").text("0.00");
    //    //    hfinaliyprice=talmoney-parseFloat($("#h_giftmoney").text())+parseFloat($("#h_sendprice").text())-parseFloat($("#h_yhzekou").text())-parseFloat($("#h_gsbdikou").text());
    //    //    $("#pay_total_price").text(hfinaliyprice)
    //    //}
    //});

    //切换地址模态框，获取前一个地址的id及效果，h_dressid;最后一次点击的那个地址的地址id
    $("#qh_modal").on("click",".qh_address_div",function(){
        var qhuandj=$("#qh_modal>div>div>div>.qh_address_div");
        h_dressid=$(this).find(".h_adressid").text();
        qhuandj.css("background","none");
        $(this).css("background-color","rgb(240, 239, 237)");
    });

    //点击使用优惠券的效果
    $("#youhui>a:nth-child(1)").click(function(){
        $("#use_youhui").css("display","block");
        $("#add_youhui").css("display","none");
        $(this).addClass("yh_active").removeClass("yh_noactive");
        $(this).next().addClass("yh_noactive").removeClass("yh_active");
    });


    //点击使用优惠券
    //点击使用优惠券
    $("#h_allzhekou>ul>li").attr("btn","false");
    $(document).on("click","#h_allzhekou>ul>li",function(){
        if($("#h_giftmoney").text()<=0){//判断没有使用金卡时
            if($(this).attr("btn")=="true"){
                $(this).css({
                    "border":"1px solid rgb(214,214,221)",
                    "color":"rgb(213,191,167)",
                    "background-color":"rgb(250,250,250)"
                });
                $(this).children("i").css("display","none");
                $(this).children("img").attr("src","images/arch1.png");
                $(this).css("transition","all .4s linear");
                $(this).attr("btn","false");
                nowyhid=null;

                $("#h_yhzekou").text("0.00");
                hfinaliyprice=parseFloat($("#pretotalmaoey").text())-parseFloat($("#h_giftmoney").text())+parseFloat($("#h_sendprice").text())-$("#h_yhzekou").text()-$("#h_gsbdikou").text();
                $("#pay_total_price").text(hfinaliyprice.toFixed(2))
            }
            else { //点击使用优惠券的效果
                $("#h_allzhekou>ul>li").attr("btn","false");
                $("#h_allzhekou>ul>li").css({
                    "border":"1px solid rgb(214,214,221)",
                    "color":"rgb(213,191,167)",
                    "background-color":"rgb(250,250,250)"
                });
                $("#h_allzhekou>ul>li>i").css("display","none");
                $("#h_allzhekou>ul>li>img").attr("src","images/arch1.png");
                $("#h_allzhekou>ul>li").css("transition","all .4s linear");


                $(this).children("img").attr("src","images/arch2.png");
                $(this).attr("btn","true");
                $(this).css({
                    "border":"1px solid rgb(186,153,120)",
                    "color":"rgb(186,153,120)",
                    "background-color":"white"
                });
                $(this).children("i").css("display","inline-block");
                nowyhid=$(this).children(".voucherid").text();

                //点击这张优惠券的优惠价格,h_jsyhjia折扣优惠的价格

                var h_jsyhjia=((10-parseFloat($(this).children(".vou_zhekou").text()))/10)*parseFloat($("#pretotalmaoey").text());
                $("#h_yhzekou").text(h_jsyhjia.toFixed(2));
                hfinaliyprice=parseFloat($("#pretotalmaoey").text())-parseFloat($("#h_giftmoney").text())+parseFloat($("#h_sendprice").text())-$("#h_gsbdikou").text();

                if((hfinaliyprice-h_jsyhjia)>=0){
                    $("#pay_total_price").text((hfinaliyprice-h_jsyhjia).toFixed(2))
                }
                else {
                    $("#pay_total_price").text("0.00")
                }
            }
        }
        else {
            console.log("使用了代金卡")
            $("#prompt_modal .modal-header").text("已使用代金卡不能同时使用优惠券");
            $("#prompt_modal").modal("show")
        }
    });

    //添加优惠券动态效果
    $("#youhui>a:nth-child(2)").click(function(){
        $("#use_youhui").css("display","none");
        $("#add_youhui").css("display","block");
        $(this).addClass("yh_active").removeClass("yh_noactive");
        $(this).prev().addClass("yh_noactive").removeClass("yh_active");
    });


// xz_payway;选择支付方式的编码1、在线支付，2、货到付款，3、货到刷卡
    $("#xz_payway>a").click(function () {
        $("#xz_payway>a").css("border","1px solid rgb(212,212,218)");
        $(this).css("border","3px solid #684029");
        xz_payway=$(this).text();
    });
    //支付方式收起部分
    $("#xz_payway>span").click(function(){
        if(h_zfbtn){
            $(this).siblings(".hide_a").css("display","inline-block");
            $(this).text("收起<<");
            h_zfbtn=false
        }
        else{
            $(this).siblings(".hide_a").css("display","none");
            $(this).text("展开>>");
            h_zfbtn=true
        }
    });



//选择金卡
    var h_jkbtn=true;//选择金卡的开关
    $("#xz_goldcard>p").click(function(){
        if(h_jkbtn){
            $(this).next().css("display","block");
            $(this).children("i").removeClass("fa-minus").addClass("fa-plus");

            h_jkbtn=false;
        }
        else {
            $(this).next().css("display","none");
            $(this).children("i").removeClass("fa-plus").addClass("fa-minus");

            h_jkbtn=true;
        }
    });

//添加地址时设置默认地址
    $("#default_address").click(function(){
        if(h_mrdzbtn==true){//第二个i是选中的
            $("#default_address").next().next().css("display","none");
            $("#default_address").next().next().next().css("display","inline-block");
            h_mrdzbtn=false;
        }
        else{//第二个i是选中的
            $("#default_address").next().next().css("display","inline-block");
            $("#default_address").next().next().next().css("display","none");
            h_mrdzbtn=true;
        }
    });




//日历日历日历日历日历日历日历日历日历日历日历日历日历日历日历日历
   $("#h_date").datetimepicker({
        format: 'yyyy-mm-dd',
        minView:'month',
        language: 'zh-CN',
        autoclose:true,
        startDate:new Date()
    });


//============ajax==================
//页面初始加载的时候
    $("#qh_address").click(function(){
        $("#qh_modal").modal("show")
        var last_add=$("#last_add");
        var qiehuanbox=$("#qh_modal .modal-body div");
        qiehuanbox.remove(".nomoren");
        $.ajax({
            type:"get",
            url:"qiehuandizhi.do",
            async:false,
            data:{},
            success:function(data){
                var mydata=data;
                console.log(data);
                for(var i=0;i<data.length;i++){
                    var qihuandiv="<div class='qh_address_div nomoren'><p><span>"+mydata[i].address_name+"</span><span></span><span class='h_adressid'>"+mydata[i].address_id+"</span></p><p><i class='fa fa-mobile' aria-hidden='true'></i><span>"+mydata[i].address_tel+"</span></p><p><i class='fa fa-map-marker' aria-hidden='true'></i><span>"+mydata[i].address+"</span></p></div>"
                    $("#last_add").before(qihuandiv);
                }

            }
        });

    });

//切换配送地址
//function getnow_hadressid(){
//    $.ajax({
//        type:"get",
//        url:"hsaveqiehuan.do",
//        async:false,
//        data:{
//            h_dressid:h_dressid
//        },
//        success:function(data){
//            var mydata=data;
//            $("#h_name").text(mydata[0].address_name);
//            $("#h_phone").text(mydata[0].address_tel);
//            $("#h_adress").text(mydata[0].address);
//
//            $("#sure_name").text(mydata[0].address_name);
//            $("#sure_phone").text(mydata[0].address_tel);
//            $("#sure_address").text(mydata[0].address);
//
//            $("#qh_modal").modal("hide")
//        }
//    })
//}

//$("#qh_sure_btn").on("click",getnow_hadressid);

    $("#qh_sure_btn").click(function(){

        $.ajax({
            type:"get",
            url:"hsaveqiehuan.do",
            async:false,
            data:{
                h_dressid:h_dressid
            },
            success:function(data){
                var mydata=data;
                $("#h_name").text(mydata[0].address_name);
                $("#h_phone").text(mydata[0].address_tel);
                $("#h_adress").text(mydata[0].address);

                $("#sure_name").text(mydata[0].address_name);
                $("#sure_phone").text(mydata[0].address_tel);
                $("#sure_address").text(mydata[0].address);

                $("#qh_modal").modal("hide")
            }
        })


    });
//添加地址
    $("#add_sure_btn").click(function(){
        var h_dressinfor=$("#h_addressform").serialize();
        $.ajax({
            type:"post",
            url:"h_address.do",
            data:h_dressinfor,
            success:function(err,data){
                window.location.href="peisongxinxi";

            }
        })
    });
//查看全部优惠券
    var h_yhbtn=true;//查看全部优惠券的btn
    $("#use_youhui>a:nth-of-type(1)").click(function(){
        if (h_yhbtn){
            $("#h_allzhekou").css("display","block");
            h_yhbtn=false;
        }
        else {
            $("#h_allzhekou").css("display","none");
            h_yhbtn=true;
        }
    });

    $("#add_youhui>form>button").click(function(){
        var yhuino=$("#add_youhui>form>input").val();
        console.log(yhuino)
        $.ajax({
            type:"post",
            url:"addyouhuiquan.do",
            data:{
                yhuino:yhuino
            },
            success:function(data){
                if(data[0].yhidno=="0"){
                    $("#prompt_modal .modal-header").text("该卷码不存在");
                    $("#prompt_modal").modal("show")
                }
                else {
                    var youhui="<li><span>"+data[0].voucher_zhekou+" 折优惠券</span ><img src='images/arch1.png'/><span class='voucherid'></span><i class='fa fa-check' aria-hidden='true'></i></li>"
                    $("#h_allzhekou>ul").append(youhui);
                    var youhuinum=$("#h_allzhekou>ul>li").length;
                    $("#use_youhui>span:nth-of-type(1)").text(youhuinum+" 张可用优惠券。");
                    $("#prompt_modal .modal-header").text("添加成功，去使用！");
                    $("#prompt_modal").modal("show")
                }
            }
        })
    });



//  添加代金卡模态框（有优惠券不弹出）
    $("#add_gold_btn").click(function(){
        if(nowyhid==null){
            $("#gold_modal").modal("show")
        }
        else {
            $("#prompt_modal .modal-header").text("代金卡不能与优惠券同时使用");
            $("#prompt_modal").modal("show")
        }
    });

//添加金卡
    $("#add_giftcard").click(
        function() {
            var hcar_no=$("#car_no").val();
            var hcar_pwd=$("#car_pwd").val();


            if(hcar_no==""||hcar_pwd==""){
                console.log(5959595959);
                $("#h_tishi").text("*代金卡号和防伪码不能为空").css("display","inline-block");
            }
            else {
                $("#h_tishi").css("display","none");

                $.ajax({
                    type:"post",
                    url:"h_tjgoldcard.do",
                    data:{
                        hcar_no:hcar_no,
                        hcar_pwd:hcar_pwd
                    },
                    success:function(data){
                        if(data[0].giftcard_nums=="0"){
                            $("#h_tishi").text("该代金卡号不存在").css("display","inline-block");
                        }
                        else {
                            $("#h_showgift").text(+data[0].giftCard_id).next().css("display","inline-block");
                            $("#h_giftmoney2").text(+data[0].giftCard_money);
                            $("#h_giftmoney").text(+data[0].giftCard_money);
                        }
                    }
                })
            }
        });

//使用代金卡
    $("#gold_sure_btn").click(function(){
        var h_giftid= $("#h_showgift").text();
        if($("#h_showgift").text()!=""){
            $("#gold_modal").modal("hide");
            $.ajax({
                type:"post",
                url:"giftsure.do",
                data:{
                    h_giftid:h_giftid
                },
                success:function(data){
                    $("#h_giftmoney2").text((data[0].giftCard_money).toFixed(2));
                    //第一个总价减去金卡抵扣的结果加上运费减去折扣
                    //hfinaliyprice=parseInt($("#pretotalmaoey").text())-parseInt( $("#h_giftmoney").text())

                    hfinaliyprice=$("#pretotalmaoey").text()-parseFloat($("#h_giftmoney2").text())+parseFloat($("#h_sendprice").text())-$("#h_yhzekou").text()-$("#h_gsbdikou").text();

                    if(hfinaliyprice<0){//第一个总价减去金卡抵扣小于0就等于0
                        $("#pay_total_price").text("0.00")
                    }
                    else {
                        $("#pay_total_price").text(hfinaliyprice.toFixed(2))
                    }

                }
            })
        }
        else {
            $("#gold_modal").modal("hide");
            $("#prompt_modal .modal-header").text("没有可用的代金券");
            $("#prompt_modal").modal("show")
        }
    });



//下单结算
    var userdress;
    $("#h_jiesuanbtn").click(function(){
        //得到选择的是1配送还是2自取$("input[name='rd']:checked").val();
        //("input[type='radio']:checked").val();
        var h_psway=$("input[name='ps_way']:checked").val();
        //var h_sjdizhiid=$("#infor_top_p1 .h_adressid").text();//收件地址
        var h_date=$("#h_date").val();//配送日期
        var h_time=$("#h_time").val();//配送时间
        var h_liuyan=$("#hliuyan").val();//留言
        var youhuimoney=$("#h_yhzekou").text();//优惠金额
        var totalmoney=$("#pay_total_price").text();//总价
        var shouhuoname=$("#sure_name").text();
        var shouhuotel=$("#sure_phone").text();
        var h_sygsb;//剩余果实币
        if(parseFloat($("#h_gsbdikou").text())<=0){
            h_sygsb=parseInt($("#h_yegb").text())
        }
        else {
            h_sygsb=parseInt($("#h_yegb").text())-(parseInt($("#h_gsbdikou").text())*10)
        }
        if(h_psway=="1"){
            userdress=$("#sure_address").text();
        }
        else {
            userdress=$("#qj_adress").text();
        }
        if($.trim($("#addressGet").text())==""){
            $("#prompt_modal .modal-header").text("请添加收货地址");
            $("#prompt_modal").modal("show")
        }else if(h_date==""||h_time==""||h_time=="时间"){
            $("#prompt_modal .modal-header").text("请选择配送/自取时间和日期！");
            $("#prompt_modal").modal("show")
        }
        else if($("#sure_address").text()=="自己去站点取件"){
            $("#prompt_modal .modal-header").text("请选择自己取件的站点！");
            $("#prompt_modal").modal("show")
        }else {
            console.log(11111)
            $.ajax({
                type:"post",
                url:"/xiadanjiesuan.do",
                data:{
                    nowyhid:nowyhid,//点击最近一次的优惠券id
                    xz_payway:xz_payway,//选择支付方式的编码1、在线支付，2、货到付款，3、货到刷卡
                    h_liuyan:h_liuyan,//留言
                    userdress:userdress,//收件地址
                    h_date:h_date,//配送日期
                    h_time:h_time,//配送时间
                    h_psway:h_psway,//配送方式
                    youhuimoney:youhuimoney,//本次订单优惠的金额
                    totalmoney:totalmoney,//总价
                    shouhuoname:shouhuoname,//收货人姓名
                    shouhuotel:shouhuotel,//收货人电话
                    h_sygsb:h_sygsb//使用是果实币
                },
                success:function(data){
                    window.location.href="/h_order.do"
                }
            })
        }

    });
});