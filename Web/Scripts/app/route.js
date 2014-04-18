﻿(function () {
    'use strict';

    angular.module('main')
        .config(routeConfig);

    function routeConfig($routeProvider) {

        // Routes
        $routeProvider
            .when('/', { controller: getController(true), templateUrl: getTemplate(true, '/') })
            .when('/new', { controller: getController(false), templateUrl: getTemplate(false, '/new') })
            .when('/edit/:Id', { controller: getController(false), templateUrl: getTemplate(false, '/edit/:Id') })

            .when('/License/', { controller: 'licenseListController as vm', templateUrl: 'ViewsNg/list/licenseList.html' })
            .when('/License/new', { controller: 'licenseEditController as vm', templateUrl: 'ViewsNg/edit/licenseEdit.html' })
            .when('/License/edit/:Id', { controller: 'licenseEditController as vm', templateUrl: 'ViewsNg/edit/LicenseEdit.html' })
            .when('/Organization/', { controller: 'organizationListController as vm', templateUrl: 'ViewsNg/list/organizationList.html' })
            .when('/Organization/new', { controller: 'organizationEditController as vm', templateUrl: 'ViewsNg/edit/organizationEdit.html' })
            .when('/Organization/edit/:Id', { controller: 'organizationEditController as vm', templateUrl: 'ViewsNg/edit/OrganizationEdit.html' })
            .when('/ResourcePool/', { controller: 'resourcePoolListController as vm', templateUrl: 'ViewsNg/list/resourcePoolList.html' })
            .when('/ResourcePool/new', { controller: 'resourcePoolEditController as vm', templateUrl: 'ViewsNg/edit/resourcePoolEdit.html' })
            .when('/ResourcePool/edit/:Id', { controller: 'resourcePoolEditController as vm', templateUrl: 'ViewsNg/edit/ResourcePoolEdit.html' })
            .when('/ResourcePoolOrganization/', { controller: 'resourcePoolOrganizationListController as vm', templateUrl: 'ViewsNg/list/resourcePoolOrganizationList.html' })
            .when('/ResourcePoolOrganization/new', { controller: 'resourcePoolOrganizationEditController as vm', templateUrl: 'ViewsNg/edit/resourcePoolOrganizationEdit.html' })
            .when('/ResourcePoolOrganization/edit/:Id', { controller: 'resourcePoolOrganizationEditController as vm', templateUrl: 'ViewsNg/edit/ResourcePoolOrganizationEdit.html' })
            .when('/Sector/', { controller: 'sectorListController as vm', templateUrl: 'ViewsNg/list/sectorList.html' })
            .when('/Sector/new', { controller: 'sectorEditController as vm', templateUrl: 'ViewsNg/edit/sectorEdit.html' })
            .when('/Sector/edit/:Id', { controller: 'sectorEditController as vm', templateUrl: 'ViewsNg/edit/SectorEdit.html' })
            .when('/User/', { controller: 'userListController as vm', templateUrl: 'ViewsNg/list/userList.html' })
            .when('/User/new', { controller: 'userEditController as vm', templateUrl: 'ViewsNg/edit/userEdit.html' })
            .when('/User/edit/:Id', { controller: 'userEditController as vm', templateUrl: 'ViewsNg/edit/UserEdit.html' })
            .when('/UserLicenseRating/', { controller: 'userLicenseRatingListController as vm', templateUrl: 'ViewsNg/list/userLicenseRatingList.html' })
            .when('/UserLicenseRating/new', { controller: 'userLicenseRatingEditController as vm', templateUrl: 'ViewsNg/edit/userLicenseRatingEdit.html' })
            .when('/UserLicenseRating/edit/:Id', { controller: 'userLicenseRatingEditController as vm', templateUrl: 'ViewsNg/edit/UserLicenseRatingEdit.html' })
            .when('/UserResourcePool/', { controller: 'userResourcePoolListController as vm', templateUrl: 'ViewsNg/list/userResourcePoolList.html' })
            .when('/UserResourcePool/new', { controller: 'userResourcePoolEditController as vm', templateUrl: 'ViewsNg/edit/userResourcePoolEdit.html' })
            .when('/UserResourcePool/edit/:Id', { controller: 'userResourcePoolEditController as vm', templateUrl: 'ViewsNg/edit/UserResourcePoolEdit.html' })
            .when('/UserResourcePoolOrganization/', { controller: 'userResourcePoolOrganizationListController as vm', templateUrl: 'ViewsNg/list/userResourcePoolOrganizationList.html' })
            .when('/UserResourcePoolOrganization/new', { controller: 'userResourcePoolOrganizationEditController as vm', templateUrl: 'ViewsNg/edit/userResourcePoolOrganizationEdit.html' })
            .when('/UserResourcePoolOrganization/edit/:Id', { controller: 'userResourcePoolOrganizationEditController as vm', templateUrl: 'ViewsNg/edit/UserResourcePoolOrganizationEdit.html' })
            .when('/UserSectorRating/', { controller: 'userSectorRatingListController as vm', templateUrl: 'ViewsNg/list/userSectorRatingList.html' })
            .when('/UserSectorRating/new', { controller: 'userSectorRatingEditController as vm', templateUrl: 'ViewsNg/edit/userSectorRatingEdit.html' })
            .when('/UserSectorRating/edit/:Id', { controller: 'userSectorRatingEditController as vm', templateUrl: 'ViewsNg/edit/UserSectorRatingEdit.html' })

            .when('/TotalCostIndex/', { controller: 'userResourcePoolController as vm', templateUrl: 'ViewsNg/UserResourcePool/TotalCostIndex.html' })
            .when('/KnowledgeIndex/', { controller: 'userResourcePoolController as vm', templateUrl: 'ViewsNg/UserResourcePool/KnowledgeIndex.html' })
            .when('/QualityIndex/', { controller: 'userResourcePoolController as vm', templateUrl: 'ViewsNg/UserResourcePool/QualityIndex.html' })
            .when('/EmployeeSatisfactionIndex/', { controller: 'userResourcePoolController as vm', templateUrl: 'ViewsNg/UserResourcePool/EmployeeSatisfactionIndex.html' })
            .when('/CustomerSatisfactionIndex/', { controller: 'userResourcePoolController as vm', templateUrl: 'ViewsNg/UserResourcePool/CustomerSatisfactionIndex.html' })
            .when('/SectorIndex/', { controller: 'userResourcePoolController as vm', templateUrl: 'ViewsNg/UserResourcePool/SectorIndex.html' })
            .when('/DistanceIndex/', { controller: 'userResourcePoolController as vm', templateUrl: 'ViewsNg/UserResourcePool/DistanceIndex.html' })
            .when('/AllInOne/', { controller: 'userResourcePoolController as vm', templateUrl: 'ViewsNg/UserResourcePool/AllInOne.html' })

            .when('/User/Login/', { controller: 'userController as vm', templateUrl: 'ViewsNg/User/Login.html' })

            .when('/Overview', {
                templateUrl: 'ViewsNg/Home/Overview.html'
            })
            .when('/Technologies', {
                templateUrl: 'ViewsNg/Home/Technologies.html'
            }).otherwise({
                redirectTo: '/'
            });

        function getEntityName() {

            var entityName = window.location.pathname.replace('/', '').replace('Ng', '');

            var entityNameCamelCase = entityName.length > 1
                ? entityName[0].toLowerCase() + entityName.substring(1)
                : entityName;

            return entityNameCamelCase;
        }

        function getController(isList) {

            var isEntityRoute = window.location.pathname.indexOf('Ng') > 0;

            if (isEntityRoute)
                return isList
                    ? getEntityName() + 'ListController as vm'
                    : getEntityName() + 'EditController as vm';
            else
                return null;
        }

        function getTemplate(isList, routeState) {

            var isEntityRoute = window.location.pathname.indexOf('Ng') > 0;

            if (isEntityRoute)
                return isList
                ? 'ViewsNg/list/' + getEntityName() + 'List.html'
                : 'ViewsNg/edit/' + getEntityName() + 'Edit.html';
            else {
                var folder = 'home';
                var template = 'index.html';

                var pathParams = window.location.pathname.substring(1).split('/');

                if (pathParams.length == 2) {
                    folder = pathParams[0];
                    template = pathParams[1] + '.html';
                }

                var template = 'ViewsNg/' + folder + '/' + template;

                return template;
            }
        }
    }

})();
