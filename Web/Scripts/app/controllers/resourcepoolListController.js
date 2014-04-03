//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

(function () {
    'use strict';

    var controllerId = 'resourcepoolListController';
    angular.module('main')
        .controller(controllerId, ['resourcepoolService', 'logger', resourcepoolListController]);

    function resourcepoolListController(resourcepoolService, logger) {

        logger = logger.forSource(controllerId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        var vm = this;
        vm.deleteResourcePool = deleteResourcePool;
        vm.resourcepoolSet = [];

        initialize();

        function initialize() {
            getResourcePoolSet();
        };

        function deleteResourcePool(resourcepool) {
            resourcepoolService.deleteResourcePool(resourcepool);

            resourcepoolService.saveChanges()
                .then(function () {
                    vm.resourcepoolSet.splice(vm.resourcepoolSet.indexOf(resourcepool), 1);
                    logSuccess("Hooray we saved", null, true);
                })
                .catch(function (error) {
                    logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                })
        };

        function getResourcePoolSet(forceRefresh) {
            return resourcepoolService.getResourcePoolSet(forceRefresh).then(function (data) {
                return vm.resourcepoolSet = data;
            });
        }
    };
})();
