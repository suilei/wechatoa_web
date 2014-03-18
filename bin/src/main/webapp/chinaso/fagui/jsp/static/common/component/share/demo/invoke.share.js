//调用者demo
$(document).ready(function() {
	//如果从外表加载分享的内容，需准备分享的模板
	var cdURL="http://www.chinaso.com/common_demo/pg_cd_proxy.html";
	var tplURL = "http://www.panguso.com/static/component/pg/share/tpl/shareTemplate2.html";
	
	//跨子域加载模板,模板需在panguso.com域名下,
	//调用方式1：不指定跨域文件，默认的跨越文件路径为http://www.chinaso.com/common_demo/pg_cd_proxy.html
	pg.shareComponent.init_cd_content(tplURL,{});
	//调用方式2：指定跨域文件， 注意：两种调用方式选其一调用即可
	//pg.shareComponent.init_cd_content(tplURL,{},'http://www.chinaso.com/common_demo/pg_cd_proxy.html');
	 $("#appendTip").click(function(){
		//init share bind
    	var _this = this;
    	var tid= $(_this).attr('tid');
    	var text = $('#conent').text();
    	var imageURL = $('#testImage').attr('href');
    	var url = 'http://www.taihainet.com/news/pastime/sports/2012-08-01/899144.html';
    	//prepare share data
    	/*
    	 *  必传参数：
    	 *  content: 分享的内容
    	 *  url ：分享来源
    	 *  target：分享弹框显示所在jquery对象
    	 *  triggerBy：触发分享的jquery对象
    	 *  
    	 *  可选参数
    	 *  addURLContent: 含来源链接的分享内容,为统一显示来源，建议加上此参数
    	 *  images：分享中需显示的图片，目前仅支持添加一个图片链接。
    	 *          新浪、豆瓣、搜狐、网易、腾讯、人人、开心网支持传图片
    	 *  type: tip的类型,有'append'、'pop'两个取值，
    	 *  	  'append'为占文档流的弹框，'pop'为不占文档流的弹框，默认为'append'
    	 *  position：若tip为pop，此参数为有效，默认为'position': {'my': 'top left','at': 'bottom right'}
    	 *  weiboAppKey:微博来源的认证码，如果有4大微博的Appkey，则可传递此参数
    	 *  kaixin.title 分享的标题，仅开心网的特殊参数
    	 */
    	var data = {
	    'content':text+' ',
	    'addURLContent':text+' '+url,
	    'url':url,
	    'images':imageURL,
		'target':$('#sharePosition'),
		'triggerBy':$(_this),
		'kaixin':{
		  'title':'盘古图片“qq”搜索结果'
	      },
				'beforeShare':function(){},
		  'type':'append',
		  'extendData':{email:'test@163.com'},
		  'bindExtraActions':function($obj,opts){
		  	   if($obj.attr('des')){
		  	   	 alert(opts.email);
		  	  }
		  	}
	    }
		//invoke share
    	pg.shareComponent.share(data);
    	return false;
    });
    
    $("#popTip").click(function(){
		//init share bind
    	var _this = this;
    	var tid= $(_this).attr('tid');
    	var text = $('#conent').text();
    	var imageURL = $('#testImage').attr('href');
    	var url = 'http://news.cnnb.com.cn/system/2012/08/01/007402371.shtml';
    	//prepare share data
    	var data = {
	    'content':text+' ',
	    'addURLContent':text+' '+url,
	    'url':url,
	    'images':imageURL,
		  'triggerBy':$(_this),
		'kaixin':{
		  'title':'盘古图片“qq”搜索结果'
	      },
				'beforeShare':function(){},
		  'type':'pop',
		  'position': {
			   'my': 'top center',// Use the corner...
			   'at': 'bottom center' // ...and opposite corner
			}
	    }
		//invoke share
    	pg.shareComponent.share(data);
    	return false;
    });
    
    //遇到需要外部事件需调用关闭情况的：关闭分享框方法
    $('#close').click(function(){
    	$('.ui-tooltip-close').trigger('click');
    })
}); 