/**
 * Created by lp on 2017-08-04.
 */
/*===========banner图动效============*/
window.onload=function(){
    $(".backOne").css("transition","all 2s linear");
    $(".backOne").css("transform","scale(1.1)");
};
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
//
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
                var price=$(".detail-price").text().split(".")[0].replace("¥","");
                console.log($(".detail-price").text().split(".")[0].replace("¥",""));
                $.ajax({
                    type: "POST",
                    url: "addTea.do",
                    data: {
                        picNam:picNam,
                        price:price
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
