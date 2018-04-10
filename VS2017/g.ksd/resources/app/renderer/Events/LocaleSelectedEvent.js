/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocaleSelectedEvent = /** @class */ (function () {
    function LocaleSelectedEvent(locale, isChecked) {
        this._locale = locale;
        this._isChecked = isChecked;
    }
    Object.defineProperty(LocaleSelectedEvent.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocaleSelectedEvent.prototype, "isChecked", {
        get: function () {
            return this._isChecked;
        },
        enumerable: true,
        configurable: true
    });
    return LocaleSelectedEvent;
}());
exports.LocaleSelectedEvent = LocaleSelectedEvent;
//# sourceMappingURL=LocaleSelectedEvent.js.map