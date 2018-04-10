/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var errors_1 = require("../../lib/errors");
var debounce_1 = require("../../lib/debounce");
var promise_completion_source_1 = require("../../lib/promise-completion-source");
var InstallerIpc_1 = require("../../lib/Installer/InstallerIpc");
var Product_1 = require("../../lib/Installer/Product");
var enum_1 = require("../../lib/enum");
// Progress messages are sent over IPC, and can be very noisy.
var MAX_PROGRESS_PER_SEC = 2;
/* istanbul ignore next */
var InstallerService = /** @class */ (function () {
    function InstallerService(installer) {
        this._callCount = 0;
        this._initialized = false;
        this._promiseMap = new Map();
        this._installer = installer;
    }
    InstallerService.prototype.init = function (sender) {
        var _this = this;
        if (!this._initialized) {
            this._sender = sender;
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.CANCEL_PRODUCT_REQUEST, this.cancelProductRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.GET_INSTALLED_PRODUCT_REQUEST, this.getInstalledProductRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.GET_INSTALLED_PRODUCT_SUMMARIES_REQUEST, this.getInstalledProductSummariesRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.GET_PRODUCT_REQUEST, this.getProductRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.GET_PRODUCT_SUMMARIES_REQUEST, this.getProductSummariesRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.GET_CHANNEL_INFO_REQUEST, this.getChannelInfoRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.REMOVE_CHANNEL_REQUEST, this.removeChannelRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.EVALUATE_INSTALL_PARAMETERS_REQUEST, this.evaluateInstallParametersRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.EVALUATE_MODIFY_PARAMETERS_REQUEST, this.evaluateModifyParametersRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.INSTALL_PRODUCT_REQUEST, this.installProductRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.MODIFY_PRODUCT_REQUEST, this.modifyProductRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.LAUNCH_PRODUCT_REQUEST, this.launchProductRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.UNINSTALL_PRODUCT_REQUEST, this.uninstallProductRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.UPDATE_PRODUCT_REQUEST, this.updateProductRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.REPAIR_PRODUCT_REQUEST, this.repairProductRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.RESUME_PRODUCT_REQUEST, this.resumeProductRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.OPEN_LOG_REQUEST, this.openLogRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.MESSAGE_RESPONSE, this.messageResponse.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.DEEP_CLEAN_PREVIEW_INSTALLATIONS_REQUEST, this.deepCleanPreviewInstallationsRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.GET_STATUS_REQUEST, this.getStatusRequest.bind(this));
            electron_1.ipcMain.on(InstallerIpc_1.InstallerIpc.IS_ELEVATED_REQUEST, this.isElevatedRequest.bind(this));
            // Each progress type gets its own debounced progress callback.
            var debouncedProgressCallbacks_1 = new Map();
            enum_1.EnumExtensions.getNames(Product_1.ProgressType).forEach(function (name) {
                debouncedProgressCallbacks_1.set(name, debounce_1.debounce(function (installationPath, type, percentComplete, detail, progressInfo) {
                    _this.sendToWindow(InstallerIpc_1.InstallerIpc.PROGRESS_EVENT, {
                        installationPath: installationPath,
                        type: type,
                        percentComplete: percentComplete,
                        detail: detail,
                        progressInfo: InstallerIpc_1.InstallerIpc.progressInfoToIpc(progressInfo)
                    });
                }, 1000 / MAX_PROGRESS_PER_SEC));
            });
            var onProgress = function (installationPath, type, percentComplete, detail, progressInfo) {
                // Get the callback for this progress event type.
                var callback = debouncedProgressCallbacks_1.get(Product_1.ProgressType[type]);
                if (callback) {
                    callback(installationPath, type, percentComplete, detail, progressInfo);
                }
            };
            this._installer.onProgress(onProgress);
            this._installer.onNotification(function (installationPath, message) {
                _this.sendToWindow(InstallerIpc_1.InstallerIpc.NOTIFICATION_EVENT, {
                    installationPath: installationPath,
                    message: InstallerIpc_1.InstallerIpc.messageToIpc(message)
                });
            });
            this._installer.onProductUpdateAvailable(function () {
                _this.sendToWindow(InstallerIpc_1.InstallerIpc.PRODUCT_UPDATE_AVAILABLE_EVENT, {});
            });
            this._installer.onInstalledProductUpdateAvailable(function () {
                _this.sendToWindow(InstallerIpc_1.InstallerIpc.INSTALLED_PRODUCT_UPDATE_AVAILABLE_EVENT, {});
            });
            this._installer.setMessageHandler(function (installationPath, message) {
                return _this.startPromisedRequest(InstallerIpc_1.InstallerIpc.MESSAGE_REQUEST, {
                    installationPath: installationPath,
                    message: InstallerIpc_1.InstallerIpc.messageToIpc(message)
                });
            });
            this._initialized = true;
        }
    };
    InstallerService.prototype.dispose = function () {
        return this._installer.dispose();
    };
    // TODO: refactor the response/reject handling to reduce duplication (bug 235655)
    InstallerService.prototype.cancelProductRequest = function (event, request) {
        var _this = this;
        var parameters = InstallerIpc_1.InstallerIpc.cancelParametersFromIpc(request.parameters.operationParameters);
        var telemetryContext = InstallerIpc_1.InstallerIpc.telemtryContextFromIpc(request.parameters.telemetryContext);
        this._installer.cancel(parameters, telemetryContext)
            .then(function () {
            var response = {
                correlationId: request.correlationId,
                result: null,
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.CANCEL_PRODUCT_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.CANCEL_PRODUCT_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.getInstalledProductRequest = function (event, request) {
        var _this = this;
        this._installer.getInstalledProduct(request.parameters.installationPath, request.parameters.withUpdatePackages, request.parameters.fetchLatest, InstallerIpc_1.InstallerIpc.vsixReferencesFromIpc(request.parameters.vsixs))
            .then(function (product) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.installedProductToIpc(product),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.GET_INSTALLED_PRODUCT_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.GET_INSTALLED_PRODUCT_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.getInstalledProductSummariesRequest = function (event, request) {
        var _this = this;
        this._installer.getInstalledProductSummaries()
            .then(function (installedProductSummariesResult) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.installedProductSummariesResultToIpc(installedProductSummariesResult),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.GET_INSTALLED_PRODUCT_SUMMARIES_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.GET_INSTALLED_PRODUCT_SUMMARIES_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.getProductRequest = function (event, request) {
        var _this = this;
        this._installer.getProduct(request.parameters.channelId, request.parameters.productId, InstallerIpc_1.InstallerIpc.vsixReferencesFromIpc(request.parameters.vsixs))
            .then(function (product) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.productToIpc(product),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.GET_PRODUCT_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.GET_PRODUCT_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.getProductSummariesRequest = function (event, request) {
        var _this = this;
        this._installer.getProductSummaries()
            .then(function (productSummaries) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.productSummariesToIpc(productSummaries),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.GET_PRODUCT_SUMMARIES_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.GET_PRODUCT_SUMMARIES_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.getChannelInfoRequest = function (event, request) {
        var _this = this;
        this._installer.getChannelInfo()
            .then(function (channelInfoList) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.channelInfoListToIpc(channelInfoList),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.GET_CHANNEL_INFO_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.GET_CHANNEL_INFO_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.removeChannelRequest = function (event, request) {
        var _this = this;
        this._installer.removeChannel(request.parameters.channelId)
            .then(function (productSummaries) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.productSummariesToIpc(productSummaries),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.REMOVE_CHANNEL_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.REMOVE_CHANNEL_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.evaluateInstallParametersRequest = function (event, request) {
        var _this = this;
        var paramaters = InstallerIpc_1.InstallerIpc.installParametersFromIpc(request.parameters);
        this._installer.evaluateInstallParameters(paramaters)
            .then(function (evaluation) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.installParametersEvaluationToIpc(evaluation),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.EVALUATE_INSTALL_PARAMETERS_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.EVALUATE_INSTALL_PARAMETERS_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.evaluateModifyParametersRequest = function (event, request) {
        var _this = this;
        var paramaters = InstallerIpc_1.InstallerIpc.modifyParametersFromIpc(request.parameters);
        this._installer.evaluateModifyParameters(paramaters)
            .then(function (evaluation) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.modifyParametersEvaluationToIpc(evaluation),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.EVALUATE_MODIFY_PARAMETERS_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.EVALUATE_MODIFY_PARAMETERS_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.installProductRequest = function (event, request) {
        var _this = this;
        var parameters = InstallerIpc_1.InstallerIpc.installParametersFromIpc(request.parameters.operationParameters);
        var telemetryContext = InstallerIpc_1.InstallerIpc.telemtryContextFromIpc(request.parameters.telemetryContext);
        this._installer.install(parameters, telemetryContext)
            .then(function (result) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.installOperationResultToIpc(result),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.INSTALL_PRODUCT_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.INSTALL_PRODUCT_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.modifyProductRequest = function (event, request) {
        var _this = this;
        var parameters = InstallerIpc_1.InstallerIpc.modifyParametersFromIpc(request.parameters.operationParameters);
        var telemetryContext = InstallerIpc_1.InstallerIpc.telemtryContextFromIpc(request.parameters.telemetryContext);
        this._installer.modify(parameters, telemetryContext)
            .then(function (result) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.installOperationResultToIpc(result),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.MODIFY_PRODUCT_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.MODIFY_PRODUCT_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.launchProductRequest = function (event, request) {
        var _this = this;
        var parameters = InstallerIpc_1.InstallerIpc.launchParametersFromIpc(request.parameters.operationParameters);
        var telemetryContext = InstallerIpc_1.InstallerIpc.telemtryContextFromIpc(request.parameters.telemetryContext);
        this._installer.launch(parameters, telemetryContext)
            .then(function () {
            var response = {
                correlationId: request.correlationId,
                result: null,
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.LAUNCH_PRODUCT_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.LAUNCH_PRODUCT_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.uninstallProductRequest = function (event, request) {
        var _this = this;
        var parameters = InstallerIpc_1.InstallerIpc.uninstallParametersFromIpc(request.parameters.operationParameters);
        var telemetryContext = InstallerIpc_1.InstallerIpc.telemtryContextFromIpc(request.parameters.telemetryContext);
        this._installer.uninstall(parameters, telemetryContext)
            .then(function () {
            var response = {
                correlationId: request.correlationId,
                result: null,
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.UNINSTALL_PRODUCT_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.UNINSTALL_PRODUCT_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.updateProductRequest = function (event, request) {
        var _this = this;
        var parameters = InstallerIpc_1.InstallerIpc.updateParametersFromIpc(request.parameters.operationParameters);
        var telemetryContext = InstallerIpc_1.InstallerIpc.telemtryContextFromIpc(request.parameters.telemetryContext);
        this._installer.update(parameters, telemetryContext)
            .then(function (result) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.installOperationResultToIpc(result),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.UPDATE_PRODUCT_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.UPDATE_PRODUCT_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.repairProductRequest = function (event, request) {
        var _this = this;
        var parameters = InstallerIpc_1.InstallerIpc.repairParametersFromIpc(request.parameters.operationParameters);
        var telemetryContext = InstallerIpc_1.InstallerIpc.telemtryContextFromIpc(request.parameters.telemetryContext);
        this._installer.repair(parameters, telemetryContext)
            .then(function (result) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.installOperationResultToIpc(result),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.REPAIR_PRODUCT_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.REPAIR_PRODUCT_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.resumeProductRequest = function (event, request) {
        var _this = this;
        var parameters = InstallerIpc_1.InstallerIpc.resumeParametersFromIpc(request.parameters.operationParameters);
        var telemetryContext = InstallerIpc_1.InstallerIpc.telemtryContextFromIpc(request.parameters.telemetryContext);
        this._installer.resume(parameters, telemetryContext)
            .then(function (result) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.installOperationResultToIpc(result),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.RESUME_PRODUCT_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.RESUME_PRODUCT_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.deepCleanPreviewInstallationsRequest = function (event, request) {
        var _this = this;
        this._installer.deepCleanPreviewInstallations()
            .then(function () {
            var response = {
                correlationId: request.correlationId,
                result: null,
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.DEEP_CLEAN_PREVIEW_INSTALLATIONS_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.DEEP_CLEAN_PREVIEW_INSTALLATIONS_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.getStatusRequest = function (event, request) {
        var _this = this;
        this._installer.getStatus()
            .then(function (result) {
            var response = {
                correlationId: request.correlationId,
                result: InstallerIpc_1.InstallerIpc.installerStatusToIpc(result),
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.GET_STATUS_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.GET_STATUS_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.isElevatedRequest = function (event, request) {
        var _this = this;
        this._installer.isElevated()
            .then(function (result) {
            var response = {
                correlationId: request.correlationId,
                result: result,
                error: null
            };
            _this.sendToWindow(InstallerIpc_1.InstallerIpc.IS_ELEVATED_RESPONSE, response);
        })
            .catch(function (error) {
            _this.sendErrorToWindow(InstallerIpc_1.InstallerIpc.IS_ELEVATED_RESPONSE, request, error);
        });
    };
    InstallerService.prototype.sendErrorToWindow = function (channel, request, error) {
        var response = {
            correlationId: request.correlationId,
            result: null,
            error: error instanceof errors_1.CustomErrorBase ? error.toJson() : error.toString()
        };
        this.sendToWindow(channel, response);
    };
    InstallerService.prototype.sendToWindow = function (channel, data) {
        this._sender.trySend(channel, data);
    };
    InstallerService.prototype.openLogRequest = function (event) {
        this._installer.openLog();
    };
    InstallerService.prototype.messageResponse = function (event, response) {
        this.completePromisedResponse(response, InstallerIpc_1.InstallerIpc.messageResultFromIpc);
    };
    InstallerService.prototype.startPromisedRequest = function (name, parameters) {
        var promiseSource = new promise_completion_source_1.PromiseCompletionSource();
        var promiseKey = this._callCount++;
        var request = {
            correlationId: promiseKey,
            parameters: parameters
        };
        this._promiseMap.set(promiseKey, promiseSource);
        this.sendToWindow(name, request);
        return promiseSource.promise;
    };
    InstallerService.prototype.completePromisedResponse = function (response, resultConverter) {
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
    return InstallerService;
}());
exports.InstallerService = InstallerService;
//# sourceMappingURL=InstallerService.js.map