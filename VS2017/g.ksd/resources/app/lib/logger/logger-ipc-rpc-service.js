/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/* istanbul ignore next */
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
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var ipc_rpc_service_1 = require("../ipc/ipc-rpc-service");
var LoggerServiceMethod;
(function (LoggerServiceMethod) {
    LoggerServiceMethod[LoggerServiceMethod["shouldWriteToConsole"] = 0] = "shouldWriteToConsole";
    LoggerServiceMethod[LoggerServiceMethod["writeVerbose"] = 1] = "writeVerbose";
    LoggerServiceMethod[LoggerServiceMethod["writeWarning"] = 2] = "writeWarning";
    LoggerServiceMethod[LoggerServiceMethod["writeError"] = 3] = "writeError";
    LoggerServiceMethod[LoggerServiceMethod["getLogFilePath"] = 4] = "getLogFilePath";
})(LoggerServiceMethod = exports.LoggerServiceMethod || (exports.LoggerServiceMethod = {}));
exports.LOGGER_SERVICE_CHANNEL = "LoggerService";
/**
 * Handles requests from {LoggerService}
 */
var LoggerIpcRpcService = /** @class */ (function (_super) {
    __extends(LoggerIpcRpcService, _super);
    function LoggerIpcRpcService(ipc, channelId, logger) {
        var _this = _super.call(this, ipc, channelId, logger) || this;
        requires.notNullOrUndefined(logger, "logger");
        _this._logger.writeVerbose(LoggerIpcRpcService.name + " listening to ipc channel: " + channelId);
        return _this;
    }
    LoggerIpcRpcService.prototype.shouldWriteToConsole = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var shouldWriteToConsole = _this._logger.shouldWriteToConsole;
            resolve(shouldWriteToConsole);
        });
    };
    LoggerIpcRpcService.prototype.writeVerbose = function (message) {
        var _this = this;
        return new Promise(function (resolve) {
            _this._logger.writeVerbose(message);
            resolve();
        });
    };
    LoggerIpcRpcService.prototype.writeWarning = function (message) {
        var _this = this;
        return new Promise(function (resolve) {
            _this._logger.writeWarning(message);
            resolve();
        });
    };
    LoggerIpcRpcService.prototype.writeError = function (message) {
        var _this = this;
        return new Promise(function (resolve) {
            _this._logger.writeError(message);
            resolve();
        });
    };
    LoggerIpcRpcService.prototype.getLogFilePath = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var filePath = _this._logger.getLogFilePath();
            resolve(filePath);
        });
    };
    return LoggerIpcRpcService;
}(ipc_rpc_service_1.IpcRpcService));
exports.LoggerIpcRpcService = LoggerIpcRpcService;
//# sourceMappingURL=logger-ipc-rpc-service.js.map