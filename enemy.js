var METER  = TILE;
var GRAVITY = METER * 9.8 * 3;
var MAXDX = METER * 10;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var JUMP = METER * 1500;
var FRICTION = MAXDX * 6;

var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE = 0;
var ANIM_JUMP = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_WALK_RIGHT = 3;
var ANIM_MAX = 4;

var Enemy = function()
{
	
	this.sprite = new Sprite("p3_spritesheet.png");
	this.sprite.buildAnimation(7, 3, 73.5, 95, 0.05,
		[4]);
	this.sprite.buildAnimation(7, 3, 73, 94, 0.05,
		[13, 13]);
	this.sprite.buildAnimation(7, 3, 72.7, 97, 0.05,
		[0, 1, 2, 7, 9, 10, 3, 4, 5]);
	this.sprite.buildAnimation(7, 3, 72.7, 97, 0.05,
		[5, 4, 3, 10, 9, 7, 2, 1, 0]);
	
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -55, -87);
	}
	
	this.position = new Vector2();
	this.position.set(9*TILE, 0*TILE);
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
					ddx = ddx + ENEMY_ACCEL; // enemy wants to go right
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
					ddx = ddx - ENEMY_ACCEL; // enemy wants to go left
		}
		else {
				this.velocity.x = 0;
				this.moveRight = true;
				this.pause = 0.5;
			}
		}
		
		this.position.x = Math.floor(this.position.x + (dt * this.velocity.x));
		this.velocity.x = bound(this.velocity.x + (dt * ddx),
										-ENEMY_MAXDX, ENEMY_MAXDX);
	}

};

