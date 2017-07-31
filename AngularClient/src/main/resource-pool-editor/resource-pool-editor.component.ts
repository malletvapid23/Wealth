﻿import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import { Options } from "highcharts";

import { Element } from "../app-entity-manager/entities/element";
import { ElementCell } from "../app-entity-manager/entities/element-cell";
import { ElementField, ElementFieldDataType } from "../app-entity-manager/entities/element-field";
import { IUniqueKey, ResourcePool, RatingMode } from "../app-entity-manager/entities/resource-pool";
import { User } from "../app-entity-manager/entities/user";
import { ChartConfig, ChartDataItem } from "../ng-chart/ng-chart.module";
import { ResourcePoolEditorService } from "./resource-pool-editor.service";

@Component({
    selector: "resource-pool-editor",
    styleUrls: ["resource-pool-editor.component.css"],
    templateUrl: "resource-pool-editor.component.html"
})
export class ResourcePoolEditorComponent implements OnDestroy, OnInit {

    constructor(private resourcePoolEditorService: ResourcePoolEditorService,
        private router: Router) {
    }

    @Input() config: any = { resourcePoolKey: "", username: "" };
    chartConfig: ChartConfig = null;
    currentUser: User = null;
    displayChart: boolean = false;
    displayDescription: boolean = false;
    displayIndexDetails = false;
    ElementFieldDataType = ElementFieldDataType;
    elementItemsSortField = "name";
    errorMessage: string = "";
    get isBusy(): boolean {
        return this.resourcePoolEditorService.isBusy;
    }
    RatingMode = RatingMode;
    resourcePool: ResourcePool = null;
    resourcePoolKey = "";
    get resourcePoolUniqueKey(): IUniqueKey {
        return { username: this.username, resourcePoolKey: this.resourcePoolKey };
    }
    saveStream = new Subject();
    subscriptions: Subscription[] = [];
    username = "";

    changeSelectedElement(element: Element) {
        this.resourcePool.selectedElement(element);
        this.loadChartData();
    }

    decreaseElementMultiplier(element: Element) {
        this.resourcePoolEditorService.updateElementMultiplier(element, "decrease");
        this.saveStream.next();
    }

    decreaseIndexRating(field: ElementField) {
        this.resourcePoolEditorService.updateElementFieldIndexRating(field, "decrease");
        this.saveStream.next();
    }

    decreaseResourcePoolRate() {
        this.resourcePoolEditorService.updateResourcePoolRate(this.resourcePool, "decrease");
        this.saveStream.next();
    }

    increaseElementMultiplier(element: Element) {
        this.resourcePoolEditorService.updateElementMultiplier(element, "increase");
        this.saveStream.next();
    }

    increaseIndexRating(field: ElementField) {
        this.resourcePoolEditorService.updateElementFieldIndexRating(field, "increase");
        this.saveStream.next();
    }

    increaseResourcePoolRate() {
        this.resourcePoolEditorService.updateResourcePoolRate(this.resourcePool, "increase");
        this.saveStream.next();
    }

    initialize(username: string, resourcePoolKey: string, user: User) {

        // If there is no change, no need to continue
        if (this.username === username && this.resourcePoolKey === resourcePoolKey && this.currentUser === user) {
            return;
        }

        this.username = username;
        this.resourcePoolKey = resourcePoolKey;
        this.currentUser = user;

        // Clear previous error messages
        this.errorMessage = "";

        // Validate
        if (this.username === "" || this.resourcePoolKey === "") {
            this.errorMessage = "CMRP Id cannot be null";
            return;
        }

        // Get resource pool
        this.resourcePoolEditorService.getResourcePoolExpanded(this.resourcePoolUniqueKey)
            .subscribe((resourcePool: ResourcePool) => {

                if (typeof resourcePool === "undefined" || resourcePool === null) {
                    this.errorMessage = "Invalid CMRP";
                    return;
                }

                // It returns an array, set the first item in the list
                this.resourcePool = resourcePool;

                // Rating mode updated event
                // TODO: Unsubscribe?
                this.resourcePool.ratingModeUpdated.subscribe(() => this.updateElementItemsSortField());

                if (this.resourcePool.selectedElement() !== null) {
                    this.loadChartData();
                }
            });
    }

