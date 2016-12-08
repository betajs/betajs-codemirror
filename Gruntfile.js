module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var gruntHelper = require('betajs-compile/grunt.js');
	var dist = 'betajs-codemirror';

	gruntHelper.init(pkg, grunt)
	
	
    /* Compilation */    
    .scopedclosurerevisionTask(null, "src/**/*.js", "dist/" + dist + "-noscoped.js", {
		"module": "global:BetaJS.Dynamics.Codemirror",
		"base": "global:BetaJS",
		"dynamics": "global:BetaJS.Dynamics"
    })	
    .concatTask('concat-scoped', ['vendors/scoped.js', 'dist/' + dist + '-noscoped.js'], 'dist/' + dist + '.js')
    .uglifyTask('uglify-noscoped', 'dist/' + dist + '-noscoped.js', 'dist/' + dist + '-noscoped.min.js')
    .uglifyTask('uglify-scoped', 'dist/' + dist + '.js', 'dist/' + dist + '.min.js')
    .concatTask('concat-css', ['src/*.css'], 'dist/' + dist + ".css")
    .cssminTask('cssminify', 'dist/' + dist + ".css", 'dist/' + dist + ".min.css")
    .packageTask()

    /* Testing */
    .closureTask(null, ["./vendors/scoped.js", "./vendors/beta-noscoped.js",  "./vendors/betajs-browser-noscoped.js", "./vendors/betajs-dynamics-noscoped.js", "./dist/betajs-codemirror-noscoped.js"], null, {  })
    .lintTask(null, ['./src/**/*.js', './dist/' + dist + '-noscoped.js', './dist/' + dist + '.js', './Gruntfile.js'])
    .csslinterTask(null, ['dist/betajs-codemirror.css'])
    
    /* External Configurations */
    .codeclimateTask()
    
    /* Dependencies */
    .dependenciesTask(null, { github: [
        'betajs/betajs-scoped/dist/scoped.js',
        'betajs/betajs/dist/beta-noscoped.js',
        'betajs/betajs-browser/dist/betajs-browser-noscoped.js',
        'betajs/betajs-dynamics/dist/betajs-dynamics-noscoped.js'
     ] })

    /* Markdown Files */
	.readmeTask()
    .licenseTask()
    
    /* Documentation */
    .docsTask();

	grunt.initConfig(gruntHelper.config);	

	grunt.registerTask('default', ['package', 'readme', 'license', 'codeclimate', 'scopedclosurerevision', 'concat-scoped', 'uglify-noscoped', 'uglify-scoped', 'concat-css', 'cssminify']);
	grunt.registerTask('check', ['lint', 'csslinter']);

};
