var ROTQ = 60; //seperate sprite rotations
var SpriteSets = {
    allies          : new Sprites("images/soldiers.png",64, 0,  64,64,60, ROTQ),
    allies_selected : new Sprites("images/soldiers.png", 0, 0,  64,64,60, ROTQ),
    axis            : new Sprites("images/soldiers.png",64,64,  64,64,60, ROTQ),
    axis_selected   : new Sprites("images/soldiers.png",0 ,64,  64,64,60, ROTQ)
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

Soldier.prototype.direction = 45;


Soldier.prototype.render = function(context){
    context.save();
    context.beginPath();
    //translate to soldier-center = 0,0
    context.translate(this.x,this.y);
    //draw center based stuff
    context.arc(0,0, this.radius, 0, Math.PI*2);

    context.moveTo(0,0);
    var theta = this.direction * Math.PI/180;
    context.lineTo(Math.sin(theta)*this.radius, Math.cos(theta)*this.radius)
    context.stroke();

    context.closePath();
    context.restore();
}


Soldier.prototype.setPath = function(newPath) {
  
}

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
    img.src = file;

    var self = this;

    cxt.drawImage(img, x, y, width, height, 0,0,width,height)
    for (var r = 0; r<rotations; r++){
        cxt.save();
        cxt.translate(space*r,0)
        cxt.beginPath();
       // cxt.rect(0,0,64,64)
        cxt.stroke();
        cxt.closePath();
        cxt.translate(width/2,height/2)
        cxt.rotate(Math.PI*2*(r/rotations))
        cxt.translate(-width/2,-height/2)
        cxt.drawImage(c, 0, 0, width, height, 0,0,width,height)
        cxt.restore()
    }
    this.canvas = c;
    this.context = cxt;
}

Sprites.prototype.renderToContextWithAngle = function(context, theta){
    var index = Math.floor(rotations * (theta / 360));
    
};

