var connection
window.addEventListener("load", function () {

	$('#connect').on('click',function(){
		connect();
	})

	$('#send').on('click',function(){
		sendMessage();
	})

	$('#message').on('keyup',function(e){
		if(e.keyCode == 13){
			sendMessage();
		}
	})

	$('#nickname').on('keyup',function(e){
		if(e.keyCode == 13){
			connect();
		}
	})

	connect = function(){
		var nickname = $('#nickname');
		if(nickname.val() && nickname.val().trim().length > 1){
			connectSocket(nickname.val().trim());
			$('.start-screen').hide();
			$('.chat-screen').css('display','inline-block');
		}else{
			alert('please enter a nickname');
		}
	}

	sendMessage = function(){
		var chatMessage = $('#message').val();
		if(chatMessage && chatMessage.trim().length > 0){
			connection.send(JSON.stringify({nickname: chatNickname, message: chatMessage.trim()}));
			$('#output').append($('<p>',{'class': 'you', text: '['+chatNickname+'] '+chatMessage.trim()}));
			$('#message').val('');
		}
	}


	connectSocket = function(nickname){	
		if (nickname) {
			connection = new WebSocket("ws://localhost:11171");
			connection = new WebSocket("ws://159.253.139.138:11171");
			connection.onopen = function () {
				chatNickname = nickname;
				connection.send(JSON.stringify({nickname: nickname, message: '<b>joined the chat</b>'}));
			}
			connection.onclose = function () {
				console.log("Connection closed")
			}
			connection.onerror = function () {
				console.error("Connection error")
			}
			connection.onmessage = function (event) {
				var recievedMessage = JSON.parse(event.data);
				if(recievedMessage.connections){
					$('#connections').text(recievedMessage.connections);
				}

				if(recievedMessage.chatData && recievedMessage.chatData){
					$('#output').append($('<p>',{'class' : 'other', html: '['+recievedMessage.chatData.nickname+'] '+recievedMessage.chatData.message}));
				}

				if(recievedMessage.nicknames){
					$('#nicknames').empty();
					recievedMessage.nicknames.forEach(function(nickname){
						$('#nicknames').append($('<li>', {text: nickname}));
					});
				}
			}
		}
	}

	
})