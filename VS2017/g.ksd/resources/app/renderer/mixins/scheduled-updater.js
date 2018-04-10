/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RafScheduler = /** @class */ (function () {
    function RafScheduler(windowInstance) {
        this._rafId = null;
        this._window = windowInstance;
    }
    RafScheduler.prototype.schedule = function (func) {
        var _this = this;
        this.clear();
        this._rafId = this._window.requestAnimationFrame(function (time) {
            func();
            _this._rafId = null;
        });
    };
    RafScheduler.prototype.clear = function () {
        if (this._rafId != null) {
            this._window.cancelAnimationFrame(this._rafId);
        }
        this._rafId = null;
    };
    return RafScheduler;
}());
exports.RafScheduler = RafScheduler;
var ScheduledUpdater = /** @class */ (function () {
    function ScheduledUpdater() {
    }
    /**
     * Emits a standard DOM "change" event.
     */
    ScheduledUpdater.prototype.scheduleUpdate = function () {
        var _this = this;
        if (!this._updater) {
            this._updater = new RafScheduler(window);
        }
        this._updater.schedule(function () { return _this.update(); });
    };
    return ScheduledUpdater;
}());
exports.ScheduledUpdater = ScheduledUpdater;
//# sourceMappingURL=scheduled-updater.js.map