/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
/* tslint:disable:no-use-before-declare */
var electron_1 = require("electron");
/* tslint:enable */
var events_1 = require("events");
var factory_1 = require("./progress-bar/factory");
var browser_window_1 = require("./browser-window");
var BrowserWindowFactoryEvents;
(function (BrowserWindowFactoryEvents) {
    "use strict";
    BrowserWindowFactoryEvents.onBeforeWindowCreated = "before-window-created";
    BrowserWindowFactoryEvents.onWindowCreated = "window-created";
})(BrowserWindowFactoryEvents || (BrowserWindowFactoryEvents = {}));
var BrowserWindowFactory = /** @class */ (function () {
    function BrowserWindowFactory(rootDir) {
        this._emitter = new events_1.EventEmitter();
        this._progressBarFactory = new factory_1.BrowserWindowProgressBarFactory();
        this._rootDir = rootDir;
    }
    BrowserWindowFactory.prototype.createWindow = function (windowOptions, windowPageUrl, telemetry) {
        // It would be a good idea to move this to the constructor,
        // but at this point in time it would require too much code change.
        if (!this._telemetry) {
            this._telemetry = telemetry;
            this._telemetry.monitorFactory(this);
        }
        this.emitBeforeWindowCreated();
        var options = Object.assign(windowOptions, { url: windowPageUrl });
        var window = new browser_window_1.BrowserWindow(function (opts) { return new electron_1.BrowserWindow(opts); }, options, this._progressBarFactory, telemetry);
        this.emitWindowCreated();
        return window;
    };
    BrowserWindowFactory.prototype.formatUrlWithQueryOptions = function (windowType, options, overrideQueryParameters) {
        var queryStringParts = Object.keys(options).map(function (key) {
            if (options[key] === undefined) {
                return undefined;
            }
            if (overrideQueryParameters && overrideQueryParameters.includes(key)) {
                return "";
            }
            if (!Array.isArray(options[key])) {
                return key + "=" + options[key];
            }
            var array = options[key];
            return key + "=" + array.join("%20");
        });
        if (overrideQueryParameters) {
            queryStringParts.push(overrideQueryParameters);
        }
        // construct the query string, omitting the undefined parts
        var queryString = queryStringParts.filter(function (part) { return !!part; }).join("&");
        var startPage = this.windowTypeToStartPage(windowType);
        return "file://" + startPage + "?" + queryString;
    };
    BrowserWindowFactory.prototype.onBeforeWindowCreated = function (callback) {
        this._emitter.on(BrowserWindowFactoryEvents.onBeforeWindowCreated, callback);
    };
    BrowserWindowFactory.prototype.onWindowCreated = function (callback) {
        this._emitter.on(BrowserWindowFactoryEvents.onWindowCreated, callback);
    };
    BrowserWindowFactory.prototype.emitBeforeWindowCreated = function () {
        this._emitter.emit(BrowserWindowFactoryEvents.onBeforeWindowCreated);
    };
    BrowserWindowFactory.prototype.emitWindowCreated = function () {
        this._emitter.emit(BrowserWindowFactoryEvents.onWindowCreated);
    };
    BrowserWindowFactory.prototype.windowTypeToStartPage = function (windowType) {
        var startPageFileName = "index.html";
        switch (windowType) {
            case browser_window_1.WindowType.Uninstall:
                startPageFileName = "uninstall.html";
                break;
            case browser_window_1.WindowType.FocusedUi:
                startPageFileName = "focused.html";
                break;
            case browser_window_1.WindowType.Survey:
                startPageFileName = "survey-prompt.html";
                break;
            case browser_window_1.WindowType.Default:
                startPageFileName = "index.html";
                break;
            default:
                startPageFileName = "index.html";
                break;
        }
        return path.join(this._rootDir, startPageFileName);
    };
    return BrowserWindowFactory;
}());
exports.BrowserWindowFactory = BrowserWindowFactory;
//# sourceMappingURL=browser-window-factory.js.map