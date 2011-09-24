function Player(name) {
  this.name = name || 'Player';
  
  for(var i = 0; i < Game.numSoldiersPerPlayer; i++) {
    this.soldiers.push(new Soldier());
  }
}

Player.prototype.name = "";
Player.prototype.side = 0;
Player.prototype.score = 0;
Player.prototype.soldiers = [];
Player.prototype.socket = null;


//WebSocket event handlers
Player.prototype.connect = function(server) {
  player = this;
  
  
  player.socket = io.connect('http://'+server);
  player.socket.on('connect', function (data) {
    player.socket.emit('join', { game_name: Game.name, player_name: player.name });
  });
  
  player.socket.on('init', function (data) {
    //console.log(data);
    player.side = data['side'];
    if(player.name == 'Player') {
      player.name += " " + player.side;
    }
  });
  
  player.socket.on('start', function (data) {
    //console.log(data);
    Game.start(data['name'], data['start_time']);
  });
  
  player.socket.on('update', function (data) {
    console.log(data);
    
    if(data['update_type'] == 'path') {
      Game.Opponent.soldiers[data['soldier_id']].setPath(data['path']);
    } else if(data['update_type'] == 'damage') {
      Game.Opponent.soldiers[data['soldier_id']].takeDamage(data['damage']);
    } else if(data['update_type'] == 'death') {
      Game.Opponent.soldiers[data['soldier_id']].kill();
    }
  });
  
  player.socket.on('disconnect', function (data) {
    console.log(data);
    player.socket.emit('disconnect');
  });
}


Player.prototype.sendUpdate = function(type, soldierId, data) {
  socketData = {};
  socketData['update_type'] = type;
  
  if(soldierId) {
    socketData['soldier_id'] = soldierId;
  }
  
  socketData[type] = data;
  
  this.socket.emit('update', socketData);
}


