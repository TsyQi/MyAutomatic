/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var path_1 = require("path");
var ResourceStrings_1 = require("../../lib/ResourceStrings");
exports.DEEP_CLEAN_EXECUTABLE_PATH = path_1.join(path_1.dirname(path_1.dirname(__dirname)), "layout", "installcleanup.exe");
exports.DEEP_CLEAN_COMMAND_LINE = "START \"" + ResourceStrings_1.ResourceStrings.uninstallPreviewTitle + "\" \"" + exports.DEEP_CLEAN_EXECUTABLE_PATH + "\"";
function deepCleanPreviewInstallations() {
    return new Promise(function (resolve, reject) {
        child_process_1.exec(exports.DEEP_CLEAN_COMMAND_LINE, function (error) {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}
exports.deepCleanPreviewInstallations = deepCleanPreviewInstallations;
//# sourceMappingURL=deep-clean-preview-installations.js.map