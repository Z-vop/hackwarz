/**
 * Created by cameron on 3/5/16.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('A user connected. Socket #' + socket.id);
    socket.on('disconnect', function(){
        console.log('A user disconnected. Socket #' + socket.id);
    });
    socket.on('chat_message', function(msg){
        if(msg == "/score") {
            io.emit('score', 123);
        }
        console.log('message: ' + msg);
        io.emit('chat_message', socket.id + ': ' + msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});