var $ = require('jquery');//引入jquery
var BDtpl = require('../../../vendors/js/baiduTemplate1.0.6');//引入模版引擎
var deyuPagination    = require('../../../js/deyuPagination');//deyuPagination.js
var G    = require('../../../js/global');//global.js

var SC = {
	
	//查询【筛选条件】
	getInfoScreen : function(){
		var url  = G.httpAddress() + "deyu/web/queryBaseCategorys.do";
		var url2 = G.httpAddress() + "deyu/web/queryAllLecturers.do";
		G.get(url,null,{type : "VIDEO"},function(data){
			var categorys = data.body;
			if(categorys){
				G.get(url2,null,null,function(data){
					var teachers = data.body;
					var html = BDtpl.template("infoScreenTpl",{categorys:categorys,teachers:teachers})
					$("#infoScreen").html(html);
					//请求第一页数据
					SC.getFirstPage();
					//dom操作的处理
					$("#infoScreen > div").find("a").click(function(){
						$(this).addClass("active");						
						$(this).siblings().removeClass("active");
						//切换 搜索条件后，请求第一页数据
						SC.onPageChanged(1);
						$(this).find("i").click(function(e){
							//阻止事件冒泡
							e.stopPropagation();
							$(this).parent().removeClass("active");
							$(this).parent().parent().find("a:eq(0)").addClass("active");
							//取消 搜索条件后，重新请求第一页数据
							SC.onPageChanged(1);
						})
					})
				},function(data){
					console.log(data);
				});
			}
		},function(data){
			console.log(data);
		});
	},

	//请求数据列表
	renderList : function(page,p,callback){
		var url = G.httpAddress() + "deyu/web/video/queryVideoGroupList.do";
		var params = {
			pageSize : 12,
			currentIndex : page,
			lecturerId : p.lecturerId,
			categoryCode : p.categoryCode,
			sortName : p.sortName
		};
		var tpl = '\
			<!for(var i = 0;i<items.length;i++){!>\
				<!if( (i+1)%3==0 ){!>\
					<div class="item mg0">\
				<!}else{!>\
					<div class="item">\
				<!}!>\
                    <div><img src="<!:=items[i].image!>"/></div>\
                    <div class="teach">\
                        <p class="p1"><!:=items[i].title!></p>\
                        <!if(items[i].lecturerList){!>\
                            <!for(var j=0;j<items[i].lecturerList.length;j++){!>\
                                <div class="p2"><!:=items[i].lecturerList[j].name!> <span><!:=items[i].lecturerList[j].rank!></span></div>\
                            <!}!>\
                        <!}!>\
                    </div>\
                    <a class="go-detail" onclick="location.href=&apos;detail.html?videogroupId=<!:=items[i].id!>&apos;"><img src="../img/my-course02.png" /></a>\
                </div>\
            <!}!>\
		';
		G.get(url,null,params,function(data){
			if(data.items){
				var html = BDtpl.template(tpl,data);
				$("#otherList").html(html);
				if(callback && typeof callback=="function"){
					callback(data);
				}
			}
		},function(data){
			console.log(data);
		});
	},

	//页码改变后，执行的函数
	onPageChanged : function(page){
		var p = {
    		lecturerId : $(".bor").find("a.active").attr("lecturerId"),
			categoryCode : $(".column").find("a.active").attr("categoryCode"),
			sortName : $(".tag").find("a.active").attr("sortName")
    	};
    	var callback = null;
    	if(page==1){
    		callback = function(data){
				var options = {
					//总页数
				    totalPages: data.totalPage,
				    //页码改变后，执行的函数
				    onPageChanged : function(event, oldPage, newPage){
				    	SC.onPageChanged(newPage);
				    }
				};
				//渲染分页模板
				deyuPagination.renderPagination(options);
			}
    	}
    	SC.renderList(page,p,callback);
	},

	//页码初始化，请求第一页数据
	getFirstPage : function(){
		SC.renderList(1, {lecturerId:"",categoryCode:"",sortName:"createTime"}, function(data){
			var options = {
				//总页数
			    totalPages: data.totalPage,
			    //页码改变后，执行的函数
			    onPageChanged : function(event, oldPage, newPage){
			    	SC.onPageChanged(newPage);
			    }
			};
			//渲染分页模板
			deyuPagination.renderPagination(options);
		});
	}
}

$(function(){
	
	SC.getInfoScreen();
})