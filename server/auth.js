'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var logger = require('./logger');

function init(app) {
    app.use(passport.initialize());
//    app.use(passport.session());

    logger.info('Initialized authentication.');
}

function initUser(User) {

    User.remove(function(err){
    });

    passport.use(new LocalStrategy(User.authenticate()));

//    passport.serializeUser(User.serialize());
//    passport.deserializeUser(User.deserialize());
}

module.exports.init = init;
module.exports.initUser = initUser;