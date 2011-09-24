function TrenchMap(config, areas) {
  this.init(config, areas);
};

TrenchMap.prototype.cfg = null;
TrenchMap.prototype.areas = null;
TrenchMap.prototype.spawnPoints = null;

/**
 * Constructor
 */
TrenchMap.prototype.init = function(config, objects) {
  
  this.cfg = {};
  $.extend(this.cfg, config);
  
  this.areas = [];
  this.spawnPoints = [];
  for(var i in objects) {
    var obj = objects[i];
    if(obj.type == "spawn_point") {
      this.spawnPoints.push(obj);
    } else {
      this.areas.push(new TrenchMapArea(obj));
    }
  }
};

TrenchMap.prototype.getSpawnPointForTeam = function(team) {
  for(var i in this.spawnPoints) {
    var sp = this.spawnPoints[i];
    
    if(sp.team == team && !sp.occupied) {
      sp.occupied = true;
      return sp;
    }
  }
};

TrenchMap.prototype.render = function() {
  $('#battleBg').css('background','url(maps/'+this.cfg.id+'.png)');
};

TrenchMap.prototype.filterPath = function(path) {
  var filteredPath = [];
  
  var prev = null;
  for(var i in path) {
    var cur = path[i];

    //TODO filter path based on collision detection and redundancy
    if(this.pointValid(cur.x, cur.y)) {
      filteredPath.push(cur);
    } else {
      alert('invalid');
      break;
    }
    
    prev = cur;
  }
  
  return filteredPath;
};

TrenchMap.prototype.isInSpawn = function(x, y) {
  for(var i = 0; i < this.areas.length; i++) {
    if(this.areas[i].cfg.spawn && this.areas[i].containsPoint(x, y))
      return true;
  }
  
  return false;
};


TrenchMap.prototype.pointValid = function(x, y) {
  for(var i in this.areas) {
    if(this.areas[i].containsPoint(x,y) == true) {
      return true;
    }
  }
  
  return false;
};





/**
 * Areas for trench map
 * cfg {
     height: "640"
     name: "left_spawn"
     spawn: "p1"
     type: "area"
     width: "128"
     x: "0"
     y: "0
 * }
 */
function TrenchMapArea(config) {
  this.init(config);
};

TrenchMapArea.prototype.cfg = null;

/**
 * Constructor
 */
TrenchMapArea.prototype.init = function(config) {
  this.cfg = config;
  
  this.cfg.x = parseInt(config.x);
  this.cfg.y = parseInt(config.y);
  this.cfg.width = parseInt(config.width);
  this.cfg.height = parseInt(config.height);
};

TrenchMapArea.prototype.containsPoint = function(x,y) {
  var minX = this.cfg.x;
  var maxX = minX + this.cfg.width;
  var minY = this.cfg.y;
  var maxY = minY + this.cfg.height;
  
  var valid = (x >= minX && x <= maxX && y >= minY && y <= maxY);
  
  return valid;
};

TrenchMapArea.prototype.render = function() {
  //Mostly for debugging
};

TrenchMapArea.prototype.containsPoint = function(x, y) {
  var within = true;
  if(x < this.cfg.x || x > (this.cfg.x + this.cfg.width) || y < this.cfg.y || y > (this.cfg.y + this.cfg.height)) {
    within = false;
  }
  
  return within;
};
