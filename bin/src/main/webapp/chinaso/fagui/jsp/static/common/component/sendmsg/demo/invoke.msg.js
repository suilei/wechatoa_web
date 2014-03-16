$(function(){
	var msg = new pg.mms({
	   	 smgPath:'http://appdev.panguso.com/sendmsg',
	   	recordLog:false,
		 // 产品类别
		 productType:'',
		 // 再次发送验证码的等待时间
		randCodeWaitTime:60,
		// 发送成功后关闭窗口的等待时间
		 closeWaitTime:7,
		 smgTplId:'pg_smsgtpl',
		 tplURL:'http://www.chinaso.com/common/component/sendmsg/tpl/sendsmg.html',
		 cdURL:'http://www.chinaso.com/common_demo/pg_cd_proxy.html'
	    });
   $('#modal').click(function(){
      var data = {
    			  //信息类别，sms代表短信，mms代表彩信，默认发短信
    			  msgType:'mms',
    			  md5:'fe942ed8d88a1e018c9d44196a21de1f',
    			  sendMsgTitle:'精准的铁杆',
    			  //发送到手机上的内容
    			  sendMsgContent:'图片来源：http://slide.sports.sina.com.cn/golf/slide_2_754_25898.html',
    			  //彩信图片
    			  imgURL:'http://image.panguso.com/imagesearch.img?key=http://www.sinaimg.cn/dy/slidenews/2_img/2012_14/754_666452_875170.jpg&fmt=jpg',
    			//显示在页面上的内容对象
    			  imgWidth:400,
		          imgHeight:378,
			      showMsgTitle:'精准的铁杆',
	    		  showMsgContent:'',
	    		  showMsgSourceURL:'http://image.panguso.com/web?url=www.cdfn.com.cn',//图片来源网址
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