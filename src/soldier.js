var ROTQ = 60; //seperate sprite rotations
var SpriteSets = {
    allies          : new Sprites("images/soldiers.png",64, 0,  64,64,ROTQ, 90),
    allies_selected : new Sprites("images/soldiers.png", 0, 0,  64,64,ROTQ, 90),
    axis            : new Sprites("images/soldiers.png",64,64,  64,64,ROTQ, 90),
    axis_selected   : new Sprites("images/soldiers.png",0 ,64,  64,64,ROTQ, 90)
};

//soldier side is 1 (allies) or 2 (axis)
function Soldier(side) {
  this.side = side;
}

Soldier.prototype.HP = 100;
Soldier.prototype.type = GenericSoldier;
Soldier.prototype.radius = 10;
Soldier.prototype.x = 0;
Soldier.prototype.y = 0;
Soldier.prototype.dead = true;
Soldier.prototype.classification = MachineGunner;

Soldier.prototype.direction = 45;
Soldier.prototype.sprites = SpriteSets.axis;
Soldier.prototype.spawn = null;


Soldier.prototype.render = function(context){
    context.save();
    //translate to soldier-center = 0,0
    context.translate(this.x,this.y);
    context.beginPath();

    var theta = this.direction * Math.PI/180;
    var delta = this.classification.angle * Math.PI/180;
    context.moveTo(0,0);
    var r = this.classification.radius;
    var x1 = Math.cos(theta-delta/2)*r;
    var y1 = Math.sin(theta-delta/2)*r;
    var x2 = Math.cos(theta+delta/2)*r;
    var y2 = Math.sin(theta+delta/2)*r;
    context.lineTo(x1, y1);
    context.arc(0,0,r,theta-delta/2, theta+delta/2);
//    context.arcTo(x1, y1, x2, y2, r);
    context.lineTo(0,0);
    context.lineTo(x2, y2);
    context.closePath()
    context.stroke();


//    context.lineTo(0,0);
    this.sprites.renderToContextWithAngle(context, this.direction)
    //draw center based stuff



    context.restore();
};

Soldier.prototype.setSpawn = function(spawn) {
  this.spawn = spawn;
  this.x = parseInt(spawn.x);
  this.y = parseInt(spawn.y);
  this.direction = parseInt(spawn.deg);
};

Soldier.prototype.setPath = function(newPath) {
  
};

Soldier.prototype.takeDamage = function(damage) {
  self.HP -= damage;

  if(self.HP <= 0) {
    self.HP = 0;
    return { dead: true }
  } else {
    return { dead: false }
  }
}

Soldier.prototype.kill = function() {
  self.HP = 0;
}


function Sprites(file, x, y, width, height, rotations, space){
    this.width = width;
    this.height = height;
    this.rotations = rotations;
    this.space = space;

    var c = document.createElement('canvas');
    c.height = height;
    c.width = space * rotations;
    var cxt = c.getContext("2d");

    var img = new Image();
    img.onload = function(){
        cxt.drawImage(img, x, y, width, height, 0,0,width,height)
        for (var r = 0; r<rotations; r++){
            cxt.save();
            cxt.translate(space*r,0)
            cxt.translate(width/2,height/2)
            cxt.rotate(Math.PI*2*(r/rotations))
            cxt.translate(-width/2,-height/2)
            cxt.drawImage(c, 0, 0, width, height, 0,0,width,height)
            cxt.restore()
        }
    };
    img.src = file;



    this.canvas = c;
    this.context = cxt;
}

Sprites.prototype.renderToContextWithAngle = function(context, theta){
    var index = Math.floor(this.rotations * (theta / 360));
    context.save();
    context.translate(-this.width/2, -this.height/2);
    context.drawImage(this.canvas, index*this.space, 0, this.width, this.height, 0, 0, this.width, this.height);
    context.restore();
};