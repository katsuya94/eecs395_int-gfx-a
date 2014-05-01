/* jshint strict: false */
/* global gl: true, canvas: true, createProgram, init_system, init_camera, Stats, mat4, vec3, FSIZE, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT, NUM_PARTICLES, RUNGE_KUTTA, resize */
/* exported main */

function main() {

	canvas = document.getElementById('webgl');

	gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	if (!gl.getExtension('OES_texture_float')) {
		return;
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	// Stats
	var stats = new Stats();
	stats.domElement.style.position	= 'fixed';
	stats.domElement.style.left		= '20px';
	stats.domElement.style.top		= '20px';
	document.body.appendChild(stats.domElement);

	// dat.GUI
	var panel = {
		ToggleSolver: function() {
			RUNGE_KUTTA = !RUNGE_KUTTA;
		},
		fire_x: 5.0,
		fire_y: 5.0
	};
	var gui = new dat.GUI();
	gui.add(panel, 'ToggleSolver');
	gui.add(panel, 'fire_x').min(-10.0).max(10.0);
	gui.add(panel, 'fire_y').min(-10.0).max(10.0);

	// Shader Programs
	var program_phys = createProgram(
		document.getElementById('phys-vs').text,
		document.getElementById('phys-fs').text);
	var program_calc = createProgram(
		document.getElementById('calc-vs').text,
		document.getElementById('calc-fs').text);
	var program_slvr = createProgram(
		document.getElementById('slvr-vs').text,
		document.getElementById('slvr-fs').text);
	var program_draw = createProgram(
		document.getElementById('draw-vs').text,
		document.getElementById('draw-fs').text);
	var program_stat = createProgram(
		document.getElementById('stat-vs').text,
		document.getElementById('stat-fs').text);

	// Set Up Render2Texture
	var system = init_system(program_phys, program_calc, program_slvr, program_draw, program_stat);

	// Set up Camera (TODO)
	var camera = init_camera();

	// Calls Physics Shader with specific input/output
	var solve = function(source_dot_id, target_dot, dt) {
		gl.uniform1i(program_phys.u_dot, source_dot_id);
		gl.uniform1f(program_phys.u_dt, dt);

		gl.bindFramebuffer(gl.FRAMEBUFFER, target_dot);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	};

	var last = Date.now();

	gl.useProgram(program_draw);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

	var frame = function() {
		var now	= Date.now();
		var dt	= (now - last) / 1000.0;
		last 	= now;

		stats.begin();

		gl.viewport(0, 0, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT);

		gl.useProgram(program_phys);

		// PHYSICS
		gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_rectangle);
		gl.vertexAttribPointer(program_phys.a_rectangle, 2, gl.FLOAT, false, 0, 0);

		if (!RUNGE_KUTTA) {
			//EULER
			solve(1, system.fb_dot1, 0.0);
		} else {
			//RUNGE KUTTA
			solve(0, system.fb_dot1, 0.0);
			solve(1, system.fb_dot2, dt / 2.0);
			solve(2, system.fb_dot3, dt / 2.0);
			solve(3, system.fb_dot4, dt);

			gl.useProgram(program_slvr);

			gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_rectangle);
			gl.vertexAttribPointer(program_slvr.a_rectangle, 2, gl.FLOAT, false, 0, 0);

			gl.bindFramebuffer(gl.FRAMEBUFFER, system.fb_dot1);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}

		// CALCULATION
		gl.useProgram(program_calc);
		gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_rectangle);
		gl.vertexAttribPointer(program_calc.a_rectangle, 2, gl.FLOAT, false, 0, 0);

		gl.uniform2f(program_calc.u_fire, panel.fire_x, panel.fire_y);
		gl.uniform1f(program_calc.u_dt, dt);

		gl.bindFramebuffer(gl.FRAMEBUFFER, system.fb_state);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		// DRAWING
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

		mat4.rotateZ(camera.rotate, camera.rotate, dt * ((camera.dirpad[0] ? -1 : 0) + (camera.dirpad[2] ? 1 : 0)));
		mat4.rotateX(camera.altitude, camera.altitude, dt * ((camera.dirpad[1] ? -1 : 0) + (camera.dirpad[3] ? 1 : 0)));
		mat4.multiply(camera.view, camera.altitude, camera.rotate);
		mat4.adjoint(camera.correction, camera.view);
		vec3.set(camera.front, 0.0, 0.0, 1.0);
		vec3.transformMat4(camera.front, camera.front, camera.correction);
		vec3.normalize(camera.front, camera.front);
		vec3.copy(camera.right, camera.front);
		vec3.scale(camera.front, camera.front, dt * ((camera.wasd[1] ? 1 : 0) + (camera.wasd[3] ? -1 : 0)) * 10.0);
		vec3.add(camera.position, camera.position, camera.front);
		vec3.cross(camera.right, camera.right, camera.upward);
		vec3.scale(camera.right, camera.right, dt * ((camera.wasd[0] ? -1 : 0) + (camera.wasd[2] ? 1 : 0)) * 10.0);
		vec3.add(camera.position, camera.position, camera.right);
		vec3.copy(camera.right, camera.upward);
		vec3.scale(camera.right, camera.right, dt * ((camera.qe[0] ? 1 : 0) + (camera.qe[1] ? -1 : 0)) * 10.0);
		vec3.add(camera.position, camera.position, camera.right);
		mat4.translate(camera.view, camera.view, camera.position);
		mat4.multiply(camera.vp, camera.projection, camera.view);

		gl.useProgram(program_draw);
		gl.uniformMatrix4fv(program_draw.u_vp, false, camera.vp);

		gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_reference);
		gl.vertexAttribPointer(program_draw.a_reference, 2, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.POINTS, 0, NUM_PARTICLES);

		gl.useProgram(program_stat);

		gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_static);
		gl.vertexAttribPointer(program_stat.a_position, 3, gl.FLOAT, false, 6 * FSIZE, 0 * FSIZE);
		gl.vertexAttribPointer(program_stat.a_vertcolor, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);

		gl.uniformMatrix4fv(program_stat.u_vp, false, camera.vp);

		gl.drawArrays(gl.LINES, 0, system.static_size);

		stats.end();
		window.requestAnimationFrame(frame);
	};

	resize();

	window.requestAnimationFrame(frame);
}