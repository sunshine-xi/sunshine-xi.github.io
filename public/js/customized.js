/**
 * Created by Llh on 2017/7/13.
 */
//底座的选择
//第一张底座
var img1 = document.getElementById("img1");
$("#dianji1").click(function(){
    $(img1).show();
    $(img2).hide();
    $(img3).hide();
});
//第二张底座
var img2 = document.getElementById("img2");
$("#dianji2").click(function(){
    $(img2).show();
    $(img1).hide();
    $(img3).hide();
});
//第三张底座
var img3 = document.getElementById("img3");
$("#dianji3").click(function(){
    $(img3).show();
    $(img2).hide();
    $(img1).hide();
});
//蛋糕的尺寸大小选择
$(".fa-square-o").click(function(){
    $(this).attr("class","fa fa-check-square");
    $(this).siblings().attr("class","fa fa-square-o");

});

//蛋糕主材料的选择
$("#typeInout").click(function(){
    var zcl=$(this).val();
    //$(".yuLan").append(zcl);
});
//蛋糕的辅材料选择
$("#typeInout1").click(function(){
    var fcl=$(this).val();
    //$(".yuLan").append(fcl);
});
//蛋糕装饰选择
$("#typeInout2").click(function(){
    var zs=$(this).val();
    //$(".yuLan").append(zs);
});
//包装盒选择
$(".baozhuangBox").click(function(){
    $(this).find("img")[0].src;//获取图片的src
    $(this).find("img").css("border","3px solid #BB9772");//给点击的图片添加一个边框
    //console.log($(this).find("img")[0].src)
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
                //提交订单
                var chicun=$(".fa-check-square").text();//获取选择的蛋糕尺寸
                var zhucailiao=$("#typeInout").val();//获取主材料的值
                var fuchailiao=$("#typeInout1").val();//获取辅材料的值
                var zhuangshi=$("#typeInout2").val();//获取装饰的值
                $.ajax({
                    method:"post",
                    url:"/dingzhitijiao.do",
                    data:{
                        chicun:chicun,
                        zhucailiao:zhucailiao,
                        fuchailiao:fuchailiao,
                        zhuangshi:zhuangshi
                    },
                    success:function(data){
                        window.location.href="/gouwuche.do"
                    }
                })
            }
        }
    })
}