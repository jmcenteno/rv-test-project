module.exports = function (grunt) {

    //Get all tasks from the package.json file
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /* CSS Files */
        concurrent: {
            watch: {
                tasks: ['compass:dist', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: ['assets/scss/'],
                    cssDir: ['css/'],
                    environment: 'development', // development | production
                    importPath: ['assets/scss/'],
                    outputStyle: 'expanded', // expanded for development | compressed for production
                    watch: true,
                },
            },
        },

        /* Javascript files */
        concat: {
            dist: {
                src: [
					'assets/js/app.js',
                    'assets/js/config.js',
                    'assets/js/services.js',
                    'assets/js/controllers.js',
                    'assets/js/directives.js',
                    'assets/js/filters.js',
				],
                dest: 'js/app.js',
            },
            dependencies: {
                src: [
                    'components/jquery/dist/jquery.min.js',
					'components/angular/angular.min.js',
                    'components/angular-animate/angular-animate.min.js',
                    'components/angular-sanitize/angular-sanitize.min.js',
                    'components/angular-cookies/angular-cookies.min.js',
                    'components/angular-ui-router/release/angular-ui-router.min.js',
                    'components/angular-utils-pagination/dirPagination.js',
                    'components/bootstrap/dist/js/bootstrap.min.js',
				],
                dest: 'js/dependencies.js'
            }
        },
        ngAnnotate: {
            options: {
                sourceMap: true
            },
            app: {
                files: {
                    'js/app.js': 'js/app.js'
                }
            },
        },
        uglify: {
            dependencies: {
                src: 'js/dependencies.js',
                dest: 'js/dependencies.min.js'
            },
            build: {
                src: 'js/app.js',
                dest: 'js/app.min.js'
            }
        },

        /* Run tasks when needed */
        watch: {
            css: {
                files: ['css/**/*.css'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['assets/js/**/*.js'],
                tasks: ['concat', 'ngAnnotate', 'uglify'],
                options: {
                    livereload: true
                }
            },
            templates: {
                files: ['**/*.html'],
                options: {
                    livereload: true
                }
            }
        }

    });

    // Where we tell Grunt what to do when we type "grunt" into the terminal.

    grunt.registerTask('default', ['concurrent:watch', 'concat:dist', 'concat:dependencies', 'ngAnnotate', 'uglify']);

};