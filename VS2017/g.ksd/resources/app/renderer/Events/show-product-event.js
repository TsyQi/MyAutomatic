/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShowProductEvent = /** @class */ (function () {
    function ShowProductEvent(channelId, productId) {
        this._channelId = channelId;
        this._productId = productId;
    }
    Object.defineProperty(ShowProductEvent.prototype, "channelId", {
        get: function () {
            return this._channelId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowProductEvent.prototype, "productId", {
        get: function () {
            return this._productId;
        },
        enumerable: true,
        configurable: true
    });
    return ShowProductEvent;
}());
exports.ShowProductEvent = ShowProductEvent;
//# sourceMappingURL=show-product-event.js.map