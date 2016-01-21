﻿(function () {
    'use strict';

    angular.module('main')
        .config(['$routeProvider', '$locationProvider', routeConfig]);

    angular.module('main')
        .run(['userFactory', 'resourcePoolFactory', 'LocationItem', '$rootScope', '$location', 'logger', routeRun]);

    function routeConfig($routeProvider, $locationProvider) {

        // Routes
        $routeProvider

            /* Content */
            .when('/', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl })
            .when('/default.aspx', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl })
            .when('/content/:key/', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl })

            /* CMRP List + View + Edit pages */
            .when('/resourcePool', { title: function () { return 'CMRP List'; }, templateUrl: '/App/views/resourcePool/resourcePoolList.html?v=0.38' })
            .when('/resourcePool/new', { title: function () { return 'New CMRP'; }, templateUrl: '/App/views/resourcePool/resourcePoolEdit.html?v=0.38.2' })
            .when('/resourcePool/:resourcePoolId/edit', { title: function () { return ''; }, templateUrl: '/App/views/resourcePool/resourcePoolEdit.html?v=0.38' })
            .when('/resourcePool/:resourcePoolId', { title: function () { return ''; }, templateUrl: '/App/views/resourcePool/resourcePoolView.html?v=0.37' })

            /* Account */
            .when('/account/register', { title: function () { return 'Register'; }, templateUrl: '/App/views/account/register.html?v=0.42' })
            .when('/account/login', { title: function () { return 'Login'; }, templateUrl: '/App/views/account/login.html?v=0.42' })
            .when('/account/externalLogin', { title: function () { return 'Social Logins'; }, templateUrl: '/App/views/account/externalLogin.html?v=0.41' })
            .when('/account/accountEdit', { title: function () { return 'Account Edit'; }, templateUrl: '/App/views/account/accountEdit.html?v=0.40' })
            .when('/account/changeEmail', { title: function () { return 'Change Email'; }, templateUrl: '/App/views/account/changeEmail.html?v=0.40' })
            .when('/account/changePassword', { title: function () { return 'Change Password'; }, templateUrl: '/App/views/account/changePassword.html?v=0.40' })
            .when('/account/addPassword', { title: function () { return 'Add Password'; }, templateUrl: '/App/views/account/addPassword.html?v=0.41.1' })
            .when('/account/confirmEmail', { title: function () { return 'Confirm Email'; }, templateUrl: '/App/views/account/confirmEmail.html?v=0.41.3' })

            /* Generated List + Edit pages */
            .when('/manage/generated/:entity', { title: getManageRouteTitle, templateUrl: getManageRouteTemplateUrl })
            .when('/manage/generated/:entity/:action', { title: getManageRouteTitle, templateUrl: getManageRouteTemplateUrl })
            .when('/manage/generated/:entity/:action/:Id', { title: getManageRouteTitle, templateUrl: getManageRouteTemplateUrl })

            /* Otherwise */
            .otherwise({ redirectTo: '/content/404' }); // TODO Is it possible to return Response.StatusCode = 404; ?

        // Html5Mode is on, if supported (# will not be used)
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode({ enabled: true });
        }

        function getManageRouteTitle(params) {

            var entity = params.entity[0].toUpperCase() + params.entity.substring(1);

            var action = typeof params.action !== 'undefined' ?
                params.action[0].toUpperCase() + params.action.substring(1) :
                'List';

            return entity + ' ' + action;
        }

        function getManageRouteTemplateUrl(params) {

            var templateUrl = '';

            var action = typeof params.action !== 'undefined' ?
                params.action :
                'list'; // Default action

            if (action === 'list')
                templateUrl = '/App/views/manage/generated/list/' + params.entity + 'List.html?v=0.37';

            if (action === 'new' || action === 'edit') {
                templateUrl = '/App/views/manage/generated/edit/' + params.entity + 'Edit.html?v=0.37';
            }

            return templateUrl;
        }

        function getContentRouteTitle(params) {

            var title = typeof params.key !== 'undefined' ?
                params.key[0] + params.key.substring(1) :
                'Home'; // Default view

            return title;
        }

        function getContentTemplateUrl(params) {

            var key = typeof params.key !== 'undefined' ?
                params.key :
                'home'; // Default view

            return '/App/views/content/' + key + '.html?v=0.42';
        }
    }

    function routeRun(userFactory, resourcePoolFactory, LocationItem, $rootScope, $location, logger) {

        // Logger
        logger = logger.forSource('routeRun');

        // Default location
        $rootScope.locationHistory = [new LocationItem('/')];

        $rootScope.$on('$routeChangeStart', function (event, next, current) {

            // Navigate the authenticated user to home page, in case they try to go login or register
            userFactory.getCurrentUser()
                .then(function (currentUser) {
                    if (currentUser.isAuthenticated() && ($location.path() === '/account/login' || $location.path() === '/account/register')) {
                        $location.path('/');
                    }
                });
        });

        $rootScope.$on('$routeChangeSuccess', function (event, next, current) {

            // View title
            var viewTitle = '';
            if (typeof next.$$route !== 'undefined' && typeof next.$$route.title !== 'undefined') {
                // TODO Is this correct?
                viewTitle = next.$$route.title(next.params);
            }
            $rootScope.viewTitle = viewTitle;

            // Newly added resource pool fix
            if (typeof next.params.resourcePoolId !== 'undefined') {
                var resourcePoolId = next.params.resourcePoolId;
                resourcePoolFactory.getResourcePool(resourcePoolId)
                    .then(function (resourcePool) {
                        createLocationHistory(resourcePool);
                    });
            } else {
                createLocationHistory();
            }

            function createLocationHistory(resourcePool) {
                resourcePool = typeof resourcePool !== 'undefined' ? resourcePool : null;

                // Add each location to the history
                var locationItem = new LocationItem($location.path(), resourcePool, $location.path().substring($location.path().lastIndexOf('/') + 1) === 'edit');
                $rootScope.locationHistory.push(locationItem);

                // Only keep limited number of items
                var locationHistoryLimit = 10;
                if ($rootScope.locationHistory.length > locationHistoryLimit) {
                    $rootScope.locationHistory.splice(0, $rootScope.locationHistory.length - locationHistoryLimit);
                }
            }
        });
    }
})();
