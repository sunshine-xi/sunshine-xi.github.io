//banner加载样式
window.onload=function(){
    var goodsdetail=document.getElementsByClassName("goods-detail")[0];
    goodsdetail.style.transform="scale(1.1)";
    goodsdetail.style.transition="all 2s linear";
    goodsdetail.style.opacity="1";

    //获取系统时间
    function getdates(){

        var booktime=document.getElementsByClassName("now-time")[0];
        var Time= new Date();
        var Time2= new Date(Time);
        Time2.setHours(Time.getHours()+6);
        var times = Time2.getHours();
        //console.log(times);
        if(times>8&&times<21){
            booktime.innerHTML=times+":30";
        }
        if(times>=22){
            booktime.innerHTML="明日14:30";
        }
        if(times<=8){
            booktime.innerHTML="明日14:30";
        }
        //else if(times<22){
        //    booktime.innerHTML=times+":00";
        //}
    }
    getdates();

    //gg();
    //console.log(ggValue)
};
function gg(){
    ggValue= $(".current").find("span").text();
    ggPong=$(".current").prev().val();

}
//商品组合价格
var zuheArry=[];
var zuheSumprice=0;
$(".Team input").each(function(){
    zuheArry.push($(this).val())
});
//console.log(zuheArry);
for(var i=0;i<zuheArry.length;i++){
    zuheSumprice+=parseInt(zuheArry[i]);
}
//console.log(zuheSumprice);
$(".Team-btn h4 span").html(zuheSumprice);

//商品磅数默认勾选
//$(".right-size li .moren").addClass("current");

