/**
 * Created by about evol on 2017/7/24.
 */
var ajax=function(json){//引进AJax;
    var method=json.method?json.method:"get";
    var url=json.url;
    var data=json.data;
    var async=json.async?json.async:"true";
    var success=json.success;
    var xhr;
    var str="";
    if(window.XMLHttpRequest){
        xhr=new XMLHttpRequest();
    }else{
        xhr=new ActiveXObject("Microsoft.XMLHTTP");
    }
    for(var i in data){
        str+=i+"="+data[i]+"&";
    }
    str=str.substring(0,str.length-1);

    if(method=="get"){
        xhr.open(method,url+"?"+str,async);
        xhr.send(null);
    }else if(method=="post"){
        xhr.open(method,url,async);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send(str);
    }
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4&&xhr.status==200){
            success(xhr.responseText);
        }
    }
};