/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var TelemetryIpc_1 = require("../../lib/Telemetry/TelemetryIpc");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var TelemetryProxy = /** @class */ (function () {
    function TelemetryProxy() {
    }
    TelemetryProxy.prototype.postOperation = function (opName, result, resultSummary, properties) {
        this.sendIpcAtomicEvent(opName, false, properties, result, resultSummary);
        return Promise.resolve();
    };
    TelemetryProxy.prototype.sendIpcAtomicEvent = function (eventName, isUserTask, properties, result, resultSummary) {
        if (properties === void 0) { properties = {}; }
        if (result === void 0) { result = vs_telemetry_api_1.TelemetryResult.None; }
        if (resultSummary === void 0) { resultSummary = ""; }
        var params = {
            eventName: eventName,
            eventType: TelemetryIpc_1.TelemetryIpc.ATOMIC_EVENT,
            properties: properties,
            isUserTask: isUserTask,
            result: result,
            resultSummary: resultSummary,
        };
        electron_1.ipcRenderer.send(TelemetryIpc_1.TelemetryIpc.CHANNEL, params);
    };
    TelemetryProxy.prototype.sendIpcStartUserTask = function (eventName, eventId, properties) {
        var params = {
            eventName: eventName,
            eventType: TelemetryIpc_1.TelemetryIpc.USER_TASK_START,
            eventId: eventId,
            result: vs_telemetry_api_1.TelemetryResult.None,
            properties: properties,
        };
        electron_1.ipcRenderer.send(TelemetryIpc_1.TelemetryIpc.CHANNEL, params);
    };
    TelemetryProxy.prototype.sendIpcEndUserTask = function (eventName, eventId, properties, result) {
        var params = {
            eventName: eventName,
            eventType: TelemetryIpc_1.TelemetryIpc.USER_TASK_END,
            eventId: eventId,
            result: result,
            properties: properties,
        };
        electron_1.ipcRenderer.send(TelemetryIpc_1.TelemetryIpc.CHANNEL, params);
    };
    TelemetryProxy.prototype.postError = function (eventName, description, bucketParameters, error, properties, severity) {
        var params = {
            eventName: eventName,
            eventType: TelemetryIpc_1.TelemetryIpc.FAULT,
            description: description,
            bucketParameters: bucketParameters,
            error: error,
            properties: properties,
            severity: severity
        };
        electron_1.ipcRenderer.send(TelemetryIpc_1.TelemetryIpc.CHANNEL, params);
        return Promise.resolve();
    };
    TelemetryProxy.prototype.setCommonProperty = function (propertyName, propertyValue, doNotPrefix) {
        if (doNotPrefix === void 0) { doNotPrefix = false; }
        var params = {
            eventType: TelemetryIpc_1.TelemetryIpc.SET_COMMON_PROPERTY,
            propertyName: propertyName,
            propertyValue: propertyValue,
            doNotPrefix: doNotPrefix,
        };
        electron_1.ipcRenderer.send(TelemetryIpc_1.TelemetryIpc.CHANNEL, params);
        return Promise.resolve();
    };
    return TelemetryProxy;
}());
exports.TelemetryProxy = TelemetryProxy;
exports.telemetryProxy = new TelemetryProxy();
//# sourceMappingURL=TelemetryProxy.js.map