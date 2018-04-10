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
var ProductsProviderImpl = /** @class */ (function (_super) {
    __extends(ProductsProviderImpl, _super);
    function ProductsProviderImpl(stream, updateAvailableCallback) {
        var _this = this;
        requires.notNullOrUndefined(stream, "stream");
        requires.notNullOrUndefined(updateAvailableCallback, "updateAvailableCallback");
        _this = _super.call(this, stream, "UpdateAvailable") || this;
        _this._updateAvailableCallback = updateAvailableCallback;
        return _this;
    }
    ProductsProviderImpl.prototype.initialize = function (client, channelUrl, installChannelUrl, installCatalogUrl) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // If you need to debug the initialization of the engine's ProductsProviderService,
            // set a breakpoint on this line.  When you hit the breakpoint, you can use
            // VS to attach to vs_installerservice.exe and debug the construction and
            // initialization of the service
            var clientRpc = SetupEngineRpc_1.SetupEngineRpc.clientInfoToRpc(client);
            _this._initializedPromise = _this.invoke("Initialize", [
                clientRpc,
                channelUrl,
                installChannelUrl,
                installCatalogUrl,
            ])
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
    ProductsProviderImpl.prototype.getProductSummaries = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                return _this.invoke("GetProductSummaries");
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    reject(installerError);
                }
                else {
                    var productSummaries = result.Value;
                    try {
                        resolve(SetupEngineRpc_1.SetupEngineRpc.productSummariesFromRpc(productSummaries));
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            }, function (error) {
                reject(error);
            });
        });
    };
    ProductsProviderImpl.prototype.getProduct = function (channelId, productId, vsixs) {
        var _this = this;
        requires.notNullOrUndefined(channelId, "channelId");
        requires.notNullOrUndefined(productId, "productId");
        var vsixsRpc = SetupEngineRpc_1.SetupEngineRpc.vsixReferencesToRpc(vsixs);
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                return _this.invoke("GetProduct", [channelId, productId, vsixsRpc]);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    reject(installerError);
                }
                else {
                    var product = result.Value;
                    try {
                        resolve(SetupEngineRpc_1.SetupEngineRpc.productFromRpc(product));
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            }, function (error) {
                reject(error);
            });
        });
    };
    ProductsProviderImpl.prototype.getChannelInfo = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                return _this.invoke("GetChannelInfo");
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    reject(installerError);
                }
                else {
                    var channelInfoList = result.Value;
                    try {
                        resolve(SetupEngineRpc_1.SetupEngineRpc.channelInfoListFromRpc(channelInfoList));
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            }, function (error) {
                reject(error);
            });
        });
    };
    ProductsProviderImpl.prototype.removeChannel = function (channelId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                return _this.invoke("RemoveChannel", [channelId]);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    reject(installerError);
                }
                else {
                    var productSummaries = result.Value;
                    try {
                        resolve(SetupEngineRpc_1.SetupEngineRpc.productSummariesFromRpc(productSummaries));
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            }, function (error) {
                reject(error);
            });
        });
    };
    ProductsProviderImpl.prototype.addChannel = function (channelUrl, installChannelUrl, installCatalogUrl) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._initializedPromise.then(function () {
                return _this.invoke("AddChannel", [
                    channelUrl,
                    installChannelUrl,
                    installCatalogUrl
                ]);
            })
                .then(function (result) {
                if (result.Error) {
                    var installerError = SetupEngineRpc_1.SetupEngineRpc.installerErrorFromRpc(result.Error);
                    reject(installerError);
                }
                else {
                    resolve();
                }
            }, function (error) {
                reject(error);
            });
        });
    };
    /* tslint:disable:no-unused-variable */
    ProductsProviderImpl.prototype.UpdateAvailable = function () {
        this._updateAvailableCallback();
    };
    return ProductsProviderImpl;
}(service_hub_client_1.ServiceHubClient));
function startProductsProvider(client, channelUrl, installChannelUrl, installCatalogUrl, updateAvailableCallback) {
    var hubClient = new microsoft_servicehub_1.HubClient("ProductsProvider", serviceHubLogger);
    return new Promise(function (resolve, reject) {
        hubClient.requestService("SetupEngine.ProductsProvider")
            .then(function (stream) {
            var providerImpl = new ProductsProviderImpl(stream, updateAvailableCallback);
            resolve(providerImpl.initialize(client, channelUrl, installChannelUrl, installCatalogUrl));
        })
            .then(null, reject);
    });
}
exports.startProductsProvider = startProductsProvider;
//# sourceMappingURL=ProductsProvider.js.map