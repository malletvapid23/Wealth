﻿(function () {
    'use strict';

    var controllerId = 'DefaultController';
    angular.module('main')
        .controller(controllerId, ['applicationFactory', 'dataContext', 'disqusShortname', 'logger', '$location', '$rootScope', '$scope', '$uibModal', DefaultController]);

    function DefaultController(applicationFactory, dataContext, disqusShortname, logger, $location, $rootScope, $scope, $uibModal) {

        // Logger
        logger = logger.forSource(controllerId);

        // View model
        var vm = this;
        vm.applicationInfo = null;
        vm.createNew = createNew;
        vm.currentUser = { Email: '', isAuthenticated: function () { return false; }, HasPassword: false };
        vm.currentDate = new Date();
        vm.currentUserText = currentUserText;
        vm.displayBankTransfer = false;
        vm.displayFooterIcons = false;
        vm.disqusConfig = {
            disqus_shortname: disqusShortname,
            disqus_identifier: '',
            disqus_url: ''
        };
        vm.logout = logout;
        vm.toggleBankTransfer = toggleBankTransfer;
        var isRegisterLoginModalOpened = false;

        // Events
        $scope.$on('dataContext_currentUserChanged', currentUserChanged);
        $scope.$on('unauthenticatedUserInteracted', openRegisterLoginModal);
        $scope.$on('$locationChangeStart', locationChangeStart);
        $scope.$on('$routeChangeSuccess', routeChangeSuccess);

        _init();

        /*** Implementations ***/

        function _init() {
            getApplicationInfo();
        }

        function createNew() {
            if (vm.currentUser.isAuthenticated()) {
                $location.url('/' + vm.currentUser.UserName + '/new');
            } else {
                $rootScope.$broadcast('unauthenticatedUserInteracted', true);
            }
        }

        function currentUserChanged(event, newUser) {
            vm.currentUser = newUser;
            isRegisterLoginModalOpened = false;
        }

        function currentUserText() {
            var userText = vm.currentUser.UserName;

            if (vm.currentUser.IsAnonymous) {
                userText += ' (Anonymous)';
            }

            return userText;
        }

        function getApplicationInfo() {
            applicationFactory.getApplicationInfo()
                .then(function (applicationInfo) {
                    vm.applicationInfo = applicationInfo;
                    vm.applicationInfo.CurrentVersionText = vm.applicationInfo.CurrentVersion + ' - Alpha ~ Beta';
                });
        }

        function logout() {
            dataContext.logout()
                .then(function () {
                    $location.url('/');
                });
        }

        function openRegisterLoginModal(event, forceOpen) {
            forceOpen = typeof forceOpen !== 'undefined' ? forceOpen : false;

            if (!isRegisterLoginModalOpened || forceOpen) {

                isRegisterLoginModalOpened = true;

                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        $scope.$on('dataContext_currentUserChanged', closeModal);
                        $scope.$on('LoginController_redirected', closeModal);
                        $scope.$on('RegisterController_userRegistered', closeModal);

                        function closeModal() {
                            $uibModalInstance.close();
                        }
                    }],
                    keyboard: false,
                    size: 'lg',
                    templateUrl: '/_system/views/account/registerLogin.html?v=0.51.0'
                });

                modalInstance.result
                    .then(function () {
                        //isRegisterLoginModalOpened = false;
                    }, function () {
                        //isRegisterLoginModalOpened = false;
                    });
            }
        }

        function locationChangeStart(event, newUrl, oldUrl) {

            if (dataContext.hasChanges()) {

                var modalInstance = $uibModal.open({
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

                        var vm = this;
                        vm.cancel = cancel;
                        vm.leave = leave;

                        function cancel() {
                            $uibModalInstance.dismiss('cancel');
                        }

                        function leave() {
                            $uibModalInstance.close();
                        }
                    }],
                    controllerAs: 'vm',
                    templateUrl: '/_system/views/account/confirmNavigateAway.html?v=0.53.0'
                });

                modalInstance.result.then(function () {

                    // User choose to cancel the changes & navigate away
                    dataContext.rejectChanges();
                    $location.path(newUrl.substring($location.absUrl().length - $location.url().length));

                });

                // Always cancel route changes
                event.preventDefault();
                return;
            }
        }

        function routeChangeSuccess(event, current, previous) {

            // Footer icons
            vm.displayFooterIcons = $location.path() === '/';

            // Load related disqus
            if (typeof current.enableDisqus !== 'undefined' && current.enableDisqus) {
                vm.disqusConfig.disqus_identifier = disqusShortname + $location.path().replace(/\//g, '_');
                vm.disqusConfig.disqus_url = $location.absUrl().substring(0, $location.absUrl().length - $location.url().length + $location.path().length);
            } else {
                vm.disqusConfig.disqus_identifier = '';
            }
        }

        function toggleBankTransfer() {
            vm.displayBankTransfer = !vm.displayBankTransfer;
        }
    }
})();
