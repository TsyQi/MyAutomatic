/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ModifyStartedEvent = /** @class */ (function () {
    function ModifyStartedEvent(product) {
        this._product = product;
    }
    Object.defineProperty(ModifyStartedEvent.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    return ModifyStartedEvent;
}());
exports.ModifyStartedEvent = ModifyStartedEvent;
//# sourceMappingURL=ModifyStartedEvent.js.map