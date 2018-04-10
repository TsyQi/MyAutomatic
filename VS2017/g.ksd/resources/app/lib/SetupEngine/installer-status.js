/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
/**
 * Describes Installer status state that will prevent it from performing an
 * installation operation.
 */
var InstallerStatus = /** @class */ (function () {
    function InstallerStatus(parameters) {
        requires.notNullOrUndefined(parameters, "parameters");
        requires.notNullOrUndefined(parameters.isDisposed, "parameters.isDisposed");
        requires.notNullOrUndefined(parameters.rebootRequired, "parameters.rebootRequired");
        requires.notNullOrUndefined(parameters.installationOperationRunning, "parameters.installationOperationRunning");
        requires.notNullOrUndefined(parameters.blockingProcessNames, "parameters.blockingProcessNames");
        this._isDisposed = parameters.isDisposed;
        this._rebootRequired = parameters.rebootRequired;
        this._installationOperationRunning = parameters.installationOperationRunning;
        this._blockingProcessNames = parameters.blockingProcessNames;
    }
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
    return InstallerStatus;
}());
exports.InstallerStatus = InstallerStatus;
//# sourceMappingURL=installer-status.js.map