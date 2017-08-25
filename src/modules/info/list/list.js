var $ = require('jquery');//引入jquery
var BDtpl = require('../../../vendors/js/baiduTemplate1.0.6');//引入模版引擎
var deyuPagination    = require('../../../js/deyuPagination');//deyuPagination.js
var G    = require('../../../js/global');//global.js

var INFOLIST = {
	
	//装载信息栏目
	loadInfoCategory : function(){
		var url = G.httpAddress() + "deyu/web/queryBaseCategorys.do";
		G.get(url,null,{type:'INFO'},function(data){
			if(data){
				var html = BDtpl.template('infoCategoryTpl',data);
				$("#d-infoCategory").html(html);
			}
		},function(data){
			console.log(data);
		});
	},
	//请求数据列表
	renderList : function(page,callback){
		console.log('请求数据列表'+page);
		var url = G.httpAddress() + "deyu/web/notice/queryNoticePage.do";
		G.post(url,null,{"type":$("#hid-type").val(),"orderBy":$("#hid-orderBy").val(),"page":page,"pageSize":deyuPagination.pageSize},function(data){
		if(data.items){
			var html = BDtpl.template("infoListTpl",data);
			$("#ul-infoList").html(html);
			if(callback && typeof callback=="function"){
					callback(data);
			}
		}
		},function(data){
			console.log(data);
		});	
	},
	getFirstPage : function(){
		INFOLIST.renderList(1,function(data){
			var options = {
				//总页数
			    totalPages: data.totalPage,
			    //页码改变后，执行的函数
			    onPageChanged : function(event, oldPage, newPage){
			    	INFOLIST.renderList(newPage);
			    }
			};
			//渲染分页模板
			deyuPagination.renderPagination(options);
		});
	}
}

window.queryInfoList= function(element,code,type) {
	if(type=='catagory'){
		$("#d-infoCategory").children(".active").removeClass("active");
		$(element).addClass("active");
		$("#hid-type").val(code);
	}
	if(type=='orderBy'){
		$("#d-infoOrderBy").children(".active").removeClass("active");
		$(element).addClass("active");
		$("#hid-orderBy").val(code);
	}
	INFOLIST.getFirstPage();
}

$(function(){
	INFOLIST.loadInfoCategory();
	INFOLIST.getFirstPage();
})