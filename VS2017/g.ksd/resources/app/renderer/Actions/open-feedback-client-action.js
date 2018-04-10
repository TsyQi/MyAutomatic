/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
function openFeedbackClient(channelIds, initialSearchText, initialReproText, additionalTags) {
    electron_1.ipcRenderer.send("open-feedback-client", channelIds, initialSearchText, initialReproText, additionalTags);
}
exports.openFeedbackClient = openFeedbackClient;
//# sourceMappingURL=open-feedback-client-action.js.map