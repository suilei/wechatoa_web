 /**
  *
  * File Contents Outline : 更改频道样式
  * Author :  wuxiumei（wuxiumei@panguso.com）
  * Function: 主要修改导航中当前频道（包含样式）及频道链接
  */
 (function() {
  var CHANNELS = {
			   news:{ //新闻搜索
			   				title:"新闻",
					   	  sid:"nav_news",
					  		lid:"nav_news_link",
					  		url:"#",
					  		sprefix:"",
					  		useable:true	
			  		    },
			    web:{ //网页搜索
			    			title:"网页",
					   	  sid:"nav_web",
					  		lid:"nav_web_link",
					  		url:"#",
					  		sprefix:"",
					  		useable:true	
			  		   },
			  	image:{ //图片搜索
			  				title:"图片",
					   	  sid:"nav_image",
					  		lid:"nav_image_link",
					  		url:"#",
					  		sprefix:"",
					  		useable:true	
			  	},
			  	journal:{ //报刊搜索
			  				title:"报刊",
					   	  sid:"nav_journal",
					  		lid:"nav_journal_link",
					  		url:"#",
					  		sprefix:"",
					  		useable:true	
			  	},
			  	community:{ //社区搜索
			  				title:"社区",
					   	  sid:"nav_community",
					  		lid:"nav_community_link",
					  		url:"#",
					  		sprefix:"",
					  		useable:true	
			  	},
			  	voice:{ //音频搜索
			  				title:"音频",
					   	  sid:"nav_voice",
					  		lid:"nav_voice_link",
					  		url:"#",
					  		sprefix:"",
					  		useable:true	
			  	},
			  	video:{ //视频搜索
			  				title:"视频",
					   	  sid:"nav_video",
					  		lid:"nav_video_link",
					  		url:"#",
					  		sprefix:"",
					  		useable:false	
			  	},
			    app:{ //应用搜索
			    			title:"应用",
					   	  sid:"nav_app",
					  		lid:"nav_app_link",
					  		url:"#",
					  		sprefix:"",
					  		useable:true	
			  	},
			  	people:{ //人物搜索
			  		    title:"人物",
					   	  sid:"nav_people",
					  		lid:"nav_people_link",
					  		url:"#",
					  		sprefix:"",
					  		useable:true	
			  	},
			  	more:{ //更多
			  		    title:"更多",
					   	  sid:"nav_more",
					  		lid:"nav_more_link",
					  		url:"#",
					  		sprefix:"",
					  		useable:true	
			  	}
			  },
			  /*
		    * 频道和频道div的id对应关系，用于从URL中得到当前的频道Id
		    * 用于未配置当前频道时，当前频道的标红处理
		    */
		    SITE_MAPPING = {
		       'news':'news',
		       'search':'web',
		       'image':'image',
			   'photo':'image',
		       'video':'video',
		       'music':'music',
		       'd':'web',
		       'map':'map',
		       'book':'book',
		       'app':'app'
		    },
			  WRAPPER_ID = "nav_wrapper",
        POS_INDEX_STYLE = "nav_index",
    		POS_RESULT_STYLE = "nav_result",
    		CURRENT_CHANNEL_STYLE = "cur",
        DEFAULT_CHANNEL = "web";

  function render(){
  	var nav = document.getElementById(WRAPPER_ID),
  	    html = "",
  	    i;
  	if(!nav){
  		html = '<p class="nav" id="nav_wrapper">';
  		for(i in CHANNELS){
  			if(CHANNELS.hasOwnProperty(i) && CHANNELS[i].useable === true){
  				html += '<span id="'+CHANNELS[i].sid+'"><a href="'+CHANNELS[i].url+ '" id="'+CHANNELS[i].lid+'">'+CHANNELS[i].title+'</a></span>'
  			}
  		};
  		html += "</p>";
  		document.writeln(html);
  	}
  }
		    
    /**
 	 * 获取元素样式
 	 */
 	function getClassNames(element) {
 		return element.className.replace(/\s+/, ' ').split(' ');
 	};

 	/**
 	 * 判断元素是否有该样式
 	 */
 	function hasClassName(element, className) {
 		var classes = getClassNames(element);
 		for (var i = 0; i < classes.length; i++) {
 			if (classes[i] === className) {
 				return true;
 			}
 		}
 		return false;
 	};

 	/**
 	 * 为元素添加样式
 	 */
 	function addClassName(element, className) {
 		element.className += (element.className ? ' ' : '') + className;
 		return true;
 	};

 	/**
 	 * 元素移除样式
 	 */
 	function removeClassName(element, className) {
 		var classes = getClassNames(element);
 		var length = classes.length
 		for (var i = length - 1; i >= 0; i--) {
 			if (classes[i] === className) {
 				delete(classes[i]);
 			}
 		}
 		element.className = classes.join(' ');
 		return (length == classes.length ? false : true);
 	};
 	
 	/**
 	 * 获取当前URL
 	 */
 	function getCurrentURL(){
 		 return window.location.href;
 	};
 	
 	if(!window.pgnav) { window['pgnav'] = {}; }	
 	window.pgnav.removeClassName = removeClassName;
 	window.pgnav.addClassName = addClassName;
 	window.pgnav.hasClassName = hasClassName;
 	window.pgnav.getCurrentURL = getCurrentURL;
 	/**
 	* 
 	* 更新导航链接中的检索词
 	*/
	window.pgnav.updateTopNavLink= function(kw){
		if(typeof kw === 'string'&& kw.length > 0){
		 	 for(var i in CHANNELS){
		 	 	 if(CHANNELS.hasOwnProperty(i)&&CHANNELS[i].useable === true){
				    	 var linkNd = document.getElementById(CHANNELS[i].lid);
				    	 if(typeof linkNd === 'object'&& linkNd){
				    	 	 var splitPos = linkNd.href.indexOf('?');
				    	 	 var link = linkNd.href;
				    	 	 if(splitPos!=-1){
				    	 	 	  link = linkNd.href.substring(0,splitPos);
				    	 	 	  linkNd.href = link + '?q=' + kw;
				    	 	 }else{
				    	 		  linkNd.href = link + CHANNELS[i].sprefix + '?q=' + kw;
				    	 	 }
				    	 }	 
	    	}
	    }
		}	 
	};
   
   //设置默认频道为网页搜索
   var channel = DEFAULT_CHANNEL,
		   //设置默认的位置是结果页
		   posStyle = POS_RESULT_STYLE,
			 pgKeyword = "",
			 channelId = "",
			 channelObj = null;
			 
	 
	 function setNav(){
			 //外部配置文件定义	 
		   if(typeof pgNavConf === 'object'&& pgNavConf){
		      if('channel' in pgNavConf) {
		           if(typeof pgNavConf.channel === 'string') {
		              channel = pgNavConf.channel ;
		           }
		      }
		      if('pos' in pgNavConf) {
		           if(typeof pgNavConf.pos === 'string') {
		              posStyle = pgNavConf.pos;
		           }
		      }
		      if('kw' in pgNavConf) {
		           if(typeof pgNavConf.kw === 'string') {
		              pgKeyword = pgNavConf.kw;
		           }
		      }
		   }else{//若未定义pgNavConf变量则从host里获得当前频道
		      var curHost = pgnav.getCurrentURL();
		      var end = curHost.indexOf('.');
		      if(end!=-1){
		      	  var start = curHost.indexOf('http://');
		          if(start!=-1){
		      	  	start = start + 7;
		      	  }else if(curHost.indexOf('https://')!=-1){
		      	  	start = curHost.indexOf('https://')+ 8;
		      	  }else{
		            start = 0;
		          }
		      	  localChanl = curHost.substring(start,end);
		          var curChanl = SITE_MAPPING[localChanl];
		          if(curChanl){
		             channel = curChanl;
		          }     	
		      }
		 }
		    if(channel in CHANNELS){
		    	 channelObj = CHANNELS[channel];
		    	 channelId = channelObj.sid;
		    }else{
		    	 throw new Error("The channnel "+ channel + "is not exist in conf!");
		    }
		    //设置频道位置样式
		    var wrapper = document.getElementById(WRAPPER_ID);
		    //去除其他样式
		    if(hasClassName(wrapper, POS_RESULT_STYLE)){
		        removeClassName(wrapper, POS_RESULT_STYLE);
		    }
		    if(hasClassName(wrapper, POS_INDEX_STYLE)){
		        removeClassName(wrapper, POS_INDEX_STYLE);
		    }
		    addClassName(wrapper, posStyle);
		    
		    //去除其他当前频道样式
		    var ulBox = document.getElementById(WRAPPER_ID);
		    var list = ulBox.getElementsByTagName("span");
		    for (var i = 0; i < list.length; i++) {
		        if (hasClassName(list[i], CURRENT_CHANNEL_STYLE)) {
		            removeClassName(list[i], CURRENT_CHANNEL_STYLE);
		        }
		    }
		    //添加搜索词参数
		    if(pgKeyword.length > 0){
			    pgnav.updateTopNavLink(pgKeyword);
		    }
		    //设置当前频道标红样式
		    if(channelObj.useable === true){
		    	var chal = document.getElementById(channelObj.sid);
		    	if(!!chal){
			    	addClassName(chal, CURRENT_CHANNEL_STYLE);
			    	var chalText = chal.textContent || chal.innerText|| "";
			    	if(chalText!=""){
			    	//去掉链接，改为文本
						chal.innerHTML = chalText;
			    	}
			    }
		    }
    }
    
    function init(){
    	render();
    	setNav();
    }
 	  
 	  init();
 })();