#!/usr/bin/env nodemon
'use strict';

var express = require('express'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    cookieParser = require('cookie-parser'),
    favicon = require('static-favicon'),
    livereload = require('connect-livereload'),
    mongoose = require('mongoose'),
    path = require('path'),
    tinylr = require('tiny-lr'),
    winston = require('winston');

var logger = new (winston.Logger)({
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    },
    transports: [
        new winston.transports.Console({
            level : 'debug',
            colorize: true
        })
    ]
});


var LocalStrategy = require('passport-local').Strategy,
    Schema = mongoose.Schema;

var app = express();
var lr = tinylr();

var UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    prefs: {
        stayLoggedIn: Boolean
    }
});

UserSchema.plugin(LocalStrategy);

var User = mongoose.model('User', UserSchema);

/**
 * Initialization
 */
function initialize(port, alias, base) {

    initDB();

    app.set('port', process.env.PORT || port);
    app.set('base', base);
    app.set('alias', alias);

    app.use(alias, favicon());
    app.use(alias, cookieParser());
    app.use(alias, compress());                         // Compression
    app.use(alias, express.static(app.get('base')));    // Set the static files location
    app.use(alias, bodyParser.json());                  // To support JSON-encoded bodies

    /*
     * Much of the Passport docs center around sessions.
     *
     * We are not using sessions here. We are doing token based auth instead of
     * sessions and cookies.
     *
     * Because of this, flash messages will not work.
     */
    app.use(alias, passport.initialize());

    app.use(alias, livereload());

    setRoutes();
    setAuthStrategy();
}

/**
 * Database
 */
function initDB() {

    mongoose.connect('mongodb://localhost/test');

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
        // Success
        logger.info('Database opened at localhost/test');

        User.remove(function(err){
        });

        for(var i = 0; i < users.length; i++){
            var user = new User(users[i]);
            user.save();
            logger.debug('Added User:', JSON.stringify(users[i]));
        }
        logger.info('Database ready.');
    });
}

/**
 * Authentication Strategy
 */
function setAuthStrategy() {

    passport.use(new LocalStrategy({
            username: 'username',
            password: 'password'
        },
        function (username, password, done) {
            User.findOne(
                {
                    username: username
                },
                function (err, user) {
                    logger.debug('Found User:', user);
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    if (user.password !== password) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    // Success
                    return done(null, user);
                });
        }
    ));
}

/**
 * Routes
 */
function setRoutes() {
    app.post('/api/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: 'login',
            failureFlash: true
        })
    );
}

/**
 * Start the server
 */
function startExpress(port, lrport, alias, base, callback) {

    initialize(port, alias, base);
    startLivereload(lrport);

    app.listen(app.get('port'), callback);
    logger.info('Server hosting files at ' + app.get('base'));
    logger.info('Server listening at localhost:' + app.get('port') + '/' + app.get('alias'));
}

/**
 * Live Reload
 */
function startLivereload(lrport) {
    lr.listen(lrport);
    logger.info('Livereload listening on port ' + lrport);
}
function notifyLivereload(event) {

    /*
     * `gulp.watch()` events provide an absolute path so
     * we need to make it relative to the server root
     */
    var fileName = path.relative(app.get('base'), event.path);

    lr.changed({
        body: {
            files: [fileName]
        }
    });
}

/**
 * Module Exports
 */
module.exports.start = startExpress;
module.exports.reload = notifyLivereload;