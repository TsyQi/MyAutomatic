/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var InstalledProductErrors = /** @class */ (function () {
    function InstalledProductErrors(failedPackages, skippedPackageIds, hasCorePackageFailures, logFilePath) {
        requires.notNullOrUndefined(failedPackages, "failedPackages");
        requires.notNullOrUndefined(skippedPackageIds, "skippedPackageIds");
        requires.notNullOrUndefined(hasCorePackageFailures, "hasCorePackageFailures");
        requires.notNullOrUndefined(logFilePath, "logFilePath");
        this._hasCorePackageFailures = hasCorePackageFailures;
        this._failedPackages = failedPackages;
        this._skippedPackageIds = skippedPackageIds;
        this._logFilePath = logFilePath;
    }
    Object.defineProperty(InstalledProductErrors.prototype, "hasCorePackageFailures", {
        get: function () {
            return this._hasCorePackageFailures;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductErrors.prototype, "failedPackages", {
        get: function () {
            return this._failedPackages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductErrors.prototype, "failedPackageIds", {
        get: function () {
            return this._failedPackages.map(function (p) { return p.id; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductErrors.prototype, "skippedPackageIds", {
        get: function () {
            return this._skippedPackageIds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductErrors.prototype, "hasErrors", {
        get: function () {
            return this._failedPackages.length > 0
                || this._skippedPackageIds.length > 0
                || this._hasCorePackageFailures;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductErrors.prototype, "logFilePath", {
        get: function () {
            return this._logFilePath;
        },
        enumerable: true,
        configurable: true
    });
    return InstalledProductErrors;
}());
exports.InstalledProductErrors = InstalledProductErrors;
//# sourceMappingURL=installed-product-errors.js.map