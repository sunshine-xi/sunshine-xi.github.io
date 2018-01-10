//轮播.........................................
var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    autoplay: 3000,
    loop:true
});
//....联系我们选择功能...........................................
var ProvinceId=document.getElementById("City");
ProvinceId.onchange=function(){
    var PhoneAear=document.getElementsByClassName("PhoneAear")[0];
    //console.log(PhoneAear);
    PhoneAear.innerHTML="888-888888";
    if(ProvinceId.value==1){
        PhoneAear.innerHTML="666-666666";
    }else if(ProvinceId.value==2){
        PhoneAear.innerHTML="999-999999";
    }else if(ProvinceId.value==3){
        PhoneAear.innerHTML="000-0000000";
    }else if(ProvinceId.value==4){
        PhoneAear.innerHTML="555-5201314";
    }
};
