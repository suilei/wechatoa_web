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
			alert("token名称不为空,请输入token名称");
			myform.key.focus();
			return;
		}
		s = myform.key.value;
		rLen = s.replace(/[^\x00-\xff]/g, 'xx').length;
		if (rLen != 32) {
			alert("token长度不正确,请核实并注意 token名称的长度。（如：2.00bvU7tC06XAPO044b6097750XxiA8）");
			myform.key.focus();
			return;
		}
		myform.submit();
	}
</script>
</head>
<body>
	<div align="center">
		<div>
			<a>删除Token：</a>
			<form action="delToken" method="get" name="form1">
				Token名：<input type="text" name="key"> <input type="button"
					value="删除" onClick="check(form1)">
			</form>
		</div>
		<div>
			<a href="tokenNavi">返回Token管理主页面</a>
		</div>
	</div>
</body>
</html>