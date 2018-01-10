/*Created by about evol on 2017/7/20.*/
//window.onload=function(){
//    $("#prompt_modal").modal("hide");
//    $("#notBox").modal("hide");
//};
$('.modal').modal(
    {
        backdrop:'static',
        keyboard: true
    });

function choseSty(obj){
    $(obj).css("color","#BF9D7F");
    $(obj).siblings().css("color","#765751");
    $.ajax({
        type: "POST",
        url: "allCake.do",
        data: {
            cakeValue:$(obj).text()
        },
        success: function (data) {
            console.log(data)
            $("#allList").html("");
            $.each(data, function (i, n) {
                $("#allList").html($("#allList").html() + "<li class='list-goods-pr1 pro-list-su col-lg-3 col-sm-3 col-md-3 col-xs-12'>"+
                    "<a href='/message.do?name="+n.pro_img+"'>"+
                    "<img src='"+n.pro_img+"' class='img-responsive'>"+
                    "<h3 id='mesvalue'><span class='name'>"+
                    n.pro_name+
                    "</span><p>¥<span class='price'>"+n.pro_price+"</span>磅</p>"+
                    "</h3>"+
                    "</a>"+
                    "<div class='pro-list-linkOne' onclick='cakeShop(this)'>"+
                    "<img src='images/icon_08.png' alt=''>"+
                    "加入购物车"+
                    "</div>"+
                    "</li>")
            })
        }
    });
}
function notice(){
    $.ajax({
        type: "POST",
        url: "notice.do",
        data: {

        },
        success:function(data){
            if(data==""){
                $("#prompt_modal").modal("show")
            }else{
                $("#notBox").modal("show")
            }
        }
    })
}

$("#prompt_sure_btn1").click(function(){
    $("#notBox").modal("hide")
});
$("#prompt_sure_btn").click(function(){
    window.location.href="/relogin.do";
});
function cakeShop(obj){
    $.ajax({
        type: "POST",
        url: "notice.do",
        data: {

        },
        success:function(data){
            if(data==""){
                $("#prompt_modal").modal("show")
            }else{
                var picNam=$(obj).parent().find("#mesvalue .name").text();
                var price=$(obj).parent().find("#mesvalue .price").text();
                var final=price.replace(".00","");
                $.ajax({
                    type: "POST",
                    url: "/addProduct.do",
                    data: {
                        picNam:picNam,
                        price:final
                    },
                    success:function(data){
                        $.ajax({
                            type:"get",
                            url:"/gouwuche.do",
                            data:{

                            },
                            success:function(data){
                                window.location.href="/gouwuche.do";
                            }
                        })
                    }
                })
            }
        }
    })
}
var i=4;
function ani(classname,type1,type2,type3,type4){
    if(($("."+classname).offset().top - $(window).scrollTop())<$(window).height()){
        $("."+classname).find("li").eq(0).addClass(type1);
        $("."+classname).find("li").eq(1).addClass(type2);
        $("."+classname).find("li").eq(2).addClass(type3);
        $("."+classname).find("li").eq(3).addClass(type4);
    }
    $(window).scroll(function(){
        if(($("."+classname).find("li").eq(i).offset().top - $(window).scrollTop()+10)<$(window).height()){
            $("."+classname).find("li").eq(i).addClass(type1);
            $("."+classname).find("li").eq(i+1).addClass(type2);
            $("."+classname).find("li").eq(i+2).addClass(type3);
            $("."+classname).find("li").eq(i+3).addClass(type4);
            i=i+4;
        }
        if(i>$("."+classname).find("li").length){
            i=0;
        }
    });
}
ani("pro-list-pr","bounceIn","bounceIn","bounceIn","bounceIn");