/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HostUpdaterStatus;
(function (HostUpdaterStatus) {
    HostUpdaterStatus[HostUpdaterStatus["Pending"] = 0] = "Pending";
    HostUpdaterStatus[HostUpdaterStatus["UpdateNotAvailable"] = 1] = "UpdateNotAvailable";
    HostUpdaterStatus[HostUpdaterStatus["UpdateAvailable"] = 2] = "UpdateAvailable";
    HostUpdaterStatus[HostUpdaterStatus["UpdateDownloading"] = 3] = "UpdateDownloading";
    HostUpdaterStatus[HostUpdaterStatus["UpdateDownloaded"] = 4] = "UpdateDownloaded";
    HostUpdaterStatus[HostUpdaterStatus["UpdateDownloadFailed"] = 5] = "UpdateDownloadFailed";
})(HostUpdaterStatus = exports.HostUpdaterStatus || (exports.HostUpdaterStatus = {}));
var HostUpdaterStatusChangedEvent = /** @class */ (function () {
    function HostUpdaterStatusChangedEvent(status, isRequired, error) {
        if (error === void 0) { error = null; }
        this._status = status;
        this._isRequired = isRequired;
        this._error = error;
    }
    Object.defineProperty(HostUpdaterStatusChangedEvent.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostUpdaterStatusChangedEvent.prototype, "isRequired", {
        get: function () {
            return this._isRequired;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HostUpdaterStatusChangedEvent.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    HostUpdaterStatusChangedEvent.prototype.equals = function (event) {
        return this._status === event.status &&
            this._isRequired === event.isRequired &&
            this._error === event.error;
    };
    return HostUpdaterStatusChangedEvent;
}());
exports.HostUpdaterStatusChangedEvent = HostUpdaterStatusChangedEvent;
//# sourceMappingURL=HostUpdaterStatusChangedEvent.js.map