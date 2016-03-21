//variabes needed for starting the webstie
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Datastore = require('nedb')
    , db = new Datastore({ filename: 'db/hackwarzdata.nedb', autoload: true });

// This just serves up the web game UI
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});




//things that happen when the user connects to the website
io.on('connection', function(socket){


    // the code that detects when the user has connected and does the gameplay
    socket.on('chat message', function(msg){

        var username = "";

        //code to write back to the user what has been typed
        if (msg){
            socket.emit('chat_message', msg);
        }


        //funcitions that i want to start
        login();




        //loging in or signinp up
        function login(){

            //tell the user to signup or login
            sleep("Type 'signin' to access your account", 0);

            sleep("or type 'signup' to create your account", 3500);


        }



        //tool used for making things sleep
        function sleep(text, time){

            setTimeout(function(){socket.emit('chat_message', text)}, time);
        }




        // all the missions after they signup
        function level1(){}

        function level2(){}

        function level3(){}

        function level4(){}


    });








});





http.listen(3000, function(){
    console.log('listening on *:3000');
});

