﻿(function () {
    'use strict';

    var factoryId = 'resourcePoolFactory';
    angular.module('main')
        .config(['$provide', extendFactory]);

    function extendFactory($provide) {
        $provide.decorator(factoryId, ['$delegate', 'ResourcePool', 'Element', 'dataContext', '$rootScope', 'logger', resourcePoolFactory]);
    }

    function resourcePoolFactory($delegate, ResourcePool, Element, dataContext, $rootScope, logger) {

        // Logger
        logger = logger.forSource(factoryId);

        var fetched = [];

        // Factory methods
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

        // User logged out
        $rootScope.$on('dataContext_currentUserChanged', function () {
            fetched = [];
        });

        return $delegate;

        /*** Implementations ***/

        function cancelResourcePool(resourcePool) {

            // Resource pool itself
            resourcePool.entityAspect.rejectChanges();

            // User resource pools
            resourcePool.UserResourcePoolSet.forEach(function (userResourcePool) {
                userResourcePool.entityAspect.rejectChanges();
            });

            // Elements
            resourcePool.ElementSet.forEach(function (element) {
                element.entityAspect.rejectChanges();

                // Fields
                element.ElementFieldSet.forEach(function (elementField) {
                    elementField.entityAspect.rejectChanges();

                    // User element fields
                    elementField.UserElementFieldSet.forEach(function (userElementField) {
                        userElementField.entityAspect.rejectChanges();
                    });
                });

                // Items
                element.ElementItemSet.forEach(function (elementItem) {
                    elementItem.entityAspect.rejectChanges();

                    // Cells
                    elementItem.ElementCellSet.forEach(function (elementCell) {
                        elementCell.entityAspect.rejectChanges();

                        // User cells
                        elementCell.UserElementCellSet.forEach(function (userElementCell) {
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

        function createElementCell(elementCellInitial) {

            var elementCell = dataContext.createEntity('ElementCell', elementCellInitial);

            // User element cell
            if (elementCell.ElementField.DataType !== 6) {

                var userElementCell = {
                    User: elementCell.ElementField.Element.ResourcePool.User,
                    ElementCell: elementCell
                };

                switch (elementCell.ElementField.DataType) {
                    case 1: { userElementCell.StringValue = ''; break; }
                    case 2: { userElementCell.BooleanValue = false; break; }
                    case 3: { userElementCell.IntegerValue = 0; break; }
                    case 4: { userElementCell.DecimalValue = 50; break; }
                        // TODO 5 (DateTime?)
                    case 11: { userElementCell.DecimalValue = 100; break; }
                    case 12: { userElementCell.DecimalValue = 0; break; }
                }

                dataContext.createEntity('UserElementCell', userElementCell);
            }

            return elementCell;
        }

        function createElementField(elementField) {

            elementField = dataContext.createEntity('ElementField', elementField);

            // Related cells
            elementField.Element.ElementItemSet.forEach(function (elementItem) {
                createElementCell({
                    ElementField: elementField,
                    ElementItem: elementItem
                });
            });

            return elementField;
        }

        function createElementItem(elementItem) {

            elementItem = dataContext.createEntity('ElementItem', elementItem);

            // Related cells
            elementItem.Element.ElementFieldSet.forEach(function (elementField) {
                createElementCell({
                    ElementField: elementField,
                    ElementItem: elementItem
                });
            });

            return elementItem;
        }

        function createResourcePoolBasic(initializeResourcePool) {
            initializeResourcePool = typeof initializeResourcePool !== 'undefined' ? initializeResourcePool : false;

            return dataContext.getCurrentUser()
                .then(function (currentUser) {

                    var resourcePoolRate = 10;

                    var resourcePool = dataContext.createEntity('ResourcePool', {
                        User: currentUser,
                        Name: 'New CMRP',
                        InitialValue: 100,
                        UseFixedResourcePoolRate: true
                    });

                    dataContext.createEntity('UserResourcePool', {
                        User: currentUser,
                        ResourcePool: resourcePool,
                        ResourcePoolRate: resourcePoolRate
                    });

                    var element = createElement({
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

                    // Initialize
                    if (initializeResourcePool) {
                        resourcePool._init(true);
                    }

                    return resourcePool;
                });
        }

        function createResourcePoolDirectIncomeAndMultiplier(initializeResourcePool) {
            initializeResourcePool = typeof initializeResourcePool !== 'undefined' ? initializeResourcePool : false;

            return createResourcePoolBasic()
                .then(function (resourcePool) {

                    // Convert Importance field to Sales Price field
                    var salesPriceField = resourcePool.mainElement().ElementFieldSet[0];
                    salesPriceField.Name = 'Sales Price';
                    salesPriceField.DataType = 11;
                    salesPriceField.UseFixedValue = true;
                    salesPriceField.IndexEnabled = false;
                    salesPriceField.IndexCalculationType = 0;
                    salesPriceField.IndexSortType = 0;

                    // Update Sales Price field cells
                    var cell1 = salesPriceField.ElementCellSet[0];
                    var cell2 = salesPriceField.ElementCellSet[1];

                    // Number of Sales field
                    var numberOfSalesField = createElementField({
                        Element: resourcePool.mainElement(),
                        Name: 'Number of Sales',
                        DataType: 12,
                        UseFixedValue: false,
                        SortOrder: 2
                    });

                    if (initializeResourcePool) {
                        resourcePool._init(true);
                    }

                    return resourcePool;
                });
        }

        function createResourcePoolTwoElements(initializeResourcePool) {
            initializeResourcePool = typeof initializeResourcePool !== 'undefined' ? initializeResourcePool : false;

            return createResourcePoolBasic()
                .then(function (resourcePool) {

                    // Element 2 & items
                    var element2 = resourcePool.ElementSet[0];
                    element2.Name = 'Child';

                    var element2Item1 = element2.ElementItemSet[0];
                    var element2Item2 = element2.ElementItemSet[1];

                    // Element 1
                    var element1 = createElement({
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

                    if (initializeResourcePool) {
                        resourcePool._init(true);
                    }

                    return resourcePool;
                });
        }

        function getResourcePoolExpanded(resourcePoolId) {
            // TODO Other validations?
            resourcePoolId = Number(resourcePoolId);

            return dataContext.getCurrentUser()
                .then(function (currentUser) {

                    // Prepare the query
                    var query = null;
                    var isNewResourcePool = resourcePoolId <= 0; // Determines whether this is just created by this user, or an existing resource pool
                    var fetchedEarlier = false;
                    var fromServer = false;

                    // If it's not newly created, check the fetched list
                    if (!isNewResourcePool) {
                        fetchedEarlier = fetched.some(function (fetchedId) {
                            return resourcePoolId === fetchedId;
                        });
                    }

                    fromServer = !isNewResourcePool && !fetchedEarlier;

                    // Is authorized? No, then get only the public data, yes, then get include user's own records
                    if (currentUser.isAuthenticated() || isNewResourcePool) {
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

                        // Init
                        if (fromServer) {
                            resourcePool._init();
                        }

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
            elementItemSet.forEach(function (elementItem) {
                removeElementItem(elementItem);
            });

            // Related fields
            var elementFieldSet = element.ElementFieldSet.slice();
            elementFieldSet.forEach(function (elementField) {
                removeElementField(elementField);
            });

            element.entityAspect.setDeleted();
        }

        function removeElementCell(elementCell) {

            // Related user cells
            var userElementCellSet = elementCell.UserElementCellSet.slice();
            userElementCellSet.forEach(function (userElementCell) {
                userElementCell.entityAspect.setDeleted();
            });

            elementCell.entityAspect.setDeleted();
        }

        function removeElementField(elementField) {

            // Related cells
            var elementCellSet = elementField.ElementCellSet.slice();
            elementCellSet.forEach(function (elementCell) {
                removeElementCell(elementCell);
            });

            // Related user element fields
            var userElementFieldSet = elementField.UserElementFieldSet.slice();
            userElementFieldSet.forEach(function (userElementField) {
                userElementField.entityAspect.setDeleted();
            });

            elementField.entityAspect.setDeleted();
        }

        function removeElementItem(elementItem) {

            // Related cells
            var elementCellSet = elementItem.ElementCellSet.slice();
            elementCellSet.forEach(function (elementCell) {
                removeElementCell(elementCell);
            });

            elementItem.entityAspect.setDeleted();
        }

        function removeResourcePool(resourcePool) {

            // Related elements
            var elementSet = resourcePool.ElementSet.slice();
            elementSet.forEach(function (element) {
                removeElement(element);
            });

            // Related user resource pools
            var userResourcePoolSet = resourcePool.UserResourcePoolSet.slice();
            userResourcePoolSet.forEach(function (userResourcePool) {
                userResourcePool.entityAspect.setDeleted();
            });

            resourcePool.entityAspect.setDeleted();
        }
    }
})();
