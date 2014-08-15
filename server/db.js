'use strict';

var mongoose = require('mongoose');

var logger = require('./logger');
var auth = require('./auth');

// TODO add db to build.conf.js

/*
 * This is the global test password. It will get hashed and salted in the DB.
 */
var password = 'test';

/*
 * These are the users that get saved into the database upon initialization.
 */
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
            User.register(new User(users[i]), password, registerCallback);
        }
        logger.info('Database ready.');
    });
}

module.exports.connect = connect;
module.exports.init = init;