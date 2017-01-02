/** This is the main Hackwarz program */

// Load required libraries
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Datastore = require('nedb'), db = new Datastore({ filename: 'db/hackwarzdata.nedb', autoload: true });


// Load up our objects
var User = require('./lib/User');


// When a user connects, everything in this function is called per user/socket
io.on('connection', function(socket){

    // Instance variables
    var isLoggedIn = false; // After the user has logged in, this is true
    var user = null;        // Holds the User object

    // Utility function to just make writing output easier
    function write(text){
        socket.emit('chat_message', text);
    }

    // A new user has connected
    console.log('A user connected. Socket #' + socket.id);
    write("SYSTEM: Welcome to Hackwarz. Please login using /user [name]");

    socket.on('chat_message', function(msg) {

        // Don't allow user to continue until they identify themselves
        if(!isLoggedIn) {

            // The /name command allows a user to log in
            if (msg.startsWith('/name ') || msg.startsWith('/user ')) {
                // Extract and validate the entered user name
                var u = (msg.substring(msg.indexOf(" ")+1));
                /* Username must be one or more letters and numbers */
                var patt = /[a-z0-9]+/;
                if(!patt.test(u)) {
                    socket.emit('error_message', "SYSTEM: Invalid user name, please use letters and digits only.");
                    return;
                }

                // Look up user in db, if found set the user object
                db.find({name: u}, function (err, docs) {
                    if (docs.length > 0) {
                        console.log("Found user in DB, length: " + docs.length);
                        user = new User(docs[docs.length - 1]);
                        write("SYSTEM: Welcome back.");
                    } else {
                        /* A new user name */
                        console.log("No user found in DB");
                        user = new User();
                        user.name = u;
                        user.level = 1;
                    }
                    // We are logged in
                    isLoggedIn = true;
                    write("SYSTEM: Login successful.");
                }); // end db.find
            } else {
                write("Please login.");
            }
            return;
        }

        // is the message a command?
        if(msg.startsWith('/')) {

            if (msg.startsWith('/name') || msg.startsWith('/user')) {
                write("SYSTEM: already logged in.");
            }
            if (msg.startsWith('/password ')){
                var pw = (msg.substring(msg.indexOf(" ")+1));
                user.password = pw;
            }
            if (msg.startsWith('/logout')){
                logOut();
            }
        } else {
            // Not a command, just send out the message to everyone
            io.emit("chat_message", user.name + ': ' + msg);
        }
    }); // end-on chat_message

    // When user disconnects, save the user information in the database
    socket.on('disconnect', function () {
        if (isLoggedIn) {
            console.log('User disconnected: ' + (user.name == "" ? socket.id : user.name));
            logOut();
        } else {
            console.log('User disconnected: ' + socket.id);
        }
    }); // end on disconnect

    function logOut() {
        if (user._id) {  // an ID can only be here if we read in the user from the DB
            console.log("Updating user info in DB");
            db.update({_id: user._id}, user, {}, function (err, numReplaced) {
            });
        } else {
            console.log("Writing user info to DB");
            db.insert(user, function (err, newDoc) {
                console.log(newDoc);
            });
        }
        isLoggedIn = false;
        user = null;
        write ("SYSTEM: User logged off.");
    }

    // Repeating function to count money, etc.
    setInterval(function () {
        if (isLoggedIn) {
            // Update coins, and update the UI with coins and the user level
            user.coins += Math.pow(user.level, 1.7) / 100;
            socket.emit('bitcoins', user.coins);
            socket.emit('level', user.level);
        }
    }, 1000);

}); // End -- on.socket

http.listen(3000, function(){
    console.log('listening on *:3000');
});

// This just serves up the web game UI
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});



