<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link href="static/css/fagui_dhfl.css" type="text/css" rel="stylesheet"/>
<%@include file="fagui-common-include.jsp"%>
<title>法规频道二级导航单个分类</title>
</head>
<body class="fagui_all">
<%@include file="fagui-common-top.jsp"%>
<%@include file="fagui-common-top-search.jsp"%>
<%@include file="fagui-common-top-nav.jsp"%>
<div class="fagui_h10"></div>
<%@include file="fagui-fagui-nav.jsp"%>
<div class="fagui_h10"></div>
<div class="fagui_wrap">
<!--法规分页二级左侧主内容-->
<%@include file="fagui_dgfl_left_maincontent.jsp"%>
<!--法规分页二级右侧主内容-->
<%@include file="fagui_dgfl_right_maincontent.jsp"%>

<div class="fagui_h10"></div>
<div class="fagui_h10"></div>
<div class="fagui_line"></div>
<div class="fagui_h10"></div>
<div class="fagui_h10"></div>
<!--法规分页-->
<%@include file="fagui_dgfl_fenye.jsp"%>
</div>
<!--国情频道二级导航单个分类主内容--end-->
<div class="fagui_h10"></div>
<div class="fagui_h10"></div>
<%@include file="fagui-common-bottom-nav.jsp"%>
<%@include file="fagui-common-bottom.jsp"%>
</body>
</html>