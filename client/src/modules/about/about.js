'use strict';

angular.module('mbp.about', [
    'ui.router'
])

    .config(function config($stateProvider) {
        $stateProvider.state('about', {
            url: '/about',
            controller: 'AboutCtrl',
            templateUrl: 'about/about.tpl.html',
            data: {
                pageTitle: 'About'
            }
        });
    })

    .controller('AboutCtrl', function ($scope) {
    })
;
