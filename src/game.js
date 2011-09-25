var GameStates = {
  loaded: 0,
  preGame: 1,
  playing: 2,
  over: 3
};

var Game = {
  
  //setup for page load
  map: null,
  context: null,
  state: GameStates.preGame,
  
  respawnRate: 10000,
  lastRespawn: -600000,
  targetScore: 15,
  
  load: function() {
    var canvas = document.getElementById("bg_canvas");
    this.context = canvas.getContext("2d");
    
    $("#connect_dialog").show();
    
    $.get('/game_list', function(data) {
      $('#gameList').append(data);
      $('#gameList input.join').click(function() {
        Game.init($('#connect_dialog .playerName').val(), $(this).attr('game'));
      });
    });

    window.setInterval(function(){Game.loop();}, 16);
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
    this.startTime = new Date().getTime();
    
    console.log('Start');
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
      
      this.Player.score = 0;
      this.Opponent.score = 0;
      $(".score").html(0);
      $(".score").show();
    
      //Attach soldiers to spawn points
      for(var i = 0; i < Game.numSoldiersPerPlayer; i++) {
        var soldier = new Soldier(this.Player.side);
        this.Player.soldiers.push(soldier);
        var spawn = Game.map.getSpawnPointForTeam(this.Player.side);
        soldier.setSpawn(spawn);
        this.Player.soldierById[soldier.getId()] = soldier;
      
        soldier = new Soldier(this.Opponent.side);
        this.Opponent.soldiers.push(soldier);
        spawn = Game.map.getSpawnPointForTeam(this.Opponent.side);
        soldier.setSpawn(spawn);
        this.Opponent.soldierById[soldier.getId()] = soldier;
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

      var gameTime = this.getTime();

      this.update(gameTime);
      this.render(gameTime);
    }
  },
  
  update: function(gameTime) {
    
    if(gameTime - this.lastRespawn > this.respawnRate) {
      this.respawn();
      this.lastRespawn = gameTime;
    }
    
    if(this.state == GameStates.playing) {
        for(var i in Game.Player.soldiers) {
            Game.Player.soldiers[i].firing = false;
            Game.Player.soldiers[i].updatePosition(gameTime);
        }

        if(Game.Opponent) {
            for(var i in Game.Opponent.soldiers) {
                Game.Opponent.soldiers[i].firing = false;
                Game.Opponent.soldiers[i].updatePosition(gameTime);
            }
        }

        for(var i in Game.Player.soldiers) {
            var player_soldier = Game.Player.soldiers[i];
            for(var j in Game.Opponent.soldiers) {
                var opponent_soldier = Game.Opponent.soldiers[j];
                if (player_soldier.getDamageForTarget(opponent_soldier)>0){
                    player_soldier.firing = true;
                }
                if (opponent_soldier.getDamageForTarget(player_soldier)>0){
                    player_soldier.continueDamageFrom(opponent_soldier, gameTime);
                    opponent_soldier.firing = true;
                } else {
                    player_soldier.endDamageFrom(opponent_soldier);
                }

            }
        }

    }
  },
  
  render: function(gameTime) {
    
    this.context.clearRect(0,0,960,640);
    
    //render all soldiers
    for(var i in Game.Player.soldiers) {
      Game.Player.soldiers[i].render(this.context, true);
    }
    
    if(Game.Opponent) {
      for(var i in Game.Opponent.soldiers) {
        Game.Opponent.soldiers[i].render(this.context, false);
      }
    }
    
    try {
    $('#respawnTimer').html(Math.floor((this.respawnRate - (this.lastRespawn - gameTime)) / 1000));
  } catch(e) {
    //
  }
    
    
    //render all dynamic sprites
    
  },
  
  
  respawn: function() {
    for(var i in Game.Player.soldiers) {
      if(Game.Player.soldiers[i].dead == true) {
        Game.Player.soldiers[i].respawn();
      }
    }
    
    if(Game.Opponent) {
      for(var i in Game.Opponent.soldiers) {
        if(Game.Opponent.soldiers[i].dead == true) {
          Game.Opponent.soldiers[i].respawn();
        }
      }
    }
  },
  
  
  
  numSoldiersPerPlayer: 6,
  
  playerSides: {},  //reference to each player by side (1 or 2)
  
  maxScore: 100,
  
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
    self.Player.focusOn(null);
    

    self.curPath = [];
    self.dragging = true;
    //Pick closest point
    
    var soldier = Game.Player.getClosestSoldierTo(event.pageX, event.pageY);
    Game.Player.focusOn(soldier);
    
    if(soldier) {
      var path = {time: Game.getTime(), path: [{x: soldier.x, y: soldier.y}]};
      self.Player.sendUpdate('path', soldier.getId(), path);
      soldier.setPath(path);
    } 
    
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
    
    if(self.Player.focusedSoldier) {
      if((self.curPath[0]['x'] == event.pageX) && (self.curPath[0]['y'] == event.pageY) && self.map.isInSpawn(event.pageX,event.pageY)){
        self.Player.focusedSoldier.chooseTypeUi();
      } else {
        self.curPath = self.map.filterPath(self.curPath);
        var path = {path: self.curPath, time: Game.getTime(), classification: self.Player.focusedSoldier.classification.name};
        self.Player.sendUpdate('path', self.Player.focusedSoldier.getId(), path);
        self.Player.focusedSoldier.setPath(path);
      }
    }
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
  
  getTime: function() {
    return new Date().getTime() - this.startTime;
  },
  
  /**
   * Debug all mouse interactions
   */
  debugAll: function() {
    this.debugMouse = true;
    
  },
  
  toString: function() {
    return "Game"
  }
}