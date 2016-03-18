
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Datastore = require('nedb')
    , db = new Datastore({ filename: 'db/hackwarzdata.nedb', autoload: true });

// This just serves up the web game UI
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var mission = 0;



io.on('connection', function(socket){

    function write(text){
        socket.emit('chat_message', text);
    }



    // A new user has connected
    var folder = "hacks, firewall, money";
    user = {
        name: "",
        password: "",
        level: 0,
        bitcoins: 0.0
    };

    console.log('A user connected. Socket #' + socket.id);
    socket.emit('chat_message', 'SYSTEM: Welcome to the DeepWeb Network. Please login using /user [name]');

    // Repeating function to count money, etc.
    setInterval(function() {
        /* Update bitcoins, user level */
        user.bitcoins += (1.8^user.level)/100;
        socket.emit('bitcoins', user.bitcoins);
        socket.emit('level', user.level);

        /* Check missions */
        if (mission == 2) {
            mission++;
            write("Well?? Get going already!!");
        };
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
                        mission++;
                    } else {
                        /* A new user name */
                        console.log("No user found in DB");
                        user.name = u;
                        user.level++;
                        mission++;
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

            if (msg.startsWith('/color')){

            }

            if(msg.startsWith('/help')) {
                socket.emit('chat_message', "Staff Help" + ': ' + "1) /name:" +
                    " assign your name after typing /name ");
            }

            if(msg.startsWith('/folder')){
                socket.emit('chat_message', username + "'s" + "folder" + folder);

            }

        } else {
            //Its not a command, just send out the message to everyone
            socket.emit('chat_message', user.name + ': ' + msg);
        }

        if (mission == 1){
            mission++;

            setTimeout(write("Incoming Message from: unknown"),1500)

            setTimeout(mission2text, 2000);

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


        }
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

