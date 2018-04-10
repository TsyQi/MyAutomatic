/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var remote_settings_ipc_rpc_service_1 = require("./remote-settings-ipc-rpc-service");
/**
 * Provides {IRemoteSettings} to the renderer process. Requires
 * a {RemoteSettingsIpcRpcService} listening on the same channel as the
 * {RpcClient}
 */
var RemoteSettingsProxy = /** @class */ (function () {
    function RemoteSettingsProxy(rpc, controllerReadyPromise) {
        this._readyPromise = controllerReadyPromise || Promise.resolve();
        this._rpc = rpc;
    }
    RemoteSettingsProxy.prototype.getValue = function (collectionPath, key, valueType) {
        return this.invoke(remote_settings_ipc_rpc_service_1.RemoteSettingsProxyServiceMethod.getValue, collectionPath, key, valueType);
    };
    RemoteSettingsProxy.prototype.invoke = function (method) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // following line helps to avoid an issue with typescript code generation
        // where an additional variable is added in an unreachable path, so code
        // coverage fails.
        var that = this._rpc;
        return this._readyPromise.then(function () {
            return that.invoke.apply(that, [_this.getMethodName(method)].concat(args));
        });
    };
    RemoteSettingsProxy.prototype.getMethodName = function (method) {
        return remote_settings_ipc_rpc_service_1.RemoteSettingsProxyServiceMethod[method];
    };
    return RemoteSettingsProxy;
}());
exports.RemoteSettingsProxy = RemoteSettingsProxy;
//# sourceMappingURL=remote-settings-proxy.js.map