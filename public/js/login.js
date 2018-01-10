/**
 * Created by lp on 2017-07-14.
 */
$(".passportLogin").click(function(){
    $(".login").css("visibility","visible");
    $(".login").css("opacity","1");
    $(".login").css("transition",".2s linear");
    $(".loginTel").css("visibility","hidden");
    $(".loginTel").css("opacity","0");
    $(".loginTel").css("transition",".2s linear");
});
$(".passportLoginTel").click(function(){
    $(".login").css("visibility","hidden");
    $(".login").css("opacity","0");
    $(".login").css("transition",".2s linear");
    $(".loginTel").css("visibility","visible");
    $(".loginTel").css("opacity","1");
    $(".loginTel").css("transition",".2s linear");
});
$(".fa-square-o").click(function(){
    if($(this).hasClass("fa fa-check-square")){
        $(this).attr("class","fa fa-square-o");
    }else {
        $(this).attr("class","fa fa-check-square");
    }
});
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
        arr.push(txt);
    }
    newArr=arr.join("");
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

function sendMsg(){
    var phone=$("#inputTwoAccount").val();
    $.ajax({
        url:"/sendMsg.do",
        type:"post",
        data:{
            phone:phone
        },
        success:function(data){
            console.log(data);
        }
    })
}
$(".checkTelLogin").click(function(){
    if($("#imgValidation").val()!=newArr){
        $("#imgValidation").val("图片验证码错误").css("color", "red");
    }
    if($("#imgValidation").val()==newArr){
        var smscode=$("#infValidation").val();
        var phone=$("#inputTwoAccount").val();
        $.ajax({
            url:"/checkCode.do",
            type:"post",
            data:{
                smscode:smscode,
                phone:phone
            },
            success:function(data){
                window.location.href="/checkTelCode.do";
            }
        });
    }
});
$("#imgValidation").focus(function(){
    if($(this).val()=="图片验证码错误"){
        $(this).val("").css("color","black");
    }
});