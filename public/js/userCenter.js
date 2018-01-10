/**
 * Created by lp on 2017-07-28.
 */
$(function(){$("#uploadImg").click(function(){
        $.ajax({
            url:"/uploadImg.do",
            type:"post",
            //FormData可以将文件转换成二进制，并且异步上传（二进制）
            data:new FormData($("#imgForm")[0]),
            processData:false,
            contentType:false,
            success:function(data){
                $(".headImg").attr("src",""+data+"");
            }
        })
    });
});
$(".headPortrait").click(function(){
    $("#uploadImg").css("opacity","1");
});
$("#uploadImg").click(function(){
    $("#uploadImg").css("opacity","0");
});