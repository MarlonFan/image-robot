$(function() {
	
	var socket = io.connect('http://localhost:3001');
	var clientId = null;
	socket.on('news', function (data) {		
		var width = ((data[1] - data[0]) / data[1]) * 100;
    	$('.J-jindu').width(width + '%');
		$('.J-number').text((data[1] - data[0]) + '/' + data[1]);
  	});
	  
	socket.on("client id", function(data) {
		clientId = data;
	});
	
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
	
	$('.J-start-download').click(function() {
		$.ajax({
			url: '/api/user/download-all-img?clientId='+ clientId,
			type: 'GET',
			dataType: 'json',
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
		})
	})
	
	$('.J-jindu').width(0 + '%');
});