/* jshint strict: false */
/* global X_LOW, X_HI, Y_LOW, Y_HI, Z_LOW, Z_HI, VELOCITY, NUM_PARTICLES */
/* exported initialize */

function initialize(initial_state) {
	for (var i = 0; i < NUM_PARTICLES; i++) {
		var unit = Math.floor((i % 64) / 16);
		if (unit === 0) {
			initial_state[i * 8 + 0] = X_LOW + Math.random() * (X_HI - X_LOW);
			initial_state[i * 8 + 1] = Y_LOW + Math.random() * (Y_HI - Y_LOW);
			initial_state[i * 8 + 2] = Z_LOW + Math.random() * (Z_HI - Z_LOW);
			initial_state[i * 8 + 4] = (Math.random() - 0.5) * 2.0 * VELOCITY;
			initial_state[i * 8 + 5] = (Math.random() - 0.5) * 2.0 * VELOCITY;
			initial_state[i * 8 + 6] = (Math.random() - 0.5) * 2.0 * VELOCITY;
		}
	}
}