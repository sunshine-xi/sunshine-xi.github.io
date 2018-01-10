/**
 * Created by about evol on 2017/7/19.
 */
/*===========banner图动效============*/
window.onload=function(){
    $(".backOne").css("transition","all 2s linear");
    $(".backOne").css("transform","scale(1.1)");
};
function choseSize(obj){
    guige=$(obj).find("span").text();
    console.log(guige);
    $(obj).css("border","1px solid #684029");
    $(obj).parent().siblings().children().css("border","1px solid #E7E0DD");
    $(obj).find("img").css("visibility","visible");
    $(obj).parent().siblings().find("img").css("visibility","hidden");
}
function mesvalue(){
    let mesValue=$("#mesvalue").text();
    $.ajax({
        type: "POST",
        url: "allCake.do",
        data: {
            cakeValue:$("#mesvalue").text()
        },
        success: function (data) {
            $("#allList").html("");
            $.each(data, function (i, n) {
                $("#allList").html($("#allList").html() + "<li class='list-goods-pr1 pro-list-su col-lg-3 col-sm-3 col-md-3 col-xs-12'>"+
                    "<a href='cakeMessage.html'>"+
                    "<img src='"+n.pro_img+"' class='img-responsive' alt='平安夜'>"+
                    "<h3>"+
                    n.pro_name+
                    "<span>¥"+n.pro_price+"磅</span>"+
                    "</h3>"+
                    "</a>"+
                    "<a href='gouwuche2.html' class='pro-list-linkOne'>"+
                    "<img src='images/icon_08.png' alt='''>"+
                    "加入购物车"+
                    "</a>"+
                    "</li>")
            })
        }
    })
}
var bg=["images/1.00P-full-12.00.jpg","images/1.50P-full-15.00.jpg",
    "images/2.00P-full-16.00.jpg", "images/3.00P-full-22.00.jpg",
    "images/5.00P-full-27.00.jpg","images/sizemore.jpg"];
var size=["12x12cm","15.5x15.5cm",
    "16x16cm", "22x22cm",
    "27x27cm",""];
var share=["适合3~4人分享","适合5-6人分享","适合7-8人分享",
    "适合11-12人分享", "适合15-20人分享"];
var cooking=["含5套餐具","含5套餐具","含10套餐具",
    "含15套餐具", "含20套餐具"];
var price=["99.00/1.0磅","258.00/1.5磅","298.00/2.0磅","458.00/3.0磅","750.00/5.0磅"];
$(".inGro").on("click","div",function(){
    var a=$(".inGro li");
    for(var i=0;i< a.length;i++){
        if($(a).eq(i).find("div").text()==$(this).text()){
            if($(a[i]).find("div").find("span").text()=="更多磅数"){
                //$(".detail-price").css("display","none");
                $(".outer-box-lau").html("需要更多磅数，请与工作人员联系。<br/>订购电话021-6666666");
                $(".outer-box-lau").css("margin-top","-100px");
            }else{
                $(".outer-box-lau").css("margin-top","0px");
                $(".outer-box-lau").html(" <ul class='outer-box-lau'>" +
                    "<li>" +
                    "<img src='images/icon_11.png' alt=''>" +
                    "<span class='size'>12x12cm</span>" +
                    "</li>" +
                    " <li>" +
                    "<img src='images/icon_12.png' alt=''>" +
                    "<span class='share'>适合3~4人分享</span>" +
                    "</li>" +
                    " <li>" +
                    "<img src='images/icon_15.png' alt=''>" +
                    "<span class='cooking'>含五套餐具</span>" +
                    "</li>" +
                    "<li>" +
                    "<img src='images/icon_17.png' alt=''>" +
                    " <span class='time'>需提前6小时预定</span>" +
                    "</li></ul>");
                $(".detail-img").attr("src",bg[i]);
                $(".size").html(size[i]);
                $(".share").html(share[i]);
                $(".cooking").html(cooking[i]);
                $(".detail-price").html("￥"+price[i]);
            }
        }
    }
});
//$(".addShop").on("click",function(){//加入购物车
//    var picNam=$(".pro-list-title").html();
//    var price=99;
//    console.log(picNam);
//    $.ajax({
//        type: "POST",
//        url: "addShop.do",
//        data: {
//            picNam:picNam,
//            price:price
//        },
//        success: function (data){
//            $.ajax({
//                type:"get",
//                url:"gouwuche.do",
//                data:{
//
//                },
//                success:function(data){
//                    window.location.href="gouwuche.do";
//                }
//            })
//        }
//    })
//});
//$(".buy").on("click",function(){//立即购买
//    var picNam=$(".pro-list-title").html();
//    var price=99;
//    console.log(picNam);
//    $.ajax({
//        type: "POST",
//        url: "addShop.do",
//        data: {
//            picNam:picNam,
//            price:price,
//            guige:guige
//        },
//        success: function (data){
//            $.ajax({
//                type:"get",
//                url:"gouwuche.do",
//                data:{
//
//                },
//                success:function(data){
//                    window.location.href="gouwuche.do";
//                }
//            })
//        }
//    })
//});
$("#prompt_sure_btn").click(function(){
    window.location.href="/relogin.do";
});
function cakeShop(){
    $.ajax({
        type: "POST",
        url: "notice.do",
        data: {

        },
        success:function(data){
            if(data==""){
                $("#prompt_modal").modal("show")
            }else{
                var picNam=$(".pro-list-title").html();
                var price=$(".detail-price").text().split(".")[0].replace("￥","");
                console.log(picNam);
                console.log(price);
                $.ajax({
                    type: "POST",
                    url: "addShop.do",
                    data: {
                        picNam:picNam,
                        price:price,
                        guige:guige
                    },
                    success: function (data){
                        $.ajax({
                            type:"get",
                            url:"gouwuche.do",
                            data:{

                            },
                            success:function(data){
                                window.location.href="gouwuche.do";
                            }
                        })
                    }
                })
            }
        }
    })
}
