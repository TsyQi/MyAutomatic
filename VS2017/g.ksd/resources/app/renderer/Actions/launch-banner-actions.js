/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dispatcher_1 = require("../dispatcher");
var launch_banner_closed_event_1 = require("../Events/launch-banner-closed-event");
function closeLaunchBanner() {
    dispatcher_1.dispatcher.dispatch(new launch_banner_closed_event_1.LaunchBannerClosedEvent());
}
exports.closeLaunchBanner = closeLaunchBanner;
//# sourceMappingURL=launch-banner-actions.js.map