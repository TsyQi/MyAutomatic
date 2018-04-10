/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var feedback_ipc_rpc_service_1 = require("../lib/feedback/feedback-ipc-rpc-service");
var feedback_info_1 = require("../lib/feedback/feedback-info");
var Logger_1 = require("../lib/Logger");
var features_ipc_rpc_service_1 = require("../lib/feature-flags/ipc/features-ipc-rpc-service");
var VSFeedbackIdentityProvider_1 = require("../main/VSFeedbackIdentityProvider");
var feature_store_factory_1 = require("./feature-flags/feature-store-factory");
var logger_ipc_rpc_service_1 = require("../lib/logger/logger-ipc-rpc-service");
var logger = Logger_1.getLogger();
var _feedbackIpcRpcService;
function getFeedbackIpcRpcService(vsTelemetryListener, culture, uiCulture, branchName, exeName, exeVersion) {
    if (_feedbackIpcRpcService) {
        return _feedbackIpcRpcService;
    }
    return _feedbackIpcRpcService = VSFeedbackIdentityProvider_1.createVSFeedbackIdentityProvider(vsTelemetryListener)
        .then(function (identityProvider) {
        var feedbackInfo = new feedback_info_1.FeedbackInfoProvider({
            userId: identityProvider.userId,
            culture: culture,
            uiCulture: uiCulture,
            branchName: branchName,
            exeName: exeName,
            exeVersion: exeVersion
        });
        return new feedback_ipc_rpc_service_1.FeedbackIpcRpcService(electron_1.ipcMain, feedback_ipc_rpc_service_1.FEEDBACK_SERVICE_CHANNEL, feedbackInfo, logger);
    })
        .catch(function (error) {
        _feedbackIpcRpcService = null;
        throw error;
    });
}
exports.getFeedbackIpcRpcService = getFeedbackIpcRpcService;
var _featuresIpcRpcService;
function getFeaturesIpcRpcService(clientName, clientVersion, telemetry, processor) {
    if (_featuresIpcRpcService) {
        return _featuresIpcRpcService;
    }
    return _featuresIpcRpcService = new features_ipc_rpc_service_1.FeaturesIpcRpcService(electron_1.ipcMain, features_ipc_rpc_service_1.FEATURES_SERVICE_CHANNEL, feature_store_factory_1.createFeatureStore(processor, telemetry), logger);
}
exports.getFeaturesIpcRpcService = getFeaturesIpcRpcService;
var _loggerIpcRpcService;
function createLoggerIpcRpcService(mainLogger) {
    if (_loggerIpcRpcService) {
        return _loggerIpcRpcService;
    }
    _loggerIpcRpcService = new logger_ipc_rpc_service_1.LoggerIpcRpcService(electron_1.ipcMain, logger_ipc_rpc_service_1.LOGGER_SERVICE_CHANNEL, mainLogger);
    return _loggerIpcRpcService;
}
exports.createLoggerIpcRpcService = createLoggerIpcRpcService;
//# sourceMappingURL=ipc-rpc-factory.js.map