﻿import { EventEmitter } from "@angular/core";

import { EntityBase } from "./entity-base";

export class ElementCell extends EntityBase {

    // Public - Server-side
    Id: number = 0;
    ElementFieldId: number = 0;
    ElementItemId: number = 0;
    StringValue: string = ""; // Computed value - Used in: resource-pool-editor.html
    NumericValueTotal: number = 0;
    // Computed value - Used in: setOtherUsersNumericValueTotal, setCurrentUserNumericValue
    NumericValueCount: number = 0; // Computed value - Used in: setOtherUsersNumericValueCount
    SelectedElementItemId: any = null;

    ElementField: any;
    ElementItem: any;
    SelectedElementItem: any;
    UserElementCellSet: any[];

    numericValueUpdated$: EventEmitter<number> = new EventEmitter<number>();

    private fields: {
        // Client-side
        currentUserNumericValue: any,
        otherUsersNumericValueTotal: any,
        otherUsersNumericValueCount: any,
        numericValue: any,
        numericValueMultiplied: any,
        numericValueMultipliedPercentage: any,
        passiveRating: any,
        aggressiveRating: any,
        rating: any,
        ratingPercentage: any,
        indexIncome: any
    } = {
        // Client-side
        currentUserNumericValue: null,
        otherUsersNumericValueTotal: null,
        otherUsersNumericValueCount: null,
        numericValue: null,
        numericValueMultiplied: null,
        numericValueMultipliedPercentage: null,
        passiveRating: null,
        aggressiveRating: null,
        rating: null,
        ratingPercentage: null,
        indexIncome: null
    };

    static initializer(entity: ElementCell) {
        super.initializer(entity);
    }

    aggressiveRating() {
        if (this.fields.aggressiveRating === null) {
            this.setAggressiveRating(false);
        }

        return this.fields.aggressiveRating;
    }

    currentUserCell() {
        return this.UserElementCellSet.length > 0 ? this.UserElementCellSet[0] : null;
    }

    currentUserNumericValue() {

        if (this.fields.currentUserNumericValue === null) {
            this.setCurrentUserNumericValue(false);
        }

        return this.fields.currentUserNumericValue;
    }

    // TODO This is out of pattern!
    indexIncome() {

        //if (this.fields.indexIncome === null) {
        this.setIndexIncome();
        //}

        return this.fields.indexIncome;
    }

    numericValue() {

        if (this.fields.numericValue === null) {
            this.setNumericValue(false);
        }

        return this.fields.numericValue;
    }

    numericValueAverage() {

        if (this.numericValueCount() === null) {
            return null;
        }

        return this.numericValueCount() === 0 ? 0 : this.numericValueTotal() / this.numericValueCount();
    }

    numericValueCount() {
        return this.ElementField.UseFixedValue
            ? this.currentUserCell() !== null &&
                this.currentUserCell().UserId === this.ElementField.Element.ResourcePool.UserId
                ? // If it belongs to current user
                1
                : this.otherUsersNumericValueCount()
            : this.otherUsersNumericValueCount() + 1; // There is always default value, increase count by 1
    }

    numericValueMultiplied() {

        if (this.fields.numericValueMultiplied === null) {
            this.setNumericValueMultiplied(false);
        }

        return this.fields.numericValueMultiplied;
    }

    numericValueMultipliedPercentage() {
        if (this.fields.numericValueMultipliedPercentage === null) {
            this.setNumericValueMultipliedPercentage(false);
        }

        return this.fields.numericValueMultipliedPercentage;
    }

    numericValueTotal() {
        return this.ElementField.UseFixedValue
            ? this.currentUserCell() !== null &&
                this.currentUserCell().UserId === this.ElementField.Element.ResourcePool.UserId
                ? // If it belongs to current user
                this.currentUserNumericValue()
                : this.otherUsersNumericValueTotal()
            : this.otherUsersNumericValueTotal() + this.currentUserNumericValue();
    }

