var $ = require('jquery');//引入jquery
var BDtpl = require('../../../vendors/js/baiduTemplate1.0.6');//引入模版引擎
var videojs = require('../../../vendors/js/video');//引入video.js
var G    = require('../../../js/global');//global.js

window.VIDEO = {
	
	//查询【视频详情】
	queryVideoGroupDetail : function(){
		var url = G.httpAddress() + "deyu/web/video/queryVideoDetail.do";
		G.get(url,null,{videoGroupId : G.getParamValue('videoGroupId'), currentVideoId : G.getParamValue('currentVideoId')},function(data){
			var html = BDtpl.template('videoDetailTpl',data);
			$("#videoDetail").html(html);
			$("#location1").html(data.title);
			//初始化播放器
			videojs("video", {}, function(){  });
			//查询【相关推荐】
			VIDEO.queryRelationVideoGroupList(data.category);
		},function(data){
			console.log(data);
		});
	},

	//查询【相关推荐】
	queryRelationVideoGroupList : function(category){
		var url = G.httpAddress() + "deyu/web/video/queryRelationVideoGroupList.do";
		G.get(url,null,{categoryCode:category,size:5},function(data){
			if(data.body && data.body.length > 0){
				var html = BDtpl.template('otherListTpl',data);
				$("#otherList").html(html);
			}
		},function(data){
			console.log(data);
		});
	},

	//跳转【视频详情】
	goVideoDetail : function(id){
		location.href = "video.html?videoGroupId="+G.getParamValue('videoGroupId')+"&currentVideoId="+id;
	}
}

$(function(){
	VIDEO.queryVideoGroupDetail();
})