﻿
(function () {
    'use strict';

    var serviceId = 'resourcePoolService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', '$http', 'logger', resourcePoolService]);
        });

    function resourcePoolService($delegate, $http, logger) {
        logger = logger.forSource(serviceId);

        // Service methods
        $delegate.getResourcePoolViewModel = getResourcePoolViewModel;
        $delegate.getLicenseSet = getLicenseSet;
        $delegate.getSectorSet = getSectorSet;

        return $delegate;

        /*** Implementations ***/

        function getResourcePoolViewModel(resourcePoolId) {
            var url = '/api/ResourcePoolCustom/ResourcePoolViewModel/' + resourcePoolId;
            return $http.get(url);
        }

        function getLicenseSet(resourcePoolId) {
            var url = '/api/ResourcePoolCustom/LicenseSet/' + resourcePoolId;
            return $http.get(url);
        }

        function getSectorSet(resourcePoolId) {
            var url = '/api/ResourcePoolCustom/SectorSet/' + resourcePoolId;
            return $http.get(url);
        }
    }
})();
