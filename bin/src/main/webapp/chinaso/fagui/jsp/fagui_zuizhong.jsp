<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@include file="fagui-common-include.jsp"%>
<title>法规频道最终页</title>
<body class="fagui_all">
<%@include file="fagui-common-top.jsp"%>
<%@include file="fagui-common-top-search.jsp"%>
<%@include file="fagui-common-top-nav.jsp"%>
<div class="fagui_h10"></div>
<%@include file="fagui-fagui-nav.jsp"%>
<div class="fagui_h10"></div>

<%@include file="fagui_sjlb_dh.jsp"%>

<div class="fagui_h10"></div>
<!--法规频道最终页主内容-->
<div class="fagui_wrap">
	<!--法规--左侧-->
	<%@include file="fagui_zuizhong_nr.jsp"%>
	<!--法规--左侧结束-->
	<!--法规--右侧-->
	<!--法规分页二级右侧主内容-->
	<div class="fagui_right">
	<%@include file="fagui_sjlb_xfsd.jsp"%>
	<div class="fagui_h10"></div>
	<%@include file="fagui_sjlb_flcx.jsp"%>
	<div class="fagui_h10"></div>
	<%@include file="fagui_sjlb_fgrs.jsp"%>
	</div>
	<!--法规--右侧结束-->
	<div class="fagui_clear"></div>
</div>
<!--法规频道最终页主内容--end-->
<%@include file="fagui-common-bottom-nav.jsp"%>
<%@include file="fagui-common-bottom.jsp"%>
</body>
</html></html>