module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		betajs_templates: {
			dist: {
			    files: {
				  "dist/templates.js": [ 
  			          'src/views/*/template.html',
					]
				}
			}
		},
		concat : {
			options : {
				banner : '/*!\n'
						+ '  <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n'
						+ '  Copyright (c) Victor Lingenthal\n'
						+ '  MIT Software License.\n' + '*/\n'
			},
			dist : {
				dest : 'dist/betajs-codemirror.js',
				src : [
			        'dist/templates.js',
			        'src/views/simple_code_mirror_view/view.js',
			        'src/views/code_mirror_view/view.js',
			        'src/views/preview_view/view.js',
				]
			},
			dist_scss: {
				dest : 'dist/betajs-codemirror.scss',
				src : [
			        'src/views/*/styles.scss',
			    ]
			},
		},
		sass: {
			dist: {
		    	files: {
			        'dist/betajs-codemirror.css': 'dist/betajs-codemirror.scss'
		    	}
		    }
		},
		uglify : {
			dist : {
				files : {
					'dist/betajs-codemirror.min.js' : [ 'dist/betajs-codemirror.js' ],
				}
			}
		},
		cssmin: {
			options : {
				banner : '/*!\n'
						+ '  <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n'
						+ '  Copyright (c) Victor Lingenthal\n'
						+ '  MIT Software License.\n' + '*/\n'
			},
			dist : {
				files : {
					'dist/betajs-codemirror.min.css' : [ 'dist/betajs-codemirror.css' ]
				}
			}
		},
		clean: [
			"dist/templates.js",
			"dist/betajs-codemirror.scss"
		]
	});

	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');	
	grunt.loadNpmTasks('grunt-contrib-cssmin');	
	grunt.loadNpmTasks('grunt-contrib-clean');	
	grunt.loadNpmTasks('grunt-betajs-templates');	
	

	grunt.registerTask('default', ['newer:betajs_templates', 'newer:concat', 'newer:sass', 'newer:uglify', 'newer:cssmin']);

};