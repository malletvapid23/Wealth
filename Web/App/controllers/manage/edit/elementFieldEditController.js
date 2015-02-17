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

    var controllerId = 'elementFieldEditController';
    angular.module('main')
        .controller(controllerId, ['elementFieldService',
            'elementService',
            'logger',
            '$location',
            '$routeParams',
            elementFieldEditController]);

    function elementFieldEditController(elementFieldService,
		elementService,
		logger,
		$location,
		$routeParams) {
        logger = logger.forSource(controllerId);

        var isNew = $location.path() === '/manage/elementField/new';
        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.elementSet = [];
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.entityErrors = [];
        vm.elementField = null;
        vm.saveChanges = saveChanges;
        vm.hasChanges = hasChanges;

        initialize();

        /*** Implementations ***/

        function cancelChanges() {

            $location.path('/manage/elementField');

            //if (elementFieldService.hasChanges()) {
            //    elementFieldService.rejectChanges();
            //    logWarning('Discarded pending change(s)', null, true);
            //}
        }

        function hasChanges() {
            return elementFieldService.hasChanges();
        }

        function initialize() {

            elementService.getElementSet(false)
                .then(function (data) {
                    vm.elementSet = data;
                });

            if (isNew) {
                // TODO For development enviroment, create test entity?
            }
            else {
                elementFieldService.getElementField($routeParams.Id)
                    .then(function (data) {
                        vm.elementField = data;
                    })
                    .catch(function (error) {
                        // TODO User-friendly message?
                    });
            }
        };

        function isSaveDisabled() {
            return isSaving ||
                (!isNew && !elementFieldService.hasChanges());
        }

        function saveChanges() {

            if (isNew) {
                elementFieldService.createElementField(vm.elementField);
            }

            isSaving = true;
            elementFieldService.saveChanges()
                .then(function (result) {
                    $location.path('/manage/elementField');
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
