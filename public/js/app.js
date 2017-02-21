var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var cabin = getQueryVariable('cabin');
console.log(name+' wants to join '+cabin);
socket.on('connect', function () {
	console.log('Conncted to socket.io server!');
});

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	console.log('New message:');
	console.log(message.text);
	var $message = jQuery('.messages');
	$message.append('<p><strong>' + message.name + ' '+ momentTimestamp.local().format('h:mm a') + ':'+message.text+'</strong><p>');
	//$message.append('<p>' +message.text+ '</p>')
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