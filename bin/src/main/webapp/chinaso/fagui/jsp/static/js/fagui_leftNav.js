// JavaScript Document
(function($){
	$.fn.hoverForIE6=function(option){
		var s=$.extend({current:"fagui_navhover",delay:0},option||{});
		$.each(this,function(){
			var timer1=null,timer2=null,flag=false;
			$(this).bind("mouseover",function(){
				if (flag){
					clearTimeout(timer2);
				}else{
					var _this=$(this);
					timer1=setTimeout(function(){
						_this.addClass(s.current);
						flag=true;
					},s.delay);
				}
			}).bind("mouseout",function(){
				if (flag){
					var _this=$(this);timer2=setTimeout(function(){
						_this.removeClass(s.current);
						flag=false;
					},s.delay);
				}else{
					clearTimeout(timer1);
				}
			})
		})
	}
})(jQuery);
$(function(){
$(".fagui_nav").hoverForIE6({current:"fagui_allsorthover",delay:0});
$(".fagui_nav .fagui_item").hoverForIE6({delay:0});
	
})