"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WindowState = /** @class */ (function () {
    function WindowState(maximized) {
        if (maximized === void 0) { maximized = false; }
        this._maximized = maximized;
    }
    Object.defineProperty(WindowState.prototype, "maximized", {
        get: function () {
            return this._maximized;
        },
        set: function (maximized) {
            this._maximized = maximized;
        },
        enumerable: true,
        configurable: true
    });
    WindowState.prototype.equals = function (windowState) {
        return this._maximized === windowState.maximized;
    };
    return WindowState;
}());
exports.WindowState = WindowState;
var WindowStateChangedEvent = /** @class */ (function () {
    function WindowStateChangedEvent(windowState) {
        this._windowState = windowState;
    }
    Object.defineProperty(WindowStateChangedEvent.prototype, "windowState", {
        get: function () {
            return this._windowState;
        },
        enumerable: true,
        configurable: true
    });
    return WindowStateChangedEvent;
}());
exports.WindowStateChangedEvent = WindowStateChangedEvent;
//# sourceMappingURL=WindowStateChangedEvent.js.map