var GenericSoldier = {
    name: 'Grunt',
    speed : 500,
    radius : 60,
    angle : 220,
    damageAt : function(a, r){
        return 10*(1-r/this.radius);
    }
};

var Sniper = {
    name: 'Sniper',
    speed : 300,
    radius : 320,
    angle : 10,
    damageAt : function(a, r){
        return 90;
    }
};

var MachineGunner = {
    name: 'Gunner',
    speed : 400,
    radius : 140,
    angle : 40,
    damageAt : function(a, r){
        return 10*(1.5-r/this.radius);
    }
};