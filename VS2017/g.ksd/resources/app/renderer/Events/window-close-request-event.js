/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Event to represent the client is requesting that the window be closed.
 */
var WindowCloseRequestEvent = /** @class */ (function () {
    function WindowCloseRequestEvent() {
        this._defaultPrevented = false;
    }
    Object.defineProperty(WindowCloseRequestEvent.prototype, "defaultPrevented", {
        get: function () {
            return this._defaultPrevented;
        },
        enumerable: true,
        configurable: true
    });
    WindowCloseRequestEvent.prototype.preventDefault = function () {
        this._defaultPrevented = true;
    };
    return WindowCloseRequestEvent;
}());
exports.WindowCloseRequestEvent = WindowCloseRequestEvent;
//# sourceMappingURL=window-close-request-event.js.map