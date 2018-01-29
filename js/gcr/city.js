$(function(){
  city_id_selected = "";
  // 城市
  //  调用json文件
  $.ajax({
    url: "/static/front/js/gcr/city.json",
    dataType: 'json',
    success: function (response) {
      $.each(response.listData.data.list, function (i) {
        var citys = response.listData.data.list[i].city;
        $(".citycontent").append('<div class="clearfix float-left detailcity"><span class="spans float-left">' + response.listData.data.list[i].text + '</span><ul class="liBox clearfix"></ul></div>')
        $.each(citys, function (j) {
          $(".citycontent .liBox").eq(i).append('<li class="float-left"  date-id="' + citys[j].id + '">' + citys[j].citys + '</li>');
          $(".citycontent .liBox").eq(i).find("li").click(function () {
            $("input[name=city]").val($(this).html());
            $("input[name=city]").siblings('input:hidden').val(citys[$(this).index()].id);
            city_id_selected  = $(this).attr('date-id');
            $(".cityBox").hide().css({top: "60%", opacity: "0", filter: "alpha(opacity=0)"});
            $(".covercity").hide();
          });
        });
      });
    }
  });
  (function () {
    var numcity = 0;
    $("input[name=city]").click(function () {
      $(".covercity").show();
      $(".cityBox").show().animate({top: "50%", opacity: "1", filter: "alpha(opacity=100)"}, function () {
        $('.detailcity').each(function (index, html) {
          if ($('.detailcity')[index].str == undefined) {
            $('.detailcity')[index].str = numcity;
            numcity = numcity + $('.detailcity').eq(index).height();
          }
        })
      });
    });
    $('.citycontent').scroll(function () {
      var mySTop = $('.citycontent').scrollTop();
      $('.detailcity').each(function (index, html) {
        if ($('.detailcity')[index].str <= mySTop) {
          $('.cityTitle li').removeClass('action').eq(index).addClass('action');
        } else {
          $('.cityTitle li').eq(index).removeClass('action');
        }
      })
    })
    $(".cityTitle ul li").click(function () {
      var ind = $(this).index();
      $('.citycontent').animate({
          scrollTop: $('.detailcity')[ind].str
      })
    });
    $(".myclose span").click(function () {
      $(".cityBox").hide().css({top: "60%", opacity: "0", filter: "alpha(opacity=0)"});
      $(".covercity").hide();
    });
  })();

  // 房东入驻
  $(".enterForm").validate({
    rules: {
      name: {required: true},
      r_phone: {required: true, minlength: 11, isMobile: true},
      r_imgscode: {required: true},
      code: {required: true},
    },
    OnSubmit: true,
    submitHandler: function (form) {
      $(".mylogins").PMS_loading();
      $.post("/front/operator/register", {
        'name': $('input[name=name]').val(),
        'code': $('input[name=code]').val(),
        'phone': $('input[name=r_phone]').val(),
        'captcha': $('input[name=r_imgscode]').val(),
        'apartment_name': $('input[name=apartment_name]').val(),
        'apartment_scale': $('input[name=apartment_scale]').val(),
        'company_province': $('input[name=company_province]').val(),
        'company_city': city_id_selected
      }, function (data) {
        var data = eval(data);
        if (data.code == 1) {

          layer.alert('', {
              title:'',
              btn: ['关闭'],
              time:3000,
              content:'<div><i class="ii-success" style="font-size:50px;color:#3fc5a4;"></i></div><h1 style="margin:10px 0 20px; text-indent:11px;font-size:20px;">提交成功！</h1><p>感谢您的反馈,有您的支持我们会做得更好！</p>',
              shade:false,
              skin: 'layer-ext-dayu',
              closeBtn: 0,
          },function () {
            layer.closeAll();
          });
          // layer.msg(data.msg, {skin: "gray-class", icon: 1, time: 2000}, function () {
          //   window.location.reload();
          // });
        } else {
          layer.msg(data.msg, {skin: "gray-class", icon: 0, time: 2000}, function () {})
        }
      })
      return false;
    },
    onfocusout: false,
    onkeyup: false,
    messages: {
      name: {required: '请输入姓名'},
      r_phone: {required: '请输入手机号', minlength: '手机号码长度为11位', isMobile: '手机号格式不正确'},
      r_imgscode: {required: '请输入图片验证码'},
      code: {required: '请输入手机验证码'}
    },
    showErrors: function (errorMap, errorList) {
      if (errorList.length > 0) {
        layer.msg(errorList[0].message, {skin: 'gray-class', icon: 0});
        $(errorList[0].element).focus();
      }
    }
  });
})
