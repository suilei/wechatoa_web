<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@include file="fagui-common-include.jsp"%>
<link href="static/css/fagui_index.css" type="text/css" rel="stylesheet"/>
<title>法规频道首页</title>
</head>
<body class="fagui_all">
<%@include file="fagui-common-top.jsp"%>
<%@include file="fagui-common-top-search.jsp"%>
<%@include file="fagui-common-top-nav.jsp"%>
<div class="fagui_h10"></div>
<%@include file="fagui-fagui-nav.jsp"%>
<div class="fagui_h10"></div>
<div class="fagui_wrap">
<!--频道首页主内容****侧边导航***banner*-->
	<div class="fagui_row1">
		<div class="fagui_slide_left">
		<%@include file="fagui-index-row1-left-nav.jsp"%>
		<div class="fagui_h10"></div>
		<%@include file="fagui-index-row1-left-other.jsp"%>
		</div>
		
		<div class="fagui_sliderNav_right">
			<div class="fagui_sliderNav_rb">
				<div class="fagui_row1_banner">
					<%@include file="fagui-index-row1-middle-slide.jsp"%>
					<div class="fagui_h10"></div>
					<%@include file="fagui-index-row1-middle-other.jsp"%>
				</div>
				<div class="fagui_jrzg">
					<%@include file="fagui-index-row1-right-newslist.jsp"%>
					<div class="fagui_h10"></div>
					<%@include file="fagui-index-row1-right-topic.jsp"%>
				</div>
			</div>
		</div>
	</div>
<!--法规频道首页主内容****侧边导航***banner**---end--->
	<div class="fagui_clear"></div>
<!--法律咨询****新法速递****高层留言板----->
	<div class="fagui_row2">
		<%@include file="fagui-index-row2-left.jsp"%>
		<%@include file="fagui-index-row2-middle.jsp"%>
		<%@include file="fagui-index-row2-right.jsp"%>
		<div class="fagui_clear"></div>
	</div>
<!--法律咨询****新法速递****高层留言板---结束-->
	<div class="fagui_h20"></div>
</div>
<%@include file="fagui-common-bottom-nav.jsp"%>
<%@include file="fagui-common-bottom.jsp"%>
</body>
</html>