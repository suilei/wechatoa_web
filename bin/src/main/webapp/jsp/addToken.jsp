<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${result}</title>

<script language="javascript">
	function check(myform) {
		if (myform.key.value == "") {
			alert("请输入token名称");
			myform.key.focus();
			return;
		}
		if (myform.time.value == "") {
			alert("请输入token过期时间");
			myform.time.focus();
			return;
		}
		s = myform.key.value;
		rLen = s.replace(/[^\x00-\xff]/g, 'xx').length;
		if (rLen != 32) {
			alert("请核实并注意 token名称的长度。（如：2.00bvU7tC06XAPO044b6097750XxiA8）");
			myform.key.focus();
			return;
		}
		var patrn = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
		if (!patrn.test(myform.time.value)) {
			alert("您输入的过期时间不正确！\n 请注意时间格式（如：2014-04-08 22:49:39)");
			myform.time.focus();
			return;
		}
		myform.submit();
	}
</script>
</head>
<body>
	<div align="center">
		<div>
			<a>添加新Tokens：</a>
			<form action="addToken" method="get" name="form1">
				Token名：<input type="text" name="key"> <br> 截止日期：<input
					type="text" name="time"> <br> <input type="button"
					value="添加" onClick="check(form1)">
			</form>
		</div>
		<div>
			<a href="tokenNavi">返回Token管理主页面</a>
		</div>
	</div>
</body>
</html>