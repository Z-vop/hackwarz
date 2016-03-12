
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



var usermap = new Map();

var password = "minty33"

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});



io.on('connection', function(socket){

    // A new user has connected
    var username = "";
    var score = 0; // The gamer's score
    var budget = 0; // The gamer's 'security budget'
    console.log('A user connected. Socket #' + socket.id);
    socket.emit('chat_message', 'SYSTEM: Welcome to Mega Corp. Please login using /user [name]');

    setInterval(function() {
        score += 10;
        socket.emit('score', score);
    }, 1000);

    socket.on('disconnect', function(){
        console.log('User disconnected: ' + (username == "" ? socket.id : username));
    });

    socket.on('chat_message', function(msg){
        // Don't allow user to continue until they identify themselves
        if(username == "" && msg.startsWith("/name") == false) {
            socket.emit("chat_message", "SYSTEM: Please login.");
            return;
        }

        // is the message a command?
        if(msg.startsWith('/')) {
            // is it the /name command?
            // The string will be: /name username
            if(msg.startsWith('/name ')) {
                username = (msg.substring(msg.indexOf(" ")));
                socket.emit('chat_message', "SYSTEM: Login successful.");
            }
            // Is it the /score command?
            // TODO: Don't require a score command -- just update the score periodically
            if(msg == "/score") {
                io.emit('score', score);
            }

            if (msg.startsWith('/color')){

            }

            if(msg.startsWith('/help')) {
                io.emit('chat_message', "Staff Help" + ': ' + "1) /name:" +
                    " assign your name after typing /name ");
                io.emit('chat_message', "Staff Help" + ': ' + "2)/score:" +
                    " type /score and hit return to get your score");
            }

            if(msg.startsWith('/admin')){


            }

        } else {
            //Its not a command, just send out the message to everyone
            io.emit('chat_message', username + ': ' + msg);
        }

    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

