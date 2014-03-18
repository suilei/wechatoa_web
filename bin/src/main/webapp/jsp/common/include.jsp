<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*,java.text.*"%>
<%
	String path = request.getContextPath();

    String suffix=path.endsWith("/")?path:path + "/";
    String serverPort = (request.getServerPort()==80?"":":"+request.getServerPort());
    if (request.getServerName() != null && request.getServerName().endsWith("148")){
    	serverPort = ":8080";
    }
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + serverPort
			+ suffix;
%>
<c:set var="basePath" value="<%=basePath%>" />
<base href="${basePath}" />
<meta http-equiv="Cache-control" content="no-cache" />
<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
<meta http-equiv="content-type" content="text/html;charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=7" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link type="text/css"  rel="stylesheet" href="${basePath}static/css/normalize.css"/>
<link type="text/css" rel="stylesheet" href="${basePath}static/css/news.css"  />
