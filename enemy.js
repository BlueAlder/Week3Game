var METER  = TILE;

var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;
var PAUSE_TIME = 0.5;

var Enemy = function(_x, _y)
{
	
	this.sprite = new Sprite("enemy.png");
	this.sprite.buildAnimation(1, 2, 52, 28, 0.05, [1,2]);
	
	this.x = _x;
	this.y = _y;
	
	
	this.width = 50;
	this.height = 28;
	
	this.velocityX = 0;
	this.velocityY = 0;

	this.moveRight = true;
	this.pause = 0;

};

Enemy.prototype.update = function(deltaTime) 
{
	
	this.sprite.update(deltaTime);
	
	if(this.pause > 0)
	{
		this.pause -= deltaTime;
	}
	else
	{
		var ddx = 0; // acceleration
		var tx = pixel2Tile(this.x);
		var ty = pixel2Tile(this.y);
		var nx = (this.x)%TILE; // true if enemy overlaps right
		var ny = (this.y)%TILE; // true if enemy overlaps below
		
		var cell = cellAtTileCoord(LAYER_GROUND, tx, ty);
		var cellright = cellAtTileCoord(LAYER_GROUND, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_GROUND, tx, ty + 1);
		var celldiag = cellAtTileCoord(LAYER_GROUND, tx + 1, ty + 1);

		if(this.moveRight)
		{
			
			if(celldiag && !cellright)
			{
				ddx += ENEMY_ACCEL;

			}

			else
			{
				this.velocityX = 0;
				this.moveRight = false;
				this.pause = PAUSE_TIME;
			}

		}

		else
		{
			if(celldown && !cell)
			{
				ddx -= ENEMY_ACCEL;
			}

			else
			{
				this.velocityX = 0;
				this.moveRight = true;
				this.pause = PAUSE_TIME;
			}
		}

		this.x += (deltaTime * this.velocityX);
		this.velocityX = bound(this.velocityX + (deltaTime * ddx), -ENEMY_MAXDX, ENEMY_MAXDX);
	}
}

Enemy.prototype.draw = function(_cam_x, _cam_y)
{
	this.sprite.draw(context, this.x - _cam_x, this.y - _cam_y);
}