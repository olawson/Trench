var GameSpriteSets = {
    allies          : new Sprites("images/soldiers.png",64, 0,  64,64,ROTQ, 90, 0.5),
    allies_selected : new Sprites("images/soldiers.png", 0, 0,  64,64,ROTQ, 90, 0.5),
    axis            : new Sprites("images/soldiers.png",64,64,  64,64,ROTQ, 90, 0.5),
    axis_selected   : new Sprites("images/soldiers.png",0 ,64,  64,64,ROTQ, 90, 0.5)
};

function GameEntity() {
	
}

GameEntity.prototype.x = 0;
GameEntity.prototype.y = 0;
GameEntity.prototype.width = 10;
GameEntity.prototype.height = 10;
GameEntity.prototype.path = null;
GameEntity.prototype.speed = 0;
GameEntity.prototype.dead = false;