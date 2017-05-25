﻿import { EventEmitter, Injectable } from "@angular/core";
import { Headers, Http, RequestOptions } from "@angular/http";
import { EntityQuery, EntityState, MergeStrategy } from "breeze-client";
import { Observable } from "rxjs/Observable";

import { AppSettings } from "../../app-settings/app-settings";
import { AppHttp } from "../app-http/app-http.module";
import { AppEntityManager } from "../app-entity-manager/app-entity-manager.module";
import { Role } from "../app-entity-manager/entities/role";
import { User } from "../app-entity-manager/entities/user";
import { UserRole } from "../app-entity-manager/entities/user-role";
import { Logger } from "../logger/logger.module";
import { getUniqueUserName } from "../utils";

@Injectable()
export class AuthService {

    // Public
    currentUser: User = null;
    get loginReturnUrl(): string {
        return localStorage.getItem("loginReturnUrl");
    };
    set loginReturnUrl(value: string) {
        localStorage.setItem("loginReturnUrl", value);
    }

    currentUserChanged$: EventEmitter<User> = new EventEmitter<User>();

    // Private
    private appHttp: AppHttp;
    private currentUserUrl: string = "";
    private registerGuestAccountUrl: string = "";
    private tokenUrl: string = "";

    constructor(private appEntityManager: AppEntityManager, http: Http, private logger: Logger) {

        this.appHttp = http as AppHttp;

        // Service urls
        this.currentUserUrl = AppSettings.serviceAppUrl + "/api/Account/CurrentUser";
        this.registerGuestAccountUrl = AppSettings.serviceAppUrl + "/api/Account/RegisterGuestAccount";
        this.tokenUrl = AppSettings.serviceAppUrl + "/api/Token";
    }

    ensureAuthenticatedUser() {
        if (this.currentUser.isAuthenticated()) {

            return Observable.of(null);

        } else {

            let registerGuestAccountBindingModel = {
                UserName: this.currentUser.UserName,
                Email: this.currentUser.Email
            };

            return this.appHttp.post(this.registerGuestAccountUrl, registerGuestAccountBindingModel)
                .mergeMap((updatedUser: User) => {

                    // Update fetchedUsers list
                    this.appEntityManager.fetchedUsers.splice(this.appEntityManager.fetchedUsers.indexOf(this.currentUser.UserName));
                    this.appEntityManager.fetchedUsers.push(updatedUser.UserName);

                    this.updateCurrentUser(updatedUser);

                    return this.getToken("", "", true, this.currentUser.SingleUseToken);
                });
        }
    }

    getToken(username: string, password: string, rememberMe: boolean, singleUseToken?: any) {

        var tokenData = "grant_type=password" +
            "&username=" + username +
            "&password=" + password +
            "&rememberMe=" + rememberMe +
            "&singleUseToken=" + singleUseToken;

        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });

        return this.appHttp.post(this.tokenUrl, tokenData, options)
            .map((token: any) => {

                // Store the token in localStorage
                localStorage.setItem("token", JSON.stringify(token));
            });
    }

    init(): Observable<void> {

        // Get metadata from the server
        return this.appEntityManager.getMetadata()
            .mergeMap(() => {

                // Set current user
                return this.setCurrentUser();
            })
            .catch((error) => {

                // In case of "Server offline", set a new user to prevent further user related errors and continue
                if (typeof error.status !== "undefined"
                    && error.status === 0 &&
                    !this.currentUser) {

                    // User
                    this.currentUser = new User();

                    // User role
                    var userRole = new UserRole();
                    userRole.User = this.currentUser;
                    userRole.Role = new Role();
                    userRole.Role.Name = "Guest";
                    this.currentUser.Roles = [userRole];

                    return Observable.of(null);
                } else {
                    throw error;
                }
            });
    }

    login(username: any, password: any, rememberMe: any, singleUseToken?: any): Observable<void> {

        return this.getToken(username, password, rememberMe, singleUseToken)
            .mergeMap((): Observable<void> => {
                this.resetCurrentUser(false);

                return this.setCurrentUser();
            });
    }

    logout(): Observable<void> {
        this.resetCurrentUser(true);

        return this.setCurrentUser();
    }

    updateCurrentUser(updatedUser: User) {

        // Remove old user role
        var oldUserRole = this.currentUser.Roles[0];

        // From its role
        var oldRole = oldUserRole.Role;
        oldRole.Users.splice(oldRole.Users.indexOf(oldUserRole), 1);

        // From current user
        this.currentUser.Roles.splice(this.currentUser.Roles.indexOf(oldUserRole), 1);

        // And set it detached
        oldUserRole.entityAspect.setDetached();

        // User id fix-up
        this.currentUser.Id = updatedUser.Id;

        // Update breeze entities
        this.appEntityManager.createEntity("User", updatedUser, EntityState.Unchanged, MergeStrategy.OverwriteChanges) as User;
        this.appEntityManager.createEntity("UserRole", updatedUser.Roles[0], EntityState.Unchanged, MergeStrategy.OverwriteChanges);
    }

    // Private methods
    private createGuestAccount(): User {

        // Username: Look for it in localStorage first
        let userName = localStorage.getItem("guestUserName");

        // If there is no guest username, generate a unique username and add it to localStorage
        // If the user refreshes the page, it can keep using the same username
        if (!userName) {
            userName = getUniqueUserName();
            localStorage.setItem("guestUserName", userName);
        }

        // Email
        const email = `${userName}@forcrowd.org`;

        let user = this.appEntityManager.createEntity("User", {
            Email: email,
            UserName: userName
        }) as User;
        user.entityAspect.acceptChanges();

        // Get guest role
        let guestRole = this.appEntityManager.getEntities("Role").find((value: Role) => {
            return value.Name === "Guest";
        });

        // User role
        let userRole = this.appEntityManager.createEntity("UserRole", { User: user, Role: guestRole });
        userRole.entityAspect.acceptChanges();

        // Add it to local cache
        this.appEntityManager.fetchedUsers.push(user.UserName);

        return user;
    }

    private resetCurrentUser(includelocalStorage: boolean): void {

        // Remove token from the session
        if (includelocalStorage) {
            localStorage.removeItem("guestUserName");
            localStorage.removeItem("token");
        }

        // Clear breeze's metadata store
        this.appEntityManager.clear();
        this.appEntityManager.fetchedUsers = [];

        this.currentUser = null;
    }

    // Ensures Role entities are retrieved
    private ensureRolesEntities(): Observable<void> {

        if (this.appEntityManager.getEntities("Role").length > 0) {

            return Observable.of(null);

        } else {

            let query = EntityQuery.from("Roles");

            return this.appEntityManager.executeQueryNew(query) as null;
        }
    }

    private setCurrentUser(): Observable<void> {

        return this.ensureRolesEntities().mergeMap(() => {

            let tokenItem = localStorage.getItem("token");

            if (tokenItem === null) {

                this.currentUser = this.createGuestAccount();

                this.currentUserChanged$.emit(this.currentUser);

                return Observable.of(null);

            } else {

                return this.appHttp.get<User>(this.currentUserUrl)
                    .map((currentUser) => {

                        if (currentUser === null) {

                            localStorage.removeItem("token"); // Invalid or expired token

                            this.currentUser = this.createGuestAccount();

                        } else {

                            // Attach user and its role to entity manager
                            this.currentUser = this.appEntityManager.createEntity("User", currentUser, EntityState.Unchanged) as User;
                            this.appEntityManager.createEntity("UserRole", currentUser.Roles[0], EntityState.Unchanged);

                        }

                        this.currentUserChanged$.emit(this.currentUser);
                    });
            }
        });
    }
}
