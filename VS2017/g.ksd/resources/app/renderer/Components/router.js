/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../bower_components/riot-ts/riot-ts.d.ts" />
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var queryString = require("querystring");
var factory_1 = require("../stores/factory");
var css_styles_1 = require("../css-styles");
var language_config_1 = require("../language-config");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var UserSelectionActions_1 = require("../Actions/UserSelectionActions");
var TelemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var factory_2 = require("../Actions/factory");
require("./home-page");
/* tslint:enable */
var ROUTES = {
    HOME: "/",
    INSTALL: "/install",
    MODIFY: "/modify"
};
var Router = /** @class */ (function (_super) {
    __extends(Router, _super);
    function Router() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Router_1 = Router;
    Object.defineProperty(Router, "appRootElement", {
        get: function () {
            return document.querySelector("app");
        },
        enumerable: true,
        configurable: true
    });
    Router.start = function () {
        // uncomment this to attach the debugger very early in startup
        // openDevTools();
        // Define app routes:
        riot.route(ROUTES.HOME, Router_1.onGoHome);
        riot.route(ROUTES.INSTALL + "..", Router_1.onGoInstall);
        riot.route(ROUTES.MODIFY + "..", Router_1.onGoModify);
        // Last to catch any undefined routes, for debugging
        riot.route(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log("Undefined route: " + Array.prototype.join.call(args, "/"));
        });
        // Start the router and mount the component
        riot.route.start(true);
    };
    Router.goHome = function () {
        riot.route(ROUTES.HOME);
    };
    Router.goInstall = function (productSummary, resetSelections, nickname, showNickname) {
        if (resetSelections) {
            var languages = new language_config_1.LanguageConfig(factory_1.appStore.argv.languagesToAdd, factory_1.appStore.argv.languagesToRemove, factory_1.appStore.appLocale);
            UserSelectionActions_1.updateSelectedProduct(productSummary, languages, Router_1.getVsixsFromArgV());
        }
        // We fire the coressponding end session in 3 places:
        // user clicking 'install' on details page (end with success)
        // user clicking cancel (end with user cancel)
        // app quiting and calling 'dispose' on (end None )
        factory_2.detailsPageActions.startDetailsPageSession(TelemetryEventNames.DETAILS_PAGE_SESSION_TYPE_INSTALL, productSummary.channelId, productSummary.id, productSummary.name, productSummary.version.build, null /* installationId */);
        var displayName = productSummary.displayName;
        var installQuery = {
            channelId: productSummary.channelId,
            id: productSummary.id,
            showNickname: showNickname ? "true" : "false",
            nickname: nickname || "",
            displayName: displayName,
            version: productSummary.version.display,
        };
        riot.route(ROUTES.INSTALL + "&" + queryString.stringify(installQuery));
    };
    Router.goModify = function (productSummary, resetSelections, withUpdatePackages) {
        if (resetSelections) {
            var languages = new language_config_1.LanguageConfig(factory_1.appStore.argv.languagesToAdd, factory_1.appStore.argv.languagesToRemove, factory_1.appStore.appLocale);
            UserSelectionActions_1.updateSelectedProduct(productSummary, languages, Router_1.getVsixsFromArgV(), withUpdatePackages);
        }
        // We fire the coressponding end session in 3 places:
        // user clicking 'install' on details page (end with success)
        // user clicking cancel (end with user cancel)
        // app quiting and calling 'dispose' on (end None )
        factory_2.detailsPageActions.startDetailsPageSession(TelemetryEventNames.DETAILS_PAGE_SESSION_TYPE_MODIFY, productSummary.channelId, productSummary.id, productSummary.name, productSummary.version.build, productSummary.installationId);
        var buildVersion = withUpdatePackages
            ? productSummary.latestVersion.display
            : productSummary.version.display;
        var displayName = productSummary.displayNameWithNickname;
        var modifyQuery = {
            version: buildVersion,
            displayName: displayName,
            withUpdatePackages: withUpdatePackages ? "true" : "false",
        };
        riot.route(ROUTES.MODIFY + "&" + queryString.stringify(modifyQuery));
    };
    /**
     * Helper to get the vsix refs from args, only when handling command line.
     */
    Router.getVsixsFromArgV = function () {
        var vsixs = factory_1.appStore.hasActiveCommandLineOperation
            ? factory_1.appStore.argv.vsixs
            : [];
        return vsixs;
    };
    /**
     * Note: The generic type param is not validated at runtime.
     * @returns a map of query params.
     */
    Router.getQuery = function () {
        // Unescape the query string parts.
        var query = riot.route.query();
        Object.keys(query).forEach(function (key) { query[key] = queryString.unescape(query[key]); });
        return query;
    };
    Router.onGoHome = function () {
        Router_1.mount(Router_1.appRootElement, "home-page");
    };
    Router.onGoInstall = function () {
        var installQuery = Router_1.getQuery();
        var detailsPageTitle = ResourceStrings_1.ResourceStrings.detailsPageTitleInstalling(installQuery.displayName, installQuery.version);
        var homePageOpts = {
            channelId: installQuery.channelId,
            productId: installQuery.id,
            detailsPageTitle: detailsPageTitle,
            detailsPageNickname: installQuery.nickname,
            showLightBox: true,
            showDetailsPageNickname: (installQuery.showNickname !== "false"),
            detailsPageShowUpdate: false,
        };
        Router_1.mount(Router_1.appRootElement, "home-page", homePageOpts);
    };
    Router.onGoModify = function () {
        var modifyQuery = Router_1.getQuery();
        var productName = modifyQuery.displayName;
        var version = modifyQuery.version;
        var homePageOpts = {
            detailsPageTitle: ResourceStrings_1.ResourceStrings.detailsPageTitleModifying(productName, version),
            showLightBox: true,
            detailsPageShowUpdate: modifyQuery.withUpdatePackages === "true" ? true : false,
        };
        Router_1.mount(Router_1.appRootElement, "home-page", homePageOpts);
    };
    Router.mount = function (domNode, tagName, opts) {
        riot.mount(domNode, tagName, opts);
    };
    Object.defineProperty(Router.prototype, "appRootStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "1 0 0px",
                position: "relative",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "appStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "auto",
                webkitAppRegion: "no-drag"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Router = Router_1 = __decorate([
        template("\n<router>\n    <app style={this.appStyle} />\n</router>")
    ], Router);
    return Router;
    var Router_1;
}(Riot.Element));
exports.Router = Router;
//# sourceMappingURL=router.js.map