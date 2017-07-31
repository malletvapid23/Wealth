﻿import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

import { AccountService } from "./account.service";
import { Logger } from "../logger/logger.module";

@Component({
    selector: "login",
    templateUrl: "login.component.html"
})
export class LoginComponent implements OnDestroy, OnInit {

    error: string;
    get isBusy(): boolean {
        return this.accountService.isBusy;
    }
    init: string;
    password = "";
    rememberMe = true;
    singleUseToken: string;
    subscriptions: Subscription[] = [];
    username: string;

    constructor(private activatedRoute: ActivatedRoute,
        private accountService: AccountService,
        private logger: Logger,
        private router: Router) {
    }

    login() {

        if (this.username !== "" && this.password !== "") {
            this.accountService.login(this.username, this.password, this.rememberMe)
                .subscribe(() => {

                    this.logger.logSuccess("You have been logged in!");

                    // Get return url, reset loginReturnUrl and navigate
                    const returnUrl = this.accountService.loginReturnUrl || "/app/home";
                    this.accountService.loginReturnUrl = "";
                    this.router.navigate([returnUrl]);
                });
        }
    }

    ngOnInit() {

        // Params
        this.subscriptions.push(
            this.activatedRoute.params.subscribe((params: any) => {
                this.error = params.error;

                // Error
                if (typeof this.error !== "undefined") {
                    this.logger.logError(this.error);
                    return;
                }

                this.init = params.init;
                this.singleUseToken = params.token;

                this.tryExternalLogin();
            })
        );
    }

    /**
     * External (single use token) login
     */
    tryExternalLogin() {

        if (!this.singleUseToken) {
            return;
        }

        this.accountService.login("", "", this.rememberMe, this.singleUseToken)
            .subscribe(() => {
                this.logger.logSuccess("You have been logged in!");

                // First time
                if (this.init) {
                    this.router.navigate(["/app/account/change-username", { init: true }]);

                } else {

                    // Get return url, reset loginReturnUrl and navigate
                    const returnUrl = this.accountService.loginReturnUrl || "/app/home";
                    this.accountService.loginReturnUrl = "";
                    this.router.navigate([returnUrl]);
                }
            },
            () => {
                this.logger.logError("Invalid token");
            });
    }

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }
}
