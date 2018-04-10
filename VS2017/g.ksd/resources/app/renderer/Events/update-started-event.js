/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UpdateStartedEvent = /** @class */ (function () {
    function UpdateStartedEvent(product) {
        this._product = product;
    }
    Object.defineProperty(UpdateStartedEvent.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateStartedEvent;
}());
exports.UpdateStartedEvent = UpdateStartedEvent;
//# sourceMappingURL=update-started-event.js.map