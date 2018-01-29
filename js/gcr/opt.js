$(function(){
  // 点击登录
  /*$('.log').on('click',function(){
    layer.open({
      type:2,
      title:false,
      area:['500px', '410px'],
      skin:'logonClass',
      content:['/front/user/logon','no'],
      yes:function(index,layero){
        layer.close(index);
      }
    });
  });*/

  // 更多 
  $('.total').on('click',function(){
    var $input = $(this).siblings().find('input');
    var flag = $(this).find('input').prop('checked',true);
    if(flag){
      $input.each(function(i,ele){
        $(this).prop('checked',false);
      })
    }
  });
  $('.morecontent .clearfix span input').on('click',function(){
    var $span = $(this).parent().parent().find('span');
    var totallength = $span.length;
    var flag = $(this).prop('checked');
    if(flag){
      $(this).parent().parent().siblings().find('input').attr('checked',false);
      $(this).parent().find('input').addClass('on');
      if($(this).parent().parent().hasClass('radioDiv')){
        $(this).parent().siblings().find('input').removeClass('on');
      }
    }else{
      $(this).removeClass('on');
      var len = $(this).parent().parent().find('input.on').length;
      if(len == 0){
        $(this).parent().parent().siblings().find('input').click();
      }
    }
  });
  $('.houseMapUlLast li input.button').on('click',function(){
    $(this).parent().parent().hide();
  });

  // 左侧栏高度控制
  $('.map-list .map-hourse > ul').css({height:setUlHeight()}); 
  $(window).resize(function(){
    $('.map-list .map-hourse > ul').css({height:setUlHeight()});
  });
  $('.map-list .map-hourse > .loading').css({height:setUlHeight()}); 
  $(window).resize(function(){
    $('.map-list .map-hourse > .loading').css({height:setUlHeight()});
  });
  function setUlHeight(){
    var H = innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
    var topHeader = $(".head-wrapper").outerHeight();
    var leftTopH = $(".sortby").outerHeight();
    var $height = $(this).height();
    $height = H - (topHeader + leftTopH + 70);
    return $height + "px";
  };

  // 推荐排序
  $('.sortby a.sort-a').on("click",function(){
    $(this).addClass('on');
    var i = $(this).find('.icon');
    if(i.hasClass('icon-jiantou')){
      i.removeClass('icon-jiantou');
      i.addClass('icon-jiantou1');
    }else{
      i.addClass('icon-jiantou');
      i.removeClass('icon-jiantou1');
    }
  })
})