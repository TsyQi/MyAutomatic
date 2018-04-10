/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var Telemetry_1 = require("../lib/Telemetry/Telemetry");
var LocalAppDataStore_1 = require("../lib/LocalAppDataStore");
var json_file_store_1 = require("../lib/json-file-store");
var locale_handler_1 = require("../lib/locale-handler");
var _userData;
/**
 * This must be called after the app "ready" event.
 */
function getUserDataStore() {
    if (_userData) {
        return _userData;
    }
    if (!electron_1.app.isReady()) {
        throw new Error("getUserDataStore must be called after app 'ready' event.");
    }
    // get path to userData provided by electron
    var userDataDir = electron_1.app.getPath("userData");
    var userDataFileName = "user.json";
    var userDataFilePath = path.join(userDataDir, userDataFileName);
    return _userData = new LocalAppDataStore_1.UserDataStore(new json_file_store_1.JSONFileStore(userDataFilePath), locale_handler_1.LocaleHandler.getSupportedLocale(electron_1.app.getLocale()), Telemetry_1.telemetry);
}
exports.getUserDataStore = getUserDataStore;
//# sourceMappingURL=user-data-store-factory.js.map