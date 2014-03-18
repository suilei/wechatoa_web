//<![CDATA[
$(function(){
	(function(){
		var curr = 0;
		$(".fagui_banner_bigimg:first").show();
		$(".fagui_trigger").each(function(i){
			$(this).click(function(){
				curr = i;
				$(".fagui_banner_bigimg").eq(i).fadeIn("slow").siblings(".fagui_banner_bigimg").hide();
				$(this).siblings(".fagui_trigger").removeClass("fagui_imgSelected").end().addClass("fagui_imgSelected");
				return false;
			});
		});
		
		var pg = function(flag){
			//flag:trueʾǰ falseʾ
			if (flag) {
				if (curr == 0) {
					todo = 5;
				} else {
					todo = (curr - 1) % 6;
				}
			} else {
				todo = (curr + 1) % 6;
			}
			$(".fagui_trigger").eq(todo).click();
		};
		
		//ǰ
		$(".fagui_banner_prev").click(function(){
			pg(true);
			return false;
		});
		
		//
		$(".fagui_banner_next").click(function(){
			pg(false);
			return false;
		});
		
		//Զ
		var timer = setInterval(function(){
			todo = (curr + 1) % 6;
			$(".fagui_trigger").eq(todo).click();
		},5000);
		
		$("#guoqing_bannerNav a").hover(function(){
				clearInterval(timer);
			},
			function(){
				timer = setInterval(function(){
					todo = (curr + 1) % 6;
					$(".fagui_trigger").eq(todo).click();
				},5000);			
			}
		);
	})();
});
//]]>



