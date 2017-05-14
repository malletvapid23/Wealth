﻿import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "angulartics2";
import { MomentModule } from "angular2-moment";

// Modules
import { ContentModule } from "../content/content.module";

// Components
import { ContributorsComponent } from "./contributors.component";
import { HomeComponent } from "./home.component";
import { NotFoundComponent } from "./not-found.component";
import { SearchComponent } from "./search.component";

// Services
import { AuthGuard } from "./auth-guard.service";
import { CanDeactivateGuard } from "./can-deactivate-guard.service";
import { DynamicTitleResolve } from "./dynamic-title-resolve.service";
import { GoogleAnalyticsService } from "./google-analytics.service";

// Routes
import { accountRoutes } from "../account/account.module";
import { contentRoutes } from "../content/content.module";
import { userRoutes } from "../user/user.module";
import { resourcePoolRoutes } from "../resource-pool/resource-pool.module";

export { Angulartics2GoogleAnalytics, AuthGuard, CanDeactivateGuard, DynamicTitleResolve, GoogleAnalyticsService, RouterModule }

const coreRoutes: Routes = [
    { path: "", component: HomeComponent, data: { title: "Home" } },
    { path: "app/contributors", component: ContributorsComponent, data: { title: "Contributors" } },
    { path: "app/not-found", component: NotFoundComponent, data: { title: "Not Found" } },
    { path: "app/search", component: SearchComponent, data: { title: "Search" } },

    /* Home alternatives */
    { path: "app/home", redirectTo: "", pathMatch: "full" },
    { path: "app.html", redirectTo: "", pathMatch: "full" },
    { path: "app-aot.html", redirectTo: "", pathMatch: "full" },

    /* Backward compatibility */
    { path: "_system/content/contributors", redirectTo: "app/contributors", pathMatch: "full" }
];

const notFoundRoute: Routes = [
    { path: "**", component: NotFoundComponent, data: { title: "Not Found" } }
];

@NgModule({
    declarations: [
        ContributorsComponent,
        HomeComponent,
        NotFoundComponent,
        SearchComponent
    ],
    exports: [
        RouterModule
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        RouterModule.forRoot(coreRoutes),
        RouterModule.forRoot(accountRoutes),
        RouterModule.forRoot(contentRoutes),
        RouterModule.forRoot(userRoutes),
        RouterModule.forRoot(resourcePoolRoutes),
        RouterModule.forRoot(notFoundRoute),
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
        MomentModule,

        ContentModule
    ],
    providers: [
        AuthGuard,
        CanDeactivateGuard,
        DynamicTitleResolve,
        GoogleAnalyticsService
    ]
})
export class CoreModule { }