//商品磅数选择
$(".right-size li a").click(function(){
    var thisToggle = $(this).is(".size-toggle")?$(this):$(this).prev();
    var checkBox = thisToggle.prev();
    checkBox.trigger("click");
    $(".size-toggle").removeClass("current");
    thisToggle.addClass("current");
    $(".tipps").html('');
    //Zl=$(this).find("span").text();
    Zl=$(this).prev().val();
    //console.log(Zl);
    $(".shoppingDo").css("display","none");
    pong=$(this).find("span").text();
    console.log(pong);
    return false;
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
                gg();
                // console.log(pong);
                // alert(11);
                // var  gg=true;
                if(ggValue=='2.0磅'){
                    var productId1=$(obj).parent().parent().parent().parent().parent().prev().find("img").attr("src");
                    var money1=$(obj).parent().parent().parent().parent().prev().find(".price").text();
                    console.log(money1);
                    var pong1="2.0磅";
                    $.ajax({
                        type:"POST",
                        url:"Addsee.do",
                        data:{

                            productId:productId1,
                            money:money1,
                            //Goodstittle:Goodstittle,
                            pongs:pong1
                        }
                    });
                    if(ggPong!=0){
                        $(".shoppingDo").css("display","block");
                    }
                    if(ggPong==0){
                        $(".shoppingDo").css("display","none");
                    }
                    //return gg=false;
                }
                else{
                    //加入购物车拦截
                    var productId=$(obj).parent().parent().parent().parent().parent().prev().find("img").attr("src");
                    var money=$(obj).parent().parent().parent().parent().prev().find(".price").text();
                    //console.log(money);
                    $.ajax({
                        type:"POST",
                        url:"Addsee.do",
                        data:{

                            productId:productId,
                            money:money,
                            //Goodstittle:Goodstittle,
                            pongs:pong
                        }
                    });
                }

                if(Zl!=0){
                    $(".shoppingDo").css("display","block");
                }
                if(Zl==0){
                    $(".shoppingDo").css("display","none");
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
                gg();
                if(ggValue=='2.0磅'){
                    var productId1=$(obj).parent().parent().parent().parent().parent().parent().prev().find("img").attr("src");
                    var money1=$(obj).parent().parent().parent().parent().parent().prev().find(".price").text();
                    var pong1="2.0磅";
                    $.ajax({
                        type:"POST",
                        url:"Addsee.do",
                        data:{
                            productId:productId1,
                            money:money1,
                            //Goodstittle:Goodstittle,
                            pongs:pong1
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
                }else{
                    //立即购买加入购物车功能
                    var productId=$(obj).parent().parent().parent().parent().parent().parent().prev().find("img").attr("src");
                    var gouwu=$(obj).parent();
                    // console.log(gouwu);
                    //console.log(productId);
                    //var Goodstittle=$(this).parent().parent().parent().prev().prev().find(".right-size").find("p").find("span").text();
                    //console.log(pong);
                    //console.log(Goodstittle);

                    var money=$(obj).parent().parent().parent().parent().parent().prev().find(".price").text();
                    //console.log(money);
                    $.ajax({
                        type:"POST",
                        url:"Addsee.do",
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
        }
    })
}


//组合商品加入购物车
function teamShop(obj){
    $.ajax({
        type: "POST",
        url: "notice.do",
        data: {

        },
        success:function(data){
            if(data==""){
                $("#prompt_modal").modal("show")
            }else{
                var teamSum=$(obj).parent().prev().find("h4").text();
                //console.log(teamSum);
                var productid=$(obj).parent().parent().prev().prev().find(".imgban").attr("src");
                //console.log(productid);
                //var name=$(this).parent().prev().prev().find(".name1").text();
                //console.log(name);
                $.ajax({
                    type:"POST",
                    url:"teamprice.do",
                    data:{
                        productid:productid,
                        teamSum:teamSum
                        //name:name
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
                })
            }
        }
    });


}








//查看购物车消失时间
//   function


//商品磅数选择后更换相关数据
//$(".right-size li a").click(function(){
//    var dataChangeoone=$(this).parent().parent().parent().parent().prev().first();
//    //var dataChangetwo=$(this).parent().parent().parent().parent().prev().find("ul");
//    //dataChangeoone.html("");
//    dataChangeoone.html("");
//    //var dataChange=$(this).prev().val();
//    var dataChange=$(this).prev().val();
//    console.log(dataChange);
//
//    if(dataChange==398){
//        dataChangeoone.html(
//            "<div class='col-lg-6'>"+
//            "<img src='images/1.00P-full-12.00.jpg' class='product-detail-right-img' alt=''/>"+
//            "</div>"+
//            "<div class='col-lg-6 product-detail-right'>"+
//            "<ul>"+
//            "<li>"+
//            "<img src='images/icon4.png' alt=''/>"+
//            "<span>"+"13~13cm"+"</span>"+
//            "</li>"+
//            "<li>"+
//            "<img src='images/icon5.png' alt=''/>"+
//            "<span>"+"适合3-4人分享"+"</span>"+
//            "</li>"+
//            "<li>"+
//            "<img src='images/icon6.png' alt=''/>"+
//            "<span>"+"含5套餐具"+"</span>"+
//            "</li>"+
//            "<li>"+
//            "<img src='images/icon7.png' alt=''/>"+
//            "<span>"+"需提前6小时预订"+"</span>"+
//            "</li>"+
//            "</ul>"+
//            "</div>"
//        );
//    }else if(dataChange==500){
//        dataChangeoone.html(
//
//            "<div class='col-lg-6'>"+
//            "<img src='images/1.50P-full-15.00.jpg' class='product-detail-right-img' alt=''/>"+
//            "</div>"+
//            "<div class='col-lg-6 product-detail-right'>"+
//            "<ul>"+
//            "<li>"+
//            "<img src='images/icon4.png' alt=''/>"+
//            "<span>"+"15~15cm"+"</span>"+
//            "</li>"+
//            "<li>"+
//            "<img src='images/icon5.png' alt=''/>"+
//            "<span>"+"适合5-6人分享"+"</span>"+
//            "</li>"+
//            "<li>"+
//            "<img src='images/icon6.png' alt=''/>"+
//            "<span>"+"含5套餐具"+"</span>"+
//            "</li>"+
//            "<li>"+
//            "<img src='images/icon7.png' alt=''/>"+
//            "<span>"+"需提前6小时预订"+"</span>"+
//            "</li>"+
//            "</ul>"+
//            "</div>"
//        );
//    }else if(dataChange==600){
//        dataChangeoone.html(
//
//            "<div class='col-lg-6'>"+
//            "<img src='images/2.00P-full-16.00.jpg' class='product-detail-right-img' alt=''/>"+
//            "</div>"+
//            "<div class='col-lg-6 product-detail-right'>"+
//            "<ul>"+
//            "<li>"+
//            "<img src='images/icon4.png' alt=''/>"+
//            "<span>"+"17~17cm"+"</span>"+
//            "</li>"+
//            "<li>"+
//            "<img src='images/icon5.png' alt=''/>"+
//            "<span>"+"适合7-8人分享"+"</span>"+
//            "</li>"+
//            "<li>"+
//            "<img src='images/icon6.png' alt=''/>"+
//            "<span>"+"含10套餐具"+"</span>"+
//            "</li>"+
//            "<li>"+
//            "<img src='images/icon7.png' alt=''/>"+
//            "<span>"+"需提前6小时预订"+"</span>"+
//            "</li>"+
//            "</ul>"+
//            "</div>"
//        );
//    }
//
//    //console.log(dataChangeoone);
//    //console.log(dataChangetwo);
//});
//商品磅数选择后更换相关数据

$(".right-size li a").click(function(){
    var dataChangeoone=$(this).parent().parent().parent().parent().prev().first();
    //console.log(dataChangeoone);
    var dataprice=$(this).parent().parent().parent().parent().parent().parent().prev().find(".price");
    //console.log(dataprice);
    var dataChangetwo=$(this).parent().parent().parent().parent().next().next().find(".btn-give-up");
    var dataChangethree=$(this).parent().parent().parent().parent().next().next().find(".btn-que-ren");
    //console.log(dataChangetwo);
    var dataChangetwoo=$(this).parent().parent().parent().parent().next().next().find(".btn-give-up").text();
    var datapongs=$(this).find("span").text();
    var dataChange=parseInt($(this).prev().val());
    //var Iceprice=$(".Team-price").text();
    //var Icepricetwo=Iceprice.split("￥");
    // var myPrice=
    //console.log(Iceprice);
    //console.log(Icepricetwo[1]);
    var teamprice=$(this).parent().parent().parent().parent().parent().parent().parent().next().next().find(".Team-btn").find("h4");
    var teampricegods=$(this).parent().parent().parent().parent().parent().parent().parent().next().next().find(".Team-first-price");

    var yuanjia=$(this).parent().parent().parent().parent().parent().parent().parent().next().next().find(".yuanjia");
    //console.log(yuanjia);

    //console.log(teamprice);
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


        dataChangeoone.html(
            "<div class='col-lg-6'>"+
            "<img src='images/sizemore.jpg' class='product-detail-right-img' alt=''/>"+
            "</div>"+
            "<div class='col-lg-6 product-detail-right'>"+
            "<ul>"+
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

        dataprice.html("￥"+dataChange+"/"+datapongs);
        teamprice.html("组合价：￥"+(dataChange+39)+"/"+datapongs);
        teampricegods.html("￥"+dataChange+"/"+datapongs);
        yuanjia.html("原价：￥"+(dataChange+60));
        dataChangetwo.removeAttr("disabled");
        dataChangethree.removeAttr("disabled");
        dataChangethree.css({"background-color":"#684029"});
        dataChangetwo.css({"background-color":"#DDDDDD"});

        $.ajax({
            type:"POST",
            url:"pongs.do",
            data:{
                pons:dataChange
            },
            success:function(data){
                dataChangeoone.html("");
                $.each(data,function(i,n){
                    dataChangeoone.html(
                        "<div class='col-lg-6'>"+
                        "<img src='"+n.ps_img1 +"' class='product-detail-right-img' alt=''/>"+
                        "</div>"+
                        "<div class='col-lg-6 product-detail-right'>"+
                        "<ul>"+
                        "<li>"+
                        "<img src='images/icon4.png' alt=''/>"+
                        "<span>"+n.ps_ms+"</span>"+
                        "</li>"+
                        "<li>"+
                        "<img src='images/icon5.png' alt=''/>"+
                        "<span>"+n.ps_ms1+"</span>"+
                        "</li>"+
                        "<li>"+
                        "<img src='images/icon6.png' alt=''/>"+
                        "<span>"+n.ps_ms2+"</span>"+
                        "</li>"+
                        "<li>"+
                        "<img src='images/icon7.png' alt=''/>"+
                        "<span>"+n.ps_ms3+"</span>"+
                        "</li>"+
                        "</ul>"+
                        "</div>"
                    );
                })
            }
        });
    }
});

