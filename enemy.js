var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE = 0;
var ANIM_JUMP = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_WALK_RIGHT = 3;
var ANIM_MAX = 4;

var Enemy = function(x, y)
{
	
	this.sprite = new Sprite("enemy.png");
	this.sprite.buildAnimation(1, 2, 52, 28, 0.05, [1,2]);
	
	this.position = new Vector2();
	this.position.set(37, 6);
	
	this.velocity = new Vector2();

	this.moveRight = true;
	this.pause = 0;

};

Enemy.prototype.Update = function(deltaTime) 
{
	
	this.sprite.update(deltaTime);
	
	if(this.pause > 0)
	{
		this.pause -= dt;
	}
	else
	{
		var ddx = 0; // acceleration
		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x)%TILE; // true if enemy overlaps right
		var ny = (this.position.y)%TILE; // true if enemy overlaps below
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);

		if(this.moveRight)
		{
			if(celldiag && !cellright) {
					ddx = ddx + enemy_ACCEL; // enemy wants to go right
		}
		else {
				this.velocity.x = 0;
				this.moveRight = false;
				this.pause = 0.5;
			}
		}

		if(!this.moveRight)
		{
			if(celldown && !cell) {
					ddx = ddx - enemy_ACCEL; // enemy wants to go left
		}
		else {
				this.velocity.x = 0;
				this.moveRight = true;
				this.pause = 0.5;
			}
		}
		
		this.position.x = Math.floor(this.position.x + (dt * this.velocity.x));
		this.velocity.x = bound(this.velocity.x + (dt * ddx),
										-enemy_MAXDX, enemy_MAXDX);
	}

};