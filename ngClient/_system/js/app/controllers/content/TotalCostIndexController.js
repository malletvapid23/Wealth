﻿(function () {
    'use strict';

    var controllerId = 'TotalCostIndexController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'dataContext', '$scope', 'logger', TotalCostIndexController]);

    function TotalCostIndexController(resourcePoolFactory, dataContext, $scope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.existingModelConfig = { resourcePoolId: 5 };
        vm.newModelConfig = { resourcePoolId: 6 };

        // Listen resource pool updated event
        $scope.$on('resourcePoolEditor_elementMultiplierIncreased', updateOppositeResourcePool);
        $scope.$on('resourcePoolEditor_elementMultiplierDecreased', updateOppositeResourcePool);
        $scope.$on('resourcePoolEditor_elementMultiplierReset', updateOppositeResourcePool);

        function updateOppositeResourcePool(event, element) {

            var oppositeResourcePoolId = 0;

            if (element.ResourcePool.Id === vm.existingModelConfig.resourcePoolId) {
                oppositeResourcePoolId = vm.newModelConfig.resourcePoolId;
            } else if (element.ResourcePool.Id === vm.newModelConfig.resourcePoolId) {
                oppositeResourcePoolId = vm.existingModelConfig.resourcePoolId;
            }

            // Call the service to increase the multiplier
            if (oppositeResourcePoolId > 0) {
                resourcePoolFactory.getResourcePoolExpanded(oppositeResourcePoolId)
                    .then(function (resourcePool) {

                        switch (event.name) {
                            case 'resourcePoolEditor_elementMultiplierIncreased': {
                                dataContext.updateElementMultiplier(resourcePool.mainElement(), 'increase');
                                break;
                            }
                            case 'resourcePoolEditor_elementMultiplierDecreased': {
                                dataContext.updateElementMultiplier(resourcePool.mainElement(), 'decrease');
                                break;
                            }
                            case 'resourcePoolEditor_elementMultiplierReset': {
                                dataContext.updateElementMultiplier(resourcePool.mainElement(), 'reset');
                                break;
                            }
                        }

                        resourcePoolFactory.saveChanges(1500);
                    });
            }
        }
    }
})();
