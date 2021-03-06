/* jshint strict: false */
/* global gl: true, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT, NUM_PARTICLES, PARTICLES_PER_ROW, NUM_SLOTS, UNITS, FSIZE, grid, box, initialize, adjacencies */
/* exported init_system */

function init_system(system, program_phys, program_calc, program_rk4o, program_draw, program_stat) {
	// Uniforms
	program_phys.u_dt		= gl.getUniformLocation(program_phys, 'u_dt');
	program_calc.u_dt		= gl.getUniformLocation(program_calc, 'u_dt');
	program_phys.u_viewport	= gl.getUniformLocation(program_phys, 'u_viewport');
	program_calc.u_viewport	= gl.getUniformLocation(program_calc, 'u_viewport');
	program_rk4o.u_viewport	= gl.getUniformLocation(program_rk4o, 'u_viewport');
	program_draw.u_viewport	= gl.getUniformLocation(program_draw, 'u_viewport');

	program_phys.u_state	= gl.getUniformLocation(program_phys, 'u_state');
	program_calc.u_state	= gl.getUniformLocation(program_calc, 'u_state');
	program_phys.u_dot		= gl.getUniformLocation(program_phys, 'u_dot');
	program_calc.u_dot		= gl.getUniformLocation(program_calc, 'u_dot');
	program_draw.u_state	= gl.getUniformLocation(program_draw, 'u_state');

	// Runge-Kutta 4th Order
	program_rk4o.u_dot1		= gl.getUniformLocation(program_rk4o, 'u_dot1');
	program_rk4o.u_dot2		= gl.getUniformLocation(program_rk4o, 'u_dot2');
	program_rk4o.u_dot3		= gl.getUniformLocation(program_rk4o, 'u_dot3');
	program_rk4o.u_dot4		= gl.getUniformLocation(program_rk4o, 'u_dot4');

	program_draw.u_vp		= gl.getUniformLocation(program_draw, 'u_vp');
	program_stat.u_vp		= gl.getUniformLocation(program_stat, 'u_vp');

	program_calc.u_fire		= gl.getUniformLocation(program_calc, 'u_fire');

	program_phys.u_adjacencies = gl.getUniformLocation(program_phys, 'u_adjacencies');

	gl.useProgram(program_phys);
	gl.uniform2f(program_phys.u_viewport, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT);
	gl.useProgram(program_calc);
	gl.uniform2f(program_calc.u_viewport, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT);
	gl.useProgram(program_rk4o);
	gl.uniform2f(program_rk4o.u_viewport, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT);
	gl.useProgram(program_draw);
	gl.uniform2f(program_draw.u_viewport, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT);

	// Attributes
	program_phys.a_rectangle = gl.getAttribLocation(program_phys, 'a_rectangle');
	program_calc.a_rectancle = gl.getAttribLocation(program_calc, 'a_rectangle');
	program_rk4o.a_rectancle = gl.getAttribLocation(program_rk4o, 'a_rectangle');
	program_draw.a_reference = gl.getAttribLocation(program_draw, 'a_reference');
	program_stat.a_position = gl.getAttribLocation(program_stat, 'a_position');
	program_stat.a_vertcolor = gl.getAttribLocation(program_stat, 'a_vertcolor');

	var initial_state	= new Float32Array(4 * NUM_PARTICLES * NUM_SLOTS);
	var adjacent		= new Float32Array(4 * NUM_PARTICLES * NUM_SLOTS);

	initialize(initial_state);
	adjacencies(adjacent);

	// Textures
	var texture_adjacent = gl.createTexture();
	gl.activeTexture(gl.TEXTURE5);
	gl.bindTexture(gl.TEXTURE_2D, texture_adjacent);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT, 0, gl.RGBA, gl.FLOAT, adjacent);

	gl.useProgram(program_phys);
	gl.uniform1i(program_phys.u_adjacencies, 5);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	var texture_state = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture_state);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT, 0, gl.RGBA, gl.FLOAT, initial_state);

	gl.useProgram(program_draw);
	gl.uniform1i(program_draw.u_state, 0);
	gl.useProgram(program_calc);
	gl.uniform1i(program_calc.u_state, 0);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	var texture_dot1 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, texture_dot1);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT, 0, gl.RGBA, gl.FLOAT, initial_state);

	gl.useProgram(program_phys);
	gl.uniform1i(program_phys.u_dot, 1);
	gl.useProgram(program_calc);
	gl.uniform1i(program_calc.u_dot, 1);
	gl.useProgram(program_rk4o);
	gl.uniform1i(program_rk4o.u_dot1, 1);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	var texture_dot2 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, texture_dot2);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT, 0, gl.RGBA, gl.FLOAT, initial_state);

	gl.useProgram(program_rk4o);
	gl.uniform1i(program_rk4o.u_dot2, 2);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	var texture_dot3 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, texture_dot3);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT, 0, gl.RGBA, gl.FLOAT, initial_state);

	gl.useProgram(program_rk4o);
	gl.uniform1i(program_rk4o.u_dot3, 3);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	var texture_dot4 = gl.createTexture();
	gl.activeTexture(gl.TEXTURE4);
	gl.bindTexture(gl.TEXTURE_2D, texture_dot4);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT, 0, gl.RGBA, gl.FLOAT, initial_state);

	gl.useProgram(program_rk4o);
	gl.uniform1i(program_rk4o.u_dot4, 4);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	// Framebuffers
	system.fb_state = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, system.fb_state);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_state, 0);

	system.fb_dot1 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, system.fb_dot1);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_dot1, 0);

	system.fb_dot2 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, system.fb_dot2);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_dot2, 0);

	system.fb_dot3 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, system.fb_dot3);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_dot3, 0);

	system.fb_dot4 = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, system.fb_dot4);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_dot4, 0);

	var reference	= new Float32Array(NUM_PARTICLES * 3);
	var interval	= 1.0 / PARTICLES_PER_ROW;

	for (var i = 0; i < NUM_PARTICLES; i++) {
		reference[i * 3]		= interval * ~~(i % PARTICLES_PER_ROW);
		reference[i * 3 + 1]	= interval * ~~(i / PARTICLES_PER_ROW);
		reference[i * 3 + 2]	= ~~((i % PARTICLES_PER_ROW) / (PARTICLES_PER_ROW / UNITS));
	}

	system.buffer_reference = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_reference);
	gl.bufferData(gl.ARRAY_BUFFER, reference, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(program_draw.a_reference);

	// Make a rectangle that draws over the whole buffer
	system.buffer_rectangle = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_rectangle);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		-1.0, -1.0,
		 1.0, -1.0,
		-1.0,  1.0,
		 1.0,  1.0,
	]), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(program_phys.a_rectangle);
	gl.enableVertexAttribArray(program_calc.a_rectangle);
	gl.enableVertexAttribArray(program_rk4o.a_rectangle);
}