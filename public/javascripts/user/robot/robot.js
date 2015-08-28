$(function() {
	$('.J-sub-url').click(function() {
		var url = $('.J-url').val();
		$.ajax({
			url: '/api/user/robot/add-url',
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