/**
 * Created by Hello on 2017/7/14.
 */
window.onload= function () {
    $(".welcome-logo").hide();
    $(".welcome-logo").fadeIn(3000);
    onloading();
};
window.onscroll=function(){
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    console.log(top);
    //if(top>300){
    //    $(".Brand-introduction>.history>.Product-ideas").css("left","60%");
    //    $(".Brand-introduction>.history>.Product-ideas").css("visibility","visible");
    //    $(".Brand-introduction>.history>.Product-ideas").css("opacity","1");
    //}

    //if(top>500){
        //$(".welcome-logo").hide();
        //$(".welcomeW").hide();
        //$(".welcomeF").hide();
        //$(".welcome-dash-bottom").hide();
        //$(".welcome-dash-bottom").css("top","100%");
        //$(".Brand-introduction").css("right",(top-500));
        //$(".Brand-introduction").css("top",(top-500));
        //console.log($(".Brand-introduction").offset().top);
        //console.log("头"+$(".Brand-introduction").css("top"));
        //if(parseInt($(".Brand-introduction").css("right"))>3800){
        //    $(".Brand-introduction").css("right","3800px");
        //}
    //}else {
    //    reload();
    //    $(".Brand-introduction").css("right",0);
    //    $(".Brand-introduction").css("top",0);
    //}
    /*固定背景图片*/

    if(top<3500){
        $(".indexBg").css("background-image","url('./images/index-bg.jpg')");
        $(".indexBg").css("transition",".5s linear");
    }else if(top>3500 && top<7000){
        $(".indexBg").css("background-image","url('./images/index-bg-one.jpg')");
        $(".indexBg").css("transition",".5s linear");
    }else if(top>7000 && top<10050){
        $(".indexBg").css("background-image","url('./images/index-bg-two.jpg')");
        $(".indexBg").css("transition",".5s linear");
    }
    //if(top>4200){
    //    $(".Brand-introduction>.Business-cooperation>.Product-ideas").css("left","77%");
    //    $(".Brand-introduction>.Business-cooperation>.Product-ideas").css("visibility","visible");
    //    $(".Brand-introduction>.Business-cooperation>.Product-ideas").css("opacity","1");
    //}
};
var modeText = ['顺序播放','单曲循环','随机播放','列表循环'];
var player = new MPlayer({
    // 容器选择器名称
    containerSelector: '.mp',
    // 播放列表
    songList: mplayer_song,
    // 专辑图片错误时显示的图片
    defaultImg: 'img/mplayer_error.png',
    // 自动播放
    autoPlay: true,
    // 播放模式(0->顺序播放,1->单曲循环,2->随机播放,3->列表循环(默认))
    playMode:0,
    playList:0,
    playSong:0,
    // 当前歌词距离顶部的距离
    lrcTopPos: 34,
    // 列表模板，用${变量名}$插入模板变量
    listFormat: '<tr><td>${name}$</td><td>${singer}$</td><td>${time}$</td></tr>',
    // 音量滑块改变事件名称
    volSlideEventName:'change',
    // 初始音量
    defaultVolume:80
}, function () {
    // 绑定事件
    this.on('afterInit', function () {
        console.log('播放器初始化完成，正在准备播放');
    }).on('beforePlay', function () {
        var $this = this;
        var song = $this.getCurrentSong(true);
        var songName = song.name + ' - ' + song.singer;
        console.log('即将播放'+songName+'，return false;可以取消播放');
    }).on('timeUpdate', function () {
        var $this = this;
        console.log('当前歌词：' + $this.getLrc());
    }).on('end', function () {
        var $this = this;
        var song = $this.getCurrentSong(true);
        var songName = song.name + ' - ' + song.singer;
        console.log(songName+'播放完毕，return false;可以取消播放下一曲');
    }).on('mute', function () {
        var status = this.getIsMuted() ? '已静音' : '未静音';
        console.log('当前静音状态：' + status);
    }).on('changeMode', function () {
        var $this = this;
        var mode = modeText[$this.getPlayMode()];
        $this.dom.container.find('.mp-mode').attr('title',mode);
        console.log('播放模式已切换为：' + mode);
    });
});
$(document.body).append(player.audio); // 测试用
setEffects(player);
