var $ = require('jquery');//引入jquery
var BDtpl = require('../../../vendors/js/baiduTemplate1.0.6');//引入模版引擎
var deyuPagination    = require('../../../js/deyuPagination');//deyuPagination.js
var G    = require('../../../js/global');//global.js

var RR = {
    //积分记录
    queryUserPoints:function(page,callback){
       var url = G.httpAddress() + "deyu/http/user/pointsDetails.do";
       G.post(url,null,{startDate:"",endDate:"","queryType":1,"currentPage":page,"limit":10},function(data){
		if(data.items){
			var html = BDtpl.template("recordsTpl",data);
			$("#tb-records").html(html);
			if(callback && typeof callback=="function"){
					callback(data);
			}
		}
		},function(data){
			console.log(data);
		});	
    },
    getFirstPage : function(){
        RR.queryUserPoints(1,function(data){
            var options = {
                //总页数
                totalPages: data.totalPage,
                //页码改变后，执行的函数
                onPageChanged : function(event, oldPage, newPage){
                    RR.queryUserPoints(newPage);
                }
            };
            console.log("----------------->");
            //渲染分页模板
            deyuPagination.renderPagination(options);
        });
	}
}

$(function(){
	RR.getFirstPage();
})