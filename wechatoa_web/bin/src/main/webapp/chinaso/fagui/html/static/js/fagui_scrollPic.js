// JavaScript Document
$(function(){
    //宪法
    var $cur = 1;//初始化显示的版面
    var $i = 1;//每版显示数
    var $len = $('.fagui_showbox>ul>li').length;//计算列表总长度(个数)
    var $pages = Math.ceil($len / $i);//计算展示版面数量
    var $w = $('.fagui_ibox').width();//取得展示区外围宽度
    var $showbox = $('.fagui_showbox');
   // var $num = $('span.num li')
    var $pre = $('span.fagui_picpre')
    var $next = $('span.fagui_picnext');
    var $autoFun;
    //@Mr.Think***调用自动滚动
    autoSlide();
    //@Mr.Think***向前滚动
    $pre.click(function(){
        if (!$showbox.is(':animated')) {  //判断展示区是否动画
            if ($cur == 1) {   //在第一个版面时,再向前滚动到最后一个版面
                $showbox.animate({
                    left: '-=' + $w * ($pages - 1)
                }, 500); //改变left值,切换显示版面,500(ms)为滚动时间,下同
                $cur = $pages; //初始化版面为最后一个版面
            }
            else {
                $showbox.animate({
                    left: '+=' + $w
                }, 500); //改变left值,切换显示版面
                $cur--; //版面累减
            }
            //$num.eq($cur - 1).addClass('numcur').siblings().removeClass('numcur'); //为对应的版面数字加上高亮样式,并移除同级元素的高亮样式
        }
    });
    //@Mr.Think***向后滚动
    $next.click(function(){
        if (!$showbox.is(':animated')) { //判断展示区是否动画
            if ($cur == $pages) {  //在最后一个版面时,再向后滚动到第一个版面
                $showbox.animate({
                    left: 0
                }, 500); //改变left值,切换显示版面,500(ms)为滚动时间,下同
                $cur = 1; //初始化版面为第一个版面
            }
            else {
                $showbox.animate({
                    left: '-=' + $w
                }, 500);//改变left值,切换显示版面
                $cur++; //版面数累加
            }
            //$num.eq($cur - 1).addClass('numcur').siblings().removeClass('numcur'); //为对应的版面数字加上高亮样式,并移除同级元素的高亮样式
        }
    });
    //@Mr.Think***数字点击事件
    /*$num.click(function(){
        if (!$showbox.is(':animated')) { //判断展示区是否动画
            var $index = $num.index(this); //索引出当前点击在列表中的位置值
            $showbox.animate({
                left: '-' + ($w * $index)
            }, 500); //改变left值,切换显示版面,500(ms)为滚动时间
            $cur = $index + 1; //初始化版面值,这一句可避免当滚动到第三版时,点击向后按钮,出面空白版.index()取值是从0开始的,故加1
            //$(this).addClass('numcur').siblings().removeClass('numcur'); //为当前点击加上高亮样式,并移除同级元素的高亮样式
        }
    });*/
    //@Mr.Think***停止滚动
    clearFun($showbox);
    clearFun($pre);
    clearFun($next);
    //clearFun($num);
    //@Mr.Think***事件划入时停止自动滚动
    function clearFun(elem){
        elem.hover(function(){
            clearAuto();
        }, function(){
            autoSlide();
        });
    }
    //@Mr.Think***自动滚动
    function autoSlide(){
        $next.trigger('click');
        $autoFun = setTimeout(autoSlide, 5000);//此处不可使用setInterval,setInterval是重复执行传入函数,这会引起第二次划入时停止失效
    }
    //@Mr.Think***清除自动滚动
    function clearAuto(){
        clearTimeout($autoFun);
    }
    //法规图书
    var $curls = 1;//初始化显示的版面
    var $ils = 1;//每版显示数
    var $lenls = $('.fagui_zgls_showbox>ul>li').length;//计算列表总长度(个数)
    var $pagesls = Math.ceil($lenls / $ils);//计算展示版面数量
    var $wls = $('.fagui_zgls_ibox').width();//取得展示区外围宽度
    var $showboxls = $('.fagui_zgls_showbox');
   // var $num = $('span.num li')
    var $prels = $('span.fagui_zgls_picpre')
    var $nextls = $('span.fagui_zgls_picnext');
    var $autoFunls;
    //@Mr.Think***调用自动滚动
    autoSlidels();
    //@Mr.Think***向前滚动
    $prels.click(function(){
        if (!$showboxls.is(':animated')) {  //判断展示区是否动画
            if ($curls == 1) {   //在第一个版面时,再向前滚动到最后一个版面
                $showboxls.animate({
                    left: '-=' + $wls * ($pagesls - 1)
                }, 500); //改变left值,切换显示版面,500(ms)为滚动时间,下同
                $curls = $pagesls; //初始化版面为最后一个版面
            }
            else {
                $showboxls.animate({
                    left: '+=' + $wls
                }, 500); //改变left值,切换显示版面
                $curls--; //版面累减
            }
            //$num.eq($cur - 1).addClass('numcur').siblings().removeClass('numcur'); //为对应的版面数字加上高亮样式,并移除同级元素的高亮样式
        }
    });
    //@Mr.Think***向后滚动
    $nextls.click(function(){
        if (!$showboxls.is(':animated')) { //判断展示区是否动画
            if ($curls == $pagesls) {  //在最后一个版面时,再向后滚动到第一个版面
                $showboxls.animate({
                    left: 0
                }, 500); //改变left值,切换显示版面,500(ms)为滚动时间,下同
                $curls = 1; //初始化版面为第一个版面
            }
            else {
                $showboxls.animate({
                    left: '-=' + $wls
                }, 500);//改变left值,切换显示版面
                $curls++; //版面数累加
            }
            //$num.eq($cur - 1).addClass('numcur').siblings().removeClass('numcur'); //为对应的版面数字加上高亮样式,并移除同级元素的高亮样式
        }
    });
    //@Mr.Think***数字点击事件
    /*$num.click(function(){
        if (!$showbox.is(':animated')) { //判断展示区是否动画
            var $index = $num.index(this); //索引出当前点击在列表中的位置值
            $showbox.animate({
                left: '-' + ($w * $index)
            }, 500); //改变left值,切换显示版面,500(ms)为滚动时间
            $cur = $index + 1; //初始化版面值,这一句可避免当滚动到第三版时,点击向后按钮,出面空白版.index()取值是从0开始的,故加1
            //$(this).addClass('numcur').siblings().removeClass('numcur'); //为当前点击加上高亮样式,并移除同级元素的高亮样式
        }
    });*/
    //@Mr.Think***停止滚动
    clearFunls($showboxls);
    clearFunls($prels);
    clearFunls($nextls);
    //clearFun($num);
    //@Mr.Think***事件划入时停止自动滚动
    function clearFunls(elem){
        elem.hover(function(){
            clearAutols();
        }, function(){
            autoSlidels();
        });
    }
    //@Mr.Think***自动滚动
    function autoSlidels(){
        $nextls.trigger('click');
        $autoFunls = setTimeout(autoSlidels, 5000);//此处不可使用setInterval,setInterval是重复执行传入函数,这会引起第二次划入时停止失效
    }
    //@Mr.Think***清除自动滚动
    function clearAutols(){
        clearTimeout($autoFunls);
    }
});
