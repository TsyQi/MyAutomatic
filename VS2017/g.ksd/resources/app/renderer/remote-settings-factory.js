/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var window_1 = require("./window");
var remote_settings_proxy_1 = require("../lib/remote-settings/ipc/remote-settings-proxy");
var remote_settings_ipc_rpc_service_1 = require("../lib/remote-settings/ipc/remote-settings-ipc-rpc-service");
var ipc_rpc_1 = require("../lib/ipc/ipc-rpc");
var _remoteSettings;
function getRemoteSettings() {
    if (_remoteSettings) {
        return _remoteSettings;
    }
    var rpc = new ipc_rpc_1.IpcRpc(electron_1.ipcRenderer, remote_settings_ipc_rpc_service_1.REMOTE_SETTINGS_SERVICE_CHANNEL);
    return _remoteSettings = new remote_settings_proxy_1.RemoteSettingsProxy(rpc, window_1.client.controllerReadyPromise);
}
exports.getRemoteSettings = getRemoteSettings;
//# sourceMappingURL=remote-settings-factory.js.map