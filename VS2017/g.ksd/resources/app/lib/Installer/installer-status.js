/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var ResourceStrings_1 = require("../ResourceStrings");
var errorNames = require("../../lib/error-names");
var pending_app_closure_1 = require("../../renderer/interfaces/pending-app-closure");
var InstallerStatus = /** @class */ (function () {
    function InstallerStatus(parameters) {
        requires.notNullOrUndefined(parameters, "parameters");
        requires.notNullOrUndefined(parameters.isPending, "isPending");
        requires.notNullOrUndefined(parameters.isDisposed, "parameters.isDisposed");
        requires.notNullOrUndefined(parameters.rebootRequired, "parameters.rebootRequired");
        requires.notNullOrUndefined(parameters.installationOperationRunning, "parameters.installationOperationRunning");
        requires.notNullOrUndefined(parameters.blockingProcessNames, "parameters.blockingProcessNames");
        this._isPending = parameters.isPending;
        this._isDisposed = parameters.isDisposed;
        this._rebootRequired = parameters.rebootRequired;
        this._installationOperationRunning = parameters.installationOperationRunning;
        this._blockingProcessNames = parameters.blockingProcessNames;
    }
    Object.defineProperty(InstallerStatus, "pending", {
        get: function () {
            return InstallerStatus._pendingStatus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerStatus.prototype, "isPending", {
        get: function () {
            return this._isPending;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerStatus.prototype, "isDisposed", {
        get: function () {
            return this._isDisposed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerStatus.prototype, "rebootRequired", {
        get: function () {
            return this._rebootRequired;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerStatus.prototype, "installationOperationRunning", {
        get: function () {
            return this._installationOperationRunning;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerStatus.prototype, "blockingProcessNames", {
        get: function () {
            return this._blockingProcessNames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerStatus.prototype, "blockingProcessName", {
        get: function () {
            if (this.blockingProcessNames && this.blockingProcessNames.length) {
                return this.blockingProcessNames[0];
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerStatus.prototype, "hasBlockingProcess", {
        get: function () {
            return !!this.blockingProcessName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerStatus.prototype, "blockingProcessErrorMessage", {
        get: function () {
            if (this.hasBlockingProcess) {
                return ResourceStrings_1.ResourceStrings.processIsRunningError(this.blockingProcessName);
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerStatus.prototype, "hasError", {
        get: function () {
            return this.isDisposed ||
                this.rebootRequired ||
                this.installationOperationRunning ||
                this.hasBlockingProcess;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerStatus.prototype, "errorMessage", {
        get: function () {
            var includeBlockingProcessErrors = true;
            return this.getErrorMessage(includeBlockingProcessErrors);
        },
        enumerable: true,
        configurable: true
    });
    InstallerStatus.prototype.getErrorMessage = function (includeBlockingProcessErrors) {
        var installerError = this.getErrorWithName(includeBlockingProcessErrors);
        if (installerError) {
            return installerError.message;
        }
        return null;
    };
    InstallerStatus.prototype.getErrorWithName = function (includeBlockingProcessErrors) {
        if (includeBlockingProcessErrors && this.hasBlockingProcess) {
            return {
                message: this.blockingProcessErrorMessage,
                name: errorNames.HAS_BLOCKING_PROCESS,
                exitCode: 1,
            };
        }
        if (this.rebootRequired) {
            return {
                message: ResourceStrings_1.ResourceStrings.rebootRequiredTitle,
                name: errorNames.REBOOT_REQUIRED_ERROR_NAME,
                exitCode: pending_app_closure_1.PendingAppClosure.exitCodeRebootRequired,
            };
        }
        if (this.installationOperationRunning) {
            return {
                message: ResourceStrings_1.ResourceStrings.installationOperationIsRunning,
                name: errorNames.OPERATION_IS_RUNNING_ERROR_NAME,
                exitCode: 1,
            };
        }
        if (this.isDisposed) {
            return {
                message: ResourceStrings_1.ResourceStrings.installerServiceIsDisposed,
                name: errorNames.INSTALLER_SERVICE_DISPOSED,
                exitCode: 1,
            };
        }
        return null;
    };
    InstallerStatus._pendingStatus = new InstallerStatus({
        isPending: true,
        isDisposed: false,
        rebootRequired: false,
        installationOperationRunning: false,
        blockingProcessNames: []
    });
    return InstallerStatus;
}());
exports.InstallerStatus = InstallerStatus;
//# sourceMappingURL=installer-status.js.map