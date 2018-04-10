/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var window_action_constants_1 = require("../../lib/window-action-constants");
var PendingAppClosure = /** @class */ (function () {
    function PendingAppClosure(success, isAppClosurePending, exitCode) {
        this._success = success;
        this._isAppClosurePending = isAppClosurePending;
        this._exitCode = exitCode;
    }
    Object.defineProperty(PendingAppClosure, "exitCodeRebootRequested", {
        get: function () {
            return window_action_constants_1.EXIT_CODE_REBOOT_REQUESTED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PendingAppClosure, "exitCodeRebootRequired", {
        get: function () {
            return window_action_constants_1.EXIT_CODE_REBOOT_REQUIRED;
        },
        enumerable: true,
        configurable: true
    });
    PendingAppClosure.CreateNull = function () {
        return new PendingAppClosure(true, false, undefined);
    };
    Object.defineProperty(PendingAppClosure.prototype, "success", {
        get: function () {
            return this._success;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PendingAppClosure.prototype, "isAppClosurePending", {
        get: function () {
            return this._isAppClosurePending;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PendingAppClosure.prototype, "exitCode", {
        get: function () {
            return this._exitCode;
        },
        enumerable: true,
        configurable: true
    });
    return PendingAppClosure;
}());
exports.PendingAppClosure = PendingAppClosure;
//# sourceMappingURL=pending-app-closure.js.map