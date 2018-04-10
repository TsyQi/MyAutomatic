/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InstallProgressEvent = /** @class */ (function () {
    function InstallProgressEvent(installationPath, type, progress, detail, progressInfo) {
        this._installationPath = installationPath;
        this._type = type;
        this._progress = progress;
        this._detail = detail;
        this._progressInfo = progressInfo;
    }
    Object.defineProperty(InstallProgressEvent.prototype, "installationPath", {
        get: function () {
            return this._installationPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallProgressEvent.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallProgressEvent.prototype, "progress", {
        get: function () {
            return this._progress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallProgressEvent.prototype, "detail", {
        get: function () {
            return this._detail;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallProgressEvent.prototype, "progressInfo", {
        get: function () {
            return this._progressInfo;
        },
        enumerable: true,
        configurable: true
    });
    return InstallProgressEvent;
}());
exports.InstallProgressEvent = InstallProgressEvent;
//# sourceMappingURL=InstallProgressEvent.js.map