var ROTQ = 60; //seperate sprite rotations
var SpriteSets = {
    allies          : new Sprites("images/soldiers.png",64, 0,  64,64,ROTQ, 90, 0.5),
    allies_selected : new Sprites("images/soldiers.png", 0, 0,  64,64,ROTQ, 90, 0.5),
    axis            : new Sprites("images/soldiers.png",64,64,  64,64,ROTQ, 90, 0.5),
    axis_selected   : new Sprites("images/soldiers.png",0 ,64,  64,64,ROTQ, 90, 0.5)
};

//soldier side is 1 (allies) or 2 (axis)
function Soldier(side) {
    this.side = side;
    if (side==1){
        this.sprites = SpriteSets.allies;
        this.sprites_selected = SpriteSets.allies_selected;
    } else {
        this.sprites = SpriteSets.axis;
        this.sprites_selected = SpriteSets.axis_selected;
    }
}

Soldier.prototype.getId = function() {
  return (this.spawn.name);
};

Soldier.prototype.HP = 100;
Soldier.prototype.type = GenericSoldier;
Soldier.prototype.radius = 10;
Soldier.prototype.x = 0;
Soldier.prototype.y = 0;
Soldier.prototype.dead = true;
Soldier.prototype.firing = false;
Soldier.prototype.classification = MachineGunner;

Soldier.prototype.direction = 45;
Soldier.prototype.sprites = SpriteSets.axis;
Soldier.prototype.focused = false;
Soldier.prototype.spawn = null;
Soldier.prototype.path = null;

Soldier.prototype.conePaddingDegrees = 1;

Soldier.prototype.getDamageForTarget = function(other){
    var r = this.classification.radius;
    var d = U_distance_2d(this.x, this.y, other.x, other.y);
    if (d>r){
        return 0;
    }

    var a = U_angle_2d(this.x, this.y, other.x, other.y);
    var a_diff = Math.abs(this.direction - a);
    if (a_diff < this.classification.angle/2){
        return this.classification.damageAt(a_diff, d/r);
    }
};

Soldier.prototype.renderCone = function(context){
    context.save();
    context.fillStyle = this.firing ? "#FF0000" : "#AAAAFF";
    context.globalAlpha = 0.1;
    context.beginPath();

    var theta = this.direction * Math.PI/180;
    var delta = (this.classification.angle + this.conePaddingDegrees) * Math.PI/180;
    context.moveTo(0,0);
    var r = this.classification.radius;
    var x1 = Math.cos(theta-delta/2)*r;
    var y1 = Math.sin(theta-delta/2)*r;
    var x2 = Math.cos(theta+delta/2)*r;
    var y2 = Math.sin(theta+delta/2)*r;
    context.lineTo(x1, y1);
    context.arc(0,0,r,theta-delta/2, theta+delta/2);
    context.lineTo(0,0);
    context.lineTo(x2, y2);
    context.closePath();
    context.fill();
    context.stroke();
    context.globalAlpha = 1;
    context.restore();
};

Soldier.prototype.renderStats = function(context){
    context.save();
    context.translate(-this.sprites.width/2,-this.sprites.height/2);
    context.beginPath();
    context.fillStyle = "red";
    context.rect(0,0,20,5);
    context.fill();
    context.closePath();

    context.beginPath();
    context.fillStyle = "#00ff00";
    context.rect(0,0,20*(this.HP/100),5);
    context.fill();
    context.closePath();

    context.restore();
};


Soldier.prototype.render = function(context, isCurPlayer){

  //TODO check isCurPlayer == true || is not in spawn


    context.save();

    //translate to soldier-center = 0,0
    context.translate(this.x,this.y);

    this.renderCone(context);
    if (this.focused){
        this.sprites_selected.renderToContextWithAngle(context, this.direction);
    } else {
        this.sprites.renderToContextWithAngle(context, this.direction);
    }
    this.renderStats(context);
    context.restore();
};

Soldier.prototype.setSpawn = function(spawn) {
  this.spawn = spawn;
  this.x = parseInt(spawn.x);
  this.y = parseInt(spawn.y);
  this.direction = parseInt(spawn.deg);
};

