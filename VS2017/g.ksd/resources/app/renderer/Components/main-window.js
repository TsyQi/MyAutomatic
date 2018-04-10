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
var factory_1 = require("../stores/factory");
var css_styles_1 = require("../css-styles");
var TabSwitchAction_1 = require("../Actions/TabSwitchAction");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
var WindowActions_1 = require("../Actions/WindowActions");
var router_1 = require("./router");
var Utilities_1 = require("../Utilities");
var exit_details_1 = require("../../lib/exit-details");
var scheduled_updater_1 = require("../mixins/scheduled-updater");
var apply_mixins_1 = require("../mixins/apply-mixins");
require("./app-header");
require("./error-dialog");
require("./router");
var MainWindow = /** @class */ (function (_super) {
    __extends(MainWindow, _super);
    function MainWindow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onAppStoreChangedBind = _this.onAppStoreChanged.bind(_this);
        _this._updateBind = _this.scheduleUpdate.bind(_this);
        return _this;
    }
    MainWindow.prototype.mounted = function () {
        this.hookEvents(true);
        this.setWindowTitle();
        WindowActions_1.windowActions.startListeningForWindowClose(window);
        if (document.hasFocus()) {
            TabSwitchAction_1.sendFocusGained(factory_1.appStore.runningOperationName);
        }
        router_1.Router.start();
    };
    MainWindow.prototype.unmounted = function () {
        this.hookEvents(false);
        WindowActions_1.windowActions.stopListeningForWindowClose(window);
    };
    Object.defineProperty(MainWindow.prototype, "acceptErrorCallback", {
        get: function () {
            return factory_1.errorStore.dismiss;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainWindow.prototype, "errorMessage", {
        get: function () {
            return factory_1.errorStore.currentMessageData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainWindow.prototype, "isErrorVisible", {
        get: function () {
            return factory_1.errorStore.isErrorVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainWindow.prototype, "accessibilityLogStrings", {
        get: function () {
            return factory_1.appStore.accessibilityLogStrings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainWindow.prototype, "appVersionStyle", {
        /* Styles */
        get: function () {
            var style = css_styles_1.createStyleMap({
                cursor: "text",
                fontSize: ".75rem",
                margin: "5px 12px",
                webkitUserSelect: "text",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainWindow.prototype, "footerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                bottom: "0",
                position: "absolute",
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainWindow.prototype, "mainWindowStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                display: "flex",
                flexDirection: "column",
                height: "100%"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainWindow.prototype, "routerStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                flex: "1 0 0px",
                overflow: "hidden",
                position: "relative",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainWindow.prototype, "titleBarStyle", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "26px"
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainWindow.prototype, "invisibleAccessibilityLog", {
        get: function () {
            var style = css_styles_1.createStyleMap({
                height: "1px",
                width: "1px",
                position: "absolute",
                overflow: "hidden",
                top: "-10px",
            });
            return style.toString();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Hooks or unhooks events for this component
     */
    MainWindow.prototype.hookEvents = function (hook) {
        // (un)hook events on the window
        var hookMethod = Utilities_1.getEventHookMethodForTarget(window, hook);
        hookMethod("resize", WindowActions_1.windowActions.requestWindowState);
        hookMethod("blur", TabSwitchAction_1.sendFocusLost);
        hookMethod("focus", TabSwitchAction_1.sendFocusGained);
        // (un)hook events on the app store
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.appStore, hook);
        hookMethod(factory_1.appStore.CHANGED_EVENT, this._onAppStoreChangedBind);
        // (un)hook events on the error store
        hookMethod = Utilities_1.getEventHookMethodForEventEmitter(factory_1.errorStore, hook);
        hookMethod(factory_1.errorStore.CHANGED_EVENT, this._updateBind);
    };
    MainWindow.prototype.setWindowTitle = function () {
        // We don't have access to ResourceStrings from Index.html, so we set
        // the title here.
        document.title = ResourceStrings_1.ResourceStrings.appWindowTitle;
    };
    MainWindow.prototype.onAppStoreChanged = function () {
        var pendingAppClosure = factory_1.appStore.pendingAppClosure;
        if (pendingAppClosure && pendingAppClosure.isAppClosurePending) {
            WindowActions_1.windowActions.quitApp(exit_details_1.CreateCustomExitDetails(null, null, pendingAppClosure.exitCode));
        }
        else {
            this.scheduleUpdate();
        }
    };
    MainWindow = __decorate([
        template("\n<main-window>\n    <div style={this.mainWindowStyle}\n         role=\"main\">\n        <app-header class=\"title-bar\"\n                    style={this.titleBarStyle} />\n        <router class=\"router\"\n                style={this.routerStyle} />\n        <error-dialog if={this.isErrorVisible}\n                      error-message={this.errorMessage}\n                      onsubmit={this.acceptErrorCallback} />\n\n        <!-- Hidden div that is the queue of messages to be read to the user -->\n        <div style={this.invisibleAccessibilityLog}\n             role=\"log\">\n            <virtual each={message in this.accessibilityLogStrings}>\n                {message} <br />\n            </virtual>\n        </div>\n    </div>\n</main-window>")
    ], MainWindow);
    return MainWindow;
}(Riot.Element));
exports.MainWindow = MainWindow;
apply_mixins_1.applyMixins(MainWindow, [scheduled_updater_1.ScheduledUpdater]);
riot.mount("*");
//# sourceMappingURL=main-window.js.map