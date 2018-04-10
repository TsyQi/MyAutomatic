/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var remote_settings_1 = require("./remote-settings");
function createCollectionPath(collectionPath, key) {
    return collectionPath ? "" + collectionPath + remote_settings_1.remoteSettingsPathSeparator + key : key;
}
exports.createCollectionPath = createCollectionPath;
function remoteSettingsPathToCollectionPath(settingPath) {
    var keyStartIndex = settingPath.lastIndexOf(remote_settings_1.remoteSettingsPathSeparator) + 1;
    return settingPath.substring(0, keyStartIndex);
}
exports.remoteSettingsPathToCollectionPath = remoteSettingsPathToCollectionPath;
function remoteSettingsPathToKey(settingPath) {
    var keyStartIndex = settingPath.lastIndexOf(remote_settings_1.remoteSettingsPathSeparator) + 1;
    return settingPath.substring(keyStartIndex);
}
exports.remoteSettingsPathToKey = remoteSettingsPathToKey;
//# sourceMappingURL=remote-settings-util.js.map