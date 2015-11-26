﻿(function () {
    'use strict';

    var controllerId = 'resourcePoolEditController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory',
            'userFactory',
            '$location',
            '$routeParams',
            '$rootScope',
            '$uibModal',
            'Enums',
            'logger',
            resourcePoolEditController]);

    function resourcePoolEditController(resourcePoolFactory,
        userFactory,
        $location,
        $routeParams,
        $rootScope,
        $uibModal,
        Enums,
        logger) {

        var vm = this;
        vm.addElement = addElement;
        vm.addElementField = addElementField;
        vm.addElementItem = addElementItem;
        vm.cancelElement = cancelElement;
        vm.cancelElementCell = cancelElementCell;
        vm.cancelElementField = cancelElementField;
        vm.cancelElementItem = cancelElementItem;
        vm.cancelResourcePool = cancelResourcePool;
        vm.editElement = editElement;
        vm.editElementCell = editElementCell;
        vm.editElementField = editElementField;
        vm.editElementItem = editElementItem;
        vm.element = null;
        vm.elementMaster = null;
        vm.elementCell = null;
        vm.elementCellMaster = null;
        vm.elementCellSet = elementCellSet;
        vm.elementField = null;
        vm.elementFieldIndexEnabledChanged = elementFieldIndexEnabledChanged;
        vm.elementFieldMaster = null;
        vm.elementFieldSet = elementFieldSet;
        vm.elementFieldDataTypeFiltered = elementFieldDataTypeFiltered;
        vm.elementItem = null;
        vm.elementItemMaster = null;
        vm.elementItemSet = elementItemSet;
        vm.entityErrors = [];
        vm.isElementEdit = false;
        vm.isElementNew = true;
        vm.isElementFieldEdit = false;
        vm.isElementFieldNew = true;
        vm.isElementItemEdit = false;
        vm.isElementItemNew = true;
        vm.isNew = $location.path() === '/resourcePool/new';
        vm.isSaveEnabled = isSaveEnabled;
        vm.isSaving = false;
        vm.openCopyModal = openCopyModal;
        vm.openRemoveResourcePoolModal = openRemoveResourcePoolModal;
        vm.removeElement = removeElement;
        vm.removeElementField = removeElementField;
        vm.removeElementItem = removeElementItem;
        vm.removeResourcePool = removeResourcePool;
        vm.resourcePool = { ElementSet: [] };
        vm.resourcePoolId = $routeParams.Id;
        vm.saveResourcePool = saveResourcePool;
        vm.saveElement = saveElement;
        vm.saveElementCell = saveElementCell;
        vm.saveElementField = saveElementField;
        vm.saveElementItem = saveElementItem;
        vm.title = '';

        // Enums
        vm.ElementFieldDataType = Enums.ElementFieldDataType;
        vm.ElementFieldIndexCalculationType = Enums.ElementFieldIndexCalculationType;
        vm.ElementFieldIndexSortType = Enums.ElementFieldIndexSortType;

        init();

        function init() {
            if (vm.isNew) {
                resourcePoolFactory.createResourcePoolBasic()
                    .then(function (resourcePool) {
                        vm.resourcePool = resourcePool;

                        // Title
                        vm.title = 'New CMRP';
                        $rootScope.viewTitle = vm.title;
                    });
            } else {
                resourcePoolFactory.getResourcePoolExpanded(vm.resourcePoolId)
                    .then(function (resourcePool) {

                        if (resourcePool === null) {
                            // TODO ?
                            return;
                        }

                        vm.resourcePool = resourcePool;

                        // Title
                        vm.title = resourcePool.Name + ' - Edit';
                        $rootScope.viewTitle = vm.title;
                    });
            }
        }

        function addElement() {
            vm.element = { ResourcePool: vm.resourcePool, Name: 'New element', IsMainElement: false };
            vm.isElementEdit = true;
            vm.isElementNew = true;
        }

        function addElementField() {

            var element = vm.resourcePool.ElementSet[0];

            // A temp fix for default value of 'SortOrder'
            // Later handle 'SortOrder' by UI, not by asking
            var sortOrder = element.ElementFieldSet.length + 1;

            vm.elementField = { Element: element, Name: 'New field', DataType: 1, SortOrder: sortOrder };
            vm.isElementFieldEdit = true;
            vm.isElementFieldNew = true;
        }

        function addElementItem() {
            vm.elementItem = { Element: vm.resourcePool.ElementSet[0], Name: 'New item' };
            vm.isElementItemEdit = true;
            vm.isElementItemNew = true;
        }

        function cancelElement() {

            // TODO Find a better way?
            // Can't use reject changes because in 'New CMRP' case, these are newly added entities and reject changes removes them / SH - 23 Nov. '15
            if (!vm.isElementNew) {
                vm.element.Name = vm.elementMaster.Name;
            }

            vm.isElementEdit = false;
            vm.element = null;
            vm.elementMaster = null;
        }

        function cancelElementCell() {

            // TODO Find a better way?
            // Can't use reject changes because in 'New CMRP' case, these are newly added entities and reject changes removes them / SH - 23 Nov. '15
            vm.elementCell.SelectedElementItemId = vm.elementCellMaster.SelectedElementItemId;
            vm.elementCell.UserElementCellSet[0].StringValue = vm.elementCellMaster.UserElementCellSet[0].StringValue;
            vm.elementCell.UserElementCellSet[0].BooleanValue = vm.elementCellMaster.UserElementCellSet[0].BooleanValue;
            vm.elementCell.UserElementCellSet[0].IntegerValue = vm.elementCellMaster.UserElementCellSet[0].IntegerValue;
            vm.elementCell.UserElementCellSet[0].DecimalValue = vm.elementCellMaster.UserElementCellSet[0].DecimalValue;
            vm.elementCell.UserElementCellSet[0].DateTimeValue = vm.elementCellMaster.UserElementCellSet[0].DateTimeValue;

            vm.isElementCellEdit = false;
            vm.elementCell = null;
            vm.elementCellMaster = null;
        }

        function cancelElementField() {

            // TODO Find a better way?
            // Can't use reject changes because in 'New CMRP' case, these are newly added entities and reject changes removes them / SH - 23 Nov. '15
            if (!vm.isElementFieldNew) {
                vm.elementField.Name = vm.elementFieldMaster.Name;
                vm.elementField.DataType = vm.elementFieldMaster.DataType;
                vm.elementField.SelectedElementId = vm.elementFieldMaster.SelectedElementId;
                vm.elementField.UseFixedValue = vm.elementFieldMaster.UseFixedValue;
                vm.elementField.IndexEnabled = vm.elementFieldMaster.IndexEnabled;
                vm.elementField.IndexCalculationType = vm.elementFieldMaster.IndexCalculationType;
                vm.elementField.IndexSortType = vm.elementFieldMaster.IndexSortType;
                vm.elementField.SortOrder = vm.elementFieldMaster.SortOrder;
            }

            vm.isElementFieldEdit = false;
            vm.elementField = null;
            vm.elementFieldMaster = null;
        }

        function cancelElementItem() {

            // TODO Find a better way?
            // Can't use reject changes because in 'New CMRP' case, these are newly added entities and reject changes removes them / SH - 23 Nov. '15
            if (!vm.isElementItemNew) {
                vm.elementItem.Name = vm.elementItemMaster.Name;
            }

            vm.isElementItemEdit = false;
            vm.elementItem = null;
            vm.elementItemMaster = null;
        }

        function cancelResourcePool() {

            //if (vm.isNew) {
            //    resourcePoolFactory.removeResourcePool(vm.resourcePool);
            //} else {
            resourcePoolFactory.cancelResourcePool(vm.resourcePool);
            //}

            if (vm.isNew) {
                $location.path('/resourcePool');
            } else {
                $location.path('/resourcePool/' + vm.resourcePool.Id);
            }
        }

        function editElement(element) {
            vm.elementMaster = angular.copy(element);
            vm.element = element;
            vm.isElementEdit = true;
            vm.isElementNew = false;
        }

        function editElementCell(elementCell) {
            vm.elementCellMaster = angular.copy(elementCell);
            vm.elementCell = elementCell;
            vm.isElementCellEdit = true;
        }

        function editElementField(elementField) {
            vm.elementFieldMaster = angular.copy(elementField);
            vm.elementField = elementField;
            vm.isElementFieldEdit = true;
            vm.isElementFieldNew = false;
        }

        function editElementItem(elementItem) {
            vm.elementItemMaster = angular.copy(elementItem);
            vm.elementItem = elementItem;
            vm.isElementItemEdit = true;
            vm.isElementItemNew = false;
        }

        function elementCellSet() {

            var elementItems = elementItemSet();

            var list = [];
            for (var i = 0; i < elementItems.length; i++) {
                var elementItem = elementItems[i];
                for (var i2 = 0; i2 < elementItem.ElementCellSet.length; i2++) {
                    list.push(elementItem.ElementCellSet[i2]);
                }
            }
            return list;
        }

        function elementFieldIndexEnabledChanged() {
            vm.elementField.IndexCalculationType = vm.elementField.IndexEnabled ? 1 : 0;
            vm.elementField.IndexSortType = vm.elementField.IndexEnabled ? 1 : 0;
        }

        function elementFieldSet() {
            var list = [];
            for (var i = 0; i < vm.resourcePool.ElementSet.length; i++) {
                var element = vm.resourcePool.ElementSet[i];
                for (var i2 = 0; i2 < element.ElementFieldSet.length; i2++) {
                    list.push(element.ElementFieldSet[i2]);
                }
            }
            return list;
        }

        function elementFieldDataTypeFiltered() {

            var filtered = {};
            for (var key in vm.ElementFieldDataType) {

                // These types can be added only once at the moment
                if (key === 'DirectIncome' || key === 'Multiplier') {
                    var exists = false;
                    angular.forEach(vm.elementField.Element.ElementFieldSet, function (field) {
                        if (field.ElementFieldDataType === vm.ElementFieldDataType[key]) {
                            exists = true;
                        }
                    });

                    if (!exists) {
                        filtered[key] = vm.ElementFieldDataType[key];
                    }
                } else {
                    filtered[key] = vm.ElementFieldDataType[key];
                }
            }

            return filtered;
        }

        function elementItemSet() {
            var list = [];
            for (var i = 0; i < vm.resourcePool.ElementSet.length; i++) {
                var element = vm.resourcePool.ElementSet[i];
                for (var i2 = 0; i2 < element.ElementItemSet.length; i2++) {
                    list.push(element.ElementItemSet[i2]);
                }
            }
            return list;
        }

        function isSaveEnabled() {
            var value = !vm.isSaving
                && typeof vm.resourcePoolForm !== 'undefined'
                && vm.resourcePoolForm.$valid;

            return value;
        }

        function openCopyModal() {
            var modalInstance = $uibModal.open({
                templateUrl: 'copyResourcePoolModal.html',
                controllerAs: 'vm',
                controller: function (resourcePoolFactory, $uibModalInstance) {

                    var vm = this;
                    vm.close = close;
                    vm.copy = copy;
                    vm.resourcePoolSet = [];

                    initialize();

                    function close() {
                        $uibModalInstance.dismiss('cancel');
                    };

                    function copy(resourcePool) {
                        $uibModalInstance.close(resourcePool);
                    };

                    function initialize() {
                        resourcePoolFactory.getResourcePoolSet(false)
                            .then(function (data) {
                                vm.resourcePoolSet = data;
                            });
                    };
                }
            });

            modalInstance.result.then(function (resourcePool) {
                vm.resourcePool = resourcePool;
            });
        }

        function openRemoveResourcePoolModal() {
            var modalInstance = $uibModal.open({
                templateUrl: 'removeResourcePoolModal.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }
                    $scope.remove = function () {
                        $uibModalInstance.close();
                    };
                }
            });

            modalInstance.result.then(function () {
                removeResourcePool();
            });
        }

        function removeElement(element) {
            resourcePoolFactory.removeElement(element);
        }

        function removeElementField(elementField) {
            resourcePoolFactory.removeElementField(elementField);
        }

        function removeElementItem(elementItem) {
            resourcePoolFactory.removeElementItem(elementItem);
        }

        function removeResourcePool() {

            vm.isSaving = true;

            resourcePoolFactory.removeResourcePool(vm.resourcePool);

            userFactory.isAuthenticated()
                .then(function (isAuthenticated) {
                    if (isAuthenticated) {
                        vm.isSaving = true;
                        resourcePoolFactory.saveChanges()
                            .then(function () {
                                $location.path('/resourcePool');
                            })
                            // TODO catch?
                            .finally(function () {
                                vm.isSaving = false;
                            });
                    } else {
                        $location.path('/resourcePool');
                    }
                });
        }

        function saveElement() {

            if (vm.isElementNew) {
                vm.element = resourcePoolFactory.createElement(vm.element);
            }

            // Main element check: If IsMainElement flag is true for this item, remove this flag from other elements
            if (vm.element.IsMainElement) {
                angular.forEach(vm.element.ResourcePool.ElementSet, function (element) {
                    if (element !== vm.element && element.IsMainElement) {
                        element.IsMainElement = false;
                    }
                });
            }

            vm.isElementEdit = false;
            vm.element = null;
            vm.elementMaster = null;
        }

        function saveElementCell() {
            vm.isElementCellEdit = false;
            vm.elementCell = null;
            vm.elementCellMaster = null;
        }

        function saveElementField() {

            // Fixes
            // a. UseFixedValue must be null for String & Element types
            if (vm.elementField.DataType === vm.ElementFieldDataType.String
                || vm.elementField.DataType === vm.ElementFieldDataType.Element) {
                vm.elementField.UseFixedValue = null;
            }

            // b. UseFixedValue must be 'true' for Multiplier type
            if (vm.elementField.DataType === vm.ElementFieldDataType.Multiplier) {
                vm.elementField.UseFixedValue = true;
            }

            if (vm.isElementFieldNew) {
                vm.elementField = resourcePoolFactory.createElementField(vm.elementField);
            }

            vm.isElementFieldEdit = false;
            vm.elementField = null;
            vm.elementFieldMaster = null;
        }

        function saveElementItem() {

            if (vm.isElementItemNew) {
                vm.elementItem = resourcePoolFactory.createElementItem(vm.elementItem);
            }

            vm.isElementItemEdit = false;
            vm.elementItem = null;
            vm.elementItemMaster = null;
        }

        function saveResourcePool() {

            userFactory.isAuthenticated()
                .then(function (isAuthenticated) {
                    if (isAuthenticated) {
                        vm.isSaving = true;
                        resourcePoolFactory.saveChanges()
                            .then(function () {
                                $location.path('/resourcePool/' + vm.resourcePool.Id);
                            })
                            // TODO catch?
                            .finally(function () {
                                vm.isSaving = false;
                            });
                    } else {
                        $location.path('/resourcePool/' + vm.resourcePool.Id);
                    }
                });
        };
    };
})();
