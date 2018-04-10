/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../../lib/requires");
var product_launch_state_changed_event_1 = require("../Events/product-launch-state-changed-event");
var TelemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var product_launch_state_1 = require("../interfaces/product-launch-state");
var InstallerActions_1 = require("./InstallerActions");
var clear_pending_product_launches_event_1 = require("../Events/clear-pending-product-launches-event");
var AutolaunchActions = /** @class */ (function () {
    function AutolaunchActions(dispatcher, telemetry) {
        requires.notNullOrUndefined(dispatcher, "dispatcher");
        requires.notNullOrUndefined(telemetry, "telemetry");
        this._dispatcher = dispatcher;
        this._telemetry = telemetry;
    }
    AutolaunchActions.prototype.updateProductLaunchState = function (product, shouldLaunch) {
        this._telemetry.sendIpcAtomicEvent(TelemetryEventNames.TOGGLE_AUTOLAUNCH, true, /* isUserTask */ { checkboxState: shouldLaunch ? "checked" : "unchecked" });
        var launchState = shouldLaunch ?
            product_launch_state_1.ProductLaunchState.LaunchAfterInstall :
            product_launch_state_1.ProductLaunchState.None;
        this._dispatcher.dispatch(new product_launch_state_changed_event_1.ProductLaunchStateChangedEvent(product, launchState));
    };
    AutolaunchActions.prototype.launchProducts = function (products, telemetryContext) {
        var _this = this;
        if (products && products.length > 0) {
            this._dispatcher.dispatch(new clear_pending_product_launches_event_1.ClearPendingProductLaunchesEvent());
            return new Promise(function (resolve, reject) {
                products.forEach(function (product) {
                    telemetryContext = _this.ensureTelemetryContextForLaunch(telemetryContext);
                    InstallerActions_1.launch(product, telemetryContext);
                });
                resolve();
            });
        }
        // No products to launch, just return a resolved promise.
        return Promise.resolve();
    };
    AutolaunchActions.prototype.ensureTelemetryContextForLaunch = function (telemetryContext) {
        if (!telemetryContext) {
            telemetryContext = {};
        }
        telemetryContext.userRequestedOperation = "launch";
        telemetryContext.initiatedFromCommandLine = false;
        telemetryContext.isAutolaunch = true;
        return telemetryContext;
    };
    return AutolaunchActions;
}());
exports.AutolaunchActions = AutolaunchActions;
//# sourceMappingURL=autolaunch-actions.js.map