;(function($){
  function select() {
    this.chooseManager();
    this.unbind();
    this.managerResult();
  }
  select.prototype = {
    chooseManager:function () {
      var that = this;
      $('.hook-select').each(function(i,el){
        $(this).click(function(e){
          e.stopPropagation();
          that.unbindSelect();
          var ul = $(this).siblings('ul.houseResult');
          ul.width($(this).parent('.houseMapHeader').width());
          ul.toggle();
        })
      });
      // $('.houseHeaderSpan').each(function(i,el){
      //   $(this).click(function(e){
      //     e.stopPropagation();
      //     that.unbindSelect();
      //     var ul = $(this).siblings('ul.houseResult');
      //     ul.width($(this).parent('.houseMapHeader').width());
      //     ul.toggle();
      //   })
      // });
      return this;
    },
    unbind:function () {
      var that = this; 
      $(document).click(function(){
          that.unbindSelect();
      });
    },
    managerResult:function(){
      var that = this;
      $('.houseResult').delegate('li a','click',function(e){
        e.stopPropagation();
        var name = $(this).text();
        var parent = $(this).parents('.houseResult');
        if(parent.children('input')!=0){        	
          	var val = $(this).data('val');
          	parent.siblings('input:hidden').val(val);
        }
        if(parent.children('.houseHeaderSpan')!=0){
          parent.siblings('span.houseHeaderSpan').text(name);
          parent.siblings('input.houseHeaderSpan').val(name);
        }
        that.unbindSelect();
      });
    },
    unbindSelect:function () {
      $('.hook-select').each(function(i,el){
          var ul = $(this).siblings('ul.houseResult');
          ul.fadeOut();
      });
      $('.houseResult').click(function(e){
        e.stopPropagation();
      });
    }
  }
  $.select = function () {
    var fg = window['select'];
    if(fg){
      return fg;
    }else{
      fg = window['select'] = new select();
      return fg;
    }
    return null;
  }
  $.select();
})($)