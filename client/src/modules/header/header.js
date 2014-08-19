'use strict';

angular.module('mbp.header', [
    'ui.bootstrap',
    'mbp.user'
])
    .directive('mbpHeader', function ($log, AuthService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                user: '='
            },
            templateUrl: 'header/header.tpl.html',
            link: function (scope, element, attrs) {
//                scope.logout = AuthService.logout();
            }
        };
    })
;