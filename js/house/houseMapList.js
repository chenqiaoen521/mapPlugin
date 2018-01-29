//列表筛选
$(function(){
//城市点击事件
	$(".city_select li").on("click",function(){
		var this_city=$(this).find("a").attr("data-val");
		var this_city_name=$(this).find("a").text();
		//console.log(this_city_name);return;
		$.post("/front/user/editcity",{cityId:this_city,cityName:this_city_name},function (data) {
            if (data.status > 0){
                //$(".select-title").text(name);
                //$("#city").val(id);
                window.location.reload();
            }
        })
   
		/*//分页
		paginate(this_city,n_page,p_num,'','');
		//地图搜索
		//loading_map(12,{"name":"city_id","value":this_city});
		map_obj.show_community({"name":"city_id","value":this_city});*/

	});
	
//房间租住类型筛选
	$(".rent_type_select li").on("click",function(){
		var now_city=$('#now_city').val();
		var this_rent_type=$(this).find("a").attr("data-val");
		paginate.init(now_city,n_page,p_num,'',{"name":"rent_type","value":this_rent_type});
		//地图搜索
		//loading_map(12,{"name":"rent_type","value":this_rent_type});
		map_obj.show_community({"name":"rent_type","value":this_rent_type});
	});
//房间户型筛选	
	$(".room_counts li").on("click",function(){
		var now_city=$('#now_city').val();
		var this_room_count=$(this).find("a").attr("data-val");
		paginate.init(now_city,n_page,p_num,'',{"name":"room_count","value":this_room_count});
		//地图搜索
		//loading_map(12,{"name":"room_count","value":this_room_count});
		map_obj.show_community({"name":"room_count","value":this_room_count});
		
	});
//房间租金筛选	
	$(".room_prices li").on("click",function(){
		var now_city=$('#now_city').val();
		var this_room_price=$(this).find("a").attr("data-val");
		paginate.init(now_city,n_page,p_num,'',{"name":"price","value":this_room_price});
		//地图搜索
		//loading_map(12,{"name":"price","value":this_room_price});
		map_obj.show_community({"name":"price","value":this_room_price});
	});
//更多筛选	
	$(".more_search").on("click",function(){
		//alert(12121);
		var now_city=$('#now_city').val();
		paginate.init(now_city,n_page,p_num,'','');
		//地图搜索
		//loading_map(12,{"name":"more","value":""});
		map_obj.show_community({"name":"more","value":""});
	});	
	
//区域，商圈，小区名，模糊搜索
	$(".searchBtn").on("click",function(){
		var now_city=$('#now_city').val();
		paginate.init(now_city,n_page,p_num,'','');
		//地图搜索
		//loading_map(12,{"name":"more","value":""});
		map_obj.show_community({"name":"more","value":""});
		
	});	

//区域，商圈，小区名，模糊搜索回车事件	
	$('.search').keyup(function(e){
	  if(e.keyCode == '13'){
	    var now_city=$('#now_city').val();
		paginate.init(now_city,n_page,p_num,'','');
		//地图搜索
		//loading_map(12,{"name":"more","value":""});
		map_obj.show_community({"name":"more","value":""});
	    
	  }
    });	
	
});