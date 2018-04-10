/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var logger_ipc_rpc_service_1 = require("./logger-ipc-rpc-service");
var LoggerProxy = /** @class */ (function () {
    function LoggerProxy(rpc) {
        requires.notNullOrUndefined(rpc, "rpc");
        this._rpc = rpc;
    }
    LoggerProxy.prototype.shouldWriteToConsole = function () {
        return this.invoke(logger_ipc_rpc_service_1.LoggerServiceMethod.shouldWriteToConsole);
    };
    LoggerProxy.prototype.writeVerbose = function (message) {
        return this.invoke(logger_ipc_rpc_service_1.LoggerServiceMethod.writeVerbose, message);
    };
    LoggerProxy.prototype.writeWarning = function (message) {
        return this.invoke(logger_ipc_rpc_service_1.LoggerServiceMethod.writeWarning, message);
    };
    LoggerProxy.prototype.writeError = function (message) {
        return this.invoke(logger_ipc_rpc_service_1.LoggerServiceMethod.writeError, message);
    };
    LoggerProxy.prototype.getLogFilePath = function () {
        return this.invoke(logger_ipc_rpc_service_1.LoggerServiceMethod.getLogFilePath);
    };
    LoggerProxy.prototype.invoke = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // following line helps to avoid an issue with typescript code generation
        // where an additional variable is added in an unreachable path, so code
        // coverage fails.
        var that = this._rpc;
        return that.invoke.apply(that, [this.getMethodName(method)].concat(args));
    };
    LoggerProxy.prototype.getMethodName = function (method) {
        return logger_ipc_rpc_service_1.LoggerServiceMethod[method];
    };
    return LoggerProxy;
}());
exports.LoggerProxy = LoggerProxy;
//# sourceMappingURL=logger-proxy.js.map