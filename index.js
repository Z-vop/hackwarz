
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Datastore = require('nedb')
    , db = new Datastore({ filename: 'db/hackwarzdata.nedb', autoload: true });

var MissionFinder = require('./lib/MissionFinder');
var mf = MissionFinder.getInstance();
var User = require('./lib/User');
var Mission = require('./lib/Mission');

// This just serves up the web game UI
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){

    var isLoggedIn = false;
    var user = null;

    function write(text){
        socket.emit('chat_message', text);
    }

    // A new user has connected
    console.log('A user connected. Socket #' + socket.id);


    write("SYSTEM: Welcome to the DeepWeb Network. Please login using /user [name]");


    // Repeating function to count money, etc.
    setInterval(function() {
        if(isLoggedIn) {
            // Update coins, and update the UI with coins and the user level
            user.coins += (1.8 ^ user.level) / 100;
            socket.emit('bitcoins', user.coins);
            socket.emit('level', user.level);
        }
    }, 1000);

    // Repeating function to check missions
    setInterval(function() {
        if(isLoggedIn) {
            // If user is on a mission, check if test condition passed, otherwise do the prompts
            if (user.mission) {   // User is on a mission
                var message = user.mission.checkStatus();
                if(message == "") message = user.mission.getNextPrompt();
                if(message != "") write(message);
            } else {
                mf.findNextMission(user);
            }
        }
    }, 3000);


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
                    console.log(docs);
                    if (docs.length > 0) {
                        // TODO: don't use docs.count its a hack
                        user = new User(docs[docs.length - 1]);
                        socket.emit('chat_message', "SYSTEM: Welcome back.");
                    } else {
                        /* A new user name */
                        console.log("No user found in DB");
                        user = new User();
                        user.name = u;
                        user.level = 1;
                    }
                    // Must fully restore the mission state as the function callbacks
                    // are not saved in the database.
                    //user.mission = new Mission(user.mission);
                    //mf.setMission(user.mission_number);
                    // We are logged in
                    isLoggedIn = true;
                    socket.emit('chat_message', "SYSTEM: Login successful.");
                }); // end db.find
            } else {
                socket.emit('chat_message', "Please login.");
            }
            return;
        }

        // is the message a command?
        if(msg.startsWith('/')) {

            if (msg.startsWith('/password ')){
                var pw = (msg.substring(msg.indexOf(" ")+1));
                user.password = pw;
            }

            if(msg.startsWith('/mission')) {
                if(user.mission) {
                    write("SYSTEM: " + user.mission.description);
                } else {
                    write("SYSTEM: Not on a mission.");
                }

            }

            if(msg.startsWith('/help')) {
                socket.emit("chat_message", "HELP:");
                socket.emit("chat_message", "/mission                   Describe current mission");
                socket.emit("chat_message", "/password new_password     Change your password");
                socket.emit("chat_message", "/help                      Print this message");
            }


        } else {
            //Its not a command, just send out the message to everyone
            socket.emit('chat_message', user.name + ': ' + msg);
        }
    }); // end-on chat_message

    // When user disconnects, save the user information in the database
    socket.on('disconnect', function(){
        if(isLoggedIn) {
            if(user._id) {
                console.log ("Updating user info in DB");
                db.update({_id: user._id}, user, {}, function(err, numReplaced){} );
            } else {
                console.log("Writing user info to DB");
                db.insert(user, function (err, newDoc) {});
            }
            isLoggedIn = false;
            console.log('User disconnected: ' + (user.name == "" ? socket.id : user.name));
        } else {
            console.log('User disconnected: ' + socket.id );
        }

    }); // end on disconnect

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});



