var app = require('express')();
var http = require('http').Server(app);

 //None of this is being used by filetesting.html

 var io = require('socket.io')(http);

 var Datastore = require('nedb'), db = new Datastore({ filename: 'db/hackwarzdata.nedb', autoload: true });
 // Load up our objects
 var User = require('./lib/User');
 var Node = require('./lib/Node');
 var Connection = require('./lib/Connection');
 var Network = require('./lib/Network');



 var amountofusers = 0;

 function nodeswithlines(n1,n2){
 var connectnumber = 0;
 if(addednodes[i].id == n1){n1node = addednodes[i]}
 if(addednodes[i].id == n2){n2node = addednodes[i]}
 if(connectnumber == 2){connectNodes(n1node,n2node)}
 }

 io.on('connection', function(socket){
 amountofusers++;
 console.log(amountofusers);
 for(i=0;i<amountofusers.length;i++){

 }
 // Instance variables
 var isLoggedIn = false; // After the user has logged in, this is true
 var user = null;        // Holds the User object

 // Utility function to just make writing output easier
 function write(text){
 socket.emit('message', text);
 }

 // A new user has connected
 console.log('A user connected. Socket #' + socket.id);
 write("Welcome to Hackwarz. Please login using /user [name]");

 socket.on('message', function(msg) {

 // parse the command arguments into an array for easy access.
 var argv = [];                          // argv[0] is the command itself.
 argv = msg.split(' ');
 console.log(argv);

 // Don't allow user to continue until they identify themselves

 }); // end-on message

 socket.on('connect', function(msg) {
 console.log('hi');
 });

 socket.on('chat', function(msg) {
 });

 // When user disconnects, save the user information in the database
 socket.on('disconnect', function () {

 }); // end on disconnect


 }); // End -- on.socket


http.listen(3333, function(){
    console.log('listening on *:3333');
});

// This just serves up the web game UI
app.get('/', function(req, res){
    res.sendFile(__dirname + '/filetesting.html');
});

app.get("/hw_graphics.js", function(req, res){
    res.sendFile(__dirname + "/hw_graphics.js");
});


