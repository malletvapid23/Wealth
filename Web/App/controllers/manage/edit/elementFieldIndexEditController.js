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

    var controllerId = 'elementFieldIndexEditController';
    angular.module('main')
        .controller(controllerId, ['elementFieldIndexService',
            'elementFieldService',
            'logger',
            '$location',
            '$routeParams',
            elementFieldIndexEditController]);

    function elementFieldIndexEditController(elementFieldIndexService,
		elementFieldService,
		logger,
		$location,
		$routeParams) {
        logger = logger.forSource(controllerId);

        var isNew = $location.path() === '/manage/elementFieldIndex/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.elementFieldSet = [];
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.entityErrors = [];
        vm.elementFieldIndex = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function cancelChanges() {

            $location.path('/manage/elementFieldIndex');

            //if (elementFieldIndexService.hasChanges()) {
            //    elementFieldIndexService.rejectChanges();
            //    logWarning('Discarded pending change(s)', null, true);
            //}
        }

        function hasChanges() {
            return elementFieldIndexService.hasChanges();
        }

        function initialize() {

            elementFieldService.getElementFieldSet(false)
                .then(function (data) {
                    vm.elementFieldSet = data;
                });

            if (isNew) {
                // TODO For development enviroment, create test entity?
            }
            else {
                elementFieldIndexService.getElementFieldIndex($routeParams.Id)
                    .then(function (data) {
                        vm.elementFieldIndex = data;
                    })
                    .catch(function (error) {
                        // TODO User-friendly message?
                    });
            }
        };

        function isSaveDisabled() {
            return isSaving ||
                (!isNew && !elementFieldIndexService.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                elementFieldIndexService.createElementFieldIndex(vm.elementFieldIndex);
            } else {
                // To be able to do concurrency check, RowVersion field needs to be send to server
				// Since breeze only sends the modified fields, a fake modification had to be applied to RowVersion field
                var rowVersion = vm.elementFieldIndex.RowVersion;
                vm.elementFieldIndex.RowVersion = '';
                vm.elementFieldIndex.RowVersion = rowVersion;
            }

            isSaving = true;
            elementFieldIndexService.saveChanges()
                .then(function (result) {
                    $location.path('/manage/elementFieldIndex');
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
