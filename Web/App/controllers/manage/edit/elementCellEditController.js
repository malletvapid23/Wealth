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

    var controllerId = 'elementCellEditController';
    angular.module('main')
        .controller(controllerId, ['elementCellService',
            'elementFieldService',
            'elementItemService',
            'logger',
            '$location',
            '$routeParams',
            elementCellEditController]);

    function elementCellEditController(elementCellService,
		elementFieldService,
		elementItemService,
		logger,
		$location,
		$routeParams) {
        logger = logger.forSource(controllerId);

        var isNew = $location.path() === '/manage/elementCell/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.elementFieldSet = [];
        vm.elementItemSet = [];
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.entityErrors = [];
        vm.elementCell = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function cancelChanges() {

            $location.path('/manage/elementCell');

            //if (elementCellService.hasChanges()) {
            //    elementCellService.rejectChanges();
            //    logWarning('Discarded pending change(s)', null, true);
            //}
        }

        function hasChanges() {
            return elementCellService.hasChanges();
        }

        function initialize() {

            elementFieldService.getElementFieldSet(false)
                .then(function (data) {
                    vm.elementFieldSet = data;
                });

            elementItemService.getElementItemSet(false)
                .then(function (data) {
                    vm.elementItemSet = data;
                });

            if (isNew) {
                // TODO For development enviroment, create test entity?
            }
            else {
                elementCellService.getElementCell($routeParams.Id)
                    .then(function (data) {
                        vm.elementCell = data;
                    })
                    .catch(function (error) {
                        // TODO User-friendly message?
                    });
            }
        };

        function isSaveDisabled() {
            return isSaving ||
                (!isNew && !elementCellService.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                elementCellService.createElementCell(vm.elementCell);
            } else {
                // To be able to do concurrency check, RowVersion field needs to be send to server
				// Since breeze only sends the modified fields, a fake modification had to be applied to RowVersion field
                var rowVersion = vm.elementCell.RowVersion;
                vm.elementCell.RowVersion = '';
                vm.elementCell.RowVersion = rowVersion;
            }

            isSaving = true;
            elementCellService.saveChanges()
                .then(function (result) {
                    $location.path('/manage/elementCell');
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
