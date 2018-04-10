/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../../lib/requires");
var ComponentSelectedEvent = /** @class */ (function () {
    function ComponentSelectedEvent(components, options) {
        requires.notNullOrUndefined(components, "components");
        requires.notNullOrUndefined(options, "options");
        this._components = components || [];
        this._options = options;
    }
    Object.defineProperty(ComponentSelectedEvent.prototype, "components", {
        get: function () {
            return this._components;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentSelectedEvent.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    return ComponentSelectedEvent;
}());
exports.ComponentSelectedEvent = ComponentSelectedEvent;
//# sourceMappingURL=ComponentSelectedEvent.js.map