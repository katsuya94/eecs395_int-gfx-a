/* jshint strict: false */
/* exported X_LOW, X_HI, Y_LOW, Y_HI, Z_LOW, Z_HI, VELOCITY, NUM_PARTICLES, STATE_TEXTURE_WIDTH, STATE_TEXTURE_HEIGHT, GRID_NUM, GRID_INT, FSIZE, RUNGE_KUTTA */

var NUM_PARTICLES			= Math.pow(64, 2);
var NUM_SLOTS				= 2;
var PARTICLES_PER_ROW		= Math.sqrt(NUM_PARTICLES);
var STATE_TEXTURE_WIDTH		= PARTICLES_PER_ROW * NUM_SLOTS;
var STATE_TEXTURE_HEIGHT	= PARTICLES_PER_ROW;

var GRID_NUM	= 10;
var GRID_INT	= 1.0;

var FSIZE	= new Float32Array([]).BYTES_PER_ELEMENT;

var RUNGE_KUTTA = false;