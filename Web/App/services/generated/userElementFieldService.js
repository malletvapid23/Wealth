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

    var serviceId = 'userElementFieldService';
    angular.module('main')
        .factory(serviceId, ['dataContext', '$rootScope', 'logger', userElementFieldService]);

    function userElementFieldService(dataContext, $rootScope, logger) {
        
		// Logger
		logger = logger.forSource(serviceId);

        // To determine whether the data will be fecthed from server or local
        var minimumDate = new Date(0);
        var fetchedOn = minimumDate;

        // Service methods (alphabetically)
        var service = {
            createUserElementField: createUserElementField,
            deleteUserElementField: deleteUserElementField,
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            getUserElementFieldSet: getUserElementFieldSet,
            getUserElementField: getUserElementField,
            hasChanges: hasChanges,
            rejectChanges: rejectChanges,
            saveChanges: saveChanges
        };

        // User logged out
        $rootScope.$on('userLoggedOut', function () {
            fetchedOn = minimumDate;
        });

        return service;

        /*** Implementations ***/

        function createUserElementField(userElementField) {
            return dataContext.createEntity('UserElementField', userElementField);
        }

        function deleteUserElementField(userElementField) {
            userElementField.entityAspect.setDeleted();
        }

        function getChanges() {
            return dataContext.getChanges();
        }

        function getChangesCount() {
            return dataContext.getChangesCount();
        }

        function getUserElementFieldSet(forceRefresh) {
            var count;
            if (forceRefresh) {
                if (dataContext.hasChanges()) {
                    count = dataContext.getChangesCount();
                    dataContext.rejectChanges(); // undo all unsaved changes!
                    logger.logWarning('Discarded ' + count + ' pending change(s)', null);
                }
            }

            var query = breeze.EntityQuery
				.from('UserElementField')
				.expand(['ElementField', 'User'])
            ;

            // Fetch the data from server, in case if it's not fetched earlier or forced
            var fetchFromServer = fetchedOn === minimumDate || forceRefresh;

            // Prepare the query
            if (fetchFromServer) { // From remote
                query = query.using(breeze.FetchStrategy.FromServer)
                fetchedOn = new Date();
            }
            else { // From local
                query = query.using(breeze.FetchStrategy.FromLocalCache)
            }

            return dataContext.executeQuery(query)
                .then(success).catch(failed);

            function success(response) {
                count = response.results.length;
                //logger.logSuccess('Got ' + count + ' userElementField(s)', response);
                return response.results;
            }

            function failed(error) {
                var message = error.message || 'UserElementField query failed';
                logger.logError(message, error);
            }
        }

        function getUserElementField(userElementFieldId, forceRefresh) {
            return dataContext.fetchEntityByKey('UserElementField', userElementFieldId, !forceRefresh)
                .then(success).catch(failed);

            function success(result) {
                return result.entity;
            }

            function failed(error) {
                var message = error.message || 'getUserElementField query failed';
                logger.logError(message, error);
            }
        }

        function hasChanges() {
            return dataContext.hasChanges();
        }

        function rejectChanges() {
            dataContext.rejectChanges();
        }

        function saveChanges(delay) {
            return dataContext.saveChanges(delay);
        }
    }
})();
