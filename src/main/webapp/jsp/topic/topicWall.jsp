<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="/tags/c"%>
<%@ taglib prefix="page" uri="/tags/page"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>线索查看-词墙</title>
<%@include file="../common/include.jsp"%>

<style>
#wrapper {width: 780px; height: 450px; position: relative; margin: 10px;}
.box {
  position: absolute; 
  text-align: center; 
  overflow: hidden; 
  color: #000;
  word-wrap: break-word; 
  font-family: "微软雅黑","宋体","Arial Unicode MS",System;
  font-size: 18px;
}
.box a{
  text-decoration:none;
  color:#000;
}
.font-ms {
  font-family: "微软雅黑","宋体","Arial Unicode MS",System;
  font-size: 14px;
}
</style>
<script src="${basePath}static/js/lib/jquery-1.10.2.min.js"></script>
</head>
<body>
	<div class="news-dig-up" >
		<%@include file="../common/head.jsp"%>
		<div class="container clearfix" id="wordwall">
			<%@include file="../common/left.jsp"%>
			<div class="right">
            <div class="headbar"> 
              <div class="viewclue-btn"><img src="${basePath}static/image/view_clue_grey.png" width="50" height="40" align="absmiddle">查看线索</div>

              <div class="viewmore-btn"><a href="${basePath}topic/showLatestTopicList"><img src="${basePath}static/image/view_clue_more.png" width="50" height="16" align="absmiddle">更多</a></div>
            </div>
            <div id="wrapper"></div>
        </div>
		</div>
	</div>
	<script>
		var path = "${basePath}";
	</script>
	<script type="text/javascript" src="${basePath}static/js/wordWall.js"></script>
</body>
</html>