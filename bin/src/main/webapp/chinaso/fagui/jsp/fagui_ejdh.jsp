<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@include file="fagui-common-include.jsp"%>
<link href="static/css/fagui_ejdh.css" type="text/css" rel="stylesheet" />
<title>法规频道二级导航</title>
</head>
<body class="fagui_all">
	<%@include file="fagui-common-top.jsp"%>
	<!--1-顶部 end-->
	<!--2-LOGO+输入框+按钮-->
	<%@include file="fagui-common-top-search.jsp"%>
	<!--2-输入框+按钮 END-->
	<%@include file="fagui-common-top-nav.jsp"%>
	<!--头部end-->
	<div class="fagui_h10"></div>
	<!--频道导航-->
	<%@include file="fagui_ejdh_menu.jsp"%>
	<!--频道导航结束-->
	<div class="fagui_h10"></div>
	<!--频道位置-->
	<%@include file="fagui_ejdh_pd_position.jsp"%>
	<div class="fagui_h10"></div>
	<!--国情频道二级导航主内容-->
	<div class="fagui_wrap">
		<!--国情频道二级左侧主内容-->
		<div class="fagui_left">

			<!--什么是法律-->
			<%@include file="fagui_ejdh_left_falv_dec.jsp"%>
			<!--什么是法律--end-->

			<div class="fagui_h10"></div>
			<div class="fagui_h10"></div>

			<!--民商法-->
			<%@include file="fagui_ejdh_left_class1.jsp"%>
			<!--民商法--end-->

			<div class="fagui_h10"></div>
			<div class="fagui_h10"></div>

			<!--经济法-->
			<%@include file="fagui_ejdh_left_class2.jsp"%>
			<!--经济法--end-->

			<div class="fagui_h10"></div>
			<div class="fagui_h10"></div>

			<!--社会法-->
			<%@include file="fagui_ejdh_left_class3.jsp"%>
			<!--社会法--end-->

			<div class="fagui_h10"></div>
			<div class="fagui_h10"></div>

			<!--程序法-->
			<%@include file="fagui_ejdh_left_class4.jsp"%>
			<!--程序法--end-->

			<div class="fagui_h10"></div>
			<div class="fagui_h10"></div>

			<!--刑法-->
			<%@include file="fagui_ejdh_left_class5.jsp"%>
			<!--刑法--end-->

		</div>
		<!--国情频道二级左侧主内容--end-->
		<!--国情频道二级右侧主内容-->
		<div class="fagui_right">

			<%@include file="fagui_ejdh_right_notify.jsp"%>

			<div class="fagui_h10"></div>

			<%@include file="fagui_ejdh_right_question.jsp"%>

			<div class="fagui_h10"></div>

			<%@include file="fagui_ejdh_right_search.jsp"%>

			<!--国情频道二级右侧主内容--end-->


		</div>
	</div>
	<!--国情频道二级导航主内容--end-->
	<!--底部-->
	<%@include file="fagui-common-bottom-nav.jsp"%>
	<%@include file="fagui-common-bottom.jsp"%>
</body>

</html>
