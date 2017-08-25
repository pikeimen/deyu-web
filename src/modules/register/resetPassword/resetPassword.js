var $ = require('jquery');//引入jquery
var G = require('../../../js/global');//global.js
var V = require('../../../js/validate');//validate.js

/****短信按钮倒计时功能*****/
var time;
var _interval;
function setRemainTime(){
 if(time == 0){
	 $('#sendMobileCode').on('click',CD.sendMobileCode);
	 $("#sendMobileCode").text("发送验证码");
     clearInterval(_interval);
     return;
 }
 time--;
 $("#sendMobileCode").text(time);
}

var CD = {
		//验证手机
		validateMobile : function(){
			return V.check($('#mobile'),V.validateMobile,"请正确输入手机","请输入手机");
		},
		//验证图片验证码
		validateImageCode : function(){
			return V.check($('#imageCode'),V.validateRequired,"请输入图片验证码");
		},
		//验证短信验证码
		validatemobileCode : function(){
			return V.check($('#mobileCode'),V.validateRequired,"请输入短信验证码");
		},
		//验证新密码
		validatePassword : function(){
			return V.check($('#password'),V.validateLoginPassword,"8-16位并同时包含字母和数字","请输入登录密码");
		},
		//验证确认密码
		validateRePassword : function(){
			return V.check($('#rePassword'),function(rePwd){
				var newPwd = $('#password').val();
				if(rePwd==''){
					return null;
				}else if(rePwd!=newPwd){
					return false;
				}
				return true;
			},"两次密码输入不同","请再次输入登录密码");
		},
		//刷新图片验证码
		refreshImage : function(){
			var imageUrl=G.httpAddress() + "deyu/web/identifyingCode/load.do?_t="+(new Date()).getTime();
			$('#image').prop('src',imageUrl);
		},
		//发送短信验证码
		sendMobileCode : function(){
			var tips=false;
			if(!CD.validateMobile()){tips=true;}
			if(!CD.validateImageCode()){tips=true;}
			if(tips){return;}
			var param = {
				imageCode:$('#imageCode').val(),
				mobile:$('#mobile').val()
			};
			
			var url = G.httpAddress() + "deyu/web/resetPwd/sendForgetPwdSmsCode.do";
			$('#sendMobileCode').off('click');
			G.post(url,null, param, function(data){
				if(data.head.code=='0'){
					$('#mobileKey').val(data.body);
					time=60;
	    			_interval = setInterval(setRemainTime, 1000);
				}else{
					alert('短信发送请求失败，'+data.head.msg);
					CD.refreshImage();
					$('#imageCode').val('');
					$('#sendMobileCode').on('click',CD.sendMobileCode);
				}
			}, function(data){
				alert('短信发送请求失败，请重试');
				$('#sendMobileCode').on('click',CD.sendMobileCode);
			});
		},
		submitInfo : function(){
			var tips=false;
			if(!CD.validateMobile()){tips=true;}
			if(!CD.validatemobileCode()){tips=true;}
			if(!CD.validatePassword()){tips=true;}
			if(!CD.validateRePassword()){tips=true;}
			if(!$('#mobileKey').val() && tips==false){
				tips=true;
				alert('请获取短信验证码');
			}
			if(tips){return;}
			var param={
					mobile:$('#mobile').val(),
					mobileKey:$('#mobileKey').val(),
					mobileCode:$('#mobileCode').val(),
					password:$('#password').val()
			};
			var url = G.httpAddress() + "deyu/web/resetPwd/forgetPwd.do";
			$('#submitInfo').off('click');
			G.post(url,null, param, function(data){
				CD.refreshImage();
				if(data.head.code=='0'){
					alert("登录密码重置成功");
					window.location.href='../register/register.html?action=login';
				}else{
					$('#submitInfo').on('click',CD.submitInfo);
					if(data.head.code=='-5' 
						|| data.head.code=='-6'){
						$('#reg_mobileKey').val('');
						$('#reg_mobileCode').val('');
					}
					$('#errMsg').text('登录密码重置失败，'+data.head.msg);
				}
			}, function(data){
				$('#submitInfo').on('click',CD.submitInfo);
				$('#errMsg').text('登录密码重置失败，请重试');
			});
		}
}


$(function(){
	CD.refreshImage();
	$('#mobile').on('blur',CD.validateMobile);
	$('#imageCode').on('blur',CD.validateImageCode);
	$('#mobileCode').on('blur',CD.validatemobileCode);
	$('#password').on('blur',function(){
		CD.validatePassword();
		if($('#password').val() && $('#rePassword').val()){
			CD.validateRePassword();
		}
	});
	$('#rePassword').on('blur',function(){
		CD.validatePassword();
		CD.validateRePassword();
	});
	
	$('#image_refresh').on('click',CD.refreshImage);
	$('#sendMobileCode').on('click',CD.sendMobileCode);
	$('#submitInfo').on('click',CD.submitInfo);
});