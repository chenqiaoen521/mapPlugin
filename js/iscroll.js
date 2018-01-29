/**滚动插件 by 武哲*/
"use strict";
var is = (function($){
      var doms = {
        tabBar: '#tabBar',
        fixbar: '#fixbar',
        posArea: '.hook-area',
        firstPos: '#room_id_01',
        offsetH: 70
      };
      var iScroll = function (options) {
        this.opts = $.extend(true, {}, doms, options || {});
        this.initDom();
        this.events();
      }
      var fn = iScroll.prototype;
      fn.initDom = function () {
        this.tabBar = $(this.opts.tabBar);
        this.fixbar = $(this.opts.fixbar);
        this.fixbarTab = $(this.opts.fixbar).find('ul>li');
        this.posArea = $(this.opts.posArea);
        this.win = $(window);
        this.posAreaArr = this.posH2Arrary();
      };
      fn.events = function () {
        //滚动监听
        var me = this;
        $(window).scroll(function() {
          me.display();
          me.posMonitor();
        });
        this.fixbarTab.click(function(){
          me.pos($(this).index());
        });
        this.tabBar.children().click(function(){
          me.pos($(this).index());
        });
      };
      fn.display = function () {
        var sTop = this.win.scrollTop();
        var tabTop = this.tabBar.offset().top;
        if (sTop >= tabTop) {
          this.fixbar.show();
        } else {
          this.fixbar.hide();
        }
      };
      fn.posMonitor = function () {
        var sTop = this.win.scrollTop();
        var arr = this.posAreaArr;
        var diff = this.opts.offsetH + 1;
        for (var i = 0; i < arr.length; i ++) {
          if (sTop >= (arr[i] - diff) && sTop <= (arr[i + 1] - diff)) {
            this.fixbarTab.eq(i).addClass('on');
            this.tabBar.children().eq(i).addClass('on');
          } else {
            this.fixbarTab.eq(i).removeClass('on');
            this.tabBar.children().eq(i).removeClass('on');
          }
        }
      };
      fn.posH2Arrary = function () {
        var arr = [];
        var first = this.tabBar.offset().top;
        arr.push(0);
        this.posArea.each(function(index, ele){
          arr.push($(this).offset().top);
        })
        arr.push(document.body.scrollHeight || document.documentElement.scrollHeight);
        return arr;
      }
      fn.pos = function (index) {
        var me = this;
        var arr = this.posAreaArr;
        var delta = arr[index];
        if (index === 0) {
          delta = $(this.opts.firstPos).offset().top;
        }
        $('html,body').animate({
          scrollTop: (delta - me.opts.offsetH) + 'px'
        },{
          duration: 500,
          easing: 'easeInSine'
        });
      }
      return iScroll;
    })(jQuery);
window.iScroll === undefined && (window.iScroll = is);
new iScroll();
