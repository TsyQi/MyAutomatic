/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var ipc_rpc_1 = require("../lib/ipc/ipc-rpc");
var ProgressBarProxy = /** @class */ (function () {
    function ProgressBarProxy(rpc) {
        this._rpc = rpc;
    }
    ProgressBarProxy.prototype.setValue = function (value, options) {
        this._rpc.invoke("setValue", value, options);
    };
    ProgressBarProxy.prototype.getValue = function () {
        return this._rpc.invoke("getValue");
    };
    ProgressBarProxy.prototype.setError = function () {
        this._rpc.invoke("setError");
    };
    ProgressBarProxy.prototype.resetError = function () {
        this._rpc.invoke("resetError");
    };
    ProgressBarProxy.prototype.setFlashFrame = function (isFlashing) {
        this._rpc.invoke("setFlashFrame", isFlashing);
    };
    ProgressBarProxy.prototype.setOverlayIcon = function (path, description) {
        this._rpc.invoke("setOverlayIcon", path, description);
    };
    ProgressBarProxy.prototype.clearValue = function () {
        throw new Error("Method not implemented.");
    };
    return ProgressBarProxy;
}());
exports.ProgressBarProxy = ProgressBarProxy;
exports.progressBarProxy = new ProgressBarProxy(new ipc_rpc_1.IpcRpc(electron_1.ipcRenderer, "progress-bar"));
//# sourceMappingURL=progress-bar-proxy.js.map