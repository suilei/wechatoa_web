/**
 *  发送到手机组件
 *
 * @module pg
 * @submodule send message component
 * @author wuxiumei
 * @requires jquery-jtemplates.js ,jquery.timers-1.1.2.js,jquery.modaltip.js,jquery.jp-2.1.4.min.js,pg.crossDomain.js,pg.validate.js,pg.maxlength.js,pg.UITools.js
 * @params
 */
(function() {
	var defaltConf={
	    	 smgPath:'http://www.chinaso.com/sendmsg',
	    	 // 产品类别
	    	 productType:'',
	    	 //服务ID
	    	 serviceid:'',
	    	 //后台规则标识，默认直接加密
	    	 flag:'0',
	    	 //是否需要过sso过滤器
	    	 ssoinit:false,
	    	// 信息类别，sms代表短信，mms代表彩信，默认发短信
			 msgType:'SMS',
			 recordLog:false,
	    	 // 再次发送验证码的等待时间
	    	randCodeWaitTime:120,
	    	// 发送成功后关闭窗口的等待时间
	    	 closeWaitTime:7,
	    	 smgTplId:'pg_smsgtpl',
	    	 tplURL:'http://www.chinaso.com/common/component/sendmsg/tpl/sendsmg.html',
	    	 cdURL:'http://www.chinaso.com/common_demo/pg_cd_proxy.html'
	    }
	var defaltParams = {
			  /*后台所需参数*/
			  md5:'',
			  sendMsgTitle:'',
			  //发送到手机上的内容
			  sendMsgContent:'',
			  // 彩信图片
			  imgURL:'',
			  
			/*显示在页面上所需参数*/
			  imgWidth:0,
			  imgHeight:0,
			showMsgTitle:'',
			showMsgContent:'',
			showMsgSourceURL:'',// 图片来源网址
			panguTokenName:'盘古搜索',
			panguTokenURL:'m.chinaso.com',
			/*记录发送到手机按钮日志所需的参数*/
			 afterSendLogData:{},
			 /*记录发送到手机按钮日志URL*/
			 afterSendLogURL:'',
			/*回调函数*/
			  beforeOpen:function(){},    
			  afterClose:function(){},
			  beforeSendRandcode:function(){},
			  //发送手机验证码成功回调函数（只有未登录情况会调用）
			  afterSendRandcode:function(){},
			  beforeSendMsg:function(){},
			  //发送信息成功回调函数（登录和未登录情况均会调用）
			  afterSendMsg:function(){},
			  //发送成功时的监听函数，若不定义此函数，则默认发送成功显示小弹窗
			  onSuccessSendMsg:null,
			  sessionExpired:function(){}
	}
	 var smsgParams = defaltParams;
     var Msg = function(conf){
		//this.opts = $.extend(defaltParams, opts);
	    this.conf = $.extend(defaltConf, conf);
	    var smgPath = this.conf.smgPath;
	    this.url = {
	    	initSendMsgURL:smgPath + '/sendmsg.htm?m=init',
		    getImgRandCodeURL:smgPath + '/img.htm?m=imgcode&sid=',
		    sendPhoneRandCodeURL:smgPath + '/sendmsg.htm?m=smscode',
		    sendSMSURL:smgPath + '/sendmsg.htm?m=sendsms',
		    sendMMSURL:smgPath + '/sendmsg.htm?m=sendmms'
	    }
	    if(this.conf.ssoinit){
	    	 this.url.initSendMsgURL= smgPath + '/initsso.htm?m=init';
	    }
	}

	 Msg.prototype = { 
			initTpl:function(smgTplId,tplURL,json){
					$('<div id = '+smgTplId+'></div>')
					 .appendTo($('body'))
					 .setTemplateURL(tplURL)
					 .processTemplate(json);
				},
			initTplcdomain:function(smgTplId,tplURL,cdURL){
					pg.crossDomain.getDataFromSubDomain(tplURL,function(data){
						$('<div id = '+smgTplId+'></div>').html(data)
				    	.appendTo($('body'));
						//暂时不填数据
					   // $('#'+tplId).processTemplate(json);
					},cdURL);
				},
			log:function(url,data){
					var _this = this;
				if(_this.conf.recordLog){
					var params={
					        'url': url,
					        'data' : data,
					        'type':"GET",//默认方式为post
							'timeout':20000,
							'success':function(){},
							'error':function(){},
							'complete':function(){}
						}
						pg.crossDomain.getJsonpData(params);	
				}
			},
		  changeWarningTip:function(r,$tip){
					if(r.code){//合法
						$tip.html(r.msg);
						$tip.hide();
					}else{//非法
						$tip.html(r.msg);
						$tip.show();
					}
				},
			showNtlSendSuccessBox:function(){
				var _this = this;
				$('#smsg_ntl').hide();
				$('#smsg_fillDataForm').hide();
				$('#smsg_success').show();
				//移除md5为key存储的数据
        $(document).removeData($('#smsg_mck').val());
				//成功发送框居中
			  $.CenterDiv(document.getElementById('pg_smsg_wrapper'));
			  this._startSuccessTimer();
			},
			showLgdSendSuccessBox:function(){
				var _this = this;
				$('#smsg_fillDataForm').hide();
				$('#smsg_success').show();
				//移除md5为key存储的数据
        $(document).removeData($('#smsg_mck').val());
				//成功发送框居中
				$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
				 _this._startSuccessTimer();
			},
		    isloginState:function(callback){
					var _this = this;
					$.ajax({
						data:{},
						dataType: "jsonp",
						type:"GET",
						jsonp:"jsonpcallback",
						contentType: "application/x-www-form-urlencoded; charset=utf-8",
						timeout:20000,
						url: _this.url.initSendMsgURL,
						success: function(data) {
							if(data.flag==0){//会话过期
						           smsgParams.sessionExpired.call(this);
						 		   return;
						 	    }else{
						 	       callback();
						 	    }	
		    	        }
		    	   });
					/*var params={
				        url: _this.url.initSendMsgURL,
				        data : {},
				        timeout: "20000",
				        success : function(data){
				        if(data.flag==0){//会话过期
				           smsgParams.sessionExpired.call(this);
				 		   return;
				 	    }else{
				 	       callback();
				 	    }
				      }
					}
					pg.crossDomain.getJsonpData(params);*/
				},
				/**
				 * 初始化登陆前发送框，显示已发送验证码状态
				 * 初始化已经发送验证码状态的发送到手机页面
				 * @return
				 */
			_initAfterSendRcBox:function(){
					// $("#smsg_ntl_phone").attr({"disabled":false});
					// $("#smsg_get_randbtn").attr({"disabled":false});
					  // $('#smsg_ntl_counter').html('');
					   // $('#ntLogin_sendBox').show();
					pg.uitools.hideInputTip($('#smsg_ntl_phone_tip'));
					pg.uitools.hideInputTip($('#smsg_ntl_randCode_tip'));
					$("#smsg_ntl_rc_area").show();
					$("#smsg_ntl_sub_area").show();
					
					//设置未登录状态的手机输入框和获取验证码按钮的状态
					if($(document).data($('#smsg_mck').val()+'f2')==undefined){ 
				      	$("#smsg_ntl_phone").attr({"disabled":false});
						$("#smsg_get_randbtn").attr({"disabled":false});
						$("#smsg_get_randbtn").removeClass('dis_getRandBtn');
						}else{
				    	//若获取验证码后1分钟未发送短信且关闭发送弹窗的，继续保持按钮和手机的不可点击状态
				    	$("#smsg_ntl_phone").attr({"disabled":true});
						$("#smsg_get_randbtn").attr({"disabled":true});
						$("#smsg_get_randbtn").addClass('dis_getRandBtn');
				    }
				},
				/**
				* 清除发送到手机弹框数据(不含关闭逻辑)
				* @param toClose 是否关闭按钮弹窗
				* 
				*/
				cleanSmsgBox:function(toClose){
					var _this = this;
				   $('.warning').html('')
				      .hide();
				   //清除输入框数据
				   $('.smsg_input').each(function(){
					  var dt =$(this).attr('dt');
					  if(dt){
						 $(this).val(dt); 
					  }else{
						 $(this).val('');
					  }
				   })
				   //清空隐藏域发送内容和MD5
				   _this.clearMsgData();
				   $('#smsg_msg_content').val('');
				   $('#smsg_mck').val('');
				   //重置关闭倒计时
				   $(document).stopTime('smsg_success_closeTimer');	
				   $('#smsg_close_counter').html(_this.conf.closeWaitTime);
				   //隐藏关闭倒计时div
				   $('#smsg_success').hide();
				   //显示登录前
				   $('#smsg_fillDataForm').show();
				   //登陆前页面重置
				   $("#smsg_ntl_phone").attr({"disabled":false});
				   $("#smsg_get_randbtn").attr({"disabled":false});
				   $("#smsg_get_randbtn").removeClass('dis_getRandBtn');
				   $("#smsg_ntl_rc_area").hide();
				   $("#smsg_ntl_sub_area").hide();
				   $('#smsg_ntl_counter').html('');
				   //$('#ntLogin_sendBox').show();
				   
				   //此逻辑放在AfterClose方法中通过callback传进来
					//未登录情况下，不含有获取验证码但未发送的信息,按钮设置成可“发送到手机”状态
				    /*if(isLogin==0){
				    	if($(document).data($('#smsg_mck').val())==undefined){
				    	    mbicon.html('发送到手机');
				    	}
				    }*/
					
					if(toClose){
					   $('#pg_smsg_wrapper').unbind();
					   $('#pg_smsg_wrapper').CloseModalDiv();
					}
				},
				isApple:function(){
					var ua = navigator.userAgent;
					if(ua.indexOf("iPad") != -1 || ua.indexOf("iPhone") != -1 || ua.indexOf("iTouch") != -1){
						return true;
					}else{
						return false;
					}
				},
				/**
				* 打开发送到手机弹框,登录前或登录后的
				*/
				initSmsgBox:function(params){
					var _this = this;
					//1.合并参数
					smsgParams = $.extend(defaltParams,params);
					//调整外部状态
					smsgParams.beforeOpen.call(this);
					
					//2.清理，重新填充数据,内容、MD5等
					
					//首次打开弹框
					var md5 = smsgParams.md5;
					if($(document).data(md5)==undefined){ 
						_this.cleanSmsgBox(false);
						_this.setMsgData(smsgParams);
					}else{//未登录状态，已经发送过手机验证码
				    	//存手机号
						_this.setMsgData(smsgParams);
				        $("#smsg_ntl_phone").val($(document).data(md5));
				        _this._initAfterSendRcBox();
				    }
					//3.绑定交互事件
					this.bindSmsgEvent();
					var params = {
						'data' : {},
						'url' : _this.url.initSendMsgURL,
						'timeout' : 20000,
						'success' : function(data) {
							sid = data.sid;
							//为图片验证码添加sid参数
							isLogin = data.flag;
							if(data.flag==0){//未登录
								$('#pg_smsg_wrapper').OpenModalDiv();
								$('#smsg_ntl').show();
								$('#smsg_reg_mypangu').show();
								$('#smsg_lgd').hide();
								$('#smsg_success').hide();
								$('#smsg_note_tips').html('您将收到如下彩信：');
								_this.initNlgBoxStyle();
								//发送框居中
								  $.verticalCenterDiv(document.getElementById('pg_smsg_wrapper'));
								  $(window).resize(function(){
							    	if($('#pg_smsg_wrapper').is(':visible')){
							    		$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
							    	}
						      });
						      if(!_this.isApple()){
						      	$(window).scroll(function(){
						        	if($('#pg_smsg_wrapper').is(':visible')){
							    		$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
							    	  }
						        });
						      	
						      }
						    //绑定手机输入框回车交互事件
								$(document).unbind('keyup').bind('keyup', function(event){
								   if (event.keyCode=="13"){
								   		var act = document.activeElement.id;
									    if(act=="smsg_ntl_phone"){//回车获取验证码
									       if(!$("#smsg_get_randbtn").attr("disabled")){					       
										     	$("#smsg_get_randbtn").trigger("click");
										     }     
									     } 
								   }
								});
							}else if(data.flag==1){//已登录
								var phone = data.mobile;
								var email = data.email;
								$('#pg_smsg_wrapper').OpenModalDiv();
								if($.trim(phone).length>0){
								   $('#smsg_lgd_phone').val(phone);
								}
								$('#smsg_lgd').show();
								$('#smsg_ntl').hide();
								$('#smsg_reg_mypangu').hide();
								$('#smsg_success').hide();
								_this.initLgdBoxStyle();
								if($.trim(phone).length>0){
									$('#smsg_send_user').html('来自'+phone);
								}else if($.trim(email).length>0){
									$('#smsg_send_user').html('来自'+email);
								}
								$('#smsg_note_tips').html('您或您的好友将收到如下彩信：');
								//成功发送框居中
							    $.verticalCenterDiv(document.getElementById('pg_smsg_wrapper'));
								  $(window).resize(function(){
							    	if($('#pg_smsg_wrapper').is(':visible')){
							    		$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
							    	}
						      });
						       if(!_this.isApple()){
						        $(window).scroll(function(){
						        	if($('#pg_smsg_wrapper').is(':visible')){
							    		$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
							    	  }
						        });
						      }
								//登陆后有图形验证码
								pg.uitools.changeImgRandCode($('#smsg_lgd_rcimg'),_this.url.getImgRandCodeURL+sid+'&t='+new Date().getTime());
								//绑定手机输入框回车交互事件
								$(document).unbind('keyup').bind('keyup', function(event){
								   if (event.keyCode=="13"){
								   		var act = document.activeElement.id;
									    if(act=="smsg_lgd_phone"||act=="smsg_lgd_randCode"){//回车提交表单
									       if(!$("#smsg_lgd_submit").attr("disabled")){					       
										     	$("#smsg_lgd_submit").trigger("click");
										     }     
									     } 
								   }
								});
							}
						},
						'error' : function() {
							 //alert("服务暂时不可用，请稍候再试。");
						}
					}
					pg.crossDomain.getJsonpData(params);
				},
				/**
				 * 发送手机验证码成功后调用的函数
				 i. 手机号码输入框、 “获取验证码”button状态disable
				 ii. 延伸显示提示信息
				  1.  显示验证码输入框及发送按钮
				  2.  显示信息“验证码1小时内有效1分钟内未收到验证码可重新获取 120”
				  3.  120秒倒计时
				**/
			_sendRandCodeSuccess:function(){
					 var instance = this,
						conf = instance.conf;
				     pg.uitools.hideAllWarningTips($('#smsg_ntl .warning'));
				     $("#smsg_ntl_phone").attr({"disabled":true});
				     $("#smsg_get_randbtn").attr({"disabled":true});
				     $("#smsg_get_randbtn").addClass('dis_getRandBtn');
				       //显示验证码输入框
				       $("#smsg_ntl_rc_area").show();
				       //显示发送button
				       $("#smsg_ntl_sub_area").show();
				       //倒计时1分钟
				       $('#smsg_ntl_counter').html(conf.randCodeWaitTime);
				       //TODO:是否置空
				       //$("#smsg_ntl_randCode").val('');
				       var md5 = $('#smsg_mck').val();
				       //存储发送的手机号
				       $(document).data(md5,$("#smsg_ntl_phone").val()); 
				       //用于判断验证码记时是否结束
				       $(document).data(md5+'f2',$("#smsg_ntl_phone").val());
				       //为这条搜索结果发送到手机启动一个计时器，这样不同的搜索结果会有不同的计时器
				       $(document).everyTime(1000, md5,
				            function(i){
				               var tm = conf.randCodeWaitTime -i;        
				               if(tm<=0){//计时结束
				                 $(document).stopTime(md5);
				                  //pg.uitools.hideInputTip($('#ntLogin_phoneTip'));
				                  if($('#smsg_ntl_rc_area').is(":visible")&&md5==$('#smsg_mck').val()){
				                       $("#smsg_ntl_phone").attr({"disabled":false});
				                       $("#smsg_get_randbtn").attr({"disabled":false});
				                       $("#smsg_get_randbtn").removeClass('dis_getRandBtn');
				                       $('#smsg_ntl_counter').html(''); 
				                  }
				                  $(document).removeData(md5+'f2'); 
				                  //记时结束绑定回车提交事件
				                   /* $(document).unbind('keyup');
				                    $(document).bind('keyup', function(event){
				                    	if (event.keyCode=="13"){
				                   		    var act = document.activeElement.id;                           
				                            if(act=="smsg_ntl_phone"){                              
				                                $("#smsg_get_randbtn").trigger("click");
				                            }else if(act=="smsg_ntl_randCode"){
				                               $("#smsg_ntl_submit").trigger("click"); 
				                            }
				                       }
				                    });*/ 
				                    
				                }else{   
				                 //只改变定时器值与当前页面MD5一致的计时器
				                if(md5 == $('#smsg_mck').val()){              
				                    $('#smsg_ntl_counter').html(tm);
				                }
				               }
				            }
				        );
				       //发送框居中
					   $.CenterDiv(document.getElementById('pg_smsg_wrapper'));
				     //调用外部传入的afterSendRandcode方法，若还未发送完成，搜索结果的发送到手机的文字为填写验证码
				       smsgParams.afterSendRandcode.call(this);
				       //绑定回车发送信息功能
				       $(document).unbind('keyup');                
				       $(document).bind('keyup', function(event){
				    	   if (event.keyCode=="13"){
				    		 var act = document.activeElement.id;                           
				             if(act=="smsg_ntl_phone"){                              
				                 $("#smsg_get_randbtn").trigger("click");
				             }else if(act=="smsg_ntl_randCode"){
				                $("#smsg_ntl_submit").trigger("click"); 
				             }
				           }
				        });      
				},
				_startSuccessTimer:function(){
					 var _this= this;
					 var conf = _this.conf;
					   $(document).everyTime(1000, 'smsg_success_closeTimer',
							function(i) {
										   var tm = conf.closeWaitTime -i;		
										   if(tm==0){
										   	  $(document).stopTime('smsg_success_closeTimer');						   	   
										   	   $('#smsg_close_counter').html(conf.closeWaitTime);						   	   
										   	   //$(document).removeData($('#smsg_mck').val()); 
										   	   _this.cleanSmsgBox(true);   
										   }else{						   
										   	 $('#smsg_close_counter').html(tm);
										   }
										});
				},
				bindSmsgEvent:function (){
					var _this = this;
					 /**
					  * 关闭模式对话框
					  */
					 $('.smsg_js_close').unbind('click').bind('click',function(){
						 _this.cleanSmsgBox(true);
						 smsgParams.afterClose.call(this);
					 })
					 
				     /**
				      * 输入框的提示信息
				      */
					 $('.smsg_js_funcTip').unbind('focus').bind('focus',function(){
						 var text = $.trim($(this).attr('dt'));
						 pg.uitools.changeFuncTip($(this)[0],text,'focus');
					}).unbind('blur').bind('blur',function(){
						 var text = $.trim($(this).attr('dt'));
						 pg.uitools.changeFuncTip($(this)[0],text,'blur')
					})
					
					/**
					*登陆前业务逻辑
					*/
					$('#smsg_ntl_phone').bind('blur',function(){
						var phone = $(this).val();
						if($.trim(phone)=='请输入手机号码'){
							phone='';
						}
						pg.validate.isValidPhone(phone,_this.changeWarningTip,$('#smsg_ntl_phone_tip'));
						$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
					})
					
					/*$('#smsg_ntl_randCode').bind('blur',function(){
						var randCode = $(this).val();
						if($.trim(randCode)=='请输入验证码'){
							randCode='';
						}
						pg.validate.checkRandCode(randCode,_this.changeWarningTip,$('#smsg_ntl_randCode_tip'));
					})*/
					
					var getRandCodeEvent = (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) ? 'touchstart' : 'click';
					
					//未登陆状态发送手机验证码
					$('#smsg_get_randbtn').unbind(getRandCodeEvent).bind(getRandCodeEvent,function(){
					   smsgParams.beforeSendRandcode.call(this);
					    //手机输入框处于不可点击状态，则返回
					    var rbtable = $("#smsg_get_randbtn").attr("disabled");
					    var inputable = $("#smsg_ntl_phone").attr("disabled");
				      if(inputable==true||inputable=="disabled"||rbtable==true||rbtable=="disabled"){
				            return ;
				      }
				       
				       var phone  = $.trim($('#smsg_ntl_phone').val());
				       if(phone=='请输入手机号码'){
				    	   phone='';
				       }
				       var md5 = $('#smsg_mck').val();
				        //验证手机号
				       if(pg.validate.isValidPhone(phone,_this.changeWarningTip,$('#smsg_ntl_phone_tip')).code){
				            $(this).attr({"disabled":true});
				            var q = '';
				            if(smsgParams.afterSendLogData){
				            	q = smsgParams.afterSendLogData.q||'';
				            }
				            var params={
				             'data':{
				                    'mobile':phone,
				                    'md5':md5,
				                    'q':q
				                },
							 'url':_this.url.sendPhoneRandCodeURL,
							 'timeout':20000,
							 'success':function(data) {
				                var flag = data.flag;
				                if(flag==1){//发送成功
				                   _this._sendRandCodeSuccess();                    
				                }else{//发送失败
				                    if(flag==2){//非移动手机号，发送失败
				                        pg.uitools.showInputTip($('#smsg_ntl_phone_tip'),'手机号码格式不正确');
				                    }else if(flag==3){
				                    	pg.uitools.showInputTip($('#smsg_ntl_phone_tip'),'请输入手机号码');
				                    }else if(flag==0){
				                    	pg.uitools.showInputTip($('#smsg_ntl_phone_tip'),'您的发送数量已超过限制条数');
				                    }
				                    $('#smsg_get_randbtn').attr({"disabled":false});
				                    $("#smsg_get_randbtn").removeClass('dis_getRandBtn');
				                    //$("#smsg_ntl_phone").focus();
				                }
				              },
							 'error':function(){
							 	$('#smsg_get_randbtn').attr({"disabled":false});
							 	},
							 'complete':function(){}
				            }
				            pg.crossDomain.getJsonpData(params);
				            $.CenterDiv(document.getElementById('pg_smsg_wrapper'));
				        }					 
					})
					//未登录用户发送信息
					$('#smsg_ntl_submit').unbind('click').bind('click',function(){
						smsgParams.beforeSendMsg.call(this);
						//TODO:需要除去左右空字符？
					    var phone = $.trim($('#smsg_ntl_phone').val());
				        var rc = $.trim($('#smsg_ntl_randCode').val());
				        if(rc =='请输入验证码'){
							rc='';
						}
				        if(phone =='请输入手机号码'){
							phone='';
						}
				        var content = $('#smsg_msg_content').val();//发送信息的内容
				        var md5Str = $('#smsg_mck').val();
				        if(!pg.validate.checkRandCode(rc,_this.changeWarningTip,$('#smsg_ntl_randCode_tip')).code
				        ||!pg.validate.isValidPhone(phone,_this.changeWarningTip,$('#smsg_ntl_phone_tip')).code){
				        	$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
				           return false;
				        }
				      //此处区分发短信和发彩信的参数
					    var udata = {'mobile':phone,
								     'smscode':rc}
					    udata = $.extend(udata,_this.getSpecialData())
					    var surl = _this.getSendMsgURL();
					    /*if(smsgParams.msgType == 'MMS'){//发彩信
					    	var mdata = getMMSData();
					    	udata = $.extend(udata,mdata)
					    	surl = _this.url.sendMMSURL;
					    }else if(smsgParams.msgType == 'SMS'){//短信彩信
					    	var mdata = getSMSData();
					    	udata = $.extend(udata,mdata)
					    	surl = _this.url.sendSMSURL;
					    }*/
				        var params={
								data:udata,
								url: surl,
							success: function(data) {
								var value = data.flag;
								document.getElementById('smsg_ntl_submit').disabled=false;
								if(value==0){//发送超过发送额度限制
									pg.uitools.showInputTip($('#smsg_ntl_phone_tip'),'发送短信次数超过限制');
								}else if(value==2){//非移动号码
									pg.uitools.showInputTip($('#smsg_ntl_phone_tip'),"手机号码格式不正确");
								}else if(value==3){//手机号码为空
									pg.uitools.showInputTip($('#smsg_ntl_phone_tip'),"手机号码不能为空");
								}else if(value==6){
									pg.uitools.showInputTip($('#smsg_ntl_randCode_tip'),"验证码输入错误");
								}else if(value==7){
									pg.uitools.showInputTip($('#smsg_ntl_randCode_tip'),"此验证码已失效，请重新发送");
								}else if(value==1){//发送成功
								   $('.warning').html('').hide();
								   $("#smsg_ntl_phone").attr({"disabled":false});
								   $("#smsg_get_randbtn").attr({"disabled":false});
								   $("#smsg_get_randbtn").removeClass('dis_getRandBtn');
								   $("#ntLogin_randCode").hide();
								   $("#ntLogin_sendMsg").hide();
								  //停止已MD5值为名称的计时器
									$(document).stopTime($('#smsg_mck').val())					   
									$('#smsg_ntl_counter').html('');
									
									if(smsgParams.onSuccessSendMsg){
										 smsgParams.onSuccessSendMsg.call(_this);
									}else{
										//显示发送成功窗
									  _this.showNtlSendSuccessBox.call(_this);
									}
									   
									//移除发送手机号码数据
									$(document).removeData($('#smsg_mck').val());
									
									//记录日志
									var logData = $.extend({},{se:phone,api:'',clt:'share',sv:_this.conf.msgType},smsgParams.afterSendLogData);
									//调整外部状态
									smsgParams.afterSendMsg.call(this);
									_this.log(smsgParams.afterSendLogURL, logData);
								}
							},'error':function(){
							document.getElementById('smsg_ntl_submit').disabled=false;
							//alert("服务不可用，请稍候再试！");
							}
						}
				        pg.crossDomain.getJsonpData(params);
				        $.CenterDiv(document.getElementById('pg_smsg_wrapper'));
					});	
					
					/**
					 *登陆后业务逻辑
					 */
					$('#smsg_lgd_phone').bind('blur',function(){
						var phone = $(this).val();
						if($.trim(phone)=='请输入手机号码'){
							phone='';
						}
						pg.validate.isValidPhone(phone,_this.changeWarningTip,$('#smsg_lgd_phone_tip'));
						$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
					})
					
					$('#smsg_lgd_exchange_rc').unbind('click').bind('click',function(){
						pg.uitools.changeImgRandCode($('#smsg_lgd_rcimg'),_this.url.getImgRandCodeURL+sid+'&t='+new Date().getTime());
						return false;
					})
					
					//登录状态用户提交发送信息
					$('#smsg_lgd_submit').unbind('click').bind('click',function(){
						smsgParams.beforeSendMsg.call(this);
						//TODO:需要除去左右空字符？
				        var phone = $.trim($('#smsg_lgd_phone').val());
				        var rc = $.trim($('#smsg_lgd_randCode').val());
				        if(rc =='验证码'){
							rc='';
						}
				        if(phone =='请输入手机号码'){
							phone='';
						}
				        var content = $('#smsg_msg_content').val();//发送信息的内容
				        var md5Str = $('#smsg_mck').val();
				        if(!pg.validate.checkRandCode(rc,_this.changeWarningTip,$('#smsg_lgd_randCode_tip')).code
				        ||!pg.validate.isValidPhone(phone,_this.changeWarningTip,$('#smsg_lgd_phone_tip')).code){
				        	$.CenterDiv(document.getElementById('pg_smsg_wrapper'));
				        	return false;
				        }
					    $('#smsg_lgd_submit').attr('disabled',true);
					    //此处区分发短信和发彩信的参数
					    var udata = {'mobile':phone,
								     'imgcode':rc}
					    udata = $.extend(udata,_this.getSpecialData())
					    var surl = _this.getSendMsgURL();
					    /*if(smsgParams.msgType == 'MMS'){//发彩信
					    	var mdata = getMMSData();
					    	udata = $.extend(udata,mdata)
					    	surl = _this.url.sendMMSURL;
					    }else if(smsgParams.msgType == 'SMS'){//短信彩信
					    	var mdata = getSMSData();
					    	udata = $.extend(udata,mdata)
					    	surl = _this.url.sendSMSURL;
					    }*/
					    var params={
					    		data:udata,
								url: surl,
								type:"GET",
								success: function(data) {
									var value = data.flag;
									if(value==0){
										var smsCount = data.n;
										smsCount = "<span class='red'>"+smsCount+"</span>";
										var mss = '每个注册用户24小时内只能给好友发送'+smsCount+'次短信';
										pg.uitools.showInputTip($('#smsg_lgd_phone_tip'),mss);
									}else if(value==2){//非移动号码
									pg.uitools.showInputTip($('#smsg_lgd_phone_tip'),"手机号码格式不正确");
								}else if(value==3){//手机号码为空
									pg.uitools.showInputTip($('#smsg_lgd_phone_tip'),"手机号码不能为空");
								}else if(value==8){
									pg.uitools.showInputTip($('#smsg_lgd_randCode_tip'),"验证码输入错误");
								}else if(value==9){
									pg.uitools.showInputTip($('#smsg_lgd_randCode_tip'),"此验证码已失效，请重新填写验证码");
									$('#smsg_lgd_exchange_rc').trigger('click');
								}else if(value==1){
									if(smsgParams.onSuccessSendMsg){
										 smsgParams.onSuccessSendMsg.call(_this);
									}else{
										//显示发送成功窗
									  _this.showLgdSendSuccessBox.call(_this);
									}
								 //记录日志
								  var logData = $.extend({},{se:phone,api:'',clt:'share',sv:_this.conf.msgType},smsgParams.afterSendLogData);
								  _this.log(smsgParams.afterSendLogURL, logData);
								  smsgParams.afterSendMsg.call(this);
								}
								  $('#smsg_lgd_submit').attr('disabled',false);	
								},'error':function(){
									$('#smsg_lgd_submit').attr('disabled',false);	
									//alert("服务不可用，请稍候再试！");
								}
							};
					    _this.isloginState(function(){
					    	pg.crossDomain.getJsonpData(params);
					    });
					    $.CenterDiv(document.getElementById('pg_smsg_wrapper'));
					})
					/*$('#smsg_lgd_randCode').unbind('blur').bind('blur',function(){
						var randCode = $(this).val();
						if($.trim(randCode)=='请输入验证码'){
							randCode='';
						}
						setTimeout(pg.validate.checkRandCode(randCode,_this.changeWarningTip,$('#smsg_lgd_randCode_tip')),250000);
					})*/
				 },
				 /**
				  * 待覆盖的方法
				  * */
				getSpecialData:function(){},
				getSendMsgURL:function(){},
				setMsgData:function(ops){},
				//登陆后样式初始化
				initLgdBoxStyle:function(){},
				//登陆前样式初始化
				initNlgBoxStyle:function(){},
				clearMsgData:function(){}
				
	};
	 
	 var SMS =function(conf){
		 Msg.call(this,conf);
		 this.conf.msgType='SMS';
		 this.initTplcdomain(this.conf.smgTplId,this.conf.tplURL,this.conf.cdURL);
	 }
	 SMS.prototype = new Msg();
	 SMS.prototype.constructor=SMS;
	 SMS.prototype.getSpecialData=function(){
		 var smsData={
					'msg':$('#smsg_msg_content').val(),
					'md5':$('#smsg_mck').val(),
					'subject':$('#smsg_sms_title').val(),
					'flag': this.conf.flag,
					'serviceid':this.conf.serviceid
				};
			return smsData;
	 }
	 SMS.prototype.getSendMsgURL=function(){
		 return this.url.sendSMSURL;
	 }
	 SMS.prototype.initNlgBoxStyle=function(){
		 $('#smsg_pg_bottom').removeClass('pg_bottom');
	 }
	 SMS.prototype.initLgdBoxStyle=function(){
		 $('#smsg_pg_bottom').addClass('pg_bottom');
	 }
	 
	 SMS.prototype.clearMsgData=function(){
		 
	 }
	 SMS.prototype.setMsgData=function(ops){
			 if(ops){
				//$('#smsg_show_title').html(ops.showMsgTitle);
				$('#smsg_show_content').html(ops.showMsgContent);
				var shorturl = ops.showMsgSourceURL;
				if(shorturl.length>34){
					shorturl = shorturl.substring(0,34);
					shorturl = shorturl+"...";
				}
				$('#smsg_show_sourceurl').attr('href',ops.showMsgSourceURL);
				$('#smsg_show_sourceurl').text(shorturl);
				$('#pangu_token_name').html(ops.panguTokenName);
				$('#pangu_token_url').html(ops.panguTokenURL);
				$('#pangu_token_url').attr('href','http://'+ops.panguTokenURL);
				
				//后台需要的数据
				$('#smsg_sms_title').val(ops.sendMsgTitle);
				$('#smsg_msg_content').val(ops.sendMsgContent);
				$('#smsg_mck').val(ops.md5);
			  }	
	 }
	 
	 
	 var MMS =function(conf){
		 Msg.call(this,conf);
		 this.conf.msgType='MMS';
		 this.initTplcdomain(this.conf.smgTplId,this.conf.tplURL,this.conf.cdURL);
	 }
	 MMS.prototype = new Msg();
	 MMS.prototype.constructor=MMS;
	 MMS.prototype.getSpecialData=function(){
		 var mmsData={
					'msg':$('#smsg_msg_content').val(),
					'md5':$('#smsg_mck').val(),
					'subject':$('#smsg_mms_title').val(),
					'imgurl':$('#smsg_mms_imgurl').val()
				};
		 return mmsData;
	 }
	 MMS.prototype.getSendMsgURL=function(){
		 return this.url.sendMMSURL;
	 }
	 MMS.prototype.initLgdBoxStyle=function(){
	 }
	 MMS.prototype.clearMsgData=function(){
		 $('#mms_show_img').attr('src','');
	 }
	 MMS.prototype.setMsgData=function(ops){
		 if(ops){
				$('#mms_show_img').attr('src',ops.imgURL);
				pg.uitools.setImgSize($('#mms_show_img'),ops.imgWidth,ops.imgHeight,200,150);
				$('#smsg_show_title').html(ops.showMsgTitle);
				$('#smsg_show_content').html(ops.showMsgContent);
				var shorturl = ops.showMsgSourceURL;
				if(shorturl.length>34){
					shorturl = shorturl.substring(0,34);
					shorturl = shorturl+"...";
				}
				$('#smsg_show_sourceurl').attr('href',ops.showMsgSourceURL);
				$('#smsg_show_sourceurl').text(shorturl);
				$('#pangu_token_name').html(ops.panguTokenName);
				$('#pangu_token_url').html(ops.panguTokenURL);
				$('#pangu_token_url').attr('href','http://'+ops.panguTokenURL);
				
				//后台需要的数据
				$('#smsg_mms_title').val(ops.sendMsgTitle);
				$('#smsg_msg_content').val(ops.sendMsgContent);
				$('#smsg_mms_imgurl').val(ops.imgURL);
				$('#smsg_mck').val(ops.md5);
			  }	 
	}
	 if(!window.pg) { window['pg'] = {}; }	
	 window.pg.msg= Msg;
	 window.pg.mms= MMS;
	 window.pg.sms= SMS;
  })();









 
