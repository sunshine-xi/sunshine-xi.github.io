/**
 * Created by lp on 2017-07-25.
 */
function sendTel(){
    var phone=$("#inputTwoAccount").val();
    $.ajax({
        url:"/sendRePassword.do",
        type:"post",
        data:{
            phone:phone
        },
        success:function(data){
            console.log(data);
        }
    })
}
$(".save").click(function(){
    $('#save').modal('hide');
    var smscode=$("#infValidation").val();
    var phone=$("#inputTwoAccount").val();
    var password=$("#exampleInputPassword1").val();
    var ifPassword=/^[0-9a-zA-Z]{6,20}$/;
    if (ifPassword.test($("#exampleInputPassword1").val()) == false) {
        $("#exampleInputPassword1").attr("type","text");
        $("#exampleInputPassword1").val("请输入6-20字符").css("color", "red");
    }
    if (ifPassword.test($("#reInputPassword1").val()) == false) {
        $("#reInputPassword1").attr("type","text");
        $("#reInputPassword1").val("请输入6-20字符").css("color", "red");
    }
    if ($("#exampleInputPassword1").val() != $("#reInputPassword1").val()) {
        $("#exampleInputPassword1").attr("type","text");
        $("#exampleInputPassword1").val("两次密码不一致").css("color", "red");
        $("#reInputPassword1").attr("type","text");
        $("#reInputPassword1").val("两次密码不一致").css("color", "red");
    }
    if( ifPassword.test($("#exampleInputPassword1").val()) == true &&
        ifPassword.test($("#reInputPassword1").val()) == true &&
        $("#reInputPassword1").val() == $("#exampleInputPassword1").val()&&
        $("#exampleInputPassword1").val() != "请输入6-20字符" &&
        $("#reInputPassword1").val() != "两次密码不一致" ){
            $.ajax({
                url:"/setNewPwd.do",
                type:"post",
                data:{
                    phone:phone,
                    password:password
                },
                success:function(data){
                    $('#save').modal('show');
                    setInterval(timeIN,1000);
                    setTimeout(function(){
                        window.location.href="/relogin.do";
                    },5000);
                }
            });
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
var time=4;
function timeIN(){
    $(".time").html(time);
    time--;
}
$('.modal').modal({
    backdrop:'static',
    keyboard: true
});
$(".next").click(function(){
    var ifTel = /^1[0-9]{10}$/;
    if(($("#inputTwoAccount").val()=="")||($("#inputTwoAccount").val()=="账号不能为空")){
        $("#inputTwoAccount").val("账号不能为空").css("color", "red");
    }else if($("#infValidation").val()==""||$("#infValidation").val()=="请输入验证码"){
        $("#infValidation").val("请输入验证码").css("color", "red");
    }else if(ifTel.test($("#inputTwoAccount").val()) == true){
        var smscode=$("#infValidation").val();
        var phone=$("#inputTwoAccount").val();
        $.ajax({
            url:"/checkTel.do",
            type:"post",
            data:{
                phone:phone,
                smscode:smscode
            },
            success:function(data){
                $(".form-group").css("display","none");
                $(".next").css("display","none");
                $(".pwd").css("display","block");
                $(".save").css("display","block");
            }
        });
    }
});
$("#inputTwoAccount").focus(function(){
    if($(this).val()=="账号不能为空"||$(this).val()=="请输入11位手机号码"){
        $(this).val("").css("color","black");
    }
});
$("#infValidation").focus(function(){
    if($(this).val()=="请输入验证码"||$(this).val()=="短信验证码"){
        $(this).val("").css("color","black");
    }
});