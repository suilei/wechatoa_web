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
		<div>
			<p>您查找的Token保存在数据库中的信息</p>

			<table id="tb" class="table">
				<tr>
					<th bgcolor="#FF0000" scope="col"><div align="left">Token名字</div>
					</th>
					<th bgcolor="#FF0000" scope="col"><div align="left">可用性标识</div>
					</th>
					<th bgcolor="#FF0000" scope="col"><div align="left">截止日期</div>
					</th>
					<th bgcolor="#FF0000" scope="col"><div align="left">启用时间</div>
					</th>
				</tr>
				<tr>
					<td>${dbToken.tokenName}</td>
					<td>${dbToken.flag}</td>
					<td>${dbToken.deadLime}</td>
					<td>${dbToken.initialDate}</td>
				</tr>

			</table>
		</div>
		<div>
			<a href="tokenNavi">返回Token管理主页面</a>
		</div>
	</div>
</body>
</html>