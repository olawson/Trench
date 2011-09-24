function Player(name) {
  this.name = name || 'Player';
}

Player.prototype.name = "";
Player.prototype.side = 0;
Player.prototype.score = 0;
Player.prototype.soldiers = [];
Player.prototype.socket = null;

Player.prototype.connect = function(server) {
  player = this;
  
  
  player.socket = io.connect('http://'+server);
  player.socket.on('init', function (data) {
    console.log(data);
    player.side = data['side'];
    if(player.name == 'Player') {
      player.name += " " + player.side;
    }
    player.socket.emit('set_name', player.name);
  });
  
  player.socket.on('start', function (data) {
    console.log(data);
    $("img.fight").show().fadeOut(1500);
    Game.start(data['name']);
  });
  
  player.socket.on('update', function (data) {
    console.log(data);
    
  });
  
  player.socket.on('disconnect', function (data) {
    console.log(data);
    player.socket.emit('disconnect');
  });
}


