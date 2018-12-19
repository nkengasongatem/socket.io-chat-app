let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let users = [];
let connections = [];

http.listen(process.env.port || 3000, () => {
  console.log('Server running: Listening to port 3000');
});

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    connections.push(socket);
    console.log('User connected: %s socket(s) are connected', connections.length);
 
    socket.on('new user', (username, callback) => {
        callback(true);
        socket.username = username;
        users.push(username);
        io.emit('get users', [...new Set(users)])
    });

    // lisen to emitted events
    socket.on('send message', msg => {
        io.emit('new message', {mes: msg, usr: socket.username})
    });
    
    socket.on('disconnect', () => {
        // remove username
        users.splice(users.indexOf(socket.username),  1);
        connections.splice(connections.indexOf(socket),  1);
        console.log('User disconnected: %s socket(s) are now connected', connections.length);
        // destructuring & sets
        io.emit('get users', [...new Set(users)])
    });

    // Use the broadcast flag to send a message to everyone except for the typing socket
    socket.on('typing', () => {
        socket.broadcast.emit('typing', socket.username + ' is typing...');
    });  
    
});