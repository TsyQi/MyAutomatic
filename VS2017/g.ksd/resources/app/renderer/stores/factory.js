/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var app_store_1 = require("./app-store");
var dispatcher_1 = require("../dispatcher");
var error_store_1 = require("./error-store");
var solutions_store_1 = require("./solutions-store");
var product_configuration_store_1 = require("./product-configuration-store");
var TelemetryProxy_1 = require("../Telemetry/TelemetryProxy");
var Utilities = require("../Utilities");
var channel_product_filter_factory_1 = require("../filters/channel-product-filter-factory");
var features_store_1 = require("./features-store");
var product_launch_state_store_1 = require("./product-launch-state-store");
var logger_1 = require("../logger");
var logger = logger_1.getLogger();
var ShellImpl = /** @class */ (function () {
    function ShellImpl() {
    }
    ShellImpl.prototype.openExternal = function (url) {
        electron_1.shell.openExternal(url);
    };
    return ShellImpl;
}());
exports.featureStore = new features_store_1.FeaturesStore(dispatcher_1.dispatcher);
exports.errorStore = new error_store_1.ErrorStore(TelemetryProxy_1.telemetryProxy, new ShellImpl(), logger);
exports.appStore = new app_store_1.AppStore(window, exports.errorStore, Utilities, new channel_product_filter_factory_1.ChannelProductFilterFactory(), exports.featureStore);
exports.productConfigurationStore = new product_configuration_store_1.ProductConfigurationStore(exports.errorStore, logger);
exports.productLaunchStateStore = new product_launch_state_store_1.ProductLaunchStateStore(dispatcher_1.dispatcher, exports.appStore.isQuietOrPassive, exports.featureStore);
exports.solutionsStore = new solutions_store_1.SolutionsStore(dispatcher_1.dispatcher);
//# sourceMappingURL=factory.js.map