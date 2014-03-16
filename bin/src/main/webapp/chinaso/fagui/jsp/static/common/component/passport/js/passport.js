;(function($) {
	/**
	 * 参数说明：
	 * failCb：为用户操作错误导致的回调函数，为用户提示具体的错误操作,参数为后台传回的错误码
	 * errorCb：后台操作失败的回调函数
	 * sucCb：后台操作成功的回调函数
	 * finishCb:无论成功或失败都需运行的函数
	 */
	var _defaultops ={
      	    errorCb:function(){
      		  alert('服务失败，请稍候再试!');
      	    },
      	    failCb:function(){
      		  alert('操作失败！');
      	    },
      	    sucCb:function(){
      	      alert('操作成功！');
      	    },
      	    finishCb:function(){}
      	};

   $.fn.PassportLogin=function(params,options) {
    	 var defaults = {
    		   account:"",
			   	 password:"",
			     randCode:"",
			     isrmpwd:"0",
        	 basePath:"",
        	 passurl:'https://passport.panguso.com/login.htm'
        	};
    	    params = $.extend(defaults, params);
    	    options =  $.extend(_defaultops, options);
            passport(params,options,true);
          
      };
    
      $.fn.PassportRegPhone=function(params,options) {
     	 var defaults = {
     			'user.msisdn' : "",
				'randCode' : "",
				'user.password' : "",
         	    basePath:"",
         	    passurl:'https://passport.panguso.com/userAction!smsRegist.htm'
         	};
     	    params = $.extend(defaults, params);
     	    options =  $.extend(_defaultops, options);
     	    passport(params,options,true);
           
       };
       
       $.fn.PassportRegMail=function(params,options) {
       	 var defaults = {
       			'user.email' : "",
				'user.password' : "",
				'randCode' : "",
           	    basePath:"",
           	    passurl:'https://passport.panguso.com/userAction!mailRegist.htm'
           	};
       	    params = $.extend(defaults, params);
       	    options =  $.extend(_defaultops, options);
            passport(params,options,false);
             
         };
       
       $.fn.PassportLogout=function(params,options) {
       	 var defaults = {
       		   basePath:"",
           	   passurl:'https://passport.panguso.com/logout.htm'
           	};
       	    params = $.extend(defaults, params);
                var defaultLogoutOps ={
                	    errorCb:function(){
                		  alert('服务失败，请稍候再试!');
                	    },
                	    failCb:function(){
                	      alert('退出失败，请稍候再试！');
                	    },
                	    sucCb:function(){
                	      alert('退出成功！');
                	    },
                	    finishCb:function(){}
                	}
                options = $.extend(defaultLogoutOps, options);
               passport(params,options,true);
             
         };

    function passport(params,options,scall){
    	var passurl =params['passurl'];
    	$.jsonp({
    	    url: passurl+'?jsonpcallback=?',
    	    data:params,
    	    timeout:20000,
    	    success: function(data) {
    		   // This will be called in case of success no matter the callback name
	    	   var c = data.flag;
	    	    if(c == 0){
					 if(scall){
						 var turl = params.basePath + data.url;
				         set_sid(turl,options.errorCb,options.sucCb);
					 }else{
						 options.sucCb();
					 }
	 		   }else{
			    	 //未成功，回调错误处理函数
			    	  options.failCb(c); 
	 		   }
    	    },
    	    error: function() {
    	    	 // This will be called in case of error no matter the callback name
    	    	alert("服务暂时不可用，请稍后再试！");
    	    },
			complete:function(){
				options.finishCb();
			}
    	});
  };
  
    function passport_nohandle_error(params,options,scall){
    	var passurl =params['passurl'];
    	$.ajax({
		data : params,
		timeout:20000,
		dataType: "jsonp",
		jsonp:"jsonpcallback",
		url : passurl,
		success : function(data) {
		   var c = data.flag;
		   if(c == 0){
			 if(scall){
				 var turl = params.basePath + data.url;
		         set_sid(turl,options.errorCb,options.sucCb);
			 }else{
				 options.sucCb();
			 }
		   }else{
	    	 //未成功，回调错误处理函数
	    	  options.failCb(c); 
		   }
		},error:function(){ 
			alert("服务暂时不可用，请稍后再试！");
		},
		complete:function(){
			options.finishCb();
		}
   });
};
    function set_sid(surl,error_cb,suc_cb){
    	var params = {};
    	$.ajax({
    			data : params,
    			type:"POST",
    			timeout:20000,
    			dataType: "json",
    			url : surl,
    			success : function(data){
    			   var c = data.flag;
    			   if(c == 0){
    				   suc_cb();
			      }else{
			    	  error_cb(); 
			      }
    			  
    		  },error:function(){
    			alert("服务暂时不可用，请稍后再试！");
             }
    	});
    };
})(jQuery);