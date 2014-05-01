/* jshint strict: false */
/* global GRID_NUM, GRID_INT */
/* exported grid */

function grid() {
	var array = [];
	for(var i= -GRID_NUM; i <= GRID_NUM; i++) {
		array = array.concat([GRID_INT * GRID_NUM, GRID_INT * i, 0.0, 1.0, 1.0, 1.0]);
		array = array.concat([-GRID_INT * GRID_NUM, GRID_INT * i, 0.0, 1.0, 1.0, 1.0]);
		array = array.concat([GRID_INT * i, GRID_INT * GRID_NUM, 0.0, 1.0, 1.0, 1.0]);
		array = array.concat([GRID_INT * i, -GRID_INT * GRID_NUM, 0.0, 1.0, 1.0, 1.0]);
	}
	return array;
}