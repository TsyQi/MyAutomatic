/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var feedback_info_proxy_1 = require("../../lib/feedback/feedback-info-proxy");
var feedback_ipc_rpc_service_1 = require("../../lib/feedback/feedback-ipc-rpc-service");
var ipc_rpc_1 = require("../../lib/ipc/ipc-rpc");
var _feedbackInfo;
function getFeedbackInfoProvider() {
    if (_feedbackInfo) {
        return _feedbackInfo;
    }
    var rpc = new ipc_rpc_1.IpcRpc(electron_1.ipcRenderer, feedback_ipc_rpc_service_1.FEEDBACK_SERVICE_CHANNEL);
    return _feedbackInfo = new feedback_info_proxy_1.FeedbackInfoProxy(rpc);
}
exports.getFeedbackInfoProvider = getFeedbackInfoProvider;
//# sourceMappingURL=feedback-info-provider-factory.js.map