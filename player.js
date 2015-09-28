var Player = function(){
	this.image = document.createElement("img");
	
	this.x = SCREEN_WIDTH/2;
	this.y = SCREEN_HEIGHT/2;
	this.width = 159;
	this.height = 163;

	this.velocityX =  0;
	this.velocityY = 0;
	this.angularVelocity = 0;
	this.rotation = 0;

	this.image.src = "hero.png";
}

Player.prototype.Update = function(deltaTime) {

	if ( typeof(this.rotation) === "undefined"){
		this.rotation = 0;
	}

	if(keyboard.isKeyDown(keyboard.KEY_SPACE)){
		this.rotation -= deltaTime;
	}
	else {
		this.rotation += deltaTime;
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