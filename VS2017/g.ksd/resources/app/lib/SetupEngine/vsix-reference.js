/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../../lib/requires");
var VsixReference = /** @class */ (function () {
    function VsixReference(uri) {
        requires.stringNotEmpty(uri, "uri");
        this._uri = uri;
    }
    Object.defineProperty(VsixReference.prototype, "uri", {
        get: function () {
            return this._uri;
        },
        enumerable: true,
        configurable: true
    });
    return VsixReference;
}());
exports.VsixReference = VsixReference;
//# sourceMappingURL=vsix-reference.js.map