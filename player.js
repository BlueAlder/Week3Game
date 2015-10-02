var METER  = TILE;
var GRAVITY = METER * 9.8 * document.getElementById("gravityInput").value;
var MAXDX = METER * document.getElementById("xVelInput").value;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var JUMP = METER * document.getElementById("jumpInput").value;
var FRICTION = MAXDX * 6;

var self = this;
this.is_key_sfx_playing = false;



var dustParticles = new Emitter();
dustParticles.intialize(this.x , this.y , 0, 0, 0, 0, 100, 0.2, 20, 0.5, true, "Graphics and Animation/SmokeParticle.png");
									//(x, y, dir_x, dir_y, width, height, max_particles, life_time, pps, alpha, is_rand_dir, image_src) 







var SWAP_BUFFER = document.getElementById("swapInput").value;
var LIVES = 3;

var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE = 0;
var ANIM_JUMP = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_WALK_RIGHT = 3;
var ANIM_MAX = 4;


var Player = function(){
	
	this.sprite = new Sprite("p1_spritesheet.png");
	this.sprite.buildAnimation(7, 3, 73.5, 95, 0.05,			//idle
		[4]);
	this.sprite.buildAnimation(7, 3, 73, 94, 0.05,				//jump
		[13, 13]);
	this.sprite.buildAnimation(7, 3, 72.7, 97, 0.05,			
		[0, 1, 2, 7, 9, 10, 3, 4, 5]);
	this.sprite.buildAnimation(7, 3, 72.7, 97, 0.05,
		[5, 4, 3, 10, 9, 7, 2, 1, 0]);
	
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -70, -95);
	}
	
	this.x = 420;
	this.y = 420;
	this.width = 72.5;
	this.height = 95;


	this.velocityX =  0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	this.rotation = 0;

	this.falling = true;
	this.jumping = false;

	this.offset_x = -55;
	this.offset_y = -87;

	this.lives = LIVES;
	this.shooting = false;
	

	this.swapBuffer = SWAP_BUFFER;
	this.swapAllowed = true;
	this.timeInBlue = 0;

	this.timesSwapped = 0;

	this.hasKey = false;

	

	this.direction = LEFT;
	
	
	


	

};





function updateGlobals()
{
	GRAVITY = METER * 9.8 * document.getElementById("gravityInput").value;
	SWAP_BUFFER = document.getElementById("swapInput").value;
	JUMP = METER * document.getElementById("jumpInput").value;
	Cam_ratio = document.getElementById("camInput").value;
	MAXDX = METER * document.getElementById("xVelInput").value;


}

