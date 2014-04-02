﻿/***
 * Service: dataContext 
 *
 * Handles all persistence and creation/deletion of app entities
 * using BreezeJS.
 *
 ***/
(function () {
    'use strict';

    var serviceId = 'licenseManager';
    angular.module('main')
        .factory(serviceId, ['dataContext', 'logger', licenseManager]);

    function licenseManager(dataContext, logger) {

        // Logger
        logger = logger.forSource(serviceId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;
        var logWarning = logger.logWarning;

        // To determine whether the data will be fecthed from server or local
        var minimumDate = new Date(0);
        var fetchedOn = minimumDate;

        // Service methods (alphabetically)
        var service = {
            createLicense: createLicense,
            deleteLicense: deleteLicense,
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            getLicenseSet: getLicenseSet,
            getLicense: getLicense,
            hasChanges: hasChanges,
            rejectChanges: rejectChanges,
            saveChanges: saveChanges
        };

        return service;

        /*** Implementations ***/

        function createLicense(license) {
            return dataContext.manager.createEntity('License', license);
        }

        function deleteLicense(license) {
            license.entityAspect.setDeleted();
        }

        function getChanges() {
            return dataContext.getChanges();
        }

        function getChangesCount() {
            return dataContext.getChangesCount();
        }

        function getLicenseSet(forceRefresh) {

            var count;
            if (forceRefresh) {
                if (dataContext.hasChanges()) {
                    count = dataContext.getChangesCount();
                    dataContext.rejectChanges(); // undo all unsaved changes!
                    logWarning('Discarded ' + count + ' pending change(s)', null, true);
                }
            }

            var query = breeze.EntityQuery.from("License");

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

            return dataContext.manager.executeQuery(query)
                .then(success).catch(failed);

            function success(response) {
                count = response.results.length;
                logSuccess('Got ' + count + ' license(s)', response, true);
                return response.results;
            }

            function failed(error) {
                var message = error.message || "License query failed";
                logError(message, error, true);
            }
        }

        function getLicense(licenseId, forceRefresh) {
            return dataContext.manager.fetchEntityByKey("License", licenseId, !forceRefresh)
                .then(success).catch(failed);

            function success(result) {
                return result.entity;
            }

            function failed(error) {
                var message = error.message || "getLicense query failed";
                logError(message, error, true);
            }
        }

        function hasChanges() {
            return dataContext.hasChanges();
        }

        function rejectChanges() {
            dataContext.rejectChanges();
        }

        function saveChanges() {
            return dataContext.saveChanges();
        }
    }
})();