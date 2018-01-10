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
        Time2.setHours(Time.getHours()+6);
        var times = Time2.getHours();
        //console.log(times);
        if(times>=22){
            booktime.innerHTML="明日9:30"
        }else if(times<22){
            booktime.innerHTML=times+":00";
        }
    }
    getdates();

    //
  //var  button=$(".btn-give-up");
  //  //console.log(button);
  // var button1=$(".btn-que-ren");
  //  //console.log(button1);
  //  button.attr({"disabled":"disabled"});
  //  button1.attr({"disabled":"disabled"});
  //  button1.css({"background-color":"#B6B6B6"});
  //  button.css({"background-color":"#F4F4F4"});
};

//商品磅数样式
$(function(){
    //商品磅数选择
    $(".right-size li a").click(function(){
        $(".size-toggle").toggleClass("current");
        return false;
    });

    //商品磅数选择后更换相关数据
    $(".right-size li a").click(function(){
        Price=$(this).prev().val();
        console.log(Price);
        guige=$(this).find("span").text();
        console.log(guige);
        productid=$(this).parent().parent().parent().parent().parent().parent().parent().prev().find("img").attr("src");
        console.log(productid);
        //var  button=$(this).parent().parent().parent().parent().next().next().find(".btn-give-up");
        ////console.log(button);
        //var button1=$(this).parent().parent().parent().parent().next().next().find(".btn-que-ren");
        //button.removeAttr({"disabled":"disabled"});
        //button1.removeAttr({"disabled":"disabled"});
        //button1.css({"background-color":"#B6B6B6"});
        //button.css({"background-color":"#F4F4F4"});
        $(".shoppingDo").css("display","none");
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
                //加入购物车拦截
                //console.log(Price);
                //console.log(guige);
                //console.log(productid);
                $.ajax({
                    type:"POST",
                    url:"teamdetailing.do",
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
                //立即购买加入购物车功能
                var gouwu=$(this).parent();
                $.ajax({
                        type:"POST",
                        url:"teamdetailing.do",
                        data:{
                            price:Price,
                            guige:guige,
                            productid:productid
                        },
                        success:function(data){
                            $.ajax({
                                type:"get",
                                url:"gouwuche.do",
                                data:{
                                },
                                success:function(data){
                                    window.location.href="gouwuche.do"
                                }
                            })
                        }
                    }
                )
            }
        }
    })
}
