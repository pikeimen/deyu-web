var BDtpl = require('../../../vendors/js/baiduTemplate1.0.6');//引入模版引擎
var G    = require('../../../js/global');//global.js

var II = {

    //资讯头条
    queryNoticeList: function(){
        var url = G.httpAddress() + "deyu/web/notice/queryNoticePage.do";
        G.get(url,null,{orderBy:'time',page:'1',pageSize:'4'},function(data){
			if(data){
				var html = BDtpl.template('queryNoticeListTpl',data);
				$("#ul-topNoticeList").html(html);
			}
		},function(data){
			console.log(data);
		});
    },

    //人气课程
    queryHotVideoGroupList:function(){
        var url = G.httpAddress() + "deyu/web/video/queryHotVideoGroupList.do";
        var lhotCourseTpl='<a target="_blank" href="../course/detail.html?videogroupId=<!:=id!>"><img src="<!:=image!>" /></a>';
        G.get(url,null,{size:'6'},function(data){
			if(data){
				for(var i=0;i<data.body.length;i++){
                    var html = BDtpl.template(lhotCourseTpl,data.body[i]);
                    $("#l-hotCourse-"+i).html(html);
                }
			}
		},function(data){
			console.log(data);
		});
    },

    //点击切换【金牌导师】大图
    exchangeTeacherImg : function(){
        $(".tutor-small > ul li").each(function(i){
            $(this).on('click',function(){
                if( i == ($(".tutor-small > ul li").length -1 ) ){ 
                    $(this).siblings().removeClass("active");
                    $(".tutor-big img").attr("src","../img/img-tutor-big-02.jpg"); 
                }else{
                    $(this).addClass("active");
                    $(this).siblings().removeClass("active");
                    $(".tutor-big img").attr("src","../img/img-tutor-big-0"+(i+1)+".jpg");
                }
            })
        })
    }

}

$(function(){
	II.queryNoticeList();
    II.queryHotVideoGroupList();
    II.exchangeTeacherImg();
})