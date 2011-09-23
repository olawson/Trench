function TrenchMap(config, areas) {
  this.init(config, areas);
};

TrenchMap.prototype.cfg = null;
TrenchMap.prototype.areas = null;

/**
 * Constructor
 */
TrenchMap.prototype.init = function(config, areas) {
  
  this.cfg = {};
  $.extend(this.cfg, config);
  
  this.areas = [];
  for(var i in areas) {
    this.areas.push(new TrenchMapArea(areas[i]);
  }
};

TrenchMap.prototype.render = function() {
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