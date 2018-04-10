/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReadProgressBarEvent = /** @class */ (function () {
    function ReadProgressBarEvent(installationPath) {
        this._installationPath = installationPath;
    }
    Object.defineProperty(ReadProgressBarEvent.prototype, "installationPath", {
        get: function () {
            return this._installationPath;
        },
        enumerable: true,
        configurable: true
    });
    return ReadProgressBarEvent;
}());
exports.ReadProgressBarEvent = ReadProgressBarEvent;
//# sourceMappingURL=read-progress-bar-event.js.map