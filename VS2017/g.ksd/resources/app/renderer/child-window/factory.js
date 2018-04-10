/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var window_1 = require("./window");
var requires_1 = require("../../lib/requires");
var RendererChildWindowFactory = /** @class */ (function () {
    function RendererChildWindowFactory(window) {
        requires_1.notNullOrUndefined(window, "window");
        this._window = window;
    }
    /* istanbul ignore next */
    RendererChildWindowFactory.getInstance = function () {
        // window is not defined when running unit tests
        return new RendererChildWindowFactory(window);
    };
    RendererChildWindowFactory.prototype.create = function (options) {
        return new window_1.RendererChildWindow(this._window, options);
    };
    return RendererChildWindowFactory;
}());
exports.RendererChildWindowFactory = RendererChildWindowFactory;
//# sourceMappingURL=factory.js.map