//HTTP / WS Server for Trench Game

var port = Number(process.argv[2]) || 1337;

var app = require('http')
  , io = require('socket.io')
  , fs = require('fs')
  , static = require('node-static');

//HTTP Hosting
var file = new(static.Server)('.');

app = app.createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    });
})
io = io.listen(app)
app.listen(port);



//WebSocket Server
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


//Done
console.log("Server started on port "+port);