    // TODO Since this is a fixed value based on NumericValueCount & current user's rate,
    // it could be calculated on server, check it later again / coni2k - 03 Aug. '15
    otherUsersNumericValueCount() {

        // Set other users" value on the initial call
        if (this.fields.otherUsersNumericValueCount === null) {
            this.setOtherUsersNumericValueCount();
        }

        return this.fields.otherUsersNumericValueCount;
    }

    // TODO Since this is a fixed value based on NumericValueTotal & current user's rate,
    // it could be calculated on server, check it later again / coni2k - 03 Aug. '15
    otherUsersNumericValueTotal() {

        // Set other users" value on the initial call
        if (this.fields.otherUsersNumericValueTotal === null) {
            this.setOtherUsersNumericValueTotal();
        }

        return this.fields.otherUsersNumericValueTotal;
    }

    passiveRating() {
        if (this.fields.passiveRating === null) {
            this.setPassiveRating(false);
        }

        return this.fields.passiveRating;
    }

    rating() {

        if (this.fields.rating === null) {
            this.setRating(false);
        }

        return this.fields.rating;
    }

    ratingPercentage() {

        if (this.fields.ratingPercentage === null) {
            this.setRatingPercentage(false);
        }

        return this.fields.ratingPercentage;
    }

    rejectChanges(updateCache?: boolean): void {
        updateCache = typeof updateCache !== "undefined" ? updateCache : true;

        var currentUserElementCell = this.currentUserCell();

        if (currentUserElementCell !== null) {
            currentUserElementCell.entityAspect.rejectChanges();

            if (updateCache) {
                this.setCurrentUserNumericValue();
            }
        }

        this.entityAspect.rejectChanges();
    }

    remove() {

        // Related user cells
        this.removeUserElementCell();

        this.entityAspect.setDeleted();
    }

    removeUserElementCell(updateCache?: any) {
        updateCache = typeof updateCache !== "undefined" ? updateCache : true;

        var currentUserElementCell = this.currentUserCell();

        if (currentUserElementCell !== null) {
            currentUserElementCell.entityAspect.setDeleted();

            if (updateCache) {
                this.setCurrentUserNumericValue();
            }
        }
    }

    // TODO Currently updateRelated is always "false"?
    setAggressiveRating(updateRelated: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: any = 0; // Default value?

        if (this.ElementField.IndexEnabled && this.ElementField.referenceRatingMultiplied() > 0) {
            switch (this.ElementField.IndexSortType) {
                case 1:
                    { // HighestToLowest (High rating is better)
                        value = (1 - this.numericValueMultipliedPercentage()) / this.ElementField.referenceRatingMultiplied();
                        break;
                    }
                case 2:
                    { // LowestToHighest (Low rating is better)
                        value = this.numericValueMultiplied() / this.ElementField.referenceRatingMultiplied();
                        break;
                    }
            }

            if (!this.ElementField.referenceRatingAllEqualFlag()) {
                value = 1 - value;
            }
        }

        if (this.fields.aggressiveRating !== value) {
            this.fields.aggressiveRating = value;

            // Update related values
            if (updateRelated) {
                // TODO ?
            }
        }
    }

    setCurrentUserNumericValue(updateRelated?: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: any;
        var userCell: any = this.currentUserCell();

        switch (this.ElementField.DataType) {
            case 2:
                {
                    value = userCell !== null ? userCell.BooleanValue : 0;
                    break;
                }
            case 3:
                {
                    value = userCell !== null ? userCell.IntegerValue : 0;
                    break;
                }
            case 4:
                {
                    value = userCell !== null ? userCell.DecimalValue : 50; /* Default value? */
                    break;
                }
            // TODO 5 (DateTime?)
            case 11:
                {
                    // DirectIncome: No need to try user's cell, always return all users', which will be CMRP owner's value
                    value = this.NumericValueTotal !== null ? this.NumericValueTotal : 0;
                    break;
                }
            case 12:
                {
                    value = userCell !== null ? userCell.DecimalValue : 0; /* Default value? */
                    break;
                }
            // default: { throw "currentUserNumericValue() - Not supported element field type: " + this.ElementField.DataType; }
        }

        if (this.fields.currentUserNumericValue !== value) {
            this.fields.currentUserNumericValue = value;

            // Update related
            if (updateRelated) {
                this.setNumericValue();
            }
        }
    }

