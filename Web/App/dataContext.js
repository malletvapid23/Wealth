﻿/***
 * Service: dataContext 
 *
 * Handles all persistence and creation/deletion of app entities
 * using BreezeJS.
 *
 ***/
(function () {
    'use strict';

    var factoryId = 'dataContext';
    angular.module('main')
        .factory(factoryId, ['entityManagerFactory', '$q', '$rootScope', '$timeout', 'logger', dataContext]);

    function dataContext(entityManagerFactory, $q, $rootScope, $timeout, logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Manager
        var manager = null;
        var saveTimer = null;
        var metadataLoaded = false;

        initializeStore();

        // Factory methods
        var factory = {
            clear: clear,
            createEntity: createEntity,
            executeQuery: executeQuery,
            fetchEntityByKey: fetchEntityByKey,
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            getEntities: getEntities,
            hasChanges: hasChanges,
            initializeStore: initializeStore,
            metadataReady: metadataReady,
            rejectChanges: rejectChanges,
            saveChanges: saveChanges,
            updateAnonymousChanges: updateAnonymousChanges
        };

        // Event handlers
        $rootScope.$on('ElementField_createUserElementCell', createUserElementCell);

        return factory;

        /*** Implementations ***/

        function clear() {
            manager.clear();
        }

        function createEntity(entityType, initialValues) {

            if (!metadataLoaded) {
                logger.logError('Load metadata first!');
                return;
            }

            // Anonymous user check
            // TODO Assumes that 'User' business object related properties will always use 'User' as a name
            if (typeof initialValues !== 'undefined'
                && typeof initialValues.User !== 'undefined'
                && (typeof initialValues.User.Id === 'undefined'
                || initialValues.User.Id <= 0)) {
                $rootScope.$broadcast('anonymousUserInteracted');
            }

            return manager.createEntity(entityType, initialValues);
        }

        function createUserElementCell(event, userElementCell) {
            return createEntity('UserElementCell', userElementCell);
        }

        function executeQuery(query) {
            return manager.executeQuery(query);
        }

        function fetchEntityByKey(typeName, keyValues, checkLocalCacheFirst) {
            return manager.fetchEntityByKey(typeName, keyValues, checkLocalCacheFirst);
        }

        function getChanges() {
            return manager.getChanges();
        }

        function getChangesCount() {
            return manager.getChanges().length;
        }

        function getEntities(entityTypes, entityStates) {
            return manager.getEntities(entityTypes, entityStates);
        }

        function hasChanges() {
            return manager.hasChanges();
        }

        function initializeStore() {
            manager = entityManagerFactory.newManager();

            // TODO Fix this in a better way
            // angular app should start after loading the metadata;
            // https://github.com/angular/angular.js/issues/4003

            metadataReady()
                .then(function () {
                    metadataLoaded = true;
                });
        }

        function metadataReady() {

            var deferred = $q.defer();

            if (manager.metadataStore.isEmpty()) {
                manager.fetchMetadata()
                    .then(function () {
                        deferred.resolve();
                    },
                    function (error) {
                        deferred.reject(error);
                    });
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        }

        function rejectChanges() {
            manager.rejectChanges();
        }

        function saveChanges(delay) {

            // Set the default value for delay in case 'undefined'
            if (typeof delay === 'undefined') {
                delay = 0;
            }

            // Cancel existing timers (delay the save)
            if (saveTimer !== null) {
                $timeout.cancel(saveTimer);
            }

            // Save immediately or wait based on delay
            if (delay === 0) {
                return saveChangesInternal();
            } else {
                saveTimer = $timeout(saveChangesInternal, delay);
                return saveTimer;
            }

            // TODO Cancel the timer at the end of the service, like this ?

            //// When the DOM element is removed from the page,
            //// AngularJS will trigger the $destroy event on
            //// the scope. This gives us a chance to cancel any
            //// pending timer that we may have.
            //$scope.$on("$destroy", function (event) {
            //    $timeout.cancel(increaseMultiplierTimeoutInitial);
            //    $timeout.cancel(increaseMultiplierTimeoutRecursive);
            //});
        }

        function saveChangesInternal() {

            return metadataReady()
                .then(function () {

                    // Anonymous resource pool fix
                    updateAnonymousResourcePools();

                    var count = getChangesCount();
                    var promise = null;
                    var saveBatches = prepareSaveBatches();
                    saveBatches.forEach(function (batch) {

                        // ignore empty batches (except 'null' which means "save everything else")
                        if (batch === null || batch.length > 0) {

                            // Broadcast, so UI can block
                            $rootScope.$broadcast('saveChangesStart');

                            promise = promise ?
                                promise.then(function () { return manager.saveChanges(batch); }) :
                                manager.saveChanges(batch);
                        }
                    });
                    return promise.then(success).catch(failed).finally(completed);

                    function success(result) {
                        logger.logSuccess('Saved ' + count + ' change(s)');
                        return result;
                    }

                    function failed(error) {
                        if (typeof error.status !== 'undefined' && error.status === '409') {
                            logger.logError('Save failed!<br />The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.', error, false);
                        } else {
                            logger.logError('Save failed!', error);
                        }
                        return $q.reject(error); // pass error along to next handler
                    }

                    function completed() {

                        // Broadcast, so UI can unblock
                        $rootScope.$broadcast('saveChangesCompleted');
                    }

                    function prepareSaveBatches() {

                        var batches = [];

                        // RowVersion fix
                        // TODO How about Deleted state?
                        var modifiedEntities = manager.getEntities(null, breeze.EntityState.Modified);
                        modifiedEntities.forEach(function (entity) {
                            var rowVersion = entity.RowVersion;
                            entity.RowVersion = '';
                            entity.RowVersion = rowVersion;
                        });
                        batches.push(modifiedEntities);

                        /* Aaargh! 
                        * Web API OData doesn't calculate the proper save order
                        * which means, if we aren't careful on the client,
                        * we could save a new TodoItem before we saved its parent new TodoList
                        * or delete the parent TodoList before saving its deleted child TodoItems.
                        * OData says it is up to the client to save entities in the order
                        * required by referential constraints of the database.
                        * While we could save each time you make a change, that sucks.
                        * So we'll divvy up the pending changes into 4 batches
                        * 1. Deleted Todos
                        * 2. Deleted TodoLists
                        * 3. Added TodoLists
                        * 4. Every other change
                        */

                        batches.push(manager.getEntities(['UserElementCell'], [breeze.EntityState.Deleted]));
                        batches.push(manager.getEntities(['ElementCell'], [breeze.EntityState.Deleted]));
                        batches.push(manager.getEntities(['ElementItem'], [breeze.EntityState.Deleted]));
                        batches.push(manager.getEntities(['UserElementField'], [breeze.EntityState.Deleted]));
                        batches.push(manager.getEntities(['ElementField'], [breeze.EntityState.Deleted]));
                        batches.push(manager.getEntities(['Element'], [breeze.EntityState.Deleted]));
                        batches.push(manager.getEntities(['UserResourcePool'], [breeze.EntityState.Deleted]));
                        batches.push(manager.getEntities(['ResourcePool'], [breeze.EntityState.Deleted]));

                        batches.push(manager.getEntities(['ResourcePool'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['UserResourcePool'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['Element'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['ElementField'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['UserElementField'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['ElementItem'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['ElementCell'], [breeze.EntityState.Added]));
                        batches.push(manager.getEntities(['UserElementCell'], [breeze.EntityState.Added]));

                        batches.push(null); // empty = save all remaining pending changes
                        return batches;
                        /*
                         *  No we can't flatten into one request because Web API OData reorders
                         *  arbitrarily, causing the database failure we're trying to avoid.
                         */
                    }
                });
        }

        // When the user interact with the application without registering or login in,
        // it creates an anonymous user and all entity creations done by this user
        // If the user has actually an account and logs in afterwards, this function moves all those changes to that logged in user
        function updateAnonymousChanges(anonymousUser, newUser) {

            var deferred = $q.defer();

            if (typeof anonymousUser === 'undefined' || anonymousUser === null) {
                deferred.reject('anonymousUser parameter cannot be undefined or null');
            }

            if (typeof newUser === 'undefined' || newUser === null) {
                deferred.reject('newUser parameter cannot be undefined or null');
            }

            var existingEntityPromises = [];
            anonymousUser.UserResourcePoolSet.forEach(function (userResourcePool) {
                var keyValues = [newUser.Id, userResourcePool.ResourcePoolId];
                var promise = fetchEntityByKey('UserResourcePool', keyValues);
                existingEntityPromises.push(promise);
            });

            anonymousUser.UserElementFieldSet.forEach(function (userElementField) {
                var keyValues = [newUser.Id, userElementField.ElementFieldId];
                var promise = fetchEntityByKey('UserElementField', keyValues);
                existingEntityPromises.push(promise);
            });

            anonymousUser.UserElementCellSet.forEach(function (userElementCell) {
                var keyValues = [newUser.Id, userElementCell.ElementCellId];
                var promise = fetchEntityByKey('UserElementCell', keyValues);
                existingEntityPromises.push(promise);
            });

            $q.all(existingEntityPromises).then(function () {

                anonymousUser.UserResourcePoolSet.forEach(function (anonymousUserResourcePool) {

                    var result = newUser.UserResourcePoolSet.filter(function (userResourcePool) {
                        return userResourcePool.ResourcePoolId === anonymousUserResourcePool.ResourcePoolId;
                    });

                    if (result.length > 0) { // If there is an existing entity, update it and remove the anonymous one
                        result[0].ResourcePoolRate = anonymousUserResourcePool.ResourcePoolRate;
                        anonymousUserResourcePool.entityAspect.rejectChanges();
                    } else { // Otherwise update the anonymous one with the new user
                        anonymousUserResourcePool.User = newUser;
                    }
                });

                anonymousUser.UserElementFieldSet.forEach(function (anonymousUserElementField) {
                    
                    // If existing entity, then make it modified
                    var result = newUser.UserElementFieldSet.filter(function (userElementField) {
                        return userElementField.ElementFieldId === anonymousUserElementField.ElementFieldId;
                    });

                    if (result.length > 0) { // If there is an existing entity, update it and remove the anonymous one
                        result[0].Rating = anonymousUserElementField.Rating;
                        anonymousUserElementField.entityAspect.rejectChanges();
                    } else { // Otherwise update the anonymous one with the new user
                        anonymousUserElementField.User = newUser;
                    }
                });

                anonymousUser.UserElementCellSet.forEach(function (anonymousUserElementCell) {

                    // If existing entity, then make it modified
                    var result = newUser.UserElementCellSet.filter(function (userElementCell) {
                        return userElementCell.ElementCellId === anonymousUserElementCell.ElementCellId;
                    });

                    if (result.length > 0) { // If there is an existing entity, update it and remove the anonymous one
                        result[0].StringValue = anonymousUserElementCell.StringValue;
                        result[0].BooleanValue = anonymousUserElementCell.BooleanValue;
                        result[0].IntegerValue = anonymousUserElementCell.IntegerValue;
                        result[0].DecimalValue = anonymousUserElementCell.DecimalValue;
                        result[0].DateTimeValue = anonymousUserElementCell.DateTimeValue;
                        anonymousUserElementCell.entityAspect.rejectChanges();
                    } else { // Otherwise update the anonymous one with the new user
                        anonymousUserElementCell.User = newUser;
                    }
                });

                // Remove the old (anonymous) user
                anonymousUser.entityAspect.rejectChanges();

                deferred.resolve();
            });

            return deferred.promise;
        }

        // For more info about this function, check ResourcePool.js - self.isAdded function
        function updateAnonymousResourcePools() {
            var changes = getChanges();
            changes.forEach(function (change) {
                if (change.entityType.shortName === 'ResourcePool') {
                    var resourcePool = change;

                    if (resourcePool.isAdded()) {

                        // Turn the flag off
                        resourcePool.isAdded(false);

                        // Resource pool itself
                        resourcePool.entityAspect.setAdded();

                        // User resource pools
                        resourcePool.UserResourcePoolSet.forEach(function (userResourcePool) {
                            userResourcePool.entityAspect.setAdded();
                        });

                        // Elements
                        resourcePool.ElementSet.forEach(function (element) {
                            element.entityAspect.setAdded();

                            // Fields
                            element.ElementFieldSet.forEach(function (elementField) {
                                elementField.entityAspect.setAdded();

                                // User element fields
                                elementField.UserElementFieldSet.forEach(function (userElementField) {
                                    userElementField.entityAspect.setAdded();
                                });
                            });

                            // Items
                            element.ElementItemSet.forEach(function (elementItem) {
                                elementItem.entityAspect.setAdded();

                                // Cells
                                elementItem.ElementCellSet.forEach(function (elementCell) {
                                    elementCell.entityAspect.setAdded();

                                    // User cells
                                    elementCell.UserElementCellSet.forEach(function (userElementCell) {
                                        userElementCell.entityAspect.setAdded();
                                    });
                                });
                            });
                        });
                    }
                }
            });
        }
    }
})();