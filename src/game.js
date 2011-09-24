var Game = {
  
  //setup for page load
  load: function() {
    $("#connect_dialog").show();
  },
  
  //setup for game to begin
  init: function() {
    
  },
  
  initPlayer: function(host, name) {
    this.Player = new Player(name);
    console.log(this.Player);
    this.Player.connect(host);
  },
  
  //start game (called from server)
  start: function(opponent) {
    this.Opponent = new Player(opponent);
    if(this.Player.side == 1) {
      this.Opponent.side = 2;
    } else {
      this.Opponent.side = 1;
    }
  }
}