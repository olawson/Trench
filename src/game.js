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
    $("img.fight").show().fadeOut(1500);
    this.Opponent = new Player(opponent);
    if(this.Player.side == 1) {
      this.Opponent.side = 2;
    } else {
      this.Opponent.side = 1;
    }
    this.enableClickListeners();
  },
  
  
  dragging: false,
  
  enableClickListeners: function() {
    var mobile = false;
    
    Game.dragging = false;
    
    document.addEventListener('mousedown', function(event) {
       Game.dragging = true;
        event.preventDefault();
        if(Game.debugMouse) {
          U_debugPoint(event.pageX,event.pageY, 'green');
        }
    }, false);

    document.addEventListener('mousemove', function(event) {
      if(Game.dragging) {
        if(Game.debugMouse) {
          U_debugPoint(event.pageX,event.pageY);
        }
      } 
    }, false);

    document.addEventListener('mouseup', function(event) {
       Game.dragging = false;
       event.preventDefault();
       if(Game.debugMouse) {
         U_debugPoint(event.pageX,event.pageY, 'red');
       }
    }, false);
  },
  
  curPath: null,
  
  onTouchStart: function(event) {
    var self = window.Game;
    self.curPath = [];
    //Pick closest point
    
    if(window.debug == true) {
      U_debugPoint(event.pageX,event.pageY, 'green');
    }
  },
  
  onTouchEnd: function() {
    var self = window.Game;
    
    if(window.debug == true) {
      U_debugPoint(event.pageX,event.pageY, 'red');
    }
    
    self.curPath.push({x: event.pageX, y: event.pageY});
    
    //
    console.log(self.curPath);
  },
  
  onTouchMove: function() {
    var self = window.Game;
    
    self.curPath.push({x: event.pageX, y: event.pageY});
    
    if(window.debug == true) {
      U_debugPoint(event.pageX,event.pageY, 'yellow');
    }
  },
  
  
  toString: function() {
    return "Game"
  }
}