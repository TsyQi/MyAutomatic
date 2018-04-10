/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <disable>JS2055</disable>
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var errors_1 = require("../lib/errors");
var HostUpdaterEvents_1 = require("./HostUpdaterEvents");
var HostUpdaterServiceEvents_1 = require("./HostUpdaterServiceEvents");
var Logger_1 = require("../lib/Logger");
var logger = Logger_1.getLogger();
var HostUpdaterService = /** @class */ (function () {
    function HostUpdaterService(eventSender, hostUpdater) {
        if (!eventSender) {
            throw new Error("eventSender must be a valid reference");
        }
        if (!hostUpdater) {
            throw new Error("hostUpdater must be a valid reference");
        }
        this._eventSender = eventSender;
        this._hostUpdater = hostUpdater;
        this._hostUpdater.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_AVAILABLE, this.onUpdateAvailable.bind(this));
        this._hostUpdater.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOADING, this.onUpdateDownloading.bind(this));
        this._hostUpdater.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOADED, this.onUpdateDownloaded.bind(this));
        this._hostUpdater.on(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOAD_FAILED, this.onUpdateDownloadFailed.bind(this));
        electron_1.ipcMain.on(HostUpdaterServiceEvents_1.HostUpdaterServiceEvents.INSTALL_UPDATE, this.onInstallUpdate.bind(this));
    }
    HostUpdaterService.prototype.onUpdateAvailable = function (args) {
        this.sendEvent(HostUpdaterServiceEvents_1.HostUpdaterServiceEvents.UPDATE_AVAILABLE, args);
    };
    HostUpdaterService.prototype.onUpdateDownloading = function (args) {
        this.sendEvent(HostUpdaterServiceEvents_1.HostUpdaterServiceEvents.UPDATE_DOWNLOADING, args);
    };
    HostUpdaterService.prototype.onUpdateDownloaded = function (args) {
        this.sendEvent(HostUpdaterServiceEvents_1.HostUpdaterServiceEvents.UPDATE_DOWNLOADED, args);
    };
    HostUpdaterService.prototype.onUpdateDownloadFailed = function (args) {
        this.sendEvent(HostUpdaterServiceEvents_1.HostUpdaterServiceEvents.UPDATE_DOWNLOAD_FAILED, args);
    };
    HostUpdaterService.prototype.sendEvent = function (event, args) {
        var serializedArgs = {
            isRequired: args.isRequired,
        };
        if (args.error instanceof errors_1.CustomErrorBase) {
            serializedArgs.error = args.error.toJson();
        }
        this._eventSender.trySend(event, serializedArgs);
    };
    HostUpdaterService.prototype.onInstallUpdate = function (event, passCurrentArgs) {
        logger.writeVerbose("HostUpdaterService.onInstallUpdate [passCurrentArgs: " + passCurrentArgs + "]");
        this._hostUpdater.update(passCurrentArgs)
            .catch(function (error) {
            logger.writeError("HostUpdaterService.onInstallUpdate failed, [error: " + error.message);
        });
    };
    return HostUpdaterService;
}());
exports.HostUpdaterService = HostUpdaterService;
//# sourceMappingURL=HostUpdaterService.js.map