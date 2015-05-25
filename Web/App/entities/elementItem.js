﻿(function () {
    'use strict';

    var serviceId = 'elementItem';
    angular.module('main')
        .factory(serviceId, ['logger', elementItem]);

    function elementItem(logger) {

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

            // Local variables
            var _elementCellIndexSet = [];
            var _elementCellIndexSet2 = [];
            var _directIncomeCell = null;
            var _multiplierCell = null;

            self.elementCellIndexSet2 = function () {

                // Cached value
                // TODO In case of add / remove fields?
                if (_elementCellIndexSet2.length > 0) {
                    return _elementCellIndexSet2;
                }

                _elementCellIndexSet2 = getElementCellIndexSet2(self);

                return _elementCellIndexSet2;
            }

            function getElementCellIndexSet2(elementItem) {





                var indexSet = [];
                

                for (var i = 0; i < elementItem.ElementCellSet.length; i++) {
                    var cell = elementItem.ElementCellSet.sort(function (a, b) { return a.ElementField.SortOrder - b.ElementField.SortOrder; })[i];

                    if (cell.ElementField.ElementFieldIndexSet.length > 0) {
                        indexSet.push(cell);
                    }

                    if (cell.ElementField.ElementFieldType === 6) {
                        var childIndexSet = getElementCellIndexSet2(cell.SelectedElementItem);

                        if (childIndexSet.length > 0) {
                            // indexSet = indexSet.concat(childIndexSet);
                            // indexSet.push(cell);
                            indexSet.push(cell);
                        }
                    }
                }

                return indexSet;
            }

            self.elementCellIndexSet = function () {

                // Cached value
                // TODO In case of add / remove fields?
                if (_elementCellIndexSet.length > 0) {
                    return _elementCellIndexSet;
                }

                _elementCellIndexSet = getElementCellIndexSet(self);

                return _elementCellIndexSet;
            }

            function getElementCellIndexSet(elementItem) {

                var indexSet = [];

                for (var i = 0; i < elementItem.ElementCellSet.length; i++) {
                    var cell = elementItem.ElementCellSet[i];

                    if (cell.ElementField.ElementFieldIndexSet.length > 0) {
                        indexSet.push(cell);
                    }

                    if (cell.ElementField.ElementFieldType === 6) {
                        var childIndexSet = getElementCellIndexSet(cell.SelectedElementItem);
                        indexSet = indexSet.concat(childIndexSet);
                    }
                }

                return indexSet;
            }

            self.directIncomeCell = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (_directIncomeCell) {
                    return _directIncomeCell;
                }

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    if (cell.ElementField.ElementFieldType === 11) {
                        _directIncomeCell = cell;
                        break;
                    }
                }

                return _directIncomeCell;
            }

            self.multiplierCell = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (_multiplierCell !== null) {
                    return _multiplierCell;
                }

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    if (cell.ElementField.ElementFieldType === 12) {
                        _multiplierCell = cell;
                        break;
                    }
                }

                return _multiplierCell;
            }

            // TODO Compare this function with server-side
            self.directIncome = function () {

                if (self.directIncomeCell() === null || self.directIncomeCell().DecimalValue === null)
                    return 0;

                return self.directIncomeCell().DecimalValue;
            }

            // TODO Compare this function with server-side
            self.multiplier = function () {

                if (self.multiplierCell() === null
                    || self.multiplierCell().userElementCell() === null
                    || self.multiplierCell().userElementCell().DecimalValue === null) {

                    // TODO Something wrong with the usage of this function, when this default value is 0, Index Income fails
                    // Probably Index Income is calculated based on its own element, instead of Main Element's multiplier!
                    return 1; // Default value

                }

                return self.multiplierCell().userElementCell().DecimalValue;
            }

            self.totalDirectIncome = function () {
                return self.directIncome() * self.multiplier();
            }

            self.resourcePoolAmount = function () {
                return self.directIncome() * self.Element.ResourcePool.resourcePoolRatePercentage();
            }

            self.totalResourcePoolAmount = function () {
                return self.resourcePoolAmount() * self.multiplier();
            }

            self.directIncomeIncludingResourcePoolAmount = function () { // A.k.a Sales Price incl. VAT
                return self.directIncome() + self.resourcePoolAmount();
            }

            self.totalDirectIncomeIncludingResourcePoolAmount = function () { // A.k.a Total Sales Price incl. VAT
                return self.directIncomeIncludingResourcePoolAmount() * self.multiplier();
            }

            self.totalResourcePoolIncome = function () {

                // Validate
                if (typeof self.ElementCellSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementCellSet.length; i++) {
                    var cell = self.ElementCellSet[i];
                    value += cell.indexIncome();
                }

                return value;
            }

            self.totalIncome = function () {
                return self.totalDirectIncome() + self.totalResourcePoolIncome();
            }

            self.incomeStatus = function () {

                if (self.totalIncome() < self.Element.totalIncomeAverage()) {
                    return 'low';
                } else if (self.totalIncome() === self.Element.totalIncomeAverage()) {
                    return 'average';
                } else if (self.totalIncome() > self.Element.totalIncomeAverage()) {
                    return 'high';
                };
            }
        }
    }
})();