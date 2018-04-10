/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Telemetry_1 = require("../../lib/Telemetry/Telemetry");
var TelemetryEventNames_1 = require("../../lib/Telemetry/TelemetryEventNames");
var browser_window_1 = require("../browser-window");
var bucket_parameters_1 = require("../../lib/Telemetry/bucket-parameters");
var BrowserWindowTelemetry = /** @class */ (function () {
    function BrowserWindowTelemetry(telemetry, logger) {
        this._logger = logger;
        this._telemetry = telemetry;
    }
    Object.defineProperty(BrowserWindowTelemetry.prototype, "unresponsiveInfo", {
        get: function () {
            return this._unresponsiveInfo;
        },
        enumerable: true,
        configurable: true
    });
    BrowserWindowTelemetry.prototype.monitor = function (browserWindow) {
        this.monitorForResponsiveEvent(browserWindow);
        this.monitorForShow(browserWindow);
        this.monitorForReady(browserWindow);
        this.monitorForSessionEnd(browserWindow);
        this.monitorForUnresponsiveEvents(browserWindow);
    };
    BrowserWindowTelemetry.prototype.monitorFactory = function (browserWindowFactory) {
        var _this = this;
        var telemetryScope;
        browserWindowFactory.onBeforeWindowCreated(function () {
            telemetryScope = _this._telemetry.startOperation(TelemetryEventNames_1.BROWSER_WINDOW_CREATE, {});
        });
        browserWindowFactory.onWindowCreated(function () {
            if (!telemetryScope) {
                return;
            }
            telemetryScope.end(Telemetry_1.TelemetryResult.Success, {});
            telemetryScope = null;
        });
    };
    BrowserWindowTelemetry.prototype.monitorForShow = function (browserWindow) {
        var _this = this;
        browserWindow.on(browser_window_1.SHOW_EVENT, function () {
            _this._logger.writeVerbose("Window showing");
            _this._telemetry.postOperation(TelemetryEventNames_1.BROWSER_WINDOW_SHOW, Telemetry_1.TelemetryResult.Success, "Window showing", {});
        });
    };
    BrowserWindowTelemetry.prototype.monitorForReady = function (browserWindow) {
        var _this = this;
        browserWindow.webContents.on(browser_window_1.WC_DID_FINISH_LOAD, function () {
            _this._logger.writeVerbose("Window ready");
            _this._telemetry.postOperation(TelemetryEventNames_1.BROWSER_WINDOW_READY, Telemetry_1.TelemetryResult.Success, "Window ready", {});
        });
    };
    BrowserWindowTelemetry.prototype.monitorForSessionEnd = function (browserWindow) {
        var _this = this;
        browserWindow.on(browser_window_1.SESSION_END_EVENT, function () {
            _this._logger.writeVerbose("Received " + browser_window_1.SESSION_END_EVENT + " event. Finalizing telemetry operations.");
            var properties = { ResultDetails: browser_window_1.SESSION_END_EVENT };
            _this._telemetry.finalizeOperationsAndSendPendingData(properties);
        });
    };
    BrowserWindowTelemetry.prototype.monitorForUnresponsiveEvents = function (browserWindow) {
        var _this = this;
        browserWindow.on(browser_window_1.UNRESPONSIVE_EVENT, function () {
            _this.setUnresponsiveInfo();
            _this._logger.writeWarning("Window unresponsive");
            _this._telemetry.postError(TelemetryEventNames_1.BROWSER_WINDOW_UNRESPONSIVE, "Browser window unresponsive", new bucket_parameters_1.BucketParameters("monitorForUnresponsiveEvents", _this.constructor.name));
        });
    };
    BrowserWindowTelemetry.prototype.monitorForResponsiveEvent = function (browserWindow) {
        var _this = this;
        browserWindow.on(browser_window_1.RESPONSIVE_EVENT, function () {
            var endTime = new Date(Date.now());
            var startTime = _this._unresponsiveInfo && _this._unresponsiveInfo.startTime;
            // Send 0 to signify that the responsive event was received without a "Unresponsive" event.
            var durationMs = startTime ? +endTime - +startTime : 0;
            _this._logger.writeVerbose("Window responsive, startTime=" + startTime + ",endTime=" + endTime + ", durationMs=" + durationMs);
            _this._telemetry.postError(TelemetryEventNames_1.BROWSER_WINDOW_RESPONSIVE, "Browser window responsive", new bucket_parameters_1.BucketParameters("monitorForResponsiveEvent", _this.constructor.name), null, {
                startTime: startTime ? startTime.toISOString() : "",
                endTime: endTime.toISOString(),
                durationMs: durationMs,
            });
            _this.clearUnresponsiveInfo();
        });
    };
    BrowserWindowTelemetry.prototype.setUnresponsiveInfo = function () {
        if (this._unresponsiveInfo) {
            return;
        }
        this._unresponsiveInfo = {
            startTime: new Date(Date.now()),
        };
    };
    BrowserWindowTelemetry.prototype.clearUnresponsiveInfo = function () {
        this._unresponsiveInfo = null;
    };
    return BrowserWindowTelemetry;
}());
exports.BrowserWindowTelemetry = BrowserWindowTelemetry;
//# sourceMappingURL=browser-window-telemetry.js.map