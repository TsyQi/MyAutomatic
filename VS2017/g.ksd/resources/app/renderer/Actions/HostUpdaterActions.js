/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatcher_1 = require("../dispatcher");
var HostUpdaterProxy_1 = require("../HostUpdaterProxy");
var HostUpdaterEvents_1 = require("../../main/HostUpdaterEvents");
var HostUpdaterStatusChangedEvent_1 = require("../Events/HostUpdaterStatusChangedEvent");
var hostUpdaterProxy = new HostUpdaterProxy_1.HostUpdaterProxy();
hostUpdaterProxy.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_AVAILABLE, onUpdateAvailable);
hostUpdaterProxy.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOADING, onUpdateDownloading);
hostUpdaterProxy.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOADED, onUpdateDownloaded);
hostUpdaterProxy.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOAD_FAILED, onUpdateDownloadFailed);
function installerUpdateRequired() {
    dispatch(HostUpdaterStatusChangedEvent_1.HostUpdaterStatus.UpdateAvailable, { isRequired: true });
}
exports.installerUpdateRequired = installerUpdateRequired;
function onUpdateAvailable(args) {
    dispatch(HostUpdaterStatusChangedEvent_1.HostUpdaterStatus.UpdateAvailable, args);
}
function onUpdateDownloading(args) {
    dispatch(HostUpdaterStatusChangedEvent_1.HostUpdaterStatus.UpdateDownloading, args);
}
function onUpdateDownloaded(args) {
    dispatch(HostUpdaterStatusChangedEvent_1.HostUpdaterStatus.UpdateDownloaded, args);
}
function onUpdateDownloadFailed(args) {
    dispatch(HostUpdaterStatusChangedEvent_1.HostUpdaterStatus.UpdateDownloadFailed, args);
}
function dispatch(status, details) {
    console.log("dispatch.HostUpdaterStatusChangedEvent: [status: " + status + ", args: " + JSON.stringify(details) + "]");
    var event = new HostUpdaterStatusChangedEvent_1.HostUpdaterStatusChangedEvent(status, details.isRequired, details.error);
    dispatcher_1.dispatcher.dispatch(event);
}
function installUpdate(passCurrentArgs) {
    hostUpdaterProxy.quitAndInstallUpdate(passCurrentArgs);
}
exports.installUpdate = installUpdate;
//# sourceMappingURL=HostUpdaterActions.js.map