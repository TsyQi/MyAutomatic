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
var SetupUpdaterImpl = /** @class */ (function (_super) {
    __extends(SetupUpdaterImpl, _super);
    function SetupUpdaterImpl(stream) {
        return _super.call(this, stream) || this;
    }
    SetupUpdaterImpl.prototype.initialize = function (client) {
        var _this = this;
        requires.stringNotEmpty(client.locale, "locale");
        return new Promise(function (resolve, reject) {
            // If you need to debug the initialization of the engine's SetupUpdaterService,
            // set a breakpoint on this line.  When you hit the breakpoint, you can use
            // VS to attach to vs_installerservice.exe and debug the construction and
            // initialization of the service
            var clientRpc = SetupEngineRpc_1.SetupEngineRpc.clientInfoToRpc(client);
            _this._initializedPromise = _this.invoke("Initialize", [clientRpc])
                .then(function (result) {
                try {
                    if (result.Error) {
                        var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                        reject(installerError);
                    }
                    else {
                        resolve(_this);
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
    SetupUpdaterImpl.prototype.createStartMenuShortcut = function (shortcutName, targetPath) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                return _this.invoke("CreateStartMenuShortcut", [shortcutName, targetPath]);
            })
                .then(function (result) {
                try {
                    if (result.Error) {
                        var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                        reject(installerError);
                    }
                    else {
                        resolve();
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
    SetupUpdaterImpl.prototype.deleteStartMenuShortcut = function (shortcutName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                return _this.invoke("DeleteStartMenuShortcut", [shortcutName]);
            })
                .then(function (result) {
                try {
                    if (result.Error) {
                        var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                        reject(installerError);
                    }
                    else {
                        resolve();
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
    SetupUpdaterImpl.prototype.prepareForUpdate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                return _this.invoke("PrepareForUpdateAsync");
            })
                .then(function (result) {
                try {
                    if (result.Error) {
                        var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                        reject(installerError);
                    }
                    else {
                        resolve();
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
    SetupUpdaterImpl.prototype.update = function (bootstrapperArguments) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                return _this.invoke("Update", [bootstrapperArguments]);
            })
                .then(function (result) {
                try {
                    if (result.Error) {
                        var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                        reject(installerError);
                    }
                    else {
                        resolve();
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
    return SetupUpdaterImpl;
}(service_hub_client_1.ServiceHubClient));
function startSetupUpdater(client) {
    var hubClient = new microsoft_servicehub_1.HubClient("SetupUpdater", serviceHubLogger);
    return new Promise(function (resolve, reject) {
        return hubClient.requestService("SetupEngine.SetupUpdater")
            .then(function (stream) {
            var providerImpl = new SetupUpdaterImpl(stream);
            resolve(providerImpl.initialize(client));
        })
            .then(null, reject);
    });
}
exports.startSetupUpdater = startSetupUpdater;
//# sourceMappingURL=setup-updater.js.map