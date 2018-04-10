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
var ipc_promise_listener_1 = require("./ipc-promise-listener");
/**
 * Listen for requests from {IpcRpc} sent on a channel.
 */
var IpcRpcService = /** @class */ (function (_super) {
    __extends(IpcRpcService, _super);
    function IpcRpcService(ipc, channelId, logger) {
        var _this = _super.call(this, ipc, channelId) || this;
        _this._logger = logger;
        _this.tryWriteVerbose(_this.constructor.name + " listening to ipc channel: " + channelId);
        return _this;
    }
    IpcRpcService.prototype.onHandleRequestError = function (error) {
        var request = error && error.request && error.request.args[0];
        var method = request.method || "undefined";
        this.tryWriteError(this.constructor.name + " invocation error. [method=" + method + "] error=" + error.error);
    };
    IpcRpcService.prototype.handleRequest = function (request) {
        var fn = this[request.method];
        if (!fn || typeof fn !== "function") {
            return Promise.reject(new Error("Cannot invoke: " + request.method));
        }
        return fn.apply(this, request.args);
    };
    IpcRpcService.prototype.tryWriteVerbose = function (message) {
        if (!this._logger) {
            return;
        }
        this._logger.writeVerbose(message);
    };
    IpcRpcService.prototype.tryWriteError = function (message) {
        if (!this._logger) {
            return;
        }
        this._logger.writeError(message);
    };
    return IpcRpcService;
}(ipc_promise_listener_1.IpcPromiseListener));
exports.IpcRpcService = IpcRpcService;
//# sourceMappingURL=ipc-rpc-service.js.map