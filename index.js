
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Datastore = require('nedb')
    , db = new Datastore({ filename: 'db/hackwarzdata.nedb', autoload: true });

// This just serves up the web game UI
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});



io.on('connection', function(socket){

    function write(text){
        socket.emit('chat_message', text);
    }

    // This is the user object.
    user = {
        name: "",
        password: "",
        level: 0,
        bitcoins: 0.0,
        mission: -1,     // -1 Means no mission
        mission_prompt: 0
    };

    // A new user has connected
    console.log('A user connected. Socket #' + socket.id);
    write("SYSTEM: Welcome to the DeepWeb Network. Please login using /user [name]");


    // Repeating function to count money, etc.
    setInterval(function() {
        if(user.level > 0) {
            // Update bitcoins, and update the UI with coins and the user level
            user.bitcoins += (1.8 ^ user.level) / 100;
            socket.emit('bitcoins', user.bitcoins);
            socket.emit('level', user.level);
        }

        // Check all missions, and put user on mission if condition met
        if(user.mission == -1 ) {   // If the user is not currently on a mission
            // Check all missions for trigger conditions
            for(i = 0; i < missions.length; i++) {
                if(missions[i].trigger()) {         // If we hit a trigger condition
                    if (!missions[i].test()) {      // Check to be sure test hasn't already been satisfied
                        user.mission = i;           // Set the current user mission
                        user.mission_prompt = 0;
                        break;
                    }
                }
            }
        };

        // If user is on a mission, check if test condition passed, otherwise do the prompts
        if (user.mission != -1) {   // User is on a mission
            var mission = missions[user.mission];
            // check the test condition to see if we are done
            if(mission.test()) {
                console.log("test condition passed");
                user.mission = -1;
                mission.completion();
            } else {
                // We are in a mission, output the next prompt
                if(user.mission_prompt < mission.prompts.length) {
                    socket.emit("chat_message", mission.prompts[user.mission_prompt]);
                    user.mission_prompt++;
                }
            }
        }
    }, 1000);

    // Save the user information
    socket.on('disconnect', function(){
        // TODO: check to see if record already created and update else insert
        if(user.name != "") {
            if(user._id) {
                console.log ("Updating user info in DB");
                db.update({_id: user._id}, user, {}, function(err, numReplaced){} );
            } else {
                console.log("Writing user info to DB");
                db.insert(user, function (err, newDoc) {});
            }
        }
        console.log('User disconnected: ' + (user.name == "" ? socket.id : user.name));
    });

    socket.on('chat_message', function(msg){

        // Don't allow user to continue until they identify themselves
        if(user.name == "") {

            // But also don't allow use of /name command after login
            if (msg.startsWith('/name ') || msg.startsWith('/user ')) {
                var u = (msg.substring(msg.indexOf(" ")+1));
                /* Username must 2start with letter, and be one or more letters and numbers */
                var patt = /[a-z0-9]+/;
                if(!patt.test(u)) {
                    socket.emit('error_message', "invalid name request");
                    return;
                }

                // Look up user in db, if found set the user object
                db.find({name: u}, function(err, docs) {
                    console.log(docs);
                    if(docs.length > 0) {
                        // TODO: don't use docs.count its a hack
                        user = docs[docs.length - 1];
                        socket.emit('chat_message', "SYSTEM: Welcome back.");
                    } else {
                        /* A new user name */
                        console.log("No user found in DB");
                        user.name = u;
                        user.level++;
                    }
                }); // end db.find
                socket.emit('chat_message', "SYSTEM: Login successful.");
                return;
            } else {
                socket.emit('chat_message', "Please login.");
                return;
            }
        }

        // is the message a command?
        if(msg.startsWith('/')) {

            if (msg.startsWith('/password ')){
                var pw = (msg.substring(msg.indexOf(" ")+1));
                user.password = pw;
            }

            if(msg.startsWith('/mission')) {
                if(user.mission == -1) {
                    socket.emit("chat_message", "SYSTEM: You are not on a mission.");
                } else {
                    socket.emit("chat_message", "SYSTEM: " + missions[user.mission].description);
                }
            }


        } else {
            //Its not a command, just send out the message to everyone
            socket.emit('chat_message', user.name + ': ' + msg);
        }
/*


            function mission2text(){
                write("Message: " +
                    "Ah good i see your here," +
                    "look i have a task i need some help on," +
                    " i need you to break into some guys network and get his password," +
                    " think your up for the task?");

                if (msg){
                    setTimeout(function(){write("alright sweet," +
                        " i will give a few tips on how to hack his network");
                    },6500);

                }
            }
*/
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});


var missions = [
    {   description: "You should protect your account with a password.",
        trigger: function() { return user.level == 1; },
        test: function() { return user.password != ''; },
        completion: function() { user.level = 2; },
        prompts: [
            "Jake: Hey, this is Jake. Welcome to the Network.",
            "Jake: You should set a password before you do anything else."
        ]
    },
    {   description: "Save up at least 20 bitcoins to buy a terminal interface.",
        trigger: function() { return user.level == 2; },
        test: function() { return user.bitcoins > 20; },
        completion: function() {
        },
        prompts: [
            "Jake: Hey, this is Jake again. Try to save 20 bitcoins so you can buy a terminal interface.",
            "Jake: You need a terminal interface to do any real hacking."
            ]
    }
];

