/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/* istanbul ignore next */
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
var ipc_rpc_service_1 = require("../../ipc/ipc-rpc-service");
var FeaturesProxyServiceMethod;
(function (FeaturesProxyServiceMethod) {
    FeaturesProxyServiceMethod[FeaturesProxyServiceMethod["isEnabled"] = 0] = "isEnabled";
})(FeaturesProxyServiceMethod = exports.FeaturesProxyServiceMethod || (exports.FeaturesProxyServiceMethod = {}));
exports.FEATURES_SERVICE_CHANNEL = "FeaturesProxy";
/**
 * Handles requests from {FeaturesProxy}
 */
var FeaturesIpcRpcService = /** @class */ (function (_super) {
    __extends(FeaturesIpcRpcService, _super);
    function FeaturesIpcRpcService(ipc, channelId, features, logger) {
        var _this = _super.call(this, ipc, channelId, logger) || this;
        _this._features = features;
        _this._logger.writeVerbose(FeaturesIpcRpcService.name + " listening to ipc channel: " + channelId);
        return _this;
    }
    Object.defineProperty(FeaturesIpcRpcService.prototype, "features", {
        get: function () {
            return this._features;
        },
        enumerable: true,
        configurable: true
    });
    FeaturesIpcRpcService.prototype.isEnabled = function (feature) {
        if (this._features) {
            return this._features.isEnabled(feature);
        }
        return Promise.resolve(null);
    };
    return FeaturesIpcRpcService;
}(ipc_rpc_service_1.IpcRpcService));
exports.FeaturesIpcRpcService = FeaturesIpcRpcService;
//# sourceMappingURL=features-ipc-rpc-service.js.map