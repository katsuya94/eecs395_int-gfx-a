/* jshint strict: false */
/* global gl: true, canvas: true, mat4, projection */
/* exported createShader, createProgram, resize */
function createShader(source, type) {

	var shader = gl.createShader( type );

	gl.shaderSource( shader, source );
	gl.compileShader( shader );

	if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
		throw gl.getShaderInfoLog( shader );

	return shader;
}

// Creates a shader program and creates / links shaders
function createProgram(vertexSource, fragmentSource) {

	var vs = createShader( vertexSource, gl.VERTEX_SHADER );
	var fs = createShader( fragmentSource, gl.FRAGMENT_SHADER );

	var program = gl.createProgram();

	gl.attachShader( program, vs );
	gl.attachShader( program, fs );
	gl.linkProgram( program );

	if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) )
		throw gl.getProgramInfoLog( program );

	return program;
}

function resize() {
	gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	mat4.perspective(projection, Math.PI / 3, gl.drawingBufferWidth/gl.drawingBufferHeight, 0.1, 100.0);
}