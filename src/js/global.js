var $ = require('jquery');
var BDtpl = require('../vendors/js/baiduTemplate1.0.6');//引入模版引擎

var global = {

	//开发环境
    devAddress : "http://172.18.11.131:8080/",
	//测试环境
    testAddress : "http://deyu.datek.cn/",
    //产线环境
    proAddress : "http://223.112.5.107:8080/",

	httpAddress : function(){
    	//获取当前的运行环境标识（ 开发环境 | 测试环境 | 产线环境 | 自动获取ip ）
    	var v = process.env.NODE_ENV;
    	if(v=="dev"){
    		return this.devAddress;
    	}else if(v=="test"){
			return this.testAddress;
    	}else if(v=="pro"){
    		return this.proAddress;
    	}else if(v=="auto"){
    		return location.origin + "/";
    	}
    },

	ajax : function(url, type, headers, contentType,async, data, dataType, successFunc, errorFunc){
		//解决ajax请求缓存的问题
		var time = (new Date()).getTime();
		if(!data){
			data = { _t : time};
		}else{
			data._t = time;
		}
		$.ajax({
			url : url,
			type : type,
			headers : headers,
			contentType : contentType,
			async : async,
			data : data,
			dataType : dataType,
			success : function(data){
				if(successFunc && typeof successFunc=="function"){
					successFunc(data);
				}
			},
			error : function(data){
				if(errorFunc && typeof errorFunc=="function"){
					errorFunc(data);
				}
			}
		});
	},

	post : function(url,headers, data, success, error){
		this.ajax(url, 'post',headers, 'application/x-www-form-urlencoded',true, data, 'json', success, error);
		//this.ajax(url, 'post',headers, 'application/json',true, data, 'json', success, error);
	},

	get : function(url,headers, data, success, error){
		this.ajax(url, 'get',headers, 'application/x-www-form-urlencoded',true, data, 'json', success, error);
	},

	//将页面url所带参数进行包装
    getUrlArgObject : function () {
        var search = window.location.search;
        // 写入数据字典
        var tmparray = search.substr(1, search.length).split("&");
        var paramsArray = new Array;
        if (tmparray != null) {
            for (var i = 0; i < tmparray.length; i++) {
                var reg = /[=|^==]/;    // 用=进行拆分，但不包括==
                var set1 = tmparray[i].replace(reg, '&');
                var tmpStr2 = set1.split('&');
                var array = new Array;
                array[tmpStr2[0]] = tmpStr2[1];
                paramsArray.push(array);
            }
        }
        // 将参数数组进行返回
        return paramsArray;
    },

    //获取url所带的参数
    getParamValue : function (name) {
        var paramsArray = this.getUrlArgObject();
        if (paramsArray != null) {
            for (var i = 0; i < paramsArray.length; i++) {
                for (var j in paramsArray[i]) {
                    if (j == name) {
                        return paramsArray[i][j];
                    }
                }
            }
        }
        return null;
    }

}

module.exports = global;

//网站头部html模板
var headerTpl = '<div class="content">\
        <div class="logo">\
        	<!if(isIndex){!>\
        		<img src="../img/logo-02.png"/>\
        	<!}else{!>\
				<img src="../img/head01.png" onclick="location.href=&apos;../index/index.html&apos;"/>\
        	<!}!>\
    	</div>\
        <nav class="navbar" role="navigation">\
            <div class="container-fluid">\
                    <ul class="nav navbar-nav">\
                    	<!for(var i =0;i<headNav.length;i++){!>\
                    		<!if(activeIndex==i){!>\
                    			<li onclick="location.href=&apos;<!:=headNav[i].href!>&apos;" class="active"><a><!:=headNav[i].name!></a></li>\
                    		<!}else{!>\
								<li onclick="location.href=&apos;<!:=headNav[i].href!>&apos;"><a><!:=headNav[i].name!></a></li>\
                			<!}!>\
                		<!}!>\
                    </ul>\
                    <ul class="nav navbar-nav">\
						<!if(head.code!=0){!>\
                        	<li class="login-link"><span>欢迎来到得鱼课堂! <a href="../register/register.html?action=login">登录</a>/<a href="../register/register.html">注册</a></span></li>\
						<!}else{!>\
							<li class="login-link"><span>欢迎来到得鱼课堂!</li>\
							<li class="dropdown">\
								<a class="dropdown-toggle" data-toggle="dropdown">您好，<!:=body.userName!><b class="caret"></b></a>\
								<ul class="dropdown-menu">\
									<li>\
										<i class="triangle">&nbsp;</i>\
										<i class="triangle triangle2">&nbsp;</i>\
										<a href="../account/account.html">我的账户</a>\
									</li>\
									<li><a href="../course/myCourse.html">我的课程</a></li>\
									<li><a class="no-border" href="javascript:logout();">退出登录</a></li>\
								</ul>\
							</li>\
						<!}!>\
                    </ul>\
            </div>\
        </nav>\
    </div>';

