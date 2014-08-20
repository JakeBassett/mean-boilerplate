'use strict';

angular.module('mbp.user', [
    'ui.router',
    'ngResource'
])
    .config(function ($stateProvider, $httpProvider) {

        $httpProvider.interceptors.push('AuthIntercepter');

        $stateProvider
            .state('user', {
                url: '/user',
                controller: ['$rootScope', function ($rootScope) {
                }],
                templateUrl: 'user/user.tpl.html',
                data: {
                    pageTitle: 'User'
                },
//                resolve: {
//                    user: ['$state', 'UserService', function ($state, UserService) {
//                        var user = UserService.getCurrentUser();
//                        if (!user) {
//                            $state.transitionTo('login');
//                        }
//                        return {};
//                    }]
//                },
                onEnter: ['$state', 'AuthService' , function ($state, AuthService) {
                    if (!AuthService.getCurrentUser()) {
                        $state.transitionTo('login');
                    }
                }]
            })
            .state('login', {
                url: '/login',
                controller: ['$scope', 'AuthService', function ($scope, AuthService) {
                    $scope.onSubmit = function () {
                        AuthService.login($scope.user);
                    };
                }],
                templateUrl: 'user/login.tpl.html',
                data: {
                    pageTitle: 'Login'
                }
            })
        ;
    })

    .service('AuthService', function ($rootScope, $resource, $window, $log) {

        /**
         * Maintain session token in the sessionStorage. Although not supported
         * in every browser, better than a cookie or local storage because the data
         * only lives until the browser tab is closed.
         */

        function saveToken(token) {
            $window.sessionStorage.token = token;
        }

        function deleteToken() {
            delete $window.sessionStorage.token;
        }

        function getDecodedProfile() {
            if (!$window.sessionStorage.token) {
                return {};
            }

            var encodedProfile = $window.sessionStorage.token.split('.')[1];

            var output = encodedProfile.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return JSON.parse($window.atob(output));
        }

        function _login() {
            return $resource(
                /* url */
                '/login',
                /* [paramDefaults] */
                {},
                /* [actions] */
                {}
            );
        }

        function _logout() {
            return $resource(
                /* url */
                '/logout',
                /* [paramDefaults] */
                {},
                /* [actions] */
                {}
            );
        }

        return {
            getCurrentUser: function () {
                var user = getDecodedProfile();
                if (!user.username) {
                    return null;
                }
                return getDecodedProfile();
            },
            login: function (user) {
                _login().save(
                    /* Params */
                    {},
                    /* Data */
                    user,
                    /* Success */
                    function (response) {
                        $log.info('response:', response);
                        saveToken(response.token);
                        $rootScope.$broadcast('user:login');
                    },
                    /* Failure */
                    function (response) {
                        $log.warn('Login failed:', response);
                    });
            },
            logout: function () {
                _logout().save(
                    /* Params */
                    {},
                    /* Data */
                    {token: $window.sessionStorage.token},
                    /* Success */
                    function (response) {
                        $log.info('response:', response);
                        deleteToken();
                        $rootScope.$broadcast('user:logout');
                    },
                    /* Failure */
                    function (response) {
                        $log.warn('Logout failed:', response);
                    });
            }
        };
    })

    .factory('AuthIntercepter', function ($rootScope, $window, $q, $log) {

        return {
            request: function (config) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    $log.warn('Unauthorized response.');
                    $rootScope.$broadcast('user:unauthorized');
                } else if (response.status === 302) {
                    $log.warn('Redirect response.');
                }

                return response || $q.when(response);
            }
        };
    })
;