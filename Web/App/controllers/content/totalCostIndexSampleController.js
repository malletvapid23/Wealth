﻿(function () {
    'use strict';

    var controllerId = 'totalCostIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['userService', '$rootScope', 'logger', totalCostIndexSampleController]);

    function totalCostIndexSampleController(userService, $rootScope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.isAuthenticated = false;
        vm.totalCostIndex_ExistingSystemSampleResourcePoolId = 7;
        vm.totalCostIndex_NewSystemSampleResourcePoolId = 8;
        vm.totalCostIndex_NewSystemAftermathSampleResourcePoolId = 9;

        // Logged in?
        userService.getUserInfo()
            .then(function (userInfo) {
                vm.isAuthenticated = true;
            });

        // User logged out
        $rootScope.$on('userLoggedOut', function () {
            vm.isAuthenticated = false;
        });
    };
})();
