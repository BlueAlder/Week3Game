var MOUSE_UP = 0;
var MOUSE_DOWN = 1;

var Mouse = function()
{
	this.mouseState = MOUSE_UP;

	this.x = 0;
	this.y = 0;

	var self = this;

	canvas.addEventListener("mousemove", function(evt) {self.mouseMove(evt);} );
	canvas.addEventListener("mousedown", function(evt) {self.mouseDown(evt);} );
	canvas.addEventListener("mouseup",   function(evt) {self.mouseUp(evt);} );
}

Mouse.prototype.mouseMove = function(evt){

	this.x = evt.clientX - canvas.offsetLeft;
	this.y = evt.clientY - canvas.offsetTop;
}

Mouse.prototype.mouseDown = function(evt)
{
	this.x = evt.clientX - canvas.offsetLeft;
	this.y = evt.clientY - canvas.offsetTop;

	this.mouseState = MOUSE_DOWN;
}

Mouse.prototype.mouseUp = function(evt){
	this.x = evt.clientX - canvas.offsetLeft;
	this.y = evt.clientY - canvas.offsetTop;

	this.mouseState = MOUSE_UP;
}

Mouse.prototype.getX = function()
{
	return this.x;
}

Mouse.prototype.getY = function()
{
	return this.y;
}