/** This is the main Hackwarz program */

// Load required libraries
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Datastore = require('nedb'), db = new Datastore({ filename: 'db/hackwarzdata.nedb', autoload: true });

// Load up our objects
var User = require('./lib/User');
var Node = require('./lib/Node');
var Connection = require('./lib/Connection');
var Network = require('./lib/Network');

var network = new Network();

import makeStore from './src/store';
const store = makeStore();

// This is a list of the currently logged in users
var users = new Map();
users.sanitize = function() {
    // Sanitize the user Map, return an Array
    return Array.from(this.values()).map(function(user) {
        return { name: user.name, color: user.color, level: user.level, coins: user.coins };
    })
}

// When a user connects, everything in this function is called per user/socket
io.on('connection', function(socket){

    // Instance variables
    var isLoggedIn = false; // After the user has logged in, this is true
    var user = null;        // Holds the User object

    // Utility function to just make writing output easier
    function write(text){
        socket.emit('message', text);
    }

    // A new user has connected
    console.log('A user connected. Socket #' + socket.id);
    write("Connected.");

    socket.on('message', function(msg) {

        // parse the command arguments into an array for easy access.
        var argv = [];              // argv[0] is the command itself.
        argv = msg.split(' ');
        console.log(argv);

        // Don't allow user to continue until they identify themselves
        if(!isLoggedIn) {
            // The /user command allows a user to log in
            if (argv[0] == '/name' || argv[0] == '/user') {

                var username = argv[1];
                if(username == null) {
                    socket.emit('error_message', "Username required.");
                    return;
                }
                // Username must be one or more letters and numbers
                var patt = /[A-Za-z0-9]+/;
                if (!patt.test(username)) {
                    socket.emit('error_message', "Invalid user name, please use letters and digits only.");
                    return;
                }
                // Be sure user is not already logged in
                if(users.sanitize().some(function(user_obj, key) { return username == user_obj.name }) == true) {
                    socket.emit('error_message', "User is already logged in from another device.");
                    return;
                }

                // Look up user in db
                db.find({name: username}, function (err, docs) {
                    if (docs.length > 0) {
                        console.log("Found user in DB, length: " + docs.length);
                        // if found check the password
                        if (argv[2] == null) {
                            socket.emit('error_message', "Password required.");
                            return;
                        }
                        var u = docs[docs.length - 1]; // Just in case there are > 1 matches
                        if (argv[2] != u.password) {
                            socket.emit('error_message', "Invalid username or password.");
                            return;
                        }
                        // The password is a match, set the user object
                        user = new User(u);
                    } else {
                        // Otherwise we have a new user name
                        console.log("No user found in DB");
                        // TODO: Assign a random password
                        user = new User({name: username, password: 'password', level: 1});
                    }
                    // We are logged in
                    isLoggedIn = true;
                    users.set(socket.id, user);
                    write("Login successful. There are " + users.size + " user(s) logged-in.");
                }); // end db.find
            } else {
                // not logged in and didn't try the /user command
                write("Please login.");
            } // end if
            return;
        } // end if (!isLoggedIn)

        // is the message a command?
        if(msg.startsWith('/')) {
            // TODO: Replace with a switch statement and parse out the arguments
            if (argv[0] == '/name' || argv[0] == '/user') {
                socket.emit('error_message', "A user already is logged in.");
            }
            if (msg.startsWith('/password ')){
                var pw = (msg.substring(msg.indexOf(" ")+1));
                user.password = pw;
                write("User password set.");
            }
            if (msg.startsWith('/logout')){
                logOut();
            }
        } else {
            // Not a command, just send out a chat message to everyone
            io.emit("chat", user.name + ': ' + msg);
        }
    }); // end-on message


    socket.on('sync', function(msg) {
        console.log("got sync message: " + msg);
        switch (msg) {
            case "users":
                socket.emit("sync", JSON.stringify(users.sanitize()));
                break;
            case "all":
                socket.emit('sync', store.getState().toJS());
                break;
        };
    });

    socket.on('action', function(action) {
        console.log(action);
        try {
            store.dispatch(action);
        } catch(e) {
            console.log("Error with action: " + e);
        }
    });

    socket.on('chat', function(msg) {
        if (!isLoggedIn) {
            io.emit("chat", user.name + ': ' + msg);
        } else {
            socket.emit('error_message', "User not logged in.");
        }
    });

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
        users.delete(socket.id);
        write ("User logged off.");
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

http.listen(7000, function(){
    console.log('listening on *:7000');
});

store.subscribe(
    () => io.emit('sync', store.getState().toJS())
);

// This just serves up the web game UI
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


store.dispatch({type: "ADD_NODE", node: {description: "node1", x: 100, y: 100,baseColor:'red'}});
store.dispatch({type: "ADD_NODE", node: {description: "node2", x: 300, y: 100}});
store.dispatch({type: "ADD_NODE", node: {description: "node3", x: 500, y: 100, r: 40, defense: 200}});





