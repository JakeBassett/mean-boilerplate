'use strict';

var mongoose = require('mongoose');

var logger = require('./logger');
var auth = require('./auth');

// TODO add db to build.conf.js

var users = [
    {
        username: 'admin',
        profile: {
            email: 'admin@example.com',
            prefs: {
                stayLoggedIn: true
            }
        }
    },
    {
        username: 'user',
        profile: {
            email: 'user@example.com',
            prefs: {
                stayLoggedIn: true
            }
        }
    }
];

function connect() {
    mongoose.connect('mongodb://localhost/test');
}

function init(User) {
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {
        // Success
        logger.info('Database opened at localhost/test');

        auth.initUser(User);

        function registerCallback(err, user) {
            if (err) {
                logger.error('Registration Error:', {account: user, err: err});
            }else{
                logger.debug('Added User:', JSON.stringify(user));
            }
        }

        for (var i = 0; i < users.length; i++) {
            User.register(new User(users[i]), 'test', registerCallback);
        }
        logger.info('Database ready.');
    });
}

module.exports.connect = connect;
module.exports.init = init;