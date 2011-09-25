function Player(name) {
  this.name = name || 'Player';
  this.soldierById = {};
  this.soldiers = [];
}

Player.prototype.name = "";
Player.prototype.side = 0;
Player.prototype.score = 0;
Player.prototype.soldiers = null;
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
    //console.log(data);
    
    if(data['update_type'] == 'path') {
      Game.Opponent.soldierById[data['soldier_id']].setPath(data['path']);
    } else if(data['update_type'] == 'damage') {
      Game.Opponent.soldierById[data['soldier_id']].takeDamage(data['damage']);
    } else if(data['update_type'] == 'death') {
      Game.Opponent.soldierById[data['soldier_id']].kill();
    }
  });
  
  player.socket.on('disconnect', function (data) {
    player.socket.emit('disconnect');
    Game.load();
  });
}


Player.prototype.scorePoint = function(score) {
  this.score += score || 1;
  $("#score_"+this.side).html(Game.targetScore - this.score);
}

Player.prototype.getClosestSoldierTo = function(x, y) {
  var minDistance = 999;
  var closest = null;
  var TOLERANCE = 60;
  
  for(var i in this.soldiers) {
    var s = this.soldiers[i];
    
    if(s.dead == true) {
      continue;
    }
      
    
    var d = U_distance_2d(x,y,s.x,s.y);
    if(d < minDistance) {
      minDistance = d;
      
      if(d < TOLERANCE) {
        closest = s;
      }
    }
  }
  
  return closest;
}

Player.prototype.focusedSoldier = null;
Player.prototype.focusOn = function(soldier) {
  if(this.focusedSoldier) {
    this.focusedSoldier.focused = false;
  }
  
 if(soldier) {
   soldier.focused = true;
 }
 this.focusedSoldier = soldier;
}

Player.prototype.setSoldierType = function(soldierId, soldierClassName) {
  soldier = this.soldierById[soldierId];
  soldier.setClassification(soldierClassName);
  
  $("#overlay").hide();
  $("#set_soldier_type").hide();
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


