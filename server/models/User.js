'use strict';

var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken');

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
 * This is a function that is used by Passport for authentication of 'local' strategy.
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
                    return done(null, false, {message: 'User not found'});
                }

                if (!user.authenticate(password)) {
                    return done(null, false, {message: 'Authentication failed'});
                } else {
                    return done(null, user, {message: 'Authentication success'});
                }
            });
        });
    };
};

/**
 * This is a function that is used by Passport for authentication of 'bearer' strategy.
 *
 * It must be passed to a new BearerStrategy.
 */
User.statics.validate = function () {

    var User = this || mongoose.model('User');

    return function (token, done) {

        process.nextTick(function () {

            jwt.verify(token, 'secret', function (err, decoded) {

                if (err) {
                    logger.error('err:', err);
                    return done(err);
                }

                User.findByUsername(decoded.username, function (err, user) {

                    if (!user) {
                        return done(null, false, {message: 'User not found'});
                    }

                    return done(null, user, {message: 'Validation success'});
                });
            });

        });
    };
};


module.exports = mongoose.model('User', User);



