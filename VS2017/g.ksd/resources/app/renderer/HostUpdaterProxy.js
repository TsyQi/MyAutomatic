/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
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
var events_1 = require("events");
var electron_1 = require("electron");
var errors_1 = require("../lib/errors");
var HostUpdaterEvents_1 = require("../main/HostUpdaterEvents");
var HostUpdaterServiceEvents_1 = require("../main/HostUpdaterServiceEvents");
var HostUpdaterProxy = /** @class */ (function (_super) {
    __extends(HostUpdaterProxy, _super);
    function HostUpdaterProxy() {
        var _this = _super.call(this) || this;
        electron_1.ipcRenderer.on(HostUpdaterServiceEvents_1.HostUpdaterServiceEvents.UPDATE_AVAILABLE, _this.onUpdateAvailable.bind(_this));
        electron_1.ipcRenderer.on(HostUpdaterServiceEvents_1.HostUpdaterServiceEvents.UPDATE_DOWNLOADING, _this.onUpdateDownloading.bind(_this));
        electron_1.ipcRenderer.on(HostUpdaterServiceEvents_1.HostUpdaterServiceEvents.UPDATE_DOWNLOADED, _this.onUpdateDownloaded.bind(_this));
        electron_1.ipcRenderer.on(HostUpdaterServiceEvents_1.HostUpdaterServiceEvents.UPDATE_DOWNLOAD_FAILED, _this.onUpdateDownloadFailed.bind(_this));
        return _this;
    }
    HostUpdaterProxy.prototype.quitAndInstallUpdate = function (passCurrentArgs) {
        electron_1.ipcRenderer.send(HostUpdaterServiceEvents_1.HostUpdaterServiceEvents.INSTALL_UPDATE, passCurrentArgs);
    };
    HostUpdaterProxy.prototype.onUpdateAvailable = function (event, args) {
        this.emit(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_AVAILABLE, args);
    };
    HostUpdaterProxy.prototype.onUpdateDownloading = function (event, args) {
        this.emit(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOADING, args);
    };
    HostUpdaterProxy.prototype.onUpdateDownloaded = function (event, args) {
        this.emit(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOADED, args);
    };
    HostUpdaterProxy.prototype.onUpdateDownloadFailed = function (event, args) {
        var deserializedArgs = {
            isRequired: args.isRequired,
        };
        var error = args.error;
        if (error) {
            try {
                deserializedArgs.error = errors_1.CustomErrorBase.fromJson(error);
            }
            catch (e) {
                deserializedArgs.error = new errors_1.InstallerError("Unrecognized error");
            }
        }
        this.emit(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOAD_FAILED, deserializedArgs);
    };
    return HostUpdaterProxy;
}(events_1.EventEmitter));
exports.HostUpdaterProxy = HostUpdaterProxy;
//# sourceMappingURL=HostUpdaterProxy.js.map