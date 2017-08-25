var $ = require('jquery');//引入jquery
var BDtpl = require('../../../vendors/js/baiduTemplate1.0.6');//引入模版引擎
var G    = require('../../../js/global');//global.js

window.CD = {

	//查询【课程介绍】
	queryVideoGroupDetail : function(){
		var url = G.httpAddress() + "deyu/web/video/queryVideoGroupDetail.do";
		G.get(url,null,{videoGroupId : G.getParamValue('videogroupId')},function(data){
			if(data){
				var html = BDtpl.template('courseIntroTpl',data);
				$("#courseIntro").html(html);
				$("#cost-points").html(data.points);
				$("#cost-points-modal").html(data.points);
				$("#course-title").html(data.title);
				$("#course-title-modal").html(data.title);
			}
		},function(data){
			console.log(data);
		});
	},

	//查询【导师列表】
	queryAllLecturers : function(){
		var url = G.httpAddress() + "deyu/web/queryVideogroupLecturers.do";
		G.get(url,null,{videogroupId : G.getParamValue('videogroupId')},function(data){
			if(data.body && data.body.length > 0){
				var html = BDtpl.template('teachIntroListTpl',data);
				$("#teachIntroTpl").html(html);
			}
			CD.queryRelationVideoGroupList(data.body[0].id);
		},function(data){
			console.log(data);
		});
	},

	//查询【视频课程列表】
	queryVideoList : function(){
		var url = G.httpAddress() + "deyu/web/video/queryVideoList.do";
		G.post(url,null,{videoGroupId : G.getParamValue('videogroupId')},function(data){
			if(data.body && data.body.length > 0){
				if(data.body.length > 8){
					$("#courseList").css({"overflow":"hidden","height":"820"});
					$("#load-more").css("display","block");
				}
				var html = BDtpl.template('courseListTpl',data);
				$("#courseList").html(html);
			}
		},function(data){
			console.log(data);
		});
	},

	//查询【相关推荐】
	queryRelationVideoGroupList : function(lecturerId){
		var url = G.httpAddress() + "deyu/web/video/queryRelationVideoGroupList.do";
		G.get(url,null,{lecturerId:lecturerId,size:1},function(data){
			if(data.body && data.body.length > 0){
				var html = BDtpl.template('otherListTpl',data);
				$("#otherList").html(html);
			}
		},function(data){
			console.log(data);
		});
	},

	//点击加载更多
	loadMore : function(){
		$(".load-more").click(function(){
			$(this).hide();
			$("#courseList").css({"overflow":"auto","height":"auto"});	
		})
	},
	//点击 悬浮导航
	floatNav : function(){
		$(".float-nav a").click(function(){
			$(this).addClass("active");
			$(this).siblings().removeClass("active");
			//去掉url后面的 锚链接部分路径
			if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
	            var $target = jQuery(this.hash);
	            var $url = this.hash.slice(1);
	            var $scrollTime = 500;
	            $target = $target.length && $target || $('[name=' + $url + ']');
	            if (!$url) {
	                return false;
	            } else if ($target.length) {
	                var targetOffset = $target.offset().top;
	                $('html,body').animate({
	                    scrollTop: targetOffset
	                }, $scrollTime);
	                return false;
	            }
	        }
		})
	},

	//跳转【视频详情】
	goVideoDetail : function(id){
		window.open("video.html?videoGroupId="+G.getParamValue('videogroupId')+"&currentVideoId="+id)
	},

	//查询我的积分
	searchMyPoints : function(){
		var url = G.httpAddress() + "deyu/http/user/totalPoints.do";
		G.get(url,null,{},function(data){
			$("#my-points").html(data);
		},function(data){
			console.log(data);
		});
	},

	//打开【购买课程】弹框
	showBuyDialog : function(){
		var url = G.httpAddress() + "deyu/http/loadCurrentUser.do";
		//判断用户是否已经登陆
		G.get(url,null,{},function(data){
			if(data.head.code == "0"){
				//已登录
				$('#myModal').modal('show');
				CD.searchMyPoints();
			}else{
				//未登录
				location.href = "../register/register.html?action=login";
			}
		},function(data){
			console.log(data);
		});
	},

	//购买课程
	buyCourse : function(){
		var url = G.httpAddress() + "deyu/http/video/buyVideoGroup.do";
		G.get(url,null,{videoGroupId:G.getParamValue('videogroupId')},function(data){
			if(data.head.code=="0"){
				alert("购买成功!");
			}else{
				alert(data.head.msg);
			}
			$('#myModal').modal('hide');
		},function(data){
			console.log(data);
		});
	},

	//滚动条超过指定区域，隐藏左侧浮动导航
	initScroll : function(){
		$(window).scroll(function (){
			var h = $(window).height();
			var st = $(this).scrollTop();
			var sc = document.documentElement.scrollHeight - h;
			if(st < (sc*0.07) || st > (sc/2.1)){
				$(".float-nav").hide();
			}else{
				$(".float-nav").show();
			}
		});
	}

}

$(function(){
	CD.loadMore();
	CD.floatNav();
	CD.queryVideoGroupDetail();
	CD.queryAllLecturers();
	CD.queryVideoList();
	CD.initScroll();
	
})