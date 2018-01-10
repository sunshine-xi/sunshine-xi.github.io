/**
 * Created by lenovo on 2017/7/20.
 */
 $(function(){
     var fen=29;
     var miao=60;
//点击选择选择支付方式
var xzpayval;
$("input:radio[name='payway_img']").click(function(){
    $("input:radio[name='payway_img']").next().css("display","inline-block");
    $("input:radio[name='payway_img']").next().next().css("display","none");
    $(this).next().css("display","none");
    $(this).next().next().css("display","inline-block");
    xzpayval=$(this).val();
});
//选择支付方式跳转的页面
$("#h_surezfbtn").click(function(){
    if(xzpayval=="3"){
        window.location.href="https://www.jdpay.com/home/page"
    }
    else if(xzpayval=="2"){
        window.location.href="weixinzhifu.do"
    }
    else{
        window.location.href="zhifubaozhifu.do"
    }
});
var h_timer=setInterval(function(){
    miao--;
    $("#h_fen").text(fen);
    $("#h_miao").text(miao);
    if(miao<10){
        $("#h_miao").text("0"+miao);
    }
    if(miao<0){
        fen--;
        miao=59;
        $("#h_fen").text(fen);
        $("#h_miao").text(miao);
    }
    if(fen<=0&&miao<=0){
        clearInterval(h_timer);
        $("#prompt_modal .modal-header").text("订单已关闭！");
        $("#prompt_modal").modal("show")
    }

},1000);
});

//30分钟后订单关闭
function guanbidingdan(){
    var h_dingdanhao=$("#h_dingdanhao").text();
    $.ajax({
        type:"post",
        url:"guanbidingdan.do",
        data:{
            h_dingdanhao:h_dingdanhao
        },
        success:function(data){
            window.location.href="/gouwiche.do"
        }
    })
}
$("#prompt_sure_btn").click(function(){
    guanbidingdan()
});