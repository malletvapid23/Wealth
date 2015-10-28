﻿(function () {
    'use strict';

    var serviceId = 'UserElementCell';
    angular.module('main')
        .factory(serviceId, ['logger', userElementCellFactory]);

    function userElementCellFactory(logger) {

        // Logger
        logger = logger.forSource(serviceId);

        // Properties
        Object.defineProperty(UserElementCell.prototype, 'DecimalValue', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._DecimalValue; },
            set: function (value) {
                if (this.backingFields._DecimalValue !== value) {
                    this.backingFields._DecimalValue = value;
                }
            }
        });

        // Return
        return UserElementCell;

        /*** Implementations ***/

        function UserElementCell() {

            var self = this;

            self.backingFields = {
                _DecimalValue: null
            };
        }
    }
})();