'use strict';

var ScreenShotReporter = require('protractor-screenshot-reporter');
var path = require('path');

exports.config = {

    // The location of the selenium standalone server .jar file, relative
    // to the location of this config. If no other method of starting selenium
    // is found, this will default to
    // node_modules/protractor/selenium/selenium-server...
    seleniumServerJar: './selenium-server-standalone-2.42.2.jar', // Make use you check the version in the folder

    // Chromedriver location is used to help the selenium standalone server
    // find chromedriver. This will be passed to the selenium jar as
    // the system property webdriver.chrome.driver. If null, selenium will
    // attempt to find chromedriver using PATH.
    chromeDriver: './chromedriver',

    // If true, only chromedriver will be started, not a standalone selenium.
    // Tests for browsers other than chrome will not run.
    chromeOnly: false,

    // ----- What tests to run -----
    //
    // Spec patterns are relative to the location of this config.
    specs: [
        'src/**/*.scenario.js'
    ],

    // ----- What test files to watch -----
    //
    // Watch patterns are relative to the location of this config.
    watch: [
        'build/**/*',
        'src/**/*.scenario.js'
    ],

    // ----- What html files to watch for Protractor-QA -----
    //
    // Watch patterns are relative to the location of this config.
    html: [
        'build/index.html',
        'build/src/**/*tpl.html'
    ],

    // Patterns to exclude.
    exclude: [],

    // Alternatively, suites may be used. When run without a command line parameter,
    // all suites will run. If run with --suite=smoke, only the patterns matched
    // by that suite will run.
    suites: {
//        smoke: 'spec/smoketests/*.js',
//        full: 'spec/*.js'
    },

    // ----- Capabilities to be passed to the webdriver instance ----
    //
    // For a full list of available capabilities, see
    // https://code.google.com/p/selenium/wiki/DesiredCapabilities
    // and
    // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
    capabilities: {
        'browserName': 'chrome'
    },

    // ----- More information for your tests ----
    //
    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://localhost:8000/eservices2/shopviz',

    // The params object will be passed directly to the protractor instance,
    // and can be accessed from your test. It is an arbitrary object and can
    // contain anything you may need in your test.
    // This can be changed via the command line as:
    //   --params.login.user 'Joe'
    params: {
//        login: {
//            user: 'Jane',
//            password: '1234'
//        }
    },

    // ----- The test framework -----
    //
    // Jasmine and Cucumber are fully supported as a test and assertion framework.
    // Mocha has limited beta support. You will need to include your own
    // assertion framework if working with mocha.
    framework: 'jasmine',

    // ----- Options to be passed to minijasminenode -----
    //
    // See the full list at https://github.com/juliemr/minijasminenode
    jasmineNodeOpts: {
        // onComplete will be called just before the driver quits.
        onComplete: null,
        // If true, display spec names.
        isVerbose: true,
        // If true, print colors to the terminal.
        showColors: true,
        // If true, include stack traces in failures.
        includeStackTrace: true,
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 30000
    },

    // Protractor Screenshot Reporter
    onPrepare: function () {
        jasmine.getEnv().addReporter(new ScreenShotReporter({
            baseDirectory: 'e2e/screenshots',
            takeScreenShotsOnlyForFailedSpecs: true,
            takeScreenShotsForSkippedSpecs: false,
            pathBuilder: function pathBuilder(specfile, descriptions, results, capabilities) {
                // Return '<browser>/<specname>' as path for screenshots:
                // Example: 'firefox/list-should work'.
                return path.join(descriptions[1], descriptions[0]);
            },
            metaDataBuilder: function metaDataBuilder(spec, descriptions, results, capabilities) {
                // Return the description of the spec and if it has passed or not:
                return {
                    description: descriptions,
                    passed: results.passed(),
                    capabilities: capabilities
                };
            }
        }));
    }
};