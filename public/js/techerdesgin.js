
$(function(){
    $(".desgin h5").mouseover(function(){
        $(this).css("color","#BB9772");
    }).mouseleave(function(){
        $(this).css("color","#684029 ");
    });
    $(".addGoods").mouseover(function(){
        $(this).css("color","#BB9772");
    }).mouseleave(function(){
        $(this).css("color","#684029 ");
    });
//全部分类点击
    $(".select-card ol li:nth-of-type(2)").click(function(){
        shuaxin1();
    });

    function shuaxin1(){
        $(".title").show(500);
        $.ajax({
            type:"POST",
            url:"desginSearch.do",
            data:{

            },
            success:function(data){
                //console.log(data);
                $(".desgin ul").html("");
                $.each(data,function(i,n){
                    $(".desgin ul").html($(".desgin ul").html()+
                        "<li class='col-lg-3 text-center'>"+
                            "<a href='desgingift.do?name="+n.gift_img+"'>"+
                            //"<img src='' alt=''/>"+
                            "<img src='"+n.gift_img +"' class='img-responsive desginimg' alt=''/>"+
                            "<h5>"+ n.gift_name+"</h5>"+
                            "<span>"+"￥"+n.gift_price +"/个"+"</span>"+
                        "</a>"+
                          "<div class='addGoods' onclick='cakeShop(this)'>" +
                        "<i class='fa fa-cart-plus' aria-hidden='true'></i>" +
                        "加入购物车" +
                        "</div>"+
                        "</li>"
                    );
                    //console.log(n.gift_img);
                });

            }
        });

    }
    //$(".select-card ol li:nth-of-type(2)").click(function(){
    //  $(".title").show(500);
    //    $.ajax({
    //        type:"POST",
    //        url:"desginSearch.do",
    //        data:{
    //
    //        },
    //        success:function(data){
    //            //console.log(data);
    //            $(".desgin ul").html("");
    //            $.each(data,function(i,n){
    //                $(".desgin ul").html($(".desgin ul").html()+
    //                    "<li class='col-lg-3 text-center'>"+
    //                    "<a href='giftdetail.html'>"+"<img src='' alt=''/>"+
    //                    "<img src='"+n.gift_img +"' class='img-responsive desginimg' alt=''/>"+
    //                "<h5>"+ n.gift_name+"</h5>"+
    //                "<span>"+"￥"+n.gift_price +"/个"+"</span>"+
    //                "</a>"+
    //                "<a href='gouwuche2.html' class='addGoods'>"+
    //                    "<i class='fa fa-cart-plus' aria-hidden='true'>"+"</i>"
    //                    +"加入购物车"+
    //                    "</a>"+
    //                    "</li>"
    //                 );
    //            })
    //        }
    //    })
    //});
//礼品点击刷新
    $(".select-card ol li:nth-of-type(3)").click(function(){
        $(".title").hide(500);
        $.ajax({
            type:"POST",
            url:"desginSearch2.do",
            data:{

            },
            success:function(data){
                $(".desgin ul").html("");
                $.each(data,function(i,n){
                    $(".desgin ul").html($(".desgin ul").html()+
                        "<li class='col-lg-3 text-center'>"+
                          "<a href='desgingift.do?name="+n.gift_img+"'>"+
                        //"<img src='' alt=''/>"+
                          "<img src='"+n.gift_img +"' class='img-responsive desginimg' alt=''/>"+
                          "<h5>"+ n.gift_name+"</h5>"+
                          "<span>"+"￥"+n.gift_price +"/个"+"</span>"+
                          "</a>"+
                        "<div class='addGoods' onclick='cakeShop(this)'>" +
                        "<i class='fa fa-cart-plus' aria-hidden='true'></i>" +
                        "加入购物车" +
                        "</div>"+
                        "</li>"
                    );
                    //console.log(n.gift_img);
                });

            }
        });

    });


//购买功能

    //$(".Adding").click(function(){
    //    var productid=$(this).parent();
    //    console.log(productid);
    //
    //
    //});


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
                var productid=$(obj).parent().find("img").attr("src");
                var price=$(obj).parent().find("span").text();
                $.ajax({
                        type:"POST",
                        url:"Adding.do",
                        data:{
                            productid:productid,
                            //name:name,
                            price:price
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