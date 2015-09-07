$(function(){
	$('.J-img-name').hover(function(){
		var url = $(this).attr('data-url');
		var infoList = $(this).parent().find('.image-info');
		
		infoList.css('display', 'inline-block');
		infoList.html('请等待...抓取中...');
		
		$.ajax({
			url: '/api/user/control/get-image-info',
			type: 'POST',
			dataType: 'json',
			data: {url: url},
			success: function(data) {
				if (data.code) {
					alert(data.msg);
					console.log(data.msg);
					return;
				}
				var html = '<li class="list-group-item">源地址: '+ url +'</li><li class="list-group-item">网页title '+ data.data.title +'</li><li class="list-group-item">网页keyword '+ data.data.keyword +'</li><li class="list-group-item">网页description '+ data.data.description +'</li>';
				infoList.html(html); 
			}
		});
		
	}, function(){
		$(this).parent().find('.image-info').html('');
		$(this).parent().find('.image-info').css('display', 'none');
	});
	
	$('.J-delete-all-image').click(function() {
		$.ajax({
			url: '/api/user/control/delete-all-image',
			type: 'POST',
			dataType: 'json',
			success: function(data) {
				if (data.code) {
					alert(data.msg);
					console.log(data.msg);
					return;
				}
			}
		});
	});
	
	$('.J-delete-image').click(function() {
		var id = $(this).attr('data-id');
		$.ajax({
			url: '/api/user/control/delete-image',
			type: 'POST',
			dataType: 'json',
			data: {id: id},
			success: function(data) {
				if (data.code) {
					alert(data.msg);
					console.log(data.msg);
					return;
				}
			}
		});
	});
	
});