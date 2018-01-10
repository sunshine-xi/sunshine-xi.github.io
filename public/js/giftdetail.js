//banner加载样式
window.onload=function(){
    var goodsdetail=document.getElementsByClassName("goods-detail")[0];
    goodsdetail.style.transform="scale(1.1)";
    goodsdetail.style.transition="all 4s linear";
    goodsdetail.style.opacity="1";

    //获取系统时间
    function getdates(){
        var Time= new Date();
        var Time2= new Date(Time);
        Time2.setDate(Time.getDate()+7);
        var times = Time2.getFullYear()+"-"+(Time2.getMonth()+1)+"-"+Time2.getDate();
        var booktime=document.getElementsByClassName("now-time")[0];
        booktime.innerHTML=times;
    }
    getdates();
};

//商品组合价格
$(function(){
    //商品磅数选择
    //$(".right-size li a").click(function(){
    //    $(".size-toggle").toggleClass("current");
    //    return false;
    //});
    $(".right-size li a").click(function(){
        var thisToggle = $(this).is(".size-toggle")?$(this):$(this).prev();
        var checkBox = thisToggle.prev();
        checkBox.trigger("click");
        $(".size-toggle").removeClass("current");
        thisToggle.addClass("current");
        $(".shoppingDo").css("display","none");
        pong=$(this).find("span").text();
        go=$(this).prev().val();
        return false;
    });




    //商品磅数选择后更换相关数据

    $(".right-size li a").click(function(){
        var datachange=$(this).parent().parent().parent().parent().prev();
        //console.log(datachange);
        var dataprice=$(this).parent().parent().parent().parent().parent().parent().prev().find(".tittle-price");
        //console.log(dataprice);
        var dataChangetwo=$(this).parent().parent().parent().parent().next().next().find(".btn-give-up");
        var dataChangethree=$(this).parent().parent().parent().parent().next().next().find(".btn-que-ren");
        //console.log(dataChangetwo);
        //console.log(dataChangethree);
        var dataChangetwoo=$(this).parent().parent().parent().parent().next().next().find(".btn-give-up").text();
        var datapongs=$(this).find("span").text();
        //console.log(datapongs);
        var dataChange=parseInt($(this).prev().val());
        //console.log(dataChange);

        if(dataChange==0){
            //dataChangetwo.mouseover(function(){
            //    alert("111");
            //    //dataChangetwo.html
            //    dataChangetwoo.html(
            //        "<i class='fa fa-ban' aria-hidden='true'>"+"请选择磅数"+"</i>"
            //    )
            //});
            dataprice.html('');
            dataChangetwo.attr({"disabled":"disabled"});
            dataChangethree.attr({"disabled":"disabled"});
            dataChangethree.css({"background-color":"#B6B6B6"});
            dataChangetwo.css({"background-color":"#F4F4F4"});
            datachange.html(
                "<div class='col-lg-12 product-detail-right'>"
                +"<ul class='row'>"+
                "<li>"+
                "<span>"+"需订购'更多磅数'，请与客服人员 "+"</span>"+
                "</li>"+
                "<li>"+
                "<span>"+"联系。"+"</span>"+
                "</li>"+
                "<li>"+
                "<span>"+"订购电话："+"</span>"+
                "</li>"+
                "<li>"+
                "<span>"+"400 650 2121"+"</span>"+
                "</li>"+
                "</ul>"+
                "</div>"
            );
            return;
        }

        if(dataChange!=0){

            dataChangetwo.removeAttr("disabled");
            dataChangethree.removeAttr("disabled");
            dataChangethree.css({"background-color":"#684029"});
            dataChangetwo.css({"background-color":"#DDDDDD"});

            if(dataChange==1500.00){

                dataprice.html("￥"+dataChange+"/"+datapongs);

                datachange.html(
                    "<div class='col-lg-12 product-detail-right'>"
                    +"<ul class='row'>"+
                    "<li>"+
                    "<img src='images/icon4.png' alt=''/>"
                    +"<span>"+"35x35cm"+"</span>"+
                    "</li>"+
                    "<li>"+
                    "<img src='images/icon5.png' alt=''/>"+
                    "<span>"+"适合30-40人享用"+"</span>"+
                    "</li>"+
                    "<li>"+
                    "<img src='images/icon6.png' alt=''/>"+
                    "<span>"+"含40套餐具"+"</span>"+
                    "</li>"+
                    "<li>"+
                    "<img src='images/icon_15.png' alt=''/>"
                    +"<span>"+"需提前168小时预订"+"</span>"
                    +"</li>"+
                    "</ul>"+
                    "</div>"
                );
            }else if(dataChange==3000.00){
                dataprice.html("￥"+dataChange+"/"+datapongs);
                datachange.html(
                    "<div class='col-lg-12 product-detail-right'>"
                    +"<ul class='row'>"+
                    "<li>"+
                    "<img src='images/icon4.png' alt=''/>"
                    +"<span>"+"55x55cm"+"</span>"+
                    "</li>"+
                    "<li>"+
                    "<img src='images/icon5.png' alt=''/>"+
                    "<span>"+"适合70-80人享用"+"</span>"+
                    "</li>"+
                    "<li>"+
                    "<img src='images/icon6.png' alt=''/>"+
                    "<span>"+"含80套餐具"+"</span>"+
                    "</li>"+
                    "<li>"+
                    "<img src='images/icon_15.png' alt=''/>"
                    +"<span>"+"需提前168小时预订"+"</span>"
                    +"</li>"+
                    "</ul>"+
                    "</div>"
                );
            }else if(dataChange==4500.00){
                dataprice.html("￥"+dataChange+"/"+datapongs);
                datachange.html(
                    "<div class='col-lg-12 product-detail-right'>"
                    +"<ul class='row'>"+
                    "<li>"+
                    "<img src='images/icon4.png' alt=''/>"
                    +"<span>"+"70x70cm"+"</span>"+
                    "</li>"+
                    "<li>"+
                    "<img src='images/icon5.png' alt=''/>"+
                    "<span>"+"适合100-120人享用"+"</span>"+
                    "</li>"+
                    "<li>"+
                    "<img src='images/icon6.png' alt=''/>"+
                    "<span>"+"含120套餐具"+"</span>"+
                    "</li>"+
                    "<li>"+
                    "<img src='images/icon_15.png' alt=''/>"
                    +"<span>"+"需提前168小时预订"+"</span>"
                    +"</li>"+
                    "</ul>"+
                    "</div>"
                );
            }
        }


        //console.log(dataChangeoone);
        //console.log(dataChangetwo);
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
                var productId=$(obj).parent().parent().parent().parent().parent().prev().find("img").attr("src");
                //console.log(productId);
                //var Goodstittle=$(this).parent().parent().parent().parent().parent().find("h2").text();
                //console.log(pong);
                //console.log(Goodstittle);

                var money=$(obj).parent().parent().parent().parent().parent().find(".tittle-price").text();
                //console.log(money);
                $.ajax({
                    type:"POST",
                    url:"companyAdd.do",
                    data:{

                        productId:productId,
                        money:money,
                        //Goodstittle:Goodstittle,
                        pongs:pong
                    }
                    //success:function(data){
                    //    window.location.href="/gouwuche.do";
                    //
                    //}
                });
                //console.log(Zl);
                if(go!=0){
                    //console.log("11");
                    $(".shoppingDo").css("display","block")
                }
                if(go==0){
                    $(".shoppingDo").css("display","none")
                }
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
                //立即购买加入
                var productId=$(obj).parent().parent().parent().parent().parent().parent().prev().find("img").attr("src");
                //console.log(productId);
                //var Goodstittle=$(this).parent().parent().parent().parent().parent().find("h2").text();
                //console.log(pong);
                //console.log(Goodstittle);
                var gouwu=$(obj).parent();

                var money=$(obj).parent().parent().parent().parent().parent().prev().find(".tittle-price").text();
                //console.log(money);
                $.ajax({
                    type:"POST",
                    url:"companyAdd.do",
                    data:{
                        productId:productId,
                        money:money,
                        //Goodstittle:Goodstittle,
                        pongs:pong
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
                });
            }
        }
    })
}

