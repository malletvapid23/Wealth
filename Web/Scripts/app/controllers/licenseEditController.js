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

    var controllerId = 'licenseEditController';
    angular.module('main')
        .controller(controllerId, ['licenseService',
            'resourcePoolService',
            'logger',
            '$location',
            '$routeParams',
            licenseEditController]);

    function licenseEditController(licenseService,
		resourcePoolService,
		logger,
		$location,
		$routeParams) {
        logger = logger.forSource(controllerId);

        var isNew = $location.path() === '/License/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.resourcePoolSet = [];
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.license = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function cancelChanges() {

            $location.path('/License/');

            if (licenseService.hasChanges()) {
                licenseService.rejectChanges();
                logWarning('Discarded pending change(s)', null, true);
            }
        }

        function hasChanges() {
            return licenseService.hasChanges();
        }

        function initialize() {

            resourcePoolService.getResourcePoolSet(false)
                .then(function (data) {
                    vm.resourcePoolSet = data;
                });

            // TODO Catch?

            if (isNew) {
                // TODO Only for development, create test entity ?!
            }
            else {
                licenseService.getLicense($routeParams.Id)
                    .then(function (data) {
                        vm.license = data;
                    })
                    .catch(function (error) {
                        logger.logError("Boooo, we failed: " + error.message, null, true);
                        // Todo: more sophisticated recovery. 
                        // Here we just blew it all away and start over
                        // refresh();
                    });
            }
        };

        function isSaveDisabled() {
            return isSaving ||
                (!isNew && !licenseService.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                licenseService.createLicense(vm.license);
            }

            isSaving = true;
            return licenseService.saveChanges()
                .then(function () {
                    logger.logSuccess("Hooray we saved", null, true);
                    $location.path('/License/');
                })
                .catch(function (error) {
                    logger.logError("Boooo, we failed: " + error.message, null, true);
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
