/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InstalledProductSummaryResult = /** @class */ (function () {
    function InstalledProductSummaryResult(productSummary, error) {
        this._productSummary = productSummary;
        this._error = error;
    }
    Object.defineProperty(InstalledProductSummaryResult.prototype, "productSummary", {
        /**
         * Gets the product summary. Can be null if we fail to convert from RPC.
         */
        get: function () {
            return this._productSummary;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummaryResult.prototype, "error", {
        /**
         * Gets the error thrown while getting the installed product summary.
         * Will be error if no error was thrown.
         */
        get: function () {
            return this._error || null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstalledProductSummaryResult.prototype, "hasError", {
        get: function () {
            return !!this._error;
        },
        enumerable: true,
        configurable: true
    });
    return InstalledProductSummaryResult;
}());
exports.InstalledProductSummaryResult = InstalledProductSummaryResult;
//# sourceMappingURL=installed-product-summary-result.js.map