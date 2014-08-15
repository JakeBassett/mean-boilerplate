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
        function (req, res) {
            req.logout();
            res.redirect('/');
        }
    );
}

module.exports.init = init;