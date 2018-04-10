/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var remote_settings_1 = require("../remote-settings");
/**
 * Adapts a {IServiceHubRemoteSettingsClient} to the Remote Settings interface.
 */
var ServiceHubRemoteSettingsAdapter = /** @class */ (function () {
    function ServiceHubRemoteSettingsAdapter(service, defaultSettings) {
        this._service = service;
        this._defaultSettings = defaultSettings;
    }
    ServiceHubRemoteSettingsAdapter.prototype.getValue = function (collectionPath, key, valueType) {
        // Settings weren't properly loaded
        if (this._defaultSettings.parseFailed) {
            return Promise.resolve(null);
        }
        var defaultValue = this._defaultSettings.getValue(collectionPath, key);
        if (valueType === undefined || valueType === null) {
            valueType = this.getValueType(defaultValue);
        }
        if (valueType === remote_settings_1.RemoteSettingsValueType.Number) {
            return this._service.getNumberValue(collectionPath, key, defaultValue);
        }
        else if (valueType === remote_settings_1.RemoteSettingsValueType.Boolean) {
            return this._service.getBooleanValue(collectionPath, key, defaultValue);
        }
        return this._service.getStringValue(collectionPath, key, defaultValue);
    };
    ServiceHubRemoteSettingsAdapter.prototype.getValueType = function (value) {
        if (typeof value === "number") {
            return remote_settings_1.RemoteSettingsValueType.Number;
        }
        else if (typeof value === "boolean") {
            return remote_settings_1.RemoteSettingsValueType.Boolean;
        }
        else {
            return remote_settings_1.RemoteSettingsValueType.String;
        }
    };
    return ServiceHubRemoteSettingsAdapter;
}());
exports.ServiceHubRemoteSettingsAdapter = ServiceHubRemoteSettingsAdapter;
//# sourceMappingURL=remote-settings-adapter.js.map