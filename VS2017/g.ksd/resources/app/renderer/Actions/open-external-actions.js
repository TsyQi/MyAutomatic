/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var open_external_1 = require("../../lib/open-external");
var fallbackReleaseNotesUrl = "https://aka.ms/vs/15/release-notes";
function openReleaseNotesUrl(releaseNotesUrl) {
    // Backwards compatibility: Older products won't have a release notes uri
    if (releaseNotesUrl) {
        open_external_1.openExternal(releaseNotesUrl);
    }
    else {
        open_external_1.openExternal(fallbackReleaseNotesUrl);
    }
}
exports.openReleaseNotesUrl = openReleaseNotesUrl;
//# sourceMappingURL=open-external-actions.js.map