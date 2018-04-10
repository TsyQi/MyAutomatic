/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TelemetryProxy_1 = require("../Telemetry/TelemetryProxy");
var TelemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var Session_1 = require("../../lib/Session");
var vs_telemetry_api_1 = require("vs-telemetry-api");
var TAB_PROPERTY_NAME = "tab";
var NEXT_TAB_PROPERTY_NAME = "nextTab";
var TabSwitchTelemetryProxy = /** @class */ (function () {
    function TabSwitchTelemetryProxy(telemetryProxyImpl) {
        this._lastTabId = "default tab";
        this._telemetryProxy = telemetryProxyImpl;
    }
    TabSwitchTelemetryProxy.prototype.focusGained = function (runningOperation) {
        var properties = {
            runningOperation: runningOperation,
        };
        this._lastFocusEventId = Session_1.createSessionId();
        this._telemetryProxy.sendIpcStartUserTask(TelemetryEventNames.WINDOW_FOCUS_EVENT, this._lastFocusEventId, properties);
    };
    TabSwitchTelemetryProxy.prototype.focusLost = function (runningOperation) {
        var properties = {
            runningOperation: runningOperation,
        };
        this._telemetryProxy.sendIpcEndUserTask(TelemetryEventNames.WINDOW_FOCUS_EVENT, this._lastFocusEventId, properties, vs_telemetry_api_1.TelemetryResult.Success);
    };
    TabSwitchTelemetryProxy.prototype.tabSwitched = function (nextTab, installerState) {
        var props = {
            runningOperation: installerState.runningOperation,
        };
        props[TAB_PROPERTY_NAME] = nextTab.tabID;
        this._lastTabId = nextTab.tabID;
        this.addProductProperties(props, installerState);
        this.sendTabSwitchTelemetry(props);
    };
    TabSwitchTelemetryProxy.prototype.addProductProperties = function (props, installerState) {
        if (!props) {
            props = {};
        }
        if (installerState.installedProducts) {
            installerState.installedProducts.forEach(function (product, i) {
                props["installedProducts." + (i + 1)] = product;
            });
        }
        if (installerState.installingProducts) {
            installerState.installingProducts.forEach(function (product, i) {
                props["installingProducts." + (i + 1)] = product;
            });
        }
        if (installerState.uninstallingProducts) {
            installerState.uninstallingProducts.forEach(function (product, i) {
                props["uninstallingProducts." + (i + 1)] = product;
            });
        }
        if (installerState.partialInstalls) {
            installerState.partialInstalls.forEach(function (product, i) {
                props["partialInstalls." + (i + 1)] = product;
            });
        }
    };
    TabSwitchTelemetryProxy.prototype.sendTabSwitchTelemetry = function (startProperties, endProperties) {
        // If the start event has the tab property, set it as the next tab on the previous end event.
        if (startProperties[TAB_PROPERTY_NAME]) {
            endProperties = endProperties || {};
            endProperties[NEXT_TAB_PROPERTY_NAME] = startProperties[TAB_PROPERTY_NAME];
        }
        this._telemetryProxy.sendIpcEndUserTask(TelemetryEventNames.SELECT_TAB, this._lastTabSwitchEventId, endProperties, vs_telemetry_api_1.TelemetryResult.Success);
        this._lastTabSwitchEventId = Session_1.createSessionId();
        this._telemetryProxy.sendIpcStartUserTask(TelemetryEventNames.SELECT_TAB, this._lastTabSwitchEventId, startProperties);
    };
    return TabSwitchTelemetryProxy;
}());
exports.TabSwitchTelemetryProxy = TabSwitchTelemetryProxy;
exports.tabSwitchTelemetryProxy = new TabSwitchTelemetryProxy(TelemetryProxy_1.telemetryProxy);
//# sourceMappingURL=TabSwitchTelemetryProxy.js.map