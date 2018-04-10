/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var feedback_ipc_rpc_service_1 = require("./feedback-ipc-rpc-service");
/**
 * Provides {IFeedbackInfo} to the renderer process. Requires
 * a {FeedbackIpcRpcService} listening on the same channel as the
 * {RpcClient}
 */
var FeedbackInfoProxy = /** @class */ (function () {
    function FeedbackInfoProxy(rpc) {
        this._rpc = rpc;
    }
    FeedbackInfoProxy.prototype.getInfo = function () {
        return this.invoke(feedback_ipc_rpc_service_1.FeedbackProxyServiceMethod.getInfo);
    };
    FeedbackInfoProxy.prototype.invoke = function (method) {
        // following line helps to avoid an issue with typescript code generation
        // where an additional variable is added in an unreachable path, so code
        // coverage fails.
        var that = this._rpc;
        return that.invoke(this.getMethodName(method));
    };
    FeedbackInfoProxy.prototype.getMethodName = function (method) {
        return feedback_ipc_rpc_service_1.FeedbackProxyServiceMethod[method];
    };
    return FeedbackInfoProxy;
}());
exports.FeedbackInfoProxy = FeedbackInfoProxy;
//# sourceMappingURL=feedback-info-proxy.js.map