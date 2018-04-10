/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TabSwitchTelemetryProxy_1 = require("../Telemetry/TabSwitchTelemetryProxy");
var InstallerState_1 = require("../../lib/InstallerState");
function sendTabSwitchTelemetry(nextTab, installedProducts, installingProducts, uninstallingProducts, partialInstalls, runningOperation) {
    var installerState = new InstallerState_1.InstallerState(runningOperation, installedProducts, installingProducts, uninstallingProducts, partialInstalls);
    TabSwitchTelemetryProxy_1.tabSwitchTelemetryProxy.tabSwitched(nextTab, installerState);
}
exports.sendTabSwitchTelemetry = sendTabSwitchTelemetry;
function sendFocusGained(runningOperation) {
    TabSwitchTelemetryProxy_1.tabSwitchTelemetryProxy.focusGained(runningOperation);
}
exports.sendFocusGained = sendFocusGained;
function sendFocusLost(runningOperation) {
    TabSwitchTelemetryProxy_1.tabSwitchTelemetryProxy.focusLost(runningOperation);
}
exports.sendFocusLost = sendFocusLost;
//# sourceMappingURL=TabSwitchAction.js.map