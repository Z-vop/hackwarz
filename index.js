/** This is the main Hackwarz program */

// Load required libraries
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Datastore = require('nedb'), db = new Datastore({ filename: 'db/hackwarzdata.nedb', autoload: true });





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
    write("Welcome to Hackwarz. Please login using /user [name]");

    socket.on('message', function(msg) {

        // parse the command arguments into an array for easy access.
        var argv = [];                          // argv[0] is the command itself.
        argv = msg.split(' ');
        console.log(argv);

        // Don't allow user to continue until they identify themselves
        if(!isLoggedIn) {
            // The /user command allows a user to log in
            if (argv[0] == '/name' || argv[0] == '/user') {

                // Username must be one or more letters and numbers
                if(argv[1] == null) {
                    socket.emit('error_message', "Username required.");
                    return;
                }
                var username = argv[1];
                var patt = /[A-Za-z0-9]+/;
                if (!patt.test(username)) {
                    socket.emit('error_message', "SYSTEM: Invalid user name, please use letters and digits only.");
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
                        write("Welcome back.");
                    } else {
                        // Otherwise we have a new user name
                        console.log("No user found in DB");
                        // TODO: Assign a random password
                        user = new User({name: username, password: 'password', level: 1});
                    }
                    // We are logged in
                    isLoggedIn = true;
                    write("Login successful.");
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
        if (isLoggedIn) {
            io.emit("sync", _json);
        } else {
            socket.emit('error_message', "User not logged in.");
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

// This just serves up the web game UI
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});



// Load up our objects
var User = require('./lib/User');
var Node = require('./lib/Node');
var Connection = require('./lib/Connection');
var Network = require('./lib/Network');

var users = [];
var network = null;

var user1 = {
    name: "oliver",
    level: 1,
    color: "blue"
};

var user2 = {
    name: "cameron",
    password: "asdf",
    level: 1,
    coins: 5.0,
    color: "red"
};

var node1 = {
    description: "node1",
    x: 100, y: 100
};

var node2 = {
    description: "node2",
    x: 300, y: 100
}


var u1 = new User(user1);
var u2 = new User(user2);
users = [u1, u2];

node1 = new Node(node1);
node2 = new Node(node2);
network = new Network();
network.nodes.push(node1);
network.nodes.push(node2);
network.connectNodes(node1, node2);
var _json = network.json;
var network2 = JSON.parse(_json);
console.log("finished JSON: " + _json );



