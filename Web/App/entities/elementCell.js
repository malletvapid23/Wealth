﻿(function () {
    'use strict';

    var serviceId = 'elementCell';
    angular.module('main')
        .factory(serviceId, ['$rootScope', 'logger', elementCell]);

    function elementCell($rootScope, logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Service methods
        var service = {
            constructor: constructor
        }

        return (service);

        /*** Implementations ***/

        function constructor() {

            var self = this;

            var _numericValue = null;
            self._userCell = null;

            // Other users' values: Keeps the values excluding current user's
            self.otherUsersNumericValue = null;
            self.otherUsersNumericValueCount = null;

            // Events
            $rootScope.$on('elementCellNumericValueUpdated', function (event, args) {
                if (args.elementCell === self) {

                    switch (self.ElementItem.Element.valueFilter) {
                        case 1: { // Only my ratings

                            switch (self.ElementField.ElementFieldType) {
                                case 4: {

                                    if (args.value !== _numericValue) {
                                        _numericValue = args.value;
                                    }

                                    break;
                                }
                                default: { throw 'Not supported'; }
                            }

                            break;
                        }
                        case 2: { // All users' ratings

                            _numericValue = self.numericValueAverage();
                            break;
                        }
                    }
                }
            });

            $rootScope.$on('elementValueFilterChanged', function (event, args) {

                if (typeof self.ElementItem === 'undefined') {
                    return;
                }

                if (args.element !== self.ElementItem.Element) {
                    return;
                }

                // If it's not numeric value, there is nothing to do
                if (self.ElementField.ElementFieldType !== 2
                    && self.ElementField.ElementFieldType !== 3
                    && self.ElementField.ElementFieldType !== 4
                    // TODO 5 (DateTime?)
                    && self.ElementField.ElementFieldType !== 11) {
                    return;
                }

                switch (self.ElementItem.Element.valueFilter) {
                    case 1: { // Only my ratings

                        switch (self.ElementField.ElementFieldType) {
                            case 2: { _numericValue = self.userCell() !== null ? self.userCell().BooleanValue : 0; break; }
                            case 3: { _numericValue = self.userCell() !== null ? self.userCell().IntegerValue : 0; break; }
                            case 4: { _numericValue = self.userCell() !== null ? self.userCell().DecimalValue : 50; /* Default value? */ break; }
                                // TODO 5 (DateTime?)
                            case 11: { _numericValue = self.numericValueAverage(); break; } // DirectIncome: No need to try user's cell, always return all users', which will be CMRP owner's value
                                // case 12: { value = userCell !== null ? userCell.DecimalValue : 0; break; }
                            default: { throw 'Not supported'; }
                        }

                        break;
                    }
                    case 2: { // All users' ratings

                        _numericValue = self.numericValueAverage();
                        break;
                    }
                }
            });

            // $rootScope.$broadcast('elementValueFilterChanged', self);

            self.userCell = function () {

                if (self._userCell !== null && self._userCell.entityAspect.entityState.isDetached()) {
                    self._userCell = null;
                }

                if (self._userCell === null && self.UserElementCellSet.length !== 0) {
                    self._userCell = self.UserElementCellSet[0];
                }

                return self._userCell;
            }

            self.numericValueAverage = function () {

                // Set other users' value on the initial call
                if (self.otherUsersNumericValue === null) {

                    // TODO NumericValue property directly return 0?
                    self.otherUsersNumericValue = self.NumericValue !== null
                        ? self.NumericValue
                        : 0;

                    if (self.userCell() !== null) {
                        switch (self.ElementField.ElementFieldType) {
                            // TODO Check bool to decimal conversion?
                            case 2: { self.otherUsersNumericValue -= self.userCell().BooleanValue; break; }
                            case 3: { self.otherUsersNumericValue -= self.userCell().IntegerValue; break; }
                            case 4: { self.otherUsersNumericValue -= self.userCell().DecimalValue; break; }
                                // TODO 5 (DateTime?)
                            case 11: { self.otherUsersNumericValue -= self.userCell().DecimalValue; break; }
                                //case 12: { value = userCell !== null ? userCell.DecimalValue : 0; break; }
                            default: {
                                logger.log('self.ElementField.ElementFieldType', self.ElementField.ElementFieldType, false);
                                throw 'Not supported';
                            }
                        }
                    }
                }

                var numericValue = self.otherUsersNumericValue;

                switch (self.ElementField.ElementFieldType) {
                    // TODO Check bool to decimal conversion?
                    case 2: { numericValue += self.userCell() !== null ? self.userCell().BooleanValue : 0; break; }
                    case 3: { numericValue += self.userCell() !== null ? self.userCell().IntegerValue : 0; break; }
                    case 4: { numericValue += self.userCell() !== null ? self.userCell().DecimalValue : 50; break; }
                        // TODO 5 (DateTime?)
                    case 11: { numericValue += self.userCell() !== null ? self.userCell().DecimalValue : 0; break; } // This is not necessary but since 'default' case throws an exception..
                        //case 12: { value = userCell !== null ? userCell.DecimalValue : 0; break; }
                    default: {
                        logger.log('self.ElementField.ElementFieldType', self.ElementField.ElementFieldType, false);
                        throw 'Not supported';
                    }
                }

                return numericValue / self.numericValueCount();
            }

            self.numericValueCount = function () {

                // Set other users' value on the initial call
                if (self.otherUsersNumericValueCount === null) {
                    self.otherUsersNumericValueCount = self.NumericValueCount;

                    if (self.userCell() !== null) {
                        self.otherUsersNumericValueCount--;
                    }
                }

                var count = self.otherUsersNumericValueCount;

                // Increase count in any case, even if the user didn't set any value yet, there is a default value
                count++;

                return count;
            }

            self.numericValue = function () {

                if (_numericValue === null) {

                    if (typeof self.ElementField !== 'undefined') {
                        switch (self.ElementItem.Element.valueFilter) {
                            case 1: { // Only my ratings

                                switch (self.ElementField.ElementFieldType) {
                                    case 2: { _numericValue = self.userCell() !== null ? self.userCell().BooleanValue : 0; break; }
                                    case 3: { _numericValue = self.userCell() !== null ? self.userCell().IntegerValue : 0; break; }
                                    case 4: { _numericValue = self.userCell() !== null ? self.userCell().DecimalValue : 50; /* Default value? */ break; }
                                        // TODO 5 (DateTime?)
                                    case 11: { _numericValue = self.numericValueAverage(); break; } // DirectIncome: No need to try user's cell, always return all users', which will be CMRP owner's value
                                        // case 12: { value = userCell !== null ? userCell.DecimalValue : 0; break; }
                                    default: { throw 'Not supported'; }
                                }

                                break;
                            }
                            case 2: { // All users' ratings

                                _numericValue = self.numericValueAverage();
                                break;
                            }
                        }
                    }
                }

                return _numericValue;
            }

            self.numericValueMultiplied = function () {

                if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled)
                    return 0; // ?

                return self.numericValue() * self.ElementItem.multiplier();
            }

            self.aggressiveRating = function () {

                if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled)
                    return 0; // ?

                var referenceRating = self.ElementField.referenceRatingMultiplied();

                if (referenceRating === 0) {
                    return 0;
                }

                var value = 0;

                switch (self.ElementField.IndexRatingSortType) {
                    case 1: { // LowestToHighest (Low number is better)
                        value = self.numericValueMultiplied() / referenceRating;
                        break;
                    }
                    case 2: { // HighestToLowest (High number is better)
                        value = self.passiveRatingPercentage() / referenceRating;
                        break;
                    }
                }

                return self.ElementField.referenceRatingAllEqualFlag
                    ? value
                    : 1 - value;
            }

            self.aggressiveRatingPercentage = function () {

                if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled)
                    return 0; // ?

                var indexAggressiveRating = self.ElementField.aggressiveRating();

                if (indexAggressiveRating === 0) {
                    return 0; // ?
                }

                return self.aggressiveRating() / indexAggressiveRating;
            }

            // TODO This is obsolete for now and probably not calculating correctly. Check it later, either remove or fix it / SH - 13 Mar. '15
            // TODO Now it's in use again but for a different purpose, rename it? / SH - 24 Mar. '15
            self.passiveRatingPercentage = function () {

                if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled)
                    return 0;

                var fieldNumericValueMultiplied = self.ElementField.numericValueMultiplied();

                // Means there is only one item in the element, always 100%
                if (self.numericValueMultiplied() === fieldNumericValueMultiplied) {
                    return 1;
                }

                if (fieldNumericValueMultiplied === 0) {
                    return 0;
                }

                switch (self.ElementField.IndexRatingSortType) {
                    case 1: { // LowestToHighest (Low number is better)
                        return self.numericValueMultiplied() / fieldNumericValueMultiplied;
                    }
                    case 2: { // HighestToLowest (High number is better)
                        return 1 - (self.numericValueMultiplied() / fieldNumericValueMultiplied);
                    }
                }
            }

            self.indexIncome = function () {

                if (self.ElementField.ElementFieldType === 6 && self.SelectedElementItem !== null) {

                    // item's index income / how many times this item has been selected (used) by higher items
                    // TODO Check whether ParentCellSet gets updated when selecting / deselecting an item
                    return self.SelectedElementItem.totalResourcePoolIncome() / self.SelectedElementItem.ParentCellSet.length;
                } else {

                    if (self.ElementField.IndexEnabled) {
                        return self.ElementField.indexIncome() * self.aggressiveRatingPercentage();
                    } else {
                        return 0;
                    }
                }
            }
        }
    }
})();