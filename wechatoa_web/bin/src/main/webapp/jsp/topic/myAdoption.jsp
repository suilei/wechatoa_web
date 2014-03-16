<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="/tags/c"%>
<%@ taglib prefix="page" uri="/tags/page"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>线索查看-采纳列表</title>
<%@include file="../common/include.jsp"%>

<script src="${basePath}static/js/lib/jquery-1.10.2.min.js"></script>
</head>
<body>
	<div class="news-dig-up" >
		<%@include file="../common/head.jsp"%>
		<div class="container clearfix" id="my_adopt">
			<%@include file="../common/left.jsp"%>
			<div class="right">
            <div class="headbar"> 
              <div class="viewclue-btn"><img src="${basePath}static/image/my_adopt_grey.png" width="50" height="40" align="absmiddle">我的采纳</div>
            </div>
            
            <div class="adopt-list">
                <h3 class="a_title">我的采纳线索（共${totalRecordCount }条）</h3>
                <ul>
                <c:forEach var="newsClue" items="${newsClueList}" varStatus="num" >
	                <c:if test="${num.index  % 2 == 1}">
	                	<li class="alist">
	                </c:if>
	                <c:if test="${num.index  % 2 == 0}">
	                	<li class="alist" style="background:#fff;">
	                </c:if>
	                    <div class="a_intro">
	                      <div class="a_header"><p class="a_header_title">${newsClue.shortTitle } </p><p class="a_header_time">采纳时间：${newsClue.collect_time_plain}</p></div>
	                      <div class="a_cancel"><a href="${basePath }removeNewsClues?topicId=${newsClue.weibo_id}"><input type="button"  value="取消采纳"></a></div>
	                      <div class="a_operate" topicId="${newsClue.weibo_id}" adoptTime="${newsClue.collect_time_long }">
	                        <input type="button" value="传播走势" class="a_blue"/>
	                        <input type="button" value="媒体数据" class="a_orange"/>
	                      </div>
	                    </div>
	                    <p class="a_content">
	                      ${newsClue.content} <a href="${basePath }topic/showLatestTopicDetail?topicId=${newsClue.weibo_id}">查看详情</a>
	                    </p>
	                  </li>
                  </c:forEach>
                      
                  </ul>
                  
            </div>
            
            <div class="page">
	            <c:if  test ="${currentPage>1 }">
	                <a href="${basePath }myAdoption?pageId=${currentPage-1}" class="n"> 上一页 </a>
	             </c:if>
                <a href="${basePath }myAdoption?pageId=1" class="n"> 
                <span  <c:if test="${currentPage == 1}">  class="pc" </c:if> > 1 </span></a>
				<c:if  test ="${currentPage-2>1+1 }">
				    <a class="n"> <span> ...... </span></a>
				</c:if>
				<c:if  test ="${currentPage-2>1 }">
					 <a href="${basePath }myAdoption?pageId=${currentPage-2}"  class="n"> <span> ${currentPage-2} </span></a>
				</c:if>
				<c:if  test ="${currentPage-1>1 }">
					 <a href="${basePath }myAdoption?pageId=${currentPage-1}"  class="n"> <span> ${currentPage-1} </span></a>
				</c:if>
				<c:if  test ="${currentPage !=1 && currentPage !=totalPageCount}">
					 <a href="${basePath }myAdoption?pageId=${currentPage}"  class="n"> <span class="pc"> ${currentPage} </span></a>
				</c:if>
				<c:if  test ="${currentPage+1<totalPageCount }">
					 <a href="${basePath }myAdoption?pageId=${currentPage+1}"  class="n"> <span> ${currentPage+1} </span></a>
				</c:if>
				<c:if  test ="${currentPage+2<totalPageCount }">
					 <a href="${basePath }myAdoption?pageId=${currentPage+2}"  class="n"> <span> ${currentPage+2} </span></a>
				</c:if>
				<c:if  test ="${currentPage+2<totalPageCount-1 }">
				    <a class="n"> <span> ...... </span></a>
				</c:if>
                
                <c:if test="${1 != totalPageCount}"> 
	                <a href="${basePath }myAdoption?pageId=${totalPageCount}" class="n"> 
	                <span <c:if test="${currentPage == totalPageCount}">  class="pc" </c:if> > ${totalPageCount} </span></a>
                </c:if>
                
	 			<c:if  test ="${currentPage<totalPageCount }">
	                <a href="${basePath }myAdoption?pageId=${currentPage+1}" class="n"> 下一页  </a>                
	             </c:if>                
                
       		    <span>&nbsp;&nbsp;
       		    	<form style="display:inline;" action="${basePath}myAdoption" method="get">
       		    		 向 <input type="text"   name="pageId"  class="pg"/> 页<input value="跳转"  class="pageturn"   type="submit"  />
       		     	</form>
       		     </span>
 				</div>
        </div>
		</div>
	</div>
<!--弹出层线索走势 -->
	<div class="pop_clue" id="popClue" style="display:none;">
		<div class="tit">
			<h3><img src="../static/image/speed_trend.png" align="absmiddle">&nbsp;采纳线索传播走势查看</h3>
			<a id="tip_close" class="tipclose" href="javascript:void(0);"></a>
		</div>
		<div class="clue_pic_content">
			<div class="pic_left">
				<div class="clue_pic" id="trendContainer">发
				</div>
				<p class="clue_note">
				      注：传播走势监控时间范围截止至线索采纳后7天，7天后停止监控
				</p>
			</div>
			<div class="pic_right">
				<div class="right_blue">
					<p class="pic_data">78904</p>
					<p class="pic_intro">微博转发总数（次）</p>
				</div>
				<div class="right_yellow">
					<p class="pic_data">308.29</p>
					<p class="pic_intro">最高转发速度（次/秒）</p>
					<p class="speed_small">+198.76</p>
				</div>
				<div class="right_orange">
					<p class="pic_data">4371.21</p>
					<p class="pic_intro">最高传播活跃指数</p>
					<p class="data_small">-651.24</p>
				</div>
			</div>
		</div>
	</div>
