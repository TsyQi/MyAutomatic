/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var electron_2 = require("../lib/ipc/electron");
var promise_completion_source_1 = require("../lib/promise-completion-source");
var Window = /** @class */ (function () {
    function Window(ipc) {
        var _this = this;
        this._readyReceived = false;
        this._readyPromiseSource = new promise_completion_source_1.PromiseCompletionSource();
        this._ipc = ipc;
        this.onControllerReady(function () {
            _this._readyReceived = true;
            _this._readyPromiseSource.resolve(true);
        });
    }
    Object.defineProperty(Window.prototype, "controllerReadyPromise", {
        get: function () {
            return this._readyPromiseSource.promise;
        },
        enumerable: true,
        configurable: true
    });
    Window.prototype.onControllerReady = function (callback) {
        if (this._readyReceived) {
            callback();
            return;
        }
        this._ipc.once(electron_2.IPC_READY, function (_event) { return callback(); });
    };
    return Window;
}());
exports.Window = Window;
exports.client = new Window(electron_1.ipcRenderer);
//# sourceMappingURL=window.js.map