var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var booth = getQueryVariable('booth');
console.log(name+' wants to join '+booth);
socket.on('connect', function () {
	console.log('Conncted to socket.io server!');
	socket.emit('joinBooth', {
		name: name,
		booth: booth
	});
});

jQuery('.booth').text('Welcome '+name+' to the chat '+booth);	

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	console.log('New message:');
	console.log(message.text);
	var $messages = jQuery('.messages'); 
	var $message = jQuery('<li class = "list-group-item"></li>');
	$message.append('<p><strong>' + message.name + ' '+ momentTimestamp.local().format('h:mm a') + ':'+message.text+'</strong><p>');
	$message.append('<p>' +message.text+ '</p>')
	$messages.append($message);
	//jQuery('.messages').append('<p><strong>' + momentTimestamp.local().format('h:mm a') + ': </strong>' + message.text + '</p>');
});


var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		text: $message.val(),
		name: name
	});

	$message.val('');
});