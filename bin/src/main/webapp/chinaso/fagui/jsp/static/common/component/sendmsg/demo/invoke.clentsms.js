$(function(){
	var msg = new pg.sms({
	   	 smgPath:'http://msg.panguso.com:8098/sendmsg',
	   	recordLog:false,
		 // 产品类别
		 productType:'',
		 serviceid:'13',
		 flag:'0',
		 // 再次发送验证码的等待时间
		randCodeWaitTime:60,
		// 发送成功后关闭窗口的等待时间
		 closeWaitTime:7,
		 smgTplId:'pg_smsgtpl',
		 tplURL:'http://www.panguso.com/static/component/pg/sendmsg/tpl/sendsms.html',
		 cdURL:'http://www.chinaso.com/common_demo/pg_cd_proxy.html'
	    });
   $('.sendURLToPhone').click(function(){
   	  var url=$(this).attr('url');
   	  var clientType=$(this).attr('ct');
   	  var md5 = $(this).attr('md5');
   	  var ct='';
   	  if(clientType == 'dz'){
   	  	ct="大众版";
   	  }else if(clientType == 'ss'){
   	  	ct="时尚版";
   	  }else if(clientType == 'jy'){
   	  	ct="精英版";
   	  }
   	  var data = {
    			  //信息类别，sms代表短信，mms代表彩信，默认发短信
    			  msgType:'sms',
    			  md5:md5,
    			  sendMsgTitle:'',
    			  //发送到手机上的内容
    			  sendMsgContent:'盘古搜索'+ct+'版客户端下载地址：'+url,
    			//显示在页面上的内容对象
			      showMsgTitle:'',
	    		  showMsgContent:'盘古搜索'+ct+'客户端下载地址：'+url,
	    		  showMsgSourceURL:'',//来源网址
	    		  panguTokenName:'盘古搜索',
	    		  panguTokenURL:'m.panguso.com',
    		     /*回调函数*/
				    beforeOpen:function(){},
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