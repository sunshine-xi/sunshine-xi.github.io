/**
 * Created by lp on 2017-07-22.
 */
var arr=[];
var newArr="";
/**生成一个随机数**/
function randomNum(min,max){
    return Math.floor( Math.random()*(max-min)+min);
}
/**生成一个随机色**/
function randomColor(min,max){
    var r = randomNum(min,max);
    var g = randomNum(min,max);
    var b = randomNum(min,max);
    return "rgb("+r+","+g+","+b+")";
}
drawPic();
document.getElementById("changeImg").onclick = function(e){
    e.preventDefault();
    drawPic();
    $(this).attr("class","fa fa-refresh fa-spin fa-2x refresh");
    setTimeout(changeClass,1000);
};
function changeClass(){
    $("#changeImg").attr('class','fa fa-refresh fa-2x refresh')
}
/**绘制验证码图片**/
function drawPic(){
    var canvas=document.getElementById("canvas");
    var width=canvas.width;
    var height=canvas.height;
    var ctx = canvas.getContext('2d');
    ctx.textBaseline = 'bottom';
    arr=[];
    /**绘制背景色**/
    ctx.fillStyle = randomColor(255,255); //颜色若太深可能导致看不清
    ctx.fillRect(0,0,width,height);
    /**绘制文字**/
    var str = 'abcdefghijklmnopqrstuvwxyz1234567890';
    for(var i=0; i<4; i++){
        var txt = str[randomNum(0,str.length)];
        ctx.fillStyle = randomColor(70,160);  //随机生成字体颜色
        ctx.font = randomNum(30,40)+'px 微软雅黑'; //随机生成字体大小
        var x = 10+i*25;
        var y = randomNum(25,45);
        var deg = randomNum(-45, 45);
        //修改坐标原点和旋转角度
        ctx.translate(x,y);
        ctx.rotate(deg*Math.PI/180);
        ctx.fillText(txt, 0,0);
        //恢复坐标原点和旋转角度
        ctx.rotate(-deg*Math.PI/180);
        ctx.translate(-x,-y);
        arr.push(txt); ;
    }
    newArr=arr.join("");
    console.log(newArr);
    /**绘制干扰线**/
    for(var j=0; j<4; j++){
        ctx.strokeStyle = randomColor(40,180);
        ctx.beginPath();
        ctx.moveTo( randomNum(0,width), randomNum(0,height) );
        ctx.lineTo( randomNum(0,width), randomNum(0,height) );
        ctx.stroke();
    }
    /**绘制干扰点**/
    for(var k=0; k<100; k++){
        ctx.fillStyle = randomColor(0,255);
        ctx.beginPath();
        ctx.arc(randomNum(0,width),randomNum(0,height), 1, 0, 2*Math.PI);
        ctx.fill();
    }
}
function sendRegiMsg(){
    var phone=$("#inputAccount").val();
    $.ajax({
        url:"/sendRegiMsg.do",
        type:"post",
        data:{
            phone:phone
        },
        success:function(data){

        }
    })
}
$(".btn_register").on("click",function() {
    var ifTel = /^1[0-9]{10}$/;
    var ifPassword=/^[0-9a-zA-Z]{6,20}$/;
    if (ifTel.test($("#inputAccount").val()) == false) {
        $("#inputAccount").val("请输入11位手机号码").css("color", "red");
    }
    if (ifPassword.test($("#inputPassword").val()) == false) {
        $("#inputPassword").attr("type","text");
        $("#inputPassword").val("请输入6-20字符").css("color", "red");
    }
    if (ifPassword.test($("#rePassword").val()) == false) {
        $("#rePassword").attr("type","text");
        $("#rePassword").val("请输入6-20字符").css("color", "red");
    }
    if ($("#rePassword").val() != $("#inputPassword").val()) {
        $("#rePassword").attr("type","text");
        $("#rePassword").val("两次密码不一致").css("color", "red");
    }
    if ($("#imgValidation").val()!=newArr) {
        $("#imgValidation").val("图片验证码错误").css("color", "red");
    }
    if (ifTel.test($("#inputAccount").val()) == true &&
        ifPassword.test($("#inputPassword").val()) == true &&
        ifPassword.test($("#rePassword").val()) == true &&
        $("#rePassword").val() == $("#inputPassword").val()&&
        $("#inputAccount").val() != "请输入11位手机号码" &&
        $("#inputPassword").val() != "请输入6-20字符" &&
        $("#rePassword").val() != "两次密码不一致" ) {
        var inputAccount = $("#inputAccount").val();
        var infValidation = $('#infValidation').val();
        var inputPassword = $('#inputPassword').val();
        if($("#imgValidation").val()==newArr){
            $.ajax({
                method: "post",
                url: "/checkRegiMsg.do",
                data: {
                    inputAccount: inputAccount,
                    infValidation: infValidation,
                    inputPassword: inputPassword
                },
                success: function (data) {
                    window.location.href="/registed.do"
                }
            });
        }else{
            $("#imgValidation").val("图片验证码错误").css("color", "red");
        }

    }
});
$("#imgValidation").focus(function(){
    if($(this).val()=="图片验证码错误"){
        $(this).val("").css("color","black");
    }
});
$("#inputAccount").focus(function(){
    if($(this).val()=="请输入11位手机号码"){
        $(this).val("").css("color","black");
    }
});
$("#inputPassword").focus(function(){
    if($(this).val()=="请输入6-20字符"){
        $(this).val("").css("color","black");
        $(this).attr("type","password");
    }
});
$("#rePassword").focus(function(){
    if($(this).val()=="两次密码不一致"||$(this).val()=="请输入6-20字符"){
        $(this).val("").css("color","black");
        $(this).attr("type","password");
    }
});
setInterval(checkRegiTel,1000);
function checkRegiTel(){
    var phone=$("#inputAccount").val();
    $.ajax({
        method: "post",
        url: "/checkRegiTel.do",
        data: {
            phone: phone
        },
        success: function (data) {
             if(data!=""){
                 $("#inputAccount").val("该手机号码已经注册").css("color", "red");
                 $("#inputPassword").val("");
                 $("#rePassword").val("");
                 $("#imgValidation").val("");
             }
        }
    });
}
$("#inputAccount").focus(function(){
    if($(this).val()=="该手机号码已经注册"){
        $(this).val("").css("color","black");
    }
});