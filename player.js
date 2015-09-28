var METER  = TILE;
var GRAVITY = METER * 9.8 * 0.3;
var MAXDX = METER * 10;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var JUMP = METER * 1500;
var FRICTION = MAXDX * 6;


var LEFT = 0;
var RIGHT = 1;


var Player = function(){
	this.image = document.createElement("img");
	this.image.src = "hero.png";
	
	this.x = SCREEN_WIDTH/2;
	this.y = SCREEN_HEIGHT/2;
	this.width = 159;
	this.height = 163;

	this.velocityX =  0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	this.rotation = 0;

	this.falling = true;
	this.jumping = false;

	this.offset_x = -55;
	this.offset_y = -87;

	this.lives = 3;
	this.shooting = false;
	this.ammo = 7;

	this.score = 0;



	this.direction = LEFT;
	
	
	


	

};

Player.prototype.Update = function(deltaTime) {
	var tx = pixel2Tile(this.x);
	var ty = pixel2Tile(this.y);

	var nx = this.x % TILE;
	var ny = this.y % TILE;

	var cell = 		 cellAtTileCoord(LAYER_GROUND, tx, 		ty);
	var cellRight =	 cellAtTileCoord(LAYER_GROUND, tx + 1, 	ty);
	var cellDown  =	 cellAtTileCoord(LAYER_GROUND, tx, 		ty + 1);
	var cellDiag  =  cellAtTileCoord(LAYER_GROUND, tx + 1, 	ty + 1);


	var left, right, jump;
	left = right = jump = false;
	
	
	if(keyboard.isKeyDown(keyboard.KEY_LEFT)){
		left = true;
		this.direction = LEFT;
		
	}



	//changing anmiation and direction for right
	else if (keyboard.isKeyDown(keyboard.KEY_RIGHT)){
		right = true;
		this.direction = RIGHT;
		
	}
	

};

Player.prototype.Draw = function(){
	context.save();

		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, 
							-this.width/2,
							-this.height/2)

	context.restore();
};