<!--弹出层媒体数据 -->
	<div class="pop_clue" id="popMedia" style="display:none;">
		<div class="tit">
			<h3><img src="../static/image/media_data.png" align="absmiddle">&nbsp;主流媒体相关发布数据查看</h3>
			<a id="tip_close_data" class="tipclose" href="javascript:void(0);"></a>
		</div>
		<div class="clue_pic_content">
			<div class="pic_left">
				<div class="clue_pic" id="mediaContainer">
				</div>
			</div>
			<div class="pic_right">
				<div class="right_blue">
					<p class="pic_data">78.51</p>
					<p class="pic_intro">主流媒体采纳率</p>
				</div>
				<div class="right_yellow">
					<p class="pic_data">54.9%</p>
					<p class="pic_intro">重要媒体曝光率</p>
				</div>
			</div>
		</div>
	</div>
<script src="${basePath}static/js/maskLayer.js"></script>
<script src="${basePath}static/js/lib/highcharts.js"></script>
<script src="${basePath}static/js/lib/exporting.js"></script>
<script>
(function(){
//取消采纳
	$('.cancelAdopt').click(function(){
		 $('#aPop').show();
		 $('#aPopSure').click(function(){
			 /*确定采纳后执行的操作*/	 
		   /* $.ajax({
				type: "get",
				url: "http://www.cnblogs.com/rss",
				success: function(data, textStatus){
					 $('#gPopSuc').show();
				},
				error: function(){
					//请求出错处理
				}
	        });*/
		 
			 $('#aPop').hide();
		   	 $('#aPopSuc').fadeIn(1000, function(){
				 $('#aPopSuc').fadeOut(1000);
			 });
		 });
		 $('#aPopCancel').click(function(){
			 $('#aPop').hide();
		 });
	});
	
	$('.a_blue').click(function(){
	 	var topicId = $(this).parent(".a_operate").attr('topicId');
	 	var adoptTime = $(this).parent(".a_operate").attr('adoptTime');
		 $.ajax({
			type: "get",
			url: "${basePath}topic/getTopicDatasScript.json?topicId=" + topicId + "&adoptTime=" + adoptTime,
			dataType :"html",
			success: function(data, textStatus){
				$('body').append(data);
				
                var seriesArray = new Array();
                var firstData = new Object();
                firstData.name = "采纳前";
                firstData.data = topic1;
                seriesArray.push(firstData);
                
                var secondData = new Object();
                secondData.name = "采纳后";
                secondData.data = topic2;
                seriesArray.push(secondData);
                
				showid("popClue" , "tip_close");
				trendPic(seriesArray);
			},
			error: function(){
				alert("系统出问题，请稍候重试");
				//请求出错处理
			}
    	});

	});
	$('.a_orange').click(function(){
		showid("popMedia" , "tip_close_data");
		//chartPic(topicId);
	});
	
function trendPic(seriesArray) { 
	//线索走势
    $('#trendContainer').highcharts({
        title: {
            text: '热门话题走势分析图',
            x: -20 //center
        },
        tooltip : {
            formatter : function() {
                return '<b>'
                        + this.series.name
                        + '</b><br/>'
                        + '<b>转发速度='
                        + this.y
                        + '</b><br/>'
                        + Highcharts
                                .dateFormat(
                                        '%Y-%m-%e %H:%M:%S',
                                        this.x);
            }
        },
        xAxis: {  
        	labels: {
        		enabled: false,
                type : 'datetime',
                dateTimeLabelFormats : { // don't display the dummy year

                }
            },
        },
        yAxis: {
            title: {
                text: '次/秒'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: seriesArray
        	/*[{
            name: 'Tokyo',
            data: [70, 69, 95, 145, 182, 215, 252, 265, 233, 183, 139, 96,70, 69, 95, 145, 182, 215, 252, 265, 233, 183, 139, 96,70, 69, 95, 145, 182, 215, 252, 265, 233, 183, 139, 96,70, 69, 95, 145, 182, 215, 252, 265, 233, 183, 139, 96]
        },{
            name: 'Tokyo',
            data: [81, 79, 105, 135, 172, 65, 42, 265, 233, 183, 139, 96,70, 69, 95, 145, 182, 215, 252, 265, 233, 183, 139, 96,70, 69, 95, 145, 182, 215, 252, 265, 233, 183, 139, 96,70, 69, 95, 145, 182, 215, 252, 265, 233, 183, 139, 96]
        }]*/
    });
}

function chartPic(topicId) {
//媒体数据   
    $('#mediaContainer').highcharts({
        chart: {
            type: 'column',
            margin: [ 50, 50, 100, 80]
        },
        title: {
            text: '相关新闻数量'
        },
        xAxis: {
            categories: [
                         '新浪',
                         '搜狐',
                         '网易',
                         '腾讯',
                         '新华网',
                         '中新网',
                         '人民网',
                         '央视网',
                         '国际在线',
            ],
            labels: {
                rotation: -45,
                align: 'right',
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Population (millions)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Population in 2008: <b>{point.y:.1f} millions</b>'
        },
        series: [{
            name: 'Population',
            data: [34.4, 21.8, 20.1, 20, 19.6, 19.5, 19.1, 18.4, 18],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                x: 4,
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }]
    });
}
 })();
 </script>
</body>
</html>