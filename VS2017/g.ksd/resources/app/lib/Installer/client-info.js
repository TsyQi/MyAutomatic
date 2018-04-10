/*---------------------------------------------------------
* Copyright (C) Microsoft Corporation. All rights reserved.
*--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientInfo = /** @class */ (function () {
    function ClientInfo(appInfo, locale, serializedTelemetrySession, campaignId) {
        this._appInfo = appInfo;
        this._locale = locale;
        this._campaignId = campaignId || null;
        this._serializedTelemetrySession = serializedTelemetrySession;
    }
    Object.defineProperty(ClientInfo.prototype, "appInfo", {
        get: function () {
            return this._appInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClientInfo.prototype, "campaignId", {
        get: function () {
            return this._campaignId;
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
    Object.defineProperty(ClientInfo.prototype, "serializedTelemetrySession", {
        get: function () {
            return this._serializedTelemetrySession;
        },
        enumerable: true,
        configurable: true
    });
    return ClientInfo;
}());
exports.ClientInfo = ClientInfo;
//# sourceMappingURL=client-info.js.map