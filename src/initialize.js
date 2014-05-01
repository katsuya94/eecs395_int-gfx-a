/* jshint strict: false */
/* global NUM_PARTICLES */
/* exported initialize */

var X_HI	= 10.0;
var X_LOW	= -10.0;
var Y_HI	= 10.0;
var Y_LOW	= -10.0;
var Z_HI	= 20.0;
var Z_LOW	= 0.0;

var BOID_X	= 5.0;
var BOID_Y	= 5.0;
var BOID_Z	= 5.0;
var BOID_R	= 0.5;

var TORNADO_COLUMN = 1.0 / 16.0;

var VELOCITY = 2.0;
var R_VELOCITY = 5.0;

function initialize(initial_state) {
	var count = 0;
	for (var i = 0; i < NUM_PARTICLES; i++) {
		var unit = Math.floor((i % 64) / 16);
		if (unit === 0) {
			initial_state[i * 8 + 0] = -TORNADO_COLUMN + Math.random() * TORNADO_COLUMN * 2.0;
			initial_state[i * 8 + 1] = -TORNADO_COLUMN + Math.random() * TORNADO_COLUMN * 2.0;
			initial_state[i * 8 + 2] = -TORNADO_COLUMN + Math.random() * TORNADO_COLUMN * 2.0;
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
			initial_state[i * 8 + 0] = Math.floor(count / 64) - 8;
			initial_state[i * 8 + 1] = Math.floor((count % 64) / 8) - 4;
			initial_state[i * 8 + 2] = (count % 64) % 8 - 32;
			count++;
		}
	}
	console.log(count);
}