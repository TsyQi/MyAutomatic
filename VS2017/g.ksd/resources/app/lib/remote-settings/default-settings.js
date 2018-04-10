/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var remote_settings_util_1 = require("./remote-settings-util");
var remote_settings_1 = require("./remote-settings");
var Logger_1 = require("../Logger");
/**
 * Helper class for parsing default settings file.
 */
var DefaultSettings = /** @class */ (function () {
    function DefaultSettings(defaultSettingsJson) {
        this._parseFailed = false;
        try {
            this._defaultSettings = [];
            this._settingsObject = JSON.parse(defaultSettingsJson);
            // Convert json object into array of Remote Setting rules.
            this.traverseObject(this._settingsObject, "");
        }
        catch (e) {
            Logger_1.getLogger().writeError("Failed to parse local settings with error: " + JSON.stringify(e));
            this._settingsObject = undefined;
            this._parseFailed = true;
        }
    }
    Object.defineProperty(DefaultSettings.prototype, "parseFailed", {
        get: function () {
            return this._parseFailed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the value stored in the settings json object
     * @param collectionPath A path in the form of path\to\key
     * @param key The key for the value that is being queried
     */
    DefaultSettings.prototype.getValue = function (collectionPath, key) {
        // Remove trailling backslash if applicable
        if (collectionPath.endsWith(remote_settings_1.remoteSettingsPathSeparator)) {
            collectionPath = collectionPath.slice(0, -1);
        }
        // Split the path into tokens to index into our setting object
        var settingKeys = collectionPath.split(remote_settings_1.remoteSettingsPathSeparator);
        var settings = this._settingsObject;
        while (settings && settingKeys.length > 0) {
            settings = settings[settingKeys.shift()];
        }
        if (settings) {
            var value = settings[key];
            if (value !== undefined && typeof value !== "object") {
                return value;
            }
        }
        return null;
    };
    DefaultSettings.prototype.getDefaultSettings = function () {
        return this._defaultSettings;
    };
    DefaultSettings.prototype.traverseObject = function (settingsObject, collectionPath) {
        var _this = this;
        Object.keys(settingsObject).forEach(function (key) {
            var value = settingsObject[key];
            if (typeof value === "object" && !!value) {
                var updatedCollectionPath = remote_settings_util_1.createCollectionPath(collectionPath, key);
                _this.traverseObject(value, updatedCollectionPath);
            }
            else {
                _this._defaultSettings.push({
                    collectionPath: collectionPath,
                    key: key,
                    value: value
                });
            }
        });
    };
    return DefaultSettings;
}());
exports.DefaultSettings = DefaultSettings;
//# sourceMappingURL=default-settings.js.map