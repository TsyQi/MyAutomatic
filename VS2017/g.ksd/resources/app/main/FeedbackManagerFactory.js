/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var Logger_1 = require("../lib/Logger");
var FeedbackManager_1 = require("./FeedbackManager");
var VSFeedbackIdentityProvider_1 = require("./VSFeedbackIdentityProvider");
var logger = Logger_1.getLogger();
var FEEDBACK_TIMEOUT = 1000; // Timeout in ms
function createFeedbackManager(vsTelemetryListener, installedProductLogProvider, exeName, exeVersion, branch, culture, uiCulture) {
    return VSFeedbackIdentityProvider_1.createVSFeedbackIdentityProvider(vsTelemetryListener).then(function (identityProvider) {
        var feedbackManager = FeedbackManager_1.createFeedbackManagerWithIdentityProvider(identityProvider, vsTelemetryListener, installedProductLogProvider, logger, exeName, exeVersion, branch, culture, uiCulture);
        electron_1.ipcMain.on("open-feedback-client", function (event, channelIds, initialSearchText, initialReproText, additionalTags) {
            feedbackManager.addChannelIds(channelIds);
            feedbackManager.openFeedbackClient(FEEDBACK_TIMEOUT, null, additionalTags || [], initialSearchText, initialReproText);
        });
        return feedbackManager;
    });
}
exports.createFeedbackManager = createFeedbackManager;
//# sourceMappingURL=FeedbackManagerFactory.js.map