/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../lib/requires");
var ResourceStrings_1 = require("../lib/ResourceStrings");
var Product_1 = require("../lib/Installer/Product");
var ProgressDisplayType;
(function (ProgressDisplayType) {
    ProgressDisplayType[ProgressDisplayType["Install"] = 0] = "Install";
    ProgressDisplayType[ProgressDisplayType["Download"] = 1] = "Download";
    ProgressDisplayType[ProgressDisplayType["Uninstall"] = 2] = "Uninstall";
    ProgressDisplayType[ProgressDisplayType["PausingDownload"] = 3] = "PausingDownload";
    ProgressDisplayType[ProgressDisplayType["PausingInstall"] = 4] = "PausingInstall";
})(ProgressDisplayType = exports.ProgressDisplayType || (exports.ProgressDisplayType = {}));
var ProgressCalculator = /** @class */ (function () {
    function ProgressCalculator(store) {
        requires.notNullOrUndefined(store, "store");
        this.store = store;
    }
    ProgressCalculator.prototype.getProgressInfo = function (installationPath, progressType) {
        var progressDetail = this.getProgressEvent(installationPath, progressType);
        if (!progressDetail) {
            return new Product_1.ProgressInfo(0, 0, 0, 0, 0);
        }
        return progressDetail.progressInfo;
    };
    ProgressCalculator.prototype.getPackageId = function (installationPath, progressType) {
        var progressDetail = this.getProgressEvent(installationPath, progressType);
        if (!progressDetail) {
            return "";
        }
        return progressDetail.detail;
    };
    ProgressCalculator.prototype.getProgressMessage = function (installationPath, progressType) {
        var progressDetail = this.getProgressEvent(installationPath, progressType);
        if (!progressDetail || !progressDetail.detail) {
            return this.getStartingMessage(progressType);
        }
        if (progressDetail && progressDetail.progress >= 1) {
            return this.getCompletedMessage(progressType);
        }
        return this.getRegularMessage(progressType, progressDetail.detail);
    };
    ProgressCalculator.prototype.getProgress = function (installationPath, progressType) {
        var progressDetail = this.getProgressEvent(installationPath, progressType);
        if (progressDetail && progressDetail.progress && !isNaN(progressDetail.progress)) {
            return progressDetail.progress;
        }
        return 0;
    };
    Object.defineProperty(ProgressCalculator.prototype, "uninstallAllProgress", {
        get: function () {
            var progressDetail = this.store.uninstallAllProgress;
            if (progressDetail && progressDetail.progress && !isNaN(progressDetail.progress)) {
                return progressDetail.progress;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressCalculator.prototype, "uninstallAllMessage", {
        get: function () {
            var progressDetail = this.store.uninstallAllProgress;
            var progressDisplayType = ProgressDisplayType.Uninstall;
            if (!progressDetail || !progressDetail.detail) {
                return this.getStartingMessage(progressDisplayType);
            }
            if (progressDetail && progressDetail.progress >= 1) {
                return this.getCompletedMessage(progressDisplayType);
            }
            return this.getRegularMessage(progressDisplayType, progressDetail.detail);
        },
        enumerable: true,
        configurable: true
    });
    ProgressCalculator.prototype.getProgressEvent = function (installationPath, progressType) {
        switch (progressType) {
            case ProgressDisplayType.Download:
            case ProgressDisplayType.PausingDownload:
                return this.store.getDownloadProgressByInstallationPath(installationPath);
            case ProgressDisplayType.Install:
            case ProgressDisplayType.Uninstall:
            case ProgressDisplayType.PausingInstall:
                return this.store.getInstallProgressByInstallationPath(installationPath);
        }
    };
    ProgressCalculator.prototype.getStartingMessage = function (progressType) {
        switch (progressType) {
            case ProgressDisplayType.PausingDownload:
            case ProgressDisplayType.PausingInstall:
                return ResourceStrings_1.ResourceStrings.pausingOperation;
            case ProgressDisplayType.Download:
            case ProgressDisplayType.Install:
            case ProgressDisplayType.Uninstall:
                return ResourceStrings_1.ResourceStrings.startingOperation;
        }
    };
    ProgressCalculator.prototype.getCompletedMessage = function (progressType) {
        switch (progressType) {
            case ProgressDisplayType.Download:
                return ResourceStrings_1.ResourceStrings.finishedAcquiringPackages;
            case ProgressDisplayType.Install:
            case ProgressDisplayType.Uninstall:
                return ResourceStrings_1.ResourceStrings.finishing;
            case ProgressDisplayType.PausingDownload:
                return ResourceStrings_1.ResourceStrings.downloadsStopped;
            case ProgressDisplayType.PausingInstall:
                return ResourceStrings_1.ResourceStrings.pausingOperation;
        }
    };
    ProgressCalculator.prototype.getRegularMessage = function (progressType, details) {
        switch (progressType) {
            case ProgressDisplayType.Download:
                return ResourceStrings_1.ResourceStrings.acquiringPackageMessage;
            case ProgressDisplayType.Install:
                return ResourceStrings_1.ResourceStrings.applyingPackageMessage(details);
            case ProgressDisplayType.Uninstall:
                return ResourceStrings_1.ResourceStrings.uninstallingPackageMessage(details);
            case ProgressDisplayType.PausingDownload:
                return ResourceStrings_1.ResourceStrings.downloadsStopped;
            case ProgressDisplayType.PausingInstall:
                return ResourceStrings_1.ResourceStrings.waitingForPackageMessage(details);
        }
    };
    return ProgressCalculator;
}());
exports.ProgressCalculator = ProgressCalculator;
//# sourceMappingURL=progress-calculator.js.map