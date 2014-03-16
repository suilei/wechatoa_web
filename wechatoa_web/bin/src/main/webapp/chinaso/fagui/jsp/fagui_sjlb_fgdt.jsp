<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!--法规动态-->
<div class="fagui_fgdt">
<div class="fagui_Lfg"><a href="#" target="_blank">法规动态</a></div>
<div class="fagui_Rfg">
<script type="text/javascript">
window.onload = function(){
var speed=30;
var tab=document.getElementById("demo");
var tab1=document.getElementById("demo1");
var tab2=document.getElementById("demo2");
tab2.innerHTML=tab1.innerHTML;
function Marquee(){
if(tab2.offsetWidth-tab.scrollLeft<=0)
tab.scrollLeft-=tab1.offsetWidth
else{
tab.scrollLeft++;
}
}
var MyMar=setInterval(Marquee,speed);
tab.onmouseover=function() {clearInterval(MyMar)};
tab.onmouseout=function() {MyMar=setInterval(Marquee,speed)};
}
</script>
<div id="demo">
<div id="indemo">
<div id="demo1">
<dl>
<dd>·<a href="http://www.wenming.cn/ll_pd/yw_ll/201311/t20131112_1575808.shtml" target="_blank">中国共产党第十八届中央委员会第三次全体会议公报</a></dd>
<dd>·<a href="http://gdzh.wenming.cn/001/201311/t20131129_918795.html" target="_blank">珠海500义工成立食品安全调查队</a></dd>
<dd>·<a href="http://nj.wenming.cn/wmbb/201311/t20131129_1608229.shtml" target="_blank">南京市首批 10位“勤廉之星”产生</a></dd>
<dd>·<a href="http://fj.wenming.cn/rdxw/zdbb/201311/t20131129_917953.htm" target="_blank">福建推出微基金项目 人人可冠名基金</a></dd>
<dd>·<a href="http://sz.wenming.cn/gjbs/201311/t20131128_917106.shtml" target="_blank">苏州探索志愿活动“学分制”</a></dd>
<dd>·<a href="http://hf.wenming.cn/zyfw/zyfwzxdt/201311/t20131129_1607919.shtml" target="_blank">合肥探索志愿者回馈激励模式</a></dd>
<dd>·<a href="http://wh.wenming.cn/jujiao/201311/t20131128_1605914.htm" target="_blank">威海乳山公开“晒孝” 601村建起赡养榜</a></dd>
<dd>·<a href="http://wx.wenming.cn/wmwx/201311/t20131128_916588.html" target="_blank">无锡师德师风监督举报网站上线</a></dd>
<dd>·<a href="http://hz.wenming.cn/hrzc/201311/t20131128_916872.htm" target="_blank">惠州将学生志愿服务纳入课程管理</a></dd>
<dd>·<a href="http://wf.wenming.cn/jjwf/201311/t20131127_1605048.shtml" target="_blank">全国道德模范感恩节倡议感恩从父母开始</a></dd>
</dl>
</div>
<div id="demo2"></div>
</div>
</div>
</div>
</div>
<!--法规动态end-->