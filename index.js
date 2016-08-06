var express = require('express');
var route = require('./routes/route');
var path = require('path');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname,'/public')));
app.use('/',route);


var users = {};    //stores the connected socket clients
var sockets = {};  //stroes the connected sockets

io.on('connection',function(socket){
	console.log("one client connected");

	//listens to a login reuest from a client
	socket.on('register',function(data){
		if(users[data.username]!=undefined)
		{
			//send validation error
			socket.emit('username exists',{msg: data.username +' already in use please try a different username'});
		}
		else
		{
			//send the list of online users to the client just connected
			socket.emit('populateOnline',{users: users});
			users[data.username]={username: data.username,socketId: socket.id};
			sockets[socket.id]={socket: socket, username: data.username};
			console.log(users);
			//broadcast the newly connected client to all other connected clients 
			socket.broadcast.emit('updateUser',{username: data.username, socketId: socket.id});
		}		
	});

	//listens to a message from  client for another client
	socket.on('send private message',function(data){
		var receiverUsername = data.to;
		var receiverSocketId = users[receiverUsername].socketId;
		var senderUsername = data.from;
		//sending the message to the client its meant for
		sockets[receiverSocketId].socket.emit('receive private message',{from: senderUsername, message: data.message});
	});

	//listens to a PDF document from a client for another
	socket.on('send pdf',function(data){
		var receiverUsername = data.to;
		var receiverSocketId = users[receiverUsername].socketId;
		var senderUsername = data.from;
		//sending the PDF document to the client its meant for
		sockets[receiverSocketId].socket.emit('receive pdf',{from: senderUsername, file: data.file});
	});

	//listens to a image sent from a client for another 
	socket.on('send image',function(data){
		var receiverUsername = data.to;
		var receiverSocketId = users[receiverUsername].socketId;
		var senderUsername = data.from;
		//sending the image to the client its meant for
		sockets[receiverSocketId].socket.emit('receive image',{from: senderUsername, file: data.file});
	});

	//listens to a client disconnection
	socket.on('disconnect',function(){
		console.log("one client disconnected");
		if(sockets[socket.id])
		{
			var username = sockets[socket.id].username;
			delete users[username];
			delete sockets[socket.id];
			console.log(users);
			socket.broadcast.emit('removeUser',{socketId: socket.id, username: username});
		}
	});

});

server.listen(81,function(){
	console.log("server is listening on 81");
});

module.exports = app;