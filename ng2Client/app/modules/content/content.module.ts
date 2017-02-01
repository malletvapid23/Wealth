﻿import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AllInOneComponent } from "./all-in-one";
import { BasicsComponent } from "./basics";
import { ImplementationComponent } from "./implementation";
import { IntroductionComponent } from "./introduction";
import { KnowledgeIndexComponent } from "./knowledge-index";
import { PriorityIndexComponent } from "./priority-index";
import { PrologueComponent } from "./prologue";
import { ReasonComponent } from "./reason";
import { TotalCostIndexComponent } from "./total-cost-index";

import { NgChartModule } from "../ng-chart/ng-chart.module";
import { ResourcePoolModule } from "../resource-pool/resource-pool.module";

// Routes
export const contentRoutes: Routes = [
    { path: "app/allInOne", component: AllInOneComponent, data: { title: "All in One" } },
    { path: "app/basics", component: BasicsComponent, data: { title: "Basics" } },
    { path: "app/implementation", component: ImplementationComponent, data: { title: "Implementation" } },
    { path: "app/introduction", component: IntroductionComponent, data: { title: "Introduction" } },
    { path: "app/knowledgeIndex", component: KnowledgeIndexComponent, data: { title: "Knowledge Index" } },
    { path: "app/priorityIndex", component: PriorityIndexComponent, data: { title: "Priority Index" } },
    { path: "app/prologue", component: PrologueComponent, data: { title: "Prologue" } },
    { path: "app/reason", component: ReasonComponent, data: { title: "Reason" } },
    { path: "app/totalCostIndex", component: TotalCostIndexComponent, data: { title: "Total Cost Index" } }
];

@NgModule({
    declarations: [
        AllInOneComponent,
        BasicsComponent,
        ImplementationComponent,
        IntroductionComponent,
        KnowledgeIndexComponent,
        PriorityIndexComponent,
        PrologueComponent,
        ReasonComponent,
        TotalCostIndexComponent
    ],
    exports: [
        AllInOneComponent,
        BasicsComponent,
        ImplementationComponent,
        IntroductionComponent,
        KnowledgeIndexComponent,
        PriorityIndexComponent,
        PrologueComponent,
        ReasonComponent,
        TotalCostIndexComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,

        NgChartModule,
        ResourcePoolModule
    ]
})
export class ContentModule { }
