
(function(){
	$.ajax({
		type: "get",
		url: path + "topic/getLatestTopicList.json",
		cache:"false",
		dataType:"json",
		success: function(data, textStatus){
			var arrMap = [];
			var num = data.topicNum;
			var obj = data.topicList;
	    	 $.each(obj, function(i,item){
	    		 var dataSource = item.dataSource;
	    		 var title = item.title;
	    		 var arrLink = '<a href="' + path + dataSource +'"> ' + title + '</a>';
	    		 arrMap.push(arrLink);
	    	 });	
	    	 wordWall(arrMap);
		},
		error: function(){
			//请求出错处理
		}
    });
	


function wordWall(arrMap){

	var arr = arrMap;
	var color = ['#77caf2','#b0dde0','#d5ccba','#d5ccba','#d5e4a9'];
	var wordnum = 20;
	var borderW = 2;
	var colornum = color.length;
	var colorpos = 0;
	var	words = arrayRandomPic(arr, wordnum, false);

	var debugcnt = 0;

	function fillRect(wrapper, words) {
		var num = words.length,
			wrapperW = $(wrapper).width(),
			wrapperH = $(wrapper).height(),
			ratio = wrapperW / wrapperH;
		
		if(num == 0) {
			return;
		} else if(num == 1) {
			$(wrapper).html(createBox({width: wrapperW, height: wrapperH, top: 0, left: 0, word: words[0], color: getNextColor()}));
		} else if(ratio >= 2.5) {
			var randCol = randomRange(2, 1, 0.5),
				leftNum = Math.round(randCol[0] * num),
				rightNum = num - leftNum,
				leftWidth = Math.round(wrapperW * randCol[0]),
				rightWidth = wrapperW - leftWidth,
				html = '';
				
			if(leftNum == 0) {
				leftNum = 1;
				rightNum--;
			} else if(rightNum == 0) {
				rightNum = 1;
				leftNum--;
			}
			
			if(leftNum == 1) {
				html += createBox({width: leftWidth, height: wrapperH, top: 0, left: 0, word: words[0], color: getNextColor(), borderR: true});
			} else {
				html += createBox({width: leftWidth, height: wrapperH, top: 0, left: 0, word: '', borderR: true});
			}
			if(rightNum == 1) {
				html += createBox({width: rightWidth, height: wrapperH, top: 0, left: leftWidth, word: words[num - 1], color: getNextColor()});
			} else {
				html += createBox({width: rightWidth, height: wrapperH, top: 0, left: leftWidth, word: ''});
			}
			$(wrapper).html(html);
			
			if(leftNum > 1) {
				var leftDiv = $(wrapper).children('div')[0];
				fillRect(leftDiv, words.slice(0, leftNum));
			} 
			if(rightNum > 1) {
				var rightDiv = $(wrapper).children('div')[1];
				fillRect(rightDiv, words.slice(leftNum));
			} 
		} else {
			var randRow = randomRange(2, 1, 0.5),
				topNum = Math.round(randRow[0] * num),
				bottomNum = num - topNum,
				topHeight = Math.round(wrapperH * randRow[0]),
				bottomHeight = wrapperH - topHeight,
				html = '';
				
			if(topNum == 0) {
				topNum = 1;
				bottomNum--;
			} else if(bottomNum == 0) {
				bottomNum = 1;
				topNum--;
			}
			
			if(topNum == 1) {
				html += createBox({width: wrapperW, height: topHeight, top: 0, left: 0, word: words[0], color: getNextColor(), borderB: true});
			} else {
				html += createBox({width: wrapperW, height: topHeight, top: 0, left: 0, word: '', borderB: true});
			}
			if(bottomNum == 1) {
				html += createBox({width: wrapperW, height: bottomHeight, top: topHeight, left: 0, word: words[num - 1], color: getNextColor()});
			} else {
				html += createBox({width: wrapperW, height: bottomHeight, top: topHeight, left: 0, word: ''});
			}
			$(wrapper).html(html);
			
			if(topNum > 1) {
				var topDiv = $(wrapper).children('div')[0];
				fillRect(topDiv, words.slice(0, topNum));
			} 
			if(bottomNum > 1) {
				var bottomDiv = $(wrapper).children('div')[1];
				fillRect(bottomDiv, words.slice(topNum));
			}
		}
	}

	function getNextColor() {
		var cl = color[colorpos % colornum];
		colorpos++;
		return cl;
	}

	function createBox(option) {
		var width = option.borderR ? option.width - borderW : option.width,
			height = option.borderB ? option.height - borderW : option.height,
			lineHeight = height, paddingTop;
			
		if(option.word) {
			var wordW = getWordsWidth(option.word), line;
			if(wordW > width) {
				line = Math.ceil(wordW / width);
				lineHeight = 18;
				paddingTop = Math.max(0, (height - line * lineHeight) / 2);
			}
		}

		var html = '<div class="box" style="width:' + width + 'px;' + 
										   'height:' + height + 'px;' + 
									       'line-height:'+ lineHeight + 'px;' + 
									       'top:' + option.top + 'px;' + 
									       'left:' + option.left + 'px;' + 
									       (option.color ? ('background-color:' + option.color + ';') : '') + 
									       (option.borderR ? 'border-right:' + borderW + 'px solid #fff;' : '') + 
									       (option.borderB ? 'border-bottom:' + borderW + 'px solid #fff;' : '') + 
										   (paddingTop ? ('padding-top:' + paddingTop + 'px;') : '') + 
									       '">' + option.word + '</div>';
		return html;
	}

	function getWordsWidth(word) {
		if($('#get_ww').size() < 1) {
			$('<div id="get_ww" class="font-ms" style="display:block;visibility:hidden;width:auto;height:20px;"><span></span></div>').appendTo('body');
		}
		$('#get_ww span').html(word);
		return $('#get_ww span').width();
	}

	function randomRange(num, base, round) {
		if(num == 1) {
			return [base];
		}
		var center = base / num,
			min = center * (1 - round),
			max = center * (1 + round),
			rand = Math.random() * (max - min) + min;
		return [rand].concat(randomRange(num - 1, base - rand, round));
	}

	function arrayRandomPic(arr, wordnum, priority) {
		var wordnum = Math.min(wordnum, arr.length),
			clone = arr.slice();
		if(priority) {
			return arr.slice(0, wordnum);
		} else {
			var ret = [], rand;
			for(var i = 0; i < wordnum; i++) {
				rand = Math.floor(Math.random() * clone.length);
				tmp = clone[0];
				clone[0] = clone[rand];
				clone[rand] = tmp;
				ret.push(clone[0]);
				clone = clone.slice(1);
			}
			return ret;
		}
	}

	fillRect($('#wrapper'), words);
	$(window).bind('resize', function() {
		if(window.fillTimeout) {
			clearTimeout(window.fillTimeout);
			window.fillTimeout = null;
		}
			
		window.fillTimeout = setTimeout(function() {
			fillRect($('#wrapper'), words);
		}, 200);
	})
}
})();