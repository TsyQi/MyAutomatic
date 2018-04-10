/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var TelemetryIpc_1 = require("../../lib/Telemetry/TelemetryIpc");
var vs_telemetry_api_1 = require("vs-telemetry-api");
// TODO: Remove casts and uncomment default case after updating typescript.
// Task 299352
var TelemetryService = /** @class */ (function () {
    function TelemetryService(telemetry) {
        this._userTasks = {};
        this._telemetry = telemetry;
        electron_1.ipcMain.on(TelemetryIpc_1.TelemetryIpc.CHANNEL, this.requestReceived.bind(this));
    }
    TelemetryService.prototype.requestReceived = function (event, params) {
        switch (params.eventType) {
            case TelemetryIpc_1.TelemetryIpc.USER_TASK_START:
                this.handleUserTaskStart(params);
                break;
            case TelemetryIpc_1.TelemetryIpc.USER_TASK_END:
                this.handleUserTaskEnd(params);
                break;
            case TelemetryIpc_1.TelemetryIpc.FAULT:
                this.handleFaultEvent(params);
                break;
            case TelemetryIpc_1.TelemetryIpc.ATOMIC_EVENT:
                this.handleAtomicEvent(params);
                break;
            case TelemetryIpc_1.TelemetryIpc.SET_COMMON_PROPERTY:
                this.setCommonProperty(params);
                break;
            default:
                // by assigning params to a never variable we cannot compile if we do not cover all cases
                var shouldNeverBeHere = params;
                break;
        }
    };
    TelemetryService.prototype.dispose = function () {
        for (var id in this._userTasks) {
            if (this._userTasks[id] && !this._userTasks[id].isEnded) {
                this._userTasks[id].end(vs_telemetry_api_1.TelemetryResult.None, null);
                delete this._userTasks[id];
            }
        }
    };
    TelemetryService.prototype.handleUserTaskStart = function (params) {
        var newUserTask = this._telemetry.startUserTask(params.eventName, params.properties);
        this._userTasks[params.eventId] = newUserTask;
    };
    TelemetryService.prototype.handleUserTaskEnd = function (params) {
        var existingUserTask = this._userTasks[params.eventId];
        if (existingUserTask) {
            existingUserTask.end(params.result, params.properties);
            delete this._userTasks[params.eventId];
        }
    };
    TelemetryService.prototype.handleFaultEvent = function (params) {
        this._telemetry.postError(params.eventName, params.description, params.bucketParameters, params.error, params.properties, params.severity);
    };
    TelemetryService.prototype.handleAtomicEvent = function (params) {
        if (params.isUserTask) {
            this._telemetry.postUserTask(params.eventName, params.result, params.resultSummary, params.properties);
        }
        else {
            this._telemetry.postOperation(params.eventName, params.result, params.resultSummary, params.properties);
        }
    };
    TelemetryService.prototype.setCommonProperty = function (params) {
        this._telemetry.setCommonProperty(params.propertyName, params.propertyValue, params.doNotPrefix);
    };
    return TelemetryService;
}());
exports.TelemetryService = TelemetryService;
//# sourceMappingURL=TelemetryService.js.map