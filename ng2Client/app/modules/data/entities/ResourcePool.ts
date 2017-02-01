﻿export class ResourcePool {

    // Server-side
    Id: number = 0;
    UserId: number = 0;
    get Name(): string {
        return this.fields.name;
    }
    set Name(value: string) {

        var oldStripped = this.stripInvalidChars(this.fields.name);

        if (this.fields.name !== value) {
            this.fields.name = value;

            // If "Key" is not a custom value (generated through Name), then keep updating it
            if (this.Key === oldStripped) {
                this.Key = value;
            }
        }
    }
    get Key(): string {
        return this.fields.key;
    }
    set Key(value: string) {
        var newValue = this.stripInvalidChars(value);

        if (this.fields.key !== newValue) {
            this.fields.key = newValue;
        }
    }
    get UseFixedResourcePoolRate(): number {
        return this.fields.useFixedResourcePoolRate;
    }
    set UseFixedResourcePoolRate(value: number) {
        if (this.fields.useFixedResourcePoolRate !== value) {
            this.fields.useFixedResourcePoolRate = value;

            this.setResourcePoolRate();
        }
    }
    InitialValue: number = 0;
    ResourcePoolRateTotal: number = 0; // Computed value - Used in: setOtherUsersResourcePoolRateTotal
    ResourcePoolRateCount: number = 0; // Computed value - Used in: setOtherUsersResourcePoolRateCount
    RatingCount: number = 0; // Computed value - Used in: resource-pool-editor.html
    // TODO breezejs - Cannot assign a navigation property in an entity ctor
    //User = null;
    //ElementSet = [];
    //UserResourcePoolSet = [];

    // TODO Move this to field.js?
    displayMultiplierFunctions = true; // In some cases, it's not necessary for the user to change multiplier

    get RatingMode(): any {
        return this.fields.ratingMode;
    }
    set RatingMode(value: any) {

        if (this.fields.ratingMode !== value) {
            this.fields.ratingMode = value;

            this.setResourcePoolRate();

            (this as any).ElementSet.forEach((element: any) => {

                element.ElementFieldSet.forEach((field: any) => {

                    // Field calculations
                    if (field.IndexEnabled) {
                        field.setIndexRating();
                    }

                    if (!field.UseFixedValue) {
                        field.ElementCellSet.forEach((cell: any) => {

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
                        });
                    }
                });
            });
        }
    }

    private fields: {
        currentUserResourcePoolRate: any,
        isAdded: boolean,
        key: string,
        name: string,
        otherUsersResourcePoolRateTotal: any,
        otherUsersResourcePoolRateCount: any,
        ratingMode: any, // Only my ratings vs. All users" ratings
        resourcePoolRate: any,
        resourcePoolRatePercentage: any,
        selectedElement: any,
        useFixedResourcePoolRate: any
    } = {
        currentUserResourcePoolRate: null,
        isAdded: false,
        key: "",
        name: "",
        otherUsersResourcePoolRateTotal: null,
        otherUsersResourcePoolRateCount: null,
        ratingMode: 1, // Only my ratings vs. All users" ratings
        resourcePoolRate: null,
        resourcePoolRatePercentage: null,
        selectedElement: null,
        useFixedResourcePoolRate: false
    };

    _init(setComputedFields: any) {
        setComputedFields = typeof setComputedFields !== "undefined" ? setComputedFields : false;

        // Set initial values of computed fields
        if (setComputedFields) {

            var userRatings: any[] = [];

            // ResourcePool
            (this as any).UserResourcePoolSet.forEach((userResourcePool: any) => {
                this.ResourcePoolRateTotal += userResourcePool.ResourcePoolRate;
                this.ResourcePoolRateCount += 1;

                if (userRatings.indexOf(userResourcePool.UserId) === -1) {
                    userRatings.push(userResourcePool.UserId);
                }
            });

            // Fields
            (this as any).ElementSet.forEach((element: any) => {
                element.ElementFieldSet.forEach((elementField: any) => {
                    elementField.UserElementFieldSet.forEach((userElementField: any) => {
                        elementField.IndexRatingTotal += userElementField.IndexRating;
                        elementField.IndexRatingCount += 1;

                        if (userRatings.indexOf(userElementField.UserId) === -1) {
                            userRatings.push(userElementField.UserId);
                        }
                    });

                    // Cells
                    elementField.ElementCellSet.forEach((elementCell: any) => {
                        elementCell.UserElementCellSet.forEach((userElementCell: any) => {
                            elementCell.StringValue = ""; // TODO ?
                            elementCell.NumericValueTotal += userElementCell.DecimalValue; // TODO Correct approach?
                            elementCell.NumericValueCount += 1;

                            if (elementField.IndexEnabled) {
                                if (userRatings.indexOf(userElementCell.UserId) === -1) {
                                    userRatings.push(userElementCell.UserId);
                                }
                            }
                        });
                    });
                });
            });

            // Rating count
            this.RatingCount = userRatings.length;
        }

        // Set otherUsers" data
        this.setOtherUsersResourcePoolRateTotal();
        this.setOtherUsersResourcePoolRateCount();

        // Elements
        if (typeof (this as any).ElementSet !== "undefined") {
            (this as any).ElementSet.forEach((element: any) => {

                // Fields
                if (typeof element.ElementFieldSet !== "undefined") {
                    element.ElementFieldSet.forEach((field: any) => {

                        field.setOtherUsersIndexRatingTotal();
                        field.setOtherUsersIndexRatingCount();

                        // Cells
                        if (typeof field.ElementCellSet !== "undefined") {
                            field.ElementCellSet.forEach((cell: any) => {

                                cell.setOtherUsersNumericValueTotal();
                                cell.setOtherUsersNumericValueCount();
                            });
                        }
                    });
                }
            });
        }

        this.updateCache();
    }

    currentUserResourcePool() {
        return (this as any).UserResourcePoolSet.length > 0 ?
            (this as any).UserResourcePoolSet[0] :
            null;
    }

    currentUserResourcePoolRate() {

        if (this.fields.currentUserResourcePoolRate === null) {
            this.setCurrentUserResourcePoolRate(false);
        }

        return this.fields.currentUserResourcePoolRate;
    }

    displayResourcePoolDetails() {
        return this.selectedElement().directIncomeField() !== null &&
            this.selectedElement().elementFieldIndexSet().length > 0;
    }

    // Checks whether resource pool has any item that can be rateable
    // Obsolete: Replaced with RatingCount > 0 / coni2k - 21 Feb. '16
    displayRatingMode() {

        // Check resource pool level first
        if (!this.UseFixedResourcePoolRate) {
            return true;
        }

        // Field index level
        for (var elementIndex = 0; elementIndex < (this as any).ElementSet.length; elementIndex++) {
            var element = (this as any).ElementSet[elementIndex];

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

    mainElement() {
        var result = (this as any).ElementSet.filter((element: any) => element.IsMainElement);

        return result.length > 0 ? result[0] : null;
    }

    // TODO Since this is a fixed value based on ResourcePoolRateCount & current user's rate,
    // it could be calculated on server, check it later again / coni2k - 03 Aug. '15
    otherUsersResourcePoolRateCount() {

        // Set other users" value on the initial call
        if (this.fields.otherUsersResourcePoolRateCount === null) {
            this.setOtherUsersResourcePoolRateCount();
        }

        return this.fields.otherUsersResourcePoolRateCount;
    }

    // TODO Since this is a fixed value based on ResourcePoolRateTotal & current user's rate,
    // it could be calculated on server, check it later again / coni2k - 03 Aug. '15
    otherUsersResourcePoolRateTotal() {

        // Set other users" value on the initial call
        if (this.fields.otherUsersResourcePoolRateTotal === null) {
            this.setOtherUsersResourcePoolRateTotal();
        }

        return this.fields.otherUsersResourcePoolRateTotal;
    }

    resourcePoolRate() {

        if (this.fields.resourcePoolRate === null) {
            this.setResourcePoolRate(false);
        }

        return this.fields.resourcePoolRate;
    }

    resourcePoolRateAverage() {

        if (this.resourcePoolRateCount() === null) {
            return null;
        }

        return this.resourcePoolRateCount() === 0 ?
            0 :
            this.resourcePoolRateTotal() / this.resourcePoolRateCount();
    }

    resourcePoolRateCount() {
        return this.UseFixedResourcePoolRate ?
            this.currentUserResourcePool() !== null && this.currentUserResourcePool().UserId === this.UserId ? // If it belongs to current user
                1 :
                this.otherUsersResourcePoolRateCount() :
            this.otherUsersResourcePoolRateCount() + 1; // There is always default value, increase count by 1
    }

    resourcePoolRatePercentage() {

        if (this.fields.resourcePoolRatePercentage === null) {
            this.setResourcePoolRatePercentage(false);
        }

        return this.fields.resourcePoolRatePercentage;
    }

    resourcePoolRateTotal() {
        return this.UseFixedResourcePoolRate ?
            this.currentUserResourcePool() !== null && this.currentUserResourcePool().UserId === this.UserId ? // If it belongs to current user
                this.currentUserResourcePoolRate() :
                this.otherUsersResourcePoolRateTotal() :
            this.otherUsersResourcePoolRateTotal() + this.currentUserResourcePoolRate();
    }

    selectedElement(value?: any) {

        // Set new value
        if (typeof value !== "undefined" && this.fields.selectedElement !== value) {
            this.fields.selectedElement = value;
        }

        // If there is no existing value (initial state), use mainElement() as the selected
        if (this.fields.selectedElement === null && this.mainElement()) {
            this.fields.selectedElement = this.mainElement();
        }

        return this.fields.selectedElement;
    }

    setCurrentUserResourcePoolRate(updateRelated?: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = this.currentUserResourcePool() !== null ?
            this.currentUserResourcePool().ResourcePoolRate :
            10; // Default value?

        if (this.fields.currentUserResourcePoolRate !== value) {
            this.fields.currentUserResourcePoolRate = value;

            // Update related
            if (updateRelated) {
                this.setResourcePoolRate();
            }
        }
    }

    setOtherUsersResourcePoolRateCount() {

        this.fields.otherUsersResourcePoolRateCount = this.ResourcePoolRateCount;

        // Exclude current user's
        if (this.currentUserResourcePool() !== null) {
            this.fields.otherUsersResourcePoolRateCount--;
        }
    }

    setOtherUsersResourcePoolRateTotal() {
        this.fields.otherUsersResourcePoolRateTotal = this.ResourcePoolRateTotal !== null ?
            this.ResourcePoolRateTotal :
            0;

        // Exclude current user's
        if (this.currentUserResourcePool() !== null) {
            this.fields.otherUsersResourcePoolRateTotal -= this.currentUserResourcePool().ResourcePoolRate;
        }
    }

    setResourcePoolRate(updateRelated?: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value: any;

        if (this.UseFixedResourcePoolRate) {
            value = this.resourcePoolRateAverage();
        } else {
            switch (this.RatingMode) {
                case 1: { value = this.currentUserResourcePoolRate(); break; } // Current user's
                case 2: { value = this.resourcePoolRateAverage(); break; } // All
            }
        }

        if (this.fields.resourcePoolRate !== value) {
            this.fields.resourcePoolRate = value;

            // Update related
            if (updateRelated) {
                this.setResourcePoolRatePercentage();
            }
        }
    }

    setResourcePoolRatePercentage(updateRelated?: any) {
        updateRelated = typeof updateRelated === "undefined" ? true : updateRelated;

        var value = this.resourcePoolRate() === 0 ?
            0 :
            this.resourcePoolRate() / 100;

        if (this.fields.resourcePoolRatePercentage !== value) {
            this.fields.resourcePoolRatePercentage = value;

            // Update related
            if (updateRelated) {
                (this as any).ElementSet.forEach((element: any) => {

                    element.ElementItemSet.forEach((item: any) => {
                        item.setResourcePoolAmount();
                    });
                });
            }
        }
    }

    stripInvalidChars(value: string) {

        // Trim, remove special chars and replace space with dash
        if (value !== null) {
            value = value.trim()
                .replace(/[^-\w\s]/gi, "")
                .replace(/\s+/g, "-");
        }

        return value;
    }

    toggleRatingMode() {
        this.RatingMode = this.RatingMode === 1 ? 2 : 1;
    }

    // TODO Most of these functions are related with userService.js - updateX functions
    // Try to merge these two - Actually try to handle these actions within the related entity / coni2k - 27 Nov. '15
    updateCache() {

        var isUnchanged = false;

        this.setCurrentUserResourcePoolRate();

        // Elements
        if (typeof (this as any).ElementSet !== "undefined") {
            (this as any).ElementSet.forEach((element: any) => {

                // TODO Review this later / coni2k - 24 Nov. '15
                element.setElementFieldIndexSet();

                // Fields
                if (typeof element.ElementFieldSet !== "undefined") {
                    element.ElementFieldSet.forEach((field: any) => {

                        if (field.IndexEnabled) {
                            // TODO Actually index rating can't be set through resourcePoolEdit page and no need to update this cache
                            // But still keep it as a reminder? / coni2k - 29 Nov. '15
                            field.setCurrentUserIndexRating();
                        }

                        // Cells
                        if (typeof field.ElementCellSet !== "undefined") {
                            field.ElementCellSet.forEach((cell: any) => {

                                switch (cell.ElementField.DataType) {
                                    case 1: {
                                        // TODO Again what a mess!
                                        // StringValue is a computed value, it should normally come from the server
                                        // But in case resource pool was just created, then it should be directly set like this.
                                        // Otherwise, it doesn't show its value on editor.
                                        // And on top of it, since it changes, breeze thinks that "cell" is modified and tries to send it server
                                        // which results an error. So that's why modified check & acceptChanges parts were added.
                                        // coni2k - 01 Dec. '15
                                        if (cell.UserElementCellSet.length > 0) {
                                            isUnchanged = cell.entityAspect.entityState.isUnchanged();
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
                                            // Which is actually not correct but till that its fixed, update it like this / coni2k - 29 Nov. '15
                                            // Also check "What a mess" of StringValue
                                            if (cell.UserElementCellSet.length > 0) {
                                                isUnchanged = cell.entityAspect.entityState.isUnchanged();
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
                            });
                        }
                    });
                }
            });
        }
    }
}
