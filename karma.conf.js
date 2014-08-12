'use strict';

module.exports = function (config) {

    config.set({

        /* Web server port */
        port: 9876,

        /* Enable/Disable colors in the output (reporters and logs) */
        colors: true,

        /* Base path that will be used to resolve files and exclude */
        basePath: '',

        /* Report all the tests that are slower than given time limit (in ms) */
        reportSlowerThan: 5000,

        /* List of files to load in the browser */
        files: [
            'vendor/angular/angular.js',
            'vendor/angular-resource/angular-resource.js',
            'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
            'vendor/angular-ui-router/release/angular-ui-router.js',
            'vendor/angular-mocks/angular-mocks.js',
            'bootstrap/dist/js/bootstrap.js',
            'build/src/**/*.js',
            'src/**/*.spec.js'
        ],

        /* List of files to exclude */
        exclude: [
        ],

        /* A map of preprocessors to use. */
        preprocessors: {
            // Source files, that you wanna generate coverage for
            // Do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'build/src/**/*.js': ['coverage']
        },

        /* A list of coverage reporters to use. */
        coverageReporter: {
            reporters: [
                {type: 'text-summary', dir: 'testresults/coverage/'},
                {type: 'html', dir: 'testresults/coverage/'}
            ]
        },

        /* List of frameworks to use (e.g. jasmine, mocha, qunit, etc...) */
        frameworks: ['jasmine'],

        /* CLI reporters */
        reporters: [
            'progress',
            'coverage'
        ],

        /* Start these browsers */
        browsers: ['Chrome'],

        /*
         * Auto run tests on start and exit
         * (GULP PLUGIN OVERWRITES THIS VALUE BASED ON action)
         */
        singleRun: false,

        /*
         * Enable or disable watching files and executing the tests whenever one of these files changes.
         *  (GULP PLUGIN OVERWRITES THIS VALUE BASED ON action)
         */
        autoWatch: true,

        /*
         * When Karma is watching the files for changes, it tries to batch multiple changes into a single
         * run so that the test runner doesn't try to start and restart running tests more than it should.
         * The configuration setting tells Karma how long to wait (in milliseconds) after any changes have
         * occurred before starting the test process again.
         */
        autoWatchBatchDelay: 250
    });
};