/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var installer_status_1 = require("../../lib/Installer/installer-status");
exports.InstallerStatus = installer_status_1.InstallerStatus;
var requires = require("../../lib/requires");
var InstallerStatusChangedEvent = /** @class */ (function () {
    function InstallerStatusChangedEvent(status) {
        requires.notNullOrUndefined(status, "status");
        this._status = status;
    }
    Object.defineProperty(InstallerStatusChangedEvent.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    return InstallerStatusChangedEvent;
}());
exports.InstallerStatusChangedEvent = InstallerStatusChangedEvent;
//# sourceMappingURL=installer-status-changed-event.js.map