// JavaScript Document
$(function(){

	/////高层留言板
	$(".fagui_liuyan_col_tit span").click(function(){
		$(this).addClass("fagui_liuyan_col_curtit").siblings().removeClass("fagui_liuyan_col_curtit");
		$(".fagui_liuyan_col_con_single").eq($(".fagui_liuyan_col_tit span").index(this)).show().siblings().hide();
	})
	/////婚姻法
	$(".fagui_hunyin_col_tit span").click(function(){
		$(this).addClass("fagui_hunyin_col_curtit").siblings().removeClass("fagui_hunyin_col_curtit");
		$(".fagui_hunyin_col_con .fagui_hunyin_col_con_single").eq($(".fagui_hunyin_col_tit span").index(this)).show().siblings().hide();
	})
	/////医疗事故
	$(".fagui_yiliao_col_tit span").click(function(){
		$(this).addClass("fagui_yiliao_col_curtit").siblings().removeClass("fagui_yiliao_col_curtit");
		$(".fagui_yiliao_col_con .fagui_yiliao_col_con_single").eq($(".fagui_yiliao_col_tit span").index(this)).show().siblings().hide();
	})
	//社会法
	$(".fagui_shehui_col_tit span").click(function(){
		$(this).addClass("fagui_shehui_col_curtit").siblings().removeClass("fagui_shehui_col_curtit");
		$(".fagui_shehui_col_con .fagui_shehui_col_con_single").eq($(".fagui_shehui_col_tit span").index(this)).show().siblings().hide();
	})
	//程序法
	$(".fagui_chengxu_col_tit span").click(function(){
		$(this).addClass("fagui_chengxu_col_curtit").siblings().removeClass("fagui_chengxu_col_curtit");
		$(".fagui_chengxu_col_con .fagui_chengxu_col_con_single").eq($(".fagui_chengxu_col_tit span").index(this)).show().siblings().hide();
	})


})