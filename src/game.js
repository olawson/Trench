var GameStates = {
  preGame: 0,
  playing: 1,
  over: 2
};

var Game = {
  
  //setup for page load
  map: null,
  context: null,
  state: GameStates.preGame,
  
  load: function() {
    var canvas = document.getElementById("bg_canvas");
    this.context = canvas.getContext("2d");
    
    $("#connect_dialog").show();
    
    //$('#gameList').append('<li>game name join link</li>');
  },
  
  //setup for game to begin
  init: function(playerName, gameName) {
    $("#connect_dialog").hide();
    
    this.map = threeLane;
    this.map.render();
    
    this.name = gameName || "Game "+(new Date().getTime());
    Game.initPlayer(playerName);
  },
  
  initPlayer: function(name) {
    this.Player = new Player(name);
    console.log(this.Player);
    this.Player.connect(window.location.hostname, self.name);
  },
  
  //start game (called from server)
  start: function(opponent, startTime) {
    if(this.state == GameStates.preGame) {
      this.state = GameStates.playing;
      
      $("img.fight").show().fadeOut(1500);
      this.Opponent = new Player(opponent);
      if(this.Player.side == 1) {
        this.Opponent.side = 2;
      } else {
        this.Opponent.side = 1;
      }
      this.playerSides[this.Player.side] = this.Player;
      this.playerSides[this.Opponent.side] = this.Opponent;
    
      this.startTime = startTime;
    
      //Attach soldiers to spawn points
      for(var i = 0; i < Game.numSoldiersPerPlayer; i++) {
      
        var spawn = Game.map.getSpawnPointForTeam(this.Player.side);
        this.Player.soldiers[i].setSpawn(spawn);
      
      
        spawn = Game.map.getSpawnPointForTeam(this.Opponent.side);
        this.Opponent.soldiers[i].setSpawn(spawn);
      }
    
      this.enableClickListeners();
      
	  //Starting the audio
	  startSound();
    }  
  },
  
  lastTime: null,
  loop: function() {
    if(this.state == GameStates.playing) {
      this.lastTime = this.lastTime || new Date().getTime();
      var now = new Date().getTime();
    
      var gameTime = now - this.lastTime;
    
      this.update(gameTime);
      this.render(gameTime);
    }
  },
  
  update: function(gameTime) {
    
  },
  
  render: function(gameTime) {
    
    this.context.clearRect(0,0,960,640);
    
    //render all soldiers
    for(var i in Game.Player.soldiers) {
      Game.Player.soldiers[i].render(this.context);
    }
    
    if(Game.Opponet) {
      for(var i in Game.Opponent.soldiers) {
        Game.Opponent.soldiers[i].render(this.context);
      }
    }
    
    
    //render all dynamic sprites
    
  },
  
  
  
  
  numSoldiersPerPlayer: 6,
  
  playerSides: {},  //reference to each player by side (1 or 2)
  
  
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