import Server from 'socket.io';

export function startServer(store) {
    const io = new Server().attach(7000);

    console.log(store.getState().toJS())
    store.subscribe(
        () => io.emit('state', store.getState().toJS())
    );

    io.on('connection', (socket) => {
        // A new user has connected
        console.log('A user connected. Socket #' + socket.id);

        socket.on('message', function(msg) {
            console.log('message: ' + msg);
            io.emit('chat', msg);
        });

        socket.on('sync', function() {
            console.log('sync');
            socket.emit('state', store.getState().toJS());
        })

        socket.on('action', function(action) {
            console.log("action: " + JSON.stringify(action));
            try {
                // TODO: actions probably shouldn't be broadcast
                io.emit('action', action);
                store.dispatch(action);
            } catch(e) {
                console.log("Error with action: " + e);
            }
        });

    });

    console.log("Server listening")

}
