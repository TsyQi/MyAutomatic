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
var Logger_1 = require("../Logger");
var requires = require("../requires");
var servicehub_logger_adapter_1 = require("../servicehub-logger-adapter");
var SetupEngineRpc_1 = require("./SetupEngineRpc");
var service_hub_client_1 = require("../service-hub/service-hub-client");
var logger = Logger_1.getLogger();
var serviceHubLogger = new servicehub_logger_adapter_1.ServiceHubLoggerAdapter(logger);
var InstalledProductsProviderImpl = /** @class */ (function (_super) {
    __extends(InstalledProductsProviderImpl, _super);
    function InstalledProductsProviderImpl(stream, updateAvailableCallback, messageCallback) {
        var _this = this;
        requires.notNullOrUndefined(updateAvailableCallback, "updateAvailableCallback");
        requires.notNullOrUndefined(messageCallback, "messageCallback");
        _this = _super.call(this, stream, "UpdateAvailable", "Message") || this;
        _this._messageCallback = messageCallback;
        _this._updateAvailableCallback = updateAvailableCallback;
        return _this;
    }
    InstalledProductsProviderImpl.prototype.initialize = function (client) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // If you need to debug the initialization of the engine's InstalledProductsProviderService,
            // set a breakpoint on this line.  When you hit the breakpoint, you can use
            // VS to attach to vs_installerservice.exe and debug the construction and
            // initialization of the service
            var clientRpc = SetupEngineRpc_1.SetupEngineRpc.clientInfoToRpc(client);
            _this._initializedPromise = _this.invoke("Initialize", [clientRpc])
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    reject(installerError);
                }
                else {
                    resolve(_this);
                }
            }, function (error) {
                reject(error);
            });
        });
    };
    InstalledProductsProviderImpl.prototype.getInstalledProductSummaries = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                return _this.invoke("GetInstalledProductSummaries");
            })
                .then(function (result) {
                try {
                    if (result.Error) {
                        var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                        reject(installerError);
                    }
                    else {
                        resolve(SetupEngineRpc_1.SetupEngineRpc.installedProductSummariesResultFromRpc(result.Value));
                    }
                }
                catch (error) {
                    reject(error);
                }
            }, function (error) {
                reject(error);
            });
        });
    };
    InstalledProductsProviderImpl.prototype.getInstalledProduct = function (installationPath, withUpdatePackages, fetchLatest, vsixs) {
        var _this = this;
        // convert null and undefined withUpdatePackages to false
        withUpdatePackages = !!withUpdatePackages;
        fetchLatest = !!fetchLatest;
        var vsixsRpc = SetupEngineRpc_1.SetupEngineRpc.vsixReferencesToRpc(vsixs);
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                return _this.invoke("GetInstalledProduct", [installationPath, withUpdatePackages, fetchLatest, vsixsRpc]);
            })
                .then(function (result) {
                try {
                    if (result.Error) {
                        var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                        reject(installerError);
                    }
                    else {
                        resolve(SetupEngineRpc_1.SetupEngineRpc.installedProductFromRpc(result.Value));
                    }
                }
                catch (error) {
                    reject(error);
                }
            }, function (error) {
                reject(error);
            });
        });
    };
    InstalledProductsProviderImpl.prototype.getInstalledProductLogs = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                return _this.invoke("GetInstalledProductLogs");
            })
                .then(function (result) {
                try {
                    if (result.Error) {
                        var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                        reject(installerError);
                    }
                    else {
                        resolve(result.Value);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }, function (error) {
                reject(error);
            });
        });
    };
    /* tslint:disable:no-unused-variable */
    InstalledProductsProviderImpl.prototype.UpdateAvailable = function () {
        this._updateAvailableCallback();
    };
    /* tslint:enable */
    /* tslint:disable:no-unused-variable */
    InstalledProductsProviderImpl.prototype.Message = function (messageRpc) {
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
    return InstalledProductsProviderImpl;
}(service_hub_client_1.ServiceHubClient));
function startInstalledProductsProvider(client, updateAvailableCallback, messageCallback) {
    var hubClient = new microsoft_servicehub_1.HubClient("InstalledProductsProvider", serviceHubLogger);
    return new Promise(function (resolve, reject) {
        return hubClient.requestService("SetupEngine.InstalledProductsProvider")
            .then(function (stream) {
            var providerImpl = new InstalledProductsProviderImpl(stream, updateAvailableCallback, messageCallback);
            resolve(providerImpl.initialize(client));
        })
            .then(null, reject);
    });
}
exports.startInstalledProductsProvider = startInstalledProductsProvider;
//# sourceMappingURL=InstalledProductsProvider.js.map