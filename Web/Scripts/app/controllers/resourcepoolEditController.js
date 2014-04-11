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

    var controllerId = 'resourcePoolEditController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolService',
            'logger',
            '$location',
            '$routeParams',
            resourcePoolEditController]);

    function resourcePoolEditController(resourcePoolService,
		logger,
		$location,
		$routeParams) {

        logger = logger.forSource(controllerId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        var isNew = $location.path() === '/ResourcePool/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.resourcePool = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function cancelChanges() {

            $location.path('/ResourcePool/');

            if (resourcePoolService.hasChanges()) {
                resourcePoolService.rejectChanges();
                logWarning('Discarded pending change(s)', null, true);
            }
        }

        function hasChanges() {
            return resourcePoolService.hasChanges();
        }

        function initialize() {

            if (isNew) {
                // TODO Only for development, create test entity ?!
            }
            else {
                resourcePoolService.getResourcePool($routeParams.Id)
                    .then(function (data) {
                        vm.resourcePool = data;
                    })
                    .catch(function (error) {
                        logError("Boooo, we failed: " + error.message, null, true);
                        // Todo: more sophisticated recovery. 
                        // Here we just blew it all away and start over
                        // refresh();
                    });
            }
        };

        function isSaveDisabled() {
            return isSaving ||
                (!isNew && !resourcePoolService.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                resourcePoolService.createResourcePool(vm.resourcePool);
            }

            isSaving = true;
            return resourcePoolService.saveChanges()
                .then(function () {
                    logSuccess("Hooray we saved", null, true);
                    $location.path('/ResourcePool/');
                })
                .catch(function (error) {
                    logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                })
                .finally(function () {
                    isSaving = false;
                });
        }
    };
})();
