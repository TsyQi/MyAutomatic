/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RepairStartedEvent = /** @class */ (function () {
    function RepairStartedEvent(product) {
        this._product = product;
    }
    Object.defineProperty(RepairStartedEvent.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    return RepairStartedEvent;
}());
exports.RepairStartedEvent = RepairStartedEvent;
//# sourceMappingURL=RepairStartedEvent.js.map