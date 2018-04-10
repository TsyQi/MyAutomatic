/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var ChannelInfo = /** @class */ (function () {
    function ChannelInfo(id, name, description, suffix, isPrerelease) {
        requires.stringNotEmpty(id, "id");
        requires.notNullOrUndefined(suffix, "suffix");
        requires.notNullOrUndefined(isPrerelease, "isPrerelease");
        this._id = id;
        this._name = name;
        this._description = description;
        this._suffix = suffix;
        this._isPrerelease = isPrerelease;
    }
    Object.defineProperty(ChannelInfo.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelInfo.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelInfo.prototype, "description", {
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelInfo.prototype, "suffix", {
        get: function () {
            return this._suffix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChannelInfo.prototype, "isPrerelease", {
        get: function () {
            return this._isPrerelease;
        },
        enumerable: true,
        configurable: true
    });
    return ChannelInfo;
}());
exports.ChannelInfo = ChannelInfo;
//# sourceMappingURL=channel-info.js.map