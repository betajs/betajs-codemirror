module.banner = '/*!\n<%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\nCopyright (c) <%= pkg.contributors %>\n<%= pkg.license %> Software License.\n*/\n';

module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		'revision-count' : {
			options : {
				property : 'revisioncount',
				ref : 'HEAD'
			}
		},
		concat : {
			options : {
				banner : module.banner
			},
			dist_raw : {
				dest : 'dist/betajs-codemirror-raw.js',
				src : [ 'src/fragments/begin.js-fragment',
				        'src/*.js',
						'src/fragments/end.js-fragment' ]
			},
			dist_scoped : {
				dest : 'dist/betajs-codemirror.js',
				src : [ 'vendors/scoped.js',
						'dist/betajs-codemirror-noscoped.js' ]
			},
			dist_css : {
				dest : 'dist/betajs-codemirror.css',
				src : [
			        'src/*.css'
				]
			}
		},
		preprocess : {
			options : {
				context : {
					MAJOR_VERSION : '<%= revisioncount %>',
					MINOR_VERSION : (new Date()).getTime()
				}
			},
			dist : {
				src : 'dist/betajs-codemirror-raw.js',
				dest : 'dist/betajs-codemirror-noscoped.js'
			}
		},
		clean : {
			raw:"dist/betajs-codemirror-raw.js",
			closure:"dist/betajs-codemirror-closure.js"
		},
		uglify : {
			options : {
				banner : module.banner
			},
			dist : {
				files : {
					'dist/betajs-codemirror-noscoped.min.js' : [ 'dist/betajs-codemirror-noscoped.js' ],
					'dist/betajs-codemirror.min.js' : [ 'dist/betajs-codemirror.js' ]
				}
			}
		},
		jshint : {
			options: {
				es5: false,
				es3: true
			},
			source : [ "./src/*.js"],
			dist : [ "./dist/betajs-codemirror-noscoped.js", "./dist/betajs-codemirror.js" ],
			gruntfile : [ "./Gruntfile.js" ]
		},
		closureCompiler : {
			options : {
				compilerFile : process.env.CLOSURE_PATH + "/compiler.jar",
				compilerOpts : {
					compilation_level : 'ADVANCED_OPTIMIZATIONS',
					warning_level : 'verbose',
					externs : [ "./src/fragments/closure.js-fragment", "./vendors/jquery-1.9.closure-extern.js" ]
				}
			},
			dist : {
				src : [ "./vendors/beta.js",
						"./vendors/beta-browser-noscoped.js",
						"./vendors/betajs-dynamics-noscoped.js",
						"./dist/betajs-codemirror-noscoped.js"],
				dest : "./dist/betajs-codemirror-closure.js"
			}
		},
		wget : {
			dependencies : {
				options : {
					overwrite : true
				},
				files : {
					"./vendors/scoped.js" : "https://raw.githubusercontent.com/betajs/betajs-scoped/master/dist/scoped.js",
					"./vendors/beta.js" : "https://raw.githubusercontent.com/betajs/betajs/master/dist/beta.js",
					"./vendors/beta-browser-noscoped.js" : "https://raw.githubusercontent.com/betajs/betajs-browser/master/dist/beta-browser-noscoped.js",
					"./vendors/betajs-dynamics-noscoped.js" : "https://raw.githubusercontent.com/betajs/betajs-dynamics/master/dist/betajs-dynamics-noscoped.js",
					"./vendors/jquery-1.9.closure-extern.js" : "https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/jquery-1.9.js"
				}
			}
		},
		template : {
			"readme" : {
				options : {
					data: {
						indent: "",
						framework: grunt.file.readJSON('package.json')
					}
				},
				files : {
					"README.md" : ["readme.tpl"]
				}
			}
		},
		cssmin: {
			options : {
				banner : module.banner
			},
			dist : {
				files : {
					'dist/betajs-codemirror.min.css' : [ 'dist/betajs-codemirror.css' ]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-git-revision-count');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-wget');
	grunt.loadNpmTasks('grunt-closure-tools');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-node-qunit');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-template');	

	grunt.registerTask('default', [ 'revision-count', 'concat:dist_raw', 'concat:dist_css',
			'preprocess', 'clean:raw', 'concat:dist_scoped', 'uglify' ]);
	grunt.registerTask('lint', [ 'jshint:source', 'jshint:dist',
	                 			 'jshint:gruntfile' ]);
	grunt.registerTask('check', [ 'lint' ]);
	grunt.registerTask('dependencies', [ 'wget:dependencies' ]);
	grunt.registerTask('closure', [ 'closureCompiler', 'clean:raw' ]);
	grunt.registerTask('readme', [ 'template:readme' ]);

};