/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var window_1 = require("./window");
var features_proxy_1 = require("../lib/feature-flags/ipc/features-proxy");
var features_ipc_rpc_service_1 = require("../lib/feature-flags/ipc/features-ipc-rpc-service");
var ipc_rpc_1 = require("../lib/ipc/ipc-rpc");
var _features;
function getFeatures() {
    if (_features) {
        return _features;
    }
    var rpc = new ipc_rpc_1.IpcRpc(electron_1.ipcRenderer, features_ipc_rpc_service_1.FEATURES_SERVICE_CHANNEL, window_1.client.controllerReadyPromise);
    return _features = new features_proxy_1.FeaturesProxy(rpc);
}
exports.getFeatures = getFeatures;
//# sourceMappingURL=features-factory.js.map