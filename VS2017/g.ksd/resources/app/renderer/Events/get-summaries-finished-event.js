/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GetSummariesFinishedEvent = /** @class */ (function () {
    function GetSummariesFinishedEvent(products, installations, parseFailReason, timedOut) {
        if (parseFailReason === void 0) { parseFailReason = null; }
        if (timedOut === void 0) { timedOut = false; }
        this._products = products;
        this._installations = installations;
        this._channelsParseFailReason = parseFailReason;
        this._timedOut = timedOut;
    }
    Object.defineProperty(GetSummariesFinishedEvent.prototype, "products", {
        get: function () {
            return this._products;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetSummariesFinishedEvent.prototype, "installations", {
        get: function () {
            return this._installations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetSummariesFinishedEvent.prototype, "channelsParseFailReason", {
        get: function () {
            return this._channelsParseFailReason;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetSummariesFinishedEvent.prototype, "timedOut", {
        get: function () {
            return this._timedOut;
        },
        enumerable: true,
        configurable: true
    });
    return GetSummariesFinishedEvent;
}());
exports.GetSummariesFinishedEvent = GetSummariesFinishedEvent;
//# sourceMappingURL=get-summaries-finished-event.js.map