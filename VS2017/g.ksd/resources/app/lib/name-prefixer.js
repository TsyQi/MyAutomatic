/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("./requires");
var NamePrefixer = /** @class */ (function () {
    function NamePrefixer(prefixParts, separator) {
        requires.arrayNotNullorUndefinedorEmpty(prefixParts, "prefixParts");
        // Array.join uses a comma if the separator is undefined, so we match the action.
        this._separator = separator || ",";
        this._prefix = prefixParts.join(this._separator);
    }
    Object.defineProperty(NamePrefixer.prototype, "prefix", {
        get: function () {
            return this._prefix;
        },
        enumerable: true,
        configurable: true
    });
    NamePrefixer.prototype.getPrefixedName = function (name) {
        return "" + this._prefix + this._separator + name;
    };
    return NamePrefixer;
}());
exports.NamePrefixer = NamePrefixer;
//# sourceMappingURL=name-prefixer.js.map