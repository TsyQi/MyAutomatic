"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
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
/// <reference path="../../typings/riot-ts-missing-declares.d.ts" />
/// <reference path="../bower_components/riot-ts/riot-ts.d.ts" />
var css_styles_1 = require("../css-styles");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var Utilities_1 = require("../Utilities");
var LearnPage = /** @class */ (function (_super) {
    __extends(LearnPage, _super);
    function LearnPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._updateBind = _this.update.bind(_this);
        _this._loadingStoppedBind = _this.loadingStopped.bind(_this);
        _this.resourceStrings = ResourceStrings_1.ResourceStrings;
        _this._loading = true;
        return _this;
    }
    LearnPage.prototype.mounted = function () {
        this.hookEvents(true);
    };
    LearnPage.prototype.unmounted = function () {
        this.hookEvents(false);
    };
    LearnPage.prototype.loadingStopped = function () {
        this._loading = false;
        this.update();
    };
    Object.defineProperty(LearnPage.prototype, "loading", {
        get: function () {
            return this._loading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LearnPage.prototype, "online", {
        get: function () {
            return navigator.onLine;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LearnPage.prototype, "notAvailableOfflineText", {
        get: function () {
            return this.resourceStrings.featureNotAvailableOffline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LearnPage.prototype, "pleaseWaitText", {
        get: function () {
            return this.resourceStrings.pleaseWait;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LearnPage.prototype, "mainContentStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                height: "100%",
                width: "100%"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LearnPage.prototype, "webviewStyle", {
        /**
         * The webview is hidden while loading. Display: none does not
         * work for webviews so we have to set the size to 0px when loading.
         * See http://electron.atom.io/docs/api/web-view-tag/#css-styling-notes
         */
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: this.loading ? "0px" : "100%",
                paddingBottom: "32px",
                width: this.loading ? "0px" : "100%"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LearnPage.prototype, "centeredStackedDivStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
                marginTop: "-34px",
                width: "100%"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LearnPage.prototype, "offlineImageStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "96px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LearnPage.prototype, "offlineTextStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                fontSize: "1.5rem",
                marginTop: "30px",
                outline: "none"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Hooks or unhooks events for this component
     */
    LearnPage.prototype.hookEvents = function (hook) {
        // (un)hook events on the window
        var hookMethod = Utilities_1.getEventHookMethodForTarget(window, hook);
        hookMethod("online", this._updateBind);
        hookMethod("offline", this._updateBind);
        // (un)hook events on the web view (which is only created when online)
        var webview = this.root.querySelector("#learn-webview");
        if (webview) {
            hookMethod = Utilities_1.getEventHookMethodForTarget(webview, hook);
            hookMethod("did-stop-loading", this._loadingStoppedBind);
        }
    };
    LearnPage = __decorate([
        template("\n<learn-page>\n    <div if={this.online}\n         style={this.mainContentStyle}>\n        <webview src=\"https://aka.ms/vs15learnpage\"\n                style={this.webviewStyle}\n                id=\"learn-webview\" />\n        <div if={this.loading}\n             style={this.centeredStackedDivStyle}>\n            <img src=\"images/ConnectionOffline.svg\"\n                style={this.offlineImageStyle} />\n            <div style={this.offlineTextStyle}\n                aria-label={this.pleaseWaitText}\n                tabindex=\"0\">\n                {this.pleaseWaitText}\n            </div>\n        </div>\n    </div>\n    <div if={!this.online}\n         style={this.centeredStackedDivStyle}>\n        <img src=\"images/ConnectionOffline.svg\"\n             style={this.offlineImageStyle} />\n        <div style={this.offlineTextStyle}\n             aria-label={this.notAvailableOfflineText}\n             tabindex=\"0\">\n            {this.notAvailableOfflineText}\n        </div>\n    </div>\n</learn-page>")
    ], LearnPage);
    return LearnPage;
}(Riot.Element));
exports.LearnPage = LearnPage;
//# sourceMappingURL=learn-page.js.map