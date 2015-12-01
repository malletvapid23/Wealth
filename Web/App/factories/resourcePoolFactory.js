﻿
(function () {
    'use strict';

    var factoryId = 'resourcePoolFactory';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(factoryId, [
                '$delegate',
                'ResourcePool',
                'Element',
                'userFactory',
                'dataContext',
                '$rootScope',
                'logger',
                resourcePoolFactory]);
        });

    function resourcePoolFactory(
        $delegate,
        ResourcePool,
        Element,
        userFactory,
        dataContext,
        $rootScope,
        logger) {

        // Logger
        logger = logger.forSource(factoryId);

        var fetched = [];

        // Factory methods
        $delegate.acceptChanges = acceptChanges;
        $delegate.cancelResourcePool = cancelResourcePool;
        $delegate.copyResourcePool = copyResourcePool;
        $delegate.createElement = createElement;
        $delegate.createElementField = createElementField;
        $delegate.createElementItem = createElementItem;
        $delegate.createResourcePoolBasic = createResourcePoolBasic;
        $delegate.createResourcePoolDirectIncomeAndMultiplier = createResourcePoolDirectIncomeAndMultiplier;
        $delegate.createResourcePoolTwoElements = createResourcePoolTwoElements;
        $delegate.getResourcePoolExpanded = getResourcePoolExpanded;
        $delegate.removeElement = removeElement;
        $delegate.removeElementField = removeElementField;
        $delegate.removeElementItem = removeElementItem;
        $delegate.removeResourcePool = removeResourcePool;
        $delegate.removeResourcePoolFromCache = removeResourcePoolFromCache;
        $delegate.saveChanges = saveChanges;

        // User logged out
        $rootScope.$on('userLoggedIn', function () {
            fetched = [];
        });
        $rootScope.$on('userLoggedOut', function () {
            fetched = [];
        });

        return $delegate;

        /*** Implementations ***/

        function acceptChanges(resourcePool) {

            // Set isAdded flag to true, so before saving it to database,
            // we can replace resource pool and its child entities state back to 'isAdded'
            if (resourcePool.entityAspect.entityState.isAdded()) {
                resourcePool.isAdded = true;
            }

            // Resource pool itself
            resourcePool.entityAspect.acceptChanges();

            // If isAdded, then make it modified, so it be retrieved when getChanges() called
            if (resourcePool.isAdded) {
                resourcePool.entityAspect.setModified();
            }

            // User resource pools
            angular.forEach(resourcePool.UserResourcePoolSet, function (userResourcePool) {
                userResourcePool.entityAspect.acceptChanges();
            });

            // Elements
            angular.forEach(resourcePool.ElementSet, function (element) {
                element.entityAspect.acceptChanges();

                // Fields
                angular.forEach(element.ElementFieldSet, function (elementField) {
                    elementField.entityAspect.acceptChanges();

                    // User element fields
                    angular.forEach(elementField.UserElementFieldSet, function (userElementField) {
                        userElementField.entityAspect.acceptChanges();
                    });
                });

                // Items
                angular.forEach(element.ElementItemSet, function (elementItem) {
                    elementItem.entityAspect.acceptChanges();

                    // Cells
                    angular.forEach(elementItem.ElementCellSet, function (elementCell) {
                        elementCell.entityAspect.acceptChanges();

                        // User cells
                        angular.forEach(elementCell.UserElementCellSet, function (userElementCell) {
                            userElementCell.entityAspect.acceptChanges();
                        });
                    });
                });
            });
        }

        function cancelResourcePool(resourcePool) {

            // Resource pool itself
            resourcePool.entityAspect.rejectChanges();

            // User resource pools
            angular.forEach(resourcePool.UserResourcePoolSet, function (userResourcePool) {
                userResourcePool.entityAspect.rejectChanges();
            });

            // Elements
            angular.forEach(resourcePool.ElementSet, function (element) {
                element.entityAspect.rejectChanges();

                // Fields
                angular.forEach(element.ElementFieldSet, function (elementField) {
                    elementField.entityAspect.rejectChanges();

                    // User element fields
                    angular.forEach(elementField.UserElementFieldSet, function (userElementField) {
                        userElementField.entityAspect.rejectChanges();
                    });
                });

                // Items
                angular.forEach(element.ElementItemSet, function (elementItem) {
                    elementItem.entityAspect.rejectChanges();

                    // Cells
                    angular.forEach(elementItem.ElementCellSet, function (elementCell) {
                        elementCell.entityAspect.rejectChanges();

                        // User cells
                        angular.forEach(elementCell.UserElementCellSet, function (userElementCell) {
                            userElementCell.entityAspect.rejectChanges();
                        });
                    });
                });
            });
        }

        function copyResourcePool(resourcePoolSource) {
            // TODO
        }

        function createElement(element) {
            return dataContext.createEntity('Element', element);
        }

        function createElementCell(elementCell) {

            var elementCell = dataContext.createEntity('ElementCell', elementCell);

            // User element cell
            if (elementCell.ElementField.DataType !== 6) {
                var userElementCell = dataContext.createEntity('UserElementCell', {
                    User: elementCell.ElementField.Element.ResourcePool.User,
                    ElementCell: elementCell
                });

                switch (elementCell.ElementField.DataType) {
                    case 1: { userElementCell.StringValue = ''; break; }
                    case 2: { userElementCell.BooleanValue = false; break; }
                    case 3: { userElementCell.IntegerValue = 0; break; }
                    case 4: { userElementCell.DecimalValue = 50; break; }
                        // TODO 5 (DateTime?)
                    case 11: { userElementCell.DecimalValue = 100; break; }
                    case 12: { userElementCell.DecimalValue = 0; break; }
                }
            }

            return elementCell;
        }

        function createElementField(elementField) {

            elementField = dataContext.createEntity('ElementField', elementField);

            // Related cells
            for (var i = 0; i < elementField.Element.ElementItemSet.length; i++) {
                var elementItem = elementField.Element.ElementItemSet[i];
                createElementCell({
                    ElementField: elementField,
                    ElementItem: elementItem
                });
            }

            return elementField;
        }

        function createElementItem(elementItem) {

            elementItem = dataContext.createEntity('ElementItem', elementItem);

            // Related cells
            for (var i = 0; i < elementItem.Element.ElementFieldSet.length; i++) {
                var elementField = elementItem.Element.ElementFieldSet[i];
                createElementCell({
                    ElementField: elementField,
                    ElementItem: elementItem
                });
            }

            return elementItem;
        }

        function createResourcePoolBasic() {

            return userFactory.getCurrentUser()
                .then(function (currentUser) {

                    var resourcePoolRate = 10;

                    var resourcePool = dataContext.createEntity('ResourcePool', {
                        User: currentUser,
                        Name: 'New CMRP',
                        InitialValue: 100,
                        ResourcePoolRateTotal: resourcePoolRate,
                        ResourcePoolRateCount: 1,
                        RatingCount: 1,
                        UseFixedResourcePoolRate: false
                    });

                    dataContext.createEntity('UserResourcePool', {
                        User: currentUser,
                        ResourcePool: resourcePool,
                        ResourcePoolRate: resourcePoolRate
                    });

                    var element = dataContext.createEntity('Element', {
                        ResourcePool: resourcePool,
                        Name: 'New element'
                    });
                    element.IsMainElement = true;

                    // Importance field (index)
                    var importanceField = createElementField({
                        Element: element,
                        Name: 'Importance',
                        DataType: 4,
                        UseFixedValue: false,
                        IndexEnabled: true,
                        IndexCalculationType: 2,
                        IndexSortType: 1,
                        SortOrder: 1
                    });

                    // Item 1
                    var item1 = createElementItem({
                        Element: element,
                        Name: 'New item 1'
                    });

                    // Item 2
                    var item2 = createElementItem({
                        Element: element,
                        Name: 'New item 2'
                    });

                    resourcePool.init(true);

                    return resourcePool;
                });
        }

        function createResourcePoolDirectIncomeAndMultiplier() {

            return createResourcePoolBasic()
                .then(function (resourcePool) {

                    // Convert Importance field to Sales Price field
                    var salesPriceField = resourcePool.mainElement().ElementFieldSet[0];
                    salesPriceField.Name = 'Sales Price';
                    salesPriceField.DataType = 11;
                    salesPriceField.UseFixedValue = true;
                    salesPriceField.IndexCalculationType = 1;
                    salesPriceField.IndexSortType = 2;

                    // Update Sales Price field cells
                    var cell1 = salesPriceField.ElementCellSet[0];
                    cell1.NumericValueTotal = 100;
                    cell1.UserElementCellSet[0].DecimalValue = 100;

                    var cell2 = salesPriceField.ElementCellSet[1];
                    cell2.NumericValueTotal = 110;
                    cell2.UserElementCellSet[0].DecimalValue = 110;

                    // Number of Sales field
                    var numberOfSalesField = createElementField({
                        Element: resourcePool.mainElement(),
                        Name: 'Number of Sales',
                        DataType: 12,
                        UseFixedValue: false,
                        SortOrder: 2
                    });

                    return resourcePool;
                });
        }

        function createResourcePoolTwoElements() {

            return createResourcePoolBasic()
                .then(function (resourcePool) {

                    // Element 2 & items
                    var element2 = resourcePool.ElementSet[0];
                    element2.Name = 'Child';

                    var element2Item1 = element2.ElementItemSet[0];
                    var element2Item2 = element2.ElementItemSet[1];

                    // Element 1
                    var element1 = dataContext.createEntity('Element', {
                        ResourcePool: resourcePool,
                        Name: 'Parent'
                    });
                    element1.IsMainElement = true;

                    // Child field (second element)
                    var childField = createElementField({
                        Element: element1,
                        Name: 'Child',
                        DataType: 6,
                        SelectedElement: element2,
                        UseFixedValue: true,
                        SortOrder: 1
                    });

                    // Item 1
                    var item1 = createElementItem({
                        Element: element1,
                        Name: 'Parent 1'
                    });

                    // Item 1 Cell
                    item1.ElementCellSet[0].SelectedElementItem = element2Item1;

                    // Item 2
                    var item2 = createElementItem({
                        Element: element1,
                        Name: 'Parent 2'
                    });

                    // Item 2 Cell
                    item2.ElementCellSet[0].SelectedElementItem = element2Item2;

                    return resourcePool;
                });
        }

        function getResourcePoolExpanded(resourcePoolId) {
            // TODO Other validations?
            resourcePoolId = Number(resourcePoolId);

            return userFactory.getCurrentUser()
                .then(function (currentUser) {

                    // Prepare the query
                    var query = null;
                    var newlyCreated = resourcePoolId <= 0; // Determines whether this is just created by this user, or an existing resource pool
                    var fetchedEarlier = false;
                    var fromServer = false;

                    // If it's not newly created, check the fetched list
                    if (!newlyCreated) {
                        for (var i = 0; i < fetched.length; i++) {
                            if (resourcePoolId === fetched[i]) {
                                fetchedEarlier = true;
                                break;
                            }
                        }
                    }

                    fromServer = !newlyCreated && !fetchedEarlier;

                    // Is authorized? No, then get only the public data, yes, then get include user's own records
                    if (currentUser.Id > 0 || newlyCreated) {
                        query = breeze.EntityQuery
                            .from('ResourcePool')
                            .expand('UserResourcePoolSet, ElementSet.ElementFieldSet.UserElementFieldSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet')
                            .where('Id', 'eq', resourcePoolId);
                    } else {
                        query = breeze.EntityQuery
                            .from('ResourcePool')
                            .expand('ElementSet.ElementFieldSet, ElementSet.ElementItemSet.ElementCellSet')
                            .where('Id', 'eq', resourcePoolId);
                    }

                    // From server or local?
                    if (fromServer) {
                        query = query.using(breeze.FetchStrategy.FromServer);
                    }
                    else {
                        query = query.using(breeze.FetchStrategy.FromLocalCache);
                    }

                    return dataContext.executeQuery(query)
                        .then(success)
                        .catch(failed);

                    function success(response) {

                        // If there is no cmrp with this Id, return null
                        if (response.results.length === 0) {
                            return null;
                        }

                        // ResourcePool
                        var resourcePool = response.results[0];

                        // Init: If it's from server, calculate otherUsersData
                        resourcePool.init(fromServer);

                        // Add the record into fetched list
                        fetched.push(resourcePool.Id);

                        return resourcePool;
                    }

                    function failed(error) {
                        var message = error.message || 'ResourcePool query failed';
                        logger.logError(message, error, true);
                    }
                });
        }

        function removeElement(element) {

            // Remove from selectedElement
            if (element.ResourcePool.selectedElement() === element) {
                element.ResourcePool.selectedElement(null);
            }

            // Related items
            var elementItemSet = element.ElementItemSet.slice();
            angular.forEach(elementItemSet, function (elementItem) {
                removeElementItem(elementItem);
            });

            // Related fields
            var elementFieldSet = element.ElementFieldSet.slice();
            angular.forEach(elementFieldSet, function (elementField) {
                removeElementField(elementField);
            });

            element.entityAspect.setDeleted();
        }

        function removeElementCell(elementCell) {

            // Related user cells
            var userElementCellSet = elementCell.UserElementCellSet.slice();
            angular.forEach(userElementCellSet, function (userElementCell) {
                userElementCell.entityAspect.setDeleted();
            });

            elementCell.entityAspect.setDeleted();
        }

        function removeElementField(elementField) {

            // Related cells
            var elementCellSet = elementField.ElementCellSet.slice();
            angular.forEach(elementCellSet, function (elementCell) {
                removeElementCell(elementCell);
            });

            // Related user element fields
            var userElementFieldSet = elementField.UserElementFieldSet.slice();
            angular.forEach(userElementFieldSet, function (userElementField) {
                userElementField.entityAspect.setDeleted();
            });

            elementField.entityAspect.setDeleted();
        }

        function removeElementItem(elementItem) {

            // Related cells
            var elementCellSet = elementItem.ElementCellSet.slice();
            angular.forEach(elementCellSet, function (elementCell) {
                removeElementCell(elementCell);
            });

            elementItem.entityAspect.setDeleted();
        }

        function removeResourcePool(resourcePool) {

            // Related elements
            var elementSet = resourcePool.ElementSet.slice();
            angular.forEach(elementSet, function (element) {
                removeElement(element);
            });

            // Related user resource pools
            var userResourcePoolSet = resourcePool.UserResourcePoolSet.slice();
            angular.forEach(userResourcePoolSet, function (userResourcePool) {
                userResourcePool.entityAspect.setDeleted();
            });

            resourcePool.entityAspect.setDeleted();
        }

        function removeResourcePoolFromCache(resourcePoolId) {
            fetched = fetched.filter(function (item) {
                return item !== resourcePoolId;
            });
        }

        // Overwrites saveChanges function in generated/resoucePoolFactory.js
        function saveChanges(delay, resourcePool) {
            resourcePool = typeof resourcePool === 'undefined' ? null : resourcePool;

            return dataContext.saveChanges(delay)
                .then(function () {
                    if (resourcePool !== null) {
                        removeResourcePoolFromCache(resourcePool.Id);
                    }
                });
        }
    }
})();
