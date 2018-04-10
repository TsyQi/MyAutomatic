/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/* istanbul ignore next */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_proxy_1 = require("../lib/logger/logger-proxy");
var ipc_rpc_1 = require("../lib/ipc/ipc-rpc");
var logger_ipc_rpc_service_1 = require("../lib/logger/logger-ipc-rpc-service");
var electron_1 = require("electron");
var _logger = new logger_proxy_1.LoggerProxy(new ipc_rpc_1.IpcRpc(electron_1.ipcRenderer, logger_ipc_rpc_service_1.LOGGER_SERVICE_CHANNEL));
function getLogger() {
    return _logger;
}
exports.getLogger = getLogger;
//# sourceMappingURL=logger.js.map