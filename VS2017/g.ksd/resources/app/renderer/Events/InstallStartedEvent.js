/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InstallStartedEvent = /** @class */ (function () {
    function InstallStartedEvent(product, nickname, installationPath) {
        this._product = product;
        this._nickname = nickname;
        this._installPath = installationPath;
    }
    Object.defineProperty(InstallStartedEvent.prototype, "product", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallStartedEvent.prototype, "nickname", {
        get: function () {
            return this._nickname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallStartedEvent.prototype, "installationPath", {
        get: function () {
            return this._installPath;
        },
        enumerable: true,
        configurable: true
    });
    return InstallStartedEvent;
}());
exports.InstallStartedEvent = InstallStartedEvent;
//# sourceMappingURL=InstallStartedEvent.js.map