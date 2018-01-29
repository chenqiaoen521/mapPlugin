function chooseManager() {
      $(document).delegate('.hook-select', 'click', function(e){
        e.stopPropagation();
        unbindSelect();
        var ul = $(this).siblings('ul.build-result');
        $(this).hasClass('ignore-width') ? '' : ul.width($(this).parent().width()-2);
        ul.toggle();
      });
    }
    function managerResult(){
      var that = this;
      $(document).delegate('ul.build-result>li>a','click',function(e){
        e.stopPropagation();
        var name = $(this).data('title') ? $(this).data('title') : $(this).text();
        var parent = $(this).parent().parent();
        if(parent.children('input')!=0){
          var val = $(this).data('val');
          parent.siblings('input').val(val);
        }
        if(parent.children('span')!=0){
          parent.siblings('span').text(name);
        }
        if(parent.siblings('input').hasClass('hook-input-value')){
          parent.siblings('.hook-input-value').val(name);
        }
        unbindSelect();
      });
    }
    function unbindSelect() {
      $('ul.build-result').fadeOut();
    }
    function unbind() { 
      $(document).click(function(){
          unbindSelect();
      });
    }
    function mouseleaveHide(){
      $('.build-result').mouseleave(function(){
        unbindSelect();
      });
    }