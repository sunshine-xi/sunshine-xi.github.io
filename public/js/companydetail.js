
$(function(){
    //$(".btn-default").on("click",function(){
    //    var companyId=$("#exampleInputEmail1").val();
    //    var companyNum=$("#exampleInputEmail2").val();
    //    var ifcompanyNum=/^[0-9]*[1-9][0-9]*$/;
    //    var companyAddress=$("#exampleInputEmail3").val();
    //    var ifcompanyAddress=/^(?=.*?[\u4E00-\u9FA5])[\d\u4E00-\u9FA5]+/;
    //    var ifbookName=/^[\u4e00-\u9fa5]+$/;
    //    var bookname=$("#exampleInputEmail4").val();
    //    var bookphone=$("#exampleInputEmail5").val();
    //    var ifbookphone=/[0-9-()（）]{7,18}/;
    //    var bookemail=$("#exampleInputEmail6").val();
    //    var ifbookemail=/\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
    //if(companyId==''){
    //   $(".companyName").html("企业名称不能为空").css("color","red");
    //}else{
    //    $(".companyName").html("");
    //}
    // if(ifcompanyNum.test(companyNum)==false){
    //     $(".companyNum").html("请输入整数").css("color","red");
    // }else{
    //     $(".companyNum").html("");
    // }
    // if(ifcompanyAddress.test(companyAddress)==false){
    //     $(".compangAds").html("请输入正确的地址").css("color","red");
    // }else{
    //     $(".compangAds").html("");
    // }
    // if(ifbookName.test(bookname)==false){
    //     $(".bookName").html("请输入姓名").css("color","red");
    //}else{
    //     $(".bookName").html("");
    // }
    // if(ifbookphone.test(bookphone)==false){
    //     $(".bookPhone").html("请输入正确的电话号码").css("color","red");
    // }else{
    //     $(".bookPhone").html("");
    // }
    // if(ifbookemail.test(bookemail)==false){
    //     $(".Email").html("请输入正确的邮箱地址").css("color","red");
    // }else{
    //     $(".Email").html("");
    // }
    //
    // //if(companyId!=''&&ifcompanyNum.test(companyNum)==true&&
    // //    ifcompanyAddress.test(companyAddress)==true&&
    // //    ifbookName.test(bookname)==true&&ifbookphone.test(bookphone)==true
    // //    &&ifbookemail.test(bookemail)==true
    // //){
    // //    alert("111");
    // //    $.ajax({
    // //        type:"post",
    // //        url:"apply.do",
    // //        data:{
    // //            companyId:companyId,
    // //            companyNum:companyNum,
    // //            companyAddress:companyAddress,
    // //            bookname:bookname,
    // //            bookphone:bookphone,
    // //            bookemail:bookemail
    // //        }
    // //    }) ;
    // //
    // //}
    //
    //
    //});
   //console.log( $("#goods").find("option").text());

    //var Cityid=document.getElementById("city");
    //Cityid.onchange=function(){
    //    //console.log($(this).val());
    //    var cityid=$(this).val();
    //    $.ajax({
    //        type:"POST",
    //        url:"apply.do",
    //        data:{
    //            cityid:cityid
    //        }
    //    })
    //};

    $("#exampleInputEmail1").blur(function(){
        if($(this).val()==''){
            $(".companyName").html("企业名称不能为空").css("color","red");
        }else{
            $(".companyName").html("");
        }
    });
    $("#exampleInputEmail2").blur(function(){
        var companyNum=$("#exampleInputEmail2").val();
        var minNum=20;
        console.log(typeof minNum);
        console.log(typeof companyNum);
        var  ifcompanyNum=/^[0-9]*[1-9][0-9]*$/;
        if($(this).val()==''){
            $(".companyNum").html("人数不能为空").css("color","red");
        } else if(ifcompanyNum.test(companyNum)==false){
            $(".companyNum").html("请输入整数").css("color","red");
        }else if(ifcompanyNum.test(companyNum)==true){
            $(".companyNum").html("");
        }
    });
    $("#exampleInputEmail3").blur(function(){
        var companyAddress=$("#exampleInputEmail3").val();
        var ifcompanyAddress=/^(?=.*?[\u4E00-\u9FA5])[\d\u4E00-\u9FA5]+/;
        if($(this).val()==''){
            $(".compangAds").html("地址不能为空").css("color","red");
        }else if(ifcompanyAddress.test(companyAddress)==false){
            $(".compangAds").html("请输入正确的地址").css("color","red");
        }else if(ifcompanyAddress.test(companyAddress)==true){
            $(".compangAds").html("");
        }
    });
    $("#exampleInputEmail4").blur(function(){
        var ifbookName=/^[\u4e00-\u9fa5]+$/;
        var bookname=$("#exampleInputEmail4").val();
        if($(this).val()==''){
            $(".bookName").html("姓名不能为空").css("color","red");
        }else if(ifbookName.test(bookname)==false){
            $(".bookName").html("请输入正确的姓名").css("color","red");
        }else if(ifbookName.test(bookname)==true){
            $(".bookName").html("");
        }
    });
    $("#exampleInputEmail5").blur(function(){
        var bookphone=$("#exampleInputEmail5").val();
        var ifbookphone=/[0-9-()（）]{7,18}/;
        if($(this).val()==''){
            $(".bookPhone").html("电话号码不能为空").css("color","red");
        }else if(ifbookphone.test(bookphone)==false){
            $(".bookPhone").html("请输入正确的电话号码").css("color","red");
        }else if(ifbookphone.test(bookphone)==true){
            $(".bookPhone").html("");
        }
    });
    $("#exampleInputEmail6").blur(function(){
        var bookemail=$("#exampleInputEmail6").val();
        var ifbookemail=/\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
        if($(this).val()==''){
            $(".Email").html("邮箱地址不能为空").css("color","red");
        }else if(ifbookemail.test(bookemail)==false){
            $(".Email").html("请输入正确的邮箱地址").css("color","red");
        }else if(ifbookemail.test(bookemail)==true){
            $(".Email").html("");
        }
    });



});

