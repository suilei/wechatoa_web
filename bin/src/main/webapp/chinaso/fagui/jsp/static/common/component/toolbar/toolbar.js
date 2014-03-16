/**
 * Basic Library JavaScript
 * 
 * @module BL 
 */
var BL = window.BL || {};

BL.namespace = function(name){
	var arr = name.split("."),
			obj = BL;
	
	if(arr[0] === "BL"){
		arr.splice(0,1);
	}
	
	for(var i = 0; i < arr.length; i ++){
		if(typeof obj[arr[i]]!== "object"){
			 obj[arr[i]] = {};
		}
		obj = obj[arr[i]];
	}
	return obj;
}

BL.namespace("BL.Util.Cookie");

/**
 * Cookie Utilities
 * @namespace BL 
 * @class cookie
 */
 BL.Util.Cookie = {
   get:function(name,decode){
   	 var cookies = document.cookie,
   	 		 arr,
   	 		 reg = new RegExp("(^|)"+ name + "=([^;]*)(;|$)");
   	 		 arr = cookies.match(reg);
   	 if(arr){
   	 	  if(decode === true){
   	 	  	return this.decodeStr(arr[2]);
   	 	  }else{
   	 	  	return arr[2];
   	 	  }  
   	 }else{
   	 	 return null;
   	 }	
   },
   set:function(name,value,expires,domain,path,secure){
   	 var c = encodeURIComponent(name) + "=" + encodeURIComponent(value),
   	     d = null,
   	     days = 30;
   	 if(expires instanceof Date){
   	 	 c += ";expires=" + expires.toGMTString() ;
   	 }else{//不设置此参数，默认30天
   	 	 d = new Date();
   	 	 d.setTime(d.getTime() + days*24*60*60*1000);
   	 	 c += ";expires =" + d.toGMTString();
   	 }
   	 if(path){
   	 	c += ";path=" + path;
   	 }
   	 
   	 if(domain){
   	 	c += ";domain=" + domain;
   	 }
   	 
   	 if(secure){
   	 	c += ";secure";
   	 }
   	 
   	 document.cookie = c;
   },
   decodeStr:function(str){
	    var ret = "",i,len = str.length;
	    for(i=0 ; i<len ; i++) {
	        var chr = str.charAt(i);
	        if(chr == "+") {
	            ret += " ";
	        }else if(chr=="%") {
	            var asc = str.substring(i+1,i+3);
	            if(parseInt("0x"+asc)>0x7f) {
	                ret += decodeURI("%"+ str.substring(i+1,i+9));
	                i += 8;
	            }else {
	                ret += String.fromCharCode(parseInt("0x"+asc));
	                i += 2;
	            }
	        }else {
	            ret += chr;
	        }
	    }
	    return ret;
  }	
}


BL.Util.Time = {
 	 getDay:function(){
 	   var arr=["日","一","二","三","四","五","六"];
 	   var day = "周"+arr[new Date().getDay()];  
 	 	 return day;
 	 },
 	 /**
 	 * 
 	 * 按照格式yyyy-mm-dd获得当前年月日
 	 */
 	 getFormatDate: function(){
 	 	 var d,s;
	  d = new Date();
	  s = d.getFullYear() + "-";             //取年份
	  s += (d.getMonth() + 1) + "-";//取月份
	  s += d.getDate() + " ";         //取日期
	  return s;
 	 }	
}

BL.Util.FavSite =(function(){
	 function add(url,info){
	 	 if (document.all){
			  window.external.addFavorite(url,info);
		 }else{
				alert('请使用Ctrl + D 手动加入收藏');
		 }
	 }
	 return {
	 	 add:add
	 }	
})();

BL.Util.Event = {
		addHandler: function(element, type, handler){
		if (element.addEventListener){// W3C
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent){//IE
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
    },
    
    removeHandler: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    }
}

BL.Util.JSONP = function(url,callback){
	var s = document.createElement("script"),
			first = document.getElementsByTagName("script")[0];
	s.type="text/javascript";
	if(typeof callback !== "string"){
		 throw new Error("The jsonp function need a callback function name");
	}
	s.src = url + (url.indexOf("?") == -1 ? "?" : "&" ) + "jsonpcallback=" + callback;
	first.parentNode.insertBefore(s,first);
}


