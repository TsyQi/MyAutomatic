/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("./requires");
var InstallerState = /** @class */ (function () {
    function InstallerState(runningOperation, installedProducts, installingProducts, uninstallingProducts, partialInstalls) {
        requires.notNullOrUndefined(runningOperation, "runningOperation");
        requires.notNullOrUndefined(installedProducts, "installedProducts");
        requires.notNullOrUndefined(installingProducts, "installingProducts");
        requires.notNullOrUndefined(uninstallingProducts, "uninstallingProducts");
        requires.notNullOrUndefined(partialInstalls, "partialInstalls");
        this._installedProducts = installedProducts;
        this._installingProducts = installingProducts;
        this._uninstallingProducts = uninstallingProducts;
        this._partialInstalls = partialInstalls;
        this._runningOperation = runningOperation;
    }
    Object.defineProperty(InstallerState.prototype, "installedProducts", {
        get: function () {
            return this._installedProducts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerState.prototype, "installingProducts", {
        get: function () {
            return this._installingProducts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerState.prototype, "uninstallingProducts", {
        get: function () {
            return this._uninstallingProducts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerState.prototype, "partialInstalls", {
        get: function () {
            return this._partialInstalls;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerState.prototype, "runningOperation", {
        get: function () {
            return this._runningOperation;
        },
        enumerable: true,
        configurable: true
    });
    return InstallerState;
}());
exports.InstallerState = InstallerState;
//# sourceMappingURL=InstallerState.js.map