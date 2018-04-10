/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requires = require("../requires");
var ClientInfo = /** @class */ (function () {
    function ClientInfo(name, version, locale, serializedTelemetrySession, campaignId) {
        requires.stringNotEmpty(name, "name");
        requires.stringNotEmpty(locale, "locale");
        this._name = name;
        this._version = version;
        this._locale = locale;
        this._serializedTelemetrySession = serializedTelemetrySession;
        this._campaignId = campaignId;
    }
    Object.defineProperty(ClientInfo.prototype, "campaignId", {
        get: function () {
            return this._campaignId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClientInfo.prototype, "serializedTelemetrySession", {
        get: function () {
            return this._serializedTelemetrySession;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClientInfo.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClientInfo.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClientInfo.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    return ClientInfo;
}());
exports.ClientInfo = ClientInfo;
//# sourceMappingURL=client-info.js.map