    setIndexIncome(updateRelated?: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: any = 0; // Default value?

        if (this.ElementField.DataType === 6 && this.SelectedElementItem !== null) {
            // item's index income / how many times this item has been selected (used) by higher items
            // TODO Check whether ParentCellSet gets updated when selecting / deselecting an item
            value = this.SelectedElementItem.totalResourcePoolIncome() / this.SelectedElementItem.ParentCellSet.length;
        } else {
            if (this.ElementField.IndexEnabled) {
                value = this.ElementField.indexIncome() * this.ratingPercentage();
            }
        }

        if (this.fields.indexIncome !== value) {
            this.fields.indexIncome = value;

            // TODO Update related?
            // item.totalResourcePoolIncome
        }
    }

    setNumericValue(updateRelated?: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: any;

        if (typeof this.ElementField !== "undefined") {
            switch (this.ElementField.Element.ResourcePool.RatingMode) {
                case 1:
                    {
                        value = this.currentUserNumericValue();
                        break;
                    } // Current user's
                case 2:
                    {
                        value = this.numericValueAverage();
                        break;
                    } // All
            }

        }

        // If it's different...
        if (this.fields.numericValue !== value) {
            this.fields.numericValue = value;

            // Update related
            if (updateRelated) {

                if (this.ElementField.DataType === 11) {
                    this.ElementItem.setDirectIncome();
                }

                this.setNumericValueMultiplied();
            }

            this.numericValueUpdated$.emit(this.fields.numericValue);
        }
    }

    setNumericValueMultiplied(updateRelated?: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: any;

        // if (typeof this.ElementField === "undefined" || !this.ElementField.IndexEnabled) {
        if (typeof this.ElementField === "undefined") {
            value = 0; // ?
        } else {
            value = this.numericValue() * this.ElementItem.multiplier();
            //logger.log(this.ElementField.Name[0] + "-" + this.ElementItem.Name[0] + " NVMA " + this.numericValue());
            //logger.log(this.ElementField.Name[0] + "-" + this.ElementItem.Name[0] + " NVMB " + this.ElementItem.multiplier());
        }

        if (this.fields.numericValueMultiplied !== value) {
            this.fields.numericValueMultiplied = value;

            // Update related
            if (updateRelated) {
                this.ElementField.setNumericValueMultiplied();
            }

            // IMPORTANT REMARK: If the field is using IndexSortType 1,
            // then it would be better to directly call field.setReferenceRatingMultiplied() method.
            // It would be quicker to calculate.
            // However, since field.setNumericValueMultiplied() will make "numericValueMultipliedPercentage" calculations
            // which meanwhile will call referenceRatingMultiplied() method anyway. So it becomes redundant.
            // This code block could possibly be improved with a IndexSortType switch case,
            // but it seems it would be bit overkill.
            // Still something to think about it later? / coni2k - 22 Oct. '15
            //this.ElementField.setReferenceRatingMultiplied();
        }
    }

    setNumericValueMultipliedPercentage(updateRelated: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: any = 0;

        if (this.ElementField.IndexEnabled && this.ElementField.numericValueMultiplied() > 0) {
            value = this.numericValueMultiplied() / this.ElementField.numericValueMultiplied();
        }

        if (this.fields.numericValueMultipliedPercentage !== value) {
            this.fields.numericValueMultipliedPercentage = value;

            // Update related
            if (updateRelated) {
                // TODO ?
            }
        }
    }

    setOtherUsersNumericValueCount() {
        this.fields.otherUsersNumericValueCount = this.NumericValueCount;

        // Exclude current user's
        if (this.UserElementCellSet.length > 0) {
            this.fields.otherUsersNumericValueCount--;
        }
    }

