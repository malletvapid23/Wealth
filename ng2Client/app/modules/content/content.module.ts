﻿import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AllInOneComponent } from "./all-in-one.component";
import { BasicsComponent } from "./basics.component";
import { ImplementationComponent } from "./implementation.component";
import { IntroductionComponent } from "./introduction.component";
import { KnowledgeIndexComponent } from "./knowledge-index.component";
import { PriorityIndexComponent } from "./priority-index.component";
import { PrologueComponent } from "./prologue.component";
import { ReasonComponent } from "./reason.component";
import { TotalCostIndexComponent } from "./total-cost-index.component";

import { GlobalGoalsFundModule } from "./global-goals-fund/global-goals-fund.module";
import { NgChartModule } from "../ng-chart/ng-chart.module";
import { ResourcePoolModule } from "../resource-pool/resource-pool.module";

// Routes
export const contentRoutes: Routes = [
    { path: "app/all-in-one", component: AllInOneComponent, data: { title: "All in One" } },
    { path: "app/basics", component: BasicsComponent, data: { title: "Basics" } },
    { path: "app/implementation", component: ImplementationComponent, data: { title: "Implementation" } },
    { path: "app/introduction", component: IntroductionComponent, data: { title: "Introduction" } },
    { path: "app/knowledge-index", component: KnowledgeIndexComponent, data: { title: "Knowledge Index" } },
    { path: "app/priority-index", component: PriorityIndexComponent, data: { title: "Priority Index" } },
    { path: "app/prologue", component: PrologueComponent, data: { title: "Prologue" } },
    { path: "app/reason", component: ReasonComponent, data: { title: "Reason" } },
    { path: "app/total-cost-index", component: TotalCostIndexComponent, data: { title: "Total Cost Index" } }
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

        GlobalGoalsFundModule,
        NgChartModule,
        ResourcePoolModule
    ]
})
export class ContentModule { }
