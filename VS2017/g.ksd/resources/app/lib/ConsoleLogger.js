/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConsoleLogger = /** @class */ (function () {
    function ConsoleLogger() {
    }
    ConsoleLogger.prototype.writeError = function (message) {
        console.error(message);
    };
    ConsoleLogger.prototype.writeWarning = function (message) {
        console.warn(message);
    };
    ConsoleLogger.prototype.writeVerbose = function (message) {
        console.log(message);
    };
    ConsoleLogger.prototype.getLogFilePath = function () {
        return undefined;
    };
    Object.defineProperty(ConsoleLogger.prototype, "shouldWriteToConsole", {
        get: function () {
            return true;
        },
        set: function (value) {
            // should always write to console.
        },
        enumerable: true,
        configurable: true
    });
    return ConsoleLogger;
}());
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=ConsoleLogger.js.map