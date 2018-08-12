let server = require('ws').Server;
let s = new server({ port: 5001 });

s.on('connection', function () {
    /*-- add id to each client to know who signed in, signed out, etc */
    // on conection
    console.log("one more client connected");
    // message event
    ws.on('message', function (message) {
        console.log("Received" + message);
        message = JSON.parse(message);
        if (message.type == "name") {
            ws.personName = message.data;
            return;
        }
        // broadcast the message to every client EXCEPT the message SENDER
        s.clients.forEach(function e(cleint) {
            if (client != ws) {

                client.send(JSON.stringify({
                    name: ws.personName,
                    data: message.data
                }));
            }
        });

        // ws.send("From server: " + message)
    })
    // close event 
    ws.on('close', function () {
        console.log("i lost a client");
    });
});