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
var ipc_rpc_service_1 = require("../../ipc/ipc-rpc-service");
var RemoteSettingsProxyServiceMethod;
(function (RemoteSettingsProxyServiceMethod) {
    RemoteSettingsProxyServiceMethod[RemoteSettingsProxyServiceMethod["getValue"] = 0] = "getValue";
})(RemoteSettingsProxyServiceMethod = exports.RemoteSettingsProxyServiceMethod || (exports.RemoteSettingsProxyServiceMethod = {}));
exports.REMOTE_SETTINGS_SERVICE_CHANNEL = "RemoteSettingsProxy";
/**
 * Handles requests from {RemoteSettingsProxy}
 */
var RemoteSettingsIpcRpcService = /** @class */ (function (_super) {
    __extends(RemoteSettingsIpcRpcService, _super);
    function RemoteSettingsIpcRpcService(ipc, channelId, remoteSettings, logger) {
        var _this = _super.call(this, ipc, channelId, logger) || this;
        _this._remoteSettings = remoteSettings;
        return _this;
    }
    Object.defineProperty(RemoteSettingsIpcRpcService.prototype, "remoteSettings", {
        get: function () {
            return this._remoteSettings;
        },
        enumerable: true,
        configurable: true
    });
    RemoteSettingsIpcRpcService.prototype.getValue = function (collectionPath, key, valueType) {
        if (this._remoteSettings) {
            return this._remoteSettings.getValue(collectionPath, key, valueType);
        }
        return Promise.resolve(null);
    };
    return RemoteSettingsIpcRpcService;
}(ipc_rpc_service_1.IpcRpcService));
exports.RemoteSettingsIpcRpcService = RemoteSettingsIpcRpcService;
//# sourceMappingURL=remote-settings-ipc-rpc-service.js.map