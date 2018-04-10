"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var path_1 = require("path");
var FileSystem_1 = require("./FileSystem");
var requires = require("./requires");
var string_utilities_1 = require("./string-utilities");
/* tslint:disable:no-string-literal */
exports.DEFAULT_LOGGER_DIRECTORY = process.env["temp"];
/* tslint:enable */
exports.DEFAULT_LOGGER_CLIENT_NAME = "client";
var loggerInstancesByClientName = new Map();
/**
 * Creates a logger implementing the ILogger interface.
 *
 * @param string clientName
 *     A name that identifies the client of the log. The log file name will be generated
 *     as dd_clientName_YYYYMMDDHHMMSS.log
 *     (example: dd_installer_20160707143307.log)
 */
function createLogger(clientName, directory) {
    if (clientName === void 0) { clientName = exports.DEFAULT_LOGGER_CLIENT_NAME; }
    if (directory === void 0) { directory = exports.DEFAULT_LOGGER_DIRECTORY; }
    var logFileName = getLogFileName(clientName, getLogFileDateTime());
    var logPath = path_1.join(directory, logFileName);
    var logger = new Logger(logPath);
    loggerInstancesByClientName.set(clientName, logger);
    return logger;
}
exports.createLogger = createLogger;
function getLogger(clientName) {
    if (clientName === void 0) { clientName = exports.DEFAULT_LOGGER_CLIENT_NAME; }
    return loggerInstancesByClientName.get(clientName) || createLogger(clientName);
}
exports.getLogger = getLogger;
var TraceLevel;
(function (TraceLevel) {
    TraceLevel[TraceLevel["Warning"] = 0] = "Warning";
    TraceLevel[TraceLevel["Error"] = 1] = "Error";
    TraceLevel[TraceLevel["Verbose"] = 2] = "Verbose";
})(TraceLevel = exports.TraceLevel || (exports.TraceLevel = {}));
function getFomattedMessage(traceLevel, message) {
    var entryDateTime = getLogEntryDateTime();
    var entryLevel = TraceLevel[traceLevel];
    return entryDateTime + " : " + entryLevel + " : " + message + os_1.EOL;
}
exports.getFomattedMessage = getFomattedMessage;
function getLogFileDateTime(now, includeMilliseconds) {
    if (now === void 0) { now = new Date(); }
    if (includeMilliseconds === void 0) { includeMilliseconds = false; }
    var year = now.getFullYear();
    var month = string_utilities_1.zeroFill(now.getMonth() + 1, 2);
    var date = string_utilities_1.zeroFill(now.getDate(), 2);
    var hours = string_utilities_1.zeroFill(now.getHours(), 2);
    var minutes = string_utilities_1.zeroFill(now.getMinutes(), 2);
    var seconds = string_utilities_1.zeroFill(now.getSeconds(), 2);
    var result = "" + year + month + date + hours + minutes + seconds;
    if (includeMilliseconds) {
        var milliseconds = string_utilities_1.zeroFill(now.getMilliseconds(), 3);
        result += milliseconds;
    }
    return result;
}
exports.getLogFileDateTime = getLogFileDateTime;
function getLogEntryDateTime(now) {
    if (now === void 0) { now = new Date(); }
    var year = now.getFullYear();
    var month = string_utilities_1.zeroFill(now.getMonth() + 1, 2);
    var date = string_utilities_1.zeroFill(now.getDate(), 2);
    var hours = string_utilities_1.zeroFill(now.getHours(), 2);
    var minutes = string_utilities_1.zeroFill(now.getMinutes(), 2);
    var seconds = string_utilities_1.zeroFill(now.getSeconds(), 2);
    return year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds;
}
exports.getLogEntryDateTime = getLogEntryDateTime;
function getLogFileName(clientName, timeSuffix) {
    return "dd_" + clientName + "_" + timeSuffix + ".log";
}
exports.getLogFileName = getLogFileName;
var Logger = /** @class */ (function () {
    function Logger(logPath, shouldWriteToConsole) {
        if (shouldWriteToConsole === void 0) { shouldWriteToConsole = false; }
        requires.stringNotEmpty(logPath, "logPath");
        this._logPath = logPath;
        this._shouldWriteToConsole = shouldWriteToConsole;
    }
    Logger.prototype.writeError = function (message) {
        this.writeMessage(TraceLevel.Error, message);
    };
    Logger.prototype.writeWarning = function (message) {
        this.writeMessage(TraceLevel.Warning, message);
    };
    Logger.prototype.writeVerbose = function (message) {
        this.writeMessage(TraceLevel.Verbose, message);
    };
    Logger.prototype.getLogFilePath = function () {
        return this._logPath;
    };
    Object.defineProperty(Logger.prototype, "shouldWriteToConsole", {
        /* istanbul ignore next */
        get: function () {
            return this._shouldWriteToConsole;
        },
        /* istanbul ignore next */
        set: function (value) {
            this._shouldWriteToConsole = value;
        },
        enumerable: true,
        configurable: true
    });
    Logger.prototype.writeMessage = function (traceLevel, message) {
        if (!message) {
            return;
        }
        message = getFomattedMessage(traceLevel, message);
        try {
            if (this.shouldWriteToConsole) {
                /* istanbul ignore next */
                this.writeToConsole(traceLevel, message);
            }
            FileSystem_1.appendTextSync(this._logPath, message);
        }
        catch (error) {
            console.error("Failed to write to log file. [logPath: " + this._logPath + ", message: " + message + "]");
        }
    };
    /* istanbul ignore next */
    Logger.prototype.writeToConsole = function (traceLevel, message) {
        if (traceLevel === TraceLevel.Error) {
            console.error(message);
        }
        else if (traceLevel === TraceLevel.Warning) {
            console.warn(message);
        }
        else {
            console.log(message);
        }
    };
    return Logger;
}());
//# sourceMappingURL=Logger.js.map