BL.Util.Mark = (function () {
    var isIEmac = false; /*@cc_on @if(@_jscript&&!(@_win32||@_win16)&& 
(@_jscript_version<5.5)) isIEmac=true; @end @*/
    var isMSIE = (-[1,]) ? false : true;
    var cjHref = location.href;
 
    function hotKeys() {
        var ua = navigator.userAgent.toLowerCase();
        var str = '';
        var isWebkit = (ua.indexOf('webkit') != - 1);
        var isMac = (ua.indexOf('mac') != - 1);
 
        if (ua.indexOf('konqueror') != - 1) {
            str = 'CTRL + B'; // Konqueror
        } else if (window.home || isWebkit || isIEmac || isMac) {
            str = (isMac ? 'Command/Cmd' : 'CTRL') + ' + D'; // Netscape, Safari, iCab, IE5/Mac
        }
        return ((str) ? 'Press ' + str + ' to bookmark this page.' : str);
    }
 
    function isIE8() {
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
        }
        if (rv > - 1) {
            if (rv >= 8.0) {
                return true;
            }
        }
        return false;
    }
 
    function add(a,cjTitle) {
        try {
            if (typeof a == "object" && a.tagName.toLowerCase() == "a") {
                a.style.cursor = 'pointer';
                if ((typeof window.sidebar == "object") && (typeof window.sidebar.addPanel == "function")) {
                    window.sidebar.addPanel(cjTitle, cjHref, ""); // Gecko
                    return false;   
                } else if (isMSIE && typeof window.external == "object") {
                    if (isIE8()) {
                        window.external.AddToFavoritesBar(cjHref, cjTitle); // IE 8                    
                    } else {
                        window.external.AddFavorite(cjHref, cjTitle); // IE <=7
                    }
                    return false;
                } else if (window.opera) {
                    a.href = cjHref;
                    a.title = cjTitle;
                    a.rel = 'sidebar'; // Opera 7+
                    return true;
                } else {
                   hotKeys();
                }
            } else {
                throw "Error occured.\r\nNote, only A tagname is allowed!";
            }
        } catch (err) {
            alert(err);
        }
 
    }
 
    return {
        addBookmark : add
    }
})();

BL.namespace("BL.Com");
 
BL.Util.Dom={ 
	replaceHtml:function(el, html) {
		var oldEl = typeof el === "string" ? document.getElementById(el) : el;
		/*@cc_on 
			oldEl.innerHTML = html;
			return oldEl;
		@*/
		var newEl = oldEl.cloneNode(false);
		newEl.innerHTML = html;
		oldEl.parentNode.replaceChild(newEl, oldEl);
		return newEl;
	}
};

