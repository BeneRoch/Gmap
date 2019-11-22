module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // concat: Concatenate files
        concat: {
            global: {
                src: [
                    'assets/scripts/src/Base/bb.base.js',
                    'assets/scripts/src/Base/bb.data.js',
                    'assets/scripts/src/Controller/bb.gmap.controller.js',
                    'assets/scripts/src/Objects/bb.gmap.infobox.js',
                    'assets/scripts/src/Objects/bb.gmap.obj.js',
                    'assets/scripts/src/Objects/bb.gmap.marker.js',
                    'assets/scripts/src/Objects/bb.gmap.richmarker.js',
                    'assets/scripts/src/Objects/bb.gmap.line.js',
                    'assets/scripts/src/Objects/bb.gmap.polygon.js',
                    'assets/scripts/src/markerclusterer.js'
                ],
                dest: 'assets/scripts/dist/bb.gmap.js'
            }
        },

        // jshint: Validate javascript files with JSHint
        jshint: {
            gruntfile: {
                src: [
                    // Self-test
                    'Gruntfile.js'
                ]
            },
            project: {
                src: [
                    'assets/scripts/src/*.js',
                    'assets/scripts/src/**/*.js'
                ]
            }
        },

        // watch: Run tasks whenever watched files change
        watch: {
            concat: {
                files: ['assets/scripts/src/**/*.js'],
                tasks: ['concat', 'notify:concat']
            }
        },

        // notify: Automatic Notifications when Grunt tasks fail (or succeed)
        notify: {
            watch: {
                options: {
                    // title: '<%= pkg.title %>',
                    message: 'Ta yeule, Chief!'
                }
            },
            concat: {
                options: {
                    // title: '<%= pkg.title %>',
                    message: 'Javascript is now concatenated'
                }
            }

        },

        // uglify: Minify (javascript)files with UglifyJS
        uglify: {
            my_target: {
                files: {
                    'assets/scripts/dist/min/gmap.min.js': ['assets/scripts/dist/*.js']
                }
            }
        },
        sass: {
            options: {
                sourceMap: false
            },
            dist: {
                files: {
                    'assets/styles/dist/screen.css': 'assets/styles/src/screen.scss'
                }
            }
        }
    });

    // Load plugin(s)
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.registerTask('default', ['notify:watch', 'watch']);

    grunt.registerTask('wlint', [
        // Javasript
        'jshint',
        'concat',

        // Utilities
        'watch'
    ]);
    grunt.registerTask('build', [
        'sass',
        'concat',
        'uglify'
    ]);
};