﻿(function () {
    'use strict';

    var factoryId = 'userFactory';
    angular.module('main')
        .config(function ($provide) {
            $provide.decorator(factoryId, ['$delegate', 'dataContext', '$http', '$q', '$rootScope', '$window', '$location', 'logger', userFactory]);
        });

    function userFactory($delegate, dataContext, $http, $q, $rootScope, $window, $location, logger) {
        logger = logger.forSource(factoryId);

        var accessTokenUrl = '/api/Token';
        var addPasswordUrl = '/api/Account/AddPassword';
        var changeEmailUrl = '/api/Account/ChangeEmail';
        var changePasswordUrl = '/api/Account/ChangePassword';
        var confirmEmailUrl = '/api/Account/ConfirmEmail';
        var registerUrl = '/api/Account/Register';
        var resendConfirmationEmailUrl = '/api/Account/ResendConfirmationEmail';

        var currentUser = null;
        var getCurrentUserPromise = null;
        var isAuthenticatedPromise = null;

        // Service methods
        $delegate.addPassword = addPassword;
        $delegate.changeEmail = changeEmail;
        $delegate.changePassword = changePassword;
        $delegate.confirmEmail = confirmEmail;
        $delegate.getAccessToken = getAccessToken;
        $delegate.getCurrentUser = getCurrentUser;
        $delegate.isAuthenticated = isAuthenticated;
        $delegate.logout = logout;
        $delegate.register = register;
        $delegate.resendConfirmationEmail = resendConfirmationEmail;
        $delegate.updateAnonymousChanges = updateAnonymousChanges;

        $delegate.updateElementMultiplier = updateElementMultiplier;
        $delegate.updateElementCellNumericValue = updateElementCellNumericValue;
        $delegate.updateElementFieldIndexRating = updateElementFieldIndexRating;
        $delegate.updateResourcePoolRate = updateResourcePoolRate;

        return $delegate;

        /*** Implementations ***/

        function addPassword(addPasswordBindingModel) {
            return $http.post(addPasswordUrl, addPasswordBindingModel)
                .success(function (updatedUser) {
                    
                    // Remove 'HasNoPassword' claim
                    var claimIndex = null;
                    for (var i = 0; i < currentUser.Claims.length; i++) {
                        if (currentUser.Claims[i].ClaimType === 'HasNoPassword') {
                            claimIndex = i;
                            break;
                        }
                    };

                    if (claimIndex === null) {
                        // TODO throw error?
                    }

                    var claims = currentUser.Claims.splice(claimIndex, 1);
                    claims[0].entityAspect.setDetached();

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function changeEmail(changeEmailBindingModel) {
            return $http.post(changeEmailUrl, changeEmailBindingModel)
                .success(function (updatedUser) {

                    currentUser.Email = updatedUser.Email;
                    currentUser.EmailConfirmed = false;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function changePassword(changePasswordBindingModel) {
            return $http.post(changePasswordUrl, changePasswordBindingModel)
                .success(function (updatedUser) {
                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function confirmEmail(confirmEmailBindingModel) {
            return $http.post(confirmEmailUrl, confirmEmailBindingModel)
                .success(function (updatedUser) {

                    currentUser.EmailConfirmed = true;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function getAccessToken(email, password, tempToken) {

            var accessTokenData = 'grant_type=password&username=' + email + '&password=' + password;

            var tokenUrl = accessTokenUrl;
            if (typeof tempToken !== 'undefined') {
                tokenUrl += '?tempToken=' + tempToken;
            }

            return $http.post(tokenUrl, accessTokenData, { 'Content-Type': 'application/x-www-form-urlencoded' })
                .success(function (data) {

                    // Set access token to the session
                    $window.localStorage.setItem('access_token', data.access_token);

                    // Clear user promise
                    getCurrentUserPromise = null;
                    isAuthenticatedPromise = null;

                    // Raise logged in event
                    $rootScope.$broadcast('userLoggedIn');
                });
        }

        function getCurrentUser() {

            var deferred = $q.defer();

            if (getCurrentUserPromise === null) {
                getCurrentUserPromise = deferred.promise;

                var query = breeze.EntityQuery
                    .from('Users')
                    .expand('Claims')
                    .using(breeze.FetchStrategy.FromServer);

                dataContext.executeQuery(query)
                    .then(success)
                    .catch(failed);
            }

            return getCurrentUserPromise;

            function success(response) {

                if (response.results.length > 0) {

                    // If there is an existing user (temp user), detach it
                    // TODO Or merging them could work as well
                    if (currentUser !== null && typeof currentUser.entityAspect !== 'undefined') {
                        currentUser.entityAspect.setDetached();
                    }

                    currentUser = response.results[0];
                    deferred.resolve(currentUser);

                } else {
                    currentUser = dataContext.createEntity('User', {});
                    deferred.resolve(currentUser);
                }
            }

            function failed(error) {
                var message = error.message || 'User query failed';
                deferred.reject(message);
            }
        }

        function getUserElementCell(user, elementCell) {

            var userCell = elementCell.currentUserCell();

            if (userCell === null) {

                // Since there is a delay between client-side changes and actual save operation (editor.js - saveChanges(1500)), these entities might be deleted but not yet saved. 
                // To prevent having the exception of creating an entity with the same keys twice, search 'deleted' ones and restore it back to life! / SH - 02 Dec. '15
                var deletedUserCells = dataContext.getEntities(['UserElementCell'], [breeze.EntityState.Deleted]);
                var userCells = deletedUserCells.filter(function (deletedUserCell) {
                    return deletedUserCell.UserId === user.Id && deletedUserCell.ElementCellId === elementCell.Id;
                });

                if (userCells.length > 0) {
                    userCell = userCells[0];
                    userCell.entityAspect.rejectChanges();
                    userCell.DecimalValue = elementCell.ElementField.DataType === 12 ? 0 : 50; // TODO ?
                }
            }

            return userCell;
        }

        function getUserElementField(user, elementField) {

            var userField = elementField.currentUserElementField();

            if (userField === null) {

                // Since there is a delay between client-side changes and actual save operation (editor.js - saveChanges(1500)), these entities might be deleted but not yet saved. 
                // To prevent having the exception of creating an entity with the same keys twice, search 'deleted' ones and restore it back to life! / SH - 02 Dec. '15
                var deletedUserFields = dataContext.getEntities(['UserElementField'], [breeze.EntityState.Deleted]);
                var userFields = deletedUserFields.filter(function (deletedUserField) {
                    return deletedUserField.UserId === user.Id && deletedUserField.ElementFieldId === elementField.Id;
                });

                if (userFields.length > 0) {
                    userField = userFields[0];
                    userField.entityAspect.rejectChanges();
                    userField.Rating = 50;
                }
            }

            return userField;
        }

        function getUserResourcePool(user, resourcePool) {

            var userResourcePool = resourcePool.currentUserResourcePool();

            if (userResourcePool === null) {

                // Since there is a delay between client-side changes and actual save operation (editor.js - saveChanges(1500)), these entities might be deleted but not yet saved. 
                // To prevent having the exception of creating an entity with the same keys twice, search 'deleted' ones and restore it back to life! / SH - 02 Dec. '15
                var deletedUserResourcePools = dataContext.getEntities(['UserResourcePool'], [breeze.EntityState.Deleted]);
                var userResourcePools = deletedUserResourcePools.filter(function (deletedUserResourcePool) {
                    return deletedUserResourcePool.UserId === user.Id && deletedUserResourcePool.ResourcePoolId === resourcePool.Id;
                });

                if (userResourcePools.length > 0) {
                    userResourcePool = userResourcePools[0];
                    userResourcePool.entityAspect.rejectChanges();
                    userResourcePool.ResourcePoolRate = 10;
                }
            }

            return userResourcePool;
        }

        function handleErrorResult(data, status, headers, config) {

            // TODO Can this be done on a higher level?
            var message = '';

            if (typeof data.ModelState !== 'undefined') {
                for (var key in data.ModelState) {
                    var array = data.ModelState[key];
                    array.forEach(function (error) {
                        message += error + '<br />';
                    });
                }
            }

            if (message === '') {
                message = data.Message;
            }

            logger.logError(message, null, true);
        }

        function isAuthenticated() {

            var deferred = $q.defer();

            if (isAuthenticatedPromise === null) {
                isAuthenticatedPromise = deferred.promise;

                getCurrentUser()
                    .then(function (currentUser) {
                        deferred.resolve(currentUser.Id > 0);
                    })
                    .catch(function () {
                        deferred.reject();
                    });
            }

            return isAuthenticatedPromise;
        }

        function logout() {

            // Remove access token from the session
            $window.localStorage.removeItem('access_token');

            // Clear user promise
            getCurrentUserPromise = null;
            isAuthenticatedPromise = null;

            // Clear breeze's metadata store
            dataContext.clear();

            // Raise logged out event
            $rootScope.$broadcast('userLoggedOut');
        }

        function register(registerBindingModel) {
            return $http.post(registerUrl, registerBindingModel)
                .success(function (newUser) {

                    // breeze context user entity fix-up!
                    // TODO Try to make this part better, use OData method?
                    currentUser.Id = newUser.Id;
                    currentUser.Email = newUser.Email;
                    currentUser.UserName = newUser.UserName;
                    currentUser.entityAspect.acceptChanges();

                })
                .error(handleErrorResult);
        }

        function resendConfirmationEmail(userId) {
            return $http.post(resendConfirmationEmailUrl, { UserId: userId }).error(handleErrorResult);
        }

        // When an entity gets updated through angular, unlike breeze updates, it doesn't sync RowVersion automatically
        // After each update, call this function to sync the entities RowVersion with the server's. Otherwise it'll get Conflict error
        // SH - 05 Jan. '16
        function syncRowVersion(oldEntity, newEntity) {
            // TODO Validations?
            oldEntity.RowVersion = newEntity.RowVersion;
        }

        function updateAnonymousChanges(oldUser, newUser) {
            return dataContext.updateAnonymousChanges(oldUser, newUser);
        }

        // These 'updateX' functions were defined in their related entities (user.js).
        // Only because they had to use createEntity() on dataContext, it was moved to this service.
        // Try do handle them in a better way, maybe by using broadcast?

        function updateElementMultiplier(element, updateType) {

            // Find user element cell
            element.ElementItemSet.forEach(function (item) {

                var multiplierCell;
                for (var cellIndex = 0; cellIndex < item.ElementCellSet.length; cellIndex++) {
                    var elementCell = item.ElementCellSet[cellIndex];
                    if (elementCell.ElementField.DataType === 12) {
                        multiplierCell = elementCell;
                        break;
                    }
                }

                updateElementCellMultiplier(multiplierCell, updateType);
            });

            // Update related

            // Update items
            element.ElementItemSet.forEach(function (item) {
                item.setMultiplier();
            });

            element.ElementFieldSet.forEach(function (field) {

                if (field.IndexEnabled) {
                    // Update numeric value cells
                    field.ElementCellSet.forEach(function (cell) {
                        cell.setNumericValueMultiplied(false);
                    });

                    // Update fields
                    field.setNumericValueMultiplied();
                }
            });
        }

        function updateElementCellMultiplier(elementCell, updateType) {

            var userCell = getUserElementCell(currentUser, elementCell);

            switch (updateType) {
                case 'increase':
                case 'decrease': {


                    if (userCell === null) { // If there is no item, create it

                        userCell = dataContext.createEntity('UserElementCell', {
                            User: currentUser,
                            ElementCell: elementCell,
                            DecimalValue: updateType === 'increase' ? 1 : 0
                        });

                    } else { // If there is an item, update DecimalValue, but cannot be lower than zero

                        userCell.DecimalValue = updateType === 'increase'
                            ? userCell.DecimalValue + 1
                            : userCell.DecimalValue - 1 < 0 ? 0 : userCell.DecimalValue - 1;
                    }

                    break;
                }
                case 'reset': {

                    if (userCell !== null) { // If there is an item, delete it
                        userCell.entityAspect.setDeleted();
                    }

                    break;
                }
            }
        }

        function updateElementCellNumericValue(elementCell, updateType) {

            var userCell = getUserElementCell(currentUser, elementCell);

            switch (updateType) {
                case 'increase':
                case 'decrease': {

                    if (userCell === null) { // If there is no item, create it

                        dataContext.createEntity('UserElementCell', {
                            User: currentUser,
                            ElementCell: elementCell,
                            DecimalValue: updateType === 'increase' ? 55 : 45
                        });

                    } else { // If there is an item, update DecimalValue, but cannot be smaller than zero and cannot be bigger than 100

                        userCell.DecimalValue = updateType === 'increase'
                            ? userCell.DecimalValue + 5 > 100
                            ? 100
                            : userCell.DecimalValue + 5
                            : userCell.DecimalValue - 5 < 0
                            ? 0
                            : userCell.DecimalValue - 5
                    }

                    // Update the cached value
                    elementCell.setCurrentUserNumericValue();

                    break;
                }
                case 'reset': {

                    if (userCell !== null) { // If there is an item, delete it
                        userCell.entityAspect.setDeleted();

                        // Update the cached value
                        elementCell.setCurrentUserNumericValue();
                    }

                    break;
                }
            }
        }

        function updateElementFieldIndexRating(elementField, updateType) {

            var userElementField = getUserElementField(currentUser, elementField);

            switch (updateType) {
                case 'increase':
                case 'decrease': {

                    // If there is no item, create it
                    if (userElementField === null) {
                        userElementField = {
                            User: currentUser,
                            ElementField: elementField,
                            Rating: updateType === 'increase' ? 55 : 45
                        };

                        dataContext.createEntity('UserElementField', userElementField);

                    } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 100

                        userElementField.Rating = updateType === 'increase'
                            ? userElementField.Rating + 5 > 100
                            ? 100
                            : userElementField.Rating + 5
                            : userElementField.Rating - 5 < 0
                            ? 0
                            : userElementField.Rating - 5;
                    }

                    // Update the cached value
                    elementField.setCurrentUserIndexRating();

                    break;
                }
                case 'reset': {

                    // If there is an item, delete it
                    if (userElementField !== null) {
                        userElementField.entityAspect.setDeleted();

                        // Update the cached value
                        elementField.setCurrentUserIndexRating();
                    }

                    break;
                }
            }
        }

        function updateResourcePoolRate(resourcePool, updateType) {

            var userResourcePool = getUserResourcePool(currentUser, resourcePool);

            switch (updateType) {
                case 'increase':
                case 'decrease': {

                    // If there is no item, create it
                    if (userResourcePool === null) {
                        userResourcePool = {
                            User: currentUser,
                            ResourcePool: resourcePool,
                            ResourcePoolRate: updateType === 'increase' ? 15 : 5
                        };

                        dataContext.createEntity('UserResourcePool', userResourcePool);

                    } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 1000

                        userResourcePool.ResourcePoolRate = updateType === 'increase'
                            ? userResourcePool.ResourcePoolRate + 5 > 1000
                            ? 1000
                            : userResourcePool.ResourcePoolRate + 5
                            : userResourcePool.ResourcePoolRate - 5 < 0
                            ? 0
                            : userResourcePool.ResourcePoolRate - 5;
                    }

                    // Update the cached value
                    resourcePool.setCurrentUserResourcePoolRate();

                    break;
                }
                case 'reset': {

                    // If there is an item, delete it
                    if (userResourcePool !== null) {
                        userResourcePool.entityAspect.setDeleted();

                        // Update the cached value
                        resourcePool.setCurrentUserResourcePoolRate();
                    }

                    break;
                }
            }
        }
    }

})();
