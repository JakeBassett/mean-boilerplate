'use strict';

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    inject = require('gulp-inject'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    nghtml2js = require('gulp-ng-html2js'),
    ngmin = require('gulp-ngmin'),
//    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    wrap = require('gulp-wrap'),
    path = require('path'),
    runSequence = require('run-sequence'),
    slash = require('slash');

var webserver = require('./server/server');
var config = require('./build.conf.js');

var port = config.port,
    lrport = config.lrport,
    alias = config.alias;

var files = config.files,
    devDir = config.files.path.dev,
    distDir = config.files.path.dist,
    clientDir = config.files.path.client,
    appDir = config.files.path.app,
    libDir = config.files.path.lib;

var srcVendorDir = path.join(clientDir, libDir),
    srcAppDir = path.join(clientDir, appDir),
    destVendorDir = path.join(devDir, libDir),
    destAppDir = path.join(devDir, appDir);

var modulePrefix = config.wrappers.prefix,
    moduleSuffix = config.wrappers.suffix;

var karma = require('gulp-karma'),
    kconfig = require('./karma.conf.js'),
    protractor = require('gulp-protractor').protractor,
    pconfig = require('./protractor.conf.js').config;

var webdriverStandalone = require('gulp-protractor').webdriver_standalone,
    webdriverUpdate = require('gulp-protractor').webdriver_update;

/************************************************
 *  Default Task
 ************************************************/

//gulp.task('default', function (callback) {
//    runSequence(
//        'watch:dev',
//        'test:dev',
//        callback);
//});

gulp.task('notest', function (callback) {
    runSequence(
        'watch:dev',
        callback
    );
});

//gulp.task('test', function (callback) {
//    runSequence(
//        'test:dev',
//        callback
//    );
//});
//
//gulp.task('dev', function (callback) {
//    runSequence(
//        'watch:dev',
////        'test:dev',
//        callback);
//});
//
//gulp.task('qa', function (callback) {
//    runSequence(
//        'watch:dist',
////        'test:dist',
//        callback);
//});
//
//gulp.task('build', function (callback) {
//    runSequence(
//        'build:dev',
////        'test:dist',
//        callback);
//});
//
//gulp.task('dist', function (callback) {
//    runSequence(
//        'build:dist',
////        'test:dist',
//        callback);
//});

/************************************************
 *  Debug Server Task
 ************************************************/

gulp.task('server:dev', ['build:dev'], function (callback) {
    var base = __dirname + '/' + devDir;
    webserver.start(port, base, lrport, alias, callback);
});
gulp.task('server:dist', ['build:dist'], function (callback) {
    var base = __dirname + '/' + distDir;
    webserver.start(port, base, lrport, alias, callback);
});

/************************************************
 *  Clean Tasks
 ************************************************/

gulp.task('clean:dev', function () {
    return gulp.src(devDir, {read: false, force: true})
        .pipe(clean());
});
gulp.task('clean:dist', function () {
    return gulp.src(distDir, {read: false, force: true})
        .pipe(clean());
});
gulp.task('clean', function (callback) {
    runSequence(
        [
            'clean:dev',
            'clean:dist'
        ],
        callback
    );
});

/************************************************
 *  Build Tasks
 ************************************************/

gulp.task('build:dev', function (callback) {
    runSequence(
        'clean:dev',
        [
            'dev:vendor:js',
            'dev:vendor:css',
//            'dev:vendor:img',
            'dev:vendor:fonts',
            'dev:app:js',
            'dev:app:less',
            'dev:app:img',
            'dev:app:tpl'
        ],
        'dev:html',
        callback);
});
gulp.task('build:dist', function (callback) {
    runSequence(
        'clean:dist',
        [
            'dist:vendor:js',
            'dist:vendor:css',
//            'dist:vendor:img',
            'dist:vendor:fonts',
            'dist:app:js',
            'dist:app:less',
            'dist:app:img',
            'dist:app:tpl'
        ],
        'dist:html',
        callback);
});

/************************************************
 *  Watch for Source File Changes
 ************************************************/
gulp.task('watch:dev', ['server:dev'], function () {

    gulp.watch('Gulpfile.js', ['build:dev']);
    gulp.watch('build.conf.js', ['build:dev']);
    gulp.watch(files.app.js.src, {cwd: srcAppDir}, ['dev:app:js']);
    gulp.watch(files.app.less.src, {cwd: srcAppDir}, ['dev:app:less']);
    gulp.watch(files.app.img.src, {cwd: srcAppDir}, ['dev:app:img']);
    gulp.watch(files.app.tpl.src, {cwd: srcAppDir}, ['dev:app:tpl']);
    gulp.watch(files.html.src, {cwd: srcAppDir}, ['dev:html']);

    /*
     * Livereload
     */
    gulp.watch(devDir + '/**/*.*', function (event) {
        webserver.reload(event);
    });
});

gulp.task('watch:dist', ['server:dist'], function () {

    gulp.watch('Gulpfile.js', ['build:dist']);
    gulp.watch('build.conf.js', ['build:dist']);
    gulp.watch(files.app.js.src, {cwd: srcAppDir}, ['dist:app:js']);
    gulp.watch(files.app.less.src, {cwd: srcAppDir}, ['dist:app:less']);
    gulp.watch(files.app.img.src, {cwd: srcAppDir}, ['dist:app:img']);
    gulp.watch(files.app.tpl.src, {cwd: srcAppDir}, ['dist:app:tpl']);
    gulp.watch(files.html.src, {cwd: srcAppDir}, ['dist:html']);

    /*
     * Livereload
     */
    gulp.watch(distDir + '/**/*.*', function (event) {
        webserver.reload(event);
    });
});

/************************************************
 *  Debug Build SubTasks
 ************************************************/

gulp.task('dev:vendor:js', function () {
    return gulp.src(files.vendor.js.src, {cwd: srcVendorDir, base: clientDir})
        .pipe(gulp.dest(devDir));
});
gulp.task('dev:vendor:css', function () {
    return gulp.src(files.vendor.css.src, {cwd: srcVendorDir, base: clientDir})
        .pipe(gulp.dest(devDir));
});
gulp.task('dev:vendor:img', function () {
    return gulp.src(files.vendor.img.src, {cwd: srcVendorDir, base: clientDir})
        .pipe(gulp.dest(devDir));
});
gulp.task('dev:vendor:fonts', function () {
    return gulp.src(files.vendor.fonts.src, {cwd: srcVendorDir, base: clientDir})
        .pipe(gulp.dest(devDir));
});
gulp.task('dev:app:js', function () {
    return gulp.src(files.app.js.src, {cwd: srcAppDir, base: clientDir})
        .pipe(jshint(files.jshint))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest(devDir));
});
gulp.task('dev:app:less', function () {
    return gulp.src(files.app.less.src, {cwd: srcAppDir, base: clientDir})
        .pipe(less())
        .pipe(gulp.dest(devDir));
});
gulp.task('dev:app:img', function () {
    return gulp.src(files.app.img.src, {cwd: srcAppDir, base: clientDir})
        .pipe(gulp.dest(devDir));
});
gulp.task('dev:app:tpl', function () {
    return gulp.src(files.app.tpl.src, {cwd: srcAppDir, base: clientDir})
        .pipe(nghtml2js({
            moduleName: files.modules.name,
            stripPrefix: files.modules.path
        }))
        .pipe(gulp.dest(devDir));
});
gulp.task('dev:html', function () {

    return gulp.src(files.html.src, {cwd: srcAppDir})
        .pipe(inject(gulp.src(files.vendor.css.src, {read: false, cwd: destVendorDir}), {
            addRootSlash: false,
            addPrefix: libDir,
            starttag: '<!-- inject:vendor:{{ext}} -->'
        }))
        .pipe(inject(gulp.src(files.vendor.js.src, {read: false, cwd: destVendorDir}), {
            addRootSlash: false,
            addPrefix: libDir,
            starttag: '<!-- inject:vendor:{{ext}} -->'
        }))
        .pipe(inject(gulp.src(path.join('**', '*.css'), {read: false, cwd: destAppDir}), {
            addRootSlash: false,
            addPrefix: appDir,
            starttag: '<!-- inject:app:{{ext}} -->'
        }))
        .pipe(inject(gulp.src(path.join('**', '*.js'), {read: false, cwd: destAppDir}), {
            addRootSlash: false,
            addPrefix: appDir,
            starttag: '<!-- inject:app:{{ext}} -->'
        }))
        .pipe(gulp.dest(devDir));
});

