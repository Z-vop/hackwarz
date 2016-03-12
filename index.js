/**
 * Created by cameron on 3/5/16.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);



var usermap = new Map();

var password = "minty33"

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});



io.on('connection', function(socket){

    var folder = "hacks, firewall, money";

    var username = "";

    console.log('A user connected. Socket #' + socket.id);

    socket.emit('chat_message', 'SYSTEM: Welcome to Mega Corp. Please login using /user [name]');

    socket.on('disconnect', function(){



        if (username == "") {
            console.log('A user disconnected. Socket #' + socket.id);
        } else{
            console.log('A user disconnected. Socket #' + username);
        }
    });


    socket.on('chat_message', function(msg){



        if(username == "" && msg.startsWith("/name") == false) {
            socket.emit("chat_message", "SYSTEM: Please login.");
            return;

        }



        // is the message a command?
        if(msg.startsWith('/')) {
            // is it the /name command?
            // The strong will be: /name username
            if(msg.startsWith('/name ')) {
                username = (msg.substring(msg.indexOf(" ")));
                socket.emit('chat_message', "SYSTEM: Login successful.");

            }
            // Is it the /score command?
            if(msg == "/score") {
                io.emit('score', 123);
            }

            if (msg.startsWith('/color')){

            }

            if(msg.startsWith('/help')) {
                socket.emit('chat_message', "Staff Help" + ': ' + "1) /name:" +
                    " assign your name after typing /name ");
                socket.emit('chat_message', "Staff Help" + ': ' + "2)/score:" +
                    " type /score and hit return to get your score");
            }

            if(msg.startsWith('/folder')){
                socket.emit('chat_message', username + "'s" + "folder" + folder);


            }

        } else {
            //Its not a command, just send out the message
            console.log(username + "'s " +'message: ' + msg);
            io.emit('chat_message', username + ': ' + msg);
        }

    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

