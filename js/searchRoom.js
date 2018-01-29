// BOF
// 搜索js插件
// 搜索条件(原始url自带)
var conditions = {};
var orders = '';
var params = {};
var query  = window.location.search;
function search(id,val,desc)
{
    if (val !== '')
    {
        if (id == 'metro_station_id')
        {
            // 删除地区选项卡
            delete conditions['district_id'];
            delete conditions['business_circle_id'];
            // 删除对应筛选项显示 
            $('div.current').find('ul>li').each(function()
            {
                var id = $(this).attr('data-id');
                if (id == 'district_id' || id == 'business_circle_id')
                {
                    $(this).remove();
                }
            });
            recoverBcPosSelect();
        }

        if (id == 'district_id')
        {
            // 删除商圈 地铁
            delete conditions['business_circle_id'];
            delete conditions['metro_station_id'];
            // 删除商圈 地铁筛选卡 
            $('div.current').find('ul>li').each(function()
            {
                var id = $(this).attr('data-id');
                if (id == 'business_circle_id' || id == 'metro_station_id')
                {
                    $(this).remove();
                }
            });
        }

        settleCurSearchShow(id,desc);
        conditions[id] = val;
    } else {
        if (id == 'room_labels')
        {
            var labelshows = $('div.current').find('ul>li');
            for (var i = labelshows.length - 1; i >= 0; i--)
            {
                if ($(labelshows[i]).attr('data-id').match(/^room_labels/))
                {
                    $(labelshows[i]).remove();
                }
            }
            delete conditions[id];
        } else {
            $('li.'+id).remove();
            delete conditions[id];
        }  
    }
    
    judgeShowCurrent();
    // console.log(conditions);
    // 组装数据提交
    settleData(1);
    // 组织显示页面数据
    // 显示当前筛选条件
    // 高亮显示当前选项
    $('html,body').animate({'scrollTop':'150px'},500);
}

// 判断
function judgeShowCurrent()
{
    var labelshows = $('div.current').find('ul>li');
    if (labelshows.length <= 0)
    {
        $('div.current').hide();
    }
}

// 加载房源数据
function settleData(pageNo)
{
    params.page  = pageNo;
    params.where = conditions;
    if (orders.length > 0)
    {
        params.order = orders;
    }
    // console.log('params',params);
    var request_url = window.location.href;
    $.post(request_url, params, function(res)
    {
        var items = res['list'];
        // console.log('items',items);
        $('#rooms-count').html(res['count']);
        if (res['count'] > 0)
        {
            $('div.search_null').hide();
            $("#pages").show();
        } else {
            $('div.search_null').show();
            $("#pages").hide();
        }

        settleList(items);
        if (pageNo == 1)
        {
            settlePage(res['count'], res['pageNo'], res['pageSize']);
        }
    });
} 

// 组装列表数据
function settleList(items)
{
    var html = '';
    var defaultImg = window.location.protocol+'//'+window.location.host+'/static/front/images/34.jpg';

    for (var i = 0; i <= items.length - 1; i++)
    {   
        html += '<li class="list-item clearfix">';
        html += '<img src="'+items[i]['room_image']+'" alt="" onerror="javascript:this.src='+"'"+defaultImg+"'"+'" >';
        html += '<a target="_blank" href="/front/houseroom/houseroomdetail.html?room_id='+items[i]['id']+'">';
        html += '<div class="mongo">';
        html += '<span>我要看房</span>';
        html += '</div>';
        html += '</a>';
        html += '<div class="list-middle-item middle">';
        // html += '<p class="name"><i class="icon icon-mia"></i><i class="icon icon-cu"></i><a target="_blank" href="/front/houseroom/houseroomdetail.html?room_id='+items[i]['id']+'">'+' '+items[i]['room_name']+'</a></p>';
        html += '<p class="name"><a target="_blank" href="/front/houseroom/houseroomdetail.html?room_id='+items[i]['id']+'">'+' '+items[i]['room_name']+'</a></p>';
        html += '<p class="desc"><a href="" class="icon icon-map6"></a><span>'+items[i]['district']+'</span><span>'+items[i]['address']+'</span><!-- <a href="" class="map">交通地图</a> --></p>';
        html += '<p class="delta">';
        if (items[i]['around_info'] !== '')
        {     
            html += '<i class="icon icon-arrow mr8"></i>';
            html += '<span class="distance">'+items[i]['around_info']+'</span>';
        }
        html += '<span class="ml20">'+items[i]['apartment_mode']+'</span>';
        html += '</p>';
        html += '<p class="flag">';
        if (items[i]['room_label'].length > 0)
        {
            for (var j = 0; j <= items[i]['room_label'].length - 1; j++)
            {
                html += '<span>'+items[i]['room_label'][j]+'</span>';
            };
        }
        html += '</p>';
        html += '<div class="detail">';
        html += '<p class="name price"><strong>'+items[i]['price']+'</strong>&nbsp;元&nbsp;/&nbsp;月</p>';
        html += '</div>';
        html += '</div>';
        html += '</li>';
    }
    // console.log(html);
    $('#room-list').html(html);
}

// 设置分页
function settlePage(count,no,size)
{
    // console.log(count,size);
    var totalPage = Math.ceil(count / size);
    // console.log(totalPage);
    //分页
    $("#pages").paging({
      pageNo:no,
      totalPage: totalPage,
      totalSize: count,
      callback: function(num)
      {
        // 滚动到顶部
        $("html,body").animate({scrollTop: $("div#list-content").offset().top-20}, 500, function()
        {
            settleData(num);
        });
      }
    })
}

// 设置当前筛选条件显示
function settleCurSearchShow (id, desc)
{
    $('div.current').show();
    // console.log(conditions[id]);
    if (id !== 'room_labels')
    {
        if (id == 'business_circle_id')
        {
            if (conditions[id])
            {
                $('li.'+id).find('p').html(desc);
            } else if (conditions['metro_station_id']) {
                $('li.metro_station_id').find('p').html(desc);
                $('li.metro_station_id').attr('data-id',id);
                $('li.metro_station_id').addClass(id);
                $('li.metro_station_id').removeClass('metro_station_id');
            } else {
                var html = '<li class="'+id+'" data-id="'+id+'"><p>'+desc+'</p><i class="icon icon-close"></i></li>';
                $('ul.current_search').append(html); 
            }
            delete conditions['metro_station_id'];
        } else if (id == 'metro_station_id')
        {
            if (conditions[id])
            {
                $('li.'+id).find('p').html(desc);
            } else if (conditions['business_circle_id']) {
                $('li.business_circle_id').find('p').html(desc);
                $('li.business_circle_id').attr('data-id',id);
                $('li.business_circle_id').addClass(id);
                $('li.business_circle_id').removeClass('business_circle_id');
            } else {
                var html = '<li class="'+id+'" data-id="'+id+'"><p>'+desc+'</p><i class="icon icon-close"></i></li>';
                $('ul.current_search').append(html); 
            }

            delete conditions['business_circle_id'];
        } else {
            if (conditions[id])
            { 
                $('li.'+id).find('p').html(desc);
            } else {
                var html = '<li class="'+id+'" data-id="'+id+'"><p>'+desc+'</p><i class="icon icon-close"></i></li>';
                $('ul.current_search').append(html); 
            } 
        }  
    }
}
// EOF