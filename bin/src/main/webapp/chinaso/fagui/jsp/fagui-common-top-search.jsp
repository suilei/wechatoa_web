<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!--2-LOGO+输入框+按钮-->      
<div class="head">
    <!--logo插件-->    
<a href="#" class="logo"></a>
 <!--导航-->  
<p class="nav" id="nav_wrapper">
				<span id="nav_news"><a href="http://news.chinaso.com" id="nav_news_link">新闻</a></span>
				<span id="nav_web"><a href="http://web.chinaso.com" id="nav_web_link">网页</a></span>
				<span id="nav_image"><a href="http://image.chinaso.com" id="nav_image_link">图片</a></span>
				<span id="nav_journal"><a href="http://nav.chinaso.com" id="nav_nav_link">导航</a></span>
				<span id="nav_community"><a href="http://house.chinaso.com" id="nav_house_link">房产</a></span>

				
			</p>

<script type="text/javascript">
(function(){var b={news:{title:"新闻",sid:"nav_news",lid:"nav_news_link",url:"#",sprefix:"",useable:true},web:{title:"网页",sid:"nav_web",lid:"nav_web_link",url:"#",sprefix:"",useable:true},image:{title:"图片",sid:"nav_image",lid:"nav_image_link",url:"#",sprefix:"",useable:true},journal:{title:"报刊",sid:"nav_journal",lid:"nav_journal_link",url:"#",sprefix:"",useable:true},community:{title:"社区",sid:"nav_community",lid:"nav_community_link",url:"#",sprefix:"",useable:true},voice:{title:"音频",sid:"nav_voice",lid:"nav_voice_link",url:"#",sprefix:"",useable:true},video:{title:"视频",sid:"nav_video",lid:"nav_video_link",url:"#",sprefix:"",useable:false},app:{title:"应用",sid:"nav_app",lid:"nav_app_link",url:"#",sprefix:"",useable:true},people:{title:"人物",sid:"nav_people",lid:"nav_people_link",url:"#",sprefix:"",useable:true},more:{title:"更多",sid:"nav_more",lid:"nav_more_link",url:"#",sprefix:"",useable:true}},h={news:"news",search:"web",image:"image",photo:"image",video:"video",music:"music",d:"web",map:"map",book:"book",app:"app"},i="nav_wrapper",c="nav_index",d="nav_result",p="cur",r="web";function s(){var w=document.getElementById(i),v="",u;if(!w){v='<p class="nav" id="nav_wrapper">';for(u in b){if(b.hasOwnProperty(u)&&b[u].useable===true){v+='<span id="'+b[u].sid+'"><a href="'+b[u].url+'" id="'+b[u].lid+'">'+b[u].title+"</a></span>"}}v+="</p>";document.writeln(v)}}function f(u){return u.className.replace(/\s+/," ").split(" ")}function j(w,x){var v=f(w);for(var u=0;u<v.length;u++){if(v[u]===x){return true}}return false}function e(u,v){u.className+=(u.className?" ":"")+v;return true}function k(w,x){var v=f(w);var y=v.length;for(var u=y-1;u>=0;u--){if(v[u]===x){delete (v[u])}}w.className=v.join(" ");return(y==v.length?false:true)}function q(){return window.location.href}if(!window.pgnav){window.pgnav={}}window.pgnav.removeClassName=k;window.pgnav.addClassName=e;window.pgnav.hasClassName=j;window.pgnav.getCurrentURL=q;window.pgnav.updateTopNavLink=function(x){if(typeof x==="string"&&x.length>0){for(var u in b){if(b.hasOwnProperty(u)&&b[u].useable===true){var y=document.getElementById(b[u].lid);if(typeof y==="object"&&y){var v=y.href.indexOf("?");var w=y.href;if(v!=-1){w=y.href.substring(0,v);y.href=w+"?q="+x}else{y.href=w+b[u].sprefix+"?q="+x}}}}}};var t=r,m=d,o="",g="",a=null;function l(){if(typeof pgNavConf==="object"&&pgNavConf){if("channel" in pgNavConf){if(typeof pgNavConf.channel==="string"){t=pgNavConf.channel}}if("pos" in pgNavConf){if(typeof pgNavConf.pos==="string"){m=pgNavConf.pos}}if("kw" in pgNavConf){if(typeof pgNavConf.kw==="string"){o=pgNavConf.kw}}}else{var D=pgnav.getCurrentURL();var z=D.indexOf(".");if(z!=-1){var v=D.indexOf("http://");if(v!=-1){v=v+7}else{if(D.indexOf("https://")!=-1){v=D.indexOf("https://")+8}else{v=0}}localChanl=D.substring(v,z);var C=h[localChanl];if(C){t=C}}}if(t in b){a=b[t];g=a.sid}else{throw new Error("The channnel "+t+"is not exist in conf!")}var u=document.getElementById(i);if(j(u,d)){k(u,d)}if(j(u,c)){k(u,c)}e(u,m);var w=document.getElementById(i);var B=w.getElementsByTagName("span");for(var A=0;A<B.length;A++){if(j(B[A],p)){k(B[A],p)}}if(o.length>0){pgnav.updateTopNavLink(o)}if(a.useable===true){var y=document.getElementById(a.sid);if(!!y){e(y,p);var x=y.textContent||y.innerText||"";if(x!=""){y.innerHTML=x}}}}function n(){s();l()}n()})();
</script>
<!--输入框-->      
<div class="search">
        <p></p>
<form action="http://image.panguso.com/imagesearchnew.htm" method="get">
				<input type="hidden" name="n" value="50">
				<input type="hidden" name="tw" value="1">
				<input type="text" class="search_input2" id="q" name="q" value="" />
				<input type="submit" class="search_btn2" value="搜索" />
			</form>
        
    
    </div>
<!--2-LOGO+输入框+按钮 end-->   


  </div>
  <!--2-输入框+按钮 END-->
