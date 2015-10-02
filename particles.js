//particle
var Particle = function(){
	
	this.x = 0;
	this.y = 0;

	this.vel_x = 0;
	this.vel_y = 0;

	this.life_time = 0.5;
	this.cur_life_time = 0.0;

}
//emitter

var Emitter = function(){
	this.x = 0;
	this.y = 0;

	this.alpha = 1.0

	this.isRunning = false;

	this.image = document.createElement("img");

	this.dir_x = 0.1;
	this.dir_y = 1.0;

	this.rand_dir = false;

	this.width = 0;
	this.height = 0;

	this.particles = [];

	//particles per second
	this.pps = 0;
	this.particles_to_spawn= 0.0;

	this.cur_particle_index = 0;
}

Emitter.prototype.intialize = function(x, y, dir_x, dir_y, width, height, max_particles, 
										life_time, pps, alpha, is_rand_dir, image_src)
{
	this.x = x;
	this.y = y;
	this.dir_x = dir_x;
	this.dir_y = dir_y;
	this.width = width;
	this.height = height;

	this.rand_dir = is_rand_dir;

	this.alpha = alpha;

	this.pps = pps;

	this.image.src = image_src;

	for(var idx = 0; idx < max_particles; idx++){
		this.particles[idx] = new Particle;
		this.particles[idx].life_time = life_time;
	}
}

Emitter.prototype.update = function(deltaTime)
{

	
		
	this.particles_to_spawn += this.pps * deltaTime;

	while (Math.floor(this.particles_to_spawn) > 0)
	{	

		//spawned our particle
		this.particles[this.cur_particle_index].x = this.x;
		this.particles[this.cur_particle_index].y = this.y;

		this.particles[this.cur_particle_index].cur_life_time = this.particles[this.cur_particle_index].life_time;

		if(this.width != 0 || this.height != 0){
			this.particles[this.cur_particle_index].x += Math.random() * this.width;
			this.particles[this.cur_particle_index].y += Math.random() * this.height;
		}

		if(this.rand_dir)
		{
			var rand_dir_x = (Math.random() - 0.5) * 2 * 100;
			var rand_dir_y = Math.abs((Math.random() - 0.5) * 2 * 100);

			var length = Math.sqrt(rand_dir_x * rand_dir_x + rand_dir_y * rand_dir_y);

			if (length == 0){
				rand_dir_x = 1;
			}

			this.particles[this.cur_particle_index].vel_x = rand_dir_x / length;
			this.particles[this.cur_particle_index].vel_y = rand_dir_y / length;

		}
		else
		{
			this.particles[this.cur_particle_index].vel_x = this.dir_x;
			this.particles[this.cur_particle_index].vel_y = this.dir_y;
		}
		

		this.cur_particle_index++;
		if(this.cur_particle_index >= this.particles.length){
			this.cur_particle_index = 0;
		}

		this.particles_to_spawn --;
	}

	//update all of our particles
	for (var idx = 0; idx < this.particles.length; idx++)
	{

		if (this.particles[idx].cur_life_time > 0)
		{
			this.particles[idx].x += this.particles[idx].vel_x;
			this.particles[idx].y += this.particles[idx].vel_y;
			this.particles[idx].cur_life_time -= deltaTime;
		}
		
	}
}

Emitter.prototype.draw = function(_cam_x, _cam_y){
	for (var idx = 0; idx < this.particles.length; idx++)
	{

		if (this.particles[idx].cur_life_time > 0)
		{
			context.save();
				context.globalAlpha = this.alpha;
				context.drawImage(this.image, 
									this.particles[idx].x - _cam_x,
									this.particles[idx].y - _cam_y);
			context.restore();
		}
		
	}
}