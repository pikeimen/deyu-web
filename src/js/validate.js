var $ = require('jquery');

module.exports = {

		check : function($selector, func, msg, nullMsg) {
			var test = func($selector.val());
			var pdiv = $selector.parent();
			var groupDiv = $selector.parents(".form-group");
				if(pdiv.find('.error').length>0){
					pdiv.find('.error').remove();
				}
				if (!test) {
					if (test == null && Boolean(nullMsg)) {
						msg = nullMsg;
					}
					pdiv.append("<div class='error'>" + msg + "</div>");
					groupDiv.addClass("has-error");
					return false;
				}
				groupDiv.removeClass("has-error");
				return true;
		},
	
		checkForNotRequired : function($selector, func, msg) {
			var test = func($selector.val());
			var pdiv = $selector.parent();
			var groupDiv = $selector.parents(".form-group");
				if(pdiv.find('.error').length>0){
					pdiv.find('.error').remove();
				}
				if (test==false) {
					pdiv.append("<div class='error'>" + msg + "</div>");
					groupDiv.addClass("has-error");
					return false;
				}
				groupDiv.removeClass("has-error");
				return true;
		},
		
		//验证必填字段
		validateRequired : function(str){
			if(str.length!=0){
				return true;
			}
			return false;
		},
		
		//验证CheckBox是否勾选
		validateChecked : function($selector){
			if($selector.prop("checked")){
				return true;
			}
			return false;
		},
		
		//验证邮箱
		validateEmail : function(email) {
			var v_regex=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			email=""+email;
			if(email){
				if(!v_regex.test(email)){
					return false;
				}else{
					return true;
				}
			}else{
				return null;
			}
		},
		//验证手机
		validateMobile : function(mobile) {
			var v_regex=/^(1)\d{10}$/;
			mobile=""+mobile;
			if(mobile){
				if(!v_regex.test(mobile)){
					return false;
				}else{
					return true;
				}
			}else{
				return null;
			}
		},
		//验证登录密码
		validateLoginPassword : function(password) {
			var v_regex=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
			password=""+password;
			if(password){
				if(!v_regex.test(password)){
					return false;
				}else{
					return true;
				}
			}else{
				return null;
			}
		},
		//校验姓名
		validateName : function(name) {
			var v_regex=/^[\u4E00-\u9FA5]+(?:·[\u4E00-\u9FA5]+)*$/;
			name=""+name;
			if(name){
				if(!v_regex.test(name)){
					return false;
				}else{
					return true;
				}
			}else{
				return null;
			}
		},
		
		//验证邮箱
		validateQQ : function(qq) {
			var email_regex=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			var onlyNumber_regex=/^[0-9]+$/;
			qq=""+qq;
			if(qq){
				if(!email_regex.test(qq) && !onlyNumber_regex.test(qq)){
					return false;
				}else{
					return true;
				}
			}else{
				return null;
			}
		}
}