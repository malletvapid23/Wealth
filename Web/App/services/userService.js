﻿
(function () {
    'use strict';

    var serviceId = 'userService';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(serviceId, ['$delegate', 'dataContext', '$http', '$q', '$rootScope', '$window', 'logger', userService]);
        });

    function userService($delegate, dataContext, $http, $q, $rootScope, $window, logger) {
        logger = logger.forSource(serviceId);

        var accessTokenUrl = '/api/Token';
        var changePasswordUrl = '/api/Account/ChangePassword';
        var logoutUrl = '/api/Account/Logout';
        var registerUrl = '/api/Account/Register';
        var userInfoUrl = '/api/Account/UserInfo';
        var userInfo = null;
        var userInfoFetched = false;

        // Service methods
        $delegate.changePassword = changePassword;
        $delegate.getAccessToken = getAccessToken;
        $delegate.getUserInfo = getUserInfo;
        $delegate.logout = logout;
        $delegate.register = register;

        $delegate.updateElementMultiplier = updateElementMultiplier;
        $delegate.updateElementCellNumericValue = updateElementCellNumericValue;
        $delegate.updateElementFieldIndexRating = updateElementFieldIndexRating;
        $delegate.updateResourcePoolRate = updateResourcePoolRate;

        return $delegate;

        /*** Implementations ***/

        function changePassword(changePasswordBindingModel) {
            return $http.post(changePasswordUrl, changePasswordBindingModel)
        }

        function getAccessToken(email, password) {
            var accessTokenData = 'grant_type=password&username=' + email + '&password=' + password;

            return $http.post(accessTokenUrl, accessTokenData, { 'Content-Type': 'application/x-www-form-urlencoded' })
                .success(function (data) {

                    // Set access token to the session
                    $window.localStorage.setItem('access_token', data.access_token);

                    // Clear userInfo
                    userInfo = null;
                    userInfoFetched = false;

                    // Get the updated userInfo
                    getUserInfo()
                        .then(function () {

                            // Raise logged in event
                            $rootScope.$broadcast('userLoggedIn');

                        });
                })
        }

        function getUserInfo() {
            var deferred = $q.defer();

            if (userInfoFetched) {
                deferred.resolve(userInfo);

            } else {
                $http.get(userInfoUrl)
                    .success(function (data) {
                        // A temp fix for WebApi returns 'null' (as string), instead of null
                        // TODO Find a permanent fix!
                        if (data === 'null') {
                            data = null;
                        }

                        userInfo = data;

                        deferred.resolve(userInfo);
                    })
                    .error(function (data, status, headers, config) {
                        userInfo = null;

                        // TODO
                        // If it returns Unauthorized (status === 401), then it's not logged in yet and it's okay, no need to show an error
                        // It's something else, server may not be unreachle or internal error? Just say 'Something went wrong'?
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    })
                    .finally(function () {
                        userInfoFetched = true;

                    });
            }

            return deferred.promise;
        }

        function register(registerBindingModel) {
            return $http.post(registerUrl, registerBindingModel)
                .error(function (data, status, headers, config) {

                    // TODO
                    //logger.logError('Error!', { data: data, status: status, headers: headers, config: config });
                    if (typeof data.ModelState !== 'undefined') {
                        var modelErrors = Object.keys(data.ModelState);
                        logger.logError(data.ModelState[modelErrors], data.ModelState[modelErrors]);
                    }
                });
        }

        function logout() {
            return $http.post(logoutUrl)
                .success(function () {

                    // Remove access token from the session
                    $window.localStorage.removeItem('access_token');

                    // Clear userInfo
                    userInfo = null;
                    userInfoFetched = false;

                    // Clear breeze's metadata store
                    dataContext.clear();

                    // Raise logged outevent
                    $rootScope.$broadcast('userLoggedOut');
                })
                .error(function (data, status, headers, config) {

                    // TODO
                    //logger.logError('Error!', { data: data, status: status, headers: headers, config: config });
                    if (typeof data.ModelState !== 'undefined') {
                        var modelErrors = Object.keys(data.ModelState);
                        logger.logError(data.ModelState[modelErrors], data.ModelState[modelErrors]);
                    }
                });
        }

        // These 'updateX' functions were defined in their related entities (user.js).
        // Only because they had to use createEntity() on dataContext, it was moved to this service.
        // Try do handle them in a better way, maybe by using broadcast?

        function updateElementMultiplier(element, updateType) {

            // Validate
            if (element.multiplierField() === null || typeof element.ElementItemSet === 'undefined')
                return false;

            // Determines whether there is an update
            var updated = false;

            // Find user element cell
            for (var itemIndex = 0; itemIndex < element.ElementItemSet.length; itemIndex++) {

                var userElementCell = element.ElementItemSet[itemIndex].multiplierCell().userElementCell();

                switch (updateType) {
                    case 'increase': {

                        // If there is no item, create it
                        if (userElementCell === null) {
                            userElementCell = {
                                UserId: userInfo.Id,
                                ElementCellId: element.ElementItemSet[itemIndex].multiplierCell().Id,
                                DecimalValue: 2
                            };

                            dataContext.createEntity('UserElementCell', userElementCell);
                        } else { // Else, increase
                            userElementCell.DecimalValue++;
                        }

                        updated = true;
                        break;
                    }
                    case 'decrease': {

                        // If there is no item, create it
                        if (userElementCell === null) {
                            userElementCell = {
                                UserId: userInfo.Id,
                                ElementCellId: element.ElementItemSet[itemIndex].multiplierCell().Id,
                                DecimalValue: 0
                            };

                            dataContext.createEntity('UserElementCell', userElementCell);
                            updated = true;
                        } else { // Else, decrease only if it's bigger than 0
                            if (userElementCell.DecimalValue > 0) {
                                userElementCell.DecimalValue--;
                                updated = true;
                            }
                        }

                        break;
                    }
                    case 'reset': {

                        // If there is an item, delete it
                        if (userElementCell !== null) {
                            userElementCell.entityAspect.setDeleted();
                            updated = true;
                        }

                        break;
                    }
                }
            }

            // Return
            return updated;
        }

        function updateElementCellNumericValue(elementCell, updateType) {

            // Determines whether there is an update
            var updated = false;

            // Validate
            if (elementCell.ElementField.ElementFieldIndexSet.length === 0)
                return updated;

            var userElementCell = elementCell.userElementCell();

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userElementCell === null) {
                        userElementCell = {
                            UserId: userInfo.Id,
                            ElementCellId: elementCell.Id,
                            DecimalValue: 55
                        };

                        dataContext.createEntity('UserElementCell', userElementCell);
                        updated = true;

                    } else { // Else, increase

                        if (userElementCell.DecimalValue < 100) {
                            userElementCell.DecimalValue = userElementCell.DecimalValue + 5 > 100 ? 100 : userElementCell.DecimalValue + 5;
                            updated = true;
                        }
                    }

                    break;
                }
                case 'decrease': {

                    // If there is no item, create it
                    if (userElementCell === null) {
                        userElementCell = {
                            UserId: userInfo.Id,
                            ElementCellId: elementCell.Id,
                            DecimalValue: 45
                        };

                        dataContext.createEntity('UserElementCell', userElementCell);
                        updated = true;

                    } else { // Else, decrease

                        if (userElementCell.DecimalValue > 0) {
                            userElementCell.DecimalValue = userElementCell.DecimalValue - 5 < 0 ? 0 : userElementCell.DecimalValue - 5;
                            updated = true;
                        }
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item, delete it
                    if (userElementCell !== null) {
                        userElementCell.entityAspect.setDeleted();
                        updated = true;
                    }

                    break;
                }
            }

            // Return
            return updated;
        }

        function updateElementFieldIndexRating(elementFieldIndex, updateType) {

            // Determines whether there is an update
            var updated = false;

            var userElementFieldIndex = elementFieldIndex.userElementFieldIndex();

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userElementFieldIndex === null) {
                        userElementFieldIndex = {
                            UserId: userInfo.Id,
                            ElementFieldIndexId: elementFieldIndex.Id,
                            Rating: 55
                        };

                        dataContext.createEntity('UserElementFieldIndex', userElementFieldIndex);
                        updated = true;

                    } else { // Else, increase

                        if (userElementFieldIndex.Rating < 100) {
                            userElementFieldIndex.Rating = userElementFieldIndex.Rating + 5 > 100 ? 100 : userElementFieldIndex.Rating + 5;
                            updated = true;
                        }
                    }

                    break;
                }
                case 'decrease': {

                    if (userElementFieldIndex === null) {
                        userElementFieldIndex = {
                            UserId: userInfo.Id,
                            ElementFieldIndexId: elementFieldIndex.Id,
                            Rating: 45
                        };

                        dataContext.createEntity('UserElementFieldIndex', userElementFieldIndex);
                        updated = true;

                    } else { // Else, increase

                        if (userElementFieldIndex.Rating > 0) {
                            userElementFieldIndex.Rating = userElementFieldIndex.Rating - 5 < 0 ? 0 : userElementFieldIndex.Rating - 5;
                            updated = true;
                        }
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item, delete it
                    if (userElementFieldIndex !== null) {
                        userElementFieldIndex.entityAspect.setDeleted();
                        updated = true;
                    }

                    break;
                }
            }

            // Return
            return updated;
        }

        function updateResourcePoolRate(resourcePool, updateType) {

            // Determines whether there is an update
            var updated = false;

            var userResourcePool = resourcePool.userResourcePool();

            switch (updateType) {
                case 'increase': {

                    // If there is no item, create it
                    if (userResourcePool === null) {
                        userResourcePool = {
                            UserId: userInfo.Id,
                            ResourcePoolId: resourcePool.Id,
                            ResourcePoolRate: 15
                        };

                        dataContext.createEntity('UserResourcePool', userResourcePool);
                        updated = true;

                    } else { // Else, increase
                        if (userResourcePool.ResourcePoolRate < 1000) {
                            userResourcePool.ResourcePoolRate = userResourcePool.ResourcePoolRate + 5 > 1000 ? 1000 : userResourcePool.ResourcePoolRate + 5;
                            updated = true;
                        }
                    }

                    break;
                }
                case 'decrease': {

                    // If there is no item, create
                    if (userResourcePool === null) {
                        userResourcePool = {
                            UserId: userInfo.Id,
                            ResourcePoolId: resourcePool.Id,
                            ResourcePoolRate: 5
                        };

                        dataContext.createEntity('UserResourcePool', userResourcePool);
                        updated = true;

                    } else { // Else, decrease
                        if (userResourcePool.ResourcePoolRate > 0) {
                            userResourcePool.ResourcePoolRate = userResourcePool.ResourcePoolRate - 5 < 0 ? 0 : userResourcePool.ResourcePoolRate - 5;
                            updated = true;
                        }
                    }

                    break;
                }
                case 'reset': {

                    // If there is an item, delete it
                    if (userResourcePool !== null) {
                        userResourcePool.entityAspect.setDeleted();
                        updated = true;
                    }

                    break;
                }
            }

            // Return
            return updated;

        }
    }

})();
