var $ = require('jquery');//引入jquery
var BDtpl = require('../../../vendors/js/baiduTemplate1.0.6');//引入模版引擎
var G    = require('../../../js/global');//global.js

var INFODETAIL={

    //装载信息明细
    loadInfoDetail: function(){
        var url = G.httpAddress() + "deyu/web/notice/queryNoticeDetail.do";
        G.post(url,null,{"id":G.getParamValue('id')},function(data){
            if(data){
                var html = BDtpl.template("infoDetailTpl",data);
                var menuHtml = BDtpl.template("infoDetailMenuTpl",data);
                $("#d-infoDetail").html(html);
                $("#d-infoDetailMenu").html(menuHtml);
                $("#d-content").html(data.content);
            }
        },function(data){
            console.log(data);
        });
    }
}

$(function(){
	INFODETAIL.loadInfoDetail();

})