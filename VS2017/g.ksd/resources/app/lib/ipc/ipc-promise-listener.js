/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class for services to handle messages sent by {IpcPromise}
 */
var IpcPromiseListener = /** @class */ (function () {
    function IpcPromiseListener(ipc, channelId) {
        var _this = this;
        this._outstandingRequests = new Set();
        this._channelId = channelId;
        this._ipc = ipc;
        this._ipc.on(channelId, function (event, arg) {
            var result;
            var handleRequestError;
            try {
                result = _this.handleRequest.apply(_this, arg.args);
            }
            catch (e) {
                handleRequestError = e;
            }
            var resultPromise = handleRequestError === undefined
                ? Promise.resolve(result)
                : Promise.reject(handleRequestError);
            var requestPromise = resultPromise
                .then(function (response) {
                return _this.createWrappedResponse(arg.id, response);
            }, function (error) {
                return _this.createWrappedResponseRejection(arg.id, error);
            })
                .then(function (response) {
                _this._outstandingRequests.delete(requestPromise);
                event.sender.send(_this._channelId, response);
            })
                .catch(function (e) {
                _this.onHandleRequestError({
                    error: e,
                    request: arg,
                });
            });
            _this._outstandingRequests.add(requestPromise);
        });
    }
    IpcPromiseListener.prototype.waitForPendingRequests = function () {
        return Promise.all(Array.from(this._outstandingRequests.values()))
            .then(function () { return; });
    };
    IpcPromiseListener.prototype.createWrappedResponse = function (requestId, response) {
        return {
            requestId: requestId,
            response: response,
            error: null,
        };
    };
    IpcPromiseListener.prototype.createWrappedResponseRejection = function (requestId, error) {
        return {
            requestId: requestId,
            response: null,
            error: this.errorToIpc(error),
        };
    };
    IpcPromiseListener.prototype.errorToIpc = function (error) {
        if (!error) {
            error = new Error("No error provided");
        }
        if (error.toJson) {
            return error.toJson();
        }
        return {
            message: error.message,
            name: error.name,
            stack: error.stack,
        };
    };
    return IpcPromiseListener;
}());
exports.IpcPromiseListener = IpcPromiseListener;
//# sourceMappingURL=ipc-promise-listener.js.map