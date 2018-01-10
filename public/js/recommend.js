

//获取组合商品价格
//var total_price=0;
//var total_price=parseInt($(".first-price").text());
$(function(){
    $("input[name='Productone']").on("click",function(){
        total_price=parseInt($(this).parent().parent().parent().parent().parent().next().find(".first-price").text());
        var pongshuPrice=$(this).parent().parent().parent().parent().parent().parent().next().find("ul").next().find("span");
        //console.log(pongshuPrice);
        //var ValueSz=[];
        //var price_obj=$(this).next();
        var price=parseInt($(this).val());
        //console.log(price);
        if($(this).is(':checked')){
            total_price+=price;
        }else{
            total_price-=price;
        }
        //$(pongshuPrice).html(total_price);
        //console.log(total_price);
        var test=$(this).parent().parent().parent().parent().parent().next().find(".first-price");
        test.html(total_price);
        //$(".first-price").html(total_price);
        //$(".last-price").html(total_price);
    });

    $("input[name='Productone']").each(function(){
        $(this).attr("checked",false)
    });




//商品重量选择样式确认
    $(function(){
        $(".birth-size li a").click(function(){
            var thisToggle = $(this).is(".size-toggle")?$(this):$(this).prev();
            var checkBox = thisToggle.prev();
            checkBox.trigger("click");
            $(".size-toggle").removeClass("current");
            thisToggle.addClass("current");
            return false;
        });

    });
//获取商品重量价格


    $(".birth-size li a").click(function(){
        var WtValue = total_price;
        WtValue+=parseInt($(this).prev().val());
        //console.log(WtValue);
        //var text = $(this).html();
        $(".birthday-text span").html(WtValue);
        pongss=$(this).text();
        //console.log(pongss);
    });


//加入购物车切换重量功能


    $(".birthday-btn .bth-btn").on("click",function(){
        var select= $(this).parent().parent().parent().find(".birth-select");
        //console.log(select);
        var birthTeam=$(this).parent().parent();
        //console.log(birthTeam);
        //var select = $(".birth-select");
        // var birthTeam=$(".birth-team");
        select.show();
        birthTeam.hide();
    });
    $('.btn-giveup').on("click",function(){
        var select = $(".birth-select");
        var birthTeam = $(".birth-team");
        select.hide();
        birthTeam.show();
    });
});

//var ValueSum=400;//商品初始化价格
//var ValueSz;
//$("input[name='Productone']").on("click",function(){
//    ValueSz=[];
//    $("input[name='Productone']:checked").each(function(){
//        ValueSz.push($(this).val());
//    });
//    //console.log(ValueSz);
//    //for(var i=0;i<ValueSz.length;i++){
//    //    //ValueSum = 400;
//    //  ValueSum+=parseInt(ValueSz[i]);
//    //}
//    //$(".first-price").html(ValueSum);
//    //$(".last-price").html(ValueSum);
//    bb();
//    //return false;
//    //return ValueSum;
//    //console.log(ValueSum);
//});
////console.log(ValueSum);
////获取组合后价格
//var bb=function(){
//    for(var i=0;i<ValueSz.length;i++){
//        //ValueSum = 400;
//      ValueSum+=parseInt(ValueSz[i]);
//    }
//    $(".first-price").html(ValueSum);
//    $(".last-price").html(ValueSum);
//
//};
//$("input[name='Productone']").on("click",function(){
//    for(var i=0;i<ValueSz.length;i++){
//        ValueSum+=parseInt(ValueSz[i]);
//        //return ValueSum;
//    }
//    $(".first-price").html(ValueSum);
//    $(".last-price").html(ValueSum);
//
//});
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
                var Totalsum=$(obj).parent().parent().find("span").text() ;
                console.log(Totalsum);
                var gouwu=$(obj).parent();
                var productid=$(obj).parent().parent().parent().parent().parent().find(".text-center").find("img").attr("src");
                console.log(productid);
                console.log(pongss);
                $.ajax({
                        type:"POST",
                        url:"tjshopping.do",
                        data:{
                            Totalsum:Totalsum,
                            wg:pongss,
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
                );
            }
        }
    })
}
