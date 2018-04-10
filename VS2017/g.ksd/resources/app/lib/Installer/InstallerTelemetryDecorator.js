/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vs_telemetry_api_1 = require("vs-telemetry-api");
var TelemetryEventNames = require("../Telemetry/TelemetryEventNames");
var Session_1 = require("../Session");
var Logger_1 = require("../Logger");
var TelemetryAssetManager_1 = require("../Telemetry/TelemetryAssetManager");
var Product_1 = require("./Product");
var id_version_collection_diff_1 = require("../id-version-collection-diff");
var string_utilities_1 = require("../string-utilities");
var errors_1 = require("../errors");
var bucket_parameters_1 = require("../Telemetry/bucket-parameters");
var InstallParametersErrorType;
(function (InstallParametersErrorType) {
    InstallParametersErrorType[InstallParametersErrorType["InvalidInstallPath"] = 0] = "InvalidInstallPath";
    InstallParametersErrorType[InstallParametersErrorType["Unknown"] = 1] = "Unknown";
})(InstallParametersErrorType || (InstallParametersErrorType = {}));
var InstallerStatusErrorType;
(function (InstallerStatusErrorType) {
    InstallerStatusErrorType[InstallerStatusErrorType["Unknown"] = 0] = "Unknown";
    InstallerStatusErrorType[InstallerStatusErrorType["BlockingProcessIsRunning"] = 1] = "BlockingProcessIsRunning";
    InstallerStatusErrorType[InstallerStatusErrorType["IsDisposed"] = 2] = "IsDisposed";
    InstallerStatusErrorType[InstallerStatusErrorType["RebootRequired"] = 3] = "RebootRequired";
    InstallerStatusErrorType[InstallerStatusErrorType["InstallationOperationIsRunning"] = 4] = "InstallationOperationIsRunning";
})(InstallerStatusErrorType || (InstallerStatusErrorType = {}));
// Telemetry Event Names
var PRODUCT_INSTALL = "install-product"; // Use verb-noun convention for event names
var PRODUCT_QUERY = "query-product";
var CANCEL_OPERATION = "cancel-operation";
var CANCEL_OPERATION_ERROR = CANCEL_OPERATION + "-error";
var PRODUCT_INSTALL_ERROR = PRODUCT_INSTALL + "-error";
var PRODUCT_QUERY_ERROR = PRODUCT_QUERY + "-error";
var ASSET_WORKLOADS = "productworkloads";
var ASSET_COMPONENTS = "productcomponents";
var EVALUATE_INSTALL_PARAMETERS = "evaluate-installparameters";
var GET_INSTALLER_STATUS = "get-installerstatus";
var REMOVE_CHANNEL = "remove-channel";
// Telemetry Operation Names
var OPERATION_NAME_INSTALL = "install";
var OPERATION_NAME_MODIFY = "modify";
var OPERATION_NAME_UNINSTALL = "uninstall";
var OPERATION_NAME_UNINSTALL_ALL = "uninstallAll";
var OPERATION_NAME_UPDATE = "update";
var OPERATION_NAME_CANCEL = "pause";
var OPERATION_NAME_REPAIR = "repair";
var OPERATION_NAME_RESUME = "resume";
var OPERATION_NAME_LAUNCH = "launch";
var OPERATION_NAME_DEEP_CLEAN_PREVIEW_INSTALLATIONS = "deepCleanPreviewInstallations";
// Telemetry Properties
var UNKNOWN_VALUE = "Unknown";
var PRODUCT_INSTALL_EVENT_VERSION = 0;
var WORKLOAD_PREFIX = "Workloads.";
var COMPONENT_PREFIX = "Components.";
var TELEMETRY_PROPERTY_PRODUCTS_INSTALLED = "installedProducts";
var TELEMETRY_PROPERTY_PRODUCTS_AVAILABLE = "availableProducts";
/** Constant integer for the max number of workloads or components in an Asset payload */
var MAX_ASSET_PROPERTIES = 500;
/** Max length of a telemetry property string */
exports.MAX_TELEMETRY_STRING_LENGTH = 1024;
var logger = Logger_1.getLogger();
/** List determining which errors should not send an error event.
 */
