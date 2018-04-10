/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../../typings/globals/q/index.d.ts" />
/// <reference path="../../typings/lib-missing-declares.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var microsoft_servicehub_1 = require("microsoft-servicehub");
var Logger_1 = require("../Logger");
var requires = require("../requires");
var servicehub_logger_adapter_1 = require("../servicehub-logger-adapter");
var CLOSE_EVENT = "JsonRpcStreamClosed";
var logger = Logger_1.getLogger();
var serviceHubLogger = new servicehub_logger_adapter_1.ServiceHubLoggerAdapter(logger);
var ServiceHubClient = /** @class */ (function () {
    function ServiceHubClient(stream) {
        var methodNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            methodNames[_i - 1] = arguments[_i];
        }
        var _this = this;
        this._eventEmitter = new events_1.EventEmitter();
        requires.notNullOrUndefined(stream, "stream");
        this._stream = stream;
        this._rpc = microsoft_servicehub_1.JsonRpcConnection.attach(stream, serviceHubLogger, this, methodNames);
        this._rpc.onClose(function () {
            logger.writeVerbose("[" + _this.constructor.name + "]: Rpc connection was closed.");
            _this._eventEmitter.emit(CLOSE_EVENT);
        });
    }
    ServiceHubClient.prototype.onClose = function (cb) {
        this._eventEmitter.on(CLOSE_EVENT, cb);
    };
    ServiceHubClient.prototype.end = function () {
        var _this = this;
        if (this._endPromise) {
            return this._endPromise;
        }
        this._endPromise = new Promise(function (resolve, reject) {
            _this._stream.on("close", function (hadError) {
                if (hadError) {
                    logger.writeError("Stream closed ungracefully");
                }
                logger.writeVerbose("[" + _this.constructor.name + "]: Stream was closed");
                resolve();
                _this._endPromise = null;
            });
            _this._stream.on("data", function (_data) { return logger.writeError("Error rpc received after " + _this.constructor.name + " closed the connection to the service."); });
            _this._stream.end();
            _this._rpc.dispose();
        });
        return this._endPromise;
    };
    ServiceHubClient.prototype.invoke = function (method, params) {
        return this._rpc.sendRequest(method, params);
    };
    return ServiceHubClient;
}());
exports.ServiceHubClient = ServiceHubClient;
//# sourceMappingURL=service-hub-client.js.map