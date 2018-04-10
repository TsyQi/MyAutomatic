/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Product_1 = require("../../lib/Installer/Product");
var progress_bar_1 = require("../../lib/progress-bar");
var ProgressReporterState;
(function (ProgressReporterState) {
    ProgressReporterState[ProgressReporterState["None"] = 0] = "None";
    ProgressReporterState[ProgressReporterState["InstallRunning"] = 1] = "InstallRunning";
})(ProgressReporterState || (ProgressReporterState = {}));
var ProgressReporter = /** @class */ (function () {
    function ProgressReporter(installer, progressBar) {
        var _this = this;
        this._state = ProgressReporterState.None;
        this._installer = installer;
        this._progressBar = progressBar;
        this._installer.onProgress(function (installationPath, type, percentComplete, detail, progressInfo) {
            // Ignore progress events if no install start was detected.
            if (_this._state !== ProgressReporterState.InstallRunning) {
                return;
            }
            // Only display progress of the install (ignore download)
            if (type === Product_1.ProgressType.Install) {
                // Clamp the percentage values shown. The bar must be explicitly reset.
                if (percentComplete > 0 && percentComplete <= 1) {
                    _this._progressBar.setValue(percentComplete, { mode: progress_bar_1.ProgressBarMode.Normal });
                }
            }
        });
        this._installer.onNotification(function (installPath, message) {
            if (message.IsInstallStartingEvent()) {
                _this.installStarting();
            }
            if (message.IsInstallFinishedEvent()) {
                _this.installFinished();
            }
        });
    }
    ProgressReporter.prototype.installStarting = function () {
        if (this._state === ProgressReporterState.None) {
            this._state = ProgressReporterState.InstallRunning;
            this._progressBar.setValue(0, { mode: progress_bar_1.ProgressBarMode.Indeterminate });
        }
    };
    ProgressReporter.prototype.installFinished = function () {
        this._state = ProgressReporterState.None;
        this._progressBar.clearValue();
    };
    return ProgressReporter;
}());
exports.ProgressReporter = ProgressReporter;
//# sourceMappingURL=progress-reporter.js.map