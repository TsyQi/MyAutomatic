/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var DriveSpaceEvaluation = /** @class */ (function () {
    function DriveSpaceEvaluation(currentInstallSize, requestedDeltaSize, hasSufficientDiskSpace, driveName) {
        requires.isInteger(currentInstallSize, "currentInstallSize");
        requires.isInteger(requestedDeltaSize, "requestedDeltaSize");
        requires.notNullOrUndefined(hasSufficientDiskSpace, "hasSufficientDiskSpace");
        requires.stringNotEmpty(driveName, "driveName");
        this._currentInstallSize = currentInstallSize;
        this._requestedDeltaSize = requestedDeltaSize;
        this._hasSufficientDiskSpace = hasSufficientDiskSpace;
        this._driveName = driveName;
    }
    Object.defineProperty(DriveSpaceEvaluation.prototype, "currentInstallSize", {
        get: function () {
            return this._currentInstallSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriveSpaceEvaluation.prototype, "requestedDeltaSize", {
        get: function () {
            return this._requestedDeltaSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriveSpaceEvaluation.prototype, "hasSufficientDiskSpace", {
        get: function () {
            return this._hasSufficientDiskSpace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DriveSpaceEvaluation.prototype, "driveName", {
        get: function () {
            return this._driveName;
        },
        enumerable: true,
        configurable: true
    });
    return DriveSpaceEvaluation;
}());
exports.DriveSpaceEvaluation = DriveSpaceEvaluation;
//# sourceMappingURL=drive-space-evaluation.js.map