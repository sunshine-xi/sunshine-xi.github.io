/**
 * Created by Llh on 2017/7/27.
 */
//周边页面分类信息的分开展示
function choseCheck(obj){
    var show=$(obj).text();
    $.ajax({
        type:"POST",
        url:"/fenlei.do",
        data:{
            zz:show
        },
        success:function(data){
            $("#allimg").html("");
            if(show!="全部周边"){
                $("#allimg").html("");
                $(".waikuang").hide();
                $.each(data, function (i, n) {
                    $("#allimg").html($("#allimg").html() + "<li class='list-goods-pr1 pro-list-su col-lg-3 col-sm-3 col-md-3 col-xs-12'>" +
                        "<img src='"+n.periphery_img+"' class='img-responsive' alt=''>" +
                        "<h3>" +
                        "<em>"+n.periphery_name+"</em>"+
                        "<span>¥"+n.periphery_price+"</span>" +
                        "</h3>" +
                        "<div id='a' class='pro-list-linkOne gouwuche' onclick='cakeShop(this)'>"+
                        "<img src='images/icon_08.png' alt=''>"+
                        "加入购物车"+
                        "</div></li>");
                })
            }else {
                $(".waikuang").show();
                $.each(data, function (i, n) {
                    $("#allimg").html($("#allimg").html() + "<li class='list-goods-pr1 pro-list-su col-lg-3 col-sm-3 col-md-3 col-xs-12'>" +
                        "<img src='"+n.periphery_img+"' class='img-responsive' alt=''>" +
                        "<h3>" +
                        "<em>"+n.periphery_name+"</em>"+
                        "<span>¥"+n.periphery_price+"</span>" +
                        "</h3>" +
                        "<div id='a' class='pro-list-linkOne gouwuche' onclick='cakeShop(this)'>"+
                        "<img src='images/icon_08.png' alt=''>"+
                        "加入购物车"+
                        "</div></li>");
                })
            }

        }
    })
}

//周边页面分类信息的分开展示
function choseType(obj){
    var show=$.trim($(obj).find(".sb").text());
    console.log(show)
    $.ajax({
        type:"POST",
        url:"/fenlei.do",
        data:{
            zz:show
        },
        success:function(data){
            $("#allimg").html("");
            $(".waikuang").hide();
            $.each(data, function (i, n) {
                $("#allimg").html($("#allimg").html() + "<li class='list-goods-pr1 pro-list-su col-lg-3 col-sm-3 col-md-3 col-xs-12'>" +
                    "<img src='"+n.periphery_img+"' class='img-responsive' alt=''>" +
                    "<h3>" +
                    "<em>"+n.periphery_name+"</em>"+
                    "<span>¥"+n.periphery_price+"</span>" +
                    "</h3>" +
                    "<div id='a' class='pro-list-linkOne gouwuche' onclick='cakeShop(this)'>"+
                    "<img src='images/icon_08.png' alt=''>"+
                    "加入购物车"+
                    "</div></li>");
            })

        }
    })
}


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
                //周边商品加入购物车
                var peripheryName = $(obj).parent().find("h3 em").text();//获取商品名
                console.log(peripheryName);
                $.ajax({
                    method: "post",
                    url: "/gouwuche.do",
                    data: {
                        peripheryName: peripheryName
                    },
                    success:function(data){
                        window.location.href="/gouwuche.do"
                    }
                });
            }
        }
    })
}