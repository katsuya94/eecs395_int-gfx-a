/* jshint strict: false */
/* exported: init_static */
function init_static(system, program_stat) {
	system.axes_size = 6;
	system.box_size = 36;

	var grid_vertices = grid();
	system.grid_size = grid_vertices.length / 6;

	var spherical_bound = sphere(system.grid_size + system.axes_size + system.box_size, -5.0, -5.0, 7.5);

	var values = new Float32Array([
		// Axes
		0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
		2.0, 0.0, 0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
		0.0, 2.0, 0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
		0.0, 0.0, 2.0, 0.0, 0.0, 1.0,
	].concat(grid_vertices).concat(box(5.0, 5.0, 7.5)).concat(spherical_bound.vertices));

	var indices = new Uint16Array(spherical_bound.indices);
	system.sphere_index_size = spherical_bound.indices.length;

	system.buffer_static = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, system.buffer_static);
	gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
	gl.vertexAttribPointer(program_stat.a_position, 3, gl.FLOAT, false, 6 * FSIZE, 0 * FSIZE);
	gl.vertexAttribPointer(program_stat.a_vertcolor, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
	gl.enableVertexAttribArray(program_stat.a_position);
	gl.enableVertexAttribArray(program_stat.a_vertcolor);

	var buffer_static_elements = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer_static_elements);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
}