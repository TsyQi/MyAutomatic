/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
var promise_completion_source_1 = require("../promise-completion-source");
/**
 * The ID for the next request.
 */
var nextRequestId = 0;
/**
 * Sends messages to a {IpcPromiseListener} and waits for a response.
 */
var IpcPromise = /** @class */ (function () {
    function IpcPromise(ipc, channelId, readyPromise) {
        var _this = this;
        this._requestMap = new Map();
        this._channelId = channelId;
        this._ipc = ipc;
        this._readyPromise = readyPromise || Promise.resolve(true);
        this._ipc.on(channelId, function (event, res) {
            if (!_this.canHandleResponse(res)) {
                return;
            }
            if (!res.error) {
                _this.resolvePromiseSource(res.requestId, res.response);
            }
            else {
                _this.rejectPromiseSource(res.requestId, res.error);
            }
        });
    }
    /**
     * Returns a promise which resolves with the result {T}
     * or rejects with an {Error}
     * @param args arguments to send over the channel
     */
    IpcPromise.prototype.send = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var requestId = this.getRequestId();
        var promiseSource = this.createPromiseSource(requestId);
        var req = this.createWrappedRequest(requestId, args);
        this._ipc.send(this._channelId, req);
        return this._readyPromise.then(function () { return promiseSource.promise; });
    };
    IpcPromise.prototype.createPromiseSource = function (requestId) {
        var promiseSource = new promise_completion_source_1.PromiseCompletionSource();
        this._requestMap.set(requestId.toString(), promiseSource);
        return promiseSource;
    };
    IpcPromise.prototype.createWrappedRequest = function (id, args) {
        return {
            id: id,
            args: args,
        };
    };
    IpcPromise.prototype.removePromiseSource = function (requestId) {
        var promiseSource = this._requestMap.get(requestId);
        this._requestMap.delete(requestId);
        return promiseSource;
    };
    IpcPromise.prototype.resolvePromiseSource = function (requestId, response) {
        var promiseSource = this.removePromiseSource(requestId);
        promiseSource.resolve(response);
    };
    IpcPromise.prototype.rejectPromiseSource = function (requestId, error) {
        var promiseSource = this.removePromiseSource(requestId);
        var unpackedError = this.errorFromIpc(error);
        promiseSource.reject(unpackedError);
    };
    IpcPromise.prototype.errorFromIpc = function (error) {
        var unpackedError;
        if (typeof error === "string") {
            unpackedError = errors_1.CustomErrorBase.fromJson(error);
        }
        else {
            unpackedError = new Error(error.message);
            unpackedError.name = error.name;
            unpackedError.stack = error.stack;
        }
        return unpackedError;
    };
    IpcPromise.prototype.canHandleResponse = function (res) {
        return this._requestMap.has(res.requestId);
    };
    IpcPromise.prototype.getRequestId = function () {
        return "" + nextRequestId++;
    };
    return IpcPromise;
}());
exports.IpcPromise = IpcPromise;
//# sourceMappingURL=ipc-promise.js.map