/**
 * Created by Hello on 2017/7/27.
 */

window.onload=function(){
    //$(".pro-list-linkOne").click(function(){
    //    var convertName=$(this).prev().find("p").text();
    //    var convertPrice=parseInt($(this).prev().find("span").find("em").text());
    //    var userIntegral=parseInt($(".Integral").text());
    //
    //
    //    if(userIntegral < convertPrice){
    //        $("#prompt_modal .modal-header").text("果实币不足");
    //        $("#prompt_modal").modal("show")
    //    }else{
    //        $.ajax({
    //            method:"post",
    //            url:"convertPro.do",
    //            data:{
    //                convertN:convertName,
    //                convertP:convertPrice
    //            },
    //            success:function(data){
    //
    //
    //            }
    //        })
    //    }
    //
    //})
    $(".pro-list-linkOne").click(function(){
        var convertName=$(this).prev().find("p").text();
        var convertPrice=parseInt($(this).prev().find("span").find("em").text());
        console.log(convertName);
        console.log(convertPrice);
        $.ajax({
            method:"post",
            url:"convertPro.do",
            data:{
                convertN:convertName,
                convertP:convertPrice
            },
            success:function(data){

                if(data==true){
                    window.location.href="gouwuche.do"
                }else{
                    $("#prompt_modal .modal-header").text("果实币不足");
                    $("#prompt_modal").modal("show")
                }


            }
        })
    })
};
