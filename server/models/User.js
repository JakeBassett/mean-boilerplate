'use strict';

var mongoose = require('mongoose');

var logger = require('../logger');

var User = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        email: {
            type: String,
            unique: true
        },
        prefs: {
            stayLoggedIn: Boolean
        }
    }
});


User.methods.setPassword = function (password) {
    // TODO Use crypto to salt and hash the password
    var self = this;
    self.password = password;
    return true;
};

User.methods.authenticate = function (password) {
    // TODO Use crypto to authenticate with salt and hashed password
    var self = this;
    return self.password === password;
};

User.statics.register = function (user, password, cb) {
    var User = this || mongoose.model('User');

    /*
     * Create an instance of User in case user isn't already an instance
     */
    if (!(user instanceof this)) {
        user = new this(user);
    }

    if (!user.get('username')) {
        return cb(new Error('Field username not set'));
    }

    User.findByUsername(user.get('username'), function (err, foundUser) {

        if (err) {
            return cb(err);
        }

        if (foundUser) {
            return cb(new Error('User already exists'));
        }

        if (!user.setPassword(password)) {
            return cb(new Error('Unable to set password'));
        } else {
            user.save(function (err) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, user);
                }
            });
        }
    });
};

User.statics.findByUsername = function (username, cb) {
    var User = this || mongoose.model('User');

    var queryParams = {
        username: username
    };

    return User.findOne(queryParams).exec(cb);
};

/**
 * This is a function that is used by Passport for authentication.
 *
 * It must be passed to a new LocalStrategy.
 */
User.statics.authenticate = function () {

    var User = this || mongoose.model('User');

    return function (username, password, done) {

        process.nextTick(function () {
            User.findByUsername(username, function (err, user) {
                if (err) {
                    logger.error('err:', err);
                    return done(err);
                }

                if (!user) {
                    logger.debug('User not found for:', username);
                    return done(null, false, {message: 'User not found'});
                }

                if (user.authenticate(password)) {
                    logger.debug('Authentication success for:', user.username);
                    return done(null, user);
                } else {
                    logger.debug('Authentication failed for:', user.username);
                    return done(null, false, {message: 'Authentication failed'});
                }
            });
        });
    };
};

/**
 * The serialize and deserialize functions are used by Passport for sessions.
 *
 * They provide the information that will be transmitted to the client and
 * returned to allow the server to identify the session.
 */
//User.statics.serialize = function () {
//    return function (user, done) {
//        logger.debug('Serialized user:', user.username);
//        done(null, user.username);
//    };
//};
//User.statics.deserialize = function () {
//
//    var User = this || mongoose.model('User');
//
//    return function (id, done) {
//        logger.debug('Deserialized user:', id);
//        User.findByUsername(id, done);
//    };
//};

module.exports = mongoose.model('User', User);



