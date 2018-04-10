"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var vs_telemetry_api_1 = require("vs-telemetry-api");
var telemetryEventNames = require("../../lib/Telemetry/TelemetryEventNames");
var TelemetryProxy_1 = require("../Telemetry/TelemetryProxy");
function sendChannelInfoTelemetry(channelIds) {
    // Send all channel IDs separated by commas
    var properties = {
        channels: channelIds.join(","),
    };
    TelemetryProxy_1.telemetryProxy.sendIpcAtomicEvent(telemetryEventNames.CHANNEL_INFO, false, /* isUserTask */ properties, vs_telemetry_api_1.TelemetryResult.Success, "Received channel info");
}
exports.sendChannelInfoTelemetry = sendChannelInfoTelemetry;
function sendElevationRequiredTelemetry() {
    TelemetryProxy_1.telemetryProxy.sendIpcAtomicEvent(telemetryEventNames.ELEVATION_REQUIRED, false /* isUserTask */);
}
exports.sendElevationRequiredTelemetry = sendElevationRequiredTelemetry;
//# sourceMappingURL=app-store-telemetry-actions.js.map