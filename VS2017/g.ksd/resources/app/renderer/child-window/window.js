/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../../lib/requires");
var RendererChildWindow = /** @class */ (function () {
    function RendererChildWindow(window, options) {
        requires.notNullOrUndefined(options, "options");
        this._options = options;
        this._electronWindow = window.open(this._targetUrl, this.windowTitle, this.optionsToString());
    }
    Object.defineProperty(RendererChildWindow.prototype, "closed", {
        get: function () {
            return this._electronWindow.closed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RendererChildWindow.prototype, "windowTitle", {
        get: function () {
            return this._options.title;
        },
        enumerable: true,
        configurable: true
    });
    RendererChildWindow.prototype.blur = function () {
        this._electronWindow.blur();
    };
    RendererChildWindow.prototype.close = function () {
        this._electronWindow.close();
    };
    RendererChildWindow.prototype.focus = function () {
        this._electronWindow.focus();
    };
    Object.defineProperty(RendererChildWindow.prototype, "_targetUrl", {
        get: function () {
            return this._options.url;
        },
        enumerable: true,
        configurable: true
    });
    RendererChildWindow.prototype.optionsToString = function () {
        var options = [];
        options.push(this.boolOptionToStringPart("resizable", this._options.resizable));
        options.push(this.numberOptionToStringPart("height", this._options.height));
        options.push(this.numberOptionToStringPart("width", this._options.width));
        return options.filter(function (part) { return part.length > 0; }).join(",");
    };
    RendererChildWindow.prototype.numberOptionToStringPart = function (property, value) {
        if (typeof value === "number") {
            return property + "=" + value;
        }
        return "";
    };
    /**
     * Boolean options in a "browser option string" is either 1 or 0, as opposed to truthy or falsey.
     * @param property {string} - The name of the option.
     * @param value {boolean} - The value of the option as a boolean.
     */
    RendererChildWindow.prototype.boolOptionToStringPart = function (property, value) {
        if (typeof value === "boolean") {
            return property + "=" + (value ? "1" : "0");
        }
        return "";
    };
    return RendererChildWindow;
}());
exports.RendererChildWindow = RendererChildWindow;
//# sourceMappingURL=window.js.map