module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				// define a string to put between each file in the concatenated output
				separator: ';',
				stripBanners: { block: true }
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