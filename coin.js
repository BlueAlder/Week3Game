var ANIM_SPIN = 0;
var ANIM_MAX = 1;

var Coin = function(){
	
	this.sprite = new Sprite("coin-sprite-animation-sprite-sheet.png");
	this.sprite.buildAnimation(1, 10, 44, 40, 0.05,
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
	
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, 0, 0);
	}

	this.x = 420;
	this.y = 420
	this.width = 44;
	this.height = 40;
	
}

Coin.prototype.update = function(deltaTime){
	
}

Coin.prototype.draw = function(){
	
	context.save();
	
	context.beginPath();
	
	context.stroke();
	context.restore();
};