/************************************************
 *  Production Compiled Build
 ************************************************/

gulp.task('dist:vendor:js', function () {
    return gulp.src(files.vendor.js.src, {cwd: libDir, base: '.'})
        .pipe(concat('vendor.min.js'))
        .pipe(ngmin())
        .pipe(uglify())
        .pipe(gulp.dest(path.join(distDir, libDir, files.vendor.js.dest)));
});
gulp.task('dist:vendor:css', function () {
    return gulp.src(files.vendor.css.src, {cwd: libDir, base: '.'})
        .pipe(concat('vendor.min.css'))
//        .pipe(replace(files.vendor.fonts.replace[0], files.vendor.fonts.dest))
//        .pipe(replace(files.vendor.img.replace, files.vendor.img.dest))
        .pipe(minifyCSS({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest(path.join(distDir, libDir, files.vendor.css.dest)));
});
gulp.task('dist:vendor:img', function () {
    return gulp.src(files.vendor.img.src, {cwd: libDir, base: '.'})
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true}))
        .pipe(gulp.dest(path.join(distDir, libDir, files.vendor.img.dest)));
});
gulp.task('dist:vendor:fonts', function () {
    return gulp.src(files.vendor.fonts.src, {cwd: libDir, base: '.'})
        .pipe(flatten())
        .pipe(gulp.dest(path.join(distDir, libDir, files.vendor.fonts.dest)));
});
gulp.task('dist:app:js', function () {
    return gulp.src(files.app.js.src, {cwd: appDir, base: '.'})
        .pipe(jshint(files.jshint))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat('app.min.js'))
        .pipe(wrap(modulePrefix + '<%= contents %>' + moduleSuffix))
        .pipe(ngmin())
        .pipe(uglify())
        .pipe(gulp.dest(path.join(distDir, appDir, files.app.js.dest)));
});
gulp.task('dist:app:less', function () {
    return gulp.src(files.app.less.src, {cwd: appDir, base: '.'})
        .pipe(less())
        .pipe(concat('app.min.css'))
        .pipe(minifyCSS({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest(path.join(distDir, appDir, files.app.less.dest)));
});
gulp.task('dist:app:img', function () {
    return gulp.src(files.app.img.src, {cwd: appDir, base: '.'})
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true}))
        .pipe(gulp.dest(path.join(distDir, appDir)));
});
gulp.task('dist:app:tpl', function () {
    return gulp.src(files.app.tpl.src, {cwd: appDir, base: '.'})
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(nghtml2js({
            moduleName: files.modules.name,
            stripPrefix: files.modules.path
        }))
        .pipe(concat('partials.min.js'))
        .pipe(gulp.dest(path.join(distDir, appDir, files.app.tpl.dest)));
});
gulp.task('dist:html', function () {
    var cwdVendor = path.join(distDir, libDir);
    var cwdApp = path.join(distDir, appDir);

    var ignorePath = slash(__dirname + '/' + distDir);

    return gulp.src(files.html.src, {cwd: appDir})
        .pipe(inject(gulp.src(path.join('**', '*.css'), {read: false, cwd: cwdVendor}), {
            addRootSlash: false,
            ignorePath: ignorePath,
            starttag: '<!-- inject:vendor:{{ext}} -->'
        }))
        .pipe(inject(gulp.src(path.join('**', '*.js'), {read: false, cwd: cwdVendor}), {
            addRootSlash: false,
            ignorePath: ignorePath,
            starttag: '<!-- inject:vendor:{{ext}} -->'
        }))
        .pipe(inject(gulp.src(path.join('**', '*.css'), {read: false, cwd: cwdApp}), {
            addRootSlash: false,
            ignorePath: ignorePath,
            starttag: '<!-- inject:app:{{ext}} -->'
        }))
        .pipe(inject(gulp.src(path.join('**', '*.js'), {read: false, cwd: cwdApp}), {
            addRootSlash: false,
            ignorePath: ignorePath,
            starttag: '<!-- inject:app:{{ext}} -->'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(distDir));
});

/************************************************
 *  Testing
 ************************************************/
gulp.task('test:dist', [
    'karma:dist',
    'protractor:dist'
]);
gulp.task('test:dev', [
    'karma:dev',
    'protractor:dev'
]);
gulp.task('test:watch:dist', [
    'karma:watch:dist',
    'protractor:watch:dist'
]);
gulp.task('test:watch:dev', [
    'karma:watch:dev',
    'protractor:watch:dev'
]);


/************************************************
 *  Unit Testing
 ************************************************/

function kconf() {
    var conf = {};
    var callback = {
        set: function (config) {
            conf = config;
        }
    };
    kconfig(callback);
    return conf;
}
gulp.task('karma:dev', function () {
    return gulp.src(kconf().files)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (e) {
            throw e;
        });
});
gulp.task('karma:watch:dev', function () {
    return gulp.src(kconf().files)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'watch'
        }))
        .on('error', function (e) {
            throw e;
        });
});

/************************************************
 *  e2e Testing
 ************************************************/
gulp.task('webdriver:update', webdriverUpdate);
gulp.task('webdriver:standalone', ['webdriver:update'], webdriverStandalone);

gulp.task('protractor:dev', ['webdriver:update'], function (callback) {
    gulp.src(pconfig.specs)
        .pipe(protractor({
            configFile: 'protractor.conf.js'
        }))
//        .on('error', function (e) {
//            console.log(e);
//        })
        .on('error', callback)
        .on('end', callback);
});
gulp.task('protractor:watch:dev', ['protractor:dev'], function () {
    gulp.watch(pconfig.watch, ['protractor:dev']);
});