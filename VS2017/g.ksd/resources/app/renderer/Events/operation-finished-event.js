/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../../lib/requires");
var reboot_timing_1 = require("../interfaces/reboot-timing");
var OperationFinishedEvent = /** @class */ (function () {
    function OperationFinishedEvent(productSummary, nickname, installationPath, success, log, rebootTiming) {
        requires.notNullOrUndefined(productSummary, "productSummary");
        requires.stringNotEmpty(installationPath, "installationPath");
        this._productSummary = productSummary;
        this._nickname = nickname;
        this._installationPath = installationPath;
        this._success = success;
        this._log = log;
        this._rebootTiming = rebootTiming;
    }
    Object.defineProperty(OperationFinishedEvent.prototype, "log", {
        get: function () {
            return this._log;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationFinishedEvent.prototype, "success", {
        get: function () {
            return this._success;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationFinishedEvent.prototype, "nickname", {
        get: function () {
            return this._nickname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationFinishedEvent.prototype, "installationPath", {
        get: function () {
            return this._installationPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationFinishedEvent.prototype, "isRebootRequired", {
        get: function () {
            return this._rebootTiming !== reboot_timing_1.RebootTiming.None;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationFinishedEvent.prototype, "rebootTiming", {
        get: function () {
            return this._rebootTiming;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperationFinishedEvent.prototype, "productName", {
        get: function () {
            return this._productSummary.name;
        },
        enumerable: true,
        configurable: true
    });
    return OperationFinishedEvent;
}());
exports.OperationFinishedEvent = OperationFinishedEvent;
//# sourceMappingURL=operation-finished-event.js.map