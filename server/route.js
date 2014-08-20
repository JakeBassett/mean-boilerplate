'use strict';

var passport = require('passport'),
    jwt = require('jsonwebtoken');

var logger = require('./logger');

function init(app) {

    var alias = app.get('alias');

    app.post(alias + '/login',

        passport.authenticate('local', {
            session: false // Using token based auth instead of session cookies
        }),
        function (req, res) {
            logger.debug('Successful login for user:', req.user.username);

            var data = {
                username: req.user.username,
                profile: req.user.profile
            };

            var token = jwt.sign(data, 'secret', {expiresInMinutes: 60 * 5});
            res.json({
                token: token
            });
        }
    );

    app.post(alias + '/logout',

        passport.authenticate('bearer', {
            session: false // Using token based auth instead of session cookies
        }),
        function (req, res) {
            logger.debug('Successful logout for user');

        }
//        function (req, res) {
//
//            logger.debug('Authorization:', req.headers.authorization);
//            var auth = req.headers.authorization;
//            var token = auth.substring(auth.search(" ")
//
////            jwt.verify(req.headers.authorization, 'secret',
////                function (err, decoded) {
////
////                    if(err){
////                        logger.warn('Invalid token:', req.headers.authorization);
////                        return;
////                    }
////
////                    logger.debug('Successful logout for user:', decoded.username);
////                    req.logout();
////                });
//
//        }
    );
}

module.exports.init = init;