/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RepeatingTimeout = /** @class */ (function () {
    /**
     * @param dueTime The period before the first call in milliseconds.
     * @param period The period between calls in milliseconds.
     * @param callback The callback invoked when a timeout occurs.
     *   The callback must return false to stop the repeating callbacks; otherwise,
     *   the RepeatingTimeout will continue.
     */
    function RepeatingTimeout(dueTime, period, callback) {
        var _this = this;
        this._period = period;
        this._callback = callback;
        this._running = dueTime >= 0;
        if (this._running) {
            this._timer = setTimeout(function () { return _this.onTimeout(); }, dueTime);
        }
    }
    /**
     * Stops the repeating timeouts.
     */
    RepeatingTimeout.prototype.stop = function () {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        this._running = false;
    };
    /**
     * Starts the repeating timeouts.
     * @param dueTime The due time of the first callback after start. The default is 0 milliseconds.
     */
    RepeatingTimeout.prototype.start = function (dueTime) {
        var _this = this;
        if (dueTime === void 0) { dueTime = 0; }
        if (!this._timer) {
            this._timer = setTimeout(function () { return _this.onTimeout(); }, dueTime);
        }
        this._running = true;
    };
    /**
     * Changes the period of the repeating timeouts.
     * @param callback The callback invoked when a timeout occurs.
     */
    RepeatingTimeout.prototype.change = function (period) {
        if (period === this._period) {
            return;
        }
        this.stop();
        this._period = period;
        this.start();
    };
    /**
     * Now causes the timeout to happen immediately.
     */
    RepeatingTimeout.prototype.now = function () {
        this.stop();
        this.start();
    };
    Object.defineProperty(RepeatingTimeout.prototype, "isRunning", {
        /**
         * Returns a boolean indicating whether the repeating timeout is running.
         */
        get: function () {
            return this._running;
        },
        enumerable: true,
        configurable: true
    });
    RepeatingTimeout.prototype.onTimeout = function () {
        var _this = this;
        if (this._callback() !== false) {
            this._timer = setTimeout(function () { return _this.onTimeout(); }, this._period);
            return;
        }
        this._timer = null;
        this._running = false;
    };
    return RepeatingTimeout;
}());
exports.RepeatingTimeout = RepeatingTimeout;
//# sourceMappingURL=RepeatingTimeout.js.map