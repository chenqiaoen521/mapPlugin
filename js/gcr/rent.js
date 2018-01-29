$(function () {
    // 登录页面
    $('.log').on('click', function () {
        layer.open({
            type: 2,
            title: false,
            area: ['500px', '430px'],
            skin: 'logonClass',
            content: ['/front/user/logon', 'no'],
            yes: function (index, layero) {
                layer.close(index);
            }
        });
    });
    // 获取手机验证码
    $('.tel-code').on('click', function () {
        var $input = $(this).closest('.parent').siblings('.inputfocus').find('input.reqInput');
        if ($input.val() == '') {
            layer.msg('请输入手机号', {skin: 'gray-class', icon: 0});
            $input.focus();
        } else if (!phone.test($input.val())) {
            layer.msg('请输入格式正确的手机号', {skin: 'gray-class', icon: 0});
            $input.focus();
        } else {
            $.post("/front/user/sendMsg", {
                'phone': $('input[name=r_phone]').val(),
                'captcha': $('input[name=r_imgscode]').val()
            }, function (data) {
                var data = eval(data);
                console.log(data);
                if (data.code === 1) {
                    setTime('tel-code');
                } else {
                    layer.msg(data.msg, {skin: "gray-class", icon: 0, time: 2000}, function () {
                        var id = Math.random();
                        $('#randCode').attr('src','/captcha.html' + '?' + "id=" + id);
                    });
                }
            })
        }
    });

    //该手机号已存在
    $('.new_phone').on('blur', function () {
        if($('.new_phone').val() !== ''){
            $.post("/front/user/getUser", {
                'phone': $('input[name=new_phone]').val(),
            }, function (data) {
                var data = eval(data);
                if (data.code === 1) {//该手机号已存在
                    $('.error').show();
                }else{
                    $('.error').hide();
                }
            })
        }
    });
    // 获取手机验证码
    $('.tel-code-n').on('click', function () {
        var $input = $(this).closest('.parent').siblings('.inputfocus').find('input.reqInput');
        if ($input.val() == '') {
            layer.msg('请输入手机号', {skin: 'gray-class', icon: 0});
            $input.focus();
        } else if (!phone.test($input.val())) {
            layer.msg('请输入格式正确的手机号', {skin: 'gray-class', icon: 0});
            $input.focus();
        } else {
            $.post("/front/user/sendMsgNoCaptcha", {
                'phone': $('input[name=new_phone]').val(),
            }, function (data) {
                var data = eval(data);
                if (data.code === -1) {
                    layer.msg(data.msg, {skin: "gray-class", icon: 0, time: 2000}, function () {
                    });
                } else {
                    setTime('tel-code-n');
                }
            })
        }
    });

    // 登录tab切换
    $('.logonTitle').on('click', function () {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        var activeId = $(this).find('a').attr('data-id');
        $('#' + activeId).addClass('active');
        $('#' + activeId).siblings().removeClass('active');
    });
    var phone = /^1((3[0-9]{1})|(45)|(47)|(5[0-9]{1})|(76)|(77)|(78)|(8[0-9]{1}))\d{8}$/;
    // var _password = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
    var _password = /^\S{6,12}$/;
    var time = 60;
    var timer = null;
    $.validator.addMethod("isMobile", function (value, element) {
        return this.optional(element) || phone.test(value);
    });
    $.validator.addMethod("isPassword", function (value, element) {
        return this.optional(element) || _password.test(value);
    });
    $(".logonLeft").validate({
        rules: {
            l_phone: {
                required: true,
                minlength: 11,
                maxlength: 11,
                isMobile: true,
                digits: true
            },
            l_password: {
                required: true,
                rangelength: [6, 10],
                isPassword: true
            },
            captcha: {
                required: true,
                captcha: true
            }
        },
        messages: {
            l_phone: {
                required: '请输入您的常用手机号码',
                minlength: '手机号码长度为11位',
                maxlength: '手机号码长度为11位',
                digits: '手机号码只能输入数字',
                isMobile: "请输入格式正确的手机号"
            },
            l_password: {
                required: '请输入密码',
                rangelength: '密码位数为6到10位',
                isPassword: "请输入6-10非空字符"
            },
            captcha: {
                required: '请输入验证码',
                captcha: "请输入有效验证码"
            }
        },
        OnSubmit: true,
        onfocusout: false,
        onkeyup: false,
        submitHandler: function (form) {
            $.post("/front/user/doLogin", {
                'tel': $('input[name=l_phone]').val(),
                'type': 1,
                'password': $('input[name=l_password]').val(),
                'is_remember': $('input[name=is_remember]').val()
            }, function (data) {

                var data = eval(data);
                if (data.code > 0) {
                    layer.msg(data.msg, {skin: "gray-class", icon: 1, time: 2000}, function () {});
                    window.top.location.reload();
                } else {
                    layer.msg(data.msg, {skin: "gray-class", icon: 0, time: 2000}, function () {});
                }
            })
        },
        showErrors: function (errorMap, errorList) {
            if (errorList.length > 0) {
                layer.msg(errorList[0].message, {skin: 'gray-class', icon: 0, time: 2000});
                $(errorList[0].element).focus();
            }
        }
    });
    // 快捷登录正则
    $('.logonRight').validate({
        rules: {
            r_phone: {
                required: true,
                minlength: 11,
                maxlength: 11,
                isMobile: true,
                digits: true
            },
            r_imgscode:{
               required:true
            },
            r_code:{
                required:true
            },
            phoneCaptcha: {
                required: true,
                phoneCaptcha: true
            }
        },
        messages: {
            r_phone: {
                required: '请输入您的常用手机号码',
                minlength: '手机号码长度为11位',
                maxlength: '手机号码长度为11位',
                digits: '手机号码只能输入数字',
                isMobile: "请输入格式正确的手机号"
            },
            r_imgscode:{
               required: '请输入图片验证码'
            },
            r_code:{
                required:'请输入手机验证码'
            },
            phoneCaptcha: {
                required: "请输入手机验证码",
                phoneCaptcha: "请输入有效验证码"
            }
        },
        onsubmit: true,
        submitHandler: function (form) {
            // $(".mylogins").PMS_loading();
            $.post("/front/user/doLogin", {
                'tel': $('input[name=r_phone]').val(),
                'type': 2,
                'capture': $('input[name=r_imgscode]').val(),
                'code': $('input[name=r_code]').val()
            }, function (data) {
                var data = eval(data);
                if (data.code > 0) {
                    layer.msg(data.msg, {skin: "gray-class", icon: 1, time: 2000});
                    window.top.location.reload();
                } else {
                    layer.msg(data.msg, {skin: "gray-class", icon: 0, time: 2000});
                }
            });
        },
        onfocusout: false,
        onkeyup: false,
        showErrors: function (errors, errorList) {
            if (errorList.length > 0) {
                layer.msg(errorList[0].message, {skin: 'gray-class', offset: '3.5%', icon: 0, time: 2000});
                $(errorList[0].element).focus();
            }
        }
    });    
    // 忘记密码页面
    // 填写手机号
    $('.for-content').delegate('.findBtn', 'click', function () {
        var _this = $(this);
        var telInput = $(this).prev().find('input');
        var telVal = telInput.val();
        phone_forget = telVal;
        if (telVal == '') {
            telInput.focus();
            layer.msg('请输入手机号', {skin: 'gray-class', icon: 0});
        } else {
            if (!phone.test(telVal)) {
                layer.msg('请输入格式正确的手机号', {skin: 'gray-class', icon: 0});
                telInput.focus();
            } else {
                $.post("/front/user/getUser", {'phone': phone_forget}, function (data) {
                    var data = eval(data);
                    if (data.code === -1) {
                        layer.msg(data.msg, {skin: "gray-class", icon: 0, time: 2000}, function () { });
                    } else {
                        var star1 = telVal.slice(3, 7);
                        var star2 = telVal.replace(star1, '****');
                        _this.parent().removeClass('inputShow');
                        _this.parent().next().addClass('inputShow');
                        $('.re-tel').text(star2);
                        $('.codePic').val('');
                        $('.title-li.active').next().addClass('active');
                    }
                })

            }
        }
    });
    // 修改手机号
    $('.revise').on('click', function () {
        $(this).parents('.inputDiv').removeClass('inputShow');
        $(this).parents('.inputDiv').prev().addClass('inputShow');
        $('.title-li').eq(1).removeClass('active');
        $(this).parents('.inputDiv').prev().find('.findPW-li input').val('');
    });

    // 获取手机验证码
    $('.randomCodeTel').on('click', function () {
        var codeVal = $('.codePic').val();
        if (codeVal == '') {
            layer.msg('请输入图片验证码', {skin: 'gray-class', icon: 0});
            $('.codePic').focus();
            $('.codePic').val('');
        } else {
            $.post("/front/user/sendMsg", {'phone': phone_forget, 'captcha': codeVal}, function (data) {
                var data = eval(data);
                if (data.code === -1) {
                    layer.msg(data.msg, {skin: "gray-class", icon: 0, time: 2000}, function () {
                        var id = Math.random();
                        $('#randCode').attr('src','/captcha.html' + '?' + "id=" + id);
                    });
                } else {
                    setTime('randomCodeTel');
                }
            })

        }
    });
    // 验证身份提交
    $('.for-content').delegate('.findSub', 'click', function () {
        var _this = $(this);
        if ($('.codePic').val() == '') {
            layer.msg('请输入图片验证码', {skin: 'gray-class', icon: 0});
            $('.codePic').focus();
        } else if ($('.dynamicCode').val() == '') {
            layer.msg('请输入手机验证码', {skin: 'gray-class', icon: 0});
            $('.dynamicCode').focus();
        } else {
            var phone = phone_forget;
            var code = $('.dynamicCode').val();
            code_forget = code;
            $.post("/front/user/verifyPhoneCode", {'phone': phone, 'code': code}, function (data) {
                var data = eval(data);
                if (data.code === -1) {
                    layer.msg(data.msg, {skin: "gray-class", icon: 0, time: 2000})
                } else {
                    $('.title-li').eq(2).addClass('active');
                    _this.parent().removeClass('inputShow');
                    _this.parent().next().addClass('inputShow');
                }
            })
        }
    });

    // 设置新密码
    $('.findSubmit').on('click', function () {
        var _this = $(this);
        if ($('.findPW-li .password').val() == '') {
            layer.msg('请输入新密码', {skin: 'gray-class', icon: 0});
            $('.findPW-li .password').focus();
        } else if (!_password.test($('.findPW-li .password').val())) {
            layer.msg('请设置由数字和字母组合成的复杂密码', {skin: 'gray-class', icon: 0});
            $('.findPW-li .password').focus();
            $('.findPW-li .password').val('');
        } else if ($('.re-password').val() == '') {
            layer.msg('请确认新密码', {skin: 'gray-class', icon: 0});
            $('.findPW-li .re-password').focus();
        } else if ($('.findPW-li .password').val() !== $('.re-password').val()) {
            layer.msg('两次密码输入不一致，请重新输入', {skin: 'gray-class', icon: 0});
            $('.re-password').val('');
            $('.re-password').focus();
        } else {
            var phone = phone_forget;
            var code = code_forget;
            var res = 0;
            $.post("/front/user/forgetAjax", {
                'phone': phone,
                'code': code,
                'password': $('.findPW-li .password').val(),
                'passwordTwice': $('.re-password').val()
            }, function (data) {
                var data = eval(data);
                if (data.code === -1) {
                    layer.msg(data.msg, {skin: "gray-class", icon: 0, time: 2000})
                } else {
                    $('.title-li').eq(3).addClass('active');
                    _this.parent().removeClass('inputShow');
                    _this.parent().next().addClass('inputShow');
                }
            });
        }
    });

    // 验证码倒计时
    function setTime(dom) {
        attrDis(dom);
        timer = setInterval(function () {
            time--;
            time = time < 10 ? '0'.concat(time) : time;
            if (time <= 0) {
                $('.' + dom).val('重新获取验证码');
                time = 60;
                clearInterval(timer);
                $('.' + dom).attr('disabled', false);
                $('.' + dom).css({'color': '#fff', 'background': '#bac0ce', 'cursor': 'pointer'});
            } else {
                attrDis(dom);
            }
        }, 1000);
    };

    function attrDis(dom) {
        $('.' + dom).attr('disabled', true);
        $('.' + dom).val(time + '秒后重试');
        $('.' + dom).css({'color': '#666', 'background': '#e4e6e9', 'cursor': 'not-allowed'});
    };
    // tab切换
    // function TabSwitch(dom,cla){
    //   $(dom).on('click',function(){
    //     var _href = $(this).attr('href');
    //     var _start = _href.lastIndexOf('#');
    //     var activeId = _href.slice(_start + 1,_href.length);
    //     $('#' + activeId).addClass('active');
    //     $('#' + activeId).siblings(cla).removeClass('active');
    //   });
    // };
    // TabSwitch('.information ul li a','.pull-rights');

    function TabSwitch(dom, cla) {
        this.tab('.information ul li a', '.pull-rights');
    };
    TabSwitch.prototype = {
        tab: function (dom, cla) {
            $(document).delegate(dom, 'click', function () {
                $(this).parent('p').addClass('current');
                $(this).parents('li').siblings().find('p').removeClass('current');
                var activeId = $(this).attr('data-id');
                if(activeId == "recruit"){
                   $('.images[data-src="' + activeId + '"]').addClass('curimg');
                   $('.images[data-src="' + activeId + '"]').siblings().removeClass('curimg'); 
                }else{
                   $('.images[data-src="recruit"]').removeClass('curimg');
                   $('.images[data-src="recruit"]').siblings().addClass('curimg'); 
                }
                $('#' + activeId).addClass('active');
                if ($('#' + activeId + '.active').find('.safe').length !== 0) {
                    $('#' + activeId + '.active .safe').show();
                    if ($('#' + activeId + '.active .addModify').length !== 0) {
                        $('.addModify').hide();
                        $('.modifyAcc').hide();
                        $('.accountSafe').css({'cursor': 'default'});
                    }
                    ;
                }
                ;
                $('#' + activeId).siblings(cla).removeClass('active');
                $(this).parents('.pull-lefts').height($('#' + activeId + '.active').height());
            });
        }
    };
    var tabSwitch = new TabSwitch('.information ul li a', '.pull-rights');


    // 修改
    $('.accountSafe').on('click', function () {
        $('.safe').show();
        $('.safe').next().hide();
        if ($('.addModify').length !== 0) {
            $('.addModify').hide();
            $('.accountSafe').css({'cursor': 'default'});
        }
        ;
    });

    function Modify() {
        this.modify('.m-phone');
        this.modify('.m-pass');
    };
    Modify.prototype = {
        modify: function (dom, cla) {
            $(dom).on('click', function () {
                var m = dom.slice(1);
                $('.accountSafe').css({'cursor': 'pointer'});
                var span = $('<span class="addModify"><i class="icon iconfont icon-you"></i><i class="modifyText">修改手机号码</i></span>');
                $(this).parents('.safe').hide();
                $(this).parents('.safe').next().show();
                $(this).parents('.safe').next().find('.curInputGroup[data-id="' + m + '"]').addClass('curInput');
                $(this).parents('.safe').next().find('.curInputGroup[data-id="' + m + '"]').siblings().removeClass('curInput');
                if ($('.addModify').length == 0) {
                    $(this).parents('.per-safe-item').prev('.title').append(span);
                } else {
                    if ($('.addModify').hide()) {
                        $('.addModify').show();
                    }
                }
            });
        }
    };
    var modification1 = new Modify('.m-phone');
    var modification2 = new Modify('.m-pass');

    $('.per-form-pass').validate({
        rules: {
            password: {required: true, minlength: 6, maxlength: 12, isPassword: true},
            passwordTwice: {required: true, equalTo: '#password1'}
        },
        OnSubmit: true,
        submitHandler: function (form) {
            // $(".mylogins").PMS_loading();
            var password = $('input[name=password]').val();
            var passwordTwice = $('input[name=passwordTwice]').val();
            $.post("/front/personal/editPassword", {  // phone  id
                'password': password,
                'passwordTwice': passwordTwice
            }, function (data) {
                if (passwordTwice != password) {
                    layer.msg('两次密码输入不一致', {skin: "gray-class", icon: 0, time: 2000}, function () {});
                    // return false;
                }
                var data = eval(data);
                if (data.code == 1) {
                    layer.msg(data.msg, {skin: "gray-class", icon: 1, time: 2000}, function () {
                        if (data.url !== '') {
                            window.location.href = '/front/personal/userDetail';
                        }
                    })
                } else {
                    layer.msg(data.msg, {skin: "gray-class", icon: 0, time: 2000}, function () {
                    })
                }
            })
            return false;
        },
        onfocusout: false,
        onkeyup: false,
        messages: {
            password: {
                required: '请输入新密码',
                minlength: '密码位数至少为6位',
                maxlength: '密码位数至多为12位',
                isPassword: '请设置由数字和字母组合成的复杂密码'
            },
            passwordTwice: {required: '请确认新密码', equalTo: '两次密码输入不一致，请重新输入'}
        },
        showErrors: function (errorMap, errorList) {

            if (errorList.length > 0) {
                layer.msg(errorList[0].message, {skin: 'gray-class', icon: 0});
                $(errorList[0].element).focus();
            }
        }
    });
    $('.per-form-phone').validate({
        rules: {
            new_phone: {required: true, minlength: 11, isMobile: true},
            mobileCode: {required: true}
        },
        OnSubmit: true,
        submitHandler: function (form) {
            $(".mylogins").PMS_loading();
            $.post("/front/personal/editPhone", {  // phone  id
                'phone': $('input[name=new_phone]').val(),
                'code': $('input[name=mobileCode]').val()
            }, function (data) {
                var data = eval(data);
                if (data.code == 1) {
                    layer.msg(data.msg, {skin: "gray-class", icon: 1, time: 2000}, function () {
                        if (data.url !== '') {
                            window.location.href = '/front/personal/userDetail';
                        }
                    })
                } else {
                    layer.msg(data.msg, {skin: "gray-class", icon: 0, time: 2000}, function () {
                    })
                }
            })
            return false;
        },
        onfocusout: false,
        onkeyup: false,
        messages: {
            new_phone: {required: '请输入手机号', minlength: '手机号码长度为11位', isMobile: '手机号格式不正确'},
            mobileCode: {required: '请输入验证码'}
        },
        showErrors: function (errorMap, errorList) {
            if (errorList.length > 0) {
                layer.msg(errorList[0].message, {skin: 'gray-class', icon: 0});
                $(errorList[0].element).focus();
            }
        }
    });
    

    // 底部
    $('.fo-code .float-left a').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    $('.fo-center ul li a').on('click', function () {
        var curVal = $(this).attr('data-val');
        $('.about-infor ul li p').find('a[data-id="' + curVal + '"]').click();
    });
})