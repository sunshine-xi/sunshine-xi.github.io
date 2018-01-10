//banner加载样式
window.onload=function(){
    var goodsdetail=document.getElementsByClassName("goods-detail")[0];
    goodsdetail.style.transform="scale(1.1)";
    goodsdetail.style.transition="all 4s linear";
    goodsdetail.style.opacity="1";

    //获取系统时间
    function getdates(){

        var booktime=document.getElementsByClassName("now-time")[0];
        var Time= new Date();
        var Time2= new Date(Time);
        Time2.setHours(Time.getHours()+5);
        var times = Time2.getHours();
        //console.log(times);
        if(times>8&&times<21){
            booktime.innerHTML=times+":00";
        }
        if(times>=22){
            booktime.innerHTML="明日9:30";
        }
        if(times<=8){
            booktime.innerHTML="明日9:30";
        }
    }
    getdates();
};

$(function(){

    //商品磅数选择
    $(".right-size li a").click(function(){
        $(".size-toggle").toggleClass("current");
        //Price=$(this).prev().val();
        //console.log(Price);
        return false;
    });


    //商品磅数选择后更换相关数据
    $(".right-size li a").click(function(){
        Price=$(this).prev().val();
        console.log(Price);
        guige=$(this).find("span").text();
        console.log(guige);
        //Goodstittle=$(this).parent().parent().parent().parent().parent().parent().parent().find("h2").text();
        //console.log(Goodstittle);
        productid=$(this).parent().parent().parent().parent().parent().parent().parent().prev().find("img").attr("src");

        //var btnone=$(this).parent().parent().parent().parent().next().find(".btn-give-up");
        //console.log(btnone);
        //var btnrwo=$(this).parent().parent().parent().parent().next().find(".btn-que-ren");
        //console.log(btnrwo);
        console.log(productid);

        $(".shoppingDo").css("display","none");
        //if(guige!="个"){
        //    btnone.attr({"disabled":"disabled"});
        //    btnrwo.attr({"disabled":"disabled"});
        //    btnrwo.css({"background-color":"#B6B6B6"});
        //    btnone.css({"background-color":"#F4F4F4"});
        //}
        //if(guige=='个'){
        //    btnone.removeAttr("disabled");
        //    btnrwo.removeAttr("disabled");
        //    btnrwo.css({"background-color":"#684029"});
        //    btnone.css({"background-color":"#DDDDDD"});
        //}
    });
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
                $.ajax({
                    type:"POST",
                    url:"giftshopping.do",
                    data:{
                        price:Price,
                        guige:guige,
                        productid:productid
                    }
                });
                $(".shoppingDo").css("display","block");
            }
        }
    })
}

function shop(obj){
    $.ajax({
        type: "POST",
        url: "notice.do",
        data: {

        },
        success:function(data){
            if(data==""){
                $("#prompt_modal").modal("show")
            }else{
                var gouwu=$(this).parent();
                $.ajax({
                    type:"POST",
                    url:"/giftshopping.do",
                    data:{
                        price:Price,
                        guige:guige,
                        productid:productid
                    },
                    success:function(data){
                        $.ajax({
                            type:"get",
                            url:"/gouwuche.do",
                            data:{
                            },
                            success:function(data){
                                window.location.href="/gouwuche.do"
                            }
                        })
                    }
                });
            }
        }
    })
}


