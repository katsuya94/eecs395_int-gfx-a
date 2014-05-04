/* jshint strict: false */
/* exported sphere */

// From JTPointPhongSphere_PerFragment.js
function sphere(offset, x, y, z) {
	var SPHERE_DIV = 51;

	var i, ai, si, ci;
	var j, aj, sj, cj;
	var p1, p2;

	var positions = [];
	var indices = [];

	// Generate coordinates
	for (j = 0; j <= SPHERE_DIV; j++) {
		aj = j * Math.PI / SPHERE_DIV;
		sj = Math.sin(aj);
		cj = Math.cos(aj);
		for (i = 0; i <= SPHERE_DIV; i++) {
			ai = i * 2 * Math.PI / SPHERE_DIV;
			si = Math.sin(ai);
			ci = Math.cos(ai);

			// Positions
			positions.push(2 * si * sj + x);
			positions.push(2 * cj + y);
			positions.push(2 * ci * sj + z);
			// Colors
			positions.push(ci * sj * 0.25 + 0.5);
			positions.push(ci * sj * 0.25 + 0.5);
			positions.push(ci * sj * 0.25 + 0.5);
		}
	}

	// Generate indices
	for (j = 0; j < SPHERE_DIV; j++) {
		for (i = 0; i < SPHERE_DIV; i++) {
			p1 = j * (SPHERE_DIV+1) + i;
			p2 = p1 + (SPHERE_DIV+1);

			indices.push(p1 + offset);
			indices.push(p2 + offset);
			indices.push(p1 + 1 + offset);

			indices.push(p1 + 1 + offset);
			indices.push(p2 + offset);
			indices.push(p2 + 1 + offset);
		}
	}

	return {
		vertices: positions,
		indices: indices
	};
}