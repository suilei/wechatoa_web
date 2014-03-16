<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="/tags/c"%>
<%@ taglib prefix="page" uri="/tags/page"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>线索查看-列表</title>
<%@include file="../common/include.jsp"%>


</head>
<body>
	<div class="news-dig-up" >
		<%@include file="../common/head.jsp"%>
		<div class="container clearfix" id="wordList">
			<%@include file="../common/left.jsp"%>
			<div class="right">
              <div class="headbar"> 
              		<div class="viewclue-btn"><img src="${bathPath }static/image/view_clue_grey.png" width="50" height="40" align="absmiddle">查看线索</div>
              		<div class="viewmore-btn"><a href="${bathPath }topic/jumpToTopicWall"><img src="${bathPath }static/image/back.png" width="40" height="35" align="absmiddle">返回</a></div>
           	  </div>
            <div class="list">
              <table width="760" border="1" cellspacing="0"> 
                    <tr> 
                        <th width="50">序号</th> 
                        <th width="450">线索名称</th> 
                        <th>发现时间</th> 
                    </tr> 
                    <c:forEach var="topic" items="${list}" varStatus="num">
                    	<c:if test="${num.index %2 == 1}">
	                    	<tr> 
		                        <td>${num.index + 1 }</td> 
		                        <td><a href="${bathPath }${topic.dataSource}">${topic.title }</a></td> 
		                        <td>${topic.createTime }</td> 
		                    </tr> 
	                    </c:if>
	                    <c:if test="${num.index %2 == 0}">
	                    	<tr> 
		                        <td class="blue">${num.index + 1}</td> 
		                        <td class="grey"><a href="${bathPath }${topic.dataSource}">${topic.title }</a></td> 
		                        <td class="blue">${topic.createTime }</td> 
		                    </tr> 
	                    </c:if>
                    </c:forEach>
              </table> 
              <div class="page">
	            <c:if  test ="${currentPage>1 }">
	                <a href="${basePath }topic/showLatestTopicList?pageId=${currentPage-1}" class="n"> 上一页 </a>
	             </c:if>
                <a href="${basePath }topic/showLatestTopicList?pageId=1" class="n"> 
                <span  <c:if test="${currentPage == 1}">  class="pc" </c:if> > 1 </span></a>
				<c:if  test ="${currentPage-2>1+1 }">
				    <a class="n"> <span> ...... </span></a>
				</c:if>
				<c:if  test ="${currentPage-2>1 }">
					 <a href="${basePath }topic/showLatestTopicList?pageId=${currentPage-2}"  class="n"> <span> ${currentPage-2} </span></a>
				</c:if>
				<c:if  test ="${currentPage-1>1 }">
					 <a href="${basePath }topic/showLatestTopicList?pageId=${currentPage-1}"  class="n"> <span> ${currentPage-1} </span></a>
				</c:if>
				<c:if  test ="${currentPage !=1 && currentPage !=totalPageCount}">
					 <a href="${basePath }topic/showLatestTopicList?pageId=${currentPage}"  class="n"> <span class="pc"> ${currentPage} </span></a>
				</c:if>
				<c:if  test ="${currentPage+1<totalPageCount }">
					 <a href="${basePath }topic/showLatestTopicList?pageId=${currentPage+1}"  class="n"> <span> ${currentPage+1} </span></a>
				</c:if>
				<c:if  test ="${currentPage+2<totalPageCount }">
					 <a href="${basePath }topic/showLatestTopicList?pageId=${currentPage+2}"  class="n"> <span> ${currentPage+2} </span></a>
				</c:if>
				<c:if  test ="${currentPage+2<totalPageCount-1 }">
				    <a class="n"> <span> ...... </span></a>
				</c:if>
                <a href="${basePath }topic/showLatestTopicList?pageId=${totalPageCount}" class="n"> 
                <span <c:if test="${currentPage == totalPageCount}">  class="pc" </c:if> > ${totalPageCount} </span></a>
	 			<c:if  test ="${currentPage<totalPageCount }">
	                <a href="${basePath }topic/showLatestTopicList?pageId=${currentPage+1}" class="n"> 下一页  </a>                
	             </c:if>                
                
       		    <span>&nbsp;&nbsp;
       		    	<form style="display:inline;" action="${basePath}topic/showLatestTopicList" method="get">
       		    		 向 <input type="text"   name="pageId"  class="pg"/> 页&nbsp;<input value="跳转"  class="pageturn"   type="submit"  />
       		     	</form>
       		     </span>
 				
 				</div>
            </div>
        </div>
		</div>
	</div>
</body>
</html>