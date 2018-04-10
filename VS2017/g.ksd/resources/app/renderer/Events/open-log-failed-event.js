/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OpenLogFailedEvent = /** @class */ (function () {
    function OpenLogFailedEvent(path) {
        this._path = path;
    }
    Object.defineProperty(OpenLogFailedEvent.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    return OpenLogFailedEvent;
}());
exports.OpenLogFailedEvent = OpenLogFailedEvent;
//# sourceMappingURL=open-log-failed-event.js.map