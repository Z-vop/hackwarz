
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Datastore = require('nedb')
    , db = new Datastore({ filename: 'db/hackwarzdata.nedb', autoload: true });

var finder = require('./missionFinder.js'),
    MissionFinder = finder.MissionFinder;

// This just serves up the web game UI
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){

    var isLoggedIn = false;
    var mf = null; // The MissionFactory

    function write(text){
        socket.emit('chat_message', text);
    }

    // This is the default user object.
    // TODO: user must be scoped!
    var user = {
        name: "",
        password: "",
        level: 0,
        bitcoins: 0.0,
        mission_number: -1, /* -1 Means no mission */
        mission: null,
        mission_prompt: 0
    };

    // A new user has connected
    console.log('A user connected. Socket #' + socket.id);


    write("SYSTEM: Welcome to the DeepWeb Network. Please login using /user [name]");


    // Repeating function to count money, etc.
    setInterval(function() {
        if(isLoggedIn) {
            // Update bitcoins, and update the UI with coins and the user level
            user.bitcoins += (1.8 ^ user.level) / 100;
            socket.emit('bitcoins', user.bitcoins);
            socket.emit('level', user.level);
        }
    }, 1000);

    // Repeating function to check missions
    setInterval(function() {
        if(isLoggedIn) {
            // If user is on a mission, check if test condition passed, otherwise do the prompts
            if (mf.missionActive()) {   // User is on a mission
                var message = mf.checkMissionStatus();
                if(message == "") message = mf.getNextPrompt();
                if(message != "") write(message);
            } else {
                mf.findNextMission();
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
                        user = docs[docs.length - 1];
                        socket.emit('chat_message', "SYSTEM: Welcome back.");
                    } else {
                        /* A new user name */
                        console.log("No user found in DB");
                        user.name = u;
                        user.level++;
                    }
                    // We are logged in
                    mf = new MissionFinder(user);
                    // Must fully restore the mission state as the function callbacks
                    // are not saved in the database.
                    mf.setMission(user.mission_number);
                    isLoggedIn = true;
                    /* Setup the user's mission finder */
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
                socket.emit("chat_message", "SYSTEM: " + mf.getMissionDescription());
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
        if(user.name != "") {
            if(user._id) {
                console.log ("Updating user info in DB");
                db.update({_id: user._id}, user, {}, function(err, numReplaced){} );
            } else {
                console.log("Writing user info to DB");
                db.insert(user, function (err, newDoc) {});
            }
        }
        isLoggedIn = false;
        console.log('User disconnected: ' + (user.name == "" ? socket.id : user.name));
    }); // end on disconnect

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});




var missions = [
    {   description: "You should protect your account with a password.",
        trigger: function() { return this.user.level == 1; },
        test: function() { return this.user.password != ''; },
        completion: function() { this.user.level = 2; },
        prompts: [
            "Jake: Hey, this is Jake. Welcome to the Network.",
            "Jake: You should set a password before you do anything else."
        ]
    },
    {   description: "Save up at least 20 bitcoins to buy a terminal interface.",
        trigger: function() { return user.level == 2; },
        test: function() { return user.bitcoins > 20; },
        completion: function() {
          // TODO:  socket.emit("chat_message", "Jake: Nice going! Now you have enough to buy a terminal.");
        },
        prompts: [
            "Jake: Hey, this is Jake again. Try to save 20 bitcoins so you can buy a terminal interface.",
            "Jake: You need a terminal interface to do any real hacking."
            ]
    }
];

