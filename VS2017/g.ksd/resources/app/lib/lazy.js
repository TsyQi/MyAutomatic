/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("./requires");
var Lazy = /** @class */ (function () {
    function Lazy(initializer) {
        requires.notNullOrUndefined(initializer, "initializer");
        this._inizializer = initializer;
    }
    Object.defineProperty(Lazy.prototype, "value", {
        get: function () {
            if (!this._value) {
                this._value = this._inizializer();
            }
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return Lazy;
}());
exports.Lazy = Lazy;
//# sourceMappingURL=lazy.js.map