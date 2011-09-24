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
  
  return filteredPath;
};





/**
 * Areas for trench map
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
};

TrenchMapArea.prototype.render = function() {
  //Mostly for debugging
};