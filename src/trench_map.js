function TrenchMap(config, areas) {
  this.init(config, areas);
};

TrenchMap.prototype.cfg = null;
TrenchMap.prototype.areas = null;
TrenchMap.prototype.spawn_points = null;

/**
 * Constructor
 */
TrenchMap.prototype.init = function(config, objects) {
  
  this.cfg = {};
  $.extend(this.cfg, config);
  
  this.areas = [];
  this.spawn_points = [];
  for(var i in objects) {
    var obj = objects[i];
    if(obj.type == "spawn_point") {
      this.spawn_points.push(obj);
    } else {
      this.areas.push(new TrenchMapArea(obj));
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