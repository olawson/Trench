function Player(name) {
  this.name = name || 'Player';
}

Player.prototype.name = "";
Player.prototype.side = 0;
Player.prototype.score = 0;
Player.prototype.soldiers = [];
Player.prototype.socket = null;

Player.prototype.connect = function(server) {
  
  
  this.socket = io.connect('http://'+server);
  this.socket.on('news', function (data) {
    console.log(data);
    this.socket.emit('my other event', { my: 'data' });
  });
}