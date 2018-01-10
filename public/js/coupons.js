/**
 * Created by lp on 2017-07-25.
 */
$(".addTo").click(function(){
    $.ajax({
        method: "post",
        url: "/addCoupons.do",
        data: {
            couponsNum:$("#name").val()
        },
        success:function(data){
            console.log(data);
            $(".coupons").html("<div class='row'>" +
            "<div class='col-xs-4 text-center'>"+data[0].voucher_id+" </div>" +
                "<div class='col-xs-2 text-center'>" +data[0].voucher_name+"" +
                "</div>" +
                "<div class='col-xs-2 text-center'>" +data[0].voucher_time+"" +
                "</div>" +
                "<div class=' col-xs-4 text-center'>" +data[0].voucher_status+"" +
                "</div>" +
                "</div>");
        }
    });
});

$('.modal').modal({
    backdrop:'static',
    keyboard: true
});