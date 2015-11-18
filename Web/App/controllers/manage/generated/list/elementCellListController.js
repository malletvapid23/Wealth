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

    var controllerId = 'elementCellListController';
    angular.module('main')
        .controller(controllerId, ['elementCellFactory',
            'logger',
			elementCellListController]);

    function elementCellListController(elementCellFactory,
        logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.deleteElementCell = deleteElementCell;
        vm.elementCellSet = [];

        initialize();

        function initialize() {
            getElementCellSet();
        };

        function deleteElementCell(elementCell) {
            elementCellFactory.deleteElementCell(elementCell);

            elementCellFactory.saveChanges()
                .then(function () {
                    vm.elementCellSet.splice(vm.elementCellSet.indexOf(elementCell), 1);
                    logger.logSuccess("Hooray we saved", null, true);
                })
                .catch(function (error) {
                    logger.logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                })
        };

        function getElementCellSet() {
            elementCellFactory.getElementCellSet(false)
			    .then(function (data) {
                    vm.elementCellSet = data;
                });
        }
    };
})();
