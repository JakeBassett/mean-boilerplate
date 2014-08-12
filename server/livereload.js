'use strict';

var livereload = require('connect-livereload'),
    path = require('path'),
    tinylr = require('tiny-lr');

var logger = require('./logger');

var lr = tinylr();

var lrport;
var base;
var alias;

function start(app) {

    base = app.get('base');
    lrport = app.get('lrport');
    alias = app.get('alias');

    app.use(alias, livereload());

    lr.listen(lrport);
    logger.info('Livereload listening on port ' + lrport);
}

function reload(event) {

    /*
     * `gulp.watch()` events provide an absolute path so
     * we need to make it relative to the server root
     */
    var fileName = path.relative(base, event.path);

    lr.changed({
        body: {
            files: [fileName]
        }
    });
}

module.exports.start = start;
module.exports.reload = reload;