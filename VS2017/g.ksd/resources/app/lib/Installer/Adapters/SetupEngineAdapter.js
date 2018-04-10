/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var deep_clean_preview_installations_1 = require("../../SetupEngine/deep-clean-preview-installations");
var errors_1 = require("../../errors");
var Logger_1 = require("../../Logger");
var InstallerError_1 = require("../../SetupEngine/InstallerError");
var Product_1 = require("../Product");
var requires = require("../../requires");
var SetupEngine = require("../../SetupEngine/SetupEngine");
var typeConverter = require("./SetupEngineTypeConverter");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var Telemetry_1 = require("../../../lib/Telemetry/Telemetry");
var TelemetryEventNames = require("../../../lib/Telemetry/TelemetryEventNames");
var bucket_parameters_1 = require("../../../lib/Telemetry/bucket-parameters");
var telemetry_utils_1 = require("../../../lib/Telemetry/telemetry-utils");
var logger = Logger_1.getLogger();
var SETUP_ENGINE_ADAPTER_ID = "SetupEngine";
// EventEmitter event names
var PROGRESS_EVENT_NAME = "progress";
var NOTIFICATION_EVENT_NAME = "notification";
var PRODUCT_UPDATE_AVAILABLE_EVENT_NAME = "product-update-available";
var INSTALLED_PRODUCT_UPDATE_AVAILABLE_EVENT_NAME = "installed-product-update-available";
var SERVICE_UPDATE_REQUIRED_EVENT_NAME = "setup-service-update-required";
var SetupEngineAdapter = /** @class */ (function () {
    function SetupEngineAdapter(setupEnginePath, client, channelUrl, installChannelUrl, installCatalogUrl, getCommandLineParamsForResume, bootstrapperCommunicator, ignoreEngineUpdates, ignoreUpdates) {
        if (ignoreUpdates === void 0) { ignoreUpdates = false; }
        this._handleServiceErrorBind = this.handleServiceError.bind(this);
        this._handleServiceHubErrorBind = this.handleServiceHubError.bind(this);
        this._onMessageHandler = null;
        this._runningChannelOperation = Promise.resolve();
        this._onInstallerMessage = this.onInstallerMessage.bind(this);
        this._setupEnginePath = setupEnginePath;
        this._client = client;
        this._channelUrl = channelUrl || null;
        this._installChannelUrl = installChannelUrl || null;
        this._installCatalogUrl = installCatalogUrl || null;
        this._getCommandLineParametersForResume = getCommandLineParamsForResume;
        this._eventEmitter = new events_1.EventEmitter();
        this._ignoreEngineUpdates = ignoreEngineUpdates;
        this._ignoreUpdates = ignoreUpdates;
        this._bootstrapperCommunicator = bootstrapperCommunicator;
    }
    Object.defineProperty(SetupEngineAdapter.prototype, "id", {
        get: function () {
            return SETUP_ENGINE_ADAPTER_ID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SetupEngineAdapter.prototype, "installerUpdateRequired", {
        get: function () {
            return this._setupServiceUpdateRequired;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets a list of installed product summaries.
     */
    SetupEngineAdapter.prototype.getInstalledProductSummaries = function (telemetryContext) {
        var _this = this;
        return this._runningChannelOperation.then(function () {
            return _this.getInstalledProductsProvider()
                .then(function (productsProvider) {
                return productsProvider.getInstalledProductSummaries();
            })
                .then(function (result) {
                return typeConverter.installedProductSummariesResultFromSetupEngine(result, SETUP_ENGINE_ADAPTER_ID);
            })
                .catch(_this._handleServiceErrorBind);
        });
    };
    /**
     * Gets a list of installable product summaries.
     */
    SetupEngineAdapter.prototype.getProductSummaries = function (telemetryContext) {
        var _this = this;
        return this._runningChannelOperation.then(function () {
            return _this.getProductsProvider()
                .then(function (productsProvider) {
                return productsProvider.getProductSummaries();
            })
                .then(function (productSummaries) {
                return typeConverter.productSummariesFromSetupEngine(productSummaries, SETUP_ENGINE_ADAPTER_ID);
            })
                .catch(_this._handleServiceErrorBind);
        });
    };
    /**
     * Gets the logs for the installed products.
     */
    SetupEngineAdapter.prototype.getInstalledProductLogs = function () {
        return this.getInstalledProductsProvider()
            .then(function (productsProvider) {
            return productsProvider.getInstalledProductLogs();
        })
            .then(function (logs) {
            return logs;
        })
            .catch(this._handleServiceErrorBind);
    };
    /**
     * Gets a list of information about the channels.
     */
    SetupEngineAdapter.prototype.getChannelInfo = function (telemetryContext) {
        return this.getProductsProvider()
            .then(function (productsProvider) {
            return productsProvider.getChannelInfo();
        })
            .then(function (channelInfoList) {
            return typeConverter.channelInfoListFromSetupEngine(channelInfoList);
        })
            .catch(this._handleServiceErrorBind);
    };
    SetupEngineAdapter.prototype.removeChannel = function (channelId, telemetryContext) {
        return this.getProductsProvider()
            .then(function (productsProvider) {
            return productsProvider.removeChannel(channelId);
        })
            .then(function (productSummaries) {
            return typeConverter.productSummariesFromSetupEngine(productSummaries, SETUP_ENGINE_ADAPTER_ID);
        })
            .catch(this._handleServiceErrorBind);
    };
    SetupEngineAdapter.prototype.addChannel = function (channelUrl, installChannelUrl, installCatalogUrl, telemetryContext) {
        this._bootstrapperCommunicator.dismiss();
        var resultPromise = this.getProductsProvider()
            .then(function (productsProvider) {
            return productsProvider.addChannel(channelUrl, installChannelUrl, installCatalogUrl);
        })
            .catch(this._handleServiceErrorBind);
        this._runningChannelOperation = resultPromise.catch(function (error) {
            logger.writeError("Error while adding channel. Message: " + error.message);
        });
        return resultPromise;
    };
    /**
     * Gets an installed product for the specified install path.
     */
    SetupEngineAdapter.prototype.getInstalledProduct = function (installationPath, withUpdatePackages, fetchLatest, vsixs, telemetryContext) {
        var _this = this;
        requires.stringNotEmpty(installationPath, "installationPath");
        // convert null and undefined withUpdatePackages to false
        withUpdatePackages = !!withUpdatePackages;
        fetchLatest = !!fetchLatest;
        var setupEngineVsixs = typeConverter.vsixReferencesToSetupEngine(vsixs);
        return this.getInstalledProductsProvider()
            .then(function (productsProvider) {
            return productsProvider.getInstalledProduct(installationPath, withUpdatePackages, fetchLatest, setupEngineVsixs);
        })
            .then(function (product) {
            _this._bootstrapperCommunicator.dismiss();
            return typeConverter.installedProductFromSetupEngine(product, SETUP_ENGINE_ADAPTER_ID);
        })
            .catch(this._handleServiceErrorBind);
    };
    /**
     * Gets an installable product.
     */
    SetupEngineAdapter.prototype.getProduct = function (channelId, productId, vsixs, telemetryContext) {
        var _this = this;
        requires.notNullOrUndefined(channelId, "channelId");
        requires.notNullOrUndefined(productId, "productId");
        var setupEngineVsixs = typeConverter.vsixReferencesToSetupEngine(vsixs);
        return this.getProductsProvider()
            .then(function (productsProvider) {
            return productsProvider.getProduct(channelId, productId, setupEngineVsixs);
        })
            .then(function (product) {
            _this._bootstrapperCommunicator.dismiss();
            return typeConverter.productFromSetupEngine(product, SETUP_ENGINE_ADAPTER_ID);
        })
            .catch(this._handleServiceErrorBind);
    };
    /**
     * Evaluates a product's installation parameters.
     * @parm {InstallParameters} parameters - The product installation parameters
     */
    SetupEngineAdapter.prototype.evaluateInstallParameters = function (parameters) {
        requires.notNullOrUndefined(parameters, "parameters");
        return this.getInstaller()
            .then(function (installer) {
            var engineParameters = typeConverter.installParametersToSetupEngine(parameters);
            return installer.evaluateInstallParameters(engineParameters);
        })
            .then(function (evaluation) {
            var convertedEvaluation = typeConverter.installParametersEvaluationFromSetupEngine(evaluation);
            if (convertedEvaluation.errorMessage) {
                logger.writeError("EvaluateInstallParameters failed with error message: " + convertedEvaluation.errorMessage);
            }
            return convertedEvaluation;
        })
            .catch(this._handleServiceErrorBind);
    };
    /**
     * Evaluates a product's modification parameters.
     * @parm {ModifyParameters} parameters - The product modification parameters
     */
    SetupEngineAdapter.prototype.evaluateModifyParameters = function (parameters) {
        requires.notNullOrUndefined(parameters, "parameters");
        return this.getInstaller()
            .then(function (installer) {
            var engineParameters = typeConverter.modifyParametersToSetupEngine(parameters);
            return installer.evaluateModifyParameters(engineParameters);
        })
            .then(function (evaluation) {
            var convertedEvaluation = typeConverter.modifyParametersEvaluationFromSetupEngine(evaluation);
            if (convertedEvaluation.errorMessage) {
                logger.writeError("EvaluateModifyParameters failed with error message: " + convertedEvaluation.errorMessage);
            }
            return convertedEvaluation;
        })
            .catch(this._handleServiceErrorBind);
    };
    /**
     * Install a product to a path.
     * @param {InstallParameters} parameters - The installation parameters.
     * @returns {InstalledProduct} representing the installed product.
     */
    SetupEngineAdapter.prototype.install = function (parameters, telemetryContext) {
        var _this = this;
        requires.notNullOrUndefined(parameters, "parameters");
        return this.getInstaller()
            .then(function (installer) {
            var setupEngineParameters = typeConverter.installParametersToSetupEngine(parameters);
            var setupEngineTelemetryContext = typeConverter.telemetryContextToSetupEngine(telemetryContext);
            // capture the installation path to be used for progress notifications
            _this._installationPathOfCurrentOperation = setupEngineParameters.installationPath;
            var resumeParameters = _this._getCommandLineParametersForResume(setupEngineParameters.installationPath, telemetryContext && telemetryContext.installSessionId);
            var operationPromise = installer.installProduct(setupEngineParameters, resumeParameters, setupEngineTelemetryContext);
            _this.emitInstallOperationStarting(parameters.installationPath);
            var resultPromise = operationPromise
                .then(function (installResult) {
                return typeConverter.installOperationResultFromSetupEngine(installResult, SETUP_ENGINE_ADAPTER_ID);
            })
                .catch(function (error) {
                throw _this.handleServiceError(error, setupEngineParameters.productId);
            });
            resultPromise.finally(function () {
                _this.emitInstallOperationFinished(setupEngineParameters.installationPath);
                _this._installationPathOfCurrentOperation = null;
            });
            return resultPromise;
        })
            .catch(function (error) {
            throw _this.handleServiceError(error, parameters.product.id);
        });
    };
    /**
     * Modifies an installed product.
     * @param {ModifyParameters} parameters - The modification parameters.
     */
    SetupEngineAdapter.prototype.modify = function (parameters, telemetryContext) {
        var _this = this;
        requires.notNullOrUndefined(parameters, "parameters");
        return this.getInstaller()
            .then(function (installer) {
            var setupEngineParameters = typeConverter.modifyParametersToSetupEngine(parameters);
            var setupEngineTelemetryContext = typeConverter.telemetryContextToSetupEngine(telemetryContext);
            // capture the installation path to be used for progress notifications
            _this._installationPathOfCurrentOperation = setupEngineParameters.installationPath;
            var resumeParameters = _this._getCommandLineParametersForResume(setupEngineParameters.installationPath, telemetryContext && telemetryContext.installSessionId);
            var operationPromise = installer.modifyProduct(setupEngineParameters, resumeParameters, setupEngineTelemetryContext);
            _this.emitInstallOperationStarting(parameters.product.installationPath);
            var resultPromise = operationPromise
                .then(function (installResult) {
                return typeConverter.installOperationResultFromSetupEngine(installResult, SETUP_ENGINE_ADAPTER_ID);
            })
                .catch(function (error) {
                throw _this._handleServiceErrorBind(error, setupEngineParameters.installationPath);
            });
            resultPromise.finally(function () {
                _this.emitInstallOperationFinished(setupEngineParameters.installationPath);
                _this._installationPathOfCurrentOperation = null;
            });
            return resultPromise;
        })
            .catch(function (error) {
            throw _this.handleServiceError(error, parameters.product.installationPath);
        });
    };
    /**
     * Update a {InstalledProduct}.
     * Willow's Installer.update translates to a SetupEngine InstallProduct call.
     * @param {Updateparameters} parameters - The parameters to use for the update.
     * @returns {InstalledProduct} for the updated product.
     */
    SetupEngineAdapter.prototype.update = function (parameters, telemetryContext) {
        var _this = this;
        requires.notNullOrUndefined(parameters.product, "product");
        var installationPath = parameters.product.installationPath;
        requires.stringNotEmpty(installationPath, "installationPath");
        return this.getInstaller()
            .then(function (installer) {
            var setupEngineParameters = typeConverter.updateParametersToSetupEngine(parameters);
            var setupEngineTelemetryContext = typeConverter.telemetryContextToSetupEngine(telemetryContext);
            // capture the installation path to be used for progress notifications
            _this._installationPathOfCurrentOperation = installationPath;
            var resumeParameters = _this._getCommandLineParametersForResume(installationPath, telemetryContext && telemetryContext.installSessionId);
            var operationPromise = installer.updateProduct(setupEngineParameters, resumeParameters, setupEngineTelemetryContext);
            _this.emitInstallOperationStarting(installationPath);
            var resultPromise = operationPromise
                .then(function (installResult) {
                return typeConverter.installOperationResultFromSetupEngine(installResult, SETUP_ENGINE_ADAPTER_ID);
            });
            resultPromise.finally(function () {
                _this.emitInstallOperationFinished(installationPath);
                _this._installationPathOfCurrentOperation = null;
            });
            return resultPromise;
        })
            .catch(function (error) {
            throw _this.handleServiceError(error, installationPath);
        });
    };
    /**
     * Repair a {InstalledProduct}.
     * Willow's Installer.repair translates to a SetupEngine RepairProduct call.
     * @param {RepairParameters} parameters The parameters to use for the repair.
     * @returns {InstalledProduct} for the repaired product.
     */
    SetupEngineAdapter.prototype.repair = function (parameters, telemetryContext) {
        var _this = this;
        requires.notNullOrUndefined(parameters.product, "product");
        var installationPath = parameters.product.installationPath;
        requires.stringNotEmpty(installationPath, "installationPath");
        return this.getInstaller()
            .then(function (installer) {
            // capture the installation path to be used for progress notifications
            _this._installationPathOfCurrentOperation = installationPath;
            var setupEngineTelemetryContext = typeConverter.telemetryContextToSetupEngine(telemetryContext);
            var resumeParameters = _this._getCommandLineParametersForResume(installationPath, setupEngineTelemetryContext && setupEngineTelemetryContext.installSessionId);
            var operationPromise = installer.repairProduct(installationPath, resumeParameters, setupEngineTelemetryContext);
            _this.emitInstallOperationStarting(installationPath);
            var resultPromise = operationPromise
                .then(function (installResult) {
                return typeConverter.installOperationResultFromSetupEngine(installResult, SETUP_ENGINE_ADAPTER_ID);
            });
            resultPromise.finally(function () {
                _this.emitInstallOperationFinished(installationPath);
                _this._installationPathOfCurrentOperation = null;
            });
            return resultPromise;
        })
            .catch(function (error) {
            throw _this.handleServiceError(error, installationPath);
        });
    };
    /**
     * Resume the installation of the installed product.
     * Willow's Installer.resume translates to a SetupEngine ResumeInstallingProduct call.
     * @param {ResumeParameters} parameters The parameters to use to resume the operation.
     * @returns {InstalledProduct} for the repaired product.
     */
    SetupEngineAdapter.prototype.resume = function (parameters, telemetryContext) {
        var _this = this;
        requires.notNullOrUndefined(parameters.product, "product");
        var installationPath = parameters.product.installationPath;
        requires.stringNotEmpty(installationPath, "installationPath");
        // capture the installation path to be used for progress notifications
        this._installationPathOfCurrentOperation = installationPath;
        var setupEngineTelemetryContext = typeConverter.telemetryContextToSetupEngine(telemetryContext);
        var resultPromise = this.getInstaller()
            .then(function (installer) {
            var resumeParameters = _this._getCommandLineParametersForResume(installationPath, telemetryContext && telemetryContext.installSessionId);
            var result = installer.resumeInstallingProduct(installationPath, resumeParameters, setupEngineTelemetryContext);
            _this.emitInstallOperationStarting(installationPath);
            return result;
        })
            .then(function (result) {
            return typeConverter.installOperationResultFromSetupEngine(result, SETUP_ENGINE_ADAPTER_ID);
        })
            .catch(function (error) {
            throw _this._handleServiceErrorBind(error, installationPath);
        });
        resultPromise.finally(function () {
            _this.emitInstallOperationFinished(installationPath);
            _this._installationPathOfCurrentOperation = null;
        });
        return resultPromise;
    };
    /**
     * Uninstall an {InstalledProduct}.
     * @param {UninstallParameters} parameters The parameters to use for the uninstall.
     */
    SetupEngineAdapter.prototype.uninstall = function (parameters, telemetryContext) {
        var _this = this;
        requires.notNullOrUndefined(parameters.product, "product");
        var installationPath = parameters.product.installationPath;
        requires.stringNotEmpty(installationPath, "installationPath");
        return this.getInstaller()
            .then(function (installer) {
            // capture the installattion path to be used for progress notifications
            _this._installationPathOfCurrentOperation = installationPath;
            var setupEngineTelemetryContext = typeConverter.telemetryContextToSetupEngine(telemetryContext);
            var operationPromise = installer.uninstallProduct(installationPath, setupEngineTelemetryContext);
            _this.emitInstallOperationStarting(installationPath);
            operationPromise.finally(function () {
                _this._installationPathOfCurrentOperation = null;
                _this.emitInstallOperationFinished(installationPath);
            });
            return operationPromise;
        })
            .catch(function (error) {
            _this.handleServiceError(error, installationPath);
        });
    };
    SetupEngineAdapter.prototype.uninstallAll = function (telemetryContext) {
        var _this = this;
        var setupEngineTelemetryContext = typeConverter.telemetryContextToSetupEngine(telemetryContext);
        var result = this.getInstaller()
            .then(function (installer) {
            _this.emitInstallOperationStarting("");
            return installer.uninstallAllProducts(setupEngineTelemetryContext);
        })
            .catch(this._handleServiceErrorBind);
        result.finally(function () {
            _this.emitInstallOperationFinished("");
        });
        return result;
    };
    /**
     * Launches an installed product.
     * @param {LaunchParameters} parameters The parameters to use to launch a product.
     */
    SetupEngineAdapter.prototype.launch = function (parameters) {
        requires.notNullOrUndefined(parameters.product, "product");
        var installationPath = parameters.product.installationPath;
        requires.stringNotEmpty(installationPath, "installationPath");
        return this.getInstaller()
            .then(function (installer) {
            return installer.launchProduct(installationPath);
        })
            .catch(this._handleServiceErrorBind);
    };
    /**
     * Prepares to update setup.
     */
    SetupEngineAdapter.prototype.prepareForInstallerUpdate = function () {
        this._updatingInstaller = true;
        return this.getSetupUpdater()
            .then(function (updater) { return updater.prepareForUpdate(); })
            .catch(this._handleServiceErrorBind);
    };
    /**
     * Updates setup.
     */
    SetupEngineAdapter.prototype.updateInstaller = function (bootstrapperArguments) {
        var _this = this;
        logger.writeVerbose("Updating installer [bootstrapperArguments: " + bootstrapperArguments + "]");
        this._updatingInstaller = true;
        var updatePromise = this.getSetupUpdater()
            .then(function (updater) { return updater.update(bootstrapperArguments); })
            .catch(this._handleServiceErrorBind);
        updatePromise
            .finally(function () {
            _this._updatingInstaller = false;
            if (_this._disposed) {
                _this._startSetupUpdaterPromise.then(function (updater) { return updater.end(); });
            }
        });
        return updatePromise;
    };
    /**
     * Cancels the preparation of a setup update.
     */
    SetupEngineAdapter.prototype.cancelInstallerUpdate = function () {
        logger.writeVerbose("Canceled installer update");
        this._updatingInstaller = false;
        if (this._disposed) {
            return this._startSetupUpdaterPromise.then(function (updater) { return updater.end(); });
        }
        else {
            return Promise.resolve();
        }
    };
    /**
     * Creates a shortcut in the start menu.
     */
    SetupEngineAdapter.prototype.createStartMenuShortcut = function (shortcutName, targetPath) {
        requires.stringNotEmpty(shortcutName, "shortcutName");
        requires.stringNotEmpty(targetPath, "targetPath");
        logger.writeVerbose("Creating Start menu shortcut " +
            ("[shortcutName: " + shortcutName + ", targetPath: " + targetPath + "]"));
        return this.getSetupUpdater()
            .then(function (updater) { return updater.createStartMenuShortcut(shortcutName, targetPath); })
            .catch(this._handleServiceErrorBind);
    };
    /**
     * Deletes a shortcut in the start menu.
     */
    SetupEngineAdapter.prototype.deleteStartMenuShortcut = function (shortcutName) {
        requires.stringNotEmpty(shortcutName, "shortcutName");
        logger.writeVerbose("Deleting Start menu shortcut  [shortcutName: " + shortcutName + "]");
        return this.getSetupUpdater()
            .then(function (updater) { return updater.deleteStartMenuShortcut(shortcutName); })
            .catch(this._handleServiceErrorBind);
    };
    /**
     * Cancel any outstanding operations on {InstalledProduct}
     */
    SetupEngineAdapter.prototype.cancel = function (parameters, telemetryContext) {
        return this.getInstaller()
            .then(function (installer) {
            installer.cancel();
        })
            .catch(this._handleServiceErrorBind);
    };
    /**
     * Add a listener for progress messages
     * @param {OnProgressCallback} callback A callback for progress.
     */
    SetupEngineAdapter.prototype.onProgress = function (callback) {
        this._eventEmitter.on(PROGRESS_EVENT_NAME, callback);
    };
    /**
     * Add a listener for notification messages
     * @param {OnNotificationCallback} callback A callback for notification.
     */
    SetupEngineAdapter.prototype.onNotification = function (callback) {
        this._eventEmitter.on(NOTIFICATION_EVENT_NAME, callback);
    };
    /**
     * Add a listener for product update available messages
     * @param {OnUpdateAvailableCallback} callback A callback for notification.
     */
    SetupEngineAdapter.prototype.onProductUpdateAvailable = function (callback) {
        this._eventEmitter.on(PRODUCT_UPDATE_AVAILABLE_EVENT_NAME, callback);
    };
    /**
     * Add a listener for product update available messages
     * @param {OnUpdateAvailableCallback} callback A callback for notification.
     */
    SetupEngineAdapter.prototype.onInstalledProductUpdateAvailable = function (callback) {
        this._eventEmitter.on(INSTALLED_PRODUCT_UPDATE_AVAILABLE_EVENT_NAME, callback);
    };
    /**
     * Add a listener for setup service update required message
     * @param {OnUpdateAvailableCallback} callback A callback for notification.
     */
    SetupEngineAdapter.prototype.onInstallerUpdateRequired = function (callback) {
        this._eventEmitter.on(SERVICE_UPDATE_REQUIRED_EVENT_NAME, callback);
        // Call this callback if a required update has already been detected
        if (this._setupServiceUpdateRequired) {
            callback();
        }
    };
    /**
     * Sets the message handler
     * @param {OnMessageCallback} callback A callback for messages.
     */
    SetupEngineAdapter.prototype.setMessageHandler = function (handler) {
        this._onMessageHandler = handler;
    };
    /**
     * Cancels pending operations and disposes resources.
     */
    SetupEngineAdapter.prototype.dispose = function () {
        if (this._disposed) {
            return;
        }
        var disposePromises = [];
        if (this._startProductsProviderPromise) {
            disposePromises.push(this._startProductsProviderPromise.then(function (productsProvider) { return productsProvider.end(); }));
        }
        if (this._startInstalledProductsProviderPromise) {
            disposePromises.push(this._startInstalledProductsProviderPromise.then(function (installedProductsProvider) { return installedProductsProvider.end(); }));
        }
        if (this._startInstallerPromise) {
            disposePromises.push(this._startInstallerPromise.then(function (installer) { return installer.end(); }));
        }
        // Do not dispose of the setup updater if an update is in process.
        if (!this._updatingInstaller && this._startSetupUpdaterPromise) {
            disposePromises.push(this._startSetupUpdaterPromise.then(function (installer) { return installer.end(); }));
        }
        this._disposed = true;
        return Promise.all(disposePromises).then(function () { return null; });
    };
    SetupEngineAdapter.prototype.openLog = function () {
        SetupEngine.openLog();
    };
    SetupEngineAdapter.prototype.deepCleanPreviewInstallations = function () {
        return deep_clean_preview_installations_1.deepCleanPreviewInstallations();
    };
    SetupEngineAdapter.prototype.getStatus = function () {
        return this.getInstaller()
            .then(function (installer) {
            return installer.getStatus();
        })
            .then(function (status) { return typeConverter.installerStatusFromSetupEngine(status); });
    };
    SetupEngineAdapter.prototype.isElevated = function () {
        return this.getInstaller()
            .then(function (installer) {
            return installer.isElevated();
        });
    };
    SetupEngineAdapter.prototype.getSettings = function () {
        // TODO: Add to Installer interface when needed by the renderer.
        return this.getInstaller()
            .then(function (installer) {
            return installer.getSettings();
        })
            .then(function (settings) { return typeConverter.settingsFromSetupEngine(settings); });
    };
    SetupEngineAdapter.prototype.setSettings = function (settings) {
        // TODO: Add to Installer interface when needed by the renderer.
        return this.getInstaller()
            .then(function (installer) {
            var setupEngineSettings = typeConverter.settingsToSetupEngine(settings);
            return installer.setSettings(setupEngineSettings);
        });
    };
    SetupEngineAdapter.prototype.getProductsProvider = function () {
        var _this = this;
        if (this._startProductsProviderPromise) {
            return this._startProductsProviderPromise;
        }
        var scope = Telemetry_1.telemetry.startOperation(TelemetryEventNames.SETUP_INITIALIZE_PRODUCTS_PROVIDER_SERVICE, null);
        logger.writeVerbose("Starting the products provider service.");
        var client = typeConverter.clientInfoToSetupEngine(this._client, this._ignoreEngineUpdates);
        this._startProductsProviderPromise = SetupEngine.startProductsProvider(client, this._channelUrl, this._installChannelUrl, this._installCatalogUrl, this.onProductsProviderUpdateAvailable.bind(this))
            .catch(this._handleServiceHubErrorBind);
        this._startProductsProviderPromise
            .then(function (provider) {
            provider.onClose(function () {
                // It is expected that the stream closes when this object has been disposed.
                if (!_this._disposed) {
                    logger.writeError("The products provider service stream was closed.");
                }
                _this._startProductsProviderPromise = null;
            });
            logger.writeVerbose("Started the products provider service.");
            scope.end(vs_telemetry_api_1.TelemetryResult.Success);
        })
            .catch(function (error) {
            logger.writeError("Failed to start the products provider service. error: " + error.message + " at " + error.stack);
            var properties = _this.createProviderErrorProperties(error);
            scope.end(vs_telemetry_api_1.TelemetryResult.Failure, properties);
            _this._startProductsProviderPromise = null;
        });
        return this._startProductsProviderPromise;
    };
    SetupEngineAdapter.prototype.getInstalledProductsProvider = function () {
        var _this = this;
        if (this._startInstalledProductsProviderPromise) {
            return this._startInstalledProductsProviderPromise;
        }
        var scope = Telemetry_1.telemetry.startOperation(TelemetryEventNames.SETUP_INITIALIZE_INSTALLED_PRODUCTS_PROVIDER_SERVICE, null);
        logger.writeVerbose("Starting the installed products provider service.");
        // The ProductsProviderService is responsible for fetching updated channelManifests
        // and catalogs. Only initialize the InstalledProductsProvider after the ProductsProviderService
        // is initialized or fails.
        var startProductProviderPromise = this.getProductsProvider();
        this._startInstalledProductsProviderPromise = startProductProviderPromise
            .then(function () {
            var client = typeConverter.clientInfoToSetupEngine(_this._client, _this._ignoreEngineUpdates);
            return SetupEngine.startInstalledProductsProvider(client, _this.onInstalledProductsProviderUpdateAvailable.bind(_this), _this._onInstallerMessage)
                .catch(_this._handleServiceHubErrorBind);
        });
        this._startInstalledProductsProviderPromise
            .then(function (provider) {
            provider.onClose(function () {
                // It is expected that the stream closes when this object has been disposed.
                if (!_this._disposed) {
                    logger.writeError("The installed products provider stream was closed.");
                }
                _this._startInstalledProductsProviderPromise = null;
            });
            logger.writeVerbose("Started the installed products provider service.");
            scope.end(vs_telemetry_api_1.TelemetryResult.Success);
        })
            .catch(function (error) {
            logger.writeError("Failed to start the installed products provider service. " +
                ("error: " + error.message + " at " + error.stack));
            var properties = _this.createProviderErrorProperties(error);
            scope.end(vs_telemetry_api_1.TelemetryResult.Failure, properties);
            _this._startInstalledProductsProviderPromise = null;
        });
        return this._startInstalledProductsProviderPromise;
    };
    SetupEngineAdapter.prototype.getInstaller = function () {
        var _this = this;
        if (this._startInstallerPromise) {
            return this._startInstallerPromise;
        }
        var scope = Telemetry_1.telemetry.startOperation(TelemetryEventNames.SETUP_INITIALIZE_INSTALLER_SERVICE, null);
        logger.writeVerbose("Starting the installer service.");
        var client = typeConverter.clientInfoToSetupEngine(this._client, this._ignoreEngineUpdates);
        this._startInstallerPromise = SetupEngine.startInstaller(client, this._setupEnginePath, this.onInstallerProgress.bind(this), this.onInstallerNotification.bind(this), this._onInstallerMessage)
            .catch(this._handleServiceHubErrorBind);
        this._startInstallerPromise
            .then(function (installer) {
            installer.onClose(function () {
                // It is expected that the stream closes when this object has been disposed.
                if (!_this._disposed) {
                    logger.writeError("The installer service stream was closed.");
                }
                _this._startInstallerPromise = null;
            });
            logger.writeVerbose("Started the installer service.");
            scope.end(vs_telemetry_api_1.TelemetryResult.Success);
        })
            .catch(function (error) {
            logger.writeError("Failed to start the installer service. error: " + error.message + " at " + error.stack);
            var properties = _this.createProviderErrorProperties(error);
            scope.end(vs_telemetry_api_1.TelemetryResult.Failure, properties);
            _this._startInstallerPromise = null;
        });
        return this._startInstallerPromise;
    };
    SetupEngineAdapter.prototype.getSetupUpdater = function () {
        var _this = this;
        if (this._startSetupUpdaterPromise) {
            return this._startSetupUpdaterPromise;
        }
        var scope = Telemetry_1.telemetry.startOperation(TelemetryEventNames.SETUP_INITIALIZE_INSTALLER_UPDATER_SERVICE, null);
        logger.writeVerbose("Starting the setup updater service.");
        var client = typeConverter.clientInfoToSetupEngine(this._client, this._ignoreEngineUpdates);
        this._startSetupUpdaterPromise = SetupEngine.startSetupUpdater(client)
            .catch(this._handleServiceHubErrorBind);
        this._startSetupUpdaterPromise
            .then(function (provider) {
            provider.onClose(function () {
                // It is expected that the stream closes when this object has been disposed.
                if (!_this._disposed) {
                    logger.writeError("The setup updater stream was closed.");
                }
                _this._startSetupUpdaterPromise = null;
            });
            logger.writeVerbose("Started the setup updater service.");
            scope.end(vs_telemetry_api_1.TelemetryResult.Success);
        })
            .catch(function (error) {
            logger.writeError("Failed to start the setup updater service. " +
                ("error: " + error.message + " at " + error.stack));
            var properties = _this.createProviderErrorProperties(error);
            scope.end(vs_telemetry_api_1.TelemetryResult.Failure, properties);
            _this._startSetupUpdaterPromise = null;
        });
        return this._startSetupUpdaterPromise;
    };
    SetupEngineAdapter.prototype.onProductsProviderUpdateAvailable = function () {
        if (this._eventEmitter.listenerCount(PRODUCT_UPDATE_AVAILABLE_EVENT_NAME) === 0) {
            var message = "There are no handlers for ProductsProvider update available notifications.";
            this.handleNoUpdateListenerError(message, "onProductsProviderUpdateAvailable");
            return;
        }
        this._eventEmitter.emit(PRODUCT_UPDATE_AVAILABLE_EVENT_NAME);
    };
    SetupEngineAdapter.prototype.onInstalledProductsProviderUpdateAvailable = function () {
        if (this._eventEmitter.listenerCount(INSTALLED_PRODUCT_UPDATE_AVAILABLE_EVENT_NAME) === 0) {
            var message = "There are no handlers for InstalledProductsProvider update available notifications.";
            this.handleNoUpdateListenerError(message, "onInstalledProductsProviderUpdateAvailable");
            return;
        }
        this._eventEmitter.emit(INSTALLED_PRODUCT_UPDATE_AVAILABLE_EVENT_NAME);
    };
    SetupEngineAdapter.prototype.onInstallerProgress = function (type, detail, percentComplete, progressInfo) {
        this._eventEmitter.emit(PROGRESS_EVENT_NAME, this._installationPathOfCurrentOperation, typeConverter.progressTypeFromSetupEngine(type), percentComplete, detail, typeConverter.progressInfoFromSetupEngine(progressInfo));
    };
    SetupEngineAdapter.prototype.emitInstallOperationStarting = function (installationPath) {
        this._eventEmitter.emit(NOTIFICATION_EVENT_NAME, installationPath, Product_1.Message.CreateInstallStartingMessage());
    };
    SetupEngineAdapter.prototype.emitInstallOperationFinished = function (installationPath) {
        this._eventEmitter.emit(NOTIFICATION_EVENT_NAME, installationPath, Product_1.Message.CreateInstallFinishedMessage());
    };
    SetupEngineAdapter.prototype.onInstallerNotification = function (message) {
        this._eventEmitter.emit(NOTIFICATION_EVENT_NAME, this._installationPathOfCurrentOperation, typeConverter.messageFromSetupEngine(message));
    };
    SetupEngineAdapter.prototype.onInstallerMessage = function (message) {
        if (!this._onMessageHandler) {
            throw new errors_1.NoMessageHandlerError("There is no handler for Installer messages.");
        }
        return this._onMessageHandler(this._installationPathOfCurrentOperation, typeConverter.messageFromSetupEngine(message))
            .then(function (result) { return typeConverter.messageResultToSetupEngine(result); });
    };
    SetupEngineAdapter.prototype.emitUpdateRequired = function () {
        if (this._eventEmitter.listenerCount(SERVICE_UPDATE_REQUIRED_EVENT_NAME) === 0) {
            var message = "There are no handlers for setup service update required notifications.";
            this.handleNoUpdateListenerError(message, "emitUpdateRequired");
            return;
        }
        this._eventEmitter.emit(SERVICE_UPDATE_REQUIRED_EVENT_NAME);
    };
    SetupEngineAdapter.prototype.handleNoUpdateListenerError = function (message, methodName) {
        if (this._ignoreUpdates) {
            return;
        }
        var error = new errors_1.NoMessageHandlerError(message);
        logger.writeError(error.message + " at " + error.stack);
        Telemetry_1.telemetry.postError(TelemetryEventNames.EMIT_EVENT_ERROR, "No event listeners are registered for the update notification.", new bucket_parameters_1.BucketParameters(methodName, this.constructor.name), error);
        throw error;
    };
    SetupEngineAdapter.prototype.handleServiceError = function (error, productName) {
        if (productName === void 0) { productName = null; }
        this._bootstrapperCommunicator.dismiss();
        // This servicehub error was thrown by handleServiceHubError()
        // and does not need to be processed again.
        if (error instanceof errors_1.ServiceHubUnavailableError) {
            throw error;
        }
        if (error instanceof InstallerError_1.InstallerError) {
            var customError = typeConverter.installerErrorFromSetupEngine(error, productName);
            if (customError instanceof errors_1.ServiceUpdateRequireError) {
                this._setupServiceUpdateRequired = true;
                this.emitUpdateRequired();
            }
            throw customError;
        }
        else if (error instanceof errors_1.CustomErrorBase) {
            logger.writeVerbose("The following error is being rethrown: " + error.name);
            throw error;
        }
        else if (error instanceof Error) {
            // if it's a typed error and not ours, just rethrow it
            throw error;
        }
        else {
            // it's not a typed error, so wrap it then rethrow it
            // Bug 424636: Stringify the error object to to help diagnose errors.
            var message = "The following error was thrown: " + JSON.stringify(error);
            throw new Error(message);
        }
    };
    SetupEngineAdapter.prototype.handleServiceHubError = function (error) {
        // This method only cares about errors that are thrown from servicehub, so we simply rethrow any errors that
        // may be thrown from other sources.
        if (error instanceof Error || error instanceof errors_1.CustomErrorBase || error instanceof InstallerError_1.InstallerError) {
            throw error;
        }
        Telemetry_1.telemetry.postError(TelemetryEventNames.START_SERVICEHUB_ERROR, error.message, new bucket_parameters_1.BucketParameters("handleServiceHubError", this.constructor.name));
        // This is a special case where we wrap the error that is thrown because ServiceHub is unavailable.
        throw new errors_1.ServiceHubUnavailableError(error.message, error.code);
    };
    SetupEngineAdapter.prototype.createProviderErrorProperties = function (error) {
        // This method must handle a variety of errors and some of them don't have
        // names or stacks, so we will send an empty string in those instances.
        return {
            errorName: error.name || "",
            errorMessage: telemetry_utils_1.TelemetryUtils.createHashedPiiProperty(error.message) || "",
            errorStack: telemetry_utils_1.TelemetryUtils.createHashedPiiProperty(error.stack) || "",
        };
    };
    return SetupEngineAdapter;
}());
exports.SetupEngineAdapter = SetupEngineAdapter;
//# sourceMappingURL=SetupEngineAdapter.js.map