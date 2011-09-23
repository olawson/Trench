function Soldier() {
  
}

Soldier.prototype.HP = 100;
Soldier.prototype.type = GenericSoldier;
Soldier.prototype.radius = 10;
Soldier.prototype.x = 0;
Soldier.prototype.y = 0;

Soldier.prototype.direction = (45/360)*Math.PI*2;


Soldier.prototype.render = function(context){
   // context.save();
    context.beginPath();
    //translate to soldier-center = 0,0
    context.translate(this.x,this.y);
    //draw center based stuff
    context.arc(0,0, this.radius, 0, Math.PI*2);

    context.moveTo(0,0);
    context.lineTo(Math.sin(this.direction)*this.radius, Math.cos(this.direction)*this.radius)
    context.stroke()

    context.closePath();
  //  context.restore();
}