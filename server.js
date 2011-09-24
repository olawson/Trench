//HTTP / WS Server for Trench Game

var port = process.env.PORT || Number(process.argv[2]) || 1337;
var debug = process.argv[3];
var num_players = 2;

var app = require('http')
  , io = require('socket.io')
  , fs = require('fs')
  , static = require('node-static');

//HTTP Hosting
var cache_time = (debug)? false : 3600;
var file = new(static.Server)('.', { cache: cache_time }); //can also set # of seconds

app = app.createServer(function (request, response) {
  request.addListener('end', function () {
    // Serve files!
    file.serve(request, response);
  });
})
io = io.listen(app)
app.listen(port);



//WebSocket Server
var players = new Array();

if(!debug) {
  io.set('log level', 1); // reduce logging
}
io.sockets.on('connection', function (socket) {
  if(players.length < num_players) {
    socket.T_player_id = players.length;
    players.push(socket);
    socket.T_player_side = players.length;
  }
  socket.emit('init', { side: socket.T_player_side }); //TODO - GET SIDE
  
  socket.on('join', function(data) {
    console.log(data)
    console.log(data['game_name'])
    name = data['player_name']
    socket.set('name', name, function () {
      if(players.length == num_players) { //start game
        setTimeout(function() {
          //Note, currently this will only work properly for 2 players
          for(var i = 0; i < num_players; i++) {
            players[i].get('name', function(err, name) {
              players[(i + 1) % 2].emit('start', { name: name });
            });
          }
        },3000);
      }
      //socket.emit('ready');
    });
  });
  
  //primary relay functionality, can add additional game logic here
  socket.on('update', function(data) {
    socket.broadcast.emit('update', data);
  });
  
  
  //If either client disconnects, drop both
  socket.on('disconnect', function () {
    console.log("Disconnecting "+socket.T_player_id);
    if(players[(socket.T_player_id + 1) % 2]) {
      console.log("Send disconnect to "+players[(socket.T_player_id + 1) % 2].T_player_id);
      players[(socket.T_player_id + 1) % 2].emit('disconnect');
    } else {
      console.log('closed');
    }
    players = new Array();
  });
});


//Done
console.log("Server started on port "+port);
