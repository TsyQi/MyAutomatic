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
var ipc_promise_1 = require("./ipc-promise");
/**
 * Invoke a method on a {IpcRpcService} listening to a channel.
 */
var IpcRpc = /** @class */ (function (_super) {
    __extends(IpcRpc, _super);
    function IpcRpc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IpcRpc.prototype.invoke = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var request = this.createRpcRequest(method, args);
        return this.send(request);
    };
    IpcRpc.prototype.createRpcRequest = function (method, args) {
        return {
            method: method,
            args: args,
        };
    };
    return IpcRpc;
}(ipc_promise_1.IpcPromise));
exports.IpcRpc = IpcRpc;
//# sourceMappingURL=ipc-rpc.js.map