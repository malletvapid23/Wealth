﻿//import { LoggerService } from "../../ng2/services/logger";

class TotalCostIndexController {

    static $inject = ["dataContext", "logger", "resourcePoolFactory", "$scope"];

    constructor(dataContext: any, logger: any, resourcePoolFactory: any, $scope: any) {

        var vm: any = this;
        vm.existingModelConfig = { userName: "sample", resourcePoolKey: "Total-Cost-Index-Existing-Model" };
        vm.newModelConfig = { userName: "sample", resourcePoolKey: "Total-Cost-Index-New-Model" };

        // Listen resource pool updated event
        $scope.$on("resourcePoolEditor_elementMultiplierIncreased", updateOppositeResourcePool);
        $scope.$on("resourcePoolEditor_elementMultiplierDecreased", updateOppositeResourcePool);
        $scope.$on("resourcePoolEditor_elementMultiplierReset", updateOppositeResourcePool);

        function updateOppositeResourcePool(event: any, element: any);
        function updateOppositeResourcePool(event, element) {

            var oppositeKey = null;

            if (element.ResourcePool.User.UserName === vm.existingModelConfig.userName &&
                element.ResourcePool.Key === vm.existingModelConfig.resourcePoolKey) {
                oppositeKey = vm.newModelConfig;
            } else if (element.ResourcePool.User.UserName === vm.newModelConfig.userName &&
                element.ResourcePool.Key === vm.newModelConfig.resourcePoolKey) {
                oppositeKey = vm.existingModelConfig;
            }

            // Call the service to increase the multiplier
            if (oppositeKey !== null) {
                resourcePoolFactory.getResourcePoolExpanded(oppositeKey)
                    .then(resourcePool => {

                        switch (event.name) {
                        case "resourcePoolEditor_elementMultiplierIncreased":
                        {
                            resourcePoolFactory.updateElementMultiplier(resourcePool.mainElement(), "increase");
                            break;
                        }
                        case "resourcePoolEditor_elementMultiplierDecreased":
                        {
                            resourcePoolFactory.updateElementMultiplier(resourcePool.mainElement(), "decrease");
                            break;
                        }
                        case "resourcePoolEditor_elementMultiplierReset":
                        {
                            resourcePoolFactory.updateElementMultiplier(resourcePool.mainElement(), "reset");
                            break;
                        }
                        }

                        dataContext.saveChanges(1500);
                    });
            }
        }
    }
}

export const totalCostIndex: angular.IComponentOptions = {
    controller: TotalCostIndexController,
    controllerAs: "vm",
    templateUrl: "/_system/js/app/components/content/totalCostIndex.html?v=0.65.0"
};
