var GenericSoldier = {
    name: 'Grunt',
    radius : 60,
    angle : 220,
    damageAt : function(a, r){
        return 20*(1-r/this.radius);
    }
};

var Sniper = {
    name: 'Sniper',
    radius : 320,
    angle : 3,
    damageAt : function(a, r){
        return 20;
    }
};

var MachineGunner = {
    name: 'Gunner',
    radius : 140,
    angle : 40,
    damageAt : function(a, r){
        return 20*(1.5-r/this.radius);
    }
};