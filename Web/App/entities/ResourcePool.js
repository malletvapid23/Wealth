﻿(function () {
    'use strict';

    var factoryId = 'ResourcePool';
    angular.module('main')
        .factory(factoryId, ['logger', resourcePoolFactory]);

    function resourcePoolFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Server-side properties
        Object.defineProperty(ResourcePool.prototype, 'UseFixedResourcePoolRate', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._useFixedResourcePoolRate; },
            set: function (value) {

                if (this.backingFields._useFixedResourcePoolRate !== value) {
                    this.backingFields._useFixedResourcePoolRate = value;

                    this.setResourcePoolRate();
                }
            }
        });

        // TODO Array property sample (without setter)
        // However it doesn't work since it's a navigation prop and breeze somehow doesn't like it
        //Object.defineProperty(ResourcePool.prototype, 'UserResourcePoolSet', {
        //    enumerable: true,
        //    configurable: true,
        //    get: function () { return this.backingFields._UserResourcePoolSet; }
        //});

        // Client-side properties
        Object.defineProperty(ResourcePool.prototype, 'RatingMode', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._ratingMode; },
            set: function (value) {
                if (this.backingFields._ratingMode !== value) {
                    this.backingFields._ratingMode = value;

                    this.setResourcePoolRate();

                    for (var elementIndex = 0; elementIndex < this.ElementSet.length; elementIndex++) {
                        var element = this.ElementSet[elementIndex];

                        for (var fieldIndex = 0; fieldIndex < element.ElementFieldSet.length; fieldIndex++) {

                            var field = element.ElementFieldSet[fieldIndex];

                            // Field calculations
                            if (field.IndexEnabled) {
                                field.setIndexRating();
                            }

                            if (!field.UseFixedValue) {
                                for (var cellIndex = 0; cellIndex < field.ElementCellSet.length; cellIndex++) {
                                    var cell = field.ElementCellSet[cellIndex];

                                    // Cell calculations
                                    switch (field.DataType) {
                                        case 2:
                                        case 3:
                                        case 4:
                                            // TODO 5 (DateTime?)
                                        case 11:
                                        case 12: {
                                            cell.setNumericValue();
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Return
        return ResourcePool;

        /*** Implementations ***/

        function ResourcePool() {

            var self = this;

            // Server-side props
            self.Id = 0;
            self.UserId = 0;
            self.Name = '';
            self.InitialValue = 0;
            self.ResourcePoolRateTotal = 0; // Computed value - Used in: setOtherUsersResourcePoolRateTotal
            self.ResourcePoolRateCount = 0; // Computed value - Used in: setOtherUsersResourcePoolRateCount
            self.RatingCount = 0; // Computed value - Used in: resourcePoolEditor.html
            // TODO breezejs - Cannot assign a navigation property in an entity ctor
            //self.User = null;
            //self.ElementSet = [];
            //self.UserResourcePoolSet = [];

            // Local variables
            self.backingFields = {
                _useFixedResourcePoolRate: false,
                _currentElement: null,
                _ratingMode: 1, // Only my ratings vs. All users' ratings
                _selectedElement: null,
                _currentUserResourcePoolRate: null,
                _otherUsersResourcePoolRateTotal: null,
                _otherUsersResourcePoolRateCount: null,
                _resourcePoolRate: null,
                _resourcePoolRatePercentage: null
            }

            // Determines whether entityState is actually isAdded.
            // Anonymous users can also add/edit resource pool.
            // However, when an anonymous user adds a new resource pool, it actually doesn't save to database and entityState stays as isAdded().
            // Then, when the user clicks on 'Cancel CMRP', rejectChanges() will be called, which removes the resource pool.
            // To prevent this issue, when anon user calls saveChanges, this flag will be used (isAdded will become true) and acceptChanges will be called (still not saving to actual database).
            // Now, calling rejectChanges will return the entities to their previous state without any problem.
            // And if the anon user will register or login, this flag will be checked in dataContext.js and all the related entities will be converted back to isAdded() state.
            // SH - 30 Nov. '15
            self.isAdded = false;
            self.init = init; // Should be called after createEntity or retrieving it from server
            self.mainElement = mainElement;
            self.updateCache = updateCache;
            self.selectedElement = selectedElement;

            // Public functions

            function selectedElement(value) {

                // Set new value
                if (typeof value !== 'undefined' && self.backingFields._selectedElement !== value) {
                    self.backingFields._selectedElement = value;
                }

                // If there is no existing value (initial state), use mainElement() as the selected
                if (self.backingFields._selectedElement === null && self.mainElement()) {
                    self.backingFields._selectedElement = self.mainElement();
                }

                return self.backingFields._selectedElement;
            }

            // TODO Most of these functions are related with userService.js - updateX functions
            // Try to merge these two - Actually try to handle these actions within the related entity / SH - 27 Nov. '15
            function updateCache() {

                self.setCurrentUserResourcePoolRate();

                // Elements
                if (typeof self.ElementSet !== 'undefined') {
                    for (var elementIndex = 0; elementIndex < self.ElementSet.length; elementIndex++) {
                        var element = self.ElementSet[elementIndex];

                        // TODO Review this later / SH - 24 Nov. '15
                        element.setElementFieldIndexSet();

                        // Fields
                        if (typeof element.ElementFieldSet !== 'undefined') {
                            for (var fieldIndex = 0; fieldIndex < element.ElementFieldSet.length; fieldIndex++) {

                                var field = element.ElementFieldSet[fieldIndex];

                                if (field.IndexEnabled) {
                                    // TODO Actually index rating can't be set through resourcePoolEdit page and no need to update this cache
                                    // But still keep it as a reminder? / SH - 29 Nov. '15
                                    field.setCurrentUserIndexRating();
                                }

                                // Cells
                                if (typeof field.ElementCellSet !== 'undefined') {
                                    for (var cellIndex = 0; cellIndex < field.ElementCellSet.length; cellIndex++) {
                                        var cell = field.ElementCellSet[cellIndex];

                                        switch (cell.ElementField.DataType) {
                                            case 1: {
                                                // TODO Again what a mess!
                                                // StringValue is a computed value, it should normally come from the server
                                                // But in case resource pool was just created, then it should be directly set like this.
                                                // Otherwise, it doesn't show its value on editor.
                                                // And on top of it, since it changes, breeze thinks that 'cell' is modified and tries to send it server
                                                // which results an error. So that's why modified check & acceptChanges parts were added.
                                                // SH - 01 Dec. '15
                                                if (cell.UserElementCellSet.length > 0) {
                                                    var isUnchanged = cell.entityAspect.entityState.isUnchanged();
                                                    cell.StringValue = cell.UserElementCellSet[0].StringValue;
                                                    if (isUnchanged) { cell.entityAspect.acceptChanges(); }
                                                }
                                                break;
                                            }
                                            case 2:
                                            case 3:
                                            case 4:
                                                // TODO DateTime?
                                                {
                                                    cell.setCurrentUserNumericValue();
                                                    break;
                                                }
                                            case 11:
                                                {
                                                    // TODO DirectIncome is always calculated from NumericValueTotal
                                                    // Which is actually not correct but till that its fixed, update it like this / SH - 29 Nov. '15
                                                    // Also check 'What a mess' of StringValue
                                                    if (cell.UserElementCellSet.length > 0) {
                                                        var isUnchanged = cell.entityAspect.entityState.isUnchanged();
                                                        cell.NumericValueTotal = cell.UserElementCellSet[0].DecimalValue;
                                                        if (isUnchanged) { cell.entityAspect.acceptChanges(); }
                                                    }
 
                                                    cell.setCurrentUserNumericValue();
                                                    break;
                                                }
                                            case 12:
                                                {
                                                    cell.ElementItem.setMultiplier();

                                                    if (cell.ElementField.IndexEnabled) {
                                                        cell.setNumericValueMultiplied();
                                                    }

                                                    break;
                                                }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function init() {

                // Set otherUsers' data
                self.setOtherUsersResourcePoolRateTotal();
                self.setOtherUsersResourcePoolRateCount();

                // Elements
                if (typeof self.ElementSet !== 'undefined') {
                    for (var elementIndex = 0; elementIndex < self.ElementSet.length; elementIndex++) {
                        var element = self.ElementSet[elementIndex];

                        // Fields
                        if (typeof element.ElementFieldSet !== 'undefined') {
                            for (var fieldIndex = 0; fieldIndex < element.ElementFieldSet.length; fieldIndex++) {

                                var field = element.ElementFieldSet[fieldIndex];

                                field.setOtherUsersIndexRatingTotal();
                                field.setOtherUsersIndexRatingCount();

                                // Cells
                                if (typeof field.ElementCellSet !== 'undefined') {
                                    for (var cellIndex = 0; cellIndex < field.ElementCellSet.length; cellIndex++) {
                                        var cell = field.ElementCellSet[cellIndex];

                                        cell.setOtherUsersNumericValueTotal();
                                        cell.setOtherUsersNumericValueCount();
                                    }
                                }
                            }
                        }
                    }
                }

                updateCache();
            }

            function mainElement() {
                for (var i = 0; i < self.ElementSet.length; i++) {
                    var element = self.ElementSet[i];
                    if (element.IsMainElement) {
                        return element;
                    }
                }
                return null;
            }

            // Checks whether resource pool has any item that can be rateable
            self.displayRatingMode = function () {

                // Check resource pool level first
                if (!self.UseFixedResourcePoolRate) {
                    return true;
                }

                // Field index level
                for (var elementIndex = 0; elementIndex < self.ElementSet.length; elementIndex++) {
                    var element = self.ElementSet[elementIndex];

                    // If there are multiple indexes, then the users can set index rating
                    if (element.elementFieldIndexSet().length > 1) {
                        return true;
                    }

                    // If there is an index without a fixed value
                    if (element.elementFieldIndexSet().length > 0 && !element.elementFieldIndexSet()[0].UseFixedValue) {
                        return true;
                    }
                }

                return false;
            }

            self.toggleRatingMode = function () {
                self.RatingMode = self.RatingMode === 1 ? 2 : 1;
            }

            self.currentUserResourcePool = function () {
                return self.UserResourcePoolSet.length > 0
                    ? self.UserResourcePoolSet[0]
                    : null;
            }

            self.currentUserResourcePoolRate = function () {

                if (self.backingFields._currentUserResourcePoolRate === null) {
                    self.setCurrentUserResourcePoolRate(false);
                }

                return self.backingFields._currentUserResourcePoolRate;
            }

            self.setCurrentUserResourcePoolRate = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.currentUserResourcePool() !== null
                    ? self.currentUserResourcePool().ResourcePoolRate
                    : 10; // Default value?

                if (self.backingFields._currentUserResourcePoolRate !== value) {
                    self.backingFields._currentUserResourcePoolRate = value;

                    // Update related
                    if (updateRelated) {
                        self.setResourcePoolRate();
                    }
                }
            }

            // TODO Since this is a fixed value based on ResourcePoolRateTotal & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            self.otherUsersResourcePoolRateTotal = function () {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersResourcePoolRateTotal === null) {
                    self.setOtherUsersResourcePoolRateTotal();
                }

                return self.backingFields._otherUsersResourcePoolRateTotal;
            }

            self.setOtherUsersResourcePoolRateTotal = function () {
                self.backingFields._otherUsersResourcePoolRateTotal = self.ResourcePoolRateTotal !== null
                    ? self.ResourcePoolRateTotal
                    : 0;

                // Exclude current user's
                if (self.currentUserResourcePool() !== null) {
                    self.backingFields._otherUsersResourcePoolRateTotal -= self.currentUserResourcePool().ResourcePoolRate;
                }
            }

            // TODO Since this is a fixed value based on ResourcePoolRateCount & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            self.otherUsersResourcePoolRateCount = function () {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersResourcePoolRateCount === null) {
                    self.setOtherUsersResourcePoolRateCount();
                }

                return self.backingFields._otherUsersResourcePoolRateCount;
            }

            self.setOtherUsersResourcePoolRateCount = function () {

                self.backingFields._otherUsersResourcePoolRateCount = self.ResourcePoolRateCount;

                // Exclude current user's
                if (self.currentUserResourcePool() !== null) {
                    self.backingFields._otherUsersResourcePoolRateCount--;
                }
            }

            self.resourcePoolRateTotal = function () {
                return self.UseFixedResourcePoolRate
                    ? self.otherUsersResourcePoolRateTotal()
                    : self.otherUsersResourcePoolRateTotal() + self.currentUserResourcePoolRate();
            }

            self.resourcePoolRateCount = function () {
                return self.UseFixedResourcePoolRate
                    ? self.otherUsersResourcePoolRateCount()
                    : self.otherUsersResourcePoolRateCount() + 1; // There is always default value, increase count by 1
            }

            self.resourcePoolRateAverage = function () {

                if (self.resourcePoolRateCount() === null) {
                    return null;
                }

                return self.resourcePoolRateCount() === 0
                    ? 0
                    : self.resourcePoolRateTotal() / self.resourcePoolRateCount();
            }

            self.resourcePoolRate = function () {

                if (self.backingFields._resourcePoolRate === null) {
                    self.setResourcePoolRate(false);
                }

                return self.backingFields._resourcePoolRate;
            }

            self.setResourcePoolRate = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value;

                if (self.UseFixedResourcePoolRate) {
                    value = self.resourcePoolRateAverage();
                } else {
                    switch (self.RatingMode) {
                        case 1: { value = self.currentUserResourcePoolRate(); break; } // Current user's
                        case 2: { value = self.resourcePoolRateAverage(); break; } // All
                    }
                }

                if (self.backingFields._resourcePoolRate !== value) {
                    self.backingFields._resourcePoolRate = value;

                    // Update related
                    if (updateRelated) {
                        self.setResourcePoolRatePercentage();
                    }
                }
            }

            self.resourcePoolRatePercentage = function () {

                if (self.backingFields._resourcePoolRatePercentage === null) {
                    self.setResourcePoolRatePercentage(false);
                }

                return self.backingFields._resourcePoolRatePercentage;
            }

            self.setResourcePoolRatePercentage = function (updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.resourcePoolRate() === 0
                    ? 0
                    : self.resourcePoolRate() / 100;

                if (self.backingFields._resourcePoolRatePercentage !== value) {
                    self.backingFields._resourcePoolRatePercentage = value;

                    // Update related
                    if (updateRelated) {
                        for (var elementIndex = 0; elementIndex < self.ElementSet.length; elementIndex++) {
                            var element = self.ElementSet[elementIndex];

                            for (var itemIndex = 0; itemIndex < element.ElementItemSet.length; itemIndex++) {
                                var item = element.ElementItemSet[itemIndex];
                                item.setResourcePoolAmount();
                            }
                        }
                    }
                }
            }
        }
    }
})();