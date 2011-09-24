var GenericSoldier = {
    radius : 20,
    angle : 180,
    damageAt : function(a, r){
        return 20*(1-r/this.radius);
    }
};

var Sniper = {
    radius : 60,
    angle : 15,
    damageAt : function(a, r){
        return 20;
    }
};

var MachineGunner = {
    radius : 140,
    angle : 40,
    damageAt : function(a, r){
        return 20*(1.5-r/this.radius);
    }
};