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

<script src="${basePath}static/js/lib/jquery-1.10.2.min.js"></script>
</head>
<body>
	<div class="news-dig-up" >
		<%@include file="../common/head.jsp"%>
		<div class="container clearfix" id="wordDetail">
			<%@include file="../common/left.jsp"%>
			<div class="right">
            <div class="headbar"> 
              <div class="viewclue-btn"><img src="${basePath}static/image/view_clue_grey.png" width="50" height="40" align="absmiddle">查看线索</div>
              <div class="viewmore-btn"><a href=""><img src="${basePath}static/image/back.png" width="40" height="35" align="absmiddle">返回</a></div>
            </div>
            <div class="general">
              <input type="hidden" name="rowId" value="${topic.rowId}" />
              <div class="g_header">
                <span class="g_title">${topic.title }&nbsp;&nbsp;<input type="button" value="采 纳" class="g_adopt" id="adoptOp"/></span>
                <span class="g_time">${topic.createTime }</span>
              </div>
              <div class="g_content">
                <div class="g_image"><img src="${topic.image }" width="120" height="80"/></div>
                <div class="g_sub">${topic.content }</div>
                <div class="g_btn">
                    <div class="g_trend">
                      <div><img src="${basePath}static/image/clue_trend.png" width="65" height="60" /></div>
                      <p class="g_trend_filter">线索走势</p>
                    </div>
                    <div class="g_weibo">
                      <div><img src="${basePath}static/image/clue_weibo.png" width="65" height="60"/></div>
                      <p class="g_weibo_filter">线索微博${weiboSize }</p>
                      </div>
                </div>
              </div>
              <!-- 采纳弹出框 start-->
              <div class="g_pop" style="display:none;" id="gPop">
                  <span>您确定要采纳这条线索吗？</span>
                  <input type="button" value="确定" class="g_pop_sure" id="gPopSure"/>&nbsp;<input type="button" value="取消" class="g_pop_cancel" id="gPopCancel"/>
              </div>
              <div class="g_pop_success" style="display:none;" id="gPopSuc">
                  <span>采纳成功</span>
              </div>
              <div class="g_pop" style="display:none;" id="gPopQ">
                  <span>您确定要取消采纳这条线索吗？</span>
                  <input type="button" value="确定" class="g_pop_sure" id="gPopQSure"/>&nbsp;<input type="button" value="取消" class="g_pop_cancel" id="gPopQCancel"/>
              </div>
               <div class="g_pop_success" style="display:none;" id="gPopQSuc">
                  <span>取消采纳成功</span>
              </div>
             <!-- 采纳弹出框 end-->
            </div>
            <div class="clue_content">
              <div class="c_header">
                  <img src="${basePath}static/image/clue_trend_small.png" align="absmiddle">&nbsp;线索走势
              </div>
              <div class="c_content"> 
                  <div id="container" class="c_pic"></div>
                  <div class="c_data">
                      <div class="c_data_des">
                        <div class="c_speed">${topic.highestSpeed }<p>最高转发速度（次/秒）</p></div>
                        <div class="c_live">${topic.highestTransIndex}<p>最高传播活跃指数</p></div>
                        <c:if test="${topic.rank == 'HIGH'}">
                       		<div class="c_follow">High<p>意见领袖关注度</p></div>
                        </c:if>
                        <c:if test="${topic.rank == 'MIDDLE'}">
                       		<div class="c_follow">Middle<p>意见领袖关注度</p></div>
                        </c:if>
                        <c:if test="${topic.rank == 'LOW'}">
                       		<div class="c_follow">Low<p>意见领袖关注度</p></div>
                        </c:if>
                      </div>
                      <div class="c_data_value">
                      	<c:if test="${isVerified == true}">
                        <p class="c_user"><img src="${basePath}static/image/success.png" align="absmiddle"/>&nbsp;&nbsp;信息发布源为认证用户</p>
                       </c:if>
                       <c:if test="${isVerified == false}">
                        <p class="c_user"><img src="${basePath}static/image/no_success.png" align="absmiddle"/>&nbsp;&nbsp;信息发布源为非认证用户</p>
                       </c:if>
                        <div class="c_value">
                            <p>线索价值：</p>
                            <c:if test="${topic.clueValue <= 0.33}">
	                            <div class="c_progress"><p class="c_progress_green" style="width:33%"></p></div>
                            </c:if>
                            <c:if test="${topic.clueValue <= 0.67 && topic.clueValue > 0.33}">
                            	 <div class="c_progress"><p class="c_progress_green" style="width:67%"></p></div>
                            </c:if>
                            <c:if test="${topic.clueValue <= 1 && topic.clueValue > 0.67}">
                           		<div class="c_progress"><p class="c_progress_green" style="width:100%"></p></div>
                            </c:if>
                        	 <div class="c_grad">
                            	<p style="text-align:left;">低</p><p style="text-align:center;">中</p><p style="text-align:right;">高</span></p>
                            </div>
                      </div>
                  </div>
              </div>
            </div>
        </div>
        <div class="weibo_content">
            <div class="w_header">
                  <img src="${basePath}static/image/clue_weibo_small.png" align="absmiddle">&nbsp;线索微博&nbsp;<span>${weiboSize }条
                  <c:if test="${weiboSize > 5}">
                  <a href = "${basePath }topic/showRelatedWeibo?topicId=${topic.rowId}">查看更多</a>
                  </c:if></span>
            </div>
            <ul class="w_content">
            <c:forEach var="weibo" items="${topic.weiboList}" varStatus="num">
              <li>
              	<c:if test="${weibo.profileImageUrl == '' || weibo.profileImageUrl == null}">
                <div class="w_img"><img src="${basePath}static/image/xinhuawang.png"/></div>
                </c:if>
                <c:if test="${weibo.profileImageUrl != ''}">
                <div class="w_img"><img src="${weibo.profileImageUrl }"/></div>
                </c:if>
                <div class="w_data">
                     <p><span class="w_title">${weibo.userName }</span><span>&nbsp;&nbsp;${weibo.createTimeStr }&nbsp;来自新浪微博</span></p>
                     <p class="w_word">${weibo.context }</p>
                </div>
                <div class="w_detail">
                  <p class="w_view_detail"><a href="${weibo.accessUrl}">查看详情</a></p>
                  <div class="t_c">
                     <div><img src="${basePath}static/image/transmit.png"/ align="absmiddle">&nbsp;${weibo.repostsCount }</div>
                     <div class="m_l"><img src="${basePath}static/image/commit.png" align="absmiddle"/>&nbsp;${weibo.commentsCount }</div>
                  </div>
                </div>
              </li>
              </c:forEach>
            </ul>
        </div>
    </div>
  	</div>
  	</div>
