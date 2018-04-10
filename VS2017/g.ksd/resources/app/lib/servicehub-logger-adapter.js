/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serviceHub = require("microsoft-servicehub");
var requires = require("./requires");
var ServiceHubLoggerAdapter = /** @class */ (function () {
    function ServiceHubLoggerAdapter(logger) {
        requires.notNullOrUndefined(logger, "logger");
        this._logger = logger;
    }
    ServiceHubLoggerAdapter.prototype.critical = function (message) {
        this._logger.writeError(message);
    };
    ServiceHubLoggerAdapter.prototype.error = function (message) {
        this._logger.writeError(message);
    };
    ServiceHubLoggerAdapter.prototype.warn = function (message) {
        this._logger.writeWarning(message);
    };
    ServiceHubLoggerAdapter.prototype.info = function (message) {
        this._logger.writeVerbose(message);
    };
    ServiceHubLoggerAdapter.prototype.verbose = function (message) {
        this._logger.writeVerbose(message);
    };
    ServiceHubLoggerAdapter.prototype.log = function (message) {
        this._logger.writeVerbose(message);
    };
    ServiceHubLoggerAdapter.prototype.isEnabled = function (level) {
        // return false for log levels information and verbose; otherwise, return true
        switch (level) {
            default:
                return true;
            case serviceHub.LogLevel.Information:
            case serviceHub.LogLevel.Verbose:
                return false;
        }
    };
    return ServiceHubLoggerAdapter;
}());
exports.ServiceHubLoggerAdapter = ServiceHubLoggerAdapter;
//# sourceMappingURL=servicehub-logger-adapter.js.map