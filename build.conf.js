/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    port: 8000,
    lrport: 35729,
    alias: '',

    wrappers: {
        prefix: '(function ( window, angular, undefined ) {\n',
        suffix: '})( window, window.angular );'
    },

    files: {
        jshint: '.jshintrc',

        path: {
            dev: '_build',
            dist: '_dist',
            app: 'client/src',
            lib: 'client/vendor'
        },

        modules: {
            /*
             * The name needs to match the module declaration
             * at the bottom of app.js
             *
             * The path needs to match the path to the root
             * of all modules template source files.
             */
            name: 'tpl-modules',
            path: 'client/src/modules/'
        },

        vendor: {
            js: {
                src: [
                    'angular/angular.js',
                    'angular-resource/angular-resource.js',
                    'angular-bootstrap/ui-bootstrap-tpls.js',
                    'angular-ui-router/release/angular-ui-router.js',
                    'vendor/angular-mocks/angular-mocks.js'
                ],
                dest: 'js'
            },
            css: {
                src: [
                    'bootstrap/dist/css/bootstrap.css',
                    'bootstrap/dist/css/bootstrap.css.map',
                    'font-awesome/css/font-awesome.css'
                ],
                dest: 'css'
            },
            fonts: {
                src: [
                    'bootstrap/fonts/glyphicons-halflings-regular.woff',
                    'font-awesome/fonts/fontawesome-webfont.woff'
                ],
                dest: 'fonts'
            }
        },

        app: {
            js: {
                src: [
                    '**/*.js',
                    '!**/*.spec.js',
                    '!**/*.scenario.js'
                ],
                dest: 'js'
            },
            less: {
                src: [
                    '**/*.less'
                ],
                dest: 'css'
            },
            img: {
                src: [
                    '**/*.png'
                ],
                dest: 'img'
            },
            tpl: {
                src: [
                    '**/*.tpl.html'
                ],
                dest: 'tpl'
            }
        },

        html: {
            src: [
                '**/index.html'
            ],
            dest: ''
        }
    }
};
