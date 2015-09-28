var METER  = TILE;
var GRAVITY = METER * 9.8 * 3;
var MAXDX = METER * 10;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var JUMP = METER * 1500;
var FRICTION = MAXDX * 6;




var LEFT = 0;
var RIGHT = 1;





var Player = function(){
	
	this.image = document.createElement("img");
	this.image.src = "player_front.png";


	this.x = SCREEN_WIDTH/2;
	this.y = SCREEN_HEIGHT/2;
	this.width = 66;
	this.height = 92;

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

	

	GRAVITY = METER * 9.8 * 3;

	var tx = pixel2Tile(this.x);
	var ty = pixel2Tile(this.y);

	var nx = this.x % TILE;
	var ny = this.y % TILE;

	var cell = 		 cellAtTileCoord(LAYER_GROUND, tx, 		ty);
	var cellRight =	 cellAtTileCoord(LAYER_GROUND, tx + 1, 	ty);
	var cellDown  =	 cellAtTileCoord(LAYER_GROUND, tx, 		ty + 1);
	var cellDiag  =  cellAtTileCoord(LAYER_GROUND, tx + 1, 	ty + 1);
	
	var cellDoor = cellAtTileCoord(LAYER_DOORS, tx, 		ty);


	var left, right, jump;
	left = right = jump = false;


	//changing anmiation and direction for left
	if(keyboard.isKeyDown(keyboard.KEY_LEFT)){
		left = true;
		this.direction = LEFT;
		
	}



	//changing anmiation and direction for right
	else if (keyboard.isKeyDown(keyboard.KEY_RIGHT)){
		right = true;
		this.direction = RIGHT;
		
	}

	

	
	if ((keyboard.isKeyDown(keyboard.KEY_SPACE)) || (keyboard.isKeyDown(keyboard.KEY_UP))){
		jump = true;
		this.score += 1;
	}
	
	if ((keyboard.isKeyDown(keyboard.KEY_CTRL)) && cellDoor){
		document.write("hello");
	}

	//jump = keyboard.isKeyDown(keyboard.KEY_SPACE);

	var wasleft = this.velocityX < 0;
	var wasright = this.velocityX > 0;
	
	var falling = this.falling;
	var ddx = 0;			 //ACCELERATION
	var ddy = GRAVITY;

	if (left){
		ddx -= ACCEL;
	}
	else if (wasleft){
		ddx += FRICTION;
	}

	if (right){
		ddx += ACCEL;
	}
	else if (wasright){
		ddx -= FRICTION
	}

	if (jump && !this.jumping && !falling){
		ddy -= JUMP;
		this.jumping = true;
		
	}

	
	


	//calculate the new postioin and velocity:
	this.x += deltaTime * this.velocityX;
	this.y += deltaTime * this.velocityY;
	this.velocityX = bound(this.velocityX + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocityY = bound(this.velocityY + (deltaTime * ddy), -MAXDY, MAXDY);


	if (this.y > SCREEN_HEIGHT){
			this.lives --;
			if (this.lives <= 0){
				curGameState = GAMESTATE_ENDGAME;

			}

			else{
				this.respawn();
			}

		}
	



	if ( (wasleft && (this.velocityX > 0)) || (wasright && (this.velocityX < 0))){
		//clamp at zero to prevbent frition from making us jiggle side to side
		this.velocityX = 0;
	} 

	//rotation when walking
	//if ( this.velocityX > 0){
	//	this.rotation = (this.velocityX / MAXDX) * (Math.PI / 8) ;
	//}
	//else if (this.velocityX < 0){
	//	this.rotation = (-this.velocityX / MAXDX) * (-Math.PI /8);
	//}
	//else{
	//	this.rotation = 0;
	//}

	//CEILING
	if(this.velocityY > 0){
		if ((cellDown & !cell) || (cellDiag && !cellRight && nx)){
			this.y = tile2Pixel(ty);
			this.velocityY = 0;
			this.falling = false;
			this.jumping = false;
			ny = 0;
		}

	}
	//FLOOR
	else if (this.velocityY < 0) {
		if ((cell && !cellDown) || (cellRight && !cellDiag && nx)){
			//calmp the y poition to avoid jumping into platform above

			this.y = tile2Pixel(ty + 1);
			this.velocityY = 0; 		//stop upward velocity

			cell = cellDown;
			cellRight = cellDiag;
			ny = 0;
		}
	}

	if (this.velocityX > 0){
		if ((cellRight && !cell) || (cellDiag && !cellDown && ny)){
			//clamp the x position to avoid moving into the platform we just hit
			this.x = tile2Pixel(tx);
			this.velocityX = 0;
		}
	}

	else if (this.velocityX < 0){
		if((cell && !cellRight) || (cellDown && !cellDiag && ny)){
			this.x = tile2Pixel(tx + 1);
			this.velocityX = 0;
		}
	}

Player.prototype.respawn = function(){
	this.x = SCREEN_WIDTH/2;
	this.y = SCREEN_HEIGHT/2;
	this.width = 159;
	this.height = 163;

	this.offset_x = -55;
	this.offset_y = -87;

	this.velocityX =  0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	this.rotation = 0;

	this.shooting = false;
	this.ammo = 7;
}


};

Player.prototype.Draw = function(_cam_x, _cam_y){
	

	context.save();

		context.translate(this.x + _cam_x, this.y + _cam_y);
		context.rotate(this.rotation);
		context.drawImage(this.image, 
							-this.width/2,
							-this.height/2)

	context.restore();

	context.save();

	context.beginPath();
	context.rect(this.x - (this.width/2)  , this.y - (this.height/2), this.width, this.height);
	context.stroke();
	context.restore();

};