Soldier.prototype.setClassification = function(class_name) {
  if(class_name == 'Grunt') {
    this.classification = GenericSoldier;
  } else if(class_name == 'Sniper') {
    this.classification = Sniper;
  } else if(class_name == 'Gunner') {
    this.classification = MachineGunner;
  }
};

/***
 * newPath {
 *     time: milliseconds,
 *     path: [ {x: 1, y: 2}, ... ]
 * }
 */
Soldier.prototype.setPath = function(newPath) {
  //might get a new class from server, so check and update if necessary
  if(newPath['classification']) {
    this.setClassification(newPath['classification']);
  }

  this.path = newPath;
};

Soldier.prototype.updatePosition = function(gametime){
    if(!this.path || this.path.path.length == 0) {
      return;
    }

    var path = this.path;
    var points = this.path.path;
    
    if (points.length==1){
        this.x = points[0].x;
        this.y = points[0].y;
        this.path.path = [];
        return;
    }

    //how much time have we spent on this path?
    var delta_time = gametime - path.time;
    this.path.time = this.path.time + delta_time;

    //how far did we get?
    var distanceToTravel = this.classification.speed/delta_time;

    //so where on the path are we?
    //note: we have AT LEAST 2 path nodes if we are here!
    var lastIndex = 0;
    var segment_start = points[0];
    var segment_end = points[1];
    for (var i=0; i < points.length-1; i++){
        segment_start = points[i];
        segment_end = points[i+1];
        var length = U_distance_2d(segment_start.x, segment_start.y, segment_end.x, segment_end.y);

        if(length > distanceToTravel) {
          //traverse this segment, and iterate to the next
          break;
        } else {
          distanceToTravel -= length;
          lastIndex = i;
        }
    }

    this.direction = U_angle_2d(segment_start.x, segment_start.y, segment_end.x, segment_end.y);
    console.log(this.direction);
    this.x = segment_start.x + distanceToTravel*Math.cos(this.direction*Math.PI/180);
    this.y = segment_start.y + distanceToTravel*Math.sin(this.direction*Math.PI/180);
    this.x = segment_start.x;
    this.y = segment_start.y;

    if (lastIndex < points.length){
      var newpath = [];
      //newpath.push({x: this.x, y:this.y});
      for (i = lastIndex+1; i < points.length; i++){
          newpath.push(points[i]);
      }
      this.path.path = newpath;
    }
};

Soldier.prototype.takeDamage = function(damage) {
  self.HP -= damage;

  if(self.HP <= 0) {
    self.HP = 0;
    return { dead: true }
  } else {
    return { dead: false }
  }
};

Soldier.prototype.kill = function() {
  self.HP = 0;
};

Soldier.prototype.chooseTypeUi = function() {
  $("#set_soldier_type").attr('soldier_id', this.getId());
  $("#set_soldier_type fieldset").css('border-color', '');
  $("#set_soldier_type fieldset."+this.classification.name).css('border-color', 'blue');
  $("#overlay").show();
  $("#set_soldier_type").show();
}


function Sprites(file, x, y, width, height, rotations, space, scale){
    this.width = width * scale;
    this.height = height * scale;
    this.rotations = rotations;
    this.space = space * scale;

    var c = document.createElement('canvas');
    c.height = this.height;
    c.width = this.space * rotations;
    var cxt = c.getContext("2d");

    var img = new Image();
    var self = this;
    img.onload = function(){
        cxt.drawImage(img, x, y, width, height, 0,0,width*scale,height*scale);
        for (var r = 0; r<rotations; r++){
            cxt.save();
            cxt.translate(space*scale*r,0);
            cxt.translate(scale*width/2,scale*height/2);
            cxt.rotate(Math.PI*2*(r/rotations));
            cxt.translate(-scale*width/2,-scale*height/2);
            cxt.drawImage(c, 0, 0, width*scale, height*scale, 0,0,width*scale,height*scale);
            cxt.restore();
        }
        self.ready = true;
    };
    img.src = file;



    this.canvas = c;
    this.context = cxt;
};

Sprites.prototype.renderToContextWithAngle = function(context, theta){
    if (!this.ready) return;
    var index = Math.floor(this.rotations * (theta / 360));
    context.save();
    context.translate(-this.width/2, -this.height/2);
    context.drawImage(this.canvas, index*this.space, 0, this.width, this.height, 0, 0, this.width, this.height);
    context.restore();
};