/**
 * Created by lenovo on 2017/7/18.
 */

var all_dd=$("#h_righttitlebox dd");
var all_div=$("#h_rightbox>div");
$(all_dd).click(function(){
    var h_titletext=$(this).text();
    var eq1=$(all_dd).index($(this));
    $("#h_current").text(h_titletext);
    $(all_div).css("display","none");
    $(all_div).eq(eq1).css("display","block")
});