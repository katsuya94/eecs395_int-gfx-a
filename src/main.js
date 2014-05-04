/* jshint strict: false */
/* global gl: true, canvas: true, createProgram, init_system, init_camera, Stats, mat4, vec3, FSIZE, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT, NUM_PARTICLES, MODE: true, PAUSED: true, resize, dat, init_static */
/* exported main */

function main() {

	canvas = document.getElementById('webgl');

	gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	if (!gl.getExtension('OES_texture_float')) {
		throw 'Your browser does not support Floating-Point Textures.';
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
		Mode: 0,
		PausePlay: function() {
			PAUSED = !PAUSED;
		},
		fire_x: -5.0,
		fire_y: -5.0
	};
	var gui = new dat.GUI();
	gui.add(panel, 'Mode', { Euler: 0, Midpoint: 1, RK4: 2 }).onChange(function(val) {
		MODE = val;
	});
	gui.add(panel, 'PausePlay');
	gui.add(panel, 'fire_x').min(-10).max(10).step(0.05);
	gui.add(panel, 'fire_y').min(-10).max(10).step(0.05);

	// Shader Programs
	var program_phys = createProgram(
		document.getElementById('phys-vs').text,
		document.getElementById('phys-fs').text);
	var program_calc = createProgram(
		document.getElementById('calc-vs').text,
		document.getElementById('calc-fs').text);
	var program_rk4o = createProgram(
		document.getElementById('rk4o-vs').text,
		document.getElementById('rk4o-fs').text);
	var program_draw = createProgram(
		document.getElementById('draw-vs').text,
		document.getElementById('draw-fs').text);
	var program_stat = createProgram(
		document.getElementById('stat-vs').text,
		document.getElementById('stat-fs').text);

	var system = {};

	// Set Up Render To Texture
	init_system(system, program_phys, program_calc, program_rk4o, program_draw, program_stat);

	// Set Up Static Elements
	init_static(system, program_stat);

	// Set up Camera (TODO)
	var camera = init_camera();

	// Calls Physics Shader with specific input/output
	var solve = function(source_dot_id, target_dot, dt) {
		gl.uniform1i(program_phys.u_dot, source_dot_id);
		gl.uniform1f(program_phys.u_dt, dt);

		gl.bindFramebuffer(gl.FRAMEBUFFER, target_dot);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	};

	var solvers = [
		function() {
			// Euler Method
			solve(0, system.fb_dot1, 0.0);
		},
		function(dt) {
			// Explicit Midpoint Method
			solve(0, system.fb_dot2, 0.0);
			solve(2, system.fb_dot1, dt / 2.0);
		},
		function(dt) {
			// Runge-Kutta 4
			solve(0, system.fb_dot1, 0.0);
			solve(1, system.fb_dot2, dt / 2.0);
			solve(2, system.fb_dot3, dt / 2.0);
			solve(3, system.fb_dot4, dt);

			gl.useProgram(program_rk4o);

			gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_rectangle);
			gl.vertexAttribPointer(program_rk4o.a_rectangle, 2, gl.FLOAT, false, 0, 0);

			gl.bindFramebuffer(gl.FRAMEBUFFER, system.fb_dot1);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}
	];

	var last = Date.now();

	gl.useProgram(program_draw);
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

	var frame = function() {
		var now	= Date.now();
		var dt	= (now - last) / 1000.0;
		last 	= now;

		stats.begin();

		if (!PAUSED) {
			gl.viewport(0, 0, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT);

			gl.useProgram(program_phys);

			// PHYSICS
			gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_rectangle);
			gl.vertexAttribPointer(program_phys.a_rectangle, 2, gl.FLOAT, false, 0, 0);

			solvers[MODE](dt);

			// CALCULATION
			gl.useProgram(program_calc);
			gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_rectangle);
			gl.vertexAttribPointer(program_calc.a_rectangle, 2, gl.FLOAT, false, 0, 0);

			gl.uniform2f(program_calc.u_fire, panel.fire_x, panel.fire_y);
			gl.uniform1f(program_calc.u_dt, dt);

			gl.bindFramebuffer(gl.FRAMEBUFFER, system.fb_state);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}

		// DRAWING
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

		camera.altitude += dt * ((camera.dirpad[3] ? 1 : 0) + (camera.dirpad[1] ? -1 : 0));
		camera.direction += dt * ((camera.dirpad[2] ? 1 : 0) + (camera.dirpad[0] ? -1 : 0));
		mat4.identity(camera.rotate);
		mat4.rotateX(camera.rotate, camera.rotate, camera.altitude);
		mat4.rotateZ(camera.rotate, camera.rotate, camera.direction);
		mat4.adjoint(camera.adjoint, camera.rotate);
		vec3.transformMat4(camera.frontr, camera.front, camera.adjoint);
		vec3.scale(camera.frontr, camera.frontr, dt * ((camera.wasd[1] ? 10 : 0) + (camera.wasd[3] ? -10 : 0)));
		vec3.transformMat4(camera.upr, camera.up, camera.adjoint);
		vec3.scale(camera.upr, camera.upr, dt * ((camera.qe[0] ? 10 : 0) + (camera.qe[1] ? -10 : 0)));
		vec3.transformMat4(camera.rightr, camera.right, camera.adjoint);
		vec3.scale(camera.rightr, camera.rightr, dt * ((camera.wasd[0] ? 10 : 0) + (camera.wasd[2] ? -10 : 0)));
		vec3.add(camera.position, camera.position, camera.frontr);
		vec3.add(camera.position, camera.position, camera.upr);
		vec3.add(camera.position, camera.position, camera.rightr);
		mat4.translate(camera.view, camera.rotate, camera.position);
		mat4.multiply(camera.vp, camera.projection, camera.view);

		gl.useProgram(program_draw);
		gl.uniformMatrix4fv(program_draw.u_vp, false, camera.vp);

		gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_reference);
		gl.vertexAttribPointer(program_draw.a_reference, 3, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.POINTS, 0, NUM_PARTICLES);

		gl.useProgram(program_stat);

		gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_static);
		gl.vertexAttribPointer(program_stat.a_position, 3, gl.FLOAT, false, 6 * FSIZE, 0 * FSIZE);
		gl.vertexAttribPointer(program_stat.a_vertcolor, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);

		gl.uniformMatrix4fv(program_stat.u_vp, false, camera.vp);

		gl.drawArrays(gl.LINES, 0, system.axes_size + system.grid_size);
		gl.drawArrays(gl.TRIANGLES, system.axes_size + system.grid_size, system.box_size);
		gl.drawElements(gl.TRIANGLES, system.sphere_index_size, gl.UNSIGNED_SHORT, 0);

		stats.end();
		window.requestAnimationFrame(frame);
	};

	resize();

	window.requestAnimationFrame(frame);
}