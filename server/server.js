#!/usr/bin/env nodemon
'use strict';

var express = require('express'),
    expressJwt = require('express-jwt'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    favicon = require('static-favicon');

var logger = require('./logger'),
    db = require('./db'),
    auth = require('./auth'),
    route = require('./route'),
    livereload = require('./livereload');


var User = require('./models/User');

var app = express();


function start(port, base, lrport, alias, callback) {

    /**
     * Save parameters
     */
    app.set('port', process.env.PORT || port);
    app.set('base', base);
    app.set('lrport', lrport);
    app.set('alias', alias);

    /**
     * Initialization
     */
    app.use(alias, favicon());
    app.use(alias, compress());                     // Compression

    /**
     * Parsers
     */
    app.use(alias, bodyParser.json());              // To support JSON-encoded bodies


    /**
     * Protect api with JSON Web Tokens (JWT)
     */
    app.use(alias + '/api', expressJwt({
        secret: 'secret'
    }));

    /**
     * Serve Files
     */
    app.use(alias, express.static(base));           // Set the static files location

    /**
     * Authentication
     */
    auth.init(app);

    /**
     * Routes
     */
    route.init(app);

    /**
     * Database
     */
    db.connect();
    db.init(User);

    /**
     * Livereload
     */
    livereload.start(app);

    /**
     * Listen
     */
    app.listen(port, callback);

    logger.info('Server hosting files at ' + app.get('base'));
    logger.info('Server listening at localhost:' + app.get('port') + '/' + app.get('alias'));
}


module.exports.start = start;
module.exports.reload = livereload.reload;