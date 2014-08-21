'use strict';

var passport = require('passport'),
    jwt = require('jsonwebtoken');

var logger = require('./logger');

function init(app) {

    var alias = app.get('alias');

//    app.post(alias + '/login',
//
//        passport.authenticate('local', {
//            session: false // Using token based auth instead of session cookies
//        }),
//        function (req, res) {
//            logger.debug('Successful login for user:', req.user.username);
//
//            var data = {
//                username: req.user.username,
//                profile: req.user.profile
//            };
//
//            var token = jwt.sign(data, 'secret', {expiresInMinutes: 60 * 5});
//            res.json({
//                token: token
//            });
//        }
//    );

    app.post(alias + '/login', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {

            if (err) {
                logger.warn('Failed to login user:', info);
                return next(err);
            }

            var data = {
                username: user.username,
                profile: user.profile
            };

            var token = jwt.sign(data, 'secret', {expiresInMinutes: 60 * 5});
            logger.debug('Successful login for user:', user.username);
            res.json({token: token});

        })(req, res, next);
    });

    app.post(alias + '/logout', function (req, res, next) {
        passport.authenticate('bearer', function (err, user, info) {

            if (err) {
                logger.warn('Failed to logout user:', info);
                return next(err);
            }

            req.logout();
            logger.debug('Successful logout for user:', user.username);
            return res.status(200).end();

        })(req, res, next);
    });
}

module.exports.init = init;