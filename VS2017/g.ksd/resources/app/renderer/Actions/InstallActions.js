/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var InstallerServiceEvents_1 = require("../../main/InstallerServiceEvents");
var UninstallSelfStatusChangedEvent_1 = require("../Events/UninstallSelfStatusChangedEvent");
var dispatcher_1 = require("../dispatcher");
electron_1.ipcRenderer.on(InstallerServiceEvents_1.InstallerServiceEvents.UNINSTALL_SELF_FAILED, function () {
    dispatcher_1.dispatcher.dispatch(UninstallSelfStatusChangedEvent_1.UninstallSelfStatusChangedEvent.createFailedStatusChangedEvent());
});
electron_1.ipcRenderer.on(InstallerServiceEvents_1.InstallerServiceEvents.UNINSTALL_SELF_STARTED, function () {
    dispatcher_1.dispatcher.dispatch(UninstallSelfStatusChangedEvent_1.UninstallSelfStatusChangedEvent.createUninstallingStatusChangedEvent());
});
electron_1.ipcRenderer.on(InstallerServiceEvents_1.InstallerServiceEvents.UNINSTALL_SELF_IS_SINGLETON, function (event, isSingleton) {
    if (isSingleton) {
        dispatcher_1.dispatcher.dispatch(UninstallSelfStatusChangedEvent_1.UninstallSelfStatusChangedEvent.createInstalledStatusChangedEvent());
    }
    else {
        dispatcher_1.dispatcher.dispatch(UninstallSelfStatusChangedEvent_1.UninstallSelfStatusChangedEvent.createBlockedByRunningInstanceStatusChangedEvent());
    }
});
function uninstallSelf() {
    electron_1.ipcRenderer.send(InstallerServiceEvents_1.InstallerServiceEvents.UNINSTALL_SELF_REQUEST);
}
exports.uninstallSelf = uninstallSelf;
//# sourceMappingURL=InstallActions.js.map