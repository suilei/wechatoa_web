<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="content-type" content="text/html;charset=utf-8">
    <title>登录页</title>
    <meta http-equiv="X-UA-Compatible" content="IE=7" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link type="text/css"  rel="stylesheet" href="${basePath}static/css/normalize.css"/>
    <link type="text/css" rel="stylesheet" href="${basePath}static/css/news.css"  />
  </head> 
  <body>    
  	<div id="login">
  		<div class="container">
  			<h1>NEWS DIG UP</h1>
  			<h4>新闻线索发现系统</h4>
  			<form action="${basePath}login" method="post">
  			<input type="text" name="userName" class="user"/>
            <input type="password" name="userPasswd" class="password"/>
            <input type="submit" value="登录" class="user-login"/>
            <p class="remember"><input type="checkbox" name="rememberName"/>&nbsp;&nbsp;记住我</p>
  			</form>
  			
  			
  		</div>

  	</div>
  </body>
</html>