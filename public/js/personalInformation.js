/**
 * Created by lp on 2017-07-20.
 */
$(".fa-square-o").on("click",function(){
    $(this).attr("class","fa fa-check-square");
    $(this).siblings().attr("class","fa fa-square-o");
});
$("#myBirthday").datetimepicker({
    format: 'yyyy-mm-dd',
    minView:'month',
    language: 'zh-CN',
    autoclose:true,
    maxDate:new Date()
});
$("#birthday").datetimepicker({
    format: 'yyyy-mm-dd',
    minView:'month',
    language: 'zh-CN',
    autoclose:true,
    maxDate:new Date()
});
$(".save").click(function() {
    $('#save').modal('hide');
    var name=$("#name").val();
    var nickname=$("#nickname").val();
    var sex=$(".fa-check-square").text();
    var email=$("#email").val();
    var address=$("#addressInf").val();
    var myBirthday=$("#myBirthday").val();
    var relation=$("#relation").val();
    var birthday=$("#birthday").val();
    var product=$("#product").val();
    console.log(birthday);
    $.ajax({
        url:"/savePerson.do",
        type:"post",
        data:{
            name:name,
            nickname:nickname,
            sex:sex,
            email:email,
            addressInf:address,
            myBirthday:myBirthday,
            birthday:birthday,
            product:product,
            relation:relation
        },
        success:function(data){
            $('#save').modal('show');
            setInterval(timeIN,1000);
            setTimeout(function(){
                window.location.href="/userCenter.do";
            },5000);
        }
    });
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