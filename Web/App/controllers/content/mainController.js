﻿(function () {
    'use strict';

    var controllerId = 'mainController';
    angular.module('main')
        .controller(controllerId, ['mainFactory', 'userFactory', '$scope', '$location', '$window', 'logger', mainController]);

    function mainController(mainFactory, userFactory, $scope, $location, $window, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // View model
        var vm = this;
        vm.applicationInfo = null;
        vm.currentUser = null;
        vm.currentUserText = currentUserText;
        vm.currentDate = new Date();
        vm.hasPassword = hasPassword;
        vm.isAuthenticated = isAuthenticated;
        vm.logout = logout;
        vm.displayAnonymousUserWarning = true;

        // Anonymous user warning
        $scope.$on('anonymousUserInteracted', function () {
            if (vm.displayAnonymousUserWarning) {
                logger.logWarning('To prevent losing your changes, you can register for free or if you have an existing account, please login first.',
                    null,
                    true,
                    'Save your changes?',
                    { extendedTimeOut: 0, timeOut: 0 });
                vm.displayAnonymousUserWarning = false;
            }
        });

        // User logged in & out
        $scope.$on('userLoggedIn', function () {
            getCurrentUser();
        });

        $scope.$on('userLoggedOut', function () {
            vm.currentUser = null;
        });

        _init();

        function _init() {

            // Application info
            getApplicationInfo();

            // Current user
            getCurrentUser();
        }

        function currentUserText() {

            var text = '';

            if (vm.currentUser !== null) {
                //text = 'User: ' + vm.currentUser.Email + ' - ' + vm.currentUser.EmailConfirmed;
                text = 'User: ' + vm.currentUser.Email;
            }

            return text;
        }

        function getApplicationInfo() {
            mainFactory.getApplicationInfo()
                .then(function (applicationInfo) {
                    vm.applicationInfo = applicationInfo;
                    vm.applicationInfo.CurrentVersionText = vm.applicationInfo.CurrentVersion + ' - Alpha ~ Beta';
                });
        }

        function getCurrentUser() {
            userFactory.getCurrentUser()
                .then(function (currentUser) {
                    vm.currentUser = currentUser;
                });
        }

        function hasPassword() {
            return vm.currentUser !== null && vm.currentUser.hasPassword();
        }

        function isAuthenticated() {
            return vm.currentUser !== null && vm.currentUser.Id > 0;
        }

        function logout() {
            
            userFactory.logout();

            // Clear search params
            var search = $location.search();
            for (var searchKey in search) {
                $location.search(searchKey, null);
            }

            // Return back to home page
            $location.path('/');
        }
    };
})();
