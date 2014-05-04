module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				// define a string to put between each file in the concatenated output
				separator: ';\n\n// FILE SEPARATOR\n\n',
				stripBanners: true,
				banner: '/* Adrien Katsuya Tateno\n   EECS 395 Intermediate Graphics - Spring 2014*/\n\n'
			},
			dist: {
				src: ['vendor/*.js', 'src/*.js'],
				dest: 'dist/particles.js'
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default', ['concat']);
}