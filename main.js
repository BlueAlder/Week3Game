var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

var normal_background;
var alternate_background;
var win_theme;


initialize(CurrentMap);
// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var Cam_x = 0;
var Cam_y = 0;
var Cam_ratio = document.getElementById("camInput").value;

var GAMESTATE_SPLASH = 0;
var GAMESTATE_GAME = 1;
var GAMESTATE_ENDGAME = 2;
var GAMESTATE_WIN = 3;
var curGameState = GAMESTATE_SPLASH;



//	SCREEN_WIDTH = window.innerWidth;
//	SCREEN_HEIGHT = window.innerHeight;
//var	canvas.width = SCREEN_WIDTH;
//var	canvas.height = SCREEN_HEIGHT;
//
//	drawMap();
//}


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;


var normal_background = new Howl(
{
	urls: ["normal lvl theme.wav"],
	loop: true,
	buffer: true,
	volume: 0.1
} );
normal_background.play();

var alternate_background = new Howl(
{
	urls: ["alnternate lvl theme.wav"],
	loop: true,
	buffer: true,
	volume: 0.1
} );
//alternate_background.play();

var win_theme = new Howl(
{
	urls: ["victory theme.wav"],
	loop: false,
	buffer:true,
	volume: 0.1
} );

function runSplash(deltaTime){
	
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	context.fillStyle = "black";
	context.font = "30px Arial";
	var textMeasure = context.measureText("Press Enter to Start and Ctrl to interact.");
	context.fillText("Press Enter to Start and Ctrl to interact.", SCREEN_WIDTH/2 - (textMeasure.width/2), SCREEN_HEIGHT/2);
	
	context.fillstyle = "black";
	context.font = "20px Arial";
	var textMeasure = context.measureText("Arrow keys to move");
	context.fillText("Arrow keys to move", SCREEN_WIDTH/2 - (textMeasure.width/2), SCREEN_HEIGHT/1.5);
	
	
	if (keyboard.isKeyDown(keyboard.KEY_ENTER)){
		curGameState = GAMESTATE_GAME;
	}
}

function runWin(deltaTime){
	context.fillStyle = "white";
	context.font = "50px Impact";
	var textMeasure = context.measureText("CONGLATURATION");
	context.fillText("CONGLATURATION", SCREEN_WIDTH/2 - (textMeasure.width/2), SCREEN_HEIGHT/2);
	normal_background.stop();
	alternate_background.stop();
}

function checkCollision(_cam_x, _cam_y){
	var player_min_x = chuck.x + chuck.offset_x;
	var player_min_y = chuck.y + chuck.offset_y;
	
	var player_max_x = chuck.x  + chuck.width + chuck.offset_x;
	var player_max_y = chuck.y  + chuck.height + chuck.offset_y;



	for (var enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++){
		var enemy_min_x = enemies[enemyIndex].x + enemies[enemyIndex].offset_x;
		var enemy_min_y = enemies[enemyIndex].y + enemies[enemyIndex].offset_y;
	
		var enemy_max_x = enemies[enemyIndex].x + enemies[enemyIndex].width + enemies[enemyIndex].offset_x;
		var enemy_max_y = enemies[enemyIndex].y + enemies[enemyIndex].height + enemies[enemyIndex].offset_y;

		if ((player_max_x < enemy_min_x || player_min_x > enemy_max_x) ||
				(player_max_y < enemy_min_y || player_min_y > enemy_max_y)){

			//not colliding
			continue;

		}

		else{
			chuck.lives --;
			if(chuck.lives <= 0){
				curGameState = GAMESTATE_ENDGAME;
			}
			else{
				alternate_background.stop();
				normal_background.play();
				chuck.respawn();

			}
			return;
		}
		

	}	
}

function updateAlpha(deltaTime){
	chuck.timeInBlue += deltaTime
	context.globalAlpha = 1/(chuck.timeInBlue+1);
}

function runGame(deltaTime){
	
	if(CurrentColour == GREEN){
		context.fillStyle = "#07f";	
		fireRain.isRunning = false;
	}
	else if (CurrentColour == BLUE){
		context.fillStyle = "#f70";	

		updateAlpha(deltaTime);	

		if(!fireRain.isRunning){
			fireRain.intialize(0, 0, 0, 1, CurrentMap.width * TILE, 0, 3000, 10, 20, 0.5, true);
						  //(x, y, dir_x, dir_y, width, height, max_particles, life_time, pps, alpha, is_rand_dir)
			fireRain.isRunning = true;
		}

		fireRain.update(deltaTime);
		fireRain.draw(Cam_x, Cam_y);																//(x, y, dir_x, dir_y, width, height, max_particles, 															//	life_time, pps, alpha, is_rand_dir)
		
		

	}			
	context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	chuck.Update(deltaTime);

	
	//checkCollision();

	var left_stop = 0 ;
	var top_stop = 0 ;
	var right_stop = TILE * MAP.tw - SCREEN_WIDTH;
	var bottom_stop = TILE * MAP.th - SCREEN_HEIGHT;

	var new_pos_x = chuck.x - SCREEN_WIDTH/2;
	var new_pos_y = chuck.y - SCREEN_HEIGHT/2;

	if (new_pos_x < left_stop){
		new_pos_x = left_stop;
	}

	else if (new_pos_x > right_stop){
		new_pos_x = right_stop;
	}

	if (new_pos_y < top_stop){
		new_pos_y = top_stop;
	}

	else if (new_pos_y > bottom_stop){
		new_pos_y = bottom_stop;
	}

	 
	Cam_x = lerp(Cam_x, new_pos_x, Cam_ratio );
	Cam_y = lerp(Cam_y, new_pos_y, Cam_ratio );


	drawMap(Cam_x, Cam_y);

	
	chuck.Draw(Cam_x, Cam_y);

	

	drawHUD();



}

function endGame(deltaTime){
	

	
	context.font = "50px Impact";
	context.fillStyle = "red";
	var textMeasure = context.measureText("Game Over");
	context.fillText("Game Over", SCREEN_WIDTH/2 - (textMeasure.width/2), SCREEN_HEIGHT/2);
	
	context.font = "25px Arial";
	context.fillStyle = "black";
	var textMeasure = context.measureText("Press enter to respawn");
	context.fillText("Press enter to respawn", SCREEN_WIDTH/2 - (textMeasure.width/2), SCREEN_HEIGHT/1.7);
	

	normal_background.stop();			//Stop Music
	alternate_background.stop();



	if (keyboard.isKeyDown(keyboard.KEY_ENTER)){
		
		chuck.lives = LIVES;
		chuck.score = 0;
		chuck.respawn();
		curGameState = GAMESTATE_GAME;
	}


}




var keyboard = new Keyboard();
var chuck = new Player();
var fireRain = new Emitter();




//initialize(level1_green);



function lerp(left_value, right_value, ratio){
	return left_value + ratio * ( right_value - left_value);
};

function run()
{
	
	//add a background rect
	
	
	var deltaTime = getDeltaTime();

	switch (curGameState){

		case GAMESTATE_SPLASH:
			runSplash(deltaTime);
			break;

		case GAMESTATE_GAME:
			runGame(deltaTime);
			break;
		case GAMESTATE_ENDGAME:
			endGame();
			break;
		case GAMESTATE_WIN:
			runWin(deltaTime);

	}
	//updateCanvasSize();
	
	
	
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 60, 100);

	context.fillStyle = "#ff00ff";
	context.font="30px Arial";
	context.fillText("position: " + Math.ceil(chuck.x) + ", "+ Math.ceil(chuck.y), 5, 80);
}


//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
