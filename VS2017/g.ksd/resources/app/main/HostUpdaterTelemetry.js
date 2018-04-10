/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TelemetryEventNames = require("../lib/Telemetry/TelemetryEventNames");
var HostUpdaterEvents_1 = require("./HostUpdaterEvents");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var HostUpdaterTelemetry = /** @class */ (function () {
    function HostUpdaterTelemetry(hostUpdater, telemetry) {
        this._hostUpdater = hostUpdater;
        this._telemetry = telemetry;
        this._hostUpdater.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOADING, this.onUpdateDownloading.bind(this));
        this._hostUpdater.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOADED, this.onUpdateDownloaded.bind(this));
        this._hostUpdater.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOAD_FAILED, this.onUpdateDownloadFailed.bind(this));
    }
    HostUpdaterTelemetry.prototype.onUpdateDownloading = function (event) {
        this._downloadStartTime = Date.now();
    };
    HostUpdaterTelemetry.prototype.onUpdateDownloadFailed = function (error) {
        this._telemetry.postOperation(TelemetryEventNames.APPLICATION_UPDATE_DOWNLOAD_FINISHED, vs_telemetry_api_1.TelemetryResult.Failure, "Update download failed", {
            name: "bootstrapper",
            duration: Date.now() - this._downloadStartTime,
            success: "false",
            error: error.error.code
        });
    };
    HostUpdaterTelemetry.prototype.onUpdateDownloaded = function (event) {
        this._telemetry.postOperation(TelemetryEventNames.APPLICATION_UPDATE_DOWNLOAD_FINISHED, vs_telemetry_api_1.TelemetryResult.Success, "Update download successful", {
            name: "bootstrapper",
            duration: Date.now() - this._downloadStartTime,
            success: "true",
        });
    };
    return HostUpdaterTelemetry;
}());
exports.HostUpdaterTelemetry = HostUpdaterTelemetry;
//# sourceMappingURL=HostUpdaterTelemetry.js.map