var postErrorExcludeList = [
    errors_1.ServiceUpdateRequireError,
];
var InstallerTelemetryDecorator = /** @class */ (function () {
    function InstallerTelemetryDecorator(installerImpl, telemetry, sessionId, relatedInstallSessionId) {
        this._pendingTelemetryPromises = new Set();
        this._applyingProgressDetails = new Map();
        this._downloadingProgressDetails = new Map();
        this._operationStartTimes = new Map();
        this._installerImpl = installerImpl;
        this._telemetry = telemetry;
        this._sessionId = sessionId;
        this._relatedInstallSessionId = relatedInstallSessionId;
        this._telemetryAssetManager = new TelemetryAssetManager_1.TelemetryAssetManager(telemetry);
        this._installerImpl.onProgress(this.onProgressCallback.bind(this));
    }
    Object.defineProperty(InstallerTelemetryDecorator.prototype, "id", {
        get: function () {
            return this._installerImpl.id;
        },
        enumerable: true,
        configurable: true
    });
    /* istanbul ignore next */
    InstallerTelemetryDecorator.prototype.addProductAssetsToEventProperties = function (properties, type) {
        if (type === TelemetryAssetManager_1.AssetTypes.All || type === TelemetryAssetManager_1.AssetTypes.Installed) {
            properties[TELEMETRY_PROPERTY_PRODUCTS_INSTALLED] =
                this._telemetryAssetManager.getProductListAsString(TelemetryAssetManager_1.AssetTypes.Installed);
        }
        if (type === TelemetryAssetManager_1.AssetTypes.All || type === TelemetryAssetManager_1.AssetTypes.Available) {
            properties[TELEMETRY_PROPERTY_PRODUCTS_AVAILABLE] =
                this._telemetryAssetManager.getProductListAsString(TelemetryAssetManager_1.AssetTypes.Available);
        }
    };
    InstallerTelemetryDecorator.prototype.getInstalledProductSummaries = function (telemetryContext) {
        var _this = this;
        var methodName = "getInstalledProductSummaries";
        var bucketParameters = new bucket_parameters_1.BucketParameters(methodName, this.constructor.name);
        logger.writeVerbose("Getting installed product summaries. [installerId: " + this.id + "]");
        telemetryContext = this.ensureTelemetryContext("getInstalledProductSummaries", telemetryContext);
        var installedProductSummaries = this._installerImpl.getInstalledProductSummaries(telemetryContext);
        // Send telemetry, but don't return this to the caller.
        var telemetryPromise = installedProductSummaries.then(function (result) {
            _this._telemetryAssetManager.updateInstalledProductSummaries(result.installedProductSummaries);
            var properties = _this.getCommonProperties(telemetryContext, "getInstalledProductSummaries");
            properties.installedProducts =
                _this._telemetryAssetManager.getProductListAsString(TelemetryAssetManager_1.AssetTypes.Installed);
            var numberOfRpcErrors = result.rpcErrors.length;
            var numberOfServiceErrors = result.installedProductSummaryErrors.length;
            properties.numberOfRpcErrors = numberOfRpcErrors;
            properties.numberOfServiceErrors = numberOfServiceErrors;
            if (numberOfRpcErrors > 0) {
                // Report the number of errors and post a single event.
                _this.reportQueryFailure(bucketParameters, result.rpcErrors[0], properties);
                logger.writeError("Failed to get some installed product summaries. [installerId: " + _this.id + "]");
                result.rpcErrors.forEach(function (error) { return logger.writeError("[" + error.message + "]"); });
            }
            if (numberOfServiceErrors > 0) {
                // Report the query failure but only post 1 error for the operation.
                _this.reportQueryFailure(bucketParameters, result.installedProductSummaryErrors[0], properties);
                logger.writeError("Failed to get some installed product summaries. [installerId: " + _this.id + "]");
                result.installedProductSummaryErrors.forEach(function (error) { return logger.writeError("[" + error.message + "]"); });
            }
        }, function (error) {
            _this.reportQueryFailure(bucketParameters, error);
            logger.writeError("Failed to get installed product summaries. [installerId: " + _this.id + ", " +
                ("error: " + error.message + " at " + error.stack + "]"));
        });
        this.addPendingTelemetryPromise(telemetryPromise);
        return installedProductSummaries;
    };
    InstallerTelemetryDecorator.prototype.getProductSummaries = function (telemetryContext) {
        var _this = this;
        logger.writeVerbose("Getting product summaries. [installerId: " + this.id + "]");
        telemetryContext = this.ensureTelemetryContext("getProductSummaries", telemetryContext);
        var productSummaries = this._installerImpl.getProductSummaries(telemetryContext);
        // Send telemetry, but don't return this to the caller.
        var telemetryPromise = productSummaries.then(function (result) {
            _this._telemetryAssetManager.updateAvailableProductSummaries(result);
            var properties = {};
            properties[TELEMETRY_PROPERTY_PRODUCTS_AVAILABLE] =
                _this._telemetryAssetManager.getProductListAsString(TelemetryAssetManager_1.AssetTypes.Available);
        }, function (error) {
            _this.reportQueryFailure(new bucket_parameters_1.BucketParameters("getProductSummaries", _this.constructor.name), error);
            logger.writeError("Failed to get product summaries. [installerId: " + _this.id + ", " +
                ("error: " + error.message + " at " + error.stack + "]"));
        });
        this.addPendingTelemetryPromise(telemetryPromise);
        return productSummaries;
    };
    InstallerTelemetryDecorator.prototype.getChannelInfo = function (telemetryContext) {
        var _this = this;
        logger.writeVerbose("Getting channel info. [installerId: " + this.id + "]");
        telemetryContext = this.ensureTelemetryContext("getChannelInfo", telemetryContext);
        var methodName = "getChannelInfo";
        var bucketParameters = new bucket_parameters_1.BucketParameters(methodName, this.constructor.name);
        var channelInfoList = this._installerImpl.getChannelInfo(telemetryContext);
        // Send telemetry, but don't return this to the caller.
        var telemetryPromise = channelInfoList.catch(function (error) {
            _this.reportQueryFailure(bucketParameters, error);
            logger.writeError("Failed to get channel information. [installerId: " + _this.id + ", " +
                ("error: " + error.message + " at " + error.stack + "]"));
        });
        this.addPendingTelemetryPromise(telemetryPromise);
        return channelInfoList;
    };
    InstallerTelemetryDecorator.prototype.removeChannel = function (channelId, telemetryContext) {
        var _this = this;
        logger.writeVerbose("Removing channel. [installerId: " + this.id + ", channelId: " + channelId + "]");
        telemetryContext = this.ensureTelemetryContext("removeChannel", telemetryContext);
        var properties = {
            operationName: TelemetryEventNames.INSTALLER_REMOVE_CHANNEL,
            installerId: this._installerImpl.id,
            installSessionId: telemetryContext.installSessionId,
            "channelId": channelId,
        };
        var scope = this._telemetry.startOperation(REMOVE_CHANNEL, properties);
        this.addCorrelations(telemetryContext, scope);
        var productSummariesPromise = this._installerImpl.removeChannel(channelId, telemetryContext);
        // Send telemetry, but don't return this to the caller.
        var telemetryPromise = productSummariesPromise.then(function () { return scope.end(vs_telemetry_api_1.TelemetryResult.Success); }, function (error) {
            logger.writeError("Failed to remove channel. [installerId: " + _this.id + ", channelId: " + channelId + ", " +
                ("error: " + error.message + " at " + error.stack + "]"));
            scope.end(vs_telemetry_api_1.TelemetryResult.Failure);
        });
        this.addPendingTelemetryPromise(telemetryPromise);
        return productSummariesPromise;
    };
    InstallerTelemetryDecorator.prototype.getInstalledProduct = function (installationPath, withUpdatePackages, fetchLatest, vsixs, telemetryContext) {
        var _this = this;
        var methodName = "getInstalledProduct";
        var bucketParameters = new bucket_parameters_1.BucketParameters(methodName, this.constructor.name);
        logger.writeVerbose("Getting installed product. " +
            ("[installerId: " + this.id + ", installationPath: " + installationPath + ", ") +
            ("withUpdatePackages: " + withUpdatePackages + "]"));
        telemetryContext = this.ensureTelemetryContext("getInstalledProduct", telemetryContext);
        var installedProduct = this._installerImpl.getInstalledProduct(installationPath, withUpdatePackages, fetchLatest, vsixs, telemetryContext);
        // Send telemetry, but don't return this to the caller.
        var telemetryPromise = installedProduct.then(function (result) {
            _this._telemetryAssetManager.addProduct(result);
        }, function (error) {
            _this.reportQueryFailure(bucketParameters, error);
            logger.writeError("Failed to get installed product. [installerId: " + _this.id + ", " +
                ("installationPath: " + installationPath + ", withUpdatePackages: " + withUpdatePackages + ", ") +
                ("error: " + error.message + " at " + error.stack + "]"));
        });
        this.addPendingTelemetryPromise(telemetryPromise);
        return installedProduct;
    };
    InstallerTelemetryDecorator.prototype.getProduct = function (channelId, productId, vsixs, telemetryContext) {
        var _this = this;
        logger.writeVerbose("Getting product. [installerId: " + this.id + ", productId: " + productId + "].");
        telemetryContext = this.ensureTelemetryContext("getProduct", telemetryContext);
        var methodName = "getProduct";
        var bucketParameters = new bucket_parameters_1.BucketParameters(methodName, this.constructor.name);
        var installerProduct = this._installerImpl.getProduct(channelId, productId, vsixs, telemetryContext);
        // Add telemetry, but don't return this to the caller.
        var telemetryPromise = installerProduct.then(function (result) {
            _this._telemetryAssetManager.addProduct(result);
        }, function (error) {
            _this.reportQueryFailure(bucketParameters, error);
            logger.writeError("Failed to get product. [installerId: " + _this.id + ", " +
                ("productId: " + productId + ", error: " + error.message + " at " + error.stack + "]"));
        });
        this.addPendingTelemetryPromise(telemetryPromise);
        return installerProduct;
    };
    InstallerTelemetryDecorator.prototype.evaluateInstallParameters = function (parameters) {
        var _this = this;
        return this._installerImpl.evaluateInstallParameters(parameters).then(function (evaluation) {
            if (evaluation.errorMessage) {
                _this.sendEvaluateParametersErrorTelemetry(EVALUATE_INSTALL_PARAMETERS, evaluation);
            }
            return evaluation;
        });
    };
    InstallerTelemetryDecorator.prototype.evaluateModifyParameters = function (parameters) {
        return this._installerImpl.evaluateModifyParameters(parameters);
    };
    InstallerTelemetryDecorator.prototype.install = function (parameters, telemetryContext) {
        var _this = this;
        var operationName = OPERATION_NAME_INSTALL;
        telemetryContext = this.ensureTelemetryContext(operationName, telemetryContext);
        this._operationStartTimes.set(parameters.installationPath, Date.now());
        var telemetryScope = this.startOperation(operationName, telemetryContext, parameters.product);
        var installPromise = this._installerImpl.install(parameters, telemetryContext);
        var telemetryPromise = installPromise.then(function (result) {
            var error = result.error || null;
            _this.endOperationWithProductDiff(telemetryScope, null /* productBefore */, result.product, {
                error: error,
                bucketParameters: new bucket_parameters_1.BucketParameters("install", _this.constructor.name),
            }, Product_1.RebootType[result.rebootRequired], /* rebootType */ Product_1.OperationResult[result.operationResult]);
        }, function (error) {
            telemetryContext.reason = "Getting the final product after an install rejected for product diff.";
            var getFinalInstalledProductPromise = _this._installerImpl.getInstalledProduct(parameters.installationPath, false /* withUpdatePackages */, false /* fetchLatest */, parameters.vsixs, telemetryContext);
            return getFinalInstalledProductPromise.then(function (product) {
                _this.endOperationWithProductDiff(telemetryScope, null /* productBefore */, product, {
                    error: error,
                    bucketParameters: new bucket_parameters_1.BucketParameters("install", _this.constructor.name),
                });
            }, function (e) {
                logger.writeError("Failed to get the installed product." +
                    (e.name + ": " + e.message + " at " + e.stack));
                var installState = Product_1.InstallState.Unknown;
                if (e instanceof errors_1.ItemNotInstalledError) {
                    // The product is not registered, so it is not installed.
                    installState = Product_1.InstallState.NotInstalled;
                }
                else {
                    // The error is unexpected, so post an event.
                    _this.sendEndOperationGetProductError(telemetryScope, e, "Failed to get the installed product after an install");
                }
                _this.endOperation({
                    telemetryScope: telemetryScope,
                    error: error,
                    installState: installState,
                    bucketParameters: new bucket_parameters_1.BucketParameters("install", _this.constructor.name),
                });
            });
        });
        telemetryPromise.finally(function () { return _this.removeProgress(parameters.installationPath); });
        this.addPendingTelemetryPromise(telemetryPromise);
        return installPromise;
    };
    InstallerTelemetryDecorator.prototype.modify = function (parameters, telemetryContext) {
        var _this = this;
        var product = parameters.product;
        var operationName = OPERATION_NAME_MODIFY;
        telemetryContext = this.ensureTelemetryContext(operationName, telemetryContext);
        this._operationStartTimes.set(product.installationPath, Date.now());
        var telemetryScope = this.startOperation(operationName, telemetryContext, product);
        var installPromise = this._installerImpl.modify(parameters, telemetryContext);
        var telemetryPromise = installPromise.then(function (result) {
            var error = result.error || null;
            _this.endOperationWithProductDiff(telemetryScope, product, result.product, {
                error: error,
                bucketParameters: new bucket_parameters_1.BucketParameters("modify", _this.constructor.name),
            }, Product_1.RebootType[result.rebootRequired], /* rebootType */ Product_1.OperationResult[result.operationResult]);
        }, function (error) {
            return _this.handleOperationRejection({
                error: error,
                getProductWithUpdatedPackages: parameters.updateOnModify,
                installationPath: product.installationPath,
                operationName: operationName,
                originalProductPromise: Promise.resolve(product),
                scope: telemetryScope,
                telemetryContext: telemetryContext,
            });
        });
        telemetryPromise.finally(function () { return _this.removeProgress(product.installationPath); });
        this.addPendingTelemetryPromise(telemetryPromise);
        return installPromise;
    };
    InstallerTelemetryDecorator.prototype.update = function (parameters, telemetryContext) {
        var _this = this;
        var product = parameters.product;
        var operationName = OPERATION_NAME_UPDATE;
        telemetryContext = this.ensureTelemetryContext(operationName, telemetryContext);
        this._operationStartTimes.set(product.installationPath, Date.now());
        var telemetryScope = this.startOperation(operationName, telemetryContext, product);
        // Add reason for call to getInstalledProductPromise
        telemetryContext.reason = "Getting the original product for update diff.";
        var getInstalledProductPromise = this.getInstalledProduct(product.installationPath, false /* withUpdatePackages */, false /* fetchLatest */, parameters.vsixs, telemetryContext);
        var updateProductPromise = this._installerImpl.update(parameters, telemetryContext);
        var telemetryPromise = updateProductPromise.then(function (result) {
            var error = result.error || null;
            _this.endOperationWithProductDiffPromises(operationName, telemetryScope, getInstalledProductPromise, Promise.resolve(result.product), {
                error: error,
                bucketParameters: new bucket_parameters_1.BucketParameters("update", _this.constructor.name),
            }, Product_1.RebootType[result.rebootRequired], /* rebootType */ Product_1.OperationResult[result.operationResult]);
        }, function (error) {
            return _this.handleOperationRejection({
                error: error,
                getProductWithUpdatedPackages: false,
                installationPath: product.installationPath,
                operationName: operationName,
                originalProductPromise: getInstalledProductPromise,
                scope: telemetryScope,
                telemetryContext: telemetryContext,
            });
        });
        telemetryPromise.finally(function () { return _this.removeProgress(product.installationPath); });
        this.addPendingTelemetryPromise(telemetryPromise);
        return updateProductPromise;
    };
    InstallerTelemetryDecorator.prototype.repair = function (parameters, telemetryContext) {
        var _this = this;
        var product = parameters.product;
        var operationName = OPERATION_NAME_REPAIR;
        telemetryContext = this.ensureTelemetryContext(operationName, telemetryContext);
        this._operationStartTimes.set(product.installationPath, Date.now());
        var telemetryScope = this.startOperation(operationName, telemetryContext, product);
        // Add reason for call to getInstalledProduct
        telemetryContext.reason = "Getting the original installed product for a repair";
        var getInstalledProductPromise = this.getInstalledProduct(product.installationPath, false /* withUpdatePackages */, false /* fetchLatest */, [], telemetryContext);
        var repairProductPromise = this._installerImpl.repair(parameters, telemetryContext);
        var telemetryPromise = repairProductPromise.then(function (result) {
            var error = result.error || null;
            _this.endOperationWithProductDiffPromises(operationName, telemetryScope, getInstalledProductPromise, Promise.resolve(result.product), {
                error: error,
                bucketParameters: new bucket_parameters_1.BucketParameters("repair", _this.constructor.name),
            }, Product_1.RebootType[result.rebootRequired], /* rebootType */ Product_1.OperationResult[result.operationResult]);
        }, function (error) {
            return _this.handleOperationRejection({
                error: error,
                getProductWithUpdatedPackages: false,
                installationPath: product.installationPath,
                operationName: operationName,
                originalProductPromise: getInstalledProductPromise,
                scope: telemetryScope,
                telemetryContext: telemetryContext,
            });
        });
        telemetryPromise.finally(function () { return _this.removeProgress(product.installationPath); });
        this.addPendingTelemetryPromise(telemetryPromise);
        return repairProductPromise;
    };
    InstallerTelemetryDecorator.prototype.resume = function (parameters, telemetryContext) {
        var _this = this;
        var product = parameters.product;
        var operationName = OPERATION_NAME_RESUME;
        telemetryContext = this.ensureTelemetryContext(operationName, telemetryContext, this._relatedInstallSessionId);
        this._operationStartTimes.set(product.installationPath, Date.now());
        var telemetryScope = this.startOperation(operationName, telemetryContext, product);
        var resumeProductPromise = this._installerImpl.resume(parameters, telemetryContext);
        var telemetryPromise = resumeProductPromise.then(function (result) {
            var error = result.error || null;
            _this.endOperationWithProductDiff(telemetryScope, null, result.product, {
                error: error,
                bucketParameters: new bucket_parameters_1.BucketParameters("resume", _this.constructor.name),
            }, Product_1.RebootType[result.rebootRequired], /* rebootType */ Product_1.OperationResult[result.operationResult]);
        }, function (error) {
            return _this.handleOperationRejection({
                error: error,
                getProductWithUpdatedPackages: false,
                installationPath: product.installationPath,
                operationName: operationName,
                originalProductPromise: Promise.resolve(null),
                scope: telemetryScope,
                telemetryContext: telemetryContext,
            });
        });
        telemetryPromise.finally(function () { return _this.removeProgress(product.installationPath); });
        this.addPendingTelemetryPromise(telemetryPromise);
        return resumeProductPromise;
    };
    InstallerTelemetryDecorator.prototype.launch = function (parameters, telemetryContext) {
        var _this = this;
        var product = parameters.product;
        var operationName = OPERATION_NAME_LAUNCH;
        telemetryContext = this.ensureTelemetryContext(operationName, telemetryContext);
        var telemetryScope = this.startOperation(operationName, telemetryContext, product);
        var launchPromise = this._installerImpl.launch(parameters, telemetryContext);
        var telemetryPromise = launchPromise
            .then(function () {
            _this.endOperation({
                product: product,
                telemetryScope: telemetryScope,
            });
        }, function (error) {
            _this.endOperation({
                product: product,
                telemetryScope: telemetryScope,
                error: error,
                bucketParameters: new bucket_parameters_1.BucketParameters("launch", _this.constructor.name),
            });
        });
        this.addPendingTelemetryPromise(telemetryPromise);
        return launchPromise;
    };
    InstallerTelemetryDecorator.prototype.uninstall = function (parameters, telemetryContext) {
        var _this = this;
        var product = parameters.product;
        var operationName = OPERATION_NAME_UNINSTALL;
        telemetryContext = this.ensureTelemetryContext(operationName, telemetryContext);
        this._operationStartTimes.set(product.installationPath, Date.now());
        var telemetryScope = this.startOperation(operationName, telemetryContext, product);
        // Do not send telemetry when getting the original product
        var getInstalledProductPromise = this._installerImpl.getInstalledProduct(product.installationPath, false /* withUpdatePackages */, false /* fetchLatest */, [], telemetryContext);
        var uninstallPromise = this._installerImpl.uninstall(parameters, telemetryContext);
        // Ignore errors when getting the original product.
        var telemetryPromise = getInstalledProductPromise
            .catch(function () { return null; })
            .then(function (originalProduct) { return uninstallPromise.then(function (result) { return _this.endOperationWithProductDiff(telemetryScope, originalProduct, null); }, function (error) { return _this.endOperationWithProductDiff(telemetryScope, originalProduct, null, {
            error: error,
            bucketParameters: new bucket_parameters_1.BucketParameters("uninstall", _this.constructor.name),
        }); }); });
        telemetryPromise.finally(function () { return _this.removeProgress(product.installationPath); });
        this.addPendingTelemetryPromise(telemetryPromise);
        return uninstallPromise;
    };
    InstallerTelemetryDecorator.prototype.uninstallAll = function (telemetryContext) {
        var _this = this;
        var operationName = OPERATION_NAME_UNINSTALL_ALL;
        telemetryContext = this.ensureTelemetryContext(operationName, telemetryContext);
        var telemetryScope = this.startOperation(operationName, telemetryContext, null);
        var uninstallAllPromise = this._installerImpl.uninstallAll(telemetryContext);
        var telemetryPromise = uninstallAllPromise.then(function () { return _this.endOperation({
            telemetryScope: telemetryScope,
        }); }, function (error) { return _this.endOperation({
            telemetryScope: telemetryScope,
            error: error,
            bucketParameters: new bucket_parameters_1.BucketParameters("uninstallAll", _this.constructor.name),
        }); });
        telemetryPromise.finally(function () { return _this.removeProgress(null); });
        this.addPendingTelemetryPromise(telemetryPromise);
        return uninstallAllPromise;
    };
    InstallerTelemetryDecorator.prototype.cancel = function (parameters, telemetryContext) {
        var _this = this;
        var product = parameters.product;
        var operationName = OPERATION_NAME_CANCEL;
        telemetryContext = this.ensureTelemetryContext(operationName, telemetryContext);
        var properties = this.getCommonProperties(telemetryContext, operationName);
        this.setCancelProperties(product.installationPath, properties, telemetryContext);
        properties.productId = product.id;
        properties.channelId = product.channelId;
        var scope = this._telemetry.startUserTask(CANCEL_OPERATION, properties);
        var cancelPromise = this._installerImpl.cancel(parameters, telemetryContext);
        var telemetryPromise = cancelPromise.then(function () {
            scope.end(vs_telemetry_api_1.TelemetryResult.Success);
        }, function (_error) {
            var event = _this._telemetry.postError(CANCEL_OPERATION_ERROR, "Failed to cancel the operation", new bucket_parameters_1.BucketParameters("cancel", _this.constructor.name), _error, properties);
            scope.correlate(event);
            scope.end(vs_telemetry_api_1.TelemetryResult.Failure);
        });
        this.addPendingTelemetryPromise(telemetryPromise);
        return cancelPromise;
    };
    InstallerTelemetryDecorator.prototype.onProductUpdateAvailable = function (callback) {
        return this._installerImpl.onProductUpdateAvailable(callback);
    };
    InstallerTelemetryDecorator.prototype.onInstalledProductUpdateAvailable = function (callback) {
        return this._installerImpl.onInstalledProductUpdateAvailable(callback);
    };
    InstallerTelemetryDecorator.prototype.onProgress = function (callback) {
        this._progressCallback = callback;
    };
    InstallerTelemetryDecorator.prototype.onNotification = function (callback) {
        return this._installerImpl.onNotification(callback);
    };
    InstallerTelemetryDecorator.prototype.setMessageHandler = function (callback) {
        return this._installerImpl.setMessageHandler(callback);
    };
    InstallerTelemetryDecorator.prototype.dispose = function () {
        var _this = this;
        return Promise.all(Array.from(this._pendingTelemetryPromises))
            .catch()
            .then(function () {
            _this._telemetry.postOperation(TelemetryEventNames.SETUP_ENGINE_DISPOSE, vs_telemetry_api_1.TelemetryResult.None, "disposing services", {});
            return _this._installerImpl.dispose();
        })
            .then(function () { return; });
    };
    InstallerTelemetryDecorator.prototype.waitForTelemetry = function () {
        return Promise.all(Array.from(this._pendingTelemetryPromises))
            .then(function () { return; });
    };
    InstallerTelemetryDecorator.prototype.openLog = function () {
        this._installerImpl.openLog();
    };
    InstallerTelemetryDecorator.prototype.deepCleanPreviewInstallations = function () {
        var _this = this;
        var telemetryContext = this.ensureTelemetryContext("deepCleanPreviewInstallations");
        // deepCleanPreviewInstallations never comes from the command line
        telemetryContext.initiatedFromCommandLine = false;
        var operationName = OPERATION_NAME_DEEP_CLEAN_PREVIEW_INSTALLATIONS;
        var telemetryScope = this.startOperation(operationName, telemetryContext, null);
        var deepCleanPromise = this._installerImpl.deepCleanPreviewInstallations();
        deepCleanPromise.then(function () { return _this.endOperation({
            telemetryScope: telemetryScope,
        }); }, function (error) { return _this.endOperation({
            telemetryScope: telemetryScope,
            error: error,
            bucketParameters: new bucket_parameters_1.BucketParameters("deepCleanPreviewInstallations", _this.constructor.name),
        }); });
        return deepCleanPromise;
    };
    InstallerTelemetryDecorator.prototype.getStatus = function () {
        var _this = this;
        return this._installerImpl.getStatus()
            .then(function (status) {
            if (status.hasError) {
                _this.sendInstallerStatusErrorTelemetry(GET_INSTALLER_STATUS, status);
            }
            return status;
        });
    };
    InstallerTelemetryDecorator.prototype.isElevated = function () {
        return this._installerImpl.isElevated();
    };
    /**
     * @param {string} relatedInstallSessionId - Used over installSessionId if one is passed. Typically only
     *      for the resume case.
     */
    InstallerTelemetryDecorator.prototype.ensureTelemetryContext = function (userRequestedOperation, context, relatedInstallSessionId) {
        if (!context) {
            return {
                sessionId: this._sessionId,
                installSessionId: relatedInstallSessionId || Session_1.createSessionId(),
                serializedCorrelations: [],
                userRequestedOperation: userRequestedOperation,
            };
        }
        if (!context.installSessionId) {
            context.installSessionId = relatedInstallSessionId || Session_1.createSessionId();
        }
        if (!context.sessionId) {
            context.sessionId = this._sessionId;
        }
        // Correlations is undefined
        if (!Array.isArray(context.serializedCorrelations)) {
            context.serializedCorrelations = [];
        }
        if (!context.userRequestedOperation) {
            context.userRequestedOperation = userRequestedOperation;
        }
        return context;
    };
    /**
     * @param  {string} operationName The name of the telemetry operation (e.g. install)
     * @param  {TelemetryContext} telemetryContext The context to pass to the setup engine.
     * Includes additional telemetry properties.
     * @param {IProduct | IInstalledProduct | IInstalledProductSummary} product
     * The product involved in the operation.
     * @returns ITelemetryScopeAggregator The scope for the operation
     */
    InstallerTelemetryDecorator.prototype.startOperation = function (operationName, telemetryContext, product) {
        var properties = this.getCommonProperties(telemetryContext, operationName);
        if (string_utilities_1.caseInsensitiveAreEqual(operationName, "install")) {
            properties.rejectRecommendedSelection = telemetryContext.rejectRecommendedSelection ? "true" : "false";
        }
        if (string_utilities_1.caseInsensitiveAreEqual(operationName, "launch")) {
            properties.isAutolaunch = telemetryContext.isAutolaunch ? "true" : "false";
        }
        if (product) {
            this.addProductProperties(properties, product);
            // If this is an update, log the updateTo/From properties
            if (operationName === OPERATION_NAME_UPDATE) {
                properties.appVersionUpdateFrom = product.version.build;
                properties.appVersionUpdateTo = product.latestVersion.build;
            }
            if (product instanceof Product_1.ProductBase) {
                var installedWorkloads = product.workloads.filter(function (w) { return w.installState !== Product_1.InstallState.NotInstalled; });
                var selectedWorkloads = product.selectedWorkloads;
                // The diff is the workloads installed vs the workloads selected.
                var selectedWorkloadDiff = new id_version_collection_diff_1.IdVersionCollectionDiff(installedWorkloads, selectedWorkloads);
                var installedComponents = product.allComponents
                    .filter(function (c) { return c.installState !== Product_1.InstallState.NotInstalled; });
                var selectedComponents = product.selectedComponents;
                // The diff is the components installed vs the components selected.
                var selectedComponentDiff = new id_version_collection_diff_1.IdVersionCollectionDiff(installedComponents, selectedComponents);
                // We can add the added/removed elements for modify/install since this indicates selection.
                properties.workloadsAdded = selectedWorkloadDiff.added.map(function (w) { return w.id; }).join(",");
                properties.workloadsRemoved = selectedWorkloadDiff.removed.map(function (w) { return w.id; }).join(",");
                var componentsAdded = selectedComponentDiff.added.map(function (c) { return c.id; }).join(",");
                var componentsRemoved = selectedComponentDiff.removed.map(function (c) { return c.id; }).join(",");
                this.addTelemetryStringProperty(componentsAdded, "componentsAdded", properties);
                this.addTelemetryStringProperty(componentsRemoved, "componentsRemoved", properties);
            }
        }
        var scope = this._telemetry.startOperation(PRODUCT_INSTALL, properties);
        this.addCorrelations(telemetryContext, scope);
        return scope;
    };
    InstallerTelemetryDecorator.prototype.endOperationWithProductDiffPromises = function (operationName, telemetryScope, productBeforePromise, productPromise, errorInfo, rebootType, operationResult) {
        var _this = this;
        return Promise.all([productBeforePromise, productPromise])
            .then(function (productList) {
            // productBefore can be null, eg for install
            var productBefore = productList[0];
            // product can be null, eg for uninstall
            var product = productList[1];
            _this.endOperationWithProductDiff(telemetryScope, productBefore, product, errorInfo, rebootType, operationResult);
        }, function (_error) {
            // Data Loss...
            // Send an error event with the setup engine error if we have it, otherwise
            // just send it with the error thrown.
            // The error is unexpected, so post an event.
            _this.sendEndOperationGetProductError(telemetryScope, _error, "Failed to get the product for " + operationName);
            var error = errorInfo && errorInfo.error;
            var bucketParameters = errorInfo && errorInfo.bucketParameters;
            // If one of the product promises fail, there's no hope
            // of sending an accurate diff, so just send a result with
            // some of the fields empty.
            _this.endOperation({
                telemetryScope: telemetryScope,
                bucketParameters: bucketParameters,
                error: error,
                rebootType: rebootType,
                operationResult: operationResult,
            });
        });
    };
    InstallerTelemetryDecorator.prototype.endOperationWithProductDiff = function (telemetryScope, productBefore, product, errorInfo, rebootType, operationResult) {
        var installState = product ? product.installState : Product_1.InstallState.NotInstalled;
        var actualInstallSizeKB = product ? product.installSize : 0;
        if (product) {
            this.traceAsset(telemetryScope, product);
        }
        // Used to calculate what was installed before the operation and what is installed after.
        var installedWorkloadDiff = new id_version_collection_diff_1.IdVersionCollectionDiff(productBefore ? productBefore.workloads.filter(function (w) { return w.installState !== Product_1.InstallState.NotInstalled; }) : [], product ? product.workloads.filter(function (w) { return w.installState !== Product_1.InstallState.NotInstalled; }) : []);
        // Used to calculate what was installed before the operation and what is installed after.
        var installedComponentDiff = new id_version_collection_diff_1.IdVersionCollectionDiff(productBefore ? productBefore.allComponents.filter(function (c) { return c.installState !== Product_1.InstallState.NotInstalled; }) : [], product ? product.allComponents.filter(function (c) { return c.installState !== Product_1.InstallState.NotInstalled; }) : []);
        var notInstalledSelectedWorkloads = product && product.selectedWorkloads
            .filter(function (w) { return w.installState !== Product_1.InstallState.Installed; });
        var notInstalledSelectedComponents = product && product.selectedComponents
            .filter(function (c) { return c.installState !== Product_1.InstallState.Installed && c.installable.state; });
        var skippedSelectedComponents = product && product.selectedComponents
            .filter(function (c) { return c.installState !== Product_1.InstallState.Installed && !c.installable.state; });
        var installedComponents = product &&
            product.allComponents.filter(function (c) { return c.installState === Product_1.InstallState.Installed; }) || [];
        var isTorn = product
            && product.installState === Product_1.InstallState.Installed
            && product.failedPackageIds
            && product.failedPackageIds.length > 0;
        var hasCorePackageFailures = product
            && product.errorDetails.hasCorePackageFailures;
        var error = errorInfo && errorInfo.error;
        var bucketParameters = errorInfo && errorInfo.bucketParameters;
        this.endOperation({
            telemetryScope: telemetryScope,
            installState: installState,
            actualInstallSizeKB: actualInstallSizeKB,
            installedWorkloadDiff: installedWorkloadDiff,
            failedWorkloads: notInstalledSelectedWorkloads,
            installedWorkloads: product && product.installedWorkloads,
            installedComponentDiff: installedComponentDiff,
            failedComponents: notInstalledSelectedComponents,
            skippedComponents: skippedSelectedComponents,
            installedComponents: installedComponents,
            failedPackageIds: product && product.failedPackageIds,
            skippedPackageIds: product && product.skippedPackageIds,
            error: error,
            isTorn: isTorn,
            hasCorePackageFailures: hasCorePackageFailures,
            product: product ? product : productBefore,
            rebootType: rebootType,
            operationResult: operationResult,
            bucketParameters: bucketParameters,
        });
    };
    InstallerTelemetryDecorator.prototype.endOperation = function (parameters) {
        var installState = parameters.installState !== undefined
            ? Product_1.InstallState[parameters.installState]
            : UNKNOWN_VALUE;
        var error = parameters.error;
        var telemetryScope = parameters.telemetryScope;
        var installedWorkloadDiff = parameters.installedWorkloadDiff;
        var installedComponentDiff = parameters.installedComponentDiff;
        var workloadsInstalled = installedWorkloadDiff ? installedWorkloadDiff.added.map(function (d) { return d.id; }).join(",") : null;
        var workloadsUninstalled = installedWorkloadDiff ?
            installedWorkloadDiff.removed.map(function (d) { return d.id; }).join(",") :
            null;
        var workloadsUpdated = installedWorkloadDiff ? installedWorkloadDiff.changed.map(function (d) { return d.id; }).join(",") : null;
        var componentsInstalled = installedComponentDiff ?
            installedComponentDiff.added.map(function (c) { return c.id; }).join(",") :
            null;
        var componentsUninstalled = installedComponentDiff ?
            installedComponentDiff.removed.map(function (c) { return c.id; }).join(",") :
            null;
        var componentsUpdated = installedComponentDiff ?
            installedComponentDiff.changed.map(function (c) { return c.id; }).join(",") :
            null;
        var errorCode = (error && error.name) || null;
        var errorMessage = (error && error.message) || null;
        // handle null installSize, since Math.round(null) produces 0.
        var actualInstallSizeKB = typeof parameters.actualInstallSizeKB === "number"
            ? Math.round(parameters.actualInstallSizeKB)
            : null;
        var failedWorkloadIds = parameters.failedWorkloads && parameters.failedWorkloads.map(function (w) { return w.id; }) || null;
        var installedWorkloadIds = parameters.installedWorkloads
            && parameters.installedWorkloads.map(function (w) { return w.id; }) || null;
        var failedComponentIds = parameters.failedComponents
            && parameters.failedComponents.map(function (w) { return w.id; }) || null;
        var installedComponentIds = parameters.installedComponents
            && parameters.installedComponents.map(function (c) { return c.id; }) || null;
        var skippedComponentIds = parameters.skippedComponents
            && parameters.skippedComponents.map(function (c) { return c.id; }) || null;
        var failedPackageIds = parameters.failedPackageIds || null;
        var skippedPackageIds = parameters.skippedPackageIds || null;
        var product = parameters.product;
        var properties = {
            installState: installState,
            actualInstallSizeKB: actualInstallSizeKB,
            workloadsInstalled: workloadsInstalled,
            workloadsUninstalled: workloadsUninstalled,
            workloadsUpdated: workloadsUpdated,
            failedComponentIdsCount: failedComponentIds && failedComponentIds.length,
            installedComponentIdsCount: installedComponentIds && installedComponentIds.length,
            failedWorkloadIds: failedWorkloadIds && failedWorkloadIds.join(","),
            failedWorkloadIdsCount: failedWorkloadIds && failedWorkloadIds.length,
            installedWorkloadIds: installedWorkloadIds && installedWorkloadIds.join(","),
            installedWorkloadIdsCount: installedWorkloadIds && installedWorkloadIds.length,
            failedPackageIds: failedPackageIds && failedPackageIds.join(","),
            failedPackageIdsCount: failedPackageIds && failedPackageIds.length,
            skippedPackageIds: skippedPackageIds && skippedPackageIds.join(","),
            skippedPackageIdsCount: skippedPackageIds && skippedPackageIds.length,
            errorMessage: errorMessage,
            errorCode: errorCode,
            isTorn: parameters.isTorn ? "true" : "false",
            rebootType: parameters.rebootType || "",
            hasCorePackageFailures: parameters.hasCorePackageFailures ? "true" : "false",
            operationResult: parameters.operationResult || UNKNOWN_VALUE,
        };
        // Only overwrite the start event product properties if we have a final product.
        this.addProductPropertiesIfNotUnknown(properties, product);
        this.addTelemetryStringProperty(componentsInstalled, "componentsInstalled", properties);
        this.addTelemetryStringProperty(componentsUninstalled, "componentsUninstalled", properties);
        this.addTelemetryStringProperty(componentsUpdated, "componentsUpdated", properties);
        this.addTelemetryStringProperty(failedComponentIds && failedComponentIds.join(","), "failedComponentIds", properties);
        this.addTelemetryStringProperty(skippedComponentIds && skippedComponentIds.join(","), "skippedComponentIds", properties);
        this.addTelemetryStringProperty(installedComponentIds && installedComponentIds.join(","), "installedComponentIds", properties);
        var result = vs_telemetry_api_1.TelemetryResult.Success;
        if (error) {
            if (error instanceof errors_1.OperationCanceledError) {
                result = vs_telemetry_api_1.TelemetryResult.UserCancel;
            }
            else if (error instanceof errors_1.ChannelsLockedError) {
                result = vs_telemetry_api_1.TelemetryResult.None;
            }
            else {
                result = vs_telemetry_api_1.TelemetryResult.Failure;
                var faultEvent = this._telemetry.postError(PRODUCT_INSTALL_ERROR, errorMessage, parameters.bucketParameters, error);
                telemetryScope.correlate(faultEvent);
            }
        }
        telemetryScope.end(result, properties);
    };
    InstallerTelemetryDecorator.prototype.traceAsset = function (scope, product) {
        if (product) {
            if (product.workloads) {
                this.sendAssetEvents(scope, product.workloads.filter(function (w) { return w.installState === Product_1.InstallState.Installed; }).map(function (w) { return w.id; }), product, WORKLOAD_PREFIX, ASSET_WORKLOADS);
            }
            if (product.allComponents) {
                this.sendAssetEvents(scope, product.allComponents.filter(function (c) { return c.installState === Product_1.InstallState.Installed; }).map(function (c) { return c.id; }), product, COMPONENT_PREFIX, ASSET_COMPONENTS);
            }
        }
    };
    /**
     * Adds common properties from products, like channel ID and version.
     */
    InstallerTelemetryDecorator.prototype.addProductProperties = function (properties, product) {
        if (!properties) {
            properties = {};
        }
        if (product) {
            var productVersion = product && product.version;
            properties.productId = product.id || UNKNOWN_VALUE;
            properties.appVersion = productVersion.build || UNKNOWN_VALUE;
            properties.channelId = product.channelId || UNKNOWN_VALUE;
        }
    };
    InstallerTelemetryDecorator.prototype.reportQueryFailure = function (bucketParameters, error, properties) {
        if (error && !postErrorExcludeList.some(function (excludedType) { return error instanceof excludedType; })) {
            var errorMessage = error.message || "";
            this._telemetry.postError(PRODUCT_QUERY_ERROR, errorMessage, bucketParameters, error, properties);
        }
    };
    InstallerTelemetryDecorator.prototype.addCorrelations = function (context, scope) {
        if (scope) {
            var serializedCorrelations_1 = context.serializedCorrelations;
            scope.serializeCorrelations().forEach(function (serializedCorrelation) {
                if (serializedCorrelation && serializedCorrelations_1.indexOf(serializedCorrelation) === -1) {
                    serializedCorrelations_1.push(serializedCorrelation);
                }
            });
        }
    };
    InstallerTelemetryDecorator.prototype.sendAssetEvents = function (scope, names, product, propertyPrefix, assetName) {
        var _loop_1 = function (splicedArray) {
            var properties = {};
            splicedArray.forEach(function (name, index) {
                properties[propertyPrefix + (index + 1).toString()] = name;
            });
            this_1.addProductProperties(properties, product);
            scope.correlate(this_1._telemetry.postAsset(assetName, product.id, PRODUCT_INSTALL_EVENT_VERSION, properties));
        };
        var this_1 = this;
        for (var splicedArray = names.splice(0, MAX_ASSET_PROPERTIES); splicedArray.length > 0; splicedArray = names.splice(0, MAX_ASSET_PROPERTIES)) {
            _loop_1(splicedArray);
        }
    };
    InstallerTelemetryDecorator.prototype.getCommonProperties = function (telemetryContext, operationName) {
        var props = {
            installSessionId: telemetryContext.installSessionId,
            installerId: this.id,
            operationName: operationName,
            howLaunched: telemetryContext.initiatedFromCommandLine ? "commandLine" : "userAction",
            numberOfInstalls: telemetryContext.numberOfInstalls,
            isFirstInstallExperience: telemetryContext.isFirstInstallExperience ? "true" : "false",
            reason: telemetryContext.reason,
        };
        return props;
    };
    InstallerTelemetryDecorator.prototype.evaluationParametersErrorTypeToString = function (evaluation) {
        if (evaluation.invalidInstallationPathMessage) {
            return InstallParametersErrorType[InstallParametersErrorType.InvalidInstallPath];
        }
        return InstallParametersErrorType[InstallParametersErrorType.Unknown];
    };
    InstallerTelemetryDecorator.prototype.sendEvaluateParametersErrorTelemetry = function (eventName, evaluation) {
        if (!string_utilities_1.caseInsensitiveAreEqual(this._previousInstallParamsErrorMessage, evaluation.errorMessage)) {
            this._previousInstallParamsErrorMessage = evaluation.errorMessage;
            this._telemetry.postOperation(eventName, vs_telemetry_api_1.TelemetryResult.Success, "Evaluate install parameters reported: " + evaluation.errorMessage, {
                // Convert error type to a string
                errorType: this.evaluationParametersErrorTypeToString(evaluation)
            });
        }
    };
    InstallerTelemetryDecorator.prototype.installerStatusErrorTypeToString = function (status) {
        if (status.blockingProcessNames.length > 0) {
            return InstallerStatusErrorType[InstallerStatusErrorType.BlockingProcessIsRunning];
        }
        if (status.installationOperationRunning) {
            return InstallerStatusErrorType[InstallerStatusErrorType.InstallationOperationIsRunning];
        }
        if (status.isDisposed) {
            return InstallerStatusErrorType[InstallerStatusErrorType.IsDisposed];
        }
        if (status.rebootRequired) {
            return InstallerStatusErrorType[InstallerStatusErrorType.RebootRequired];
        }
        return InstallerStatusErrorType[InstallerStatusErrorType.Unknown];
    };
    /**
     * Gets the {TelemetryResult} for the {InstallerStatus} event.
     */
    InstallerTelemetryDecorator.prototype.installerStatusTelemetryResult = function (status) {
        // If we failed to get the status, the result is a failure.
        if (!status || status.isDisposed) {
            return vs_telemetry_api_1.TelemetryResult.Failure;
        }
        return vs_telemetry_api_1.TelemetryResult.Success;
    };
    InstallerTelemetryDecorator.prototype.sendInstallerStatusErrorTelemetry = function (eventName, status) {
        if (!string_utilities_1.caseInsensitiveAreEqual(this._previousInstallerStatusErrorMessage, status.errorMessage)) {
            this._previousInstallerStatusErrorMessage = status.errorMessage;
            this._telemetry.postOperation(eventName, this.installerStatusTelemetryResult(status), "Installer status returned with the error: " + status.errorMessage, {
                errorType: this.installerStatusErrorTypeToString(status)
            });
        }
    };
    InstallerTelemetryDecorator.prototype.addPendingTelemetryPromise = function (telemetryPromise) {
        var _this = this;
        this._pendingTelemetryPromises.add(telemetryPromise);
        telemetryPromise.finally(function () {
            _this._pendingTelemetryPromises.delete(telemetryPromise);
        });
    };
    /**
     * Adds the string to the property bag. If the string is longer than the max
     * telemetry string length it is split into multiple properties.
     *
     * Ex: propertyName.1 = "super long st"
     *     propertyName.2 = "ring that got"
     *     propertyName.3 = "truncated. "
     */
    InstallerTelemetryDecorator.prototype.addTelemetryStringProperty = function (propertyToAdd, propertyName, properties) {
        if (propertyToAdd) {
            var propertyToAddCopy = propertyToAdd.slice(0);
            var propertyNumber = 1;
            while (propertyToAddCopy.length > exports.MAX_TELEMETRY_STRING_LENGTH) {
                this.addTelemetryStringPropertyPart(propertyName, propertyNumber, propertyToAddCopy.slice(0, exports.MAX_TELEMETRY_STRING_LENGTH), properties);
                propertyToAddCopy = propertyToAddCopy.slice(exports.MAX_TELEMETRY_STRING_LENGTH);
                ++propertyNumber;
            }
            this.addTelemetryStringPropertyPart(propertyName, propertyNumber, propertyToAddCopy, properties);
        }
    };
    /**
     * Adds the property part to the property bag as:
     * {propertyName}.{partIndex}: value
     */
    InstallerTelemetryDecorator.prototype.addTelemetryStringPropertyPart = function (propertyName, partIndex, value, properties) {
        properties[propertyName + "." + partIndex] = value;
    };
    InstallerTelemetryDecorator.prototype.onProgressCallback = function (installationPath, type, percentComplete, detail, progressInfo) {
        var details = {
            progress: percentComplete,
            progressMessage: detail,
            timestamp: Date.now(),
            progressInfo: progressInfo
        };
        if (type === Product_1.ProgressType.Download) {
            this._downloadingProgressDetails.set(installationPath, details);
        }
        if (type === Product_1.ProgressType.Install) {
            this._applyingProgressDetails.set(installationPath, details);
        }
        if (this._progressCallback) {
            this._progressCallback(installationPath, type, percentComplete, detail, progressInfo);
        }
    };
    InstallerTelemetryDecorator.prototype.setCancelProperties = function (installationPath, properties, telemetryContext) {
        if (!properties) {
            return;
        }
        if (telemetryContext) {
            properties.operationToPause = telemetryContext.runningOperationToPause;
        }
        var now = Date.now();
        var applyingDetails = this._applyingProgressDetails.get(installationPath);
        var downloadDetails = this._downloadingProgressDetails.get(installationPath);
        var installationMessage = "Starting";
        var downloadMessage = "Starting";
        if (applyingDetails) {
            if (applyingDetails.progress >= 1) {
                installationMessage = "Finished";
            }
            else if (applyingDetails.progressMessage) {
                installationMessage = applyingDetails.progressMessage;
            }
            properties.timeSinceApplyingChangeInMs = now - applyingDetails.timestamp;
        }
        if (downloadDetails) {
            if (downloadDetails.progress >= 1) {
                downloadMessage = "Finished";
            }
            else if (downloadDetails.progressMessage) {
                downloadMessage = downloadDetails.progressMessage;
            }
            properties.timeSinceDownloadingChangeInMs = now - downloadDetails.timestamp;
        }
        properties.applyingDetails = installationMessage;
        properties.downloadDetails = downloadMessage;
        var operationStartTime = this._operationStartTimes.get(installationPath);
        if (operationStartTime !== null && operationStartTime !== undefined) {
            properties.timeSinceOperationStartInMs = now - operationStartTime;
        }
    };
    InstallerTelemetryDecorator.prototype.removeProgress = function (installationPath) {
        if (!installationPath) {
            return;
        }
        this._applyingProgressDetails.delete(installationPath);
        this._downloadingProgressDetails.delete(installationPath);
        this._operationStartTimes.delete(installationPath);
    };
    InstallerTelemetryDecorator.prototype.addProductPropertiesIfNotUnknown = function (properties, product) {
        if (product) {
            properties.productId = product.id;
            properties.channelId = product.channelId;
            var productVersion = product.version;
            if (productVersion) {
                properties.appVersion = productVersion.build;
            }
        }
    };
    InstallerTelemetryDecorator.prototype.handleOperationRejection = function (params) {
        var originalProductPromise = params.originalProductPromise || Promise.resolve(null);
        var scope = params.scope;
        var telemetryContext = params.telemetryContext;
        var operationName = params.operationName;
        var installationPath = params.installationPath;
        var getProductWithUpdatedPackages = !!params.getProductWithUpdatedPackages;
        var error = params.error || null;
        telemetryContext.reason = "Getting the final product after " + operationName + " rejected for product diff.";
        var getFinalInstalledProductPromise = this.getInstalledProduct(installationPath, getProductWithUpdatedPackages, false /* fetchLatest */, [], /* vsixs - don't load any for operation failure */ telemetryContext);
        return this.endOperationWithProductDiffPromises(operationName, scope, originalProductPromise, getFinalInstalledProductPromise, {
            error: error,
            bucketParameters: new bucket_parameters_1.BucketParameters(operationName, this.constructor.name),
        });
    };
    InstallerTelemetryDecorator.prototype.sendEndOperationGetProductError = function (scope, error, summary) {
        var errorEvent = this._telemetry.postOperation(TelemetryEventNames.END_OPERATION_GET_PRODUCT_ERROR, vs_telemetry_api_1.TelemetryResult.Failure, summary, {
            errorMessage: error && error.message,
            errorName: error && error.name,
            errorStack: error && error.stack,
        });
        if (scope) {
            scope.correlate(errorEvent);
        }
    };
    return InstallerTelemetryDecorator;
}());
exports.InstallerTelemetryDecorator = InstallerTelemetryDecorator;
//# sourceMappingURL=InstallerTelemetryDecorator.js.map