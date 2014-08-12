'use strict';

var winston = require('winston');

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
            colorize: true,
            prettyPrint: true,
            timestamp: false
        })
    ]
});

module.exports = logger;