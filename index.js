/** This is the main Hackwarz program */

// Load required libraries
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Datastore = require('nedb')
    , db = new Datastore({ filename: 'db/hackwarzdata.nedb', autoload: true });


// Load up our objects
var MissionFinder = require('./lib/MissionFinder');
var mf = MissionFinder.getInstance(); // Load up the singleton instance
var User = require('./lib/User');
var Mission = require('./lib/Mission');


// When a user connects, everything in this function is called per user/socket
io.on('connection', function(socket){

    // TODO: Not sure what we are going to do here
    var firewall = {
        virus:"virus protection: 87%",
        trojan:"trojan seeker: 62%"
    };

    // Instance variables
    var isLoggedIn = false; // After the user has logged in, this is true
    var user = null;        // Holds the User object

    // Utility function to just make writing output easier
    function write(text){
        socket.emit('chat_message', text);
    }

    // A new user has connected
    console.log('A user connected. Socket #' + socket.id);
    write("SYSTEM: Welcome to the DeepWeb Network. Please login using /user [name]");

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
                    //console.log(docs);
                    if (docs.length > 0) {
                        // TODO: don't use docs.count its a hack
                        user = new User(docs[docs.length - 1]);
                        if(user.missionID) { // Must fully restore the mission Object
                            user.mission = mf.fetchMission(user.missionID);
                            //console.log(user.mission);
                        }
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

            if(msg.startsWith('/firewall')){
                socket.emit("chat_message", firewall.virus);
                socket.emit("chat_message", firewall.bruteforce);
                socket.emit("chat_message", firewall.trojan);
                socket.emit("chat_message", firewall.ddos);
            }

        } else {
            // Not a command, just send out the message to everyone
            io.emit("chat_message", user.name + ': ' + msg);
        }
    }); // end-on chat_message

    // When user disconnects, save the user information in the database
    socket.on('disconnect', function () {
        if (isLoggedIn) {
            // Instead of writing the whole Mission object to the DB, just write the MissionID
            delete user.missionID;
            if (user.mission) {
                user.missionID = user.mission.missionID;
                delete user.mission;
            }
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
            console.log('User disconnected: ' + (user.name == "" ? socket.id : user.name));
        } else {
            console.log('User disconnected: ' + socket.id);
        }

    }); // end on disconnect


    // Repeating function to count money, etc.
    setInterval(function () {
        if (isLoggedIn) {
            // Update coins, and update the UI with coins and the user level
            user.coins += Math.pow(user.level, 1.7) / 100;
            socket.emit('bitcoins', user.coins);
            socket.emit('level', user.level);
        }
    }, 1000);

    // Repeating function to check missions
    setInterval(function () {
        if (isLoggedIn) {
            // If user is on a mission, check if test condition passed, otherwise do the prompts
            if (user.mission) {   // User is on a mission
                var message = user.checkMissionComplete();
                if (message == "") message = user.mission.getNextPrompt();
                if (message != "") write(message); // Don't write out empty prompts, just for timing
            } else {
                user.mission = mf.findNextMission(user);
            }
        }
    }, 3000);

}); // End -- on.socket

http.listen(3000, function(){
    console.log('listening on *:3000');
});

// This just serves up the web game UI
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});



