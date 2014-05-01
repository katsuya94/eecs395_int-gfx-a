function init_camera() {
	var camera = {};
	camera.view = mat4.create();

	camera.projection = mat4.create();
	projection = camera.projection; // GLOBAL

	camera.rotate = mat4.create();
	camera.altitude = mat4.create();
	camera.direction = mat4.create();
	mat4.rotateX(camera.altitude, camera.altitude, Math.PI);

	camera.correction = mat4.create();
	camera.upward = vec3.create();
	vec3.set(camera.upward, 0.0, 0.0, 1.0);
	camera.front = vec3.create();
	camera.right = vec3.create();

	camera.position = vec3.create();
	vec3.set(camera.position, 2.0, 2.0, 2.0);

	camera.vp = mat4.create();

	camera.dirpad = [false, false, false, false];
	camera.wasd = [false, false, false, false];
	camera.qe = [false, false];

	window.onkeydown = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		if (key === 37)
			camera.dirpad[0] = true;
		if (key === 38)
			camera.dirpad[1] = true;
		if (key === 39)
			camera.dirpad[2] = true;
		if (key === 40)
			camera.dirpad[3] = true;
		if (key === 65)
			camera.wasd[0] = true;
		if (key === 87)
			camera.wasd[1] = true;
		if (key === 68)
			camera.wasd[2] = true;
		if (key === 83)
			camera.wasd[3] = true;
		if (key === 81)
			camera.qe[0] = true;
		if (key === 69)
			camera.qe[1] = true;
	}

	window.onkeyup = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		if (key === 37)
			camera.dirpad[0] = false;
		if (key === 38)
			camera.dirpad[1] = false;
		if (key === 39)
			camera.dirpad[2] = false;
		if (key === 40)
			camera.dirpad[3] = false;
		if (key === 65)
			camera.wasd[0] = false;
		if (key === 87)
			camera.wasd[1] = false;
		if (key === 68)
			camera.wasd[2] = false;
		if (key === 83)
			camera.wasd[3] = false;
		if (key === 81)
			camera.qe[0] = false;
		if (key === 69)
			camera.qe[1] = false;
	}

	return camera;
}