//网站底部html模板
var footerTpl = '<div class="content">\
	    <div class="first">\
	        <img src="../img/head01.png"/>\
	        <p>“得鱼大讲堂”成立于2017年，是一家以大数据挖掘和分析为基础，专注于投资者服务的信息资讯服务平台。<br/>\
				<strong>业务领域：</strong>包括证券投资咨询和服务支持、投资研究专项服务、金融大数据调研分析服务、财务顾问专项服务、信用数据整合服务在内的多维度大数据服务体系。<br/>\
				<strong>得鱼团队：</strong>得鱼团队均来自基金管理、投资银行、经济研究、信息技术、企业管理咨询、金融培训等领域，整体专业度最高、综合实力强，为得鱼通过国际化视野提供投资者服务以坚实的专业保障。<br/>\
				<strong>发展核心：</strong>以“互联网+综合金融+科技”为依托为不同客户提供高精度、深层次、全方位的专业金融资讯服务。</p>\
		    </div>\
	    <div class="center">\
	        <div>\
	            <p><a href="../help/help.html">帮助中心</a></p>\
	            <p><a>登录注册</a></p>\
	            <p><a>如何购买</a></p>\
	            <p><a>如何支付</a></p>\
	        </div>\
	        <div>\
	            <p><a>免责声明</a></p>\
	        </div>\
	        <div>\
	            <p><a>关于我们</a></p>\
	        </div>\
	    </div>\
	    <div class="last">\
	        <div>\
	            <p>联系我们</p>\
	            <p>电话: 025-85088888<br>邮件: bigdata@bigdata,com</p>\
	            <p>江苏省得鱼大数据有限公司<br>江苏省南京市建邺区奥体中心内</p>\
	        </div>\
	    </div>\
	</div>\
	<div class="copyright">\
	©2016 得鱼 版权所有.打造优质投资教育平台  粤B1.B2-20061057\
	</div>';

//网站底部html模板（下半部分）
var footerTpl_bottom = '<div class="copyright">\
        ©2016 得鱼 版权所有.打造优质投资教育平台  粤B1.B2-20061057\
    </div>';

//渲染页面头部
function renderHead(){
	if($("#header").attr("class")){
		//获取激活的菜单的 index
		var activeIndex = parseInt($("#header").attr("activeIndex"));
		//判断是否是【网站首页的头部】
		var f = $("#header").attr("class").indexOf('index-header') > 0;
		var url = global.httpAddress() + "deyu/http/loadCurrentUser.do";

		//页面头部 菜单
		var headNav = [
			{name:"首页",href:"../index/index.html"},
			{name:"课程",href:"../course/searchCourse.html"},
			{name:"导师",href:"../index/index.html#d-lecturershow"},
			{name:"资讯",href:"../info/list.html"}
		];

		//判断用户是否已经登陆
		global.get(url,null,{},function(data){
			if(data){
				data.isIndex=f;
				data.headNav = headNav;
				data.activeIndex = activeIndex;
				var html = BDtpl.template(headerTpl,data);
				$("#header").html(html);
			}
			//该页面是否需要登录，才能进行访问
			var requiredLogin = $("#header").attr("requiredLogin");
			if(requiredLogin && data.head.code != "0"){
				location.href = "../index/index.html"
			}
		},function(data){
			console.log(data);
		});		
	}
}

//渲染页面底部
function renderFooter(){
	if($("#footer").attr("class")){
		var f = $("#footer").attr("class").indexOf('only-bottom') > 0;
		var html = "";
		if(f){
			//只渲染【版权所有】部分
			html = BDtpl.template(footerTpl_bottom,{});
		}else{
			//渲染底部全部
			html = BDtpl.template(footerTpl,{});
		}
		$("#footer").html(html);
	}
}

//登出方法
window.logout= function(){
	var url = global.httpAddress() + "deyu/http/loginOut.do";
	//用户登出
	global.get(url,null,{},function(data){
		if(data){
			renderHead();
		}
	},function(data){
		console.log(data);
	});	
}

$(function(){
	renderHead();
	renderFooter();
})