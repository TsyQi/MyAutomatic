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
var ipc_rpc_service_1 = require("../ipc/ipc-rpc-service");
var FeedbackProxyServiceMethod;
(function (FeedbackProxyServiceMethod) {
    FeedbackProxyServiceMethod[FeedbackProxyServiceMethod["getInfo"] = 0] = "getInfo";
})(FeedbackProxyServiceMethod = exports.FeedbackProxyServiceMethod || (exports.FeedbackProxyServiceMethod = {}));
exports.FEEDBACK_SERVICE_CHANNEL = "FeedbackProxy";
var FeedbackIpcRpcService = /** @class */ (function (_super) {
    __extends(FeedbackIpcRpcService, _super);
    function FeedbackIpcRpcService(ipc, channelId, feedbackInfoProvider, logger) {
        var _this = _super.call(this, ipc, channelId, logger) || this;
        _this._feedbackInfoProvider = feedbackInfoProvider;
        return _this;
    }
    FeedbackIpcRpcService.prototype.getInfo = function () {
        return Promise.resolve(this._feedbackInfoProvider.getInfo());
    };
    return FeedbackIpcRpcService;
}(ipc_rpc_service_1.IpcRpcService));
exports.FeedbackIpcRpcService = FeedbackIpcRpcService;
//# sourceMappingURL=feedback-ipc-rpc-service.js.map