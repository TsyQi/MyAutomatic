/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vs_telemetry_api_1 = require("vs-telemetry-api");
var Session_1 = require("../../lib/Session");
var TelemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var requires = require("../../lib/requires");
var DetailsPageActions = /** @class */ (function () {
    function DetailsPageActions(telemetry, appStore) {
        requires.notNullOrUndefined(telemetry, "telemetry");
        requires.notNullOrUndefined(appStore, "appStore");
        this._telemetry = telemetry;
        this._appStore = appStore;
    }
    DetailsPageActions.prototype.startDetailsPageSession = function (mode, channelId, productId, productName, buildVersion, installationId) {
        this._lastDetailsPageSessionId = this.createSessionId();
        var properties = {
            mode: mode,
            channelId: channelId,
            productId: productId,
            productName: productName,
            productBuildVersion: buildVersion,
        };
        this._telemetry.sendIpcStartUserTask(TelemetryEventNames.DETAILS_PAGE_SESSION, this._lastDetailsPageSessionId, properties);
    };
    DetailsPageActions.prototype.endDetailsPageSessionWithSuccess = function () {
        this.endDetailsPageSession(vs_telemetry_api_1.TelemetryResult.Success);
    };
    DetailsPageActions.prototype.endDetailsPageSessionWithFail = function () {
        this.endDetailsPageSession(vs_telemetry_api_1.TelemetryResult.Failure);
    };
    DetailsPageActions.prototype.endDetailsPageSessionWithUserCancel = function () {
        var properties = {
            numberOfInstalls: this._appStore.numberOfInstalls,
        };
        this.endDetailsPageSession(vs_telemetry_api_1.TelemetryResult.UserCancel, properties);
    };
    DetailsPageActions.prototype.sendDiskSizeWarningShown = function () {
        this._telemetry.sendIpcAtomicEvent(TelemetryEventNames.DISK_SIZE_WARNING_SHOWN_TO_USER, false, /* isUserTask */ null);
    };
    DetailsPageActions.prototype.sendDiskSizeWarningIgnored = function () {
        this._telemetry.sendIpcAtomicEvent(TelemetryEventNames.DISK_SIZE_WARNING_IGNORED_BY_USER, true, /* isUserTask */ null);
    };
    DetailsPageActions.prototype.endDetailsPageSession = function (result, properties) {
        this._telemetry.sendIpcEndUserTask(TelemetryEventNames.DETAILS_PAGE_SESSION, this._lastDetailsPageSessionId, properties || null, result);
        this._lastDetailsPageSessionId = null;
    };
    DetailsPageActions.prototype.createSessionId = function () {
        return Session_1.createSessionId();
    };
    return DetailsPageActions;
}());
exports.DetailsPageActions = DetailsPageActions;
//# sourceMappingURL=details-page-actions.js.map