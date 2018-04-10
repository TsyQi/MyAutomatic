/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShowViewProblemsEvent = /** @class */ (function () {
    function ShowViewProblemsEvent(product, log, topFailedPackages) {
        this._product = product;
        this._log = log;
        this._topFailedPackages = topFailedPackages;
    }
    Object.defineProperty(ShowViewProblemsEvent.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowViewProblemsEvent.prototype, "log", {
        get: function () {
            return this._log;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShowViewProblemsEvent.prototype, "topFailedPackages", {
        get: function () {
            return this._topFailedPackages;
        },
        enumerable: true,
        configurable: true
    });
    return ShowViewProblemsEvent;
}());
exports.ShowViewProblemsEvent = ShowViewProblemsEvent;
var HideViewProblemsEvent = /** @class */ (function () {
    function HideViewProblemsEvent() {
    }
    return HideViewProblemsEvent;
}());
exports.HideViewProblemsEvent = HideViewProblemsEvent;
//# sourceMappingURL=view-problems-events.js.map