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

    var controllerId = 'userElementCellEditController';
    angular.module('main')
        .controller(controllerId, ['userElementCellService',
            'elementCellService',
            'userService',
            'logger',
            '$location',
            '$routeParams',
            userElementCellEditController]);

    function userElementCellEditController(userElementCellService,
		elementCellService,
		userService,
		logger,
		$location,
		$routeParams) {
        logger = logger.forSource(controllerId);

        var isNew = $location.path() === '/manage/userElementCell/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.elementCellSet = [];
        vm.userSet = [];
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.entityErrors = [];
        vm.userElementCell = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function cancelChanges() {

            $location.path('/manage/userElementCell');

            if (userElementCellService.hasChanges()) {
                userElementCellService.rejectChanges();
                logWarning('Discarded pending change(s)', null, true);
            }
        }

        function hasChanges() {
            return userElementCellService.hasChanges();
        }

        function initialize() {

            elementCellService.getElementCellSet(false)
                .then(function (data) {
                    vm.elementCellSet = data;
                });

            userService.getUserSet(false)
                .then(function (data) {
                    vm.userSet = data;
                });

            if (isNew) {
                // TODO For development enviroment, create test entity?
            }
            else {
                userElementCellService.getUserElementCell($routeParams.Id)
                    .then(function (data) {
                        vm.userElementCell = data;
                    })
                    .catch(function (error) {
                        // TODO User-friendly message?
                    });
            }
        };

        function isSaveDisabled() {
            return isSaving ||
                (!isNew && !userElementCellService.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                userElementCellService.createUserElementCell(vm.userElementCell);
            } else {
                // To be able to do concurrency check, RowVersion field needs to be send to server
				// Since breeze only sends the modified fields, a fake modification had to be applied to RowVersion field
                var rowVersion = vm.userElementCell.RowVersion;
                vm.userElementCell.RowVersion = '';
                vm.userElementCell.RowVersion = rowVersion;
            }

            isSaving = true;
            userElementCellService.saveChanges()
                .then(function (result) {
                    $location.path('/manage/userElementCell');
                })
                .catch(function (error) {
                    // Conflict (Concurrency exception)
                    if (error.status !== 'undefined' && error.status === '409') {
                        // TODO Try to recover!
                    } else if (error.entityErrors !== 'undefined') {
                        vm.entityErrors = error.entityErrors;
                    }
                })
                .finally(function () {
                    isSaving = false;
                });
        }
    };
})();
