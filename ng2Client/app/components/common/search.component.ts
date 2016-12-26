import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { DataService } from "../../services/data.service";
import { Logger } from "../../services/logger.service";
import { ResourcePoolService } from "../../services/resource-pool-service";
import { AppSettings } from "../../settings/app-settings";

@Component({
    moduleId: module.id,
    selector: "search",
    templateUrl: "search.component.html?v=" + AppSettings.version
})
export class SearchComponent {

    resourcePoolSet: any[] = [];
    searchKey = "";
    showResults = false;

    constructor(private dataService: DataService,
        private logger: Logger,
        private resourcePoolService: ResourcePoolService,
        private router: Router) {
    }

    searchKeyChange(value: string) {
        this.searchKey = value;

        if (this.searchKey.length <= 2) {
            this.showResults = false;
            return;
        }

        this.resourcePoolService.getResourcePoolSet(this.searchKey)
            .subscribe((results: any) => {
                this.resourcePoolSet = results;
                this.showResults = true;
            });
    }
}
