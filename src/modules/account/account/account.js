var $ = require('jquery');//引入jquery
var BDtpl = require('../../../vendors/js/baiduTemplate1.0.6');//引入模版引擎
var G    = require('../../../js/global');//global.js
var V    = require('../../../js/validate');//validate.js

var ACC = {
	
	//验证姓名
	validateRegName : function(){
		return V.check($('#userName'),V.validateName,"请正确输入姓名","请输入姓名");
	},

	//验证QQ
	validateQQ : function(){
		return V.checkForNotRequired($('#qq'),V.validateQQ,"请正确输入QQ");
	},

	//验证邮箱
	validateEmail : function(){
		return V.checkForNotRequired($('#email'),V.validateEmail,"请正确输入邮箱");
	},

	//查询【个人资料】
	getUserInfo : function(){
		var url = G.httpAddress() + "deyu/http/user/query.do";
		G.get(url,null,null,function(data){
			$("#userName").val(data.userName);
			if(data.mobile){
				$("#mobile").val(data.mobile.substring(0,3)+"****"+data.mobile.substring(7,11));	
			}
			$("#email").val(data.email || '');
			$("#qq").val(data.qq || '');
		},function(data){
			console.log(data);
		});
	},

	//修改【个人资料】
	editUserInfo : function(){
		var tips = false;
		if(!ACC.validateRegName()){tips=true;}
		if(!ACC.validateQQ()){tips=true;}
		if(!ACC.validateEmail()){tips=true;}
		if(tips){return;}
		var params = {
			userName : $("#userName").val(),
			email : $("#email").val(),
			qq : $("#qq").val()
		};
		var url = G.httpAddress() + "deyu/http/user/edit.do";
		G.post(url,null,params,function(data){
			if(data.head.code!="0"){
				$("#msg").html(data.head.msg);
			}else{
				alert("保存成功！");
				location.reload();
			}
		},function(data){
			console.log(data);
		});
	},

	//查询我的积分
	searchMyPoints : function(){
		var url = G.httpAddress() + "deyu/http/user/totalPoints.do";
		G.get(url,null,{},function(data){
			$("#my-points").html(data);
		},function(data){
			console.log(data);
		});
	}
	
}

window.editUserInfo = ACC.editUserInfo;

$(function(){
	ACC.getUserInfo();
	ACC.searchMyPoints();
	$('#userName').on('blur',ACC.validateRegName);
	$('#qq').on('blur',ACC.validateQQ);
	$('#email').on('blur',ACC.validateEmail);
})