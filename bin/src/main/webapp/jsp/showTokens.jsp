<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Welcome</title>
</head>
<body>
	<div align="center">
		<p>目前可用的新浪微博爬取Token集</p>

		<table id="tb" class="table">
			<tr>
				<th bgcolor="#FF0000" scope="col"><div align="left">序号</div>
				</th>
				<th bgcolor="#FF0000" scope="col"><div align="left">Token名字</div>
				</th>
				<th bgcolor="#FF0000" scope="col"><div align="left">可用性标识</div>
				</th>
				<th bgcolor="#FF0000" scope="col"><div align="left">截止日期</div>
				</th>
				<th bgcolor="#FF0000" scope="col"><div align="left">启用时间</div>
				</th>
			</tr>

			<c:forEach items="${availTokenItems}" var="entry" varStatus="xh">
				<tr>
					<td>${xh.count}</td>
					<td>${entry.tokenName}</td>
					<td>${entry.flag}</td>
					<td>${entry.deadLime}</td>
					<td>${entry.initialDate}</td>
				</tr>
			</c:forEach>

		</table>
		<br>
		<div>
			<a href="tokenNavi">返回Token管理主页面</a>
		</div>
	</div>

</body>
</html>