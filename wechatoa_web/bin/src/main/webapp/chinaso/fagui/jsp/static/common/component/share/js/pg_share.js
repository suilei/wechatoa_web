/**
 * 分享组件
 *
 * @module pg
 * @submodule share component
 * @author wuxiumei
 * @requires jquery.qtip jquery.ptip jquery.jtemplate
 * @params
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
 (function() {
     var S = function(tplId){
	  this.shareTplId = tplId;
	  this.defaultOps={
				'des':'',
				'content':'',
				'addURLContent':'',
				'url': location.href,
				'images':'',
				'target':null,
				'triggerBy':null,
				'kaixin':{
				  'title':''
				},
				'beforeShare':function(){},
				'wangyiSource': encodeURIComponent('盘古搜索'),
				'weiboAppKey':{
					'qq':'',
					'sina':'',
					'wangyi':'',
					'sohu':'',
					'yidong139':''
				  },
				 'type':'append',
				 'position': {
					   'my': 'top left',// Use the corner...
					   'at': 'bottom right' // ...and opposite corner
					}
			  };
	}
	 
	 
	 S.prototype = { 
		init_content: function(tplURL,json){
			 $('<div id = '+this.shareTplId+'></div>')
			 .appendTo($('body'))
			 .hide()
             .setTemplateURL(tplURL)
    		 .processTemplate(json);
	   },
	   //跨子域通信,模板需在chinaso.com域名下,默认的跨越文件路径为http://www.chinaso.com/common_demo/pg_cd_proxy.html
	   init_cd_content: function(tplURL,data,cdURL){
		   if(!cdURL){
			   cdURL = "http://www.chinaso.com/common_demo/pg_cd_proxy.html";
		   }
		   var _this = this;
		   var tplId = _this.shareTplId;
		   _this._setDomain();
		   _this.createIframe("crossDomainIfram",cdURL,
		   function(){
			var iframe=document.getElementById('crossDomainIfram').contentWindow.$;        
		    iframe.get(tplURL,function(data){
		    	$('<div id = '+tplId+'></div>').html(data)
		    	.appendTo($('body'))
			    .hide();
			    $('#'+tplId).processTemplate(data);
		    });
		   });
	   },
	   _setDomain: function(){
           var $s = $('<script type="text/javascript">document.domain="chinaso.com";</script>');
    	   $('head').append($s);
       },
       createIframe:function(id,url,callback){
           var $s = $('<iframe src="'+url+'" id="'+id+'" style="display:none"/>');
    	   $('body').append($s);
    	   var iframe = $s[0];
    	   this._bindOnloadEvent("load",iframe,callback);
    	},
       _bindOnloadEvent:function(eventName,element,callback){
       		if (element.attachEvent) {
      			element.attachEvent("on"+eventName,function(){
      				//element.detachEvent("onload",arguments.callee);
      				callback();
      			});
      		}else {
      			 // Mozilla, Opera and webkit nightlies currently support this event
      			element.addEventListener(eventName,function(){
      				//element.removeEventListener("load",arguments.callee, false);
      				callback();
      			},false);
      		}
         },
        bind_share_content: function(opts){
		   var $temp = $('#'+this.shareTplId);
		   var $tpl = $temp.clone();
		   return this._bind_content(opts,$tpl);
		},
		_bind_content: function(opts,$tpl){
			   var _this = this;
				$tpl.find('a').unbind('click').bind('click',opts,function(event){
					eventObj = event.srcElement ? event.srcElement : event.target;
					 var des = $(eventObj).attr('des');
					 event.data.des = des;
					 _this._share_to(event.data);
					 opts.beforeShare.call(this,$(this));
					 return false;
				 });
				return $tpl;
			},
		share: function (opts){
			var defaultOps = this.defaultOps;
			opts = $.extend(defaultOps, opts);
			if(opts.type=='append'){
				this.invoke_appendtip(opts);
			}else if(opts.type=='pop'){
				this.invoke_poptip(opts);
			}		
		},
		invoke_appendtip:function (opts){
			//加载了jquery.ptip.js
		  if($('body').pTip&&$.isFunction($('body').pTip)){
			$('body').pTip({
					  uitooltip:'ui-appendtip',
					  target:opts.target,
					  triggerBy: opts.triggerBy,
					  content: {
					  text:  this.bind_share_content(opts),
					  title: {
						  text: '',
						  button: true
					  }
					}
				 })
		   }
		},
	 invoke_poptip:function(opts){
	  var _this = this;
	  var $temp = $('#'+_this.shareTplId);//.clone(true);
	  var $tpl = null;
	  if($.browser.msie&&($.browser.version==='6.0'||$.browser.version==='7.0')){
		  pclone = $temp[0].cloneNode(true);
		  $tpl = $(pclone);
	  }else{
		  $tpl = $temp.clone(); 
	  }
	  //加载了jquery.qip.js
	  if(opts.triggerBy.qtip&&$.isFunction(opts.triggerBy.qtip)){
	  	//opts.triggerBy.removeData('qtip');
		opts.triggerBy.each(function(){
			$(this).qtip({
		           content: {
				   text:  _this._bind_content(opts,$tpl), 
				   title: {
					  text:'&nbsp;',
					  button: true
				   }
				},
				overwrite: false,
				position: opts.position,
				show: {
				   event: 'click', // Don't specify a show event...
				   ready: true, // ... but show the tooltip when ready
				   solo: true
				},
				hide: false, // Don't specify a hide event either!
				style: {
				   classes: 'chinaso-ui-tooltip ui-tooltip-shadow ui-tooltip-light'
				}
			 });
		})
	  }
	},
	invoke_modaltip:function (opts){
		//加载了jquery.qip.js
	  if(opts.triggerBy.qtip&&$.isFunction(opts.triggerBy.qtip)){
		 opts.triggerBy
		 .qtip({
		  id: 'modal', // Since we're only creating one modal, give it an ID so we can style it
		  content: {
			 text: this.bind_share_content(opts),
			 title: {
				text: true,
				button: true
			 }
		  },
		  position: {
			 my: 'center', // ...at the center of the viewport
			 at: 'center',
			 target: $(window)
		  },
		  show: {
			 event: 'click', // Show it on click...
			 solo: true, // ...and hide all other tooltips...
			 modal: true // ...and make it modal
		  },
		  hide: false,
		  style: {
		  classes:'ui-tooltip-light ui-tooltip-rounded'
		  }
	   });
	  }
	},
/**
  * @param des
  * @param title
  * @param content
  * @param fromUrl 分享来源网址
  * @param 
  * @return
  * 
  * 备注：此方法不包含记录点击log逻辑
  */
  _share_to:function (params){
		var des = params.des;
		var imgURL = params.images;
		var content = params.content;
		var title = params.kaixin.title;
		var addURLContent = params.addURLContent;
		var url = params.url;//来源网址
		if(!params.addURLContent||$.trim(params.addURLContent)<1){
			addURLContent = content;
		}
		var s = screen;
		var d = document;
		var e = encodeURIComponent;
		var f = "";//收藏URL
		var p = "";//收藏的参数
		if (des == 'sk139') {
			//不能带图，url自动添加到内容上
			f = "http://shequ.10086.cn/share/share.php";
			p = "?title=" + e(content)+
				  '&url=' + e(url);
		} else if (des == 't.sina') {
			//url自动添加到内容上,图片不宜过大，否则新浪不分享
			f = "http://v.t.sina.com.cn/share/share.php";
			p = '?title=' + e(content) + 
				'&url=' + e(url)+
				'&pic=' + e(imgURL)+
				'&appkey='+params.weiboAppKey.sina;
		} else if (des == 'kaixin') {
			//f = "http://www.kaixin001.com/repaste/share.php";
			f="http://www.kaixin001.com/rest/records.php";
			//能携带图片,开心网分享参数中含有标题和内容，url自动添加到内容上
			p = '?url=' + e(url)  +
				'&title=' + e(title) +
				'&content=' + e(content)+
				'&pic='+e(imgURL)+"&style=11";
		} else if (des == 'douban') {
			//点击分享的内容会链接到url所在的地址
			f = "http://www.douban.com/recommend/";
			p = '?url=' + e(url) +
				'&title=' + e(content)+
				'&image=' + e(imgURL);
		}else if (des == 'renren') {
			//不支持图片的参数，从url参数网站自动解析图片，生成的title也会自动生成到此url的链接
			f = "http://share.renren.com/share/buttonshare/post/1004";
			p = '?url=' + e(url)  +
				'&title=' + e(title) +
				'&content='+ e(addURLContent) +
				'&pic='+ e(imgURL);
		}else if (des == 't.sohu') {
			//搜狐的title参数为显示的主要内容，内容后面会自动带上url参数
			f = "http://t.sohu.com/third/post.jsp";
			p = '?content=utf-8'+
				'&url=' + e(url) +
				'&title=' + e(content)+
				'&pic=' + e(imgURL) +
				'&appkey='+params.weiboAppKey.sohu;
		}else if (des == 't.wangyi') {
			f = "http://t.163.com/article/user/checkLogin.do";
			//网易显示内容为info，不会自动带上url参数，根据source的文字自动识别来源网址，这里source 为盘古搜索
			p = '?info='+ e(addURLContent) +
				//'&source=%E7%9B%98%E5%8F%A4%E6%90%9C%E7%B4%A2'+
				'&source='+ params.wangyiSource +
				'&images=' + e(imgURL) + 
				'&link=' + e(url)+//此参数貌似没用
				'&appkey=' + params.weiboAppKey.wangyi;
		}else if (des == 't.qq') {
			//腾讯微博通过appkey来识别来源网站,title参数为显示的主要内容，内容后面会自动带上url参数
			f = "http://v.t.qq.com/share/share.php";
			p = '?title=' + e(content) +
				'&url=' + e(url) + 
				'&site='+ e(url) +
				'&pic=' + e(imgURL) +
				'&appkey=' + params.weiboAppKey.qq ;
		}else {
			alert("error in invoking share_to()");
		}   
		window.open(f + p,"_blank", 
				['toolbar=0,status=0,resizable=1,width=620,height=450,left=',(s.width-620)/2,',top=',(s.height-450)/2].join(''));
	}
	};
	 if(!window.pg) { window['pg'] = {}; }	
	 window.pg.shareComponent= new S("PgShareTpl");
	 
  })();