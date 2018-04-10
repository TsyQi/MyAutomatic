/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var events_1 = require("events");
var errors_1 = require("../../lib/errors");
var promise_completion_source_1 = require("../../lib/promise-completion-source");
var InstallerIpc_1 = require("../../lib/Installer/InstallerIpc");
var installer_status_1 = require("../../lib/Installer/installer-status");
exports.InstallerStatus = installer_status_1.InstallerStatus;
// The InstallerProxy's identifier value.
var INSTALLER_PROXY_ID = "Proxy";
// EventEmitter event names
var PROGRESS_EVENT_NAME = "progress";
var NOTIFICATION_EVENT_NAME = "notification";
var PRODUCT_UPDATE_AVAILABLE_EVENT_NAME = "product-update-available";
var INSTALLED_PRODUCT_UPDATE_AVAILABLE_EVENT_NAME = "installed-product-update-available";
/**
 * Implements the Installer interface by forwarding all requests over IPC.
 * The IPC responses result in completing a promise or invoking a callback.
 */
var InstallerProxy = /** @class */ (function () {
    function InstallerProxy(controllerReadyPromise) {
        this._callCount = 0;
        this._initialized = false;
        this._promiseMap = new Map();
        this._onMessageHandler = null;
        this._readyPromise = controllerReadyPromise || Promise.resolve();
        if (!this._initialized) {
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.GET_INSTALLED_PRODUCT_SUMMARIES_RESPONSE, this.getInstalledProductSummariesResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.GET_INSTALLED_PRODUCT_RESPONSE, this.getInstalledProductResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.GET_PRODUCT_SUMMARIES_RESPONSE, this.getProductSummariesResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.GET_PRODUCT_RESPONSE, this.getProductResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.GET_CHANNEL_INFO_RESPONSE, this.getChannelInfoResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.REMOVE_CHANNEL_RESPONSE, this.removeChannelResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.EVALUATE_INSTALL_PARAMETERS_RESPONSE, this.evaluationInstallParametersResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.EVALUATE_MODIFY_PARAMETERS_RESPONSE, this.evaluationModifyParametersResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.CANCEL_PRODUCT_RESPONSE, this.cancelProductResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.LOG_PRODUCTS_WITH_OPERATION_RESPONSE, this.logOperationWithProductAssetsResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.INSTALL_PRODUCT_RESPONSE, this.installProductResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.MODIFY_PRODUCT_RESPONSE, this.modifyProductResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.LAUNCH_PRODUCT_RESPONSE, this.launchProductResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.UPDATE_PRODUCT_RESPONSE, this.updateProductResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.REPAIR_PRODUCT_RESPONSE, this.repairProductResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.RESUME_PRODUCT_RESPONSE, this.resumeProductResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.UNINSTALL_PRODUCT_RESPONSE, this.uninstallProductResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.PRODUCT_UPDATE_AVAILABLE_EVENT, this.onProductUpdateAvailableEvent.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.INSTALLED_PRODUCT_UPDATE_AVAILABLE_EVENT, this.onInstalledProductUpdateAvailableEvent.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.PROGRESS_EVENT, this.onProgressEvent.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.NOTIFICATION_EVENT, this.onNotificationEvent.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.MESSAGE_REQUEST, this.onMessageRequest.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.DEEP_CLEAN_PREVIEW_INSTALLATIONS_RESPONSE, this.deepCleanPreviewInstallationsResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.GET_STATUS_RESPONSE, this.getStatusResponse.bind(this));
            electron_1.ipcRenderer.on(InstallerIpc_1.InstallerIpc.IS_ELEVATED_RESPONSE, this.isElevatedResponse.bind(this));
            this._eventEmitter = new events_1.EventEmitter();
            this._initialized = true;
        }
    }
    Object.defineProperty(InstallerProxy.prototype, "id", {
        get: function () {
            return INSTALLER_PROXY_ID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerProxy.prototype, "pendingPromiseCount", {
        get: function () {
            return this._promiseMap.size;
        },
        enumerable: true,
        configurable: true
    });
    InstallerProxy.prototype.getInstalledProductSummaries = function () {
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.GET_INSTALLED_PRODUCT_SUMMARIES_REQUEST, {});
    };
    InstallerProxy.prototype.getProductSummaries = function () {
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.GET_PRODUCT_SUMMARIES_REQUEST, {});
    };
    InstallerProxy.prototype.getChannelInfo = function () {
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.GET_CHANNEL_INFO_REQUEST, {});
    };
    InstallerProxy.prototype.removeChannel = function (channelId) {
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.REMOVE_CHANNEL_REQUEST, { channelId: channelId });
    };
    InstallerProxy.prototype.getInstalledProduct = function (installationPath, withUpdatePackages, fetchLatest, vsixs) {
        var ipcVsixs = InstallerIpc_1.InstallerIpc.vsixReferencesToIpc(vsixs);
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.GET_INSTALLED_PRODUCT_REQUEST, {
            installationPath: installationPath,
            withUpdatePackages: withUpdatePackages,
            fetchLatest: fetchLatest,
            vsixs: ipcVsixs,
        });
    };
    InstallerProxy.prototype.getProduct = function (channelId, productId, vsixs) {
        var ipcVsixs = InstallerIpc_1.InstallerIpc.vsixReferencesToIpc(vsixs);
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.GET_PRODUCT_REQUEST, {
            channelId: channelId,
            productId: productId,
            vsixs: ipcVsixs,
        });
    };
    InstallerProxy.prototype.evaluateInstallParameters = function (parameters) {
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.EVALUATE_INSTALL_PARAMETERS_REQUEST, InstallerIpc_1.InstallerIpc.installParametersToIpc(parameters));
    };
    InstallerProxy.prototype.evaluateModifyParameters = function (parameters) {
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.EVALUATE_MODIFY_PARAMETERS_REQUEST, InstallerIpc_1.InstallerIpc.modifyParametersToIpc(parameters));
    };
    InstallerProxy.prototype.install = function (parameters, telemetryContext) {
        /* tslint:disable:max-line-length */
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.INSTALL_PRODUCT_REQUEST, {
            operationParameters: InstallerIpc_1.InstallerIpc.installParametersToIpc(parameters),
            telemetryContext: InstallerIpc_1.InstallerIpc.telemtryContextToIpc(telemetryContext),
        });
        /* tslint:enable:max-line-length */
    };
    InstallerProxy.prototype.modify = function (parameters, telemetryContext) {
        /* tslint:disable:max-line-length */
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.MODIFY_PRODUCT_REQUEST, {
            operationParameters: InstallerIpc_1.InstallerIpc.modifyParametersToIpc(parameters),
            telemetryContext: InstallerIpc_1.InstallerIpc.telemtryContextToIpc(telemetryContext),
        });
        /* tslint:enable:max-line-length */
    };
    InstallerProxy.prototype.launch = function (parameters, telemetryContext) {
        /* tslint:disable:max-line-length */
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.LAUNCH_PRODUCT_REQUEST, {
            operationParameters: InstallerIpc_1.InstallerIpc.launchParametersToIpc(parameters),
            telemetryContext: InstallerIpc_1.InstallerIpc.telemtryContextToIpc(telemetryContext),
        });
        /* tslint:enable:max-line-length */
    };
    InstallerProxy.prototype.update = function (parameters, telemetryContext) {
        /* tslint:disable:max-line-length */
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.UPDATE_PRODUCT_REQUEST, {
            operationParameters: InstallerIpc_1.InstallerIpc.updateParametersToIpc(parameters),
            telemetryContext: InstallerIpc_1.InstallerIpc.telemtryContextToIpc(telemetryContext),
        });
        /* tslint:enable:max-line-length */
    };
    InstallerProxy.prototype.repair = function (parameters, telemetryContext) {
        /* tslint:disable:max-line-length */
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.REPAIR_PRODUCT_REQUEST, {
            operationParameters: InstallerIpc_1.InstallerIpc.repairParametersToIpc(parameters),
            telemetryContext: InstallerIpc_1.InstallerIpc.telemtryContextToIpc(telemetryContext),
        });
        /* tslint:enable:max-line-length */
    };
    InstallerProxy.prototype.resume = function (parameters, telemetryContext) {
        /* tslint:disable:max-line-length */
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.RESUME_PRODUCT_REQUEST, {
            operationParameters: InstallerIpc_1.InstallerIpc.resumeParametersToIpc(parameters),
            telemetryContext: InstallerIpc_1.InstallerIpc.telemtryContextToIpc(telemetryContext),
        });
        /* tslint:enable:max-line-length */
    };
    InstallerProxy.prototype.uninstall = function (parameters, telemetryContext) {
        /* tslint:disable:max-line-length */
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.UNINSTALL_PRODUCT_REQUEST, {
            operationParameters: InstallerIpc_1.InstallerIpc.uninstallParametersToIpc(parameters),
            telemetryContext: InstallerIpc_1.InstallerIpc.telemtryContextToIpc(telemetryContext),
        });
        /* tslint:enable:max-line-length */
    };
    InstallerProxy.prototype.uninstallAll = function () {
        // TODO: The renderer process does not call uninstallAll -- this is only invoked by the main process.
        return Promise.reject(new Error("Not Yet Implemented"));
    };
    InstallerProxy.prototype.cancel = function (parameters, telemetryContext) {
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.CANCEL_PRODUCT_REQUEST, {
            operationParameters: InstallerIpc_1.InstallerIpc.cancelParametersToIpc(parameters),
            telemetryContext: InstallerIpc_1.InstallerIpc.telemtryContextToIpc(telemetryContext),
        });
    };
    InstallerProxy.prototype.deepCleanPreviewInstallations = function () {
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.DEEP_CLEAN_PREVIEW_INSTALLATIONS_REQUEST, {});
    };
    InstallerProxy.prototype.getStatus = function () {
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.GET_STATUS_REQUEST, {});
    };
    InstallerProxy.prototype.isElevated = function () {
        return this.startPromisedRequest(InstallerIpc_1.InstallerIpc.IS_ELEVATED_REQUEST, {});
    };
    InstallerProxy.prototype.onProgress = function (callback) {
        this._eventEmitter.on(PROGRESS_EVENT_NAME, callback);
    };
    InstallerProxy.prototype.onNotification = function (callback) {
        this._eventEmitter.on(NOTIFICATION_EVENT_NAME, callback);
    };
    InstallerProxy.prototype.onProductUpdateAvailable = function (callback) {
        this._eventEmitter.on(PRODUCT_UPDATE_AVAILABLE_EVENT_NAME, callback);
    };
    InstallerProxy.prototype.onInstalledProductUpdateAvailable = function (callback) {
        this._eventEmitter.on(INSTALLED_PRODUCT_UPDATE_AVAILABLE_EVENT_NAME, callback);
    };
    InstallerProxy.prototype.setMessageHandler = function (handler) {
        this._onMessageHandler = handler;
    };
    InstallerProxy.prototype.dispose = function () {
        return Promise.resolve();
    };
    InstallerProxy.prototype.openLog = function () {
        electron_1.ipcRenderer.send(InstallerIpc_1.InstallerIpc.OPEN_LOG_REQUEST);
    };
    InstallerProxy.prototype.getInstalledProductSummariesResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.installedProductSummariesResultFromIpc);
    };
    InstallerProxy.prototype.getInstalledProductResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.installedProductFromIpc);
    };
    InstallerProxy.prototype.getProductSummariesResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.productSummariesFromIpc);
    };
    InstallerProxy.prototype.getProductResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.productFromIpc);
    };
    InstallerProxy.prototype.getChannelInfoResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.channelInfoListFromIpc);
    };
    InstallerProxy.prototype.removeChannelResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.productSummariesFromIpc);
    };
    InstallerProxy.prototype.evaluationInstallParametersResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.installParametersEvaluationFromIpc);
    };
    InstallerProxy.prototype.evaluationModifyParametersResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.modifyParametersEvaluationFromIpc);
    };
    InstallerProxy.prototype.cancelProductResponse = function (_event, response) {
        this.completePromisedResponse(response, function (result) { return result; });
    };
    InstallerProxy.prototype.logOperationWithProductAssetsResponse = function (_event, response) {
        this.completePromisedResponse(response, function (result) { return result; });
    };
    InstallerProxy.prototype.installProductResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.installOperationResultFromIpc);
    };
    InstallerProxy.prototype.modifyProductResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.installOperationResultFromIpc);
    };
    InstallerProxy.prototype.launchProductResponse = function (_event, response) {
        this.completePromisedResponse(response, function (result) { return result; });
    };
    InstallerProxy.prototype.updateProductResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.installOperationResultFromIpc);
    };
    InstallerProxy.prototype.repairProductResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.installOperationResultFromIpc);
    };
    InstallerProxy.prototype.resumeProductResponse = function (_event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.installOperationResultFromIpc);
    };
    InstallerProxy.prototype.uninstallProductResponse = function (_event, response) {
        this.completePromisedResponse(response, function (result) { return result; });
    };
    InstallerProxy.prototype.emitOnProgress = function (installationPath, type, percentComplete, detail, progressInfo) {
        this._eventEmitter.emit(PROGRESS_EVENT_NAME, installationPath, type, percentComplete, detail, progressInfo);
    };
    InstallerProxy.prototype.emitOnNotification = function (installationPath, message) {
        this._eventEmitter.emit(NOTIFICATION_EVENT_NAME, installationPath, message);
    };
    InstallerProxy.prototype.emitOnProductUpdateAvailable = function () {
        this._eventEmitter.emit(PRODUCT_UPDATE_AVAILABLE_EVENT_NAME);
    };
    InstallerProxy.prototype.emitOnInstalledProductUpdateAvailable = function () {
        this._eventEmitter.emit(INSTALLED_PRODUCT_UPDATE_AVAILABLE_EVENT_NAME);
    };
    InstallerProxy.prototype.onProgressEvent = function (event, response) {
        var progressIpc = InstallerIpc_1.InstallerIpc.progressInfoFromIpc(response.progressInfo);
        this.emitOnProgress(response.installationPath, response.type, response.percentComplete, response.detail, progressIpc);
    };
    InstallerProxy.prototype.onNotificationEvent = function (event, response) {
        this.emitOnNotification(response.installationPath, response.message);
    };
    InstallerProxy.prototype.onProductUpdateAvailableEvent = function (event) {
        this.emitOnProductUpdateAvailable();
    };
    InstallerProxy.prototype.onInstalledProductUpdateAvailableEvent = function (event) {
        this.emitOnInstalledProductUpdateAvailable();
    };
    InstallerProxy.prototype.onMessageRequest = function (event, request) {
        var messageIpc = InstallerIpc_1.InstallerIpc.messageFromIpc(request.parameters.message);
        if (!this._onMessageHandler) {
            var response = {
                correlationId: request.correlationId,
                result: null,
                error: new errors_1.NoMessageHandlerError("There is no handler for InstallerProxy messages.").toJson()
            };
            electron_1.ipcRenderer.send(InstallerIpc_1.InstallerIpc.MESSAGE_RESPONSE, response);
        }
        this._onMessageHandler(request.parameters.installationPath, messageIpc)
            .then(function (result) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.messageResultToIpc(result),
                error: null
            };
            electron_1.ipcRenderer.send(InstallerIpc_1.InstallerIpc.MESSAGE_RESPONSE, response);
        })
            .catch(function (error) {
            var response = {
                correlationId: request.correlationId,
                result: null,
                error: error instanceof errors_1.CustomErrorBase ? error.toJson() : error.toString()
            };
            electron_1.ipcRenderer.send(InstallerIpc_1.InstallerIpc.MESSAGE_RESPONSE, response);
        });
    };
    InstallerProxy.prototype.deepCleanPreviewInstallationsResponse = function (_event, response) {
        this.completePromisedResponse(response, function (result) { return result; });
    };
    InstallerProxy.prototype.getStatusResponse = function (_event, response) {
        this.completePromisedResponse(response, function (result) { return InstallerIpc_1.InstallerIpc.installerStatusFromIpc(result); });
    };
    InstallerProxy.prototype.isElevatedResponse = function (event, response) {
        this.completePromisedResponse(response, function (result) { return result; });
    };
    InstallerProxy.prototype.startPromisedRequest = function (name, parameters) {
        var promiseKey = this._callCount++;
        var promiseSource = new promise_completion_source_1.PromiseCompletionSource();
        var request = {
            correlationId: promiseKey,
            parameters: parameters
        };
        this._promiseMap.set(promiseKey, promiseSource);
        return this._readyPromise.then(function () {
            electron_1.ipcRenderer.send(name, request);
            return promiseSource.promise;
        });
    };
    InstallerProxy.prototype.completePromisedResponse = function (response, resultConverter) {
        var promiseKey = response.correlationId;
        var promiseCompletionPair = this._promiseMap.get(promiseKey);
        if (!promiseCompletionPair) {
            console.log("Promise \"" + promiseKey + "\" not found.");
            return;
        }
        if (response.error) {
            try {
                var rehydratedError = errors_1.CustomErrorBase.fromJson(response.error);
                promiseCompletionPair.reject(rehydratedError);
            }
            catch (e) {
                // fallback for other errors
                promiseCompletionPair.reject(new Error(response.error));
            }
        }
        else {
            promiseCompletionPair.resolve(resultConverter(response.result));
        }
        this._promiseMap.delete(promiseKey);
    };
    return InstallerProxy;
}());
exports.InstallerProxy = InstallerProxy;
//# sourceMappingURL=InstallerProxy.js.map