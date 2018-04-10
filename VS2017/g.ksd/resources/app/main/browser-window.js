/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// BrowserWindow event names
exports.RESPONSIVE_EVENT = "responsive";
exports.SHOW_EVENT = "show";
exports.UNRESPONSIVE_EVENT = "unresponsive";
exports.SESSION_END_EVENT = "session-end";
// BrowserWindow.WebContents event names
exports.WC_DID_FINISH_LOAD = "did-finish-load";
var WindowType;
(function (WindowType) {
    WindowType[WindowType["Default"] = 0] = "Default";
    WindowType[WindowType["Uninstall"] = 1] = "Uninstall";
    WindowType[WindowType["FocusedUi"] = 2] = "FocusedUi";
    WindowType[WindowType["Survey"] = 3] = "Survey";
})(WindowType = exports.WindowType || (exports.WindowType = {}));
var BrowserWindow = /** @class */ (function () {
    function BrowserWindow(createWindow, options, progressBarFactory, telemetry) {
        // create a window
        this._electronWindow = createWindow(options);
        // hide the menu bar
        this._electronWindow.setMenuBarVisibility(false);
        // load the main page of the app
        this._electronWindow.loadURL(options.url);
        // This prevents the title from being changed
        this._electronWindow.on("page-title-updated", function (e) {
            e.preventDefault();
        });
        if (telemetry) {
            this._telemetry = telemetry;
            telemetry.monitor(this._electronWindow);
        }
        this._progressBar = progressBarFactory.getInstance(this._electronWindow);
    }
    Object.defineProperty(BrowserWindow.prototype, "electronWindow", {
        get: function () {
            return this._electronWindow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserWindow.prototype, "progressBar", {
        get: function () {
            return this._progressBar;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserWindow.prototype, "isVisible", {
        get: function () {
            return this._electronWindow.isVisible();
        },
        enumerable: true,
        configurable: true
    });
    BrowserWindow.prototype.focus = function () {
        this._electronWindow.focus();
    };
    BrowserWindow.prototype.loadURL = function (url, options) {
        this._electronWindow.loadURL(url, options);
    };
    BrowserWindow.prototype.maximize = function () {
        this._electronWindow.maximize();
    };
    BrowserWindow.prototype.minimize = function () {
        this._electronWindow.minimize();
    };
    BrowserWindow.prototype.isMaximized = function () {
        return this._electronWindow.isMaximized();
    };
    BrowserWindow.prototype.isMinimized = function () {
        return this._electronWindow.isMinimized();
    };
    BrowserWindow.prototype.restore = function () {
        this._electronWindow.restore();
    };
    BrowserWindow.prototype.show = function () {
        this._electronWindow.show();
    };
    BrowserWindow.prototype.unmaximize = function () {
        return this._electronWindow.unmaximize();
    };
    BrowserWindow.prototype.onClosed = function (callback) {
        this._electronWindow.on("closed", callback);
    };
    return BrowserWindow;
}());
exports.BrowserWindow = BrowserWindow;
//# sourceMappingURL=browser-window.js.map