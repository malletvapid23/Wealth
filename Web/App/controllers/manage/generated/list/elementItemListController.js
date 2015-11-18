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

    var controllerId = 'elementItemListController';
    angular.module('main')
        .controller(controllerId, ['elementItemFactory',
            'logger',
			elementItemListController]);

    function elementItemListController(elementItemFactory,
        logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.deleteElementItem = deleteElementItem;
        vm.elementItemSet = [];

        initialize();

        function initialize() {
            getElementItemSet();
        };

        function deleteElementItem(elementItem) {
            elementItemFactory.deleteElementItem(elementItem);

            elementItemFactory.saveChanges()
                .then(function () {
                    vm.elementItemSet.splice(vm.elementItemSet.indexOf(elementItem), 1);
                    logger.logSuccess("Hooray we saved", null, true);
                })
                .catch(function (error) {
                    logger.logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                })
        };

        function getElementItemSet() {
            elementItemFactory.getElementItemSet(false)
			    .then(function (data) {
                    vm.elementItemSet = data;
                });
        }
    };
})();
