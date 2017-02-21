var socket = io();
socket.on('connect',function(){
	console.log('Connected to server');

});

socket.on('message', function(message){
	console.log('Message recieved: '+message.text);
	jQuery('.messages').append('<p>' + message.text + '</p>');
});

var $form = jQuery('#message-form');
$form.on('submit', function(event){ 
	event.preventDefault(); //handle form submission on our own
	var $message = $form.find('input[name=message]'); ////Extracting the contents in the field <input type="text" name="message"/>
	socket.emit('message',{
		text : $message.val() 
	});

	$message.val('');
	
});