﻿(function () {
    'use strict';

    var serviceId = 'element';
    angular.module('main')
        .factory(serviceId, ['logger', element]);

    function element(logger) {

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
            var _parent = null;
            var _parents = [];
            var _elementFieldIndexSet = [];
            var _resourcePoolField = null;
            var _multiplierField = null;

            // UI related: Determines whether the chart & element details will use full row (col-md-4 vs col-md-12 etc.)
            self.fullSize = function () {
                return (typeof self.ElementFieldSet !== 'undefined'
                    && self.ElementFieldSet.length > 4)
                    || self.elementFieldIndexSet().length > 2;
            }

            self.parent = function () {

                // Cached value
                // TODO In case of add / remove fields?
                if (_parent !== null) {
                    return _parent;
                }

                _parent = self;
                if (_parent.ParentFieldSet.length > 0) {
                    _parent = _parent.ParentFieldSet[0].Element;
                }

                return _parent;
            }

            self.parents = function () {

                // Cached value
                // TODO In case of add / remove elements?
                if (_parents.length > 0) {
                    return _parents;
                }

                var element = null;
                do {

                    element = element === null
                        ? self
                        : element.parent();

                    _parents.unshift(element);

                } while (element !== element.parent());

                return _parents;
            }

            // Value filter
            self.valueFilter = 1;
            self.toggleValueFilter = function () {
                self.valueFilter = self.valueFilter === 1 ? 2 : 1;
            }
            self.valueFilterText = function () {
                return self.valueFilter === 1 ? "Only My Ratings" : "All Ratings";
            }

            self.elementFieldIndexSet = function () {

                // Cached value
                // TODO In case of add / remove fields?
                if (_elementFieldIndexSet.length > 0) {
                    return _elementFieldIndexSet;
                }

                _elementFieldIndexSet = getElementFieldIndexSet(self);

                return _elementFieldIndexSet;
            }

            function getElementFieldIndexSet(element) {

                // Validate
                if (typeof self.ElementFieldSet === 'undefined')
                    return 0;

                var indexSet = [];

                for (var i = 0; i < element.ElementFieldSet.length; i++) {
                    var field = element.ElementFieldSet.sort(function (a, b) { return a.SortOrder - b.SortOrder; })[i];

                    if (field.ElementFieldIndexSet.length > 0) {
                        indexSet.push(field.ElementFieldIndexSet[0]);
                    }

                    if (field.ElementFieldType === 6) {
                        var childIndexSet = getElementFieldIndexSet(field.SelectedElement);

                        for (var x = 0; x < childIndexSet.length; x++) {
                            indexSet.push(childIndexSet[x]);
                        }

                        // indexSet = indexSet.concat(childIndexSet);
                    }
                }

                return indexSet;
            }

            self.resourcePoolField = function () {

                // Cached value
                // TODO In case of add / remove fields?
                if (_resourcePoolField)
                    return _resourcePoolField;

                // Validate
                if (typeof self.ElementFieldSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var field = self.ElementFieldSet[i];
                    if (field.ElementFieldType === 11) {
                        _resourcePoolField = field;
                        break;
                    }
                }

                return _resourcePoolField;
            }

            self.multiplierField = function () {

                // Cached value
                // TODO In case of add / remove field?
                if (_multiplierField)
                    return _multiplierField;

                // Validate
                if (typeof self.ElementFieldSet === 'undefined')
                    return null;

                for (var i = 0; i < self.ElementFieldSet.length; i++) {
                    var field = self.ElementFieldSet[i];
                    if (field.ElementFieldType === 12) {
                        _multiplierField = field;
                        break;
                    }
                }

                return _multiplierField;
            }

            self.resourcePoolValue = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.resourcePoolValue();
                }

                return value;
            }

            self.multiplierValue = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.multiplierValue();
                }

                return value;
            }

            self.indexRating = function () {

                // TODO Check totalIncome notes

                var indexSet = self.elementFieldIndexSet();

                var value = 0;
                for (var i = 0; i < indexSet.length; i++) {
                    value += indexSet[i].indexRating();
                }

                return value;
            }

            self.resourcePoolValueMultiplied = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.resourcePoolValueMultiplied();
                }

                return value;
            }

            self.resourcePoolAddition = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.resourcePoolAddition();
                }

                return value;
            }

            self.resourcePoolAdditionMultiplied = function () {

                // TODO Check totalIncome notes

                if (self.IsMainElement) {

                    // Validate
                    if (typeof self.ElementItemSet === 'undefined')
                        return 0;

                    var value = 0;
                    for (var i = 0; i < self.ElementItemSet.length; i++) {
                        var item = self.ElementItemSet[i];
                        value += item.resourcePoolAdditionMultiplied();
                    }
                } else {
                    if (self.ResourcePool.mainElement() !== null) {
                        value = self.ResourcePool.mainElement().resourcePoolAdditionMultiplied();
                    }
                }

                return value;
            }

            self.resourcePoolValueIncludingAddition = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.resourcePoolValueIncludingAddition();
                }

                return value;
            }

            self.resourcePoolValueIncludingAdditionMultiplied = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.resourcePoolValueIncludingAdditionMultiplied();
                }

                return value;
            }

            self.indexIncome = function () {

                // TODO Check totalIncome notes

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.indexIncome();
                }

                return value;
            }

            self.totalIncome = function () {

                // TODO If elementItems could set their parent element's totalIncome when their totalIncome changes, it wouldn't be necessary to sum this result everytime?

                // Validate
                if (typeof self.ElementItemSet === 'undefined')
                    return 0;

                var value = 0;
                for (var i = 0; i < self.ElementItemSet.length; i++) {
                    var item = self.ElementItemSet[i];
                    value += item.totalIncome();
                }

                return value;
            }

            self.totalIncomeAverage = function () {
                
                // Validate
                if (typeof self.ElementItemSet === 'undefined' || self.ElementItemSet.length === 0) {
                    return 0;
                }

                return self.totalIncome() / self.ElementItemSet.length;
            }
        }
    }
})();