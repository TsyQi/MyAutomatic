/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FeedbackInfoProvider = /** @class */ (function () {
    function FeedbackInfoProvider(info) {
        this._info = info;
    }
    FeedbackInfoProvider.prototype.getInfo = function () {
        return Promise.resolve(this._info);
    };
    return FeedbackInfoProvider;
}());
exports.FeedbackInfoProvider = FeedbackInfoProvider;
//# sourceMappingURL=feedback-info.js.map