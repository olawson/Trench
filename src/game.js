var Game = {
  
  //setup for page load
  load: function() {
    $("#connect_dialog").show();
  },
  
  //setup for game to begin
  init: function() {
    
  },
  
  initPlayer: function(name) {
    this.Player = new Player(name);
    console.log(this.Player);
    this.Player.connect(window.location.hostname);
  },
  
  //start game (called from server)
  start: function(opponent) {
    $("img.fight").show().fadeOut(1500);
    this.Opponent = new Player(opponent);
    if(this.Player.side == 1) {
      this.Opponent.side = 2;
    } else {
      this.Opponent.side = 1;
    }
    this.enableClickListeners();
  },
  
  
  numSoldiersPerPlayer: 6,
  
  
  dragging: false,
  
  enableClickListeners: function() {
    var mobile = false;
    
    Game.dragging = false;
    document.addEventListener('mousedown', this.onTouchStart, false);
    document.addEventListener('mousemove', this.onTouchMove, false);
    document.addEventListener('mouseup', this.onTouchEnd, false);
  },
  
  curPath: null,
  
  onTouchStart: function(event) {
    var self = window.Game;
    self.curPath = [];
    self.dragging = true;
    //Pick closest point
    
    if(Game.debugMouse == true) {
      U_debugPoint(event.pageX,event.pageY, 'green');
    }
  },
  
  onTouchEnd: function() {
    var self = window.Game;
    if(Game.debugMouse == true) {
      U_debugPoint(event.pageX,event.pageY, 'red');
    }
    self.curPath.push({x: event.pageX, y: event.pageY});
    
    self.dragging = false;
    //
    console.log(self.curPath);
  },
  
  onTouchMove: function() {
    var self = window.Game;
    
    if(self.dragging) {
      self.curPath.push({x: event.pageX, y: event.pageY});
    
      if(Game.debugMouse == true) {
        U_debugPoint(event.pageX,event.pageY, 'yellow');
      }
    }
  },
  
  toString: function() {
    return "Game"
  }
}