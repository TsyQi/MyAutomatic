/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RemoveChannelFinishedEvent = /** @class */ (function () {
    function RemoveChannelFinishedEvent(products, parseFailReason, timedOut) {
        if (parseFailReason === void 0) { parseFailReason = null; }
        if (timedOut === void 0) { timedOut = false; }
        this._products = products;
        this._channelsParseFailReason = parseFailReason;
        this._timedOut = timedOut;
    }
    Object.defineProperty(RemoveChannelFinishedEvent.prototype, "products", {
        get: function () {
            return this._products;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveChannelFinishedEvent.prototype, "channelsParseFailReason", {
        get: function () {
            return this._channelsParseFailReason;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveChannelFinishedEvent.prototype, "timedOut", {
        get: function () {
            return this._timedOut;
        },
        enumerable: true,
        configurable: true
    });
    return RemoveChannelFinishedEvent;
}());
exports.RemoveChannelFinishedEvent = RemoveChannelFinishedEvent;
//# sourceMappingURL=remove-channel-finished-event.js.map