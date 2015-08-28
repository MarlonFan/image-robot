$(function() {
	$('.J-get-url').click(function(event) {
		var url = $('.J-url-val').attr('url');
		$.ajax({
			url: '/api/user/urlinfo/get-son-url',
			type: 'POST',
			dataType: 'json',
			data:{url:url},
			success: function(data) {
				if (data.code) {
					alert(data.msg);
					console.log(data.msg);
					return;
				}
				if (data.redirect.need) {
					window.location.href = data.redirect.url || window.location.href;
				}
			}
		});
	});
});

$(function() {
	var url = $('.J-url-val').attr('url');
	$('.J-get-img').click(function(event) {
		$.ajax({
			url: '/api/user/urlinfo/get-son-img',
			type: 'POST',
			dataType: 'json',
			data:{url:url},
			success: function(data) {
				if (data.code) {
					alert(data.msg);
					console.log(data.msg);
					return;
				}
				if (data.redirect.need) {
					window.location.href = data.redirect.url || window.location.href;
				}
			}
		});
	});
});