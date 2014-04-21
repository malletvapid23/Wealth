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

    var controllerId = 'sectorListController';
    angular.module('main')
        .controller(controllerId, ['sectorService',
            'logger',
			sectorListController]);

    function sectorListController(sectorService,
        logger) {

        logger = logger.forSource(controllerId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        var vm = this;
        vm.deleteSector = deleteSector;
        vm.sectorSet = [];

        initialize();

        function initialize() {
            getSectorSet();
        };

        function deleteSector(sector) {
            sectorService.deleteSector(sector);

            sectorService.saveChanges()
                .then(function () {
                    vm.sectorSet.splice(vm.sectorSet.indexOf(sector), 1);
                    logSuccess("Hooray we saved", null, true);
                })
                .catch(function (error) {
                    logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                })
        };

        function getSectorSet() {
            sectorService.getSectorSet(false)
			    .then(function (data) {
                    vm.sectorSet = data;
                });
        }
    };
})();
