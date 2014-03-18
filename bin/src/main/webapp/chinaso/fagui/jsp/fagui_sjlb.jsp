<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@include file="fagui-common-include.jsp"%>

<title>法规频道三级列表</title>
</head>

<body class="fagui_all">
<%@include file="fagui-common-top.jsp"%>
<%@include file="fagui-common-top-search.jsp"%>
<%@include file="fagui-common-top-nav.jsp"%>
<div class="fagui_h10"></div>
<%@include file="fagui-fagui-nav.jsp"%>
<div class="fagui_h10"></div>
<%@include file="fagui_sjlb_dh.jsp"%>
<div class="fagui_h10"></div>
<!--国情频道二级导航当个分类主内容-->
<div class="fagui_wrap" >
<!--国情频道二级左侧主内容-->
<div class="fagui_left">
<%@include file="fagui_sjlb_fgdt.jsp"%>
<%@include file="fagui_sjlb_bt.jsp"%>
<%@include file="fagui_sjlb_lb.jsp"%>
</div>

<!--法规分页二级左侧主内容--end-->
<!--法规分页二级右侧主内容-->
<div class="fagui_right">
<%@include file="fagui_sjlb_xfsd.jsp"%>
<div class="fagui_h10"></div>
<%@include file="fagui_sjlb_flcx.jsp"%>
<div class="fagui_h10"></div>
<%@include file="fagui_sjlb_fgrs.jsp"%>
</div>
<%@include file="fagui_sjlb_fy.jsp"%>
</div>
<!--国情频道二级导航单个分类主内容--end-->
<div class="fagui_h10"></div>
<div class="fagui_h10"></div>
<%@include file="fagui-common-bottom-nav.jsp"%>
<%@include file="fagui-common-bottom.jsp"%>
</body>
</html>
