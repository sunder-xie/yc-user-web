define('app/register/register', function (require, exports, module) {
    'use strict';
    var $=require('jquery'),
    Validator=require('arale-validator/0.10.2/index'),
    Calendar=require('arale-calendar/1.1.2/index'),
    Widget = require('arale-widget/1.2.0/widget'),
    Dialog = require("artDialog/src/dialog"),
    AjaxController=require('opt-ajax/1.0.0/index');
    
    //实例化AJAX控制处理对象
    var ajaxController = new AjaxController();
    
    //定义页面组件类
    var RegisterPager = Widget.extend({
    	//属性，使用时由类的构造函数传入
    	attrs: {
    	},
    	//事件代理
    	events: {
    		//key的格式: 事件+空格+对象选择器;value:事件方法
    		//"click [id='randomImg']":"_refrashVitentify",
        },
    	 init: function(){
    		 _hideErroText();
         },
    	//重写父类
    	setup: function () {
    		RegisterPager.superclass.setup.call(this);
    		this._hideErroText();
    		this._bindHandle();
    	},
    	_hideInfo: function(){
    		 $("#errorPhoneMsg").attr("style","display:none");
    		 $("#errorPawMsg").attr("style","display:none");
    		 $("#errorPicMsg").attr("style","display:none");
    		 $("#errorSmsMsg").attr("style","display:none");
    		 $("#errorShowPM").attr("style","display:none");
    	},
    	//带下划线的方法，约定为内部私有方法
    	_bindHandle: function(){
    		$("#randomImg").on("click",this._refrashVitentify);
    		$("#refresh").on("click",this._refrashVitentify);
    		$("#phone").on("focus",this._hidePhoneError);
    		$("#phone").on("blur",this._validServicePho);
    		$("#inputPassword").on("focus",this._passShow);
    		$("#inputPassword").on("blur",this._validServicePaw);
    		$("#confirmationPassword").on("focus",this._passwordConfirmationShow);
    		$("#confirmationPassword").on("blur",this._passwordConfirmation);
    		$("#pictureVitenfy").on("focus",this._hidePicError);
    		$("#pictureVitenfy").on("blur",this._validServicePic);
    		$("#next").on("click",this._validServicePho);
    		$("#next").on("click",this._next);
    		$("#userName").on("blur",this._userNameCheck);
    		$("#userName").on("focus",this._hideUserNameError);
    		$("#BTN_REGISTER").on("click",this._userNameCheck);
    		$("#BTN_REGISTER").on("click",this._passwordConfirmation);
    		$("#BTN_REGISTER").on("click",this._validServicePaw);
    		$("#BTN_REGISTER").on("click",this._sumbit);
    		/*$("#PHONE_IDENTIFY").on("click",this._validServicePho);
    		$("#PHONE_IDENTIFY").on("click",this._getPhoneVitentify);*/
    	},
    	_hideErroText: function(){
    		var _this = this;
			//初始化展示业务类型
			_this._hideInfo();
    	},
    	//获取短信验证码
    	_getPhoneVitentify: function(){
    		$("#errorSmsMsg").attr("style","display:none");
    		var phoneFlag=$('#phone').val();
    		var picFlag=$('#errorPicFlag').val();
    		var passFlag=$('#errorPassFlag').val();
    		var smsFlag=$('#errorSMSFlag').val();
    		if(phoneFlag!="0"&&picFlag!="0"&& passFlag!="0"&& smsFlag!="0"){
            	 var step = 59;
                 $('#PHONE_IDENTIFY').val('重新发送60');
                 $("#PHONE_IDENTIFY").attr("disabled", true);
                 var _res = setInterval(function(){
                     $("#PHONE_IDENTIFY").attr("disabled", true);//设置disabled属性
                     $('#PHONE_IDENTIFY').val(step+'s后重新发送');
                     step-=1;
                     if(step <= 0){
                     $("#PHONE_IDENTIFY").removeAttr("disabled"); //移除disabled属性
                     $('#PHONE_IDENTIFY').val('获取验证码');
                     clearInterval(_res);//清除setInterval
                     }
                 },1000);
            	 var	param={
     					phone:	$("#phone").val()
     				   };
         		ajaxController.ajax({
     			        type: "post",
     			        processing: false,
     			        url: _base+"/reg/toSendPhone",
     			        dataType: "json",
     			        data: param,
     			        message: "正在加载数据..",
     			        success: function (data) {
     			        	if(data.responseHeader.resultCode=="9999"){
    			        		$('#showSmsMsg').text("1分钟后可重复发送 ");
    			    			$("#errorSmsMsg").attr("style","display:");
    			    			$("#phoneVerifyCode").val("");
    							return false;
    			        	}else if(data.responseHeader.resultCode=="100002"){
    			        		var msg = data.statusInfo;
    			        		$('#showSmsMsg').text(msg);
    			    			$("#errorSmsMsg").attr("style","display:");
    							return false;
    			        	}
     			        },
     			        error: function(XMLHttpRequest, textStatus, errorThrown) {
     						 alert(XMLHttpRequest.status);
     						 alert(XMLHttpRequest.readyState);
     						 alert(textStatus);
     						   }
     			        
     			    }); 
             }
    		
    	},
    	//刷新验证码
    	_refrashVitentify: function(){
    		//隐藏错误提示
    		$("#errorPicMsg").attr("style","display:none");
    		var timestamp = (new Date()).valueOf();
			$("#pictureVitenfy").html("");
			$("#randomImg").attr("src",_base+"/reg/getImageVerifyCode?timestamp="+timestamp);
    	},
    	//隐藏手机提示信息
    	_hidePhoneError: function(){
    		$("#errorPhoneMsg").attr("style","display:none");
    	},
    	//隐藏图片验证提示信息
    	_hidePicError: function(){
    		$("#errorPicMsg").attr("style","display:none");
    	},
    	_hideUserNameError:function(){
    		$("#errorUserNameMsg").attr("style","display:none");
    	},
    	//校验手机
    	_validServicePho: function(){
    		$("#errorPhoneMsg").attr("style","display:none");
    		var phone = $('#phone').val();
    		if (phone==""){
    			$('#showPhoneMsg').text("请输入手机号码");
    			$("#errorPhoneMsg").attr("style","display:");
    			$('#errorPhoneFlag').val("0");
				return false;
			}else if( /^1\d{10}$/.test(phone)){
				var	param={
    					userMp:$("#phone").val()
    				   };
        		ajaxController.ajax({
    			        type: "post",
    			        processing: false,
    			        url: _base+"/reg/checkPhone",
    			        dataType: "json",
    			        data: param,
    			        message: "正在加载数据..",
    			        success: function (data) {
    			         if(data.responseHeader.resultCode=="10003"){
    			        		$('#showPhoneMsg').text("手机号码已注册");
    							$("#errorPhoneMsg").attr("style","display:");
    							$('#errorPhoneFlag').val("0");
    							return false;
    			        	}else if(data.responseHeader.resultCode=="000000"){
    			        		$('#errorPhoneFlag').val("1");
    							$("#errorPhoneMsg").attr("style","display:none");
    			        	}
    			        	
    			        },
    			        error: function(XMLHttpRequest, textStatus, errorThrown) {
    						 alert(XMLHttpRequest.status);
    						 alert(XMLHttpRequest.readyState);
    						 alert(textStatus);
    						}
    			        
    			    }); 
			}else{
				$('#showPhoneMsg').text("手机号码格式不正确");
				$("#errorPhoneMsg").attr("style","display:");
				$('#errorPhoneFlag').val("0");
				return false;
			}
    	},
    	_passShow: function(){
    		$("#errorPawMsg").attr("style","display:none");
    	},
    	_passwordConfirmationShow(){
    		$("#errorPasswordMsg").attr("style","display:none");
    	},
    	//校验密码
    	_validServicePaw:function(){
    		$("#errorShowPM").attr("style","display:none");
    		$("#errorPawMsg").attr("style","display:none");
    		var password = $('#inputPassword').val();
    		if(password==""){
    			$('#showPawMsg').text("请输入密码");
    			
    			$("#errorPawMsg").show();
				return false;
    		}else if(/[\x01-\xFF]*/.test(password)){
    				if(/^\S*$/.test(password)){
    					if(/^[\x21-\x7E]{6,14}$/.test(password)){
    						$("#errorPawMsg").attr("style","display:none");
    						$('#errorPassFlag').val("1");
    					}else{
    						$('#showPawMsg').text("长度为6-14个字符 ");
    		    			$("#errorPawMsg").attr("style","display:");
    		    			$('#errorPassFlag').val("0");
    						return false;
    					}
    					
    				}else{
    					$('#showPawMsg').text("不允许有空格 ");
            			$("#errorPawMsg").attr("style","display:");
            			$('#errorPassFlag').val("0");
        				return false;
    				}
    			}else{
    				$('#showPawMsg').text("支持数字、字母、符号组合 ");
        			$("#errorPawMsg").attr("style","display:");
        			$('#errorPassFlag').val("0");
    				return false;
    			}
    	},
    	
    	//图形验证码
    	_validServicePic: function(){
    		$("#errorPicMsg").attr("style","display:none");
    		var pictureCode = $('#pictureVitenfy').val();
    		if(pictureCode==""){
    			$('#showPicMsg').text("请输入图形验证码 ");
    			$("#errorPicMsg").attr("style","display:");
    			$('#errorPicFlag').val("0");
				return false;
    		}else{
    			$('#errorPicFlag').val("1");
    			return true;
    		}
    	},
    	//短信验证码
    	_validServiceSSM: function(){
    		$("#errorSmsMsg").attr("style","display:none");
    		var smsCode = $('#phoneVerifyCode').val();
    		if(smsCode==""){
    			$('#showSmsMsg').text("请输入短信验证码 ");
    			$("#errorSmsMsg").attr("style","display:");
    			$('#errorSMSFlag').val("0");
				return false;
    		}else{
    			$('#errorSMSFlag').val("1");
    			return true;
    		}
    	},
    	//点击下一步用户信息显示
    	_next:function(){
    		var phone = $("#phone").val();
    		var checkbox = $("#agreeChecbox").is(':checked');
    		if(phone==""){
    			$("#errorPhoneMsg").show();
    			return false;
    		}
    		if(!checkbox){
    			$("#agreeProtocol").show();
    			return false;
    		}
    		
    		$("#accountInfoBorder").removeClass().addClass("yellow-border");
    		$("#accountInfoYuan").removeClass().addClass("yellow-yuan");
    		$("#accountInfoWord").removeClass().addClass("yellow-word");
    		$("#regeiter-date5").hide();
    		$("#regeiter-date2").show();
    		
    	},
    	
    	//校验用户名
    	_userNameCheck:function(){
    		var flag = false;
    		var userName = $("#userName").val();
    		if(userName==""){
    			$('#errorUserNameMsg').show();
    			$("#errorUserNameFlag").val("0")
    			flag = false;
    		}else{
    			var reg = /^[\u4e00-\u9fa5a-zA-Z0-9\-]{4,20}$/;
    			if(userName.match(reg)){
					$("#errorUserNameMsg").attr("style","display:none");
					$("#errorUserNameFlag").val("1")
					flag = true;
				}else{
					$("#errorUserNameMsg").show();
					$("#errorUserNameFlag").val("0")
					flag = false;
				}
    		}
    		return flag;
    	},
    	//密码校验
    	_passwordConfirmation:function(){
    		var inputPassword = $("#inputPassword").val();
    		var inputPasswordMd5 = "";
    		if(inputPassword!=""){
    			inputPasswordMd5 = hex_md5(inputPassword);
    			$("#errorPassFlag").val("1");
    		}else{
    			$("#errorPasswordMsg").show();
    			$("#errorPassFlag").val("0");
    		}
    		
    		var confirmationPassword = $("#confirmationPassword").val();
    		var confirmPasswordMd5 = "";
    		if(confirmationPassword!=""){
    			confirmPasswordMd5 = hex_md5(confirmationPassword);
    			$("#errorConfirmFlag").val("1");
    		}else{
    			$("#showPasswordMsg").text("请输入确认密码");
    			$("#errorConfirmFlag").val("0");
    		}
    		if(inputPasswordMd5!=confirmPasswordMd5){
    			$("#errorPasswordMsg").show();
    			$("#errorPassEqualsFlag").val("0");
    			return false;
    		}else{
    			$("#errorPasswordMsg").hide();
    			$("#errorPassEqualsFlag").val("1");
    			return true;
    		}
    	},
    	_sumbit: function(){
    		var phoneFlag=$('#errorPhoneFlag').val();
    		var errorUserNameFlag=$('#errorUserNameFlag').val();
    		var errorPassFlag=$('#errorPassFlag').val();
    		var errorConfirmFlag=$('#errorConfirmFlag').val();
    		var errorPassEqualsFlag = $("#errorPassEqualsFlag").val();
    		if(phoneFlag!="0"&&errorUserNameFlag!="0"&& errorPassFlag!="0"&&errorConfirmFlag!="0"&&errorPassEqualsFlag!="0"){
    			var	param={
    					request:"{ucUserParam:{" +
	    								"userMp:"+$("#phone").val()+","+
	    								"userLoginName:"+$("#userName").val()+","+
	    								"userLoginPwd:"+$("#inputPassword").val()+
    							   "}}" 
    				  };
    			
        		ajaxController.ajax({
    			        type: "post",
    			        processing: false,
    			        url: _base+"/reg/register",
    			        dataType: "json",
    			        data:param,
    			        message: "正在加载数据..",
    			        success: function (data) {
    			        	if(data.responseHeader.resultCode=="000002"){
    			        		$('#showPicMsg').text("验证码已失效 ");
    			    			$("#errorPicMsg").attr("style","display:");
    							return false;
    			        	}else if(data.responseHeader.resultCode=="000001"){
    			        		$('#showPicMsg').text("图形验证码错误 ");
    			    			$("#errorPicMsg").attr("style","display:");
    							return false;
    			        	}else if(data.responseHeader.resultCode=="000007"){
    			        		$('#showSmsMsg').text("请重新发送验证码  ");
    			    			$("#errorSmsMsg").attr("style","display:");
    			    			$('#phoneVerifyCode').val("");
    							return false;
    			        	}else if(data.responseHeader.resultCode=="000004"){
    			        		$('#showSmsMsg').text("验证码已失效  ");
    			    			$("#errorSmsMsg").attr("style","display:");
    							return false;
    			        	}else if(data.responseHeader.resultCode=="000003"){
    			        		$('#showSmsMsg').text("短信验证码错误 ");
    			    			$("#errorSmsMsg").attr("style","display:");
    							return false;
    			        	}else if(data.responseHeader.resultCode=="10003"){
    			        		$('#showPhoneMsg').text("手机号码已注册");
    							$("#errorPhoneMsg").attr("style","display:");
    							$('#phoneVerifyCode').val("");
    							return false;
    			        	}else if(data.responseHeader.resultCode=="000000"){
    			        		$("#errorSmsMsg").attr("style","display:none");
    			        		var key = data.data;
        			        	window.location.href=_base+"/reg/toRegisterSuccess?accountIdKey="+key;
    			        	}
    			        	
    			        },
    			        error: function(XMLHttpRequest, textStatus, errorThrown) {
    						 alert(XMLHttpRequest.status);
    						 alert(XMLHttpRequest.readyState);
    						 alert(textStatus);
    						}
    			        
    			    }); 
    		}
    			
    		
    	}
    });
    
    module.exports = RegisterPager
});

