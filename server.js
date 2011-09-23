//HTTP / WS Server for Trench Game

var port = Number(process.argv[2]) || 1337;
var debug = process.argv[3];

var app = require('http')
  , io = require('socket.io')
  , fs = require('fs')
  , static = require('node-static');

//HTTP Hosting
var cache_time = (debug)? false : 3600;
var file = new(static.Server)('.', { cache: cache_time }); //can also set # of seconds

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
if(!debug) {
  io.set('log level', 1); // reduce logging
}
io.sockets.on('connection', function (socket) {
  socket.emit('init', { side: 1 }); //TODO - GET SIDE
  
  socket.on('set_name', function(name) {
    socket.set('name', name, function () {
      //socket.emit('ready');
    });
  });
  
  
});


//Done
console.log("Server started on port "+port);