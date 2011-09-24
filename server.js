//HTTP / WS Server for Trench Game

var port = Number(process.argv[2]) || 1337;
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
    // Game list?
    if(request['url'] == '/game_list') {
      var game_list = "";
      var game_size = 0;
      for(var game in Games) {
        game_size = Games[game].length;
        if((game_size < num_players) && (game_size > 0)) {
          game_list += game+" ("+game_size+"/"+num_players+")&nbsp;&nbsp;&nbsp;<input type='button' class='join' game='"+game+"' value='Join'><br/>"
        }
      }
      response.writeHead(200);
      response.end(game_list);

    // Serve files!
    } else {
      file.serve(request, response);
    }
  });
})
io = io.listen(app)
app.listen(port);



//WebSocket Server
var Games = {};
//var players = new Array();

if(!debug) {
  io.set('log level', 1); // reduce logging
}
io.sockets.on('connection', function (socket) {
  
  socket.on('join', function(data) {
    consoleDebug(data)
    var name = data['player_name'];
    var game = data['game_name'];
    socket.T_game = game;
    if(!Games[game]) {
      Games[game] = new Array();
    }
    if(Games[game].length < num_players) {
      socket.T_player_id = Games[game].length;
      Games[game].push(socket);
      socket.T_player_side = Games[game].length;
    }
    if(name == 'Player') {
      name += " " + socket.T_player_side;
    }
    socket.emit('init', { side: socket.T_player_side });
    
    consoleDebug("Have "+Games[game].length+" players for Game '"+game+"'")
    socket.set('name', name, function () {
      if(Games[game].length == num_players) { //start game
        setTimeout(function() {
          console.log("Starting Game '"+game+"'")
          var start_time = new Date().getTime();
          //Note, currently this will only work properly for 2 players
          for(var i = 0; i < num_players; i++) {
            Games[game][i].get('name', function(err, name) {
              Games[game][(i + 1) % 2].emit('start', { name: name, start_time: start_time });
            });
          }
        },3000);
      }
      
    });
  });
  
  //primary relay functionality, can add additional game logic here
  socket.on('update', function(data) {
    consoleDebug(data)
    socket.broadcast.emit('update', data);
    
    //TODO - Add ack for paths, as they're vital
  });
  
  
  //If either client disconnects, drop both
  socket.on('disconnect', function () {
    var game_name = socket.T_game;
    console.log("Disconnecting "+socket.T_player_id);
    if(Games[game_name]) {
      if(Games[game_name][(socket.T_player_id + 1) % 2]) {
        console.log("Send disconnect to "+Games[game_name][(socket.T_player_id + 1) % 2].T_player_id);
        Games[game_name][(socket.T_player_id + 1) % 2].emit('disconnect');
      } else {
        console.log('closed');
      }
      delete Games[game_name];
    }
  });
});


function consoleDebug(logItem) {
  if (debug)
    console.log(logItem);
}


//Done
console.log("Server started on port "+port);
