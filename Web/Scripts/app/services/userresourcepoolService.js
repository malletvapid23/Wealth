﻿
(function () {
    'use strict';

    var serviceId = 'userResourcePoolService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', 'dataContext', '$http', 'logger', userResourcePoolService]);
        });

    function userResourcePoolService($delegate, dataContext, $http, logger) {
        logger = logger.forSource(serviceId);

        //// To determine whether the data will be fecthed from server or local
        //var minimumDate = new Date(0);
        //var fetchedOn = minimumDate;

        // Service methods
        $delegate.getUserResourcePoolByResourcePoolId = getUserResourcePoolByResourcePoolId;
        $delegate.decreaseNumberOfSales = decreaseNumberOfSales;
        $delegate.increaseNumberOfSales = increaseNumberOfSales;
        $delegate.resetNumberOfSales = resetNumberOfSales;

        return $delegate;

        /*** Implementations ***/

        function getUserResourcePoolByResourcePoolId(resourcePoolId) {

            var query = breeze.EntityQuery
                .from("UserResourcePool")
                .expand("ResourcePool")
                .where("ResourcePoolId", "eq", resourcePoolId)
            ;

            //// Fetch the data from server, in case if it's not fetched earlier or forced
            //var fetchFromServer = fetchedOn === minimumDate || forceRefresh;

            //// Prepare the query
            //if (fetchFromServer) { // From remote
            //    query = query.using(breeze.FetchStrategy.FromServer)
            //    fetchedOn = new Date();
            //}
            //else { // From local
            //    query = query.using(breeze.FetchStrategy.FromLocalCache)
            //}

            return dataContext.executeQuery(query)
                .then(success).catch(failed);

            function success(response) {
                var count = response.results.length;
                logger.logSuccess('Got ' + count + ' user resource pool(s)', response, true);
                return response.results[0];
            }

            function failed(error) {
                var message = error.message || "User query failed";
                logger.logError(message, error, true);
            }
        }

        function decreaseNumberOfSales(userResourcePoolId) {
            var url = '/odata/UserResourcePool(' + userResourcePoolId + ')/DecreaseNumberOfSales';
            return $http.post(url);
        }

        function increaseNumberOfSales(userResourcePoolId) {
            var url = '/odata/UserResourcePool(' + userResourcePoolId + ')/IncreaseNumberOfSales';
            return $http.post(url);
        }

        function resetNumberOfSales(userResourcePoolId) {
            var url = '/odata/UserResourcePool(' + userResourcePoolId + ')/ResetNumberOfSales';
            return $http.post(url);
        }
    }

})();
