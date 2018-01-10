/**
 * Created by lp on 2017-07-15.
 */
/*选择地址*/
function onChange(){
    var province=document.getElementById("province");
    var city=document.getElementById("city");
    city.innerHTML="<option value='0'>---请选择---</option> ";
    console.log(province.value);
    if(province.value=="四川省"){
        city.innerHTML+="<option value='成都市'>成都市</option>" +
            "<option value='德阳市'>德阳市</option>" +
            "<option value='绵阳市'>绵阳市</option>" +
            "<option value='什邡市'>什邡市</option>";
    }else if(province.value=="广东省"){
        city.innerHTML+="<option value='珠海市'>珠海市</option>" +
            "<option value='汕头市'>汕头市</option>" +
            "<option value='佛山市'>佛山市</option>" +
            "<option value='韶关市'>韶关市</option>";
    }else if(province.value=="湖南省"){
        city.innerHTML+="<option value='湘潭市'>湘潭市</option>" +
            "<option value='长沙市'>长沙市</option>" +
            "<option value='株洲市'>株洲市</option>" +
            "<option value='衡阳市'>衡阳市</option>";
    }else if(province.value=="湖北省"){
        city.innerHTML+="<option value='武汉市'>武汉市</option>" +
            "<option value='黄石市'>黄石市</option>" +
            "<option value='荆州市'>荆州市</option>" +
            "<option value='黄冈市'>黄冈市</option>";
    }
}

/*添加收货地址*/
$(function(){
    $(".addTo").on("click",function(){
        $.ajax({
            url:"/addAddress.do",
            type:"post",
            data:{
                addressInf:$("#province").val()+$("#city").val()+$("#specificAddress").val(),
                name:$("#name").val(),
                tel:$("#tel").val()
            },
            success:function(data){
                window.location.href="/address.do";
            }
        })
    });
});
//删除地址
    function deleteAddress(obj){
        //$(obj).parent().parent().remove();
        $.ajax({
            url:"/deleteAddress.do",
            type:"post",
            data:{
                addressInf:$(obj).parent().parent().find(".address").text()
            },
            success:function(data){
                window.location.href="/address.do";
            }
        })
    }

//地址
function revise(obj){
    $(obj).attr("onclick","achieve(this)");
    $(obj).html("完成");
    addressBef=$(obj).parent().parent().find(".address").text();
    $(obj).parent().parent().find(".address").html("<input class='form-control' placeholder='请输入地址' value='"+$(obj).parent().parent().find(".address").text()+"'>");
    $(obj).parent().parent().find(".tel").html("<input class='form-control' placeholder='请输入手机号码' value='"+$(obj).parent().parent().find(".tel").text()+"'>");
}
function achieve(obj){
        $(obj).html("修改");
        $(obj).attr("onclick","revise(this)");
        console.log($(obj).parent().parent().find(".address input").val())
        console.log(addressBef);
        addressInf=$(obj).parent().parent().find(".address input").val();
        tel=$(obj).parent().parent().find(".tel input").val();
        $(obj).parent().parent().find(".address").html($(obj).parent().parent().find(".address input").val());
        $(obj).parent().parent().find(".tel").html($(obj).parent().parent().find(".tel input").val());
        $.ajax({
            method: "post",
            url: "/updateAddress.do",
            data: {
                addressInf:addressInf,
                tel:tel ,
                addressBef:addressBef
            },
            success:function(data){
                window.location.href="/address.do";
            }
        });
    }
//设置默认地址
$(function(){
    $(".settings").click(function(){
        $(".default").attr("class","settings");
        $(".settings").html("设为默认");
        $(this).attr("class","default");
        $(this).html("默认地址");
        var addressInf=$(this).parent().parent().find(".address").text();
        $.ajax({
            method: "post",
            url: "/settings.do",
            data: {
                addressInf:addressInf
            },
            success:function(data){
                window.location.href="/address.do";
            }
        });
    });
});


$('.modal').modal({
        backdrop:'static',
        keyboard: true
    });