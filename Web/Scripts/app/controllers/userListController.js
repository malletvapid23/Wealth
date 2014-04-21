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

    var controllerId = 'userListController';
    angular.module('main')
        .controller(controllerId, ['userService', 'logger', userListController]);

    function userListController(userService, logger) {

        logger = logger.forSource(controllerId);
        var logError = logger.logError;
        var logSuccess = logger.logSuccess;

        var vm = this;
        vm.deleteUser = deleteUser;
        vm.userSet = [];

        initialize();

        function initialize() {
            getUserSet();
        };

        function deleteUser(user) {
            userService.deleteUser(user);

            userService.saveChanges()
                .then(function () {
                    vm.userSet.splice(vm.userSet.indexOf(user), 1);
                    logSuccess("Hooray we saved", null, true);
                })
                .catch(function (error) {
                    logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                })
        };

        function getUserSet() {
            userService.getUserSet().then(function (data) {
                vm.userSet = data;
            });
        }
    };
})();
