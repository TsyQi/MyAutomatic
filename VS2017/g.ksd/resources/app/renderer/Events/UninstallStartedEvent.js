/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UninstallStartedEvent = /** @class */ (function () {
    function UninstallStartedEvent(product) {
        this._product = product;
    }
    Object.defineProperty(UninstallStartedEvent.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    return UninstallStartedEvent;
}());
exports.UninstallStartedEvent = UninstallStartedEvent;
//# sourceMappingURL=UninstallStartedEvent.js.map