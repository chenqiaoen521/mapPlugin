$(document).delegate(".img-lists > img",'click',function(e){
	//console.log($(this)[0].src);
	var pic_src=$(this)[0].src;
	if(pic_src !=""){
		parent.layer.open({
			type: 1,
			title: '查看图片',
			shadeClose: true,
			//shade: true,
			//maxmin: false, //开启最大化最小化按钮
			maxWidth:"700px",
			area: 'auto',
			content: "<img src=\""+pic_src+"\" width=\"100%\" />"
		});
	}
	
});
