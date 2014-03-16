$(function(){
	var msg = new pg.sms({
	   	 smgPath:'http://msg.panguso.com:8098/sendmsg',
	   	recordLog:false,
		 // 产品类别
		 productType:'',
		 serviceid:'8887',
		 // 再次发送验证码的等待时间
		randCodeWaitTime:60,
		// 发送成功后关闭窗口的等待时间
		 closeWaitTime:7,
		 smgTplId:'pg_smsgtpl',
		 tplURL:'http://www.panguso.com/static/component/pg/sendmsg/tpl/sendsms.html',
		 cdURL:'http://www.chinaso.com/common_demo/pg_cd_proxy.html'
	    });
   $('#modal').click(function(){
   	  var title = "铁路电话订票昨起施行实名制 预售期为12天";
      var url="http://image.panguso.com/web?url=www.cdfn.com.cn";
      var content = '昨日，全新上海铁路局95105105电话订票系统正式运行。升级后的订票系统按照实名制购票方式，对订票、取票规定进行调整：一张有效证件只能订一张相同日期、车次车票；订多张车票时，需依次输入多个乘车人的有效证件号码。电话订票系统已覆盖了安徽、江苏、浙江和上海，可预订上海铁路局管内各站至全国各地车票。';
      var showContent = (title+content).length>96?(title+content).substring(0,96)+"...":(title+content);	 
      var data = {
    			  //信息类别，sms代表短信，mms代表彩信，默认发短信
    			  msgType:'sms',
    			  md5:'d5a0927f11b695eb6bfc838afa582107',
    			  sendMsgTitle:title,
    			  //发送到手机上的内容
    			  sendMsgContent:content,
    			  //彩信图片
    			  //imgURL:'',
    			//显示在页面上的内容对象
    			  //imgWidth:400,
		        //imgHeight:378,
			      showMsgTitle:'',
	    		  showMsgContent:showContent,
	    		  showMsgSourceURL:url,//图片来源网址
	    		  panguTokenName:'盘古搜索',
	    		  panguTokenURL:'m.panguso.com',
    		     /*回调函数*/
				  beforeOpen:function(){
		        	
                  },
    	          afterClose:function(){}, 
    			  
    			  beforeSendRandcode:function(){},
    			  afterSendRandcode:function(){
    			  },
    			  beforeSendMsg:function(){
    				 //可添加记录发送短信日志 
    
    			  },
    			  afterSendMsg:function(){},
    			  sessionExpired:function(){
    				  window.location.href= "http://my.panguso.com/login.jsp";
    			 }
	    }
      msg.initSmsgBox(data);
    });
 })