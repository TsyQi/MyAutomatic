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
var errors_1 = require("../lib/errors");
var Logger_1 = require("../lib/Logger");
var CommandLine_1 = require("../lib/CommandLine");
var HostUpdaterEvents_1 = require("./HostUpdaterEvents");
var string_utilities_1 = require("../lib/string-utilities");
var logger = Logger_1.getLogger();
/**
 * HostUpdaterImpl adapts the InstallerUpdater interface to the events and methods
 * that have already been integrated as the HostUpdater interface.
 */
var HostUpdaterImpl = /** @class */ (function (_super) {
    __extends(HostUpdaterImpl, _super);
    function HostUpdaterImpl(installerUpdater, hostArgs, finalizeInstallArg) {
        var _this = _super.call(this) || this;
        _this._installerUpdater = installerUpdater;
        _this._finalizeInstallArg = finalizeInstallArg;
        _this._hostArgs = hostArgs;
        _this._installerUpdater.onInstallerUpdateRequired(_this.onInstallerUpdateRequired.bind(_this));
        return _this;
    }
    Object.defineProperty(HostUpdaterImpl.prototype, "updateRequired", {
        get: function () {
            return this._installerUpdater.installerUpdateRequired;
        },
        enumerable: true,
        configurable: true
    });
    HostUpdaterImpl.prototype.update = function (passCurrentArgs) {
        var _this = this;
        if (this._updatePromise) {
            return this._updatePromise;
        }
        if (!this.updateRequired) {
            return Promise.reject(new Error("HostUpdater.update must not be called if an update is not required"));
        }
        logger.writeVerbose("Installing the update");
        logger.writeVerbose("Checking for complete update preperation");
        this.prepareForUpdate();
        return this._updatePromise = this._prepareForUpatePromise
            .then(function () {
            logger.writeVerbose("Notifying clients before starting the update");
            var deferrals = [];
            _this.emitUpdateStarting(deferrals);
            return Promise.all(deferrals)
                .then(function () {
                logger.writeVerbose("Completed notifying all clients that the update is starting");
                var args = _this.getBootstrapperArguments(passCurrentArgs);
                return _this._installerUpdater.updateInstaller(args)
                    .then(function () {
                    _this.emitUpdateStarted();
                });
            })
                .catch(function (error) {
                logger.writeError("A notified client rejected the start of the update" +
                    ("[error.name: " + error.name + ", error.message: " + error.message + "]"));
                _this._installerUpdater.cancelInstallerUpdate()
                    .then(function () {
                    logger.writeVerbose("Successfully cancelled installer update");
                })
                    .catch(function (innerError) {
                    logger.writeError("Error cancelling the installer update.\n [error: " + innerError.toString() + "]");
                });
                throw error;
            });
        })
            .catch(function (error) {
            _this._updatePromise = null;
            logger.writeError("HostUpdater.installUpdate error preparing to start an update" +
                ("[error.name: " + error.name + ", error.message: " + error.message + "]"));
            throw error;
        });
    };
    HostUpdaterImpl.prototype.getBootstrapperArguments = function (passCurrentArgs) {
        var _this = this;
        var hostArgs = passCurrentArgs ? this._hostArgs.slice() : [this._finalizeInstallArg];
        if (passCurrentArgs && !hostArgs.find(function (arg) { return string_utilities_1.caseInsensitiveAreEqual(arg, _this._finalizeInstallArg); })) {
            // add "/finalizeInstall" parameter to update ARP and registry entries
            hostArgs.push(this._finalizeInstallArg);
        }
        this.filterArguments(hostArgs);
        return string_utilities_1.argsAsString(hostArgs);
    };
    HostUpdaterImpl.prototype.filterArguments = function (args) {
        // Arguments(with values) to filter out: --pipe
        var index = args.findIndex(function (arg) { return string_utilities_1.caseInsensitiveAreEqual(arg, ("--" + CommandLine_1.OptionNames.pipe)); });
        if (index !== -1) {
            args.splice(index, 2);
        }
    };
    HostUpdaterImpl.prototype.onInstallerUpdateRequired = function () {
        if (this._prepareForUpatePromise) {
            return;
        }
        if (this._updatePromise) {
            return;
        }
        logger.writeVerbose("The installer has an update required");
        this.emitUpdateAvailable();
        this.prepareForUpdate();
    };
    HostUpdaterImpl.prototype.prepareForUpdate = function () {
        var _this = this;
        if (this._prepareForUpatePromise) {
            return;
        }
        logger.writeVerbose("Preparing to perform the update");
        this.emitUpdateDownloading();
        this._prepareForUpatePromise = this._installerUpdater.prepareForInstallerUpdate();
        this._prepareForUpatePromise
            .then(function () {
            logger.writeVerbose("Completed the update preperation");
            _this.emitUpdateDownloaded();
        })
            .catch(function (error) {
            _this._prepareForUpatePromise = null;
            _this.emitUpdateDownloadFailed(error);
        });
    };
    HostUpdaterImpl.prototype.emitUpdateAvailable = function () {
        this.emit(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_AVAILABLE, this.getUpdateDetails());
    };
    HostUpdaterImpl.prototype.emitUpdateDownloading = function () {
        this.emit(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOADING, this.getUpdateDetails());
    };
    HostUpdaterImpl.prototype.emitUpdateDownloaded = function () {
        this.emit(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOADED, this.getUpdateDetails());
    };
    HostUpdaterImpl.prototype.emitUpdateDownloadFailed = function (error) {
        logger.writeError("Failed to download the update package. " +
            ("[error.name: " + error.name + ", error.message: \"" + error.message + "\"]"));
        this.emit(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_DOWNLOAD_FAILED, this.getUpdateDetails(error));
    };
    HostUpdaterImpl.prototype.emitUpdateStarting = function (deferrals) {
        logger.writeVerbose("HostUpdater.emitUpdateStarting");
        this.emit(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_STARTING, { details: this.getUpdateDetails(), deferrals: deferrals });
    };
    HostUpdaterImpl.prototype.emitUpdateStarted = function () {
        this.emit(HostUpdaterEvents_1.HostUpdaterEvents.UPDATE_STARTED, this.getUpdateDetails());
    };
    HostUpdaterImpl.prototype.getUpdateDetails = function (error) {
        if (error) {
            logger.writeError("Failed to update the version details. [error: " + error.message + " at " + error.stack + "]");
        }
        var customError = error instanceof errors_1.CustomErrorBase ? error : null;
        return {
            isRequired: this.updateRequired,
            error: customError
        };
    };
    return HostUpdaterImpl;
}(events_1.EventEmitter));
function create(installerUpdater, hostArgs, finalizeInstallArg) {
    return new HostUpdaterImpl(installerUpdater, hostArgs, finalizeInstallArg);
}
exports.create = create;
//# sourceMappingURL=HostUpdater.js.map