<script src="${basePath}static/js/lib/highcharts.js"></script>
<script src="${basePath}static/js/lib/exporting.js"></script>
<script type="text/javascript"
        src="${basePath}topic/datas?topicId=${topic.rowId}"></script>
 <script type="text/javascript">
 var ctx ="${basePath }";
 (function(){
	  $.ajax({
		type: "get",
		url: ctx+"checkClueExist",
		data: "topicId=${topic.rowId}",
		dataType: "json",
		success: function(result){
			if (result === 1) {
				$('#adoptOp').attr('value','取消采纳');
			} else if(result === 0){
				$('#adoptOp').attr('value','采 纳');
			}
		},
		error: function(result){
			if (result === -1){
				alert("系统问题，请稍候重试");
			} else {
				alert("系统问题，请稍候重试");
			}
			
		}
	  });
	 
	 $('#adoptOp').click(function(){
		 var adoptVal;
		 adoptVal = $('#adoptOp').attr('value');
		 if (adoptVal == '采 纳') {
			 $('#gPop').show();
			 $('#gPopSure').click(function(){
				 /*确定采纳后执行的操作*/	 
			    $.ajax({
					type: "get",
					url: ctx+"addNewsClue",
					data: "topicId=${topic.rowId}&topicTitle=${topic.title }&topicContent=${topic.content }&topicPicUrl=${topic.image }&topicTime=${topic.createTime }",
					contentType: "application/x-www-form-urlencoded;charset=UTF-8",
					success: function(result){
				    	 $('#gPop').hide();
						 $('#gPopSuc').fadeIn(1000, function(){
							 $('#gPopSuc').fadeOut(1000);
							 $('#adoptOp').attr('value','取消采纳');
						 });
					},
					error: function(){
						alert("系统问题，请稍候重试")
					}
		        });
		        
				 
			 });
			 $('#gPopCancel').click(function(){
				 $('#gPop').hide();
			 });

		 }
		 if (adoptVal == '取消采纳') {
			 $('#gPopQ').show();
			 $('#gPopQSure').click(function(){
				 /*确定采纳后执行的操作*/	 
			   $.ajax({
					type: "get",
					url: ctx+"removeNewsClues",
					data: "topicId=${topic.rowId}",
					success: function(result){
						 $('#gPopQ').hide();
					   	 $('#gPopQSuc').fadeIn(1000, function(){
							 $('#gPopQSuc').fadeOut(1000);
							 $('#adoptOp').attr('value','采 纳');
						 });
					},
					error: function(){
						alert("系统问题，请稍候重试")
					}
		        });
			 

			 });
			 $('#gPopQCancel').click(function(){
				 $('#gPopQ').hide();
			 });

		 }
	 });
 })();
 </script>
 <script type="text/javascript">
        (function($) { // encapsulate jQuery

            $(function() {
                var seriesArray = new Array();
                var summary = new Object();
                summary.name = "线索趋势";
                summary.data = topic;
                seriesArray.push(summary);
                $('#container')
                        .highcharts(
                                {
                                    chart : {
                                        type : 'line',
                                        marginRight : 130,
                                        marginBottom : 25
                                    },
                                    credits : {
                                        enabled : false
                                    },
                                    title : {
                                        text : '新闻线索走势分析图',
                                        x : -20
                                    //center
                                    },
                                    subtitle : {
                                        text : 'Source: panguso.com',
                                        x : -20
                                    //center
                                    },
                                    xAxis : {
                                        type : 'datetime',
                                        dateTimeLabelFormats : { // don't display the dummy year

                                        }
                                    },
                                    yAxis : {
                                        title : {
                                            text : 'speed'
                                        },
                                        min : 0,
                                        plotLines : [ {
                                            value : 0,
                                            width : 1,
                                            color : '#808080'
                                        } ]
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
                                    legend : {
                                        layout : 'vertical',
                                        align : 'right',
                                        verticalAlign : 'top',
                                        x : -10,
                                        y : 100,
                                        borderWidth : 0
                                    },
                                    series : seriesArray
                                });
            });

        })(jQuery);
    </script>
  </body>
</html>