    loadChartData() {

        // Current element
        var element = this.resourcePool.selectedElement();
        if (element === null) {
            return;
        }

        // Item length check
        if (element.ElementItemSet.length > 20) {
            return;
        }

        if (!this.displayIndexDetails) {

            // TODO Check this rule?

            if (element === element.ResourcePool.mainElement() &&
                (element.totalIncome() > 0 || element.directIncomeField() !== null)) {

                const options: Options = {
                    title: { text: element.Name },
                    chart: { type: "column" },
                    yAxis: {
                        title: { text: "Total Income" }
                    }
                }
                const data: ChartDataItem[] = [];

                element.ElementItemSet.forEach((elementItem) => {
                    data.push(new ChartDataItem(elementItem.Name,
                        elementItem.totalIncome(),
                        elementItem.totalIncomeUpdated$));
                });

                this.chartConfig = new ChartConfig(options, data);

            } else {

                const options: Options = {
                    title: { text: element.Name },
                    chart: { type: "pie" }
                };
                const data: ChartDataItem[] = [];

                element.ElementItemSet.forEach((elementItem) => {
                    elementItem.ElementCellSet.forEach((elementCell) => {
                        if (elementCell.ElementField.IndexEnabled) {
                            data.push(new ChartDataItem(elementCell.ElementItem.Name,
                                +elementCell.numericValue().toFixed(2),
                                elementCell.numericValueUpdated$));
                        }
                    });
                });

                this.chartConfig = new ChartConfig(options, data);
            }

        } else {

            const options = {
                title: { text: "Indexes" },
                chart: { type: "pie" }
            };

            const data: ChartDataItem[] = [];

            element.elementFieldIndexSet()
                .forEach((elementFieldIndex) => {
                    data.push(new ChartDataItem(elementFieldIndex.Name,
                        +elementFieldIndex.indexRating().toFixed(2),
                        elementFieldIndex.indexRatingUpdated$));
                });

            this.chartConfig = new ChartConfig(options, data);
        }
    }

    manageResourcePool(): void {
        const editLink = "/" + this.config.username + "/" + this.config.resourcePoolKey + "/edit";
        this.router.navigate([editLink]);
    }

    manageResourcePoolEnabled(): boolean {
        return this.resourcePool.User === this.currentUser;
    }

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    ngOnInit(): void {

        var username = typeof this.config.username === "undefined" ? "" : this.config.username;
        var resourcePoolKey = typeof this.config.resourcePoolKey === "undefined" ? "" : this.config.resourcePoolKey;

        // Delayed save operation
        this.saveStream.debounceTime(1500)
            .mergeMap(() => this.resourcePoolEditorService.saveChanges()).subscribe();

        // Event handlers
        this.subscriptions.push(
            this.resourcePoolEditorService.currentUserChanged$.subscribe((newUser) =>
                this.initialize(this.username, this.resourcePoolKey, newUser))
        );

        // Refresh resource pool timer
        const refreshResourcePool = 1000 * 60 * 30;

        this.subscriptions.push(
            Observable.timer(refreshResourcePool, refreshResourcePool).mergeMap(() => {
                return this.resourcePoolEditorService.getResourcePoolExpanded(this.resourcePool.uniqueKey, true);
            }).subscribe()
        );

        this.initialize(username, resourcePoolKey, this.resourcePoolEditorService.currentUser);
    }

    resetElementMultiplier(element: Element) {
        this.resourcePoolEditorService.updateElementMultiplier(element, "reset");
        this.saveStream.next();
    }

    resetIndexRating(field: ElementField) {
        this.resourcePoolEditorService.updateElementFieldIndexRating(field, "reset");
        this.saveStream.next();
    }

    resetResourcePoolRate() {
        this.resourcePoolEditorService.updateResourcePoolRate(this.resourcePool, "reset");
        this.saveStream.next();
    }

    toggleDescription() {
        this.displayDescription = !this.displayDescription;
    }

    // Index Details
    toggleIndexDetails() {
        this.displayIndexDetails = !this.displayIndexDetails;
        this.loadChartData();
    }

    updateElementCellDecimalValue(cell: ElementCell, value: number) {
        this.resourcePoolEditorService.updateElementCellDecimalValue(cell, value);
        this.saveStream.next();
    }

    updateElementItemsSortField(): void {
        this.elementItemsSortField = this.resourcePool.RatingMode === RatingMode.CurrentUser
            ? "name"
            : "totalIncome";
    }
}
