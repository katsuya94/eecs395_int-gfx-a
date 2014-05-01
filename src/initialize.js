/* jshint strict: false */
/* global NUM_PARTICLES */
/* exported initialize */

var X_HI		= 10.0;
var X_LOW		= -10.0;
var Y_HI		= 10.0;
var Y_LOW		= -10.0;
var Z_HI		= 20.0;
var Z_LOW		= 0.0;

var TORNADO_COLUMN = 1.0 / 16.0;

var VELOCITY	= 0.0;

function initialize(initial_state) {
	for (var i = 0; i < NUM_PARTICLES; i++) {
		var unit = Math.floor((i % 64) / 16);
		if (unit === 0) {
			initial_state[i * 8 + 0] = -TORNADO_COLUMN + Math.random() * TORNADO_COLUMN * 2.0;
			initial_state[i * 8 + 1] = -TORNADO_COLUMN + Math.random() * TORNADO_COLUMN * 2.0;
			initial_state[i * 8 + 2] = -TORNADO_COLUMN + Math.random() * TORNADO_COLUMN * 2.0;
			initial_state[i * 8 + 4] = (Math.random() - 0.5) * 2.0 * VELOCITY;
			initial_state[i * 8 + 5] = (Math.random() - 0.5) * 2.0 * VELOCITY;
			initial_state[i * 8 + 6] = (Math.random() - 0.5) * 2.0 * VELOCITY;
		} else if (unit === 1) {
			initial_state[i * 8 + 0] = X_LOW + Math.random() * (X_HI - X_LOW);
			initial_state[i * 8 + 1] = Y_LOW + Math.random() * (Y_HI - Y_LOW);
			initial_state[i * 8 + 2] = Z_LOW + Math.random() * (Z_HI - Z_LOW);
			initial_state[i * 8 + 4] = (Math.random() - 0.5) * 2.0 * VELOCITY;
			initial_state[i * 8 + 5] = (Math.random() - 0.5) * 2.0 * VELOCITY;
			initial_state[i * 8 + 6] = (Math.random() - 0.5) * 2.0 * VELOCITY;
		}
	}
}