'use strict';

angular.module('mbp.header', [
    'ui.bootstrap'
])
    .directive('mbpHeader', function ($log) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                user: '='
            },
            templateUrl: 'header/header.tpl.html',
            link: function (scope, element, attrs) {
            }
        };
    })
;