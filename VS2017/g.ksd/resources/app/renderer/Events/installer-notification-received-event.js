/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InstallerNotificationReceivedEvent = /** @class */ (function () {
    function InstallerNotificationReceivedEvent(installPath, message) {
        this._installPath = installPath;
        this._message = message;
    }
    Object.defineProperty(InstallerNotificationReceivedEvent.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallerNotificationReceivedEvent.prototype, "installPath", {
        get: function () {
            return this._installPath;
        },
        enumerable: true,
        configurable: true
    });
    return InstallerNotificationReceivedEvent;
}());
exports.InstallerNotificationReceivedEvent = InstallerNotificationReceivedEvent;
//# sourceMappingURL=installer-notification-received-event.js.map