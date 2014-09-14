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

    var controllerId = 'organizationEditController';
    angular.module('main')
        .controller(controllerId, ['organizationService',
            'sectorService',
            'logger',
            '$location',
            '$routeParams',
            organizationEditController]);

    function organizationEditController(organizationService,
		sectorService,
		logger,
		$location,
		$routeParams) {
        logger = logger.forSource(controllerId);

        var isNew = $location.path() === '/manage/organization/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.sectorSet = [];
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.organization = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function cancelChanges() {

            $location.path('/manage/organization');

            if (organizationService.hasChanges()) {
                organizationService.rejectChanges();
                logWarning('Discarded pending change(s)', null, true);
            }
        }

        function hasChanges() {
            return organizationService.hasChanges();
        }

        function initialize() {

            sectorService.getSectorSet(false)
                .then(function (data) {
                    vm.sectorSet = data;
                });

            if (isNew) {
                // TODO For development enviroment, create test entity?
            }
            else {
                organizationService.getOrganization($routeParams.Id)
                    .then(function (data) {
                        vm.organization = data;
                    })
                    .catch(function (error) {
                        // TODO User-friendly message?
                    });
            }
        };

        function isSaveDisabled() {
            return isSaving ||
                (!isNew && !organizationService.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                organizationService.createOrganization(vm.organization);
            } else {
                // To be able to do concurrency check, RowVersion field needs to be send to server
				// Since breeze only sends the modified fields, a fake modification had to be applied to RowVersion field
                var rowVersion = vm.organization.RowVersion;
                vm.organization.RowVersion = '';
                vm.organization.RowVersion = rowVersion;
            }

            isSaving = true;
            organizationService.saveChanges()
                .then(function (result) {
                    $location.path('/manage/organization');
                })
                .catch(function (error) {
                    // Conflict (Concurrency exception)
                    if (error.status === '409') {
                        // TODO Try to recover!
                    }
                })
                .finally(function () {
                    isSaving = false;
                });
        }
    };
})();