Player.prototype.Update = function(deltaTime, _cam_x, _cam_y) 
{
	
	this.sprite.update(deltaTime);
	
	updateGlobals();
	
	

	var tx = pixel2Tile(this.x);
	var ty = pixel2Tile(this.y);

	var nx = this.x  % TILE;
	var ny = this.y  % TILE;

	var cell = 		 cellAtTileCoord(LAYER_GROUND, tx, 		ty);
	var cellleft =   cellAtTileCoord(LAYER_GROUND, tx - 1,	ty);
	var cellRight =	 cellAtTileCoord(LAYER_GROUND, tx + 1, 	ty);
	var cellDown  =	 cellAtTileCoord(LAYER_GROUND, tx, 		ty + 1);
	var cellDiag  =  cellAtTileCoord(LAYER_GROUND, tx + 1, 	ty + 1);
	var cellDiagleft  =  cellAtTileCoord(LAYER_GROUND, tx - 1, 	ty + 1);

	
	var cellPortal 	= cellAtTileCoord(LAYER_PORTAL,    tx, 		ty);
	var cellKey 	= cellAtTileCoord(LAYER_KEYS, 	   tx, 		ty);
	var cellDoor 	= cellAtTileCoord(LAYER_DOORS,     tx, 		ty);

	//context.save();
	//	context.fillStyle = "red";
	//	context.fillRect(tx * TILE - _cam_x, ty * TILE - _cam_y, TILE, TILE);
	//	context.fillRect((tx + 1) * TILE - _cam_x, ty * TILE - _cam_y, TILE, TILE);
	//	context.fillRect((tx) * TILE - _cam_x, (ty + 1) * TILE - _cam_y, TILE, TILE);
	//	context.fillRect((tx + 1) * TILE - _cam_x, (ty + 1) * TILE - _cam_y, TILE, TILE);
	//	context.fillRect((tx - 1) * TILE - _cam_x, ty * TILE - _cam_y, TILE, TILE);
	//	context.fillRect((tx - 1) * TILE - _cam_x, (ty + 1) * TILE - _cam_y, TILE, TILE);
	//context.restore();

	//context.save();
	//	context.fillStyle = "blue";
	//	context.fillRect(this.x - 5 - _cam_x, this.y - 5 - _cam_y, 10, 10);
	//context.restore();

	var left, right, jump;
	left = right = jump = false;


	//changing anmiation and direction for left
	if(keyboard.isKeyDown(keyboard.KEY_LEFT))
	{
		left = true;
		this.direction = LEFT;
		
		if (this.falling == false && this.jumping == false)
		{
			if(this.sprite.currentAnimation != ANIM_WALK_LEFT)
				this.sprite.setAnimation(ANIM_WALK_LEFT);
		}
	}


	//changing anmiation and direction for right
	else if (keyboard.isKeyDown(keyboard.KEY_RIGHT))
	{
		right = true;
		this.direction = RIGHT;
		
		if (this.falling == false && this.jumping == false)
		{
			if(this.sprite.currentAnimation != ANIM_WALK_RIGHT)
				this.sprite.setAnimation(ANIM_WALK_RIGHT);


		}
	}

	//reset to idle animation
	else {
		if(this.jumping == false && this.falling == false)
		{
			if(this.sprite.currentAnimation != ANIM_IDLE)
			{
				this.sprite.setAnimation(ANIM_IDLE);
			}	

			

		}
	}
	

	//set jumping animation
	if ((keyboard.isKeyDown(keyboard.KEY_SPACE)) || (keyboard.isKeyDown(keyboard.KEY_UP)))
	{
		jump = true;
		this.score += 1;

		if(this.sprite.currentAnimation != ANIM_JUMP)
			this.sprite.setAnimation(ANIM_JUMP);
	}
	

	//check for a reality 
	if ((keyboard.isKeyDown(keyboard.KEY_CTRL)) && cellPortal && this.swapAllowed)
	{
		

		if (CurrentColour == GREEN){
			
			CurrentMap = blueLevels[CurrentLevel]
			normal_background.stop();
			alternate_background.play();


			
			CurrentColour = BLUE;
			initialize(CurrentMap);
		}


		else if (CurrentColour == BLUE){
			
			CurrentMap = greenLevels[CurrentLevel];
			alternate_background.stop();
			normal_background.play();


			
			this.timeInBlue = 0;
			context.globalAlpha = 1;
			CurrentColour = GREEN;
			initialize(CurrentMap);

		}

		this.swapAllowed = false;
		this.timesSwapped ++;


		
	}

	if (!this.swapAllowed)
	{
		this.swapBuffer -= deltaTime;

		if (this.swapBuffer <= 0)
		{
			this.swapBuffer = SWAP_BUFFER;
			//context.globalAlpha = 1;
			this.swapAllowed = true;
			
		}
		
	}

	//the player gains the key

	//else if ((keyboard.isKeyDown(keyboard.KEY_CTRL)) && cellKey)
//	//{
//	//	 
//	//	key_sfx.play();
//	//	is_key_sfx_playing = true;
//	//	
//	//	this.hasKey = true;
//	//}
//
//
//	////player has key and is at the door
//	//else if ((keyboard.isKeyDown(keyboard.KEY_CTRL)) && cellDoor && this.hasKey)
//	//{
//	//	
//	//	if (CurrentLevel != MAX_LEVEL){
//	//		CurrentLevel += 1;
//	//		this.respawn();
//	//	}
//
	//	else{
	//		win_theme.play();
	//		curGameState = GAMESTATE_WIN;
	//	}		
	//}

	//jump = keyboard.isKeyDown(keyboard.KEY_SPACE);

	var wasleft = this.velocityX < 0;
	var wasright = this.velocityX > 0;
	
	var falling = this.falling;
	var ddx = 0;			 //ACCELERATION
	var ddy = GRAVITY;

	if (left)
	{
		ddx -= ACCEL;
	}
	else if (wasleft)
	{
		ddx += FRICTION;
	}

	if (right)
	{
		ddx += ACCEL;
	}
	else if (wasright)
	{
		ddx -= FRICTION
	}

	if (jump && !this.jumping && !falling)
	{
		jump_sfx.play();
		is_jump_sfx_playing = true;
		
		ddy -= JUMP;
		this.jumping = true;
		this.sprite.setAnimation(ANIM_JUMP)
		

	}

	//calculate the new postioin and velocity:
	this.x += deltaTime * this.velocityX;
	this.y += deltaTime * this.velocityY;
	this.velocityX = bound(this.velocityX + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocityY = bound(this.velocityY + (deltaTime * ddy), -MAXDY, MAXDY);


	if ( (wasleft && (this.velocityX > 0)) || (wasright && (this.velocityX < 0)))
	{
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



	if (this.y > CurrentMap.height * TILE + 100)
	{
			this.lives --;
			if (this.lives <= 0){
				game_end.play();
				curGameState = GAMESTATE_ENDGAME;

			}

			else
			{
				this.respawn();
				
			}

	}

	////floor
	if(this.velocityY > 0)
	{
		if ((cellDown & !cell) || (cellDiag && !cellRight && nx) || (!cellleft && cellDiagleft))
		{
			this.y = tile2Pixel(ty);									
			this.velocityY = 0;
			this.falling = false;
			this.jumping = false;
			ny = 0;
		}

	}
	
	//ceiling
	else if (this.velocityY < 0) 
	{
		if ((cell && !cellDown) || (cellRight && !cellDiag && nx) || (cellleft && !cellDiagleft))
		{
			//calmp the y poition to avoid jumping into platform above

			this.y = tile2Pixel(ty + 1);
			this.velocityY = 0; 		//stop upward velocity

			cell = cellDown;
			cellRight = cellDiag;
			ny = 0;
		}
	}
	

	if (this.velocityX > 0)
	{
		if ((cellRight && !cell) || (cellDiag && !cellDown && ny))
		{
			//clamp the x position to avoid moving into the platform we just hit
			this.x = tile2Pixel(tx);
			this.velocityX = 0;
		}
	}

	else if (this.velocityX < 0)
	{
		if((cell && !cellRight) || (cellDown && !cellDiag && ny))
		{
			this.x = tile2Pixel(tx + 1);
			this.velocityX = 0;
		}
	}


	//UPDATE THE PARTICLES
	if ( this.velocityX != 0 && !this.jumping && !this.falling )
	{
		dustParticles.isRunning = true;
		
		if(this.velocityX > 0  )
		{
			dustParticles.dir_x = -1;
			dustParticles.x = this.x - this.width/2;
			dustParticles.y =  this.y + this.height/2 - 30;
			dustParticles.update(deltaTime);
			//dustParticles.intialize(this.x , this.y - this.height/2, -1, 0, 0, 0, 100, 0.2, 20, 0.5, true, "Graphics and Animation/SmokeParticle.png");
									//(x, y, dir_x, dir_y, width, height, max_particles, life_time, pps, alpha, is_rand_dir, image_src)										
		}

		else if (this.velocityX < 0  )
		{
			dustParticles.dir_x = 1;
			dustParticles.x = this.x + this.width/2 - 30;
			dustParticles.y =  this.y + this.height/2 - 30
			dustParticles.update(deltaTime);
			//dustParticles.intialize(this.x , this.y - this.height/2, 1, 0, 0, 0, 100, 0.2, 20, 0.5, true, "Graphics and Animation/SmokeParticle.png");
									//(x, y, dir_x, dir_y, width, height, max_particles, life_time, pps, alpha, is_rand_dir, image_src) 
		}
		
		
	}
	else
	{
		dustParticles.x = this.x - this.width/2;
		dustParticles.y =  this.y + this.height/2 - 30;
		dustParticles.isRunning = false;
		dustParticles.update(deltaTime);
	}
	

		

	
	//player gains the key
	if ((keyboard.isKeyDown(keyboard.KEY_CTRL)) && cellKey){
		 
		key_sfx.play();
		is_key_sfx_playing = true;

		this.hasKey = true;
	}

	//player has key and is at the door
	else if ((keyboard.isKeyDown(keyboard.KEY_CTRL)) && cellDoor && this.hasKey)
	{		
		if (CurrentLevel != MAX_LEVEL){
			CurrentLevel += 1;
			this.respawn();
		}
		else{
			win_theme.play();
			curGameState = GAMESTATE_WIN;
		}
	}
}

Player.prototype.respawn = function()
{


	CurrentMap = greenLevels[CurrentLevel]

	//if (CurrentLevel== 1){
	//	CurrentMap = level1_green;
	//}
	//else if (CurrentLevel == 2){
	//	CurrentMap = level2_green;
	//}
//
//	//else if (CurrentLevel == 3){
//	//	CurrentMap = level3_green;
	//}


	CurrentColour = GREEN;
	context.globalAlpha = 1;

	initialize(CurrentMap);
	
	normal_background.stop();
	alternate_background.stop();
	normal_background.play();
	this.x = CurrentMap.spawnX;
	this.y = CurrentMap.spawnY;
	this.width = 73.5;
	this.height = 95;

	this.offset_x = -55;
	this.offset_y = -87;

	this.velocityX =  0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	this.rotation = 0;

	this.timeInBlue = 0;
	this.hasKey = false;
	//CurrentMap = level1_green;
	

}



Player.prototype.Draw = function(_cam_x, _cam_y)
{
	
	context.save();

	context.globalAlpha = 1;
	this.sprite.draw(context, this.x + (this.width/2) - _cam_x, this.y + (this.height/2) - _cam_y);
	context.restore();

	if (dustParticles.isRunning)
	{
		dustParticles.draw(Cam_x, Cam_y);
	}
//	context.save();
//
//		context.translate(this.x + _cam_x, this.y + _cam_y);
//		context.rotate(this.rotation);
//		context.drawImage(this.image, 
//							-this.width/2,
//							-this.height/2)
//
//	context.restore();
//
	//context.save();
//
//	//context.beginPath();
//
//	//context.rect(this.x - (this.width/2) - _cam_x  , this.y - (this.height/2) - _cam_y, this.width, this.height);
//	//context.stroke();
	//context.restore();

}

