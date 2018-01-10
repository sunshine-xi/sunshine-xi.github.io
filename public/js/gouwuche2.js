/**
 * Created by lenovo on 2017/7/18.
 */

//商品金额
var h_bototalprice=$("#h_box6 div>p:nth-of-type(1)>span:nth-of-type(2)");
//配送费
var h_psprice=$("#h_box6 div>p:nth-of-type(2)>span");
//活动优惠
var h_yhprice=$("#h_box6 div>p:nth-of-type(3)>span");
//合计
var h_hjprice=$("#h_box6 div>p:nth-of-type(5)>span");
//订单已满
var h_manprice=$("#h_box6 div>p:nth-of-type(6)>span");
//每个商品的总金额
var h_singlepice=$("#oder_tbody .h_totalprice");
//获取数量

//点击选择生日牌

function hshow(obj){
    //$(obj).next().css("display","block")
    $("#oder_tbody .tbdy_td3 ul").slideUp(320);
    $(obj).next().slideDown(320)
}

//点击前面四个li的时候
$("#oder_tbody .tbdy_td3 ul").find("li:eq(0),li:eq(1),li:eq(2)").click(function(){
    $(this).parent().prev().children("div").text($(this).text());
    $(this).parent().slideUp(320)
});
//点击自定义的时候
$("#oder_tbody .tbdy_td3>ul>li:nth-child(4)").click(function(){
    $(this).css("display","none");
    $(this).next().css("display","block")
});

//点击确定提交自定义确定按钮的时候

$("#oder_tbody .tbdy_td3>ul>li:nth-child(5)").children("button").click(function(){
    //$(this).css("display","none");
    var newtext=$(this).prev().val();
    $(this).parent().parent().prev().children("div").text(newtext);
    $(this).prev().val("");
    $(this).parent().parent().slideUp(320)
});
$("#oder_tbody .tbdy_td5>input:nth-child(2)").blur(function(){
    console.log(5555666);
});
$("#oder_tbody .tbdy_td5>input:nth-child(3)").click(function(){
    var aa=$(this).prev().text();
    $(this).prev().text(aa+1)
});

//订单点击关闭叉叉时删除该订单
$("#oder_tbody .shoping .tbdy_td7 span").click(function(){
    var h_chaprice=parseInt($(this).parent().prev().children(".h_totalprice").text());
    var h_name=$(this).parent().siblings(".tbdy_td2").find("a").text();
    var h_pounds=$(this).parent().siblings(".tbdy_td2").find(".h_guige").text();
    //console.log(h_chaprice)
    console.log(h_name)
    console.log(h_pounds)
    $.ajax({
        method:"post",
        url:"/deleteAcc.do",
        data:{
            h_name:h_name,
            h_pounds:h_pounds
        },
        success:function(data){
            window.location.href="gouwuche.do";
        }
    });
    var h_trlength=$("#oder_tbody tr").length;
    $(this).parent().parent().remove();
    h_bototalprice.text((parseInt(h_bototalprice.text())-h_chaprice)+".00");
    h_hjprice.text((parseInt(h_hjprice.text())-h_chaprice)+".00");
});
//兑换点击关闭叉叉时删除该订单
var c_cha=$("#oder_tbody .convert .tbdy_td7 span");
c_cha.click(function(){
    var c_chaprice=parseInt($(this).parent().prev().children(".h_totalprice").text());
    var c_name=$(this).parent().siblings(".tbdy_td2").find("a").text();
    //var h_pounds=$(this).parent().siblings(".tbdy_td2").find(".h_guige").text();
    $.ajax({
        method:"post",
        url:"/convertdeleteAcc.do",
        data:{
            h_name:c_name,
            //h_pounds:h_pounds
        }
    });
    var h_trlength=$("#oder_tbody tr").length;
    $(this).parent().parent().remove();
    if (h_trlength<=1){
        window.location.href="gouwuche.do";
    }
    h_bototalprice.text((parseInt(h_bototalprice.text())-c_chaprice)+".00");
    h_hjprice.text((parseInt(h_hjprice.text())-c_chaprice)+".00");
    window.location.reload();
});





//商品数量添加减少
//点加号的时候
var h_addnum=$("#oder_tbody .shoping .tbdy_td5 input:nth-child(3)");
var h_minus=$("#oder_tbody .shoping .tbdy_td5 input:nth-child(1)");
h_addnum.click(function () {
    var h_nums=parseInt($(this).prev().val());
    var h_danjia=$(this).parent().prev().children(".h_price").text();
    var h_talprice;
    $(this).prev().val(h_nums+1);
    h_talprice=(h_nums+1)*parseInt(h_danjia);
    //console.log(h_talprice);
    $(this).parent().next().children(".h_totalprice").text(h_talprice+".00")
    h_jisuanzjia()

});

//点减号的时候
h_minus.click(function () {
    var h_nums=parseInt($(this).next().val());
    var h_danjia=$(this).parent().prev().children(".h_price").text();
    var h_talprice;
    if(h_nums-1>=1){
        $(this).next().val(h_nums-1);
        h_talprice=(h_nums-1)*parseInt(h_danjia);
        $(this).parent().next().children(".h_totalprice").text(h_talprice+".00")
        h_jisuanzjia()
    }
    else {
        $("#prompt_modal .modal-header").text("购买商品数量不能少于1")
        $("#prompt_modal").modal("show")
    }
});
//计算配送费

//计算总价

