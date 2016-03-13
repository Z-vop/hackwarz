
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

    // A new user has connected
    var folder = "hacks, firewall, money";
    user = {
        name: "",
        password: "",
        level: 0,
        bitcoins: 0.0
    };

    console.log('A user connected. Socket #' + socket.id);
    socket.emit('chat_message', 'SYSTEM: Welcome to Mega Corp. Please login using /user [name]');

    // Repeating function to count money, etc.
    setInterval(function() {
        user.bitcoins += (1.8^user.level)/100;
        socket.emit('bitcoins', user.bitcoins);
        socket.emit('level', user.level);
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
                // Look up user in db, if found set the user object
                db.find({name: u}, function(err, docs) {
                    console.log(docs);
                    if(docs.length > 0) {
                        // TODO: don't use docs.count its a hack
                        user = docs[docs.length - 1];
                        socket.emit('chat_message', "SYSTEM: Welcome back.");
                    } else {
                        console.log("No user found in DB");
                        user.name = u;
                    }
                }); // end db.find
                socket.emit('chat_message', "SYSTEM: Login successful.");
                user.level++;
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
            io.emit('chat_message', user.name + ': ' + msg);
        }

    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

