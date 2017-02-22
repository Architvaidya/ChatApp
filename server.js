var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function getCurrentUsers(socket){
	var info = clientInfo[socket.id];
	//console.log(info);
	var users = [];
	if(typeof info === 'undefined'){
		return;
	}else{
		Object.keys(clientInfo).forEach(function(socketId){
			var userInfo = clientInfo[socketId];
			if(userInfo.room === info.room){
				users.push(userInfo.name);
			}
		});

		socket.emit('message', {
			text: 'Current Users: '+users.join(', '),
			timestamp: moment().valueOf(),
			name: 'System'
		});
	}
}

io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('disconnect', function(){
		
		var userData = clientInfo[socket.id];
		//console.log(userData);
		if(typeof userData !== 'undefined'){
			socket.leave(userData.booth);
			
			io.to(userData.booth).emit('message' ,{
				text: userData.name + " has left",
				timestamp: moment().valueOf(),
				name: 'System'
			});
			delete clientInfo[socket.io];
			
		}
	});

	socket.on('joinBooth', function(req){

		clientInfo[socket.id] = req;
		//console.log(clientInfo[socket.id]);
		socket.join(req.booth);
		socket.broadcast.to(req.booth).emit('message', {
			text: req.name +' has joined the booth '+req.booth,
			timestamp: moment().valueOf(),
			name: 'System'
		});
	});

	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);
		if(message.text === '@currentUsers'){	
			getCurrentUsers(socket);
		}else{
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].booth).emit('message', message);	
		}


		
		//io.emit('message', message);
	});

	// timestamp property - JavaScript timestamp (milliseconds)

	socket.emit('message', {
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf(),
		name: 'System'
	});
});

http.listen(PORT, function () {
	console.log('Server started!');
});