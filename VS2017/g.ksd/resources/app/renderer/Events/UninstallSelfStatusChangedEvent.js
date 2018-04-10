/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UninstallSelfStatusChangedEvent = /** @class */ (function () {
    /**
     * An event to report the status of the self uninstaller
     * @constructor
     * @param {string} status - One of the defined static *_STATUS values
     */
    function UninstallSelfStatusChangedEvent(status) {
        this.status = status;
    }
    UninstallSelfStatusChangedEvent.createFailedStatusChangedEvent = function () {
        return new UninstallSelfStatusChangedEvent(UninstallSelfStatusChangedEvent.FAILED_STATUS);
    };
    UninstallSelfStatusChangedEvent.createUninstallingStatusChangedEvent = function () {
        return new UninstallSelfStatusChangedEvent(UninstallSelfStatusChangedEvent.UNINSTALLING_STATUS);
    };
    UninstallSelfStatusChangedEvent.createBlockedByRunningInstanceStatusChangedEvent = function () {
        return new UninstallSelfStatusChangedEvent(UninstallSelfStatusChangedEvent.BLOCKED_BY_RUNNING_INSTANCE_STATUS);
    };
    UninstallSelfStatusChangedEvent.createInstalledStatusChangedEvent = function () {
        return new UninstallSelfStatusChangedEvent(UninstallSelfStatusChangedEvent.INSTALLED_STATUS);
    };
    UninstallSelfStatusChangedEvent.FAILED_STATUS = "failed";
    UninstallSelfStatusChangedEvent.UNINSTALLING_STATUS = "uninstalling";
    UninstallSelfStatusChangedEvent.INSTALLED_STATUS = "installed";
    UninstallSelfStatusChangedEvent.BLOCKED_BY_RUNNING_INSTANCE_STATUS = "blocked by running instance";
    return UninstallSelfStatusChangedEvent;
}());
exports.UninstallSelfStatusChangedEvent = UninstallSelfStatusChangedEvent;
//# sourceMappingURL=UninstallSelfStatusChangedEvent.js.map