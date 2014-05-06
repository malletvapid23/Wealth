﻿/***
 * Service: dataContext 
 *
 * Handles all persistence and creation/deletion of app entities
 * using BreezeJS.
 *
 ***/
(function () {
    'use strict';

    var serviceId = 'dataContext';
    angular.module('main')
        .factory(serviceId, ['$q', 'logger', 'entityManagerFactory', dataContext]);

    function dataContext($q, logger, entityManagerFactory) {

        // Logger
        logger = logger.forSource(serviceId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;
        var logWarning = logger.logWarning;

        // entityManager
        var manager = entityManagerFactory.newManager();

        // Service methods (alphabetically)
        var service = {
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            hasChanges: hasChanges,
            manager: manager,
            rejectChanges: rejectChanges,
            saveChanges: saveChanges
        };

        return service;

        /*** Implementations ***/

        function getChanges() {
            return manager.getChanges();
        }

        function getChangesCount() {
            return manager.getChanges().length;
        }

        function hasChanges() {
            return manager.hasChanges();
        }

        function rejectChanges() {
            manager.rejectChanges();
        }

        function saveChanges() {

            var count = getChangesCount();
            var promise = null;
            var saveBatches = prepareSaveBatches();
            saveBatches.forEach(function (batch) {
                // ignore empty batches (except 'null' which means "save everything else")
                if (batch == null || batch.length > 0) {
                    promise = promise ?
                        promise.then(function () { return manager.saveChanges(batch); }) :
                        manager.saveChanges(batch);
                }
            });
            return promise.then(success).catch(failed);

            function success(result) {
                logSuccess('Saved ' + count + ' change(s)', result, true);
            }

            function failed(error) {
                if (error.status === '409') {
                    logger.logError('Save failed!<br />The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.', null, true);
                } else {
                    logger.logError('Save failed!', null, true);
                }
                return $q.reject(error); // pass error along to next handler
            }

            function prepareSaveBatches() {
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
                var batches = [];
                batches.push(manager.getEntities(['License'], [breeze.EntityState.Deleted]));
                batches.push(manager.getEntities(['License'], [breeze.EntityState.Added]));
                batches.push(null); // empty = save all remaining pending changes
                return batches;
                /*
                 *  No we can't flatten into one request because Web API OData reorders
                 *  arbitrarily, causing the database failure we're trying to avoid.
                 */
            }
        }
    }
})();