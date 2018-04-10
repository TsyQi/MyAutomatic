/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Debounce a function so that it is called only once per intervalMs.
 * If there are multiple calls before intervalMs is elapsed, the function will
 * be called once immediately, and again after intervalMs with the most recent
 * parameters.
 * @param cb Function to debounce
 * @param intervalMs the minimum interval between calls
 */
function debounce(cb, intervalMs) {
    var tracker = new FunctionDebouncer(cb, intervalMs);
    return (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        tracker.invoke(args);
    });
}
exports.debounce = debounce;
var FunctionDebouncer = /** @class */ (function () {
    function FunctionDebouncer(cb, intervalMs) {
        var _this = this;
        this._lastCallTime = -1;
        this._cb = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this._lastCallTime = Date.now();
            cb.apply(void 0, args);
        };
        this._intervalMs = intervalMs;
    }
    FunctionDebouncer.prototype.invoke = function (args) {
        var _this = this;
        this._nextCallArgs = args;
        if (!this._timeout) {
            var remainingTimeout = this.getRemainingTimeout();
            if (remainingTimeout === 0) {
                this._cb.apply(this, this._nextCallArgs);
            }
            else {
                this._timeout = setTimeout(function () {
                    _this._cb.apply(_this, _this._nextCallArgs);
                    _this._timeout = null;
                }, remainingTimeout);
            }
        }
    };
    FunctionDebouncer.prototype.getRemainingTimeout = function () {
        if (this._lastCallTime === -1) {
            return 0;
        }
        var elapsedTime = Date.now() - this._lastCallTime;
        return Math.max(this._intervalMs - elapsedTime, 0);
    };
    return FunctionDebouncer;
}());
//# sourceMappingURL=debounce.js.map