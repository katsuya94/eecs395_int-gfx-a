/* jshint strict: false */
/* global NUM_PARTICLES */
/* exported initialize, adjacencies */

var X_HI	= 10.0;
var X_LOW	= -10.0;
var Y_HI	= 10.0;
var Y_LOW	= -10.0;
var Z_HI	= 20.0;
var Z_LOW	= 0.0;

var TORNADO_COLUMN = 1.0 / 16.0;

var R_VELOCITY = 5.0;

function initialize(initial_state) {
	var count = 0;
	for (var i = 0; i < NUM_PARTICLES; i++) {
		var unit = Math.floor((i % 64) / 16);
		if (unit === 0) {
			initial_state[i * 8 + 0] = (Math.random() - 0.5) * 0.1;
			initial_state[i * 8 + 1] = (Math.random() - 0.5) * 0.1;
			initial_state[i * 8 + 2] = -Math.random() * 0.1;
			initial_state[i * 8 + 3] = Math.random() - 0.5;
			initial_state[i * 8 + 4] = Math.random() - 0.5;
			initial_state[i * 8 + 5] = Math.random() * 0.5;
		} else if (unit === 1) {
			initial_state[i * 8 + 0] = X_LOW + Math.random() * (X_HI - X_LOW);
			initial_state[i * 8 + 1] = Y_LOW + Math.random() * (Y_HI - Y_LOW);
			initial_state[i * 8 + 2] = Z_LOW + Math.random() * (Z_HI - Z_LOW);
			initial_state[i * 8 + 4] = ((Math.random() - 0.5) * 2.0) * R_VELOCITY;
			initial_state[i * 8 + 5] = ((Math.random() - 0.5) * 2.0) * R_VELOCITY;
			initial_state[i * 8 + 6] = ((Math.random() - 0.5) * 2.0) * R_VELOCITY;
		} else if (unit === 2) {
			// Particle must be emitted
			initial_state[i * 8 + 3] = -2.0;
		} else if (unit === 3) {
			initial_state[i * 8 + 0] = (Math.floor(count / 32) / 4) + 1.0;
			initial_state[i * 8 + 1] = (count % 32) / 4 + 1.0;
			initial_state[i * 8 + 2] = 10.0;
			count++;
		}
	}
}

function adjacencies(adj) {
	var id = 0;
	var tex_x = function(x, y) {
		return 96 + (x % 16) * 2;
	};
	var tex_y = function(x, y) {
		return y * 2 + Math.floor(x / 16);
	};
	for (var i = 0; i < NUM_PARTICLES; i++) {
		var unit = Math.floor((i % 64) / 16);
		if (unit === 3) {
			for (var j = 0; j < 8; j++) {
				adj[i * 8 + j] = -1;
			}

			var x = id % 32;
			var y = Math.floor(id / 32);

			if (y > 0) {
				adj[i * 8 + 0] = tex_x(x, y - 1);
				adj[i * 8 + 1] = tex_y(x, y - 1);
			}

			if (y < 31) {
				adj[i * 8 + 2] = tex_x(x, y + 1);
				adj[i * 8 + 3] = tex_y(x, y + 1);
			}

			if (x > 0) {
				adj[i * 8 + 4] = tex_x(x - 1, y);
				adj[i * 8 + 5] = tex_y(x - 1, y);
			}

			if (x < 31) {
				adj[i * 8 + 6] = tex_x(x + 1, y);
				adj[i * 8 + 7] = tex_y(x + 1, y);
			}

			id++;
		}
	}
}