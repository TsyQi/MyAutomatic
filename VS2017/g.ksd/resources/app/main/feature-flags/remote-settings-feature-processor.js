/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RemoteSettingsUtil = require("../../lib/remote-settings/remote-settings-util");
var remote_settings_1 = require("../../lib/remote-settings/remote-settings");
var RemoteSettingsFeatureProcessor = /** @class */ (function () {
    function RemoteSettingsFeatureProcessor(remoteSettingsPromise) {
        this._remoteSettingsPromsise = remoteSettingsPromise;
    }
    RemoteSettingsFeatureProcessor.prototype.process = function (remoteSettingsPath) {
        var _this = this;
        if (this._remoteSettings) {
            return this.getValue(this._remoteSettings, remoteSettingsPath);
        }
        return this._remoteSettingsPromsise
            .then(function (remoteSettings) {
            _this._remoteSettings = remoteSettings;
            return _this.getValue(_this._remoteSettings, remoteSettingsPath);
        });
    };
    RemoteSettingsFeatureProcessor.prototype.getValue = function (remoteSettings, remoteSettingsPath) {
        var collectionPath = RemoteSettingsUtil.remoteSettingsPathToCollectionPath(remoteSettingsPath);
        var key = RemoteSettingsUtil.remoteSettingsPathToKey(remoteSettingsPath);
        return remoteSettings.getValue(collectionPath, key, remote_settings_1.RemoteSettingsValueType.Boolean);
    };
    return RemoteSettingsFeatureProcessor;
}());
exports.RemoteSettingsFeatureProcessor = RemoteSettingsFeatureProcessor;
//# sourceMappingURL=remote-settings-feature-processor.js.map