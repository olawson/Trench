function Player(side, name) {
  
}

Player.prototype.name = "";
Player.prototype.side = 0;
Player.prototype.score = 0;
Player.prototype.soldiers = [];

Player.prototype.connect = function(server) {
  
  
  this.socket = io.connect('http://'+server);
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
}