/*Created by about evol on 2017/7/20.*/
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
                var final=price.substring(1,4);
                var finalPrice=final.replace(".","");
                $.ajax({
                    type: "POST",
                    url: "/addTea.do",
                    data: {
                        picNam:picNam,
                        price:finalPrice
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

$('.modal').modal(
    {
        backdrop:'static',
        keyboard: true
    });
function choseSty(obj){
    $(obj).html();
    $(obj).css("color","#BF9D7F");
    $(obj).siblings().css("color","#765751");
    $.ajax({
        type: "POST",
        url: "/allTea.do",
        data: {
            teaValue:$(obj).text()
        },
        success: function (data) {
            $("#allList").html("");
            console.log($(obj).text());
            if($(obj).text()=="全部分类"||$(obj).text()==="全部口味"){
                $("#allList").css("display","none");
                $(".pro-list-box").css("display","block");
                $(".pro-list-pr").css("display","block");
            }else{
                $(".pro-list-box").css("display","none");
                $(".pro-list-pr").css("display","none");
                $("#allList").css("display","block");
            }
            $.each(data, function (i, n) {
                $("#allList").html($("#allList").html() + "<li class='list-goods-pr1 pro-list-su col-lg-3 col-sm-3 col-md-3 col-xs-12'>"+
                    "<a href='/teaMessage.do?name="+n.pro_img+"'>"+
                    "<img src='"+n.pro_img+"' class='img-responsive'>"+
                    "<h3 id='mesvalue'><p class='name'>" +
                    n.pro_name+
                    "</p>"+
                    "<span class='price'>¥"+n.pro_price+"</span>"+
                    "</h3>"+
                    "</a>"+
                    "<div class='pro-list-linkOne' onclick='cakeShop(this)'>" +
                     "<img src='images/icon_08.png' alt=''>" +
                    "加入购物车" +
                    "</div>"+
                    "</li>")
            })
        }
    });
}
function notice(){
    console.log(111);
    $.ajax({
        type: "POST",
        url: "/notice.do",
        data: {

        },
        success:function(data){
            if(data==""){
                $(".landBox").css("display","block");
            }else{
                $(".notBox").css("display","block");
            }
        }
    })
}
$("#prompt_sure_btn").click(function(){
    window.location.href="login.html";
});
$("#close1").click(function(){
    $(".landBox").css("display","none");
});
$("#prompt_sure_btn1").click(function(){
    $(".notBox").css("display","none");
});
var i=4;
function ani(claname,type1,type2,type3,type4){
    if(($("."+claname).offset().top - $(window).scrollTop())<$(window).height()){
        $("."+claname).find("li").eq(0).addClass(type1);
        $("."+claname).find("li").eq(1).addClass(type2);
        $("."+claname).find("li").eq(2).addClass(type3);
        $("."+claname).find("li").eq(3).addClass(type4);
    }
    $(window).scroll(function(){
        if(($("."+claname).find("li").eq(i).offset().top - $(window).scrollTop()+10)<$(window).height()){
            $("."+claname).find("li").eq(i).addClass(type1);
            $("."+claname).find("li").eq(i+1).addClass(type2);
            //$("."+claname).find("li").eq(i+2).addClass(type3);
            //$("."+claname).find("li").eq(i+3).addClass(type4);
            i=i+2;
        }
        if(i>$("."+claname).find("li").length){
            i=0;
        }
    });
}
ani("pro-list-pr","bounceIn","bounceIn","bounceIn","bounceIn");