/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
/// <reference path="../../typings/globals/q/index.d.ts" />
/// <reference path="../../typings/lib-missing-declares.d.ts" />
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
var microsoft_servicehub_1 = require("microsoft-servicehub");
var open_external_1 = require("../open-external");
var Logger_1 = require("../Logger");
var requires = require("../requires");
var servicehub_logger_adapter_1 = require("../servicehub-logger-adapter");
var SetupEngineRpc_1 = require("./SetupEngineRpc");
var service_hub_client_1 = require("../service-hub/service-hub-client");
var SERVICE_NAME = "SetupEngine.Installer";
var logger = Logger_1.getLogger();
var serviceHubLogger = new servicehub_logger_adapter_1.ServiceHubLoggerAdapter(logger);
var InstallerImpl = /** @class */ (function (_super) {
    __extends(InstallerImpl, _super);
    function InstallerImpl(stream, setupEnginePath, progressCallback, notificationCallback, messageCallback) {
        var _this = this;
        requires.stringNotEmpty(setupEnginePath, "setupEnginePath");
        requires.notNullOrUndefined(progressCallback, "progressCallback");
        requires.notNullOrUndefined(notificationCallback, "notificationCallback");
        requires.notNullOrUndefined(messageCallback, "messageCallback");
        _this = _super.call(this, stream, "Progress", "Notification", "Message") || this;
        _this._setupEnginePath = setupEnginePath;
        _this._progressCallback = progressCallback;
        _this._notificationCallback = notificationCallback;
        _this._messageCallback = messageCallback;
        return _this;
    }
    InstallerImpl.prototype.initialize = function (client) {
        var _this = this;
        var serviceMethodName = "Initialize";
        var traceParams = "locale: " + client.locale;
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ". [" + traceParams + "]");
        return new Promise(function (resolve, reject) {
            // If you need to debug the initialization of the engine's InstallerService,
            // set a breakpoint on this line.  When you hit the breakpoint, you can use
            // VS to attach to vs_installerservice.exe and debug the construction and
            // initialization of the service
            var clientInfoRpc = SetupEngineRpc_1.SetupEngineRpc.clientInfoToRpc(client);
            _this._initializedPromise = _this.invoke(serviceMethodName, [clientInfoRpc])
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error. [" + traceParams + ", " +
                        (installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded. [" + traceParams + "]");
                    resolve(_this);
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [" + traceParams + ", " +
                    ("error: " + error.message + " at " + error.stack + "]"));
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.evaluateInstallParameters = function (parameters) {
        var _this = this;
        requires.notNullOrUndefined(parameters, "parameters");
        var serviceMethodName = "EvaluateInstallParameters";
        var traceParams = "channelId: " + parameters.channelId + ", productId: " + parameters.productId + ", " +
            ("installationPath: '" + parameters.installationPath + "', ") +
            ("languages: '" + parameters.languages + "' ") +
            ("selectedPackageReferences.length: " + parameters.selectedPackageReferences.length);
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ". [" + traceParams + "]");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                var parametersRpc = SetupEngineRpc_1.SetupEngineRpc.installParametersToRpc(parameters);
                return _this.invoke(serviceMethodName, [parametersRpc]);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error. [" + traceParams + ", " +
                        (installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded. [" + traceParams + "]");
                    resolve(SetupEngineRpc_1.SetupEngineRpc.installParametersEvaluationFromRpc(result.Value));
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [" + traceParams + ", " +
                    ("error: " + error.message + " at " + error.stack + "]"));
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.evaluateModifyParameters = function (parameters) {
        var _this = this;
        requires.notNullOrUndefined(parameters, "parameters");
        var serviceMethodName = "EvaluateModifyParameters";
        var traceParams = "installationPath: '" + parameters.installationPath + "', " +
            ("languages: '" + parameters.languages + "' ") +
            ("selectedPackageReferences.length: " + parameters.selectedPackageReferences.length);
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ". [" + traceParams + "]");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                var parametersRpc = SetupEngineRpc_1.SetupEngineRpc.modifyParametersToRpc(parameters);
                return _this.invoke(serviceMethodName, [parametersRpc]);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error. [" + traceParams + ", " +
                        (installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded. [" + traceParams + "]");
                    resolve(SetupEngineRpc_1.SetupEngineRpc.modifyParametersEvaluationFromRpc(result.Value));
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [" + traceParams + ", " +
                    ("error: " + error.message + " at " + error.stack + "]"));
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.installProduct = function (parameters, runOnceParameters, telemetryContext) {
        var _this = this;
        requires.notNullOrUndefined(parameters, "parameters");
        requires.stringNotEmpty(parameters.channelId, "parameters.channelId");
        requires.stringNotEmpty(parameters.productId, "parameters.productId");
        requires.stringNotEmpty(parameters.installationPath, "parameters.installationPath");
        requires.notNullOrUndefined(parameters.languages, "parameters.languages");
        requires.notNullOrUndefined(parameters.selectedPackageReferences, "parameters.selectedPackageReferences");
        var serviceMethodName = "InstallProduct";
        var traceParams = "channelId: " + parameters.channelId + ", productId: " + parameters.productId + ", " +
            ("installationPath: '" + parameters.installationPath + "'");
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ". [" + traceParams + "]");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise
                .then(function () {
                var parametersRpc = SetupEngineRpc_1.SetupEngineRpc.installParametersToRpc(parameters);
                var serviceParameters = [
                    parametersRpc,
                    _this._setupEnginePath,
                    runOnceParameters
                ];
                if (telemetryContext) {
                    serviceParameters.push(SetupEngineRpc_1.SetupEngineRpc.telemetryContextToRpc(telemetryContext));
                }
                return _this.invoke(serviceMethodName, serviceParameters);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error.  [" + traceParams + ", " +
                        (installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded. [" + traceParams + "]");
                    resolve(SetupEngineRpc_1.SetupEngineRpc.installOperationResultFromRpc(result.Value));
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [" + traceParams + ", " +
                    ("error: " + error.message + " at " + error.stack + "]"));
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.modifyProduct = function (parameters, runOnceParameters, telemetryContext) {
        var _this = this;
        requires.notNullOrUndefined(parameters, "parameters");
        requires.stringNotEmpty(parameters.installationPath, "parameters.installationPath");
        requires.notNullOrUndefined(parameters.languages, "parameters.languages");
        requires.notNullOrUndefined(parameters.selectedPackageReferences, "parameters.selectedPackageReferences");
        var serviceMethodName = "ModifyProduct";
        var traceParams = "installationPath: '" + parameters.installationPath + "'";
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ". [" + traceParams + "]");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise
                .then(function () {
                var parametersRpc = SetupEngineRpc_1.SetupEngineRpc.modifyParametersToRpc(parameters);
                var serviceParameters = [
                    parametersRpc,
                    _this._setupEnginePath,
                    runOnceParameters
                ];
                if (telemetryContext) {
                    serviceParameters.push(SetupEngineRpc_1.SetupEngineRpc.telemetryContextToRpc(telemetryContext));
                }
                return _this.invoke(serviceMethodName, serviceParameters);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error.  [" + traceParams + ", " +
                        (installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded. [" + traceParams + "]");
                    resolve(SetupEngineRpc_1.SetupEngineRpc.installOperationResultFromRpc(result.Value));
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [" + traceParams + ", " +
                    ("error: " + error.message + " at " + error.stack + "]"));
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.repairProduct = function (installationPath, runOnceParameters, telemetryContext) {
        return this.installOperationOnInstallationPath("RepairProduct", installationPath, runOnceParameters, SetupEngineRpc_1.SetupEngineRpc.telemetryContextToRpc(telemetryContext));
    };
    InstallerImpl.prototype.updateProduct = function (parameters, runOnceParameters, telemetryContext) {
        var traceParams = "installationPath: '" + parameters.installationPath + "'";
        var params = [
            SetupEngineRpc_1.SetupEngineRpc.updateParametersToRpc(parameters),
            this._setupEnginePath,
            runOnceParameters,
        ];
        if (telemetryContext) {
            params.push(SetupEngineRpc_1.SetupEngineRpc.telemetryContextToRpc(telemetryContext));
        }
        return this.invokeInstallOperation("UpdateProduct", traceParams, params);
    };
    InstallerImpl.prototype.resumeInstallingProduct = function (installationPath, runOnceParameters, telemetryContext) {
        return this.installOperationOnInstallationPath("ResumeInstallingProduct", installationPath, runOnceParameters, SetupEngineRpc_1.SetupEngineRpc.telemetryContextToRpc(telemetryContext));
    };
    InstallerImpl.prototype.launchProduct = function (installationPath) {
        var _this = this;
        requires.stringNotEmpty(installationPath, "installationPath");
        var serviceMethodName = "LaunchProduct";
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ". [installPath: '" + installationPath + "']");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise
                .then(function () {
                return _this.invoke(serviceMethodName, [installationPath]);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error. " +
                        (" [" + installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded. " +
                        ("[installPath: '" + installationPath + "']"));
                    resolve();
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [error: " + error.message + " at " + error.stack + "]");
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.uninstallProduct = function (installationPath, telemetryContext) {
        var _this = this;
        var serviceMethodName = "UninstallProduct";
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ". [installationPath: '" + installationPath + "']");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise
                .then(function () {
                var parameters = [installationPath];
                if (telemetryContext) {
                    parameters.push(SetupEngineRpc_1.SetupEngineRpc.telemetryContextToRpc(telemetryContext));
                }
                return _this.invoke(serviceMethodName, parameters);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error. " +
                        (" [" + installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded. " +
                        ("[installationPath: '" + installationPath + "']"));
                    resolve();
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [error: " + error.message + " at " + error.stack + "]");
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.uninstallAllProducts = function (telemetryContext) {
        var _this = this;
        var serviceMethodName = "UninstallAllProducts";
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ".");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise
                .then(function () {
                var parameters = [];
                if (telemetryContext) {
                    parameters.push(SetupEngineRpc_1.SetupEngineRpc.telemetryContextToRpc(telemetryContext));
                }
                return _this.invoke(serviceMethodName, parameters);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error. " +
                        (" [" + installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded.");
                    resolve();
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [error: " + error.message + " at " + error.stack + "]");
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.cancel = function (telemetryContext) {
        var _this = this;
        var serviceMethodName = "CancelAsync";
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ".");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise
                .then(function () {
                _this.invoke(serviceMethodName);
                logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded.");
                resolve();
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [error: " + error.message + " at " + error.stack + "]");
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.getStatus = function () {
        var _this = this;
        var serviceMethodName = "GetStatus";
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ".");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise
                .then(function () {
                return _this.invoke(serviceMethodName);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error.  [, " +
                        (installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded.");
                    resolve(SetupEngineRpc_1.SetupEngineRpc.installerStatusFromRpc(result.Value));
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [error: " + error.message + " at " + error.stack + "]");
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.isElevated = function () {
        var _this = this;
        var serviceMethodName = "IsElevated";
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ".");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise
                .then(function () {
                return _this.invoke(serviceMethodName);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error.  [, " +
                        (installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded.");
                    resolve(result.Value);
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [error: " + error.message + " at " + error.stack + "]");
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.getSettings = function () {
        var _this = this;
        var serviceMethodName = "GetSettings";
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ".");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise
                .then(function () {
                return _this.invoke(serviceMethodName);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error.  [, " +
                        (installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded.");
                    resolve(SetupEngineRpc_1.SetupEngineRpc.settingsFromRpc(result.Value));
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [error: " + error.message + " at " + error.stack + "]");
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.setSettings = function (settings) {
        var _this = this;
        requires.notNullOrUndefined(settings, "settings");
        var serviceMethodName = "SetSettings";
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ".");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise
                .then(function () {
                var settingsRpc = SetupEngineRpc_1.SetupEngineRpc.settingsToRpc(settings);
                var parameters = [settingsRpc];
                return _this.invoke(serviceMethodName, parameters);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error. " +
                        (" [" + installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded.");
                    resolve();
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [error: " + error.message + " at " + error.stack + "]");
                reject(error);
            });
        });
    };
    InstallerImpl.prototype.installOperationOnInstallationPath = function (serviceMethodName, installationPath, runOnceParameters, telemetryContext) {
        requires.notNullOrUndefined(installationPath, "installationPath");
        var traceParams = "installationPath: '" + installationPath + "'";
        var parameters = [
            installationPath,
            this._setupEnginePath,
            runOnceParameters,
        ];
        if (telemetryContext) {
            parameters.push(SetupEngineRpc_1.SetupEngineRpc.telemetryContextToRpc(telemetryContext));
        }
        return this.invokeInstallOperation(serviceMethodName, traceParams, parameters);
    };
    InstallerImpl.prototype.invokeInstallOperation = function (serviceMethodName, traceParams, parameters) {
        var _this = this;
        requires.stringNotEmpty(serviceMethodName, "serviceMethodName");
        requires.notNullOrUndefined(traceParams, "traceParams");
        logger.writeVerbose("Calling " + SERVICE_NAME + "." + serviceMethodName + ". [" + traceParams + "]");
        return new Promise(function (resolve, reject) {
            _this._initializedPromise
                .then(function () {
                return _this.invoke(serviceMethodName, parameters);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " reported error. " +
                        (" [" + installerError.name + ": " + installerError.message + " at " + installerError.stack + "]"));
                    reject(installerError);
                }
                else {
                    logger.writeVerbose(SERVICE_NAME + "." + serviceMethodName + " succeeded. " +
                        ("[" + traceParams + "]"));
                    resolve(SetupEngineRpc_1.SetupEngineRpc.installOperationResultFromRpc(result.Value));
                }
            }, function (error) {
                logger.writeError(SERVICE_NAME + "." + serviceMethodName + " failed. [" + traceParams + "]. " +
                    ("[error: " + error.message + " at " + error.stack + "]"));
                reject(error);
            });
        });
    };
    /* tslint:disable:no-unused-variable */
    InstallerImpl.prototype.Progress = function (packageName, progress, type, progressInfoRpc) {
        var progressTypeRpc = SetupEngineRpc_1.SetupEngineRpc.parseProgressType(type);
        var progressType = SetupEngineRpc_1.SetupEngineRpc.progressTypeFromRpc(progressTypeRpc);
        var progressInfo = SetupEngineRpc_1.SetupEngineRpc.progressInfoFromRpc(progressInfoRpc);
        this._progressCallback(progressType, packageName, progress, progressInfo);
    };
    /* tslint:enable */
    /* tslint:disable:no-unused-variable */
    InstallerImpl.prototype.Notification = function (messageRpc) {
        var message = SetupEngineRpc_1.SetupEngineRpc.messageFromRpc(messageRpc);
        this._notificationCallback(message);
    };
    /* tslint:enable */
    /* tslint:disable:no-unused-variable */
    InstallerImpl.prototype.Message = function (messageRpc) {
        var message = SetupEngineRpc_1.SetupEngineRpc.messageFromRpc(messageRpc);
        return this._messageCallback(message)
            .then(function (result) {
            var resultRpc = {
                Value: SetupEngineRpc_1.SetupEngineRpc.messageResultToRpc(result),
                Error: null
            };
            return resultRpc;
        })
            .catch(function (error) {
            var resultRpc = {
                Value: null,
                Error: error
            };
            return resultRpc;
        });
    };
    return InstallerImpl;
}(service_hub_client_1.ServiceHubClient));
function startInstaller(client, setupEnginePath, progressCallback, notificationCallback, messageCallback) {
    var hubClient = new microsoft_servicehub_1.HubClient("Installer", serviceHubLogger);
    return new Promise(function (resolve, reject) {
        hubClient.requestService(SERVICE_NAME)
            .then(function (stream) {
            var installerImpl = new InstallerImpl(stream, setupEnginePath, progressCallback, notificationCallback, messageCallback);
            resolve(installerImpl.initialize(client));
        })
            .then(null, reject);
    });
}
exports.startInstaller = startInstaller;
function openLog() {
    open_external_1.openTextFile(logger.getLogFilePath());
}
exports.openLog = openLog;
//# sourceMappingURL=Installer.js.map