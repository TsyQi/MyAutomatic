/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var features_ipc_rpc_service_1 = require("./features-ipc-rpc-service");
/**
 * Provides {IFeatures} to the renderer process. Requires
 * a {FeaturesIpcRpcService} listening on the same channel as the
 * {RpcClient}
 */
var FeaturesProxy = /** @class */ (function () {
    function FeaturesProxy(rpc) {
        this._rpc = rpc;
    }
    FeaturesProxy.prototype.isEnabled = function (feature) {
        return this.invoke(features_ipc_rpc_service_1.FeaturesProxyServiceMethod.isEnabled, feature);
    };
    FeaturesProxy.prototype.invoke = function (method) {
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
    FeaturesProxy.prototype.getMethodName = function (method) {
        return features_ipc_rpc_service_1.FeaturesProxyServiceMethod[method];
    };
    return FeaturesProxy;
}());
exports.FeaturesProxy = FeaturesProxy;
//# sourceMappingURL=features-proxy.js.map