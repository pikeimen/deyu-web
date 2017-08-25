var $ = require('jquery');//引入jquery
var BDtpl = require('../../../vendors/js/baiduTemplate1.0.6');//引入模版引擎
var deyuPagination    = require('../../../js/deyuPagination');//deyuPagination.js
var G    = require('../../../js/global');//global.js

var myCourse = {
	
	//我的课程列表模板
	courseItemTpl : '\
		<!for(var i=0;i<items.length;i++){!>\
			<div class="item">\
		        <div class="image">\
		            <img src="<!:=items[i].image!>"/>\
		        </div>\
		        <div class="intro">\
                    <p class="p1"><!:=items[i].title!></p>\
                    <div>\
                    	<!for(var j=0;j<items[i].lecturerList.length;j++){!>\
	                        <div class="course-teach">\
	                            <p class="p2"><!:=items[i].lecturerList[j].name!></p>\
	                            <p class="p3"><!:=items[i].lecturerList[j].rank!></p>\
	                        </div>\
                        <!}!>\
                    </div>\
                    <p class="p4"><!:=items[i].description!></p>\
                    <a href="detail.html?videogroupId=<!:=items[i].id!>">继续学习</a>\
                </div>\
		    </div>\
	    <!}!>',

	//请求数据列表
	renderList : function(page,callback){
		console.log('请求数据列表'+page);
		var url = G.httpAddress() + "deyu/http/video/queryMyVideoGroupList.do";
		G.get(url,null,{pageSize : deyuPagination.pageSize,currentIndex : page},function(data){
			if(data.items){
				var html = BDtpl.template(myCourse.courseItemTpl,data);
				$("#courseList").html(html);
				if(callback && typeof callback=="function"){
					callback(data);
				}
			}
		},function(data){
			console.log(data);
		});
	},

	//查询【相关推荐】
	queryRelationVideoGroupList : function(){
		var url = G.httpAddress() + "deyu/web/video/queryRelationVideoGroupList.do";
		G.get(url,null,{size:3},function(data){
			if(data.body && data.body.length > 0){
				var html = BDtpl.template('otherListTpl',data);
				$("#otherList").html(html);
			}
		},function(data){
			console.log(data);
		});
	},

	//页码初始化，请求第一页数据
	getFirstPage : function(){
		myCourse.renderList(1,function(data){
			var options = {
				//总页数
			    totalPages: data.totalPage,
			    //页码改变后，执行的函数
			    onPageChanged : function(event, oldPage, newPage){
			    	myCourse.renderList(newPage);
			    }
			};
			//渲染分页模板
			deyuPagination.renderPagination(options);
		});
	}
}

$(function(){
	myCourse.getFirstPage();
	myCourse.queryRelationVideoGroupList();
})