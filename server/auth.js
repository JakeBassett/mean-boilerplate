'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy;

var logger = require('./logger');

function init(app) {
    app.use(passport.initialize());
    logger.info('Initialized authentication.');
}

function initUser(User) {

    User.remove(function(err){
    });

    passport.use(new LocalStrategy(User.authenticate()));
    passport.use(new BearerStrategy(User.validate()));
}

module.exports.init = init;
module.exports.initUser = initUser;