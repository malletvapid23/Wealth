import { Component } from "@angular/core";

import { Logger } from "../../services/logger.service";
import { AppSettings } from "../../settings/app-settings";

@Component({
    moduleId: module.id,
    selector: "contributors",
    templateUrl: "contributors.component.html?v=" + AppSettings.version
})
export class ContributorsComponent {

    constructor(private logger: Logger) {
    }

    getExperienceYears(year: number): string {
        let totalYears = new Date().getUTCFullYear() - year;
        return totalYears.toString() + "+";
    }

    getJoinedOnDate(day: any, month: any, year: any): Date {
        return new Date(year, month - 1, day);
    }
}
