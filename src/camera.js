/* jshint strict: false */
/* global projection: true, mat4, vec3 */
/* exported init_camera */

function init_camera() {
	var camera = {};
	cam = camera;

	camera.view = mat4.create();
	camera.altitude = -Math.PI / 4;
	camera.direction = -3 * Math.PI / 4;

	camera.projection = mat4.create();
	projection = camera.projection; // Global

	camera.up = vec3.create();
	camera.upr = vec3.create();
	vec3.set(camera.up, 0.0, 1.0, 0.0);
	camera.right = vec3.create();
	camera.rightr = vec3.create();
	vec3.set(camera.right, 1.0, 0.0, 0.0);
	camera.front = vec3.create();
	camera.frontr = vec3.create();
	vec3.set(camera.front, 0.0, 0.0, 1.0);

	camera.rotate = mat4.create();
	camera.adjoint = mat4.create();

	camera.position = vec3.create();
	vec3.set(camera.position, -10.0, -10.0, -20.0);

	camera.vp = mat4.create();

	camera.dirpad = [false, false, false, false];
	camera.wasd = [false, false, false, false];
	camera.qe = [false, false];

	window.onkeydown = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		switch (key) {
		case 37:
			camera.dirpad[0] = true;
			break;
		case 38:
			camera.dirpad[1] = true;
			break;
		case 39:
			camera.dirpad[2] = true;
			break;
		case 40:
			camera.dirpad[3] = true;
			break;
		case 65:
			camera.wasd[0] = true;
			break;
		case 87:
			camera.wasd[1] = true;
			break;
		case 68:
			camera.wasd[2] = true;
			break;
		case 83:
			camera.wasd[3] = true;
			break;
		case 81:
			camera.qe[0] = true;
			break;
		case 69:
			camera.qe[1] = true;
			break;
		case 112:
			document.getElementById('help').style.display = 'block';
			break;
		}
	};

	window.onkeyup = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		switch(key) {
		case 37:
			camera.dirpad[0] = false;
			break;
		case 38:
			camera.dirpad[1] = false;
			break;
		case 39:
			camera.dirpad[2] = false;
			break;
		case 40:
			camera.dirpad[3] = false;
			break;
		case 65:
			camera.wasd[0] = false;
			break;
		case 87:
			camera.wasd[1] = false;
			break;
		case 68:
			camera.wasd[2] = false;
			break;
		case 83:
			camera.wasd[3] = false;
			break;
		case 81:
			camera.qe[0] = false;
			break;
		case 69:
			camera.qe[1] = false;
			break;
		case 112:
			document.getElementById('help').style.display = 'none';
			break;
		}
	};

	return camera;
}