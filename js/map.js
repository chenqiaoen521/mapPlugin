/**百度地图控件 by 武哲*/
var o = (function(){
  var classes = {
    linerClass : '.hook-liner',//  公交  开车 出行
    subMark: '.sub', //  公交  地铁 标注
    go: '.hook-map-go' // 到哪去
  }
  var map_obj = {
    init: function (lng,lat) {
        var _this = this;
        this.map = new BMap.Map("map");
        this.point = new BMap.Point("113.712382","34.792891");
        this.map.centerAndZoom(this.point,17); 
        var marker = new BMap.Marker(_this.point,{enableMassClear:true});
        marker.setAnimation(BMAP_ANIMATION_BOUNCE);
        this.transitr = new BMap.TransitRoute(this.map,{policy:BMAP_DRIVING_POLICY_LEAST_DISTANCE,renderOptions: {map: _this.map,autoViewport:true}});
        this.drivingr = new BMap.DrivingRoute(this.map,{policy:BMAP_DRIVING_POLICY_LEAST_DISTANCE,renderOptions: {map: _this.map,autoViewport:true}});
        this.walkr = new BMap.WalkingRoute(this.map,{policy:BMAP_DRIVING_POLICY_LEAST_DISTANCE,renderOptions: {map: _this.map}});
        this.localSearch = new BMap.LocalSearch(this.map,{renderOptions: {map: _this.map,autoViewport:true,selectFirstResult:false}});
        this.map.addOverlay(marker);
        this.map.enableScrollWheelZoom();  // 开启鼠标滚轮缩放
        this.map.enableKeyboard();         // 开启键盘控制
        this.map.enableContinuousZoom();   // 开启连续缩放效果
        this.map.enableInertialDragging(); // 开启惯性拖拽效果
    },
    //获取搜索的数据
    main: function(name,radius,cla,img) {
      var _this = this;
      this.localSearch.setSearchCompleteCallback(function (results) {
          if($("#sa_0_result").length) {
            $("#sa_0_result").empty();
          } else {
            $("#sa_0_ul").empty();
          }
          _this.map.clearOverlays();
          var str = "";
          // 判断状态是否正确
          if (_this.localSearch.getStatus() == BMAP_STATUS_SUCCESS) {
            str += "<ul id='sa_0_ul' class=''>";
            for (var i = 0; i < results.getCurrentNumPois(); i ++){
              str += "<li>" +
                    "<div class=\"meter\">" +
                    parseInt(_this.map.getDistance( _this.point, results.getPoi(i).point)) +
                    '米' +
                    "</div>"+
                    "<p class='name on-wrap' title='" +
                    results.getPoi(i).title +
                    "'>" +
                    "<a href='javescript::void(0);' class='labelC' name='" +
                    results.getPoi(i).address +
                    "," +
                    cla +
                    "' data-val=" +
                    results.getPoi(i).point.lat +
                    "-" +
                    results.getPoi(i).point.lng +
                    ">"+
                    results.getPoi(i).title +
                    "</a>" +
                    "</p>" +
                    "<p>" +
                    results.getPoi(i).title +
                    "</p>" +
                    "</li>";
            }
          }
          str += "</ul>";
          if($("#sa_0_result").length) {
            $("#sa_0_result").replaceWith(str);
          } else {
            $("#sa_0_ul").replaceWith(str);
          }
      })
      this.localSearch.searchNearby(name,this.point,radius);
      this.localSearch.setMarkersSetCallback(function (result) {
        _this.map.clearOverlays();
        _this.showMarkes(true);
        for (var i = 0; i < result.length; i ++){
          _this.showMarkes(false,result[i].point, img);
        }
      })
    },
    //添加冒泡事件
    info: function (nam,tit,adress,point) {
        var html  ="<div style=\"box-sizing: content-box; width: 230px; height: 55px; position: absolute; left: 16px; top: 16px; z-index: 10; overflow: hidden;\">" +
            "<div class=\"BMap_bubble_title\" style=\"overflow: hidden; height: auto; line-height: 24px; white-space: nowrap; width: auto;\"><p style=\"width:210px;font:bold 14px/16px arial,sans-serif;margin:0;color:#cc5522;white-space:nowrap;overflow:hidden; text-overflow: ellipsis\" title=\"" +
            nam +
            "\">" +
            nam +
            "</p></div>" +
            "<div class=\"BMap_bubble_content\" style=\"width: auto; height: auto;\"><div style=\"font:12px arial,sans-serif;margin-top:10px\">" +
            "<table cellspacing=\"0\" style=\"overflow:hidden;table-layout:fixed;width:100%;font:12px arial,sans-serif\"><tbody><tr><td style=\"vertical-align:top;width:38px;white-space:nowrap;word-break:keep-all\">" +
            tit +
            ":</td><td style=\"line-height:16px\">" +
            adress +
            "&nbsp;</td></tr></tbody></table>" +
            "</div></div>" +
            "<div class=\"BMap_bubble_max_content\" style=\"display:none;position:relative\"></div></div>"
        var opts = {
            offset:new BMap.Size(0, 0)
        }
        var infoWindow = new BMap.InfoWindow(html, opts);
        this.map.openInfoWindow(infoWindow,new BMap.Point(point[1],point[0]));
    },
    //输入提示
    hint: function () {
        var _this = this;
        var hint = {
            "input" : "address",
            "location" : _this.map
        }
        var ac = new BMap.Autocomplete(hint);
        ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
            var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            $("#searchResultPanel").innerHTML = str;
        });

        var myValue;
        ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            $("#searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
            $("#searchResultPanel").empty();
        });

        var local = new BMap.LocalSearch(this.map, { //智能搜索
            //onSearchComplete: myFun
        });
        local.search(myValue);
    },
    //公交行程规划
    transit: function (start,end,policy) {
        var _this = this;
        this.transitr.setLocation('郑州市');
        this.transitr.setPolicy(BMAP_TRANSIT_POLICY_LEAST_WALKING);
        this.transitr.enableAutoViewport();
        this.transitr.search(start, end);
        this.transitr.setSearchCompleteCallback(function (results) {
            if ( _this.transitr.getStatus() == BMAP_STATUS_SUCCESS){
                var firstPlan = results.getPlan(0);
                _this.map.clearOverlays();
                console.log(firstPlan.getRoute(1));
                _this.drawing(results,firstPlan,'green','#0030ff','BUS');
                _this.makeHtml(results,'乘公共交通工具前往终点的路线','BUS','green','#0030ff');

            }else{
                alert('请重新规划路线');
            }

            console.log(results);
        })
    },
    //在地图上画路线
    drawing: function (results,plan,walkcolor,buscolor,type) {
      // 绘制步行线路
      var sol = "dashed";
      if (type == 'CAR'){
          walkcolor = buscolor;
          var sol = "solid"
      }
      for (var i = 0; i < plan.getNumRoutes(); i++){
          var walk = plan.getRoute(i);
          if (walk.getDistance(false) > 0){
              // 步行线路有可能为0
              console.log(walk.getDistance(true));
              this.map.addOverlay(new BMap.Polyline(walk.getPath(), {strokeStyle:sol,strokeColor: walkcolor,strokeOpacity:0.75,strokeWeight:6,enableMassClear:true}));
          }
      }
      // 绘制机动车线路
      if (type == 'BUS'){
          for (i = 0; i < plan.getNumLines(); i++){
              var line = plan.getLine(i);
              if (line.type == BMAP_LINE_TYPE_BUS){
                  //上车
                  this.markes(line.getGetOnStop().point,2,2,line.getGetOnStop().title);
                  //下车
                  this.markes(line.getGetOffStop().point,2,2,line.getGetOffStop().title);
              }else if (line.type == BMAP_LINE_TYPE_SUBWAY){
                  this.markes(line.getGetOnStop().point,2,3,line.getGetOnStop().title);
                  this.markes(line.getGetOffStop().point,2,3,line.getGetOffStop().title);
              }
              this.map.addOverlay(new BMap.Polyline(line.getPath(), {strokeColor: buscolor,strokeOpacity:0.45,strokeWeight:6,enableMassClear:true}));
          }
      }
      this.markes(results.getStart().point,1,0);
      this.markes(results.getEnd().point,1,1);
    },

    //在地图上画起终点
    markes: function (point,imageType,index,title) {
      var url;
      var width;
      var height;
      var _this = this;
      if (imageType == 1){
          url   = "http://map.baidu.com/image/dest_markers.png";
          width = 42;
          height= 34;
          myIcon = new BMap.Icon(url,new BMap.Size(width, height),{anchor: new BMap.Size(14, 32),imageOffset: new BMap.Size(0, 0 - index * height)});
      }else{
          url = "http://map.baidu.com/image/trans_icons.png";
          width = 22;
          height = 25;
          var d = 25;
          var cha = 0;
          var jia = 0
          if(index == 2){
              d = 21;
              cha = 5;
              jia = 1;
          }
          myIcon = new BMap.Icon(url,new BMap.Size(width, d),{anchor: new BMap.Size(10, (11 + jia)),imageOffset: new BMap.Size(0, 0 - index * height - cha)});
      }
      var marker = new BMap.Marker(point, {icon: myIcon});
      if(title != null && title != ""){
          marker.setTitle(title);
      }
      // 起点和终点放在最上面
      if(imageType == 1){
          marker.setTop(true);
      }
      this.map.addOverlay(marker);
    },
    //拼接Html
    makeHtml: function (results,title,type,busColor,walkColor) {
      var _this = this;
      $('#r-result').empty();
      var str    = '';
      var h = $("<h1 class=\"h1\"></h1>");
      h.text(title);
      for(var index = 0; index < results.getNumPlans(); index++){
          var id  = "collapseThree" + index;
          var href= "#collapseThree" + index;
          mapPlan = results.getPlan(index);
          var distence = (parseInt(mapPlan.getDistance(false)) / 1000) + "公里";
          var time     = mapPlan.getDuration();
          str +=  "<div data-val=\""+
              index +
              "\"class=\"card\">";
          str +=  "<div class=\"card-header\">";
          str +=  "<div class=\"collapsed card-link\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=" + href + ">";
          if (type == 'BUS'){
              var numLin = mapPlan.getNumLines();
              var bus    = '';
              var walkLin    = mapPlan.getNumRoutes();
              var walkdis    = 0;
              for (var z = 0; z < walkLin; z++){
                  walkdis += parseInt(mapPlan.getRoute(z).getDistance(false));
              }
              walkdis = "步行" + (walkdis / 1000) + "公里";
              for (var i=0; i<numLin; i++){
                  bus += mapPlan.getLine(i).title;
                  bus += '->';
              }
              var bus = bus.slice(0,-2);
              str += "<p class=\"sub-tit-small\">";
              str += bus;
              str += "</p>";
              str += "<p>";
              str += distence;
              str += " | ";
              str += time;
              str += " | ";
              str += walkdis;
              str += "</p>";
              str += "</div>";
              str += "</div>";
              if (index == 0){
                  str += "<div id=\""+
                      id +
                      "\"class=\"collapse show\">";
              }else{
                  str += "<div id=\""+
                      id +
                      "\"class=\"collapse\">";
              }

              str += "<div class=\"card-block\">";
              str += "<p class=\"sub-cont-p\"><i class=\"fa fa-circle-thin green\"></i>起点</p>";
              for (j = 0,wj = 0;j < mapPlan.getNumLines();j++){
                  var line=mapPlan.getLine(j);
                  var title=line.title.replace(/\([\s\S]*$/,"");
                  if(line.type==BMAP_LINE_TYPE_BUS&&/^\d+$/.test(title)){
                      title+="路";
                  }
                  //linesTitle += "→" +title;
                  str += this.walkHtml(mapPlan.getRoute(wj++),line.getGetOnStop().title);
                  var typeName=line.type==BMAP_LINE_TYPE_BUS&&"公交车"||line.type==BMAP_LINE_TYPE_SUBWAY&&"地铁"||line.type==BMAP_LINE_TYPE_FERRY&&"渡轮";
                  str += "<p class=\"sub-cont-p\"><i class=\"fa fa-bus\"></i>";
                  str += "乘坐";
                  str += typeName;
                  str += title;
                  str += ', ';
                  str += '经过';
                  str += line.getNumViaStops();
                  str += '站， ';
                  str += "到达";
                  str += line.getGetOffStop().title;
              }
              str  += this.walkHtml(mapPlan.getRoute(wj++),results.getEnd().title);
              str  += "<p class=\"sub-cont-p\"><i class=\"fa fa-circle-thin red\"></i>终点</p>";
              str  += "</div>";
              str  += "</div>";
              str  += "</div>";
          }else if (type == 'WALK'){

          }else{
              str += "<p class=\"sub-tit-small\">";
              str += "驾车前往";
              str += results.getEnd().title;
              str += "</p>";
              str += "<p>";
              str += distence;
              str += " | ";
              str += time;
              str += "</p>";
              str += "</div>";
              str += "</div>";
              if (index == 0){
                  str += "<div id=\""+
                      id +
                      "\"class=\"collapse show\">";
              }else{
                  str += "<div id=\""+
                      id +
                      "\"class=\"collapse\">";
              }
              str += "<div class=\"card-block\">";
              str += "<p class=\"sub-cont-p\"><i class=\"fa fa-circle-thin green\"></i>起点</p>";
              for (var j=0;j<mapPlan.getNumRoutes();j++){
                  var line = mapPlan.getRoute(j);
                  for (var i = 0; i < line.getNumSteps(); i++ ){
                      var route = line.getStep(i);
                      console.log(route);
                      str += "<p class=\"sub-cont-p\"><i class=\"fa fa-bus\"></i>";
                      str += route.getDescription(false);
                  }
                  str  += "<p class=\"sub-cont-p\"><i class=\"fa fa-circle-thin red\"></i>终点</p>";
                  str  += "</div>";
                  str  += "</div>";
                  str  += "</div>";
              }
          }
      }
      $('#r-result').on('click',".card",function () {
          var i = $(this).attr('data-val');
          var cas = $("#collapseThree" + i).attr('class');
          if (cas == "collapse show"){
              return false;
          }
          var plan = results.getPlan(i);
          _this.map.clearOverlays();
          if (type == undefined){
              type = 'BUS';
          }
          _this.drawing(results,plan,'green','#0030ff',type);
      })
      $('#r-result').append(h);
      $("#r-result").append("<div id=\"accordion\"></div>");
      $('#r-result').find("#accordion").append(str);
    },
    //步行
    walkE: function (start,end,policy) {
        var _this = this;
        this.walkr.enableAutoViewport();
        this.walkr.setSearchCompleteCallback(function (results) {
            console.log(results);
            if (_this.walkr.getStatus() == BMAP_STATUS_SUCCESS){
                console.log(results);
                var firstPlan = results.getPlan(0);
                _this.map.clearOverlays();
                _this.drawing(results,firstPlan,'green','#0030ff','WALK');
                _this.makeHtml(results,'步行前往终点的路线','WALK');
            }else{
                alert("请重新选择");
            }
        })
        this.walkr.search(start,end);
    },
    //驾车
    driving: function (start,end,policy) {
      var _this = this;
      this.drivingr.search(start,end);
      this.drivingr.setSearchCompleteCallback(function (results) {
          if (_this.drivingr.getStatus() == BMAP_STATUS_SUCCESS){
              _this.map.clearOverlays();
              _this.makeHtml(results,'驾车前往终点的路线','CAR','#0030ff','gerrn');
          }else{
              alert("请重新选择");
          }
      })
    },
    walkHtml: function (walkroute,title) {
      var str = ' ';
      if (walkroute.getDistance(false) > 100){
          str += "<p class=\"sub-cont-p\"><i class=\"fa fa-blind\"></i>";
          str += "步行约";
          str += walkroute.getDistance(true);
          str += ", 到达";
          str += title;
      }
      return str;
    },
    //在地图上画标注
    showMarkes: function (addPoint,point,img) {
     if (addPoint){
       var marker = new BMap.Marker(this.point,{enableMassClear:true});
       this.map.addOverlay(marker);
     }else{
       var myIcon = new BMap.Icon(img,new BMap.Size(25, 35));
       var markers = new BMap.Marker(point, {icon: myIcon});
       this.map.addOverlay(markers);
     }
    },
    initEvent: function () {
      var _this = this;
      $(document).on('click',classes.linerClass, function () {
        var flag = _this.isQiDian;
        var name = $(this).attr('name');
        var start,end;
        console.log(flag == undefined || flag == 0)
        console.log(flag == 1)
        if (flag == undefined || flag == 1){
          start = _this.point;
          end   = $('.input').val(); 
        }else if (flag == 0){
          start = $('.input').val();
          end   = _this.point;
        }
        if (name == 'BUS'){
            _this.transit(start,end);
        }else if (name == 'CAR'){
            _this.driving(start,end);
        }else{
            _this.walkE(start,end);
        }
      })
      $(".station.sa_sta").on('click',classes.subMark,function (e) {
        e.preventDefault();
        $(this).addClass('on');
        $(this).siblings().removeClass('on');
        var text = $(this).text();
        var cla  = $(this).attr('data-name');
        if (text == '地铁站'){
          _this.main(text, 20000, cla, '../img/subway.png');
        }else{
          _this.main(text, 500, cla, '../img/bus.png');
        }
      })
      $("#sa_0").on('click','.labelC', function () {
        $(this).parent().parent().addClass('on');
        $(this).parent().parent().siblings().removeClass('on');
        var nam   = $(this).text();
        var adress= $(this).attr('name');
        var point = $(this).attr('data-val');
            point = point.split('-');
            adress= adress.split(',');
        if (adress[1] == 'icon-subway' || adress[1] == 'sub'){
            var tit   = '车次';
        }else{
            var tit   = '地址';
        }
        map_obj.info(nam,tit,adress[0],point);
      })
      $(".station.bord").on('click', classes.go ,function () {
        var val = $(this).data('id');
        $(this).addClass('on');
        $(this).siblings().removeClass('on');
        _this.isQiDian = val;
      })
    }
  }
  return map_obj
})()
o.initEvent();
window.map_obj === undefined && (window.map_obj = o);