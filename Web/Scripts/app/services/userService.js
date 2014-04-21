﻿
(function () {
    'use strict';

    var serviceId = 'userService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', 'dataContext', '$http', 'logger', userService]);
        });

    function userService($delegate, dataContext, $http, logger) {
        logger = logger.forSource(serviceId);

        // Service methods (alphabetically)
        $delegate.getCurrentUser = getCurrentUser;
        $delegate.login = login;
        $delegate.logout = logout;

        return $delegate;

        /*** Implementations ***/

        function getCurrentUser() {
            var url = '/api/UserHelper/CurrentUser';

            return $http({
                method: 'GET',
                url: url
            }).
                //success(function () {
                //}).
                error(function (data, status, headers, config) {
                    logger.logError('error', null, true);
                });
        }

        function login(email, password) {
            var url = '/api/UserHelper/Login';
            var userDto = { "email": email, "password": password };

            return $http({
                method: 'POST',
                url: url,
                data: userDto,
                headers: { 'Content-Type': 'application/json' }
            }).
                //success(function () {
                //}).
                error(function (data, status, headers, config) {
                    // TODO
                });
        }

        function logout() {

            var url = '/api/UserHelper/Logout';

            return $http({ method: 'POST', url: url }).
                //success(function () {
                //}).
                error(function (data, status, headers, config) {
                    // TODO
                });
        }
    }

})();
