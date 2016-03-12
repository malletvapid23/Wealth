﻿(function () {
    'use strict';

    var controllerId = 'ResourcePoolViewController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory',
            '$location',
            '$routeParams',
            '$rootScope',
            'logger',
            ResourcePoolViewController]);

    function ResourcePoolViewController(resourcePoolFactory, $location, $routeParams, $rootScope, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.editorConfig = getEditorConfig();

        _init();

        function _init() {

            // Title
            if (!vm.editorConfig.isNew) {
                resourcePoolFactory.getResourcePool(vm.editorConfig.resourcePoolId)
                    .then(function (resourcePool) {

                        // Not found, navigate to 404
                        if (resourcePool === null) {
                            $location.url('/_system/content/404');
                            return;
                        }

                        // TODO viewTitle was also set in route.js?
                        $rootScope.viewTitle = resourcePool.name();
                    });
            }
        }

        function getEditorConfig() {

            var action = $location.path().substring($location.path().lastIndexOf('/') + 1);
            var isNew = action === 'new';
            var isEdit = action === 'edit';
            var resourcePoolId = $routeParams.resourcePoolId;

            var config = {
                isNew: isNew,
                isEdit: isEdit,
                resourcePoolId: isNew ? null : resourcePoolId
            };

            return config;
        }
    }
})();
