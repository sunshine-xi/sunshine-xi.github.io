/**
 * Created by lp on 2017-07-25.
 */
    $(".save").click(function(){
        $('#save').modal('hide');
        var ifPassword=/^[0-9a-zA-Z]{6,20}$/;
        var oddPwd=$("#exampleInputPassword").val();
        var newPwd=$("#exampleInputPassword1").val();
        var rePwd=$("#reInputPassword1").val();
        if (ifPassword.test($("#exampleInputPassword1").val()) == false) {
            $("#exampleInputPassword1").attr("type","text");
            $("#exampleInputPassword1").val("请输入6-20字符").css("color", "red");
        }
        if (ifPassword.test($("#reInputPassword1").val()) == false) {
            $("#reInputPassword1").attr("type","text");
            $("#reInputPassword1").val("请输入6-20字符").css("color", "red");
        }
        if(newPwd==rePwd && ifPassword.test($("#exampleInputPassword1").val()) == true && ifPassword.test($("#reInputPassword1").val()) == true){
            $.ajax({
                url:"/changePwd.do",
                type:"post",
                data:{
                    oddPwd:oddPwd,
                    newPwd:newPwd
                },
                success:function(data){
                    if(data==""){
                        $("#exampleInputPassword").attr("type","text");
                        $("#exampleInputPassword").val("密码输入错误").css("color", "red");
                        $("#exampleInputPassword1").val("");
                        $("#reInputPassword1").val("");
                    }else {
                        //var save = document.getElementsByClassName("save")[0];
                        //save.setAttribute("data-toggle","modal");
                        //save.setAttribute("data-target","#save");
                        $('#save').modal('show');
                        setInterval(timeIN,1000);
                        setTimeout(function(){
                            window.location.href="/relogin.do";
                        },5000);
                    }
                }
            })
        }
        if(newPwd!=rePwd){
            $("#exampleInputPassword1").attr("type","text");
            $("#exampleInputPassword1").val("两次密码不一致").css("color", "red");
            $("#reInputPassword1").attr("type","text");
            $("#reInputPassword1").val("两次密码不一致").css("color", "red");
        }
    });

$("#exampleInputPassword1").focus(function(){
    if($(this).val()=="两次密码不一致"||$(this).val()=="请输入6-20字符"){
        $(this).val("").css("color","black");
        $(this).attr("type","password");
    }
});
$("#reInputPassword1").focus(function(){
    if($(this).val()=="两次密码不一致"||$(this).val()=="请输入6-20字符"){
        $(this).val("").css("color","black");
        $(this).attr("type","password");
    }
});
$("#exampleInputPassword").focus(function(){
    if($(this).val()=="密码输入错误"){
        $(this).val("").css("color","black");
        $(this).attr("type","password");
    }
});
var time=4;
function timeIN(){
    $(".time").html(time);
    time--;
}
$('.modal').modal({
    backdrop:'static',
    keyboard: true
});