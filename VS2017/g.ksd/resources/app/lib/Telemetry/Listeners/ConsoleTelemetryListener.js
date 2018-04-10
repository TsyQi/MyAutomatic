/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var telemetry_scope_aggregator_1 = require("../scopes/telemetry-scope-aggregator");
var UNIQUE_EVENT_ID = "VSConsoleTelemetryListenerEvent";
var ConsoleTelemetryListener = /** @class */ (function () {
    function ConsoleTelemetryListener(log) {
        if (log === void 0) { log = console.log; }
        this.id = UNIQUE_EVENT_ID;
        this._log = log;
    }
    ConsoleTelemetryListener.prototype.sendPendingData = function () {
        return new Promise(function (resolve) { return resolve(); });
    };
    ConsoleTelemetryListener.prototype.finalizeOperationsAndSendPendingData = function (properties) {
        if (properties === void 0) { properties = {}; }
        return this.sendPendingData();
    };
    ConsoleTelemetryListener.prototype.postAsset = function (name, assetId, assetVersion, properties, severity) {
        this.log(this.now() + ": [" + name + "] " + " : " +
            assetId + " : " +
            assetVersion + " : " +
            JSON.stringify(properties, null, 4));
        return [];
    };
    ConsoleTelemetryListener.prototype.postError = function (name, description, bucketParameters, error, properties, severity) {
        this.log(this.now() +
            ": [" + name + "] " +
            description + " : " +
            "methodName: " + bucketParameters.methodName +
            "moduleName: " + bucketParameters.moduleName +
            error.name + " : " +
            error.message);
        return [];
    };
    ConsoleTelemetryListener.prototype.postOperation = function (name, result, resultSummary, properties, severity, assetsToCorrelate) {
        this.log(this.now() +
            ": " + "OPERATION" +
            ": [" + name + "] " +
            result.toString + " : " +
            resultSummary + " : " +
            severity + " : " +
            JSON.stringify(properties, null, 4));
        return [];
    };
    ConsoleTelemetryListener.prototype.postUserTask = function (name, result, resultSummary, properties, severity) {
        this.log(this.now() +
            ": " + "USER TASK" +
            ": [" + name + "] " +
            result.toString + " : " +
            resultSummary + " : " +
            severity + " : " +
            JSON.stringify(properties, null, 4));
        return [];
    };
    ConsoleTelemetryListener.prototype.startOperation = function (opName, properties) {
        if (properties === void 0) { properties = {}; }
        this.log(this.now() +
            ": " + "START OPERATION" +
            ": [" + opName + "] " +
            JSON.stringify(properties, null, 4));
        return new telemetry_scope_aggregator_1.TelemetryScopeAggregator([]);
    };
    ConsoleTelemetryListener.prototype.startUserTask = function (opName, properties) {
        if (properties === void 0) { properties = {}; }
        this.log(this.now() +
            ": " + "START USER TASK" +
            ": [" + opName + "] " +
            JSON.stringify(properties, null, 4));
        return new telemetry_scope_aggregator_1.TelemetryScopeAggregator([]);
    };
    ConsoleTelemetryListener.prototype.postEventUnprefixed = function (name, properties) {
        this.log(this.now() +
            ": [" + name + "] " +
            JSON.stringify(properties, null, 4));
        return [];
    };
    Object.defineProperty(ConsoleTelemetryListener.prototype, "log", {
        get: function () {
            return this._log;
        },
        enumerable: true,
        configurable: true
    });
    ConsoleTelemetryListener.prototype.setCommonProperty = function (name, value, doNotPrefix) {
        this.log(this.now() +
            ": " + "SET COMMON PROPERTY" +
            ": [" + name.toString() +
            " => " + value + "] " +
            "(doNotPrefix=" + (doNotPrefix ? "true)" : "false)"));
    };
    ConsoleTelemetryListener.prototype.removeCommonProperty = function (name, doNotPrefix) {
        this.log(this.now() +
            ": " + "REMOVE COMMON PROPERTY" +
            ": " + name.toString() +
            " (doNotPrefix=" + (doNotPrefix ? "true)" : "false)"));
    };
    ConsoleTelemetryListener.prototype.now = function () {
        return (new Date()).toLocaleString();
    };
    return ConsoleTelemetryListener;
}());
exports.ConsoleTelemetryListener = ConsoleTelemetryListener;
//# sourceMappingURL=ConsoleTelemetryListener.js.map