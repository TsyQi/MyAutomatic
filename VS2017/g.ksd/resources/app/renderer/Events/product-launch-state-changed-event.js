/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProductLaunchStateChangedEvent = /** @class */ (function () {
    function ProductLaunchStateChangedEvent(product, launchState) {
        this._product = product;
        this._launchState = launchState;
    }
    Object.defineProperty(ProductLaunchStateChangedEvent.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductLaunchStateChangedEvent.prototype, "launchState", {
        get: function () {
            return this._launchState;
        },
        enumerable: true,
        configurable: true
    });
    return ProductLaunchStateChangedEvent;
}());
exports.ProductLaunchStateChangedEvent = ProductLaunchStateChangedEvent;
//# sourceMappingURL=product-launch-state-changed-event.js.map