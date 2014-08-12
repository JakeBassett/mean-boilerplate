'use strict';

angular.module('mbp.home', [
    'ui.router'
])

    .config(function config($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            controller: 'HomeCtrl',
            templateUrl: 'home/home.tpl.html',
            data: {
                pageTitle: 'Home'
            }
        });
    })

    .controller('HomeCtrl', function HomeController($scope) {
    })
;

