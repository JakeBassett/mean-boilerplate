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
                controller: ['$rootScope', 'user', function ($rootScope, user) {
                    $rootScope.user = user;
                }],
                templateUrl: 'user/user.tpl.html',
                data: {
                    pageTitle: 'User'
                },
                resolve: {
                    user: ['UserService', function (UserService) {
                        return UserService.getCurrentUser();
                    }]
                },
                onEnter: ['$state', '$window' , function ($state, $window) {
                    if (!$window.sessionStorage.token) {
                        $state.transitionTo('login');
                    }
                }]
            })
            .state('login', {
                url: '/login',
                controller: 'LoginCtrl',
                templateUrl: 'user/login.tpl.html',
                data: {
                    pageTitle: 'Login'
                }
            })
        ;
    })

    .controller('LoginCtrl', function ($scope, AuthService) {

        $scope.onSubmit = function () {
            AuthService.login($scope.user);
        };
    })

    .run(function ($rootScope, $log, UserService) {

        $rootScope.$on('user:login', function (event, user) {
            $log.info('User logged in:', user);
            UserService.setCurrentUser(user);
        });

        $rootScope.$on('user:logout', function () {
            $log.info('User logged out');
            UserService.deleteCurrentUser();
        });

    })

    .factory('UserService', function ($rootScope, $state, $window) {

        return {
            getCurrentUser: function () {
                if ($window.sessionStorage.user) {
                    return $window.sessionStorage.user;
                } else {
                    $state.transitionTo('login');
                }
            },
            setCurrentUser: function (user) {
                if ($window.sessionStorage.user) {
                    $state.transitionTo('user');
                } else {
                    $window.sessionStorage.user = JSON.stringify(user);
                }
            },
            deleteCurrentUser: function () {
                delete $window.sessionStorage.user;
            }
        };
    })

    .service('AuthService', function ($rootScope, $resource, $window, $log) {

        $rootScope.$on('user:unauthorized', function () {
            deleteToken();
        });

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
            if(!$window.sessionStorage.token){
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
            return $window.atob(output);
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
                        $rootScope.$broadcast('user:login', getDecodedProfile());
                    },
                    /* Failure */
                    function (response) {
                        $log.warn('response:', response);
                        deleteToken();
                    });
            },
            logout: function () {
                _logout().save(
                    /* Params */
                    {},
                    /* Data */
                    {},
                    /* Success */
                    function (response) {
                        $log.info('response:', response);
                        deleteToken();
                        $rootScope.$broadcast('user:logout');
                    },
                    /* Failure */
                    function (response) {
                        $log.warn('response:', response);
                        deleteToken();
                        $rootScope.$broadcast('user:logout');
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