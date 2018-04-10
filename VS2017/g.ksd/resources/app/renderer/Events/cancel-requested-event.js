/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CancelRequestedEvent = /** @class */ (function () {
    function CancelRequestedEvent(installationPath) {
        this._installationPath = installationPath;
    }
    Object.defineProperty(CancelRequestedEvent.prototype, "installationPath", {
        get: function () {
            return this._installationPath;
        },
        enumerable: true,
        configurable: true
    });
    return CancelRequestedEvent;
}());
exports.CancelRequestedEvent = CancelRequestedEvent;
//# sourceMappingURL=cancel-requested-event.js.map