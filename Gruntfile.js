module.exports = function (grunt) {

	'use strict';

	require('matchdep').filterDev('grunt-!(cli)').forEach(grunt.loadNpmTasks);
	// require('matchdep').filterDev('grunt-!(cli)').forEach(function(name){
	// 	console.log(name)
	
	// })
	var Path = require('path');
	var fs = require('fs');
	var _ = require('lodash');
	
	var hashFunc = function(buf){
		var crypto = require('crypto');
		var md5 = crypto.createHash('md5');
		return md5.update(buf).digest('base64');
	}

	grunt.initConfig({
		less : {
			development : {
				options : {
					sourceMap : true,
					sourceMapFilename : 'app/css/a2js.css.map',
					sourceMapUrl : '/css/a2js.css.map',
					sourceMapBasepath : 'app/css',
					sourceMapRootpath : '/css',
					modifyVars : {}
				},
				files : {
					'app/css/a2js.css' : 'app/css/a2js.less'
				}
			}
		},
		// useminPrepare: {
		//   html: 'index.html',
		//   options: {
		//   	dest:'dist'
		//     // flow: {
		//     //   html: {
		//     //     steps: {
		//     //       js: ['cssmin']
		//     //     },
		//     //     post: {}
		//     //   }
		//     // }
		//   }
		// }
			

			// cssmin:{
			// 	generated:{
			// 		files:[
			// 			{
			// 				dest:'app/css/a2js-min.css',
			// 				src:'app/css/a2js.css'
			// 			}
			// 		]
			// 	}	
			// }

		//  postcss: {
		//     options: {
		//       map: true, // inline sourcemaps 
		 
		//       // or 
		//       map: {
		//           inline: false, // save all sourcemaps as separate files... 
		//           annotation: 'app/css/maps/' // ...to the specified directory 
		//       },
		 
		//       processors: [
		//         require('pixrem')(), // add fallbacks for rem units 
		//         require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes 
		//         require('cssnano')() // minify the result 
		//       ]
		//     },
		//     dist: {
		//       src: 'app/css/*.css'
		//     }
		//   }
		
		// useminPrepare : {
		// 	html : 'temp/index.html',

		// 	options : {
		// 		dest : 'stage',
			
		// 		flow : {

		// 			steps : {
		// 				css : ['concat', 'cssmin']
		// 			},
		// 			post : {
		// 				css : [{
		// 						name : 'cssmin',
		// 						createConfig : function (context, block) {
		// 							var generated = context.options.generated;
		// 							generated.options = {
		// 								noAdvanced : true
		// 							};


		// 						}
		// 					}
		// 				]
		// 			}

		// 		}
		// 	}
		// },
		// usemin : {
		// 	html : ['stage/index.html'],
		// 	css : ['stage/css/*.css'],
		// 	options : {
		// 		assetsDirs : ['stage/js', 'stage/images', 'stage', 'stage/css'],
		// 		blockReplacements:{
		// 			 css: function (block) {
		// 			    var media = block.media ? ' media="' + block.media + '"' : '';
		// 			    var meta = block.media =='metasheet';
		// 			    if (meta) {
		// 					return '<meta content="' + block.dest + '"' + media + '>';	
		// 			    } else {
		// 			    	return '<link rel="stylesheet" href="' + block.dest + '"' + media + '>';	
		// 			    }
		// 			  }
		// 		},

		// 	}
		// },

		


		// watch : {
		// 	css : {
		// 		files : ['app/css/**/*.less'],
		// 		tasks : ['less', 'less2js'],
		// 	},
		// 	json : {
		// 		files : ['locales/data/**/*.json', 'config/**/*.json', '!locales/data/**/hashes.json',],
		// 		tasks : ['jsonlint:i18n', 'localesbuster:locales'],
		// },
		// 	modules : {
		// 		files : ['app/js/modules/**/*.js'],
		// 		tasks : ['createmodule:prod_modules'],
		// 	},

		// 	//templates : {
		// 	//	files : ['app/templates/**/*.html'],
		// 	//	tasks : ['createcache:prod_templates'],
		// 	//}
		// },

		useminPrepare: {
		  html: 'index.html',
		  options: {
		  	dest:'dist'
		    // flow: {
		    //   html: {
		    //     steps: {
		    //       js: ['cssmin']
		    //     },
		    //     post: {}
		    //   }
		    // }
		  }
		},
		cssmin: {
			generated:{
			    files: [{
			        'dist/css/main.css': [
			        	'.tmp/concat/css/a2js-min.css',
			            'app/css/{,*/}*.css'	            
			        ]
			    }]
		    }
		},
		  // cssmin:
		  // {
		  //     files: { 'dist/css/main.css': ['app/css/{,*/}*.css'] },
		  //     generated: {
		  //         files: [{
		  //             dest: 'dist/css/main.css',
		  //             src: ['.tmp/concat/css/a2js-min.css']
		  //         }]
		  //     }
		  // }


        rev: {
        	generated:{
			    files: [{
			        src: [
			            'dist/scripts/{,*/}*.js',
			            'dist/css/{,*/}*.css',
			             'dist/assets/js/{,*/}*.js',
			        ]
			    }]
			}
		},
		htmlmin: {
			generated:{
				options: {
			         /*removeCommentsFromCDATA: true,
			         // https://github.com/yeoman/grunt-usemin/issues/44
			         //collapseWhitespace: true,
			         collapseBooleanAttributes: true,
			         removeAttributeQuotes: true,
			         removeRedundantAttributes: true,
			         useShortDoctype: true,
			         removeEmptyAttributes: true,
			         removeOptionalTags: true*/
			    },
			    files: [{
			         expand: true,
			         cwd: '/',
			         src: '*.html',
			         dest: 'dist'
			    }]
			}

		},
		 usemin: {
            html: ['dist/{,*/}*.html'],
            css: ['dist/css/{,*/}*.css'],
            options: {
                dirs: ['dist']
            }
        },
        ts: {
	      default : {
	        src: ["app/*.ts", "!node_modules/**","!node_modules/@angular/**"],
	        dest   : "dist/assets/js",
	      }
	    }
     //    ts: {
		   //      generated: {
		   //          options: {
		   //              // task options 
		   //          },
		   //          files: [{
		   //              expand : true,
		   //              dest   : "dist/assets/js",
		   //              cwd    : "app",
		   //              ext    : ".js",
		   //              src    : [
		   //                  "*.ts",
		   //                  "!*.d.ts"
		   //              ]
		   //          }]
		   //      }
	    // }



			
	});
	  //grunt.loadNpmTasks('grunt-contrib-less');
	grunt.registerTask('default', [
		'ts',
		// 'less',
		// 'useminPrepare',
		// 'htmlmin',
  //       'concat',
  //       'cssmin',
  //       'uglify',
  //       'rev',
  //       'usemin'
		]);
	 
	// grunt.registerTask('build',[
	// 	'less',
	// ]);

	// grunt.registerTask('build',[
	// 	'clean:stage',
	// 	'clean:temp',
	// 	'jsonlint:i18n',
	// 	'localesbuster:locales',
	// 	'less',
	// 	'less2js',
	// 	'copy:temp',
	// 	'useminPrepare',
	// 	'concat:generated',
	// 	'cssmin:generated',
	// 	'createcache:dist_templates',
	// 	'createmodule:prod_modules',
	// 	'createmodule:prod_views',
	// 	'requirejs',
	// 	//'concat:requirejs',
	// 	'uglify',
	// 	'copy:stage',
	// 	//'filerev',
	// 	'usemin',
	// 	'processhtml:build',
	// 	'end'
	// ]);
}


// module.exports = function(grunt) {

//   // Project configuration.
//   grunt.initConfig({
//     pkg: grunt.file.readJSON('package.json'),
//     uglify: {
//       options: {
//         banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//       },
//       build: {
//         src: 'src/<%= pkg.name %>.js',
//         dest: 'build/<%= pkg.name %>.min.js'
//       }
//     }
//   });

//   // Load the plugin that provides the "uglify" task.
//   grunt.loadNpmTasks('grunt-contrib-uglify');

//   // Default task(s).
//   grunt.registerTask('default', ['uglify']);

// };