    setOtherUsersNumericValueTotal() {

        this.fields.otherUsersNumericValueTotal = this.NumericValueTotal !== null ? this.NumericValueTotal : 0;

        // Exclude current user's
        if (this.UserElementCellSet.length > 0) {

            var userValue: any = 0;
            switch (this.ElementField.DataType) {
                // TODO Check bool to decimal conversion?
                case 2:
                    {
                        userValue = this.UserElementCellSet[0].BooleanValue;
                        break;
                    }
                case 3:
                    {
                        userValue = this.UserElementCellSet[0].IntegerValue;
                        break;
                    }
                case 4:
                    {
                        userValue = this.UserElementCellSet[0].DecimalValue;
                        break;
                    }
                // TODO 5 - DateTime?
                case 11:
                    {
                        userValue = this.UserElementCellSet[0].DecimalValue;
                        break;
                    }
                // TODO 12 - Multiplier?
                //default: {
                //    throw "setOtherUsersNumericValueTotal - Not supported element field type: " + this.ElementField.DataType;
                //}
            }

            this.fields.otherUsersNumericValueTotal -= userValue;
        }
    }

    setPassiveRating(updateRelated: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: any = 0;

        if (this.ElementField.IndexEnabled) {

            switch (this.ElementField.IndexSortType) {
                case 1:
                    { // HightestToLowest (High rating is better)
                        value = this.numericValueMultipliedPercentage();
                        break;
                    }
                case 2:
                    { // LowestToHighest (Low rating is better)
                        if (this.ElementField.passiveRating() > 0) {
                            value = (1 - this.numericValueMultipliedPercentage()) / this.ElementField.passiveRating();
                        }
                        break;
                    }
            }
        }

        if (this.fields.passiveRating !== value) {
            this.fields.passiveRating = value;

            // Update related
            if (updateRelated) {
                // TODO ?
            }
        }
    }

    setRating(updateRelated: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: any = 0;

        // If there is only one item, then always %100
        if (this.ElementField.ElementCellSet.length === 1) {
            value = 1;
        } else {
            switch (this.ElementField.IndexCalculationType) {
                case 1: // Aggressive rating
                    {
                        value = this.aggressiveRating();
                        break;
                    }
                case 2: // Passive rating
                    {
                        value = this.passiveRating();
                        break;
                    }
            }
        }

        if (this.fields.rating !== value) {
            this.fields.rating = value;

            // Update related
            if (updateRelated) {
                // TODO ?
            }
        }
    }

    setRatingPercentage(updateRelated: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: any = 0;

        if (this.ElementField.IndexEnabled && this.ElementField.rating() > 0) {
            value = this.rating() / this.ElementField.rating();
        }

        if (this.fields.ratingPercentage !== value) {
            this.fields.ratingPercentage = value;

            // Update related
            if (updateRelated) {
                // TODO ?
            }
        }
    }

    value() {

        var value: any = null;
        //var currentUserCell: any = this.UserElementCellSet.length > 0
        //    ? this.UserElementCellSet[0]
        //    : null;

        switch (this.ElementField.DataType) {
            case 1:
                {
                    if (this.UserElementCellSet.length > 0) {
                        value = this.UserElementCellSet[0].StringValue;
                    }
                    break;
                }
            case 2:
                {
                    if (this.UserElementCellSet.length > 0) {
                        value = this.UserElementCellSet[0].BooleanValue ? "True" : "False";
                    }
                    break;
                }
            case 3:
                {
                    if (this.UserElementCellSet.length > 0) {
                        value = this.UserElementCellSet[0].IntegerValue;
                    }
                    break;
                }
            // TODO 5 (DateTime?)
            case 4:
            case 11:
            case 12:
                {
                    if (this.UserElementCellSet.length > 0) {
                        value = this.UserElementCellSet[0].DecimalValue;
                    }
                    break;
                }
            case 6:
                {
                    if (this.SelectedElementItem !== null) {
                        value = this.SelectedElementItem.Name;
                    }
                }
        }

        return value;
    }
}