function h_jisuanzjia(){
    var h_totalprice=0;
    for(var j=0;j<h_singlepice.length;j++){
        //console.log(898989);
        h_totalprice+=parseInt(h_singlepice.eq(j).text());
        //console.log(h_totalprice)
    }
    if(h_totalprice>=100){
        $(".delivery span").text("0.00");
        h_hjprice.text(h_totalprice+".00");
    }else{
        $(".delivery span").text("12.00");
        h_hjprice.text(h_totalprice+12+".00");
    }
    h_bototalprice.text(h_totalprice+".00");
}

$(document).ready(function(){
    h_jisuanzjia()
});

//点击全部清空的时候
$("#h_box6>div>p:nth-of-type(1)>span>a").click(function(){
    $("#oder_tbody>tr").remove();
    h_bototalprice.text(0+".00");
    h_hjprice.text(0+".00");
});

//公告显示部分
var h_ggaoul=document.querySelector("#h_box5>div>ul");
function gonggao(){
    var bb=h_ggaoul.style.top;
    if(bb==""){
        h_ggaoul.style.top="0px";
    }
    h_ggaoul.style.transition="linear .45s";
    h_ggaoul.style.top=(parseInt(bb)-100)+"px";

    if(parseInt(h_ggaoul.style.top)<-200){
        h_ggaoul.style.transition="linear 0s";
        h_ggaoul.style.top="0px";
    }
}
setInterval(gonggao,3500);

//点击配件处的购物车图标
$(".addAccessories").on("click",function(){

    //addImg=$(this).parent().prev()[0].src;
    addName=$(this).parent().find("p").find("em").text();
    addPrice=$(this).siblings("span").find("em").text().split(".")[0];

    $.ajax({
        method:"post",
        url:"addAccessories.do",
        //asnyc:true,
        data:{
            //addImg:addImg,
            addName:addName,

        },
        success:function(data){
            //console.log("asdasd");
            //window.location.reload();
            //根据栏截的返回对应的商品ID
            $.ajax({
                method:"post",
                url:"addAccFor",
                asnyc:false,
                data:{
                    addProId:data[0].pro_id,
                    addPrice:addPrice
                },
                success:function(data){
                    //console.log(data);
                    window.location.reload();
                }
            })
        }


    });
    //window.location.reload();
});
//结算
$(".settlement").click(function(){
    var proN=$(" .tbdy_td2 a");
    var proB=$(" .tbdy_td3>div>div");
    var proName=[];//商品名称
    var proBirthCard=[];//生日牌
    var proNum=[];//产品数量
    var proTotalP=[];//产品总价
    for(var i=0;i<proN.length;i++){
        var proBirth=proB.eq(i).text();
        var proNumber=$(".tbdy_td5>.form-control").eq(i).val();
        var proPri=$(".h_totalprice").eq(i).text();
        proName.push(proN[i].text);//商品名称
        proBirthCard.push(proBirth);//生日牌
        proNum.push(proNumber);//产品数量
        proTotalP.push(proPri);//产品总价

    }
    //
    $.ajax({
        method:"post",
        url:"settlement.do",
        data:{
            proName:proName,
            proBirthCard:proBirthCard,
            proNum:proNum,
            proTotalP:proTotalP
        },
        success:function(data){

        }
    });
    window.location.href="peisongxinxi"
});
//获取兑换商品的加减号
var c_addnum=$("#oder_tbody .convert .tbdy_td5 input:nth-child(3)");
var c_minus=$("#oder_tbody .convert .tbdy_td5 input:nth-child(1)");
var c_total=$(".convert .c_totalprice");
//获取
var c_allTotalprice;//兑换商品的总果实币
function c_mytotal(){
    c_allTotalprice=0;
    for(var j=0;j<c_total.length;j++){
        //console.log(898989);
        c_allTotalprice+=parseInt(c_total.eq(j).text());
    }

}

//点击兑换商品区域的加号时
c_addnum.click(function(){
    c_mytotal();
    var c_num=parseInt($(this).prev().val());
    var convert=$(this).prev();
    var c_name=$(this).parent().parent().find(".tbdy_td2 .conName").text();
    var c_totalprice=$(this).parent().next().find(".c_totalprice");
    $.ajax({
        method:"post",
        url:"addNum.do",
        data:{
            convert_num:c_num,
            convert_name:c_name
            //c_allTotalprice:c_allTotalprice
        },
        success:function(data){

            if(data==""){
                $("#prompt_modal .modal-header").text("果实币不足");
                $("#prompt_modal").modal("show")
            }else{
                var c_perice=data[0].integral_score;
                var c_total=c_perice*(c_num+1);
                c_totalprice.text(c_total);
                convert.val(c_num+1)
            }


        }
    })
});
//点击兑换商品区域的减号时
c_minus.click(function(){
    c_mytotal();
    var subtract=parseInt($(this).next().val());
    var c_totalprice=$(this).parent().next().find(".c_totalprice");
    var c_name=$(this).parent().parent().find(".tbdy_td2 .conName").text();

    if(subtract-1>=1){
        $(this).next().val(subtract-1);
        $.ajax({
            method:"post",
            url:"subtractnum.do",
            data:{
                c_name:c_name,
                subtract:subtract
            },
            success:function(data){
                var c_perice=data[0].integral_score;
                console.log(c_perice);
                var c_total=c_perice*(subtract-1);
                c_totalprice.text(c_total);
                console.log(c_allTotalprice)
            }
        });
    }
    else {
        $("#prompt_modal .modal-header").text("购买商品数量不能少于1");
        $("#prompt_modal").modal("show")
    }

});