BL.Com.Toolbar = (function(BL){
	var CONST = {
		content:"",
		CID:"jToolbar",//组件id
		REGID:"jToolbarReg",//注册id
		LGID:"jToolbarLogin",//登陆id
		BACKID:"jToolbarBack",//返回首页id
		FID:"jToolbarFav",//收藏id
		WID:"jToolbarWeather",//天气id
		TID:"jToolbarTime",//日期id
		UNID:"jToolbarUserName",//用户名id
		EXITID:"jToolbarExit",//退出id
		UAREA:"jToolbarUser",//用户区id
		COOKIE_LOGIN:"pangusoticket_titlename",
		COOKIE_USER_NAME:"pangusoticket_titlename"
	},
	CONF = {
		URL_UNAME:"http://www.panguso.com/",//新域名
		URL_UNAME:"http://www.panguso.com/",//用户名网址
		URL_LOGIN:"http://my.panguso.com:8805/",//登陆域名
		URL_REG:"http://my.panguso.com:8805/",//注册域名
		URL_PASSPORT_BASE:"https://passport.panguso.com:8443/",
		URL_EXIT:"https://passport.panguso.com:8443/",//退出域名
		URL_AJAX_EXIT:"https://passport.panguso.com:8443/logout!doLogout.htm",
		VSTAR_PATH:"http://image.panguso.com",
		PASSPORT_PATH:"https://passport.panguso.com:8443/"
	},
	cookieUtil = BL.Util.Cookie,
	timeUtil = BL.Util.Time;
	fav = BL.Util.FavSite;
	ev = BL.Util.Event;
	 
	 
	 //cookieUtil.set(CONST.COOKIE_LOGIN,"dd",null,".panguso.com","/"); 
	 //cookieUtil.set(CONST.COOKIE_USER_NAME,"wxm@163.com",null,".panguso.com","/");
	 
	function isLogin(){
		var lgc = cookieUtil.get(CONST.COOKIE_LOGIN,true);
		if(lgc !==null){
			return true;
		}else{
			return false;
		}
	}
	  
	 function getUserState(){
	 	var uarea = document.getElementById(CONST.UAREA),
	 			 uname,
	 	 		 html;
	 	if(isLogin()){//登陆状态 
	 	 	uname = cookieUtil.get(CONST.COOKIE_USER_NAME,true) || "";
	 	 	html = '<a id="jToolbarUserName" href="'+CONF.URL_UNAME+'">'+uname+'</a><span>|</span><a id="jToolbarExit" href="#">退出</a>';
			  
			$('#jToolbarExit').live('click', function() {
				$(this).PassportLogout({
					'basePath' : CONF.VSTAR_PATH + '/passport/logout.htm',
					'passurl' : CONF.URL_EXIT + '/logout!doLogout.htm'
				}, {
					sucCb : function() {
						BL.Com.Toolbar.update();
					},
					errorCb : function() {
						BL.Com.Toolbar.update();
					}
				});
			});
	  	}else{
			var redirect = window.location.href;
			var loginUrl = CONF.URL_LOGIN + "login.jsp?url=http://image.panguso.com/ts.htm?u=" + encodeKeyword(redirect);
	  		html = '<a id="jToolbarLogin" href="'+loginUrl+'">登录</a><span>|</span><a id="jToolbarReg" href="'+loginUrl+'">注册</a>';
	  	}
 	 	return html;
 	 }
	
	/**
	 * 将请求中的关键字进行转码，避免中文乱码问题。songxg 2012-11-11
	 */
	function encodeKeyword(url) {
		var arr = url.split('&');
		for(var i = 0, l = arr.length; i < l; i++) {
			if(arr[i].indexOf('q') != -1) {
				var kw = arr[i].substring(arr[i].indexOf('q'));
				var convertKw = encodeURI(kw);
				arr[i] = arr[i].replace(kw, convertKw);
			}
		}
		
		return arr.join('&');
	}
 	 
 	 function updateUserState(){
 	 	 var u = document.getElementById(CONST.UAREA);
 	 	 if(u){
 	 	 	 u.innerHTML = getUserState();
 	   }
 	 }
 	 
 	 function render(){
 	 	 var toolbar = document.getElementById(CONST.CID),
 	 	     content = '<div class="account"><i id="jToolbarUser">'+getUserState()+'</i><span>|</span>'
 	 	 	  				+ '<a id="jToolbarBack" href="'+CONF.URL_INDEX+'">返回首页</a><span>|</span><a id="jToolbarFav" href="#">收藏本站</a></div>'
 	 	 	  				+ '<div class="fl"><span id="jToolbarTime"></span> | <span id="jToolbarWeather"></span></div>',
 	 	 	   wrapper = '<div class="top" id="jToolbar">' + content + '</div>';
 	 	 if(typeof toolbar === undefined){
 	 	 	  document.writeln(wrapper);
 	 	 }else{
 	 	 	  toolbar.innerHTML = content;
 	 	 }
 	 }
 	 
 	 function logout(){
 	 	 BL.Util.JSONP(CONF.URL_AJAX_EXIT,"BL.Com.Toolbar.updateUserState");
 	 }
 	 
 	 //注册用户相关事件
 	 function bindUserEvent(){
		var exit = document.getElementById(CONST.EXITID);
		if(exit){
			ev.addHandler(exit,"click",logout);
		}
 	 }
 	 
 	 function unBindUserEvent(){
 	 	 var exit = document.getElementById(CONST.EXITID);
 	 	  if(exit){
 	 	  	ev.removeHandler(exit,"click",logout);
 	 	  }
 	 }
 	 
 	 function getCurDate(){
 	 	 return timeUtil.getFormatDate() + " " + timeUtil.getDay();
 	 }
 	 
 	 function setTimeArea(){
 	 	 var d = getCurDate();
 	 	 var o = document.getElementById(CONST.TID);
 	 	 if(o){
 	 	 	 o.innerHTML = d;
 	 	 }
 	 }
 	 
 	 function setWheather(){
 	 	 var w = "北京2：晴 33 ～23℃" ;
 	 	 var o = document.getElementById(CONST.WID);
 	 	 if(o){
 	 	 	 o.innerHTML = w;
 	 	 }
 	 	 return w;
 	 }
 	 
 	 
 	 function bindFavEvent(){
 	 	 var f = document.getElementById(CONST.FID);
 	 	 if(f){
			ev.addHandler(f,"click",function(){
				//mark.add(f);
			   fav.add(window.location.href,document.title);
			});
 	 	 }
 	 }
 	 
 
 	
 	 function init(conf){

     render();
     
		//CONF = $.extend(CONF,conf);
		//设置日期
		setTimeArea();

		//设置天气
		setWheather();

		//用户状态
		updateUserState();
 	 	 
 	 	//bindUserEvent();
		//收藏网址
		bindFavEvent();
 	 	 
		return this;
 	 }
 	 
 	 //登陆退出事件
 	 
 	 return {
 	 	  init:init,
 	 	  update:updateUserState,
 	 	  conf:CONF
 	 }

 })(BL).init();
 


 