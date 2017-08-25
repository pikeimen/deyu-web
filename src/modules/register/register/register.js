var $ = require('jquery');//引入jquery
var G = require('../../../js/global');//global.js
var V = require('../../../js/validate');//validate.js

/****短信按钮倒计时功能*****/
var time;
var _interval;
function setRemainTime(){
 if(time == 0){
	 $('#reg_sendMobileCode').on('click',CD.sendMobileCode);
	 $("#reg_sendMobileCode").text("发送验证码");
     clearInterval(_interval);
     return;
 }
 time--;
 $("#reg_sendMobileCode").text(time);
}

function toLoginPage(){
	console.log('toLoginPage');
	$('.nav-tabs-register li:eq(0)').removeClass('active');
	$('.nav-tabs-register li:eq(1)').addClass('active');
	
	$('#register').removeClass('in active');
	$('#login').addClass('in active');
	 
	
}

var CD = {
		
		/****登录功能*****/
		
		//验证登录账号
		validateLoginAccount : function(){
			return V.check($('#loginAccount'),V.validateRequired,"请输入手机号");
		},
		//验证登录账号
		validateLoginPwd : function(){
			return V.check($('#loginPwd'),V.validateRequired,"请输入密码");
		},
		//登录方法
		submitLogin : function(){
			var tips = false;
			if(!CD.validateLoginAccount()){tips=true;}
			if(!CD.validateLoginPwd()){tips=true;}
			if(tips){return;}
			var param={
					mobile:$('#loginAccount').val(),
					password:$('#loginPwd').val()
			};
			
			var url = G.httpAddress() + "deyu/http/login.do";
			$('#submitLogin').off('click');
			G.post(url,null, param, function(data){
				if(data.head.code=='0'){
					window.location.href='../index/index.html';
				}else{
					$('#loginMsg').text('登录失败，手机号或密码错误');
					$('#submitLogin').on('click',CD.submitLogin);
				}
			}, function(data){
				$('#submitLogin').on('click',CD.submitLogin);
				$('#loginMsg').text('登录失败，请重试');
			});
		},
		
		
		/****注册功能*****/
		//验证姓名
		validateRegName : function(){
			return V.check($('#reg_name'),V.validateName,"请正确输入姓名","请输入姓名");
		},
		//验证手机
		validateRegmobile : function(){
			return V.check($('#reg_mobile'),V.validateMobile,"请正确输入手机","请输入手机");
		},
		//验证图片验证码
		validateRegImageCode : function(){
			return V.check($('#reg_imageCode'),V.validateRequired,"请输入图片验证码");
		},
		//验证手机短信验证码
		validateRegmobileCode : function(){
			return V.check($('#reg_mobileCode'),V.validateRequired,"请输入短信验证码");
		},
		//验证密码
		validateRegPassword : function(){
			return V.check($('#reg_password'),V.validateLoginPassword,"8-16位并同时包含字母和数字","请输入密码");
		},
		//验证密码
		validateRegRePassword : function(){
			return V.check($('#reg_rePassword'),function(rePwd){
				var newPwd = $('#reg_password').val();
				if(rePwd==''){
					return null;
				}else if(rePwd!=newPwd){
					return false;
				}
				return true;
			},"两次密码输入不同","请再次输入登录密码");
		},
		//刷新图片验证码
		refreshRegImage : function(){
			var imageUrl=G.httpAddress() + "deyu/web/identifyingCode/load.do?_t="+(new Date()).getTime();
			$('#reg_image').prop('src',imageUrl);
		},
		//发送短信验证码
		sendMobileCode : function(){
			var tips=false;
			if(!CD.validateRegmobile()){tips=true;}
			if(!CD.validateRegImageCode()){tips=true;}
			if(tips){return;}
			var param = {
				imageCode:$('#reg_imageCode').val(),
				mobile:$('#reg_mobile').val()
			};
			
			var url = G.httpAddress() + "deyu/web/register/sendSmsCode.do";
			$('#reg_sendMobileCode').off('click');
			G.post(url,null, param, function(data){
				if(data.head.code=='0'){
					$('#reg_mobileKey').val(data.body);
					time=60;
	    			_interval = setInterval(setRemainTime, 1000);
				}else{
					alert('短信发送请求失败，'+data.head.msg);
					CD.refreshRegImage();
					$('#reg_imageCode').val('');
					$('#reg_sendMobileCode').on('click',CD.sendMobileCode);
				}
			}, function(data){
				alert('短信发送请求失败，请重试');
				$('#reg_sendMobileCode').on('click',CD.sendMobileCode);
			});
			
		},
		//
		submitRegister : function(){
			var tips = false;
			if(!CD.validateRegName()){tips=true;}
			if(!CD.validateRegmobile()){tips=true;}
			if(!CD.validateRegmobileCode()){tips=true;}
			if(!CD.validateRegPassword()){tips=true;}
			if(!CD.validateRegRePassword()){tips=true;}
			if(!$('#reg_mobileKey').val() && tips==false){
				tips=true;
				alert('请获取短信验证码');
			}
			if(tips){return;}
			var param={
					name:$('#reg_name').val(),
					mobile:$('#reg_mobile').val(),
					mobileKey:$('#reg_mobileKey').val(),
					mobileCode:$('#reg_mobileCode').val(),
					password:$('#reg_password').val()
			};
			var url = G.httpAddress() + "deyu/web/register/apply.do";
			$('#submitRegister').off('click');
			G.post(url,null, param, function(data){
				CD.refreshRegImage();
				if(data.head.code=='0'){
					window.location.href='../index/index.html';
				}else if(data.head.code=='-100'){
					$('#submitRegister').on('click',CD.submitRegister);
					toLoginPage();
				}else{
					$('#submitRegister').on('click',CD.submitRegister);
					if(data.head.code=='-7' 
						|| data.head.code=='-8'){
						$('#reg_mobileKey').val('');
						$('#reg_mobileCode').val('');
					}
					$('#regMsg').text('注册失败，'+data.head.msg);
				}
			}, function(data){
				$('#submitRegister').on('click',CD.submitRegister);
				$('#regMsg').text('注册失败，请重试');
			});
		}
}

$(function(){
	var action = G.getParamValue('action');
	if(action && action=='login'){
		toLoginPage();
	}
	
	$('#loginAccount').on('blur',CD.validateLoginAccount);
	$('#loginPwd').on('blur',CD.validateLoginPwd);
	$('#submitLogin').on('click',CD.submitLogin);
	
	CD.refreshRegImage();
	$('#reg_name').on('blur',CD.validateRegName);
	$('#reg_mobile').on('blur',CD.validateRegmobile);
	$('#reg_image').on('blur',CD.validateRegImageCode);
	$('#reg_mobileCode').on('blur',CD.validateRegmobileCode);
	$('#reg_password').on('blur',function(){
		CD.validateRegPassword();
		if($('#reg_password').val() && $('#reg_rePassword').val()){
			CD.validateRegRePassword();
		}
	});
	$('#reg_rePassword').on('blur',function(){
		CD.validateRegPassword();
		CD.validateRegRePassword();
	});
	$('#reg_image_refresh').on('click',CD.refreshRegImage);
	$('#reg_sendMobileCode').on('click',CD.sendMobileCode);
	$('#submitRegister').on('click',CD.submitRegister);
});