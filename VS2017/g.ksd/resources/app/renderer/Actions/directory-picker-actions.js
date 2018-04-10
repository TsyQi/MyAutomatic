/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var FileSystem_1 = require("../../lib/FileSystem");
function openBrowseDialog() {
    return electron_1.ipcRenderer.sendSync("browse-dialog", FileSystem_1.selectWindowsProgramFilesDir());
}
exports.openBrowseDialog = openBrowseDialog;
//# sourceMappingURL=directory-picker-actions.js.map